/// <reference types="vite/client" />
// demo/layered-map.ts: 変換の形（CRS・三角網＋大域外挿・三角網＋扇形外挿・従来型）のデモ。layered-map.html の操作。
// 設計書: 2026-11-26-jan27-layered-map-demo-redesign.md。人間が「要望どおりか」を画面で見るためのもの（関門ではない）。
//
// 1 つのデモは 1 つの比較だけ（2 つの型の切り替え）。見せ方の文法（色・太さ・線種）は demo/layered-map/grammar.ts だけから取る。
// 素材（紙・GCP・地図 JSON・meta）は demo/layered-map/generate.mjs が作る。座標や閾値は画面のコードに書かず meta から読む。
//   紙の面 …… この画面の SVG。紙の画素のまま描く
//   3857 の面 …… Core の MaplatApp（背景＝地理院）。青い帯は経緯度の線（addLine の lnglats）、赤い芯と原理は紙の画素を
//               @maplat/transform の MapTransform で 3857 へ変換して addLine の coordinates で描く（Core の公開 API に
//               「紙の画素 → 3857」の口が無いため。変換が Core と同じ値を返すことは試験で固定している）
// 背景の地理院タイル以外はネットワークに出ない（海岸線・proj4 は同梱）。
import proj4 from "proj4";
import type { Proj4Factory } from "@maplat/transform";
import type { MapTransform } from "@maplat/transform";
import { MaplatApp } from "../src/index.ts";
import { buildMapTransform, lonlat2merc } from "./layered-map/engine";
import type { DemoMapJson } from "./layered-map/engine";
import {
  COLOR, DASH, MARK, OPACITY, WIDTH,
  bandStroke, casingStroke, coreStroke, principleStroke, rgba
} from "./layered-map/grammar";

type P = number[];
type Line = P[];

// ---- meta（generate.mjs が書く）----
interface Stat { maxKm: number; rmsKm: number; maxScreenPx: number; n: number }
type PaperKey = "p1" | "p2" | "p3";
type GcpKey = "g1" | "g1c" | "g2" | "g3";
interface Gcp { no: number; lonlat: P; pixel: P; region: string; dense: boolean; blunder?: { sizePx: number } }
interface Principle {
  kind: "none" | "worldFile" | "fan";
  aux?: P[];
  ring?: number[];
  centroid?: P | null;
  gcpTris?: number[][];
  extTris?: (number | string)[][];
}
interface MapMeta {
  type: string;
  paper: PaperKey;
  gcps: GcpKey;
  principle: Principle;
  stats: { inner: Stat; innerLand: Stat; outer: Stat; gcpMaxKm: number; gcpMaxScreenPx: number };
  gcpResidual: { km: number; screenPx: number }[];
}
interface Teiresias { score: number | null; setups: string[]; reason: string }
interface DemoMeta { paper: PaperKey; gcps: GcpKey; types: string[]; maps: Record<string, string>; teiresias: Teiresias }
interface View { lonlat: P; zoomDelta?: number; label?: string }
interface Meta {
  paper: { size: number };
  screenRef: { widthPx: number; margin: number; mercPerPx: Record<string, number> };
  gcps: Record<string, Gcp[]>;
  gcpSets: Record<string, { label: string; teiresias: Teiresias }>;
  maps: Record<string, MapMeta>;
  demos: Record<string, DemoMeta>;
  views: {
    p1: { whole: { lonlat: P; spanMerc: P }; outer: View };
    p2: { whole: { lonlat: P; spanMerc: P }; outer: View };
    p3: { whole: { lonlat: P; spanMerc: P }; outer: View };
    blunders: { no: number; lonlat: P; zoomDelta: number }[];
  };
}
interface PaperLines { size: number; coast: Line[]; grid: Line[] }
interface TrueLines { p1: { coast: Line[]; grid: Line[] }; p2: { coast: Line[]; grid: Line[] }; p3: { coast: Line[]; grid: Line[] } }

