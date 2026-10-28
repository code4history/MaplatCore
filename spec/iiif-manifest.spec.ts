// IIIF の Manifest から書誌を写すための関数の試験。
//
// 対象は src/iiif/manifest.ts。このモジュールは OpenLayers・DOM・fetch を使わないので、
// 資料（spec/fixtures/iiif/ の 2 本）を JSON.parse した値をそのまま渡して測る。
//   listIiifCanvases    … Manifest の canvas の一覧（Editor の canvas の選択に使う）
//   proposeIiifBindings … 既定の selector
//   resolveIiifMetadata … 写す値を取り出す（取得しない・sanitize は呼び出し側が渡す）
//   iiifRightsToLicense … rights の URI → ライセンスの語彙
//   IIIF_BINDABLE_KEYS・IIIF_METADATA_DISPLAY_DEFAULT … 対応の表と既定値
//
// 期待値は資料の JSON と仕様から手で作った（実装の出力を写していない）。
import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  IIIF_BINDABLE_KEYS,
  IIIF_METADATA_DISPLAY_DEFAULT,
  iiifRightsToLicense,
  listIiifCanvases,
  proposeIiifBindings,
  resolveIiifMetadata
} from "../src/iiif/manifest";
import { META_KEYS } from "../src/meta_keys";

function readFixture(name: string) {
  return JSON.parse(readFileSync(resolve(__dirname, "fixtures/iiif", name), "utf-8"));
}

/** NDL の Presentation v2（本物を 1 回取ったもの）。 */
const NDL = readFixture("ndl-948741.manifest.json");
/** 手で書いた Presentation v3。 */
const V3 = readFixture("presentation-v3-minimal.manifest.json");

const ndlCanvas = (n: number): string => `https://dl.ndl.go.jp/api/iiif/948741/canvas/${n}`;
const ndlImageService = (n: number): string => `https://dl.ndl.go.jp/api/iiif/948741/R000000${n}`;
const ONE_TO_NINE = Array.from({ length: 9 }, (_, i) => i + 1);

const V3_CANVAS_1 = "https://iiif.example.test/manifest/sample-map/canvas/1";
const V3_CANVAS_2 = "https://iiif.example.test/manifest/sample-map/canvas/2";

const NDL_ATTRIBUTION = "国立国会図書館 National Diet Library, JAPAN";
const NDL_LICENSE_URI =
  "https://dl.ndl.go.jp/ja/help_iiif#api-%E3%81%AE%E5%88%A9%E7%94%A8%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6";

const V3_LABEL = { en: "Sample Town Map", ja: "見本町全図 / 附 町名索引" };
const V3_ATTRIBUTION = {
  en: 'Sample Library<br><a href="https://iiif.example.test/library">Sample Library Online</a>',
  ja: "見本図書館"
};
const V3_SUMMARY = {
  en: "A <b>hand-written</b> sample map used only for tests.",
  ja: "試験のためだけに作った<b>見本</b>の地図。"
};
const V3_PROVIDER = { en: "Sample Library", ja: "見本図書館" };

/** Manifest の書誌を写す、全部の鍵の結び付け。 */
const MANIFEST_BINDINGS = {
  title: { from: "manifest", property: "label" },
  officialTitle: { from: "manifest", property: "label" },
  attr: { from: "manifest", property: "requiredStatement" },
  dataAttr: { from: "manifest", property: "requiredStatement" },
  license: { from: "manifest", property: "rights" },
  dataLicense: { from: "manifest", property: "rights" },
  description: { from: "manifest", property: "summary" },
  contributor: { from: "manifest", property: "provider" }
} as const;

/** サニタイズをしないで通す（sanitize そのものの性質は別の試験で測る）。 */
const identity = (html: string): string => html;

type ResolvedMetadata = Extract<ReturnType<typeof resolveIiifMetadata>, { ok: true }>;

/** ok: false を試験の失敗として扱う。 */
function resolved(result: ReturnType<typeof resolveIiifMetadata>): ResolvedMetadata {
  if (!result.ok) throw new Error(`解決に失敗した: ${result.reason}`);
  return result;
}

