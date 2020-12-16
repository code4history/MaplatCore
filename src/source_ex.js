import { transform } from "ol/proj";
import { MERC_CROSSMATRIX, MERC_MAX, canvBase } from "./const_ex";
import { polygon } from "@turf/helpers";
import centroid from "@turf/centroid";
import {
  normalizeLayers,
  addIdToPoi,
  normalizeLayer,
  normalizePoi
} from "./normalize_pois";
import { normalizeArg } from "./functions";
import Weiwudi from "weiwudi";
import pointer from "./pointer_images";
import { NowMap } from "./source/nowmap";
import { TmsMap } from "./source/tmsmap";
import { MapboxMap } from "./source/mapboxmap";
import { HistMap_tin } from "./source/histmap_tin";

const baseDict = {
  osm: {
    mapID: "osm",
    title: {
      ja: "オープンストリートマップ",
      en: "OpenStreetMap"
    },
    label: {
      ja: "OSM(現在)",
      en: "OSM(Now)"
    },
    attr: "©︎ OpenStreetMap contributors",
    maptype: "base",
    thumbnail: pointer["osm.jpg"],
    urls: [
      "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
      "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
      "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
    ]
  },
  gsi: {
    mapID: "gsi",
    title: {
      ja: "地理院地図",
      en: "Geospatial Information Authority of Japan Map"
    },
    label: {
      ja: "地理院地図",
      en: "GSI Map"
    },
    attr: {
      ja: "国土地理院",
      en: "The Geospatial Information Authority of Japan"
    },
    maptype: "base",
    url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
    maxZoom: 18,
    thumbnail: pointer["gsi.jpg"]
  },
  gsi_ortho: {
    mapID: "gsi_ortho",
    title: {
      ja: "地理院地図オルソ航空写真",
      en: "Geospatial Information Authority of Japan Ortho aerial photo"
    },
    label: {
      ja: "地理院オルソ",
      en: "GSI Ortho"
    },
    attr: {
      ja: "国土地理院",
      en: "The Geospatial Information Authority of Japan"
    },
    maptype: "base",
    url: "https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg",
    maxZoom: 18,
    thumbnail: pointer["gsi_ortho.jpg"]
  }
};

