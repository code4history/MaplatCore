// IIIF の配信の判定（checkIiifDelivery）と取得（resolveIiifDelivery）の試験。
//
// checkIiifDelivery は info.json を取得しない純粋な関数で、Core で配れるかを返す
// （Editor の取り込みの判定もこれを呼ぶので、Core の対応が増えれば判定も追随する）。
// 資料は spec/fixtures/iiif/ のもの（変えない）。
import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  checkIiifDelivery,
  IiifDeliveryError,
  isUnusableSource,
  resolveIiifDelivery,
  unusableSource
} from "../src/iiif/delivery";
import { transPng } from "../src/const_ex";

function readFixture(name: string) {
  return JSON.parse(
    readFileSync(resolve(__dirname, "fixtures/iiif", name), "utf-8")
  );
}

// Image API 1.1 の info.json（試験の資料が無いので、この場で作る）
const VERSION1_INFO = {
  "@context": "http://library.stanford.edu/iiif/image-api/1.1/context.json",
  identifier: "https://iiif.example.test/v1",
  width: 4074,
  height: 2705,
  profile: "http://library.stanford.edu/iiif/image-api/1.1/comliance.html#level2"
};

describe("checkIiifDelivery: 8 通り", () => {
  it("1. v2 level1（NDL）は任意の領域が取れるので arbitrary", () => {
    const info = readFixture("ndl-948741-r1.info.json");
    expect(
      checkIiifDelivery(info, { width: info.width, height: info.height })
    ).toEqual({
      ok: true,
      version: "2",
      level: 1,
      tiling: "arbitrary"
    });
  });

  it("2. v3 level1（gottingen）も arbitrary", () => {
    const info = readFixture("iiif-io-v3-gottingen.info.json");
    expect(
      checkIiifDelivery(info, { width: info.width, height: info.height })
    ).toEqual({
      ok: true,
      version: "3",
      level: 1,
      tiling: "arbitrary"
    });
  });

  it("2b. v2 level2（Stanford）は level 2 で arbitrary", () => {
    const info = readFixture("stanford-v2-level2.info.json");
    expect(
      checkIiifDelivery(info, { width: info.width, height: info.height })
    ).toEqual({
      ok: true,
      version: "2",
      level: 2,
      tiling: "arbitrary"
    });
  });

  it("3. level0 でタイルが 256 なら level0-256", () => {
    const info = readFixture("level0-tiles-256.info.json");
    expect(
      checkIiifDelivery(info, { width: info.width, height: info.height })
    ).toEqual({
      ok: true,
      version: "3",
      level: 0,
      tiling: "level0-256"
    });
  });

  it("4. level0 でタイルが 512 は、今は unsupported-level0（切り出しの枝が入るまで）", () => {
    const info = readFixture("level0-tiles-512.info.json");
    expect(
      checkIiifDelivery(info, { width: info.width, height: info.height })
    ).toEqual({ ok: false, reason: "unsupported-level0" });
  });

  it("5. sizes だけでタイルが無い level0 は unsupported-level0", () => {
    const info = readFixture("level0-sizes.info.json");
    expect(
      checkIiifDelivery(info, { width: info.width, height: info.height })
    ).toEqual({ ok: false, reason: "unsupported-level0" });
  });

  it("6. v1 は unsupported-version", () => {
    expect(
      checkIiifDelivery(VERSION1_INFO, {
        width: VERSION1_INFO.width,
        height: VERSION1_INFO.height
      })
    ).toEqual({ ok: false, reason: "unsupported-version" });
  });

  it("7. width が expected と違えば size-mismatch", () => {
    const info = readFixture("level0-tiles-256.info.json");
    expect(
      checkIiifDelivery(info, { width: info.width + 1, height: info.height })
    ).toEqual({ ok: false, reason: "size-mismatch" });
  });

  it("8. 壊れた JSON は not-json", () => {
    expect(checkIiifDelivery("{ this is not json", undefined)).toEqual({
      ok: false,
      reason: "not-json"
    });
  });
});

