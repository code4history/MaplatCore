# Asset Exports

## Added Requirements

### Public Asset Access
#### Scenario: Consuming Application using Default Icons
- **Given** a consuming application importing `MaplatCore`
- **When** it accesses the exported `assets` namespace (or named exports)
- **Then** it should be able to retrieve URLs/Base64 strings for default assets
- **And** this should include `redcircle`, `defaultpin`, `defaultpin_selected`, `bluedot`, `bluedot_small`, `bluedot_transparent`
- **And** this should include default base map thumbnails `osm`, `gsi`, `gsi_ortho`
