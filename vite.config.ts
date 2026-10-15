/// <reference types="vitest" />
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { readFileSync } from "fs";

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));
const isPackageBuild = process.env.BUILD_MODE === "package";

// nov26-m9-t6 §3.3（試行・merge しない）: vite 8 で既定が変わった build.target・cssTarget・minify を、
// base（vite 7.3 の解決値。collect vite-config の出力）のまま明示して保つ。cssMinify は両側とも true で同じ。
const M9_T6_BASE_BUILD = {
  target: ["chrome107", "edge107", "firefox104", "safari16"],
  cssTarget: ["chrome107", "edge107", "firefox104", "safari16"],
  minify: "esbuild"
};

export default defineConfig({
  base: "./",
  build: isPackageBuild ? {
    ...M9_T6_BASE_BUILD,
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
      external: ["ol", "ol/proj", "ol/source", "ol/layer", "ol/Map", "ol/View", "ol/Feature", "ol/geom/Point", "ol/style"],
      output: {
        globals: {
          ol: "ol",
          "ol/proj": "ol.proj",
          "ol/source": "ol.source",
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
    ...M9_T6_BASE_BUILD,
    emptyOutDir: true
  },
  plugins: [
    dts({
      outDir: "dist",
      exclude: ["spec", "node_modules"],
      rollupTypes: false,
      tsconfigPath: "./tsconfig.json",
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
    global: "globalThis"
  },

  server: {
    host: "0.0.0.0",
    port: 5175,
    open: false
  }
});
