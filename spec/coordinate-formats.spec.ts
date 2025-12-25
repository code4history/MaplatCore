import { describe, it, expect } from "vitest";
import { normalizePoi } from "../src/normalize_pois";
import type { Feature, Point } from "geojson";

describe("Coordinate format conversion", () => {
    it("should convert lnglat format", () => {
        const input = {
            id: "test1",
            name: "Test POI",
            lnglat: [139.5, 35.6] as [number, number]
        };
        const result = normalizePoi(input);
        expect(result.type).toBe("Feature");
        expect(result.geometry.type).toBe("Point");
        expect(result.geometry.coordinates).toEqual([139.5, 35.6]);
        expect(result.properties?.name).toBe("Test POI");
        expect(result.id).toBe("test1");
    });

    it("should convert lng/lat format", () => {
        const input = {
            id: "test2",
            name: "Test POI 2",
            lng: 140.0,
            lat: 36.0
        };
        const result = normalizePoi(input);
        expect(result.geometry.coordinates).toEqual([140.0, 36.0]);
        expect(result.properties?.name).toBe("Test POI 2");
    });

    it("should convert longitude/latitude format", () => {
        const input = {
            id: "test3",
            name: "Test POI 3",
            longitude: 141.0,
            latitude: 37.0
        };
        const result = normalizePoi(input);
        expect(result.geometry.coordinates).toEqual([141.0, 37.0]);
        expect(result.properties?.name).toBe("Test POI 3");
    });

    it("should preserve all properties except coordinate fields", () => {
        const input = {
            id: "test4",
            name: "Test POI 4",
            description: "A test description",
            image: "test.jpg",
            category: "restaurant",
            lnglat: [142.0, 38.0] as [number, number]
        };
        const result = normalizePoi(input);
        expect(result.properties?.name).toBe("Test POI 4");
        expect(result.properties?.description).toBe("A test description");
        expect(result.properties?.image).toBe("test.jpg");
        expect(result.properties?.category).toBe("restaurant");
        // lnglat should not be in properties
        expect(result.properties?.lnglat).toBeUndefined();
    });

    it("should pass through GeoJSON Feature unchanged", () => {
        const input: Feature<Point> = {
            type: "Feature",
            id: "geojson1",
            geometry: {
                type: "Point",
                coordinates: [143.0, 39.0]
            },
            properties: {
                name: "GeoJSON POI"
            }
        };
        const result = normalizePoi(input);
        expect(result).toEqual(input);
    });

    it("should extract id from properties.id for GeoJSON Feature", () => {
        const input: Feature<Point> = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [144.0, 40.0]
            },
            properties: {
                id: "from_properties",
                name: "GeoJSON POI with id in properties"
            }
        };
        const result = normalizePoi(input);
        expect(result.id).toBe("from_properties");
    });

    it("should throw error for POI without coordinates", () => {
        const input = {
            id: "test_no_coords",
            name: "POI without coordinates"
        };
        expect(() => normalizePoi(input as any)).toThrow("POI missing coordinates");
    });
});
