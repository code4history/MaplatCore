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
    "td",
    "qy-swiper",
    "qy-swiper-slide"
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
    "_note": "cc-swiper-slide が実際に読む属性。Chuci/src/components/swiper/cc-swiper.ts の getAttribute / hasAttribute を全数走査して確定。qy-swiper-slide は cc-swiper-slide を継承し属性は同じ（Quyuan qy-swiper.ts:148）",
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
  },
  "swiper": {
    "_note": "qy-swiper（Chuci の cc-swiper を継承）が読む真偽値の属性。Chuci cc-swiper.ts の hasAttribute を全数走査して確定",
    "booleanAttributes": [
      "has-thumb",
      "autoplay"
    ]
  },
  "iiif": {
    "_note": "IIIF の Manifest から写す書誌の値の許可表。外部のサーバーが決める値なので、見出し・強調・改行・リンクだけに絞る（img は許可しない）。属性は href だけを残し、リンクには target=\"_blank\" と rel=\"noopener noreferrer\" を付け、href は http(s) に限る",
    "tags": [
      "a",
      "b",
      "br",
      "i",
      "p",
      "small",
      "span",
      "sub",
      "sup"
    ],
    "attributes": [
      "href"
    ],
    "forbidContents": {
      "_note": "許可しない要素のうち「中の文字も捨てる」もの。DOMPurify の既定の一覧から thead を除いた形（既定のままだと表の見出しの文字まで消えるため）。表の要素そのものは tags の許可表に無いので出力には残らない",
      "tags": [
        "annotation-xml",
        "audio",
        "colgroup",
        "desc",
        "foreignobject",
        "head",
        "iframe",
        "math",
        "mi",
        "mn",
        "mo",
        "ms",
        "mtext",
        "noembed",
        "noframes",
        "noscript",
        "plaintext",
        "script",
        "selectedcontent",
        "style",
        "svg",
        "template",
        "title",
        "video",
        "xmp"
      ]
    }
  }
}
;

export default _default;
