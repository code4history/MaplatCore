/**
 * lodash.template の記法で書かれたテンプレートかどうか。
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