export function setCustomFunction(target) {
  class Mixin extends target {
    async getTileCacheSizeAsync() {
      const self = this;
      if (!self.weiwudi) return 0;
      try {
        const stats = await self.weiwudi.stats();
        return stats.size;
      } catch (e) {
        return 0;
      }
    }

    async clearTileCacheAsync() {
      const self = this;
      if (!self.weiwudi) return;
      try {
        await self.weiwudi.clean();
      } catch (e) {} // eslint-disable-line no-empty
    }

    getMap() {
      return this._map;
    }

    // 経緯度lnglat、メルカトルズームmercZoom、地図ズームzoom、方角direction、地図回転rotation等を指定し地図移動
    setViewpointRadian(cond) {
      const self = this;
      let merc;
      let xy;
      const mercZoom = cond.mercZoom;
      const zoom = cond.zoom;
      const direction = cond.direction;
      const rotation = cond.rotation;
      const map = this._map;
      const view = map.getView();
      if (cond.latitude != null && cond.longitude != null) {
        merc = transform(
          [cond.longitude, cond.latitude],
          "EPSG:4326",
          "EPSG:3857"
        );
      }
      if (cond.x != null && cond.y != null) {
        xy = [cond.x, cond.y];
      }
      self
        .size2MercsAsync()
        .then(mercs => self.mercs2MercSizeAsync(mercs))
        .then(mercSize => {
          const mercs = self.mercsFromGivenMercZoom(
            merc || mercSize[0],
            mercZoom || mercSize[1],
            direction != null ? direction : mercSize[2]
          );
          self.mercs2SizeAsync(mercs).then(size => {
            if (merc != null) {
              view.setCenter(size[0]);
            } else if (xy != null) {
              view.setCenter(xy);
            }
            if (mercZoom != null) {
              view.setZoom(size[1]);
            } else if (zoom != null) {
              view.setZoom(zoom);
            }
            if (direction != null) {
              view.setRotation(size[2]);
            } else if (rotation != null) {
              view.setRotation(rotation);
            }
          });
        });
    }

    setViewpoint(cond) {
      if (cond.rotation) {
        cond.rotation = (cond.rotation * Math.PI) / 180;
      }
      if (cond.direction) {
        cond.direction = (cond.direction * Math.PI) / 180;
      }
      this.setViewpointRadian(cond);
    }

    goHome() {
      this.setViewpointRadian({
        longitude: this.homePosition[0],
        latitude: this.homePosition[1],
        mercZoom: this.mercZoom,
        rotation: 0
      });
    }

    setGPSMarkerAsync(position, ignoreMove) {
      const self = this;
      const map = self.getMap();
      const view = map.getView();
      if (!position) {
        return new Promise((resolve, _reject) => {
          map.setGPSPosition(null);
          resolve(true);
        });
      }
      const mercs = self.mercsFromGPSValue(position.lnglat, position.acc);

      return self
        .mercs2XysAsync(mercs)
        .then(results => {
          const hide = !results[0];
          const xys = hide ? results[1] : results[0];
          const sub = !hide ? results[1] : null;
          const pos = { xy: xys[0] };
          if (!self.insideCheckHistMapCoords(xys[0])) {
            map.handleGPS(false, true);
            return false;
          }
          const news = xys.slice(1);

          pos.rad = news.reduce((prev, curr, index) => {
            const ret =
              prev +
              Math.sqrt(
                Math.pow(curr[0] - pos.xy[0], 2) +
                  Math.pow(curr[1] - pos.xy[1], 2)
              );
            return index == 3 ? ret / 4.0 : ret;
          }, 0);
          if (!ignoreMove) view.setCenter(pos.xy);
          map.setGPSPosition(pos, hide ? "hide" : null);
          if (sub) {
            map.setGPSPosition({ xy: sub[0] }, "sub");
          }
          return true;
        })
        .catch(err => {
          throw err;
        });
    }

    setGPSMarker(position, ignoreMove) {
      this.setGPSMarkerAsync(position, ignoreMove).then(() => {});
    }

    // size(画面サイズ)とズームから、地図面座標上での半径を得る。zoom無指定の場合は自動取得
    getRadius(size, zoom) {
      const radius = Math.floor(Math.min(size[0], size[1]) / 4);
      if (zoom == null) {
        zoom = this._map.getView().getDecimalZoom();
      }
      return (radius * MERC_MAX) / 128 / Math.pow(2, zoom);
    }

    // メルカトルの中心座標とメルカトルズームから、メルカトル5座標値に変換
    mercsFromGivenMercZoom(center, mercZoom, direction) {
      if (mercZoom == null) {
        mercZoom = 17;
      }
      const size = this._map.getSize();
      const pixel = Math.floor(Math.min(size[0], size[1]) / 4);

      const delta = (pixel * MERC_MAX) / 128 / Math.pow(2, mercZoom);
      const crossDelta = this.rotateMatrix(MERC_CROSSMATRIX, direction);
      return crossDelta.map(xy => [
        xy[0] * delta + center[0],
        xy[1] * delta + center[1]
      ]);
    }

    mercsFromGPSValue(lnglat, acc) {
      const merc = transform(lnglat, "EPSG:4326", "EPSG:3857");
      const latrad = (lnglat[1] * Math.PI) / 180;
      const delta = acc / Math.cos(latrad);
      return MERC_CROSSMATRIX.map(xy => [
        xy[0] * delta + merc[0],
        xy[1] * delta + merc[1]
      ]);
    }

    // 与えられた差分行列を回転。theta無指定の場合は自動取得
    rotateMatrix(xys, theta) {
      if (theta == null) {
        theta = 1.0 * this._map.getView().getRotation();
      }
      const result = [];
      for (let i = 0; i < xys.length; i++) {
        const xy = xys[i];
        const x = xy[0] * Math.cos(theta) - xy[1] * Math.sin(theta);
        const y = xy[0] * Math.sin(theta) + xy[1] * Math.cos(theta);
        result.push([x, y]);
      }
      return result;
    }

    // 画面サイズと地図ズームから、地図面座標上での5座標を取得する。zoom, rotate無指定の場合は自動取得
    size2Xys(center, zoom, rotate) {
      if (!center) {
        center = this._map.getView().getCenter();
      }
      const size = this._map.getSize();
      const radius = this.getRadius(size, zoom);
      const crossDelta = this.rotateMatrix(MERC_CROSSMATRIX, rotate);
      const cross = crossDelta.map(xy => [
        xy[0] * radius + center[0],
        xy[1] * radius + center[1]
      ]);
      cross.push(size);
      return cross;
    }

    // 画面サイズと地図ズームから、メルカトル座標上での5座標を取得する。zoom, rotate無指定の場合は自動取得
    size2MercsAsync(center, zoom, rotate) {
      const cross = this.size2Xys(center, zoom, rotate);
      const self = this;
      const promises = cross.map((val, index) => {
        if (index == 5) return val;
        return self.xy2MercAsync(val);
      });
      return Promise.all(promises).catch(err => {
        throw err;
      });
    }

    // メルカトル5地点情報から地図サイズ情報（中心座標、サイズ、回転）を得る
    mercs2SizeAsync(mercs, asMerc) {
      const self = this;
      const promises = asMerc
        ? Promise.resolve(mercs)
        : Promise.all(
            mercs.map((merc, index) => {
              if (index == 5) return merc;
              return self.merc2XyAsync(merc);
            })
          );
      return promises
        .then(xys => self.xys2Size(xys))
        .catch(err => {
          throw err;
        });
    }

    // メルカトル5地点情報からメルカトル地図でのサイズ情報（中心座標、サイズ、回転）を得る
    mercs2MercSizeAsync(mercs) {
      return this.mercs2SizeAsync(mercs, true);
    }

    // 地図座標5地点情報から地図サイズ情報（中心座標、サイズ、回転）を得る
    xys2Size(xys) {
      const center = xys[0];
      let size = xys[5];
      const nesw = xys.slice(1, 5);
      const neswDelta = nesw.map(val => [
        val[0] - center[0],
        val[1] - center[1]
      ]);
      const normal = [
        [0.0, 1.0],
        [1.0, 0.0],
        [0.0, -1.0],
        [-1.0, 0.0]
      ];
      let abss = 0;
      let cosx = 0;
      let sinx = 0;
      for (let i = 0; i < 4; i++) {
        const delta = neswDelta[i];
        const norm = normal[i];
        const abs = Math.sqrt(Math.pow(delta[0], 2) + Math.pow(delta[1], 2));
        abss += abs;
        const outer = delta[0] * norm[1] - delta[1] * norm[0];
        const inner = Math.acos(
          (delta[0] * norm[0] + delta[1] * norm[1]) / abs
        );
        const theta = outer > 0.0 ? -1.0 * inner : inner;
        cosx += Math.cos(theta);
        sinx += Math.sin(theta);
      }
      const scale = abss / 4.0;
      const omega = Math.atan2(sinx, cosx);

      if (!size) size = this._map.getSize();
      const radius = Math.floor(Math.min(size[0], size[1]) / 4);
      const zoom = Math.log((radius * MERC_MAX) / 128 / scale) / Math.log(2);

      return [center, zoom, omega];
    }

    mercs2MercRotation(xys) {
      const center = xys[0];
      const nesw = xys.slice(1, 5);
      const neswDelta = nesw.map(val => [
        val[0] - center[0],
        val[1] - center[1]
      ]);
      const normal = [
        [0.0, 1.0],
        [1.0, 0.0],
        [0.0, -1.0],
        [-1.0, 0.0]
      ];
      // var abss = 0;
      let cosx = 0;
      let sinx = 0;
      for (let i = 0; i < 4; i++) {
        const delta = neswDelta[i];
        const norm = normal[i];
        const abs = Math.sqrt(Math.pow(delta[0], 2) + Math.pow(delta[1], 2));
        // abss += abs;
        const outer = delta[0] * norm[1] - delta[1] * norm[0];
        const inner = Math.acos(
          (delta[0] * norm[0] + delta[1] * norm[1]) / abs
        );
        const theta = outer > 0.0 ? -1.0 * inner : inner;
        cosx += Math.cos(theta);
        sinx += Math.sin(theta);
      }
      // var scale = abss / 4.0;
      return Math.atan2(sinx, cosx);
    }

    mercs2XysAsync(mercs) {
      const self = this;
      return Promise.all(
        mercs.map((merc, index) => {
          if (index == 5) return merc;
          return self.merc2XyAsync(merc);
        })
      ).then(xys => [xys]);
    }

    async resolvePois(pois) {
      this.pois = await normalizeLayers(pois || [], {
        name: this.officialTitle || this.title,
        namespace: this.mapID
      });
    }

    getPoi(id) {
      const self = this;
      let ret;
      Object.keys(self.pois).map(key => {
        self.pois[key].pois.map((poi, i) => {
          if (poi.id == id) {
            ret = self.pois[key].pois[i];
          }
        });
      });
      return ret;
    }

    addPoi(data, clusterId) {
      if (!clusterId) {
        clusterId = "main";
      }
      if (this.pois[clusterId]) {
        data = normalizePoi(data);
        this.pois[clusterId]["pois"].push(data);
        addIdToPoi(this.pois, clusterId, {
          name: this.officialTitle || this.title,
          namespace: this.mapID
        });
        return data.namespaceID;
      }
    }

    removePoi(id) {
      const self = this;
      Object.keys(self.pois).map(key => {
        self.pois[key].pois.map((poi, i) => {
          if (poi.id == id) {
            delete self.pois[key].pois[i];
          }
        });
      });
    }

    clearPoi(clusterId) {
      const self = this;
      if (!clusterId) {
        clusterId = "main";
      }
      if (clusterId == "all") {
        Object.keys(self.pois).map(key => {
          self.pois[key]["pois"] = [];
        });
      } else if (self.pois[clusterId]) {
        self.pois[clusterId]["pois"] = [];
      }
    }

    listPoiLayers(hideOnly, nonzero) {
      const self = this;
      return Object.keys(self.pois)
        .sort((a, b) => {
          if (a == "main") return -1;
          else if (b == "main") return 1;
          else if (a < b) return -1;
          else if (a > b) return 1;
          else return 0;
        })
        .map(key => self.pois[key])
        .filter(layer =>
          nonzero
            ? hideOnly
              ? layer.pois.length && layer.hide
              : layer.pois.length
            : hideOnly
            ? layer.hide
            : true
        );
    }

    getPoiLayer(id) {
      return this.pois[id];
    }

    addPoiLayer(id, data) {
      if (id == "main") return;
      if (this.pois[id]) return;
      this.pois[id] = normalizeLayer(data || [], id, {
        name: this.officialTitle || this.title,
        namespace: this.mapID
      });
    }

    removePoiLayer(id) {
      if (id == "main") return;
      if (!this.pois[id]) return;
      delete this.pois[id];
    }
  }
  return Mixin;
}

