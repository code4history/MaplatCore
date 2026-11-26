import { readFileSync } from "node:fs";
import { beforeEach, describe, expect, it } from "vitest";
import { commonDict } from "../demo/i18n/common";
import { applyLang, detectLang, LANGS, makeTranslate, mergeDicts, mountLangSwitch, withLang, type Dict } from "../demo/i18n/core";
import { dict as indexDict } from "../demo/i18n/index-page";
import { dict as layeredDict, REGION_KEY } from "../demo/i18n/layered-map";
import { dict as oldMapDict } from "../demo/i18n/old-map";

// デモ 3 ページの言語の切り替え（ja・en）。文言は辞書（demo/i18n/*.ts）の 1 か所にあり、画面のコードにも HTML にも直書きしない。
const PAGES: Record<string, { dict: Dict; files: string[] }> = {
  index: { dict: indexDict, files: ["index.html", "demo/index.ts"] },
  "layered-map": { dict: layeredDict, files: ["layered-map.html", "demo/layered-map.ts"] },
  "old-map": { dict: oldMapDict, files: ["old-map.html", "demo/demo.ts"] }
};
const CJK = /[\u3000-\u30ff\u3400-\u9fff\uff00-\uffef]/;
const placeholders = (v: string): string[] => [...v.matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort();
const read = (f: string): string => readFileSync(f, "utf-8");

describe("辞書（ja・en）", () => {
  const all: Record<string, Dict> = { common: commonDict, ...Object.fromEntries(Object.entries(PAGES).map(([k, v]) => [k, v.dict])) };
  for (const [name, d] of Object.entries(all)) {
    describe(name, () => {
      it("ja と en の鍵がそろっている", () => {
        expect(Object.keys(d.en).sort()).toEqual(Object.keys(d.ja).sort());
      });
      it("空の値が無い", () => {
        for (const lang of LANGS) for (const [k, v] of Object.entries(d[lang])) expect(v.trim(), `${lang} ${k}`).not.toBe("");
      });
      it("{名前} の置き換えが、ja と en で同じ", () => {
        for (const k of Object.keys(d.ja)) expect(placeholders(d.en[k]), k).toEqual(placeholders(d.ja[k]));
      });
      it("en の値に日本語が残っていない", () => {
        for (const [k, v] of Object.entries(d.en)) expect(v, k).not.toMatch(CJK);
      });
      it("ja の値は日本語を含む。文字を含まない値（記号だけ）と固有名（CRS・GCP・OpenStreetMap）は除く。en の文を ja に貼ったままにしない", () => {
        for (const [k, v] of Object.entries(d.ja)) {
          if (CJK.test(v) || !/[A-Za-z]/.test(v.replace(/\{\w+\}/g, ""))) continue;
          expect(d.en[k], k).toContain(v);
        }
      });
    });
  }
  it("共通の辞書とページの辞書で、鍵が重ならない（mergeDicts が投げない）", () => {
    for (const { dict } of Object.values(PAGES)) expect(() => mergeDicts(commonDict, dict)).not.toThrow();
  });
  it("辞書の鍵は、そのページの HTML かコードで使われている", () => {
    for (const [page, { dict, files }] of Object.entries(PAGES)) {
      const text = [...files, "demo/i18n/common.ts"].map(read).join("\n") + (page === "index" ? read("demo/i18n/common.ts") : "");
      const extra = page === "layered-map" ? Object.values(REGION_KEY) : []; // 地方の名前は REGION_KEY 経由で使う
      const used = new Set([...extra, ...[...text.matchAll(/["'`]([\w.-]+?)(\$\{|["'`])/g)].map(m => (m[2] === "${" ? `${m[1]}*` : m[1]))]);
      for (const k of Object.keys(dict.ja)) {
        const hit = used.has(k) || [...used].some(u => u.endsWith("*") && k.startsWith(u.slice(0, -1)));
        expect(hit, `${page}: ${k} が使われていない`).toBe(true);
      }
    }
  });
  it("HTML の data-i18n の鍵は、辞書にある", () => {
    for (const [page, { dict, files }] of Object.entries(PAGES)) {
      const merged = mergeDicts(commonDict, dict);
      const html = new DOMParser().parseFromString(read(files[0]), "text/html");
      const keys = [...html.querySelectorAll("*")].flatMap(el => Object.entries((el as HTMLElement).dataset).filter(([n]) => n.startsWith("i18n")).map(([, v]) => v!));
      expect(keys.length, page).toBeGreaterThan(0);
      for (const k of keys) for (const lang of LANGS) expect(merged[lang][k], `${page}: ${k}`).toBeTruthy();
    }
  });
  it("HTML に、日本語の文言が直書きされていない（コメントは除く）", () => {
    for (const { files } of Object.values(PAGES)) {
      const html = read(files[0]).replace(/<!--[\s\S]*?-->/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
      expect(html).not.toMatch(CJK);
    }
  });
});

describe("英語の用語（横断設計の「2.y 用語」の表。MaplatEditor の用語集に合わせる）", () => {
  it("型の呼び名", () => {
    expect([commonDict.en["type.a"], commonDict.en["type.b"], commonDict.en["type.c"], commonDict.en["type.d"]]).toEqual([
      "CRS only", "TIN + global extrapolation", "TIN + fan extrapolation", "legacy"
    ]);
  });
  it("部品の名前に、表に無い言い換えを使わない。指標は score（fit score と書かない）", () => {
    const text = Object.values({ ...layeredDict.en, ...indexDict.en, ...commonDict.en }).join("\n");
    for (const bad of [/control point/i, /complement(ary)? point/i, /supplementary point/i, /helper vertex/i, /constraint edge/i, /fit score/i, /goodness/i]) {
      expect(text).not.toMatch(bad);
    }
    for (const word of ["GCP", "supplement point", "auxiliary vertic", "extrapolation quadrilateral"]) expect(text).toContain(word);
  });
});

describe("素材の GCP の地方の名前（layered_demo_meta.json の region）", () => {
  it("すべて辞書で訳せる", () => {
    const meta = JSON.parse(read("public/demo-data/layered_demo_meta.json")) as { gcps: Record<string, { region: string }[]> };
    const regions = new Set(Object.values(meta.gcps).flat().map(g => g.region));
    expect(regions.size).toBeGreaterThan(0);
    for (const r of regions) {
      expect(REGION_KEY[r], r).toBeTruthy();
      expect(layeredDict.en[REGION_KEY[r]], r).toBeTruthy();
    }
  });
});

describe("言語の決め方（core.ts）", () => {
  it("?lang=ja|en が最優先", () => {
    expect(detectLang("?lang=en", "ja-JP")).toBe("en");
    expect(detectLang("?lang=ja", "en-US")).toBe("ja");
    expect(detectLang("?demo=1&lang=en", "ja")).toBe("en");
  });
  it("指定が無い・未知なら navigator.language。日本語なら ja、それ以外は en", () => {
    expect(detectLang("", "ja")).toBe("ja");
    expect(detectLang("", "ja-JP")).toBe("ja");
    expect(detectLang("", "en-US")).toBe("en");
    expect(detectLang("", "fr")).toBe("en");
    expect(detectLang("?lang=fr", "ja-JP")).toBe("ja");
    expect(detectLang("?lang=", "de")).toBe("en");
  });
  it("t() は {名前} を置き換え、鍵が無ければ鍵を返す", () => {
    const t = makeTranslate({ ja: { a: "{x} と {y}" }, en: { a: "{x} vs {y}" } }, "en");
    expect(t("a", { x: "P", y: 2 })).toBe("P vs 2");
    const errors: unknown[] = [];
    const orig = console.error;
    console.error = (...a: unknown[]) => { errors.push(a); };
    try { expect(t("none")).toBe("none"); } finally { console.error = orig; }
    expect(errors).toHaveLength(1);
  });
});

describe("画面への適用（core.ts）", () => {
  const dict: Dict = { ja: { "x.t": "題", "x.b": "ボタン", "x.l": "ラベル", "common.lang_label": "表示言語" }, en: { "x.t": "Title", "x.b": "Button", "x.l": "Label", "common.lang_label": "Language" } };
  beforeEach(() => {
    document.title = "";
    document.head.innerHTML = '<title data-i18n="x.t"></title>';
    document.body.innerHTML = '<h1 data-i18n="x.t"></h1><button data-i18n-aria-label="x.l" data-i18n-title="x.l"></button><a id="a" href="./layered-map.html?demo=2">l</a><a id="b" href="https://example.org/x.html">e</a><a id="c" href="#top">h</a><span id="sw"></span>';
    window.history.replaceState(null, "", "/index.html?demo=1");
  });
  it("<html lang>・文字・属性・<title>・ほかのページへのリンクに言語を入れる。外のリンクと # は変えない", () => {
    applyLang(makeTranslate(dict, "en"), "en");
    expect(document.documentElement.lang).toBe("en");
    expect(document.querySelector("h1")!.textContent).toBe("Title");
    expect(document.querySelector("button")!.getAttribute("aria-label")).toBe("Label");
    expect(document.querySelector("button")!.getAttribute("title")).toBe("Label");
    expect(document.title).toBe("Title");
    const a = new URL((document.getElementById("a") as HTMLAnchorElement).getAttribute("href")!);
    expect(a.pathname).toBe("/layered-map.html");
    expect(a.searchParams.get("demo")).toBe("2");
    expect(a.searchParams.get("lang")).toBe("en");
    expect(document.getElementById("b")!.getAttribute("href")).toBe("https://example.org/x.html");
    expect(document.getElementById("c")!.getAttribute("href")).toBe("#top");
  });
  it("「日本語 / English」の切り替えは、今の URL の ?lang= だけを替える。今の言語に aria-current が付く", () => {
    window.history.replaceState(null, "", "/layered-map.html?demo=3&type=b&sup=0&lang=en");
    mountLangSwitch(document.getElementById("sw")!, "en", "Language");
    const links = [...document.querySelectorAll<HTMLAnchorElement>("#sw a")];
    expect(links.map(a => a.textContent)).toEqual(["日本語", "English"]);
    expect(links.map(a => a.getAttribute("aria-current"))).toEqual([null, "true"]);
    const ja = new URL(links[0].href);
    expect([...ja.searchParams.entries()]).toEqual([["demo", "3"], ["type", "b"], ["sup", "0"], ["lang", "ja"]]);
    expect(document.getElementById("sw")!.getAttribute("aria-label")).toBe("Language");
  });
  it("withLang は、既にある ?lang= を置き換える", () => {
    expect(withLang("./index.html?lang=ja", "en", "http://x.test/a/b.html")).toBe("http://x.test/a/index.html?lang=en");
  });
});
