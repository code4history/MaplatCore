export declare const MAPLAT_APP_TAG = "maplat-app";
export declare const MAPLAT_UI_TAG = "maplat-ui";
/**
 * 層 A の要素が出すイベントのうち、旧クラス（MaplatApp）の名前をそのまま使うもの。
 * Core は src/index.ts の dispatchEvent をこの表と突き合わせる（spec/element.spec.ts）。
 */
export declare const MAPLAT_APP_EVENTS: readonly ["lifecycle:setting-loaded", "lifecycle:appdata-ready", "lifecycle:ui-configure", "lifecycle:core-dom-ready", "lifecycle:ui-dom-ready", "lifecycle:core-ready", "lifecycle:ui-ready", "lifecycle:error", "sourceLoaded", "mapChanged", "changeViewpoint", "updateState", "outOfMap", "poi_number", "clickMarker", "clickMarkers", "clickMap", "clickMapXy", "clickMapMerc", "pointerMoveOnMapXy", "pointerMoveOnMapMerc", "gps_request", "gps_result", "gps_error"];
export type MaplatAppEventName = (typeof MAPLAT_APP_EVENTS)[number];
/** 層 A の要素が新設するイベント。 */
export declare const ELEMENT_OWN_EVENTS: readonly ["gpsEnabledChanged", "moveStart", "moveEnd"];
export type ElementOwnEventName = (typeof ELEMENT_OWN_EVENTS)[number];
/** 層 A のうち Pro 固有のイベント（supports() が真のときだけ出る）。 */
export declare const LAYER_A_PRO_EVENTS: readonly [{
    readonly event: "modechange";
    readonly feature: "display-mode";
}, {
    readonly event: "viewchange";
    readonly feature: "display-mode";
}];
/** ライフサイクルの段階（旧と同順）。 */
export declare const LIFECYCLE_PHASES: readonly ["setting-loaded", "appdata-ready", "ui-configure", "core-dom-ready", "ui-dom-ready", "core-ready", "ui-ready"];
export type LifecyclePhaseId = (typeof LIFECYCLE_PHASES)[number];
/** 旧クラスから引き継ぐ公開メソッド（46 個。旧クラスが持つ 44 個＋#91 の removeVector・removeLine）。要素は実装の同名メソッドへ委譲する。 */
export declare const MAPLAT_APP_METHODS: readonly ["handleGPS", "getGPSEnabled", "getRotation", "getDirection", "currentMapInfo", "mapInfo", "clientPointToLngLat", "lngLatToClientPoint", "selectMarker", "unselectMarker", "getMarker", "updateMarker", "addMarker", "removeMarker", "clearMarker", "showAllMarkers", "hideAllMarkers", "listPoiLayers", "showPoiLayer", "hidePoiLayer", "getPoiLayer", "addPoiLayer", "removePoiLayer", "addLine", "addVector", "removeVector", "removeLine", "clearLine", "clearVector", "setGPSMarker", "changeMap", "requestUpdateState", "setTransparency", "getTransparency", "setViewpoint", "goHome", "resetRotation", "resetDirection", "resetCirculation", "getMapMeta", "getMapCacheEnable", "getMapTileCacheStatsAsync", "getMapTileCacheSizeAsync", "clearMapTileCacheAsync", "fetchAllMapTileCacheAsync", "cancelMapTileCacheAsync"];
export type MaplatAppMethodName = (typeof MAPLAT_APP_METHODS)[number];
/** 層 A で新設したメソッド。 */
export declare const ELEMENT_OWN_METHODS: readonly ["getViewpoint", "listMaps", "supports", "setEnvelopes", "getMapEnvelope", "getViewExtent", "zoomBy", "getDefaultPinIcon"];
export type ElementOwnMethodName = (typeof ELEMENT_OWN_METHODS)[number];
/** Pro 固有のメソッド。対応する機能が supports() で偽なら要素に**定義しない**。 */
export declare const LAYER_A_PRO_METHODS: readonly [{
    readonly method: "setDisplayMode";
    readonly feature: "display-mode";
}, {
    readonly method: "getDisplayMode";
    readonly feature: "display-mode";
}];
/** 層 A の状態の読み取り（読み取り専用プロパティ）。 */
export declare const LAYER_A_STATE_PROPERTIES: readonly ["ready", "implementation", "version", "appData", "initialRestore", "state", "currentMapId", "viewpoint", "gpsEnabled"];
export type LayerAImplementationName = "core" | "core-pro";
/** 機能名の表。足すときはこの表と適合テスト（src/conformance）も更新する。 */
export declare const LAYER_A_FEATURES: Readonly<Record<string, Readonly<Record<LayerAImplementationName, boolean>>>>;
export declare const LAYER_A_FEATURE_NAMES: string[];
/** 実装名から機能表の 1 列を取り出す（未知の実装名は全部 false）。 */
export declare function featuresOf(implementation: string): Record<string, boolean>;
/**
 * 属性の値の種類。"boolean-or-string" は真偽と文字列の両方を取るキー（pwa-manifest:
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
    /** 起動時だけ効く（起動後は変更不可・警告して無視） */
    startup?: boolean;
    /** 旧 appOption のキー名（移行用の口 appOption と、実装への受け渡しに使う） */
    option?: string;
    /** 地図の準備を待たずに DOM だけで当てるキー（中心の目印） */
    dom?: boolean;
    /** Pro 固有のキー: この機能が supports() で偽の実装は警告して無視する */
    feature?: string;
    /**
     * 内部の操作（UI・メソッド・状態 URL の復元）で変わる状態のキー（2026-10-11 改訂）。
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
/** 層 A の属性と同期するキー（中心の目印を含む）。 */
export declare const ELEMENT_ATTRIBUTES: readonly AttrDef[];
/** 層 A のプロパティのみのキー。 */
export declare const ELEMENT_PROPERTIES: readonly PropDef[];
/**
 * 層 A の Pro 固有の属性。要素は全実装でこの属性を観測し、対応する機能を持たない実装
 * （Core 等）は**キーごとに 1 回**警告して無視する。警告文に実装の名を出さない。
 * ここに挙がっているのは display-mode だけ（足すときはこの表と一緒に更新する）。
 */
