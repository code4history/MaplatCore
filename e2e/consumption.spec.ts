import { test, expect } from '@playwright/test';

test.describe('Consumption Scenarios', () => {
    // ESM CDN
    test('ESM CDN (Import Map) should load map and verify assets', async ({ page }) => {
        await page.goto('/tests/consumption/esm-cdn.html');

        // Check status element
        await expect(page.locator('#status')).toHaveText(/SUCCESS/, { timeout: 10000 });

        // Check map canvas exists (might be multiple layers)
        const canvas = page.locator('canvas').first();
        await expect(canvas).toBeVisible();
    });

    // UMD CDN
    test('UMD CDN (Global) should load map', async ({ page }) => {
        await page.goto('/tests/consumption/umd-cdn.html');

        // Check status element
        await expect(page.locator('#status')).toHaveText(/SUCCESS/, { timeout: 10000 });

        // Check map canvas exists
        const canvas = page.locator('canvas').first();
        await expect(canvas).toBeVisible();
    });

    // Self-hosted ESM
    test('Self-hosted ESM should load map', async ({ page }) => {
        await page.goto('/tests/consumption/self-hosted.html');

        // Check status element
        await expect(page.locator('#status')).toHaveText(/SUCCESS/, { timeout: 10000 });

        // Check map canvas exists
        const canvas = page.locator('canvas').first();
        await expect(canvas).toBeVisible();
    });
});
