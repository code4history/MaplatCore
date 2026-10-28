// IIIF Image の地図を mapSourceFactory の 2 つの道（json の道・noload の道）から作ったときの試験。
//
// 測るのは製品の形そのもの:
//   - 作った source の tileUrlFunction([z, x, y]) が IIIF の URL を返すこと
//     （mapID を渡す。mapID があると HistMap は tiles/<mapID>/… の url を補い、OpenLayers の
//      UrlTile は url があると渡した tileUrlFunction を作り直すので、options だけを見て緑にしない）
//   - Weiwudi に登録されないこと（getMapCacheEnable(mapID) が偽。enableCache: true でも）
//   - delivery と url が両方ある地図は delivery で表示され、警告が地図ごとに 1 回
//   - 失敗は IiifDeliveryError（reason つき。noload の道も json の道も同じ資料で）
//
// 資料は spec/fixtures/iiif/ のもの。ネットワークには出ない（fetch はスタブ）。
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const registerMap = vi.hoisted(() =>
  vi.fn(async (mapID: string) => ({
    url: `weiwudi/${mapID}/{z}/{x}/{y}`,
    stats: async () => ({})
  }))
);

vi.mock("@c4h/weiwudi", () => ({ default: { registerMap } }));

import { mapSourceFactory } from "../src/source_ex";
import { HistMap_tin } from "../src/source/histmap_tin";
import { IiifDeliveryError } from "../src/iiif/delivery";
import { MaplatApp } from "../src/index";

function readFixture(name: string) {
  return JSON.parse(
    readFileSync(resolve(__dirname, "fixtures/iiif", name), "utf-8")
  );
}

const NDL = readFixture("ndl-948741-r1.info.json");
const NDL_URL: string = NDL["@id"];
const NDL_TILE = `${NDL_URL}/768,512,256,256/256,/0/default.jpg`;
const LEVEL0 = readFixture("level0-tiles-256.info.json");

type StubResponse = {
  ok: boolean;
  status: number;
  headers: { get: (name: string) => string | null };
  json: () => Promise<any>;
  text: () => Promise<string>;
};

function jsonResponse(body: unknown, ok = true): StubResponse {
  const payload = JSON.stringify(body);
  return {
    ok,
    status: ok ? 200 : 404,
    headers: {
      get: (name: string) => {
        const key = name.toLowerCase();
        if (key === "content-type") return "application/json";
        if (key === "content-length") return String(payload.length);
        return null;
      }
    },
    json: () => Promise.resolve(JSON.parse(payload)),
    text: () => Promise.resolve(payload)
  };
}

// fetch のスタブ。info.json は資料（または失敗）、それ以外は地図マスタ（設定ファイル）を返す。
function stubFetch(info: unknown | ((url: string) => unknown), setting: any = {}) {
  const fetchStub = vi.fn(async (url: string) => {
    if (typeof url === "string" && url.endsWith("/info.json")) {
      const body = typeof info === "function" ? (info as any)(url) : info;
      if (body instanceof Error) return jsonResponse({ error: "ng" }, false);
      return jsonResponse(body);
    }
    return jsonResponse(setting);
  });
  vi.stubGlobal("fetch", fetchStub);
  return fetchStub;
}

const warns = () =>
  (console.warn as any).mock.calls
    .map((call: any[]) => String(call[0]))
    .filter((text: string) => text.startsWith("Maplat: "));

let createAsync: any;

beforeEach(() => {
  registerMap.mockClear();
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  // json の道は HistMap_tin.createAsync を通る。地図の transform（compiled）はこの試験の
  // 対象ではないので、同じ options で実物の HistMap_tin を作り、setupMapParameter だけ
  // callback をその場で呼ぶ（格子と tileUrlFunction は本物を測る）。
  createAsync = vi
    .spyOn(HistMap_tin, "createAsync")
    .mockImplementation(async (options: any) => {
      const obj: any = new HistMap_tin(options);
      obj.setupMapParameter = (callback: any) => callback();
      return obj;
    });
});

