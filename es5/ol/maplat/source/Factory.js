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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
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
        define(["require", "exports", "./Maplat", "@maplat/tin/lib/index.js", "proj4", "ol/proj.js", "ol/source.js", "ol/format/IIIFInfo.js", "@turf/helpers"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Maplat_1 = __importDefault(require("./Maplat"));
    var index_js_1 = __importDefault(require("@maplat/tin/lib/index.js"));
    var proj4_1 = __importDefault(require("proj4"));
    var proj4List = require('proj4-list');
    var proj_js_1 = require("ol/proj.js");
    var source_js_1 = require("ol/source.js");
    var IIIFInfo_js_1 = __importDefault(require("ol/format/IIIFInfo.js"));
    var helpers_1 = require("@turf/helpers");
    var manifesto = require('manifesto.js');
    proj4_1.default.defs([
        ['TOKYO', '+proj=longlat +ellps=bessel +towgs84=-146.336,506.832,680.254'],
        ['JCP:NAD27', '+proj=longlat +ellps=clrk66 +datum=NAD27 +no_defs'],
        [
            'JCP:ZONEA:NAD27',
            '+proj=poly +lat_0=40.5 +lon_0=143 +x_0=914398.5307444408 +y_0=1828797.0614888816 +ellps=clrk66 +to_meter=0.9143985307444408 +no_defs',
        ],
        [
            'JCP:ZONEB:NAD27',
            '+proj=poly +lat_0=40.5 +lon_0=135 +x_0=914398.5307444408 +y_0=1828797.0614888816 +ellps=clrk66 +to_meter=0.9143985307444408 +no_defs',
        ],
        [
            'JCP:ZONEC:NAD27',
            '+proj=poly +lat_0=40.5 +lon_0=127 +x_0=914398.5307444408 +y_0=1828797.0614888816 +ellps=clrk66 +to_meter=0.9143985307444408 +no_defs',
        ],
    ]);
    var maplatProjectionStore = [];
    var Factory = (function () {
        function Factory() {
        }
        Factory.factoryMaplatSource = function (settings, options) {
            if (options === void 0) { options = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var mapID, SourceClass, settingsNew, manifest, infoUrl, infoObj, iiifOption, createdProjection, maplatProjection, source;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mapID = settings.mapID;
                            options.mapID = mapID;
                            settingsNew = settings;
                            if (!(settingsNew.sourceSpec && settingsNew.sourceSpec.tileSourceType === 'IIIF')) return [3, 6];
                            SourceClass = source_js_1.IIIF;
                            delete options.url;
                            return [4, manifesto.loadManifest(settingsNew.sourceSpec.url)];
                        case 1:
                            manifest = _a.sent();
                            if (!(manifest.sequences && manifest.sequences[0] && manifest.sequences[0].canvases)) return [3, 4];
                            infoUrl = "".concat(manifest.sequences[0].canvases[settingsNew.sourceSpec.iiifNumber || 0].images[0].resource.service['@id'], "/info.json");
                            return [4, fetch(infoUrl)];
                        case 2: return [4, (_a.sent()).json()];
                        case 3:
                            infoObj = _a.sent();
                            iiifOption = new IIIFInfo_js_1.default(infoObj).getTileSourceOptions();
                            if (iiifOption === undefined || iiifOption.version === undefined)
                                throw new Error('Invalid Image setting in IIIF settings');
                            options = Object.assign(options, iiifOption);
                            return [3, 5];
                        case 4: throw new Error('Invalid IIIF settings');
                        case 5: return [3, 7];
                        case 6:
                            if (!('url' in options)) {
                                options.url = settingsNew.sourceSpec
                                    ? settingsNew.sourceSpec.url
                                    : settings.url;
                            }
                            _a.label = 7;
                        case 7:
                            createdProjection = createProjection(settings, options);
                            maplatProjection = Array.isArray(createdProjection)
                                ? createdProjection[0]
                                : createdProjection;
                            options.projection = maplatProjection;
                            if (!SourceClass)
                                SourceClass = maplatProjection.getUnits() === 'pixels' ? Maplat_1.default : source_js_1.XYZ;
                            source = new SourceClass(options);
                            console.log(source);
                            source.set('title', 'metaData' in settings ? settings.metaData.title : settings.title);
                            return [2, source];
                    }
                });
            });
        };
        Factory.factoryMaplatSourceFromUrl = function (mapID, url, options) {
            if (options === void 0) { options = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var settingsReq, settings, mapDivide;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, fetch(url)];
                        case 1:
                            settingsReq = _a.sent();
                            return [4, settingsReq.json()];
                        case 2:
                            settings = _a.sent();
                            if (!mapID) {
                                if (settings.mapID) {
                                    mapID = settings.mapID;
                                }
                                else {
                                    mapDivide = url.split(/[\\/\\.]/);
                                    mapID = mapDivide[mapDivide.length - 2];
                                }
                            }
                            settings.mapID = mapID;
                            return [2, this.factoryMaplatSource(settings, options)];
                    }
                });
            });
        };
        return Factory;
    }());
    function createProjection(settings, options, subNum) {
        if (subNum === void 0) { subNum = 0; }
        var maplatProjection = decideProjection(settings, options, subNum);
        if (maplatProjection.getCode() !== 'EPSG:3857' &&
            maplatProjectionStore.indexOf(maplatProjection.getCode()) < 0) {
            var _a = __read(createSystem2MapTransformation(settings), 2), fromSystemToMapTransform_1 = _a[0], toSystemFromMapTransform_1 = _a[1];
            var _b = __read(createMap2WarpTransformation(settings), 2), fromMapToWarpTransformation_1 = _b[0], toMapFromWarpTransformation_1 = _b[1];
            var _c = __read(createWarp2OperationTransformation(settings), 2), fromWarpToOperationTransform_1 = _c[0], toWarpFromOperationTransform_1 = _c[1];
            var _d = __read([
                function (xy) {
                    var mapCoord = fromSystemToMapTransform_1(xy);
                    var warpCoord = fromMapToWarpTransformation_1(mapCoord);
                    var operationCoord = fromWarpToOperationTransform_1(warpCoord);
                    return operationCoord;
                },
                function (operationCoord) {
                    var warpCoord = toWarpFromOperationTransform_1(operationCoord);
                    var mapCoord = toMapFromWarpTransformation_1(warpCoord);
                    var xy = toSystemFromMapTransform_1(mapCoord);
                    return xy;
                },
            ], 2), toOperationCoord = _d[0], fromOperationCoord = _d[1];
            (0, proj_js_1.addProjection)(maplatProjection);
            (0, proj_js_1.addCoordinateTransforms)(maplatProjection, 'EPSG:3857', toOperationCoord, fromOperationCoord);
            (0, proj_js_1.addCoordinateTransforms)(maplatProjection, 'EPSG:4326', function (xy) {
                return (0, proj_js_1.transform)((0, proj_js_1.transform)(xy, maplatProjection, 'EPSG:3857'), 'EPSG:3857', 'EPSG:4326');
            }, function (lnglat) {
                return (0, proj_js_1.transform)((0, proj_js_1.transform)(lnglat, 'EPSG:4326', 'EPSG:3857'), 'EPSG:3857', maplatProjection);
            });
            maplatProjectionStore.forEach(function (projectionCode) {
                (0, proj_js_1.addCoordinateTransforms)(maplatProjection, projectionCode, function (xy) {
                    return (0, proj_js_1.transform)((0, proj_js_1.transform)(xy, maplatProjection, 'EPSG:3857'), 'EPSG:3857', projectionCode);
                }, function (xy) {
                    return (0, proj_js_1.transform)((0, proj_js_1.transform)(xy, projectionCode, 'EPSG:3857'), 'EPSG:3857', maplatProjection);
                });
            });
            maplatProjectionStore.push(maplatProjection.getCode());
        }
        var returnProjs;
        if (maplatProjection.getUnits() !== 'pixels') {
            if ('envelopLngLats' in settings) {
                var lnglats = settings.envelopLngLats.concat([settings.envelopLngLats[0]]);
                var coords3857 = lnglats.map(function (lnglat) { return (0, proj_js_1.transform)(lnglat, 'EPSG:4326', 'EPSG:3857'); });
                maplatProjection.mercBoundary = (0, helpers_1.polygon)([coords3857]);
            }
        }
        else {
            if ("boundsPolygon" in settings) {
                maplatProjection.pixelBoundary = settings.boundsPolygon;
            }
            else {
                var xys = [
                    [0, 0],
                    [options.size[0], 0],
                    options.size,
                    [0, options.size[1]],
                    [0, 0],
                ];
                maplatProjection.pixelBoundary = (0, helpers_1.polygon)([xys]);
            }
            maplatProjection.mercBoundary = (0, helpers_1.polygon)([
                maplatProjection.pixelBoundary.geometry.coordinates[0].map(function (xy) { return (0, proj_js_1.transform)(xy, maplatProjection, 'EPSG:3857'); }),
            ]);
        }
        return returnProjs ? returnProjs : maplatProjection;
    }
    function decideProjection(settings, options, subNum) {
        if (subNum === void 0) { subNum = 0; }
        var projName = "Maplat:".concat(settings.mapID).concat(subNum ? "#".concat(subNum) : '');
        var projSelect = 'PIXEL';
        if (settingsIsLegacy(settings)) {
            if (settingsIs3857OnLegacy(settings)) {
                options.maxZoom = settings.maxZoom;
                projSelect = settingsIsNoWarpOnLegacy3857(settings) ? '3857' : '3857+';
            }
        }
        else if (settingsIs3857(settings)) {
            options.maxZoom = settings.sourceSpec.maxZoom;
            projSelect = settingsIsNoWarp(settings) ? '3857' : '3857+';
        }
        var returnProj;
        switch (projSelect) {
            case '3857':
                returnProj = (0, proj_js_1.get)('EPSG:3857');
                break;
            case '3857+':
                returnProj = new proj_js_1.Projection({
                    code: projName,
                    units: 'm',
                    extent: [
                        -20037508.342789244, -20037508.342789244, 20037508.342789244,
                        20037508.342789244,
                    ],
                    worldExtent: [-180, -85, 180, 85],
                });
                break;
            default: {
                if (!('size' in options)) {
                    options.size =
                        'projectionSpec' in settings
                            ? settings.projectionSpec.size
                            : 'width' in settings && 'height' in settings
                                ? [settings.width, settings.height]
                                : settings.compiled.wh;
                }
                options.maxZoom = Math.ceil(Math.max(Math.log2(options.size[0] / 256), Math.log2(options.size[1] / 256)));
                var extent = [0, -options.size[1], options.size[0], 0];
                var worldExtentSize = 256 * Math.pow(2, options.maxZoom);
                var worldExtent = [0, -worldExtentSize, worldExtentSize, 0];
                returnProj = new proj_js_1.Projection({
                    code: projName,
                    units: 'pixels',
                    extent: extent,
                    worldExtent: worldExtent,
                });
            }
        }
        return returnProj;
    }
    function createSystem2MapTransformation(settings) {
        if (settingsIsLegacy(settings)) {
            return [coord2Coord, coord2Coord];
        }
        if (settingsHasWorldParams(settings)) {
            var worldParams = settings.projectionSpec.worldParams;
            var a_1 = worldParams.xScale;
            var b_1 = worldParams.xRotation;
            var c_1 = worldParams.xOrigin;
            var d_1 = worldParams.yRotation;
            var e_1 = worldParams.yScale;
            var f_1 = worldParams.yOrigin;
            return [
                function (xy) { return [a_1 * xy[0] - b_1 * xy[1] + c_1, d_1 * xy[0] - e_1 * xy[1] + f_1]; },
                function (xy) { return [
                    (xy[0] * e_1 - xy[1] * b_1 - c_1 * e_1 + f_1 * b_1) / (a_1 * e_1 - b_1 * d_1),
                    -(xy[1] * a_1 - xy[0] * d_1 - f_1 * a_1 + c_1 * d_1) / (a_1 * e_1 - b_1 * d_1),
                ]; },
            ];
        }
        return [coord2Coord, coord2Coord];
    }
    function createMap2WarpTransformation(settings) {
        if (settingsIsLegacy(settings)) {
            if (settingsIs3857OnLegacy(settings)) {
                if (settingsIsNoWarpOnLegacy3857(settings)) {
                    return [coord2Coord, coord2Coord];
                }
                var shiftX_1 = settings.mercatorXShift;
                var shiftY_1 = settings.mercatorYShift;
                return [
                    function (xy) { return [xy[0] + shiftX_1, xy[1] + shiftY_1]; },
                    function (xy) { return [xy[0] - shiftX_1, xy[1] - shiftY_1]; },
                ];
            }
            var tin_1 = new index_js_1.default();
            tin_1.setCompiled(settings.compiled);
            return [
                function (xy) { return tin_1.transform([xy[0], -xy[1]], false); },
                function (merc) {
                    var xy = tin_1.transform(merc, true);
                    return [xy[0], -xy[1]];
                },
            ];
        }
        var projectionSpec = settings.projectionSpec;
        switch (projectionSpec.warp) {
            case 'TIN':
                return [coord2Coord, coord2Coord];
            case 'SHIFT':
                {
                    var coordShift_1 = projectionSpec.coordShift;
                    return [
                        function (xy) { return [xy[0] + coordShift_1[0], xy[1] + coordShift_1[1]]; },
                        function (xy) { return [xy[0] - coordShift_1[0], xy[1] - coordShift_1[1]]; },
                    ];
                }
            default:
                return [coord2Coord, coord2Coord];
        }
    }
    function createWarp2OperationTransformation(settings) {
        if (settingsIsLegacy(settings)) {
            return [coord2Coord, coord2Coord];
        }
        var projectionSpec = settings.projectionSpec;
        if (projectionSpec.mapCoord === 'PIXEL') {
            return [coord2Coord, coord2Coord];
        }
        if (projectionSpec.mapCoord.match(/^(JCP:ZONE[ABC])/)) {
            var zone = RegExp.$1;
            var map2nad_1 = (0, proj4_1.default)("".concat(zone, ":NAD27"), 'JCP:NAD27');
            var tky2merc_1 = (0, proj4_1.default)('TOKYO', 'EPSG:3857');
            return [
                function (xy) {
                    var tokyo = map2nad_1.forward(xy);
                    var merc = tky2merc_1.forward(tokyo);
                    return merc;
                },
                function (merc) {
                    var tokyo = tky2merc_1.inverse(merc);
                    var xy = map2nad_1.inverse(tokyo);
                    return xy;
                },
            ];
        }
        if (projectionSpec.mapCoord.match(/^EPSG:\d+$/)) {
            var epsg = projectionSpec.mapCoord;
            if (!proj4_1.default.defs(epsg)) {
                if (projectionSpec.mapCoordText) {
                    proj4_1.default.defs(epsg, projectionSpec.mapCoordText);
                }
                else if (proj4List[epsg]) {
                    proj4_1.default.defs(epsg, proj4List[epsg][1]);
                }
                else {
                    throw new Error("Unsupported projection by proj4 and proj4-list: ".concat(epsg));
                }
            }
            var map2merc_1 = (0, proj4_1.default)(epsg, 'EPSG:3857');
            return [
                function (xy) {
                    var merc = map2merc_1.forward(xy);
                    return merc;
                },
                function (merc) {
                    var xy = map2merc_1.inverse(merc);
                    return xy;
                },
            ];
        }
        throw new Error("Cannot handle projection: ".concat(projectionSpec.mapCoord));
    }
    function coord2Coord(xy) {
        return xy;
    }
    function settingsIsLegacy(settings) {
        return !('version' in settings);
    }
    function settingsIs3857OnLegacy(settings) {
        return "maptype" in settings && (settings.maptype === 'base' ||
            settings.maptype === 'overlay' ||
            settings.maptype === 'mapbox');
    }
    function settingsIsNoWarpOnLegacy3857(settings) {
        return !('mercatorXShift' in settings && 'mercatorYShift' in settings);
    }
    function settingsIs3857(settings) {
        return ("projectionSpec" in settings &&
            settings.projectionSpec.mapCoord === 'EPSG:3857' &&
            (settings.sourceSpec.tileSourceType === 'WMTS' ||
                settings.sourceSpec.tileSourceType === 'TMS'));
    }
    function settingsIsNoWarp(settings) {
        return "projectionSpec" in settings && settings.projectionSpec.warp === 'NONE';
    }
    function settingsHasWorldParams(settings) {
        return "projectionSpec" in settings && "worldParams" in settings.projectionSpec;
    }
    exports.default = Factory;
});
//# sourceMappingURL=Factory.js.map