import { HistMap } from "./histmap";
import Tin from "@maplat/tin";
import {
  addCoordinateTransforms,
  addProjection,
  toLonLat
} from "ol/proj";
import Projection from "ol/proj/Projection";
import { transformDirect } from "../proj_ex";
import { polygon } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { MERC_MAX } from "../const_ex";
import {Coordinate} from "ol/coordinate";

export class HistMap_tin extends HistMap {
  tins: Tin[];

  constructor(options: any = {}) {
    super(options);

    this.tins = [
      new Tin({
        wh: [this.width, this.height],
        strictMode: options.strictMode,
        vertexMode: options.vertexMode,
        importance: 0,
        priority: 0
      })
    ];
  }

  static async createAsync(options: any) {
    const obj = new HistMap_tin(options);
    const proj = new Projection({
      code: `Illst:${obj.mapID}`,
      extent: [0.0, 0.0, obj.width, obj.height],
      units: "m"
    });
    addProjection(proj);
    addCoordinateTransforms(
      proj,
      "EPSG:3857",
      xy => obj.tins[0].transform(xy, false) as Coordinate,
      merc => obj.tins[0].transform(merc, true) as Coordinate
    );
    transformDirect("EPSG:4326", proj);
    if (options.compiled) {
      obj.tins[0].setCompiled(options.compiled);
    } else {
      obj.tins[0].setPoints(options.gcps);
      obj.tins[0].setEdges(options.edges);
      await obj.tins[0].updateTinAsync();
    }

    if (options.sub_maps) {
      const promarray = options.sub_maps.map(async (sub_map: any, i: any) => {
        const index = i + 1;
        const projKey = `Illst:${obj.mapID}#${index}`;
        const tin = (obj.tins[index] = new Tin({
          bounds: sub_map.bounds,
          strictMode: options.strictMode,
          vertexMode: options.vertexMode,
          importance: sub_map.importance,
          priority: sub_map.priority
        }));
        const proj = new Projection({
          code: projKey,
          extent: [tin.xy![0], tin.xy![1], tin.wh![0], tin.wh![1]],
          units: "m"
        });
        addProjection(proj);
        addCoordinateTransforms(
          proj,
          "EPSG:3857",
          xy => tin.transform(xy, false, true) as Coordinate,
          merc => tin.transform(merc, true, true) as Coordinate
        );
        transformDirect("EPSG:4326", proj);
        if (sub_map.compiled) {
          tin.setCompiled(sub_map.compiled);
        } else {
          tin.setPoints(sub_map.gcps);
          tin.setEdges(sub_map.edges);
          await tin.updateTinAsync();
        }

        const xyBounds = Object.assign([], sub_map.bounds);
        xyBounds.push(sub_map.bounds[0]);
        const mercBounds = xyBounds.map((xy: any) => tin.transform(xy, false));
        const xyBoundsPolygon = polygon([xyBounds]);
        const mercBoundsPolygon = polygon([mercBounds]);
        tin.xyBounds = xyBoundsPolygon;
        tin.mercBounds = mercBoundsPolygon;
      });
      await Promise.all(promarray);
    }
    return obj;
  }

  xy2MercAsync_specifyLayer(xy: any, layerId: any) {
    const layerKey = `Illst:${this.mapID}${layerId ? `#${layerId}` : ""}`;
    return new Promise((resolve, _reject) => {
      resolve(transformDirect(layerKey, "EPSG:3857", xy));
    }).catch(err => {
      throw err;
    });
  }

  merc2XyAsync_specifyLayer(merc: any, layerId: any) {
    const layerKey = `Illst:${this.mapID}${layerId ? `#${layerId}` : ""}`;
    return new Promise((resolve, _reject) => {
      resolve(transformDirect("EPSG:3857", layerKey, merc));
    }).catch(err => {
      throw err;
    });
  }

  xy2MercAsync_returnLayer(xy: any) {
    return new Promise((resolve, reject) => {
      const tinSorted = this.tins
        .map((tin: any, index: any) => [index, tin])
        .sort((a: any, b: any) => (a[1].priority < b[1].priority ? 1 : -1));

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
    }).catch(err => {
      throw err;
    });
  }

  merc2XyAsync_returnLayer(merc: any) {
    return Promise.all(
      this.tins.map(
        (tin: any, index: any) =>
          new Promise((resolve, reject) => {
            this.merc2XyAsync_specifyLayer(merc, index)
              .then((xy: any) => {
                if (index == 0 || booleanPointInPolygon(xy, tin.xyBounds)) {
                  resolve([tin, index, xy]);
                } else {
                  resolve([tin, index]);
                }
              })
              .catch(err => {
                reject(err);
              });
          })
      )
    )
      .then((results: any) =>
        results
          .sort((a: any, b: any) => (a[0].priority < b[0].priority ? 1 : -1))
          .reduce((ret: any, result: any, priIndex: number, arry: any) => {
            const tin = result[0];
            const index = result[1];
            const xy = result[2];
            if (!xy) return ret;
            for (let i = 0; i < priIndex; i++) {
              const targetTin = arry[i][0];
              const targetIndex = arry[i][1];
              if (
                targetIndex == 0 ||
                booleanPointInPolygon(xy, targetTin.xyBounds)
              ) {
                if (ret.length) {
                  const hide = !ret[0];
                  const storedTin = hide ? ret[1][2] : ret[0][2];
                  if (!hide || tin.importance < storedTin.importance) {
                    return ret;
                  } else {
                    return [undefined, [index, xy, tin]];
                  }
                } else {
                  return [undefined, [index, xy, tin]];
                }
              }
            }
            if (!ret.length || !ret[0]) {
              return [[index, xy, tin]];
            } else {
              ret.push([index, xy, tin]);
              return ret
                .sort((a: any, b: any) =>
                  a[2].importance < b[2].importance ? 1 : -1
                )
                .filter((_row: any, i: any) => i < 2);
            }
          }, [])
          .map((row: any) => {
            if (!row) return;
            return [row[0], row[1]];
          })
      )
      .catch(err => {
        throw err;
      });
  }

