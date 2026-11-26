// 変換の形のデモ（layered-map.html）の素材を作る。設計書: 2026-11-26-jan27-layered-map-demo-redesign.md
// 結果は commit 済み（public/maps/layered_demo_*.json・public/demo-data/・public/tiles/layered_demo_p1・p2）なので、
// 普段は実行しなくてよい。作り直すとき:
//   cd <MaplatCore> && node demo/layered-map/generate.mjs [--tin=j1c|j1b]
// 前提（いずれも作業場所 jan27-crs-work の並び。違うときは環境変数で dist を直接指定する）:
//   - MaplatTin（既定 MaplatTin-j1c = PR #88）の dist …… MAPLAT_TIN_DIST=<MaplatTin>/dist/maplat_tin.js
//   - Teiresias の dist（score と推奨を出す）……………… MAPLAT_TEIRESIAS_DIST=<Teiresias>/dist/index.js
//   - 未公開の @maplat/transform（createProj4ProjectionEngine を含む版。node_modules/@maplat/transform へつないだもの）
// MaplatTin と Teiresias は素材を作るためだけに使う。Core の依存ではない。ネットワークには出ない
// （背景に使う海岸線は data/coast-lonlat.json に切り出して commit 済み。出どころは Natural Earth の
// ne_50m_land、パブリックドメイン）。
//
// 作るもの:
//   紙 P1（正確な図）と P2（歪んだ図）。どちらもランベルト正角円錐図法（lcc）の 2048×2048 画素・1 画素 1,500 m
//   GCP 24 組（固定の乱数種。G1 は打ち間違い 2 組入り・G1c はそれを直したもの・G2 は P2 の上で打ったもの）
//   地図 JSON 7 つ（A・C／D・C／A・B・C）、紙の折れ線 2 つ、正解（経緯度）の折れ線、紙のタイル、meta
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import proj4 from "proj4";
import { chromium } from "@playwright/test";
import { buildMapTransform, haversineKm, lonlat2merc, merc2lonlat } from "./engine.ts";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const TIN_VARIANTS = { j1b: "MaplatTin-j1b", j1c: "MaplatTin-j1c" };
const tinArg = process.argv.slice(2).find(a => a.startsWith("--tin="))?.slice(6) ?? "j1c";
if (!(tinArg in TIN_VARIANTS)) throw new Error(`--tin は j1b か j1c です: ${tinArg}`);
const tinDist = process.env.MAPLAT_TIN_DIST ?? resolve(root, "..", TIN_VARIANTS[tinArg], "dist/maplat_tin.js");
const teiresiasDist = process.env.MAPLAT_TEIRESIAS_DIST ?? resolve(root, "..", "Teiresias/dist/index.js");
console.log("Tin:", tinDist);
console.log("Teiresias:", teiresiasDist);
const { Tin } = await import(pathToFileURL(resolve(tinDist)).href);
const { estimateCrs, recommendTransformSetup } = await import(pathToFileURL(resolve(teiresiasDist)).href);

// ---------------------------------------------------------------------------------------------
// 1. 紙の定義（設計書 §3.1）
// ---------------------------------------------------------------------------------------------
const LCC = "+proj=lcc +lat_1=30 +lat_2=42 +lat_0=35 +lon_0=136 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs";
const SEED = 20270127;
const W = 2048; // 紙の画素数（正方形）
const PX = 1500; // 1 画素の大きさ（m）
const C = [W / 2, W / 2]; // 紙の中心の画素（東経 136 度・北緯 35 度）
const lcc = proj4("EPSG:4326", LCC);
const lonlat2lcc = ll => lcc.forward(ll);
const lcc2lonlat = xy => lcc.inverse(xy);
// 画素は角が原点の連続座標（画素の中心が (0.5, 0.5)）。world file の原点は左上画素の中心
const px2lcc = ([x, y]) => [PX * (x - C[0]), -PX * (y - C[1])];
const lcc2px = ([X, Y]) => [X / PX + C[0], -Y / PX + C[1]];
const WF_TRUE = { xScale: PX, xSkew: 0, xOrigin: PX * (0.5 - C[0]), ySkew: 0, yScale: -PX, yOrigin: PX * (C[1] - 0.5) };
const lonlat2px1 = ll => lcc2px(lonlat2lcc(ll)); // 経緯度 → P1 の画素
const px12lonlat = p => lcc2lonlat(px2lcc(p)); // P1 の画素 → 経緯度

const round = (v, d = 9) => Number(v.toFixed(d));
const r1 = v => Math.round(v * 10) / 10;
const r3 = v => Math.round(v * 1000) / 1000;

// 乱数（固定の種）
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(SEED);
const normal = (r = rng) => {
  const u = Math.max(r(), 1e-12), v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

// ---------------------------------------------------------------------------------------------
// 2. 海岸線（data/coast-lonlat.json。箱で切った陸地の環）
// ---------------------------------------------------------------------------------------------
const coastData = JSON.parse(readFileSync(join(here, "data/coast-lonlat.json"), "utf-8"));
const { box } = coastData;
const rings = coastData.rings;
function inLand(ll) {
  let inside = false;
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j];
      if (yi > ll[1] !== yj > ll[1] && ll[0] < ((xj - xi) * (ll[1] - yi)) / (yj - yi) + xi) inside = !inside;
    }
  }
  return inside;
}
// 箱の辺に沿う辺を除いて、描く折れ線（開いた鎖）にする
const onBoxEdge = (a, b) =>
  (a[0] === box.lon0 && b[0] === box.lon0) || (a[0] === box.lon1 && b[0] === box.lon1) ||
  (a[1] === box.lat0 && b[1] === box.lat0) || (a[1] === box.lat1 && b[1] === box.lat1);
