/** GL ライブラリが作った canvas が frameState.size（CSS ピクセル）と同じ大きさか。
 *  canvas.width/height は物理ピクセルなので、GL ライブラリの画素比で割って比べる。
 *  小数の DPR（1.25・1.5）で丸められても毎フレーム resize しないよう、差が 1 未満なら一致とみなす。
 *  canvas.width が数でない（検査のスタブ等）ときは NaN で不一致（＝resize する）。 */
export declare function glCanvasMatchesSize(glMap: any, canvas: {
    width: number;
    height: number;
}, size: [number, number]): boolean;
