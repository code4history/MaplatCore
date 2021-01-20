(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "ol"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.View = void 0;
    var ol_1 = require("ol");
    Object.defineProperty(exports, "View", { enumerable: true, get: function () { return ol_1.View; } });
    ol_1.View.prototype.getDecimalZoom = function () {
        var resolution = this.getResolution();
        var offset = Math.log(this.maxResolution_ / resolution) / Math.log(2);
        return offset !== undefined ? this.minZoom_ + offset : offset;
    };
});
//# sourceMappingURL=view_ex.js.map