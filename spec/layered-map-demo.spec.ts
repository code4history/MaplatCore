import { readFileSync } from "node:fs";
import proj4 from "proj4";
import type { Proj4Factory } from "@maplat/transform";
import { describe, expect, it } from "vitest";
import { store2HistMap4Core } from "../src/source/store_handler";
import { buildMapTransform, haversineKm, lonlat2merc, merc2lonlat, type DemoMapJson } from "../demo/layered-map/engine";
import { COLOR, DASH, MARK, OPACITY, WIDTH } from "../demo/layered-map/grammar";

// layered-map.html（変換の形のデモ。設計書 2026-11-26-jan27-layered-map-demo-redesign.md）の素材と、画面の変換。
// 素材を作り直したときに Core が読めなくなっていないこと、デモが組む変換が Core の変換と同じ値を返すことを守る
const MAPS = [
  "layered_demo_p1_a",
  "layered_demo_p1_c",
  "layered_demo_p1c_d",
  "layered_demo_p1c_c",
  "layered_demo_p2_a",
  "layered_demo_p2_b",
  "layered_demo_p2_c",
  "layered_demo_p3_b",
  "layered_demo_p3_c"
];
const load = (path: string) => JSON.parse(readFileSync(`public/${path}.json`, "utf-8"));
const loadMap = (id: string) => load(`maps/${id}`);
const meta = load("demo-data/layered_demo_meta");
const coreTransform = async (id: string) => {
  const [, transform] = await store2HistMap4Core({ mapID: id, ...loadMap(id) });
  return transform;
};
const surfaceOf = async (id: string) => (await coreTransform(id)).getSurfaceTransform(0) as any;
const demoTransform = (id: string) => buildMapTransform(loadMap(id) as DemoMapJson, proj4 as unknown as Proj4Factory);

describe("変換の形のデモの素材（地図 JSON 9 つ）", () => {
  it("A は world file の面、B は四辺形の外が world file、C は扇形。紙の CRS は lcc の proj4 定義", async () => {
    for (const id of ["layered_demo_p1_a", "layered_demo_p2_a"]) {
      const surface = await surfaceOf(id);
      expect(typeof surface.xyToCrs).toBe("function");
      expect(surface.crs).toEqual({ proj4: meta.paper.proj4 });
    }
    for (const id of ["layered_demo_p2_b", "layered_demo_p3_b"]) {
      const b = await surfaceOf(id);
      expect(b.outerTransform).toBe("worldFile");
      expect(b.crs).toEqual({ proj4: meta.paper.proj4 });
    }
    for (const id of ["layered_demo_p1_c", "layered_demo_p1c_c", "layered_demo_p2_c", "layered_demo_p3_c"]) {
      const c = await surfaceOf(id);
      expect(c.outerTransform).toBe("extrapolate");
      expect(c.crs).toEqual({ proj4: meta.paper.proj4 });
    }
  });

  it("D は crs を持たない 3857 固定の三角網（V2）で、補助頂点は紙の四隅の 4 つだけ", () => {
    const d = loadMap("layered_demo_p1c_d");
    expect(d.crs).toBeUndefined();
    expect(d.compiled.version).toBe(2.00704);
    expect(d.compiled.vertices_points).toHaveLength(4);
    // 紙（2048 画素）の四隅のまわりに並ぶ
    const xs = d.compiled.vertices_points.map((v: number[][]) => v[0][0]);
    expect(Math.min(...xs)).toBeLessThan(0);
    expect(Math.max(...xs)).toBeGreaterThan(2048);
  });

  it("B・C は GCP の三角網（P1 は 24 組・P2・P3 は 34 組。GCP だけの三角形がある）。B は扇形の重心を持たない", () => {
    const counts: Record<string, number> = {
      layered_demo_p1_c: 24, layered_demo_p1c_c: 24, layered_demo_p2_b: 34, layered_demo_p2_c: 34, layered_demo_p3_b: 34, layered_demo_p3_c: 34
    };
    for (const [id, n] of Object.entries(counts)) {
      const c = loadMap(id).compiled;
      expect(c.points, id).toHaveLength(n);
      expect(c.tins_points[0].some((t: (number | string)[]) => t.every(v => typeof v === "number"))).toBe(true);
      expect(c.vertices_points.length).toBeGreaterThan(4);
    }
    for (const id of ["layered_demo_p2_b", "layered_demo_p3_b"]) expect(loadMap(id).compiled.centroid_point, id).toBeUndefined();
    for (const id of ["layered_demo_p2_c", "layered_demo_p3_c"]) expect(loadMap(id).compiled.centroid_point, id).toBeTruthy();
  });

  it("A の world file は GCP からの当てはめで、真の world file とは少しずれる（真の値をそのまま書いていない）", () => {
    for (const [id, key] of [["layered_demo_p1_a", "p1"], ["layered_demo_p2_a", "p2"]] as const) {
      const wf = loadMap(id).worldFile;
      expect(wf).toEqual(meta.worldFiles[key]);
      if (key === "p1") {
        expect(wf.xScale).not.toBe(meta.worldFiles.truth.xScale);
        expect(Math.abs(wf.xScale / meta.worldFiles.truth.xScale - 1)).toBeLessThan(0.02);
      }
    }
  });
});

