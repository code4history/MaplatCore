# Build Modernization

## ADDED Requirements
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
