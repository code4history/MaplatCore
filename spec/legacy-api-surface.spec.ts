// 旧クラス MaplatApp の公開面（壊さない）の機械検査。
// 期待値は Web Components 化の前の `MaplatApp` で `Object.getOwnPropertyNames(MaplatApp.prototype)` を
// 出力した一覧に、要素のために足した @internal のメソッドを足したもの。
// モジュールの export は Web Components 化の前の一覧に mercToLngLat・defaultPinIcon の 2 個を足したもの
// （実装後の状態を写すと自己参照になるので、着手前の実測を基準にする）。
import { describe, it, expect } from "vitest";
import * as core from "../src/index";
import { MaplatApp } from "../src/index";

/** Web Components 化の前の `MaplatApp` の prototype の一覧。 */
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

/** Web Components 化の前のモジュールの export。 */
const EXPORTS_AT_HEAD = [
  "CustomEvent", "GPSErrorEvent", "GPSRequestEvent", "GPSResultEvent",
  "MAPLAT_APP_STARTUP_FIELDS", "MaplatApp", "MaplatMap", "assets", "buildSlideAttrs",
  "createElement", "escapeAttr", "mapSourceFactory", "sanitizeHtml", "toPlainText"
].sort();

/** `src/index.ts` に足したモジュール関数。 */
const ADDED_EXPORTS = ["defaultPinIcon", "mercToLngLat"];

/** `<maplat-app>` のために足した `@internal` メソッド（地図の表示まわり。viewExtentMercsAsync ではなく viewportSize）。 */
const ADDED_METHODS_VIEW = ["sourceLoadedDetail", "pixelToMerc", "viewportSize", "updateSize"];

/** `<maplat-app>` のために足した `@internal` メソッド（起動後の設定まわり）。 */
const ADDED_METHODS_RUNTIME = ["setCenterMarker", "applyRuntimeOptions"];

describe("MaplatApp の公開面", () => {
  it("prototype の一覧は Web Components 化の前の一覧＋ <maplat-app> のために足した @internal 6 個と完全一致する", () => {
    const expected = [
      ...PROTOTYPE_AT_HEAD,
      ...ADDED_METHODS_VIEW,
      ...ADDED_METHODS_RUNTIME
    ].sort();
    expect(expected.length).toBe(PROTOTYPE_AT_HEAD.length + 6);
    expect(Object.getOwnPropertyNames(MaplatApp.prototype).sort()).toEqual(expected);
  });

  it("モジュールの export は Web Components 化の前の一覧に mercToLngLat・defaultPinIcon を足したもの", () => {
    const expected = [...EXPORTS_AT_HEAD, ...ADDED_EXPORTS].sort();
    expect(expected.length).toBe(EXPORTS_AT_HEAD.length + 2);
    expect(Object.keys(core).sort()).toEqual(expected);
  });
});
