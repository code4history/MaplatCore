// nov26-m4-t2（MaplatCore #107）: MapboxLayer・MapLibreLayer の描画ごとの寸法同期で使う比較。
// canvas.width/height は物理ピクセル、OpenLayers の frameState.size は CSS ピクセルなので、
// そのまま比べると DPR>1 では常に食い違い、描画のたびに GL の resize() が呼ばれていた。
// src/index.ts からは export しない（内部用。前例 src/provider_gl_bind.ts）。

/** GL ライブラリの画素比。map.getPixelRatio() があればその値、無ければ window.devicePixelRatio。
 *  有限の正の数でなければ 1。 */
function glPixelRatio(glMap: any): number {
  const pr =
    glMap && typeof glMap.getPixelRatio === "function"
      ? glMap.getPixelRatio()
      : (typeof window !== "undefined" && window.devicePixelRatio) || 1;
  return typeof pr === "number" && Number.isFinite(pr) && pr > 0 ? pr : 1;
}

/** GL ライブラリが作った canvas が frameState.size（CSS ピクセル）と同じ大きさか。
 *  canvas.width/height は物理ピクセルなので、GL ライブラリの画素比で割って比べる。
 *  小数の DPR（1.25・1.5）で丸められても毎フレーム resize しないよう、差が 1 未満なら一致とみなす。
 *  canvas.width が数でない（検査のスタブ等）ときは NaN で不一致（＝resize する）。 */
export function glCanvasMatchesSize(
  glMap: any,
  canvas: { width: number; height: number },
  size: [number, number],
): boolean {
  const pr = glPixelRatio(glMap);
  return (
    Math.abs(canvas.width / pr - size[0]) < 1 &&
    Math.abs(canvas.height / pr - size[1]) < 1
  );
}
