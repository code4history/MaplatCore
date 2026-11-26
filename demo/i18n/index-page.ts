// demo/i18n/index-page.ts: デモの目次（index.html・demo/index.ts）の文言の辞書（ja・en）。
// 型の呼び名と型の説明は、変換の形のデモと共通なので demo/i18n/common.ts にある。用語は横断設計の「2.y 用語」の表に合わせる。
// 値の {名前} は t() の引数で置き換える。
import type { Dict } from "./core";

export const dict: Dict = {
  ja: {
    "ix.title": "MaplatCore デモ - 目次",
    "ix.h1": "MaplatCore デモ",
    "ix.lead": "見たいデモを選んでください。",
    "ix.open": "開く",
    "ix.sec_old": "古地図のデモ",
    "ix.old_badge": "古地図",
    "ix.old_title": "古地図を地域ごとに開く",
    "ix.old_desc": "盛岡・奈良・広島・延岡・館林・新潟の古地図を、地域を選んで開く。地図の切り替え、POI、タイルキャッシュを試せる。変換の形は、三角網＋扇形外挿（既定）と従来型（V2）をボタンで切り替えて見比べられる。",
    "ix.sec_layered": "変換の形のデモ",
    "ix.layered_lead": "変換の型を 2 つ切り替えて、紙から変換した結果が正解の中に収まるかを見る。1 つのデモは 1 つの比較だけを見せる。",
    "ix.badge_demo": "デモ {no}",
    "ix.sup_on": "補完点あり",
    "ix.sup_off": "補完点なし",
    "ix.desc.1": "正確な図なら、CRS だけで紙の端まで合う。三角網は精度を足さず、打ち間違いの GCP の周りを乱す。",
    "ix.desc.2": "従来型は、GCP の外で赤い線が大きく曲がる。三角網＋扇形外挿に替えると、曲がりが消える。",
    "ix.desc.3": "地方ごとに歪んだ図では、CRS だけだと GCP の所でもずれが残る。三角網は、GCP のある陸のずれを直す。GCP の無い海は直らない。",
    "ix.desc.4": "四辺形の内側は同じ。地方ごとの歪みが全体で打ち消し合う図では、外側で大域外挿のほうが正解に近い。",
    "ix.desc.5": "四辺形の内側は同じ。中心を大きく描いた図では、外側で大域外挿は縮尺が合わない。扇形外挿のほうが正解に近い。",
    "ix.sec_types": "型の呼び名"
  },
  en: {
    "ix.title": "MaplatCore demos: contents",
    "ix.h1": "MaplatCore demos",
    "ix.lead": "Choose a demo to open.",
    "ix.open": "Open",
    "ix.sec_old": "Old-map demo",
    "ix.old_badge": "Old map",
    "ix.old_title": "Open old maps by region",
    "ix.old_desc": "Pick a region (Morioka, Nara, Hiroshima, Nobeoka, Tatebayashi or Niigata) and open its old maps. Try switching maps, POIs and the tile cache. A button switches the transform shape between TIN + fan extrapolation (default) and legacy (V2) so you can compare them.",
    "ix.sec_layered": "Transform-shape demos",
    "ix.layered_lead": "Switch between two transform shapes and see whether the converted paper stays inside the truth. Each demo shows one comparison only.",
    "ix.badge_demo": "Demo {no}",
    "ix.sup_on": "Supplement points on",
    "ix.sup_off": "Supplement points off",
    "ix.desc.1": "On an accurate paper, CRS only fits all the way to the edge. The TIN adds nothing and drags a mistyped GCP into its surroundings.",
    "ix.desc.2": "Legacy bends the red line sharply outside the GCPs. Switch to TIN + fan extrapolation and the bend is gone.",
    "ix.desc.3": "On a paper distorted region by region, CRS only leaves error even at the GCPs. The TIN fixes the land that has GCPs. The sea, with no GCPs, stays wrong.",
    "ix.desc.4": "Inside the extrapolation quadrilateral, the two are identical. When regional distortions cancel out across the whole map, global extrapolation is closer to the truth outside.",
    "ix.desc.5": "Inside the extrapolation quadrilateral, the two are identical. On a paper drawn large at the center, global extrapolation gets the scale wrong outside. Fan extrapolation is closer to the truth.",
    "ix.sec_types": "Shapes"
  }
};
