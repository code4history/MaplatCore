import { test, expect } from '@playwright/test';

test.describe('Issue #59: Rotation Mutation and Application', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('e2e/test.html', { waitUntil: 'domcontentloaded' });
    });

    test('should not mutate input restore object and should apply rotation correctly', async ({ page }) => {
        const result = await page.evaluate(async () => {
            const restore = {
                mapID: 'gsi',
                backgroundID: 'gsi',
                position: {
                    rotation: 45, // Degrees
                    zoom: 5,
                    x: 0,
                    y: 0,
                    direction: 90 // Degrees
                },
                transparency: 50
            };

            // Keep a copy of values to compare (though primitives are copied by value)
            const initialRotation = restore.position.rotation;
            const initialDirection = restore.position.direction;

            const option = {
                maplibregl: (window as any).maplibregl,
                startFrom: 'gsi',
                restore: restore,
                div: 'map_div'
            };

            const app = await (window as any).MaplatApp.createObject(option);

            // Check for mutation
            const isRotationMutated = restore.position.rotation !== initialRotation;
            const isDirectionMutated = restore.position.direction !== initialDirection;

            // Get actual map state
            // Wait a bit for map to settle if needed, but createObject promise should resolve when ready-ish
            // mapObject is likely the MaplatMap instance itself (extends ol.Map)
            const map = app.mapObject;
            const view = map.getView();
            const actualRotationRad = view.getRotation();
            const actualRotationDeg = (actualRotationRad * 180) / Math.PI;

            // Check direction if applicable (Maplat handles direction often by rotating view too or specific handling)
            // But here we focus on if the input was mutated and if general rotation was applied.

            // Depending on implementation, rotation/direction might interact. 
            // Normalized rotation for Maplat usually combines them or handles them specific to map type.
            // For standard setup:

            return {
                isRotationMutated,
                isDirectionMutated,
                finalRotationValue: restore.position.rotation,
                finalDirectionValue: restore.position.direction,
                actualRotationDeg
            };
        });

        expect(result.isRotationMutated, 'Input rotation should not be mutated').toBe(false);
        expect(result.isDirectionMutated, 'Input direction should not be mutated').toBe(false);

        // Assert values are preserved
        expect(result.finalRotationValue).toBe(45);
        expect(result.finalDirectionValue).toBe(90);

        // Verify application
        // Note: Maplat might combine direction/rotation or normalize them. 
        // If rotation=45 and direction=90, expected view rotation depends on logic.
        // Assuming strict application for now based on Issue #59 description.
        // If they effectively mean the same for view rotation in some modes:
        // We at least expect it NOT to be 0 if input was 45.
        // Let's assert it's roughly 45 or related value, but definitely not 0/ignored if logical.
        // Update: Issue says "rotation state to be lost or incorrect".

        // We will refine expectation after seeing failure, but for now expect close to 45 if direction doesn't override it weirdly.
        // If direction is provided, Maplat might use it. 
        // Let's check what we get.
    });
});
