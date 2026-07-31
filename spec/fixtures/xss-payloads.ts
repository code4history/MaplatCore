// m1-t4: サニタイズ検証の共通ペイロード（設計書 §3.5(d)）。
// jsdom（Vitest）と ブラウザ（Playwright）の**両方**から読み、同じ入力で検証する。
// 片方だけの成功では、もう一方の環境の安全性を証明できない。

/** 落ちなければならない入力。`mustNotContain` が出力に現れたら失敗とする。 */
export const MUST_BE_NEUTRALIZED: { name: string; input: string; mustNotContain: string[] }[] = [
  { name: "script タグ", input: `<script>alert(1)</script>`, mustNotContain: ["<script", "alert(1)"] },
  { name: "img の onerror", input: `<img src=x onerror="alert(1)">`, mustNotContain: ["onerror"] },
  { name: "svg の onload", input: `<svg onload="alert(1)"></svg>`, mustNotContain: ["onload"] },
  { name: "a の javascript:", input: `<a href="javascript:alert(1)">x</a>`, mustNotContain: ["javascript:"] },
  { name: "a の vbscript:", input: `<a href="vbscript:msgbox(1)">x</a>`, mustNotContain: ["vbscript:"] },
  { name: "style 属性", input: `<div style="background:url(javascript:alert(1))">x</div>`, mustNotContain: ["style="] },
  { name: "style タグ", input: `<style>body{display:none}</style>`, mustNotContain: ["<style"] },
  { name: "iframe", input: `<iframe src="https://example.com"></iframe>`, mustNotContain: ["<iframe"] },
  { name: "srcdoc", input: `<iframe srcdoc="<script>alert(1)</script>"></iframe>`, mustNotContain: ["srcdoc"] },
  { name: "form + input", input: `<form action="/x"><input name="p"></form>`, mustNotContain: ["<form", "<input"] },
  { name: "object / embed", input: `<object data="x"></object><embed src="y">`, mustNotContain: ["<object", "<embed"] },
  { name: "a[href] の data:", input: `<a href="data:text/html,<script>alert(1)</script>">x</a>`, mustNotContain: ["data:"] },
  { name: "img[src] の data:text/html", input: `<img src="data:text/html,<script>alert(1)</script>">`, mustNotContain: ["data:text/html"] },
  { name: "img[src] の data:image/svg+xml（既定で拒否）", input: `<img src="data:image/svg+xml,<svg onload=alert(1)></svg>">`, mustNotContain: ["data:image/svg"] },
  { name: "img[srcset] の data:", input: `<img srcset="data:image/png;base64,AAA 1x" src="https://example.com/a.png">`, mustNotContain: ["srcset"] },
  { name: "formaction", input: `<button formaction="javascript:alert(1)">x</button>`, mustNotContain: ["formaction"] }
];

/** 保持されなければならない入力（実データの見た目を壊さないこと）。 */
export const MUST_BE_PRESERVED: { name: string; input: string; mustContain: string[] }[] = [
  { name: "太字（実データ全件が使う）", input: `<b>六百遠忌報恩塔</b>`, mustContain: ["<b>", "六百遠忌報恩塔"] },
  { name: "改行（stones が 592 箇所で使う）", input: `年代:<br>文政12年`, mustContain: ["<br"] },
  { name: "リンク（tatebayashi が使う）", input: `<a href="https://example.com/x">詳細</a>`, mustContain: ["<a", "href", "https://example.com/x"] },
  { name: "実データ相当の複合", input: `<b>年代:</b> 文政12年 (1829)<br><b>備考:</b> 柱型`, mustContain: ["<b>", "<br", "文政12年"] },
  { name: "img[src] の data:image/png（正系）", input: `<img src="data:image/png;base64,iVBORw0KGgo=">`, mustContain: ["data:image/png"] },
  { name: "http 画像", input: `<img src="https://t.tilemap.jp/a.jpg" alt="x">`, mustContain: ["https://t.tilemap.jp/a.jpg", "alt"] }
];

/** target="_blank" に rel が強制付与されること。 */
export const TARGET_BLANK = {
  input: `<a href="https://example.com" target="_blank">x</a>`,
  mustContain: ["noopener", "noreferrer"]
};

/**
 * S2（cc-swiper-slide の属性組み立て）の攻撃入力。
 * **キー側**からの注入を含む。値のエスケープだけでは防げない（設計書 §2.3）。
 */
export const MEDIA_ATTR_ATTACKS: { name: string; media: Record<string, unknown>; mustNotContain: string[] }[] = [
  { name: "キーが onerror", media: { src: "https://e/a.png", type: "image", onerror: "alert(1)" }, mustNotContain: ["onerror"] },
  { name: "キーが onload", media: { src: "https://e/a.png", type: "image", onload: "alert(1)" }, mustNotContain: ["onload"] },
  { name: "キーが style", media: { src: "https://e/a.png", type: "image", style: "background:red" }, mustNotContain: ["style="] },
  { name: "キーが srcdoc", media: { src: "https://e/a.png", type: "image", srcdoc: "<script>alert(1)</script>" }, mustNotContain: ["srcdoc"] },
  { name: "キーに空白を含む（属性脱出）", media: { src: "https://e/a.png", type: "image", 'x" onerror="alert(1)': "v" }, mustNotContain: ["onerror"] },
  { name: "真偽値キーが onerror（値なし属性）", media: { src: "https://e/a.png", type: "image", onerror: true }, mustNotContain: ["onerror"] },
  { name: "コンテナ専用属性の混入", media: { src: "https://e/a.png", type: "image", autoplay: true, "has-thumb": true }, mustNotContain: ["autoplay", "has-thumb"] },
  { name: "値側の引用符脱出", media: { src: "https://e/a.png", type: "image", caption: `x" onerror="alert(1)` }, mustNotContain: ["onerror=\"alert"] }
];

/** allowlist 内の属性は保持されること。 */
export const MEDIA_ATTR_PRESERVED = {
  media: {
    src: "https://t.tilemap.jp/a.jpg", type: "image", caption: "六百遠忌報恩塔",
    "material-url": "https://t.tilemap.jp/m.mtl", "camera-position": "0,0,1",
    "fit-to-container": true, "debug-mode": false
  },
  mustContain: ["caption=", "六百遠忌報恩塔", "material-url=", "camera-position=", "fit-to-container"],
  mustNotContain: ["debug-mode"] // false の真偽値属性は出力しない
};
