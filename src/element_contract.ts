// 層 A（<maplat-app>）・層 B（<maplat-ui>）の共通の取り決め（名前の表と型）。
//
// @maplat/core/common から公開する。実装（OpenLayers 版の Core・有償版）にも、層 B（UI・UI-Pro）にも、
// ページの TypeScript にも共通の 1 つの表として置く（仕様 §5.3・§8.4）。
// **このファイルは何も import しない**（common の入口からたどれる連鎖に OpenLayers・Weiwudi・
// @maplat/transform・turf を入れないため。spec/common-entry.spec.ts が機械的に確かめる）。
//
// 正本の仕様: NayutaProducts/docs/superpowers/specs/2026-10-10-maplat-web-components-interface.md
//   §3（層 A）・§4（層 B）・§6（設定経路）・§10.1（人間の決定）

// ---------------------------------------------------------------------------
// タグ名
// ---------------------------------------------------------------------------

export const MAPLAT_APP_TAG = "maplat-app";
export const MAPLAT_UI_TAG = "maplat-ui";

// ---------------------------------------------------------------------------
// イベント名（§3.5）
// ---------------------------------------------------------------------------

/**
 * 層 A の要素が出すイベントのうち、旧クラス（MaplatApp）の名前をそのまま使うもの。
 * Core は src/index.ts の dispatchEvent をこの表と突き合わせる（spec/element.spec.ts）。
 */
export const MAPLAT_APP_EVENTS = [
  "lifecycle:setting-loaded",
  "lifecycle:appdata-ready",
  "lifecycle:ui-configure",
  "lifecycle:core-dom-ready",
  "lifecycle:ui-dom-ready",
  "lifecycle:core-ready",
  "lifecycle:ui-ready",
  "lifecycle:error",
  "sourceLoaded",
  "mapChanged",
  "changeViewpoint",
  "updateState",
  "outOfMap",
  "poi_number",
  "clickMarker",
  "clickMarkers",
  "clickMap",
  "clickMapXy",
  "clickMapMerc",
  "pointerMoveOnMapXy",
  "pointerMoveOnMapMerc",
  "gps_request",
  "gps_result",
  "gps_error"
] as const;
export type MaplatAppEventName = (typeof MAPLAT_APP_EVENTS)[number];

/** 層 A の要素が新設するイベント（§3.5）。 */
export const ELEMENT_OWN_EVENTS = ["gpsEnabledChanged", "moveStart", "moveEnd"] as const;
export type ElementOwnEventName = (typeof ELEMENT_OWN_EVENTS)[number];

/** 層 A のうち Pro 固有のイベント（supports() が真のときだけ出る）。 */
export const LAYER_A_PRO_EVENTS = [
  { event: "modechange", feature: "display-mode" },
  { event: "viewchange", feature: "display-mode" }
] as const;

/** ライフサイクルの段階（旧と同順。§2.7）。 */
export const LIFECYCLE_PHASES = [
  "setting-loaded",
  "appdata-ready",
  "ui-configure",
  "core-dom-ready",
  "ui-dom-ready",
  "core-ready",
  "ui-ready"
] as const;
export type LifecyclePhaseId = (typeof LIFECYCLE_PHASES)[number];

// ---------------------------------------------------------------------------
// メソッド名（§3.4）
// ---------------------------------------------------------------------------

/** 旧クラスから引き継ぐ公開メソッド（44 個。§3.4.1）。要素は実装の同名メソッドへ委譲する。 */
export const MAPLAT_APP_METHODS = [
  "handleGPS",
  "getGPSEnabled",
  "getRotation",
  "getDirection",
  "currentMapInfo",
  "mapInfo",
  "clientPointToLngLat",
  "lngLatToClientPoint",
  "selectMarker",
  "unselectMarker",
  "getMarker",
  "updateMarker",
  "addMarker",
  "removeMarker",
  "clearMarker",
  "showAllMarkers",
  "hideAllMarkers",
  "listPoiLayers",
  "showPoiLayer",
  "hidePoiLayer",
  "getPoiLayer",
  "addPoiLayer",
  "removePoiLayer",
  "addLine",
  "addVector",
  "clearLine",
  "clearVector",
  "setGPSMarker",
  "changeMap",
  "requestUpdateState",
  "setTransparency",
  "getTransparency",
  "setViewpoint",
  "goHome",
  "resetRotation",
  "resetDirection",
  "resetCirculation",
  "getMapMeta",
  "getMapCacheEnable",
  "getMapTileCacheStatsAsync",
  "getMapTileCacheSizeAsync",
  "clearMapTileCacheAsync",
  "fetchAllMapTileCacheAsync",
  "cancelMapTileCacheAsync"
] as const;
export type MaplatAppMethodName = (typeof MAPLAT_APP_METHODS)[number];

