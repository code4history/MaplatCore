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
    /** 地図の ID（providerAttributions で地図ごとに分けるため）。 */
    mapID?: unknown;
}
/** 表示中の地図 1 つ分の、提供元の申告の出典（`<maplat-app>` の providerAttributions の要素）。 */
export interface ProviderAttribution {
    /** 地図の ID */
    mapID: string;
    /** 提供元の申告（狭い許可表で洗った HTML。空のものは除く） */
    attributions: string[];
}
/**
 * providerAttributions の値が変わったとき（地図の切り替えで載る地図や値が変わった・申告が届いた・変わった）に出す
 * DOM の事象。値が変わらなければ出さない（申告の無い地図どうしの切り替えでは出ない）。
 * 出すのは地図の入れ物（`<maplat-app>` の要素そのもの。旧 API は地図の div）から。detail は無い。
 * ほかの要素の事象と同じく bubbles: true・composed: false・cancelable: false。
 */
export declare const ATTRIBUTION_CHANGED_EVENT = "attributionChanged";
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
/** 提供元の申告の種類。google: Map Tiles API の copyright、tilejson: 提供元の TileJSON の attribution。 */
export type ProviderAttributionKind = "google" | "tilejson";
/**
 * source の出典が提供元の申告（Google の応答・TileJSON に書かれた値）かを、source の型で決める。
 * Core が今作る source で提供元の申告を持つのは Google の地図だけ。TileJSON は、アプリが TileJSON の source を
 * 渡したときの扱い。
 * 申告でない source（OpenLayers の既定値・作るときの値の source）は undefined。
 *   - Google の地図（Core の GoogleMap。googleMapType を持つ）: OpenLayers の Google は、作るときの
 *     attributions を受けず、出典を Map Tiles API の viewport の応答の copyright だけで作る
 *     （ol/source/Google.js の fetchAttributions_）。
 *   - 提供元の TileJSON を持つ source（getTileJSON を持つもの。OpenLayers の TileJSON）: 出典を提供元の
 *     TileJSON の `attribution` から作る（ol/source/TileJSON.js の handleTileJSONResponse）。ただし作るときに
 *     attributions を渡すとそちらが使われるので、読むときに TileJSON の `attribution` と同じ値だけを残す
 *     （tileJsonDeclaredAttribution）。出すのはいつも提供元の TileJSON に書かれた値になる。
 *     型は instanceof で見ない: ol/source/TileJSON を読み込むと本体の束が約 77 KB 増える（Core 自身は
 *     TileJSON の source を作らない）。OpenLayers 10.11.0 で getTileJSON を持つ source は TileJSON だけ。
 *     TileJSON を直接（tileJSON の項目で）渡して作った source では、値はアプリが書いた TileJSON のもの。
 * 入れないもの: OSM・StadiaMaps・CartoDB・XYZ・WMTS など（作るときの値か、ライブラリの既定の文言）。
 * BingMaps は応答の出典に、ライブラリの既定の利用規約のリンクを必ず足すので、見分けられず入れない。
 */
export declare function providerAttributionKind(source: AttributionSourceLike): ProviderAttributionKind | undefined;
/** 地図の設定の `attr` を持つか（空・空白だけの文字列、空の言語ごとの値は持たない扱い）。 */
export declare function hasConfiguredAttr(source: AttributionSourceLike): boolean;
/** OpenLayers の出典の値（文字列・配列・それ以外）を文字列の配列にする。 */
export declare function normalizeOlAttributions(value: unknown): string[];
/**
 * Google の copyright 以外の出典の箱の行数の上限。超えた分は「…」で切り、箱の高さもこの行数までにする
 * （はみ出しは隠す）。全文は UI の地図情報などで見せることを想定する。
 */
