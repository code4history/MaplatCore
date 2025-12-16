# Module Support

## Modified Requirements

### Build Output
#### Scenario: CommonJS Removal
- **Given** the build configuration
- **When** the build is run
- **Then** it should ONLY generate `es` (ESM) and `umd` (Universal) formats
- **And** it should NOT generate `cjs` (CommonJS) format
- **And** `package.json` should NOT expose a `require` entry point

### Consumption Verification
#### Scenario: ESM with Import Map
- **Given** an HTML file using `<script type="module">`
- **And** an Import Map resolving `ol` to a CDN
- **When** `MaplatApp` is imported from the ESM build
- **Then** the map should initialize correctly without errors

#### Scenario: UMD Global
- **Given** an HTML file importing OpenLayers globally
- **And** a script tag loading the UMD build
- **Then** `MaplatApp` should be available on the global scope (or via `window.MaplatApp`)
- **And** the map should initialize correctly
