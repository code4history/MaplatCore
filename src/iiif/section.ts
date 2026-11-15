import { isIiifMetadataEntry, type MapMetaIiif } from "../element_contract";
import type {
  IiifBindings,
  IiifMetadataDisplay,
  MaplatIiifSection
} from "./manifest";

/** アプリの設定が無いときに使う、書誌の表の出し方 */
export const IIIF_METADATA_DISPLAY_DEFAULT = "hidden";

function isPlainObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * 地図データの iiif 節から、形の正しい項目だけを控える。
 * オブジェクトでなければ控えない（undefined）。manifest・canvas・image・copiedAt は文字列のときだけ、
 * bindings・copiedValues はオブジェクトのときだけ、copiedMetadata は配列のときだけ残す。
 * copiedMetadata は要素の形（isIiifMetadataEntry）に合うものだけを順に残し、外した要素があれば
 * mapID を渡された呼び出し（initialize）で 1 回だけ警告する。
 */
export function normalizeIiifSection(
  value: unknown,
  mapID?: string
): MaplatIiifSection | undefined {
  if (!isPlainObject(value)) return undefined;
  const section: MaplatIiifSection = {};
  if (typeof value.manifest === "string") section.manifest = value.manifest;
  if (typeof value.canvas === "string") section.canvas = value.canvas;
  if (typeof value.image === "string") section.image = value.image;
  if (typeof value.copiedAt === "string") section.copiedAt = value.copiedAt;
  if (isPlainObject(value.bindings))
    section.bindings = value.bindings as IiifBindings;
  if (isPlainObject(value.copiedValues)) {
    section.copiedValues = value.copiedValues as Record<
      string,
      Record<string, string>
    >;
  }
  if (Array.isArray(value.copiedMetadata)) {
    const entries = value.copiedMetadata.filter(isIiifMetadataEntry);
    const dropped: number = value.copiedMetadata.length - entries.length;
    // 警告は initialize の 1 回だけ。getMapMeta は mapID を渡さずに同じ検査を通す（二度目の警告を出さない）
    if (dropped > 0 && mapID !== undefined) {
      console.warn(
        `Maplat: ignored ${dropped} malformed entries in iiif.copiedMetadata (mapID: "${mapID}").`
      );
    }
    section.copiedMetadata = entries;
  }
  return section;
}

/** アプリの設定の書誌の表の出し方。all・hidden のときだけ控える */
export function normalizeIiifMetadataDisplay(
  value: unknown
): IiifMetadataDisplay | undefined {
  return value === "all" || value === "hidden" ? value : undefined;
}

/**
 * getMapMeta が返す iiif の節。
 * 地図データの iiif 節のうち表示に使う項目だけを写し、書誌の表の出し方はアプリの設定
 * （無ければ既定）で決める。bindings・copiedValues は表示に使わないので載せない。
 * 節は initialize で形を検査済み（this.iiif）。ここでは mapID を渡さずに同じ検査を通すだけで、
 * 形の合わない要素の警告は initialize の 1 回に留める。
 */
export function mapMetaIiif(
  value: unknown,
  display: unknown
): MapMetaIiif | undefined {
  const section = normalizeIiifSection(value);
  if (!section) return undefined;
  const iiif: MapMetaIiif = {
    display:
      normalizeIiifMetadataDisplay(display) ?? IIIF_METADATA_DISPLAY_DEFAULT
  };
  if (section.manifest !== undefined) iiif.manifest = section.manifest;
  if (section.canvas !== undefined) iiif.canvas = section.canvas;
  if (section.image !== undefined) iiif.image = section.image;
  if (section.copiedAt !== undefined) iiif.copiedAt = section.copiedAt;
  if (section.copiedMetadata !== undefined)
    iiif.metadata = section.copiedMetadata;
  return iiif;
}
