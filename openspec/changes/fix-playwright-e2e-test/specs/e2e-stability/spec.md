## MODIFIED Requirements
### Requirement: Legacy E2E viewport stays visible
The legacy Playwright regression flow MUST guarantee the map canvas remains at least 720px tall so markers and map interactions stay inside the viewport in both headed and headless runs.

#### Scenario: Fixture enforces minimum height
- **GIVEN** the legacy `test.html` harness is loaded in headless Chromium
- **WHEN** the page layout is computed
- **THEN** `#map_div` and its parent container reserve >=720px height so the warped map canvas is inside the viewport without manual scrolling.

### Requirement: Headless clicks reach markers
The `resolveClientPoint` and `clickMapAtOffset` helpers MUST scroll the viewport to the map canvas, recompute the bounding box, and synthesize a DOM `MouseEvent` when Playwright cursor clicks cannot reach the element directly, ensuring `clickMarker` fires after switching to the Morioka map.

#### Scenario: Scroll + synthetic click unblocks headless run
- **GIVEN** the legacy test switches to `mapID: morioka`
- **WHEN** `clickMapAtOffset` runs in a headless browser
- **THEN** it scrolls `window` to the top, calls `map_div.scrollIntoViewIfNeeded()` (or equivalent), recalculates the canvas box, and dispatches a DOM click so the log progresses past `####Message clickMap` and the test observes `clickMarker`.

### Requirement: Marker helper respects viewport constraints
`clickMarkerById` MUST either apply the same viewport correction logic as map clicks or dispatch a DOM click using coordinates returned from `lngLatToClientPoint`, so marker selections work with and without DISPLAY access.

#### Scenario: Marker click fires after viewport correction
- **GIVEN** `clickMarkerById('main_1')` runs in headless Chromium
- **WHEN** the helper scrolls the viewport or uses `lngLatToClientPoint` to create a DOM `MouseEvent`
- **THEN** `####Message clickMarker` logs after the third click (mapID `morioka`) even when the canvas initially sits offscreen.

### Requirement: Acceptance runs cover headed + headless Chromium
The legacy regression spec MUST pass via `pnpm test:e2e -- --project=chromium e2e/maplat-legacy.spec.ts` (both with and without DISPLAY) and `pnpm test:e2e:ci -- --project=chromium e2e/maplat-legacy.spec.ts`, with console logs showing `####Message clickMap` for `mapID: morioka_ndl2`, `mapID: morioka_ndl2`, `mapID: morioka`, followed by `clickMarker`.

#### Scenario: CI logs validate click sequence
- **GIVEN** the updated helpers and fixture are in place
- **WHEN** the above commands run
- **THEN** all tests PASS and the console output records the three expected `clickMap` messages (two for `morioka_ndl2`, one for `morioka`) and a trailing `clickMarker`.
