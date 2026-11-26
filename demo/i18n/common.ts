// demo/i18n/common.ts: ページをまたいで共通の文言（言語の切り替え・目次への戻り・変換の型の呼び名と説明）。
// ページごとの辞書に mergeDicts で足す。型の呼び名は横断設計の「2.y 用語」の表どおり
// （2026-11-25-jan27-crs-global-model-design.md。MaplatEditor の用語集 docs/i18n/editor-glossary.json に合わせる）。
// 値のうち {名前} は t() の引数で置き換える。鍵が _html で終わる値は HTML（innerHTML で出す。引数は数値と自前の文字列だけ）。
import type { Dict } from "./core";

export const commonDict: Dict = {
  ja: {
    "common.lang_label": "表示言語",
    "common.back_to_index": "← 目次",
    "type.a": "CRS",
    "type.b": "三角網＋大域外挿",
    "type.c": "三角網＋扇形外挿",
    "type.d": "従来型",
    "type.pair": "{a} と {b}",
    "type.note.a": "CRS は、地図を CRS として読んで、6 つの係数だけで紙の全体を写し、三角網は使わない。",
    "type.note.b": "三角網＋大域外挿は、CRS の上に GCP の三角網を張り、四辺形の外は地図全体に当てはめたワールドファイルで延ばす。",
    "type.note.c": "三角網＋扇形外挿は、CRS の上に GCP の三角網を張り、四辺形の外は縁の GCP の傾向を扇形に延ばす。",
    "type.note.d": "従来型（3857＋三角網＋扇形外挿。V2）は、投影を 3857 に決め打ちして、紙の四隅の 4 つの補助頂点を足した三角網で、投影の違いを吸収する。"
  },
  en: {
    "common.lang_label": "Language",
    "common.back_to_index": "← Contents",
    "type.a": "CRS only",
    "type.b": "TIN + global extrapolation",
    "type.c": "TIN + fan extrapolation",
    "type.d": "Legacy",
    "type.pair": "{a} vs {b}",
    "type.note.a": "CRS only reads the map as a CRS and covers the whole paper with six coefficients. It does not use a TIN.",
    "type.note.b": "TIN + global extrapolation builds a TIN of the GCPs on top of the CRS. Outside the extrapolation quadrilateral, it extends with a world file fitted to the whole map.",
    "type.note.c": "TIN + fan extrapolation builds a TIN of the GCPs on top of the CRS. Outside the extrapolation quadrilateral, it extends the trend of the edge GCPs as a fan.",
    "type.note.d": "Legacy (3857 + TIN + fan extrapolation, V2) fixes the projection to 3857. A TIN with four auxiliary vertices at the paper corners absorbs the difference in projection."
  }
};
