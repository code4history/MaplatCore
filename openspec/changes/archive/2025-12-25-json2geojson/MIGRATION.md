# JSON to GeoJSON Migration Notes

## Overview
MaplatCore has migrated POI (Points of Interest) internal data structure from custom JSON arrays to standard GeoJSON FeatureCollections. This is an **internal change only** - external APIs remain unchanged and backward compatible.

## What Changed

### Internal Data Structure
**Before:**
```typescript
{
  "main": {
    "id": "main",
    "pois": [
      {
        "id": "poi1",
        "name": "Sample POI",
        "lnglat": [139.5, 35.6]
      }
    ]
  }
}
```

**After (GeoJSON):**
```typescript
{
  "main": {
    "type": "FeatureCollection",
    "id": "main",
    "features": [
      {
        "type": "Feature",
        "id": "poi1",
        "geometry": {
          "type": "Point",
          "coordinates": [139.5, 35.6]
        },
        "properties": {
          "name": "Sample POI"
        }
      }
    ]
  }
}
```

## What Stayed the Same

### External APIs (100% Backward Compatible)
All public APIs accept the same input formats as before:

1. **JSON Array Input** - Still supported, automatically converted to GeoJSON internally
2. **GeoJSON Input** - Still supported, now stored directly without conversion
3. **Multiple Coordinate Formats** - All existing formats work:
   - `lnglat: [lng, lat]`
   - `lng: number, lat: number`
   - `longitude: number, latitude: number`

### Example - No Code Changes Needed
```typescript
// This code works exactly as before
map.addMarker({
  name: "My POI",
  latitude: 35.6,
  longitude: 139.5
}, "main");

// GeoJSON input also works
map.addMarker({
  type: "Feature",
  geometry: { type: "Point", coordinates: [139.5, 35.6] },
  properties: { name: "My POI" }
}, "main");
```

## Benefits

1. **Standards Compliance**: Uses standard GeoJSON format internally
2. **Better Tooling**: Seamless integration with Turf.js and other geospatial libraries
3. **Type Safety**: Improved TypeScript type definitions
4. **Future-Proof**: Easier to extend with additional geometry types

## For Library Users

### No Changes Required
If you're using MaplatCore's public APIs (`addMarker`, `addPoiLayer`, etc.), no code changes are needed. The migration is transparent.

### If You Access Internal POI Data
If your code directly accesses internal POI structures (not recommended), you'll need to update:

**Before:**
```typescript
const pois = source.pois["main"].pois; // Array of POI objects
pois.forEach(poi => {
  console.log(poi.lnglat); // [lng, lat]
});
```

**After:**
```typescript
const features = source.pois["main"].features; // Array of GeoJSON Features
features.forEach(feature => {
  console.log(feature.geometry.coordinates); // [lng, lat]
  console.log(feature.properties.name); // Access properties
});
```

## Type Definitions

New TypeScript interfaces are exported:

```typescript
import type { 
  JSONPoi,           // Input POI with various coordinate formats
  JSONLayer,         // Input layer (array or FeatureCollection)
  POILayer,          // Internal GeoJSON FeatureCollection
  NormalizeOptions,  // Options for normalization
  LayersCollection   // Collection of POI layers
} from "@maplat/core";
```

## Testing

All existing tests have been updated and new tests added:
- ✅ Coordinate format conversion (`lnglat`, `lng/lat`, `longitude/latitude`)
- ✅ JSON array to GeoJSON conversion
- ✅ GeoJSON input pass-through
- ✅ Layer-level conversions
- ✅ POI addition/removal operations

## Questions or Issues?

If you encounter any issues after this migration, please file an issue at:
https://github.com/code4history/MaplatCore/issues
