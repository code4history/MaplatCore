// m6-t6 実装レビュー H-A hotfix 回帰テスト。
// mapSourceFactory の url 自動補完（source_ex.ts:153/213）が provider（google）maptype にも
// 効いてしまい、ol/source/Google の baseUrl(= options.url || 'https://tile.googleapis.com/') を
// 汚染して createSession リクエストが誤った先へ飛ぶ問題の回帰防止。
import { afterEach, describe, expect, it, vi } from "vitest";
import { mapSourceFactory } from "../src/source_ex";

// ol/source/Google のコンストラクタは同期的に createSessionUrl_ を確定させた直後、
// 非同期の createSession_()（fetch）を待たずに発火する（コンストラクタは await/catch しない）。
// createSession_() 内部は `!response.ok` は自前で catch して setState('error') するが、
// fetch 自体の reject は catch しないため、素朴に fetch を reject させると unhandled rejection
// になる。ok:false の Response 相当を resolve させ、内部の catch 経路に乗せて回避する。
// テストでは createSessionUrl_ の値だけを確認する（getError() は非同期エラーのため未使用）。
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

describe("m6-t6 hotfix: provider の url 自動補完除外", () => {
  it("google_roadmap: options.url が未指定のまま ol/source/Google へ渡り、既定の tile.googleapis.com を使う", async () => {
    stubRejectingFetch();
    const source = await mapSourceFactory(
      {
        mapID: "hotfix-google-1",
        maptype: "google_roadmap",
        key: "test-api-key",
        enableCache: false,
      },
      {},
    );
    // m6-t6 hotfix 前は options.url が `tiles/hotfix-google-1/{z}/{x}/{y}.jpg` へ自動補完され、
    // createSessionUrl_ がプレビューサーバ相対の壊れた URL になっていた
    expect((source as any).createSessionUrl_).toBe(
      "https://tile.googleapis.com/v1/createSession",
    );
  });

  it("google（無印）でも同様に url 自動補完されない", async () => {
    stubRejectingFetch();
    const source = await mapSourceFactory(
      { mapID: "hotfix-google-2", maptype: "google", key: "test-api-key", enableCache: false },
      {},
    );
    expect((source as any).createSessionUrl_).toBe(
      "https://tile.googleapis.com/v1/createSession",
    );
  });

  it("回帰: base（既存の maplat 同梱タイル）は従来どおり url が自動補完される", async () => {
    // baseDict 経由（文字列 ID）は既存の m6-t3-basedict-licenses.spec.ts で検証済みのため、
    // ここでは maptype 明示の base で自動補完対象のままであることのみ確認する。
    // 実装レビュー round2 N-2: expect(source).toBeTruthy() のみでは url の値そのものを
    // 検証していなかった。m5-t2-translator-removal.spec.ts:38-49 と同じ手法（mapSourceFactory
    // は Object.assign(options, commonOptions) で引数オブジェクトを直接書き換え、normalizeArg も
    // 同一参照を返すため、呼び出し後の options 自身が factory 内部の最終状態を表す）で
    // options.url を直接 assert する
    const options: any = {
      mapID: "hotfix-base-1",
      maptype: "base",
      enableCache: false,
      homePos: [0, 0],
      defZoom: 10,
    };
    const source = await mapSourceFactory(options, {});
    expect(options.url).toBe("tiles/hotfix-base-1/{z}/{x}/{y}.jpg");
    expect(source).toBeTruthy();
  });
});
