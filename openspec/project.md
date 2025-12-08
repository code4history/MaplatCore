# Project Context

## Purpose
MaplatCore delivers the Maplat Historical/Illustrated Map Viewer SDK. The library warps non-linear but homeomorphic maps into GPS-accurate coordinates so custom map scans, POIs, and overlays can collaborate with modern basemaps without visually distorting the originals. The goal is to provide a browser-first toolkit for embedding these maps inside web apps, demos, and digital storytelling experiences.

## Tech Stack
- **Language**: TypeScript + ES modules
- **Build**: Vite (migrated from Webpack)
- **Package Manager**: pnpm
- **Testing**: Vitest (Unit) + Playwright (E2E)
- **Styling**: Less + Vanilla CSS
- **Core Libraries**: Turf.js (geospatial math), @maplat/transform (coordinate transformation)
- **Peer Dependencies**: OpenLayers (primary), Mapbox GL JS / MapLibre GL JS (supported but legacy/optional)

## Project Conventions

### Code Style
Follow ESLint (`@typescript-eslint`) with Prettier enforcing semicolons, double quotes, 80-character lines, and spaces over tabs. Prefer `const` + arrow functions, avoid `var`, and keep explicit types on all public APIs so generated `.d.ts` stay stable. File naming: kebab-case for utilities under `src/`, PascalCase for demo UI in `apps/`, and never edit built artifacts under `dist/`.

### Architecture Patterns
`src/` houses all runtime logic: projection math, POI managers, render adapters, and utilities. Rendering demos or manual QA assets live under `apps/`/`public/`, while legacy conversion helpers are isolated in `parts/` + `parts_test/`. Shared styles live in `less/` and build/release helpers stay inside `scripts/`. Keep features small (<100 LOC when possible) and favor composable modules over large frameworks.

### Testing Strategy
- **Unit Tests**: Vitest (`pnpm test`). Focus on logic and math.
- **E2E Tests**: Playwright (`pnpm test:e2e`). Uses `e2e/test.html` to test library API in isolation without async loading complexity of production `index.html`.
- **Headless Mode**: Runs automatically in CI or when DISPLAY is unset.
- **Coverage**: Aim for 90%+ for projection math.

### Git Workflow
Use Conventional Commits (`fix:`, `feat:`, `chore:`, etc.) and keep each commit focused on a single logical change plus tests. Branches typically track one feature or fix and land via PRs. Run lint, typecheck, unit, and Playwright suites before requesting review.

## Domain Context
Historical and illustrated maps rarely align with modern coordinate grids, so MaplatCore applies custom transformation meshes (powered by `@maplat/transform`, Turf, Delaunator, etc.) to align map scans with GPS traces. The SDK exposes APIs for POI layers, marker interactivity, line overlays, multilingual content, and map-specific assets so curators can build guided tours or cultural heritage apps.

## Important Constraints
- **Backward Compatibility**: Existing APIs must not change. Breaking changes are generally not allowed.
- **Browser-Only Runtime**: Server-side usage (Node.js/Deno) is NOT supported. Build artifacts must work in browsers.
- **No Credentials in Repo**: Never commit provider tokens (Mapbox/MapLibre). Load from `.env.local`.
- **Generated Artifacts**: `dist/` outputs are generated and must not be edited manually.
- **Peer Compatibility**: Maintain compatibility with Mapbox GL 1-3, MapLibre GL 3-4, OpenLayers 9+.

## Known Issues / Constraints
- **Type Definitions**: MaplatCore extends `@maplat/transform` types with custom properties (`xyBounds`, `priority`, etc.) in `src/types/@maplat/transform.d.ts`. This poses a risk of conflict if the upstream library changes. Future refactoring should consider a wrapper class or upstream contribution.

## External Dependencies
- **OpenLayers**: Primary rendering engine (Peer Dependency).
- **Mapbox GL JS / MapLibre GL JS**: Optional rendering engines (Peer Dependency). Mapbox requires a token.
- **Turf.js**: Geometry operations.
- **@maplat/transform**: Coordinate transformation logic.
- **Weiwudi**: Tile cache library (not for coordinate transformation).
- **i18next**: Localization.
