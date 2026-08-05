"use strict";

import {
  Transform,
  MapTransform,
  MapData,
  Compiled,
  PointSet,
  EdgeSet,
  StrictMode,
  VertexMode,
  YaxisMode
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
  // m6-t2: ライセンスの自由記述欄 (LangResource)。keys へも必ず足す (Editor 側の写しと揃える)
  licenseNote: LangResource;
  dataLicenseNote: LangResource;
  contributor: LangResource;
  mapper: LangResource;
  reference: string;
  description: LangResource;
  // M5-T2 (不変条件 I-1): url は利用者が指定する交換形のタイルURLテンプレート（単一文字列）であり、
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
  "mercZoom"
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
    ret["imageExtension"] = (store as any)["imageExtension"] || (store as any)["imageExtention"];
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

// MaplatCore 専用: MapTransform を組み立てて返す
export async function store2HistMap4Core(
  store: HistMapStore
): Promise<[HistMapStore, MapTransform]> {
  const ret: any = store;
  keys.forEach(key => {
    ret[key] = store[key];
  });
  if ((store as any)["imageExtention"] || (store as any)["imageExtension"])
    ret["imageExtension"] = (store as any)["imageExtension"] || (store as any)["imageExtention"];

  if (!store.compiled) {
    throw new Error(
      "@maplat/transform requires pre-compiled data. Cannot create MapTransform from GCPs."
    );
  }

  // MapData を組み立てる
  const mapData: MapData = { compiled: store.compiled };
  if (store.sub_maps?.length) {
    mapData.sub_maps = store.sub_maps
      .filter(s => s.compiled)
      .map(s => ({
        compiled: s.compiled!,
        priority: s.priority,
        importance: s.importance,
        bounds: s.bounds
      }));
  }

  const mapTransform = new MapTransform();
  mapTransform.setMapData(mapData);

  // メイン TIN からメタ情報を補完
  const mainTin = mapTransform.getLayerTransform(0)!;
  ret.strictMode = mainTin.strictMode;
  ret.vertexMode = mainTin.vertexMode;
  ret.yaxisMode = mainTin.yaxisMode;
  ret.width = mainTin.wh?.[0];
  ret.height = mainTin.wh?.[1];
  ret.gcps = mainTin.points;
  ret.edges = mainTin.edges;

  if (store.sub_maps) {
    const sub_maps = store.sub_maps.map((sub_map, i) => {
      const sub: any = {
        importance: sub_map.importance,
        priority: sub_map.priority
      };
      if (sub_map.compiled) {
        const subTin = mapTransform.getLayerTransform(i + 1);
        sub.bounds = subTin?.bounds ?? sub_map.bounds;
        sub.gcps = subTin?.points;
        sub.edges = subTin?.edges;
      } else {
        sub.bounds = sub_map.bounds;
        sub.gcps = sub_map.gcps;
        sub.edges = sub_map.edges;
      }
      return sub as SubMap;
    });
    ret.sub_maps = sub_maps;
  }

  return [ret as HistMapStore, mapTransform];
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
    ret["imageExtension"] = (histmap as any)["imageExtension"] || (histmap as any)["imageExtention"];
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
