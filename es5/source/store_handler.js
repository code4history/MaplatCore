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
        define(["require", "exports", "@maplat/tin"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.histMap2Store = exports.store2HistMap4Core = exports.store2HistMap = void 0;
    var tin_1 = __importDefault(require("@maplat/tin"));
    var keys = [
        "title",
        "attr",
        "officialTitle",
        "dataAttr",
        "author",
        "createdAt",
        "era",
        "license",
        "dataLicense",
        "contributor",
        "mapper",
        "reference",
        "description",
        "url",
        "lang",
        "imageExtension",
        "homePosition",
        "mercZoom"
    ];
    function store2HistMap(store, byCompiled) {
        if (byCompiled === void 0) { byCompiled = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, store2HistMap_internal(store, byCompiled, false)];
            });
        });
    }
    exports.store2HistMap = store2HistMap;
    function store2HistMap4Core(store) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, store2HistMap_internal(store, false, true)];
            });
        });
    }
    exports.store2HistMap4Core = store2HistMap4Core;
    function store2HistMap_internal(store, byCompiled, coreLogic) {
        return __awaiter(this, void 0, void 0, function () {
            var ret, tins, opt, tin, tin, sub_maps, i, sub_map, sub, opt, tin, tin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ret = coreLogic ? store : {};
                        tins = [];
                        keys.forEach(function (key) {
                            ret[key] = store[key];
                        });
                        if (store["imageExtention"])
                            ret["imageExtension"] = store["imageExtention"];
                        if (!store.compiled) return [3, 1];
                        opt = {};
                        if (!store.compiled.wh)
                            opt.wh = [store.width, store.height];
                        if (!store.compiled.strictMode)
                            opt.strictMode = store.strictMode;
                        if (!store.compiled.vertexMode)
                            opt.vertexMode = store.vertexMode;
                        if (!store.compiled.yaxisMode)
                            opt.yaxisMode = store.yaxisMode;
                        tin = new tin_1.default(opt);
                        tin.setCompiled(store.compiled);
                        if (byCompiled) {
                            tin = tin.getCompiled();
                        }
                        ret.strictMode = tin.strictMode;
                        ret.vertexMode = tin.vertexMode;
                        ret.yaxisMode = tin.yaxisMode;
                        ret.width = tin.wh[0];
                        ret.height = tin.wh[1];
                        ret.gcps = tin.points;
                        ret.edges = tin.edges;
                        tins.push(tin);
                        return [3, 3];
                    case 1:
                        ret.strictMode = store.strictMode;
                        ret.vertexMode = store.vertexMode;
                        ret.yaxisMode = store.yaxisMode;
                        ret.width = store.width;
                        ret.height = store.height;
                        ret.gcps = store.gcps;
                        ret.edges = store.edges;
                        return [4, createTinFromGcpsAsync(store.strictMode, store.vertexMode, store.yaxisMode, store.gcps, store.edges, [store.width, store.height])];
                    case 2:
                        tin = _a.sent();
                        if (byCompiled && typeof tin !== "string")
                            tin = tin.getCompiled();
                        tins.push(tin);
                        _a.label = 3;
                    case 3:
                        if (!store.sub_maps) return [3, 10];
                        sub_maps = [];
                        i = 0;
                        _a.label = 4;
                    case 4:
                        if (!(i < store.sub_maps.length)) return [3, 9];
                        sub_map = store.sub_maps[i];
                        sub = {};
                        sub.importance = sub_map.importance;
                        sub.priority = sub_map.priority;
                        if (!sub_map.compiled) return [3, 5];
                        opt = {};
                        if (!sub_map.compiled.strictMode)
                            opt.strictMode = store.strictMode;
                        if (!sub_map.compiled.vertexMode)
                            opt.vertexMode = store.vertexMode;
                        if (!sub_map.compiled.yaxisMode)
                            opt.yaxisMode = store.yaxisMode;
                        tin = new tin_1.default(opt);
                        tin.setCompiled(sub_map.compiled);
                        if (byCompiled) {
                            tin = tin.getCompiled();
                        }
                        sub.bounds = tin.bounds;
                        sub.gcps = tin.points;
                        sub.edges = tin.edges;
                        tins.push(tin);
                        return [3, 7];
                    case 5:
                        sub.bounds = sub_map.bounds;
                        sub.gcps = sub_map.gcps;
                        sub.edges = sub_map.edges;
                        return [4, createTinFromGcpsAsync(store.strictMode, store.vertexMode, store.yaxisMode, sub_map.gcps, sub_map.edges, undefined, sub_map.bounds)];
                    case 6:
                        tin = _a.sent();
                        if (byCompiled && typeof tin !== "string")
                            tin = tin.getCompiled();
                        tins.push(tin);
                        _a.label = 7;
                    case 7:
                        sub_maps.push(sub);
                        _a.label = 8;
                    case 8:
                        i++;
                        return [3, 4];
                    case 9:
                        ret.sub_maps = sub_maps;
                        _a.label = 10;
                    case 10: return [2, [ret, tins]];
                }
            });
        });
    }
    function histMap2Store(histmap, tins) {
        return __awaiter(this, void 0, void 0, function () {
            var ret, tin;
            return __generator(this, function (_a) {
                ret = {};
                keys.forEach(function (key) {
                    ret[key] = histmap[key];
                });
                if (histmap["imageExtention"])
                    ret["imageExtension"] = histmap["imageExtention"];
                tin = tins.shift();
                if (typeof tin === "string") {
                    ret.width = histmap.width;
                    ret.height = histmap.height;
                    ret.gcps = histmap.gcps;
                    ret.edges = histmap.edges;
                    ret.strictMode = histmap.strictMode;
                    ret.vertexMode = histmap.vertexMode;
                    ret.yaxisMode = histmap.yaxisMode;
                }
                else {
                    ret.compiled = tin.getCompiled ? tin.getCompiled() : tin;
                }
                ret.sub_maps =
                    tins.length > 0
                        ? tins.map(function (tin, index) {
                            var sub_map = histmap.sub_maps[index];
                            var sub = {
                                priority: sub_map.priority,
                                importance: sub_map.importance
                            };
                            if (typeof tin === "string") {
                                sub.gcps = sub_map.gcps;
                                sub.edges = sub_map.edges;
                                sub.bounds = sub_map.bounds;
                            }
                            else {
                                sub.compiled = tin.getCompiled
                                    ? tin.getCompiled()
                                    : tin;
                            }
                            return sub;
                        })
                        : [];
                return [2, ret];
            });
        });
    }
    exports.histMap2Store = histMap2Store;
    function createTinFromGcpsAsync(strict, vertex, yaxis, gcps, edges, wh, bounds) {
        if (gcps === void 0) { gcps = []; }
        if (edges === void 0) { edges = []; }
        return __awaiter(this, void 0, void 0, function () {
            var tin, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (gcps.length < 3)
                            return [2, "tooLessGcps"];
                        tin = new tin_1.default({
                            yaxisMode: yaxis
                        });
                        if (wh) {
                            tin.setWh(wh);
                        }
                        else if (bounds) {
                            tin.setBounds(bounds);
                        }
                        else {
                            throw "Both wh and bounds are missing";
                        }
                        tin.setStrictMode(strict);
                        tin.setVertexMode(vertex);
                        tin.setPoints(gcps);
                        tin.setEdges(edges);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, tin.updateTinAsync()];
                    case 2:
                        _a.sent();
                        return [2, tin];
                    case 3:
                        err_1 = _a.sent();
                        console.log(err_1);
                        if (err_1 == "SOME POINTS OUTSIDE") {
                            return [2, "pointsOutside"];
                        }
                        else if (err_1.indexOf("TOO LINEAR") == 0) {
                            return [2, "tooLinear"];
                        }
                        else if (err_1.indexOf("Vertex indices of edge") > -1 ||
                            err_1.indexOf("is degenerate!") > -1 ||
                            err_1.indexOf("already exists or intersects with an existing edge!") > -1) {
                            return [2, "edgeError"];
                        }
                        else {
                            throw err_1;
                        }
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    }
});
//# sourceMappingURL=store_handler.js.map