# Tasks

## 1. File Removal
- [ ] 1.1 Delete `example.zip` and `distribution.zip`.
- [ ] 1.2 Delete `playwright-report/` and `test-results/` directories.
- [ ] 1.3 Delete `e2e-test.html` and `public/index.html`.
- [ ] 1.4 Delete `.eslintrc.json`.

## 2. Deno Removal
- [ ] 2.1 Delete `examples/deno-example.ts` and `scripts/publish-deno.js`.
- [ ] 2.2 Remove Deno scripts and `bin` entry from `package.json`.
- [ ] 2.3 Remove Deno exclusion from `vitest.config.ts`.
- [ ] 2.4 Remove Deno step from `scripts/publish-all.js`.

## 3. Documentation Consolidation
- [ ] 3.1 Integrate `docs/testing-strategy.md` into `openspec/project.md`.
- [ ] 3.2 Integrate `CLAUDE.md` guidelines into `openspec/project.md`.
- [ ] 3.3 Integrate `SPEC_UPDATE_CONCERNS.md` into `openspec/project.md`.
- [ ] 3.4 Integrate `spec/TEST_PLAN.md` into `openspec/tasks.md` or `openspec/testing.md` (create if needed, or just merge to project.md).
- [ ] 3.5 Delete `docs/`, `SPEC_UPDATE_CONCERNS.md`, `spec/TEST_PLAN.md`.
- [ ] 3.6 Replace `AGENTS.md` and `CLAUDE.md` content with redirects.

## 4. Reorganization
- [ ] 4.1 Move `parts_test/` to `public/parts_test/`.
- [ ] 4.2 Move `install-playwright-deps.sh` to `scripts/`.
- [ ] 4.3 Move `test.html` to `e2e/test.html`.
- [ ] 4.4 Update `e2e/*.spec.ts` to reference new paths (`/e2e/test.html`, `public/parts_test`).
- [ ] 4.5 Update `test.html` (now in `e2e/`) to reference correct script paths (e.g. `../src/index.ts`).
- [ ] 4.6 Update `.gitignore` to include `*.zip`.

## 5. Verification
- [ ] 5.1 Run `pnpm test` (Unit tests).
- [ ] 5.2 Run `pnpm test:e2e` (E2E tests).
- [ ] 5.3 Run `pnpm build` to verify build process.
