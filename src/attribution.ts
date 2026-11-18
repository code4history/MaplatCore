// 表示中の現代の地図（basemap・タイルの重ね地図）の出典を、地図の右下に常に出す小さな表示。
//
// OpenLayers の Attribution の部品は使わない。理由:
//   - Core は前面と背面の 2 つの OL の地図を重ねる。部品は地図ごとなので、背面の地図の出典は
//     前面の地図の下に隠れる。
//   - 操作の自動非表示（tapUIVanish）は `.ol-control` を全部隠す。出典まで隠れてしまう。
//   - アプリは appOption.controls で部品を差し替えられる。差し替えで出典が消えてはいけない。
// 古地図の出典はここには出さない（UI の地図情報に出す。長い自由記述のことがあるため）。
// 出すのは「地図の定義の `attr`」と「提供元の申告」だけ。ライブラリ（OpenLayers）の既定値では埋めない。
// 提供元の申告として読むのは、出典の値が提供元のサーバーの応答から来る source の型だけ（providerAttributionKind）:
//   - Google の地図（Core の GoogleMap）: Map Tiles API の viewport の応答の copyright。
//   - 提供元の TileJSON を持つ source（OpenLayers の TileJSON）: TileJSON の `attribution`（その値と同じものだけ）。
// OSM・StadiaMaps・BingMaps（利用規約のリンクの既定値が混ざる）・XYZ などの出典は読まない。
// 地図の設定に `attr` が無く、提供元の申告も無い地図には、何も出さない。
// Google の地図は、`attr` の有無によらず、表示範囲ごとに取りに行く copyright を必ず出す。
// Map Tiles API の利用条件が、表示範囲の copyright を "in full as provided" で出すよう求めるため、切らずに全文を出す。
// Google の地図を表示しているあいだは、利用条件が求める Google Maps のロゴを Google の出典の左隣に出す
// （狭くてロゴが入らないときは文字 "Google Maps"）。
// 出典は箱を分けて出す: 下の段が背景地図（Google の地図ならロゴと copyright の行）、その上が重ね地図。
// Google の地図に書いた `attr` も、Google の copyright と別の箱にする（利用条件: 第三者の出典は Google の出典と
// "clearly be disassociated"）。
// Google の copyright 以外の箱は ATTRIBUTION_MAX_LINES 行までにし、超えた分は「…」で切る。全文は UI の地図情報などで
// 見せることを想定する（今の版の <maplat-ui> の地図情報は今の地図のメタデータしか出さない）。
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
  /** 地図の ID（providerAttributions で地図ごとに分けるため）。 */
  mapID?: unknown;
}

/** 表示中の地図 1 つ分の、提供元の申告の出典（`<maplat-app>` の providerAttributions の要素）。 */
export interface ProviderAttribution {
  /** 地図の ID */
  mapID: string;
  /** 提供元の申告（狭い許可表で洗った HTML。空のものは除く） */
  attributions: string[];
}

/**
 * 提供元の申告の表が変わったとき（地図の切り替え・申告の到着）に、出典の箱から出す DOM の事象。
 * bubbles・composed なので <maplat-app>（旧 API は地図の div）で受けられる。detail は無い。
 */
export const ATTRIBUTION_CHANGED_EVENT = "attributionChanged";

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

/** 提供元の申告の種類。google: Map Tiles API の copyright、tilejson: 提供元の TileJSON の attribution。 */
export type ProviderAttributionKind = "google" | "tilejson";

/**
 * source の出典が提供元の申告（Google の応答・TileJSON に書かれた値）かを、source の型で決める。
 * Core が今作る source で提供元の申告を持つのは Google の地図だけ。TileJSON は、アプリが TileJSON の source を
 * 渡したときの扱い。
 * 申告でない source（OpenLayers の既定値・作るときの値の source）は undefined。
 *   - Google の地図（Core の GoogleMap。googleMapType を持つ）: OpenLayers の Google は、作るときの
 *     attributions を受けず、出典を Map Tiles API の viewport の応答の copyright だけで作る
 *     （ol/source/Google.js の fetchAttributions_）。
 *   - 提供元の TileJSON を持つ source（getTileJSON を持つもの。OpenLayers の TileJSON）: 出典を提供元の
 *     TileJSON の `attribution` から作る（ol/source/TileJSON.js の handleTileJSONResponse）。ただし作るときに
 *     attributions を渡すとそちらが使われるので、読むときに TileJSON の `attribution` と同じ値だけを残す
 *     （tileJsonDeclaredAttribution）。出すのはいつも提供元の TileJSON に書かれた値になる。
 *     型は instanceof で見ない: ol/source/TileJSON を読み込むと本体の束が約 77 KB 増える（Core 自身は
 *     TileJSON の source を作らない）。OpenLayers 10.11.0 で getTileJSON を持つ source は TileJSON だけ。
 *     TileJSON を直接（tileJSON の項目で）渡して作った source では、値はアプリが書いた TileJSON のもの。
 * 入れないもの: OSM・StadiaMaps・CartoDB・XYZ・WMTS など（作るときの値か、ライブラリの既定の文言）。
 * BingMaps は応答の出典に、ライブラリの既定の利用規約のリンクを必ず足すので、見分けられず入れない。
 */
