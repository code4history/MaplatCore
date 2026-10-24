/* eslint-disable @typescript-eslint/ban-ts-comment */
// META_KEYS は依存の無い src/meta_keys.ts から読む（source/mixin.ts 経由だと OpenLayers を引き込む。
// このファイルは @maplat/core/common から読まれる）。
import { META_KEYS } from "./meta_keys";

/**
 * 同じキーでは 1 回だけ警告する関数を作る（U2・U3 の「キーごとに 1 回」）。
 * 旧クラスの起動時キーのロック・設定ファイルの機能系キーの警告と、要素の warnOnce が共有する
 * （設計 v2 A19。警告の文面と経路は各呼び出し側が持つ）。
 */
export function createOnceWarner(): (key: string, message: string) => void {
  const warned = new Set<string>();
  return (key, message) => {
    if (warned.has(key)) return;
    warned.add(key);
    console.warn(message);
  };
}

// 旧クラス MaplatApp の非推奨の告知（release-policy §9.1 手順 1 の「実行時に 1 回だけ警告」）。
// 粒度は「同一プロセスで 1 回」なので、createOnceWarner（呼び出し側ごとに 1 回）ではなく、
// このモジュールの水準で覚える。要素（<maplat-app>）の経路は内部で MaplatApp を作るため、
// 警告するかどうかは src/index.ts のコンストラクタが option の内部キー "__maplatElementMode" の
// 有無で見分ける（ここでは経路を見分けない。文言だけを持つ）。
let maplatAppDeprecationWarned = false;

const MAPLAT_APP_DEPRECATION_MESSAGE =
  "MaplatApp: the MaplatApp class is deprecated and will be removed in 2.0. " +
  "Use the <maplat-app> element (@maplat/core/element) instead.";

/**
 * 旧クラス MaplatApp の非推奨を、同一プロセスで 1 回だけ警告する（release-policy §9.1 手順 1）。
 * 呼ぶのは旧クラスのコンストラクタだけ（要素の経路は呼ばない。src/index.ts を参照）。
 */
export function warnMaplatAppDeprecated(): void {
  if (maplatAppDeprecationWarned) return;
  maplatAppDeprecationWarned = true;
  console.warn(MAPLAT_APP_DEPRECATION_MESSAGE);
}

/**
 * 「1 回だけ」の記憶を戻す（テストの間の初期化用）。
 * warnMaplatAppDeprecated の付属品で、公開面ではない（@maplat/core の入口からは出さない）。
 * @internal
 */
export function resetMaplatAppDeprecationWarning(): void {
  maplatAppDeprecationWarned = false;
}

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
    if (opt[key] !== undefined) {
      throw new Error(`Invalid Maplat option key: ${key}. Use "${table[key]}" instead.`);
      //opt[table[key]] = opt[key];
      //delete opt[key];
    }
    return opt;
  }, options);
}
