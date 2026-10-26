import { ElementStartupConfig, LayerAImplementation } from '../element_base';
import { DisplayMode, EnvelopeSpec, LngLat, MapMeta, MaplatPoi, PoiLayer, Restore, TileCacheProgress, TileCacheProgressType, TileCacheStats } from '../element_contract';
/** 模擬の設定ファイルの sources の 1 件（文字列なら mapID だけのベースマップ）。 */
export interface MockSource {
    mapID: string;
    label?: string | Record<string, string>;
    thumbnail?: string | null;
    isBasemap?: boolean;
    isOldMap?: boolean;
    isOverlay?: boolean;
    /** 地図の範囲（経緯度の多角形） */
    envelope?: [number, number][];
    cacheEnable?: boolean;
    /**
     * タイルキャッシュの全タイル数（本物の Weiwudi のインスタンスが持つ totalTile に当たる）。
     * 模擬はキャッシュを持たないので、getMapTileCacheStatsAsync はここを total として返す。
     * 数が無ければ本物で total が分からないときと同じく total を載せない。
     */
    tileCacheTotal?: number;
    /** false なら読込で落ちた source（sourceLoaded で usable: false・listMaps に載らない） */
    usable?: boolean;
    /** 地図のホーム（経緯度）と zoom */
    homePosition?: [number, number];
    defaultZoom?: number;
    /** getMapMeta に載せる項目 */
    meta?: Partial<MapMeta>;
}
export interface MockLayerAOptions {
    /** implementation の値（既定 "core"） */
    implementation?: string;
    /** version の値（既定 "0.0.0-mock"） */
    version?: string;
    /** supports() の答えの上書き（既定は implementation の機能表の列） */
    features?: Partial<Record<string, boolean>>;
}
export declare const MOCK_DEFAULT_PIN: string;
export declare const MOCK_DEFAULT_PIN_SELECTED: string;
/** 線・面の種類と、clear の絞り込み（Core の VectorType・VectorFilter と同じ）。 */
type MockVectorType = "Line" | "Polygon";
interface MockVectorFilter {
    type?: MockVectorType;
}
/** 模擬の中身（旧クラス MaplatApp と同じ形の 46 メソッドとイベントを持つ）。 */
export declare class MockLayerAApp extends EventTarget implements LayerAImplementation {
    #private;
    waitReady: Promise<void>;
    appid: string | undefined;
    appData: Record<string, any> | null;
    initialRestore: Restore;
    stateBuffer: Restore;
    restoreSession: boolean;
    sources: MockSource[];
    displayMode: DisplayMode;
    /** 要素の setEnvelopes で最後に指定された枠線（試験から読む） */
    envelopes: EnvelopeSpec[];
    /** 視点の連続変化の始まり・止まり（要素が moveStart / moveEnd に変える） */
    onMove: ((kind: "start" | "end") => void) | null;
    constructor(config: ElementStartupConfig);
    pixelToLngLat(px: number, py: number): LngLat | null;
    handleGPS(enable: boolean, avoidEventForOff?: boolean): void;
    getGPSEnabled(): boolean;
    getRotation(): number;
    getDirection(): Promise<number>;
    currentMapInfo(): MapMeta | undefined;
    mapInfo(mapID: string): MapMeta | undefined;
    clientPointToLngLat(clientX: number, clientY: number): Promise<LngLat | undefined>;
    lngLatToClientPoint(longitude: number, latitude: number): Promise<{
        x: number;
        y: number;
    } | undefined>;
    selectMarker(id: string): void;
    unselectMarker(): void;
    getMarker(id: string): MaplatPoi | undefined;
    updateMarker(id: string, data: Record<string, unknown>, overwrite?: boolean): string | undefined;
    addMarker(data: Record<string, unknown>, layerId?: string): string | undefined;
    removeMarker(id: string): void;
    clearMarker(layerId?: string): void;
    showAllMarkers(): void;
    hideAllMarkers(): void;
    listPoiLayers(hideOnly?: boolean, nonzero?: boolean): PoiLayer[];
    showPoiLayer(id: string): void;
    hidePoiLayer(id: string): void;
    getPoiLayer(id: string): PoiLayer | undefined;
    addPoiLayer(id: string, data?: unknown): void;
    removePoiLayer(id: string): void;
    addLine(data: any): string;
    addVector(data: any): string;
    removeVector(id: string): boolean;
    removeLine(id: string): boolean;
    clearLine(filter?: MockVectorFilter): void;
    clearVector(filter?: MockVectorFilter): void;
    get vectors(): any[];
    setGPSMarker(_position: unknown): void;
    changeMap(mapID: string, restore?: Restore): Promise<void>;
    requestUpdateState(data: Partial<Restore>): void;
    setTransparency(percentage: number): void;
    getTransparency(): number;
    setViewpoint(cond: {
        longitude?: number;
        latitude?: number;
        zoom?: number;
        mercZoom?: number;
        rotation?: number;
        direction?: number;
    }): void;
    goHome(): void;
    resetRotation(): void;
    resetDirection(): void;
    resetCirculation(): void;
    getMapMeta(mapID?: string): MapMeta | undefined;
    getMapCacheEnable(mapID?: string): boolean;
    getMapTileCacheStatsAsync(mapID?: string): Promise<TileCacheStats>;
    getMapTileCacheSizeAsync(mapID?: string): Promise<number>;
    clearMapTileCacheAsync(_mapID?: string): Promise<void>;
    fetchAllMapTileCacheAsync(mapID: string | undefined, callback: (type: TileCacheProgressType, detail: TileCacheProgress) => void): Promise<void>;
    cancelMapTileCacheAsync(_mapID?: string): Promise<void>;
    /**
     * 要素の上のクリック（タップ）。マーカー（既定のピンの大きさ・下端の中央が POI の位置）に当たれば
     * clickMarker と、その直後に同期で clickMarkers（重なる全部。1 件でも出す）を出す。当たらなければ clickMap*。
     */
    tapAt(clientX: number, clientY: number): void;
    zoomBy(delta: number): void;
    viewExtent(): LngLat[] | null;
    remove(): void;
    /** 選択中のマーカー（selectMarker の引数）。 */
    get selectedMarker(): string | undefined;
    /** 中身からイベントを出す（例: outOfMap・clickMarkers・gps_result・gps_error）。 */
    fire(type: string, detail?: unknown): void;
    /** GPS の状態を中身の都合で変える（handleGPS(false, true) 相当の内部の切替）。 */
    setGpsEnabledInternally(enabled: boolean): void;
}
/** 模擬の要素の中身を試験から操る口（要素の公開面には足さない）。作る前・破棄の後は null。 */
export declare function getMockLayerAController(el: HTMLElement): MockLayerAApp | null;
/**
 * 模擬の <maplat-app> のクラスを作る。features で supports() の答えを切り替えられる
 * （display-mode を真にすると setDisplayMode / getDisplayMode / modechange・display-mode 属性が付く）。
 */
export declare function createMockMaplatAppClass(options?: MockLayerAOptions): CustomElementConstructor;
/** 模擬の <maplat-app> を登録する（既に登録済みなら警告して上書きしない）。登録したクラスを返す。 */
export declare function defineMockMaplatApp(tagName?: string, options?: MockLayerAOptions): CustomElementConstructor;
export {};
