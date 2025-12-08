# Project Context

## Purpose
MaplatCore delivers the Maplat Historical/Illustrated Map Viewer SDK. The library warps non-linear but homeomorphic maps into GPS-accurate coordinates so custom map scans, POIs, and overlays can collaborate with modern basemaps without visually distorting the originals. The goal is to provide a browser-first toolkit for embedding these maps inside web apps, demos, and digital storytelling experiences.

## Tech Stack
- TypeScript + ES modules compiled with Vite
- pnpm for dependency + script orchestration
- Turf.js family for geospatial math and polygon operations
- Mapbox GL JS, MapLibre GL JS, and OpenLayers as peer rendering engines
- Less for shared styling plus DOM utilities
- Vitest + Playwright for unit and e2e coverage

## Project Conventions

### Code Style
Follow ESLint (`@typescript-eslint`) with Prettier enforcing semicolons, double quotes, 80-character lines, and spaces over tabs. Prefer `const` + arrow functions, avoid `var`, and keep explicit types on all public APIs so generated `.d.ts` stay stable. File naming: kebab-case for utilities under `src/`, PascalCase for demo UI in `apps/`, and never edit built artifacts under `dist/`.

### Architecture Patterns
`src/` houses all runtime logic: projection math, POI managers, render adapters, and utilities. Rendering demos or manual QA assets live under `apps/`/`public/`, while legacy conversion helpers are isolated in `parts/` + `parts_test/`. Shared styles live in `less/` and build/release helpers stay inside `scripts/`. Keep features small (<100 LOC when possible) and favor composable modules over large frameworks.

### Testing Strategy
Vitest is the default harness (`pnpm test`, `pnpm test:watch`) with coverage runs via `pnpm coverage` and a 90%+ expectation for projection math. Browser automation (Playwright) exercises integration flows (`pnpm test:e2e`, `pnpm test:e2e:ci`). Store temporary artifacts in `test-results/` during debugging but do not commit them.

### Git Workflow
Use Conventional Commits (`fix:`, `feat:`, `chore:`, etc.) and keep each commit focused on a single logical change plus tests. Branches typically track one feature or fix and land via PRs that explain motivation, list verification commands, and attach screenshots or video when UI behavior changes. Run lint, typecheck, unit, and Playwright suites before requesting review.

## Domain Context
Historical and illustrated maps rarely align with modern coordinate grids, so MaplatCore applies custom transformation meshes (powered by `@maplat/transform`, Turf, Delaunator, etc.) to align map scans with GPS traces. The SDK exposes APIs for POI layers, marker interactivity, line overlays, multilingual content, and map-specific assets so curators can build guided tours or cultural heritage apps.

## Important Constraints
- Browser-only runtime; server-side usage is unsupported.
- Never commit provider tokens (Mapbox/MapLibre) or other credentials; load them from `.env.local` via `import.meta.env`.
- `dist/` outputs are generated and must not be edited manually.
- Maintain compatibility with supported peer versions (Mapbox GL 1-3, MapLibre GL 3-4, OpenLayers 9+) and keep projection coverage high to avoid regressions.
- Keep dependencies audited before running publish scripts.

## External Dependencies
- Mapbox GL JS (requires user-supplied token when used)
- MapLibre GL JS (open-source default renderer) and OpenLayers for alternative basemaps
- Turf.js suite for geometry operations, Delaunator for triangulation, Simplify.js/Polygon Offset for shape tuning
- i18next + browser language detection for localization

