import { OSM } from "ol/source";
import { normalizeArg } from "../functions";
import { lineString, point } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import lineIntersect from "@turf/line-intersect";
import { MaplatSource, applyMixins } from "./maplatsource";
export class NowMap extends OSM {
    constructor(optOptions) {
        const options = normalizeArg(Object.assign({}, optOptions || {}));
        if (!options.imageExtention)
            options.imageExtention = "jpg";
        if (options.mapID && !options.url && !options.urls) {
            options.url = options.tms
                ? `tiles/${options.mapID}/{z}/{x}/{-y}.${options.imageExtention}`
                : `tiles/${options.mapID}/{z}/{x}/{y}.${options.imageExtention}`;
        }
        super(options);
        this.weiwudi = undefined;
        this._map = undefined;
        this.officialTitle = "";
        this.title = "";
        this.mapID = "";
        this.label = "";
        this.maxZoom = undefined;
        this.minZoom = undefined;
        this.poiTemplate = "";
        this.poiStyle = "";
        this.iconTemplate = "";
        this.mercatorXShift = 0;
        this.mercatorYShift = 0;
        this.initialWait = undefined;
        if (options.mapID) {
            this.mapID = options.mapID;
        }
        this.customInitialize(options);
    }
    static async createAsync(options) {
        return new NowMap(options);
    }
    xy2MercAsync(xy) {
        return new Promise((resolve, _reject) => {
            resolve(xy);
        }).catch(err => {
            throw err;
        });
    }
    merc2XyAsync(merc, _ignoreBackside = false) {
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
    addPoi(data, clusterId) { }
    addPoiLayer(id, data) { }
    clearPoi(clusterId) { }
    async clearTileCacheAsync() {
        return Promise.resolve(undefined);
    }
    customInitialize(options) { }
    getMap() {
        return undefined;
    }
    getPoi(id) { }
    getPoiLayer(id) { }
    getRadius(size, zoom) {
        return 0;
    }
    async getTileCacheSizeAsync() {
        return Promise.resolve(0);
    }
    goHome() { }
    listPoiLayers(hideOnly = false, nonzero = false) {
        return [];
    }
    mercs2MercRotation(xys) {
        return 0;
    }
    mercs2MercSizeAsync(mercs) { }
    mercs2SizeAsync(mercs, asMerc) { }
    mercs2XysAsync(mercs) { }
    mercsFromGPSValue(lnglat, acc) { }
    mercsFromGivenMercZoom(center, mercZoom, direction) { }
    removePoi(id) { }
    removePoiLayer(id) { }
    async resolvePois(pois) {
        return Promise.resolve(undefined);
    }
    rotateMatrix(xys, theta) { }
    setGPSMarker(position, ignoreMove) { }
    setGPSMarkerAsync(position, ignoreMove) { }
    setViewpoint(cond) { }
    setViewpointRadian(cond) { }
    size2MercsAsync(center, zoom, rotate) { }
    size2Xys(center, zoom, rotate) { }
    xys2Size(xys) { }
}
applyMixins(NowMap, [MaplatSource]);
//# sourceMappingURL=nowmap.js.map