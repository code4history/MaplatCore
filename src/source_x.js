export function setCustomFunction(target) {
    target.prototype.setupTileCacheAsnyc = () => {
        const self = this;
        return new Promise(function (resolve) {
            const openDB = indexedDB.open('MaplatDB_' + self.sourceID);
            openDB.onupgradeneeded = function (event) {
                const db = event.target.result;
                db.createObjectStore('tileCache', {keyPath: 'z_x_y'});
            };
            openDB.onsuccess = function (event) {
                const db = event.target.result;
                self.cache_db = db;
                resolve();
            };
            openDB.onerror = function (error) {
                self.cache_db = undefined;
                resolve();
            };
        });
    };

    target.prototype.clearTileCacheAsync = function (reopen) {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (!self.cache_db) {
                if (reopen) {
                    self.setupTileCacheAsnyc().then(function () {
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                } else {
                    resolve();
                }
                return;
            }
            var db = self.cache_db;
            self.cache_db = undefined;
            var dbName = 'MaplatDB_' + self.sourceID;
            db.close();

            var deleteReq = indexedDB.deleteDatabase(dbName);

            deleteReq.onsuccess = function (event) {
                if (reopen) {
                    self.setupTileCacheAsnyc().then(function () {
                        resolve();
                    }).catch(function (error) {
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
    };

    target.prototype.getTileCacheSizeAsync = function () {
        var self = this;
        var toSize = function (items) {
            var size = 0;
            for (var i = 0; i < items.length; i++) {
                var objectSize = JSON.stringify(items[i]).length;
                size += objectSize;
            }
            return size;
        };

        return new Promise(function (resolve, reject) {
            if (!self.cache_db) {
                resolve(0);
                return;
            }
            var db = self.cache_db;
            var tx = db.transaction('tileCache', 'readonly');
            var store = tx.objectStore('tileCache');
            var items = [];
            tx.oncomplete = function (evt) {
                var szBytes = toSize(items);
                resolve(szBytes);
            };
            var cursorRequest = store.openCursor();
            cursorRequest.onerror = function (error) {
                reject(error);
            };
            cursorRequest.onsuccess = function (evt) {
                var cursor = evt.target.result;
                if (cursor) {
                    items.push(cursor.value);
                    cursor.continue();
                }
            };
        });
    };

    target.prototype.getMap = function () {
        return this._map;
    };

    // 経緯度lnglat、メルカトルズームmercZoom、地図ズームzoom、方角direction、地図回転rotation等を指定し地図移動
    target.prototype.setViewpointRadian = function (cond) {
        var self = this;
        var merc;
        var xy;
        var mercZoom = cond.mercZoom;
        var zoom = cond.zoom;
        var direction = cond.direction;
        var rotation = cond.rotation;
        var map = this._map;
        var view = map.getView();
        if (cond.latitude != null && cond.longitude != null) {
            merc = ol.proj.transform([cond.longitude, cond.latitude], 'EPSG:4326', 'EPSG:3857');
        }
        if (cond.x != null && cond.y != null) {
            xy = [cond.x, cond.y];
        }
        self.size2MercsAsync().then(function (mercs) {
            return self.mercs2MercSizeAsync(mercs);
        }).then(function (mercSize) {
            var mercs = self.mercsFromGivenMercZoom(merc || mercSize[0], mercZoom || mercSize[1],
                direction != null ? direction : mercSize[2]);
            self.mercs2SizeAsync(mercs).then(function (size) {
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
    };

    target.prototype.setViewpoint = function (cond) {
        if (cond.rotation) {
            cond.rotation = cond.rotation * Math.PI / 180;
        }
        if (cond.direction) {
            cond.direction = cond.direction * Math.PI / 180;
        }
        this.setViewpointRadian(cond);
    };

    target.prototype.goHome = function () {
        this.setViewpointRadian({
            longitude: this.home_position[0],
            latitude: this.home_position[1],
            mercZoom: this.merc_zoom,
            rotation: 0
        });
    };

    target.prototype.setGPSMarkerAsync = function (position, ignoreMove) {
        var self = this;
        var map = self.getMap();
        var view = map.getView();
        if (!position) {
            return new Promise(function (resolve, reject) {
                map.setGPSPosition(null);
                resolve(true);
            });
        }
        var mercs = self.mercsFromGPSValue(position.lnglat, position.acc);

        return self.mercs2XysAsync(mercs).then(function (results) {
            var hide = !results[0];
            var xys = hide ? results[1] : results[0];
            var sub = !hide ? results[1] : null;
            var pos = {xy: xys[0]};
            if (!self.insideCheckHistMapCoords(xys[0])) {
                map.handleGPS(false, true);
                return false;
            }
            var news = xys.slice(1);

            pos.rad = news.reduce(function (prev, curr, index) {
                var ret = prev + Math.sqrt(Math.pow(curr[0] - pos.xy[0], 2) + Math.pow(curr[1] - pos.xy[1], 2));
                return index == 3 ? ret / 4.0 : ret;
            }, 0);
            if (!ignoreMove) view.setCenter(pos.xy);
            map.setGPSPosition(pos, hide ? 'hide' : null);
            if (sub) {
                map.setGPSPosition({xy: sub[0]}, 'sub');
            }
            return true;
        }).catch(function (err) {
            throw err;
        });
    };

    target.prototype.setGPSMarker = function (position, ignoreMove) {
        this.setGPSMarkerAsync(position, ignoreMove).then(function () {
        });
    };

    // size(画面サイズ)とズームから、地図面座標上での半径を得る。zoom無指定の場合は自動取得
    target.prototype.getRadius = function (size, zoom) {
        var radius = Math.floor(Math.min(size[0], size[1]) / 4);
        if (zoom == null) {
            zoom = this._map.getView().getDecimalZoom();
        }
        return radius * ol.const.MERC_MAX / 128 / Math.pow(2, zoom);
    };

    // メルカトルの中心座標とメルカトルズームから、メルカトル5座標値に変換
    target.prototype.mercsFromGivenMercZoom = function (center, mercZoom, direction) {
        if (mercZoom == null) {
            mercZoom = 17;
        }
        var size = this._map.getSize();
        var pixel = Math.floor(Math.min(size[0], size[1]) / 4);

        var delta = pixel * ol.const.MERC_MAX / 128 / Math.pow(2, mercZoom);
        var crossDelta = this.rotateMatrix(ol.const.MERC_CROSSMATRIX, direction);
        return crossDelta.map(function (xy) {
            return [xy[0] * delta + center[0], xy[1] * delta + center[1]];
        });
    };

    target.prototype.mercsFromGPSValue = function (lnglat, acc) {
        var merc = ol.proj.transform(lnglat, 'EPSG:4326', 'EPSG:3857');
        var latrad = lnglat[1] * Math.PI / 180;
        var delta = acc / Math.cos(latrad);
        return ol.const.MERC_CROSSMATRIX.map(function (xy) {
            return [xy[0] * delta + merc[0], xy[1] * delta + merc[1]];
        });
    };

    // 与えられた差分行列を回転。theta無指定の場合は自動取得
    target.prototype.rotateMatrix = function (xys, theta) {
        if (theta == null) {
            theta = 1.0 * this._map.getView().getRotation();
        }
        var result = [];
        for (var i = 0; i < xys.length; i++) {
            var xy = xys[i];
            var x = xy[0] * Math.cos(theta) - xy[1] * Math.sin(theta);
            var y = xy[0] * Math.sin(theta) + xy[1] * Math.cos(theta);
            result.push([x, y]);
        }
        return result;
    };

    // 画面サイズと地図ズームから、地図面座標上での5座標を取得する。zoom, rotate無指定の場合は自動取得
    target.prototype.size2Xys = function (center, zoom, rotate) {
        if (!center) {
            center = this._map.getView().getCenter();
        }
        var size = this._map.getSize();
        var radius = this.getRadius(size, zoom);
        var crossDelta = this.rotateMatrix(ol.const.MERC_CROSSMATRIX, rotate);
        var cross = crossDelta.map(function (xy) {
            return [xy[0] * radius + center[0], xy[1] * radius + center[1]];
        });
        cross.push(size);
        return cross;
    };

    // 画面サイズと地図ズームから、メルカトル座標上での5座標を取得する。zoom, rotate無指定の場合は自動取得
    target.prototype.size2MercsAsync = function (center, zoom, rotate) {
        var cross = this.size2Xys(center, zoom, rotate);
        var self = this;
        var promises = cross.map(function (val, index) {
            if (index == 5) return val;
            return self.xy2MercAsync(val);
        });
        return Promise.all(promises).catch(function (err) {
            throw err;
        });
    };

    // メルカトル5地点情報から地図サイズ情報（中心座標、サイズ、回転）を得る
    target.prototype.mercs2SizeAsync = function (mercs, asMerc) {
        var self = this;
        var promises = asMerc ? Promise.resolve(mercs) :
            Promise.all(mercs.map(function (merc, index) {
                if (index == 5) return merc;
                return self.merc2XyAsync(merc);
            }));
        return promises.then(function (xys) {
            return self.xys2Size(xys);
        }).catch(function (err) {
            throw err;
        });
    };

    // メルカトル5地点情報からメルカトル地図でのサイズ情報（中心座標、サイズ、回転）を得る
    target.prototype.mercs2MercSizeAsync = function (mercs) {
        return this.mercs2SizeAsync(mercs, true);
    };

    // 地図座標5地点情報から地図サイズ情報（中心座標、サイズ、回転）を得る
    target.prototype.xys2Size = function (xys) {
        var center = xys[0];
        var size = xys[5];
        var nesw = xys.slice(1, 5);
        var neswDelta = nesw.map(function (val) {
            return [val[0] - center[0], val[1] - center[1]];
        });
        var normal = [[0.0, 1.0], [1.0, 0.0], [0.0, -1.0], [-1.0, 0.0]];
        var abss = 0;
        var cosx = 0;
        var sinx = 0;
        for (var i = 0; i < 4; i++) {
            var delta = neswDelta[i];
            var norm = normal[i];
            var abs = Math.sqrt(Math.pow(delta[0], 2) + Math.pow(delta[1], 2));
            abss += abs;
            var outer = delta[0] * norm[1] - delta[1] * norm[0];
            var inner = Math.acos((delta[0] * norm[0] + delta[1] * norm[1]) / abs);
            var theta = outer > 0.0 ? -1.0 * inner : inner;
            cosx += Math.cos(theta);
            sinx += Math.sin(theta);
        }
        var scale = abss / 4.0;
        var omega = Math.atan2(sinx, cosx);

        if (!size) size = this._map.getSize();
        var radius = Math.floor(Math.min(size[0], size[1]) / 4);
        var zoom = Math.log(radius * ol.const.MERC_MAX / 128 / scale) / Math.log(2);

        return [center, zoom, omega];
    };

    target.prototype.mercs2MercRotation = function (xys) {
        var center = xys[0];
        var nesw = xys.slice(1, 5);
        var neswDelta = nesw.map(function (val) {
            return [val[0] - center[0], val[1] - center[1]];
        });
        var normal = [[0.0, 1.0], [1.0, 0.0], [0.0, -1.0], [-1.0, 0.0]];
        // var abss = 0;
        var cosx = 0;
        var sinx = 0;
        for (var i = 0; i < 4; i++) {
            var delta = neswDelta[i];
            var norm = normal[i];
            var abs = Math.sqrt(Math.pow(delta[0], 2) + Math.pow(delta[1], 2));
            // abss += abs;
            var outer = delta[0] * norm[1] - delta[1] * norm[0];
            var inner = Math.acos((delta[0] * norm[0] + delta[1] * norm[1]) / abs);
            var theta = outer > 0.0 ? -1.0 * inner : inner;
            cosx += Math.cos(theta);
            sinx += Math.sin(theta);
        }
        // var scale = abss / 4.0;
        return Math.atan2(sinx, cosx);
    };

    target.prototype.mercs2XysAsync = function (mercs) {
        var self = this;
        return Promise.all(mercs.map(function (merc, index) {
            if (index == 5) return merc;
            return self.merc2XyAsync(merc);
        })).then(function (xys) {
            return [xys];
        });
    };

    target.prototype.resolvePois = function (pois) {
        var self = this;
        if (!pois) pois = [];
        var promise;
        if (typeof pois == 'string') {
            promise = new Promise(function (resolve, reject) {
                var url = pois.match(/\//) ? pois : 'pois/' + pois;

                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.responseType = 'json';

                xhr.onload = function (e) {
                    if (this.status == 200 || this.status == 0) { // 0 for UIWebView
                        try {
                            var resp = this.response;
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
            });
        } else {
            self.pois = pois;
            promise = Promise.resolve();
        }

        return promise.then(function () {
            if (Array.isArray(self.pois)) {
                self.pois = {
                    main: {
                        namespace_id: self.sourceID + '#main',
                        name: self.officialTitle || self.title,
                        pois: self.pois
                    }
                };
                self.addIdToPoi('main');
            } else {
                if (!self.pois['main']) {
                    self.pois['main'] = {};
                }
                Object.keys(self.pois).map(function (key) {
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
                    self.pois[key].namespace_id = self.sourceID + '#' + key;
                    self.addIdToPoi(key);
                });
            }
        });
    };

    target.prototype.addIdToPoi = function (clusterId) {
        var self = this;
        if (!self.pois[clusterId]) return;
        var cluster = self.pois[clusterId];
        var pois = cluster.pois;
        if (!cluster.__nextId) {
            cluster.__nextId = 0;
        }
        pois.map(function (poi) {
            if (!poi.id) {
                poi.id = clusterId + '_' + cluster.__nextId;
                cluster.__nextId++;
            }
            if (!poi.namespace_id) {
                poi.namespace_id = self.sourceID + '#' + poi.id;
            }
        });
    };

    target.prototype.getPoi = function (id) {
        var self = this;
        var ret;
        Object.keys(self.pois).map(function (key) {
            self.pois[key].pois.map(function (poi, i) {
                if (poi.id == id) {
                    ret = self.pois[key].pois[i];
                }
            });
        });
        return ret;
    };

    target.prototype.addPoi = function (data, clusterId) {
        if (!clusterId) {
            clusterId = 'main';
        }
        if (this.pois[clusterId]) {
            this.pois[clusterId]['pois'].push(data);
            this.addIdToPoi(clusterId);
            return data.namespace_id;
        }
    };

    target.prototype.removePoi = function (id) {
        var self = this;
        Object.keys(self.pois).map(function (key) {
            self.pois[key].pois.map(function (poi, i) {
                if (poi.id == id) {
                    delete self.pois[key].pois[i];
                }
            });
        });
    };

    target.prototype.clearPoi = function (clusterId) {
        var self = this;
        if (!clusterId) {
            clusterId = 'main';
        }
        if (clusterId == 'all') {
            Object.keys(self.pois).map(function (key) {
                self.pois[key]['pois'] = [];
            });
        } else if (self.pois[clusterId]) {
            self.pois[clusterId]['pois'] = [];
        }
    };

    target.prototype.listPoiLayers = function (hideOnly, nonzero) {
        var self = this;
        return Object.keys(self.pois).sort(function (a, b) {
            if (a == 'main') return -1;
            else if (b == 'main') return 1;
            else if (a < b) return -1;
            else if (a > b) return 1;
            else return 0;
        }).map(function (key) {
            return self.pois[key];
        }).filter(function (layer) {
            return nonzero ? hideOnly ? layer.pois.length && layer.hide : layer.pois.length : hideOnly ? layer.hide : true;
        });
    };

    target.prototype.getPoiLayer = function (id) {
        return this.pois[id];
    };

    target.prototype.addPoiLayer = function (id, data) {
        if (id == 'main') return;
        if (this.pois[id]) return;
        if (!data) {
            data = {
                namespace_id: this.sourceID + '#' + id,
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
            data.namespace_id = this.sourceID + '#' + id;
        }
        this.pois[id] = data;
    };

    target.prototype.removePoiLayer = function (id) {
        if (id == 'main') return;
        if (!this.pois[id]) return;
        delete this.pois[id];
    };
}

export const META_KEYS = ['title', 'officialTitle', 'author', 'createdAt', 'era',
    'contributor', 'mapper', 'license', 'dataLicense', 'attr', 'dataAttr',
    'reference', 'description'];

