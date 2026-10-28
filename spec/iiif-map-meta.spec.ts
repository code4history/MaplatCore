// getMapMeta の iiif の節（地図データの IIIF の書誌を表示用に載せる）と、
// source の initialize が控える IIIF の値（iiif・iiifMetadata）を固定する。
// 地図の実体（OL）は jsdom で作らず、source は initialize の option から、
// MaplatApp はメソッドだけを持つ殻から作って、getMapMeta の戻り値を見る。
import { afterEach, describe, expect, it, vi } from "vitest";
import { MaplatApp } from "../src/index";
import { setCustomFunction } from "../src/source/mixin";
import { META_KEYS } from "../src/meta_keys";
import { IIIF_METADATA_DISPLAY_DEFAULT } from "../src/iiif/manifest";
import { isIiifMetadataEntry } from "../src/element_contract";

afterEach(() => {
  vi.restoreAllMocks();
});

const getMapMeta = (MaplatApp.prototype as any).getMapMeta as (mapID?: any) => any;

const Mixed = setCustomFunction(class {});
const initialize = (Mixed.prototype as any).initialize as (options: any) => void;

const MANIFEST_URL = "https://dl.ndl.go.jp/api/iiif/948741/manifest.json";
const CANVAS_URL = "https://dl.ndl.go.jp/api/iiif/948741/canvas/3";
const IMAGE_URL = "./niigata_1920_ndl.jpg";
const COPIED_AT = "2026-10-28T00:00:00Z";
const COPIED_METADATA = [
  { from: "manifest", label: "タイトル", value: "新潟市圖" },
  { from: "manifest", label: "出版者", value: "新潟市" },
  { from: "canvas", label: "大きさ", value: "4074×2705" }
];
// 表示に使わない項目（bindings・copiedValues）は getMapMeta に載らないことを見るために入れておく
const IIIF = {
  manifest: MANIFEST_URL,
  canvas: CANVAS_URL,
  image: IMAGE_URL,
  bindings: { title: { from: "manifest", property: "label" } },
  copiedAt: COPIED_AT,
  copiedValues: { title: { ja: "新潟市圖" } },
  copiedMetadata: COPIED_METADATA
};

/** source を initialize に通して作る（thumbnail を渡して fetch を起こさない）。 */
function makeSource(options: Record<string, any> = {}): any {
  const source: any = Object.create(Mixed.prototype);
  source.set = vi.fn((key: string, value: any) => {
    source[key] = value;
  });
  source.get = (key: string) => source[key];
  source.resolvePois = vi.fn(async () => undefined);
  source.setTileLoadFunction = vi.fn();
  source.getTileLoadFunction = vi.fn();
  initialize.call(source, {
    mapID: "niigata_1920_ndl",
    label: "新潟市圖",
    thumbnail: "./tmbs/niigata_1920_ndl.jpg",
    ...options
  });
  return source;
}

/** 地図・要素を作らない MaplatApp の殻（getMapMeta が読む項目だけを入れる）。 */
function stubApp(fields: Record<string, any> = {}): any {
  return Object.assign(Object.create(MaplatApp.prototype), fields);
}

function metaOf(source: any, mapID?: any): any {
  return getMapMeta.call(stubApp({ from: source, cacheHash: { [source.mapID]: source } }), mapID);
}

describe("getMapMeta: iiif の無い地図", () => {
  it("今と同じ形（mapID・label・メタデータの鍵）で、iiif の鍵は無い", () => {
    const source = makeSource({ title: { ja: "新潟市圖" } });
    const meta = metaOf(source, source.mapID);
    expect(Object.keys(meta)).toEqual(["mapID", "label", ...META_KEYS]);
    expect(meta.mapID).toBe("niigata_1920_ndl");
    expect(meta.label).toBe("新潟市圖");
    expect(meta.title).toEqual({ ja: "新潟市圖" });
    expect(meta).not.toHaveProperty("iiif");
  });

  it("mapID を渡さなければ from の地図を返す（今と同じ）", () => {
    const source = makeSource();
    const meta = getMapMeta.call(stubApp({ from: source, cacheHash: {} }));
    expect(Object.keys(meta)).toEqual(["mapID", "label", ...META_KEYS]);
    expect(meta).not.toHaveProperty("iiif");
  });

  it("cacheHash に無い mapID は undefined（今と同じ）", () => {
    const source = makeSource();
    expect(metaOf(source, "unknown_map")).toBeUndefined();
  });
});