describe("デモが組む変換は Core の変換と同じ値を返す（設計書 §5.2）", () => {
  // 紙の上の 33×33 点で、デモの MapTransform（demo/layered-map/engine.ts）と、Core が地図 JSON を読んで組む MapTransform の差が 1 mm 未満
  for (const id of MAPS) {
    it(`${id}: 33×33 点で差が 1 mm 未満`, async () => {
      const core = await coreTransform(id);
      const demo = demoTransform(id);
      let max = 0;
      for (let j = 0; j < 33; j++) {
        for (let i = 0; i < 33; i++) {
          const xy = [Math.min(2047.5, Math.max(0.5, (i / 32) * 2048)), Math.min(2047.5, Math.max(0.5, (j / 32) * 2048))];
          const a = core.xy2Merc(xy), b = demo.xy2Merc(xy);
          expect(a).not.toBe(false);
          expect(b).not.toBe(false);
          max = Math.max(max, Math.hypot((a as number[])[0] - (b as number[])[0], (a as number[])[1] - (b as number[])[1]));
        }
      }
      expect(max).toBeLessThan(0.001);
    });
  }

  it("紙の外（扇形・world file の外側）の画素も同じ値を返す", async () => {
    for (const id of ["layered_demo_p1_c", "layered_demo_p2_b", "layered_demo_p2_c", "layered_demo_p3_b", "layered_demo_p3_c", "layered_demo_p1c_d"]) {
      const core = await coreTransform(id);
      const demo = demoTransform(id);
      for (const xy of [[-600, -600], [2650, 1000], [1024, 2650], [-300, 1500]]) {
        const a = core.xy2Merc(xy) as number[], b = demo.xy2Merc(xy) as number[];
        expect(Math.hypot(a[0] - b[0], a[1] - b[1])).toBeLessThan(0.001);
      }
    }
  });
});

