/// <reference types="vite/client" />
// demo/demo.ts: 単一デモページのロジック。
// 地域ドロップダウン（?region= 付き再読み込み）・app 設定の setting 明示渡し・
// 地域内コンテンツ切り替え UI（地図セレクタ・POI・線・面・視点・透過・GPS）・出典表示。
// Core 本体（公開ライブラリ）の公開 API だけを使う（Pro 専用 API・Core 専用 export を import しない）。
import Weiwudi from "@c4h/weiwudi";
import { MaplatApp, sanitizeHtml } from "../src/index.ts"; // 開発時。build:demo でバンドル
// テンプレートの警告（ページで 1 回）の記憶を戻す。公開面ではないが、記法のプリセットを切り替えるたびに
// 警告を出し直して見せるため、デモの中だけで使う（製品の挙動は変えない）
import { resetTemplateWarnings } from "../src/template_works";
// 範囲外の POI の判定（classifyMarker）と描く層（outsideMarkerLayer）を節の表に出すため。
// 公開面ではないが、デモだけが読む（製品の挙動は変えない）
import { classifyMarker, outsideMarkerLayer } from "../src/outside_pois";
// IIIF の書誌の節（デモだけの処理）: 解決器・サニタイザをそのまま使い、資料はテストと同じもの（spec/fixtures/iiif/）を読む
import { type IiifBindings, type IiifMetadataEntry, compareIiifCopy, listIiifCanvases, proposeIiifBindings, resolveIiifMetadata } from "../src/iiif/manifest.ts";
import { sanitizeIiifHtml } from "../src/sanitize.ts";
import NDL_MANIFEST from "../spec/fixtures/iiif/ndl-948741.manifest.json";
import V3_MANIFEST from "../spec/fixtures/iiif/presentation-v3-minimal.manifest.json";
import { REGION_IDS } from "./regions";
import type { AppSetting, DemoOps, LineItem, LineKind, MapLineItem, MapPoi, Poi, RegionContent, RegionId, VectorItem } from "./regions";
import { commonDict } from "./i18n/common";
import { applyLang, detectLang, makeTranslate, mergeDicts, mountLangSwitch } from "./i18n/core";
import { dict as oldMapDict } from "./i18n/old-map";
import {
  ESTIMATES_FILE, MAP_FORMS, formInfo, parseMapForm, settingForForm, v2StrictStatuses,
  type Estimates, type MapForm
} from "./old-map-form";

// 言語（?lang= → ブラウザの言語）。画面の文言は demo/i18n/old-map.ts の辞書にまとめ、ここでは t(鍵) で引く。
// <html lang> も同じ値にするので、地図のデータの名前（i18n()・localizedText）も切り替わる
const lang = detectLang();
const t = makeTranslate(mergeDicts(commonDict, oldMapDict), lang);
applyLang(t, lang);
mountLangSwitch(document.getElementById("lang-switch")!, lang, t("common.lang_label"));

// 素材 JSON（demo/content/<region>.json）を Vite の import.meta.glob でバンドルに取り込む。
// キーは "./content/<region>.json"（demo/ 起点の相対 glob）。ページの基点に依存しない。
const CONTENTS = import.meta.glob("./content/*.json", { import: "default" });

// 素材の型は regions.ts が正本（このファイルに局所型を置かない）
const EMPTY_OPS: DemoOps = { addPoi: [], movePoi: [], addVector: [] };

// 移動ピンのアイコン（既存の POI と見分ける）。ファイルを増やさないため data URI の SVG
const MOVE_ICON =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">' +
      '<path d="M14 35C14 35 2 20 2 13a12 12 0 0 1 24 0c0 7-12 22-12 22z" fill="#7c3aed" stroke="#fff" stroke-width="2"/>' +
      '<path d="M8 13h9m-3.5-4 4 4-4 4" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>"
  );
// 選んだ移動ピンのアイコン。地の色を橙に替え、縁を太くする（既定のピンの selected と同じく「選ばれた」と分かる形）
const MOVE_ICON_SELECTED =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">' +
      '<path d="M14 35C14 35 2 20 2 13a12 12 0 0 1 24 0c0 7-12 22-12 22z" fill="#f59e0b" stroke="#7c3aed" stroke-width="3"/>' +
      '<path d="M8 13h9m-3.5-4 4 4-4 4" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>"
  );

// 線・面の見た目（kind 別パレット）。単一正本はここ 1 箇所。
// stroke は addLine の stroke、style は addVector の style（{ stroke, fill }）にそのまま渡す。
// fill は OpenLayers の Fill の options（{ color }）の形で渡す（素の文字列では塗られない）
const PALETTE: Record<LineKind, { stroke: { color: string; width: number }; fill: { color: string } }> = {
  festival: { stroke: { color: "#e60033", width: 4 }, fill: { color: "rgba(230, 0, 51, 0.15)" } },
  walk: { stroke: { color: "#1a7f37", width: 4 }, fill: { color: "rgba(26, 127, 55, 0.15)" } },
  feature: { stroke: { color: "#f97316", width: 4 }, fill: { color: "rgba(249, 115, 22, 0.15)" } }
};

// 層の既定アイコン（icon・selectedIcon）と、年代で色を変えるアイコン（iconTemplate）。
// ファイルを増やさないため data URI の SVG（丸い穴のあるピン。移動ピンとも既定のピンとも見分ける）
const dotPin = (fill: string, ring: string): string =>
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32">' +
      `<path d="M12 31C12 31 2 18 2 12a10 10 0 0 1 20 0c0 6-10 19-10 19z" fill="${fill}" stroke="${ring}" stroke-width="2"/>` +
      '<circle cx="12" cy="12" r="4" fill="#fff"/>' +
      "</svg>"
  );
const ICON_LAYER = "icon_demo";
const ERA_LAYER = "era_demo";
const OVERLAP_LAYER = "overlap_demo";
const LAYER_ICON = dotPin("#0891b2", "#fff");
const LAYER_ICON_SELECTED = dotPin("#f59e0b", "#0891b2");
const ERA_ICONS = {
  early: dotPin("#dc2626", "#fff"),
  edo: dotPin("#16a34a", "#fff"),
  modern: dotPin("#2563eb", "#fff"),
  unknown: dotPin("#6b7280", "#fff")
};
// iconTemplate は POI の属性を受けて {"icon": …} の JSON を返す（Core の createIconSet が JSON.parse する）。
// 記法は Nunjucks（@maplat/core 1.3 から）。start が無い POI は「年代なし」。
// アイコンの文字列は JSON.stringify で Nunjucks の文字列リテラルとして埋め、出力では dump | safe で JSON の文字列にする
const ERA_ICON_TEMPLATE =
  `{% if start is number %}{% if start < 1600 %}{% set eraIcon = ${JSON.stringify(ERA_ICONS.early)} %}` +
  `{% elif start < 1868 %}{% set eraIcon = ${JSON.stringify(ERA_ICONS.edo)} %}` +
  `{% else %}{% set eraIcon = ${JSON.stringify(ERA_ICONS.modern)} %}{% endif %}` +
  `{% else %}{% set eraIcon = ${JSON.stringify(ERA_ICONS.unknown)} %}{% endif %}` +
  `{"icon": {{ eraIcon | dump | safe }}}`;
// poiTemplate: clickMarker の detail.html の元。{{ }} は HTML エスケープし、表示の前に sanitizeHtml を通す
const POI_TEMPLATE =
  '<div class="demo-poi-html"><strong>{{ name if name is string else (name.ja or name.en or "") }}</strong>' +
  '{% if desc is string and desc %}<p>{{ desc }}</p>{% endif %}</div>';

// poiTemplate の記法のプリセット（新しい記法・旧い記法・書き誤り・| safe の有無）。
// 旧い記法（lodash.template）は 1.3 から評価されず、ページで 1 回だけ console.warn が出る
const TEMPLATE_PRESETS: { id: string; labelKey: string; template: string }[] = [
  { id: "nunjucks", labelKey: "tpl.nunjucks", template: POI_TEMPLATE },
  {
    id: "legacy",
    labelKey: "tpl.legacy",
    template:
      '<div class="demo-poi-html"><strong><%- typeof name === "string" ? name : (name && (name.ja || name.en)) || "" %></strong>' +
      '<% if (typeof desc === "string" && desc) { %><p><%- desc %></p><% } %></div>'
  },
  { id: "broken", labelKey: "tpl.broken", template: '<div class="demo-poi-html"><strong>{{ name }</strong></div>' },
  {
    id: "safe",
    labelKey: "tpl.safe",
    template:
      '<div class="demo-poi-html"><p>{{ "{{ name }}" }}: {{ name if name is string else name.ja }}</p>' +
      '<p>{{ "{{ name | safe }}" }}: {{ (name if name is string else name.ja) | safe }}</p></div>'
  }
];
const TEMPLATE_LAYER = "template_demo";

// sanitizeHtml の入出力のプリセット（許される qy-swiper と、危険な属性）。
// (a) 相対 URL・caption に <i>・has-thumb が残る（caption はテキストになる）。
// (b) javascript: の URL・onerror・style・<cc-swiper>・<div image-url> だけが消える
const SANITIZE_PRESETS = [
  {
    id: "qy-allowed",
    labelKey: "sanitize.qy_allowed",
    html: `<qy-swiper has-thumb><qy-swiper-slide image-url="img/a.jpg" image-type="image" caption="${t("sanitize.sample_caption")}" fit-to-container></qy-swiper-slide></qy-swiper>`
  },
  {
    id: "qy-dangerous",
    labelKey: "sanitize.qy_dangerous",
    html: `<qy-swiper style="color:red" onclick="alert(1)"><qy-swiper-slide image-url="javascript:alert(1)" image-type="image" onerror="alert(1)" caption="c"></qy-swiper-slide></qy-swiper><cc-swiper><cc-swiper-slide image-url="a.jpg">${t("sanitize.sample_cc_text")}</cc-swiper-slide></cc-swiper><div image-url="a.jpg">${t("sanitize.sample_div_text")}</div>`
  }
] as const;

// ---- IIIF の書誌の節（デモだけの処理）----
// 「関数を試す」で使う Manifest の資料。テストと同じ資料を読む（ネットワークに出ない）。
// canvas の既定は、地図の画像に使う 1 枚（国立国会図書館は表紙の次の 3 枚目、手書きの見本は 2 枚目）
const IIIF_TRY_SOURCES = [
  {
    id: "ndl",
    labelKey: "bib.src_ndl",
    manifest: NDL_MANIFEST as unknown,
    canvas: "https://dl.ndl.go.jp/api/iiif/948741/canvas/3"
  },
  {
    id: "v3",
    labelKey: "bib.src_v3",
    manifest: V3_MANIFEST as unknown,
    canvas: "https://iiif.example.test/manifest/sample-map/canvas/2"
  }
];

// 悪い値の Manifest（デモの中だけの手書き。外部のサーバーから来た値の見え方を見せる）
const IIIF_BAD_MANIFEST = {
  "@context": "http://iiif.io/api/presentation/3/context.json",
  id: "https://iiif.example.test/bad/manifest.json",
  type: "Manifest",
  label: { none: [t("bib.bad_label")] },
  summary: { none: [t("bib.bad_summary_1"), t("bib.bad_summary_2")] },
  requiredStatement: {
    label: { none: [t("bib.bad_attr_label")] },
    value: { none: [t("bib.bad_attr_value")] }
  },
  metadata: [
    { label: { none: [t("bib.bad_meta_image")] }, value: { none: ['<img src="x" onerror="alert(1)">'] } },
    { label: { none: [t("bib.bad_meta_table")] }, value: { none: [t("bib.bad_table_value")] } },
    { label: { none: [t("bib.bad_meta_links")] }, value: { none: [t("bib.bad_links_value")] } }
  ],
  items: []
};
const IIIF_BAD_BINDINGS: IiifBindings = {
  title: { from: "manifest", property: "label" },
  attr: { from: "manifest", property: "requiredStatement" },
  description: { from: "manifest", property: "summary" }
};
// HTML として入る鍵（出す場所では sanitizeIiifHtml を通す。それ以外の鍵は文字として textContent で出す）
const IIIF_HTML_KEYS = new Set(["attr", "dataAttr", "description", "contributor"]);

// ベースマップ（gsi / osm）の表示名。地図の id 自体は app 設定の sources（bare string）から得る。
const BASEMAP_LABEL: Record<string, string> = {
  gsi: t("basemap.gsi"),
  osm: t("basemap.osm")
};

// テンプレートの警告（Core の console.warn）を、デモの「テンプレートの警告」欄へ写す（デモだけの処理）
let templateWarningSink: ((message: string) => void) | undefined;
const originalWarn = console.warn.bind(console);
console.warn = (...args: unknown[]): void => {
  originalWarn(...args);
  const first = args[0];
  if (typeof first === "string" && first.startsWith("MaplatApp: ") && first.includes("poiTemplate/iconTemplate")) {
    templateWarningSink?.(first);
  }
};

// ---- 画像の配信の節（デモだけの処理。製品の挙動は変えない）----
// IIIF の地図が使えないときに Core が出す console.error を控える（起動の前に仕掛ける）
const unusableMessages: string[] = [];
const originalError = console.error.bind(console);
console.error = (...args: unknown[]): void => {
  originalError(...args);
  const first = args[0];
  if (typeof first === "string" && first.includes("is not usable")) unusableMessages.push(first);
};

// 直近のタイルの要求（PerformanceObserver の resource を読む）。1 ページで 1 つだけ仕掛ける
const TILE_REQUEST_MAX = 8;
const tileRequests: string[] = [];
let tileRequestSink: ((list: string[]) => void) | undefined;
let tileRequestObserver: PerformanceObserver | undefined;
// 地図のタイルは画像（IIIF の切り出しは .jpg、手元のタイルは .jpg、地理院地図・OSM は .png）
// 背面のベースマップ（OSM・地理院地図）のタイルは一覧に入れない（古地図の画像の出どころを見せる節なので）
const BASEMAP_TILE_HOST = /(?:^|\.)(?:tile\.openstreetmap\.org|cyberjapandata\.gsi\.go\.jp)$/i;
const isTileResource = (url: string): boolean => {
  if (!/\.(?:jpe?g|png|webp)(?:$|\?)/i.test(url)) return false;
  try {
    return !BASEMAP_TILE_HOST.test(new URL(url).hostname);
  } catch {
    return false;
  }
};
const pushTileRequest = (url: string): void => {
  if (!isTileResource(url)) return;
  tileRequests.unshift(url);
  if (tileRequests.length > TILE_REQUEST_MAX) tileRequests.length = TILE_REQUEST_MAX;
  tileRequestSink?.([...tileRequests]);
};
const startTileRequestObserver = (): void => {
  if (tileRequestObserver || typeof PerformanceObserver === "undefined") return;
  // 節を作る前の要求を 1 度だけ拾い、その後に observer を仕掛ける（同じ要求を二重に数えない）
  for (const entry of performance.getEntriesByType("resource")) pushTileRequest(entry.name);
  tileRequestObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) pushTileRequest(entry.name);
  });
  tileRequestObserver.observe({ type: "resource" });
};

