// <maplat-app> の確認ページ（demo/element.html）を実ブラウザで確かめる。
//   - タグだけで地図が出る（OL の canvas が要素の中に描かれる）
//   - 属性 map-id の変更で地図が切り替わる（mapChanged を addEventListener で受ける）
//   - 要素のメソッド addMarker が効く
//   - 中心の目印の属性（U5）・起動時キーの変更不可（U2）
//   - updateState の transparency・地図の切替で透過度を保つ（§3.8 A4）
//   - 枠線と範囲（setEnvelopes・getMapEnvelope・getViewExtent）・Pro 固有の属性の警告（U3）
// 実行: node_modules/.bin/playwright test --config=e2e/wc-element.playwright.config.ts
// スクリーンショットの保存先は環境変数 WC_SHOTS（無ければ test-results/wc-shots）。
import { test, expect } from '@playwright/test';
import { resolve } from 'path';

const SHOTS = process.env.WC_SHOTS || resolve(process.cwd(), 'test-results/wc-shots');

test('<maplat-app> の確認ページ', async ({ page }) => {
  const warnings: string[] = [];
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'warning') warnings.push(msg.text());
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(String(err)));

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/demo/element.html');
  await expect(page.getByTestId('status')).toHaveAttribute('data-ready', 'true', { timeout: 30000 });

  // 1. タグだけで地図が出る
  // OL は次の描画フレームで canvas を作るので、現れるまで待つ
  await expect(page.locator('maplat-app canvas').first()).toBeAttached({ timeout: 15000 });
  await expect(page.getByTestId('current')).toHaveText('morioka_ndl');
  await page.waitForTimeout(1500); // タイルの描画を待つ
  await page.screenshot({ path: `${SHOTS}/01-initial-morioka_ndl.png` });

  // 2. 属性 map-id の変更で地図が切り替わる（要素のイベントで受ける）
  const changed = page.evaluate(
    () =>
      new Promise<string>(res => {
        const el = document.querySelector('maplat-app')!;
        el.addEventListener('mapChanged', e => res((e as CustomEvent).detail.mapID), { once: true });
      })
  );
  await page.getByTestId('map-select').selectOption('morioka');
  expect(await changed).toBe('morioka');
  await expect(page.getByTestId('current')).toHaveText('morioka');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${SHOTS}/02-map-id-morioka.png` });

  // 3. 要素のメソッド addMarker
  await page.getByTestId('add-marker').click();
  await expect(page.getByTestId('marker-id')).not.toHaveText('-');
  await expect(page.getByTestId('marker-id')).not.toHaveText('undefined');
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${SHOTS}/03-add-marker.png` });

  // 4. 中心の目印（U5）: 既定で表示 → no-center-marker で消える
  const marker = page.locator('maplat-app .maplat-center-marker');
  await expect(marker).toBeVisible();
  await page.getByTestId('toggle-center').click();
  await expect(marker).toBeHidden();
  await page.getByTestId('toggle-center').click();
  await expect(marker).toBeVisible();

  // 5. 起動時キー（U2）: app-id の変更は警告して無視（作り直さない）
  const canvasBefore = await page.evaluate(() => document.querySelector('maplat-app canvas'));
  await page.getByTestId('change-app-id').click();
  await expect(page.getByTestId('app-id-read')).toHaveText('morioka');
  await page.waitForTimeout(300);
  expect(warnings.filter(w => w.includes('fixed at startup')).length).toBe(1);
  const sameCanvas = await page.evaluate(() => !!document.querySelector('maplat-app canvas'));
  expect(sameCanvas).toBe(true);
  expect(canvasBefore).not.toBeUndefined();
  await expect(page.getByTestId('current')).toHaveText('morioka');

  // 6. updateState の detail に transparency が載る（起動時から。§3.8 A4 の是正で undefined にならない）
  const log = page.getByTestId('log');
  await expect(log).toContainText('updateState: mapID=morioka transparency=0');
  expect(await log.textContent()).not.toContain('transparency=undefined');

  // 7. 透過度を地図の切替で保つ（§3.8 A4）
  await page.evaluate(() => {
    const el = document.querySelector('maplat-app') as any;
    el.transparency = 40;
  });
  await expect(log).toContainText('updateState: mapID=morioka transparency=40');
  const keep = page.evaluate(
    () =>
      new Promise<number>(res => {
        const el = document.querySelector('maplat-app') as any;
        el.addEventListener('mapChanged', () => setTimeout(() => res(el.getTransparency()), 100), { once: true });
      })
  );
  await page.getByTestId('map-select').selectOption('morioka_ndl');
  expect(await keep).toBe(40);
  await expect(log).toContainText('updateState: mapID=morioka_ndl transparency=40');
  await page.evaluate(() => {
    (document.querySelector('maplat-app') as any).transparency = 0;
  });

  // 8. 枠線（setEnvelopes）と範囲（getMapEnvelope・getViewExtent）
  await page.getByTestId('envelopes').click();
  await expect(page.getByTestId('envelope-info')).toContainText('morioka_ndl');
  await expect(page.getByTestId('envelope-info')).not.toContainText('頂点 0 個');
  await page.getByTestId('extent').click();
  await expect(page.getByTestId('extent-info')).toContainText('141.');
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${SHOTS}/04-envelopes.png` });
  const drawn = await page.evaluate(() => {
    const el = document.querySelector('maplat-app') as any;
    return el.app.mapObject.getSource('envelope').getFeatures().length;
  });
  expect(drawn).toBeGreaterThan(0);

  // 9. Pro 固有の属性（U3）: 警告して無視（1 回だけ・Pro の名を出さない）
  await page.getByTestId('display-mode').click();
  await page.getByTestId('display-mode').click();
  await expect(page.getByTestId('display-mode-read')).toHaveText('undefined');
  const dm = warnings.filter(w => w.includes('display-mode'));
  expect(dm).toEqual(['<maplat-app>: ignored unsupported attribute "display-mode"']);

  // 起動中にページのエラーが出ていない（タイル取得の失敗等のネットワークは除く）
  expect(errors.filter(e => !/Failed to load resource|net::/.test(e))).toEqual([]);
});
