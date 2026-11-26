import { readdirSync, readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { commonDict } from "../demo/i18n/common";
import { dict as indexDict } from "../demo/i18n/index-page";
import { dict as oldMapDict } from "../demo/i18n/old-map";
import {
  DEFAULT_MAP_FORM, ESTIMATES_FILE, MAPS_C_DIR, MAP_FORMS, formInfo, mapsCPath, parseMapForm, settingForForm, summarizeStrict, v2StrictStatuses,
  type Estimates
} from "../demo/old-map-form";
import { HistMap_tin } from "../src/source/histmap_tin";
import { mapSourceFactory } from "../src/source_ex";

// 古地図のデモの「変換の形」の切り替え（三角網＋扇形外挿 c ⇄ 従来型 v2）。
// 作り直した地図（public/maps-c/）が Core で読めること、既定が c であること、文言の辞書（ja・en）の鍵がそろっていること。
const read = (f: string): string => readFileSync(f, "utf-8");
const readJson = <T = any>(f: string): T => JSON.parse(read(f)) as T;
const estimates = readJson<Estimates>(`public/${ESTIMATES_FILE}`);
const mapIDs = readdirSync(`public/${MAPS_C_DIR}`)
  .filter(f => f.endsWith(".json") && f !== "estimates.json")
  .map(f => f.replace(/\.json$/, ""))
  .sort();

afterEach(() => vi.unstubAllGlobals());

describe("public/maps-c の地図は、すべて Core で読める", () => {
  it("作り直した地図が 12 枚あり、estimates.json と過不足がない", () => {
    expect(mapIDs).toHaveLength(12);
    expect(Object.keys(estimates).sort()).toEqual(mapIDs);
  });

  it("元の public/maps の地図と同じ mapID で、元の JSON は書き換わっていない（V2 のまま読める）", () => {
    for (const id of mapIDs) {
      const v2 = readJson(`public/maps/${id}.json`);
      const c = readJson(`public/${mapsCPath(id)}`);
      expect(c.compiled, id).toBeTruthy();
      // 地図の画像（タイル）は元と同じ
      expect(c.width, id).toBe(v2.width);
      expect(c.height, id).toBe(v2.height);
      expect(c.url, id).toBe(v2.url);
      // C は crs を持ち、V2 は持たない（V2 は 3857 決め打ちのまま）
      expect(c.crs, id).toBeTruthy();
      expect(v2.crs, id).toBeUndefined();
    }
  });

  for (const id of mapIDs) {
    it(`${id}: mapSourceFactory で HistMap_tin になり、GCP が変換先に合う`, async () => {
      const data = readJson(`public/${mapsCPath(id)}`);
      // 新潟の 3 枚は IIIF の配信（NDL の info.json をネットワークで取る）。ここで見るのは変換面の読み込みなので、配信は外してタイルで読む
      const loaded = structuredClone(data);
      delete loaded.delivery;
      vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => structuredClone(loaded) })));
      // 盛岡系は app 設定が url を渡す（地図 JSON には無い）
      const map = await mapSourceFactory({ mapID: id, settingFile: mapsCPath(id), url: `tiles/${id}/{z}/{x}/{y}.jpg` }, {});
      expect(map).toBeInstanceOf(HistMap_tin);
      const tin = map as HistMap_tin;
      expect(Number.isFinite(tin.mercZoom), id).toBe(true);
      // どの地図も、推定の結果は 3857 のまま（Teiresias の適合スコアの尺度の修正後）
      expect(estimates[id][0].crs, id).toBe("EPSG:3857");
      // 本図の GCP を 3 点、紙の画素 → 変換先へ読んで、GCP の地理座標に合う（strict でも loose でも GCP の上は厳密）
      const points: [number[], number[]][] = data.compiled.points;
      for (const idx of [0, Math.floor(points.length / 2), points.length - 1]) {
        const [pixel, geo] = points[idx];
        const merc = await tin.xy2MercAsync_specifyLayer(pixel, 0);
        expect(merc, `${id} GCP ${idx}`).not.toBe(false);
        expect(Math.hypot(merc![0] - geo[0], merc![1] - geo[1]), `${id} GCP ${idx}`).toBeLessThan(1e-3);
      }
    });
  }
});

