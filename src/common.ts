// @maplat/core/common: 層 A（<maplat-app>）・層 B（<maplat-ui>）の実装が共通に使う部分（仕様 §5.3・U8）。
//
//   import { sanitizeHtml, MAPLAT_APP_EVENTS, MaplatAppElementBase } from "@maplat/core/common";
//   import type { MaplatAppElement, Viewpoint } from "@maplat/core/common";
//
// **地図も描画も持たない**（依存は DOM と DOMPurify だけ）。この入口からたどれる import の連鎖に
// OpenLayers・Weiwudi・@maplat/transform・turf を入れない（spec/common-entry.spec.ts がソースの
// import を、scripts/verify-common-bundle.mjs がビルド後の dist/maplat_core_common.js を確かめる）。
// 副作用も持たない（要素を登録しない）。要素の登録は "@maplat/core/element" 等の入口が行う。
//
// 正本の仕様: NayutaProducts/docs/superpowers/specs/2026-10-10-maplat-web-components-interface.md §5.3

// ---- 補助関数（§5.3）----
// @maplat/core からも従来どおり import できるもの: sanitizeHtml・escapeAttr・toPlainText・buildSlideAttrs・createElement・assets
export { sanitizeHtml, escapeAttr, toPlainText, buildSlideAttrs } from "./sanitize";
export { createElement } from "./functions";
export { assets } from "./assets";
// common だけが export するもの（@maplat/core の入口には無い）: normalizeArg・META_KEYS・META_KEYS_OPTION
export { normalizeArg } from "./functions";
export { META_KEYS, META_KEYS_OPTION } from "./meta_keys";

// ---- 層 A・層 B の名前の表と型（§3・§4・§3.6）----
export {
  MAPLAT_APP_TAG,
  MAPLAT_UI_TAG,
  MAPLAT_APP_EVENTS,
  ELEMENT_OWN_EVENTS,
  LAYER_A_PRO_EVENTS,
  LIFECYCLE_PHASES,
  MAPLAT_APP_METHODS,
  ELEMENT_OWN_METHODS,
  LAYER_A_PRO_METHODS,
  LAYER_A_STATE_PROPERTIES,
  LAYER_A_FEATURES,
  LAYER_A_FEATURE_NAMES,
  featuresOf,
  ELEMENT_ATTRIBUTES,
  ELEMENT_PROPERTIES,
  LAYER_A_PRO_ATTRIBUTES,
  LAYER_A_PRO_PROPERTIES,
  ELEMENT_STARTUP_KEYS,
  APP_OPTION_ALIASES,
  propToAttributeName,
  attributeToPropName,
  parseAttributeValue,
  formatAttributeValue,
  unsupportedKeyMessage,
  MAPLAT_UI_ATTRIBUTES,
  MAPLAT_UI_EVENTS,
  MAPLAT_UI_METHODS,
  isLngLat,
  isViewpoint,
  isMapMeta,
  isMapListItem,
  isMaplatPoi,
  isPoiLayer,
  isSourceLoadedDetail,
  isLifecycleDetail
} from "./element_contract";
export type {
  MaplatAppEventName,
  ElementOwnEventName,
  MaplatAppMethodName,
  ElementOwnMethodName,
  LifecyclePhaseId,
  LayerAImplementationName,
  AttrKind,
  AttrDef,
  PropDef,
  LngLat,
  Localized,
  Viewpoint,
  MapMeta,
  MapListItem,
  RestorePosition,
  Restore,
  AppState,
  EnvelopeStroke,
  EnvelopeSpec,
  LifecycleDetail,
  LifecycleErrorDetail,
  SourceLoadedItem,
  TileCacheStats,
  TileCacheProgressType,
  TileCacheProgress,
  MaplatPoi,
  MaplatPoiMedia,
  PoiLayer,
  GpsResultDetail,
  GpsErrorDetail,
  MaplatAppEventDetailMap,
  MaplatAppEvent,
  DisplayMode,
  MaplatAppElementSettings,
  MaplatAppElementState,
  MaplatAppDelegatedMethods,
  MaplatAppOwnMethods,
  MaplatAppProMethods,
  MaplatAppElement,
  MaplatUiElement
} from "./element_contract";

// ---- 要素の殻（実装に依らない基底クラス）----
export { MaplatAppElementBase, defineMaplatAppElementOnce, injectMaplatAppStyle } from "./element_base";
export type {
  LayerAImplementation,
  ElementStartupConfig,
  RuntimeValueResolver,
  MaplatAppElementProSettings
} from "./element_base";
