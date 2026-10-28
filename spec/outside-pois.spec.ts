// 範囲外の POI を背面の地図に立てる処理のうち、地図を持たない純粋な部分の検査。
//   classifyMarker   範囲内／範囲外／描かない の判定
//   replaceMarkers   前面と背面の marker 層を 1 回で入れ替える
//   backPinHittable  背面のピンが押せる場所か
//   pullBackInside   縁の外へ出た中心を戻す（範囲外を選択している間は止める）
// 地図の実体（OL）は使わず、`app` の代わりに記録するだけの stub を渡す。
import { describe, it, expect, vi, beforeAll } from "vitest";
import {
  classifyMarker,
  placeMarkerLayers,
  replaceMarkers,
  backMarkerDataAt,
  backPinHittable,
  pullBackInside,
  setBackPinHitMinTransparency
} from "../src/outside_pois";
import { MaplatApp } from "../src/index";

const MARKER_LAYER = "marker";

function makeSource() {
  const features: any[] = [];
  const clear = vi.fn(() => {
    features.length = 0;
  });
  const addFeatures = vi.fn((next: any[]) => {
    features.push(...next);
  });
  return {
    features,
    clear,
    addFeatures,
    // 層の中身を namespaceID の並びで見る
    ids: () => features.map((f: any) => f.get("datum")?.namespaceID)
  };
}

/** `app` の代わり。`from` の変換と範囲判定だけを差し替える。 */
function makeApp(option: {
  inside?: (xy: number[]) => boolean;
  convert?: (merc: number[]) => Promise<number[] | undefined>;
  back?: boolean;
  layerOf?: (name: string) => any;
} = {}) {
  const front = makeSource();
  const back = makeSource();
  const convert =
    option.convert ??
    (async (merc: number[]) => [merc[0] / 10, merc[1] / 10] as number[]);
  const app: any = {
    from: {
      mapID: "front",
      insideCheckSysCoord: (xy: number[]) =>
        option.inside ? option.inside(xy) : true,
      merc2SysCoordAsync_ignoreBackground: vi.fn(convert),
      xy2SysCoord: (xy: number[]) => xy
    },
    mapObject: {
      getSource: (name: string) => (name === MARKER_LAYER ? front : undefined)
    },
    pois: {},
    stateBuffer: {},
    logger: { debug: vi.fn() },
    __hideOutsidePois: false
  };
  if (option.back !== false) {
    app.backMap = {
      mapID: "back",
      getSource: (name: string) => (name === MARKER_LAYER ? back : undefined)
    };
  }
  return { app, front, back, convert: app.from.merc2SysCoordAsync_ignoreBackground };
}

const entry = (namespaceID: string) => ({ namespaceID });

describe("classifyMarker: 範囲内／範囲外／描かない", () => {
  it("coordinates（メルカトル）: 範囲内は前面の座標、範囲外はメルカトルのまま", async () => {
    const a = makeApp({ inside: () => true });
    expect(await classifyMarker(a.app, { coordinates: [100, 200] })).toEqual({
      kind: "inside",
      xy: [10, 20]
    });
    const b = makeApp({ inside: () => false });
    expect(await classifyMarker(b.app, { coordinates: [100, 200] })).toEqual({
      kind: "outside",
      merc: [100, 200]
    });
  });

  it("coordinates: 座標が求まらない（undefined）も範囲外として扱う", async () => {
    const a = makeApp({ convert: async () => undefined });
    expect(await classifyMarker(a.app, { coordinates: [100, 200] })).toEqual({
      kind: "outside",
      merc: [100, 200]
    });
  });

  it("経緯度: 範囲内は前面の座標、範囲外はメルカトルに直して返す", async () => {
    const merc: any = await import("ol/proj").then(m =>
      m.transform([139.7, 35.7], "EPSG:4326", "EPSG:3857")
    );
    const inside = makeApp({ inside: () => true });
    expect(
      (await classifyMarker(inside.app, { lnglat: [139.7, 35.7] })).kind
    ).toBe("inside");
    const outside = makeApp({ inside: () => false });
    const result = await classifyMarker(outside.app, { lnglat: [139.7, 35.7] });
    expect(result.kind).toBe("outside");
    expect((result as any).merc[0]).toBeCloseTo(merc[0], 6);
    expect((result as any).merc[1]).toBeCloseTo(merc[1], 6);
  });

  it("x・y（画素）: 範囲内は描き、範囲外は描かない（skip）", async () => {
    const inside = makeApp({ inside: () => true });
    expect(await classifyMarker(inside.app, { x: 5, y: 6 })).toEqual({
      kind: "inside",
      xy: [5, 6]
    });
    // 画素は地図の座標へ直せても、範囲外なら描かない
    expect(inside.convert).not.toHaveBeenCalled();
    const outside = makeApp({ inside: () => false });
    expect(await classifyMarker(outside.app, { x: 5, y: 6 })).toEqual({
      kind: "skip"
    });
  });

  it("判定に視点（地図の中心・ズーム）は入らない", async () => {
    const a = makeApp({ inside: () => false });
    // 視点を読もうとすると例外になる stub。読まなければ範囲外の判定だけが返る
    a.app.mapObject.getView = () => {
      throw new Error("view must not be read");
    };
    expect(await classifyMarker(a.app, { coordinates: [1, 2] })).toEqual({
      kind: "outside",
      merc: [1, 2]
    });
    expect(a.app.from.merc2SysCoordAsync_ignoreBackground).toHaveBeenCalledTimes(1);
  });
});

