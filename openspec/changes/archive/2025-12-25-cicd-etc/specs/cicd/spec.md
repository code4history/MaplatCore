# Spec: CI/CD Standardization

## MODIFIED Requirements

#### Requirement: CI Workflow Scope
The CI workflow **MUST** run on all commits and verify multiple Node.js versions.
- **Scenario:** A push to any branch **MUST** trigger linting, type checking, unit tests, and a package build.
- **Scenario:** The workflow **MUST** test against Node.js 20 and 22.
- **Scenario:** The `pnpm` setup step **MUST** explicitly use `version: 9`.

## ADDED Requirements

#### Requirement: Demo Deployment
The project **MUST** automatically deploy the demo application to GitHub Pages.
- **Scenario:** A push to the `master` branch **MUST** trigger a demo build and deploy `dist-demo/` content to the `gh-pages` branch.
- **Scenario:** Pushes to other branches **MUST NOT** trigger deployment.
