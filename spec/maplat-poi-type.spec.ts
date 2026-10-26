// clickMarker の detail の共通の型 MaplatPoi（@maplat/core/common）。
// Core が実際に detail にする値（POI の正規化 → id の付与 → 描画時の icon・html の補い。src/index.ts の
// redrawMarkers と同じ手順）が型ガード isMaplatPoi を満たすことを、旧 UI（Maplat/src/ui_marker.ts）が
// 読むキーを網羅した入力で確かめる。
import { describe, it, expect } from "vitest";
import { normalizeLayers } from "../src/normalize_pois";
import { createHtmlFromTemplate, createIconSet } from "../src/template_works";
import { isMaplatPoi, type MaplatPoi } from "../src/common";

const POIS = {
  type: "FeatureCollection",
  id: "main",
  features: [
    {
      type: "Feature",
      properties: {
        name: { ja: "城", en: "Castle" },
        address: { ja: "住所", en: "Address" },
        desc: { ja: "<b>説明</b>", en: "desc" },
        image: "castle.jpg",
        icon: "img/stones.png"
      },
      geometry: { type: "Point", coordinates: [139.5, 36.2] }
    },
    {
      type: "Feature",
      properties: {
        name: "寺",
        url: { ja: "https://ja.example.org/", en: "https://en.example.org/" },
        media: [
          "a.jpg",
          { src: "b.mp4", type: "video", caption: { ja: "動画", en: "video" } },
          { src: "c.jpg", thumbnail: "c_s.jpg", desc: "旧名の caption" }
        ]
      },
      geometry: { type: "Point", coordinates: [139.51, 36.21] }
    },
    {
      type: "Feature",
      properties: { name: "外部", directgo: { href: "https://example.org/", blank: true } },
      geometry: { type: "Point", coordinates: [139.52, 36.22] }
    },
    {
      type: "Feature",
      properties: { name: "HTML", html: "<p>html</p>", directgo: "https://example.org/x" },
      geometry: { type: "Point", coordinates: [139.53, 36.23] }
    }
  ]
};

describe("MaplatPoi（clickMarker の detail の型）", () => {
  it("Core の正規化と描画時の補いを経た datum が isMaplatPoi を満たす", async () => {
    const layers = await normalizeLayers(structuredClone(POIS), { name: "app" });
    const cluster = layers.main;
    // 祖先（レイヤー → アプリ）のテンプレート: POI 自身の icon・html が無ければ補われる
    const app = {
      iconTemplate: '{"icon":"img/<%= id %>.png","selectedIcon":"img/<%= id %>_s.png"}',
      poiTemplate: "<h1><%= typeof name === 'string' ? name : name.ja %></h1>",
      poiStyle: "h1 { color: red; }"
    };
    const details: MaplatPoi[] = cluster.pois.map((poi: any) =>
      createHtmlFromTemplate(createIconSet(poi, cluster, app), cluster, app)
    );
    expect(details.length).toBe(4);
    for (const d of details) expect(isMaplatPoi(d), JSON.stringify(d)).toBe(true);
    // 正規化: 座標は lnglat・id と namespaceID が付く
    expect(details[0].lnglat).toEqual([139.5, 36.2]);
    expect(details.map(d => d.namespaceID)).toEqual(["main_0", "main_1", "main_2", "main_3"]);
    // 描画時の補い: icon は POI 自身が勝つ・無ければ iconTemplate、html は無ければ poiTemplate と poiStyle
    expect(details[0].icon).toBe("img/stones.png");
    expect(details[1].icon).toBe("img/main_1.png");
    expect(details[1].selectedIcon).toBe("img/main_1_s.png");
    expect(details[1].html).toBe("<h1>寺</h1>");
    expect(details[1].poiStyle).toBe("h1 { color: red; }");
    expect(details[3].html).toBe("<p>html</p>");
    expect(details[3].poiStyle).toBeUndefined();
    // 元の POI は書き換えない（icon の補いは複製に載る）
    expect(cluster.pois[1].icon).toBeUndefined();
  });

  it("形の違う値は isMaplatPoi を満たさない", () => {
    const ok: MaplatPoi = { id: "p", namespaceID: "main#p", name: "x" };
    expect(isMaplatPoi(ok)).toBe(true);
    expect(isMaplatPoi({ ...ok, id: 3 })).toBe(true);
    expect(isMaplatPoi(null)).toBe(false);
    expect(isMaplatPoi([ok])).toBe(false);
    expect(isMaplatPoi({ id: "p" })).toBe(false); // namespaceID が無い
    expect(isMaplatPoi({ ...ok, name: 1 })).toBe(false);
    expect(isMaplatPoi({ ...ok, desc: { ja: 1 } })).toBe(false);
    expect(isMaplatPoi({ ...ok, lnglat: [1] })).toBe(false);
    expect(isMaplatPoi({ ...ok, image: { href: "x" } })).toBe(false);
    expect(isMaplatPoi({ ...ok, media: ["a.jpg", 1] })).toBe(false);
    expect(isMaplatPoi({ ...ok, icon: 1 })).toBe(false);
    expect(isMaplatPoi({ ...ok, directgo: { blank: true } })).toBe(false);
    // 独自のキー（テンプレートが読む値等）はそのまま許す
    expect(isMaplatPoi({ ...ok, custom: { any: [1, 2] } })).toBe(true);
  });
});
