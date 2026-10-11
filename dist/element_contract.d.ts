export declare const MAPLAT_APP_TAG = "maplat-app";
export declare const MAPLAT_UI_TAG = "maplat-ui";
export declare const MAPLAT_APP_EVENTS: readonly ["lifecycle:setting-loaded", "lifecycle:appdata-ready", "lifecycle:ui-configure", "lifecycle:core-dom-ready", "lifecycle:ui-dom-ready", "lifecycle:core-ready", "lifecycle:ui-ready", "lifecycle:error", "sourceLoaded", "mapChanged", "changeViewpoint", "updateState", "outOfMap", "poi_number", "clickMarker", "clickMarkers", "clickMap", "clickMapXy", "clickMapMerc", "pointerMoveOnMapXy", "pointerMoveOnMapMerc", "gps_request", "gps_result", "gps_error"];
export type MaplatAppEventName = (typeof MAPLAT_APP_EVENTS)[number];
export declare const ELEMENT_OWN_EVENTS: readonly ["gpsEnabledChanged", "moveStart", "moveEnd"];
export type ElementOwnEventName = (typeof ELEMENT_OWN_EVENTS)[number];
export declare const LAYER_A_PRO_EVENTS: readonly [{
    readonly event: "modechange";
    readonly feature: "display-mode";
}, {
    readonly event: "viewchange";
    readonly feature: "display-mode";
}];
export declare const LIFECYCLE_PHASES: readonly ["setting-loaded", "appdata-ready", "ui-configure", "core-dom-ready", "ui-dom-ready", "core-ready", "ui-ready"];
export type LifecyclePhaseId = (typeof LIFECYCLE_PHASES)[number];
export declare const MAPLAT_APP_METHODS: readonly ["handleGPS", "getGPSEnabled", "getRotation", "getDirection", "currentMapInfo", "mapInfo", "clientPointToLngLat", "lngLatToClientPoint", "selectMarker", "unselectMarker", "getMarker", "updateMarker", "addMarker", "removeMarker", "clearMarker", "showAllMarkers", "hideAllMarkers", "listPoiLayers", "showPoiLayer", "hidePoiLayer", "getPoiLayer", "addPoiLayer", "removePoiLayer", "addLine", "addVector", "clearLine", "clearVector", "setGPSMarker", "changeMap", "requestUpdateState", "setTransparency", "getTransparency", "setViewpoint", "goHome", "resetRotation", "resetDirection", "resetCirculation", "getMapMeta", "getMapCacheEnable", "getMapTileCacheStatsAsync", "getMapTileCacheSizeAsync", "clearMapTileCacheAsync", "fetchAllMapTileCacheAsync", "cancelMapTileCacheAsync"];
export type MaplatAppMethodName = (typeof MAPLAT_APP_METHODS)[number];
export declare const ELEMENT_OWN_METHODS: readonly ["getViewpoint", "listMaps", "supports", "setEnvelopes", "getMapEnvelope", "getViewExtent", "zoomBy", "getDefaultPinIcon"];
export type ElementOwnMethodName = (typeof ELEMENT_OWN_METHODS)[number];
export declare const LAYER_A_PRO_METHODS: readonly [{
    readonly method: "setDisplayMode";
    readonly feature: "display-mode";
}, {
    readonly method: "getDisplayMode";
    readonly feature: "display-mode";
}];
export declare const LAYER_A_STATE_PROPERTIES: readonly ["ready", "implementation", "version", "appData", "initialRestore", "state", "currentMapId", "viewpoint", "gpsEnabled"];
export type LayerAImplementationName = "core" | "core-pro";
export declare const LAYER_A_FEATURES: Readonly<Record<string, Readonly<Record<LayerAImplementationName, boolean>>>>;
export declare const LAYER_A_FEATURE_NAMES: string[];
export declare function featuresOf(implementation: string): Record<string, boolean>;
export type AttrKind = "string" | "number" | "boolean" | "boolean-or-string";
export interface AttrDef {
    attr: string;
    prop: string;
    kind: AttrKind;
    startup?: boolean;
    option?: string;
    dom?: boolean;
    feature?: string;
    state?: "change" | "frame";
}
export interface PropDef {
    prop: string;
    startup?: boolean;
    option?: string;
    feature?: string;
}
export declare const ELEMENT_ATTRIBUTES: readonly AttrDef[];
export declare const ELEMENT_PROPERTIES: readonly PropDef[];
export declare const LAYER_A_PRO_ATTRIBUTES: readonly AttrDef[];
export declare const LAYER_A_PRO_PROPERTIES: readonly PropDef[];
export declare const ELEMENT_STARTUP_KEYS: readonly string[];
export declare const APP_OPTION_ALIASES: Readonly<Record<string, string>>;
export declare function propToAttributeName(prop: string): string;
export declare function attributeToPropName(attr: string): string;
export declare function parseAttributeValue(def: Pick<AttrDef, "attr" | "kind">, raw: string | null, warn?: (message: string) => void, tagName?: string): unknown;
export declare function formatAttributeValue(def: Pick<AttrDef, "kind">, value: unknown): string | null;
export declare function unsupportedKeyMessage(key: {
    attr?: string;
    prop: string;
}, via: "attribute" | "property", tagName?: string): string;
export declare const MAPLAT_UI_ATTRIBUTES: readonly AttrDef[];
export declare const MAPLAT_UI_EVENTS: readonly ["uiReady"];
export declare const MAPLAT_UI_METHODS: readonly ["translateText", "t", "setShowBorder", "setHideMarker", "openMarker", "mapsAt", "getShareUrl", "showToast"];
export type LngLat = {
    longitude: number;
    latitude: number;
};
export type Localized = string | Record<string, string>;
export interface Viewpoint {
    x: number;
    y: number;
    longitude: number;
    latitude: number;
    mercator_x: number;
    mercator_y: number;
    zoom: number;
    mercZoom: number;
    direction: number;
    rotation: number;
}
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
export interface Restore {
    mapID?: string;
    backgroundID?: string;
    position?: RestorePosition;
    transparency?: number;
    hideMarker?: number;
    hideLayer?: string;
    [extension: string]: unknown;
}
export type AppState = Restore;
export interface EnvelopeStroke {
    color: string;
    width?: number;
    lineDash?: [number, number];
}
export interface EnvelopeSpec {
    mapID: string;
    stroke?: EnvelopeStroke;
    fill?: string;
}
export interface LifecycleDetail {
    phaseId: LifecyclePhaseId;
    appData: Readonly<Record<string, any>> | null;
}
export interface LifecycleErrorDetail {
    phaseId: LifecyclePhaseId;
    error: unknown;
}
export interface SourceLoadedItem {
    mapID: string | null;
    usable: boolean;
}
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
export type MaplatPoiMedia = string | {
    src: string;
    type?: string;
    thumbnail?: string;
    caption?: Localized;
    desc?: Localized;
    [key: string]: unknown;
};
export interface MaplatPoi {
    id: string | number;
    namespaceID: string;
    lnglat?: [number, number];
    x?: number;
    y?: number;
    name?: Localized;
    desc?: Localized;
    address?: Localized;
    image?: MaplatPoiMedia | MaplatPoiMedia[];
    media?: MaplatPoiMedia | MaplatPoiMedia[];
    html?: Localized;
    poiStyle?: string;
    url?: Localized;
    directgo?: string | {
        href: string;
        blank?: boolean;
    };
    icon?: string;
    selectedIcon?: string;
    [key: string]: unknown;
}
export interface PoiLayer {
    id: string;
    namespaceID: string;
    name?: Localized;
    icon?: string;
    selectedIcon?: string;
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
export interface MaplatAppDelegatedMethods {
    handleGPS: (enable: boolean, avoidEventForOff?: boolean) => any;
    getGPSEnabled: () => boolean;
    getRotation: () => number;
    getDirection: () => number;
    currentMapInfo: () => any;
    mapInfo: (mapID: string) => any;
    clientPointToLngLat: (clientX: number, clientY: number) => Promise<LngLat | null>;
    lngLatToClientPoint: (longitude: number, latitude: number) => Promise<{
        x: number;
        y: number;
    } | null>;
    selectMarker: AnyFn;
    unselectMarker: AnyFn;
    getMarker: (id: string) => MaplatPoi | undefined;
    updateMarker: AnyFn;
    addMarker: AnyFn;
    removeMarker: AnyFn;
    clearMarker: AnyFn;
    showAllMarkers: AnyFn;
    hideAllMarkers: AnyFn;
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
    fetchAllMapTileCacheAsync: (mapID: string | undefined, callback: (type: TileCacheProgressType, detail: TileCacheProgress) => void) => Promise<void>;
    cancelMapTileCacheAsync: (mapID?: string) => Promise<void>;
}
export interface MaplatAppOwnMethods {
    getViewpoint(): Viewpoint | null;
    listMaps(): MapListItem[];
    supports(feature: string): boolean;
    setEnvelopes(items: EnvelopeSpec[]): void;
    getMapEnvelope(mapID: string): LngLat[] | null;
    getViewExtent(): LngLat[] | null;
    zoomBy(delta: number): void;
    getDefaultPinIcon(selected?: boolean): string;
}
export interface MaplatAppProMethods {
    setDisplayMode(mode: DisplayMode): Promise<void>;
    getDisplayMode(): DisplayMode | null;
}
export interface MaplatAppElement extends HTMLElement, MaplatAppElementSettings, MaplatAppElementState, MaplatAppDelegatedMethods, MaplatAppOwnMethods {
}
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
export declare function isMaplatPoi(v: unknown): v is MaplatPoi;
export declare function isPoiLayer(v: unknown): v is PoiLayer;
export declare function isSourceLoadedDetail(v: unknown): v is SourceLoadedItem[];
export declare function isLifecycleDetail(v: unknown): v is LifecycleDetail;
export {};
