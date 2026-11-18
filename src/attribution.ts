// 表示中の現代の地図（basemap・タイルの重ね地図）の出典を、地図の右下に常に出す小さな表示。
//
// OpenLayers の Attribution の部品は使わない。理由:
//   - Core は前面と背面の 2 つの OL の地図を重ねる。部品は地図ごとなので、背面の地図の出典は
//     前面の地図の下に隠れる。
//   - 操作の自動非表示（tapUIVanish）は `.ol-control` を全部隠す。出典まで隠れてしまう。
//   - アプリは appOption.controls で部品を差し替えられる。差し替えで出典が消えてはいけない。
// 古地図の出典はここには出さない（UI の地図情報に出す。長い自由記述のことがあるため）。
// 地図の設定に `attr` が無い現代の地図は、OpenLayers の source の出典（getAttributions）を出す。
// Google の地図は、`attr` の有無によらず、表示範囲ごとに取りに行く copyright を必ず出す（`attr` は後に添える）。
// Map Tiles API の利用条件が、表示範囲の copyright を "in full as provided" で出すよう求めるため。
// Google の地図を表示しているあいだは、利用条件が求める Google Maps のロゴを Google の出典の左隣に出す
// （狭くてロゴが入らないときは文字 "Google Maps"）。ほかの地図（重ね地図など）の出典は、Google の出典と
// 区別できるよう、別の箱にしてその上に出す（利用条件: 第三者の出典は Google の出典と "clearly be disassociated"）。
import browserLanguage from "./browserlanguage";
import { MAPLAT_UI_TAG } from "./element_contract";
import { GOOGLE_MAPS_LOGO_DARK_OUTLINE, GOOGLE_MAPS_LOGO_LIGHT_OUTLINE } from "./google_maps_logo";
import { sanitizeHtml } from "./sanitize";

/** 出典の値（文字列か、言語ごとの文字列）。 */
export type AttributionValue = string | Record<string, string | undefined | null> | undefined | null;

/** 出典を持つ地図（source）の最小の形。 */
export interface AttributionSourceLike {
  get?: (key: string) => unknown;
  isWmts?: () => boolean;
  /** OpenLayers の source の出典（frameState を受けて文字列・配列・その Promise を返す関数）。 */
  getAttributions?: () => unknown;
  /** Google の地図（GoogleMap）だけが持つ、Map Tiles API の mapType（roadmap・satellite・terrain）。 */
  googleMapType?: unknown;
}

/** Google Maps のロゴの種類。light: 灰色の字・白い枠（地図用）、dark: 白い字・濃い枠（衛星写真用）。 */
export type GoogleLogoVariant = "light" | "dark";

/** Google Maps のロゴの表示の形。logo: ロゴの画像、text: 文字 "Google Maps"（狭いとき）。 */
export type GoogleAttributionMode = "logo" | "text";

/** ロゴの幅（105px）と左右の余白（10px ずつ）。使える幅がこれより狭いときは文字にする。 */
export const GOOGLE_LOGO_MIN_WIDTH = 125;

/** ロゴの代わりに出す文字（利用条件が名指しする文字。言語によらない）。 */
export const GOOGLE_MAPS_TEXT = "Google Maps";

/** Google の地図（GoogleMap。googleMapType を持つ）か。 */
export function isGoogleSource(source: AttributionSourceLike): boolean {
  return typeof source.googleMapType === "string" && source.googleMapType !== "";
}

/**
 * 表示中の source に Google の地図があれば、出すロゴの種類を返す（無ければ undefined）。
 * 出典の並び（前面 → 重ね地図 → 背面）で最初の Google の地図の種類で選ぶ。衛星（satellite）は dark。
 */
export function googleLogoVariant(sources: AttributionSourceLike[]): GoogleLogoVariant | undefined {
  for (const source of sources) {
    const mapType = source.googleMapType;
    if (typeof mapType !== "string" || !mapType) continue;
    return mapType === "satellite" ? "dark" : "light";
  }
  return undefined;
}

/** 使える幅（px）からロゴか文字かを決める。測れない（0 以下・数でない）ときはロゴ。 */
export function googleAttributionMode(availableWidth: number): GoogleAttributionMode {
  if (!(availableWidth > 0)) return "logo";
  return availableWidth < GOOGLE_LOGO_MIN_WIDTH ? "text" : "logo";
}

