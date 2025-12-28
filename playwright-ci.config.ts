import { defineConfig, devices } from '@playwright/test';

// CI環境用の最小限の設定
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: true,
  retries: 2,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5175',
    trace: 'on-first-retry',
    screenshot: 'on',
    headless: true,
  },

  // Chromiumのみでテスト
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
    command: 'pnpm run dev',
    url: 'http://localhost:5175',
    reuseExistingServer: true,
  },
});