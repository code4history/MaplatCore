// 範囲外の POI の扱い（判定・描く層・押せる条件・選んでいる間の引き戻し）。
//
// 前面の地図の範囲に無い POI は、背面の地図（古地図の下の基本地図）にメルカトルの
// 座標で立てる。MaplatApp.prototype にメソッドを足さない（旧 API の一覧を変えない）
// ため、処理はこのモジュールの関数と、インスタンスのフィールドに置く。
import { Feature } from "ol";
import { Point } from "ol/geom";
import { transform } from "ol/proj";
import { markerStyleFrom } from "./map_ex";

/** 地図の marker 層の名前（MaplatMap のコンストラクタが作る層）。 */
const MARKER_LAYER = "marker";

/**
 * 背面のピンを紙の上でも押せるようにする透過度の下限（0〜100）。
 * `null`（既定）は「紙が覆っている所では押せない」。数を入れると、背面の地図の透過度が
 * その数以上なら紙の上でも押せる。実行中に切り替える口は setBackPinHitMinTransparency。
 */
export let BACK_PIN_HIT_MIN_TRANSPARENCY: number | null = null;

/** 上の下限を切り替える（既定は null）。 */
export function setBackPinHitMinTransparency(value: number | null): void {
  BACK_PIN_HIT_MIN_TRANSPARENCY = value;
}

/** 範囲外を選んでいる間の状態。`pending` は判定の結果待ち。 */
export interface OutsideSelection {
  id: string;
  merc?: number[];
  pending?: boolean;
}

/**
 * このモジュールが読む `app` の面（MaplatApp のインスタンス、または同じ形の stub）。
 * ここに載っているもの以外は読まない。
 */
export interface OutsidePoisApp {
  from?: any;
  backMap?: any;
  mapObject?: any;
  logger?: any;
  overlay?: boolean;
  __selectedMarker?: any;
  __outsideSelection?: OutsideSelection;
  __hideOutsidePois?: boolean;
  getTransparency?(): any;
  getMarker?(id: any): any;
  setViewpoint?(viewpoint: any): void;
}

/** 判定の結果。 */
export type MarkerClass =
  | { kind: "inside"; xy: number[] }
  | { kind: "outside"; merc: number[] }
  | { kind: "skip" };

/** 層へ置く 1 件。`data` は地物の `datum`（クリックで返る値）。 */
export interface MarkerItem {
  data: any;
  icon?: any;
  /** 前面の座標（範囲内の POI） */
  xy?: number[];
  /** メルカトル（範囲外の POI） */
  merc?: number[];
}

/** 前面と背面へ置く 1 回分。 */
export interface MarkerLayers {
  front: MarkerItem[];
  back: MarkerItem[];
}

const lnglatOf = (data: any): number[] =>
  data.lnglat || [data.lng || data.longitude, data.lat || data.latitude];

/**
 * POI が今の地図（前面）の範囲にあるかを判定する。
 * 座標の与え方が `coordinates`（メルカトル）・経緯度なら、範囲外をメルカトルで返す。
 * `x`・`y`（画素）は地図の座標が分かってもメルカトルが分からないので、範囲外なら描かない。
 */
export async function classifyMarker(
  app: OutsidePoisApp,
  data: any
): Promise<MarkerClass> {
  const src = app.from;
  if (!src) return { kind: "skip" };
  const inside = (xy: any): boolean =>
    !!xy && !!src.insideCheckSysCoord(xy);
  if (data.coordinates) {
    const xy = await src.merc2SysCoordAsync_ignoreBackground(data.coordinates);
    if (inside(xy)) return { kind: "inside", xy: xy as number[] };
    return { kind: "outside", merc: data.coordinates };
  }
  if (data.x && data.y) {
    const xy = src.xy2SysCoord([data.x, data.y]);
    if (inside(xy)) return { kind: "inside", xy };
    return { kind: "skip" };
  }
  const merc = transform(lnglatOf(data), "EPSG:4326", "EPSG:3857");
  const xy = await src.merc2SysCoordAsync_ignoreBackground(merc);
  if (inside(xy)) return { kind: "inside", xy: xy as number[] };
  return { kind: "outside", merc };
}

/** 前面の地図がメルカトルをそのまま座標に使う地図（TMS・envelope を持つ基本地図）か。 */
export function isMercatorFront(src: any): boolean {
  return typeof src?.isWmts === "function" ? src.isWmts() === true : false;
}

