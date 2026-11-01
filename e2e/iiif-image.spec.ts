// 国立国会図書館の IIIF の画像を配信する地図（デモの地域「新潟」）を、外のサーバーへ行かずに確かめる。
//
// - info.json は仕様の資料（spec/fixtures/iiif/ndl-948741-r1.info.json）を読み、@id だけを
//   配信の URL に差し替えて返す（資料のファイル自体は変えない）
// - タイルは 1 枚の JPEG（e2e/fixtures/iiif/tile-256.jpg）を返し、要求された URL を控える
// - Manifest への要求の数を数える（Core は Manifest を取らない）
//
// 期待: 地図が表示される（sourceLoaded で usable）・要求が IIIF の切り出しの式の形・
// getMapCacheEnable が偽・壊れた delivery の地図は使えない・Manifest への要求が 0 件。
import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// デモの地図（public/maps/niigata_1920_ndl.json）の配信の URL・大きさ
const BASE = 'https://dl.ndl.go.jp/api/iiif/948741/R0000003';
const BROKEN = 'https://dl.ndl.go.jp/api/iiif/948741/R0000003-broken';
const MANIFEST = 'https://dl.ndl.go.jp/api/iiif/948741/manifest.json';
const WIDTH = 4074;
const HEIGHT = 2705;

// info.json とタイルを返し、要求されたタイルの URL と Manifest の要求の数を控える
async function routeIiif(page: Page) {
  const infoPath = resolve(process.cwd(), 'spec/fixtures/iiif/ndl-948741-r1.info.json');
  const tilePath = resolve(process.cwd(), 'e2e/fixtures/iiif/tile-256.jpg');
  const info = JSON.parse(readFileSync(infoPath, 'utf-8')) as Record<string, unknown>;
  // 資料の @id は R0000001。デモの地図は R0000003 なので、@id だけを差し替える
  info['@id'] = BASE;
  const infoBody = JSON.stringify(info);
  const tileBody = readFileSync(tilePath);
  const tiles: string[] = [];
  let manifestCalls = 0;

  // dl.ndl.go.jp への要求は、この試験の中だけですべて返す（外のサーバーへ行かない）
  await page.route('https://dl.ndl.go.jp/**', async route => {
    const url = route.request().url();
    const cors = { 'access-control-allow-origin': '*' };
    if (url === MANIFEST) {
      manifestCalls++;
      await route.fulfill({ status: 404, headers: cors, body: '' });
      return;
    }
    if (url === `${BROKEN}/info.json`) {
      await route.fulfill({ status: 404, headers: cors, body: 'not found' });
      return;
    }
    if (url === `${BASE}/info.json`) {
      await route.fulfill({
        status: 200,
        headers: { ...cors, 'content-type': 'application/json' },
        body: infoBody
      });
      return;
    }
    if (url.startsWith(`${BASE}/`)) {
      tiles.push(url);
      await route.fulfill({
        status: 200,
        headers: { ...cors, 'content-type': 'image/jpeg' },
        body: tileBody
      });
      return;
    }
    await route.fulfill({ status: 404, headers: cors, body: '' });
  });

  return { tiles, manifestCalls: () => manifestCalls };
}

// IIIF Image API の切り出しの式に合うかを調べ、合わない点を文字列で返す
function tileUrlProblems(url: string): string[] {
  const prefix = `${BASE}/`;
  if (!url.startsWith(prefix)) return [`配信の基準の URL でない: ${url}`];
  const parts = url.slice(prefix.length).split('/');
  if (parts.length !== 4) return [`URL の形が違う: ${url}`];
  const [regionParam, sizeParam, rotation, format] = parts;
  if (rotation !== '0' || format !== 'default.jpg') {
    return [`rotation・quality/format が違う: ${url}`];
  }
  // size は「幅,」の形（NDL は v2 level1。書いていない高さは比べない）
  const size = /^(\d+),$/.exec(sizeParam);
  if (!size) return [`size が「幅,」の形でない: ${url}`];
  const sizeWidth = Number(size[1]);

  let region: number[];
  if (regionParam === 'full') region = [0, 0, WIDTH, HEIGHT];
  else {
    region = regionParam.split(',').map(Number);
    if (region.length !== 4 || region.some(v => !Number.isInteger(v) || v < 0)) {
      return [`region が画素の 4 つ組でない: ${url}`];
    }
  }
  const [x, y, w, h] = region;

  const problems: string[] = [];
  if (w <= 0 || h <= 0) problems.push(`region が空: ${url}`);
  if (x + w > WIDTH || y + h > HEIGHT) problems.push(`region が画像の外に出ている: ${url}`);
  if (sizeWidth > 256) problems.push(`size が 256 を超えている: ${sizeWidth} (${url})`);
  // x・y は 256·2^k の倍数、w' = ceil(w / 2^k) で 256 以下、k は 0〜4
  const matches = [0, 1, 2, 3, 4].some(k => {
    const step = 256 * 2 ** k;
    if (x % step !== 0 || y % step !== 0) return false;
    if (w > step || h > step) return false;
    return Math.ceil(w / 2 ** k) === sizeWidth;
  });
  if (!matches) problems.push(`IIIF の切り出しの式に合わない: ${url}`);
  return problems;
}

