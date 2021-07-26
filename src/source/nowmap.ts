/* eslint-disable @typescript-eslint/ban-ts-comment */
import { OSM } from "ol/source";
import { normalizeArg } from "../functions";
import { lineString } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import lineIntersect from "@turf/line-intersect";
import {
  CrossCoordinatesArray,
  setCustomFunction,
  setCustomInitialize,
  setupTileLoadFunction,
  ViewpointArray
} from "./mixin";
import { Coordinate } from "ol/coordinate";
import { Size } from "ol/size";

export class NowMap extends setCustomFunction(OSM) {
  constructor(options: any = {}) {
    super(
      (options = (() => {
        options = normalizeArg(options);
        if (!options.imageExtension) options.imageExtension = "jpg";
        if (options.mapID && !options.url && !options.urls) {
          options.url = options.tms
            ? `tiles/${options.mapID}/{z}/{x}/{-y}.${options.imageExtension}`
            : `tiles/${options.mapID}/{z}/{x}/{y}.${options.imageExtension}`;
        }
        return options;
      })() as any)
    );

    if (options.mapID) {
      this.mapID = options.mapID;
    }
    setCustomInitialize(this, options);
    setupTileLoadFunction(this);
  }

  static async createAsync(options: any) {
    return new NowMap(options);
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
}
