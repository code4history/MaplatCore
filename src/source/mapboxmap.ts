import { NowMap } from "./nowmap";

export class MapboxMap extends NowMap {
  style = "";
  accessToken = "";
  mapboxMap: any;

  constructor(options: any = {}) {
    super(options);
    this.style = options.style;
    this.mapboxMap = options.mapboxMap;
  }

  static async createAsync(options: any) {
    return new MapboxMap(options);
  }
}