export const META_KEYS = [
  "title",
  "officialTitle",
  "author",
  "createdAt",
  "era",
  "contributor",
  "mapper",
  "license",
  "dataLicense",
  "attr",
  "dataAttr",
  "reference",
  "description"
];
const META_KEYS_OPTION = [
  "title",
  "official_title",
  "author",
  "created_at",
  "era",
  "contributor",
  "mapper",
  "license",
  "data_license",
  "attr",
  "data_attr",
  "reference",
  "description"
];

export function setCustomInitialize(self, options) {
  options = normalizeArg(options);
  self.mapID = options.mapID;
  self.homePosition = options.homePosition;
  self.mercZoom = options.mercZoom;
  self.label = options.label;
  self.maxZoom = options.maxZoom;
  self.minZoom = options.minZoom;
  self.poiTemplate = options.poiTemplate;
  self.poiStyle = options.poiStyle;
  self.iconTemplate = options.iconTemplate;
  self.mercatorXShift = options.mercatorXShift;
  self.mercatorYShift = options.mercatorYShift;
  self.weiwudi = options.weiwudi;
  if (options.envelopeLnglats) {
    const lngLats = options.envelopeLnglats;
    const mercs = lngLats.map(lnglat =>
      transform(lnglat, "EPSG:4326", "EPSG:3857")
    );
    mercs.push(mercs[0]);
    self.envelope = polygon([mercs]);
    self.centroid = centroid(self.envelope).geometry.coordinates;
  }

  for (let i = 0; i < META_KEYS.length; i++) {
    const key = META_KEYS[i];
    const option_key = META_KEYS_OPTION[i];
    self[key] = options[option_key] || options[key];
  }

  const thumbWait = options.thumbnail
    ? new Promise(resolve => {
        self.thumbnail = options.thumbnail;
        resolve();
      })
    : new Promise(resolve => {
        self.thumbnail = `./tmbs/${options.mapID}.jpg`;
        fetch(self.thumbnail)
          .then(response => {
            if (response.ok) {
              resolve();
            } else {
              self.thumbnail = `./tmbs/${options.mapID}_menu.jpg`;
              resolve();
            }
          })
          .catch(_error => {
            self.thumbnail = `./tmbs/${options.mapID}_menu.jpg`;
            resolve();
          });
      });
  const poisWait = self.resolvePois(options.pois);
  self.initialWait = Promise.all([poisWait, thumbWait]);
}