export function providerAttributionKind(source: AttributionSourceLike): ProviderAttributionKind | undefined {
  if (isGoogleSource(source)) return "google";
  if (typeof (source as TileJsonSourceLike).getTileJSON === "function") return "tilejson";
  return undefined;
}

/** 提供元の TileJSON を持つ source の最小の形（OpenLayers の TileJSON の getTileJSON）。 */
interface TileJsonSourceLike {
  getTileJSON?: () => { attribution?: unknown } | null | undefined;
}

/** 提供元の TileJSON の `attribution`（読めなければ undefined）。 */
function tileJsonDeclaredAttribution(source: AttributionSourceLike): string | undefined {
  const getTileJSON = (source as TileJsonSourceLike).getTileJSON;
  if (typeof getTileJSON !== "function") return undefined;
  let value: unknown;
  try {
    value = getTileJSON.call(source)?.attribution;
  } catch {
    return undefined;
  }
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
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

/**
 * Google の copyright 以外の出典の箱の行数の上限。超えた分は「…」で切り、箱の高さもこの行数までにする
 * （はみ出しは隠す）。全文は UI の地図情報などで見せることを想定する。
 */
export const ATTRIBUTION_MAX_LINES = 2;

/** HTML を断片として読む（template の中身は画像を読みに行かず、スクリプトも動かない）。 */
function parseFragment(html: string): DocumentFragment {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content;
}

/** HTML の表示される文字（空白はまとめる）。重複を除くときに、設定の値と source の値を同じ形で比べるため。 */
function displayText(html: string): string {
  return (parseFragment(html).textContent ?? "").replace(/\s+/g, " ").trim();
}

/**
 * 提供元の申告として読んだ出典（Google の copyright・TileJSON の attribution。第三者のサーバーから
 * 来うる値）を、狭い許可表（sanitizeHtml の profile "iiif"）で洗う。空になったものは除く。
 *   - 残るタグは a・b・br・i・p・small・span・sub・sup だけ、属性は http(s) の href だけ。
 *     img・class・style・javascript: などは落ちる。リンクには target="_blank" と rel="noopener noreferrer" が付く。
 *   - 理由: 広い許可表（地図の設定の attr 用）のままだと、外の値の
 *     `<a href="https://…"><img src="https://…" width="4000" height="4000"></a>` で、出典の箱が地図を覆い、
 *     地図全体が外へのリンクになり、外の画像を読みに行って見ている人の情報が第三者に渡る。
 * 長さは洗う対象ではない（箱の行数の上限で切る。Google の copyright は切らない）。
 * 地図の設定の attr（アプリの作者が書く値）には使わない（従来どおり広い許可表で、img なども通る）。
 * 文字だけの値（Google の copyright など）は変わらない（& と < > は HTML の形になる）。
 */
export function sanitizeSourceAttributions(texts: readonly string[]): string[] {
  return texts.map(text => sanitizeHtml(text, { profile: "iiif" }).trim()).filter(html => html !== "");
}

/** 表示する出典 1 つ。 */
interface AttributionEntry {
  /** 元の値（地図の設定の attr の言語を選んだもの、または source から読んだ値）。`texts` が返す。 */
  text: string;
  /** 表示用に洗った HTML。 */
  html: string;
  /** 重複を除くときに比べる形（表示される文字。文字が無ければ HTML）。 */
  key: string;
}

function configuredEntries(source: AttributionSourceLike, lang: string): AttributionEntry[] {
  const raw = typeof source.get === "function" ? source.get("attr") : undefined;
  const text = pickAttributionText(raw as AttributionValue, lang)?.trim();
  if (!text) return [];
  // 地図の設定の attr は、許可リストで洗ってから入れる（UI の地図情報と同じ関数・同じ許可表）
  const html = sanitizeHtml(text);
  return [{ text, html, key: displayText(html) || html }];
}

function fetchedEntries(
  source: AttributionSourceLike,
  dynamic?: ReadonlyMap<AttributionSourceLike, readonly string[]>
): AttributionEntry[] {
  const entries: AttributionEntry[] = [];
  for (const text of dynamic?.get(source) ?? []) {
    const [html] = sanitizeSourceAttributions([text.trim()]);
    if (html) entries.push({ text: text.trim(), html, key: displayText(html) || html });
  }
  return entries;
}

/**
 * 1 つの source の出典（空を除いたもの。重複は呼び出し側で除く）。
 *   - Google の地図: OpenLayers の source の copyright（dynamic）を必ず出し、地図の設定の `attr` があれば後に添える。
 *   - それ以外: 地図の設定の `attr`。無ければ dynamic（提供元の申告。TileJSON の attribution）。
 */
function entriesOf(
  source: AttributionSourceLike,
  lang: string,
  dynamic?: ReadonlyMap<AttributionSourceLike, readonly string[]>
): AttributionEntry[] {
  const configured = configuredEntries(source, lang);
  if (isGoogleSource(source)) return [...fetchedEntries(source, dynamic), ...configured];
  return configured.length > 0 ? configured : fetchedEntries(source, dynamic);
}

/** 表示される文字が同じものを除いて並べる（seen にあるものも除き、加えたものは seen に足す）。 */
function uniqueEntries(lists: AttributionEntry[][], seen: Set<string>): AttributionEntry[] {
  const result: AttributionEntry[] = [];
  for (const list of lists) {
    for (const entry of list) {
      if (seen.has(entry.key)) continue;
      seen.add(entry.key);
      result.push(entry);
    }
  }
  return result;
}

/**
 * 箱ごとの出典。重複は表示される文字で比べ、google → base → overlay の順に先に取ったほうに出す。
 *   - google: Google の地図の copyright（切らない）
 *   - base: 背景地図の出典（Google の地図に書いた attr を含む）
 *   - overlay: 重ね地図の出典
 */
function attributionEntryGroups(
  sources: AttributionSourceLike[],
  lang: string,
  dynamic?: ReadonlyMap<AttributionSourceLike, readonly string[]>,
  overlays: readonly AttributionSourceLike[] = []
): { google: AttributionEntry[]; base: AttributionEntry[]; overlay: AttributionEntry[] } {
  const bases = sources.filter(source => !overlays.includes(source));
  const overlaySources = sources.filter(source => overlays.includes(source));
  const seen = new Set<string>();
  const google = uniqueEntries(
    bases.filter(isGoogleSource).map(source => fetchedEntries(source, dynamic)),
    seen
  );
  const base = uniqueEntries(
    bases.map(source => (isGoogleSource(source) ? configuredEntries(source, lang) : entriesOf(source, lang, dynamic))),
    seen
  );
  const overlay = uniqueEntries(
    overlaySources.map(source => entriesOf(source, lang, dynamic)),
    seen
  );
  return { google, base, overlay };
}

/**
 * source の並びから、表示する出典の文字列（言語を選んだもの・空と重複を除いたもの）を作る。
 * 地図の設定の `attr` が無い source は、dynamic（提供元の申告として読んだ出典）の値を使う。
 * Google の地図は `attr` があっても dynamic（copyright）を先に出す。
 * 重複は表示される文字で比べる（設定の `A &amp; B` と source の `A & B` は同じもの）。
 * 返すのは元の値（洗う前）。source の値で、洗うと何も残らないものは除く。
 */
export function attributionTexts(
  sources: AttributionSourceLike[],
  lang: string,
  dynamic?: ReadonlyMap<AttributionSourceLike, readonly string[]>
): string[] {
  return uniqueEntries(
    sources.map(source => entriesOf(source, lang, dynamic)),
    new Set()
  ).map(entry => entry.text);
}

/**
 * 出典の文字列を箱ごとに分ける（google: Google の copyright・base: 背景地図・overlay: 重ね地図）。
 * overlays に入っている source が重ね地図。同じ表示の文字は 1 回だけ（google → base → overlay の順に取る）。
 */
export function attributionGroups(
  sources: AttributionSourceLike[],
  lang: string,
  dynamic?: ReadonlyMap<AttributionSourceLike, readonly string[]>,
  overlays: readonly AttributionSourceLike[] = []
): { google: string[]; base: string[]; overlay: string[] } {
  const { google, base, overlay } = attributionEntryGroups(sources, lang, dynamic, overlays);
  const texts = (entries: AttributionEntry[]) => entries.map(entry => entry.text);
  return { google: texts(google), base: texts(base), overlay: texts(overlay) };
}

const STYLE_ID = "maplat-attribution-style";

// 既定は地図の右下の隅。位置は CSS の変数で変えられる。
// <maplat-ui> の中では、UI の右下のボタンの列（bottom: calc(65px + .5em)・right: .5em・幅 2.0625em、
// タッチ端末は 1.5 倍＝3.09375em・間隔は UI の --maplat-ui-control-gap、既定 7px）の左隣に、下端をそろえて置く。
// 地図の切り替えスライダー（下端から 60px）より上、左右のボタンの列の間なので、狭い画面でも UI の部品に重ならない。
// UI の配置の数値は --maplat-attribution-ui-* の変数に分け、規則は :where() で詳細度 0 にした。
// ページの CSS で maplat-app に変数を書けば、どちらも上書きできる。
// z-index は付けない: 地図の箱の最後の子なので地図より上、UI の部品とモーダルより下に描かれる。
// 箱は下から、背景地図の箱（Google の地図のあいだは「Google Maps のロゴ＋Google の copyright の箱」の行。
// 入らなければ copyright の箱がロゴの下の行へ回る。Google の地図の attr はその上の別の箱）、重ね地図の箱の順。
// Google の copyright 以外の箱（.maplat-attribution-clamp）は ATTRIBUTION_MAX_LINES 行までにし、超えた分は「…」で
// 切る（-webkit-line-clamp）。行の高さの上限（max-height と overflow: hidden）も付け、中身が段落や画像でも、
// 箱は必ずその高さに収まる（外の値で箱が地図を覆い、地図全体がリンクになることを防ぐ）。幅も地図の箱までにし、
// 中の画像（設定の attr には画像を書ける）も箱の幅と 1 行の高さまでに縮める（縦横比は保つ）。
// 段落・表・箇条書き・pre などのブロックは、箱の中では行の中の文字として並べる（display: inline・空白は詰める）。
// ブロックや行より高い画像があると、-webkit-line-clamp が「…」を付ける行を作れず、切られるだけになるため。
// 行の中に並べたブロックの後ろには空白を入れる（段落や表の升の文字が「AB」と続かないように）。
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
.maplat-attribution-stacked {
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
.maplat-attribution-clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${ATTRIBUTION_MAX_LINES};
  line-clamp: ${ATTRIBUTION_MAX_LINES};
  max-width: 100%;
  /* 行の高さ × 行数 ＋ 上下の余白（.maplat-attribution-text の padding 1px ずつ）。幅も余白込みで地図の箱まで */
  box-sizing: border-box;
  max-height: calc(${ATTRIBUTION_MAX_LINES} * 1.4em + 2px);
  overflow: hidden;
}
.maplat-attribution-clamp img {
  max-width: 100%;
  max-height: 1.4em;
  object-fit: contain;
  vertical-align: bottom;
}
.maplat-attribution-clamp :is(p, div, pre, code, ul, ol, li, table, thead, tbody, tr, th, td) {
  display: inline;
  margin: 0;
  padding: 0;
  white-space: normal;
  font: inherit;
}
.maplat-attribution-clamp :is(p, div, pre, li, tr, td, th)::after { content: " "; }
.maplat-attribution-item p { margin: 0; }
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
  // #sources のうち重ね地図のもの（別の箱に出す）
  #overlays: AttributionSourceLike[] = [];
  // 地図の設定の attr が無い source（と Google の地図）の、提供元の申告として読んだ出典（元の値）。
  // 読むのは providerAttributionKind が決まる source だけ（ライブラリの既定値は読まない）。
  // 外の値なので、描くときに狭い許可表で洗う（sanitizeSourceAttributions）
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

  /**
   * 表示中の source ごとの、提供元の申告（OpenLayers の source から読んだ出典を、狭い許可表で洗った HTML）。
   * 地図の右下に出すのと同じ表から作る。申告の無い source・mapID の無い source は載せない。
   * 地図の定義の attr は載せない（getMapMeta で取れる）。並びは表示の順（前面 → 重ね地図 → 背面）。
   */
  get providerAttributions(): ProviderAttribution[] {
    const result: ProviderAttribution[] = [];
    for (const source of this.#sources) {
      const { mapID } = source;
      if (typeof mapID !== "string" || !mapID) continue;
      const attributions = sanitizeSourceAttributions(this.#dynamic.get(source) ?? []);
      if (attributions.length > 0) result.push({ mapID, attributions });
    }
    return result;
  }

  /** 今の言語で出典の文字列を返す（試験と診断用）。 */
  get texts(): string[] {
    return attributionTexts(this.#sources, this.#getLang(), this.#dynamic);
  }

  /**
   * 表示する source を差し替えて描き直す。overlays は sources のうち重ね地図のもの（背景地図と別の箱に出す）。
   */
  update(sources: AttributionSourceLike[], overlays: readonly AttributionSourceLike[] = []): void {
    if (this.#disposed) return;
    this.#sources = sources.slice();
    this.#overlays = overlays.filter(source => this.#sources.includes(source));
    // 表示から外れた source の読み取り結果は捨てる
    for (const source of [...this.#dynamic.keys()]) {
      if (!this.#sources.includes(source)) this.#dynamic.delete(source);
    }
    this.render();
    this.#notifyChanged();
  }

  /** 提供元の申告の表が変わったことを知らせる（ATTRIBUTION_CHANGED_EVENT）。 */
  #notifyChanged(): void {
    if (this.#disposed || typeof CustomEvent === "undefined") return;
    this.element.dispatchEvent(new CustomEvent(ATTRIBUTION_CHANGED_EVENT, { bubbles: true, composed: true }));
  }

  /**
   * 地図の設定の attr が無い source の、提供元の申告の出典を、OpenLayers の source（getAttributions）から読む。
   * 提供元の申告でない source（providerAttributionKind が undefined）は読まない（ライブラリの既定値で埋めない）。
   * 地図の描画（postrender）のたびに、その地図が描いている source と frameState を渡す。
   * Google の source は表示範囲が変わったときだけ取りに行き、それ以外は前の値を返す（OpenLayers の実装）。
   */
  refreshDynamic(sources: (AttributionSourceLike | null | undefined)[], frameState: unknown): void {
    if (this.#disposed) return;
    for (const source of sources) {
      // Google の地図は attr があっても copyright を読む（利用条件が copyright を全文で出すよう求める）
      if (!source || !this.#sources.includes(source)) continue;
      const kind = providerAttributionKind(source);
      if (!kind) continue;
      if (hasConfiguredAttr(source) && kind !== "google") continue;
      const fn = typeof source.getAttributions === "function" ? source.getAttributions() : undefined;
      if (typeof fn !== "function") continue;
      let result: unknown;
      try {
        result = fn(frameState);
      } catch {
        continue;
      }
      Promise.resolve(result).then(
        value => {
          let texts = normalizeOlAttributions(value);
          // TileJSON は、提供元の TileJSON の attribution と同じ値だけ（作るときに渡した attributions は出さない）
          if (kind === "tilejson") {
            const declared = tileJsonDeclaredAttribution(source);
            texts = texts.filter(text => text === declared);
          }
          this.#setDynamic(source, texts);
        },
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
    this.#notifyChanged();
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
    const { google, base, overlay } = attributionEntryGroups(
      this.#sources,
      this.#getLang(),
      this.#dynamic,
      this.#overlays
    );
    // 上から: 重ね地図の箱、背景地図の箱、（Google の地図のあいだは）ロゴと Google の copyright の行
    const children: HTMLElement[] = [];
    for (const [entries, role] of [
      [overlay, "overlay"],
      [base, "base"]
    ] as const) {
      const box = this.#textBox(entries);
      if (!box) continue;
      // Google の copyright 以外は行数の上限で「…」にする
      box.classList.add("maplat-attribution-clamp", `maplat-attribution-${role}`);
      children.push(box);
    }
    if (variant) {
      const row = doc.createElement("span");
      row.className = "maplat-attribution-google";
      if (mode === "logo") row.appendChild(this.#googleLogo(variant));
      // Google の copyright は切らない（利用条件の "in full as provided"）
      const googleBox = this.#textBox(google, mode === "text");
      if (googleBox) row.appendChild(googleBox);
      children.push(row);
    }
    // 最下段より上の箱は、間を空けて角を丸める
    children.slice(0, -1).forEach(child => child.classList.add("maplat-attribution-stacked"));
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
      item.className = "maplat-attribution-item";
      // 洗ってある HTML（設定の attr は広い許可表、source から読んだ値は狭い許可表）
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
    this.#overlays = [];
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
   * 地図の箱の大きさが変わったら、Google の地図を出しているときだけ、ロゴと文字のどちらにするかを決め直す
   * （変わるときだけ描き直す）。
   */
  #observeResize(): void {
    if (typeof ResizeObserver === "undefined") return;
    this.#resizeObserver = new ResizeObserver(() => {
      if (this.#disposed || !googleLogoVariant(this.#sources)) return;
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
