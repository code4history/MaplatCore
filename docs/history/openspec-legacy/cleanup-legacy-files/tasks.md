# Tasks

## 1. File Removal
- [x] 1.1 Delete `example.zip` and `distribution.zip`.
- [x] 1.2 Delete `playwright-report/` and `test-results/` directories.
- [x] 1.3 Delete `e2e-test.html` and `public/index.html`.
- [x] 1.4 Delete `.eslintrc.json`.

## 2. Deno Removal
- [x] 2.1 Delete `examples/deno-example.ts` and `scripts/publish-deno.js`.
- [x] 2.2 Remove Deno scripts and `bin` entry from `package.json`.
- [x] 2.3 Remove Deno exclusion from `vitest.config.ts`.
- [x] 2.4 Remove Deno step from `scripts/publish-all.js`.

## 3. Documentation Consolidation
- [x] 3.1 Integrate `docs/testing-strategy.md` into `openspec/project.md`.
- [x] 3.2 Integrate `CLAUDE.md` guidelines into `openspec/project.md`.
- [x] 3.3 Integrate `SPEC_UPDATE_CONCERNS.md` into `openspec/project.md`.
- [x] 3.4 Integrate `spec/TEST_PLAN.md` into `openspec/tasks.md` or `openspec/testing.md` (create if needed, or just merge to project.md).
- [x] 3.5 Delete `docs/`, `SPEC_UPDATE_CONCERNS.md`, `spec/TEST_PLAN.md`.
- [x] 3.6 Replace `AGENTS.md` and `CLAUDE.md` content with redirects.

## 4. Reorganization
- [x] 4.1 Move `parts_test/` to `public/parts_test/`.
- [x] 4.2 Move `install-playwright-deps.sh` to `scripts/`.
- [x] 4.3 Move `test.html` to `e2e/test.html`.
- [x] 4.4 Update `e2e/*.spec.ts` to reference new paths (`/e2e/test.html`, `public/parts_test`).
- [x] 4.5 Update `test.html` (now in `e2e/`) to reference correct script paths (e.g. `../src/index.ts`).
- [x] 4.6 Update `.gitignore` to include `*.zip`.

## 5. Verification
- [x] 5.1 Run `pnpm test` (Unit tests).
- [x] 5.2 Run `pnpm test:e2e` (E2E tests).
- [x] 5.3 Run `pnpm build` to verify build process.
