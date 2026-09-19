#!/usr/bin/env node
// scripts/verify-demo-content.js
// oct26-m11-t3 の検査正本（設計 2026-09-18-oct26-m11-t3-design.md §8）。
// CommonJS・単一ファイル・Node 標準モジュールのみ。実行直後に exit 0/1 を返す。
// 検査モード（フラグ）: --schema / --independence / --verify / --extent / --source / --kindmaps / --image / --selftest
// フラグ無し（または --all）: selftest 以外の全検査を実行する。

import fs from "node:fs";
import path from "node:path";

const REGIONS = ["morioka", "nobeoka", "nara", "tatebayashi", "hiroshima"];
let fails = 0;
function must(cond, msg) {
  if (!cond) {
    console.error("FAIL: " + msg);
    fails++;
  }
}

// ---- allowlist（集合外 = FAIL。denylist にしない）----
const KINDS = new Set(["festival", "walk", "feature"]);
const AREAS = new Set(["point", "precinct", "castle"]);
const SRCS = new Set(["osm", "gsi_address"]);

// 閾値はこの 1 箇所だけに持つ（素材 JSON に書かない。§4.1・§4.2）
const LIMIT_M = { point: 50, precinct: 150, castle: 300 };

// 写真ライセンス（v2.1）: 別フィールド imageLicense の完全一致だけで判定（部分一致にしない。§4.6）
const IMAGE_LICENSES = new Set([
  "CC0 1.0",
  "CC BY 2.0", "CC BY 2.1 JP", "CC BY 2.5", "CC BY 3.0", "CC BY 4.0",
  "CC BY-SA 2.0", "CC BY-SA 2.1 JP", "CC BY-SA 2.5", "CC BY-SA 3.0", "CC BY-SA 4.0",
  "PD",
]);
function licenseOk(x) {
  return typeof x === "string" && IMAGE_LICENSES.has(x);
}

// 距離（equirectangular。±1 m の照合に足りる）
function distM(lng1, lat1, lng2, lat2) {
  const R = 6371000, rad = Math.PI / 180;
  const x = (lng2 - lng1) * rad * Math.cos((lat1 + lat2) / 2 * rad);
  const y = (lat2 - lat1) * rad;
  return Math.sqrt(x * x + y * y) * R;
}

// ---- 素材の読み込み ----
function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function contentFiles() {
  if (!fs.existsSync("demo/content")) return [];
  return fs.readdirSync("demo/content").filter(f => f.endsWith(".json")).map(f => path.join("demo/content", f));
}
function loadContents() {
  const out = [];
  for (const p of contentFiles()) {
    out.push({ path: p, data: readJson(p) });
  }
  return out;
}

// POI の表示名を取り出す（string か {ja,en}）
function nameText(p) {
  const n = p && p.name;
  if (typeof n === "string") return n;
  if (n && typeof n === "object") return (n.ja || n.en || "");
  return "";
}
function nameNonEmpty(p) {
  const t = nameText(p);
  return typeof t === "string" && t.trim() !== "";
}

// 素材 JSON から POI を列挙する（検証対象の全 POI）
function allPois(content) {
  const pois = [];
  const c = content.data;
  const push = (p, where) => { if (p) pois.push({ poi: p, where }); };
  if (Array.isArray(c.mapPois)) c.mapPois.forEach((p, i) => push(p, `${content.path}#mapPois[${i}]`));
  if (Array.isArray(c.appPois)) c.appPois.forEach((p, i) => push(p, `${content.path}#appPois[${i}]`));
  if (c.demoOps) {
    const ops = c.demoOps;
    if (Array.isArray(ops.addPoi)) ops.addPoi.forEach((x, i) => push(x && x.poi, `${content.path}#demoOps.addPoi[${i}].poi`));
    // v2.3（HR-23）: movePoi は座標を持たない（参照する線の端点を使う）ので POI の照合対象から外した
  }
  return pois;
}
// v2.3（HR-20/21）: 線はアプリの線 appLines と地図の線 mapLines の 2 配列
function allLines(content) {
  const lines = [];
  const c = content.data;
  if (Array.isArray(c.appLines)) c.appLines.forEach((x, i) => lines.push({ item: x, where: `${content.path}#appLines[${i}]` }));
  if (Array.isArray(c.mapLines)) c.mapLines.forEach((x, i) => lines.push({ item: x, where: `${content.path}#mapLines[${i}]` }));
  return lines;
}
function allVectors(content) {
  const vecs = [];
  const ops = content.data.demoOps;
  if (ops && Array.isArray(ops.addVector)) ops.addVector.forEach((x, i) => vecs.push({ item: x, where: `${content.path}#demoOps.addVector[${i}]` }));
  return vecs;
}

