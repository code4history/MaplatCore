<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Repository Guidelines

## Project Structure & Module Organization
MaplatCore is a TypeScript-first mapping SDK. Active code lives in `src/` (core classes, projections, utilities). Rendering demos and manual QA assets stay in `apps/` and `public/`. Legacy conversion logic is isolated in `parts/` and `parts_test/`. Unit helpers reside in `spec/`, while browser automations live in `e2e/`. Built bundles land in `dist/` and should be treated as outputs; never edit them directly. Shared styles sit under `less/`, and release automation plus versioning helpers live in `scripts/`.

## Build, Test, and Development Commands
Use pnpm for every script: `pnpm install` bootstraps dependencies; `pnpm dev` starts the Vite dev server with live reload; `pnpm build` (or `pnpm build:with-typecheck`) emits ESM/CJS bundles into `dist/`. Quality gates include `pnpm lint`, `pnpm format`, and `pnpm typecheck`. Run `pnpm preview` before publishing to verify the production bundle.

## Coding Style & Naming Conventions
The codebase follows ESLint with `@typescript-eslint` plus Prettier. Keep semicolons, double quotes, 80-character lines, and spaces-over-tabs per `.prettierrc`. Favor arrow functions, `const`, and ES modules; avoid `var` and unused exports, since CI treats those as errors. File names use kebab-case for utilities (`src/utils/map-state.ts`) and PascalCase for UI demos under `apps/`. Keep public API symbols typed explicitly so generated d.ts files remain stable.

## Testing Guidelines
Vitest is the default unit harness (`pnpm test` for one-shot, `pnpm test:watch` for TDD). Place specs next to the code in `spec/` using `*.spec.ts` names, and ensure coverage via `pnpm coverage` stays above 90 percent for projection math. Playwright covers integration flows in `e2e/`; run `pnpm test:e2e` locally and `pnpm test:e2e:ci` before touching GitHub Actions. When debugging, add artifacts to `test-results/` but delete them before committing.

## Commit & Pull Request Guidelines
Follow Conventional Commits like the existing history (`fix: update GitHub Actions...`, `chore: migrate to pnpm`). Each commit should bundle a logical change and include tests or reasoning. PRs must describe motivation, list verification commands, link issues, and attach screenshots or recordings when UX changes occur. Tag reviewers only after CI for lint, unit, and Playwright suites is green.

## Security & Configuration Tips
Do not hard-code provider tokens (Mapbox, MapLibre). Store them in `.env.local` and reference via `import.meta.env`. Review dependencies before running `pnpm publish:*`, and audit Playwright fixtures so no real credentials leak into `playwright-report/`.
