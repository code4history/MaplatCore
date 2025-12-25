## ADDED Requirements

### Requirement: GeoJSON Internal Representation
The system SHALL manage POI data internally using GeoJSON FeatureCollection format.

#### Scenario: POI layer stored as FeatureCollection
- **GIVEN** a POI layer is created
- **WHEN** the layer is stored internally
- **THEN** it MUST be represented as a GeoJSON FeatureCollection with `type`, `features`, and optional `properties` fields

#### Scenario: Individual POI stored as Feature
- **GIVEN** a single POI is added to a layer
- **WHEN** the POI is stored internally
- **THEN** it MUST be represented as a GeoJSON Feature with `type`, `geometry`, and `properties` fields

#### Scenario: Point geometry for coordinates
- **GIVEN** a POI has coordinates
- **WHEN** stored as GeoJSON
- **THEN** the geometry MUST be `{ type: "Point", coordinates: [longitude, latitude] }`

### Requirement: JSON Array to GeoJSON Conversion
The system SHALL convert JSON array POI inputs to GeoJSON FeatureCollection format.

#### Scenario: Array of JSON objects converted
- **GIVEN** POI data is provided as a JSON array `[{...}, {...}]`
- **WHEN** the data is normalized
- **THEN** it MUST be converted to a FeatureCollection with Features array

#### Scenario: Layer properties preserved
- **GIVEN** JSON array POI layer has metadata (name, id, etc.)
- **WHEN** converted to GeoJSON
- **THEN** layer metadata MUST be stored in FeatureCollection `properties` field

#### Scenario: POI properties mapped to Feature properties
- **GIVEN** a JSON POI object has properties like `name`, `description`, `image`
- **WHEN** converted to GeoJSON Feature
- **THEN** all properties (except coordinates and id) MUST be copied to Feature `properties` object

### Requirement: Multiple Coordinate Format Support
The system SHALL support multiple coordinate representations in JSON POI inputs.

#### Scenario: lnglat array format
- **GIVEN** a JSON POI with `lnglat: [139.691706, 35.689487]`
- **WHEN** converted to GeoJSON
- **THEN** coordinates MUST be extracted as `[139.691706, 35.689487]`

#### Scenario: lng/lat properties format
- **GIVEN** a JSON POI with `lng: 139.691706` and `lat: 35.689487`
- **WHEN** converted to GeoJSON
- **THEN** coordinates MUST be combined as `[139.691706, 35.689487]`

#### Scenario: longitude/latitude properties format
- **GIVEN** a JSON POI with `longitude: 139.691706` and `latitude: 35.689487`
- **WHEN** converted to GeoJSON
- **THEN** coordinates MUST be combined as `[139.691706, 35.689487]`

#### Scenario: Missing coordinates error
- **GIVEN** a JSON POI without any coordinate fields
- **WHEN** normalization is attempted
- **THEN** the system MUST throw an error indicating missing coordinates

### Requirement: GeoJSON Input Preservation
The system SHALL preserve GeoJSON FeatureCollection inputs without unnecessary conversion.

#### Scenario: Valid FeatureCollection passed through
- **GIVEN** POI data is provided as a valid GeoJSON FeatureCollection
- **WHEN** the data is normalized
- **THEN** it MUST be validated and stored with minimal transformation

#### Scenario: Feature properties preserved
- **GIVEN** a GeoJSON Feature has custom properties
- **WHEN** stored internally
- **THEN** all properties MUST be preserved exactly as provided

#### Scenario: Feature ID preserved
- **GIVEN** a GeoJSON Feature has an `id` field
- **WHEN** stored internally
- **THEN** the Feature `id` MUST be preserved

### Requirement: POI Addition with GeoJSON
The system SHALL support adding individual POIs as JSON objects or GeoJSON Features.

#### Scenario: Add JSON POI to GeoJSON layer
- **GIVEN** a POI layer exists as GeoJSON internally
- **WHEN** a new POI is added as a JSON object via `addPoi()`
- **THEN** the JSON object MUST be converted to a GeoJSON Feature and appended to the Features array

#### Scenario: Add GeoJSON Feature directly
- **GIVEN** a POI layer exists as GeoJSON internally
- **WHEN** a new POI is added as a GeoJSON Feature via `addPoi()`
- **THEN** the Feature MUST be validated and appended to the Features array

#### Scenario: Automatic ID assignment
- **GIVEN** a POI is added without an `id` field
- **WHEN** added to a layer
- **THEN** the system MUST automatically assign a unique ID in the format `{layerId}_{counter}`

### Requirement: Backward Compatibility
The system SHALL maintain full API compatibility with existing JSON array-based code.

#### Scenario: External APIs unchanged
- **GIVEN** external code calls `addMarker()`, `addPoiLayer()`, or `getMarker()`
- **WHEN** POI data is provided in legacy JSON array format
- **THEN** the methods MUST work identically to previous versions

#### Scenario: Property access patterns preserved
- **GIVEN** rendering code accesses POI properties like `poi.name`, `poi.lnglat`
- **WHEN** POIs are stored as GeoJSON internally
- **THEN** backward-compatible property access MUST be maintained (via Feature properties)

### Requirement: Test Coverage
The system SHALL have comprehensive tests for POI format conversion and GeoJSON management.

#### Scenario: Coordinate format conversion tests
- **GIVEN** test cases for all coordinate formats (`lnglat`, `lng/lat`, `longitude/latitude`)
- **WHEN** tests are executed
- **THEN** all formats MUST convert correctly to GeoJSON Point coordinates

#### Scenario: Round-trip conversion tests
- **GIVEN** JSON array POI data is converted to GeoJSON and back to renderable format
- **WHEN** tests verify data integrity
- **THEN** all properties and coordinates MUST be preserved accurately

#### Scenario: Edge case handling tests
- **GIVEN** test cases for missing coordinates, invalid GeoJSON, empty layers
- **WHEN** tests are executed
- **THEN** the system MUST handle errors gracefully with clear error messages

#### Scenario: Integration tests with real data
- **GIVEN** E2E tests with actual map data
- **WHEN** POIs are loaded and rendered
- **THEN** markers MUST appear correctly on the map with proper coordinates and properties
