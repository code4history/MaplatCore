/*!
 * IIIF info parsing and tile URLs adapted from OpenLayers 10.11.0
 * ol/format/IIIFInfo.js and ol/source/IIIF.js.
 *
 * BSD 2-Clause License
 *
 * Copyright 2005-present, OpenLayers Contributors
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

export const IIIF_TILE_SIZE = 256;

/** 描画ライブラリに依らない Image API 2/3 の解釈結果 */
export interface IiifImageService {
  version: "2" | "3";
  level: 0 | 1 | 2;
  width: number;
  height: number;
  id?: string;
  supports: string[];
  format: string;
  quality: string;
  tileSize?: [number, number];
  scaleFactors?: number[];
  sizes?: [number, number][];
}

/** 取得と検査が済んだ配信。紙の外では tileUrl が undefined を返す */
export interface ResolvedIiifDelivery {
  url: string;
  width: number;
  height: number;
  info: unknown;
  service: IiifImageService;
  warnings: string[];
  minZoom?: number;
  tileUrl: (z: number, x: number, y: number) => string | undefined;
}

// OpenLayers の level ごとの既定値。配列の順序もそのまま残す。
const PROFILE_SUPPORTS = {
  "2": [
    [],
    ["regionByPx", "sizeByW", "sizeByH", "sizeByPct"],
    [
      "regionByPx",
      "regionByPct",
      "sizeByW",
      "sizeByH",
      "sizeByPct",
      "sizeByConfinedWh",
      "sizeByDistortedWh",
      "sizeByWh"
    ]
  ],
  "3": [
    [],
    ["regionByPx", "regionSquare", "sizeByW", "sizeByH", "sizeByWh"],
    [
      "regionByPx",
      "regionSquare",
      "regionByPct",
      "sizeByW",
      "sizeByH",
      "sizeByPct",
      "sizeByConfinedWh",
      "sizeByWh"
    ]
  ]
};
const COMPLIANCE_VERSION2 =
  /^https?:\/\/iiif\.io\/api\/image\/2\/level[0-2](?:\.json)?$/;
const COMPLIANCE_VERSION3 =
  /(^https?:\/\/iiif\.io\/api\/image\/3\/level[0-2](?:\.json)?$)|(^level[0-2]$)/;

/** info.json を OpenLayers と同じ規則で解釈する（v1 は配信の対象外） */
export function parseIiifImageInfo(
  info: unknown
):
  | { ok: true; service: IiifImageService }
  | { ok: false; reason: IiifDeliveryReason } {
  const json = toInfoObject(info);
  if (!json) return { ok: false, reason: "not-json" };
  try {
    let contexts = json["@context"] || "ol-no-context";
    if (typeof contexts === "string") contexts = [contexts];
    let version: "2" | "3" | undefined;
    for (let i = 0; i < contexts.length; i++) {
      const context = contexts[i];
      if (
        context ===
          "http://library.stanford.edu/iiif/image-api/1.1/context.json" ||
        context === "http://iiif.io/api/image/1/context.json"
      )
        return { ok: false, reason: "unsupported-version" };
      if (context === "http://iiif.io/api/image/2/context.json") version = "2";
      if (context === "http://iiif.io/api/image/3/context.json") version = "3";
      if (version) break;
    }
    if (!version) return { ok: false, reason: "unsupported-version" };
    let profile = json.profile;
    if (version === "2" && Array.isArray(profile)) profile = profile[0];
    const validProfile =
      version === "2"
        ? typeof profile === "string" && COMPLIANCE_VERSION2.test(profile)
        : COMPLIANCE_VERSION3.test(profile);
    const matched = validProfile
      ? profile.match(/level[0-2](?:\.json)?$/g)
      : undefined;
    const level = (
      matched ? Number(matched[0].replace(".json", "").slice(-1)) : 0
    ) as 0 | 1 | 2;
    const additional =
      version === "2" && Array.isArray(json.profile) && json.profile.length > 1
        ? json.profile[1]
        : {};
    const supports = [
      ...(matched ? PROFILE_SUPPORTS[version][level] : []),
      ...(version === "2"
        ? additional.supports || []
        : json.extraFeatures === undefined
          ? []
          : json.extraFeatures)
    ];
    const formats = [
      ...(matched ? (level === 2 ? ["jpg", "png"] : ["jpg"]) : []),
      ...(version === "2"
        ? additional.formats || []
        : json.extraFormats === undefined
          ? []
          : json.extraFormats)
    ];
    const qualities = [
      ...(matched
        ? version === "2" && level === 2
          ? ["default", "bitonal"]
          : ["default"]
        : []),
      ...(version === "2"
        ? additional.qualities || []
        : json.extraQualities === undefined
          ? []
          : json.extraQualities)
    ];
    const preferred =
      version === "3" && Array.isArray(json.preferredFormats)
        ? json.preferredFormats.find(
            (format: string) =>
              ["jpg", "png", "gif"].includes(format) && formats.includes(format)
          )
        : undefined;
    // v3 の高さ省略は OL の解釈結果と同じく undefined のまま保持する。
    const tileSize: [number, number] | undefined =
      json.tiles === undefined
        ? undefined
        : [
            json.tiles.map((tile: any) => tile.width)[0],
            json.tiles.map((tile: any) =>
              version === "2" && tile.height === undefined
                ? tile.width
                : tile.height
            )[0]
          ];
    const scales =
      json.tiles === undefined
        ? undefined
        : json.tiles.map((tile: any) => tile.scaleFactors)[0];
    return {
      ok: true,
      service: {
        version,
        level,
        width: json.width,
        height: json.height,
        id:
          version === "2"
            ? json["@id"].replace(/\/?(?:info\.json)?$/g, "")
            : json.id,
        supports,
        format: preferred === undefined ? "jpg" : preferred,
        quality: qualities.includes("native") ? "native" : "default",
        tileSize,
        // OL は元の配列を sort するが、純粋な解釈関数では入力を変更しない。
        scaleFactors: Array.isArray(scales)
          ? [...scales].sort((a, b) => b - a)
          : undefined,
        sizes:
          json.sizes === undefined
            ? undefined
            : json.sizes.map((size: any) => [size.width, size.height])
      }
    };
  } catch (_e) {
    return { ok: false, reason: "unsupported-version" };
  }
}

