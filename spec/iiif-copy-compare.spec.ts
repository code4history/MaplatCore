// IIIF から写した値（copiedValues）と、今の地図の値・取り直した値を比べる関数の検査。
//
// 判定は「今の値 vs 写した時点の値」で人が直したかを見て、「写した時点の値 vs 取り直した値」で
// IIIF の側が変わったかを見る。今の IIIF の値と今の値は直接比べない（直したのか、IIIF が
// 変わったのかを取り違えないため）。取り直した値が無いとき（写し直さずに別の形式へ移すとき）は
// IIIF の側が変わったかは判定しない（undefined）。
import { describe, expect, it } from "vitest";
import { compareIiifCopy } from "../src/iiif/manifest";

type Row = {
  key: string;
  lang: string;
  humanEdited: boolean;
  iiifChanged: boolean | undefined;
};

function pick(rows: Row[], key: string, lang: string): Row {
  const found = rows.find((row) => row.key === key && row.lang === lang);
  if (!found) throw new Error(`${key} / ${lang} の行がありません`);
  return found;
}

// 4 通り（直していない・人が直した・IIIF の側が変わった・両方）の表。
// copied は写した時点の値、current は今の地図の値、fresh は取り直した値。
const CASES = [
  {
    name: "直していない",
    copied: "新潟市圖",
    current: "新潟市圖",
    fresh: "新潟市圖",
    humanEdited: false,
    iiifChanged: false,
  },
  {
    name: "人が直した",
    copied: "新潟市圖",
    current: "新潟市圖（改）",
    fresh: "新潟市圖",
    humanEdited: true,
    iiifChanged: false,
  },
  {
    name: "IIIF の側が変わった",
    copied: "新潟市圖",
    current: "新潟市圖",
    fresh: "新潟市圖（第二版）",
    humanEdited: false,
    iiifChanged: true,
  },
  {
    name: "両方変わった",
    copied: "新潟市圖",
    current: "新潟市圖（改）",
    fresh: "新潟市圖（第二版）",
    humanEdited: true,
    iiifChanged: true,
  },
] as const;

