import { NowMap } from "./nowmap";

export class MapboxMap extends NowMap {
  style = "";
  accessToken = "";
  mapboxMap: any;
  static isMapbox_ = true;

  constructor(options: any = {}) {
    super(options);
    this.style = options.style;
    this.mapboxMap = options.mapboxMap;
    this.accessToken = options.accessToken;
  }
}
