// 使えない IIIF の地図があっても起動することの試験（AC4 の起動の部分・初期の地図が使えないとき）。
//
//   - sourcesLoader: IIIF の失敗（IiifDeliveryError）だけを印（{ mapID, __maplatUnusable }）に変える。
//     IIIF 以外の失敗は今どおり Promise.all を落とす。
//   - handleSources: 印のついた地図は cacheHash と生の sourceLoaded の detail に入れず、
//     __unusableSources に控える。要素の経路（sourceLoadedDetail）の末尾に { mapID, usable: false } を足す。
//   - setInitialMap: 初期の地図（startFrom・initialRestore.mapID）が使えないときは、
//     今の既定と同じ規則（cache の最後）の地図に変えて警告を 1 回出す（画面が空にならない）。
//
// mapSourceFactory はこの試験の対象ではない（spec/iiif-source-factory.spec.ts）ので、
// このファイルでは mapSourceFactory だけを差し替える。
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const factory = vi.hoisted(() => ({
  impl: async (_option: any, _common: any): Promise<any> => ({ mapID: "placeholder" })
}));

vi.mock("../src/source_ex", async importOriginal => {
  const actual = await importOriginal<typeof import("../src/source_ex")>();
  return {
    ...actual,
    mapSourceFactory: (option: any, common: any) => factory.impl(option, common)
  };
});

import { MaplatApp } from "../src/index";
import { IiifDeliveryError } from "../src/iiif/delivery";

function stub(fields: Record<string, any> = {}): any {
  return Object.assign(Object.create(MaplatApp.prototype), fields);
}

// handleSources の終端（click・pointer 等の登録）はこの試験の対象ではない
function appStub(fields: Record<string, any> = {}): any {
  return stub({
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
    setMapClick: vi.fn(),
    setPointerEvents: vi.fn(),
    setMapOnOff: vi.fn(),
    setMouseCursor: vi.fn(),
    setBackMapBehavior: vi.fn(),
    raiseChangeViewpoint: vi.fn(),
    runLifecyclePhase: vi.fn().mockResolvedValue(undefined),
    ...fields
  });
}

// 古地図の source の代わり（この試験で見るのは mapID と扱いだけ）
const histSource = (mapID: string) => ({
  mapID,
  isBasemap: () => false,
  isMapbox: () => false,
  isMapLibre: () => false,
  setMap: vi.fn()
});

let errors: string[];
let warns: string[];

