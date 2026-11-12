// MaplatApp が要素（<maplat-app>）にだけ見せる内部面の検査。
//   sourceLoadedDetail: sourceLoaded の { mapID, usable }[] の材料（cacheHash の同一性）
//   pixelToMerc:        pixel → 地図の座標 → merc の連鎖（旧 clientPointToLngLat と同じ・点検なし）
//   viewportSize:       表示領域の大きさ（4 隅の作り方と undefined/null の意味づけは要素に残す）
//   updateSize:         前面と背面の地図の大きさを測り直す
// 地図の実体（OL）は jsdom で作らず、メソッドの連鎖だけを検査する（実物は wc-legacy の boot を使う）。
import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { transform } from "ol/proj";
import { MaplatApp } from "../src/index";

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
  vi.restoreAllMocks();
});

function stub(fields: Record<string, any> = {}): any {
  return Object.assign(Object.create(MaplatApp.prototype), fields);
}

describe("sourceLoadedDetail", () => {
  it("[] と null・配列でない値は空配列", () => {
    const app = stub({ cacheHash: {} });
    expect(app.sourceLoadedDetail([])).toEqual([]);
    expect(app.sourceLoadedDetail(null)).toEqual([]);
    expect(app.sourceLoadedDetail(undefined)).toEqual([]);
    expect(app.sourceLoadedDetail("x")).toEqual([]);
  });

  it("cacheHash に同じ実体がある source だけ usable: true。mapID の無い source は null", () => {
    const kept = { mapID: "kept" };
    const dropped = { mapID: "dropped" };
    const sameIDOtherInstance = { mapID: "kept" };
    const app = stub({ cacheHash: { kept } });
    expect(app.sourceLoadedDetail([kept, dropped, sameIDOtherInstance, {}])).toEqual([
      { mapID: "kept", usable: true },
      { mapID: "dropped", usable: false },
      { mapID: "kept", usable: false },
      { mapID: null, usable: false }
    ]);
  });

  it("GL 未ロードで落とした provider source は usable: false（実 handleSources の経路）", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const app = stub({
      mapObject: { on: vi.fn() },
      cacheHash: undefined,
      mercSrc: undefined,
      from: undefined,
      mapboxMap: undefined,
      maplibreMap: undefined,
      logger: undefined,
      initialRestore: {},
      startFrom: undefined,
      dispatchEvent: vi.fn(),
      setInitialMap: vi.fn().mockResolvedValue(undefined),
      setMapClick: vi.fn(),
      setPointerEvents: vi.fn(),
      setMapOnOff: vi.fn(),
      setMouseCursor: vi.fn(),
      setBackMapBehavior: vi.fn(),
      raiseChangeViewpoint: vi.fn(),
      runLifecyclePhase: vi.fn().mockResolvedValue(undefined)
    });
    const hist = { mapID: "h1", isBasemap: () => false, isMapbox: () => false, isMapLibre: () => false, setMap: vi.fn() };
    const provider = { mapID: "mb1", isBasemap: () => true, isMapbox: () => true, isMapLibre: () => false, setMap: vi.fn() };
    await app.handleSources([hist, provider]);
    expect(Object.keys(app.cacheHash)).toEqual(["h1"]);
    expect(app.sourceLoadedDetail([hist, provider])).toEqual([
      { mapID: "h1", usable: true },
      { mapID: "mb1", usable: false }
    ]);
    warn.mockRestore();
  });
});

