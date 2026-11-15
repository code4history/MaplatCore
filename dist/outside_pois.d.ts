/**
 * 背面のピンを紙の上でも押せるようにする透過度の下限（0〜100）。
 * `null`（既定）は「紙が覆っている所では押せない」。数を入れると、背面の地図の透過度が
 * その数以上なら紙の上でも押せる。実行中に切り替える口は setBackPinHitMinTransparency。
 */
export declare let BACK_PIN_HIT_MIN_TRANSPARENCY: number | null;
/** 上の下限を切り替える（既定は null）。 */
export declare function setBackPinHitMinTransparency(value: number | null): void;
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
export type MarkerClass = {
    kind: "inside";
    xy: number[];
} | {
    kind: "outside";
    merc: number[];
} | {
    kind: "skip";
};
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
/**
 * POI が今の地図（前面）の範囲にあるかを判定する。
 * 座標の与え方が `coordinates`（メルカトル）・経緯度なら、範囲外をメルカトルで返す。
 * `x`・`y`（画素）は地図の座標が分かってもメルカトルが分からないので、範囲外なら描かない。
 */
export declare function classifyMarker(app: OutsidePoisApp, data: any): Promise<MarkerClass>;
/**
 * メルカトルの点が画面のどの地図のどの座標に描かれるか（lngLatToClientPoint が使う）。
 * ピンを置く規則と同じ判定で、範囲内は前面の座標、範囲外は前面がメルカトルの地図なら
 * 前面のメルカトル、前面が古地図で背面があれば背面のメルカトル。範囲外のピンを隠す
 * 指定によらず背面を返す（地点そのものは背面の地図に見えている）。
 * 背面の無い古地図の紙の外は undefined（呼び出し元が従来の前面の外挿で補う）。前面の変換で
 * 写せない点は、ピンと同じく範囲外として扱うので背面（前面がメルカトルの地図なら前面）を返す。
 */
export declare function locateMerc(app: OutsidePoisApp, merc: number[]): Promise<{
    map: any;
    coord: number[];
} | undefined>;
/**
 * 前面の地図の画素に背面の地図が見えていれば、背面のその点のメルカトルを返す
 * （clientPointToLngLat と clickMap・clickMapMerc が使う。locateMerc の逆向き）。前面が古地図で、
 * その画素の前面の座標が紙の外（insideCheckSysCoord が偽）で、背面があるときだけ `{ merc }`。
 * 背面の画素が座標にならなければ `{ merc: undefined }`（前面の外挿で補わない）。それ以外（紙の内・
 * 前面がメルカトルの地図・背面の無い古地図）は undefined で、呼び出し元が前面の変換で求める。
 * `offset` は前面と背面の viewport のずれを返す関数（ポインタの移動は取っておいた値を渡す）。
 */
export declare function backMercAtPixel(app: OutsidePoisApp, pixel: readonly [number, number], offset?: () => readonly [number, number]): {
    merc: number[] | undefined;
} | undefined;
/** 前面の地図がメルカトルをそのまま座標に使う地図（TMS・envelope を持つ基本地図）か。 */
export declare function isMercatorFront(src: any): boolean;
/**
 * 範囲外の POI をどの層へ置くか。`none` なら描かない。
 * 前面が古地図で背面があれば背面、前面がメルカトルの地図なら前面、
 * 背面を持たない古地図（overlay 偽）と非表示の指定では描かない。
 */
export declare function outsideMarkerLayer(app: OutsidePoisApp): "front" | "back" | "none";
/**
 * 判定の結果を層ごとの配列に振り分ける（選択中は渡された並びの最後にある）。
 * 範囲内は前面の座標で前面へ、範囲外は置く層の規則（outsideMarkerLayer）に従う。
 */
export declare function placeMarkerLayers(app: OutsidePoisApp, items: MarkerItem[], classes: MarkerClass[]): MarkerLayers;
/** 地図の marker 層の source（無ければ undefined）。 */
export declare function markerSourceOf(map: any): any;
/**
 * 前面と（あれば）背面の marker 層を 1 回で入れ替える。
 * 消すのは呼ばれた時点の 1 区間だけで、この関数の中では await しない（ちらつかない）。
 * 前面の地図の種類によらず、背面があれば必ず背面の marker 層も消す（前の地図の
 * 範囲外のピンを残さないため）。
 */
export declare function replaceMarkers(app: OutsidePoisApp, layers: MarkerLayers): void;
/**
 * 1 件を前面か背面へ足す（公開の setMarker の経路。層は消さない）。
 * 置く層は classifyMarker の結果と outsideMarkerLayer で決める。
 */
export declare function addMarkerItem(app: OutsidePoisApp, data: any, icon: any, classified: MarkerClass): void;
/**
 * その画面の点で背面のピンが押せるか。
 * 古地図の紙が覆っている所では押せない（`BACK_PIN_HIT_MIN_TRANSPARENCY` が null のとき）。
 */
export declare function backPinHittable(app: OutsidePoisApp, coordinate: number[]): boolean;
/**
 * クリック・カーソルの点で背面の marker 層のピンに当たる POI の datum を返す。
 * 前面で当たらなかったときにだけ使う。紙が覆っている所では何も返さない。
 */
export declare function backMarkerDataAt(app: OutsidePoisApp, evt: {
    pixel: number[];
    coordinate: number[];
}): any[];
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
export declare function pullBackInside(app: OutsidePoisApp, view: PullBackView): void;
/**
 * 範囲外の POI を中心に据える。
 * 前面が古地図なら経緯度で視点を決め（今の selectMarker と同じ道）、
 * 前面がメルカトルの地図（TMS・基本地図）なら前面のメルカトルをそのまま中心にする。
 */
export declare function centerOnOutsidePoi(app: OutsidePoisApp, merc: number[]): void;
/**
 * 描き直しの判定が済んだ後に、範囲外を選んでいる状態を切り替え先の地図に合わせる。
 *   (1) その POI が無い      → 選択を外して縁の内側へ引き戻す
 *   (2) 範囲内になった        → 選択は続け、中心をその POI に合わせる
 *   (3) まだ範囲外            → 中心をその POI に合わせる（outOfMap は出さない）
 * `classified` は描き直しで判定した結果（POI が無ければ undefined）。
 * `options.recenter` は中心をその POI に合わせるか。省くと「判定待ちのときだけ」に
 * なる（描き直しからの決め直しで、利用者が動かした視点を引き戻さない）。
 */
export declare function settleOutsideSelection(app: OutsidePoisApp, classified: MarkerClass | undefined, options?: {
    recenter?: boolean;
}): void;