/**
 * 言語ごとの値から 1 つ選ぶ。UI の pickLocalized と同じ規則: 一致する言語 → en → 最初の空でない値。
 * （地域を外した言語には寄せない。UI の地図情報と同じ文字を出すため）
 * 文字列はそのまま。空白だけの値は無いものとみなす（OpenLayers の出典へ回す）。何も無ければ undefined。
 */
export function pickAttributionText(value: AttributionValue, lang: string): string | undefined {
  if (value == null) return undefined;
  if (typeof value === "string") return value.trim() ? value : undefined;
  if (typeof value !== "object") return String(value);
  let first: string | undefined;
  let en: string | undefined;
  for (const [key, text] of Object.entries(value)) {
    if (typeof text !== "string" || !text.trim()) continue;
    if (key === lang) return text;
    if (key === "en" && en === undefined) en = text;
    if (first === undefined) first = text;
  }
  return en ?? first;
}

/** UI の normalizeLang と同じ寄せ方（zh-HK・zh-Hant は zh-TW）。 */
export function normalizeAttributionLang(lang: string): string {
  const lower = lang.toLowerCase();
  if (lower === "zh-hk" || lower === "zh-hant") return "zh-TW";
  return lang;
}

/** 要素から、影の DOM の境界を host へ越えながら、最も近い selector の要素を探す（自分を含む）。 */
function closestAcrossShadow(element: Element | null | undefined, selector: string): Element | null {
  let node: Element | null | undefined = element;
  while (node) {
    const found = node.closest(selector);
    if (found) return found;
    const root = node.getRootNode?.() as ShadowRoot | Document | undefined;
    node = root && "host" in root ? root.host : null;
  }
  return null;
}

/** 要素から最も近い `lang` 属性の値（影の DOM の境界は host へ越える。空の lang="" は飛ばす）。 */
export function closestLang(element: Element | null | undefined): string | undefined {
  return closestAcrossShadow(element, '[lang]:not([lang=""])')?.getAttribute("lang") || undefined;
}

/**
 * 出典の言語を決める。UI（<maplat-ui>）の言語と食い違わないよう、UI と同じ順にする。
 *   - 地図が <maplat-ui> の中にあり、その要素が currentLang を持つ（定義済み）なら、それをそのまま使う。
 *     UI の地図情報・ボタンの文言と同じ言語になる（UI は lang 属性 → UI の appOption.lang →
 *     設定ファイルの lang → ブラウザ、で決める）。
 *   - それ以外: 地図の要素（<maplat-app> か旧 API の div）の lang 属性 → 最も近い <maplat-ui> の lang 属性
 *     → appOption.lang → 設定ファイルの lang → 祖先の lang 属性（<html lang> など）→ ブラウザ → en。
 * どちらも UI の normalizeLang と同じく zh-HK・zh-Hant を zh-TW に寄せる。文字列でない値・空の値は飛ばす。
 */
export function resolveAttributionLang(
  element: Element | null | undefined,
  appOptionLang?: unknown,
  settingLang?: unknown
): string {
  const ui = closestAcrossShadow(element, MAPLAT_UI_TAG) as (Element & { currentLang?: unknown }) | null;
  if (ui) {
    let current: unknown;
    try {
      current = ui.currentLang;
    } catch {
      current = undefined;
    }
    if (typeof current === "string" && current) return normalizeAttributionLang(current);
  }
  const candidates: unknown[] = [
    element?.getAttribute("lang"),
    ui?.getAttribute("lang"),
    appOptionLang,
    settingLang,
    closestLang(element)
  ];
  for (const value of candidates) {
    if (typeof value === "string" && value) return normalizeAttributionLang(value);
  }
  // browserLanguage は navigator を読めないときは "" を返す
  return normalizeAttributionLang(browserLanguage() || "en");
}

/**
 * 地図に描かれている現代の地図の source を、出典を出す順に並べる。
 *   - 前面の source（前面が basemap のときはそれ、重ね地図のときはその下の basemap）。古地図は外す。
 *   - 重ね地図（前面に層として載せた TMS など）。
 *   - 背面の source（前面が古地図のときの basemap）。
 * 同じ source は 1 回だけ。
 */
