// 地図 JSON 最上位の viewpointMode を store_handler が Transform の LayeredMapData へ
// 素通しする試験（設計書 §3.2・AT-8①）。副層（sub_maps）には持ち込まない。
import { MapTransform, type LayeredMapData } from "@maplat/transform";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  histMap2Store,
  store2HistMap,
  store2HistMap4Core
} from "../src/source/store_handler";
import a from "./fixtures/layered-map/a.json";
import b from "./fixtures/layered-map/b.json";

type CoreStore = Parameters<typeof store2HistMap4Core>[0];

function captureLayeredMapData() {
  return vi.spyOn(MapTransform.prototype, "setLayeredMapData");
}

afterEach(() => vi.restoreAllMocks());

describe("viewpointMode の素通し（store2HistMap4Core）", () => {
  it("最上位の viewpointMode を LayeredMapData へ渡す（最上位のみ）", async () => {
    for (const [viewpointMode, expected] of [
      ["constant", "constant"],
      ["grid", "grid"],
      [undefined, "grid"]
    ] as const) {
      const spy = captureLayeredMapData();
      const [, transform] = await store2HistMap4Core({
        ...structuredClone(a),
        mapID: "vm-top",
        viewpointMode
      } as unknown as CoreStore);
      const mapData = spy.mock.calls[0][0] as LayeredMapData;
      // 無ければ undefined のまま渡し、Transform の既定（"grid"）に任せる
      expect(mapData.viewpointMode).toBe(viewpointMode);
      expect(transform.viewpointMode).toBe(expected);
      spy.mockRestore();
    }
  });

  it("sub_maps があっても最上位のみ渡し、副層には持ち込まない", async () => {
    const subWithMode = {
      ...structuredClone(b.sub_maps[0]),
      viewpointMode: "constant"
    };
    const sub_maps = [subWithMode, ...structuredClone(b.sub_maps).slice(1)];
    const spy = captureLayeredMapData();
    const [, transform] = await store2HistMap4Core({
      ...structuredClone(b),
      mapID: "vm-sub",
      viewpointMode: "grid",
      sub_maps
    } as unknown as CoreStore);
    const mapData = spy.mock.calls[0][0] as LayeredMapData;
    expect(mapData.viewpointMode).toBe("grid");
    expect(transform.viewpointMode).toBe("grid");
    expect(mapData.sub_maps).toHaveLength(2);
    for (const layer of mapData.sub_maps!) {
      expect(Object.hasOwn(layer, "viewpointMode")).toBe(false);
    }
    spy.mockRestore();

    // 副層だけの viewpointMode は捨て、最上位が無ければ Transform の既定（"grid"）になる
    const [, subOnly] = await store2HistMap4Core({
      ...structuredClone(b),
      mapID: "vm-sub-only",
      sub_maps
    } as unknown as CoreStore);
    expect(subOnly.viewpointMode).toBe("grid");
  });

  it("不正な値は捨てて Transform の既定（\"grid\"）に任せる", async () => {
    for (const viewpointMode of ["bogus", "", "GRID", 123, null, {}]) {
      const [, transform] = await store2HistMap4Core({
        ...structuredClone(a),
        mapID: "vm-invalid",
        viewpointMode
      } as unknown as CoreStore);
      expect(transform.viewpointMode).toBe("grid");
    }
    const [, transform] = await store2HistMap4Core({
      ...structuredClone(a),
      mapID: "vm-invalid-none"
    } as unknown as CoreStore);
    expect(transform.viewpointMode).toBe("grid");
  });

  it("store2HistMap → histMap2Store の往復でも最上位の viewpointMode が残る", async () => {
    const store = {
      ...structuredClone(a),
      mapID: "vm-roundtrip",
      viewpointMode: "constant",
      homePosition: [139.5, 36],
      mercZoom: 14
    } as unknown as Parameters<typeof store2HistMap>[0];
    const [hist, tins] = await store2HistMap(store);
    expect(hist.viewpointMode).toBe("constant");
    const restored = await histMap2Store(hist, tins);
    expect(restored.viewpointMode).toBe("constant");
  });
});