describe("replaceMarkers: 前面と背面を 1 回の呼び出しで入れ替える", () => {
  it("前面と背面の marker 層を clear して addFeatures する（1 回ずつ）", () => {
    const a = makeApp();
    replaceMarkers(a.app, {
      front: [{ data: entry("front#1"), icon: "pin.png", xy: [1, 1] }],
      back: [{ data: entry("back#1"), icon: "pin.png", merc: [2, 2] }]
    });
    expect(a.front.clear).toHaveBeenCalledTimes(1);
    expect(a.front.addFeatures).toHaveBeenCalledTimes(1);
    expect(a.back.clear).toHaveBeenCalledTimes(1);
    expect(a.back.addFeatures).toHaveBeenCalledTimes(1);
    expect(a.front.ids()).toEqual(["front#1"]);
    expect(a.back.ids()).toEqual(["back#1"]);
  });

  it("前面の地図の種類によらず、背面があれば背面の marker 層を clear する", () => {
    // TMS・基本地図の前面を想定し、背面へ置く地物が 0 件でも背面は消える
    const a = makeApp();
    a.back.features.push({ get: () => entry("stale") });
    replaceMarkers(a.app, {
      front: [{ data: entry("front#1"), icon: "pin.png", xy: [1, 1] }],
      back: []
    });
    expect(a.back.clear).toHaveBeenCalledTimes(1);
    expect(a.back.features).toEqual([]);
  });

  it("背面が無ければ前面だけを入れ替える（例外を投げない）", () => {
    const a = makeApp({ back: false });
    expect(() =>
      replaceMarkers(a.app, {
        front: [{ data: entry("front#1"), icon: "pin.png", xy: [1, 1] }],
        back: [{ data: entry("back#1"), icon: "pin.png", merc: [2, 2] }]
      })
    ).not.toThrow();
    expect(a.front.ids()).toEqual(["front#1"]);
  });

  it("空の配列なら両方の層が空になる（resetMarker と同じ道）", () => {
    const a = makeApp();
    a.front.features.push({ get: () => entry("a") });
    a.back.features.push({ get: () => entry("b") });
    replaceMarkers(a.app, { front: [], back: [] });
    expect(a.front.features).toEqual([]);
    expect(a.back.features).toEqual([]);
  });
});

describe("backPinHittable: 背面のピンが押せる場所か", () => {
  const app = (inside: boolean) => ({
    from: { insideCheckSysCoord: () => inside },
    getTransparency: () => 0
  });

  it("紙の外の点は真（押せる）", () => {
    expect(backPinHittable(app(false) as any, [1, 2])).toBe(true);
  });

  it("紙の中の点は偽（押せない。既定は null = 紙が覆う所では押せない）", () => {
    expect(backPinHittable(app(true) as any, [1, 2])).toBe(false);
  });

  it("透過度の下限を 50 にすると、透過度 50 以上で真・50 未満で偽", () => {
    try {
      setBackPinHitMinTransparency(50);
      const at = (transparency: number) => ({
        from: { insideCheckSysCoord: () => true },
        getTransparency: () => transparency
      });
      expect(backPinHittable(at(50) as any, [1, 2])).toBe(true);
      expect(backPinHittable(at(80) as any, [1, 2])).toBe(true);
      expect(backPinHittable(at(49) as any, [1, 2])).toBe(false);
    } finally {
      setBackPinHitMinTransparency(null);
    }
    expect(backPinHittable(app(true) as any, [1, 2])).toBe(false);
  });
});

