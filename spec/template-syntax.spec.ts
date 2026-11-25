import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  createIconSet,
  createHtmlFromTemplate,
  isLegacyTemplate,
  resetTemplateWarnings
} from "../src/template_works";
import legacyInput from "./input/temtest-legacy.json";

// poiTemplate・iconTemplate の記法（Nunjucks）と、旧い記法（lodash.template）の扱い（#93）。
// 旧い記法 = raw・verbatim の中を除いた文字列に <%…%> または ${…} がある（判定の後は評価しない）。

const render = (poiTemplate: string, data: Record<string, unknown> = {}) =>
  createHtmlFromTemplate({ ...data }, { poiTemplate }).html;

let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  resetTemplateWarnings();
  warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
});
afterEach(() => {
  warn.mockRestore();
  resetTemplateWarnings();
});

describe("旧い記法の判定と描画（対応表の 12 例）", () => {
  const data = { name: "N", price: 1, note: "z", desc: "D" };

  it("新しい記法 2 例: 判定は新しい・Nunjucks で評価される", () => {
    expect(isLegacyTemplate("{{ name }}")).toBe(false);
    expect(render("{{ name }}", { name: "<b>N</b>" })).toBe("&lt;b&gt;N&lt;/b&gt;");
    const icon = '{"icon": {{ url | dump | safe }}}';
    expect(isLegacyTemplate(icon)).toBe(false);
    expect(createIconSet({ url: 'a&b"c' }, { iconTemplate: icon }).icon).toBe('a&b"c');
  });

  it.each([
    ["<div><%- desc %></div>"],
    ["<b>${name}</b>"],
    ["<p>{{ price }} 円・${note}</p>"],
    ["{{注}} ${name}"]
  ])("旧い記法 4 例: %s は旧い・評価しない", src => {
    expect(isLegacyTemplate(src)).toBe(true);
    expect(render(src, data)).toBeUndefined();
  });

  it("%> の無い <% は旧い記法に当たらない（Nunjucks で文字のまま）", () => {
    const src = "<p>5 <% 未満</p>";
    expect(isLegacyTemplate(src)).toBe(false);
    expect(render(src, data)).toBe(src);
  });

  it.each([
    ["<p>50<% 割引、上限 100%></p>"],
    ["<p>料金は ${price} です</p>"],
    ["{# <%= a %> #}"],
    ['{{ "<%= a %>" }}']
  ])("誤検出 4 例: %s は旧い記法と判定され評価されない", src => {
    expect(isLegacyTemplate(src)).toBe(true);
    expect(render(src, data)).toBeUndefined();
  });

  it("取りこぼし 1 例: lodash の記法を含まず {{ }} を文字として書いた旧テンプレートは Nunjucks として評価される", () => {
    const src = "<p>書き方の例: {{ name }}</p>";
    expect(isLegacyTemplate(src)).toBe(false);
    expect(render(src, data)).toBe("<p>書き方の例: N</p>");
  });
});

describe("raw・verbatim の逃げ道", () => {
  it.each([
    ["{% raw %}<p>50<% 割引、上限 100%></p>{% endraw %}", "<p>50<% 割引、上限 100%></p>"],
    ["{% raw %}<p>料金は ${price} です</p>{% endraw %}", "<p>料金は ${price} です</p>"],
    ["{% verbatim %}${price}{% endverbatim %}", "${price}"],
    ["{%- raw %}<%x%>{% endraw %}", "<%x%>"],
    ["{% raw -%}<%x%>{% endraw %}", "<%x%>"],
    ["{%raw%}${a}{%endraw%}", "${a}"],
    ["<p>{{ name }}: {% raw %}<%= name %>{% endraw %}</p>", "<p>N: <%= name %></p>"]
  ])("%s は旧い記法に当たらず文字のまま出る", (src, out) => {
    expect(isLegacyTemplate(src)).toBe(false);
    expect(render(src, { name: "N", price: 1 })).toBe(out);
  });

  it("raw の外に旧い記法があれば旧い記法", () => {
    expect(isLegacyTemplate("{% raw %}<%x%>{% endraw %}<%= y %>")).toBe(true);
  });
});

