/* eslint-disable @typescript-eslint/ban-ts-comment */
import VectorTileSource from 'ol/source/VectorTile';
import { MapboxVectorLayer } from "ol-mapbox-style";
import {
  addCommonOptions,
  setCustomFunctionBase
} from "./mixin";

export class VectorMap extends setCustomFunctionBase(VectorTileSource) {
  constructor(options: any = {}) {
    super(addCommonOptions(options));
    if (options.mapID) {
      this.mapID = options.mapID;
    }
    this.initialize(options);
    console.log("Called!!");
  }

  static async createAsync(options: any): Promise<VectorMap> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const tgtSource = new this(options);

    return new Promise(res => {
      const vectorLayer = new MapboxVectorLayer({
        styleUrl: options.style,
        accessToken: "pk.eyJ1Ijoia29jaGl6dWZhbiIsImEiOiJjbHRnaWhzOW8wd2p4MmtvZDFsOWJiOG40In0.FYTPboTqXKv5a_onOaW1vQ"
      });
      vectorLayer.on("sourceready", async () => {
        const srcSource = vectorLayer.getSource();
        Object.assign(tgtSource, srcSource);
      });
      (tgtSource as any).layer_ = vectorLayer;
      res(tgtSource);
    });
  }
}