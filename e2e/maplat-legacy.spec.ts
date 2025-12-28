import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

type LegacyMessageType = 'appReady' | 'clickMap' | 'clickMarker';

interface LegacyMessage {
  type: LegacyMessageType;
  payload?: unknown;
}

interface ClickMapPayload {
  longitude: number;
  latitude: number;
}

interface ClickMarkerPayload {
  id: string;
  namespaceID: string;
  image: string;
  start: number;
  lnglat: [number, number];
}

interface ClientPoint {
  x: number;
  y: number;
}

const MAPBOX_TOKEN =
  process.env.MAPBOX_TOKEN ||
  'pk.eyJ1IjoicmVraXNoaWtva3VkbyIsImEiOiJjazRoMmF3dncwODU2M2ttdzI2aDVqYXVwIn0.8Hb9sekgjfck6Setxk5uVg';
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyB0v_F9EVPbE7R2uOm6Mixrtzts21DEICc';
const TEST_PAGE =
  `/e2e/test.html?mapboxgl=false` +
  `&mapboxToken=${encodeURIComponent(MAPBOX_TOKEN)}` +
  `&googleApiKey=${encodeURIComponent(GOOGLE_API_KEY)}`;
const MESSAGE_REGEX = /^####Message (\w+)(?: (.+))?$/;
const MESSAGE_TIMEOUT = 60_000;
const ROUND_DEPTH = 5;
const MAP_CANVAS_SELECTOR = '#map_div canvas';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const normalizePayload = (payload: unknown, depth = ROUND_DEPTH): unknown => {
  if (Array.isArray(payload)) {
    return payload.map(value => normalizePayload(value, depth));
  }
  if (payload && typeof payload === 'object') {
    return Object.entries(payload).reduce<Record<string, unknown>>((acc, [key, value]) => {
      acc[key] = normalizePayload(value, depth);
      return acc;
    }, {});
  }
  if (typeof payload === 'number' && !`${payload}`.match(/^\d+$/)) {
    const factor = Math.pow(10, depth);
    return Math.round(payload * factor) / factor;
  }
  return payload;
};

const waitForMessage = async (
  queue: LegacyMessage[],
  type: LegacyMessageType,
  timeout = MESSAGE_TIMEOUT
): Promise<LegacyMessage> => {
  const start = Date.now();
  while (Date.now() - start <= timeout) {
    const index = queue.findIndex(message => message.type === type);
    if (index >= 0) {
      return queue.splice(index, 1)[0];
    }
    await delay(50);
  }
  throw new Error(`Timed out waiting for ${type}`);
};

const assertCoordinates = (payload: unknown, longitude: number, latitude: number) => {
  const coords = payload as ClickMapPayload | undefined;
  expect(coords).toBeTruthy();
  expect(coords?.longitude).not.toBeUndefined();
  expect(coords?.latitude).not.toBeUndefined();
  expect(coords?.longitude as number).toBeCloseTo(longitude, 5);
  expect(coords?.latitude as number).toBeCloseTo(latitude, 5);
};

const getCanvasBox = async (page: Page) => {
  const box = await page.locator(MAP_CANVAS_SELECTOR).first().boundingBox();
  if (!box) {
    throw new Error('Map canvas bounding box is not available.');
  }
  return box;
};

const clampToBox = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min + 5), max - 5);

const resolveClientPoint = async (page: Page, offset: ClientPoint): Promise<ClientPoint> => {
  // Ensure the canvas is in view before computing coordinates
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.querySelector('#map_div')?.scrollIntoView({ block: 'center', inline: 'center' });
  });

  const box = await getCanvasBox(page);
  return {
    x: clampToBox(box.x + offset.x, box.x, box.x + box.width),
    y: clampToBox(box.y + offset.y, box.y, box.y + box.height)
  };
};

const clientPointToLngLat = async (page: Page, point: ClientPoint): Promise<ClickMapPayload> => {
  const coords = await page.evaluate(async ({ point }) => {
    const app = (window as any).__MAPLAT_APP__;
    if (!app?.clientPointToLngLat) return null;
    return app.clientPointToLngLat(point.x, point.y);
  }, { point });
  if (!coords) {
    throw new Error('Unable to convert client point to coordinates via MaplatApp.');
  }
  return coords as ClickMapPayload;
};

interface ClickResult {
  expected: ClickMapPayload;
  payload: (ClickMapPayload & { mapID?: string }) | undefined;
}