/** URL の ?region= を REGION_IDS で検証する。無い・未知なら先頭 */
function currentRegion(): RegionId {
  const q = new URLSearchParams(location.search).get("region");
  const hit = REGION_IDS.find((id) => id === q);
  return hit ?? REGION_IDS[0];
}

/** ページの言語。?lang= かブラウザの言語で決め（detectLang）、<html lang> にも同じ値を入れてある */
function pageLang(): "ja" | "en" {
  return lang;
}

/** 多言語文字列（I18nText）から表示用文字列を得る（ページ言語優先・無ければ ja） */
function i18n(value: string | { ja?: string; en?: string } | undefined): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[pageLang()] ?? value.ja ?? value.en ?? "";
}

/** IIIF の書誌の値から表示用文字列を得る（ページ言語優先。言語を持たない値（none）も拾う） */
function localizedText(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const table = value as Record<string, string>;
    return table[pageLang()] ?? table.ja ?? table.en ?? table.none ?? Object.values(table)[0] ?? "";
  }
  return "";
}

/** 要素取得（無ければ例外） */
function byId<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`demo: #${id} not found`);
  return el as T;
}

/** コントロール用ボタンの生成 */
function makeButton(label: string, onClick: () => void): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = label;
  btn.addEventListener("click", onClick);
  return btn;
}

// ---- タイルキャッシュ（Weiwudi の Service Worker と、Core の公開 API の呼び出し）----
// Service Worker はページごとに 1 回だけ登録する（remove()→再生成では登録の結果を使い回す）。
// 失敗してもデモのほかの機能は止めず、キャッシュ無しで起動して節に理由を出す。
const SW_WAIT_MESSAGE = t("sw.wait");
// Weiwudi.registerSW の待ちの上限は制御を待つ 10 秒だけで、その後の疎通確認（fetch）には上限が無い。
// SW が制御を始めたのに応答しないとデモが起動しないので、デモ側で打ち切る（10 秒に疎通確認の余裕 5 秒）
const CACHE_REGISTER_LIMIT_MS = 15_000;
const cacheDisabledByUrl = (): boolean => new URLSearchParams(location.search).get("cache") === "0";
let swRegistration: Promise<string | undefined> | undefined;

/** 成功なら undefined、使えないなら理由の文字列 */
function ensureServiceWorker(status: HTMLElement): Promise<string | undefined> {
  if (cacheDisabledByUrl()) return Promise.resolve(t("sw.disabled_by_url"));
  swRegistration ??= (async () => {
    const before = status.textContent;
    status.textContent = SW_WAIT_MESSAGE;
    try {
      if (!navigator.serviceWorker) throw new Error(t("sw.unsupported"));
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => { reject(new Error(t("sw.timeout"))); }, CACHE_REGISTER_LIMIT_MS);
        // 負けたあとで registerSW が解決・失敗しても起動には影響させない（結果はここで握る）
        Weiwudi.registerSW(new URL("./weiwudi-sw.js", location.href), { scope: "./" }).then(
          () => { clearTimeout(timer); resolve(); },
          (e: unknown) => { clearTimeout(timer); reject(e); }
        );
      });
      return undefined;
    } catch (e) {
      // Weiwudi 1.1.x は文字列、新しい版は Error を投げうる
      return t("sw.failed", { reason: String(e instanceof Error ? e.message : e) });
    } finally {
      if (status.textContent === SW_WAIT_MESSAGE) status.textContent = before;
    }
  })();
  return swRegistration;
}

// 待ち時間はコードの中の定数（試験は page.clock で進める）
const CACHE_STALL_MS = 30_000; // 進捗（イベントか count の増加）が無いまま待つ上限
const CACHE_POLL_MS = 2_000; // count を読む間隔
const CACHE_CANCEL_LIMIT_MS = 10_000; // 発火側の cancel の完了を待つ上限
const CACHE_CLEAR_CHECK_MS = 500; // 消去の確認の読み取りの間隔
const CACHE_CLEAR_LIMIT_MS = 3_000; // 消去の確認を打ち切るまでの経過時間
const CACHE_READ_LIMIT_MS = 3_000; // 統計・サイズの 1 回の読み取りを待つ上限（SW が詰まると Core の Promise は解決しない）

/** 読み取りに上限をつける。上限・失敗のときは fallback を返す（待ち続けない） */
function withReadLimit<T>(read: () => Promise<T>, fallback: T): Promise<T> {
  return new Promise<T>((resolve) => {
    const timer = setTimeout(() => { resolve(fallback); }, CACHE_READ_LIMIT_MS);
    const done = (v: T): void => {
      clearTimeout(timer);
      resolve(v);
    };
    try {
      void read().then(done, () => { done(fallback); });
    } catch {
      done(fallback);
    }
  });
}
const CACHE_FETCH_MAX_TILES = 3000;

interface CacheSectionContext {
  app: MaplatApp;
  makeSection: (title: string) => { sec: HTMLElement; row: () => HTMLDivElement };
  mountSection: (s: { sec: HTMLElement; row: () => HTMLDivElement }) => void;
  showError: (where: string, e: unknown) => void;
  logEvent: (type: string, text?: string) => void;
  activeMapId: () => string | undefined;
  /** キャッシュ無しで起動した理由（有効なら undefined） */
  disabledReason: string | undefined;
}

type CacheStats = { count?: number; size?: number; total?: number; percent?: number };

// 節「キャッシュ」。操作の対象は今表示している地図。キャッシュの操作は Core の公開 API だけを使う。
// Core は取得・中止・消去の失敗を握りつぶす（統計の失敗は {} を返す）ので、公開 API の範囲で
// 「進んでいない」「応答が無い」「消えていない」を見張り、ボタンが必ず戻るようにする。
function buildCacheSection(ctx: CacheSectionContext): void {
  const { app, makeSection, mountSection, showError, logEvent, activeMapId, disabledReason } = ctx;
  const sec = makeSection(t("section.cache"));
  sec.sec.id = "demo-cache";
  const text = (id: string, label: string): HTMLSpanElement => {
    const r = sec.row();
    const k = document.createElement("span");
    k.textContent = `${label} `;
    const v = document.createElement("span");
    v.id = id;
    r.append(k, v);
    return v;
  };
  const appState = text("cache-app", t("cache.app"));
  const target = text("cache-target", t("cache.target"));
  const sizeRow = sec.row();
  const sizeView = document.createElement("span");
  sizeView.id = "cache-stats";
  const sizeNum = document.createElement("span");
  sizeNum.id = "cache-size";
  const countNum = document.createElement("span");
  countNum.id = "cache-count";
  const totalNum = document.createElement("span");
  totalNum.id = "cache-total";
  const statsFail = document.createElement("span");
  statsFail.id = "cache-stats-fail";
  for (const n of [sizeNum, countNum, totalNum]) n.textContent = "—";
  sizeView.append(`${t("cache.stored")} `, sizeNum, ` ${t("cache.bytes_tiles")} `, countNum, " / ", totalNum, " ", statsFail);
  sizeRow.appendChild(sizeView);
  const progress = text("cache-progress", t("cache.progress"));
  const result = text("cache-result", t("cache.result"));
  const message = text("cache-message", "");
  const buttons = sec.row();
  const fetchBtn = makeButton(t("cache.fetch_all"), () => { onFetchClick(); });
  fetchBtn.id = "cache-fetch";
  const clearBtn = makeButton(t("cache.clear"), () => { onClear(); });
  clearBtn.id = "cache-clear";
  buttons.append(fetchBtn, clearBtn);
  const note = document.createElement("p");
  note.className = "demo-note";
  note.id = "cache-note";
  sec.sec.appendChild(note);
  const fixedNote = document.createElement("p");
  fixedNote.className = "demo-note";
  fixedNote.textContent = t("cache.fixed_note");
  sec.sec.appendChild(fixedNote);

  const enabled = disabledReason === undefined;
  appState.textContent = enabled ? t("cache.enabled") : t("cache.disabled", { reason: disabledReason });

  // 取得の状態: idle（待機）→ fetching（取得中）→ cancelling（中止を押した）／ firing（見張りが発火して cancel の完了待ち）
  let state: "idle" | "fetching" | "cancelling" | "firing" = "idle";
  let busyClear = false;
  let gen = 0; // 取得を押すたび、発火・中止の無応答のたびに進める。古い世代のイベント・読み取りは捨てる
  let fetchMapID: string | undefined;
  let lastTotal: number | undefined;
  let statsFailures = 0;
  let statsPending = false;
  let watchTimer: ReturnType<typeof setTimeout> | undefined;
  let pollTimer: ReturnType<typeof setInterval> | undefined;

  const setMessage = (s: string): void => { message.textContent = s; };

  // ボタンの表示と、一括取得を押せる条件（機械で決める）
  const refreshButtons = (): void => {
    const mapID = activeMapId();
    const usable = enabled && !!mapID && app.getMapCacheEnable(mapID);
    target.textContent = mapID ? t("cache.target_value", { mapID, state: usable ? t("cache.cacheable") : t("cache.not_cacheable") }) : "—";
    fetchBtn.textContent = state === "fetching" || state === "cancelling" || state === "firing" ? t("cache.cancel_fetch") : t("cache.fetch_all");
    clearBtn.disabled = !usable || busyClear || state !== "idle";
    if (state === "idle") {
      let reason = "";
      if (!enabled) reason = t("cache.reason_disabled");
      else if (!usable) reason = t("cache.reason_not_cacheable");
      else if (lastTotal === undefined) reason = t("cache.reason_total_unknown");
      else if (lastTotal > CACHE_FETCH_MAX_TILES) reason = t("cache.reason_too_many", { total: lastTotal });
      fetchBtn.disabled = reason !== "";
      if (reason) fetchBtn.title = reason;
      else fetchBtn.removeAttribute("title");
      note.textContent = reason;
    } else {
      // 取得中は「取得を中止」。中止の完了待ち（firing）と中止を押したあと（cancelling）は押せない
      fetchBtn.disabled = state === "firing" || state === "cancelling";
      fetchBtn.removeAttribute("title");
      note.textContent = "";
    }
  };

  const showStats = (stats: CacheStats | undefined): void => {
    if (!stats || typeof stats.size !== "number") {
      // 連続 2 回失敗したときだけ「取得できません」にする（表示の点滅を避ける）
      statsFailures++;
      if (statsFailures >= 2) {
        sizeNum.textContent = "—";
        countNum.textContent = "—";
        totalNum.textContent = "—";
        statsFail.textContent = t("cache.stats_unavailable");
        lastTotal = undefined;
      }
      return;
    }
    statsFailures = 0;
    statsFail.textContent = "";
    sizeNum.textContent = String(stats.size);
    countNum.textContent = typeof stats.count === "number" ? String(stats.count) : "—";
    totalNum.textContent = typeof stats.total === "number" ? String(stats.total) : "—";
    lastTotal = typeof stats.total === "number" && stats.total > 0 ? stats.total : undefined;
  };

  // 統計を読む。前の読み取りが戻っていなければ飛ばす。結果は世代が同じときだけ使う
  const readStats = async (mapID: string | undefined, forGen: number): Promise<CacheStats | undefined> => {
    if (!enabled || !mapID || statsPending) return undefined;
    statsPending = true;
    try {
      const stats = (await withReadLimit(() => Promise.resolve(app.getMapTileCacheStatsAsync(mapID)), {})) as CacheStats | undefined;
      if (forGen !== gen) return undefined;
      return stats ?? {};
    } finally {
      statsPending = false;
    }
  };
  const refreshStats = async (): Promise<void> => {
    // 前の読み取りが戻っていない（上限は 3 秒）。待機中なら少し後にもう一度読む
    if (statsPending) {
      if (state === "idle") setTimeout(() => { void refreshStats(); }, CACHE_CLEAR_CHECK_MS);
      return;
    }
    const g = gen;
    const stats = await readStats(activeMapId(), g);
    if (stats !== undefined && g === gen) {
      showStats(stats);
      refreshButtons();
    }
  };

  // ---- 見張り ----
  const clearWatch = (): void => {
    if (watchTimer !== undefined) clearTimeout(watchTimer);
    watchTimer = undefined;
  };
  const stopTimers = (): void => {
    clearWatch();
    if (pollTimer !== undefined) clearInterval(pollTimer);
    pollTimer = undefined;
  };
  const armWatch = (): void => {
    clearWatch();
    watchTimer = setTimeout(onWatchFired, CACHE_STALL_MS);
  };
  const startTimers = (): void => {
    armWatch();
    const g = gen;
    // 最初の読み取りは基準だけを決める（地図の表示で溜まったタイルを進捗に数えない）
    let baseline: number | undefined;
    pollTimer = setInterval(() => {
      void (async () => {
        const stats = await readStats(fetchMapID, g);
        if (stats === undefined || g !== gen) return;
        showStats(stats);
        if (typeof stats.count !== "number") return;
        if (baseline !== undefined && stats.count > baseline) armWatch();
        baseline = stats.count;
      })();
    }, CACHE_POLL_MS);
  };
  const toIdle = (): void => {
    stopTimers();
    state = "idle";
    refreshButtons();
    void refreshStats();
  };

  function onWatchFired(): void {
    watchTimer = undefined;
    if (state === "fetching") {
      // 開始側: 進んでいない。ジョブを止め、cancel の完了か 10 秒の上限のどちらか早い方でボタンを戻す
      const mapID = fetchMapID;
      gen++; // 統計の読み取りを止め、古い世代のイベントを捨てる
      stopTimers();
      state = "firing";
      refreshButtons();
      let done = false;
      const finish = (timedOut: boolean): void => {
        if (done) return;
        done = true;
        clearTimeout(limit);
        const msg = timedOut
          ? t("cache.cancel_no_response_sw")
          : t("cache.no_progress");
        setMessage(msg);
        showError(t("cache.where"), msg);
        toIdle();
      };
      const limit = setTimeout(() => { finish(true); }, CACHE_CANCEL_LIMIT_MS);
      try {
        void Promise.resolve(app.cancelMapTileCacheAsync(mapID ?? "")).then(() => { finish(false); }, () => { finish(false); });
      } catch {
        finish(false);
      }
    } else if (state === "cancelling") {
      // 中止側: 中止の応答が無い。cancel はもう呼ばない
      gen++;
      const msg = t("cache.cancel_no_response_slow");
      setMessage(msg);
      showError(t("cache.where"), msg);
      toIdle();
    }
  }

  const formatProgress = (d: Record<string, unknown> | undefined): string => {
    if (!d) return "";
    const parts: string[] = [];
    if (typeof d.percent === "number") parts.push(`${d.percent}%`);
    if (typeof d.processed === "number" && typeof d.total === "number") parts.push(`(${d.processed} / ${d.total})`);
    if (typeof d.error === "number" && d.error > 0) parts.push(t("cache.failed_count", { count: d.error }));
    return parts.join(" ");
  };

  function onFetchClick(): void {
    if (state === "fetching") {
      // 中止: 開始側の見張りを止め、中止側の見張りに置き換える
      state = "cancelling";
      armWatch();
      refreshButtons();
      logEvent("tileCache", t("cache.log_cancel"));
      try {
        void Promise.resolve(app.cancelMapTileCacheAsync(fetchMapID ?? "")).catch(() => undefined);
      } catch {
        // 呼び出しの失敗は見張りが知らせる
      }
      return;
    }
    if (state !== "idle") return;
    const mapID = activeMapId();
    if (!mapID) return;
    const myGen = ++gen;
    state = "fetching";
    fetchMapID = mapID;
    progress.textContent = "";
    result.textContent = "";
    setMessage("");
    refreshButtons();
    logEvent("tileCache", t("cache.log_start", { mapID }));
    // 見張りを先に張る。取得の戻りは待たない（Core は失敗を握りつぶし、戻りが来ないことがある）
    startTimers();
    const onEvent = (type: string, detail: unknown): void => {
      if (myGen !== gen) return; // 古い世代
      const d = detail as Record<string, unknown> | undefined;
      if (type === "proceed") {
        progress.textContent = formatProgress(d);
        armWatch();
        void refreshStats();
        return;
      }
      if (type === "finish" || type === "stop" || type === "canceled") {
        const extra = formatProgress(d);
        result.textContent = type === "finish" && typeof d?.error === "number" ? t("cache.finish_with_failures", { count: d.error }) : type;
        if (extra) progress.textContent = extra;
        logEvent("tileCache", `${type} ${mapID}`);
        toIdle();
      }
    };
    try {
      void Promise.resolve(app.fetchAllMapTileCacheAsync(mapID, onEvent)).catch(() => undefined);
    } catch {
      // 呼び出しの失敗は見張りが知らせる
    }
  }

  function onClear(): void {
    const mapID = activeMapId();
    if (!mapID || busyClear || state !== "idle") return;
    busyClear = true;
    refreshButtons();
    setMessage("");
    logEvent("tileCache", t("cache.log_clear", { mapID }));
    // 戻りは待たない。サイズが 0 になるのを 0.5 秒ごと 3 秒まで確かめる
    try {
      void Promise.resolve(app.clearMapTileCacheAsync(mapID)).catch(() => undefined);
    } catch {
      // 失敗はサイズで分かる
    }
    // 確認は経過時間で打ち切る（読み取りが戻らなくても 3 秒でボタンを戻す）
    let settled = false;
    let lastSize = -1;
    let checkTimer: ReturnType<typeof setTimeout> | undefined;
    const settle = (ok: boolean): void => {
      if (settled) return;
      settled = true;
      clearTimeout(deadline);
      if (checkTimer !== undefined) clearTimeout(checkTimer);
      busyClear = false;
      if (ok) {
        setMessage(t("cache.cleared"));
      } else {
        const msg =
          lastSize < 0
            ? t("cache.clear_unconfirmed")
            : t("cache.clear_failed", { size: lastSize });
        setMessage(msg);
        showError(t("cache.where"), msg);
      }
      refreshButtons();
      void refreshStats();
    };
    const deadline = setTimeout(() => { settle(false); }, CACHE_CLEAR_LIMIT_MS);
    const check = (): void => {
      void (async () => {
        const size = await withReadLimit(async () => Number(await app.getMapTileCacheSizeAsync(mapID)), -1);
        if (settled) return;
        lastSize = size;
        if (size === 0) settle(true);
        else checkTimer = setTimeout(check, CACHE_CLEAR_CHECK_MS);
      })();
    };
    checkTimer = setTimeout(check, CACHE_CLEAR_CHECK_MS);
  }

  app.addEventListener("mapChanged", () => {
    statsFailures = 0;
    // 前の地図の総数で一括取得の可否を決めない（読み直すまで「分からない」に戻す）
    if (state === "idle") lastTotal = undefined;
    refreshButtons();
    void refreshStats();
  });
  refreshButtons();
  void refreshStats();
  mountSection(sec);
}

