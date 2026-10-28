// 実在の IIIF のサーバー（国立国会図書館）への確認。環境変数 MAPLAT_IIIF_LIVE=1 のときだけ動く。
// ブラウザは使わず、決まった 5 件（info.json 1・タイル 4）を 1 回ずつ、並べずに取る（リトライなし）。
// CI では MAPLAT_IIIF_LIVE が無いので skip される。
import { test, expect } from '@playwright/test';

test.describe.configure({ retries: 0 });

const BASE = 'https://dl.ndl.go.jp/api/iiif/948741/R0000001';
const ORIGIN = 'https://example.org';

// 受け入れ条件の表の NDL の 4 タイル（すべて /0/default.jpg）
const TILES = [
  '768,512,256,256/256,/0/default.jpg',
  '0,0,2048,2048/256,/0/default.jpg',
  '3840,2560,234,145/234,/0/default.jpg',
  'full/255,/0/default.jpg'
];

test.describe('実在の IIIF のサーバー（国立国会図書館）', () => {
  test.skip(process.env.MAPLAT_IIIF_LIVE !== '1', 'MAPLAT_IIIF_LIVE=1 のときだけ動きます');

  test('info.json と 4 つのタイルが 200・JPEG・CORS * で取れる', async ({ request }) => {
    test.setTimeout(120000);

    const info = await request.get(`${BASE}/info.json`, { headers: { Origin: ORIGIN } });
    expect(info.status()).toBe(200);
    expect(info.headers()['access-control-allow-origin']).toBe('*');
    const json = await info.json();
    expect(json.width).toBe(4074);
    expect(json.height).toBe(2705);

    // 1 件ずつ、並べずに取る（外部に負荷をかけない）
    for (const tile of TILES) {
      const res = await request.get(`${BASE}/${tile}`, { headers: { Origin: ORIGIN } });
      expect(res.status(), tile).toBe(200);
      expect(res.headers()['content-type'], tile).toContain('image/jpeg');
      expect(res.headers()['access-control-allow-origin'], tile).toBe('*');
    }
  });
});