function coastPolylines() {
  const out = [];
  for (const ring of rings) {
    const n = ring.length;
    const bad = ring.map((a, i) => onBoxEdge(a, ring[(i + 1) % n]));
    if (!bad.some(Boolean)) { out.push([...ring, ring[0]]); continue; }
    const start = (bad.findIndex(Boolean) + 1) % n; // 箱の辺に沿う辺の直後から回す
    let cur = [];
    for (let k = 0; k < n; k++) {
      const i = (start + k) % n;
      cur.push(ring[i]);
      if (bad[i]) { if (cur.length > 1) out.push(cur); cur = []; }
    }
  }
  return out;
}
// 経緯度の折れ線を d 度以下の間隔に細かくする
function densify(line, d) {
  const out = [line[0]];
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1], b = line[i];
    const n = Math.max(1, Math.ceil(Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])) / d));
    for (let s = 1; s <= n; s++) out.push([a[0] + ((b[0] - a[0]) * s) / n, a[1] + ((b[1] - a[1]) * s) / n]);
  }
  return out;
}
const COAST_LINES = coastPolylines().map(l => densify(l, 0.1));
const GRID_LINES = [];
for (let lon = box.lon0; lon <= box.lon1; lon += 2) GRID_LINES.push(densify([[lon, box.lat0], [lon, box.lat1]], 0.1));
for (let lat = box.lat0; lat <= box.lat1; lat += 2) GRID_LINES.push(densify([[box.lon0, lat], [box.lon1, lat]], 0.1));

// ---------------------------------------------------------------------------------------------
// 3. GCP（設計書 §3.3）。24 組。固定の種で散らばらせる（格子に並べない）
// ---------------------------------------------------------------------------------------------
const REGIONS = [
  // 密 14 組
  { name: "関東", dense: true, n: 5, lon: [138.6, 140.8], lat: [35.0, 37.0] },
  { name: "近畿", dense: true, n: 5, lon: [134.6, 136.4], lat: [34.2, 35.6] },
  { name: "九州北部", dense: true, n: 4, lon: [129.8, 131.4], lat: [32.8, 34.0] },
  // 疎 10 組
  { name: "東北", dense: false, n: 3, lon: [139.8, 141.6], lat: [37.0, 40.5] },
  { name: "中国", dense: false, n: 2, lon: [131.8, 134.5], lat: [34.6, 35.5] },
  { name: "四国", dense: false, n: 2, lon: [132.6, 134.4], lat: [33.3, 34.1] },
  { name: "北海道西部", dense: false, n: 3, lon: [140.0, 142.4], lat: [42.4, 44.4] }
];
const MIN_SEP = 40; // 画素
const truth = []; // { lonlat, px（P1 の真の画素）, region, dense }
for (const reg of REGIONS) {
  let placed = 0, tries = 0;
  while (placed < reg.n) {
    if (++tries > 20000) throw new Error(`GCP を置けません: ${reg.name}`);
    const ll = [reg.lon[0] + rng() * (reg.lon[1] - reg.lon[0]), reg.lat[0] + rng() * (reg.lat[1] - reg.lat[0])];
    if (!inLand(ll)) continue;
    const p = lonlat2px1(ll);
    if (truth.some(t => Math.hypot(t.px[0] - p[0], t.px[1] - p[1]) < MIN_SEP)) continue;
    truth.push({ lonlat: ll.map(v => r3(v)), px: p, region: reg.name, dense: reg.dense });
    placed++;
  }
}
// 紙の側の打つときの誤差（標準偏差 3 画素の正規乱数）
const noise = truth.map(() => [normal() * 3, normal() * 3]);
// 打ち間違い: 密な所の 1 組を 25 画素、疎な所の 1 組を 35 画素ずらす（向きは乱数）
const denseIdx = truth.map((t, i) => (t.dense ? i : -1)).filter(i => i >= 0);
const sparseIdx = truth.map((t, i) => (t.dense ? -1 : i)).filter(i => i >= 0);
const BLUNDERS = [
  { index: denseIdx[Math.floor(rng() * denseIdx.length)], size: 25 },
  { index: sparseIdx[Math.floor(rng() * sparseIdx.length)], size: 35 }
].map(b => {
  const a = rng() * 2 * Math.PI;
  return { ...b, d: [Math.cos(a) * b.size, Math.sin(a) * b.size] };
});