export function setupTileLoadFunction(target) {
  const self = target;
  target.setTileLoadFunction(
    (function () {
      let numLoadingTiles = 0;
      const tileLoadFn = self.getTileLoadFunction();
      const tImageLoader = function (tileCoord, src, tCanv, sx, sy, sw, sh) {
        return new Promise((resolve, _reject) => {
          const loader = function (src, fallback) {
            if (numLoadingTiles === 0) {
              // console.log('loading');
            }
            ++numLoadingTiles;
            const tImage = document.createElement("img");
            tImage.crossOrigin = "Anonymous";
            tImage.onload = tImage.onerror = function () {
              if (tImage.width && tImage.height) {
                const ctx = tCanv.getContext("2d");
                ctx.drawImage(
                  tImage,
                  sx,
                  sy,
                  sw,
                  sh,
                  sx == 0 ? 256 - sw : 0,
                  sy == 0 ? 256 - sh : 0,
                  sw,
                  sh
                );
                resolve();
              } else {
                if (fallback) {
                  loader(fallback, null, true);
                } else {
                  resolve("tileLoadError");
                  //reject('tileLoadError');
                }
              }
              --numLoadingTiles;
              if (numLoadingTiles === 0) {
                // console.log('idle');
              }
            };
            tImage.src = src;
          };

          loader(src);
        });
      };
      return function (tile, _src) {
        const zoom = tile.tileCoord[0];
        let tileX = tile.tileCoord[1];
        let tileY = tile.tileCoord[2];

        let pixelXShift = Math.round(
          ((self.mercatorXShift || 0) * 128 * Math.pow(2, zoom)) / MERC_MAX
        );
        let pixelYShift = Math.round(
          ((self.mercatorYShift || 0) * -128 * Math.pow(2, zoom)) / MERC_MAX
        );
        while (pixelXShift < 0 || pixelXShift >= 256) {
          if (pixelXShift < 0) {
            pixelXShift = pixelXShift + 256;
            tileX++;
          } else {
            pixelXShift = pixelXShift - 256;
            tileX--;
          }
        }
        while (pixelYShift < 0 || pixelYShift >= 256) {
          if (pixelYShift < 0) {
            pixelYShift = pixelYShift + 256;
            tileY++;
          } else {
            pixelYShift = pixelYShift - 256;
            tileY--;
          }
        }

        const tmp = document.createElement("div");
        tmp.innerHTML = canvBase;
        const tCanv = tmp.childNodes[0];

        const promises = [
          [[zoom, tileX, tileY], 0, 0, 256 - pixelXShift, 256 - pixelYShift]
        ];
        if (pixelXShift != 0) {
          promises.push([
            [zoom, tileX - 1, tileY],
            256 - pixelXShift,
            0,
            pixelXShift,
            256 - pixelYShift
          ]);
        }
        if (pixelYShift != 0) {
          promises.push([
            [zoom, tileX, tileY - 1],
            0,
            256 - pixelYShift,
            256 - pixelXShift,
            pixelYShift
          ]);
          if (pixelXShift != 0) {
            promises.push([
              [zoom, tileX - 1, tileY - 1],
              256 - pixelXShift,
              256 - pixelYShift,
              pixelXShift,
              pixelYShift
            ]);
          }
        }

        Promise.all(
          promises.map(item => {
            const url = self.tileUrlFunction(
              item[0],
              self.tilePixelRatio_,
              self.projection_
            );
            return tImageLoader(
              item[0],
              url,
              tCanv,
              item[1],
              item[2],
              item[3],
              item[4]
            );
          })
        )
          .then(rets => {
            const err = rets.reduce((prev, ret) => prev && ret, true);
            if (err) {
              tile.handleImageError_();
            } else {
              const dataUrl = tCanv.toDataURL();
              const image = tile.getImage();
              image.crossOrigin = null;
              tileLoadFn(tile, dataUrl);
            }
          })
          .catch(_err => {
            tile.handleImageError_();
          });
      };
    })()
  );
}

