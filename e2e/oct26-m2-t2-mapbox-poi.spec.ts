// oct26-m2-t2（MaplatCore #100）AC-2: Mapbox ベースマップへの切替の回帰ガード。
// changeMap("mapbox") が resolve し（mapID === "mapbox"）、POI marker main_1 が存在し、
// lngLatToClientPoint の結果が有限値であることを検証する。
// headless chromium では issue の視覚症状（POI 非表示・TMS overlay 半サイズ）が再現しないため、
// 本 spec は変更前から PASS する回帰ガードである（設計 §5.3）。視覚症状の解消は人間検証 HV-M2T2-MAPBOX-VISUAL が判定する。
// 実行はこの worktree の vite を自分で起動してから行う（設計 §6。既定 config の webServer は reuse で起動されない）。
import { test, expect } from '@playwright/test';

test.describe('oct26-m2-t2 AC-2: Mapbox basemap regression guard', () => {
  test('Mapbox basemap: POI marker drawn and coordinate transform finite', async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width: 1280, height: 900 });

    const browserLog: string[] = [];
    page.on('console', msg => browserLog.push(`[${msg.type()}] ${msg.text()}`));
    page.on('pageerror', err => browserLog.push(`[pageerror] ${err.message}`));
    page.on('requestfailed', req =>
      browserLog.push(`[requestfailed] ${req.failure()?.errorText ?? 'unknown'} -> ${req.url()}`)
    );

    await page.goto('/e2e/test.html', { waitUntil: 'domcontentloaded' });

    await page.waitForFunction(
      () => (window as any).__MAPLAT_APP__ != null,
      null,
      { timeout: 60_000 }
    );

    // 初期地図（morioka_ndl2）で main_1 marker の座標変換が既に有限かを確認
    const before = await page.evaluate(async () => {
      const app = (window as any).__MAPLAT_APP__;
      const marker = app?.getMarker?.('main_1');
      const lnglat = marker
        ? marker.lnglat ?? [marker.longitude, marker.latitude]
        : null;
      const cp = lnglat ? await app?.lngLatToClientPoint?.(lnglat[0], lnglat[1]) : null;
      return {
        mapID: app?.currentMapInfo?.().mapID,
        markerExists: !!marker,
        lnglat,
        clientPoint: cp ?? null,
        markerFeatureCount:
          app?.mapObject?.getLayer?.('marker')?.getSource?.()?.getFeatures?.().length ?? null
      };
    });
    console.log(`AC2_BEFORE ${JSON.stringify(before)}`);

    // Mapbox へ切り替え
    await page.locator('#mapbox').click();
    await page.waitForFunction(
      () => (window as any).__MAPLAT_APP__?.currentMapInfo?.().mapID === 'mapbox',
      null,
      { timeout: 60_000 }
    );
    await page.waitForTimeout(5000);

    const after = await page.evaluate(async () => {
      const app = (window as any).__MAPLAT_APP__;
      const marker = app?.getMarker?.('main_1');
      const lnglat = marker
        ? marker.lnglat ?? [marker.longitude, marker.latitude]
        : null;
      const cp = lnglat ? await app?.lngLatToClientPoint?.(lnglat[0], lnglat[1]) : null;

      // 診断: lngLatToClientPoint と同じ経路の中間値（merc → sysCoord）を観測し、
      // 「有限でない」がどこで生じるかを特定する。
      let raw: any = null;
      if (lnglat && (window as any).ol) {
        try {
          const ol = (window as any).ol;
          const merc = ol.proj.transform(lnglat, 'EPSG:4326', 'EPSG:3857');
          const sysCoord = await app.from?.merc2SysCoordAsync?.(merc);
          const pixel = app.mapObject?.getPixelFromCoordinate?.(sysCoord);
          raw = {
            merc: merc ? Array.from(merc) : null,
            sysCoord: sysCoord ?? null,
            sysCoordIsFinite: sysCoord ? sysCoord.every((v: any) => Number.isFinite(v)) : null,
            pixel: pixel ?? null,
            pixelIsFinite: pixel ? pixel.every((v: any) => Number.isFinite(v)) : null
          };
        } catch (e) {
          raw = { error: String(e) };
        }
      }

      const vp = app?.mapObject?.getViewport?.();
      const rect = vp ? vp.getBoundingClientRect() : null;
      let mbCanvas = null;
      const mbMap = app?.mapboxMap;
      if (mbMap?.getCanvas) {
        const c = mbMap.getCanvas();
        mbCanvas = {
          width: c?.width,
          height: c?.height,
          styleWidth: c?.style?.width,
          styleHeight: c?.style?.height
        };
      }
      const markerFeatureCount =
        app?.mapObject?.getLayer?.('marker')?.getSource?.()?.getFeatures?.().length ?? null;
      return {
        mapID: app?.currentMapInfo?.().mapID,
        markerExists: !!marker,
        lnglat,
        clientPoint: cp ?? null,
        raw,
        viewport: rect
          ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
          : null,
        mbCanvas,
        markerFeatureCount
      };
    });
    console.log(`AC2_AFTER ${JSON.stringify(after)}`);
    browserLog.slice(-40).forEach(m => console.log(`BROWSER ${m}`));

    // ---- AC-2 の機械判定 ----
    expect(after.mapID, 'changeMap("mapbox") must resolve').toBe('mapbox');
    expect(after.markerExists, 'POI marker main_1 must exist under Mapbox basemap').toBe(true);
    expect(after.clientPoint, 'lngLatToClientPoint must not return null/undefined').not.toBeNull();
    expect(
      Number.isFinite(after.clientPoint?.x),
      'clientPoint.x must be finite'
    ).toBe(true);
    expect(
      Number.isFinite(after.clientPoint?.y),
      'clientPoint.y must be finite'
    ).toBe(true);
  });
});
