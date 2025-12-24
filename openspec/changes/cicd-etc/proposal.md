# Proposal: CI/CD and Project Structure Standardization

## Why
MaplatCore currently lacks enforcement of package manager versions, has a cluttered build output structure, uses redundant Turf.js dependencies, and misses a consistent deployment workflow. Standardizing these aspects will improve maintainability, reduce CI flakes, and ensure clean release artifacts.

## What Changes
1.  **Project Structure**:
    *   Enforce `pnpm` usage via `package.json` engines and `.npmrc`.
    *   Separate build outputs: `dist/` for package (clean lib) and `dist-demo/` for demo assets (including `index.html`).
    *   Fix dev server access (force port 5173).

2.  **Dependencies**:
    *   Replace individual `@turf/*` packages with the single `@turf/turf` package to simplify dependency management and imports.

3.  **CI/CD**:
    *   Update `test.yml` to run on all commits, use Node 20/22, and strictly enforce pnpm usage.
    *   Create `deploy.yml` to deploy the demo build (`dist-demo/`) to GitHub Pages only on `master` push.

## Risks
*   **Breaking Changes**: Converting Turf imports might break if not all sub-packages are exported by `@turf/turf` (unlikely for standard modules).
*   **Build Paths**: Downstream consumers relying on `dist/` containing demo assets (if any) will need to update to `dist-demo/` or stick to `dist/` for library code as intended.
