// demo/element.html の操作。要素の公開面（属性・プロパティ・メソッド・イベント）だけを使う。
import "../src/element.ts"; // 副作用で <maplat-app> を登録（パッケージでは "@maplat/core/element"）
import type { MaplatAppElement } from "../src/element.ts";

const el = document.getElementById("app") as MaplatAppElement;
const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const log = $("log");
const status = $("status");
const current = $("current");

function write(line: string) {
  log.textContent = `${line}\n${log.textContent}`.split("\n").slice(0, 60).join("\n");
}

// ---- イベント ----
for (const type of ["lifecycle:ui-ready", "mapChanged", "updateState", "clickMarker", "clickMap", "moveEnd", "gpsEnabledChanged", "sourceLoaded"]) {
  el.addEventListener(type, evt => {
    const detail = (evt as CustomEvent).detail;
    let text: string;
    if (type === "mapChanged") text = `mapID=${detail?.mapID}`;
    else if (type === "clickMap") text = `lng=${detail?.longitude?.toFixed?.(5)} lat=${detail?.latitude?.toFixed?.(5)}`;
    else if (type === "moveEnd") text = `zoom=${detail?.zoom?.toFixed?.(2)} lng=${detail?.longitude?.toFixed?.(5)}`;
    else if (type === "clickMarker") text = `name=${detail?.name}`;
    else if (type === "sourceLoaded") text = JSON.stringify(detail);
    else if (type === "updateState") text = `mapID=${detail?.mapID} transparency=${detail?.transparency}`;
    else text = JSON.stringify(detail && { phaseId: detail.phaseId });
    write(`${type}: ${text}`);
    current.textContent = el.currentMapId ?? "-";
  });
}

// ---- 属性 ----
const select = $<HTMLSelectElement>("map-select");
select.addEventListener("change", () => el.setAttribute("map-id", select.value));
const range = $<HTMLInputElement>("transparency");
range.addEventListener("input", () => {
  el.transparency = Number(range.value);
});

// ---- メソッド ----
$("add-marker").addEventListener("click", () => {
  const id = el.addMarker({ lnglat: [141.15199, 39.70056], name: "盛岡城跡（addMarker で追加）" }, "main");
  Promise.resolve(id).then(v => {
    $("marker-id").textContent = String(v);
    write(`addMarker → ${v}`);
  });
});
$("clear-marker").addEventListener("click", () => el.clearMarker());
$("go-home").addEventListener("click", () => el.goHome());
$("zoom-in").addEventListener("click", () => el.zoomBy(1));

// ---- 枠線と範囲（§3.4.2） ----
const COLORS = ["#e6194b", "#3cb44b", "#4363d8", "#f58231", "#911eb4"];
$("envelopes").addEventListener("click", () => {
  const maps = el.listMaps().filter(m => m.hasEnvelope);
  el.setEnvelopes(
    maps.map((m, i) => ({
      mapID: m.mapID,
      stroke: { color: COLORS[i % COLORS.length], width: 3, lineDash: [6, 6] },
      ...(m.mapID === el.currentMapId ? {} : { fill: "rgba(67, 99, 216, 0.25)" })
    }))
  );
  const first = maps[0] && el.getMapEnvelope(maps[0].mapID);
  $("envelope-info").textContent = `${maps.map(m => m.mapID).join(", ")}（${maps[0]?.mapID} の頂点 ${first?.length ?? 0} 個）`;
  write(`setEnvelopes: ${maps.map(m => m.mapID).join(", ")}`);
});
$("envelopes-clear").addEventListener("click", () => {
  el.setEnvelopes([]);
  $("envelope-info").textContent = "(消した)";
});
$("extent").addEventListener("click", () => {
  const extent = el.getViewExtent();
  $("extent-info").textContent = extent
    ? extent.map(p => `${p.longitude.toFixed(4)},${p.latitude.toFixed(4)}`).join(" / ")
    : "null";
});

// ---- Pro 固有の属性（U3） ----
$("display-mode").addEventListener("click", () => {
  el.setAttribute("display-mode", "map-warp"); // Core は「ignored unsupported attribute "display-mode"」を 1 回だけ出す
  $("display-mode-read").textContent = String((el as unknown as { displayMode?: string }).displayMode);
  write(`setAttribute("display-mode", "map-warp") → displayMode は ${(el as unknown as { displayMode?: string }).displayMode}`);
});
$("supports-dm").textContent = String(el.supports("display-mode"));

// ---- 中心の目印（U5） ----
$("toggle-center").addEventListener("click", () => {
  el.noCenterMarker = !el.noCenterMarker;
  write(`noCenterMarker = ${el.noCenterMarker}`);
});
const CROSS =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M16 2v28M2 16h28" stroke="#0a58ca" stroke-width="3"/></svg>'
  );
$("swap-center").addEventListener("click", () => {
  el.centerMarkerSrc = el.centerMarkerSrc ? undefined : CROSS;
  write(`centerMarkerSrc = ${el.centerMarkerSrc ? "(十字の SVG)" : "(既定)"}`);
});
$("class-center").addEventListener("click", () => el.classList.toggle("demo-ring"));

// ---- 起動時だけ効くキー（U2） ----
$("change-app-id").addEventListener("click", () => {
  el.setAttribute("app-id", "nara"); // console.warn が 1 回出て無視される
  $("app-id-read").textContent = String(el.appId);
  write(`setAttribute("app-id", "nara") → appId は ${el.appId} のまま`);
});

status.textContent = "地図を作成中…";
el.ready.then(
  () => {
    status.textContent = `ready（実装 ${el.implementation} ${el.version}・地図 ${el.listMaps().length} 枚）`;
    status.dataset.ready = "true";
    current.textContent = el.currentMapId ?? "-";
    $("app-id-read").textContent = String(el.appId);
    if (el.currentMapId) select.value = el.currentMapId;
  },
  err => {
    status.textContent = `失敗: ${err}`;
  }
);