test.describe('IIIF の画像の配信（デモの地域「新潟」）', () => {
  test.setTimeout(180000);

  test('新潟の地図が IIIF から表示され、タイルの要求が IIIF の切り出しの式の形になる', async ({ page }) => {
    const recorded = await routeIiif(page);

    // 既存の e2e と同じ形でアプリの準備を待つ（デモは window.__MAPLAT_DEMO_APP__ に app を出す）
    await page.goto('/?region=niigata', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => (window as unknown as { __MAPLAT_DEMO_APP__?: unknown }).__MAPLAT_DEMO_APP__, undefined, {
      timeout: 60000
    });
    await page.waitForSelector('#demo-app-controls .demo-sec', { timeout: 30000 });

    // (1) 地図が表示されている（初期の地図が IIIF の地図）。
    // sourceLoaded の usable は Core の判定（sourceLoadedDetail）で見る（元素の経路と同じ関数）。
    const state = await page.evaluate(() => {
      const app = (window as any).__MAPLAT_DEMO_APP__;
      const kept = app.cacheHash ? Object.values(app.cacheHash) : [];
      return {
        current: app.currentMapInfo()?.mapID,
        detail: app.sourceLoadedDetail(kept),
        cache: app.getMapCacheEnable('niigata_1920_ndl'),
        brokenCache: app.getMapCacheEnable('niigata_1920_ndl_broken')
      };
    });
    expect(state.current).toBe('niigata_1920_ndl');
    expect(state.detail).toContainEqual({ mapID: 'niigata_1920_ndl', usable: true });
    expect(state.detail).toContainEqual({ mapID: 'gsi', usable: true });
    expect(state.detail).toContainEqual({ mapID: 'osm', usable: true });
    // (4) 壊れた delivery の地図は使えない（他の地図は使える）
    expect(state.detail).toContainEqual({ mapID: 'niigata_1920_ndl_broken', usable: false });
    // (3) IIIF の地図はキャッシュの対象外
    expect(state.cache).toBe(false);
    expect(state.brokenCache).toBe(false);

    // 地図の一覧では「使えない地図」になり、他の地図は普通に使える
    const brokenOption = page.locator('#map-select option[value="niigata_1920_ndl_broken"]');
    // <option> には Playwright の toBeDisabled が効かないので、要素の disabled を直接読む
    await expect.poll(() => brokenOption.evaluate((o) => (o as HTMLOptionElement).disabled)).toBe(true);
    await expect(brokenOption).toContainText('使えない地図');
    await expect(page.locator('#map-select option[value="gsi"]')).toBeEnabled();
    await expect(page.locator('#map-select option[value="osm"]')).toBeEnabled();

    // (2) 控えたタイルの URL が 1 件以上あり、全部が IIIF の切り出しの式の形
    await expect.poll(() => recorded.tiles.length, { timeout: 60000 }).toBeGreaterThan(0);
    const problems = recorded.tiles.flatMap(url => tileUrlProblems(url));
    expect(problems.slice(0, 10)).toEqual([]);
    expect(problems.length).toBe(0);

    // デモの節に、キャッシュの欄・使えない地図の console.error・要求の一覧が出ている
    await expect(page.locator('#iiif-cache')).toHaveText('キャッシュ対象外');
    await expect(page.locator('#iiif-unusable-errors')).toContainText('is not usable: fetch-failed');
    await expect(page.locator('#iiif-tile-requests')).toContainText('/api/iiif/948741/R0000003/');

    // (5) Manifest への要求が 0 件（Core は Manifest を取らない）
    expect(recorded.manifestCalls()).toBe(0);
  });

  test('新潟の地図の書誌が写した値のままで、表を出すかはアプリ設定で変わり、Manifest を取りに行かない', async ({ page }) => {
    const recorded = await routeIiif(page);
    // ページ全体の要求を控える（Manifest への要求を数える）
    const requests: string[] = [];
    page.on('request', request => {
      requests.push(request.url());
    });

    // 素材（地図の JSON）の copiedMetadata の件数。デモの表と getMapMeta がこれと同じ件数になる
    const mapPath = resolve(process.cwd(), 'public/maps/niigata_1920_ndl.json');
    const map = JSON.parse(readFileSync(mapPath, 'utf-8')) as { iiif?: { copiedMetadata?: unknown[] } };
    const copiedCount = map.iiif?.copiedMetadata?.length ?? 0;
    expect(copiedCount).toBeGreaterThan(0);

    await page.goto('/?region=niigata', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => (window as unknown as { __MAPLAT_DEMO_APP__?: unknown }).__MAPLAT_DEMO_APP__, undefined, {
      timeout: 60000
    });
    await page.waitForSelector('#demo-app-controls .demo-sec', { timeout: 30000 });

    // (1) 書誌を持つ地図は、getMapMeta の iiif に写した metadata の全件を載せる（表を出す設定）
    const shown = await page.evaluate(() => {
      const app = (window as any).__MAPLAT_DEMO_APP__;
      const meta = app.getMapMeta('niigata_1920_ndl');
      return {
        current: app.currentMapInfo()?.mapID,
        display: meta?.iiif?.display,
        count: Array.isArray(meta?.iiif?.metadata) ? meta.iiif.metadata.length : null,
        keys: meta?.iiif ? Object.keys(meta.iiif) : []
      };
    });
    expect(shown.current).toBe('niigata_1920_ndl');
    expect(shown.display).toBe('all');
    expect(shown.count).toBe(copiedCount);
    // 表示に使わない項目（bindings・copiedValues）は載らない
    expect(shown.keys).not.toContain('bindings');
    expect(shown.keys).not.toContain('copiedValues');

    // デモの「書誌」の欄: 写した値・印・metadata の全件の表
    await expect(page.locator('#iiif-meta-display')).toHaveText('display: all');
    await expect(page.locator('#iiif-meta-stamp')).toHaveText('Manifest から写した値');
    await expect(page.locator('#iiif-meta-summary')).toContainText('新潟市圖');
    // NDL のライセンスは語彙に無いので「Custom」と URL の文字で出る
    await expect(page.locator('#iiif-meta-summary')).toContainText('Custom');
    await expect(page.locator('#iiif-meta-summary')).toContainText('dl.ndl.go.jp/ja/help_iiif');
    await expect(page.locator('#iiif-meta-table tbody tr')).toHaveCount(copiedCount);

    // (2) 表を出さない設定の地図に切り替えると、display が hidden になり表が出ない
    await page.selectOption('#map-select', 'niigata_1920_ndl_meta_hidden');
    await expect
      .poll(async () => page.evaluate(() => (window as any).__MAPLAT_DEMO_APP__.currentMapInfo()?.mapID), { timeout: 30000 })
      .toBe('niigata_1920_ndl_meta_hidden');
    const hidden = await page.evaluate(() => {
      const meta = (window as any).__MAPLAT_DEMO_APP__.getMapMeta('niigata_1920_ndl_meta_hidden');
      return { display: meta?.iiif?.display, count: Array.isArray(meta?.iiif?.metadata) ? meta.iiif.metadata.length : null };
    });
    expect(hidden.display).toBe('hidden');
    expect(hidden.count).toBe(copiedCount);
    await expect(page.locator('#iiif-meta-display')).toHaveText('display: hidden');
    await expect(page.locator('#iiif-meta-table table')).toHaveCount(0);
    await expect(page.locator('#iiif-meta-table')).toContainText('表を出さない設定（hidden）');

    // (3) 悪い値の Manifest を関数に通した表に、画像・実行・javascript のリンクが残らない
    const bad = page.locator('#iiif-bad-output');
    await expect(bad).not.toBeEmpty();
    await expect(bad.locator('img')).toHaveCount(0);
    await expect(bad.locator('script')).toHaveCount(0);
    await expect(bad.locator('a[href^="javascript:"]')).toHaveCount(0);
    await expect(bad.locator('a[href^="mailto:"]')).toHaveCount(0);
    // https のリンクだけが新しいタブのリンクで残る
    const httpsLink = bad.locator('a[href^="https://example.org/"]').first();
    await expect(httpsLink).toHaveAttribute('target', '_blank');
    await expect(httpsLink).toHaveAttribute('rel', 'noopener noreferrer');

    // (4) Manifest への要求が 0 件（ページ全体で数える）
    expect(recorded.manifestCalls()).toBe(0);
    expect(requests.filter(url => url === MANIFEST)).toEqual([]);
    expect(requests.filter(url => /\/manifest\.json(?:$|[?#])/.test(url))).toEqual([]);
  });
});
