// 変換の形のデモ（layered-map.html）の素材を作る。実行は人間が手元で行わなくてよい（結果は
// public/maps/layered_demo_*.json と public/tiles/layered_demo_paper/ にコミット済み）。
// 作り直すとき:
//   cd <MaplatCore> && MAPLAT_TIN_DIST=<MaplatTin>/dist/maplat_tin.js node demo/layered-map/generate.mjs
// MaplatTin は素材（compiled）を作るためだけに使う。Core の依存ではない。
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const tinDist = process.env.MAPLAT_TIN_DIST;
if (!tinDist) throw new Error("MAPLAT_TIN_DIST に MaplatTin の dist/maplat_tin.js を指定してください");
const { Tin } = await import(pathToFileURL(resolve(tinDist)).href);

// ---- 紙: EPSG:4326 で描いた等間隔図。東経 125〜150 度・北緯 25〜50 度、2048×2048 画素 ----
const W = 2048;
const LON0 = 125, LON1 = 150, LAT0 = 25, LAT1 = 50;
const S = (LON1 - LON0) / W; // 1 画素の度数
// world file は左上画素の中心が原点（標準）。画素座標は角が原点の連続座標で、中心は (0.5, 0.5)
const WF_4326 = { xScale: S, xSkew: 0, xOrigin: LON0 + S / 2, ySkew: 0, yScale: -S, yOrigin: LAT1 - S / 2 };
const px2lonlat = ([x, y], wf = WF_4326) => [
  wf.xScale * (x - 0.5) + wf.xSkew * (y - 0.5) + wf.xOrigin,
  wf.ySkew * (x - 0.5) + wf.yScale * (y - 0.5) + wf.yOrigin
];
const R = 6378137;
const lonlat2merc = ([lon, lat]) => [
  (R * lon * Math.PI) / 180,
  R * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))
];
const round = (v, d = 9) => Number(v.toFixed(d));

// ---- (c) 4326 の紙を、3857 のアフィンで近似した world file（紙の全画素の中心で最小二乗）----
function fit3857() {
  // 東は経度に比例するので厳密。北は緯度の関数なので、全画素の行（j）に対する直線の最小二乗
  const n = W;
  let sj = 0, sy = 0, sjj = 0, sjy = 0;
  for (let j = 0; j < n; j++) {
    const y = lonlat2merc([0, LAT1 - S * (j + 0.5)])[1];
    sj += j; sy += y; sjj += j * j; sjy += j * y;
  }
  const yScale = (n * sjy - sj * sy) / (n * sjj - sj * sj);
  const yOrigin = (sy - yScale * sj) / n;
  const [x0] = lonlat2merc([LON0 + S / 2, 0]);
  const [x1] = lonlat2merc([LON0 + S * 1.5, 0]);
  return { xScale: x1 - x0, xSkew: 0, xOrigin: x0, ySkew: 0, yScale, yOrigin };
}
const WF_3857 = fit3857();

// ---- (a)・(c) の比較用の GCP（地図 JSON の gcps。変換には使わない記録）----
// 紙の全体に 4×4 点。地理側は「真の経緯度」＝(a) の world file が定める値。(a) の crs(4326) では経緯度、
// (c) の crs(3857) ではそれを 3857 の座標にしたもの。(a) は組の両側が一致し、(c) は最小二乗の残差としてずれる。
const gcpFrac = [0.1, 0.37, 0.63, 0.9];
const wfGcpPixels = gcpFrac.flatMap(fy => gcpFrac.map(fx => [round(W * fx, 3), round(W * fy, 3)]));
const gcps4326 = wfGcpPixels.map(p => [p, px2lonlat(p).map(v => round(v))]);
const gcps3857 = wfGcpPixels.map(p => [p, lonlat2merc(px2lonlat(p)).map(v => round(v, 3))]);

// ---- (b) 紙の内側 30%（中央の矩形）にだけ置いた 9 点（3×3）。真の値は world file から計算 ----
const lo = W * 0.35, hi = W * 0.65;
const grid9 = [lo, (lo + hi) / 2, hi];
const tin9Points = grid9.flatMap(y => grid9.map(x => [[round(x, 3), round(y, 3)], lonlat2merc(px2lonlat([x, y])).map(v => round(v, 3))]));
function compile(points, extra = {}) {
  const tin = new Tin({ wh: [W, W], yaxisMode: "invert", points, ...extra });
  tin.updateTin();
  return { compiled: tin.getCompiled(), diagnostics: tin.boundaryDiagnostics };
}
const tin9 = compile(tin9Points);

