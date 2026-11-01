// IIIF Image API の画像を Maplat の古地図として配るための関数。
//
// 設計の要点:
//   - info.json の読みと、要求 URL の文法（region・size・品質・形式）は OpenLayers に任せる
//     （ol/format の IIIFInfo・ol/source の IIIF）。ここでは IIIF の URL の文法を書かない。
//   - 格子とタイルの読み込みは Maplat の HistMap のまま。IIIF から借りるのは URL の関数だけ。
//   - Maplat の座標は画素の 1 次の変換で、原点・y の向き・タイルの番号の付け方が OL の IIIF の格子と
//     同じなので、OL が作る URL の関数を Maplat の (z, x, y) にそのまま当てられる。
import { IIIFInfo } from "ol/format";
import { IIIF } from "ol/source";
import { tileSize as TILE_SIZE, transPng } from "../const_ex";

/** Core で配れない理由 */
export type IiifDeliveryReason =
  | "bad-url"
  | "fetch-failed"
  | "timeout"
  | "too-large"
  | "not-json"
  | "unsupported-version"
  | "unsupported-level0"
  | "size-mismatch";

/** info.json を検査した結果 */
export type IiifDeliveryCheck =
  | {
      ok: true;
      version: "2" | "3";
      level: 0 | 1 | 2;
      tiling: "arbitrary" | "level0-256" | "level0-crop";
    }
  | { ok: false; reason: IiifDeliveryReason };

export class IiifDeliveryError extends Error {
  readonly reason: IiifDeliveryReason;
  readonly mapID?: string;

  constructor(reason: IiifDeliveryReason, message?: string, mapID?: string) {
    super(message || reason);
    this.name = "IiifDeliveryError";
    this.reason = reason;
    this.mapID = mapID;
  }
}

/** 画像サービスの URL から info.json の URL を作る（末尾の / は 1 つにまとめる） */
function infoJsonUrl(url: string) {
  return `${url.replace(/\/+$/, "")}/info.json`;
}

// level0 の 256 でないタイル（512・1024 等）の切り出しの口は、まだ入れていない。
// この枝が入る PR で true にする（Editor の取り込みの判定も自動で追随する）。
const LEVEL0_CROP_SUPPORTED = false;

// info.json をオブジェクトにする（文字列なら JSON として読む）
function toInfoObject(info: unknown): any | undefined {
  if (typeof info === "string") {
    try {
      return JSON.parse(info);
    } catch (_e) {
      return undefined;
    }
  }
  if (info && typeof info === "object") return info;
  return undefined;
}

// profile の 'level0'〜'level2' を数にする
function levelOf(iiif: IIIFInfo, version: string): 0 | 1 | 2 {
  const level = iiif.getComplianceLevelFromProfile(version);
  const matched = level ? /level([0-2])/.exec(level) : null;
  return matched ? (Number(matched[1]) as 0 | 1 | 2) : 0;
}

// タイルの大きさ（幅・高さ）を数にそろえる
function tileSizeOf(tileSize: any): { width?: number; height?: number } {
  if (tileSize === undefined || tileSize === null) return {};
  if (typeof tileSize === "number") return { width: tileSize, height: tileSize };
  if (Array.isArray(tileSize)) {
    const width = tileSize[0];
    const height = tileSize[1] === undefined ? tileSize[0] : tileSize[1];
    return { width, height };
  }
  return {};
}

// 大きさとして使える数か（正の整数だけ）
function isPositiveInteger(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) > 0;
}

// 倍率が 1 から始まる 2 の冪の連続か（[1]・[1,2]・[1,2,4]・…）。
// level0 のタイルの地図は、途中の倍率が欠けていると、そのズームのタイルが静的な
// サーバに無く画が抜ける（要求は 404 になり、再試行の後に透明になる）。
// OL は getTileSourceOptions の resolutions を降順に並べ替えるので、ここでも並べ直す。
function isContiguousPowerOfTwo(scales: unknown): scales is number[] {
  if (!Array.isArray(scales) || scales.length === 0) return false;
  const sorted = [...scales].sort((a, b) => a - b);
  return sorted.every((scale, index) => scale === 2 ** index);
}

/**
 * info.json を検査して、Core で配れるかを返す（取得しない純粋な関数）
 */
