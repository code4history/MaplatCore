// vite.config.ts
import { defineConfig } from 'vite';
import fs from 'fs-extra';
import customFileOperationsPlugin from './task/custom_file_operation';
const packageJson = fs.readJsonSync('./package.json');

export default defineConfig({
  plugins: [customFileOperationsPlugin],
  build: {
    rollupOptions: {
      input: {
        //maplat_core: './src/maplat_core.ts',
        //maplat_ui: './src/maplat_ui.ts',
        index: './index.html'
      },
      output: {
        // エントリポイントのJSファイル名にバージョンを含める
        //entryFileNames: `[name].${packageJson.version}.[ext]`,
        // アセットファイル（CSSや画像など）のファイル名にバージョンを含める
        //assetFileNames: `[name].[version].[ext]`
      }
    }
  }
});