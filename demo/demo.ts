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
  btn.className = "c4h-header-btn";
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

  // #map_div の寸法（demo-shell.css は C4H 正本のため変えず、ここで inline 指定）
  const mapDiv = byId("map_div");
  mapDiv.style.position = "relative";
  mapDiv.style.width = "100%";
  mapDiv.style.height = "560px";

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
  const refreshAttr = (): void => {
    const m = app.getMapMeta(activeMapId()) as
      | {
          label?: string | { ja?: string; en?: string };
          attr?: string | { ja?: string; en?: string };
          license?: string;
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
    // 上位設計 §10.2-3: dataLicense（CC BY-SA など）の地図は「地理参照データ」を併記する
    if (m?.dataLicense) parts.push(`地理参照データ: ${m.dataLicense}`);
    attr.textContent = parts.join(" ／ ");
  };

  // ---- 視点表示（回転・方位。zoom は Core 公開面に取得 API が無いため出さない）----
  const refreshViewpoint = async (): Promise<void> => {
    const rotation = app.getRotation();
    const direction = await app.getDirection();
    status.textContent = `回転 ${rotation.toFixed(1)}° / 方位 ${direction.toFixed(1)}°`;
  };

  // ---- 地図セレクタ（app 設定 sources の各 entry をボタン化）----
  const mapButtons = new Map<string, HTMLButtonElement>();
  const renderMapButtons = (activeId: string | undefined): void => {
    for (const [id, btn] of mapButtons) {
      const isActive = id === activeId;
      btn.style.background = isActive ? "#3a7bd5" : "";
      btn.style.borderColor = isActive ? "#3a7bd5" : "";
    }
  };
  for (const source of setting.sources) {
    const isBasemap = typeof source === "string";
    const mapID = isBasemap ? source : (source as { mapID: string }).mapID;
    const label = isBasemap
      ? (BASEMAP_LABEL[mapID] ?? mapID)
      : (i18n((source as { label?: string | { ja?: string; en?: string } }).label) || mapID);
    const btn = makeButton(label, () => {
      // 切替前に線・面を消す。changeMap は resetVector() の後 this.vectors を非同期で
      // 描き直すため、先に clearLine() で空にしないと、切替前の線が mapChanged（→
      // redrawShapes の clearLine）の後に解決して対象外の地図にも描かれる（レビュー Major-3）。
      app.clearLine();
      void app.changeMap(mapID);
    });
    mapButtons.set(mapID, btn);
    controls.appendChild(btn);
  }

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

  // POI 一括表示 / 非表示（層を問わない一括切替）
  if (appPois.length > 0 || mapPois.length > 0) {
    controls.appendChild(makeButton("全 POI 表示", () => { app.showAllMarkers(); }));
    controls.appendChild(makeButton("全 POI 非表示", () => { app.hideAllMarkers(); }));
  }

  // POI レイヤの表示切替（チェックボックス）
  for (const layer of poiLayers) {
    const label = document.createElement("label");
    label.style.cssText = "display:inline-flex;align-items:center;gap:4px;font-size:12px;color:#fff;cursor:pointer;";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = true;
    cb.addEventListener("change", () => {
      if (cb.checked) app.showPoiLayer(layer.id);
      else app.hidePoiLayer(layer.id);
    });
    label.appendChild(cb);
    label.appendChild(document.createTextNode(layer.name));
    controls.appendChild(label);
  }

  // POI 追加（素材 demoOps.addPoi[].poi を写して addMarker。再押下で削除＝同じピンが重ならない）
  for (const op of demoOps.addPoi) {
    let added = false;
    let markerId: string | undefined;
    controls.appendChild(makeButton(op.label, () => {
      ensureLayer(MAP_LAYER, "地図用 POI");
      if (!added) {
        // addMarker は渡したオブジェクトを書き換える（lnglat 付与・lng/lat 削除・id 付与）ため
        // 素材を壊さないよう写しを渡す。多重押下で同じピンを重ねないようトグル（再押下で削除）。
        markerId = app.addMarker({ ...op.poi }, MAP_LAYER) as string;
        added = true;
      } else {
        app.removeMarker(markerId);
        markerId = undefined;
        added = false;
      }
    }));
  }

  // POI 移動（from を登録し、to の座標へ updateMarker。もう一度押すと from へ戻る）
  for (const move of demoOps.movePoi) {
    let moved = false;
    let markerId: string | undefined;
    controls.appendChild(makeButton(move.label, () => {
      ensureLayer(MAP_LAYER, "地図用 POI");
      if (!markerId) {
        // Core の addMarker → normalizePoi は渡したオブジェクトをその場で書き換える
        // （lnglat を足し、lng/lat/longitude/latitude を delete する）。素材の from を
        // 壊すと 2 回目に [target.lng, target.lat] が [undefined, undefined] になる
        // （レビュー Major-1）ため、写し（deep copy）を渡す。戻り値の namespaceID は
        // 写し側に付くが、それをそのまま markerId に使うので往復は成り立つ。
        markerId = app.addMarker(structuredClone(move.from), MAP_LAYER) as string;
      }
      const target = moved ? move.from : move.to;
      app.updateMarker(
        markerId,
        { lnglat: [target.lng, target.lat], address: target.address ?? "", desc: move.label },
        false
      );
      moved = !moved;
    }));
  }

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
  for (const line of demoOps.addLine) {
    controls.appendChild(makeButton(line.label, () => {
      const idx = activeLines.indexOf(line);
      if (idx >= 0) activeLines.splice(idx, 1);
      else activeLines.push(line);
      redrawShapes();
    }));
  }
  for (const vec of demoOps.addVector) {
    controls.appendChild(makeButton(vec.label, () => {
      const idx = activeVectors.indexOf(vec);
      if (idx >= 0) activeVectors.splice(idx, 1);
      else activeVectors.push(vec);
      redrawShapes();
    }));
  }
  if (demoOps.addLine.length > 0 || demoOps.addVector.length > 0) {
    controls.appendChild(makeButton("線・面を消す", () => {
      activeLines.length = 0;
      activeVectors.length = 0;
      redrawShapes();
    }));
  }

  // ---- 視点（goHome / 回転・方位リセット）----
  controls.appendChild(makeButton("ホーム", () => { app.goHome(); }));
  controls.appendChild(makeButton("回転リセット", () => { app.resetRotation(); }));
  controls.appendChild(makeButton("方位リセット", () => { app.resetDirection(); }));

  // ---- 透過度（setTransparency）----
  controls.appendChild(makeButton("透過 0%", () => { app.setTransparency(0); }));
  controls.appendChild(makeButton("透過 50%", () => { app.setTransparency(50); }));
  controls.appendChild(makeButton("透過 100%", () => { app.setTransparency(100); }));

  // ---- GPS（on/off・偽マーカー・クリア）----
  const gpsBtn = makeButton("GPS 有効化", () => {
    const next = !app.getGPSEnabled();
    app.handleGPS(next);
    gpsBtn.textContent = app.getGPSEnabled() ? "GPS 無効化" : "GPS 有効化";
  });
  controls.appendChild(gpsBtn);
  controls.appendChild(makeButton("偽 GPS マーカー", () => {
    const hp = setting.homePosition;
    app.setGPSMarker({ lnglat: [hp[0], hp[1]], acc: 60 });
  }));
  controls.appendChild(makeButton("GPS クリア", () => { app.setGPSMarker(null); }));

  // ---- 地図切替・視点変化に追従して、出典・アクティブ地図ボタン・線・視点を出し直す ----
  const refreshMapState = (): void => {
    refreshAttr();
    renderMapButtons(activeMapId());
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
