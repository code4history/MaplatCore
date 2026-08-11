import { describe, it, expect, vi, beforeEach } from "vitest";
import { normalizeLayers } from "../src/normalize_pois";
import unchangedBaseline from "./expect/m4-t5-unchanged-baseline.json";

// M4-T5: 配列要素位置の裸 URL 文字列を fetch の前に判別する（設計 §5.1 の判定表）。
//
// 現行の欠陥（設計 §2.1 の実測）: normalizeLayers は配列分岐で全要素に nodesLoader を
// 適用してから先頭要素でモードを判定するため、裸 URL 文字列が判定より前に中身へ化ける。
// 中身が FeatureCollection なら偶然レイヤ配列モードへ入って正常に動くが、中身がレガシー
// POI 配列だと「配列の配列」になって POI オブジェクト配列モードへ落ち、POI が壊れる。
// ラッパー（{layer:…}）は nodesLoader が素通しするため fetch 前に判別されており、
// **正しい判定順は同ファイル内に既に存在している**。裸 URL だけがその恩恵を受けていない。
//
// AC1  ["url"]（中身レガシー配列）→ 1レイヤ            … 現行は壊れる
// AC2  ["url", FC] → 2レイヤ（親設計 MC7 の本体）      … 現行は壊れる
// AC3  ["url"]（中身FC）→ 現行と同一（無回帰）
// AC4  単独形（文字列 / FC / 上書き付きラッパー）→ 現行と同一
// AC5  配列[ラッパー] → 現行と同一（m18-t4 の契約不変）
// AC6  レガシー POI 配列モードでも要素の nodesLoader 解決が維持される（設計 §5.3）
// AC7  非先頭のレガシー配列は throw のまま／混在配列も throw（設計 §5.4 の挙動固定）
// AC8  参照先 404 は throw のまま（nodesLoader の契約不変）
// AC10 バンドル伝播不要判定の裏づけ — Editor 出力形・公開データ形で修正前後の出力が完全一致

const opts = () => ({ namespace: "ns", name: "AppName" });

const fc = (id: string) => ({
  type: "FeatureCollection",
  id,
  features: [
    {
      type: "Feature",
      id: `${id}_p`,
      geometry: { type: "Point", coordinates: [1, 2] },
      properties: { id: `${id}_p`, name: id }
    }
  ]
});

// nodesLoader（normalize_pois.ts:4-19）は '/' を含まない文字列に 'pois/' を前置する。
// stub のキーはその解決後 URL に合わせる（前置規則そのものは本タスクの非目標＝不変）。
const FILES: Record<string, any> = {
  "pois/a.geojson": fc("aid"),
  "pois/b.geojson": fc("bid"),
  "pois/t.json": fc("tid"),
  "pois/s.json": fc("sid"),
  "pois/m.json": fc("mid"),
  "pois/legacy.json": [
    { name: "A", lat: 1, lng: 2 },
    { name: "B", lat: 3, lng: 4 }
  ],
  "pois/one_poi.json": { name: "C", lat: 5, lng: 6 }
};

const stubFetch = () => {
  const spy = vi.fn(async (url: string) =>
    url in FILES
      ? { ok: true, json: async () => JSON.parse(JSON.stringify(FILES[url])) }
      : { ok: false, status: 404, json: async () => ({}) }
  );
  vi.stubGlobal("fetch", spy);
  return spy;
};

beforeEach(() => {
  vi.unstubAllGlobals();
});

// レイヤ名 → POI 件数の要約。レイヤ構成の同定に使う
const shape = (out: any) =>
  Object.fromEntries(
    Object.entries(out).map(([k, v]: [string, any]) => [k, v.pois.length])
  );

describe("AC1: 裸 URL 要素（中身がレガシー POI 配列）が1レイヤになる", () => {
  it('["legacy.json"] → main レイヤに2 POI', async () => {
    stubFetch();
    const out: any = await normalizeLayers(["legacy.json"], opts());
    expect(shape(out)).toEqual({ main: 2 });
    // 現行の壊れ方（POI 1件の中身が「配列そのもの」で lnglat 欠損）に落ちていないこと
    expect(out.main.pois.map((p: any) => p.name)).toEqual(["A", "B"]);
    for (const poi of out.main.pois) {
      expect(Array.isArray(poi.lnglat)).toBe(true);
      expect(poi.lnglat).not.toContain(undefined);
    }
  });
});

