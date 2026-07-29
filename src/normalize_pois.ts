// Async initializer 6: Load pois setting
import type { FeatureCollection } from "geojson";

export async function nodesLoader(
  nodes: string | Record<string, unknown>
): Promise<Record<string, unknown>> {
  if (typeof nodes === "string") {
    const url = nodes.match(/\//) ? nodes : `pois/${nodes}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Fail to load poi json");
    }
    const resp = await response.json();
    return resp as Record<string, unknown>;
  } else {
    return nodes;
  }
}

// --- pois layer ref (wrapper) support (m18-t4) ---
// 許可キー方式（hide / title / icon / selectedIcon のみ）。t3 v1.3 §5.2/§5.3
const OVERRIDE_KEYS = ["hide", "title", "icon", "selectedIcon"] as const;
const COORD_KEYS = [
  "lnglat",
  "lng",
  "lat",
  "longitude",
  "latitude"
] as const;

function isPlainObject(x: any): boolean {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

// 配列要素文脈のラッパー判別。t3 v1.3 §5.2 の規則。
// layer が string または FeatureCollection であり、かつ座標キーを持たない plain object。
export function isPoiLayerRef(x: any): boolean {
  if (!isPlainObject(x)) return false;
  if (x.type === "FeatureCollection") return false;
  const layer = x.layer;
  const layerIsString = typeof layer === "string";
  const layerIsFc = isPlainObject(layer) && layer.type === "FeatureCollection";
  if (!layerIsString && !layerIsFc) return false;
  if (COORD_KEYS.some(k => x[k] !== undefined)) return false;
  return true;
}

// 非配列（pois 全体）での受理には上書きキーの存在を追加要求する（旧レイヤ辞書の保護）
function isPoiLayerRefAsWhole(x: any): boolean {
  return isPoiLayerRef(x) && OVERRIDE_KEYS.some(k => x[k] !== undefined);
}

// 許可キーのみ抽出。未知キーは破棄して console.warn（throw しない・forward 互換）。
function extractOverrides(x: Record<string, any>): Record<string, any> {
  const overrides: Record<string, any> = {};
  for (const [key, value] of Object.entries(x)) {
    if (key === "layer") continue;
    if ((OVERRIDE_KEYS as readonly string[]).includes(key)) {
      overrides[key] = value;
      continue;
    }
    console.warn(`[Maplat] pois layer ref: unknown override key ignored: ${key}`);
  }
  return overrides;
}

// normalizeLayer の戻り値（= FC.properties 展開後の cluster）へ上書きを合成。
// 有効値のみ上書き（無効値はデータ側の値が残る）。
function applyLayerOverrides(
  cluster: any,
  overrides: Record<string, any> | null
): any {
  if (!overrides) return cluster;
  if (overrides.hide === true) cluster.hide = true;
  const title = overrides.title;
  if (
    typeof title === "string"
      ? title !== ""
      : isPlainObject(title) && Object.keys(title).length > 0
  ) {
    cluster.name = title; // title → cluster.name
  }
  for (const key of ["icon", "selectedIcon"] as const) {
    const v = overrides[key];
    if (typeof v === "string" && v !== "") cluster[key] = v;
  }
  return cluster;
}

//pois: Process layers
export async function normalizeLayers(layers: any, options: any) {
  // Resolve url cases
  layers = await nodesLoader(layers);

  //In case "layers" is array
  if (Array.isArray(layers)) {
    // step1: 現行どおり全要素に nodesLoader を適用して解決する。
    // ラッパー（plain object）は nodesLoader が素通しするため、この段階では
    // wrapper.layer の fetch は行われない（§3.4(a) 処理順・normative）。
    layers = await Promise.all(
      layers.map(async x => await nodesLoader(x))
    );
    // step2: 解決後の先頭要素でモード判定。
    // FC 配列モード または ラッパーを含むレイヤ配列モード。
    if (
      layers.length > 0 &&
      (layers[0].type === "FeatureCollection" || isPoiLayerRef(layers[0]))
    ) {
      // step3: レイヤ配列モード。各要素を分解し wrapper.layer を解決 → normalizeLayer → applyLayerOverrides
      const entries = await Promise.all(
        layers.map(async (x: any, index: any) => {
          let data: any;
          let overrides: Record<string, any> | null;
          if (isPoiLayerRef(x)) {
            // wrapper.layer を初めて nodesLoader で解決（URL ならここで fetch）
            data = await nodesLoader(x.layer);
            overrides = extractOverrides(x);
          } else {
            // 現行どおり（素の FC など）
            data = x;
            overrides = null;
          }
          // key は解決後データ由来（ラッパー自身の id は許可キー外＝破棄+warn）
          let key = data.id || (data.properties && data.properties.id);
          if (!key) {
            if (index === 0) key = "main";
            else throw "POI layers include bad key setting";
          }
          const cluster = normalizeLayer(data, key, options);
          return [key, applyLayerOverrides(cluster, overrides)];
        })
      );
      layers = Object.fromEntries(entries);
      //In case old type single layer spec
    } else {
      // step4: POI オブジェクト配列モード。分解も wrapper.layer の解決も一切行わない（現行どおり）
      layers = {
        main: normalizeLayer(layers, "main", options)
      };
    }
    // In case of single FeatureCollection
  } else if (layers.type === "FeatureCollection") {
    const key =
      layers.id || (layers.properties && layers.properties.id) || "main";
    layers = { [key]: normalizeLayer(layers, key, options) };
    // In case of pois layer ref as a whole (wrapper of the whole pois)
  } else if (isPoiLayerRefAsWhole(layers)) {
    // §3.4(b): layers.layer を解決し単一 FC と同じ key 決定で合成
    const data: any = await nodesLoader(layers.layer);
    const key = data.id || (data.properties && data.properties.id) || "main";
    const cluster = normalizeLayer(data, key, options);
    layers = { [key]: applyLayerOverrides(cluster, extractOverrides(layers)) };
    // In case current non-geojson layers spec
  } else {
    Object.keys(layers).map(key => {
      layers[key] = normalizeLayer(layers[key], key, options);
    });
  }

  // Add main layer if not exists
  if (!layers["main"]) {
    layers["main"] = normalizeLayer([], "main", options);
  }
  Object.keys(layers).map(key => {
    addIdToPoi(layers, key, options);
  });

  return layers;
}

//pois: Process layers
export function normalizeLayer(layer: any, key: any, options: any) {
  //In case "layer" is array (Old spec)
  if (Array.isArray(layer)) {
    layer = {
      pois: layer.map(x => normalizePoi(x))
    };
    //In case "layer" is FeatureCollection
  } else if (layer.type === "FeatureCollection") {
    const buffer = Object.assign({}, layer.properties || {});
    if (layer.name) buffer.name = layer.name;
    buffer.pois = layer.features.map((x: any) => normalizePoi(x));
    layer = buffer;
  }

  if (typeof layer.id === "undefined") {
    layer.id = key;
  } else {
    if (layer.id !== key) throw "POI layers include bad key setting";
  }
  if (!layer.namespaceID)
    layer.namespaceID = `${options.namespace ? `${options.namespace}#` : ""
      }${key}`;
  if (!layer.name) layer.name = key === "main" ? options.name : key;
  if (!layer.pois) layer.pois = [];

  return layer;
}

//pois: Process poi
export function normalizePoi(poi: any) {
  //In case "poi" is GeoJson(Point)
  if (poi.type === "Feature") {
    const buffer = Object.assign({}, poi.properties || {});
    buffer.lnglat = poi.geometry.coordinates;
    if (!buffer.id) buffer.id = poi.id;
    if (!buffer.name) buffer.name = poi.name;
    poi = buffer;
  }
  if (!poi.lnglat)
    poi.lnglat = [poi.lng || poi.longitude, poi.lat || poi.latitude];
  delete poi.lng;
  delete poi.lat;
  delete poi.longitude;
  delete poi.latitude;
  return poi;
}

// Add id to every pois
export function addIdToPoi(layers: any, key: any, options: any) {
  if (!layers[key]) return;
  const cluster = layers[key];
  const pois = cluster.pois;
  if (!cluster.__nextId) {
    cluster.__nextId = 0;
  }
  pois.map((poi: any) => {
    if (!poi.id) {
      poi.id = `${key}_${cluster.__nextId}`;
      cluster.__nextId++;
    }
    if (!poi.namespaceID) {
      poi.namespaceID = `${options.namespace ? `${options.namespace}#` : ""}${poi.id}`;
    }
  });
}

// pois layer ref（ラッパー）の公開型（m18-t4・§3.5）。
// layer は URL 文字列 or インライン FeatureCollection。runtime 判別述語 isPoiLayerRef と一致。
export type PoiLayerRef = {
  layer: string | FeatureCollection;
  hide?: boolean;
  title?: string | Record<string, string>;
  icon?: string;
  selectedIcon?: string;
};