describe("listIiifCanvases", () => {
  it("v2（NDL）は 9 枚で、canvas 1 は label \"1\"・4074×2705・imageService は R0000001", () => {
    const result = listIiifCanvases(NDL);
    if (!result.ok) throw new Error(`解決に失敗した: ${result.reason}`);
    expect(result.version).toBe("2");
    expect(result.canvases).toHaveLength(9);
    expect(result.canvases[0]).toEqual({
      id: ndlCanvas(1),
      label: "1",
      width: 4074,
      height: 2705,
      imageService: ndlImageService(1)
    });
  });

  it("v2（NDL）の canvas の id・label・imageService は 1〜9 の順", () => {
    const result = listIiifCanvases(NDL);
    if (!result.ok) throw new Error(`解決に失敗した: ${result.reason}`);
    expect(result.canvases.map(canvas => canvas.id)).toEqual(ONE_TO_NINE.map(ndlCanvas));
    expect(result.canvases.map(canvas => canvas.label)).toEqual(ONE_TO_NINE.map(n => String(n)));
    expect(result.canvases.map(canvas => canvas.imageService)).toEqual(
      ONE_TO_NINE.map(ndlImageService)
    );
    expect(result.canvases.every(canvas => canvas.width === 4074 && canvas.height === 2705)).toBe(
      true
    );
  });

  it("v3（手書き）は 2 枚で、canvas 2 は言語の表の label", () => {
    const result = listIiifCanvases(V3);
    if (!result.ok) throw new Error(`解決に失敗した: ${result.reason}`);
    expect(result.version).toBe("3");
    expect(result.canvases).toHaveLength(2);
    expect(result.canvases[1]).toEqual({
      id: V3_CANVAS_2,
      label: { en: "Index sheet", ja: "索引図" },
      width: 2000,
      height: 1500,
      imageService: "https://iiif.example.test/image/sample-map-2"
    });
  });

  it("v3（手書き）の canvas 1 の大きさと画像サービス", () => {
    const result = listIiifCanvases(V3);
    if (!result.ok) throw new Error(`解決に失敗した: ${result.reason}`);
    expect(result.canvases[0].id).toBe(V3_CANVAS_1);
    expect(result.canvases[0].width).toBe(4000);
    expect(result.canvases[0].height).toBe(3000);
    expect(result.canvases[0].imageService).toBe("https://iiif.example.test/image/sample-map-1");
  });

  it("Manifest の形をしていないとき（null・配列・sequences／items が配列でない）は not-manifest", () => {
    const asNotManifest = { ok: false, reason: "not-manifest" };
    for (const input of [
      null,
      [],
      "https://dl.ndl.go.jp/api/iiif/948741/manifest.json",
      { "@context": "http://iiif.io/api/presentation/2/context.json" },
      { "@context": "http://iiif.io/api/presentation/2/context.json", sequences: {} },
      { "@context": "http://iiif.io/api/presentation/3/context.json" },
      { "@context": "http://iiif.io/api/presentation/3/context.json", items: {} },
      { "@context": "http://iiif.io/api/presentation/3/context.json", items: "items" }
    ]) {
      expect(listIiifCanvases(input)).toEqual(asNotManifest);
    }
  });

  it("presentation/2・presentation/3 以外の @context は unsupported-version", () => {
    const asUnsupported = { ok: false, reason: "unsupported-version" };
    for (const input of [
      {},
      { items: [] },
      { label: "地図" },
      { "@context": "http://iiif.io/api/presentation/1/context.json" },
      { "@context": "http://iiif.io/api/image/2/context.json" }
    ]) {
      expect(listIiifCanvases(input)).toEqual(asUnsupported);
    }
  });
});

