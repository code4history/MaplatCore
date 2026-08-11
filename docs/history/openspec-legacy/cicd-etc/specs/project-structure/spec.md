# Spec: Project Structure Standardization

## ADDED Requirements

#### Requirement: Package Manager Enforcement
The project **MUST** strictly enforce the use of `pnpm` version 9 or higher.
- **Scenario:** Running `npm install` **MUST** fail.
- **Scenario:** Running `pnpm install` with an older version **MUST** fail.
- **Scenario:** The `packageManager` field **MUST NOT** be used in `package.json`. Enforcement relies on `engines` and `.npmrc`.

#### Requirement: Build Output Separation
The build process **MUST** separate package artifacts from demo applications.
- **Scenario:** `npm run build` **MUST** output library assets to `dist/` and **MUST NOT** include `index.html`.
- **Scenario:** `npm run build:demo` **MUST** output the full demo application to `dist-demo/` including `index.html`.

## MODIFIED Requirements

#### Requirement: Development Server Configuration
The development server **MUST** run on port 5173 by default and handle root path navigation.
- **Scenario:** Opening `http://localhost:5173/` **MUST** load the demo application successfully without 404s.
