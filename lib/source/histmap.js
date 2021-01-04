import { addCoordinateTransforms, addProjection, Projection } from "ol/proj";
import { MERC_MAX, tileSize, transPng } from "../const_ex";
import { MaplatSource, applyMixins } from "./maplatsource";
import { XYZ } from "ol/source";
import { normalizeArg } from "../functions";
import { createFromTemplates, expandUrl } from "ol/tileurlfunction";
for (let z = 0; z < 9; z++) {
    const key = `ZOOM:${z}`;
    const maxxy = 256 * Math.pow(2, z);
    (function (key, maxxy) {
        const projection = new Projection({
            code: key,
            extent: [0.0, 0.0, maxxy, maxxy],
            units: "m"
        });
        addProjection(projection);
        addCoordinateTransforms("EPSG:3857", projection, coordinate => {
            const x = ((coordinate[0] + MERC_MAX) * maxxy) / (2 * MERC_MAX);
            const y = ((-coordinate[1] + MERC_MAX) * maxxy) / (2 * MERC_MAX);
            return [x, y];
        }, coordinate => {
            const x = (coordinate[0] * (2 * MERC_MAX)) / maxxy - MERC_MAX;
            const y = -1 * ((coordinate[1] * (2 * MERC_MAX)) / maxxy - MERC_MAX);
            return [x, y];
        });
    })(key, maxxy);
}
export class HistMap extends XYZ {
    constructor(optOptions) {
        const options = normalizeArg(Object.assign({}, optOptions || {}));
        options.wrapX = false;
        if (!options.imageExtention)
            options.imageExtention = "jpg";
        if (options.mapID && !options.url && !options.urls) {
            options.url = `tiles/${options.mapID}/{z}/{x}/{y}.${options.imageExtention}`;
        }
        const zW = Math.log2(options.width / tileSize);
        const zH = Math.log2(options.height / tileSize);
        options.maxZoom = Math.ceil(Math.max(zW, zH));
        options.tileUrlFunction =
            options.tileUrlFunction ||
                function (coord) {
                    const z = coord[0];
                    const x = coord[1];
                    const y = coord[2];
                    if (x * tileSize * Math.pow(2, this.maxZoom - z) >= this.width ||
                        y * tileSize * Math.pow(2, this.maxZoom - z) >= this.height ||
                        x < 0 ||
                        y < 0) {
                        return transPng;
                    }
                    return this._tileUrlFunction(coord);
                };
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
        if (options.urls) {
            this._tileUrlFunction = createFromTemplates(options.urls);
        }
        else if (options.url) {
            this._tileUrlFunction = createFromTemplates(expandUrl(options.url));
        }
        this.width = options.width;
        this.height = options.height;
        this.maxZoom = options.maxZoom;
        this._maxxy = Math.pow(2, this.maxZoom) * tileSize;
        this.customInitialize(options);
    }
    histMapCoords2Xy(histCoords) {
        const x = ((histCoords[0] + MERC_MAX) * this._maxxy) / (2 * MERC_MAX);
        const y = ((-histCoords[1] + MERC_MAX) * this._maxxy) / (2 * MERC_MAX);
        return [x, y];
    }
    xy2HistMapCoords(xy) {
        const histX = (xy[0] * (2 * MERC_MAX)) / this._maxxy - MERC_MAX;
        const histY = -1 * ((xy[1] * (2 * MERC_MAX)) / this._maxxy - MERC_MAX);
        return [histX, histY];
    }
    insideCheckXy(xy) {
        return !(xy[0] < 0 ||
            xy[0] > this.width ||
            xy[1] < 0 ||
            xy[1] > this.height);
    }
    insideCheckHistMapCoords(histCoords) {
        return this.insideCheckXy(this.histMapCoords2Xy(histCoords));
    }
    modulateXyInside(xy) {
        const dx = xy[0] / (this.width / 2) - 1;
        const dy = xy[1] / (this.height / 2) - 1;
        const da = Math.max(Math.abs(dx), Math.abs(dy));
        return [
            ((dx / da + 1) * this.width) / 2,
            ((dy / da + 1) * this.height) / 2
        ];
    }
    modulateHistMapCoordsInside(histCoords) {
        const xy = this.histMapCoords2Xy(histCoords);
        const ret = this.modulateXyInside(xy);
        return this.xy2HistMapCoords(ret);
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
    merc2XyAsync(val, ignoreBackside = false) { }
    xy2MercAsync(val) { }
}
applyMixins(HistMap, [MaplatSource]);
//# sourceMappingURL=histmap.js.map