// 地域ファイルごとの POI 分母（設計 §4.1: 各ファイルの POI が 1 件以上）
function regionPoiOk(content) {
  return allPois(content).length >= 1;
}

// ---- AC8 schema ----
function checkSchema(contents) {
  for (const content of contents) {
    const c = content.data;
    must(typeof c.region === "string" && REGIONS.includes(c.region), `${content.path}: region が不正: ${JSON.stringify(c.region)}`);
    for (const { poi: p, where } of allPois(content)) {
      must(typeof p.lat === "number" && isFinite(p.lat), `${where}: lat が数値でない`);
      must(typeof p.lng === "number" && isFinite(p.lng), `${where}: lng が数値でない`);
      must(nameNonEmpty(p), `${where}: name が空`);
      must(typeof p.desc === "string" && p.desc.trim() !== "", `${where}: desc が空`);
      must(typeof p.source === "string" && p.source.trim() !== "", `${where}: source が空`);
      must(p.verify && typeof p.verify.area === "string" && AREAS.has(p.verify.area), `${where}: verify.area が非空・値域外`);
      must(p.verify && Array.isArray(p.verify.sources) && p.verify.sources.length >= 1, `${where}: verify.sources が非空配列でない`);
    }
    must(regionPoiOk(content), `${content.path}: POI が 1 件も無い（地域ごとに 1 件以上必須）`);
    for (const { item: l, where } of allLines(content)) {
      must(Array.isArray(l.points) && l.points.length >= 2, `${where}: points が 2 点未満`);
      must(l.points.every(pt => Array.isArray(pt) && pt.length === 2 && typeof pt[0] === "number" && typeof pt[1] === "number"), `${where}: points が [lng,lat] 配列でない`);
      must(typeof l.kind === "string" && KINDS.has(l.kind), `${where}: kind が allowlist 外`);
      must(typeof l.source === "string" && l.source.trim() !== "", `${where}: source が空`);
    }
    for (const { item: v, where } of allVectors(content)) {
      must(Array.isArray(v.points) && v.points.length >= 2, `${where}: points が 2 点未満`);
      must(v.points.every(pt => Array.isArray(pt) && pt.length === 2 && typeof pt[0] === "number" && typeof pt[1] === "number"), `${where}: points が [lng,lat] 配列でない`);
      must(typeof v.kind === "string" && KINDS.has(v.kind), `${where}: kind が allowlist 外`);
      must(typeof v.source === "string" && v.source.trim() !== "", `${where}: source が空`);
    }
    // v2.3: movePoi の形（label・line・from/to 不在）は checkScope（AC-T3-11）が見る
  }
  if (fails === 0) console.log("OK: schema");
}

// ---- AC9 independence ----
function checkIndependence(contents) {
  for (const content of contents) {
    // 単独で JSON.parse できるか（loadContents で parse 済みだが、生テキストでも照査）
    const raw = fs.readFileSync(content.path, "utf8");
    try { JSON.parse(raw); } catch (e) { must(false, `${content.path}: 単独で JSON.parse できない: ${e.message}`); }
    // 「*.json」を含む文字列（他 JSON ファイル参照）が 0 件であること（grepZero 相当）
    must(!/\.json/i.test(raw), `${content.path}: 「*.json」参照文字列を含む（他ファイル参照）`);
  }
  if (fails === 0) console.log("OK: independence");
}

// ---- AC-T3-5 verify（§4.1 の checkPoi）----
// rec は陽性対照用の失敗コレクタ（既定は本番の must）。--selftest は rec に静かなカウンタを渡し、
// 「壊れた距離／query／閾値が checkPoi で FAIL になること」を本番の must に混ぜずに検証する。
function checkPoi(p, where, rec) {
  const f = rec || must;
  const v = p && p.verify;
  f(v && AREAS.has(v.area), `${where}: verify.area が値域外`);
  const srcs = (v && Array.isArray(v.sources)) ? v.sources : [];
  f(srcs.length >= 1, `${where}: verify.sources が 0 件`);
  let within = false;
  for (const s of srcs) {
    f(SRCS.has(s.src), `${where}: src が値域外 ${s.src}`);
    f(Array.isArray(s.coord) && s.coord.length === 2 && typeof s.coord[0] === "number" && typeof s.coord[1] === "number", `${where}: coord が [lng,lat] でない`);
    const d = distM(p.lng, p.lat, s.coord[0], s.coord[1]);
    f(typeof s.distanceM === "number" && Math.abs(d - s.distanceM) <= 1, `${where}: distanceM が再計算値と合わない (再計算 ${d.toFixed(2)}m vs 記録 ${s.distanceM})`);
    const key = s.src === "osm" ? nameText(p) : p.address;
    f(typeof s.query === "string" && s.query !== "" && typeof key === "string" && key !== "" && s.query.includes(key), `${where}: query が name/address を含まない (query=${JSON.stringify(s.query)}, key=${JSON.stringify(key)})`);
    if (v && AREAS.has(v.area) && d <= LIMIT_M[v.area]) within = true;
  }
  f(within, `${where}: どの経路も閾値以内でない`);
}
function checkVerify(contents) {
  for (const content of contents) {
    must(regionPoiOk(content), `${content.path}: POI が 1 件も無い（地域ごとに 1 件以上必須）`);
    for (const { poi: p, where } of allPois(content)) {
      checkPoi(p, where);
    }
  }
  if (fails === 0) console.log("OK: verify");
}