export function displayedAttributionSources(parts: {
  front?: AttributionSourceLike | null;
  overlay?: AttributionSourceLike | null;
  back?: AttributionSourceLike | null;
}): AttributionSourceLike[] {
  const result: AttributionSourceLike[] = [];
  const push = (source: AttributionSourceLike | null | undefined) => {
    if (!source || result.includes(source)) return;
    if (typeof source.isWmts === "function" && !source.isWmts()) return;
    result.push(source);
  };
  push(parts.front);
  push(parts.overlay);
  push(parts.back);
  return result;
}

/** 地図の設定の `attr` を持つか（空・空白だけの文字列、空の言語ごとの値は持たない扱い）。 */
export function hasConfiguredAttr(source: AttributionSourceLike): boolean {
  const raw = typeof source.get === "function" ? source.get("attr") : undefined;
  return pickAttributionText(raw as AttributionValue, "en") !== undefined;
}

/** OpenLayers の出典の値（文字列・配列・それ以外）を文字列の配列にする。 */
export function normalizeOlAttributions(value: unknown): string[] {
  const list = Array.isArray(value) ? value : [value];
  return list.filter((v): v is string => typeof v === "string" && v.trim() !== "").map(v => v.trim());
}

/** source から読んだ出典 1 つの文字数の上限（表示される文字の数。超えたら切って「…」を付ける）。 */
export const SOURCE_ATTRIBUTION_MAX_CHARS = 500;

/** source から読んだ出典 1 つの箱の高さの上限（行の数）。 */
export const SOURCE_ATTRIBUTION_MAX_LINES = 4;

/** source から読んだ出典 1 つの箱の高さの上限（地図の高さに対する割合）。行の数の上限と小さい方を使う。 */
export const SOURCE_ATTRIBUTION_MAX_MAP_RATIO = 0.25;

/** HTML を断片として読む（template の中身は画像を読みに行かず、スクリプトも動かない）。 */
function parseFragment(html: string): DocumentFragment {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content;
}

/**
 * HTML の表示される文字を max 字（コードポイントの数）までにする。超えたら、そこで切って「…」を付け、
 * 後ろの要素・文字は捨てる（タグの入れ子は保つ）。超えなければそのまま返す。
 */
function truncateHtml(html: string, max: number): string {
  const fragment = parseFragment(html);
  const walker = document.createTreeWalker(fragment, NodeFilter.SHOW_TEXT);
  let remaining = max;
  let cut: Node | null = null;
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const chars = Array.from(node.data);
    if (chars.length <= remaining) {
      remaining -= chars.length;
      continue;
    }
    node.data = `${chars.slice(0, remaining).join("")}…`;
    cut = node;
    break;
  }
  if (!cut) return html;
  // 切った文字より後ろ（文書の順）を捨てる
  for (let node: Node | null = cut; node && node !== fragment; node = node.parentNode) {
    while (node.nextSibling) node.nextSibling.remove();
  }
  const container = document.createElement("template");
  container.content.appendChild(fragment);
  return container.innerHTML;
}

/** HTML の表示される文字（空白はまとめる）。重複を除くときに、設定の値と source の値を同じ形で比べるため。 */
function displayText(html: string): string {
  return (parseFragment(html).textContent ?? "").replace(/\s+/g, " ").trim();
}

/**
 * OpenLayers の source から読んだ出典（第三者のサーバーが決める値。Google の copyright・TileJSON の
 * attribution など）を、表示用の HTML にする。空になったものは除く。
 *   - 狭い許可表（sanitizeHtml の profile "iiif"）で洗う。残るタグは a・b・br・i・p・small・span・sub・sup だけ、
 *     属性は http(s) の href だけ。img・class・style・javascript: などは落ちる。
 *     リンクには target="_blank" と rel="noopener noreferrer" が付く。
 *   - 表示される文字は SOURCE_ATTRIBUTION_MAX_CHARS 字まで（超えたら切って「…」）。
 *     箱の高さも CSS で上限を付ける（.maplat-attribution-item-source）。
 *   - 理由: 広い許可表（地図の設定の attr 用）のままだと、外の値の
 *     `<a href="https://…"><img src="https://…" width="4000" height="4000"></a>` で、出典の箱が地図を覆い、
 *     地図全体が外へのリンクになり、外の画像を読みに行って見ている人の情報が第三者に渡る。
 *     狭い許可表を通る `<a href="https://…"><p>長い文字</p></a>` や長い文字だけでも、箱が地図を覆いうる。
 * 地図の設定の attr（アプリの作者が書く値）には使わない（従来どおり広い許可表で、img なども通り、上限も無い）。
 * 文字だけの値（Google の copyright など）は、上限より短ければ変わらない（& と < > は HTML の形になる）。
 */
