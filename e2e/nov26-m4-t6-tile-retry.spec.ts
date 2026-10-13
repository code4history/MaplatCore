import { test, expect } from '@playwright/test';

// nov26-m4-t6（MaplatCore #110）の受け入れ条件 E2E。
// タイル合成（src/source/mixin.ts setupTileLoadFunction）の onload 内の例外で ERROR になったタイルは、
// 変更前は 404 と同じ扱いで ERROR のまま残り、原因が解消してもパン・ズームしない限り空白だった
// （OL のレンダラは IDLE のタイルしかキューに入れない）。変更後は例外由来に限り、1／2／4 秒の遅延で
// 最大 3 回、OL の ImageTile.load()（ERROR → IDLE → LOADING）で読み直す。
// 故障注入は e2e/oct26-m2-t5-tile-load-exception.spec.ts と同じ（作業 canvas〔256×256・地図の DOM 外〕の
// getContext('2d') を null にする）。boot・snapshot・pollSnapshot も同所の形を写した（既存のファイルは変えない）。
// t6/AC1: 注入で ERROR になったタイルが、注入の解除後、view を動かさなくても LOADED になる。
// 申し送り MIN-t6-1: 再試行は最初の失敗から 1+2+4＝7 秒で尽きる。負荷の高い CI で解除が遅れると正しい実装でも
// LOADED にならないので、最初の ERROR を見たらすぐに解除し、最初の注入から解除までの経過時間を記録して
// 7 秒未満であることを前提として断言する。
// 実行（CI と同じ設定）: ./node_modules/.bin/playwright test --config=playwright-ci.config.ts e2e/nov26-m4-t6-tile-retry.spec.ts

const TILE_STATE = { IDLE: 0, LOADING: 1, LOADED: 2, ERROR: 3, EMPTY: 4 };

async function boot(page: any) {
  await page.goto('/e2e/test.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => (window as any).__MAPLAT_APP__ !== undefined, null, {
    polling: 200,
    timeout: 60000
  });
  // 初期表示のタイル読込が一段落するまで待つ（注入前）
  await page.waitForFunction(
    () => (window as any).__MAPLAT_APP__.mapObject.tileQueue_.getTilesLoading() === 0,
    null,
    { polling: 200, timeout: 30000 }
  );
}

// 読込中数・キュー長と、レンダラのタイルキャッシュの状態を返す
async function snapshot(page: any) {
  return await page.evaluate(() => {
    const w = window as any;
    const m = w.__MAPLAT_APP__.mapObject;
    const tiles: { key: string; z: number; state: number }[] = [];
    m.getLayers()
      .item(0)
      .getRenderer()
      .getTileCache()
      .forEach((t: any) => {
        tiles.push({ key: t.tileCoord.join('/'), z: t.tileCoord[0], state: t.getState() });
      });
    return {
      loading: m.tileQueue_.getTilesLoading(),
      queued: m.tileQueue_.getCount(),
      injected: w.__T6_INJECTED__ || 0,
      zoom: m.getView().getZoom(),
      tiles
    };
  });
}

// 条件を満たすまでスナップショットを取り直す。満たさなければ最後のスナップショットを返す（判定は呼出側）
async function pollSnapshot(page: any, pred: (s: any) => boolean, timeoutMs: number, intervalMs = 250) {
  const deadline = Date.now() + timeoutMs;
  let s = await snapshot(page);
  while (!pred(s) && Date.now() < deadline) {
    await page.waitForTimeout(intervalMs);
    s = await snapshot(page);
  }
  return s;
}

function countStates(tiles: { state: number }[]) {
  const c: Record<string, number> = {};
  for (const t of tiles) c[t.state] = (c[t.state] || 0) + 1;
  return c;
}

