import { normalizeArg } from "../functions";
import { transform } from "ol/proj";
import { polygon } from "@turf/helpers";
import { centroid } from "@turf/turf";
import { canvBase, MERC_CROSSMATRIX, MERC_MAX } from "../const_ex";
import { addIdToPoi, normalizeLayer, normalizeLayers, normalizePoi } from "../normalize_pois";
import "whatwg-fetch";
export const META_KEYS = [
    "title",
    "officialTitle",
    "author",
    "createdAt",
    "era",
    "contributor",
    "mapper",
    "license",
    "dataLicense",
    "attr",
    "dataAttr",
    "reference",
    "description"
];
const META_KEYS_OPTION = [
    "title",
    "official_title",
    "author",
    "created_at",
    "era",
    "contributor",
    "mapper",
    "license",
    "data_license",
    "attr",
    "data_attr",
    "reference",
    "description"
];
export class MaplatSource {
    constructor() {
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
    }
    xy2MercAsync(val) { }
    merc2XyAsync(val, ignoreBackside = false) { }
    insideCheckHistMapCoords(val) {
        return false;
    }
    setTileLoadFunction(func) { }
    getTileLoadFunction() { }
    tileUrlFunction(itemElement, tilePixelRatio_, projection_) { }
    customInitialize(options) {
        options = normalizeArg(options);
        this.mapID = options.mapID;
        this.homePosition = options.homePosition;
        this.mercZoom = options.mercZoom;
        this.label = options.label;
        this.maxZoom = options.maxZoom;
        this.minZoom = options.minZoom;
        this.poiTemplate = options.poiTemplate;
        this.poiStyle = options.poiStyle;
        this.iconTemplate = options.iconTemplate;
        this.mercatorXShift = options.mercatorXShift;
        this.mercatorYShift = options.mercatorYShift;
        this.weiwudi = options.weiwudi;
        if (options.envelopeLngLats) {
            const lngLats = options.envelopeLngLats;
            const mercs = lngLats.map((lnglat) => transform(lnglat, "EPSG:4326", "EPSG:3857"));
            mercs.push(mercs[0]);
            this.envelope = polygon([mercs]);
            this.centroid = centroid(this.envelope).geometry.coordinates;
        }
        for (let i = 0; i < META_KEYS.length; i++) {
            const key = META_KEYS[i];
            const option_key = META_KEYS_OPTION[i];
            this[key] = options[option_key] || options[key];
        }
        const thumbWait = options.thumbnail
            ? new Promise(resolve => {
                this.thumbnail = options.thumbnail;
                resolve(undefined);
            })
            : new Promise(resolve => {
                this.thumbnail = `./tmbs/${options.mapID}.jpg`;
                fetch(this.thumbnail)
                    .then(response => {
                    if (response.ok) {
                        resolve(undefined);
                    }
                    else {
                        this.thumbnail = `./tmbs/${options.mapID}_menu.jpg`;
                        resolve(undefined);
                    }
                })
                    .catch(_error => {
                    this.thumbnail = `./tmbs/${options.mapID}_menu.jpg`;
                    resolve(undefined);
                });
            }).catch(_error => {
                this.thumbnail = `./tmbs/${options.mapID || options.sourceID}_menu.jpg`;
            });
        const poisWait = this.resolvePois(options.pois);
        this.initialWait = Promise.all([poisWait, thumbWait]);
        this.setTileLoadFunction((() => {
            let numLoadingTiles = 0;
            const tileLoadFn = this.getTileLoadFunction();
            const tImageLoader = (_tileCoord, src, tCanv, sx, sy, sw, sh) => new Promise((resolve, _reject) => {
                const loader = function (src, fallback) {
                    if (numLoadingTiles === 0) {
                    }
                    ++numLoadingTiles;
                    const tImage = document.createElement("img");
                    tImage.crossOrigin = "Anonymous";
                    tImage.onload = tImage.onerror = function () {
                        if (tImage.width && tImage.height) {
                            const ctx = tCanv.getContext("2d");
                            const dx = sx === 0 ? 256 - sw : 0;
                            const dy = sy === 0 ? 256 - sh : 0;
                            sw = sx + sw > tImage.width ? tImage.width - sx : sw;
                            sh = sy + sh > tImage.height ? tImage.height - sy : sh;
                            ctx.drawImage(tImage, sx, sy, sw, sh, dx, dy, sw, sh);
                            resolve(undefined);
                        }
                        else {
                            if (fallback) {
                                loader(fallback, null);
                            }
                            else {
                                resolve("tileLoadError");
                            }
                        }
                        --numLoadingTiles;
                        if (numLoadingTiles === 0) {
                        }
                    };
                    tImage.src = src;
                };
                loader(src);
            });
            return (tile, _src) => {
                const zoom = tile.tileCoord[0];
                let tileX = tile.tileCoord[1];
                let tileY = tile.tileCoord[2];
                let pixelXShift = Math.round(((this.mercatorXShift || 0) * 128 * Math.pow(2, zoom)) / MERC_MAX);
                let pixelYShift = Math.round(((this.mercatorYShift || 0) * -128 * Math.pow(2, zoom)) / MERC_MAX);
                while (pixelXShift < 0 || pixelXShift >= 256) {
                    if (pixelXShift < 0) {
                        pixelXShift = pixelXShift + 256;
                        tileX++;
                    }
                    else {
                        pixelXShift = pixelXShift - 256;
                        tileX--;
                    }
                }
                while (pixelYShift < 0 || pixelYShift >= 256) {
                    if (pixelYShift < 0) {
                        pixelYShift = pixelYShift + 256;
                        tileY++;
                    }
                    else {
                        pixelYShift = pixelYShift - 256;
                        tileY--;
                    }
                }
                const tmp = document.createElement("div");
                tmp.innerHTML = canvBase;
                const tCanv = tmp.childNodes[0];
                const promises = [
                    [[zoom, tileX, tileY], 0, 0, 256 - pixelXShift, 256 - pixelYShift]
                ];
                if (pixelXShift !== 0) {
                    promises.push([
                        [zoom, tileX - 1, tileY],
                        256 - pixelXShift,
                        0,
                        pixelXShift,
                        256 - pixelYShift
                    ]);
                }
                if (pixelYShift !== 0) {
                    promises.push([
                        [zoom, tileX, tileY - 1],
                        0,
                        256 - pixelYShift,
                        256 - pixelXShift,
                        pixelYShift
                    ]);
                    if (pixelXShift !== 0) {
                        promises.push([
                            [zoom, tileX - 1, tileY - 1],
                            256 - pixelXShift,
                            256 - pixelYShift,
                            pixelXShift,
                            pixelYShift
                        ]);
                    }
                }
                Promise.all(promises.map(item => {
                    const url = this.tileUrlFunction(item[0], this.tilePixelRatio_, this.projection_);
                    return tImageLoader(item[0], url, tCanv, item[1], item[2], item[3], item[4]);
                }))
                    .then(rets => {
                    const err = rets.reduce((prev, ret) => prev && ret, true);
                    if (err) {
                        tile.handleImageError_();
                    }
                    else {
                        const dataUrl = tCanv.toDataURL();
                        const image = tile.getImage();
                        image.crossOrigin = null;
                        tileLoadFn(tile, dataUrl);
                    }
                })
                    .catch(_err => {
                    tile.handleImageError_();
                });
            };
        })());
    }
    async getTileCacheSizeAsync() {
        if (!this.weiwudi)
            return 0;
        try {
            const stats = await this.weiwudi.stats();
            return stats.size;
        }
        catch (e) {
            return 0;
        }
    }
    async clearTileCacheAsync() {
        if (!this.weiwudi)
            return;
        try {
            await this.weiwudi.clean();
        }
        catch (e) { }
    }
    getMap() {
        return this._map;
    }
    setViewpointRadian(cond) {
        let merc;
        let xy;
        const mercZoom = cond.mercZoom;
        const zoom = cond.zoom;
        const direction = cond.direction;
        const rotation = cond.rotation;
        const map = this._map;
        const view = map.getView();
        if (cond.latitude != null && cond.longitude != null) {
            merc = transform([cond.longitude, cond.latitude], "EPSG:4326", "EPSG:3857");
        }
        if (cond.x != null && cond.y != null) {
            xy = [cond.x, cond.y];
        }
        this.size2MercsAsync()
            .then(mercs => this.mercs2MercSizeAsync(mercs))
            .then(mercSize => {
            const mercs = this.mercsFromGivenMercZoom(merc || mercSize[0], mercZoom || mercSize[1], direction != null ? direction : mercSize[2]);
            this.mercs2SizeAsync(mercs).then(size => {
                if (merc != null) {
                    view.setCenter(size[0]);
                }
                else if (xy != null) {
                    view.setCenter(xy);
                }
                if (mercZoom != null) {
                    view.setZoom(size[1]);
                }
                else if (zoom != null) {
                    view.setZoom(zoom);
                }
                if (direction != null) {
                    view.setRotation(size[2]);
                }
                else if (rotation != null) {
                    view.setRotation(rotation);
                }
            });
        });
    }
    setViewpoint(cond) {
        if (cond.rotation) {
            cond.rotation = (cond.rotation * Math.PI) / 180;
        }
        if (cond.direction) {
            cond.direction = (cond.direction * Math.PI) / 180;
        }
        this.setViewpointRadian(cond);
    }
    goHome() {
        this.setViewpointRadian({
            longitude: this.homePosition[0],
            latitude: this.homePosition[1],
            mercZoom: this.mercZoom,
            rotation: 0
        });
    }
    setGPSMarkerAsync(position, ignoreMove) {
        const map = this.getMap();
        const view = map.getView();
        if (!position) {
            return new Promise((resolve, _reject) => {
                map.setGPSPosition(null);
                resolve(true);
            });
        }
        const mercs = this.mercsFromGPSValue(position.lnglat, position.acc);
        return this.mercs2XysAsync(mercs)
            .then(results => {
            const hide = !results[0];
            const xys = hide ? results[1] : results[0];
            const sub = !hide ? results[1] : null;
            const pos = { xy: xys[0] };
            if (!this.insideCheckHistMapCoords(xys[0])) {
                map.handleGPS(false, true);
                return false;
            }
            const news = xys.slice(1);
            pos.rad = news.reduce((prev, curr, index) => {
                const ret = prev +
                    Math.sqrt(Math.pow(curr[0] - pos.xy[0], 2) +
                        Math.pow(curr[1] - pos.xy[1], 2));
                return index === 3 ? ret / 4.0 : ret;
            }, 0);
            if (!ignoreMove)
                view.setCenter(pos.xy);
            map.setGPSPosition(pos, hide ? "hide" : null);
            if (sub) {
                map.setGPSPosition({ xy: sub[0] }, "sub");
            }
            return true;
        })
            .catch(err => {
            throw err;
        });
    }
    setGPSMarker(position, ignoreMove) {
        this.setGPSMarkerAsync(position, ignoreMove).then(() => { });
    }
    getRadius(size, zoom) {
        const radius = Math.floor(Math.min(size[0], size[1]) / 4);
        if (zoom == null) {
            zoom = this._map.getView().getDecimalZoom();
        }
        return (radius * MERC_MAX) / 128 / Math.pow(2, zoom);
    }
    mercsFromGivenMercZoom(center, mercZoom, direction) {
        if (mercZoom == null) {
            mercZoom = 17;
        }
        const size = this._map.getSize();
        const pixel = Math.floor(Math.min(size[0], size[1]) / 4);
        const delta = (pixel * MERC_MAX) / 128 / Math.pow(2, mercZoom);
        const crossDelta = this.rotateMatrix(MERC_CROSSMATRIX, direction);
        return crossDelta.map(xy => [
            xy[0] * delta + center[0],
            xy[1] * delta + center[1]
        ]);
    }
    mercsFromGPSValue(lnglat, acc) {
        const merc = transform(lnglat, "EPSG:4326", "EPSG:3857");
        const latrad = (lnglat[1] * Math.PI) / 180;
        const delta = acc / Math.cos(latrad);
        return MERC_CROSSMATRIX.map(xy => [
            xy[0] * delta + merc[0],
            xy[1] * delta + merc[1]
        ]);
    }
    rotateMatrix(xys, theta) {
        if (theta == null) {
            theta = this._map.getView().getRotation();
        }
        const result = [];
        for (let i = 0; i < xys.length; i++) {
            const xy = xys[i];
            const x = xy[0] * Math.cos(theta) - xy[1] * Math.sin(theta);
            const y = xy[0] * Math.sin(theta) + xy[1] * Math.cos(theta);
            result.push([x, y]);
        }
        return result;
    }
    size2Xys(center, zoom, rotate) {
        if (!center) {
            center = this._map.getView().getCenter();
        }
        const size = this._map.getSize();
        const radius = this.getRadius(size, zoom);
        const crossDelta = this.rotateMatrix(MERC_CROSSMATRIX, rotate);
        const cross = crossDelta.map(xy => [
            xy[0] * radius + center[0],
            xy[1] * radius + center[1]
        ]);
        cross.push(size);
        return cross;
    }
    size2MercsAsync(center, zoom, rotate) {
        const cross = this.size2Xys(center, zoom, rotate);
        const promises = cross.map((val, index) => {
            if (index === 5)
                return val;
            return this.xy2MercAsync(val);
        });
        return Promise.all(promises).catch(err => {
            throw err;
        });
    }
    mercs2SizeAsync(mercs, asMerc) {
        const promises = asMerc
            ? Promise.resolve(mercs)
            : Promise.all(mercs.map((merc, index) => {
                if (index === 5)
                    return merc;
                return this.merc2XyAsync(merc);
            }));
        return promises
            .then(xys => this.xys2Size(xys))
            .catch(err => {
            throw err;
        });
    }
    mercs2MercSizeAsync(mercs) {
        return this.mercs2SizeAsync(mercs, true);
    }
    xys2Size(xys) {
        const center = xys[0];
        let size = xys[5];
        const nesw = xys.slice(1, 5);
        const neswDelta = nesw.map((val) => [
            val[0] - center[0],
            val[1] - center[1]
        ]);
        const normal = [
            [0.0, 1.0],
            [1.0, 0.0],
            [0.0, -1.0],
            [-1.0, 0.0]
        ];
        let abss = 0;
        let cosx = 0;
        let sinx = 0;
        for (let i = 0; i < 4; i++) {
            const delta = neswDelta[i];
            const norm = normal[i];
            const abs = Math.sqrt(Math.pow(delta[0], 2) + Math.pow(delta[1], 2));
            abss += abs;
            const outer = delta[0] * norm[1] - delta[1] * norm[0];
            const inner = Math.acos((delta[0] * norm[0] + delta[1] * norm[1]) / abs);
            const theta = outer > 0.0 ? -1.0 * inner : inner;
            cosx += Math.cos(theta);
            sinx += Math.sin(theta);
        }
        const scale = abss / 4.0;
        const omega = Math.atan2(sinx, cosx);
        if (!size)
            size = this._map.getSize();
        const radius = Math.floor(Math.min(size[0], size[1]) / 4);
        const zoom = Math.log((radius * MERC_MAX) / 128 / scale) / Math.log(2);
        return [center, zoom, omega];
    }
    mercs2MercRotation(xys) {
        const center = xys[0];
        const nesw = xys.slice(1, 5);
        const neswDelta = nesw.map((val) => [
            val[0] - center[0],
            val[1] - center[1]
        ]);
        const normal = [
            [0.0, 1.0],
            [1.0, 0.0],
            [0.0, -1.0],
            [-1.0, 0.0]
        ];
        let cosx = 0;
        let sinx = 0;
        for (let i = 0; i < 4; i++) {
            const delta = neswDelta[i];
            const norm = normal[i];
            const abs = Math.sqrt(Math.pow(delta[0], 2) + Math.pow(delta[1], 2));
            const outer = delta[0] * norm[1] - delta[1] * norm[0];
            const inner = Math.acos((delta[0] * norm[0] + delta[1] * norm[1]) / abs);
            const theta = outer > 0.0 ? -1.0 * inner : inner;
            cosx += Math.cos(theta);
            sinx += Math.sin(theta);
        }
        return Math.atan2(sinx, cosx);
    }
    mercs2XysAsync(mercs) {
        return Promise.all(mercs.map((merc, index) => {
            if (index === 5)
                return merc;
            return this.merc2XyAsync(merc);
        })).then(xys => [xys]);
    }
    async resolvePois(pois) {
        this.pois = await normalizeLayers(pois || [], {
            name: this.officialTitle || this.title,
            namespace: this.mapID
        });
    }
    getPoi(id) {
        let ret = undefined;
        Object.keys(this.pois).map((key) => {
            this.pois[key].pois.map((poi, i) => {
                if (poi.id === id) {
                    ret = this.pois[key].pois[i];
                }
            });
        });
        return ret;
    }
    addPoi(data, clusterId) {
        if (!clusterId) {
            clusterId = "main";
        }
        if (this.pois[clusterId]) {
            data = normalizePoi(data);
            this.pois[clusterId]["pois"].push(data);
            addIdToPoi(this.pois, clusterId, {
                name: this.officialTitle || this.title,
                namespace: this.mapID
            });
            return data.namespaceID;
        }
    }
    removePoi(id) {
        Object.keys(this.pois).map(key => {
            this.pois[key].pois.map((poi, i) => {
                if (poi.id === id) {
                    delete this.pois[key].pois[i];
                }
            });
        });
    }
    clearPoi(clusterId = "main") {
        if (clusterId === "all") {
            Object.keys(this.pois).map(key => {
                this.pois[key]["pois"] = [];
            });
        }
        else if (this.pois[clusterId]) {
            this.pois[clusterId]["pois"] = [];
        }
    }
    listPoiLayers(hideOnly = false, nonzero = false) {
        return Object.keys(this.pois)
            .sort((a, b) => {
            if (a === "main")
                return -1;
            else if (b === "main")
                return 1;
            else if (a < b)
                return -1;
            else if (a > b)
                return 1;
            else
                return 0;
        })
            .map(key => this.pois[key])
            .filter(layer => nonzero
            ? hideOnly
                ? layer.pois.length && layer.hide
                : layer.pois.length
            : hideOnly
                ? layer.hide
                : true);
    }
    getPoiLayer(id) {
        return this.pois[id];
    }
    addPoiLayer(id, data) {
        if (id === "main")
            return;
        if (this.pois[id])
            return;
        this.pois[id] = normalizeLayer(data || [], id, {
            name: this.officialTitle || this.title,
            namespace: this.mapID
        });
    }
    removePoiLayer(id) {
        if (id === "main")
            return;
        if (!this.pois[id])
            return;
        delete this.pois[id];
    }
}
const ignoreMembers = [
    "xy2MercAsync",
    "merc2XyAsync",
    "insideCheckHistMapCoords",
    "setTileLoadFunction",
    "getTileLoadFunction",
    "tileUrlFunction(itemElement"
];
export function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            if (ignoreMembers.indexOf(name) >= 0)
                return;
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
//# sourceMappingURL=maplatsource.js.map