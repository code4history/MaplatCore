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

for (const { id, expected: e } of cases) {
  describe(`実在 Manifest: ${id}`, () => {
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
      expect(source.retrievedOn).toBe("2026-11-11");
      // CORS は Origin を付けた要求で記録する（付けないと返さないサーバーがある）
      expect(source.infoRequestHeaders.origin).toBe("https://example.org");
      expect(source.terms).toBeTruthy();
      expect(source.termsUrl).toMatch(/^https:\/\//);
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
    });
  });
}
