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
        define(["require", "exports", "ol/layer/Layer", "ol/proj"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MapboxLayer = void 0;
    var Layer_1 = __importDefault(require("ol/layer/Layer"));
    var proj_1 = require("ol/proj");
    var MapboxLayer = (function (_super) {
        __extends(MapboxLayer, _super);
        function MapboxLayer(options) {
            var render = function (frameState) {
                var source = this.getSource();
                var mbMap = source.mapboxMap;
                mbMap.setStyle(source.style);
                var canvas = mbMap.getCanvas();
                var viewState = frameState.viewState;
                var visible = this.getVisible();
                canvas.style.display = visible ? "block" : "none";
                var opacity = this.getOpacity();
                canvas.style.opacity = opacity;
                var newBearing = (viewState.rotation * -180) / Math.PI;
                var newLonLat = (0, proj_1.toLonLat)(viewState.center);
                var newZoom = viewState.zoom - 1;
                var nowBearing = mbMap.getBearing();
                var nowLonLat = mbMap.getCenter().toArray();
                var nowZoom = mbMap.getZoom();
                if (newBearing == nowBearing &&
                    newLonLat[0] == nowLonLat[0] &&
                    newLonLat[1] == nowLonLat[1] &&
                    newZoom == nowZoom) {
                    return canvas;
                }
                if (newBearing != nowBearing) {
                    mbMap.rotateTo(newBearing, {
                        animate: false
                    });
                }
                if (newLonLat[0] != nowLonLat[0] ||
                    newLonLat[1] != nowLonLat[1] ||
                    newZoom != nowZoom) {
                    mbMap.jumpTo({
                        center: newLonLat,
                        zoom: newZoom,
                        animate: false
                    });
                }
                if (mbMap._frame) {
                    mbMap._frame.cancel();
                    mbMap._frame = null;
                }
                mbMap._render();
                return canvas;
            };
            return _super.call(this, {
                render: render,
                source: options.source
            }) || this;
        }
        return MapboxLayer;
    }(Layer_1.default));
    exports.MapboxLayer = MapboxLayer;
});
//# sourceMappingURL=layer_mapbox.js.map