describe("placeMarkerLayers: 範囲外の POI をどの層へ置くか", () => {
  const outside = (a: ReturnType<typeof makeApp>) =>
    placeMarkerLayers(
      a.app,
      [{ data: entry("p1"), icon: "pin.png" }],
      [{ kind: "outside", merc: [5, 6] }]
    );
  const item = { data: entry("p1"), icon: "pin.png" };

  it("古地図（背面がある）は背面へ、置く座標はメルカトル", () => {
    const a = makeApp();
    a.app.from.isWmts = () => false;
    const layers = outside(a);
    expect(layers.front).toEqual([]);
    expect(layers.back).toEqual([{ ...item, merc: [5, 6] }]);
  });

  it("TMS・envelope を持つ基本地図の前面は、前面へメルカトルの座標で置く", () => {
    const a = makeApp();
    a.app.from.isWmts = () => true;
    const layers = outside(a);
    expect(layers.back).toEqual([]);
    expect(layers.front).toEqual([{ ...item, xy: [5, 6] }]);
  });

  it("背面を持たない古地図（overlay 偽）は描かない", () => {
    const a = makeApp({ back: false });
    a.app.from.isWmts = () => false;
    expect(outside(a)).toEqual({ front: [], back: [] });
  });

  it("描かない指定（hide-outside-pois）では描かない", () => {
    const a = makeApp();
    a.app.from.isWmts = () => false;
    a.app.__hideOutsidePois = true;
    expect(outside(a)).toEqual({ front: [], back: [] });
  });

  it("範囲内は常に前面（座標は前面の座標）", () => {
    const a = makeApp();
    const layers = placeMarkerLayers(
      a.app,
      [item],
      [{ kind: "inside", xy: [9, 9] }]
    );
    expect(layers.back).toEqual([]);
    expect(layers.front).toEqual([{ ...item, xy: [9, 9] }]);
  });
});

describe("backMarkerDataAt: 背面のピンを押す（貫通の hitTest）", () => {
  /** 背面の地図の代わり。marker 層のピンが 1 件当たる。 */
  function makeBackApp(option: { inside?: boolean; back?: boolean } = {}) {
    const markerLayer = { name: "marker" };
    const otherLayer = { name: "gps" };
    const feature = { get: (key: string) => (key === "datum" ? entry("back#1") : undefined) };
    const forEachFeatureAtPixel = vi.fn(
      (_pixel: number[], callback: (f: any) => void, opts: any) => {
        // marker 層だけを見る（gps 層のピンは拾わない）
        if (opts?.layerFilter && !opts.layerFilter(markerLayer)) return;
        if (opts?.layerFilter && opts.layerFilter(otherLayer)) return;
        callback(feature);
      }
    );
    const app: any = {
      from: { insideCheckSysCoord: () => option.inside === true },
      getTransparency: () => 0,
      backMap: {
        getLayer: (name: string) => (name === "marker" ? markerLayer : undefined),
        forEachFeatureAtPixel
      }
    };
    if (option.back === false) delete app.backMap;
    return { app, forEachFeatureAtPixel, markerLayer, otherLayer };
  }

  it("紙の外で背面のピンが当たれば datum を返す（見るのは marker 層だけ）", () => {
    const { app, forEachFeatureAtPixel, otherLayer } = makeBackApp({ inside: false });
    expect(backMarkerDataAt(app, { pixel: [1, 2], coordinate: [3, 4] })).toEqual([
      entry("back#1")
    ]);
    const opts = forEachFeatureAtPixel.mock.calls[0][2];
    expect(opts.layerFilter(otherLayer)).toBe(false);
  });

  it("紙が覆っている所では背面を見ない", () => {
    const { app, forEachFeatureAtPixel } = makeBackApp({ inside: true });
    expect(backMarkerDataAt(app, { pixel: [1, 2], coordinate: [3, 4] })).toEqual([]);
    expect(forEachFeatureAtPixel).not.toHaveBeenCalled();
  });

  it("背面が無ければ空", () => {
    const { app, forEachFeatureAtPixel } = makeBackApp({ back: false });
    expect(backMarkerDataAt(app, { pixel: [1, 2], coordinate: [3, 4] })).toEqual([]);
    expect(forEachFeatureAtPixel).not.toHaveBeenCalled();
  });
});

describe("pullBackInside: 縁の外へ出た中心を戻す", () => {
  const makeView = (center: number[]) => {
    let current = center;
    return {
      getCenter: () => current,
      setCenter: vi.fn((next: number[]) => {
        current = next;
      }),
      center: () => current
    };
  };

  it("範囲外を選択している間は何もしない", () => {
    const view = makeView([999, 999]);
    const app: any = {
      from: {
        insideCheckSysCoord: () => false,
        modulateSysCoordInside: () => [1, 1]
      },
      __outsideSelection: { id: "poi#1", merc: [0, 0] }
    };
    pullBackInside(app, view);
    expect(view.setCenter).not.toHaveBeenCalled();
  });

  it("選択が無く中心が縁の外なら、範囲内の点へ戻す", () => {
    const view = makeView([999, 999]);
    const app: any = {
      from: {
        insideCheckSysCoord: (xy: number[]) => xy[0] < 10,
        modulateSysCoordInside: () => [9, 9]
      }
    };
    pullBackInside(app, view);
    expect(view.setCenter).toHaveBeenCalledWith([9, 9]);
  });

  it("中心が範囲内なら動かさない", () => {
    const view = makeView([1, 1]);
    const app: any = {
      from: {
        insideCheckSysCoord: () => true,
        modulateSysCoordInside: vi.fn(() => [0, 0])
      }
    };
    pullBackInside(app, view);
    expect(view.setCenter).not.toHaveBeenCalled();
  });
});

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

