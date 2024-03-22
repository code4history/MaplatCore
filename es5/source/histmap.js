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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "ol/proj", "../const_ex", "./mixin", "ol/source", "ol/tileurlfunction"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HistMap = void 0;
    var proj_1 = require("ol/proj");
    var const_ex_1 = require("../const_ex");
    var mixin_1 = require("./mixin");
    var source_1 = require("ol/source");
    var tileurlfunction_1 = require("ol/tileurlfunction");
    for (var z = 0; z < 9; z++) {
        var key = "ZOOM:".concat(z);
        var maxxy = 256 * Math.pow(2, z);
        (function (key, maxxy) {
            var projection = new proj_1.Projection({
                code: key,
                extent: [0.0, 0.0, maxxy, maxxy],
                units: "m"
            });
            (0, proj_1.addProjection)(projection);
            (0, proj_1.addCoordinateTransforms)("EPSG:3857", projection, function (coordinate) {
                var x = ((coordinate[0] + const_ex_1.MERC_MAX) * maxxy) / (2 * const_ex_1.MERC_MAX);
                var y = ((-coordinate[1] + const_ex_1.MERC_MAX) * maxxy) / (2 * const_ex_1.MERC_MAX);
                return [x, y];
            }, function (coordinate) {
                var x = (coordinate[0] * (2 * const_ex_1.MERC_MAX)) / maxxy - const_ex_1.MERC_MAX;
                var y = -1 * ((coordinate[1] * (2 * const_ex_1.MERC_MAX)) / maxxy - const_ex_1.MERC_MAX);
                return [x, y];
            });
        })(key, maxxy);
    }
    var HistMap = (function (_super) {
        __extends(HistMap, _super);
        function HistMap(options) {
            if (options === void 0) { options = {}; }
            var _this = this;
            options = (0, mixin_1.addCommonOptions)(options);
            options.wrapX = false;
            var zW = Math.log2(options.width / const_ex_1.tileSize);
            var zH = Math.log2(options.height / const_ex_1.tileSize);
            options.maxZoom = Math.ceil(Math.max(zW, zH));
            options.tileUrlFunction =
                options.tileUrlFunction ||
                    function (coord) {
                        var z = coord[0];
                        var x = coord[1];
                        var y = coord[2];
                        if (x * const_ex_1.tileSize * Math.pow(2, this.maxZoom - z) >= this.width ||
                            y * const_ex_1.tileSize * Math.pow(2, this.maxZoom - z) >= this.height ||
                            x < 0 ||
                            y < 0) {
                            return const_ex_1.transPng;
                        }
                        return this._tileUrlFunction(coord);
                    };
            _this = _super.call(this, options) || this;
            if (options.mapID) {
                _this.mapID = options.mapID;
            }
            if (options.urls) {
                _this._tileUrlFunction = (0, tileurlfunction_1.createFromTemplates)(options.urls);
            }
            else if (options.url) {
                _this._tileUrlFunction = (0, tileurlfunction_1.createFromTemplates)((0, tileurlfunction_1.expandUrl)(options.url));
            }
            _this.width = options.width;
            _this.height = options.height;
            _this.maxZoom = options.maxZoom;
            _this._maxxy = Math.pow(2, _this.maxZoom) * const_ex_1.tileSize;
            _this.initialize(options);
            return _this;
        }
        return HistMap;
    }((0, mixin_1.setCustomFunctionMaplat)(source_1.XYZ)));
    exports.HistMap = HistMap;
});
//# sourceMappingURL=histmap.js.map