describe("pixelToMerc", () => {
  it("地図か from が無ければ undefined（点検しない・旧の連鎖のまま）", async () => {
    expect(await stub().pixelToMerc([1, 2])).toBeUndefined();
    const from = { sysCoord2MercAsync: vi.fn() };
    expect(await stub({ from, mapObject: undefined }).pixelToMerc([1, 2])).toBeUndefined();
    expect(from.sysCoord2MercAsync).not.toHaveBeenCalled();
  });

  it("getCoordinateFromPixel が null なら undefined", async () => {
    const from = { sysCoord2MercAsync: vi.fn() };
    const app = stub({ from, mapObject: { getCoordinateFromPixel: () => null } });
    expect(await app.pixelToMerc([1, 2])).toBeUndefined();
    expect(from.sysCoord2MercAsync).not.toHaveBeenCalled();
  });

  it("pixel → 地図の座標 → merc の順に旧クラスと同じ連鎖で返す", async () => {
    const order: string[] = [];
    const from = {
      sysCoord2MercAsync: vi.fn(async (xy: number[]) => {
        order.push("merc");
        return [xy[0] * 2, xy[1] * 2];
      })
    };
    const app = stub({
      from,
      mapObject: {
        getCoordinateFromPixel: vi.fn((pixel: number[]) => {
          order.push("xy");
          return [pixel[0] + 100, pixel[1] + 200];
        })
      }
    });
    await expect(app.pixelToMerc([3, 4])).resolves.toEqual([206, 408]);
    expect(order).toEqual(["xy", "merc"]);
    expect(from.sysCoord2MercAsync).toHaveBeenCalledWith([103, 204]);
  });
});

describe("viewportSize", () => {
  it("地図が無ければ undefined", () => {
    expect(stub().viewportSize()).toBeUndefined();
  });

  it("寸法が 0 以下なら undefined（今の要素の早期 return と同じ）", () => {
    expect(stub({ mapObject: { getSize: () => [0, 300] } }).viewportSize()).toBeUndefined();
    expect(stub({ mapObject: { getSize: () => [400, 0] } }).viewportSize()).toBeUndefined();
    expect(stub({ mapObject: { getSize: () => undefined } }).viewportSize()).toBeUndefined();
  });

  it("有効な寸法はそのまま返す", () => {
    expect(stub({ mapObject: { getSize: () => [400, 300] } }).viewportSize()).toEqual([400, 300]);
  });
});

describe("updateSize", () => {
  it("前面と背面の両方を測り直す", () => {
    const front = { updateSize: vi.fn() };
    const back = { updateSize: vi.fn() };
    stub({ mapObject: front, backMap: back }).updateSize();
    expect(front.updateSize).toHaveBeenCalledTimes(1);
    expect(back.updateSize).toHaveBeenCalledTimes(1);
  });

  it("背面や地図が無くても例外にしない", () => {
    expect(() => stub().updateSize()).not.toThrow();
    const front = { updateSize: vi.fn() };
    expect(() => stub({ mapObject: front }).updateSize()).not.toThrow();
    expect(front.updateSize).toHaveBeenCalledTimes(1);
  });
});

describe("clientPointToLngLat の連鎖", () => {
  const viewport = { getBoundingClientRect: () => ({ left: 10, top: 20 }) };

  it("rect で pixel を出し、pixelToMerc → transform の順で同じ値を返す", async () => {
    const merc = [15707000, 4815000];
    const app = stub({
      from: {},
      mapObject: { getViewport: () => viewport },
      pixelToMerc: vi.fn(async () => merc)
    });
    const result = await app.clientPointToLngLat(15, 27);
    expect(app.pixelToMerc).toHaveBeenCalledWith([5, 7]);
    const lnglat = transform(merc, "EPSG:3857", "EPSG:4326");
    expect(result.longitude).toBeCloseTo(lnglat[0], 9);
    expect(result.latitude).toBeCloseTo(lnglat[1], 9);
  });

  it("pixelToMerc が undefined なら undefined（旧クラスの戻り値を変えない）", async () => {
    const app = stub({
      from: {},
      mapObject: { getViewport: () => viewport },
      pixelToMerc: vi.fn(async () => undefined)
    });
    await expect(app.clientPointToLngLat(15, 27)).resolves.toBeUndefined();
  });

  it("from か mapObject が無ければ pixelToMerc を呼ばずに undefined", async () => {
    const pixelToMerc = vi.fn(async () => [1, 2]);
    await expect(stub({ pixelToMerc }).clientPointToLngLat(1, 2)).resolves.toBeUndefined();
    await expect(
      stub({ from: {}, mapObject: undefined, pixelToMerc }).clientPointToLngLat(1, 2)
    ).resolves.toBeUndefined();
    expect(pixelToMerc).not.toHaveBeenCalled();
  });
});

