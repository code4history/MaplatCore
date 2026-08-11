import { describe, it, expect } from "vitest";
import { setCustomFunction } from "../src/source/mixin";

// listPoiLayers はレイヤキーのアルファベット順ではなく、
// pois オブジェクトの定義順（= アプリ設定の pois 配列順）を保持し、
// main レイヤのみ先頭固定であることを検証する。
describe("listPoiLayers order", () => {
  const Mixed = setCustomFunction(class {});
  const listPoiLayers = (Mixed.prototype as any).listPoiLayers as (
    hideOnly?: boolean,
    nonzero?: boolean
  ) => any[];

  const makeLayer = (id: string, poisCount = 1, hide = false) => ({
    namespaceID: `test#${id}`,
    pois: Array.from({ length: poisCount }, (_, i) => ({ id: `${id}#${i}` })),
    ...(hide ? { hide: true } : {})
  });

  it("preserves definition order (not alphabetical) with main first", () => {
    // 定義順: zebra -> alpha -> main -> middle (アルファベット順だと alpha, middle, zebra)
    const self = {
      pois: {
        zebra: makeLayer("zebra"),
        alpha: makeLayer("alpha"),
        main: makeLayer("main"),
        middle: makeLayer("middle")
      }
    };
    const result = listPoiLayers.call(self);
    expect(result.map(l => l.namespaceID)).toEqual([
      "test#main",
      "test#zebra",
      "test#alpha",
      "test#middle"
    ]);
  });

  it("keeps definition order when filtering empty layers (nonzero)", () => {
    const self = {
      pois: {
        charlie: makeLayer("charlie", 2),
        bravo: makeLayer("bravo", 0),
        main: makeLayer("main", 1),
        alpha: makeLayer("alpha", 1)
      }
    };
    const result = listPoiLayers.call(self, false, true);
    expect(result.map(l => l.namespaceID)).toEqual([
      "test#main",
      "test#charlie",
      "test#alpha"
    ]);
  });

  it("keeps definition order for hidden layers (hideOnly)", () => {
    const self = {
      pois: {
        delta: makeLayer("delta", 1, true),
        main: makeLayer("main", 1),
        bravo: makeLayer("bravo", 1, true)
      }
    };
    const result = listPoiLayers.call(self, true);
    expect(result.map(l => l.namespaceID)).toEqual([
      "test#delta",
      "test#bravo"
    ]);
  });
});
