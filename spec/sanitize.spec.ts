// m1-t4 AC2 / AC4 / AC5a / AC5c: サニタイズ層の検証（設計書 §3.2 / §3.5）。
//
// 攻撃ペイロードは spec/fixtures/xss-payloads.ts に集約し、Playwright 側の E2E からも同じものを読む。
// 片方の環境だけで通しても、もう一方の安全性は証明できない（設計書 §3.5(d) / AC5b）。
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { sanitizeHtml, sanitizeIiifHtml, escapeAttr, buildSlideAttrs } from "../src/sanitize";
import ALLOWLIST from "../src/sanitize-allowlist.json";
import {
  MUST_BE_NEUTRALIZED, MUST_BE_PRESERVED, TARGET_BLANK,
  MEDIA_ATTR_ATTACKS, MEDIA_ATTR_PRESERVED, ATTR_ROUNDTRIP_ATTACKS
} from "./fixtures/xss-payloads";
import * as qyPayloads from "./fixtures/xss-payloads";

describe("sanitizeHtml — 攻撃ペイロードの無害化（AC5a / AC5c 異常系）", () => {
  it.each(MUST_BE_NEUTRALIZED)("$name が無害化される", ({ input, mustNotContain }) => {
    const out = sanitizeHtml(input);
    for (const needle of mustNotContain) {
      expect(out.toLowerCase()).not.toContain(needle.toLowerCase());
    }
  });
});

describe("sanitizeHtml — 実データの見た目を壊さない（AC4 / AC5c 正系）", () => {
  it.each(MUST_BE_PRESERVED)("$name が保持される", ({ input, mustContain }) => {
    const out = sanitizeHtml(input);
    for (const needle of mustContain) {
      expect(out).toContain(needle);
    }
  });
});

describe("sanitizeHtml — target=_blank の rel 強制付与（AC6）", () => {
  it("rel=noopener noreferrer が付く", () => {
    const out = sanitizeHtml(TARGET_BLANK.input);
    for (const needle of TARGET_BLANK.mustContain) expect(out).toContain(needle);
  });
});

describe("escapeAttr", () => {
  it("引用符・山括弧・アンパサンドをエスケープする", () => {
    expect(escapeAttr(`x" onerror="alert(1)`)).not.toContain(`"`);
    expect(escapeAttr(`<b>&</b>`)).toBe("&lt;b&gt;&amp;&lt;/b&gt;");
  });
  it("数値・真偽値などの非文字列も安全に文字列化する", () => {
    expect(escapeAttr(123 as unknown as string)).toBe("123");
    expect(escapeAttr(null as unknown as string)).toBe("");
  });
});

describe("buildSlideAttrs — 属性名 allowlist（AC2 / 設計書 §3.4）", () => {
  it.each(MEDIA_ATTR_ATTACKS)("$name が出力に現れない", ({ media, mustNotContain }) => {
    const out = buildSlideAttrs(media);
    for (const needle of mustNotContain) {
      expect(out.toLowerCase()).not.toContain(needle.toLowerCase());
    }
  });

  it("allowlist 内の属性は保持され、false の真偽値属性は出力されない", () => {
    const out = buildSlideAttrs(MEDIA_ATTR_PRESERVED.media);
    for (const needle of MEDIA_ATTR_PRESERVED.mustContain) expect(out).toContain(needle);
    for (const needle of MEDIA_ATTR_PRESERVED.mustNotContain) expect(out).not.toContain(needle);
  });

  it("生成した属性文字列を実際に DOM へ流しても危険な属性が生えない（実経路検証）", () => {
    for (const { media } of MEDIA_ATTR_ATTACKS) {
      const el = document.createElement("div");
      el.innerHTML = `<cc-swiper-slide ${buildSlideAttrs(media)}></cc-swiper-slide>`;
      const slide = el.firstElementChild!;
      const names = slide.getAttributeNames().map(n => n.toLowerCase());
      expect(names.filter(n => n.startsWith("on"))).toHaveLength(0);
      expect(names).not.toContain("style");
      expect(names).not.toContain("srcdoc");
    }
  });

  it("URL 属性は http(s) 以外を落とす", () => {
    const out = buildSlideAttrs({ src: "javascript:alert(1)", type: "image" });
    expect(out).not.toContain("javascript:");
  });
});

