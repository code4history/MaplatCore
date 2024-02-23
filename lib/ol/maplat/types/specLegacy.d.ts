import { Coordinate2D, DataLicense, EdgeIndex, LegacyMapType, LocaleFragment, MapLicense, MaplatLegacyWeightBufferList, ValuesOfVertices } from "./basics";
export interface MaplatCompiledLegacy extends Object {
    version?: string;
    wh?: Coordinate2D;
    points: [Coordinate2D, Coordinate2D, string | undefined][];
    weight_buffer: {
        [key: string]: MaplatLegacyWeightBufferList;
    };
    centroid_point: [Coordinate2D, Coordinate2D];
    vertices_params: [ValuesOfVertices, ValuesOfVertices];
    vertices_points: [Coordinate2D, Coordinate2D][];
    strict_status: "strict" | "strict_error" | "loose";
    tins_points: [EdgeIndex, EdgeIndex, EdgeIndex][][];
    yaxisMode: "follow" | "invert";
    vertexMode: "plain" | "birdeye";
    strictMode: "strict" | "auto" | "loose";
    edges: [Coordinate2D[], Coordinate2D[], [EdgeIndex, EdgeIndex]][];
    edgesNodes: [Coordinate2D, Coordinate2D][];
}
export interface GeoJSONPolygonGeometry extends Object {
    type: "Polygon";
    coordinates: Coordinate2D[][];
}
export interface GeoJSONPolygonFeature extends Object {
    type: "Feature";
    properties: {
        [key: string]: any;
    };
    geometry: GeoJSONPolygonGeometry;
}
export interface MaplatSubMapCompiledLegacy extends MaplatCompiledLegacy {
    xy: Coordinate2D;
    bounds: Coordinate2D[];
    boundsPolygon: GeoJSONPolygonFeature;
}
export interface MaplatSubMapLegacy extends Object {
    priority: number;
    importance: number;
    compiled: MaplatSubMapCompiledLegacy;
}
export interface MaplatSpecLegacy extends Object {
    title: LocaleFragment;
    officialTitle?: LocaleFragment;
    attr: LocaleFragment;
    dataAttr?: LocaleFragment;
    author: LocaleFragment;
    contributor?: LocaleFragment;
    mapper?: LocaleFragment;
    description?: LocaleFragment;
    license: MapLicense;
    dataLicense: DataLicense;
    createdAt: LocaleFragment;
    era?: LocaleFragment;
    reference: string;
    lang: string;
    mapID?: string;
    url?: string;
    extension: string;
    sub_maps: MaplatSubMapLegacy[];
    maptype?: LegacyMapType;
    mercatorXShift?: number;
    mercatorYShift?: number;
    envelopLngLats?: Coordinate2D[];
    compiled: MaplatCompiledLegacy;
    width?: number;
    height?: number;
    maxZoom?: number;
    boundsPolygon?: GeoJSONPolygonFeature;
}