describe("警告はページで 1 回（鍵ごと）", () => {
  it("旧い記法を 3 つ評価しても 1 回・書き誤りを 2 つ評価すると別の文面で 1 回・reset の後はまた 1 回", () => {
    createHtmlFromTemplate({ a: 1 }, { poiTemplate: "<%= a %>" });
    createHtmlFromTemplate({ a: 1 }, { poiTemplate: "<b>${a}</b>" });
    createIconSet({ a: 1 }, { iconTemplate: '{"icon": "<%= a %>"}' });
    expect(warn).toHaveBeenCalledTimes(1);
    const legacyMessage = String(warn.mock.calls[0][0]);
    expect(legacyMessage).toContain("lodash.template syntax");
    expect(legacyMessage).toContain('First template found (poiTemplate): "<%= a %>"');

    createHtmlFromTemplate({ a: 1 }, { poiTemplate: "{{ a }" });
    createIconSet({ a: 1 }, { iconTemplate: '{"icon": {{ a }}' });
    expect(warn).toHaveBeenCalledTimes(2);
    const renderMessage = String(warn.mock.calls[1][0]);
    expect(renderMessage).toContain("failed to render and was ignored");
    expect(renderMessage).toContain('First template: "{{ a }"');
    expect(renderMessage).not.toContain("lodash.template syntax");

    resetTemplateWarnings();
    createIconSet({ a: 1 }, { iconTemplate: '{"icon": "<%= a %>"}' });
    expect(warn).toHaveBeenCalledTimes(3);
    expect(String(warn.mock.calls[2][0])).toContain('First template found (iconTemplate): "{"icon": "<%= a %>"}"');
  });

  it("警告にはテンプレートの先頭 80 文字だけが入る", () => {
    const head = `<%= a %>${"x".repeat(72)}`;
    expect(head.length).toBe(80);
    createHtmlFromTemplate({ a: 1 }, { poiTemplate: `${head}${"Y".repeat(30)}` });
    const message = String(warn.mock.calls[0][0]);
    expect(message).toContain(`"${head}"`);
    expect(message).not.toContain("Y");
  });

  it("評価の例外の警告は改行を含まない 1 行の文面になる", () => {
    createHtmlFromTemplate({}, { poiTemplate: "{% if %}" });
    expect(warn).toHaveBeenCalledTimes(1);
    const message = String(warn.mock.calls[0][0]);
    expect(message).toMatch(/^MaplatApp: a poiTemplate\/iconTemplate failed to render and was ignored: [^\n]+\. First template: "\{% if %\}"\.$/);
  });

  it("Nunjucks の複数行の例外は 1 行にまとめて理由まで入れる", () => {
    createHtmlFromTemplate({}, { poiTemplate: "<b>{{ name }</b>" });
    const message = String(warn.mock.calls[0][0]);
    expect(message).not.toContain("\n");
    expect(message).toMatch(/\[Line 1, Column \d+\] expected variable end\. First template:/);
  });
});

describe("評価できないテンプレートは無いものとみなして次の段へ", () => {
  it.each([
    ['{"icon": {{ a }}'],
    ["1"],
    ["null"],
    ["[1]"],
    ["{{ a }"],
    ['{"icon": "<%= a %>"}']
  ])("iconTemplate %s: 例外を投げず、同じ段の icon を使う", iconTemplate => {
    const ancestors = [{ iconTemplate, icon: "same", selectedIcon: "same_s" }, { icon: "next", selectedIcon: "next_s" }];
    expect(() => createIconSet({ a: 1 }, ...ancestors)).not.toThrow();
    const out = createIconSet({ a: 1 }, ...ancestors);
    expect(out.icon).toBe("same");
    expect(out.selectedIcon).toBe("same_s");
  });

  it.each([['{"icon": {{ a }}'], ["1"], ["null"], ["[1]"], ["{{ a }"]])(
    "iconTemplate %s: 同じ段に icon が無ければ次の段へ進む",
    iconTemplate => {
      const out = createIconSet({ a: 1 }, { iconTemplate }, { icon: "next", selectedIcon: "next_s" });
      expect(out.icon).toBe("next");
      expect(out.selectedIcon).toBe("next_s");
    }
  );

  it.each([["{{ a }"], ["{% if %}"], ["<%= a %>"]])(
    "poiTemplate %s: 例外を投げず、同じ段の poiStyle も使わず次の段へ進む",
    poiTemplate => {
      const out = createHtmlFromTemplate(
        { a: 1 },
        { poiTemplate, poiStyle: "bad" },
        { poiTemplate: "<p>{{ a }}</p>", poiStyle: "good" }
      );
      expect(out.html).toBe("<p>1</p>");
      expect(out.poiStyle).toBe("good");
    }
  );

  it.each([[false], [""], [undefined]])("テンプレートが偽（%s）なら評価しない", tpl => {
    const out = createHtmlFromTemplate({ a: 1 }, { poiTemplate: tpl }, { poiTemplate: "<i>{{ a }}</i>" });
    expect(out.html).toBe("<i>1</i>");
    expect(warn).not.toHaveBeenCalled();
  });

  legacyInput.cases.forEach(testCase => {
    it(`${testCase.title} (Icon)`, () => {
      const out = createIconSet(Object.assign({}, testCase.data), ...testCase.ancestors);
      expect(JSON.parse(JSON.stringify(out))).toEqual(testCase.expectIcon);
    });
    it(`${testCase.title} (POI)`, () => {
      const out = createHtmlFromTemplate(Object.assign({}, testCase.data), ...testCase.ancestors);
      expect(JSON.parse(JSON.stringify(out))).toEqual(testCase.expectPoi);
    });
  });
});