describe("属性の往復（設計書 §3.4・受け手が innerHTML へ補間する前提）", () => {
  it.each(ATTR_ROUNDTRIP_ATTACKS)("$name が往復しても HTML にならない", ({ media }) => {
    // 1. 属性文字列を組み立てて DOM へ流す
    const host = document.createElement("div");
    host.innerHTML = `<cc-swiper-slide ${buildSlideAttrs(media)}></cc-swiper-slide>`;
    const slide = host.firstElementChild!;

    // 2. 受け手（cc-swiper.ts:229-241）と同じ経路で読み戻して補間する
    for (const name of ["caption", "thumbnail-url", "image-url"]) {
      const back = slide.getAttribute(name);
      if (back === null) continue;
      const out = document.createElement("div");
      out.innerHTML = `<p class="slider-caption">${back}</p>`;
      // 3. 能動要素が生えないこと（これが往復対策の本体）
      expect(out.querySelectorAll("img, script, svg, iframe")).toHaveLength(0);
      expect(out.innerHTML.toLowerCase()).not.toContain("onerror");
      expect(out.innerHTML.toLowerCase()).not.toContain("onload");
    }
  });

  it("正常な caption はテキストとして保持される", () => {
    const host = document.createElement("div");
    host.innerHTML = `<cc-swiper-slide ${buildSlideAttrs({ caption: "六百遠忌報恩塔" })}></cc-swiper-slide>`;
    expect(host.firstElementChild!.getAttribute("caption")).toBe("六百遠忌報恩塔");
  });
});

// ─────────────────────────────────────────────────────────────
// m1-t9 D2: URL 属性の検査強化（AC5）
//
// 起票元: m1 包括セキュリティレビュー SRH-1（Major）
// 設計書: docs/superpowers/specs/2026-08-01-m1-t9-chuci-template-interpolation-design.md v1.2
//
// なぜ必要か:
//   既存の URL 属性検査は isSafeUrl と /[<>]/ の2つだけで、**クォートを通す**。
//   escapeAttr が " を &quot; にするため属性としては正しく書かれるが、
//   受け手が getAttribute で読み戻すとエンティティが復号されて生の " に戻り、
//   受け手が文字列補間していれば属性ブレイクアウトが成立する。
//
// なぜ受け手側（Chuci の D1）だけで足りないか:
//   @c4h/chuci は独立した公開パッケージであり、利用者が別版を引く期間がある。
//   渡す側でも塞ぐことで版ずれ期間を防御する（多層防御）。
//
// 実データへの影響（AC6・2026-08-01 実測）:
//   github/Maplat の maps 165件・pois 16件と SQLite 実データ（maps 264行 /
//   poi_sources 5行）を全数走査した結果、image-url / thumbnail-url /
//   material-url を持つレコードは **0件**。空白の拒否を含めても実データは壊れない。
describe("buildSlideAttrs — URL 属性の危険文字を拒否する（m1-t9 D2 / AC5）", () => {
  const URL_ATTRS = ["image-url", "thumbnail-url", "material-url"] as const;

  it.each(URL_ATTRS)("%s のダブルクォートを拒否する（属性ブレイクアウトの本体）", attr => {
    const out = buildSlideAttrs({ [attr]: 'x" onmouseover="alert(1)' });
    expect(out).not.toContain(attr);
  });

  // payload にコロンを入れない。コロンがあると既存の isSafeUrl だけで落ちてしまい、
  // 新しい拒否規則を検査したことにならない（是正前でも緑になる空洞化したテストになる）。
  it.each(URL_ATTRS)("%s のシングルクォートを拒否する（CSS の url('…') 用）", attr => {
    const out = buildSlideAttrs({ [attr]: "x') url('y" });
    expect(out).not.toContain(attr);
  });

  it.each(URL_ATTRS)("%s のバッククォートを拒否する", attr => {
    const out = buildSlideAttrs({ [attr]: "x`+alert(1)+`" });
    expect(out).not.toContain(attr);
  });

  it.each(URL_ATTRS)("%s の空白を拒否する", attr => {
    const out = buildSlideAttrs({ [attr]: "x onmouseover=alert(1)" });
    expect(out).not.toContain(attr);
  });

  it("正常な URL は通す（AC4 正系・実データを壊さない）", () => {
    const benign = "https://example.com/path/a%20b.jpg?q=1&r=2";
    const out = buildSlideAttrs({
      "image-url": benign,
      "thumbnail-url": "/relative/path.png",
      "material-url": "sub/dir/model.mtl"
    });
    // 属性が落ちていないこと
    for (const attr of URL_ATTRS) expect(out).toContain(`${attr}=`);
    // 値が欠けていないことは **DOM へ流して読み戻して**確認する。
    // out は escapeAttr 済みなので（& → &amp;）文字列比較では一致しない。
    const host = document.createElement("div");
    host.innerHTML = `<cc-swiper-slide ${out}></cc-swiper-slide>`;
    const slide = host.firstElementChild!;
    expect(slide.getAttribute("image-url")).toBe(benign);
    expect(slide.getAttribute("thumbnail-url")).toBe("/relative/path.png");
    expect(slide.getAttribute("material-url")).toBe("sub/dir/model.mtl");
  });

  it("URL 属性以外（caption）は空白を含んでも従来どおり通る", () => {
    const out = buildSlideAttrs({ caption: "六百遠忌 報恩塔" });
    expect(out).toContain("caption=");
  });
});

