import { test, expect, type Page } from '@playwright/test';

// 古地図の紙の外を押したとき、clientPointToLngLat が背面の地図に見えている地点を返し、
// lngLatToClientPoint と往復することを、デモの館林（?region=tatebayashi）で確かめる。
//   - 画面を格子に区切った点ごとに、紙の内（前面）と紙の外（背面）で往復の差を測る
//   - 背面に描かれた範囲外のピンの地点を押すと、その POI の経緯度が返る
//   - 紙の縁をまたぐ隣どうしの画素で、判定が前面・背面に切り替わる

const DEMO = '/?region=tatebayashi&cache=0';
const ZOOMS = [13, 14.5, 15, 16];
// 許す差（px）。丸めの分だけ。
const TOLERANCE = 1;
// 格子の分け方（画面の端は 20 px 内側から）
const GRID = { cols: 12, rows: 8, margin: 20 };

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

// 1 点の測定。where は押した点が紙の内（front）か外（back）か。
// placeOnPaper は返った地点が紙の内に描かれるか（紙の外を押しても、地点そのものは紙の上に
// 描かれていることがある。背面と前面の変換が縁で一致しないため。その点は往復しない）
type Sample = {
  px: [number, number];
  where: 'front' | 'back';
  placeOnPaper: boolean;
  // 返った経緯度と、背面の地図のその画素の経緯度の差（m）。紙の外で 0 になるはず
  backDiff: number;
  // 往復の差（px）
  roundTrip: number;
};

const sampleGrid = (page: Page, grid: typeof GRID): Promise<Sample[]> =>
  page.evaluate(async (g) => {
    const R = 6378137;
    const toMerc = (ll: number[]) => [
      (ll[0] * Math.PI * R) / 180,
      R * Math.log(Math.tan(Math.PI / 4 + (ll[1] * Math.PI) / 360))
    ];
    const app = (window as any).__MAPLAT_DEMO_APP__;
    const front = app.mapObject;
    const back = app.backMap;
    const from = app.from;
    const fr = front.getViewport().getBoundingClientRect();
    const br = back.getViewport().getBoundingClientRect();
    const [w, h] = front.getSize();
    const out: any[] = [];
    for (let i = 0; i < g.cols; i++) {
      for (let j = 0; j < g.rows; j++) {
        const x = g.margin + ((w - 2 * g.margin) * i) / (g.cols - 1);
        const y = g.margin + ((h - 2 * g.margin) * j) / (g.rows - 1);
        const cx = fr.left + x;
        const cy = fr.top + y;
        const xy = front.getCoordinateFromPixel([x, y]);
        const where = from.insideCheckSysCoord(xy) ? 'front' : 'back';
        const r = await app.clientPointToLngLat(cx, cy);
        if (!r) continue;
        const merc = toMerc([r.longitude, r.latitude]);
        const backMerc = back.getCoordinateFromPixel([cx - br.left, cy - br.top]);
        const backDiff = Math.hypot(merc[0] - backMerc[0], merc[1] - backMerc[1]);
        const placeXy = await from.merc2SysCoordAsync_ignoreBackground(merc);
        const placeOnPaper = !!placeXy && !!from.insideCheckSysCoord(placeXy);
        const cp = await app.lngLatToClientPoint(r.longitude, r.latitude);
        const roundTrip = cp ? Math.hypot(cp.x - cx, cp.y - cy) : Infinity;
        out.push({ px: [x, y], where, placeOnPaper, backDiff, roundTrip });
      }
    }
    return out;
  }, grid);

