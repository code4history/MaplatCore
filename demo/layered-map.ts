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
  /** wf: world file の地図 / fan: 三角網＋外側が扇形 / wfOuter: 三角網＋外側が world file */
  kind: "wf" | "fan" | "wfOuter";
}
const MAPS: Record<string, MapDef> = {
  layered_demo_wf4326: { id: "layered_demo_wf4326", short: "(a)", label: "(a) world file（EPSG:4326）", kind: "wf" },
  layered_demo_tin9: { id: "layered_demo_tin9", short: "(b)", label: "(b) 中央 30% の 9 点の三角網", inner: [PAPER * 0.35, PAPER * 0.65], kind: "fan" },
  layered_demo_wf3857: { id: "layered_demo_wf3857", short: "(c)", label: "(c) 3857 のアフィンで近似した world file", kind: "wf" },
  layered_demo_gcp_b: { id: "layered_demo_gcp_b", short: "B", label: "B: 四辺形の外は world file", inner: [PAPER * 0.2, PAPER * 0.8], kind: "wfOuter" },
  layered_demo_gcp_c: { id: "layered_demo_gcp_c", short: "C", label: "C: 四辺形の外は扇形", inner: [PAPER * 0.2, PAPER * 0.8], kind: "fan" }
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
      "同じ画像を、(a) は 4326 の world file だけで、(b) は紙の中央 30% にだけ置いた 9 点の GCP の三角網で読む。" +
      "(a) は紙の端まで赤い線に青い線が重なる。(b) は GCP の外が扇形の外挿になり、周辺ほど青が赤から外れる。" +
      "(b) では三角網の構造（GCP・四辺形・補助頂点・扇形）を紙の上に描く。"
  },
  {
    no: "2",
    title: "crs が効いていることの確認",
    ids: ["layered_demo_wf4326", "layered_demo_wf3857"],
    note:
      "同じ画像を、(a) 4326 の world file と、(c) それを 3857 のアフィンで近似した world file で読む。" +
      "(c) は緯度方向の伸びを 1 つの係数でしか表せないので、青が赤から緯度に応じてずれる" +
      "（重なる緯度が 2 本あり、中央と両端では逆向きにずれる）。紙の全体に散らした 16 組の対応点（紙の画素 ↔ 経度・緯度）を描く。" +
      "(a) は組の両側が一致し、(c) は最小二乗の残差として地理側（✕）が紙側（●）からずれる（線で結ぶ）。下の図に緯度ごとの差を描く。"
  },
  {
    no: "4",
    title: "変換の形 B と C（四辺形の外）",
    ids: ["layered_demo_gcp_b", "layered_demo_gcp_c"],
    note:
      "同じ画像に、描き手が外へ向けて縮めた形の 25 点（紙の中央 60%・周辺ほど縮尺が小さい。角で 1.8 倍の距離）を置く。" +
      "三角網は B・C とも同じ（GCP の三角形・四辺形の外周と補助頂点・補助頂点の三角形）。" +
      "四辺形の外で、B は world file の格子を一様に延ばし（灰青の面）、C は扇形に延びる（紫の放射線と交互の塗り）。" +
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
  legend.id = "demo-legend";
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

// ---- 対応点（紙の画素 ↔ 経度・緯度の組）----
// 地図 JSON の対応点: 三角網の地図は compiled.points、world file の地図は gcps（変換には使わない記録）
const gcpsOf = (json: any): [Xy, number[]][] => json?.compiled?.points ?? json?.gcps ?? [];
const lonLatToMerc = ([lon, lat]: LonLat): Xy => [
  R * rad(lon),
  R * Math.log(Math.tan(Math.PI / 4 + rad(lat) / 2))
];

interface Pair {
  index: number;
  px: Xy; // 紙の画素（記録）
  geo: LonLat; // 地理側の経度・緯度（記録）
  fwd: LonLat; // 今の地図が紙の画素 px を写す先（順変換）
  inv: Xy; // 今の地図が geo を落とす紙の画素（逆変換）
  dPx: number; // 両側のずれ（紙の画素）
  dM: number; // 両側のずれ（地上の m。fwd と geo の距離）
}
const pairs: Record<string, Pair[]> = {};

async function computePairs(id: string, source: any): Promise<Pair[]> {
  const json = JSONS[id];
  return Promise.all(
    gcpsOf(json).map(async ([px, g], index) => {
      const geo = geoToLonLat(json, g);
      const fwd = mercToLonLat(await source.xy2MercAsync(px));
      const inv: Xy = await source.merc2XyAsync(lonLatToMerc(geo));
      return { index, px: [px[0], px[1]] as Xy, geo, fwd, inv, dPx: Math.hypot(inv[0] - px[0], inv[1] - px[1]), dM: haversine(fwd, geo) };
    })
  );
}

// ---- 三角網の構造（紙側＝画素の座標）----
interface Structure {
  gcp: Xy[];
  aux: Xy[]; // 補助頂点（四辺形の外周の点。b0, b1, …の順）
  tris: { v: Xy[]; gcpOnly: boolean }[];
  centroid?: Xy;
}
function structureOf(json: any): Structure | undefined {
  const c = json?.compiled;
  if (!c) return undefined;
  const gcp: Xy[] = c.points.map((p: any) => p[0]);
  const aux: Xy[] = c.vertices_points.map((v: any) => v[0]);
  const at = (i: number | string): Xy => (typeof i === "number" ? gcp[i] : aux[Number(String(i).slice(1))]);
  const tris = ((c.tins_points?.[0] ?? []) as (number | string)[][]).map(t => ({
    v: t.map(at),
    gcpOnly: t.every(i => typeof i === "number")
  }));
  return { gcp, aux, tris, centroid: c.centroid_point?.[0] };
}

// ---- 色（凡例と同じ）----
const COLOR = { gcp: "#15803d", geo: "#be185d", aux: "#ea580c", fan: "#7c3aed", outer: "#475569", gap: "#111827" };

// ---- 点の印: 画面の画素で大きさが決まる SVG のアイコン（Core の POI の icon）。地図の座標の面ではない ----
type MarkKind = "gcp" | "geo" | "aux" | "centroid";
function markSvg(kind: MarkKind, selected: boolean): string {
  const s = selected ? 30 : 20, c = s / 2;
  const halo = selected ? `<circle cx="${c}" cy="${c}" r="${c - 1.5}" fill="rgba(250,204,21,0.45)" stroke="#eab308" stroke-width="2"/>` : "";
  let body = "";
  if (kind === "gcp") body = `<circle cx="${c}" cy="${c}" r="5.5" fill="${COLOR.gcp}" stroke="#fff" stroke-width="2"/>`;
  else if (kind === "geo") {
    const d = `M${c - 5} ${c - 5}L${c + 5} ${c + 5}M${c + 5} ${c - 5}L${c - 5} ${c + 5}`;
    body = `<path d="${d}" stroke="#fff" stroke-width="5.5" stroke-linecap="round"/><path d="${d}" stroke="${COLOR.geo}" stroke-width="2.6" stroke-linecap="round"/>`;
  } else if (kind === "aux") body = `<path d="M${c} ${c - 6.5}L${c + 6.5} ${c}L${c} ${c + 6.5}L${c - 6.5} ${c}Z" fill="${COLOR.aux}" stroke="#fff" stroke-width="1.8"/>`;
  else body = `<circle cx="${c}" cy="${c}" r="5.5" fill="#fff" stroke="${COLOR.fan}" stroke-width="2.6"/><circle cx="${c}" cy="${c}" r="1.6" fill="${COLOR.fan}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">${halo}${body}</svg>`;
}
const svgUri = (svg: string) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
const markIcon = (kind: MarkKind, selected: boolean) => ({ src: svgUri(markSvg(kind, selected)), anchor: [0.5, 0.5] });

// 選んでいる印（クリックで変わる）
interface Selection { kind: "gcp" | "aux" | "centroid"; index: number }
let selection: Selection | undefined;

const FAR = 7000; // 扇形を延ばす距離（紙の画素）。表示の範囲より十分に遠い

function redrawOverlays(app: MaplatApp, id: string): void {
  app.clearLine();
  app.clearMarker("main");
  const json = JSONS[id];
  const source = app.cacheHash[id] as any;
  const mo = (app as any).mapObject;
  if (!json || !source || !mo) return;
  const sys = (xy: Xy) => source.xy2SysCoord(xy);
  // 紙の画素のまま置く（変換を通さない）。線・面は Core の mapObject.setVector、点は POI の x, y（紙の画素）
  const poly = (rings: Xy[][], fill: string | undefined, stroke: { color: string; width: number; lineDash?: number[] } | undefined) =>
    mo.setVector(rings.map(r => [...r, r[0]].map(sys)), "Polygon", { stroke, fill: fill ? { color: fill } : undefined });
  const line = (pts: Xy[], stroke: { color: string; width: number; lineDash?: number[] }) => mo.setVector(pts.map(sys), "Line", { stroke });

  const showStructure = $<HTMLInputElement>("chk-gcp").checked;
  const def = MAPS[id];
  const st = structureOf(json);

  // (3) 四辺形の外側（先に描く＝下に置く）
  if (showStructure && st) {
    if (def.kind === "fan" && st.centroid) {
      const c = st.centroid;
      const far = (v: Xy): Xy => {
        const d = Math.hypot(v[0] - c[0], v[1] - c[1]) || 1;
        return [c[0] + ((v[0] - c[0]) / d) * FAR, c[1] + ((v[1] - c[1]) / d) * FAR];
      };
      const n = st.aux.length;
      for (let i = 0; i < n; i++) {
        const a = st.aux[i], b = st.aux[(i + 1) % n];
        poly([[a, far(a), far(b), b]], i % 2 === 0 ? "rgba(124, 58, 237, 0.10)" : "rgba(124, 58, 237, 0.22)", undefined);
      }
    } else if (def.kind === "wfOuter") {
      const L = -4000, H = 6000;
      mo.setVector(
        [[[L, L], [H, L], [H, H], [L, H], [L, L]].map(p => sys(p as Xy)), [...st.aux, st.aux[0]].map(sys)],
        "Polygon",
        { fill: { color: "rgba(71, 85, 105, 0.30)" } }
      );
    }
  }

  if ($<HTMLInputElement>("chk-ref").checked) {
    const stroke = { color: "#1d4ed8", width: 2.5 };
    for (const lon of range(120, 155, 5)) app.addLine({ lnglats: range(20, 55, 0.5).map(lat => [lon, lat]), stroke });
    for (const lat of range(20, 55, 5)) app.addLine({ lnglats: range(120, 155, 0.5).map(lon => [lon, lat]), stroke });
  }

  if (!showStructure) return;

  if (st) {
    // (2) 補助頂点を含む三角形（三角網の拡張範囲）→ (1) GCP だけの三角形 の順（GCP の三角網を上に）
    for (const t of st.tris.filter(t => !t.gcpOnly)) poly([t.v], "rgba(234, 88, 12, 0.07)", { color: "rgba(234, 88, 12, 0.85)", width: 1.2 });
    for (const t of st.tris.filter(t => t.gcpOnly)) poly([t.v], "rgba(21, 128, 61, 0.14)", { color: COLOR.gcp, width: 2 });
    // 四辺形（補助頂点の輪）は太線
    poly([st.aux], undefined, { color: COLOR.aux, width: 4 });
    // (3) 扇形の放射線: 重心から各補助頂点へ（四辺形の内は細い破線、外は実線で紙の外まで）
    if (def.kind === "fan" && st.centroid) {
      const c = st.centroid;
      for (const a of st.aux) {
        const d = Math.hypot(a[0] - c[0], a[1] - c[1]) || 1;
        line([c, a], { color: "rgba(124, 58, 237, 0.55)", width: 1, lineDash: [5, 5] });
        line([a, [c[0] + ((a[0] - c[0]) / d) * FAR, c[1] + ((a[1] - c[1]) / d) * FAR]], { color: COLOR.fan, width: 1.6 });
      }
    }
  }

  // 対応点の組: 紙側と地理側が一致しない所を線で結ぶ
  const ps = pairs[id] ?? [];
  const wf = def.kind === "wf";
  if (wf) {
    for (const p of ps) {
      if (p.dPx < 0.5) continue;
      line([p.px, p.inv], { color: "#fff", width: 7 });
      line([p.px, p.inv], { color: COLOR.gap, width: 3.5 });
    }
  }

  // 点の印（POI）。選んでいる組・補助頂点は大きく黄色の輪をつける
  const put = (data: Record<string, unknown>, kind: MarkKind, selected: boolean) =>
    app.addMarker({ ...data, icon: markIcon(kind, selected) }, "main");
  const isSel = (k: Selection["kind"], i: number) => selection?.kind === k && selection.index === i;
  if (st) {
    st.aux.forEach((a, i) => put({ id: `aux_${i}`, name: `補助頂点 b${i}`, x: a[0], y: a[1], demoKind: "aux", demoIndex: i }, "aux", isSel("aux", i)));
    if (def.kind === "fan" && st.centroid) {
      put({ id: "centroid", name: "重心", x: st.centroid[0], y: st.centroid[1], demoKind: "centroid", demoIndex: 0 }, "centroid", isSel("centroid", 0));
    }
  }
  for (const p of ps) {
    const s = isSel("gcp", p.index);
    if (wf) put({ id: `geo_${p.index}`, name: `地理側 #${p.index + 1}`, lnglat: p.geo, demoKind: "gcp", demoIndex: p.index }, "geo", s);
    put({ id: `gcp_${p.index}`, name: `GCP #${p.index + 1}`, x: p.px[0], y: p.px[1], demoKind: "gcp", demoIndex: p.index }, "gcp", s);
  }
}

// 対応点の両側のずれの最大（凡例に書く。小さいときは拡大して見る）
function gapSummary(id: string): string {
  const ps = pairs[id] ?? [];
  const dPx = Math.max(0, ...ps.map(p => p.dPx)), dM = Math.max(0, ...ps.map(p => p.dM));
  return dM < 0.5 ? "この地図は全組で一致" : `この地図の最大: ${dPx.toFixed(0)} 画素・${(dM / 1000).toFixed(1)} km。画面で小さければ拡大して見る`;
}

// 凡例（今の地図に出るものだけ）
function renderLegend(id: string): void {
  const def = MAPS[id];
  const sw = (css: string) => `<i style="${css}"></i>`;
  const box = (fill: string, border: string) => `<b class="sw" style="background:${fill};border-color:${border}"></b>`;
  const mark = (k: MarkKind) => `<span class="mk">${markSvg(k, false)}</span>`;
  const items: string[] = [
    `<span>${sw("border-color:#c81e1e")}紙の経緯線（1 度ごと・5 度は太い）</span>`,
    `<span>${sw("border-color:#1d4ed8")}基準の経緯線（5 度ごと）</span>`
  ];
  if (def.kind === "wf") {
    items.push(
      `<span>${mark("gcp")}対応点（紙の画素 ↔ 経度・緯度の組）の紙側（紙の画素の位置）</span>`,
      `<span>${mark("geo")}同じ組の地理側（経度・緯度を、この地図の変換で紙に落とした位置）</span>`,
      `<span>${sw("border-color:" + COLOR.gap)}両側のずれ（一致する所は線なし。${gapSummary(id)}）</span>`
    );
  } else {
    items.push(
      `<span>${box("rgba(21,128,61,0.14)", COLOR.gcp)}(1) GCP の三角網（頂点がすべて GCP の三角形）</span>`,
      `<span>${mark("gcp")}GCP（紙側。三角網は GCP をちょうど通るので、地理側の点も同じ位置に重なる）</span>`,
      `<span>${sw("border-color:" + COLOR.aux + ";border-top-width:4px")}(2) 四辺形（補助頂点の外周）</span>`,
      `<span>${mark("aux")}補助頂点</span>`,
      `<span>${box("rgba(234,88,12,0.07)", COLOR.aux)}補助頂点を含む三角形（三角網の拡張範囲）</span>`
    );
    if (def.kind === "fan") {
      items.push(
        `<span>${box("rgba(124,58,237,0.22)", COLOR.fan)}(3) 扇形（四辺形の外の外挿）。重心からの放射線で区切り、交互に塗る</span>`,
        `<span>${mark("centroid")}扇形の重心</span>`
      );
    } else {
      items.push(`<span>${box("rgba(71,85,105,0.30)", COLOR.outer)}四辺形の外は一様な world file（扇形は無い）</span>`);
    }
  }
  $("demo-legend").innerHTML = items.join("");
}

// 選んでいる印の値
function renderSelection(id: string): void {
  const el = $("tbl-sel");
  const json = JSONS[id];
  const fx = (v: number) => v.toFixed(1);
  const rows: string[] = [];
  if (!selection) {
    el.innerHTML = row("（未選択）", "地図の印（●・✕・◆）をクリックすると、その値が出ます");
    return;
  }
  if (selection.kind === "gcp") {
    const p = pairs[id]?.[selection.index];
    if (!p) { el.innerHTML = row("（無い）", ""); return; }
    rows.push(
      row("対応点", `#${p.index + 1}（紙の画素 ↔ 経度・緯度の組）`),
      row("紙の画素", `(${fx(p.px[0])}, ${fx(p.px[1])})`, "num"),
      row("経度・緯度（地理側）", fmtLonLat(p.geo), "num"),
      row("この地図が紙の画素を写す先", fmtLonLat(p.fwd), "num"),
      row("地理側が落ちる紙の画素", `(${fx(p.inv[0])}, ${fx(p.inv[1])})`, "num"),
      row("両側のずれ（紙の画素）", `${p.dPx.toFixed(2)} 画素`, "num"),
      row("両側のずれ（地上）", p.dM < 0.5 ? `${p.dM.toFixed(3)} m（一致）` : fmtM(p.dM), "num")
    );
  } else if (selection.kind === "aux") {
    const v = json.compiled.vertices_points[selection.index];
    rows.push(
      row("補助頂点", `b${selection.index}（四辺形の外周の点）`),
      row("紙の画素", `(${fx(v[0][0])}, ${fx(v[0][1])})`, "num"),
      row("地理側", fmtLonLat(geoToLonLat(json, v[1])), "num")
    );
  } else {
    const c = json.compiled.centroid_point[0];
    rows.push(row("扇形の重心", "放射線の中心"), row("紙の画素", `(${fx(c[0])}, ${fx(c[1])})`, "num"));
  }
  el.innerHTML = rows.join("");
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
  for (const id of Object.keys(MAPS)) {
    sampled[id] = await sampleSource(app.cacheHash[id]);
    pairs[id] = await computePairs(id, app.cacheHash[id]);
  }

  const current = (): string => app.from?.mapID && MAPS[app.from.mapID] ? app.from.mapID : startId;
  const refresh = (): void => {
    const id = current();
    markActive(id);
    renderState(id, app.cacheHash[id]);
    renderOutput(id);
    renderLegend(id);
    renderSelection(id);
    redrawOverlays(app, id);
    status.textContent = `${MAPS[id].label}`;
  };
  buildGroups(id => {
    void app.changeMap(id).then(() => {
      setView(app, GROUPS.find(g => g.no === "4")!.ids.includes(id)); // B・C は紙の外まで見る
    }, e => { status.textContent = `切り替えに失敗: ${String(e)}`; });
  });
  app.addEventListener("mapChanged", () => {
    selection = undefined; // 別の地図では組の位置もずれも違うので、選びなおす
    refresh();
  });
  // 印をクリックすると、その組（または補助頂点）を選ぶ
  app.addEventListener("clickMarker", evt => {
    const d = (evt as unknown as { detail?: { demoKind?: Selection["kind"]; demoIndex?: number } }).detail;
    if (!d?.demoKind || d.demoIndex === undefined) return;
    selection = { kind: d.demoKind, index: d.demoIndex };
    refresh();
  });
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
