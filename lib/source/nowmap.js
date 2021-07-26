import { OSM } from "ol/source";
import { normalizeArg } from "../functions";
import { lineString } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import lineIntersect from "@turf/line-intersect";
import { setCustomFunction, setCustomInitialize, setupTileLoadFunction } from "./mixin";
export class NowMap extends setCustomFunction(OSM) {
    constructor(options = {}) {
        super((options = (() => {
            options = normalizeArg(options);
            if (!options.imageExtension)
                options.imageExtension = "jpg";
            if (options.mapID && !options.url && !options.urls) {
                options.url = options.tms
                    ? `tiles/${options.mapID}/{z}/{x}/{-y}.${options.imageExtension}`
                    : `tiles/${options.mapID}/{z}/{x}/{y}.${options.imageExtension}`;
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
    insideCheckXy(xy) {
        if (!this.envelope)
            return true;
        return booleanPointInPolygon(xy, this.envelope);
    }
    insideCheckSysCoord(histCoords) {
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
    modulateSysCoordInside(histCoords) {
        return this.modulateXyInside(histCoords);
    }
    merc2XyAsync(merc) {
        return Promise.resolve(merc);
    }
    merc2XyAsync_ignoreBackground(merc) {
        return this.merc2XyAsync(merc);
    }
    xy2MercAsync(xy) {
        return Promise.resolve(xy);
    }
    xy2SysCoord(xy) {
        return xy;
    }
    sysCoord2Xy(sysCoord) {
        return sysCoord;
    }
    viewpoint2MercsAsync(viewpoint, size) {
        const sysCoords = this.viewpoint2SysCoords(viewpoint, size);
        const xys = this.sysCoords2Xys(sysCoords);
        return this.xys2MercsAsync(xys);
    }
    mercs2ViewpointAsync(mercs) {
        return this.mercs2XysAsync(mercs).then(xys => {
            const sysCoords = this.xys2SysCoords(xys);
            return this.sysCoords2Viewpoint(sysCoords);
        });
    }
    mercs2SysCoordsAsync_multiLayer(mercs) {
        return Promise.all(mercs[0].map(merc => this.merc2SysCoordAsync(merc))).then(xys => [[xys, mercs[1]]]);
    }
}
//# sourceMappingURL=nowmap.js.map