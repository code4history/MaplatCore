import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

// Keys such as the map ID, the background ID and the hidden layers come from the state URL and
// from localStorage. These tests drive the real page because a stub cannot show that the app
// stays usable: the failure this guards against is a Promise that never settles.
const TEST_PAGE = '/e2e/test.html?mapboxgl=false';
const READY_TIMEOUT = 30_000;
const CHANGE_MAP_TIMEOUT = 6_000;

const open = async (page: Page, query: string) => {
  await page.goto(`${TEST_PAGE}${query}`);
  return page
    .waitForFunction(() => (window as any).__MAPLAT_APP__ !== undefined, undefined, { timeout: READY_TIMEOUT })
    .then(
      () => true,
      () => false
    );
};

const objectPrototypeState = (page: Page) =>
  page.evaluate(() => ({
    inherited: ({} as { hide?: unknown }).hide,
    own: Object.hasOwn(Object.prototype, 'hide')
  }));

const UNTOUCHED_PROTOTYPE = { inherited: undefined, own: false };

test.describe('keys that come from outside', () => {
  test.setTimeout(READY_TIMEOUT + 30_000);

  test('(i) a hidden layer named after an inherited key leaves Object.prototype alone', async ({ page }) => {
    const ready = await open(page, '&restore_hideLayer=__proto__');
    expect(await objectPrototypeState(page)).toEqual(UNTOUCHED_PROTOTYPE);
    expect(ready).toBe(true);
  });

  test('(ii) the same key behind a map ID leaves Object.prototype alone', async ({ page }) => {
    // The page reads its options from location.href, so the part after "#" stays in the value.
    const ready = await open(page, '&restore_hideLayer=morioka_ndl2#__proto__');
    expect(await page.evaluate(() => location.href)).toMatch(/restore_hideLayer=morioka_ndl2#__proto__$/);
    expect(await objectPrototypeState(page)).toEqual(UNTOUCHED_PROTOTYPE);
    expect(ready).toBe(true);
  });

  test('(iii) a background ID named after an inherited key does not stop the start-up', async ({ page }) => {
    expect(await open(page, '&restore_backgroundID=toString')).toBe(true);
  });

  test('(iv) an unknown map ID does not stop later map changes', async ({ page }) => {
    expect(await open(page, '')).toBe(true);
    const result = await page.evaluate(async timeout => {
      const app = (window as any).__MAPLAT_APP__;
      void app.changeMap('constructor');
      const settled = await Promise.race([
        app.changeMap('gsi').then(() => true),
        new Promise(resolve => setTimeout(() => resolve(false), timeout))
      ]);
      return { settled, mapID: app.currentMapInfo().mapID };
    }, CHANGE_MAP_TIMEOUT);
    expect(result).toEqual({ settled: true, mapID: 'gsi' });
  });

  test('(v) getPoiLayer returns nothing for inherited keys', async ({ page }) => {
    expect(await open(page, '')).toBe(true);
    const found = await page.evaluate(() => {
      const app = (window as any).__MAPLAT_APP__;
      return ['constructor', 'morioka_ndl2#__proto__'].map(id => app.getPoiLayer(id) === undefined);
    });
    expect(found).toEqual([true, true]);
  });
});
