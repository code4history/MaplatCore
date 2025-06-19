import { tileSize } from "../const_ex";
import {
  setCustomFunction,
  setCustomInitialize
} from "./mixin";
import { normalizeArg } from "../functions";
import { Coordinate } from "ol/coordinate";
import { XYCoordinateSystem, lngLatToMercator, mercatorToLngLat } from "../maplibre_coord_transform";

// Base class for MapLibre sources
class MapLibreSourceBase {
  mapID?: string;
  [key: string]: any;
  
  constructor(options: any = {}) {
    options = normalizeArg(options);
    if (options.mapID) {
      this.mapID = options.mapID;
    }
    setCustomInitialize(this, options);
  }
}

export abstract class HistMapLibre extends setCustomFunction(MapLibreSourceBase) {
  width: number;
  height: number;
  maxZoom: number;
  _maxxy: number;
  xySystem: XYCoordinateSystem;
  options: any;
  
  constructor(options: any = {}) {
    options = normalizeArg(options);
    
    if (!options.imageExtension) options.imageExtension = "jpg";
    if (options.mapID && !options.url && !options.urls) {
      options.url = `tiles/${options.mapID}/{z}/{x}/{y}.${options.imageExtension}`;
    }
    
    const zW = Math.log2(options.width / tileSize);
    const zH = Math.log2(options.height / tileSize);
    options.maxZoom = Math.ceil(Math.max(zW, zH));
    
    super(options);
    
    this.width = options.width;
    this.height = options.height;
    this.maxZoom = options.maxZoom;
    this._maxxy = Math.pow(2, this.maxZoom) * tileSize;
    this.options = options;
    
    // Initialize XY coordinate system
    this.xySystem = new XYCoordinateSystem(
      { width: this.width, height: this.height },
      this.maxZoom
    );
  }
  
  // Get MapLibre source configuration
  getMapLibreSource() {
    const bounds = this.xySystem.getBoundsInMercator();
    
    // Custom tile URL function that checks bounds
    const tileUrl = this.options.url || this.options.urls?.[0] || '';
    
    return {
      type: 'raster' as const,
      tiles: [tileUrl],
      tileSize,
      bounds: [
        ...mercatorToLngLat(bounds[0]),
        ...mercatorToLngLat(bounds[1])
      ] as [number, number, number, number],
      maxzoom: this.maxZoom,
      // Custom scheme to handle XY tiles
      scheme: 'xyz' as const
    };
  }
  
  // Convert lng/lat to XY coordinates
  lngLat2Xy(lngLat: [number, number]): [number, number] {
    const merc = lngLatToMercator(lngLat);
    return this.xySystem.mercatorToXY(merc);
  }
  
  // Convert XY to lng/lat coordinates
  xy2LngLat(xy: [number, number]): [number, number] {
    const merc = this.xySystem.xyToMercator(xy);
    return mercatorToLngLat(merc);
  }
  
  insideCheckXy(xy: Coordinate) {
    return this.xySystem.isInBounds(xy as [number, number]);
  }
  
  insideCheckSysCoord(sysCoord: Coordinate) {
    return this.insideCheckXy(this.sysCoord2Xy(sysCoord));
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
  
  modulateSysCoordInside(sysCoord: any) {
    const xy = this.sysCoord2Xy(sysCoord);
    const xyMod = this.modulateXyInside(xy);
    return this.xy2SysCoord(xyMod);
  }
  
  xy2SysCoord(xy: Coordinate): Coordinate {
    const x = (xy[0] * this._maxxy) / this.width;
    const y = (xy[1] * this._maxxy) / this.height;
    return [x, y];
  }
  
  sysCoord2Xy(sysCoord: Coordinate): Coordinate {
    const x = (sysCoord[0] * this.width) / this._maxxy;
    const y = (sysCoord[1] * this.height) / this._maxxy;
    return [x, y];
  }
  
}