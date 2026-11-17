// Google の公式のロゴ（assets/google-maps-logo/*.svg）から src/google_maps_logo.ts を作る。
// 外すのは XML 宣言・コメント・id 属性・空白の連なりだけ（見た目は変えない）。
// 同じページに地図が 2 つあると id が重なるため、id は外す。
// 図形が元のファイルと同じことは spec/google-maps-logo.spec.ts が確かめる。
// 実行: node scripts/build-google-maps-logo.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const files = {
  GOOGLE_MAPS_LOGO_LIGHT_OUTLINE: "GoogleMaps_Logo_WithLightOutline.svg",
  GOOGLE_MAPS_LOGO_DARK_OUTLINE: "GoogleMaps_Logo_WithDarkOutline.svg"
};

function compact(svg) {
  return svg
    .replace(/<\?xml[^>]*\?>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s+id="[^"]*"/g, "")
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}

let out =
  "// Google Maps のロゴ（Google LLC の商標）。Map Tiles API の利用条件が求める表示のために、\n" +
  "// 公式の配布物（https://developers.google.com/maps/documentation/tile/policies の\n" +
  "// \"Download the Google Maps attribution assets\"）の SVG を、見た目を変えずに埋め込む。\n" +
  "// このリポジトリのライセンスの対象ではない（THIRD-PARTY-NOTICES.md）。\n" +
  "// 元のファイル: assets/google-maps-logo/。作り直し: node scripts/build-google-maps-logo.mjs（手で書き換えない）\n\n";
for (const [name, file] of Object.entries(files)) {
  const svg = compact(readFileSync(resolve(root, "assets/google-maps-logo", file), "utf8"));
  out += `/** ${file}（枠付き・105×22） */\nexport const ${name} =\n  ${JSON.stringify(svg)};\n\n`;
}
writeFileSync(resolve(root, "src/google_maps_logo.ts"), out.trimEnd() + "\n");
