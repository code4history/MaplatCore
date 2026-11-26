// 変換の形のデモ（layered-map.html）の素材を作る。設計書: 2026-11-26-jan27-layered-map-demo-redesign.md（v0.2）
// 結果は commit 済み（public/maps/layered_demo_*.json・public/demo-data/・public/tiles/layered_demo_p1・p2・p3）なので、
// 普段は実行しなくてよい。作り直すとき:
//   cd <MaplatCore> && node demo/layered-map/generate.mjs
// 前提（いずれも作業場所 jan27-crs-work の並び。違うときは環境変数で dist を直接指定する）:
//   - MaplatTin（MaplatTin-j1c = PR #88）の dist …… MAPLAT_TIN_DIST=<MaplatTin>/dist/maplat_tin.js
//   - Teiresias の dist（score と推奨を出す）……………… MAPLAT_TEIRESIAS_DIST=<Teiresias>/dist/index.js
//   - 未公開の @maplat/transform（createProj4ProjectionEngine を含む版。node_modules/@maplat/transform へつないだもの）
// MaplatTin と Teiresias は素材を作るためだけに使う。Core の依存ではない。ネットワークには出ない
// （背景に使う海岸線は data/coast-lonlat.json に切り出して commit 済み。出どころは Natural Earth の
// ne_50m_land、パブリックドメイン）。
//
// 作るもの:
//   紙 P1（正確な図）・P2（地方ごとの寄せ集め）・P3（中心を大きく描いた見取り図）。
//     どれもランベルト正角円錐図法（lcc）の 2048×2048 画素・1 画素 1,500 m
//   GCP: P1 用 24 組（G1 は打ち間違い 2 組入り・G1c はそれを直したもの）と、歪んだ図用 34 組（G2 は P2 の上で・G3 は P3 の上で打ったもの）
//   地図 JSON 9 つ（A・C／D・C／A・B・C／B・C）、紙の折れ線 3 つ、正解（経緯度）の折れ線、紙のタイル、meta
//   生成のときの検査: B が C に落ちていない・B と C の内側の差が 1 km 未満・折り返しが無い（ヤコビアンの行列式）
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import proj4 from "proj4";
import { chromium } from "@playwright/test";
import { buildMapTransform, haversineKm, lonlat2merc, merc2lonlat } from "./engine.ts";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const tinDist = process.env.MAPLAT_TIN_DIST ?? resolve(root, "..", "MaplatTin-j1c", "dist/maplat_tin.js");
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
const normal = r => {
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
// 3. GCP（設計書 §3.3）。固定の種で散らばらせる（格子に並べない）
// ---------------------------------------------------------------------------------------------
const MIN_SEP = 40; // 画素
function placeGcps(regions, rand) {
  const out = []; // { lonlat, px（P1 の真の画素）, region, dense }
  for (const reg of regions) {
    let placed = 0, tries = 0;
    while (placed < reg.n) {
      if (++tries > 20000) throw new Error(`GCP を置けません: ${reg.name}`);
      const ll = [reg.lon[0] + rand() * (reg.lon[1] - reg.lon[0]), reg.lat[0] + rand() * (reg.lat[1] - reg.lat[0])];
      if (!inLand(ll)) continue;
      const p = lonlat2px1(ll);
      if (out.some(t => Math.hypot(t.px[0] - p[0], t.px[1] - p[1]) < MIN_SEP)) continue;
      out.push({ lonlat: ll.map(v => r3(v)), px: p, region: reg.name, dense: reg.dense });
      placed++;
    }
  }
  return out;
}

// P1 用 24 組（G1・G1c）。乱数の列は v0.1 と同じ（地点 → 誤差 → 打ち間違いの順）
const REGIONS_P1 = [
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
const rng1 = mulberry32(SEED);
const T1 = placeGcps(REGIONS_P1, rng1);
// 紙の側の打つときの誤差（標準偏差 3 画素の正規乱数）
const noise1 = T1.map(() => [normal(rng1) * 3, normal(rng1) * 3]);
// 打ち間違い: 密な所の 1 組を 25 画素、疎な所の 1 組を 35 画素ずらす（向きは乱数）
const denseIdx = T1.map((t, i) => (t.dense ? i : -1)).filter(i => i >= 0);
const sparseIdx = T1.map((t, i) => (t.dense ? -1 : i)).filter(i => i >= 0);
const BLUNDERS = [
  { index: denseIdx[Math.floor(rng1() * denseIdx.length)], size: 25 },
  { index: sparseIdx[Math.floor(rng1() * sparseIdx.length)], size: 35 }
].map(b => {
  const a = rng1() * 2 * Math.PI;
  return { ...b, d: [Math.cos(a) * b.size, Math.sin(a) * b.size] };
});

// 歪んだ図用 34 組（G2・G3）。P1 用の乱数の列を変えないよう、別の種（SEED + 2）。地点 → 誤差の順に引く。
// 歪みの単位（地方）ごとに 3 組以上が入る。置かない所: 沖縄・朝鮮半島・大陸（四辺形の外の比較の場所）
const REGIONS_DIST = [
  { name: "九州", dense: true, n: 5, lon: [129.8, 131.8], lat: [31.3, 33.9] },
  { name: "四国", dense: false, n: 3, lon: [132.6, 134.4], lat: [33.0, 34.2] },
  { name: "中国", dense: false, n: 4, lon: [131.2, 134.5], lat: [34.2, 35.5] },
  { name: "近畿", dense: true, n: 4, lon: [134.6, 136.4], lat: [33.8, 35.6] },
  { name: "中部・北陸", dense: false, n: 5, lon: [136.5, 138.8], lat: [34.8, 37.3] },
  { name: "関東", dense: true, n: 4, lon: [138.8, 140.8], lat: [35.2, 36.9] },
  { name: "東北", dense: false, n: 5, lon: [139.8, 141.8], lat: [37.2, 41.2] },
  { name: "北海道", dense: false, n: 4, lon: [140.2, 145.0], lat: [42.2, 45.0] }
];
const rng2 = mulberry32(SEED + 2);
const T2 = placeGcps(REGIONS_DIST, rng2);
const noise2 = T2.map(() => [normal(rng2) * 3, normal(rng2) * 3]);
console.log(`GCP: P1 用 ${T1.length} 組・歪んだ図用 ${T2.length} 組`);

// ---------------------------------------------------------------------------------------------
// 4. 歪んだ紙 P2・P3 の変位（設計書 §3.4）。P1 の画素 → 紙の画素
// ---------------------------------------------------------------------------------------------
// P2 地方ごとの寄せ集め。地方ごとに縮尺・向き・位置が少しずつ違う。遠くは P1 と同じ（cover → 0）
const P2_BLOCKS = [
  { name: "西日本", at: [131.8, 33.4], sigma: 156, s: 1.16, rot: -11.2, t: [-16, 16] },
  { name: "中日本", at: [137.0, 35.5], sigma: 144, s: 1.064, rot: 4.8, t: [0, 0] },
  { name: "東北", at: [140.8, 39.0], sigma: 132, s: 0.888, rot: 16.0, t: [32, 0] },
  { name: "北海道", at: [142.5, 43.4], sigma: 144, s: 0.776, rot: -9.6, t: [-16, 48] }
];
const P2_COVER0 = 0.3; // cover(p) = W / (0.3 + W)
// 相似（縮尺・回転・平行移動）の最小二乗: q ≈ a·p + b（複素数）。a = ar + i·ai
function fitSim(P, Q) {
  const n = P.length;
  const mp = [0, 0], mq = [0, 0];
  P.forEach((p, i) => { mp[0] += p[0] / n; mp[1] += p[1] / n; mq[0] += Q[i][0] / n; mq[1] += Q[i][1] / n; });
  let nr = 0, ni = 0, d = 0;
  P.forEach((p, i) => {
    const x = p[0] - mp[0], y = p[1] - mp[1], X = Q[i][0] - mq[0], Y = Q[i][1] - mq[1];
    nr += X * x + Y * y; ni += Y * x - X * y; d += x * x + y * y;
  });
  const ar = nr / d, ai = ni / d;
  return { ar, ai, bx: mq[0] - ar * mp[0] + ai * mp[1], by: mq[1] - ai * mp[0] - ar * mp[1] };
}
function makeD2(P) {
  const B = P2_BLOCKS.map(b => {
    const th = (b.rot * Math.PI) / 180;
    return { c: lonlat2px1(b.at), sig: b.sigma, cos: b.s * Math.cos(th), sin: b.s * Math.sin(th), t: b.t };
  });
  // S は相似（4 係数）。G2 の 34 地点で、p → D2(p) の相似の最小二乗が恒等になるように決める（8 回の繰り返し）
  const mk = S => p => {
    let sw = 0, bx = 0, by = 0;
    for (const b of B) {
      const x = p[0] - b.c[0], y = p[1] - b.c[1];
      const w = Math.exp(-(x * x + y * y) / (2 * b.sig * b.sig));
      sw += w;
      bx += w * (b.c[0] + b.cos * x - b.sin * y + b.t[0]);
      by += w * (b.c[1] + b.sin * x + b.cos * y + b.t[1]);
    }
    const cover = sw / (P2_COVER0 + sw);
    const sx = S.ar * p[0] - S.ai * p[1] + S.bx, sy = S.ai * p[0] + S.ar * p[1] + S.by;
    return [p[0] + cover * (bx / sw - sx), p[1] + cover * (by / sw - sy)];
  };
  let S = { ar: 1, ai: 0, bx: 0, by: 0 };
  for (let it = 0; it < 8; it++) {
    const f = fitSim(P, P.map(mk(S)));
    S = { ar: S.ar + f.ar - 1, ai: S.ai + f.ai, bx: S.bx + f.bx, by: S.by + f.by };
  }
  const f = fitSim(P, P.map(mk(S)));
  return { D: mk(S), S, residual: { scale: f.ar - 1, rot: f.ai, tx: f.bx, ty: f.by } };
}
// P3 中心を大きく描いた見取り図。中心 c0 は G3 の 34 地点の P1 の画素の重心
const P3_A = 0.5, P3_RHO = 235;
const makeD3 = c0 => p => {
  const x = p[0] - c0[0], y = p[1] - c0[1];
  const f = 1 + (P3_A / (1 - P3_A)) * Math.exp(-(x * x + y * y) / (P3_RHO * P3_RHO));
  return [c0[0] + x * f, c0[1] + y * f];
};
// 逆変換（ニュートン法。ヤコビアンは差分）
function invertOf(D) {
  return q => {
    let p = [...q];
    for (let it = 0; it < 60; it++) {
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
}
// 折り返しの検査: 紙とその周り 600 画素で、ヤコビアンの行列式の最小（0.3 を超えること）
function minJacobian(D, lo = -600, hi = W + 600, n = 80) {
  let m = Infinity;
  for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) {
    const p = [lo + ((hi - lo) * i) / n, lo + ((hi - lo) * j) / n];
    const f0 = D(p), fx = D([p[0] + 1, p[1]]), fy = D([p[0], p[1] + 1]);
    m = Math.min(m, (fx[0] - f0[0]) * (fy[1] - f0[1]) - (fy[0] - f0[0]) * (fx[1] - f0[1]));
  }
  return m;
}
const centroid = pts => [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length];
const T2px = T2.map(t => t.px);
const { D: D2, S: S2, residual: S2res } = makeD2(T2px);
const C0 = centroid(T2px);
const D3 = makeD3(C0);
// 紙 → 歪み（P1 の画素 → 紙の画素）と逆変換
const PAPERS = {
  1: { D: p => p, Dinv: q => q, name: "p1" },
  2: { D: D2, Dinv: invertOf(D2), name: "p2" },
  3: { D: D3, Dinv: invertOf(D3), name: "p3" }
};
const JAC = { 2: minJacobian(D2), 3: minJacobian(D3) };
console.log("P2 の S（相似）:", S2, "残り:", S2res);
console.log("P3 の中心 c0 =", C0.map(r1), "経緯度", px12lonlat(C0).map(r3));
console.log("ヤコビアンの行列式の最小（0.3 を超えること）: P2", JAC[2].toFixed(3), " P3", JAC[3].toFixed(3));
for (const k of [2, 3]) if (!(JAC[k] > 0.3)) throw new Error(`P${k} が折り返しています（ヤコビアンの行列式の最小 ${JAC[k]}）`);
for (const k of [2, 3]) {
  const disp = T2.map(t => Math.hypot(PAPERS[k].D(t.px)[0] - t.px[0], PAPERS[k].D(t.px)[1] - t.px[1]));
  console.log(`P${k}: GCP の地点での動きの最大 ${Math.max(...disp).toFixed(1)} 画素（${(Math.max(...disp) * 1.5).toFixed(0)} km）`);
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

// GCP の組。pixels は紙の側（打つときの誤差入り）、truth は地理側と P1 の真の画素
const g1cPixels = T1.map((t, i) => [t.px[0] + noise1[i][0], t.px[1] + noise1[i][1]]);
const g1Pixels = g1cPixels.map((p, i) => {
  const b = BLUNDERS.find(x => x.index === i);
  return b ? [p[0] + b.d[0], p[1] + b.d[1]] : p;
});
const distPixels = D => T2.map((t, i) => { const q = D(t.px); return [q[0] + noise2[i][0], q[1] + noise2[i][1]]; });
const G = {
  g1: { pixels: g1Pixels, truth: T1, paper: 1, label: "G1（打ち間違い 2 組入り）" },
  g1c: { pixels: g1cPixels, truth: T1, paper: 1, label: "G1c（打ち間違いを直したもの）" },
  g2: { pixels: distPixels(D2), truth: T2, paper: 2, label: "G2（地方ごとの寄せ集め P2 の上で打ったもの）" },
  g3: { pixels: distPixels(D3), truth: T2, paper: 3, label: "G3（中心を大きく描いた見取り図 P3 の上で打ったもの）" }
};
const pairsOf = g => g.truth.map((t, i) => ({ pixel: g.pixels[i], lonlat: t.lonlat }));
for (const key of Object.keys(G)) G[key].teiresias = await scoreOf(pairsOf(G[key]));
console.log("score:", Object.fromEntries(Object.entries(G).map(([k, v]) => [k, { score: v.teiresias.score?.toFixed(4), setups: v.teiresias.setups }])));

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

const pairsG1 = pairsOf(G.g1), pairsG1c = pairsOf(G.g1c), pairsG2 = pairsOf(G.g2), pairsG3 = pairsOf(G.g3);
const wfP1 = fitSimilarity(pairsG1);
const wfP2 = fitSimilarity(pairsG2);
const wfP3 = fitSimilarity(pairsG3);
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
MAPS.layered_demo_p1_a = aMap("CRS（紙 P1・GCP G1）", "p1", wfP1, pairsG1);
tinMap("layered_demo_p1_c", "三角網＋扇形外挿（紙 P1・GCP G1）", "p1", compile(lccPoints(pairsG1)));
tinMap("layered_demo_p1c_d", "従来型（3857 固定＋三角網。V2。紙 P1・GCP G1c）", "p1", compile(mercPoints(pairsG1c), { useV2Algorithm: true }), false);
tinMap("layered_demo_p1c_c", "三角網＋扇形外挿（紙 P1・GCP G1c）", "p1", compile(lccPoints(pairsG1c)));
MAPS.layered_demo_p2_a = aMap("CRS（紙 P2・GCP G2）", "p2", wfP2, pairsG2);
tinMap("layered_demo_p2_b", "三角網＋大域外挿（紙 P2・GCP G2）", "p2", compile(lccPoints(pairsG2), { outerTransform: "worldFile", worldFile: wfP2 }));
tinMap("layered_demo_p2_c", "三角網＋扇形外挿（紙 P2・GCP G2）", "p2", compile(lccPoints(pairsG2)));
tinMap("layered_demo_p3_b", "三角網＋大域外挿（紙 P3・GCP G3）", "p3", compile(lccPoints(pairsG3), { outerTransform: "worldFile", worldFile: wfP3 }));
tinMap("layered_demo_p3_c", "三角網＋扇形外挿（紙 P3・GCP G3）", "p3", compile(lccPoints(pairsG3)));
for (const id of ["layered_demo_p2_b", "layered_demo_p3_b"]) {
  if (MAPS[id].compiled.outerTransform !== "worldFile") throw new Error(`${id} が扇形に落ちました（歪みを弱める）: ` + JSON.stringify(DIAG[id]));
}
for (const id of ["layered_demo_p1_c", "layered_demo_p1c_c", "layered_demo_p2_c", "layered_demo_p3_c"]) {
  if (MAPS[id].compiled.outerTransform !== "extrapolate" && MAPS[id].compiled.outerTransform !== undefined) throw new Error(`${id} の外周が扇形ではありません`);
}

// ---------------------------------------------------------------------------------------------
// 7. 紙の折れ線と正解の折れ線（設計書 §3.4）。紙の画素と経緯度は頂点ごとに対応させる
// ---------------------------------------------------------------------------------------------
// 経緯度の折れ線 → 紙（paper = 1・2・3）の画素の折れ線。紙の矩形 [0,W]² で切り、切れ目の頂点は線形補間で足す
function onPaper(lines, paper) {
  const out = [];
  const D = PAPERS[paper].D;
  for (const line of lines) {
    const pts = line.map(ll => ({ ll, p: D(lonlat2px1(ll)) }));
    let cur = null;
    const flush = () => { if (cur && cur.p.length > 1) out.push(cur); cur = null; };
    const push = (p, ll) => { cur ??= { p: [], ll: [] }; cur.p.push([r1(p[0]), r1(p[1])]); cur.ll.push([r3(ll[0]), r3(ll[1])]); };
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i], b = pts[i - 1];
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
for (const paper of [1, 2, 3]) PAPER[paper] = { coast: onPaper(COAST_LINES, paper), grid: onPaper(GRID_LINES, paper) };
// 「全体」は、正解の線（青）が覆う範囲の 3857 の外接矩形
const wholeOf = paper => {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const l of [...PAPER[paper].coast, ...PAPER[paper].grid]) for (const ll of l.ll) {
    const m = lonlat2merc(ll);
    x0 = Math.min(x0, m[0]); x1 = Math.max(x1, m[0]); y0 = Math.min(y0, m[1]); y1 = Math.max(y1, m[1]);
  }
  return { lonlat: merc2lonlat([(x0 + x1) / 2, (y0 + y1) / 2]).map(r3), spanMerc: [Math.round(x1 - x0), Math.round(y1 - y0)] };
};
const WHOLE = { 1: wholeOf(1), 2: wholeOf(2), 3: wholeOf(3) };
// 受け入れ条件の基準（設計書 §7）: 「全体」の視点で 3857 の面の幅が 600 画素のときの、1 画素の 3857 距離。
// 画面の「全体」は、正解の線が覆う範囲の幅に 12 % の余白を足して面の幅に合わせる（demo/layered-map.ts）
const VIEW_MARGIN = 1.12;
const mercPerPxOf = paper => (WHOLE[paper].spanMerc[0] * VIEW_MARGIN) / 600;

// ---------------------------------------------------------------------------------------------
// 8. 変換の誤差（設計書 §6.4）。紙の上の 65×65 点で、変換の結果と正解の距離
// ---------------------------------------------------------------------------------------------
const transformsById = {};
for (const [id, json] of Object.entries(MAPS)) transformsById[id] = buildMapTransform(JSON.parse(JSON.stringify(json)), proj4);
const trueLonLatOfPaper = (paper, q) => px12lonlat(PAPERS[paper].Dinv(q));
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
  n: errs.length,
  max: errs.length ? Math.max(...errs.map(e => e.km)) : 0,
  rms: errs.length ? Math.sqrt(errs.reduce((s, e) => s + e.km * e.km, 0) / errs.length) : 0,
  maxScreenPx: errs.length ? Math.max(...errs.map(e => e.screenPx)) : 0
});
const MAP_DEF = {
  layered_demo_p1_a: { type: "a", paper: "p1", gcps: "g1" },
  layered_demo_p1_c: { type: "c", paper: "p1", gcps: "g1" },
  layered_demo_p1c_d: { type: "d", paper: "p1", gcps: "g1c" },
  layered_demo_p1c_c: { type: "c", paper: "p1", gcps: "g1c" },
  layered_demo_p2_a: { type: "a", paper: "p2", gcps: "g2" },
  layered_demo_p2_b: { type: "b", paper: "p2", gcps: "g2" },
  layered_demo_p2_c: { type: "c", paper: "p2", gcps: "g2" },
  layered_demo_p3_b: { type: "b", paper: "p3", gcps: "g3" },
  layered_demo_p3_c: { type: "c", paper: "p3", gcps: "g3" }
};
// 構造の原理（紙の画素のまま）: GCP の三角網・拡張範囲・四辺形・補助頂点・扇形の重心
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
const PRINCIPLE = Object.fromEntries(Object.keys(MAPS).map(id => [id, principleOf(MAPS[id])]));
function evaluate(id) {
  const def = MAP_DEF[id];
  const g = G[def.gcps];
  const paper = g.paper;
  const T = transformsById[id];
  const pairs = pairsOf(g);
  const hull = convexHull(pairs.map(p => p.pixel));
  // 四辺形（補助頂点の輪）。B・C だけ。D は紙の四隅の外にあり、紙の中がすべて四辺形の中になる
  const quad = (def.type === "b" || def.type === "c") ? convexHull(PRINCIPLE[id].aux) : null;
  const samples = gridPixels.map(q => {
    const m = T.xy2Merc(q);
    if (!m) throw new Error(`${id}: 変換できない画素 ${q}`);
    const tll = trueLonLatOfPaper(paper, q);
    const t = lonlat2merc(tll);
    const km = haversineKm(merc2lonlat(m), tll);
    const inner = inHull(hull, q);
    return {
      q, m, t, km, screenPx: Math.hypot(m[0] - t[0], m[1] - t[1]) / mercPerPxOf(paper),
      inner, land: inLand(tll), beyond: !inner && quad ? !inHull(quad, q) : false
    };
  });
  const inner = samples.filter(s => s.inner), outer = samples.filter(s => !s.inner);
  const gcp = pairs.map(p => {
    const m = T.xy2Merc(p.pixel);
    const km = haversineKm(merc2lonlat(m), p.lonlat);
    return { km: r3(km), screenPx: r3(Math.hypot(m[0] - lonlat2merc(p.lonlat)[0], m[1] - lonlat2merc(p.lonlat)[1]) / mercPerPxOf(paper)) };
  });
  return {
    samples, hull, quad, gcp,
    stats: {
      inner: statOf(inner),
      innerLand: statOf(inner.filter(s => s.land)),
      outer: statOf(outer),
      beyondQuad: quad ? statOf(outer.filter(s => s.beyond)) : null,
      gcpMax: Math.max(...gcp.map(x => x.km)),
      gcpMaxScreenPx: Math.max(...gcp.map(x => x.screenPx))
    }
  };
}
const EVAL = Object.fromEntries(Object.keys(MAPS).map(id => [id, evaluate(id)]));
// 打ち間違いの周り（G1 の打ち間違いの真の画素から 250 画素以内の格子点）の最大
const nearBlunder = id => {
  const near = EVAL[id].samples.filter(s => BLUNDERS.some(b => Math.hypot(s.q[0] - T1[b.index].px[0], s.q[1] - T1[b.index].px[1]) < 250));
  return statOf(near);
};
// 2 つの型の差の最大の場所（見る場所「外側」の視点）。差は 3857 の距離（km は球面の距離）
function diffOuter(idA, idB, paper) {
  const mA = EVAL[idA].samples, mB = EVAL[idB].samples;
  let innerMax = 0;
  let outerMax = { km: -1 };
  mA.forEach((s, i) => {
    const t = mB[i];
    const km = haversineKm(merc2lonlat(s.m), merc2lonlat(t.m));
    const screenPx = Math.hypot(s.m[0] - t.m[0], s.m[1] - t.m[1]) / mercPerPxOf(paper);
    if (s.inner) innerMax = Math.max(innerMax, km);
    else if (km > outerMax.km) outerMax = { km, screenPx, lonlat: merc2lonlat(s.m), q: s.q };
  });
  return { innerMaxKm: innerMax, outerMaxKm: outerMax.km, outerMaxScreenPx: outerMax.screenPx, outerAt: { lonlat: outerMax.lonlat?.map(r3), pixel: outerMax.q } };
}
// 検査: B と C の内側が同じ（凸包の中の格子点で、差の最大が 1 km 未満）。Tin は外周の補助頂点が変わると
// 凸包の辺の制約の外し方が変わり、内側の三角網まで変わることがある
const innerDiff = {};
for (const [idB, idC] of [["layered_demo_p2_b", "layered_demo_p2_c"], ["layered_demo_p3_b", "layered_demo_p3_c"]]) {
  innerDiff[idB] = diffOuter(idB, idC, G[MAP_DEF[idB].gcps].paper).innerMaxKm;
  console.log(`B と C の内側の差の最大（${idB} と ${idC}）: ${innerDiff[idB].toFixed(3)} km`);
  if (!(innerDiff[idB] < 1)) throw new Error(`${idB} と ${idC} の内側が 1 km 以上違います（${innerDiff[idB]} km）。歪みを弱めてください`);
}

// ---------------------------------------------------------------------------------------------
// 9. 書き出し（検査を通ってから）
// ---------------------------------------------------------------------------------------------
mkdirSync(join(root, "public/maps"), { recursive: true });
for (const f of ["layered_demo_gcp_b", "layered_demo_gcp_c", "layered_demo_tin9", "layered_demo_wf3857", "layered_demo_wf4326"]) {
  rmSync(join(root, "public/maps", `${f}.json`), { force: true });
}
for (const [id, json] of Object.entries(MAPS)) writeFileSync(join(root, "public/maps", `${id}.json`), JSON.stringify(json) + "\n");
mkdirSync(join(root, "public/demo-data"), { recursive: true });
for (const paper of [1, 2, 3]) {
  writeFileSync(
    join(root, "public/demo-data", `layered_demo_paper_p${paper}.json`),
    JSON.stringify({ size: W, coast: PAPER[paper].coast.map(l => l.p), grid: PAPER[paper].grid.map(l => l.p) }) + "\n"
  );
}
writeFileSync(
  join(root, "public/demo-data/layered_demo_coast.json"),
  JSON.stringify({
    source: "Natural Earth ne_50m_land（1:50m 陸地・パブリックドメイン。naturalearthdata.com）",
    note: "正解（経緯度）の折れ線。頂点は紙の折れ線（layered_demo_paper_p1・p2・p3.json）と同じ順・同じ数で対応する",
    p1: { coast: PAPER[1].coast.map(l => l.ll), grid: PAPER[1].grid.map(l => l.ll) },
    p2: { coast: PAPER[2].coast.map(l => l.ll), grid: PAPER[2].grid.map(l => l.ll) },
    p3: { coast: PAPER[3].coast.map(l => l.ll), grid: PAPER[3].grid.map(l => l.ll) }
  }) + "\n"
);

// ---------------------------------------------------------------------------------------------
// 10. meta
// ---------------------------------------------------------------------------------------------
const hullR = hull => hull.map(p => p.map(r1));
const statMeta = s => ({ maxKm: r3(s.max), rmsKm: r3(s.rms), maxScreenPx: r3(s.maxScreenPx), n: s.n });
const metaMaps = {};
for (const [id, def] of Object.entries(MAP_DEF)) {
  const ev = EVAL[id];
  metaMaps[id] = {
    ...def,
    principle: PRINCIPLE[id],
    hull: hullR(ev.hull),
    stats: {
      inner: statMeta(ev.stats.inner),
      innerLand: statMeta(ev.stats.innerLand),
      outer: statMeta(ev.stats.outer),
      ...(ev.stats.beyondQuad ? { beyondQuad: statMeta(ev.stats.beyondQuad) } : {}),
      gcpMaxKm: r3(ev.stats.gcpMax), gcpMaxScreenPx: r3(ev.stats.gcpMaxScreenPx),
      ...(def.paper === "p1" && def.gcps === "g1" ? { nearBlunder: statMeta(nearBlunder(id)) } : {})
    },
    gcpResidual: ev.gcp
  };
}
const gcpOut = key => G[key].truth.map((t, i) => {
  const b = key === "g1" ? BLUNDERS.find(x => x.index === i) : undefined;
  return {
    no: i + 1,
    lonlat: t.lonlat,
    pixel: G[key].pixels[i].map(r1),
    region: t.region,
    dense: t.dense,
    ...(b ? { blunder: { sizePx: b.size } } : {})
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
  4: { paper: "p2", gcps: "g2", types: ["b", "c"], maps: { b: "layered_demo_p2_b", c: "layered_demo_p2_c" }, teiresias: G.g2.teiresias, ...pairView("layered_demo_p2_b", "layered_demo_p2_c", 2) },
  5: { paper: "p3", gcps: "g3", types: ["b", "c"], maps: { b: "layered_demo_p3_b", c: "layered_demo_p3_c" }, teiresias: G.g3.teiresias, ...pairView("layered_demo_p3_b", "layered_demo_p3_c", 3) }
};
// 見る場所（画面は meta を読むだけ）。zoomDelta は「全体」の拡大率に足す（対数）
const views = {
  p1: { whole: WHOLE[1], outer: { lonlat: [145.5, 43.0], zoomDelta: 1.0, label: "北海道の東" } },
  p2: { whole: WHOLE[2], outer: { lonlat: demos[4].outerAt.lonlat, zoomDelta: 0.8, label: "紙の縁（2 つの型の差が最大の所）" } },
  p3: { whole: WHOLE[3], outer: { lonlat: demos[5].outerAt.lonlat, zoomDelta: 0.8, label: "紙の縁（2 つの型の差が最大の所）" } },
  blunders: BLUNDERS.map(b => ({ no: b.index + 1, lonlat: T1[b.index].lonlat, zoomDelta: 1.5 }))
};
const meta = {
  version: 2,
  note: "generate.mjs が作る。画面は読むだけ（座標・閾値を画面のコードに書かない）",
  seed: SEED,
  paper: { size: W, metersPerPixel: PX, center: C, proj4: LCC, centerLonLat: [136, 35] },
  distortion: {
    p2: { blocks: P2_BLOCKS, cover0: P2_COVER0, similarity: S2, similarityResidual: S2res, minJacobian: r3(JAC[2]) },
    p3: { center: C0.map(r1), centerLonLat: px12lonlat(C0).map(r3), a: P3_A, rho: P3_RHO, minJacobian: r3(JAC[3]) }
  },
  coastSource: "Natural Earth ne_50m_land（1:50m 陸地・パブリックドメイン。naturalearthdata.com）",
  screenRef: { widthPx: 600, margin: VIEW_MARGIN, mercPerPx: { p1: r1(mercPerPxOf(1)), p2: r1(mercPerPxOf(2)), p3: r1(mercPerPxOf(3)) }, note: "「全体」の視点で 3857 の面の幅が 600 画素のときの、1 画素の 3857 距離（m）。画面画素の数値はこれで割った値" },
  gcps: { g1: gcpOut("g1"), g1c: gcpOut("g1c"), g2: gcpOut("g2"), g3: gcpOut("g3") },
  blunders: BLUNDERS.map(b => ({ no: b.index + 1, sizePx: b.size, truePixel: T1[b.index].px.map(r1), lonlat: T1[b.index].lonlat })),
  gcpSets: Object.fromEntries(Object.entries(G).map(([k, v]) => [k, { label: v.label, teiresias: v.teiresias }])),
  maps: metaMaps,
  demos,
  views,
  innerDiffKm: Object.fromEntries(Object.entries(innerDiff).map(([k, v]) => [k, r3(v)])),
  worldFiles: { p1: wfP1, p2: wfP2, p3: wfP3, truth: WF_TRUE }
};
writeFileSync(join(root, "public/demo-data/layered_demo_meta.json"), JSON.stringify(meta, null, 1) + "\n");

// ---------------------------------------------------------------------------------------------
// 11. 紙のタイル（z0〜3）。紙の折れ線から描く。画面の紙の面・3857 の赤い線と同じ元
// ---------------------------------------------------------------------------------------------
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  for (const paper of [1, 2, 3]) {
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

const fmt = s => (s ? `${s.maxKm} (rms ${s.rmsKm}, n=${s.n})` : "-");
console.log(JSON.stringify({
  blunders: meta.blunders,
  score: Object.fromEntries(Object.entries(meta.gcpSets).map(([k, v]) => [k, { score: v.teiresias.score, setups: v.teiresias.setups }])),
  diag: Object.fromEntries(Object.entries(DIAG).map(([k, v]) => [k, v ? Object.keys(v).length : null])),
  stats: Object.fromEntries(Object.entries(metaMaps).map(([k, v]) => [k, {
    inner: fmt(v.stats.inner), innerLand: fmt(v.stats.innerLand), outer: fmt(v.stats.outer), beyondQuad: fmt(v.stats.beyondQuad),
    gcpMax: v.stats.gcpMaxKm, ...(v.stats.nearBlunder ? { nearBlunder: fmt(v.stats.nearBlunder) } : {})
  }])),
  demos: Object.fromEntries(Object.entries(demos).map(([k, v]) => [k, { diff: v.diff, outerAt: v.outerAt }]))
}, null, 1));
