/** 出典の値（文字列か、言語ごとの文字列）。 */
export type AttributionValue = string | Record<string, string | undefined | null> | undefined | null;
/** 出典を持つ地図（source）の最小の形。 */
export interface AttributionSourceLike {
    get?: (key: string) => unknown;
    isWmts?: () => boolean;
    /** OpenLayers の source の出典（frameState を受けて文字列・配列・その Promise を返す関数）。 */
    getAttributions?: () => unknown;
}
/**
 * 言語ごとの値から 1 つ選ぶ。UI の pickLocalized と同じ規則: 一致する言語 → en → 最初の空でない値。
 * （地域を外した言語には寄せない。UI の地図情報と同じ文字を出すため）
 * 文字列はそのまま。空白だけの値は無いものとみなす（OpenLayers の出典へ回す）。何も無ければ undefined。
 */
export declare function pickAttributionText(value: AttributionValue, lang: string): string | undefined;
/** UI の normalizeLang と同じ寄せ方（zh-HK・zh-Hant は zh-TW）。 */
export declare function normalizeAttributionLang(lang: string): string;
/** 要素から最も近い `lang` 属性の値（影の DOM の境界は host へ越える。空の lang="" は飛ばす）。 */
export declare function closestLang(element: Element | null | undefined): string | undefined;
/**
 * 出典の言語を決める。UI（<maplat-ui>）の言語と食い違わないよう、UI と同じ順にする。
 *   - 地図が <maplat-ui> の中にあり、その要素が currentLang を持つ（定義済み）なら、それをそのまま使う。
 *     UI の地図情報・ボタンの文言と同じ言語になる（UI は lang 属性 → UI の appOption.lang →
 *     設定ファイルの lang → ブラウザ、で決める）。
 *   - それ以外: 地図の要素（<maplat-app> か旧 API の div）の lang 属性 → 最も近い <maplat-ui> の lang 属性
 *     → appOption.lang → 設定ファイルの lang → 祖先の lang 属性（<html lang> など）→ ブラウザ → en。
 * どちらも UI の normalizeLang と同じく zh-HK・zh-Hant を zh-TW に寄せる。文字列でない値・空の値は飛ばす。
 */
export declare function resolveAttributionLang(element: Element | null | undefined, appOptionLang?: unknown, settingLang?: unknown): string;
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
/** 地図の設定の `attr` を持つか（空・空白だけの文字列、空の言語ごとの値は持たない扱い）。 */
export declare function hasConfiguredAttr(source: AttributionSourceLike): boolean;
/** OpenLayers の出典の値（文字列・配列・それ以外）を文字列の配列にする。 */
export declare function normalizeOlAttributions(value: unknown): string[];
/**
 * source の並びから、表示する出典の文字列（言語を選んだもの・空と重複を除いたもの）を作る。
 * 地図の設定の `attr` が無い source は、dynamic（OpenLayers の source から読んだ出典）の値を使う。
 */
export declare function attributionTexts(sources: AttributionSourceLike[], lang: string, dynamic?: ReadonlyMap<AttributionSourceLike, readonly string[]>): string[];
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
    /**
     * 地図の設定の attr が無い source の出典を、OpenLayers の source（getAttributions）から読む。
     * 地図の描画（postrender）のたびに、その地図が描いている source と frameState を渡す。
     * Google の source は表示範囲が変わったときだけ取りに行き、それ以外は前の値を返す（OpenLayers の実装）。
     */
    refreshDynamic(sources: (AttributionSourceLike | null | undefined)[], frameState: unknown): void;
    /** 今の source と言語で描き直す。 */
    render(): void;
    /** 表示を外し、言語の監視をやめる。 */
    dispose(): void;
}
