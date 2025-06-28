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
    exports.NowMap = void 0;
    var source_1 = require("ol/source");
    var mixin_1 = require("./mixin");
    var NowMap = (function (_super) {
        __extends(NowMap, _super);
        function NowMap(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, (0, mixin_1.addCommonOptions)(options)) || this;
            if (options.mapID) {
                _this.mapID = options.mapID;
            }
            _this.initialize(options);
            return _this;
        }
        return NowMap;
    }((0, mixin_1.setCustomFunctionBase)(source_1.XYZ)));
    exports.NowMap = NowMap;
});
//# sourceMappingURL=nowmap.js.map