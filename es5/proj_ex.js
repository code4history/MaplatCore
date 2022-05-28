(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "ol/proj"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.transformDirect = void 0;
    var proj_1 = require("ol/proj");
    function transformDirect(src, dist, xy) {
        var srcCode = typeof src === "string" ? src : src.getCode();
        var distCode = typeof dist === "string" ? dist : dist.getCode();
        var func = (0, proj_1.getTransform)(src, dist);
        if (func == proj_1.identityTransform && srcCode != distCode) {
            var srcFunc = (0, proj_1.getTransform)(src, "EPSG:3857");
            var distFunc = (0, proj_1.getTransform)("EPSG:3857", dist);
            if (srcFunc == proj_1.identityTransform && srcCode != "EPSG:3857")
                throw "Transform of Source projection is not defined.";
            if (distFunc == proj_1.identityTransform && distCode != "EPSG:3857")
                throw "Transform of Distination projection is not defined.";
            func = function (xy) {
                return (0, proj_1.transform)((0, proj_1.transform)(xy, src, "EPSG:3857"), "EPSG:3857", dist);
            };
            var invFunc = function (xy) {
                return (0, proj_1.transform)((0, proj_1.transform)(xy, dist, "EPSG:3857"), "EPSG:3857", src);
            };
            (0, proj_1.addCoordinateTransforms)(src, dist, func, invFunc);
        }
        if (xy) {
            return func(xy);
        }
    }
    exports.transformDirect = transformDirect;
});
//# sourceMappingURL=proj_ex.js.map