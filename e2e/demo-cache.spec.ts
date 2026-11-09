import { test, expect, type Page } from '@playwright/test';

// デモの「キャッシュ」節（Weiwudi の Service Worker・タイルキャッシュの公開 API）の試験。
// C1〜C9 と C12 は実際の Service Worker と盛岡の手元のタイルを使う（時計は偽にしない）。
// C10〜C11 は Core が失敗を握りつぶす状況を、メソッドの差し替えと page.clock で決定的に再現する。

const MORIOKA = '/?region=morioka';
const FETCH = '#cache-fetch';
const CLEAR = '#cache-clear';

const errorsOf = (page: Page): string[] => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  return errors;
};

const waitDemo = async (page: Page): Promise<void> => {
  await page.waitForFunction(() => (window as any).__MAPLAT_DEMO_APP__, undefined, { timeout: 60000 });
  await page.waitForSelector('#demo-cache', { timeout: 30000 });
};

const openDemo = async (page: Page, url = MORIOKA): Promise<void> => {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await waitDemo(page);
};

const registrations = (page: Page) =>
  page.evaluate(async () => {
    if (!navigator.serviceWorker) return [] as string[];
    const regs = await navigator.serviceWorker.getRegistrations();
    return regs.map((r) => (r.active ?? r.waiting ?? r.installing)?.scriptURL ?? '');
  });

const sizeText = async (page: Page): Promise<number> => Number((await page.locator('#cache-size').textContent()) ?? 'NaN');

const fetchAllAndWait = async (page: Page): Promise<void> => {
  await expect(page.locator(FETCH)).toBeEnabled({ timeout: 30000 });
  await page.locator(FETCH).click();
  await expect(page.locator('#cache-result')).toContainText('finish', { timeout: 90000 });
};

// 偽の時計を入れて、アプリの準備が済んでから止める。runFor で区切って進める
const openWithClock = async (page: Page): Promise<void> => {
  await page.clock.install();
  await openDemo(page);
  await expect(page.locator(FETCH)).toBeEnabled({ timeout: 30000 });
  const now = await page.evaluate(() => Date.now());
  await page.clock.pauseAt(now + 10_000);
};

// 取得のメソッドを、コールバックを保持して一度も呼ばないものに替える
const stubFetchHold = (page: Page) =>
  page.evaluate(() => {
    const w = window as any;
    w.__cbs = [];
    w.__cancelCalls = 0;
    const app = w.__MAPLAT_DEMO_APP__;
    app.fetchAllMapTileCacheAsync = async (_id: string, cb: unknown) => {
      w.__cbs.push(cb);
    };
    app.cancelMapTileCacheAsync = async () => {
      w.__cancelCalls++;
    };
  });

const historyCount = (page: Page) => page.locator('#event-log li').count();