// テンプレートの出力に書かれた <qy-swiper>・<qy-swiper-slide> を、POI の media と同じ選別で残す。
const { QY_SLIDE_URL_REJECTED, QY_FORBIDDEN_ATTRS, QY_UNSUPPORTED_ELEMENTS, QY_SLIDE_PARITY_MEDIA } = qyPayloads;
const parseOne = (html: string): Element => {
  const host = document.createElement("div");
  host.innerHTML = html;
  return host.firstElementChild!;
};
const attrMap = (el: Element): Record<string, string> =>
  Object.fromEntries(Array.from(el.attributes).map(a => [a.name, a.value]).sort());
const SLIDE_BOOLEAN = new Set(["fit-to-container", "debug-mode"]);

describe("sanitizeHtml — qy-swiper / qy-swiper-slide を残す", () => {
  it.each(["img/a.jpg", "/t.jpg", "//cdn.example/x.jpg", "https://e.example/a.jpg"])(
    "image-url=%s が残る", url => {
      const el = parseOne(sanitizeHtml(`<qy-swiper-slide image-url="${url}"></qy-swiper-slide>`));
      expect(el.tagName.toLowerCase()).toBe("qy-swiper-slide");
      expect(el.getAttribute("image-url")).toBe(url);
    });

  it("値の属性が残り、真偽値の属性は値 \"\" で残る", () => {
    const el = parseOne(sanitizeHtml(
      `<qy-swiper-slide image-type="image" caption="寺" camera-position="0,0,1" camera-target="0,0,0" ` +
      `show-texture="true" fit-to-container="false" debug-mode="yes"></qy-swiper-slide>`
    ));
    expect(attrMap(el)).toEqual({
      "camera-position": "0,0,1", "camera-target": "0,0,0", caption: "寺",
      "debug-mode": "", "fit-to-container": "", "image-type": "image", "show-texture": "true"
    });
  });

  it("qy-swiper の has-thumb・autoplay が値 \"\" で残り、中の slide も残る", () => {
    const el = parseOne(sanitizeHtml(
      `<qy-swiper has-thumb="yes" autoplay><qy-swiper-slide image-url="a.jpg"></qy-swiper-slide></qy-swiper>`
    ));
    expect(el.tagName.toLowerCase()).toBe("qy-swiper");
    expect(attrMap(el)).toEqual({ autoplay: "", "has-thumb": "" });
    expect(el.firstElementChild!.getAttribute("image-url")).toBe("a.jpg");
  });
});

