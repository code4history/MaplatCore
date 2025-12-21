# Issue #66: Unify Vite & ESLint + Dependency Cleanup

## Goal
Resolve Issue #66 ("Unify Vite & ESLint code") and remove deprecated/unmaintained dependencies to modernize the codebase and improve maintainability.

## Requirements

### 1. Unify Vite & ESLint (Issue #66)
- **Vite/Vitest**: detailed in Issue #66.
    - Confirm `vite` is `^6.x` (LTS).
    - Confirm `vitest` is `^3.x`.
- **ESLint**:
    - Migrate to **Flat Config** (`eslint.config.js`).
    - Remove legacy config (`.eslintrc`, etc.) if present.
    - Ensure `typescript-eslint` is updated and configured correctly for Flat Config.

### 2. Dependency Cleanup (User Request)
- **Remove `argv`**:
    - It is unused in production code. Scripts use native `process.argv` logic.
    - Action: Uninstall `argv`.
- **Replace `i18next-xhr-backend`**:
    - Deprecated.
    - Action: Replace with `i18next-http-backend`.
    - Update `src/index.ts` usage.
- **Note on `lodash.template`**:
    - Retained for now. Future migration to `Quyuan` (and potentially `eta`) is deferred.

## Design

### ESLint Flat Config
- Create `eslint.config.js`.
- Use `typescript-eslint`'s recommended flat config helpers.
- Import `eslint/js`, `typescript-eslint`, `eslint-config-prettier`.

## Verification
- **Build**: Ensure `npm run build` passes.
- **Lint**: Ensure `npm run lint` passes with new config.
- **Tests**: Ensure `npm run test` (Vitest) passes.
- **Manual**: Verify map markers (which use templates) render correctly in the browser.
