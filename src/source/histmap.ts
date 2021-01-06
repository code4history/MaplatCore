/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-expect-error ts-migrate(2459) FIXME: Module '"../../node_modules/@types/ol/proj"' decla... Remove this comment to see the full error message
import { addCoordinateTransforms, addProjection, Projection } from "ol/proj";
import { MERC_MAX, tileSize, transPng } from "../const_ex";
import {
  setCustomFunction,
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

export abstract class HistMap extends setCustomFunction(XYZ) {
  width: number;
  height: number;
  _maxxy: number;

  constructor(options: any = {}) {
    super(
      (options = (() => {
        options = normalizeArg(options);

        options.wrapX = false;
        if (!options.imageExtention) options.imageExtention = "jpg";
        if (options.mapID && !options.url && !options.urls) {
          options.url = `tiles/${options.mapID}/{z}/{x}/{y}.${options.imageExtention}`;
        }

        const zW = Math.log2(options.width / tileSize);
        const zH = Math.log2(options.height / tileSize);
        options.maxZoom = Math.ceil(Math.max(zW, zH));

        options.tileUrlFunction =
          options.tileUrlFunction ||
          function (coord: any) {
            const z = coord[0];
            const x = coord[1];
            const y = coord[2];
            if (
              // @ts-expect-error ts-migrate(2683)
              x * tileSize * Math.pow(2, this.maxZoom - z) >= this.width ||
              // @ts-expect-error ts-migrate(2683)
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

  histMapCoords2Xy(histCoords: any) {
    const x = ((histCoords[0] + MERC_MAX) * this._maxxy) / (2 * MERC_MAX);
    const y = ((-histCoords[1] + MERC_MAX) * this._maxxy) / (2 * MERC_MAX);
    return [x, y];
  }

  xy2HistMapCoords(xy: any) {
    const histX = (xy[0] * (2 * MERC_MAX)) / this._maxxy - MERC_MAX;
    const histY = -1 * ((xy[1] * (2 * MERC_MAX)) / this._maxxy - MERC_MAX);
    return [histX, histY];
  }

  insideCheckXy(xy: any) {
    return !(
      xy[0] < 0 ||
      xy[0] > this.width ||
      xy[1] < 0 ||
      xy[1] > this.height
    );
  }

  insideCheckHistMapCoords(histCoords: any) {
    return this.insideCheckXy(this.histMapCoords2Xy(histCoords));
  }

  modulateXyInside(xy: any) {
    const dx = xy[0] / (this.width / 2) - 1;
    const dy = xy[1] / (this.height / 2) - 1;
    const da = Math.max(Math.abs(dx), Math.abs(dy));
    return [
      ((dx / da + 1) * this.width) / 2,
      ((dy / da + 1) * this.height) / 2
    ];
  }

  modulateHistMapCoordsInside(histCoords: any) {
    const xy = this.histMapCoords2Xy(histCoords);
    const ret = this.modulateXyInside(xy);
    return this.xy2HistMapCoords(ret);
  }
}