export function sanitizeSourceAttributions(texts: readonly string[]): string[] {
  return texts
    .map(text => truncateHtml(sanitizeHtml(text, { profile: "iiif" }).trim(), SOURCE_ATTRIBUTION_MAX_CHARS))
    .filter(html => html !== "");
}

/** 表示する出典 1 つ。 */
interface AttributionEntry {
  /** 元の値（地図の設定の attr の言語を選んだもの、または source から読んだ値）。`texts` が返す。 */
  text: string;
  /** 表示用に洗った HTML。 */
  html: string;
  /** 重複を除くときに比べる形（表示される文字。文字が無ければ HTML）。 */
  key: string;
  /** source から読んだ値か（箱の大きさに上限を付ける）。 */
  fromSource: boolean;
}

function configuredEntry(text: string): AttributionEntry {
  // 地図の設定の attr は、許可リストで洗ってから入れる（UI の地図情報と同じ関数・同じ許可表）
  const html = sanitizeHtml(text);
  return { text, html, key: displayText(html) || html, fromSource: false };
}

function sourceEntries(texts: readonly string[]): AttributionEntry[] {
  const entries: AttributionEntry[] = [];
  for (const text of texts) {
    const [html] = sanitizeSourceAttributions([text]);
    if (html) entries.push({ text, html, key: displayText(html) || html, fromSource: true });
  }
  return entries;
}

/**
 * 1 つの source の出典（空を除いたもの。重複は呼び出し側で除く）。
 *   - Google の地図: OpenLayers の source の copyright（dynamic）を必ず出し、地図の設定の `attr` があれば後に添える。
 *   - それ以外: 地図の設定の `attr`。無ければ dynamic（OpenLayers の source から読んだ出典）。
 */
function entriesOf(
  source: AttributionSourceLike,
  lang: string,
  dynamic?: ReadonlyMap<AttributionSourceLike, readonly string[]>
): AttributionEntry[] {
  const raw = typeof source.get === "function" ? source.get("attr") : undefined;
  const configured = pickAttributionText(raw as AttributionValue, lang)?.trim() || undefined;
  const fetched = sourceEntries((dynamic?.get(source) ?? []).map(text => text.trim()).filter(Boolean));
  if (isGoogleSource(source)) return configured ? [...fetched, configuredEntry(configured)] : fetched;
  return configured ? [configuredEntry(configured)] : fetched;
}

/** source の並びから、表示する出典を作る（表示される文字が同じものは 1 回だけ。exclude にあるものも除く）。 */
function attributionEntries(
  sources: AttributionSourceLike[],
  lang: string,
  dynamic?: ReadonlyMap<AttributionSourceLike, readonly string[]>,
  exclude: readonly AttributionEntry[] = []
): AttributionEntry[] {
  const entries: AttributionEntry[] = [];
  const seen = new Set(exclude.map(entry => entry.key));
  for (const source of sources) {
    for (const entry of entriesOf(source, lang, dynamic)) {
      if (seen.has(entry.key)) continue;
      seen.add(entry.key);
      entries.push(entry);
    }
  }
  return entries;
}

/** Google の地図の分（google）とそれ以外（others）。同じ表示の文字は 1 回だけ（Google の分を先に取る）。 */
function attributionEntryGroups(
  sources: AttributionSourceLike[],
  lang: string,
  dynamic?: ReadonlyMap<AttributionSourceLike, readonly string[]>
): { google: AttributionEntry[]; others: AttributionEntry[] } {
  const google = attributionEntries(sources.filter(isGoogleSource), lang, dynamic);
  const others = attributionEntries(
    sources.filter(source => !isGoogleSource(source)),
    lang,
    dynamic,
    google
  );
  return { google, others };
}

