// 表示中の現代の地図（basemap・タイルの重ね地図）の出典が、地図の上に常に出ることを実ブラウザで確かめる。
//   - OSM・地理院のそれぞれで出典が出る／切り替えで変わる
//   - 重ね地図のときは、下の basemap と重ね地図の両方が出る（折り返して、切れない）
//   - 言語（lang 属性）を変えると変わる
//   - 要素を外したら表示が残らない
//   - 旧 API（MaplatApp）でも出る
// 外のタイルは取りに行かない（page.route で同梱の画像に差し替え、それ以外の外への要求は止めて数える）。
// 実行: node_modules/.bin/playwright test --config=e2e/attribution.playwright.config.ts
// 写真の保存先は環境変数 ATTRIBUTION_SHOTS（無ければ test-results/attribution-shots）。
import { test, expect, type Page } from '@playwright/test';
import { existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = process.env.ATTRIBUTION_SHOTS || resolve(process.cwd(), 'test-results/attribution-shots');
const OSM = '©︎ OpenStreetMap contributors';
const GSI_JA = '国土地理院';
const GSI_EN = 'The Geospatial Information Authority of Japan';
const OVERLAY_JA = '正保城絵図 南部領盛岡平城絵図 (正保元年) 国立公文書館';
const OVERLAY_EN = 'Japan National Archives';

/** 差し替えのタイル（256px の SVG。地図の種類と z/x/y を描く。写真で地図の種類が見分けられるように）。 */
function fakeTile(url: string, label: string, fill: string) {
  const zxy = (url.match(/\/(\d+)\/(\d+)\/(\d+)\.\w+$/) || []).slice(1).join('/');
  const body =
    `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">` +
    `<rect width="256" height="256" fill="${fill}" stroke="#999" stroke-width="1"/>` +
    `<text x="128" y="120" font-family="sans-serif" font-size="28" text-anchor="middle" fill="#555">${label}</text>` +
    `<text x="128" y="152" font-family="sans-serif" font-size="16" text-anchor="middle" fill="#777">${zxy}</text>` +
    `</svg>`;
  return { status: 200, contentType: 'image/svg+xml', headers: { 'Access-Control-Allow-Origin': '*' }, body };
}

/** 外への要求を止める。OSM・地理院のタイルは作った画像、重ね地図は同梱のタイルで返す。 */
async function routeExternal(page: Page): Promise<string[]> {
  const blocked: string[] = [];
  await page.route(
    url => !['127.0.0.1', 'localhost'].includes(url.hostname),
    route => {
      blocked.push(route.request().url());
      return route.abort();
    }
  );
  await page.route(/tile\.openstreetmap\.org\//, route => route.fulfill(fakeTile(route.request().url(), 'OSM', '#cfe3c8')));
  await page.route(/cyberjapandata\.gsi\.go\.jp\//, route => route.fulfill(fakeTile(route.request().url(), 'GSI', '#f3e6c4')));
  await page.route(/code4history\.dev\/Maplat\/tiles\//, route => {
    const local = resolve(ROOT, 'public', new URL(route.request().url()).pathname.replace(/^\/Maplat\//, ''));
    return existsSync(local)
      ? route.fulfill({ path: local, contentType: 'image/png' })
      : route.fulfill({ status: 404, body: '' });
  });
  return blocked;
}

async function openElementPage(page: Page, width = 1280, height = 800) {
  await page.setViewportSize({ width, height });
  const blocked = await routeExternal(page);
  await page.goto('/demo/element.html');
  await expect(page.getByTestId('status')).toHaveAttribute('data-ready', 'true', { timeout: 30000 });
  await expect(page.locator('maplat-app canvas').first()).toBeAttached({ timeout: 15000 });
  return blocked;
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

test.describe('背景地図の出典の表示', () => {
  test('OSM・地理院の出典が出て、切り替えで変わる。重ね地図では両方が出る', async ({ page }) => {
    const blocked = await openElementPage(page);

    // 起動直後: 古地図（morioka_ndl）＋背面の地理院。古地図の出典は出さない
    await expect.poll(async () => (await attribution(page))?.items).toEqual([GSI_JA]);
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

    // 重ね地図を外すと、重ね地図の出典は消える
    await changeMap(page, 'osm');
    expect((await attribution(page))?.items).toEqual([OSM]);

    expect(blocked.filter(u => /openstreetmap|gsi\.go\.jp|code4history\.dev/.test(u))).toEqual([]);
  });

  test('言語（lang 属性）を起動後に変えると、出典の言語も変わる', async ({ page }) => {
    await openElementPage(page);
    await changeMap(page, 'gsi');
    await changeMap(page, 'morioka_ndl_affine');
    expect((await attribution(page))?.items).toEqual([GSI_JA, OVERLAY_JA]);

    // 要素の lang 属性
    await page.evaluate(() => document.querySelector('maplat-app')!.setAttribute('lang', 'en'));
    await expect.poll(async () => (await attribution(page))?.items).toEqual([GSI_EN, OVERLAY_EN]);

    // 要素の lang を外すと、文書の lang（ja）に戻る
    await page.evaluate(() => document.querySelector('maplat-app')!.removeAttribute('lang'));
    await expect.poll(async () => (await attribution(page))?.items).toEqual([GSI_JA, OVERLAY_JA]);

    // 文書の lang（<html lang>）を変えても追う
    await page.evaluate(() => document.documentElement.setAttribute('lang', 'en'));
    await expect.poll(async () => (await attribution(page))?.items).toEqual([GSI_EN, OVERLAY_EN]);
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
});
