// nov26-m4-t2（MaplatCore #107）t2/AC4: deviceScaleFactor 2 で、GL ベースマップ（maplibre・mapbox）の
// canvas が OpenLayers の viewport と同じ表示寸法に保たれ、かつ view 不変の描画で GL の resize() を呼ばないこと。
// - 寸法の一致（Issue の案 (i)）: .mainview を縮めて updateSize() した後、GL canvas の表示矩形と
//   OL viewport の幅・高さの差が 1 px 以下
// - 呼び出し回数: view を動かさずに 30 回描画して resize() が 0 回（修正前は描画のたびに呼ばれ 30 回）
// mapbox-gl 1.6.1（e2e/test.html が CDN から読む）は getPixelRatio を持たないので window.devicePixelRatio の経路を、
// maplibre-gl 4.5.0 は getPixelRatio の経路を通る。
import { test, expect, type Page } from '@playwright/test';

test.use({ deviceScaleFactor: 2, viewport: { width: 1280, height: 900 } });

const cases = [
  { mapID: 'maplibre', glProp: 'maplibreMap' },
  { mapID: 'mapbox', glProp: 'mapboxMap' },
] as const;

async function switchTo(page: Page, mapID: string) {
  await page.goto('/e2e/test.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => (window as any).__MAPLAT_APP__ != null, null, { timeout: 60_000 });
  await page.locator(`#${mapID}`).click();
  // 切り替わらない場合は skip にせず失敗にする（設計 §3.6）
  await page.waitForFunction(
    (id) => (window as any).__MAPLAT_APP__?.currentMapInfo?.().mapID === id,
    mapID,
    { timeout: 60_000 }
  );
  await page.waitForTimeout(3000);
}

test.describe('nov26-m4-t2 t2/AC4: DPR 2 で GL の canvas を描画ごとに resize しない', () => {
  for (const { mapID, glProp } of cases) {
    test(`${mapID}: 縮めた後の寸法が一致し、view 不変の 30 回の描画で resize 0 回`, async ({ page }) => {
      test.setTimeout(180_000);
      await switchTo(page, mapID);

      // 寸法の一致
      await page.evaluate(() => {
        const app = (window as any).__MAPLAT_APP__;
        // 縮めた後に OpenLayers が 1 回以上描画したことを数える（GL の寸法同期は描画の中で行われる）
        const w = window as any;
        w.__T2_POSTRENDER__ = 0;
        app.mapObject.on('postrender', () => { w.__T2_POSTRENDER__++; });
        (document.querySelector('.mainview') as HTMLElement).style.right = '40%';
        app.mapObject.updateSize();
      });
      // 設計 §3.6 は「2 秒待つ」だが、高負荷の swiftshader では 2 秒以内に OL の描画が 1 回も起きない
      // ことがあった（postrender 0 回で canvas が縮める前の寸法のまま。修正の前後どちらでも発生）。
      // ∴ 縮めた後の描画が 1 回以上起きるまで待ってから、さらに 2 秒待って測る。
      await page.waitForFunction(() => (window as any).__T2_POSTRENDER__ >= 1, null, { timeout: 60_000 });
      await page.waitForTimeout(2000);
      const diff = await page.evaluate((prop) => {
        const app = (window as any).__MAPLAT_APP__;
        const c = app[prop].getCanvas().getBoundingClientRect();
        const v = app.mapObject.getViewport().getBoundingClientRect();
        const canvas = app[prop].getCanvas();
        const container = app[prop].getContainer();
        return {
          width: Math.abs(c.width - v.width),
          height: Math.abs(c.height - v.height),
          detail: {
            canvasRect: [c.width, c.height],
            viewportRect: [v.width, v.height],
            canvasPx: [canvas.width, canvas.height],
            container: [container.clientWidth, container.clientHeight],
            postrender: (window as any).__T2_POSTRENDER__,
            pixelRatio: typeof app[prop].getPixelRatio === 'function' ? app[prop].getPixelRatio() : null,
          },
        };
      }, glProp);
      console.log(`T2_DIFF ${mapID} ${JSON.stringify(diff)}`);
      expect(diff.width).toBeLessThanOrEqual(1);
      expect(diff.height).toBeLessThanOrEqual(1);

      // 呼び出し回数
      const count = await page.evaluate(async (prop) => {
        const app = (window as any).__MAPLAT_APP__;
        const m = app[prop];
        const orig = m.resize;
        (window as any).__T2_RESIZE__ = 0;
        m.resize = function (...a: any[]) {
          (window as any).__T2_RESIZE__++;
          return orig.apply(this, a);
        };
        for (let i = 0; i < 30; i++) {
          app.mapObject.render();
          await new Promise((r) => requestAnimationFrame(() => r(undefined)));
        }
        return (window as any).__T2_RESIZE__ as number;
      }, glProp);
      console.log(`T2_RESIZE ${mapID} ${count}`);
      expect(count).toBe(0);
    });
  }
});