// ---------------------------------------------------------------------------------------------
// 4. 歪んだ紙 P2 の変位 d（設計書 §3.4）。P1 の画素 → P2 の画素
// ---------------------------------------------------------------------------------------------
const rIrr = mulberry32(SEED + 1);
const IRR = Array.from({ length: 4 }, (_, i) => {
  const freq = 1 + rIrr() * 2; // 紙の幅あたりの周期 1〜3（波長が紙の 1/3 以上）
  const dir = rIrr() * 2 * Math.PI;
  return { fx: freq * Math.cos(dir), fy: freq * Math.sin(dir), phase: rIrr() * 2 * Math.PI, axis: i % 2, amp: 0.5 + rIrr() * 0.5 };
});
const irrRaw = ([x, y]) => {
  const d = [0, 0];
  for (const t of IRR) d[t.axis] += t.amp * Math.sin(2 * Math.PI * ((t.fx * x + t.fy * y) / W) + t.phase);
  return d;
};
let irrScale = 0;
for (let j = 0; j <= 32; j++) for (let i = 0; i <= 32; i++) irrScale = Math.max(irrScale, Math.hypot(...irrRaw([(i / 32) * W, (j / 32) * W])));
irrScale = 12 / irrScale; // 振幅 12 画素
const DC = [truth.reduce((a, t) => a + t.px[0], 0) / truth.length, truth.reduce((a, t) => a + t.px[1], 0) / truth.length]; // 縮める中心は GCP の重心
const HULL_R = Math.max(...truth.map(t => Math.hypot(t.px[0] - DC[0], t.px[1] - DC[1]))); // 凸包の最遠点（r = 1）
// 設計書の 1/(1 + k·r²) のままでは、紙の四隅まで折り返さない範囲（k·r²<1）で score が 0.007 までしか上がらない
// （実測。k を上げて 0.03 に届くには k≈0.37 が要り、紙の四隅の外で折り返す）。また紙の中心を基準に縮め続けると、
// 紙の縁に写る元の範囲（P1 の画素）が海岸線の箱（東経 116〜158 度・北緯 18〜52 度）を大きく越える。
// そこで縮み方を r²·exp(1−r²)（r = 1 で最大 1・遠ざかると 0 に戻る）にし、GCP の重心を中心にする。
// k < 3.8 で折り返さない（r/(1+k·S) の導関数の分子 1 + k·e^(1−r²)(2r⁴−r²) が正）。
const satR2 = r => r * r * Math.exp(1 - r * r);
function makeD(k) {
  const D = p => {
    const dx = p[0] - DC[0], dy = p[1] - DC[1];
    const r = Math.hypot(dx, dy) / HULL_R;
    const f = 1 / (1 + k * satR2(r));
    const irr = irrRaw(p);
    return [DC[0] + dx * f + irr[0] * irrScale, DC[1] + dy * f + irr[1] * irrScale];
  };
  // 折り返さない範囲: r / (1 + k r²) が単調なのは k r² < 1。それより外は使わない
  const valid = () => true; // 飽和させたので折り返さない（四隅は下で確かめる）
  // 逆変換（ニュートン法。ヤコビアンは差分）
  const Dinv = q => {
    let p = [...q];
    for (let it = 0; it < 40; it++) {
      const f0 = D(p), e = [f0[0] - q[0], f0[1] - q[1]];
      if (Math.hypot(e[0], e[1]) < 1e-7) break;
      const h = 0.25;
      const fx = D([p[0] + h, p[1]]), fy = D([p[0], p[1] + h]);
      const a = (fx[0] - f0[0]) / h, b = (fy[0] - f0[0]) / h, c = (fx[1] - f0[1]) / h, d = (fy[1] - f0[1]) / h;
      const det = a * d - b * c;
      p = [p[0] - (d * e[0] - b * e[1]) / det, p[1] - (-c * e[0] + a * e[1]) / det];
    }
    return p;
  };
  return { D, Dinv, valid };
}

// ---------------------------------------------------------------------------------------------
// 5. score と推奨（Teiresias）。候補の CRS は紙の lcc ただ 1 つ
// ---------------------------------------------------------------------------------------------
async function scoreOf(pairs) {
  const candidate = { authority: "DEMO", code: "lcc" };
  const result = await estimateCrs(
    pairs.map(g => ({ pixel: g.pixel, geo: g.lonlat })),
    [candidate],
    { transformer: (_id, points) => points.map(p => lonlat2lcc([p[0], p[1]])) }
  );
  const rec = recommendTransformSetup(result);
  return { status: result.status, score: result.selected?.score ?? null, setups: rec.setups, reason: rec.reason };
}
const pairsOf = (pixels) => truth.map((t, i) => ({ pixel: pixels[i], lonlat: t.lonlat }));

// G1・G1c
const g1cPixels = truth.map((t, i) => [t.px[0] + noise[i][0], t.px[1] + noise[i][1]]);
const g1Pixels = g1cPixels.map((p, i) => {
  const b = BLUNDERS.find(x => x.index === i);
  return b ? [p[0] + b.d[0], p[1] + b.d[1]] : p;
});
// k: G2 の score が 0.025〜0.035（B と C の境の手前）の中ほど 0.030 になるように、二分法で決める
async function g2ScoreFor(k) {
  const { D } = makeD(k);
  return (await scoreOf(pairsOf(truth.map((t, i) => { const q = D(t.px); return [q[0] + noise[i][0], q[1] + noise[i][1]]; })))).score;
}
if (process.env.DEBUG_K) for (const k of [0.2,0.5,1,1.5,2,3]) console.log('k', k, await g2ScoreFor(k));
let kLo = 0.001, kHi = 3.5;
for (let it = 0; it < 30; it++) {
  const mid = (kLo + kHi) / 2;
  if ((await g2ScoreFor(mid)) < 0.03) kLo = mid; else kHi = mid;
}
const K = round((kLo + kHi) / 2, 5);
const { D, Dinv, valid: validD } = makeD(K);
const g2Pixels = truth.map((t, i) => { const q = D(t.px); return [q[0] + noise[i][0], q[1] + noise[i][1]]; });
// 折り返さないことの確かめ（紙の四隅まで）
for (const corner of [[0, 0], [W, 0], [0, W], [W, W]]) {
  if (!validD(Dinv(corner))) throw new Error(`k=${K} は紙の四隅で折り返します`);
}

