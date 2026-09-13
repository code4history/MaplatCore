import { test, expect, type Page } from '@playwright/test';

// oct26-m2-t4 AC5〜AC10 (a) の E2E（設計 docs/superpowers/specs/2026-09-14-oct26-m2-t4-design.md §7）。
// - MaplatCore#104: GPS / POI の表示候補から紙外の本図を除いてから 1・2 位を取る
// - MaplatCore#105: 表現範囲外の位置で setGPSMarker を呼んだら前の GPS マーカーを消し、イベントを出さない
// 地物の紙座標は app.from.sysCoord2Xy() で紙座標へ戻し、各成分の差 0.05 未満で一致とする。
//
// #104 系（AC5〜AC7・AC9）は @maplat/transform に merc2XyVisibleLayers が無い環境（standalone CI が
// Transform 1.0.0 を解決する間）では skip する。AC8（#105 範囲外）はフォールバック経路でも成立するので skip しない。
//
// 環境変数 OCT26_T4_TRANSFORM_DIST に @maplat/transform 1.0.0 相当の dist（例: MaplatTransform 46975d4 の
// commit 済み dist/maplat_transform.js を書き出したファイル）を与えると、ブラウザが読む Transform をその版へ
// 差し替える（AC10: 新 Core ＋ Transform 1.0.0 の組み合わせ。scripts/oct26-m2-t4/ac10.zsh の (d)）。

const SKIP_REASON =
  '@maplat/transform に merc2XyVisibleLayers が無い。M6 の lock 再生成後に有効';
const TOL = 0.05;
const ACC = 60;

// 1932 延岡 v2（設計 §6.4）
const NOBEOKA_INSIDE: [number, number] = [131.655753, 32.556258];
const NOBEOKA_OUT: [number, number] = [131.644679, 32.613064];
const NOBEOKA_104: [number, number] = [131.635619, 32.569472];
const NOBEOKA_9: [number, number] = [131.658501, 32.600698];

// 合成 fixture: 本図の紙座標 (x,y) ↔ メルカトル (14600000 + 2x, 3800000 − 2y)（設計 §6.1）
const R = 6378137;
const mainPx2LngLat = ([x, y]: [number, number]): [number, number] => {
  const mx = 14600000 + 2 * x;
  const my = 3800000 - 2 * y;
  return [
    (mx / R) * (180 / Math.PI),
    (2 * Math.atan(Math.exp(my / R)) - Math.PI / 2) * (180 / Math.PI)
  ];
};
// A の紙座標 (570,1300) は層 3（A）の対応式で本図の紙座標 (357.5,412.5) へ写す（設計 §6.1 m-2）
const SYN_POINTS: [string, [number, number]][] = [
  ['(700,900) 駅前', [700, 900]],
  ['(1200,700) 市内', [1200, 700]],
  ['(1700,1250)', [1700, 1250]],
  ['(1700,290)', [1700, 290]],
  ['A の (570,1300)', [357.5, 412.5]],
  ['#104 の本図 (-500,768)', [-500, 768]]
];

type Xy = [number, number];
interface GpsState {
  total: number;
  main: Xy | null;
  circle: Xy | null;
  subs: Xy[];
}

const TRANSFORM_DIST = process.env.OCT26_T4_TRANSFORM_DIST;

