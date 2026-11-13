// IIIF の Manifest の metadata などの値の中の「配列の中の配列」を読むための試験。
//
// 対象は src/iiif/manifest.ts。実在資料（Boston の Leventhal Map Center など）には、
// 値が ["項目名", ["作者名"]] のような仕様外の入れ子の配列で入っているものがある。
// これを読まずに捨てると作者名が書誌表に出ない。入れ子の配列は深さ上限つきで平らにして
// 読み、一度見た配列は WeakSet で飛ばして循環しても止まるようにする。
//   - 入れ子の配列（配列の中の配列）の文字列も読む
//   - 言語の表（Presentation 3）の中の入れ子の配列も同じに読む
//   - 循環する配列でも止まって読む
//   - 深さ上限を超える深さは読まずに終われる
//   - 既存の正規の形（文字列・{@value,@language}・平らな配列・言語の表）の結果は変えない
//   - label・attribution・description 等も同じ読み方になる
//
// 期待値は入力の形と仕様から手で作った（実装の出力を写していない）。
import { describe, expect, it } from "vitest";
import { resolveIiifMetadata, type IiifMetadataEntry } from "../src/iiif/manifest";

/** サニタイズをしないで通す。 */
const identity = (html: string): string => html;

type ResolvedMetadata = Extract<
  ReturnType<typeof resolveIiifMetadata>,
  { ok: true }
>;

/** ok: false を試験の失敗として扱う。 */
function resolved(
  result: ReturnType<typeof resolveIiifMetadata>
): ResolvedMetadata {
  if (!result.ok) throw new Error(`解決に失敗した: ${result.reason}`);
  return result;
}

/** metadata の行だけを持つ、最小の Presentation 2 の Manifest を作る（canvas は空）。 */
function manifestV2(metadata: Array<{ label: unknown; value: unknown }>) {
  return {
    "@context": "http://iiif.io/api/presentation/2/context.json",
    metadata,
    sequences: [] as unknown[]
  };
}

/** Manifest 本体の書誌項目（label・attribution・description）を持つ Presentation 2。 */
function manifestV2WithFields(fields: Record<string, unknown>) {
  return {
    "@context": "http://iiif.io/api/presentation/2/context.json",
    ...fields,
    sequences: [] as unknown[]
  };
}

/** metadata を写した結果の行を返す。 */
function copyRows(
  manifest: unknown,
  lang = "ja"
): IiifMetadataEntry[] {
  return resolved(resolveIiifMetadata(manifest, {}, lang, identity)).copiedMetadata;
}

/** 値を指定した深さだけ配列で包む（"x" を [[["x"]]] のようにする）。 */
function nest(value: unknown, depth: number): unknown {
  let out: unknown = value;
  for (let i = 0; i < depth; i++) out = [out];
  return out;
}

describe("入れ子の配列（配列の中の配列）", () => {
  it("配列の中の配列の文字列も読む（作者名が消えない）", () => {
    const rows = copyRows(
      manifestV2([
        {
          label: "作者",
          value: ["作者", ["架空 太郎（かくそ たろう）, 1850-1900"]]
        }
      ])
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].value).toEqual({
      ja: "作者<br>架空 太郎（かくそ たろう）, 1850-1900"
    });
  });

  it("言語の表（Presentation 3）の中の入れ子の配列も読む", () => {
    const rows = copyRows(
      manifestV2([
        { label: "言語の表の入れ子", value: { ja: [["入れ子の", "値"]] } }
      ])
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].value).toEqual({ ja: "入れ子の<br>値" });
  });
});

describe("循環する配列", () => {
  it("自分自身を含む配列でも止まって 'x' を読む", () => {
    const a: unknown[] = ["x"];
    a.push(a);
    const rows = copyRows(manifestV2([{ label: "循環", value: a }]));
    expect(rows).toHaveLength(1);
    expect(rows[0].value).toEqual({ ja: "x" });
  });

  it("[a, a]（同じ循環する配列を 2 回並べても）止まって読む", () => {
    const a: unknown[] = ["x"];
    a.push(a);
    const rows = copyRows(manifestV2([{ label: "循環の並び", value: [a, a] }]));
    expect(rows).toHaveLength(1);
    expect(rows[0].value).toEqual({ ja: "x" });
  });
});

describe("深さ上限", () => {
  it("上限内の深い入れ子は読む", () => {
    const rows = copyRows(
      manifestV2([{ label: "深い", value: nest("深い", 10) }])
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].value).toEqual({ ja: "深い" });
  });

  it("上限を超える深さは読まずに終われる（埋もれた値は出さない）", () => {
    const result = resolved(
      resolveIiifMetadata(
        manifestV2([{ label: "深すぎ", value: nest("深すぎ", 100) }]),
        {},
        "ja",
        identity
      )
    );
    const values = result.copiedMetadata.map(row =>
      typeof row.value === "string" ? row.value : Object.values(row.value).join(" ")
    );
    expect(values.some(text => text.includes("深すぎ"))).toBe(false);
  });
});

describe("既存の正規の形は変わらない", () => {
  it("文字列はそのまま", () => {
    const rows = copyRows(
      manifestV2([{ label: "文字列", value: "そのままの文字列" }])
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].value).toBe("そのままの文字列");
  });

  it("言語つきの値 {@value,@language} は言語ごとの表になる", () => {
    const rows = copyRows(
      manifestV2([
        {
          label: "言語つきの値",
          value: { "@value": "language-tagged value", "@language": "en" }
        }
      ])
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].value).toEqual({ en: "language-tagged value" });
  });

  it("平らな配列はつなげて読む", () => {
    const rows = copyRows(
      manifestV2([{ label: "平らな配列", value: ["一つ目", "二つ目"] }])
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].value).toEqual({ ja: "一つ目<br>二つ目" });
  });

  it("言語の表は言語ごとの表になる", () => {
    const rows = copyRows(
      manifestV2([
        {
          label: "言語の表",
          value: { ja: ["日本語の値"], en: ["English value"] }
        }
      ])
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].value).toEqual({
      ja: "日本語の値",
      en: "English value"
    });
  });
});

describe("label・attribution・description も同じ読み方になる", () => {
  it("Manifest 本体の label・attribution・description の入れ子も読む", () => {
    const manifest = manifestV2WithFields({
      label: ["見本地図", ["追加の題"]],
      attribution: ["帰属", ["架空図書館"]],
      description: ["説明", ["架空の補足"]]
    });
    const bindings = {
      title: { from: "manifest", property: "label" },
      attr: { from: "manifest", property: "requiredStatement" },
      description: { from: "manifest", property: "summary" }
    } as const;
    const result = resolved(
      resolveIiifMetadata(manifest, { bindings }, "ja", identity)
    );
    expect(result.values.title).toEqual({ ja: "見本地図 / 追加の題" });
    expect(result.values.attr).toEqual({ ja: "帰属<br>架空図書館" });
    expect(result.values.description).toEqual({ ja: "説明<br>架空の補足" });
  });
});