// --- resolveIiifDelivery: 取得まわりと警告 ---

type StubResponse = {
  ok: boolean;
  status: number;
  headers: { get: (name: string) => string | null };
  body: any;
  text: () => Promise<string>;
};

function stubResponse(options: {
  payload?: string;
  ok?: boolean;
  status?: number;
  contentLength?: string | null;
  readNotAllowed?: boolean;
}): StubResponse {
  const payload = options.payload ?? "";
  return {
    ok: options.ok !== undefined ? options.ok : true,
    status: options.status ?? 200,
    headers: {
      get: (name: string) => {
        const key = name.toLowerCase();
        if (key === "content-length")
          return options.contentLength === undefined ? null : options.contentLength;
        if (key === "content-type") return "application/json";
        return null;
      }
    },
    body: null,
    text: () => {
      if (options.readNotAllowed)
        return Promise.reject(new Error("本文を読んではいけない"));
      return Promise.resolve(payload);
    }
  };
}

// 本文を少しずつ返す応答（Content-Length が無いときの累計の上限を見る）
function streamingResponse(chunks: Uint8Array[]): StubResponse {
  let index = 0;
  return {
    ok: true,
    status: 200,
    headers: { get: () => null },
    body: {
      getReader: () => ({
        read: () =>
          Promise.resolve(
            index < chunks.length
              ? { done: false, value: chunks[index++] }
              : { done: true, value: undefined }
          ),
        cancel: () => Promise.resolve()
      })
    },
    text: () => Promise.reject(new Error("本文を文字列で読んではいけない"))
  };
}

const fetchReturning = (response: StubResponse) =>
  (() => Promise.resolve(response)) as unknown as typeof fetch;

// 資料をそのまま返す fetch（ネットワークに出ない）
const jsonFetch = (json: unknown) =>
  fetchReturning(stubResponse({ payload: JSON.stringify(json) }));

const fetchRefusing = () =>
  (() => Promise.reject(new Error("network is down"))) as unknown as typeof fetch;

const NDL = readFixture("ndl-948741-r1.info.json");
const NDL_URL = NDL["@id"];
const EXPECTED_NDL = { width: NDL.width, height: NDL.height };

