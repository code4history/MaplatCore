import { test, expect, type Page } from '@playwright/test';

// 範囲外の POI について、lngLatToClientPoint が返す画面の点と、背面の marker 層に
// 描かれたピンの位置（地点の画素・当たり判定）が一致することを確かめる。
// デモの館林（?region=tatebayashi）で、縮尺を変えて紙の外を出してから測る。

const DEMO = '/?region=tatebayashi&cache=0';
const ZOOMS = [13, 14.5, 15, 16];
// ピンの頭の中心（地点から上へ）。アイコンの anchor は下端の中央。
const PIN_HEAD = 36;
// 許す差（px）。丸めの分だけ。
const TOLERANCE = 1;

const openDemo = async (page: Page): Promise<void> => {
  await page.goto(DEMO, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => (window as any).__MAPLAT_DEMO_APP__, undefined, { timeout: 60000 });
  await page.waitForSelector('#outside-poi-table tbody tr', { timeout: 30000 });
};

const zoomTo = async (page: Page, mercZoom: number): Promise<void> => {
  await page.evaluate((z) => {
    (window as any).__MAPLAT_DEMO_APP__.setViewpoint({ mercZoom: z });
  }, mercZoom);
  await page.waitForFunction(
    () => {
      const app = (window as any).__MAPLAT_DEMO_APP__;
      const front = app?.mapObject?.getView?.();
      const back = app?.backMap?.getView?.();
      return !!front && !front.getAnimating() && !front.getInteracting() && !!back && !back.getAnimating();
    },
    undefined,
    { timeout: 30000 }
  );
  // 背面は前面の描画に遅れて追従するので、数フレーム待つ
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        let n = 0;
        const step = () => (++n >= 5 ? resolve() : requestAnimationFrame(step));
        requestAnimationFrame(step);
      })
  );
};

// hit は画面の中にあるピンだけ測る（画面の外は当たり判定ができない）。差は画面の外でも測れる
type Row = { id: string; dx: number; dy: number; dist: number; onScreen: boolean; hit: boolean };

// 画面の中に地点がある背面のピンについて、lngLatToClientPoint の点と描かれた地点の差を測る
const measure = (page: Page): Promise<Row[]> =>
  page.evaluate(async (head) => {
    const app = (window as any).__MAPLAT_DEMO_APP__;
    const rect = app.backMap.getViewport().getBoundingClientRect();
    const [w, h] = app.backMap.getSize();
    const rows: Row[] = [];
    for (const f of app.backMap.getSource('marker').getFeatures()) {
      const datum = f.get('datum') || {};
      const tip = app.backMap.getPixelFromCoordinate(f.getGeometry().getCoordinates());
      if (!tip) continue;
      const onScreen = tip[0] >= 40 && tip[1] >= 60 && tip[0] <= w - 40 && tip[1] <= h - 10;
      const lnglat = datum.lnglat || [datum.lng ?? datum.longitude, datum.lat ?? datum.latitude];
      if (!lnglat || lnglat[0] == null) continue;
      const cp = await app.lngLatToClientPoint(lnglat[0], lnglat[1]);
      if (!cp) continue;
      const dx = cp.x - (rect.left + tip[0]);
      const dy = cp.y - (rect.top + tip[1]);
      // lngLatToClientPoint の点から頭の中心を押したとき、そのピンに当たるか
      const pixel = [cp.x - rect.left, cp.y - rect.top - head];
      const hits: string[] = [];
      app.backMap.forEachFeatureAtPixel(pixel, (g: any) => {
        hits.push(String(g.get('datum')?.namespaceID ?? ''));
      });
      const id = String(datum.namespaceID ?? '');
      rows.push({ id, dx, dy, dist: Math.hypot(dx, dy), onScreen, hit: hits.includes(id) });
    }
    return rows;
  }, PIN_HEAD);

test.describe('範囲外の POI と lngLatToClientPoint', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('縮尺によらず、返す点は背面に描かれたピンの地点と一致する', async ({ page }, info) => {
    test.setTimeout(120000);
    await openDemo(page);
    const report: Record<string, unknown> = {};
    for (const z of ZOOMS) {
      await zoomTo(page, z);
      const rows = await measure(page);
      const max = rows.reduce((m, r) => Math.max(m, r.dist), 0);
      const min = rows.reduce((m, r) => Math.min(m, r.dist), Infinity);
      report[String(z)] = {
        count: rows.length,
        min: Number(min.toFixed(1)),
        max: Number(max.toFixed(1)),
        onScreen: rows.filter((r) => r.onScreen).length,
        hits: rows.filter((r) => r.onScreen && r.hit).length,
        rows: rows.map((r) => [r.id, Number(r.dx.toFixed(1)), Number(r.dy.toFixed(1)), r.onScreen, r.hit])
      };
    }
    console.log(`[${info.project.name}] ${JSON.stringify(report)}`);
    // 当たり判定は少なくとも 1 つの縮尺で画面の中のピンについて測れている
    expect(ZOOMS.some((z) => (report[String(z)] as { onScreen: number }).onScreen > 0)).toBe(true);
    for (const z of ZOOMS) {
      const r = report[String(z)] as { count: number; max: number; onScreen: number; hits: number };
      expect(r.count, `縮尺 ${z} で範囲外のピンがある`).toBeGreaterThan(0);
      expect(r.max, `縮尺 ${z} の最大の差`).toBeLessThanOrEqual(TOLERANCE);
      expect(r.hits, `縮尺 ${z} で頭を押すと当たる`).toBe(r.onScreen);
    }
  });
});