const clickMapAtOffset = async (
  page: Page,
  messageQueue: LegacyMessage[],
  offset: ClientPoint
): Promise<ClickResult> => {
  const clientPoint = await resolveClientPoint(page, offset);

  console.log(`[test] About to click at offset (${offset.x}, ${offset.y}), resolved to (${clientPoint.x}, ${clientPoint.y})`);

  // Try standard Playwright click first
  try {
    await page.mouse.click(clientPoint.x, clientPoint.y);
    console.log(`[test] Click completed via page.mouse.click`);
  } catch (e) {
    console.log(`[test] page.mouse.click failed, trying DOM event dispatch`);
    // Fallback: dispatch DOM event directly if Playwright thinks it's obstructed/offscreen
    await page.evaluate(({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      if (el) {
        el.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y,
          view: window
        }));
      }
    }, clientPoint);
    console.log(`[test] DOM event dispatched`);
  }

  const expected = await clientPointToLngLat(page, clientPoint);
  console.log(`[test] Expected coordinates: ${JSON.stringify(expected)}`);
  console.log(`[test] Now waiting for clickMap message...`);

  const event = await waitForMessage(messageQueue, 'clickMap');
  console.log(`[test] Received clickMap message: ${JSON.stringify(event.payload)}`);

  const payload = event.payload as (ClickMapPayload & { mapID?: string }) | undefined;
  console.log(`[test] About to assertCoordinates with expected: ${JSON.stringify(expected)}, payload: ${JSON.stringify(payload)}`);
  assertCoordinates(payload, expected.longitude, expected.latitude);
  console.log(`[test] assertCoordinates passed, returning from clickMapAtOffset`);
  return { expected, payload };
};

const dragSequence = async (page: Page, initialOffset: ClientPoint) => {
  const box = await getCanvasBox(page);
  const clampPoint = (x: number, y: number) => ({
    x: clampToBox(x, box.x, box.x + box.width),
    y: clampToBox(y, box.y, box.y + box.height)
  });
  const start = clampPoint(box.x + initialOffset.x, box.y + initialOffset.y);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await delay(500);
  const upperLeft = clampPoint(start.x - 220, start.y - 180);
  await page.mouse.move(upperLeft.x, upperLeft.y, { steps: 20 });
  await delay(500);
  const midPoint = clampPoint(start.x + 80, start.y - 60);
  await page.mouse.move(midPoint.x, midPoint.y, { steps: 15 });
  await delay(500);
  const lowerRight = clampPoint(start.x + 320, start.y + 220);
  await page.mouse.move(lowerRight.x, lowerRight.y, { steps: 25 });
  await delay(500);
  await page.mouse.up();
};

const clickMarkerById = async (page: Page, markerId: string) => {
  // 1. Try to find marker element by image source and click it directly
  const markerImage = await page.evaluate((id) => {
    const app = (window as any).__MAPLAT_APP__;
    const marker = app?.getMarker(id);
    return marker?.image || marker?.icon;
  }, markerId);

  if (markerImage) {
    try {
      const filename = markerImage.split('/').pop();
      if (filename) {
        // Look for img tag with src containing the filename
        const locator = page.locator(`img[src*="${filename}"]`).first();
        // Check if attached and visible
        if (await locator.count() > 0 && await locator.isVisible()) {
          console.log(`[test] Clicking marker element via locator: ${filename}`);
          await locator.click();
          return;
        }
      }
    } catch (e) {
      console.log(`[test] DOM element click failed for ${markerId}, falling back to coordinate click: ${e}`);
    }
  }

  // 2. Fallback: Coordinate-based click
  const clientPoint = await page.evaluate(async ({ markerId }) => {
    const app = (window as any).__MAPLAT_APP__;
    if (!app?.lngLatToClientPoint) return null;
    const marker = app.getMarker(markerId);
    if (!marker) return null;

    // Ensure marker is visible
    window.scrollTo(0, 0);
    document.querySelector('#map_div')?.scrollIntoView({ block: 'center', inline: 'center' });

    // Handle both GeoJSON Feature format and legacy POI format
    const lnglat =
      marker.geometry?.coordinates ??  // GeoJSON Feature
      marker.lnglat ??                 // Legacy format
      (marker.longitude !== undefined && marker.latitude !== undefined
        ? [marker.longitude, marker.latitude]
        : marker.lng !== undefined && marker.lat !== undefined
          ? [marker.lng, marker.lat]
          : null);
    if (!lnglat) return null;
    return app.lngLatToClientPoint(lnglat[0], lnglat[1]);
  }, { markerId });

  if (!clientPoint) {
    throw new Error(`Unable to resolve marker "${markerId}" client position.`);
  }

  // Use clientPoint directly as it seems to be correct for page.mouse.click
  // (Previous attempts to add canvas offset caused coordinate mismatch)
  const pagePoint = clientPoint;

  // Force DOM event dispatch for reliability in headless mode
  // But first try Playwright's native click with corrected coordinates
  // Try clicking in a spiral pattern to handle potential coordinate mismatches or rendering offsets
  const offsets = [
    { dx: 0, dy: 0 },
    { dx: 0, dy: -5 }, { dx: 5, dy: 0 }, { dx: 0, dy: 5 }, { dx: -5, dy: 0 },
    { dx: -5, dy: -5 }, { dx: 5, dy: -5 }, { dx: 5, dy: 5 }, { dx: -5, dy: 5 }
  ];

  for (const { dx, dy } of offsets) {
    try {
      const clickX = pagePoint.x + dx;
      const clickY = pagePoint.y + dy;
      console.log(`[test] Clicking at (${clickX}, ${clickY}) via page.mouse.click (offset: ${dx}, ${dy})`);
      await page.mouse.click(clickX, clickY);
      // Small delay to allow event processing
      await page.waitForTimeout(100);
    } catch (e) {
      console.log(`[test] page.mouse.click failed at offset ${dx},${dy}: ${e}`);
    }
  }

  // Fallback: dispatch DOM event directly (only at center)
  await page.evaluate(({ x, y }) => {
    const el = document.elementFromPoint(x, y);
    if (el) {
      console.log(`[test] Dispatching click at (${x}, ${y}) on element: ${el.tagName}.${el.className}`);
      el.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
        view: window
      }));
    }
  }, pagePoint);
};

