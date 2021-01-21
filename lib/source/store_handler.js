"use strict";
import ObjectTin from "@maplat/tin";
const keys = [
    "title",
    "attr",
    "officialTitle",
    "dataAttr",
    "author",
    "createdAt",
    "era",
    "license",
    "dataLicense",
    "contributor",
    "mapper",
    "reference",
    "description",
    "url",
    "lang",
    "imageExtension"
];
export async function store2HistMap(store, byCompiled = false) {
    const ret = {};
    const tins = [];
    keys.forEach(key => {
        ret[key] = store[key];
    });
    if (store["imageExtention"])
        ret["imageExtension"] = store["imageExtention"];
    if (store.compiled) {
        const opt = {};
        if (!store.compiled.wh)
            opt.wh = [store.width, store.height];
        if (!store.compiled.strictMode)
            opt.strictMode = store.strictMode;
        if (!store.compiled.vertexMode)
            opt.vertexMode = store.vertexMode;
        if (!store.compiled.yaxisMode)
            opt.yaxisMode = store.yaxisMode;
        let tin = new ObjectTin(opt);
        tin.setCompiled(store.compiled);
        if (byCompiled) {
            tin = tin.getCompiled();
        }
        ret.strictMode = tin.strictMode;
        ret.vertexMode = tin.vertexMode;
        ret.yaxisMode = tin.yaxisMode;
        ret.width = tin.wh[0];
        ret.height = tin.wh[1];
        ret.gcps = tin.points;
        ret.edges = tin.edges;
        tins.push(tin);
    }
    else {
        ret.strictMode = store.strictMode;
        ret.vertexMode = store.vertexMode;
        ret.yaxisMode = store.yaxisMode;
        ret.width = store.width;
        ret.height = store.height;
        ret.gcps = store.gcps;
        ret.edges = store.edges;
        let tin = await createTinFromGcpsAsync(store.strictMode, store.vertexMode, store.yaxisMode, store.gcps, store.edges, [store.width, store.height]);
        if (byCompiled && typeof tin !== "string")
            tin = tin.getCompiled();
        tins.push(tin);
    }
    if (store.sub_maps) {
        ret.sub_maps = [];
        await Promise.all(store.sub_maps.map(async (sub_map) => {
            const sub = {};
            sub.importance = sub_map.importance;
            sub.priority = sub_map.priority;
            if (sub_map.compiled) {
                const opt = {};
                if (!sub_map.compiled.strictMode)
                    opt.strictMode = store.strictMode;
                if (!sub_map.compiled.vertexMode)
                    opt.vertexMode = store.vertexMode;
                if (!sub_map.compiled.yaxisMode)
                    opt.yaxisMode = store.yaxisMode;
                let tin = new ObjectTin(opt);
                tin.setCompiled(sub_map.compiled);
                if (byCompiled) {
                    tin = tin.getCompiled();
                }
                sub.bounds = tin.bounds;
                sub.gcps = tin.points;
                sub.edges = tin.edges;
                tins.push(tin);
            }
            else {
                sub.bounds = sub_map.bounds;
                sub.gcps = sub_map.gcps;
                sub.edges = sub_map.edges;
                let tin = await createTinFromGcpsAsync(store.strictMode, store.vertexMode, store.yaxisMode, sub_map.gcps, sub_map.edges, undefined, sub_map.bounds);
                if (byCompiled && typeof tin !== "string")
                    tin = tin.getCompiled();
                tins.push(tin);
            }
            ret.sub_maps.push(sub);
        }));
    }
    return [ret, tins];
}
export async function histMap2Store(histmap, tins) {
    const ret = {};
    keys.forEach(key => {
        ret[key] = histmap[key];
    });
    if (histmap["imageExtention"])
        ret["imageExtension"] = histmap["imageExtention"];
    const tin = tins.shift();
    if (typeof tin === "string") {
        ret.width = histmap.width;
        ret.height = histmap.height;
        ret.gcps = histmap.gcps;
        ret.edges = histmap.edges;
        ret.strictMode = histmap.strictMode;
        ret.vertexMode = histmap.vertexMode;
        ret.yaxisMode = histmap.yaxisMode;
    }
    else {
        ret.compiled = tin.getCompiled
            ? tin.getCompiled()
            : tin;
    }
    ret.sub_maps =
        tins.length > 0
            ? tins.map((tin, index) => {
                const sub_map = histmap.sub_maps[index];
                const sub = {
                    priority: sub_map.priority,
                    importance: sub_map.importance
                };
                if (typeof tin === "string") {
                    sub.gcps = sub_map.gcps;
                    sub.edges = sub_map.edges;
                    sub.bounds = sub_map.bounds;
                }
                else {
                    sub.compiled = tin.getCompiled
                        ? tin.getCompiled()
                        : tin;
                }
                return sub;
            })
            : [];
    return ret;
}
async function createTinFromGcpsAsync(strict, vertex, yaxis, gcps = [], edges = [], wh, bounds) {
    if (gcps.length < 3)
        return "tooLessGcps";
    const tin = new ObjectTin({
        yaxisMode: yaxis
    });
    if (wh) {
        tin.setWh(wh);
    }
    else if (bounds) {
        tin.setBounds(bounds);
    }
    else {
        throw "Both wh and bounds are missing";
    }
    tin.setStrictMode(strict);
    tin.setVertexMode(vertex);
    tin.setPoints(gcps);
    tin.setEdges(edges);
    try {
        await tin.updateTinAsync();
        return tin;
    }
    catch (err) {
        console.log(err);
        if (err == "SOME POINTS OUTSIDE") {
            return "pointsOutside";
        }
        else if (err.indexOf("TOO LINEAR") == 0) {
            return "tooLinear";
        }
        else if (err.indexOf("Vertex indices of edge") > -1 ||
            err.indexOf("is degenerate!") > -1 ||
            err.indexOf("already exists or intersects with an existing edge!") > -1) {
            return "edgeError";
        }
        else {
            throw err;
        }
    }
}
//# sourceMappingURL=store_handler.js.map