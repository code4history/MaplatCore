// @maplat/core/common が出す POI テンプレートの評価（createIconSet・createHtmlFromTemplate・applyPoiTemplates）は、
// MaplatApp のマーカーの描画と getMarker が使う関数そのもので、同じ設定なら同じ結果になる。
// 上位の実装がこの入口から import して使っても、Core と表示が食い違わないことを確かめる。
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as common from "../src/common";
import * as works from "../src/template_works";
import { MaplatApp } from "../src/index";

const proto = MaplatApp.prototype as any;
const getMarker = (self: any, id: any) => proto.getMarker.call(self, id);

describe("@maplat/core/common の POI テンプレートの評価", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    works.resetTemplateWarnings();
  });

  it("MaplatApp が使う関数と同じものを指す", () => {
    expect(common.createIconSet).toBe(works.createIconSet);
    expect(common.createHtmlFromTemplate).toBe(works.createHtmlFromTemplate);
    expect(common.applyPoiTemplates).toBe(works.applyPoiTemplates);
  });

  it("Nunjucks で評価する（HTML エスケープ・safe・iconTemplate の JSON）", () => {
    const layer = {
      poiTemplate: "<b>{{ name }}</b>{{ desc | safe }}",
      poiStyle: "color:red",
      iconTemplate: '{"icon": {{ u | dump | safe }}, "selectedIcon": "s.png"}'
    };
    const got = common.applyPoiTemplates({ name: "<x>", desc: "<i>d</i>", u: "a.png?x=1&y=2" }, layer);
    expect(got.html).toBe("<b>&lt;x&gt;</b><i>d</i>");
    expect(got.poiStyle).toBe("color:red");
    expect(got.icon).toBe("a.png?x=1&y=2");
    expect(got.selectedIcon).toBe("s.png");
  });

  it("祖先は前から順に見る。テンプレートの無い段は飛ばし、POI 自身の html・icon が勝つ", () => {
    const near = { icon: "near.png" };
    const far = { poiTemplate: "<p>{{ name }}</p>", iconTemplate: '{"icon": "far.png"}' };
    const got = common.applyPoiTemplates({ name: "n" }, near, far);
    expect(got.icon).toBe("near.png");
    expect(got.html).toBe("<p>n</p>");
    const own = common.applyPoiTemplates({ name: "n", html: "<u>own</u>", icon: "own.png" }, far);
    expect(own.html).toBe("<u>own</u>");
    expect(own.icon).toBe("own.png");
  });

  it("渡した POI は書き換えない（applyPoiTemplates・createIconSet）", () => {
    const poi = { name: "n" };
    common.applyPoiTemplates(poi, { poiTemplate: "<p>{{ name }}</p>", iconTemplate: '{"icon": "t.png"}' });
    common.createIconSet(poi, { icon: "t.png" });
    expect(poi).toEqual({ name: "n" });
  });

  it("旧い記法は評価せず、次の段へ進む（警告は 1 回）", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const got = common.applyPoiTemplates({ name: "n" }, { poiTemplate: "<%= name %>" }, { poiTemplate: "<p>{{ name }}</p>" });
    expect(got.html).toBe("<p>n</p>");
    common.applyPoiTemplates({ name: "n" }, { poiTemplate: "${name}" });
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("アプリの層の POI: getMarker の戻り値と、common の applyPoiTemplates(poi, 層, アプリ) が同じ", () => {
    const poi = { id: "p1", namespaceID: "p1", name: "x", u: "a.png" };
    const layer = { pois: [poi], iconTemplate: '{"icon": {{ u | dump | safe }}}' };
    const self: any = { pois: { main: layer }, cacheHash: {}, poiTemplate: "<b>{{ name }}</b>", poiStyle: "s" };
    expect(getMarker(self, "p1")).toEqual(common.applyPoiTemplates(poi, layer, self));
    expect(getMarker(self, "p1")).toMatchObject({ html: "<b>x</b>", poiStyle: "s", icon: "a.png" });
  });

  it("地図の層の POI: getMarker の戻り値と、common の applyPoiTemplates(poi, 層, 地図, アプリ) が同じ", () => {
    const poi = { id: "q1", namespaceID: "A#q1", name: "z" };
    const layer = { pois: [poi] };
    const source = { pois: { main: layer }, icon: "map.png" };
    const self: any = { pois: {}, cacheHash: { A: source }, poiTemplate: "<i>{{ name }}</i>" };
    expect(getMarker(self, "A#q1")).toEqual(common.applyPoiTemplates(poi, layer, source, self));
    expect(getMarker(self, "A#q1")).toMatchObject({ html: "<i>z</i>", icon: "map.png" });
  });
});
