/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OSM } from "ol/source";
import { normalizeArg } from "../functions";
import { lineString, point } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import lineIntersect from "@turf/line-intersect";
import { MaplatSource, applyMixins } from "../source_ex";
import { MaplatMap } from "../map_ex";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Weiwudi from "weiwudi";

// @ts-ignore
export class NowMap extends OSM implements MaplatSource {
  weiwudi: Weiwudi | undefined = undefined;
  _map: MaplatMap | undefined = undefined;
  homePosition: any;
  mercZoom: any;
  pois: any;
  officialTitle = "";
  title = "";
  mapID = "";
  label = "";
  maxZoom: number | undefined = undefined;
  minZoom: number | undefined = undefined;
  poiTemplate = "";
  poiStyle = "";
  iconTemplate = "";
  mercatorXShift = 0;
  mercatorYShift = 0;
  envelope: any;
  centroid: any;
  thumbnail: any;
  initialWait: Promise<any> | undefined = undefined;
  private tilePixelRatio_: any;
  private projection_: any;

  // @ts-ignore
  constructor(optOptions: any) {
    const options = normalizeArg(Object.assign({}, optOptions || {}));
    if (!options.imageExtention) options.imageExtention = "jpg";
    if (options.mapID && !options.url && !options.urls) {
      options.url = options.tms
        ? `tiles/${options.mapID}/{z}/{x}/{-y}.${options.imageExtention}`
        : `tiles/${options.mapID}/{z}/{x}/{y}.${options.imageExtention}`;
    }
    super(options);
    if (options.mapID) {
      this.mapID = options.mapID;
    }
    this.customInitialize(options);
  }

  static async createAsync(options: any) {
    return new NowMap(options);
  }

  xy2MercAsync(xy: any) {
    return new Promise((resolve, _reject) => {
      resolve(xy);
    }).catch(err => {
      throw err;
    });
  }

  merc2XyAsync(merc: any, _ignoreBackside = false) {
    return new Promise((resolve, _reject) => {
      resolve(merc);
    });
  }

  insideCheckXy(xy: any) {
    if (!this.envelope) return true;
    const point_ = point(xy);
    return booleanPointInPolygon(point_, this.envelope);
  }

  insideCheckHistMapCoords(histCoords: any) {
    return this.insideCheckXy(histCoords);
  }

  modulateXyInside(xy: any) {
    if (!this.centroid) return xy;
    const expandLine = lineString([xy, this.centroid]);
    const intersect = lineIntersect(this.envelope, expandLine);
    if (intersect.features.length > 0 && intersect.features[0].geometry) {
      return intersect.features[0].geometry.coordinates;
    } else {
      return xy;
    }
  }

  modulateHistMapCoordsInside(histCoords: any) {
    return this.modulateXyInside(histCoords);
  }

  // For Mixin
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  addPoi(data: any, clusterId: string): any {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  addPoiLayer(id: string, data: any): void {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  clearPoi(clusterId?: string): void {
  }

  async clearTileCacheAsync(): Promise<void> {
    return Promise.resolve(undefined);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  customInitialize(options: any): void {
  }

  getMap(): MaplatMap | undefined {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  getPoi(id: string): any {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  getPoiLayer(id: string): any {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getRadius(size: any, zoom: any): number {
    return 0;
  }

  async getTileCacheSizeAsync(): Promise<number> {
    return Promise.resolve(0);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  goHome(): void {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  listPoiLayers(hideOnly = false, nonzero = false): any[] {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mercs2MercRotation(xys: any): number {
    return 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  mercs2MercSizeAsync(mercs: any): any {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  mercs2SizeAsync(mercs?: any, asMerc?: any): any {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  mercs2XysAsync(mercs: any): any {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  mercsFromGPSValue(lnglat: any, acc: any): any {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  mercsFromGivenMercZoom(center: any, mercZoom: any, direction: any): any {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removePoi(id: string): void {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removePoiLayer(id: string): void {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async resolvePois(pois: any): Promise<void> {
    return Promise.resolve(undefined);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  rotateMatrix(xys: any, theta: any): any {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  setGPSMarker(position: any, ignoreMove: boolean): void {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  setGPSMarkerAsync(position: any, ignoreMove: boolean): any {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  setViewpoint(cond: any): void {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  setViewpointRadian(cond: any): void {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  size2MercsAsync(center?: any, zoom?: any, rotate?: any): any {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  size2Xys(center?: any, zoom?: any, rotate?: any): any {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  xys2Size(xys: any): any {
  }
}
applyMixins(NowMap, [MaplatSource]);
