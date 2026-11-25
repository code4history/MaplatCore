import Quyuan from "@c4h/quyuan/template";
import { normalizeArg } from "./functions";
import type { MaplatPoi } from "./element_contract";

// poiTemplate・iconTemplate は Nunjucks の記法（Quyuan の @c4h/quyuan/template）で評価する。
// 1.2 までの旧い記法（<% %>・<%= %>・<%- %>・${ }）は 1.3.0 から評価しない（#93）。
// Nunjucks はサンドボックスではない: テンプレートの文字列そのものを第三者が書ける構成では、
// 引き続きページの権限でコードが動きうる（CHANGELOG の Security を参照）。

type TemplateKey = "poiTemplate" | "iconTemplate";

// {% raw %}…{% endraw %}・{% verbatim %}…{% endverbatim %} の中は判定の対象から外す。
// 空白制御の "-" は開き・閉じの両側とも受け付ける（閉じ側の "-" は Nunjucks では評価の例外になるが、
// その場合も評価の例外として扱われ、どちらにしても評価はされない）。
// 開き・閉じのタグを 1 つずつ拾う式。開きから閉じまでを 1 つの式で探すと、閉じの無い開きが並んだ
// 入力で長さの 2 乗の時間がかかるので、タグだけを拾って下の stripRawBlocks で 1 回の走査で対にする。
const RAW_TAG = /\{%-?\s*(end)?(raw|verbatim)\s*-?%\}/g;

type RawKind = "raw" | "verbatim";
interface RawTag {
  start: number;
  end: number;
  close: boolean;
  kind: RawKind;
}

/**
 * raw・verbatim のブロック（開きのタグから、その後ろで最初に現れる同じ種類の閉じのタグまで）を取り除く。
 * 閉じの無い開きはそのまま残し、次の開きから探し直す。入力の長さに比例する時間で終わる。
 */
function stripRawBlocks(src: string): string {
  if (!src.includes("{%")) return src;
  const tags: RawTag[] = [];
  RAW_TAG.lastIndex = 0;
  for (let m = RAW_TAG.exec(src); m; m = RAW_TAG.exec(src)) {
    tags.push({ start: m.index, end: m.index + m[0].length, close: !!m[1], kind: m[2] as RawKind });
  }
  if (tags.length === 0) return src;
  // 種類ごとの閉じのタグ（tags の添字・昇順）と、どこまで見たかの位置。開きは前から順に見るので、
  // 位置は後ろへ進むだけで戻らない。
  const closes: Record<RawKind, number[]> = { raw: [], verbatim: [] };
  tags.forEach((tag, i) => {
    if (tag.close) closes[tag.kind].push(i);
  });
  const cursor: Record<RawKind, number> = { raw: 0, verbatim: 0 };
  let out = "";
  let pos = 0;
  let i = 0;
  while (i < tags.length) {
    const open = tags[i];
    if (open.close) {
      i++;
      continue;
    }
    const list = closes[open.kind];
    let c = cursor[open.kind];
    while (c < list.length && list[c] < i) c++;
    cursor[open.kind] = c;
    if (c === list.length) {
      i++;
      continue;
    }
    out += src.slice(pos, open.start);
    pos = tags[list[c]].end;
    i = list[c] + 1;
  }
  return out + src.slice(pos);
}

/** open の後ろ（open の直後から）に close があるか。最初の open だけ見れば足りる。 */
function hasPair(src: string, open: string, close: string): boolean {
  const at = src.indexOf(open);
  return at >= 0 && src.indexOf(close, at + open.length) >= 0;
}

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
  const stripped = stripRawBlocks(src);
  return hasPair(stripped, "<%", "%>") || hasPair(stripped, "${", "}");
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

/**
 * テンプレートを持ちうる段（POI のレイヤー・地図・アプリ）。評価が読むのは下の 5 つのキーだけで、
 * ほかのキーは見ない。値は設定ファイル由来で型を保証しないので unknown とし、偽の値は「無い」とみなす
 * （既存の型 PoiLayer は段の一つでしかなく、地図・アプリの段を表せないため、読むキーだけの型を置く）。
 * 索引の型を持つので、クラスのインスタンスを渡すときは `as PoiTemplateLevel` などで受け渡す。
 */
