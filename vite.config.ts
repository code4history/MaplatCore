/// <reference types="vitest" />
import { defineConfig, build as viteBuild, type Plugin } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { readFileSync } from "fs";

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));
const isPackageBuild = process.env.BUILD_MODE === "package";
// <maplat-app>（src/element.ts）の副作用登録 entry。本体（maplat_core.js）を二重に
// 抱えないよう src/index.ts を外部扱いにし、同じ dist の ./maplat_core.js を import させる。
// UMD は複数 entry を持てないため、本体のビルドの後に ES だけを別パスで出す。
const isElementBuild = process.env.BUILD_MODE === "element";
// @maplat/core/common（src/common.ts）と @maplat/core/conformance（src/conformance/index.ts）。
// common は地図を持たない共通部分だけを 1 本に出す（OpenLayers 等を含まないことを
// scripts/verify-common-bundle.mjs が確かめる）。element・conformance は common の中身を二重に
// 抱えないよう、同じ dist の ./maplat_core_common.js を import させる。
const isCommonBuild = process.env.BUILD_MODE === "common";
const isConformanceBuild = process.env.BUILD_MODE === "conformance";
const coreEntry = resolve(__dirname, "src/index.ts");
const commonModules = ["src/common", "src/element_base", "src/element_contract"].map(p => resolve(__dirname, p));
const isCommonModule = (id: string) => commonModules.some(base => id === base || id === `${base}.ts`);
const commonOutput = "./maplat_core_common.js";

// デモ限定: Weiwudi の Service Worker を 1 本にまとめて /weiwudi-sw.js として配る（複製を追跡しない）。
// lib ビルドは process.env.NODE_ENV を置換しないので define で固定する（無いと SW の評価が失敗する）。
// まとめに失敗したら警告を出して配らない（デモはキャッシュ無しで動く。ビルドは失敗させない）
function demoWeiwudiSw(): Plugin {
  const entry = resolve(__dirname, "demo/weiwudi-sw-entry.ts");
  let cached: Promise<string> | undefined;
  const bundle = (): Promise<string> =>
    (cached ??= viteBuild({
      configFile: false,
      logLevel: "silent",
      publicDir: false,
      define: { "process.env.NODE_ENV": JSON.stringify("production") },
      build: {
        write: false,
        minify: false,
        lib: { entry, formats: ["iife"], name: "WeiwudiSW", fileName: () => "weiwudi-sw.js" }
      }
    }).then((out) => {
      const list = Array.isArray(out) ? out : [out];
      const chunk = (list[0] as any).output.find((o: any) => o.type === "chunk");
      return chunk.code as string;
    }));
  return {
    name: "demo-weiwudi-sw",
    configureServer(server) {
      server.middlewares.use("/weiwudi-sw.js", (_req, res, next) => {
        bundle().then((code) => {
          res.setHeader("Content-Type", "text/javascript");
          res.setHeader("Cache-Control", "no-cache");
          res.end(code);
        }, (e) => {
          console.warn(`[demo-weiwudi-sw] Service Worker をまとめられません: ${String(e)}`);
          next();
        });
      });
    },
    async generateBundle() {
      try {
        this.emitFile({ type: "asset", fileName: "weiwudi-sw.js", source: await bundle() });
      } catch (e) {
        this.warn(`Service Worker をまとめられません（キャッシュ無しのデモになります）: ${String(e)}`);
      }
    }
  };
}

export default defineConfig({
  base: "./",
  build: isElementBuild ? {
    lib: {
      entry: resolve(__dirname, "src/element.ts"),
      formats: ["es"],
      fileName: () => "maplat_core_element.js"
    },
    rollupOptions: {
      external: (id) => id === coreEntry || id === resolve(__dirname, "src/index") || isCommonModule(id),
      output: {
        paths: (id) =>
          id.startsWith(resolve(__dirname, "src/index"))
            ? "./maplat_core.js"
            : isCommonModule(id)
              ? commonOutput
              : id
      }
    },
    sourcemap: true,
    copyPublicDir: false,
    emptyOutDir: false
  } : isCommonBuild ? {
    lib: {
      entry: resolve(__dirname, "src/common.ts"),
      formats: ["es"],
      fileName: () => "maplat_core_common.js"
    },
    sourcemap: true,
    copyPublicDir: false,
    emptyOutDir: false
  } : isConformanceBuild ? {
    lib: {
      entry: resolve(__dirname, "src/conformance/index.ts"),
      formats: ["es"],
      fileName: () => "maplat_core_conformance.js"
    },
    rollupOptions: {
      external: (id) => isCommonModule(id),
      output: {
        paths: (id) => (isCommonModule(id) ? commonOutput : id)
      }
    },
    sourcemap: true,
    copyPublicDir: false,
    emptyOutDir: false
  } : isPackageBuild ? {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "umd"],
      name: "Maplat",
      fileName: (format) => {
        switch (format) {
          case "es":
            return "maplat_core.js";
          case "cjs":
            return "maplat_core.cjs";
          case "umd":
            return "maplat_core.umd.js";
          default:
            return "maplat_core.js";
        }
      }
    },
    rollupOptions: {
      external: ["ol", "ol/proj", "ol/source", "ol/format", "ol/layer", "ol/Map", "ol/View", "ol/Feature", "ol/geom/Point", "ol/style"],
      output: {
        globals: {
          ol: "ol",
          "ol/proj": "ol.proj",
          "ol/source": "ol.source",
          "ol/format": "ol.format",
          "ol/layer": "ol.layer",
          "ol/Map": "ol.Map",
          "ol/View": "ol.View",
          "ol/Feature": "ol.Feature",
          "ol/geom/Point": "ol.geom.Point",
          "ol/style": "ol.style"
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "maplat_core.css";
          }
          // Vite 6.x uses "core.css" instead of "style.css"
          if (assetInfo.name === "core.css") {
            return "maplat_core.css";
          }
          return assetInfo.name || "asset-[name].[ext]";
        },
        inlineDynamicImports: true
      }
    },
    sourcemap: true,
    copyPublicDir: false
  } : {
    outDir: "dist-demo",
    emptyOutDir: true
  },
  plugins: isElementBuild || isCommonBuild || isConformanceBuild ? [] : [
    ...(isPackageBuild ? [] : [demoWeiwudiSw()]),
    dts({
      outDir: "dist",
      exclude: ["spec", "node_modules"],
      rollupTypes: false,
      tsconfigPath: "./tsconfig.json",
      // tsconfig の removeComments は JS 向け。型定義には JSDoc（@deprecated など）を残し、
      // 利用者のエディタに非推奨の告知が届くようにする
      compilerOptions: { removeComments: false },
      logLevel: "silent",
      insertTypesEntry: true,
      staticImport: true
    })
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./spec/setup.ts"]
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src")
    }
  },
  define: {
    "import.meta.env.APP_VERSION": JSON.stringify(packageJson.version),
    // <maplat-app> の version（src/element.ts）
    __MAPLAT_CORE_VERSION__: JSON.stringify(packageJson.version),
    global: "globalThis"
  },

  server: {
    host: "0.0.0.0",
    port: 5175,
    open: false
  }
});
