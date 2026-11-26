// 変換の形のデモ（layered-map.html）の海岸線の元データ（data/coast-lonlat.json）を作る。
// 出どころ: Natural Earth（naturalearthdata.com）の 1:50m の陸地（ne_50m_land）。パブリックドメイン。
// 手元に置いた ne_50m_land.geojson を切り出して丸めるだけで、ネットワークには出ない。切り出し結果は commit 済みなので、
// 普段は実行しなくてよい（generate.mjs は data/coast-lonlat.json を読む）。作り直すとき:
//   node demo/layered-map/make-coast.mjs <ne_50m_land.geojson へのパス>
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = process.argv[2];
if (!src) throw new Error("使い方: node demo/layered-map/make-coast.mjs <ne_50m_land.geojson>");

// 紙の範囲に余白を付けた経緯度の箱
const BOX = { lon0: 116, lon1: 158, lat0: 18, lat1: 52 };
const DP_TOLERANCE = 0.01; // 度。200 KB を超えたときだけ間引く
const SIZE_LIMIT = 200 * 1024;

// Sutherland–Hodgman（凸の窓なので、塗りの判定に使う多角形がそのまま得られる）
function clipRing(ring, inside, intersect) {
  const out = [];
  for (let i = 0; i < ring.length; i++) {
    const cur = ring[i], prev = ring[(i + ring.length - 1) % ring.length];
    const ci = inside(cur), pi = inside(prev);
    if (ci) {
      if (!pi) out.push(intersect(prev, cur));
      out.push(cur);
    } else if (pi) out.push(intersect(prev, cur));
  }
  return out;
}
const lerpAt = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
function clipToBox(ring) {
  let r = ring;
  const edges = [
    [p => p[0] >= BOX.lon0, (a, b) => lerpAt(a, b, (BOX.lon0 - a[0]) / (b[0] - a[0]))],
    [p => p[0] <= BOX.lon1, (a, b) => lerpAt(a, b, (BOX.lon1 - a[0]) / (b[0] - a[0]))],
    [p => p[1] >= BOX.lat0, (a, b) => lerpAt(a, b, (BOX.lat0 - a[1]) / (b[1] - a[1]))],
    [p => p[1] <= BOX.lat1, (a, b) => lerpAt(a, b, (BOX.lat1 - a[1]) / (b[1] - a[1]))]
  ];
  for (const [inside, intersect] of edges) {
    if (r.length === 0) break;
    r = clipRing(r, inside, intersect);
  }
  return r;
}
const round3 = v => Math.round(v * 1000) / 1000;
function dedupe(ring) {
  const out = [];
  for (const p of ring) {
    const q = [round3(p[0]), round3(p[1])];
    const last = out[out.length - 1];
    if (!last || last[0] !== q[0] || last[1] !== q[1]) out.push(q);
  }
  if (out.length > 1 && out[0][0] === out[out.length - 1][0] && out[0][1] === out[out.length - 1][1]) out.pop();
  return out;
}
function douglasPeucker(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop();
    let dmax = 0, idx = -1;
    const [ax, ay] = pts[s], [bx, by] = pts[e];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy);
    for (let i = s + 1; i < e; i++) {
      const d = len === 0 ? Math.hypot(pts[i][0] - ax, pts[i][1] - ay) : Math.abs(dy * (pts[i][0] - ax) - dx * (pts[i][1] - ay)) / len;
      if (d > dmax) { dmax = d; idx = i; }
    }
    if (dmax > tol && idx > 0) { keep[idx] = 1; stack.push([s, idx], [idx, e]); }
  }
  return pts.filter((_, i) => keep[i]);
}

const gj = JSON.parse(readFileSync(src, "utf-8"));
let rings = [];
for (const f of gj.features) {
  const g = f.geometry;
  const polys = g.type === "Polygon" ? [g.coordinates] : g.type === "MultiPolygon" ? g.coordinates : [];
  for (const poly of polys) {
    poly.forEach((ring, k) => {
      const clipped = dedupe(clipToBox(ring.slice(0, -1)));
      if (clipped.length >= 3) rings.push({ hole: k > 0, pts: clipped });
    });
  }
}
const serialize = rs => JSON.stringify({
  source: "Natural Earth ne_50m_land (1:50m 陸地・パブリックドメイン。naturalearthdata.com)",
  box: BOX,
  note: "箱で切った陸地の環（経度・緯度、小数 3 桁）。箱の辺に沿う辺を含む（塗りの判定用）。描くときは generate.mjs が箱の辺を除く",
  rings: rs.map(r => r.pts)
}).replace(/\],\[\[/g, "],\n[[").replace(/\]\],\[\[/g, "]],\n[[");
let text = serialize(rings);
if (Buffer.byteLength(text) > SIZE_LIMIT) {
  rings = rings.map(r => ({ ...r, pts: douglasPeucker(r.pts, DP_TOLERANCE) })).filter(r => r.pts.length >= 3);
  text = serialize(rings);
}
if (rings.some(r => r.hole)) console.warn("穴の環があります（偶奇規則で扱います）");
writeFileSync(join(resolve(here), "data/coast-lonlat.json"), text + "\n");
console.log("rings", rings.length, "points", rings.reduce((s, r) => s + r.pts.length, 0), "bytes", Buffer.byteLength(text));
