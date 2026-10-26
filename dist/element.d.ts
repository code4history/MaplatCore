import { MaplatApp } from './index';
import { MaplatAppElementBase, ElementStartupConfig, LayerAImplementation, RuntimeValueResolver } from './element_base';
import { EnvelopeSpec, LngLat, MapListItem, MaplatAppElement as MaplatAppElementContract, Viewpoint } from './element_contract';
export { MAPLAT_APP_EVENTS, ELEMENT_OWN_EVENTS, MAPLAT_APP_METHODS, ELEMENT_OWN_METHODS, MAPLAT_APP_TAG, ELEMENT_ATTRIBUTES, ELEMENT_PROPERTIES, ELEMENT_STARTUP_KEYS, LAYER_A_PRO_ATTRIBUTES } from './element_contract';
export type { MaplatAppEventName, MaplatAppMethodName } from './element_contract';
type CoreApp = MaplatApp;
/** @deprecated 共通の型 Viewpoint（@maplat/core/common）を使う。 */
export type MaplatViewpoint = Viewpoint;
/** @deprecated 共通の型 MapListItem（@maplat/core/common）を使う。 */
export type MaplatMapListItem = MapListItem;
export declare class MaplatAppElement extends MaplatAppElementBase implements MaplatAppElementContract {
    #private;
    /** 実装の種別。有償版は "core-pro"。 */
    readonly implementation: "core";
    /** 実装の版（@maplat/core の版）。 */
    readonly version: string;
    /**
     * 内部の MaplatApp。
     * @internal 移行期の逃げ道。層 A の公開面に含めない。メジャー版で消す。
     */
    get app(): CoreApp | null;
    /** 使える地図の一覧（設定ファイルの sources の順）。地図の準備前は []。 */
    listMaps(): MapListItem[];
    /** 地図の範囲（経緯度の多角形。最後の頂点は最初の頂点を繰り返さない）。範囲を持たない地図は null。 */
    getMapEnvelope(mapID: string): LngLat[] | null;
    /**
     * 画面の 4 隅の経緯度（左上・右上・右下・左下）。地図の準備前・変換できないときは null。
     * Core の座標変換は非同期なので、視点が変わるたび（changeViewpoint）に求めて控えた値を返す。
     */
    getViewExtent(): LngLat[] | null;
    /** 地図の範囲（枠線・塗り）を描く。空配列で消す。地図を切り替えると今の地図の座標で描き直す。 */
    setEnvelopes(items: EnvelopeSpec[]): void;
    /** 既定のピンの画像（POI にも祖先にも icon が無いマーカーに地図が描く画像。Core の parts/defaultpin*.png）。 */
    getDefaultPinIcon(selected?: boolean): string;
    /** 現在の地図の zoom を delta だけ変える。 */
    zoomBy(delta: number): void;
    /**
     * MaplatApp の生成（テスト用の差し替え口）。
     * @internal
     */
    protected createCore(option: Record<string, any>): CoreApp;
    protected features(): Readonly<Record<string, boolean>>;
    /**
     * 互換モードでは、要素の機能系キーの getter が Core の実際の値（設定ファイルから読んだ値を含む）を返す。
     * 通常モードは undefined（基底の既定）を返し、今までどおり属性・起動時の値を返す（挙動を変えない）。
     * 旧クラス互換層の <maplat-ui> は this.#app?.northUp を読むので、地図とコンパスを食い違わせない。
     * Core 固有の読み口はここに置く（element_base.ts は Core-Pro と共有する土台なので、口だけを置く）。
     * 対象は <maplat-app> の属性・プロパティの表にある機能系キー（northUp・homeMarginPixels・noRotate）だけ。
     * tapDuration・tapUIVanish は <maplat-ui> の属性で、互換層が appData から移すのでここには無い。
     */
    protected implementationKeyValue(prop: string, impl: LayerAImplementation): {
        value: unknown;
    } | undefined;
    /** MaplatApp に渡す appOption を組む（個別のキー ＞ appOption ＞ 設定ファイル ＞ 既定値）。 */
    protected createImplementation(config: ElementStartupConfig): LayerAImplementation;
    protected onImplementationCreated(_impl: LayerAImplementation): void;
    protected onImplementationReady(impl: LayerAImplementation): void;
    protected onImplementationDetached(_impl: LayerAImplementation): void;
    protected onImplementationEvent(type: string, _detail: unknown, impl: LayerAImplementation): void;
    protected onResize(impl: LayerAImplementation): void;
    protected convertEventDetail(type: string, detail: any, impl: LayerAImplementation): unknown;
    protected applyRuntimeChanges(impl: LayerAImplementation, pending: ReadonlySet<string>, resolve: RuntimeValueResolver): void;
    /** 中心の目印。既定で表示。no-center-marker で消し、center-marker-src で画像を差し替える。 */
    protected applyDomKeys(): void;
}
/** <maplat-app> を登録する（二重登録は何もしない。別実装が登録済みなら警告して上書きしない）。 */
export declare function defineMaplatAppElement(tagName?: string): void;
declare global {
    interface HTMLElementTagNameMap {
        "maplat-app": MaplatAppElement;
    }
}
