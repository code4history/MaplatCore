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
    exports.canvBase = exports.tileSize = exports.transPng = exports.MERC_CROSSMATRIX = exports.MERC_MAX = void 0;
    exports.MERC_MAX = 20037508.342789244;
    exports.MERC_CROSSMATRIX = [
        [0.0, 0.0],
        [0.0, 1.0],
        [1.0, 0.0],
        [0.0, -1.0],
        [-1.0, 0.0]
    ];
    exports.transPng = "data:image/png;base64," +
        "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAB3RJTUUH3QgIBToaSbAjlwAAABd0" +
        "RVh0U29mdHdhcmUAR0xEUE5HIHZlciAzLjRxhaThAAAACHRwTkdHTEQzAAAAAEqAKR8AAAAEZ0FN" +
        "QQAAsY8L/GEFAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAFRJREFUeNrtwQEBAAAAgJD+" +
        "r+4ICgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
        "AAAAAAAAAAAAABgBDwABHHIJwwAAAABJRU5ErkJggg==";
    exports.tileSize = 256;
    exports.canvBase = "<canvas width=\"" + exports.tileSize + "\" height=\"" + exports.tileSize + "\" src=\"" + exports.transPng + "\"></canvas>";
});
//# sourceMappingURL=const_ex.js.map