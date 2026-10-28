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
/** 使えない IIIF の地図の印（起動を止めないため、source の代わりに配列に残す） */
export type UnusableSource = {
    mapID: string;
    __maplatUnusable: {
        reason: IiifDeliveryReason;
    };
};
/**
 * 解決に失敗した IIIF の地図に付ける印を作る（起動全体を止めない）
 */
export declare function unusableSource(option: {
    mapID?: string;
} | string, err: IiifDeliveryError): UnusableSource;
/**
 * 使えない IIIF の地図の印かどうか
 */
export declare function isUnusableSource(source: unknown): source is UnusableSource;
/** 起動のときに使えなかった IIIF の地図（要素の sourceLoaded の材料） */
export type UnusableSourceEntry = {
    mapID: string;
    reason: IiifDeliveryReason;
};
/** 起動のときに使えなかった地図の控えを書く（起動のたびに作り直す） */
export declare function setUnusableSources(app: object, list: UnusableSourceEntry[]): void;
/** 起動のときに使えなかった地図の控えを読む（無ければ空） */
export declare function getUnusableSources(app: object): UnusableSourceEntry[];
/**
 * delivery を解決して、HistMap に渡す tileUrlFunction を作る（info.json を取得する）
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
}): Promise<{
    tileUrlFunction: (coord: number[]) => string;
    /** 配信の基準の URL（info.json の @id と違えば delivery.url のほう） */
    url: string;
    width: number;
    height: number;
    info: unknown;
    warnings: string[];
    /** level0-256 のときだけ、HistMap に渡すズームの下限 */
    minZoom?: number;
}>;
/** この地図の `delivery` が IIIF Image か（type が違えば 1 回だけ警告して false） */
export declare function wantsIiifDelivery(options: any): boolean;
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
export declare function prepareIiifOptions(options: any, expected: {
    width: number;
    height: number;
}, opts?: {
    signal?: AbortSignal;
    fetchImpl?: typeof fetch;
}): Promise<void>;
/**
 * source を作った直後に、IIIF の URL の関数を付け直す。
 *
 * OpenLayers の UrlTile は、url（または urls）を与えると構築の時点で URL の関数を
 * テンプレートから作り直す（generateTileUrlFunction_）。Maplat の HistMap は mapID が
 * あると `tiles/<mapID>/…` の url を補うので、options に入れただけでは IIIF の URL に
 * ならない。source の公開の口（setTileUrlFunction）で、作った後に付け直す。
 * key に配信の URL を渡して、タイルのキャッシュの鍵も配信ごとに分ける。
 */
export declare function applyIiifTileUrlFunction(source: any, options: any): void;
