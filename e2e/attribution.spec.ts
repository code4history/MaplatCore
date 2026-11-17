// 表示中の現代の地図（basemap・タイルの重ね地図）の出典が、地図の上に常に出ることを実ブラウザで確かめる。
//   - OSM・地理院のそれぞれで出典が出る／切り替えで変わる
//   - 重ね地図のときは、下の basemap と重ね地図の両方が出る（折り返して、切れない）
//   - 言語は UI と同じ順で選ぶ（要素の lang → 設定ファイルの lang → <html lang>）。lang 属性の変更で変わる
//   - attr の無い Google の地図は、OpenLayers の source の出典（表示範囲の copyright）を出す
//   - 要素を外したら表示が残らない
//   - 旧 API（MaplatApp）でも出る
//   - Google の地図のあいだは Google Maps のロゴを出典の左隣に出す（狭いときは文字 "Google Maps"）
// 外のタイルは取りに行かない（page.route で作った画像に差し替え、それ以外の外への要求は止めて数える）。
// 実行: node_modules/.bin/playwright test --config=e2e/attribution.playwright.config.ts
// 写真の保存先は環境変数 ATTRIBUTION_SHOTS（無ければ test-results/attribution-shots）。
import { test, expect, type Page } from '@playwright/test';
import { resolve } from 'path';

const SHOTS = process.env.ATTRIBUTION_SHOTS || resolve(process.cwd(), 'test-results/attribution-shots');
const OSM = '©︎ OpenStreetMap contributors';
const GSI_JA = '国土地理院';
const GSI_EN = 'The Geospatial Information Authority of Japan';
const OVERLAY_JA = '正保城絵図 南部領盛岡平城絵図 (正保元年) 国立公文書館';
const OVERLAY_EN = 'Japan National Archives';

/**
 * 差し替えのタイル（256px の SVG。地図の種類と z/x/y を描く。写真で地図の種類が見分けられるように）。
 * opacity を与えると半透明の重ね地図用（下の地図が透けて見える）。textY は文字の高さ（重ね地図は下の地図の文字と重ねない）。
 */
function fakeTile(url: string, label: string, fill: string, opacity = 1, textY = 120) {
  const zxy = (new URL(url).pathname.match(/\/(\d+)\/(\d+)\/(\d+)(?:\.\w+)?$/) || []).slice(1).join('/');
  const body =
    `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">` +
    `<rect width="256" height="256" fill="${fill}" fill-opacity="${opacity}" stroke="#999" stroke-width="1"/>` +
    `<text x="128" y="${textY}" font-family="sans-serif" font-size="28" text-anchor="middle" fill="#555">${label}</text>` +
    `<text x="128" y="${textY + 32}" font-family="sans-serif" font-size="16" text-anchor="middle" fill="#777">${zxy}</text>` +
    `</svg>`;
  return { status: 200, contentType: 'image/svg+xml', headers: { 'Access-Control-Allow-Origin': '*' }, body };
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};
const GOOGLE_COPYRIGHT = 'Map data ©2026 Google';

/**
 * 外への要求を止める（止めた URL を返す）。OSM・地理院・重ね地図（TMS）・Google のタイルは作った画像で返す。
 * 重ね地図のタイルの画像はリポジトリに無い（public/tiles/morioka_ndl_affine は目録だけ）ので、半透明の画像を作る。
 * Google は Map Tiles API の session・表示範囲の copyright（viewport）も偽の応答で返す。
 */
