# MaplatCore Testing Strategy

## Overview

This document explains the testing approach for MaplatCore, including unit tests and E2E tests.

## Test Stack

- **Unit Tests**: Vitest
- **E2E Tests**: Playwright
- **Package Manager**: pnpm (migrated from npm for disk space efficiency)

## E2E Testing Approach

### Why a Test-Specific HTML?

We use a dedicated `e2e-test.html` file for E2E tests instead of the production `index.html`. This is a deliberate design decision based on the following technical constraints:

#### Key Differences

**Production HTML** (`index.html`):
```javascript
// MaplatApp is loaded inside DOMContentLoaded event
window.addEventListener('DOMContentLoaded', async () => {
  window.Maplat = MaplatApp;
  Maplat.createObject(option).then(function (app) {
    // initialization
  });
});
```

**Test HTML** (`e2e-test.html`):
```javascript
// MaplatApp is immediately available globally
import { MaplatApp } from './src/index.ts';
window.Maplat = MaplatApp;
window.MaplatApp = MaplatApp;

// Direct initialization
MaplatApp.createObject(option).then(function (app) {
  window.maplatApp = app;
});
```

#### Technical Rationale

1. **Module Loading Timing**
   - Production HTML loads MaplatApp asynchronously within DOMContentLoaded
   - Playwright tests need synchronous access to test the library API
   - Waiting for async events in tests introduces flakiness

2. **Vite Development Mode**
   - ES6 modules are loaded differently in dev vs production
   - Test environment needs predictable, synchronous loading

3. **Testing Library, Not Integration**
   - We're testing the MaplatCore library functionality
   - Not testing the specific HTML integration pattern
   - Similar to how React/Vue/Angular projects test components in isolation

### What We Test

- Maplat library initialization
- API methods (createObject, changeMap, etc.)
- Map switching functionality
- Marker and layer operations (future)

### Production Testing

For production-like testing:
1. Build tests: Test `dist/index.html` after `pnpm build`
2. Integration tests: Use real map data
3. Manual testing: Browser verification

## Running Tests

```bash
# Unit tests
pnpm test

# E2E tests (development)
pnpm test:e2e

# E2E tests (CI - Chromium only)
pnpm test:e2e:ci

# E2E tests (debug mode)
pnpm test:e2e:ui
```

## Headless Mode

Tests automatically run in headless mode when:
- `CI` environment variable is set
- `DISPLAY` environment variable is not set (typical server environment)

This allows the same test configuration to work on both developer machines and CI servers.

## Future Improvements

To enable testing with production HTML:
1. Refactor MaplatApp to be globally available immediately after module load
2. Add test helpers for initialization state checking
3. Implement test-specific event hooks

## Dependencies

System dependencies for Playwright (Oracle Linux):
```bash
sudo ./install-playwright-deps.sh
```

Note: If using Volta-installed pnpm, it won't be available in sudo context. Install dependencies with the script instead of `sudo pnpm exec playwright install-deps`.