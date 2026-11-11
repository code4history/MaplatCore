// JSON 原文から固定した期待値。製品の出力を期待値の生成に使わない。
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { Socket } from "node:net";
import { resolve } from "node:path";
import {
  listIiifCanvases,
  proposeIiifBindings,
  resolveIiifMetadata
} from "../src/iiif/manifest";
import { checkIiifDelivery } from "../src/iiif/delivery";

const directory = resolve(__dirname, "fixtures/iiif/real");
const read = (file: string) =>
  JSON.parse(readFileSync(resolve(directory, file), "utf8"));
const cases = read("cases.json");

beforeAll(() => {
  const deny = () => {
    throw new Error("実在 fixture の試験から通信してはいけません");
  };
  vi.stubGlobal("fetch", deny);
  vi.spyOn(Socket.prototype, "connect").mockImplementation(deny);
});
afterAll(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/** JSON の中の http(s) の URL を全部集める（自作 fixture に実在の URL が無いことを測る） */
function urlsIn(value: unknown, found: string[] = []): string[] {
  if (typeof value === "string") {
    if (/^https?:\/\//.test(value)) found.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) urlsIn(item, found);
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) urlsIn(item, found);
  }
  return found;
}

/** 自作 fixture に置いてよい URL の host（架空の example.org と、仕様・ライセンスの URI） */
const SYNTHETIC_HOSTS = new Set([
  "example.org",
  "iiif.example.org",
  "iiif.io",
  "creativecommons.org"
]);

for (const { id, synthetic, expected: e } of cases) {
  describe(`${synthetic ? "自作の再現" : "実在"} Manifest: ${id}`, () => {
    const manifest = read(`${id}.manifest.json`);
    const info = read(`${id}.info.json`);
    const source = read(`${id}.source.json`);

    it("取得したバイト列・出典・利用条件を保持する", () => {
      for (const suffix of ["manifest", "info"]) {
        const bytes = readFileSync(resolve(directory, `${id}.${suffix}.json`));
        expect(createHash("sha256").update(bytes).digest("hex")).toBe(
          source.sha256[suffix]
        );
      }
      // CORS は Origin を付けた要求で記録する（付けないと返さないサーバーがある）
      expect(source.infoRequestHeaders.origin).toBe("https://example.org");
      expect(source.terms).toBeTruthy();
      if (synthetic) {
        // 自作は取得日を持たず、自作であることと架空の URL だけであることを記録に残す
        expect(source.synthetic).toBe(true);
        expect(source.createdOn).toBe("2026-11-11");
        expect(source.retrievedOn).toBeUndefined();
        expect(source.reproduces).toBeTruthy();
        const urls = [manifest, info, source].flatMap(json => urlsIn(json));
        expect(urls.length).toBeGreaterThan(0);
        expect(
          urls.filter(url => !SYNTHETIC_HOSTS.has(new URL(url).hostname))
        ).toEqual([]);
      } else {
        expect(source.synthetic).toBeUndefined();
        expect(source.retrievedOn).toBe("2026-11-11");
        expect(source.termsUrl).toMatch(/^https:\/\//);
      }
    });

    it("canvas の数・選択 canvas・サービスを固定値と照合する", () => {
      const result = listIiifCanvases(manifest);
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.version).toBe(e.version);
      expect(result.canvases).toHaveLength(e.canvasCount);
      expect(result.canvases[e.canvasIndex]).toMatchObject({
        id: e.canvasId,
        ...e.canvasSize,
        imageService: e.imageService
      });
      // 選択 canvas 以外も、どの canvas にも画像サービスが読める
      const missing = result.canvases.filter(
        canvas => typeof canvas.imageService !== "string"
      );
      expect(missing.map(canvas => canvas.id)).toEqual([]);
    });

    it("どの canvas を選んでも題名の既定は Manifest の label", () => {
      const listed = listIiifCanvases(manifest);
      if (!listed.ok) throw new Error(listed.reason);
      for (const canvas of listed.canvases) {
        const bindings = proposeIiifBindings(manifest, canvas.id);
        expect(bindings.title).toEqual({ from: "manifest", property: "label" });
        expect(Object.keys(bindings).sort()).toEqual([...e.bindingKeys].sort());
        const copied = resolveIiifMetadata(
          manifest,
          { canvas: canvas.id, bindings },
          e.lang,
          html => html
        );
        if (!copied.ok) throw new Error(copied.reason);
        expect(copied.values.title).toEqual(e.titleValue);
        expect(copied.copiedValues.title).toEqual({ [e.lang]: e.title });
      }
    });

    it("既定の書誌・ライセンス・書誌表を原文から決めた値と照合する", () => {
      const bindings = proposeIiifBindings(manifest, e.canvasId);
      const copied = resolveIiifMetadata(
        manifest,
        { canvas: e.canvasId, bindings },
        e.lang,
        html => html
      );
      if (!copied.ok) throw new Error(copied.reason);
      expect(copied.unresolved).toEqual([]);
      expect(copied.copiedMetadata).toHaveLength(e.metadataCount);
      if (e.firstMetadata)
        expect(copied.copiedMetadata[0]).toEqual(e.firstMetadata);
      expect(copied.values.license).toBe(e.license ?? undefined);
      expect(
        Object.keys(copied.values)
          .filter(key => key !== "licenseNote")
          .sort()
      ).toEqual([...e.bindingKeys].sort());
    });

    it("実画素数は info.json で検査し、異なる記録寸法を拒む", () => {
      expect({ width: info.width, height: info.height }).toEqual(e.imageSize);
      expect(info.id ?? info["@id"]).toBe(e.deliveryServiceUrl);
      expect(checkIiifDelivery(info, e.imageSize)).toEqual({
        ok: true,
        version: e.imageVersion,
        level: e.level,
        tiling: "arbitrary"
      });
      expect(
        checkIiifDelivery(info, {
          ...e.imageSize,
          width: e.imageSize.width + 1
        })
      ).toEqual({
        ok: false,
        reason: "size-mismatch"
      });
      // canvas の寸法で照合した結果（canvas と info.json が食い違う資料は不一致）
      const sameSize =
        e.canvasSize.width === e.imageSize.width &&
        e.canvasSize.height === e.imageSize.height;
      expect(checkIiifDelivery(info, e.canvasSize).ok).toBe(sameSize);
    });
  });
}

describe("自作の再現 fixture: canvas が page 1・仮の 6000×6000 の Presentation 2", () => {
  const entry = cases.find(
    (item: { id: string }) => item.id === "synthetic-p2-page1"
  );
  const e = entry.expected;
  const manifest = read("synthetic-p2-page1.manifest.json");
  const info = read("synthetic-p2-page1.info.json");

  it("自作であることを cases.json と source.json の両方に記録する", () => {
    expect(entry.synthetic).toBe(true);
    expect(read("synthetic-p2-page1.source.json").synthetic).toBe(true);
    expect(readFileSync(resolve(directory, "README.md"), "utf8")).toContain(
      "synthetic-p2-page1"
    );
  });

  it("題名の既定は Manifest の label で、canvas の page 1 にならない", () => {
    const listed = listIiifCanvases(manifest);
    if (!listed.ok) throw new Error(listed.reason);
    expect(listed.canvases).toHaveLength(1);
    expect(listed.canvases[0].label).toBe("page 1");
    const bindings = proposeIiifBindings(manifest, e.canvasId);
    expect(bindings.title).toEqual({ from: "manifest", property: "label" });
    const copied = resolveIiifMetadata(
      manifest,
      { canvas: e.canvasId, bindings },
      "ja",
      html => html
    );
    if (!copied.ok) throw new Error(copied.reason);
    expect(copied.values.title).toBe(e.title);
    expect(copied.values.title).not.toBe("page 1");
  });

  it("大きさは info.json の値で判定し、canvas の 6000×6000 とは不一致になる", () => {
    const listed = listIiifCanvases(manifest);
    if (!listed.ok) throw new Error(listed.reason);
    expect(listed.canvases[0]).toMatchObject({ width: 6000, height: 6000 });
    expect({ width: info.width, height: info.height }).toEqual({
      width: 11959,
      height: 12961
    });
    expect(checkIiifDelivery(info, { width: 11959, height: 12961 })).toEqual({
      ok: true,
      version: "2",
      level: 1,
      tiling: "arbitrary"
    });
    expect(checkIiifDelivery(info, { width: 6000, height: 6000 })).toEqual({
      ok: false,
      reason: "size-mismatch"
    });
  });
});