describe("AC2: 裸 URL 要素 + 生 FC が2レイヤになる（親設計 MC7）", () => {
  it('["legacy.json", FC] → main と fcid の2レイヤ', async () => {
    stubFetch();
    const out: any = await normalizeLayers(["legacy.json", fc("fcid")], opts());
    expect(shape(out)).toEqual({ main: 2, fcid: 1 });
    expect(out.main.pois.map((p: any) => p.name)).toEqual(["A", "B"]);
    expect(out.fcid.pois[0].lnglat).toEqual([1, 2]);
  });

  it('["legacy.json", "t.json"] → URL 2本でも2レイヤ', async () => {
    stubFetch();
    const out: any = await normalizeLayers(["legacy.json", "t.json"], opts());
    expect(shape(out)).toEqual({ main: 2, tid: 1 });
  });
});

describe("AC3: 裸 URL 要素（中身が FC）は現行と同一（無回帰）", () => {
  it('["t.json"] → tid レイヤ + 空の main', async () => {
    stubFetch();
    const out: any = await normalizeLayers(["t.json"], opts());
    expect(shape(out)).toEqual({ tid: 1, main: 0 });
  });
});

describe("AC4: 単独形は現行と同一", () => {
  it('"legacy.json"（文字列単独形）→ main に2 POI', async () => {
    stubFetch();
    const out: any = await normalizeLayers("legacy.json", opts());
    expect(shape(out)).toEqual({ main: 2 });
  });

  it("FC 単独形 → FC の id がレイヤ名になる", async () => {
    stubFetch();
    const out: any = await normalizeLayers(fc("solo"), opts());
    expect(shape(out)).toEqual({ solo: 1, main: 0 });
  });

  it("上書き付きラッパー単独形 → 上書きが cluster へ載る", async () => {
    stubFetch();
    const out: any = await normalizeLayers(
      { layer: "pois/a.geojson", hide: true },
      opts()
    );
    expect(shape(out)).toEqual({ aid: 1, main: 0 });
    expect(out.aid.hide).toBe(true);
  });
});

describe("AC5: 配列[ラッパー] は現行と同一（m18-t4 の契約不変）", () => {
  it("ラッパー2件 → 上書きが載り、参照先の中身は変わらない", async () => {
    stubFetch();
    const out: any = await normalizeLayers(
      [
        { layer: "pois/a.geojson", hide: true, title: "T" },
        { layer: "pois/b.geojson" }
      ],
      opts()
    );
    expect(shape(out)).toEqual({ aid: 1, bid: 1, main: 0 });
    expect(out.aid.hide).toBe(true);
    expect(out.aid.name).toBe("T");
    expect(out.bid.hide).toBeUndefined();
  });

  it("ラッパーが先頭なら裸 URL が続いてもレイヤ配列モード", async () => {
    stubFetch();
    const out: any = await normalizeLayers(
      [{ layer: "pois/a.geojson", hide: true }, "t.json"],
      opts()
    );
    expect(shape(out)).toEqual({ aid: 1, tid: 1, main: 0 });
  });
});

describe("AC6: POI オブジェクト配列モードでも要素の解決が維持される（設計 §5.3）", () => {
  it('[{旧POI}, "one_poi.json"] → 2 POI（URL 要素が単一 POI オブジェクトへ解決される）', async () => {
    const spy = stubFetch();
    const out: any = await normalizeLayers(
      [{ name: "D", lat: 9, lng: 10 }, "one_poi.json"],
      opts()
    );
    expect(shape(out)).toEqual({ main: 2 });
    expect(out.main.pois.map((p: any) => p.name)).toEqual(["D", "C"]);
    // 実際に fetch が起きていること（解決を落としていない証拠）
    expect(spy).toHaveBeenCalledWith("pois/one_poi.json");
  });

  it("配列[旧POI] のみ → 現行どおり1レイヤ", async () => {
    stubFetch();
    const out: any = await normalizeLayers([{ name: "X", lat: 7, lng: 8 }], opts());
    expect(shape(out)).toEqual({ main: 1 });
    expect(out.main.pois[0].lnglat).toEqual([8, 7]);
  });

  it("空配列 → main が0件で生える", async () => {
    stubFetch();
    const out: any = await normalizeLayers([], opts());
    expect(shape(out)).toEqual({ main: 0 });
  });
});

