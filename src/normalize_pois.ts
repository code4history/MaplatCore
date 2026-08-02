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
    // step1: モード判定（m4-t5 で fetch の前へ移した）。
    //
    // 【是正の理由】以前はここで全要素に nodesLoader を適用してから、解決後の先頭要素で
    // モードを判定していた。そのため **配列要素位置の裸 URL 文字列が判定より前に中身へ化け**、
    // 中身がレガシー POI 配列だと「配列の配列」になって POI オブジェクト配列モードへ落ち、
    // POI が壊れていた（["url"] / ["url", FC] が壊れる）。中身が FeatureCollection のときだけ
    // 偶然レイヤ配列モードへ入って正常に見えていた。
    // ラッパー（plain object）は nodesLoader が素通しするため元から fetch 前に判別できており、
    // **正しい判定順は本ファイル内に既に存在していた**。裸 URL だけがその恩恵を受けていない
    // という非対称を解消する（m4 マイルストーン再設計 G5 / MC7）。
    //
    // 【判定表】生の先頭要素だけで決める（m4-t5 設計 §5.1 が唯一の定義箇所）:
    //   文字列                  → レイヤ配列（レガシー POI 配列の要素は POI オブジェクトであり
    //                              文字列にはなり得ない ∴ 配列位置の文字列は「レイヤの URL」以外
    //                              に解釈の余地がない。**中身を見ないからこそ健全**である）
    //   FeatureCollection       → レイヤ配列（現行どおり）
    //   isPoiLayerRef が真      → レイヤ配列（現行どおり・m18-t4）
    //   それ以外 / 空配列        → POI オブジェクト配列（配列全体で1レイヤ・現行どおり）
    const head = layers[0];
    const isLayerArray =
      layers.length > 0 &&
      (typeof head === "string" ||
        (isPlainObject(head) && head.type === "FeatureCollection") ||
        isPoiLayerRef(head));

    if (isLayerArray) {
      // step2: レイヤ配列モード。各要素を分解し layer を解決 → normalizeLayer → applyLayerOverrides
      const entries = await Promise.all(
        layers.map(async (x: any, index: any) => {
          let data: any;
          let overrides: Record<string, any> | null;
          if (isPoiLayerRef(x)) {
            // wrapper.layer を nodesLoader で解決（URL ならここで fetch）
            data = await nodesLoader(x.layer);
            overrides = extractOverrides(x);
          } else {
            // 裸 URL 文字列はここで初めて fetch される（判定を通過した後）。
            // 非文字列（素の FC など）に対しては nodesLoader が素通しするため挙動は変わらない
            data = await nodesLoader(x);
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
      // step3: POI オブジェクト配列モード。配列全体で1レイヤ。
      // **要素ごとの nodesLoader 解決は維持する**（m4-t5 設計 §5.3）。以前もこのモードで
      // 全要素を解決しており、要素が「単一 POI オブジェクトを返す URL」のときに正しく動く。
      // 実データには無い形だが、動いている挙動を根拠なく落とさない（AGENTS.md 原則2）。
      // ∴ m4-t5 の変更はモード判定の位置だけに閉じている。
      layers = await Promise.all(layers.map(async (x: any) => await nodesLoader(x)));
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

