# ci Specification

## Purpose
TBD - created by archiving change weiwudi-vite-pnpm. Update Purpose after archive.
## Requirements
### Requirement: E2E Locator Strategy
E2E tests MUST be robust against internal implementation details like multiple rendering layers.

#### Scenario: Multiple Canvas Handling
- Given Maplat renders multiple `<canvas>` elements (e.g., front/back buffers)
- When strict mode E2E tests run
- Then assertions on `page.locator('canvas')` should target a specific canvas (e.g., `.first()`) to avoid violations

### Requirement: Linting Reliability
Linting MUST pass in CI without manual suppression of valid code.

#### Scenario: Asset Import Linting
- Given `src/assets.ts` imports images
- When `pnpm run lint` is executed
- Then it should pass without needing `@ts-ignore` comments

