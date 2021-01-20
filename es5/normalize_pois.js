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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.addIdToPoi = exports.normalizePoi = exports.normalizeLayer = exports.normalizeLayers = exports.nodesLoader = void 0;
    function nodesLoader(nodes) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (typeof nodes === "string") {
                    return [2, new Promise(function (resolve, reject) {
                            var url = nodes.match(/\//) ? nodes : "pois/" + nodes;
                            var xhr = new XMLHttpRequest();
                            xhr.open("GET", url, true);
                            xhr.responseType = "json";
                            xhr.onload = function (_e) {
                                if (this.status == 200 || this.status == 0) {
                                    try {
                                        var resp = this.response;
                                        if (typeof resp === "string")
                                            resp = JSON.parse(resp);
                                        resolve(resp);
                                    }
                                    catch (err) {
                                        reject(err);
                                    }
                                }
                                else {
                                    reject("Fail to load poi json");
                                }
                            };
                            xhr.send();
                        })];
                }
                else {
                    return [2, nodes];
                }
                return [2];
            });
        });
    }
    exports.nodesLoader = nodesLoader;
    function normalizeLayers(layers, options) {
        return __awaiter(this, void 0, void 0, function () {
            var key;
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, nodesLoader(layers)];
                    case 1:
                        layers = _b.sent();
                        if (!Array.isArray(layers)) return [3, 3];
                        return [4, Promise.all(layers.map(function (x) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, nodesLoader(x)];
                                    case 1: return [2, _a.sent()];
                                }
                            }); }); }))];
                    case 2:
                        layers = _b.sent();
                        if (layers.length > 0 && layers[0].type === "FeatureCollection") {
                            layers = layers.reduce(function (prev, layer, index) {
                                var key = layer.id || (layer.properties && layer.properties.id);
                                if (!key) {
                                    if (index === 0)
                                        key = "main";
                                    else
                                        throw "POI layers include bad key setting";
                                }
                                prev[key] = normalizeLayer(layer, key, options);
                                return prev;
                            }, {});
                        }
                        else {
                            layers = {
                                main: normalizeLayer(layers, "main", options)
                            };
                        }
                        return [3, 4];
                    case 3:
                        if (layers.type === "FeatureCollection") {
                            key = layers.id || (layers.properties && layers.properties.id) || "main";
                            layers = (_a = {}, _a[key] = normalizeLayer(layers, key, options), _a);
                        }
                        else {
                            Object.keys(layers).map(function (key) {
                                layers[key] = normalizeLayer(layers[key], key, options);
                            });
                        }
                        _b.label = 4;
                    case 4:
                        if (!layers["main"]) {
                            layers["main"] = normalizeLayer([], "main", options);
                        }
                        Object.keys(layers).map(function (key) {
                            addIdToPoi(layers, key, options);
                        });
                        return [2, layers];
                }
            });
        });
    }
    exports.normalizeLayers = normalizeLayers;
    function normalizeLayer(layer, key, options) {
        if (Array.isArray(layer)) {
            layer = {
                pois: layer.map(function (x) { return normalizePoi(x); })
            };
        }
        else if (layer.type === "FeatureCollection") {
            var buffer = Object.assign({}, layer.properties || {});
            if (layer.name)
                buffer.name = layer.name;
            buffer.pois = layer.features.map(function (x) { return normalizePoi(x); });
            layer = buffer;
        }
        if (typeof layer.id === "undefined") {
            layer.id = key;
        }
        else {
            if (layer.id !== key)
                throw "POI layers include bad key setting";
        }
        if (!layer.namespaceID)
            layer.namespaceID = "" + (options.namespace ? options.namespace + "#" : "") + key;
        if (!layer.name)
            layer.name = key === "main" ? options.name : key;
        if (!layer.pois)
            layer.pois = [];
        return layer;
    }
    exports.normalizeLayer = normalizeLayer;
    function normalizePoi(poi) {
        if (poi.type === "Feature") {
            var buffer = Object.assign({}, poi.properties || {});
            buffer.lnglat = poi.geometry.coordinates;
            if (!buffer.id)
                buffer.id = poi.id;
            if (!buffer.name)
                buffer.name = poi.name;
            poi = buffer;
        }
        if (!poi.lnglat)
            poi.lnglat = [poi.lng || poi.longitude, poi.lat || poi.latitude];
        delete poi.lng;
        delete poi.lat;
        delete poi.longitude;
        delete poi.latitude;
        return poi;
    }
    exports.normalizePoi = normalizePoi;
    function addIdToPoi(layers, key, options) {
        if (!layers[key])
            return;
        var cluster = layers[key];
        var pois = cluster.pois;
        if (!cluster.__nextId) {
            cluster.__nextId = 0;
        }
        pois.map(function (poi) {
            if (!poi.id) {
                poi.id = key + "_" + cluster.__nextId;
                cluster.__nextId++;
            }
            if (!poi.namespaceID) {
                poi.namespaceID = "" + (options.namespace ? options.namespace + "#" : "") + poi.id;
            }
        });
    }
    exports.addIdToPoi = addIdToPoi;
});
//# sourceMappingURL=normalize_pois.js.map