// ---- 4. 変換の形 B と C: 局所的に歪ませた GCP（5×5 を紙の中央 60% に）----
// 描き手が凸包の外へ向けて縮めた形: 中心から離れるほど縮尺が小さくなる（紙の 1 画素が表す距離が大きくなる）。
// 地理側の中心からのずれを (1 + 0.8·r²) 倍する（r は中心から制御点の外周の角までの距離を 1 とした比）。角で 1.8 倍。
// 0.8 は折り返さない範囲（r·(1+k·r²) が単調）の正の値で、B と C の外側の差が画面で分かる大きさにした。
const C0 = [W / 2, W / 2];
const gcpLo = W * 0.2, gcpStep = (W * 0.6) / 4;
const rMax = Math.hypot(W * 0.3, W * 0.3);
const centerLonLat = px2lonlat(C0);
const gcps = [];
for (let j = 0; j < 5; j++) {
  for (let i = 0; i < 5; i++) {
    const p = [gcpLo + i * gcpStep, gcpLo + j * gcpStep];
    const g = px2lonlat(p);
    const r = Math.hypot(p[0] - C0[0], p[1] - C0[1]) / rMax;
    const m = 1 + 0.8 * r * r;
    gcps.push([p.map(v => round(v, 3)), [round(centerLonLat[0] + (g[0] - centerLonLat[0]) * m), round(centerLonLat[1] + (g[1] - centerLonLat[1]) * m)]]);
  }
}
// B の world file: GCP の最小二乗の相似（回転なし・南北反転）。lon = s·(x−0.5)+ox、lat = −s·(y−0.5)+oy
function fitSimilarity(points) {
  const n = points.length;
  let mx = 0, my = 0, mlo = 0, mla = 0;
  for (const [[x, y], [a, b]] of points) { mx += x - 0.5; my += y - 0.5; mlo += a; mla += b; }
  mx /= n; my /= n; mlo /= n; mla /= n;
  let num = 0, den = 0;
  for (const [[x, y], [a, b]] of points) {
    const dx = x - 0.5 - mx, dy = y - 0.5 - my;
    num += dx * (a - mlo) - dy * (b - mla);
    den += dx * dx + dy * dy;
  }
  const s = num / den;
  return { xScale: round(s, 12), xSkew: 0, xOrigin: round(mlo - s * mx, 9), ySkew: 0, yScale: round(-s, 12), yOrigin: round(mla + s * my, 9) };
}
const WF_B = fitSimilarity(gcps);
const tinB = compile(gcps, { outerTransform: "worldFile", worldFile: WF_B });
const tinC = compile(gcps);
if (tinB.compiled.outerTransform !== "worldFile") throw new Error("B が C に落ちました: " + JSON.stringify(tinB.diagnostics));

// ---- 地図 JSON ----
const base = {
  attr: "合成の経緯線の画像（デモ用・版権なし）",
  url: "tiles/layered_demo_paper/{z}/{x}/{y}.png",
  imageExtension: "png",
  thumbnail: "tiles/layered_demo_paper/0/0/0.png"
};
const maps = {
  layered_demo_wf4326: {
    title: "(a) world file（EPSG:4326）",
    ...base, width: W, height: W,
    tinEnabled: false, crs: { epsg: 4326 }, worldFile: WF_4326,
    gcps: gcps4326
  },
  layered_demo_wf3857: {
    title: "(c) 3857 のアフィンで近似した world file",
    ...base, width: W, height: W,
    tinEnabled: false, crs: { epsg: 3857 },
    worldFile: Object.fromEntries(Object.entries(WF_3857).map(([k, v]) => [k, round(v, 6)])),
    gcps: gcps3857
  },
  layered_demo_tin9: {
    title: "(b) 中央 30% の 9 点の三角網（扇形の外挿）",
    ...base, compiled: tin9.compiled
  },
  layered_demo_gcp_b: {
    title: "B: 三角網＋四辺形の外は world file",
    ...base, crs: { epsg: 4326 }, compiled: tinB.compiled
  },
  layered_demo_gcp_c: {
    title: "C: 三角網＋四辺形の外は扇形",
    ...base, crs: { epsg: 4326 }, compiled: tinC.compiled
  }
};
mkdirSync(join(root, "public/maps"), { recursive: true });
for (const [id, json] of Object.entries(maps)) {
  writeFileSync(join(root, "public/maps", `${id}.json`), JSON.stringify(json, null, 1) + "\n");
}

