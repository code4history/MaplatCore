// 変換の形のデモ（layered-map.html）の「見せ方の文法」。設計書 §4.2 の表を写したもの。
// 補完点（MaplatTin#89・#94）の見せ方のために、表に無い 4 つを足している（灰色・凸包の線・補完点を含む三角形の線・補完点の印）。
// 足した理由は、各定義の上に書いた。人間の確認が要る。
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
  select: "#F2C200",
  /** 補完点の「もう一方の設定」の結果（赤い芯の下に細く重ねる）。正解ではなく、比べる相手。
   *  表に無い 4 色目だが、赤と青はそれぞれ「紙のもの」「正解」の意味で使い切っているため、比べる相手だけ無彩色にする */
  gray: "#6B7280"
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
  casing: 3,
  /** 補完点の「もう一方の設定」の結果（灰色の細い線）。赤い芯（地形 2.5・グリッド 1.25）より細くする */
  compare: { terrain: 1.5, grid: 1 }
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
  tin: [1, 3],
  /** 補完点を含む三角形の辺: 短い破線。補完点の周りの三角形が、ほかの三角網と見分けられるように足した */
  supplement: [3, 2],
  /** 対応点（人間が打った GCP）の凸包: 長い破線と点の繰り返し。補助頂点の三角形が凸包の内側へ食い込むかを見るために足した */
  hull: [10, 3, 1, 3, 1, 3]
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
  /** 補完点: 黒の縁の白抜きの菱形の対角線の長さと線の太さ。対応点の印（赤い丸・青い輪）と形で見分ける。
   *  補完点には三角網の線が集まるので、線の中に埋もれないよう、補助頂点の四角（6）より大きくして白で塗る。GCP の輪（12）と重なる所（打ち間違いの GCP の隣）でも、四隅がはみ出して見える大きさにする */
  supplement: 16,
  supplementStroke: 1.5,
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
/** 補完点のもう一方の設定の結果（灰色の細い線）の描き方 */
export const compareStroke = (kind: "terrain" | "grid") => ({
  color: COLOR.gray,
  width: WIDTH.compare[kind]
});
export const casingStroke = () => ({
  color: rgba(COLOR.white, OPACITY.casing),
  width: WIDTH.casing
});
