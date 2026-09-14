import { test, expect } from '@playwright/test';

// oct26-m2-t5（MaplatCore #109）の受け入れ条件 E2E。
// Maplat のタイル合成（src/source/mixin.ts setupTileLoadFunction）は、元画像の onload 内で
// 256×256 の作業 canvas に getContext("2d") → drawImage する。ここで例外が出ると、変更前は
// タイルが LOADING のまま残り、OL の TileQueue（読込中の上限 16）が埋まって以後のタイルを一切読まなくなった。
// 故障注入: 作業 canvas（256×256・地図の DOM 外）の getContext('2d') を一時的に null にする
// （oct26-m2-t3 #94 再診断 probe5 C1 を正式化したもの）。
// AC2: 注入中に読まれたタイルは ERROR で決着し、読込中数が 0 に戻る（上限 16 に張り付かない）。
// AC1: 注入解除後にパン／ズームすると、読込中数が 0 に戻り、新しい表示範囲のタイルが LOADED になる。
// 実行（CI と同じ設定）: ./node_modules/.bin/playwright test --config=playwright-ci.config.ts e2e/oct26-m2-t5-tile-load-exception.spec.ts

const TILE_STATE = { IDLE: 0, LOADING: 1, LOADED: 2, ERROR: 3, EMPTY: 4 };

async function boot(page: any) {
  await page.goto('/e2e/test.html', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => (window as any).__MAPLAT_APP__ !== undefined, null, {
    polling: 200,
    timeout: 60000
  });
  // 初期表示のタイル読込が一段落するまで待つ（ここは注入前なので変更前後とも 0 になる）
  await page.waitForFunction(
    () => (window as any).__MAPLAT_APP__.mapObject.tileQueue_.getTilesLoading() === 0,
    null,
    { polling: 200, timeout: 30000 }
  );
}

// 読込中数・キュー長と、レンダラのタイルキャッシュの状態別件数を返す
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
      injected: w.__M2T5_INJECTED__ || 0,
      zoom: m.getView().getZoom(),
      tiles
    };
  });
}

// 条件を満たすまでスナップショットを取り直す。満たさなければ最後のスナップショットを返す（判定は呼出側）
async function pollSnapshot(page: any, pred: (s: any) => boolean, timeoutMs: number) {
  const deadline = Date.now() + timeoutMs;
  let s = await snapshot(page);
  while (!pred(s) && Date.now() < deadline) {
    await page.waitForTimeout(250);
    s = await snapshot(page);
  }
  return s;
}

function countStates(tiles: { state: number }[]) {
  const c: Record<string, number> = {};
  for (const t of tiles) c[t.state] = (c[t.state] || 0) + 1;
  return c;
}

