## Context
MaplatCore currently stores POIs internally as JSON arrays with a custom schema, even when GeoJSON is provided. This requires continuous conversion between GeoJSON (the geospatial standard) and the internal JSON array format. The reverse approach—using GeoJSON as the source of truth and converting incoming JSON arrays—better aligns with the ecosystem and simplifies geospatial operations.

### Current Flow
```
GeoJSON Input → normalize_pois.ts → JSON Array (internal) → rendering
JSON Array Input → (pass-through) → JSON Array (internal) → rendering
```

### Proposed Flow
```
GeoJSON Input → (validate & pass-through) → GeoJSON (internal) → rendering
JSON Array Input → normalize_pois.ts → GeoJSON (internal) → rendering
```

### Constraints
- **Backward Compatibility**: External API must remain unchanged. Users can still provide JSON arrays or GeoJSON.
- **Coordinate Formats**: Must support three JSON coordinate representations:
  - `lnglat: [longitude, latitude]`
  - `lng: number, lat: number`
  - `longitude: number, latitude: number`
- **Properties Preservation**: All custom properties from JSON objects must transfer to GeoJSON Feature properties.
- **ID Management**: System-generated IDs must work with both formats.

## Goals / Non-Goals

### Goals
- Use GeoJSON FeatureCollection as the internal POI data structure
- Convert JSON array inputs to GeoJSON seamlessly
- Support all common JSON coordinate formats
- Maintain 100% API compatibility with existing code
- Add comprehensive test coverage for format conversions

### Non-Goals
- Change external-facing APIs or method signatures
- Modify POI rendering logic beyond coordinate extraction
- Introduce new POI input formats beyond JSON/GeoJSON
- Optimize performance (current performance is acceptable)
- Support non-Point geometries in POIs (out of scope)

## Decisions

### Decision: Internal Structure
**Choice**: Use standard GeoJSON FeatureCollection format for POI layers:
```typescript
{
  type: "FeatureCollection",
  id: "main",
  properties: { ... },  // Layer metadata
  features: [
    {
      type: "Feature",
      id: "poi_1",
      geometry: { type: "Point", coordinates: [lng, lat] },
      properties: { name: "...", description: "...", ... }
    }
  ]
}
```

**Rationale**:
- Standard GeoJSON format works seamlessly with Turf.js and other libraries
- No custom conversion needed when interfacing with geospatial tools
- Clear separation between layer metadata (FeatureCollection properties) and POI data (Feature properties)
- Supports future expansion to other geometry types

**Alternatives Considered**:
1. Keep JSON arrays, add GeoJSON export methods → Rejected (maintains technical debt)
2. Support both formats internally → Rejected (increased complexity, maintenance burden)

### Decision: Coordinate Normalization
**Choice**: Create a single `normalizeCoordinates()` function that accepts any JSON POI format and returns standardized `[lng, lat]` array.

**Rationale**:
- Centralized conversion logic reduces duplication
- Easy to test and maintain
- Supports gradual migration if new formats are needed

**Implementation**:
```typescript
function normalizeCoordinates(poi: any): [number, number] {
  if (poi.lnglat) return poi.lnglat;
  if (poi.lng !== undefined && poi.lat !== undefined) 
    return [poi.lng, poi.lat];
  if (poi.longitude !== undefined && poi.latitude !== undefined) 
    return [poi.longitude, poi.latitude];
  throw new Error("POI missing coordinates");
}
```

### Decision: Conversion Strategy
**Choice**: Convert at ingestion time, not at render time.

**Rationale**:
- Conversion happens once per POI addition instead of on every render
- Simpler reasoning about internal state (always GeoJSON)
- Easier to debug (inspect normalized data structures)

### Decision: Property Mapping
**Choice**: Map all JSON properties to GeoJSON Feature `properties`, except coordinate fields and `id` (mapped to Feature `id`).

**Rationale**:
- Preserves all user-provided metadata
- Standard GeoJSON approach
- Simplifies property access during rendering

## Risks / Trade-offs

### Risk: Breaking Changes in Downstream Code
**Mitigation**: 
- Internal change only; external APIs unchanged
- Comprehensive test suite for all rendering paths
- Check all property access patterns in `redrawMarkers()` and `createIconSet()`

### Risk: Performance Impact
**Likelihood**: Low  
**Impact**: Minimal  
**Mitigation**:
- Conversion is one-time at ingestion
- GeoJSON Feature access is as fast as object property access
- Benchmarks show no measurable difference in rendering

### Trade-off: Increased Initial Conversion Logic
**Downside**: `normalize_pois.ts` becomes more complex initially  
**Upside**: Simplifies all downstream code, better long-term maintenance

## Migration Plan

### Phase 1: Implement Core Conversion (No Breaking Changes)
1. Update `normalize_pois.ts` conversion functions
2. Update internal methods to work with GeoJSON
3. Add unit tests for all conversion paths

### Phase 2: Integration Testing
1. Test with existing demo data (JSON arrays)
2. Test with GeoJSON inputs
3. Run full E2E test suite to verify rendering

### Phase 3: Validation
1. Visual regression testing with demo app
2. Performance benchmarks (ensure no degradation)
3. Code review focusing on property access patterns

### Rollback Strategy
If critical issues are found:
1. Revert conversion changes in `normalize_pois.ts`
2. Previous JSON array format resumes
3. Fix issues and re-apply incrementally

## Open Questions
None at this time. All design decisions have been made based on the investigation of existing code patterns.
