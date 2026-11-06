/**
 * 1.2 までの旧い記法（<% %>・${ }）で書かれたテンプレートかどうか。
 * raw・verbatim の中を除いた文字列に <%…%> または ${…} があれば旧い記法とみなす。
 * @internal
 */
export declare function isLegacyTemplate(src: string): boolean;
/**
 * 「1 回だけ」の警告の記憶を戻す（テストの間の初期化用）。
 * 公開面ではない（@maplat/core の入口からは出さない）。
 * @internal
 */
export declare function resetTemplateWarnings(): void;
export declare function createIconSet(data: any, ...ancestors: any[]): Record<string, any>;
export declare function createHtmlFromTemplate(data: any, ...ancestors: any[]): any;
/**
 * POI の複製に、祖先のテンプレートから icon・selectedIcon と html・poiStyle を補う。
 * マーカーの描画（clickMarker の detail）と getMarker の戻り値が同じ形になるよう、両方がこの 1 つを通る。
 * 渡した data は書き換えない。
 */
export declare function applyPoiTemplates(data: any, ...ancestors: any[]): any;
