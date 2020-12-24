import { NowMap } from "./nowmap";

export class MapboxMap extends NowMap {
  constructor(optOptions: any) {
    const options = optOptions || {};
    super(options);
    this.style = options.style;
    this.mapboxMap = options.mapboxMap;
  }

  static async createAsync(options: any) {
    return new MapboxMap(options);
  }
}
