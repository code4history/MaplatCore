/**
 * m6-t5: Mapbox / MapLibre ソースへ共有 GL インスタンスを割り当てる。
 * GL が無いときは throw せずスキップ（ADR-0014 / 設計 AC10）。
 *
 * @returns true なら cache に含める / false なら当該ソースを落とす
 */
export type ProviderGlSource = {
    mapID?: string;
    isMapbox: () => boolean;
    isMapLibre?: () => boolean;
    mapboxMap?: unknown;
    maplibreMap?: unknown;
};
export type ProviderGlContext = {
    mapboxMap?: unknown;
    maplibreMap?: unknown;
    warn?: (message: string, ...args: unknown[]) => void;
};
export declare function bindProviderGlToSource(source: ProviderGlSource, ctx: ProviderGlContext): boolean;
