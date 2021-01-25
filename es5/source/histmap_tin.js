var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
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
        define(["require", "exports", "./histmap", "ol/proj", "ol/proj/Projection", "../proj_ex", "@turf/helpers", "@turf/boolean-point-in-polygon", "../const_ex", "./store_handler"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HistMap_tin = void 0;
    var histmap_1 = require("./histmap");
    var proj_1 = require("ol/proj");
    var Projection_1 = __importDefault(require("ol/proj/Projection"));
    var proj_ex_1 = require("../proj_ex");
    var helpers_1 = require("@turf/helpers");
    var boolean_point_in_polygon_1 = __importDefault(require("@turf/boolean-point-in-polygon"));
    var const_ex_1 = require("../const_ex");
    var store_handler_1 = require("./store_handler");
    var HistMap_tin = (function (_super) {
        __extends(HistMap_tin, _super);
        function HistMap_tin(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, options) || this;
            _this.tins = [];
            return _this;
        }
        HistMap_tin.createAsync = function (options) {
            return __awaiter(this, void 0, void 0, function () {
                var histmaps, obj, proj;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, store_handler_1.store2HistMap4Core(options)];
                        case 1:
                            histmaps = _a.sent();
                            options = histmaps[0];
                            obj = new HistMap_tin(options);
                            obj.tins = histmaps[1];
                            proj = new Projection_1.default({
                                code: "Illst:" + obj.mapID,
                                extent: [0.0, 0.0, obj.width, obj.height],
                                units: "m"
                            });
                            proj_1.addProjection(proj);
                            proj_1.addCoordinateTransforms(proj, "EPSG:3857", function (xy) { return obj.tins[0].transform(xy, false); }, function (merc) { return obj.tins[0].transform(merc, true); });
                            proj_ex_1.transformDirect("EPSG:4326", proj);
                            if (options.sub_maps) {
                                options.sub_maps.map(function (sub_map, i) {
                                    var index = i + 1;
                                    var projKey = "Illst:" + obj.mapID + "#" + index;
                                    var tin = obj.tins[index];
                                    var proj = new Projection_1.default({
                                        code: projKey,
                                        extent: [tin.xy[0], tin.xy[1], tin.wh[0], tin.wh[1]],
                                        units: "m"
                                    });
                                    proj_1.addProjection(proj);
                                    proj_1.addCoordinateTransforms(proj, "EPSG:3857", function (xy) { return tin.transform(xy, false, true); }, function (merc) { return tin.transform(merc, true, true); });
                                    proj_ex_1.transformDirect("EPSG:4326", proj);
                                    var xyBounds = Object.assign([], sub_map.bounds);
                                    xyBounds.push(sub_map.bounds[0]);
                                    var mercBounds = xyBounds.map(function (xy) { return tin.transform(xy, false); });
                                    var xyBoundsPolygon = helpers_1.polygon([xyBounds]);
                                    var mercBoundsPolygon = helpers_1.polygon([mercBounds]);
                                    tin.xyBounds = xyBoundsPolygon;
                                    tin.mercBounds = mercBoundsPolygon;
                                });
                            }
                            return [2, obj];
                    }
                });
            });
        };
        HistMap_tin.prototype.xy2MercAsync_specifyLayer = function (xy, layerId) {
            var layerKey = "Illst:" + this.mapID + (layerId ? "#" + layerId : "");
            return new Promise(function (resolve, _reject) {
                resolve(proj_ex_1.transformDirect(layerKey, "EPSG:3857", xy));
            });
        };
        HistMap_tin.prototype.merc2XyAsync_specifyLayer = function (merc, layerId) {
            var layerKey = "Illst:" + this.mapID + (layerId ? "#" + layerId : "");
            return new Promise(function (resolve, _reject) {
                resolve(proj_ex_1.transformDirect("EPSG:3857", layerKey, merc));
            });
        };
        HistMap_tin.prototype.xy2MercAsync_returnLayer = function (xy) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var tinSorted = _this.tins
                    .map(function (tin, index) { return [index, tin]; })
                    .sort(function (a, b) { return (a[1].priority < b[1].priority ? 1 : -1); });
                var _loop_1 = function (i) {
                    var index = tinSorted[i][0];
                    var tin = tinSorted[i][1];
                    if (index == 0 || boolean_point_in_polygon_1.default(xy, tin.xyBounds)) {
                        _this.xy2MercAsync_specifyLayer(xy, index)
                            .then(function (merc) {
                            resolve([index, merc]);
                        })
                            .catch(function (err) {
                            reject(err);
                        });
                        return "break";
                    }
                };
                for (var i = 0; i < tinSorted.length; i++) {
                    var state_1 = _loop_1(i);
                    if (state_1 === "break")
                        break;
                }
            });
        };
        HistMap_tin.prototype.merc2XyAsync_returnLayer = function (merc) {
            var _this = this;
            return Promise.all(this.tins.map(function (tin, index) {
                return new Promise(function (resolve, reject) {
                    _this.merc2XyAsync_specifyLayer(merc, index)
                        .then(function (xy) {
                        if (index === 0 || boolean_point_in_polygon_1.default(xy, tin.xyBounds)) {
                            resolve([tin, index, xy]);
                        }
                        else {
                            resolve([tin, index]);
                        }
                    })
                        .catch(function (err) {
                        reject(err);
                    });
                });
            })).then(function (results) {
                return results
                    .sort(function (a, b) { return (a[0].priority < b[0].priority ? 1 : -1); })
                    .reduce(function (ret, result, priIndex, arry) {
                    var tin = result[0];
                    var index = result[1];
                    var xy = result[2];
                    if (!xy)
                        return ret;
                    for (var i = 0; i < priIndex; i++) {
                        var targetTin = arry[i][0];
                        var targetIndex = arry[i][1];
                        if (targetIndex === 0 ||
                            boolean_point_in_polygon_1.default(xy, targetTin.xyBounds)) {
                            if (ret.length) {
                                var hide = !ret[0];
                                var storedTin = hide ? ret[1][2] : ret[0][2];
                                if (!hide || tin.importance < storedTin.importance) {
                                    return ret;
                                }
                                else {
                                    return [undefined, [index, xy, tin]];
                                }
                            }
                            else {
                                return [undefined, [index, xy, tin]];
                            }
                        }
                    }
                    if (!ret.length || !ret[0]) {
                        return [[index, xy, tin]];
                    }
                    else {
                        ret.push([index, xy, tin]);
                        return ret
                            .sort(function (a, b) { return (a[2].importance < b[2].importance ? 1 : -1); })
                            .filter(function (_row, i) { return i < 2; });
                    }
                }, [])
                    .map(function (row) {
                    if (!row)
                        return;
                    return [row[0], row[1]];
                });
            });
        };
        HistMap_tin.prototype.mapSize2MercSize = function (callback) {
            var _this = this;
            var xy = [this.width / 2, this.height / 2];
            this.xy2MercAsync_returnLayer(xy)
                .then(function (results) {
                var index = results[0];
                var mercCenter = results[1];
                var dir4 = [
                    [xy[0] - 150, xy[1]],
                    [xy[0] + 150, xy[1]],
                    [xy[0], xy[1] - 150],
                    [xy[0], xy[1] + 150]
                ];
                var envelope = [
                    [0, 0],
                    [_this.width, 0],
                    [_this.width, _this.height],
                    [0, _this.height]
                ];
                var proms = [];
                for (var i = 0; i < 9; i++) {
                    var prom = i < 4
                        ? _this.xy2MercAsync_specifyLayer(dir4[i], index)
                        : i == 4
                            ? Promise.resolve(mercCenter)
                            : _this.xy2MercAsync_specifyLayer(envelope[i - 5], 0);
                    proms.push(prom);
                }
                Promise.all(proms)
                    .then(function (mercs) {
                    var delta1 = Math.sqrt(Math.pow(mercs[0][0] - mercs[1][0], 2) +
                        Math.pow(mercs[0][1] - mercs[1][1], 2));
                    var delta2 = Math.sqrt(Math.pow(mercs[2][0] - mercs[3][0], 2) +
                        Math.pow(mercs[2][1] - mercs[3][1], 2));
                    var delta = (delta1 + delta2) / 2;
                    _this.mercZoom =
                        Math.log((300 * (2 * const_ex_1.MERC_MAX)) / 256 / delta) / Math.log(2) - 3;
                    _this.homePosition = proj_1.toLonLat(mercs[4]);
                    _this.envelope = helpers_1.polygon([
                        [mercs[5], mercs[6], mercs[7], mercs[8], mercs[5]]
                    ]);
                    callback(_this);
                })
                    .catch(function (err) {
                    throw err;
                });
            })
                .catch(function (err) {
                throw err;
            });
        };
        HistMap_tin.prototype.size2MercsAsync = function (center, zoom, rotate) {
            var _this = this;
            var cross = this.size2Xys(center, zoom, rotate).map(function (xy, index) {
                if (index == 5)
                    return xy;
                return _this.histMapCoords2Xy(xy);
            });
            var promise = this.xy2MercAsync_returnLayer(cross[0]);
            return promise.then(function (results) {
                var index = results[0];
                var centerMerc = results[1];
                var promises = cross.map(function (val, i) {
                    if (i == 5)
                        return val;
                    if (i == 0)
                        return Promise.resolve(centerMerc);
                    return _this.xy2MercAsync_specifyLayer(val, index);
                });
                return Promise.all(promises).catch(function (err) {
                    throw err;
                });
            });
        };
        HistMap_tin.prototype.mercs2SizeAsync = function (mercs, asMerc) {
            var _this = this;
            if (asMerc === void 0) { asMerc = false; }
            var promises;
            if (asMerc) {
                promises = Promise.resolve(mercs);
            }
            else {
                promises = this.merc2XyAsync_returnLayer(mercs[0]).then(function (results) {
                    var result = results[0] || results[1];
                    var index = result[0];
                    var centerXy = result[1];
                    return Promise.all(mercs.map(function (merc, i) {
                        if (i == 5)
                            return merc;
                        if (i == 0)
                            return centerXy;
                        return _this.merc2XyAsync_specifyLayer(merc, index);
                    }));
                });
            }
            return promises.then(function (xys) {
                if (!asMerc) {
                    xys = xys.map(function (xy, i) {
                        if (i == 5)
                            return xy;
                        return _this.xy2HistMapCoords(xy);
                    });
                }
                return _this.xys2Size(xys);
            });
        };
        HistMap_tin.prototype.mercs2XysAsync = function (mercs) {
            var _this = this;
            var promises = this.merc2XyAsync_returnLayer(mercs[0]).then(function (results) {
                var hide = false;
                return Promise.all(results.map(function (result, i) {
                    if (!result) {
                        hide = true;
                        return;
                    }
                    var index = result[0];
                    var centerXy = result[1];
                    if (i != 0 && !hide)
                        return Promise.resolve([centerXy]);
                    return Promise.all(mercs.map(function (merc, j) {
                        if (j == 5)
                            return merc;
                        if (j == 0)
                            return Promise.resolve(centerXy);
                        return _this.merc2XyAsync_specifyLayer(merc, index);
                    }));
                }));
            });
            return promises
                .then(function (results) {
                return results.map(function (result) {
                    if (!result) {
                        return;
                    }
                    return result.map(function (xy, i) {
                        if (i == 5)
                            return xy;
                        return _this.xy2HistMapCoords(xy);
                    });
                });
            })
                .catch(function (err) {
                throw err;
            });
        };
        HistMap_tin.prototype.xy2MercAsync = function (xy) {
            var convertXy = this.histMapCoords2Xy(xy);
            return this.xy2MercAsync_returnLayer(convertXy).then(function (ret) { return ret[1]; });
        };
        HistMap_tin.prototype.merc2XyAsync = function (merc, ignoreBackside) {
            var _this = this;
            if (ignoreBackside === void 0) { ignoreBackside = false; }
            return this.merc2XyAsync_returnLayer(merc).then(function (ret) {
                if (ignoreBackside && !ret[0])
                    return;
                var convertXy = !ret[0] ? ret[1][1] : ret[0][1];
                return _this.xy2HistMapCoords(convertXy);
            });
        };
        return HistMap_tin;
    }(histmap_1.HistMap));
    exports.HistMap_tin = HistMap_tin;
});
//# sourceMappingURL=histmap_tin.js.map