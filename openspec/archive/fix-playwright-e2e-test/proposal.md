# Fix Playwright legacy workflow clicks

## Why
- Legacy regression flow fails headlessly after switching to the `morioka` map because the canvas scrolls out of view; the test logs stop at `clickMap` and never emit `clickMarker`, blocking CI validation.
- Recent debugging shows the first two clicks (mapID `morioka_ndl2`) are stable, but the third click only succeeds when the browser window is visible or when we manually scroll the viewport and call `scrollIntoViewIfNeeded` before interacting.

## What Changes
- Update `test.html` styles so the Maplat container always reserves at least 720px of height, preventing controls from collapsing the canvas when run headlessly.
- Teach `resolveClientPoint` and `clickMapAtOffset` helpers in `e2e/maplat-legacy.spec.ts` to ensure the canvas is scrolled into view, recompute the bounding box, and dispatch a DOM `MouseEvent("click")` when Playwright cursor clicks would miss due to offscreen positioning.
- Update `clickMarkerById` to apply the same viewport correction or synthesize the click using `lngLatToClientPoint` coordinates, ensuring marker selection works in headless Chromium.
- Bake acceptance runs into the plan: `pnpm test:e2e -- --project=chromium e2e/maplat-legacy.spec.ts` (headed + headless), `pnpm test:e2e:ci -- --project=chromium e2e/maplat-legacy.spec.ts`, and verify all three `####Message clickMap` entries emit `mapID` values `morioka_ndl2`, `morioka_ndl2`, `morioka`.

## Impact
- Test-only change; no production bundles touched.
- Stabilizes CI by guaranteeing the legacy Playwright flow passes in headless Chromium.
- Slightly longer helper logic, but isolated to the spec.

## Open Questions
- None; implementation details are constrained to the described helper updates.