async function routeExternal(page: Page): Promise<{ blocked: string[]; overlayTiles: string[]; viewport: string[] }> {
  const blocked: string[] = [];
  const overlayTiles: string[] = [];
  const viewport: string[] = [];
  await page.route(
    url => !['127.0.0.1', 'localhost'].includes(url.hostname),
    route => {
      blocked.push(route.request().url());
      return route.abort();
    }
  );
  await page.route(/tile\.openstreetmap\.org\//, route => route.fulfill(fakeTile(route.request().url(), 'OSM', '#cfe3c8')));
  await page.route(/cyberjapandata\.gsi\.go\.jp\//, route => route.fulfill(fakeTile(route.request().url(), 'GSI', '#f3e6c4')));
  await page.route(/code4history\.dev\/Maplat\/tiles\/morioka_ndl_affine\//, route => {
    overlayTiles.push(route.request().url());
    return route.fulfill(fakeTile(route.request().url(), 'OVERLAY', '#d04040', 0.35, 50));
  });
  await page.route(/tile\.googleapis\.com\//, route => {
    const url = new URL(route.request().url());
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
    if (url.pathname === '/v1/createSession') {
      const expiry = String(Math.floor(Date.now() / 1000) + 3600);
      return route.fulfill({
        status: 200,
        headers: CORS,
        contentType: 'application/json',
        body: JSON.stringify({ session: 'example-session', expiry, tileWidth: 256, tileHeight: 256, imageFormat: 'png' })
      });
    }
    if (url.pathname === '/tile/v1/viewport') {
      viewport.push(url.search);
      return route.fulfill({ status: 200, headers: CORS, contentType: 'application/json', body: JSON.stringify({ copyright: GOOGLE_COPYRIGHT }) });
    }
    return route.fulfill(fakeTile(route.request().url(), 'GOOGLE', '#dfe6f3'));
  });
  return { blocked, overlayTiles, viewport };
}

/** 設定ファイル（apps/<id>.json）の lang を書き換えて返す。 */
async function routeSettingLang(page: Page, appid: string, lang: string) {
  await page.route(new RegExp(`/apps/${appid}\\.json$`), async route => {
    const response = await route.fetch();
    const json = await response.json();
    json.lang = lang;
    return route.fulfill({ response, body: JSON.stringify(json), contentType: 'application/json' });
  });
}

async function openElementPage(page: Page, width = 1280, height = 800) {
  await page.setViewportSize({ width, height });
  const routed = await routeExternal(page);
  await page.goto('/demo/element.html');
  await expect(page.getByTestId('status')).toHaveAttribute('data-ready', 'true', { timeout: 30000 });
  await expect(page.locator('maplat-app canvas').first()).toBeAttached({ timeout: 15000 });
  return routed;
}

async function changeMap(page: Page, mapID: string) {
  await page.evaluate(
    id =>
      new Promise<void>(res => {
        const el = document.querySelector('maplat-app') as any;
        el.addEventListener('mapChanged', () => res(), { once: true });
        el.mapId = id;
      }),
    mapID
  );
}

/** 出典の表示の文字列（区切りを含む）と、出典ごとの文字列。 */
async function attribution(page: Page, scope = 'maplat-app') {
  return page.evaluate(sel => {
    const box = document.querySelector(`${sel} .maplat-attribution`) as HTMLElement | null;
    if (!box) return null;
    return {
      hidden: box.hidden,
      text: box.textContent,
      items: [...box.querySelectorAll('.maplat-attribution-item')].map(e => e.textContent)
    };
  }, scope);
}

/** 出典の表示が地図の箱の中にあり、切れずに見え、最前面にあることを確かめる。 */
async function expectFullyVisible(page: Page, scope = 'maplat-app') {
  const geometry = await page.evaluate(sel => {
    const host = document.querySelector(sel) as HTMLElement;
    const box = host.querySelector('.maplat-attribution') as HTMLElement;
    const text = box.querySelector('.maplat-attribution-text') as HTMLElement;
    const h = host.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    const style = getComputedStyle(text);
    const cx = b.left + b.width / 2;
    const cy = b.top + b.height / 2;
    // 出典は操作を通す（pointer-events:none）ので、最前面かを測るあいだだけ当たるようにする
    const previous = box.style.pointerEvents;
    box.style.pointerEvents = 'auto';
    const top = document.elementFromPoint(cx, cy);
    box.style.pointerEvents = previous;
    return {
      inside: b.left >= h.left - 0.5 && b.right <= h.right + 0.5 && b.top >= h.top - 0.5 && b.bottom <= h.bottom + 0.5,
      width: b.width,
      height: b.height,
      textOverflow: style.textOverflow,
      clipped: text.scrollWidth > text.clientWidth + 1 || text.scrollHeight > text.clientHeight + 1,
      onTop: !!top && box.contains(top),
      rightGap: h.right - b.right,
      bottomGap: h.bottom - b.bottom
    };
  }, scope);
  expect(geometry.inside).toBe(true);
  expect(geometry.width).toBeGreaterThan(0);
  expect(geometry.height).toBeGreaterThan(0);
  expect(geometry.textOverflow).not.toBe('ellipsis');
  expect(geometry.clipped).toBe(false);
  expect(geometry.onTop).toBe(true);
  return geometry;
}