const G = {
  g1: { pixels: g1Pixels, label: "G1（打ち間違い 2 組入り）" },
  g1c: { pixels: g1cPixels, label: "G1c（打ち間違いを直したもの）" },
  g2: { pixels: g2Pixels, label: "G2（歪んだ紙 P2 の上で打ったもの）" }
};
for (const key of Object.keys(G)) G[key].teiresias = await scoreOf(pairsOf(G[key].pixels));
console.log("k =", K, "score:", Object.fromEntries(Object.entries(G).map(([k, v]) => [k, v.teiresias])));

// ---------------------------------------------------------------------------------------------
// 6. 地図 JSON（設計書 §3.5）
// ---------------------------------------------------------------------------------------------
// A の world file: GCP からの最小二乗の相似（回転なし・南北反転）。lcc の座標で当てはめる
function fitSimilarity(pairs) {
  const pts = pairs.map(g => [g.pixel, lonlat2lcc(g.lonlat)]);
  const n = pts.length;
  let mx = 0, my = 0, mX = 0, mY = 0;
  for (const [[x, y], [X, Y]] of pts) { mx += x - 0.5; my += y - 0.5; mX += X; mY += Y; }
  mx /= n; my /= n; mX /= n; mY /= n;
  let num = 0, den = 0;
  for (const [[x, y], [X, Y]] of pts) {
    const dx = x - 0.5 - mx, dy = y - 0.5 - my;
    num += dx * (X - mX) - dy * (Y - mY);
    den += dx * dx + dy * dy;
  }
  const s = num / den;
  return { xScale: round(s, 9), xSkew: 0, xOrigin: round(mX - s * mx, 6), ySkew: 0, yScale: round(-s, 9), yOrigin: round(mY + s * my, 6) };
}
function compile(points, extra = {}) {
  const tin = new Tin({ wh: [W, W], yaxisMode: "invert", points, ...extra });
  tin.updateTin();
  return { compiled: tin.getCompiled(), diagnostics: tin.boundaryDiagnostics };
}
const CRS = { proj4: LCC };
const lccPoints = pairs => pairs.map(g => [g.pixel.map(v => round(v, 3)), lonlat2lcc(g.lonlat).map(v => round(v, 3))]);
const mercPoints = pairs => pairs.map(g => [g.pixel.map(v => round(v, 3)), lonlat2merc(g.lonlat).map(v => round(v, 3))]);

const pairsG1 = pairsOf(G.g1.pixels), pairsG1c = pairsOf(G.g1c.pixels), pairsG2 = pairsOf(G.g2.pixels);
const wfP1 = fitSimilarity(pairsG1);
const wfP2 = fitSimilarity(pairsG2);
const base = paper => ({
  attr: "合成の紙（デモ用・版権なし）。海岸線は Natural Earth（パブリックドメイン）",
  url: `tiles/layered_demo_${paper}/{z}/{x}/{y}.png`,
  imageExtension: "png",
  thumbnail: `tiles/layered_demo_${paper}/0/0/0.png`
});
const aMap = (title, paper, wf, pairs) => ({ title, ...base(paper), width: W, height: W, tinEnabled: false, crs: CRS, worldFile: wf, gcps: pairs.map(g => [g.pixel.map(v => round(v, 3)), g.lonlat]) });
const MAPS = {};
const DIAG = {};
const tinMap = (id, title, paper, compiledPack, withCrs = true) => {
  DIAG[id] = compiledPack.diagnostics;
  MAPS[id] = { title, ...base(paper), ...(withCrs ? { crs: CRS } : {}), compiled: compiledPack.compiled };
};
MAPS.layered_demo_p1_a = aMap("A: CRS＋world file だけ（紙 P1・GCP G1）", "p1", wfP1, pairsG1);
tinMap("layered_demo_p1_c", "C: CRS＋三角網・外は扇形（紙 P1・GCP G1）", "p1", compile(lccPoints(pairsG1)));
tinMap("layered_demo_p1c_d", "D: 3857 固定＋三角網（V2。紙 P1・GCP G1c）", "p1", compile(mercPoints(pairsG1c), { useV2Algorithm: true }), false);
tinMap("layered_demo_p1c_c", "C: CRS＋三角網・外は扇形（紙 P1・GCP G1c）", "p1", compile(lccPoints(pairsG1c)));
MAPS.layered_demo_p2_a = aMap("A: CRS＋world file だけ（紙 P2・GCP G2）", "p2", wfP2, pairsG2);
tinMap("layered_demo_p2_b", "B: CRS＋三角網・外は world file（紙 P2・GCP G2）", "p2", compile(lccPoints(pairsG2), { outerTransform: "worldFile", worldFile: wfP2 }));
tinMap("layered_demo_p2_c", "C: CRS＋三角網・外は扇形（紙 P2・GCP G2）", "p2", compile(lccPoints(pairsG2)));
if (MAPS.layered_demo_p2_b.compiled.outerTransform !== "worldFile") throw new Error("B が C に落ちました（k を下げる）: " + JSON.stringify(DIAG.layered_demo_p2_b));
for (const id of ["layered_demo_p1_c", "layered_demo_p1c_c", "layered_demo_p2_c"]) {
  if (MAPS[id].compiled.outerTransform !== "extrapolate" && MAPS[id].compiled.outerTransform !== undefined) throw new Error(`${id} の外周が扇形ではありません`);
}

