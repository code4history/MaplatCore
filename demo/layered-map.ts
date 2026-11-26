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
  bandStroke, casingStroke, compareStroke, coreStroke, principleStroke, rgba
} from "./layered-map/grammar";
import { commonDict } from "./i18n/common";
import { applyLang, detectLang, makeTranslate, mergeDicts, mountLangSwitch } from "./i18n/core";
import { dict, REGION_KEY } from "./i18n/layered-map";

type P = number[];
type Line = P[];

// ---- meta（generate.mjs が書く）----
interface Stat { maxKm: number; rmsKm: number; maxScreenPx: number; n: number }
type PaperKey = "p1" | "p2" | "p3";
type GcpKey = "g1" | "g1c" | "g2" | "g3";
interface Gcp { no: number; lonlat: P; pixel: P; region: string; dense: boolean; blunder?: { sizePx: number } }
/** システムが足した補完点（MaplatTin#89）。三角形の頂点の名前は "s{番号 - 1}" */
interface Supplement { no: number; pixel: P; lonlat: P; edge: (number | string)[]; anchor: number | string | null }
interface Principle {
  kind: "none" | "worldFile" | "fan";
  aux?: P[];
  ring?: number[];
  centroid?: P | null;
  gcpTris?: number[][];
  extTris?: (number | string)[][];
  supTris?: (number | string)[][];
  supplement?: Supplement[];
  intrusion?: { fraction: number; at: P | null };
}
interface SupplementStat {
  offId: string;
  count: number;
  intrusion: { on: number; off: number };
  intrusionAt: { pixel: P; lonlat: P } | null;
  diff: { inner: Stat; outer: Stat };
}
interface MapMeta {
  type: string;
  paper: PaperKey;
  gcps: GcpKey;
  hull: P[];
  principle: Principle;
  stats: { inner: Stat; innerLand: Stat; outer: Stat; gcpMaxKm: number; gcpMaxScreenPx: number };
  gcpResidual: { km: number; screenPx: number }[];
}
interface Teiresias { score: number | null; setups: string[]; reason: string }
interface DemoMeta { paper: PaperKey; gcps: GcpKey; types: string[]; maps: Record<string, string>; teiresias: Teiresias; supplementTypes?: string[] }
interface View { lonlat: P; zoomDelta?: number; label?: string }
interface Meta {
  paper: { size: number };
  screenRef: { widthPx: number; margin: number; mercPerPx: Record<string, number> };
  gcps: Record<string, Gcp[]>;
  gcpSets: Record<string, { label: string; teiresias: Teiresias }>;
  maps: Record<string, MapMeta>;
  supplement: Record<string, SupplementStat>;
  tin: string;
  demos: Record<string, DemoMeta>;
  views: {
    supplement: { zoomDelta: number; intrusionZoomDelta: number };
    p1: { whole: { lonlat: P; spanMerc: P }; outer: View };
    p2: { whole: { lonlat: P; spanMerc: P }; outer: View };
    p3: { whole: { lonlat: P; spanMerc: P }; outer: View };
    blunders: { no: number; lonlat: P; zoomDelta: number }[];
  };
}
interface PaperLines { size: number; coast: Line[]; grid: Line[] }
interface TrueLines { p1: { coast: Line[]; grid: Line[] }; p2: { coast: Line[]; grid: Line[] }; p3: { coast: Line[]; grid: Line[] } }

// ---- 画面の文言（設計書 §6.3・§6.2）は、すべて辞書（demo/i18n/common.ts・demo/i18n/layered-map.ts。ja・en）に置く ----
// 型の呼び名は、地図 JSON の鍵（a・b・c・d）とは別に、辞書だけで決める
const lang = detectLang();
const tr = makeTranslate(mergeDicts(commonDict, dict), lang);
const typeName = (k: string): string => (["a", "b", "c", "d"].includes(k) ? tr(`type.${k}`) : k);
// 補完点の切り替えがあるデモの、確認のポイントの足し分。菱形の数は meta から入れる
const supplementHint = (n: number): string => (n === 1 ? tr("lm.hint_sup_one") : tr("lm.hint_sup", { n }));
// デモの選択のボタンは番号だけにし、2 つの型の呼び名は説明文の段の左に出す（5 つ並べると 1280 画素に収まらない）
const demoPair = (no: string): string => {
  const types = meta.demos[no].types;
  return tr("type.pair", { a: typeName(types[0]), b: typeName(types[1]) });
};
// 補完点の切り替えがあるデモだけ、型の説明に足す
const typeNote = (k: string, withSup: boolean): string => tr(`type.note.${k}`) + (withSup ? tr(`lm.type_sup.${k}`) : "");
// Teiresias の推奨（setups）の名前 → 型の鍵
const SETUP_TYPE: Record<string, string> = { worldFileOnly: "a", tinGlobal: "b", tinFan: "c" };
const statusText = (): string => tr("lm.status_demo", { no: demoNo, type: typeName(typeKey) }) +
  (demoHasSup() && hasSup() ? tr(supplementOn ? "lm.status_sup_on" : "lm.status_sup_off") : "");
