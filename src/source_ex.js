import { OSM } from 'ol/source';
import { transform } from 'ol/proj';
import { MERC_CROSSMATRIX, MERC_MAX, canvBase } from './const_ex';
import { polygon, point, lineString } from '@turf/helpers';
import centroid from '@turf/centroid';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import lineIntersect from '@turf/line-intersect';
import { Tile } from "ol/layer";

export function setCustomFunction(target) {
    class Mixin extends target {
        spawnLayer(layer) {
            const self = this;
            if (layer) {
                layer.setSource(self);
                return layer;
            }
            layer = new Tile({
                source: self
            });
            layer.set('name', 'base');
            return layer;
        }

        setupTileCacheAsnyc() {
            const self = this;
            return new Promise((resolve) => {
                const openDB = indexedDB.open(`MaplatDB_${self.sourceID}`); // eslint-disable-line no-undef
                openDB.onupgradeneeded = function (event) {
                    const db = event.target.result;
                    db.createObjectStore('tileCache', {keyPath: 'z_x_y'});
                };
                openDB.onsuccess = function (event) {
                    const db = event.target.result;
                    self.cache_db = db;
                    resolve();
                };
                openDB.onerror = function (error) { // eslint-disable-line no-unused-vars
                    self.cache_db = undefined;
                    resolve();
                };
            });
        }

        clearTileCacheAsync(reopen) {
            const self = this;
            return new Promise((resolve, reject) => {
                if (!self.cache_db) {
                    if (reopen) {
                        self.setupTileCacheAsnyc().then(() => {
                            resolve();
                        }).catch((error) => {
                            reject(error);
                        });
                    } else {
                        resolve();
                    }
                    return;
                }
                const db = self.cache_db;
                self.cache_db = undefined;
                const dbName = `MaplatDB_${self.sourceID}`;
                db.close();

                const deleteReq = indexedDB.deleteDatabase(dbName); // eslint-disable-line no-undef

                deleteReq.onsuccess = (event) => { // eslint-disable-line no-unused-vars
                    if (reopen) {
                        self.setupTileCacheAsnyc().then(() => {
                            resolve();
                        }).catch((error) => {
                            reject(error);
                        });
                    } else {
                        resolve();
                    }
                };
                deleteReq.onerror = function (error) {
                    reject(error);
                };
            });
        }

        getTileCacheSizeAsync() {
            const self = this;
            const toSize = function (items) {
                let size = 0;
                for (let i = 0; i < items.length; i++) {
                    const objectSize = JSON.stringify(items[i]).length;
                    size += objectSize;
                }
                return size;
            };

            return new Promise(((resolve, reject) => {
                if (!self.cache_db) {
                    resolve(0);
                    return;
                }
                const db = self.cache_db;
                const tx = db.transaction('tileCache', 'readonly');
                const store = tx.objectStore('tileCache');
                const items = [];
                tx.oncomplete = function (evt) { // eslint-disable-line no-unused-vars
                    const szBytes = toSize(items);
                    resolve(szBytes);
                };
                const cursorRequest = store.openCursor();
                cursorRequest.onerror = function (error) {
                    reject(error);
                };
                cursorRequest.onsuccess = function (evt) {
                    const cursor = evt.target.result;
                    if (cursor) {
                        items.push(cursor.value);
                        cursor.continue();
                    }
                };
            }));
        }

        getMap() {
            return this._map;
        }

        // 経緯度lnglat、メルカトルズームmercZoom、地図ズームzoom、方角direction、地図回転rotation等を指定し地図移動
        setViewpointRadian(cond) {
            const self = this;
            let merc;
            let xy;
            const mercZoom = cond.mercZoom;
            const zoom = cond.zoom;
            const direction = cond.direction;
            const rotation = cond.rotation;
            const map = this._map;
            const view = map.getView();
            if (cond.latitude != null && cond.longitude != null) {
                merc = transform([cond.longitude, cond.latitude], 'EPSG:4326', 'EPSG:3857');
            }
            if (cond.x != null && cond.y != null) {
                xy = [cond.x, cond.y];
            }
            self.size2MercsAsync().then((mercs) => self.mercs2MercSizeAsync(mercs)).then((mercSize) => {
                const mercs = self.mercsFromGivenMercZoom(merc || mercSize[0], mercZoom || mercSize[1],
                    direction != null ? direction : mercSize[2]);
                self.mercs2SizeAsync(mercs).then((size) => {
                    if (merc != null) {
                        view.setCenter(size[0]);
                    } else if (xy != null) {
                        view.setCenter(xy);
                    }
                    if (mercZoom != null) {
                        view.setZoom(size[1]);
                    } else if (zoom != null) {
                        view.setZoom(zoom);
                    }
                    if (direction != null) {
                        view.setRotation(size[2]);
                    } else if (rotation != null) {
                        view.setRotation(rotation);
                    }
                });
            });
        }

        setViewpoint(cond) {
            if (cond.rotation) {
                cond.rotation = cond.rotation * Math.PI / 180;
            }
            if (cond.direction) {
                cond.direction = cond.direction * Math.PI / 180;
            }
            this.setViewpointRadian(cond);
        }

        goHome() {
            this.setViewpointRadian({
                longitude: this.home_position[0],
                latitude: this.home_position[1],
                mercZoom: this.merc_zoom,
                rotation: 0
            });
        }

        setGPSMarkerAsync(position, ignoreMove) {
            const self = this;
            const map = self.getMap();
            const view = map.getView();
            if (!position) {
                return new Promise(((resolve, reject) => { // eslint-disable-line no-unused-vars
                    map.setGPSPosition(null);
                    resolve(true);
                }));
            }
            const mercs = self.mercsFromGPSValue(position.lnglat, position.acc);

            return self.mercs2XysAsync(mercs).then((results) => {
                const hide = !results[0];
                const xys = hide ? results[1] : results[0];
                const sub = !hide ? results[1] : null;
                const pos = {xy: xys[0]};
                if (!self.insideCheckHistMapCoords(xys[0])) {
                    map.handleGPS(false, true);
                    return false;
                }
                const news = xys.slice(1);

                pos.rad = news.reduce((prev, curr, index) => {
                    const ret = prev + Math.sqrt(Math.pow(curr[0] - pos.xy[0], 2) + Math.pow(curr[1] - pos.xy[1], 2));
                    return index == 3 ? ret / 4.0 : ret;
                }, 0);
                if (!ignoreMove) view.setCenter(pos.xy);
                map.setGPSPosition(pos, hide ? 'hide' : null);
                if (sub) {
                    map.setGPSPosition({xy: sub[0]}, 'sub');
                }
                return true;
            }).catch((err) => {
                throw err;
            });
        }

        setGPSMarker(position, ignoreMove) {
            this.setGPSMarkerAsync(position, ignoreMove).then(() => {
            });
        }

        // size(画面サイズ)とズームから、地図面座標上での半径を得る。zoom無指定の場合は自動取得
        getRadius(size, zoom) {
            const radius = Math.floor(Math.min(size[0], size[1]) / 4);
            if (zoom == null) {
                zoom = this._map.getView().getDecimalZoom();
            }
            return radius * MERC_MAX / 128 / Math.pow(2, zoom);
        }

        // メルカトルの中心座標とメルカトルズームから、メルカトル5座標値に変換
        mercsFromGivenMercZoom(center, mercZoom, direction) {
            if (mercZoom == null) {
                mercZoom = 17;
            }
            const size = this._map.getSize();
            const pixel = Math.floor(Math.min(size[0], size[1]) / 4);

            const delta = pixel * MERC_MAX / 128 / Math.pow(2, mercZoom);
            const crossDelta = this.rotateMatrix(MERC_CROSSMATRIX, direction);
            return crossDelta.map((xy) => [xy[0] * delta + center[0], xy[1] * delta + center[1]]);
        }

        mercsFromGPSValue(lnglat, acc) {
            const merc = transform(lnglat, 'EPSG:4326', 'EPSG:3857');
            const latrad = lnglat[1] * Math.PI / 180;
            const delta = acc / Math.cos(latrad);
            return MERC_CROSSMATRIX.map((xy) => [xy[0] * delta + merc[0], xy[1] * delta + merc[1]]);
        }

        // 与えられた差分行列を回転。theta無指定の場合は自動取得
        rotateMatrix(xys, theta) {
            if (theta == null) {
                theta = 1.0 * this._map.getView().getRotation();
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

        // 画面サイズと地図ズームから、地図面座標上での5座標を取得する。zoom, rotate無指定の場合は自動取得
        size2Xys(center, zoom, rotate) {
            if (!center) {
                center = this._map.getView().getCenter();
            }
            const size = this._map.getSize();
            const radius = this.getRadius(size, zoom);
            const crossDelta = this.rotateMatrix(MERC_CROSSMATRIX, rotate);
            const cross = crossDelta.map((xy) => [xy[0] * radius + center[0], xy[1] * radius + center[1]]);
            cross.push(size);
            return cross;
        }

        // 画面サイズと地図ズームから、メルカトル座標上での5座標を取得する。zoom, rotate無指定の場合は自動取得
        size2MercsAsync(center, zoom, rotate) {
            const cross = this.size2Xys(center, zoom, rotate);
            const self = this;
            const promises = cross.map((val, index) => {
                if (index == 5) return val;
                return self.xy2MercAsync(val);
            });
            return Promise.all(promises).catch((err) => {
                throw err;
            });
        }

        // メルカトル5地点情報から地図サイズ情報（中心座標、サイズ、回転）を得る
        mercs2SizeAsync(mercs, asMerc) {
            const self = this;
            const promises = asMerc ? Promise.resolve(mercs) :
                Promise.all(mercs.map((merc, index) => {
                    if (index == 5) return merc;
                    return self.merc2XyAsync(merc);
                }));
            return promises.then((xys) => self.xys2Size(xys)).catch((err) => {
                throw err;
            });
        }

        // メルカトル5地点情報からメルカトル地図でのサイズ情報（中心座標、サイズ、回転）を得る
        mercs2MercSizeAsync(mercs) {
            return this.mercs2SizeAsync(mercs, true);
        }

        // 地図座標5地点情報から地図サイズ情報（中心座標、サイズ、回転）を得る
        xys2Size(xys) {
            const center = xys[0];
            let size = xys[5];
            const nesw = xys.slice(1, 5);
            const neswDelta = nesw.map((val) => [val[0] - center[0], val[1] - center[1]]);
            const normal = [[0.0, 1.0], [1.0, 0.0], [0.0, -1.0], [-1.0, 0.0]];
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

            if (!size) size = this._map.getSize();
            const radius = Math.floor(Math.min(size[0], size[1]) / 4);
            const zoom = Math.log(radius * MERC_MAX / 128 / scale) / Math.log(2);

            return [center, zoom, omega];
        }

        mercs2MercRotation(xys) {
            const center = xys[0];
            const nesw = xys.slice(1, 5);
            const neswDelta = nesw.map((val) => [val[0] - center[0], val[1] - center[1]]);
            const normal = [[0.0, 1.0], [1.0, 0.0], [0.0, -1.0], [-1.0, 0.0]];
            // var abss = 0;
            let cosx = 0;
            let sinx = 0;
            for (let i = 0; i < 4; i++) {
                const delta = neswDelta[i];
                const norm = normal[i];
                const abs = Math.sqrt(Math.pow(delta[0], 2) + Math.pow(delta[1], 2));
                // abss += abs;
                const outer = delta[0] * norm[1] - delta[1] * norm[0];
                const inner = Math.acos((delta[0] * norm[0] + delta[1] * norm[1]) / abs);
                const theta = outer > 0.0 ? -1.0 * inner : inner;
                cosx += Math.cos(theta);
                sinx += Math.sin(theta);
            }
            // var scale = abss / 4.0;
            return Math.atan2(sinx, cosx);
        }

        mercs2XysAsync(mercs) {
            const self = this;
            return Promise.all(mercs.map((merc, index) => {
                if (index == 5) return merc;
                return self.merc2XyAsync(merc);
            })).then((xys) => [xys]);
        }

        resolvePois(pois) {
            const self = this;
            if (!pois) pois = [];
            let promise;
            if (typeof pois == 'string') {
                promise = new Promise(((resolve, reject) => {
                    const url = pois.match(/\//) ? pois : `pois/${pois}`;

                    const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
                    xhr.open('GET', url, true);
                    xhr.responseType = 'json';

                    xhr.onload = function (e) { // eslint-disable-line no-unused-vars
                        if (this.status == 200 || this.status == 0) { // 0 for UIWebView
                            try {
                                let resp = this.response;
                                if (typeof resp != 'object') resp = JSON.parse(resp);
                                self.pois = resp;
                                resolve();
                            } catch (err) {
                                reject(err);
                            }
                        } else {
                            reject('Fail to load poi json');
                        }
                    };
                    xhr.send();
                }));
            } else {
                self.pois = pois;
                promise = Promise.resolve();
            }

            return promise.then(() => {
                if (Array.isArray(self.pois)) {
                    self.pois = {
                        main: {
                            namespace_id: `${self.sourceID}#main`,
                            name: self.officialTitle || self.title,
                            pois: self.pois
                        }
                    };
                    self.addIdToPoi('main');
                } else {
                    if (!self.pois['main']) {
                        self.pois['main'] = {};
                    }
                    Object.keys(self.pois).map((key) => {
                        if (!self.pois[key].name) {
                            if (key == 'main') {
                                self.pois[key].name = self.officialTitle || self.title;
                            } else {
                                self.pois[key].name = key;
                            }
                        }
                        if (!self.pois[key].pois) {
                            self.pois[key].pois = [];
                        }
                        self.pois[key].namespace_id = `${self.sourceID}#${key}`;
                        self.addIdToPoi(key);
                    });
                }
            });
        }

        addIdToPoi(clusterId) {
            const self = this;
            if (!self.pois[clusterId]) return;
            const cluster = self.pois[clusterId];
            const pois = cluster.pois;
            if (!cluster.__nextId) {
                cluster.__nextId = 0;
            }
            pois.map((poi) => {
                if (!poi.id) {
                    poi.id = `${clusterId}_${cluster.__nextId}`;
                    cluster.__nextId++;
                }
                if (!poi.namespace_id) {
                    poi.namespace_id = `${self.sourceID}#${poi.id}`;
                }
            });
        }

        getPoi(id) {
            const self = this;
            let ret;
            Object.keys(self.pois).map((key) => {
                self.pois[key].pois.map((poi, i) => {
                    if (poi.id == id) {
                        ret = self.pois[key].pois[i];
                    }
                });
            });
            return ret;
        }

        addPoi(data, clusterId) {
            if (!clusterId) {
                clusterId = 'main';
            }
            if (this.pois[clusterId]) {
                this.pois[clusterId]['pois'].push(data);
                this.addIdToPoi(clusterId);
                return data.namespace_id;
            }
        }

        removePoi(id) {
            const self = this;
            Object.keys(self.pois).map((key) => {
                self.pois[key].pois.map((poi, i) => {
                    if (poi.id == id) {
                        delete self.pois[key].pois[i];
                    }
                });
            });
        }

        clearPoi(clusterId) {
            const self = this;
            if (!clusterId) {
                clusterId = 'main';
            }
            if (clusterId == 'all') {
                Object.keys(self.pois).map((key) => {
                    self.pois[key]['pois'] = [];
                });
            } else if (self.pois[clusterId]) {
                self.pois[clusterId]['pois'] = [];
            }
        }

        listPoiLayers(hideOnly, nonzero) {
            const self = this;
            return Object.keys(self.pois).sort((a, b) => {
                if (a == 'main') return -1;
                else if (b == 'main') return 1;
                else if (a < b) return -1;
                else if (a > b) return 1;
                else return 0;
            }).map((key) => self.pois[key]).filter((layer) => nonzero ? hideOnly ? layer.pois.length && layer.hide : layer.pois.length : hideOnly ? layer.hide : true);
        }

        getPoiLayer(id) {
            return this.pois[id];
        }

        addPoiLayer(id, data) {
            if (id == 'main') return;
            if (this.pois[id]) return;
            if (!data) {
                data = {
                    namespace_id: `${this.sourceID}#${id}`,
                    name: id,
                    pois: []
                };
            } else {
                if (!data.name) {
                    data.name = id;
                }
                if (!data.pois) {
                    data.pois = [];
                }
                data.namespace_id = `${this.sourceID}#${id}`;
            }
            this.pois[id] = data;
        }

        removePoiLayer(id) {
            if (id == 'main') return;
            if (!this.pois[id]) return;
            delete this.pois[id];
        }
    }
    return Mixin;
}

export const META_KEYS = ['title', 'officialTitle', 'author', 'createdAt', 'era',
    'contributor', 'mapper', 'license', 'dataLicense', 'attr', 'dataAttr',
    'reference', 'description'];

export function setCustomInitialize(self, options) {
    self.sourceID = options.sourceID;
    self.map_option = options.map_option || {};
    self.home_position = options.home_position;
    self.merc_zoom = options.merc_zoom;
    self.thumbnail = options.thumbnail || `./tmbs/${options.mapID || options.sourceID}_menu.jpg`;
    self.label = options.label;
    self.maxZoom = options.maxZoom;
    self.minZoom = options.minZoom;
    if (options.envelopeLngLats || options.envelopLngLats) {
        const lngLats = options.envelopeLngLats || options.envelopLngLats;
        const mercs = lngLats.map((lnglat) => transform(lnglat, 'EPSG:4326', 'EPSG:3857'));
        mercs.push(mercs[0]);
        self.envelope = polygon([mercs]);
        self.centroid = centroid(self.envelope).geometry.coordinates;
    }

    for (let i = 0; i < META_KEYS.length; i++) {
        const key = META_KEYS[i];
        self[key] = options[key];
    }

    const cacheWait = options.cache_enable ? self.setupTileCacheAsnyc() : Promise.resolve();
    const poisWait = self.resolvePois(options.pois);
    self.initialWait = Promise.all([cacheWait, poisWait]);
}

export function setupTileLoadFunction(target) {
    const self = target;
    target.setTileLoadFunction((function() {
        let numLoadingTiles = 0;
        const tileLoadFn = self.getTileLoadFunction();
        const tImageLoader = function(image, tile, src, fallback) {
            let tImage = tile.tImage;
            if (!tImage) {
                tImage = document.createElement('img'); // eslint-disable-line no-undef
                tImage.crossOrigin = 'Anonymous';
                tile.tImage = tImage;
            }
            tImage.onload = tImage.onerror = function() {
                if (tImage.width && tImage.height) {
                    const tmp = document.createElement('div'); // eslint-disable-line no-undef
                    tmp.innerHTML = canvBase;
                    let tCanv = tmp.childNodes[0];
                    let ctx = tCanv.getContext('2d');
                    ctx.drawImage(tImage, 0, 0);
                    const dataUrl = tCanv.toDataURL();
                    image.crossOrigin=null;
                    tileLoadFn(tile, dataUrl);
                    tCanv = tImage = ctx = null;
                    if (self.cache_db) {
                        const db = self.cache_db;
                        const tx = db.transaction(['tileCache'], 'readwrite');
                        const store = tx.objectStore('tileCache');
                        const key = `${tile.tileCoord[0]}-${tile.tileCoord[1]}-${tile.tileCoord[2]}`;
                        const putReq = store.put({
                            'z_x_y': key,
                            'data': dataUrl,
                            'epoch': new Date().getTime()
                        });
                        putReq.onsuccess = function() {
                        };
                        tx.oncomplete = function() {
                        };
                    }
                } else {
                    if (fallback) {
                        tileLoadFn(tile, fallback);
                    } else {
                        tile.handleImageError_();
                    }
                }
                --numLoadingTiles;
                if (numLoadingTiles === 0) {
                    // console.log('idle');
                }
            };
            tImage.src = src;
        };
        return function(tile, src) {
            if (numLoadingTiles === 0) {
                // console.log('loading');
            }
            ++numLoadingTiles;
            const image = tile.getImage();
            if (self.cache_db) {
                const db = self.cache_db;
                const tx = db.transaction(['tileCache'], 'readonly');
                const store = tx.objectStore('tileCache');
                const key = `${tile.tileCoord[0]}-${tile.tileCoord[1]}-${tile.tileCoord[2]}`;
                const getReq = store.get(key);
                getReq.onsuccess = function(event) {
                    const obj = event.target.result;
                    if (!obj) {
                        tImageLoader(image, tile, src);
                    } else {
                        const cachedEpoch = obj.epoch;
                        const nowEpoch = new Date().getTime();
                        if (!cachedEpoch || nowEpoch - cachedEpoch > 86400000) {
                            tImageLoader(image, tile, src, obj.data);
                        } else {
                            const dataUrl = obj.data;
                            image.crossOrigin=null;
                            tileLoadFn(tile, dataUrl);
                        }
                    }
                };
                getReq.onerror = function(event) { // eslint-disable-line no-unused-vars
                    tImageLoader(image, tile, src);
                };
            } else {
                tImageLoader(image, tile, src);
            }
        };
    })());
}

export class NowMap extends setCustomFunction(OSM) {
    constructor(optOptions) {
        const options = optOptions || {};
        if (!options.imageExtention) options.imageExtention = 'jpg';
        if (options.mapID) {
            if (options.mapID != 'osm') {
                options.url = options.url ||
                    (options.tms ? `tiles/${options.mapID}/{z}/{x}/{-y}.${options.imageExtention}` :
                        `tiles/${options.mapID}/{z}/{x}/{y}.${options.imageExtention}`);
            }
        }
        super(options);
        if (options.mapID) {
            this.mapID = options.mapID;
        }
        setCustomInitialize(this, options);
        setupTileLoadFunction(this);
    }

    static createAsync(options) {
        return new Promise(((resolve, reject) => { // eslint-disable-line no-unused-vars
            const obj = new NowMap(options);
            resolve(obj);
        })).catch((err) => { throw err; });
    }

    xy2MercAsync(xy) {
        return new Promise(((resolve, reject) => { // eslint-disable-line no-unused-vars
            resolve(xy);
        })).catch((err) => { throw err; });
    }

    merc2XyAsync(merc) {
        return new Promise(((resolve, reject) => { // eslint-disable-line no-unused-vars
            resolve(merc);
        }));
    }

    insideCheckXy(xy) {
        if (!this.envelope) return true;
        const point_ = point(xy);
        return booleanPointInPolygon(point_, this.envelope);
    }

    insideCheckHistMapCoords(histCoords) {
        return this.insideCheckXy(histCoords);
    }

    modulateXyInside(xy) {
        if (!this.centroid) return xy;
        const expandLine = lineString([xy, this.centroid]);
        const intersect = lineIntersect(this.envelope, expandLine);
        if (intersect.features.length > 0 && intersect.features[0].geometry) {
            return intersect.features[0].geometry.coordinates;
        } else {
            return xy;
        }
    }

    modulateHistMapCoordsInside(histCoords) {
        return this.modulateXyInside(histCoords);
    }
}

export class TmsMap extends NowMap {
    constructor(optOptions) {
        const options = optOptions || {};
        super(options);
    }

    static createAsync(options) {
        const promise = new Promise(((resolve, reject) => { // eslint-disable-line no-unused-vars
            const obj = new TmsMap(options);
            resolve(obj);
        }));
        return promise.catch((err) => { throw err; });
    }
}

export class MapboxMap extends NowMap {
    constructor(optOptions) {
        const options = optOptions || {};
        super(options);
        this.style = options.style;
        this.accessToken = options.accessToken;
    }

    static createAsync(options) {
        const promise = new Promise(((resolve, reject) => { // eslint-disable-line no-unused-vars
            const obj = new MapboxMap(options);
            resolve(obj);
        }));
        return promise.catch((err) => { throw err; });
    }
}

