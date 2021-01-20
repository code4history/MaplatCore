import ObjectTin, { Compiled, PointSet, Edge, StrictMode, VertexMode, YaxisMode } from "@maplat/tin";
declare type LangResource = string | Record<string, string>;
declare type Tin = string | ObjectTin | Compiled;
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
    contributor: LangResource;
    mapper: LangResource;
    reference: string;
    description: LangResource;
    url: LangResource;
    lang: string;
    imageExtension: string;
    width?: number;
    height?: number;
    gcps?: PointSet[];
    edges?: Edge[];
    compiled?: Compiled;
    sub_maps: SubMap[];
}
interface SubMap {
    gcps?: PointSet[];
    edges?: Edge[];
    compiled?: Compiled;
    priority: number;
    importance: number;
    bounds?: number[][];
}
export declare function store2HistMap(store: HistMapStore, byCompiled?: boolean): Promise<[HistMapStore, Tin[]]>;
export declare function histMap2Store(histmap: HistMapStore, tins: Tin[]): Promise<HistMapStore>;
export {};
