// 範囲外の POI を選んでいる間の地図の挙動（選択・外す・外し替え・地図の切り替え・GPS）。
// 実物の MaplatApp を使い、地図の座標変換と視点の決め方だけを stub に差し替える。
import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { MaplatApp } from "../src/index";
import { settleOutsideSelection } from "../src/outside_pois";

beforeAll(() => {
  if (typeof (globalThis as any).ResizeObserver === "undefined") {
    const noop = () => undefined;
    (globalThis as any).ResizeObserver = class {
      observe = noop;
      unobserve = noop;
      disconnect = noop;
    };
  }
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

async function flush() {
  for (let i = 0; i < 16; i++) await Promise.resolve();
}

/** 前面の地図（古地図）の代わり。範囲の内か外かだけを差し替える。 */
function makeSource(inside: (xy: number[]) => boolean = () => true) {
  return {
    mapID: "hist",
    insideCheckSysCoord: (xy: number[]) => inside(xy),
    modulateSysCoordInside: () => [7, 7],
    merc2SysCoordAsync_ignoreBackground: async (merc: number[]) => mercHalf(merc),
    // 古地図（メルカトルの地図ではない）
    isWmts: () => false
  };
}

function mercHalf(merc: number[]) {
  return [merc[0] / 2, merc[1] / 2];
}

async function bootApp() {
  const div = document.createElement("div");
  document.body.appendChild(div);
  const app = new MaplatApp({ div, setting: { sources: [] } });
  await app.waitReady;
  // 視点の決め方（座標変換の連鎖）はここでは見ない
  app.setViewpoint = vi.fn() as any;
  app.pois = {
    main: { pois: [{ id: "p1", namespaceID: "p1", lnglat: [139.7, 35.7] }], hide: false }
  };
  return app;
}

describe("範囲外の POI を選ぶ", () => {
  it("範囲外を選ぶと merc を控えて中心をその POI に合わせる", async () => {
    const app = await bootApp();
    app.from = makeSource(() => false) as any;
    app.selectMarker("p1");
    // 判定が終わるまでは引き戻しを止める
    expect(app.__outsideSelection).toMatchObject({ id: "p1", pending: true });
    await flush();
    expect(app.__outsideSelection).toMatchObject({ id: "p1" });
    // 控えるのは POI のメルカトル
    const { transform } = await import("ol/proj");
    const merc = transform([139.7, 35.7], "EPSG:4326", "EPSG:3857");
    expect(app.__outsideSelection!.merc![0]).toBeCloseTo(merc[0], 6);
    expect(app.__outsideSelection!.merc![1]).toBeCloseTo(merc[1], 6);
    expect(app.setViewpoint).toHaveBeenLastCalledWith({
      longitude: 139.7,
      latitude: 35.7
    });
  });

  it("範囲内を選ぶと __outsideSelection は外れる（中心は従来どおり）", async () => {
    const app = await bootApp();
    app.from = makeSource(() => true) as any;
    app.selectMarker("p1");
    await flush();
    expect(app.__outsideSelection).toBeUndefined();
    // 中心は選んだ POI（選んだ直後と同じ経緯度）
    expect(app.setViewpoint).toHaveBeenLastCalledWith({
      longitude: 139.7,
      latitude: 35.7
    });
  });

  it("外すと __outsideSelection が外れ、引き戻しは microtask の後に来る", async () => {
    const app = await bootApp();
    app.from = makeSource(() => false) as any;
    app.selectMarker("p1");
    await flush();
    const view = app.mapObject.getView();
    const setCenter = vi.spyOn(view, "setCenter");
    app.unselectMarker();
    expect(app.__selectedMarker).toBeUndefined();
    expect(app.__outsideSelection).toBeUndefined();
    // 同じ tick ではまだ引き戻さない（直後に選び直せるように）
    expect(setCenter).not.toHaveBeenCalled();
    await flush();
    expect(setCenter).toHaveBeenCalledWith([7, 7]);
  });

  it("外 → 外: 同じ tick で選び直すと縁へ引き戻さない", async () => {
    const app = await bootApp();
    app.from = makeSource(() => false) as any;
    app.selectMarker("p1");
    await flush();
    const view = app.mapObject.getView();
    const setCenter = vi.spyOn(view, "setCenter");
    app.unselectMarker();
    app.selectMarker("p1");
    await flush();
    expect(setCenter).not.toHaveBeenCalled();
    expect(app.__outsideSelection).toMatchObject({ id: "p1" });
  });

  it("外 → 内: 同じ tick で範囲内を選び直すと引き戻さない", async () => {
    const app = await bootApp();
    app.from = makeSource(() => false) as any;
    // まず範囲外に見える POI を選ぶ
    app.pois.main.pois.push({ id: "p2", namespaceID: "p2", lnglat: [139.0, 35.0] });
    app.selectMarker("p1");
    await flush();
    expect(app.__outsideSelection).toBeDefined();
    const view = app.mapObject.getView();
    const setCenter = vi.spyOn(view, "setCenter");
    // 切り替えて範囲内になった POI を選ぶ
    app.from = makeSource(() => true) as any;
    app.unselectMarker();
    app.selectMarker("p2");
    await flush();
    expect(setCenter).not.toHaveBeenCalled();
    expect(app.__outsideSelection).toBeUndefined();
    expect(app.__selectedMarker).toBe("p2");
  });

  it("内 → 外: 範囲内の選択から範囲外へ選び直すと merc を控える", async () => {
    const app = await bootApp();
    app.pois.main.pois.push({ id: "p2", namespaceID: "p2", lnglat: [139.9, 35.9] });
    app.from = makeSource(() => true) as any;
    app.selectMarker("p1");
    await flush();
    expect(app.__outsideSelection).toBeUndefined();
    app.from = makeSource(() => false) as any;
    app.selectMarker("p2");
    await flush();
    expect(app.__outsideSelection).toMatchObject({ id: "p2" });
    // 選び直しの間に引き戻しが挟まらない（中心が縁へ飛ばない）
    expect(app.setViewpoint).toHaveBeenCalled();
  });
});

describe("地図を切り替えたときの範囲外の選択", () => {
  const makeSettleApp = (over: Record<string, any> = {}) => {
    const view = {
      getCenter: () => [0, 0],
      setCenter: vi.fn()
    };
    const app: any = {
      from: {
        insideCheckSysCoord: () => false,
        modulateSysCoordInside: () => [3, 3],
        isWmts: () => false
      },
      mapObject: { getView: () => view },
      getMarker: (id: string) => ({ namespaceID: id, lnglat: [139.7, 35.7] }),
      setViewpoint: vi.fn(),
      __selectedMarker: "p1",
      __outsideSelection: { id: "p1", merc: [100, 200] },
      ...over
    };
    return { app, view };
  };

  it("(1) 切り替え先に無い POI は選択を外して縁の内側へ戻す", () => {
    const { app, view } = makeSettleApp();
    settleOutsideSelection(app, undefined);
    expect(app.__selectedMarker).toBeUndefined();
    expect(app.__outsideSelection).toBeUndefined();
    expect(view.setCenter).toHaveBeenCalledWith([3, 3]);
  });

  it("(1) 引き戻しには同じインスタンスを渡す（prototype の getter を落とさない）", () => {
    // 実物の app は prototype の getter を持つ。インスタンスを展開すると getter が
    // 落ちるので、from を prototype の getter にした同じ形のクラスで確かめる。
    const view = { getCenter: () => [99, 99], setCenter: vi.fn() };
    const source = {
      insideCheckSysCoord: () => false,
      modulateSysCoordInside: () => [3, 3]
    };
    class AppWithGetter {
      mapObject = { getView: () => view };
      __selectedMarker: any = "p1";
      __outsideSelection: any = { id: "p1", merc: [100, 200] };
      get from() {
        return source;
      }
    }
    const app = new AppWithGetter();
    settleOutsideSelection(app as any, undefined);
    expect(app.__outsideSelection).toBeUndefined();
    expect(view.setCenter).toHaveBeenCalledWith([3, 3]);
  });

  it("(2) 切り替え先で範囲内なら普通の選択として続ける（選択は外さない）", () => {
    const { app } = makeSettleApp();
    settleOutsideSelection(app, { kind: "inside", xy: [1, 1] });
    expect(app.__outsideSelection).toBeUndefined();
    expect(app.__selectedMarker).toBe("p1");
    expect(app.setViewpoint).toHaveBeenCalledWith({
      longitude: 139.7,
      latitude: 35.7
    });
  });

  it("(3) まだ範囲外ならその POI を中心に据える（古代図は経緯度・TMS はメルカトル）", () => {
    const { app } = makeSettleApp();
    settleOutsideSelection(app, { kind: "outside", merc: [9, 9] });
    expect(app.__outsideSelection).toMatchObject({ id: "p1", merc: [9, 9] });
    expect(app.setViewpoint).toHaveBeenCalled();

    // 前面がメルカトルの地図（TMS・基本地図）は前面のメルカトルをそのまま中心にする
    const tms = makeSettleApp({
      from: {
        insideCheckSysCoord: () => false,
        modulateSysCoordInside: () => [3, 3],
        isWmts: () => true
      }
    });
    settleOutsideSelection(tms.app, { kind: "outside", merc: [9, 9] });
    expect(tms.view.setCenter).toHaveBeenCalledWith([9, 9]);
  });
});

describe("描き直しの判定と範囲外の選択の結び付き", () => {
  it("切り替えの後の描き直しで、範囲外の選択が新しい地図に合わせて決まる", async () => {
    const app = await bootApp();
    app.from = makeSource(() => false) as any;
    app.selectMarker("p1");
    await flush();
    expect(app.__outsideSelection).toMatchObject({ id: "p1" });

    // 地図の切り替えは「判定待ち」の印を立てて描き直しに委ねる
    app.__outsideSelection = { id: "p1", pending: true };
    app.from = makeSource(() => true) as any;
    app.redrawMarkers();
    await flush();
    // 切り替え先では範囲内なので、普通の選択として続く
    expect(app.__outsideSelection).toBeUndefined();
    expect(app.__selectedMarker).toBe("p1");

    // 切り替えた先に POI が無ければ選択を外す
    app.__outsideSelection = { id: "p1", pending: true };
    app.pois = { main: { pois: [], hide: false } };
    app.redrawMarkers();
    await flush();
    expect(app.__outsideSelection).toBeUndefined();
    expect(app.__selectedMarker).toBeUndefined();
  });
});

describe("GPS の位置移動", () => {
  function gpsSource() {
    const calls: any[] = [];
    return {
      calls,
      setGPSMarkerAsync: vi.fn(async (_pos: any, ignoreMove: boolean) => {
        calls.push(ignoreMove);
        return true;
      }),
      setGPSMarker: vi.fn()
    };
  }

  it("範囲外を選んでいる間は ignoreMove を真にする（移動して中心を動かさない）", async () => {
    vi.useFakeTimers();
    const app = await bootApp();
    const source = gpsSource();
    app.mapObject.getLayers().item(0).getSource = () => source;
    const geo: any = app.geolocation;
    geo.set("position", [139.7, 35.7]);
    geo.set("accuracy", 10);

    // 選択が無ければ、動かす指定（moveTo_）のときは移動させる
    app.moveTo_ = true;
    geo.changed();
    await vi.advanceTimersByTimeAsync(0);
    expect(source.calls).toEqual([false]);

    // 範囲外を選んでいる間は止める
    app.moveTo_ = true;
    app.__outsideSelection = { id: "p1", merc: [1, 1] };
    geo.changed();
    await vi.advanceTimersByTimeAsync(0);
    expect(source.calls).toEqual([false, true]);
  });

  it("常時 GPS モードの手動の位置移動も、範囲外を選んでいる間は止める", async () => {
    const app = await bootApp();
    const source = gpsSource();
    app.mapObject.getLayers().item(0).getSource = () => source;
    (app as any).__alwaysGpsOn = true;
    const geo: any = app.geolocation;
    geo.set("position", [139.7, 35.7]);
    geo.set("accuracy", 10);

    app.handleGPS(true);
    await flush();
    expect(source.calls).toEqual([false]);

    app.__outsideSelection = { id: "p1", merc: [1, 1] };
    app.handleGPS(true);
    await flush();
    expect(source.calls).toEqual([false, true]);
  });
});