describe("resolveIiifDelivery: URL の形", () => {
  it("http:/https: 以外の URL は、取得せずに bad-url", async () => {
    const fetchImpl = vi.fn();
    for (const url of ["ftp://example.test/iiif", "not a url", ""]) {
      const resolved = resolveIiifDelivery({ type: "iiifImage", url }, EXPECTED_NDL, {
        fetchImpl: fetchImpl as unknown as typeof fetch
      });
      await expect(resolved).rejects.toBeInstanceOf(IiifDeliveryError);
      await expect(resolved).rejects.toMatchObject({ reason: "bad-url" });
    }
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("info.json は末尾の / を 1 つにまとめて取りに行く", async () => {
    const calls: string[] = [];
    const fetchImpl = ((url: string) => {
      calls.push(url);
      return Promise.resolve(stubResponse({ payload: JSON.stringify(NDL) }));
    }) as unknown as typeof fetch;
    await resolveIiifDelivery({ type: "iiifImage", url: `${NDL_URL}/` }, EXPECTED_NDL, {
      fetchImpl
    });
    expect(calls).toEqual([`${NDL_URL}/info.json`]);
  });
});

describe("resolveIiifDelivery: 取得の失敗", () => {
  it("応答が ok でなければ fetch-failed", async () => {
    await expect(
      resolveIiifDelivery({ type: "iiifImage", url: NDL_URL }, EXPECTED_NDL, {
        fetchImpl: fetchReturning(stubResponse({ ok: false, status: 404 }))
      })
    ).rejects.toMatchObject({ reason: "fetch-failed" });
  });

  it("fetch そのものが失敗すれば fetch-failed", async () => {
    await expect(
      resolveIiifDelivery({ type: "iiifImage", url: NDL_URL }, EXPECTED_NDL, {
        fetchImpl: fetchRefusing()
      })
    ).rejects.toMatchObject({ reason: "fetch-failed" });
  });

  it("10 秒で時間切れ（偽の時計。実際には待たない）", async () => {
    vi.useFakeTimers();
    try {
      const fetchImpl = ((_url: string, init: any) =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener("abort", () =>
            reject(new Error("aborted"))
          );
        })) as unknown as typeof fetch;
      let state = "pending";
      const settled = resolveIiifDelivery(
        { type: "iiifImage", url: NDL_URL },
        EXPECTED_NDL,
        { fetchImpl }
      ).then(
        value => {
          state = "resolved";
          return value;
        },
        error => {
          state = "rejected";
          return error;
        }
      );
      // 10 秒の手前ではまだ時間切れにならない
      await vi.advanceTimersByTimeAsync(9999);
      expect(state).toBe("pending");
      await vi.advanceTimersByTimeAsync(1);
      const error: any = await settled;
      expect(state).toBe("rejected");
      expect(error).toBeInstanceOf(IiifDeliveryError);
      expect(error).toMatchObject({ reason: "timeout" });
    } finally {
      vi.useRealTimers();
    }
  });

  it("Content-Length が 1 MiB を超えたら、本文を読まずに too-large", async () => {
    await expect(
      resolveIiifDelivery({ type: "iiifImage", url: NDL_URL }, EXPECTED_NDL, {
        fetchImpl: fetchReturning(
          stubResponse({
            payload: JSON.stringify(NDL),
            contentLength: String(1024 * 1024 + 1),
            readNotAllowed: true
          })
        )
      })
    ).rejects.toMatchObject({ reason: "too-large" });
  });

  it("Content-Length が無くても、読みながらの累計が 1 MiB を超えたら too-large", async () => {
    const chunk = new Uint8Array(512 * 1024).fill(65); // 'A' 512 KiB
    await expect(
      resolveIiifDelivery({ type: "iiifImage", url: NDL_URL }, EXPECTED_NDL, {
        fetchImpl: fetchReturning(
          streamingResponse([chunk, chunk, chunk]) // 1.5 MiB
        )
      })
    ).rejects.toMatchObject({ reason: "too-large" });
  });

  it("JSON でなければ not-json", async () => {
    await expect(
      resolveIiifDelivery({ type: "iiifImage", url: NDL_URL }, EXPECTED_NDL, {
        fetchImpl: fetchReturning(stubResponse({ payload: "<html>404</html>" }))
      })
    ).rejects.toMatchObject({ reason: "not-json" });
  });

  it("v1 は unsupported-version", async () => {
    await expect(
      resolveIiifDelivery(
        { type: "iiifImage", url: "https://iiif.example.test/v1" },
        { width: VERSION1_INFO.width, height: VERSION1_INFO.height },
        {
          fetchImpl: fetchReturning(
            stubResponse({ payload: JSON.stringify(VERSION1_INFO) })
          )
        }
      )
    ).rejects.toMatchObject({ reason: "unsupported-version" });
  });

  it("大きさが expected と違えば size-mismatch", async () => {
    await expect(
      resolveIiifDelivery({ type: "iiifImage", url: NDL_URL }, { width: NDL.width + 1, height: NDL.height }, {
        fetchImpl: fetchReturning(stubResponse({ payload: JSON.stringify(NDL) }))
      })
    ).rejects.toMatchObject({ reason: "size-mismatch" });
  });

  it("level0 の 512 タイルは今は unsupported-level0", async () => {
    const info = readFixture("level0-tiles-512.info.json");
    await expect(
      resolveIiifDelivery(
        { type: "iiifImage", url: info.id },
        { width: info.width, height: info.height },
        { fetchImpl: fetchReturning(stubResponse({ payload: JSON.stringify(info) })) }
      )
    ).rejects.toMatchObject({ reason: "unsupported-level0" });
  });
});

