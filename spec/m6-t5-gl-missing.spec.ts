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

// M6-T5 AC22: provider-only app + GL 未ロードでも handleSources が停止しない（v1.3 M2）
// 実経路を通すため handleSources を直接駆動する（startFrom 設定による setInitialMap 回避は禁止）
import { MaplatApp } from "../src/index";

function makeAppStub() {
  const app: any = Object.create(MaplatApp.prototype);
  app.mapObject = { on: vi.fn() };
  app.cacheHash = undefined;
  app.mercSrc = undefined;
  app.from = undefined;
  app.mapboxMap = undefined;
  app.maplibreMap = undefined;
  app.logger = undefined;
  app.initialRestore = {};
  app.startFrom = undefined;
  app.dispatchEvent = vi.fn();
  app.setInitialMap = vi.fn().mockResolvedValue(undefined);
  app.setMapClick = vi.fn();
  app.setPointerEvents = vi.fn();
  app.setMapOnOff = vi.fn();
  app.setMouseCursor = vi.fn();
  app.setBackMapBehavior = vi.fn();
  app.raiseChangeViewpoint = vi.fn();
  app.runLifecyclePhase = vi.fn().mockResolvedValue(undefined);
  return app;
}

const mapboxSource = {
  mapID: "mb1",
  isBasemap: () => true,
  isMapbox: () => true,
  isMapLibre: () => false,
  setMap: vi.fn()
};

describe("m6-t5: handleSources provider-only + GL missing (AC22)", () => {
  it("cache 空: throw せず handler 未登録・sourceLoaded dispatch・lifecycle 2相は実行", async () => {
    const app = makeAppStub();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(app.handleSources([mapboxSource])).resolves.not.toThrow?.();
    // sourceLoaded は維持
    expect(app.dispatchEvent).toHaveBeenCalledTimes(1);
    expect(String(app.dispatchEvent.mock.calls[0][0].type)).toBe("sourceLoaded");
    // cache 空
    expect(app.cacheHash).toEqual({});
    // init tail（setInitialMap 以降）が呼ばれない
    for (const m of ["setInitialMap","setMapClick","setPointerEvents","setMapOnOff","setMouseCursor","setBackMapBehavior","raiseChangeViewpoint"]) {
      expect(app[m], m).not.toHaveBeenCalled();
    }
    // mapObject.on にもハンドラ登録されない（postrender/pointermove 等）
    expect(app.mapObject.on).not.toHaveBeenCalled();
    // lifecycle 2相は実行
    expect(app.runLifecyclePhase).toHaveBeenCalledWith("core-ready");
    expect(app.runLifecyclePhase).toHaveBeenCalledWith("ui-ready");
    // warn が出ている
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("混在 app（histmap + provider basemap、GL 無し）: mercSrc は cache から選ばれ死んだ provider を指さない（v1.3.1 m4）", async () => {
    const app = makeAppStub();
    const hist = {
      mapID: "h1",
      isBasemap: () => false,
      isMapbox: () => false,
      isMapLibre: () => false,
      setMap: vi.fn()
    };
    await app.handleSources([hist, mapboxSource]);
    // mapbox は cache に入らない
    expect(Object.keys(app.cacheHash)).toEqual(["h1"]);
    // mercSrc は cache（hist のみ）から選ばれる → basemap 不在で null/undefined。
    // 未フィルタ sources から選ぶ旧実装だと mapboxSource を指してしまう
    expect(app.mercSrc ?? null).toBe(null);
    // cache 非空なので init tail は通常どおり走る
    expect(app.setInitialMap).toHaveBeenCalledWith([hist]);
    expect(app.raiseChangeViewpoint).toHaveBeenCalled();
  });
});
