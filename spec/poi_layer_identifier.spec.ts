import { describe, it, expect, vi, beforeEach } from "vitest";
import { MaplatApp } from "../src/index";

/**
 * POI layer API 契約明確化 (m18-t6) — namespaceID 解決と warning 仕様の検証。
 *
 * この spec は src/index.ts の MaplatApp.prototype に生える POI layer API を、
 * 最小の mock `this` に直接 bind して呼び出す。spec/poi_layer_order.spec.ts が
 * source/mixin.ts 側の listPoiLayers を Mixed.prototype から取得するのとは異なり、
 * こちらは MaplatApp.prototype から取得する（showPoiLayer / hidePoiLayer /
 * addPoiLayer / removePoiLayer / getPoiLayer は index.ts 側の実装）。
 */

// ---- helpers ---------------------------------------------------------------

function makeAppLayer(id: string, nsID: string, extra: any = {}) {
  return {
    id,
    namespaceID: nsID,
    name: id,
    pois: [{ id: `${id}_p0`, lnglat: [0, 0] }],
    ...extra
  };
}

function makeMapSource(mapID: string, pois: Record<string, any>) {
  return {
    mapID,
    pois,
    listPoiLayers(hideOnly = false, nonzero = false) {
      return Object.keys(pois)
        .sort((a, b) => (a === "main" ? -1 : b === "main" ? 1 : 0))
        .map(key => pois[key])
        .filter(layer =>
          nonzero
            ? hideOnly
              ? layer.pois.length && layer.hide
              : layer.pois.length
            : hideOnly
              ? layer.hide
              : true
        );
    },
    getPoiLayer(id: string) {
      return pois[id];
    },
    addPoiLayer(id: string, data: any) {
      if (id === "main") return;
      if (pois[id]) return;
      pois[id] = {
        id,
        namespaceID: `${mapID}#${id}`,
        name: id,
        pois: Array.isArray(data) ? data : []
      };
    },
    removePoiLayer(id: string) {
      if (id === "main") return;
      if (!pois[id]) return;
      delete pois[id];
    }
  };
}

function makeSelf(opts: {
  appPois?: Record<string, any>;
  cacheHash?: Record<string, any>;
}) {
  const self: any = {
    pois: opts.appPois ?? {},
    cacheHash: opts.cacheHash ?? {},
    from: {
      listPoiLayers: () => []
    },
    appName: "TestApp",
    requestUpdateState: vi.fn(),
    redrawMarkers: vi.fn(),
    dispatchPoiNumber: vi.fn()
  };
  // showPoiLayer / hidePoiLayer / removePoiLayer は内部で this.getPoiLayer
  // および this.listPoiLayers を呼ぶため、mock self にも bind して生やす。
  self.getPoiLayer = (id: any) => getPoiLayer.call(self, id);
  self.listPoiLayers = (...args: any[]) => listPoiLayers.call(self, ...args);
  return self;
}

// MaplatApp.prototype の POI layer API を取得（bind せず call/.apply で self を注入）
const proto = MaplatApp.prototype as any;
const showPoiLayer = proto.showPoiLayer as (id: any) => void;
const hidePoiLayer = proto.hidePoiLayer as (id: any) => void;
const getPoiLayer = proto.getPoiLayer as (id: any) => any;
const addPoiLayer = proto.addPoiLayer as (id: any, data: any) => void;
const removePoiLayer = proto.removePoiLayer as (id: any) => void;
const listPoiLayers = proto.listPoiLayers as (
  hideOnly?: boolean,
  nonzero?: boolean
) => any[];

