/// <reference types="vite/client" />
// demo/demo.ts（oct26-m11-t4）: 単一デモページのロジック。
// 地域ドロップダウン（?region= 付き再読み込み）・app 設定の setting 明示渡し・
// 地域内コンテンツ切り替え UI（地図セレクタ・POI・線・面・視点・透過・GPS）・出典表示。
// Core 本体（公開ライブラリ）の公開 API だけを使う（Pro 専用 API・Core 専用 export を import しない）。
import { MaplatApp } from "../src/index.ts"; // 開発時。build:demo でバンドル
import { REGION_IDS, REGION_META } from "./regions";
import type { AppSetting, Poi, RegionId } from "./regions";

// 素材 JSON（demo/content/<region>.json）を Vite の import.meta.glob でバンドルに取り込む。
// キーは "./content/<region>.json"（demo/ 起点の相対 glob）。ページの基点に依存しない。
const CONTENTS = import.meta.glob("./content/*.json", { import: "default" });

// 素材スキーマの実データ形。regions.ts の LineItem/VectorItem 型は t1 時点の形で
// kind（線種）・maps（表示対象の古地図 mapID の配列）を持たない（t3 が素材に追加した語）。
// 型正本は regions.ts だが、実データに合わせた局所型をここに持つ（regions.ts は
// AC-T4-7 の乖離修正以外で触らないため）。
type LngLatPair = [number, number];
type LineKind = "festival" | "walk" | "feature";
interface DemoLine {
  label: string;
  points: LngLatPair[];
  source: string;
  kind?: LineKind;
  maps?: string[];
}
interface DemoVector {
  label: string;
  points: LngLatPair[];
  source: string;
  kind?: LineKind;
}
interface DemoOps {
  addPoi: { label: string; poi: Poi }[];
  movePoi: { label: string; from: Poi; to: Poi }[];
  addLine: DemoLine[];
  addVector: DemoVector[];
}
interface DemoContent {
  region: RegionId;
  mapPois: Poi[];
  appPois: Poi[];
  demoOps: DemoOps;
}

