/** sanitizeHtml の許可表の種類。 */
export type SanitizeProfile = "iiif";
/** sanitizeHtml の呼び出しごとの指定。 */
export interface SanitizeOptions {
    /**
     * "iiif" のときだけ IIIF の書誌の値の許可表（データ正本の iiif 節）を使う。
     * 指定しないときは従来どおりの許可表で、挙動は変わらない。
     */
    profile?: SanitizeProfile;
}
/** リモート POI 由来の HTML を無害化する。S1 / S5 の sink で使う。 */
export declare function sanitizeHtml(dirty: string, opts?: SanitizeOptions): string;
/**
 * IIIF の Manifest から写す書誌の値のサニタイズ（許可するタグ・属性を絞ったもの）。
 *
 * window（DOMPurify）に頼るため、ブラウザ（Electron renderer など）で呼ぶ前提である。
 */
export declare function sanitizeIiifHtml(dirty: string): string;
/** 属性値をエスケープする。属性を組み立てる箇所で使う。 */
export declare function escapeAttr(value: string): string;
/**
 * HTML を落としてテキストだけを残す。**属性の往復**に備えるためのもの。
 *
 * なぜ必要か（設計書 §3.4）:
 *   escapeAttr は「属性コンテキスト」でのエスケープにすぎない。
 *   属性へ &lt;img…&gt; と書いても、ブラウザの getAttribute はエンティティを復号して
 *   `<img …>` を返す。受け手（Chuci の cc-swiper）はその値を自分の HTML へ補間するため、
 *   往復した時点で生の HTML に戻ってしまう。
 *   caption の契約はテキストであり（実データ13件すべてが HTML を含まない）、
 *   HTML が渡ること自体が誤りなので、渡す側でテキスト化する。
 */
export declare function toPlainText(value: string): string;
/**
 * mediaObj から cc-swiper-slide の属性文字列を組み立てる（S2）。
 *
 * **属性名も POI 由来である**ため、値のエスケープだけでは防げない（設計書 §2.3）。
 * 旧実装は `["src","type","thumbnail","desc"]` の blocklist 4件だけを除外しており、
 * `{"onerror":"alert(1)"}` があれば ` onerror="alert(1)"` をそのまま出力していた。
 * ここでは allowlist に一致するキーだけを出力する。
 */
export declare function buildSlideAttrs(media: Record<string, unknown>): string;
