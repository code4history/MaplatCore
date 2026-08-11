import { FeatureCollection } from 'geojson';
export declare function nodesLoader(nodes: string | Record<string, unknown>): Promise<Record<string, unknown>>;
export declare function isPoiLayerRef(x: any): boolean;
export declare function normalizeLayers(layers: any, options: any): Promise<any>;
export declare function normalizeLayer(layer: any, key: any, options: any): any;
export declare function normalizePoi(poi: any): any;
export declare function addIdToPoi(layers: any, key: any, options: any): void;
export type PoiLayerRef = {
    layer: string | FeatureCollection;
    hide?: boolean;
    title?: string | Record<string, string>;
    icon?: string;
    selectedIcon?: string;
};