export async function mapSourceFactory(options, commonOptions) {
  if (typeof options === "string") {
    options = baseDict[options];
  }

  options = normalizeArg(Object.assign(options, commonOptions));
  options.label = options.label || options.year;
  if (
    options.maptype == "base" ||
    options.maptype == "overlay" ||
    options.maptype == "mapbox"
  ) {
    const targetSrc =
      options.maptype == "base"
        ? NowMap
        : options.maptype == "overlay"
        ? TmsMap
        : MapboxMap;
    if (options.zoomRestriction) {
      options.maxZoom = options.maxZoom || options.mercMaxZoom;
      options.minZoom = options.minZoom || options.mercMinZoom;
    }
    options.zoomRestriction = options.mercMaxZoom = options.mercMinZoom = undefined;
    if (options.translator) {
      options.url = options.translator(options.url);
    }
    if (!options.imageExtention) options.imageExtention = "jpg";
    if (options.mapID && !options.url && !options.urls) {
      options.url = options.tms
        ? `tiles/${options.mapID}/{z}/{x}/{-y}.${options.imageExtention}`
        : `tiles/${options.mapID}/{z}/{x}/{y}.${options.imageExtention}`;
    }
    options.weiwudi = await registerMapToSW(options);
    if (options.weiwudi) {
      options.url = options.weiwudi.url;
      delete options.urls;
    }
    const obj = await targetSrc.createAsync(options);
    await obj.initialWait;
    return obj;
  } else if (options.noload) {
    options.mercMaxZoom = options.mercMinZoom = undefined;
    return new HistMap_tin(options);
  }

  return new Promise((resolve, reject) => {
    const url = options.settingFile || `maps/${options.mapID}.json`;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "json";

    xhr.onload = async function (_e) {
      if (this.status == 200 || this.status == 0) {
        // 0 for UIWebView
        try {
          let resp = this.response;
          if (typeof resp != "object") resp = JSON.parse(resp);
          options = normalizeArg(Object.assign(resp, options));
          options.label = options.label || resp.year;
          if (options.translator) {
            options.url = options.translator(options.url);
          }
          if (!options.maptype) options.maptype = "maplat";

          if (
            options.maptype == "base" ||
            options.maptype == "overlay" ||
            options.maptype == "mapbox"
          ) {
            const targetSrc =
              options.maptype == "base"
                ? NowMap
                : options.maptype == "overlay"
                ? TmsMap
                : MapboxMap;
            if (options.zoomRestriction) {
              options.maxZoom = options.maxZoom || options.mercMaxZoom;
              options.minZoom = options.minZoom || options.mercMinZoom;
            }
            options.zoomRestriction = options.mercMaxZoom = options.mercMinZoom = undefined;
            try {
              if (!options.imageExtention) options.imageExtention = "jpg";
              if (options.mapID && !options.url && !options.urls) {
                options.url = options.tms
                  ? `tiles/${options.mapID}/{z}/{x}/{-y}.${options.imageExtention}`
                  : `tiles/${options.mapID}/{z}/{x}/{y}.${options.imageExtention}`;
              }
              options.weiwudi = await registerMapToSW(options);
              if (options.weiwudi) {
                options.url = options.weiwudi.url;
                delete options.urls;
              }
              const obj = await targetSrc.createAsync(options);
              try {
                await obj.initialWait;
                resolve(obj);
              } catch (e) {
                resolve(obj);
              }
            } catch (e) {
              reject(e);
            }
            return;
          }

          try {
            if (!options.imageExtention) options.imageExtention = "jpg";
            if (options.mapID && !options.url && !options.urls) {
              options.url = `tiles/${options.mapID}/{z}/{x}/{y}.${options.imageExtention}`;
            }
            options.weiwudi = await registerMapToSW(options);
            if (options.weiwudi) {
              options.url = options.weiwudi.url;
              delete options.urls;
            }
            const obj = await HistMap_tin.createAsync(options);
            try {
              await obj.initialWait;
              obj.mapSize2MercSize(resolve);
            } catch (e) {
              obj.mapSize2MercSize(resolve);
            }
          } catch (e) {
            reject(e);
          }
        } catch (err) {
          reject(err);
        }
      } else {
        reject("Fail to load map json");
        // self.postMessage({'event':'cannotLoad'});
      }
    };
    xhr.send();
  });
}

