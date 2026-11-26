// demo/i18n/core.ts: デモ 3 ページ（目次・古地図・変換の形）で共通の、言語の切り替えの仕組み。
// 言語は ja か en。決め方: URL の ?lang= → ブラウザの言語（navigator.language が日本語なら ja、それ以外は en）。
// 文言は辞書（demo/i18n/*.ts。ページごとに 1 つ）にまとめ、画面のコードにも HTML にも直書きしない。
// ほかのページへのリンクと「日本語 / English」の切り替えは、言語を引き継ぐ（?lang= を付ける）。
// このファイルは DOM だけに依存し、Core 本体を import しない。

export type Lang = "ja" | "en";
export const LANGS: readonly Lang[] = ["ja", "en"];
/** 1 つの辞書。ja と en は同じ鍵を持つ（spec/demo-i18n.spec.ts が確かめる）。値の {名前} は t() の引数で置き換える */
export type Dict = Record<Lang, Record<string, string>>;
export type Params = Record<string, string | number>;
export type Translate = (key: string, params?: Params) => string;

/** 言語の決定。?lang=ja|en が最優先。無い・未知なら navigator.language（ja で始まれば ja、それ以外は en） */
export const detectLang = (search = location.search, navLang: string = navigator.language): Lang => {
  const q = new URLSearchParams(search).get("lang");
  if (q === "ja" || q === "en") return q;
  return /^ja\b/i.test(navLang) ? "ja" : "en";
};

/** 辞書から翻訳関数を作る。鍵が無いときは鍵そのものを返し（画面で気づける）、console にも出す */
export const makeTranslate = (dict: Dict, lang: Lang): Translate => (key, params) => {
  const raw = dict[lang][key];
  if (raw === undefined) {
    console.error(`demo i18n: 鍵 "${key}" が辞書（${lang}）にありません`);
    return key;
  }
  return params ? raw.replace(/\{(\w+)\}/g, (m, name: string) => (name in params ? String(params[name]) : m)) : raw;
};

/** 2 つの辞書を 1 つにまとめる（共通の辞書にページの辞書を足す）。鍵が重なったらエラー */
export const mergeDicts = (...dicts: Dict[]): Dict => {
  const out: Dict = { ja: {}, en: {} };
  for (const d of dicts) {
    for (const lang of LANGS) {
      for (const [k, v] of Object.entries(d[lang])) {
        if (k in out[lang]) throw new Error(`demo i18n: 鍵 "${k}" が重なっています`);
        out[lang][k] = v;
      }
    }
  }
  return out;
};

/** url の ?lang= を lang にした URL。ページ内の相対リンクにも使う */
export const withLang = (href: string, lang: Lang, base: string = location.href): string => {
  const url = new URL(href, base);
  url.searchParams.set("lang", lang);
  return url.toString();
};

const isLocalPage = (a: HTMLAnchorElement): boolean => {
  const raw = a.getAttribute("href");
  if (!raw || raw.startsWith("#")) return false;
  const url = new URL(raw, location.href);
  return url.origin === location.origin && /\.html$|\/$/.test(url.pathname);
};

/**
 * 言語をページに適用する。
 * - <html lang> を lang にする（古地図のデモは、これで地図のデータの名前も切り替わる）。
 * - data-i18n="鍵" の要素の文字、data-i18n-title・data-i18n-aria-label・data-i18n-alt の属性、<title> を辞書から入れる。
 * - 同じページ内の他のページへのリンク（.html）に ?lang= を付ける。
 */
export const applyLang = (t: Translate, lang: Lang, root: ParentNode = document): void => {
  document.documentElement.lang = lang;
  for (const el of root.querySelectorAll<HTMLElement>("[data-i18n]")) el.textContent = t(el.dataset.i18n!);
  const attrs: [string, string][] = [["title", "i18nTitle"], ["aria-label", "i18nAriaLabel"], ["alt", "i18nAlt"]];
  for (const [attr, key] of attrs) {
    for (const el of root.querySelectorAll<HTMLElement>(`[data-i18n-${attr}]`)) el.setAttribute(attr, t(el.dataset[key]!));
  }
  const title = document.querySelector("title");
  if (title?.dataset.i18n) document.title = t(title.dataset.i18n);
  for (const a of root.querySelectorAll<HTMLAnchorElement>("a[href]")) {
    if (a.dataset.langSwitch === undefined && isLocalPage(a)) a.setAttribute("href", withLang(a.getAttribute("href")!, lang));
  }
};

/**
 * 「日本語 / English」の切り替えを container に置く。押すと、今の URL の ?lang= だけを替えて読み込み直す
 * （画面の状態は URL の引数が持つので、切り替えても同じ画面に戻る）。
 */
export const mountLangSwitch = (container: HTMLElement, lang: Lang, label: string): void => {
  container.classList.add("demo-lang");
  container.setAttribute("role", "group");
  container.setAttribute("aria-label", label);
  const names: Record<Lang, string> = { ja: "日本語", en: "English" };
  container.replaceChildren();
  LANGS.forEach((l, i) => {
    if (i > 0) container.append(" / ");
    const a = document.createElement("a");
    a.dataset.langSwitch = l;
    a.lang = l;
    a.textContent = names[l];
    a.href = withLang(location.href, l);
    if (l === lang) a.setAttribute("aria-current", "true");
    a.addEventListener("click", (e) => {
      e.preventDefault();
      location.assign(withLang(location.href, l));
    });
    container.append(a);
  });
};