describe("lngLatToClientPoint はピンと同じ地図で測る", () => {
  const map = (left: number, top: number, offset: number) => ({
    getViewport: () => ({ getBoundingClientRect: () => ({ left, top }) }),
    getPixelFromCoordinate: vi.fn((c: number[]) => [c[0] + offset, c[1] + offset])
  });
  const from = (inside: boolean) => ({
    isWmts: () => false,
    insideCheckSysCoord: () => inside,
    merc2SysCoordAsync_ignoreBackground: vi.fn(async () => [1, 2]),
    // 前面の外挿（紙の外では背面のメルカトルと離れる）
    merc2SysCoordAsync: vi.fn(async () => [7, 8])
  });

  it("古地図の範囲外は背面のメルカトルの画素（前面の外挿は使わない）", async () => {
    const front = map(10, 20, 0);
    const back = map(10, 20, 1000);
    const app = stub({ from: from(false), mapObject: front, backMap: back });
    const merc = transform([139.5, 36.2], "EPSG:4326", "EPSG:3857");
    const result = await app.lngLatToClientPoint(139.5, 36.2);
    expect(front.getPixelFromCoordinate).not.toHaveBeenCalled();
    expect(app.from.merc2SysCoordAsync).not.toHaveBeenCalled();
    expect(result.x).toBeCloseTo(merc[0] + 1000 + 10, 3);
    expect(result.y).toBeCloseTo(merc[1] + 1000 + 20, 3);
  });

  it("範囲内は前面の座標（ピンと同じ判定の座標）", async () => {
    const front = map(10, 20, 0);
    const back = map(10, 20, 1000);
    const app = stub({ from: from(true), mapObject: front, backMap: back });
    expect(await app.lngLatToClientPoint(139.5, 36.2)).toEqual({ x: 11, y: 22 });
    expect(back.getPixelFromCoordinate).not.toHaveBeenCalled();
  });

  it("背面の無い古地図の範囲外は従来どおり前面の外挿", async () => {
    const front = map(10, 20, 0);
    const app = stub({ from: from(false), mapObject: front, backMap: undefined });
    expect(await app.lngLatToClientPoint(139.5, 36.2)).toEqual({ x: 17, y: 28 });
  });
});

