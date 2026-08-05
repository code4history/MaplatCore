// m6-t4: Google maptype → Tile API { mapType, layerTypes } 導出の単体テスト
// マイルストーン設計 §2.1 / タスク設計 §4.7 の期待値表 7 ケース
import { describe, expect, it } from "vitest";
import { deriveGoogleTileOptions } from "../src/source/googlemap";

describe("deriveGoogleTileOptions (m6-t4)", () => {
  it("#1 google_roadmap + [] → roadmap / []", () => {
    expect(deriveGoogleTileOptions("google_roadmap", [])).toEqual({
      mapType: "roadmap",
      layerTypes: [],
    });
  });

  it("#2 google_satellite + [] → satellite / []", () => {
    expect(deriveGoogleTileOptions("google_satellite", [])).toEqual({
      mapType: "satellite",
      layerTypes: [],
    });
  });

  it("#3 google_hybrid + [] → satellite / [layerRoadmap]", () => {
    expect(deriveGoogleTileOptions("google_hybrid", [])).toEqual({
      mapType: "satellite",
      layerTypes: ["layerRoadmap"],
    });
  });

  it("#4 google_terrain + [] → terrain / [layerRoadmap]", () => {
    expect(deriveGoogleTileOptions("google_terrain", [])).toEqual({
      mapType: "terrain",
      layerTypes: ["layerRoadmap"],
    });
  });

  it("#5 google_hybrid + [traffic] → satellite / [layerRoadmap, layerTraffic]", () => {
    expect(deriveGoogleTileOptions("google_hybrid", ["traffic"])).toEqual({
      mapType: "satellite",
      layerTypes: ["layerRoadmap", "layerTraffic"],
    });
  });

  it("#6 google_hybrid + [roadmap] → satellite / [layerRoadmap]（重複排除）", () => {
    expect(deriveGoogleTileOptions("google_hybrid", ["roadmap"])).toEqual({
      mapType: "satellite",
      layerTypes: ["layerRoadmap"],
    });
  });

  it("#7 google_roadmap + [roadmap] → roadmap / [layerRoadmap]（導出が空でも layers は効く）", () => {
    expect(deriveGoogleTileOptions("google_roadmap", ["roadmap"])).toEqual({
      mapType: "roadmap",
      layerTypes: ["layerRoadmap"],
    });
  });

  it("表外 maptype / undefined は roadmap + ユーザ layers のみ", () => {
    expect(deriveGoogleTileOptions(undefined, undefined)).toEqual({
      mapType: "roadmap",
      layerTypes: [],
    });
    expect(deriveGoogleTileOptions("base", ["traffic"])).toEqual({
      mapType: "roadmap",
      layerTypes: ["layerTraffic"],
    });
  });
});