describe("proposeIiifBindings", () => {
  it("label が数字だけの canvas（NDL の canvas 1）は Manifest の label を指す", () => {
    const proposed = proposeIiifBindings(NDL, ndlCanvas(1));
    expect(proposed.title).toEqual({ from: "manifest", property: "label" });
  });

  it("NDL の canvas 3 も数字だけなので Manifest の label を指す", () => {
    expect(proposeIiifBindings(NDL, ndlCanvas(3)).title).toEqual({
      from: "manifest",
      property: "label"
    });
  });

  it("NDL の既定は Manifest にある題名・帰属・ライセンスの 3 つだけ", () => {
    expect(proposeIiifBindings(NDL, ndlCanvas(3))).toEqual({
      title: { from: "manifest", property: "label" },
      attr: { from: "manifest", property: "requiredStatement" },
      license: { from: "manifest", property: "rights" }
    });
  });

  it("NDL の既定は officialTitle・dataAttr・dataLicense・description・contributor を指さない", () => {
    const proposed = proposeIiifBindings(NDL, ndlCanvas(3));
    expect(Object.keys(proposed).sort()).toEqual(["attr", "license", "title"]);
    for (const key of [
      "officialTitle",
      "dataAttr",
      "dataLicense",
      "description",
      "contributor"
    ]) {
      expect(proposed).not.toHaveProperty(key);
    }
  });

  it("数字だけでない label の canvas（v3 の canvas 2）は canvas の label を指す", () => {
    const proposed = proposeIiifBindings(V3, V3_CANVAS_2);
    expect(proposed.title).toEqual({ from: "canvas", property: "label" });
  });

  it("v3 の既定は題名（canvas）・帰属・ライセンス・要約の 4 つ", () => {
    expect(proposeIiifBindings(V3, V3_CANVAS_2)).toEqual({
      title: { from: "canvas", property: "label" },
      attr: { from: "manifest", property: "requiredStatement" },
      license: { from: "manifest", property: "rights" },
      description: { from: "manifest", property: "summary" }
    });
  });

  it("canvas が見つからなければ Manifest の label を指す", () => {
    expect(
      proposeIiifBindings(NDL, "https://dl.ndl.go.jp/api/iiif/948741/canvas/99").title
    ).toEqual({ from: "manifest", property: "label" });
  });

  it("Manifest を読めないときは何も結び付けない", () => {
    for (const broken of [
      null,
      {},
      { "@context": "http://iiif.io/api/presentation/2/context.json" },
      { "@context": "http://iiif.io/api/presentation/3/context.json", items: {} }
    ]) {
      expect(proposeIiifBindings(broken, "canvas")).toEqual({});
    }
  });

  it("返す鍵は対応表の鍵に限り、property は対応表どおり", () => {
    for (const [manifest, canvasId] of [
      [NDL, ndlCanvas(1)],
      [V3, V3_CANVAS_2]
    ] as const) {
      const proposed = proposeIiifBindings(manifest, canvasId);
      const keys = Object.keys(proposed);
      expect(keys.length).toBeGreaterThan(0);
      for (const [key, selector] of Object.entries(proposed)) {
        expect(IIIF_BINDABLE_KEYS[key]).toBe(selector!.property);
      }
    }
  });

  it("その既定で写すと、画像のライセンス・帰属が地図のデータの鍵に混ざらない", () => {
    const bindings = proposeIiifBindings(NDL, ndlCanvas(3));
    const result = resolved(
      resolveIiifMetadata(NDL, { canvas: ndlCanvas(3), bindings }, "ja", identity)
    );
    expect(result.values).toEqual({
      title: "新潟市圖",
      attr: NDL_ATTRIBUTION,
      license: "Custom",
      licenseNote: NDL_LICENSE_URI
    });
    expect(result.values).not.toHaveProperty("dataAttr");
    expect(result.values).not.toHaveProperty("dataLicense");
    expect(result.values).not.toHaveProperty("dataLicenseNote");
    expect(result.values).not.toHaveProperty("officialTitle");
    expect(result.unresolved).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it("v3 でも既定の写しは 4 つの鍵だけを埋める", () => {
    const bindings = proposeIiifBindings(V3, V3_CANVAS_2);
    const result = resolved(
      resolveIiifMetadata(V3, { canvas: V3_CANVAS_2, bindings }, "ja", identity)
    );
    expect(Object.keys(result.values).sort()).toEqual(["attr", "description", "license", "title"]);
    expect(result.unresolved).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it("デモの地図の素材の bindings は既定の出力と同じ", () => {
    const demoMap = JSON.parse(
      readFileSync(resolve(__dirname, "../public/maps/niigata_1920_ndl.json"), "utf-8")
    );
    expect(proposeIiifBindings(NDL, demoMap.iiif.canvas)).toEqual(demoMap.iiif.bindings);
  });
});

describe("resolveIiifMetadata — v2（NDL）", () => {
  const iiif = { canvas: ndlCanvas(3), bindings: MANIFEST_BINDINGS };

  it("版は \"2\" で、label・attribution・license を写す", () => {
    const result = resolved(resolveIiifMetadata(NDL, iiif, "ja", identity));
    expect(result.version).toBe("2");
    expect(result.values).toEqual({
      title: "新潟市圖",
      officialTitle: "新潟市圖",
      attr: NDL_ATTRIBUTION,
      dataAttr: NDL_ATTRIBUTION,
      license: "Custom",
      dataLicense: "Custom",
      licenseNote: NDL_LICENSE_URI,
      dataLicenseNote: NDL_LICENSE_URI
    });
  });

  it("v2 に description・provider は無いので unresolved になり、values に入らない", () => {
    const result = resolved(resolveIiifMetadata(NDL, iiif, "ja", identity));
    expect([...result.unresolved].sort()).toEqual(["contributor", "description"]);
    expect(result.values).not.toHaveProperty("description");
    expect(result.values).not.toHaveProperty("contributor");
    expect(result.copiedValues).not.toHaveProperty("description");
    expect(result.copiedValues).not.toHaveProperty("contributor");
  });

  it("copiedMetadata は Manifest の metadata 10 件を順に from: \"manifest\" で返す", () => {
    const result = resolved(resolveIiifMetadata(NDL, iiif, "ja", identity));
    expect(result.copiedMetadata).toEqual([
      { from: "manifest", label: "Persistent ID", value: "info:ndljp/pid/948741" },
      { from: "manifest", label: "Title", value: "新潟市圖" },
      { from: "manifest", label: "Publisher", value: "髙橋長藏" },
      { from: "manifest", label: "Publication Date", value: "1920.11" },
      { from: "manifest", label: "Publication Date (W3CDTF fortmat)", value: "1920" },
      { from: "manifest", label: "Call Number", value: "YG7-Z-1065" },
      { from: "manifest", label: "Bibliographic ID", value: "000000564371" },
      { from: "manifest", label: "DOI", value: "10.11501/948741" },
      { from: "manifest", label: "Access Restrictions", value: "PDM" },
      { from: "manifest", label: "URL", value: "https://dl.ndl.go.jp/info:ndljp/pid/948741" }
    ]);
  });

  it("NDL の canvas は metadata を持たないので canvas 由来の行は増えない", () => {
    const withoutCanvas = resolved(
      resolveIiifMetadata(NDL, { bindings: MANIFEST_BINDINGS }, "ja", identity)
    );
    const withCanvas = resolved(resolveIiifMetadata(NDL, iiif, "ja", identity));
    expect(withoutCanvas.copiedMetadata).toHaveLength(10);
    expect(withCanvas.copiedMetadata).toEqual(withoutCanvas.copiedMetadata);
  });
});

describe("resolveIiifMetadata — v3（手書き）", () => {
  const iiif = { canvas: V3_CANVAS_2, bindings: MANIFEST_BINDINGS };

  it("版は \"3\" で、label・summary・requiredStatement・rights・provider を写す", () => {
    const result = resolved(resolveIiifMetadata(V3, iiif, "ja", identity));
    expect(result.version).toBe("3");
    expect(result.values).toEqual({
      title: V3_LABEL,
      officialTitle: V3_LABEL,
      attr: V3_ATTRIBUTION,
      dataAttr: V3_ATTRIBUTION,
      license: "CC BY-SA",
      dataLicense: "CC BY-SA",
      description: V3_SUMMARY,
      contributor: V3_PROVIDER
    });
  });

  it("表にある rights のときは licenseNote を作らない", () => {
    const result = resolved(resolveIiifMetadata(V3, iiif, "ja", identity));
    expect(result.values).not.toHaveProperty("licenseNote");
    expect(result.values).not.toHaveProperty("dataLicenseNote");
    expect(result.copiedValues).not.toHaveProperty("licenseNote");
    expect(result.copiedValues).not.toHaveProperty("dataLicenseNote");
    expect(result.unresolved).toEqual([]);
  });

  it("copiedMetadata は Manifest の 3 件と canvas の 1 件を順に from つきで返す", () => {
    const result = resolved(resolveIiifMetadata(V3, iiif, "ja", identity));
    expect(result.copiedMetadata).toEqual([
      { from: "manifest", label: { en: "Creator", ja: "作者" }, value: { ja: "Sample Surveyor" } },
      {
        from: "manifest",
        label: { en: "Date", ja: "年代" },
        value: { en: "1901", ja: "明治34年<br>1901年" }
      },
      { from: "manifest", label: { en: "Note" }, value: { en: "See <i>the index</i>." } },
      { from: "canvas", label: { en: "Sheet" }, value: { en: "Index" } }
    ]);
  });

  it("canvas を指定しなければ Manifest の 3 件だけになる", () => {
    const result = resolved(
      resolveIiifMetadata(V3, { bindings: MANIFEST_BINDINGS }, "ja", identity)
    );
    expect(result.copiedMetadata).toHaveLength(3);
    expect(result.copiedMetadata.map(entry => entry.from)).toEqual([
      "manifest",
      "manifest",
      "manifest"
    ]);
  });

  it("from: \"canvas\" の label は canvas の label を返す", () => {
    const result = resolved(
      resolveIiifMetadata(
        V3,
        { canvas: V3_CANVAS_2, bindings: { title: { from: "canvas", property: "label" } } },
        "ja",
        identity
      )
    );
    expect(result.values.title).toEqual({ en: "Index sheet", ja: "索引図" });
    expect(result.unresolved).toEqual([]);
  });
});

describe("resolveIiifMetadata — 言語", () => {
  const inlineManifest = {
    "@context": "http://iiif.io/api/presentation/3/context.json",
    id: "https://iiif.example.test/inline/manifest.json",
    type: "Manifest",
    label: { none: ["見出し"] },
    metadata: [
      { label: { en: ["Creator"], none: ["作成者"] }, value: { none: ["Anonymous"] } },
      { label: { en: ["Date"] }, value: { en: ["1901"], none: ["不明"] } }
    ],
    items: []
  };
  const bindings = { title: { from: "manifest", property: "label" } } as const;

  it("none は lang の値が無いときだけ lang の値になる（lang ja）", () => {
    const result = resolved(resolveIiifMetadata(inlineManifest, { bindings }, "ja", identity));
    expect(result.values.title).toEqual({ ja: "見出し" });
    expect(result.copiedMetadata).toEqual([
      { from: "manifest", label: { ja: "作成者" }, value: { ja: "Anonymous" } },
      { from: "manifest", label: { en: "Date" }, value: { en: "1901", ja: "不明" } }
    ]);
  });

  it("lang の値があるときは none を使わない（lang en）", () => {
    const result = resolved(resolveIiifMetadata(inlineManifest, { bindings }, "en", identity));
    expect(result.values.title).toEqual({ en: "見出し" });
    expect(result.copiedMetadata).toEqual([
      { from: "manifest", label: { en: "Creator" }, value: { en: "Anonymous" } },
      { from: "manifest", label: { en: "Date" }, value: { en: "1901" } }
    ]);
  });

  it("v2 の文字列の値は lang によらず同じ文字列", () => {
    for (const lang of ["ja", "en", "fr"]) {
      const result = resolved(
        resolveIiifMetadata(NDL, { bindings: MANIFEST_BINDINGS }, lang, identity)
      );
      expect(result.values.title).toBe("新潟市圖");
      expect(result.values.license).toBe("Custom");
    }
  });
});

describe("resolveIiifMetadata — 複数の値のつなぎ方", () => {
  it("文字として入る鍵（title・officialTitle）は \" / \" でつなぐ", () => {
    const result = resolved(
      resolveIiifMetadata(V3, { bindings: MANIFEST_BINDINGS }, "ja", identity)
    );
    expect(result.values.title).toEqual({ en: "Sample Town Map", ja: "見本町全図 / 附 町名索引" });
    expect(result.values.officialTitle).toEqual({
      en: "Sample Town Map",
      ja: "見本町全図 / 附 町名索引"
    });
  });

  it("HTML として入る鍵（attr・dataAttr・description・contributor）は <br> でつなぐ", () => {
    const result = resolved(
      resolveIiifMetadata(V3, { bindings: MANIFEST_BINDINGS }, "ja", identity)
    );
    expect(result.values.attr).toEqual(V3_ATTRIBUTION);
    expect(result.values.dataAttr).toEqual(V3_ATTRIBUTION);
    expect(result.values.description).toEqual(V3_SUMMARY);
    expect(result.values.contributor).toEqual(V3_PROVIDER);
  });

  it("copiedMetadata の値も <br> でつなぐ", () => {
    const result = resolved(
      resolveIiifMetadata(V3, { bindings: MANIFEST_BINDINGS }, "ja", identity)
    );
    expect(result.copiedMetadata[1].value).toEqual({ en: "1901", ja: "明治34年<br>1901年" });
  });
});

describe("resolveIiifMetadata — canvas が見つからないとき", () => {
  it("from: \"canvas\" の selector は unresolved になり、warnings は 1 行", () => {
    const result = resolved(
      resolveIiifMetadata(
        NDL,
        {
          canvas: "https://dl.ndl.go.jp/api/iiif/948741/canvas/99",
          bindings: {
            title: { from: "canvas", property: "label" },
            officialTitle: { from: "canvas", property: "label" }
          }
        },
        "ja",
        identity
      )
    );
    expect([...result.unresolved].sort()).toEqual(["officialTitle", "title"]);
    expect(result.values).toEqual({});
    expect(result.copiedValues).toEqual({});
    expect(result.warnings).toHaveLength(1);
  });

  it("from: \"manifest\" の selector は canvas が見つからなくても解決する", () => {
    const result = resolved(
      resolveIiifMetadata(
        NDL,
        {
          canvas: "https://dl.ndl.go.jp/api/iiif/948741/canvas/99",
          bindings: MANIFEST_BINDINGS
        },
        "ja",
        identity
      )
    );
    expect(result.values.title).toBe("新潟市圖");
    expect(result.values.attr).toBe(NDL_ATTRIBUTION);
    expect(result.copiedMetadata).toHaveLength(10);
  });
});

describe("resolveIiifMetadata — 壊れた入力", () => {
  const asNotManifest = { ok: false, reason: "not-manifest" };
  const asUnsupported = { ok: false, reason: "unsupported-version" };

  it("Manifest でない（null・配列・文字列・数値）は not-manifest", () => {
    for (const input of [null, undefined, [], [NDL], "manifest", 42, true]) {
      expect(resolveIiifMetadata(input, { bindings: MANIFEST_BINDINGS }, "ja", identity)).toEqual(
        asNotManifest
      );
    }
  });

  it("v2 の sequences が配列でない・v3 の items が配列でないときは not-manifest", () => {
    for (const input of [
      { "@context": "http://iiif.io/api/presentation/2/context.json" },
      { "@context": "http://iiif.io/api/presentation/2/context.json", sequences: {} },
      { "@context": "http://iiif.io/api/presentation/2/context.json", sequences: "sequences" },
      { "@context": "http://iiif.io/api/presentation/3/context.json" },
      { "@context": "http://iiif.io/api/presentation/3/context.json", items: {} }
    ]) {
      expect(resolveIiifMetadata(input, { bindings: MANIFEST_BINDINGS }, "ja", identity)).toEqual(
        asNotManifest
      );
    }
  });

  it("presentation/2・presentation/3 以外の @context は unsupported-version", () => {
    for (const input of [
      {},
      { label: "地図" },
      { "@context": "http://iiif.io/api/presentation/1/context.json" },
      { "@context": "http://iiif.io/api/image/2/context.json" }
    ]) {
      expect(resolveIiifMetadata(input, { bindings: MANIFEST_BINDINGS }, "ja", identity)).toEqual(
        asUnsupported
      );
    }
  });

  it("使う項目の型が違えば無視して warnings に 1 行（label が数値）", () => {
    const broken = { ...V3, label: 42 };
    const result = resolved(
      resolveIiifMetadata(
        broken,
        { bindings: { title: { from: "manifest", property: "label" } } },
        "ja",
        identity
      )
    );
    expect(result.values).toEqual({});
    expect(result.unresolved).toEqual(["title"]);
    expect(result.warnings).toHaveLength(1);
  });

  it("使う項目の型が違えば無視して warnings に 1 行（rights が数値）", () => {
    const broken = { ...V3, rights: 7 };
    const result = resolved(
      resolveIiifMetadata(
        broken,
        { bindings: { license: { from: "manifest", property: "rights" } } },
        "ja",
        identity
      )
    );
    expect(result.values).toEqual({});
    expect(result.unresolved).toEqual(["license"]);
    expect(result.warnings).toHaveLength(1);
  });

  it("property が無いときと、あって形が読めないときで警告の文が違う", () => {
    const bindings = { description: { from: "manifest", property: "summary" } } as const;
    // NDL の版 2 には description が無い
    const missing = resolved(resolveIiifMetadata(NDL, { bindings }, "ja", identity));
    expect(missing.unresolved).toEqual(["description"]);
    expect(missing.warnings).toEqual(["鍵 description の IIIF の値がありません"]);
    // 版 3 の summary はあるが数値
    const malformed = resolved(
      resolveIiifMetadata({ ...V3, summary: 42 }, { bindings }, "ja", identity)
    );
    expect(malformed.unresolved).toEqual(["description"]);
    expect(malformed.warnings).toEqual(["鍵 description の IIIF の値の形が読めません"]);
  });

  it("ライセンスが無いときはライセンスの警告にする", () => {
    const bindings = { license: { from: "manifest", property: "rights" } } as const;
    const missing = resolved(resolveIiifMetadata({ ...V3, rights: undefined }, { bindings }, "ja", identity));
    expect(missing.unresolved).toEqual(["license"]);
    expect(missing.warnings).toEqual(["鍵 license のライセンスの値がありません"]);
  });
});

describe("resolveIiifMetadata — 深い入れ子・循環", () => {
  /** 配列を depth 段入れ子にした値 */
  const nested = (depth: number): unknown => {
    let value: unknown = "深い";
    for (let i = 0; i < depth; i += 1) value = [value];
    return value;
  };
  /** 自分自身を含む配列 */
  const circular = (): unknown[] => {
    const value: unknown[] = [];
    value.push(value);
    return value;
  };
  const manifestOf = (overrides: Record<string, unknown>) =>
    ({
      "@context": "http://iiif.io/api/presentation/3/context.json",
      id: "https://iiif.example.test/deep/manifest.json",
      type: "Manifest",
      items: [],
      ...overrides
    }) as Record<string, unknown>;
  const title = { title: { from: "manifest", property: "label" } } as const;

  it("2 万段の入れ子の label でも一覧・既定・解決が例外を投げない", () => {
    const manifest = manifestOf({ label: nested(20000) });
    expect(() => listIiifCanvases(manifest)).not.toThrow();
    expect(() => proposeIiifBindings(manifest, "canvas")).not.toThrow();
    expect(() => resolveIiifMetadata(manifest, { bindings: title }, "ja", identity)).not.toThrow();

    expect(listIiifCanvases(manifest)).toEqual({ ok: true, version: "3", canvases: [] });
    expect(proposeIiifBindings(manifest, "canvas")).toEqual({});
    const result = resolved(resolveIiifMetadata(manifest, { bindings: title }, "ja", identity));
    expect(result.values).toEqual({});
    expect(result.unresolved).toEqual(["title"]);
    expect(result.warnings).toEqual(["鍵 title の IIIF の値の形が読めません"]);
  });

  it("循環した label でも一覧・既定・解決が例外を投げない", () => {
    const manifest = manifestOf({ label: circular() });
    expect(() => listIiifCanvases(manifest)).not.toThrow();
    expect(() => proposeIiifBindings(manifest, "canvas")).not.toThrow();
    expect(() => resolveIiifMetadata(manifest, { bindings: title }, "ja", identity)).not.toThrow();

    expect(listIiifCanvases(manifest)).toEqual({ ok: true, version: "3", canvases: [] });
    expect(proposeIiifBindings(manifest, "canvas")).toEqual({});
    const result = resolved(resolveIiifMetadata(manifest, { bindings: title }, "ja", identity));
    expect(result.values).toEqual({});
    expect(result.unresolved).toEqual(["title"]);
  });

  it("metadata の値が循環していても例外を投げず、その行を落として警告する", () => {
    const manifest = manifestOf({ metadata: [{ label: "循環", value: circular() }] });
    expect(() =>
      resolveIiifMetadata(manifest, { bindings: {} }, "ja", identity)
    ).not.toThrow();
    const result = resolved(resolveIiifMetadata(manifest, { bindings: {} }, "ja", identity));
    expect(result.copiedMetadata).toEqual([]);
    expect(result.warnings).toEqual(["Manifest の metadata の値の形が読めません"]);
  });

  it("2 万段の入れ子の metadata の値でも例外を投げない", () => {
    const manifest = manifestOf({ metadata: [{ label: "深い", value: nested(20000) }] });
    const result = resolved(resolveIiifMetadata(manifest, { bindings: {} }, "ja", identity));
    expect(result.copiedMetadata).toEqual([]);
    expect(result.warnings).toHaveLength(1);
  });
});

describe("resolveIiifMetadata — sanitize は呼び出し側が渡す", () => {
  it("NDL: HTML の鍵の値と copiedMetadata の値にだけ渡す（12 回）", () => {
    const sanitize = vi.fn(identity);
    resolved(
      resolveIiifMetadata(NDL, { canvas: ndlCanvas(3), bindings: MANIFEST_BINDINGS }, "ja", sanitize)
    );
    const passed = sanitize.mock.calls.map(call => call[0]).sort();
    expect(passed).toEqual(
      [
        NDL_ATTRIBUTION, // attr
        NDL_ATTRIBUTION, // dataAttr
        "info:ndljp/pid/948741",
        "新潟市圖",
        "髙橋長藏",
        "1920.11",
        "1920",
        "YG7-Z-1065",
        "000000564371",
        "10.11501/948741",
        "PDM",
        "https://dl.ndl.go.jp/info:ndljp/pid/948741"
      ].sort()
    );
    // 項目名（metadata の label）と Manifest の label は渡さない
    expect(passed).not.toContain("Persistent ID");
    expect(passed).not.toContain("Title");
  });

  it("v3: 項目名（requiredStatement の label・metadata の label）と label の値は渡さない", () => {
    const sanitize = vi.fn(identity);
    resolved(resolveIiifMetadata(V3, { bindings: MANIFEST_BINDINGS }, "ja", sanitize));
    const passed = sanitize.mock.calls.map(call => call[0]);
    expect(passed).not.toContain("Sample Town Map");
    expect(passed).not.toContain("Attribution");
    expect(passed).not.toContain("帰属");
    expect(passed).not.toContain("Creator");
    expect(passed).not.toContain("作者");
    expect(passed).not.toContain("Note");
  });

  it("返す値は sanitize の戻り値（文字の鍵はそのまま）", () => {
    const sanitize = (html: string): string => `<S>${html}</S>`;
    const result = resolved(
      resolveIiifMetadata(NDL, { bindings: MANIFEST_BINDINGS }, "ja", sanitize)
    );
    expect(result.values.title).toBe("新潟市圖");
    expect(result.values.officialTitle).toBe("新潟市圖");
    expect(result.values.attr).toBe(`<S>${NDL_ATTRIBUTION}</S>`);
    expect(result.values.dataAttr).toBe(`<S>${NDL_ATTRIBUTION}</S>`);
    expect(result.copiedMetadata[0]).toEqual({
      from: "manifest",
      label: "Persistent ID",
      value: "<S>info:ndljp/pid/948741</S>"
    });
  });

  it("v3 は description・contributor も sanitize を通す（label・title は通さない）", () => {
    const sanitize = (html: string): string => `<S>${html}</S>`;
    const result = resolved(
      resolveIiifMetadata(V3, { bindings: MANIFEST_BINDINGS }, "ja", sanitize)
    );
    expect(result.values.description).toEqual({
      en: `<S>${V3_SUMMARY.en}</S>`,
      ja: `<S>${V3_SUMMARY.ja}</S>`
    });
    expect(result.values.contributor).toEqual({
      en: `<S>${V3_PROVIDER.en}</S>`,
      ja: `<S>${V3_PROVIDER.ja}</S>`
    });
    expect(result.values.title).toEqual(V3_LABEL);
  });
});

describe("copiedValues", () => {
  it("NDL: 多言語でない鍵（license・licenseNote）は lang の値として入る", () => {
    const result = resolved(
      resolveIiifMetadata(NDL, { bindings: MANIFEST_BINDINGS }, "ja", identity)
    );
    expect(result.copiedValues).toEqual({
      title: { ja: "新潟市圖" },
      officialTitle: { ja: "新潟市圖" },
      attr: { ja: NDL_ATTRIBUTION },
      dataAttr: { ja: NDL_ATTRIBUTION },
      license: { ja: "Custom" },
      dataLicense: { ja: "Custom" },
      licenseNote: { ja: NDL_LICENSE_URI },
      dataLicenseNote: { ja: NDL_LICENSE_URI }
    });
  });

  it("v3: 言語の表の鍵はそのまま、license は lang の値", () => {
    const result = resolved(
      resolveIiifMetadata(V3, { bindings: MANIFEST_BINDINGS }, "ja", identity)
    );
    expect(result.copiedValues.title).toEqual(V3_LABEL);
    expect(result.copiedValues.attr).toEqual(V3_ATTRIBUTION);
    expect(result.copiedValues.contributor).toEqual(V3_PROVIDER);
    expect(result.copiedValues.license).toEqual({ ja: "CC BY-SA" });
    expect(result.copiedValues.dataLicense).toEqual({ ja: "CC BY-SA" });
  });

  it("values と同じ文字列を持つ（写した直後は「metadata の値 = copiedValues の値」）", () => {
    for (const [manifest, canvasId, lang] of [
      [NDL, ndlCanvas(3), "ja"],
      [NDL, ndlCanvas(3), "en"],
      [V3, V3_CANVAS_2, "ja"],
      [V3, V3_CANVAS_2, "en"]
    ] as const) {
      const result = resolved(
        resolveIiifMetadata(manifest, { canvas: canvasId, bindings: MANIFEST_BINDINGS }, lang, identity)
      );
      for (const [key, table] of Object.entries(result.copiedValues)) {
        const value = result.values[key];
        const expected = typeof value === "string" ? { [lang]: value } : value;
        expect(table).toEqual(expected);
      }
    }
  });

  it("写さなかった鍵・値の無い licenseNote は入らない", () => {
    const ndl = resolved(resolveIiifMetadata(NDL, { bindings: MANIFEST_BINDINGS }, "ja", identity));
    expect(Object.keys(ndl.copiedValues).sort()).toEqual([
      "attr",
      "dataAttr",
      "dataLicense",
      "dataLicenseNote",
      "license",
      "licenseNote",
      "officialTitle",
      "title"
    ]);
    const v3 = resolved(resolveIiifMetadata(V3, { bindings: MANIFEST_BINDINGS }, "ja", identity));
    expect(Object.keys(v3.copiedValues).sort()).toEqual([
      "attr",
      "contributor",
      "dataAttr",
      "dataLicense",
      "description",
      "license",
      "officialTitle",
      "title"
    ]);
  });
});

describe("iiifRightsToLicense", () => {
  it("Creative Commons の 8 形をライセンスの語彙にする", () => {
    const cases: [string, string][] = [
      ["http://creativecommons.org/licenses/by/4.0/", "CC BY"],
      ["https://creativecommons.org/licenses/by/4.0/", "CC BY"],
      ["https://creativecommons.org/licenses/by-sa/4.0/", "CC BY-SA"],
      ["http://creativecommons.org/licenses/by-nd/2.0/", "CC BY-ND"],
      ["https://creativecommons.org/licenses/by-nc/4.0/", "CC BY-NC"],
      ["http://creativecommons.org/licenses/by-nc-sa/2.1/jp/", "CC BY-NC-SA"],
      ["https://creativecommons.org/licenses/by-nc-nd/3.0/", "CC BY-NC-ND"],
      ["https://creativecommons.org/publicdomain/zero/1.0/", "CC0"],
      ["http://creativecommons.org/publicdomain/mark/1.0/", "PD"]
    ];
    for (const [uri, license] of cases) {
      expect(iiifRightsToLicense(uri)).toEqual({ license });
    }
  });

  it("www. の有無と http／https の違いは同じ語にする", () => {
    expect(iiifRightsToLicense("http://www.creativecommons.org/licenses/by/2.0/")).toEqual({
      license: "CC BY"
    });
    expect(iiifRightsToLicense("https://www.creativecommons.org/licenses/by-sa/4.0/")).toEqual({
      license: "CC BY-SA"
    });
  });

  it("表に無い URI は Custom で、URI を licenseNote に入れる", () => {
    expect(iiifRightsToLicense(NDL_LICENSE_URI)).toEqual({
      license: "Custom",
      licenseNote: NDL_LICENSE_URI
    });
    expect(iiifRightsToLicense("https://rightsstatements.org/page/InC/1.0/")).toEqual({
      license: "Custom",
      licenseNote: "https://rightsstatements.org/page/InC/1.0/"
    });
  });
});

describe("IIIF_BINDABLE_KEYS", () => {
  it("IIIF の property に対応する 8 鍵だけを持つ", () => {
    expect(IIIF_BINDABLE_KEYS).toEqual({
      title: "label",
      officialTitle: "label",
      attr: "requiredStatement",
      dataAttr: "requiredStatement",
      license: "rights",
      dataLicense: "rights",
      description: "summary",
      contributor: "provider"
    });
  });

  it("鍵はすべて META_KEYS にあり、licenseNote・dataLicenseNote は入らない", () => {
    for (const key of Object.keys(IIIF_BINDABLE_KEYS)) {
      expect(META_KEYS).toContain(key);
    }
    expect(Object.keys(IIIF_BINDABLE_KEYS)).toHaveLength(8);
    expect(Object.keys(IIIF_BINDABLE_KEYS)).not.toContain("licenseNote");
    expect(Object.keys(IIIF_BINDABLE_KEYS)).not.toContain("dataLicenseNote");
  });
});

describe("IIIF_METADATA_DISPLAY_DEFAULT", () => {
  it("表を出さない（\"hidden\"）", () => {
    expect(IIIF_METADATA_DISPLAY_DEFAULT).toBe("hidden");
  });
});
