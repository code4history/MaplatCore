import { HistMap } from "./histmap";
import { MapTransform } from "@maplat/transform";
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

export class HistMap_tin extends HistMap {
  mapTransform: MapTransform;

  constructor(options: any = {}) {
    super(options);
    this.mapTransform = new MapTransform();
  }

  static async createAsync(options: any) {
    const [storeOptions, mapTransform] = await store2HistMap4Core(options);
    options = storeOptions;
    const obj = new HistMap_tin(options);
    obj.mapTransform = mapTransform;

    // メインレイヤーの OL Projection 登録
    const mainTin = mapTransform.getLayerTransform(0)!;
    const proj = new Projection({
      code: `Illst:${obj.mapID}`,
      extent: [0.0, 0.0, obj.width, obj.height],
      units: "m"
    });
    addProjection(proj);
    addCoordinateTransforms(
      proj,
      "EPSG:3857",
      xy => mainTin.transform(xy, false) as Coordinate,
      merc => mainTin.transform(merc, true) as Coordinate
    );
    transformDirect("EPSG:4326", proj);

    // サブマップの OL Projection 登録
    if (options.sub_maps) {
      options.sub_maps.forEach((_sub_map: any, i: number) => {
        const index = i + 1;
        const projKey = `Illst:${obj.mapID}#${index}`;
        const tin = mapTransform.getLayerTransform(index);
        if (!tin) return;
        const subProj = new Projection({
          code: projKey,
          extent: [tin.xy![0], tin.xy![1], tin.wh![0], tin.wh![1]],
          units: "m"
        });
        addProjection(subProj);
        addCoordinateTransforms(
          subProj,
          "EPSG:3857",
          xy => tin.transform(xy, false, true) as Coordinate,
          merc => tin.transform(merc, true, true) as Coordinate
        );
        transformDirect("EPSG:4326", subProj);
      });
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
    if (!result) return Promise.reject(new Error("xy2MercWithLayer: out of bounds"));
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
    if (!centerResult) return;
    const [index, mercCenter] = centerResult;

    const layerTin = this.mapTransform.getLayerTransform(index);
    const mainTin = this.mapTransform.getLayerTransform(0)!;
    if (!layerTin) return;

    const dir4 = [
      [xy[0] - 150, xy[1]],
      [xy[0] + 150, xy[1]],
      [xy[0], xy[1] - 150],
      [xy[0], xy[1] + 150]
    ];
    const envelope = [
      [0, 0],
      [this.width, 0],
      [this.width, this.height],
      [0, this.height]
    ];

    const dir4Mercs = dir4.map(p => layerTin.transform(p, false) as Coordinate);
    const envelopeMercs = envelope.map(
      p => mainTin.transform(p, false) as Coordinate
    );

    const delta1 = Math.sqrt(
      Math.pow(dir4Mercs[0][0] - dir4Mercs[1][0], 2) +
        Math.pow(dir4Mercs[0][1] - dir4Mercs[1][1], 2)
    );
    const delta2 = Math.sqrt(
      Math.pow(dir4Mercs[2][0] - dir4Mercs[3][0], 2) +
        Math.pow(dir4Mercs[2][1] - dir4Mercs[3][1], 2)
    );
    const delta = (delta1 + delta2) / 2;

    if (!this.mercZoom)
      this.mercZoom =
        Math.log((300 * (2 * MERC_MAX)) / 256 / delta) / Math.log(2) - 3;
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

  mercs2SysCoordsAsync_multiLayer(
    mercs: CrossCoordinatesArray
  ): Promise<(CrossCoordinatesArray | undefined)[]> {
    const results = this.mapTransform.mercs2SysCoords(mercs[0]);
    return Promise.resolve(
      results.map(result => {
        if (!result) return undefined;
        return [result.map(xy => xy as Coordinate), mercs[1]] as CrossCoordinatesArray;
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

  merc2XyAsync_ignoreBackground(merc: Coordinate): Promise<Coordinate | void> {
    return this.merc2XyAsync_base(merc, true);
  }

  merc2XyAsync(merc: Coordinate): Promise<Coordinate> {
    return this.merc2XyAsync_base(merc, false) as Promise<Coordinate>;
  }

  xy2MercAsync(xy: Coordinate): Promise<Coordinate> {
    return this.xy2MercAsync_returnLayer(xy).then(ret => ret[1]);
  }

  viewpoint2MercsAsync(
    viewpoint?: ViewpointArray,
    size?: Size
  ): Promise<CrossCoordinatesArray> {
    const center = (viewpoint?.[0] ??
      this.getMap().getView().getCenter()!) as number[];
    const zoom =
      viewpoint?.[1] ??
      (this.getMap().getView() as any).getDecimalZoom();
    const rotation =
      viewpoint?.[2] ?? this.getMap().getView().getRotation();
    if (!size) size = this.getMap().getSize()!;

    const mercs = this.mapTransform.viewpoint2Mercs(
      { center, zoom, rotation },
      size as [number, number]
    );
    return Promise.resolve([mercs, size] as CrossCoordinatesArray);
  }

  mercs2ViewpointAsync(mercs: CrossCoordinatesArray): Promise<ViewpointArray> {
    const size = (mercs[1] ?? this.getMap().getSize()!) as [number, number];
    const viewpoint = this.mapTransform.mercs2Viewpoint(
      mercs[0] as number[][],
      size
    );
    return Promise.resolve([
      viewpoint.center as Coordinate,
      viewpoint.zoom,
      viewpoint.rotation
    ] as ViewpointArray);
  }
}
