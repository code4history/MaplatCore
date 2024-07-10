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
        define(["require", "exports", "ol", "./view_ex", "ol/layer", "ol/source", "ol/geom", "ol/style", "./source/mapboxmap", "./source/googlemap", "./source/nowmap", "./math_ex", "./layer_mapbox", "./functions", "./customevent", "../parts/bluedot.png", "../parts/bluedot_transparent.png", "../parts/bluedot_small.png", "../parts/defaultpin.png"], factory);
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
    var googlemap_1 = require("./source/googlemap");
    var nowmap_1 = require("./source/nowmap");
    var math_ex_1 = require("./math_ex");
    var layer_mapbox_1 = require("./layer_mapbox");
    var functions_1 = require("./functions");
    var customevent_1 = __importDefault(require("./customevent"));
    var bluedot_png_1 = __importDefault(require("../parts/bluedot.png"));
    var bluedot_transparent_png_1 = __importDefault(require("../parts/bluedot_transparent.png"));
    var bluedot_small_png_1 = __importDefault(require("../parts/bluedot_small.png"));
    var defaultpin_png_1 = __importDefault(require("../parts/defaultpin.png"));
    var gpsStyle = new style_1.Style({
        image: new style_1.Icon({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: bluedot_png_1.default
        })
    });
    var gpsHideStyle = new style_1.Style({
        image: new style_1.Icon({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: bluedot_transparent_png_1.default
        })
    });
    var gpsSubStyle = new style_1.Style({
        image: new style_1.Icon({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
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
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
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
            _this.__first_gps_request = true;
            _this.fakeGps = optOptions.fakeGps;
            _this.fakeRadius = optOptions.fakeRadius;
            _this.homePosition = optOptions.homePosition;
            _this.northUp = optOptions.northUp;
            _this.tapDuration = optOptions.tapDuration;
            _this.homeMarginPixels = optOptions.homeMarginPixels;
            _this.tapUIVanish = optOptions.tapUIVanish;
            _this.alwaysGpsOn = optOptions.alwaysGpsOn || false;
            var view = _this.getView();
            _this.__ignore_first_move = true;
            var movestart = function () {
                if (!_this.__ignore_first_move)
                    _this.dispatchEvent("movestart");
                _this.__ignore_first_move = false;
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
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
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
            var style;
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
                source.setMap(this);
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
            if (source instanceof nowmap_1.NowMap || source instanceof googlemap_1.GoogleMap) {
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
            if (avoidEventForOff === void 0) { avoidEventForOff = false; }
            console.log("GPS trigger".concat(launch));
            if (launch) {
                this.dispatchEvent(new customevent_1.default("gps_request", {}));
                this.__first_gps_request = !this.alwaysGpsOn;
                if (this.fakeGps) {
                    this.__timer_id = setInterval(function (evt) {
                        console.log("GPS Change ".concat(evt));
                        _this.handleGPSResults("change", evt);
                    }, 10000);
                    this.handleGPSResults("change");
                }
                else {
                    if (!this.geolocation) {
                        var geolocation = (this.geolocation = new ol_1.Geolocation({
                            tracking: true
                        }));
                        geolocation.on("change", function (evt) {
                            console.log("GPS Change ".concat(evt));
                            console.log(evt);
                            _this.handleGPSResults("change", evt);
                        });
                        geolocation.on("error", function (evt) {
                            console.log("GPS Error ".concat(evt));
                            console.log(evt);
                            _this.handleGPSResults("error", evt);
                        });
                    }
                    else {
                        this.geolocation.setTracking(true);
                    }
                }
            }
            else {
                if (this.geolocation)
                    this.geolocation.setTracking(false);
                else if (this.__timer_id) {
                    clearInterval(this.__timer_id);
                    this.__timer_id = undefined;
                }
                var source = this.getLayers().item(0).getSource();
                source.setGPSMarker(null);
                if (!avoidEventForOff)
                    this.dispatchEvent(new customevent_1.default("gps_result", { error: "gps_off" }));
            }
        };
        MaplatMap.prototype.handleGPSResults = function (type, event) {
            var _this = this;
            var overlayLayer = this.getLayer("overlay").getLayers().item(0);
            var firstLayer = this.getLayers().item(0);
            var source = (overlayLayer ? overlayLayer.getSource() : firstLayer.getSource());
            var gpsVal = null;
            if (!this.geolocation) {
                console.log("1");
                var lnglat = [
                    (0, math_ex_1.randomFromCenter)(this.homePosition[0], 0.05),
                    (0, math_ex_1.randomFromCenter)(this.homePosition[1], 0.05)
                ];
                var acc = (0, math_ex_1.randomFromCenter)(15.0, 10);
                gpsVal = { lnglat: lnglat, acc: acc };
            }
            else if (type == "change") {
                console.log("2");
                var lnglat = this.geolocation.getPosition();
                var acc = this.geolocation.getAccuracy();
                gpsVal = { lnglat: lnglat, acc: acc };
            }
            else {
                gpsVal = { error: "gps_error", code: event.code, message: event.message };
                source.setGPSMarker(false);
                this.dispatchEvent(new customevent_1.default("gps_result", gpsVal));
                if (!this.alwaysGpsOn)
                    this.handleGPS(false);
                return;
            }
            source.setGPSMarkerAsync(gpsVal, !this.__first_gps_request)
                .then(function (result) {
                console.log("Out event dispatch");
                console.log(result);
                if (!result) {
                    gpsVal.error = "gps_out";
                }
                _this.__first_gps_request = false;
                _this.dispatchEvent(new customevent_1.default("gps_result", gpsVal));
                _this.render();
            });
        };
        return MaplatMap;
    }(ol_1.Map));
    exports.MaplatMap = MaplatMap;
});
//# sourceMappingURL=map_ex.js.map