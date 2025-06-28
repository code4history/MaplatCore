 
import { XYZ } from "ol/source";
import {
  addCommonOptions,
  setCustomFunctionBase
} from "./mixin";

export class NowMap extends setCustomFunctionBase(XYZ) {
  constructor(options: any = {}) {
    const processedOptions = addCommonOptions(options);
    super(processedOptions);
    
    if (options.mapID) {
      this.mapID = options.mapID;
    }
    
    // Override tileUrlFunction to debug zoom levels after super() call
    if (options.mapID === 'morioka_ndl_affine') {
      const originalTileUrlFunction = this.getTileUrlFunction();
      this.setTileUrlFunction((tileCoord: any, pixelRatio: number, projection: any) => {
        const url = originalTileUrlFunction(tileCoord, pixelRatio, projection);
        // console.log('TMS tile request:', {
        //   mapID: options.mapID,
        //   tileCoord: tileCoord,
        //   url: url,
        //   z: tileCoord[0]
        // });
        return url;
      });
    }
    
    this.initialize(options);
  }
}
