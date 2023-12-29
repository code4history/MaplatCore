/**
 * @module ol/maplat/proj/gcp2Wld
 */

import {inv, multiply, transpose} from 'mathjs';

/*interface Coordinate {
  x: number;
  y: number;
}*/

// ピクセル座標と地図座標のデータを準備
/*const pixelCoordinates/*: Coordinate[]* / = [
  { x: 816.758385487528130, y: 685.980527891156044 },
  { x: 1356.133253514738954, y: 2767.091849433106745 },
  { x: 4477.800235827668985, y: 3797.400319274377580 },
  { x: 4448.921788662133622, y: 677.596462585028121 }
];
const geoCoordinates/*: Coordinate[]* / = [
  { x: 966000.000000000000000, y: 1315000.000000000000000 },
  { x: 967000.000000000000000, y: 1311000.000000000000000 },
  { x: 973000.000000000000000, y: 1309000.000000000000000 },
  { x: 973000.000000000000000, y: 1315000.000000000000000 }
];*/

export default function gcp2Wld(
  pixelCoordinates /*: Coordinate[]*/,
  geoCoordinates /*: Coordinate[]*/
) {
  // Prepare matrices
  const A = [];
  const Bx = [];
  const By = [];

  for (let i = 0; i < pixelCoordinates.length; i++) {
    const [px, py] = [pixelCoordinates[i].x, pixelCoordinates[i].y];
    const [gx, gy] = [geoCoordinates[i].x, geoCoordinates[i].y];

    A.push([px, py, 1, 0, 0, 0]);
    A.push([0, 0, 0, px, py, 1]);
    Bx.push(gx);
    Bx.push(0);
    By.push(0);
    By.push(gy);
  }

  // Calculate parameters using least squares
  const AtA = multiply(transpose(A), A);
  const AtBx = multiply(transpose(A), Bx);
  const AtBy = multiply(transpose(A), By);

  const paramsX = multiply(inv(AtA), AtBx);
  const paramsY = multiply(inv(AtA), AtBy);

  return {
    xScale: paramsX[0],
    yRotation: paramsX[1],
    xRotation: paramsY[3],
    yScale: paramsY[4],
    xOrigin: paramsX[2],
    yOrigin: paramsY[5],
  };
}