export declare const LAYER_A_PRO_ATTRIBUTES: readonly AttrDef[];
/** 層 A の Pro 固有のプロパティのみのキー（現時点では無し）。 */
export declare const LAYER_A_PRO_PROPERTIES: readonly PropDef[];
/** 起動時だけ効くキーのプロパティ名（属性・プロパティのみの両方）。 */
export declare const ELEMENT_STARTUP_KEYS: readonly string[];
/** 旧 appOption の名前 → 要素のプロパティ名。appOption に新しい名前で書かれていたら旧名へ寄せる。 */
export declare const APP_OPTION_ALIASES: Readonly<Record<string, string>>;
/** プロパティ名 → 属性名（大文字の前で区切り、略語は 1 語として扱う）。 */
export declare function propToAttributeName(prop: string): string;
/** 属性名 → プロパティ名。 */
export declare function attributeToPropName(attr: string): string;
/**
 * 要素の経路の uiHooks に、`context.core` と `context.mapDivDocument` を要素に差し替えた写しを返す
 * 元の hook オブジェクトは書き換えない（旧クラスの経路は `core: MaplatApp` のまま）。
 * hook は名前の表を回して `hooks[name]` で引く（クラスのインスタンスや `Object.create` で作った
 * オブジェクトのプロトタイプ上の hook も落とさない）。表に無いキーは今までどおり写す。
 */
