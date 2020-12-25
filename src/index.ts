import i18n from "i18next";
import i18nxhr from "i18next-xhr-backend";
import CustomEvent from "./customevent";
import browserLanguage from "./browserlanguage";
import { Logger, LoggerLevel } from "./logger";
import {
  createElement,
  normalizeDegree,
  createMapInfo,
  normalizeArg
} from "./functions";
import EventTarget from "ol/events/Target";
import { transform } from "ol/proj";
import { MaplatMap } from "./map_ex";
import { defaults, DragRotateAndZoom } from "ol/interaction";
import { altKeyOnly } from "ol/events/condition";
import { HistMap } from "./source/histmap";
import { NowMap } from "./source/nowmap";
import { TmsMap } from "./source/tmsmap";
import { MapboxMap } from "./source/mapboxmap";
import { mapSourceFactory, META_KEYS } from "./source_ex";
import { recursiveRound } from "./math_ex";
import pointer from "./pointer_images";
import locales from "./freeze_locales";
import {
  normalizeLayers,
  addIdToPoi,
  normalizeLayer,
  normalizePoi
} from "./normalize_pois";
import { createIconSet, createHtmlFromTemplate } from "./template_works";
export class MaplatApp extends EventTarget {
  __selectedMarker: any;
  appName: any;
  cacheHash: any;
  currentPosition: any;
  from: any;
  lines: any;
  mapDivDocument: any;
  mapObject: any;
  mapboxMap: any;
  pois: any;
  transparency_: any;
  // Maplat App Class
  constructor(appOption: any) {
    super();
    appOption = normalizeArg(appOption);
    const app = this;
    (app as any).initialRestore = {};
    (app as any).appid = appOption.appid || "sample";
    if (appOption.mapboxgl) {
      (app as any).mapboxgl = appOption.mapboxgl;
      if (appOption.mapboxToken) {
        (app as any).mapboxgl.accessToken = appOption.mapboxToken;
      }
    }
    (app as any).mapDiv = appOption.div || "map_div";
    app.mapDivDocument = document.querySelector(`#${(app as any).mapDiv}`);
    app.mapDivDocument.classList.add("maplat");
    (app as any).logger = new Logger(
      appOption.debug ? LoggerLevel.ALL : LoggerLevel.INFO
    );
    (app as any).enableCache = appOption.enableCache || false;
    (app as any).stateBuffer = {};
    // @ts-expect-error ts-migrate(2551) FIXME: Property 'translateUI' does not exist on type 'Map... Remove this comment to see the full error message
    app.translateUI = appOption.translateUI;
    const setting = appOption.setting;
    (app as any).lang = appOption.lang;
    if (!(app as any).lang) {
      (app as any).lang = browserLanguage();
    }
    if (
      (app as any).lang.toLowerCase() == "zh-hk" ||
      (app as any).lang.toLowerCase() == "zh-hant"
    )
      (app as any).lang = "zh-TW";
    if (appOption.restore) {
      if (appOption.restoreSession) (app as any).restoreSession = true;
      (app as any).initialRestore = appOption.restore;
    } else if (appOption.restoreSession) {
      (app as any).restoreSession = true;
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | 0' is not assignable to... Remove this comment to see the full error message
      const lastEpoch = parseInt(localStorage.getItem("epoch") || 0);
      const currentTime = Math.floor(new Date().getTime() / 1000);
      if (lastEpoch && currentTime - lastEpoch < 3600) {
        (app as any).initialRestore.mapID =
          localStorage.getItem("mapID") || localStorage.getItem("sourceID");
        (app as any).initialRestore.backgroundID =
          localStorage.getItem("backgroundID") ||
          localStorage.getItem("backID");
        (app as any).initialRestore.position = {
          // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
          x: parseFloat(localStorage.getItem("x")),
          // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
          y: parseFloat(localStorage.getItem("y")),
          // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
          zoom: parseFloat(localStorage.getItem("zoom")),
          // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
          rotation: parseFloat(localStorage.getItem("rotation"))
        };
        (app as any).initialRestore.transparency = parseFloat(
          // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | 0' is not assignable to... Remove this comment to see the full error message
          localStorage.getItem("transparency") || 0
        );
        (app as any).initialRestore.hideMarker = parseInt(
          localStorage.getItem("hideMarker") || "0"
        )
          ? true
          : false;
        (app as any).initialRestore.hideLayer = localStorage.getItem(
          "hideLayer"
        );
      }
    }
    // Add UI HTML Element
    const newElems = createElement(`<img id="center_circle" class="prevent-default"
            style="position:absolute;top:50%;left:50%;margin-top:-10px;
            margin-left:-10px;" src="${pointer["redcircle.png"]}">`);
    for (let i = newElems.length - 1; i >= 0; i--) {
      app.mapDivDocument.insertBefore(
        newElems[i],
        app.mapDivDocument.firstChild
      );
    }
    const prevDefs = app.mapDivDocument.querySelectorAll(".prevent-default");
    for (let i = 0; i < prevDefs.length; i++) {
      const target = prevDefs[i];
      target.addEventListener("touchstart", (evt: any) => {
        evt.preventDefault();
      });
    }
    (app as any).overlay = "overlay" in appOption ? appOption.overlay : true;
    if ((app as any).overlay) {
      app.mapDivDocument.classList.add("with-opacity");
    }
    (app as any).waitReady = app
      .settingLoader(setting)
      .then(x => app.handleSetting(x, appOption));
  }
  // Async initializers 1: Load application setting
  async settingLoader(setting: any) {
    const app = this;
    return (
      setting ||
      new Promise((resolve, _reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `apps/${(app as any).appid}.json`, true);
        xhr.responseType = "json";
        xhr.onload = function (_e) {
          let value = this.response;
          if (typeof value != "object") value = JSON.parse(value);
          resolve(value);
        };
        xhr.send();
      })
    );
  }
  // Async initializers 3: Load i18n setting
  async i18nLoader() {
    const app = this;
    return new Promise((resolve, _reject) => {
      const localesFlag = Object.keys(locales).length != 0;
      const translib =
        // @ts-expect-error ts-migrate(2551) FIXME: Property 'translateUI' does not exist on type 'Map... Remove this comment to see the full error message
        app.translateUI && !localesFlag ? i18n.use(i18nxhr) : i18n;
      translib.init(
        {
          lng: (app as any).lang,
          fallbackLng: ["en"],
          backend: {
            loadPath: "locales/{{lng}}/{{ns}}.json"
          },
          resources: localesFlag ? locales : undefined
        },
        (_err, t) => {
          resolve([t, i18n]);
        }
      );
    });
  }
  // Async initializer 6: Load pois setting => move to normalize_pois.js
  // Async initializer 8: Load sources setting asynchronous
  async sourcesLoader(mapReturnValue: any) {
    const app = this;
    const dataSource = (app as any).appData.sources;
    const sourcePromise = [];
    const commonOption = {
      homePosition: mapReturnValue.homePos,
      mercZoom: mapReturnValue.defZoom,
      zoomRestriction: mapReturnValue.zoomRestriction,
      mercMinZoom: mapReturnValue.mercMinZoom,
      mercMaxZoom: mapReturnValue.mercMaxZoom,
      enableCache: (app as any).enableCache,
      translator(fragment: any) {
        return app.translate(fragment);
      }
    };
    for (let i = 0; i < dataSource.length; i++) {
      const option = dataSource[i];
      sourcePromise.push(mapSourceFactory(option, commonOption));
    }
    return Promise.all(sourcePromise);
  }
  // Async initializers 2: Handle application setting
  handleSetting(setting: any, appOption: any) {
    const app = this;
    (app as any).appData = normalizeArg(setting);
    if (!(app as any).lang && (app as any).appData.lang) {
      (app as any).lang = (app as any).appData.lang;
    }
    return app.i18nLoader().then(x => app.handleI18n(x, appOption));
  }
  // Async initializers 4: Handle i18n setting
  handleI18n(i18nObj: any, appOption: any) {
    const app = this;
    (app as any).i18n = i18nObj[1];
    (app as any).t = i18nObj[0];
    const mapReturnValue = app.prepareMap(appOption);
    return normalizeLayers((app as any).appData.pois || [], app).then(x =>
      app.handlePois(x, mapReturnValue)
    );
  }
  // Async initializers 5: Prepare map base elements and objects
  prepareMap(appOption: any) {
    const app = this;
    appOption = normalizeArg(appOption);
    (app as any).mercBuffer = null;
    const homePos = (app as any).appData.homePosition;
    const defZoom = (app as any).appData.defaultZoom;
    const zoomRestriction = (app as any).appData.zoomRestriction;
    const mercMinZoom = (app as any).appData.minZoom;
    const mercMaxZoom = (app as any).appData.maxZoom;
    app.appName = (app as any).appData.appName;
    const fakeGps = appOption.fake ? (app as any).appData.fakeGps : false;
    const fakeRadius = appOption.fake ? (app as any).appData.fakeRadius : false;
    (app as any).appLang = (app as any).appData.lang || "ja";
    (app as any).noRotate =
      appOption.noRotate || (app as any).appData.noRotate || false;
    (app as any).poiTemplate =
      appOption.poiTemplate || (app as any).appData.poiTemplate || false;
    (app as any).poiStyle =
      appOption.poiStyle || (app as any).appData.poiStyle || false;
    (app as any).iconTemplate =
      appOption.iconTemplate || (app as any).appData.iconTemplate || false;
    app.currentPosition = null;
    (app as any).backMap = null;
    (app as any).__init = true;
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    app.dispatchEvent(new CustomEvent("uiPrepare"));
    const frontDiv = `${(app as any).mapDiv}_front`;
    let newElem = createElement(
      `<div id="${frontDiv}" class="map" style="top:0; left:0; right:0; bottom:0; ` +
        `position:absolute;"></div>`
    )[0];
    app.mapDivDocument.insertBefore(newElem, app.mapDivDocument.firstChild);
    app.mapObject = new MaplatMap({
      div: frontDiv,
      controls: (app as any).appData.controls || [],
      interactions: (app as any).noRotate
        ? defaults({ altShiftDragRotate: false, pinchRotate: false })
        : defaults().extend([
            new DragRotateAndZoom({
              condition: altKeyOnly
            })
          ]),
      fakeGps,
      fakeRadius,
      homePosition: homePos
    });
    let backDiv = null;
    if ((app as any).overlay) {
      backDiv = `${(app as any).mapDiv}_back`;
      newElem = createElement(
        `<div id="${backDiv}" class="map" style="top:0; left:0; right:0; bottom:0; ` +
          `position:absolute;"></div>`
      )[0];
      app.mapDivDocument.insertBefore(newElem, app.mapDivDocument.firstChild);
      (app as any).backMap = new MaplatMap({
        off_control: true,
        div: backDiv
      });
    }
    if ((app as any).mapboxgl) {
      const mapboxgl = (app as any).mapboxgl;
      delete (app as any).mapboxgl;
      const mapboxDiv = `${(app as any).mapDiv}_mapbox`;
      newElem = createElement(
        `<div id="${mapboxDiv}" class="map" style="top:0; left:0; right:0; bottom:0; ` +
          `position:absolute;visibility:hidden;"></div>`
      )[0];
      app.mapDivDocument.insertBefore(newElem, app.mapDivDocument.firstChild);
      app.mapboxMap = new mapboxgl.Map({
        attributionControl: false,
        boxZoom: false,
        container: mapboxDiv,
        doubleClickZoom: false,
        dragPan: false,
        dragRotate: false,
        interactive: false,
        keyboard: false,
        pitchWithRotate: false,
        scrollZoom: false,
        touchZoomRotate: false
      });
    }
    (app as any).startFrom = (app as any).appData.startFrom;
    app.lines = [];
    return {
      homePos,
      defZoom,
      zoomRestriction,
      mercMinZoom,
      mercMaxZoom
    };
  }
  // Async initializer 7: Handle pois loading result
  handlePois(pois: any, mapReturnValue: any) {
    const app = this;
    app.pois = pois;
    return app.sourcesLoader(mapReturnValue).then(x => app.handleSources(x));
  }
  // Async initializer 9: Handle sources loading result
  handleSources(sources: any) {
    const app = this;
    (app as any).mercSrc = sources.reduce((prev: any, curr: any) => {
      if (prev) return prev;
      if (curr instanceof NowMap) return curr;
    }, null);
    const cache = [];
    app.cacheHash = {};
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      source._map = app.mapObject;
      if (source instanceof MapboxMap) {
        if (!app.mapboxMap) {
          throw "To use mapbox gl based base map, you have to make Maplat object with specifying 'mapboxgl' option.";
        }
        source.mapboxMap = app.mapboxMap;
      }
      cache.push(source);
      app.cacheHash[source.mapID] = source;
    }
    app.dispatchEvent(new CustomEvent("sourceLoaded", sources));
    app.setInitialMap(cache);
    app.setMapClick();
    app.setPointerEvents();
    app.setMapOnOff();
    app.setMouseCursor();
    app.setBackMapBehavior();
    app.raiseChangeViewPoint();
  }
  // Async initializer 10: Handle initial map
  setInitialMap(cache: any) {
    const app = this;
    const initial =
      (app as any).initialRestore.mapID ||
      (app as any).startFrom ||
      cache[cache.length - 1].mapID;
    app.from = cache.reduce((prev: any, curr: any) => {
      if (prev) {
        return !(prev instanceof HistMap) && curr.mapID != initial
          ? curr
          : prev;
      }
      if (curr.mapID != initial) return curr;
      return prev;
    }, null);
    app.changeMap(initial, (app as any).initialRestore);
  }
  // Async initializer 11: Handle map click event
  setMapClick() {
    const app = this;
    app.mapObject.on("click", function (evt: any) {
      (app as any).logger.debug(evt.pixel);
      // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
      const feature = this.forEachFeatureAtPixel(evt.pixel, (feature: any) => {
        (app as any).logger.debug(evt.pixel);
        if (feature.get("datum")) return feature;
      });
      if (feature) {
        app.dispatchEvent(new CustomEvent("clickMarker", feature.get("datum")));
      } else {
        const xy = evt.coordinate;
        app.dispatchEvent(new CustomEvent("clickMapXy", xy));
        app.from.xy2MercAsync(xy).then((merc: any) => {
          app.dispatchEvent(new CustomEvent("clickMapMerc", merc));
          const lnglat = transform(merc, "EPSG:3857", "EPSG:4326");
          app.dispatchEvent(
            new CustomEvent("clickMap", {
              longitude: lnglat[0],
              latitude: lnglat[1]
            })
          );
        });
      }
    });
  }
  // Async initializer 12: Handle pointer event
  setPointerEvents() {
    const app = this;
    let xyBuffer: any;
    let waiting = false;
    let dragging = false;
    const pointerCounter = {};
    const pointermoveHandler = function (xy: any) {
      app.dispatchEvent(new CustomEvent("pointerMoveOnMapXy", xy));
      app.from.xy2MercAsync(xy).then((merc: any) => {
        app.dispatchEvent(new CustomEvent("pointerMoveOnMapMerc", merc));
        if (xyBuffer) {
          const next = xyBuffer;
          xyBuffer = false;
          pointermoveHandler(next);
        } else {
          waiting = false;
        }
      });
    };
    app.mapObject.on("pointermove", (evt: any) => {
      if (dragging) return;
      if (waiting) {
        xyBuffer = evt.coordinate;
      } else {
        waiting = true;
        pointermoveHandler(evt.coordinate);
      }
    });
    app.mapObject.on("pointerdown", (evt: any) => {
      if (evt.originalEvent && evt.originalEvent.pointerId != null) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        pointerCounter[evt.originalEvent.pointerId] = true;
      }
      dragging = true;
    });
    app.mapObject.on("pointerdrag", (evt: any) => {
      if (evt.originalEvent && evt.originalEvent.pointerId != null) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        pointerCounter[evt.originalEvent.pointerId] = true;
      }
      dragging = true;
    });
    app.mapObject.on("pointerup", (evt: any) => {
      // Android
      if (evt.originalEvent && evt.originalEvent.pointerId != null) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        delete pointerCounter[evt.originalEvent.pointerId];
        if (Object.keys(pointerCounter).length == 0) {
          dragging = false;
        }
        // iOS
      } else if (evt.originalEvent && evt.originalEvent.touches) {
        if (evt.originalEvent.touches.length == 0) {
          dragging = false;
        }
      } else {
        dragging = false;
      }
    });
  }
  // Async initializer 13: Handle map UI on/off
  setMapOnOff() {
    const app = this;
    // MapUI on off
    let timer: any;
    app.mapObject.on("click", () => {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      const ctls = app.mapDivDocument.querySelectorAll(".ol-control");
      for (let i = 0; i < ctls.length; i++) {
        ctls[i].classList.remove("fade");
      }
    });
    app.mapObject.on("pointerdrag", () => {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      const ctls = app.mapDivDocument.querySelectorAll(".ol-control");
      for (let i = 0; i < ctls.length; i++) {
        ctls[i].classList.add("fade");
      }
    });
    app.mapObject.on("moveend", () => {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      timer = setTimeout(() => {
        timer = undefined;
        const ctls = app.mapDivDocument.querySelectorAll(".ol-control");
        for (let i = 0; i < ctls.length; i++) {
          ctls[i].classList.remove("fade");
        }
      }, 3000);
    });
  }
  // Async initializer 14: Handle mouse cursor
  setMouseCursor() {
    const app = this;
    // change mouse cursor when over marker
    const moveHandler = function (evt: any) {
      // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
      const pixel = this.getEventPixel(evt.originalEvent);
      // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
      const hit = this.hasFeatureAtPixel(pixel);
      // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
      const target = this.getTarget();
      if (hit) {
        // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        const feature = this.forEachFeatureAtPixel(
          evt.pixel,
          (feature: any) => {
            if (feature.get("datum")) return feature;
          }
        );
        app.mapDivDocument.querySelector(`#${target}`).style.cursor = feature
          ? "pointer"
          : "";
        return;
      }
      app.mapDivDocument.querySelector(`#${target}`).style.cursor = "";
    };
    app.mapObject.on("pointermove", moveHandler);
    const mapOutHandler = function (evt: any) {
      let histCoord = evt.frameState.viewState.center;
      const source = app.from;
      if (!source.insideCheckHistMapCoords(histCoord)) {
        histCoord = source.modulateHistMapCoordsInside(histCoord);
        // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        this.getView().setCenter(histCoord);
      }
    };
    app.mapObject.on("moveend", mapOutHandler);
  }
  // Async initializer 15: Handle back map's behavior
  setBackMapBehavior() {
    const app = this;
    const backMapMove = function (_evt: any) {
      if (!(app as any).backMap) return;
      // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
      if (this._backMapMoving) {
        (app as any).logger.debug("Backmap moving skipped");
        return;
      }
      const backSrc = (app as any).backMap.getSource();
      if (backSrc) {
        // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        this._backMapMoving = true;
        (app as any).logger.debug("Backmap moving started");
        // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        const self = this;
        app.convertParametersFromCurrent(backSrc, (size: any) => {
          const view = (app as any).backMap.getView();
          view.setCenter(size[0]);
          view.setZoom(size[1]);
          view.setRotation((app as any).noRotate ? 0 : size[2]);
          (app as any).logger.debug("Backmap moving ended");
          self._backMapMoving = false;
        });
      }
    };
    app.mapObject.on("postrender", backMapMove);
  }
  // Async initializer 16: Handle back map's behavior
  raiseChangeViewPoint() {
    const app = this;
    app.mapObject.on("postrender", (_evt: any) => {
      const view = app.mapObject.getView();
      const center = view.getCenter();
      const zoom = view.getDecimalZoom();
      const rotation = normalizeDegree((view.getRotation() * 180) / Math.PI);
      app.from
        .size2MercsAsync()
        .then((mercs: any) => (app as any).mercSrc.mercs2SizeAsync(mercs))
        .then((size: any) => {
          if (
            (app as any).mobileMapMoveBuffer &&
            (app as any).mobileMapMoveBuffer[0][0] == size[0][0] &&
            (app as any).mobileMapMoveBuffer[0][1] == size[0][1] &&
            (app as any).mobileMapMoveBuffer[1] == size[1] &&
            (app as any).mobileMapMoveBuffer[2] == size[2]
          ) {
            return;
          }
          (app as any).mobileMapMoveBuffer = size;
          const ll = transform(size[0], "EPSG:3857", "EPSG:4326");
          const direction = normalizeDegree((size[2] * 180) / Math.PI);
          app.dispatchEvent(
            new CustomEvent("changeViewpoint", {
              x: center[0],
              y: center[1],
              longitude: ll[0],
              latitude: ll[1],
              mercator_x: size[0][0],
              mercator_y: size[0][1],
              zoom,
              mercZoom: size[1],
              direction,
              rotation
            })
          );
          app.requestUpdateState({
            position: {
              x: center[0],
              y: center[1],
              zoom,
              rotation
            }
          });
        });
    });
  }
  currentMapInfo() {
    const app = this;
    return createMapInfo(app.from);
  }
  mapInfo(mapID: any) {
    const app = this;
    return createMapInfo(app.cacheHash[mapID]);
  }
  setMarker(data: any) {
    const app = this;
    (app as any).logger.debug(data);
    const lnglat = data.lnglat || [
      data.lng || data.longitude,
      data.lat || data.latitude
    ];
    const x = data.x;
    const y = data.y;
    const coords = data.coordinates;
    const src = app.from;
    const icon = data.icon
      ? app.__selectedMarker == data.namespaceID && data.selectedIcon
        ? data.selectedIcon
        : data.icon
      : app.__selectedMarker == data.namespaceID
      ? pointer["defaultpin_selected.png"]
      : pointer["defaultpin.png"];
    const promise = coords
      ? (function () {
          return src.merc2XyAsync(coords, true);
        })()
      : x && y
      ? new Promise(resolve => {
          resolve(src.xy2HistMapCoords([x, y]));
        })
      : (function () {
          const merc = transform(lnglat, "EPSG:4326", "EPSG:3857");
          return src.merc2XyAsync(merc, true);
        })();
    return promise.then((xy: any) => {
      if (!xy) return;
      if (src.insideCheckHistMapCoords(xy)) {
        app.mapObject.setMarker(xy, { datum: data }, icon);
      }
    });
  }
  resetMarker() {
    this.mapObject.resetMarker();
  }
  setLine(data: any) {
    const app = this;
    (app as any).logger.debug(data);
    let xyPromises;
    if (data.coordinates) {
      xyPromises = data.coordinates.map((coord: any) =>
        app.from.merc2XyAsync(coord)
      );
    } else {
      xyPromises = data.lnglats.map((lnglat: any) => {
        const merc = transform(lnglat, "EPSG:4326", "EPSG:3857");
        return app.from.merc2XyAsync(merc);
      });
    }
    Promise.all(xyPromises).then(xys => {
      app.mapObject.setLine(xys, data.stroke);
    });
  }
  resetLine() {
    this.mapObject.resetLine();
  }
  redrawMarkers(source: any) {
    const app = this;
    if (!source) {
      source = app.from;
    }
    if ((app as any).__redrawMarkerBlock) {
      if (!(app as any).__redrawMarkerThrottle)
        (app as any).__redrawMarkerThrottle = [];
      const throttle = (app as any).__redrawMarkerThrottle;
      if (throttle.length == 0 || throttle[throttle.length - 1] !== source) {
        throttle.push(source);
        return;
      }
    }
    (app as any).__redrawMarkerBlock = true;
    const redrawLogic = (source: any) => {
      const promises: any = [];
      app.resetMarker();
      if (!(app as any).stateBuffer.hideMarker) {
        Object.keys(app.pois).map(key => {
          const cluster = app.pois[key];
          if (!cluster.hide) {
            cluster.pois.map((data: any) => {
              const dataCopy = createIconSet(data, cluster, app);
              createHtmlFromTemplate(data, cluster, app);
              promises.push(app.setMarker(dataCopy));
            });
          }
        });
        if (source.pois) {
          Object.keys(source.pois).map(key => {
            const cluster = source.pois[key];
            if (!cluster.hide) {
              cluster.pois.map((data: any) => {
                const dataCopy = createIconSet(data, cluster, source, app);
                createHtmlFromTemplate(data, cluster, source, app);
                promises.push(app.setMarker(dataCopy));
              });
            }
          });
        }
      }
      Promise.all(promises).then(() => {
        if (
          (app as any).__redrawMarkerThrottle &&
          (app as any).__redrawMarkerThrottle.length > 0
        ) {
          redrawLogic((app as any).__redrawMarkerThrottle.shift());
        } else {
          (app as any).__redrawMarkerBlock = false;
        }
      });
    };
    redrawLogic(source);
  }
  selectMarker(id: any) {
    const data = this.getMarker(id);
    if (!data) return;
    this.__selectedMarker = id;
    const latlng = {
      latitude: data.lnglat
        ? data.lnglat[1]
        : data.lat
        ? data.lat
        : data.latitude,
      longitude: data.lnglat
        ? data.lnglat[0]
        : data.lng
        ? data.lng
        : data.longitude
    };
    this.setViewpoint(latlng);
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
    this.redrawMarkers();
  }
  unselectMarker() {
    delete this.__selectedMarker;
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
    this.redrawMarkers();
  }
  getMarker(id: any) {
    const app = this;
    if (id.indexOf("#") < 0) {
      let ret;
      Object.keys(app.pois).map(key => {
        app.pois[key].pois.map((poi: any, i: any) => {
          if (poi.id == id) {
            ret = app.pois[key].pois[i];
          }
        });
      });
      return ret;
    } else {
      const splits = id.split("#");
      const source = app.cacheHash[splits[0]];
      if (source) {
        return source.getPoi(splits[1]);
      }
    }
  }
  updateMarker(id: any, data: any, overwrite: any) {
    const app = this;
    const poi = app.getMarker(id);
    if (!poi) return;
    data = normalizePoi(data || {});
    if (overwrite) {
      Object.keys(poi).map(key => {
        if (key != "id" && key != "namespaceID") {
          delete poi[key];
        }
      });
      Object.assign(poi, data);
    } else {
      Object.keys(data).map(key => {
        if (key == "id" || key == "namespaceID") return;
        if (data[key] == "____delete____") {
          delete poi[key];
        } else {
          poi[key] = data[key];
        }
      });
    }
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
    app.redrawMarkers();
  }
  addMarker(data: any, clusterId: any) {
    if (!clusterId) {
      clusterId = "main";
    }
    if (clusterId.indexOf("#") < 0) {
      if (this.pois[clusterId]) {
        this.pois[clusterId]["pois"].push(normalizePoi(data));
        addIdToPoi(this.pois, clusterId, {
          name: this.appName
        });
        this.dispatchPoiNumber();
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
        this.redrawMarkers();
        return data.namespaceID;
      }
    } else {
      const splits = clusterId.split("#");
      const source = this.cacheHash[splits[0]];
      if (source) {
        const ret = source.addPoi(data, splits[1]);
        this.dispatchPoiNumber();
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
        this.redrawMarkers();
        return ret;
      }
    }
  }
  removeMarker(id: any) {
    const app = this;
    if (id.indexOf("#") < 0) {
      Object.keys(app.pois).map(key => {
        app.pois[key].pois.map((poi: any, i: any) => {
          if (poi.id == id) {
            delete app.pois[key].pois[i];
            app.dispatchPoiNumber();
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
            app.redrawMarkers();
          }
        });
      });
    } else {
      const splits = id.split("#");
      const source = app.cacheHash[splits[0]];
      if (source) {
        source.removePoi(splits[1]);
        app.dispatchPoiNumber();
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
        app.redrawMarkers();
      }
    }
  }
  clearMarker(clusterId: any) {
    const app = this;
    if (!clusterId) {
      clusterId = "main";
    }
    if (clusterId.indexOf("#") < 0) {
      if (clusterId == "all") {
        Object.keys(app.pois).map(key => {
          app.pois[key]["pois"] = [];
        });
      } else if (app.pois[clusterId]) {
        app.pois[clusterId]["pois"] = [];
      } else return;
      app.dispatchPoiNumber();
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
      app.redrawMarkers();
    } else {
      const splits = clusterId.split("#");
      const source = app.cacheHash[splits[0]];
      if (source) {
        source.clearPoi(splits[1]);
        app.dispatchPoiNumber();
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
        app.redrawMarkers();
      }
    }
  }
  showAllMarkers() {
    this.requestUpdateState({ hideMarker: 0 });
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
    this.redrawMarkers();
  }
  hideAllMarkers() {
    this.requestUpdateState({ hideMarker: 1 });
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
    this.redrawMarkers();
  }
  dispatchPoiNumber() {
    this.dispatchEvent(
      new CustomEvent(
        "poi_number",
        this.listPoiLayers(false, true).reduce(
          (prev, curr) => prev + curr.pois.length,
          0
        )
      )
    );
  }
  listPoiLayers(hideOnly: any, nonzero: any) {
    const app = this;
    const appPois = Object.keys(app.pois)
      .sort((a, b) => {
        if (a == "main") return -1;
        else if (b == "main") return 1;
        else if (a < b) return -1;
        else if (a > b) return 1;
        else return 0;
      })
      .map(key => app.pois[key])
      .filter(layer =>
        nonzero
          ? hideOnly
            ? layer.pois.length && layer.hide
            : layer.pois.length
          : hideOnly
          ? layer.hide
          : true
      );
    const mapPois = app.from.listPoiLayers(hideOnly, nonzero);
    return appPois.concat(mapPois);
  }
  showPoiLayer(id: any) {
    const layer = this.getPoiLayer(id);
    if (layer) {
      delete layer.hide;
      this.requestUpdateState({
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        hideLayer: this.listPoiLayers(true)
          .map(layer => layer.namespaceID)
          .join(",")
      });
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
      this.redrawMarkers();
    }
  }
  hidePoiLayer(id: any) {
    const layer = this.getPoiLayer(id);
    if (layer) {
      layer.hide = true;
      this.requestUpdateState({
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        hideLayer: this.listPoiLayers(true)
          .map(layer => layer.namespaceID)
          .join(",")
      });
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
      this.redrawMarkers();
    }
  }
  getPoiLayer(id: any) {
    if (id.indexOf("#") < 0) {
      return this.pois[id];
    } else {
      const splits = id.split("#");
      const source = this.cacheHash[splits[0]];
      if (source) {
        return source.getPoiLayer(splits[1]);
      }
    }
  }
  addPoiLayer(id: any, data: any) {
    if (id == "main") return;
    if (this.pois[id]) return;
    if (id.indexOf("#") < 0) {
      this.pois[id] = normalizeLayer(data || [], id, {
        name: this.appName
      });
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
      this.redrawMarkers();
    } else {
      const splits = id.split("#");
      const source = this.cacheHash[splits[0]];
      if (source) {
        source.addPoiLayer(splits[1], data);
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
        this.redrawMarkers();
      }
    }
  }
  removePoiLayer(id: any) {
    if (id == "main") return;
    if (!this.pois[id]) return;
    if (id.indexOf("#") < 0) {
      delete this.pois[id];
      this.requestUpdateState({
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        hideLayer: this.listPoiLayers(true)
          .map(layer => layer.namespaceID)
          .join(",")
      });
      this.dispatchPoiNumber();
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
      this.redrawMarkers();
    } else {
      const splits = id.split("#");
      const source = this.cacheHash[splits[0]];
      if (source) {
        source.removePoiLayer(splits[1]);
        this.requestUpdateState({
          // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
          hideLayer: this.listPoiLayers(true)
            .map(layer => layer.namespaceID)
            .join(",")
        });
        this.dispatchPoiNumber();
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
        this.redrawMarkers();
      }
    }
  }
  addLine(data: any) {
    this.lines.push(data);
    this.setLine(data);
  }
  clearLine() {
    this.lines = [];
    this.resetLine();
  }
  setGPSMarker(position: any) {
    this.currentPosition = position;
    this.from.setGPSMarker(position, true);
  }
  changeMap(mapID: any, restore: any) {
    const app = this;
    if (!restore) restore = {};
    const now = app.cacheHash["osm"];
    const to = app.cacheHash[mapID];
    if (!(app as any).changeMapSeq) {
      (app as any).changeMapSeq = Promise.resolve();
    }
    return ((app as any).changeMapSeq = (app as any).changeMapSeq.then(
      () =>
        new Promise((resolve, _reject) => {
          app.convertParametersFromCurrent(to, (size: any) => {
            let backSrc = null;
            let backTo = null;
            const backRestore = restore.backgroundID
              ? app.cacheHash[restore.backgroundID]
              : undefined;
            if ((app as any).backMap) {
              // Overlay = true case:
              backSrc = (app as any).backMap.getSource(); // Get current source of background map
              if (!(to instanceof NowMap)) {
                // If new foreground source is nonlinear map:
                if (backRestore) {
                  backTo = backRestore;
                  (app as any).backMap.exchangeSource(backTo);
                } else {
                  if (!backSrc) {
                    // If current background source is not set, specify it
                    backTo = now;
                    if (app.from instanceof NowMap) {
                      backTo =
                        app.from instanceof TmsMap
                          ? app.mapObject.getSource()
                          : // If current foreground is TMS overlay, set current basemap as new background
                            app.from; // If current foreground source is basemap, set current foreground as new background
                    }
                    (app as any).backMap.exchangeSource(backTo);
                  } else {
                    // If current background source is set, use it again
                    backTo = backSrc;
                  }
                }
                app.requestUpdateState({ backgroundID: backTo.mapID });
              } else if (to instanceof NowMap) {
                // If new foreground source is basemap or TMS overlay, remove source from background map
                (app as any).backMap.exchangeSource();
              }
              // Overlay = true case: end
            }
            if (to instanceof TmsMap) {
              // Foreground is TMS overlay case: set TMS as Layer
              app.mapObject.setLayer(to);
              // If current foreground is basemap then set it as basemap layer
              if (backRestore) {
                app.mapObject.exchangeSource(backRestore);
              } else if (!(app.from instanceof NowMap)) {
                const backToLocal = backSrc || now;
                app.mapObject.exchangeSource(backToLocal);
              }
              app.requestUpdateState({
                backgroundID: app.mapObject.getSource().mapID
              });
            } else {
              // Remove overlay from foreground and set current source to foreground
              app.mapObject.setLayer();
              app.mapObject.exchangeSource(to);
            }
            const updateState = {
              mapID: to.mapID
            };
            if (to instanceof NowMap && !(to instanceof TmsMap)) {
              (updateState as any).backgroundID = "____delete____";
            }
            app.requestUpdateState(updateState);
            // This must be here: Because, render process works after view.setCenter,
            // and Changing "from" content must be finished before "postrender" event
            app.from = to;
            app.dispatchPoiNumber();
            const view = app.mapObject.getView();
            if ((app as any).appData.zoomRestriction) {
              view.setMaxZoom(to.maxZoom);
              view.setMinZoom(to.minZoom || 0);
            }
            if (to.insideCheckHistMapCoords(size[0])) {
              view.setCenter(size[0]);
              view.setZoom(size[1]);
              view.setRotation((app as any).noRotate ? 0 : size[2]);
            } else if (!(app as any).__init) {
              app.dispatchEvent(new CustomEvent("outOfMap", {}));
              to.goHome();
            }
            to.setGPSMarker(app.currentPosition, true);
            if (restore.hideLayer) {
              const layers = restore.hideLayer.split(",");
              layers.map((key: any) => {
                const layer = app.getPoiLayer(key);
                if (layer) {
                  layer.hide = true;
                }
              });
              app.requestUpdateState({ hideLayer: restore.hideLayer });
            }
            if (restore.hideMarker) {
              app.hideAllMarkers();
            } else {
              // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
              app.redrawMarkers();
            }
            app.resetLine();
            for (let i = 0; i < app.lines.length; i++) {
              (function (data) {
                app.setLine(data);
              })(app.lines[i]);
            }
            app.dispatchEvent(
              new CustomEvent("mapChanged", app.getMapMeta(to.mapID))
            );
            app.mapObject.updateSize();
            app.mapObject.renderSync();
            if (restore.position) {
              (app as any).__init = false;
              to.setViewpoint(restore.position);
            }
            if (restore.transparency) {
              app.setTransparency(restore.transparency);
            }
            if ((app as any).__init == true) {
              (app as any).__init = false;
              to.goHome();
            } else if ((app as any).backMap && backTo) {
              app.convertParametersFromCurrent(backTo, (size: any) => {
                const view = (app as any).backMap.getView();
                view.setCenter(size[0]);
                view.setZoom(size[1]);
                view.setRotation((app as any).noRotate ? 0 : size[2]);
                (app as any).backMap.updateSize();
                (app as any).backMap.renderSync();
              });
            }
            // @ts-expect-error ts-migrate(2794) FIXME: Expected 1 arguments, but got 0. Did you forget to... Remove this comment to see the full error message
            resolve();
          });
        })
    ));
  }
  requestUpdateState(data: any) {
    const app = this;
    (app as any).stateBuffer = Object.assign((app as any).stateBuffer, data);
    if ((app as any).stateBuffer.backgroundID == "____delete____") {
      delete (app as any).stateBuffer.backgroundID;
    }
    if ((app as any).restoreSession) {
      const currentTime = Math.floor(new Date().getTime() / 1000);
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
      localStorage.setItem("epoch", currentTime);
      const loopSession = function (data: any) {
        Object.keys(data).map(key => {
          if (key == "position") {
            loopSession(data[key]);
          } else if (key == "backgroundID" && data[key] == "____delete____") {
            localStorage.removeItem(key);
          } else {
            localStorage.setItem(key, data[key]);
          }
        });
      };
      loopSession(data);
    }
    if ((app as any).timer) clearTimeout((app as any).timer);
    (app as any).timer = setTimeout(() => {
      (app as any).timer = undefined;
      app.dispatchEvent(
        new CustomEvent("updateState", (app as any).stateBuffer)
      );
    }, 50);
  }
  setTransparency(percentage: any) {
    this.transparency_ = percentage;
    this.mapObject.setTransparency(percentage);
    this.requestUpdateState({ transparency: percentage });
  }
  getTransparency() {
    return this.transparency_ == null ? 0 : this.transparency_;
  }
  setViewpoint(cond: any) {
    this.from.setViewpoint(cond);
  }
  getMapMeta(mapID: any) {
    const app = this;
    let source: any;
    if (!mapID) {
      source = app.from;
    } else {
      source = app.cacheHash[mapID];
    }
    if (!source) return;
    return META_KEYS.reduce(
      (prev, curr) => {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        prev[curr] = source[curr];
        return prev;
      },
      {
        mapID: source.mapID,
        label: source.label
      }
    );
  }
  async getMapTileCacheSizeAsync(mapID: any) {
    const app = this;
    let source;
    if (!mapID) {
      source = app.from;
    } else {
      source = app.cacheHash[mapID];
    }
    if (!source) return 0;
    return source.getTileCacheSizeAsync();
  }
  async clearMapTileCacheAsync(mapID: any) {
    const app = this;
    let source;
    if (!mapID) {
      source = app.from;
    } else {
      source = app.cacheHash[mapID];
    }
    if (!source) return;
    source.clearTileCacheAsync();
  }
  convertParametersFromCurrent(to: any, callback: any) {
    const app = this;
    const view = app.mapObject.getView();
    let fromPromise = app.from.size2MercsAsync();
    const current = recursiveRound(
      [view.getCenter(), view.getZoom(), view.getRotation()],
      10
    );
    if (
      (app as any).mercBuffer &&
      (app as any).mercBuffer.mercs &&
      (app as any).mercBuffer.buffer[app.from.mapID]
    ) {
      const buffer = (app as any).mercBuffer.buffer[app.from.mapID];
      if (
        buffer[0][0] == current[0][0] &&
        buffer[0][1] == current[0][1] &&
        buffer[1] == current[1] &&
        buffer[2] == current[2]
      ) {
        (app as any).logger.debug(buffer);
        (app as any).logger.debug(current);
        (app as any).logger.debug("From: Use buffer");
        fromPromise = new Promise((res, _rej) => {
          res((app as any).mercBuffer.mercs);
        });
      } else {
        (app as any).mercBuffer = {
          buffer: {}
        };
        (app as any).mercBuffer.buffer[app.from.mapID] = current;
      }
    } else {
      (app as any).mercBuffer = {
        buffer: {}
      };
      (app as any).mercBuffer.buffer[app.from.mapID] = current;
    }
    (app as any).logger.debug(
      `From: Center: ${current[0]} Zoom: ${current[1]} Rotation: ${current[2]}`
    );
    (app as any).logger.debug(`From: ${app.from.mapID}`);
    fromPromise
      .then((mercs: any) => {
        (app as any).mercBuffer.mercs = mercs;
        (app as any).logger.debug(`Mercs: ${mercs}`);
        let toPromise = to.mercs2SizeAsync(mercs);
        const key = to.mapID;
        if ((app as any).mercBuffer.buffer[key]) {
          (app as any).logger.debug("To: Use buffer");
          toPromise = new Promise((res, _rej) => {
            res((app as any).mercBuffer.buffer[key]);
          });
        }
        toPromise
          .then((size: any) => {
            (app as any).logger.debug(
              `To: Center: ${size[0]} Zoom: ${size[1]} Rotation: ${size[2]}`
            );
            (app as any).logger.debug(`To: ${to.mapID}`);
            (app as any).mercBuffer.buffer[to.mapID] = recursiveRound(size, 10);
            callback(size);
          })
          .catch((err: any) => {
            throw err;
          });
      })
      .catch((err: any) => {
        throw err;
      });
  }
  translate(dataFragment: any) {
    const app = this;
    if (!dataFragment || typeof dataFragment != "object") return dataFragment;
    const langs = Object.keys(dataFragment);
    let key = langs.reduce((prev, curr, idx, arr) => {
      if (curr == (app as any).appLang) {
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'any[]' is not assignable to type 'null'.
        prev = [dataFragment[curr], true];
      }
      // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
      else if (!prev || (curr == "en" && !prev[1])) {
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'any[]' is not assignable to type 'null'.
        prev = [dataFragment[curr], false];
      }
      if (idx == arr.length - 1)
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        return prev[0];
      return prev;
    }, null);
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'null'.
    key = typeof key == "string" ? key : `${key}`;
    if (
      (app as any).i18n.exists(key, {
        ns: "translation",
        nsSeparator: "__X__yX__X__"
      })
    )
      return (app as any).t(key, {
        ns: "translation",
        nsSeparator: "__X__yX__X__"
      });
    for (let i = 0; i < langs.length; i++) {
      const lang = langs[i];
      (app as any).i18n.addResource(
        lang,
        "translation",
        key,
        dataFragment[lang]
      );
    }
    return (app as any).t(key, {
      ns: "translation",
      nsSeparator: "__X__yX__X__"
    });
  }
  remove() {
    if (this.mapboxMap) {
      this.mapboxMap.remove();
    }
    this.mapDivDocument.innerHTML = "";
    this.mapDivDocument.classList.remove("maplat");
  }
}
export { createElement };
export { CustomEvent };
