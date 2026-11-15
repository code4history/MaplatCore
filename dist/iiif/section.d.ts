import { MapMetaIiif } from '../element_contract';
import { IiifMetadataDisplay, MaplatIiifSection } from './manifest';
/** アプリの設定が無いときに使う、書誌の表の出し方 */
export declare const IIIF_METADATA_DISPLAY_DEFAULT = "hidden";
/**
 * 地図データの iiif 節から、形の正しい項目だけを控える。
 * オブジェクトでなければ控えない（undefined）。manifest・canvas・image・copiedAt は文字列のときだけ、
 * bindings・copiedValues はオブジェクトのときだけ、copiedMetadata は配列のときだけ残す。
 * copiedMetadata は要素の形（isIiifMetadataEntry）に合うものだけを順に残し、外した要素があれば
 * mapID を渡された呼び出し（initialize）で 1 回だけ警告する。
 */
export declare function normalizeIiifSection(value: unknown, mapID?: string): MaplatIiifSection | undefined;
/** アプリの設定の書誌の表の出し方。all・hidden のときだけ控える */
export declare function normalizeIiifMetadataDisplay(value: unknown): IiifMetadataDisplay | undefined;
/**
 * getMapMeta が返す iiif の節。
 * 地図データの iiif 節のうち表示に使う項目だけを写し、書誌の表の出し方はアプリの設定
 * （無ければ既定）で決める。bindings・copiedValues は表示に使わないので載せない。
 * 節は initialize で形を検査済み（this.iiif）。ここでは mapID を渡さずに同じ検査を通すだけで、
 * 形の合わない要素の警告は initialize の 1 回に留める。
 */
export declare function mapMetaIiif(value: unknown, display: unknown): MapMetaIiif | undefined;