test.describe('Maplat legacy workflow', () => {
  test('mirrors historical Puppeteer regression flow', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Legacy fixture relies on Chromium-specific WebGL support.');
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 1440, height: 900 });

    const messageQueue: LegacyMessage[] = [];
    const allConsoleLogs: string[] = [];

    page.on('console', msg => {
      const logText = `[browser:${msg.type()}] ${msg.text()}`;
      console.log(logText);
      allConsoleLogs.push(logText);

      const text = msg.text();
      const matched = text.match(MESSAGE_REGEX);
      if (!matched) return;

      const [, type, payloadRaw] = matched;
      let payload: unknown;
      if (payloadRaw) {
        try {
          payload = normalizePayload(JSON.parse(payloadRaw));
        } catch (error) {
          test.info().annotations.push({
            type: 'warning',
            description: `Failed to parse payload for ${type}: ${(error as Error).message}`
          });
        }
      }
      messageQueue.push({ type: type as LegacyMessageType, payload });
    });
    page.on('pageerror', error => {
      const errorText = `[pageerror] ${error}`;
      console.log(errorText);
      allConsoleLogs.push(errorText);
    });
    page.on('requestfailed', request => {
      const failText = `[requestfailed] ${request.failure()?.errorText ?? 'unknown'} -> ${request.url()}`;
      console.log(failText);
      allConsoleLogs.push(failText);
    });
    page.on('response', async response => {
      if (!response.ok()) {
        const respText = `[response:${response.status()}] ${response.request().method()} ${response.url()}`;
        console.log(respText);
        allConsoleLogs.push(respText);
      }
    });

    try {

      await page.goto(TEST_PAGE, { waitUntil: 'domcontentloaded' });

      // Screenshot 0: Immediately after page load
      await page.screenshot({ path: 'test-results/00-after-page-load.png', fullPage: true });

      await waitForMessage(messageQueue, 'appReady');
      await delay(2000);

      // Screenshot 1: Right after app initialization
      await page.screenshot({ path: 'test-results/01-after-appReady.png', fullPage: true });

      const initialPoint = { x: 132, y: 103 };

      // Screenshot 1.5: Before first click
      await page.screenshot({ path: 'test-results/01.5-before-first-click.png', fullPage: true });

      const firstClick = await clickMapAtOffset(page, messageQueue, initialPoint);
// console.log('[test] firstClick completed, about to take screenshot');

      // Screenshot 1.6: After first click
      // await page.screenshot({ path: 'test-results/01.6-after-first-click.png', fullPage: true });
// console.log('[test] Screenshot skipped (commented out)');

// console.log('[test] Starting dragSequence...');
      await dragSequence(page, initialPoint);
// console.log('[test] dragSequence completed');

      await delay(2000);
// console.log('[test] About to perform second click...');
      const secondClick = await clickMapAtOffset(page, messageQueue, initialPoint);
// console.log('[test] Second click completed');

// console.log('[test] Checking longitude difference...');
      expect(Math.abs((secondClick.payload?.longitude ?? 0) - (firstClick.payload?.longitude ?? 0))).toBeGreaterThan(
        0.007
      );
// console.log('[test] Longitude check passed');

// console.log('[test] Checking latitude difference...');
      expect(Math.abs((secondClick.payload?.latitude ?? 0) - (firstClick.payload?.latitude ?? 0))).toBeGreaterThan(
        0.003
      );
// console.log('[test] Latitude check passed');

// console.log('[test] About to click #morioka button...');
      await page.locator('#morioka').click();
// console.log('[test] Clicked #morioka button');
// console.log('[test] Waiting for map to change to morioka...');
      await page.waitForFunction(() => {
        const app = (window as any).__MAPLAT_APP__;
        const currentMap = app?.currentMapInfo?.();
        if (currentMap) {
          console.log(`[browser] Current mapID: ${currentMap.mapID}`);
        }
        return currentMap?.mapID === 'morioka';
      }, null, { timeout: MESSAGE_TIMEOUT });
// console.log('[test] Map successfully changed to morioka');

      // Screenshot 2: After map change to morioka
      // await page.screenshot({ path: 'test-results/02-after-map-change.png', fullPage: true });
// console.log('[test] Screenshot 2 skipped');

// console.log('[test] Starting marker diagnostics...');
      const markerDiagnostics = await page.evaluate(async () => {
        const app = (window as any).__MAPLAT_APP__;
        if (!app) return null;
        const marker = app.getMarker('main_1');
        if (!marker) {
          return { exists: false };
        }
        // Handle both GeoJSON Feature format and legacy POI format
        const lnglat =
          marker.geometry?.coordinates ??  // GeoJSON Feature
          marker.lnglat ??                 // Legacy format
          (marker.longitude !== undefined && marker.latitude !== undefined
            ? [marker.longitude, marker.latitude]
            : marker.lng !== undefined && marker.lat !== undefined
              ? [marker.lng, marker.lat]
              : null);
        if (!lnglat) {
          return { exists: true, lnglat: null, clientPoint: null };
        }
        const clientPoint = await app.lngLatToClientPoint(lnglat[0], lnglat[1]);
        return { exists: true, lnglat, clientPoint };
      });
      console.log(`[test] Marker diagnostics completed: ${JSON.stringify(markerDiagnostics)}`);

      test.info().annotations.push({
        type: 'debug',
        description: `marker main_1 diagnostics: ${JSON.stringify(markerDiagnostics)}`
      });
// console.log('[test] Checking marker exists...');
      expect(markerDiagnostics?.exists).toBeTruthy();
// console.log('[test] Marker exists check passed');

      // Wait for map rendering/animation to settle
// console.log('[test] Waiting 3 seconds for rendering...');
      await delay(3000);
// console.log('[test] Wait complete');

      // Screenshot 3: Before clicking marker
      // await page.screenshot({ path: 'test-results/03-before-marker-click.png', fullPage: true });
// console.log('[test] Screenshot 3 skipped');

// console.log('[test] About to click marker main_1...');
      await clickMarkerById(page, 'main_1');
// console.log('[test] Marker click completed');
      const markerEvent = await waitForMessage(messageQueue, 'clickMarker');
      const marker = markerEvent.payload as ClickMarkerPayload | undefined;

      // Marker should be in GeoJSON Feature format now
      expect(marker?.id).toBe('main_1');
      expect(marker?.namespaceID).toBe('main_1');

      // Properties are in marker.properties for GeoJSON, or top-level for legacy
      const image = (marker as any)?.properties?.image ?? (marker as any)?.image;
      const start = (marker as any)?.properties?.start ?? (marker as any)?.start;
      const lnglat = (marker as any)?.geometry?.coordinates ?? marker?.lnglat;

      expect(image).toBe('moriokaginko.jpg');
      expect(start).toBe(1896);
      expect(lnglat?.[0]).not.toBeUndefined();
      expect(lnglat?.[1]).not.toBeUndefined();
      expect(lnglat?.[0] as number).toBeCloseTo(141.15296, 5);
      expect(lnglat?.[1] as number).toBeCloseTo(39.7006, 5);
    } finally {
      // Save all console logs to file
      const fs = await import('fs');
      const path = await import('path');
      const logPath = path.join('test-results', 'console-logs.txt');
      fs.writeFileSync(logPath, allConsoleLogs.join('\n'));
    }
  });
});