export function checkIiifDelivery(
  info: unknown,
  expected?: { width: number; height: number }
): IiifDeliveryCheck {
  const json = toInfoObject(info);
  if (!json) return { ok: false, reason: "not-json" };

  // 大きさは正の整数であること。無いまま先へ進むと、OL の格子（new IIIF・size）が
  // 「Missing or invalid size」の素の Error を投げ、呼び手が reason を受け取れない。
  // expected も同じ形で見る（noload の道は options の width・height を当てにするため、
  // undefined のまま比べると undefined !== undefined で素通りする）。
  if (!isPositiveInteger(json.width) || !isPositiveInteger(json.height))
    return { ok: false, reason: "size-mismatch" };
  if (
    expected &&
    (!isPositiveInteger(expected.width) ||
      !isPositiveInteger(expected.height) ||
      json.width !== expected.width ||
      json.height !== expected.height)
  )
    return { ok: false, reason: "size-mismatch" };

  let iiif: IIIFInfo;
  let version: string | undefined;
  let options: any;
  try {
    iiif = new IIIFInfo(json);
    version = iiif.getImageApiVersion();
    if (version !== "version2" && version !== "version3")
      return { ok: false, reason: "unsupported-version" };
    options = iiif.getTileSourceOptions() || {};
  } catch (_e) {
    return { ok: false, reason: "unsupported-version" };
  }

  const level = levelOf(iiif, version);
  const versionNumber = version === "version2" ? "2" : "3";
  const supports: string[] = options.supports || [];
  const arbitrary =
    (supports.includes("regionByPx") || supports.includes("regionByPct")) &&
    (supports.includes("sizeByW") ||
      supports.includes("sizeByH") ||
      supports.includes("sizeByWh") ||
      supports.includes("sizeByPct"));
  if (arbitrary)
    return { ok: true, version: versionNumber, level, tiling: "arbitrary" };

  const { width, height } = tileSizeOf(options.tileSize);
  if (
    width === 256 &&
    height === 256 &&
    isContiguousPowerOfTwo(options.resolutions)
  )
    return { ok: true, version: versionNumber, level, tiling: "level0-256" };
  if (
    LEVEL0_CROP_SUPPORTED &&
    !!width &&
    !!height &&
    width % 256 === 0 &&
    height % 256 === 0
  )
    return { ok: true, version: versionNumber, level, tiling: "level0-crop" };

  return { ok: false, reason: "unsupported-level0" };
}

/** 使えない IIIF の地図の印（起動を止めないため、source の代わりに配列に残す） */
export type UnusableSource = {
  mapID: string;
  __maplatUnusable: { reason: IiifDeliveryReason };
};

/**
 * 解決に失敗した IIIF の地図に付ける印を作る（起動全体を止めない）
 */
export function unusableSource(
  option: { mapID?: string } | string,
  err: IiifDeliveryError
): UnusableSource {
  // sources の要素は文字列（地図 ID だけ）のこともある（"gsi"・"osm" 等）
  const mapID = typeof option === "string" ? option : (option?.mapID ?? "");
  return {
    mapID,
    __maplatUnusable: { reason: err.reason }
  };
}

/**
 * 使えない IIIF の地図の印かどうか
 */
export function isUnusableSource(source: unknown): source is UnusableSource {
  return (
    !!source &&
    typeof source === "object" &&
    "__maplatUnusable" in (source as Record<string, unknown>)
  );
}

/** 起動のときに使えなかった IIIF の地図（要素の sourceLoaded の材料） */
export type UnusableSourceEntry = { mapID: string; reason: IiifDeliveryReason };

// 控えはアプリのインスタンスを鍵にした WeakMap に置く。アプリのクラスのフィールドに
// すると build の型（index.d.ts）に内部の面が出てしまう（利用者に見せる形を増やさない）。
// インスタンスが消えれば控えも一緒に消える。
const unusableSourcesByApp = new WeakMap<object, UnusableSourceEntry[]>();

/** 起動のときに使えなかった地図の控えを書く（起動のたびに作り直す） */
export function setUnusableSources(
  app: object,
  list: UnusableSourceEntry[]
): void {
  unusableSourcesByApp.set(app, [...list]);
}

/** 起動のときに使えなかった地図の控えを読む（無ければ空） */
export function getUnusableSources(app: object): UnusableSourceEntry[] {
  return [...(unusableSourcesByApp.get(app) ?? [])];
}

// info.json の取得の上限
const INFO_TIMEOUT_MS = 10000;
const INFO_MAX_BYTES = 1024 * 1024;

// 文字列の長さをバイト数で見る（TextEncoder が無い環境では文字数で代用する）
function byteLength(text: string) {
  if (typeof TextEncoder === "undefined") return text.length;
  return new TextEncoder().encode(text).length;
}