// 紙の外の点は、背面の地図に見えている地点を返す（lngLatToClientPoint・ピンと同じ規則の逆向き）。
// 前面: 画素 = 前面の座標。紙は 0〜100 の正方形。前面の座標 → merc は ×100 ＋ 50（紙の外へ延ばすと
// 背面と 0.5 px ずれる）。背面: 画素 ×100 = merc。どちらの地図も viewport は (10, 20) にある。
describe("clientPointToLngLat は紙の外で背面の地点を返す", () => {
  const rect = { left: 10, top: 20 };
  const makeFront = () => ({
    getViewport: () => ({ getBoundingClientRect: () => rect }),
    getCoordinateFromPixel: vi.fn((p: number[]) => [p[0], p[1]]),
    getPixelFromCoordinate: vi.fn((c: number[]) => [c[0], c[1]])
  });
  const makeBack = () => ({
    getViewport: () => ({ getBoundingClientRect: () => rect }),
    getCoordinateFromPixel: vi.fn((p: number[]) => [p[0] * 100, p[1] * 100]),
    getPixelFromCoordinate: vi.fn((c: number[]) => [c[0] / 100, c[1] / 100])
  });
  const makeFrom = (wmts = false) => {
    const toXy = async (m: number[]) => [(m[0] - 50) / 100, (m[1] - 50) / 100];
    return {
      isWmts: () => wmts,
      insideCheckSysCoord: (xy: number[]) => xy[0] >= 0 && xy[0] <= 100 && xy[1] >= 0 && xy[1] <= 100,
      sysCoord2MercAsync: vi.fn(async (xy: number[]) => [xy[0] * 100 + 50, xy[1] * 100 + 50]),
      merc2SysCoordAsync_ignoreBackground: vi.fn(toXy),
      merc2SysCoordAsync: vi.fn(toXy)
    };
  };
  const makeApp = (opts: { back?: boolean; wmts?: boolean } = {}) =>
    stub({
      from: makeFrom(opts.wmts),
      mapObject: makeFront(),
      backMap: opts.back === false ? undefined : makeBack()
    });
  const mercOf = (r: { longitude: number; latitude: number }) =>
    transform([r.longitude, r.latitude], "EPSG:4326", "EPSG:3857");
  const expectMerc = (r: any, merc: number[]) => {
    const got = mercOf(r);
    expect(got[0]).toBeCloseTo(merc[0], 3);
    expect(got[1]).toBeCloseTo(merc[1], 3);
  };
  const expectPoint = (r: any, x: number, y: number) => {
    expect(r.x).toBeCloseTo(x, 6);
    expect(r.y).toBeCloseTo(y, 6);
  };

  it("紙の内は前面の変換（従来どおり）で、lngLatToClientPoint と往復する", async () => {
    const app = makeApp();
    const r = await app.clientPointToLngLat(10 + 40, 20 + 60);
    expectMerc(r, [4050, 6050]);
    expect(app.backMap.getCoordinateFromPixel).not.toHaveBeenCalled();
    expectPoint(await app.lngLatToClientPoint(r.longitude, r.latitude), 50, 80);
  });

  it("古地図の紙の外は背面の地図の地点（前面の外挿は使わない）で、往復する", async () => {
    const app = makeApp();
    const r = await app.clientPointToLngLat(10 + 200, 20 + 50);
    expectMerc(r, [20000, 5000]);
    expect(app.from.sysCoord2MercAsync).not.toHaveBeenCalled();
    expectPoint(await app.lngLatToClientPoint(r.longitude, r.latitude), 210, 70);
  });

  it("紙の縁の内側は前面、外側は背面（境界をまたいで判定が切り替わる）", async () => {
    const app = makeApp();
    // 縁の上（insideCheckSysCoord は縁を含む）は前面
    expectMerc(await app.clientPointToLngLat(10 + 100, 20 + 50), [10050, 5050]);
    // 縁のすぐ外は背面
    expectMerc(await app.clientPointToLngLat(10 + 101, 20 + 50), [10100, 5000]);
    expectPoint(await app.lngLatToClientPoint(...lnglatOfMerc([10100, 5000])), 111, 70);
  });

  it("前面がメルカトルの地図は、紙（範囲）の外も前面の変換", async () => {
    const app = makeApp({ wmts: true });
    expectMerc(await app.clientPointToLngLat(10 + 200, 20 + 50), [20050, 5050]);
    expect(app.backMap.getCoordinateFromPixel).not.toHaveBeenCalled();
  });

  it("背面の無い古地図（overlay 偽）の紙の外は従来どおり前面の外挿（lngLatToClientPoint と同じ扱い）", async () => {
    const app = makeApp({ back: false });
    const r = await app.clientPointToLngLat(10 + 200, 20 + 50);
    expectMerc(r, [20050, 5050]);
    expectPoint(await app.lngLatToClientPoint(r.longitude, r.latitude), 210, 70);
  });

  it("前面の画素が座標にならなければ undefined（要素では null）", async () => {
    const app = makeApp();
    app.mapObject.getCoordinateFromPixel = vi.fn(() => null);
    await expect(app.clientPointToLngLat(10 + 200, 20 + 50)).resolves.toBeUndefined();
  });

  it("背面の画素が座標にならなければ undefined（前面の外挿で補わない）", async () => {
    const app = makeApp();
    app.backMap.getCoordinateFromPixel = vi.fn(() => null);
    await expect(app.clientPointToLngLat(10 + 200, 20 + 50)).resolves.toBeUndefined();
    expect(app.from.sysCoord2MercAsync).not.toHaveBeenCalled();
  });

  it("pixelToMerc（getViewExtent の 4 隅）は紙の外でも前面の外挿のまま", async () => {
    const app = makeApp();
    expect(await app.pixelToMerc([200, 50])).toEqual([20050, 5050]);
    expect(app.backMap.getCoordinateFromPixel).not.toHaveBeenCalled();
  });
});

function lnglatOfMerc(merc: number[]): [number, number] {
  const ll = transform(merc, "EPSG:3857", "EPSG:4326");
  return [ll[0], ll[1]];
}
