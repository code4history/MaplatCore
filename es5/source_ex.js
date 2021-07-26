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
        define(["require", "exports", "./functions", "weiwudi", "./source/nowmap", "./source/tmsmap", "./source/mapboxmap", "./source/histmap_tin", "whatwg-fetch", "../parts/osm.jpg", "../parts/gsi.jpg", "../parts/gsi_ortho.jpg"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.registerMapToSW = exports.mapSourceFactory = void 0;
    var functions_1 = require("./functions");
    var weiwudi_1 = __importDefault(require("weiwudi"));
    var nowmap_1 = require("./source/nowmap");
    var tmsmap_1 = require("./source/tmsmap");
    var mapboxmap_1 = require("./source/mapboxmap");
    var histmap_tin_1 = require("./source/histmap_tin");
    require("whatwg-fetch");
    var osm_jpg_1 = __importDefault(require("../parts/osm.jpg"));
    var gsi_jpg_1 = __importDefault(require("../parts/gsi.jpg"));
    var gsi_ortho_jpg_1 = __importDefault(require("../parts/gsi_ortho.jpg"));
    var baseDict = {
        osm: {
            mapID: "osm",
            title: {
                ja: "オープンストリートマップ",
                en: "OpenStreetMap"
            },
            label: {
                ja: "OSM(現在)",
                en: "OSM(Now)"
            },
            attr: "©︎ OpenStreetMap contributors",
            maptype: "base",
            thumbnail: osm_jpg_1.default,
            urls: [
                "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
            ]
        },
        gsi: {
            mapID: "gsi",
            title: {
                ja: "地理院地図",
                en: "Geospatial Information Authority of Japan Map"
            },
            label: {
                ja: "地理院地図",
                en: "GSI Map"
            },
            attr: {
                ja: "国土地理院",
                en: "The Geospatial Information Authority of Japan"
            },
            maptype: "base",
            url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
            maxZoom: 18,
            thumbnail: gsi_jpg_1.default
        },
        gsi_ortho: {
            mapID: "gsi_ortho",
            title: {
                ja: "地理院地図オルソ航空写真",
                en: "Geospatial Information Authority of Japan Ortho aerial photo"
            },
            label: {
                ja: "地理院オルソ",
                en: "GSI Ortho"
            },
            attr: {
                ja: "国土地理院",
                en: "The Geospatial Information Authority of Japan"
            },
            maptype: "base",
            url: "https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg",
            maxZoom: 18,
            thumbnail: gsi_ortho_jpg_1.default
        }
    };
    function mapSourceFactory(options, commonOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var targetSrc, _a, obj;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (typeof options === "string") {
                            options = baseDict[options];
                        }
                        options = functions_1.normalizeArg(Object.assign(options, commonOptions));
                        options.label = options.label || options.year;
                        if (!(options.maptype === "base" ||
                            options.maptype === "overlay" ||
                            options.maptype === "mapbox")) return [3, 4];
                        targetSrc = options.maptype === "base"
                            ? nowmap_1.NowMap
                            : options.maptype === "overlay"
                                ? tmsmap_1.TmsMap
                                : mapboxmap_1.MapboxMap;
                        if (targetSrc instanceof tmsmap_1.TmsMap) {
                            if (!options.homePosition)
                                options.homePosition = options.homePos;
                            if (!options.mercZoom)
                                options.mercZoom = options.defZoom;
                        }
                        else {
                            options.homePosition = options.homePos;
                            options.mercZoom = options.defZoom;
                        }
                        delete options.homePos;
                        delete options.defZoom;
                        if (options.zoomRestriction) {
                            options.maxZoom = options.maxZoom || options.mercMaxZoom;
                            options.minZoom = options.minZoom || options.mercMinZoom;
                        }
                        options.zoomRestriction =
                            options.mercMaxZoom =
                                options.mercMinZoom =
                                    undefined;
                        if (options.translator) {
                            options.url = options.translator(options.url);
                        }
                        if (!options.imageExtension)
                            options.imageExtension = "jpg";
                        if (options.mapID && !options.url && !options.urls) {
                            options.url = options.tms
                                ? "tiles/" + options.mapID + "/{z}/{x}/{-y}." + options.imageExtension
                                : "tiles/" + options.mapID + "/{z}/{x}/{y}." + options.imageExtension;
                        }
                        _a = options;
                        return [4, registerMapToSW(options)];
                    case 1:
                        _a.weiwudi = _b.sent();
                        if (options.weiwudi) {
                            options.url = options.weiwudi.url;
                            delete options.urls;
                        }
                        return [4, targetSrc.createAsync(options)];
                    case 2:
                        obj = _b.sent();
                        return [4, obj.initialWait];
                    case 3:
                        _b.sent();
                        return [2, obj];
                    case 4:
                        if (options.noload) {
                            options.mercMaxZoom = options.mercMinZoom = undefined;
                            return [2, new histmap_tin_1.HistMap_tin(options)];
                        }
                        _b.label = 5;
                    case 5: return [2, new Promise(function (resolve, reject) {
                            var url = options.settingFile || "maps/" + options.mapID + ".json";
                            var xhr = new XMLHttpRequest();
                            xhr.open("GET", url, true);
                            xhr.responseType = "json";
                            xhr.onload = function (_e) {
                                return __awaiter(this, void 0, void 0, function () {
                                    var resp, targetSrc, _a, obj, e_1, e_2, _b, obj, e_3, e_4, err_1;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                if (!(this.status === 200 || this.status === 0)) return [3, 22];
                                                _c.label = 1;
                                            case 1:
                                                _c.trys.push([1, 20, , 21]);
                                                resp = this.response;
                                                if (typeof resp != "object")
                                                    resp = JSON.parse(resp);
                                                options = functions_1.normalizeArg(Object.assign(resp, options));
                                                options.label = options.label || resp.year;
                                                if (options.translator) {
                                                    options.url = options.translator(options.url);
                                                }
                                                if (!options.maptype)
                                                    options.maptype = "maplat";
                                                if (!(options.maptype === "base" ||
                                                    options.maptype === "overlay" ||
                                                    options.maptype === "mapbox")) return [3, 11];
                                                targetSrc = options.maptype === "base"
                                                    ? nowmap_1.NowMap
                                                    : options.maptype === "overlay"
                                                        ? tmsmap_1.TmsMap
                                                        : mapboxmap_1.MapboxMap;
                                                if (targetSrc instanceof tmsmap_1.TmsMap) {
                                                    if (!options.homePosition)
                                                        options.homePosition = options.homePos;
                                                    if (!options.mercZoom)
                                                        options.mercZoom = options.defZoom;
                                                }
                                                else {
                                                    options.homePosition = options.homePos;
                                                    options.mercZoom = options.defZoom;
                                                }
                                                delete options.homePos;
                                                delete options.defZoom;
                                                if (options.zoomRestriction) {
                                                    options.maxZoom = options.maxZoom || options.mercMaxZoom;
                                                    options.minZoom = options.minZoom || options.mercMinZoom;
                                                }
                                                options.zoomRestriction =
                                                    options.mercMaxZoom =
                                                        options.mercMinZoom =
                                                            undefined;
                                                _c.label = 2;
                                            case 2:
                                                _c.trys.push([2, 9, , 10]);
                                                if (!options.imageExtension)
                                                    options.imageExtension = "jpg";
                                                if (options.mapID && !options.url && !options.urls) {
                                                    options.url = options.tms
                                                        ? "tiles/" + options.mapID + "/{z}/{x}/{-y}." + options.imageExtension
                                                        : "tiles/" + options.mapID + "/{z}/{x}/{y}." + options.imageExtension;
                                                }
                                                _a = options;
                                                return [4, registerMapToSW(options)];
                                            case 3:
                                                _a.weiwudi = _c.sent();
                                                if (options.weiwudi) {
                                                    options.url = options.weiwudi.url;
                                                    delete options.urls;
                                                }
                                                return [4, targetSrc.createAsync(options)];
                                            case 4:
                                                obj = _c.sent();
                                                _c.label = 5;
                                            case 5:
                                                _c.trys.push([5, 7, , 8]);
                                                return [4, obj.initialWait];
                                            case 6:
                                                _c.sent();
                                                resolve(obj);
                                                return [3, 8];
                                            case 7:
                                                e_1 = _c.sent();
                                                resolve(obj);
                                                return [3, 8];
                                            case 8: return [3, 10];
                                            case 9:
                                                e_2 = _c.sent();
                                                reject(e_2);
                                                return [3, 10];
                                            case 10: return [2];
                                            case 11:
                                                _c.trys.push([11, 18, , 19]);
                                                delete options.homePos;
                                                delete options.defZoom;
                                                if (!options.imageExtension)
                                                    options.imageExtension = "jpg";
                                                if (options.mapID && !options.url && !options.urls) {
                                                    options.url = "tiles/" + options.mapID + "/{z}/{x}/{y}." + options.imageExtension;
                                                }
                                                options.width = options.width || options.compiled.wh[0];
                                                options.height = options.height || options.compiled.wh[1];
                                                _b = options;
                                                return [4, registerMapToSW(options)];
                                            case 12:
                                                _b.weiwudi = _c.sent();
                                                if (options.weiwudi) {
                                                    options.url = options.weiwudi.url;
                                                    delete options.urls;
                                                }
                                                return [4, histmap_tin_1.HistMap_tin.createAsync(options)];
                                            case 13:
                                                obj = _c.sent();
                                                _c.label = 14;
                                            case 14:
                                                _c.trys.push([14, 16, , 17]);
                                                return [4, obj.initialWait];
                                            case 15:
                                                _c.sent();
                                                obj.setupMapParameter(resolve);
                                                return [3, 17];
                                            case 16:
                                                e_3 = _c.sent();
                                                obj.setupMapParameter(resolve);
                                                return [3, 17];
                                            case 17: return [3, 19];
                                            case 18:
                                                e_4 = _c.sent();
                                                reject(e_4);
                                                return [3, 19];
                                            case 19: return [3, 21];
                                            case 20:
                                                err_1 = _c.sent();
                                                reject(err_1);
                                                return [3, 21];
                                            case 21: return [3, 23];
                                            case 22:
                                                reject("Fail to load map json");
                                                _c.label = 23;
                                            case 23: return [2];
                                        }
                                    });
                                });
                            };
                            xhr.send();
                        })];
                }
            });
        });
    }
    exports.mapSourceFactory = mapSourceFactory;
    function registerMapToSW(options) {
        return __awaiter(this, void 0, void 0, function () {
            var setting, lngLats, minMax_1, ret, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setting = {};
                        if (options.maptype === "mapbox" || !options.enableCache)
                            return [2];
                        else if (options.maptype === "base" || options.maptype === "overlay")
                            setting.type = "wmts";
                        else
                            setting.type = "xyz";
                        setting.url = options.urls ? options.urls : options.url;
                        setting.width = options.width;
                        setting.height = options.height;
                        setting.maxZoom = options.maxZoom;
                        setting.minZoom = options.minZoom;
                        lngLats = options.envelopeLngLats;
                        if (lngLats) {
                            minMax_1 = lngLats.reduce(function (prev, curr) {
                                prev[0] = prev[0] > curr[0] ? curr[0] : prev[0];
                                prev[1] = prev[1] < curr[0] ? curr[0] : prev[1];
                                prev[2] = prev[2] > curr[1] ? curr[1] : prev[2];
                                prev[3] = prev[3] < curr[1] ? curr[1] : prev[3];
                                return prev;
                            }, [Infinity, -Infinity, Infinity, -Infinity]);
                            ["minLng", "maxLng", "minLat", "maxLat"].map(function (key, index) {
                                setting[key] = minMax_1[index];
                            });
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, weiwudi_1.default.registerMap(options.mapID, setting)];
                    case 2:
                        ret = _a.sent();
                        return [3, 4];
                    case 3:
                        e_5 = _a.sent();
                        return [3, 4];
                    case 4: return [2, ret];
                }
            });
        });
    }
    exports.registerMapToSW = registerMapToSW;
});
//# sourceMappingURL=source_ex.js.map