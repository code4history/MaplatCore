// M5-T2 AC7: 死んだ `translator` フックの撤去を実証する。
//
// なぜこの条件を選ぶか（設計書 §8）:
//   `options.translator` は公開 API `mapSourceFactory` の options 経由で渡す動的フックで、
//   `source_ex.ts` の2箇所で `options.url = options.translator(options.url)` を実行していた。
//   ただし直後の `registerMapToSW()` が weiwudi を返すと `options.url` は
//   `options.weiwudi.url` で上書きされるため、**weiwudi が返る経路では撤去の有無で差が出ず
//   検証にならない**。∴ `enableCache: false` を渡して `registerMapToSW` を早期 return させる
//   （`source_ex.ts:235`）。これが「成功系だけの失敗時テスト」を避けるための条件設定である。
//
// 観測方法:
//   `mapSourceFactory` は `Object.assign(options, commonOptions)` で引数オブジェクトを直接変更し、
//   `normalizeArg` は同一参照を返す（`functions.ts:108-115` の reduce が options 自身を返す）。
//   ∴ 呼び出し後の引数オブジェクトが factory 内部の `options` の最終状態そのものである。
//   ロジックを再現せず、実経路（`mapSourceFactory` 本体）を直接呼んで観測する。
import { describe, it, expect } from "vitest";
import { mapSourceFactory } from "../src/source_ex";

const ORIGINAL_URL = "https://tiles.example.test/orig/{z}/{x}/{y}.png";
const REPLACED_URL = "https://tiles.example.test/REPLACED/{z}/{x}/{y}.png";

describe("m5-t2: translator フックの撤去", () => {
  it("AC7-1: translator を渡しても options.url が書き換わらない（撤去の実証）", async () => {
    const options: any = {
      mapID: "m5t2-translator-probe",
      maptype: "base",
      url: ORIGINAL_URL,
      // weiwudi による url 上書きを避け、translator の効果だけを観測できるようにする
      enableCache: false,
      translator: () => REPLACED_URL
    };

    await mapSourceFactory(options, {});

    // 撤去前はここが REPLACED_URL になる（＝フックが生きている状態）。撤去後は元の URL のまま
    expect(options.url).toBe(ORIGINAL_URL);
  });

  it("AC7-2: translator を渡さない既定経路の URL 自動合成が従来どおり（非回帰）", async () => {
    // 撤去箇所は `tiles/{mapID}/…` の自動合成より前にあるため、撤去が合成へ影響しないことを固定する
    const options: any = {
      mapID: "m5t2-auto-compose",
      maptype: "base",
      enableCache: false
    };

    await mapSourceFactory(options, {});

    expect(options.url).toBe("tiles/m5t2-auto-compose/{z}/{x}/{y}.jpg");
  });

  it("AC7-3: url 未指定 + translator ありでも自動合成が translator に汚染されない", async () => {
    // 撤去前の箇所1は URL 自動合成より前に走るため、`translator(undefined)` の戻り値が truthy だと
    // `tiles/{mapID}/…` の合成が飛ぶという副作用を持っていた（設計書 §2.3）。
    // 撤去後はこの副作用が消え、自動合成が必ず働くことを固定する
    const options: any = {
      mapID: "m5t2-auto-with-translator",
      maptype: "base",
      enableCache: false,
      translator: () => REPLACED_URL
    };

    await mapSourceFactory(options, {});

    expect(options.url).toBe("tiles/m5t2-auto-with-translator/{z}/{x}/{y}.jpg");
  });
});
