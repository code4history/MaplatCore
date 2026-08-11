# Change: Migrate to pnpm and Cleanup Vite Build

## Why
The current build system suffers from legacy technical debt (CommonJS artifacts, Webpack remnants) and critical consumption issues (broken UMD globals, ESM errors), which cause developer friction and CI failures (Issues #60, #62, #64, #65).

## What Changes
- Remove legacy CommonJS builds (`maplat_core.cjs`) and scripts.
- Enforce **pnpm** as the sole package manager.
- Fix **UMD** build to correctly export `MaplatApp` and `assets` to `window`, mapping `ol` dependencies explicitly.
- Fix **Lint** errors in asset imports (`src/assets.ts`) by removing unnecessary suppressions.
- Update **E2E** tests to handle multiple canvas elements strictly.

## Impact
- Affected specs: `build`, `consumption`, `ci`
- Affected code: `vite.config.ts`, `package.json`, `src/index.ts`, `src/assets.ts`, `e2e/consumption.spec.ts`
