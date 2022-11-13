var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
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
    exports.Logger = exports.LOGGER_LEVEL = void 0;
    var excludeKeys = ["ALL", "OFF"];
    exports.LOGGER_LEVEL = {
        ALL: -99,
        DEBUG: -1,
        INFO: 0,
        WARN: 1,
        ERROR: 2,
        OFF: 99
    };
    var Logger = (function () {
        function Logger(level) {
            if (level === void 0) { level = exports.LOGGER_LEVEL.INFO; }
            this.level = level;
            this.make();
        }
        Logger.prototype.make = function () {
            var e_1, _a;
            var keys = Object.keys(exports.LOGGER_LEVEL).filter(function (key) { return !excludeKeys.includes(key); });
            try {
                for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                    var key = keys_1_1.value;
                    var l = exports.LOGGER_LEVEL[key];
                    var lowerCaseKey = key.toLowerCase();
                    this[lowerCaseKey] = this.level <= l ? console.log : function () { };
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        return Logger;
    }());
    exports.Logger = Logger;
});
//# sourceMappingURL=logger.js.map