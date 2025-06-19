/* eslint-disable @typescript-eslint/ban-ts-comment */
import i18n from "i18next";
import i18nxhr from "i18next-xhr-backend";
import CustomEvent from "./customevent";
import browserLanguage from "./browserlanguage";
import { Logger, LOGGER_LEVEL } from "./logger";
import { mercatorToLngLat } from './maplibre_coord_transform';
import {
  createElement,
  normalizeDegree,
  createMapInfo,
  normalizeArg
} from "./functions";
import { MaplatMapLibre } from "./map_libre";
import { HistMapLibre } from "./source/histmap_libre";
import { NowMapLibre } from "./source/nowmap_libre";
import { mapSourceFactoryLibre } from "./source_libre";
import { META_KEYS, ViewpointArray } from "./source/mixin";
import { recursiveRound } from "./math_ex";
import locales from "./freeze_locales";
import {
  normalizeLayers,
  addIdToPoi,
  normalizeLayer,
  normalizePoi
} from "./normalize_pois";
import { createIconSet, createHtmlFromTemplate } from "./template_works";

import redcircle from "../parts/redcircle.png";
import defaultpin_selected from "../parts/defaultpin_selected.png";
import defaultpin from "../parts/defaultpin.png";

interface AppData {
  sources: string[] | (NowMapLibre | HistMapLibre)[];
  lang?: string;
  pois?: any;
  homePosition?: [number, number];
  defaultZoom?: number;
  zoomRestriction?: boolean;
  minZoom?: number;
  maxZoom?: number;
  appName?: string;
  fakeGps?: [number, number];
  fakeRadius?: number;
  noRotate?: boolean;
  poiTemplate?: string;
  poiStyle?: string;
  iconTemplate?: string;
  startFrom?: string;
  controls?: any[];
  northUp?: boolean;
  tapDuration?: number;
  homeMarginPixels: number;
  tapUIVanish: boolean;
}

type PositionSet = { x: number; y: number; zoom: number; rotation: number };
interface Restore {
  mapID?: string;
  backgroundID?: string;
  position?: PositionSet;
  transparency?: number;
  hideMarker?: number;
  hideLayer?: string;
}

export class MaplatAppLibre {
  appid: string;
  _events: { [key: string]: ((...args: any[]) => void)[] } = {};
  translateUI = false;
  noRotate = false;
  initialRestore: Restore = {};
  mapDiv = "map_div";
  restoreSession = false;
  enableCache: false;
  stateBuffer: Restore = {};
  mobileMapMoveBuffer?: ViewpointArray;
  overlay = true;
  waitReady: Promise<void>;
  changeMapSeq?: Promise<void>;
  i18n?: any;
  t?: any;
  lang: string;
  appData: AppData | null = null;
  appLang = "ja";
  backMap?: MaplatMapLibre;
  mercSrc?: NowMapLibre;
  mercBuffer: any;
  timer: any = undefined;
  appName: any;
  cacheHash: any;
  currentPosition: any;
  startFrom? = "";
  from?: NowMapLibre | HistMapLibre;
  vectors: any = [];
  mapDivDocument: HTMLElement | null;
  mapObject!: MaplatMapLibre;
  pois: any;
  poiTemplate?: string;
  poiStyle?: string;
  iconTemplate?: string;
  logger: Logger;
  icon?: string;
  selectedIcon?: string;
  __backMapMoving = false;
  __selectedMarker: any;
  __init = true;
  __redrawMarkerBlock = false;
  __redrawMarkerThrottle: (NowMapLibre | HistMapLibre)[] = [];
  __transparency: any;
  lastClickEvent: any;
  
  constructor(appOption: any) {
    appOption = normalizeArg(appOption);
    this.appid = appOption.appid || "sample";
    
    this.mapDiv = appOption.div || "map_div";
    this.mapDivDocument = document.querySelector(`#${this.mapDiv}`);
    this.mapDivDocument!.classList.add("maplat");
    this.logger = new Logger(
      appOption.debug ? LOGGER_LEVEL.ALL : LOGGER_LEVEL.INFO
    );
    this.enableCache = appOption.enableCache || false;
    this.icon = appOption.icon;
    this.selectedIcon = appOption.selectedIcon;

    this.translateUI = appOption.translateUI;
    const setting = appOption.setting;
    this.lang = appOption.lang;
    if (!this.lang) {
      this.lang = browserLanguage();
    }
    if (
      this.lang.toLowerCase() == "zh-hk" ||
      this.lang.toLowerCase() == "zh-hant"
    ) {
      this.lang = "zh-TW";
    }
    this.noRotate = appOption.noRotate;
    
    const restore = appOption.restore;
    this.restoreSession = appOption.restoreSession;
    
    let restoreStr: string;
    if (restore) {
      restoreStr = restore;
    } else if (this.restoreSession) {
      restoreStr = sessionStorage.getItem("maplat_restore") || "{}";
    } else {
      restoreStr = "{}";
    }
    try {
      this.initialRestore = JSON.parse(restoreStr);
    } catch (e) {
      this.initialRestore = {};
    }
    
    // Initialize language and load settings
    this.waitReady = this.loadLang(this.lang)
      .then(() => {
        if (setting) {
          if (typeof setting == "string") {
            return createMapInfo(`apps/${this.appid}.json`);
          } else {
            return Promise.resolve(setting);
          }
        } else {
          return createMapInfo(`apps/${this.appid}.json`);
        }
      })
      .then((data: any) => {
        this.appData = data as AppData;
        const lang = this.appData.lang || "ja";
        if (this.lang != lang) {
          this.lang = lang;
          this.appLang = lang;
          return this.loadLang(lang).then(() => data);
        }
        this.appLang = lang;
        return data;
      })
      .then((appData: AppData): any => {
        const homePos = appData.homePosition;
        const defZoom = appData.defaultZoom;
        const zoomRestriction = appData.zoomRestriction;

        const fakeGps = appData.fakeGps;
        const fakeRadius = appData.fakeRadius;
        const appName = appData.appName;
        
        this.appName = appName || this.appid;
        this.appData = appData;
        
        // Create main map
        this.mapObject = new MaplatMapLibre({
          div: this.mapDiv,
          defaultCenter: homePos || [0, 0],
          defaultZoom: defZoom || 2,
          defaultRotation: 0,
          fakeGps,
          fakeRadius,
          homePosition: homePos,
          northUp: appData.northUp,
          tapDuration: appData.tapDuration,
          homeMarginPixels: appData.homeMarginPixels,
          tapUIVanish: appData.tapUIVanish
        });
        
        // Set up event handlers
        this.mapObject.on('click', (e: any) => {
          this.lastClickEvent = e;
        });
        
        // Load map sources
        if (appData.sources && appData.sources.length > 0) {
          return Promise.all(appData.sources.map(sourceId => 
            mapSourceFactoryLibre(sourceId, {
              enableCache: this.enableCache,
              homePosition: homePos
            })
          )).then((sources: any[]): any => {
            this.appData!.sources = sources as any[];
            // Set the first source as default
            if (sources.length > 0) {
              return this.changeMap(sources[0] as (string | HistMapLibre | NowMapLibre));
            }
            return this;
          });
        }
        
        return this;
      });
  }
  
