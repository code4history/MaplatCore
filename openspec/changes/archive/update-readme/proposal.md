# Proposal: Update README and Create Japanese Documentation

## Goal
Update `README.md` to reflect the current state of the project (removal of Deno, updated installation methods) and create a Japanese version `README.ja.md`.

## Problem
- `README.md` contains obsolete information about Deno support.
- Installation instructions reference deleted zip files (`distribution.zip`).
- OpenLayers support is missing from the documentation.
- There is no Japanese documentation.

## Proposed Solution
1.  **Update `README.md`**:
    - Remove Deno section.
    - Update installation instructions to focus on `npm` and building from source.
    - Add OpenLayers to Peer Dependencies section.
    - Verify and update usage examples.
2.  **Create `README.ja.md`**:
    - Translate the updated `README.md` into Japanese.

## Proposed Changes

### Documentation

#### [MODIFY] [README.md](file:///c:/Users/kochi/github/MaplatCore/README.md)
- Remove Deno section.
- Remove references to `distribution.zip`.
- **External Dependencies**: Explicitly state that Mapbox GL JS, MapLibre GL JS, and OpenLayers are external dependencies and must be provided by the user.
- **Usage Scenarios**:
    - **Browser (ES Modules)**: Document how to use directly in the browser using `<script type="module">` and CDNs.
        - Import `MaplatApp`.
        - Pass `mapboxgl`, `maplibregl` in the `option` object to `MaplatApp.createObject(option)`.
    - **Bundler (Vite/Webpack + TypeScript)**: Document installation via `npm`.
        - Import `MaplatApp` from `@maplat/core`.
        - Import dependencies (`mapbox-gl`, `maplibre-gl`, `ol`).
        - Pass them in the `option` object to `MaplatApp.createObject(option)`.

#### [NEW] [README.ja.md](file:///c:/Users/kochi/github/MaplatCore/README.ja.md)
- Japanese translation of the updated `README.md`.

## Verification Plan
- **Manual Review**: Verify the rendered Markdown content for correctness and formatting.
- **Link Check**: Ensure all links in the new READMEs are valid.
