"use strict";

import {
  Transform,
  MapTransform,
  createProj4ProjectionEngine,
  type Compiled,
  type PointSet,
  type EdgeSet,
  type StrictMode,
  type VertexMode,
  type YaxisMode,
  type CompiledTransformData,
  type CrsObject,
  type LayeredMapData,
  type LayerSurfaceData,
  type ViewpointMode,
  type ProjectionEngine,
  type WorldFile
} from "@maplat/transform";
import type { Position } from "geojson";
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
  // ライセンスの自由記述欄 (LangResource)。keys へも必ず足す (Editor 側の写しと揃える)
  licenseNote: LangResource;
  dataLicenseNote: LangResource;
  contributor: LangResource;
  mapper: LangResource;
  reference: string;
  description: LangResource;
  // 不変条件: url は利用者が指定する交換形のタイルURLテンプレート（単一文字列）であり、
  // 多言語リソースではない。LangResource だったのは i18n 分離時にメタデータの型を
  // string | Record<string,string> へ一括拡張した際の巻き添えである
  // （docs/history/openspec-legacy/remove-i18n-dependency/proposal.md）
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
  // 地図 JSON 最上位の視点変換モード（"constant" | "grid"、設計書 §3.2）。
  // 副層（sub_maps）には置かない。読むときは値を検査し、不正な値は捨てる
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
  "licenseNote",
  "dataLicenseNote",
  "contributor",
  "mapper",
  "reference",
  "description",
  "url",
  "lang",
  "imageExtension",
  "homePosition",
  "mercZoom",
  "viewpointMode"
];

export async function store2HistMap(
  store: HistMapStore,
  byCompiled = false
): Promise<[HistMapStore, TinLike[]]> {
  return store2HistMap_internal(store, byCompiled);
}

async function store2HistMap_internal(
  store: HistMapStore,
  byCompiled: boolean
): Promise<[HistMapStore, TinLike[]]> {
  const ret: any = {};
  const tins: TinLike[] = [];
  keys.forEach(key => {
    ret[key] = store[key];
  });
  if ((store as any)["imageExtention"] || (store as any)["imageExtension"])
    ret["imageExtension"] =
      (store as any)["imageExtension"] || (store as any)["imageExtention"];
  if (store.compiled) {
    let tin: TinLike = new Transform();
    (tin as Transform).setCompiled(store.compiled);
    (tin as Transform).addIndexedTin();
    if (byCompiled) {
      tin = store.compiled;
    }
    const transform = tin as Transform;
    ret.strictMode = transform.strictMode;
    ret.vertexMode = transform.vertexMode;
    ret.yaxisMode = transform.yaxisMode;
    ret.width = transform.wh?.[0];
    ret.height = transform.wh?.[1];
    ret.gcps = transform.points;
    ret.edges = transform.edges;
    tins.push(tin);
  } else {
    ret.strictMode = store.strictMode;
    ret.vertexMode = store.vertexMode;
    ret.yaxisMode = store.yaxisMode;
    ret.width = store.width;
    ret.height = store.height;
    ret.gcps = store.gcps;
    ret.edges = store.edges;
    tins.push("compiledRequired");
  }

  if (store.sub_maps) {
    const sub_maps = [] as SubMap[];
    for (let i = 0; i < store.sub_maps.length; i++) {
      const sub_map = store.sub_maps[i];
      const sub: any = {};
      sub.importance = sub_map.importance;
      sub.priority = sub_map.priority;
      if (sub_map.compiled) {
        let tin: TinLike = new Transform();
        (tin as Transform).setCompiled(sub_map.compiled);
        (tin as Transform).addIndexedTin();
        if (byCompiled) {
          tin = sub_map.compiled;
        }
        sub.bounds = (tin as Transform).bounds;
        sub.gcps = (tin as Transform).points;
        sub.edges = (tin as Transform).edges;
        tins.push(tin);
      } else {
        sub.bounds = sub_map.bounds;
        sub.gcps = sub_map.gcps;
        sub.edges = sub_map.edges;
        tins.push("compiledRequired");
      }
      sub_maps.push(sub as SubMap);
    }
    ret.sub_maps = sub_maps;
  }
  return [ret as HistMapStore, tins];
}

interface StoredSurface {
  compiled?: CompiledTransformData;
  tinEnabled?: boolean;
  crs?: CrsObject;
  worldFile?: WorldFile;
}

type CoreSubMap = Omit<SubMap, "compiled"> & StoredSurface;
type CoreMapStore = Omit<HistMapStore, "compiled" | "sub_maps"> &
  StoredSurface & {
    mapID?: string;
    imageExtention?: string;
    sub_maps?: CoreSubMap[];
  };

function checkWorldFileDeclaration(layer: StoredSurface, prefix = ""): void {
  if (Object.hasOwn(layer, "compiled")) {
    throw new Error(`${prefix}tinEnabled:false の層は compiled を持てません`);
  }
}