async function openApp(page: Page, start: string) {
  const pageErrors: string[] = [];
  if (TRANSFORM_DIST) {
    await page.route('**/MaplatTransform/dist/maplat_transform.js*', route =>
      route.fulfill({ path: TRANSFORM_DIST, contentType: 'application/javascript' })
    );
  }
  page.on('pageerror', err => pageErrors.push(String(err)));
  page.on('console', m => {
    if (m.type() === 'error') console.log('BROWSER', m.type(), m.text().slice(0, 300));
  });
  await page.goto(`/e2e/oct26-m2-t4-gps-poi.html?start=${start}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(
    () => (window as any).__MAPLAT_APP__ !== undefined || (window as any).__MAPLAT_ERROR__ !== undefined,
    null,
    { polling: 200, timeout: 60000 }
  );
  const err = await page.evaluate(() => (window as any).__MAPLAT_ERROR__);
  expect(err, 'createObject が失敗した').toBeUndefined();
  if (TRANSFORM_DIST) {
    // 差し替えが効いている（新メソッドが無い）ことを確かめる。効いていなければ組み合わせ試験として無効
    expect(await hasVisibleLayers(page), 'Transform の差し替えが効いていない').toBe(false);
    console.log('TRANSFORM_DIST_IN_USE', TRANSFORM_DIST);
  }
  await page.evaluate(() => {
    const w = window as any;
    w.__T4_EVENTS__ = [];
    w.__T4_REJECTIONS__ = [];
    window.addEventListener('unhandledrejection', ev => w.__T4_REJECTIONS__.push(String(ev.reason)));
    for (const type of ['gps_error', 'gps_result', 'gps_request']) {
      w.__MAPLAT_APP__.addEventListener(type, () => w.__T4_EVENTS__.push(type));
    }
  });
  return pageErrors;
}

async function hasVisibleLayers(page: Page): Promise<boolean> {
  return page.evaluate(
    () => typeof (window as any).__MAPLAT_APP__.from.mapTransform?.merc2XyVisibleLayers === 'function'
  );
}

async function settle(page: Page, ms = 300) {
  await page.waitForTimeout(ms);
}

async function setGps(page: Page, lnglat: [number, number]) {
  await page.evaluate(
    ([ll, acc]) => (window as any).__MAPLAT_APP__.setGPSMarker({ lnglat: ll, acc }),
    [lnglat, ACC] as [[number, number], number]
  );
  await settle(page);
}

async function gpsState(page: Page): Promise<GpsState> {
  return page.evaluate(() => {
    const app = (window as any).__MAPLAT_APP__;
    const feats = app.mapObject.getSource('gps').getFeatures();
    const toXy = (c: number[]) => app.from.sysCoord2Xy(c) as [number, number];
    let circle: [number, number] | null = null;
    const points: [number, number][] = [];
    for (const f of feats) {
      const g = f.getGeometry();
      if (g.getType() === 'Circle') circle = toXy(g.getCenter());
      else if (g.getType() === 'Point') points.push(toXy(g.getCoordinates()));
    }
    // main は精度円の中心と一致する Point。残りが sub
    let main: [number, number] | null = null;
    const subs: [number, number][] = [];
    for (const p of points) {
      if (!main && circle && Math.abs(p[0] - circle[0]) < 1e-6 && Math.abs(p[1] - circle[1]) < 1e-6) main = p;
      else subs.push(p);
    }
    return { total: feats.length, main, circle, subs };
  });
}

async function markerXys(page: Page): Promise<Xy[]> {
  return page.evaluate(() => {
    const app = (window as any).__MAPLAT_APP__;
    return app.mapObject
      .getSource('marker')
      .getFeatures()
      .map((f: any) => app.from.sysCoord2Xy(f.getGeometry().getCoordinates()));
  });
}

async function addMarker(page: Page, lnglat: [number, number], name: string) {
  await page.evaluate(
    ([ll, n]) => (window as any).__MAPLAT_APP__.addMarker({ lnglat: ll, name: n }),
    [lnglat, name] as [[number, number], string]
  );
  await settle(page, 500);
}

async function clearAll(page: Page) {
  await page.evaluate(() => {
    const app = (window as any).__MAPLAT_APP__;
    app.clearMarker('main');
    app.setGPSMarker(null);
  });
  await settle(page, 500);
}

function expectXy(actual: Xy | null | undefined, expected: Xy, label: string) {
  expect(actual, `${label}: 地物が無い`).toBeTruthy();
  expect(Math.abs(actual![0] - expected[0]), `${label}: x ${actual![0]} ≠ ${expected[0]}`).toBeLessThan(TOL);
  expect(Math.abs(actual![1] - expected[1]), `${label}: y ${actual![1]} ≠ ${expected[1]}`).toBeLessThan(TOL);
}

function expectNoFeatureAt(state: GpsState, xy: Xy, label: string) {
  const all = [state.main, state.circle, ...state.subs].filter(Boolean) as Xy[];
  for (const p of all) {
    const near = Math.abs(p[0] - xy[0]) < 1 && Math.abs(p[1] - xy[1]) < 1;
    expect(near, `${label}: (${xy[0]},${xy[1]}) に地物がある`).toBe(false);
  }
}

async function events(page: Page): Promise<string[]> {
  return page.evaluate(() => (window as any).__T4_EVENTS__);
}

test.describe('oct26-m2-t4 GPS / POI の層選択', () => {
  test.setTimeout(180000);
  test.use({ viewport: { width: 1024, height: 768 } });

  test('#104 実データ GPS: 延岡 v2 で本図紙外・挿入図対応の地点は挿入図へ描く (AC5)', async ({ page }) => {
    await openApp(page, 'nobeoka1932');
    test.skip(!(await hasVisibleLayers(page)), SKIP_REASON);
    await setGps(page, NOBEOKA_104);
    const s = await gpsState(page);
    console.log('AC5_STATE', JSON.stringify(s));
    expect(s.total).toBe(2);
    expectXy(s.main, [8500.46, 1500.08], 'main');
    expectXy(s.circle, [8500.46, 1500.08], '精度円の中心');
    expect(s.subs).toHaveLength(0);
    expectNoFeatureAt(s, [2958.21, -1898.25], '本図候補');
  });

  test('#104 POI と合成データ: addMarker 経路と合成 5 層・D-4layer が是正後の表示と一致 (AC6)', async ({ page }) => {
    // (a) 延岡 v2 の addMarker（addMarker → redrawMarkers → setMarker 経路）
    await openApp(page, 'nobeoka1932');
    test.skip(!(await hasVisibleLayers(page)), SKIP_REASON);
    await addMarker(page, NOBEOKA_104, 'ac6a');
    const ma = await markerXys(page);
    console.log('AC6a_MARKERS', JSON.stringify(ma));
    expect(ma).toHaveLength(1);
    expectXy(ma[0], [8500.46, 1500.08], 'ピン');

    // (b) 合成 5 層（設計 §6.2「是正後の表示」列）
    await openApp(page, 'synthetic5');
    const expected: Record<string, { gps: number; main: Xy; sub?: Xy }> = {
      '(700,900) 駅前': { gps: 3, main: [1700, 1250], sub: [700, 900] },
      '(1200,700) 市内': { gps: 3, main: [1200, 700], sub: [1704.4, 288.3] },
      '(1700,1250)': { gps: 2, main: [1716.9, 302.05] },
      '(1700,290)': { gps: 2, main: [1716.9, 278.05] },
      'A の (570,1300)': { gps: 3, main: [357.5, 412.5], sub: [1683.34, 281.11] },
      '#104 の本図 (-500,768)': { gps: 2, main: [1661.9, 290] }
    };
    for (const [label, px] of SYN_POINTS) {
      const e = expected[label];
      const ll = mainPx2LngLat(px);
      await clearAll(page);
      await setGps(page, ll);
      const s = await gpsState(page);
      console.log('AC6b_GPS', label, JSON.stringify(s));
      expect(s.total, `${label}: GPS 地物数`).toBe(e.gps);
      expectXy(s.main, e.main, `${label}: main`);
      expectXy(s.circle, e.main, `${label}: 精度円`);
      if (e.sub) {
        expect(s.subs, `${label}: sub の件数`).toHaveLength(1);
        expectXy(s.subs[0], e.sub, `${label}: sub`);
      } else {
        expect(s.subs, `${label}: sub の件数`).toHaveLength(0);
      }
      await addMarker(page, ll, `ac6b-${label}`);
      const m = await markerXys(page);
      console.log('AC6b_MARKERS', label, JSON.stringify(m));
      expect(m, `${label}: ピン件数`).toHaveLength(1);
      expectXy(m[0], e.main, `${label}: ピン`);
    }

    // (c) D-4layer の (1700,1250): GPS 0 件・ピン 0 件
    await openApp(page, 'synthetic4');
    const ll4 = mainPx2LngLat([1700, 1250]);
    await setGps(page, ll4);
    const s4 = await gpsState(page);
    await addMarker(page, ll4, 'ac6c');
    const m4 = await markerXys(page);
    console.log('AC6c', JSON.stringify(s4), JSON.stringify(m4));
    expect(s4.total).toBe(0);
    expect(m4).toHaveLength(0);
  });

  test('紙外本図除外後の2位: D-6layer の本図 (-500,768) で main 広域図・sub 広域図 C (AC7)', async ({ page }) => {
    await openApp(page, 'synthetic6');
    test.skip(!(await hasVisibleLayers(page)), SKIP_REASON);
    await setGps(page, mainPx2LngLat([-500, 768]));
    const s = await gpsState(page);
    console.log('AC7_STATE', JSON.stringify(s));
    expect(s.total).toBe(3);
    expectXy(s.main, [1661.9, 290], 'main');
    expectXy(s.circle, [1661.9, 290], '精度円');
    expect(s.subs).toHaveLength(1);
    expectXy(s.subs[0], [301.9, 290], 'sub');
  });

  test('#105 範囲外で0件・イベントなし: 紙内 3 件 → 範囲外で 0 件 (AC8)', async ({ page }) => {
    await openApp(page, 'nobeoka1932');
    await setGps(page, NOBEOKA_INSIDE);
    const s1 = await gpsState(page);
    console.log('AC8_INSIDE', JSON.stringify(s1));
    expect(s1.total).toBe(3);
    expectXy(s1.main, [500.01, 500.1], 'main');
    expectXy(s1.circle, [500.01, 500.1], '精度円');
    expect(s1.subs).toHaveLength(1);
    expectXy(s1.subs[0], [7845.84, 1574.9], 'sub');

    await setGps(page, NOBEOKA_OUT);
    const s2 = await gpsState(page);
    console.log('AC8_OUT', JSON.stringify(s2));
    expect(s2.total).toBe(0);
    expect(await events(page)).toEqual([]);
  });

  test('#105 置換とPOI保持: 範囲内→範囲内の置換、範囲外でも POI は残る (AC9)', async ({ page }) => {
    await openApp(page, 'nobeoka1932');
    test.skip(!(await hasVisibleLayers(page)), SKIP_REASON);
    await setGps(page, NOBEOKA_INSIDE);
    expect((await gpsState(page)).total).toBe(3);

    await setGps(page, NOBEOKA_104);
    const s = await gpsState(page);
    console.log('AC9_REPLACE', JSON.stringify(s));
    expect(s.total).toBe(2);
    expectXy(s.main, [8500.46, 1500.08], 'main');
    expectNoFeatureAt(s, [500.01, 500.1], '前の main');
    expectNoFeatureAt(s, [7845.84, 1574.9], '前の sub');

    await addMarker(page, NOBEOKA_104, 'ac9');
    expect(await markerXys(page)).toHaveLength(1);

    await setGps(page, NOBEOKA_OUT);
    const s2 = await gpsState(page);
    const m2 = await markerXys(page);
    console.log('AC9_OUT', JSON.stringify(s2), JSON.stringify(m2));
    expect(s2.total).toBe(0);
    expect(m2).toHaveLength(1);
    expectXy(m2[0], [8500.46, 1500.08], 'POI');
    expect(await events(page)).toEqual([]);
  });

  test('C-3 互換: 3 地図間の changeMap 2 周と各地図での setGPSMarker で例外なし (AC10a)', async ({ page }) => {
    const pageErrors = await openApp(page, 'synthetic5');
    const gpsPoints: [number, number][] = [
      ...SYN_POINTS.map(([, px]) => mainPx2LngLat(px)),
      NOBEOKA_INSIDE,
      NOBEOKA_OUT,
      NOBEOKA_104,
      NOBEOKA_9
    ];
    const maps = ['synthetic5', 'synthetic4', 'nobeoka1932'];
    let resolved = 0;
    for (let round = 0; round < 2; round++) {
      for (const mapID of maps) {
        const ok = await page.evaluate(
          async id => {
            const app = (window as any).__MAPLAT_APP__;
            const timeout = new Promise(res => setTimeout(() => res('timeout'), 30000));
            const r = await Promise.race([app.changeMap(id).then(() => 'resolved'), timeout]);
            return r === 'resolved' && app.from.mapID === id;
          },
          mapID
        );
        expect(ok, `changeMap(${mapID}) round ${round}`).toBe(true);
        resolved++;
        for (const ll of gpsPoints) {
          await page.evaluate(
            ([p, acc]) => (window as any).__MAPLAT_APP__.setGPSMarker({ lnglat: p, acc }),
            [ll, ACC] as [[number, number], number]
          );
          await settle(page, 100);
        }
      }
    }
    await settle(page, 500);
    const rejections = await page.evaluate(() => (window as any).__T4_REJECTIONS__);
    console.log('AC10a', JSON.stringify({ resolved, pageErrors, rejections }));
    expect(resolved).toBe(6);
    expect(pageErrors).toEqual([]);
    expect(rejections).toEqual([]);
  });
});