beforeEach(() => {
  errors = [];
  warns = [];
  vi.spyOn(console, "error").mockImplementation((...args: any[]) => {
    errors.push(String(args[0]));
  });
  vi.spyOn(console, "warn").mockImplementation((...args: any[]) => {
    warns.push(String(args[0]));
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("sourcesLoader: IIIF の失敗だけを印に変える", () => {
  const mapReturnValue = {
    homePos: undefined,
    defZoom: undefined,
    zoomRestriction: undefined,
    mercMinZoom: undefined,
    mercMaxZoom: undefined
  };

  it("IIIF の地図が失敗しても配列を最後まで作り、文字列の要素も地図 ID として印にする", async () => {
    factory.impl = async (option: any) => {
      const mapID = typeof option === "string" ? option : option.mapID;
      if (mapID === "gsi") throw new IiifDeliveryError("bad-url");
      if (mapID === "ndl-iiif") throw new IiifDeliveryError("fetch-failed");
      return { mapID };
    };
    const app = appStub({
      appData: {
        sources: [
          "gsi",
          { mapID: "ndl-iiif", delivery: { type: "iiifImage", url: "https://x" } },
          { mapID: "osm" }
        ]
      }
    });
    const result: any[] = await app.sourcesLoader(mapReturnValue);
    expect(result.map(item => item.mapID)).toEqual(["gsi", "ndl-iiif", "osm"]);
    expect(result[0]).toEqual({
      mapID: "gsi",
      __maplatUnusable: { reason: "bad-url" }
    });
    expect(result[1]).toEqual({
      mapID: "ndl-iiif",
      __maplatUnusable: { reason: "fetch-failed" }
    });
    expect(result[2]).toEqual({ mapID: "osm" });
  });

  it("IIIF 以外の失敗は今どおり Promise.all を落とす", async () => {
    factory.impl = async () => {
      throw new Error("Fail to load map json");
    };
    const app = appStub({ appData: { sources: [{ mapID: "broken" }] } });
    await expect(app.sourcesLoader(mapReturnValue)).rejects.toThrow(
      "Fail to load map json"
    );
  });
});

describe("handleSources: 使えない地図は起動を止めない", () => {
  const marked = {
    mapID: "ndl-iiif",
    __maplatUnusable: { reason: "fetch-failed" }
  };

  it("印の地図は cacheHash と生の sourceLoaded の detail に入らず、要素の経路に usable: false で入る", async () => {
    const hist = histSource("h1");
    const app = appStub({ setInitialMap: vi.fn().mockResolvedValue(undefined) });
    await app.handleSources([hist, marked]);

    expect(Object.keys(app.cacheHash)).toEqual(["h1"]);
    expect(app.__unusableSources).toEqual([
      { mapID: "ndl-iiif", reason: "fetch-failed" }
    ]);

    // 生の detail（旧クラスの経路）には入らない
    expect(app.dispatchEvent).toHaveBeenCalledTimes(1);
    const event = app.dispatchEvent.mock.calls[0][0];
    expect(event.type).toBe("sourceLoaded");
    expect(event.detail).toEqual([hist]);

    // 要素の経路の末尾に足す
    expect(app.sourceLoadedDetail(event.detail)).toEqual([
      { mapID: "h1", usable: true },
      { mapID: "ndl-iiif", usable: false }
    ]);

    // 気づかせるための記録は 1 回
    expect(errors).toEqual([
      'Maplat: IIIF image for map "ndl-iiif" is not usable: fetch-failed'
    ]);
    // 使える地図だけで起動の続きに進む
    expect(app.setInitialMap).toHaveBeenCalledWith([hist]);
  });

  it("使える地図が 1 枚も無ければ、今どおり初期化の続きを行わない", async () => {
    const app = appStub({ setInitialMap: vi.fn() });
    await app.handleSources([marked]);
    expect(app.cacheHash).toEqual({});
    expect(app.setInitialMap).not.toHaveBeenCalled();
    expect(app.runLifecyclePhase).toHaveBeenCalledWith("core-ready");
  });
});

describe("setInitialMap: 初期の地図が使えないとき", () => {
  it("startFrom の地図が無ければ、cache の最後の地図で起動して警告を 1 回出す", async () => {
    const changeMap = vi.fn().mockResolvedValue(undefined);
    const app = stub({ initialRestore: {}, startFrom: "ndl-iiif", changeMap });
    await app.setInitialMap([histSource("a"), histSource("b")]);
    expect(changeMap).toHaveBeenCalledWith("b", {});
    expect(warns).toEqual([
      'Maplat: the initial map "ndl-iiif" is not usable; starting from "b" instead.'
    ]);
  });

  it("復元する地図（initialRestore.mapID）が使えないときも同じ", async () => {
    const changeMap = vi.fn().mockResolvedValue(undefined);
    const app = stub({
      initialRestore: { mapID: "ndl-iiif", transparency: 0 },
      startFrom: undefined,
      changeMap
    });
    await app.setInitialMap([histSource("a"), histSource("b")]);
    expect(changeMap).toHaveBeenCalledWith("b", { mapID: "ndl-iiif", transparency: 0 });
    expect(warns.length).toBe(1);
  });

  it("使える地図が初期の地図なら何も変えない（警告も出さない）", async () => {
    const changeMap = vi.fn().mockResolvedValue(undefined);
    const app = stub({ initialRestore: {}, startFrom: "a", changeMap });
    await app.setInitialMap([histSource("a"), histSource("b")]);
    expect(changeMap).toHaveBeenCalledWith("a", {});
    expect(warns).toEqual([]);
  });

  it("handleSources を通した起動でも、失敗した IIIF の地図を初期に選ばず、使える地図で起動する", async () => {
    const good = histSource("good");
    const changeMap = vi.fn().mockResolvedValue(undefined);
    const app = appStub({
      startFrom: "ndl-iiif",
      changeMap
    });
    await app.handleSources([
      good,
      { mapID: "ndl-iiif", __maplatUnusable: { reason: "timeout" } }
    ]);
    expect(changeMap).toHaveBeenCalledWith("good", {});
    expect(warns).toEqual([
      'Maplat: the initial map "ndl-iiif" is not usable; starting from "good" instead.'
    ]);
    expect(errors).toEqual([
      'Maplat: IIIF image for map "ndl-iiif" is not usable: timeout'
    ]);
  });
});
