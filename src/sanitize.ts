// m1-t4: viewer の HTML 合成経路の無害化（設計書 §3.1〜§3.5）。
//
// なぜ描画側でサニタイズするか:
//   normalize_pois.ts でビューア自身がリモートの POI JSON を fetch しており、取得側で止められない。
//
// なぜ許可リストが広いか:
//   実データは desc に HTML を含むのが常態である（実測: stones 121/121・tatebayashi 10/12。
//   b × 610 / br × 592 / a × 2）。厳しくすると既存データの見た目が壊れる。
//
// 許可リストの定義はこのファイルが唯一の正本である（設計書 §3.2 / §3.4）。
// 他所に複製を作らないこと。
import createDOMPurify from "dompurify";
// 許可リストの**データ正本**。コード側に複製しないこと（AC7）。
import ALLOWLIST from "./sanitize-allowlist.json";

/** 許可するタグ（データ正本 sanitize-allowlist.json より）。 */
const ALLOWED_TAGS = ALLOWLIST.tags;

/** 許可する属性（データ正本より）。on* はここに無いことで落ちる。 */
const ALLOWED_ATTR = ALLOWLIST.attributes;

/**
 * data: をここで一旦通すのが要点である（設計書 §3.5(b)）。
 * afterSanitizeAttributes はサニタイズ**後**に走るため、ここで落とすと
 * img[src] の data:image/* を復元できない。選別は下の hook で行う。
 */
const ALLOWED_URI_REGEXP = /^(?:https?|mailto|tel|data):/i;

/**
 * ALLOWED_URI_REGEXP は href / src だけでなく**すべての属性値**に適用される（実測）。
 * DOMPurify は URI_SAFE_ATTRIBUTES に無い属性の値をこの正規表現で検査するため、
 * 既定のままだと target="_blank" / width="100" のような URL でない値まで落ちる。
 * URL を取らない属性はここで「URI 検査の対象外」と宣言する。
 * （alt / class / title は DOMPurify の既定 URI_SAFE_ATTRIBUTES に含まれるため不要）
 */
const ADD_URI_SAFE_ATTR = ALLOWLIST.uriSafeAttributes.values;

const FORBID_TAGS = ALLOWLIST.forbidTags;
const FORBID_ATTR = ALLOWLIST.forbidAttributes;

/**
 * img[src] で許可する data: の MIME。
 * svg+xml は**含めない**（設計書 §3.5(c)）。img 経由ではブラウザが SVG 内の script を
 * 実行しないため即 XSS ではないが、許可面を最小に保つ防御的判断である。
 * 実運用データで必要と判明した場合のみ、人間承認のうえ §6.2 の条件付き AC を適用して追加する。
 */
const SAFE_IMAGE_DATA_URI = /^data:image\/(png|jpeg|gif|webp|avif);/i;

const isDataUri = (v: string | null): boolean => !!v && /^\s*data:/i.test(v);

function afterSanitizeAttributes(node: Element): void {
  // 1. target="_blank" には rel を強制付与する（タブナビング対策）
  if (node.tagName === "A" && node.getAttribute("target") === "_blank") {
    node.setAttribute("rel", "noopener noreferrer");
  }

  const isImg = node.tagName === "IMG";

  // 2. data: の選別（ALLOWED_URI_REGEXP で通した分をここで絞る）
  if (isImg) {
    const src = node.getAttribute("src");
    if (isDataUri(src) && !SAFE_IMAGE_DATA_URI.test(src!.trim())) {
      node.removeAttribute("src");
    }
    // srcset は ALLOWED_ATTR に無いので通常は落ちるが、二重に担保する
    if (node.hasAttribute("srcset")) node.removeAttribute("srcset");
  } else {
    for (const attr of ["src", "href", "xlink:href"]) {
      if (isDataUri(node.getAttribute(attr))) node.removeAttribute(attr);
    }
  }
}

let purifier: ReturnType<typeof createDOMPurify> | undefined;

/**
 * ブラウザ / jsdom（Vitest）/ Electron renderer の3環境で使う（設計書 §3.5(a)）。
 * window が無い純 Node 実行では**明示的に例外にする**。
 * 黙って素通しさせるとサニタイズを迂回した生の HTML が流れるため。
 */
function getPurifier() {
  if (purifier) return purifier;
  const win = (globalThis as unknown as { window?: Window }).window;
  if (!win) {
    throw new Error(
      "sanitizeHtml: window の無い環境では使用できません（DOMPurify の初期化に必要）"
    );
  }
  purifier = createDOMPurify(win as unknown as Window & typeof globalThis);
  purifier.addHook("afterSanitizeAttributes", afterSanitizeAttributes as never);
  return purifier;
}

