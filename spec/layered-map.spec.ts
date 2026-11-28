import { MapTransform, type CompiledWorldFileOuter } from "@maplat/transform";
import { get as getProjection, fromLonLat, toLonLat } from "ol/proj";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HistMap_tin } from "../src/source/histmap_tin";
import { store2HistMap4Core } from "../src/source/store_handler";
import { mapSourceFactory } from "../src/source_ex";
import type { MaplatMap } from "../src/map_ex";
import a from "./fixtures/layered-map/a.json";
import b from "./fixtures/layered-map/b.json";
import c from "./fixtures/layered-map/c.json";
import legacy from "../e2e/fixtures/gps-poi/nobeoka1932.json";

// proj4 の動的 import を試験内で失敗させられるようにする。store_handler の proj4Engine は
// モジュール単位の共有状態なので、失敗と再試行の試験はこのファイルの最初に置き、
// それ以外の試験の前には成功したエンジンがキャッシュされる順序を保つ。
const proj4Mock = vi.hoisted(() => ({ fail: true }));
vi.mock("proj4", async () => {
  if (proj4Mock.fail) throw new Error("proj4 の取得に失敗（疑似）");
  return await vi.importActual<typeof import("proj4")>("proj4");
});

const ixOrigin = [15566175.462592717, 4300621.372044272];
const ixOutside = [15566807.697165117, 4301256.358276256];
const size: [number, number] = [256, 192];
const center = [256, 256];

async function loadMap(id: string, data: object): Promise<HistMap_tin> {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      json: async () => structuredClone(data)
    }))
  );
  const map = await mapSourceFactory({ mapID: id }, {});
  expect(map).toBeInstanceOf(HistMap_tin);
  expect(map).toMatchObject({ width: 512, height: 512 });
  expect(map.envelope?.geometry.coordinates[0]).toHaveLength(5);
  expect(Number.isFinite(map.mercZoom)).toBe(true);
  return map as HistMap_tin;
}

function expectNear(
  actual: number[] | false | undefined,
  expected: number[],
  tolerance: number
) {
  expect(actual).not.toBe(false);
  expect(actual).toBeDefined();
  if (!actual) throw new Error("座標変換に失敗しました");
  expect(
    Math.hypot(actual[0] - expected[0], actual[1] - expected[1])
  ).toBeLessThanOrEqual(tolerance);
}

async function expectViewpointRoundTrip(
  map: HistMap_tin,
  mercCenter: number[]
) {
  const zoom = 2.2;
  const rotation = Math.PI / 6;
  const mercs = await map.viewpoint2MercsAsync(
    [map.xy2SysCoord(center), zoom, rotation],
    size
  );
  expect(mercs[0]).toHaveLength(5);
  expectNear(mercs[0][0], mercCenter, 1e-3);
  const [restoredCenter, restoredZoom, restoredRotation] =
    await map.mercs2ViewpointAsync(mercs);
  expectNear(map.sysCoord2Xy(restoredCenter!), center, 1e-3);
  expect(restoredZoom).toBeCloseTo(zoom, 6);
  expect(restoredRotation).toBeCloseTo(rotation, 6);
}

async function expectGps(map: HistMap_tin, lnglat: number[], pixel: number[]) {
  const setGPSPosition =
    vi.fn<(position: { xy: number[]; rad: number }) => void>();
  map.setMap({
    getView: () => undefined,
    setGPSPosition
  } as unknown as MaplatMap);
  expect(await map.setGPSMarkerAsync({ lnglat, acc: 10 }, true)).toBe(true);
  const position = setGPSPosition.mock.calls[0][0];
  expect(position.rad).toBeGreaterThan(0);
  expectNear(map.sysCoord2Xy(position.xy), pixel, 1e-3);
}

afterEach(() => vi.unstubAllGlobals());

describe("proj4 の動的取得の失敗と再試行", () => {
  it("失敗は Map <mapID>: 付きのエラーになり、次の読み込みで成功に戻る", async () => {
    proj4Mock.fail = true;
    const error = await loadMap("proj4-retry-fail", c).then(
      () => {
        throw new Error("proj4 の取得に失敗したのに読み込めてしまいました");
      },
      e => e as Error
    );
    expect(error.message).toMatch(/^Map proj4-retry-fail: /);
    const causes: string[] = [];
    for (let e: unknown = error; e instanceof Error; e = e.cause) {
      causes.push(e.message);
    }
    expect(causes.some(m => m.includes("proj4 の取得に失敗（疑似）"))).toBe(true);

    proj4Mock.fail = false;
    const map = await loadMap("proj4-retry-ok", c);
    expectNear(await map.xy2MercAsync(center), ixOrigin, 1e-3);
    await expectGps(map, [139.833333333333, 36], center);
  });
});

