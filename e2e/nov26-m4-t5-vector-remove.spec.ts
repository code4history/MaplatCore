import { test, expect, type Page } from '@playwright/test';

// nov26-m4-t5（#91）: 線・面を個別に、または種類ごとに消せる公開 API。
// feature 層の Feature の name（'Line'／'Polygon'。src/map_ex.ts の setVector）で数える。
// e2e/test.html は起動時に addLine で線を 1 本足すので、その 1 本も数に含める。

const waitApp = async (page: Page) => {
    await page.goto('e2e/test.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => (window as any).__MAPLAT_APP__, undefined, { timeout: 30000 });
    await page.evaluate(async () => {
        await (window as any).__MAPLAT_APP__.waitReady;
    });
};

// feature 層の name 別の数（座標変換の完了を待ってから数える）。
// 数がそろわないまま時間切れになっても、その時点の数を返して比較で差を見せる。
const countByName = async (page: Page, expectedTotal: number) => {
    await page
        .waitForFunction(
            n => (window as any).__MAPLAT_APP__.mapObject.getSource('feature').getFeatures().length === n,
            expectedTotal,
            { timeout: 10000 }
        )
        .catch(() => undefined);
    // 数がそろった後に遅れて描かれるものが無いことも見る
    await page.waitForTimeout(300);
    return page.evaluate(() => {
        const features = (window as any).__MAPLAT_APP__.mapObject.getSource('feature').getFeatures();
        const r: Record<string, number> = { Line: 0, Polygon: 0 };
        features.forEach((f: any) => {
            r[f.get('name')] = (r[f.get('name')] || 0) + 1;
        });
        return r;
    });
};

const LINE_A = [[141.151995, 39.701599], [141.153, 39.704]];
const LINE_B = [[141.150, 39.700], [141.152, 39.706]];
const POLY = [[[141.150, 39.700], [141.153, 39.700], [141.153, 39.703], [141.150, 39.700]]];
// map_ex の setVector は style を必須で読む（無いと例外）
const STYLE = { stroke: { color: '#00f', width: 2 }, fill: { color: 'rgba(0,0,255,0.2)' } };
const POLY2 = [[[141.154, 39.704], [141.156, 39.704], [141.156, 39.706], [141.154, 39.704]]];

const addTwoAndTwo = (page: Page) =>
    page.evaluate(
        ({ LINE_A, LINE_B, POLY, POLY2, STYLE }) => {
            const app = (window as any).__MAPLAT_APP__;
            return [
                app.addLine({ lnglats: LINE_A, stroke: { color: '#f00', width: 2 } }),
                app.addLine({ lnglats: LINE_B, stroke: { color: '#0f0', width: 2 } }),
                app.addVector({ type: 'Polygon', lnglats: POLY, style: STYLE }),
                app.addVector({ type: 'Polygon', lnglats: POLY2, style: STYLE })
            ];
        },
        { LINE_A, LINE_B, POLY, POLY2, STYLE }
    );

test.describe('nov26-m4-t5: 線・面の個別・種類ごとの削除（#91）', () => {
    test.setTimeout(90000);

    test('AC2: removeVector／removeLine でその 1 件だけが消える', async ({ page }) => {
        await waitApp(page);
        const ids = await addTwoAndTwo(page);
        expect(await countByName(page, 5)).toEqual({ Line: 3, Polygon: 2 });
        const r = await page.evaluate(ids => {
            const app = (window as any).__MAPLAT_APP__;
            return [app.removeVector(ids[2]), app.removeVector(ids[2])];
        }, ids);
        expect(r).toEqual([true, false]);
        expect(await countByName(page, 4)).toEqual({ Line: 3, Polygon: 1 });
        expect(await page.evaluate(ids => (window as any).__MAPLAT_APP__.removeLine(ids[0]), ids)).toBe(true);
        expect(await countByName(page, 3)).toEqual({ Line: 2, Polygon: 1 });
    });

    test('AC3: clearVector／clearLine の type 指定で種類だけを消す', async ({ page }) => {
        await waitApp(page);
        await addTwoAndTwo(page);
        expect(await countByName(page, 5)).toEqual({ Line: 3, Polygon: 2 });
        await page.evaluate(() => (window as any).__MAPLAT_APP__.clearVector({ type: 'Line' }));
        expect(await countByName(page, 2)).toEqual({ Line: 0, Polygon: 2 });
        await page.evaluate(() => (window as any).__MAPLAT_APP__.clearVector({ type: 'Polygon' }));
        expect(await countByName(page, 0)).toEqual({ Line: 0, Polygon: 0 });

        await addTwoAndTwo(page);
        expect(await countByName(page, 4)).toEqual({ Line: 2, Polygon: 2 });
        await page.evaluate(() => (window as any).__MAPLAT_APP__.clearLine({ type: 'Polygon' }));
        expect(await countByName(page, 2)).toEqual({ Line: 2, Polygon: 0 });
        await page.evaluate(() => (window as any).__MAPLAT_APP__.clearLine({ type: 'Line' }));
        expect(await countByName(page, 0)).toEqual({ Line: 0, Polygon: 0 });
    });

    test('AC4: 引数なしの clearLine()／clearVector() は全部消す', async ({ page }) => {
        await waitApp(page);
        await addTwoAndTwo(page);
        expect(await countByName(page, 5)).toEqual({ Line: 3, Polygon: 2 });
        await page.evaluate(() => (window as any).__MAPLAT_APP__.clearLine());
        expect(await countByName(page, 0)).toEqual({ Line: 0, Polygon: 0 });
        await addTwoAndTwo(page);
        expect(await countByName(page, 4)).toEqual({ Line: 2, Polygon: 2 });
        await page.evaluate(() => (window as any).__MAPLAT_APP__.clearVector());
        expect(await countByName(page, 0)).toEqual({ Line: 0, Polygon: 0 });
    });

    test('AC5: 個別に消した項目は changeMap の後に復活せず、残した項目は新しい地図で描き直される', async ({ page }) => {
        await waitApp(page);
        const ids = await page.evaluate(
            ({ LINE_A, LINE_B }) => {
                const app = (window as any).__MAPLAT_APP__;
                return [app.addLine({ lnglats: LINE_A, id: 'A', stroke: { color: '#f00', width: 2 } }),
                    app.addLine({ lnglats: LINE_B, id: 'B', stroke: { color: '#0f0', width: 2 } })];
            },
            { LINE_A, LINE_B }
        );
        expect(ids).toEqual(['A', 'B']);
        expect(await countByName(page, 3)).toEqual({ Line: 3, Polygon: 0 });
        // B の Feature（登録簿が持つ描いた Feature）が feature 層にあり、その座標を読む
        const coordOfLast = () =>
            page.evaluate(() => {
                const app = (window as any).__MAPLAT_APP__;
                const f = app.__vectorStore().get('B').feature;
                if (!app.mapObject.getSource('feature').getFeatures().includes(f)) return null;
                return f.getGeometry().getCoordinates();
            });
        const before = await coordOfLast();
        expect(await page.evaluate(() => (window as any).__MAPLAT_APP__.removeVector('A'))).toBe(true);
        expect(await countByName(page, 2)).toEqual({ Line: 2, Polygon: 0 });
        await page.evaluate(async () => {
            await (window as any).__MAPLAT_APP__.changeMap('osm');
        });
        expect(await countByName(page, 2)).toEqual({ Line: 2, Polygon: 0 });
        const after = await coordOfLast();
        expect(before).not.toBeNull();
        expect(after).not.toBeNull();
        expect(after).not.toEqual(before);
    });
});
