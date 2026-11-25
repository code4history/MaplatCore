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
import { readFileSync, existsSync, readdirSync } from "fs";
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
// 未公開の Transform を node_modules/@maplat/transform からローカルのチェックアウト
// （MaplatTransform-*）へ差し替えてビルドした場合も同梱を拾う
const FORBIDDEN_LOCAL_TRANSFORM = /MaplatTransform-[^/]+\//;
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
    forbiddenSources: sources ? sources.filter(s => FORBIDDEN_SOURCE.test(s) || FORBIDDEN_LOCAL_TRANSFORM.test(s)) : [],
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

// ===== オフライン動作の固定（依存を CDN 等へ取りに行かせない） =====
// Maplat はオフラインで動くのが売り。dist/*.js のすべてを対象に、
//   (a) import / export … from / import( の行き先が http://・https://・// で始まらない
//   (b) 動的 import の行き先が相対（./）か、許可したパッケージ名だけ
//   (c) 依存の取得を思わせる fetch(・document.createElement("script")・"<script" の挿入が、
//       許可した既存の箇所（地図データ・タイルの読み込みなど、もともと Core が行う通信）以外に無い
// を確かめる。許可の一覧は ALLOWED_DYNAMIC_PACKAGES・FETCH_ALLOW・SCRIPT_ALLOW・SCRIPT_STRING_ALLOW
// に理由つきで書き、件数まで一致しないと失敗にする（実体が消えた許可の残骸も失敗）。

const URL_SPECIFIER = /^(?:https?:)?\/\//;

// 動的 import してよいパッケージ名（相対チャンク以外）
const ALLOWED_DYNAMIC_PACKAGES = {
  proj4:
    "座標変換エンジン。ES 版ではローカルのチャンク（./index-*.js）に焼き込まれ、UMD 版では同梱される。" +
    "遅延取得の行き先は常にローカルで、CDN 等の外部 URL は決して使わない"
};

// fetch( してよい箇所。shape は引数の形（識別子・this を $V に潰したもの）。
// files が一致する各ファイルについて count まで一致しないと失敗にする
const FETCH_ALLOW = [
  {
    files: /^maplat_core(?:\.umd)?\.js$/,
    shape: "fetch($V)",
    count: 2,
    reason:
      "POI JSON（pois/{id}.json か指定のパス）と地図 JSON（settingFile か maps/{mapID}.json）の読み込み。地図データの取得で、依存の取得ではない"
  },
  {
    files: /^maplat_core(?:\.umd)?\.js$/,
    shape: "fetch($V.thumbnail)",
    count: 1,
    reason: "地図のサムネイル（./tmbs/{mapID}.jpg）の読み込み。地図データの取得"
  },
  {
    files: /^maplat_core(?:\.umd)?\.js$/,
    shape: "fetch(`${$V}ping`)",
    count: 1,
    reason:
      "Weiwudi の Service Worker への疎通確認。ローカルの SW への通信で外部ではない"
  },
  {
    files: /^maplat_core(?:\.umd)?\.js$/,
    shape: "fetch($V.href)",
    count: 1,
    reason: "Weiwudi へのタイルキャッシュ登録（ローカル SW の add）"
  },
  {
    files: /^maplat_core(?:\.umd)?\.js$/,
    shape: "fetch(`${$V}info?mapID=${$V}`)",
    count: 1,
    reason: "Weiwudi のキャッシュ情報の照会（ローカル SW）"
  },
  {
    files: /^maplat_core(?:\.umd)?\.js$/,
    shape: "fetch(`${$V}delete?mapID=${$V}`)",
    count: 1,
    reason: "Weiwudi のキャッシュ削除（ローカル SW）"
  },
  {
    files: /^maplat_core(?:\.umd)?\.js$/,
    shape: "fetch(`${$V}stats?mapID=${$V}`)",
    count: 1,
    reason: "Weiwudi のキャッシュ統計（ローカル SW）"
  },
  {
    files: /^maplat_core(?:\.umd)?\.js$/,
    shape: "fetch(`${$V}clean?mapID=${$V}`)",
    count: 1,
    reason: "Weiwudi のキャッシュ掃除（ローカル SW）"
  },
  {
    files: /^maplat_core(?:\.umd)?\.js$/,
    shape: "fetch(`${$V}fetchAll?mapID=${$V}`)",
    count: 1,
    reason: "Weiwudi のキャッシュ一括取得（ローカル SW）"
  },
  {
    files: /^maplat_core(?:\.umd)?\.js$/,
    shape: "fetch(`${$V}cancel?mapID=${$V}`)",
    count: 1,
    reason: "Weiwudi の処理取り消し（ローカル SW）"
  },
  {
    files: /^maplat_core(?:\.umd)?\.js$/,
    shape: "fetch(`apps/${$V}.json`)",
    count: 1,
    reason: "アプリ設定 JSON（apps/{appid}.json）の読み込み。地図データの取得"
  },
  {
    files: /^maplat_core_common\.js$/,
    shape: "fetch($V)",
    count: 1,
    reason:
      "<maplat-app> の appSrc が指すアプリ設定 JSON の読み込み。地図データの取得"
  },
  {
    files: /^maplat_core_conformance\.js$/,
    shape: "fetch(`apps/${$V}.json`)",
    count: 1,
    reason: "適合試験用モックのアプリ設定 JSON（apps/{appid}.json）の読み込み"
  }
];

