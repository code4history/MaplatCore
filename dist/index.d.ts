import { default as CustomEvent } from './customevent';
import { Logger } from './logger';
import { createElement } from './functions';
import { default as EventTarget } from 'ol/events/Target';
import { MaplatMap } from './map_ex';
import { BackmapSource, MaplatSource, mapSourceFactory } from './source_ex';
import { ViewpointArray } from './source/mixin';
import { OutsideSelection } from './outside_pois';
import { Geolocation } from './geolocation';
import { Coordinate } from 'ol/coordinate';
import { default as BaseEvent } from 'ol/events/Event';
import { assets } from './assets';
export { sanitizeHtml, escapeAttr, toPlainText, buildSlideAttrs } from './sanitize';
/** EPSG:3857 → 経緯度。経度は ±180 に巻き戻す（ol の toLonLat と同じ規則）。
 *  <maplat-app> の getMapEnvelope・getViewExtent が使う（旧クラスは transform のまま）。 */
export declare function mercToLngLat(merc: readonly number[]): [number, number];
/** 既定のピンの画像（POI にも祖先にも icon が無いマーカーに地図が描く画像）。 */
export declare function defaultPinIcon(selected?: boolean): string;
interface AppData {
    sources: string[];
    lang?: string;
    pois?: any;
    homePosition?: Coordinate;
    defaultZoom?: number;
    zoomRestriction?: boolean;
    minZoom?: number;
    maxZoom?: number;
    appName?: string;
    fakeGps?: Coordinate;
    fakeRadius?: number;
    noRotate?: boolean;
    poiTemplate?: string;
    poiStyle?: string;
    iconTemplate?: string;
    startFrom?: string;
    controls?: any[];
    northUp?: boolean;
    tapDuration?: number;
    homeMarginPixels: number;
    tapUIVanish: boolean;
}
type PositionSet = {
    x: number;
    y: number;
    zoom: number;
    rotation: number;
};
interface Restore {
    mapID?: string;
    backgroundID?: string;
    position?: PositionSet;
    transparency?: number;
    hideMarker?: number;
    hideLayer?: string;
}
export declare class GPSErrorEvent extends BaseEvent {
    detail: string;
    constructor(detail: string);
}
export declare class GPSResultEvent extends BaseEvent {
    detail: any;
    constructor(detail: any);
}
export declare class GPSRequestEvent extends BaseEvent {
    constructor();
}
export interface PoiLayer {
    id: string;
    namespaceID: string;
    name: string | Record<string, string>;
    pois: any[];
    hide?: boolean;
    icon?: string;
    selectedIcon?: string;
    [key: string]: any;
}
export type VectorType = "Line" | "Polygon";
export interface VectorFilter {
    type?: VectorType;
}
/**
 * <maplat-app> が Core の実装にだけ求める内部面。
 * 公開面ではない（公開文書には載せない）。要素は `as any` でなくこの型で受ける。
 * @internal
 */
export interface ElementImplementationInternals {
    /** sourceLoaded の { mapID, usable }[] の材料（cacheHash の同一性）。 */
    sourceLoadedDetail(sources: unknown): {
        mapID: string | null;
        usable: boolean;
    }[];
    /** pixel → 地図の座標 → merc の連鎖（旧 clientPointToLngLat と同じ・点検なし）。 */
    pixelToMerc(pixel: readonly [number, number]): Promise<number[] | undefined>;
    /** 表示領域の大きさ（pixel）。地図が無い・寸法が 0 以下なら undefined。 */
    viewportSize(): [number, number] | undefined;
    /** 前面と背面の地図の大きさを測り直す。 */
    updateSize(): void;
    /** 中心の目印の表現を当てる。 */
    setCenterMarker(next: {
        hidden?: boolean;
        src?: string | null;
    }): void;
    /** 起動後の機能系キー・テンプレート・icon を当てる（undefined は既定／設定ファイル）。 */
    applyRuntimeOptions(values: Record<string, unknown>): void;
}
/**
 * 旧 API のアプリ本体（OpenLayers の地図・POI・GPS 等を持つクラス）。
 *
 * @deprecated `MaplatApp` クラスは非推奨です。代わりに `<maplat-app>` 要素
 *   （`@maplat/core/element`）を使ってください。1.x では従来どおり使えますが、
 *   このクラスは 2.0 で閉じます（2.0 で削除します）。移行の対応表は
 *   `docs/api/maplat-app.md`（日本語は `docs/api/maplat-app.ja.md`）。
 */
