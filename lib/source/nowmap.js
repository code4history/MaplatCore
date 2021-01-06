import { OSM } from "ol/source";
import { normalizeArg } from "../functions";
import { lineString, point } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import lineIntersect from "@turf/line-intersect";
import { setCustomFunction, setCustomInitialize, setupTileLoadFunction } from "./mixin";
export class NowMap extends setCustomFunction(OSM) {
    constructor(options = {}) {
        super((options = (() => {
            options = normalizeArg(options);
            if (!options.imageExtention)
                options.imageExtention = "jpg";
            if (options.mapID && !options.url && !options.urls) {
                options.url = options.tms
                    ? `tiles/${options.mapID}/{z}/{x}/{-y}.${options.imageExtention}`
                    : `tiles/${options.mapID}/{z}/{x}/{y}.${options.imageExtention}`;
            }
            return options;
        })()));
        if (options.mapID) {
            this.mapID = options.mapID;
        }
        setCustomInitialize(this, options);
        setupTileLoadFunction(this);
    }
    static async createAsync(options) {
        return new NowMap(options);
    }
    xy2MercAsync(xy) {
        return new Promise((resolve, _reject) => {
            resolve(xy);
        });
    }
    merc2XyAsync(merc) {
        return new Promise((resolve, _reject) => {
            resolve(merc);
        });
    }
    insideCheckXy(xy) {
        if (!this.envelope)
            return true;
        const point_ = point(xy);
        return booleanPointInPolygon(point_, this.envelope);
    }
    insideCheckHistMapCoords(histCoords) {
        return this.insideCheckXy(histCoords);
    }
    modulateXyInside(xy) {
        if (!this.centroid)
            return xy;
        const expandLine = lineString([xy, this.centroid]);
        const intersect = lineIntersect(this.envelope, expandLine);
        if (intersect.features.length > 0 && intersect.features[0].geometry) {
            return intersect.features[0].geometry.coordinates;
        }
        else {
            return xy;
        }
    }
    modulateHistMapCoordsInside(histCoords) {
        return this.modulateXyInside(histCoords);
    }
}
//# sourceMappingURL=nowmap.js.map