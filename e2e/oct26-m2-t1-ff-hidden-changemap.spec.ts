import { test, expect } from '@playwright/test';

// oct26-m2-t1-ff（m2-t1 の fix-forward・SCOPE-1）の受け入れ条件 E2E。
// 地図コンテナを非表示（display:none・寸法 0）にしている間に changeMap() しても、
// 再表示したときに「表示したまま切り替えた場合と同じ視点」になることを確かめる。
// 視点は地図に依存しない形（メルカトル中心・メルカトルズーム・方位）で比べる。
// 表示したままの切替では、切替前後でこの値が一致する（設計 §2.2 の V / RV の実測）。
// MIN3 は設計レビュー R1 MIN-3（非表示中に控えた視点が有限でない場合の防御）を固定する。
// 実行: ./node_modules/.bin/playwright test --config=./e2e/oct26-m2-t1-probe.config.ts --grep "oct26-m2-t1-ff"

const TOL_MERC = 20; // メルカトル座標での中心差の許容（盛岡の緯度で約 15 m）
const TOL_ZOOM = 0.01;
const TOL_ROT = 0.01; // rad
const POS = { x: 15713006.59, y: 4822749.7, zoom: 14, rotation: 0 }; // osm の座標系で盛岡

type Vp = [[number, number], number, number];

async function boot(page: any): Promise<string[]> {
  const pageErrors: string[] = [];
  page.on('pageerror', (err: any) => pageErrors.push(String(err)));
  await page.goto('/e2e/test.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => (window as any).__MAPLAT_APP__ !== undefined, null, {
    polling: 200,
    timeout: 30000
  });
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    const w = window as any;
    w.__FF_EVENTS__ = [];
    w.__MAPLAT_APP__.addEventListener('outOfMap', () => w.__FF_EVENTS__.push('outOfMap'));
  });
  return pageErrors;
}

// 地図に依存しない視点。寸法 0 のときは null。
async function viewpoint(page: any): Promise<Vp | null> {
  return await page.evaluate(async () => {
    const app = (window as any).__MAPLAT_APP__;
    const size = app.mapObject.getSize();
    if (!size || !(size[0] > 0 && size[1] > 0)) return null;
    const mercs = await app.from.viewpoint2MercsAsync();
    return await app.mercSrc.mercs2ViewpointAsync(mercs);
  });
}

async function viewState(page: any) {
  return await page.evaluate(() => {
    const app = (window as any).__MAPLAT_APP__;
    const view = app.mapObject.getView();
    return {
      mapID: app.from && app.from.mapID,
      center: view.getCenter(),
      zoom: view.getZoom(),
      rotation: view.getRotation(),
      events: (window as any).__FF_EVENTS__
    };
  });
}

async function changeMapBounded(page: any, mapID: string, restore?: any) {
  return await page.evaluate(
    async ([id, rs]: any) => {
      const app = (window as any).__MAPLAT_APP__;
      return await Promise.race([
        app.changeMap(id, rs).then(() => 'resolved'),
        new Promise(res => setTimeout(() => res('timeout'), 10000))
      ]);
    },
    [mapID, restore]
  );
}

async function hideMap(page: any) {
  await page.evaluate(() => {
    document.getElementById('map_div')!.style.display = 'none';
  });
  await page.waitForFunction(
    () => {
      const s = (window as any).__MAPLAT_APP__.mapObject.getSize();
      return !s || s[0] === 0 || s[1] === 0;
    },
    null,
    { polling: 100, timeout: 5000 }
  );
}

async function showMap(page: any) {
  await page.evaluate(() => {
    document.getElementById('map_div')!.style.display = '';
  });
  await page.waitForFunction(
    () => {
      const s = (window as any).__MAPLAT_APP__.mapObject.getSize();
      return !!s && s[0] > 0 && s[1] > 0;
    },
    null,
    { polling: 100, timeout: 5000 }
  );
  await page.waitForTimeout(2500);
}

function angleDiff(a: number, b: number) {
  let d = a - b;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return Math.abs(d);
}

