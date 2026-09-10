// oct26-m2-t3 (#94): 前面地図フラッシュ — 正式 AC1 fixture（主判定）
//
// AC1 = 前面地図 canvas が changeMap による地図切替（historical→base、destination コールドタイル）
//       中に完全透明（blank）になるフレームを 1 つも持たない。
//
// 実行条件（設計書 §8.1）:
//   1. 初期マップ（morioka_ndl2）のタイルがロード済み（ウォーム）になってから最初の historical→base 切替を行う。
//   2. destination（osm）のコールドタイルは、テストごとに独立なブラウザコンテキスト＋初回切替で保証する。
//   3. 切替前後を requestAnimationFrame でサンプリングし、blank フレーム数を expect(blankCount).toBe(0) で断言する。
//
// 修正前の世界では blank >= 1（exit 非 0 / FAIL）。修正後は blank === 0（PASS）になることを主判定とする。
import { test, expect } from '@playwright/test';

test.describe('issue-94: front map must not flash blank during changeMap', () => {
  test('historical→base 切替中に前面地図 canvas が blank になるフレームを持たない', async ({ page }) => {
    test.setTimeout(120000);
    await page.goto('/e2e/test.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => (window as any).__MAPLAT_APP__, undefined, { timeout: 30000 });

    const result = await page.evaluate(async () => {
      const app = (window as any).__MAPLAT_APP__;

      const isBlank = (canvas: HTMLCanvasElement | null): boolean => {
        if (!canvas || canvas.width === 0 || canvas.height === 0) return true;
        try {
          const ctx = canvas.getContext('2d');
          if (!ctx) return false;
          const w = canvas.width, h = canvas.height;
          const pts = [
            [Math.floor(w / 2), Math.floor(h / 2)],
            [Math.floor(w / 4), Math.floor(h / 4)],
            [Math.floor((3 * w) / 4), Math.floor(h / 4)],
            [Math.floor(w / 4), Math.floor((3 * h) / 4)],
            [Math.floor((3 * w) / 4), Math.floor((3 * h) / 4)],
          ];
          for (const [x, y] of pts) {
            const d = ctx.getImageData(x, y, 1, 1).data;
            // 非透明 かつ 非純白 の画素が 1 つでもあれば「描画済み」= blank ではない
            if (d[3] > 0 && !(d[0] > 250 && d[1] > 250 && d[2] > 250)) return false;
          }
          return true;
        } catch (_e) {
          return false;
        }
      };

      const frontCanvas = (): HTMLCanvasElement | null => {
        const frontDiv = document.querySelector('#map_div_front');
        if (!frontDiv) return null;
        const canvases = frontDiv.querySelectorAll('canvas');
        return canvases.length > 0 ? (canvases[0] as HTMLCanvasElement) : null;
      };

      // 初期マップ（morioka_ndl2）の前面 canvas が非 blank（タイル描画済み＝ウォーム）になるまで待つ。
      // 診断手順（設計書 §3.2）と同じく 2500ms の初回タイルロード待ちを前置し、その後に非 blank を確認する。
      // これによりサンプリング区間に入るのは「切替に起因する blank」だけになる（初期ロード blank を測らない）。
      await new Promise((res) => setTimeout(res, 2500));
      const warmDeadline = Date.now() + 30000;
      let warmed = false;
      while (Date.now() < warmDeadline) {
        if (!isBlank(frontCanvas())) {
          warmed = true;
          break;
        }
        await new Promise((res) => setTimeout(res, 100));
      }
      if (!warmed) {
        throw new Error('初期マップの前面 canvas がウォーム（非 blank）にならなかった');
      }

      // 切替前後を rAF でサンプリングし、changeMap("osm")（historical→base）を 1 回実行。
      const blankFrames: boolean[] = [];
      let running = true;
      const sampler = () => {
        blankFrames.push(isBlank(frontCanvas()));
        if (running) requestAnimationFrame(sampler);
      };
      requestAnimationFrame(sampler);
      app.changeMap('osm');
      await new Promise((res) => setTimeout(res, 800));
      running = false;

      const blankCount = blankFrames.filter((b) => b).length;
      return { total: blankFrames.length, blankCount };
    });

    console.log(`issue-94 AC1: historical→base 切替  total=${result.total} blank=${result.blankCount}`);
    // 主判定: blank フレームは 0 であること（修正前は blank >= 1 で FAIL する）
    expect(result.blankCount, `前面地図 canvas が切替中に blank になったフレーム数（期待 0）`).toBe(0);
  });
});