mkdirSync(join(root, "public/maps"), { recursive: true });
for (const f of ["layered_demo_gcp_b", "layered_demo_gcp_c", "layered_demo_tin9", "layered_demo_wf3857", "layered_demo_wf4326"]) {
  rmSync(join(root, "public/maps", `${f}.json`), { force: true });
}
for (const [id, json] of Object.entries(MAPS)) writeFileSync(join(root, "public/maps", `${id}.json`), JSON.stringify(json) + "\n");

// ---------------------------------------------------------------------------------------------
// 7. 紙の折れ線と正解の折れ線（設計書 §3.4）。紙の画素と経緯度は頂点ごとに対応させる
// ---------------------------------------------------------------------------------------------
// 経緯度の折れ線 → 紙（paper = 1 or 2）の画素の折れ線。紙の矩形 [0,W]² で切り、切れ目の頂点は線形補間で足す
function onPaper(lines, paper) {
  const out = [];
  for (const line of lines) {
    const pts = line.map(ll => {
      const p1 = lonlat2px1(ll);
      if (paper === 1) return { ll, p: p1 };
      return validD(p1) ? { ll, p: D(p1) } : { ll, p: null };
    });
    let cur = null;
    const flush = () => { if (cur && cur.p.length > 1) out.push(cur); cur = null; };
    const push = (p, ll) => { cur ??= { p: [], ll: [] }; cur.p.push([r1(p[0]), r1(p[1])]); cur.ll.push([r3(ll[0]), r3(ll[1])]); };
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i], b = pts[i - 1];
      if (!a.p || !b.p) { flush(); continue; }
      const seg = clipSeg(b.p, a.p);
      if (!seg) { flush(); continue; }
      if (seg[0] > 0 || !cur) { flush(); push(lerp2(b.p, a.p, seg[0]), lerp2(b.ll, a.ll, seg[0])); }
      push(lerp2(b.p, a.p, seg[1]), lerp2(b.ll, a.ll, seg[1]));
      if (seg[1] < 1) flush();
    }
    flush();
  }
  return out;
}
const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
function clipSeg(a, b) {
  let t0 = 0, t1 = 1;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  for (const [p, q] of [[-dx, a[0]], [dx, W - a[0]], [-dy, a[1]], [dy, W - a[1]]]) {
    if (p === 0) { if (q < 0) return null; continue; }
    const t = q / p;
    if (p < 0) { if (t > t1) return null; if (t > t0) t0 = t; }
    else { if (t < t0) return null; if (t < t1) t1 = t; }
  }
  return t0 < t1 ? [t0, t1] : null;
}
const PAPER = {};
for (const paper of [1, 2]) {
  const coast = onPaper(COAST_LINES, paper), grid = onPaper(GRID_LINES, paper);
  PAPER[paper] = { coast, grid };
}
// 「全体」は、正解の線（青）が覆う範囲の 3857 の外接矩形
const wholeOf = paper => {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const l of [...PAPER[paper].coast, ...PAPER[paper].grid]) for (const ll of l.ll) {
    const m = lonlat2merc(ll);
    x0 = Math.min(x0, m[0]); x1 = Math.max(x1, m[0]); y0 = Math.min(y0, m[1]); y1 = Math.max(y1, m[1]);
  }
  return { lonlat: merc2lonlat([(x0 + x1) / 2, (y0 + y1) / 2]).map(r3), spanMerc: [Math.round(x1 - x0), Math.round(y1 - y0)] };
};
const WHOLE = { 1: wholeOf(1), 2: wholeOf(2) };
// 受け入れ条件の基準（設計書 §7）: 「全体」の視点で 3857 の面の幅が 600 画素のときの、1 画素の 3857 距離。
// 画面の「全体」は、正解の線が覆う範囲の幅に 12 % の余白を足して面の幅に合わせる（demo/layered-map.ts）
const VIEW_MARGIN = 1.12;
const mercPerPxOf = paper => (WHOLE[paper].spanMerc[0] * VIEW_MARGIN) / 600;
mkdirSync(join(root, "public/demo-data"), { recursive: true });
for (const paper of [1, 2]) {
  writeFileSync(
    join(root, "public/demo-data", `layered_demo_paper_p${paper}.json`),
    JSON.stringify({ size: W, coast: PAPER[paper].coast.map(l => l.p), grid: PAPER[paper].grid.map(l => l.p) }) + "\n"
  );
}
writeFileSync(
  join(root, "public/demo-data/layered_demo_coast.json"),
  JSON.stringify({
    source: "Natural Earth ne_50m_land（1:50m 陸地・パブリックドメイン。naturalearthdata.com）",
    note: "正解（経緯度）の折れ線。頂点は紙の折れ線（layered_demo_paper_p1・p2.json）と同じ順・同じ数で対応する",
    p1: { coast: PAPER[1].coast.map(l => l.ll), grid: PAPER[1].grid.map(l => l.ll) },
    p2: { coast: PAPER[2].coast.map(l => l.ll), grid: PAPER[2].grid.map(l => l.ll) }
  }) + "\n"
);

