import { expect, test } from "@playwright/test";
import type { MaplatApp, mapSourceFactory } from "../src/index";
import type { get as getProjection } from "ol/proj";

declare global {
  interface Window {
    layeredMapReady: Promise<MaplatApp>;
    layeredMapProjection: typeof getProjection;
    loadLayeredMap: (id: string) => ReturnType<typeof mapSourceFactory>;
  }
}

test.beforeEach(async ({ page }) => {
  // タイル画像だけを置き換え、座標と OpenLayers の描画は製品の経路を通す。
  const tile =
    '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><path fill="#dce5e8" d="M0 0h256v256H0z"/></svg>';
  await page.route(
    /\/tiles\/[abc]\/|^https:\/\/cyberjapandata\.gsi\.go\.jp\//,
    route => route.fulfill({ contentType: "image/svg+xml", body: tile })
  );
});

test("配布 ES 版で背景同期と proj4 の遅延取得を確認する", async ({ page }) => {
  const chunks: string[] = [];
  page.on("request", request => {
    const path = new URL(request.url()).pathname;
    if (
      path.startsWith("/dist/") &&
      path.endsWith(".js") &&
      path !== "/dist/maplat_core.js"
    ) {
      chunks.push(path);
    }
  });

  await page.goto("/e2e/layered-map.html");
  await page.waitForFunction(() => Boolean(window.layeredMapReady));
  await page.evaluate(async () => {
    const app = await window.layeredMapReady;
    if (app.from?.mapID !== "a" || app.backMap?.getSource()?.mapID !== "gsi") {
      throw new Error("古地図 A と地理院の背景地図を開けませんでした");
    }
  });

  const screenError = () =>
    page.evaluate(async () => {
      const app = await window.layeredMapReady;
      const front = app.mapObject;
      const back = app.backMap!;
      const [w, h] = front.getSize()!;
      const resolution = back.getView().getResolution()!;
      const points = [
        [w / 2, h / 2],
        [0, 0],
        [w, 0],
        [w, h],
        [0, h]
      ];
      const errors = await Promise.all(
        points.map(async pixel => {
          const frontCoord = front.getCoordinateFromPixel(pixel);
          const backCoord = back.getCoordinateFromPixel(pixel);
          if (!frontCoord || !backCoord) return Infinity;
          const merc = await app.from.xy2MercAsync(
            app.from.sysCoord2Xy(frontCoord)
          );
          return (
            Math.hypot(merc[0] - backCoord[0], merc[1] - backCoord[1]) /
            resolution
          );
        })
      );
      return Math.max(...errors);
    });

  for (const rotation of [undefined, 0, Math.PI / 6]) {
    if (rotation !== undefined) {
      await page.evaluate(async rotation => {
        const app = await window.layeredMapReady;
        const view = app.mapObject.getView();
        if (rotation === 0) view.setZoom(view.getZoom()! + 1);
        view.setRotation(rotation);
        app.mapObject.renderSync();
      }, rotation);
    }
    await expect.poll(screenError).toBeLessThanOrEqual(1);
  }

  const bCenter = await page.evaluate(
    async () => (await window.loadLayeredMap("b")).homePosition
  );
  expect(bCenter?.[0]).toBeCloseTo(139.80552, 7);
  expect(chunks).toEqual([]);

  const cCenter = await page.evaluate(
    async () => (await window.loadLayeredMap("c")).homePosition
  );
  expect(cCenter?.[0]).toBeCloseTo(139.833333333333, 9);
  expect(cCenter?.[1]).toBeCloseTo(36, 9);
  await page.evaluate(() => window.loadLayeredMap("c").then(() => true));
  expect(chunks).toHaveLength(1);
});

test("三角網と world file の副層で extent の補正前後の表示座標を比較する", async ({
  page
}) => {
  await page.goto("/e2e/layered-map.html?start=b");
  await page.waitForFunction(() => Boolean(window.layeredMapReady));
  const markers = await page.evaluate(async () => {
    const app = await window.layeredMapReady;
    if (app.from.mapID !== "b") throw new Error("古地図 B を開けませんでした");
    const source = app.from;
    const map = app.mapObject;
    const positions = [
      { index: 1, xy: [362, 380], lnglat: [139.85724, 36.0124] },
      {
        index: 2,
        xy: [128, 384],
        lnglat: [143.73274514625078, 39.53939191633387]
      }
    ];
    const markers = [];
    for (const { index, xy, lnglat } of positions) {
      const projection = window.layeredMapProjection(`Illst:b#${index}`)!;
      const extent = projection.getExtent();
      const marker = async () => {
        await source.setGPSMarkerAsync({ lnglat, acc: 10 }, true);
        map.renderSync();
        const feature = map
          .getSource("gps")
          .getFeatures()
          .find(feature => feature.getGeometry()?.getType() === "Point");
        if (!feature) throw new Error("副層に GPS マーカーがありません");
        const coordinate = feature.getGeometry().getCoordinates();
        return {
          xy: source.sysCoord2Xy(coordinate),
          pixel: map.getPixelFromCoordinate(coordinate)
        };
      };
      map.getView().setCenter(source.xy2SysCoord(xy));
      const corrected = await marker();
      projection.setExtent([
        extent[0],
        extent[1],
        extent[2] - extent[0],
        extent[3] - extent[1]
      ]);
      const previous = await marker();
      projection.setExtent(extent);
      markers.push({ xy, corrected, previous });
    }
    return markers;
  });
  for (const { xy, corrected, previous } of markers) {
    expect(corrected.xy[0]).toBeCloseTo(xy[0], 3);
    expect(corrected.xy[1]).toBeCloseTo(xy[1], 3);
    expect(corrected.pixel).toHaveLength(2);
    expect(corrected).toEqual(previous);
  }
});

test("配布 UMD 版の同梱 proj4 で平面直角 IX 系の地図を読む", async ({
  page
}) => {
  await page.route("**/layered-map-umd-test", route =>
    route.fulfill({
      contentType: "text/html",
      body: `<div id="map_div" style="width:512px;height:384px"></div>
        <script src="/node_modules/ol/dist/ol.js"></script>
        <script src="/dist/maplat_core.umd.js"></script>`
    })
  );
  await page.goto("/layered-map-umd-test");
  const center = await page.evaluate(async () => {
    const { MaplatApp } = window as unknown as {
      MaplatApp: new (options: unknown) => MaplatApp;
    };
    const app = new MaplatApp({
      appid: "layered-map-umd",
      div: "map_div",
      startFrom: "c",
      restore: { mapID: "c" },
      setting: {
        homePosition: [139.833333333333, 36],
        defaultZoom: 16,
        sources: [
          "gsi",
          { mapID: "c", settingFile: "/spec/fixtures/layered-map/c.json" }
        ],
        pois: []
      }
    });
    await app.waitReady;
    if (app.from.mapID !== "c") throw new Error("古地図 C を開けませんでした");
    return app.from.homePosition;
  });
  expect(center?.[0]).toBeCloseTo(139.833333333333, 9);
  expect(center?.[1]).toBeCloseTo(36, 9);
});
