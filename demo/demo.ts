/// <reference types="vite/client" />
// demo/demo.ts（oct26-m11-t4）: 単一デモページのロジック。
// 地域ドロップダウン（?region= 付き再読み込み）・app 設定の setting 明示渡し・
// 地域内コンテンツ切り替え UI（地図セレクタ・POI・線・面・視点・透過・GPS）・出典表示。
// Core 本体（公開ライブラリ）の公開 API だけを使う（Pro 専用 API・Core 専用 export を import しない）。
import { MaplatApp, sanitizeHtml } from "../src/index.ts"; // 開発時。build:demo でバンドル
// テンプレートの警告（ページで 1 回）の記憶を戻す。公開面ではないが、記法のプリセットを切り替えるたびに
// 警告を出し直して見せるため、デモの中だけで使う（製品の挙動は変えない）
import { resetTemplateWarnings } from "../src/template_works";
import { REGION_IDS, REGION_META } from "./regions";
import type { AppSetting, DemoOps, LineItem, LineKind, MapLineItem, MapPoi, Poi, RegionContent, RegionId, VectorItem } from "./regions";

// 素材 JSON（demo/content/<region>.json）を Vite の import.meta.glob でバンドルに取り込む。
// キーは "./content/<region>.json"（demo/ 起点の相対 glob）。ページの基点に依存しない。
const CONTENTS = import.meta.glob("./content/*.json", { import: "default" });

// 素材の型は regions.ts（t1 v6.4）が正本。v4.2 で局所型を廃止した
const EMPTY_OPS: DemoOps = { addPoi: [], movePoi: [], addVector: [] };

// 移動ピンのアイコン（HR-23/2: 既存の POI と見分ける）。ファイルを増やさないため data URI の SVG
const MOVE_ICON =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">' +
      '<path d="M14 35C14 35 2 20 2 13a12 12 0 0 1 24 0c0 7-12 22-12 22z" fill="#7c3aed" stroke="#fff" stroke-width="2"/>' +
      '<path d="M8 13h9m-3.5-4 4 4-4 4" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>"
  );
// 選んだ移動ピンのアイコン（HR-25/1）。地の色を橙に替え、縁を太くする（既定のピンの selected と同じく「選ばれた」と分かる形）
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
// nov26-m4-t8（NayutaProducts#37）: fill は OpenLayers の Fill の options（{ color }）の形で渡す（素の文字列では塗られない）
const PALETTE: Record<LineKind, { stroke: { color: string; width: number }; fill: { color: string } }> = {
  festival: { stroke: { color: "#e60033", width: 4 }, fill: { color: "rgba(230, 0, 51, 0.15)" } },
  walk: { stroke: { color: "#1a7f37", width: 4 }, fill: { color: "rgba(26, 127, 55, 0.15)" } },
  feature: { stroke: { color: "#f97316", width: 4 }, fill: { color: "rgba(249, 115, 22, 0.15)" } }
};

// nov26-m4-t8（Issue #37 の 4）: 層の既定アイコン（icon・selectedIcon）と、年代で色を変えるアイコン（iconTemplate）。
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
// poiTemplate（Issue #37 の 4）: clickMarker の detail.html の元。{{ }} は HTML エスケープし、表示の前に sanitizeHtml を通す
const POI_TEMPLATE =
  '<div class="demo-poi-html"><strong>{{ name if name is string else (name.ja or name.en or "") }}</strong>' +
  '{% if desc is string and desc %}<p>{{ desc }}</p>{% endif %}</div>';

// poiTemplate の記法のプリセット（新しい記法・旧い記法・書き誤り・| safe の有無）。
// 旧い記法（lodash.template）は 1.3 から評価されず、ページで 1 回だけ console.warn が出る
const TEMPLATE_PRESETS: { id: string; label: string; template: string }[] = [
  { id: "nunjucks", label: "(a) 新しい記法", template: POI_TEMPLATE },
  {
    id: "legacy",
    label: "(b) 旧い記法",
    template:
      '<div class="demo-poi-html"><strong><%- typeof name === "string" ? name : (name && (name.ja || name.en)) || "" %></strong>' +
      '<% if (typeof desc === "string" && desc) { %><p><%- desc %></p><% } %></div>'
  },
  { id: "broken", label: "(c) 書き誤り", template: '<div class="demo-poi-html"><strong>{{ name }</strong></div>' },
  {
    id: "safe",
    label: "(d) | safe の有無",
    template:
      '<div class="demo-poi-html"><p>{{ "{{ name }}" }}: {{ name if name is string else name.ja }}</p>' +
      '<p>{{ "{{ name | safe }}" }}: {{ (name if name is string else name.ja) | safe }}</p></div>'
  }
];
const TEMPLATE_LAYER = "template_demo";

