// Coordinate transformation utilities for MapLibre GL JS
// Handles conversion between XY coordinates and Web Mercator (EPSG:3857)

import { MERC_MAX } from './const_ex';

export interface XYBounds {
  width: number;
  height: number;
}

export class XYCoordinateSystem {
  bounds: XYBounds;
  maxZoom: number;
  
  constructor(bounds: XYBounds, maxZoom: number) {
    this.bounds = bounds;
    this.maxZoom = maxZoom;
  }
  
  // Convert XY coordinates to Web Mercator coordinates
  // XY origin is at top-left, Web Mercator origin is at center
  xyToMercator(xy: [number, number]): [number, number] {
    // Normalize XY to 0-1 range
    const normalizedX = xy[0] / this.bounds.width;
    const normalizedY = xy[1] / this.bounds.height;
    
    // Convert to Web Mercator
    // X: left edge is -MERC_MAX, right edge is MERC_MAX
    const mercX = (normalizedX * 2 - 1) * MERC_MAX;
    // Y: top edge is MERC_MAX, bottom edge is -MERC_MAX (inverted)
    const mercY = (1 - normalizedY * 2) * MERC_MAX;
    
    return [mercX, mercY];
  }
  
  // Convert Web Mercator coordinates to XY coordinates
  mercatorToXY(merc: [number, number]): [number, number] {
    // Normalize Web Mercator to 0-1 range
    const normalizedX = (merc[0] + MERC_MAX) / (2 * MERC_MAX);
    const normalizedY = 1 - (merc[1] + MERC_MAX) / (2 * MERC_MAX);
    
    // Convert to XY coordinates
    const x = normalizedX * this.bounds.width;
    const y = normalizedY * this.bounds.height;
    
    return [x, y];
  }
  
  // Convert XY bounds to Web Mercator bounds
  getBoundsInMercator(): [[number, number], [number, number]] {
    const topLeft = this.xyToMercator([0, 0]);
    const bottomRight = this.xyToMercator([this.bounds.width, this.bounds.height]);
    
    return [
      [Math.min(topLeft[0], bottomRight[0]), Math.min(topLeft[1], bottomRight[1])],
      [Math.max(topLeft[0], bottomRight[0]), Math.max(topLeft[1], bottomRight[1])]
    ];
  }
  
  // Get the scale factor for a given zoom level
  getScaleForZoom(zoom: number): number {
    return Math.pow(2, zoom - this.maxZoom);
  }
  
  // Convert tile coordinates to bounds in XY space
  tileBoundsInXY(z: number, x: number, y: number, tileSize = 256): [[number, number], [number, number]] | null {
    const scale = Math.pow(2, this.maxZoom - z);
    const tileWidthInXY = tileSize * scale;
    
    const minX = x * tileWidthInXY;
    const minY = y * tileWidthInXY;
    const maxX = minX + tileWidthInXY;
    const maxY = minY + tileWidthInXY;
    
    // Check if tile is within bounds
    if (minX >= this.bounds.width || minY >= this.bounds.height || maxX < 0 || maxY < 0) {
      return null;
    }
    
    return [[minX, minY], [maxX, maxY]];
  }
  
  // Check if XY coordinate is within bounds
  isInBounds(xy: [number, number]): boolean {
    return xy[0] >= 0 && xy[0] <= this.bounds.width && 
           xy[1] >= 0 && xy[1] <= this.bounds.height;
  }
}

// Convert from degrees to radians
export function degreesToRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

// Convert from radians to degrees
export function radiansToDegrees(radians: number): number {
  return radians * 180 / Math.PI;
}

// Convert lng/lat to Web Mercator
export function lngLatToMercator(lngLat: [number, number]): [number, number] {
  const lng = lngLat[0];
  const lat = lngLat[1];
  
  const x = (lng * MERC_MAX) / 180;
  const y = (Math.log(Math.tan((90 + lat) * Math.PI / 360)) * MERC_MAX) / Math.PI;
  
  return [x, y];
}

// Convert Web Mercator to lng/lat
export function mercatorToLngLat(merc: [number, number]): [number, number] {
  const x = merc[0];
  const y = merc[1];
  
  const lng = (x * 180) / MERC_MAX;
  const lat = (Math.atan(Math.exp((y * Math.PI) / MERC_MAX)) * 360) / Math.PI - 90;
  
  return [lng, lat];
}