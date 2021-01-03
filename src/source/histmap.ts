/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-expect-error ts-migrate(2459) FIXME: Module '"../../node_modules/@types/ol/proj"' decla... Remove this comment to see the full error message
import { addCoordinateTransforms, addProjection, Projection } from "ol/proj";
import { MERC_MAX, tileSize, transPng } from "../const_ex";
import { MaplatSource, applyMixins } from "../source_ex";
import { XYZ } from "ol/source";
import { normalizeArg } from "../functions";
import { createFromTemplates, expandUrl } from "ol/tileurlfunction";
import { MaplatMap } from "../map_ex";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Weiwudi from "weiwudi";

for (let z = 0; z < 9; z++) {
  const key = `ZOOM:${z}`;
  const maxxy = 256 * Math.pow(2, z);

  (function (key, maxxy) {
    const projection = new Projection({
      code: key,
      // The extent is used to determine zoom level 0. Recommended values for a
      // projection's validity extent can be found at https://epsg.io/.
      extent: [0.0, 0.0, maxxy, maxxy],
      units: "m"
    });
    addProjection(projection);

    // We also declare EPSG:21781/EPSG:4326 transform functions. These functions
    // are necessary for the ScaleLine control and when calling ol.proj.transform
    // for setting the view's initial center (see below).

    addCoordinateTransforms(
      "EPSG:3857",
      projection,
      coordinate => {
        const x = ((coordinate[0] + MERC_MAX) * maxxy) / (2 * MERC_MAX);
        const y = ((-coordinate[1] + MERC_MAX) * maxxy) / (2 * MERC_MAX);
        return [x, y];
      },
      coordinate => {
        const x = (coordinate[0] * (2 * MERC_MAX)) / maxxy - MERC_MAX;
        const y = -1 * ((coordinate[1] * (2 * MERC_MAX)) / maxxy - MERC_MAX);
        return [x, y];
      }
    );
  })(key, maxxy);
}

// @ts-ignore
export class HistMap extends XYZ implements MaplatSource  {
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
  width: number;
  height: number;
  _maxxy: number;

  // @ts-ignore
  constructor(optOptions: any) {
    const options = normalizeArg(Object.assign({}, optOptions || {}));

    options.wrapX = false;
    if (!options.imageExtention) options.imageExtention = "jpg";
    if (options.mapID && !options.url && !options.urls) {
      options.url = `tiles/${options.mapID}/{z}/{x}/{y}.${options.imageExtention}`;
    }

    const zW = Math.log2(options.width / tileSize);
    const zH = Math.log2(options.height / tileSize);
    options.maxZoom = Math.ceil(Math.max(zW, zH));

    options.tileUrlFunction =
      options.tileUrlFunction ||
      function (coord: any) {
        const z = coord[0];
        const x = coord[1];
        const y = coord[2];
        if (
          // @ts-expect-error ts-migrate(2683)
          x * tileSize * Math.pow(2, this.maxZoom - z) >= this.width ||
          // @ts-expect-error ts-migrate(2683)
          y * tileSize * Math.pow(2, this.maxZoom - z) >= this.height ||
          x < 0 ||
          y < 0
        ) {
          return transPng;
        }
        // @ts-expect-error ts-migrate(2683)
        return this._tileUrlFunction(coord);
      };

    super(options);
    if (options.mapID) {
      this.mapID = options.mapID;
    }
    if (options.urls) {
      // @ts-expect-error ts-migrate(2554)
      this._tileUrlFunction = createFromTemplates(options.urls);
    } else if (options.url) {
      // @ts-expect-error ts-migrate(2554)
      this._tileUrlFunction = createFromTemplates(expandUrl(options.url));
    }

    this.width = options.width;
    this.height = options.height;
    this.maxZoom = options.maxZoom;
    this._maxxy = Math.pow(2, this.maxZoom as number) * tileSize;

    this.customInitialize(options);
  }

  histMapCoords2Xy(histCoords: any) {
    const x = ((histCoords[0] + MERC_MAX) * this._maxxy) / (2 * MERC_MAX);
    const y = ((-histCoords[1] + MERC_MAX) * this._maxxy) / (2 * MERC_MAX);
    return [x, y];
  }

  xy2HistMapCoords(xy: any) {
    const histX = (xy[0] * (2 * MERC_MAX)) / this._maxxy - MERC_MAX;
    const histY = -1 * ((xy[1] * (2 * MERC_MAX)) / this._maxxy - MERC_MAX);
    return [histX, histY];
  }

  insideCheckXy(xy: any) {
    return !(
      xy[0] < 0 ||
      xy[0] > this.width ||
      xy[1] < 0 ||
      xy[1] > this.height
    );
  }

  insideCheckHistMapCoords(histCoords: any) {
    return this.insideCheckXy(this.histMapCoords2Xy(histCoords));
  }

  modulateXyInside(xy: any) {
    const dx = xy[0] / (this.width / 2) - 1;
    const dy = xy[1] / (this.height / 2) - 1;
    const da = Math.max(Math.abs(dx), Math.abs(dy));
    return [
      ((dx / da + 1) * this.width) / 2,
      ((dy / da + 1) * this.height) / 2
    ];
  }

  modulateHistMapCoordsInside(histCoords: any) {
    const xy = this.histMapCoords2Xy(histCoords);
    const ret = this.modulateXyInside(xy);
    return this.xy2HistMapCoords(ret);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  merc2XyAsync(val: any, ignoreBackside = false): any {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  xy2MercAsync(val: any): any {
  }
}
applyMixins(HistMap, [MaplatSource]);