describe("地図 JSON からの変換面の読み込み", () => {
  it("A の四隅が GDAL で world file を書き出した合成タイルの外周に合う", async () => {
    const map = await loadMap("wf-tile", a);
    const left = 15565636.439993296;
    const top = 4303098.944342282;
    const right = 15566859.432445858;
    const bottom = 4301875.95188972;
    const corners = [
      [
        [0, 0],
        [left, top]
      ],
      [
        [512, 0],
        [right, top]
      ],
      [
        [512, 512],
        [right, bottom]
      ],
      [
        [0, 512],
        [left, bottom]
      ]
    ];
    for (const [pixel, merc] of corners) {
      expectNear(
        await map.xy2MercAsync_specifyLayer(pixel, 0),
        merc,
        2.38866 * 0.1
      );
    }
    const merc = [(left + right) / 2, (top + bottom) / 2];
    expectNear(map.homePosition, toLonLat(merc), 1e-8);
    await expectGps(map, toLonLat(merc), center);
    await expectViewpointRoundTrip(map, merc);
  });

  const geographicA = {
    ...a,
    crs: { epsg: 4326, proj4: "+proj=longlat +datum=WGS84" },
    worldFile: {
      ...a.worldFile,
      xScale: 0.002,
      yScale: -0.002,
      xOrigin: 139.001,
      yOrigin: 35.999
    }
  };
  const projectedA = {
    ...a,
    crs: c.crs,
    worldFile: {
      ...a.worldFile,
      xScale: 2,
      yScale: -2,
      xOrigin: -511,
      yOrigin: 511
    }
  };

  it.each([
    { id: "wf-3857", data: a, tolerance: 1e-6 },
    { id: "wf-4326", data: geographicA, tolerance: 1e-6 },
    { id: "wf-ix", data: projectedA, tolerance: 1e-3 }
  ])("$id の画像の内外を往復する", async ({ id, data, tolerance }) => {
    const map = await loadMap(id, data);
    for (let x = -512; x <= 1024; x += 128) {
      for (let y = -512; y <= 1024; y += 128) {
        const pixel = [x, y];
        const merc = await map.xy2MercAsync_specifyLayer(pixel, 0);
        expectNear(
          await map.merc2XyAsync_specifyLayer(merc, 0),
          pixel,
          tolerance
        );
      }
    }
    if (id === "wf-4326") {
      expectNear(
        await map.xy2MercAsync(center),
        fromLonLat([139.512, 35.488]),
        1e-6
      );
      expect(
        map.mapTransform.getSurfaceTransform(0)!.transform([0, -25000])
      ).toBe(false);
    }
    if (id === "wf-ix") {
      expectNear(await map.xy2MercAsync(center), ixOrigin, 1e-3);
      await expectGps(map, [139.833333333333, 36], center);
    }
  });

  it("B は内部で三角網、外部で compiled の world file を使う", async () => {
    const compiled = b.compiled as unknown as CompiledWorldFileOuter;
    expect(compiled).toMatchObject({ outerTransform: "worldFile" });
    expect(compiled.centroid_point).toBeUndefined();
    expect(compiled.vertices_params).toBeUndefined();

    // 層直下に余分な宣言があっても、compiled の方式を使う。
    const map = await loadMap("tin-outer-wf", {
      ...b,
      outerTransform: "extrapolate",
      worldFile: {}
    });
    const inner = [139.80552, 36.00488];
    expectNear(await map.xy2MercAsync(center), fromLonLat(inner), 1e-6);
    const outer = [139.8, 36.01];
    const outerMerc = fromLonLat(outer);
    expectNear(await map.xy2MercAsync([0, 0]), outerMerc, 1e-6);
    expectNear(await map.merc2XyAsync_specifyLayer(outerMerc, 0), [0, 0], 1e-6);
    await expectGps(map, inner, center);
    await expectViewpointRoundTrip(map, fromLonLat(inner));
  });

  it("C の三角網と扇形を平面直角 IX 系から投影する", async () => {
    const map = await loadMap("tin-ix", c);
    expect(c.compiled.outerTransform).toBe("extrapolate");
    expectNear(await map.xy2MercAsync(center), ixOrigin, 1e-3);
    expectNear(await map.xy2MercAsync([512, 0]), ixOutside, 1e-3);
    expectNear(
      await map.merc2XyAsync_specifyLayer(ixOutside, 0),
      [512, 0],
      1e-3
    );
    await expectGps(map, [139.833333333333, 36], center);
    await expectViewpointRoundTrip(map, ixOrigin);
  });

  it("空の副層を挟んでも混在した副層の番号・bounds・OL 投影が揃う", async () => {
    const id = "mixed-insets";
    const map = await loadMap(id, b);
    const [options] = await store2HistMap4Core({
      ...structuredClone(b),
      mapID: id
    } as unknown as Parameters<typeof store2HistMap4Core>[0]);
    expect(map.mapTransform.layerCount).toBe(3);
    expect(options.sub_maps?.map(sub => sub.bounds)).toEqual([
      [
        [304, 300],
        [420, 300],
        [420, 460],
        [304, 460]
      ],
      [
        [64, 320],
        [192, 320],
        [192, 448],
        [64, 448]
      ]
    ]);
    const insetCases = [
      {
        index: 1,
        xy: [362, 380],
        merc: fromLonLat([139.85724, 36.0124]),
        extent: [304, 300, 420, 460]
      },
      {
        index: 2,
        xy: [128, 384],
        merc: [16000256, 4799232],
        extent: [64, 320, 192, 448]
      }
    ];
    for (const { index, xy, merc, extent } of insetCases) {
      expect(map.mapTransform.merc2XyVisibleLayers(merc)[0]?.[0]).toBe(index);
      expect(await map.xy2MercAsync_returnLayer(xy)).toEqual([
        index,
        expect.any(Array)
      ]);
      expect(getProjection(`Illst:${id}#${index}`)?.getExtent()).toEqual(
        extent
      );
      expectNear(await map.xy2MercAsync_specifyLayer(xy, index), merc, 1e-6);
      expectNear(await map.merc2XyAsync_specifyLayer(merc, index), xy, 1e-6);
      await expectGps(map, toLonLat(merc), xy);
    }
    expect(getProjection(`Illst:${id}#3`)).toBeNull();
  });

  it("layerIndex を指定すると、副層が重なる地点でも視点が往復して戻る", async () => {
    const map = await loadMap("layer-index-roundtrip", b);
    const zoom = 2.2;
    const rotation = Math.PI / 6;
    // 副層 1（world file の枠 [304, 300]-[420, 460]）と本図が重なる地点
    const overlap = [362, 380];
    const mercs0 = await map.viewpoint2MercsAsync(
      [map.xy2SysCoord(overlap), zoom, rotation],
      size,
      0
    );
    const mercs1 = await map.viewpoint2MercsAsync(
      [map.xy2SysCoord(overlap), zoom, rotation],
      size,
      1
    );
    // 層を替えると中心のメルカトル座標が替わる（layerIndex が Transform に届く）
    expect(
      Math.hypot(
        mercs0[0][0][0] - mercs1[0][0][0],
        mercs0[0][0][1] - mercs1[0][0][1]
      )
    ).toBeGreaterThan(1);
    for (const [layerIndex, point] of [
      [0, overlap],
      [1, overlap],
      [2, [128, 384]]
    ] as [number, number[]][]) {
      const mercs = await map.viewpoint2MercsAsync(
        [map.xy2SysCoord(point), zoom, rotation],
        size,
        layerIndex
      );
      const [restoredCenter, restoredZoom, restoredRotation] =
        await map.mercs2ViewpointAsync(mercs, layerIndex);
      expectNear(map.sysCoord2Xy(restoredCenter!), point, 1e-3);
      expect(restoredZoom).toBeCloseTo(zoom, 6);
      expect(restoredRotation).toBeCloseTo(rotation, 6);
    }
  });

  it("副層の三角網に指定された CRS を使う", async () => {
    const bounds = [
      [80, 80],
      [440, 80],
      [440, 440],
      [80, 440]
    ];
    const map = await loadMap("projected-inset", {
      ...a,
      sub_maps: [
        {
          compiled: c.compiled,
          bounds,
          crs: c.crs,
          priority: 1,
          importance: 1,
          worldFile: {}
        }
      ]
    });
    expectNear(await map.xy2MercAsync_specifyLayer(center, 1), ixOrigin, 1e-3);
    expect(map.mapTransform.merc2XyVisibleLayers(ixOrigin)[0]?.[0]).toBe(1);
    expectNear(map.homePosition, toLonLat(ixOrigin), 1e-8);
  });

  it("既存の延岡地図で従来の setMapData と座標・視点の数値が完全に一致する", async () => {
    const original = structuredClone(legacy) as unknown as Parameters<
      MapTransform["setMapData"]
    >[0];
    const expected = new MapTransform();
    expected.setMapData(original);
    const core = await HistMap_tin.createAsync({
      ...structuredClone(legacy),
      mapID: "legacy-nobeoka-exact",
      url: "tiles/{z}/{x}/{y}.jpg"
    });
    for (const xy of [
      [0, 0],
      [333.75, 2411.5],
      [6500.123, 1800.789],
      original.compiled.wh!
    ]) {
      const byLayer = expected.xy2MercWithLayer(xy);
      expect(await core.xy2MercAsync_returnLayer(xy)).toEqual(byLayer);
      if (byLayer) {
        const merc = byLayer[1];
        expect(await core.merc2XyAsync_returnLayer(merc)).toEqual(
          expected.merc2XyWithLayer(merc)
        );
      }
    }
    const viewpoint = {
      center: core.xy2SysCoord([4640, 2240]),
      zoom: 3.2,
      rotation: Math.PI / 6
    };
    const mercs = expected.viewpoint2Mercs(viewpoint, size);
    expect(
      await core.viewpoint2MercsAsync(
        [viewpoint.center, viewpoint.zoom, viewpoint.rotation],
        size
      )
    ).toEqual([mercs, size]);
    const result = expected.mercs2Viewpoint(mercs, size);
    expect(await core.mercs2ViewpointAsync([mercs, size])).toEqual([
      result.center,
      result.zoom,
      result.rotation
    ]);
  });

  it.each([
    {
      name: "同居",
      data: { ...a, compiled: b.compiled },
      message: /tinEnabled:false.*compiled/
    },
    {
      name: "同居-null",
      data: { ...a, compiled: null },
      message: /tinEnabled:false.*compiled/
    },
    {
      name: "非正則",
      data: { ...a, worldFile: { ...a.worldFile, yScale: 0 } },
      message: /非正則/
    },
    {
      name: "鏡像",
      data: { ...a, worldFile: { ...a.worldFile, yScale: 1 } },
      message: /鏡像.*yScale/
    },
    {
      name: "幅なし",
      data: { ...a, width: undefined },
      message: /width.*height/
    },
    { name: "CRSなし", data: { ...a, crs: null }, message: /CRS|crs/ },
    {
      name: "係数なし",
      data: { ...a, worldFile: undefined },
      message: /worldFile/
    },
    {
      name: "定義なし",
      data: { ...a, crs: { epsg: 6677 } },
      message: /CRS.*proj4/
    },
    { name: "WKT", data: { ...a, crs: { wkt: "GEOGCS[]" } }, message: /WKT/ },
    {
      name: "軸順",
      data: { ...a, crs: { ...c.crs, proj4: `${c.crs.proj4} +axis=neu` } },
      message: /axis/
    },
    {
      name: "グリッド",
      data: { ...a, crs: { ...c.crs, proj4: `${c.crs.proj4} +nadgrids=grid` } },
      message: /nadgrids/
    },
    {
      name: "CRS矛盾",
      data: { ...a, crs: { epsg: 3857, proj4: "+proj=longlat +datum=WGS84" } },
      message: /一致しない/
    },
    {
      name: "TIN-CRS矛盾",
      data: { ...b, crs: { epsg: 4326, proj4: "+proj=merc" } },
      message: /一致しない/
    },
    {
      name: "副層同居",
      data: { ...b, sub_maps: [{ ...b.sub_maps[0], compiled: b.compiled }] },
      message: /tinEnabled:false.*compiled/
    },
    {
      name: "副層boundsなし",
      data: { ...b, sub_maps: [{ ...b.sub_maps[0], bounds: undefined }] },
      message: /bounds/
    },
    {
      name: "副層CRSなし",
      data: { ...b, sub_maps: [{ ...b.sub_maps[0], crs: undefined }] },
      message: /CRS|crs/
    }
  ])(
    "不正な定義を地図 ID つきで拒否する（$name）",
    async ({ name, data, message }) => {
      const promise = loadMap(`invalid-${name}`, data);
      await expect(promise).rejects.toThrow(`invalid-${name}`);
      await expect(promise).rejects.toThrow(message);
    }
  );

  it("宣言が false でなければ従来どおり compiled が要る", async () => {
    for (const tinEnabled of [undefined, true]) {
      await expect(
        loadMap("missing-compiled", { ...a, tinEnabled })
      ).rejects.toThrow("Map missing-compiled is missing compiled data.");
    }
  });
});
