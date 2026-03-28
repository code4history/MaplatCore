export { MERC_MAX, MERC_CROSSMATRIX } from "@maplat/transform";

// 透明PNG定義
export const transPng =
  "data:image/png;base64," +
  "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAB3RJTUUH3QgIBToaSbAjlwAAABd0" +
  "RVh0U29mdHdhcmUAR0xEUE5HIHZlciAzLjRxhaThAAAACHRwTkdHTEQzAAAAAEqAKR8AAAAEZ0FN" +
  "QQAAsY8L/GEFAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAFRJREFUeNrtwQEBAAAAgJD+" +
  "r+4ICgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
  "AAAAAAAAAAAAABgBDwABHHIJwwAAAABJRU5ErkJggg==";

// タイル画像サイズ
export const tileSize = 256;

// canvasのテンプレート
export const canvBase = `<canvas width="${tileSize}" height="${tileSize}" src="${transPng}"></canvas>`;
