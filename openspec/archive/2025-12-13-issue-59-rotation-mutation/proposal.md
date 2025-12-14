# Proposal: Fix `restore.position.rotation` Mutation in `MaplatApp`

## Goal
Prevent `MaplatApp` from mutating the `rotation` property within the passed `restore` object during initialization or `changeMap`.

## Problem
As reported in [Issue #59](https://github.com/code4history/MaplatCore/issues/59), passing a `restore.position` object results in properties like `rotation` and `direction` being mutated (converted to radians in-place) by `@maplat/core`.
Furthermore, the user reports that these values are sometimes **not applied** correctly.

## Proposed Solution
1.  **Stop Mutation**: In `src/source/mixin.ts`, `setViewpoint` must **clone** the input `cond` object before modifying it.
2.  **Ensure Application**: In `src/source/mixin.ts`, `setViewpointRadian` should respect `rotation` when calculating intermediate `mercs` coordinates if `direction` is not provided.
3.  **Verify Application**: Use `e2e/issue-59.spec.ts` for regression and `e2e/issue-59-visual.spec.ts` for visual confirmation.

## Proposed Changes

### Core Logic

#### [MODIFY] [src/source/mixin.ts](file:///c:/Users/kochi/github/MaplatCore/src/source/mixin.ts)
- In `setViewpoint(cond)`, create a shallow copy of `cond`.
- In `setViewpointRadian(cond)`, update `mercViewpoint2Mercs` call to use `direction` OR `rotation` OR current rotation, ensuring consistency.

### Tests

#### [NEW] [e2e/issue-59-visual.spec.ts](file:///c:/Users/kochi/github/MaplatCore/e2e/issue-59-visual.spec.ts)
- Test that applies `restore` object to existing `MaplatApp` using `changeMap`.
- Uses valid `morioka_ndl2` map data and coordinates.
- Verifies rotation (45 deg) is visually applied and view state matches.

## Verification Plan
- **Automated Test**: Run `pnpm test:e2e e2e/issue-59.spec.ts` to confirm the fix and prevent regression.