describe("sanitizeHtml — qy-* で落ちるもの", () => {
  const URL_ATTRS = ["image-url", "thumbnail-url", "material-url"];
  for (const attr of URL_ATTRS) {
    it.each(QY_SLIDE_URL_REJECTED)(`${attr}=%s が落ちる`, bad => {
      const el = parseOne(sanitizeHtml(
        `<qy-swiper-slide image-type="image" ${attr}="${escapeAttr(bad)}"></qy-swiper-slide>`
      ));
      expect(el.hasAttribute(attr)).toBe(false);
      expect(el.getAttribute("image-type")).toBe("image");
    });
  }

  it.each(QY_FORBIDDEN_ATTRS)("qy-swiper・qy-swiper-slide の %s が落ちる", attr => {
    const out = sanitizeHtml(
      `<qy-swiper ${attr}="v"><qy-swiper-slide ${attr}="v" image-url="a.jpg"></qy-swiper-slide></qy-swiper>`
    );
    const el = parseOne(out);
    expect(el.hasAttribute(attr)).toBe(false);
    expect(el.firstElementChild!.hasAttribute(attr)).toBe(false);
    expect(el.firstElementChild!.getAttribute("image-url")).toBe("a.jpg");
  });

  it("qy-swiper の image-url が落ちる", () => {
    const el = parseOne(sanitizeHtml(`<qy-swiper image-url="a.jpg"></qy-swiper>`));
    expect(el.hasAttribute("image-url")).toBe(false);
  });

  it.each(["div", "span", "a", "img"])("%s の上の image-url・caption・has-thumb が落ちる", tag => {
    const out = sanitizeHtml(`<${tag} image-url="a.jpg" caption="c" has-thumb>t</${tag}>`);
    expect(out).not.toContain("image-url");
    expect(out).not.toContain("caption");
    expect(out).not.toContain("has-thumb");
  });

  it.each(QY_UNSUPPORTED_ELEMENTS)("要素 %s は落ち、中の文字は残る", tag => {
    const out = sanitizeHtml(`<${tag} image-url="a.jpg">中身</${tag}>`);
    expect(out).not.toContain(`<${tag}`);
    expect(out).toContain("中身");
  });

  it("mXSS の形の caption（エンティティで書いたもの）は属性ごと落ち、ほかの属性は残る", () => {
    for (const cap of [
      "--&gt;&lt;/qy-swiper-slide&gt;&lt;img src=x onerror=1&gt;",
      "x&lt;/style&gt;&lt;img src=x onerror=1&gt;"
    ]) {
      const out = sanitizeHtml(
        `<qy-swiper-slide image-type="image" image-url="a.jpg" caption="${cap}"></qy-swiper-slide>`
      );
      const el = parseOne(out);
      expect(el.hasAttribute("caption")).toBe(false);
      expect(el.getAttribute("image-type")).toBe("image");
      expect(el.getAttribute("image-url")).toBe("a.jpg");
      expect(out).not.toContain("<img");
    }
  });

  it("属性に生で閉じタグと img を書いても出力に <img が無い", () => {
    const out = sanitizeHtml(`<qy-swiper-slide caption="</qy-swiper-slide><img src=x onerror=1>"></qy-swiper-slide>`);
    expect(out).not.toContain("<img");
    expect(parseOne(out).getAttribute("caption")).toBe("");
  });
});

describe("sanitizeHtml — qy-swiper-slide の caption のテキスト化", () => {
  it("エンティティで書いた HTML がテキストになる", () => {
    expect(sanitizeHtml(`<qy-swiper-slide caption="&lt;i&gt;x&lt;/i&gt;"></qy-swiper-slide>`))
      .toBe(`<qy-swiper-slide caption="x"></qy-swiper-slide>`);
  });

  it("属性の中の生の < がテキストになる", () => {
    expect(sanitizeHtml(`<qy-swiper-slide caption="<b>寺</b>"></qy-swiper-slide>`))
      .toBe(`<qy-swiper-slide caption="寺"></qy-swiper-slide>`);
  });
});

