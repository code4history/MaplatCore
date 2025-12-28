import { Feature, FeatureCollection, Point } from 'geojson';
export interface JSONPoi {
    id?: string | number;
    lnglat?: [number, number];
    lng?: number;
    lat?: number;
    longitude?: number;
    latitude?: number;
    name?: string;
    description?: string;
    [key: string]: any;
}
export type JSONLayer = JSONPoi[] | FeatureCollection<Point>;
export interface POILayer extends FeatureCollection<Point> {
    type: "FeatureCollection";
    features: Feature<Point>[];
    id: string;
    __nextId?: number;
    properties?: {
        name?: string;
        namespaceID?: string;
        hide?: boolean;
        html?: string;
        htmlStyle?: string;
        icon?: string;
        selectedIcon?: string;
        [key: string]: any;
    };
}
export interface NormalizeOptions {
    name?: string;
    namespace?: string;
}
export type LayersCollection = Record<string, POILayer>;
export declare function nodesLoader(nodes: string | Record<string, unknown>): Promise<Record<string, unknown>>;
export declare function normalizeLayers(layers: any, options: NormalizeOptions): Promise<LayersCollection>;
export declare function normalizeLayer(layer: JSONLayer, key: string, options: NormalizeOptions): POILayer;
export declare function normalizePoi(poi: JSONPoi | Feature<Point>): Feature<Point>;
export declare function addIdToFeature(layers: LayersCollection, key: string, options: NormalizeOptions): void;
