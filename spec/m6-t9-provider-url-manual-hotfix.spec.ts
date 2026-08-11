// m6-t9 §3.1 AC2: m6-t6 H-A 回帰テスト（m6-t6-provider-url-hotfix.spec.ts）は
// 「自動補完されないこと」のみを検証していたが、AppSourceEditor 経由で data.url に
// 手動値が残っていた場合、mapSourceFactory はそれを素通りさせ ol/source/Google の
// baseUrl（= options.url || 'https://tile.googleapis.com/'、node_modules/ol/source/Google.js:172）を
// 汚染してしまう（自動補完と同型の未対策バグ）。本テストは手動値からの汚染も防ぐことを検証する。
import { afterEach, describe, expect, it, vi } from "vitest";
import { mapSourceFactory } from "../src/source_ex";

function stubRejectingFetch() {
  const fetchStub = vi.fn().mockResolvedValue({
    ok: false,
    json: () => Promise.reject(new Error("network disabled in test")),
  });
  vi.stubGlobal("fetch", fetchStub);
  return fetchStub;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("m6-t9 hotfix: provider の url 手動値からの汚染防止（H-A と同型）", () => {
  it("google_roadmap: data.url に手動値が残っていても baseUrl を汚染しない", async () => {
    stubRejectingFetch();
    const options: any = {
      mapID: "manual-hotfix-google-1",
      maptype: "google_roadmap",
      key: "test-api-key",
      enableCache: false,
      url: "https://evil.example.invalid/{z}/{x}/{y}",
    };
    const source = await mapSourceFactory(options, {});
    expect((source as any).createSessionUrl_).toBe(
      "https://tile.googleapis.com/v1/createSession",
    );
    // mapSourceFactory は options を破壊的に書き換えるため、呼び出し後の options 自身が
    // factory 内部の最終状態を表す（m6-t6-provider-url-hotfix.spec.ts と同じ手法）
    expect(options.url).toBeUndefined();
  });

  it("mapbox: data.url に手動値が残っていても options.url が除去される", async () => {
    stubRejectingFetch();
    const options: any = {
      mapID: "manual-hotfix-mapbox-1",
      maptype: "mapbox",
      accessToken: "test-token",
      style: "mapbox://styles/mapbox/streets-v12",
      enableCache: false,
      url: "https://evil.example.invalid/{z}/{x}/{y}",
    };
    await mapSourceFactory(options, {});
    expect(options.url).toBeUndefined();
  });

  it("maplibre: data.url に手動値が残っていても options.url が除去される", async () => {
    stubRejectingFetch();
    const options: any = {
      mapID: "manual-hotfix-maplibre-1",
      maptype: "maplibre",
      style: "https://tile.openstreetmap.jp/styles/osm-bright/style.json",
      enableCache: false,
      url: "https://evil.example.invalid/{z}/{x}/{y}",
    };
    await mapSourceFactory(options, {});
    expect(options.url).toBeUndefined();
  });

  it("回帰: base（既存の maplat 同梱タイル）は data.url が未指定なら従来どおり自動補完される", async () => {
    const options: any = {
      mapID: "manual-hotfix-base-1",
      maptype: "base",
      enableCache: false,
      homePos: [0, 0],
      defZoom: 10,
    };
    const source = await mapSourceFactory(options, {});
    expect(options.url).toBe("tiles/manual-hotfix-base-1/{z}/{x}/{y}.jpg");
    expect(source).toBeTruthy();
  });
});
