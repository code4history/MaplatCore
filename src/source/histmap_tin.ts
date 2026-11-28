import { HistMap } from "./histmap";
import { MapTransform } from "@maplat/transform";
import { boundingExtent } from "ol/extent";
import { addCoordinateTransforms, addProjection, toLonLat } from "ol/proj";
import Projection from "ol/proj/Projection";
import { transformDirect } from "../proj_ex";
import { polygon } from "@turf/turf";
import type { Feature, Polygon } from "geojson";
import { MERC_MAX } from "../const_ex";
import { Coordinate } from "ol/coordinate";
import { store2HistMap4Core } from "./store_handler";
import { Size } from "ol/size";
import { CrossCoordinatesArray, ViewpointArray } from "./mixin";
import { selectDisplayCandidates } from "./display_candidates";

export class HistMap_tin extends HistMap {
  mapTransform: MapTransform;

  constructor(options: any = {}) {
    super(options);
    this.mapTransform = new MapTransform();
  }

  static async createAsync(options: any) {
    const [storeOptions, mapTransform] = await store2HistMap4Core(options);
    const obj = new HistMap_tin(storeOptions);
    obj.mapTransform = mapTransform;

    // メインレイヤーの OL Projection 登録
    const mainSurface = mapTransform.getSurfaceTransform(0)!;
    const proj = new Projection({
      code: `Illst:${obj.mapID}`,
      extent: [0.0, 0.0, obj.width, obj.height],
      units: "m"
    });
    addProjection(proj);
    addCoordinateTransforms(
      proj,
      "EPSG:3857",
      xy => mainSurface.transform(xy, false) as Coordinate,
      merc => mainSurface.transform(merc, true) as Coordinate
    );
    transformDirect("EPSG:4326", proj);

    // 変換面と同じ層番号で副層の OL 投影を登録する。
    for (let index = 1; index < mapTransform.layerCount; index++) {
      const surface = mapTransform.getSurfaceTransform(index)!;
      const { xy, wh } = surface;
      const bounds = storeOptions.sub_maps?.[index - 1]?.bounds;
      const extent =
        xy && wh
          ? [xy[0], xy[1], xy[0] + wh[0], xy[1] + wh[1]]
          : bounds && boundingExtent(bounds);
      const subProj = new Projection({
        code: `Illst:${obj.mapID}#${index}`,
        extent,
        units: "m"
      });
      addProjection(subProj);
      addCoordinateTransforms(
        subProj,
        "EPSG:3857",
        xy => surface.transform(xy, false, true) as Coordinate,
        merc => surface.transform(merc, true, true) as Coordinate
      );
      transformDirect("EPSG:4326", subProj);
    }
    return obj;
  }

  xy2MercAsync_specifyLayer(xy: Coordinate, layerId: number) {
    const layerKey = `Illst:${this.mapID}${layerId ? `#${layerId}` : ""}`;
    return new Promise((resolve, _reject) => {
      resolve(transformDirect(layerKey, "EPSG:3857", xy)!);
    }) as Promise<Coordinate>;
  }

  merc2XyAsync_specifyLayer(merc: Coordinate, layerId: number) {
    const layerKey = `Illst:${this.mapID}${layerId ? `#${layerId}` : ""}`;
    return new Promise((resolve, _reject) => {
      resolve(transformDirect("EPSG:3857", layerKey, merc)!);
    }) as Promise<Coordinate>;
  }

  xy2MercAsync_returnLayer(xy: Coordinate): Promise<[number, Coordinate]> {
    const result = this.mapTransform.xy2MercWithLayer(xy);
    if (!result)
      return Promise.reject(new Error("xy2MercWithLayer: out of bounds"));
    return Promise.resolve(result as [number, Coordinate]);
  }

