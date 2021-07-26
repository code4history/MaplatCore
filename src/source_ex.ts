import { normalizeArg } from "./functions";
import Weiwudi from "weiwudi";
import { NowMap } from "./source/nowmap";
import { TmsMap } from "./source/tmsmap";
import { MapboxMap } from "./source/mapboxmap";
import { HistMap_tin } from "./source/histmap_tin";
import "whatwg-fetch";

import osm from "../parts/osm.jpg";
import gsi from "../parts/gsi.jpg";
import gsi_ortho from "../parts/gsi_ortho.jpg";

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
    thumbnail: osm,
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
    thumbnail: gsi
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
    thumbnail: gsi_ortho
  }
};

export async function mapSourceFactory(options: any, commonOptions: any) {
  if (typeof options === "string") {
    options = (baseDict as any)[options];
  }

  options = normalizeArg(Object.assign(options, commonOptions));
  options.label = options.label || options.year;
  if (
    options.maptype === "base" ||
    options.maptype === "overlay" ||
    options.maptype === "mapbox"
  ) {
    const targetSrc =
      options.maptype === "base"
        ? NowMap
        : options.maptype === "overlay"
        ? TmsMap
        : MapboxMap;
    if (targetSrc instanceof TmsMap) {
      if (!options.homePosition) options.homePosition = options.homePos;
      if (!options.mercZoom) options.mercZoom = options.defZoom;
    } else {
      options.homePosition = options.homePos;
      options.mercZoom = options.defZoom;
    }
    delete options.homePos;
    delete options.defZoom;
    if (options.zoomRestriction) {
      options.maxZoom = options.maxZoom || options.mercMaxZoom;
      options.minZoom = options.minZoom || options.mercMinZoom;
    }
    options.zoomRestriction =
      options.mercMaxZoom =
      options.mercMinZoom =
        undefined;
    if (options.translator) {
      options.url = options.translator(options.url);
    }
    if (!options.imageExtension) options.imageExtension = "jpg";
    if (options.mapID && !options.url && !options.urls) {
      options.url = options.tms
        ? `tiles/${options.mapID}/{z}/{x}/{-y}.${options.imageExtension}`
        : `tiles/${options.mapID}/{z}/{x}/{y}.${options.imageExtension}`;
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
    const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
    xhr.open("GET", url, true);
    xhr.responseType = "json";

    xhr.onload = async function (_e) {
      if (this.status === 200 || this.status === 0) {
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
            options.maptype === "base" ||
            options.maptype === "overlay" ||
            options.maptype === "mapbox"
          ) {
            const targetSrc =
              options.maptype === "base"
                ? NowMap
                : options.maptype === "overlay"
                ? TmsMap
                : MapboxMap;
            if (targetSrc instanceof TmsMap) {
              if (!options.homePosition) options.homePosition = options.homePos;
              if (!options.mercZoom) options.mercZoom = options.defZoom;
            } else {
              options.homePosition = options.homePos;
              options.mercZoom = options.defZoom;
            }
            delete options.homePos;
            delete options.defZoom;
            if (options.zoomRestriction) {
              options.maxZoom = options.maxZoom || options.mercMaxZoom;
              options.minZoom = options.minZoom || options.mercMinZoom;
            }
            options.zoomRestriction =
              options.mercMaxZoom =
              options.mercMinZoom =
                undefined;
            try {
              if (!options.imageExtension) options.imageExtension = "jpg";
              if (options.mapID && !options.url && !options.urls) {
                options.url = options.tms
                  ? `tiles/${options.mapID}/{z}/{x}/{-y}.${options.imageExtension}`
                  : `tiles/${options.mapID}/{z}/{x}/{y}.${options.imageExtension}`;
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
            delete options.homePos;
            delete options.defZoom;
            if (!options.imageExtension) options.imageExtension = "jpg";
            if (options.mapID && !options.url && !options.urls) {
              options.url = `tiles/${options.mapID}/{z}/{x}/{y}.${options.imageExtension}`;
            }
            options.width = options.width || options.compiled.wh[0];
            options.height = options.height || options.compiled.wh[1];
            options.weiwudi = await registerMapToSW(options);
            if (options.weiwudi) {
              options.url = options.weiwudi.url;
              delete options.urls;
            }
            const obj = await HistMap_tin.createAsync(options);
            try {
              await obj.initialWait;
              obj.setupMapParameter(resolve);
            } catch (e) {
              obj.setupMapParameter(resolve);
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

export async function registerMapToSW(options: any) {
  const setting: any = {};
  if (options.maptype === "mapbox" || !options.enableCache) return;
  else if (options.maptype === "base" || options.maptype === "overlay")
    setting.type = "wmts";
  else setting.type = "xyz";
  setting.url = options.urls ? options.urls : options.url;
  setting.width = options.width;
  setting.height = options.height;
  setting.maxZoom = options.maxZoom;
  setting.minZoom = options.minZoom;
  const lngLats = options.envelopeLngLats;
  if (lngLats) {
    const minMax = lngLats.reduce(
      (prev: number[], curr: number[]) => {
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