describe("sanitizeHtml — caption のテキスト化が外側の sanitize に再入しない", () => {
  it("slide の後ろの通常のタグと属性が残り、続く呼び出しの結果も変わらない", () => {
    expect(sanitizeHtml(
      `<qy-swiper-slide caption="&lt;i&gt;x&lt;/i&gt;"></qy-swiper-slide><p title="t"><b>bold</b></p>`
    )).toBe(`<qy-swiper-slide caption="x"></qy-swiper-slide><p title="t"><b>bold</b></p>`);
    expect(sanitizeHtml(`<p title="t"><b>x</b><script>1</script></p>`)).toBe(`<p title="t"><b>x</b></p>`);
  });
});

describe("qy-swiper-slide — media の経路とテンプレートの経路の属性が一致する", () => {
  const templateAttrs = (media: Record<string, unknown>): string =>
    Object.entries(media).map(([k, v]) => {
      if (SLIDE_BOOLEAN.has(k)) return v ? k : "";
      return `${k}="${escapeAttr(String(v))}"`;
    }).filter(Boolean).join(" ");

  it.each(QY_SLIDE_PARITY_MEDIA.map((media, i) => ({ i, media })))("media #$i", ({ media }) => {
    const viaMedia = parseOne(`<qy-swiper-slide ${buildSlideAttrs(media)}></qy-swiper-slide>`);
    const viaTemplate = parseOne(sanitizeHtml(`<qy-swiper-slide ${templateAttrs(media)}></qy-swiper-slide>`));
    expect(attrMap(viaTemplate)).toEqual(attrMap(viaMedia));
  });

  it("引用符と & を含む caption が同じ値に戻る", () => {
    const values = QY_SLIDE_PARITY_MEDIA.slice(-3).map(m =>
      parseOne(sanitizeHtml(`<qy-swiper-slide ${templateAttrs(m)}></qy-swiper-slide>`)).getAttribute("caption"));
    expect(values).toEqual([`A "B" & C`, "it's &", "x < y"]);
  });
});

// ─────────────────────────────────────────────────────────────
// IIIF の書誌の値のサニタイズ（`profile: "iiif"` と `sanitizeIiifHtml`）
//
// なぜ既定とは別の許可表が要るか:
//   POI の説明文は実データの見た目を保つため既定の許可表が広い（img・div・table まで通す）。
//   IIIF の Manifest から写す書誌は外部のサーバーが決める値で、地図の作者が中身を
//   確かめていない。見出し・強調・改行・リンクだけに絞った許可表を通す。
//
// 何を測るか:
//   残るタグ・残る属性・残る URL の種類だけを測る。落としたタグの中の文字は残してよい
//   （KEEP_CONTENT）ので、文字そのものでは判定しない。
interface IiifSanitizer {
  label: string;
  sanitize: (dirty: string) => string;
}

const IIIF_SANITIZERS: IiifSanitizer[] = [
  {
    label: 'sanitizeHtml(dirty, { profile: "iiif" })',
    sanitize: dirty => sanitizeHtml(dirty, { profile: "iiif" })
  },
  { label: "sanitizeIiifHtml(dirty)", sanitize: dirty => sanitizeIiifHtml(dirty) }
];

/** IIIF の値で残してよいタグ（見出し・強調・改行・リンク）。 */
const IIIF_ALLOWED_TAGS = ["a", "b", "br", "i", "p", "small", "span", "sub", "sup"];

const TAG_NAME_RE = /<\s*\/?\s*([a-zA-Z][a-zA-Z0-9-]*)/g;

/** HTML に現れるタグ名（小文字・重複なし）。 */
const tagsIn = (html: string): string[] =>
  Array.from(new Set(Array.from(html.matchAll(TAG_NAME_RE), m => m[1].toLowerCase())));

/** HTML を 1 つの要素として読み込み、属性名の一覧（昇順）を返す。 */
const attrNamesOf = (html: string): string[] => {
  const host = document.createElement("div");
  host.innerHTML = html;
  const el = host.firstElementChild!;
  return Array.from(el.attributes, a => a.name.toLowerCase()).sort();
};

/** HTML を 1 つの要素として読み込む。 */
const parseFirst = (html: string): Element => {
  const host = document.createElement("div");
  host.innerHTML = html;
  return host.firstElementChild!;
};

