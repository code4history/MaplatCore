/// <reference types="vite/client" />
// demo/demo.ts（oct26-m11-t4）: 単一デモページのロジック。
// 地域ドロップダウン（?region= 付き再読み込み）・app 設定の setting 明示渡し・
// 地域内コンテンツ切り替え UI（地図セレクタ・POI・線・面・視点・透過・GPS）・出典表示。
// Core 本体（公開ライブラリ）の公開 API だけを使う（Pro 専用 API・Core 専用 export を import しない）。
import { MaplatApp, sanitizeHtml } from "../src/index.ts"; // 開発時。build:demo でバンドル
// テンプレートの警告（ページで 1 回）の記憶を戻す。公開面ではないが、記法のプリセットを切り替えるたびに
// 警告を出し直して見せるため、デモの中だけで使う（製品の挙動は変えない）
import { resetTemplateWarnings } from "../src/template_works";
// 範囲外の POI の判定（classifyMarker）と描く層（outsideMarkerLayer）を節の表に出すため。
// 公開面ではないが、デモだけが読む（製品の挙動は変えない）
import { classifyMarker, outsideMarkerLayer } from "../src/outside_pois";
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

// sanitizeHtml の入出力のプリセット（許される qy-swiper と、危険な属性）。
// (a) 相対 URL・caption に <i>・has-thumb が残る（caption はテキストになる）。
// (b) javascript: の URL・onerror・style・<cc-swiper>・<div image-url> だけが消える
const SANITIZE_PRESETS = [
  {
    id: "qy-allowed",
    label: "許される qy-swiper",
    html: '<qy-swiper has-thumb><qy-swiper-slide image-url="img/a.jpg" image-type="image" caption="&lt;i&gt;六百遠忌&lt;/i&gt;報恩塔" fit-to-container></qy-swiper-slide></qy-swiper>'
  },
  {
    id: "qy-dangerous",
    label: "危険な属性",
    html: '<qy-swiper style="color:red" onclick="alert(1)"><qy-swiper-slide image-url="javascript:alert(1)" image-type="image" onerror="alert(1)" caption="c"></qy-swiper-slide></qy-swiper><cc-swiper><cc-swiper-slide image-url="a.jpg">cc-swiper の中の文字</cc-swiper-slide></cc-swiper><div image-url="a.jpg">div の中の文字</div>'
  }
] as const;

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
  const sec = makeSection("範囲外の POI");
  const note = document.createElement("p");
  note.className = "demo-note";
  note.textContent = "前者は紙の外の地理の地図の上にピンが立ち、後者は立たない";
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
          name: `範囲外の POI の例 ${found.length}`,
          desc: "紙の縁から外へ離した点（デモが足した例）",
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
    for (const label of ["POI", "範囲", "描く層"]) {
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
        classified.kind === "inside" ? "範囲内" : classified.kind === "outside" ? "範囲外" : "範囲外（画素指定）";
      const drawn = document.createElement("td");
      // 範囲内は hide-outside-pois でも前面のまま（描かないのは範囲外だけ）
      drawn.textContent =
        classified.kind === "inside"
          ? "前面"
          : classified.kind === "skip" || layer === "none"
            ? "描かない"
            : layer === "front"
              ? "前面"
              : "背面";
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
  shownRow.appendChild(makeButton("範囲外を出す（既定）", () => {
    app.applyRuntimeOptions({ hideOutsidePois: false });
    void refresh();
  }));
  shownRow.appendChild(makeButton("hide-outside-pois", () => {
    app.applyRuntimeOptions({ hideOutsidePois: true });
    void refresh();
  }));

  // (2) 透過度 0 と 70（紙に覆われた背面のピンが見えるか）
  const transparencyRow = sec.row();
  transparencyRow.appendChild(makeButton("透過度 0", () => {
    ctx.setTransparency(0);
    void refresh();
  }));
  transparencyRow.appendChild(makeButton("透過度 70", () => {
    ctx.setTransparency(70);
    void refresh();
  }));

  // (3) 範囲外のピンを選ぶ → 選択を外す。(4) 範囲内のピンを選ぶ
  const selectRow = sec.row();
  selectRow.appendChild(makeButton("範囲外のピンを選ぶ", () => {
    const hit = rows.find((row) => row.classified.kind === "outside");
    if (!hit) {
      status.textContent = "範囲外の POI がありません";
      return;
    }
    app.selectMarker(hit.entry.id);
    ctx.onSelected(hit.entry.id);
    status.textContent = `選択中: ${i18n(hit.entry.data.name)}（中心がそのピンへ寄ります）`;
  }));
  selectRow.appendChild(makeButton("選択を外す", () => {
    app.unselectMarker();
    ctx.onSelected(undefined);
    status.textContent = "選択を外しました（中心が紙の縁へ戻ります）";
  }));
  selectRow.appendChild(makeButton("範囲内のピンを選ぶ", () => {
    const hit = rows.find((row) => row.classified.kind === "inside");
    if (!hit) {
      status.textContent = "範囲内の POI がありません";
      return;
    }
    app.selectMarker(hit.entry.id);
    ctx.onSelected(hit.entry.id);
    status.textContent = `選択中: ${i18n(hit.entry.data.name)}`;
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

  // この地域の古地図のうち、IIIF の配信（delivery.type === "iiifImage"）を使うもの。
  // 「IIIF の画像」の節をどの地図で見せるかを決める（デモだけの処理。地図の設定は読むだけ）
  const iiifMapIDs: string[] = [];
  for (const source of setting.sources) {
    if (typeof source === "string") continue;
    const mapID = (source as { mapID: string }).mapID;
    try {
      const map = await (await fetch(`maps/${mapID}.json`)).json();
      if (map?.delivery?.type === "iiifImage") iiifMapIDs.push(mapID);
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
    // 「範囲外の POI」の節が使う（どの POI が範囲の外か・どの層に描くかを出す）。
    // 地図用 POI はその地図のときだけ節に出すので、mapID を控える
    const recordedPois: OutsidePoiEntry[] = [];
    // Core の normalizePoi は渡した POI をその場で書き換えるので、素材は写しで渡す（IR1 Major-1 と同じ理由）
    for (const poi of appPois) {
      recordedPois.push({ id: app.addMarker(structuredClone(poi), APP_LAYER) as string, data: poi });
    }
    // 地図用 POI は maps の地図ごとに 1 件ずつ写しを載せる。地図ごとの件数はトグルの無効化に使う
    const mapPoiCount = new Map<string, number>();
    for (const poi of mapPois) {
      const { maps, ...data } = poi;
      for (const mapID of maps) {
        if (!app.getPoiLayer(mapLayerId(mapID))) app.addPoiLayer(mapLayerId(mapID), { name: "地図用 POI" });
        recordedPois.push({ id: app.addMarker(structuredClone(data), mapLayerId(mapID)) as string, data, mapID });
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
        opt.textContent = `${label}（使えない地図）`;
        opt.disabled = true;
      }
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
    // 「範囲外の POI」の節の透過度のボタンからも同じ口を使う（スライダーの表示も合わせる）
    const setTransparency = (value: number): void => {
      opRange.value = String(value);
      opText.textContent = `透過度 ${value}%`;
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
  // ---- sanitizeHtml の入出力（テンプレートの出力の <qy-swiper>・<qy-swiper-slide>）----
  // Core のデモは qy-* を登録しないので、スライダーの見た目ではなく、残る属性と消える属性を文字列で見せる
  const sanitizeSec = makeSection("sanitizeHtml の入出力");
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
    const btn = makeButton(preset.label, () => {
      sanitizeInput.value = preset.html;
      runSanitize();
    });
    btn.dataset.sanitizePreset = preset.id;
    sanitizeRow.appendChild(btn);
  }
  sanitizeRow.appendChild(makeButton("入力を通す", runSanitize));
  const sanitizeNote = document.createElement("p");
  sanitizeNote.className = "demo-note";
  sanitizeNote.textContent = "許される qy-swiper は属性が残り caption がテキストになる。危険な属性（javascript: の URL・onerror・style）と cc-swiper・div の image-url は消える";
  sanitizeSec.sec.append(sanitizeInput, sanitizeNote, sanitizeOutput);
  sanitizeInput.value = SANITIZE_PRESETS[0].html;
  runSanitize();
  mountSection(sanitizeSec, fixedArea);
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
  const sec = makeSection("IIIF の画像");

  // (a) IIIF から配信
  if (ctx.iiifUsable) {
    const mapID = ctx.iiifUsable;
    const row = sec.row();
    row.appendChild(
      makeButton("IIIF から配信", () => {
        app.clearLine();
        void app.changeMap(mapID).catch((e: unknown) => {
          showError("IIIF から配信", e);
        });
      })
    );
    addIiifNote(
      row,
      "見えるもの: 古地図が表示される。節の中に「直近のタイルの要求」の一覧（dl.ndl.go.jp/api/iiif/948741/R0000003/768,512,256,256/256,/0/default.jpg の形）。キャッシュの欄は「キャッシュ対象外」"
    );
    addIiifNote(row, "対比で分かること: 画像が NDL の IIIF から来ている（ネットワークの要求が IIIF の切り出しの形）");
  }

  // (b) 壊れた delivery
  if (ctx.iiifBroken) {
    const mapID = ctx.iiifBroken;
    const row = sec.row();
    row.appendChild(
      makeButton("壊れた delivery", () => {
        void app.changeMap(mapID).then(
          () => {
            logEvent("changeMap", `${mapID}: 使えない地図なので切り替わりません（他の地図は使えます）`);
          },
          (e: unknown) => {
            showError("壊れた delivery", e);
          }
        );
      })
    );
    addIiifNote(
      row,
      "見えるもの: 地図の一覧で「使えない地図」になり、他の地図は普通に使える。節に console.error の文（「IIIF image … is not usable: fetch-failed」）を写す"
    );
    addIiifNote(row, "対比で分かること: 失敗しても起動が止まらない");
  }

  // (c) 既存の地域の古地図（手元のタイル）
  {
    const row = sec.row();
    if (ctx.localMapID) {
      const mapID = ctx.localMapID;
      row.appendChild(
        makeButton("この地域の古い地図（手元のタイル）", () => {
          app.clearLine();
          void app.changeMap(mapID).catch((e: unknown) => {
            showError("手元のタイル", e);
          });
        })
      );
    } else {
      row.appendChild(
        makeButton("既存の地域（館林）の古い地図", () => {
          const url = new URL(location.href);
          url.searchParams.set("region", "tatebayashi");
          location.assign(url.toString());
        })
      );
    }
    addIiifNote(row, "見えるもの: 要求の一覧は t.tilemap.jp/…/{z}/{x}/{y}.jpg の形");
    addIiifNote(row, "対比で分かること: 手元のタイルの道（今の道）との違い");
    addIiifNote(row, "同じ画像の手元のタイルはまだ作れないため、既存の地域の古い地図で見せています。");
  }

  // 直近のタイルの要求（PerformanceObserver の resource。textContent で入れる）
  const requestTitle = document.createElement("p");
  requestTitle.className = "demo-note";
  requestTitle.textContent = "直近のタイルの要求:";
  const requestList = document.createElement("pre");
  requestList.id = "iiif-tile-requests";
  requestList.className = "demo-note";
  requestList.style.cssText = "white-space:pre-wrap;word-break:break-all;margin:4px 0 0;";
  requestList.textContent = tileRequests.length > 0 ? tileRequests.join("\n") : "（まだありません）";
  tileRequestSink = (list) => {
    requestList.textContent = list.length > 0 ? list.join("\n") : "（まだありません）";
  };
  startTileRequestObserver();
  sec.sec.append(requestTitle, requestList);

  // キャッシュの対象か（Core の公開のメソッドだけで見る）
  const cacheRow = sec.row();
  const cacheLabel = document.createElement("span");
  cacheLabel.textContent = "キャッシュ: ";
  const cacheValue = document.createElement("span");
  cacheValue.id = "iiif-cache";
  const refreshCache = (): void => {
    const mapID = activeMapId();
    cacheValue.textContent = mapID && app.getMapCacheEnable(mapID) ? "キャッシュ対象" : "キャッシュ対象外";
  };
  refreshCache();
  app.addEventListener("mapChanged", refreshCache);
  cacheRow.append(cacheLabel, cacheValue);

  // 使えない地図の記録（Core の console.error を写す）
  const errorTitle = document.createElement("p");
  errorTitle.className = "demo-note";
  errorTitle.textContent = "使えない地図の記録（console.error）:";
  const errorList = document.createElement("pre");
  errorList.id = "iiif-unusable-errors";
  errorList.className = "demo-note";
  errorList.style.cssText = "white-space:pre-wrap;word-break:break-all;margin:4px 0 0;";
  errorList.textContent = unusableMessages.length > 0 ? unusableMessages.join("\n") : "（ありません）";
  sec.sec.append(errorTitle, errorList);

  mountSection(sec);
}