const regionName = (ja: string): string => (REGION_KEY[ja] ? tr(REGION_KEY[ja]) : ja);
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
const show = { terrain: true, grid: true, mech: true, bg: true, compare: true };
let supplementOn = true; // 補完点あり（Tin の既定）か、なし（supplementPairs: false）か
let selected: number | undefined; // 選んでいる GCP の番号
let selectedSup: number | undefined; // 選んでいる補完点の番号
let blunderCursor = 0;
let supCursor = 0;
/** 紙の面を補完点の周りへ寄せる（見る場所「補完点」のとき）。null なら紙の全体 */
let paperFocus: P | null = null;
const PAPER_FOCUS_SPAN = 0.3; // 寄せたときの、紙の面の幅（紙の幅に対する割合）
let openPaper = false;

const demo = (): DemoMeta => meta.demos[demoNo];
const baseMapId = (t = typeKey): string => demo().maps[t];
/** 補完点の切り替えがある型か（その型の地図に補完点が付いたもの）。付かない型・付かない素材では、切り替えても変わらない */
const hasSup = (t = typeKey): boolean => !!meta.supplement[baseMapId(t)];
const demoHasSup = (): boolean => (demo().supplementTypes?.length ?? 0) > 0;
const mapId = (t = typeKey, sup = supplementOn): string => {
  const s = meta.supplement[baseMapId(t)];
  return s && !sup ? s.offId : baseMapId(t);
};
/** 灰色で重ねる「もう一方の設定」の地図。切り替えが効かない型では無い */
const compareId = (): string | undefined => (hasSup() ? mapId(typeKey, !supplementOn) : undefined);
const gcpList = (): Gcp[] => meta.gcps[demo().gcps];
const transformOf = (id: string): MapTransform => (transforms[id] ??= buildMapTransform(mapJson[id], proj4 as unknown as Proj4Factory));