// 背面に描かれた範囲外のピンの地点を押して返る経緯度と、POI の経緯度の差（px 相当）。
// 地点が紙に覆われているピンは除く
type PinRow = { id: string; diffPx: number };
const samplePins = (page: Page): Promise<PinRow[]> =>
  page.evaluate(async () => {
    const R = 6378137;
    const toMerc = (ll: number[]) => [
      (ll[0] * Math.PI * R) / 180,
      R * Math.log(Math.tan(Math.PI / 4 + (ll[1] * Math.PI) / 360))
    ];
    const app = (window as any).__MAPLAT_DEMO_APP__;
    const back = app.backMap;
    const res = back.getView().getResolution();
    const rect = back.getViewport().getBoundingClientRect();
    const rows: PinRow[] = [];
    for (const f of back.getSource('marker').getFeatures()) {
      const datum = f.get('datum') || {};
      const lnglat = datum.lnglat || [datum.lng ?? datum.longitude, datum.lat ?? datum.latitude];
      if (!lnglat || lnglat[0] == null) continue;
      const tip = back.getPixelFromCoordinate(f.getGeometry().getCoordinates());
      if (!tip) continue;
      // 地点が紙に覆われている（前面の紙の内に重なる）ピンは押せないので測らない
      const fr = app.mapObject.getViewport().getBoundingClientRect();
      const fxy = app.mapObject.getCoordinateFromPixel([rect.left + tip[0] - fr.left, rect.top + tip[1] - fr.top]);
      if (fxy && app.from.insideCheckSysCoord(fxy)) continue;
      const r = await app.clientPointToLngLat(rect.left + tip[0], rect.top + tip[1]);
      if (!r) continue;
      const a = toMerc(lnglat);
      const b = toMerc([r.longitude, r.latitude]);
      rows.push({ id: String(datum.namespaceID ?? ''), diffPx: Math.hypot(a[0] - b[0], a[1] - b[1]) / res });
    }
    return rows;
  });

// 紙の縁をまたぐ隣どうしの画素（内側・外側）を探して測る
type Edge = {
  inside: { px: number[]; roundTrip: number };
  outside: { px: number[]; backDiff: number };
  // 縁の両側の画素が返す地点の隔たり（px 相当。前面と背面の変換が縁で一致しない分）
  gapPx: number;
} | null;
const sampleEdge = (page: Page): Promise<Edge> =>
  page.evaluate(async () => {
    const R = 6378137;
    const toMerc = (ll: number[]) => [
      (ll[0] * Math.PI * R) / 180,
      R * Math.log(Math.tan(Math.PI / 4 + (ll[1] * Math.PI) / 360))
    ];
    const app = (window as any).__MAPLAT_DEMO_APP__;
    const front = app.mapObject;
    const back = app.backMap;
    const from = app.from;
    const res = back.getView().getResolution();
    const fr = front.getViewport().getBoundingClientRect();
    const br = back.getViewport().getBoundingClientRect();
    const [w, h] = front.getSize();
    const isIn = (p: number[]) => !!from.insideCheckSysCoord(front.getCoordinateFromPixel(p));
    // 中央に近い横線（上下へ 40 px ずつ）、見つからなければ縦線（左右へ 40 px ずつ）で、
    // 縁をまたぐ隣どうしの画素を探す
    const find = (): [number[], number[]] | null => {
      for (const [len, across, mk] of [
        [w, h, (t: number, u: number) => [t, u]],
        [h, w, (t: number, u: number) => [u, t]]
      ] as [number, number, (t: number, u: number) => number[]][]) {
        for (let k = 0; k <= across / 40; k++) {
          const u = Math.round(across / 2 + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 40);
          if (u < 0 || u >= across) continue;
          for (let t = 1; t < len; t++) {
            const a = mk(t - 1, u);
            const b = mk(t, u);
            if (isIn(a) !== isIn(b)) return isIn(a) ? [a, b] : [b, a];
          }
        }
      }
      return null;
    };
    const pair = find();
    if (!pair) return null;
    const [pin, pout] = pair;
    const rin = await app.clientPointToLngLat(fr.left + pin[0], fr.top + pin[1]);
    const rout = await app.clientPointToLngLat(fr.left + pout[0], fr.top + pout[1]);
    const cin = await app.lngLatToClientPoint(rin.longitude, rin.latitude);
    const min = toMerc([rin.longitude, rin.latitude]);
    const mout = toMerc([rout.longitude, rout.latitude]);
    const bout = back.getCoordinateFromPixel([fr.left + pout[0] - br.left, fr.top + pout[1] - br.top]);
    return {
      inside: { px: pin, roundTrip: Math.hypot(cin.x - (fr.left + pin[0]), cin.y - (fr.top + pin[1])) },
      outside: { px: pout, backDiff: Math.hypot(mout[0] - bout[0], mout[1] - bout[1]) / res },
      gapPx: Math.hypot(min[0] - mout[0], min[1] - mout[1]) / res
    };
  });