// ---- 範囲外の POI（古地図の紙の外にある POI を背面の地理の地図に立てる）----
// 操作パネルの節を 1 つ作る。既存の節（POI・線・面・視点・GPS）とは別の関数にまとめる。
// 表には classifyMarker の結果（範囲内／範囲外）と outsideMarkerLayer の結果（前面／背面）を
// textContent で出す。素材の JSON は変えず、紙の外の POI が 2 件未満ならデモの中で点を足す。
interface OutsidePoiEntry {
  /** addMarker が返した id（selectMarker に渡す） */
  id: string;
  /** その POI のデータ（classifyMarker に渡す） */
  data: any;
  /** 地図用 POI のときだけ（その地図のときだけ表に出す） */
  mapID?: string;
}

interface OutsidePoiSectionCtx {
  makeSection: (title: string) => { sec: HTMLElement; row: () => HTMLDivElement };
  mountSection: (s: { sec: HTMLElement; row: () => HTMLDivElement }) => void;
  /** 地図の節の透過度の表示も合わせる */
  setTransparency: (value: number) => void;
  /** POI の節の「選択中の POI」のチェックも合わせる */
  onSelected: (id: string | undefined) => void;
  entries: OutsidePoiEntry[];
  /** 範囲外の POI を載せる層（アプリ用 POI の層） */
  layerID: string;
  homePosition: [number, number];
}

function mountOutsidePoiSection(app: MaplatApp, ctx: OutsidePoiSectionCtx): void {
  const { makeSection, mountSection, entries, layerID } = ctx;
  const sec = makeSection(t("section.outside_poi"));
  const note = document.createElement("p");
  note.className = "demo-note";
  note.textContent = t("outside.note");
  sec.sec.appendChild(note);

  const table = document.createElement("table");
  table.id = "outside-poi-table";
  table.className = "demo-outside-table";
  table.style.cssText = "border-collapse:collapse;width:100%;font-size:11px;";
  sec.sec.appendChild(table);

  const status = document.createElement("p");
  status.className = "demo-note";
  status.id = "outside-poi-status";
  status.textContent = "";
  sec.sec.appendChild(status);

  // 範囲外のピンを押したときは、吹き出しの代わりに clickMarker の内容をこの節に出す
  app.addEventListener("clickMarker", (evt) => {
    const data = (evt as unknown as { detail?: Record<string, unknown> }).detail;
    if (!data) return;
    const name = i18n(data.name as string | { ja?: string; en?: string });
    const desc = typeof data.desc === "string" && data.desc ? ` — ${data.desc}` : "";
    status.textContent = `clickMarker: ${name}${desc}`;
  });

  const currentMapID = (): string | undefined =>
    (app.currentMapInfo() as { mapID?: string } | undefined)?.mapID;
  // その地図に出る POI だけを表に出す（地図用 POI はその地図のときだけ）
  const visibleEntries = (): OutsidePoiEntry[] =>
    entries.filter((entry) => entry.mapID === undefined || entry.mapID === currentMapID());

  type Row = { entry: OutsidePoiEntry; classified: Awaited<ReturnType<typeof classifyMarker>> };
  let rows: Row[] = [];
  let extrasAdded = false;
  let seq = 0;

  const classifyRows = async (): Promise<Row[]> =>
    Promise.all(
      visibleEntries().map(async (entry) => ({ entry, classified: await classifyMarker(app, entry.data) }))
    );

  // 紙の外の POI が 2 件に満たないとき、ホームの周りを少しずつ離して紙の縁の外の点を探し、
  // addMarker で足す（素材の JSON は変えない）。見つかった点は表にも出す
  const addExtras = async (outsideCount: number): Promise<void> => {
    if (extrasAdded || outsideCount >= 2) return;
    extrasAdded = true;
    if (!app.getPoiLayer(layerID)) return;
    const [lng, lat] = ctx.homePosition;
    const dirs: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]];
    const found: [number, number][] = [];
    for (const step of [0.004, 0.008, 0.02, 0.05]) {
      for (const [dx, dy] of dirs) {
        if (outsideCount + found.length >= 2) break;
        const lnglat: [number, number] = [lng + dx * step, lat + dy * step];
        const classified = await classifyMarker(app, { lnglat });
        if (classified.kind !== "outside") continue;
        if (found.some((p) => p[0] === lnglat[0] && p[1] === lnglat[1])) continue;
        found.push(lnglat);
        const data = {
          name: t("outside.example_name", { n: found.length }),
          desc: t("outside.example_desc"),
          lnglat
        };
        const id = app.addMarker(data, layerID) as string;
        entries.push({ id, data });
      }
      if (outsideCount + found.length >= 2) break;
    }
  };

  const render = (): void => {
    const layer = outsideMarkerLayer(app);
    const header = document.createElement("tr");
    for (const label of [t("outside.col_poi"), t("outside.col_range"), t("outside.col_layer")]) {
      const th = document.createElement("th");
      th.textContent = label;
      th.style.cssText = "text-align:left;border-bottom:1px solid #d5d9e2;padding:2px 4px;";
      header.appendChild(th);
    }
    const head = document.createElement("thead");
    head.appendChild(header);
    const body = document.createElement("tbody");
    for (const { entry, classified } of rows) {
      const tr = document.createElement("tr");
      tr.dataset.id = entry.id;
      const name = document.createElement("td");
      name.textContent = i18n(entry.data.name);
      const kind = document.createElement("td");
      kind.textContent =
        classified.kind === "inside" ? t("outside.inside") : classified.kind === "outside" ? t("outside.outside") : t("outside.outside_pixel");
      const drawn = document.createElement("td");
      // 範囲内は hide-outside-pois でも前面のまま（描かないのは範囲外だけ）
      drawn.textContent =
        classified.kind === "inside"
          ? t("outside.front")
          : classified.kind === "skip" || layer === "none"
            ? t("outside.not_drawn")
            : layer === "front"
              ? t("outside.front")
              : t("outside.back");
      for (const cell of [name, kind, drawn]) {
        cell.style.cssText = "border-bottom:1px solid #eef0f4;padding:2px 4px;";
        tr.appendChild(cell);
      }
      body.appendChild(tr);
    }
    table.replaceChildren(head, body);
  };

  const refresh = async (): Promise<void> => {
    const current = ++seq;
    try {
      const first = await classifyRows();
      if (current !== seq) return;
      await addExtras(first.filter((row) => row.classified.kind === "outside").length);
      if (current !== seq) return;
      rows = await classifyRows();
      if (current !== seq) return;
      render();
    } catch {
      // 地図の切り替えの途中は座標を写せないことがある。次の機会（mapChanged など）に出す
    }
  };

  // (1) 範囲外を出す（既定）と hide-outside-pois（起動後も変えられる既存の口を使う）
  const shownRow = sec.row();
  shownRow.appendChild(makeButton(t("outside.btn_show"), () => {
    app.applyRuntimeOptions({ hideOutsidePois: false });
    void refresh();
  }));
  shownRow.appendChild(makeButton("hide-outside-pois", () => {
    app.applyRuntimeOptions({ hideOutsidePois: true });
    void refresh();
  }));

  // (2) 透過度 0 と 70（紙に覆われた背面のピンが見えるか）
  const transparencyRow = sec.row();
  transparencyRow.appendChild(makeButton(t("outside.btn_transparency_0"), () => {
    ctx.setTransparency(0);
    void refresh();
  }));
  transparencyRow.appendChild(makeButton(t("outside.btn_transparency_70"), () => {
    ctx.setTransparency(70);
    void refresh();
  }));

  // (3) 範囲外のピンを選ぶ → 選択を外す。(4) 範囲内のピンを選ぶ
  const selectRow = sec.row();
  selectRow.appendChild(makeButton(t("outside.btn_select_outside"), () => {
    const hit = rows.find((row) => row.classified.kind === "outside");
    if (!hit) {
      status.textContent = t("outside.none_outside");
      return;
    }
    app.selectMarker(hit.entry.id);
    ctx.onSelected(hit.entry.id);
    status.textContent = t("outside.selected_outside", { name: i18n(hit.entry.data.name) });
  }));
  selectRow.appendChild(makeButton(t("outside.btn_unselect"), () => {
    app.unselectMarker();
    ctx.onSelected(undefined);
    status.textContent = t("outside.unselected");
  }));
  selectRow.appendChild(makeButton(t("outside.btn_select_inside"), () => {
    const hit = rows.find((row) => row.classified.kind === "inside");
    if (!hit) {
      status.textContent = t("outside.none_inside");
      return;
    }
    app.selectMarker(hit.entry.id);
    ctx.onSelected(hit.entry.id);
    status.textContent = t("outside.selected", { name: i18n(hit.entry.data.name) });
  }));

  mountSection(sec);
  app.addEventListener("mapChanged", () => { void refresh(); });
  void refresh();
}