describe("resolveIiifDelivery: 成功と警告", () => {
  it("width・height・info を返し、紙の外は透明 PNG になる", async () => {
    const delivery = await resolveIiifDelivery(
      { type: "iiifImage", url: NDL_URL },
      EXPECTED_NDL,
      { fetchImpl: jsonFetch(NDL) }
    );
    expect(delivery.width).toBe(NDL.width);
    expect(delivery.height).toBe(NDL.height);
    expect(delivery.info).toEqual(NDL);
    expect(delivery.warnings).toEqual([]);
    expect(delivery.tileUrlFunction([4, 3, 2])).toBe(
      `${NDL_URL}/768,512,256,256/256,/0/default.jpg`
    );
    expect(delivery.tileUrlFunction([4, 16, 0])).toBe(transPng);
  });

  it("@id が delivery.url と違えば、タイルは delivery.url を基準にして警告が 1 回", async () => {
    // 資料の @id は stacks.stanford.edu。delivery.url は別のホストにする
    const info = readFixture("stanford-v2-level2.info.json");
    const deliveryUrl = "https://iiif.example.test/stanford-mirror";
    const delivery = await resolveIiifDelivery(
      { type: "iiifImage", url: deliveryUrl },
      { width: info.width, height: info.height },
      { fetchImpl: jsonFetch(info) }
    );
    expect(delivery.warnings.length).toBe(1);
    expect(delivery.warnings[0].startsWith("Maplat: ")).toBe(true);
    expect(delivery.warnings[0]).toContain(info["@id"]);
    expect(delivery.tileUrlFunction([0, 0, 0])).toBe(
      `${deliveryUrl}/full/170,/0/default.jpg`
    );
  });

  it("@id が delivery.url と同じなら警告は出ない", async () => {
    const info = readFixture("stanford-v2-level2.info.json");
    const delivery = await resolveIiifDelivery(
      { type: "iiifImage", url: info["@id"] },
      { width: info.width, height: info.height },
      { fetchImpl: jsonFetch(info) }
    );
    expect(delivery.warnings).toEqual([]);
  });
});

// --- 使えない IIIF の地図の印（起動を止めないための控え。結線は次の段） ---
describe("unusableSource / isUnusableSource: 使えない地図の印", () => {
  it("印は mapID と理由だけを持ち、isUnusableSource で見分けられる", () => {
    const error = new IiifDeliveryError("size-mismatch");
    const marked = unusableSource({ mapID: "iiif-map" }, error);
    expect(marked).toEqual({
      mapID: "iiif-map",
      __maplatUnusable: { reason: "size-mismatch" }
    });
    expect(isUnusableSource(marked)).toBe(true);
    // 印でないものは false（source・null・文字列）
    expect(isUnusableSource(null)).toBe(false);
    expect(isUnusableSource("iiif-map")).toBe(false);
    expect(isUnusableSource({ mapID: "iiif-map" })).toBe(false);
  });
});

// --- level0-256 の minZoom ---
// level0 のタイルの地図は、info.json の scaleFactors に無い倍率のズームを要求すると、
// 静的なサーバに無いファイルを指す。HistMap の minZoom を「最も粗いタイルの倍率」まで上げて、
// それより引いた表示では OL が最も粗いタイルを縮めて描くようにする。
describe("resolveIiifDelivery: level0-256 の minZoom", () => {
  const resolveLevel0 = (info: any) =>
    resolveIiifDelivery(
      { type: "iiifImage", url: info["@id"] || info.id },
      { width: info.width, height: info.height },
      { fetchImpl: jsonFetch(info) }
    );

  it("scaleFactors が 1〜16 の資料は minZoom 0（maxZoom 4 と一致する）", async () => {
    const info = readFixture("level0-tiles-256.info.json");
    const delivery = await resolveLevel0(info);
    expect(delivery.minZoom).toBe(0);
  });

  it("scaleFactors を 1〜4 にした資料は minZoom 2（資料のファイルは変えず、この場で写して変える）", async () => {
    const info = JSON.parse(
      JSON.stringify(readFixture("level0-tiles-256.info.json"))
    );
    info.tiles[0].scaleFactors = [1, 2, 4];
    const delivery = await resolveLevel0(info);
    expect(delivery.minZoom).toBe(2);
  });

  it("任意の領域が取れる資料（NDL）は、倍率の制限が無いので minZoom を入れない", async () => {
    const delivery = await resolveLevel0(NDL);
    expect(delivery.minZoom).toBeUndefined();
  });
});

