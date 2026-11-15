export { MERC_MAX, MERC_CROSSMATRIX } from "@maplat/transform";
import { IIIF_TILE_SIZE } from "./iiif/image";

// 透明PNG定義
export const transPng =
  "data:image/png;base64," +
  "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAB3RJTUUH3QgIBToaSbAjlwAAABd0" +
  "RVh0U29mdHdhcmUAR0xEUE5HIHZlciAzLjRxhaThAAAACHRwTkdHTEQzAAAAAEqAKR8AAAAEZ0FN" +
  "QQAAsY8L/GEFAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAFRJREFUeNrtwQEBAAAAgJD+" +
  "r+4ICgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
  "AAAAAAAAAAAAABgBDwABHHIJwwAAAABJRU5ErkJggg==";

// タイル画像サイズ（値の正本は依存のない iiif/image.ts の IIIF_TILE_SIZE）
export const tileSize = IIIF_TILE_SIZE;

// canvasのテンプレート
export const canvBase = `<canvas width="${tileSize}" height="${tileSize}" src="${transPng}"></canvas>`;
