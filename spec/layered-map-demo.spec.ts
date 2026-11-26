import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { store2HistMap4Core } from "../src/source/store_handler";

// layered-map.html（変換の形のデモ）の素材。作り直したときに Core が読めなくなっていないことを守る
const load = (id: string) =>
  JSON.parse(readFileSync(`public/maps/${id}.json`, "utf-8"));
const surfaceOf = async (id: string) => {
  const [, transform] = await store2HistMap4Core({ mapID: id, ...load(id) });
  return transform.getSurfaceTransform(0) as any;
};

describe("変換の形のデモの素材", () => {
  it("world file の地図 (a)・(c) は world file の面として読める", async () => {
    for (const id of ["layered_demo_wf4326", "layered_demo_wf3857"]) {
      const surface = await surfaceOf(id);
      expect(typeof surface.xyToCrs).toBe("function");
    }
  });

  it("三角網の地図 (b) は扇形、B は四辺形の外が world file、C は扇形", async () => {
    expect((await surfaceOf("layered_demo_tin9")).outerTransform).toBe("extrapolate");
    const b = await surfaceOf("layered_demo_gcp_b");
    expect(b.outerTransform).toBe("worldFile");
    expect(b.crs).toEqual({ epsg: 4326 });
    const c = await surfaceOf("layered_demo_gcp_c");
    expect(c.outerTransform).toBe("extrapolate");
  });

  it("world file の地図 (a)・(c) は比較用の対応点を持ち、(a) は両側が一致し (c) はずれる", async () => {
    const R = 6378137;
    const lat = (y: number) => ((2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * 180) / Math.PI;
    for (const id of ["layered_demo_wf4326", "layered_demo_wf3857"]) {
      const json = load(id);
      expect(json.gcps).toHaveLength(16);
      const surface = await surfaceOf(id);
      let max = 0;
      for (const [px, geo] of json.gcps as [number[], number[]][]) {
        const merc = surface.transform(px, false); // 紙の画素を、地図が写す先（3857）
        const latTrue = id === "layered_demo_wf4326" ? geo[1] : lat(geo[1]); // (a) は経緯度、(c) は 3857 の座標
        max = Math.max(max, Math.abs(lat(merc[1]) - latTrue));
      }
      if (id === "layered_demo_wf4326") expect(max).toBeLessThan(1e-6);
      else expect(max).toBeGreaterThan(0.1);
    }
  });

  it("三角網の地図は構造（GCP・補助頂点・三角形）を紙の画素で持つ。C と (b) は重心を持つ", () => {
    for (const id of ["layered_demo_tin9", "layered_demo_gcp_b", "layered_demo_gcp_c"]) {
      const c = load(id).compiled;
      expect(c.points.length).toBeGreaterThan(0);
      expect(c.vertices_points).toHaveLength(32);
      expect(c.tins_points[0].length).toBeGreaterThan(0);
      for (const t of c.tins_points[0] as (number | string)[][]) {
        for (const v of t) {
          const ok = typeof v === "number" ? v < c.points.length : /^b\d+$/.test(v) && Number(v.slice(1)) < 32;
          expect(ok).toBe(true);
        }
      }
    }
    expect(load("layered_demo_tin9").compiled.centroid_point).toBeTruthy();
    expect(load("layered_demo_gcp_c").compiled.centroid_point).toBeTruthy();
    expect(load("layered_demo_gcp_b").compiled.centroid_point).toBeUndefined();
  });

  it("扇形の中心は GCP の重心で、補助頂点は上下左右に対称に並び、GCP だけの三角形がある", () => {
    // Tin の「GCP の凸包の辺を制約にする」「扇形の中心を GCP の重心にする」版（MaplatTin#88）で作った素材。
    // 紙の中央 (1024, 1024) を中心に、(b) の 9 点も C の 25 点も点対称・線対称に置いてある
    for (const id of ["layered_demo_tin9", "layered_demo_gcp_c"]) {
      const centroid = load(id).compiled.centroid_point[0] as number[];
      expect(centroid[0]).toBeCloseTo(1024, 6);
      expect(centroid[1]).toBeCloseTo(1024, 6);
    }
    for (const id of ["layered_demo_tin9", "layered_demo_gcp_b", "layered_demo_gcp_c"]) {
      const c = load(id).compiled;
      const aux = c.vertices_points.map((v: number[][]) => v[0]) as number[][];
      const has = (x: number, y: number) =>
        aux.some(([ax, ay]) => Math.abs(ax - x) < 1e-3 && Math.abs(ay - y) < 1e-3);
      for (const [x, y] of aux) {
        expect(has(2048 - x, y)).toBe(true); // 左右
        expect(has(x, 2048 - y)).toBe(true); // 上下
      }
      const gcpOnly = (c.tins_points[0] as (number | string)[][]).filter(t =>
        t.every(v => typeof v === "number")
      );
      // 3×3 の 9 点は 2×2 の升目を 2 つずつの三角形（8）、5×5 の 25 点は 4×4 の升目（32）
      expect(gcpOnly).toHaveLength(id === "layered_demo_tin9" ? 8 : 32);
    }
  });

  it("紙の中央は同じ画素が (a) と (c) で異なる緯度を指す", async () => {
    const a = await surfaceOf("layered_demo_wf4326");
    const c = await surfaceOf("layered_demo_wf3857");
    const toLat = (merc: number[]) =>
      ((2 * Math.atan(Math.exp(merc[1] / 6378137)) - Math.PI / 2) * 180) / Math.PI;
    const pa = toLat(a.transform([1024, 1024], false));
    const pc = toLat(c.transform([1024, 1024], false));
    expect(pa).toBeCloseTo(37.5, 3);
    expect(Math.abs(pc - pa)).toBeGreaterThan(0.2);
  });
});
