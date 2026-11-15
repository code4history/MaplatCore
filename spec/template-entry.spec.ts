// @maplat/core/template（src/template.ts）の入口の検査。
//   1. 入口からたどれる import の連鎖に OpenLayers・Weiwudi・@maplat/transform・turf を入れない。
//      外部のパッケージは Quyuan の @c4h/quyuan/template（Nunjucks を同梱した単体のモジュール）だけ
//   2. 出す関数（createIconSet・createHtmlFromTemplate・applyPoiTemplates）は MaplatApp のマーカーの描画と
//      getMarker が使うのと同じ実装で、同じ設定なら同じ結果になる（上位の実装が使っても Core と表示が食い違わない）
//   3. package.json の exports
// common（@maplat/core/common）はこれらを出さない（Nunjucks を element の利用者に 2 重に載せないため）。
// ビルド後の dist/maplat_core_template.js の検査は scripts/verify-common-bundle.mjs（build で走る）。
import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import * as template from "../src/template";
import * as common from "../src/common";
import * as works from "../src/template_works";
import { MaplatApp } from "../src/index";
import { FORBIDDEN, ROOT, walk } from "./entry-imports";

const proto = MaplatApp.prototype as any;
const getMarker = (self: any, id: any) => proto.getMarker.call(self, id);

describe("@maplat/core/template の入口", () => {
  it("たどれる import に ol・weiwudi・@maplat/transform・turf が無く、外部は @c4h/quyuan/template だけ", () => {
    const { files, external } = walk("src/template.ts");
    expect([...external.keys()].filter(s => FORBIDDEN.test(s))).toEqual([]);
    expect([...external.keys()]).toEqual(["@c4h/quyuan/template"]);
    expect(files).toEqual([
      "src/element_contract.ts",
      "src/functions.ts",
      "src/meta_keys.ts",
      "src/template.ts",
      "src/template_works.ts"
    ]);
  });

  it("出すのは 3 つの関数だけ。common からは出さない", () => {
    expect(Object.keys(template).sort()).toEqual(["applyPoiTemplates", "createHtmlFromTemplate", "createIconSet"]);
    for (const name of Object.keys(template)) expect(name in common, name).toBe(false);
  });

  it("package.json の exports に ./template があり、副作用の無い入口として扱う", () => {
    const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf-8"));
    expect(pkg.exports["./template"]).toEqual({ types: "./dist/template.d.ts", import: "./dist/maplat_core_template.js" });
    expect(pkg.sideEffects).not.toContain("./dist/maplat_core_template.js");
  });
});

describe("@maplat/core/template の POI テンプレートの評価", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    works.resetTemplateWarnings();
  });

  it("MaplatApp が使う関数と同じものを指す（ソースの上で。ビルド後は別の成果物の中の同じ実装の写し）", () => {
    expect(template.createIconSet).toBe(works.createIconSet);
    expect(template.createHtmlFromTemplate).toBe(works.createHtmlFromTemplate);
    expect(template.applyPoiTemplates).toBe(works.applyPoiTemplates);
  });

  it("Nunjucks で評価する（HTML エスケープ・safe・iconTemplate の JSON）", () => {
    const layer = {
      poiTemplate: "<b>{{ name }}</b>{{ desc | safe }}",
      poiStyle: "color:red",
      iconTemplate: '{"icon": {{ u | dump | safe }}, "selectedIcon": "s.png"}'
    };
    const got = template.applyPoiTemplates({ name: "<x>", desc: "<i>d</i>", u: "a.png?x=1&y=2" }, layer);
    expect(got.html).toBe("<b>&lt;x&gt;</b><i>d</i>");
    expect(got.poiStyle).toBe("color:red");
    expect(got.icon).toBe("a.png?x=1&y=2");
    expect(got.selectedIcon).toBe("s.png");
  });

  it("祖先は前から順に見る。html はテンプレートの無い段を飛ばし、icon は同じ段の icon も使い、POI 自身の html・icon が勝つ", () => {
    const near = { icon: "near.png" };
    const far = { poiTemplate: "<p>{{ name }}</p>", iconTemplate: '{"icon": "far.png"}' };
    const got = template.applyPoiTemplates({ name: "n" }, near, far);
    expect(got.icon).toBe("near.png");
    expect(got.html).toBe("<p>n</p>");
    const own = template.applyPoiTemplates({ name: "n", html: "<u>own</u>", icon: "own.png" }, far);
    expect(own.html).toBe("<u>own</u>");
    expect(own.icon).toBe("own.png");
  });

  it("渡した POI は書き換えない（applyPoiTemplates・createIconSet）", () => {
    const poi = { name: "n" };
    template.applyPoiTemplates(poi, { poiTemplate: "<p>{{ name }}</p>", iconTemplate: '{"icon": "t.png"}' });
    template.createIconSet(poi, { icon: "t.png" });
    expect(poi).toEqual({ name: "n" });
  });

  it("createHtmlFromTemplate は渡した POI そのものに html・poiStyle を書き込む", () => {
    const poi: Record<string, unknown> = { name: "n" };
    const got = template.createHtmlFromTemplate(poi, { poiTemplate: "<p>{{ name }}</p>", poiStyle: "s" });
    expect(got).toBe(poi);
    expect(poi).toEqual({ name: "n", html: "<p>n</p>", poiStyle: "s" });
  });

  it("POI に 0.x の旧いキー名（snake_case）があると例外を投げる（名前を書き換えはしない）", () => {
    for (const fn of [template.applyPoiTemplates, template.createIconSet, template.createHtmlFromTemplate]) {
      expect(() => fn({ name: "n", selected_icon: "s.png" }, { icon: "a.png" })).toThrow(/selected_icon.*selectedIcon/);
    }
  });

  it("旧い記法は評価せず、次の段へ進む（警告はこの写しの中で 1 回）", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const got = template.applyPoiTemplates({ name: "n" }, { poiTemplate: "<%= name %>" }, { poiTemplate: "<p>{{ name }}</p>" });
    expect(got.html).toBe("<p>n</p>");
    template.applyPoiTemplates({ name: "n" }, { poiTemplate: "${name}" });
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("アプリの層の POI: getMarker の戻り値と、template の applyPoiTemplates(poi, 層, アプリ) が同じ", () => {
    const poi = { id: "p1", namespaceID: "p1", name: "x", u: "a.png" };
    const layer = { pois: [poi], iconTemplate: '{"icon": {{ u | dump | safe }}}' };
    const self: any = { pois: { main: layer }, cacheHash: {}, poiTemplate: "<b>{{ name }}</b>", poiStyle: "s" };
    expect(getMarker(self, "p1")).toEqual(template.applyPoiTemplates(poi, layer, self));
    expect(getMarker(self, "p1")).toMatchObject({ html: "<b>x</b>", poiStyle: "s", icon: "a.png" });
  });

  it("地図の層の POI: getMarker の戻り値と、template の applyPoiTemplates(poi, 層, 地図, アプリ) が同じ", () => {
    const poi = { id: "q1", namespaceID: "A#q1", name: "z" };
    const layer = { pois: [poi] };
    const source = { pois: { main: layer }, icon: "map.png" };
    const self: any = { pois: {}, cacheHash: { A: source }, poiTemplate: "<i>{{ name }}</i>" };
    expect(getMarker(self, "A#q1")).toEqual(template.applyPoiTemplates(poi, layer, source, self));
    expect(getMarker(self, "A#q1")).toMatchObject({ html: "<i>z</i>", icon: "map.png" });
  });
});
