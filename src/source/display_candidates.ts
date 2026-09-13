import type { MapTransform } from "@maplat/transform";
import type { Coordinate } from "ol/coordinate";

/**
 * GPS / POI 用の可視層判定を持つ Transform（@maplat/transform 1.1 以降）。
 * 1.0.x の型定義には `merc2XyVisibleLayers` が無いので Partial で受ける。
 */
export type MapTransformWithVisibleLayers = MapTransform &
  Partial<{ merc2XyVisibleLayers(merc: number[]): [number, number[]][] }>;

/**
 * GPS マーカー・POI ピンの表示候補（MaplatCore#104）。
 *
 * `merc2XyVisibleLayers` が返す「覆われていない対応層」（importance 降順 → priority 降順 → 層番号昇順・上限なし）
 * から、紙の外になる候補（`insideCheckXy` が偽。実際には本図の紙外）を**除いてから**先頭 2 件を返す。
 * 1 位が表示先（GPS は main・POI はピン）、2 位が GPS の sub。視点換算にはこの結果を使わない。
 *
 * @returns 0〜2 件の `[層番号, 紙座標]`。Transform が `merc2XyVisibleLayers` を持たない（1.0.x）ときは
 *          `null`（呼び出し側は従来経路を使う）
 */
export function selectDisplayCandidates(
  mapTransform: MapTransformWithVisibleLayers,
  merc: number[],
  insideCheckXy: (xy: Coordinate) => boolean
): [number, Coordinate][] | null {
  if (typeof mapTransform.merc2XyVisibleLayers !== "function") return null;
  return mapTransform
    .merc2XyVisibleLayers(merc)
    .filter(([, xy]) => insideCheckXy(xy as Coordinate))
    .slice(0, 2)
    .map(([index, xy]) => [index, xy as Coordinate] as [number, Coordinate]);
}
