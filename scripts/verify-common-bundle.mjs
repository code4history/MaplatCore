#!/usr/bin/env node
// ビルド後の @maplat/core/common（dist/maplat_core_common.js）・@maplat/core/conformance
// （dist/maplat_core_conformance.js）・@maplat/core/template（dist/maplat_core_template.js）に、
// OpenLayers・Weiwudi・@maplat/transform・turf 由来のコードが入っていないことを確かめる。
// あわせて、Nunjucks（Quyuan の @c4h/quyuan/template）が common・conformance・element に入っていないこと
// （element の利用者に本体の分と 2 重に載せない）と、template には入っていること（対照）を確かめる。
// `pnpm run build` の最後に走る。
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
import assert from "node:assert/strict";
import ts from "typescript";

// コメントのライセンス表記を拾わず、構文上の import とプロパティ参照だけを見る。
function olIiifReport(code) {
  const ast = ts.createSourceFile("bundle.js", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const imports = {};
  const references = { IIIF: 0, IIIFInfo: 0 };
  const visit = node => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const path = node.moduleSpecifier.text;
      const bindings = node.importClause?.namedBindings;
      if (["ol/source", "ol/format"].includes(path) && bindings && ts.isNamedImports(bindings)) {
        imports[path] = [...(imports[path] || []), ...bindings.elements.map(e => (e.propertyName || e.name).text)];
      }
    }
    if (ts.isPropertyAccessExpression(node) && Object.hasOwn(references, node.name.text)) references[node.name.text]++;
    if (ts.isElementAccessExpression(node) && ts.isStringLiteral(node.argumentExpression) && Object.hasOwn(references, node.argumentExpression.text)) references[node.argumentExpression.text]++;
    ts.forEachChild(node, visit);
  };
  visit(ast);
  return { imports, references };
}

