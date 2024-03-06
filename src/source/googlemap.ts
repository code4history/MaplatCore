import { Google } from "ol/source";
import {
  CrossCoordinatesArray,
  setCustomFunction,
  setCustomInitialize,
  setupTileLoadFunction,
  ViewpointArray
} from "./mixin";
import { Coordinate } from "ol/coordinate";
import { booleanPointInPolygon, lineIntersect, lineString } from "@turf/turf";
import { Size } from "ol/size";

export class GoogleMap extends setCustomFunction(Google) {
  constructor(options: any = {}) {
    options.mapType = options.googleMapType || "roadmap";
    options.layerTypes = options.googleLayerTypes || [];
    super(options);

    if (options.mapID) {
      this.mapID = options.mapID;
    }
    setCustomInitialize(this, options);
    setupTileLoadFunction(this);
  }

  static async createAsync(options: any) {
    return new GoogleMap(options);
  }

  insideCheckXy(xy: Coordinate) {
    if (!this.envelope) return true;
    return booleanPointInPolygon(xy, this.envelope);
  }

  insideCheckSysCoord(histCoords: Coordinate) {
    return this.insideCheckXy(histCoords);
  }

  modulateXyInside(xy: any) {
    if (!this.centroid) return xy;
    const expandLine = lineString([xy, this.centroid]);
    const intersect = lineIntersect(this.envelope as any, expandLine as any);
    if (intersect.features.length > 0 && intersect.features[0].geometry) {
      return intersect.features[0].geometry.coordinates;
    } else {
      return xy;
    }
  }

  modulateSysCoordInside(histCoords: any) {
    return this.modulateXyInside(histCoords);
  }

  // unifyTerm対応
  // https://github.com/code4history/MaplatCore/issues/19

  merc2XyAsync(merc: Coordinate): Promise<Coordinate> {
    return Promise.resolve(merc);
  }

  merc2XyAsync_ignoreBackground(merc: Coordinate): Promise<Coordinate | void> {
    return this.merc2XyAsync(merc);
  }

  xy2MercAsync(xy: Coordinate): Promise<Coordinate> {
    return Promise.resolve(xy);
  }

  xy2SysCoord(xy: Coordinate): Coordinate {
    return xy;
  }

  sysCoord2Xy(sysCoord: Coordinate): Coordinate {
    return sysCoord;
  }

  viewpoint2MercsAsync(viewpoint?: ViewpointArray, size?: Size) {
    const sysCoords = this.viewpoint2SysCoords(viewpoint, size);
    const xys = this.sysCoords2Xys(sysCoords);
    return this.xys2MercsAsync(xys);
  }

  mercs2ViewpointAsync(mercs: CrossCoordinatesArray): Promise<ViewpointArray> {
    return this.mercs2XysAsync(mercs).then(xys => {
      const sysCoords = this.xys2SysCoords(xys);
      return this.sysCoords2Viewpoint(sysCoords);
    });
  }

  mercs2SysCoordsAsync_multiLayer(
    mercs: CrossCoordinatesArray
  ): Promise<(CrossCoordinatesArray | undefined)[]> {
    return Promise.all(
      mercs[0].map(merc => this.merc2SysCoordAsync(merc))
    ).then(xys => [[xys, mercs[1]]]);
  }

  defZoom(): number {
    return this.mercZoom!;
  }
}