function expectSameViewpoint(before: Vp, after: Vp | null) {
  expect(after).not.toBeNull();
  const a = after as Vp;
  const dist = Math.hypot(a[0][0] - before[0][0], a[0][1] - before[0][1]);
  expect(dist).toBeLessThan(TOL_MERC);
  expect(Math.abs(a[1] - before[1])).toBeLessThan(TOL_ZOOM);
  expect(angleDiff(a[2], before[2])).toBeLessThan(TOL_ROT);
}

test.describe('oct26-m2-t1-ff 非表示中の地図切替で視点を保つ', () => {
  test.setTimeout(90000);

  test('AC1 主判定: 表示→非表示→historical から osm へ切替→再表示で視点が保たれる', async ({ page }) => {
    const errs = await boot(page);
    const before = (await viewpoint(page)) as Vp;
    await hideMap(page);
    expect(await changeMapBounded(page, 'osm')).toBe('resolved');
    await showMap(page);
    const after = await viewpoint(page);
    const st = await viewState(page);
    console.log('FF_AC1', JSON.stringify({ before, after, st, errs }));
    expect(st.mapID).toBe('osm');
    expectSameViewpoint(before, after);
    expect(st.events).not.toContain('outOfMap');
    expect(errs).toEqual([]);
  });

  test('AC2: 非表示中に osm から historical へ（逆方向）切替→再表示で視点が保たれる', async ({ page }) => {
    const errs = await boot(page);
    expect(await changeMapBounded(page, 'osm')).toBe('resolved');
    await page.waitForTimeout(2000);
    await page.evaluate(() => { (window as any).__FF_EVENTS__.length = 0; });
    const before = (await viewpoint(page)) as Vp;
    await hideMap(page);
    expect(await changeMapBounded(page, 'morioka_ndl2')).toBe('resolved');
    await showMap(page);
    const after = await viewpoint(page);
    const st = await viewState(page);
    console.log('FF_AC2', JSON.stringify({ before, after, st, errs }));
    expect(st.mapID).toBe('morioka_ndl2');
    expectSameViewpoint(before, after);
    expect(st.events).not.toContain('outOfMap');
    expect(errs).toEqual([]);
  });

  test('AC3a: 非表示中の restore.position 付き切替が再表示後に反映される', async ({ page }) => {
    const errs = await boot(page);
    await hideMap(page);
    expect(await changeMapBounded(page, 'osm', { position: POS })).toBe('resolved');
    await showMap(page);
    const st = await viewState(page);
    console.log('FF_AC3a', JSON.stringify({ st, errs }));
    expect(st.mapID).toBe('osm');
    expect(Math.abs(st.center[0] - POS.x)).toBeLessThan(1);
    expect(Math.abs(st.center[1] - POS.y)).toBeLessThan(1);
    expect(Math.abs(st.zoom - POS.zoom)).toBeLessThan(TOL_ZOOM);
    expect(errs).toEqual([]);
  });

  test('AC3b: 非表示中に 2 回切り替えても（historical→gsi→osm）再表示後の視点が保たれる', async ({ page }) => {
    const errs = await boot(page);
    const before = (await viewpoint(page)) as Vp;
    await hideMap(page);
    expect(await changeMapBounded(page, 'gsi')).toBe('resolved');
    expect(await changeMapBounded(page, 'osm')).toBe('resolved');
    await showMap(page);
    const after = await viewpoint(page);
    const st = await viewState(page);
    console.log('FF_AC3b', JSON.stringify({ before, after, st, errs }));
    expect(st.mapID).toBe('osm');
    expectSameViewpoint(before, after);
    expect(st.events).not.toContain('outOfMap');
    expect(errs).toEqual([]);
  });

  test('AC4: 前面地図が絶対配置で #map_div の高さが 0 の画面（test.html）で、非表示のまま初期化→再表示すると初期視点が適用される', async ({ page }) => {
    // 対照: 同じ画面を表示したまま初期化したときの視点
    const refErrs = await boot(page);
    const ref = (await viewpoint(page)) as Vp;
    // 本番: 別ページで、#map_div を非表示にしたまま初期化する
    const page2 = await page.context().newPage();
    const errs: string[] = [];
    page2.on('pageerror', (err: any) => errs.push(String(err)));
    await page2.addInitScript(() => {
      new MutationObserver((_m, obs) => {
        const d = document.getElementById('map_div');
        if (d) {
          d.style.display = 'none';
          obs.disconnect();
        }
      }).observe(document, { childList: true, subtree: true });
    });
    await page2.goto('/e2e/test.html', { waitUntil: 'domcontentloaded' });
    await page2.waitForFunction(() => (window as any).__MAPLAT_APP__ !== undefined, null, {
      polling: 200,
      timeout: 30000
    });
    await page2.waitForTimeout(1000);
    await showMap(page2);
    const after = await viewpoint(page2);
    const st = await page2.evaluate(() => {
      const app = (window as any).__MAPLAT_APP__;
      const view = app.mapObject.getView();
      return { mapID: app.from && app.from.mapID, center: view.getCenter(), zoom: view.getZoom() };
    });
    console.log('FF_AC4', JSON.stringify({ ref, after, st, refErrs, errs }));
    expect(st.mapID).toBe('morioka_ndl2');
    expectSameViewpoint(ref, after);
    expect(errs).toEqual([]);
    await page2.close();
  });

  test('MIN3: 非表示中に控えた視点が有限でなくても、例外を出さず再表示後に視点が確定し後続の切替も resolve する', async ({ page }) => {
    // 設計レビュー R1 MIN-3。非表示の間に resolution が NaN へ崩れた後に切替が来た場合を、
    // 切替の間だけ view.getZoom()・getDecimalZoom() を NaN にして作る。保留には視点を持たせず、再表示時に
    // goHome で確定する（outOfMap は発火しない）ことを確かめる。
    const errs = await boot(page);
    await hideMap(page);
    const r = await page.evaluate(async () => {
      const app = (window as any).__MAPLAT_APP__;
      const view = app.mapObject.getView();
      const origZoom = view.getZoom;
      const origDecimalZoom = view.getDecimalZoom;
      view.getZoom = () => NaN;
      view.getDecimalZoom = () => NaN;
      try {
        return await Promise.race([
          app.changeMap('osm').then(() => 'resolved'),
          new Promise(res => setTimeout(() => res('timeout'), 10000))
        ]);
      } finally {
        view.getZoom = origZoom;
        view.getDecimalZoom = origDecimalZoom;
      }
    });
    expect(r).toBe('resolved');
    await showMap(page);
    const after = await viewpoint(page);
    const st = await viewState(page);
    // 保留が残っていないこと（残ると changeViewpoint の通知が止まったままになる）
    const pendingLeft = await page.evaluate(() => (window as any).__MAPLAT_APP__.__pendingView != null);
    console.log('FF_MIN3', JSON.stringify({ after, st, pendingLeft, errs }));
    expect(st.mapID).toBe('osm');
    expect(errs).toEqual([]);
    expect(st.events).not.toContain('outOfMap');
    expect(after).not.toBeNull();
    const a = after as Vp;
    expect([a[0][0], a[0][1], a[1], a[2]].every(v => Number.isFinite(v))).toBe(true);
    expect([st.center[0], st.center[1], st.zoom].every((v: number) => Number.isFinite(v))).toBe(true);
    expect(await changeMapBounded(page, 'morioka_ndl2')).toBe('resolved');
    expect(pendingLeft).toBe(false);
    expect(errs).toEqual([]);
  });

  test('REG-1 回帰: 表示したままの切替は視点が保たれる', async ({ page }) => {
    const errs = await boot(page);
    const before = (await viewpoint(page)) as Vp;
    expect(await changeMapBounded(page, 'osm')).toBe('resolved');
    await page.waitForTimeout(2500);
    const after = await viewpoint(page);
    const st = await viewState(page);
    console.log('FF_REG1', JSON.stringify({ before, after, st, errs }));
    expect(st.mapID).toBe('osm');
    expectSameViewpoint(before, after);
    expect(st.events).not.toContain('outOfMap');
    expect(errs).toEqual([]);
  });

  test('REG-2 回帰: 切替なしの非表示→再表示は視点が保たれる', async ({ page }) => {
    const errs = await boot(page);
    const before = (await viewpoint(page)) as Vp;
    await hideMap(page);
    await showMap(page);
    const after = await viewpoint(page);
    const st = await viewState(page);
    console.log('FF_REG2', JSON.stringify({ before, after, st, errs }));
    expect(st.mapID).toBe('morioka_ndl2');
    expectSameViewpoint(before, after);
    expect(errs).toEqual([]);
  });
});
