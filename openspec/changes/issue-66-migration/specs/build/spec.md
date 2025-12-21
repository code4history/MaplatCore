# Build System Updates

## MODIFIED Requirements

#### Requirement: Modern Build Tooling
The build system MUST use current LTS versions of tooling and standard linting configurations.

##### Scenario: Dependency Health
- **GIVEN** `package.json`
- **THEN** it MUST NOT contain deprecated packages `argv`, `i18next-xhr-backend`.
- **AND** it MUST use `i18next-http-backend`.
- **NOTE** `lodash.template` is temporarily retained.

##### Scenario: Linting Configuration
- **GIVEN** the project
- **THEN** it MUST be configured using ESLint Flat Config (`eslint.config.js`).


