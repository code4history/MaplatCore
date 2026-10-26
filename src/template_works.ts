import Quyuan from "@c4h/quyuan/template";
import { normalizeArg } from "./functions";

// poiTemplate・iconTemplate は Nunjucks の記法（Quyuan の @c4h/quyuan/template）で評価する。
// 1.2 までの旧い記法（<% %>・<%= %>・<%- %>・${ }）は 1.3.0 から評価しない（#93）。
// Nunjucks はサンドボックスではない: テンプレートの文字列そのものを第三者が書ける構成では、
// 引き続きページの権限でコードが動きうる（CHANGELOG の Security を参照）。

type TemplateKey = "poiTemplate" | "iconTemplate";

// {% raw %}…{% endraw %}・{% verbatim %}…{% endverbatim %} の中は判定の対象から外す。
// 空白制御の "-" は開き・閉じの両側とも受け付ける（閉じ側の "-" は Nunjucks では評価の例外になるが、
// その場合も評価の例外として扱われ、どちらにしても評価はされない）。
const RAW_BLOCK = /\{%-?\s*(raw|verbatim)\s*-?%\}[\s\S]*?\{%-?\s*end\1\s*-?%\}/g;
const LEGACY_ERB = /<%[\s\S]*?%>/;
const LEGACY_ES = /\$\{[^}]*\}/;

const LEGACY_MESSAGE_PREFIX =
  'MaplatApp: poiTemplate/iconTemplate written in the lodash.template syntax (<% %>, <%= %>, <%- %>, ${ }) is no longer evaluated since @maplat/core 1.3.0, and was ignored. ' +
  'Rewrite it in the Nunjucks syntax ({{ }}, {% %}); wrap literal "<%" or "${" in {% raw %}...{% endraw %}.';
const LEGACY_MESSAGE_SUFFIX =
  'See the "Removed" section of the 1.3.0 CHANGELOG: https://github.com/code4history/MaplatCore/blob/master/CHANGELOG.md';

let legacyWarned = false;
let renderErrorWarned = false;

/** テンプレートの先頭 80 文字（警告の文字列にだけ入れる。DOM・URL には入れない） */
function head(src: string): string {
  return Array.from(src).slice(0, 80).join("");
}

/**
 * 1.2 までの旧い記法（<% %>・${ }）で書かれたテンプレートかどうか。
 * raw・verbatim の中を除いた文字列に <%…%> または ${…} があれば旧い記法とみなす。
 * @internal
 */
export function isLegacyTemplate(src: string): boolean {
  const stripped = src.replace(RAW_BLOCK, "");
  return LEGACY_ERB.test(stripped) || LEGACY_ES.test(stripped);
}

/**
 * 「1 回だけ」の警告の記憶を戻す（テストの間の初期化用）。
 * 公開面ではない（@maplat/core の入口からは出さない）。
 * @internal
 */
export function resetTemplateWarnings(): void {
  legacyWarned = false;
  renderErrorWarned = false;
}

function warnLegacy(key: TemplateKey, src: string): void {
  if (legacyWarned) return;
  legacyWarned = true;
  console.warn(`${LEGACY_MESSAGE_PREFIX} First template found (${key}): "${head(src)}". ${LEGACY_MESSAGE_SUFFIX}`);
}

function warnRenderError(src: string, e: unknown): void {
  if (renderErrorWarned) return;
  renderErrorWarned = true;
  const raw = e instanceof Error ? e.message : String(e);
  // Nunjucks の例外は「(unknown path) [Line 1, Column 6]」と理由が別の行に分かれるので、1 行にまとめる
  const reason = raw
    .split("\n")
    .map(line => line.trim())
    .filter(line => line)
    .join(" ");
  console.warn(`MaplatApp: a poiTemplate/iconTemplate failed to render and was ignored: ${reason}. First template: "${head(src)}".`);
}

/**
 * 1 つのテンプレートを評価する。旧い記法・評価の例外のときは undefined を返す（警告はそれぞれ 1 回）。
 */
function renderTemplate(key: TemplateKey, src: string, data: object): string | undefined {
  if (isLegacyTemplate(src)) {
    warnLegacy(key, src);
    return undefined;
  }
  try {
    const feature: any = { type: "Feature", geometry: null, properties: data };
    Quyuan.templateExtractor({ geojson: feature, templates: { t: src } });
    return feature.result.t;
  } catch (e) {
    warnRenderError(src, e);
    return undefined;
  }
}

/** iconTemplate を評価して JSON のオブジェクトにする。失敗なら undefined（その段の iconTemplate は無いものとみなす） */
function renderIconTemplate(src: string, data: object): { icon?: unknown; selectedIcon?: unknown } | undefined {
  const out = renderTemplate("iconTemplate", src, data);
  if (out === undefined) return undefined;
  let parsed: unknown;
  try {
    parsed = JSON.parse(out);
  } catch (e) {
    warnRenderError(src, e);
    return undefined;
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    warnRenderError(src, new Error("iconTemplate did not produce a JSON object"));
    return undefined;
  }
  return parsed as { icon?: unknown; selectedIcon?: unknown };
}

export function createIconSet(data: any, ...ancestors: any[]) {
  const dataCopy = normalizeArg(Object.assign({}, data));
  if (dataCopy.icon) return dataCopy;
  const fromAncestor = ancestors.reduce((prev, curr) => {
    if (prev) return prev;
    const iconTemplate = curr.iconTemplate;
    const fromTemplate = iconTemplate ? renderIconTemplate(iconTemplate, dataCopy) : undefined;
    if (fromTemplate) {
      return fromTemplate;
    } else if (curr.icon) {
      return {
        icon: curr.icon,
        selectedIcon: curr.selectedIcon
      };
    }
  }, undefined);
  if (fromAncestor) {
    dataCopy.icon = fromAncestor.icon;
    dataCopy.selectedIcon = fromAncestor.selectedIcon;
  }
  return dataCopy;
}

export function createHtmlFromTemplate(data: any, ...ancestors: any[]) {
  data = normalizeArg(data);
  if (data.html) return data;
  return (
    ancestors.reduce((prev, curr) => {
      if (prev) return prev;
      const poiTemplate = curr.poiTemplate;
      if (poiTemplate) {
        const html = renderTemplate("poiTemplate", poiTemplate, data);
        if (html === undefined) return undefined;
        data.html = html;
        data.poiStyle = data.poiStyle || curr.poiStyle;
        return data;
      }
    }, undefined) || data
  );
}
