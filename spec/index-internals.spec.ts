// MaplatApp が要素（<maplat-app>）にだけ見せる内部面（設計 v2 §6.5・§6.6・§6.9・N3）の検査。
//   sourceLoadedDetail: sourceLoaded の { mapID, usable }[] の材料（cacheHash の同一性）
//   pixelToMerc:        pixel → 地図の座標 → merc の連鎖（旧 clientPointToLngLat と同じ・点検なし）
//   viewportSize:       表示領域の大きさ（Minor 1。4 隅の作り方と undefined/null の意味づけは要素に残す）
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

describe("sourceLoadedDetail（A6）", () => {
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

describe("pixelToMerc（A7・M6）", () => {
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

describe("viewportSize（A7・Minor 1）", () => {
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

describe("updateSize（A10）", () => {
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

describe("clientPointToLngLat の連鎖（N3）", () => {
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

  it("pixelToMerc が undefined なら undefined（旧クラスの戻り値を変えない。M6）", async () => {
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
