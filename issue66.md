title:	Unify Vite & ESLint
state:	OPEN
author:	kochizufan
labels:	
comments:	0
assignees:	
projects:	
milestone:	
number:	66
--
# MaplatCore: Unify Vite & ESLint

**Project**: [OpenSpec: Maplat Harmony Phase 2]
**Implementation Proposal**: `unify-libs-turf-vite`
**Target Repository**: `code4history/MaplatCore`

## Proposed Changes
1.  **Vite Unification**:
    -   Confirm `vite` is **^6.x (LTS)**.
    -   Confirm `vitest` is **^3.x**.
    -   *Action*: Pin/Update to latest patch versions if needed.

2.  **Linting Standardization**:
    -   Update `eslint` from 9.17 Legacy/Flat hybrid to pure **Flat Config**.
    -   Ensure `eslint.config.js` is used effectively.

## Rationale
Ensuring consistent configuration patterns.

