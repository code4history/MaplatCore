import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { commonDict } from "../demo/i18n/common";
import { dict as indexDict } from "../demo/i18n/index-page";

// デモの目次（ルートの index.html）。目次のリンク先がすべて実在することと、各デモのページから目次へ戻れることを守る。
// 古地図のデモは old-map.html、変換の形のデモは layered-map.html?demo=1〜5（?type=・?sup=で状態を指定）。
// 文言は辞書（demo/i18n/index-page.ts・common.ts）にあり、HTML は data-i18n の鍵だけを持つ。言語の試験は spec/demo-i18n.spec.ts
const parse = (file: string): Document => new DOMParser().parseFromString(readFileSync(file, "utf-8"), "text/html");
const index = parse("index.html");
const meta = JSON.parse(readFileSync("public/demo-data/layered_demo_meta.json", "utf-8")) as {
  demos: Record<string, { types: string[]; supplementTypes?: string[] }>;
};
const links = (): { href: string; key: string | undefined; url: URL }[] =>
  [...index.querySelectorAll("a[href]")].map(a => {
    const href = a.getAttribute("href")!;
    return { href, key: (a as HTMLElement).dataset.i18n, url: new URL(href, "http://demo.test/") };
  });
const layeredLinks = () => links().filter(l => l.url.pathname === "/layered-map.html");

describe("デモの目次（index.html）", () => {
  it("リンクはすべて相対で、リンク先のファイルが実在する", () => {
    expect(links().length).toBeGreaterThan(0);
    for (const l of links()) {
      expect(l.href, l.href).toMatch(/^\.\//);
      expect(existsSync(l.url.pathname.slice(1)), l.href).toBe(true);
    }
  });

  it("古地図のデモ（old-map.html）へのリンクがある", () => {
    expect(links().some(l => l.url.pathname === "/old-map.html")).toBe(true);
  });

  it("変換の形のデモ 1〜5 のすべてに、?demo= で飛べる。meta にあるデモと過不足がない", () => {
    const demos = new Set(layeredLinks().map(l => l.url.searchParams.get("demo")));
    expect([...demos].sort()).toEqual(Object.keys(meta.demos).sort());
    expect(Object.keys(meta.demos)).toEqual(["1", "2", "3", "4", "5"]);
  });

  it("?type= は、そのデモの型にある。?sup= は 0 か 1 で、補完点の切り替えがあるデモにだけ付く", () => {
    for (const l of layeredLinks()) {
      const demo = meta.demos[l.url.searchParams.get("demo")!];
      expect(demo, l.href).toBeTruthy();
      const type = l.url.searchParams.get("type");
      if (type !== null) expect(demo.types, l.href).toContain(type);
      const sup = l.url.searchParams.get("sup");
      if (sup !== null) {
        expect(["0", "1"], l.href).toContain(sup);
        expect(demo.supplementTypes?.length ?? 0, l.href).toBeGreaterThan(0);
        // 切り替えが効く型で開く（効かない型では、あり／なしで画面が変わらない）
        expect(demo.supplementTypes, l.href).toContain(type);
      }
    }
  });

  it("補完点の切り替えがあるデモ（meta の supplementTypes を持つもの）は「補完点あり」「補完点なし」へ直接飛べる。無いデモには付けない", () => {
    expect([indexDict.ja["ix.sup_on"], indexDict.ja["ix.sup_off"]]).toEqual(["補完点あり", "補完点なし"]);
    for (const [no, demo] of Object.entries(meta.demos)) {
      const mine = layeredLinks().filter(l => l.url.searchParams.get("demo") === no);
      const on = mine.filter(l => l.url.searchParams.get("sup") === "1" && l.key === "ix.sup_on");
      const off = mine.filter(l => l.url.searchParams.get("sup") === "0" && l.key === "ix.sup_off");
      const has = (demo.supplementTypes?.length ?? 0) > 0;
      expect([no, on.length, off.length]).toEqual([no, has ? 1 : 0, has ? 1 : 0]);
    }
  });

  it("デモごとの札に、比べる 2 つの型（meta の types の順）と、1 行の説明がある。説明の書き方は ja・en とも辞書で守る", () => {
    for (const [no, demo] of Object.entries(meta.demos)) {
      const card = index.getElementById(`demo-${no}`);
      expect(card, `demo-${no}`).toBeTruthy();
      expect(card!.querySelector("h3 a")!.getAttribute("data-pair"), no).toBe(demo.types.join(","));
      expect((card!.querySelector(".c4h-card-body p") as HTMLElement).dataset.i18n, no).toBe(`ix.desc.${no}`);
      // 型の呼び名は、辞書の型の呼び名で組まれる
      for (const t of demo.types) expect(commonDict.ja[`type.${t}`], t).toBeTruthy();
      // 説明の書き方: ＝や→でつながず、かっこに説明を詰めない
      expect(indexDict.ja[`ix.desc.${no}`], no).not.toMatch(/[＝=→（）()]/);
      expect(indexDict.en[`ix.desc.${no}`], no).not.toMatch(/[＝=→（）]/);
    }
  });

  it("画面は幅 1,130 画素でも崩れないよう、札を auto-fill の格子に並べ、横の固定幅を持たない", () => {
    const style = index.querySelector("style")!.textContent!;
    expect(style).toMatch(/grid-template-columns:\s*repeat\(auto-fill,\s*minmax\(min\(100%,\s*\d+px\),\s*1fr\)\)/);
    expect(style).not.toMatch(/(?<![-\w])width:\s*\d+px/);
    expect(index.querySelector('meta[name="viewport"]')).toBeTruthy();
  });

  it("外部の URL を取りに行かない（オフラインでも開ける）", () => {
    expect(readFileSync("index.html", "utf-8")).not.toMatch(/https?:\/\//);
  });
});

describe("各デモのページから目次へ戻れる", () => {
  for (const file of ["old-map.html", "layered-map.html"]) {
    it(`${file} の見出しに「← 目次」のリンクがある`, () => {
      const back = parse(file).querySelector("header a.c4h-back-link");
      expect(back?.getAttribute("href")).toBe("./index.html");
      expect((back as HTMLElement | null)?.dataset.i18n).toBe("common.back_to_index");
      expect(commonDict.ja["common.back_to_index"]).toBe("← 目次");
    });
  }
});

describe("デモの build の入力（vite.config.ts）", () => {
  it("目次・古地図のデモ・変換の形のデモの 3 ページが入っている", () => {
    const config = readFileSync("vite.config.ts", "utf-8");
    for (const file of ["index.html", "old-map.html", "layered-map.html"]) {
      expect(existsSync(file), file).toBe(true);
      expect(config, file).toContain(`resolve(__dirname, "${file}")`);
    }
  });
});