// ---- AC-T3-7 source の形式 ----
function sourceOk(s) {
  if (typeof s !== "string" || s.trim() === "") return false;
  if (/http/i.test(s)) return true;                       // URL
  if (s.includes("／")) return true;                       // 書誌マーカー（発行元区切り）
  if (/[12][0-9]{3}/.test(s)) return true;                 // 4 桁年代
  return false;
}
function checkSource(contents) {
  for (const content of contents) {
    for (const { poi: p, where } of allPois(content)) {
      must(sourceOk(p.source), `${where}: source の形式が不備: ${JSON.stringify(p.source)}`);
    }
    for (const { item: l, where } of allLines(content)) {
      must(sourceOk(l.source), `${where}: source の形式が不備: ${JSON.stringify(l.source)}`);
    }
    for (const { item: v, where } of allVectors(content)) {
      must(sourceOk(v.source), `${where}: source の形式が不備: ${JSON.stringify(v.source)}`);
    }
  }
  if (fails === 0) console.log("OK: source");
}

// ---- AC-T3-8 kind/maps の allowlist ----
function regionSources(region) {
  const app = readJson(`public/apps/${region}.json`);
  const srcs = Array.isArray(app.sources) ? app.sources : [];
  const mapIDs = new Set();
  for (const s of srcs) {
    if (typeof s === "string") mapIDs.add(s);
    else if (s && typeof s.mapID === "string") mapIDs.add(s.mapID);
  }
  return mapIDs;
}
function checkKindmaps(contents) {
  for (const content of contents) {
    const region = content.data.region;
    const mapIDs = regionSources(region);
    for (const { item: l, where } of allLines(content)) {
      must(typeof l.kind === "string" && KINDS.has(l.kind), `${where}: kind が allowlist 外`);
      if (Array.isArray(l.maps)) {
        for (const mid of l.maps) {
          must(typeof mid === "string" && mapIDs.has(mid), `${where}: maps の mapID が当該地域 sources に実在しない: ${JSON.stringify(mid)}`);
        }
      }
    }
    for (const { item: v, where } of allVectors(content)) {
      must(typeof v.kind === "string" && KINDS.has(v.kind), `${where}: kind が allowlist 外`);
    }
  }
  if (fails === 0) console.log("OK: kindmaps");
}

// ---- AC-T3-10 写真の権利表示 ----
function checkImage(contents) {
  for (const content of contents) {
    for (const { poi: p, where } of allPois(content)) {
      if (p.image === undefined || p.image === null) continue;
      must(typeof p.image === "string" && p.image !== "", `${where}: image が空`);
      must(fs.existsSync(path.join("public", p.image)), `${where}: 写真ファイルが無い: public/${p.image}`);
      must(licenseOk(p.imageLicense), `${where}: imageLicense が allowlist と完全一致しない: ${JSON.stringify(p.imageLicense)}`);
      const c = typeof p.imageCredit === "string" ? p.imageCredit : "";
      must(c !== "" && /http/i.test(c), `${where}: imageCredit が空か出典 URL が無い`);
    }
  }
  if (fails === 0) console.log("OK: image");
}