describe("GCP（固定の乱数種・格子に並べない）", () => {
  it("G1・G1c は各 24 組、G2・G3 は各 34 組。G1 だけ打ち間違い 2 組（25・35 画素）を持つ", () => {
    for (const key of ["g1", "g1c"]) expect(meta.gcps[key]).toHaveLength(24);
    for (const key of ["g2", "g3"]) expect(meta.gcps[key]).toHaveLength(34);
    const blunders = meta.gcps.g1.filter((g: any) => g.blunder);
    expect(blunders.map((g: any) => g.blunder.sizePx).sort()).toEqual([25, 35]);
    for (const key of ["g1c", "g2", "g3"]) expect(meta.gcps[key].some((g: any) => g.blunder), key).toBe(false);
    // G1 は G1c から、打ち間違いの組だけを指定の大きさだけずらしたもの（丸めの 0.1 画素の範囲）
    meta.gcps.g1.forEach((g: any, i: number) => {
      const c = meta.gcps.g1c[i];
      const d = Math.hypot(g.pixel[0] - c.pixel[0], g.pixel[1] - c.pixel[1]);
      expect(Math.abs(d - (g.blunder?.sizePx ?? 0))).toBeLessThan(0.2);
    });
  });

  it("格子に並んでいない（密な所・疎な所・何も無い所がある）", () => {
    for (const key of ["g1c", "g2", "g3"]) {
      const px = meta.gcps[key].map((g: any) => g.pixel) as number[][];
      // 5 列・5 行の格子なら、40 画素刻みの区画の数は 5 前後に収まる。散らばっていれば、それよりずっと多い
      const cols = new Set(px.map(p => Math.round(p[0] / 40))).size;
      const rows = new Set(px.map(p => Math.round(p[1] / 40))).size;
      expect(cols, key).toBeGreaterThan(10);
      expect(rows, key).toBeGreaterThan(10);
    }
    // どの 2 組も 40 画素以上離れている（P1 の真の画素で。歪んだ図では紙の側に歪みと誤差が乗るので緩める）
    const px1 = meta.gcps.g1c.map((g: any) => g.pixel) as number[][];
    for (let i = 0; i < px1.length; i++) {
      for (let j = i + 1; j < px1.length; j++) expect(Math.hypot(px1[i][0] - px1[j][0], px1[i][1] - px1[j][1])).toBeGreaterThan(36);
    }
    // 密: 関東・近畿・九州北部 14 組、疎: 残り 10 組
    expect(meta.gcps.g1.filter((g: any) => g.dense)).toHaveLength(14);
    // GCP の外（北海道の東・沖縄・朝鮮半島・大陸）に置いていない
    for (const g of meta.gcps.g1 as any[]) {
      expect(g.lonlat[0]).toBeLessThan(142.5); // 北海道の東半分・大陸に置かない
      expect(g.lonlat[1]).toBeGreaterThan(32);
    }
  });

  it("歪んだ図用の 34 組は、地方ごとに 3 組以上あり、沖縄・朝鮮半島・大陸に置かない", () => {
    const counts: Record<string, number> = {};
    for (const g of meta.gcps.g2 as any[]) counts[g.region] = (counts[g.region] ?? 0) + 1;
    expect(counts).toEqual({ 九州: 5, 四国: 3, 中国: 4, 近畿: 4, "中部・北陸": 5, 関東: 4, 東北: 5, 北海道: 4 });
    for (const g of meta.gcps.g2 as any[]) {
      expect(g.lonlat[0]).toBeGreaterThan(129.5);
      expect(g.lonlat[0]).toBeLessThan(145.1);
      expect(g.lonlat[1]).toBeGreaterThan(31);
    }
    // G2・G3 は同じ 34 地点を、P2・P3 の上で打ったもの（地理側は同じ。紙の側が違う）
    meta.gcps.g2.forEach((g: any, i: number) => {
      const h = meta.gcps.g3[i];
      expect(h.lonlat).toEqual(g.lonlat);
      expect(Math.hypot(h.pixel[0] - g.pixel[0], h.pixel[1] - g.pixel[1])).toBeGreaterThan(0);
    });
    // 歪みで GCP の紙の側は動く（P2 は最大 75 km 前後・P3 は 150 km 前後）
    const toLonLat = proj4(meta.paper.proj4, "EPSG:4326");
    const wf = meta.worldFiles.truth;
    const moveKm = (key: string): number => Math.max(...(meta.gcps[key] as any[]).map(g => {
      const back = toLonLat.forward([wf.xScale * (g.pixel[0] - 0.5) + wf.xOrigin, wf.yScale * (g.pixel[1] - 0.5) + wf.yOrigin]);
      return haversineKm(back, g.lonlat);
    }));
    expect(moveKm("g2")).toBeGreaterThan(60);
    expect(moveKm("g2")).toBeLessThan(90);
    expect(moveKm("g3")).toBeGreaterThan(130);
    expect(moveKm("g3")).toBeLessThan(170);
  });

  it("GCP の地理側は真の経度・緯度。紙 P1 では、紙の画素（打ち間違い・誤差を除く）を真の world file と lcc で戻した所の近く", () => {
    const toLonLat = proj4(meta.paper.proj4, "EPSG:4326");
    const wf = meta.worldFiles.truth;
    for (const g of meta.gcps.g1c as any[]) {
      const X = wf.xScale * (g.pixel[0] - 0.5) + wf.xOrigin;
      const Y = wf.yScale * (g.pixel[1] - 0.5) + wf.yOrigin;
      const back = toLonLat.forward([X, Y]);
      // 紙の側の打つときの誤差（標準偏差 3 画素。1 画素 1.5 km）。5σ = 15 画素 ≒ 22.5 km 以内
      expect(haversineKm(back, g.lonlat)).toBeLessThan(25);
    }
  });
});