// ---- 紙の画像（透明地に経緯線と度数。タイルに切る）----
const tilesDir = join(root, "public/tiles/layered_demo_paper");
rmSync(tilesDir, { recursive: true, force: true });
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const tiles = await page.evaluate(
    ({ W, LON0, LON1, LAT0, LAT1, S }) => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = W;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "rgba(255, 246, 214, 0.28)"; // 紙の範囲が背景と見分けられる程度の薄い地
      ctx.fillRect(0, 0, W, W);
      const xOf = lon => (lon - LON0) / S;
      const yOf = lat => (LAT1 - lat) / S;
      const line = (x0, y0, x1, y1, color, width) => {
        ctx.strokeStyle = color; ctx.lineWidth = width;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      };
      for (let lon = LON0; lon <= LON1; lon++) {
        const major = lon % 5 === 0;
        line(xOf(lon), 0, xOf(lon), W, major ? "rgba(200, 30, 30, 0.95)" : "rgba(200, 30, 30, 0.5)", major ? 4 : 1.5);
      }
      for (let lat = LAT0; lat <= LAT1; lat++) {
        const major = lat % 5 === 0;
        line(0, yOf(lat), W, yOf(lat), major ? "rgba(200, 30, 30, 0.95)" : "rgba(200, 30, 30, 0.5)", major ? 4 : 1.5);
      }
      ctx.font = "bold 30px sans-serif";
      ctx.lineJoin = "round";
      const label = (text, x, y, align) => {
        ctx.textAlign = align; ctx.textBaseline = "middle";
        ctx.lineWidth = 7; ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.strokeText(text, x, y);
        ctx.fillStyle = "#8a0f0f"; ctx.fillText(text, x, y);
      };
      for (let lon = LON0 + 5; lon < LON1; lon += 5) {
        label(`${lon}°E`, xOf(lon), 30, "center");
        label(`${lon}°E`, xOf(lon), W - 30, "center");
      }
      for (let lat = LAT0 + 5; lat < LAT1; lat += 5) {
        label(`${lat}°N`, 52, yOf(lat), "left");
        label(`${lat}°N`, W - 52, yOf(lat), "right");
      }
      // 各 5 度の交点に度数（紙のどこを見ているかが分かるように）
      ctx.font = "bold 24px sans-serif";
      for (let lon = LON0 + 5; lon < LON1; lon += 5) {
        for (let lat = LAT0 + 5; lat < LAT1; lat += 5) label(`${lon}E ${lat}N`, xOf(lon) + 8, yOf(lat) - 20, "left");
      }
      // 紙の縁
      ctx.strokeStyle = "#333"; ctx.lineWidth = 8; ctx.strokeRect(4, 4, W - 8, W - 8);
      // 256 画素のタイルへ。z=3 が原寸、z=0 が 1 枚（左上が x=0,y=0）
      const out = {};
      const maxZ = Math.log2(W / 256);
      for (let z = 0; z <= maxZ; z++) {
        const n = 2 ** z, size = W / n;
        for (let ty = 0; ty < n; ty++) {
          for (let tx = 0; tx < n; tx++) {
            const tile = document.createElement("canvas");
            tile.width = tile.height = 256;
            const tctx = tile.getContext("2d");
            tctx.imageSmoothingQuality = "high";
            tctx.drawImage(canvas, tx * size, ty * size, size, size, 0, 0, 256, 256);
            out[`${z}/${tx}/${ty}`] = tile.toDataURL("image/png").split(",")[1];
          }
        }
      }
      return out;
    },
    { W, LON0, LON1, LAT0, LAT1, S }
  );
  for (const [key, b64] of Object.entries(tiles)) {
    const [z, x, y] = key.split("/");
    mkdirSync(join(tilesDir, z, x), { recursive: true });
    writeFileSync(join(tilesDir, z, x, `${y}.png`), Buffer.from(b64, "base64"));
  }
} finally {
  await browser.close();
}
console.log("done", { WF_3857, WF_B, tinBdiag: tinB.diagnostics, tin9diag: tin9.diagnostics });
