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
    function selectord(resource, locale) {
        if (typeof resource === 'string') {
            return resource;
        }
        if (locale === 'ja') {
            return resource.ja;
        }
        return resource.en;
    }
    exports.default = selectord;
});
//# sourceMappingURL=selector.js.map