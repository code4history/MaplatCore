// oct26-m2-t4 AC10 (b): GPS / POI の表示候補 selectDisplayCandidates（MaplatCore#104）
//
// - merc2XyVisibleLayers を持たない Transform（1.0.x 相当のスタブ）では null（従来経路へのフォールバック合図）
// - 兄弟 symlink の Transform（T4a）で、紙外の本図を除いた「後で」2 件を切り出す（設計 §4.3・M-7）
// fixture は e2e と同じ e2e/fixtures/oct26-m2-t4/*.json（compiled は MaplatTransform の tests/compiled と同一）
//
// 解決された @maplat/transform に merc2XyVisibleLayers が無い環境（standalone CI が lock どおり Transform 1.0.0 を
// 解決する間）では、新メソッドを前提とする検査を理由つきで skip する（e2e/oct26-m2-t4-gps-poi.spec.ts と同じ判定）。
// 新メソッドが無いときに null を返す経路の検査は skip しない（CI でこそ検査すべき経路）。
// 前提テストは兄弟 symlink（node_modules/@maplat/transform → ../../../MaplatTransform）の環境でのみ実行する。
// pnpm の standalone 解決も node_modules/.pnpm への symlink なので、実体パスが node_modules の外にあることで判定する。
import { describe, it, expect } from "vitest";
import { readFileSync, realpathSync } from "fs";
import { resolve, sep } from "path";
import { MapTransform } from "@maplat/transform";
import { selectDisplayCandidates } from "../src/source/display_candidates";

const SKIP_REASON = "@maplat/transform に merc2XyVisibleLayers が無い。M6 の lock 再生成後に有効";
const HAS_VISIBLE_LAYERS =
  typeof (new MapTransform() as unknown as { merc2XyVisibleLayers?: unknown }).merc2XyVisibleLayers ===
  "function";
const IS_SIBLING_SYMLINK = (() => {
  try {
    const real = realpathSync(resolve(__dirname, "../node_modules/@maplat/transform"));
    return !real.split(sep).includes("node_modules");
  } catch {
    return false;
  }
})();

const fixture = (name: string) =>
  JSON.parse(
    readFileSync(resolve(__dirname, `../e2e/fixtures/oct26-m2-t4/${name}.json`), "utf8")
  );

const loadMt = (name: string) => {
  const f = fixture(name);
  const mt = new MapTransform();
  mt.setMapData({ compiled: f.compiled, sub_maps: f.sub_maps });
  return { mt, width: f.width as number, height: f.height as number };
};

const mainPx2Merc = ([x, y]: [number, number]) => [14600000 + 2 * x, 3800000 - 2 * y];

const expectClose = (actual: [number, number[]][] | null, expected: [number, [number, number]][]) => {
  expect(actual).not.toBeNull();
  expect(actual!.map(([i]) => i)).toEqual(expected.map(([i]) => i));
  actual!.forEach(([, xy], k) => {
    expect(Math.abs(xy[0] - expected[k][1][0])).toBeLessThan(0.01);
    expect(Math.abs(xy[1] - expected[k][1][1])).toBeLessThan(0.01);
  });
};

describe("oct26-m2-t4: selectDisplayCandidates", () => {
  it("merc2XyVisibleLayers を持たない Transform（1.0.x 相当）では null を返す", () => {
    const stub = {
      merc2XyWithLayer: () => [[0, [1, 1]]]
    } as unknown as MapTransform;
    expect(selectDisplayCandidates(stub, [0, 0], () => true)).toBeNull();
  });

  it("兄弟 symlink の Transform が merc2XyVisibleLayers を提供している（前提）", ({ skip }) => {
    skip(!IS_SIBLING_SYMLINK, "@maplat/transform が兄弟 symlink ではない（standalone 解決）ため前提の検査は対象外");
    expect(typeof (new MapTransform() as any).merc2XyVisibleLayers).toBe("function");
  });

  it("D-6layer の本図 (-500,768): 紙外の本図を除いてから 2 件 → [[2,(1661.9,290)],[5,(301.9,290)]]", ({ skip }) => {
    skip(!HAS_VISIBLE_LAYERS, SKIP_REASON);
    const { mt, width, height } = loadMt("synthetic6");
    const inside = (xy: number[]) => !(xy[0] < 0 || xy[0] > width || xy[1] < 0 || xy[1] > height);
    expectClose(selectDisplayCandidates(mt, mainPx2Merc([-500, 768]), inside), [
      [2, [1661.9, 290]],
      [5, [301.9, 290]]
    ]);
  });

  it("D-4layer の (1700,1250): 可視対応層なし → []", ({ skip }) => {
    skip(!HAS_VISIBLE_LAYERS, SKIP_REASON);
    const { mt, width, height } = loadMt("synthetic4");
    const inside = (xy: number[]) => !(xy[0] < 0 || xy[0] > width || xy[1] < 0 || xy[1] > height);
    expect(selectDisplayCandidates(mt, mainPx2Merc([1700, 1250]), inside)).toEqual([]);
  });

  it("紙内判定は 2 件切り出しの前に適用する（insideCheckXy に渡る件数が全件）", ({ skip }) => {
    skip(!HAS_VISIBLE_LAYERS, SKIP_REASON);
    const { mt } = loadMt("synthetic6");
    const seen: number[][] = [];
    const result = selectDisplayCandidates(mt, mainPx2Merc([-500, 768]), xy => {
      seen.push(xy);
      return true;
    });
    expect(seen).toHaveLength(3);
    expect(result).toHaveLength(2);
    expect(result!.map(([i]) => i)).toEqual([0, 2]);
  });
});
