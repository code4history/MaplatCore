# Repository Guidelines

## Core Operating Principles

These principles govern how an AI coding agent should operate in this repository, regardless of which tool (Claude Code, Codex, or others) is used.

1. **Response Language Discipline**: Follow this repository's working-language convention when responding to the user (for this repository, Japanese), and keep responses polite and concise. This rule governs the language the agent uses when *talking with the user* — it is a separate axis from the language this document itself is written in (English, see "Documentation Language" below), and separate from the bilingual (English/Japanese) convention that applies to README and Wiki pages.
2. **Respect for Existing Behavior**: Do not invent your own implementation or make unsupported leaps of inference. Prioritize faithfully reproducing and porting the logic of the existing implementation — the migration source, the specification, or prior commits — over introducing a novel design.
3. **Root-Cause Analysis**: When a problem or bug occurs, do not keep patching based on guesses. Always compare against the existing implementation or specification and investigate the root cause thoroughly before applying a fix.
4. **The Human Gate Is Sovereign**: Never decide on your own that it is fine to move on to the next step without an explicit response from the user to a question or confirmation request. The agent privately concluding that something is fine is not a substitute for the user confirming it — the user must obtain that assurance for themselves. Whether to proceed to the next step is always the user's exclusive prerogative. Proceeding without a response usurps that prerogative and must be treated as the equivalent of a coup — a grave violation, never a minor process slip.

### Documentation Language

This document (`AGENTS.md`) itself is written in English, independent of principle 1 above.

## Operational Rules & History

- Repository-specific operating rules for AI coding agents are recorded under `docs/superpowers/rules/`.
- A translated index of this repository's pre-2026 development history (proposals and records originally written in the OpenSpec workflow) is available at `docs/history/openspec-legacy-index.md`, with original documents preserved under `docs/history/openspec-legacy/`.

## Project Structure & Module Organization

API/core logic lives in `src/` (`index.ts`, `map_ex.ts`, `view_ex.ts`, `proj_ex.ts`, `source_ex.ts`, `source/`, `types/`, `template_works.ts`, `normalize_pois.ts`, etc.). Vitest unit specs live in `spec/` (`*.spec.ts`, plus `fileMock.ts`/`setup.ts` helpers); Playwright end-to-end specs live in `e2e/`. `tests/consumption/` holds static HTML fixtures (UMD/ESM/self-hosted) used by the consumption e2e checks. `parts/` and `public/` hold auxiliary assets, and release helper scripts live in `scripts/`.

## Build, Test, and Development Commands

`pnpm dev` starts the Vite dev server. `pnpm build` produces the production bundle (`BUILD_MODE=package vite build`); `pnpm build:with-typecheck` runs `pnpm typecheck` first. `pnpm build:demo` builds the demo site. `pnpm typecheck` runs `tsc --noEmit`. `pnpm test` (`vitest run`) and `pnpm test:watch` run unit specs; `pnpm coverage` adds V8 coverage. `pnpm test:e2e` (`pretest:e2e` installs Playwright browsers), `pnpm test:e2e:ui`, and `pnpm test:e2e:ci` run the Playwright suite in `e2e/`. `pnpm lint` and `pnpm format` run ESLint/Prettier over `src`/`spec`.

## Coding Style & Naming Conventions

TypeScript with `strict: true` in `tsconfig.json` and the `@/*` path alias mapped to `src/*`. ESLint is configured via `eslint.config.mjs` (`@typescript-eslint` rules); Prettier formatting is enforced via `.prettierrc`. Run `pnpm lint` (autofix) and `pnpm format` before committing.

## Testing Guidelines

Vitest unit specs live in `spec/` and mirror source filenames (e.g. `viewpoint.ts` → `viewpoint.spec.ts`). Playwright end-to-end specs live in `e2e/` and exercise the built library against the static consumption fixtures in `tests/consumption/`. `pnpm prepublishOnly` runs lint, typecheck, test, and build together as the release gate.

## Commit & Pull Request Guidelines

Recent `git log` shows a mix of Conventional Commits (`fix:`, `chore:`, `docs:`) and task-ID-prefixed messages tied to this project's internal task tracking. Keep commits scoped to one concern; when a message is not part of a tracked task, prefer a Conventional Commits prefix. Pull requests should describe the change, note any affected API behavior, and confirm lint, typecheck, unit tests, and (when relevant) e2e tests pass locally before requesting review.

## Release & Configuration Tips

Version helper scripts live in `scripts/` (`version:bump`, `version:sync`). `pnpm prepublishOnly` is the release gate (lint + typecheck + test + build) and expects a clean working tree. Keep secrets and any proprietary map data out of the repository.

## ブラウザの方針

- 対象は Chrome・Edge・Firefox・Safari（iOS を含む）の最新 2 版。
- Baseline Widely available の機能は、機能検出なしで使ってよい。
- Baseline Newly available と Limited availability の機能は、使えないブラウザでも壊れないことを条件に使う。見た目だけの機能はそのまま、配置が崩れるものは `@supports`、振る舞いは機能検出つきの 20 行以内の代わりの実装で受ける。
- polyfill の依存を足さない。どうしても要るときは、機能検出のうえで `import()` で必要なときだけ読む。
- iOS Safari（WebKit）で実際に障害が出たことがある。WebKit で挙動が変わりうる変更は Playwright の webkit でも確かめる。
- 動きのある表現は `prefers-reduced-motion: reduce` のとき止めるか、切り替えだけにする。状態の変化を伝える短い遷移まで一括で消さない。
- Enter で送信・確定する文字入力は、IME の変換中（`event.isComposing` か `keyCode === 229`）を除外する。
