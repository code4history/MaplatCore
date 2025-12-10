# Cleanup Legacy Files and Configurations

## Goal
Remove obsolete files, consolidate documentation, and eliminate Deno support to clean up the project root and improve maintainability.

## Problem
The project root is cluttered with unused files (`example.zip`, `distribution.zip`), duplicate documentation (`AGENTS.md`, `CLAUDE.md`, `docs/`), and legacy configurations (Deno support, `.eslintrc.json`). This confuses developers and AI agents about the current project standards.

## Proposed Solution
1.  **Remove Obsolete Files**: Delete generated zips, unused reports, and legacy config files.
2.  **Remove Deno Support**: Completely remove Deno-related scripts and configurations as the project focuses on browser/Node.js environments.
3.  **Consolidate Documentation**: Merge scattered docs (`docs/`, `CLAUDE.md`, `SPEC_UPDATE_CONCERNS.md`) into `openspec/project.md` and replace root docs with redirects.
4.  **Reorganize Project Root**: Move `test.html`, `parts_test/`, and scripts to appropriate subdirectories.
5.  **Update Configurations**: Clean up `package.json`, `.gitignore`, and test configs to reflect these changes.

## User Review Required
- Confirmation of Deno support removal.
- Confirmation of `test.html` move to `e2e/`.

## Proposed Changes
### Root
- [DELETE] `example.zip`, `distribution.zip`
- [DELETE] `.eslintrc.json`
- [DELETE] `e2e-test.html`
- [DELETE] `SPEC_UPDATE_CONCERNS.md`
- [MODIFY] `AGENTS.md` (Redirect to openspec)
- [MODIFY] `CLAUDE.md` (Redirect to openspec)
- [MODIFY] `.gitignore` (Add `*.zip`)
- [MODIFY] `package.json` (Remove bin, Deno scripts)

### Documentation
- [DELETE] `docs/`
- [DELETE] `spec/TEST_PLAN.md`
- [MODIFY] `openspec/project.md` (Integrate content)

### Deno Removal
- [DELETE] `examples/deno-example.ts`
- [DELETE] `scripts/publish-deno.js`
- [MODIFY] `scripts/publish-all.js`
- [MODIFY] `vitest.config.ts`

### Reorganization
- [MOVE] `test.html` -> `e2e/test.html`
- [MOVE] `parts_test/` -> `public/parts_test/`
- [MOVE] `install-playwright-deps.sh` -> `scripts/install-playwright-deps.sh`
- [DELETE] `public/index.html`
- [DELETE] `playwright-report/`, `test-results/`

## Verification Plan
### Automated Tests
- Run `pnpm test` and `pnpm test:e2e` to ensure no regressions after file moves.
- Verify `pnpm build` still works.

### Manual Verification
- Check `openspec/project.md` for integrated documentation.
- Verify project root is clean.
