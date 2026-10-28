// 実在の IIIF のサーバー（国立国会図書館）への確認。環境変数 MAPLAT_IIIF_LIVE=1 のときだけ動く。
// ブラウザは使わず、決まった 7 件（info.json 2・タイル 5）を 1 回ずつ、並べずに取る（リトライなし）。
// CI では MAPLAT_IIIF_LIVE が無いので skip される。
import { test, expect } from '@playwright/test';

test.describe.configure({ retries: 0 });

// 同じ書誌の 2 つのコマ。1 つ目は受け入れ条件の表の資料、2 つ目はデモと e2e の資料が使う画像。
const SERVICES = [
  {
    base: 'https://dl.ndl.go.jp/api/iiif/948741/R0000001',
    // 受け入れ条件の表の NDL の 4 タイル（すべて /0/default.jpg）
    tiles: [
      '768,512,256,256/256,/0/default.jpg',
      '0,0,2048,2048/256,/0/default.jpg',
      '3840,2560,234,145/234,/0/default.jpg',
      'full/255,/0/default.jpg'
    ]
  },
  {
    base: 'https://dl.ndl.go.jp/api/iiif/948741/R0000003',
    tiles: ['768,512,256,256/256,/0/default.jpg']
  }
];
const ORIGIN = 'https://example.org';

test.describe('実在の IIIF のサーバー（国立国会図書館）', () => {
  test.skip(process.env.MAPLAT_IIIF_LIVE !== '1', 'MAPLAT_IIIF_LIVE=1 のときだけ動きます');

  test('2 つの画像の info.json と 5 つのタイルが 200・JPEG・CORS * で取れる', async ({ request }) => {
    test.setTimeout(120000);

    // 1 件ずつ、並べずに取る（外部に負荷をかけない）
    for (const { base, tiles } of SERVICES) {
      const info = await request.get(`${base}/info.json`, { headers: { Origin: ORIGIN } });
      expect(info.status(), base).toBe(200);
      expect(info.headers()['access-control-allow-origin'], base).toBe('*');
      const json = await info.json();
      expect(json.width, base).toBe(4074);
      expect(json.height, base).toBe(2705);

      for (const tile of tiles) {
        const res = await request.get(`${base}/${tile}`, { headers: { Origin: ORIGIN } });
        expect(res.status(), tile).toBe(200);
        expect(res.headers()['content-type'], tile).toContain('image/jpeg');
        expect(res.headers()['access-control-allow-origin'], tile).toBe('*');
      }
    }
  });
});
