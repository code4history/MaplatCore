var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "mathjs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mathjs_1 = require("mathjs");
    function gcp2Wld(pixelCoordinates, geoCoordinates) {
        var A = [];
        var Bx = [];
        var By = [];
        for (var i = 0; i < pixelCoordinates.length; i++) {
            var _a = __read([pixelCoordinates[i][0], pixelCoordinates[i][1]], 2), px = _a[0], py = _a[1];
            var _b = __read([geoCoordinates[i][0], geoCoordinates[i][1]], 2), gx = _b[0], gy = _b[1];
            A.push([px, py, 1, 0, 0, 0]);
            A.push([0, 0, 0, px, py, 1]);
            Bx.push(gx);
            Bx.push(0);
            By.push(0);
            By.push(gy);
        }
        var AtA = (0, mathjs_1.multiply)((0, mathjs_1.transpose)(A), A);
        var AtBx = (0, mathjs_1.multiply)((0, mathjs_1.transpose)(A), Bx);
        var AtBy = (0, mathjs_1.multiply)((0, mathjs_1.transpose)(A), By);
        var paramsX = (0, mathjs_1.multiply)((0, mathjs_1.inv)(AtA), AtBx);
        var paramsY = (0, mathjs_1.multiply)((0, mathjs_1.inv)(AtA), AtBy);
        return {
            xScale: paramsX[0],
            yRotation: paramsX[1],
            xRotation: paramsY[3],
            yScale: paramsY[4],
            xOrigin: paramsX[2],
            yOrigin: paramsY[5],
        };
    }
    exports.default = gcp2Wld;
});
//# sourceMappingURL=gcp2Wld.js.map