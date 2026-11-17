/** 出典の値（文字列か、言語ごとの文字列）。 */
export type AttributionValue = string | Record<string, string | undefined | null> | undefined | null;
/** 出典を持つ地図（source）の最小の形。 */
export interface AttributionSourceLike {
    get?: (key: string) => unknown;
    isWmts?: () => boolean;
}
/**
 * 言語ごとの値から 1 つ選ぶ。完全に一致する言語 → 地域を外した言語（ja-JP → ja）→ en → 最初の空でない値。
 * 文字列はそのまま。何も無ければ undefined。
 */
export declare function pickAttributionText(value: AttributionValue, lang: string): string | undefined;
/** 要素から最も近い `lang` 属性の値（影の DOM の境界は host へ越える）。無ければ undefined。 */
export declare function closestLang(element: Element | null | undefined): string | undefined;
/**
 * 出典の言語を決める。祖先の `lang` 属性 → appOption.lang → 設定ファイルの lang → ブラウザ → en。
 * 文字列でない値・空の値は飛ばす。
 */
export declare function resolveAttributionLang(element: Element | null | undefined, ...fallbacks: unknown[]): string;
/**
 * 地図に描かれている現代の地図の source を、出典を出す順に並べる。
 *   - 前面の source（前面が basemap のときはそれ、重ね地図のときはその下の basemap）。古地図は外す。
 *   - 重ね地図（前面に層として載せた TMS など）。
 *   - 背面の source（前面が古地図のときの basemap）。
 * 同じ source は 1 回だけ。
 */
export declare function displayedAttributionSources(parts: {
    front?: AttributionSourceLike | null;
    overlay?: AttributionSourceLike | null;
    back?: AttributionSourceLike | null;
}): AttributionSourceLike[];
/** source の並びから、表示する出典の文字列（言語を選んだもの・空と重複を除いたもの）を作る。 */
export declare function attributionTexts(sources: AttributionSourceLike[], lang: string): string[];
/**
 * 出典の表示。地図の箱の最後の子に `div.maplat-attribution` を置き、`update` で中身を作り直す。
 * 祖先の `lang` 属性が変わったら、最後に渡された source で作り直す。
 */
export declare class AttributionDisplay {
    #private;
    readonly element: HTMLDivElement;
    constructor(container: HTMLElement, getLang: () => string);
    /** 今の言語で出典の文字列を返す（試験と診断用）。 */
    get texts(): string[];
    /** 表示する source を差し替えて描き直す。 */
    update(sources: AttributionSourceLike[]): void;
    /** 今の source と言語で描き直す。 */
    render(): void;
    /** 表示を外し、言語の監視をやめる。 */
    dispose(): void;
}
