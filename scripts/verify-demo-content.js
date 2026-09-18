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
    if (Array.isArray(ops.movePoi)) ops.movePoi.forEach((x, i) => {
      push(x && x.from, `${content.path}#demoOps.movePoi[${i}].from`);
      push(x && x.to, `${content.path}#demoOps.movePoi[${i}].to`);
    });
  }
  return pois;
}
function allLines(content) {
  const lines = [];
  const ops = content.data.demoOps;
  if (ops && Array.isArray(ops.addLine)) ops.addLine.forEach((x, i) => lines.push({ item: x, where: `${content.path}#demoOps.addLine[${i}]` }));
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
    if (c.demoOps && Array.isArray(c.demoOps.movePoi)) {
      c.demoOps.movePoi.forEach((x, i) => {
        for (const end of ["from", "to"]) {
          const p = x && x[end];
          must(p && p.verify && Array.isArray(p.verify.sources) && p.verify.sources.length >= 1, `${content.path}#demoOps.movePoi[${i}].${end}: 完全な POI（verify あり）でない`);
        }
      });
    }
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
    if (content.data.demoOps && Array.isArray(content.data.demoOps.movePoi)) {
      content.data.demoOps.movePoi.forEach((x, i) => {
        for (const end of ["from", "to"]) {
          const p = x && x[end];
          if (p && typeof p.lng === "number" && typeof p.lat === "number") {
            must(vertexInside([p.lng, p.lat], union), `${content.path}#demoOps.movePoi[${i}].${end}: 範囲外頂点 [${p.lng},${p.lat}]`);
          }
        }
      });
    }
  }
  if (fails === 0) console.log("OK: extent");
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
const CONTENT_FLAGS = ["--schema", "--independence", "--verify", "--extent", "--source", "--kindmaps", "--image"];
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
if (flags.has("--selftest")) runSelftest(contents);

if (runAll) {
  checkSchema(contents);
  checkIndependence(contents);
  checkVerify(contents);
  checkSource(contents);
  checkKindmaps(contents);
  checkImage(contents);
  checkExtent(contents);
}

if (fails) {
  console.error(`FAIL: ${fails} check(s)`);
  process.exit(1);
}
console.log("OK: verify-demo-content");
