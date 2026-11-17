// 埋め込んだ Google Maps のロゴ（src/google_maps_logo.ts）が、公式の配布物の SVG
// （assets/google-maps-logo/）と図形・色・大きさで同じことを確かめる。
// 利用条件: "Don't modify the logo in any way." / "Maintain the aspect ratio of the logo to avoid distortion."
// 外してよいのは XML 宣言・コメント・id 属性・空白だけ（scripts/build-google-maps-logo.mjs）。
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { GOOGLE_MAPS_LOGO_DARK_OUTLINE, GOOGLE_MAPS_LOGO_LIGHT_OUTLINE } from "../src/google_maps_logo";

/** 要素を文書の順に並べ、名前と属性（id を除く。値の空白はつめる）の一覧にする。 */
function shape(svg: string): string[] {
  const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
  expect(doc.querySelector("parsererror")).toBeNull();
  const rows: string[] = [];
  const walk = (el: Element) => {
    const attrs = [...el.attributes]
      .filter(a => a.name !== "id")
      .map(a => `${a.name}=${a.value.replace(/\s+/g, " ").trim()}`)
      .sort();
    rows.push(`${el.tagName} ${attrs.join(" ")}`);
    [...el.children].forEach(walk);
  };
  walk(doc.documentElement);
  return rows;
}

const original = (file: string) => readFileSync(resolve(__dirname, "../assets/google-maps-logo", file), "utf8");

describe("Google Maps のロゴ（公式の SVG を変えずに埋め込む）", () => {
  it.each([
    ["GoogleMaps_Logo_WithLightOutline.svg", GOOGLE_MAPS_LOGO_LIGHT_OUTLINE],
    ["GoogleMaps_Logo_WithDarkOutline.svg", GOOGLE_MAPS_LOGO_DARK_OUTLINE]
  ])("%s と同じ図形", (file, embedded) => {
    const rows = shape(embedded);
    expect(rows).toEqual(shape(original(file)));
    // 原寸 105×22（字の高さ 18px。利用条件の高さは 16〜19dp）
    expect(rows[0]).toContain("viewBox=0 0 105 22");
    expect(rows[0]).toContain("width=105px");
    expect(rows[0]).toContain("height=22px");
    expect(embedded).not.toMatch(/\sid="/);
    expect(embedded).not.toContain("<?xml");
    expect(embedded).not.toContain("<!--");
  });

  it("2 つは枠と字の色だけが違う（light: 白い枠、dark: 濃い枠と白い字）", () => {
    const light = new DOMParser().parseFromString(GOOGLE_MAPS_LOGO_LIGHT_OUTLINE, "image/svg+xml");
    const dark = new DOMParser().parseFromString(GOOGLE_MAPS_LOGO_DARK_OUTLINE, "image/svg+xml");
    expect(light.querySelector('g[opacity="0.8"] path')!.getAttribute("fill")).toBe("#FFFFFF");
    expect(dark.querySelector('g[opacity="0.8"] path')!.getAttribute("fill")).toBe("#1E1E1E");
  });
});
