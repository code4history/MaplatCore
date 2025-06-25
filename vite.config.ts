import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { readFileSync } from "fs";

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));
const isPackageBuild = process.env.BUILD_MODE === "package";

export default defineConfig({
  base: "./",
  build: isPackageBuild ? {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs", "umd"],
      name: "Maplat",
      fileName: (format) => {
        switch(format) {
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
          ol: "ol"
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "maplat_core.css";
          }
          return assetInfo.name;
        }
      }
    },
    sourcemap: true,
    minify: "terser",
    terserOptions: {
      format: {
        comments: false
      }
    }
  } : {
    outDir: "dist",
    emptyOutDir: true
  },
  plugins: [
    dts({
      outDir: "dist",
      exclude: ["spec", "node_modules"],
      rollupTypes: false,
      skipDiagnostics: true,
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
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    open: false
  }
});