/**
 * 範囲外の POI をどの層へ置くか。`none` なら描かない。
 * 前面が古地図で背面があれば背面、前面がメルカトルの地図なら前面、
 * 背面を持たない古地図（overlay 偽）と非表示の指定では描かない。
 */
export function outsideMarkerLayer(app: OutsidePoisApp): "front" | "back" | "none" {
  if (app.__hideOutsidePois) return "none";
  if (!app.from) return "none";
  if (isMercatorFront(app.from)) return "front";
  return app.backMap ? "back" : "none";
}

/**
 * 判定の結果を層ごとの配列に振り分ける（選択中は渡された並びの最後にある）。
 * 範囲内は前面の座標で前面へ、範囲外は置く層の規則（outsideMarkerLayer）に従う。
 */
export function placeMarkerLayers(
  app: OutsidePoisApp,
  items: MarkerItem[],
  classes: MarkerClass[]
): MarkerLayers {
  const layer = outsideMarkerLayer(app);
  const front: MarkerItem[] = [];
  const back: MarkerItem[] = [];
  items.forEach((item, index) => {
    const classified = classes[index];
    if (classified.kind === "inside") {
      front.push({ ...item, xy: classified.xy });
    } else if (classified.kind === "outside" && layer === "back") {
      back.push({ ...item, merc: classified.merc });
    } else if (classified.kind === "outside" && layer === "front") {
      // 前面がメルカトルの地図（TMS・基本地図）は前面の座標がメルカトル
      front.push({ ...item, xy: classified.merc });
    }
  });
  return { front, back };
}

/** 地図の marker 層の source（無ければ undefined）。 */
export function markerSourceOf(map: any): any {
  return map?.getSource ? map.getSource(MARKER_LAYER) : undefined;
}

const featureOf = (item: MarkerItem): Feature => {
  const xy = (item.xy || item.merc) as number[];
  const feature = new Feature({
    geometry: new Point(xy),
    datum: item.data
  });
  const style = markerStyleFrom(item.icon);
  if (style) feature.setStyle(style);
  return feature;
};

/**
 * 前面と（あれば）背面の marker 層を 1 回で入れ替える。
 * 消すのは呼ばれた時点の 1 区間だけで、この関数の中では await しない（ちらつかない）。
 * 前面の地図の種類によらず、背面があれば必ず背面の marker 層も消す（前の地図の
 * 範囲外のピンを残さないため）。
 */
export function replaceMarkers(app: OutsidePoisApp, layers: MarkerLayers): void {
  const front = markerSourceOf(app.mapObject);
  if (!front) return;
  const back = app.backMap ? markerSourceOf(app.backMap) : undefined;
  front.clear();
  if (back) back.clear();
  if (layers.front.length > 0) {
    front.addFeatures(layers.front.map(featureOf));
  }
  if (back && layers.back.length > 0) {
    back.addFeatures(layers.back.map(featureOf));
  }
}

/**
 * 1 件を前面か背面へ足す（公開の setMarker の経路。層は消さない）。
 * 置く層は classifyMarker の結果と outsideMarkerLayer で決める。
 */
export function addMarkerItem(
  app: OutsidePoisApp,
  data: any,
  icon: any,
  classified: MarkerClass
): void {
  if (classified.kind === "skip") return;
  const toBack =
    classified.kind === "outside" && outsideMarkerLayer(app) === "back";
  const map = toBack ? app.backMap : app.mapObject;
  if (!map?.setMarker) return;
  const xy = classified.kind === "inside" ? classified.xy : classified.merc;
  map.setMarker(xy, { datum: data }, icon);
}

