import { NowMap } from "./nowmap";

export class MapLibreMap extends NowMap {
  style = "";
  maplibreMap: any;
  static isMapLibre_ = true;

  constructor(options: any = {}) {
    super(options);
    // Use a more appropriate style for Japan
    this.style = options.style || 'https://tile.openstreetmap.jp/styles/osm-bright/style.json';
    this.maplibreMap = options.maplibreMap;
  }
}