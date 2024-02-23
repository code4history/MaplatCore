var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "ol/source/Vector"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Vector_1 = __importDefault(require("ol/source/Vector"));
    function filter(source, options) {
        if (options === void 0) { options = {}; }
        var extent = options.extent;
        var projectTo = options.projectTo;
        var retSource = new Vector_1.default();
        source.forEachFeature(function (f) {
            var retF = f.clone();
            if (projectTo) {
                retF.setGeometry(retF.getGeometry().transform('EPSG:4326', projectTo));
            }
            if (!extent || retF.getGeometry().intersectsExtent(extent)) {
                retSource.addFeature(retF);
            }
        });
        return retSource;
    }
    exports.default = filter;
});
//# sourceMappingURL=filter.js.map