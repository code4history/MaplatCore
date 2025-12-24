# Tasks

1.  [x] **Project Structure Enforcements**
    *   [x] Add `.npmrc` with `engine-strict=true`.
    *   [x] Update `package.json` with `engines.pnpm` constraint.
    *   [x] Validate: Run `pnpm install` and check for warnings/errors if constraints met.

2.  [x] **Build Configuration Updates**
    *   [x] Modify `vite.config.ts` to support split output (`dist` vs `dist-demo`).
    *   [x] Add `build:demo` script to `package.json`.
    *   [x] Validate: Run both build commands and check output directories.

3.  [x] **Turf.js Refactoring**
    *   [x] Uninstall specific `@turf/*` packages.
    *   [x] Install `@turf/turf`.
    *   [x] Update source imports in `src/**/*.ts`.
    *   [x] Validate: Run tests and `pnpm lint`.

4.  [x] **CI/CD Workflows**
    *   [x] Update `.github/workflows/test.yml` (Node versions, pnpm version).
    *   [x] Create `.github/workflows/deploy.yml` for GH Pages.
    *   [x] Validate: Simulate workflow execution locally or review yaml structure.
