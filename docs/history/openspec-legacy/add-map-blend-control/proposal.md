# Add Map Blend Control

## Why
- Creators currently lack a first-class way to fade between warped historical tiles and the live basemap; bespoke CSS hacks introduce inconsistent warping and cannot be synchronized with the projection engine.
- Tours and story maps need a guided way to expose an ``old vs new`` comparison, especially on mobile where UI chrome must stay minimal.

## What Changes
- Expose a `setBlendRatio` / `getBlendRatio` API on `MaplatApp` plus a `blendchange` event so apps can programmatically fade between the historical tile and vector basemap.
- Ship a lightweight `MapBlendController` helper that wires keyboard, pointer, and touch input into the new API and keeps UI state in sync with POI highlighting.
- Persist blend ratio inside map state serialization so share links and session restores replay the same comparison view.

## Impact
- Requires new unit coverage for projection alpha lerp plus Playwright smoke to confirm pointer/touch input moves the slider and updates the canvas.
- Adds documentation section in README / docs plus migration notes so integrators know fade defaults to 100% historical map for backwards compatibility.
- Slight increase in bundle size (<2 KB minified) from controller helper and state serialization fields.

## Open Questions
- Should the controller expose a built-in DOM skin, or remain headless with just events and CSS hooks? (default assumption: headless with default styles opt-in).