async function main(): Promise<void> {
  const region = currentRegion();

  // 地域ドロップダウン（選択肢は REGION_META から生成。変更で ?region= を付けて再読み込み）
  const select = byId<HTMLSelectElement>("region-select");
  for (const id of REGION_IDS) {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = t(`region.${id}.label`);
    opt.selected = id === region;
    select.appendChild(opt);
  }
  select.addEventListener("change", () => {
    const url = new URL(location.href);
    url.searchParams.set("region", select.value);
    location.assign(url.toString());
  });

  // 地域説明（title・highlights）を #region-note に表示
  const note = byId("region-note");
  const noteTitle = document.createElement("strong");
  noteTitle.textContent = t(`region.${region}.title`);
  note.appendChild(noteTitle);
  const noteList = document.createElement("ul");
  noteList.style.cssText = "margin:4px 0 0 18px;padding:0;";
  for (const h of t(`region.${region}.highlights`).split("\n")) {
    const li = document.createElement("li");
    li.textContent = h;
    noteList.appendChild(li);
  }
  note.appendChild(noteList);

  const status = byId("status");
  const attr = byId("map-attr");
  const controls = byId("demo-controls");

  // 選択した POI の説明（name・desc・写真クレジット）を出典領域に併設して表示する
  const markerInfo = document.createElement("p");
  markerInfo.id = "marker-info";
  markerInfo.style.cssText = "margin-top:8px;display:none;";
  document.querySelector(".c4h-info-box")?.appendChild(markerInfo);
  // 面の出典（ODbL の表示義務）。表示中の面の source をそのまま textContent で出す
  const vectorAttr = document.createElement("p");
  vectorAttr.id = "vector-attr";
  vectorAttr.style.cssText = "margin-top:4px;display:none;";
  document.querySelector(".c4h-info-box")?.appendChild(vectorAttr);

  // app 設定を明示的に取得（root 起点のページ相対 apps/。検証済みの region だけを使う）
  const setting: AppSetting = await (await fetch(`apps/${region}.json`)).json();

  // 変換の形（?form=c|v2。既定は c）。c は public/maps-c/ の作り直した地図、v2 は public/maps/ のこれまでの地図（V2 のまま）。
  // maps-c/estimates.json（層ごとの推奨の型・適合スコア・strict・補完点の要約）が無ければ、切り替えは出さず v2 で動かす
  let estimates: Estimates | undefined;
  try {
    const res = await fetch(ESTIMATES_FILE);
    if (res.ok) estimates = (await res.json()) as Estimates;
  } catch {
    // 読めなければ切り替えなし
  }
  let form: MapForm = estimates ? parseMapForm(location.search) : "v2";
  // 従来型の strict の判定に使う、元の地図の JSON の compiled.strict_status（本図・挿入図の順）
  const v2Statuses: Record<string, string[]> = {};

  // この地域の古地図のうち、IIIF の配信（delivery.type === "iiifImage"）を使うもの。
  // 「IIIF の画像」の節をどの地図で見せるかを決める（デモだけの処理。地図の設定は読むだけ）
  const iiifMapIDs: string[] = [];
  // 書誌（iiif 節）を持つ地図。「IIIF の書誌」の節の地図の切り替えに、アプリ設定の順で出す
  const bibliographyMaps: Array<{ mapID: string; label: string }> = [];
  for (const source of setting.sources) {
    if (typeof source === "string") continue;
    const mapID = (source as { mapID: string }).mapID;
    try {
      const map = await (await fetch(`maps/${mapID}.json`)).json();
      v2Statuses[mapID] = v2StrictStatuses(map);
      if (map?.delivery?.type === "iiifImage") iiifMapIDs.push(mapID);
      if (map?.iiif && typeof map.iiif === "object" && !Array.isArray(map.iiif)) {
        const label = i18n((source as { label?: string | { ja?: string; en?: string } }).label) || mapID;
        bibliographyMaps.push({ mapID, label });
      }
    } catch {
      // 読めない地図は IIIF として扱わない（節には出さない）
    }
  }

  // 素材をバンドルから取得（無ければ「欠け」＝ボタンを出さないだけ）
  const loader = CONTENTS[`./content/${region}.json`];
  const content: RegionContent | undefined = loader ? ((await loader()) as RegionContent) : undefined;
  const demoOps: DemoOps = content?.demoOps ?? EMPTY_OPS;
  const appPois: Poi[] = content?.appPois ?? [];
  const mapPois: MapPoi[] = content?.mapPois ?? [];
  const appLines: LineItem[] = content?.appLines ?? [];
  const mapLines: MapLineItem[] = content?.mapLines ?? [];

  // ---- app ごとの節と、app を作り直しても残る節 ----
  // app ごとの節（地図・POI・線・面・視点・GPS）は appArea に置き、再生成のたびに作り直す。
  // 「破棄と再生成」「状態」「イベント履歴」は fixedArea に置き、app を作り直しても残す（操作パネルの最下部）
  const appArea = document.createElement("div");
  appArea.id = "demo-app-controls";
  controls.appendChild(appArea);
  const fixedArea = document.createElement("div");
  fixedArea.id = "demo-fixed-controls";
  controls.appendChild(fixedArea);

  // ---- 操作パネルの部品 ----
  interface Sec { sec: HTMLElement; row: () => HTMLDivElement; }
  const makeSection = (title: string): Sec => {
    const sec = document.createElement("section");
    sec.className = "demo-sec";
    const h = document.createElement("h2");
    h.textContent = title;
    sec.appendChild(h);
    const row = (): HTMLDivElement => {
      const r = document.createElement("div");
      r.className = "demo-row";
      sec.appendChild(r);
      return r;
    };
    return { sec, row };
  };
  // 中に操作が 1 つも無い節は出さない（欠けの非表示）。置き場所（app ごと／残す）を選べる。既定は app ごとの節
  const mountSection = (s: Sec, parent: HTMLElement = appArea): void => {
    if (s.sec.querySelector("button, input, select")) parent.appendChild(s.sec);
  };
  const makeCheck = (label: string, checked: boolean, onChange: (on: boolean) => void): HTMLLabelElement => {
    const wrap = document.createElement("label");
    wrap.className = "demo-check";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = checked;
    cb.addEventListener("change", () => { onChange(cb.checked); });
    wrap.appendChild(cb);
    wrap.appendChild(document.createTextNode(label));
    return wrap;
  };
  // その地図に対象が無いチェックを無効にする（選択状態は保つ）
  const setUsable = (wrap: HTMLLabelElement, usable: boolean, reason: string): void => {
    const cb = wrap.querySelector("input");
    if (!cb) return;
    cb.disabled = !usable;
    wrap.style.opacity = usable ? "" : "0.45";
    wrap.style.cursor = usable ? "" : "not-allowed";
    if (usable) wrap.removeAttribute("title");
    else wrap.title = reason;
  };

  // ---- 状態。app を作り直しても残す ----
  const stateSec = makeSection(t("section.state"));
  const stateRow = (label: string, id: string): HTMLElement => {
    const r = stateSec.row();
    r.classList.add("demo-state-row");
    const k = document.createElement("span");
    k.className = "demo-state-key";
    k.textContent = label;
    const v = document.createElement("span");
    v.className = "demo-state-val";
    v.id = id;
    v.textContent = "—";
    r.appendChild(k);
    r.appendChild(v);
    return v;
  };
  const stRotation = stateRow(t("state.rotation"), "state-rotation");
  const stGps = stateRow(t("state.gps"), "state-gps");
  const stViewpoint = stateRow(t("state.viewpoint"), "state-viewpoint");
  const stUpdate = stateRow("updateState", "state-update");
  const stClick = stateRow(t("state.click"), "state-click");
  const stUnknown = stateRow(t("state.unknown_map"), "state-unknown-map");
  const stError = stateRow(t("state.error"), "state-error");

  // ---- イベント履歴。新しい順・最大 50 件。changeViewpoint と updateState は直前と同種なら上書き ----
  const LOG_MAX = 50;
  const COALESCE = new Set(["changeViewpoint", "updateState"]);
  const logSec = makeSection(t("section.log"));
  const logList = document.createElement("ol");
  logList.className = "demo-log";
  logList.id = "event-log";
  logSec.sec.appendChild(logList);
  const logEntries: { type: string; text: string; time: string }[] = [];
  const renderLog = (): void => {
    logList.replaceChildren(
      ...logEntries.map((e) => {
        const li = document.createElement("li");
        li.dataset.type = e.type;
        const timeEl = document.createElement("span");
        timeEl.className = "demo-log-time";
        timeEl.textContent = e.time;
        const n = document.createElement("strong");
        n.textContent = e.type;
        li.append(timeEl, " ", n);
        if (e.text) li.append(` ${e.text}`);
        return li;
      })
    );
  };
  const logEvent = (type: string, text = ""): void => {
    const time = new Date().toLocaleTimeString(lang === "ja" ? "ja-JP" : "en-GB", { hour12: false });
    const entry = { type, text, time };
    if (COALESCE.has(type) && logEntries[0]?.type === type) logEntries[0] = entry;
    else {
      logEntries.unshift(entry);
      if (logEntries.length > LOG_MAX) logEntries.length = LOG_MAX;
    }
    renderLog();
  };
  const errText = (e: unknown): string => (e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e));
  const showError = (where: string, e: unknown): void => {
    const msg = `${where}: ${errText(e)}`;
    stError.textContent = msg;
    logEvent("error", msg);
  };
  window.addEventListener("unhandledrejection", (ev) => { showError("unhandledrejection", ev.reason); });
  window.addEventListener("error", (ev) => {
    // ResizeObserver の通知の遅れはブラウザの報告で、地図の誤りではない
    if (String(ev.message).includes("ResizeObserver")) return;
    showError("error", ev.error ?? ev.message);
  });
  // イベントの detail（Core の CustomEvent）
  const detailOf = (evt: unknown): unknown => (evt as { detail?: unknown }).detail;
  const num = (v: unknown, digits: number): string => (typeof v === "number" ? v.toFixed(digits) : "—");
  const brief = (v: unknown): string => {
    const s = JSON.stringify(v) ?? "";
    return s.length > 160 ? `${s.slice(0, 160)}…` : s;
  };

  // 変換の形の節の「いまの地図の情報」の更新。節は app を作り直しても残るので、app の外に置き、buildApp の中の refreshMapState から呼ぶ
  let refreshFormInfo: () => void = () => undefined;

  // 1 つの app に対して、節を作り、イベントを購読する（古い app への参照を残さない）
  const buildApp = (app: MaplatApp): void => {
    // 現在地図の mapID（currentMapInfo().mapID）。出典表示・線の地図別表示で使う。
    const activeMapId = (): string | undefined => {
      const info = app.currentMapInfo() as { mapID?: string } | undefined;
      return info?.mapID;
    };

    // ---- 出典表示（現在地図のラベル・attr・license・dataLicense）----
    // currentMapInfo()（createMapInfo）は source[key] の直接プロパティしか読まないが、
    // 地図メタは mixin.ts が OL の this.set(key, …)（values_）に格納するため attr/license が
    // 直接プロパティになく、出典欄が空になる。公開 API の getMapMeta(mapID)
    // は source.get(key) で読むのでこちらを使う。attr は {ja, en} 形があり得るため i18n() を通す。
    // 手順 4: refreshAttr の dataLicense 行を置き換える
    const attrDataParts = (m: { dataAttr?: string | { ja?: string; en?: string }; dataLicense?: string } | undefined): string[] => {
      const dataAttr = m ? i18n(m.dataAttr) : "";
      if (dataAttr && m?.dataLicense) return [t("attr.geo_data_license", { attr: dataAttr, license: m.dataLicense })];
      if (m?.dataLicense) return [t("attr.geo_data", { value: m.dataLicense })];
      if (dataAttr) return [t("attr.geo_data", { value: dataAttr })];
      return [];
    };
    const refreshAttr = (): void => {
      const m = app.getMapMeta(activeMapId()) as
        | {
            label?: string | { ja?: string; en?: string };
            attr?: string | { ja?: string; en?: string };
            license?: string;
            dataAttr?: string | { ja?: string; en?: string };
            dataLicense?: string;
          }
        | undefined;
      const parts: string[] = [];
      const label = m ? i18n(m.label) : "";
      const attrStr = m ? i18n(m.attr) : "";
      if (label && attrStr) parts.push(`${label}: ${attrStr}`);
      else if (attrStr) parts.push(attrStr);
      else if (label) parts.push(label);
      if (m?.license) parts.push(t("attr.license", { license: m.license }));
      // dataAttr・dataLicense（CC BY-SA など）の地図は「地理参照データ」を併記する
      parts.push(...attrDataParts(m));
      attr.textContent = parts.join(t("attr.sep"));
    };

    // ---- 視点表示（回転・方位。zoom は Core 公開面に取得 API が無いため出さない）----
    const refreshViewpoint = async (): Promise<void> => {
      const rotation = app.getRotation();
      const direction = await app.getDirection();
      status.textContent = t("view.rotation_direction", { rotation: rotation.toFixed(1), direction: direction.toFixed(1) });
      stRotation.textContent = status.textContent;
    };

    // ---- POI レイヤ ----
    // アプリ用 POI はアプリ全体の層 "app"（全地図に出る）。追加 POI もここに入れる。
    // 地図用 POI は地図ソースごとの層 "<mapID>#map"（Core は現在の地図のソースの層だけを描く＝その地図にだけ出る）。
    // 移動ピンはアプリ全体の層 "move"（全地図に出る。独自アイコン）。
    const APP_LAYER = "app";
    const MAP_LAYER = "map";
    const MOVE_LAYER = "move";
    const mapLayerId = (mapID: string): string => `${mapID}#${MAP_LAYER}`;
    // 出る地図が限られる追加 POI・移動ピンは、地図用 POI と同じく地図ソースごとの層に載せる
    // （Core は現在の地図のソースの層だけを描く＝その地図にだけ出る。ベースマップ gsi/osm の層も同じ）
    const ADD_LAYER = "add";
    const addLayerId = (mapID: string): string => `${mapID}#${ADD_LAYER}`;
    const moveLayerId = (mapID: string): string => `${mapID}#${MOVE_LAYER}`;
    const ensureLayer = (id: string, name: string): void => {
      if (!app.getPoiLayer(id)) app.addPoiLayer(id, { name });
    };
    if (appPois.length > 0 || demoOps.addPoi.length > 0) app.addPoiLayer(APP_LAYER, { name: t("poi.layer_app") });
    // 「範囲外の POI」の節が使う（どの POI が範囲の外か・どの層に描くかを出す）。
    // 地図用 POI はその地図のときだけ節に出すので、mapID を控える
    const recordedPois: OutsidePoiEntry[] = [];
    // Core の normalizePoi は渡した POI をその場で書き換えるので、素材は写しで渡す（素材を書き換えないため）
    for (const poi of appPois) {
      recordedPois.push({ id: app.addMarker(structuredClone(poi), APP_LAYER) as string, data: poi });
    }
    // 地図用 POI は maps の地図ごとに 1 件ずつ写しを載せる。地図ごとの件数はトグルの無効化に使う
    const mapPoiCount = new Map<string, number>();
    for (const poi of mapPois) {
      const { maps, ...data } = poi;
      for (const mapID of maps) {
        if (!app.getPoiLayer(mapLayerId(mapID))) app.addPoiLayer(mapLayerId(mapID), { name: t("poi.layer_map") });
        recordedPois.push({ id: app.addMarker(structuredClone(data), mapLayerId(mapID)) as string, data, mapID });
        mapPoiCount.set(mapID, (mapPoiCount.get(mapID) ?? 0) + 1);
      }
    }

    // ---- 線・面 ----
    // アプリの線は全地図に、地図の線は maps の地図にだけ描く。どちらも既定で表示（チェック済み）。
    // 地図を切り替えると Core は全部の線を描き直す（地図の区別をしない）ので、切替前に clearLine し、
    // mapChanged で「表示中かつこの地図に出す線」だけを描く（前の地図の線・面を残さない）。
    const activeLines: LineItem[] = [...appLines, ...mapLines];
    // 面は既定で表示（チェック済み）。面の出典（ODbL の表示義務）を出典の領域に textContent で出す
    const activeVectors: VectorItem[] = [...demoOps.addVector];
    const refreshVectorAttr = (): void => {
      vectorAttr.textContent = "";
      activeVectors.forEach((vec, index) => {
        if (index > 0) vectorAttr.appendChild(document.createTextNode(t("attr.sep")));
        vectorAttr.appendChild(document.createTextNode(t("vector.source", { source: vec.source })));
        if (!vec.source.startsWith("OpenStreetMap")) return;
        // OpenStreetMap のデータの表示義務: 著作権表示と copyright ページへのリンク
        const copyrightLink = document.createElement("a");
        copyrightLink.href = "https://www.openstreetmap.org/copyright";
        copyrightLink.target = "_blank";
        copyrightLink.rel = "noopener";
        copyrightLink.textContent = t("vector.copyright");
        const [creditBefore, creditAfter] = t("vector.osm_credit", { link: "\u0000" }).split("\u0000");
        vectorAttr.appendChild(document.createTextNode(`${t("attr.sep")}${creditBefore}`));
        vectorAttr.appendChild(copyrightLink);
        vectorAttr.appendChild(document.createTextNode(creditAfter));
      });
      vectorAttr.style.display = activeVectors.length > 0 ? "" : "none";
    };
    const lineApplies = (line: LineItem | MapLineItem, mapID: string | undefined): boolean => {
      if (!("maps" in line)) return true; // アプリの線
      return mapID !== undefined && line.maps.includes(mapID);
    };
    // 素材がその古地図の範囲で切った部分（clipped）を持てばそれを、無ければ points をそのまま描く
    const drawnPoints = (line: LineItem, mapID: string | undefined): [number, number][] =>
      (mapID !== undefined ? line.clipped?.[mapID] : undefined) ?? line.points;
    const redrawShapes = (): void => {
      const mapID = activeMapId();
      app.clearLine();
      for (const line of activeLines) {
        if (lineApplies(line, mapID)) {
          app.addLine({ lnglats: drawnPoints(line, mapID), stroke: PALETTE[line.kind].stroke });
        }
      }
      for (const vec of activeVectors) {
        app.addVector({ type: "Polygon", lnglats: [vec.points], style: PALETTE[vec.kind] });
      }
    };

    // ---- 地図（ドロップダウン＋透過度スライダー）----
    const mapSec = makeSection(t("section.map"));
    const mapField = document.createElement("label");
    mapField.className = "demo-field";
    mapField.appendChild(document.createTextNode(t("map.field")));
    const mapSelect = document.createElement("select");
    mapSelect.id = "map-select";
    const oldGroup = document.createElement("optgroup");
    oldGroup.label = t("map.group_old");
    const baseGroup = document.createElement("optgroup");
    baseGroup.label = t("map.group_base");
    // 起動のときに使えなかった地図（IIIF の取得に失敗した等）は、一覧で「使えない地図」にする。
    // 控えは Core の内部ではなく、公開の振る舞いである console.error の文から地図の ID を取る
    // （文の形: Maplat: IIIF image for map "<mapID>" is not usable: <reason>）
    const unusableIds = new Set(
      unusableMessages
        .map((message) => /map "([^"]+)" is not usable/.exec(message)?.[1])
        .filter((mapID): mapID is string => !!mapID)
    );
    for (const source of setting.sources) {
      const isBasemap = typeof source === "string";
      const mapID = isBasemap ? source : (source as { mapID: string }).mapID;
      const label = isBasemap
        ? (BASEMAP_LABEL[mapID] ?? mapID)
        : (i18n((source as { label?: string | { ja?: string; en?: string } }).label) || mapID);
      const opt = document.createElement("option");
      opt.value = mapID;
      opt.textContent = label;
      if (unusableIds.has(mapID)) {
        opt.textContent = t("map.unusable", { label });
        opt.disabled = true;
      }
      (isBasemap ? baseGroup : oldGroup).appendChild(opt);
    }
    for (const g of [oldGroup, baseGroup]) if (g.children.length > 0) mapSelect.appendChild(g);
    mapSelect.addEventListener("change", () => {
      // 前の地図の線・面を残さない: 切替前に線・面を空にする
      app.clearLine();
      void app.changeMap(mapSelect.value);
    });
    mapField.appendChild(mapSelect);
    mapSec.row().appendChild(mapField);
    const opField = document.createElement("label");
    opField.className = "demo-field";
    const opText = document.createTextNode(t("map.transparency", { value: 0 }));
    const opRange = document.createElement("input");
    opRange.type = "range";
    opRange.id = "opacity-range";
    opRange.min = "0";
    opRange.max = "100";
    opRange.step = "10";
    opRange.value = "0";
    // 「範囲外の POI」の節の透過度のボタンからも同じ口を使う（スライダーの表示も合わせる）
    const setTransparency = (value: number): void => {
      opRange.value = String(value);
      opText.textContent = t("map.transparency", { value });
      app.setTransparency(value);
    };
    opRange.addEventListener("input", () => {
      setTransparency(Number(opRange.value));
    });
    opField.appendChild(opText);
    opField.appendChild(opRange);
    mapSec.row().appendChild(opField);
    mountSection(mapSec);
    const renderMapSelect = (activeId: string | undefined): void => {
      if (activeId !== undefined) mapSelect.value = activeId;
    };

    // ---- POI（表示のチェック・追加はチェック・移動はチェック）----
    const poiSec = makeSection(t("section.poi"));
    // POI の選択: クリックした POI を Core の selectMarker で選ぶ（アイコンが selected になり、画面の中央へ来る）。
    // 「選択中の POI」のチェックは選択があるときだけ有効で、外すと unselectMarker で全部を未選択に戻す
    let selectedId: string | undefined;
    const selectWrap = makeCheck(t("poi.selected"), false, (on) => { if (!on) clearSelection(); });
    const refreshSelectCheck = (): void => {
      const cb = selectWrap.querySelector("input");
      if (cb) cb.checked = selectedId !== undefined;
      setUsable(selectWrap, selectedId !== undefined, t("poi.select_hint"));
    };
    const clearSelection = (): void => {
      if (selectedId === undefined) return;
      selectedId = undefined;
      app.unselectMarker();
      markerInfo.style.display = "none";
      refreshSelectCheck();
    };
    let mapPoiCheck: HTMLLabelElement | undefined;
    if (appPois.length > 0 || mapPoiCount.size > 0) {
      const showRow = poiSec.row();
      showRow.appendChild(makeCheck(t("poi.show_all"), true, (on) => {
        if (on) app.showAllMarkers();
        else app.hideAllMarkers();
      }));
      if (appPois.length > 0) {
        showRow.appendChild(makeCheck(t("poi.layer_app"), true, (on) => {
          if (on) app.showPoiLayer(APP_LAYER);
          else app.hidePoiLayer(APP_LAYER);
        }));
      }
      if (mapPoiCount.size > 0) {
        // 地図用 POI の層は地図ごとにあるので、全部の層へ同じ表示状態を掛ける（地図を替えても揃う）
        mapPoiCheck = makeCheck(t("poi.layer_map"), true, (on) => {
          for (const mapID of mapPoiCount.keys()) {
            if (on) app.showPoiLayer(mapLayerId(mapID));
            else app.hidePoiLayer(mapLayerId(mapID));
          }
        });
        showRow.appendChild(mapPoiCheck);
      }
    }
    const refreshPoiChecks = (): void => {
      if (!mapPoiCheck) return;
      const n = mapPoiCount.get(activeMapId() ?? "") ?? 0;
      setUsable(mapPoiCheck, n > 0, t("poi.no_map_pois"));
    };
    // 追加 POI・移動のうち出る地図が限られるもの。その地図に無ければチェックを無効化する
    const opChecks: { wrap: HTMLLabelElement; maps: string[] }[] = [];
    const refreshOpChecks = (): void => {
      const mapID = activeMapId() ?? "";
      for (const { wrap, maps } of opChecks) setUsable(wrap, maps.includes(mapID), t("poi.not_on_map"));
    };
    if (demoOps.addPoi.length > 0 || demoOps.movePoi.length > 0) {
      const opRow = poiSec.row();
      // POI 追加: on で追加・off で削除。Core の removeMarker は #111 の修正（edd55e9 以降）が前提
      // maps が無ければアプリ全体の層（全地図）、あれば地図ごとの層 "<mapID>#add"（その地図にだけ出る）
      for (const op of demoOps.addPoi) {
        const layers = op.maps ? op.maps.map(addLayerId) : [APP_LAYER];
        if (op.maps) for (const id of layers) ensureLayer(id, t("poi.layer_add"));
        let addedIds: string[] = [];
        const wrap = makeCheck(op.label, false, (on) => {
          if (on && addedIds.length === 0) addedIds = layers.map((id) => app.addMarker(structuredClone(op.poi), id) as string);
          if (!on && addedIds.length > 0) {
            if (selectedId !== undefined && addedIds.includes(selectedId)) clearSelection(); // 消す POI を選んだままにしない
            for (const id of addedIds) app.removeMarker(id);
            addedIds = [];
          }
        });
        if (op.maps) opChecks.push({ wrap, maps: op.maps });
        opRow.appendChild(wrap);
      }
      // 移動ピン: 始点・終点は参照する線（アプリの線か地図の線）の最初と最後の頂点。既存の POI の座標は使わない
      // 地図の線を参照するときは、その線の maps の地図ごとの層 "<mapID>#move" に 1 本ずつ置く（線と同じ地図にだけ出る）
      const lineMapsOf = (l: LineItem | MapLineItem): string[] | undefined => ("maps" in l ? l.maps : undefined);
      const sourceIds = setting.sources.map((s) => (typeof s === "string" ? s : (s as { mapID: string }).mapID));
      for (const move of demoOps.movePoi) {
        const line = appLines.find((l) => l.label === move.line) ?? mapLines.find((l) => l.label === move.line);
        if (!line || line.points.length < 2) continue; // 素材の検査（scripts/verify-demo-content.js）が先に落とす。ここでは出さないだけ
        const pin = (at: [number, number], where: string) => ({
          name: move.label,
          desc: t("poi.move_desc", { line: line.label, where }),
          lnglat: [at[0], at[1]] as [number, number],
          icon: MOVE_ICON,
          selectedIcon: MOVE_ICON_SELECTED
        });
        const lineMaps = lineMapsOf(line);
        // 線が古地図の範囲で切った部分（clipped）を持つときは、地図ごとの層に置き、
        // その地図で描く部分の最初と最後の頂点を始点・終点にする（範囲の外へ移って消えない）。
        // 地図の線は maps の地図ごと、切った部分を持つアプリの線は全地図ごと、どちらでもなければアプリ全体の層に 1 本
        const perMap = lineMaps ?? (line.clipped ? sourceIds : undefined);
        const places = perMap
          ? perMap.map((mapID) => ({ layer: moveLayerId(mapID), pts: drawnPoints(line, mapID) }))
          : [{ layer: MOVE_LAYER, pts: line.points }];
        const ends = places.map(({ layer, pts }) => {
          ensureLayer(layer, t("poi.layer_move"));
          const start = pts[0];
          const end = pts[pts.length - 1];
          return { id: app.addMarker(pin(start, t("poi.move_start")), layer) as string, start, end };
        });
        const wrap = makeCheck(move.label, false, (on) => {
          for (const { id, start, end } of ends) app.updateMarker(id, on ? pin(end, t("poi.move_end")) : pin(start, t("poi.move_start")), false);
        });
        if (lineMaps) opChecks.push({ wrap, maps: lineMaps });
        opRow.appendChild(wrap);
      }
    }
    poiSec.row().appendChild(selectWrap);

    // ---- アイコン指定の層・年代で色を変える層・重なった POI ----
    // 素材を増やさずにボタンだけで足す。地点は app 設定の homePosition の周り
    const homeLngLat = (): [number, number] => [setting.homePosition[0], setting.homePosition[1]];
    const extraRow = poiSec.row();
    const iconBtn = makeButton(t("poi.btn_icon_layer"), () => {
      if (app.getPoiLayer(ICON_LAYER)) return;
      app.addPoiLayer(ICON_LAYER, { name: t("poi.icon_layer_name"), icon: LAYER_ICON, selectedIcon: LAYER_ICON_SELECTED });
      const [lng, lat] = homeLngLat();
      const offsets: [number, number][] = [[-0.0015, 0.0008], [0.0015, 0.0008], [0, -0.0012]];
      offsets.forEach(([dx, dy], i) => {
        app.addMarker({ name: t("poi.icon_example_name", { n: i + 1 }), desc: t("poi.icon_example_desc"), lnglat: [lng + dx, lat + dy] }, ICON_LAYER);
      });
      iconBtn.disabled = true;
    });
    const eraBtn = makeButton(t("poi.btn_era_layer"), () => {
      if (app.getPoiLayer(ERA_LAYER)) return;
      app.addPoiLayer(ERA_LAYER, { name: t("poi.era_layer_name"), iconTemplate: ERA_ICON_TEMPLATE });
      // 素材の POI（start を持つものがある）を写しで載せる。地図用 POI も全地図に出す
      for (const poi of [...appPois, ...mapPois]) app.addMarker(structuredClone(poi), ERA_LAYER);
      eraBtn.disabled = true;
    });
    const overlapBtn = makeButton(t("poi.btn_overlap"), () => {
      if (app.getPoiLayer(OVERLAP_LAYER)) app.clearMarker(OVERLAP_LAYER);
      else app.addPoiLayer(OVERLAP_LAYER, { name: t("poi.overlap_layer_name") });
      const [lng, lat] = homeLngLat();
      for (const n of [1, 2]) {
        app.addMarker({ name: t("poi.overlap_name", { n }), desc: t("poi.overlap_desc", { n }), lnglat: [lng, lat] }, OVERLAP_LAYER);
      }
      app.goHome();
    });
    extraRow.append(iconBtn, eraBtn, overlapBtn);
    const eraNote = document.createElement("p");
    eraNote.className = "demo-note";
    eraNote.textContent = t("poi.era_note");
    poiSec.sec.appendChild(eraNote);
    // ---- poiTemplate の記法のプリセット（Nunjucks と旧い記法の対比）----
    // 切り替えるたびに警告の記憶を戻し（デモだけの処理）、警告の欄を空にしてから描き直す
    const templateRow = poiSec.row();
    const templateLabel = document.createElement("span");
    templateLabel.textContent = `${t("poi.template_label")} `;
    templateRow.appendChild(templateLabel);
    const applyTemplatePreset = (preset: (typeof TEMPLATE_PRESETS)[number]): void => {
      resetTemplateWarnings();
      templateWarnings.replaceChildren();
      templateCurrent.textContent = t("poi.template_current", { label: t(preset.labelKey), template: preset.template });
      // 先にテンプレートを替える（層・POI の追加で起きる描き直しが、前のプリセットで評価して警告を出さないように）
      app.poiTemplate = preset.template;
      if (preset.id === "safe" && !app.getPoiLayer(TEMPLATE_LAYER)) {
        // 名前に <b> を含む POI（{{ name }} では文字のまま、{{ name | safe }} では太字になる）
        app.addPoiLayer(TEMPLATE_LAYER, { name: t("poi.template_layer_name") });
        const [lng, lat] = homeLngLat();
        app.addMarker({ name: t("poi.template_bold_name"), desc: t("poi.template_bold_desc"), lnglat: [lng, lat + 0.002] }, TEMPLATE_LAYER);
      }
      detailBox.textContent = "";
      app.redrawMarkers();
      if (!templateWarnings.childElementCount) templateWarnings.textContent = t("poi.template_warnings_none");
    };
    for (const preset of TEMPLATE_PRESETS) {
      const btn = makeButton(t(preset.labelKey), () => { applyTemplatePreset(preset); });
      btn.dataset.templatePreset = preset.id;
      templateRow.appendChild(btn);
    }
    const templateCurrent = document.createElement("p");
    templateCurrent.className = "demo-note";
    templateCurrent.id = "template-current";
    templateCurrent.textContent = t("poi.template_current", { label: t(TEMPLATE_PRESETS[0].labelKey), template: POI_TEMPLATE });
    const templateWarnings = document.createElement("div");
    templateWarnings.className = "demo-note demo-template-warnings";
    templateWarnings.id = "template-warnings";
    templateWarnings.textContent = t("poi.template_warnings_none");
    templateWarningSink = (message) => {
      if (templateWarnings.textContent === t("poi.template_warnings_none")) templateWarnings.replaceChildren();
      const line = document.createElement("p");
      line.textContent = t("poi.template_warning", { message });
      templateWarnings.appendChild(line);
    };
    poiSec.sec.append(templateCurrent, templateWarnings);
    // clickMarkers の件数と、poiTemplate から作られた detail.html（sanitizeHtml を通したものだけ）
    const hitsLine = document.createElement("p");
    hitsLine.className = "demo-poi-hits";
    hitsLine.id = "poi-hits";
    hitsLine.textContent = t("poi.hits_hint");
    const detailBox = document.createElement("div");
    detailBox.className = "demo-poi-detail";
    detailBox.id = "poi-detail";
    poiSec.sec.append(hitsLine, detailBox);

    // ---- POI の層の一覧（listPoiLayers）・層ごとの表示切替・層ごとの消去 ----
    const layersBox = document.createElement("div");
    layersBox.className = "demo-poi-layers";
    layersBox.id = "poi-layers";
    poiSec.sec.appendChild(layersBox);
    type LayerInfo = { namespaceID: string; name?: string | { ja?: string; en?: string }; pois: unknown[]; hide?: boolean };
    const refreshPoiLayers = (): void => {
      const layers = app.listPoiLayers() as LayerInfo[];
      const title = document.createElement("p");
      title.className = "demo-note";
      title.textContent = t("poi.layers_title", { count: layers.length });
      const rows = layers.map((layer) => {
        const row = document.createElement("div");
        row.className = "demo-row demo-poi-layer";
        row.dataset.layer = layer.namespaceID;
        const name = i18n(layer.name) || layer.namespaceID;
        row.appendChild(makeCheck(t("poi.layer_row", { id: layer.namespaceID, name, count: layer.pois.length }), !layer.hide, (on) => {
          if (on) app.showPoiLayer(layer.namespaceID);
          else app.hidePoiLayer(layer.namespaceID);
          refreshPoiLayers();
        }));
        row.appendChild(makeButton(t("poi.btn_remove"), () => {
          clearSelection();
          app.clearMarker(layer.namespaceID);
        }));
        return row;
      });
      const mapID = activeMapId();
      if (mapID !== undefined) {
        const allRow = document.createElement("div");
        allRow.className = "demo-row demo-poi-layer";
        allRow.dataset.layer = `${mapID}#all`;
        allRow.appendChild(makeButton(t("poi.btn_remove_all", { id: `${mapID}#all` }), () => {
          clearSelection();
          app.clearMarker(`${mapID}#all`);
        }));
        rows.push(allRow);
      }
      layersBox.replaceChildren(title, ...rows);
    };
    mountSection(poiSec);

    // ---- 範囲外の POI（古地図の紙の外の POI は背面の地図に立つ）----
    // 館林（城絵図の紙が狭く、紙の外の POI がある地域）だけに出す。他の地域の POI の数を変えない。
    // 選択は POI の節の「選択中の POI」のチェックにも反映する
    const markSelected = (id: string | undefined): void => {
      selectedId = id;
      refreshSelectCheck();
    };
    if (region === "tatebayashi" && recordedPois.length > 0) {
      mountOutsidePoiSection(app, {
        makeSection,
        mountSection,
        setTransparency,
        onSelected: markSelected,
        entries: recordedPois,
        layerID: APP_LAYER,
        homePosition: [setting.homePosition[0], setting.homePosition[1]]
      });
    }

    // ---- 線・面（v4.2。アプリの線・地図の線とも既定で表示。地図の線はその地図に無いときチェックを無効化）----
    const shapeSec = makeSection(t("section.shapes"));
    const shapeRow = shapeSec.row();
    const toggleIn = <T>(list: T[], item: T, on: boolean): void => {
      const idx = list.indexOf(item);
      if (on && idx < 0) list.push(item);
      if (!on && idx >= 0) list.splice(idx, 1);
    };
    for (const line of appLines) {
      shapeRow.appendChild(makeCheck(line.label, true, (on) => { toggleIn<LineItem>(activeLines, line, on); redrawShapes(); }));
    }
    // 地図の線は、現在の地図に無いときチェックを無効化する（選択状態は保つ）
    const lineChecks: { line: MapLineItem; wrap: HTMLLabelElement }[] = [];
    for (const line of mapLines) {
      const wrap = makeCheck(line.label, true, (on) => { toggleIn<LineItem>(activeLines, line, on); redrawShapes(); });
      lineChecks.push({ line, wrap });
      shapeRow.appendChild(wrap);
    }
    const refreshLineChecks = (): void => {
      const mapID = activeMapId();
      for (const { line, wrap } of lineChecks) setUsable(wrap, lineApplies(line, mapID), t("shape.unavailable"));
    };
    for (const vec of demoOps.addVector) {
      shapeRow.appendChild(makeCheck(vec.label, true, (on) => { toggleIn(activeVectors, vec, on); refreshVectorAttr(); redrawShapes(); }));
    }
    refreshVectorAttr();
    mountSection(shapeSec);

    // ---- 視点 ----
    const viewSec = makeSection(t("section.view"));
    const viewRow = viewSec.row();
    viewRow.appendChild(makeButton(t("view.home"), () => { app.goHome(); }));
    viewRow.appendChild(makeButton(t("view.reset_rotation"), () => { app.resetRotation(); }));
    viewRow.appendChild(makeButton(t("view.north_up"), () => { app.resetDirection(); }));
    mountSection(viewSec);

    // ---- キャッシュ（視点の次）----
    buildCacheSection({ app, makeSection, mountSection, showError, logEvent, activeMapId, disabledReason: cacheDisabledReason });

    // ---- GPS ----
    const gpsSec = makeSection(t("section.gps"));
    const gpsRow = gpsSec.row();
    const gpsCheck = makeCheck(t("gps.use"), false, (on) => {
      app.handleGPS(on);
      const cb = gpsCheck.querySelector("input");
      if (cb) cb.checked = app.getGPSEnabled();
    });
    gpsRow.appendChild(gpsCheck);
    const fakeRow = gpsSec.row();
    fakeRow.appendChild(makeButton(t("gps.fake_on"), () => {
      const hp = setting.homePosition;
      app.setGPSMarker({ lnglat: [hp[0], hp[1]], acc: 60 });
    }));
    fakeRow.appendChild(makeButton(t("gps.fake_off"), () => { app.setGPSMarker(null); }));
    mountSection(gpsSec);

    // ---- 地図切替・視点変化に追従して、出典・選択中の地図・線・視点を出し直す ----
    const refreshMapState = (): void => {
      // 地図ごとの層の POI（"<mapID>#…"）を選んだまま別の地図へ替えたら、選択を外す（描かれない POI を選んだままにしない）
      if (selectedId?.includes("#") && !selectedId.startsWith(`${activeMapId()}#`)) clearSelection();
      refreshSelectCheck();
      refreshAttr();
      renderMapSelect(activeMapId());
      refreshPoiChecks();
      refreshPoiLayers();
      refreshOpChecks();
      refreshLineChecks();
      redrawShapes();
      void refreshViewpoint();
      refreshFormInfo();
    };
    app.addEventListener("mapChanged", () => {
      refreshMapState();
      logEvent("mapChanged", activeMapId() ?? "");
    });
    app.addEventListener("changeViewpoint", (evt) => {
      void refreshViewpoint();
      const d = detailOf(evt) as { longitude?: number; latitude?: number; zoom?: number; direction?: number } | undefined;
      const text = t("view.viewpoint", { lng: num(d?.longitude, 5), lat: num(d?.latitude, 5), zoom: num(d?.zoom, 2), direction: num(d?.direction, 1) });
      stViewpoint.textContent = text;
      logEvent("changeViewpoint", text);
    });
    // 状態とイベント履歴
    app.addEventListener("updateState", (evt) => {
      const text = brief(detailOf(evt));
      stUpdate.textContent = text;
      logEvent("updateState", text);
    });
    app.addEventListener("poi_number", (evt) => {
      refreshPoiLayers();
      logEvent("poi_number", t("log.count", { count: String(detailOf(evt)) }));
    });
    app.addEventListener("clickMap", (evt) => {
      const d = detailOf(evt) as { longitude?: number; latitude?: number } | undefined;
      const text = t("view.click", { lng: num(d?.longitude, 6), lat: num(d?.latitude, 6) });
      stClick.textContent = text;
      logEvent("clickMap", text);
    });
    app.addEventListener("clickMarkers", (evt) => {
      const list = (detailOf(evt) as { name?: string | { ja?: string; en?: string } }[] | undefined) ?? [];
      hitsLine.textContent = t("poi.hits", { count: list.length, names: list.map((d) => i18n(d.name)).join(t("list.sep")) });
      logEvent("clickMarkers", t("log.count", { count: list.length }));
    });
    app.addEventListener("gps_result", (evt) => {
      const text = brief(detailOf(evt));
      stGps.textContent = text;
      logEvent("gps_result", text);
    });
    app.addEventListener("gps_error", (evt) => { showError("gps_error", detailOf(evt)); });
    app.addEventListener("outOfMap", () => { logEvent("outOfMap"); });
    app.addEventListener("lifecycle:error", (evt) => {
      const d = detailOf(evt) as { phaseId?: string; error?: unknown } | undefined;
      showError(`lifecycle:error（${d?.phaseId ?? "?"}）`, d?.error);
    });

    // 選択した POI の説明（name・desc・写真クレジット）を表示
    app.addEventListener("clickMarker", (evt) => {
      const data = (evt as unknown as { detail?: Record<string, unknown> }).detail;
      if (!data) return;
      const parts: string[] = [i18n(data.name as string | { ja?: string; en?: string })];
      if (typeof data.desc === "string") parts.push(data.desc);
      if (data.image && typeof data.imageCredit === "string") parts.push(t("poi.photo_credit", { credit: data.imageCredit }));
      markerInfo.textContent = parts.join(" — ");
      markerInfo.style.display = "";
      // poiTemplate から作られた detail.html は sanitizeHtml を通したものだけを出す
      if (typeof data.html === "string") detailBox.innerHTML = sanitizeHtml(data.html);
      else detailBox.textContent = "";
      logEvent("clickMarker", parts[0] ?? "");
      // クリックした POI を選ぶ（Core が selected のアイコンで描き直す）
      if (typeof data.namespaceID === "string") {
        selectedId = data.namespaceID;
        app.selectMarker(selectedId);
        refreshSelectCheck();
      }
    });

    // ---- IIIF の画像（画像の配信の対比。地域の操作パネルの新しい節）----
    buildIiifImageSection({
      app,
      makeSection,
      mountSection,
      showError,
      logEvent,
      activeMapId,
      iiifUsable: iiifMapIDs.find((id) => !unusableIds.has(id)),
      iiifBroken: iiifMapIDs.find((id) => unusableIds.has(id)),
      localMapID: sourceIds.find((id) => id !== "gsi" && id !== "osm" && !iiifMapIDs.includes(id))
    });

    // ---- IIIF の書誌（写した書誌の表示と、解決器・比較の関数の入出力）----
    // 使えない地図（起動のときに使えなかったもの）は切り替えのボタンに出さない
    const bibliographyUsable = bibliographyMaps.filter((map) => !unusableIds.has(map.mapID));
    if (bibliographyUsable.length > 0) {
      buildIiifBibliographySection({
        app,
        makeSection,
        mountSection,
        showError,
        activeMapId,
        maps: bibliographyUsable
      });
    }

    // 初期状態を反映
    refreshMapState();
  };

  // ---- 破棄と再生成 ----
  // 再生成は「app.remove() → 同じ setting で createObject → 各節を作り直す」。古い app への参照を残さない
  let current: MaplatApp | undefined;
  let cacheDisabledReason: string | undefined;
  const sourceIds = setting.sources.map((s) => (typeof s === "string" ? s : (s as { mapID: string }).mapID));
  const wantRestore = (): boolean => new URLSearchParams(location.search).get("restoreSession") === "1";
  // 再読み込みでも同じ作り方になるよう、URL の ?restoreSession=1 を合わせる（地域の切替でも残る）
  const setRestoreParam = (on: boolean): void => {
    const url = new URL(location.href);
    if (on) url.searchParams.set("restoreSession", "1");
    else url.searchParams.delete("restoreSession");
    history.replaceState(null, "", url.toString());
  };
  // restoreSession は localStorage の地域に依らないキー（mapID 等）に保存される。
  // 別の地域で保存した状態はこの地域の地図に無いので、保存時刻（epoch）を消して使わない
  const dropForeignSession = (): void => {
    try {
      const saved = localStorage.getItem("mapID");
      if (saved && !sourceIds.includes(saved)) {
        localStorage.removeItem("epoch");
        logEvent("restoreSession", t("log.restore_foreign", { saved }));
      }
    } catch {
      // localStorage が使えない環境では何もしない（Core も保存・復元をしない）
    }
  };
  const destroy = (): void => {
    if (!current) return;
    current.remove();
    current = undefined;
    (window as any).__MAPLAT_DEMO_APP__ = undefined;
    appArea.replaceChildren();
    markerInfo.style.display = "none";
    vectorAttr.style.display = "none";
    attr.textContent = "";
    status.textContent = t("app.destroyed");
  };
  const create = async (restoreSession: boolean, restore?: Record<string, unknown>): Promise<void> => {
    if (restoreSession) dropForeignSession();
    // setting を明示渡し。同時に存在する app は 1 つだけ。poiTemplate は clickMarker の detail.html の元
    // Service Worker を先に登録してから enableCache で作る。使えなければキャッシュ無しで起動する
    cacheDisabledReason = await ensureServiceWorker(status);
    const app = await MaplatApp.createObject({
      appid: region,
      // 変換の形に合わせて、地図の JSON の置き場所（settingFile）を替えた app 設定
      setting: settingForForm(setting, form, estimates),
      poiTemplate: POI_TEMPLATE,
      restoreSession,
      // 変換の形を切り替えたときだけ、直前の地図・位置・縮尺を渡す
      ...(restore ? { restore } : {}),
      ...(cacheDisabledReason === undefined ? { enableCache: true } : {})
    });
    current = app;
    // 検査用の口（e2e が Feature の style を読む。デモはパッケージに入らない）
    (window as any).__MAPLAT_DEMO_APP__ = app;
    buildApp(app);
    logEvent("createObject", restoreSession ? t("log.create_restore") : "");
  };

  const lifeSec = makeSection(t("section.life"));
  const lifeRow = lifeSec.row();
  const lifeButtons: HTMLButtonElement[] = [];
  let busy = false;
  const lifeButton = (label: string, fn: () => Promise<void> | void): void => {
    const btn = makeButton(label, () => {
      if (busy) return;
      busy = true;
      for (const b of lifeButtons) b.disabled = true;
      logEvent(label);
      void (async () => {
        try {
          await fn();
        } catch (e) {
          showError(label, e);
        } finally {
          busy = false;
          for (const b of lifeButtons) b.disabled = false;
        }
      })();
    });
    lifeButtons.push(btn);
    lifeRow.appendChild(btn);
  };
  lifeButton("remove()", () => { destroy(); });
  lifeButton(t("life.recreate"), async () => {
    destroy();
    setRestoreParam(false);
    await create(false);
  });
  lifeButton(t("life.recreate_restore"), async () => {
    destroy();
    setRestoreParam(true);
    await create(true);
  });
  lifeButton(t("life.unknown_map"), async () => {
    const app = current;
    if (!app) {
      stUnknown.textContent = t("life.no_app");
      return;
    }
    const mapIdOf = (): string | undefined => (app.currentMapInfo() as { mapID?: string } | undefined)?.mapID;
    const before = mapIdOf();
    let outcome: string;
    try {
      await app.changeMap("__unknown__");
      outcome = t("life.no_exception");
    } catch (e) {
      outcome = t("life.exception", { message: errText(e) });
    }
    const after = mapIdOf();
    stUnknown.textContent = t("life.unknown_result", {
      outcome,
      map: after === before ? t("life.map_same", { map: String(after) }) : t("life.map_changed", { before: String(before), after: String(after) })
    });
  });
  const lifeNote = document.createElement("p");
  lifeNote.className = "demo-note";
  lifeNote.textContent = t("life.note");
  lifeSec.sec.appendChild(lifeNote);
  mountSection(lifeSec, fixedArea);
  // ---- sanitizeHtml の入出力（テンプレートの出力の <qy-swiper>・<qy-swiper-slide>）----
  // Core のデモは qy-* を登録しないので、スライダーの見た目ではなく、残る属性と消える属性を文字列で見せる
  const sanitizeSec = makeSection(t("section.sanitize"));
  const sanitizeInput = document.createElement("textarea");
  sanitizeInput.id = "sanitize-input";
  sanitizeInput.rows = 6;
  sanitizeInput.style.width = "100%";
  const sanitizeOutput = document.createElement("pre");
  sanitizeOutput.id = "sanitize-output";
  sanitizeOutput.style.whiteSpace = "pre-wrap";
  sanitizeOutput.style.wordBreak = "break-all";
  const runSanitize = (): void => {
    // 出力は HTML の文字列そのまま（textContent）で見せる。描画はしない
    sanitizeOutput.textContent = sanitizeHtml(sanitizeInput.value).replace(/></g, ">\n<");
  };
  const sanitizeRow = sanitizeSec.row();
  for (const preset of SANITIZE_PRESETS) {
    const btn = makeButton(t(preset.labelKey), () => {
      sanitizeInput.value = preset.html;
      runSanitize();
    });
    btn.dataset.sanitizePreset = preset.id;
    sanitizeRow.appendChild(btn);
  }
  sanitizeRow.appendChild(makeButton(t("sanitize.run"), runSanitize));
  const sanitizeNote = document.createElement("p");
  sanitizeNote.className = "demo-note";
  sanitizeNote.textContent = t("sanitize.note");
  sanitizeSec.sec.append(sanitizeInput, sanitizeNote, sanitizeOutput);
  sanitizeInput.value = SANITIZE_PRESETS[0].html;
  runSanitize();
  mountSection(sanitizeSec, fixedArea);
  // 状態とイベント履歴は操作を持たないが、常に出す（操作パネルの最下部）
  fixedArea.append(stateSec.sec, logSec.sec);

  // ---- 変換の形（三角網＋扇形外挿 ⇄ 従来型（V2））。app を作り直しても残す節 ----
  // 切り替えは「app.remove() → 地図 JSON の置き場所（settingFile）を替えた設定で createObject」。
  // 直前の地図・位置・縮尺（app.stateBuffer）は restore で渡して保つ。URL の ?form= も合わせる（再読み込みでも同じ形）
  if (estimates) {
    const formSec = makeSection(t("old.form_h"));
    formSec.sec.id = "demo-form";
    const formName = (f: MapForm): string => (f === "c" ? t("type.c") : t("old.form_legacy"));
    const setupName = (letter: string): string => t(`type.${letter.toLowerCase()}`);
    const formLead = document.createElement("p");
    formLead.className = "demo-note";
    formLead.textContent = t("old.form_lead");
    formSec.sec.appendChild(formLead);
    const formRow = formSec.row();
    formRow.setAttribute("role", "group");
    formRow.setAttribute("aria-label", t("old.form_aria"));
    const formButtons = new Map<MapForm, HTMLButtonElement>();
    const formVal = (label: string, id: string): HTMLElement => {
      const r = formSec.row();
      r.classList.add("demo-state-row");
      const k = document.createElement("span");
      k.className = "demo-state-key";
      k.textContent = label;
      const v = document.createElement("span");
      v.className = "demo-state-val";
      v.id = id;
      v.textContent = "—";
      r.append(k, v);
      return v;
    };
    const fvForm = formVal(t("old.form_row_form"), "form-name");
    const fvCrs = formVal(t("old.form_row_crs"), "form-crs");
    const fvStrict = formVal(t("old.form_row_strict"), "form-strict");
    const fvSup = formVal(t("old.form_row_sup"), "form-supplement");
    const fvRec = formVal(t("old.form_row_rec"), "form-recommended");
    const fvScore = formVal(t("old.form_row_score"), "form-score");
    const formNote = document.createElement("p");
    formNote.className = "demo-note";
    formNote.id = "form-note";
    formSec.sec.appendChild(formNote);

    refreshFormInfo = (): void => {
      for (const [f, btn] of formButtons) btn.setAttribute("aria-pressed", String(f === form));
      const mapID = (current?.currentMapInfo() as { mapID?: string } | undefined)?.mapID;
      const info = formInfo(form, mapID, estimates, mapID ? v2Statuses[mapID] : undefined);
      fvForm.textContent = formName(form);
      if (!info) {
        for (const v of [fvCrs, fvStrict, fvSup, fvRec, fvScore]) v.textContent = "—";
        formNote.textContent = mapID ? t("old.form_na") : "";
        return;
      }
      fvCrs.textContent = form === "v2" ? t("old.form_crs_fixed", { crs: info.crs }) : info.crs;
      const st = info.strict;
      fvStrict.textContent = !st
        ? "—"
        : st.allStrict
          ? t("old.form_strict_yes")
          : st.main === "strict"
            ? t("old.form_strict_inset", { n: st.insetNotStrict })
            : t("old.form_strict_no", { status: st.main });
      fvSup.textContent = info.supplementCount === null
        ? t("old.form_sup_none")
        : t(info.multiLayer ? "old.form_sup_total" : "old.form_sup_count", { n: info.supplementCount });
      const setups = info.recommended.map(setupName).join(t("old.form_setup_join")) || t("old.form_none");
      fvRec.textContent = setups + (info.recommendReason === "borderline" ? t("old.form_rec_borderline") : info.recommendReason === "birdeye" ? t("old.form_rec_birdeye") : "");
      fvScore.textContent = info.score === null ? "—" : info.score.toFixed(4);
      formNote.textContent = form === "v2" ? t("old.form_note_v2") : info.recommendsNotC ? t("old.form_not_c", { setups }) : "";
    };

    const switchForm = async (next: MapForm): Promise<void> => {
      const app = current;
      if (next === form || busy || !app) return;
      busy = true;
      for (const b of [...lifeButtons, ...formButtons.values()]) b.disabled = true;
      try {
        const mapID = (app.currentMapInfo() as { mapID?: string } | undefined)?.mapID;
        // 直前の状態（地図・位置・縮尺・回転・透過度など）。まだ何も動かしていなければ、地図の既定の位置から始める
        const restore: Record<string, unknown> = { ...app.stateBuffer, ...(mapID ? { mapID } : {}) };
        destroy();
        form = next;
        const url = new URL(location.href);
        url.searchParams.set("form", next);
        history.replaceState(null, "", url.toString());
        await create(false, restore);
        logEvent("form", t("old.form_switched", { form: formName(next) }));
      } catch (e) {
        showError(t("old.form_h"), e);
      } finally {
        busy = false;
        for (const b of [...lifeButtons, ...formButtons.values()]) b.disabled = false;
        refreshFormInfo();
      }
    };
    for (const f of MAP_FORMS) {
      const btn = makeButton(formName(f), () => { void switchForm(f); });
      btn.dataset.form = f;
      formButtons.set(f, btn);
      formRow.appendChild(btn);
    }
    controls.insertBefore(formSec.sec, appArea);
    refreshFormInfo();
  }

  await create(wantRestore());
}

