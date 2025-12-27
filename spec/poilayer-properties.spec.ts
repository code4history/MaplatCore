import { describe, it, expect, beforeEach } from "vitest";
import { normalizeLayers, normalizeLayer } from "../src/normalize_pois";
import type { LayersCollection } from "../src/normalize_pois";

describe("POILayer properties migration tests", () => {
    describe("normalizeLayer - properties object", () => {
        it("should create properties object with name and namespaceID", () => {
            const layer = normalizeLayer(
                [],
                "testLayer",
                { name: "TestApp", namespace: "app" }
            );

            expect(layer.properties).toBeDefined();
            expect(layer.properties?.name).toBe("testLayer");
            expect(layer.properties?.namespaceID).toBe("app#testLayer");
        });

        it("should use provided name for main layer", () => {
            const layer = normalizeLayer(
                [],
                "main",
                { name: "MyApp", namespace: "app" }
            );

            expect(layer.properties?.name).toBe("MyApp");
            expect(layer.properties?.namespaceID).toBe("app#main");
        });

        it("should preserve existing properties from FeatureCollection", () => {
            const input = {
                type: "FeatureCollection" as const,
                features: [],
                properties: {
                    customProp: "customValue"
                }
            };

            const layer = normalizeLayer(input, "test", { name: "App" });

            expect(layer.properties?.customProp).toBe("customValue");
            expect(layer.properties?.name).toBe("test");
        });
    });

    describe("normalizeLayers - multiple layers", () => {
        it("should add properties to all layers", async () => {
            const input = {
                main: [],
                restaurant: []
            };

            const result = await normalizeLayers(input, { name: "TestApp" });

            expect(result.main.properties?.name).toBe("TestApp");
            expect(result.main.properties?.namespaceID).toBe("main");
            expect(result.restaurant.properties?.name).toBe("restaurant");
            expect(result.restaurant.properties?.namespaceID).toBe("restaurant");
        });

        it("should handle namespace option", async () => {
            const input = { main: [] };

            const result = await normalizeLayers(input, {
                name: "App",
                namespace: "myApp"
            });

            expect(result.main.properties?.namespaceID).toBe("myApp#main");
        });
    });

    describe("Layer visibility - hide property", () => {
        let layers: LayersCollection;

        beforeEach(async () => {
            layers = await normalizeLayers(
                { main: [], other: [] },
                { name: "App" }
            );
        });

        it("should initially not have hide property", () => {
            expect(layers.main.properties?.hide).toBeUndefined();
        });

        it("should allow setting hide property", () => {
            if (!layers.main.properties) layers.main.properties = {};
            layers.main.properties.hide = true;

            expect(layers.main.properties.hide).toBe(true);
        });

        it("should allow deleting hide property", () => {
            if (!layers.main.properties) layers.main.properties = {};
            layers.main.properties.hide = true;
            delete layers.main.properties.hide;

            expect(layers.main.properties.hide).toBeUndefined();
        });
    });

    describe("Template properties in layer", () => {
        it("should allow storing template-related properties", () => {
            const layer = normalizeLayer([], "main", { name: "App" });

            if (!layer.properties) layer.properties = {};
            layer.properties.html = "<div>Test</div>";
            layer.properties.htmlStyle = "color: red;";
            layer.properties.icon = "/icon.png";
            layer.properties.selectedIcon = "/selected.png";

            expect(layer.properties.html).toBe("<div>Test</div>");
            expect(layer.properties.htmlStyle).toBe("color: red;");
            expect(layer.properties.icon).toBe("/icon.png");
            expect(layer.properties.selectedIcon).toBe("/selected.png");
        });
    });

    describe("GeoJSON compliance", () => {
        it("should only have GeoJSON standard properties at top level", () => {
            const layer = normalizeLayer([], "test", { name: "App" });

            const topLevelKeys = Object.keys(layer);
            const allowedTopLevel = ["type", "features", "id", "__nextId", "properties"];

            topLevelKeys.forEach(key => {
                expect(allowedTopLevel).toContain(key);
            });
        });

        it("should be valid FeatureCollection structure", () => {
            const layer = normalizeLayer([], "test", { name: "App" });

            expect(layer.type).toBe("FeatureCollection");
            expect(Array.isArray(layer.features)).toBe(true);
        });
    });
});
