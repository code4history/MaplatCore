# Tasks

## 1. Spec + API surface
- [ ] 1.1 Finalize `map-blend-control` spec deltas and validate with `openspec validate add-map-blend-control --strict`.
- [ ] 1.2 Document the public API contract for `setBlendRatio`, `getBlendRatio`, and the `blendchange` event.

## 2. Core implementation
- [ ] 2.1 Add blend ratio state + serialization to `MaplatApp` (default 1.0 for historical-only).
- [ ] 2.2 Update rendering pipeline to lerp between warped raster tiles and modern basemap using the new ratio.

## 3. Controller helper + tests
- [ ] 3.1 Implement the optional `MapBlendController` helper (pointer + keyboard input).
- [ ] 3.2 Add Vitest coverage for ratio clamping, serialization, and controller events.
- [ ] 3.3 Add a Playwright smoke test exercising the slider in an example page.

## 4. Docs and migration
- [ ] 4.1 Update README / docs with usage samples and mention backwards compatibility.
- [ ] 4.2 Note the new API in release notes / changelog.
