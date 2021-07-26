/* eslint-disable @typescript-eslint/ban-ts-comment */
import { META_KEYS } from "./source/mixin";

export function createElement(domStr: string) {
  const context = document;
  const fragment = context.createDocumentFragment();
  const nodes = [];
  domStr = domStr
    .replace(/(<\/?)d([ >])/g, "$1div$2")
    .replace(/(<\/?)s([ >])/g, "$1span$2")
    .replace(/ din="/g, ' data-i18n="')
    .replace(/ dinh="/g, ' data-i18n-html="')
    .replace(/ c="/g, ' class="');
  // ダミーのDIV要素を作成して中にテキストを挿入
  const tmp = fragment.appendChild(context.createElement("div"));
  tmp.innerHTML = domStr;
  for (let i = 0; i < tmp.childNodes.length; i++) {
    // ダミーのDIV要素からHTML要素としてchildNodesで取り出せる
    const node = tmp.childNodes[i];
    // SCRIPT要素は新たに生成し直さなければ実行されない
    if (node.nodeName && node.nodeName.toLowerCase() === "script") {
      const script = context.createElement("script");
      // @ts-expect-error
      if (node.type) {
        // @ts-expect-error
        script.type = node.type;
      }
      // @ts-expect-error
      if (node.src) {
        // @ts-expect-error
        script.src = node.src;
      } else {
        // @ts-expect-error
        script.text = node.text;
      }
      nodes[i] = script;
    } else {
      // SCRIPT以外の要素
      nodes[i] = node;
    }
  }
  // HTML要素配列を返す
  return nodes;
}
export function normalizeDegree(degree: number) {
  // eslint-disable-next-line no-constant-condition
  while (1) {
    if (degree <= 180 && degree > -180) break;
    const times = degree > 0 ? -1.0 : 1.0;
    degree = degree + times * 360.0;
  }
  return degree;
}

export function createMapInfo(source: any) {
  if (!source) return;
  const ret: any = {
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

export function normalizeArg(options: Record<string, any>) {
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
  } as const;
  return (Object.keys(table) as (keyof typeof table)[]).reduce((opt, key) => {
    if (opt[key]) {
      opt[table[key]] = opt[key];
      delete opt[key];
    }
    return opt;
  }, options);
}
