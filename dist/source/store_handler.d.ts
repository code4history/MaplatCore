import { Transform, MapTransform, Compiled, PointSet, EdgeSet, StrictMode, VertexMode, YaxisMode, CompiledTransformData, CrsObject, WorldFile } from '@maplat/transform';
import { Position } from 'geojson';
type LangResource = string | Record<string, string>;
type TinLike = string | Transform | Compiled;
interface HistMapStore {
    title: LangResource;
    attr: LangResource;
    officialTitle: LangResource;
    dataAttr: LangResource;
    strictMode?: StrictMode;
    vertexMode?: VertexMode;
    yaxisMode?: YaxisMode;
    author: LangResource;
    createdAt: LangResource;
    era: LangResource;
    license: string;
    dataLicense: string;
    licenseNote: LangResource;
    dataLicenseNote: LangResource;
    contributor: LangResource;
    mapper: LangResource;
    reference: string;
    description: LangResource;
    url: string;
    lang: string;
    imageExtension: string;
    width?: number;
    height?: number;
    gcps?: PointSet[];
    edges?: EdgeSet[];
    compiled?: Compiled;
    sub_maps: SubMap[];
    homePosition: Position;
    mercZoom: number;
    viewpointMode?: string;
}
interface SubMap {
    gcps?: PointSet[];
    edges?: EdgeSet[];
    compiled?: Compiled;
    priority: number;
    importance: number;
    bounds?: number[][];
}
export declare function store2HistMap(store: HistMapStore, byCompiled?: boolean): Promise<[HistMapStore, TinLike[]]>;
interface StoredSurface {
    compiled?: CompiledTransformData;
    tinEnabled?: boolean;
    crs?: CrsObject;
    worldFile?: WorldFile;
}
type CoreSubMap = Omit<SubMap, "compiled"> & StoredSurface;
type CoreMapStore = Omit<HistMapStore, "compiled" | "sub_maps"> & StoredSurface & {
    mapID?: string;
    imageExtention?: string;
    sub_maps?: CoreSubMap[];
};
export declare function getHistMapDimensions(store: CoreMapStore): [number, number];
export declare function store2HistMap4Core(store: CoreMapStore): Promise<[CoreMapStore, MapTransform]>;
export declare function histMap2Store(histmap: HistMapStore, tins: TinLike[]): Promise<HistMapStore>;
export {};
