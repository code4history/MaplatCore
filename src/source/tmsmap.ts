import { NowMap } from "./nowmap";

export class TmsMap extends NowMap {
  constructor(optOptions: any) {
    const options = optOptions || {};
    options.opaque = false;
    super(options);
  }

  static async createAsync(options: any) {
    return new TmsMap(options);
  }
}