// ---------------------------------------------------------------------------------------------
// 8. 変換の誤差（設計書 §6.4）。紙の上の 65×65 点で、変換の結果と正解の距離
// ---------------------------------------------------------------------------------------------
const proj4Factory = proj4;
const transformsById = {};
for (const [id, json] of Object.entries(MAPS)) transformsById[id] = buildMapTransform(JSON.parse(JSON.stringify(json)), proj4Factory);
const trueMercOfPaper = (paper, q) => lonlat2merc(px12lonlat(paper === 1 ? q : Dinv(q)));
function convexHull(points) {
  const pts = points.map((p, i) => ({ p, i })).sort((a, b) => a.p[0] - b.p[0] || a.p[1] - b.p[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const q of pts) { while (lower.length >= 2 && cross(lower[lower.length - 2].p, lower[lower.length - 1].p, q.p) <= 0) lower.pop(); lower.push(q); }
  const upper = [];
  for (const q of [...pts].reverse()) { while (upper.length >= 2 && cross(upper[upper.length - 2].p, upper[upper.length - 1].p, q.p) <= 0) upper.pop(); upper.push(q); }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)].map(q => q.p);
}
function inHull(hull, p) {
  let sign = 0;
  for (let i = 0; i < hull.length; i++) {
    const a = hull[i], b = hull[(i + 1) % hull.length];
    const c = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
    if (c !== 0) { const s = Math.sign(c); if (sign === 0) sign = s; else if (s !== sign) return false; }
  }
  return true;
}
const N = 65;
const gridPixels = [];
for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) gridPixels.push([Math.min(W - 0.5, Math.max(0.5, (i / (N - 1)) * W)), Math.min(W - 0.5, Math.max(0.5, (j / (N - 1)) * W))]);
const statOf = errs => ({
  max: errs.length ? Math.max(...errs.map(e => e.km)) : 0,
  rms: errs.length ? Math.sqrt(errs.reduce((s, e) => s + e.km * e.km, 0) / errs.length) : 0,
  maxScreenPx: errs.length ? Math.max(...errs.map(e => e.screenPx)) : 0
});
function evaluate(id, paper, gKey) {
  const T = transformsById[id];
  const pairs = pairsOf(G[gKey].pixels);
  const hull = convexHull(pairs.map(g => g.pixel));
  const samples = gridPixels.map(q => {
    const m = T.xy2Merc(q);
    if (!m) throw new Error(`${id}: 変換できない画素 ${q}`);
    const t = trueMercOfPaper(paper, q);
    const km = haversineKm(merc2lonlat(m), merc2lonlat(t));
    return { q, m, t, km, screenPx: Math.hypot(m[0] - t[0], m[1] - t[1]) / mercPerPxOf(paper), inner: inHull(hull, q) };
  });
  const inner = samples.filter(s => s.inner), outer = samples.filter(s => !s.inner);
  const gcp = pairs.map(g => {
    const m = T.xy2Merc(g.pixel);
    const km = haversineKm(merc2lonlat(m), g.lonlat);
    return { km: r3(km), screenPx: r3(Math.hypot(m[0] - lonlat2merc(g.lonlat)[0], m[1] - lonlat2merc(g.lonlat)[1]) / mercPerPxOf(paper)) };
  });
  return { samples, hull, stats: { inner: statOf(inner), outer: statOf(outer), gcpMax: Math.max(...gcp.map(g => g.km)), gcpMaxScreenPx: Math.max(...gcp.map(g => g.screenPx)) }, gcp };
}
const EVAL = {
  layered_demo_p1_a: evaluate("layered_demo_p1_a", 1, "g1"),
  layered_demo_p1_c: evaluate("layered_demo_p1_c", 1, "g1"),
  layered_demo_p1c_d: evaluate("layered_demo_p1c_d", 1, "g1c"),
  layered_demo_p1c_c: evaluate("layered_demo_p1c_c", 1, "g1c"),
  layered_demo_p2_a: evaluate("layered_demo_p2_a", 2, "g2"),
  layered_demo_p2_b: evaluate("layered_demo_p2_b", 2, "g2"),
  layered_demo_p2_c: evaluate("layered_demo_p2_c", 2, "g2")
};
// 打ち間違いの周り（G1 の打ち間違いの真の画素から 250 画素以内の格子点）の最大
const nearBlunder = id => {
  const near = EVAL[id].samples.filter(s => BLUNDERS.some(b => Math.hypot(s.q[0] - truth[b.index].px[0], s.q[1] - truth[b.index].px[1]) < 250));
  return statOf(near);
};
// 2 つの型の差の最大の場所（見る場所「外側」の視点）。差は 3857 の距離（km は球面の距離）
function diffOuter(idA, idB, paper) {
  let best = null;
  const mA = EVAL[idA].samples, mB = EVAL[idB].samples;
  const inner = { max: 0 };
  let outerMax = { km: -1 };
  mA.forEach((s, i) => {
    const t = mB[i];
    const km = haversineKm(merc2lonlat(s.m), merc2lonlat(t.m));
    const screenPx = Math.hypot(s.m[0] - t.m[0], s.m[1] - t.m[1]) / mercPerPxOf(paper);
    if (s.inner) inner.max = Math.max(inner.max, km);
    else if (km > outerMax.km) outerMax = { km, screenPx, lonlat: merc2lonlat(s.m), q: s.q };
  });
  best = { innerMaxKm: inner.max, outerMaxKm: outerMax.km, outerMaxScreenPx: outerMax.screenPx, outerAt: { lonlat: outerMax.lonlat?.map(r3), pixel: outerMax.q } };
  return best;
}

