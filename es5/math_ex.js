(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getDistance = exports.recursiveRound = exports.randomFromCenter = void 0;
    function randomFromCenter(center, pow) {
        return center + (Math.random() - 0.5) * pow;
    }
    exports.randomFromCenter = randomFromCenter;
    function recursiveRound(val, decimal) {
        if (val instanceof Array)
            return val.map(function (item) { return recursiveRound(item, decimal); });
        var decVal = Math.pow(10, decimal);
        return Math.round(val * decVal) / decVal;
    }
    exports.recursiveRound = recursiveRound;
    function radians(deg) {
        return (deg * Math.PI) / 180;
    }
    function getDistance(lnglat1, lnglat2) {
        return (6378.14 *
            Math.acos(Math.cos(radians(lnglat1[1])) *
                Math.cos(radians(lnglat2[1])) *
                Math.cos(radians(lnglat2[0]) - radians(lnglat1[0])) +
                Math.sin(radians(lnglat1[1])) * Math.sin(radians(lnglat2[1]))));
    }
    exports.getDistance = getDistance;
});
//# sourceMappingURL=math_ex.js.map