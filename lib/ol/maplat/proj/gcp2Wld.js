import { inv, multiply, transpose } from 'mathjs';
export default function gcp2Wld(pixelCoordinates, geoCoordinates) {
    const A = [];
    const Bx = [];
    const By = [];
    for (let i = 0; i < pixelCoordinates.length; i++) {
        const [px, py] = [pixelCoordinates[i][0], pixelCoordinates[i][1]];
        const [gx, gy] = [geoCoordinates[i][0], geoCoordinates[i][1]];
        A.push([px, py, 1, 0, 0, 0]);
        A.push([0, 0, 0, px, py, 1]);
        Bx.push(gx);
        Bx.push(0);
        By.push(0);
        By.push(gy);
    }
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
//# sourceMappingURL=gcp2Wld.js.map