// 層 A の適合テスト群（src/conformance/layer-a.ts）を実ブラウザで流す（仕様 §8.1・§8.2）。
//   - 実物の Core の要素（OpenLayers で地図を描く）
//   - 模擬の層 A（地図を描かない。公開面を満たすことの確認）
// 実行: node_modules/.bin/playwright test --config=e2e/wc-element.playwright.config.ts（単独・port 5198）
// CI（pnpm run test:e2e:ci＝playwright-ci.config.ts・port 5175 の dev サーバー）でも拾われる。vite の root はリポジトリ直下なので
// /demo/element.html と /e2e/wc-conformance.html はどちらの dev サーバーでも同じ経路で出る（baseURL 相対の goto）。
// スクリーンショットの保存先は環境変数 WC_SHOTS（無ければ test-results/wc-shots）。
import { test, expect } from '@playwright/test';
import { resolve } from 'path';

const SHOTS = process.env.WC_SHOTS || resolve(process.cwd(), 'test-results/wc-shots');

for (const impl of ['core', 'mock'] as const) {
  test(`層 A の適合テスト（${impl}）`, async ({ page }) => {
    test.setTimeout(300_000);
    const pageErrors: string[] = [];
    page.on('pageerror', err => pageErrors.push(String(err)));
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/e2e/wc-conformance.html?impl=${impl}`);
    await expect(page.getByTestId('summary')).toHaveAttribute('data-done', 'true', { timeout: 280_000 });
    const state = await page.evaluate(() => window.__conformance!);
    const failed = state.results.filter(r => !r.ok);
    console.log(
      `[conformance ${impl}] ${state.results.length} 件中 合格 ${state.results.length - failed.length}・不合格 ${failed.length}`
    );
    for (const r of state.results) console.log(`  ${r.ok ? 'OK' : 'NG'} [${r.group}] ${r.name}${r.error ? ` — ${r.error}` : ''}`);
    await page.screenshot({ path: `${SHOTS}/conformance-${impl}.png`, fullPage: true });
    expect(failed, failed.map(r => `[${r.group}] ${r.name}: ${r.error}`).join('\n')).toEqual([]);
    expect(state.results.length).toBeGreaterThanOrEqual(53);
    expect(pageErrors.filter(e => !/Failed to load resource|net::/.test(e))).toEqual([]);
  });
}
