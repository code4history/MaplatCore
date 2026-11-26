// demo/old-map-form.ts: 古地図のデモ（old-map.html・demo/demo.ts）の「変換の形」の切り替えの、画面に依らない部分。
// 変換の形は 2 つ。c（三角網＋扇形外挿。既定）と v2（従来型）。
//   c  : public/maps-c/<mapID>.json（CRS＋三角網＋扇形外挿で作り直した地図の JSON。層ごとの推定の要約は同じ場所の estimates.json）
//   v2 : public/maps/<mapID>.json（これまでの地図の JSON。V2 のまま読む。A/B/C と解釈し直さない）
// 画面のコード（demo.ts）はこのファイルを読むだけにし、試験（spec/old-map-form.spec.ts）は画面なしでここを調べる。

export type MapForm = "c" | "v2";
export const MAP_FORMS: readonly MapForm[] = ["c", "v2"];
/** 既定。今後は A/B/C が標準なので、ライブラリのデモは C で動かす */
export const DEFAULT_MAP_FORM: MapForm = "c";
/** C の地図の JSON を置く場所（public/ の下）。estimates.json（層ごとの推定の要約）も同じ場所にある */
export const MAPS_C_DIR = "maps-c";
export const ESTIMATES_FILE = `${MAPS_C_DIR}/estimates.json`;

/** URL の ?form=c|v2。無い・未知なら既定（c） */
export function parseMapForm(search: string): MapForm {
  const q = new URLSearchParams(search).get("form");
  return MAP_FORMS.find((f) => f === q) ?? DEFAULT_MAP_FORM;
}

/** 推定の要約 1 層分（oldmap-c-data の scripts/info.mjs が書く。REPORT.md の値と同じ） */
export interface LayerEstimate {
  /** "main" か "sub_maps[N]" */
  layer: string;
  crs: string;
  /** compiled.strict_status（strict・loose・strict_error） */
  strictStatus: string;
  supplementCount: number;
  gcpCount: number;
  /** 推定で推奨された型。A・B・C（境の近くは複数） */
  recommended: string[];
  /** clear・borderline・birdeye。推奨が無ければ null */
  recommendReason: string | null;
  /** 適合スコア。無ければ null */
  score: number | null;
}
export type Estimates = Record<string, LayerEstimate[]>;

interface SourceLike {
  mapID?: string;
  settingFile?: string;
}
interface SettingLike {
  sources: (SourceLike | string)[];
}

/** C の地図の JSON の path */
export const mapsCPath = (mapID: string): string => `${MAPS_C_DIR}/${mapID}.json`;

/**
 * app 設定を、変換の形に合わせて返す（元は書き換えない）。
 * v2 は元のまま（maps/<mapID>.json か、設定ファイルが指す元の JSON）。
 * c は、estimates に載っている地図（＝作り直した地図）の settingFile を maps-c/<mapID>.json にする。
 * ベースマップ（"gsi"・"osm"）や、作り直していない地図（TMS など）は変えない。
 */
export function settingForForm<T extends SettingLike>(setting: T, form: MapForm, estimates: Estimates | undefined): T {
  if (form === "v2" || !estimates) return setting;
  const sources = setting.sources.map((s) => {
    if (typeof s === "string" || !s.mapID || !estimates[s.mapID]) return s;
    return { ...s, settingFile: mapsCPath(s.mapID) };
  });
  return { ...setting, sources };
}

export interface StrictSummary {
  /** 全層が strict */
  allStrict: boolean;
  /** 本図の status */
  main: string;
  /** 本図が strict で、strict でない挿入図の数 */
  insetNotStrict: number;
}
export function summarizeStrict(statuses: string[]): StrictSummary | undefined {
  if (statuses.length === 0) return undefined;
  const [main, ...insets] = statuses;
  return {
    allStrict: statuses.every((s) => s === "strict"),
    main,
    insetNotStrict: main === "strict" ? insets.filter((s) => s !== "strict").length : 0
  };
}

/** 画面に出す、いまの地図の変換の形の情報 */
export interface FormInfo {
  form: MapForm;
  crs: string;
  strict: StrictSummary | undefined;
  /** 補完点の数（本図と挿入図の合計）。従来型は補完点を使わないので null */
  supplementCount: number | null;
  /** 層が複数（挿入図あり）か */
  multiLayer: boolean;
  recommended: string[];
  recommendReason: string | null;
  score: number | null;
  /** 推奨が C を含まない（c の形では「推奨は ○○ だが、三角網＋扇形外挿で作っている」と書く） */
  recommendsNotC: boolean;
}

/**
 * mapID の変換の形の情報。作り直していない地図（ベースマップ・TMS）は undefined。
 * @param v2Statuses 元の地図の JSON の compiled.strict_status（本図・挿入図の順）。従来型の strict の判定に使う
 */
export function formInfo(form: MapForm, mapID: string | undefined, estimates: Estimates | undefined, v2Statuses: string[] | undefined): FormInfo | undefined {
  const layers = mapID ? estimates?.[mapID] : undefined;
  if (!layers || layers.length === 0) return undefined;
  const main = layers[0];
  const recommended = main.recommended;
  return {
    form,
    crs: form === "c" ? main.crs : "EPSG:3857",
    strict: summarizeStrict(form === "c" ? layers.map((l) => l.strictStatus) : (v2Statuses ?? [])),
    supplementCount: form === "c" ? layers.reduce((n, l) => n + l.supplementCount, 0) : null,
    multiLayer: layers.length > 1,
    recommended,
    recommendReason: main.recommendReason,
    score: main.score,
    recommendsNotC: recommended.length > 0 && !recommended.includes("C")
  };
}

/** 元の地図の JSON から、compiled.strict_status を本図・挿入図の順に取り出す */
export function v2StrictStatuses(map: { compiled?: { strict_status?: string }; sub_maps?: { compiled?: { strict_status?: string } }[] }): string[] {
  const out: string[] = [];
  if (map.compiled) out.push(map.compiled.strict_status ?? "loose");
  for (const sub of map.sub_maps ?? []) if (sub.compiled) out.push(sub.compiled.strict_status ?? "loose");
  return out;
}