describe("POI layer identifier contract (m18-t6)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // ---- U-1: app 直下 resolve ---------------------------------------------
  it("U-1: getPoiLayer resolves app-level layer by app id", () => {
    const layer = makeAppLayer("shrines", "shrines");
    const self = makeSelf({ appPois: { shrines: layer } });
    const result = getPoiLayer.call(self, "shrines");
    expect(result).toBe(layer);
  });

  // ---- U-2: namespaced resolve -------------------------------------------
  it("U-2: getPoiLayer resolves map-derived layer by <mapID>#<localId>", () => {
    const mapLayer = makeAppLayer("temples", "omt#temples");
    const source = makeMapSource("omt", { temples: mapLayer });
    const self = makeSelf({ cacheHash: { omt: source } });
    const result = getPoiLayer.call(self, "omt#temples");
    expect(result).toBe(mapLayer);
  });

  // ---- U-3: unresolved returns undefined, no warning --------------------
  it("U-3: getPoiLayer returns undefined for unresolved id and emits no warning", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const self = makeSelf({});
    const result = getPoiLayer.call(self, "nope");
    expect(result).toBeUndefined();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  // ---- U-4: bare "main" resolves to app-level ----------------------------
  it("U-4: getPoiLayer('main') returns app-level main, not map-derived", () => {
    const appMain = makeAppLayer("main", "main");
    const mapMain = makeAppLayer("main", "omt#main");
    const source = makeMapSource("omt", { main: mapMain });
    const self = makeSelf({
      appPois: { main: appMain },
      cacheHash: { omt: source }
    });
    const result = getPoiLayer.call(self, "main");
    expect(result).toBe(appMain);
  });

  // ---- U-5: hidePoiLayer namespaced isolation ----------------------------
  it("U-5: hidePoiLayer namespaced sets hide only on the target map-derived layer", () => {
    const appTemples = makeAppLayer("temples", "temples");
    const mapTemples = makeAppLayer("temples", "omt#temples");
    const source = makeMapSource("omt", { temples: mapTemples });
    const self = makeSelf({
      appPois: { temples: appTemples },
      cacheHash: { omt: source }
    });
    hidePoiLayer.call(self, "omt#temples");
    expect(mapTemples.hide).toBe(true);
    expect(appTemples.hide).toBeUndefined();
  });

  // ---- U-6: listPoiLayers elements carry id and namespaceID -------------
  it("U-6: listPoiLayers(false, true) entries have both id and namespaceID", () => {
    const appMain = makeAppLayer("main", "main");
    const appShrines = makeAppLayer("shrines", "shrines");
    const mapTemples = makeAppLayer("temples", "omt#temples");
    const source = makeMapSource("omt", { temples: mapTemples });
    const self = makeSelf({
      appPois: { main: appMain, shrines: appShrines },
      cacheHash: { omt: source }
    });
    self.from = source;
    const result = listPoiLayers.call(self, false, true);
    for (const layer of result) {
      expect(layer).toHaveProperty("id");
      expect(layer).toHaveProperty("namespaceID");
    }
    expect(result.length).toBeGreaterThan(0);
  });

  // ---- U-7: removePoiLayer namespaced removes from map source -----------
  it("U-7: removePoiLayer('<mapID>#<localId>') removes the layer from the map source", () => {
    const mapTemples = makeAppLayer("temples", "omt#temples");
    const source = makeMapSource("omt", { temples: mapTemples });
    const self = makeSelf({
      appPois: {},
      cacheHash: { omt: source }
    });
    removePoiLayer.call(self, "omt#temples");
    expect(source.pois.temples).toBeUndefined();
    expect(self.redrawMarkers).toHaveBeenCalled();
  });

  // ---- U-8: removePoiLayer unresolved no-op + warning --------------------
  it("U-8: removePoiLayer('<mapID>#<missing>') does not remove, warns once, no redrawMarkers", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const source = makeMapSource("omt", {});
    const self = makeSelf({
      appPois: {},
      cacheHash: { omt: source }
    });
    removePoiLayer.call(self, "omt#ghost");
    expect(source.pois.ghost).toBeUndefined();
    expect(self.redrawMarkers).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain("omt#ghost");
  });

  // ---- U-9: addPoiLayer namespaced adds to map source -------------------
  it("U-9: addPoiLayer('<mapID>#<newId>', data) adds the layer to the map source", () => {
    const source = makeMapSource("omt", {});
    const self = makeSelf({
      appPois: {},
      cacheHash: { omt: source }
    });
    addPoiLayer.call(self, "omt#newlayer", []);
    expect(source.pois.newlayer).toBeDefined();
    expect(source.pois.newlayer.namespaceID).toBe("omt#newlayer");
    expect(self.redrawMarkers).toHaveBeenCalled();
  });

  // ---- U-10: unresolved id on show/hide/add/remove → 1 warning each -----
  it("U-10: unresolved id warns once on show/hide/add/remove without throwing or state change", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const self = makeSelf({
      appPois: {},
      cacheHash: {}
    });

    expect(() => showPoiLayer.call(self, "ghost")).not.toThrow();
    expect(() => hidePoiLayer.call(self, "ghost")).not.toThrow();
    expect(() => addPoiLayer.call(self, "ghostmap#ghost", [])).not.toThrow();
    expect(() => removePoiLayer.call(self, "ghostmap#ghost")).not.toThrow();

    expect(self.redrawMarkers).not.toHaveBeenCalled();
    expect(self.requestUpdateState).not.toHaveBeenCalled();
    expect(self.dispatchPoiNumber).not.toHaveBeenCalled();

    // 4 回の呼び出しで 4 回の warning（各 API 1 回）
    expect(warnSpy).toHaveBeenCalledTimes(4);
    // それぞれの文言に対象 id が含まれる
    const warnedIds = warnSpy.mock.calls.map(c => c[0] as string);
    expect(warnedIds[0]).toContain("ghost");
    expect(warnedIds[1]).toContain("ghost");
    expect(warnedIds[2]).toContain("ghostmap#ghost");
    expect(warnedIds[3]).toContain("ghostmap#ghost");
  });
});