test.describe('紙の外の clientPointToLngLat', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('紙の外は背面の地点を返し、lngLatToClientPoint と往復する', async ({ page }, info) => {
    test.setTimeout(180000);
    await openDemo(page);
    const report: Record<string, unknown> = {};
    for (const z of ZOOMS) {
      await zoomTo(page, z);
      const samples = await sampleGrid(page, GRID);
      const pins = await samplePins(page);
      const edge = await sampleEdge(page);
      const frontS = samples.filter((s) => s.where === 'front');
      const backS = samples.filter((s) => s.where === 'back');
      const backOff = backS.filter((s) => !s.placeOnPaper);
      const max = (xs: number[]) => Number(xs.reduce((m, v) => Math.max(m, v), 0).toFixed(2));
      report[String(z)] = {
        front: { n: frontS.length, maxRoundTrip: max(frontS.map((s) => s.roundTrip)) },
        back: {
          n: backS.length,
          maxBackDiffM: max(backS.map((s) => s.backDiff)),
          offPaper: backOff.length,
          maxRoundTrip: max(backOff.map((s) => s.roundTrip)),
          // 紙の外を押して返る地点が紙の上に描かれる点（往復しない。縁の近くだけ）
          placeOnPaper: backS.length - backOff.length
        },
        pins: { n: pins.length, maxDiffPx: max(pins.map((p) => p.diffPx)) },
        edge
      };
    }
    console.log(`[${info.project.name}] ${JSON.stringify(report)}`);
    // 紙の外を押して、返る地点も紙の外にある点（往復を測れる点）が少なくとも 1 つの縮尺にある。
    // 縮尺 16 では、紙の外を押して返る背面の地点がすべて紙の上にも描かれている（前面と背面の
    // 変換が縁で一致しないため）。その点の lngLatToClientPoint は紙の上の位置を返すので往復しない
    expect(ZOOMS.some((z) => (report[String(z)] as any).back.offPaper > 0)).toBe(true);
    // 紙に覆われていない背面のピンを、少なくとも 1 つの縮尺で測れている
    expect(ZOOMS.some((z) => (report[String(z)] as any).pins.n > 0)).toBe(true);
    for (const z of ZOOMS) {
      const r = report[String(z)] as any;
      expect(r.front.n, `縮尺 ${z} で紙の内の点がある`).toBeGreaterThan(0);
      expect(r.back.n, `縮尺 ${z} で紙の外を押す点がある`).toBeGreaterThan(0);
      expect(r.front.maxRoundTrip, `縮尺 ${z} 紙の内の往復の差`).toBeLessThanOrEqual(TOLERANCE);
      // 紙の外は背面の地図の地点そのもの（丸めの分だけ。m 単位で 1 cm 未満）
      expect(r.back.maxBackDiffM, `縮尺 ${z} 紙の外は背面の地点`).toBeLessThan(0.01);
      expect(r.back.maxRoundTrip, `縮尺 ${z} 紙の外の往復の差`).toBeLessThanOrEqual(TOLERANCE);
      expect(r.pins.maxDiffPx, `縮尺 ${z} 背面のピンの地点を押すと POI の経緯度`).toBeLessThanOrEqual(TOLERANCE);
      expect(r.edge, `縮尺 ${z} で画面に紙の縁がある`).not.toBeNull();
      expect(r.edge.inside.roundTrip, `縮尺 ${z} 縁の内側の往復`).toBeLessThanOrEqual(TOLERANCE);
      expect(r.edge.outside.backDiff, `縮尺 ${z} 縁の外側は背面の地点`).toBeLessThanOrEqual(0.01);
    }
  });
});