/** 背面の地図の透過度（0〜100）。分からなければ 0。 */
function transparencyOf(app: OutsidePoisApp): number {
  try {
    const value = Number(app.getTransparency ? app.getTransparency() : 0);
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

/**
 * その画面の点で背面のピンが押せるか。
 * 古地図の紙が覆っている所では押せない（`BACK_PIN_HIT_MIN_TRANSPARENCY` が null のとき）。
 */
export function backPinHittable(
  app: OutsidePoisApp,
  coordinate: number[]
): boolean {
  const src = app.from;
  if (!src?.insideCheckSysCoord) return false;
  if (!src.insideCheckSysCoord(coordinate)) return true;
  const min = BACK_PIN_HIT_MIN_TRANSPARENCY;
  if (min === null || min === undefined) return false;
  return transparencyOf(app) >= min;
}

/**
 * クリック・カーソルの点で背面の marker 層のピンに当たる POI の datum を返す。
 * 前面で当たらなかったときにだけ使う。紙が覆っている所では何も返さない。
 */
export function backMarkerDataAt(
  app: OutsidePoisApp,
  evt: { pixel: number[]; coordinate: number[] }
): any[] {
  const backMap = app.backMap;
  if (!backMap?.forEachFeatureAtPixel) return [];
  if (!backPinHittable(app, evt.coordinate)) return [];
  const markerLayer = backMap.getLayer ? backMap.getLayer(MARKER_LAYER) : undefined;
  const data: any[] = [];
  backMap.forEachFeatureAtPixel(
    evt.pixel,
    (feature: any) => {
      const datum = feature?.get ? feature.get("datum") : undefined;
      if (datum) data.push(datum);
    },
    markerLayer ? { layerFilter: (layer: any) => layer === markerLayer } : undefined
  );
  return data;
}

/** 引き戻しに使う view の面（OL の View、または同じ形の stub）。 */
export interface PullBackView {
  getCenter(): number[] | undefined;
  setCenter(center: number[]): void;
}

/**
 * 中心が地図の縁の外へ出たら、範囲内の点へ戻す。
 * 範囲外の POI を選んでいる間（`__outsideSelection` がある間）と、視点の確定を
 * 保留している間は何もしない。
 */
export function pullBackInside(app: OutsidePoisApp, view: PullBackView): void {
  if (!app.from || !view) return;
  if (app.__outsideSelection) return;
  // 視点の確定の保留中は、中心が切替前の地図の座標系の値のままなので触らない。
  if ((app as any).__pendingView) return;
  const src = app.from;
  const center = view.getCenter();
  if (!center) return;
  if (!src.insideCheckSysCoord(center)) {
    const next = src.modulateSysCoordInside(center);
    if (next) view.setCenter(next);
  }
}

const latlngOfMerc = (merc: number[]) => {
  const lnglat = transform(merc, "EPSG:3857", "EPSG:4326");
  return { longitude: lnglat[0], latitude: lnglat[1] };
};

/**
 * 範囲外の POI を中心に据える。
 * 前面が古地図なら経緯度で視点を決め（今の selectMarker と同じ道）、
 * 前面がメルカトルの地図（TMS・基本地図）なら前面のメルカトルをそのまま中心にする。
 */
export function centerOnOutsidePoi(app: OutsidePoisApp, merc: number[]): void {
  if (!app.from || !app.mapObject) return;
  if (isMercatorFront(app.from)) {
    app.mapObject.getView().setCenter(merc);
  } else if (app.setViewpoint) {
    app.setViewpoint(latlngOfMerc(merc));
  }
}

/**
 * 描き直しの判定が済んだ後に、範囲外を選んでいる状態を切り替え先の地図に合わせる。
 *   (1) その POI が無い      → 選択を外して縁の内側へ引き戻す
 *   (2) 範囲内になった        → 選択は続け、中心をその POI に合わせる
 *   (3) まだ範囲外            → 中心をその POI に合わせる（outOfMap は出さない）
 * `classified` は描き直しで判定した結果（POI が無ければ undefined）。
 */
export function settleOutsideSelection(
  app: OutsidePoisApp,
  classified: MarkerClass | undefined
): void {
  const selection = app.__outsideSelection;
  if (!selection) return;
  if (!classified || classified.kind === "skip") {
    delete app.__outsideSelection;
    delete app.__selectedMarker;
    const view = app.mapObject?.getView?.();
    // 直前に __outsideSelection を消しているので、同じインスタンスのまま引き戻す。
    // インスタンスを展開すると prototype の getter が落ちるため、展開しない。
    if (view) pullBackInside(app, view);
    return;
  }
  if (classified.kind === "inside") {
    delete app.__outsideSelection;
    const data = app.getMarker ? app.getMarker(selection.id) : undefined;
    if (data && app.setViewpoint) {
      app.setViewpoint({
        latitude: data.lnglat ? data.lnglat[1] : data.lat ?? data.latitude,
        longitude: data.lnglat ? data.lnglat[0] : data.lng ?? data.longitude
      });
    }
    return;
  }
  app.__outsideSelection = { id: selection.id, merc: classified.merc };
  centerOnOutsidePoi(app, classified.merc);
}
