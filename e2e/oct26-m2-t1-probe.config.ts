import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const configDir = dirname(fileURLToPath(import.meta.url)); // = <MaplatCore>/e2e
const rootDir = resolve(configDir, '..'); // = <MaplatCore>

// oct26-m2-t1 設計時 probe 用の専用 config。
// 通常の playwright.config.ts は webServer.command: 'pnpm run dev' を使い、
// 入れ子 pnpm が outer workspace を解決して outer pnpm-lock.yaml を壊す
// （M2 横断契約）。本 config は vite バイナリを直接起動して pnpm を入れ子にしない。
export default defineConfig({
  testDir: configDir,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5175',
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
      ' --host --port 5175 --strictPort',
    cwd: rootDir,
    url: 'http://localhost:5175',
    reuseExistingServer: false,
    timeout: 60000,
  },
});
