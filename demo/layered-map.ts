/// <reference types="vite/client" />
// demo/layered-map.ts: 変換の形（world file・三角網の B/C）のデモ。layered-map.html の操作。
// 人間が「要望どおりか」を画面で見るためのもの（関門ではない）。紙は合成の経緯線の画像（版権なし）。
// 素材の作り方は demo/layered-map/generate.mjs。Core の公開 API（MaplatApp）だけを使い、
// 背景の地理院地図以外はネットワークに出ない。
import { MaplatApp } from "../src/index.ts";

type LonLat = [number, number];
type Xy = [number, number];

// ---- 地図の定義（public/maps/layered_demo_*.json。generate.mjs が作る）----
const PAPER = 2048; // 紙の画素数（正方形）。東経 125〜150 度・北緯 25〜50 度
const LON0 = 125, LAT1 = 50;

interface MapDef {
  id: string;
  short: string;
  label: string;
  /** 制御点が及ぶ範囲（紙の画素。両軸）。その外側が「制御点の外」 */
  inner?: [number, number];
}
const MAPS: Record<string, MapDef> = {
  layered_demo_wf4326: { id: "layered_demo_wf4326", short: "(a)", label: "(a) world file（EPSG:4326）" },
  layered_demo_tin9: { id: "layered_demo_tin9", short: "(b)", label: "(b) 中央 30% の 9 点の三角網", inner: [PAPER * 0.35, PAPER * 0.65] },
  layered_demo_wf3857: { id: "layered_demo_wf3857", short: "(c)", label: "(c) 3857 のアフィンで近似した world file" },
  layered_demo_gcp_b: { id: "layered_demo_gcp_b", short: "B", label: "B: 四辺形の外は world file", inner: [PAPER * 0.2, PAPER * 0.8] },
  layered_demo_gcp_c: { id: "layered_demo_gcp_c", short: "C", label: "C: 四辺形の外は扇形", inner: [PAPER * 0.2, PAPER * 0.8] }
};
const REFERENCE = "layered_demo_wf4326";

interface Group {
  no: string;
  title: string;
  ids: string[];
  note: string;
}
const GROUPS: Group[] = [
  {
    no: "1",
    title: "world file の地図と三角網の地図（制御点の外）",
    ids: ["layered_demo_wf4326", "layered_demo_tin9"],
    note:
      "同じ画像を、(a) は 4326 の world file だけで、(b) は紙の中央 30% にだけ置いた 9 点（緑）の三角網で読む。" +
      "(a) は紙の端まで赤い線に青い線が重なる。(b) は制御点の外が扇形の外挿になり、周辺ほど青が赤から外れる。"
  },
  {
    no: "2",
    title: "crs が効いていることの確認",
    ids: ["layered_demo_wf4326", "layered_demo_wf3857"],
    note:
      "同じ画像を、(a) 4326 の world file と、(c) それを 3857 のアフィンで近似した world file で読む。" +
      "(c) は緯度方向の伸びを 1 つの係数でしか表せないので、青が赤から緯度に応じてずれる" +
      "（重なる緯度が 2 本あり、中央と両端では逆向きにずれる）。下の図に緯度ごとの差を描く。"
  },
  {
    no: "4",
    title: "変換の形 B と C（四辺形の外）",
    ids: ["layered_demo_gcp_b", "layered_demo_gcp_c"],
    note:
      "同じ画像に、描き手が外へ向けて縮めた形の 25 点（紙の中央 60%・周辺ほど縮尺が小さい。角で 1.8 倍の距離）を置く。" +
      "制御点の内側は B・C とも同じ。四辺形（橙）の外で、B は world file の格子を一様に延ばし、C は扇形に延びる。" +
      "紙の周辺〜紙の外で青い線がどう延びるかを比べる。"
  }
];

