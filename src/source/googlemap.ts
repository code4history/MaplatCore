import { Google } from "ol/source";
import {
  setCustomFunctionBase
} from "./mixin";

/**
 * maptype と layers から Google Maps Tile API の { mapType, layerTypes } を導出する純粋関数。
 * 単体テストの対象として export する（constructor 内インラインでは ol/source/Google が
 * createSession_() → fetch を発火するためテスト不能）。
 *
 * mapType は正規表現派生にしない。google_hybrid を RegExp.$1 で切ると "hybrid" になり、
 * Tile API が知らない値になる（マイルストーン設計 §1.2 / §2.1、m6-t4 §4.7）。
 */
export function deriveGoogleTileOptions(
  maptype: string | undefined,
  layers: string[] | undefined,
): { mapType: string; layerTypes: string[] } {
  const GOOGLE_MAPTYPE_TABLE: Record<string, { mapType: string; derivedLayers: string[] }> = {
    google_roadmap:   { mapType: "roadmap",   derivedLayers: [] },
    google_satellite: { mapType: "satellite", derivedLayers: [] },
    google_hybrid:    { mapType: "satellite", derivedLayers: ["layerRoadmap"] },
    google_terrain:   { mapType: "terrain",   derivedLayers: ["layerRoadmap"] },
  };

  const entry = maptype ? GOOGLE_MAPTYPE_TABLE[maptype] : undefined;
  const mapType = entry?.mapType ?? "roadmap";
  const derivedLayers = entry?.derivedLayers ?? [];

  // options.layers と導出分の和集合（重複排除。導出分が先）
  const userLayers = (layers || []).map(
    (layer: string) => `layer${layer.charAt(0).toUpperCase()}${layer.slice(1).toLowerCase()}`
  );
  const layerSet = new Set<string>(derivedLayers);
  for (const l of userLayers) layerSet.add(l);

  return { mapType, layerTypes: [...layerSet] };
}

export class GoogleMap extends setCustomFunctionBase(Google) {
  constructor(options: any = {}) {
    const parentOptions = Object.assign({}, options);
    const { mapType, layerTypes } = deriveGoogleTileOptions(options.maptype, options.layers);
    parentOptions.mapType = mapType;
    parentOptions.layerTypes = layerTypes;
    super(parentOptions);

    if (options.mapID) {
      this.mapID = options.mapID;
    }
    this.initialize(options);
  }
}