// 初期化（fetch / createObject など）に失敗したら画面に出す。
// 無言で「読み込み中…」のまま止めない。
main().catch((e: unknown) => {
  const status = byId("status");
  status.textContent = t("error.load_failed", { message: e instanceof Error ? e.message : String(e) });
});

// ---- 画像の配信の節（デモだけの処理。製品の挙動は変えない）----

/** 操作パネルの節（main の中の makeSection が返すものと同じ形） */
type DemoSection = { sec: HTMLElement; row: () => HTMLDivElement };

/** 節の中に説明の 1 行（見えるもの・対比で分かること）を足す */
function addIiifNote(row: HTMLElement, text: string): void {
  const p = document.createElement("p");
  p.className = "demo-note";
  p.textContent = text;
  row.appendChild(p);
}

/**
 * 「IIIF の画像」の節を作る。
 *
 * 3 つの入力を 1 クリックで切り替えて、画像の配信の道の違いを見せる:
 *   (a) 国立国会図書館の IIIF から配信（キャッシュ対象外）
 *   (b) 壊れた delivery（使えない地図になるが、起動は止まらない）
 *   (c) 既存の地域の古地図（手元のタイル。t.tilemap.jp/…/{z}/{x}/{y}.jpg）
 * 要求の一覧は PerformanceObserver の resource を読む（デモだけの処理。製品は変えない）。
 */
