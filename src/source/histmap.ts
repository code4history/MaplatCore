/* eslint-disable @typescript-eslint/ban-ts-comment */
import { addCoordinateTransforms, addProjection, Projection } from "ol/proj";
import { MERC_MAX, tileSize, transPng } from "../const_ex";
import {
  setCustomFunctionMaplat,
  setCustomInitialize,
  setupTileLoadFunction
} from "./mixin";
import { XYZ } from "ol/source";
import { normalizeArg } from "../functions";
import { createFromTemplates, expandUrl } from "ol/tileurlfunction";

for (let z = 0; z < 9; z++) {
  const key = `ZOOM:${z}`;
  const maxxy = 256 * Math.pow(2, z);

  (function (key, maxxy) {
    const projection = new Projection({
      code: key,
      // The extent is used to determine zoom level 0. Recommended values for a
      // projection's validity extent can be found at https://epsg.io/.
      extent: [0.0, 0.0, maxxy, maxxy],
      units: "m"
    });
    addProjection(projection);

    // We also declare EPSG:21781/EPSG:4326 transform functions. These functions
    // are necessary for the ScaleLine control and when calling ol.proj.transform
    // for setting the view's initial center (see below).

    addCoordinateTransforms(
      "EPSG:3857",
      projection,
      coordinate => {
        const x = ((coordinate[0] + MERC_MAX) * maxxy) / (2 * MERC_MAX);
        const y = ((-coordinate[1] + MERC_MAX) * maxxy) / (2 * MERC_MAX);
        return [x, y];
      },
      coordinate => {
        const x = (coordinate[0] * (2 * MERC_MAX)) / maxxy - MERC_MAX;
        const y = -1 * ((coordinate[1] * (2 * MERC_MAX)) / maxxy - MERC_MAX);
        return [x, y];
      }
    );
  })(key, maxxy);
}

// eslint-disable-next-line @typescript-eslint/ban-types
/*type Constructor<T = {}> = new (...args: any[]) => T;

export function setCustomFunctionForHistmap<TBase extends Constructor>(Base: TBase) {
  abstract class HistMapMixin extends setCustomFunction(Base) {

  }
  return HistMapMixin;
}

export function setCustomInitializeForHistmap(self: any, options: any) {

  setCustomInitialize(this, options);
  setupTileLoadFunction(this);
}*/

export abstract class HistMap extends setCustomFunctionMaplat(XYZ) {
  constructor(options: any = {}) {
    super(
      (options = (() => {
        options = normalizeArg(options);

        options.wrapX = false;
        if (!options.imageExtension) options.imageExtension = "jpg";
        if (options.mapID && !options.url && !options.urls) {
          options.url = `tiles/${options.mapID}/{z}/{x}/{y}.${options.imageExtension}`;
        }

        const zW = Math.log2(options.width / tileSize);
        const zH = Math.log2(options.height / tileSize);
        options.maxZoom = Math.ceil(Math.max(zW, zH));

        options.tileUrlFunction =
          options.tileUrlFunction ||
          function (this: HistMap, coord: any) {
            const z = coord[0];
            const x = coord[1];
            const y = coord[2];
            if (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              x * tileSize * Math.pow(2, this.maxZoom - z) >= this.width ||
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              y * tileSize * Math.pow(2, this.maxZoom - z) >= this.height ||
              x < 0 ||
              y < 0
            ) {
              return transPng;
            }
            // @ts-expect-error ts-migrate(2683)
            return this._tileUrlFunction(coord);
          };
        return options;
      })() as any)
    );

    if (options.mapID) {
      this.mapID = options.mapID;
    }
    if (options.urls) {
      // @ts-expect-error ts-migrate(2554)
      this._tileUrlFunction = createFromTemplates(options.urls);
    } else if (options.url) {
      // @ts-expect-error ts-migrate(2554)
      this._tileUrlFunction = createFromTemplates(expandUrl(options.url));
    }

    this.width = options.width;
    this.height = options.height;
    this.maxZoom = options.maxZoom;
    this._maxxy = Math.pow(2, this.maxZoom as number) * tileSize;

    setCustomInitialize(this, options);
    setupTileLoadFunction(this);
  }
}
