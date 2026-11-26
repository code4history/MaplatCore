// 変換の形のデモ（layered-map.html）の「見せ方の文法」。設計書 §4.2 の表をそのまま写したもの。
// 紙の面（SVG）・3857 の面（Core の addLine・addMarker）・凡例が、すべてここの値だけを使う。
// ここに無い色・太さ・線種を画面のコードに書かない（試験 spec/layered-map-demo.spec.ts が値を固定している）。

/** 色は 3 色だけ（赤・青・黒）。白は縁取りと背景、黄色は選んだ印の強調（設計書 §4.4）だけに使う */
export const COLOR = {
  /** 紙のもの（紙に描いてあるもの、それを変換した結果）。暗い赤 */
  red: "#C1121F",
  /** 地理の側の正解（3857）。明るい青 */
  blue: "#3B8FD9",
  /** GCP の地理の側の輪。青の濃い色 */
  blueDark: "#1F5FA8",
  /** 原理（変換のしくみ） */
  black: "#1F2933",
  white: "#FFFFFF",
  /** 選んだ GCP の強調 */
  select: "#F2C200"
} as const;

/** 太さは画面の画素（拡大・縮小で変わらない） */
export const WIDTH = {
  /** 地形: 紙の地形は芯、正解の地形は帯 */
  terrain: { core: 2.5, band: 7 },
  /** グリッド（経緯線） */
  grid: { core: 1.25, band: 4 },
  /** 原理の線 */
  principle: 1,
  /** 原理の線の白い縁取り */
  casing: 3
} as const;

/** 線種（実線・破線・点線・一点鎖線）。原理のうちのどれかは、これと図の上の名前で区別する */
export const DASH = {
  /** 扇形（重心から補助頂点を通って外へ延びる線）: 一点鎖線 */
  fan: [8, 3, 1, 3],
  /** 拡張範囲（補助頂点を含む三角形の辺）: 点線 */
  extended: [1, 3],
  /** 四辺形（補助頂点の輪）: 破線 */
  quad: [6, 3],
  /** GCP の三角網（GCP だけの三角形の辺）: 点線 */
  tin: [1, 3]
} as const;

/** 不透明度 */
export const OPACITY = {
  /** 青い帯 */
  band: 0.6,
  /** 原理の線の白い縁取り */
  casing: 0.7,
  /** 3857 の背景（地理院タイル）に掛ける白の幕 */
  curtain: 0.55
} as const;

/** 印の大きさ（画面の画素） */
export const MARK = {
  /** 補助頂点: 白抜きの四角の一辺 */
  aux: 6,
  /** 扇形の重心: 十字の一辺 */
  centroid: 8,
  /** GCP の紙の側: 塗りの丸の直径 */
  gcpPaper: 6,
  /** GCP の地理の側: 白抜きの輪の直径と線の太さ */
  gcpGeo: 12,
  gcpGeoStroke: 2,
  /** 選んだ印の拡大率 */
  selectScale: 1.5
} as const;

/** rgba 文字列（Core の stroke・fill は OpenLayers にそのまま渡る） */
export function rgba(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/** 3857 の面の正解（青い帯）の描き方 */
export const bandStroke = (kind: "terrain" | "grid") => ({
  color: rgba(COLOR.blue, OPACITY.band),
  width: WIDTH[kind].band
});
/** 紙のもの（赤い芯）の描き方 */
export const coreStroke = (kind: "terrain" | "grid") => ({
  color: COLOR.red,
  width: WIDTH[kind].core
});
/** 原理の線（黒）と、その下に敷く白い縁取り */
export const principleStroke = (dash: readonly number[]) => ({
  color: COLOR.black,
  width: WIDTH.principle,
  lineDash: [...dash]
});
export const casingStroke = () => ({
  color: rgba(COLOR.white, OPACITY.casing),
  width: WIDTH.casing
});