describe("変換の形の切り替え（既定・URL・設定）", () => {
  it("形は c と v2 の 2 つで、既定は c", () => {
    expect([...MAP_FORMS]).toEqual(["c", "v2"]);
    expect(DEFAULT_MAP_FORM).toBe("c");
  });

  it("?form= が無い・未知なら c。?form=c|v2 はそのとおり", () => {
    expect(parseMapForm("")).toBe("c");
    expect(parseMapForm("?region=morioka")).toBe("c");
    expect(parseMapForm("?form=")).toBe("c");
    expect(parseMapForm("?form=d")).toBe("c");
    expect(parseMapForm("?form=C")).toBe("c");
    expect(parseMapForm("?form=c")).toBe("c");
    expect(parseMapForm("?form=v2")).toBe("v2");
    expect(parseMapForm("?lang=en&form=v2&region=nara")).toBe("v2");
  });

  it("画面のコードが、?form= の既定を c にしている（直書きの v2 の既定が無い）", () => {
    const demo = read("demo/demo.ts");
    expect(demo).toContain("parseMapForm(location.search)");
    expect(demo).not.toMatch(/let form: MapForm = ["']v2["']\s*;/);
    expect(read("demo/old-map-form.ts")).toMatch(/DEFAULT_MAP_FORM: MapForm = "c"/);
  });

  const setting = readJson<{ sources: (string | { mapID: string; settingFile?: string })[] }>("public/apps/morioka.json");

  it("c は、作り直した地図の settingFile を maps-c にする。ベースマップ・TMS はそのまま。元の設定は書き換えない", () => {
    const before = structuredClone(setting);
    const c = settingForForm(setting, "c", estimates);
    expect(setting).toEqual(before);
    const byId = Object.fromEntries(c.sources.filter(s => typeof s !== "string").map(s => [(s as { mapID: string }).mapID, s as { settingFile?: string }]));
    expect(byId.morioka_ndl.settingFile).toBe("maps-c/morioka_ndl.json");
    expect(byId.morioka.settingFile).toBe("maps-c/morioka.json");
    expect(byId.morioka_ndl_affine.settingFile).toBeUndefined();
    expect(c.sources.filter(s => typeof s === "string")).toEqual(["gsi", "osm"]);
  });

  it("v2 は設定を変えない（元の maps/ を読む）。estimates が無いときも変えない", () => {
    expect(settingForForm(setting, "v2", estimates)).toBe(setting);
    expect(settingForForm(setting, "c", undefined)).toBe(setting);
  });

  it("どの地域の app 設定でも、c にした地図の settingFile は実在する", () => {
    for (const f of readdirSync("public/apps").filter(n => n.endsWith(".json") && n !== "sample.json")) {
      const c = settingForForm(readJson<{ sources: (string | { mapID: string })[] }>(`public/apps/${f}`), "c", estimates);
      for (const s of c.sources) {
        if (typeof s === "string") continue;
        const file = (s as { settingFile?: string }).settingFile;
        if (file?.startsWith(`${MAPS_C_DIR}/`)) expect(() => read(`public/${file}`), `${f} ${file}`).not.toThrow();
      }
    }
  });
});

describe("欄に出す、いまの地図の変換の形の情報", () => {
  it("v2 の strict は元の JSON の compiled.strict_status。c は作り直した JSON の値で、estimates と一致する", () => {
    for (const id of mapIDs) {
      const c = readJson(`public/${mapsCPath(id)}`);
      const layers = estimates[id];
      expect(layers[0].strictStatus, id).toBe(c.compiled.strict_status);
      const subs = (c.sub_maps ?? []).filter((s: { compiled?: unknown }) => s.compiled);
      expect(layers.length, id).toBe(1 + subs.length);
      subs.forEach((s: { compiled: { strict_status: string } }, i: number) => expect(layers[i + 1].strictStatus, `${id} sub ${i}`).toBe(s.compiled.strict_status));
      const v2 = v2StrictStatuses(readJson(`public/maps/${id}.json`));
      expect(v2.length, id).toBe(layers.length);
    }
  });

  it("推奨の型が C を含まない地図は、c の形で「推奨は ○○ だが…」の対象になる。C を含めば対象外", () => {
    const notC = mapIDs.filter(id => formInfo("c", id, estimates, [])?.recommendsNotC).sort();
    // 盛岡の 2 枚・奈良（鳥瞰図）・新潟 3 枚・館林の城絵図の B 以外は、推奨に C を含む
    for (const id of mapIDs) {
      const rec = estimates[id][0].recommended;
      expect(notC.includes(id), id).toBe(rec.length > 0 && !rec.includes("C"));
    }
    expect(notC.length).toBeGreaterThan(0);
    expect(estimates.morioka[0].recommended).toEqual(["C"]);
    expect(formInfo("c", "morioka", estimates, [])?.recommendsNotC).toBe(false);
    expect(estimates.nara_1894[0].recommended).toEqual(["B"]);
    expect(formInfo("c", "nara_1894", estimates, [])?.recommendsNotC).toBe(true);
  });

  it("従来型の情報は、CRS が 3857 で、補完点は使わない（null）。作り直していない地図は undefined", () => {
    const info = formInfo("v2", "1932_nobeoka", estimates, ["strict", "loose"]);
    expect(info?.crs).toBe("EPSG:3857");
    expect(info?.supplementCount).toBeNull();
    expect(info?.strict).toEqual({ allStrict: false, main: "strict", insetNotStrict: 1 });
    expect(formInfo("c", "gsi", estimates, undefined)).toBeUndefined();
    expect(formInfo("c", undefined, estimates, undefined)).toBeUndefined();
  });

  it("c の補完点は、本図と挿入図の合計", () => {
    const sum = estimates.kaisei_hiroshima_jissoku.reduce((n, l) => n + l.supplementCount, 0);
    expect(formInfo("c", "kaisei_hiroshima_jissoku", estimates, [])).toMatchObject({ supplementCount: sum, multiLayer: true });
  });

  it("strict の要約", () => {
    expect(summarizeStrict([])).toBeUndefined();
    expect(summarizeStrict(["strict"])).toEqual({ allStrict: true, main: "strict", insetNotStrict: 0 });
    expect(summarizeStrict(["loose"])).toEqual({ allStrict: false, main: "loose", insetNotStrict: 0 });
    expect(summarizeStrict(["strict", "strict", "loose"])).toEqual({ allStrict: false, main: "strict", insetNotStrict: 1 });
  });
});

describe("文言の辞書（ja・en）", () => {
  const keys = (d: Record<string, string>): string[] => Object.keys(d).filter(k => k.startsWith("old.form_")).sort();

  it("変換の形の鍵が、ja と en でそろっている", () => {
    expect(keys(oldMapDict.en)).toEqual(keys(oldMapDict.ja));
    expect(keys(oldMapDict.ja).length).toBeGreaterThan(10);
  });

  it("画面のコードで使う鍵（old.form_*）が、すべて辞書にある", () => {
    const used = new Set([...read("demo/demo.ts").matchAll(/["'`](old\.form_[\w]+)["'`]/g)].map(m => m[1]));
    expect(used.size).toBeGreaterThan(10);
    for (const k of used) {
      expect(oldMapDict.ja[k], `ja ${k}`).toBeTruthy();
      expect(oldMapDict.en[k], `en ${k}`).toBeTruthy();
    }
    // 辞書の鍵はすべて使われている
    for (const k of keys(oldMapDict.ja)) expect(used.has(k), k).toBe(true);
  });

  it("型の呼び名は、三角網＋扇形外挿と従来型（V2）。英語は TIN + fan extrapolation と legacy（横断設計の 2.y 用語）", () => {
    expect(commonDict.ja["type.c"]).toBe("三角網＋扇形外挿");
    expect(commonDict.ja["type.d"]).toBe("従来型");
    expect(oldMapDict.ja["old.form_legacy"]).toBe("従来型（V2）");
    expect(commonDict.en["type.c"]).toBe("TIN + fan extrapolation");
    expect(commonDict.en["type.d"]).toBe("legacy");
    expect(oldMapDict.en["old.form_legacy"]).toBe("legacy");
    const en = Object.values(oldMapDict.en).join("\n");
    expect(en).not.toMatch(/fit score|complement(ary)? point|supplementary point|control point/i);
    expect(en).toContain("Supplement points");
  });

  it("目次の古地図のデモの説明に、変換の形の切り替えのことがある（ja・en）", () => {
    expect(indexDict.ja["ix.old_desc"]).toContain("従来型（V2）");
    expect(indexDict.ja["ix.old_desc"]).toContain("三角網＋扇形外挿");
    expect(indexDict.en["ix.old_desc"]).toContain("legacy (V2)");
    expect(indexDict.en["ix.old_desc"]).toContain("TIN + fan extrapolation");
  });
});
