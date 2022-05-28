"use strict";

import Tin, {
  Options,
  Compiled,
  PointSet,
  Edge,
  StrictMode,
  VertexMode,
  YaxisMode
} from "@maplat/tin";
import { Position } from "@turf/turf";
type LangResource = string | Record<string, string>;
type TinLike = string | Tin | Compiled;

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
  homePosition: Position;
  mercZoom: number;
}

interface SubMap {
  gcps?: PointSet[];
  edges?: Edge[];
  compiled?: Compiled;
  priority: number;
  importance: number;
  bounds?: number[][];
}

const keys: (keyof HistMapStore)[] = [
  "title",
  "attr",
  "officialTitle",
  "dataAttr",
  "author",
  "createdAt",
  "era",
  "license",
  "dataLicense",
  "contributor",
  "mapper",
  "reference",
  "description",
  "url",
  "lang",
  "imageExtension",
  "homePosition",
  "mercZoom"
];

export async function store2HistMap(
  store: HistMapStore,
  byCompiled = false
): Promise<[HistMapStore, TinLike[]]> {
  return store2HistMap_internal(store, byCompiled, false);
}

export async function store2HistMap4Core(
  store: HistMapStore
): Promise<[HistMapStore, TinLike[]]> {
  return store2HistMap_internal(store, false, true);
}

async function store2HistMap_internal(
  store: HistMapStore,
  byCompiled: boolean,
  coreLogic: boolean
): Promise<[HistMapStore, TinLike[]]> {
  const ret: any = coreLogic ? store : {};
  const tins: TinLike[] = [];
  keys.forEach(key => {
    ret[key] = store[key];
  });
  if ((store as any)["imageExtention"])
    ret["imageExtension"] = (store as any)["imageExtention"];
  if (store.compiled) {
    const opt: Partial<Options> = {} as Options;
    if (!store.compiled.wh) opt.wh = [store.width!, store.height!];
    if (!store.compiled.strictMode) opt.strictMode = store.strictMode;
    if (!store.compiled.vertexMode) opt.vertexMode = store.vertexMode;
    if (!store.compiled.yaxisMode) opt.yaxisMode = store.yaxisMode;
    let tin: TinLike = new Tin(opt);
    tin.setCompiled(store.compiled);
    if (byCompiled) {
      tin = tin.getCompiled();
    }
    ret.strictMode = tin.strictMode;
    ret.vertexMode = tin.vertexMode;
    ret.yaxisMode = tin.yaxisMode;
    ret.width = tin.wh![0];
    ret.height = tin.wh![1];
    ret.gcps = tin.points;
    ret.edges = tin.edges;
    tins.push(tin);
  } else {
    ret.strictMode = store.strictMode;
    ret.vertexMode = store.vertexMode;
    ret.yaxisMode = store.yaxisMode;
    ret.width = store.width;
    ret.height = store.height;
    ret.gcps = store.gcps;
    ret.edges = store.edges;
    let tin = await createTinFromGcpsAsync(
      store.strictMode!,
      store.vertexMode!,
      store.yaxisMode,
      store.gcps,
      store.edges,
      [store.width!, store.height!]
    );
    if (byCompiled && typeof tin !== "string") tin = (tin as Tin).getCompiled();
    tins.push(tin);
  }

  if (store.sub_maps) {
    const sub_maps = [] as SubMap[];
    for (let i = 0; i < store.sub_maps.length; i++) {
      const sub_map = store.sub_maps[i];
      const sub: any = {};
      sub.importance = sub_map.importance;
      sub.priority = sub_map.priority;
      if (sub_map.compiled) {
        const opt: Partial<Options> = {} as Options;
        if (!sub_map.compiled.strictMode) opt.strictMode = store.strictMode;
        if (!sub_map.compiled.vertexMode) opt.vertexMode = store.vertexMode;
        if (!sub_map.compiled.yaxisMode) opt.yaxisMode = store.yaxisMode;
        let tin: TinLike = new Tin(opt);
        tin.setCompiled(sub_map.compiled);
        if (byCompiled) {
          tin = tin.getCompiled();
        }
        sub.bounds = tin.bounds;
        sub.gcps = tin.points;
        sub.edges = tin.edges;
        tins.push(tin);
      } else {
        sub.bounds = sub_map.bounds;
        sub.gcps = sub_map.gcps;
        sub.edges = sub_map.edges;
        let tin = await createTinFromGcpsAsync(
          store.strictMode!,
          store.vertexMode!,
          store.yaxisMode,
          sub_map.gcps,
          sub_map.edges,
          undefined,
          sub_map.bounds
        );
        if (byCompiled && typeof tin !== "string")
          tin = (tin as Tin).getCompiled();
        tins.push(tin);
      }
      sub_maps.push(sub as SubMap);
    }
    ret.sub_maps = sub_maps;
  }
  return [ret as HistMapStore, tins];
}

export async function histMap2Store(
  histmap: HistMapStore,
  tins: TinLike[]
): Promise<HistMapStore> {
  const ret: any = {};
  keys.forEach(key => {
    ret[key] = histmap[key];
  });
  if ((histmap as any)["imageExtention"])
    ret["imageExtension"] = (histmap as any)["imageExtention"];
  const tin = tins.shift();
  if (typeof tin === "string") {
    ret.width = histmap.width;
    ret.height = histmap.height;
    ret.gcps = histmap.gcps;
    ret.edges = histmap.edges;
    ret.strictMode = histmap.strictMode;
    ret.vertexMode = histmap.vertexMode;
    ret.yaxisMode = histmap.yaxisMode;
  } else {
    ret.compiled = (tin as any).getCompiled ? (tin as Tin).getCompiled() : tin;
  }

  ret.sub_maps =
    tins.length > 0
      ? tins.map((tin, index) => {
          const sub_map = histmap.sub_maps[index];
          const sub: any = {
            priority: sub_map.priority,
            importance: sub_map.importance
          };
          if (typeof tin === "string") {
            sub.gcps = sub_map.gcps;
            sub.edges = sub_map.edges;
            sub.bounds = sub_map.bounds;
          } else {
            sub.compiled = (tin as any).getCompiled
              ? (tin as Tin).getCompiled()
              : tin;
          }
          return sub as SubMap;
        })
      : [];

  return ret as HistMapStore;
}

async function createTinFromGcpsAsync(
  strict: StrictMode,
  vertex: VertexMode,
  yaxis?: YaxisMode,
  gcps: PointSet[] = [],
  edges: Edge[] = [],
  wh?: number[],
  bounds?: number[][]
): Promise<TinLike> {
  if (gcps.length < 3) return "tooLessGcps";
  //return new Promise((resolve, reject) => {
  const tin = new Tin({
    yaxisMode: yaxis
  });
  if (wh) {
    tin.setWh(wh);
  } else if (bounds) {
    tin.setBounds(bounds);
  } else {
    throw "Both wh and bounds are missing";
  }
  tin.setStrictMode(strict);
  tin.setVertexMode(vertex);
  tin.setPoints(gcps);
  tin.setEdges(edges);
  try {
    await tin.updateTinAsync();
    return tin;
  } catch (err: any) {
    console.log(err); // eslint-disable-line no-console,no-undef
    if (err == "SOME POINTS OUTSIDE") {
      return "pointsOutside";
    } else if (err.indexOf("TOO LINEAR") == 0) {
      return "tooLinear";
    } else if (
      err.indexOf("Vertex indices of edge") > -1 ||
      err.indexOf("is degenerate!") > -1 ||
      err.indexOf("already exists or intersects with an existing edge!") > -1
    ) {
      return "edgeError";
    } else {
      throw err;
    }
  }
}
