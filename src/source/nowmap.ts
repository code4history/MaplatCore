/* eslint-disable @typescript-eslint/ban-ts-comment */
import { XYZ } from "ol/source";
import { normalizeArg } from "../functions";
import {
  setCustomFunctionBase,
  setCustomInitialize,
  setupTileLoadFunction
} from "./mixin";

export class NowMap extends setCustomFunctionBase(XYZ) {
  constructor(options: any = {}) {
    super(
      (options = (() => {
        options = normalizeArg(options);
        if (!options.imageExtension) options.imageExtension = "jpg";
        if (options.mapID && !options.url && !options.urls) {
          options.url = options.tms
            ? `tiles/${options.mapID}/{z}/{x}/{-y}.${options.imageExtension}`
            : `tiles/${options.mapID}/{z}/{x}/{y}.${options.imageExtension}`;
        }
        return options;
      })() as any)
    );

    super(options);
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