test.describe('デモのタイルキャッシュ（実 Service Worker）', () => {
  test.setTimeout(180000);

  test('C1: /weiwudi-sw.js が Service Worker として配られる', async ({ request }) => {
    const res = await request.get('/weiwudi-sw.js');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('text/javascript');
    const text = await res.text();
    expect((text.match(/process\.env/g) ?? []).length).toBe(0);
    expect((text.match(/registerRoute/g) ?? []).length).toBeGreaterThanOrEqual(1);
  });

  test('C2: キャッシュ有効で起動し、節が出る', async ({ page }) => {
    const errors = errorsOf(page);
    await openDemo(page);
    const state = await page.evaluate(() => {
      const app = (window as any).__MAPLAT_DEMO_APP__;
      const mapID = app.currentMapInfo().mapID;
      return { enableCache: app.enableCache, enabled: app.getMapCacheEnable(mapID) };
    });
    expect(state.enableCache).toBe(true);
    expect(state.enabled).toBe(true);
    await expect(page.locator('#demo-cache')).toBeVisible();
    await expect(page.locator('#cache-app')).toContainText('有効');
    const regs = await registrations(page);
    expect(regs.length).toBe(1);
    expect(regs[0]).toContain('weiwudi-sw.js');
    expect(errors).toEqual([]);
  });

  test('C3・C4: 全タイルを取得 → finish・サイズが実測と一致 → 消すと 0', async ({ page }) => {
    await openDemo(page);
    await expect(page.locator(FETCH)).toBeEnabled({ timeout: 30000 });
    await page.locator(FETCH).click();
    await expect(page.locator('#cache-progress')).toContainText(/[1-9]\d* \/ \d+/, { timeout: 60000 });
    await expect(page.locator('#cache-result')).toContainText('finish', { timeout: 90000 });
    await expect(page.locator(FETCH)).toHaveText('全タイルを取得');
    await expect.poll(() => sizeText(page), { timeout: 30000 }).toBeGreaterThan(0);
    const real = await page.evaluate(() => {
      const app = (window as any).__MAPLAT_DEMO_APP__;
      return app.getMapTileCacheSizeAsync(app.currentMapInfo().mapID);
    });
    expect(await sizeText(page)).toBe(real);
    // C4
    await page.locator(CLEAR).click();
    await expect.poll(() => sizeText(page), { timeout: 30000 }).toBe(0);
    const after = await page.evaluate(() => {
      const app = (window as any).__MAPLAT_DEMO_APP__;
      return app.getMapTileCacheSizeAsync(app.currentMapInfo().mapID);
    });
    expect(after).toBe(0);
  });

  test('C5: 取得を中止するとボタンが戻る', async ({ page }) => {
    await openDemo(page);
    await expect(page.locator(FETCH)).toBeEnabled({ timeout: 30000 });
    await page.locator(FETCH).click();
    await expect(page.locator(FETCH)).toHaveText('取得を中止');
    await page.locator(FETCH).click({ timeout: 5000 }).catch(() => undefined);
    await expect(page.locator(FETCH)).toHaveText('全タイルを取得', { timeout: 40000 });
    await expect(page.locator('#cache-result')).toContainText(/canceled|finish|stop/);
  });

  test('C6: remove()→再生成のあとも節が作り直され、取得できる（再登録なし・履歴は二重にならない）', async ({ page }) => {
    const errors = errorsOf(page);
    await openDemo(page);
    expect((await registrations(page)).length).toBe(1);
    await page.getByRole('button', { name: 'remove()' }).click();
    await expect(page.locator('#demo-cache')).toHaveCount(0);
    await page.getByRole('button', { name: '再生成', exact: true }).click();
    await waitDemo(page);
    await fetchAllAndWait(page);
    expect((await registrations(page)).length).toBe(1);
    await expect(page.locator('#demo-cache')).toHaveCount(1);
    await expect(page.locator('#event-log li[data-type="tileCache"]', { hasText: 'finish' })).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test('C12: 消去が効かないときは「消去できませんでした」が出てボタンが戻る', async ({ page }) => {
    await openDemo(page);
    await fetchAllAndWait(page);
    await expect.poll(() => sizeText(page), { timeout: 30000 }).toBeGreaterThan(0);
    await page.evaluate(() => {
      (window as any).__MAPLAT_DEMO_APP__.clearMapTileCacheAsync = async () => {};
    });
    await page.locator(CLEAR).click();
    await expect(page.locator('#demo-cache')).toContainText('消去できませんでした', { timeout: 20000 });
    await expect(page.locator(CLEAR)).toBeEnabled();
  });
});

test.describe('デモのタイルキャッシュ（キャッシュ無しの経路）', () => {
  test.setTimeout(120000);

  test('C7: ?cache=0 では SW を登録せず、無効と表示する', async ({ page }) => {
    await openDemo(page, `${MORIOKA}&cache=0`);
    const enabled = await page.evaluate(() => {
      const app = (window as any).__MAPLAT_DEMO_APP__;
      return { enableCache: app.enableCache, enabled: app.getMapCacheEnable(app.currentMapInfo().mapID) };
    });
    expect(enabled.enableCache).toBe(false);
    expect(enabled.enabled).toBe(false);
    expect((await registrations(page)).length).toBe(0);
    await expect(page.locator('#cache-app')).toContainText('無効');
    await expect(page.locator(FETCH)).toBeDisabled();
  });

  test('C8: navigator.serviceWorker が無くても地図は動き、理由が出る', async ({ page }) => {
    const errors = errorsOf(page);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'serviceWorker', { value: undefined, configurable: true });
    });
    await openDemo(page);
    const enableCache = await page.evaluate(() => (window as any).__MAPLAT_DEMO_APP__.enableCache);
    expect(enableCache).toBe(false);
    await expect(page.locator('#cache-app')).toContainText('Service Worker を使えない');
    await expect(page.locator(FETCH)).toBeDisabled();
    expect(errors).toEqual([]);
  });

  test('C9: 全体のタイル数が分からない地図（遠隔の基図）では一括取得を止め、理由を出す', async ({ page }) => {
    await openDemo(page, '/?region=tatebayashi');
    // 地域の既定の古地図は全体のタイル数が分かる（599 枚）ので押せる。基図の osm は全体のタイル数が分からない
    await expect(page.locator(FETCH)).toBeEnabled({ timeout: 30000 });
    await page.evaluate(() => (window as any).__MAPLAT_DEMO_APP__.changeMap('osm'));
    await expect(page.locator('#cache-target')).toContainText('osm');
    await expect(page.locator(FETCH)).toBeDisabled();
    await expect(page.locator('#cache-note')).toContainText('全体のタイル数が分からない');
    await expect(page.locator(FETCH)).toHaveAttribute('title', /全体のタイル数/);
  });
});

