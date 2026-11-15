import { IiifDeliveryReason, IiifDeliveryError, ResolvedIiifDelivery } from './image';
export * from './image';
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
/** 紙の外を HistMap の透明なタイルに変える */
export declare function histMapTileUrlFunction(resolved: ResolvedIiifDelivery): (coord: number[]) => string;
/** 共通の配信を解決し、HistMap の構築と再設定に必要な値を入れる */
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