const IIIF_SOURCE = /(?:^|\/)ol\/(?:source\/IIIF|format\/IIIFInfo)\.js$/;
// 個別のファイルの道（既定の import・名前空間の import・動的 import・require を含む）で OL の IIIF を読む文
const IIIF_DIRECT_IMPORT = /(?:\bfrom|\bimport|\brequire)\s*\(?\s*["']ol\/(?:source\/IIIF|format\/IIIFInfo)(?:\.js)?["']/;
const TILE_STATE_SOURCE = /(?:^|\/)ol\/TileState\.js$/;

// 以前の ES bundle の import 文そのものを使う陽性対照。
const control = olIiifReport(`import { XYZ as BA, Google as kg, Vector as vi, IIIF as _g } from "ol/source";
import { IIIFInfo as NA } from "ol/format";`);
assert(control.imports["ol/source"].includes("IIIF"));
assert(control.imports["ol/format"].includes("IIIFInfo"));
assert.deepEqual(olIiifReport("new source.IIIF(); new format.IIIFInfo(); format.IIIFInfo;").references, { IIIF: 1, IIIFInfo: 2 });
assert.deepEqual(olIiifReport('/*! ol/source/IIIF.js; source.IIIF */ const name = "format.IIIFInfo";').references, { IIIF: 0, IIIFInfo: 0 });
assert(IIIF_SOURCE.test("../node_modules/ol/source/IIIF.js"));
assert(IIIF_DIRECT_IMPORT.test('import IIIF from "ol/source/IIIF";'));
assert(IIIF_DIRECT_IMPORT.test('import * as F from "ol/format/IIIFInfo.js";'));
assert(IIIF_DIRECT_IMPORT.test('const m = await import("ol/source/IIIF.js");'));
assert(!IIIF_DIRECT_IMPORT.test('import { XYZ } from "ol/source";'));
assert(IIIF_SOURCE.test("../node_modules/.pnpm/ol@10.11.0/node_modules/ol/format/IIIFInfo.js"));
assert(TILE_STATE_SOURCE.test("../node_modules/ol/TileState.js"));

if (process.argv[2] === "--ol-iiif-report") {
  console.log(JSON.stringify(olIiifReport(readFileSync(process.argv[3], "utf8")), null, 2));
  process.exit(0);
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

const FORBIDDEN_SOURCE = /node_modules\/(?:\.pnpm\/[^/]+\/node_modules\/)?(ol|@c4h\/weiwudi|@maplat\/transform|@turf\/[^/]+|maplibre-gl|mapbox-gl)\//;
const FORBIDDEN_IMPORT = /(?:\bfrom|\bimport)\s*\(?\s*["'](ol|ol\/[^"']*|@c4h\/weiwudi[^"']*|@maplat\/transform[^"']*|@turf\/[^"']*|maplibre-gl|mapbox-gl)["']/;
// OpenLayers の目印（ol/Map・ol/css・ol/renderer が使う DOM の class 名）
const OL_MARKERS = ["ol-viewport", "ol-overlaycontainer-stopevent", "ol-unselectable", "ol-layer"];
// Nunjucks（@c4h/quyuan/template）の目印: ソースマップの sources の Quyuan と、Nunjucks の例外の文言
const NUNJUCKS_SOURCE = /@c4h\/quyuan\/|node_modules\/(?:\.pnpm\/[^/]+\/node_modules\/)?nunjucks\//;
const NUNJUCKS_MARKER = "Template render error";

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
    nunjucks: (sources || []).some(x => NUNJUCKS_SOURCE.test(x)) || code.includes(NUNJUCKS_MARKER),
    imports: [...code.matchAll(/(?:^|\n)\s*(?:import|export)\s[^;]*?from\s*["']([^"']+)["']/g)].map(m => m[1])
  };
}

// [成果物, 許可する import, Nunjucks を含むべきか]
for (const [file, allowedImports, wantNunjucks] of [
  ["maplat_core_common.js", [], false],
  ["maplat_core_conformance.js", ["./maplat_core_common.js"], false],
  // POI テンプレートの評価だけの入口。Nunjucks を同梱し、外部の import は持たない
  ["maplat_core_template.js", [], true]
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
  if (r.nunjucks !== wantNunjucks) fail(`${file}: Nunjucks を${wantNunjucks ? "含まない（評価の関数が抜けた）" : "含む（element の利用者に 2 重に載る）"}`);
  else ok(`${file}: Nunjucks を${wantNunjucks ? "含む" : "含まない"}`);
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
    // Nunjucks は ./maplat_core.js の側にだけある（要素の入口自身と、それが import する common には無い）
    if (r.nunjucks) fail("maplat_core_element.js: Nunjucks を抱えている（本体の分と 2 重になる）");
    else ok("maplat_core_element.js: Nunjucks を含まない");
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

// 製品の本体は OL の IIIF を import も同梱もしない。
for (const file of ["maplat_core.js", "maplat_core.umd.js"]) {
  const r = inspect(file);
  if (!r) continue;
  const report = olIiifReport(r.code);
  const imported = Object.values(report.imports).flat().filter(name => ["IIIF", "IIIFInfo"].includes(name));
  const direct = r.code.match(IIIF_DIRECT_IMPORT)?.[0] ?? null;
  if (imported.length || direct || report.references.IIIF || report.references.IIIFInfo) fail(`${file}: OL の IIIF 参照 ${JSON.stringify({ ...report, direct })}`);
  else ok(`${file}: OL の IIIF の import・プロパティ参照が無い`);
  if (!r.sources) fail(`${file}: ソースマップが無い`);
  else {
    const bundled = r.sources.filter(s => IIIF_SOURCE.test(s));
    if (bundled.length) fail(`${file}: OL の IIIF が同梱されている ${bundled.join(", ")}`);
    else ok(`${file}: sources に ol/source/IIIF.js・ol/format/IIIFInfo.js が無い`);
    if (!r.sources.some(s => TILE_STATE_SOURCE.test(s))) fail(`${file}: 対照の ol/TileState.js が sources に無い`);
    else ok(`${file}: 対照の ol/TileState.js が sources にある`);
  }
}

if (failed) {
  console.error("verify-common-bundle: 失敗");
  process.exit(1);
}
console.log("verify-common-bundle: すべて合格");