export interface PoiTemplateLevel {
  /** POI の吹き出しの HTML を作る Nunjucks のテンプレート */
  poiTemplate?: unknown;
  /** poiTemplate と一緒に補う CSS */
  poiStyle?: unknown;
  /** `{"icon": …, "selectedIcon": …}` の JSON を作る Nunjucks のテンプレート */
  iconTemplate?: unknown;
  /** iconTemplate が無い・使えないときに使うマーカーの画像 */
  icon?: unknown;
  selectedIcon?: unknown;
  // テンプレートを持たない段（pois だけの層など）も受けるための索引の型（無いと弱い型の検査で弾かれる）
  [key: string]: unknown;
}

/** 評価が POI に補うキー（MaplatPoi の同名のキー） */
export type PoiTemplateFields = Pick<MaplatPoi, "icon" | "selectedIcon" | "html" | "poiStyle">;

/**
 * POI の複製に、祖先の iconTemplate・icon から icon・selectedIcon を補って返す。
 * 祖先は近い段から順に見て、最初に使える段の値を使う（iconTemplate が評価できない段は、同じ段の icon・
 * selectedIcon を使い、それも無ければ次の段へ）。POI 自身に icon があれば何も補わない。渡した data は書き換えない。
 * POI に 0.x の旧いキー名（snake_case）（`selected_icon`・`namespace_id` など）があると例外を投げる（normalizeArg）。
 * @param data POI（MaplatPoi の形。テンプレートが読む独自のキーもそのまま載る）
 * @param ancestors 近い段から順に、POI のレイヤー → 地図 → アプリ
 */
export function createIconSet<T extends object>(data: T, ...ancestors: PoiTemplateLevel[]): T & PoiTemplateFields {
  const dataCopy = normalizeArg(Object.assign({}, data));
  if (dataCopy.icon) return dataCopy as T & PoiTemplateFields;
  const fromAncestor = ancestors.reduce<{ icon?: unknown; selectedIcon?: unknown } | undefined>((prev, curr) => {
    if (prev) return prev;
    const iconTemplate = curr.iconTemplate as string | undefined;
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
  return dataCopy as T & PoiTemplateFields;
}

/**
 * 祖先の poiTemplate から html を作り、同じ段の poiStyle（POI 自身に無ければ）と一緒に data に書き込んで返す。
 * 祖先は近い段から順に見て、最初に評価できた段を使う（評価できない段は poiStyle も使わず次の段へ）。
 * POI 自身に html があれば何もしない。**渡した data そのものを書き換えて返す**（複製しない）。
 * POI に 0.x の旧いキー名（snake_case）（`selected_icon`・`namespace_id` など）があると例外を投げる（normalizeArg）。
 * @param data POI（MaplatPoi の形）
 * @param ancestors 近い段から順に、POI のレイヤー → 地図 → アプリ
 */
export function createHtmlFromTemplate<T extends object>(data: T, ...ancestors: PoiTemplateLevel[]): T & PoiTemplateFields {
  const poi = normalizeArg(data);
  if (poi.html) return poi as T & PoiTemplateFields;
  return (
    ancestors.reduce<Record<string, any> | undefined>((prev, curr) => {
      if (prev) return prev;
      const poiTemplate = curr.poiTemplate as string | undefined;
      if (poiTemplate) {
        const html = renderTemplate("poiTemplate", poiTemplate, poi);
        if (html === undefined) return undefined;
        poi.html = html;
        poi.poiStyle = poi.poiStyle || curr.poiStyle;
        return poi;
      }
    }, undefined) || poi
  ) as T & PoiTemplateFields;
}

/**
 * POI の複製に、祖先のテンプレートから icon・selectedIcon と html・poiStyle を補う
 * （createIconSet で複製してから createHtmlFromTemplate を当てる）。
 * マーカーの描画（clickMarker の detail）と getMarker の戻り値が同じ形になるよう、両方がこの 1 つを通る。
 * 渡した data は書き換えない。POI に 0.x の旧いキー名（snake_case）があると例外を投げる（normalizeArg）。
 * @param data POI（MaplatPoi の形）
 * @param ancestors 近い段から順に、POI のレイヤー → 地図 → アプリ
 */
export function applyPoiTemplates<T extends object>(data: T, ...ancestors: PoiTemplateLevel[]): T & PoiTemplateFields {
  const copy = createIconSet(data, ...ancestors);
  return createHtmlFromTemplate(copy, ...ancestors);
}
