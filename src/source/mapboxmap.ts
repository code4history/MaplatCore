import { NowMap } from "./nowmap";

export class MapboxMap extends NowMap {
  style = "";
  accessToken = "";
  mapboxMap: any;

  constructor(optOptions: any) {
    super(optOptions || {});
    this.style = optOptions.style;
    this.mapboxMap = optOptions.mapboxMap;
  }

  static async createAsync(options: any) {
    return new MapboxMap(options);
  }
}
