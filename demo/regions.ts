// demo/regions.ts
// 地域コンテンツ定義スキーマ（上位設計 §8.2）の型正本。
// 純データ型のみ。Core 本体（公開ライブラリ）を import しない（Pro へ戻せる切り出し。§16）。

/** 地域 id（上位設計 §3.3 命名規約。小文字 ASCII） */
export const REGION_IDS = [
  "morioka",
  "nobeoka",
  "nara",
  "tatebayashi",
  "hiroshima",
] as const;
export type RegionId = (typeof REGION_IDS)[number];

/** 多言語文字列（appName / label など） */
export type I18nText = string | { ja?: string; en?: string };

/** 地図ソース 1 件（app 設定 sources の要素。§8.2 の追補） */
export interface MapSource {
  /** 地図を識別する id。古地図 mapID（"morioka_ndl" 等）。ベースマップは本 interface ではなく bare string "gsi"/"osm" で書く（下記 AppSetting.sources 参照） */
  mapID: string;
  /** map 設定 JSON の path（省略時は maps/<mapID>.json が既定。source_ex.ts:187 実測） */
  settingFile?: string;
  /** 表示ラベル */
  label?: I18nText;
  /** 同梱タイルの url テンプレート（map 設定に url が無い盛岡系で明示する。§14 AC6 緩和対象） */
  url?: string;
}

/** Core の MaplatApp が読む app 設定（§8.2 スキーマ。既存スキーマ踏襲＋pois 廃止） */
export interface AppSetting {
  appName: I18nText;
  lang?: string;
  /** 地域の中心 [lng, lat] */
  homePosition: [number, number];
  defaultZoom?: number;
  zoomRestriction?: boolean;
  minZoom?: number;
  maxZoom?: number;
  /** 既定表示 mapID */
  startFrom: string;
  /** この地域が持つ地図（＝切り替え対象の全量）。非空。ベースマップ（"gsi"/"osm"）は bare string 形で必ず含む */
  sources: (MapSource | "gsi" | "osm")[];
  // 注意: pois キーは持たない（アプリ用 POI 正本は素材 appPois。INV-1 / AC17）
}

/** 照合情報源 1 件（照合に使った情報源・照合座標・差の実測値。§4.5 是正 1） */
export interface PoiVerifySource {
  /** 情報源種別。osm＝Overpass API で `name` の実在地物を引いた代表点 / gsi_address＝国土地理院 住所検索で `address` を引いた代表点 */
  src: "osm" | "gsi_address";
  /** 照合に使ったクエリ。形式一致を機械検査する（§4.5 M-2）: `src:"osm"` は `query === name`（ja）、`src:"gsi_address"` は `query === address`。写しのごまかし（空・別文字列）を形式面で落とす */
  query: string;
  /** 照合座標 [lng, lat] */
  coord: [number, number];
  /** データの lat/lng との距離（m）。機械検査が再計算して一致を assert する */
  distanceM: number;
  /** 照合情報源の取得日時（ISO 8601） */
  fetchedAt: string;
}

/** POI 座標検証の記録（§4.5 是正 1）。素材作成（t3）が appPois/mapPois（および demoOps 内の poi）全件に必須で付す */
export interface PoiVerify {
  /** 地物の広がり種別。閾値は検査スクリプト側が持ち、素材 JSON には書かない（§4.5。INV-1 と同型） */
  area: "point" | "precinct" | "castle";
  /** 照合実施日（YYYY-MM-DD） */
  checkedAt: string;
  /** 照合に使った情報源。v6（HR-17）: osm・gsi_address のどちらか 1 経路以上で足りる（v5 の「osm 常に必須＋address 非空なら gsi_address 必須」は廃止。t3 設計 v2 §4） */
  sources: PoiVerifySource[];
}

/** POI 1 件（§12.2 の形） */
export interface Poi {
  name: I18nText;
  /** 住所。任意（古地図に描かれた地物で現代住所を特定できない場合に欠損し得る）。address 欠損 POI は gsi_address 経路を作れないため、§4.5(c) の扱い（osm 1 経路のみ＋人間確認必須）に従う */
  address?: string;
  lat: number;
  lng: number;
  start?: number;
  desc?: string;
  /** 典拠書誌・URL（この POI の由来）。必須（§12.2）。座標の正しさの照合記録は verify が別に持つ（§4.5） */
  source: string;
  image?: string;
  /** 写真のライセンス（allowlist 完全一致。image があれば必須。t3 設計 v2 §4.6） */
  imageLicense?: string;
  /** 写真の権利表示（撮影者・ライセンス・出典 URL）。image があれば必須（v6・HR-17/3。検査は t3 設計 v2 §4.6） */
  imageCredit?: string;
  /** 座標照合の記録（必須。§4.5 是正 1）。無い POI は機械検査で不合格 */
  verify: PoiVerify;
}