// 取得できる URL の形か（http:/https: だけ）
function assertFetchableUrl(url: string) {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch (_e) {
    throw new IiifDeliveryError("bad-url", `IIIF image URL is not a URL: ${url}`);
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:")
    throw new IiifDeliveryError(
      "bad-url",
      `IIIF image URL must be http or https: ${url}`
    );
}

// 本文を上限つきで読む（Content-Length があれば読まずに切る・読みながらの累計でも切る）
async function readTextWithLimit(response: any, limit: number) {
  const lengthHeader = response.headers?.get?.("content-length");
  if (lengthHeader !== null && lengthHeader !== undefined) {
    const declared = Number(lengthHeader);
    if (!Number.isNaN(declared) && declared > limit)
      throw new IiifDeliveryError(
        "too-large",
        `IIIF info.json is larger than ${limit} bytes`
      );
  }

  const body = response.body;
  if (body && typeof body.getReader === "function") {
    const reader = body.getReader();
    const decoder = typeof TextDecoder === "undefined" ? undefined : new TextDecoder();
    let total = 0;
    let text = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > limit) {
        try {
          await reader.cancel();
        } catch (_e) {
          // 読めなくても扱いは同じ
        }
        throw new IiifDeliveryError(
          "too-large",
          `IIIF info.json is larger than ${limit} bytes`
        );
      }
      text += decoder
        ? decoder.decode(value, { stream: true })
        : String.fromCharCode.apply(null, Array.from(value));
    }
    if (decoder) text += decoder.decode();
    return text;
  }

  const text = await response.text();
  if (byteLength(text) > limit)
    throw new IiifDeliveryError(
      "too-large",
      `IIIF info.json is larger than ${limit} bytes`
    );
  return text;
}