afterEach(() => {
  createAsync.mockRestore();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// noload の道の地図（width・height を直接渡す）
const noloadMap = (extra: Record<string, unknown> = {}) => ({
  mapID: "ndl-iiif",
  noload: true,
  width: NDL.width,
  height: NDL.height,
  ...extra
});

// json の道の地図（compiled.wh を渡す。地図マスタは fetch のスタブが返す）
const jsonMap = (extra: Record<string, unknown> = {}) => ({
  mapID: "ndl-iiif-json",
  settingFile: "maps/ndl-iiif-json.json",
  compiled: { wh: [NDL.width, NDL.height] },
  ...extra
});

const iiifDelivery = (url: string = NDL_URL) => ({ type: "iiifImage", url });

describe("json の道と noload の道の両方で IIIF の URL の関数が入る", () => {
  it("noload の道: mapID を渡しても tileUrlFunction は IIIF の URL を返す", async () => {
    stubFetch(NDL);
    const source: any = await mapSourceFactory(
      noloadMap({ delivery: iiifDelivery() }),
      { enableCache: true }
    );
    expect(source.mapID).toBe("ndl-iiif");
    expect(String(source.tileUrlFunction([4, 3, 2], 1, null))).toBe(NDL_TILE);
  });

  it("json の道: 同じ資料で同じ URL を返す", async () => {
    stubFetch(NDL);
    const source: any = await mapSourceFactory(
      jsonMap({ delivery: iiifDelivery() }),
      { enableCache: true }
    );
    expect(source.mapID).toBe("ndl-iiif-json");
    expect(String(source.tileUrlFunction([4, 3, 2], 1, null))).toBe(NDL_TILE);
  });

  it("level0-256 の地図は minZoom を options から受け取る（scaleFactors 1〜4 の写しで 2）", async () => {
    const info = JSON.parse(JSON.stringify(LEVEL0));
    info.tiles[0].scaleFactors = [1, 2, 4];
    stubFetch(info);
    const source: any = await mapSourceFactory(
      noloadMap({
        mapID: "level0-iiif",
        width: info.width,
        height: info.height,
        delivery: iiifDelivery(info.id)
      }),
      { enableCache: true }
    );
    expect(source.minZoom).toBe(2);
  });

  it.each([
    ["noload の道", () => noloadMap({ delivery: iiifDelivery() })],
    ["json の道", () => jsonMap({ delivery: iiifDelivery() })]
  ])("%s: 取れない info.json は IiifDeliveryError（fetch-failed）", async (_label, make) => {
    stubFetch(new Error("ng"));
    const promise = mapSourceFactory(make(), { enableCache: true });
    await expect(promise).rejects.toBeInstanceOf(IiifDeliveryError);
    await expect(promise).rejects.toMatchObject({ reason: "fetch-failed" });
    expect(createAsync).not.toHaveBeenCalled();
  });

  it.each([
    ["noload の道", () => noloadMap()],
    ["json の道", () => jsonMap()]
  ])("%s: http:/https: でない URL は IiifDeliveryError（bad-url）", async (_label, make) => {
    stubFetch(NDL);
    await expect(
      mapSourceFactory(
        { ...make(), delivery: iiifDelivery("ftp://example.test/iiif") },
        { enableCache: true }
      )
    ).rejects.toMatchObject({ reason: "bad-url" });
  });

  it("noload の道: 大きさが渡した width・height と違えば size-mismatch", async () => {
    stubFetch(NDL);
    await expect(
      mapSourceFactory(
        noloadMap({ width: NDL.width - 1, delivery: iiifDelivery() }),
        { enableCache: true }
      )
    ).rejects.toMatchObject({ reason: "size-mismatch" });
  });

  it("json の道: 大きさが compiled.wh と違えば size-mismatch", async () => {
    stubFetch(NDL);
    await expect(
      mapSourceFactory(
        jsonMap({
          compiled: { wh: [NDL.width + 10, NDL.height] },
          delivery: iiifDelivery()
        }),
        { enableCache: true }
      )
    ).rejects.toMatchObject({ reason: "size-mismatch" });
  });

  it("v1 の info.json は unsupported-version（両方の道）", async () => {
    const v1 = {
      "@context": "http://library.stanford.edu/iiif/image-api/1.1/context.json",
      identifier: NDL_URL,
      width: NDL.width,
      height: NDL.height,
      profile: "http://library.stanford.edu/iiif/image-api/1.1/comliance.html#level2"
    };
    stubFetch(v1);
    await expect(
      mapSourceFactory(noloadMap({ delivery: iiifDelivery() }), {})
    ).rejects.toMatchObject({ reason: "unsupported-version" });
    await expect(
      mapSourceFactory(jsonMap({ delivery: iiifDelivery() }), {})
    ).rejects.toMatchObject({ reason: "unsupported-version" });
  });
});

describe("IIIF の地図は Weiwudi に登録されない", () => {
  it("json の道: enableCache: true でも登録されず、getCacheEnable は偽", async () => {
    stubFetch(NDL);
    const source: any = await mapSourceFactory(
      jsonMap({ delivery: iiifDelivery() }),
      { enableCache: true }
    );
    expect(registerMap).not.toHaveBeenCalled();
    expect(source.getCacheEnable()).toBe(false);
  });

  it("noload の道: 同じく登録されない", async () => {
    stubFetch(NDL);
    const source: any = await mapSourceFactory(
      noloadMap({ delivery: iiifDelivery() }),
      { enableCache: true }
    );
    expect(registerMap).not.toHaveBeenCalled();
    expect(source.getCacheEnable()).toBe(false);
  });
});

describe("delivery と url が両方あるとき・@id が違うとき", () => {
  it("noload の道: delivery で表示され、url を消したことを 1 回だけ警告する", async () => {
    stubFetch(NDL);
    const source: any = await mapSourceFactory(
      noloadMap({
        url: "https://tile.example.test/{z}/{x}/{y}.jpg",
        delivery: iiifDelivery()
      }),
      { enableCache: true }
    );
    expect(String(source.tileUrlFunction([4, 3, 2], 1, null))).toBe(NDL_TILE);
    expect(warns()).toEqual([
      'Maplat: map "ndl-iiif" has both delivery and url; using delivery.'
    ]);
  });

  it("json の道: urls（配列）でも同じ", async () => {
    stubFetch(NDL);
    const source: any = await mapSourceFactory(
      jsonMap({
        urls: [
          "https://a.example.test/{z}/{x}/{y}.jpg",
          "https://b.example.test/{z}/{x}/{y}.jpg"
        ],
        delivery: iiifDelivery()
      }),
      { enableCache: true }
    );
    expect(String(source.tileUrlFunction([4, 3, 2], 1, null))).toBe(NDL_TILE);
    expect(warns()).toEqual([
      'Maplat: map "ndl-iiif-json" has both delivery and url; using delivery.'
    ]);
  });

  it("info.json の @id が delivery.url と違えば、タイルは delivery.url を基準にして警告が 1 回", async () => {
    const mirror = "https://mirror.example.test/iiif/948741/R0000001";
    stubFetch(NDL);
    const source: any = await mapSourceFactory(
      noloadMap({ delivery: iiifDelivery(mirror) }),
      { enableCache: true }
    );
    expect(String(source.tileUrlFunction([4, 3, 2], 1, null))).toBe(
      `${mirror}/768,512,256,256/256,/0/default.jpg`
    );
    expect(warns()).toEqual([
      `Maplat: the IIIF image service "${NDL_URL}" differs from the delivery URL "${mirror}"; using the delivery URL.`
    ]);
  });

  it("delivery の type が iiifImage 以外なら delivery を無視して今どおり（警告 1 回）", async () => {
    stubFetch(NDL);
    const source: any = await mapSourceFactory(
      noloadMap({ delivery: { type: "manifest", url: NDL_URL } }),
      { enableCache: true }
    );
    // 今どおり、tiles/<mapID>/… のテンプレートが残る
    expect(String(source.tileUrlFunction([4, 3, 2], 1, null))).toBe(
      "tiles/ndl-iiif/4/3/2.jpg"
    );
    expect(warns().length).toBe(1);
    expect(warns()[0]).toContain('Maplat: map "ndl-iiif" has delivery type "manifest"');
  });
});

// --- 起動: 実物の mapSourceFactory から sourcesLoader → handleSources まで通す ---
describe("失敗した IIIF の地図があっても他の地図で起動する", () => {
  it("印に変えて起動を続け、初期の地図も使える地図に選び直す", async () => {
    stubFetch(new Error("ng"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const changeMap = vi.fn().mockResolvedValue(undefined);
    const app: any = Object.assign(Object.create(MaplatApp.prototype), {
      appData: {
        sources: [
          {
            mapID: "plain",
            noload: true,
            width: 1024,
            height: 1024,
            url: "tiles/plain/{z}/{x}/{y}.jpg"
          },
          noloadMap({ delivery: iiifDelivery() })
        ]
      },
      enableCache: true,
      startFrom: "ndl-iiif",
      mapObject: { on: vi.fn() },
      cacheHash: undefined,
      mercSrc: undefined,
      from: undefined,
      mapboxMap: undefined,
      maplibreMap: undefined,
      logger: undefined,
      initialRestore: {},
      dispatchEvent: vi.fn(),
      changeMap,
      setMapClick: vi.fn(),
      setPointerEvents: vi.fn(),
      setMapOnOff: vi.fn(),
      setMouseCursor: vi.fn(),
      setBackMapBehavior: vi.fn(),
      raiseChangeViewpoint: vi.fn(),
      runLifecyclePhase: vi.fn().mockResolvedValue(undefined)
    });

    const sources = await app.sourcesLoader({});
    await app.handleSources(sources);

    // 使える地図だけが cacheHash に入る
    expect(Object.keys(app.cacheHash)).toEqual(["plain"]);
    // 生の sourceLoaded の detail には印を入れない
    expect(app.dispatchEvent.mock.calls[0][0].detail.map((s: any) => s.mapID)).toEqual([
      "plain"
    ]);
    // 要素の経路には usable: false で入る
    expect(app.sourceLoadedDetail(app.dispatchEvent.mock.calls[0][0].detail)).toEqual([
      { mapID: "plain", usable: true },
      { mapID: "ndl-iiif", usable: false }
    ]);
    // 初期の地図を選び直して起動する
    expect(changeMap).toHaveBeenCalledWith("plain", {});
    expect(warns()).toEqual([
      'Maplat: the initial map "ndl-iiif" is not usable; starting from "plain" instead.'
    ]);
    expect(errorSpy).toHaveBeenCalledWith(
      'Maplat: IIIF image for map "ndl-iiif" is not usable: fetch-failed'
    );
    errorSpy.mockRestore();
  });
});
