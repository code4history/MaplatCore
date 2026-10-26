import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const configDir = dirname(fileURLToPath(import.meta.url)); // = <MaplatCore>/e2e
const rootDir = resolve(configDir, '..'); // = <MaplatCore>

// <maplat-app> の確認ページ（demo/element.html）と層 A の適合テスト（e2e/wc-conformance.html）の config。
// e2e/oct26-m2-t4.playwright.config.ts と同じく vite バイナリを直接起動する（入れ子 pnpm を避ける）。
// port は 5198（5175 の通常 e2e・人間用の 5196 と分ける）。終われば Playwright が止める。
// CI では playwright-ci.config.ts（testDir e2e・testIgnore 無し）が同じ 2 つの spec を port 5175 の下で拾う（実測して通した）。
const PORT = 5198;
export default defineConfig({
  testDir: configDir,
  testMatch: /wc-(element|conformance)\.spec\.ts$/,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'off',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--use-angle=swiftshader', '--use-gl=angle']
        }
      },
    },
  ],
  webServer: {
    command:
      resolve(rootDir, 'node_modules/.bin/vite') +
      ` --host 127.0.0.1 --port ${PORT} --strictPort`,
    cwd: rootDir,
    url: `http://127.0.0.1:${PORT}/demo/element.html`,
    reuseExistingServer: false,
    timeout: 60000,
  },
});