// document.createElement("script") してよい箇所
const SCRIPT_ALLOW = [
  {
    files: /^maplat_core(?:\.umd)?\.js$/,
    count: 1,
    reason:
      "DOMPurify がサニタイズ対象の DOM の script ノードを複製する処理。外部スクリプトの読み込みではない"
  },
  {
    files: /^maplat_core_common\.js$/,
    count: 1,
    reason: "同上（common に同梱された DOMPurify）"
  }
];

// "<script" を含む文字列リテラル（innerHTML 等への <script の挿入）。現時点で既存の箇所は無い。
// 出てきたら中身を審査してここに理由つきで足す
const SCRIPT_STRING_ALLOW = [];

// 引数の形を、識別子と this を $V に潰して返す（圧縮で名前が変わっても形が安定する）
function normalizeArg(node) {
  let out = "";
  const walk = n => {
    if (ts.isIdentifier(n) || n.kind === ts.SyntaxKind.ThisKeyword) {
      out += "$V";
      return;
    }
    if (ts.isStringLiteral(n)) {
      out += JSON.stringify(n.text);
      return;
    }
    if (ts.isNoSubstitutionTemplateLiteral(n)) {
      out += "`" + n.text + "`";
      return;
    }
    if (ts.isTemplateExpression(n)) {
      out += "`" + n.head.text;
      for (const span of n.templateSpans) out += "${$V}" + span.literal.text;
      out += "`";
      return;
    }
    if (ts.isPropertyAccessExpression(n)) {
      walk(n.expression);
      out += "." + n.name.text;
      return;
    }
    if (ts.isElementAccessExpression(n)) {
      walk(n.expression);
      out += "[";
      walk(n.argumentExpression);
      out += "]";
      return;
    }
    ts.forEachChild(n, walk);
  };
  walk(node);
  return out;
}

// コードから (a)(b)(c) の判定材料を集める
function offlineScan(code) {
  const ast = ts.createSourceFile(
    "bundle.js",
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS
  );
  const scan = {
    specifiers: [],
    fetchShapes: [],
    createElementScript: 0,
    scriptStrings: []
  };
  const visit = node => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      scan.specifiers.push({ dynamic: false, spec: node.moduleSpecifier.text });
    }
    if (ts.isCallExpression(node)) {
      if (node.expression.kind === ts.SyntaxKind.ImportKeyword) {
        const arg = node.arguments[0];
        scan.specifiers.push({
          dynamic: true,
          spec: arg && ts.isStringLiteral(arg) ? arg.text : "<リテラル以外>"
        });
      }
      const callee = node.expression;
      const fetchName =
        ts.isIdentifier(callee) && callee.text === "fetch"
          ? "fetch"
          : ts.isPropertyAccessExpression(callee) &&
              callee.name.text === "fetch" &&
              ts.isIdentifier(callee.expression) &&
              ["window", "self", "globalThis", "global"].includes(
                callee.expression.text
              )
            ? `${callee.expression.text}.fetch`
            : null;
      if (fetchName) {
        scan.fetchShapes.push(
          `${fetchName}(${node.arguments[0] ? normalizeArg(node.arguments[0]) : ""})`
        );
      }
      if (
        ts.isPropertyAccessExpression(callee) &&
        callee.name.text === "createElement" &&
        node.arguments[0] &&
        ts.isStringLiteral(node.arguments[0]) &&
        node.arguments[0].text === "script"
      ) {
        scan.createElementScript++;
      }
    }
    const literalText =
      ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)
        ? node.text
        : ts.isTemplateExpression(node)
          ? node.head.text +
            node.templateSpans.map(s => s.literal.text).join("")
          : null;
    if (literalText && literalText.includes("<script"))
      scan.scriptStrings.push(literalText.slice(0, 60));
    ts.forEachChild(node, visit);
  };
  visit(ast);
  return scan;
}

