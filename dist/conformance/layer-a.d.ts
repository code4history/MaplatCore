export interface LayerAFixture {
    attributes?: Record<string, string>;
    properties?: Record<string, unknown>;
    initialMapId: string;
    otherMapId: string;
    envelopeMapId?: string;
}
export interface LayerAConformanceOptions {
    implementation: string;
    register: () => unknown | Promise<unknown>;
    fixture: LayerAFixture;
    tagName?: string;
    expectedFeatures?: Record<string, boolean>;
    capabilities?: {
        layout?: boolean;
    };
    timeout?: number;
}
export interface ConformanceCase {
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
export declare class ConformanceError extends Error {
    constructor(message: string);
}
export declare function createLayerAConformanceCases(options: LayerAConformanceOptions): ConformanceCase[];
export declare function runLayerAConformance(options: LayerAConformanceOptions, harness: {
    describe: (name: string, fn: () => void) => void;
    it: (name: string, fn: () => Promise<void>, timeout?: number) => void;
}): void;
export declare function runLayerAConformanceInPage(options: LayerAConformanceOptions, onResult?: (result: ConformanceResult) => void): Promise<ConformanceResult[]>;