describe('sanitizeHtml — profile: "iiif" と sanitizeIiifHtml（IIIF の書誌の値）', () => {
  describe.each(IIIF_SANITIZERS)("$label", ({ sanitize }) => {
    it.each(MUST_BE_NEUTRALIZED)("$name: 許可するタグ以外は残らない", ({ input }) => {
      const out = sanitize(input);
      expect(tagsIn(out).filter(tag => !IIIF_ALLOWED_TAGS.includes(tag))).toEqual([]);
    });

    it.each(MUST_BE_NEUTRALIZED)("$name: on* の属性と危険な URL は残らない", ({ input }) => {
      const out = sanitize(input);
      expect(out).not.toMatch(/\son[a-z]+\s*=/i);
      const lower = out.toLowerCase();
      for (const scheme of ["javascript:", "vbscript:", "data:"]) expect(lower).not.toContain(scheme);
    });

    it("img は src ごと残らない", () => {
      const out = sanitize(`<img src="https://example.com/a.png" alt="説明">`);
      expect(out).not.toMatch(/<img/i);
      expect(out).not.toMatch(/src=/i);
    });

    it("div は残らず、中の文字は残る", () => {
      const out = sanitize(`<div>中身<div>入れ子</div></div>`);
      expect(out).not.toMatch(/<div/i);
      expect(out).toContain("中身");
      expect(out).toContain("入れ子");
    });

    it("table 系は残らず、中の文字は残る", () => {
      const out = sanitize(
        "<table><thead><tr><th>見出し</th></tr></thead><tbody><tr><td>値</td></tr></tbody></table>"
      );
      for (const tag of ["table", "thead", "tbody", "tr", "th", "td"]) {
        expect(out).not.toMatch(new RegExp(`<${tag}`, "i"));
      }
      expect(out).toContain("見出し");
      expect(out).toContain("値");
    });

    it.each([
      "javascript:alert(1)",
      "vbscript:msgbox(1)",
      "mailto:example@example.com",
      "tel:+81-25-000-0000",
      "data:text/html,<script>alert(1)</script>"
    ])("a の href=%s は落ちる", href => {
      const out = sanitize(`<a href="${href}">リンク</a>`);
      expect(out).not.toMatch(/href=/i);
      expect(out).not.toMatch(/\son[a-z]+\s*=/i);
      expect(out).toContain("リンク");
    });

    it.each(["https://example.com/x", "http://example.com/x?a=1&b=2"])(
      "a の href=%s は残り target=_blank と rel が付く",
      href => {
        const out = sanitize(`<a href="${href}">詳細</a>`);
        expect(attrNamesOf(out)).toEqual(["href", "rel", "target"]);
        const el = parseFirst(out);
        expect(el.tagName.toLowerCase()).toBe("a");
        expect(el.getAttribute("href")).toBe(href);
        expect(el.getAttribute("target")).toBe("_blank");
        expect(el.getAttribute("rel")).toBe("noopener noreferrer");
        expect(el.textContent).toBe("詳細");
      }
    );

    it("許可するタグは残る", () => {
      const out = sanitize(
        "<p><b>太字</b><i>斜体</i><small>小さい字</small><span>範囲</span>" +
          "<sub>下付き</sub><sup>上付き</sup><br>改行" +
          '<a href="https://example.com/x">リンク</a></p>'
      );
      const tags = tagsIn(out);
      for (const tag of IIIF_ALLOWED_TAGS) expect(tags).toContain(tag);
      for (const text of ["太字", "斜体", "小さい字", "範囲", "下付き", "上付き", "改行"]) {
        expect(out).toContain(text);
      }
    });

    it("href 以外の属性（class・style・title・id・on*）は落ちる", () => {
      const out = sanitize(
        '<a href="https://example.com/x" class="c" style="color:red" title="t" id="i" ' +
          'onclick="alert(1)">リンク</a>'
      );
      expect(attrNamesOf(out)).toEqual(["href", "rel", "target"]);
      const el = parseFirst(out);
      for (const name of ["class", "style", "title", "id", "onclick"]) {
        expect(el.hasAttribute(name)).toBe(false);
      }
    });

    it("span・p の class・style も落ちる", () => {
      const out = sanitize(`<p class="c" style="color:red"><span class="d">文字</span></p>`);
      expect(out).not.toMatch(/\sclass=/i);
      expect(out).not.toMatch(/\sstyle=/i);
      expect(out).toContain("文字");
    });
  });

  it("2 つの入口は同じ結果を返す", () => {
    const samples = [
      ...MUST_BE_NEUTRALIZED.map(p => p.input),
      ...MUST_BE_PRESERVED.map(p => p.input),
      `<a href="https://example.com/x">詳細</a>`,
      `<div>中身</div>`,
      `<table><tr><td>値</td></tr></table>`
    ];
    for (const sample of samples) {
      expect(sanitizeIiifHtml(sample)).toBe(sanitizeHtml(sample, { profile: "iiif" }));
    }
  });
});