// info.json の @id/id と delivery.url が同じ画像サービスを指すか（scheme・ホスト・パス）
function serviceKey(url: string) {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}${parsed.pathname.replace(/\/+$/, "")}`;
  } catch (_e) {
    return url.replace(/\/+$/, "");
  }
}

/**
 * delivery を解決して、HistMap に渡す tileUrlFunction を作る（info.json を取得する）
 */
export async function resolveIiifDelivery(
  delivery: { type: "iiifImage"; url: string },
  expected: { width: number; height: number },
  opts?: { signal?: AbortSignal; fetchImpl?: typeof fetch }
): Promise<{
  tileUrlFunction: (coord: number[]) => string;
  /** 配信の基準の URL（info.json の @id と違えば delivery.url のほう） */
  url: string;
  width: number;
  height: number;
  info: unknown;
  warnings: string[];
  /** level0-256 のときだけ、HistMap に渡すズームの下限 */
  minZoom?: number;
}> {
  if (!delivery || delivery.type !== "iiifImage" || typeof delivery.url !== "string")
    throw new IiifDeliveryError(
      "bad-url",
      "IIIF delivery must have { type: 'iiifImage', url }"
    );
  const url = delivery.url.replace(/\/+$/, "");
  assertFetchableUrl(url);

  const fetchImpl = opts?.fetchImpl || fetch;
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, INFO_TIMEOUT_MS);
  const onExternalAbort = () => controller.abort();
  if (opts?.signal) opts.signal.addEventListener("abort", onExternalAbort);

  let text: string;
  try {
    let response: any;
    try {
      response = await fetchImpl(infoJsonUrl(url), {
        credentials: "omit",
        signal: controller.signal
      });
      if (!response || !response.ok)
        throw new IiifDeliveryError(
          "fetch-failed",
          `Failed to fetch IIIF info.json: ${infoJsonUrl(url)}`
        );
      text = await readTextWithLimit(response, INFO_MAX_BYTES);
    } catch (err) {
      if (err instanceof IiifDeliveryError) throw err;
      if (timedOut)
        throw new IiifDeliveryError(
          "timeout",
          `Timed out fetching IIIF info.json: ${infoJsonUrl(url)}`
        );
      throw new IiifDeliveryError(
        "fetch-failed",
        `Failed to fetch IIIF info.json: ${infoJsonUrl(url)}`
      );
    }
  } finally {
    clearTimeout(timer);
    if (opts?.signal) opts.signal.removeEventListener("abort", onExternalAbort);
  }

  let info: any;
  try {
    info = JSON.parse(text);
  } catch (_e) {
    throw new IiifDeliveryError(
      "not-json",
      `IIIF info.json is not JSON: ${infoJsonUrl(url)}`
    );
  }

  const checked = checkIiifDelivery(info, expected);
  if (!checked.ok) throw new IiifDeliveryError(checked.reason);

  const warnings: string[] = [];
  const infoId = info["@id"] || info.id;
  if (typeof infoId === "string" && serviceKey(infoId) !== serviceKey(url))
    warnings.push(
      `Maplat: the IIIF image service "${infoId}" differs from the delivery URL "${url}"; using the delivery URL.`
    );

  const sourceOptions = new IIIFInfo(info).getTileSourceOptions() || {};
  // level0 のタイルの地図は、scaleFactors に無い倍率のズームを要求すると、静的なサーバに
  // 無いファイルを指す。HistMap の minZoom を「最も粗いタイルの倍率」まで上げる
  // （maxZoom は HistMap と同じ式）。倍率は 1 から始まる 2 の冪の連続なので差は整数になる。
  // 最も粗いタイルが maxZoom より細かい資料では差が負になるので 0 に丸める（z が負だと
  // OL の格子に解像度が無く、表示が壊れる）。任意の領域が取れる地図には入れない。
  let minZoom: number | undefined;
  if (checked.tiling === "level0-256") {
    const scales: number[] = Array.isArray((sourceOptions as any).resolutions)
      ? ((sourceOptions as any).resolutions as number[])
      : [];
    const maxScaleFactor = scales.length > 0 ? Math.max(...scales) : undefined;
    if (
      maxScaleFactor !== undefined &&
      Number.isFinite(maxScaleFactor) &&
      maxScaleFactor > 0
    ) {
      const maxZoom = Math.ceil(
        Math.max(
          Math.log2(info.width / TILE_SIZE),
          Math.log2(info.height / TILE_SIZE)
        )
      );
      minZoom = Math.max(0, maxZoom - Math.log2(maxScaleFactor));
    }
  }
  const olSource = new IIIF({
    ...(sourceOptions as any),
    url,
    tileSize: TILE_SIZE,
    resolutions: undefined
  });
  const olTileUrlFunction = olSource.getTileUrlFunction();
  // OL の IIIF の URL の関数は projection を使わない（格子も見ない）ので、渡す必要が無い
  const tileUrlFunction = (coord: number[]) =>
    (olTileUrlFunction &&
      (olTileUrlFunction as any)(coord, 1, undefined)) ||
    transPng;

  return {
    tileUrlFunction,
    url,
    width: info.width,
    height: info.height,
    info,
    warnings,
    ...(minZoom !== undefined ? { minZoom } : {})
  };
}

// --- 結線（source_ex の 2 つの道から呼ぶ。同じ処理を 2 か所に書かない） ---

/** この地図の `delivery` が IIIF Image か（type が違えば 1 回だけ警告して false） */
export function wantsIiifDelivery(options: any): boolean {
  const delivery = options && options.delivery;
  if (!delivery) return false;
  if (delivery.type === "iiifImage") return true;
  console.warn(
    `Maplat: map "${options.mapID}" has delivery type "${delivery.type}"; ignoring delivery.`
  );
  return false;
}

/**
 * `delivery` を解決して、HistMap に渡す options に IIIF の URL の関数を入れる
 * （json の道と noload の道の共通の処理）。
 *
 * - `url`・`urls` があれば消す（`delivery` を使う。1 回だけ警告する）
 * - `minZoom` が返れば options に入れる（level0-256 のときだけ）
 * - 解決の警告（info.json の `@id` の食い違い）は地図ごとに 1 回 `console.warn` する
 *
 * 失敗は `IiifDeliveryError` を投げる。
 */
export async function prepareIiifOptions(
  options: any,
  expected: { width: number; height: number },
  opts?: { signal?: AbortSignal; fetchImpl?: typeof fetch }
): Promise<void> {
  const delivery = await resolveIiifDelivery(options.delivery, expected, opts);
  if (options.url || options.urls) {
    console.warn(
      `Maplat: map "${options.mapID}" has both delivery and url; using delivery.`
    );
    delete options.url;
    delete options.urls;
  }
  for (const warning of delivery.warnings) console.warn(warning);
  options.tileUrlFunction = delivery.tileUrlFunction;
  if (delivery.minZoom !== undefined) options.minZoom = delivery.minZoom;
  // source を作った後に付け直すための控え（この key はタイルのキャッシュを配信ごとに分ける）
  options.__maplatIiifUrl = delivery.url;
}

/**
 * source を作った直後に、IIIF の URL の関数を付け直す。
 *
 * OpenLayers の UrlTile は、url（または urls）を与えると構築の時点で URL の関数を
 * テンプレートから作り直す（generateTileUrlFunction_）。Maplat の HistMap は mapID が
 * あると `tiles/<mapID>/…` の url を補うので、options に入れただけでは IIIF の URL に
 * ならない。source の公開の口（setTileUrlFunction）で、作った後に付け直す。
 * key に配信の URL を渡して、タイルのキャッシュの鍵も配信ごとに分ける。
 */
export function applyIiifTileUrlFunction(source: any, options: any): void {
  if (!options || !options.__maplatIiifUrl) return;
  if (typeof source?.setTileUrlFunction !== "function") return;
  source.setTileUrlFunction(options.tileUrlFunction, options.__maplatIiifUrl);
}
