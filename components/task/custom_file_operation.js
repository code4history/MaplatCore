import fs from 'fs';
import path from 'path';

// カスタムプラグインの定義
const customFileOperationsPlugin = {
  name: 'custom-file-operations',
  buildStart() {
    // コピー元のファイルパス
    const srcFilePath = path.resolve(__dirname, '../node_modules/ol/ol.css');
    // コピー先のファイルパス
    const destFilePath = path.resolve(__dirname, '../src/ol_css.ts');

    // ファイルを読み込む
    let fileContent = fs.readFileSync(srcFilePath, 'utf8');

    // ファイルの前後に内容を追加
    fileContent = `const ol_css=\`
    ${fileContent}
    \`;
    export default ol_css;`;

    // 新しい場所にファイルをコピー
    fs.writeFileSync(destFilePath, fileContent);
  }
};

export default customFileOperationsPlugin;
// Vite設定オブジェクトにプラグインを追加
//export default {
//  plugins: [customFileOperationsPlugin]
//};