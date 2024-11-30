/* eslint-disable @typescript-eslint/ban-ts-comment */
import { XYZ } from "ol/source";
import {
  addCommonOptions,
  setCustomFunctionBase,
  setupTileLoadFunction
} from "./mixin";

export class NowMap extends setCustomFunctionBase(XYZ) {
  constructor(options: any = {}) {
    super(addCommonOptions(options));
    if (options.mapID) {
      this.mapID = options.mapID;
    }
    this.initialize(options);
    setupTileLoadFunction(this);
  }
}