describe("compareIiifCopy — 今の値が文字列のとき（lang の値として比べる）", () => {
  it.each(CASES)("$name", ({ copied, current, fresh, humanEdited, iiifChanged }) => {
    const rows = compareIiifCopy(
      { title: current },
      { title: { ja: copied } },
      { title: { ja: fresh } },
      "ja",
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual({ key: "title", lang: "ja", humanEdited, iiifChanged });
  });

  it("多言語でない鍵（license）も文字列を lang の値として比べる", () => {
    const rows = compareIiifCopy(
      { license: "Custom", licenseNote: "https://example.org/license" },
      { license: { ja: "Custom" }, licenseNote: { ja: "https://example.org/license" } },
      { license: { ja: "Custom" }, licenseNote: { ja: "https://example.org/license" } },
      "ja",
    );

    expect(rows).toHaveLength(2);
    expect(pick(rows, "license", "ja")).toEqual({
      key: "license",
      lang: "ja",
      humanEdited: false,
      iiifChanged: false,
    });
    expect(pick(rows, "licenseNote", "ja")).toEqual({
      key: "licenseNote",
      lang: "ja",
      humanEdited: false,
      iiifChanged: false,
    });
  });
});

describe("compareIiifCopy — 今の値が言語の表のとき（言語ごとに 1 行）", () => {
  it.each(CASES)("$name", ({ copied, current, fresh, humanEdited, iiifChanged }) => {
    const rows = compareIiifCopy(
      { title: { ja: current, en: copied } },
      { title: { ja: copied, en: copied } },
      { title: { ja: fresh, en: copied } },
      "ja",
    );

    // 言語ごとに 1 要素。ja だけを変えたので、en はどちらも変わっていない。
    expect(rows).toHaveLength(2);
    expect(pick(rows, "title", "ja")).toEqual({ key: "title", lang: "ja", humanEdited, iiifChanged });
    expect(pick(rows, "title", "en")).toEqual({
      key: "title",
      lang: "en",
      humanEdited: false,
      iiifChanged: false,
    });
  });

  it("言語ごとに別々に判定する", () => {
    const rows = compareIiifCopy(
      { title: { ja: "新潟市圖（改）", en: "Niigata" } },
      { title: { ja: "新潟市圖", en: "Niigata" } },
      { title: { ja: "新潟市圖", en: "Niigata (2nd ed.)" } },
      "ja",
    );

    expect(rows).toHaveLength(2);
    // ja は人が直しただけ。
    expect(pick(rows, "title", "ja")).toEqual({
      key: "title",
      lang: "ja",
      humanEdited: true,
      iiifChanged: false,
    });
    // en は IIIF の側が変わっただけ。
    expect(pick(rows, "title", "en")).toEqual({
      key: "title",
      lang: "en",
      humanEdited: false,
      iiifChanged: true,
    });
  });
});

describe("compareIiifCopy — 取り直した値が無いとき（iiifChanged は undefined）", () => {
  it.each([
    { name: "直していない", current: "新潟市圖", humanEdited: false },
    { name: "人が直した", current: "新潟市圖（改）", humanEdited: true },
  ])("文字列の値・$name", ({ current, humanEdited }) => {
    const rows = compareIiifCopy({ title: current }, { title: { ja: "新潟市圖" } }, undefined, "ja");

    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual({ key: "title", lang: "ja", humanEdited, iiifChanged: undefined });
  });

  it.each([
    { name: "直していない", current: "新潟市圖", humanEdited: false },
    { name: "人が直した", current: "新潟市圖（改）", humanEdited: true },
  ])("言語の表の値・$name", ({ current, humanEdited }) => {
    const rows = compareIiifCopy(
      { title: { ja: current, en: "Niigata" } },
      { title: { ja: "新潟市圖", en: "Niigata" } },
      undefined,
      "ja",
    );

    expect(rows).toHaveLength(2);
    for (const row of rows) expect(row.iiifChanged).toBeUndefined();
    expect(pick(rows, "title", "ja").humanEdited).toBe(humanEdited);
    expect(pick(rows, "title", "en").humanEdited).toBe(false);
  });
});

describe("compareIiifCopy — 今の値が無い（消した）ときは人が直したとみなす", () => {
  it("文字列の値が undefined のとき", () => {
    const rows = compareIiifCopy(
      { title: undefined },
      { title: { ja: "新潟市圖" } },
      { title: { ja: "新潟市圖" } },
      "ja",
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual({ key: "title", lang: "ja", humanEdited: true, iiifChanged: false });
  });

  it("鍵そのものが無いとき", () => {
    const rows = compareIiifCopy({}, { title: { ja: "新潟市圖" } }, undefined, "ja");

    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual({
      key: "title",
      lang: "ja",
      humanEdited: true,
      iiifChanged: undefined,
    });
  });

  it("言語の表にその言語が無いとき", () => {
    const rows = compareIiifCopy(
      { title: { en: "Niigata" } },
      { title: { ja: "新潟市圖", en: "Niigata" } },
      { title: { ja: "新潟市圖", en: "Niigata" } },
      "ja",
    );

    expect(rows).toHaveLength(2);
    expect(pick(rows, "title", "ja")).toEqual({
      key: "title",
      lang: "ja",
      humanEdited: true,
      iiifChanged: false,
    });
    expect(pick(rows, "title", "en")).toEqual({
      key: "title",
      lang: "en",
      humanEdited: false,
      iiifChanged: false,
    });
  });
});

describe("compareIiifCopy — 今の IIIF の値と今の値を直接比べない", () => {
  it.each(CASES)("文字列の値・$name: 取り直した値を変えても humanEdited は変わらない", ({
    copied,
    current,
    fresh,
    humanEdited,
  }) => {
    const base = compareIiifCopy(
      { title: current },
      { title: { ja: copied } },
      { title: { ja: fresh } },
      "ja",
    );
    // 取り直した値を今の値から遠ざけても、人が直したかの判定は動かない。
    const other = compareIiifCopy(
      { title: current },
      { title: { ja: copied } },
      { title: { ja: `${fresh}（別の版）` } },
      "ja",
    );

    expect(pick(base, "title", "ja").humanEdited).toBe(humanEdited);
    expect(pick(other, "title", "ja").humanEdited).toBe(humanEdited);
  });

  it.each(CASES)("言語の表の値・$name: 取り直した値を変えても humanEdited は変わらない", ({
    copied,
    current,
    fresh,
    humanEdited,
  }) => {
    const base = compareIiifCopy(
      { title: { ja: current } },
      { title: { ja: copied } },
      { title: { ja: fresh } },
      "ja",
    );
    const other = compareIiifCopy(
      { title: { ja: current } },
      { title: { ja: copied } },
      { title: { ja: `${fresh}（別の版）` } },
      "ja",
    );

    expect(pick(base, "title", "ja").humanEdited).toBe(humanEdited);
    expect(pick(other, "title", "ja").humanEdited).toBe(humanEdited);
  });

  it("今の値が取り直した値と等しくても、写した時点の値と違えば人が直した", () => {
    // 「IIIF が元の値へ戻った」ような場合でも、写した時点から動いていれば直したとみなす。
    const rows = compareIiifCopy(
      { title: "新潟市圖" },
      { title: { ja: "新潟市圖（旧）" } },
      { title: { ja: "新潟市圖" } },
      "ja",
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual({ key: "title", lang: "ja", humanEdited: true, iiifChanged: true });
  });
});

describe("compareIiifCopy — 返す範囲と順", () => {
  it("copiedValues にある鍵・言語を全部返し、言語の表の値は言語ごとに 1 要素", () => {
    const rows = compareIiifCopy(
      { title: { ja: "新潟市圖", en: "Niigata" }, attr: "<p>国立国会図書館</p>", license: "Custom" },
      {
        title: { ja: "新潟市圖", en: "Niigata" },
        attr: { ja: "<p>国立国会図書館</p>" },
        license: { ja: "Custom" },
      },
      undefined,
      "ja",
    );

    expect(rows.map((row) => `${row.key}/${row.lang}`)).toEqual([
      "title/ja",
      "title/en",
      "attr/ja",
      "license/ja",
    ]);
  });

  it("取り直した値に鍵や言語が無いときは IIIF の側が変わったとみなす", () => {
    const rows = compareIiifCopy(
      { title: { ja: "新潟市圖", en: "Niigata" } },
      { title: { ja: "新潟市圖", en: "Niigata" } },
      { title: { ja: "新潟市圖" } },
      "ja",
    );

    expect(rows).toHaveLength(2);
    expect(pick(rows, "title", "ja").iiifChanged).toBe(false);
    expect(pick(rows, "title", "en").iiifChanged).toBe(true);
  });

  it("copiedValues が空のときは空の配列を返す", () => {
    expect(compareIiifCopy({ title: "新潟市圖" }, {}, undefined, "ja")).toEqual([]);
  });
});

describe("compareIiifCopy — 前回写した値に無い鍵・言語も行にする", () => {
  it("写した後で結び付けた鍵（今の地図に値が無い）は IIIF の側が変わった行になる", () => {
    const rows = compareIiifCopy(
      { title: "新潟市圖（改）" },
      { title: { ja: "新潟市圖" } },
      { title: { ja: "新潟市圖" }, contributor: { ja: "新潟縣" } },
      "ja",
    );

    expect(rows).toEqual([
      { key: "title", lang: "ja", humanEdited: true, iiifChanged: false },
      { key: "contributor", lang: "ja", humanEdited: false, iiifChanged: true },
    ]);
  });

  it("前回は値が無く写せなかった鍵に今は値があり、地図に手で入れた値があれば両方変わった行になる", () => {
    const rows = compareIiifCopy(
      { title: "新潟市圖", description: "手で入れた説明" },
      { title: { ja: "新潟市圖" } },
      { title: { ja: "新潟市圖" }, description: { ja: "<p>明治の新潟</p>", en: "<p>Niigata in Meiji</p>" } },
      "ja",
    );

    expect(rows).toEqual([
      { key: "title", lang: "ja", humanEdited: false, iiifChanged: false },
      // 欄が文字列なら、どの言語の行でも値があるとみなす（別の言語の値で黙って上書きしない）
      { key: "description", lang: "ja", humanEdited: true, iiifChanged: true },
      { key: "description", lang: "en", humanEdited: true, iiifChanged: true },
    ]);
  });

  it("取り直した値で増えた言語は、その鍵の写した言語の後ろに並ぶ", () => {
    const rows = compareIiifCopy(
      { title: { ja: "新潟市圖", fr: "Niigata (fr)" }, attr: "国立国会図書館" },
      { title: { ja: "新潟市圖" }, attr: { ja: "国立国会図書館" } },
      {
        title: { en: "Niigata", ja: "新潟市圖", fr: "Niigata (fr)" },
        attr: { ja: "国立国会図書館" },
      },
      "ja",
    );

    expect(rows).toEqual([
      { key: "title", lang: "ja", humanEdited: false, iiifChanged: false },
      { key: "title", lang: "en", humanEdited: false, iiifChanged: true },
      { key: "title", lang: "fr", humanEdited: true, iiifChanged: true },
      { key: "attr", lang: "ja", humanEdited: false, iiifChanged: false },
    ]);
  });

  it("文字列で写した欄に取り直した値で言語が増えても、その言語の行は人が直した扱いになる", () => {
    const rows = compareIiifCopy(
      { title: "新潟市圖" },
      { title: { ja: "新潟市圖" } },
      { title: { ja: "新潟市圖", en: "Niigata" } },
      "ja",
    );

    expect(rows).toEqual([
      { key: "title", lang: "ja", humanEdited: false, iiifChanged: false },
      { key: "title", lang: "en", humanEdited: true, iiifChanged: true },
    ]);
  });

  it("後から結び付けた鍵の欄が文字列なら、別の言語の行も人が直した扱いになる", () => {
    const rows = compareIiifCopy(
      { description: "手で入れた説明" },
      {},
      { description: { en: "<p>Niigata in Meiji</p>" } },
      "ja",
    );

    expect(rows).toEqual([{ key: "description", lang: "en", humanEdited: true, iiifChanged: true }]);
  });

  it("取り直した値が無いときは、前回写した値にある鍵・言語だけを返す（今までと同じ）", () => {
    const rows = compareIiifCopy(
      { title: { ja: "新潟市圖", en: "Niigata" }, contributor: "新潟縣" },
      { title: { ja: "新潟市圖" } },
      undefined,
      "ja",
    );

    expect(rows).toEqual([{ key: "title", lang: "ja", humanEdited: false, iiifChanged: undefined }]);
  });

  it.each(CASES)("新しい行が足されても、前回写した値の行の判定は変わらない・$name", ({
    copied,
    current,
    fresh,
    humanEdited,
    iiifChanged,
  }) => {
    const rows = compareIiifCopy(
      { title: { ja: current }, contributor: "新潟縣" },
      { title: { ja: copied } },
      { title: { ja: fresh, en: "Niigata" }, contributor: { ja: "新潟縣" } },
      "ja",
    );

    expect(rows).toHaveLength(3);
    expect(rows[0]).toEqual({ key: "title", lang: "ja", humanEdited, iiifChanged });
    expect(rows.slice(1)).toEqual([
      { key: "title", lang: "en", humanEdited: false, iiifChanged: true },
      { key: "contributor", lang: "ja", humanEdited: true, iiifChanged: true },
    ]);
  });
});
