import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  normalizeLayers,
  isPoiLayerRef
} from "../src/normalize_pois";

// AC4-1〜8,10,11 の unit（設計 §6.1）。表駆動 pois.spec.ts は既存3ケースの無回帰基準として別途維持。

const opts = (namespace = "ns", name = "AppName") => ({
  namespace,
  name
});

// FC ビルダ。coord は homePosition 近傍に合わせる意味はないが unit では座標変換を通らないので任意。
const fc = (
  id: string,
  features: any[] = [],
  extra: Record<string, any> = {}
) => ({
  id,
  type: "FeatureCollection",
  ...(Object.keys(extra).length ? { properties: extra } : {}),
  features
});

const point = (id: string, lng: number, lat: number, props: Record<string, any> = {}) => ({
  type: "Feature",
  id,
  properties: { id, name: id, ...props },
  geometry: { type: "Point", coordinates: [lng, lat] }
});

// nodesLoader は fetch(url) を呼ぶ。Response-like を返す stub。
const makeFetchStub = (map: Record<string, any>) =>
  vi.fn(async (url: string) => {
    if (!(url in map)) {
      return { ok: false, status: 404, json: async () => ({}) };
    }
    return { ok: true, json: async () => map[url] };
  });

let fetchSpy: ReturnType<typeof makeFetchStub> | undefined;

beforeEach(() => {
  fetchSpy = undefined;
  vi.unstubAllGlobals();
});

const stubFetch = (map: Record<string, any>) => {
  fetchSpy = makeFetchStub(map);
  vi.stubGlobal("fetch", fetchSpy);
  return fetchSpy;
};

describe("AC4-1: wrapper {layer:<URL>, hide:true} → cluster.hide", () => {
  it("URL wrapper with hide:true lands hide on cluster", async () => {
    const FC = fc("urlA", [point("p1", 0, 0)]);
    stubFetch({ "pois/x.geojson": FC });
    const input = [{ layer: "pois/x.geojson", hide: true }];
    const out = await normalizeLayers(input, opts());
    expect(out.urlA.hide).toBe(true);
    expect(fetchSpy).toHaveBeenCalled();
  });
});

describe("AC4-2: wrapper {layer:<FC>, icon} → layer化 + 補完が通常FCと同一", () => {
  it("inline-FC wrapper produces same cluster as plain FC (plus icon)", async () => {
    const FC = fc("fcB", [point("p1", 1, 2)]);
    const plain = await normalizeLayers([FC], opts());
    const wrapped = await normalizeLayers(
      [{ layer: structuredClone(FC), icon: "a.png" }],
      opts()
    );
    // icon 以外は同一
    const { icon: _plainIcon, ...plainCluster } = plain.fcB;
    const { icon: _wrappedIcon, ...wrappedCluster } = wrapped.fcB;
    expect(wrappedCluster).toEqual(plainCluster);
    expect(wrapped.fcB.icon).toBe("a.png");
  });
});

describe("AC4-3: 上書き4キーの着地先", () => {
  it("hide→hide / title→name / icon→icon / selectedIcon→selectedIcon", async () => {
    const FC = fc("fcC", [point("p1", 1, 2)]);
    const out = await normalizeLayers(
      [
        {
          layer: structuredClone(FC),
          hide: true,
          title: "T",
          icon: "i.png",
          selectedIcon: "s.png"
        }
      ],
      opts()
    );
    expect(out.fcC.hide).toBe(true);
    expect(out.fcC.name).toBe("T");
    expect(out.fcC.icon).toBe("i.png");
    expect(out.fcC.selectedIcon).toBe("s.png");
  });
});

