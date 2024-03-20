/* eslint-disable @typescript-eslint/ban-ts-comment */
import { XYZ } from "ol/source";
import {
  addCommonOptions,
  setCustomFunctionBase,
  setCustomInitialize,
  setupTileLoadFunction
} from "./mixin";

export class NowMap extends setCustomFunctionBase(XYZ) {
  constructor(options: any = {}) {
    super(addCommonOptions(options));
    if (options.mapID) {
      this.mapID = options.mapID;
    }
    setCustomInitialize(this, options);
    setupTileLoadFunction(this);
  }

  static async createAsync(options: any) {
    return new NowMap(options);
  }
}
