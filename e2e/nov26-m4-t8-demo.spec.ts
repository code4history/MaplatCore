import { test, expect, type Page } from '@playwright/test';

// nov26-m4-t8（NayutaProducts#37）: MaplatCore のデモ（index.html ＋ demo/demo.ts）に足したデモ機能。
// デモは window.__MAPLAT_DEMO_APP__ に app を出す（検査用の口。デモはパッケージに入らない）。
// 面は feature 層の Feature の name が 'Polygon'（src/map_ex.ts の setVector）。POI は marker 層の Feature の datum。

const REGIONS = ['morioka', 'nara', 'hiroshima', 'nobeoka', 'tatebayashi'] as const;
const SHOT_DIR = process.env.T8_SHOT_DIR ?? 'test-results-nov26-m4-t8';
const COALESCE = ['changeViewpoint', 'updateState'];
const OSM_COPYRIGHT_LINK = '#vector-attr a[href="https://www.openstreetmap.org/copyright"]';

const openDemo = async (page: Page, region: string, query = '') => {
    await page.goto(`/?region=${region}${query}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => (window as any).__MAPLAT_DEMO_APP__, undefined, { timeout: 60000 });
    // 操作パネルの節は app を作った直後に同期で作られる。app ごとの節が出るまで待つ
    await page.waitForSelector('#demo-app-controls .demo-sec', { timeout: 30000 });
    // クリックの検査用: 最後の clickMarker の detail を控える
    await page.evaluate(() => {
        const app = (window as any).__MAPLAT_DEMO_APP__;
        (window as any).__T8_LAST_CLICK_MARKER__ = undefined;
        app.addEventListener('clickMarker', (e: any) => { (window as any).__T8_LAST_CLICK_MARKER__ = e.detail; });
    });
};

// feature 層の面（name === 'Polygon'）の塗りの色
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

// marker 層の POI のうち、namespaceID が prefix で始まるものの数とアイコンの src
const markersOf = (page: Page, prefix: string) =>
    page.evaluate(prefix => {
        const app = (window as any).__MAPLAT_DEMO_APP__;
        return app.mapObject
            .getSource('marker')
            .getFeatures()
            .filter((f: any) => String(f.get('datum')?.namespaceID ?? '').startsWith(prefix))
            .map((f: any) => {
                const style = f.getStyle();
                const image = (typeof style === 'function' ? null : style)?.getImage?.();
                return image?.getSrc?.() ?? '';
            });
    }, prefix);

// 地図の視点の移動（goHome などのアニメーション・操作）が止まるまで待つ。固定の待ち時間は CI の負荷で足りなくなる（B32 MIN-2）
const waitViewSettled = (page: Page) =>
    page.waitForFunction(() => {
        const view = (window as any).__MAPLAT_DEMO_APP__?.mapObject?.getView?.();
        return !!view && !view.getAnimating() && !view.getInteracting();
    }, undefined, { timeout: 30000 });

// namespaceID が prefix で始まる marker を画面の点へ写し、そこをクリックする（ピンは下端が地点なので少し上を押す）。
// 押すたびに視点の停止を待ち、画素を計算し直す（移動中に 1 回だけ計算すると別の地点を押す。B32 MIN-2）
const clickPoi = async (page: Page, prefix: string) => {
    const pointOf = () => page.evaluate(prefix => {
        const app = (window as any).__MAPLAT_DEMO_APP__;
        const feature = app.mapObject
            .getSource('marker')
            .getFeatures()
            .find((f: any) => String(f.get('datum')?.namespaceID ?? '').startsWith(prefix));
        if (!feature) return null;
        const pixel = app.mapObject.getPixelFromCoordinate(feature.getGeometry().getCoordinates());
        const rect = app.mapObject.getViewport().getBoundingClientRect();
        return { x: pixel[0] + rect.left, y: pixel[1] + rect.top };
    }, prefix);
    await page.evaluate(() => { (window as any).__T8_LAST_CLICK_MARKER__ = undefined; });
    for (const dy of [-12, -8, -16, -4, -20]) {
        await waitViewSettled(page);
        const point = await pointOf();
        expect(point, `marker not found: ${prefix}`).not.toBeNull();
        await page.mouse.click(point!.x, point!.y + dy);
        // clickMarker は同期で発火する（Core の click の受け手）。発火したかを短く待って確かめる
        const fired = await page
            .waitForFunction(() => (window as any).__T8_LAST_CLICK_MARKER__, undefined, { timeout: 2000 })
            .then(() => true, () => false);
        if (fired) return;
    }
};

// POI の無い地図の上の点（marker の Feature に当たらない点）を探してクリックする
const clickEmptyMap = async (page: Page) => {
    const point = await page.evaluate(() => {
        const app = (window as any).__MAPLAT_DEMO_APP__;
        const map = app.mapObject;
        const [w, h] = map.getSize();
        const rect = map.getViewport().getBoundingClientRect();
        for (const fx of [0.3, 0.7, 0.5, 0.2, 0.8]) {
            for (const fy of [0.7, 0.3, 0.5, 0.8, 0.2]) {
                const pixel = [w * fx, h * fy];
                const hit = map.forEachFeatureAtPixel(pixel, (f: any) => (f.get('datum') ? true : undefined));
                if (!hit) return { x: pixel[0] + rect.left, y: pixel[1] + rect.top };
            }
        }
        return null;
    });
    expect(point).not.toBeNull();
    await page.mouse.click(point!.x, point!.y);
};

const logTypes = (page: Page) =>
    page.locator('#event-log li').evaluateAll(lis => lis.map(li => (li as HTMLElement).dataset.type ?? ''));

test.describe('nov26-m4-t8: デモ機能（NayutaProducts#37）', () => {
    test.setTimeout(180000);

    test('m4-t9 E-1: 盛岡の初期表示は可視 POI と marker Feature の namespaceID が一対一', async ({ page }) => {
        await openDemo(page, 'morioka');
        // redraw・clear・hide を呼ばず、初期化時に始まった描画と視点移動の完了だけを待つ。
        await page.waitForFunction(() => {
            const app = (window as any).__MAPLAT_DEMO_APP__;
            return app && app.__redrawMarkerBlock === false && !app.__redrawMarkerThrottle?.length;
        }, undefined, { timeout: 30000 });
        await waitViewSettled(page);
        const { expected, actual } = await page.evaluate(() => {
            const app = (window as any).__MAPLAT_DEMO_APP__;
            const visible = (layers: Record<string, any>) => Object.values(layers ?? {})
                .filter((layer: any) => !layer.hide)
                .flatMap((layer: any) => layer.pois.map((poi: any) => poi.namespaceID));
            const expected: string[] = app.stateBuffer.hideMarker ? [] : [
                ...visible(app.pois), ...visible(app.from.pois)
            ];
            const actual: string[] = app.mapObject.getSource('marker').getFeatures()
                .map((feature: any) => feature.get('datum')?.namespaceID);
            // Feature 側を Set にせず、多重集合のまま比較する。
            return { expected: expected.sort(), actual: actual.sort() };
        });
        expect(expected).toHaveLength(7);
        expect(expected.every(id => typeof id === 'string' && id.length > 0)).toBe(true);
        expect(new Set(expected).size, '入力 POI の namespaceID に重複がある').toBe(expected.length);
        expect(actual).toEqual(expected);
    });

    // 項目 1（t8/AC2・AC3）: 面が rgba で塗られ、面の出典が読める。人間の確認用に画面を保存する
    for (const region of REGIONS) {
        test(`項目 1: ${region} の面が rgba で塗られ、出典（OpenStreetMap・ODbL）が出る`, async ({ page }) => {
            await openDemo(page, region);
            await expect.poll(async () => (await polygons(page)).length, { timeout: 30000 }).toBeGreaterThanOrEqual(1);
            const fills = await polygons(page);
            for (const c of fills) expect(c).toMatch(/^rgba\(/);
            const info = await page.locator('.c4h-info-box').innerText();
            expect(info).toContain('OpenStreetMap');
            expect(info).toContain('ODbL');
            // OpenStreetMap の表示義務: 著作権表示と copyright ページへのリンク
            await expect(page.locator('#vector-attr')).toContainText('© OpenStreetMap contributors');
            expect(await page.locator(OSM_COPYRIGHT_LINK).count()).toBeGreaterThanOrEqual(1);
            // 地域説明に面の 1 行がある（REGION_META.highlights）
            await expect(page.locator('#region-note')).toContainText('（面）');
            await page.waitForTimeout(1000);
            await page.screenshot({ path: `${SHOT_DIR}/${region}.png`, fullPage: true });
        });
    }

    test('項目 1: 面のチェックを外すと面と出典が消え、入れ直すと戻る', async ({ page }) => {
        await openDemo(page, 'morioka');
        await expect.poll(async () => (await polygons(page)).length, { timeout: 30000 }).toBe(1);
        const check = page.locator('#demo-app-controls .demo-check', { hasText: '盛岡城跡公園（岩手公園）の郭' }).locator('input');
        await check.uncheck();
        await expect.poll(async () => (await polygons(page)).length).toBe(0);
        await expect(page.locator('.c4h-info-box')).not.toContainText('ODbL');
        await expect(page.locator('.c4h-info-box')).not.toContainText('© OpenStreetMap contributors');
        await expect(page.locator(OSM_COPYRIGHT_LINK)).toHaveCount(0);
        await check.check();
        await expect.poll(async () => (await polygons(page)).length).toBe(1);
        await expect(page.locator('.c4h-info-box')).toContainText('ODbL');
        await expect(page.locator('#vector-attr')).toContainText('© OpenStreetMap contributors');
        await expect(page.locator(OSM_COPYRIGHT_LINK)).toHaveCount(1);
    });

    test('項目 1（R-t8-5）: 面の内側の POI をクリックすると clickMarker が発火する', async ({ page }) => {
        await openDemo(page, 'morioka');
        await expect.poll(async () => (await polygons(page)).length, { timeout: 30000 }).toBe(1);
        // アプリ用 POI（層 "app"）の先頭は桜山神社＝盛岡城跡公園の面の内側（Issue #37 の実測）
        // nov26-m4-t9（#134）で描画を直列化したため、B32 で保留した厳密な一件を復元する。
        await expect.poll(async () => (await markersOf(page, 'app_0')).length, { timeout: 30000 }).toBe(1);
        await clickPoi(page, 'app_0');
        const hit = await page.evaluate(() => (window as any).__T8_LAST_CLICK_MARKER__);
        expect(hit, 'clickMarker が発火しない').toBeTruthy();
    });

    // 項目 2（Issue #37 の 2）: 層の一覧と層ごとの表示切替
    test('項目 2: 層の一覧の行数が listPoiLayers と一致し、チェックを外すとその層の POI が消える', async ({ page }) => {
        await openDemo(page, 'morioka');
        const layerRows = page.locator('#poi-layers .demo-poi-layer:not([data-layer$="#all"])');
        const ids = await page.evaluate(() =>
            (window as any).__MAPLAT_DEMO_APP__.listPoiLayers().map((l: any) => l.namespaceID)
        );
        await expect(layerRows).toHaveCount(ids.length);
        expect(ids).toContain('app');
        await expect.poll(async () => (await markersOf(page, 'app_')).length, { timeout: 30000 }).toBeGreaterThan(0);
        await page.locator('#poi-layers .demo-poi-layer[data-layer="app"] input').uncheck();
        await expect.poll(async () => (await markersOf(page, 'app_')).length).toBe(0);
        expect(await page.evaluate(() => (window as any).__MAPLAT_DEMO_APP__.getPoiLayer('app').hide)).toBe(true);
        await page.locator('#poi-layers .demo-poi-layer[data-layer="app"] input').check();
        await expect.poll(async () => (await markersOf(page, 'app_')).length).toBeGreaterThan(0);
    });

    // 項目 3（Issue #37 の 3）: 層ごとの clearMarker と <mapID>#all
    test('項目 3: 層の「消す」でその層が 0 件、<mapID>#all でこの地図の層が全部 0 件', async ({ page }) => {
        await openDemo(page, 'morioka');
        await page.locator('#poi-layers .demo-poi-layer[data-layer="app"] button').click();
        await expect.poll(() =>
            page.evaluate(() => (window as any).__MAPLAT_DEMO_APP__.getPoiLayer('app').pois.length)
        ).toBe(0);
        await expect(page.locator('#poi-layers .demo-poi-layer[data-layer="app"]')).toContainText(': 0 件');
        const allRow = page.locator('#poi-layers .demo-poi-layer[data-layer$="#all"]');
        await expect(allRow).toHaveCount(1);
        const mapID = await page.evaluate(() => (window as any).__MAPLAT_DEMO_APP__.currentMapInfo().mapID);
        await expect(allRow).toHaveAttribute('data-layer', `${mapID}#all`);
        await allRow.locator('button').click();
        await expect.poll(() =>
            page.evaluate(() =>
                (window as any).__MAPLAT_DEMO_APP__
                    .listPoiLayers()
                    .filter((l: any) => String(l.namespaceID).includes('#'))
                    .reduce((n: number, l: any) => n + l.pois.length, 0)
            )
        ).toBe(0);
    });

    // 項目 4（Issue #37 の 4）: icon・selectedIcon の層・iconTemplate の層・重なった POI と clickMarkers・poiTemplate
    test('項目 4: 層の icon で描かれ、iconTemplate で年代ごとにアイコンが変わる', async ({ page }) => {
        await openDemo(page, 'morioka');
        await page.getByRole('button', { name: 'アイコン指定の層を足す' }).click();
        const layerIcon = await page.evaluate(() => (window as any).__MAPLAT_DEMO_APP__.getPoiLayer('icon_demo').icon);
        expect(layerIcon).toMatch(/^data:image\/svg\+xml/);
        await expect.poll(async () => (await markersOf(page, 'icon_demo_')).length, { timeout: 30000 }).toBeGreaterThan(0);
        for (const src of await markersOf(page, 'icon_demo_')) expect(src).toBe(layerIcon);
        await page.getByRole('button', { name: '年代で色を変える層を足す' }).click();
        await expect.poll(async () => (await markersOf(page, 'era_demo_')).length, { timeout: 30000 }).toBeGreaterThan(1);
        const eraSrcs = new Set(await markersOf(page, 'era_demo_'));
        expect(eraSrcs.size).toBeGreaterThanOrEqual(2);
        await expect(page.locator('#poi-layers .demo-poi-layer[data-layer="era_demo"]')).toHaveCount(1);
    });

    test('項目 4: 同じ地点の 2 件で clickMarkers が 2 件、detail.html は sanitizeHtml を通して script が無い', async ({ page }) => {
        await openDemo(page, 'morioka');
        await page.getByRole('button', { name: '同じ地点に 2 件置く' }).click();
        await expect.poll(async () => (await markersOf(page, 'overlap_demo_')).length, { timeout: 30000 }).toBe(2);
        // goHome の移動が収まるのは clickPoi が押すたびに待つ（固定の待ちを置かない。B32 MIN-2）
        await clickPoi(page, 'overlap_demo_');
        await expect(page.locator('#poi-hits')).toContainText('clickMarkers:');
        const n = Number((await page.locator('#poi-hits').innerText()).match(/clickMarkers: (\d+) 件/)?.[1] ?? '0');
        // nov26-m4-t9（#134）: 同位置の二つの POI を、一件ずつ返す厳密条件。
        expect(n).toBe(2);
        await expect(page.locator('#poi-hits')).toContainText('重なった POI');
        await expect(page.locator('#poi-detail strong')).toHaveCount(1);
        await expect(page.locator('#poi-detail script')).toHaveCount(0);
    });

    // 項目 5（Issue #37 の 6）: remove()・再生成・restoreSession 付き・未知の mapID
    test('項目 5: 再生成で地図が 1 つだけ作り直され、remove() で消え、未知の mapID は地図を変えない', async ({ page }) => {
        await openDemo(page, 'morioka');
        const viewports = () => page.locator('#map_div .ol-viewport').count();
        const before = await viewports();
        expect(before).toBeGreaterThan(0);
        await page.evaluate(() => { (window as any).__MAPLAT_DEMO_APP__.__t8Old = true; });
        await page.getByRole('button', { name: '再生成', exact: true }).click();
        await page.waitForFunction(() => {
            const app = (window as any).__MAPLAT_DEMO_APP__;
            return app && !app.__t8Old;
        }, undefined, { timeout: 60000 });
        await expect.poll(viewports).toBe(before);
        await expect(page.locator('#demo-app-controls section h2', { hasText: '地図' })).toHaveCount(1);
        await expect(page.locator('#demo-fixed-controls section h2', { hasText: 'イベント履歴' })).toHaveCount(1);

        await page.getByRole('button', { name: 'remove()' }).click();
        await expect.poll(() => page.evaluate(() => (window as any).__MAPLAT_DEMO_APP__)).toBeUndefined();
        await expect.poll(viewports).toBe(0);
        await expect(page.locator('#demo-app-controls section')).toHaveCount(0);

        await page.getByRole('button', { name: 'restoreSession 付きで再生成' }).click();
        await page.waitForFunction(() => (window as any).__MAPLAT_DEMO_APP__, undefined, { timeout: 60000 });
        await expect.poll(viewports).toBe(before);
        expect(page.url()).toContain('restoreSession=1');
        expect(await page.evaluate(() => (window as any).__MAPLAT_DEMO_APP__.restoreSession)).toBe(true);

        const mapID = await page.evaluate(() => (window as any).__MAPLAT_DEMO_APP__.currentMapInfo().mapID);
        await page.getByRole('button', { name: '未知の mapID' }).click();
        await expect(page.locator('#state-unknown-map')).toContainText('__unknown__');
        await expect(page.locator('#state-unknown-map')).toContainText(`${mapID} のまま`);
    });

    // 項目 6（Issue #37 の 7）: 状態とイベント履歴
    test('項目 6: clickMap が状態と履歴の先頭に出て、changeViewpoint・updateState は続けて並ばない', async ({ page }) => {
        await openDemo(page, 'morioka');
        // 視点を何度か動かす（changeViewpoint・updateState が続けて来る）
        const box = (await page.locator('#map_div').boundingBox())!;
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        for (let i = 0; i < 4; i++) {
            await page.mouse.wheel(0, i % 2 ? 200 : -200);
            await page.waitForTimeout(400);
        }
        await page.waitForTimeout(800);
        const types = await logTypes(page);
        expect(types.length).toBeGreaterThan(0);
        expect(types.length).toBeLessThanOrEqual(50);
        for (let i = 0; i + 1 < types.length; i++) {
            if (COALESCE.includes(types[i])) expect(types[i + 1], `${i} 番目と次が同種`).not.toBe(types[i]);
        }
        expect(types).toContain('changeViewpoint');
        await expect(page.locator('#state-viewpoint')).toContainText('経度');

        await clickEmptyMap(page);
        await expect.poll(async () => (await logTypes(page))[0]).toBe('clickMap');
        await expect(page.locator('#state-click')).toContainText('経度');
        await expect(page.locator('#state-rotation')).toContainText('回転');
    });
});
