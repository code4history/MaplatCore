import { Google } from "ol/source";
import {
  setCustomFunctionBase
} from "./mixin";

export class GoogleMap extends setCustomFunctionBase(Google) {
  constructor(options: any = {}) {
    const parentOptions = Object.assign({}, options);
    parentOptions.mapType = options.maptype.match(/^google_(.+)$/) ? RegExp.$1 : "roadmap";
    parentOptions.layerTypes = (options.layers || []).map((layer: string) => `layer${layer.charAt(0).toUpperCase()}${layer.slice(1).toLowerCase()}`);
    super(parentOptions);

    if (options.mapID) {
      this.mapID = options.mapID;
    }
    this.initialize(options);
  }

  static async createAsync(options: any) {
    return new GoogleMap(options);
  }
}