// @maplat/core/template — POI テンプレート（poiTemplate・iconTemplate）を評価する関数の入口。
//   import { applyPoiTemplates } from "@maplat/core/template";
//
// MaplatApp がマーカーの描画と getMarker に使うのと同じ実装（src/template_works.ts）を出す。上位の実装が
// 評価を写さずに、同じ設定ファイルで同じ表示を出せるようにするため。
// Nunjucks（Quyuan の @c4h/quyuan/template）を同梱するので、@maplat/core/common には入れない
// （common は @maplat/core/element が import する。入れると element の利用者すべてで Nunjucks が 2 重に載る）。
// 地図も描画も持たず、副作用も持たない。この入口からたどれる import の連鎖に OpenLayers・Weiwudi・
// @maplat/transform・turf を入れない（spec/template-entry.spec.ts がソースの import を、
// scripts/verify-common-bundle.mjs がビルド後の dist/maplat_core_template.js を確かめる）。
export { createIconSet, createHtmlFromTemplate, applyPoiTemplates } from "./template_works";
export type { PoiTemplateLevel, PoiTemplateFields } from "./template_works";