// ---------------------------------------------------------------------------------------------
// 9. 原理（紙の画素のまま）: GCP の三角網・拡張範囲・四辺形・補助頂点・扇形の重心
// ---------------------------------------------------------------------------------------------
function principleOf(json) {
  if (json.tinEnabled === false) return { kind: "none" };
  const c = json.compiled;
  const aux = c.vertices_points.map(v => v[0].map(r1));
  const mean = aux.reduce((s, a) => [s[0] + a[0] / aux.length, s[1] + a[1] / aux.length], [0, 0]);
  const order = aux.map((a, i) => ({ i, ang: Math.atan2(a[1] - mean[1], a[0] - mean[0]) })).sort((x, y) => x.ang - y.ang).map(o => o.i);
  const tris = c.tins_points[0].map(t => ({
    v: t.map(x => (typeof x === "number" ? x : Number(String(x).slice(1)))),
    aux: t.map(x => typeof x !== "number")
  }));
  return {
    kind: c.outerTransform === "worldFile" ? "worldFile" : "fan",
    aux, ring: order,
    centroid: c.centroid_point?.[0] ? c.centroid_point[0].map(r1) : null,
    gcpTris: tris.filter(t => t.aux.every(a => !a)).map(t => t.v),
    extTris: tris.filter(t => t.aux.some(a => a)).map(t => t.v.map((v, i) => (t.aux[i] ? `b${v}` : v)))
  };
}

// ---------------------------------------------------------------------------------------------
// 10. meta
// ---------------------------------------------------------------------------------------------
const hullR = (hull) => hull.map(p => p.map(r1));
const metaMaps = {};
const MAP_DEF = {
  layered_demo_p1_a: { type: "a", paper: "p1", gcps: "g1" },
  layered_demo_p1_c: { type: "c", paper: "p1", gcps: "g1" },
  layered_demo_p1c_d: { type: "d", paper: "p1", gcps: "g1c" },
  layered_demo_p1c_c: { type: "c", paper: "p1", gcps: "g1c" },
  layered_demo_p2_a: { type: "a", paper: "p2", gcps: "g2" },
  layered_demo_p2_b: { type: "b", paper: "p2", gcps: "g2" },
  layered_demo_p2_c: { type: "c", paper: "p2", gcps: "g2" }
};
for (const [id, def] of Object.entries(MAP_DEF)) {
  const ev = EVAL[id];
  metaMaps[id] = {
    ...def,
    principle: principleOf(MAPS[id]),
    hull: hullR(ev.hull),
    stats: {
      inner: { maxKm: r3(ev.stats.inner.max), rmsKm: r3(ev.stats.inner.rms), maxScreenPx: r3(ev.stats.inner.maxScreenPx) },
      outer: { maxKm: r3(ev.stats.outer.max), rmsKm: r3(ev.stats.outer.rms), maxScreenPx: r3(ev.stats.outer.maxScreenPx) },
      gcpMaxKm: r3(ev.stats.gcpMax), gcpMaxScreenPx: r3(ev.stats.gcpMaxScreenPx),
      ...(def.paper === "p1" && def.gcps === "g1" ? { nearBlunder: { maxKm: r3(nearBlunder(id).max), maxScreenPx: r3(nearBlunder(id).maxScreenPx) } } : {})
    },
    gcpResidual: ev.gcp
  };
}
const gcpOut = key => truth.map((t, i) => {
  const b = BLUNDERS.find(x => x.index === i);
  return {
    no: i + 1,
    lonlat: t.lonlat,
    pixel: G[key].pixels[i].map(r1),
    region: t.region,
    dense: t.dense,
    ...(key === "g1" && b ? { blunder: { sizePx: b.size } } : {})
  };
});
const pairView = (idA, idB, paper) => {
  const d = diffOuter(idA, idB, paper);
  return { outerAt: d.outerAt, diff: { innerMaxKm: r3(d.innerMaxKm), outerMaxKm: r3(d.outerMaxKm), outerMaxScreenPx: r3(d.outerMaxScreenPx) } };
};
const demos = {
  1: { paper: "p1", gcps: "g1", types: ["a", "c"], maps: { a: "layered_demo_p1_a", c: "layered_demo_p1_c" }, teiresias: G.g1.teiresias, ...pairView("layered_demo_p1_a", "layered_demo_p1_c", 1) },
  2: { paper: "p1", gcps: "g1c", types: ["d", "c"], maps: { d: "layered_demo_p1c_d", c: "layered_demo_p1c_c" }, teiresias: G.g1c.teiresias, ...pairView("layered_demo_p1c_d", "layered_demo_p1c_c", 1) },
  3: { paper: "p2", gcps: "g2", types: ["a", "b"], maps: { a: "layered_demo_p2_a", b: "layered_demo_p2_b" }, teiresias: G.g2.teiresias, ...pairView("layered_demo_p2_a", "layered_demo_p2_b", 2) },
  4: { paper: "p2", gcps: "g2", types: ["b", "c"], maps: { b: "layered_demo_p2_b", c: "layered_demo_p2_c" }, teiresias: G.g2.teiresias, ...pairView("layered_demo_p2_b", "layered_demo_p2_c", 2) }
};
// 見る場所（画面は meta を読むだけ）。zoomDelta は「全体」の拡大率に足す（対数）
const views = {
  p1: { whole: WHOLE[1], outer: { lonlat: [145.5, 43.0], zoomDelta: 1.0, label: "北海道の東" } },
  p2: { whole: WHOLE[2], outer: { lonlat: demos[4].outerAt.lonlat, zoomDelta: 0.8, label: "紙の縁（B と C の差が最大の所）" } },
  blunders: BLUNDERS.map(b => ({ no: b.index + 1, lonlat: truth[b.index].lonlat, zoomDelta: 1.5 }))
};
const meta = {
  version: 1,
  note: "generate.mjs が作る。画面は読むだけ（座標・閾値を画面のコードに書かない）",
  seed: SEED,
  k: K,
  hullR: r1(HULL_R),
  paper: { size: W, metersPerPixel: PX, center: C, proj4: LCC, centerLonLat: [136, 35] },
  coastSource: "Natural Earth ne_50m_land（1:50m 陸地・パブリックドメイン。naturalearthdata.com）",
  screenRef: { widthPx: 600, margin: VIEW_MARGIN, mercPerPx: { p1: r1(mercPerPxOf(1)), p2: r1(mercPerPxOf(2)) }, note: "「全体」の視点で 3857 の面の幅が 600 画素のときの、1 画素の 3857 距離（m）。画面画素の数値はこれで割った値" },
  gcps: { g1: gcpOut("g1"), g1c: gcpOut("g1c"), g2: gcpOut("g2") },
  blunders: BLUNDERS.map(b => ({ no: b.index + 1, sizePx: b.size, truePixel: truth[b.index].px.map(r1), lonlat: truth[b.index].lonlat })),
  gcpSets: Object.fromEntries(Object.entries(G).map(([k, v]) => [k, { label: v.label, teiresias: v.teiresias }])),
  maps: metaMaps,
  demos,
  views,
  worldFiles: { p1: wfP1, p2: wfP2, truth: WF_TRUE }
};
writeFileSync(join(root, "public/demo-data/layered_demo_meta.json"), JSON.stringify(meta, null, 1) + "\n");

