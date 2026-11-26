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
