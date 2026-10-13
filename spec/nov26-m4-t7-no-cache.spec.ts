// nov26-m4-t7（#90）: 地図ごとにタイルキャッシュ（Weiwudi）から外す noCache の回帰テスト。
//
// 判定は registerMapToSW（src/source_ex.ts）の中にあり、mapSourceFactory の 3 か所の呼び出し
// （sources の要素が WMTS 系・設定ファイル経由の WMTS 系・古地図）はすべてこの関数を通る。
// 古地図の経路は compiled のデータが要るので単体では通さず、WMTS 系の 2 経路で確かめる。
//
// 観測: Weiwudi.registerMap をスタブにして呼び出しを数え、出来た source の getCacheEnable()
// （= !!this.weiwudi。MaplatApp.getMapCacheEnable(mapID) はこの値を返すだけ）を見る。
// ロジックを再現せず、実経路（mapSourceFactory 本体）を直接呼ぶ。
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const registerMap = vi.hoisted(() =>
  vi.fn(async (mapID: string) => ({
    url: `weiwudi/${mapID}/{z}/{x}/{y}`,
    stats: async () => ({}),
  })),
);

vi.mock("@c4h/weiwudi", () => ({ default: { registerMap } }));

import { mapSourceFactory } from "../src/source_ex";

// 設定ファイル（地図マスタ maps/<mapID>.json）を返す fetch スタブ
function stubSettingFileFetch(settingFile: Record<string, unknown>) {
  const fetchStub = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ ...settingFile }),
  });
  vi.stubGlobal("fetch", fetchStub);
  return fetchStub;
}

beforeEach(() => {
  registerMap.mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// sources の要素にそのまま書いたベースマップ（fetch しない経路）
const inlineBase = (extra: Record<string, unknown> = {}) => ({
  mapID: "t7-base",
  maptype: "base",
  url: "https://tile.example.test/{z}/{x}/{y}.png",
  ...extra,
});

// 地図マスタ（設定ファイル）側のベースマップ
const BASE_MAP_SETTING_FILE = {
  mapID: "t7-file",
  maptype: "base",
  url: "https://tile.example.test/{z}/{x}/{y}.png",
  label: { ja: "マスタのラベル", en: "Master Label" },
  attr: "© Example",
  maxZoom: 19,
};

const fileElement = (extra: Record<string, unknown> = {}) => ({
  mapID: "t7-file",
  settingFile: "maps/t7-file.json",
  ...extra,
});

describe("nov26-m4-t7/AC1: noCache: true の地図は Weiwudi に登録されない", () => {
  it("sources の要素の経路", async () => {
    const source: any = await mapSourceFactory(inlineBase({ noCache: true }), { enableCache: true });
    expect(registerMap).not.toHaveBeenCalled();
    expect(source.getCacheEnable()).toBe(false);
  });

  it("設定ファイルの経路（地図マスタが noCache: true）", async () => {
    stubSettingFileFetch({ ...BASE_MAP_SETTING_FILE, noCache: true });
    const source: any = await mapSourceFactory(fileElement(), { enableCache: true });
    expect(registerMap).not.toHaveBeenCalled();
    expect(source.getCacheEnable()).toBe(false);
  });
});

describe("nov26-m4-t7/AC2: 指定が無い・noCache: false の地図は従来どおり登録される", () => {
  it("sources の要素の経路・指定なし", async () => {
    const source: any = await mapSourceFactory(inlineBase(), { enableCache: true });
    expect(registerMap).toHaveBeenCalledTimes(1);
    expect(registerMap.mock.calls[0][0]).toBe("t7-base");
    expect(source.getCacheEnable()).toBe(true);
  });

  it("sources の要素の経路・noCache: false", async () => {
    const source: any = await mapSourceFactory(inlineBase({ noCache: false }), { enableCache: true });
    expect(registerMap).toHaveBeenCalledTimes(1);
    expect(source.getCacheEnable()).toBe(true);
  });

  it("設定ファイルの経路・指定なし", async () => {
    stubSettingFileFetch(BASE_MAP_SETTING_FILE);
    const source: any = await mapSourceFactory(fileElement(), { enableCache: true });
    expect(registerMap).toHaveBeenCalledTimes(1);
    expect(registerMap.mock.calls[0][0]).toBe("t7-file");
    expect(source.getCacheEnable()).toBe(true);
  });

  it("真偽値でない \"true\"（文字列）は除外とみなさない（=== true の判定）", async () => {
    const source: any = await mapSourceFactory(inlineBase({ noCache: "true" }), { enableCache: true });
    expect(registerMap).toHaveBeenCalledTimes(1);
    expect(source.getCacheEnable()).toBe(true);
  });
});

describe("nov26-m4-t7/AC3: 二層（地図マスタと app の要素。app の要素が勝つ）", () => {
  it("地図マスタの noCache: true を app の要素の noCache: false で打ち消せる（登録される）", async () => {
    stubSettingFileFetch({ ...BASE_MAP_SETTING_FILE, noCache: true });
    const source: any = await mapSourceFactory(fileElement({ noCache: false }), { enableCache: true });
    expect(registerMap).toHaveBeenCalledTimes(1);
    expect(source.getCacheEnable()).toBe(true);
  });

  it("app の要素の noCache: true だけでも除外される", async () => {
    stubSettingFileFetch(BASE_MAP_SETTING_FILE);
    const source: any = await mapSourceFactory(fileElement({ noCache: true }), { enableCache: true });
    expect(registerMap).not.toHaveBeenCalled();
    expect(source.getCacheEnable()).toBe(false);
  });
});

describe("nov26-m4-t7/AC4: enableCache: false ではどの地図も登録しない", () => {
  it.each([
    ["指定なし", {}],
    ["noCache: false", { noCache: false }],
    ["noCache: true", { noCache: true }],
  ])("sources の要素の経路・%s", async (_label, extra) => {
    const source: any = await mapSourceFactory(inlineBase(extra), { enableCache: false });
    expect(registerMap).not.toHaveBeenCalled();
    expect(source.getCacheEnable()).toBe(false);
  });

  it("設定ファイルの経路・noCache: false", async () => {
    stubSettingFileFetch(BASE_MAP_SETTING_FILE);
    const source: any = await mapSourceFactory(fileElement({ noCache: false }), { enableCache: false });
    expect(registerMap).not.toHaveBeenCalled();
    expect(source.getCacheEnable()).toBe(false);
  });
});