  merc2XyAsync_returnLayer(
    merc: Coordinate
  ): Promise<([number, Coordinate] | undefined)[]> {
    const results = this.mapTransform.merc2XyWithLayer(merc);
    return Promise.resolve(
      results.map(r =>
        r ? ([r[0], r[1] as Coordinate] as [number, Coordinate]) : undefined
      )
    );
  }

  setupMapParameter(callback: any) {
    const xy = [this.width / 2, this.height / 2];
    const centerResult = this.mapTransform.xy2MercWithLayer(xy);
    if (!centerResult)
      throw new Error(`Map ${this.mapID}: 地図の中心を投影できません`);
    const [index, mercCenter] = centerResult;

    const mainSurface = this.mapTransform.getSurfaceTransform(0)!;

    const envelope = [
      [0, 0],
      [this.width, 0],
      [this.width, this.height],
      [0, this.height]
    ];

    const envelopeMercs = envelope.map(p => mainSurface.transform(p, false));
    if (!envelopeMercs.every(p => p !== false)) {
      throw new Error(`Map ${this.mapID}: 初期表示の範囲を投影できません`);
    }

    if (!this.mercZoom) {
      // 既定の mercZoom は、紙の中心で xy2MercWithLayer が選んだ層の縮尺 s から出す
      // （設計書 §7.2 OQ-3）。モード 2（"grid" / 未指定）は格子を作らずに紙の中心の
      // 十字 4 点（半径 150 px、ignoreBounds = true）で測り、モード 1（"constant"）は
      // その層の全体の値 s0 を使う。一様（相似）の図では、旧式（4 点の距離平均
      // delta = 300 * s）と厳密に一致する
      let s: number;
      try {
        s =
          this.mapTransform.viewpointMode === "constant"
            ? this.mapTransform.getViewpointCoefficients(index, xy).s
            : this.mapTransform.probeViewpointCoefficients(
                index,
                [xy[0], xy[1]],
                150
              ).s;
      } catch (error) {
        throw new Error(
          `Map ${this.mapID}: 初期表示の範囲を投影できません`,
          { cause: error }
        );
      }
      this.mercZoom = Math.log2((2 * MERC_MAX) / (256 * s)) - 3;
    }
    if (!this.homePosition) this.homePosition = toLonLat(mercCenter);
    this.envelope = polygon([
      [
        envelopeMercs[0],
        envelopeMercs[1],
        envelopeMercs[2],
        envelopeMercs[3],
        envelopeMercs[0]
      ]
    ]) as Feature<Polygon>;
    callback(this);
  }

  // GPS マーカー用（呼び出し元は mixin の setGPSMarkerAsync のみ）。
  // Transform が merc2XyVisibleLayers を持てば、紙外の本図を除いた表示候補の 1・2 位を返す（MaplatCore#104）:
  // 1 位は中心＋周囲 4 点を同じ層で逆変換した 5 点、2 位は中心だけ。undefined（旧 hide 表現）を含まない 0〜2 件。
  // 持たない（@maplat/transform 1.0.x）なら従来経路（mercs2SysCoords）。
  mercs2SysCoordsAsync_multiLayer(
    mercs: CrossCoordinatesArray
  ): Promise<(CrossCoordinatesArray | undefined)[]> {
    const points = mercs[0] as number[][];
    const candidates = selectDisplayCandidates(
      this.mapTransform,
      points[0],
      xy => this.insideCheckXy(xy)
    );
    if (candidates) {
      return Promise.resolve(
        candidates.map(([index, xy], rank) => {
          if (rank > 0) {
            return [[this.xy2SysCoord(xy)], mercs[1]] as CrossCoordinatesArray;
          }
          const surface = this.mapTransform.getSurfaceTransform(index)!;
          const xys = points.map((merc, j) =>
            j === 0
              ? xy
              : (surface.transform(merc, true, index > 0) as Coordinate)
          );
          return [
            xys.map(p => this.xy2SysCoord(p)),
            mercs[1]
          ] as CrossCoordinatesArray;
        })
      );
    }
    const results = this.mapTransform.mercs2SysCoords(mercs[0]);
    return Promise.resolve(
      results.map(result => {
        if (!result) return undefined;
        return [
          result.map(xy => xy as Coordinate),
          mercs[1]
        ] as CrossCoordinatesArray;
      })
    );
  }

