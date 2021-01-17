import { default as Tin, Compiled, Options, PointSet, Edge, StrictMode, VertexMode, YaxisMode, StrictStatus } from "@maplat/tin";

type LangResource = string | Record<string, string>;

interface HistMapStorage {
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