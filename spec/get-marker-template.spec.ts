// getMarker(id) は、マーカーの描画（clickMarker の detail）と同じくテンプレートを当てた複製を返す（#150）。
// 実メソッドを偽の self で呼ぶ。
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MaplatApp } from "../src/index";
import { resetTemplateWarnings } from "../src/template_works";

const proto = MaplatApp.prototype as any;
const getMarker = (self: any, id: any) => proto.getMarker.call(self, id);
const updateMarker = (self: any, id: any, data: any, ow?: any) => proto.updateMarker.call(self, id, data, ow);
const selectMarker = (self: any, id: any) => proto.selectMarker.call(self, id);

function appWith(layer: any) {
  return { pois: { main: layer }, cacheHash: {}, redrawMarkers: vi.fn() } as any;
}

describe("getMarker はテンプレートを当てた複製を返す", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    resetTemplateWarnings();
  });

  it("T1: アプリの層。html が付き、実体には付かない", () => {
    const entity = { id: "p1", namespaceID: "p1", name: "x" };
    const self = appWith({ pois: [entity], poiTemplate: "<b>{{ name }}</b>" });
    const got = getMarker(self, "p1");
    expect(got.html).toBe("<b>x</b>");
    expect(self.pois.main.pois[0].html).toBeUndefined();
    expect(got).not.toBe(entity);
  });

  it("T2: 地図の層。source の poiTemplate が当たり、実体に html が無い", () => {
    const entity = { id: "q1", namespaceID: "A#q1", name: "z" };
    const source = { pois: { main: { pois: [entity] } }, poiTemplate: "<i>{{ name }}</i>" };
    const self: any = { pois: {}, cacheHash: { A: source }, redrawMarkers: vi.fn() };
    const got = getMarker(self, "A#q1");
    expect(got.html).toBe("<i>z</i>");
    expect(entity).not.toHaveProperty("html");
    expect(got).not.toBe(entity);
  });

  it("T3: iconTemplate・層の icon・POI 自身の icon の優先", () => {
    const tpl = { id: "p1", namespaceID: "p1", u: "a.png" };
    const self1 = appWith({ pois: [tpl], iconTemplate: '{"icon": {{ u | dump | safe }}}', icon: "layer.png" });
    expect(getMarker(self1, "p1").icon).toBe("a.png");
    const self2 = appWith({ pois: [{ id: "p1", namespaceID: "p1" }], icon: "layer.png" });
    expect(getMarker(self2, "p1").icon).toBe("layer.png");
    const self3 = appWith({
      pois: [{ id: "p1", namespaceID: "p1", icon: "own.png" }],
      iconTemplate: '{"icon": "t.png"}',
      icon: "layer.png"
    });
    expect(getMarker(self3, "p1").icon).toBe("own.png");
    expect(self1.pois.main.pois[0].icon).toBeUndefined();
  });

  it("T4: POI 自身に html があればテンプレートを当てず、poiStyle も補わない", () => {
    const self = appWith({
      pois: [{ id: "p1", namespaceID: "p1", name: "x", html: "<u>own</u>" }],
      poiTemplate: "<b>{{ name }}</b>",
      poiStyle: "color:red"
    });
    const got = getMarker(self, "p1");
    expect(got.html).toBe("<u>own</u>");
    expect(got.poiStyle).toBeUndefined();
  });

  it("T5: updateMarker は実体を書き換え、続く getMarker は評価し直す", () => {
    const self = appWith({
      pois: [{ id: "p1", namespaceID: "p1", name: "x" }],
      poiTemplate: "<b>{{ name }}</b>"
    });
    self.getMarker = (id: any) => proto.getMarker.call(self, id);
    expect(getMarker(self, "p1").html).toBe("<b>x</b>");
    updateMarker(self, "p1", { name: "y" });
    expect(self.pois.main.pois[0].name).toBe("y");
    expect(self.pois.main.pois[0].html).toBeUndefined();
    expect(getMarker(self, "p1").html).toBe("<b>y</b>");
    expect(self.redrawMarkers).toHaveBeenCalled();
  });

  it("T6: 旧い記法は html を作らず、例外なし、警告は 1 回", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const self = appWith({
      pois: [{ id: "p1", namespaceID: "p1", name: "x" }],
      poiTemplate: "<%= name %>"
    });
    let got: any;
    expect(() => (got = getMarker(self, "p1"))).not.toThrow();
    expect(got.html).toBeUndefined();
    getMarker(self, "p1");
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("T8: selectMarker はテンプレートの POI でも例外なく選択を立てる", () => {
    const self: any = {
      ...appWith({
        pois: [{ id: "p1", namespaceID: "p1", name: "x", lnglat: [139, 35] }],
        poiTemplate: "<b>{{ name }}</b>"
      }),
      setViewpoint: vi.fn(),
      stateBuffer: {},
      mapObject: undefined
    };
    self.getMarker = (id: any) => proto.getMarker.call(self, id);
    expect(() => selectMarker(self, "p1")).not.toThrow();
    expect(self.__selectedMarker).toBe("p1");
    expect(self.setViewpoint).toHaveBeenCalled();
  });

  it("T9: 無い id・無い名前空間は undefined", () => {
    const self = appWith({ pois: [{ id: "p1", namespaceID: "p1" }] });
    expect(getMarker(self, "nope")).toBeUndefined();
    expect(getMarker(self, "Z#q1")).toBeUndefined();
  });
});