  merc2XyAsync_base(
    merc: Coordinate,
    ignoreBackground: boolean
  ): Promise<Coordinate | void> {
    return this.merc2XyAsync_returnLayer(merc).then(ret => {
      if (ignoreBackground && !ret[0]) return;
      const pick = !ret[0] ? ret[1] : ret[0];
      return (pick as [number, Coordinate])[1];
    });
  }

  // POI ピン用（呼び出し元は mixin の merc2SysCoordAsync_ignoreBackground → index.ts の setMarker のみ）。
  // Transform が merc2XyVisibleLayers を持てば、紙外の本図を除いた表示候補の 1 位、無ければ undefined（MaplatCore#104）。
  // 持たない（@maplat/transform 1.0.x）なら従来経路。
  merc2XyAsync_ignoreBackground(merc: Coordinate): Promise<Coordinate | void> {
    const candidates = selectDisplayCandidates(this.mapTransform, merc, xy =>
      this.insideCheckXy(xy)
    );
    if (candidates) {
      return Promise.resolve(candidates.length ? candidates[0][1] : undefined);
    }
    return this.merc2XyAsync_base(merc, true);
  }

  merc2XyAsync(merc: Coordinate): Promise<Coordinate> {
    return this.merc2XyAsync_base(merc, false) as Promise<Coordinate>;
  }

  xy2MercAsync(xy: Coordinate): Promise<Coordinate> {
    return this.xy2MercAsync_returnLayer(xy).then(ret => ret[1]);
  }

  /**
   * @param layerIndex - 層番号（省略時は従来の層選択）。0 = 本図、1 以上 = 副層。
   *   使える副層（tinEnabled === false または compiled あり）だけに絞り込んだ後の
   *   添字 + 1 なので、地図 JSON の sub_maps の元の添字とはずれる場合がある。
   *   範囲外の番号・非整数は例外になる
   */
  viewpoint2MercsAsync(
    viewpoint?: ViewpointArray,
    size?: Size,
    layerIndex?: number
  ): Promise<CrossCoordinatesArray> {
    const center = (viewpoint?.[0] ??
      this.getMap().getView().getCenter()!) as number[];
    const zoom =
      viewpoint?.[1] ?? (this.getMap().getView() as any).getDecimalZoom();
    const rotation = viewpoint?.[2] ?? this.getMap().getView().getRotation();
    if (!size) size = this.getMap().getSize()!;

    const mercs = this.mapTransform.viewpoint2Mercs(
      { center, zoom, rotation },
      size as [number, number],
      layerIndex
    );
    return Promise.resolve([mercs, size] as CrossCoordinatesArray);
  }

  /**
   * @param layerIndex - 層番号（省略時は従来の層選択）。0 = 本図、1 以上 = 副層。
   *   使える副層（tinEnabled === false または compiled あり）だけに絞り込んだ後の
   *   添字 + 1 なので、地図 JSON の sub_maps の元の添字とはずれる場合がある。
   *   範囲外の番号・非整数は例外になる
   */
  mercs2ViewpointAsync(
    mercs: CrossCoordinatesArray,
    layerIndex?: number
  ): Promise<ViewpointArray> {
    const size = (mercs[1] ?? this.getMap().getSize()!) as [number, number];
    const viewpoint = this.mapTransform.mercs2Viewpoint(
      mercs[0] as number[][],
      size,
      layerIndex
    );
    return Promise.resolve([
      viewpoint.center as Coordinate,
      viewpoint.zoom,
      viewpoint.rotation
    ] as ViewpointArray);
  }
}
