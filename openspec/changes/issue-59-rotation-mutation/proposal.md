# Proposal: Fix `restore.position.rotation` Mutation in `MaplatApp`

## Goal
Prevent `MaplatApp` from mutating the `rotation` property within the passed `restore` object during initialization or `changeMap`.

## Problem
As reported in [Issue #59](https://github.com/code4history/MaplatCore/issues/59), passing a `restore.position` object results in properties like `rotation` and `direction` being mutated (converted to radians in-place) by `@maplat/core`.
Furthermore, the user reports that these values are sometimes **not applied** correctly, likely due to this mutation causing the value to be interpreted incorrectly if read back (e.g., radians read as degrees) or due to state synchronization issues.

This affects `rotation`, `direction`, and potentially other parameters.

## Proposed Solution
1.  **Stop Mutation**: In `src/source/mixin.ts`, `setViewpoint` must **clone** the input `cond` object before modifying it (converting degrees to radians).
2.  **Verify Application**: Ensure that `rotation`, `direction`, `zoom`, and `transparency` are explicitly applied to the map.

## Proposed Changes

### Core Logic

#### [MODIFY] [src/source/mixin.ts](file:///c:/Users/kochi/github/MaplatCore/src/source/mixin.ts)
- In `setViewpoint(cond)`, create a shallow copy of `cond` (e.g., `const args = { ...cond };`).
- Perform degree-to-radian conversion on the copy (`args`).
- Pass the copy to `setViewpointRadian(args)`.

### Tests

#### [NEW] [e2e/issue-59.spec.ts](file:///c:/Users/kochi/github/MaplatCore/e2e/issue-59.spec.ts)
- Create a regression test that:
    1.  Defines a `restore` object with specific `rotation`, `direction`, `zoom`, `center` (x, y), and `transparency`.
    2.  Initializes `MaplatApp` with this object.
    3.  Asserts that **none** of the input properties (`rotation`, `direction`, etc.) are mutated.
    4.  Asserts that the map's state (View rotation, center, zoom, transparency) **matches** the input values.

## Verification Plan
- **Automated Test**: Run `pnpm test:e2e e2e/issue-59.spec.ts` to confirm the fix and prevent regression.