describe("歪んだ紙（P2・P3。設計書 §3.4）の作り方の確かめ", () => {
  it("折り返さない（ヤコビアンの行列式の最小が 0.3 を超える）。P2 の S は G2 の相似を恒等にする", () => {
    expect(meta.distortion.p2.minJacobian).toBeGreaterThan(0.3);
    expect(meta.distortion.p3.minJacobian).toBeGreaterThan(0.3);
    const r = meta.distortion.p2.similarityResidual;
    expect(Math.abs(r.scale)).toBeLessThan(1e-6);
    expect(Math.abs(r.rot)).toBeLessThan(1e-6);
    expect(Math.abs(r.tx)).toBeLessThan(0.01);
    expect(Math.abs(r.ty)).toBeLessThan(0.01);
  });
  it("P3 の中心は、G3 の 34 地点の P1 の画素の重心（東経 136.55 度・北緯 36.49 度）", () => {
    expect(meta.distortion.p3.centerLonLat[0]).toBeCloseTo(136.55, 1);
    expect(meta.distortion.p3.centerLonLat[1]).toBeCloseTo(36.49, 1);
    expect(meta.distortion.p3.a).toBe(0.5);
    expect(meta.distortion.p3.rho).toBe(235);
  });
});

describe("score と推奨（Teiresias。生成のときに計算して meta に書いたもの）", () => {
  const t = (k: string) => meta.gcpSets[k].teiresias;
  it("G1c は CRS の側（0.005 未満）。打ち間違いが score を押し上げる", () => {
    expect(t("g1c").score).toBeLessThan(0.005);
    expect(t("g1").score).toBeGreaterThan(t("g1c").score);
  });
  it("G2 は大域外挿の区分の中（0.008 以上 0.03 未満。推奨は大域外挿だけ）", () => {
    expect(t("g2").score).toBeGreaterThanOrEqual(0.008);
    expect(t("g2").score).toBeLessThan(0.03);
    expect(t("g2").setups).toEqual(["tinGlobal"]);
  });
  it("G3 は扇形外挿が先頭になる範囲（0.035 以上）", () => {
    expect(t("g3").score).toBeGreaterThanOrEqual(0.035);
    expect(t("g3").setups[0]).toBe("tinFan");
  });
});