// ---- 画面の文言（設計書 §6.3・§6.2）。型の呼び名は、地図 JSON の鍵（a・b・c・d）とは別に、ここだけで決める ----
const TYPE_NAME: Record<string, string> = { a: "CRS", b: "三角網＋大域外挿", c: "三角網＋扇形外挿", d: "従来型" };
const typeName = (t: string): string => TYPE_NAME[t] ?? t;
const HINTS: Record<string, string> = {
  "1": "CRS では、赤い線が紙の端まで青い帯の中に収まる。三角網＋扇形外挿に切り替えると、打ち間違いの GCP 2 つの周りで、赤い線が帯からはみ出す。GCP の外にある紙の隅では、はみ出しがさらに大きくなる。",
  "2": "従来型では、GCP の外にある北海道の東・沖縄・大陸で、赤い線が大きく曲がって青い帯からはみ出す。三角網＋扇形外挿に切り替えると、曲がりが消える。紙の隅に残るずれは、GCP の 3 画素の誤差が外へ延びて大きくなったもの。",
  "3": "GCP の赤い丸と青い輪を見る。CRS では、赤い丸が輪からずれたまま残る。三角網＋大域外挿に切り替えると、赤い丸がどれも輪の中に入り、GCP のある陸の海岸線が帯に乗る。GCP の無い海の上は直らない。",
  "4": "破線の四辺形の内側は、切り替えても変わらない。この図は地方ごとに歪んでいるが、全体は 1 つの縮尺に乗っている。外側では、三角網＋大域外挿の赤い線が帯に乗り、三角網＋扇形外挿は外れる。",
  "5": "破線の四辺形の内側は、切り替えても変わらない。この図は GCP の重心を中心に大きく描いてある。外側では、三角網＋扇形外挿の赤い線が帯に近く、三角網＋大域外挿は縮尺が合わずに外れる。"
};
// デモの選択のボタンは番号だけにし、2 つの型の呼び名は説明文の段の左に出す（5 つ並べると 1280 画素に収まらない）
const DEMO_PAIR: Record<string, string> = {
  "1": "CRS と 三角網＋扇形外挿",
  "2": "従来型 と 三角網＋扇形外挿",
  "3": "CRS と 三角網＋大域外挿",
  "4": "三角網＋大域外挿 と 三角網＋扇形外挿",
  "5": "三角網＋大域外挿 と 三角網＋扇形外挿"
};
const TYPE_NOTE: Record<string, string> = {
  a: "CRS は、地図を CRS として読んで、6 つの係数だけで紙の全体を写し、三角網は使わない。",
  b: "三角網＋大域外挿は、CRS の上に GCP の三角網を張り、四辺形の外は地図全体に当てはめた world file で延ばす。",
  c: "三角網＋扇形外挿は、CRS の上に GCP の三角網を張り、四辺形の外は縁の GCP の傾向を扇形に延ばす。",
  d: "従来型（3857＋三角網＋扇形外挿。V2）は、投影を 3857 に決め打ちして、紙の四隅の 4 つの補助頂点を足した三角網で、投影の違いを吸収する。"
};
const SETUP_TYPE: Record<string, string> = { worldFileOnly: TYPE_NAME.a, tinGlobal: TYPE_NAME.b, tinFan: TYPE_NAME.c };
const statusText = (): string => `デモ ${demoNo}・${typeName(typeKey)}`;
const REGION_FAR = 0.3; // 紙の縁の外の余白（紙の幅に対する割合）

const $ = <T extends HTMLElement = HTMLElement>(id: string): T => document.getElementById(id) as T;
const statusEl = $("status");
const tick = (): Promise<void> => new Promise(r => setTimeout(r, 0));
const fmt = (v: number, d = 1): string => (v >= 100 ? v.toFixed(0) : v.toFixed(d));

// ---- 読み込んだもの ----
let meta: Meta;
let trueLines: TrueLines;
const paperLines: Record<string, PaperLines> = {};
const mapJson: Record<string, DemoMapJson> = {};
const transforms: Record<string, MapTransform> = {};
let app: MaplatApp;

// ---- 状態 ----
let demoNo = "1";
let typeKey = "a";
const show = { terrain: true, grid: true, mech: true, bg: true };
let selected: number | undefined; // 選んでいる GCP の番号
let blunderCursor = 0;
let openPaper = false;

const demo = (): DemoMeta => meta.demos[demoNo];
const mapId = (t = typeKey): string => demo().maps[t];
const gcpList = (): Gcp[] => meta.gcps[demo().gcps];
const transformOf = (id: string): MapTransform => (transforms[id] ??= buildMapTransform(mapJson[id], proj4 as unknown as Proj4Factory));

