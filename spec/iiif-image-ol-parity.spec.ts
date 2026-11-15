// OL 更新で差が出たら IIIF Image API の仕様に照らして正しい側に合わせる。
// OL が正しければ移植を修正する。OL の退行なら以前の URL を文字列で固定し、OL に報告する。
import { describe, expect, it, vi } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import IIIF from "ol/source/IIIF.js";
import IIIFInfo from "ol/format/IIIFInfo.js";
import * as common from "../src/common";

const root = resolve(__dirname, "..");
const files = execFileSync(
  "git",
  ["-C", root, "ls-files", "spec/fixtures/iiif/*.info.json"],
  { encoding: "utf8" }
)
  .trim()
  .split("\n")
  .filter(Boolean);
const fixtures = files.map(name => ({
  name,
  info: JSON.parse(readFileSync(resolve(root, name), "utf8"))
}));
const base = (version: 2 | 3, level = 0): any => ({
  "@context": `http://iiif.io/api/image/${version}/context.json`,
  [version === 2 ? "@id" : "id"]: "https://iiif.example.org/image",
  width: 4074,
  height: 2705,
  profile:
    version === 2
      ? `http://iiif.io/api/image/2/level${level}.json`
      : `level${level}`,
  tiles: [{ width: 256, scaleFactors: [1, 2, 4, 8, 16] }]
});
const variants = [
  {
    name: "percentage region",
    info: { ...base(3), extraFeatures: ["regionByPct", "sizeByW"] }
  },
  {
    name: "height size",
    info: { ...base(3), extraFeatures: ["regionByPx", "sizeByH"] }
  },
  {
    name: "percentage size",
    info: { ...base(3), extraFeatures: ["regionByPx", "sizeByPct"] }
  },
  {
    name: "v3 width size",
    info: { ...base(3), extraFeatures: ["regionByPx", "sizeByW"] }
  },
  { name: "v2 listed tiles", info: base(2) },
  { name: "small image", info: { ...base(3, 1), width: 63, height: 95 } },
  { name: "missing context", info: { ...base(2), "@context": undefined } },
  {
    name: "v1",
    info: { ...base(2), "@context": "http://iiif.io/api/image/1/context.json" }
  },
  { name: "missing profile", info: { ...base(3), profile: undefined } },
  {
    name: "additional profile",
    info: {
      ...base(2),
      profile: [
        "http://iiif.io/api/image/2/level0.json",
        {
          supports: ["regionByPx", "sizeByWh"],
          qualities: ["native"],
          formats: ["png"]
        }
      ]
    }
  },
  {
    name: "v3 extras",
    info: {
      ...base(3),
      extraFeatures: ["regionByPx", "sizeByWh"],
      extraQualities: ["native"],
      extraFormats: ["png", "gif"],
      preferredFormats: ["webp", "png", "gif"]
    }
  },
  {
    name: "no tiles",
    info: {
      ...base(2, 1),
      tiles: undefined,
      sizes: [{ width: 100, height: 66 }]
    }
  },
  {
    name: "context array",
    info: {
      ...base(3, 2),
      "@context": [
        "https://example.org/context",
        "http://iiif.io/api/image/3/context.json"
      ]
    }
  },
  { name: "unknown profile", info: { ...base(2), profile: "level2" } },
  {
    name: "v2 service info path",
    info: { ...base(2, 2), "@id": "https://iiif.example.org/image/info.json" }
  },
  {
    name: "v3 rectangular tiles",
    info: {
      ...base(3, 2),
      tiles: [{ width: 512, height: 256, scaleFactors: [1, 4, 2] }]
    }
  },
  {
    name: "unsupported preferred formats",
    info: { ...base(3, 1), preferredFormats: ["webp", "gif"] }
  }
];

