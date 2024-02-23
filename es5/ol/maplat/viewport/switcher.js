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
        define(["require", "exports", "ol/proj.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var proj_js_1 = require("ol/proj.js");
    var thetas = [0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75].map(function (pow) { return pow * Math.PI; });
    function center2Vicinities(center, radius) {
        var vicinities = thetas.map(function (theta) { return [
            center[0] + Math.sin(theta) * radius,
            center[1] + Math.cos(theta) * radius,
        ]; });
        vicinities.unshift(center);
        return vicinities;
    }
    function normalizeAngle(theta) {
        while (theta > Math.PI || theta <= -Math.PI) {
            theta = theta > Math.PI ? theta - 2 * Math.PI : theta + 2 * Math.PI;
        }
        return theta;
    }
    function switcher(fromCenter, fromRotation, fromResolution, baseRadius, fromProj, toProj, baseProj) {
        var _a;
        if (baseProj === void 0) { baseProj = 'EPSG:3857'; }
        var midCenter = fromCenter, midRotation = fromRotation, midResolution = fromResolution;
        if (fromProj != baseProj) {
            _a = __read(maplat2Base(fromCenter, fromRotation, fromResolution, baseRadius, fromProj, baseProj), 3), midCenter = _a[0], midRotation = _a[1], midResolution = _a[2];
        }
        if (toProj != baseProj) {
            return base2Maplat(midCenter, midRotation, midResolution, baseRadius, toProj, baseProj);
        }
        return [midCenter, midRotation, midResolution];
    }
    function maplat2Base(maplatCenter, maplatRotation, maplatResolution, baseRadius, maplatProj, baseProj) {
        if (baseProj === void 0) { baseProj = 'EPSG:3857'; }
        var baseCenter = (0, proj_js_1.transform)(maplatCenter, maplatProj, baseProj);
        var maplatParams = base2MaplatParams(baseCenter, baseRadius, maplatProj, baseProj);
        var baseResolution = (maplatResolution * baseRadius) / maplatParams[2];
        var baseRotation = normalizeAngle(maplatRotation + maplatParams[1]);
        return [baseCenter, baseRotation, baseResolution];
    }
    function base2Maplat(baseCenter, baseRotation, baseResolution, baseRadius, maplatProj, baseProj) {
        if (baseProj === void 0) { baseProj = 'EPSG:3857'; }
        var maplatParams = base2MaplatParams(baseCenter, baseRadius, maplatProj, baseProj);
        var maplatCenter = maplatParams[0];
        var maplatResolution = (baseResolution * maplatParams[2]) / baseRadius;
        var maplatRotation = normalizeAngle(baseRotation - maplatParams[1]);
        return [maplatCenter, maplatRotation, maplatResolution];
    }
    function base2MaplatParams(center, radius, maplatProj, baseProj) {
        var maplatVicinities = center2Vicinities(center, radius).map(function (baseCoord) { return (0, proj_js_1.transform)(baseCoord, baseProj, maplatProj); });
        var maplatCenter = maplatVicinities.shift();
        var maplatParams = maplatVicinities
            .map(function (maplatCoord, index) {
            var vacinity = [
                maplatCoord[0] - maplatCenter[0],
                maplatCoord[1] - maplatCenter[1],
            ];
            var theta = Math.atan2(vacinity[0], vacinity[1]);
            var distance = Math.sqrt(Math.pow(vacinity[0], 2) + Math.pow(vacinity[1], 2));
            return [normalizeAngle(theta - thetas[index]), distance];
        })
            .reduce(function (prev, curr, index) {
            var thetax = Math.cos(curr[0]);
            var thetay = Math.sin(curr[0]);
            var dist = curr[1];
            if (!prev) {
                return [thetax, thetay, dist];
            }
            prev[0] = prev[0] + thetax;
            prev[1] = prev[1] + thetay;
            prev[2] = prev[2] + dist;
            if (index == 7) {
                return [maplatCenter, Math.atan2(prev[1], prev[0]), prev[2] / 8];
            }
            return prev;
        }, null);
        return maplatParams;
    }
    exports.default = switcher;
});
//# sourceMappingURL=switcher.js.map