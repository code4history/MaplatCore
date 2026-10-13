import { test, expect, type Page } from '@playwright/test';

// nov26-m4-t8（NayutaProducts#37）: MaplatCore のデモ（index.html ＋ demo/demo.ts）に足したデモ機能。
// デモは window.__MAPLAT_DEMO_APP__ に app を出す（検査用の口。デモはパッケージに入らない）。
// 面は feature 層の Feature の name が 'Polygon'（src/map_ex.ts の setVector）。

const REGIONS = ['morioka', 'nara', 'hiroshima', 'nobeoka', 'tatebayashi'] as const;
const SHOT_DIR = process.env.T8_SHOT_DIR ?? 'test-results-nov26-m4-t8';

const openDemo = async (page: Page, region: string, query = '') => {
    await page.goto(`/?region=${region}${query}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => (window as any).__MAPLAT_DEMO_APP__, undefined, { timeout: 60000 });
    // 操作パネルの節は app を作った直後に同期で作られる。地図の節が出るまで待つ
    await page.waitForSelector('#demo-controls .demo-sec', { timeout: 30000 });
};

// feature 層の面（name === 'Polygon'）の数と塗りの色
const polygons = (page: Page) =>
    page.evaluate(() => {
        const app = (window as any).__MAPLAT_DEMO_APP__;
        return app.mapObject
            .getSource('feature')
            .getFeatures()
            .filter((f: any) => f.get('name') === 'Polygon')
            .map((f: any) => {
                const fill = f.getStyle()?.getFill?.();
                const color = fill ? fill.getColor() : null;
                return typeof color === 'string' ? color : JSON.stringify(color);
            });
    });

// 層の namespaceID の marker を画面の点へ写し、そこをクリックする（ピンは下端が地点なので少し上を押す）
const clickPoi = async (page: Page, predicate: string) => {
    const point = await page.evaluate(async src => {
        const app = (window as any).__MAPLAT_DEMO_APP__;
        // eslint-disable-next-line no-new-func
        const pick = new Function('d', `return (${src})(d);`) as (d: any) => boolean;
        const feature = app.mapObject
            .getSource('marker')
            .getFeatures()
            .find((f: any) => f.get('datum') && pick(f.get('datum')));
        if (!feature) return null;
        const pixel = app.mapObject.getPixelFromCoordinate(feature.getGeometry().getCoordinates());
        const rect = app.mapObject.getViewport().getBoundingClientRect();
        return { x: pixel[0] + rect.left, y: pixel[1] + rect.top };
    }, predicate);
    expect(point, `marker not found: ${predicate}`).not.toBeNull();
    for (const dy of [-12, -8, -16, -4, -20]) {
        await page.mouse.click(point!.x, point!.y + dy);
        await page.waitForTimeout(200);
        const hit = await page.evaluate(() => (window as any).__T8_LAST_CLICK_MARKER__);
        if (hit) return;
    }
};

test.describe('nov26-m4-t8: デモ機能（NayutaProducts#37）', () => {
    test.setTimeout(180000);

    // 項目 1（t8/AC2・AC3）: 面が塗られ、面の出典が読める
    for (const region of REGIONS) {
        test(`項目 1: ${region} の面が rgba で塗られ、出典（OpenStreetMap・ODbL）が出る`, async ({ page }) => {
            await openDemo(page, region);
            await page
                .waitForFunction(
                    () =>
                        (window as any).__MAPLAT_DEMO_APP__.mapObject
                            .getSource('feature')
                            .getFeatures()
                            .some((f: any) => f.get('name') === 'Polygon'),
                    undefined,
                    { timeout: 30000 }
                )
                .catch(() => undefined);
            const fills = await polygons(page);
            expect(fills.length).toBeGreaterThanOrEqual(1);
            for (const c of fills) expect(c).toMatch(/^rgba\(/);
            const info = await page.locator('.c4h-info-box').innerText();
            expect(info).toContain('OpenStreetMap');
            expect(info).toContain('ODbL');
            // 地域説明に面の 1 行がある（REGION_META.highlights）
            await expect(page.locator('#region-note')).toContainText('（面）');
            await page.screenshot({ path: `${SHOT_DIR}/${region}.png`, fullPage: true });
        });
    }

    test('項目 1: 面のチェックを外すと面と出典が消え、入れ直すと戻る', async ({ page }) => {
        await openDemo(page, 'morioka');
        await expect.poll(async () => (await polygons(page)).length, { timeout: 30000 }).toBeGreaterThanOrEqual(1);
        const check = page.locator('#demo-controls .demo-check', { hasText: '盛岡城跡公園（岩手公園）の郭' }).locator('input');
        await check.uncheck();
        await expect.poll(async () => (await polygons(page)).length).toBe(0);
        await expect(page.locator('.c4h-info-box')).not.toContainText('ODbL');
        await check.check();
        await expect.poll(async () => (await polygons(page)).length).toBe(1);
        await expect(page.locator('.c4h-info-box')).toContainText('ODbL');
    });

    test('項目 1（R-t8-5）: 面の内側の POI をクリックすると clickMarker が発火する', async ({ page }) => {
        await openDemo(page, 'morioka');
        await expect.poll(async () => (await polygons(page)).length, { timeout: 30000 }).toBeGreaterThanOrEqual(1);
        await page.evaluate(() => {
            const app = (window as any).__MAPLAT_DEMO_APP__;
            (window as any).__T8_LAST_CLICK_MARKER__ = undefined;
            app.addEventListener('clickMarker', (e: any) => { (window as any).__T8_LAST_CLICK_MARKER__ = e.detail; });
        });
        // 桜山神社は盛岡城跡公園の面の内側（Issue #37 の実測）
        await clickPoi(page, `d => JSON.stringify(d.name).includes('桜山神社')`);
        const hit = await page.evaluate(() => (window as any).__T8_LAST_CLICK_MARKER__);
        expect(hit, 'clickMarker が発火しない').toBeTruthy();
    });
});
