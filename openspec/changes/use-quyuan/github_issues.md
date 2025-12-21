# GitHub Issue Drafts

## MaplatCore Issue
**Title:** Replace `lodash.template` with `Quyuan`

**Body:**
As part of the Code for History standardization strategy, strict template processing in `MaplatCore` will be migrated to `Quyuan` (@c4h/quyuan).

**Goal:**
- Replace current `lodash.template` usage (for Icon and HTML generation).
- Adopt `Quyuan` as the standard templating engine.

**Scope:**
- Add `@c4h/quyuan` dependency.
- Refactor `src/template_works.ts`.
- Ensure compatibility with existing template logic (hierarchical resolution).
- Handle/Minimize dependency on `Chuci` (Slider UI) which is not required for MaplatCore's logic.

**Reference:**
- OpenSpec Change: `use-quyuan`

---

## Quyuan Issue
**Title:** Optionalize `Chuci` dependency for Core usage

**Body:**
MaplatCore is adopting Quyuan for its templating logic. However, MaplatCore does not use the UI components (Sliders) provided by `Chuci`, which Quyuan currently depends on.

**Request:**
- Please consider making `Chuci` a peer dependency or optional dependency, or allow Quyuan to be initialized in a "template-only" mode that does not require Chuci to be present.
- This would reduce the bundle size and dependency graph for projects like MaplatCore that only need the templating engine part.

**Context:**
- Related to MaplatCore adoption plan.