// ベースマップ（gsi / osm）の表示名。地図の id 自体は app 設定の sources（bare string）から得る。
const BASEMAP_LABEL: Record<string, string> = {
  gsi: "地理院地図",
  osm: "OpenStreetMap"
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

/** URL の ?region= を REGION_IDS で検証する。無い・未知なら先頭 */
function currentRegion(): RegionId {
  const q = new URLSearchParams(location.search).get("region");
  const hit = REGION_IDS.find((id) => id === q);
  return hit ?? REGION_IDS[0];
}

/** ページの言語（`<html lang>`）。無い・未知なら ja */
function pageLang(): "ja" | "en" {
  const raw = (document.documentElement.lang || "ja").toLowerCase();
  return raw.startsWith("en") ? "en" : "ja";
}

/** 多言語文字列（I18nText）から表示用文字列を得る（ページ言語優先・無ければ ja） */
function i18n(value: string | { ja?: string; en?: string } | undefined): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[pageLang()] ?? value.ja ?? value.en ?? "";
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

async function main(): Promise<void> {
  const region = currentRegion();

  // 地域ドロップダウン（選択肢は REGION_META から生成。変更で ?region= を付けて再読み込み）
  const select = byId<HTMLSelectElement>("region-select");
  for (const id of REGION_IDS) {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = REGION_META[id].label;
    opt.selected = id === region;
    select.appendChild(opt);
  }
  select.addEventListener("change", () => {
    const url = new URL(location.href);
    url.searchParams.set("region", select.value);
    location.assign(url.toString());
  });

  // 地域説明（title・highlights）を #region-note に表示
  const meta = REGION_META[region];
  const note = byId("region-note");
  const noteTitle = document.createElement("strong");
  noteTitle.textContent = meta.title;
  note.appendChild(noteTitle);
  const noteList = document.createElement("ul");
  noteList.style.cssText = "margin:4px 0 0 18px;padding:0;";
  for (const h of meta.highlights) {
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
  // nov26-m4-t8: 面の出典（ODbL の表示義務）。表示中の面の source をそのまま textContent で出す
  const vectorAttr = document.createElement("p");
  vectorAttr.id = "vector-attr";
  vectorAttr.style.cssText = "margin-top:4px;display:none;";
  document.querySelector(".c4h-info-box")?.appendChild(vectorAttr);

  // app 設定を明示的に取得（root 起点のページ相対 apps/。検証済みの region だけを使う）
  const setting: AppSetting = await (await fetch(`apps/${region}.json`)).json();

  // 素材をバンドルから取得（無ければ「欠け」＝ボタンを出さないだけ）
  const loader = CONTENTS[`./content/${region}.json`];
  const content: RegionContent | undefined = loader ? ((await loader()) as RegionContent) : undefined;
  const demoOps: DemoOps = content?.demoOps ?? EMPTY_OPS;
  const appPois: Poi[] = content?.appPois ?? [];
  const mapPois: MapPoi[] = content?.mapPois ?? [];
  const appLines: LineItem[] = content?.appLines ?? [];
  const mapLines: MapLineItem[] = content?.mapLines ?? [];

  // ---- nov26-m4-t8: app ごとの節と、app を作り直しても残る節 ----
  // app ごとの節（地図・POI・線・面・視点・GPS）は appArea に置き、再生成のたびに作り直す。
  // 「破棄と再生成」「状態」「イベント履歴」は fixedArea に置き、app を作り直しても残す（操作パネルの最下部）
  const appArea = document.createElement("div");
  appArea.id = "demo-app-controls";
  controls.appendChild(appArea);
  const fixedArea = document.createElement("div");
  fixedArea.id = "demo-fixed-controls";
  controls.appendChild(fixedArea);

  // ---- 操作パネルの部品（HR-18。t4 v4.1 §4.2）----
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
  // 中に操作が 1 つも無い節は出さない（上位 §8.4 の欠けの非表示）。t8: 置き場所（app ごと／残す）を選べる。既定は app ごとの節
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
  // その地図に対象が無いチェックを無効にする（HR-20/2 の一般化。選択状態は保つ）
  const setUsable = (wrap: HTMLLabelElement, usable: boolean, reason: string): void => {
    const cb = wrap.querySelector("input");
    if (!cb) return;
    cb.disabled = !usable;
    wrap.style.opacity = usable ? "" : "0.45";
    wrap.style.cursor = usable ? "" : "not-allowed";
    if (usable) wrap.removeAttribute("title");
    else wrap.title = reason;
  };

  // ---- nov26-m4-t8: 状態（Issue #37 の 7）。app を作り直しても残す ----
  const stateSec = makeSection("状態");
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
  const stRotation = stateRow("回転・方位", "state-rotation");
  const stGps = stateRow("GPS の最後の結果", "state-gps");
  const stViewpoint = stateRow("視点", "state-viewpoint");
  const stUpdate = stateRow("updateState", "state-update");
  const stClick = stateRow("最後の clickMap", "state-click");
  const stUnknown = stateRow("未知の mapID", "state-unknown-map");
  const stError = stateRow("エラー", "state-error");

  // ---- nov26-m4-t8: イベント履歴（Issue #37 の 7）。新しい順・最大 50 件。changeViewpoint と updateState は直前と同種なら上書き ----
  const LOG_MAX = 50;
  const COALESCE = new Set(["changeViewpoint", "updateState"]);
  const logSec = makeSection("イベント履歴");
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
        const t = document.createElement("span");
        t.className = "demo-log-time";
        t.textContent = e.time;
        const n = document.createElement("strong");
        n.textContent = e.type;
        li.append(t, " ", n);
        if (e.text) li.append(` ${e.text}`);
        return li;
      })
    );
  };
  const logEvent = (type: string, text = ""): void => {
    const time = new Date().toLocaleTimeString("ja-JP", { hour12: false });
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
    // 直接プロパティになく、出典欄が空になる（レビュー Major-2）。公開 API の getMapMeta(mapID)
    // は source.get(key) で読むのでこちらを使う。attr は {ja, en} 形があり得るため i18n() を通す。
    // 手順 4: refreshAttr の dataLicense 行を置き換える（IR2 Minor-N1。§4.4）
    const attrDataParts = (m: { dataAttr?: string | { ja?: string; en?: string }; dataLicense?: string } | undefined): string[] => {
      const dataAttr = m ? i18n(m.dataAttr) : "";
      if (dataAttr && m?.dataLicense) return [`地理参照データ: ${dataAttr}（${m.dataLicense}）`];
      if (m?.dataLicense) return [`地理参照データ: ${m.dataLicense}`];
      if (dataAttr) return [`地理参照データ: ${dataAttr}`];
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
      if (m?.license) parts.push(`ライセンス: ${m.license}`);
      // 上位設計 §10.2-3: dataAttr・dataLicense（CC BY-SA など）の地図は「地理参照データ」を併記する
      parts.push(...attrDataParts(m));
      attr.textContent = parts.join(" ／ ");
    };

    // ---- 視点表示（回転・方位。zoom は Core 公開面に取得 API が無いため出さない）----
    const refreshViewpoint = async (): Promise<void> => {
      const rotation = app.getRotation();
      const direction = await app.getDirection();
      status.textContent = `回転 ${rotation.toFixed(1)}° / 方位 ${direction.toFixed(1)}°`;
      stRotation.textContent = status.textContent;
    };

    // ---- POI レイヤ（v4.2・HR-22）----
    // アプリ用 POI はアプリ全体の層 "app"（全地図に出る）。追加 POI もここに入れる。
    // 地図用 POI は地図ソースごとの層 "<mapID>#map"（Core は現在の地図のソースの層だけを描く＝その地図にだけ出る）。
    // 移動ピンはアプリ全体の層 "move"（全地図に出る。独自アイコン）。
    const APP_LAYER = "app";
    const MAP_LAYER = "map";
    const MOVE_LAYER = "move";
    const mapLayerId = (mapID: string): string => `${mapID}#${MAP_LAYER}`;
    // v4.3（IR3 Major-1）: 出る地図が限られる追加 POI・移動ピンは、地図用 POI と同じく地図ソースごとの層に載せる
    // （Core は現在の地図のソースの層だけを描く＝その地図にだけ出る。ベースマップ gsi/osm の層も同じ。t4 §4.3 C8）
    const ADD_LAYER = "add";
    const addLayerId = (mapID: string): string => `${mapID}#${ADD_LAYER}`;
    const moveLayerId = (mapID: string): string => `${mapID}#${MOVE_LAYER}`;
    const ensureLayer = (id: string, name: string): void => {
      if (!app.getPoiLayer(id)) app.addPoiLayer(id, { name });
    };
    if (appPois.length > 0 || demoOps.addPoi.length > 0) app.addPoiLayer(APP_LAYER, { name: "アプリ用 POI" });
    // Core の normalizePoi は渡した POI をその場で書き換えるので、素材は写しで渡す（IR1 Major-1 と同じ理由）
    for (const poi of appPois) app.addMarker(structuredClone(poi), APP_LAYER);
    // 地図用 POI は maps の地図ごとに 1 件ずつ写しを載せる。地図ごとの件数はトグルの無効化に使う
    const mapPoiCount = new Map<string, number>();
    for (const poi of mapPois) {
      const { maps, ...data } = poi;
      for (const mapID of maps) {
        if (!app.getPoiLayer(mapLayerId(mapID))) app.addPoiLayer(mapLayerId(mapID), { name: "地図用 POI" });
        app.addMarker(structuredClone(data), mapLayerId(mapID));
        mapPoiCount.set(mapID, (mapPoiCount.get(mapID) ?? 0) + 1);
      }
    }

    // ---- 線・面（v4.2・HR-20/21）----
    // アプリの線は全地図に、地図の線は maps の地図にだけ描く。どちらも既定で表示（チェック済み）。
    // 地図を切り替えると Core は全部の線を描き直す（地図の区別をしない）ので、切替前に clearLine し、
    // mapChanged で「表示中かつこの地図に出す線」だけを描く（IR1 Major-3 の是正を維持）。
    const activeLines: LineItem[] = [...appLines, ...mapLines];
    // nov26-m4-t8: 面は既定で表示（チェック済み）。面の出典（ODbL の表示義務）を出典の領域に textContent で出す
    const activeVectors: VectorItem[] = [...demoOps.addVector];
    const refreshVectorAttr = (): void => {
      vectorAttr.textContent = activeVectors.map((vec) => `面の出典: ${vec.source}`).join(" ／ ");
      vectorAttr.style.display = activeVectors.length > 0 ? "" : "none";
    };
    const lineApplies = (line: LineItem | MapLineItem, mapID: string | undefined): boolean => {
      if (!("maps" in line)) return true; // アプリの線
      return mapID !== undefined && line.maps.includes(mapID);
    };
    // v4.4（HR-25/3）: 素材がその古地図の範囲で切った部分（clipped）を持てばそれを、無ければ points をそのまま描く
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
    const mapSec = makeSection("地図");
    const mapField = document.createElement("label");
    mapField.className = "demo-field";
    mapField.appendChild(document.createTextNode("表示する地図"));
    const mapSelect = document.createElement("select");
    mapSelect.id = "map-select";
    const oldGroup = document.createElement("optgroup");
    oldGroup.label = "古地図";
    const baseGroup = document.createElement("optgroup");
    baseGroup.label = "現代の地図";
    for (const source of setting.sources) {
      const isBasemap = typeof source === "string";
      const mapID = isBasemap ? source : (source as { mapID: string }).mapID;
      const label = isBasemap
        ? (BASEMAP_LABEL[mapID] ?? mapID)
        : (i18n((source as { label?: string | { ja?: string; en?: string } }).label) || mapID);
      const opt = document.createElement("option");
      opt.value = mapID;
      opt.textContent = label;
      (isBasemap ? baseGroup : oldGroup).appendChild(opt);
    }
    for (const g of [oldGroup, baseGroup]) if (g.children.length > 0) mapSelect.appendChild(g);
    mapSelect.addEventListener("change", () => {
      // IR1 Major-3 の是正を維持: 切替前に線・面を空にする
      app.clearLine();
      void app.changeMap(mapSelect.value);
    });
    mapField.appendChild(mapSelect);
    mapSec.row().appendChild(mapField);
    const opField = document.createElement("label");
    opField.className = "demo-field";
    const opText = document.createTextNode("透過度 0%");
    const opRange = document.createElement("input");
    opRange.type = "range";
    opRange.id = "opacity-range";
    opRange.min = "0";
    opRange.max = "100";
    opRange.step = "10";
    opRange.value = "0";
    opRange.addEventListener("input", () => {
      app.setTransparency(Number(opRange.value));
      opText.textContent = `透過度 ${opRange.value}%`;
    });
    opField.appendChild(opText);
    opField.appendChild(opRange);
    mapSec.row().appendChild(opField);
    mountSection(mapSec);
    const renderMapSelect = (activeId: string | undefined): void => {
      if (activeId !== undefined) mapSelect.value = activeId;
    };

    // ---- POI（v4.2。表示のチェック・追加はチェック〔HR-23/1〕・移動はチェック〔HR-23/2・3〕）----
    const poiSec = makeSection("POI");
    // POI の選択（v4.4・HR-25/1・2）: クリックした POI を Core の selectMarker で選ぶ（アイコンが selected になり、画面の中央へ来る）。
    // 「選択中の POI」のチェックは選択があるときだけ有効で、外すと unselectMarker で全部を未選択に戻す
    let selectedId: string | undefined;
    const selectWrap = makeCheck("選択中の POI", false, (on) => { if (!on) clearSelection(); });
    const refreshSelectCheck = (): void => {
      const cb = selectWrap.querySelector("input");
      if (cb) cb.checked = selectedId !== undefined;
      setUsable(selectWrap, selectedId !== undefined, "地図の POI をクリックすると選べます");
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
      showRow.appendChild(makeCheck("すべての POI を表示", true, (on) => {
        if (on) app.showAllMarkers();
        else app.hideAllMarkers();
      }));
      if (appPois.length > 0) {
        showRow.appendChild(makeCheck("アプリ用 POI", true, (on) => {
          if (on) app.showPoiLayer(APP_LAYER);
          else app.hidePoiLayer(APP_LAYER);
        }));
      }
      if (mapPoiCount.size > 0) {
        // 地図用 POI の層は地図ごとにあるので、全部の層へ同じ表示状態を掛ける（地図を替えても揃う）
        mapPoiCheck = makeCheck("地図用 POI", true, (on) => {
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
      setUsable(mapPoiCheck, n > 0, "この地図には地図用 POI がありません");
    };
    // 追加 POI・移動のうち出る地図が限られるもの（v4.3・IR3 Major-1）。その地図に無ければチェックを無効化する（HR-20・22 の一般化）
    const opChecks: { wrap: HTMLLabelElement; maps: string[] }[] = [];
    const refreshOpChecks = (): void => {
      const mapID = activeMapId() ?? "";
      for (const { wrap, maps } of opChecks) setUsable(wrap, maps.includes(mapID), "この地図には出せません");
    };
    if (demoOps.addPoi.length > 0 || demoOps.movePoi.length > 0) {
      const opRow = poiSec.row();
      // POI 追加（HR-23/1）: on で追加・off で削除。Core の removeMarker は #111 の修正（edd55e9 以降）が前提
      // maps が無ければアプリ全体の層（全地図）、あれば地図ごとの層 "<mapID>#add"（その地図にだけ出る）
      for (const op of demoOps.addPoi) {
        const layers = op.maps ? op.maps.map(addLayerId) : [APP_LAYER];
        if (op.maps) for (const id of layers) ensureLayer(id, "追加 POI");
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
      // 移動ピン（HR-23/2・3）: 始点・終点は参照する線（アプリの線か地図の線）の最初と最後の頂点。既存の POI の座標は使わない
      // 地図の線を参照するときは、その線の maps の地図ごとの層 "<mapID>#move" に 1 本ずつ置く（線と同じ地図にだけ出る）
      const lineMapsOf = (l: LineItem | MapLineItem): string[] | undefined => ("maps" in l ? l.maps : undefined);
      const sourceIds = setting.sources.map((s) => (typeof s === "string" ? s : (s as { mapID: string }).mapID));
      for (const move of demoOps.movePoi) {
        const line = appLines.find((l) => l.label === move.line) ?? mapLines.find((l) => l.label === move.line);
        if (!line || line.points.length < 2) continue; // 素材の検査（t3 AC-T3-11）が先に落とす。ここでは出さないだけ
        const pin = (at: [number, number], where: string) => ({
          name: move.label,
          desc: `${line.label}の${where}`,
          lnglat: [at[0], at[1]] as [number, number],
          icon: MOVE_ICON,
          selectedIcon: MOVE_ICON_SELECTED
        });
        const lineMaps = lineMapsOf(line);
        // v4.4（HR-25/3）: 線が古地図の範囲で切った部分（clipped）を持つときは、地図ごとの層に置き、
        // その地図で描く部分の最初と最後の頂点を始点・終点にする（範囲の外へ移って消えない）。
        // 地図の線は maps の地図ごと、切った部分を持つアプリの線は全地図ごと、どちらでもなければアプリ全体の層に 1 本
        const perMap = lineMaps ?? (line.clipped ? sourceIds : undefined);
        const places = perMap
          ? perMap.map((mapID) => ({ layer: moveLayerId(mapID), pts: drawnPoints(line, mapID) }))
          : [{ layer: MOVE_LAYER, pts: line.points }];
        const ends = places.map(({ layer, pts }) => {
          ensureLayer(layer, "移動ピン");
          const start = pts[0];
          const end = pts[pts.length - 1];
          return { id: app.addMarker(pin(start, "始点"), layer) as string, start, end };
        });
        const wrap = makeCheck(move.label, false, (on) => {
          for (const { id, start, end } of ends) app.updateMarker(id, on ? pin(end, "終点") : pin(start, "始点"), false);
        });
        if (lineMaps) opChecks.push({ wrap, maps: lineMaps });
        opRow.appendChild(wrap);
      }
    }
    poiSec.row().appendChild(selectWrap);

    // ---- nov26-m4-t8: アイコン指定の層・年代で色を変える層・重なった POI（Issue #37 の 4）----
    // 素材を増やさずにボタンだけで足す。地点は app 設定の homePosition の周り
    const homeLngLat = (): [number, number] => [setting.homePosition[0], setting.homePosition[1]];
    const extraRow = poiSec.row();
    const iconBtn = makeButton("アイコン指定の層を足す", () => {
      if (app.getPoiLayer(ICON_LAYER)) return;
      app.addPoiLayer(ICON_LAYER, { name: "アイコン指定の層（icon・selectedIcon）", icon: LAYER_ICON, selectedIcon: LAYER_ICON_SELECTED });
      const [lng, lat] = homeLngLat();
      const offsets: [number, number][] = [[-0.0015, 0.0008], [0.0015, 0.0008], [0, -0.0012]];
      offsets.forEach(([dx, dy], i) => {
        app.addMarker({ name: `アイコン指定の例 ${i + 1}`, desc: "層の icon・selectedIcon で描く", lnglat: [lng + dx, lat + dy] }, ICON_LAYER);
      });
      iconBtn.disabled = true;
    });
    const eraBtn = makeButton("年代で色を変える層を足す", () => {
      if (app.getPoiLayer(ERA_LAYER)) return;
      app.addPoiLayer(ERA_LAYER, { name: "年代で色分けした層（iconTemplate）", iconTemplate: ERA_ICON_TEMPLATE });
      // 素材の POI（start を持つものがある）を写しで載せる。地図用 POI も全地図に出す
      for (const poi of [...appPois, ...mapPois]) app.addMarker(structuredClone(poi), ERA_LAYER);
      eraBtn.disabled = true;
    });
    const overlapBtn = makeButton("同じ地点に 2 件置く", () => {
      if (app.getPoiLayer(OVERLAP_LAYER)) app.clearMarker(OVERLAP_LAYER);
      else app.addPoiLayer(OVERLAP_LAYER, { name: "重なった POI" });
      const [lng, lat] = homeLngLat();
      for (const n of [1, 2]) {
        app.addMarker({ name: `重なった POI ${n}`, desc: `同じ地点に置いた ${n} 件目`, lnglat: [lng, lat] }, OVERLAP_LAYER);
      }
      app.goHome();
    });
    extraRow.append(iconBtn, eraBtn, overlapBtn);
    const eraNote = document.createElement("p");
    eraNote.className = "demo-note";
    eraNote.textContent = "年代（start）の色: 1599 年以前 赤・1600〜1867 年 緑・1868 年以降 青・年代なし 灰";
    poiSec.sec.appendChild(eraNote);
    // ---- poiTemplate の記法のプリセット（Nunjucks と旧い記法の対比）----
    // 切り替えるたびに警告の記憶を戻し（デモだけの処理）、警告の欄を空にしてから描き直す
    const templateRow = poiSec.row();
    const templateLabel = document.createElement("span");
    templateLabel.textContent = "poiTemplate の記法: ";
    templateRow.appendChild(templateLabel);
    const applyTemplatePreset = (preset: (typeof TEMPLATE_PRESETS)[number]): void => {
      resetTemplateWarnings();
      templateWarnings.replaceChildren();
      templateCurrent.textContent = `今のテンプレート（${preset.label}）: ${preset.template}`;
      // 先にテンプレートを替える（層・POI の追加で起きる描き直しが、前のプリセットで評価して警告を出さないように）
      app.poiTemplate = preset.template;
      if (preset.id === "safe" && !app.getPoiLayer(TEMPLATE_LAYER)) {
        // 名前に <b> を含む POI（{{ name }} では文字のまま、{{ name | safe }} では太字になる）
        app.addPoiLayer(TEMPLATE_LAYER, { name: "記法の例" });
        const [lng, lat] = homeLngLat();
        app.addMarker({ name: "<b>太字</b>の名前", desc: "名前に <b> を含む POI", lnglat: [lng, lat + 0.002] }, TEMPLATE_LAYER);
      }
      detailBox.textContent = "";
      app.redrawMarkers();
      if (!templateWarnings.childElementCount) templateWarnings.textContent = "テンプレートの警告: なし";
    };
    for (const preset of TEMPLATE_PRESETS) {
      const btn = makeButton(preset.label, () => { applyTemplatePreset(preset); });
      btn.dataset.templatePreset = preset.id;
      templateRow.appendChild(btn);
    }
    const templateCurrent = document.createElement("p");
    templateCurrent.className = "demo-note";
    templateCurrent.id = "template-current";
    templateCurrent.textContent = `今のテンプレート（${TEMPLATE_PRESETS[0].label}）: ${POI_TEMPLATE}`;
    const templateWarnings = document.createElement("div");
    templateWarnings.className = "demo-note demo-template-warnings";
    templateWarnings.id = "template-warnings";
    templateWarnings.textContent = "テンプレートの警告: なし";
    templateWarningSink = (message) => {
      if (templateWarnings.textContent === "テンプレートの警告: なし") templateWarnings.replaceChildren();
      const line = document.createElement("p");
      line.textContent = `テンプレートの警告: ${message}`;
      templateWarnings.appendChild(line);
    };
    poiSec.sec.append(templateCurrent, templateWarnings);
    // clickMarkers の件数と、poiTemplate から作られた detail.html（sanitizeHtml を通したものだけ）
    const hitsLine = document.createElement("p");
    hitsLine.className = "demo-poi-hits";
    hitsLine.id = "poi-hits";
    hitsLine.textContent = "POI をクリックすると、その地点の POI の件数（clickMarkers）を出します";
    const detailBox = document.createElement("div");
    detailBox.className = "demo-poi-detail";
    detailBox.id = "poi-detail";
    poiSec.sec.append(hitsLine, detailBox);

    // ---- nov26-m4-t8: POI の層の一覧（listPoiLayers）・層ごとの表示切替・層ごとの消去（Issue #37 の 2・3）----
    const layersBox = document.createElement("div");
    layersBox.className = "demo-poi-layers";
    layersBox.id = "poi-layers";
    poiSec.sec.appendChild(layersBox);
    type LayerInfo = { namespaceID: string; name?: string | { ja?: string; en?: string }; pois: unknown[]; hide?: boolean };
    const refreshPoiLayers = (): void => {
      const layers = app.listPoiLayers() as LayerInfo[];
      const title = document.createElement("p");
      title.className = "demo-note";
      title.textContent = `POI の層（listPoiLayers）: ${layers.length} 層`;
      const rows = layers.map((layer) => {
        const row = document.createElement("div");
        row.className = "demo-row demo-poi-layer";
        row.dataset.layer = layer.namespaceID;
        const name = i18n(layer.name) || layer.namespaceID;
        row.appendChild(makeCheck(`${layer.namespaceID}（${name}）: ${layer.pois.length} 件`, !layer.hide, (on) => {
          if (on) app.showPoiLayer(layer.namespaceID);
          else app.hidePoiLayer(layer.namespaceID);
          refreshPoiLayers();
        }));
        row.appendChild(makeButton("消す", () => {
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
        allRow.appendChild(makeButton(`この地図の層をまとめて消す（${mapID}#all）`, () => {
          clearSelection();
          app.clearMarker(`${mapID}#all`);
        }));
        rows.push(allRow);
      }
      layersBox.replaceChildren(title, ...rows);
    };
    mountSection(poiSec);

    // ---- 線・面（v4.2。アプリの線・地図の線とも既定で表示。地図の線はその地図に無いときチェックを無効化）----
    const shapeSec = makeSection("線・面");
    const shapeRow = shapeSec.row();
    const toggleIn = <T>(list: T[], item: T, on: boolean): void => {
      const idx = list.indexOf(item);
      if (on && idx < 0) list.push(item);
      if (!on && idx >= 0) list.splice(idx, 1);
    };
    for (const line of appLines) {
      shapeRow.appendChild(makeCheck(line.label, true, (on) => { toggleIn<LineItem>(activeLines, line, on); redrawShapes(); }));
    }
    // HR-20: 地図の線は、現在の地図に無いときチェックを無効化する（選択状態は保つ）
    const lineChecks: { line: MapLineItem; wrap: HTMLLabelElement }[] = [];
    for (const line of mapLines) {
      const wrap = makeCheck(line.label, true, (on) => { toggleIn<LineItem>(activeLines, line, on); redrawShapes(); });
      lineChecks.push({ line, wrap });
      shapeRow.appendChild(wrap);
    }
    const refreshLineChecks = (): void => {
      const mapID = activeMapId();
      for (const { line, wrap } of lineChecks) setUsable(wrap, lineApplies(line, mapID), "この地図では表示できません");
    };
    for (const vec of demoOps.addVector) {
      shapeRow.appendChild(makeCheck(vec.label, true, (on) => { toggleIn(activeVectors, vec, on); refreshVectorAttr(); redrawShapes(); }));
    }
    refreshVectorAttr();
    mountSection(shapeSec);

    // ---- 視点 ----
    const viewSec = makeSection("視点");
    const viewRow = viewSec.row();
    viewRow.appendChild(makeButton("ホーム", () => { app.goHome(); }));
    viewRow.appendChild(makeButton("回転を戻す", () => { app.resetRotation(); }));
    viewRow.appendChild(makeButton("北を上に", () => { app.resetDirection(); }));
    mountSection(viewSec);

    // ---- GPS ----
    const gpsSec = makeSection("GPS");
    const gpsRow = gpsSec.row();
    const gpsCheck = makeCheck("GPS を使う", false, (on) => {
      app.handleGPS(on);
      const cb = gpsCheck.querySelector("input");
      if (cb) cb.checked = app.getGPSEnabled();
    });
    gpsRow.appendChild(gpsCheck);
    const fakeRow = gpsSec.row();
    fakeRow.appendChild(makeButton("仮の現在地を置く", () => {
      const hp = setting.homePosition;
      app.setGPSMarker({ lnglat: [hp[0], hp[1]], acc: 60 });
    }));
    fakeRow.appendChild(makeButton("仮の現在地を消す", () => { app.setGPSMarker(null); }));
    mountSection(gpsSec);

    // ---- 地図切替・視点変化に追従して、出典・選択中の地図・線・視点を出し直す ----
    const refreshMapState = (): void => {
      // v4.4（HR-25/2）: 地図ごとの層の POI（"<mapID>#…"）を選んだまま別の地図へ替えたら、選択を外す（描かれない POI を選んだままにしない）
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
    };
    app.addEventListener("mapChanged", () => {
      refreshMapState();
      logEvent("mapChanged", activeMapId() ?? "");
    });
    app.addEventListener("changeViewpoint", (evt) => {
      void refreshViewpoint();
      const d = detailOf(evt) as { longitude?: number; latitude?: number; zoom?: number; direction?: number } | undefined;
      const text = `経度 ${num(d?.longitude, 5)} / 緯度 ${num(d?.latitude, 5)} / zoom ${num(d?.zoom, 2)} / 方位 ${num(d?.direction, 1)}°`;
      stViewpoint.textContent = text;
      logEvent("changeViewpoint", text);
    });
    // nov26-m4-t8: 状態とイベント履歴（Issue #37 の 7）
    app.addEventListener("updateState", (evt) => {
      const text = brief(detailOf(evt));
      stUpdate.textContent = text;
      logEvent("updateState", text);
    });
    app.addEventListener("poi_number", (evt) => {
      refreshPoiLayers();
      logEvent("poi_number", `${String(detailOf(evt))} 件`);
    });
    app.addEventListener("clickMap", (evt) => {
      const d = detailOf(evt) as { longitude?: number; latitude?: number } | undefined;
      const text = `経度 ${num(d?.longitude, 6)} / 緯度 ${num(d?.latitude, 6)}`;
      stClick.textContent = text;
      logEvent("clickMap", text);
    });
    app.addEventListener("clickMarkers", (evt) => {
      const list = (detailOf(evt) as { name?: string | { ja?: string; en?: string } }[] | undefined) ?? [];
      hitsLine.textContent = `clickMarkers: ${list.length} 件（${list.map((d) => i18n(d.name)).join("・")}）`;
      logEvent("clickMarkers", `${list.length} 件`);
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
      if (data.image && typeof data.imageCredit === "string") parts.push(`写真: ${data.imageCredit}`);
      markerInfo.textContent = parts.join(" — ");
      markerInfo.style.display = "";
      // nov26-m4-t8: poiTemplate から作られた detail.html は sanitizeHtml を通したものだけを出す（HR-13）
      if (typeof data.html === "string") detailBox.innerHTML = sanitizeHtml(data.html);
      else detailBox.textContent = "";
      logEvent("clickMarker", parts[0] ?? "");
      // v4.4（HR-25/1）: クリックした POI を選ぶ（Core が selected のアイコンで描き直す）
      if (typeof data.namespaceID === "string") {
        selectedId = data.namespaceID;
        app.selectMarker(selectedId);
        refreshSelectCheck();
      }
    });

    // 初期状態を反映
    refreshMapState();
  };

  // ---- nov26-m4-t8: 破棄と再生成（Issue #37 の 6）----
  // 再生成は「app.remove() → 同じ setting で createObject → 各節を作り直す」。古い app への参照を残さない
  let current: MaplatApp | undefined;
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
        logEvent("restoreSession", `別の地域で保存した状態（${saved}）は使わない`);
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
    status.textContent = "app を破棄しました";
  };
  const create = async (restoreSession: boolean): Promise<void> => {
    if (restoreSession) dropForeignSession();
    // setting を明示渡し。同時に存在する app は 1 つだけ。poiTemplate は clickMarker の detail.html の元（Issue #37 の 4）
    const app = await MaplatApp.createObject({ appid: region, setting, poiTemplate: POI_TEMPLATE, restoreSession });
    current = app;
    // 検査用の口（e2e が Feature の style を読む。デモはパッケージに入らない）
    (window as any).__MAPLAT_DEMO_APP__ = app;
    buildApp(app);
    logEvent("createObject", restoreSession ? "restoreSession 付き" : "");
  };

  const lifeSec = makeSection("破棄と再生成");
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
  lifeButton("再生成", async () => {
    destroy();
    setRestoreParam(false);
    await create(false);
  });
  lifeButton("restoreSession 付きで再生成", async () => {
    destroy();
    setRestoreParam(true);
    await create(true);
  });
  lifeButton("未知の mapID", async () => {
    const app = current;
    if (!app) {
      stUnknown.textContent = "app がありません（先に再生成してください）";
      return;
    }
    const mapIdOf = (): string | undefined => (app.currentMapInfo() as { mapID?: string } | undefined)?.mapID;
    const before = mapIdOf();
    let outcome: string;
    try {
      await app.changeMap("__unknown__");
      outcome = "例外なし・Promise は解決";
    } catch (e) {
      outcome = `例外: ${errText(e)}`;
    }
    const after = mapIdOf();
    stUnknown.textContent = `changeMap("__unknown__"): ${outcome}・地図は ${after === before ? `${String(after)} のまま` : `${String(before)} → ${String(after)}`}`;
  });
  const lifeNote = document.createElement("p");
  lifeNote.className = "demo-note";
  lifeNote.textContent = "?restoreSession=1 を付けて読み込むと restoreSession 付きで作り、1 時間以内に保存した地図・視点・透過度に戻ります";
  lifeSec.sec.appendChild(lifeNote);
  mountSection(lifeSec, fixedArea);
  // 状態とイベント履歴は操作を持たないが、常に出す（操作パネルの最下部）
  fixedArea.append(stateSec.sec, logSec.sec);

  await create(wantRestore());
}

// 初期化（fetch / createObject など）に失敗したら画面に出す。
// 無言で「読み込み中…」のまま止めない（レビュー Minor-1）。
main().catch((e: unknown) => {
  const status = byId("status");
  status.textContent = `地図の読み込みに失敗しました: ${e instanceof Error ? e.message : String(e)}`;
});