// ---- AC-T3-6 範囲検査（§5.2）----
function mercToLngLat(x, y) {
  const lng = x / 20037508.342789 * 180;
  const lat = (360 / Math.PI) * Math.atan(Math.exp(y / 6378137)) - 90;
  return [lng, lat];
}
// compiled が vertices_params（bbox0〜3）形式（例: 1953_nobeoka）のとき、mercator の bbox 角を拾う。
// 紙座標（幅〜10^4）と mercator（〜10^7）を magnitude で峻別する。
function mercBboxFromCompiled(compiled) {
  const pts = new Map();
  (function collect(o) {
    if (o && typeof o === "object") {
      if (Array.isArray(o.geom) && o.geom.length === 2 && typeof o.index === "string" && o.index.startsWith("bbox") && Math.abs(o.geom[0]) > 1000000) {
        if (!pts.has(o.index)) pts.set(o.index, o.geom);
      }
      for (const k of Object.keys(o)) collect(o[k]);
    } else if (Array.isArray(o)) {
      for (const x of o) collect(x);
    }
  })(compiled);
  return [...pts.values()];
}
function bboxOf(points) {
  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
  for (const pt of points) {
    const lng = pt[0], lat = pt[1];
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }
  return { minLng, maxLng, minLat, maxLat };
}
const PAD = 0.02; // +0.02°（約 2 km）
function regionUnion(region, recordFails) {
  const app = readJson(`public/apps/${region}.json`);
  const srcs = Array.isArray(app.sources) ? app.sources : [];
  const mapIDs = [];
  for (const s of srcs) {
    if (typeof s === "string") { if (s !== "gsi" && s !== "osm") mapIDs.push(s); }
    else if (s && typeof s.mapID === "string") mapIDs.push(s.mapID);
  }
  must(mapIDs.length >= 1, `region ${region}: 古地図 mapID が 1 件も無い（sources が空）`);
  let union = null;
  for (const mid of mapIDs) {
    const mpPath = `public/maps/${mid}.json`;
    if (!fs.existsSync(mpPath)) { if (recordFails) must(false, `region ${region}: 地図設定が無い: ${mpPath}`); continue; }
    const mp = readJson(mpPath);
    let pts = null;
    if (Array.isArray(mp.envelopeLngLats) && mp.envelopeLngLats.length > 0) {
      pts = mp.envelopeLngLats;
    } else if (mp.compiled && Array.isArray(mp.compiled.points) && mp.compiled.points.length > 0) {
      pts = mp.compiled.points.map(p => mercToLngLat(p[1][0], p[1][1]));
    } else if (mp.compiled) {
      const m = mercBboxFromCompiled(mp.compiled);
      if (m.length > 0) pts = m.map(([x, y]) => mercToLngLat(x, y));
      else { if (recordFails) must(false, `region ${region}: 地図 ${mid} の範囲を導出できない（envelopeLngLats も compiled.points も vertices_params bbox も無い）`); continue; }
    } else {
      if (recordFails) must(false, `region ${region}: 地図 ${mid} の範囲を導出できない（envelopeLngLats も compiled.points も無い）`);
      continue;
    }
    let b = bboxOf(pts);
    b = { minLng: b.minLng - PAD, maxLng: b.maxLng + PAD, minLat: b.minLat - PAD, maxLat: b.maxLat + PAD };
    if (!union) union = b;
    else union = { minLng: Math.min(union.minLng, b.minLng), maxLng: Math.max(union.maxLng, b.maxLng), minLat: Math.min(union.minLat, b.minLat), maxLat: Math.max(union.maxLat, b.maxLat) };
  }
  return union;
}
function vertexInside(pt, union) {
  return pt[0] >= union.minLng && pt[0] <= union.maxLng && pt[1] >= union.minLat && pt[1] <= union.maxLat;
}
function checkExtent(contents) {
  // 前置 assert: 並行 worktree で app/map 設定が無い場合は分母不足 FAIL（偽緑にしない）
  for (const r of REGIONS) {
    must(fs.existsSync(`public/apps/${r}.json`), `missing public/apps/${r}.json`);
  }
  const unions = {};
  for (const r of REGIONS) {
    unions[r] = regionUnion(r, true);
  }
  for (const content of contents) {
    const region = content.data.region;
    const union = unions[region];
    if (!union) { must(false, `${content.path}: 地域 ${region} の範囲を導出できない`); continue; }
    for (const { item: l, where } of allLines(content)) {
      for (const pt of l.points) {
        must(vertexInside(pt, union), `${where}: 範囲外頂点 [${pt[0]},${pt[1]}]（地域 ${region} union [${union.minLng},${union.maxLng}]×[${union.minLat},${union.maxLat}]）`);
      }
    }
    for (const { item: v, where } of allVectors(content)) {
      for (const pt of v.points) {
        must(vertexInside(pt, union), `${where}: 範囲外頂点 [${pt[0]},${pt[1]}]`);
      }
    }
    // v2.3: movePoi の始点・終点は参照する appLines の端点なので、上の線の検査に含まれる
  }
  if (fails === 0) console.log("OK: extent");
}

