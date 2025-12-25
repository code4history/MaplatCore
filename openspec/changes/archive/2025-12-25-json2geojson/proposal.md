# Change: Convert POI Management from JSON Arrays to GeoJSON

## Why
MaplatCore currently manages POIs internally as JSON arrays (`{ pois: [{...}, {...}] }`), converting incoming GeoJSON FeatureCollections to this format. This creates friction when working with standard geospatial tools and libraries that expect GeoJSON. By inverting the approach—managing POIs as GeoJSON internally and converting incoming JSON arrays to GeoJSON—we align with geospatial standards and simplify integration with tools like Turf.js.

## What Changes
- Reverse the internal POI data structure from JSON arrays to GeoJSON FeatureCollections
- Update `normalize_pois.ts` to convert JSON array input to GeoJSON instead of converting GeoJSON to JSON arrays
- Support multiple coordinate formats in JSON arrays:
  - `lnglat: [lng, lat]`
  - Individual `lng`/`lat` properties
  - Individual `longitude`/`latitude` properties
- Update POI addition methods (`addPoi`, `addPoiLayer`) to work with GeoJSON Features
- Preserve backward compatibility with existing JSON array input format
- Add comprehensive tests for coordinate format conversion and round-trip consistency

## Impact
- **Affected specs**: New `pois` capability (core POI management)
- **Affected code**:
  - `src/normalize_pois.ts` - Data normalization logic (complete rewrite)
  - `src/source/mixin.ts` - POI addition methods (`addPoi`, `addPoiLayer`, `resolvePois`)
  - `src/index.ts` - Application-level POI management (`addMarker`, `addPoiLayer`, `redrawMarkers`)
- **Breaking changes**: None (internal representation change only; external API unchanged)
- **Tests**: New unit tests for format conversion, coordinate normalization, and round-trip consistency