/** リモート POI 由来の HTML を無害化する。S1 / S5 の sink で使う。 */
export function sanitizeHtml(dirty: string): string {
  if (dirty === undefined || dirty === null) return "";
  return getPurifier().sanitize(String(dirty), {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
    ADD_URI_SAFE_ATTR,
    FORBID_TAGS,
    FORBID_ATTR,
    ALLOW_DATA_ATTR: false,
    // 禁止タグを落としても中身のテキストは残す（実データの可読性を保つ）
    KEEP_CONTENT: true
  }) as unknown as string;
}

/** 属性値をエスケープする。属性を組み立てる箇所で使う。 */
export function escapeAttr(value: string): string {
  if (value === undefined || value === null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * HTML を落としてテキストだけを残す。**属性の往復**に備えるためのもの。
 *
 * なぜ必要か（設計書 §3.4）:
 *   escapeAttr は「属性コンテキスト」でのエスケープにすぎない。
 *   属性へ &lt;img…&gt; と書いても、ブラウザの getAttribute はエンティティを復号して
 *   `<img …>` を返す。受け手（Chuci の cc-swiper）はその値を自分の HTML へ補間するため、
 *   往復した時点で生の HTML に戻ってしまう。
 *   caption の契約はテキストであり（実データ13件すべてが HTML を含まない）、
 *   HTML が渡ること自体が誤りなので、渡す側でテキスト化する。
 */
export function toPlainText(value: string): string {
  if (value === undefined || value === null) return "";
  const stripped = getPurifier().sanitize(String(value), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  }) as unknown as string;
  // stripped はタグを含まないため、ここでの innerHTML はエンティティ復号のためだけに使う
  const el = (globalThis as unknown as { window: Window }).window.document.createElement("div");
  el.innerHTML = stripped;
  return el.textContent || "";
}

/**
 * cc-swiper-slide に渡してよい**値属性**（設計書 §3.4）。
 * Chuci/src/components/swiper/cc-swiper.ts の getAttribute を全数走査して確定した。
 */
const SLIDE_VALUE_ATTRS = new Set(ALLOWLIST.slide.valueAttributes);

/** cc-swiper-slide に渡してよい**真偽値属性**（同上 hasAttribute より）。 */
const SLIDE_BOOLEAN_ATTRS = new Set(ALLOWLIST.slide.booleanAttributes);

/**
 * テキストとして扱う属性。受け手が自分の HTML へ補間するため、
 * 属性エスケープだけでなく**テキスト化**する（往復対策。設計書 §3.4）。
 */
const SLIDE_TEXT_ATTRS = new Set(ALLOWLIST.slide.textAttributes.values);

/** URL として扱う属性。http(s) 以外は落とす。 */
const SLIDE_URL_ATTRS = new Set(ALLOWLIST.slide.urlAttributes);

const isSafeUrl = (v: string): boolean => /^(?:https?:)?\/\/|^\/|^[^:]*$/i.test(v.trim());

/**
 * mediaObj から cc-swiper-slide の属性文字列を組み立てる（S2）。
 *
 * **属性名も POI 由来である**ため、値のエスケープだけでは防げない（設計書 §2.3）。
 * 旧実装は `["src","type","thumbnail","desc"]` の blocklist 4件だけを除外しており、
 * `{"onerror":"alert(1)"}` があれば ` onerror="alert(1)"` をそのまま出力していた。
 * ここでは allowlist に一致するキーだけを出力する。
 */
export function buildSlideAttrs(media: Record<string, unknown>): string {
  const parts: string[] = [];
  for (const [key, val] of Object.entries(media || {})) {
    const name = String(key).toLowerCase();

    if (SLIDE_BOOLEAN_ATTRS.has(name)) {
      // 真偽値属性は truthy のときだけ属性名を出す（値は出さない）
      if (val) parts.push(name);
      continue;
    }
    if (!SLIDE_VALUE_ATTRS.has(name)) continue; // allowlist 外はすべて破棄
    if (val === undefined || val === null) continue;

    let str = String(val);
    if (SLIDE_URL_ATTRS.has(name)) {
      if (!isSafeUrl(str)) continue; // javascript: 等を落とす
      if (/[<>]/.test(str)) continue; // URL に山括弧は入らない（往復で HTML 化する余地を断つ）
    }
    if (SLIDE_TEXT_ATTRS.has(name)) str = toPlainText(str); // 往復対策
    parts.push(`${name}="${escapeAttr(str)}"`);
  }
  return parts.join(" ");
}
