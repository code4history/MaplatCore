// 表示中の現代の地図（basemap・タイルの重ね地図）の出典を、地図の右下に常に出す小さな表示。
//
// OpenLayers の Attribution の部品は使わない。理由:
//   - Core は前面と背面の 2 つの OL の地図を重ねる。部品は地図ごとなので、背面の地図の出典は
//     前面の地図の下に隠れる。
//   - 操作の自動非表示（tapUIVanish）は `.ol-control` を全部隠す。出典まで隠れてしまう。
//   - アプリは appOption.controls で部品を差し替えられる。差し替えで出典が消えてはいけない。
// 古地図の出典はここには出さない（UI の地図情報に出す。長い自由記述のことがあるため）。
import browserLanguage from "./browserlanguage";
import { sanitizeHtml } from "./sanitize";

/** 出典の値（文字列か、言語ごとの文字列）。 */
export type AttributionValue = string | Record<string, string | undefined | null> | undefined | null;

/** 出典を持つ地図（source）の最小の形。 */
export interface AttributionSourceLike {
  get?: (key: string) => unknown;
  isWmts?: () => boolean;
}

/**
 * 言語ごとの値から 1 つ選ぶ。完全に一致する言語 → 地域を外した言語（ja-JP → ja）→ en → 最初の空でない値。
 * 文字列はそのまま。何も無ければ undefined。
 */
export function pickAttributionText(value: AttributionValue, lang: string): string | undefined {
  if (value == null) return undefined;
  if (typeof value === "string") return value;
  if (typeof value !== "object") return String(value);
  const entries = Object.entries(value).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string" && entry[1] !== ""
  );
  const exact = entries.find(([key]) => key === lang);
  if (exact) return exact[1];
  const base = lang.split("-")[0];
  const sameBase = entries.find(([key]) => key === base);
  if (sameBase) return sameBase[1];
  const en = entries.find(([key]) => key === "en");
  if (en) return en[1];
  return entries[0]?.[1];
}

/** 要素から最も近い `lang` 属性の値（影の DOM の境界は host へ越える）。無ければ undefined。 */
export function closestLang(element: Element | null | undefined): string | undefined {
  let node: Element | null | undefined = element;
  while (node) {
    // 空の lang="" は「不明」なので飛ばして外側を見る
    const found = node.closest('[lang]:not([lang=""])');
    if (found) return found.getAttribute("lang") || undefined;
    const root = node.getRootNode?.() as ShadowRoot | Document | undefined;
    node = root && "host" in root ? root.host : null;
  }
  return undefined;
}

/**
 * 出典の言語を決める。祖先の `lang` 属性 → appOption.lang → 設定ファイルの lang → ブラウザ → en。
 * 文字列でない値・空の値は飛ばす。
 */
export function resolveAttributionLang(
  element: Element | null | undefined,
  ...fallbacks: unknown[]
): string {
  const fromDom = closestLang(element);
  if (fromDom) return fromDom;
  for (const value of fallbacks) {
    if (typeof value === "string" && value) return value;
  }
  // browserLanguage は navigator を読めないときは "" を返す
  return browserLanguage() || "en";
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

/** source の並びから、表示する出典の文字列（言語を選んだもの・空と重複を除いたもの）を作る。 */
export function attributionTexts(sources: AttributionSourceLike[], lang: string): string[] {
  const texts: string[] = [];
  for (const source of sources) {
    const raw = typeof source.get === "function" ? source.get("attr") : undefined;
    const text = pickAttributionText(raw as AttributionValue, lang)?.trim();
    if (text && !texts.includes(text)) texts.push(text);
  }
  return texts;
}

const STYLE_ID = "maplat-attribution-style";

// 既定は地図の右下の隅。位置は CSS の変数で変えられる。
// <maplat-ui> の中では、UI の右下のボタンの列（bottom: calc(65px + .5em)・right: .5em・幅 2.0625em、
// タッチ端末は 1.5 倍）の左隣に、下端をそろえて置く。地図の切り替えスライダー（下端から 60px）より上、
// 左右のボタンの列の間なので、狭い画面でも UI の部品に重ならない。
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
maplat-ui > maplat-app {
  --maplat-attribution-bottom: calc(65px + .5em + env(safe-area-inset-bottom, 0px));
  --maplat-attribution-right: calc(.5em + 3.09375em + 7px + env(safe-area-inset-right, 0px));
  --maplat-attribution-max-width: calc(100% - 2 * (.5em + 3.09375em + 7px));
}
maplat-ui > maplat-app .maplat-attribution-text { border-radius: 4px; }
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
    return attributionTexts(this.#sources, this.#getLang());
  }

  /** 表示する source を差し替えて描き直す。 */
  update(sources: AttributionSourceLike[]): void {
    if (this.#disposed) return;
    this.#sources = sources.slice();
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