// ---- AC-T3-11 アプリ用／地図用の区分・移動ピン（v2.5・HR-20〜23・IR3 Major-1・HR-25/3・HR-25/4）----
// v2.4: 古地図ごとの「範囲に入るか」はここでは見ない。対応点の外接矩形は Core の実描画と両方向にずれ
// （矩形の内なのに描かれない点が最大 924 m、矩形の外なのに描かれる点が 1500 m 超。t3 v2.4 §5.7.1）、判定に使えないため。
// 範囲は Core の実描画で t4 §7.5 AC20(10) が見る。ここでは maps・clipped の形と区分の規則だけを見る。
// v2.5: 地図用 POI は古地図にだけ置く（gsi/osm は不可。HR-25/4）。線は古地図ごとに範囲で切った部分 clipped を持てる（HR-25/3）
const BASEMAPS = new Set(["gsi", "osm"]);
// 点 p が折れ線 pts の上にあれば位置（辺の番号＋辺の中の比 0〜1）を返す。無ければ null（許容は経緯度 1e-6 度＝約 0.1 m）
function posOnLine(pts, p) {
  const TOL = 1e-6;
  for (let i = 0; i + 1 < pts.length; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
    const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
    const t = L2 === 0 ? 0 : Math.max(0, Math.min(1, ((p[0] - ax) * dx + (p[1] - ay) * dy) / L2));
    if (Math.hypot(ax + dx * t - p[0], ay + dy * t - p[1]) <= TOL) return i + t;
  }
  return null;
}
// rec(cond, msg): 本番は must、selftest は静かなカウンタを渡す（checkPoi と同じ作り）
function scopeFails(c, where0, rec) {
  const all = regionSources(c.region);
  const olds = new Set([...all].filter(m => !BASEMAPS.has(m)));
  const uniq = a => new Set(a).size === a.length;
  const ops = c.demoOps || {};
  // maps の共通規則: 1 件以上・重複なし・当該地域 sources に実在・sources の全件と同じでない（全地図ならアプリ用に置く。HR-21）
  const mapsOk = (maps, w) => {
    const ok = Array.isArray(maps) && maps.length >= 1 && uniq(maps);
    rec(ok, `${w}: maps が 1 件以上・重複なしの配列でない`);
    if (!ok) return;
    for (const mid of maps) rec(all.has(mid), `${w}: maps の ${JSON.stringify(mid)} が当該地域 sources に無い`);
    rec(!(maps.length === all.size && [...all].every(m => maps.includes(m))), `${w}: maps が全地図と同じ。全地図に出すものはアプリ用に置く（HR-21）`);
  };
  // v2.5（HR-25/3）: clipped の形。キーはこの線を出す古地図（allowed）、値は 2 点以上・どの点も元の points の上・線に沿った順
  const clipOk = (l, w, allowed) => {
    if (!("clipped" in l)) return;
    const cl = l.clipped;
    const okObj = !!cl && typeof cl === "object" && !Array.isArray(cl) && Object.keys(cl).length >= 1;
    rec(okObj, `${w}: clipped が 1 件以上の地図を持つ object でない`);
    if (!okObj) return;
    for (const [mid, pts] of Object.entries(cl)) {
      rec(allowed.has(mid), `${w}: clipped の ${JSON.stringify(mid)} がこの線を出す古地図でない（gsi/osm と他の地図は切らない）`);
      const okPts = Array.isArray(pts) && pts.length >= 2 && pts.every(p => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite));
      rec(okPts, `${w}: clipped.${mid} が 2 点以上の [lng,lat] 配列でない`);
      if (!okPts) continue;
      let prev = -1;
      for (const p of pts) {
        const s = posOnLine(l.points, p);
        rec(s !== null && s >= prev - 1e-9, `${w}: clipped.${mid} の点 [${p}] が元の線の上に無いか、線に沿った順でない`);
        if (s !== null) prev = s;
      }
    }
  };
  rec(!("addLine" in ops), `${where0}: demoOps.addLine が残っている（v2.3 で appLines／mapLines へ移した）`);
  rec(Array.isArray(c.appLines) && Array.isArray(c.mapLines), `${where0}: appLines／mapLines が配列でない`);
  (c.appPois || []).forEach((p, i) => rec(!("maps" in p), `${where0}#appPois[${i}]: アプリ用 POI が maps を持つ`));
  (c.mapPois || []).forEach((p, i) => {
    mapsOk(p.maps, `${where0}#mapPois[${i}]`);
    if (Array.isArray(p.maps)) for (const mid of p.maps) rec(!BASEMAPS.has(mid), `${where0}#mapPois[${i}]: 地図用 POI の maps に現代の地図 ${mid}（地図用 POI は古地図に描かれた地物。現代の地図に出すならアプリ用に置く。HR-25/4）`);
  });
  (c.appLines || []).forEach((l, i) => { rec(!("maps" in l), `${where0}#appLines[${i}]: アプリの線が maps を持つ`); clipOk(l, `${where0}#appLines[${i}]`, olds); });
  (c.mapLines || []).forEach((l, i) => { mapsOk(l.maps, `${where0}#mapLines[${i}]`); clipOk(l, `${where0}#mapLines[${i}]`, new Set((Array.isArray(l.maps) ? l.maps : []).filter(m => olds.has(m)))); });
  // v2.4: 追加 POI は maps を持てる（無ければ全地図。あれば地図用と同じ規則）
  (ops.addPoi || []).forEach((a, i) => { if (a && "maps" in a) mapsOk(a.maps, `${where0}#demoOps.addPoi[${i}]`); });
  const labels = [...(c.appLines || []), ...(c.mapLines || [])].map(l => l.label);
  rec(uniq(labels), `${where0}: 線の label が重複している（移動ピンの参照先が一意に決まらない）`);
  const lineLabels = new Set(labels);
  (ops.movePoi || []).forEach((m, i) => {
    const w = `${where0}#demoOps.movePoi[${i}]`;
    rec(!!m && typeof m.label === "string" && m.label.trim() !== "", `${w}: label が空`);
    rec(!!m && !("from" in m) && !("to" in m), `${w}: from/to を持つ（v2.3 で廃止。始点・終点は参照する線の端点）`);
    rec(!!m && !("maps" in m), `${w}: maps を持つ（移動ピンが出る地図は参照する線と同じ。二重に持たない）`);
    rec(!!m && lineLabels.has(m.line), `${w}: line ${JSON.stringify(m && m.line)} が appLines／mapLines の label に無い（移動ピンは線の始点→終点）`);
  });
}
function checkScope(contents) {
  for (const content of contents) scopeFails(content.data, content.path, must);
  if (fails === 0) console.log("OK: scope");
}

