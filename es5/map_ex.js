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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "ol", "./view_ex", "ol/layer", "ol/source", "ol/geom", "ol/style", "./source/mapboxmap", "./source/nowmap", "./math_ex", "./layer_mapbox", "./functions", "../parts/bluedot.png", "../parts/bluedot_transparent.png", "../parts/bluedot_small.png", "../parts/defaultpin.png", "ol/style/IconAnchorUnits"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MaplatMap = void 0;
    var ol_1 = require("ol");
    var view_ex_1 = require("./view_ex");
    var layer_1 = require("ol/layer");
    var source_1 = require("ol/source");
    var geom_1 = require("ol/geom");
    var style_1 = require("ol/style");
    var mapboxmap_1 = require("./source/mapboxmap");
    var nowmap_1 = require("./source/nowmap");
    var math_ex_1 = require("./math_ex");
    var layer_mapbox_1 = require("./layer_mapbox");
    var functions_1 = require("./functions");
    var bluedot_png_1 = __importDefault(require("../parts/bluedot.png"));
    var bluedot_transparent_png_1 = __importDefault(require("../parts/bluedot_transparent.png"));
    var bluedot_small_png_1 = __importDefault(require("../parts/bluedot_small.png"));
    var defaultpin_png_1 = __importDefault(require("../parts/defaultpin.png"));
    var IconAnchorUnits_1 = __importDefault(require("ol/style/IconAnchorUnits"));
    var gpsStyle = new style_1.Style({
        image: new style_1.Icon({
            anchor: [0.5, 0.5],
            anchorXUnits: IconAnchorUnits_1.default.FRACTION,
            anchorYUnits: IconAnchorUnits_1.default.FRACTION,
            src: bluedot_png_1.default
        })
    });
    var gpsHideStyle = new style_1.Style({
        image: new style_1.Icon({
            anchor: [0.5, 0.5],
            anchorXUnits: IconAnchorUnits_1.default.FRACTION,
            anchorYUnits: IconAnchorUnits_1.default.FRACTION,
            src: bluedot_transparent_png_1.default
        })
    });
    var gpsSubStyle = new style_1.Style({
        image: new style_1.Icon({
            anchor: [0.5, 0.5],
            anchorXUnits: IconAnchorUnits_1.default.FRACTION,
            anchorYUnits: IconAnchorUnits_1.default.FRACTION,
            src: bluedot_small_png_1.default
        })
    });
    var accCircleStyle = new style_1.Style({
        fill: new style_1.Fill({
            color: [128, 128, 256, 0.2]
        }),
        stroke: new style_1.Stroke({
            color: [128, 128, 256, 1.0],
            width: 3
        })
    });
    var markerDefaultStyle = new style_1.Style({
        image: new style_1.Icon({
            anchor: [0.5, 1.0],
            anchorXUnits: IconAnchorUnits_1.default.FRACTION,
            anchorYUnits: IconAnchorUnits_1.default.FRACTION,
            src: defaultpin_png_1.default
        })
    });
    var MaplatMap = (function (_super) {
        __extends(MaplatMap, _super);
        function MaplatMap(optOptions) {
            var _this = this;
            optOptions = (0, functions_1.normalizeArg)(optOptions || {});
            var vectorLayer = new layer_1.Vector({
                source: new source_1.Vector({
                    wrapX: false
                })
            });
            vectorLayer.set("name", "gps");
            var markerLayer = new layer_1.Vector({
                source: new source_1.Vector({
                    wrapX: false
                })
            });
            markerLayer.set("name", "marker");
            var featureLayer = new layer_1.Vector({
                source: new source_1.Vector({
                    wrapX: false
                })
            });
            featureLayer.set("name", "feature");
            var envelopeLayer = new layer_1.Vector({
                source: new source_1.Vector({
                    wrapX: false
                })
            });
            envelopeLayer.set("name", "envelope");
            var baseLayer = MaplatMap.spawnLayer(null, optOptions.source, optOptions.target);
            var overlayLayer = new layer_1.Group();
            overlayLayer.set("name", "overlay");
            var controls = optOptions.controls ? optOptions.controls : [];
            var options = {
                controls: controls,
                layers: [
                    baseLayer,
                    overlayLayer,
                    envelopeLayer,
                    featureLayer,
                    vectorLayer,
                    markerLayer
                ],
                target: optOptions.div,
                view: new view_ex_1.View({
                    center: optOptions.defaultCenter || [0, 0],
                    zoom: optOptions.defaultZoom || 2,
                    rotation: optOptions.defaultRotation || 0,
                    multiWorld: true
                })
            };
            if (optOptions.interactions) {
                options.interactions = optOptions.interactions;
            }
            _this = _super.call(this, options) || this;
            _this._overlay_group = overlayLayer;
            _this.fakeGps = optOptions.fakeGps;
            _this.fakeRadius = optOptions.fakeRadius;
            _this.homePosition = optOptions.homePosition;
            var view = _this.getView();
            _this.__AvoidFirstMoveStart = true;
            var movestart = function () {
                if (!_this.__AvoidFirstMoveStart)
                    _this.dispatchEvent("movestart");
                _this.__AvoidFirstMoveStart = false;
                view.un("propertychange", movestart);
            };
            view.on("propertychange", movestart);
            _this.on("moveend", function () {
                view.on("propertychange", movestart);
            });
            return _this;
        }
        MaplatMap.spawnLayer = function (layer, source, container) {
            if (source instanceof mapboxmap_1.MapboxMap || !(layer instanceof layer_1.Tile)) {
                if (source instanceof mapboxmap_1.MapboxMap) {
                    layer = new layer_mapbox_1.MapboxLayer({
                        style: source.style,
                        accessToken: source.accessToken,
                        container: container,
                        source: source
                    });
                }
                else {
                    layer = new layer_1.Tile({
                        source: source
                    });
                }
                layer.set("name", "base");
            }
            else {
                layer.setSource(source);
            }
            return layer;
        };
        MaplatMap.prototype.getLayer = function (name) {
            if (name === void 0) { name = "base"; }
            var recur = function (layers) {
                var filtered = layers
                    .getArray()
                    .map(function (layer) {
                    if (layer.get("name") == name)
                        return layer;
                    if (layer.getLayers)
                        return recur(layer.getLayers());
                    return;
                })
                    .filter(function (layer) { return layer; });
                if (filtered.length == 0)
                    return;
                return filtered[0];
            };
            return recur(this.getLayers());
        };
        MaplatMap.prototype.getSource = function (name) {
            if (name === void 0) { name = "base"; }
            var layer = this.getLayer(name);
            if (!layer)
                return;
            return layer.getSource();
        };
        MaplatMap.prototype.setFeature = function (data, style, layer) {
            var src = this.getSource(layer);
            var feature = new ol_1.Feature(data);
            if (style) {
                feature.setStyle(style);
            }
            src.addFeature(feature);
            return feature;
        };
        MaplatMap.prototype.removeFeature = function (feature, layer) {
            var src = this.getSource(layer);
            src.removeFeature(feature);
        };
        MaplatMap.prototype.resetFeature = function (layer) {
            var src = this.getSource(layer);
            src.clear();
        };
        MaplatMap.prototype.setGPSPosition = function (pos, type) {
            if (type === void 0) { type = undefined; }
            var style = type == "sub" ? gpsSubStyle : type == "hide" ? gpsHideStyle : gpsStyle;
            if (type != "sub") {
                this.resetFeature("gps");
            }
            if (pos) {
                this.setFeature({
                    geometry: new geom_1.Point(pos.xy)
                }, style, "gps");
                if (!type) {
                    this.setFeature({
                        geometry: new geom_1.Circle(pos.xy, pos.rad)
                    }, accCircleStyle, "gps");
                }
            }
        };
        MaplatMap.prototype.setMarker = function (xy, data, markerStyle, layer) {
            if (!layer)
                layer = "marker";
            data["geometry"] = new geom_1.Point(xy);
            if (!markerStyle)
                markerStyle = markerDefaultStyle;
            else if (typeof markerStyle == "string") {
                markerStyle = new style_1.Style({
                    image: new style_1.Icon({
                        anchor: [0.5, 1.0],
                        anchorXUnits: IconAnchorUnits_1.default.FRACTION,
                        anchorYUnits: IconAnchorUnits_1.default.FRACTION,
                        src: markerStyle
                    })
                });
            }
            else if (!(markerStyle instanceof style_1.Style)) {
                markerStyle = new style_1.Style({
                    image: new style_1.Icon(markerStyle)
                });
            }
            return this.setFeature(data, markerStyle, layer);
        };
        MaplatMap.prototype.resetMarker = function (layer) {
            if (!layer)
                layer = "marker";
            this.resetFeature(layer);
        };
        MaplatMap.prototype.setLine = function (xys, stroke, layer) {
            return this.setVector(xys, "Line", stroke ? { stroke: stroke } : null, layer);
        };
        MaplatMap.prototype.setVector = function (coords, type, style, layer) {
            if (type === void 0) { type = "Line"; }
            if (!layer)
                layer = "feature";
            var option = {};
            if (style.stroke != null)
                option.stroke = new style_1.Stroke(style.stroke);
            if (style.fill != null)
                option.fill = new style_1.Fill(style.fill);
            var styleObj = new style_1.Style(option);
            var geometry = type === "Line" ? new geom_1.LineString(coords) : new geom_1.Polygon(coords);
            return this.setFeature({
                geometry: geometry,
                name: type
            }, styleObj, layer);
        };
        MaplatMap.prototype.resetLine = function (layer) {
            this.resetVector(layer);
        };
        MaplatMap.prototype.resetVector = function (layer) {
            if (!layer)
                layer = "feature";
            this.resetFeature(layer);
        };
        MaplatMap.prototype.setEnvelope = function (xys, stroke, layer) {
            if (!layer)
                layer = "envelope";
            return this.setLine(xys, stroke, layer);
        };
        MaplatMap.prototype.removeEnvelope = function (feature, layer) {
            if (!layer)
                layer = "envelope";
            this.removeFeature(feature, layer);
        };
        MaplatMap.prototype.resetEnvelope = function (layer) {
            if (!layer)
                layer = "envelope";
            this.resetFeature(layer);
        };
        MaplatMap.prototype.setFillEnvelope = function (xys, stroke, fill, layer) {
            if (!layer)
                layer = "envelope";
            var style = null;
            if (stroke != null || fill != null) {
                var option = {};
                if (stroke != null)
                    option.stroke = new style_1.Stroke(stroke);
                if (fill != null)
                    option.fill = new style_1.Fill(fill);
                style = new style_1.Style(option);
            }
            return this.setFeature({
                geometry: new geom_1.Polygon([xys])
            }, style, layer);
        };
        MaplatMap.prototype.exchangeSource = function (source) {
            if (source === void 0) { source = undefined; }
            var layers = this.getLayers();
            var prevLayer = layers.item(0);
            var layer = MaplatMap.spawnLayer(prevLayer, source, this.getTarget());
            if (layer != prevLayer)
                layers.setAt(0, layer);
            if (source) {
                source._map = this;
            }
        };
        MaplatMap.prototype.setLayer = function (source) {
            if (source === void 0) { source = undefined; }
            var layers = this.getLayer("overlay").getLayers();
            layers.clear();
            if (source) {
                var layer = new layer_1.Tile({
                    source: source
                });
                layers.push(layer);
            }
        };
        MaplatMap.prototype.setTransparency = function (percentage) {
            var opacity = (100 - percentage) / 100;
            var source = this.getSource();
            if (source instanceof nowmap_1.NowMap) {
                this.getLayers().item(0).setOpacity(1);
                this.getLayers().item(1).setOpacity(opacity);
            }
            else {
                this.getLayers().item(0).setOpacity(opacity);
            }
        };
        MaplatMap.prototype.setGPSMarker = function (position, ignoreMove) {
            var source = this.getLayers().item(0).getSource();
            source.setGPSMarker(position, ignoreMove);
        };
        MaplatMap.prototype.handleGPS = function (launch, avoidEventForOff) {
            var _this = this;
            if (launch) {
                this.dispatchEvent("gps_request");
                this._first_gps_request = true;
                if (!this.geolocation) {
                    var geolocation_1 = (this.geolocation = new ol_1.Geolocation({
                        tracking: true
                    }));
                    geolocation_1.on("change", function (_evt) {
                        var overlayLayer = _this.getLayer("overlay").getLayers().item(0);
                        var source = overlayLayer
                            ? overlayLayer.getSource()
                            : _this.getLayers().item(0).getSource();
                        var lnglat = geolocation_1.getPosition();
                        var acc = geolocation_1.getAccuracy();
                        if (_this.fakeGps &&
                            (0, math_ex_1.getDistance)(_this.homePosition, lnglat) >
                                _this.fakeGps) {
                            lnglat = [
                                (0, math_ex_1.randomFromCenter)(_this.homePosition[0], 0.001),
                                (0, math_ex_1.randomFromCenter)(_this.homePosition[1], 0.001)
                            ];
                            acc = (0, math_ex_1.randomFromCenter)(15.0, 10);
                        }
                        var gpsVal = { lnglat: lnglat, acc: acc };
                        source
                            .setGPSMarkerAsync(gpsVal, !_this._first_gps_request)
                            .then(function (result) {
                            if (!result) {
                                gpsVal = { error: "gps_out" };
                            }
                            _this._first_gps_request = false;
                            _this.dispatchEvent(new ol_1.MapEvent("gps_result", _this, gpsVal));
                        });
                    });
                    geolocation_1.on("error", function (_evt) {
                        var source = _this.getLayers().item(0).getSource();
                        var gpsVal = null;
                        if (_this.fakeGps) {
                            var lnglat = [
                                (0, math_ex_1.randomFromCenter)(_this.homePosition[0], 0.001),
                                (0, math_ex_1.randomFromCenter)(_this.homePosition[1], 0.001)
                            ];
                            var acc = (0, math_ex_1.randomFromCenter)(15.0, 10);
                            gpsVal = { lnglat: lnglat, acc: acc };
                        }
                        source
                            .setGPSMarkerAsync(gpsVal, !_this._first_gps_request)
                            .then(function (result) {
                            if (!result) {
                                gpsVal = { error: "gps_out" };
                            }
                            _this._first_gps_request = false;
                            _this.dispatchEvent(new ol_1.MapEvent("gps_result", _this, gpsVal));
                        });
                    });
                }
                else {
                    this.geolocation.setTracking(true);
                }
            }
            else {
                if (this.geolocation)
                    this.geolocation.setTracking(false);
                var source = this.getLayers().item(0).getSource();
                source.setGPSMarker();
                if (!avoidEventForOff)
                    this.dispatchEvent(new ol_1.MapEvent("gps_result", this, { error: "gps_off" }));
            }
        };
        return MaplatMap;
    }(ol_1.Map));
    exports.MaplatMap = MaplatMap;
});
//# sourceMappingURL=map_ex.js.map