describe("公開の resetMarker() は前面と背面の両方を空にする", () => {
  it("実物の地図で、前面と背面の marker 層の地物がどちらも消える", async () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const app = new MaplatApp({ div, setting: { sources: [] } });
    await app.waitReady;
    const front = app.mapObject.getSource(MARKER_LAYER);
    const back = app.backMap!.getSource(MARKER_LAYER);
    expect(back).toBeTruthy();
    const { Feature } = await import("ol");
    const { Point } = await import("ol/geom");
    front.addFeature(new Feature({ geometry: new Point([0, 0]) }));
    back.addFeature(new Feature({ geometry: new Point([0, 0]) }));
    expect(front.getFeatures().length).toBe(1);
    expect(back.getFeatures().length).toBe(1);

    app.resetMarker();

    expect(front.getFeatures().length).toBe(0);
    expect(back.getFeatures().length).toBe(0);
  });
});

describe("地図のクリックは前面で当たらなければ背面のピンを見る", () => {
  async function makeClickApp(option: { inside: boolean; back?: boolean }) {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const app = new MaplatApp({ div, setting: { sources: [] } });
    await app.waitReady;
    app.from = {
      mapID: "hist",
      insideCheckSysCoord: () => option.inside,
      merc2SysCoordAsync: async (merc: number[]) => merc,
      sysCoord2MercAsync: async (xy: number[]) => xy,
      isWmts: () => false
    } as any;
    const backDatum = { namespaceID: "back#1", id: "b1" };
    const backFeature = {
      get: (key: string) => (key === "datum" ? backDatum : undefined)
    };
    const forEachFeatureAtPixel = vi.fn(
      (_pixel: number[], callback: (f: any) => void) => callback(backFeature)
    );
    app.backMap!.forEachFeatureAtPixel = forEachFeatureAtPixel as any;
    // 前面の当たり（既定は当たらない）
    const front: any = {
      forEachFeatureAtPixel: vi.fn((_pixel: number[], _callback: (f: any) => void) => undefined)
    };
    app.setMapClick();
    const seen: string[] = [];
    for (const type of ["clickMarker", "clickMarkers", "clickMapXy", "clickMapMerc", "clickMap"]) {
      app.addEventListener(type, () => {
        seen.push(type);
      });
    }
    const click = () =>
      app.mapObject.dispatchEvent({
        type: "click",
        pixel: [1, 2],
        coordinate: [3, 4],
        target: front
      } as any);
    return { app, front, forEachFeatureAtPixel, backDatum, seen, click };
  }

  it("前面で当たらず紙の外なら、背面のピンを clickMarker・clickMarkers で返す", async () => {
    const h = await makeClickApp({ inside: false });
    let marker: any;
    let markers: any;
    h.app.addEventListener("clickMarker", (e: any) => (marker = e.detail));
    h.app.addEventListener("clickMarkers", (e: any) => (markers = e.detail));
    h.click();
    expect(h.forEachFeatureAtPixel).toHaveBeenCalledTimes(1);
    expect(marker).toBe(h.backDatum);
    expect(markers).toEqual([h.backDatum]);
    // 地図のクリック（clickMapXy 等）は出さない
    expect(h.seen).not.toContain("clickMapXy");
  });

  it("紙が覆っている所では背面を見ず、地図のクリックとして扱う", async () => {
    const h = await makeClickApp({ inside: true });
    h.click();
    expect(h.forEachFeatureAtPixel).not.toHaveBeenCalled();
    expect(h.seen).toContain("clickMapXy");
  });

  it("前面で当たれば背面は見ない", async () => {
    const h = await makeClickApp({ inside: false });
    const frontDatum = { namespaceID: "front#1" };
    h.front.forEachFeatureAtPixel.mockImplementation((_p: number[], cb: any) =>
      cb({ get: (key: string) => (key === "datum" ? frontDatum : undefined) })
    );
    let marker: any;
    h.app.addEventListener("clickMarker", (e: any) => (marker = e.detail));
    h.click();
    expect(marker).toBe(frontDatum);
    expect(h.forEachFeatureAtPixel).not.toHaveBeenCalled();
  });

  it("背面が無ければ今までどおり地図のクリック", async () => {
    const h = await makeClickApp({ inside: false });
    delete (h.app as any).backMap;
    h.click();
    expect(h.seen).toContain("clickMapXy");
  });
});
