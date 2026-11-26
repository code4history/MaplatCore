// demo/regions.ts
// 地域コンテンツ定義スキーマの型正本。
// 純データ型のみ。Core 本体（公開ライブラリ）を import しない（Pro へ戻せる切り出し）。

/** 地域 id（小文字 ASCII） */
export const REGION_IDS = [
  "morioka",
  "nobeoka",
  "nara",
  "tatebayashi",
  "hiroshima",
  "niigata",
] as const;
export type RegionId = (typeof REGION_IDS)[number];

/** 多言語文字列（appName / label など） */
export type I18nText = string | { ja?: string; en?: string };

/** 地図ソース 1 件（app 設定 sources の要素） */
export interface MapSource {
  /** 地図を識別する id。古地図 mapID（"morioka_ndl" 等）。ベースマップは本 interface ではなく bare string "gsi"/"osm" で書く（下記 AppSetting.sources 参照） */
  mapID: string;
  /** map 設定 JSON の path（省略時は maps/<mapID>.json が既定。source_ex.ts:187 実測） */
  settingFile?: string;
  /** 表示ラベル */
  label?: I18nText;
  /** 同梱タイルの url テンプレート（map 設定に url が無い盛岡系で明示する） */
  url?: string;
}

/** Core の MaplatApp が読む app 設定（既存スキーマ踏襲＋pois 廃止） */
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
  // 注意: pois キーは持たない（アプリ用 POI 正本は素材 appPois。正本を 1 つに保つ）
}

/** 照合情報源 1 件（照合に使った情報源・照合座標・差の実測値） */
export interface PoiVerifySource {
  /** 情報源種別。osm＝Overpass API で `name` の実在地物を引いた代表点 / gsi_address＝国土地理院 住所検索で `address` を引いた代表点 */
  src: "osm" | "gsi_address";
  /** 照合に使ったクエリ。形式一致を機械検査する: `src:"osm"` は `query === name`（ja）、`src:"gsi_address"` は `query === address`。写しのごまかし（空・別文字列）を形式面で落とす */
  query: string;
  /** 照合座標 [lng, lat] */
  coord: [number, number];
  /** データの lat/lng との距離（m）。機械検査が再計算して一致を assert する */
  distanceM: number;
  /** 照合情報源の取得日時（ISO 8601） */
  fetchedAt: string;
}

/** POI 座標検証の記録。素材作成で appPois/mapPois（および demoOps 内の poi）全件に必須で付す */
export interface PoiVerify {
  /** 地物の広がり種別。閾値は検査スクリプト側が持ち、素材 JSON には書かない（正本を 1 つに保つ） */
  area: "point" | "precinct" | "castle";
  /** 照合実施日（YYYY-MM-DD） */
  checkedAt: string;
  /** 照合に使った情報源。osm・gsi_address のどちらか 1 経路以上で足りる（以前の「osm 常に必須＋address 非空なら gsi_address 必須」は廃止） */
  sources: PoiVerifySource[];
}

/** POI 1 件 */
export interface Poi {
  name: I18nText;
  /** 住所。任意（古地図に描かれた地物で現代住所を特定できない場合に欠損し得る）。address 欠損 POI は gsi_address 経路を作れないため、osm 1 経路のみ＋人間確認必須とする */
  address?: string;
  lat: number;
  lng: number;
  start?: number;
  desc?: string;
  /** 典拠書誌・URL（この POI の由来）。必須。座標の正しさの照合記録は verify が別に持つ */
  source: string;
  image?: string;
  /** 写真のライセンス（allowlist 完全一致。image があれば必須） */
  imageLicense?: string;
  /** 写真の権利表示（撮影者・ライセンス・出典 URL）。image があれば必須 */
  imageCredit?: string;
  /** 座標照合の記録（必須）。無い POI は機械検査で不合格 */
  verify: PoiVerify;
}

/** 地図用 POI 1 件。その古地図に描かれた地物。maps の古地図にだけ出す */
export interface MapPoi extends Poi {
  /** 出す古地図の mapID（1 件以上・重複なし・当該地域 sources の古地図に実在。gsi/osm は書けない。sources の古地図の全件と同じでもよい）。複数あれば各地図に 1 件ずつ出す */
  maps: string[];
}