/** Google Maps のロゴの表示の状態と位置（出典の文字の箱・地図の箱との関係）。 */
async function googleLogo(page: Page, scope = 'maplat-app') {
  return page.evaluate(sel => {
    const host = document.querySelector(sel) as HTMLElement;
    const box = host.querySelector('.maplat-attribution') as HTMLElement | null;
    const logo = box?.querySelector('.maplat-attribution-google-logo') as HTMLElement | null;
    // Google の出典の箱（ロゴと同じ行）。ほかの出典は別の箱（others）
    const text = box?.querySelector('.maplat-attribution-google .maplat-attribution-text') as HTMLElement | null;
    const others = box?.querySelector('.maplat-attribution-others') as HTMLElement | null;
    const rect = (el: Element | null | undefined) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
    };
    const svg = logo?.querySelector('svg') ?? null;
    let onTop = false;
    if (logo) {
      const r = logo.getBoundingClientRect();
      const previous = box!.style.pointerEvents;
      box!.style.pointerEvents = 'auto';
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      box!.style.pointerEvents = previous;
      onTop = !!top && logo.contains(top);
    }
    const style = logo ? getComputedStyle(logo) : null;
    return {
      mode: box?.dataset.googleMaps ?? null,
      variant: logo?.dataset.variant ?? null,
      label: logo?.getAttribute('aria-label') ?? null,
      host: rect(host),
      box: rect(box),
      logo: rect(logo),
      svg: rect(svg),
      text: rect(text),
      others: rect(others),
      othersText: others?.textContent ?? null,
      googleItems: text ? [...text.querySelectorAll('.maplat-attribution-item')].map(e => e.textContent) : [],
      margin: style ? [style.marginTop, style.marginRight, style.marginBottom, style.marginLeft] : null,
      onTop,
      items: box ? [...box.querySelectorAll('.maplat-attribution-item')].map(e => e.textContent) : []
    };
  }, scope);
}

/** ロゴが原寸で、余白を保ち、出典の文字に重ならず、地図の箱の中で最前面にあることを確かめる。 */
function expectLogoPlacement(g: Awaited<ReturnType<typeof googleLogo>>) {
  expect(g.mode).toBe('logo');
  expect(g.label).toBe('Google Maps');
  expect(g.svg!.width).toBeCloseTo(105, 0);
  expect(g.svg!.height).toBeCloseTo(22, 0);
  // 余白（上・左右 10px、下 5px）
  expect(g.margin).toEqual(['10px', '10px', '5px', '10px']);
  // 地図の箱の中
  expect(g.logo!.left).toBeGreaterThanOrEqual(g.host!.left - 0.5);
  expect(g.logo!.right).toBeLessThanOrEqual(g.host!.right + 0.5);
  expect(g.logo!.bottom).toBeLessThanOrEqual(g.host!.bottom + 0.5);
  // 出典の文字に重ならない（同じ行なら文字の左に 10px 以上、折り返したら文字の上）
  const sameRow = g.logo!.bottom > g.text!.top + 0.5;
  if (sameRow) expect(g.text!.left - g.logo!.right).toBeGreaterThanOrEqual(9.5);
  else expect(g.text!.top - g.logo!.bottom).toBeGreaterThanOrEqual(4.5);
  expect(g.onTop).toBe(true);
}