describe("旧い記法の注入", () => {
  it("lodash 用の ${…} の注入は評価されない", () => {
    const w = window as unknown as Record<string, unknown>;
    delete w.__legacyInjected;
    render("${Reflect.set(window,/__legacyInjected/.source,1)}");
    expect(w.__legacyInjected).toBeUndefined();
  });
});

// 旧い記法の判定は入力の長さに比例する時間で終わる（SR-DEC26-B1-3）。
describe("旧い記法の判定の計算量と、判定の結果が元の正規表現と同じであること", () => {
  // 判定の定義（1.3.0 の最初の実装）。結果の基準としてだけ使う
  const REF_RAW = /\{%-?\s*(raw|verbatim)\s*-?%\}[\s\S]*?\{%-?\s*end\1\s*-?%\}/g;
  const reference = (src: string): boolean => {
    const stripped = src.replace(REF_RAW, "");
    return /<%[\s\S]*?%>/.test(stripped) || /\$\{[^}]*\}/.test(stripped);
  };

  const SIZE = 400_000;
  const fill = (unit: string): string => unit.repeat(Math.ceil(SIZE / unit.length));

  it.each([
    ["閉じの無い raw の繰り返し", fill("{% raw %}"), false],
    ["閉じの無い verbatim と raw の混在", fill("{%- verbatim -%}{% raw %}"), false],
    ["閉じる側だけの繰り返し", fill("{% endraw %}"), false],
    ["閉じの無い ${ の繰り返し", fill("${"), false],
    ["閉じの無い <% の繰り返し", fill("<%"), false],
    ["閉じた raw の繰り返し", fill("{% raw %}<%x%>{% endraw %}"), false],
    ["長い空白を挟んだ開き", `{%${" ".repeat(SIZE)}raw %}`, false],
    ["閉じの無い raw の列の後ろに旧い記法", `${fill("{% raw %}")}<%= a %>`, true]
  ])("%s（40 万字）が 1.5 秒以内に終わる", (_name, src, expected) => {
    const t0 = performance.now();
    const result = isLegacyTemplate(src);
    const elapsed = performance.now() - t0;
    expect(result).toBe(expected);
    expect(elapsed).toBeLessThan(1500);
  });

  const PARTS = [
    "{% raw %}", "{%- raw -%}", "{% endraw %}", "{%endraw-%}", "{% verbatim %}", "{% endverbatim %}",
    "<%", "%>", "${", "}", "{%", "%}", "<", "$", "x", " "
  ];

  it("部品の組み合わせ（長さ 1〜4 の全数）で、元の正規表現と同じ結果になる", () => {
    let checked = 0;
    const walk = (prefix: string, depth: number): void => {
      if (depth > 0) {
        if (isLegacyTemplate(prefix) !== reference(prefix)) expect.fail(`結果が違う: ${JSON.stringify(prefix)}`);
        checked++;
      }
      if (depth === 4) return;
      for (const p of PARTS) walk(prefix + p, depth + 1);
    };
    walk("", 0);
    expect(checked).toBe(16 + 16 ** 2 + 16 ** 3 + 16 ** 4);
  }, 60_000);

  it("部品を 5〜14 個並べた列（決まった種の乱数で 3 万本）で、元の正規表現と同じ結果になる", () => {
    // 再現できるように、種を固定した線形合同法で選ぶ
    let seed = 20261125;
    const next = (n: number): number => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed % n;
    };
    for (let k = 0; k < 30_000; k++) {
      let src = "";
      for (let n = 5 + next(10); n > 0; n--) src += PARTS[next(PARTS.length)];
      if (isLegacyTemplate(src) !== reference(src)) expect.fail(`結果が違う: ${JSON.stringify(src)}`);
    }
  }, 60_000);
});