// --- level0-256 の倍率の形 ---
// level0 のタイルの地図は、倍率が 1 から始まる 2 の冪の連続で並んでいるものだけを配る。
// 途中の倍率が欠けた資料は、そのズームのタイルが静的なサーバに無く画が抜けるので配らない。
describe("level0-256 の倍率の形", () => {
  const level0WithScales = (scaleFactors: number[]) => {
    const info = JSON.parse(
      JSON.stringify(readFixture("level0-tiles-256.info.json"))
    );
    info.tiles[0].scaleFactors = scaleFactors;
    return info;
  };
  const checkLevel0 = (info: any) =>
    checkIiifDelivery(info, { width: info.width, height: info.height });
  const resolveLevel0 = (info: any) =>
    resolveIiifDelivery(
      { type: "iiifImage", url: info["@id"] || info.id },
      { width: info.width, height: info.height },
      { fetchImpl: jsonFetch(info) }
    );

  it("[1,2,4,8,16,32] は level0-256 で、minZoom は負にならず 0 に丸まる", async () => {
    const info = level0WithScales([1, 2, 4, 8, 16, 32]);
    expect(checkLevel0(info)).toEqual({
      ok: true,
      version: "3",
      level: 0,
      tiling: "level0-256"
    });
    const delivery = await resolveLevel0(info);
    expect(delivery.minZoom).toBe(0);
  });

  for (const scaleFactors of [[1, 2, 3], [1, 4]]) {
    it(`[${scaleFactors.join(",")}] は 2 の冪の連続でないので unsupported-level0`, async () => {
      const info = level0WithScales(scaleFactors);
      expect(checkLevel0(info)).toEqual({
        ok: false,
        reason: "unsupported-level0"
      });
      const promise = resolveLevel0(info);
      await expect(promise).rejects.toBeInstanceOf(IiifDeliveryError);
      await expect(promise).rejects.toMatchObject({
        reason: "unsupported-level0"
      });
    });
  }

  it("倍率（scaleFactors）が無い資料も unsupported-level0", async () => {
    const info = level0WithScales([1, 2, 4]);
    info.tiles = [{ width: 256, height: 256 }];
    expect(checkLevel0(info)).toEqual({
      ok: false,
      reason: "unsupported-level0"
    });
    await expect(resolveLevel0(info)).rejects.toMatchObject({
      reason: "unsupported-level0"
    });
  });
});

// --- 大きさの検査 ---
// info.json の width・height が正の整数でないと、この先の OL の格子が
// 「Missing or invalid size」の素の Error を投げ、呼び手が理由を受け取れない。
describe("checkIiifDelivery: 大きさの検査", () => {
  const level0WithoutSize = () => {
    const info = JSON.parse(
      JSON.stringify(readFixture("level0-tiles-256.info.json"))
    );
    return info;
  };

  it("info.json に width が無ければ size-mismatch（資料は変えず、この場で写して消す）", () => {
    const info = level0WithoutSize();
    delete info.width;
    expect(checkIiifDelivery(info)).toEqual({
      ok: false,
      reason: "size-mismatch"
    });
  });

  it("info.json に height が無ければ size-mismatch", () => {
    const info = level0WithoutSize();
    delete info.height;
    expect(checkIiifDelivery(info)).toEqual({
      ok: false,
      reason: "size-mismatch"
    });
  });

  it("expected の width・height が正の整数でなければ size-mismatch", () => {
    const info = level0WithoutSize();
    expect(
      checkIiifDelivery(info, { width: undefined as any, height: info.height })
    ).toEqual({ ok: false, reason: "size-mismatch" });
    expect(
      checkIiifDelivery(info, { width: info.width, height: 0 })
    ).toEqual({ ok: false, reason: "size-mismatch" });
  });
});
