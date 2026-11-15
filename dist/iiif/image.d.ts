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
export declare const IIIF_TILE_SIZE = 256;
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
/** info.json を OpenLayers と同じ規則で解釈する（v1 は配信の対象外） */
export declare function parseIiifImageInfo(info: unknown): {
    ok: true;
    service: IiifImageService;
} | {
    ok: false;
    reason: IiifDeliveryReason;
};
/** level0 の 256 タイルで、列挙されていない粗い倍率を要求しないための下限 */
export declare function iiifMinZoom(service: IiifImageService): number | undefined;
/** Maplat の 256 px 格子で、OpenLayers と同じタイル URL を作る */
export declare function iiifTileUrl(baseUrl: string, service: IiifImageService, z: number, x: number, y: number): string | undefined;
/** Core で配れない理由 */
export type IiifDeliveryReason = "bad-url" | "fetch-failed" | "timeout" | "too-large" | "not-json" | "unsupported-version" | "unsupported-level0" | "size-mismatch";
/** info.json を検査した結果 */
export type IiifDeliveryCheck = {
    ok: true;
    version: "2" | "3";
    level: 0 | 1 | 2;
    tiling: "arbitrary" | "level0-256" | "level0-crop";
} | {
    ok: false;
    reason: IiifDeliveryReason;
};
export declare class IiifDeliveryError extends Error {
    readonly reason: IiifDeliveryReason;
    readonly mapID?: string;
    constructor(reason: IiifDeliveryReason, message?: string, mapID?: string);
}
/**
 * info.json を検査して、Core で配れるかを返す（取得しない純粋な関数）
 */
export declare function checkIiifDelivery(info: unknown, expected?: {
    width: number;
    height: number;
}): IiifDeliveryCheck;
/**
 * delivery を解決して、描画に依らない tileUrl を作る（info.json を取得する）
 */
export declare function resolveIiifDelivery(delivery: {
    type: "iiifImage";
    url: string;
}, expected: {
    width: number;
    height: number;
}, opts?: {
    signal?: AbortSignal;
    fetchImpl?: typeof fetch;
}): Promise<ResolvedIiifDelivery>;
/** この地図の `delivery` が IIIF Image か（type が違えば 1 回だけ警告して false） */
export declare function wantsIiifDelivery(options: any): boolean;
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
export declare function prepareIiifDelivery(options: any, expected: {
    width: number;
    height: number;
}, opts?: {
    signal?: AbortSignal;
    fetchImpl?: typeof fetch;
}): Promise<ResolvedIiifDelivery>;
/** キャッシュから外す IIIF の配信か（警告しない） */
export declare function isIiifDelivery(options: any): boolean;