// ---- 陽性対照（--selftest）----
function runSelftest(contents) {
  // (1) 写真ライセンス判定の陽性対照（v2.1）
  const NG = ["CC BY-NC", "CC BY-NC 4.0", "CC BY-ND", "CC BY-ND 2.0", "CC BY-NC-SA", "CC BY-NC-SA 4.0",
              "UPDATED", "CC BY", "cc by 4.0", " CC BY 4.0", "Public Domain", "", undefined];
  for (const x of NG) must(!licenseOk(x), "selftest: NG ライセンスが PASS した: " + JSON.stringify(x));
  for (const x of IMAGE_LICENSES) must(licenseOk(x), "selftest: allowlist の値が FAIL した: " + x);

  // (2) 範囲検査の陽性対照（AC-T3-6）: 実素材は全頂点が地域 union 内（緑）。
  //     故意に盛岡の経緯度を館林の線へ混入したら FAIL で検出できること。
  for (const r of REGIONS) {
    must(fs.existsSync(`public/apps/${r}.json`), `missing public/apps/${r}.json`);
  }
  const unions = {};
  for (const r of REGIONS) unions[r] = regionUnion(r, true);

  // 実素材の線は範囲内
  for (const content of contents) {
    const union = unions[content.data.region];
    for (const { item: l, where } of allLines(content)) {
      for (const pt of l.points) {
        must(vertexInside(pt, union), `${where}: 実素材が範囲外（予期せぬ FAIL） [${pt[0]},${pt[1]}]`);
      }
    }
  }
  // 注入: 盛岡の経緯度 [141.15,39.70] を館林の union で検査 → 範囲外を検出
  if (unions.tatebayashi) {
    const bad = [141.15, 39.70];
    must(!vertexInside(bad, unions.tatebayashi), "selftest: 館林 union に盛岡経緯度 [141.15,39.70] が入ってしまう（範囲外検出が効かない）");
  }

  // (3) 地域ごと POI 分母の陽性対照（Major-1）: 1 地域だけ空・他地域に POI あり。
  //     旧実装の「全体合計 ≥ 1」では緑になるが、地域ごと ≥ 1 では空の地域が FAIL になること。
  const emptyContent = { path: "demo/content/selftest-empty.json", data: { region: "nobeoka", mapPois: [], appPois: [], demoOps: { addPoi: [], movePoi: [], addLine: [], addVector: [] } } };
  const onePoiContent = { path: "demo/content/selftest-one.json", data: { region: "nara", mapPois: [{}], appPois: [], demoOps: { addPoi: [], movePoi: [], addLine: [], addVector: [] } } };
  must(!regionPoiOk(emptyContent), "selftest: 空の地域が「POI 1 件以上」を満たすと判定された（地域ごと分母が効かない）");
  must(regionPoiOk(onePoiContent), "selftest: POI 1 件の地域が「POI 1 件以上」を満たさないと判定された");

  // (4) 座標照合（checkPoi）の陽性対照（Major-2）: 実メソッド checkPoi に静かなコレクタを渡し、
  //     (a) distanceM の食い違い (b) 閾値超過 (c) query の形式不一致 が FAIL、正しい例が PASS になることを検証する。
  function checkPoiDetects(p) {
    let n = 0;
    checkPoi(p, "selftest", (cond) => { if (!cond) n++; });
    return n > 0;
  }
  const goodPoi = {
    name: "テスト地物", lat: 39.7, lng: 141.15,
    verify: { area: "point", sources: [{ src: "osm", query: "テスト地物", coord: [141.15, 39.7], distanceM: 0, fetchedAt: "2026-09-18" }] }
  };
  // (a) distanceM が再計算と食い違う（coord は約 17m 先なのに distanceM: 0。閾値以内なので距離チェックだけが壊れる）
  const badDistPoi = {
    name: "テスト地物", lat: 39.7, lng: 141.15,
    verify: { area: "point", sources: [{ src: "osm", query: "テスト地物", coord: [141.1502, 39.7], distanceM: 0, fetchedAt: "2026-09-18" }] }
  };
  // (b) 閾値超過（distanceM は再計算値と一致するが、point の閾値 50m を超える）
  const farPoi = {
    name: "テスト地物", lat: 39.7, lng: 141.15,
    verify: { area: "point", sources: [{ src: "osm", query: "テスト地物", coord: [141.16, 39.7], distanceM: distM(141.15, 39.7, 141.16, 39.7), fetchedAt: "2026-09-18" }] }
  };
  // (c) query の形式不一致（osm は name と、gsi_address は address と一致しない）
  const osmQueryBad = {
    name: "テスト地物", lat: 39.7, lng: 141.15,
    verify: { area: "point", sources: [{ src: "osm", query: "別の地物", coord: [141.15, 39.7], distanceM: 0, fetchedAt: "2026-09-18" }] }
  };
  const gsiQueryBad = {
    name: "テスト地物", address: "岩手県盛岡市", lat: 39.7, lng: 141.15,
    verify: { area: "point", sources: [{ src: "gsi_address", query: "別の住所", coord: [141.15, 39.7], distanceM: 0, fetchedAt: "2026-09-18" }] }
  };
  must(checkPoiDetects(badDistPoi), "selftest: 食い違う distanceM を checkPoi が FAIL にしなかった");
  must(checkPoiDetects(farPoi), "selftest: 閾値超過を checkPoi が FAIL にしなかった");
  must(checkPoiDetects(osmQueryBad), "selftest: osm の query 不一致を checkPoi が FAIL にしなかった");
  must(checkPoiDetects(gsiQueryBad), "selftest: gsi_address の query 不一致を checkPoi が FAIL にしなかった");
  must(!checkPoiDetects(goodPoi), "selftest: 正しい例を checkPoi が FAIL にした");

  // (5) 区分・移動ピンの陽性対照（v2.5・AC-T3-11）: 実素材は緑、注入した誤りは 1 件ずつ FAIL になること
  const scopeDetects = (c) => { let n = 0; scopeFails(c, "selftest", (cond) => { if (!cond) n++; }); return n > 0; };
  const baseOf = (r) => { const x = contents.find(k => k.data.region === r); must(!!x, `selftest: ${r} の素材が無い（区分の陽性対照が組めない）`); return x ? JSON.parse(JSON.stringify(x.data)) : null; };
  const ALL = { morioka: ["morioka_ndl", "morioka", "morioka_ndl_affine", "gsi", "osm"], tatebayashi: ["tatebayashi_castle_akimoto", "tatebayashi_ojozu", "gsi", "osm"] };
  const inj = [
    ["morioka", "地図用 POI の maps が空", c => { c.mapPois[0].maps = []; }],
    ["morioka", "地図用 POI の maps に他地域の地図", c => { c.mapPois[0].maps.push("nara_1894"); }],
    ["morioka", "地図用 POI の maps が全地図", c => { c.mapPois[0].maps = ALL.morioka.slice(); }],
    ["tatebayashi", "地図用 POI の maps が gsi・osm（v2.4 の善導寺の形。HR-25/4）", c => { c.mapPois[0].maps = ["gsi", "osm"]; }],
    ["tatebayashi", "地図用 POI の maps に古地図と osm（HR-25/4）", c => { c.mapPois[0].maps.push("osm"); }],
    ["morioka", "アプリ用 POI が maps を持つ", c => { c.appPois[0].maps = ["morioka_ndl"]; }],
    ["tatebayashi", "アプリの線が maps を持つ", c => { c.appLines[0].maps = ["gsi"]; }],
    ["morioka", "地図の線の maps が全地図", c => { c.mapLines[0].maps = ALL.morioka.slice(); }],
    ["morioka", "demoOps.addLine が残る", c => { c.demoOps.addLine = []; }],
    ["morioka", "追加 POI の maps が空", c => { c.demoOps.addPoi[0].maps = []; }],
    ["morioka", "追加 POI の maps に重複", c => { c.demoOps.addPoi[0].maps = ["gsi", "gsi"]; }],
    ["morioka", "追加 POI の maps が全地図", c => { c.demoOps.addPoi[0].maps = ALL.morioka.slice(); }],
    ["morioka", "移動ピンが from/to を持つ", c => { c.demoOps.movePoi[0].from = {}; }],
    ["morioka", "移動ピンが maps を持つ", c => { c.demoOps.movePoi[0].maps = ["gsi"]; }],
    ["morioka", "移動ピンが無い線を指す", c => { c.demoOps.movePoi[0].line = "存在しない線"; }],
    ["morioka", "線の label が重複", c => { c.mapLines[0].label = c.appLines[0].label; }],
    // 全頂点が両図に入る館林の線で、HR-21 の規則だけが効くことを見る
    ["tatebayashi", "全地図に出す線を地図の線に置く", c => { const l = c.appLines.shift(); c.mapLines.push({ ...l, maps: ALL.tatebayashi.slice() }); }],
    // v2.5（HR-25/3）: clipped の形
    ["morioka", "clipped のキーが gsi", c => { c.appLines[0].clipped.gsi = c.appLines[0].points.slice(0, 2); }],
    ["morioka", "clipped のキーが他地域の地図", c => { c.appLines[0].clipped.nara_1894 = c.appLines[0].points.slice(0, 2); }],
    ["morioka", "clipped が空の object", c => { c.appLines[0].clipped = {}; }],
    ["morioka", "clipped が 1 点", c => { c.appLines[0].clipped.morioka = [c.appLines[0].clipped.morioka[0]]; }],
    ["morioka", "clipped の点が線の外", c => { c.appLines[0].clipped.morioka[3] = [141.15, 39.71]; }],
    ["morioka", "clipped が線と逆の順", c => { c.appLines[0].clipped.morioka.reverse(); }],
    ["morioka", "地図の線の clipped が maps に無い古地図", c => { c.mapLines[0].clipped = { morioka: c.mapLines[0].points.slice() }; }]
  ];
  for (const r of ["morioka", "nobeoka", "nara", "tatebayashi", "hiroshima"]) { const c = baseOf(r); if (c) must(!scopeDetects(c), `selftest: 実素材（${r}）が区分検査で FAIL した`); }
  for (const [r, name, f] of inj) { const c = baseOf(r); if (!c) continue; f(c); must(scopeDetects(c), `selftest: 区分検査が「${name}」を検出しなかった`); }
  // 陰性対照（許す形が誤って FAIL しないこと）
  const ok = [
    ["tatebayashi", "一部の地図だけの線（館林 2 枚）", c => { const l = c.appLines.shift(); c.mapLines.push({ ...l, maps: ["tatebayashi_castle_akimoto", "tatebayashi_ojozu"] }); }],
    ["morioka", "移動ピンが地図の線を指す", c => { c.demoOps.movePoi[0].line = c.mapLines[0].label; }],
    ["nara", "追加 POI が maps を持たない（全地図）", c => { delete c.demoOps.addPoi[0].maps; }],
    ["morioka", "地図の線が maps の古地図で clipped を持つ", c => { c.mapLines[0].clipped = { morioka_ndl: c.mapLines[0].points.slice() }; }],
    ["morioka", "clipped を持たないアプリの線（範囲は AC20 (10) が見る）", c => { delete c.appLines[0].clipped; }]
  ];
  for (const [r, name, f] of ok) { const c = baseOf(r); if (!c) continue; f(c); must(!scopeDetects(c), `selftest: 「${name}」が誤って FAIL した`); }

  if (fails === 0) console.log("OK: selftest");
}

