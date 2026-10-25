import { DisplayMode, EnvelopeSpec, LngLat, MapListItem, MaplatAppDelegatedMethods, MaplatAppElementSettings, Restore, Viewpoint } from './element_contract';
/**
 * 層 A の中身（旧クラス MaplatApp と同じ形）に求める最小の面。46 の委譲メソッドは同名で持つ。
 * Core の MaplatApp・有償版の MaplatApp・模擬の層 A（src/conformance/mock-layer-a.ts）が満たす。
 */
export interface LayerAImplementation {
    waitReady: Promise<unknown> | unknown;
    addEventListener(type: string, listener: (evt: any) => void): void;
    removeEventListener(type: string, listener: (evt: any) => void): void;
    getGPSEnabled(): boolean;
    [member: string]: any;
}
/** createImplementation() に渡す起動時の材料（優先順位を解いた後の値）。 */
export interface ElementStartupConfig {
    /** 与えられたキーの値（属性・プロパティのみの両方。undefined のキーは載せない） */
    values: Record<string, unknown>;
    /** 移行用の appOption（旧名へ寄せた複製。個別のキーより弱い） */
    appOption: Record<string, any>;
    /**
     * 設定ファイルの中身。setting プロパティ（中身そのもの）＞ app-src（読込の Promise）の順。
     * どちらも無ければ undefined（実装が appId から apps/${appId}.json を読む）。
     */
    setting: unknown;
    /** 地図の入れ物（要素そのもの） */
    element: HTMLElement;
}
/** (ii) のキーを反映するときに、プロパティ／属性 ＞ appOption ＞ fallback の順で値を引く。 */
export type RuntimeValueResolver = (prop: string, optionKey: string | undefined, fallback: unknown) => unknown;
/** 既定の箱の CSS を文書へ一度だけ入れる。 */
export declare function injectMaplatAppStyle(doc: Document): void;
declare const BaseElement: typeof HTMLElement;
/**
 * <maplat-app> の基底クラス。派生クラスは次を与える:
 *   - `implementation` / `version`（読み取り専用の値）
 *   - `createImplementation(config)`: 中身（LayerAImplementation）を作る
 *   - `listMaps` / `setEnvelopes` / `getMapEnvelope` / `getViewExtent` / `zoomBy`
 *   - `features()`: supports() の表
 *   - 必要なら各 hook（applyRuntimeChanges・convertEventDetail・disposeImplementation・
 *     canDisposeDuringStartup 等）と道具（markPending・readKey・dispatchLayerAEvent 等）
 */