/** 線 1 件（§12.2） */
export interface LineItem {
  label: string;
  points: [number, number][]; // [lng, lat][]
  source: string;
}

/** 面 1 件（addVector に渡す閉領域） */
export interface VectorItem {
  label: string;
  points: [number, number][];
  source: string;
}

/** デモ操作（§8.2 demoOps。空配列なら対応ボタンを非表示。§8.4） */
export interface DemoOps {
  addPoi: { label: string; poi: Poi }[];
  movePoi: { label: string; from: Poi; to: Poi }[];
  addLine: LineItem[];
  addVector: VectorItem[];
}

/** 素材 JSON（demo/content/<region>.json）。地域 1 件＝1 ファイル */
export interface RegionContent {
  region: RegionId;
  /** 地図用 POI（唯一の正本。その古地図に描かれた地物） */
  mapPois: Poi[];
  /** アプリ用 POI（唯一の正本。現代に実在し典拠が置ける地物） */
  appPois: Poi[];
  demoOps: DemoOps;
  // 注意: sources キーは持たない（地図ソース正本は app 設定。INV-1 / AC17）
}

// demo/regions.ts への追記（v6）。純データ。Core 本体（公開ライブラリ）を import しない（§16.4）。

/** 地域の説明文が名乗る操作の種類。t4 AC-T4-7 が実データ（sources・demoOps）から導いた集合と照合する */
export type RegionOp = "map" | "poi" | "line" | "vector" | "move" | "gps";

/** 地域ドロップダウンと地域説明（c4h-note）の表示データ */
export interface RegionMeta {
  /** ドロップダウンの表示名（v5 カードのバッジ） */
  label: string;
  /** 代表古地図の見出し（v5 カードの h2） */
  title: string;
  /** この地域で見られる操作（v5 カード本文の箇条。今は無い操作には「（11 月以降順次）」を付ける） */
  highlights: string[];
  /** highlights が「今あるもの」として名乗る操作。今は無い操作を入れない（AC-T4-7） */
  ops: RegionOp[];
}

export const REGION_META: Record<RegionId, RegionMeta> = {
  morioka: {
    label: "盛岡",
    title: "正保城絵図・奥州盛岡城図（1644 / 1735）",
    highlights: [
      "古地図 ⇄ 地理院地図 / OpenStreetMap の切り替え",
      "盛岡城・桜山神社・石割桜・三ツ石神社・報恩寺・盛岡銀行の POI",
      "盛岡山車大絵巻パレード（線）・祭礼の始点終点（移動）",
      "GPS・透過度の操作",
    ],
    ops: ["map", "poi", "line", "move", "gps"],
  },
  nobeoka: {
    label: "延岡",
    title: "1932 延岡市街地図",
    highlights: [
      "古地図 ⇄ 地理院地図 / OpenStreetMap の切り替え",
      "挿入図（sub_maps）で GPS が載る／載らない境界のデモ",
      "延岡城跡などの POI の表示・追加",
      "延岡大師祭市中パレード（線）・始点終点（移動）",
    ],
    ops: ["map", "poi", "line", "move", "gps"],
  },
  nara: {
    label: "奈良",
    title: "奈良町絵図（天理図書館保井文庫）",
    highlights: [
      "古地図 ⇄ 地理院地図 / OpenStreetMap の切り替え",
      "歪みの大きい絵図で Maplat の重ね合わせを実感",
      "元興寺・興福寺・猿沢池などの POI の表示・追加",
      "春日若宮おん祭 お渡り式の道順（線）・始点終点（移動）",
    ],
    ops: ["map", "poi", "line", "move", "gps"],
  },
  tatebayashi: {
    label: "館林",
    title: "館林城絵図（秋元時代）",
    highlights: [
      "古地図 ⇄ 地理院地図 / OpenStreetMap の切り替え",
      "館林城・善導寺などの POI の表示・追加",
      "館林市の散策路「歴史の小径」（線）",
    ],
    ops: ["map", "poi", "line", "gps"],
  },
  hiroshima: {
    label: "広島",
    title: "安芸国広島城所絵図",
    highlights: [
      "古地図 ⇄ 地理院地図 / OpenStreetMap の切り替え",
      "正保城絵図＋明治測量図の対比（時代軸）",
      "広島城・縮景園などの POI の表示・追加",
      "原爆ドーム周辺の徒歩ルート（線。近代以降の道）",
    ],
    ops: ["map", "poi", "line", "gps"],
  },
};
