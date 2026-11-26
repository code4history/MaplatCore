// 変換の形のデモ（layered-map.html）の変換の組み立て。デモの画面（demo/layered-map.ts）・素材の生成
// （generate.mjs）・試験（spec/layered-map-demo.spec.ts）が同じものを使う。
//
// 3857 の面の赤い線は、紙の画素を @maplat/transform の MapTransform で 3857 へ変換して描く。Core の
// 公開 API には「紙の画素 → 3857」の口が無いため（設計書 §5.1）。Core は地図 JSON から
// store2HistMap4Core（src/source/store_handler.ts）で同じ MapTransform を組むので、ここでもその組み立て方
// （層の種類・投影エンジンの渡し方）を写している。食い違わないことは試験で固定する。
import { MapTransform, createProj4ProjectionEngine } from "@maplat/transform";
import type {
  CompiledTransformData,
  CrsObject,
  LayerSurfaceData,
  Proj4Factory,
  WorldFile
} from "@maplat/transform";

/** 地図 JSON のうち、変換に関わるキー（public/maps/layered_demo_*.json） */
export interface DemoMapJson {
  crs?: CrsObject;
  tinEnabled?: boolean;
  worldFile?: WorldFile;
  width?: number;
  height?: number;
  compiled?: CompiledTransformData;
}

/** 地図 JSON から MapTransform を組む（本図 1 層だけ。デモの地図は副層を持たない） */
export function buildMapTransform(
  json: DemoMapJson,
  proj4: Proj4Factory
): MapTransform {
  const crs = json.crs;
  // Core と同じく、3857・4326 は内蔵の投影、それ以外の proj4 の定義は同梱の proj4 で解く
  const needsProj4 =
    crs?.epsg !== 3857 &&
    crs?.epsg !== 4326 &&
    typeof crs?.proj4 === "string" &&
    crs.proj4.trim() !== "";
  const projectionEngine = needsProj4
    ? createProj4ProjectionEngine(proj4)
    : undefined;
  let main: LayerSurfaceData;
  if (json.tinEnabled === false) {
    if (!crs || !json.worldFile || !json.width || !json.height) {
      throw new Error("world file の地図には crs・worldFile・width・height が要ります");
    }
    main = {
      kind: "worldFile",
      crs,
      worldFile: json.worldFile,
      wh: [json.width, json.height],
      projectionEngine
    };
  } else {
    if (!json.compiled) throw new Error("三角網の地図には compiled が要ります");
    main = { kind: "tin", compiled: json.compiled, crs, projectionEngine };
  }
  const transform = new MapTransform();
  transform.setLayeredMapData({ main });
  return transform;
}

// ---- 3857 と経緯度（球面メルカトル。OpenLayers の EPSG:3857 と同じ半径）----
const R = 6378137;
export const lonlat2merc = ([lon, lat]: number[]): [number, number] => [
  (R * lon * Math.PI) / 180,
  R * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))
];
export const merc2lonlat = ([x, y]: number[]): [number, number] => [
  (x / R) * (180 / Math.PI),
  (2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * (180 / Math.PI)
];

/** 2 つの経緯度の球面上の距離（km） */
export function haversineKm(a: number[], b: number[]): number {
  const rad = Math.PI / 180;
  const dLat = (b[1] - a[1]) * rad;
  const dLon = (b[0] - a[0]) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(dLon / 2) ** 2;
  return (2 * R * Math.asin(Math.min(1, Math.sqrt(h)))) / 1000;
}

/** 紙の画素を 3857 へ。範囲外（false）のときは例外にする（デモの紙の面ではあり得ない） */
export function pixelToMerc(
  transform: MapTransform,
  xy: number[]
): [number, number] {
  const merc = transform.xy2Merc(xy);
  if (!merc) throw new Error(`変換できない画素: ${xy.join(",")}`);
  return [merc[0], merc[1]];
}