export declare abstract class MaplatAppElementBase extends BaseElement {
    #private;
    static get observedAttributes(): readonly string[];
    static readonly events: readonly ["lifecycle:setting-loaded", "lifecycle:appdata-ready", "lifecycle:ui-configure", "lifecycle:core-dom-ready", "lifecycle:ui-dom-ready", "lifecycle:core-ready", "lifecycle:ui-ready", "lifecycle:error", "sourceLoaded", "mapChanged", "changeViewpoint", "updateState", "outOfMap", "poi_number", "clickMarker", "clickMarkers", "clickMap", "clickMapXy", "clickMapMerc", "pointerMoveOnMapXy", "pointerMoveOnMapMerc", "gps_request", "gps_result", "gps_error"];
    static readonly ownEvents: readonly ["gpsEnabledChanged", "moveStart", "moveEnd"];
    static readonly methods: readonly ["handleGPS", "getGPSEnabled", "getRotation", "getDirection", "currentMapInfo", "mapInfo", "clientPointToLngLat", "lngLatToClientPoint", "selectMarker", "unselectMarker", "getMarker", "updateMarker", "addMarker", "removeMarker", "clearMarker", "showAllMarkers", "hideAllMarkers", "listPoiLayers", "showPoiLayer", "hidePoiLayer", "getPoiLayer", "addPoiLayer", "removePoiLayer", "addLine", "addVector", "removeVector", "removeLine", "clearLine", "clearVector", "setGPSMarker", "changeMap", "requestUpdateState", "setTransparency", "getTransparency", "setViewpoint", "goHome", "resetRotation", "resetDirection", "resetCirculation", "getMapMeta", "getMapCacheEnable", "getMapTileCacheStatsAsync", "getMapTileCacheSizeAsync", "clearMapTileCacheAsync", "fetchAllMapTileCacheAsync", "cancelMapTileCacheAsync"];
    /** 実装の種別。 */
    abstract readonly implementation: string;
    /** 実装の版（semver）。 */
    abstract readonly version: string;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /**
     * 地図の準備完了で解決する。要素を置き直したときだけ新しい Promise になる: DOM から外して破棄が
     * 決まった時点（外した拍の後のマイクロタスク）で、前の Promise が決着していれば新しい Promise に替わる
     * （同じ拍の付け替えでは破棄しないので替わらない）。
     */
    get ready(): Promise<void>;
    /** 設定ファイルの中身（凍結した浅い複製）。lifecycle:appdata-ready の発火時から読める。 */
    get appData(): Readonly<Record<string, any>> | null;
    /** 起動時に使った復元値（restore・map-id・transparency・restoreSession の localStorage）。 */
    get initialRestore(): Readonly<Restore>;
    /** 現在の状態（旧 stateBuffer の複製）。変化は updateState イベントで知る。 */
    get state(): Readonly<Restore>;
    /** 表示中の地図の mapID。 */
    get currentMapId(): string | null;
    /** 現在の視点（最後の changeViewpoint の detail）。 */
    get viewpoint(): Viewpoint | null;
    /** GPS の追跡が有効か（getGPSEnabled() と同じ）。 */
    get gpsEnabled(): boolean;
    /** 現在の視点。地図の準備前は null。 */
    getViewpoint(): Viewpoint | null;
    /** 機能の問い合わせ。未知の名前は false。地図の準備前でも答える。 */
    supports(feature: string): boolean;
    abstract listMaps(): MapListItem[];
    abstract setEnvelopes(items: EnvelopeSpec[]): void;
    abstract getMapEnvelope(mapID: string): LngLat[] | null;
    abstract getViewExtent(): LngLat[] | null;
    abstract zoomBy(delta: number): void;
    /** 既定のピンの画像（実装確認 6。地図の準備前でも答える）。selected なら選択中の画像。 */
    abstract getDefaultPinIcon(selected?: boolean): string;
    /** supports() の表。 */
    protected abstract features(): Readonly<Record<string, boolean>>;
    /** 中身を作る。投げたら ready が reject される。 */
    protected abstract createImplementation(config: ElementStartupConfig): LayerAImplementation;
    /** 中身を破棄する（既定では初期化の完了後に呼ぶ。canDisposeDuringStartup も見よ）。既定は impl.remove()。 */
    protected disposeImplementation(impl: LayerAImplementation): void;
    /**
     * 中身が初期化の途中でも破棄できるか（破棄の口が途中の初期化を中断して同期で後始末を済ませる実装なら true）。
     * 既定の false では、初期化の途中で外された中身は waitReady の完了を待ってから破棄し、次の中身はその後に作る
     * （途中で消すと残りの初期化が消えた箱へ書き込む実装のため）。true なら外した時点で破棄し、待たない。
     */
    protected canDisposeDuringStartup(): boolean;
    /** 中身を作った直後（イベントの購読の後・ready の前）。 */
    protected onImplementationCreated(_impl: LayerAImplementation): void;
    /** 中身の準備が済んだとき（ready の解決の直前）。 */
    protected onImplementationReady(_impl: LayerAImplementation): void;
    /** 中身を外すとき（購読の解除と同時。破棄の前）。 */
    protected onImplementationDetached(_impl: LayerAImplementation): void;
    /** 中身のイベントを出し直した直後（派生クラスの控え・描き直しに使う）。 */
    protected onImplementationEvent(_type: string, _detail: unknown, _impl: LayerAImplementation): void;
    /** 要素の大きさが変わったとき（ready 後）。 */
    protected onResize(_impl: LayerAImplementation): void;
    /** DOM だけで当てるキー（AttrDef.dom）が変わったとき・中身を作った直後。 */
    protected applyDomKeys(): void;
    /**
     * 起動後の (ii) のキーの変更を中身へ反映する。map-id・transparency は基底が先に当てる。
     * resolve はプロパティ／属性 ＞ appOption ＞ fallback の順で値を引く。
     */
    protected applyRuntimeChanges(_impl: LayerAImplementation, _pending: ReadonlySet<string>, _resolve: RuntimeValueResolver): void;
    /** 中身の detail → 要素のイベントの detail。派生クラスは super を呼んでから足す。 */
    protected convertEventDetail(type: string, detail: any, _impl: LayerAImplementation): unknown;
    /** 委譲メソッドの戻り値の調整（undefined → null）。 */
    protected convertMethodResult(name: string, result: unknown): unknown;
    /** 中身が出し直す対象のイベント名。既定は MAPLAT_APP_EVENTS。 */
    protected forwardedEvents(): readonly string[];
    /** 今の中身（作る前・破棄の後は null）。層 A の公開面ではない。 */
    protected currentImplementation(): LayerAImplementation | null;
    /** 中身の準備が済んでいるか。 */
    protected isImplementationReady(): boolean;
    /** 中身が無ければ「まだ作っていない」の例外を投げる。 */
    protected requireImplementation(name: string): LayerAImplementation;
    /** キーの現在値（起動時キーは起動後なら起動時の値）。 */
    protected readKey(prop: string): unknown;
    /**
     * 実装が実際に使っているキーの値（任意）。`{ value }` を返すと #readKey はその値を返す。
     * 既定は undefined（実装から値を受け取らない＝今までどおり属性・起動時の値を返す）。
     * 設定ファイル等から実装が読んだ値と要素の見せかけの値が食い違う実装だけが上書きする（Core の互換モード）。
     */
    protected implementationKeyValue(_prop: string, _impl: LayerAImplementation): {
        value: unknown;
    } | undefined;
    /**
     * キーを「反映待ち」に積む（ready 後に applyRuntimeChanges へ渡る）。作成時の材料で渡せないキーを
     * 準備の完了後に当てたいとき、onImplementationReady から呼ぶ（そこで積んだ分は ready の解決の直後に反映する）。
     */
    protected markPending(prop: string): void;
    /** 要素から DOM の CustomEvent を出す（bubbles・composed なし・cancelable なし）。 */
    protected dispatchLayerAEvent(type: string, detail: unknown): void;
    /**
     * 内部の操作（UI・メソッド・状態 URL の復元・中身自身の切り替え）で変わった状態を属性へ書き戻す
     * （対象は AttrDef.state を持つキー: map-id・transparency・Pro の display-mode）。
     * 書き戻しは属性の変更として扱わない（attributeChangedCallback が何もしない＝二重に処理しない）。
     * state が "frame" のキーは描画 1 回につき 1 回にまとめ、書く時点で read() から値を読む（最後の値が残る）。
     * 利用者の変更が反映待ちのキー・値が無い（undefined）・既に同じ値のときは書かない。
     */
    protected reflectState(prop: string, read: () => unknown): void;
    /** 同じ鍵では 1 回だけ警告する（名前は公開の基底クラスのメソッドなので残す）。 */
    protected warnOnce(key: string, message: string): void;
}
/** Pro 固有のキー。対応しない実装では常に undefined（代入は警告して無視）。 */
export interface MaplatAppElementProSettings {
    displayMode: DisplayMode | undefined;
}
export interface MaplatAppElementBase extends MaplatAppDelegatedMethods, MaplatAppElementSettings, MaplatAppElementProSettings {
}
/**
 * 要素を登録する（二重登録は何もしない。別の実装が登録済みなら警告して上書きしない）。
 * @returns 登録したら true
 */
export declare function defineMaplatAppElementOnce(ctor: CustomElementConstructor, tagName?: string, label?: string): boolean;
export {};
