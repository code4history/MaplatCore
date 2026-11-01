// 地図のメタデータのキー（地図情報・getMapMeta・mapChanged の detail）。
// 依存を持たない（@maplat/core/common からたどれるファイルが OpenLayers 等を読まないよう、
// src/source/mixin.ts から切り出した。mixin.ts は従来どおり同じ名前で再 export する）。
export const META_KEYS = [
  "title",
  "officialTitle",
  "author",
  "createdAt",
  "era",
  "contributor",
  "mapper",
  "license",
  "dataLicense",
  // m6-t2: ライセンスの自由記述欄。META_KEYS_OPTION と lockstep (同じ index) で足す。
  "licenseNote",
  "dataLicenseNote",
  "attr",
  "dataAttr",
  "reference",
  "description"
];
export const META_KEYS_OPTION = [
  "title",
  "official_title",
  "author",
  "created_at",
  "era",
  "contributor",
  "mapper",
  "license",
  "data_license",
  "license_note",
  "data_license_note",
  "attr",
  "data_attr",
  "reference",
  "description"
];
