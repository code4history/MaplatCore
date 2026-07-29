import { test, expect } from '@playwright/test';

// m18-t4: pois ラッパー（{layer, hide/title/icon/selectedIcon}）の実ブラウザ到達検証（設計 §6.2）。
// 既存 consumption.spec.ts の3テストには手を入れず、新規 spec として独立させる（Info-3）。

const fixturePath = '/tests/consumption/pois-layer-ref.html';

async function waitForReady(page) {
  await expect(page.locator('#status')).toHaveText(/SUCCESS/, { timeout: 15000 });
  // __maplatApp が window に公開されるまで待つ
  await page.waitForFunction(() => !!(window as any).__maplatApp, undefined, { timeout: 15000 });
  return async () => (await page.evaluate(() => (window as any).__maplatApp))!;
}

test.describe('pois layer ref (wrapper) — viewer 到達', () => {
  test('AC4-11: ラッパー hide:true のレイヤはマーカーが描画されず、他レイヤは描画される', async ({ page }) => {
    await page.goto(fixturePath);
    await waitForReady(page);

    // cluster 到達: app.pois["hidden"].hide === true
    const hiddenHide = await page.evaluate(() =>
      (window as any).__maplatApp?.pois?.['hidden']?.hide
    );
    expect(hiddenHide).toBe(true);

    // 描画数: B(plain)=1 + C(iconized)=1 = 2。A(hidden)の2 POI は非表示
    const markerCount = await page.evaluate(() => {
      const app = (window as any).__maplatApp;
      return app.mapObject.getSource('marker').getFeatures().length;
    });
    expect(markerCount).toBe(2);

    // listPoiLayers(true) に hidden が含まれる
    const hiddenList = await page.evaluate(() => {
      const app = (window as any).__maplatApp;
      return app.listPoiLayers(true).map((l: any) => l.namespaceID);
    });
    expect(hiddenList.some((ns: string) => ns.includes('hidden'))).toBe(true);
  });

  test('AC4-11 補: showPoiLayer("hidden") 後はマーカーが 4 に増える', async ({ page }) => {
    await page.goto(fixturePath);
    await waitForReady(page);

    await page.evaluate(() => (window as any).__maplatApp.showPoiLayer('hidden'));
    // redrawMarkers が非同期で走るため少し待つ
    await page.waitForTimeout(500);
    const markerCount = await page.evaluate(() => {
      const app = (window as any).__maplatApp;
      return app.mapObject.getSource('marker').getFeatures().length;
    });
    expect(markerCount).toBe(4);
  });

  test('AC4-12: ラッパー icon 上書きがマーカー画像に反映される', async ({ page }) => {
    await page.goto(fixturePath);
    await waitForReady(page);

    // cluster 到達: app.pois["iconized"].icon === 指定値（fixture で window.__testIcon に公開）
    const { testIcon, clusterIcon } = await page.evaluate(() => ({
      testIcon: (window as any).__testIcon,
      clusterIcon: (window as any).__maplatApp?.pois?.['iconized']?.icon
    }));
    expect(clusterIcon).toBe(testIcon);

    // マーカー画像の実検証: OL feature の style から src を取得
    const srcs = await page.evaluate(() => {
      const app = (window as any).__maplatApp;
      const features = app.mapObject.getSource('marker').getFeatures();
      return features.map((f: any) => {
        const style = f.getStyle();
        const image = style && style.getImage ? style.getImage() : null;
        const src = image && image.getSrc ? image.getSrc() : null;
        const datum = f.get('datum');
        const nsid = datum && datum.namespaceID;
        return { src, namespaceID: nsid };
      });
    });

    // iconized 名前空間の feature が指定した icon 値（base64 data URL）を持つこと
    const iconized = srcs.find(s => s.namespaceID && s.namespaceID.includes('iconized'));
    expect(iconized).toBeDefined();
    expect(iconized.src).toBe(testIcon);
  });
});
