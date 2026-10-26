/**
 * 同じキーでは 1 回だけ警告する関数を作る（「キーごとに 1 回」）。
 * 旧クラスの起動時キーのロック・設定ファイルの機能系キーの警告と、要素の warnOnce が共有する
 * （警告の文面と経路は各呼び出し側が持つ）。
 */
export declare function createOnceWarner(): (key: string, message: string) => void;
/**
 * 旧クラス MaplatApp の非推奨を、同一プロセスで 1 回だけ警告する。
 * 呼ぶのは旧クラスのコンストラクタだけ（要素の経路は呼ばない。src/index.ts を参照）。
 */
export declare function warnMaplatAppDeprecated(): void;
/**
 * 「1 回だけ」の記憶を戻す（テストの間の初期化用）。
 * warnMaplatAppDeprecated の付属品で、公開面ではない（@maplat/core の入口からは出さない）。
 * @internal
 */
export declare function resetMaplatAppDeprecationWarning(): void;
export declare function createElement(domStr: string): ChildNode[];
export declare function normalizeDegree(degree: number): number;
export declare function createMapInfo(source: any): any;
export declare function normalizeArg(options: Record<string, any>): Record<string, any>;
