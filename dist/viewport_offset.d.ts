/**
 * 前面と背面の地図の viewport のずれ（前面の左上 − 背面の左上、client 座標）を取っておく。
 *
 * 紙の外のポインタの移動（backMercAtPixel）で毎回 getBoundingClientRect を 2 回呼ぶと、
 * 受け手が pointerMoveOnMapXy の中で DOM を書き換えたときにブラウザが毎回 layout を計算し直す。
 * ずれは 2 つの要素の相対位置なので、ページのスクロールでは変わらない。変わりうるのは要素の
 * 大きさや配置が変わったときなので、次の契機で値を捨て、次に使うときに測り直す。
 *   - 前面・背面の viewport の ResizeObserver（コンテナの大きさの変化、表示・非表示の切り替え）
 *   - OL の地図の change:size（updateSize の後）
 *   - 前面の viewport への pointerenter（地図の外にいた間の CSS の変更を拾う。連続する移動では起きない）
 * 地図のクリックと clientPointToLngLat は回数が少ないので、毎回測って値を入れ替える（refresh）。
 */
export interface OffsetMap {
    getViewport(): HTMLElement | undefined;
    on?(type: string, listener: (...args: any[]) => void): any;
    un?(type: string, listener: (...args: any[]) => void): any;
}
/**
 * 前面の viewport の左上から背面の viewport の左上を引いた値を、いま測る。
 * viewport が無ければ（target から外れた地図）重なっているものとして 0 を返す。
 */
export declare function measureViewportOffset(front: OffsetMap, back: OffsetMap): [number, number];
export declare class ViewportOffsetCache {
    #private;
    constructor(front: OffsetMap, back: OffsetMap);
    /** 取っておいた値。捨てられていれば測り直す。 */
    get(): [number, number];
    /** いま測り直して、その値を取っておく。 */
    refresh(): [number, number];
    /** 取っておいた値を捨てる（次の get で測り直す）。 */
    invalidate(): void;
    dispose(): void;
}