function buildIiifImageSection(ctx: {
  app: MaplatApp;
  makeSection: (title: string) => DemoSection;
  mountSection: (section: DemoSection) => void;
  showError: (where: string, e: unknown) => void;
  logEvent: (type: string, text?: string) => void;
  activeMapId: () => string | undefined;
  iiifUsable?: string;
  iiifBroken?: string;
  localMapID?: string;
}): void {
  const { app, makeSection, mountSection, showError, logEvent, activeMapId } = ctx;
  const sec = makeSection(t("section.iiif_image"));

  // (a) IIIF から配信
  if (ctx.iiifUsable) {
    const mapID = ctx.iiifUsable;
    const row = sec.row();
    row.appendChild(
      makeButton(t("iiif.btn_deliver"), () => {
        app.clearLine();
        void app.changeMap(mapID).catch((e: unknown) => {
          showError(t("iiif.btn_deliver"), e);
        });
      })
    );
    addIiifNote(row, t("iiif.see_deliver"));
    addIiifNote(row, t("iiif.contrast_deliver"));
  }

  // (b) 壊れた delivery
  if (ctx.iiifBroken) {
    const mapID = ctx.iiifBroken;
    const row = sec.row();
    row.appendChild(
      makeButton(t("iiif.btn_broken"), () => {
        void app.changeMap(mapID).then(
          () => {
            logEvent("changeMap", t("iiif.log_unusable", { mapID }));
          },
          (e: unknown) => {
            showError(t("iiif.btn_broken"), e);
          }
        );
      })
    );
    addIiifNote(row, t("iiif.see_broken"));
    addIiifNote(row, t("iiif.contrast_broken"));
  }

  // (c) 既存の地域の古地図（手元のタイル）
  {
    const row = sec.row();
    if (ctx.localMapID) {
      const mapID = ctx.localMapID;
      row.appendChild(
        makeButton(t("iiif.btn_local"), () => {
          app.clearLine();
          void app.changeMap(mapID).catch((e: unknown) => {
            showError(t("iiif.where_local"), e);
          });
        })
      );
    } else {
      row.appendChild(
        makeButton(t("iiif.btn_tatebayashi"), () => {
          const url = new URL(location.href);
          url.searchParams.set("region", "tatebayashi");
          location.assign(url.toString());
        })
      );
    }
    addIiifNote(row, t("iiif.see_local"));
    addIiifNote(row, t("iiif.contrast_local"));
    addIiifNote(row, t("iiif.local_unavailable"));
  }

  // 直近のタイルの要求（PerformanceObserver の resource。textContent で入れる）
  const requestTitle = document.createElement("p");
  requestTitle.className = "demo-note";
  requestTitle.textContent = t("iiif.requests_title");
  const requestList = document.createElement("pre");
  requestList.id = "iiif-tile-requests";
  requestList.className = "demo-note";
  requestList.style.cssText = "white-space:pre-wrap;word-break:break-all;margin:4px 0 0;";
  requestList.textContent = tileRequests.length > 0 ? tileRequests.join("\n") : t("iiif.none_yet");
  tileRequestSink = (list) => {
    requestList.textContent = list.length > 0 ? list.join("\n") : t("iiif.none_yet");
  };
  startTileRequestObserver();
  sec.sec.append(requestTitle, requestList);

  // キャッシュの対象か（Core の公開のメソッドだけで見る）
  const cacheRow = sec.row();
  const cacheLabel = document.createElement("span");
  cacheLabel.textContent = `${t("iiif.cache_label")} `;
  const cacheValue = document.createElement("span");
  cacheValue.id = "iiif-cache";
  const refreshCache = (): void => {
    const mapID = activeMapId();
    cacheValue.textContent = mapID && app.getMapCacheEnable(mapID) ? t("iiif.cacheable") : t("iiif.not_cacheable");
  };
  refreshCache();
  app.addEventListener("mapChanged", refreshCache);
  cacheRow.append(cacheLabel, cacheValue);

  // 使えない地図の記録（Core の console.error を写す）
  const errorTitle = document.createElement("p");
  errorTitle.className = "demo-note";
  errorTitle.textContent = t("iiif.errors_title");
  const errorList = document.createElement("pre");
  errorList.id = "iiif-unusable-errors";
  errorList.className = "demo-note";
  errorList.style.cssText = "white-space:pre-wrap;word-break:break-all;margin:4px 0 0;";
  errorList.textContent = unusableMessages.length > 0 ? unusableMessages.join("\n") : t("iiif.none");
  sec.sec.append(errorTitle, errorList);

  mountSection(sec);
}