test('nov26-m4-t6: 例外で ERROR になったタイルが、注入の解除後に view を動かさなくても LOADED になる（#110）', async ({ page }) => {
  test.setTimeout(120000);
  await boot(page);
  const base = await snapshot(page);
  const baseKeys = new Set(base.tiles.map((t: any) => t.key));

  // --- 注入開始: 作業 canvas の getContext('2d') を null にし、未読の範囲へズームする ---
  await page.evaluate(() => {
    const w = window as any;
    const proto = HTMLCanvasElement.prototype as any;
    w.__T6_ORIG_GETCONTEXT__ = proto.getContext;
    w.__T6_INJECTED__ = 0;
    w.__T6_FIRST_INJECT_AT__ = undefined;
    proto.getContext = function (this: HTMLCanvasElement, type: string, opts?: any) {
      if (type === '2d' && this.width === 256 && this.height === 256 && !this.closest('.ol-viewport')) {
        if (w.__T6_INJECTED__ === 0) w.__T6_FIRST_INJECT_AT__ = performance.now();
        w.__T6_INJECTED__++;
        return null;
      }
      return w.__T6_ORIG_GETCONTEXT__.call(this, type, opts);
    };
    const v = w.__MAPLAT_APP__.mapObject.getView();
    v.setZoom(v.getZoom() + 1);
  });

  // 最初の ERROR を見たらすぐ解除する（MIN-t6-1）。全部の決着は待たない
  const during = await pollSnapshot(
    page,
    s => s.injected > 0 && s.tiles.some((t: any) => !baseKeys.has(t.key) && t.state === TILE_STATE.ERROR),
    15000,
    50
  );

  // --- 注入解除（view は動かさない）。最初の注入から解除までの経過時間を記録する ---
  const elapsedMs: number = await page.evaluate(() => {
    const w = window as any;
    (HTMLCanvasElement.prototype as any).getContext = w.__T6_ORIG_GETCONTEXT__;
    return performance.now() - (w.__T6_FIRST_INJECT_AT__ ?? performance.now());
  });
  // 解除の時点で ERROR だったタイルの key を控える（この後に注入なしで決着するタイルは対象にしない）
  const errorKeys = new Set(
    during.tiles
      .filter((t: any) => !baseKeys.has(t.key) && t.state === TILE_STATE.ERROR)
      .map((t: any) => t.key)
  );
  // 解除の直前に ERROR になったものも拾うため、解除直後にもう一度控える
  const justAfter = await snapshot(page);
  for (const t of justAfter.tiles) {
    if (!baseKeys.has(t.key) && t.state === TILE_STATE.ERROR) errorKeys.add(t.key);
  }

  const tracked = (s: any) => s.tiles.filter((t: any) => errorKeys.has(t.key));
  const after = await pollSnapshot(
    page,
    s => {
      const tr = tracked(s);
      return (
        tr.length > 0 &&
        tr.every((t: any) => t.state !== TILE_STATE.ERROR && t.state !== TILE_STATE.LOADING && t.state !== TILE_STATE.IDLE)
      );
    },
    15000
  );
  const afterTracked = tracked(after);

  const report = {
    base: { zoom: base.zoom, states: countStates(base.tiles) },
    during: { injected: during.injected, zoom: during.zoom, errorKeys: errorKeys.size },
    elapsedFromFirstInjectToReleaseMs: Math.round(elapsedMs),
    after: {
      loading: after.loading,
      queued: after.queued,
      zoom: after.zoom,
      trackedInCache: afterTracked.length,
      trackedStates: countStates(afterTracked)
    }
  };
  console.log('[nov26-m4-t6]', JSON.stringify(report));

  // 前提: 注入が実際に効き、ERROR のタイルができた
  expect(during.injected).toBeGreaterThan(0);
  expect(errorKeys.size, '前提: 注入中に ERROR のタイルができた').toBeGreaterThan(0);
  // 前提（MIN-t6-1）: 解除は再試行の持ち時間（1+2+4＝7 秒）の内に行われた
  expect(elapsedMs, '前提: 最初の注入から解除まで 7 秒未満').toBeLessThan(7000);
  // view を動かしていない
  expect(after.zoom).toBe(during.zoom);
  // t6/AC1: 控えたタイルのうちキャッシュに残っているものは ERROR が 0・LOADED が 1 以上
  expect.soft(afterTracked.filter((t: any) => t.state === TILE_STATE.ERROR).length, 't6/AC1: ERROR が 0').toBe(0);
  expect.soft(
    afterTracked.filter((t: any) => t.state === TILE_STATE.LOADED).length,
    't6/AC1: LOADED が 1 以上'
  ).toBeGreaterThan(0);
});