// ---- 座標（Web メルカトルと緯度経度）----
const R = 6378137;
const R_EARTH = 6371008.8;
const mercToLonLat = ([x, y]: Xy): LonLat => [
  ((x / R) * 180) / Math.PI,
  ((2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * 180) / Math.PI
];
const rad = (d: number) => (d * Math.PI) / 180;
const haversine = (a: LonLat, b: LonLat): number => {
  const dLat = rad(b[1] - a[1]), dLon = rad(b[0] - a[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(dLon / 2) ** 2;
  return 2 * R_EARTH * Math.asin(Math.sqrt(h));
};
const fmtDeg = (v: number) => v.toFixed(4);
const fmtLonLat = (p: LonLat) => `${fmtDeg(p[0])}, ${fmtDeg(p[1])}`;
const fmtM = (v: number) => `${Math.round(v).toLocaleString("ja-JP")} m`;

const $ = <T extends HTMLElement = HTMLElement>(id: string): T => document.getElementById(id) as T;
const status = $("status");

// ---- 地図 JSON（入力の表示用。Core が読むものと同じファイル）----
const JSONS: Record<string, any> = {};

interface Sampled {
  corners: LonLat[]; // 左上・右上・右下・左下
  grid: LonLat[]; // GRID×GRID（行優先）
  column: LonLat[]; // x=紙の中央の列（緯度ごとの図用）
}
const GRID = 33;
const sampled: Record<string, Sampled> = {};

async function sampleSource(source: any): Promise<Sampled> {
  const toLonLat = async (xy: Xy): Promise<LonLat> => mercToLonLat(await source.xy2MercAsync(xy));
  const cornerXy: Xy[] = [[0, 0], [PAPER, 0], [PAPER, PAPER], [0, PAPER]];
  const gridXy: Xy[] = [];
  for (let j = 0; j < GRID; j++) for (let i = 0; i < GRID; i++) gridXy.push([(PAPER * i) / (GRID - 1), (PAPER * j) / (GRID - 1)]);
  const columnXy: Xy[] = [];
  for (let j = 0; j <= 128; j++) columnXy.push([PAPER / 2, (PAPER * j) / 128]);
  const [corners, grid, column] = await Promise.all([
    Promise.all(cornerXy.map(toLonLat)),
    Promise.all(gridXy.map(toLonLat)),
    Promise.all(columnXy.map(toLonLat))
  ]);
  return { corners, grid, column };
}

// 2 つの地図が紙の同じ画素に出す地点の差の最大値（m）。inner の外側だけを見る指定ができる
function maxDiff(a: Sampled, b: Sampled, inner?: [number, number], outsideOnly = false): number {
  let max = 0;
  for (let j = 0; j < GRID; j++) {
    for (let i = 0; i < GRID; i++) {
      const x = (PAPER * i) / (GRID - 1), y = (PAPER * j) / (GRID - 1);
      if (outsideOnly && inner && x >= inner[0] && x <= inner[1] && y >= inner[0] && y <= inner[1]) continue;
      const k = j * GRID + i;
      max = Math.max(max, haversine(a.grid[k], b.grid[k]));
    }
  }
  return max;
}

// ---- 画面の組み立て ----
const groupButtons: { id: string; btn: HTMLButtonElement }[] = [];
function buildGroups(onSelect: (id: string) => void): void {
  const host = $("sec-groups");
  for (const g of GROUPS) {
    const sec = document.createElement("div");
    sec.className = "demo-sec";
    sec.style.borderTop = g.no === GROUPS[0].no ? "0" : "";
    const h = document.createElement("h2");
    h.textContent = `${g.no}. ${g.title}`;
    const row = document.createElement("div");
    row.className = "demo-row";
    for (const id of g.ids) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = MAPS[id].label;
      btn.dataset.map = id;
      btn.dataset.group = g.no;
      btn.addEventListener("click", () => onSelect(id));
      row.appendChild(btn);
      groupButtons.push({ id, btn });
    }
    const note = document.createElement("p");
    note.className = "demo-note";
    note.textContent = g.note;
    sec.append(h, row, note);
    host.appendChild(sec);
  }
  const legend = document.createElement("div");
  legend.className = "demo-legend";
  legend.innerHTML =
    '<span><i style="border-color:#c81e1e"></i>紙の経緯線（1 度ごと・5 度は太い）</span>' +
    '<span><i style="border-color:#1d4ed8"></i>基準の経緯線（5 度ごと）</span>' +
    '<span><i style="border-color:#15803d"></i>制御点</span>' +
    '<span><i style="border-color:#ea580c"></i>四辺形</span>';
  host.appendChild(legend);
}

function markActive(id: string): void {
  for (const { id: mid, btn } of groupButtons) btn.setAttribute("aria-pressed", String(mid === id));
}

function row(th: string, td: string, cls = ""): string {
  const esc = (s: string) => s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);
  return `<tr><th>${esc(th)}</th><td class="${cls}">${esc(td)}</td></tr>`;
}

const fmtWf = (wf: any) =>
  wf
    ? `xScale ${wf.xScale}\nxSkew ${wf.xSkew}\nxOrigin ${wf.xOrigin}\nySkew ${wf.ySkew}\nyScale ${wf.yScale}\nyOrigin ${wf.yOrigin}`
    : "（無い）";

// 三角網の制御点・四辺形の地理側を、緯度経度に直す（三角網の地理側は crs の座標。crs が無ければ 3857）
function geoToLonLat(json: any, p: number[]): LonLat {
  const epsg = json.crs?.epsg;
  return epsg === 4326 ? [p[0], p[1]] : mercToLonLat([p[0], p[1]]);
}

// 今の地図の「入力」を表にする。値は Core が読んで組んだ本図の変換（mapTransform の層 0）から取り、
// 地図 JSON は制御点などの表示と、鍵が JSON に書かれているかの確認に使う
function renderState(id: string, source: any): void {
  const json = JSONS[id];
  const compiled = json.compiled;
  const surface = source?.mapTransform?.getSurfaceTransform?.(0);
  const isWorldFileSurface = typeof surface?.xyToCrs === "function";
  const tinEnabled = json.tinEnabled;
  const crs = surface?.crs ?? json.crs;
  const worldFile = isWorldFileSurface ? surface.worldFile : undefined;
  const outer: string | undefined = isWorldFileSurface ? undefined : surface?.outerTransform;
  $("tbl-state").innerHTML =
    row("地図", `${MAPS[id].label}（${id}）`) +
    row("tinEnabled", tinEnabled === undefined ? "（鍵なし＝true・三角網）" : String(tinEnabled)) +
    row("crs", crs ? JSON.stringify(crs) : "（無い＝EPSG:3857）") +
    row("worldFile", isWorldFileSurface ? "あり（下に表示）" : compiled?.worldFile ? "compiled の中にあり（四辺形の外用。下に表示）" : "（無い）") +
    row("compiled の outerTransform", compiled ? `"${outer ?? "extrapolate"}"${compiled.outerTransform === undefined ? "（鍵なし＝扇形）" : ""}` : "（compiled なし＝三角網を持たない）") +
    row("Core が組んだ変換", isWorldFileSurface ? "world file の面（アフィン＋投影）" : "三角網の面");
  const detail = $("state-detail");
  detail.innerHTML = "";
  const add = (title: string, text: string) => {
    const p = document.createElement("p");
    p.className = "demo-note";
    p.textContent = title;
    const pre = document.createElement("pre");
    pre.className = "demo-pre";
    pre.textContent = text;
    detail.append(p, pre);
  };
  if (worldFile) add("worldFile（地図 JSON の最上位。左上画素の中心が原点）", fmtWf(worldFile));
  if (compiled) {
    if (compiled.worldFile) add("compiled.worldFile（四辺形の外に使う world file。GCP の最小二乗の相似）", fmtWf(compiled.worldFile));
    const pts: [number[], number[]][] = compiled.points;
    const lines = pts.map(([px, geo]) => {
      const ll = geoToLonLat(json, geo);
      return `(${Math.round(px[0])}, ${Math.round(px[1])}) → ${fmtLonLat(ll)}`;
    });
    add(`制御点 ${pts.length} 点（紙の画素 → 経度, 緯度）。三角網の地理側は ${crs ? "crs の座標" : "3857 の座標"}`, lines.join("\n"));
  }
}

// 出力の表: 紙の四隅の経緯度と、(a) との差の最大値
function renderOutput(id: string): void {
  const s = sampled[id];
  const names = ["左上", "右上", "右下", "左下"];
  $("tbl-corners").innerHTML =
    "<caption style='text-align:left;font-size:11px;color:#5a6478'>紙の四隅の経度, 緯度（Core が計算）</caption>" +
    names.map((n, i) => row(n, fmtLonLat(s.corners[i]), "num")).join("");
  const def = MAPS[id];
  const ref = sampled[REFERENCE];
  let rows = "<caption style='text-align:left;font-size:11px;color:#5a6478'>(a) との差の最大値（紙全体を 33×33 点で見る）</caption>";
  if (id === REFERENCE) {
    rows += row("紙全体", "0 m（基準）", "num");
  } else {
    rows += row("紙全体", fmtM(maxDiff(s, ref)), "num");
    if (def.inner) rows += row("制御点の外側（紙の内）", fmtM(maxDiff(s, ref, def.inner, true)), "num");
  }
  if (id === "layered_demo_gcp_b" || id === "layered_demo_gcp_c") {
    rows += row("B と C の差（制御点の外側）", fmtM(maxDiff(sampled.layered_demo_gcp_b, sampled.layered_demo_gcp_c, def.inner, true)), "num");
  }
  $("tbl-diff").innerHTML = rows;
}

// 2: (a) と (c) の差を緯度ごとに描く
function renderChart(): void {
  const a = sampled.layered_demo_wf4326, c = sampled.layered_demo_wf3857;
  const canvas = $<HTMLCanvasElement>("demo-chart");
  const ctx = canvas.getContext("2d")!;
  const W = canvas.width, H = canvas.height;
  const pad = { l: 44, r: 10, t: 12, b: 30 };
  ctx.clearRect(0, 0, W, H);
  // 北緯（(a) の値）を横軸、(c)−(a) の北向きの差（km）を縦軸に
  const pts = a.column.map((p, i) => ({ lat: p[1], d: ((rad(c.column[i][1]) - rad(p[1])) * R_EARTH) / 1000 }));
  const lat0 = 25, lat1 = 50;
  const dmax = Math.ceil(Math.max(...pts.map(p => Math.abs(p.d))) / 10) * 10;
  const X = (lat: number) => pad.l + ((lat - lat0) / (lat1 - lat0)) * (W - pad.l - pad.r);
  const Y = (d: number) => pad.t + ((dmax - d) / (2 * dmax)) * (H - pad.t - pad.b);
  ctx.font = "10px sans-serif";
  ctx.fillStyle = "#5a6478";
  ctx.strokeStyle = "#e3e6ee";
  ctx.lineWidth = 1;
  for (let lat = lat0; lat <= lat1; lat += 5) {
    ctx.beginPath(); ctx.moveTo(X(lat), pad.t); ctx.lineTo(X(lat), H - pad.b); ctx.stroke();
    ctx.textAlign = "center"; ctx.fillText(`${lat}°N`, X(lat), H - pad.b + 12);
  }
  for (const d of [-dmax, -dmax / 2, 0, dmax / 2, dmax]) {
    ctx.strokeStyle = d === 0 ? "#8a93a6" : "#e3e6ee";
    ctx.beginPath(); ctx.moveTo(pad.l, Y(d)); ctx.lineTo(W - pad.r, Y(d)); ctx.stroke();
    ctx.textAlign = "right"; ctx.fillText(`${d > 0 ? "+" : ""}${d} km`, pad.l - 4, Y(d) + 3);
  }
  ctx.strokeStyle = "#1d4ed8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  pts.forEach((p, i) => (i === 0 ? ctx.moveTo(X(p.lat), Y(p.d)) : ctx.lineTo(X(p.lat), Y(p.d))));
  ctx.stroke();
  // 重なる緯度（差の符号が変わる所）
  const cross: number[] = [];
  for (let i = 1; i < pts.length; i++) {
    if (pts[i - 1].d * pts[i].d < 0) {
      const t = pts[i - 1].d / (pts[i - 1].d - pts[i].d);
      cross.push(pts[i - 1].lat + t * (pts[i].lat - pts[i - 1].lat));
    }
  }
  ctx.fillStyle = "#c81e1e";
  for (const lat of cross) { ctx.beginPath(); ctx.arc(X(lat), Y(0), 3.5, 0, Math.PI * 2); ctx.fill(); }
  const mid = pts[Math.floor(pts.length / 2)].d, ends = [pts[0].d, pts[pts.length - 1].d];
  $("chart-summary").textContent =
    `重なる緯度（赤い点）: ${cross.map(v => `北緯 ${v.toFixed(2)} 度`).join("・")}。` +
    `中央（北緯 37.5 度）で ${mid >= 0 ? "+" : ""}${mid.toFixed(1)} km、南端で ${ends[1] >= 0 ? "+" : ""}${ends[1].toFixed(1)} km・北端で ${ends[0] >= 0 ? "+" : ""}${ends[0].toFixed(1)} km。`;
}

// ---- 基準の経緯線・制御点・四辺形（経緯度から描く。変換を通って紙の座標に落ちる）----
const range = (a: number, b: number, step: number): number[] => {
  const out: number[] = [];
  for (let v = a; v <= b + 1e-9; v += step) out.push(Math.round(v * 1e6) / 1e6);
  return out;
};

function redrawOverlays(app: MaplatApp, id: string): void {
  app.clearLine();
  if ($<HTMLInputElement>("chk-ref").checked) {
    const stroke = { color: "#1d4ed8", width: 2.5 };
    for (const lon of range(120, 155, 5)) app.addLine({ lnglats: range(20, 55, 0.5).map(lat => [lon, lat]), stroke });
    for (const lat of range(20, 55, 5)) app.addLine({ lnglats: range(120, 155, 0.5).map(lon => [lon, lat]), stroke });
  }
  const json = JSONS[id];
  if ($<HTMLInputElement>("chk-gcp").checked && json?.compiled) {
    const quad: number[][] | undefined = json.compiled.vertices_points?.map((v: number[][]) => v[1]);
    if (quad && quad.length >= 3) {
      const ring = quad.map(g => geoToLonLat(json, g));
      app.addVector({ type: "Polygon", lnglats: [[...ring, ring[0]]], style: { stroke: { color: "#ea580c", width: 3 }, fill: { color: "rgba(234, 88, 12, 0.06)" } } });
    }
    const h = 0.2; // 制御点の目印の半幅（度）
    for (const [, geo] of json.compiled.points as [number[], number[]][]) {
      const [lon, lat] = geoToLonLat(json, geo);
      app.addVector({
        type: "Polygon",
        lnglats: [[[lon - h, lat - h], [lon + h, lat - h], [lon + h, lat + h], [lon - h, lat + h], [lon - h, lat - h]]],
        style: { stroke: { color: "#15803d", width: 1.5 }, fill: { color: "rgba(34, 197, 94, 0.7)" } }
      });
    }
  }
}

// ---- 視点: 紙の全体・紙の外まで ----
function fitZoom(wide: boolean): number {
  const div = $("map_div");
  const w = div.clientWidth || 800, h = div.clientHeight || 600;
  const spanX = R * rad(25), spanY = 3.5e6; // 紙が覆う 3857 の幅と高さ（m）
  const z = Math.min(Math.log2((156543.03 * w * 0.9) / spanX), Math.log2((156543.03 * h * 0.9) / spanY));
  return wide ? z - 0.7 : z;
}
function setView(app: MaplatApp, wide: boolean): void {
  app.setViewpoint({ longitude: LON0 + 12.5, latitude: LAT1 - 12.5, mercZoom: fitZoom(wide), rotation: 0 });
}

async function main(): Promise<void> {
  const params = new URLSearchParams(location.search);
  const startId = MAPS[params.get("map") ?? ""] ? params.get("map")! : REFERENCE;
  if (params.get("ref") === "0") $<HTMLInputElement>("chk-ref").checked = false;
  if (params.get("gcp") === "0") $<HTMLInputElement>("chk-gcp").checked = false;

  await Promise.all(
    Object.keys(MAPS).map(async id => {
      JSONS[id] = await (await fetch(`maps/${id}.json`)).json();
    })
  );

  const app = new MaplatApp({
    appid: "layered-map-demo",
    div: "map_div",
    startFrom: startId,
    restore: { mapID: startId },
    restoreSession: false,
    setting: {
      homePosition: [LON0 + 12.5, LAT1 - 12.5],
      defaultZoom: 5,
      sources: ["gsi", "osm", ...Object.keys(MAPS).map(id => ({ mapID: id }))],
      pois: []
    }
  } as any);
  (window as any).__LAYERED_DEMO_APP__ = app;
  await app.waitReady;

  // 数値の出力は、読み込み済みの source の座標変換（xy2MercAsync）から求める
  for (const id of Object.keys(MAPS)) sampled[id] = await sampleSource(app.cacheHash[id]);

  const current = (): string => app.from?.mapID && MAPS[app.from.mapID] ? app.from.mapID : startId;
  const refresh = (): void => {
    const id = current();
    markActive(id);
    renderState(id, app.cacheHash[id]);
    renderOutput(id);
    redrawOverlays(app, id);
    status.textContent = `${MAPS[id].label}`;
  };
  buildGroups(id => {
    void app.changeMap(id).then(() => {
      setView(app, GROUPS.find(g => g.no === "4")!.ids.includes(id)); // B・C は紙の外まで見る
    }, e => { status.textContent = `切り替えに失敗: ${String(e)}`; });
  });
  app.addEventListener("mapChanged", refresh);
  $("chk-ref").addEventListener("change", refresh);
  $("chk-gcp").addEventListener("change", refresh);
  $("btn-view-paper").addEventListener("click", () => setView(app, false));
  $("btn-view-wide").addEventListener("click", () => setView(app, true));
  $<HTMLInputElement>("rng-transparency").addEventListener("input", e => app.setTransparency(Number((e.target as HTMLInputElement).value)));

  renderChart();
  refresh();
  setView(app, params.get("view") === "wide");
}

main().catch(e => {
  status.textContent = `起動に失敗: ${String(e)}`;
  console.error(e);
});