describe("sanitizeHtml — 既定の挙動（引数なし）は変わらない", () => {
  it("img・div・table は今どおり残る", () => {
    const img = sanitizeHtml(`<img src="https://example.com/a.png" alt="説明">`);
    expect(img).toContain("<img");
    expect(img).toContain(`src="https://example.com/a.png"`);
    expect(sanitizeHtml("<div>中身</div>")).toContain("<div>中身</div>");
    const table = sanitizeHtml("<table><tr><td>値</td></tr></table>");
    expect(table).toContain("<table");
    expect(table).toContain("<td>値</td>");
  });

  it("a に target・rel を勝手に付けない", () => {
    const out = sanitizeHtml(`<a href="https://example.com/x">詳細</a>`);
    expect(out).toContain(`href="https://example.com/x"`);
    expect(out).not.toMatch(/target=/i);
    expect(out).not.toMatch(/rel=/i);
  });

  it("class と mailto: の href は今どおり残る", () => {
    const out = sanitizeHtml(`<a href="mailto:example@example.com" class="c">連絡</a>`);
    expect(out).toContain("mailto:example@example.com");
    expect(out).toContain(`class="c"`);
  });
});

// ─────────────────────────────────────────────────────────────
// IIIF の許可表の「中の文字も捨てる要素」の一覧が、DOMPurify の既定と揃っているか
//
// なぜ測るか:
//   この一覧は DOMPurify の既定（DEFAULT_FORBID_CONTENTS）から thead を外した写しである。
//   DOMPurify の版が上がって既定に要素が増えても、写した側は黙って古いままになる。
//   手元の DOMPurify の定義と突き合わせて、ずれたら赤にする。
describe("sanitize-allowlist の IIIF の forbidContents は DOMPurify の既定と揃っている", () => {
  const require = createRequire(import.meta.url);

  /** DOMPurify の dist（ESM 版）のパス。node_modules の位置は require.resolve から解く。 */
  const purifierPath = (): string => join(dirname(require.resolve("dompurify")), "purify.es.mjs");

  /** dist のテキストから DEFAULT_FORBID_CONTENTS の配列を取り出す。取り出せなければ例外にする。 */
  const defaultForbidContents = (): string[] => {
    const text = readFileSync(purifierPath(), "utf-8");
    const definition = text.match(
      /DEFAULT_FORBID_CONTENTS\s*=\s*addToSet\(\s*\{\s*\}\s*,\s*\[([\s\S]*?)\]\s*\)/
    );
    if (!definition) {
      throw new Error("DOMPurify の DEFAULT_FORBID_CONTENTS を取り出せませんでした");
    }
    return Array.from(definition[1].matchAll(/"([^"]+)"/g), match => match[1]);
  };

  it("iiif.forbidContents.tags は既定から thead だけを除いた集合", () => {
    const defaults = defaultForbidContents();
    expect(defaults.length).toBeGreaterThan(0);
    expect(defaults).toContain("thead");
    expect([...ALLOWLIST.iiif.forbidContents.tags].sort()).toEqual(
      defaults.filter(tag => tag !== "thead").sort()
    );
  });
});