// ---------------------------------------------------------------------------------------------
// 原理（紙の画素）。generate.mjs が meta に書いた構造から、線と印を作る
// ---------------------------------------------------------------------------------------------
interface Geom { fan: Line[]; ext: Line[]; quad: Line[]; tin: Line[]; aux: P[]; centroid: P | null; kind: Principle["kind"] }
const geomCache: Record<string, Geom> = {};
function geomOf(id: string): Geom {
  if (geomCache[id]) return geomCache[id];
  const pr = meta.maps[id].principle;
  const gcps = meta.gcps[meta.maps[id].gcps];
  const g: Geom = { fan: [], ext: [], quad: [], tin: [], aux: [], centroid: null, kind: pr.kind };
  if (pr.kind !== "none" && pr.aux && pr.ring && pr.gcpTris && pr.extTris) {
    const pos = (v: number | string): P => (typeof v === "number" ? gcps[v].pixel : pr.aux![Number(String(v).slice(1))]);
    const seen = new Set<string>();
    const edges = (tris: (number | string)[][], into: Line[]): void => {
      for (const t of tris) {
        for (let i = 0; i < 3; i++) {
          const a = t[i], b = t[(i + 1) % 3];
          const key = [String(a), String(b)].sort().join("|");
          if (seen.has(key)) continue;
          seen.add(key);
          into.push([pos(a), pos(b)]);
        }
      }
    };
    edges(pr.gcpTris, g.tin);
    edges(pr.extTris, g.ext);
    g.aux = pr.aux;
    g.quad = [[...pr.ring.map(i => pr.aux![i]), pr.aux[pr.ring[0]]]];
    if (pr.kind === "fan" && pr.centroid) {
      g.centroid = pr.centroid;
      const W = meta.paper.size, lo = -REGION_FAR * W, hi = (1 + REGION_FAR) * W;
      for (const a of pr.aux) {
        const dx = a[0] - pr.centroid[0], dy = a[1] - pr.centroid[1];
        // 補助頂点から外へ、余白の縁まで
        let t = Infinity;
        if (dx > 0) t = Math.min(t, (hi - a[0]) / dx); else if (dx < 0) t = Math.min(t, (lo - a[0]) / dx);
        if (dy > 0) t = Math.min(t, (hi - a[1]) / dy); else if (dy < 0) t = Math.min(t, (lo - a[1]) / dy);
        if (Number.isFinite(t) && t > 0) g.fan.push([a, [a[0] + dx * t, a[1] + dy * t]]);
      }
    }
  }
  geomCache[id] = g;
  return g;
}