export declare function wrapUiHooksForElement<H extends Record<string, any>>(hooks: H, element: HTMLElement): Record<string, any>;
/** 属性の文字列 → 値。undefined は「未指定」。不正な値は warn を呼んで未指定にする。 */
export declare function parseAttributeValue(def: Pick<AttrDef, "attr" | "kind">, raw: string | null, warn?: (message: string) => void, tagName?: string): unknown;
/** 値 → 属性の文字列（null は属性を外す）。 */
export declare function formatAttributeValue(def: Pick<AttrDef, "kind">, value: unknown): string | null;
/** 未対応の Pro 固有キーの警告文（実装の名を出さない）。 */
export declare function unsupportedKeyMessage(key: {
    attr?: string;
    prop: string;
}, via: "attribute" | "property", tagName?: string): string;
/** 層 B が自分で持つ属性（層 A へ流すキーは ELEMENT_ATTRIBUTES）。 */
export declare const MAPLAT_UI_ATTRIBUTES: readonly AttrDef[];
/** 層 B が出すイベント（層 A のイベントは子から泡立って通る）。 */
export declare const MAPLAT_UI_EVENTS: readonly ["uiReady"];
/** 層 B の公開メソッド。 */
export declare const MAPLAT_UI_METHODS: readonly ["translateText", "t", "setShowBorder", "setHideMarker", "openMarker", "mapsAt", "getShareUrl", "showToast"];
export type LngLat = {
    longitude: number;
    latitude: number;
};
export type Localized = string | Record<string, string>;
/** changeViewpoint の detail・viewpoint プロパティ・getViewpoint() の戻り値。 */
export interface Viewpoint {
    /** 地図の座標（不透明な値。sysCoord） */
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
/** sourceLoaded の detail の要素。 */
export interface SourceLoadedItem {
    mapID: string | null;
    usable: boolean;
}
/** getMapTileCacheStatsAsync の戻り値（total を含める）。 */
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
export type MaplatPoiMedia = string | {
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
    directgo?: string | {
        href: string;
        blank?: boolean;
    };
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
export type GpsResultDetail = {
    lnglat: [number, number];
    acc: number;
} | {
    error: "gps_off" | "gps_out" | "gps_out_hide";
};
export type GpsErrorDetail = "user_gps_deny" | "gps_miss" | "gps_timeout";
/** イベント名 → detail の型。 */
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
    gpsEnabledChanged: {
        enabled: boolean;
    };
    moveStart: Record<string, never>;
    moveEnd: Viewpoint | null;
    modechange: {
        mode: DisplayMode;
    };
    viewchange: {
        viewState: unknown;
    };
}
export type MaplatAppEvent<K extends keyof MaplatAppEventDetailMap> = CustomEvent<MaplatAppEventDetailMap[K]>;
export type DisplayMode = "maplat" | "map-warp";
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
    hideOutsidePois: boolean | undefined;
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
/** 層 A の状態の読み取り。 */
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
/** 旧クラスから引き継ぐ 46 のメソッド（旧クラスの 44 個＋#91 の 2 個）。型を揃えたもの以外は実装の戻り値のまま。 */
export interface MaplatAppDelegatedMethods {
    handleGPS: (enable: boolean, avoidEventForOff?: boolean) => any;
    getGPSEnabled: () => boolean;
    getRotation: () => number;
    /** 実世界の方位（度）。旧クラス（Core・Pro とも）が async なので Promise */
    getDirection: () => Promise<number>;
    currentMapInfo: () => any;
    mapInfo: (mapID: string) => any;
    clientPointToLngLat: (clientX: number, clientY: number) => Promise<LngLat | null>;
    lngLatToClientPoint: (longitude: number, latitude: number) => Promise<{
        x: number;
        y: number;
    } | null>;
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
    removeVector: AnyFn;
    removeLine: AnyFn;
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
    fetchAllMapTileCacheAsync: (mapID: string | undefined, callback: (type: TileCacheProgressType, detail: TileCacheProgress) => void) => Promise<void>;
    cancelMapTileCacheAsync: (mapID?: string) => Promise<void>;
}
/** 層 A で新設したメソッド。 */
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
/** Pro 固有のメソッド。supports("display-mode") が真の実装だけが持つ。 */
export interface MaplatAppProMethods {
    setDisplayMode(mode: DisplayMode): Promise<void>;
    getDisplayMode(): DisplayMode | null;
}
/** 層 A の公開面（`<maplat-app>`）。 */
export interface MaplatAppElement extends HTMLElement, MaplatAppElementSettings, MaplatAppElementState, MaplatAppDelegatedMethods, MaplatAppOwnMethods {
}
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
export declare function isLngLat(v: unknown): v is LngLat;
export declare function isViewpoint(v: unknown): v is Viewpoint;
export declare function isMapMeta(v: unknown): v is MapMeta;
export declare function isMapListItem(v: unknown): v is MapListItem;
/** clickMarker の detail・getMarker の戻り値の形（MaplatPoi）。中身の安全さは見ない（描く側が確かめる）。 */
export declare function isMaplatPoi(v: unknown): v is MaplatPoi;
/** listPoiLayers の要素の形（PoiLayer）。POI は isMaplatPoi で見る。 */
export declare function isPoiLayer(v: unknown): v is PoiLayer;
export declare function isSourceLoadedDetail(v: unknown): v is SourceLoadedItem[];
export declare function isLifecycleDetail(v: unknown): v is LifecycleDetail;
export {};
