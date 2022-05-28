import { getTransform, identityTransform, transform, addCoordinateTransforms } from "ol/proj";
export function transformDirect(src, dist, xy) {
    const srcCode = typeof src === "string" ? src : src.getCode();
    const distCode = typeof dist === "string" ? dist : dist.getCode();
    let func = getTransform(src, dist);
    if (func == identityTransform && srcCode != distCode) {
        const srcFunc = getTransform(src, "EPSG:3857");
        const distFunc = getTransform("EPSG:3857", dist);
        if (srcFunc == identityTransform && srcCode != "EPSG:3857")
            throw "Transform of Source projection is not defined.";
        if (distFunc == identityTransform && distCode != "EPSG:3857")
            throw "Transform of Distination projection is not defined.";
        func = function (xy) {
            return transform(transform(xy, src, "EPSG:3857"), "EPSG:3857", dist);
        };
        const invFunc = function (xy) {
            return transform(transform(xy, dist, "EPSG:3857"), "EPSG:3857", src);
        };
        addCoordinateTransforms(src, dist, func, invFunc);
    }
    if (xy) {
        return func(xy);
    }
}
//# sourceMappingURL=proj_ex.js.map