// ---- 分母 assert ----
function denominatorAssert() {
  const files = contentFiles();
  must(files.length > 0, "no demo/content/*.json (empty denominator)");
  must(files.some(f => path.basename(f) === "morioka.json"), "mandatory demo/content/morioka.json missing");
  return files;
}

// ---- main ----
const argv = process.argv.slice(2);
const flags = new Set(argv.filter(a => a.startsWith("--")));
const CONTENT_FLAGS = ["--schema", "--independence", "--verify", "--extent", "--source", "--kindmaps", "--image", "--scope"];
const runAll = (argv.length === 0 || flags.has("--all")) && !flags.has("--selftest");

denominatorAssert();
const contents = loadContents();

if (flags.has("--schema")) checkSchema(contents);
if (flags.has("--independence")) checkIndependence(contents);
if (flags.has("--verify")) checkVerify(contents);
if (flags.has("--source")) checkSource(contents);
if (flags.has("--kindmaps")) checkKindmaps(contents);
if (flags.has("--image")) checkImage(contents);
if (flags.has("--extent")) checkExtent(contents);
if (flags.has("--scope")) checkScope(contents);
if (flags.has("--selftest")) runSelftest(contents);

if (runAll) {
  checkSchema(contents);
  checkIndependence(contents);
  checkVerify(contents);
  checkSource(contents);
  checkKindmaps(contents);
  checkImage(contents);
  checkExtent(contents);
  checkScope(contents);
}

if (fails) {
  console.error(`FAIL: ${fails} check(s)`);
  process.exit(1);
}
console.log("OK: verify-demo-content");
