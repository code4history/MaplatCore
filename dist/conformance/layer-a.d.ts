/** 実装に流すときの固定データ。 */
export interface LayerAFixture {
    /** 起動の材料の属性（例 { "app-id": "morioka" }）。地図を作るのに足りる組を与える */
    attributes?: Record<string, string>;
    /** 起動の材料のプロパティ（例 { setting: {...} }） */
    properties?: Record<string, unknown>;
    /** 起動したときに出る地図（設定ファイルの startFrom 等） */
    initialMapId: string;
    /** 切替先に使う、使える地図（initialMapId と別のもの） */
    otherMapId: string;
    /** 範囲を持つ地図（getMapEnvelope が値を返すもの。無ければ値の検査を省く） */
    envelopeMapId?: string;
}
export interface LayerAConformanceOptions {
    /** 期待する implementation の値（"core" / "core-pro" / 模擬なら任意） */
    implementation: string;
    /** 要素を登録する関数（何度呼ばれてもよいこと。2 回目の呼び出しも試験の対象） */
    register: () => unknown | Promise<unknown>;
    fixture: LayerAFixture;
    /** タグ名（既定 maplat-app） */
    tagName?: string;
    /** supports() の期待値（既定は機能表 LAYER_A_FEATURES の implementation の列） */
    expectedFeatures?: Record<string, boolean>;
    /** 環境の能力。layout: 実ブラウザの寸法・CSS がある（jsdom では false） */
    capabilities?: {
        layout?: boolean;
    };
    /** ready・イベントの待ちの上限（ms。既定 30000） */
    timeout?: number;
}
export interface ConformanceCase {
    /** 群の名前（A-形・A-同期 …） */
    group: string;
    name: string;
    run(): Promise<void>;
}
export interface ConformanceResult {
    group: string;
    name: string;
    ok: boolean;
    error?: string;
    ms: number;
}
/** 適合テストの失敗。 */
export declare class ConformanceError extends Error {
    constructor(message: string);
}
/** 層 A の適合テスト群（試験の道具に依らない形）を作る。 */
export declare function createLayerAConformanceCases(options: LayerAConformanceOptions): ConformanceCase[];
/** describe / it を持つ試験の道具（vitest・jest・mocha・Playwright の test.describe 等）に群を登録する。 */
export declare function runLayerAConformance(options: LayerAConformanceOptions, harness: {
    describe: (name: string, fn: () => void) => void;
    it: (name: string, fn: () => Promise<void>, timeout?: number) => void;
}): void;
/** ページの中で群を順に流し、結果の配列を返す（実ブラウザの e2e から使う）。 */
export declare function runLayerAConformanceInPage(options: LayerAConformanceOptions, onResult?: (result: ConformanceResult) => void): Promise<ConformanceResult[]>;
