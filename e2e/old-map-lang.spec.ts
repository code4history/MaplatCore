import { test, expect } from '@playwright/test';

// 古地図のデモの言語の切り替え（?lang=。無いときはブラウザの言語）。文言は demo/i18n/old-map.ts の辞書。
// Playwright の Chromium は英語の環境なので、日本語を見る spec は URL に &lang=ja を付けている。

const open = async (page: import('@playwright/test').Page, query: string) => {
    await page.goto(`/old-map.html?region=morioka&cache=0${query}`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => (window as any).__MAPLAT_DEMO_APP__, undefined, { timeout: 60000 });
    await page.waitForSelector('#demo-app-controls .demo-sec', { timeout: 30000 });
};

test.describe('古地図のデモの言語', () => {
    test('?lang=en で英語になり、日本語の画面文言が残らない', async ({ page }) => {
        await open(page, '&lang=en');
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
        await expect(page.locator('.c4h-header h1')).toHaveText('MaplatCore Old-Map Demo');
        await expect(page.locator('.c4h-back-link')).toHaveText('← Contents');
        await expect(page.locator('#region-select option').first()).toHaveText('Morioka');
        await expect(page.locator('#demo-cache h2')).toHaveText('Cache');
        // 見出し・節の見出し・ボタンに、ひらがな・カタカナは出ない（素材 JSON の POI・線・面の名前は日本語のデータなので、チェックの名前は見ない）
        const text = (await page.locator('.c4h-header, #demo-panel h2, #demo-panel button').allInnerTexts()).join('\n');
        const kana = text.match(/[぀-ヿ]/g);
        expect(kana, `かな: ${kana?.join('')}`).toBeNull();
    });

    test('?lang=ja で日本語になり、切り替えの「English」を押すと ?lang=en で読み込み直す', async ({ page }) => {
        await open(page, '&lang=ja');
        await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
        await expect(page.locator('#demo-cache h2')).toHaveText('キャッシュ');
        await expect(page.locator('.c4h-back-link')).toHaveText('← 目次');
        await expect(page.locator('.c4h-back-link')).toHaveAttribute('href', /lang=ja/);
        await page.locator('#lang-switch a[data-lang-switch="en"]').click();
        await page.waitForURL(/lang=en/);
        await page.waitForFunction(() => (window as any).__MAPLAT_DEMO_APP__, undefined, { timeout: 60000 });
        await expect(page.locator('#demo-cache h2')).toHaveText('Cache');
    });
});