test.describe('背景地図の出典の表示', () => {
  test('OSM・地理院の出典が出て、切り替えで変わる。重ね地図では両方が出る', async ({ page }) => {
    const { blocked, overlayTiles } = await openElementPage(page);

    // 起動直後: 古地図（morioka_ndl）＋背面の地理院。古地図の出典は出さない
    // （vite を起こした直後の最初のページは遅いので、待ちを長めにとる）
    await expect.poll(async () => (await attribution(page))?.items, { timeout: 15000 }).toEqual([GSI_JA]);
    const geometry = await expectFullyVisible(page);
    // <maplat-ui> の外では右下の隅
    expect(geometry.rightGap).toBeLessThan(1);
    expect(geometry.bottomGap).toBeLessThan(1);

    await changeMap(page, 'osm');
    expect((await attribution(page))?.items).toEqual([OSM]);
    await expectFullyVisible(page);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SHOTS}/core-osm-1280.png` });

    await changeMap(page, 'gsi');
    expect((await attribution(page))?.items).toEqual([GSI_JA]);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SHOTS}/core-gsi-1280.png` });

    // 古地図へ戻ると、背面の basemap（直前の地理院）の出典が残る
    await changeMap(page, 'morioka');
    expect((await attribution(page))?.items).toEqual([GSI_JA]);

    // OSM から古地図へ: 背面は OSM
    await changeMap(page, 'osm');
    await changeMap(page, 'morioka_ndl');
    expect((await attribution(page))?.items).toEqual([OSM]);

    // 重ね地図（TMS）: 下の basemap と重ね地図の両方
    await changeMap(page, 'gsi');
    await changeMap(page, 'morioka_ndl_affine');
    const overlay = await attribution(page);
    expect(overlay?.items).toEqual([GSI_JA, OVERLAY_JA]);
    expect(overlay?.text).toBe(`${GSI_JA} | ${OVERLAY_JA}`);
    await expectFullyVisible(page);
    // 重ね地図のタイルが実際に読まれて描かれている
    await expect.poll(() => overlayTiles.length).toBeGreaterThan(0);

    // 重ね地図を外すと、重ね地図の出典は消える
    await changeMap(page, 'osm');
    expect((await attribution(page))?.items).toEqual([OSM]);

    expect(blocked.filter(u => /openstreetmap|gsi\.go\.jp|code4history\.dev/.test(u))).toEqual([]);
  });

  test('言語は UI と同じ順で選び、起動後の lang 属性の変更にも追う', async ({ page }) => {
    // demo/element.html は <html lang="ja">・設定ファイル（apps/morioka.json）も "lang": "ja"
    await openElementPage(page);
    await changeMap(page, 'gsi');
    await changeMap(page, 'morioka_ndl_affine');
    expect((await attribution(page))?.items).toEqual([GSI_JA, OVERLAY_JA]);

    // 要素の lang 属性が最優先
    await page.evaluate(() => document.querySelector('maplat-app')!.setAttribute('lang', 'en'));
    await expect.poll(async () => (await attribution(page))?.items).toEqual([GSI_EN, OVERLAY_EN]);

    // 要素の lang を外すと、設定ファイルの lang（ja）に戻る
    await page.evaluate(() => document.querySelector('maplat-app')!.removeAttribute('lang'));
    await expect.poll(async () => (await attribution(page))?.items).toEqual([GSI_JA, OVERLAY_JA]);

    // <html lang="en"> にしても、設定ファイルの lang（ja）が先（UI と同じ）
    await page.evaluate(() => document.documentElement.setAttribute('lang', 'en'));
    await page.waitForTimeout(200);
    expect((await attribution(page))?.items).toEqual([GSI_JA, OVERLAY_JA]);
  });

  test('<html lang="ja"> で設定ファイルの lang が en なら、出典は英語', async ({ page }) => {
    await routeSettingLang(page, 'morioka', 'en');
    await openElementPage(page);
    expect(await page.evaluate(() => document.documentElement.lang)).toBe('ja');
    await expect.poll(async () => (await attribution(page))?.items).toEqual([GSI_EN]);
    await changeMap(page, 'osm');
    expect((await attribution(page))?.items).toEqual([OSM]);
  });

  test('狭い画面（幅 390px）でも折り返して全文が見える', async ({ page }) => {
    await openElementPage(page, 390, 844);
    await changeMap(page, 'osm');
    expect((await attribution(page))?.items).toEqual([OSM]);
    await expectFullyVisible(page);
    await page.waitForTimeout(800);
    await page.locator('maplat-app').screenshot({ path: `${SHOTS}/core-osm-390.png` });

    await changeMap(page, 'gsi');
    await expectFullyVisible(page);
    await page.waitForTimeout(800);
    await page.locator('maplat-app').screenshot({ path: `${SHOTS}/core-gsi-390.png` });

    // 重ね地図: 長い出典でも「…」で切らず折り返す
    await changeMap(page, 'morioka_ndl_affine');
    const oneLine = await expectFullyVisible(page);
    await page.waitForTimeout(800);
    await page.locator('maplat-app').screenshot({ path: `${SHOTS}/core-overlay-390.png` });
    // 地図の箱がもっと狭いと、「…」で切らずに折り返して全文を出す
    await page.evaluate(() => {
      (document.querySelector('maplat-app') as HTMLElement).style.width = '200px';
    });
    const wrapped = await expectFullyVisible(page);
    expect(wrapped.height).toBeGreaterThan(oneLine.height * 1.5);
  });

  test('要素を外したら出典の表示は残らず、lang の変更にも反応しない', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(String(err)));
    await openElementPage(page);
    await changeMap(page, 'osm');
    expect((await attribution(page))?.items).toEqual([OSM]);

    await page.evaluate(() => {
      const el = document.querySelector('maplat-app')!;
      (window as any).__removedApp = el;
      el.remove();
    });
    // 破棄は初期化の完了を待ってから行う（要素の取り決め）。消えるまで待つ
    await expect
      .poll(() => page.evaluate(() => (window as any).__removedApp.querySelectorAll('.maplat-attribution').length))
      .toBe(0);
    expect(await page.evaluate(() => document.querySelectorAll('.maplat-attribution').length)).toBe(0);

    // 外した後に lang を変えても、表示は作り直されない
    await page.evaluate(() => document.documentElement.setAttribute('lang', 'en'));
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => (window as any).__removedApp.querySelectorAll('.maplat-attribution').length)).toBe(0);
    expect(errors).toEqual([]);
  });

  test('旧 API（MaplatApp）でも出典が出て、remove() で消える', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await routeExternal(page);
    await page.goto('/e2e/fixtures/attribution/legacy.html');
    await expect(page.locator('body')).toHaveAttribute('data-ready', 'true', { timeout: 30000 });
    await expect.poll(async () => (await attribution(page, '#map_div'))?.items).toEqual([GSI_JA]);
    await expectFullyVisible(page, '#map_div');

    await page.evaluate(() => (window as any).__MAPLAT_APP__.changeMap('osm'));
    expect((await attribution(page, '#map_div'))?.items).toEqual([OSM]);

    await page.evaluate(() => (window as any).__MAPLAT_APP__.remove());
    expect(await page.evaluate(() => document.querySelectorAll('.maplat-attribution').length)).toBe(0);
  });

  test('attr の無い Google の地図は、表示範囲の copyright（OpenLayers の source の出典）を出す', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const { viewport } = await routeExternal(page);
    // サンプルの設定（apps/sample.json）は google・google_sat を attr なしで持つ。キーは偽の値
    await page.goto('/e2e/fixtures/attribution/legacy.html?appid=sample&googleApiKey=example-key');
    await expect(page.locator('body')).toHaveAttribute('data-ready', 'true', { timeout: 30000 });
    expect(await page.evaluate(() => (window as any).__MAPLAT_APP__.getMapMeta('google').attr)).toBeUndefined();

    await page.evaluate(() => (window as any).__MAPLAT_APP__.changeMap('google'));
    await expect.poll(async () => (await attribution(page, '#map_div'))?.items, { timeout: 15000 }).toEqual([GOOGLE_COPYRIGHT]);
    await expectFullyVisible(page, '#map_div');
    expect(viewport.length).toBeGreaterThan(0);
    expect(viewport[0]).toContain('key=example-key');
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SHOTS}/core-google-1280.png` });

    // 古地図へ切り替えると、背面の Google の copyright が残る
    await page.evaluate(() => (window as any).__MAPLAT_APP__.changeMap('morioka_ndl2'));
    await expect.poll(async () => (await attribution(page, '#map_div'))?.items, { timeout: 15000 }).toEqual([GOOGLE_COPYRIGHT]);

    // attr のある地図へ切り替えると、Google の copyright は消える
    await page.evaluate(() => (window as any).__MAPLAT_APP__.changeMap('osm'));
    expect((await attribution(page, '#map_div'))?.items).toEqual([OSM]);
  });

  test('Google の地図のあいだは Google Maps のロゴを出典の左隣に出し、外れたら消す', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const { blocked } = await routeExternal(page);
    await page.goto('/e2e/fixtures/attribution/legacy.html?appid=sample&googleApiKey=example-key');
    await expect(page.locator('body')).toHaveAttribute('data-ready', 'true', { timeout: 30000 });
    // Google でない地図: ロゴは無い
    expect((await googleLogo(page, '#map_div')).mode).toBeNull();

    await page.evaluate(() => (window as any).__MAPLAT_APP__.changeMap('google'));
    await expect.poll(async () => (await attribution(page, '#map_div'))?.items, { timeout: 15000 }).toEqual([GOOGLE_COPYRIGHT]);
    const road = await googleLogo(page, '#map_div');
    expectLogoPlacement(road);
    expect(road.variant).toBe('light');
    // 広い画面では同じ行で、ロゴが左・copyright が右。箱は右下の隅
    expect(road.logo!.bottom).toBeGreaterThan(road.text!.top);
    expect(road.logo!.right).toBeLessThan(road.text!.left);
    expect(road.host!.right - road.box!.right).toBeLessThan(1);
    expect(road.host!.bottom - road.box!.bottom).toBeLessThan(1);
    // ロゴの代わりの文字は出さない
    expect(road.items).toEqual([GOOGLE_COPYRIGHT]);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SHOTS}/core-google-logo-1280.png` });
    await page.screenshot({
      path: `${SHOTS}/core-google-logo-1280-corner.png`,
      clip: { x: 1280 - 420, y: 800 - 90, width: 420, height: 90 }
    });

    // 衛星: 白い字・濃い枠のロゴ
    await page.evaluate(() => (window as any).__MAPLAT_APP__.changeMap('google_sat'));
    await expect.poll(async () => (await googleLogo(page, '#map_div')).variant, { timeout: 15000 }).toBe('dark');
    // copyright は新しい source が表示範囲を取りに行ってから出る（ロゴはその前から出ている）
    await expect.poll(async () => (await attribution(page, '#map_div'))?.items, { timeout: 15000 }).toEqual([GOOGLE_COPYRIGHT]);
    expectLogoPlacement(await googleLogo(page, '#map_div'));
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `${SHOTS}/core-google-sat-logo-1280-corner.png`,
      clip: { x: 1280 - 420, y: 800 - 90, width: 420, height: 90 }
    });

    // 古地図へ: 背面の Google の地図が見えるあいだはロゴも残る
    await page.evaluate(() => (window as any).__MAPLAT_APP__.changeMap('morioka_ndl2'));
    await expect.poll(async () => (await googleLogo(page, '#map_div')).mode, { timeout: 15000 }).toBe('logo');

    // 言語を変えると描き直す（ロゴの要素が作り直される）。ロゴは出したまま
    await page.evaluate(() => {
      (window as any).__logoBefore = document.querySelector('#map_div .maplat-attribution-google-logo');
      document.getElementById('map_div')!.setAttribute('lang', 'en');
    });
    await expect
      .poll(() =>
        page.evaluate(() => {
          const now = document.querySelector('#map_div .maplat-attribution-google-logo');
          return !!now && !!(window as any).__logoBefore && now !== (window as any).__logoBefore;
        })
      )
      .toBe(true);
    expect((await googleLogo(page, '#map_div')).mode).toBe('logo');

    // Google でない地図へ: ロゴは消える
    await page.evaluate(() => (window as any).__MAPLAT_APP__.changeMap('osm'));
    const osm = await googleLogo(page, '#map_div');
    expect(osm.mode).toBeNull();
    expect(osm.logo).toBeNull();
    expect(osm.items).toEqual([OSM]);

    // 破棄: 表示ごと消える
    await page.evaluate(() => (window as any).__MAPLAT_APP__.changeMap('google'));
    await expect.poll(async () => (await googleLogo(page, '#map_div')).mode, { timeout: 15000 }).toBe('logo');
    await page.evaluate(() => (window as any).__MAPLAT_APP__.remove());
    expect(await page.evaluate(() => document.querySelectorAll('.maplat-attribution-google-logo').length)).toBe(0);

    // Google 以外の外への要求は無い（Google は偽の応答で返している）
    expect(blocked.filter(u => /googleapis|gstatic/.test(u))).toEqual([]);
  });

  test('狭い画面（幅 390px）でもロゴを出し、ロゴが入らない幅では文字 Google Maps にする', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await routeExternal(page);
    await page.goto('/e2e/fixtures/attribution/legacy.html?appid=sample&googleApiKey=example-key');
    await expect(page.locator('body')).toHaveAttribute('data-ready', 'true', { timeout: 30000 });
    await page.evaluate(() => (window as any).__MAPLAT_APP__.changeMap('google'));
    await expect.poll(async () => (await attribution(page, '#map_div'))?.items, { timeout: 15000 }).toEqual([GOOGLE_COPYRIGHT]);
    expectLogoPlacement(await googleLogo(page, '#map_div'));
    await expectFullyVisible(page, '#map_div');
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SHOTS}/core-google-logo-390.png` });

    // 地図の箱が 180px: ロゴは残し、copyright はロゴの下の行へ折り返す
    await page.evaluate(() => {
      (document.getElementById('map_div') as HTMLElement).style.width = '180px';
    });
    await expect.poll(async () => {
      const g = await googleLogo(page, '#map_div');
      return g.mode === 'logo' && g.logo!.bottom <= g.text!.top + 0.5;
    }).toBe(true);
    expectLogoPlacement(await googleLogo(page, '#map_div'));
    await expectFullyVisible(page, '#map_div');
    await page.waitForTimeout(300);
    await page.locator('#map_div').screenshot({ path: `${SHOTS}/core-google-logo-180.png` });

    // 地図の箱が 120px（ロゴと左右の余白 125px が入らない）: 文字 "Google Maps" を出典の先頭に出す
    await page.evaluate(() => {
      (document.getElementById('map_div') as HTMLElement).style.width = '120px';
    });
    await expect.poll(async () => (await googleLogo(page, '#map_div')).mode).toBe('text');
    const narrow = await googleLogo(page, '#map_div');
    expect(narrow.logo).toBeNull();
    expect(narrow.items).toEqual(['Google Maps', GOOGLE_COPYRIGHT]);
    await expectFullyVisible(page, '#map_div');
    await page.waitForTimeout(300);
    await page.locator('#map_div').screenshot({ path: `${SHOTS}/core-google-text-120.png` });

    // 広げるとロゴに戻る
    await page.evaluate(() => {
      (document.getElementById('map_div') as HTMLElement).style.width = '';
    });
    await expect.poll(async () => (await googleLogo(page, '#map_div')).mode).toBe('logo');
  });

  test('<maplat-ui> の中では、右下のボタンの列の左隣の出典の箱にロゴも載る', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await routeExternal(page);
    await page.goto('/e2e/fixtures/attribution/in-ui.html?appid=sample&googleApiKey=example-key');
    await expect(page.locator('body')).toHaveAttribute('data-ready', 'true', { timeout: 30000 });
    await page.evaluate(() => (window as any).__MAPLAT_APP__.changeMap('google'));
    await expect.poll(async () => (await attribution(page, 'maplat-app'))?.items, { timeout: 15000 }).toEqual([GOOGLE_COPYRIGHT]);
    const g = await googleLogo(page, 'maplat-app');
    expectLogoPlacement(g);
    // 箱の右端は右下のボタンの列の左（地図の右端から .5em + ボタンの幅 + 間隔）、下端はスライダーの上
    const gap = await page.evaluate(() => {
      const fontSize = parseFloat(getComputedStyle(document.querySelector('maplat-app')!).fontSize);
      return { right: fontSize * (0.5 + 3.09375) + 7, bottom: 65 + fontSize * 0.5 };
    });
    expect(g.host!.right - g.box!.right).toBeCloseTo(gap.right, 0);
    expect(g.host!.bottom - g.box!.bottom).toBeCloseTo(gap.bottom, 0);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SHOTS}/core-google-logo-in-ui-390.png` });
  });

  test('Google の地図に attr を書いても、表示範囲の copyright を出し、attr は後に添える', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await routeExternal(page);
    await page.route(/\/maps\/google\.json$/, async route => {
      const response = await route.fetch();
      const json = await response.json();
      json.attr = 'Example basemap note';
      return route.fulfill({ response, body: JSON.stringify(json), contentType: 'application/json' });
    });
    await page.goto('/e2e/fixtures/attribution/legacy.html?appid=sample&googleApiKey=example-key');
    await expect(page.locator('body')).toHaveAttribute('data-ready', 'true', { timeout: 30000 });
    expect(await page.evaluate(() => (window as any).__MAPLAT_APP__.getMapMeta('google').attr)).toBe('Example basemap note');
    await page.evaluate(() => (window as any).__MAPLAT_APP__.changeMap('google'));
    await expect
      .poll(async () => (await googleLogo(page, '#map_div')).googleItems, { timeout: 15000 })
      .toEqual([GOOGLE_COPYRIGHT, 'Example basemap note']);
    expectLogoPlacement(await googleLogo(page, '#map_div'));
  });

  test('Google の地図の上の重ね地図の出典は、Google の出典と別の箱にして上に出す', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const { overlayTiles } = await routeExternal(page);
    await page.goto('/e2e/fixtures/attribution/legacy.html?appid=sample&googleApiKey=example-key');
    await expect(page.locator('body')).toHaveAttribute('data-ready', 'true', { timeout: 30000 });
    await page.evaluate(() => (window as any).__MAPLAT_APP__.changeMap('google'));
    await expect.poll(async () => (await attribution(page, '#map_div'))?.items, { timeout: 15000 }).toEqual([GOOGLE_COPYRIGHT]);
    await page.evaluate(() => (window as any).__MAPLAT_APP__.changeMap('morioka_ndl_affine'));
    await expect.poll(async () => (await googleLogo(page, '#map_div')).othersText, { timeout: 15000 }).toBe(OVERLAY_JA);
    await expect.poll(async () => (await googleLogo(page, '#map_div')).googleItems, { timeout: 15000 }).toEqual([GOOGLE_COPYRIGHT]);
    const g = await googleLogo(page, '#map_div');
    expectLogoPlacement(g);
    // 重ね地図の出典の箱は、ロゴ・Google の出典の行より上にあり、重ならない
    expect(g.others!.bottom).toBeLessThanOrEqual(g.logo!.top + 0.5);
    expect(g.others!.bottom).toBeLessThanOrEqual(g.text!.top + 0.5);
    // " | " で Google の出典とつながない
    expect((await attribution(page, '#map_div'))?.text).not.toContain(' | ');
    await expectFullyVisible(page, '#map_div');
    await expect.poll(() => overlayTiles.length).toBeGreaterThan(0);
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `${SHOTS}/core-google-overlay-1280-corner.png`,
      clip: { x: 1280 - 460, y: 800 - 110, width: 460, height: 110 }
    });

    // 390px でも重ならない
    await page.setViewportSize({ width: 390, height: 844 });
    await expect.poll(async () => (await googleLogo(page, '#map_div')).mode).toBe('logo');
    const narrow = await googleLogo(page, '#map_div');
    expectLogoPlacement(narrow);
    expect(narrow.others!.bottom).toBeLessThanOrEqual(Math.min(narrow.logo!.top, narrow.text!.top) + 0.5);
    await page.waitForTimeout(800);
    await page.locator('#map_div').screenshot({ path: `${SHOTS}/core-google-overlay-390.png` });
  });
});
