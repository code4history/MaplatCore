import { transform } from "ol/proj";
import { canvBase, MERC_CROSSMATRIX, MERC_MAX } from "../const_ex";
import { addIdToPoi, normalizeLayer, normalizeLayers, normalizePoi } from "../normalize_pois";
import { normalizeArg } from "../functions";
import { polygon } from "@turf/helpers";
import centroid from "@turf/centroid";
import { booleanPointInPolygon, lineIntersect, lineString } from "@turf/turf";
export function setCustomFunction(Base) {
    class Mixin extends Base {
        constructor() {
            super(...arguments);
            this.officialTitle = "";
            this.title = "";
            this.mapID = "";
            this.label = "";
            this.homeMarginPixels = 0;
            this.mercatorXShift = 0;
            this.mercatorYShift = 0;
        }
        initialize(options) {
            var _a;
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
            this.icon = options.icon;
            this.selectedIcon = options.selectedIcon;
            this.mercatorXShift = options.mercatorXShift;
            this.mercatorYShift = options.mercatorYShift;
            this.weiwudi = options.weiwudi;
            if (options.envelopeLngLats) {
                const lngLats = options.envelopeLngLats;
                const mercs = lngLats.map((lnglat) => transform(lnglat, "EPSG:4326", "EPSG:3857"));
                mercs.push(mercs[0]);
                this.envelope = polygon([mercs]);
                this.centroid = (_a = centroid(this.envelope).geometry) === null || _a === void 0 ? void 0 : _a.coordinates;
            }
            for (let i = 0; i < META_KEYS.length; i++) {
                const key = META_KEYS[i];
                const option_key = META_KEYS_OPTION[i];
                this.set(key, options[option_key] || options[key]);
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
            setupTileLoadFunction(this);
        }
        static isBasemap() {
            return this.isBasemap_;
        }
        static isWmts() {
            return this.isWmts_;
        }
        static isMapbox() {
            return this.isMapbox_;
        }
        isBasemap() {
            return this.constructor.isBasemap();
        }
        isWmts() {
            return this.constructor.isWmts();
        }
        isMapbox() {
            return this.constructor.isMapbox();
        }
        getCacheEnable() {
            return !!this.weiwudi;
        }
        async getTileCacheStatsAsync() {
            if (!this.weiwudi)
                return {};
            try {
                return await this.weiwudi.stats();
            }
            catch (e) {
                return {};
            }
        }
        async getTileCacheSizeAsync() {
            const stats = await this.getTileCacheStatsAsync();
            return stats.size || 0;
        }
        async fetchAllTileCacheAsync(callback) {
            if (!this.weiwudi)
                return;
            try {
                const listner = (e) => {
                    callback(e.type, e.detail);
                };
                const deleteListner = (e) => {
                    this.weiwudi.removeEventListener("proceed", listner);
                    this.weiwudi.removeEventListener("finish", deleteListner);
                    this.weiwudi.removeEventListener("stop", deleteListner);
                    this.weiwudi.removeEventListener("canceled", deleteListner);
                    listner(e);
                };
                this.weiwudi.addEventListener("proceed", listner);
                this.weiwudi.addEventListener("finish", deleteListner);
                this.weiwudi.addEventListener("stop", deleteListner);
                this.weiwudi.addEventListener("canceled", deleteListner);
                await this.weiwudi.fetchAll();
            }
            catch (e) { }
        }
        async cancelTileCacheAsync() {
            if (!this.weiwudi)
                return;
            try {
                await this.weiwudi.cancel();
            }
            catch (e) { }
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
        setMap(map) {
            this._map = map;
        }
        setViewpointRadian(cond) {
            let merc;
            let xy;
            const mercZoom = cond.mercZoom;
            const zoom = cond.zoom;
            const direction = cond.direction;
            const rotation = cond.rotation;
            const map = this.getMap();
            const view = map === null || map === void 0 ? void 0 : map.getView();
            if (cond.latitude !== undefined && cond.longitude !== undefined) {
                merc = transform([cond.longitude, cond.latitude], "EPSG:4326", "EPSG:3857");
            }
            if (cond.x !== undefined && cond.y != undefined) {
                xy = [cond.x, cond.y];
            }
            this.viewpoint2MercsAsync()
                .then(mercs => this.mercs2MercViewpoint(mercs))
                .then(mercViewpoint => {
                const mercs = this.mercViewpoint2Mercs([
                    merc || mercViewpoint[0],
                    mercZoom || mercViewpoint[1] || 17,
                    direction !== null ? direction : mercViewpoint[2]
                ]);
                this.mercs2ViewpointAsync(mercs).then(viewpoint => {
                    if (merc != null) {
                        view === null || view === void 0 ? void 0 : view.setCenter(viewpoint[0]);
                    }
                    else if (xy != null) {
                        view === null || view === void 0 ? void 0 : view.setCenter(xy);
                    }
                    if (mercZoom != null) {
                        view === null || view === void 0 ? void 0 : view.setZoom(viewpoint[1]);
                    }
                    else if (zoom != null) {
                        view === null || view === void 0 ? void 0 : view.setZoom(zoom);
                    }
                    if (direction != null) {
                        view === null || view === void 0 ? void 0 : view.setRotation(viewpoint[2]);
                    }
                    else if (rotation != null) {
                        view === null || view === void 0 ? void 0 : view.setRotation(rotation);
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
            const ratio = 1;
            const map = this.getMap();
            let div = map.getTarget();
            if (typeof div === "string") {
                div = document.getElementById(div);
            }
            const homeMarginPixels = map.homeMarginPixels;
            const screenSize = [
                (div.clientWidth - homeMarginPixels - 10) * ratio,
                (div.clientHeight - homeMarginPixels - 10) * ratio
            ];
            const options = {
                longitude: this.homePosition[0],
                latitude: this.homePosition[1],
                zoom: this.defZoom(screenSize)
            };
            if (this.getMap().northUp)
                options.direction = 0;
            else
                options.rotation = 0;
            this.setViewpointRadian(options);
        }
        resetRotation() {
            this.setViewpointRadian({ rotation: 0 });
        }
        resetDirection() {
            this.setViewpointRadian({ direction: 0 });
        }
        resetCirculation() {
            if (this.getMap().northUp)
                this.resetDirection();
            else
                this.resetRotation();
        }
        setGPSMarkerAsync(position, ignoreMove = false) {
            const map = this.getMap();
            const view = map === null || map === void 0 ? void 0 : map.getView();
            if (!position) {
                return new Promise((resolve, _reject) => {
                    map === null || map === void 0 ? void 0 : map.setGPSPosition(null);
                    resolve(true);
                });
            }
            const mercs = this.mercsFromGPSValue(position.lnglat, position.acc);
            return this.mercs2SysCoordsAsync_multiLayer([mercs])
                .then(results => {
                const hide = !results[0];
                const xys = hide ? results[1] : results[0];
                const sub = !hide ? results[1] : null;
                const pos = { xy: xys[0][0] };
                if (!this.insideCheckSysCoord(xys[0][0]))
                    return false;
                const news = xys[0].slice(1);
                pos.rad = news.reduce((prev, curr, index) => {
                    const ret = prev +
                        Math.sqrt(Math.pow(curr[0] - pos.xy[0], 2) +
                            Math.pow(curr[1] - pos.xy[1], 2));
                    return index === 3 ? ret / 4.0 : ret;
                }, 0);
                if (!ignoreMove)
                    view === null || view === void 0 ? void 0 : view.setCenter(pos.xy);
                map === null || map === void 0 ? void 0 : map.setGPSPosition(pos, hide ? "hide" : null);
                if (sub) {
                    map === null || map === void 0 ? void 0 : map.setGPSPosition({ xy: sub[0][0] }, "sub");
                }
                return true;
            })
                .catch(err => {
                throw err;
            });
        }
        setGPSMarker(position, ignoreMove = false) {
            this.setGPSMarkerAsync(position, ignoreMove).then(() => { });
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
            if (theta === undefined) {
                theta = this.getMap().getView().getRotation();
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
        async resolvePois(pois) {
            this.pois = await normalizeLayers(pois || [], {
                name: this.officialTitle || this.title,
                namespace: this.mapID
            });
        }
        getPoi(id) {
            let ret = undefined;
            Object.keys(this.pois).map(key => {
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
        clearPoi(clusterId) {
            if (!clusterId) {
                clusterId = "main";
            }
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
        merc2SysCoordAsync_ignoreBackground(merc) {
            return this.merc2XyAsync_ignoreBackground(merc).then(xy => xy ? this.xy2SysCoord(xy) : undefined);
        }
        merc2SysCoordAsync(merc) {
            return this.merc2XyAsync(merc).then(xy => xy ? this.xy2SysCoord(xy) : xy);
        }
        sysCoord2MercAsync(sysCoord) {
            const xy = this.sysCoord2Xy(sysCoord);
            return this.xy2MercAsync(xy);
        }
        zoom2Radius(size, zoom) {
            const radius = Math.floor(Math.min(size[0], size[1]) / 4);
            if (zoom === undefined) {
                zoom = this.getMap().getView().getDecimalZoom();
            }
            return (radius * MERC_MAX) / 128 / Math.pow(2, zoom);
        }
        viewpoint2SysCoords(viewpoint, size) {
            return this.mercViewpoint2Mercs(viewpoint, size);
        }
        mercViewpoint2Mercs(viewpoint, size) {
            let center = viewpoint ? viewpoint[0] : undefined;
            const zoom = viewpoint ? viewpoint[1] : undefined;
            const rotate = viewpoint ? viewpoint[2] : undefined;
            if (center === undefined) {
                center = this.getMap().getView().getCenter();
            }
            if (size === undefined) {
                size = this.getMap().getSize();
            }
            const radius = this.zoom2Radius(size, zoom);
            const crossDelta = this.rotateMatrix(MERC_CROSSMATRIX, rotate);
            const cross = crossDelta.map(xy => [
                xy[0] * radius + center[0],
                xy[1] * radius + center[1]
            ]);
            return [cross, size];
        }
        sysCoords2Viewpoint(sysCoords) {
            return this.mercs2MercViewpoint(sysCoords);
        }
        mercs2MercViewpoint(mercs) {
            const center = mercs[0][0];
            let size = mercs[1];
            const nesw = mercs[0].slice(1, 5);
            const neswDelta = nesw.map(val => [
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
                size = this.getMap().getSize();
            const radius = Math.floor(Math.min(size[0], size[1]) / 4);
            const zoom = Math.log((radius * MERC_MAX) / 128 / scale) / Math.log(2);
            return [center, zoom, omega];
        }
        sysCoords2Xys(sysCoords) {
            return [
                sysCoords[0].map(sysCoord => this.sysCoord2Xy(sysCoord)),
                sysCoords[1]
            ];
        }
        xys2SysCoords(xys) {
            return [xys[0].map(xy => this.xy2SysCoord(xy)), xys[1]];
        }
        mercs2XysAsync(mercs) {
            return Promise.all(mercs[0].map(merc => this.merc2XyAsync(merc))).then(xys => [xys, mercs[1]]);
        }
        xys2MercsAsync(xys) {
            return Promise.all(xys[0].map(xy => this.xy2MercAsync(xy))).then(mercs => [mercs, xys[1]]);
        }
        static async createAsync(options) {
            return new this(options);
        }
    }
    Mixin.isBasemap_ = false;
    Mixin.isWmts_ = true;
    Mixin.isMapbox_ = false;
    return Mixin;
}
export function setCustomFunctionBase(Base) {
    class Mixin extends setCustomFunction(Base) {
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
    Mixin.isBasemap_ = true;
    Mixin.isWmts_ = true;
    return Mixin;
}
export function setCustomFunctionOverlay(Base) {
    class Mixin extends setCustomFunction(Base) {
    }
    return Mixin;
}
export function setCustomFunctionMaplat(Base) {
    class Mixin extends setCustomFunction(Base) {
        constructor() {
            super(...arguments);
            this.width = 0;
            this.height = 0;
            this._maxxy = 0;
        }
        insideCheckXy(xy) {
            return !(xy[0] < 0 ||
                xy[0] > this.width ||
                xy[1] < 0 ||
                xy[1] > this.height);
        }
        insideCheckSysCoord(sysCoord) {
            return this.insideCheckXy(this.sysCoord2Xy(sysCoord));
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
        modulateSysCoordInside(histCoords) {
            const xy = this.sysCoord2Xy(histCoords);
            const ret = this.modulateXyInside(xy);
            return this.xy2SysCoord(ret);
        }
        xy2SysCoord(xy) {
            const sysCoordX = (xy[0] * (2 * MERC_MAX)) / this._maxxy - MERC_MAX;
            const sysCoordY = -1 * ((xy[1] * (2 * MERC_MAX)) / this._maxxy - MERC_MAX);
            return [sysCoordX, sysCoordY];
        }
        sysCoord2Xy(sysCoord) {
            const x = ((sysCoord[0] + MERC_MAX) * this._maxxy) / (2 * MERC_MAX);
            const y = ((-sysCoord[1] + MERC_MAX) * this._maxxy) / (2 * MERC_MAX);
            return [x, y];
        }
        defZoom(screenSize) {
            const screenWidth = screenSize[0];
            const screenHeight = screenSize[1];
            const delZoomOfWidth = Math.log2((screenWidth - 10) / this.width);
            const delZoomOfHeight = Math.log2((screenHeight - 10) / this.height);
            const maxZoom = this.maxZoom;
            let delZoom;
            if (delZoomOfHeight > delZoomOfWidth) {
                delZoom = delZoomOfHeight;
            }
            else {
                delZoom = delZoomOfWidth;
            }
            return maxZoom + delZoom;
        }
    }
    Mixin.isBasemap_ = false;
    Mixin.isWmts_ = false;
    return Mixin;
}
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
export function addCommonOptions(options) {
    options = normalizeArg(options);
    if (!options.imageExtension)
        options.imageExtension = "jpg";
    if (options.mapID && !options.url && !options.urls) {
        options.url = options.tms
            ? `tiles/${options.mapID}/{z}/{x}/{-y}.${options.imageExtension}`
            : `tiles/${options.mapID}/{z}/{x}/{y}.${options.imageExtension}`;
    }
    return options;
}
export function setupTileLoadFunction(target) {
    const self = target;
    target.setTileLoadFunction((function () {
        let numLoadingTiles = 0;
        const tileLoadFn = self.getTileLoadFunction();
        const tImageLoader = function (_tileCoord, src, tCanv, sx, sy, sw, sh) {
            return new Promise((resolve, _reject) => {
                const loader = function (src, fallback = undefined) {
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
                                loader(fallback);
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
        };
        return function (tile, _src) {
            const zoom = tile.tileCoord[0];
            let tileX = tile.tileCoord[1];
            let tileY = tile.tileCoord[2];
            let pixelXShift = Math.round(((self.mercatorXShift || 0) * 128 * Math.pow(2, zoom)) / MERC_MAX);
            let pixelYShift = Math.round(((self.mercatorYShift || 0) * -128 * Math.pow(2, zoom)) / MERC_MAX);
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
                const url = self.tileUrlFunction(item[0], self.tilePixelRatio_, self.projection_);
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
//# sourceMappingURL=mixin.js.map