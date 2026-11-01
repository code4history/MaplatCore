import { defineConfig } from "vitest/config";
import { resolve } from "path";
import { readFileSync } from "fs";

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));

export default defineConfig({
  // <maplat-app> の version（src/element.ts）。vite.config.ts と同じ値を埋め込む
  define: {
    __MAPLAT_CORE_VERSION__: JSON.stringify(packageJson.version)
  },
  test: {
    globals: true,
    environment: "jsdom",
    environmentOptions: {
      jsdom: {
        url: "http://localhost"
      }
    },
    include: ["spec/**/*.spec.{ts,js}"],
    exclude: [
      "spec/puppeteer.spec.js" // Skip until Playwright migration
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        "dist/**",
        "**/*.d.ts",
        "spec/**",
        "vite.config.ts",
        "vitest.config.ts"
      ]
    },
    setupFiles: ["./spec/setup.ts"],
    silent: false
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src")
    }
  }
});