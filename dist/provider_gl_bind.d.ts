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
