# Design: Quyuan Integration

## Architectural Shift

### Current: Lazy Runtime Evaluation
Currently, for every marker (POI), `MaplatCore` iterates up the hierarchy (Marker -> Cluster -> Layer -> Source -> App) to find a `template` string. It then compiles and executes this string on the fly (or uses a cached compiled function if `lodash` handles it internally).

### Proposed: Pre-Resolution + Quyuan Compilation

**Quyuan** is designed to take a template and data object to produce output.

To adapt MaplatCore's inheritance model:
1.  **Resolution Step**: We must still perform the hierarchical lookup to find the *effective template string* for a given POI. This logic remains largely the same (iterating ancestors).
2.  **Compilation Step**: Once the template string is identified, we pass it to Quyuan.
    *   *Optimization*: We should cache the Quyuan instance or the compiled function for each unique template string found during the session to avoid re-compiling for every marker.

## Dependency Handling: Chuci
The user notes that `Quyuan` depends on `Chuci` for specific UI elements (sliders in info windows), which `MaplatCore` doesn't strictly need (MaplatUI uses them).

**Strategy**:
- We will install `@c4h/quyuan`.
- If `chuci` is a peer dependency or optional, we might omit it.
- If it is a direct dependency, we will accept it for now to proceed with the core replacement, as "modifying Quyuan to remove dependency" is outside the scope of *this* repository's change, though the user mentions it as a direction.
- **Refinement**: If the user intends for us to *modify Quyuan itself* as part of this proposal, we would need to touch a different repo. The user request says "Quyuanのdependencyからは外す方向を検討します" (Consider removing it from Quyuan's dependency). This implies a change to Quyuan may be processed separately or parallelly. For MaplatCore, we effectively ignore it or treat it as a transitive dependency.

## Code Structure Changes
`src/template_works.ts`:
- Replace `lodash.template` import with `@c4h/quyuan`.
- Refactor `createIconSet` and `createHtmlFromTemplate` to instantiate/use Quyuan.
