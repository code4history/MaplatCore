/** 出典の値（文字列か、言語ごとの文字列）。 */
export type AttributionValue = string | Record<string, string | undefined | null> | undefined | null;
/** 出典を持つ地図（source）の最小の形。 */
export interface AttributionSourceLike {
    get?: (key: string) => unknown;
    isWmts?: () => boolean;
    /** OpenLayers の source の出典（frameState を受けて文字列・配列・その Promise を返す関数）。 */
    getAttributions?: () => unknown;
    /** Google の地図（GoogleMap）だけが持つ、Map Tiles API の mapType（roadmap・satellite・terrain）。 */
    googleMapType?: unknown;
}
/** Google Maps のロゴの種類。light: 灰色の字・白い枠（地図用）、dark: 白い字・濃い枠（衛星写真用）。 */
export type GoogleLogoVariant = "light" | "dark";
/** Google Maps のロゴの表示の形。logo: ロゴの画像、text: 文字 "Google Maps"（狭いとき）。 */
export type GoogleAttributionMode = "logo" | "text";
/** ロゴの幅（105px）と左右の余白（10px ずつ）。使える幅がこれより狭いときは文字にする。 */
export declare const GOOGLE_LOGO_MIN_WIDTH = 125;
/** ロゴの代わりに出す文字（利用条件が名指しする文字。言語によらない）。 */
export declare const GOOGLE_MAPS_TEXT = "Google Maps";
/** Google の地図（GoogleMap。googleMapType を持つ）か。 */
export declare function isGoogleSource(source: AttributionSourceLike): boolean;
/**
 * 表示中の source に Google の地図があれば、出すロゴの種類を返す（無ければ undefined）。
 * 出典の並び（前面 → 重ね地図 → 背面）で最初の Google の地図の種類で選ぶ。衛星（satellite）は dark。
 */
export declare function googleLogoVariant(sources: AttributionSourceLike[]): GoogleLogoVariant | undefined;
/** 使える幅（px）からロゴか文字かを決める。測れない（0 以下・数でない）ときはロゴ。 */
export declare function googleAttributionMode(availableWidth: number): GoogleAttributionMode;
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
/** source から読んだ出典 1 つの文字数の上限（表示される文字の数。超えたら切って「…」を付ける）。 */
export declare const SOURCE_ATTRIBUTION_MAX_CHARS = 500;
/** source から読んだ出典 1 つの箱の高さの上限（行の数）。 */
export declare const SOURCE_ATTRIBUTION_MAX_LINES = 4;
/** source から読んだ出典 1 つの箱の高さの上限（地図の高さに対する割合）。行の数の上限と小さい方を使う。 */
export declare const SOURCE_ATTRIBUTION_MAX_MAP_RATIO = 0.25;
/**
 * OpenLayers の source から読んだ出典（第三者のサーバーが決める値。Google の copyright・TileJSON の
 * attribution など）を、表示用の HTML にする。空になったものは除く。
 *   - 狭い許可表（sanitizeHtml の profile "iiif"）で洗う。残るタグは a・b・br・i・p・small・span・sub・sup だけ、
 *     属性は http(s) の href だけ。img・class・style・javascript: などは落ちる。
 *     リンクには target="_blank" と rel="noopener noreferrer" が付く。
 *   - 表示される文字は SOURCE_ATTRIBUTION_MAX_CHARS 字まで（超えたら切って「…」）。
 *     箱の高さも CSS で上限を付ける（.maplat-attribution-item-source）。
 *   - 理由: 広い許可表（地図の設定の attr 用）のままだと、外の値の
 *     `<a href="https://…"><img src="https://…" width="4000" height="4000"></a>` で、出典の箱が地図を覆い、
 *     地図全体が外へのリンクになり、外の画像を読みに行って見ている人の情報が第三者に渡る。
 *     狭い許可表を通る `<a href="https://…"><p>長い文字</p></a>` や長い文字だけでも、箱が地図を覆いうる。
 * 地図の設定の attr（アプリの作者が書く値）には使わない（従来どおり広い許可表で、img なども通り、上限も無い）。
 * 文字だけの値（Google の copyright など）は、上限より短ければ変わらない（& と < > は HTML の形になる）。
 */
export declare function sanitizeSourceAttributions(texts: readonly string[]): string[];
/**
 * source の並びから、表示する出典の文字列（言語を選んだもの・空と重複を除いたもの）を作る。
 * 地図の設定の `attr` が無い source は、dynamic（OpenLayers の source から読んだ出典）の値を使う。
 * Google の地図は `attr` があっても dynamic（copyright）を先に出す。
 * 重複は表示される文字で比べる（設定の `A & B` と source の `A &amp; B` は同じもの）。
 * 返すのは元の値（洗う前）。source の値で、洗うと何も残らないものは除く。
 */
export declare function attributionTexts(sources: AttributionSourceLike[], lang: string, dynamic?: ReadonlyMap<AttributionSourceLike, readonly string[]>): string[];
/**
 * 出典の文字列を、Google の地図の分（google）とそれ以外（others）に分ける。
 * 同じ表示の文字は 1 回だけ（Google の分を先に取る）。並びは source の順。
 */
export declare function attributionGroups(sources: AttributionSourceLike[], lang: string, dynamic?: ReadonlyMap<AttributionSourceLike, readonly string[]>): {
    google: string[];
    others: string[];
};
/**
 * 出典の表示。地図の箱の最後の子に `div.maplat-attribution` を置き、`update` で中身を作り直す。
 * 祖先の `lang` 属性が変わったら、最後に渡された source で作り直す。
 */
export declare class AttributionDisplay {
    #private;
    readonly element: HTMLDivElement;
    constructor(container: HTMLElement, getLang: () => string);
    /** 今出している Google Maps の表示（ロゴか文字）。Google の地図が無ければ undefined（試験と診断用）。 */
    get googleAttribution(): GoogleAttributionMode | undefined;
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
