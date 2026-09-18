/// <reference types="vite/client" />
// demo/demo.ts（oct26-m11-t4）: 単一デモページのロジック。
// 地域ドロップダウン（?region= 付き再読み込み）・app 設定の setting 明示渡し・
// 地域内コンテンツ切り替え UI（地図セレクタ・POI・線・面・視点・透過・GPS）・出典表示。
// Core 本体（公開ライブラリ）の公開 API だけを使う（Pro 専用 API・Core 専用 export を import しない）。
import { MaplatApp } from "../src/index.ts"; // 開発時。build:demo でバンドル
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

// 線・面の見た目（kind 別パレット）。単一正本はここ 1 箇所。
// stroke は addLine の stroke、style は addVector の style（{ stroke, fill }）にそのまま渡す。
const PALETTE: Record<LineKind, { stroke: { color: string; width: number }; fill: string }> = {
  festival: { stroke: { color: "#e60033", width: 4 }, fill: "rgba(230, 0, 51, 0.15)" },
  walk: { stroke: { color: "#1a7f37", width: 4 }, fill: "rgba(26, 127, 55, 0.15)" },
  feature: { stroke: { color: "#f97316", width: 4 }, fill: "rgba(249, 115, 22, 0.15)" }
};

// ベースマップ（gsi / osm）の表示名。地図の id 自体は app 設定の sources（bare string）から得る。
const BASEMAP_LABEL: Record<string, string> = {
  gsi: "地理院地図",
  osm: "OpenStreetMap"
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

  // setting を明示渡し。1 回の読み込みで app は 1 つだけ
  const app = await MaplatApp.createObject({ appid: region, setting });

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
  const activeVectors: VectorItem[] = [];
  const lineApplies = (line: LineItem | MapLineItem, mapID: string | undefined): boolean => {
    if (!("maps" in line)) return true; // アプリの線
    return mapID !== undefined && line.maps.includes(mapID);
  };
  const redrawShapes = (): void => {
    const mapID = activeMapId();
    app.clearLine();
    for (const line of activeLines) {
      if (lineApplies(line, mapID)) {
        app.addLine({ lnglats: line.points, stroke: PALETTE[line.kind].stroke });
      }
    }
    for (const vec of activeVectors) {
      app.addVector({ type: "Polygon", lnglats: [vec.points], style: PALETTE[vec.kind] });
    }
  };
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
  // 中に操作が 1 つも無い節は出さない（上位 §8.4 の欠けの非表示）
  const mountSection = (s: Sec): void => {
    if (s.sec.querySelector("button, input, select")) controls.appendChild(s.sec);
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
    for (const move of demoOps.movePoi) {
      const line = appLines.find((l) => l.label === move.line) ?? mapLines.find((l) => l.label === move.line);
      if (!line || line.points.length < 2) continue; // 素材の検査（t3 AC-T3-11）が先に落とす。ここでは出さないだけ
      const start = line.points[0];
      const end = line.points[line.points.length - 1];
      const pin = (at: [number, number], where: string) => ({
        name: move.label,
        desc: `${line.label}の${where}`,
        lnglat: [at[0], at[1]] as [number, number],
        icon: MOVE_ICON,
        selectedIcon: MOVE_ICON
      });
      const lineMaps = lineMapsOf(line);
      const layers = lineMaps ? lineMaps.map(moveLayerId) : [MOVE_LAYER];
      for (const id of layers) ensureLayer(id, "移動ピン");
      const markerIds = layers.map((id) => app.addMarker(pin(start, "始点"), id) as string);
      const wrap = makeCheck(move.label, false, (on) => {
        for (const id of markerIds) app.updateMarker(id, on ? pin(end, "終点") : pin(start, "始点"), false);
      });
      if (lineMaps) opChecks.push({ wrap, maps: lineMaps });
      opRow.appendChild(wrap);
    }
  }
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
    shapeRow.appendChild(makeCheck(vec.label, false, (on) => { toggleIn(activeVectors, vec, on); redrawShapes(); }));
  }
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
    refreshAttr();
    renderMapSelect(activeMapId());
    refreshPoiChecks();
    refreshOpChecks();
    refreshLineChecks();
    redrawShapes();
    void refreshViewpoint();
  };
  app.addEventListener("mapChanged", () => { refreshMapState(); });
  app.addEventListener("changeViewpoint", () => { void refreshViewpoint(); });

  // 選択した POI の説明（name・desc・写真クレジット）を表示
  app.addEventListener("clickMarker", (evt) => {
    const data = (evt as unknown as { detail?: Record<string, unknown> }).detail;
    if (!data) return;
    const parts: string[] = [i18n(data.name as string | { ja?: string; en?: string })];
    if (typeof data.desc === "string") parts.push(data.desc);
    if (data.image && typeof data.imageCredit === "string") parts.push(`写真: ${data.imageCredit}`);
    markerInfo.textContent = parts.join(" — ");
    markerInfo.style.display = "";
  });

  // 初期状態を反映
  refreshMapState();
}

// 初期化（fetch / createObject など）に失敗したら画面に出す。
// 無言で「読み込み中…」のまま止めない（レビュー Minor-1）。
main().catch((e: unknown) => {
  const status = byId("status");
  status.textContent = `地図の読み込みに失敗しました: ${e instanceof Error ? e.message : String(e)}`;
});
