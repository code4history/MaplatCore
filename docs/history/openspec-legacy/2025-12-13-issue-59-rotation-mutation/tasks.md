# Tasks: Fix `restore.position.rotation` Mutation

- [x] 1. Reproduction & Test Creation
    - [x] 1.1 Create `e2e/issue-59.spec.ts` testing `rotation`, `direction`, `zoom`, `transparency`.
    - [x] 1.2 Run test to confirm mutation bug and/or application failure.
- [ ] 2. Implementation
    - [x] 2.1 Modify `src/source/mixin.ts` to clone `cond` in `setViewpoint`.
- [x] 3. Verification
    - [x] 3.1 Run `e2e/issue-59.spec.ts` to confirm pass (No mutation AND correct application).
    - [x] 3.2 Run all E2E tests to ensure no regressions.