/**
 * source の並びから、表示する出典の文字列（言語を選んだもの・空と重複を除いたもの）を作る。
 * 地図の設定の `attr` が無い source は、dynamic（OpenLayers の source から読んだ出典）の値を使う。
 * Google の地図は `attr` があっても dynamic（copyright）を先に出す。
 * 重複は表示される文字で比べる（設定の `A & B` と source の `A &amp; B` は同じもの）。
 * 返すのは元の値（洗う前）。source の値で、洗うと何も残らないものは除く。
 */
export function attributionTexts(
  sources: AttributionSourceLike[],
  lang: string,
  dynamic?: ReadonlyMap<AttributionSourceLike, readonly string[]>
): string[] {
  return attributionEntries(sources, lang, dynamic).map(entry => entry.text);
}

/**
 * 出典の文字列を、Google の地図の分（google）とそれ以外（others）に分ける。
 * 同じ表示の文字は 1 回だけ（Google の分を先に取る）。並びは source の順。
 */
export function attributionGroups(
  sources: AttributionSourceLike[],
  lang: string,
  dynamic?: ReadonlyMap<AttributionSourceLike, readonly string[]>
): { google: string[]; others: string[] } {
  const { google, others } = attributionEntryGroups(sources, lang, dynamic);
  return { google: google.map(entry => entry.text), others: others.map(entry => entry.text) };
}

const STYLE_ID = "maplat-attribution-style";

// 既定は地図の右下の隅。位置は CSS の変数で変えられる。
// <maplat-ui> の中では、UI の右下のボタンの列（bottom: calc(65px + .5em)・right: .5em・幅 2.0625em、
// タッチ端末は 1.5 倍＝3.09375em・間隔は UI の --maplat-ui-control-gap、既定 7px）の左隣に、下端をそろえて置く。
// 地図の切り替えスライダー（下端から 60px）より上、左右のボタンの列の間なので、狭い画面でも UI の部品に重ならない。
// UI の配置の数値は --maplat-attribution-ui-* の変数に分け、規則は :where() で詳細度 0 にした。
// ページの CSS で maplat-app に変数を書けば、どちらも上書きできる。
// z-index は付けない: 地図の箱の最後の子なので地図より上、UI の部品とモーダルより下に描かれる。
// Google の地図のあいだは、最下段を「Google Maps のロゴ＋Google の出典の箱」の行にし（入らなければ出典の箱が
// ロゴの下の行へ回る）、ほかの出典（重ね地図など）は別の箱にしてその上に置く。
// source から読んだ出典（第三者のサーバーが決める値）の項目は、高さを「4 行ぶん」と「地図の高さの 25%」の
// 小さい方までにし、はみ出しは隠す（外の値で箱が地図を覆わないため）。25% の値は JS が地図の箱の高さから
// --maplat-attribution-source-map-limit に入れる（測れないときは 4 行ぶん）。地図の設定の attr には付けない。
// ロゴの大きさは公式の SVG の原寸（105×22。字の高さ 18px。利用条件は高さ 16〜19dp）、
// 余白は利用条件の最小（上・左右 10px、下 5px）。縮めない・縦横比を変えない。
const STYLE_TEXT = `
.maplat-attribution {
  position: absolute;
  right: var(--maplat-attribution-right, 0px);
  bottom: var(--maplat-attribution-bottom, 0px);
  max-width: var(--maplat-attribution-max-width, 100%);
  box-sizing: border-box;
  margin: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.maplat-attribution[hidden] { display: none; }
.maplat-attribution-google {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: flex-end;
  max-width: 100%;
}
.maplat-attribution-others {
  margin-bottom: 4px;
  border-radius: 4px;
}
.maplat-attribution-google-logo {
  display: block;
  flex: 0 0 auto;
  width: 105px;
  height: 22px;
  margin: 10px 10px 5px 10px;
  line-height: 0;
}
.maplat-attribution-google-logo svg {
  display: block;
  width: 105px;
  height: 22px;
}
.maplat-attribution-text {
  display: block;
  min-width: 0;
  padding: 1px 5px;
  font-size: 11px;
  line-height: 1.4;
  color: #333;
  background-color: rgba(255, 255, 255, .8);
  border-top-left-radius: 4px;
  text-align: right;
  white-space: normal;
  overflow-wrap: anywhere;
}
.maplat-attribution-sep { color: #777; }
.maplat-attribution-item-source {
  display: inline-block;
  max-width: 100%;
  max-height: min(calc(${SOURCE_ATTRIBUTION_MAX_LINES} * 1.4em), var(--maplat-attribution-source-map-limit, calc(${SOURCE_ATTRIBUTION_MAX_LINES} * 1.4em)));
  overflow: hidden;
  vertical-align: bottom;
}
.maplat-attribution-item-source p { margin: 0; }
.maplat-attribution a { pointer-events: auto; color: #0645ad; }
:where(maplat-ui > maplat-app) {
  --maplat-attribution-ui-inset: .5em;
  --maplat-attribution-ui-bottom-offset: 65px;
  --maplat-attribution-ui-button-width: 3.09375em;
  --maplat-attribution-ui-gap: var(--maplat-ui-control-gap, 7px);
  --maplat-attribution-bottom: calc(var(--maplat-attribution-ui-bottom-offset) + var(--maplat-attribution-ui-inset) + env(safe-area-inset-bottom, 0px));
  --maplat-attribution-right: calc(var(--maplat-attribution-ui-inset) + var(--maplat-attribution-ui-button-width) + var(--maplat-attribution-ui-gap) + env(safe-area-inset-right, 0px));
  --maplat-attribution-max-width: calc(100% - 2 * (var(--maplat-attribution-ui-inset) + var(--maplat-attribution-ui-button-width) + var(--maplat-attribution-ui-gap)));
}
:where(maplat-ui > maplat-app) .maplat-attribution-text { border-radius: 4px; }
`;

