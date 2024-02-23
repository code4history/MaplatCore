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
        define(["require", "exports", "ol/tilegrid/TileGrid.js", "ol/source/TileImage.js", "ol/source/Zoomify.js", "ol/tilegrid/common.js", "ol/size.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TileGrid_js_1 = __importDefault(require("ol/tilegrid/TileGrid.js"));
    var TileImage_js_1 = __importDefault(require("ol/source/TileImage.js"));
    var Zoomify_js_1 = require("ol/source/Zoomify.js");
    var common_js_1 = require("ol/tilegrid/common.js");
    var size_js_1 = require("ol/size.js");
    ;
    var Maplat = (function (_super) {
        __extends(Maplat, _super);
        function Maplat(options) {
            var _this = this;
            var op = options;
            var size = op.size;
            var tilePixelRatio = options.tilePixelRatio || 1;
            var imageWidth = size[0];
            var imageHeight = size[1];
            var tierSizeInTiles = [];
            var tileSize = options.tileSize || common_js_1.DEFAULT_TILE_SIZE;
            var tileSizeForTierSizeCalculation = tileSize * tilePixelRatio;
            var width = imageWidth;
            var height = imageHeight;
            while (width > tileSizeForTierSizeCalculation ||
                height > tileSizeForTierSizeCalculation) {
                tierSizeInTiles.push([
                    Math.ceil(width / tileSizeForTierSizeCalculation),
                    Math.ceil(height / tileSizeForTierSizeCalculation),
                ]);
                width >>= 1;
                height >>= 1;
            }
            tierSizeInTiles.push([1, 1]);
            tierSizeInTiles.reverse();
            var resolutions = [tilePixelRatio];
            var tileCountUpToTier = [0];
            for (var i = 1, ii = tierSizeInTiles.length; i < ii; i++) {
                resolutions.push(tilePixelRatio << i);
                tileCountUpToTier.push(tierSizeInTiles[i - 1][0] * tierSizeInTiles[i - 1][1] +
                    tileCountUpToTier[i - 1]);
            }
            resolutions.reverse();
            var tileGrid = new TileGrid_js_1.default({
                tileSize: tileSize,
                extent: options.extent || [0, -imageHeight, imageWidth, 0],
                resolutions: resolutions,
            });
            var url = options.url;
            var tileUrlFunction = function (tileCoord) {
                return url
                    .replace('{z}', "".concat(tileCoord[0]))
                    .replace('{x}', "".concat(tileCoord[1]))
                    .replace('{y}', "".concat(tileCoord[2]));
            };
            var ZoomifyTileClass = Zoomify_js_1.CustomTile.bind(null, (0, size_js_1.toSize)(tileSize * tilePixelRatio));
            _this = _super.call(this, {
                attributions: options.attributions,
                cacheSize: options.cacheSize,
                crossOrigin: options.crossOrigin,
                interpolate: options.interpolate,
                projection: options.projection,
                tilePixelRatio: tilePixelRatio,
                reprojectionErrorThreshold: options.reprojectionErrorThreshold,
                tileClass: ZoomifyTileClass,
                tileGrid: tileGrid,
                tileUrlFunction: tileUrlFunction,
                transition: options.transition,
            }) || this;
            _this.zDirection = options.zDirection;
            return _this;
        }
        return Maplat;
    }(TileImage_js_1.default));
    exports.default = Maplat;
});
//# sourceMappingURL=Maplat.js.map