/** 層 A で新設したメソッド（§3.4.2）。 */
export const ELEMENT_OWN_METHODS = [
  "getViewpoint",
  "listMaps",
  "supports",
  "setEnvelopes",
  "getMapEnvelope",
  "getViewExtent",
  "zoomBy",
  "getDefaultPinIcon"
] as const;
export type ElementOwnMethodName = (typeof ELEMENT_OWN_METHODS)[number];

/** Pro 固有のメソッド（§3.4.3）。対応する機能が supports() で偽なら要素に**定義しない**。 */
export const LAYER_A_PRO_METHODS = [
  { method: "setDisplayMode", feature: "display-mode" },
  { method: "getDisplayMode", feature: "display-mode" }
] as const;

/** 層 A の状態の読み取り（読み取り専用プロパティ。§3.3）。 */
export const LAYER_A_STATE_PROPERTIES = [
  "ready",
  "implementation",
  "version",
  "appData",
  "initialRestore",
  "state",
  "currentMapId",
  "viewpoint",
  "gpsEnabled"
] as const;

// ---------------------------------------------------------------------------
// 機能名（§3.6）
// ---------------------------------------------------------------------------

export type LayerAImplementationName = "core" | "core-pro";

/** 機能名の表（§3.6）。足すときは仕様の表と適合テスト（src/conformance）も更新する。 */
export const LAYER_A_FEATURES: Readonly<Record<string, Readonly<Record<LayerAImplementationName, boolean>>>> = {
  "display-mode": { core: false, "core-pro": true },
  "display-mode:map-warp": { core: false, "core-pro": true },
  "tile-cache": { core: true, "core-pro": true },
  mapbox: { core: true, "core-pro": false },
  "pointer-move": { core: true, "core-pro": true },
  envelopes: { core: true, "core-pro": true }
};
export const LAYER_A_FEATURE_NAMES = Object.keys(LAYER_A_FEATURES);

/** 実装名から機能表の 1 列を取り出す（未知の実装名は全部 false）。 */
export function featuresOf(implementation: string): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const name of LAYER_A_FEATURE_NAMES) {
    out[name] = !!(LAYER_A_FEATURES[name] as Record<string, boolean>)[implementation];
  }
  return out;
}

// ---------------------------------------------------------------------------
// 属性・プロパティの表（§3.2・§6.2・§6.3）
// ---------------------------------------------------------------------------

/**
 * 属性の値の種類（§6.2.2）。"boolean-or-string" は真偽と文字列の両方を取るキー（pwa-manifest:
 * ""・"true"・属性名＝true／"false"＝false／それ以外は文字列のまま）。
 */
export type AttrKind = "string" | "number" | "boolean" | "boolean-or-string";

/** 属性と同期するキーの定義。 */
export interface AttrDef {
  /** 属性名（kebab-case） */
  attr: string;
  /** プロパティ名（camelCase） */
  prop: string;
  kind: AttrKind;
  /** 起動時だけ効く（起動後は変更不可・警告して無視。§6.5 (i)・(i')・U2） */
  startup?: boolean;
  /** 旧 appOption のキー名（移行用の口 appOption と、実装への受け渡しに使う） */
  option?: string;
  /** 地図の準備を待たずに DOM だけで当てるキー（中心の目印。U5） */
  dom?: boolean;
  /** Pro 固有のキー: この機能が supports() で偽の実装は警告して無視する（U3） */
  feature?: string;
  /**
   * 内部の操作（UI・メソッド・状態 URL の復元）で変わる状態のキー（§3.3・§6.2.3。2026-10-11 改訂）。
   * 実装は変化のたびに属性へ書き戻す（"change"）。連続して変わるものは描画 1 回につき 1 回にまとめる（"frame"）。
   * 書き戻しは属性の変更として扱わない（二重に処理しない）。
   */
  state?: "change" | "frame";
}

/** プロパティのみのキー（JS からしか渡せない値）の定義。 */
export interface PropDef {
  prop: string;
  startup?: boolean;
  option?: string;
  feature?: string;
}

/** 層 A の属性と同期するキー（§3.2・§6.3。U5 の中心の目印を含む）。 */
export const ELEMENT_ATTRIBUTES: readonly AttrDef[] = [
  { attr: "app-id", prop: "appId", kind: "string", startup: true, option: "appid" },
  { attr: "app-src", prop: "appSrc", kind: "string", startup: true },
  { attr: "map-id", prop: "mapId", kind: "string", state: "change" },
  { attr: "transparency", prop: "transparency", kind: "number", state: "frame" },
  { attr: "no-rotate", prop: "noRotate", kind: "boolean", startup: true, option: "noRotate" },
  { attr: "north-up", prop: "northUp", kind: "boolean", option: "northUp" },
  { attr: "home-margin-pixels", prop: "homeMarginPixels", kind: "number", option: "homeMarginPixels" },
  { attr: "always-gps-on", prop: "alwaysGpsOn", kind: "boolean", startup: true, option: "alwaysGpsOn" },
  { attr: "fake", prop: "fake", kind: "boolean", startup: true, option: "fake" },
  { attr: "enable-cache", prop: "enableCache", kind: "boolean", startup: true, option: "enableCache" },
  { attr: "restore-session", prop: "restoreSession", kind: "boolean", startup: true, option: "restoreSession" },
  { attr: "overlay", prop: "overlay", kind: "boolean", startup: true, option: "overlay" },
  { attr: "debug", prop: "debug", kind: "boolean", option: "debug" },
  { attr: "icon", prop: "icon", kind: "string", option: "icon" },
  { attr: "selected-icon", prop: "selectedIcon", kind: "string", option: "selectedIcon" },
  // U5: 中心の目印（既定で表示。消す・画像を差し替える口）
  { attr: "no-center-marker", prop: "noCenterMarker", kind: "boolean", dom: true },
  { attr: "center-marker-src", prop: "centerMarkerSrc", kind: "string", dom: true }
];

