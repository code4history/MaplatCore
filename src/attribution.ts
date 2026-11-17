// 表示中の現代の地図（basemap・タイルの重ね地図）の出典を、地図の右下に常に出す小さな表示。
//
// OpenLayers の Attribution の部品は使わない。理由:
//   - Core は前面と背面の 2 つの OL の地図を重ねる。部品は地図ごとなので、背面の地図の出典は
//     前面の地図の下に隠れる。
//   - 操作の自動非表示（tapUIVanish）は `.ol-control` を全部隠す。出典まで隠れてしまう。
//   - アプリは appOption.controls で部品を差し替えられる。差し替えで出典が消えてはいけない。
// 古地図の出典はここには出さない（UI の地図情報に出す。長い自由記述のことがあるため）。
// 地図の設定に `attr` が無い現代の地図（Google など）は、OpenLayers の source の出典
// （getAttributions。Google は表示範囲ごとに取りに行く copyright）を出す。
import browserLanguage from "./browserlanguage";
import { MAPLAT_UI_TAG } from "./element_contract";
import { sanitizeHtml } from "./sanitize";

/** 出典の値（文字列か、言語ごとの文字列）。 */
export type AttributionValue = string | Record<string, string | undefined | null> | undefined | null;

/** 出典を持つ地図（source）の最小の形。 */
export interface AttributionSourceLike {
  get?: (key: string) => unknown;
  isWmts?: () => boolean;
  /** OpenLayers の source の出典（frameState を受けて文字列・配列・その Promise を返す関数）。 */
  getAttributions?: () => unknown;
}

/**
 * 言語ごとの値から 1 つ選ぶ。UI の pickLocalized と同じ規則: 一致する言語 → en → 最初の空でない値。
 * （地域を外した言語には寄せない。UI の地図情報と同じ文字を出すため）
 * 文字列はそのまま。何も無ければ undefined。
 */
export function pickAttributionText(value: AttributionValue, lang: string): string | undefined {
  if (value == null) return undefined;
  if (typeof value === "string") return value;
  if (typeof value !== "object") return String(value);
  let first: string | undefined;
  let en: string | undefined;
  for (const [key, text] of Object.entries(value)) {
    if (typeof text !== "string" || !text) continue;
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

/** 地図の設定の `attr` を持つか（空の文字列・空の言語ごとの値は持たない扱い）。 */
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
 * source の並びから、表示する出典の文字列（言語を選んだもの・空と重複を除いたもの）を作る。
 * 地図の設定の `attr` が無い source は、dynamic（OpenLayers の source から読んだ出典）の値を使う。
 */
export function attributionTexts(
  sources: AttributionSourceLike[],
  lang: string,
  dynamic?: ReadonlyMap<AttributionSourceLike, readonly string[]>
): string[] {
  const texts: string[] = [];
  const push = (text: string | undefined) => {
    const trimmed = text?.trim();
    if (trimmed && !texts.includes(trimmed)) texts.push(trimmed);
  };
  for (const source of sources) {
    const raw = typeof source.get === "function" ? source.get("attr") : undefined;
    const configured = pickAttributionText(raw as AttributionValue, lang);
    if (configured !== undefined && configured.trim() !== "") push(configured);
    else dynamic?.get(source)?.forEach(push);
  }
  return texts;
}

const STYLE_ID = "maplat-attribution-style";

// 既定は地図の右下の隅。位置は CSS の変数で変えられる。
// <maplat-ui> の中では、UI の右下のボタンの列（bottom: calc(65px + .5em)・right: .5em・幅 2.0625em、
// タッチ端末は 1.5 倍＝3.09375em・間隔は UI の --maplat-ui-control-gap、既定 7px）の左隣に、下端をそろえて置く。
// 地図の切り替えスライダー（下端から 60px）より上、左右のボタンの列の間なので、狭い画面でも UI の部品に重ならない。
// UI の配置の数値は --maplat-attribution-ui-* の変数に分け、規則は :where() で詳細度 0 にした。
// ページの CSS で maplat-app に変数を書けば、どちらも上書きできる。
// z-index は付けない: 地図の箱の最後の子なので地図より上、UI の部品とモーダルより下に描かれる。
const STYLE_TEXT = `
.maplat-attribution {
  position: absolute;
  right: var(--maplat-attribution-right, 0px);
  bottom: var(--maplat-attribution-bottom, 0px);
  max-width: var(--maplat-attribution-max-width, 100%);
  box-sizing: border-box;
  margin: 0;
  pointer-events: none;
}
.maplat-attribution[hidden] { display: none; }
.maplat-attribution-text {
  display: block;
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
  // 地図の設定の attr が無い source の、OpenLayers の source から読んだ出典
  #dynamic = new Map<AttributionSourceLike, readonly string[]>();
  #observer: MutationObserver | null = null;
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
      if (!source || !this.#sources.includes(source) || hasConfiguredAttr(source)) continue;
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
    if (texts.length === 0) return;
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
    const texts = this.texts;
    const doc = element.ownerDocument;
    const wrapper = doc.createElement("span");
    wrapper.className = "maplat-attribution-text";
    texts.forEach((text, index) => {
      if (index > 0) {
        const sep = doc.createElement("span");
        sep.className = "maplat-attribution-sep";
        sep.setAttribute("aria-hidden", "true");
        sep.textContent = " | ";
        wrapper.appendChild(sep);
      }
      const item = doc.createElement("span");
      item.className = "maplat-attribution-item";
      // 設定由来の値なので、許可リストで洗ってから入れる（UI の地図情報と同じ関数）
      item.innerHTML = sanitizeHtml(text);
      wrapper.appendChild(item);
    });
    element.replaceChildren(...(texts.length ? [wrapper] : []));
    element.hidden = texts.length === 0;
  }

  /** 表示を外し、言語の監視をやめる。 */
  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    this.#observer?.disconnect();
    this.#observer = null;
    this.#sources = [];
    this.#dynamic.clear();
    this.element.remove();
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
