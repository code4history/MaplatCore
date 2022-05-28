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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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
    exports.Logger = exports.LoggerLevel = void 0;
    exports.LoggerLevel = {
        ALL: -99,
        DEBUG: -1,
        INFO: 0,
        WARN: 1,
        ERROR: 2,
        OFF: 99
    };
    var Logger = (function () {
        function Logger(level) {
            this.level = isNaN(level) ? exports.LoggerLevel.INFO : level;
            this.make();
        }
        Logger.prototype.make = function () {
            for (var key in console) {
                var l = exports.LoggerLevel[key.toUpperCase()];
                if (!l) {
                    continue;
                }
                if (this.level <= l) {
                    if (Function.bind) {
                        Logger.prototype[key] = (function () {
                            var _args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                _args[_i] = arguments[_i];
                            }
                            return console.log.bind(console);
                        })(key);
                    }
                    else {
                        Logger.prototype[key] = (function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return console.log.apply(console, __spreadArray([], __read(args), false));
                        })(key);
                    }
                }
                else {
                    Logger.prototype[key] = function () { };
                }
            }
        };
        return Logger;
    }());
    exports.Logger = Logger;
});
//# sourceMappingURL=logger.js.map