  loadLang(lang: string) {
    this.lang = lang;
    const i18nPromise = i18n.use(i18nxhr);
    return new Promise<void>((resolve) => {
      const i18nFinalPromise = i18nPromise.init(
        {
          lng: this.lang,
          fallbackLng: ["en"],
          backend: {
            loadPath:
              (url: string) => {
                const lang_code = url.replace(/^.*locales\/([^/]*)\/.*$/, "$1");
                const loc_file = url.replace(/^.*locales\/[^/]*\/(.*)$/, "$1");
                if ((locales as any)[lang_code] && (locales as any)[lang_code][loc_file]) {
                  return `data:application/json;charset=utf-8,${encodeURIComponent(
                    JSON.stringify((locales as any)[lang_code][loc_file])
                  )}`;
                } else {
                  return url;
                }
              }
          },
          resources: locales as any
        },
        (err: any) => {
          if (err) {
            this.logger.error(err);
          } else {
            this.i18n = i18n;
            this.t = i18n.t;
            resolve();
          }
        }
      );
      
      if (i18nFinalPromise) {
        i18nFinalPromise.then(() => {
          this.i18n = i18n;
          this.t = i18n.t;
          resolve();
        });
      }
    });
  }
  
  setMarker(xy: [number, number], data?: any) {
    // Add marker using MapLibre
    const source = this.from;
    if (!source) return;
    
    let lngLat: [number, number];
    if (source instanceof HistMapLibre) {
      lngLat = source.xy2LngLat(xy);
    } else {
      // For NowMapLibre, xy is already in mercator coordinates
      // Convert to lng/lat
      lngLat = mercatorToLngLat(xy);
    }
    
    // Create a marker
    const maplibregl = (this.mapObject as any).maplibregl || (window as any).maplibregl;
    const marker = new maplibregl.Marker()
      .setLngLat(lngLat)
      .addTo(this.mapObject);
    
    if (data) {
      marker.data = data;
    }
    
    return marker;
  }
  
  addSource(source: NowMapLibre | HistMapLibre) {
    const mapSource = source.getMapLibreSource();
    const sourceId = source.mapID || `source-${Date.now()}`;
    
    // Check if source already exists
    if (this.mapObject.getSource(sourceId)) {
      return source;
    }
    
    this.mapObject.addSource(sourceId, mapSource);
    this.mapObject.addLayer({
      id: `layer-${sourceId}`,
      type: 'raster',
      source: sourceId,
      paint: {
        'raster-opacity': 1
      }
    });
    
    return source;
  }
  
  changeMap(target: string | NowMapLibre | HistMapLibre) {
    let source: NowMapLibre | HistMapLibre | undefined;
    
    if (typeof target === 'string') {
      // Find source by ID
      const sources = this.appData?.sources;
      if (sources && Array.isArray(sources) && sources.length > 0) {
        // Check if sources are already loaded as objects
        if (typeof sources[0] !== 'string') {
          source = (sources as (NowMapLibre | HistMapLibre)[]).find(s => s.mapID === target);
        }
      }
    } else {
      source = target;
    }
    
    if (!source) {
      this.logger.error('Source not found');
      return Promise.reject('Source not found');
    }
    
    this.from = source;
    
    // Wait for map to be loaded before adding source
    if (this.mapObject.loaded()) {
      this.addSource(source);
    } else {
      this.mapObject.on('load', () => {
        this.addSource(source!);
      });
    }
    
    return Promise.resolve();
  }
  
  getMapMeta(key?: string) {
    if (!this.from) return undefined;
    if (!key) return this.from;
    return (this.from as any)[key];
  }
  
  // Event emitter methods
  addEventListener(event: string, handler: (...args: any[]) => void) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(handler);
  }
  
  removeEventListener(event: string, handler: (...args: any[]) => void) {
    if (!this._events[event]) return;
    const index = this._events[event].indexOf(handler);
    if (index > -1) {
      this._events[event].splice(index, 1);
    }
  }
  
  dispatchEvent(event: string | CustomEvent) {
    const eventName = typeof event === 'string' ? event : event.type;
    if (!this._events[eventName]) return;
    this._events[eventName].forEach(handler => {
      handler(event);
    });
  }
}