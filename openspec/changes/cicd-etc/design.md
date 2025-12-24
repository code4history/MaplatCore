# Design: CI/CD and Project Structure

## Architecture Changes
No core architectural changes. The primary adjustments are in build configuration and CI/CD pipelines.

## Dependency Management
Transition from granular `@turf/*` packages to the aggregated `@turf/turf` package.
*   **Reasoning**: Reduces `package.json` noise and simplifies version management.
*   **Impact**: Requires refactoring imports in `src/`.

## Build & Deployment Strategy
*   **Package Build** (`npm run build`):
    *   Mode: `package`
    *   Output: `dist/`
    *   Content: `maplat_core.js`, `maplat_core.umd.js`, `.d.ts` files, styles.
    *   Excluded: `index.html`, demo assets.
*   **Demo Build** (`npm run build:demo`):
    *   Mode: `demo` (default)
    *   Output: `dist-demo/`
    *   Content: Full web app with `index.html`.
*   **Deployment**:
    *   Source: `dist-demo/`
    *   Target: `gh-pages` branch
    *   Trigger: Push to `master`

## CI Workflow
*   **Test**: Runs on all branches.
    *   Lint, Typecheck, Unit Test, Build (Package).
    *   Matrix: Node 20, 22.
*   **Deploy**: Runs on `master` only.
    *   Build (Demo).
    *   Deploy to GH Pages.