test('oct26-m2-t5: タイル合成の onload 内で例外が出ても TileQueue が詰まらず回復する（#109）', async ({ page }) => {
  test.setTimeout(120000);
  await boot(page);
  const base = await snapshot(page);
  const baseKeys = new Set(base.tiles.map((t: any) => t.key));

  // --- 注入開始: 作業 canvas の getContext('2d') を null にし、未読の範囲へズームする ---
  await page.evaluate(() => {
    const w = window as any;
    const proto = HTMLCanvasElement.prototype as any;
    w.__M2T5_ORIG_GETCONTEXT__ = proto.getContext;
    w.__M2T5_INJECTED__ = 0;
    proto.getContext = function (this: HTMLCanvasElement, type: string, opts?: any) {
      if (type === '2d' && this.width === 256 && this.height === 256 && !this.closest('.ol-viewport')) {
        w.__M2T5_INJECTED__++;
        return null;
      }
      return w.__M2T5_ORIG_GETCONTEXT__.call(this, type, opts);
    };
    const v = w.__MAPLAT_APP__.mapObject.getView();
    v.setZoom(v.getZoom() + 1);
  });
  // ズーム後の描画でタイルが作られる前に「読込中 0」を拾わないよう、新しいタイルが現れて全部決着するまで待つ
  // （firefox では setZoom 直後の描画前に読込中 0・キュー 0 の瞬間がある）
  const during = await pollSnapshot(
    page,
    s => {
      const fresh = s.tiles.filter((t: any) => !baseKeys.has(t.key));
      return (
        s.injected > 0 &&
        s.loading === 0 &&
        s.queued === 0 &&
        fresh.length > 0 &&
        fresh.every((t: any) => t.state !== TILE_STATE.IDLE && t.state !== TILE_STATE.LOADING)
      );
    },
    15000
  );
  const duringNew = during.tiles.filter((t: any) => !baseKeys.has(t.key));
  const duringKeys = new Set(during.tiles.map((t: any) => t.key));

  // --- 注入解除: 別の範囲へパンし、さらにズームを変える ---
  await page.evaluate(() => {
    const w = window as any;
    (HTMLCanvasElement.prototype as any).getContext = w.__M2T5_ORIG_GETCONTEXT__;
    const v = w.__MAPLAT_APP__.mapObject.getView();
    const size = w.__MAPLAT_APP__.mapObject.getSize();
    const res = v.getResolution();
    const c = v.getCenter();
    // 画面の 1/4 ずらし、注入前・注入中のどちらでも使っていないズームレベルへ上げて、未作成のタイルを要求させる
    // （ズームを戻すと注入前にキャッシュ済みのタイルしか要求されず、「新しいタイル」が現れない）
    v.setCenter([c[0] - size[0] * res * 0.25, c[1] + size[1] * res * 0.25]);
    v.setZoom(v.getZoom() + 1);
  });
  const after = await pollSnapshot(
    page,
    s => {
      const fresh = s.tiles.filter((t: any) => !duringKeys.has(t.key));
      return (
        s.loading === 0 &&
        s.queued === 0 &&
        fresh.some((t: any) => t.state === TILE_STATE.LOADED) &&
        fresh.every((t: any) => t.state !== TILE_STATE.LOADING)
      );
    },
    30000
  );
  const afterNew = after.tiles.filter((t: any) => !duringKeys.has(t.key));

  const report = {
    base: { loading: base.loading, queued: base.queued, zoom: base.zoom, states: countStates(base.tiles) },
    during: {
      loading: during.loading,
      queued: during.queued,
      injected: during.injected,
      zoom: during.zoom,
      newTileStates: countStates(duringNew)
    },
    after: {
      loading: after.loading,
      queued: after.queued,
      zoom: after.zoom,
      newTileStates: countStates(afterNew)
    }
  };
  console.log('[oct26-m2-t5]', JSON.stringify(report));

  // 前提: 注入が実際に効いた（作業 canvas の getContext が呼ばれて null を返した）
  expect(during.injected).toBeGreaterThan(0);
  // AC2: 注入中のタイルは LOADING に残らず ERROR で決着し、読込中数が 0 に戻る
  expect.soft(during.loading, 'AC2: 注入中の読込中数が 0 に戻る').toBe(0);
  expect.soft(
    duringNew.filter((t: any) => t.state === TILE_STATE.LOADING).length,
    'AC2: 注入中に作られたタイルが LOADING に残らない'
  ).toBe(0);
  expect.soft(
    duringNew.filter((t: any) => t.state === TILE_STATE.ERROR).length,
    'AC2: 注入中に作られたタイルが ERROR で決着する'
  ).toBeGreaterThan(0);
  // AC1: 注入解除後、読込中数が 0 に戻り、新しい範囲のタイルが LOADED になる
  expect.soft(after.loading, 'AC1: 注入解除後の読込中数が 0 に戻る').toBe(0);
  expect.soft(
    afterNew.filter((t: any) => t.state === TILE_STATE.LOADED).length,
    'AC1: 注入解除後の新しいタイルが LOADED になる'
  ).toBeGreaterThan(0);
  expect.soft(
    afterNew.filter((t: any) => t.state === TILE_STATE.LOADING).length,
    'AC1: 注入解除後の新しいタイルが LOADING に残らない'
  ).toBe(0);
});