function supportsArbitraryTiling(supports: string[]): boolean {
  return (
    (supports.includes("regionByPx") || supports.includes("regionByPct")) &&
    (supports.includes("sizeByWh") ||
      supports.includes("sizeByH") ||
      supports.includes("sizeByW") ||
      supports.includes("sizeByPct"))
  );
}

/** level0 の 256 タイルで、列挙されていない粗い倍率を要求しないための下限 */
export function iiifMinZoom(service: IiifImageService): number | undefined {
  if (supportsArbitraryTiling(service.supports)) return undefined;
  const size = tileSizeOf(service.tileSize);
  if (
    size.width !== IIIF_TILE_SIZE ||
    size.height !== IIIF_TILE_SIZE ||
    !isContiguousPowerOfTwo(service.scaleFactors)
  )
    return undefined;
  const maxZoom = Math.ceil(
    Math.max(
      Math.log2(service.width / IIIF_TILE_SIZE),
      Math.log2(service.height / IIIF_TILE_SIZE)
    )
  );
  return Math.max(0, maxZoom - Math.log2(Math.max(...service.scaleFactors)));
}

function formatPercentage(percentage: number): string {
  return percentage.toLocaleString("en", { maximumFractionDigits: 10 });
}

/** Maplat の 256 px 格子で、OpenLayers と同じタイル URL を作る */
export function iiifTileUrl(
  baseUrl: string,
  service: IiifImageService,
  z: number,
  x: number,
  y: number
): string | undefined {
  const { width, height, supports, version } = service;
  // OL の Math.log / Math.LN2 をそのまま使う（境界の丸めも一致させる）。
  const maxZoom = Math.max(
    Math.ceil(Math.log(width / IIIF_TILE_SIZE) / Math.LN2),
    Math.ceil(Math.log(height / IIIF_TILE_SIZE) / Math.LN2)
  );
  if (z > maxZoom || z < 0 || !Number.isInteger(z)) return undefined;
  const scale = 2 ** (maxZoom - z);
  if (
    x === undefined ||
    y === undefined ||
    x < 0 ||
    Math.ceil(width / scale / IIIF_TILE_SIZE) <= x ||
    y < 0 ||
    Math.ceil(height / scale / IIIF_TILE_SIZE) <= y
  )
    return undefined;
  const arbitrary = supportsArbitraryTiling(supports);
  const regionX = x * IIIF_TILE_SIZE * scale;
  const regionY = y * IIIF_TILE_SIZE * scale;
  const regionW = Math.min(IIIF_TILE_SIZE * scale, width - regionX);
  const regionH = Math.min(IIIF_TILE_SIZE * scale, height - regionY);
  const sizeW =
    regionX + IIIF_TILE_SIZE * scale > width
      ? Math.floor((width - regionX + scale - 1) / scale)
      : IIIF_TILE_SIZE;
  const sizeH =
    regionY + IIIF_TILE_SIZE * scale > height
      ? Math.floor((height - regionY + scale - 1) / scale)
      : IIIF_TILE_SIZE;
  let regionParam: string | undefined;
  let sizeParam: string | undefined;
  if (regionX === 0 && regionW === width && regionY === 0 && regionH === height)
    regionParam = "full";
  else if (!arbitrary || supports.includes("regionByPx"))
    regionParam = `${regionX},${regionY},${regionW},${regionH}`;
  else if (supports.includes("regionByPct"))
    regionParam = `pct:${formatPercentage((regionX / width) * 100)},${formatPercentage((regionY / height) * 100)},${formatPercentage((regionW / width) * 100)},${formatPercentage((regionH / height) * 100)}`;
  if (version === "3" && (!arbitrary || supports.includes("sizeByWh")))
    sizeParam = `${sizeW},${sizeH}`;
  else if (!arbitrary || supports.includes("sizeByW")) sizeParam = `${sizeW},`;
  else if (supports.includes("sizeByH")) sizeParam = `,${sizeH}`;
  else if (supports.includes("sizeByWh")) sizeParam = `${sizeW},${sizeH}`;
  else if (supports.includes("sizeByPct"))
    sizeParam = `pct:${formatPercentage(100 / scale)}`;
  const url =
    baseUrl +
    (baseUrl.lastIndexOf("/") === baseUrl.length - 1 || baseUrl === ""
      ? ""
      : "/");
  return `${url}${regionParam}/${sizeParam}/0/${service.quality || "default"}.${service.format || "jpg"}`;
}

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

