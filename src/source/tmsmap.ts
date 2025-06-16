import { NowMap } from "./nowmap";

export class TmsMap extends NowMap {
  static isBasemap_ = false;

  constructor(options: any = {}) {
    super(Object.assign(options, { opaque: false }));
  }
}