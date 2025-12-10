# Tasks

## 1. Fixture visibility
- [x] 1.1 Update `test.html` styles so `#map_div` (and its container) reserves >=720px height even when controls expand.

## 2. Playwright helpers
- [x] 2.1 Enhance `resolveClientPoint` to recompute the canvas bounding box after ensuring the viewport has scrolled to the target region.
- [x] 2.2 Update `clickMapAtOffset` to call `window.scrollTo(0,0)`, `map_div.scrollIntoViewIfNeeded()` (or equivalent), and dispatch a DOM `MouseEvent('click')` fallback when the pointer would land outside the visible canvas.
- [x] 2.3 Apply the same viewport correction to `clickMarkerById`, or synthesize the DOM event using `lngLatToClientPoint` coordinates so marker clicks fire under headless Chromium.

## 3. Verification
- [x] 3.1 Run `pnpm test:e2e -- --project=chromium e2e/maplat-legacy.spec.ts` with DISPLAY available.
- [x] 3.2 Run the same command with DISPLAY disabled / headless to confirm parity.
- [x] 3.3 Run `pnpm test:e2e:ci -- --project=chromium e2e/maplat-legacy.spec.ts`.
- [x] 3.4 Confirm the browser console logs show three `####Message clickMap` entries (`mapID: morioka_ndl2`, `mapID: morioka_ndl2`, `mapID: morioka`) followed by `clickMarker`.