/** 層 A のプロパティのみのキー（§3.2）。 */
export const ELEMENT_PROPERTIES: readonly PropDef[] = [
  { prop: "setting", startup: true, option: "setting" },
  { prop: "restore", startup: true, option: "restore" },
  { prop: "restoreExtensionKeys", startup: true, option: "restoreExtensionKeys" },
  { prop: "googleApiKey", startup: true, option: "googleApiKey" },
  { prop: "mapboxToken", startup: true, option: "mapboxToken" },
  { prop: "maplibregl", startup: true, option: "maplibregl" },
  { prop: "mapboxgl", startup: true, option: "mapboxgl" },
  { prop: "uiHooks", startup: true, option: "uiHooks" },
  { prop: "appOption", startup: true },
  { prop: "poiTemplate", option: "poiTemplate" },
  { prop: "poiStyle", option: "poiStyle" },
  { prop: "iconTemplate", option: "iconTemplate" }
];

/**
 * 層 A の Pro 固有の属性（U3）。要素は全実装でこの属性を観測し、対応する機能を持たない実装
 * （Core 等）は**キーごとに 1 回**警告して無視する。警告文に実装の名を出さない。
 * 仕様の §10.1 U3 に挙がっているのは display-mode だけ（足すときは仕様と一緒に更新する）。
 */
export const LAYER_A_PRO_ATTRIBUTES: readonly AttrDef[] = [
  { attr: "display-mode", prop: "displayMode", kind: "string", feature: "display-mode", state: "change" }
];

/** 層 A の Pro 固有のプロパティのみのキー（現時点では無し）。 */
export const LAYER_A_PRO_PROPERTIES: readonly PropDef[] = [];

/** 起動時だけ効くキーのプロパティ名（属性・プロパティのみの両方）。 */
export const ELEMENT_STARTUP_KEYS: readonly string[] = [
  ...ELEMENT_ATTRIBUTES.filter(d => d.startup).map(d => d.prop),
  ...ELEMENT_PROPERTIES.filter(d => d.startup).map(d => d.prop)
];

/** 旧 appOption の名前 → 要素のプロパティ名（§9.2）。appOption に新しい名前で書かれていたら旧名へ寄せる。 */
export const APP_OPTION_ALIASES: Readonly<Record<string, string>> = {
  appId: "appid",
  tapUiVanish: "tapUIVanish"
};

