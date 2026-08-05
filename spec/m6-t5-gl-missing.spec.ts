// M6-T5 AC10: GL 未ロード時に throw せず当該ソースを落とす
import { describe, it, expect, vi } from "vitest";
import { bindProviderGlToSource } from "../src/provider_gl_bind";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("m6-t5: provider GL bind (AC10)", () => {
  it("mapbox ソースで mapboxMap 無し → skip (false) かつ warn、throw しない", () => {
    const warn = vi.fn();
    const source = {
      mapID: "mb1",
      isMapbox: () => true,
      isMapLibre: () => false
    };
    expect(() =>
      bindProviderGlToSource(source, { mapboxMap: undefined, warn })
    ).not.toThrow();
    expect(bindProviderGlToSource(source, { mapboxMap: undefined, warn })).toBe(
      false
    );
    expect(warn).toHaveBeenCalled();
    expect(String(warn.mock.calls[0][0])).toMatch(/Mapbox GL JS is not available/);
  });

  it("maplibre ソースで maplibreMap 無し → skip", () => {
    const warn = vi.fn();
    const source = {
      mapID: "ml1",
      isMapbox: () => false,
      isMapLibre: () => true
    };
    expect(bindProviderGlToSource(source, { maplibreMap: undefined, warn })).toBe(
      false
    );
    expect(warn).toHaveBeenCalled();
  });

  it("mapbox ソースで mapboxMap あり → ok かつ割り当て", () => {
    const gl = { id: "mb-gl" };
    const source: {
      mapID: string;
      isMapbox: () => boolean;
      isMapLibre: () => boolean;
      mapboxMap?: unknown;
    } = {
      mapID: "mb1",
      isMapbox: () => true,
      isMapLibre: () => false
    };
    expect(bindProviderGlToSource(source, { mapboxMap: gl })).toBe(true);
    expect(source.mapboxMap).toBe(gl);
  });

  it("maplibre ソースで maplibreMap あり → ok かつ割り当て", () => {
    const gl = { id: "ml-gl" };
    const source: {
      mapID: string;
      isMapbox: () => boolean;
      isMapLibre: () => boolean;
      maplibreMap?: unknown;
    } = {
      mapID: "ml1",
      isMapbox: () => false,
      isMapLibre: () => true
    };
    expect(bindProviderGlToSource(source, { maplibreMap: gl })).toBe(true);
    expect(source.maplibreMap).toBe(gl);
  });

  it("非 GL ソースはそのまま ok", () => {
    const source = {
      mapID: "osm",
      isMapbox: () => false,
      isMapLibre: () => false
    };
    expect(bindProviderGlToSource(source, {})).toBe(true);
  });

  it("index.ts が throw 文字列を使わず bindProviderGlToSource を呼ぶ", () => {
    const src = readFileSync(
      resolve(__dirname, "../src/index.ts"),
      "utf8"
    );
    expect(src).toContain("bindProviderGlToSource");
    expect(src).not.toMatch(
      /throw ["']To use Mapbox based maps/
    );
    expect(src).not.toMatch(
      /throw ["']To use MapLibre based maps/
    );
  });
});

// M6-T5 AC11: devDependencies の maplibre-gl が import 解決できること
describe("m6-t5: maplibre-gl devDep resolution (AC11)", () => {
  it("package.json に maplibre-gl devDep（script タグ用 UMD がある 5.6.2。peer は ^5||^6）", async () => {
    const pkg = JSON.parse(
      readFileSync(resolve(__dirname, "../package.json"), "utf8")
    );
    expect(pkg.devDependencies["maplibre-gl"]).toBe("5.6.2");
    expect(pkg.peerDependencies["maplibre-gl"]).toBe("^5.0.0 || ^6.0.0");
    expect(pkg.peerDependencies["mapbox-gl"]).toBe("^2.0.0 || ^3.0.0");
  });

  it("maplibre-gl がモジュール解決できる（実行はブラウザ API 依存のため resolve まで）", () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createRequire } = require("node:module") as typeof import("node:module");
    const req = createRequire(resolve(__dirname, "../package.json"));
    expect(() => req.resolve("maplibre-gl")).not.toThrow();
  });
});
