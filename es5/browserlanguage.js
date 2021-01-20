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
    var browserLanguage = function () {
        var ua = window.navigator.userAgent.toLowerCase();
        try {
            var lang = void 0;
            if (ua.indexOf("chrome") != -1) {
                lang = (navigator.languages[0] ||
                    navigator.browserLanguage ||
                    navigator.language ||
                    navigator.userLanguage).split(";");
                return lang[0];
            }
            else {
                lang = (navigator.browserLanguage ||
                    navigator.language ||
                    navigator.userLanguage).split(";");
                return lang[0];
            }
        }
        catch (e) {
            return "";
        }
    };
    exports.default = browserLanguage;
});
//# sourceMappingURL=browserlanguage.js.map