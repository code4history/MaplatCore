import { META_KEYS } from "./source/mixin";
export function createElement(domStr) {
    const context = document;
    const fragment = context.createDocumentFragment();
    const nodes = [];
    domStr = domStr
        .replace(/(<\/?)d([ >])/g, "$1div$2")
        .replace(/(<\/?)s([ >])/g, "$1span$2")
        .replace(/ din="/g, ' data-i18n="')
        .replace(/ dinh="/g, ' data-i18n-html="')
        .replace(/ c="/g, ' class="');
    const tmp = fragment.appendChild(context.createElement("div"));
    tmp.innerHTML = domStr;
    for (let i = 0; i < tmp.childNodes.length; i++) {
        const node = tmp.childNodes[i];
        if (node.nodeName && node.nodeName.toLowerCase() === "script") {
            const script = context.createElement("script");
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
export function normalizeDegree(degree) {
    while (1) {
        if (degree <= 180 && degree > -180)
            break;
        const times = degree > 0 ? -1.0 : 1.0;
        degree = degree + times * 360.0;
    }
    return degree;
}
export function createMapInfo(source) {
    if (!source)
        return;
    const ret = {
        mapID: source.mapID
    };
    for (let i = 0; i < META_KEYS.length; i++) {
        const key = META_KEYS[i];
        if (source[key]) {
            ret[key] = source[key];
        }
    }
    return ret;
}
export function normalizeArg(options) {
    const table = {
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
    return Object.keys(table).reduce((opt, key) => {
        if (opt[key]) {
            opt[table[key]] = opt[key];
            delete opt[key];
        }
        return opt;
    }, options);
}
//# sourceMappingURL=functions.js.map