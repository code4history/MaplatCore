# Tasks

## 1. Fixture visibility
- [ ] 1.1 Update `test.html` styles so `#map_div` (and its container) reserves >=720px height even when controls expand.

## 2. Playwright helpers
- [ ] 2.1 Enhance `resolveClientPoint` to recompute the canvas bounding box after ensuring the viewport has scrolled to the target region.
- [ ] 2.2 Update `clickMapAtOffset` to call `window.scrollTo(0,0)`, `map_div.scrollIntoViewIfNeeded()` (or equivalent), and dispatch a DOM `MouseEvent('click')` fallback when the pointer would land outside the visible canvas.
- [ ] 2.3 Apply the same viewport correction to `clickMarkerById`, or synthesize the DOM event using `lngLatToClientPoint` coordinates so marker clicks fire under headless Chromium.

## 3. Verification
- [ ] 3.1 Run `pnpm test:e2e -- --project=chromium e2e/maplat-legacy.spec.ts` with DISPLAY available.
- [ ] 3.2 Run the same command with DISPLAY disabled / headless to confirm parity.
- [ ] 3.3 Run `pnpm test:e2e:ci -- --project=chromium e2e/maplat-legacy.spec.ts`.
- [ ] 3.4 Confirm the browser console logs show three `####Message clickMap` entries (`mapID: morioka_ndl2`, `mapID: morioka_ndl2`, `mapID: morioka`) followed by `clickMarker`.
