var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "ol/proj", "../const_ex", "../normalize_pois", "../functions", "@turf/helpers", "@turf/centroid"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setupTileLoadFunction = exports.setCustomInitialize = exports.META_KEYS = exports.setCustomFunction = void 0;
    var proj_1 = require("ol/proj");
    var const_ex_1 = require("../const_ex");
    var normalize_pois_1 = require("../normalize_pois");
    var functions_1 = require("../functions");
    var helpers_1 = require("@turf/helpers");
    var centroid_1 = __importDefault(require("@turf/centroid"));
    function setCustomFunction(Base) {
        var Mixin = (function (_super) {
            __extends(Mixin, _super);
            function Mixin() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.officialTitle = "";
                _this.title = "";
                _this.mapID = "";
                _this.label = "";
                return _this;
            }
            Mixin.prototype.getCacheEnable = function () {
                return !!this.weiwudi;
            };
            Mixin.prototype.getTileCacheStatsAsync = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!this.weiwudi)
                                    return [2, {}];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4, this.weiwudi.stats()];
                            case 2: return [2, _a.sent()];
                            case 3:
                                e_1 = _a.sent();
                                return [2, {}];
                            case 4: return [2];
                        }
                    });
                });
            };
            Mixin.prototype.getTileCacheSizeAsync = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var stats;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, this.getTileCacheStatsAsync()];
                            case 1:
                                stats = _a.sent();
                                return [2, stats.size || 0];
                        }
                    });
                });
            };
            Mixin.prototype.fetchAllTileCacheAsync = function (callback) {
                return __awaiter(this, void 0, void 0, function () {
                    var listner_1, deleteListner_1, e_2;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!this.weiwudi)
                                    return [2];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                listner_1 = function (e) {
                                    callback(e.type, e.detail);
                                };
                                deleteListner_1 = function (e) {
                                    _this.weiwudi.removeEventListener("proceed", listner_1);
                                    _this.weiwudi.removeEventListener("finish", deleteListner_1);
                                    _this.weiwudi.removeEventListener("stop", deleteListner_1);
                                    _this.weiwudi.removeEventListener("canceled", deleteListner_1);
                                    listner_1(e);
                                };
                                this.weiwudi.addEventListener("proceed", listner_1);
                                this.weiwudi.addEventListener("finish", deleteListner_1);
                                this.weiwudi.addEventListener("stop", deleteListner_1);
                                this.weiwudi.addEventListener("canceled", deleteListner_1);
                                return [4, this.weiwudi.fetchAll()];
                            case 2:
                                _a.sent();
                                return [3, 4];
                            case 3:
                                e_2 = _a.sent();
                                return [3, 4];
                            case 4: return [2];
                        }
                    });
                });
            };
            Mixin.prototype.cancelTileCacheAsync = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var e_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!this.weiwudi)
                                    return [2];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4, this.weiwudi.cancel()];
                            case 2:
                                _a.sent();
                                return [3, 4];
                            case 3:
                                e_3 = _a.sent();
                                return [3, 4];
                            case 4: return [2];
                        }
                    });
                });
            };
            Mixin.prototype.clearTileCacheAsync = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var e_4;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!this.weiwudi)
                                    return [2];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4, this.weiwudi.clean()];
                            case 2:
                                _a.sent();
                                return [3, 4];
                            case 3:
                                e_4 = _a.sent();
                                return [3, 4];
                            case 4: return [2];
                        }
                    });
                });
            };
            Mixin.prototype.getMap = function () {
                return this._map;
            };
            Mixin.prototype.setViewpointRadian = function (cond) {
                var _this = this;
                var merc;
                var xy;
                var mercZoom = cond.mercZoom;
                var zoom = cond.zoom;
                var direction = cond.direction;
                var rotation = cond.rotation;
                var map = this._map;
                var view = map === null || map === void 0 ? void 0 : map.getView();
                if (cond.latitude !== undefined && cond.longitude !== undefined) {
                    merc = proj_1.transform([cond.longitude, cond.latitude], "EPSG:4326", "EPSG:3857");
                }
                if (cond.x !== undefined && cond.y != undefined) {
                    xy = [cond.x, cond.y];
                }
                this.viewpoint2MercsAsync()
                    .then(function (mercs) { return _this.mercs2MercViewpoint(mercs); })
                    .then(function (mercViewpoint) {
                    var mercs = _this.mercViewpoint2Mercs([
                        merc || mercViewpoint[0],
                        mercZoom || mercViewpoint[1] || 17,
                        direction !== null ? direction : mercViewpoint[2]
                    ]);
                    _this.mercs2ViewpointAsync(mercs).then(function (viewpoint) {
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
            };
            Mixin.prototype.setViewpoint = function (cond) {
                if (cond.rotation) {
                    cond.rotation = (cond.rotation * Math.PI) / 180;
                }
                if (cond.direction) {
                    cond.direction = (cond.direction * Math.PI) / 180;
                }
                this.setViewpointRadian(cond);
            };
            Mixin.prototype.goHome = function () {
                this.setViewpointRadian({
                    longitude: this.homePosition[0],
                    latitude: this.homePosition[1],
                    mercZoom: this.mercZoom,
                    rotation: 0
                });
            };
            Mixin.prototype.setGPSMarkerAsync = function (position, ignoreMove) {
                var _this = this;
                if (ignoreMove === void 0) { ignoreMove = false; }
                var map = this.getMap();
                var view = map === null || map === void 0 ? void 0 : map.getView();
                if (!position) {
                    return new Promise(function (resolve, _reject) {
                        map === null || map === void 0 ? void 0 : map.setGPSPosition(null);
                        resolve(true);
                    });
                }
                var mercs = this.mercsFromGPSValue(position.lnglat, position.acc);
                return this.mercs2SysCoordsAsync_multiLayer([mercs])
                    .then(function (results) {
                    var hide = !results[0];
                    var xys = hide ? results[1] : results[0];
                    var sub = !hide ? results[1] : null;
                    var pos = { xy: xys[0][0] };
                    if (!_this.insideCheckSysCoord(xys[0][0])) {
                        map === null || map === void 0 ? void 0 : map.handleGPS(false, true);
                        return false;
                    }
                    var news = xys[0].slice(1);
                    pos.rad = news.reduce(function (prev, curr, index) {
                        var ret = prev +
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
                    .catch(function (err) {
                    throw err;
                });
            };
            Mixin.prototype.setGPSMarker = function (position, ignoreMove) {
                if (ignoreMove === void 0) { ignoreMove = false; }
                this.setGPSMarkerAsync(position, ignoreMove).then(function () { });
            };
            Mixin.prototype.mercsFromGPSValue = function (lnglat, acc) {
                var merc = proj_1.transform(lnglat, "EPSG:4326", "EPSG:3857");
                var latrad = (lnglat[1] * Math.PI) / 180;
                var delta = acc / Math.cos(latrad);
                return const_ex_1.MERC_CROSSMATRIX.map(function (xy) { return [
                    xy[0] * delta + merc[0],
                    xy[1] * delta + merc[1]
                ]; });
            };
            Mixin.prototype.rotateMatrix = function (xys, theta) {
                if (theta === undefined) {
                    theta = this._map.getView().getRotation();
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
            Mixin.prototype.resolvePois = function (pois) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = this;
                                return [4, normalize_pois_1.normalizeLayers(pois || [], {
                                        name: this.officialTitle || this.title,
                                        namespace: this.mapID
                                    })];
                            case 1:
                                _a.pois = _b.sent();
                                return [2];
                        }
                    });
                });
            };
            Mixin.prototype.getPoi = function (id) {
                var _this = this;
                var ret = undefined;
                Object.keys(this.pois).map(function (key) {
                    _this.pois[key].pois.map(function (poi, i) {
                        if (poi.id === id) {
                            ret = _this.pois[key].pois[i];
                        }
                    });
                });
                return ret;
            };
            Mixin.prototype.addPoi = function (data, clusterId) {
                if (!clusterId) {
                    clusterId = "main";
                }
                if (this.pois[clusterId]) {
                    data = normalize_pois_1.normalizePoi(data);
                    this.pois[clusterId]["pois"].push(data);
                    normalize_pois_1.addIdToPoi(this.pois, clusterId, {
                        name: this.officialTitle || this.title,
                        namespace: this.mapID
                    });
                    return data.namespaceID;
                }
            };
            Mixin.prototype.removePoi = function (id) {
                var _this = this;
                Object.keys(this.pois).map(function (key) {
                    _this.pois[key].pois.map(function (poi, i) {
                        if (poi.id === id) {
                            delete _this.pois[key].pois[i];
                        }
                    });
                });
            };
            Mixin.prototype.clearPoi = function (clusterId) {
                var _this = this;
                if (!clusterId) {
                    clusterId = "main";
                }
                if (clusterId === "all") {
                    Object.keys(this.pois).map(function (key) {
                        _this.pois[key]["pois"] = [];
                    });
                }
                else if (this.pois[clusterId]) {
                    this.pois[clusterId]["pois"] = [];
                }
            };
            Mixin.prototype.listPoiLayers = function (hideOnly, nonzero) {
                var _this = this;
                if (hideOnly === void 0) { hideOnly = false; }
                if (nonzero === void 0) { nonzero = false; }
                return Object.keys(this.pois)
                    .sort(function (a, b) {
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
                    .map(function (key) { return _this.pois[key]; })
                    .filter(function (layer) {
                    return nonzero
                        ? hideOnly
                            ? layer.pois.length && layer.hide
                            : layer.pois.length
                        : hideOnly
                            ? layer.hide
                            : true;
                });
            };
            Mixin.prototype.getPoiLayer = function (id) {
                return this.pois[id];
            };
            Mixin.prototype.addPoiLayer = function (id, data) {
                if (id === "main")
                    return;
                if (this.pois[id])
                    return;
                this.pois[id] = normalize_pois_1.normalizeLayer(data || [], id, {
                    name: this.officialTitle || this.title,
                    namespace: this.mapID
                });
            };
            Mixin.prototype.removePoiLayer = function (id) {
                if (id === "main")
                    return;
                if (!this.pois[id])
                    return;
                delete this.pois[id];
            };
            Mixin.prototype.merc2SysCoordAsync_ignoreBackground = function (merc) {
                var _this = this;
                return this.merc2XyAsync_ignoreBackground(merc).then(function (xy) {
                    return xy ? _this.xy2SysCoord(xy) : undefined;
                });
            };
            Mixin.prototype.merc2SysCoordAsync = function (merc) {
                var _this = this;
                return this.merc2XyAsync(merc).then(function (xy) {
                    return xy ? _this.xy2SysCoord(xy) : xy;
                });
            };
            Mixin.prototype.sysCoord2MercAsync = function (sysCoord) {
                var xy = this.sysCoord2Xy(sysCoord);
                return this.xy2MercAsync(xy);
            };
            Mixin.prototype.zoom2Radius = function (size, zoom) {
                var _a;
                var radius = Math.floor(Math.min(size[0], size[1]) / 4);
                if (zoom === undefined) {
                    zoom = (_a = this._map) === null || _a === void 0 ? void 0 : _a.getView().getDecimalZoom();
                }
                return (radius * const_ex_1.MERC_MAX) / 128 / Math.pow(2, zoom);
            };
            Mixin.prototype.viewpoint2SysCoords = function (viewpoint, size) {
                return this.mercViewpoint2Mercs(viewpoint, size);
            };
            Mixin.prototype.mercViewpoint2Mercs = function (viewpoint, size) {
                var center = viewpoint ? viewpoint[0] : undefined;
                var zoom = viewpoint ? viewpoint[1] : undefined;
                var rotate = viewpoint ? viewpoint[2] : undefined;
                if (center === undefined) {
                    center = this._map.getView().getCenter();
                }
                if (size === undefined) {
                    size = this._map.getSize();
                }
                var radius = this.zoom2Radius(size, zoom);
                var crossDelta = this.rotateMatrix(const_ex_1.MERC_CROSSMATRIX, rotate);
                var cross = crossDelta.map(function (xy) { return [
                    xy[0] * radius + center[0],
                    xy[1] * radius + center[1]
                ]; });
                return [cross, size];
            };
            Mixin.prototype.sysCoords2Viewpoint = function (sysCoords) {
                return this.mercs2MercViewpoint(sysCoords);
            };
            Mixin.prototype.mercs2MercViewpoint = function (mercs) {
                var center = mercs[0][0];
                var size = mercs[1];
                var nesw = mercs[0].slice(1, 5);
                var neswDelta = nesw.map(function (val) { return [
                    val[0] - center[0],
                    val[1] - center[1]
                ]; });
                var normal = [
                    [0.0, 1.0],
                    [1.0, 0.0],
                    [0.0, -1.0],
                    [-1.0, 0.0]
                ];
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
                if (!size)
                    size = this._map.getSize();
                var radius = Math.floor(Math.min(size[0], size[1]) / 4);
                var zoom = Math.log((radius * const_ex_1.MERC_MAX) / 128 / scale) / Math.log(2);
                return [center, zoom, omega];
            };
            Mixin.prototype.sysCoords2Xys = function (sysCoords) {
                var _this = this;
                return [
                    sysCoords[0].map(function (sysCoord) { return _this.sysCoord2Xy(sysCoord); }),
                    sysCoords[1]
                ];
            };
            Mixin.prototype.xys2SysCoords = function (xys) {
                var _this = this;
                return [xys[0].map(function (xy) { return _this.xy2SysCoord(xy); }), xys[1]];
            };
            Mixin.prototype.mercs2XysAsync = function (mercs) {
                var _this = this;
                return Promise.all(mercs[0].map(function (merc) { return _this.merc2XyAsync(merc); })).then(function (xys) { return [xys, mercs[1]]; });
            };
            Mixin.prototype.xys2MercsAsync = function (xys) {
                var _this = this;
                return Promise.all(xys[0].map(function (xy) { return _this.xy2MercAsync(xy); })).then(function (mercs) { return [mercs, xys[1]]; });
            };
            return Mixin;
        }(Base));
        return Mixin;
    }
    exports.setCustomFunction = setCustomFunction;
    exports.META_KEYS = [
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
    var META_KEYS_OPTION = [
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
    function setCustomInitialize(self, options) {
        var _a;
        options = functions_1.normalizeArg(options);
        self.mapID = options.mapID;
        self.homePosition = options.homePosition;
        self.mercZoom = options.mercZoom;
        self.label = options.label;
        self.maxZoom = options.maxZoom;
        self.minZoom = options.minZoom;
        self.poiTemplate = options.poiTemplate;
        self.poiStyle = options.poiStyle;
        self.iconTemplate = options.iconTemplate;
        self.icon = options.icon;
        self.selectedIcon = options.selectedIcon;
        self.mercatorXShift = options.mercatorXShift;
        self.mercatorYShift = options.mercatorYShift;
        self.weiwudi = options.weiwudi;
        if (options.envelopeLngLats) {
            var lngLats = options.envelopeLngLats;
            var mercs = lngLats.map(function (lnglat) {
                return proj_1.transform(lnglat, "EPSG:4326", "EPSG:3857");
            });
            mercs.push(mercs[0]);
            self.envelope = helpers_1.polygon([mercs]);
            self.centroid = (_a = centroid_1.default(self.envelope).geometry) === null || _a === void 0 ? void 0 : _a.coordinates;
        }
        for (var i = 0; i < exports.META_KEYS.length; i++) {
            var key = exports.META_KEYS[i];
            var option_key = META_KEYS_OPTION[i];
            self[key] = options[option_key] || options[key];
        }
        var thumbWait = options.thumbnail
            ? new Promise(function (resolve) {
                self.thumbnail = options.thumbnail;
                resolve(undefined);
            })
            : new Promise(function (resolve) {
                self.thumbnail = "./tmbs/" + options.mapID + ".jpg";
                fetch(self.thumbnail)
                    .then(function (response) {
                    if (response.ok) {
                        resolve(undefined);
                    }
                    else {
                        self.thumbnail = "./tmbs/" + options.mapID + "_menu.jpg";
                        resolve(undefined);
                    }
                })
                    .catch(function (_error) {
                    self.thumbnail = "./tmbs/" + options.mapID + "_menu.jpg";
                    resolve(undefined);
                });
            }).catch(function (_error) {
                self.thumbnail = "./tmbs/" + (options.mapID || options.sourceID) + "_menu.jpg";
            });
        var poisWait = self.resolvePois(options.pois);
        self.initialWait = Promise.all([poisWait, thumbWait]);
    }
    exports.setCustomInitialize = setCustomInitialize;
    function setupTileLoadFunction(target) {
        var self = target;
        target.setTileLoadFunction((function () {
            var numLoadingTiles = 0;
            var tileLoadFn = self.getTileLoadFunction();
            var tImageLoader = function (_tileCoord, src, tCanv, sx, sy, sw, sh) {
                return new Promise(function (resolve, _reject) {
                    var loader = function (src, fallback) {
                        if (fallback === void 0) { fallback = undefined; }
                        if (numLoadingTiles === 0) {
                        }
                        ++numLoadingTiles;
                        var tImage = document.createElement("img");
                        tImage.crossOrigin = "Anonymous";
                        tImage.onload = tImage.onerror = function () {
                            if (tImage.width && tImage.height) {
                                var ctx = tCanv.getContext("2d");
                                var dx = sx === 0 ? 256 - sw : 0;
                                var dy = sy === 0 ? 256 - sh : 0;
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
                var zoom = tile.tileCoord[0];
                var tileX = tile.tileCoord[1];
                var tileY = tile.tileCoord[2];
                var pixelXShift = Math.round(((self.mercatorXShift || 0) * 128 * Math.pow(2, zoom)) / const_ex_1.MERC_MAX);
                var pixelYShift = Math.round(((self.mercatorYShift || 0) * -128 * Math.pow(2, zoom)) / const_ex_1.MERC_MAX);
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
                var tmp = document.createElement("div");
                tmp.innerHTML = const_ex_1.canvBase;
                var tCanv = tmp.childNodes[0];
                var promises = [
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
                Promise.all(promises.map(function (item) {
                    var url = self.tileUrlFunction(item[0], self.tilePixelRatio_, self.projection_);
                    return tImageLoader(item[0], url, tCanv, item[1], item[2], item[3], item[4]);
                }))
                    .then(function (rets) {
                    var err = rets.reduce(function (prev, ret) { return prev && ret; }, true);
                    if (err) {
                        tile.handleImageError_();
                    }
                    else {
                        var dataUrl = tCanv.toDataURL();
                        var image = tile.getImage();
                        image.crossOrigin = null;
                        tileLoadFn(tile, dataUrl);
                    }
                })
                    .catch(function (_err) {
                    tile.handleImageError_();
                });
            };
        })());
    }
    exports.setupTileLoadFunction = setupTileLoadFunction;
});
//# sourceMappingURL=mixin.js.map