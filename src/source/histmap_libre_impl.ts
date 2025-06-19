import { HistMapLibre } from "./histmap_libre";
import { CrossCoordinatesArray, Size, ViewpointArray, Coordinate } from "./mixin";

export class HistMapLibreImpl extends HistMapLibre {
  constructor(options: any = {}) {
    super(options);
  }

  static async createAsync(options: any) {
    return new HistMapLibreImpl(options);
  }
  
  // Implement async coordinate transformation methods
  async merc2XyAsync(merc: [number, number]): Promise<[number, number]> {
    return this.xySystem.mercatorToXY(merc);
  }
  
  async xy2MercAsync(xy: [number, number]): Promise<[number, number]> {
    return this.xySystem.xyToMercator(xy);
  }
  
  async mercs2XysAsync(mercs: CrossCoordinatesArray): Promise<CrossCoordinatesArray> {
    const coords = mercs[0];
    const xys = await Promise.all(coords.map(merc => this.merc2XyAsync(merc as [number, number])));
    return [xys, mercs[1]];
  }
  
  async xys2MercsAsync(xys: CrossCoordinatesArray): Promise<CrossCoordinatesArray> {
    const coords = xys[0];
    const mercs = await Promise.all(coords.map(xy => this.xy2MercAsync(xy as [number, number])));
    return [mercs, xys[1]];
  }
  
  // Implement abstract methods from mixin
  defZoom(screenSize?: Size): number {
    // Default zoom implementation
    return this.maxZoom || 18;
  }
  
  async viewpoint2MercsAsync(viewpoint?: ViewpointArray, size?: Size): Promise<CrossCoordinatesArray> {
    // Convert viewpoint to mercator coordinates
    // This is a simplified implementation
    if (!viewpoint || !viewpoint[0]) {
      // Return proper CrossCoordinatesArray structure with 5 coordinates
      const defaultCoords: Coordinate[] = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
      return [defaultCoords, size || [256, 256]];
    }
    const center = viewpoint[0]; // First element is the center coordinate
    const zoom = viewpoint[1] || this.defZoom();
    const rotation = viewpoint[2] || 0;
    
    // Convert center XY to mercator
    const mercCenter = await this.xy2MercAsync(center as [number, number]);
    
    // Create 5 coordinates (center + 4 corners)
    const radius = Math.pow(2, -zoom) * 128;
    const coords: Coordinate[] = [
      mercCenter,
      [mercCenter[0], mercCenter[1] + radius],
      [mercCenter[0] + radius, mercCenter[1]],
      [mercCenter[0], mercCenter[1] - radius],
      [mercCenter[0] - radius, mercCenter[1]]
    ];
    
    return [coords, size || [256, 256]];
  }
  
  async mercs2ViewpointAsync(mercs: CrossCoordinatesArray): Promise<ViewpointArray> {
    // Convert mercator to viewpoint
    // This is a simplified implementation
    if (mercs && mercs[0] && mercs[0].length > 0) {
      const centerMerc = mercs[0][0]; // First coordinate is the center
      const xy = await this.merc2XyAsync(centerMerc as [number, number]);
      // ViewpointArray is [center, zoom, rotation]
      return [xy, this.defZoom(), 0];
    }
    return [[0, 0], this.defZoom(), 0];
  }
  
  async mercs2SysCoordsAsync_multiLayer(mercs: CrossCoordinatesArray): Promise<(CrossCoordinatesArray | undefined)[]> {
    // Convert mercator coordinates to system coordinates for multiple layers
    // This is a simplified implementation
    const xys = await this.mercs2XysAsync(mercs);
    return [xys];
  }
  
  // Implement abstract methods from mixin
  insideCheckSysCoord(sysCoord: Coordinate): boolean {
    // Check if a coordinate is inside the map bounds
    // For XY system, we assume coordinates are valid if within reasonable bounds
    const [x, y] = sysCoord;
    return x >= 0 && x <= this.width && y >= 0 && y <= this.height;
  }
  
  async merc2XyAsync_ignoreBackground(merc: Coordinate): Promise<Coordinate | void> {
    // Convert mercator to XY ignoring background
    try {
      return await this.merc2XyAsync(merc as [number, number]);
    } catch {
      return undefined;
    }
  }
  
  xy2SysCoord(xy: Coordinate): Coordinate {
    // In MapLibre, system coordinates are the same as XY coordinates
    return xy;
  }
  
  sysCoord2Xy(sysCoord: Coordinate): Coordinate {
    // In MapLibre, system coordinates are the same as XY coordinates
    return sysCoord;
  }
}