describe("getMapMeta: iiif のある地図", () => {
  it("iiif を表示用の形（manifest・canvas・image・copiedAt・display・metadata）で返す", () => {
    const source = makeSource({ iiif: { ...IIIF } });
    const meta = metaOf(source, source.mapID);
    expect(meta.iiif).toEqual({
      manifest: MANIFEST_URL,
      canvas: CANVAS_URL,
      image: IMAGE_URL,
      copiedAt: COPIED_AT,
      display: IIIF_METADATA_DISPLAY_DEFAULT,
      metadata: COPIED_METADATA
    });
  });

  it("bindings・copiedValues は載せない", () => {
    const source = makeSource({ iiif: { ...IIIF } });
    const meta = metaOf(source, source.mapID);
    expect(Object.keys(meta.iiif).sort()).toEqual([
      "canvas",
      "copiedAt",
      "display",
      "image",
      "manifest",
      "metadata"
    ]);
    expect(meta.iiif.bindings).toBeUndefined();
    expect(meta.iiif.copiedValues).toBeUndefined();
  });

  it("metadata は copiedMetadata と同じ中身を順に持つ", () => {
    const source = makeSource({ iiif: { ...IIIF } });
    const meta = metaOf(source, source.mapID);
    expect(meta.iiif.metadata).toEqual(COPIED_METADATA);
    expect(meta.iiif.metadata.map((entry: any) => entry.from)).toEqual([
      "manifest",
      "manifest",
      "canvas"
    ]);
  });

  it("copiedMetadata が無ければ metadata は載せない", () => {
    const source = makeSource({ iiif: { manifest: MANIFEST_URL, canvas: CANVAS_URL } });
    const meta = metaOf(source, source.mapID);
    expect(meta.iiif.manifest).toBe(MANIFEST_URL);
    expect(meta.iiif.canvas).toBe(CANVAS_URL);
    expect(meta.iiif.metadata).toBeUndefined();
  });
});

describe("getMapMeta: iiif の書誌を出すか（display）", () => {
  it("既定の定数は hidden", () => {
    expect(IIIF_METADATA_DISPLAY_DEFAULT).toBe("hidden");
  });

  it("iiifMetadata が all なら display は all", () => {
    const source = makeSource({ iiif: { ...IIIF }, iiifMetadata: "all" });
    expect(metaOf(source, source.mapID).iiif.display).toBe("all");
  });

  it("iiifMetadata が hidden なら display は hidden", () => {
    const source = makeSource({ iiif: { ...IIIF }, iiifMetadata: "hidden" });
    expect(metaOf(source, source.mapID).iiif.display).toBe("hidden");
  });

  it("iiifMetadata が無ければ既定の定数", () => {
    const source = makeSource({ iiif: { ...IIIF } });
    expect(metaOf(source, source.mapID).iiif.display).toBe(IIIF_METADATA_DISPLAY_DEFAULT);
  });

  it("iiifMetadata が all・hidden 以外なら既定の定数", () => {
    const source = makeSource({ iiif: { ...IIIF }, iiifMetadata: "compact" });
    expect(metaOf(source, source.mapID).iiif.display).toBe(IIIF_METADATA_DISPLAY_DEFAULT);
  });
});

describe("getMapMeta: 形の壊れた iiif", () => {
  it("オブジェクトでなければ iiif を載せない", () => {
    for (const broken of [MANIFEST_URL, 42, null]) {
      const source = makeSource({ iiif: broken });
      const meta = metaOf(source, source.mapID);
      expect(meta).not.toHaveProperty("iiif");
    }
  });

  it("文字列でない項目・配列でない copiedMetadata はその項目だけ落ちる", () => {
    const source = makeSource({
      iiif: {
        manifest: 123,
        canvas: CANVAS_URL,
        image: 456,
        copiedAt: 789,
        copiedMetadata: "not-an-array"
      }
    });
    const meta = metaOf(source, source.mapID);
    expect(meta.iiif.manifest).toBeUndefined();
    expect(meta.iiif.canvas).toBe(CANVAS_URL);
    expect(meta.iiif.image).toBeUndefined();
    expect(meta.iiif.copiedAt).toBeUndefined();
    expect(meta.iiif.metadata).toBeUndefined();
    expect(meta.iiif.display).toBe(IIIF_METADATA_DISPLAY_DEFAULT);
  });
});