function ensureStyle(doc: Document): void {
  if (doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = STYLE_TEXT;
  (doc.head || doc.documentElement).appendChild(style);
}

/**
 * 出典の表示。地図の箱の最後の子に `div.maplat-attribution` を置き、`update` で中身を作り直す。
 * 祖先の `lang` 属性が変わったら、最後に渡された source で作り直す。
 */
export class AttributionDisplay {
  readonly element: HTMLDivElement;
  #container: HTMLElement;
  #getLang: () => string;
  #sources: AttributionSourceLike[] = [];
  // 地図の設定の attr が無い source（と Google の地図）の、OpenLayers の source から読んだ出典（元の値）。
  // 外の値なので、描くときに狭い許可表で洗い、長さを切る（sanitizeSourceAttributions）
  #dynamic = new Map<AttributionSourceLike, readonly string[]>();
  #observer: MutationObserver | null = null;
  #resizeObserver: ResizeObserver | null = null;
  #disposed = false;

  constructor(container: HTMLElement, getLang: () => string) {
    this.#container = container;
    this.#getLang = getLang;
    const doc = container.ownerDocument;
    ensureStyle(doc);
    const element = doc.createElement("div");
    element.className = "maplat-attribution";
    element.hidden = true;
    this.element = element;
    container.appendChild(element);
    this.#observeLang();
    this.#observeResize();
    this.#waitForUiDefinition();
  }

  /** 今出している Google Maps の表示（ロゴか文字）。Google の地図が無ければ undefined（試験と診断用）。 */
  get googleAttribution(): GoogleAttributionMode | undefined {
    const value = this.element.dataset.googleMaps;
    return value === "logo" || value === "text" ? value : undefined;
  }

  /** 今の言語で出典の文字列を返す（試験と診断用）。 */
  get texts(): string[] {
    return attributionTexts(this.#sources, this.#getLang(), this.#dynamic);
  }

  /** 表示する source を差し替えて描き直す。 */
  update(sources: AttributionSourceLike[]): void {
    if (this.#disposed) return;
    this.#sources = sources.slice();
    // 表示から外れた source の読み取り結果は捨てる
    for (const source of [...this.#dynamic.keys()]) {
      if (!this.#sources.includes(source)) this.#dynamic.delete(source);
    }
    this.render();
  }

  /**
   * 地図の設定の attr が無い source の出典を、OpenLayers の source（getAttributions）から読む。
   * 地図の描画（postrender）のたびに、その地図が描いている source と frameState を渡す。
   * Google の source は表示範囲が変わったときだけ取りに行き、それ以外は前の値を返す（OpenLayers の実装）。
   */
  refreshDynamic(sources: (AttributionSourceLike | null | undefined)[], frameState: unknown): void {
    if (this.#disposed) return;
    for (const source of sources) {
      // Google の地図は attr があっても copyright を読む（利用条件が copyright を全文で出すよう求める）
      if (!source || !this.#sources.includes(source)) continue;
      if (hasConfiguredAttr(source) && !isGoogleSource(source)) continue;
      const fn = typeof source.getAttributions === "function" ? source.getAttributions() : undefined;
      if (typeof fn !== "function") continue;
      let result: unknown;
      try {
        result = fn(frameState);
      } catch {
        continue;
      }
      Promise.resolve(result).then(
        value => this.#setDynamic(source, normalizeOlAttributions(value)),
        () => undefined // 取りに行けなかったときは前の値のまま
      );
    }
  }

  #setDynamic(source: AttributionSourceLike, texts: string[]): void {
    if (this.#disposed || !this.#sources.includes(source)) return;
    // Google の source は取りに行く途中・動かしている途中は前の値（初回は undefined）を返す。空では消さない
    // （洗って何も残らない値でも消さない）
    if (sanitizeSourceAttributions(texts).length === 0) return;
    const previous = this.#dynamic.get(source);
    if (previous && previous.length === texts.length && previous.every((t, i) => t === texts[i])) return;
    this.#dynamic.set(source, texts);
    this.render();
  }

  /** 今の source と言語で描き直す。 */
  render(): void {
    if (this.#disposed) return;
    const element = this.element;
    // 地図の箱の中身が作り直されても、最後の子として戻す
    if (element.parentNode !== this.#container) this.#container.appendChild(element);
    const doc = element.ownerDocument;
    const variant = googleLogoVariant(this.#sources);
    const mode = variant ? googleAttributionMode(this.#availableWidth()) : undefined;
    this.#updateSourceLimit();
    const children: HTMLElement[] = [];
    if (!variant) {
      const box = this.#textBox(attributionEntries(this.#sources, this.#getLang(), this.#dynamic));
      if (box) children.push(box);
    } else {
      const { google, others } = attributionEntryGroups(this.#sources, this.#getLang(), this.#dynamic);
      // ほかの出典は Google の出典と別の箱にして、上に置く
      const othersBox = this.#textBox(others);
      if (othersBox) {
        othersBox.classList.add("maplat-attribution-others");
        children.push(othersBox);
      }
      const row = doc.createElement("span");
      row.className = "maplat-attribution-google";
      if (mode === "logo") row.appendChild(this.#googleLogo(variant));
      const googleBox = this.#textBox(google, mode === "text");
      if (googleBox) row.appendChild(googleBox);
      children.push(row);
    }
    element.replaceChildren(...children);
    if (mode) element.dataset.googleMaps = mode;
    else delete element.dataset.googleMaps;
    element.hidden = children.length === 0;
  }

  /** Google Maps のロゴ（公式の SVG。読み上げは "Google Maps"）。 */
  #googleLogo(variant: GoogleLogoVariant): HTMLElement {
    const doc = this.element.ownerDocument;
    const logo = doc.createElement("span");
    logo.className = "maplat-attribution-google-logo";
    logo.dataset.variant = variant;
    logo.setAttribute("role", "img");
    logo.setAttribute("aria-label", GOOGLE_MAPS_TEXT);
    // 公式のロゴ（埋め込みの定数。外から来る値ではない）
    logo.innerHTML = variant === "dark" ? GOOGLE_MAPS_LOGO_DARK_OUTLINE : GOOGLE_MAPS_LOGO_LIGHT_OUTLINE;
    logo.firstElementChild?.setAttribute("aria-hidden", "true");
    logo.firstElementChild?.setAttribute("focusable", "false");
    return logo;
  }

  /**
   * 出典を " | " で区切って並べた箱（出すものが無ければ null）。
   * googleText が true なら、先頭に文字 "Google Maps"（ロゴの代わり）を入れる。
   * source から読んだ出典の項目には .maplat-attribution-item-source を付ける（高さの上限）。
   */
  #textBox(entries: AttributionEntry[], googleText = false): HTMLElement | null {
    if (entries.length === 0 && !googleText) return null;
    const doc = this.element.ownerDocument;
    const wrapper = doc.createElement("span");
    wrapper.className = "maplat-attribution-text";
    const items: HTMLElement[] = [];
    if (googleText) {
      const item = doc.createElement("span");
      item.className = "maplat-attribution-item maplat-attribution-google-text";
      item.textContent = GOOGLE_MAPS_TEXT;
      items.push(item);
    }
    for (const entry of entries) {
      const item = doc.createElement("span");
      item.className = entry.fromSource ? "maplat-attribution-item maplat-attribution-item-source" : "maplat-attribution-item";
      // 洗ってある HTML（設定の attr は広い許可表、source の値は狭い許可表と長さの上限）
      item.innerHTML = entry.html;
      items.push(item);
    }
    items.forEach((item, index) => {
      if (index > 0) {
        const sep = doc.createElement("span");
        sep.className = "maplat-attribution-sep";
        sep.setAttribute("aria-hidden", "true");
        sep.textContent = " | ";
        wrapper.appendChild(sep);
      }
      wrapper.appendChild(item);
    });
    return wrapper;
  }

  /**
   * source から読んだ出典の項目の高さの上限のうち、地図の高さの 25% の値（px）を CSS の変数に入れる。
   * 地図の箱の高さが測れない（0）ときは変数を外す（4 行ぶんだけが効く）。
   */
  #updateSourceLimit(): void {
    const height = this.#container.clientHeight;
    if (height > 0) {
      this.element.style.setProperty(
        "--maplat-attribution-source-map-limit",
        `${Math.floor(height * SOURCE_ATTRIBUTION_MAX_MAP_RATIO)}px`
      );
    } else {
      this.element.style.removeProperty("--maplat-attribution-source-map-limit");
    }
  }

  /**
   * 出典の表示に使える幅（px）。箱に一時的に width: 100% を当て、右の位置と max-width の変数が
   * 効いた結果の幅を測る。レイアウトが無い（非表示の入れ物・jsdom）ときは 0。
   */
  #availableWidth(): number {
    const element = this.element;
    const { width, display } = element.style;
    const wasHidden = element.hidden;
    element.hidden = false;
    element.style.width = "100%";
    element.style.display = "block";
    const measured = element.getBoundingClientRect().width;
    element.style.width = width;
    element.style.display = display;
    element.hidden = wasHidden;
    return measured;
  }

  /** 表示を外し、言語の監視をやめる。 */
  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    this.#observer?.disconnect();
    this.#observer = null;
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;
    this.#sources = [];
    this.#dynamic.clear();
    this.element.remove();
  }

  /**
   * 地図が <maplat-ui> の中にあり、その要素がまだ定義されていないときは、定義を待って一度だけ描き直す
   * （定義の前は currentLang が無く、仮の順で言語を選んでいるため）。破棄の後は描かない。
   */
  #waitForUiDefinition(): void {
    if (typeof customElements === "undefined" || customElements.get(MAPLAT_UI_TAG)) return;
    if (!closestAcrossShadow(this.#container, MAPLAT_UI_TAG)) return;
    customElements.whenDefined(MAPLAT_UI_TAG).then(
      () => this.render(),
      () => undefined
    );
  }

  /**
   * 地図の箱の大きさが変わったら、source から読んだ出典の高さの上限を直し、Google の地図を出しているときだけ、
   * ロゴと文字のどちらにするかを決め直す（変わるときだけ描き直す）。
   */
  #observeResize(): void {
    if (typeof ResizeObserver === "undefined") return;
    this.#resizeObserver = new ResizeObserver(() => {
      if (this.#disposed) return;
      // source から読んだ出典の高さの上限（地図の高さの 25%）は、描き直さずに変数だけ直す
      this.#updateSourceLimit();
      if (!googleLogoVariant(this.#sources)) return;
      const mode = googleAttributionMode(this.#availableWidth());
      if (mode !== this.googleAttribution) this.render();
    });
    this.#resizeObserver.observe(this.#container);
  }

  #observeLang(): void {
    if (typeof MutationObserver === "undefined") return;
    this.#observer = new MutationObserver(() => this.render());
    const options = { attributes: true, attributeFilter: ["lang"], subtree: true };
    const root = this.#container.getRootNode?.() as Node | undefined;
    // 地図の箱が影の DOM の中なら、その影の木と、外の文書の両方を見る
    if (root && root.nodeType === 11) this.#observer.observe(root, options);
    const docElement = this.#container.ownerDocument.documentElement;
    if (docElement) this.#observer.observe(docElement, options);
  }
}