  mapSize2MercSize(callback: any) {
    const xy = [this.width / 2, this.height / 2];
    this.xy2MercAsync_returnLayer(xy)
      .then((results: any) => {
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
          const prom =
            i < 4
              ? this.xy2MercAsync_specifyLayer(dir4[i], index)
              : i == 4
              ? Promise.resolve(mercCenter)
              : this.xy2MercAsync_specifyLayer(envelope[i - 5], 0);
          proms.push(prom);
        }
        Promise.all(proms)
          .then((mercs: any) => {
            const delta1 = Math.sqrt(
              Math.pow(mercs[0][0] - mercs[1][0], 2) +
                Math.pow(mercs[0][1] - mercs[1][1], 2)
            );
            const delta2 = Math.sqrt(
              Math.pow(mercs[2][0] - mercs[3][0], 2) +
                Math.pow(mercs[2][1] - mercs[3][1], 2)
            );
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

  // 画面サイズと地図ズームから、メルカトル座標上での5座標を取得する。zoom, rotate無指定の場合は自動取得
  size2MercsAsync(center: any, zoom: any, rotate: any) {
    const cross = this.size2Xys(center, zoom, rotate).map((xy, index) => {
      if (index == 5) return xy;
      return this.histMapCoords2Xy(xy);
    });
    const promise = this.xy2MercAsync_returnLayer(cross[0]);
    return promise
      .then((results: any) => {
        const index = results[0];
        const centerMerc = results[1];
        const promises = cross.map((val, i) => {
          if (i == 5) return val;
          if (i == 0) return Promise.resolve(centerMerc);
          return this.xy2MercAsync_specifyLayer(val, index);
        });
        return Promise.all(promises).catch(err => {
          throw err;
        });
      })
      .catch(err => {
        throw err;
      });
  }

  // メルカトル5地点情報から地図サイズ情報（中心座標、サイズ、回転）を得る
  mercs2SizeAsync(mercs: any, asMerc: any) {
    let promises;
    if (asMerc) {
      promises = Promise.resolve(mercs);
    } else {
      promises = this.merc2XyAsync_returnLayer(mercs[0]).then(results => {
        const result = results[0] || results[1];
        const index = result[0];
        const centerXy = result[1];
        return Promise.all(
          mercs.map((merc: any, i: any) => {
            if (i == 5) return merc;
            if (i == 0) return Promise.resolve(centerXy);
            return this.merc2XyAsync_specifyLayer(merc, index);
          })
        );
      });
    }
    return promises
      .then(xys => {
        if (!asMerc) {
          xys = xys.map((xy: any, i: any) => {
            if (i == 5) return xy;
            return this.xy2HistMapCoords(xy);
          });
        }
        return this.xys2Size(xys);
      })
      .catch(err => {
        throw err;
      });
  }

  mercs2XysAsync(mercs: any) {
    const promises = this.merc2XyAsync_returnLayer(mercs[0]).then(results => {
      let hide = false;
      return Promise.all(
        results.map((result: any, i: any) => {
          if (!result) {
            hide = true;
            return;
          }
          const index = result[0];
          const centerXy = result[1];
          if (i != 0 && !hide) return Promise.resolve([centerXy]);
          return Promise.all(
            mercs.map((merc: any, j: any) => {
              if (j == 5) return merc;
              if (j == 0) return Promise.resolve(centerXy);
              return this.merc2XyAsync_specifyLayer(merc, index);
            })
          );
        })
      );
    });
    return promises
      .then(results =>
        results.map((result: any) => {
          if (!result) {
            return;
          }
          return result.map((xy: any, i: any) => {
            if (i == 5) return xy;
            return this.xy2HistMapCoords(xy);
          });
        })
      )
      .catch(err => {
        throw err;
      });
  }

  xy2MercAsync(xy: Coordinate) : Promise<Coordinate> {
    const convertXy = this.histMapCoords2Xy(xy);
    return this.xy2MercAsync_returnLayer(convertXy).then((ret: any) => ret[1]);
  }

  merc2XyAsync(merc: Coordinate, ignoreBackside: any) : Promise<Coordinate | undefined> {
    return this.merc2XyAsync_returnLayer(merc)
      .then(ret => {
        if (ignoreBackside && !ret[0]) return;
        const convertXy = !ret[0] ? ret[1][1] : ret[0][1];
        return this.xy2HistMapCoords(convertXy);
      })
      .catch(err => {
        throw err;
      });
  }
}
