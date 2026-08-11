# consumption Specification

## Purpose
TBD - created by archiving change weiwudi-vite-pnpm. Update Purpose after archive.
## Requirements
### Requirement: UMD Global Access
The UMD bundle SHALL allow direct global access to critical classes.

#### Scenario: UMD Global Access
- Given I load `maplat_core.umd.js` via a script tag
- When I inspect `window.MaplatApp`
- Then it should be a constructor function
- And `window.assets` should be an object containing image paths

### Requirement: External Dependency Mapping
The UMD bundle SHALL map external dependencies correctly.

#### Scenario: OpenLayers Dependency Mapping
- Given I load `maplat_core.umd.js`
- And `ol` is loaded globally
- When `MaplatApp` initializes
- Then it should correctly access `ol.source.XYZ` without "property of undefined" errors

### Requirement: ESM CDN Consumption
ESM consumption SHALL work seamlessly with Import Maps.

#### Scenario: ESM CDN Usage
- Given an HTML file with an import map resolving `ol`
- When I import `MaplatApp` from `maplat_core.js`
- Then I should be able to instantiate it successfully