export declare const ATTRIBUTION_MAX_LINES = 2;
/**
 * 提供元の申告として読んだ出典（Google の copyright・TileJSON の attribution。第三者のサーバーから
 * 来うる値）を、狭い許可表（sanitizeHtml の profile "iiif"）で洗う。空になったものは除く。
 *   - 残るタグは a・b・br・i・p・small・span・sub・sup だけ、属性は http(s) の href だけ。
 *     img・class・style・javascript: などは落ちる。リンクには target="_blank" と rel="noopener noreferrer" が付く。
 *   - 理由: 広い許可表（地図の設定の attr 用）のままだと、外の値の
 *     `<a href="https://…"><img src="https://…" width="4000" height="4000"></a>` で、出典の箱が地図を覆い、
 *     地図全体が外へのリンクになり、外の画像を読みに行って見ている人の情報が第三者に渡る。
 * 長さは洗う対象ではない（箱の行数の上限で切る。Google の copyright は切らない）。
 * 地図の設定の attr（アプリの作者が書く値）には使わない（従来どおり広い許可表で、img なども通る）。
 * 文字だけの値（Google の copyright など）は変わらない（& と < > は HTML の形になる）。
 */
export declare function sanitizeSourceAttributions(texts: readonly string[]): string[];
/**
 * source の並びから、表示する出典の文字列（言語を選んだもの・空と重複を除いたもの）を作る。
 * 地図の設定の `attr` が無い source は、dynamic（提供元の申告として読んだ出典）の値を使う。
 * Google の地図は `attr` があっても dynamic（copyright）を先に出す。
 * 重複は表示される文字で比べる（設定の `A &amp; B` と source の `A & B` は同じもの）。
 * 返すのは元の値（洗う前）。source の値で、洗うと何も残らないものは除く。
 */
export declare function attributionTexts(sources: AttributionSourceLike[], lang: string, dynamic?: ReadonlyMap<AttributionSourceLike, readonly string[]>): string[];
/**
 * 出典の文字列を箱ごとに分ける（google: Google の copyright・base: 背景地図・overlay: 重ね地図）。
 * overlays に入っている source が重ね地図。同じ表示の文字は 1 回だけ（google → base → overlay の順に取る）。
 */
export declare function attributionGroups(sources: AttributionSourceLike[], lang: string, dynamic?: ReadonlyMap<AttributionSourceLike, readonly string[]>, overlays?: readonly AttributionSourceLike[]): {
    google: string[];
    base: string[];
    overlay: string[];
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
    /**
     * 表示中の source ごとの、提供元の申告（OpenLayers の source から読んだ出典を、狭い許可表で洗った HTML）。
     * 地図の右下に出すのと同じ表から作る。申告の無い source・mapID の無い source は載せない。
     * 地図の定義の attr は載せない（getMapMeta で取れる）。並びは表示の順（前面 → 重ね地図 → 背面）。
     */
    get providerAttributions(): ProviderAttribution[];
    /** 今の言語で出典の文字列を返す（試験と診断用）。 */
    get texts(): string[];
    /**
     * 表示する source を差し替えて描き直す。overlays は sources のうち重ね地図のもの（背景地図と別の箱に出す）。
     */
    update(sources: AttributionSourceLike[], overlays?: readonly AttributionSourceLike[]): void;
    /**
     * 地図の設定の attr が無い source の、提供元の申告の出典を、OpenLayers の source（getAttributions）から読む。
     * 提供元の申告でない source（providerAttributionKind が undefined）は読まない（ライブラリの既定値で埋めない）。
     * 地図の描画（postrender）のたびに、その地図が描いている source と frameState を渡す。
     * Google の source は表示範囲が変わったときだけ取りに行き、それ以外は前の値を返す（OpenLayers の実装）。
     */
    refreshDynamic(sources: (AttributionSourceLike | null | undefined)[], frameState: unknown): void;
    /** 今の source と言語で描き直す。 */
    render(): void;
    /** 表示を外し、言語の監視をやめる。 */
    dispose(): void;
}
