import { test, expect } from '@playwright/test';

test.describe('Issue #59: Visual and Property Verification', () => {
    test('should apply all restore attributes on initialization', async ({ page }) => {
        // Enable console logging
        page.on('console', msg => console.log('Browser console:', msg.text()));
        page.on('pageerror', error => console.log('Page error:', error));

        test.setTimeout(60000);

        // Define expected values
        const expected = {
            mapID: 'morioka_ndl2',
            rotation: 45,
            zoom: 4, // Valid historical map zoom
            latitude: 39.7005,
            longitude: 141.1501,
            transparency: 50
        };

        // Construct URL with query parameters
        const params = new URLSearchParams();
        params.append('restore_mapID', expected.mapID);
        params.append('restore_rotation', expected.rotation.toString());
        params.append('restore_zoom', expected.zoom.toString());
        params.append('restore_latitude', expected.latitude.toString());
        params.append('restore_longitude', expected.longitude.toString());
        params.append('restore_transparency', expected.transparency.toString());

        const url = `e2e/test.html?${params.toString()}`;
        console.log(`Navigating to: ${url}`);

        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // Wait for __MAPLAT_APP__ availability
        await page.waitForFunction(() => (window as any).__MAPLAT_APP__, undefined, { timeout: 30000 });

        // Verify values from the Maplat App instance
        const actual = await page.evaluate(async () => {
            const app = (window as any).__MAPLAT_APP__;

            // Wait for internal readiness
            await app.waitReady;

            const view = app.mapObject.getView();

            return {
                rotation: (view.getRotation() * 180) / Math.PI,
                zoom: view.getZoom(),
                // Use explicit getter or property for transparency
                transparency: app.__transparency || (app.initialRestore ? app.initialRestore.transparency : undefined)
            };
        });

        console.log('Actual State:', actual);

        // Verification
        expect(actual.rotation).toBeCloseTo(expected.rotation, 0.1);
        expect(actual.zoom).toBeCloseTo(expected.zoom, 0.1);
        expect(actual.transparency).toBe(expected.transparency);

        // Visual Assertion
        await page.waitForTimeout(1000); // Brief render wait
        await page.screenshot({ path: 'issue-59-all-attributes.png' });
    });
});
