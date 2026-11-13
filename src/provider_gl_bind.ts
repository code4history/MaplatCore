/**
 * Mapbox / MapLibre ソースへ共有 GL インスタンスを割り当てる。
 * GL が無いときは throw せずスキップする。
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

export function bindProviderGlToSource(
  source: ProviderGlSource,
  ctx: ProviderGlContext
): boolean {
  if (source.isMapbox()) {
    if (!ctx.mapboxMap) {
      ctx.warn?.(
        "Mapbox GL JS is not available; skipping Mapbox source:",
        source.mapID
      );
      return false;
    }
    source.mapboxMap = ctx.mapboxMap;
    return true;
  }
  if (typeof source.isMapLibre === "function" && source.isMapLibre()) {
    if (!ctx.maplibreMap) {
      ctx.warn?.(
        "MapLibre GL JS is not available; skipping MapLibre source:",
        source.mapID
      );
      return false;
    }
    source.maplibreMap = ctx.maplibreMap;
    return true;
  }
  return true;
}