// ---------------------------------------------------------------------------------------------
// 原理（紙の画素）。generate.mjs が meta に書いた構造から、線と印を作る
// ---------------------------------------------------------------------------------------------
interface Geom {
  fan: Line[]; ext: Line[]; quad: Line[]; tin: Line[]; hull: Line[]; sup: Line[];
  aux: P[]; supplement: Supplement[]; centroid: P | null; intrusionAt: P | null; kind: Principle["kind"]
}
const geomCache: Record<string, Geom> = {};
function geomOf(id: string): Geom {
  if (geomCache[id]) return geomCache[id];
  const pr = meta.maps[id].principle;
  const gcps = meta.gcps[meta.maps[id].gcps];
  const g: Geom = { fan: [], ext: [], quad: [], tin: [], hull: [], sup: [], aux: [], supplement: [], centroid: null, intrusionAt: null, kind: pr.kind };
  if (pr.kind !== "none" && pr.aux && pr.ring && pr.gcpTris && pr.extTris) {
    const sups = pr.supplement ?? [];
    const pos = (v: number | string): P => {
      if (typeof v === "number") return gcps[v].pixel;
      const k = Number(String(v).slice(1));
      return String(v)[0] === "s" ? sups[k].pixel : pr.aux![k];
    };
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
    // 補完点を含む三角形の辺を先に取る（ほかの三角形と辺を共有していても、補完点の線として描く）
    edges(pr.supTris ?? [], g.sup);
    edges(pr.gcpTris, g.tin);
    edges(pr.extTris, g.ext);
    g.aux = pr.aux;
    g.supplement = sups;
    // 凸包は、補完点の切り替えがあるデモだけ描く（補助頂点の三角形が内側へ食い込むかを見るため。描くかどうかは描くときに決める）
    const hull = meta.maps[id].hull;
    g.hull = [[...hull, hull[0]]];
    g.intrusionAt = pr.intrusion && pr.intrusion.fraction > 0 ? pr.intrusion.at : null;
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
  const lo = -REGION_FAR * W, full = (1 + 2 * REGION_FAR) * W;
  const size = paperFocus ? PAPER_FOCUS_SPAN * W : full;
  const [vx, vy] = paperFocus ? [paperFocus[0] - size / 2, paperFocus[1] - size / 2] : [lo, lo];
  svg.setAttribute("viewBox", `${vx} ${vy} ${size} ${size}`);
  const rect = svg.getBoundingClientRect();
  const k = Math.min(rect.width, rect.height) / size || 0.2; // 画面の画素 / 紙の画素
  const u = (px: number): number => px / k;
  const id = mapId();
  const g = geomOf(id);
  const pl = paperLines[demo().paper];
  let h = `<rect x="${lo}" y="${lo}" width="${full}" height="${full}" fill="#eef0f4"/><rect x="0" y="0" width="${W}" height="${W}" fill="#fff"/>`;
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
    h += principle(g.fan, DASH.fan) + principle(g.ext, DASH.extended) + principle(g.quad, DASH.quad);
    if (demoHasSup()) h += principle(g.hull, DASH.hull);
    h += principle(g.tin, DASH.tin) + principle(g.sup, DASH.supplement);
    for (const a of g.aux) {
      const s = u(MARK.aux);
      h += `<rect x="${a[0] - s / 2}" y="${a[1] - s / 2}" width="${s}" height="${s}" fill="#fff" stroke="${COLOR.black}" stroke-width="${WIDTH.principle}" vector-effect="non-scaling-stroke"/>`;
    }
    // 補完点: 黒の中抜きの菱形。両方の面に同じ番号で描く
    for (const q of g.supplement) {
      const sel = q.no === selectedSup;
      const r = (u(MARK.supplement) / 2) * (sel ? MARK.selectScale : 1);
      const [x, y] = q.pixel;
      if (sel) h += `<circle cx="${x}" cy="${y}" r="${u(MARK.gcpGeo) * 0.75 * MARK.selectScale}" fill="none" stroke="${COLOR.select}" stroke-width="3" vector-effect="non-scaling-stroke"/>`;
      h += `<path d="M${x} ${y - r}L${x + r} ${y}L${x} ${y + r}L${x - r} ${y}Z" fill="#fff" stroke="${COLOR.black}" stroke-width="${MARK.supplementStroke}" vector-effect="non-scaling-stroke" stroke-linejoin="miter"/>`;
      h += `<text x="${x + u(8)}" y="${y + u(14)}" font-size="${u(11)}" font-weight="700">${tr("lm.mark_sup", { no: q.no })}</text>`;
      h += `<circle data-sup="${q.no}" cx="${x}" cy="${y}" r="${u(10)}" fill="transparent" style="cursor:pointer"/>`;
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
    h += `<text x="${q.pixel[0] + u(6)}" y="${q.pixel[1] - u(5)}" font-size="${u(11)}" font-weight="700">${q.no}${q.blunder ? tr("lm.mark_blunder") : ""}</text>`;
    h += `<circle data-gcp="${q.no}" cx="${q.pixel[0]}" cy="${q.pixel[1]}" r="${u(10)}" fill="transparent" style="cursor:pointer"/>`;
  }
  svg.innerHTML = h;
  svg.querySelectorAll<SVGElement>("[data-gcp]").forEach(el => {
    el.addEventListener("click", () => selectGcp(Number(el.dataset.gcp)));
  });
  svg.querySelectorAll<SVGElement>("[data-sup]").forEach(el => {
    el.addEventListener("click", () => selectSupplement(Number(el.dataset.sup)));
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
  let h = text(tr("lm.face_tin"), cx, gcps.reduce((a, p) => a + p[1], 0) / gcps.length);
  h += text(tr("lm.face_extended"), cx, (hullTop + auxTop) / 2);
  if (demoHasSup()) {
    h += text(tr("lm.face_hull"), Math.min(...gcps.map(p => p[0])) - 0.04 * W, (Math.min(...gcps.map(p => p[1])) + Math.max(...gcps.map(p => p[1]))) / 2);
    if (g.intrusionAt) h += text(tr("lm.face_intrusion"), g.intrusionAt[0], g.intrusionAt[1] + u(16)); // GCP の番号に重ならないよう、少し下へ
  }
  const outer = tr(g.kind === "worldFile" ? "lm.face_global" : "lm.face_fan");
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

/** 灰色の細い線（補完点のもう一方の設定の結果）→ 赤い芯（紙のもの）→ 原理（黒）: 型・補完点を変えるたびに描き直す。青い帯の上 */
async function drawRed(token: number): Promise<void> {
  clearGroup("gray");
  clearGroup("red");
  clearGroup("mech");
  const id = mapId();
  const T = transformOf(id);
  const red = redOf(id);
  const other = compareId();
  if (other && show.compare) {
    const gray = redOf(other);
    if (show.grid) for (const l of gray.grid) addLine("gray", l, compareStroke("grid"));
    if (show.terrain) for (const l of gray.coast) addLine("gray", l, compareStroke("terrain"));
    await tick();
    if (token !== runToken) return;
  }
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
  // 重ね順は文法の表（5 扇形 → 6 拡張範囲 → 7 四辺形 → 凸包 → 8 GCP の三角網 → 補完点を含む三角形）
  const layers: [Line[], readonly number[]][] = [[g.fan, DASH.fan], [g.ext, DASH.extended], [g.quad, DASH.quad], [demoHasSup() ? g.hull : [], DASH.hull], [g.tin, DASH.tin], [g.sup, DASH.supplement]];
  for (const [lines, dash] of layers) {
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
  const t = label(cx + r + 5, cy - r + 2, `${q.no}${q.blunder ? tr("lm.mark_blunder") : ""}`);
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
// 補完点: 黒の中抜きの菱形＋番号（対応点の赤い丸・青い輪と、形で見分ける）
function supIcon(q: Supplement, sel: boolean): { src: string; anchor: P } {
  const r = (MARK.supplement / 2) * (sel ? MARK.selectScale : 1);
  const cx = 20, cy = 20;
  const sel_ = sel ? `<circle cx="${cx}" cy="${cy}" r="${r + 7}" fill="none" stroke="${COLOR.select}" stroke-width="3"/>` : "";
  // 白で塗るのは、集まる三角網の線に埋もれないため（中を押しても選べる）
  const d = `<path d="M${cx} ${cy - r}L${cx + r} ${cy}L${cx} ${cy + r}L${cx - r} ${cy}Z" fill="#fff" stroke="${COLOR.black}" stroke-width="${MARK.supplementStroke}"/>`;
  const t = label(cx + r + 4, cy + r + 8, tr("lm.mark_sup", { no: q.no }));
  return { src: svgUri(`<svg xmlns="${NS}" width="80" height="40" viewBox="0 0 80 40">${sel_}${d}${t}</svg>`), anchor: [cx / 80, 0.5] };
}
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
    // 補完点は、三角網が必ず通る点（紙の側を変換した先が、地理の側に一致する）。1 つの印で両側を表す
    for (const q of g.supplement) {
      const m = T.xy2Merc(q.pixel);
      if (m) app.addMarker({ id: `sup_${q.no}`, coordinates: m, icon: supIcon(q, q.no === selectedSup), demoKind: "supplement", demoNo: q.no }, "main");
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
type ViewKind = "whole" | "outer" | "blunder" | "supplement" | "intrusion";
/** 今の型の補完点（補完点ありの地図の側から取る。なしの地図には補完点が無い） */
const supplementList = (): Supplement[] => meta.maps[mapId(typeKey, true)].principle.supplement ?? [];
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
  if (kind === "supplement") {
    const list = supplementList();
    if (list.length) {
      const b = list[supCursor % list.length];
      supCursor++;
      c = b.lonlat; dz = meta.views.supplement.zoomDelta;
      paperFocus = b.pixel;
    }
  }
  if (kind === "intrusion") {
    const at = meta.supplement[baseMapId()]?.intrusionAt;
    if (at) {
      c = at.lonlat; dz = meta.views.supplement.intrusionZoomDelta;
      paperFocus = at.pixel;
    }
  }
  if (kind !== "supplement" && kind !== "intrusion") paperFocus = null;
  renderPaperFace();
  app.setViewpoint({ longitude: c[0], latitude: c[1], mercZoom: wholeZoom() + dz, rotation: 0 });
  for (const k of ["whole", "outer", "blunder", "supplement", "intrusion"] as const) $(`view-${k}`).setAttribute("aria-pressed", String(k === kind));
}

// ---------------------------------------------------------------------------------------------
// 欄・見出し
// ---------------------------------------------------------------------------------------------
const setupNames = (s: string[]): string => s.map(x => (SETUP_TYPE[x] ? typeName(SETUP_TYPE[x]) : x)).join(tr("lm.setup_join"));
function renderHint(): void {
  $("hint-demo").textContent = tr("lm.hint_demo", { no: demoNo, pair: demoPair(demoNo) });
  const el = $("hint-text");
  const lead = document.createElement("b");
  lead.textContent = tr("lm.hint_lead");
  const sup = demoHasSup() ? supplementHint(meta.supplement[baseMapId(demo().supplementTypes![0])].count) : "";
  el.replaceChildren(lead, ` ${tr(`lm.hint.${demoNo}`)}${sup ? ` ${sup}` : ""}`);
  const t = demo().teiresias;
  const say = (x: Teiresias, key: string): string => tr(key, { score: x.score!.toFixed(4), setups: setupNames(x.setups) || tr("lm.setup_none") });
  let msg = t.score === null ? tr("lm.score_none") : say(t, "lm.score");
  if (demoNo === "1") {
    const c = meta.gcpSets.g1c.teiresias;
    if (c.score !== null) msg += say(c, "lm.score_fixed");
  }
  $("hint-score").textContent = msg;
}
function renderPanel(): void {
  renderLegend();
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
  $("type-note").textContent = typeNote(typeKey, demoHasSup());
  renderSupplement();
  // ずれの表（2 つの型を横に）
  const rows: [string, (s: MapMeta["stats"]) => string, string][] = [
    ["inner", s => `${fmt(s.inner.maxKm)} / ${fmt(s.inner.rmsKm)}`, ""],
    ["inner_land", s => `${fmt(s.innerLand.maxKm)} / ${fmt(s.innerLand.rmsKm)}`, ""],
    ["outer", s => `${fmt(s.outer.maxKm)} / ${fmt(s.outer.rmsKm)}`, ""],
    ["gcp", s => fmt(s.gcpMaxKm, 2), ""]
  ];
  let h = `<thead><tr><th></th>${types.map(t => `<th>${typeName(t)}</th>`).join("")}</tr></thead><tbody>`;
  for (const [key, f] of rows) h += `<tr><th title="${tr(`lm.gap_tip.${key}`)}">${tr(`lm.gap_row.${key}`)}</th>${types.map(t => `<td>${f(meta.maps[mapId(t)].stats)}</td>`).join("")}</tr>`;
  $("gap-table").innerHTML = h + "</tbody>";
  const px = meta.screenRef.mercPerPx[demo().paper];
  $("gap-ref").textContent = tr("lm.gap_ref", { width: meta.screenRef.widthPx, km: (px / 1000 * Math.cos((35 * Math.PI) / 180)).toFixed(1) });
  $("view-blunder").hidden = demoNo !== "1";
  $("view-supplement").hidden = !(demoHasSup() && hasSup());
  $("view-intrusion").hidden = !(demoHasSup() && hasSup());
  renderGcpInfo();
}
// 補完点のあり・なしの切り替えと、その数字。補完点が付かない素材のデモでは出さない（切り替えても何も変わらない）
const pct = (v: number): string => `${(v * 100).toFixed(2)}%`;
function renderSupplement(): void {
  const sec = $("sup-sec");
  sec.hidden = !demoHasSup();
  if (sec.hidden) return;
  const box = $("sup-buttons");
  box.innerHTML = "";
  for (const on of [true, false]) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = tr(on ? "lm.sup_on" : "lm.sup_off");
    b.disabled = !hasSup();
    b.setAttribute("aria-pressed", String(hasSup() && on === supplementOn));
    b.addEventListener("click", () => void setSupplement(on));
    box.appendChild(b);
  }
  $("sup-note").textContent = tr(hasSup() ? "lm.sup_note" : "lm.sup_note_none");
  $<HTMLInputElement>("chk-compare").disabled = !hasSup();
  const types = demo().supplementTypes!;
  const rows: [string, (x: SupplementStat) => string][] = [
    ["count", x => String(x.count)],
    ["intrusion", x => `${pct(x.intrusion.on)} / ${pct(x.intrusion.off)}`],
    ["diff_outer", x => `${fmt(x.diff.outer.maxKm)} / ${fmt(x.diff.outer.rmsKm)}`],
    ["diff_inner", x => `${fmt(x.diff.inner.maxKm)} / ${fmt(x.diff.inner.rmsKm)}`]
  ];
  let h = `<thead><tr><th></th>${types.map(t => `<th>${typeName(t)}</th>`).join("")}</tr></thead><tbody>`;
  for (const [key, f] of rows) h += `<tr><th title="${tr(`lm.sup_tip.${key}`)}">${tr(`lm.sup_row.${key}`)}</th>${types.map(t => `<td>${f(meta.supplement[baseMapId(t)])}</td>`).join("")}</tr>`;
  $("sup-table").innerHTML = h + "</tbody>";
}
const gcpName = (v: number | string | null): string => {
  if (v === null) return "";
  if (typeof v === "number") return tr("lm.gcp_name", { no: v + 1 });
  return String(v)[0] === "s" ? tr("lm.sup_name", { no: Number(String(v).slice(1)) + 1 }) : String(v);
};
function renderGcpInfo(): void {
  const el = $("gcp-info");
  if (selectedSup !== undefined) {
    const q = supplementList().find(x => x.no === selectedSup);
    if (q) {
      el.innerHTML = tr("lm.info_sup_html", { no: q.no, a: gcpName(q.edge[0]), b: gcpName(q.edge[1]), px: q.pixel[0].toFixed(0), py: q.pixel[1].toFixed(0), lon: q.lonlat[0].toFixed(3), lat: q.lonlat[1].toFixed(3) });
      return;
    }
  }
  if (selected === undefined) { el.textContent = tr("lm.info_none"); return; }
  const q = gcpList().find(x => x.no === selected)!;
  const res = demo().types.map(t => tr("lm.res_item", { type: typeName(t), km: fmt(meta.maps[mapId(t)].gcpResidual[selected! - 1].km, 2) })).join(tr("lm.res_join"));
  el.innerHTML = tr("lm.info_gcp_html", { no: q.no, region: regionName(q.region), blunder: q.blunder ? tr("lm.info_blunder_html") : "", px: q.pixel[0].toFixed(0), py: q.pixel[1].toFixed(0), lon: q.lonlat[0].toFixed(3), lat: q.lonlat[1].toFixed(3), res });
}
function renderLegend(): void {
  const sw = (inner: string): string => `<svg viewBox="0 0 36 12" aria-hidden="true">${inner}</svg>`;
  const band = `<line x1="0" y1="6" x2="36" y2="6" stroke="${COLOR.blue}" stroke-opacity="${OPACITY.band}" stroke-width="${WIDTH.terrain.band}"/>`;
  const core = `<line x1="0" y1="6" x2="36" y2="6" stroke="${COLOR.red}" stroke-width="${WIDTH.terrain.core}"/>`;
  const dots = `<line x1="0" y1="6" x2="36" y2="6" stroke="${COLOR.black}" stroke-width="${WIDTH.principle}" stroke-dasharray="${DASH.tin.join(" ")}"/>`;
  let h =
    `<span>${sw(core)}${tr("lm.legend.core")}</span>` +
    `<span>${sw(band)}${tr("lm.legend.band")}</span>` +
    `<span>${sw(dots)}${tr("lm.legend.dots")}</span>`;
  // 補完点の切り替えがあるデモだけ。灰色は正解ではない（正解の無い比較）
  if (demoHasSup()) {
    const gray = `<line x1="0" y1="6" x2="36" y2="6" stroke="${COLOR.gray}" stroke-width="${WIDTH.compare.terrain}"/>`;
    const r = MARK.supplement / 2;
    const diamond = `<path d="M18 ${6 - r}L${18 + r} 6L18 ${6 + r}L${18 - r} 6Z" fill="#fff" stroke="${COLOR.black}" stroke-width="${MARK.supplementStroke}"/>`;
    const hull = `<line x1="0" y1="6" x2="36" y2="6" stroke="${COLOR.black}" stroke-width="${WIDTH.principle}" stroke-dasharray="${DASH.hull.join(" ")}"/>`;
    h += `<span>${sw(gray)}${tr("lm.legend.gray")}</span>` +
      `<span>${sw(diamond)}${tr("lm.legend.diamond")}</span>` +
      `<span>${sw(hull)}${tr("lm.legend.hull")}</span>`;
  }
  $("legend").innerHTML = h;
}

// ---------------------------------------------------------------------------------------------
// 操作
// ---------------------------------------------------------------------------------------------
function syncUrl(): void {
  try {
    history.replaceState(null, "", `?demo=${demoNo}&type=${typeKey}${demoHasSup() ? `&sup=${supplementOn ? 1 : 0}` : ""}&lang=${lang}`);
  } catch {
    /* 失敗しても動作に影響しない */
  }
}
function selectGcp(no: number | undefined): void {
  selected = selected === no ? undefined : no;
  selectedSup = undefined;
  renderGcpInfo();
  renderPaperFace();
  drawMarkers();
}
function selectSupplement(no: number | undefined): void {
  selectedSup = selectedSup === no ? undefined : no;
  selected = undefined;
  renderGcpInfo();
  renderPaperFace();
  drawMarkers();
}
async function applyBackground(): Promise<void> {
  app.setTransparency(show.bg ? 0 : 100);
}
async function redrawAll(): Promise<void> {
  const token = ++runToken;
  statusEl.textContent = tr("lm.drawing");
  renderPaperFace();
  await drawBlue(token);
  if (token !== runToken) return;
  await drawRed(token);
  if (token !== runToken) return;
  drawMarkers();
  statusEl.textContent = statusText();
}
/** 型か補完点の設定が変わったとき。青い帯と視点は動かさず、赤い芯・灰色の線・原理・印だけ描き直す */
async function redrawRed(): Promise<void> {
  syncUrl();
  if (!hasSup()) paperFocus = null;
  selectedSup = selectedSup !== undefined && supplementList().some(q => q.no === selectedSup) && supplementOn && hasSup() ? selectedSup : undefined;
  renderPanel();
  renderPaperFace();
  if (openPaper) await app.changeMap(mapId());
  const token = ++runToken;
  await drawRed(token);
  if (token !== runToken) return;
  drawMarkers();
  statusEl.textContent = statusText();
}
async function setType(t: string): Promise<void> {
  if (t === typeKey) return;
  typeKey = t;
  await redrawRed();
}
async function setSupplement(on: boolean): Promise<void> {
  if (on === supplementOn || !hasSup()) return;
  supplementOn = on;
  await redrawRed();
}
async function setDemo(no: string): Promise<void> {
  demoNo = no;
  typeKey = demo().types[0];
  selected = undefined;
  selectedSup = undefined;
  blunderCursor = 0;
  supCursor = 0;
  paperFocus = null;
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
  applyLang(tr, lang);
  mountLangSwitch($("lang-switch"), lang, tr("common.lang_label"));
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
    b.title = demoPair(no);
    b.setAttribute("aria-label", tr("lm.demo_aria", { no, pair: demoPair(no) }));
    b.addEventListener("click", () => void setDemo(no));
    tabs.appendChild(b);
  }
  app.addEventListener("clickMarker", evt => {
    const d = (evt as unknown as { detail?: { demoKind?: string; demoNo?: number } }).detail;
    if (d?.demoKind === "gcp" && d.demoNo !== undefined) selectGcp(d.demoNo);
    if (d?.demoKind === "supplement" && d.demoNo !== undefined) selectSupplement(d.demoNo);
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
  $<HTMLInputElement>("chk-compare").addEventListener("change", e => {
    show.compare = (e.target as HTMLInputElement).checked;
    void redrawRed();
  });
  for (const k of ["whole", "outer", "blunder", "supplement", "intrusion"] as const) $(`view-${k}`).addEventListener("click", () => setView(k));
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
  supplementOn = params.get("sup") !== "0";
  const startDemo = meta.demos[params.get("demo") ?? ""] ? params.get("demo")! : "1";
  await setDemo(startDemo);
  const t = params.get("type");
  if (t && demo().types.includes(t)) await setType(t);
  statusEl.textContent = statusText();
}

main().catch(e => {
  statusEl.textContent = tr("lm.failed", { error: String(e) });
  console.error(e);
});