// オフライン検査の違反をすべて返す（許可一覧は差し替え可能＝自己試験用）
function offlineViolations(
  file,
  code,
  allow = {
    dynamicPackages: ALLOWED_DYNAMIC_PACKAGES,
    fetch: FETCH_ALLOW,
    createElementScript: SCRIPT_ALLOW,
    scriptStrings: SCRIPT_STRING_ALLOW
  }
) {
  const scan = offlineScan(code);
  const violations = [];
  for (const { dynamic, spec } of scan.specifiers) {
    if (URL_SPECIFIER.test(spec)) {
      violations.push(`外部 URL の import「${spec}」`);
      continue;
    }
    if (!dynamic) continue;
    if (spec === "<リテラル以外>")
      violations.push(
        "動的 import の行き先が文字列リテラルでない（静的に検証できない）"
      );
    else if (spec.startsWith("./")) continue;
    else if (allow.dynamicPackages[spec]) continue;
    else violations.push(`許可されていない動的 import「${spec}」`);
  }
  const countUp = list => {
    const counts = {};
    for (const x of list) counts[x] = (counts[x] || 0) + 1;
    return counts;
  };
  const sumCounts = entries => {
    const counts = {};
    for (const e of entries) counts[e.shape] = (counts[e.shape] || 0) + e.count;
    return counts;
  };
  // fetch(（外部 URL を渡すものもここで拾う）
  const actualFetch = countUp(scan.fetchShapes);
  const expectedFetch = sumCounts(allow.fetch.filter(e => e.files.test(file)));
  for (const [shape, count] of Object.entries(actualFetch)) {
    if (/(?:https?:)?\/\//.test(shape))
      violations.push(`外部 URL を渡す ${shape}`);
    else if (!(shape in expectedFetch))
      violations.push(`許可されていない ${shape} が ${count} 件`);
    else if (expectedFetch[shape] !== count)
      violations.push(`${shape} の件数が ${count} 件（許可は ${expectedFetch[shape]} 件）`);
  }
  for (const [shape, count] of Object.entries(expectedFetch)) {
    if (!(shape in actualFetch))
      violations.push(
        `許可一覧の ${shape}（${count} 件）の実体が無い（許可一覧が古い。理由ごと直す）`
      );
  }
  // document.createElement("script")
  const expectedScripts = allow.createElementScript
    .filter(e => e.files.test(file))
    .reduce((n, e) => n + e.count, 0);
  if (scan.createElementScript > expectedScripts)
    violations.push(
      `許可されていない createElement("script") が ${scan.createElementScript} 件（許可は ${expectedScripts} 件）`
    );
  else if (scan.createElementScript < expectedScripts)
    violations.push(
      `許可一覧の createElement("script")（${expectedScripts} 件）の実体が無い（許可一覧が古い。理由ごと直す）`
    );
  // "<script" の挿入
  for (const s of scan.scriptStrings) {
    if (!allow.scriptStrings.includes(s))
      violations.push(`許可されていない "<script" を含む文字列「${s}」`);
  }
  return violations;
}

// 自己試験: 検査が効くこと（汚れたサンプルで当たり、きれいなサンプルで外れること）
{
  const none = {
    dynamicPackages: {},
    fetch: [],
    createElementScript: [],
    scriptStrings: []
  };
  const hit = (code, needle, allow = none) => {
    const violations = offlineViolations("self-test.js", code, allow);
    assert(
      violations.some(v => v.includes(needle)),
      `自己試験: 「${needle}」が ${JSON.stringify(violations)} に無い`
    );
  };
  const miss = (code, allow = none) =>
    assert.deepEqual(
      offlineViolations("self-test.js", code, allow),
      [],
      `自己試験: きれいなはずの「${code}」が引っかかった`
    );

  hit(`import x from "https://cdn.example/dep.js";`, "外部 URL の import");
  hit(`import "https://cdn.example/dep.js";`, "外部 URL の import");
  hit(`export * from "//cdn.example/dep.js";`, "外部 URL の import");
  hit(`const m = await import("https://cdn.example/dep.js");`, "外部 URL の import");
  hit(`const m = await import("lodash");`, "許可されていない動的 import");
  hit(`const m = await import(someUrl);`, "文字列リテラルでない");
  hit(`fetch("https://cdn.example/dep.js");`, "外部 URL を渡す");
  hit(`fetch(someUrl);`, "許可されていない fetch($V)");
  hit(`document.createElement("script");`, '許可されていない createElement("script")');
  hit(`el.innerHTML = "<script src='https://cdn.example/x.js'></script>";`, '"<script" を含む文字列');
  // きれいな例: 相対のチャンク・許可したパッケージ・静的な bare import・許可した fetch
  miss(`import { get } from "ol/proj"; const m = await import("./chunk.js");`);
  miss(`const m = await import("proj4");`, {
    ...none,
    dynamicPackages: { proj4: "自己試験用" }
  });
  miss(`const r = await fetch(\`apps/\${id}.json\`);`, {
    ...none,
    fetch: [
      {
        files: /self-test\.js$/,
        shape: "fetch(`apps/${$V}.json`)",
        count: 1,
        reason: "自己試験用"
      }
    ]
  });
  // 引数の形の潰し方が意図どおりであること
  assert.equal(offlineScan("fetch(this.thumbnail)").fetchShapes[0], "fetch($V.thumbnail)");
  assert.equal(offlineScan("fetch(a.href)").fetchShapes[0], "fetch($V.href)");
  assert.equal(
    offlineScan("fetch(`${base}ping`)").fetchShapes[0],
    "fetch(`${$V}ping`)"
  );
  assert.equal(
    offlineScan("fetch(`apps/${this.appid}.json`)").fetchShapes[0],
    "fetch(`apps/${$V}.json`)"
  );
  // 対照: 許可一覧の残骸も検査が拾う
  hit(`const x = 1;`, "実体が無い", {
    ...none,
    fetch: [
      {
        files: /self-test\.js$/,
        shape: "fetch($V)",
        count: 1,
        reason: "自己試験用"
      }
    ]
  });
}

// dist/*.js のすべてを対象に、外部 URL の import・依存取得の通信が無いことを確かめる
{
  const jsFiles = readdirSync(dist)
    .filter(f => f.endsWith(".js"))
    .sort();
  if (!jsFiles.length) fail("dist/*.js が 1 つも無い（ビルドしてから実行する）");
  for (const file of jsFiles) {
    const code = readFileSync(resolve(dist, file), "utf8");
    const violations = offlineViolations(file, code);
    if (violations.length) {
      for (const v of violations) fail(`${file}: ${v}`);
      continue;
    }
    const scan = offlineScan(code);
    const dyn = scan.specifiers
      .filter(s => s.dynamic)
      .map(s => s.spec)
      .join(", ");
    ok(
      `${file}: 外部 URL の import 無し・動的 import は ${dyn || "無し"}・fetch ${scan.fetchShapes.length} 件と createElement("script") ${scan.createElementScript} 件は許可の箇所だけ・"<script" の文字列 ${scan.scriptStrings.length} 件`
    );
  }
}

if (failed) {
  console.error("verify-common-bundle: 失敗");
  process.exit(1);
}
console.log("verify-common-bundle: すべて合格");