export async function registerMapToSW(options) {
  const setting = {};
  if (options.maptype === "mapbox" || !options.enableCache) return;
  else if (options.maptype === "base" || options.maptype === "overlay")
    setting.type = "wmts";
  else setting.type = "xyz";
  setting.url = options.urls ? options.urls : options.url;
  setting.width = options.width;
  setting.height = options.height;
  setting.maxZoom = options.maxZoom;
  setting.minZoom = options.minZoom;
  const lngLats = options.envelopeLnglats;
  if (lngLats) {
    const minMax = lngLats.reduce(
      (prev, curr) => {
        prev[0] = prev[0] > curr[0] ? curr[0] : prev[0];
        prev[1] = prev[1] < curr[0] ? curr[0] : prev[1];
        prev[2] = prev[2] > curr[1] ? curr[1] : prev[2];
        prev[3] = prev[3] < curr[1] ? curr[1] : prev[3];
        return prev;
      },
      [Infinity, -Infinity, Infinity, -Infinity]
    );
    ["minLng", "maxLng", "minLat", "maxLat"].map((key, index) => {
      setting[key] = minMax[index];
    });
  }
  let ret;
  try {
    ret = await Weiwudi.registerMap(options.mapID, setting);
  } catch (e) {
    // eslint-disable-line no-empty
  }
  return ret;
}
