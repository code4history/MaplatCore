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
        define(["require", "exports", "./nowmap"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MapboxMap = void 0;
    var nowmap_1 = require("./nowmap");
    var MapboxMap = (function (_super) {
        __extends(MapboxMap, _super);
        function MapboxMap(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, options) || this;
            _this.style = "";
            _this.accessToken = "";
            _this.style = options.style;
            _this.mapboxMap = options.mapboxMap;
            return _this;
        }
        MapboxMap.isMapbox_ = true;
        return MapboxMap;
    }(nowmap_1.NowMap));
    exports.MapboxMap = MapboxMap;
});
//# sourceMappingURL=mapboxmap.js.map