describe("initialize: IIIF の値の控え", () => {
  it("iiif と iiifMetadata を控える", () => {
    const source = makeSource({ iiif: { ...IIIF }, iiifMetadata: "all" });
    expect(source.iiif.manifest).toBe(MANIFEST_URL);
    expect(source.iiif.canvas).toBe(CANVAS_URL);
    expect(source.iiif.image).toBe(IMAGE_URL);
    expect(source.iiif.copiedAt).toBe(COPIED_AT);
    expect(source.iiif.copiedMetadata).toEqual(COPIED_METADATA);
    expect(source.iiifMetadataDisplay).toBe("all");
  });

  it("iiif と iiifMetadata が無ければ控えない", () => {
    const source = makeSource();
    expect(source.iiif).toBeUndefined();
    expect(source.iiifMetadataDisplay).toBeUndefined();
  });

  it("オブジェクトでない iiif は控えない", () => {
    for (const broken of [MANIFEST_URL, 42, null]) {
      const source = makeSource({ iiif: broken });
      expect(source.iiif).toBeUndefined();
    }
  });

  it("文字列でない項目・配列でない copiedMetadata はその項目だけ控えない", () => {
    const source = makeSource({
      iiif: {
        manifest: 123,
        canvas: CANVAS_URL,
        image: 456,
        copiedAt: 789,
        copiedMetadata: "not-an-array"
      }
    });
    expect(source.iiif.manifest).toBeUndefined();
    expect(source.iiif.canvas).toBe(CANVAS_URL);
    expect(source.iiif.image).toBeUndefined();
    expect(source.iiif.copiedAt).toBeUndefined();
    expect(source.iiif.copiedMetadata).toBeUndefined();
  });
});

// copiedMetadata の要素の形（{ from, label, value }）の検査。
const GOOD_ENTRY_1 = { from: "manifest", label: "タイトル", value: { ja: "新潟市圖" } };
const GOOD_ENTRY_2 = { from: "canvas", label: { ja: "大きさ", en: "Size" }, value: "4074×2705" };
const BAD_ENTRIES: unknown[] = [
  null,
  "manifest",
  { from: "other", label: "タイトル", value: "新潟市圖" },
  { from: "manifest", label: 1, value: "新潟市圖" },
  { from: "manifest", label: "タイトル", value: { ja: 1 } },
  { from: "manifest", value: "新潟市圖" }
];

describe("isIiifMetadataEntry: 要素の形の判定", () => {
  it.each([
    ["文字列の label・value", { from: "manifest", label: "タイトル", value: "新潟市圖" }],
    ["言語の表の label・value", { from: "canvas", label: { ja: "大きさ" }, value: { en: "Size" } }],
    ["from が canvas", { from: "canvas", label: "x", value: "y" }]
  ])("良い形（%s）は true", (_name, entry) => {
    expect(isIiifMetadataEntry(entry)).toBe(true);
  });

  it.each([
    ["null", null],
    ["文字列", "manifest"],
    ["from が other", { from: "other", label: "x", value: "y" }],
    ["from が無い", { label: "x", value: "y" }],
    ["label が数値", { from: "manifest", label: 1, value: "y" }],
    ["label が無い", { from: "manifest", value: "y" }],
    ["value が数値", { from: "manifest", label: "x", value: 1 }],
    ["value の言語の値が数値", { from: "manifest", label: "x", value: { ja: 1 } }]
  ])("悪い形（%s）は false", (_name, entry) => {
    expect(isIiifMetadataEntry(entry)).toBe(false);
  });

  it("配列は false", () => {
    expect(isIiifMetadataEntry([])).toBe(false);
  });
});

describe("getMapMeta: copiedMetadata の要素の形の検査", () => {
  it("形の合う要素だけを順に返し、外した件数を 1 回だけ警告する", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const source = makeSource({
      iiif: {
        manifest: MANIFEST_URL,
        canvas: CANVAS_URL,
        copiedMetadata: [GOOD_ENTRY_1, ...BAD_ENTRIES, GOOD_ENTRY_2]
      }
    });
    expect(warn).toHaveBeenCalledTimes(1);
    const message = String(warn.mock.calls[0][0]);
    expect(message).toContain("niigata_1920_ndl");
    expect(message).toContain("6");
    expect(metaOf(source, source.mapID).iiif.metadata).toEqual([GOOD_ENTRY_1, GOOD_ENTRY_2]);
    // 同じ地図で getMapMeta を 2 回呼んでも警告は増えない
    expect(metaOf(source, source.mapID).iiif.metadata).toEqual([GOOD_ENTRY_1, GOOD_ENTRY_2]);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("全部良い形なら警告しない", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const source = makeSource({
      iiif: { manifest: MANIFEST_URL, canvas: CANVAS_URL, copiedMetadata: [GOOD_ENTRY_1, GOOD_ENTRY_2] }
    });
    expect(warn).not.toHaveBeenCalled();
    expect(metaOf(source, source.mapID).iiif.metadata).toEqual([GOOD_ENTRY_1, GOOD_ENTRY_2]);
  });
});
