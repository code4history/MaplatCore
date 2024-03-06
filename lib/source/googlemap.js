import { Google } from "ol/source";
import { setCustomFunction, setCustomInitialize, setupTileLoadFunction } from "./mixin";
import { booleanPointInPolygon, lineIntersect, lineString } from "@turf/turf";
export class GoogleMap extends setCustomFunction(Google) {
    constructor(options = {}) {
        options.mapType = options.googleMapType || "roadmap";
        options.layerTypes = options.googleLayerTypes || [];
        super(options);
        if (options.mapID) {
            this.mapID = options.mapID;
        }
        setCustomInitialize(this, options);
        setupTileLoadFunction(this);
    }
    static async createAsync(options) {
        return new GoogleMap(options);
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
    defZoom() {
        return this.mercZoom;
    }
}
//# sourceMappingURL=googlemap.js.map