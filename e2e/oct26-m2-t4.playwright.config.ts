import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const configDir = dirname(fileURLToPath(import.meta.url)); // = <MaplatCore>/e2e
const rootDir = resolve(configDir, '..'); // = <MaplatCore>

// oct26-m2-t4（GPS / POI の層選択の是正）専用 config（設計 §5.4）。
// 通常の playwright.config.ts は webServer.command に 'pnpm run dev' を使い、入れ子 pnpm が
// outer workspace の pnpm-lock.yaml を壊しうる。本 config は vite バイナリを直接起動する
// （e2e/oct26-m2-t1-probe.config.ts と同じ型）。背景の dev server は使わない。
export default defineConfig({
  testDir: configDir,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5175',
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
      ' --host 127.0.0.1 --port 5175 --strictPort',
    cwd: rootDir,
    url: 'http://127.0.0.1:5175',
    reuseExistingServer: false,
    timeout: 60000,
  },
});
