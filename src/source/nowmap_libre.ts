import { normalizeArg } from "../functions";
import { lineString } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import lineIntersect from "@turf/line-intersect";
import {
  CrossCoordinatesArray,
  ViewpointArray,
  setCustomFunction,
  setCustomInitialize
} from "./mixin";
import { Coordinate } from "ol/coordinate";
import { Size } from "ol/size";

// Base class for MapLibre sources
class MapLibreSourceBase {
  mapID?: string;
  centroid?: any;
  envelope?: any;
  [key: string]: any;
  
  constructor(options: any = {}) {
    options = normalizeArg(options);
    if (options.mapID) {
      this.mapID = options.mapID;
    }
    setCustomInitialize(this, options);
  }
}

export class NowMapLibre extends setCustomFunction(MapLibreSourceBase) {
  options: any;
  
  constructor(options: any = {}) {
    options = normalizeArg(options);
    if (!options.imageExtension) options.imageExtension = "jpg";
    if (options.mapID && !options.url && !options.urls) {
      options.url = options.tms
        ? `tiles/${options.mapID}/{z}/{x}/{-y}.${options.imageExtension}`
        : `tiles/${options.mapID}/{z}/{x}/{y}.${options.imageExtension}`;
    }
    
    super(options);
    this.options = options;
  }
  
  static async createAsync(options: any) {
    return new NowMapLibre(options);
  }
  
  // Get MapLibre source configuration
  getMapLibreSource() {
    if (this.options.url) {
      return {
        type: 'raster' as const,
        tiles: [this.options.url],
        tileSize: 256,
        scheme: (this.options.tms ? 'tms' : 'xyz') as 'tms' | 'xyz',
        maxzoom: this.options.maxZoom || 18
      };
    } else if (this.options.urls) {
      return {
        type: 'raster' as const,
        tiles: this.options.urls,
        tileSize: 256,
        scheme: (this.options.tms ? 'tms' : 'xyz') as 'tms' | 'xyz',
        maxzoom: this.options.maxZoom || 18
      };
    } else {
      // Default OSM source
      return {
        type: 'raster' as const,
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors',
        maxzoom: 19
      };
    }
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
  
  // Implement abstract methods from mixin
  defZoom(screenSize?: Size): number {
    // Default zoom implementation for NowMap
    return this.options.defaultZoom || 14;
  }
  
  async mercs2SysCoordsAsync_multiLayer(mercs: CrossCoordinatesArray): Promise<(CrossCoordinatesArray | undefined)[]> {
    // For NowMap, system coordinates are the same as XY coordinates
    // which are the same as mercator coordinates
    return [mercs];
  }
}