// タイルの大きさ（幅・高さ）を数にそろえる
function tileSizeOf(tileSize: any): { width?: number; height?: number } {
  if (tileSize === undefined || tileSize === null) return {};
  if (typeof tileSize === "number")
    return { width: tileSize, height: tileSize };
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

  const parsed = parseIiifImageInfo(json);
  if (!parsed.ok) return parsed;
  const { service } = parsed;
  const { level, version: versionNumber, supports } = service;
  const arbitrary = supportsArbitraryTiling(supports);
  if (arbitrary)
    return { ok: true, version: versionNumber, level, tiling: "arbitrary" };

  const { width, height } = tileSizeOf(service.tileSize);
  if (
    width === 256 &&
    height === 256 &&
    isContiguousPowerOfTwo(service.scaleFactors)
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
    throw new IiifDeliveryError(
      "bad-url",
      `IIIF image URL is not a URL: ${url}`
    );
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
    const decoder =
      typeof TextDecoder === "undefined" ? undefined : new TextDecoder();
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
 * delivery を解決して、描画に依らない tileUrl を作る（info.json を取得する）
 */
export async function resolveIiifDelivery(
  delivery: { type: "iiifImage"; url: string },
  expected: { width: number; height: number },
  opts?: { signal?: AbortSignal; fetchImpl?: typeof fetch }
): Promise<ResolvedIiifDelivery> {
  if (
    !delivery ||
    delivery.type !== "iiifImage" ||
    typeof delivery.url !== "string"
  )
    throw new IiifDeliveryError(
      "bad-url",
      "IIIF delivery must have { type: 'iiifImage', url }"
    );
  const url = delivery.url.replace(/\/+$/, "");
  assertFetchableUrl(url);

  if (opts?.signal?.aborted) throw new IiifDeliveryError("fetch-failed");
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

  const parsed = parseIiifImageInfo(info);
  if (!parsed.ok) throw new IiifDeliveryError(parsed.reason);
  const service = parsed.service;
  const minZoom = iiifMinZoom(service);
  const tileUrl = (z: number, x: number, y: number) =>
    iiifTileUrl(url, service, z, x, y);

  return {
    tileUrl,
    service,
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
 * `delivery` を解決して、描画に依らない配信と options の最小ズームを準備する
 * （json の道と noload の道の共通の処理）。
 *
 * - `url`・`urls` があれば消す（`delivery` を使う。1 回だけ警告する）
 * - `minZoom` が返れば options に入れる（level0-256 のときだけ）
 * - 解決の警告（info.json の `@id` の食い違い）は地図ごとに 1 回 `console.warn` する
 *
 * 失敗は `IiifDeliveryError` を投げる。
 */
export async function prepareIiifDelivery(
  options: any,
  expected: { width: number; height: number },
  opts?: { signal?: AbortSignal; fetchImpl?: typeof fetch }
): Promise<ResolvedIiifDelivery> {
  const delivery = await resolveIiifDelivery(options.delivery, expected, opts);
  if (options.url || options.urls) {
    console.warn(
      `Maplat: map "${options.mapID}" has both delivery and url; using delivery.`
    );
    delete options.url;
    delete options.urls;
  }
  for (const warning of delivery.warnings) console.warn(warning);
  if (delivery.minZoom !== undefined) options.minZoom = delivery.minZoom;
  return delivery;
}

/** キャッシュから外す IIIF の配信か（警告しない） */
export function isIiifDelivery(options: any): boolean {
  return options?.delivery?.type === "iiifImage";
}
