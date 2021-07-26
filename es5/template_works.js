var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "lodash.template", "./functions"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createHtmlFromTemplate = exports.createIconSet = void 0;
    var lodash_template_1 = __importDefault(require("lodash.template"));
    var functions_1 = require("./functions");
    function createIconSet(data) {
        var ancestors = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            ancestors[_i - 1] = arguments[_i];
        }
        var dataCopy = functions_1.normalizeArg(Object.assign({}, data));
        if (dataCopy.icon)
            return dataCopy;
        var fromAncestor = ancestors.reduce(function (prev, curr) {
            if (prev)
                return prev;
            var iconTemplate = curr.iconTemplate || curr.iconTemplate;
            if (iconTemplate) {
                return JSON.parse(lodash_template_1.default(iconTemplate)(dataCopy));
            }
            else if (curr.icon) {
                return {
                    icon: curr.icon,
                    selectedIcon: curr.selectedIcon || curr.selectedIcon
                };
            }
        }, undefined);
        if (fromAncestor) {
            dataCopy.icon = fromAncestor.icon;
            dataCopy.selectedIcon = fromAncestor.selectedIcon;
        }
        return dataCopy;
    }
    exports.createIconSet = createIconSet;
    function createHtmlFromTemplate(data) {
        var ancestors = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            ancestors[_i - 1] = arguments[_i];
        }
        data = functions_1.normalizeArg(data);
        if (data.html)
            return data;
        return (ancestors.reduce(function (prev, curr) {
            if (prev)
                return prev;
            var poiTemplate = curr.poiTemplate;
            if (poiTemplate) {
                data.html = lodash_template_1.default(poiTemplate)(data);
                data.poiStyle = data.poiStyle || curr.poiStyle;
                return data;
            }
        }, undefined) || data);
    }
    exports.createHtmlFromTemplate = createHtmlFromTemplate;
});
//# sourceMappingURL=template_works.js.map