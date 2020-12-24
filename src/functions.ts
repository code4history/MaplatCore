import { META_KEYS } from "./source_ex";
export function createElement(domStr: any) {
    const context = document, fragment = context.createDocumentFragment(), nodes = [];
    let i = 0;
    // ダミーのDIV要素を作成して中にテキストを挿入
    const tmp = fragment.appendChild(context.createElement("div"));
    tmp.innerHTML = domStr;
    for (; i < tmp.childNodes.length; i++) {
        // ダミーのDIV要素からHTML要素としてchildNodesで取り出せる
        const node = tmp.childNodes[i];
        // SCRIPT要素は新たに生成し直さなければ実行されない
        if ((node as any).tagName && (node as any).tagName.toLowerCase() === "script") {
            const script = context.createElement("script");
            if ((node as any).type) {
                script.type = (node as any).type;
            }
            if ((node as any).src) {
                script.src = (node as any).src;
            }
            else {
                script.text = (node as any).text;
            }
            nodes[i] = script;
        }
        else {
            // SCRIPT以外の要素
            nodes[i] = node;
        }
    }
    // HTML要素配列を返す
    return nodes;
}
export function normalizeDegree(degree: any) {
    // eslint-disable-next-line no-constant-condition
    while (1) {
        if (degree <= 180 && degree > -180)
            break;
        const times = degree > 0 ? -1.0 : 1.0;
        degree = degree + times * 360.0;
    }
    return degree;
}
export function createMapInfo(source: any) {
    if (!source)
        return;
    const ret = {
        mapID: source.mapID
    };
    for (let i = 0; i < META_KEYS.length; i++) {
        const key = META_KEYS[i];
        if (source[key]) {
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            ret[key] = source[key];
        }
    }
    return ret;
}
export function normalizeArg(options: any) {
    const table = {
        max_zoom: "maxZoom",
        min_zoom: "minZoom",
        envelope_lnglats: "envelopeLngLats",
        envelopLngLats: "envelopeLngLats",
        image_extention: "imageExtention",
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
        //        maxZoom: 'max_zoom',
        //        minZoom: 'min_zoom',
        //        envelopeLngLats: 'envelope_lnglats',
        //        envelopLngLats: 'envelope_lnglats',
        //        mercatorXShift: 'mercator_x_shift',
        //        mercatorYShift: 'mercator_y_shift',
        //        imageExtention: 'image_extention',
        //        mapID: 'map_id',
        //        sourceID: 'map_id',
        //        source_id: 'map_id'
    };
    return Object.keys(table).reduce((opt, key) => {
        if (opt[key]) {
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            opt[table[key]] = opt[key];
            delete opt[key];
        }
        return opt;
    }, options);
}