describe("紙の折れ線と正解（経緯度）の折れ線は頂点ごとに対応する", () => {
  const coast = load("demo-data/layered_demo_coast");
  const toLonLat = proj4(meta.paper.proj4, "EPSG:4326");
  for (const paper of ["p1", "p2", "p3"] as const) {
    it(`${paper}: 頂点の数と順が同じ`, () => {
      const pl = load(`demo-data/layered_demo_paper_${paper}`);
      for (const kind of ["coast", "grid"] as const) {
        expect(coast[paper][kind]).toHaveLength(pl[kind].length);
        pl[kind].forEach((line: number[][], i: number) => expect(coast[paper][kind][i]).toHaveLength(line.length));
      }
      // 紙の矩形の中に収まる
      for (const line of pl.coast as number[][][]) for (const p of line) {
        expect(p[0]).toBeGreaterThanOrEqual(-0.1);
        expect(p[0]).toBeLessThanOrEqual(2048.1);
        expect(p[1]).toBeGreaterThanOrEqual(-0.1);
        expect(p[1]).toBeLessThanOrEqual(2048.1);
      }
    });
  }
  it("p1: 紙の画素を真の world file と lcc で戻すと、正解の経緯度になる", () => {
    const pl = load("demo-data/layered_demo_paper_p1");
    const wf = meta.worldFiles.truth;
    let max = 0;
    pl.coast.slice(0, 20).forEach((line: number[][], i: number) =>
      line.forEach((p, k) => {
        const back = toLonLat.forward([wf.xScale * (p[0] - 0.5) + wf.xOrigin, wf.yScale * (p[1] - 0.5) + wf.yOrigin]);
        max = Math.max(max, haversineKm(back, coast.p1.coast[i][k]));
      })
    );
    expect(max).toBeLessThan(0.5); // 丸め（紙は 0.1 画素・経緯度は 0.001 度）の範囲
  });
});

describe("実測した受け入れの数値（設計書 §7.2 の目安。km。meta は生成のときの実測）", () => {
  const st = (id: string) => meta.maps[id].stats;
  it("デモ 1: CRS は紙の端まで合い、三角網＋扇形外挿は打ち間違いの周りと紙の隅でずれる", () => {
    expect(st("layered_demo_p1_a").inner.maxKm).toBeLessThanOrEqual(20);
    expect(st("layered_demo_p1_a").outer.maxKm).toBeLessThanOrEqual(20);
    expect(st("layered_demo_p1_c").nearBlunder.maxKm).toBeGreaterThanOrEqual(40);
    expect(st("layered_demo_p1_c").outer.maxKm).toBeGreaterThanOrEqual(100);
    // 三角網は GCP を必ず通る。CRS は当てはめなので、打ち間違いの組で残差が残る
    expect(st("layered_demo_p1_c").gcpMaxKm).toBeLessThan(0.01);
    expect(st("layered_demo_p1_a").gcpMaxKm).toBeGreaterThanOrEqual(40);
  });
  it("デモ 2: 従来型は外側で大きく曲がり、三角網＋扇形外挿は曲がりが消える（紙の隅に増幅されたずれは残る）", () => {
    expect(st("layered_demo_p1c_d").outer.maxKm).toBeGreaterThanOrEqual(200);
    expect(st("layered_demo_p1c_c").outer.rmsKm).toBeLessThanOrEqual(st("layered_demo_p1c_d").outer.rmsKm / 2);
    expect(st("layered_demo_p1c_c").inner.maxKm).toBeLessThanOrEqual(20);
    // 増幅は残る（Tin の推定が直ったら、ここと説明文と設計書 §7.2 を測り直す）
    expect(st("layered_demo_p1c_c").outer.maxKm).toBeGreaterThan(25);
  });
  it("デモ 3: CRS は GCP でずれが残り、三角網＋大域外挿はすべて的になり、内側の陸の二乗平均が半分以下になる", () => {
    expect(st("layered_demo_p2_a").gcpMaxKm).toBeGreaterThanOrEqual(40);
    expect(st("layered_demo_p2_b").gcpMaxKm).toBeLessThan(0.01);
    expect(st("layered_demo_p2_b").innerLand.rmsKm).toBeLessThanOrEqual(st("layered_demo_p2_a").innerLand.rmsKm / 2);
    // 海の上は直らない（内側の全体では半分に届かない）
    expect(st("layered_demo_p2_b").inner.rmsKm).toBeGreaterThan(st("layered_demo_p2_a").inner.rmsKm / 2);
  });
  it("デモ 4: 内側は同じ。外側の二乗平均は、大域外挿が 30 以下かつ扇形外挿の 3 分の 1 以下", () => {
    expect(meta.demos["4"].diff.innerMaxKm).toBeLessThan(1);
    expect(meta.innerDiffKm.layered_demo_p2_b).toBeLessThan(1);
    expect(st("layered_demo_p2_b").outer.rmsKm).toBeLessThanOrEqual(30);
    expect(st("layered_demo_p2_b").outer.rmsKm).toBeLessThanOrEqual(st("layered_demo_p2_c").outer.rmsKm / 3);
  });
  it("デモ 5: 内側は同じ。外側の二乗平均は扇形外挿が大域外挿の半分以下で、四辺形より外の最大は 60 以下", () => {
    expect(meta.demos["5"].diff.innerMaxKm).toBeLessThan(1);
    expect(meta.innerDiffKm.layered_demo_p3_b).toBeLessThan(1);
    expect(st("layered_demo_p3_c").outer.rmsKm).toBeLessThanOrEqual(st("layered_demo_p3_b").outer.rmsKm / 2);
    expect(st("layered_demo_p3_c").beyondQuad.maxKm).toBeLessThanOrEqual(60);
  });
  it("欄の行: 内側の全体と内側の陸（陸は全体の部分集合）", () => {
    for (const id of MAPS) {
      const s = st(id);
      expect(s.innerLand.n, id).toBeGreaterThan(0);
      expect(s.innerLand.n, id).toBeLessThan(s.inner.n);
      expect(s.innerLand.maxKm, id).toBeLessThanOrEqual(s.inner.maxKm + 1e-9);
    }
  });
  it("km と 3857 の距離は整合する（haversine は経緯度から。3857 の距離は緯度で伸びる）", () => {
    const a = lonlat2merc([136, 35]), b = lonlat2merc([137, 35]);
    expect(Math.hypot(b[0] - a[0], b[1] - a[1]) / 1000).toBeGreaterThan(haversineKm([136, 35], [137, 35]));
    expect(merc2lonlat(a)[1]).toBeCloseTo(35, 9);
  });
});

