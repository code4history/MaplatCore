import { test, expect } from '@playwright/test';

test.describe('Issue #59: Visual Verification', () => {
    test('should apply rotation visually on existing app', async ({ page }) => {
        test.setTimeout(60000);

        // Load page (default MaplatApp initializes with morioka_ndl2)
        await page.goto('e2e/test.html', { waitUntil: 'domcontentloaded' });

        // Wait for app ready
        await page.waitForFunction(() => (window as any).__MAPLAT_APP__ && (window as any).__MAPLAT_APP__.on, undefined, { timeout: 45000 });

        await page.evaluate(async () => {
            const app = (window as any).__MAPLAT_APP__;

            // Switch to a DIFFERENT map ('morioka') to differentiate from default ('morioka_ndl2')
            // Apply 45 degree rotation via restore
            const restore = {
                mapID: 'morioka',
                backgroundID: 'gsi',
                position: {
                    rotation: 45,
                    zoom: 16,
                    latitude: 39.7005,
                    longitude: 141.1501
                },
                transparency: 50
            };

            console.log('Switching to morioka with rotation 45...');
            await app.changeMap('morioka', restore);
            (window as any).__TEST_APP__ = app;
        });

        // Wait for map to settle
        await page.waitForTimeout(3000);

        // Take screenshot
        await page.screenshot({ path: 'issue-59-rotation-check.png' });

        // Verify Map ID changed
        const currentMapID = await page.evaluate(() => (window as any).__TEST_APP__.currentMapInfo().mapID);
        console.log(`Current Map ID: ${currentMapID}`);
        expect(currentMapID).toBe('morioka');

        // Verify Rotation
        const rotation = await page.evaluate(() => {
            const view = (window as any).__TEST_APP__.mapObject.getView();
            return (view.getRotation() * 180) / Math.PI;
        });
        console.log(`Actual Rotation: ${rotation}`);

        // Interactive pause for user (uncomment if headed)
        // await page.pause();

        expect(rotation).toBeCloseTo(45, 1);
    });
});
