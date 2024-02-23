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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        define(["require", "exports", "ol/Feature.js", "ol/layer/Group.js", "monotone-chain-convex-hull", "ol/style.js", "ol/source.js", "ol/geom.js", "ol/layer.js", "ol/extent.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Feature_js_1 = __importDefault(require("ol/Feature.js"));
    var Group_js_1 = __importDefault(require("ol/layer/Group.js"));
    var monotone_chain_convex_hull_1 = __importDefault(require("monotone-chain-convex-hull"));
    var style_js_1 = require("ol/style.js");
    var source_js_1 = require("ol/source.js");
    var geom_js_1 = require("ol/geom.js");
    var layer_js_1 = require("ol/layer.js");
    var extent_js_1 = require("ol/extent.js");
    var clusterRegister = (function (_super) {
        __extends(clusterRegister, _super);
        function clusterRegister() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        clusterRegister.prototype.removeMap = function () {
            this.map__.un('pointermove', this.pointermove__);
            this.map__.un('click', this.pointerclick__);
        };
        clusterRegister.prototype.registerMap = function (source, map, callback) {
            var _this = this;
            var circleDistanceMultiplier = 1;
            var circleFootSeparation = 28;
            var circleStartAngle = Math.PI / 2;
            this.map__ = map;
            var convexHullFill = new style_js_1.Fill({
                color: 'rgba(255, 153, 0, 0.4)',
            });
            var convexHullStroke = new style_js_1.Stroke({
                color: 'rgba(204, 85, 0, 1)',
                width: 1.5,
            });
            var outerCircleFill = new style_js_1.Fill({
                color: 'rgba(255, 153, 102, 0.3)',
            });
            var innerCircleFill = new style_js_1.Fill({
                color: 'rgba(255, 165, 0, 0.7)',
            });
            var textFill = new style_js_1.Fill({
                color: '#fff',
            });
            var textStroke = new style_js_1.Stroke({
                color: 'rgba(0, 0, 0, 0.6)',
                width: 3,
            });
            var innerCircle = new style_js_1.Circle({
                radius: 14,
                fill: innerCircleFill,
            });
            var outerCircle = new style_js_1.Circle({
                radius: 20,
                fill: outerCircleFill,
            });
            var clickFeature, clickResolution;
            function clusterCircleStyle(cluster, resolution) {
                if (cluster !== clickFeature || resolution !== clickResolution) {
                    return null;
                }
                var clusterMembers = cluster.get('features');
                return generatePointsCircle(clusterMembers.length, cluster.getGeometry().getCoordinates(), resolution).reduce(function (styles, coordinates, i) {
                    var footPoint = clusterMembers[i].getGeometry().getCoordinates();
                    var point = new geom_js_1.Point(coordinates);
                    var line = new geom_js_1.LineString([footPoint, coordinates]);
                    styles.unshift(new style_js_1.Style({
                        geometry: line,
                        stroke: convexHullStroke,
                    }));
                    styles.push(callback(new Feature_js_1.default(__assign(__assign({}, clusterMembers[i].getProperties()), { geometry: point }))));
                    return styles;
                }, []);
            }
            function generatePointsCircle(count, clusterCenter, resolution) {
                var circumference = circleDistanceMultiplier * circleFootSeparation * (2 + count);
                var legLength = circumference / (Math.PI * 2);
                var angleStep = (Math.PI * 2) / count;
                var res = [];
                var angle;
                legLength = Math.max(legLength, 35) * resolution;
                for (var i = 0; i < count; ++i) {
                    angle = circleStartAngle + i * angleStep;
                    res.push([
                        clusterCenter[0] + legLength * Math.cos(angle),
                        clusterCenter[1] + legLength * Math.sin(angle),
                    ]);
                }
                return res;
            }
            var hoverFeature;
            function clusterHullStyle(cluster) {
                if (cluster !== hoverFeature) {
                    return null;
                }
                var originalFeatures = cluster.get('features');
                var points = originalFeatures.map(function (feature) { return feature.getGeometry().getCoordinates(); });
                return new style_js_1.Style({
                    geometry: new geom_js_1.Polygon([(0, monotone_chain_convex_hull_1.default)(points)]),
                    fill: convexHullFill,
                    stroke: convexHullStroke,
                });
            }
            function clusterStyle(feature) {
                var size = feature.get('features').length;
                if (size > 1) {
                    return [
                        new style_js_1.Style({
                            image: outerCircle,
                        }),
                        new style_js_1.Style({
                            image: innerCircle,
                            text: new style_js_1.Text({
                                text: size.toString(),
                                fill: textFill,
                                stroke: textStroke,
                            }),
                        }),
                    ];
                }
                var originalFeature = feature.get('features')[0];
                return callback(originalFeature);
            }
            var clusterSource = new source_js_1.Cluster({
                attributions: 'Data: <a href="https://www.data.gv.at/auftritte/?organisation=stadt-wien">Stadt Wien</a>',
                distance: 35,
                source: source,
            });
            var clusterHulls = new layer_js_1.Vector({
                source: clusterSource,
                style: clusterHullStyle,
            });
            var clusters = new layer_js_1.Vector({
                source: clusterSource,
                style: clusterStyle,
            });
            var clusterCircles = new layer_js_1.Vector({
                source: clusterSource,
                style: clusterCircleStyle,
            });
            this.getLayers().push(clusterHulls);
            this.getLayers().push(clusters);
            this.getLayers().push(clusterCircles);
            this.pointermove__ = function (event) {
                clusters.getFeatures(event.pixel).then(function (features) {
                    if (features[0] !== hoverFeature) {
                        hoverFeature = features[0];
                        clusterHulls.setStyle(clusterHullStyle);
                        map.getTargetElement().style.cursor =
                            hoverFeature && hoverFeature.get('features').length > 1
                                ? 'pointer'
                                : '';
                    }
                });
            };
            map.on('pointermove', this.pointermove__);
            this.pointerclick__ = function (event) { return __awaiter(_this, void 0, void 0, function () {
                var features, clusterMembers, extent_1, view, resolution;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, clusterCircles.getFeatures(event.pixel)];
                        case 1:
                            features = _a.sent();
                            if (!(features.length > 0)) return [3, 2];
                            console.log(features[0].get('features')[0].getProperties());
                            return [3, 4];
                        case 2: return [4, clusters.getFeatures(event.pixel)];
                        case 3:
                            features = _a.sent();
                            if (features.length > 0) {
                                clusterMembers = features[0].get('features');
                                if (clusterMembers.length > 1) {
                                    extent_1 = (0, extent_js_1.createEmpty)();
                                    clusterMembers.forEach(function (feature) {
                                        return (0, extent_js_1.extend)(extent_1, feature.getGeometry().getExtent());
                                    });
                                    view = map.getView();
                                    resolution = map.getView().getResolution();
                                    if (view.getZoom() === view.getMaxZoom() ||
                                        ((0, extent_js_1.getWidth)(extent_1) < resolution && (0, extent_js_1.getHeight)(extent_1) < resolution)) {
                                        clickFeature = features[0];
                                        clickResolution = resolution;
                                        clusterCircles.setStyle(clusterCircleStyle);
                                    }
                                    else {
                                        view.fit(extent_1, { duration: 500, padding: [50, 50, 50, 50] });
                                    }
                                }
                                else {
                                    console.log(clusterMembers[0].getProperties());
                                }
                            }
                            _a.label = 4;
                        case 4: return [2];
                    }
                });
            }); };
            map.on('click', this.pointerclick__);
        };
        return clusterRegister;
    }(Group_js_1.default));
    exports.default = clusterRegister;
});
//# sourceMappingURL=clusterRegister.js.map