const EMPTY_OPS: DemoOps = { addPoi: [], movePoi: [], addLine: [], addVector: [] };

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
  const content: DemoContent | undefined = loader ? ((await loader()) as DemoContent) : undefined;
  const demoOps: DemoOps = content?.demoOps ?? EMPTY_OPS;
  const appPois: Poi[] = content?.appPois ?? [];
  const mapPois: Poi[] = content?.mapPois ?? [];

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

  // ---- POI レイヤ（アプリ用 POI / 地図用 POI）。addMarker の受け皿として先に作る ----
  const APP_LAYER = "app";
  const MAP_LAYER = "map";
  const poiLayers: { id: string; name: string }[] = [];
  if (appPois.length > 0) {
    app.addPoiLayer(APP_LAYER, { name: "アプリ用 POI" });
    for (const poi of appPois) app.addMarker(poi, APP_LAYER);
    poiLayers.push({ id: APP_LAYER, name: "アプリ用 POI" });
  }
  if (mapPois.length > 0) {
    app.addPoiLayer(MAP_LAYER, { name: "地図用 POI" });
    for (const poi of mapPois) app.addMarker(poi, MAP_LAYER);
    poiLayers.push({ id: MAP_LAYER, name: "地図用 POI" });
  }
  // 追加・移動 POI の受け皿になる層がまだ無ければ作る（素材が無い地域でも操作を出せる）
  const ensureLayer = (id: string, name: string): void => {
    if (!app.getPoiLayer(id)) app.addPoiLayer(id, { name });
  };

  // ---- 線・面（kind 別パレット・maps による地図別表示）----
  const activeLines: DemoLine[] = [];
  const activeVectors: DemoVector[] = [];
  const lineKind = (line: DemoLine): LineKind => line.kind ?? "feature";
  const lineApplies = (line: DemoLine, mapID: string | undefined): boolean => {
    if (!line.maps || line.maps.length === 0) return true;
    return mapID !== undefined && line.maps.includes(mapID);
  };
  const redrawShapes = (): void => {
    const mapID = activeMapId();
    app.clearLine();
    for (const line of activeLines) {
      if (lineApplies(line, mapID)) {
        app.addLine({ lnglats: line.points, stroke: PALETTE[lineKind(line)].stroke });
      }
    }
    for (const vec of activeVectors) {
      app.addVector({ type: "Polygon", lnglats: [vec.points], style: PALETTE[vec.kind ?? "feature"] });
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

  // ---- POI（表示のチェック・追加は 1 回だけのボタン・移動はチェック）----
  const poiSec = makeSection("POI");
  if (poiLayers.length > 0) {
    const showRow = poiSec.row();
    showRow.appendChild(makeCheck("すべての POI を表示", true, (on) => {
      if (on) app.showAllMarkers();
      else app.hideAllMarkers();
    }));
    for (const layer of poiLayers) {
      showRow.appendChild(makeCheck(layer.name, true, (on) => {
        if (on) app.showPoiLayer(layer.id);
        else app.hidePoiLayer(layer.id);
      }));
    }
  }
  if (demoOps.addPoi.length > 0 || demoOps.movePoi.length > 0) {
    const opRow = poiSec.row();
    for (const op of demoOps.addPoi) {
      const btn = makeButton(op.label, () => {
        if (btn.disabled) return;
        ensureLayer(MAP_LAYER, "地図用 POI");
        // 1 回だけ追加する。マーカーの削除 API は呼ばない（IR2 Major-N1）。素材を壊さないよう写しを渡す
        app.addMarker({ ...op.poi }, MAP_LAYER);
        btn.disabled = true;
        btn.title = "追加済み（元に戻すにはページを読み直す）";
      });
      opRow.appendChild(btn);
    }
    for (const move of demoOps.movePoi) {
      let markerId: string | undefined;
      opRow.appendChild(makeCheck(move.label, false, (on) => {
        ensureLayer(MAP_LAYER, "地図用 POI");
        // IR1 Major-1 の是正を維持: 素材の from を Core に書き換えさせない
        if (!markerId) markerId = app.addMarker(structuredClone(move.from), MAP_LAYER) as string;
        const target = on ? move.to : move.from;
        app.updateMarker(
          markerId,
          { lnglat: [target.lng, target.lat], address: target.address ?? "", desc: move.label },
          false
        );
      }));
    }
  }
  mountSection(poiSec);

  // ---- 線・面（チェック。maps にない地図では on のままでも描かない）----
  const shapeSec = makeSection("線・面");
  const shapeRow = shapeSec.row();
  const toggleIn = <T>(list: T[], item: T, on: boolean): void => {
    const idx = list.indexOf(item);
    if (on && idx < 0) list.push(item);
    if (!on && idx >= 0) list.splice(idx, 1);
  };
  // HR-20: maps 指定のある線は、現在の地図で描けないときチェックを無効化する（選択状態は保つ）
  const lineChecks: { line: DemoLine; wrap: HTMLLabelElement }[] = [];
  for (const line of demoOps.addLine) {
    const wrap = makeCheck(line.label, false, (on) => { toggleIn(activeLines, line, on); redrawShapes(); });
    lineChecks.push({ line, wrap });
    shapeRow.appendChild(wrap);
  }
  const refreshLineChecks = (): void => {
    const mapID = activeMapId();
    for (const { line, wrap } of lineChecks) {
      const cb = wrap.querySelector("input");
      if (!cb) continue;
      // maps 指定がない線は lineApplies が常に true を返す＝常に有効
      const usable = lineApplies(line, mapID);
      cb.disabled = !usable;
      wrap.style.opacity = usable ? "" : "0.45";
      wrap.style.cursor = usable ? "" : "not-allowed";
      if (usable) wrap.removeAttribute("title");
      else wrap.title = "この地図では表示できません";
    }
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
