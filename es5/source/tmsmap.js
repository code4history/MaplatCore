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
    exports.TmsMap = void 0;
    var nowmap_1 = require("./nowmap");
    var TmsMap = (function (_super) {
        __extends(TmsMap, _super);
        function TmsMap(options) {
            if (options === void 0) { options = {}; }
            return _super.call(this, Object.assign(options, { opaque: false })) || this;
        }
        TmsMap.isBasemap_ = false;
        return TmsMap;
    }(nowmap_1.NowMap));
    exports.TmsMap = TmsMap;
});
//# sourceMappingURL=tmsmap.js.map