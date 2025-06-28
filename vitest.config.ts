import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
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
      "spec/**/*.deno.test.ts",
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