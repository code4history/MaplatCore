import { DisplayMode, EnvelopeSpec, LngLat, MapListItem, MaplatAppDelegatedMethods, MaplatAppElementSettings, Restore, Viewpoint } from './element_contract';
export interface LayerAImplementation {
    waitReady: Promise<unknown> | unknown;
    addEventListener(type: string, listener: (evt: any) => void): void;
    removeEventListener(type: string, listener: (evt: any) => void): void;
    getGPSEnabled(): boolean;
    [member: string]: any;
}
export interface ElementStartupConfig {
    values: Record<string, unknown>;
    appOption: Record<string, any>;
    setting: unknown;
    element: HTMLElement;
}
export type RuntimeValueResolver = (prop: string, optionKey: string | undefined, fallback: unknown) => unknown;
export declare function injectMaplatAppStyle(doc: Document): void;
declare const BaseElement: typeof HTMLElement;
export declare abstract class MaplatAppElementBase extends BaseElement {
    #private;
    static get observedAttributes(): readonly string[];
    static readonly events: readonly ["lifecycle:setting-loaded", "lifecycle:appdata-ready", "lifecycle:ui-configure", "lifecycle:core-dom-ready", "lifecycle:ui-dom-ready", "lifecycle:core-ready", "lifecycle:ui-ready", "lifecycle:error", "sourceLoaded", "mapChanged", "changeViewpoint", "updateState", "outOfMap", "poi_number", "clickMarker", "clickMarkers", "clickMap", "clickMapXy", "clickMapMerc", "pointerMoveOnMapXy", "pointerMoveOnMapMerc", "gps_request", "gps_result", "gps_error"];
    static readonly ownEvents: readonly ["gpsEnabledChanged", "moveStart", "moveEnd"];
    static readonly methods: readonly ["handleGPS", "getGPSEnabled", "getRotation", "getDirection", "currentMapInfo", "mapInfo", "clientPointToLngLat", "lngLatToClientPoint", "selectMarker", "unselectMarker", "getMarker", "updateMarker", "addMarker", "removeMarker", "clearMarker", "showAllMarkers", "hideAllMarkers", "listPoiLayers", "showPoiLayer", "hidePoiLayer", "getPoiLayer", "addPoiLayer", "removePoiLayer", "addLine", "addVector", "removeVector", "removeLine", "clearLine", "clearVector", "setGPSMarker", "changeMap", "requestUpdateState", "setTransparency", "getTransparency", "setViewpoint", "goHome", "resetRotation", "resetDirection", "resetCirculation", "getMapMeta", "getMapCacheEnable", "getMapTileCacheStatsAsync", "getMapTileCacheSizeAsync", "clearMapTileCacheAsync", "fetchAllMapTileCacheAsync", "cancelMapTileCacheAsync"];
    abstract readonly implementation: string;
    abstract readonly version: string;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    get ready(): Promise<void>;
    get appData(): Readonly<Record<string, any>> | null;
    get initialRestore(): Readonly<Restore>;
    get state(): Readonly<Restore>;
    get currentMapId(): string | null;
    get viewpoint(): Viewpoint | null;
    get gpsEnabled(): boolean;
    getViewpoint(): Viewpoint | null;
    supports(feature: string): boolean;
    abstract listMaps(): MapListItem[];
    abstract setEnvelopes(items: EnvelopeSpec[]): void;
    abstract getMapEnvelope(mapID: string): LngLat[] | null;
    abstract getViewExtent(): LngLat[] | null;
    abstract zoomBy(delta: number): void;
    abstract getDefaultPinIcon(selected?: boolean): string;
    protected abstract features(): Readonly<Record<string, boolean>>;
    protected abstract createImplementation(config: ElementStartupConfig): LayerAImplementation;
    protected disposeImplementation(impl: LayerAImplementation): void;
    protected canDisposeDuringStartup(): boolean;
    protected onImplementationCreated(_impl: LayerAImplementation): void;
    protected onImplementationReady(_impl: LayerAImplementation): void;
    protected onImplementationDetached(_impl: LayerAImplementation): void;
    protected onImplementationEvent(_type: string, _detail: unknown, _impl: LayerAImplementation): void;
    protected onResize(_impl: LayerAImplementation): void;
    protected applyDomKeys(): void;
    protected applyRuntimeChanges(_impl: LayerAImplementation, _pending: ReadonlySet<string>, _resolve: RuntimeValueResolver): void;
    protected convertEventDetail(type: string, detail: any, _impl: LayerAImplementation): unknown;
    protected convertMethodResult(name: string, result: unknown): unknown;
    protected forwardedEvents(): readonly string[];
    protected currentImplementation(): LayerAImplementation | null;
    protected isImplementationReady(): boolean;
    protected requireImplementation(name: string): LayerAImplementation;
    protected readKey(prop: string): unknown;
    protected markPending(prop: string): void;
    protected dispatchLayerAEvent(type: string, detail: unknown): void;
    protected reflectState(prop: string, read: () => unknown): void;
    protected warnOnce(key: string, message: string): void;
}
export interface MaplatAppElementProSettings {
    displayMode: DisplayMode | undefined;
}
export interface MaplatAppElementBase extends MaplatAppDelegatedMethods, MaplatAppElementSettings, MaplatAppElementProSettings {
}
export declare function defineMaplatAppElementOnce(ctor: CustomElementConstructor, tagName?: string, label?: string): boolean;
export {};
