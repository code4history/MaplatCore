import { test, expect, type Page } from '@playwright/test';

// nov26-m4-t4（#117）: 透過度 0 が復元に反映され、状態に透過度が載る。
// 地図を切り替えても透過度を保つ（changeMap が毎回 setTransparency を当て直す）。

const waitApp = async (page: Page) => {
    await page.waitForFunction(() => (window as any).__MAPLAT_APP__, undefined, { timeout: 30000 });
    await page.evaluate(async () => {
        await (window as any).__MAPLAT_APP__.waitReady;
    });
    // requestUpdateState の 50 ms の間引きを待つ
    await page.waitForTimeout(200);
};

// 古地図は item(0)、NowMap（osm）は item(1) に不透明度が当たる（src/map_ex.ts の setTransparency）
const opacity = (page: Page, index: number) =>
    page.evaluate(i => (window as any).__MAPLAT_APP__.mapObject.getLayers().item(i).getOpacity(), index);

test.describe('nov26-m4-t4: 透過度 0 の復元と透過度の保持（#117）', () => {
    test.setTimeout(90000);

    test('AC1: changeMap の restore.transparency=0 が効く', async ({ page }) => {
        await page.goto('e2e/test.html', { waitUntil: 'domcontentloaded' });
        await waitApp(page);
        await page.evaluate(async () => {
            const app = (window as any).__MAPLAT_APP__;
            await app.changeMap('osm');
            app.setTransparency(30);
            await app.changeMap('morioka_ndl2', { transparency: 0 });
        });
        await page.waitForTimeout(200);
        expect(await page.evaluate(() => (window as any).__MAPLAT_APP__.getTransparency())).toBe(0);
        expect(await opacity(page, 0)).toBeCloseTo(1, 5);
    });

    test('AC2: 透過度を設定しない起動の直後、stateBuffer.transparency が 0', async ({ page }) => {
        await page.goto('e2e/test.html', { waitUntil: 'domcontentloaded' });
        await waitApp(page);
        expect(await page.evaluate(() => (window as any).__MAPLAT_APP__.stateBuffer.transparency)).toBe(0);
    });

    test('AC3(a): ?restore_transparency=0 で起動すると状態と値が 0', async ({ page }) => {
        await page.goto('e2e/test.html?restore_transparency=0', { waitUntil: 'domcontentloaded' });
        await waitApp(page);
        const r = await page.evaluate(() => {
            const app = (window as any).__MAPLAT_APP__;
            return { state: app.stateBuffer.transparency, value: app.getTransparency() };
        });
        expect(r.state).toBe(0);
        expect(r.value).toBe(0);
    });

    // restoreSession の localStorage 経路。位置が無いとメルカトル原点を当てるため、
    // 盛岡の範囲の位置を先に既定起動で読んでから入れる（タスク設計レビュー MIN-t4-1）。
    const probePosition = async (page: Page) => {
        await page.goto('e2e/test.html', { waitUntil: 'domcontentloaded' });
        await waitApp(page);
        return page.evaluate(() => {
            const p = (window as any).__MAPLAT_APP__.stateBuffer.position;
            return { x: p.x, y: p.y, zoom: p.zoom, rotation: p.rotation };
        });
    };

    const bootFromSession = async (page: Page, transparency: number) => {
        const position = await probePosition(page);
        await page.addInitScript(
            ({ position, transparency }) => {
                localStorage.setItem('epoch', `${Math.floor(Date.now() / 1000)}`);
                localStorage.setItem('mapID', 'morioka_ndl2');
                localStorage.setItem('x', `${position.x}`);
                localStorage.setItem('y', `${position.y}`);
                localStorage.setItem('zoom', `${position.zoom}`);
                localStorage.setItem('rotation', `${position.rotation}`);
                localStorage.setItem('transparency', `${transparency}`);
            },
            { position, transparency }
        );
        await page.goto('e2e/test.html?noRestore=true&restoreSession=true', { waitUntil: 'domcontentloaded' });
        await waitApp(page);
    };

    test('AC3(b): restoreSession の localStorage の transparency=0 が状態に載る', async ({ page }) => {
        await bootFromSession(page, 0);
        const r = await page.evaluate(() => {
            const app = (window as any).__MAPLAT_APP__;
            return { restoreSession: app.restoreSession, state: app.stateBuffer.transparency };
        });
        expect(r.restoreSession).toBe(true);
        expect(r.state).toBe(0);
    });

    test('AC3(c): restoreSession の localStorage の transparency=40 が当たる', async ({ page }) => {
        await bootFromSession(page, 40);
        expect(await page.evaluate(() => (window as any).__MAPLAT_APP__.getTransparency())).toBe(40);
        expect(await opacity(page, 0)).toBeCloseTo(0.6, 5);
    });

    test('AC4: restore なしの changeMap でも透過度を保つ', async ({ page }) => {
        await page.goto('e2e/test.html', { waitUntil: 'domcontentloaded' });
        await waitApp(page);
        await page.evaluate(async () => {
            const app = (window as any).__MAPLAT_APP__;
            app.setTransparency(40);
            await app.changeMap('osm');
        });
        await page.waitForTimeout(200);
        expect(await page.evaluate(() => (window as any).__MAPLAT_APP__.getTransparency())).toBe(40);
        expect(await opacity(page, 1)).toBeCloseTo(0.6, 5);

        await page.evaluate(async () => {
            await (window as any).__MAPLAT_APP__.changeMap('morioka_ndl2');
        });
        await page.waitForTimeout(200);
        expect(await opacity(page, 0)).toBeCloseTo(0.6, 5);
    });
});
