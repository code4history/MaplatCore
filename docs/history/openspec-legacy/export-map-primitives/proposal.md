# Export MaplatMap and mapSourceFactory from the main entry point

## Goal
Expose `MaplatMap` and `mapSourceFactory` as named exports of the package entry point so consumers can use them without deep imports. (GitHub issue #71)

## Why
MaplatEditor needs to instantiate `MaplatMap` and call `mapSourceFactory` directly to handle custom map projections and source management. Today these live only in `src/map_ex.ts` / `src/source_ex.ts`, forcing deep imports (`@maplat/core/src/...`) that break against the published `dist` bundles and pin consumers to internal file layout.

## What Changes
- `src/index.ts` re-exports `MaplatMap` (already imported from `./map_ex`) and `mapSourceFactory` (already imported from `./source_ex`).
- The `MaplatSource` / `BackmapSource` types are re-exported alongside so `mapSourceFactory`'s return value is typeable by consumers.
- No behavioral change; additive API surface only.

## Verification
- Build the package and assert both symbols are present in the ESM and UMD bundles' export table.
- Existing tests keep passing.
