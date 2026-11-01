import { Localized } from '../element_contract';
/** 写す元（Manifest そのものか、選んだ canvas か） */
export type IiifFrom = "manifest" | "canvas";
/** 写す元にする IIIF の項目 */
export type IiifProperty = "label" | "summary" | "requiredStatement" | "rights" | "provider";
/** 地図の metadata の鍵 1 つと、その写す元の結び付け */
export interface IiifBindingSelector {
    from: IiifFrom;
    property: IiifProperty;
}
/**
 * 結び付けられる鍵 → IIIF の項目の既定の対応。
 * Editor はこれを読んで「写す鍵」の欄を作り、対応を自分で書かない。
 * ライセンスの注記（licenseNote・dataLicenseNote）は license・dataLicense に付いて動くので入れない。
 */
export declare const IIIF_BINDABLE_KEYS: Readonly<Record<string, IiifProperty>>;
/** 写す鍵 → 写す元（鍵が許可されているものに限る） */
export type IiifBindings = Partial<Record<string, IiifBindingSelector>>;
/** 地図データの iiif 節 */
export interface MaplatIiifSection {
    manifest?: string;
    canvas?: string;
    image?: string;
    bindings?: IiifBindings;
    copiedAt?: string;
    /** 鍵 → 言語 → 写した時点の値 */
    copiedValues?: Record<string, Record<string, string>>;
    copiedMetadata?: IiifMetadataEntry[];
}
/** 写した metadata の 1 行 */
export interface IiifMetadataEntry {
    from: IiifFrom;
    label: Localized;
    value: Localized;
}
/** 書誌の表の出し方（アプリの設定で選ぶ） */
export type IiifMetadataDisplay = "all" | "hidden";
/** アプリの設定が無いときに使う、書誌の表の出し方 */
export declare const IIIF_METADATA_DISPLAY_DEFAULT = "hidden";
/** Manifest の canvas の一覧（Editor の canvas の選択に使う） */
export declare function listIiifCanvases(manifest: unknown): {
    ok: true;
    version: "2" | "3";
    canvases: Array<{
        id: string;
        label: Localized;
        width: number;
        height: number;
        imageService?: string;
    }>;
} | {
    ok: false;
    reason: "not-manifest" | "unsupported-version";
};
/**
 * 既定の selector。
 * 題名は、canvas の label が頁の番号（数字だけ）でなければ canvas の label を、
 * そうでなければ Manifest の label を指す。帰属・ライセンス・要約は Manifest から写す。
 * 結び付ける元にその項目が無い（読めない）ときは、その鍵を返さない。
 */
export declare function proposeIiifBindings(manifest: unknown, canvasId: string): IiifBindings;
/**
 * 写す値を取り出す（取得しない）。
 * HTML として入る鍵の値と metadata の値は、呼び出し側が渡した関数（sanitize）を通してから返す。
 */
export declare function resolveIiifMetadata(manifest: unknown, iiif: Pick<MaplatIiifSection, "canvas" | "bindings">, lang: string, sanitize: (html: string) => string): {
    ok: true;
    version: "2" | "3";
    values: Record<string, Localized | string>;
    copiedValues: Record<string, Record<string, string>>;
    copiedMetadata: IiifMetadataEntry[];
    unresolved: string[];
    warnings: string[];
} | {
    ok: false;
    reason: "not-manifest" | "unsupported-version";
};
/**
 * copiedValues と比べて、鍵・言語ごとに「人が直した」「IIIF の側が変わった」を返す。
 * 人が直したかは今の値と写した時点の値で、IIIF の側が変わったかは写した時点の値と取り直した値で見る。
 * 今の IIIF の値と今の値を直接は比べない。取り直した値が無ければ IIIF の側が変わったかは判定しない。
 */
export declare function compareIiifCopy(current: Record<string, Localized | string | undefined>, copiedValues: Record<string, Record<string, string>>, fresh: Record<string, Record<string, string>> | undefined, lang: string): Array<{
    key: string;
    lang: string;
    humanEdited: boolean;
    iiifChanged: boolean | undefined;
}>;
/** ライセンス（rights）の URI を、Maplat のライセンスの語彙にする */
export declare function iiifRightsToLicense(uri: string): {
    license: string;
    licenseNote?: string;
};
