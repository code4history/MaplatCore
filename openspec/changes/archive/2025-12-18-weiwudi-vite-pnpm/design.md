# Design Decisions: UMD & Build Cleanup

## UMD Global Strategy
To support legacy usage via CDN (e.g., direct script tags), we output a **UMD** bundle.
- **Namespace**: `window.Maplat` is preserved for backward compatibility.
- **Direct Access**: `window.MaplatApp` (Constructor) and `window.assets` (Image assets) are explicitly attached.
- **Dependencies**: OpenLayers (`ol`) describes a rich namespace. We must map `ol/proj` -> `ol.proj` etc. in `rollupOptions.globals` so the UMD bundle works with the standard OpenLayers global distribution.

## Package Manager Migration
We standardize on **pnpm** for strict dependency management and speed. All legacy `yarn` or `npm` scripts are replaced or assumed run via `pnpm`.

## Linting Strategy for Assets
Files like `.jpg` or `.png` imported via Vite's `?url` or default import are now handled via `@ts-expect-error` or better, by relying on `vite/client` types. We explicitly removed `ts-ignore` to adhere to stricter linting rules.
