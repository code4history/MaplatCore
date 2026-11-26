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
      expect(c.vertices_points).toHaveLength(36);
      expect(c.tins_points[0].length).toBeGreaterThan(0);
      for (const t of c.tins_points[0] as (number | string)[][]) {
        for (const v of t) {
          const ok = typeof v === "number" ? v < c.points.length : /^b\d+$/.test(v) && Number(v.slice(1)) < 36;
          expect(ok).toBe(true);
        }
      }
    }
    expect(load("layered_demo_tin9").compiled.centroid_point).toBeTruthy();
    expect(load("layered_demo_gcp_c").compiled.centroid_point).toBeTruthy();
    expect(load("layered_demo_gcp_b").compiled.centroid_point).toBeUndefined();
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
