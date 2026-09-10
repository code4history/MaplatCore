import { test, expect } from '@playwright/test';

// oct26-m2-t1 AC1（主判定）の E2E。
// issue #101 の「非表示 iframe」「非表示コンテナ」を、レイアウト寸法 0 のコンテナ
// （display:none）で初期化する fixture で再現する。非表示コンテナでは rAF が走らず、
// かつコンテナ寸法が無いため OL の view が確定しない（issue 実測: canvas 400×300 の
// まま一度も描画されない）。
// 現行コードでは初期化中に "coordinates must contain numbers" が未捕捉で発生し、
// createObject が resolve しない（＝view が壊れたまま）。修正後は createObject が
// resolve し、可視化後に view が有限な zoom/center を返すことを確認する。

test.describe('oct26-m2-t1 非表示コンテナ初期化の View 安定化 (AC1)', () => {
  test.setTimeout(120000);

  test('非表示コンテナ(0サイズ)で初期化→可視化後に view の zoom/center が有限になる', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(String(err)));

    await page.goto('/e2e/fixture-hidden-init.html', { waitUntil: 'domcontentloaded' });

    // createObject が resolve する（修正後の契約。現行コードはここで timeout=FAIL）
    try {
      await page.waitForFunction(
        () => (window as any).__MAPLAT_APP__ !== undefined,
        null,
        { polling: 200, timeout: 30000 }
      );
    } catch (e) {
      console.log('AC1_FAIL_PAGE_ERRORS', JSON.stringify(pageErrors));
      throw e;
    }

    // 可視化: コンテナを表示し、visibilitychange を発火（非表示 iframe → 可視 の遷移を再現）
    await page.evaluate(() => {
      document.getElementById('map_div')!.classList.add('shown');
      document.dispatchEvent(new Event('visibilitychange'));
      const app = (window as any).__MAPLAT_APP__;
      if (app && app.mapObject) {
        app.mapObject.updateSize();
        app.mapObject.render();
      }
    });

    // 自己修復（再描画・view 確定）を待つ
    await page.waitForTimeout(1500);

    const state = await page.evaluate(() => {
      const app = (window as any).__MAPLAT_APP__;
      const view = app && app.mapObject && app.mapObject.getView();
      // 前面（メイン）地図の canvas。document.querySelector('#map_div canvas') は
      // 背面地図（circular）の canvas を先に拾ってしまうため、前面地図の viewport 直下を
      // 明示的に参照する。
      const frontCanvas =
        app && app.mapObject && typeof app.mapObject.getViewport === 'function'
          ? app.mapObject.getViewport().querySelector('canvas')
          : null;
      return {
        zoom: view ? view.getZoom() : undefined,
        center: view ? view.getCenter() : undefined,
        resolution: view ? view.getResolution() : undefined,
        mapSize: app && app.mapObject ? app.mapObject.getSize() : undefined,
        canvasWidth: frontCanvas ? (frontCanvas as HTMLElement).offsetWidth : undefined,
        canvasHeight: frontCanvas ? (frontCanvas as HTMLElement).offsetHeight : undefined
      };
    });
    console.log('AC1_STATE', JSON.stringify(state));
    console.log('AC1_PAGE_ERRORS', JSON.stringify(pageErrors));

    // AC1: 表示復帰後に有限な zoom と finite な center を返す
    expect(typeof state.zoom).toBe('number');
    expect(Number.isFinite(state.zoom)).toBe(true);
    expect(Array.isArray(state.center)).toBe(true);
    expect(state.center.length).toBeGreaterThanOrEqual(2);
    for (const c of (state.center as number[])) {
      expect(typeof c).toBe('number');
      expect(Number.isFinite(c)).toBe(true);
    }

    // AC1: "coordinates must contain numbers" が発生しない（issue #101 の破綻エラー）
    expect(
      pageErrors.filter((e) => e.includes('coordinates must contain numbers'))
    ).toEqual([]);

    // AC2（描画順序の判定手段 = MIN-3 で確定）: 可視化後に前面 map/canvas に正の寸法が
    // 確定している（changeMap → updateSize → render の既存描画経路が生きている実測）。
    // 初期化で view が壊れず self-heal が view 寸法を確定させたことの直接証拠。
    expect(Array.isArray(state.mapSize)).toBe(true);
    expect(Number.isFinite(state.mapSize[0]) && (state.mapSize[0] as number) > 0).toBe(true);
    expect(Number.isFinite(state.mapSize[1]) && (state.mapSize[1] as number) > 0).toBe(true);
    expect(typeof state.canvasWidth).toBe('number');
    expect((state.canvasWidth as number) > 0).toBe(true);
    expect(typeof state.canvasHeight).toBe('number');
    expect((state.canvasHeight as number) > 0).toBe(true);
  });
});
