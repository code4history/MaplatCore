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
        define(["require", "exports", "ol/source", "./mixin"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GoogleMap = void 0;
    var source_1 = require("ol/source");
    var mixin_1 = require("./mixin");
    var GoogleMap = (function (_super) {
        __extends(GoogleMap, _super);
        function GoogleMap(options) {
            if (options === void 0) { options = {}; }
            var _this = this;
            var parentOptions = Object.assign({}, options);
            parentOptions.mapType = options.maptype.match(/^google_(.+)$/) ? RegExp.$1 : "roadmap";
            parentOptions.layerTypes = (options.layers || []).map(function (layer) { return "layer".concat(layer.charAt(0).toUpperCase()).concat(layer.slice(1).toLowerCase()); });
            _this = _super.call(this, parentOptions) || this;
            if (options.mapID) {
                _this.mapID = options.mapID;
            }
            _this.initialize(options);
            return _this;
        }
        return GoogleMap;
    }((0, mixin_1.setCustomFunctionBase)(source_1.Google)));
    exports.GoogleMap = GoogleMap;
});
//# sourceMappingURL=googlemap.js.map