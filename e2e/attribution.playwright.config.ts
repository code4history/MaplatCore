import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const configDir = dirname(fileURLToPath(import.meta.url)); // = <MaplatCore>/e2e
const rootDir = resolve(configDir, '..'); // = <MaplatCore>

// 背景地図の出典の表示（e2e/attribution.spec.ts）の config。
// e2e/wc-element.playwright.config.ts と同じく vite バイナリを直接起動する（入れ子 pnpm を避ける）。
// port は 5199（5175 の通常 e2e・5196 の人間用・5198 の要素の e2e と分ける）。終われば Playwright が止める。
// CI では playwright-ci.config.ts（testDir e2e）が同じ spec を port 5175 の下で拾う。
const PORT = 5199;
export default defineConfig({
  testDir: configDir,
  testMatch: /attribution\.spec\.ts$/,
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