/** プロパティ名 → 属性名（§6.2.1。大文字の前で区切り、略語は 1 語として扱う）。 */
export function propToAttributeName(prop: string): string {
  return prop
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

/** 属性名 → プロパティ名（§6.2.1）。 */
export function attributeToPropName(attr: string): string {
  return attr.replace(/-([a-z0-9])/g, (_m, c: string) => c.toUpperCase());
}

/** 属性の文字列 → 値（§6.2.2）。undefined は「未指定」。不正な値は warn を呼んで未指定にする。 */
export function parseAttributeValue(
  def: Pick<AttrDef, "attr" | "kind">,
  raw: string | null,
  warn?: (message: string) => void,
  tagName: string = MAPLAT_APP_TAG
): unknown {
  if (raw == null) return undefined;
  switch (def.kind) {
    case "boolean-or-string":
      if (raw === "" || raw === "true" || raw === def.attr) return true;
      if (raw === "false") return false;
      return raw;
    case "boolean":
      if (raw === "" || raw === "true" || raw === def.attr) return true;
      if (raw === "false") return false;
      warn?.(
        `<${tagName}>: invalid boolean value "${raw}" for attribute "${def.attr}" (use "true" / "false"); treated as unspecified.`
      );
      return undefined;
    case "number": {
      if (raw === "") return undefined;
      const n = Number(raw);
      if (Number.isNaN(n)) {
        warn?.(`<${tagName}>: invalid number "${raw}" for attribute "${def.attr}"; treated as unspecified.`);
        return undefined;
      }
      return n;
    }
    default:
      return raw === "" ? undefined : raw;
  }
}

/** 値 → 属性の文字列（§6.2.2。null は属性を外す）。 */
export function formatAttributeValue(def: Pick<AttrDef, "kind">, value: unknown): string | null {
  if (value == null) return null;
  if (def.kind === "boolean") return value ? "" : "false";
  if (def.kind === "boolean-or-string" && typeof value === "boolean") return value ? "" : "false";
  return String(value);
}

/** 未対応の Pro 固有キーの警告文（U3。実装の名を出さない）。 */
export function unsupportedKeyMessage(
  key: { attr?: string; prop: string },
  via: "attribute" | "property",
  tagName: string = MAPLAT_APP_TAG
): string {
  return via === "attribute"
    ? `<${tagName}>: ignored unsupported attribute "${key.attr ?? propToAttributeName(key.prop)}"`
    : `<${tagName}>: ignored unsupported property "${key.prop}"`;
}

// ---------------------------------------------------------------------------
// 層 B（<maplat-ui>）の名前の表（§4.2・§4.5・§6.4）
// ---------------------------------------------------------------------------

/** 層 B が自分で持つ属性（層 A へ流すキーは ELEMENT_ATTRIBUTES）。 */
export const MAPLAT_UI_ATTRIBUTES: readonly AttrDef[] = [
  { attr: "lang", prop: "lang", kind: "string" },
  { attr: "enable-share", prop: "enableShare", kind: "boolean" },
  { attr: "enable-border", prop: "enableBorder", kind: "boolean" },
  { attr: "enable-hide-marker", prop: "enableHideMarker", kind: "boolean" },
  { attr: "enable-marker-list", prop: "enableMarkerList", kind: "boolean" },
  { attr: "enable-poi-html-no-scroll", prop: "enablePoiHtmlNoScroll", kind: "boolean" },
  { attr: "presentation-mode", prop: "presentationMode", kind: "boolean" },
  { attr: "state-url", prop: "stateUrl", kind: "boolean", startup: true },
  // "" と "true" は true（既定のパス）・"false" は false・それ以外は URL（§6.2.2）
  { attr: "pwa-manifest", prop: "pwaManifest", kind: "boolean-or-string", startup: true },
  { attr: "pwa-worker", prop: "pwaWorker", kind: "string", startup: true },
  { attr: "pwa-scope", prop: "pwaScope", kind: "string", startup: true },
  { attr: "app-envelope", prop: "appEnvelope", kind: "boolean", startup: true },
  { attr: "tap-duration", prop: "tapDuration", kind: "number", option: "tapDuration" },
  { attr: "tap-ui-vanish", prop: "tapUiVanish", kind: "boolean", option: "tapUIVanish" },
  { attr: "set-document-title", prop: "setDocumentTitle", kind: "boolean" }
];

/** 層 B が出すイベント（層 A のイベントは子から泡立って通る）。 */
export const MAPLAT_UI_EVENTS = ["uiReady"] as const;

/** 層 B の公開メソッド（§4.4）。 */
export const MAPLAT_UI_METHODS = [
  "translateText",
  "t",
  "setShowBorder",
  "setHideMarker",
  "openMarker",
  "mapsAt",
  "getShareUrl",
  "showToast"
] as const;

// ---------------------------------------------------------------------------
// 型（§3.5）
// ---------------------------------------------------------------------------

export type LngLat = { longitude: number; latitude: number };
export type Localized = string | Record<string, string>;

/** changeViewpoint の detail・viewpoint プロパティ・getViewpoint() の戻り値。 */
export interface Viewpoint {
  /** 地図の座標（不透明な値。§1 sysCoord） */
  x: number;
  y: number;
  longitude: number;
  latitude: number;
  mercator_x: number;
  mercator_y: number;
  /** 地図の zoom */
  zoom: number;
  mercZoom: number;
  /** 実世界の方位（度） */
  direction: number;
  /** 画面の回転（度） */
  rotation: number;
}

/** getMapMeta / mapChanged の detail。 */
export interface MapMeta {
  mapID: string;
  label?: Localized;
  title?: Localized;
  officialTitle?: Localized;
  author?: Localized;
  createdAt?: Localized;
  era?: Localized;
  contributor?: Localized;
  mapper?: Localized;
  license?: string;
  dataLicense?: string;
  licenseNote?: Localized;
  dataLicenseNote?: Localized;
  attr?: Localized;
  dataAttr?: Localized;
  reference?: Localized;
  description?: Localized;
}

/** listMaps() の要素（設定ファイルの sources の順、使える地図のみ）。 */
export interface MapListItem {
  mapID: string;
  label: Localized;
  thumbnail: string | null;
  isBasemap: boolean;
  isOldMap: boolean;
  isOverlay: boolean;
  hasEnvelope: boolean;
  cacheEnable: boolean;
}

export interface RestorePosition {
  x?: number;
  y?: number;
  zoom?: number;
  rotation?: number;
  longitude?: number;
  latitude?: number;
  mercZoom?: number;
  direction?: number;
}

/** 起動時の復元値（restore・initialRestore）。層 B の拡張キーも載る。 */
export interface Restore {
  mapID?: string;
  backgroundID?: string;
  position?: RestorePosition;
  transparency?: number;
  hideMarker?: number;
  hideLayer?: string;
  [extension: string]: unknown;
}
/** updateState の detail と state プロパティ。 */
export type AppState = Restore;

export interface EnvelopeStroke {
  color: string;
  width?: number;
  lineDash?: [number, number];
}

/** setEnvelopes の要素。 */
export interface EnvelopeSpec {
  /** どの地図の範囲か（現在の古地図なら画像の 4 隅、それ以外は getMapEnvelope の範囲） */
  mapID: string;
  stroke?: EnvelopeStroke;
  /** CSS の色（不透明度を含めてよい） */
  fill?: string;
}

/** lifecycle:* の detail（要素のイベントには内部の core・mapDivDocument を載せない）。 */
export interface LifecycleDetail {
  phaseId: LifecyclePhaseId;
  appData: Readonly<Record<string, any>> | null;
}
export interface LifecycleErrorDetail {
  phaseId: LifecyclePhaseId;
  error: unknown;
}

/** sourceLoaded の detail の要素（§3.8 A2）。 */
export interface SourceLoadedItem {
  mapID: string | null;
  usable: boolean;
}

/** getMapTileCacheStatsAsync の戻り値（§3.8 A10: total を含める）。 */
export interface TileCacheStats {
  size?: number;
  count?: number;
  total?: number;
  percent?: number;
}
export type TileCacheProgressType = "proceed" | "finish" | "stop" | "canceled";
export interface TileCacheProgress {
  size?: number;
  count?: number;
  processed?: number;
  total?: number;
  [key: string]: unknown;
}

/**
 * POI の画像・動画の 1 件（POI の image / media の要素）。文字列なら src だけを書いた形。
 * 相対の src（"/" を含まない名前）は層 B が既定の置き場（img/）の下として読む（旧 ui_utils.resolveRelativeLink）。
 */
export type MaplatPoiMedia =
  | string
  | {
      src: string;
      /** "image" / "video" / "youtube" / "3dmodel" / "gaussian"。無ければ src の拡張子から決める */
      type?: string;
      thumbnail?: string;
      caption?: Localized;
      /** caption の旧名 */
      desc?: Localized;
      /** 表示部品（ビューア）に渡す追加の属性等 */
      [key: string]: unknown;
    };

/**
 * POI の datum（clickMarker / clickMarkers の detail・getMarker の戻り値）。
 * 設定ファイル・POI ファイル由来の**信頼できない**値（html・desc はサニタイズしてから描く。url・directgo は
 * http/https だけを通す）。実装は読み込みで正規化する: 座標は lnglat にまとめる（lng/lat/longitude/latitude は
 * 消す）・id と namespaceID を必ず付ける。マーカーの描画のたびに、祖先（POI のレイヤー → 地図 → アプリ）の
 * テンプレートから icon・selectedIcon（iconTemplate / icon）と html・poiStyle（poiTemplate）を補った複製が
 * クリックの detail になる。ここに無いキー（テンプレートが読む独自のキー等）もそのまま載る。
 */
export interface MaplatPoi {
  /** レイヤーの中の id（無ければ実装が `${レイヤーのキー}_${連番}` を付ける） */
  id: string | number;
  /** アプリ全体で一意な id（`[名前空間#]id`。selectMarker・openMarker に渡す） */
  namespaceID: string;
  /** 経緯度（[経度, 緯度]）。地図の座標（x・y）だけで置く POI では要素が undefined のことがある */
  lnglat?: [number, number];
  /** 古地図の画像の座標で置く POI（x・y の両方があれば lnglat より強い） */
  x?: number;
  y?: number;
  name?: Localized;
  desc?: Localized;
  address?: Localized;
  image?: MaplatPoiMedia | MaplatPoiMedia[];
  media?: MaplatPoiMedia | MaplatPoiMedia[];
  /** 吹き出しの本文の HTML（あれば image・media・desc より強い。poiTemplate からも作られる） */
  html?: Localized;
  /** html の表示に添える CSS（poiTemplate と一緒に祖先から補う） */
  poiStyle?: string;
  /** 吹き出しに埋め込む頁の URL（html が無いとき） */
  url?: Localized;
  /** 吹き出しを出さずに遷移する先（blank なら新しいタブ） */
  directgo?: string | { href: string; blank?: boolean };
  /** マーカーの画像の URL（無ければ祖先の iconTemplate・icon、それも無ければ実装の既定のピン） */
  icon?: string;
  selectedIcon?: string;
  [key: string]: unknown;
}

/**
 * POI のレイヤー（listPoiLayers の要素・getPoiLayer の戻り値。実装確認 1）。アプリのレイヤー（id がそのまま
 * namespaceID）と、地図のレイヤー（namespaceID は `${mapID}#${id}`）がある。main（アプリの既定のレイヤー）は常に在る。
 * 返るのは実装の持つレイヤーそのもの（複製ではない）: 書き換えず、表示の切り替えは showPoiLayer / hidePoiLayer を使う。
 */
export interface PoiLayer {
  /** レイヤーの中の id（main・設定ファイルのキー） */
  id: string;
  /** アプリ全体で一意な id（showPoiLayer・hidePoiLayer・getPoiLayer・addMarker に渡す） */
  namespaceID: string;
  /** レイヤーの名前（main はアプリの appName。設定ファイルに appName が無ければ無い） */
  name?: Localized;
  /** レイヤーのマーカーの画像（無ければ POI ごと・実装の既定のピン） */
  icon?: string;
  selectedIcon?: string;
  /** 非表示か（無ければ表示） */
  hide?: boolean;
  pois: MaplatPoi[];
  [key: string]: unknown;
}

export type GpsResultDetail =
  | { lnglat: [number, number]; acc: number }
  | { error: "gps_off" | "gps_out" | "gps_out_hide" };
export type GpsErrorDetail = "user_gps_deny" | "gps_miss" | "gps_timeout";

/** イベント名 → detail の型（§3.5）。 */
export interface MaplatAppEventDetailMap {
  "lifecycle:setting-loaded": LifecycleDetail;
  "lifecycle:appdata-ready": LifecycleDetail;
  "lifecycle:ui-configure": LifecycleDetail;
  "lifecycle:core-dom-ready": LifecycleDetail;
  "lifecycle:ui-dom-ready": LifecycleDetail;
  "lifecycle:core-ready": LifecycleDetail;
  "lifecycle:ui-ready": LifecycleDetail;
  "lifecycle:error": LifecycleErrorDetail;
  sourceLoaded: SourceLoadedItem[];
  mapChanged: MapMeta;
  changeViewpoint: Viewpoint;
  updateState: AppState;
  outOfMap: Record<string, never>;
  poi_number: number;
  clickMarker: MaplatPoi;
  /** その点に重なるマーカーの全部（先頭が clickMarker と同じ） */
  clickMarkers: MaplatPoi[];
  clickMap: LngLat;
  clickMapXy: [number, number];
  clickMapMerc: [number, number];
  pointerMoveOnMapXy: [number, number];
  pointerMoveOnMapMerc: [number, number];
  gps_request: null | undefined;
  gps_result: GpsResultDetail;
  gps_error: GpsErrorDetail;
  gpsEnabledChanged: { enabled: boolean };
  moveStart: Record<string, never>;
  moveEnd: Viewpoint | null;
  modechange: { mode: DisplayMode };
  viewchange: { viewState: unknown };
}
export type MaplatAppEvent<K extends keyof MaplatAppEventDetailMap> = CustomEvent<MaplatAppEventDetailMap[K]>;

export type DisplayMode = "maplat" | "map-warp";

// ---------------------------------------------------------------------------
// 層 A の公開面（§3）
// ---------------------------------------------------------------------------

/** 層 A の要素の設定のキー（属性と同期するもの・プロパティのみのもの）。 */
export interface MaplatAppElementSettings {
  appId: string | undefined;
  appSrc: string | undefined;
  mapId: string | undefined;
  transparency: number | undefined;
  noRotate: boolean | undefined;
  northUp: boolean | undefined;
  homeMarginPixels: number | undefined;
  alwaysGpsOn: boolean | undefined;
  fake: boolean | undefined;
  enableCache: boolean | undefined;
  restoreSession: boolean | undefined;
  overlay: boolean | undefined;
  debug: boolean | undefined;
  icon: string | undefined;
  selectedIcon: string | undefined;
  noCenterMarker: boolean | undefined;
  centerMarkerSrc: string | undefined;
  setting: Record<string, any> | undefined;
  restore: Restore | undefined;
  restoreExtensionKeys: string[] | undefined;
  googleApiKey: string | undefined;
  mapboxToken: string | undefined;
  maplibregl: unknown;
  mapboxgl: unknown;
  uiHooks: Record<string, any> | undefined;
  appOption: Record<string, any> | undefined;
  poiTemplate: string | undefined;
  poiStyle: string | undefined;
  iconTemplate: string | undefined;
}

/** 層 A の状態の読み取り（§3.3）。 */
export interface MaplatAppElementState {
  readonly ready: Promise<void>;
  readonly implementation: string;
  readonly version: string;
  readonly appData: Readonly<Record<string, any>> | null;
  readonly initialRestore: Readonly<Restore>;
  readonly state: Readonly<AppState>;
  readonly currentMapId: string | null;
  readonly viewpoint: Viewpoint | null;
  readonly gpsEnabled: boolean;
}

type AnyFn = (...args: any[]) => any;

/** 旧クラスから引き継ぐ 44 のメソッド（§3.4.1）。型を揃えたもの以外は実装の戻り値のまま。 */
export interface MaplatAppDelegatedMethods {
  handleGPS: (enable: boolean, avoidEventForOff?: boolean) => any;
  getGPSEnabled: () => boolean;
  getRotation: () => number;
  getDirection: () => number;
  currentMapInfo: () => any;
  mapInfo: (mapID: string) => any;
  clientPointToLngLat: (clientX: number, clientY: number) => Promise<LngLat | null>;
  lngLatToClientPoint: (longitude: number, latitude: number) => Promise<{ x: number; y: number } | null>;
  selectMarker: AnyFn;
  unselectMarker: AnyFn;
  /** POI の datum（id か namespaceID で引く）。見つからなければ undefined */
  getMarker: (id: string) => MaplatPoi | undefined;
  updateMarker: AnyFn;
  addMarker: AnyFn;
  removeMarker: AnyFn;
  clearMarker: AnyFn;
  showAllMarkers: AnyFn;
  hideAllMarkers: AnyFn;
  /** POI のレイヤー（アプリのレイヤー → 現在の地図のレイヤー）。hideOnly で非表示のもの、nonzero で POI のあるものだけ */
  listPoiLayers: (hideOnly?: boolean, nonzero?: boolean) => PoiLayer[];
  showPoiLayer: AnyFn;
  hidePoiLayer: AnyFn;
  getPoiLayer: (id: string) => PoiLayer | undefined;
  addPoiLayer: AnyFn;
  removePoiLayer: AnyFn;
  addLine: AnyFn;
  addVector: AnyFn;
  clearLine: AnyFn;
  clearVector: AnyFn;
  setGPSMarker: AnyFn;
  changeMap: (mapID: string, restore?: Restore) => Promise<unknown>;
  requestUpdateState: (partial: Partial<AppState>) => void;
  setTransparency: (percentage: number) => void;
  getTransparency: () => number;
  setViewpoint: AnyFn;
  goHome: AnyFn;
  resetRotation: AnyFn;
  resetDirection: AnyFn;
  resetCirculation: AnyFn;
  getMapMeta: (mapID?: string) => MapMeta | undefined;
  getMapCacheEnable: (mapID?: string) => boolean;
  getMapTileCacheStatsAsync: (mapID?: string) => Promise<TileCacheStats>;
  getMapTileCacheSizeAsync: (mapID?: string) => Promise<number>;
  clearMapTileCacheAsync: (mapID?: string) => Promise<void>;
  fetchAllMapTileCacheAsync: (
    mapID: string | undefined,
    callback: (type: TileCacheProgressType, detail: TileCacheProgress) => void
  ) => Promise<void>;
  cancelMapTileCacheAsync: (mapID?: string) => Promise<void>;
}

/** 層 A で新設したメソッド（§3.4.2）。 */
export interface MaplatAppOwnMethods {
  getViewpoint(): Viewpoint | null;
  listMaps(): MapListItem[];
  supports(feature: string): boolean;
  setEnvelopes(items: EnvelopeSpec[]): void;
  getMapEnvelope(mapID: string): LngLat[] | null;
  getViewExtent(): LngLat[] | null;
  zoomBy(delta: number): void;
  /**
   * 実装の既定のピンの画像（POI にも祖先にも icon が無いマーカーに地図が描く画像。実装確認 6）。
   * selected なら選択中の画像。地図の準備前でも答える（実装に固定の値）。
   */
  getDefaultPinIcon(selected?: boolean): string;
}

/** Pro 固有のメソッド（§3.4.3）。supports("display-mode") が真の実装だけが持つ。 */
export interface MaplatAppProMethods {
  setDisplayMode(mode: DisplayMode): Promise<void>;
  getDisplayMode(): DisplayMode | null;
}

/** 層 A の公開面（`<maplat-app>`）。 */
export interface MaplatAppElement
  extends HTMLElement,
    MaplatAppElementSettings,
    MaplatAppElementState,
    MaplatAppDelegatedMethods,
    MaplatAppOwnMethods {}

// ---------------------------------------------------------------------------
// 層 B の公開面（§4）
// ---------------------------------------------------------------------------

/**
 * 層 B の公開面（`<maplat-ui>`）。
 * 注: 文言の訳のメソッドは translateText（HTMLElement の translate＝真偽のグローバル属性の
 * プロパティと衝突させない）。旧クラス MaplatUi のメソッド名は translate のまま（人間の決定: 互換を壊さない）。
 */
export interface MaplatUiElement extends HTMLElement {
  lang: string;
  enableShare: boolean | undefined;
  enableBorder: boolean | undefined;
  enableHideMarker: boolean | undefined;
  enableMarkerList: boolean | undefined;
  enablePoiHtmlNoScroll: boolean | undefined;
  presentationMode: boolean | undefined;
  stateUrl: boolean | undefined;
  pwaManifest: string | boolean | undefined;
  pwaWorker: string | undefined;
  pwaScope: string | undefined;
  appEnvelope: boolean | undefined;
  tapDuration: number | undefined;
  tapUiVanish: boolean | undefined;
  setDocumentTitle: boolean | undefined;
  restore: Restore | undefined;
  appOption: Record<string, any> | undefined;

  readonly ready: Promise<void>;
  readonly implementation: "ui" | "ui-pro";
  readonly version: string;
  readonly app: MaplatAppElement | null;
  readonly currentLang: string;

  translateText(fragment?: Localized): string | undefined;
  t(key: string, option?: object): string;
  setShowBorder(flag: boolean): void;
  setHideMarker(flag: boolean): void;
  openMarker(id: string): void;
  mapsAt(point: LngLat, threshold?: number): Promise<string[]>;
  getShareUrl(type: "app" | "view"): string;
  showToast(message: string, target?: HTMLElement): void;
}

// ---------------------------------------------------------------------------
// 型ガード（適合テストの detail の検査に使う。§8.2 A-イベント）
// ---------------------------------------------------------------------------

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const isLocalized = (v: unknown) =>
  typeof v === "string" || (!!v && typeof v === "object" && Object.values(v as object).every(x => typeof x === "string"));

export function isLngLat(v: unknown): v is LngLat {
  const o = v as LngLat;
  return !!o && typeof o === "object" && isNum(o.longitude) && isNum(o.latitude);
}

export function isViewpoint(v: unknown): v is Viewpoint {
  const o = v as Record<string, unknown>;
  if (!o || typeof o !== "object") return false;
  return ["x", "y", "longitude", "latitude", "mercator_x", "mercator_y", "zoom", "mercZoom", "direction", "rotation"].every(
    k => isNum(o[k])
  );
}

export function isMapMeta(v: unknown): v is MapMeta {
  const o = v as MapMeta;
  return !!o && typeof o === "object" && typeof o.mapID === "string" && (o.label === undefined || isLocalized(o.label));
}

export function isMapListItem(v: unknown): v is MapListItem {
  const o = v as MapListItem;
  return (
    !!o &&
    typeof o === "object" &&
    typeof o.mapID === "string" &&
    isLocalized(o.label) &&
    (o.thumbnail === null || typeof o.thumbnail === "string") &&
    ["isBasemap", "isOldMap", "isOverlay", "hasEnvelope", "cacheEnable"].every(
      k => typeof (o as unknown as Record<string, unknown>)[k] === "boolean"
    )
  );
}

const isOptionalLocalized = (v: unknown) => v === undefined || isLocalized(v);
const isPoiMedia = (v: unknown) =>
  typeof v === "string" || (!!v && typeof v === "object" && typeof (v as { src?: unknown }).src === "string");
const isOptionalPoiMedia = (v: unknown) =>
  v === undefined || (Array.isArray(v) ? v.every(isPoiMedia) : isPoiMedia(v));

/** clickMarker の detail・getMarker の戻り値の形（MaplatPoi）。中身の安全さは見ない（描く側が確かめる）。 */
export function isMaplatPoi(v: unknown): v is MaplatPoi {
  const o = v as Record<string, unknown>;
  if (!o || typeof o !== "object" || Array.isArray(o)) return false;
  if (typeof o.namespaceID !== "string" || !(typeof o.id === "string" || typeof o.id === "number")) return false;
  if (o.lnglat !== undefined && !(Array.isArray(o.lnglat) && o.lnglat.length === 2)) return false;
  if (!["name", "desc", "address", "html", "url"].every(k => isOptionalLocalized(o[k]))) return false;
  if (!isOptionalPoiMedia(o.image) || !isOptionalPoiMedia(o.media)) return false;
  if (!["icon", "selectedIcon", "poiStyle"].every(k => o[k] === undefined || typeof o[k] === "string")) return false;
  const go = o.directgo as { href?: unknown } | undefined;
  return go === undefined || typeof go === "string" || (!!go && typeof go === "object" && typeof go.href === "string");
}

/** listPoiLayers の要素の形（PoiLayer）。POI は isMaplatPoi で見る。 */
export function isPoiLayer(v: unknown): v is PoiLayer {
  const o = v as Record<string, unknown>;
  if (!o || typeof o !== "object" || Array.isArray(o)) return false;
  if (typeof o.id !== "string" || typeof o.namespaceID !== "string" || o.namespaceID === "") return false;
  if (o.name !== undefined && !isLocalized(o.name)) return false;
  if (!["icon", "selectedIcon"].every(k => o[k] === undefined || typeof o[k] === "string")) return false;
  if (o.hide !== undefined && typeof o.hide !== "boolean") return false;
  return Array.isArray(o.pois) && o.pois.every(isMaplatPoi);
}

export function isSourceLoadedDetail(v: unknown): v is SourceLoadedItem[] {
  return (
    Array.isArray(v) &&
    v.every(
      item =>
        !!item &&
        typeof item === "object" &&
        (item.mapID === null || typeof item.mapID === "string") &&
        typeof item.usable === "boolean"
    )
  );
}

export function isLifecycleDetail(v: unknown): v is LifecycleDetail {
  const o = v as Record<string, unknown>;
  if (!o || typeof o !== "object") return false;
  const keys = Object.keys(o).sort();
  return (
    (LIFECYCLE_PHASES as readonly string[]).includes(o.phaseId as string) &&
    keys.length === 2 &&
    keys[0] === "appData" &&
    keys[1] === "phaseId"
  );
}
