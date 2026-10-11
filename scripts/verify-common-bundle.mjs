#!/usr/bin/env node
// ビルド後の @maplat/core/common（dist/maplat_core_common.js）と @maplat/core/conformance
// （dist/maplat_core_conformance.js）に、OpenLayers・Weiwudi・@maplat/transform・turf 由来のコードが
// 入っていないことを確かめる（仕様 §10.1 U8 の前提 (1)）。`pnpm run build` の最後に走る。
//
// 判定（どれか 1 つでも当たれば失敗。exit code 1）:
//   (a) ソースマップの sources に node_modules/ol/・@c4h/weiwudi・@maplat/transform・@turf・
//       maplibre-gl・mapbox-gl のファイルがある
//   (b) 成果物の JS に、それらのパッケージを読む import / export … from がある
//   (c) 成果物の JS に OpenLayers の目印の文字列（OL の Map が作る DOM の class 名など）がある
// 目印が実際に効くことの対照として、dist/maplat_core.js（OL を同梱する本体）には (a)・(c) が
// 当たることも確かめる（当たらなければ検査の方が壊れているので失敗にする）。
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

const FORBIDDEN_SOURCE = /node_modules\/(?:\.pnpm\/[^/]+\/node_modules\/)?(ol|@c4h\/weiwudi|@maplat\/transform|@turf\/[^/]+|maplibre-gl|mapbox-gl)\//;
const FORBIDDEN_IMPORT = /(?:\bfrom|\bimport)\s*\(?\s*["'](ol|ol\/[^"']*|@c4h\/weiwudi[^"']*|@maplat\/transform[^"']*|@turf\/[^"']*|maplibre-gl|mapbox-gl)["']/;
// OpenLayers の目印（ol/Map・ol/css・ol/renderer が使う DOM の class 名）
const OL_MARKERS = ["ol-viewport", "ol-overlaycontainer-stopevent", "ol-unselectable", "ol-layer"];

let failed = false;
const fail = msg => {
  failed = true;
  console.error(`NG  ${msg}`);
};
const ok = msg => console.log(`OK  ${msg}`);

function inspect(file) {
  const js = resolve(dist, file);
  const map = `${js}.map`;
  if (!existsSync(js)) {
    fail(`${file} がありません（ビルドしてから実行する）`);
    return null;
  }
  const code = readFileSync(js, "utf-8");
  const sources = existsSync(map) ? JSON.parse(readFileSync(map, "utf-8")).sources || [] : null;
  return {
    code,
    sources,
    forbiddenSources: sources ? sources.filter(s => FORBIDDEN_SOURCE.test(s)) : [],
    forbiddenImport: code.match(FORBIDDEN_IMPORT)?.[0] ?? null,
    markers: OL_MARKERS.filter(m => code.includes(m)),
    imports: [...code.matchAll(/(?:^|\n)\s*(?:import|export)\s[^;]*?from\s*["']([^"']+)["']/g)].map(m => m[1])
  };
}

for (const [file, allowedImports] of [
  ["maplat_core_common.js", []],
  ["maplat_core_conformance.js", ["./maplat_core_common.js"]]
]) {
  const r = inspect(file);
  if (!r) continue;
  if (!r.sources) fail(`${file}: ソースマップ ${file}.map がありません`);
  else if (r.forbiddenSources.length) fail(`${file}: ソースマップに ${r.forbiddenSources.join(", ")}`);
  else ok(`${file}: ソースマップの sources ${r.sources.length} 件に ol / weiwudi / @maplat/transform / turf が無い`);
  if (r.forbiddenImport) fail(`${file}: 禁止のパッケージの import「${r.forbiddenImport}」`);
  else ok(`${file}: ol / weiwudi / @maplat/transform / turf の import が無い`);
  if (r.markers.length) fail(`${file}: OpenLayers の目印 ${r.markers.join(", ")}`);
  else ok(`${file}: OpenLayers の目印（${OL_MARKERS.join(", ")}）が無い`);
  const extra = r.imports.filter(i => !allowedImports.includes(i));
  if (extra.length) fail(`${file}: 想定外の import ${extra.join(", ")}`);
  else ok(`${file}: import は ${r.imports.length ? r.imports.join(", ") : "無し"}`);
  if (r.sources) console.log(`    sources: ${r.sources.map(s => s.replace(/^.*node_modules\//, "node_modules/").replace(/^(\.\.\/)+/, "")).join(", ")}`);
}

// 要素の入口は本体と common を import する（common の中身を二重に抱えない）
{
  const r = inspect("maplat_core_element.js");
  if (r) {
    const want = ["./maplat_core.js", "./maplat_core_common.js"];
    const missing = want.filter(i => !r.imports.includes(i));
    if (missing.length) fail(`maplat_core_element.js: ${missing.join(", ")} を import していない（${r.imports.join(", ")}）`);
    else ok(`maplat_core_element.js: import は ${r.imports.join(", ")}`);
    if (r.code.includes("ELEMENT_ATTRIBUTES = [")) fail("maplat_core_element.js: 名前の表を二重に抱えている");
    // 要素の入口自身は OL を同梱しない（OL は ./maplat_core.js の側にある）
    if (r.forbiddenSources.length) fail(`maplat_core_element.js: ソースマップに ${r.forbiddenSources.join(", ")}`);
    else ok(`maplat_core_element.js: ソースマップの sources ${r.sources?.length ?? 0} 件に ol 等が無い（${(r.sources || []).map(s => s.replace(/^(\.\.\/)+/, "")).join(", ")}）`);
  }
}

// 対照: OL を同梱する本体には目印が当たる（当たらなければ検査が効いていない）
{
  const r = inspect("maplat_core.js");
  if (r) {
    if (!r.sources || r.forbiddenSources.length === 0) fail("対照: maplat_core.js のソースマップに ol が見つからない（検査が効いていない）");
    else ok(`対照: maplat_core.js のソースマップには ol 等が ${r.forbiddenSources.length} 件ある（検査は効いている）`);
    if (r.markers.length === 0) fail("対照: maplat_core.js に OpenLayers の目印が見つからない（検査が効いていない）");
    else ok(`対照: maplat_core.js には目印 ${r.markers.join(", ")} がある`);
  }
}

// 副作用だけを持つモジュールが sideEffects の絞り込みで消えていないこと（view_ex.ts は ol/View の prototype を拡張する。
// 2026-10-11、sideEffects から漏れて dist から getDecimalZoom が消え、利用側の起動が TypeError で失敗した）
{
  const body = readFileSync(resolve(dist, "maplat_core.js"), "utf8");
  for (const marker of ["prototype.getDecimalZoom"]) {
    if (body.includes(marker)) ok(`maplat_core.js に ${marker} がある（view_ex.ts の副作用が残っている）`);
    else fail(`maplat_core.js に ${marker} が無い（sideEffects の絞り込みで view_ex.ts が消えた可能性）`);
  }
}

if (failed) {
  console.error("verify-common-bundle: 失敗");
  process.exit(1);
}
console.log("verify-common-bundle: すべて合格");