test.describe('デモのタイルキャッシュ（失敗の見え方。決定的）', () => {
  test.setTimeout(120000);

  test('C10: 進まない取得は 30 秒で知らせ、ジョブを止めてボタンを戻す', async ({ page }) => {
    const errors = errorsOf(page);
    await openWithClock(page);
    await stubFetchHold(page);
    await page.locator(FETCH).click();
    await expect(page.locator(FETCH)).toHaveText('取得を中止');
    await page.clock.runFor(25_000);
    await expect(page.locator('#demo-cache')).not.toContainText('進んでいません');
    await expect(page.locator(FETCH)).toHaveText('取得を中止');
    await page.clock.runFor(6_000);
    await expect(page.locator('#demo-cache')).toContainText('進んでいません');
    await expect(page.locator('#demo-cache')).toContainText('遅い回線の可能性');
    expect(await page.evaluate(() => (window as any).__cancelCalls)).toBe(1);
    await expect(page.locator(FETCH)).toHaveText('全タイルを取得');
    await expect(page.locator(FETCH)).toBeEnabled();
    await expect(page.locator('#state-error')).toContainText('進んでいません');
    expect(errors).toEqual([]);
  });

  test('C10b: 古い世代のイベントは表示を変えない', async ({ page }) => {
    await openWithClock(page);
    await stubFetchHold(page);
    await page.locator(FETCH).click();
    await page.clock.runFor(31_000);
    await expect(page.locator(FETCH)).toHaveText('全タイルを取得');
    await page.locator(FETCH).click();
    await expect(page.locator(FETCH)).toHaveText('取得を中止');
    const before = await historyCount(page);
    await page.evaluate(() => {
      const w = window as any;
      const mapID = w.__MAPLAT_DEMO_APP__.currentMapInfo().mapID;
      w.__cbs[0]('finish', { type: 'finish', mapID });
    });
    await expect(page.locator(FETCH)).toHaveText('取得を中止');
    expect(await historyCount(page)).toBe(before);
    await expect(page.locator('#cache-result')).not.toContainText('finish');
    await page.evaluate(() => {
      const w = window as any;
      const mapID = w.__MAPLAT_DEMO_APP__.currentMapInfo().mapID;
      w.__cbs[1]('proceed', { type: 'proceed', percent: 50, mapID });
    });
    await expect(page.locator('#cache-progress')).toContainText('50%');
    expect(await historyCount(page)).toBe(before);
  });

  test('C10c: 中止が解決しなくても 10 秒でボタンが戻る', async ({ page }) => {
    const errors = errorsOf(page);
    await openWithClock(page);
    await stubFetchHold(page);
    await page.evaluate(() => {
      (window as any).__MAPLAT_DEMO_APP__.cancelMapTileCacheAsync = () => new Promise(() => {});
    });
    await page.locator(FETCH).click();
    await page.clock.runFor(31_000);
    await expect(page.locator(FETCH)).toBeDisabled();
    await page.clock.runFor(10_000);
    await expect(page.locator(FETCH)).toHaveText('全タイルを取得');
    await expect(page.locator(FETCH)).toBeEnabled();
    await expect(page.locator('#demo-cache')).toContainText('中止の応答がありません');
    expect(errors).toEqual([]);
  });

  test('C10d: 統計の count が増える間は数え直す', async ({ page }) => {
    await openWithClock(page);
    await stubFetchHold(page);
    await page.evaluate(() => {
      const w = window as any;
      w.__n = 0;
      w.__freeze = false;
      w.__MAPLAT_DEMO_APP__.getMapTileCacheStatsAsync = async () => ({
        count: w.__freeze ? w.__n : ++w.__n,
        size: 0,
        total: 553,
        percent: 0
      });
    });
    await page.locator(FETCH).click();
    for (let i = 0; i < 20; i++) await page.clock.runFor(2_000);
    await expect(page.locator('#demo-cache')).not.toContainText('進んでいません');
    await expect(page.locator(FETCH)).toHaveText('取得を中止');
    await page.evaluate(() => {
      (window as any).__freeze = true;
    });
    await page.clock.runFor(25_000);
    await expect(page.locator('#demo-cache')).not.toContainText('進んでいません');
    await page.clock.runFor(6_000);
    await expect(page.locator('#demo-cache')).toContainText('進んでいません');
  });

  test('C11: 中止の応答が無いときは中止側の文言を 30 秒後に出す', async ({ page }) => {
    await openWithClock(page);
    await stubFetchHold(page);
    await page.locator(FETCH).click();
    await page.clock.runFor(1_000);
    await page.locator(FETCH).click();
    await page.clock.runFor(25_000);
    await expect(page.locator('#demo-cache')).not.toContainText('中止の応答がありません');
    await expect(page.locator('#demo-cache')).not.toContainText('進んでいません');
    await page.clock.runFor(6_000);
    await expect(page.locator('#demo-cache')).toContainText('中止の応答がありません');
    await expect(page.locator('#demo-cache')).not.toContainText('進んでいません');
    await expect(page.locator(FETCH)).toHaveText('全タイルを取得');
    expect(await page.evaluate(() => (window as any).__cancelCalls)).toBe(1);
  });
});
