# build Specification

## Purpose
TBD - created by archiving change weiwudi-vite-pnpm. Update Purpose after archive.
## Requirements
### Requirement: Build Artifacts
The build system SHALL generate only modern artifacts.
- **CommonJS** artifacts SHALL NOT be generated.
- **ESM** and **UMD** artifacts SHALL be generated.

#### Scenario: Artifact Generation
- Given I run `pnpm build`
- Then the `dist/` directory should contain `maplat_core.js` (ESM) and `maplat_core.umd.js` (UMD)
- And the `dist/` directory should NOT contain `maplat_core.cjs`

### Requirement: Linting Strategy
Build scripts SHALL use pnpm and Vite properly.

#### Scenario: Linting Assets
- Given I run `pnpm run lint`
- Then it should pass without errors regarding standard asset imports (`.jpg`, `.png`).


### Requirement: Modern Build Tooling
The build system MUST use current LTS versions of tooling and standard linting configurations.

#### Scenario: Dependency Health
- **GIVEN** `package.json`
- **THEN** it MUST NOT contain deprecated packages `argv`, `i18next-xhr-backend`.
- **AND** it MUST use `i18next-http-backend`.
- **NOTE** `lodash.template` is temporarily retained.

#### Scenario: Linting Configuration
- **GIVEN** the project
- **THEN** it MUST be configured using ESLint Flat Config (`eslint.config.js`).
