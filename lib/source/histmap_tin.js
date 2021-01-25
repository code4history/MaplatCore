import { HistMap } from "./histmap";
import { addCoordinateTransforms, addProjection, toLonLat } from "ol/proj";
import Projection from "ol/proj/Projection";
import { transformDirect } from "../proj_ex";
import { polygon } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { MERC_MAX } from "../const_ex";
import { store2HistMap4Core } from "./store_handler";
export class HistMap_tin extends HistMap {
    constructor(options = {}) {
        super(options);
        this.tins = [];
    }
    static async createAsync(options) {
        const histmaps = await store2HistMap4Core(options);
        options = histmaps[0];
        const obj = new HistMap_tin(options);
        obj.tins = histmaps[1];
        const proj = new Projection({
            code: `Illst:${obj.mapID}`,
            extent: [0.0, 0.0, obj.width, obj.height],
            units: "m"
        });
        addProjection(proj);
        addCoordinateTransforms(proj, "EPSG:3857", xy => obj.tins[0].transform(xy, false), merc => obj.tins[0].transform(merc, true));
        transformDirect("EPSG:4326", proj);
        if (options.sub_maps) {
            options.sub_maps.map((sub_map, i) => {
                const index = i + 1;
                const projKey = `Illst:${obj.mapID}#${index}`;
                const tin = obj.tins[index];
                const proj = new Projection({
                    code: projKey,
                    extent: [tin.xy[0], tin.xy[1], tin.wh[0], tin.wh[1]],
                    units: "m"
                });
                addProjection(proj);
                addCoordinateTransforms(proj, "EPSG:3857", xy => tin.transform(xy, false, true), merc => tin.transform(merc, true, true));
                transformDirect("EPSG:4326", proj);
                const xyBounds = Object.assign([], sub_map.bounds);
                xyBounds.push(sub_map.bounds[0]);
                const mercBounds = xyBounds.map((xy) => tin.transform(xy, false));
                const xyBoundsPolygon = polygon([xyBounds]);
                const mercBoundsPolygon = polygon([mercBounds]);
                tin.xyBounds = xyBoundsPolygon;
                tin.mercBounds = mercBoundsPolygon;
            });
        }
        return obj;
    }
    xy2MercAsync_specifyLayer(xy, layerId) {
        const layerKey = `Illst:${this.mapID}${layerId ? `#${layerId}` : ""}`;
        return new Promise((resolve, _reject) => {
            resolve(transformDirect(layerKey, "EPSG:3857", xy));
        });
    }
    merc2XyAsync_specifyLayer(merc, layerId) {
        const layerKey = `Illst:${this.mapID}${layerId ? `#${layerId}` : ""}`;
        return new Promise((resolve, _reject) => {
            resolve(transformDirect("EPSG:3857", layerKey, merc));
        });
    }
    xy2MercAsync_returnLayer(xy) {
        return new Promise((resolve, reject) => {
            const tinSorted = this.tins
                .map((tin, index) => [index, tin])
                .sort((a, b) => (a[1].priority < b[1].priority ? 1 : -1));
            for (let i = 0; i < tinSorted.length; i++) {
                const index = tinSorted[i][0];
                const tin = tinSorted[i][1];
                if (index == 0 || booleanPointInPolygon(xy, tin.xyBounds)) {
                    this.xy2MercAsync_specifyLayer(xy, index)
                        .then(merc => {
                        resolve([index, merc]);
                    })
                        .catch(err => {
                        reject(err);
                    });
                    break;
                }
            }
        });
    }
    merc2XyAsync_returnLayer(merc) {
        return Promise.all(this.tins.map((tin, index) => new Promise((resolve, reject) => {
            this.merc2XyAsync_specifyLayer(merc, index)
                .then(xy => {
                if (index === 0 || booleanPointInPolygon(xy, tin.xyBounds)) {
                    resolve([tin, index, xy]);
                }
                else {
                    resolve([tin, index]);
                }
            })
                .catch(err => {
                reject(err);
            });
        }))).then(results => results
            .sort((a, b) => (a[0].priority < b[0].priority ? 1 : -1))
            .reduce((ret, result, priIndex, arry) => {
            const tin = result[0];
            const index = result[1];
            const xy = result[2];
            if (!xy)
                return ret;
            for (let i = 0; i < priIndex; i++) {
                const targetTin = arry[i][0];
                const targetIndex = arry[i][1];
                if (targetIndex === 0 ||
                    booleanPointInPolygon(xy, targetTin.xyBounds)) {
                    if (ret.length) {
                        const hide = !ret[0];
                        const storedTin = hide ? ret[1][2] : ret[0][2];
                        if (!hide || tin.importance < storedTin.importance) {
                            return ret;
                        }
                        else {
                            return [undefined, [index, xy, tin]];
                        }
                    }
                    else {
                        return [undefined, [index, xy, tin]];
                    }
                }
            }
            if (!ret.length || !ret[0]) {
                return [[index, xy, tin]];
            }
            else {
                ret.push([index, xy, tin]);
                return ret
                    .sort((a, b) => (a[2].importance < b[2].importance ? 1 : -1))
                    .filter((_row, i) => i < 2);
            }
        }, [])
            .map(row => {
            if (!row)
                return;
            return [row[0], row[1]];
        }));
    }
    mapSize2MercSize(callback) {
        const xy = [this.width / 2, this.height / 2];
        this.xy2MercAsync_returnLayer(xy)
            .then((results) => {
            const index = results[0];
            const mercCenter = results[1];
            const dir4 = [
                [xy[0] - 150, xy[1]],
                [xy[0] + 150, xy[1]],
                [xy[0], xy[1] - 150],
                [xy[0], xy[1] + 150]
            ];
            const envelope = [
                [0, 0],
                [this.width, 0],
                [this.width, this.height],
                [0, this.height]
            ];
            const proms = [];
            for (let i = 0; i < 9; i++) {
                const prom = i < 4
                    ? this.xy2MercAsync_specifyLayer(dir4[i], index)
                    : i == 4
                        ? Promise.resolve(mercCenter)
                        : this.xy2MercAsync_specifyLayer(envelope[i - 5], 0);
                proms.push(prom);
            }
            Promise.all(proms)
                .then((mercs) => {
                const delta1 = Math.sqrt(Math.pow(mercs[0][0] - mercs[1][0], 2) +
                    Math.pow(mercs[0][1] - mercs[1][1], 2));
                const delta2 = Math.sqrt(Math.pow(mercs[2][0] - mercs[3][0], 2) +
                    Math.pow(mercs[2][1] - mercs[3][1], 2));
                const delta = (delta1 + delta2) / 2;
                this.mercZoom =
                    Math.log((300 * (2 * MERC_MAX)) / 256 / delta) / Math.log(2) - 3;
                this.homePosition = toLonLat(mercs[4]);
                this.envelope = polygon([
                    [mercs[5], mercs[6], mercs[7], mercs[8], mercs[5]]
                ]);
                callback(this);
            })
                .catch(err => {
                throw err;
            });
        })
            .catch(err => {
            throw err;
        });
    }
    size2MercsAsync(center, zoom, rotate) {
        const cross = this.size2Xys(center, zoom, rotate).map((xy, index) => {
            if (index == 5)
                return xy;
            return this.histMapCoords2Xy(xy);
        });
        const promise = this.xy2MercAsync_returnLayer(cross[0]);
        return promise.then(results => {
            const index = results[0];
            const centerMerc = results[1];
            const promises = cross.map((val, i) => {
                if (i == 5)
                    return val;
                if (i == 0)
                    return Promise.resolve(centerMerc);
                return this.xy2MercAsync_specifyLayer(val, index);
            });
            return Promise.all(promises).catch(err => {
                throw err;
            });
        });
    }
    mercs2SizeAsync(mercs, asMerc = false) {
        let promises;
        if (asMerc) {
            promises = Promise.resolve(mercs);
        }
        else {
            promises = this.merc2XyAsync_returnLayer(mercs[0]).then(results => {
                const result = results[0] || results[1];
                const index = result[0];
                const centerXy = result[1];
                return Promise.all(mercs.map((merc, i) => {
                    if (i == 5)
                        return merc;
                    if (i == 0)
                        return centerXy;
                    return this.merc2XyAsync_specifyLayer(merc, index);
                }));
            });
        }
        return promises.then(xys => {
            if (!asMerc) {
                xys = xys.map((xy, i) => {
                    if (i == 5)
                        return xy;
                    return this.xy2HistMapCoords(xy);
                });
            }
            return this.xys2Size(xys);
        });
    }
    mercs2XysAsync(mercs) {
        const promises = this.merc2XyAsync_returnLayer(mercs[0]).then(results => {
            let hide = false;
            return Promise.all(results.map((result, i) => {
                if (!result) {
                    hide = true;
                    return;
                }
                const index = result[0];
                const centerXy = result[1];
                if (i != 0 && !hide)
                    return Promise.resolve([centerXy]);
                return Promise.all(mercs.map((merc, j) => {
                    if (j == 5)
                        return merc;
                    if (j == 0)
                        return Promise.resolve(centerXy);
                    return this.merc2XyAsync_specifyLayer(merc, index);
                }));
            }));
        });
        return promises
            .then(results => results.map((result) => {
            if (!result) {
                return;
            }
            return result.map((xy, i) => {
                if (i == 5)
                    return xy;
                return this.xy2HistMapCoords(xy);
            });
        }))
            .catch(err => {
            throw err;
        });
    }
    xy2MercAsync(xy) {
        const convertXy = this.histMapCoords2Xy(xy);
        return this.xy2MercAsync_returnLayer(convertXy).then(ret => ret[1]);
    }
    merc2XyAsync(merc, ignoreBackside = false) {
        return this.merc2XyAsync_returnLayer(merc).then(ret => {
            if (ignoreBackside && !ret[0])
                return;
            const convertXy = !ret[0] ? ret[1][1] : ret[0][1];
            return this.xy2HistMapCoords(convertXy);
        });
    }
}
//# sourceMappingURL=histmap_tin.js.map