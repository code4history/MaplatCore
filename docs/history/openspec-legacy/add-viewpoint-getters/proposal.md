# Add getRotation / getDirection returning degrees to MaplatApp

## Goal
Give `MaplatApp` native getters for the current rotation and direction in **degrees**, matching the degree-based inputs it already accepts (`restore.position.rotation`, `direction`). (GitHub issue #61)

## Why
Consumers such as MaplatUI currently reach into internals (`app.mapObject.getView().getRotation()`, radians) and convert to degrees by hand. Input is degrees, output is radians from an internal object — an inconsistent and encapsulation-breaking interface.

## What Changes
- `MaplatApp.getRotation(): number` — wraps the OpenLayers view rotation, converts radian → degree, normalizes with `normalizeDegree` (same math `raiseChangeViewpoint` uses for its `rotation` payload).
- `MaplatApp.getDirection(): Promise<number>` — computes the real-world bearing via `from.viewpoint2MercsAsync()` → `mercSrc.mercs2ViewpointAsync()` and returns `normalizeDegree(viewpoint[2] * 180 / π)` (same math `raiseChangeViewpoint` uses for its `direction` payload).
- **Deviation from the issue text**: the issue sketches `getDirection(): number`, but on Maplat (TIN) sources the bearing computation is inherently asynchronous (`mercs2ViewpointAsync`), so the getter returns a `Promise<number>`. A synchronous value would require caching stale postrender data.

## Verification
- Unit test: with a mocked/NowMap view, `getRotation()` returns the normalized degree of the view rotation; `getDirection()` resolves to the same normalized degree the `changeViewpoint` event reports.
- Existing tests keep passing.