// ---------------------------------------------------------------------------------------------
// 紙の面（SVG）
// ---------------------------------------------------------------------------------------------
const NS = "http://www.w3.org/2000/svg";
const dOf = (lines: Line[]): string => lines.map(l => "M" + l.map(p => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("L")).join("");
const NSC = 'fill="none" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"';

function renderPaperFace(): void {
  const svg = $<HTMLElement>("paper-svg") as unknown as SVGSVGElement;
  const W = meta.paper.size;
  const lo = -REGION_FAR * W, size = (1 + 2 * REGION_FAR) * W;
  svg.setAttribute("viewBox", `${lo} ${lo} ${size} ${size}`);
  const rect = svg.getBoundingClientRect();
  const k = Math.min(rect.width, rect.height) / size || 0.2; // 画面の画素 / 紙の画素
  const u = (px: number): number => px / k;
  const id = mapId();
  const g = geomOf(id);
  const pl = paperLines[demo().paper];
  let h = `<rect x="${lo}" y="${lo}" width="${size}" height="${size}" fill="#eef0f4"/><rect x="0" y="0" width="${W}" height="${W}" fill="#fff"/>`;
  // 紙のもの（赤い芯）
  if (show.grid) h += `<path d="${dOf(pl.grid)}" ${NSC} stroke="${COLOR.red}" stroke-width="${WIDTH.grid.core}"/>`;
  if (show.terrain) h += `<path d="${dOf(pl.coast)}" ${NSC} stroke="${COLOR.red}" stroke-width="${WIDTH.terrain.core}"/>`;
  h += `<rect x="0" y="0" width="${W}" height="${W}" ${NSC} stroke="${COLOR.red}" stroke-width="${WIDTH.grid.core}"/>`;
  // 原理（黒。白い縁取りの上に細い線）
  if (show.mech) {
    const principle = (lines: Line[], dash: readonly number[]): string => {
      if (!lines.length) return "";
      const d = dOf(lines);
      return `<path d="${d}" ${NSC} stroke="${rgba(COLOR.white, OPACITY.casing)}" stroke-width="${WIDTH.casing}"/>` +
        `<path d="${d}" ${NSC} stroke="${COLOR.black}" stroke-width="${WIDTH.principle}" stroke-dasharray="${dash.join(" ")}"/>`;
    };
    h += principle(g.fan, DASH.fan) + principle(g.ext, DASH.extended) + principle(g.quad, DASH.quad) + principle(g.tin, DASH.tin);
    for (const a of g.aux) {
      const s = u(MARK.aux);
      h += `<rect x="${a[0] - s / 2}" y="${a[1] - s / 2}" width="${s}" height="${s}" fill="#fff" stroke="${COLOR.black}" stroke-width="${WIDTH.principle}" vector-effect="non-scaling-stroke"/>`;
    }
    if (g.centroid) {
      const s = u(MARK.centroid) / 2, c = g.centroid;
      h += `<path d="M${c[0] - s} ${c[1]}L${c[0] + s} ${c[1]}M${c[0]} ${c[1] - s}L${c[0]} ${c[1] + s}" ${NSC} stroke="${COLOR.black}" stroke-width="${WIDTH.principle}"/>`;
    }
    h += regionLabels(g, u);
  }
  // GCP の紙の側（塗りの丸＋番号）
  for (const q of gcpList()) {
    const sel = q.no === selected;
    const r = (u(MARK.gcpPaper) / 2) * (sel ? MARK.selectScale : 1);
    if (sel) h += `<circle cx="${q.pixel[0]}" cy="${q.pixel[1]}" r="${u(MARK.gcpGeo) * 0.75 * MARK.selectScale}" fill="none" stroke="${COLOR.select}" stroke-width="3" vector-effect="non-scaling-stroke"/>`;
    h += `<circle cx="${q.pixel[0]}" cy="${q.pixel[1]}" r="${r}" fill="${COLOR.red}"/>`;
    h += `<text x="${q.pixel[0] + u(6)}" y="${q.pixel[1] - u(5)}" font-size="${u(11)}" font-weight="700">${q.no}${q.blunder ? " 打ち間違い" : ""}</text>`;
    h += `<circle data-gcp="${q.no}" cx="${q.pixel[0]}" cy="${q.pixel[1]}" r="${u(10)}" fill="transparent" style="cursor:pointer"/>`;
  }
  svg.innerHTML = h;
  svg.querySelectorAll<SVGElement>("[data-gcp]").forEach(el => {
    el.addEventListener("click", () => selectGcp(Number(el.dataset.gcp)));
  });
}

// 領域の名前は、紙の面の図の上に直接書く（設計書 §4.2）
function regionLabels(g: Geom, u: (px: number) => number): string {
  if (g.kind === "none") return "";
  const W = meta.paper.size;
  const text = (s: string, x: number, y: number): string =>
    `<text x="${x}" y="${y}" font-size="${u(11)}" font-weight="700" text-anchor="middle">${s}</text>`;
  const gcps = gcpList().map(q => q.pixel);
  const cx = gcps.reduce((a, p) => a + p[0], 0) / gcps.length;
  const hullTop = Math.min(...gcps.map(p => p[1]));
  const auxTop = Math.min(...g.aux.map(a => a[1]));
  const auxBottom = Math.max(...g.aux.map(a => a[1]));
  const auxRight = Math.max(...g.aux.map(a => a[0]));
  let h = text("GCP の三角網", cx, gcps.reduce((a, p) => a + p[1], 0) / gcps.length);
  h += text("拡張範囲", cx, (hullTop + auxTop) / 2);
  const outer = g.kind === "worldFile" ? "大域外挿" : "扇形外挿";
  const y = Math.min(auxBottom + 0.06 * W, (1 + REGION_FAR) * W - u(12));
  h += text(outer, cx, y);
  if (auxRight + 0.1 * W < (1 + REGION_FAR) * W) h += text(outer, Math.min(auxRight + 0.12 * W, (1 + REGION_FAR) * W - 0.06 * W), W / 2);
  return h;
}

// ---------------------------------------------------------------------------------------------
// 3857 の面（Core）
// ---------------------------------------------------------------------------------------------
const groups: Record<string, string[]> = {};
const clearGroup = (name: string): void => {
  for (const id of groups[name] ?? []) app.removeVector(id);
  groups[name] = [];
};
const addLine = (group: string, coordinates: P[], stroke: object): void => {
  if (coordinates.length < 2) return;
  (groups[group] ??= []).push(app.addLine({ coordinates, stroke }));
};
let runToken = 0;

const toMerc = (T: MapTransform, line: Line): P[] => {
  const out: P[] = [];
  for (const p of line) {
    const m = T.xy2Merc(p);
    if (m) out.push(m);
  }
  return out;
};
// 曲がる線（紙の画素では直線でも、lcc → 3857 を通ると曲がる）は 16 分割して変換する
const subdivide = (line: Line, n = 16): Line => {
  const out: Line = [];
  for (let i = 0; i < line.length - 1; i++) {
    for (let s = 0; s < n; s++) out.push([line[i][0] + ((line[i + 1][0] - line[i][0]) * s) / n, line[i][1] + ((line[i + 1][1] - line[i][1]) * s) / n]);
  }
  out.push(line[line.length - 1]);
  return out;
};

async function drawCurtain(): Promise<void> {
  clearGroup("curtain");
  const [x0, y0] = lonlat2merc([90, -10]), [x1, y1] = lonlat2merc([179, 72]);
  const id = app.addVector({
    type: "Polygon",
    coordinates: [[[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]],
    style: { fill: { color: rgba(COLOR.white, OPACITY.curtain) } }
  });
  groups.curtain = [id];
  await tick();
}

/** 青い帯（正解）: 下に置く。デモ（紙）を変えたときだけ描き直す */
async function drawBlue(token: number): Promise<void> {
  clearGroup("blue");
  const tl = trueLines[demo().paper];
  const ll = (l: Line): P[] => l.map(p => lonlat2merc(p));
  if (show.grid) for (const l of tl.grid) addLine("blue", ll(l), bandStroke("grid"));
  await tick();
  if (token !== runToken) return;
  if (show.terrain) for (const l of tl.coast) addLine("blue", ll(l), bandStroke("terrain"));
  await tick();
}

const redCache: Record<string, { coast: P[][]; grid: P[][] }> = {};
function redOf(id: string): { coast: P[][]; grid: P[][] } {
  if (!redCache[id]) {
    const pl = paperLines[meta.maps[id].paper];
    const T = transformOf(id);
    redCache[id] = { coast: pl.coast.map(l => toMerc(T, l)), grid: pl.grid.map(l => toMerc(T, l)) };
  }
  return redCache[id];
}

/** 赤い芯（紙のもの）と原理（黒）: 型を変えるたびに描き直す。青い帯の上 */
async function drawRed(token: number): Promise<void> {
  clearGroup("red");
  clearGroup("mech");
  const id = mapId();
  const T = transformOf(id);
  const red = redOf(id);
  if (show.grid) for (const l of red.grid) addLine("red", l, coreStroke("grid"));
  await tick();
  if (token !== runToken) return;
  if (show.terrain) for (const l of red.coast) addLine("red", l, coreStroke("terrain"));
  await tick();
  if (token !== runToken || !show.mech) return;
  const g = geomOf(id);
  const mech = (lines: Line[], dash: readonly number[]): void => {
    for (const l of lines) {
      const m = toMerc(T, subdivide(l));
      addLine("mech", m, casingStroke());
      addLine("mech", m, principleStroke(dash));
    }
  };
  // 重ね順は文法の表（5 扇形 → 6 拡張範囲 → 7 四辺形 → 8 GCP の三角網）
  for (const [lines, dash] of [[g.fan, DASH.fan], [g.ext, DASH.extended], [g.quad, DASH.quad], [g.tin, DASH.tin]] as [Line[], readonly number[]][]) {
    mech(lines, dash);
    await tick();
    if (token !== runToken) return;
  }
}

// ---- 印（Core の POI）。クリックで GCP を選ぶ ----
const svgUri = (svg: string): string => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
const label = (x: number, y: number, s: string): string =>
  `<text x="${x}" y="${y}" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="700" fill="${COLOR.black}" stroke="#fff" stroke-width="3" paint-order="stroke" stroke-linejoin="round">${s}</text>`;
function ringIcon(q: Gcp, sel: boolean): { src: string; anchor: P } {
  const s = sel ? MARK.selectScale : 1;
  const r = (MARK.gcpGeo / 2) * s;
  const cx = 20, cy = 20;
  // 白抜きの輪。中をほぼ透明で塗るのは、輪の中を押しても選べるようにするため（OpenLayers の当たり判定は描いた画素による）
  const ring = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(255,255,255,0.02)" stroke="${COLOR.blueDark}" stroke-width="${MARK.gcpGeoStroke}"/>`;
  const sel_ = sel ? `<circle cx="${cx}" cy="${cy}" r="${r + 4}" fill="none" stroke="${COLOR.select}" stroke-width="3"/>` : "";
  const t = label(cx + r + 5, cy - r + 2, `${q.no}${q.blunder ? " 打ち間違い" : ""}`);
  return { src: svgUri(`<svg xmlns="${NS}" width="120" height="40" viewBox="0 0 120 40">${sel_}${ring}${t}</svg>`), anchor: [cx / 120, 0.5] };
}
function dotIcon(sel: boolean): { src: string; anchor: P } {
  const r = (MARK.gcpPaper / 2) * (sel ? MARK.selectScale : 1);
  const sel_ = sel ? `<circle cx="20" cy="20" r="${r + 7}" fill="none" stroke="${COLOR.select}" stroke-width="3"/>` : "";
  return { src: svgUri(`<svg xmlns="${NS}" width="40" height="40" viewBox="0 0 40 40">${sel_}<circle cx="20" cy="20" r="${r}" fill="${COLOR.red}"/></svg>`), anchor: [0.5, 0.5] };
}
const auxIcon = (): { src: string; anchor: P } => ({
  src: svgUri(`<svg xmlns="${NS}" width="14" height="14" viewBox="0 0 14 14"><rect x="${7 - MARK.aux / 2}" y="${7 - MARK.aux / 2}" width="${MARK.aux}" height="${MARK.aux}" fill="#fff" stroke="${COLOR.black}" stroke-width="${WIDTH.principle}"/></svg>`),
  anchor: [0.5, 0.5]
});
const centroidIcon = (): { src: string; anchor: P } => ({
  src: svgUri(`<svg xmlns="${NS}" width="14" height="14" viewBox="0 0 14 14"><path d="M${7 - MARK.centroid / 2} 7H${7 + MARK.centroid / 2}M7 ${7 - MARK.centroid / 2}V${7 + MARK.centroid / 2}" stroke="${COLOR.black}" stroke-width="${WIDTH.principle}" fill="none"/></svg>`),
  anchor: [0.5, 0.5]
});

function drawMarkers(): void {
  app.clearMarker("main");
  const id = mapId();
  const T = transformOf(id);
  const g = geomOf(id);
  if (show.mech) {
    g.aux.forEach((a, i) => {
      const m = T.xy2Merc(a);
      if (m) app.addMarker({ id: `aux_${i}`, coordinates: m, icon: auxIcon(), demoKind: "aux" }, "main");
    });
    if (g.centroid) {
      const m = T.xy2Merc(g.centroid);
      if (m) app.addMarker({ id: "centroid", coordinates: m, icon: centroidIcon(), demoKind: "centroid" }, "main");
    }
  }
  // GCP: 地理の側（青い輪）→ 紙の側を変換した先（赤い丸）の順（赤い丸を上に）
  for (const q of gcpList()) app.addMarker({ id: `geo_${q.no}`, lnglat: q.lonlat, icon: ringIcon(q, q.no === selected), demoKind: "gcp", demoNo: q.no }, "main");
  for (const q of gcpList()) {
    const m = T.xy2Merc(q.pixel);
    if (m) app.addMarker({ id: `px_${q.no}`, coordinates: m, icon: dotIcon(q.no === selected), demoKind: "gcp", demoNo: q.no }, "main");
  }
}

// ---------------------------------------------------------------------------------------------
// 見る場所
// ---------------------------------------------------------------------------------------------
function wholeZoom(): number {
  const v = meta.views[demo().paper].whole;
  const rect = $("map_div").getBoundingClientRect();
  const mercPerPx = Math.max((v.spanMerc[0] * meta.screenRef.margin) / (rect.width || 600), (v.spanMerc[1] * meta.screenRef.margin) / (rect.height || 600));
  return Math.log2(156543.03 / mercPerPx);
}
type ViewKind = "whole" | "outer" | "blunder";
function setView(kind: ViewKind): void {
  const paper = demo().paper;
  const v = meta.views[paper];
  let c = v.whole.lonlat, dz = 0;
  if (kind === "outer") { c = v.outer.lonlat; dz = v.outer.zoomDelta ?? 0; }
  if (kind === "blunder") {
    const b = meta.views.blunders[blunderCursor % meta.views.blunders.length];
    blunderCursor++;
    c = b.lonlat; dz = b.zoomDelta;
  }
  app.setViewpoint({ longitude: c[0], latitude: c[1], mercZoom: wholeZoom() + dz, rotation: 0 });
  for (const k of ["whole", "outer", "blunder"] as const) $(`view-${k}`).setAttribute("aria-pressed", String(k === kind));
}

// ---------------------------------------------------------------------------------------------
// 欄・見出し
// ---------------------------------------------------------------------------------------------
const setupNames = (s: string[]): string => s.map(x => SETUP_TYPE[x] ?? x).join(" または ");
function renderHint(): void {
  $("hint-demo").textContent = `デモ ${demoNo}　${DEMO_PAIR[demoNo]}`;
  const el = $("hint-text");
  const lead = document.createElement("b");
  lead.textContent = "確認のポイント";
  el.replaceChildren(lead, ` ${HINTS[demoNo]}`);
  const t = demo().teiresias;
  const say = (x: Teiresias, head: string): string => `${head}は ${x.score!.toFixed(4)} で、推奨は ${setupNames(x.setups) || "なし"}。`;
  let msg = t.score === null ? "適合スコアは出なかった。" : say(t, "適合スコア");
  if (demoNo === "1") {
    const c = meta.gcpSets.g1c.teiresias;
    if (c.score !== null) msg += `打ち間違いを直した GCP なら、${say(c, "適合スコア")}`;
  }
  $("hint-score").textContent = msg;
}
function renderPanel(): void {
  const types = demo().types;
  const box = $("type-buttons");
  box.innerHTML = "";
  for (const t of types) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = typeName(t);
    b.setAttribute("aria-pressed", String(t === typeKey));
    b.addEventListener("click", () => void setType(t));
    box.appendChild(b);
  }
  $("type-note").textContent = TYPE_NOTE[typeKey];
  // ずれの表（2 つの型を横に）
  const rows: [string, (s: MapMeta["stats"]) => string, string][] = [
    ["内側（全体）", s => `${fmt(s.inner.maxKm)} / ${fmt(s.inner.rmsKm)}`, "GCP の凸包の中。海も含む"],
    ["内側の陸", s => `${fmt(s.innerLand.maxKm)} / ${fmt(s.innerLand.rmsKm)}`, "GCP の凸包の中で、正解の位置が陸の所だけ"],
    ["外側", s => `${fmt(s.outer.maxKm)} / ${fmt(s.outer.rmsKm)}`, "GCP の凸包の外で紙の中"],
    ["GCP", s => fmt(s.gcpMaxKm, 2), "GCP の位置での残差の最大"]
  ];
  let h = `<thead><tr><th></th>${types.map(t => `<th>${typeName(t)}</th>`).join("")}</tr></thead><tbody>`;
  for (const [name, f, tip] of rows) h += `<tr><th title="${tip}">${name}</th>${types.map(t => `<td>${f(meta.maps[mapId(t)].stats)}</td>`).join("")}</tr>`;
  $("gap-table").innerHTML = h + "</tbody>";
  const px = meta.screenRef.mercPerPx[demo().paper];
  $("gap-ref").textContent = `目安として、「全体」で面の幅が ${meta.screenRef.widthPx} 画素のとき、北緯 35 度で 1 画面画素が約 ${(px / 1000 * Math.cos((35 * Math.PI) / 180)).toFixed(1)} km。`;
  $("view-blunder").hidden = demoNo !== "1";
  renderGcpInfo();
}
function renderGcpInfo(): void {
  const el = $("gcp-info");
  if (selected === undefined) { el.textContent = "印を押すと、ここに詳しく出る。"; return; }
  const q = gcpList().find(x => x.no === selected)!;
  const res = demo().types.map(t => `${typeName(t)}が ${fmt(meta.maps[mapId(t)].gcpResidual[selected! - 1].km, 2)}`).join("、");
  el.innerHTML = `<b>GCP ${q.no}</b>（${q.region}）${q.blunder ? "<b>打ち間違い</b>" : ""}<br>紙の画素は (${q.pixel[0].toFixed(0)}, ${q.pixel[1].toFixed(0)})、経度・緯度は (${q.lonlat[0].toFixed(3)}, ${q.lonlat[1].toFixed(3)})。<br>この GCP でのずれ（km）は、${res}。`;
}
function renderLegend(): void {
  const sw = (inner: string): string => `<svg viewBox="0 0 36 12" aria-hidden="true">${inner}</svg>`;
  const band = `<line x1="0" y1="6" x2="36" y2="6" stroke="${COLOR.blue}" stroke-opacity="${OPACITY.band}" stroke-width="${WIDTH.terrain.band}"/>`;
  const core = `<line x1="0" y1="6" x2="36" y2="6" stroke="${COLOR.red}" stroke-width="${WIDTH.terrain.core}"/>`;
  const dots = `<line x1="0" y1="6" x2="36" y2="6" stroke="${COLOR.black}" stroke-width="${WIDTH.principle}" stroke-dasharray="${DASH.tin.join(" ")}"/>`;
  $("legend").innerHTML =
    `<span>${sw(core)}赤い線は、紙に描いてあるものを変換した結果</span>` +
    `<span>${sw(band)}青い帯は正解。赤い線が帯の中なら合っている</span>` +
    `<span>${sw(dots)}黒い点線は、変換のしくみ</span>`;
}

// ---------------------------------------------------------------------------------------------
// 操作
// ---------------------------------------------------------------------------------------------
function syncUrl(): void {
  try {
    history.replaceState(null, "", `?demo=${demoNo}&type=${typeKey}`);
  } catch {
    /* 失敗しても動作に影響しない */
  }
}
function selectGcp(no: number | undefined): void {
  selected = selected === no ? undefined : no;
  renderGcpInfo();
  renderPaperFace();
  drawMarkers();
}
async function applyBackground(): Promise<void> {
  app.setTransparency(show.bg ? 0 : 100);
}
async function redrawAll(): Promise<void> {
  const token = ++runToken;
  statusEl.textContent = "描いています…";
  renderPaperFace();
  await drawBlue(token);
  if (token !== runToken) return;
  await drawRed(token);
  if (token !== runToken) return;
  drawMarkers();
  statusEl.textContent = statusText();
}
async function setType(t: string): Promise<void> {
  if (t === typeKey) return;
  typeKey = t;
  syncUrl();
  renderPanel();
  renderPaperFace();
  if (openPaper) await app.changeMap(mapId());
  const token = ++runToken;
  await drawRed(token);
  if (token !== runToken) return;
  drawMarkers();
  statusEl.textContent = statusText();
}
async function setDemo(no: string): Promise<void> {
  demoNo = no;
  typeKey = demo().types[0];
  selected = undefined;
  blunderCursor = 0;
  syncUrl();
  document.querySelectorAll<HTMLElement>("#demo-tabs button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.demo === no)));
  renderHint();
  renderPanel();
  if (openPaper) await app.changeMap(mapId());
  await redrawAll();
  setView("whole");
}

async function main(): Promise<void> {
  const params = new URLSearchParams(location.search);
  const j = async <T>(url: string): Promise<T> => (await fetch(url)).json() as Promise<T>;
  meta = await j<Meta>("demo-data/layered_demo_meta.json");
  const [coast, p1, p2, p3] = await Promise.all([
    j<TrueLines>("demo-data/layered_demo_coast.json"),
    j<PaperLines>("demo-data/layered_demo_paper_p1.json"),
    j<PaperLines>("demo-data/layered_demo_paper_p2.json"),
    j<PaperLines>("demo-data/layered_demo_paper_p3.json")
  ]);
  trueLines = coast;
  paperLines.p1 = p1;
  paperLines.p2 = p2;
  paperLines.p3 = p3;
  const ids = Object.keys(meta.maps);
  await Promise.all(ids.map(async id => { mapJson[id] = await j<DemoMapJson>(`maps/${id}.json`); }));

  app = new MaplatApp({
    appid: "layered-map-demo",
    div: "map_div",
    startFrom: "gsi",
    restore: { mapID: "gsi" },
    restoreSession: false,
    setting: {
      homePosition: [136, 36],
      defaultZoom: 5,
      sources: ["gsi", ...ids.map(id => ({ mapID: id }))],
      pois: []
    }
  } as never);
  (window as unknown as { __LAYERED_DEMO_APP__: MaplatApp }).__LAYERED_DEMO_APP__ = app;
  await app.waitReady;

  // デモの選択
  const tabs = $("demo-tabs");
  for (const no of Object.keys(meta.demos)) {
    const b = document.createElement("button");
    b.type = "button";
    b.dataset.demo = no;
    b.textContent = no;
    b.title = DEMO_PAIR[no];
    b.setAttribute("aria-label", `デモ ${no}: ${DEMO_PAIR[no]}`);
    b.addEventListener("click", () => void setDemo(no));
    tabs.appendChild(b);
  }
  renderLegend();
  app.addEventListener("clickMarker", evt => {
    const d = (evt as unknown as { detail?: { demoKind?: string; demoNo?: number } }).detail;
    if (d?.demoKind === "gcp" && d.demoNo !== undefined) selectGcp(d.demoNo);
  });
  // 表示の切り替え（地形・グリッド・しくみ・背景）
  const bind = (id: string, key: keyof typeof show, full: boolean): void => {
    $<HTMLInputElement>(id).addEventListener("change", e => {
      show[key] = (e.target as HTMLInputElement).checked;
      if (key === "bg") void applyBackground();
      else if (full) void redrawAll();
    });
  };
  bind("chk-terrain", "terrain", true);
  bind("chk-grid", "grid", true);
  bind("chk-mech", "mech", true);
  bind("chk-bg", "bg", false);
  for (const k of ["whole", "outer", "blunder"] as const) $(`view-${k}`).addEventListener("click", () => setView(k));
  $<HTMLInputElement>("chk-open-paper").addEventListener("change", e => {
    openPaper = (e.target as HTMLInputElement).checked;
    void app.changeMap(openPaper ? mapId() : "gsi");
  });
  window.addEventListener("keydown", e => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const el = document.activeElement;
    if (el && /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName) && (el as HTMLInputElement).type !== "checkbox") return;
    const types = demo().types;
    void setType(types[(types.indexOf(typeKey) + (e.key === "ArrowRight" ? 1 : types.length - 1)) % types.length]);
  });
  new ResizeObserver(() => { if (meta) renderPaperFace(); }).observe($("paper-wrap"));

  await drawCurtain();
  const startDemo = meta.demos[params.get("demo") ?? ""] ? params.get("demo")! : "1";
  await setDemo(startDemo);
  const t = params.get("type");
  if (t && demo().types.includes(t)) await setType(t);
  statusEl.textContent = statusText();
}

main().catch(e => {
  statusEl.textContent = `起動に失敗: ${String(e)}`;
  console.error(e);
});
