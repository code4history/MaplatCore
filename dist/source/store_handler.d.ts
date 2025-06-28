import { Transform, Compiled, PointSet, EdgeSet, StrictMode, VertexMode, YaxisMode } from '@maplat/transform';
import { Position } from '@turf/helpers';
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
    edges?: EdgeSet[];
    compiled?: Compiled;
    sub_maps: SubMap[];
    homePosition: Position;
    mercZoom: number;
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
export declare function store2HistMap4Core(store: HistMapStore): Promise<[HistMapStore, TinLike[]]>;
export declare function histMap2Store(histmap: HistMapStore, tins: TinLike[]): Promise<HistMapStore>;
export {};
