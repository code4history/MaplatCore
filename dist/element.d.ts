import { MaplatApp } from './index';
import { MaplatAppElementBase, ElementStartupConfig, LayerAImplementation, RuntimeValueResolver } from './element_base';
import { EnvelopeSpec, LngLat, MapListItem, MaplatAppElement as MaplatAppElementContract, Viewpoint } from './element_contract';
export { MAPLAT_APP_EVENTS, ELEMENT_OWN_EVENTS, MAPLAT_APP_METHODS, ELEMENT_OWN_METHODS, MAPLAT_APP_TAG, ELEMENT_ATTRIBUTES, ELEMENT_PROPERTIES, ELEMENT_STARTUP_KEYS, LAYER_A_PRO_ATTRIBUTES } from './element_contract';
export type { MaplatAppEventName, MaplatAppMethodName } from './element_contract';
type CoreApp = MaplatApp;
export type MaplatViewpoint = Viewpoint;
export type MaplatMapListItem = MapListItem;
export declare class MaplatAppElement extends MaplatAppElementBase implements MaplatAppElementContract {
    #private;
    readonly implementation: "core";
    readonly version: string;
    get app(): CoreApp | null;
    listMaps(): MapListItem[];
    getMapEnvelope(mapID: string): LngLat[] | null;
    getViewExtent(): LngLat[] | null;
    setEnvelopes(items: EnvelopeSpec[]): void;
    getDefaultPinIcon(selected?: boolean): string;
    zoomBy(delta: number): void;
    protected createCore(option: Record<string, any>): CoreApp;
    protected features(): Readonly<Record<string, boolean>>;
    protected implementationKeyValue(prop: string, impl: LayerAImplementation): {
        value: unknown;
    } | undefined;
    protected createImplementation(config: ElementStartupConfig): LayerAImplementation;
    protected onImplementationCreated(_impl: LayerAImplementation): void;
    protected onImplementationReady(impl: LayerAImplementation): void;
    protected onImplementationDetached(_impl: LayerAImplementation): void;
    protected onImplementationEvent(type: string, _detail: unknown, impl: LayerAImplementation): void;
    protected onResize(impl: LayerAImplementation): void;
    protected convertEventDetail(type: string, detail: any, impl: LayerAImplementation): unknown;
    protected applyRuntimeChanges(impl: LayerAImplementation, pending: ReadonlySet<string>, resolve: RuntimeValueResolver): void;
    protected applyDomKeys(): void;
}
export declare function defineMaplatAppElement(tagName?: string): void;
declare global {
    interface HTMLElementTagNameMap {
        "maplat-app": MaplatAppElement;
    }
}