export declare class MaplatApp extends EventTarget implements ElementImplementationInternals {
    /**
     * 旧 API の生成口（`new MaplatApp(option)` のあと `waitReady` を待つ）。
     *
     * @deprecated `MaplatApp` クラスは非推奨です。代わりに `<maplat-app>` 要素
     *   （`@maplat/core/element`）を使ってください。1.x では従来どおり使えますが、
     *   この口は 2.0 で閉じます（2.0 で削除します）。
     */
    static createObject: (option: any) => Promise<MaplatApp>;
    translateUI: boolean;
    stateBuffer: Restore;
    mobileMapMoveBuffer?: ViewpointArray;
    waitReady: Promise<any>;
    changeMapSeq?: Promise<void>;
    appData?: AppData;
    backMap?: MaplatMap;
    mercSrc?: BackmapSource;
    mercBuffer: any;
    timer: any;
    appName: any;
    cacheHash: any;
    currentPosition: any;
    startFrom?: string | undefined;
    from?: MaplatSource;
    mapObject: any;
    mapboxMap: any;
    maplibreMap: any;
    pois: any;
    poiTemplate?: string;
    poiStyle?: string;
    iconTemplate?: string;
    logger: Logger;
    icon?: string;
    selectedIcon?: string;
    homePosition?: [number, number];
    geolocation?: Geolocation;
    moveTo_: boolean;
    gpsEnabled_: boolean;
    firstGpsRequest_: boolean;
    initialGpsMove_: boolean;
    private __backMapMoving;
    private __backMapErrorWarned;
    /** @internal 選択中の POI の namespaceID（範囲外の扱いは src/outside_pois.ts が読む） */
    __selectedMarker?: any;
    /** @internal 範囲外の POI を選んでいる間の状態（src/outside_pois.ts が読む） */
    __outsideSelection?: OutsideSelection;
    /** @internal 範囲外の POI を描かない指定（hide-outside-pois。src/outside_pois.ts が読む） */
    __hideOutsidePois: boolean;
    /** @internal 範囲外の選択を外した後の引き戻しの予約（selectMarker で取り消す） */
    __pullBackTimer?: {
        cancelled?: boolean;
    };
    private __resizeObserver;
    private __visibilityHandler;
    private __pendingView;
    private __pendingViewScheduled;
    private __centerMarkerImg?;
    private lifecycleHookResults;
    private __init;
    private __redrawMarkerBlock;
    private __redrawMarkerThrottle;
    private __transparency;
    private __vectors?;
    private __vectorSeq?;
    private __vectorDrawSeq?;
    lastClickEvent: any;
    /** @internal */
    protected __startupLocked: boolean;
    /** @internal */
    protected __startupWarner?: (key: string, message: string) => void;
    private __appid;
    private __mapDiv;
    private __mapDivDocument;
    private __enableCache;
    private __noRotate;
    private __alwaysGpsOn;
    private __overlay;
    private __googleApiKey?;
    private __restoreSession;
    private __initialRestore;
    private __uiHooks?;
    private __fakeGps;
    private __fakeRadius?;
    private __elementMode;
    private __settingFileKeys?;
    private __featureKeyWarner?;
    /** アプリ ID（appOption.appid）。起動後は変更不可。 */
    get appid(): string;
    /** 地図の箱の id（要素で渡したときは内部の子要素の id 接頭辞）。起動後は変更不可。 */
    get mapDiv(): string;
    /** 地図の箱の要素。起動後は変更不可。 */
    get mapDivDocument(): HTMLElement | null;
    /** タイルキャッシュを使うか（appOption.enableCache）。起動後は変更不可。 */
    get enableCache(): boolean;
    /** 回転操作を止めるか（appOption.noRotate ／設定ファイル）。起動後は変更不可。 */
    get noRotate(): boolean;
    /** 常時 GPS モード（appOption.alwaysGpsOn）。起動後は変更不可。 */
    get alwaysGpsOn(): boolean;
    /** 背面地図を持つか（appOption.overlay）。起動後は変更不可。 */
    get overlay(): boolean;
    /** Google の API キー（appOption.googleApiKey）。起動後は変更不可。 */
    get googleApiKey(): string | undefined;
    /** 状態を localStorage に保存・復元するか（appOption.restoreSession）。起動後は変更不可。 */
    get restoreSession(): boolean;
    /** 起動時に使った復元値（appOption.restore または localStorage）。起動後は差し替え不可。 */
    get initialRestore(): Restore;
    /** 偽 GPS の中心（appOption.fake が真のときの設定ファイルの fakeGps）。起動後は変更不可。 */
    get fakeGps(): any;
    /** 偽 GPS の半径（同上）。起動後は変更不可。 */
    get fakeRadius(): number | undefined;
    /** 起動時の hook（appOption.uiHooks）。起動後は変更不可。 */
    private get uiHooks();
    /**
     * 機能系キーを appOption ＞ 設定ファイル ＞ 既定値 の順で決める。
     * 「与えられたか」は undefined / null で判定する（false・0 は与えられた値）。
     * 要素の経路（<maplat-app>）では設定ファイルの値を読まない。旧クラスの経路では読むが、
     * メジャー版で廃止する旨を 1 回警告する。
     */
    private __featureOption;
    constructor(appOption: any);
    /**
     * @internal 中心の目印の表現を当てる。既定の画像は Core が持つ assets.redcircle で、
     * 要素は「既定 src の控え」を持たない。
     */
    setCenterMarker(next: {
        hidden?: boolean;
        src?: string | null;
    }): void;
    /**
     * @internal 起動後の機能系キー・テンプレート・icon を当てる。
     * `undefined` は「与えられていない」＝ Core の既定（RUNTIME_DEFAULTS）／設定ファイルの値。
     * キーの有無は `in` で見る（`{ northUp: undefined }` は「外された」を意味する）。
     */
    applyRuntimeOptions(values: Record<string, unknown>): void;
    private buildLifecycleContext;
    private runLifecyclePhase;
    settingLoader(setting: any): Promise<any>;
    sourcesLoader(mapReturnValue: any): Promise<any[]>;
    handleSetting(setting: any, appOption: any): Promise<void>;
    initGeolocation(appOption: any): void;
    handleGPS(enable: boolean, avoidEventForOff?: boolean): void;
    getGPSEnabled(): boolean;
    prepareMap(appOption: any): Promise<{
        homePos: Coordinate | undefined;
        defZoom: number | undefined;
        zoomRestriction: boolean | undefined;
        mercMinZoom: number | undefined;
        mercMaxZoom: number | undefined;
    }>;
    handlePois(pois: any, mapReturnValue: any): Promise<void>;
    /**
     * @internal sourceLoaded の材料。「GL 未ロード等で落とした source は usable: false」の
     * 判断は keep を決めている側（cacheHash の同一性）に 1 つだけ置く。Set は持たない。
     */
    sourceLoadedDetail(sources: unknown): {
        mapID: string | null;
        usable: boolean;
    }[];
    handleSources(sources: any): Promise<void>;
    setInitialMap(cache: MaplatSource[]): Promise<void>;
    setMapClick(): void;
    setPointerEvents(): void;
    setMapOnOff(): void;
    setMouseCursor(): void;
    setBackMapBehavior(): void;
    private __reportBackMapError;
    raiseChangeViewpoint(): void;
    getRotation(): number;
    getDirection(): Promise<number>;
    currentMapInfo(): any;
    mapInfo(mapID: string): any;
    /** @internal 要素の viewExtent。pixel → 地図の座標 → merc を旧の連鎖のまま返す。 */
    pixelToMerc(pixel: readonly [number, number]): Promise<number[] | undefined>;
    /** @internal 表示領域の大きさ。4 隅の作り方は要素が持つ。 */
    viewportSize(): [number, number] | undefined;
    /** @internal 前面と背面の地図の大きさを測り直す。 */
    updateSize(): void;
    clientPointToLngLat(clientX: number, clientY: number): Promise<{
        longitude: number;
        latitude: number;
    } | undefined>;
    lngLatToClientPoint(longitude: number, latitude: number): Promise<{
        x: any;
        y: any;
    } | undefined>;
    setMarker(data: any): Promise<void>;
    resetMarker(): void;
    setLine(data: any): void;
    setVector(data: any): void;
    private __projectVector;
    private __vectorStore;
    private __nextVectorDrawToken;
    private __drawVectorEntry;
    private __addEntry;
    get vectors(): any[];
    resetLine(): void;
    resetVector(): void;
    redrawMarkers(source?: MaplatSource | undefined): void;
    selectMarker(id: any): void;
    unselectMarker(): void;
    getMarker(id: any): any;
    updateMarker(id: any, data: any, overwrite: any): void;
    addMarker(data: any, clusterId: any): any;
    removeMarker(id: any): void;
    clearMarker(clusterId: any): void;
    showAllMarkers(): void;
    hideAllMarkers(): void;
    dispatchPoiNumber(): void;
    listPoiLayers(hideOnly?: boolean, nonzero?: boolean): any[];
    showPoiLayer(id: any): void;
    hidePoiLayer(id: any): void;
    getPoiLayer(id: any): any;
    addPoiLayer(id: any, data: any): void;
    removePoiLayer(id: any): void;
    addLine(data: any): string;
    addVector(data: any): string;
    removeVector(id: string): boolean;
    removeLine(id: string): boolean;
    clearLine(filter?: VectorFilter): void;
    clearVector(filter?: VectorFilter): void;
    setGPSMarker(position: any): void;
    changeMap(mapID: string, restore?: Restore): Promise<void>;
    requestUpdateState(data: Restore): void;
    setTransparency(percentage: any): void;
    getTransparency(): any;
    setViewpoint(cond: any): void;
    goHome(useTo?: MaplatSource): void;
    private registerSelfHeal;
    private __applyInitialViewpoint;
    private __schedulePendingView;
    private __applyPendingView;
    private __captureViewState;
    private __captureRawViewState;
    private __hasMapSize;
    resetRotation(): void;
    resetDirection(): void;
    resetCirculation(): void;
    getMapMeta(mapID: any): any;
    getMapCacheEnable(mapID: string): boolean;
    getMapTileCacheStatsAsync(mapID: string): Promise<any>;
    getMapTileCacheSizeAsync(mapID: string): Promise<any>;
    clearMapTileCacheAsync(mapID: string): Promise<void>;
    fetchAllMapTileCacheAsync(mapID: string, callback: any): Promise<void>;
    cancelMapTileCacheAsync(mapID: string): Promise<void>;
    convertParametersFromCurrent(to: any, callback: any): void;
    private __convertFromCurrent;
    private __convertParameters;
    remove(): void;
}
/**
 * 起動時だけ効くキーに対応する MaplatApp の公開フィールド。起動後（コンストラクタの
 * 完了後）に外から代入されたら警告して無視する（キーごと・インスタンスごとに 1 回）。
 * 読み取りは従来どおり。Core 自身は __<name> の保管場所へ書く。
 */
export declare const MAPLAT_APP_STARTUP_FIELDS: readonly ["appid", "mapDiv", "mapDivDocument", "enableCache", "noRotate", "alwaysGpsOn", "overlay", "googleApiKey", "restoreSession", "initialRestore", "uiHooks", "fakeGps", "fakeRadius"];
export { createElement };
export { CustomEvent };
export { MaplatMap };
export { mapSourceFactory };
export type { MaplatSource, BackmapSource };
export { assets };
