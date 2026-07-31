declare const _default: {
  "_note": [
    "m1-t4: 許可リストの**データ正本**（設計書 §3.2 / §3.4・AC7）。",
    "sanitize.ts と scripts/m1-t4/scan-poi-tags.mjs の**両方がこのファイルを読む**。",
    "コード側に許可リストを複製しないこと。複製すると実サニタイズと走査の判定がずれる。",
    "verify-html-sinks.mjs の AC7 検査が第二の定義を検出して FAILED にする。"
  ],
  "tags": [
    "b",
    "strong",
    "i",
    "em",
    "u",
    "s",
    "br",
    "p",
    "span",
    "div",
    "ul",
    "ol",
    "li",
    "a",
    "img",
    "small",
    "sub",
    "sup",
    "code",
    "pre",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td"
  ],
  "attributes": [
    "href",
    "src",
    "alt",
    "title",
    "class",
    "target",
    "rel",
    "width",
    "height"
  ],
  "uriSafeAttributes": {
    "_note": "ALLOWED_URI_REGEXP は href/src だけでなく全属性値に適用される。URL を取らない属性はここで対象外と宣言する（alt/class/title は DOMPurify の既定に含まれる）",
    "values": [
      "target",
      "rel",
      "width",
      "height"
    ]
  },
  "forbidTags": [
    "script",
    "style",
    "iframe",
    "object",
    "embed",
    "form",
    "input",
    "textarea",
    "link",
    "meta",
    "base"
  ],
  "forbidAttributes": [
    "srcdoc",
    "style",
    "formaction",
    "xlink:href"
  ],
  "slide": {
    "_note": "cc-swiper-slide が実際に読む属性。Chuci/src/components/swiper/cc-swiper.ts の getAttribute / hasAttribute を全数走査して確定",
    "valueAttributes": [
      "image-url",
      "image-type",
      "thumbnail-url",
      "caption",
      "material-url",
      "camera-position",
      "camera-target",
      "show-texture"
    ],
    "booleanAttributes": [
      "fit-to-container",
      "debug-mode"
    ],
    "urlAttributes": [
      "image-url",
      "thumbnail-url",
      "material-url"
    ],
    "textAttributes": {
      "_note": "受け手が自分の HTML へ補間するため、属性エスケープだけでなくテキスト化する（往復対策）",
      "values": [
        "caption"
      ]
    }
  }
};

export default _default;
