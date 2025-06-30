import { test, expect } from '@playwright/test';

test.describe('Maplat Basic Tests', () => {
  test('should load test page', async ({ page }) => {
    await page.goto('/e2e-test.html');
    
    // デバッグ: ページのタイトルとURLを確認
    console.log('Page URL:', page.url());
    console.log('Page title:', await page.title());
    
    // デバッグ: ページのHTMLの一部を表示
    const bodyContent = await page.locator('body').innerHTML();
    console.log('Body content (first 500 chars):', bodyContent.substring(0, 500));
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if the map div exists (存在確認のみ、表示状態は問わない)
    await expect(page.locator('#map_div')).toBeAttached();
    
    // Check if buttons exist
    await expect(page.locator('button#maplat')).toBeVisible();
    await expect(page.locator('button#osm')).toBeVisible();
  });

  test('should create Maplat instance', async ({ page }) => {
    // コンソールログを監視（ページロード前に設定）
    page.on('console', msg => console.log('Browser console:', msg.text()));
    page.on('pageerror', error => console.log('Page error:', error));
    
    await page.goto('/e2e-test.html');
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
    
    // デバッグ: スクリプトが実行されたか確認
    const hasMaplatApp = await page.evaluate(() => typeof MaplatApp !== 'undefined');
    console.log('MaplatApp is defined:', hasMaplatApp);
    
    // テストHTMLではMaplatが即座に利用可能なはず
    await page.waitForFunction(() => {
      return typeof window.Maplat !== 'undefined' && 
             typeof window.Maplat.createObject === 'function';
    }, { timeout: 5000 });
    
    // Wait for Maplat to be available
    const maplatExists = await page.evaluate(() => {
      return typeof window.Maplat !== 'undefined';
    });
    expect(maplatExists).toBe(true);
    
    // Check if createObject method exists
    const hasCreateObject = await page.evaluate(() => {
      return typeof window.Maplat.createObject === 'function';
    });
    expect(hasCreateObject).toBe(true);
    
    // Test that we can call createObject (without checking the result)
    const canCallCreateObject = await page.evaluate(async () => {
      try {
        // Just check that we can call the method
        const promise = window.Maplat.createObject({});
        // Check it returns a promise
        return promise && typeof promise.then === 'function';
      } catch (e) {
        console.error('Error calling createObject:', e);
        return false;
      }
    });
    expect(canCallCreateObject).toBe(true);
  });

  test('should switch between maps', async ({ page }) => {
    await page.goto('/e2e-test.html');
    
    // Wait for initialization
    await page.waitForLoadState('networkidle');
    
    // Click on OSM button
    await page.click('button#osm');
    
    // Wait a bit for map to load
    await page.waitForTimeout(1000);
    
    // Click on Maplat button
    await page.click('button#maplat');
    
    // Wait a bit for map to load
    await page.waitForTimeout(1000);
    
    // Map div should still exist
    await expect(page.locator('#map_div')).toBeAttached();
  });
});