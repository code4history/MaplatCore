(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./source/mixin"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.normalizeArg = exports.createMapInfo = exports.normalizeDegree = exports.createElement = void 0;
    var mixin_1 = require("./source/mixin");
    function createElement(domStr) {
        var context = document;
        var fragment = context.createDocumentFragment();
        var nodes = [];
        domStr = domStr
            .replace(/(<\/?)d([ >])/g, "$1div$2")
            .replace(/(<\/?)s([ >])/g, "$1span$2")
            .replace(/ din="/g, ' data-i18n="')
            .replace(/ dinh="/g, ' data-i18n-html="')
            .replace(/ c="/g, ' class="');
        var tmp = fragment.appendChild(context.createElement("div"));
        tmp.innerHTML = domStr;
        for (var i = 0; i < tmp.childNodes.length; i++) {
            var node = tmp.childNodes[i];
            if (node.nodeName && node.nodeName.toLowerCase() === "script") {
                var script = context.createElement("script");
                if (node.type) {
                    script.type = node.type;
                }
                if (node.src) {
                    script.src = node.src;
                }
                else {
                    script.text = node.text;
                }
                nodes[i] = script;
            }
            else {
                nodes[i] = node;
            }
        }
        return nodes;
    }
    exports.createElement = createElement;
    function normalizeDegree(degree) {
        while (1) {
            if (degree <= 180 && degree > -180)
                break;
            var times = degree > 0 ? -1.0 : 1.0;
            degree = degree + times * 360.0;
        }
        return degree;
    }
    exports.normalizeDegree = normalizeDegree;
    function createMapInfo(source) {
        if (!source)
            return;
        var ret = {
            mapID: source.mapID
        };
        for (var i = 0; i < mixin_1.META_KEYS.length; i++) {
            var key = mixin_1.META_KEYS[i];
            if (source[key]) {
                ret[key] = source[key];
            }
        }
        return ret;
    }
    exports.createMapInfo = createMapInfo;
    function normalizeArg(options) {
        var table = {
            max_zoom: "maxZoom",
            min_zoom: "minZoom",
            envelope_lnglats: "envelopeLngLats",
            envelopLngLats: "envelopeLngLats",
            image_extention: "imageExtension",
            image_extension: "imageExtension",
            imageExtention: "imageExtension",
            map_id: "mapID",
            sourceID: "mapID",
            source_id: "mapID",
            merc_max_zoom: "mercMaxZoom",
            merc_min_zoom: "mercMinZoom",
            zoom_restriction: "zoomRestriction",
            enable_cache: "enableCache",
            default_zoom: "defaultZoom",
            start_from: "startFrom",
            home_position: "homePosition",
            fake_radius: "fakeRadius",
            fake_center: "fakeCenter",
            fake_gps: "fakeGps",
            app_name: "appName",
            setting_file: "settingFile",
            merc_zoom: "mercZoom",
            mapbox_token: "mapboxToken",
            translate_ui: "translateUI",
            restore_session: "restoreSession",
            no_rotate: "noRotate",
            poi_template: "poiTemplate",
            poi_style: "poiStyle",
            icon_template: "iconTemplate",
            default_center: "defaultCenter",
            default_rotation: "defaultRotation",
            selected_icon: "selectedIcon",
            namespace_id: "namespaceID",
            mercator_x_shift: "mercatorXShift",
            mercator_y_shift: "mercatorYShift"
        };
        return Object.keys(table).reduce(function (opt, key) {
            if (opt[key]) {
                opt[table[key]] = opt[key];
                delete opt[key];
            }
            return opt;
        }, options);
    }
    exports.normalizeArg = normalizeArg;
});
//# sourceMappingURL=functions.js.map