// ---------------------------------------------------------------------------------------------
// 11. 紙のタイル（z0〜3）。紙の折れ線から描く。画面の紙の面・3857 の赤い線と同じ元
// ---------------------------------------------------------------------------------------------
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  for (const paper of [1, 2]) {
    const dir = join(root, "public/tiles", `layered_demo_p${paper}`);
    rmSync(dir, { recursive: true, force: true });
    const tiles = await page.evaluate(({ W, coast, grid }) => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = W;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.fillRect(0, 0, W, W);
      const draw = (lines, width) => {
        ctx.strokeStyle = "#C1121F"; ctx.lineWidth = width; ctx.lineJoin = "round"; ctx.lineCap = "round";
        for (const l of lines) { ctx.beginPath(); l.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
      };
      draw(grid, 3);
      draw(coast, 6);
      ctx.strokeStyle = "#C1121F"; ctx.lineWidth = 6; ctx.strokeRect(3, 3, W - 6, W - 6);
      const out = {};
      for (let z = 0; z <= Math.log2(W / 256); z++) {
        const n = 2 ** z, size = W / n;
        for (let ty = 0; ty < n; ty++) for (let tx = 0; tx < n; tx++) {
          const tile = document.createElement("canvas");
          tile.width = tile.height = 256;
          const tctx = tile.getContext("2d");
          tctx.imageSmoothingQuality = "high";
          tctx.drawImage(canvas, tx * size, ty * size, size, size, 0, 0, 256, 256);
          out[`${z}/${tx}/${ty}`] = tile.toDataURL("image/png").split(",")[1];
        }
      }
      return out;
    }, { W, coast: PAPER[paper].coast.map(l => l.p), grid: PAPER[paper].grid.map(l => l.p) });
    for (const [key, b64] of Object.entries(tiles)) {
      const [z, x, y] = key.split("/");
      mkdirSync(join(dir, z, x), { recursive: true });
      writeFileSync(join(dir, z, x, `${y}.png`), Buffer.from(b64, "base64"));
    }
  }
} finally {
  await browser.close();
}
rmSync(join(root, "public/tiles/layered_demo_paper"), { recursive: true, force: true });

console.log(JSON.stringify({
  k: K, hullR: HULL_R, blunders: meta.blunders, teiresias: meta.gcpSets, diag: Object.fromEntries(Object.entries(DIAG).map(([k, v]) => [k, v ? Object.keys(v).length : null])),
  stats: Object.fromEntries(Object.entries(metaMaps).map(([k, v]) => [k, v.stats])),
  demos: Object.fromEntries(Object.entries(demos).map(([k, v]) => [k, { diff: v.diff, outerAt: v.outerAt }]))
}, null, 1));