describe("AC4-4: 無効値は上書きしない（データ側の値が残る）", () => {
  const cases: [string, any, string, any][] = [
    ["hide:false は上書きしない（データ側 false のまま）", { hide: false }, "hide", false],
    ["hide:'yes'（非真）は上書きしない（データ側 false が残る）", { hide: "yes" }, "hide", false],
    ["title:'' は上書きしない", { title: "" }, "name", "dataName"],
    ["title:{} は上書きしない", { title: {} }, "name", "dataName"],
    ["icon:'' は上書きしない", { icon: "" }, "icon", "dataIcon"],
    ["icon:123（非 string）は上書きしない", { icon: 123 }, "icon", "dataIcon"]
  ];
  for (const [label, override, key, expected] of cases) {
    it(label, async () => {
      // データ側に既定値を置く（FC.properties 経由で cluster へ）
      const FC = fc(
        "fcD",
        [point("p1", 1, 2)],
        key === "name"
          ? { name: "dataName" }
          : key === "icon"
            ? { icon: "dataIcon" }
            : { hide: false }
      );
      const wrapper: any = { layer: structuredClone(FC) };
      Object.assign(wrapper, override);
      const out = await normalizeLayers([wrapper], opts());
      expect(out.fcD[key]).toEqual(expected);
    });
  }
});

describe("AC4-5: 優先順位 ラッパー > FC.properties", () => {
  it("both set icon → wrapper wins", async () => {
    const FC = fc("fcE", [point("p1", 1, 2)], { icon: "props.png" });
    const out = await normalizeLayers(
      [{ layer: structuredClone(FC), icon: "wrap.png" }],
      opts()
    );
    expect(out.fcE.icon).toBe("wrap.png");
  });
});

describe("AC4-6: FC.properties.icon/.hide の cluster 到達（現行挙動の固定）", () => {
  it("plain FC with properties.icon/hide reaches cluster", async () => {
    const FC = fc("fcF", [point("p1", 1, 2)], { icon: "p.png", hide: true });
    const out = await normalizeLayers([structuredClone(FC)], opts());
    expect(out.fcF.icon).toBe("p.png");
    expect(out.fcF.hide).toBe(true);
  });
});

describe("AC4-7: 未知キー破棄 + warn / 内部キー非到達", () => {
  it("unknown key foo is dropped with warn; internal keys (pois/id/__nextId) not overwritten", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const FC = fc("fcG", [point("p1", 1, 2)]);
    const wrapper = {
      layer: structuredClone(FC),
      pois: [],
      id: "x",
      __nextId: 99,
      foo: 1
    };
    const out = await normalizeLayers([wrapper], opts());
    // 未知キー foo は warn される
    expect(warnSpy).toHaveBeenCalled();
    const warned = warnSpy.mock.calls.map(c => String(c[0])).join("\n");
    expect(warned).toContain("foo");
    // 内部キーはラッパー値ではなく正規化結果が保持される
    expect(out.fcG.id).toBe("fcG");
    expect(out.fcG.__nextId).not.toBe(99);
    expect(out.fcG.pois.length).toBe(1);
    warnSpy.mockRestore();
  });
});

describe("AC4-8: 文脈ごとの判別", () => {
  it("(i) 全文脈で非ラッパー: isPoiLayerRef === false", () => {
    const FC = fc("h", [point("p1", 1, 2)]);
    const dictLayer = { pois: [{ id: "x" }] }; // layer が FC でない object
    expect(isPoiLayerRef(FC)).toBe(false); // FC
    expect(isPoiLayerRef({ layer: "x", lat: 1, lng: 2 })).toBe(false); // 座標を持つ
    expect(isPoiLayerRef("x")).toBe(false); // 文字列
    expect(isPoiLayerRef([])).toBe(false); // 配列
    expect(isPoiLayerRef(null)).toBe(false);
    expect(isPoiLayerRef({ layer: { pois: [] } })).toBe(false); // layer 値が FC でない
    expect(isPoiLayerRef({ layer: dictLayer })).toBe(false); // {layer:{pois:[...]}} 値型制約
  });

  it("(ii) 文脈依存 {layer:<FC>}（上書きキーなし）: isPoiLayerRef === true", () => {
    const FC = fc("ctx", [point("p1", 1, 2)]);
    expect(isPoiLayerRef({ layer: FC })).toBe(true);
  });

  it("(ii) 配列要素として渡せばラッパー受理（key=FC.id）", async () => {
    const FC = fc("arr", [point("p1", 1, 2)]);
    const out = await normalizeLayers([{ layer: structuredClone(FC) }], opts());
    expect(out.arr).toBeDefined();
    expect(out.arr.pois.length).toBe(1);
  });

  it("(ii) pois 全体として渡せば旧辞書維持（key='layer' の cluster）", async () => {
    const FC = fc("whole", [point("p1", 1, 2)]);
    const out = await normalizeLayers({ layer: structuredClone(FC) }, opts());
    // 旧辞書分岐: key='layer'
    expect(out.layer).toBeDefined();
    expect(out.layer.pois.length).toBe(1);
    // isPoiLayerRefAsWhole は上書きキーを要求するため、全体としてはラッパー扱いされない
  });

  it("(ii) {layer:<FC>, hide:true}（上書きキーあり）全体はラッパー受理（key=FC.id・hide到達）", async () => {
    const FC = fc("wholeHide", [point("p1", 1, 2)]);
    const out = await normalizeLayers(
      { layer: structuredClone(FC), hide: true },
      opts()
    );
    expect(out.wholeHide).toBeDefined();
    expect(out.wholeHide.hide).toBe(true);
    expect(out.layer).toBeUndefined();
  });
});

