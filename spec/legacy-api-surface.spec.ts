// 旧クラス MaplatApp の公開面（C5: 壊さない）の機械検査。
// 期待値は段階 0（HEAD 54f5721）で `Object.getOwnPropertyNames(MaplatApp.prototype)` を
// 出力した一覧に、設計 v2 で足す @internal のメソッドを段階ごとに足したもの。
// モジュールの export は段階 0 の一覧に mercToLngLat・defaultPinIcon の 2 個を足したもの
// （設計 v2 n3。実装後の状態を写すと自己参照になるので、段階 0 の実測を基準にする）。
import { describe, it, expect } from "vitest";
import * as core from "../src/index";
import { MaplatApp } from "../src/index";

/** 段階 0（54f5721）の prototype の一覧。 */
const PROTOTYPE_AT_HEAD = [
  "__addEntry", "__applyInitialViewpoint", "__applyPendingView", "__captureRawViewState",
  "__captureViewState", "__convertFromCurrent", "__convertParameters", "__drawVectorEntry",
  "__featureOption", "__hasMapSize", "__nextVectorDrawToken", "__projectVector",
  "__reportBackMapError", "__schedulePendingView", "__vectorStore",
  "addLine", "addMarker", "addPoiLayer", "addVector", "alwaysGpsOn", "appid",
  "buildLifecycleContext", "cancelMapTileCacheAsync", "changeMap", "clearLine",
  "clearMapTileCacheAsync", "clearMarker", "clearVector", "clientPointToLngLat", "constructor",
  "convertParametersFromCurrent", "currentMapInfo", "dispatchPoiNumber", "enableCache", "fakeGps",
  "fakeRadius", "fetchAllMapTileCacheAsync", "getDirection", "getGPSEnabled", "getMapCacheEnable",
  "getMapMeta", "getMapTileCacheSizeAsync", "getMapTileCacheStatsAsync", "getMarker", "getPoiLayer",
  "getRotation", "getTransparency", "goHome", "googleApiKey", "handleGPS", "handlePois",
  "handleSetting", "handleSources", "hideAllMarkers", "hidePoiLayer", "initGeolocation",
  "initialRestore", "listPoiLayers", "lngLatToClientPoint", "mapDiv", "mapDivDocument", "mapInfo",
  "noRotate", "overlay", "prepareMap", "raiseChangeViewpoint", "redrawMarkers", "registerSelfHeal",
  "remove", "removeLine", "removeMarker", "removePoiLayer", "removeVector", "requestUpdateState",
  "resetCirculation", "resetDirection", "resetLine", "resetMarker", "resetRotation", "resetVector",
  "restoreSession", "runLifecyclePhase", "selectMarker", "setBackMapBehavior", "setGPSMarker",
  "setInitialMap", "setLine", "setMapClick", "setMapOnOff", "setMarker", "setMouseCursor",
  "setPointerEvents", "setTransparency", "setVector", "setViewpoint", "settingLoader",
  "showAllMarkers", "showPoiLayer", "sourcesLoader", "uiHooks", "unselectMarker", "updateMarker",
  "vectors"
].sort();

/** 段階 0（54f5721）のモジュールの export。 */
const EXPORTS_AT_HEAD = [
  "CustomEvent", "GPSErrorEvent", "GPSRequestEvent", "GPSResultEvent",
  "MAPLAT_APP_STARTUP_FIELDS", "MaplatApp", "MaplatMap", "assets", "buildSlideAttrs",
  "createElement", "escapeAttr", "mapSourceFactory", "sanitizeHtml", "toPlainText"
].sort();

/** 設計 v2 で `src/index.ts` に足すモジュール関数（§9.2）。 */
const ADDED_EXPORTS = ["defaultPinIcon", "mercToLngLat"];

/** 段階 2 で足す `@internal` メソッド（§9.1。Minor 1 により viewExtentMercsAsync ではなく viewportSize）。 */
const ADDED_METHODS_PHASE2 = ["sourceLoadedDetail", "pixelToMerc", "viewportSize", "updateSize"];

/** 段階 3 で足す `@internal` メソッド（§9.1）。 */
const ADDED_METHODS_PHASE3 = ["setCenterMarker", "applyRuntimeOptions"];

describe("MaplatApp の公開面（C5）", () => {
  it("prototype の一覧は段階 0 ＋ @internal 6 個と完全一致する", () => {
    const expected = [
      ...PROTOTYPE_AT_HEAD,
      ...ADDED_METHODS_PHASE2,
      ...ADDED_METHODS_PHASE3
    ].sort();
    expect(expected.length).toBe(PROTOTYPE_AT_HEAD.length + 6);
    expect(Object.getOwnPropertyNames(MaplatApp.prototype).sort()).toEqual(expected);
  });

  it("モジュールの export は段階 0 の一覧に mercToLngLat・defaultPinIcon を足したもの", () => {
    const expected = [...EXPORTS_AT_HEAD, ...ADDED_EXPORTS].sort();
    expect(expected.length).toBe(EXPORTS_AT_HEAD.length + 2);
    expect(Object.keys(core).sort()).toEqual(expected);
  });
});
