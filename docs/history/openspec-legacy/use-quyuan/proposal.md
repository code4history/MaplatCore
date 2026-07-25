# Replace lodash.template with Quyuan

## Goal
Replace the current `lodash.template` based icon and HTML generation logic with **Quyuan** (@c4h/quyuan), establishing it as the standard library for Code for History's software stack.

## Why
Code for History has adopted **Quyuan** as its standard library for template processing. MaplatCore currently uses `lodash.template` with custom inheritance logic. Unifying this stack reduces maintenance burden, standardizes template behavior across CfH projects, and leverages Quyuan's specialized features for historical map data.

## What Changes

### 1. Integrate Quyuan
- **Dependency**: Add `@c4h/quyuan` to `package.json`.
- **Target Logic**: Replace `createIconSet` and `createHtmlFromTemplate` in `src/template_works.ts` with Quyuan-based implementation.

### 2. Logic Adaptation
- **Current Logic**: Runtime reduction. Iterates through ancestors (marker -> cluster -> layer -> source ...) to find the first available template, then renders it with data.
- **New Logic (Quyuan)**:
    - Quyuan expects a compile-then-apply workflow.
    - We must first resolve the correct template string (using the same inheritance logic), *then* feed it to Quyuan for compilation/rendering.
    - Or, if Quyuan supports it, pre-compile all registered templates and select the compiled accessor at runtime.

### 3. Dependency Management (Chuci)
- Quyuan depends on **Chuci** (@c4h/chuci) for Slider UI elements.
- **Requirement**: MaplatCore does not need Slider elements in its core logic (unlike MaplatUI).
- **Action**: Evaluate if `chuci` can be excluded, ignored, or if `quyuan` allows strictly template-only usage without side-loading UI components. The user suggests "considering removing it from quyuan's dependency" (which implies a change in Quyuan itself or a workaround here). For this proposal, we will assume we use Quyuan as-is but ensure Chuci doesn't bloat the core if possible, or accept it if it's a hard dependency for now.

## Verification
- **Tests**: Existing tests in `spec/template.spec.ts` must pass (after necessary updates to match Quyuan's nuances if any).
- **Manual**: Markers must render icons and popups exactly as before.
