import { NowMap } from "./nowmap";

export class TmsMap extends NowMap {
  constructor(options: any = {}) {
    super(Object.assign(options, { opaque: false }));
  }

  static async createAsync(options: any) {
    return new TmsMap(options);
  }
}