export function getHistMapDimensions(store: CoreMapStore): [number, number] {
  if (store.tinEnabled === false) {
    checkWorldFileDeclaration(store, `Map ${store.mapID}: `);
    const { width, height } = store;
    if (
      width === undefined ||
      height === undefined ||
      !Number.isFinite(width) ||
      !Number.isFinite(height) ||
      width <= 0 ||
      height <= 0
    ) {
      throw new Error(
        `Map ${store.mapID}: world file の本図には正の有限な width と height が必要です`
      );
    }
    return [width, height];
  }

  const wh = store.compiled?.wh;
  if (!wh) throw new Error(`Map ${store.mapID} is missing compiled data.`);
  return [wh[0], wh[1]];
}

let proj4Engine: Promise<ProjectionEngine> | undefined;

async function getProjectionEngine(
  crs?: CrsObject
): Promise<ProjectionEngine | undefined> {
  if (
    crs?.epsg === 3857 ||
    crs?.epsg === 4326 ||
    typeof crs?.proj4 !== "string" ||
    !crs.proj4.trim()
  ) {
    return undefined;
  }
  proj4Engine ??= import("proj4")
    .then(({ default: proj4 }) => createProj4ProjectionEngine(proj4))
    .catch(error => {
      proj4Engine = undefined;
      throw error;
    });
  return proj4Engine;
}

async function toSurfaceData(
  layer: StoredSurface,
  dimensions: { wh: [number, number] } | { bounds?: number[][] }
): Promise<LayerSurfaceData> {
  const { compiled, crs, worldFile } = layer;
  const bounds = "bounds" in dimensions ? dimensions.bounds : undefined;
  if (layer.tinEnabled === false) {
    checkWorldFileDeclaration(layer);
    if (!crs) throw new Error("world file の層には CRS（crs）が必要です");
    if (!worldFile)
      throw new Error("tinEnabled:false の層には worldFile が必要です");
    if ("wh" in dimensions) {
      return {
        kind: "worldFile",
        crs,
        worldFile,
        wh: dimensions.wh,
        projectionEngine: await getProjectionEngine(crs)
      };
    }
    if (!Array.isArray(bounds) || bounds.length < 3) {
      throw new Error("world file の副層には 3 頂点以上の bounds が必要です");
    }
    return {
      kind: "worldFile",
      crs,
      worldFile,
      bounds: bounds as [number[], number[], number[], ...number[][]],
      projectionEngine: await getProjectionEngine(crs)
    };
  }

  return {
    kind: "tin",
    compiled: compiled!,
    crs,
    bounds,
    projectionEngine: await getProjectionEngine(crs)
  };
}

// Core が使う副層はここで一度だけ絞り込み、配列の添字 + 1 をすべての層番号に使う。
// 最上位の viewpointMode を検査して LayeredMapData へ渡す（設計書 §3.2）。
// 不正な値は捨て、無ければ undefined のまま渡して Transform の既定（"grid"）に任せる。
// 副層（sub_maps）の viewpointMode は読まない
function toViewpointMode(value: string | undefined): ViewpointMode | undefined {
  return value === "constant" || value === "grid" ? value : undefined;
}

export async function store2HistMap4Core(
  store: CoreMapStore
): Promise<[CoreMapStore, MapTransform]> {
  const wh = getHistMapDimensions(store);
  try {
    const subMaps = store.sub_maps?.filter(
      sub => sub.tinEnabled === false || sub.compiled
    );
    const mapData: LayeredMapData = {
      main: await toSurfaceData(store, { wh }),
      sub_maps: await Promise.all(
        (subMaps ?? []).map(async sub => ({
          ...(await toSurfaceData(sub, { bounds: sub.bounds })),
          priority: sub.priority,
          importance: sub.importance
        }))
      ),
      viewpointMode: toViewpointMode(store.viewpointMode)
    };
    const mapTransform = new MapTransform();
    mapTransform.setLayeredMapData(mapData);

    const main = mapTransform.getSurfaceTransform(0)!;
    const ret = {
      ...store,
      width: main.wh?.[0],
      height: main.wh?.[1]
    };
    if (!ret.imageExtension && store.imageExtention)
      ret.imageExtension = store.imageExtention;
    if (main instanceof Transform) {
      ret.strictMode = main.strictMode;
      ret.vertexMode = main.vertexMode;
      ret.yaxisMode = main.yaxisMode;
      ret.gcps = main.points;
      ret.edges = main.edges;
    }
    ret.sub_maps = subMaps?.map((sub, index) => {
      const surface = mapTransform.getSurfaceTransform(index + 1)!;
      return {
        ...sub,
        bounds: sub.bounds ?? surface.bounds,
        gcps: surface instanceof Transform ? surface.points : sub.gcps,
        edges: surface instanceof Transform ? surface.edges : sub.edges
      };
    });
    return [ret, mapTransform];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Map ${store.mapID}: ${message}`, { cause: error });
  }
}

export async function histMap2Store(
  histmap: HistMapStore,
  tins: TinLike[]
): Promise<HistMapStore> {
  const ret: any = {};
  keys.forEach(key => {
    ret[key] = histmap[key];
  });
  if ((histmap as any)["imageExtention"] || (histmap as any)["imageExtension"])
    ret["imageExtension"] =
      (histmap as any)["imageExtension"] || (histmap as any)["imageExtention"];
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
    ret.compiled = tin as Compiled;
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
            sub.compiled = tin as Compiled;
          }
          return sub as SubMap;
        })
      : [];

  return ret as HistMapStore;
}
