# Consumption Methods Analysis & Verification Plan

## Goal
Verify that MaplatCore supports various consumption methods (ESM, UMD, Node, CDN, Self-hosted) and ensure assets load correctly. Implement tests to prevent regression.

## Analysis of Current State
- **Build Output**: Generates `es` (ESM), `cjs` (CommonJS), and `umd` (Universal).
- **Dependencies**: `ol` (OpenLayers) is externalized.
    - **ESM**: Imports `ol` using bare specifiers (e.g., `import ... from "ol/proj"`). This requires a bundler or an Import Map in the browser.
    - **UMD**: Expects `ol` to be available globally (or via AMD/CommonJS).
- **Assets**: 
    - CSS is extracted to `maplat_core.css`.
    - Images: Need to verify if they are inlined or referenced by URL. (Pending grep result).

## Proposed Changes / Verification Steps

We will create a set of "smoke test" HTML files in a `tests/consumption` directory (or similar) to simulate each scenario.

### Scenarios to Verify

1.  **Scenario A: Browser + ESM + CDN (with Import Map)**
    - Browser ESM native usage.
    - Requires an `<script type="importmap">` to resolve `ol`.
    - **Risks**: Bare imports without import map will fail.

2.  **Scenario B: Browser + UMD + CDN**
    - Traditional script tag usage.
    - Load `ol` global build first, then `maplat_core.umd.js`.
    - **Risks**: Global variable conflicts, missing dependencies.

3.  **Scenario C: Self-hosted ESM Bundle**
    - User downloads `dist` files and puts them on their server.
    - Similar to Scenario A, requires Import Map for `ol` if `ol` is also self-hosted or CDN.

4.  **Scenario D: Transpiled Development (TypeScript/ESM)**
    - Developing in TS/JS with `import` syntax, then bundling with Vite/Webpack.
    - This is the standard modern workflow.
    - **Verification**: Ensure types (`.d.ts`) resolution works and imports are correct.

### Asset Handling Verification

1.  **Image Inlining check**:
    - Verify if images from `parts/` are inlined as Base64 in `dist/maplat_core.js`.
    - Images to check: `redcircle.png`, `defaultpin_selected.png`, `defaultpin.png` (imported in `src/index.ts`).
    - **Check for Unused Images**: Identify images in `parts/` not imported in any `src/` files.
        - **Note**: `bluedot*.png`, `gsi*.jpg` etc. usage needs to be verified across the entire `src/` directory, not just `index.ts`.

2.  **Optimization Investigation**:
    - Evaluate if inlining (Base64) is optimal vs external files or sprites.
    - **External Files**: Can use `assetsInlineLimit: 0` in Vite to force external files.
    - **Sprites**: Investigate plugins for PNG sprites if necessary, though separate files might be simpler for HTTP/2.

### Changes to Build Configuration
- **Remove CommonJS Support**:
    - Remove `cjs` from `vite.config.ts`.
    - Remove `require` exports from `package.json`.

### Verification Plan

#### Manual Verification
- Create `test_esm_cdn.html`, `test_umd_cdn.html`, `test_self_hosted.html`.
- Run a local static server.
- Open each in the browser and verify the map loads and no errors occur.
- **Specific Asset Check**: Ensure markers (pins/circles) appear correctly in all scenarios.

#### Automated Tests
- Use Playwright to serve these HTML files and verify no console errors and map presence.

## Implementation Details

### File Structure
- `tests/consumption/esm-cdn.html`
- `tests/consumption/umd-cdn.html`
- `tests/consumption/self-hosted/` (copy of dist)

## Next Steps
1. Perform image verification (unused files, inlining).
2. Create the HTML verification files.
3. Modify `vite.config.ts` and `package.json` to remove CJS.
