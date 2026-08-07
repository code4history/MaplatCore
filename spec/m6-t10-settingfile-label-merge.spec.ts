// m6-t10 設計 §3.5.2 / AC20 の回帰テスト。
//
// エディタの新しい出力文法（ADR-0017）では、ベースマップの定義は maps/<slug>.json
// （settingFile）側に置かれ、アプリ JSON の sources 要素は「上書き分のみ」を持つ。
// 上書きが無いソースは label キーを持たない。
//
// ところが source_ex.ts:125 の
//     options.label = options.label || options.year;
// は `||` の結果が undefined でも代入を実行するため、label を持たないアプリ要素に
// `label: undefined` という own key を実体化していた。Object.assign は値が undefined でも
// own enumerable property をコピーするので、:188 の Object.assign(resp, options) で
// settingFile 側の label が undefined で潰れる（:189 のフォールバックは resp.year だが、
// ベースマップに year は無い）。
//
// 結果、mixin.ts:87 の this.label = options.label を経て Maplat のレイヤ切替 UI
// （ui_init.ts:581,593 の translate(source.label)）へ undefined が渡り、ラベルが消える。
import { afterEach, describe, expect, it, vi } from "vitest";
import { mapSourceFactory } from "../src/source_ex";

// settingFile を返す fetch スタブ。mapSourceFactory は :182 で fetch し :187 で json() を読む。
function stubSettingFileFetch(settingFile: Record<string, unknown>) {
  const fetchStub = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(settingFile),
  });
  vi.stubGlobal("fetch", fetchStub);
  return fetchStub;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

// 新文法のベースマップ設定ファイル（§3.5 の形）。maptype は settingFile 側が持つ。
const BASE_MAP_SETTING_FILE = {
  mapID: "m6t10-osm",
  maptype: "base",
  url: "https://tile.example.test/{z}/{x}/{y}.png",
  label: { ja: "マスタのラベル", en: "Master Label" },
  title: { ja: "マスタのタイトル" },
  attr: "© Example",
  maxZoom: 19,
};

describe("m6-t10 §3.5.2 / AC20: settingFile 経由の label がアプリ要素に潰されない", () => {
  it("アプリ要素が label を持たないとき、settingFile 側の label が生き残る", async () => {
    stubSettingFileFetch(BASE_MAP_SETTING_FILE);
    // 新文法のアプリ JSON 要素: 参照と上書き分のみ。label も maptype も持たない
    const source = await mapSourceFactory(
      { mapID: "m6t10-osm", settingFile: "maps/m6t10-osm.json" },
      { enableCache: false },
    );
    expect((source as any).label).toEqual({ ja: "マスタのラベル", en: "Master Label" });
  });

  it("アプリ要素が label を上書きしているときは、上書き側が勝つ", async () => {
    stubSettingFileFetch(BASE_MAP_SETTING_FILE);
    const source = await mapSourceFactory(
      {
        mapID: "m6t10-osm",
        settingFile: "maps/m6t10-osm.json",
        label: { ja: "アプリの上書き", en: "Master Label" },
      },
      { enableCache: false },
    );
    expect((source as any).label).toEqual({ ja: "アプリの上書き", en: "Master Label" });
  });

  it("回帰: アプリ要素が year を持つとき、従来どおり year が label へ落ちる", async () => {
    stubSettingFileFetch(BASE_MAP_SETTING_FILE);
    const source = await mapSourceFactory(
      { mapID: "m6t10-osm", settingFile: "maps/m6t10-osm.json", year: "1888" },
      { enableCache: false },
    );
    // :125 の label = label || year がアプリ要素側の year を拾い、
    // それが :188 の Object.assign で settingFile 側 label より優先される（従来どおり）
    expect((source as any).label).toBe("1888");
  });

  it("回帰: settingFile 側が year を持ち label を持たないとき、:189 のフォールバックが効く", async () => {
    const { label: _omitted, ...withoutLabel } = BASE_MAP_SETTING_FILE;
    stubSettingFileFetch({ ...withoutLabel, year: "1902" });
    const source = await mapSourceFactory(
      { mapID: "m6t10-osm", settingFile: "maps/m6t10-osm.json" },
      { enableCache: false },
    );
    expect((source as any).label).toBe("1902");
  });

  it("回帰: インライン経路（maptype を要素側が持つ）では label も year も無いと undefined のまま", async () => {
    // :126 の WMTS 分岐へ入るため fetch は起きない。従来挙動と同じであることを固定する
    const source = await mapSourceFactory(
      { mapID: "m6t10-inline", maptype: "base", url: "https://tile.example.test/{z}/{x}/{y}.png" },
      { enableCache: false },
    );
    expect((source as any).label).toBeUndefined();
  });
});