/** 線・面の種別（kind 別パレットは demo/demo.ts の PALETTE） */
export type LineKind = "festival" | "walk" | "feature";

/** アプリの線 1 件（全地図に出す。maps を持たない） */
export interface LineItem {
  label: string;
  kind: LineKind;
  points: [number, number][]; // [lng, lat][]
  source: string;
  /** 古地図の範囲で切った部分。キーは古地図の mapID、値はその地図で points の代わりに描く点列（points の上の点・2 点以上）。無い地図では points をそのまま描く */
  clipped?: Record<string, [number, number][]>;
}

/** 地図の線 1 件。maps の地図にだけ出す。maps が当該地域の全地図と同じなら LineItem（appLines）に置く */
export interface MapLineItem extends LineItem {
  /** 表示する地図の mapID（1 件以上・重複なし・当該地域 sources に実在。gsi/osm も書ける） */
  maps: string[];
}

/** 面 1 件（addVector に渡す閉領域） */
export interface VectorItem {
  label: string;
  kind: LineKind;
  points: [number, number][];
  source: string;
}

/** 追加 POI 1 件。maps が無ければ全地図、あればその地図にだけ出す（規則は MapPoi.maps と同じ） */
export interface AddPoiItem {
  label: string;
  maps?: string[];
  poi: Poi;
}

/** 移動ピン 1 件（地図の線も指せる）。始点・終点は line が指す線の最初と最後の頂点（座標を二重に持たない）。出る地図は線と同じ */
export interface MovePoiItem {
  label: string;
  /** 同じ素材の appLines[].label か mapLines[].label のどれか 1 つ */
  line: string;
}

/** デモ操作（demoOps。空配列なら対応する操作を出さない）。addLine は appLines／mapLines へ移した */
export interface DemoOps {
  addPoi: AddPoiItem[];
  movePoi: MovePoiItem[];
  addVector: VectorItem[];
}

/** 素材 JSON（demo/content/<region>.json）。地域 1 件＝1 ファイル */
export interface RegionContent {
  region: RegionId;
  /** 地図用 POI（唯一の正本。その古地図に描かれた地物。maps の地図にだけ出す） */
  mapPois: MapPoi[];
  /** アプリ用 POI（唯一の正本。現代に実在し典拠が置ける地物。全地図に出す） */
  appPois: Poi[];
  /** アプリの線（全地図に出す。v6.4） */
  appLines: LineItem[];
  /** 地図の線（maps の地図にだけ出す。v6.4） */
  mapLines: MapLineItem[];
  demoOps: DemoOps;
  // 注意: sources キーは持たない（地図ソース正本は app 設定。正本を 1 つに保つ）
}

// demo/regions.ts への追記。純データ。Core 本体（公開ライブラリ）を import しない。

/** 地域の説明文が名乗る操作の種類。検査が実データ（sources・demoOps）から導いた集合と照合する */
export type RegionOp = "map" | "poi" | "line" | "vector" | "move" | "gps";

/**
 * 地域の操作の表示データ。ドロップダウンの表示名・代表古地図の見出し・地域説明の箇条（c4h-note）は、
 * 画面の文言なので demo/i18n/old-map.ts の辞書（region.<id>.label・title・highlights）に置く
 */
export interface RegionMeta {
  /** この地域の説明文（辞書の highlights）が「今あるもの」として名乗る操作。今は無い操作を入れない */
  ops: RegionOp[];
}

export const REGION_META: Record<RegionId, RegionMeta> = {
  morioka: {
    ops: ["map", "poi", "line", "vector", "move", "gps"],
  },
  nobeoka: {
    ops: ["map", "poi", "line", "vector", "move", "gps"],
  },
  nara: {
    ops: ["map", "poi", "line", "vector", "move", "gps"],
  },
  tatebayashi: {
    ops: ["map", "poi", "line", "vector", "gps"],
  },
  hiroshima: {
    ops: ["map", "poi", "line", "vector", "gps"],
  },
  niigata: {
    ops: ["map"],
  },
};
