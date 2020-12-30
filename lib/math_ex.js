export function randomFromCenter(center, pow) {
    return center + (Math.random() - 0.5) * pow;
}
export function recursiveRound(val, decimal) {
    if (val instanceof Array)
        return val.map(item => recursiveRound(item, decimal));
    const decVal = Math.pow(10, decimal);
    return Math.round(val * decVal) / decVal;
}
function radians(deg) {
    return (deg * Math.PI) / 180;
}
export function getDistance(lnglat1, lnglat2) {
    return (6378.14 *
        Math.acos(Math.cos(radians(lnglat1[1])) *
            Math.cos(radians(lnglat2[1])) *
            Math.cos(radians(lnglat2[0]) - radians(lnglat1[0])) +
            Math.sin(radians(lnglat1[1])) * Math.sin(radians(lnglat2[1]))));
}
//# sourceMappingURL=math_ex.js.map