describe("AC4-9 補: 旧レイヤ辞書の無回帰", () => {
  it("plain dict {key: cluster} stays dict", async () => {
    const dict = { mylayer: { pois: [{ lng: 1, lat: 2, name: "n" }] } };
    const out = await normalizeLayers(structuredClone(dict), opts());
    expect(out.mylayer).toBeDefined();
    expect(out.mylayer.pois.length).toBe(1);
    expect(out.mylayer.namespaceID).toBe("ns#mylayer");
  });
});

describe("AC4-10: 非破壊性（wrapper / FC 入力）", () => {
  it("wrapper input object is not mutated", async () => {
    const FC = fc("nonmut", [point("p1", 1, 2)]);
    const wrapper = { layer: structuredClone(FC), hide: true, icon: "i.png" };
    const snapshot = structuredClone(wrapper);
    await normalizeLayers([wrapper], opts());
    expect(wrapper).toEqual(snapshot);
  });

  it("inline FC inside wrapper is not mutated", async () => {
    const FC = fc("nonmut2", [point("p1", 1, 2)], { icon: "p.png" });
    const snapshot = structuredClone(FC);
    await normalizeLayers([{ layer: FC, icon: "w.png" }], opts());
    expect(FC).toEqual(snapshot);
  });
});

describe("AC4-9補/回帰: POIオブジェクト配列モードでは wrapper.layer の fetch が走らない", () => {
  it("混在配列（先頭=座標POI, 後続=ラッパー）で fetch 呼ばれず throw しない", async () => {
    const spy = stubFetch({}); // 一切応答しない（呼ばれたら監視できる）
    const mixed = [
      { lng: 1, lat: 2, name: "plainPoi" }, // 座標を持つ → POI オブジェクト配列モード
      { layer: "pois/never-fetched.geojson", hide: true } // ラッパー形だが到達しない
    ];
    // 旧順序なら wrapper.layer の fetch が走り、URL が不在なら reject → throw するはず。
    // 新順序ではモード判定が先頭要素で決まるため fetch が呼ばれない。
    const out = await normalizeLayers(mixed, opts());
    expect(spy).not.toHaveBeenCalled();
    expect(out.main).toBeDefined();
    expect(out.main.pois.length).toBe(2); // 2件とも main に正規化される
  });

  it("fetch が reject しても混在配列では throw しない", async () => {
    const rejecting = vi.fn(async () => {
      throw new Error("network");
    });
    vi.stubGlobal("fetch", rejecting);
    const mixed = [
      { lng: 1, lat: 2, name: "plainPoi" },
      { layer: "pois/never-fetched.geojson", hide: true }
    ];
    await expect(normalizeLayers(mixed, opts())).resolves.toBeDefined();
    expect(rejecting).not.toHaveBeenCalled();
  });
});