describe("AC7: key を持てない非先頭レイヤは throw のまま（設計 §5.4 の挙動固定）", () => {
  it('["t.json", "legacy.json"] → throw（レガシー配列は id を持てない）', async () => {
    stubFetch();
    await expect(
      normalizeLayers(["t.json", "legacy.json"], opts())
    ).rejects.toBe("POI layers include bad key setting");
  });

  it('混在配列 ["one_poi.json", {旧POI}] → throw（唯一の意図的挙動変更）', async () => {
    stubFetch();
    // 現行は先頭 URL が POI オブジェクトへ化けて POI 配列モードへ落ち2 POI として動くが、
    // 修正後は「先頭が文字列＝レイヤ配列」なので非先頭の旧 POI が key を持てず throw する。
    // 実データ0件（公開37件・Editor DB 270行）を根拠に受け入れ、ここで挙動を固定する。
    await expect(
      normalizeLayers(["one_poi.json", { name: "E", lat: 1, lng: 2 }], opts())
    ).rejects.toBe("POI layers include bad key setting");
  });
});

describe("AC8: 参照先 404 は throw のまま（nodesLoader の契約不変）", () => {
  it("配列要素の 404", async () => {
    stubFetch();
    await expect(normalizeLayers(["missing.json"], opts())).rejects.toThrow(
      "Fail to load poi json"
    );
  });

  it("単独形の 404", async () => {
    stubFetch();
    await expect(normalizeLayers("missing.json", opts())).rejects.toThrow(
      "Fail to load poi json"
    );
  });

  it("ラッパーの layer が 404", async () => {
    stubFetch();
    await expect(
      normalizeLayers([{ layer: "missing.json", hide: true }], opts())
    ).rejects.toThrow("Fail to load poi json");
  });
});

describe("AC10: 修正前後で出力が完全一致する（バンドル伝播不要判定の裏づけ）", () => {
  // 設計 §6: preview バンドルを再生成しない判定を、主張ではなく実測で裏づける。
  // 期待値 spec/expect/m4-t5-unchanged-baseline.json は **修正前の実装を実行して採取した値**
  // であり、これと一致することが「現行データは伝播しなくても無影響」の直接証拠になる。
  const cases: [string, unknown][] = [
    // Editor が t2/t3 で出力する形（上書きレイヤの配列）
    [
      "editorOutput",
      [
        { layer: "pois/a.geojson", hide: true, title: "T", icon: "i.png" },
        { layer: "pois/b.geojson" }
      ]
    ],
    // 公開データに実在する形（Maplat/public/apps/sample.json = 参照先が全て FC）
    ["publishedFcUrls", ["t.json", "s.json", "m.json"]],
    // 公開データに実在する形（単独形 URL・7件）
    ["publishedSingleUrl", "legacy.json"],
    // 公開データに実在する形（配列[旧POI]・3件）
    ["publishedLegacyArray", [{ name: "X", lat: 7, lng: 8 }]],
    ["singleFc", fc("solo")],
    ["singleWrapper", { layer: "pois/a.geojson", hide: true }],
    ["bareUrlFcArray", ["t.json"]],
    ["legacyArrayWithUrlElement", [{ name: "D", lat: 9, lng: 10 }, "one_poi.json"]],
    ["emptyArray", []]
  ];

  it.each(cases)("%s は修正前と同じ出力になる", async (key, input) => {
    stubFetch();
    const out = await normalizeLayers(JSON.parse(JSON.stringify(input)), opts());
    expect(JSON.parse(JSON.stringify(out))).toEqual(
      (unchangedBaseline as Record<string, unknown>)[key as string]
    );
  });
});