describe("見せ方の文法（設計書 §4.2 の表。ここを変えるときは設計書と人間の確認が要る）", () => {
  it("色は赤・青・黒の 3 色（白は縁取りと背景、黄色は選んだ印だけ）", () => {
    expect(COLOR).toEqual({
      red: "#C1121F", blue: "#3B8FD9", blueDark: "#1F5FA8", black: "#1F2933", white: "#FFFFFF", select: "#F2C200"
    });
  });
  it("太さ・線種・不透明度・印の大きさ", () => {
    expect(WIDTH).toEqual({ terrain: { core: 2.5, band: 7 }, grid: { core: 1.25, band: 4 }, principle: 1, casing: 3 });
    expect(DASH).toEqual({ fan: [8, 3, 1, 3], extended: [1, 3], quad: [6, 3], tin: [1, 3] });
    expect(OPACITY).toEqual({ band: 0.6, casing: 0.7, curtain: 0.55 });
    expect(MARK).toEqual({ aux: 6, centroid: 8, gcpPaper: 6, gcpGeo: 12, gcpGeoStroke: 2, selectScale: 1.5 });
  });
});

describe("オフライン（設計書 C8）: 画面の資源は同梱で、外部の URL を取りに行かない", () => {
  // 背景の地理院タイルは Core の既定の地図（gsi）が読む。デモ自身は外部の URL を持たない
  const files = ["layered-map.html", "demo/layered-map.ts", "demo/layered-map/engine.ts", "demo/layered-map/grammar.ts"];
  it("HTML・画面のコードに、外部 URL への参照が無い（SVG の名前空間の宣言は除く）", () => {
    for (const f of files) {
      const text = readFileSync(f, "utf-8").replace(/http:\/\/www\.w3\.org\/2000\/svg/g, "");
      expect(text, f).not.toMatch(/https?:\/\//);
      expect(text, f).not.toMatch(/\/\/(cdn|unpkg|cdnjs|fonts\.googleapis)/i);
    }
  });
  it("proj4 と Natural Earth の海岸線は同梱（依存・public/demo-data にある）", () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
    expect(pkg.dependencies.proj4).toBeTruthy();
    const coast = load("demo-data/layered_demo_coast");
    expect(coast.source).toMatch(/Natural Earth/);
  });
});
