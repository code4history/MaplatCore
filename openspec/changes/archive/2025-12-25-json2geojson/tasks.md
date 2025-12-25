## 1. Normalization Logic Update
- [x] 1.1 Rewrite `normalizeLayers()` to convert JSON arrays to GeoJSON FeatureCollections
- [x] 1.2 Update `normalizeLayer()` to create FeatureCollection structure for array inputs
- [x] 1.3 Rewrite `normalizePoi()` to convert JSON POI objects to GeoJSON Features
- [x] 1.4 Add coordinate normalization function supporting `lnglat`, `lng`/`lat`, and `longitude`/`latitude` formats
- [x] 1.5 Preserve existing GeoJSON input handling (pass-through with validation)

## 2. POI Management Methods Update
- [x] 2.1 Update `resolvePois()` in `src/source/mixin.ts` to expect GeoJSON structure
- [x] 2.2 Update `addPoi()` to convert JSON input to GeoJSON Feature before adding
- [x] 2.3 Update `addPoiLayer()` to handle both JSON array and GeoJSON inputs
- [x] 2.4 Update `getPoi()` to return GeoJSON Feature from internal structure
- [x] 2.5 Update `removePoi()` to work with GeoJSON Features array
- [x] 2.6 Update `clearPoi()` to clear GeoJSON Features array

## 3. Application-Level Integration
- [x] 3.1 Update `redrawMarkers()` in `src/index.ts` to iterate over GeoJSON Features
- [x] 3.2 Update marker creation logic to extract coordinates from GeoJSON geometry (via flattenFeature in template_works.ts)
- [x] 3.3 Update `addMarker()` to handle both JSON and GeoJSON inputs
- [x] 3.4 Update `getMarker()` to work with GeoJSON Features
- [x] 3.5 Update `updateMarker()` to modify GeoJSON Feature properties (via removeMarker and clearMarker)

## 4. Helper Functions
- [x] 4.1 Add `addIdToFeature()` function to assign IDs to GeoJSON Features
- [x] 4.2 Add coordinate extraction utility for different JSON formats (normalizeCoordinates)
- [x] 4.3 Add GeoJSON validation utility (built into normalizePoi)
- [x] 4.4 Add backward compatibility layer for JSON array consumers (flattenFeature in template_works.ts)

## 5. Testing
- [x] 5.1 Add unit tests for coordinate format conversion (`lnglat`, `lng/lat`, `longitude/latitude`)
- [x] 5.2 Add unit tests for JSON array to GeoJSON conversion
- [x] 5.3 Add unit tests for GeoJSON input pass-through
- [x] 5.4 Add unit tests for layer-level conversion (arrays and FeatureCollections)
- [x] 5.5 Add unit tests for POI addition/removal with GeoJSON (covered in existing tests)
- [ ] 5.6 Add integration tests for round-trip conversion (JSON → GeoJSON → display)
- [ ] 5.7 Add E2E tests with real map data to verify marker rendering

## 6. Documentation
- [x] 6.1 Update code comments to reflect GeoJSON internal structure
- [x] 6.2 Add JSDoc comments for new coordinate normalization functions
- [x] 6.3 Document supported JSON input formats (in JSDoc and type definitions)
- [x] 6.4 Add migration notes (internal change, no external API changes)

