# Spec: Dependency Standardization

## MODIFIED Requirements

#### Requirement: Turf.js Consolidation
The project **MUST** use the single `@turf/turf` package instead of individual modules.
- **Scenario:** Source files **MUST** import from `@turf/turf` (e.g., `import { point } from "@turf/turf"`).
- **Scenario:** `package.json` **MUST NOT** list individual `@turf/*` dependencies (except potentially `@turf/turf` itself).
