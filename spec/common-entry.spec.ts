// @maplat/core/common・@maplat/core/conformance の入口（仕様 §5.3・U8・U7）の機械検査。
//   1. 入口からたどれる import の連鎖（src の相対 import を再帰でたどる）に、OpenLayers・Weiwudi・
//      @maplat/transform・turf を入れない。外部のパッケージは DOMPurify だけ
//   2. 公開物の一覧（common の export）と、@maplat/core からの従来の export が壊れていないこと
//   3. package.json の exports・sideEffects
// ビルド後の dist/maplat_core_common.js の検査は scripts/verify-common-bundle.mjs（build で走る）。
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import * as common from "../src/common";
import * as core from "../src/index";
import * as conformance from "../src/conformance";

const ROOT = resolve(__dirname, "..");
const FORBIDDEN = /^(ol(\/|$)|@c4h\/weiwudi|@maplat\/transform|@turf\/|maplibre-gl|mapbox-gl)/;

/** 入口から相対 import をたどり、[ファイル, 外部の import 先] を集める。 */
function walk(entry: string) {
  const files = new Set<string>();
  const external = new Map<string, Set<string>>();
  const stack = [resolve(ROOT, entry)];
  while (stack.length) {
    const file = stack.pop()!;
    if (files.has(file)) continue;
    files.add(file);
    if (!/\.(ts|js)$/.test(file)) continue;
    // 行コメント・ブロックコメントの中の import の例は数えない
    const src = readFileSync(file, "utf-8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    // import ... from "x" / export ... from "x" / import "x"（型だけの import も数える＝型の連鎖も OL に触れない）
    const specs = [...src.matchAll(/(?:import|export)\s[^;]*?from\s*["']([^"']+)["']|import\s*["']([^"']+)["']/g)].map(
      m => m[1] ?? m[2]
    );
    for (const spec of specs) {
      if (spec.startsWith(".")) {
        const base = resolve(dirname(file), spec);
        const candidates = [base, `${base}.ts`, `${base}/index.ts`];
        const hit = candidates.find(c => existsSync(c) && !c.endsWith("/") && /\.(ts|json|png|jpg)$/.test(c));
        if (!hit) throw new Error(`cannot resolve ${spec} from ${file}`);
        stack.push(hit);
      } else {
        if (!external.has(spec)) external.set(spec, new Set());
        external.get(spec)!.add(file.replace(`${ROOT}/`, ""));
      }
    }
  }
  return { files: [...files].map(f => f.replace(`${ROOT}/`, "")).sort(), external };
}

describe("@maplat/core/common の入口が OpenLayers 等を引き込まない", () => {
  for (const entry of ["src/common.ts", "src/conformance/index.ts"]) {
    it(`${entry} からたどれる import に ol・weiwudi・@maplat/transform・turf が無い`, () => {
      const { files, external } = walk(entry);
      const bad = [...external.keys()].filter(s => FORBIDDEN.test(s));
      expect(bad, `forbidden imports: ${bad.map(b => `${b} ← ${[...external.get(b)!]}`).join(", ")}`).toEqual([]);
      // 外部のパッケージは DOMPurify だけ（DOM だけに依る）
      expect([...external.keys()].filter(s => s !== "dompurify")).toEqual([]);
      // 地図の実装のファイルを含まない
      for (const f of files) {
        expect(f).not.toMatch(/^src\/((index|element|map_ex|source_ex|view_ex)\.ts$|source\/)/);
      }
    });
  }

  it("common がたどるファイルの一覧（意図しない連鎖の増加に気づくため）", () => {
    expect(walk("src/common.ts").files).toEqual([
      "parts/bluedot.png",
      "parts/bluedot_small.png",
      "parts/bluedot_transparent.png",
      "parts/defaultpin.png",
      "parts/defaultpin_selected.png",
      "parts/gsi.jpg",
      "parts/gsi_ortho.jpg",
      "parts/osm.jpg",
      "parts/redcircle.png",
      "src/assets.ts",
      "src/common.ts",
      "src/element_base.ts",
      "src/element_contract.ts",
      "src/functions.ts",
      "src/meta_keys.ts",
      "src/sanitize-allowlist.json",
      "src/sanitize.ts"
    ]);
  });
});

describe("@maplat/core/common の公開物", () => {
  it("補助関数（§5.3）", () => {
    for (const name of ["sanitizeHtml", "escapeAttr", "toPlainText", "buildSlideAttrs", "createElement", "normalizeArg"]) {
      expect(typeof (common as any)[name], name).toBe("function");
    }
    expect(Object.keys(common.assets).sort()).toEqual(
      ["bluedot", "bluedot_small", "bluedot_transparent", "defaultpin", "defaultpin_selected", "gsi", "gsi_ortho", "osm", "redcircle"]
    );
  });

  it("名前の表・機能表・型ガード・基底クラス", () => {
    expect(common.MAPLAT_APP_TAG).toBe("maplat-app");
    expect(common.MAPLAT_APP_EVENTS.length).toBe(24);
    expect(common.MAPLAT_APP_METHODS.length).toBe(44);
    expect(common.featuresOf("core")).toEqual({
      "display-mode": false,
      "display-mode:map-warp": false,
      "tile-cache": true,
      mapbox: true,
      "pointer-move": true,
      envelopes: true
    });
    expect(common.LAYER_A_PRO_ATTRIBUTES.map(d => d.attr)).toEqual(["display-mode"]);
    expect(typeof common.MaplatAppElementBase).toBe("function");
    expect(typeof common.defineMaplatAppElementOnce).toBe("function");
    expect(common.propToAttributeName("tapUiVanish")).toBe("tap-ui-vanish");
    expect(common.propToAttributeName("homeMarginPixels")).toBe("home-margin-pixels");
    expect(common.attributeToPropName("selected-icon")).toBe("selectedIcon");
    // 属性の表は名前の機械的な変換（§6.2.1）に従う
    for (const def of [...common.ELEMENT_ATTRIBUTES, ...common.LAYER_A_PRO_ATTRIBUTES, ...common.MAPLAT_UI_ATTRIBUTES]) {
      expect(common.propToAttributeName(def.prop), def.prop).toBe(def.attr);
    }
  });

  it("@maplat/core からの従来の export は同じものを指す（壊していない）", () => {
    expect(core.sanitizeHtml).toBe(common.sanitizeHtml);
    expect(core.escapeAttr).toBe(common.escapeAttr);
    expect(core.toPlainText).toBe(common.toPlainText);
    expect(core.buildSlideAttrs).toBe(common.buildSlideAttrs);
    expect(core.createElement).toBe(common.createElement);
    expect(core.assets).toBe(common.assets);
    expect(typeof core.MaplatApp).toBe("function");
  });

  it("META_KEYS は従来の import 元（source/mixin）からも同じものが読める", async () => {
    const mixin = await import("../src/source/mixin");
    expect(mixin.META_KEYS).toBe(common.META_KEYS);
    expect(mixin.META_KEYS_OPTION).toBe(common.META_KEYS_OPTION);
  });

  it("@maplat/core/conformance の公開物", () => {
    for (const name of [
      "createLayerAConformanceCases",
      "runLayerAConformance",
      "runLayerAConformanceInPage",
      "defineMockMaplatApp",
      "createMockMaplatAppClass",
      "getMockLayerAController"
    ]) {
      expect(typeof (conformance as any)[name], name).toBe("function");
    }
  });
});

describe("package.json の exports・sideEffects", () => {
  const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf-8"));
  it("subpath export に ./common・./conformance がある（既存の . と ./element はそのまま）", () => {
    expect(pkg.exports["."]).toEqual({ types: "./dist/index.d.ts", import: "./dist/maplat_core.js" });
    expect(pkg.exports["./element"]).toEqual({ types: "./dist/element.d.ts", import: "./dist/maplat_core_element.js" });
    expect(pkg.exports["./common"]).toEqual({ types: "./dist/common.d.ts", import: "./dist/maplat_core_common.js" });
    expect(pkg.exports["./conformance"]).toEqual({
      types: "./dist/conformance/index.d.ts",
      import: "./dist/maplat_core_conformance.js"
    });
  });

  it("sideEffects は副作用のある入口（グローバルへの代入・要素の登録）と CSS だけ", () => {
    expect(pkg.sideEffects).toEqual([
      "./dist/maplat_core.js",
      "./dist/maplat_core.umd.js",
      "./dist/maplat_core_element.js",
      "./src/index.ts",
      "./src/element.ts",
      "./src/view_ex.ts", // ol/View の prototype を拡張する副作用だけのモジュール（消えると getDecimalZoom が無くなる）
      "*.css"
    ]);
    expect(pkg.sideEffects.some((p: string) => p.includes("common") || p.includes("conformance"))).toBe(false);
  });
});