describe("IIIF の解釈と全タイルの URL が OpenLayers と一致する", () => {
  it("追跡された info.json が空でない", () =>
    expect(files.length).toBeGreaterThan(0));

  for (const { name, info } of [...fixtures, ...variants]) {
    it(`${name}: info.json の解釈`, () => {
      const api = common as any;
      expect(typeof api.parseIiifImageInfo).toBe("function");
      const parsed = api.parseIiifImageInfo(info);
      let options: any;
      let level: string | undefined;
      try {
        const oracle = new IIIFInfo(structuredClone(info));
        options = oracle.getTileSourceOptions();
        level = oracle.getComplianceLevelFromProfile(options.version);
      } catch {
        expect(parsed.ok).toBe(false);
        return;
      }
      if (options.version !== "version2" && options.version !== "version3") {
        expect(parsed).toEqual({ ok: false, reason: "unsupported-version" });
        return;
      }
      expect(parsed.ok).toBe(true);
      expect(parsed.service).toEqual({
        version: options.version === "version2" ? "2" : "3",
        level: level ? Number(level.slice(-1)) : 0,
        width: info.width,
        height: info.height,
        id: options.url,
        supports: options.supports,
        format: options.format,
        quality: options.quality,
        tileSize: options.tileSize,
        scaleFactors: options.resolutions,
        sizes: options.sizes
      });
      expect(api.parseIiifImageInfo(JSON.stringify(info))).toEqual(parsed);
    });

    it(`${name}: 全ズーム・全タイルと紙の外`, () => {
      const api = common as any;
      expect(typeof api.iiifTileUrl).toBe("function");
      const checked = api.checkIiifDelivery(info);
      // 必須の枝が判定の退行で除外されても、試験を素通りさせない。
      if (
        [
          "percentage region",
          "height size",
          "percentage size",
          "v3 width size",
          "v2 listed tiles",
          "small image"
        ].includes(name)
      )
        expect(checked.ok).toBe(true);
      if (!checked.ok) return;
      const { service } = api.parseIiifImageInfo(info);
      const url = "https://iiif.example.org/tiles";
      const oracle = new IIIF({
        ...new IIIFInfo(structuredClone(info)).getTileSourceOptions(),
        url,
        tileSize: 256,
        resolutions: undefined
      } as any).getTileUrlFunction();
      const maxZoom = Math.max(
        Math.ceil(Math.log(info.width / 256) / Math.LN2),
        Math.ceil(Math.log(info.height / 256) / Math.LN2)
      );
      const reached = {
        total: 0,
        pctRegion: 0,
        height: 0,
        pctSize: 0,
        width: 0,
        listed: 0,
        full: 0
      };
      for (let z = 0; z <= Math.max(0, maxZoom + 1); z++) {
        const scale = 2 ** (maxZoom - z);
        for (let x = -1; x <= Math.ceil(info.width / scale / 256); x++) {
          for (let y = -1; y <= Math.ceil(info.height / scale / 256); y++) {
            const expected = (oracle as any)([z, x, y], 1, undefined);
            const actual = api.iiifTileUrl(url, service, z, x, y);
            expect(actual, `${name}: ${z}/${x}/${y}`).toBe(expected);
            if (actual === undefined) continue;
            reached.total++;
            const [region, size] = actual.slice(url.length + 1).split("/");
            if (region.startsWith("pct:")) reached.pctRegion++;
            if (size.startsWith(",")) reached.height++;
            if (size.startsWith("pct:")) reached.pctSize++;
            if (/^\d+,$/.test(size)) reached.width++;
            if (
              name === "v2 listed tiles" &&
              /^\d+,\d+,\d+,\d+$/.test(region) &&
              /^\d+,$/.test(size)
            )
              reached.listed++;
            if (region === "full") reached.full++;
          }
        }
      }
      if (name === "small image") expect(reached.total).toBe(0);
      else {
        expect(reached.total).toBeGreaterThan(0);
        expect(reached.full).toBeGreaterThan(0);
      }
      if (name === "percentage region")
        expect(reached.pctRegion).toBeGreaterThan(0);
      if (name === "height size") expect(reached.height).toBeGreaterThan(0);
      if (name === "percentage size")
        expect(reached.pctSize).toBeGreaterThan(0);
      if (name === "v3 width size") expect(reached.width).toBeGreaterThan(0);
      if (name === "v2 listed tiles") expect(reached.listed).toBeGreaterThan(0);
      console.log(
        `${name}: ${reached.total} tiles, full=${reached.full}, pctRegion=${reached.pctRegion}, height=${reached.height}, pctSize=${reached.pctSize}, width=${reached.width}, listed=${reached.listed}`
      );
    });
  }
});

describe("描画に依らない IIIF の配信", () => {
  it("既に中止済みなら fetch を呼ばない", async () => {
    // 既存の入口で先に回帰を示す（common への移動後も同じ関数）。
    const { resolveIiifDelivery } = await import("../src/iiif/delivery");
    const controller = new AbortController();
    controller.abort();
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify(base(2, 1))
    });
    await expect(
      resolveIiifDelivery(
        { type: "iiifImage", url: "https://iiif.example.org/image" },
        { width: 4074, height: 2705 },
        { signal: controller.signal, fetchImpl }
      )
    ).rejects.toMatchObject({ reason: "fetch-failed" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("共通の準備で URL の衝突を除き、最小ズームを渡す", async () => {
    const api = common as any;
    expect(typeof api.prepareIiifDelivery).toBe("function");
    const info = {
      ...base(2),
      tiles: [{ width: 256, scaleFactors: [1, 2, 4] }]
    };
    const fetchImpl = vi
      .fn()
      .mockResolvedValue({ ok: true, text: async () => JSON.stringify(info) });
    const options: any = {
      mapID: "image",
      delivery: { type: "iiifImage", url: info["@id"] },
      url: "old",
      urls: ["old"]
    };
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    try {
      const resolved = await api.prepareIiifDelivery(
        options,
        { width: 4074, height: 2705 },
        { fetchImpl }
      );
      expect(options).not.toHaveProperty("url");
      expect(options).not.toHaveProperty("urls");
      expect(options).not.toHaveProperty("tileUrlFunction");
      expect(options.minZoom).toBe(2);
      expect(api.iiifMinZoom(resolved.service)).toBe(2);
      expect(
        api.iiifMinZoom(api.parseIiifImageInfo(base(2, 1)).service)
      ).toBeUndefined();
      expect(resolved.tileUrl(4, 16, 0)).toBeUndefined();
      expect(resolved.tileUrl(4, 3, 2)).toBe(
        "https://iiif.example.org/image/768,512,256,256/256,/0/default.jpg"
      );
      expect(warn).toHaveBeenCalledTimes(1);
      expect(fetchImpl).toHaveBeenCalledWith(
        "https://iiif.example.org/image/info.json",
        { credentials: "omit", signal: expect.any(AbortSignal) }
      );
      warn.mockClear();
      expect(api.isIiifDelivery(options)).toBe(true);
      expect(api.isIiifDelivery({ delivery: { type: "unknown" } })).toBe(false);
      expect(api.isIiifDelivery(undefined)).toBe(false);
      expect(api.wantsIiifDelivery(options)).toBe(true);
      expect(api.wantsIiifDelivery({})).toBe(false);
      expect(warn).not.toHaveBeenCalled();
    } finally {
      warn.mockRestore();
    }
  });
});