// ---- IIIF の書誌の節（デモだけの処理。製品の挙動は変えない）----

/** 表の 1 行（項目名は文字、値は sanitizeIiifHtml に通した HTML か文字のどちらか） */
type IiifTableRow = { from?: string; label: string; html?: string; text?: string };

/**
 * 表を作る。項目名は必ず textContent、値は sanitizeIiifHtml に通した HTML だけを innerHTML に入れる。
 * from を持つ行があれば、先頭に「写した元」の列を出す。
 */
function iiifRowTable(rows: IiifTableRow[]): HTMLTableElement {
  const table = document.createElement("table");
  table.className = "demo-iiif-table";
  const hasFrom = rows.some((row) => row.from !== undefined);
  const head = document.createElement("tr");
  for (const text of hasFrom ? ["from", t("bib.col_name"), t("bib.col_value")] : [t("bib.col_name"), t("bib.col_value")]) {
    const th = document.createElement("th");
    th.textContent = text;
    head.appendChild(th);
  }
  const thead = document.createElement("thead");
  thead.appendChild(head);
  table.appendChild(thead);
  const tbody = document.createElement("tbody");
  for (const row of rows) {
    const tr = document.createElement("tr");
    if (hasFrom) {
      const from = document.createElement("td");
      from.textContent = row.from ?? "";
      tr.appendChild(from);
    }
    const label = document.createElement("td");
    label.textContent = row.label;
    const value = document.createElement("td");
    if (row.html !== undefined) value.innerHTML = sanitizeIiifHtml(row.html);
    else value.textContent = row.text ?? "";
    tr.append(label, value);
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  return table;
}

/** 写した metadata の全件を、写した元つきの表にする */
function iiifMetadataRows(entries: IiifMetadataEntry[]): IiifTableRow[] {
  return entries.map((entry) => ({
    from: entry.from,
    label: localizedText(entry.label),
    html: localizedText(entry.value)
  }));
}

/**
 * 「IIIF の書誌」の節を作る。
 *
 * 3 つの見せ方:
 *   (a) 表示中の地図の書誌（写した値・表示の印・アプリの設定に応じた metadata の表）。
 *       表を出さない設定の地図に切り替えると表が出ない（(a')）
 *   (b) 資料の Manifest を解決器に通した結果（写す鍵・写した値・metadata の全件）と、
 *       「人が直した」「IIIF の側が変わった」の判定
 *   (c) 悪い値を含む Manifest をサニタイズに通した表
 */
function buildIiifBibliographySection(ctx: {
  app: MaplatApp;
  makeSection: (title: string) => DemoSection;
  mountSection: (section: DemoSection) => void;
  showError: (where: string, e: unknown) => void;
  activeMapId: () => string | undefined;
  maps: Array<{ mapID: string; label: string }>;
}): void {
  const { app, makeSection, mountSection, showError, activeMapId, maps } = ctx;
  const sec = makeSection(t("section.iiif_bib"));

  // (a) (a') 書誌を持つ地図へ切り替える
  const mapRow = sec.row();
  for (const map of maps) {
    const btn = makeButton(map.label, () => {
      app.clearLine();
      void app.changeMap(map.mapID).catch((e: unknown) => {
        showError(t("section.iiif_bib"), e);
      });
    });
    btn.dataset.iiifMap = map.mapID;
    mapRow.appendChild(btn);
  }
  addIiifNote(mapRow, t("bib.see_meta"));
  addIiifNote(mapRow, t("bib.contrast_meta"));
  addIiifNote(mapRow, t("bib.see_hidden"));
  addIiifNote(mapRow, t("bib.contrast_hidden"));

  const summaryBox = document.createElement("div");
  summaryBox.id = "iiif-meta-summary";
  summaryBox.className = "demo-note";
  const displayLine = document.createElement("p");
  displayLine.id = "iiif-meta-display";
  const tableBox = document.createElement("div");
  tableBox.id = "iiif-meta-table";
  tableBox.className = "demo-note";
  sec.sec.append(summaryBox, displayLine, tableBox);

  const appendLine = (label: string, value: string): void => {
    const p = document.createElement("p");
    const key = document.createElement("span");
    key.textContent = `${label}: `;
    const text = document.createElement("span");
    text.textContent = value;
    p.append(key, text);
    summaryBox.appendChild(p);
  };

  const refreshBibliography = (): void => {
    const meta = app.getMapMeta(activeMapId()) as Record<string, unknown> | undefined;
    const iiif = meta?.iiif as
      | { display?: string; copiedAt?: string; metadata?: IiifMetadataEntry[] }
      | undefined;
    summaryBox.replaceChildren();
    displayLine.textContent = "";
    tableBox.replaceChildren();
    if (!meta || !iiif) {
      appendLine(t("bib.label"), t("bib.none"));
      return;
    }
    appendLine("title", localizedText(meta.title));
    appendLine("attr", localizedText(meta.attr));
    appendLine("license", typeof meta.license === "string" ? meta.license : "");
    appendLine("licenseNote", localizedText(meta.licenseNote));
    appendLine("copiedAt", typeof iiif.copiedAt === "string" ? iiif.copiedAt : t("iiif.none"));
    const stamp = document.createElement("p");
    stamp.id = "iiif-meta-stamp";
    stamp.textContent = t("bib.stamp");
    summaryBox.appendChild(stamp);
    displayLine.textContent = `display: ${iiif.display === "all" ? "all" : "hidden"}`;
    if (iiif.display !== "all") {
      const note = document.createElement("p");
      note.id = "iiif-meta-hidden";
      note.textContent = t("bib.hidden");
      tableBox.replaceChildren(note);
      return;
    }
    const entries = Array.isArray(iiif.metadata) ? iiif.metadata : [];
    tableBox.replaceChildren(iiifRowTable(iiifMetadataRows(entries)));
  };
  app.addEventListener("mapChanged", refreshBibliography);
  refreshBibliography();

  // (b) 関数を試す: 資料の Manifest と canvas を選び、写す鍵と写した値を並べる
  const tryRow = sec.row();
  const manifestField = document.createElement("label");
  manifestField.className = "demo-field";
  manifestField.appendChild(document.createTextNode(t("bib.manifest_field")));
  const manifestSelect = document.createElement("select");
  manifestSelect.id = "iiif-try-manifest";
  for (const source of IIIF_TRY_SOURCES) {
    const opt = document.createElement("option");
    opt.value = source.id;
    opt.textContent = t(source.labelKey);
    manifestSelect.appendChild(opt);
  }
  manifestField.appendChild(manifestSelect);
  const canvasField = document.createElement("label");
  canvasField.className = "demo-field";
  canvasField.appendChild(document.createTextNode("canvas"));
  const canvasSelect = document.createElement("select");
  canvasSelect.id = "iiif-try-canvas";
  canvasField.appendChild(canvasSelect);
  tryRow.append(manifestField, canvasField);
  addIiifNote(tryRow, t("bib.see_try"));
  addIiifNote(tryRow, t("bib.contrast_try"));

  const preStyle = "white-space:pre-wrap;word-break:break-all;margin:4px 0 0;max-height:240px;overflow:auto;";
  const tryInput = document.createElement("pre");
  tryInput.id = "iiif-try-input";
  tryInput.className = "demo-note";
  tryInput.style.cssText = preStyle;
  const tryOutput = document.createElement("pre");
  tryOutput.id = "iiif-try-output";
  tryOutput.className = "demo-note";
  tryOutput.style.cssText = preStyle;
  const tryTableBox = document.createElement("div");
  tryTableBox.id = "iiif-try-table";
  tryTableBox.className = "demo-note";
  sec.sec.append(tryInput, tryOutput, tryTableBox);

  // 判定の表の状態（押すたびに「人が直した」「IIIF の側が変わった」を切り替える）
  let lastResolved: ReturnType<typeof resolveIiifMetadata> | undefined;
  let humanEdited = false;
  let iiifChanged = false;

  const compareRow = sec.row();
  const humanBtn = makeButton(t("bib.btn_human"), () => {
    humanEdited = !humanEdited;
    syncCompareButtons();
    renderCompare();
  });
  humanBtn.dataset.iiifEdit = "human";
  const iiifBtn = makeButton(t("bib.btn_iiif"), () => {
    iiifChanged = !iiifChanged;
    syncCompareButtons();
    renderCompare();
  });
  iiifBtn.dataset.iiifEdit = "iiif";
  compareRow.append(humanBtn, iiifBtn);
  addIiifNote(compareRow, t("bib.see_compare"));
  addIiifNote(compareRow, t("bib.contrast_compare"));
  const compareBox = document.createElement("div");
  compareBox.id = "iiif-try-compare";
  compareBox.className = "demo-note";
  sec.sec.appendChild(compareBox);

  const syncCompareButtons = (): void => {
    humanBtn.setAttribute("aria-pressed", String(humanEdited));
    iiifBtn.setAttribute("aria-pressed", String(iiifChanged));
  };

  // 1 か所だけ値を変えた写しを作る（今の値と取り直した値の違いを、デモの中で作る）
  const editTitle = (target: Record<string, unknown>, suffix: string): void => {
    const value = target.title;
    if (typeof value === "string") {
      target.title = `${value}${suffix}`;
      return;
    }
    if (value && typeof value === "object") {
      const table = value as Record<string, string>;
      const key = pageLang() in table ? pageLang() : Object.keys(table)[0];
      if (key !== undefined) table[key] = `${table[key]}${suffix}`;
    }
  };

  const renderCompare = (): void => {
    if (!lastResolved || !lastResolved.ok) {
      compareBox.textContent = t("bib.compare_empty");
      return;
    }
    const copied = lastResolved.copiedValues;
    const current = structuredClone(lastResolved.values) as Record<string, unknown>;
    const fresh = structuredClone(copied) as Record<string, Record<string, string>>;
    if (humanEdited) editTitle(current, t("bib.suffix_human"));
    if (iiifChanged) editTitle(fresh, t("bib.suffix_iiif"));
    const rows = compareIiifCopy(current as Parameters<typeof compareIiifCopy>[0], copied, fresh, pageLang());

    const table = document.createElement("table");
    table.className = "demo-iiif-table";
    table.id = "iiif-try-compare-table";
    const head = document.createElement("tr");
    for (const text of [t("bib.col_key"), t("bib.col_lang"), t("bib.col_human"), t("bib.col_iiif")]) {
      const th = document.createElement("th");
      th.textContent = text;
      head.appendChild(th);
    }
    const thead = document.createElement("thead");
    thead.appendChild(head);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    for (const row of rows) {
      const tr = document.createElement("tr");
      for (const text of [
        row.key,
        row.lang,
        String(row.humanEdited),
        row.iiifChanged === undefined ? t("bib.not_judged") : String(row.iiifChanged)
      ]) {
        const td = document.createElement("td");
        td.textContent = text;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    const note = document.createElement("p");
    note.textContent = t("bib.compare_note");
    compareBox.replaceChildren(table, note);
  };

  const fillCanvases = (source: (typeof IIIF_TRY_SOURCES)[number]): void => {
    canvasSelect.replaceChildren();
    const listed = listIiifCanvases(source.manifest);
    if (!listed.ok) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = t("bib.canvas_unreadable", { reason: listed.reason });
      canvasSelect.appendChild(opt);
      return;
    }
    for (const canvas of listed.canvases) {
      const opt = document.createElement("option");
      opt.value = canvas.id;
      const label = localizedText(canvas.label);
      opt.textContent = label ? t("bib.canvas_option", { label, width: canvas.width, height: canvas.height }) : canvas.id;
      canvasSelect.appendChild(opt);
    }
    canvasSelect.value = listed.canvases.some((canvas) => canvas.id === source.canvas)
      ? source.canvas
      : (listed.canvases[0]?.id ?? "");
  };

  const runTry = (): void => {
    const source = IIIF_TRY_SOURCES.find((item) => item.id === manifestSelect.value) ?? IIIF_TRY_SOURCES[0];
    const canvasId = canvasSelect.value;
    const bindings = proposeIiifBindings(source.manifest, canvasId);
    const resolved = resolveIiifMetadata(source.manifest, { canvas: canvasId, bindings }, pageLang(), sanitizeIiifHtml);
    tryInput.textContent = JSON.stringify({ canvas: canvasId, bindings }, null, 2);
    tryTableBox.replaceChildren();
    lastResolved = resolved;
    if (!resolved.ok) {
      tryOutput.textContent = t("bib.resolve_failed", { reason: resolved.reason });
      renderCompare();
      return;
    }
    // 出力は表にせず JSON の文字列（textContent）で見せる
    tryOutput.textContent = JSON.stringify(
      {
        version: resolved.version,
        values: resolved.values,
        copiedValues: resolved.copiedValues,
        copiedMetadata: resolved.copiedMetadata,
        unresolved: resolved.unresolved,
        warnings: resolved.warnings
      },
      null,
      2
    );
    tryTableBox.replaceChildren(iiifRowTable(iiifMetadataRows(resolved.copiedMetadata)));
    renderCompare();
  };

  manifestSelect.addEventListener("change", () => {
    const source = IIIF_TRY_SOURCES.find((item) => item.id === manifestSelect.value) ?? IIIF_TRY_SOURCES[0];
    fillCanvases(source);
    runTry();
  });
  canvasSelect.addEventListener("change", runTry);

  // (c) 悪い値の Manifest をサニタイズに通した表
  const badRow = sec.row();
  addIiifNote(badRow, t("bib.see_bad"));
  addIiifNote(badRow, t("bib.contrast_bad"));
  const badOutput = document.createElement("div");
  badOutput.id = "iiif-bad-output";
  badOutput.className = "demo-note";
  sec.sec.appendChild(badOutput);

  const bad = resolveIiifMetadata(IIIF_BAD_MANIFEST, { canvas: "", bindings: IIIF_BAD_BINDINGS }, pageLang(), sanitizeIiifHtml);
  if (!bad.ok) {
    badOutput.textContent = t("bib.bad_failed", { reason: bad.reason });
  } else {
    const valueRows: IiifTableRow[] = Object.entries(bad.values).map(([key, value]) =>
      IIIF_HTML_KEYS.has(key)
        ? { label: key, html: localizedText(value) }
        : { label: key, text: localizedText(value) }
    );
    badOutput.replaceChildren(iiifRowTable([...valueRows, ...iiifMetadataRows(bad.copiedMetadata)]));
  }

  // 初期の状態（1 つ目の資料と、地図に使う canvas）
  fillCanvases(IIIF_TRY_SOURCES[0]);
  syncCompareButtons();
  runTry();

  mountSection(sec);
}
