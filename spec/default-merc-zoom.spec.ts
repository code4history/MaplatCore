// setupMapParameter の既定ズーム（mercZoom が無い地図）を、紙の中心で xy2MercWithLayer が
// 選んだ層の縮尺 s から出す変更の試験（設計書 §7.2 OQ-3・AT-8①）。
// 一様（相似）の地図では旧式（4 点の距離平均 delta = 300 * s）と一致する。
import { describe, expect, it } from "vitest";
import { HistMap_tin } from "../src/source/histmap_tin";
import { MERC_MAX } from "../src/const_ex";
import a from "./fixtures/layered-map/a.json";
import b from "./fixtures/layered-map/b.json";

const modes = ["constant", "grid", undefined] as const;

async function createMap(id: string, data: object): Promise<HistMap_tin> {
  const map = await HistMap_tin.createAsync({
    ...structuredClone(data),
    mapID: id,
    url: `tiles/${id}/{z}/{x}/{y}.jpg`
  });
  await new Promise<void>(resolve => map.setupMapParameter(() => resolve()));
  return map;
}

function fourPointDelta(map: HistMap_tin, index: number): number {
  const surface = map.mapTransform.getSurfaceTransform(index)!;
  const cx = map.width / 2;
  const cy = map.height / 2;
  const points = [
    [cx - 150, cy],
    [cx + 150, cy],
    [cx, cy - 150],
    [cx, cy + 150]
  ].map(p => surface.transform(p, false, index > 0) as number[]);
  const delta1 = Math.hypot(
    points[0][0] - points[1][0],
    points[0][1] - points[1][1]
  );
  const delta2 = Math.hypot(
    points[2][0] - points[3][0],
    points[2][1] - points[3][1]
  );
  return (delta1 + delta2) / 2;
}

function centerLayer(map: HistMap_tin): number {
  const result = map.mapTransform.xy2MercWithLayer([map.width / 2, map.height / 2]);
  if (!result) throw new Error("地図の中心を投影できません");
  return result[0];
}

function oldZoom(delta: number): number {
  return Math.log((300 * (2 * MERC_MAX)) / 256 / delta) / Math.log(2) - 3;
}

function newZoom(s: number): number {
  return Math.log2((2 * MERC_MAX) / (256 * s)) - 3;
}

describe("setupMapParameter の既定ズーム（mercZoom が無い地図）", () => {
  it.each(modes)(
    "一様（相似）の地図で新旧の式が同じ値になる（viewpointMode: %s）",
    async viewpointMode => {
      const map = await createMap("default-zoom-uniform", {
        ...a,
        viewpointMode
      });
      const center = [map.width / 2, map.height / 2];
      const index = centerLayer(map);
      expect(index).toBe(0);
      const delta = fourPointDelta(map, index);
      const { s } = map.mapTransform.probeViewpointCoefficients(
        index,
        [center[0], center[1]],
        150
      );
      // 一様図では 4 点の距離平均 delta は 300 * s
      expect(delta).toBeCloseTo(300 * s, 6);
      expect(map.mercZoom).toBeCloseTo(oldZoom(delta), 9);
      expect(map.mercZoom).toBeCloseTo(newZoom(s), 9);
    }
  );

  it.each(modes)(
    "mercZoom がある地図では値が変わらない（viewpointMode: %s）",
    async viewpointMode => {
      const map = await createMap("default-zoom-given", {
        ...a,
        viewpointMode,
        mercZoom: 15
      });
      expect(map.mercZoom).toBe(15);
    }
  );

  it.each(modes)(
    "width < 300 の地図でも有限の値になる（viewpointMode: %s）",
    async viewpointMode => {
      const map = await createMap("default-zoom-small", {
        ...a,
        viewpointMode,
        width: 256,
        height: 256
      });
      expect(Number.isFinite(map.mercZoom)).toBe(true);
    }
  );

  it.each(modes)(
    "中心に副層が載る地図では選んだ層の縮尺を使う（viewpointMode: %s）",
    async viewpointMode => {
      const sub = {
        ...structuredClone(b.sub_maps[0]),
        bounds: [
          [200, 200],
          [320, 200],
          [320, 320],
          [200, 320]
        ]
      };
      const map = await createMap("default-zoom-sub", {
        ...b,
        viewpointMode,
        sub_maps: [sub, ...structuredClone(b.sub_maps).slice(1)]
      });
      const center = [map.width / 2, map.height / 2];
      const index = centerLayer(map);
      expect(index).toBe(1);
      const s =
        viewpointMode === "constant"
          ? map.mapTransform.getViewpointCoefficients(index, center).s
          : map.mapTransform.probeViewpointCoefficients(
              index,
              [center[0], center[1]],
              150
            ).s;
      expect(map.mercZoom).toBeCloseTo(newZoom(s), 9);
    }
  );
});
