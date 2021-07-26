import i18n from "i18next";
import i18nxhr from "i18next-xhr-backend";
import CustomEvent from "./customevent";
import browserLanguage from "./browserlanguage";
import { Logger, LoggerLevel } from "./logger";
import { createElement, normalizeDegree, createMapInfo, normalizeArg } from "./functions";
import EventTarget from "ol/events/Target";
import { transform } from "ol/proj";
import { MaplatMap } from "./map_ex";
import { defaults, DragRotateAndZoom } from "ol/interaction";
import { altKeyOnly } from "ol/events/condition";
import { HistMap } from "./source/histmap";
import { NowMap } from "./source/nowmap";
import { TmsMap } from "./source/tmsmap";
import { MapboxMap } from "./source/mapboxmap";
import { mapSourceFactory } from "./source_ex";
import { META_KEYS } from "./source/mixin";
import { recursiveRound } from "./math_ex";
import locales from "./freeze_locales";
import { normalizeLayers, addIdToPoi, normalizeLayer, normalizePoi } from "./normalize_pois";
import { createIconSet, createHtmlFromTemplate } from "./template_works";
import redcircle from "../parts/redcircle.png";
import defaultpin_selected from "../parts/defaultpin_selected.png";
import defaultpin from "../parts/defaultpin.png";
export class MaplatApp extends EventTarget {
    constructor(appOption) {
        super();
        this.translateUI = false;
        this.noRotate = false;
        this.initialRestore = {};
        this.mapDiv = "map_div";
        this.restoreSession = false;
        this.stateBuffer = {};
        this.overlay = true;
        this.appLang = "ja";
        this.timer = undefined;
        this.startFrom = "";
        this.vectors = [];
        this.__backMapMoving = false;
        this.__init = true;
        this.__redrawMarkerBlock = false;
        this.__redrawMarkerThrottle = [];
        appOption = normalizeArg(appOption);
        this.appid = appOption.appid || "sample";
        if (appOption.mapboxgl) {
            this.mapboxgl = appOption.mapboxgl;
            if (appOption.mapboxToken) {
                this.mapboxgl.accessToken = appOption.mapboxToken;
            }
        }
        this.mapDiv = appOption.div || "map_div";
        this.mapDivDocument = document.querySelector(`#${this.mapDiv}`);
        this.mapDivDocument.classList.add("maplat");
        this.logger = new Logger(appOption.debug ? LoggerLevel.ALL : LoggerLevel.INFO);
        this.enableCache = appOption.enableCache || false;
        this.icon = appOption.icon;
        this.selectedIcon = appOption.selectedIcon;
        this.translateUI = appOption.translateUI;
        const setting = appOption.setting;
        this.lang = appOption.lang;
        if (!this.lang) {
            this.lang = browserLanguage();
        }
        if (this.lang.toLowerCase() == "zh-hk" ||
            this.lang.toLowerCase() == "zh-hant")
            this.lang = "zh-TW";
        if (appOption.restore) {
            if (appOption.restoreSession)
                this.restoreSession = true;
            this.initialRestore = appOption.restore;
        }
        else if (appOption.restoreSession) {
            this.restoreSession = true;
            const lastEpoch = parseInt(localStorage.getItem("epoch") || "0");
            const currentTime = Math.floor(new Date().getTime() / 1000);
            if (lastEpoch && currentTime - lastEpoch < 3600) {
                this.initialRestore.mapID =
                    localStorage.getItem("mapID") ||
                        localStorage.getItem("sourceID") ||
                        undefined;
                this.initialRestore.backgroundID =
                    localStorage.getItem("backgroundID") ||
                        localStorage.getItem("backID") ||
                        undefined;
                this.initialRestore.position = {
                    x: parseFloat(localStorage.getItem("x") || "0"),
                    y: parseFloat(localStorage.getItem("y") || "0"),
                    zoom: parseFloat(localStorage.getItem("zoom") || "0"),
                    rotation: parseFloat(localStorage.getItem("rotation") || "0")
                };
                this.initialRestore.transparency = parseFloat(localStorage.getItem("transparency") || "0");
                this.initialRestore.hideMarker = parseInt(localStorage.getItem("hideMarker") || "0");
                this.initialRestore.hideLayer =
                    localStorage.getItem("hideLayer") || undefined;
            }
        }
        const newElems = createElement(`<img id="center_circle" class="prevent-default" alt=""
            style="position:absolute;top:50%;left:50%;margin-top:-10px;
            margin-left:-10px;" src="${redcircle}">`);
        for (let i = newElems.length - 1; i >= 0; i--) {
            this.mapDivDocument.insertBefore(newElems[i], this.mapDivDocument.firstChild);
        }
        const prevDefs = this.mapDivDocument.querySelectorAll(".prevent-default");
        for (let i = 0; i < prevDefs.length; i++) {
            const target = prevDefs[i];
            target.addEventListener("touchstart", (evt) => {
                evt.preventDefault();
            });
        }
        this.overlay = "overlay" in appOption ? appOption.overlay : true;
        if (this.overlay) {
            this.mapDivDocument.classList.add("with-opacity");
        }
        this.waitReady = this.settingLoader(setting).then(x => this.handleSetting(x, appOption));
    }
    async settingLoader(setting) {
        return (setting ||
            new Promise((resolve, _reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", `apps/${this.appid}.json`, true);
                xhr.responseType = "json";
                xhr.onload = function (_e) {
                    let value = this.response;
                    if (typeof value != "object")
                        value = JSON.parse(value);
                    resolve(value);
                };
                xhr.send();
            }));
    }
    async i18nLoader() {
        return new Promise((resolve, _reject) => {
            const localesFlag = Object.keys(locales).length != 0;
            const translib = this.translateUI && !localesFlag ? i18n.use(i18nxhr) : i18n;
            translib.init({
                lng: this.lang,
                fallbackLng: ["en"],
                backend: {
                    loadPath: "assets/locales/{{lng}}/{{ns}}.json"
                },
                resources: localesFlag ? locales : undefined
            }, (_err, t) => {
                resolve([t, i18n]);
            });
        });
    }
    async sourcesLoader(mapReturnValue) {
        const dataSource = this.appData.sources;
        const sourcePromise = [];
        const commonOption = {
            homePos: mapReturnValue.homePos,
            defZoom: mapReturnValue.defZoom,
            zoomRestriction: mapReturnValue.zoomRestriction,
            mercMinZoom: mapReturnValue.mercMinZoom,
            mercMaxZoom: mapReturnValue.mercMaxZoom,
            enableCache: this.enableCache,
            translator: (fragment) => this.translate(fragment)
        };
        for (let i = 0; i < dataSource.length; i++) {
            const option = dataSource[i];
            sourcePromise.push(mapSourceFactory(option, commonOption));
        }
        return Promise.all(sourcePromise);
    }
    handleSetting(setting, appOption) {
        this.appData = normalizeArg(setting);
        if (!this.lang && this.appData.lang) {
            this.lang = this.appData.lang;
        }
        return this.i18nLoader().then(x => this.handleI18n(x, appOption));
    }
    handleI18n(i18nObj, appOption) {
        this.i18n = i18nObj[1];
        this.t = i18nObj[0];
        const mapReturnValue = this.prepareMap(appOption);
        return normalizeLayers(this.appData.pois || [], this).then(x => this.handlePois(x, mapReturnValue));
    }
    prepareMap(appOption) {
        appOption = normalizeArg(appOption);
        this.mercBuffer = null;
        const homePos = this.appData.homePosition;
        const defZoom = this.appData.defaultZoom;
        const zoomRestriction = this.appData.zoomRestriction;
        const mercMinZoom = this.appData.minZoom;
        const mercMaxZoom = this.appData.maxZoom;
        this.appName = this.appData.appName;
        const fakeGps = appOption.fake ? this.appData.fakeGps : false;
        const fakeRadius = appOption.fake ? this.appData.fakeRadius : false;
        this.appLang = this.appData.lang || "ja";
        this.noRotate = appOption.noRotate || this.appData.noRotate || false;
        this.poiTemplate =
            appOption.poiTemplate || this.appData.poiTemplate || false;
        this.poiStyle = appOption.poiStyle || this.appData.poiStyle || false;
        this.iconTemplate =
            appOption.iconTemplate || this.appData.iconTemplate || false;
        this.currentPosition = null;
        this.__init = true;
        this.dispatchEvent(new CustomEvent("uiPrepare"));
        const frontDiv = `${this.mapDiv}_front`;
        let newElem = createElement(`<div id="${frontDiv}" class="map" style="top:0; left:0; right:0; bottom:0; ` +
            `position:absolute;"></div>`)[0];
        this.mapDivDocument.insertBefore(newElem, this.mapDivDocument.firstChild);
        this.mapObject = new MaplatMap({
            div: frontDiv,
            controls: this.appData.controls || [],
            interactions: this.noRotate
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
        if (this.overlay) {
            backDiv = `${this.mapDiv}_back`;
            newElem = createElement(`<div id="${backDiv}" class="map" style="top:0; left:0; right:0; bottom:0; ` +
                `position:absolute;"></div>`)[0];
            this.mapDivDocument.insertBefore(newElem, this.mapDivDocument.firstChild);
            this.backMap = new MaplatMap({
                off_control: true,
                div: backDiv
            });
        }
        if (this.mapboxgl) {
            const mapboxgl = this.mapboxgl;
            delete this.mapboxgl;
            const mapboxDiv = `${this.mapDiv}_mapbox`;
            newElem = createElement(`<div id="${mapboxDiv}" class="map" style="top:0; left:0; right:0; bottom:0; ` +
                `position:absolute;visibility:hidden;"></div>`)[0];
            this.mapDivDocument.insertBefore(newElem, this.mapDivDocument.firstChild);
            this.mapboxMap = new mapboxgl.Map({
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
        this.startFrom = this.appData.startFrom;
        return {
            homePos,
            defZoom,
            zoomRestriction,
            mercMinZoom,
            mercMaxZoom
        };
    }
    handlePois(pois, mapReturnValue) {
        this.pois = pois;
        return this.sourcesLoader(mapReturnValue).then(x => this.handleSources(x));
    }
    handleSources(sources) {
        this.mercSrc = sources.reduce((prev, curr) => {
            if (prev)
                return prev;
            if (curr instanceof NowMap && !(curr instanceof TmsMap))
                return curr;
        }, null);
        const cache = [];
        this.cacheHash = {};
        for (let i = 0; i < sources.length; i++) {
            const source = sources[i];
            source._map = this.mapObject;
            if (source instanceof MapboxMap) {
                if (!this.mapboxMap) {
                    throw "To use mapbox gl based base map, you have to make Maplat object with specifying 'mapboxgl' option.";
                }
                source.mapboxMap = this.mapboxMap;
            }
            cache.push(source);
            this.cacheHash[source.mapID] = source;
        }
        this.dispatchEvent(new CustomEvent("sourceLoaded", sources));
        this.setInitialMap(cache);
        this.setMapClick();
        this.setPointerEvents();
        this.setMapOnOff();
        this.setMouseCursor();
        this.setBackMapBehavior();
        this.raiseChangeViewpoint();
    }
    async setInitialMap(cache) {
        const initial = this.initialRestore.mapID ||
            this.startFrom ||
            cache[cache.length - 1].mapID;
        this.from = cache.reduce((prev, curr) => {
            if (prev) {
                return !(prev instanceof HistMap) && curr.mapID != initial
                    ? curr
                    : prev;
            }
            if (curr.mapID != initial)
                return curr;
            return prev;
        }, undefined);
        await this.changeMap(initial, this.initialRestore);
    }
    setMapClick() {
        this.mapObject.on("click", (evt) => {
            this.logger.debug(evt.pixel);
            this.lastClickEvent = evt;
            const features = [];
            evt.target.forEachFeatureAtPixel(evt.pixel, (feature) => {
                this.logger.debug(evt.pixel);
                if (feature.get("datum"))
                    features.push(feature.get("datum"));
            });
            if (features.length > 0) {
                this.dispatchEvent(new CustomEvent("clickMarker", features[0]));
                this.dispatchEvent(new CustomEvent("clickMarkers", features));
            }
            else {
                const xy = evt.coordinate;
                this.dispatchEvent(new CustomEvent("clickMapXy", xy));
                this.from
                    .sysCoord2MercAsync(xy)
                    .then((merc) => {
                    this.dispatchEvent(new CustomEvent("clickMapMerc", merc));
                    const lnglat = transform(merc, "EPSG:3857", "EPSG:4326");
                    this.dispatchEvent(new CustomEvent("clickMap", {
                        longitude: lnglat[0],
                        latitude: lnglat[1]
                    }));
                });
            }
        });
    }
    setPointerEvents() {
        let xyBuffer;
        let waiting = false;
        let dragging = false;
        const pointerCounter = {};
        const pointermoveHandler = (xy) => {
            this.dispatchEvent(new CustomEvent("pointerMoveOnMapXy", xy));
            this.from
                .sysCoord2MercAsync(xy)
                .then((merc) => {
                this.dispatchEvent(new CustomEvent("pointerMoveOnMapMerc", merc));
                if (xyBuffer) {
                    const next = xyBuffer;
                    xyBuffer = false;
                    pointermoveHandler(next);
                }
                else {
                    waiting = false;
                }
            });
        };
        this.mapObject.on("pointermove", (evt) => {
            if (dragging)
                return;
            if (waiting) {
                xyBuffer = evt.coordinate;
            }
            else {
                waiting = true;
                pointermoveHandler(evt.coordinate);
            }
        });
        this.mapObject.on("pointerdown", (evt) => {
            if (evt.originalEvent && evt.originalEvent.pointerId != null) {
                pointerCounter[evt.originalEvent.pointerId] = true;
            }
            dragging = true;
        });
        this.mapObject.on("pointerdrag", (evt) => {
            if (evt.originalEvent && evt.originalEvent.pointerId != null) {
                pointerCounter[evt.originalEvent.pointerId] = true;
            }
            dragging = true;
        });
        this.mapObject.on("pointerup", (evt) => {
            if (evt.originalEvent && evt.originalEvent.pointerId != null) {
                delete pointerCounter[evt.originalEvent.pointerId];
                if (Object.keys(pointerCounter).length == 0) {
                    dragging = false;
                }
            }
            else if (evt.originalEvent && evt.originalEvent.touches) {
                if (evt.originalEvent.touches.length == 0) {
                    dragging = false;
                }
            }
            else {
                dragging = false;
            }
        });
    }
    setMapOnOff() {
        let timer;
        this.mapObject.on("click", () => {
            if (timer) {
                clearTimeout(timer);
                timer = undefined;
            }
            const ctls = this.mapDivDocument.querySelectorAll(".ol-control");
            for (let i = 0; i < ctls.length; i++) {
                ctls[i].classList.remove("fade");
            }
        });
        this.mapObject.on("pointerdrag", () => {
            if (timer) {
                clearTimeout(timer);
                timer = undefined;
            }
            const ctls = this.mapDivDocument.querySelectorAll(".ol-control");
            for (let i = 0; i < ctls.length; i++) {
                ctls[i].classList.add("fade");
            }
        });
        this.mapObject.on("moveend", () => {
            if (timer) {
                clearTimeout(timer);
                timer = undefined;
            }
            timer = setTimeout(() => {
                timer = undefined;
                const ctls = this.mapDivDocument.querySelectorAll(".ol-control");
                for (let i = 0; i < ctls.length; i++) {
                    ctls[i].classList.remove("fade");
                }
            }, 3000);
        });
    }
    setMouseCursor() {
        const moveHandler = (evt) => {
            const pixel = evt.target.getEventPixel(evt.originalEvent);
            const hit = evt.target.hasFeatureAtPixel(pixel);
            const target = evt.target.getTarget();
            if (hit) {
                const feature = evt.target.forEachFeatureAtPixel(evt.pixel, (feature) => {
                    if (feature.get("datum"))
                        return feature;
                });
                this.mapDivDocument.querySelector(`#${target}`).style.cursor = feature ? "pointer" : "";
                return;
            }
            this.mapDivDocument.querySelector(`#${target}`).style.cursor = "";
        };
        this.mapObject.on("pointermove", moveHandler);
        const mapOutHandler = (evt) => {
            let histCoord = evt.frameState.viewState.center;
            const source = this.from;
            if (!source.insideCheckSysCoord(histCoord)) {
                histCoord = source.modulateSysCoordInside(histCoord);
                evt.target.getView().setCenter(histCoord);
            }
        };
        this.mapObject.on("moveend", mapOutHandler);
    }
    setBackMapBehavior() {
        const backMapMove = (_evt) => {
            if (!this.backMap)
                return;
            if (this.__backMapMoving) {
                this.logger.debug("Backmap moving skipped");
                return;
            }
            const backSrc = this.backMap.getSource();
            if (backSrc) {
                this.__backMapMoving = true;
                this.logger.debug("Backmap moving started");
                this.convertParametersFromCurrent(backSrc, (size) => {
                    const view = this.backMap.getView();
                    view.setCenter(size[0]);
                    view.setZoom(size[1]);
                    view.setRotation(this.noRotate ? 0 : size[2]);
                    this.logger.debug("Backmap moving ended");
                    this.__backMapMoving = false;
                });
            }
        };
        this.mapObject.on("postrender", backMapMove);
    }
    raiseChangeViewpoint() {
        this.mapObject.on("postrender", (_evt) => {
            const view = this.mapObject.getView();
            const center = view.getCenter();
            const zoom = view.getDecimalZoom();
            const rotation = normalizeDegree((view.getRotation() * 180) / Math.PI);
            this.from
                .viewpoint2MercsAsync()
                .then(mercs => this.mercSrc.mercs2ViewpointAsync(mercs))
                .then(viewpoint => {
                if (this.mobileMapMoveBuffer &&
                    this.mobileMapMoveBuffer[0][0] == viewpoint[0][0] &&
                    this.mobileMapMoveBuffer[0][1] == viewpoint[0][1] &&
                    this.mobileMapMoveBuffer[1] == viewpoint[1] &&
                    this.mobileMapMoveBuffer[2] == viewpoint[2]) {
                    return;
                }
                this.mobileMapMoveBuffer = viewpoint;
                const ll = transform(viewpoint[0], "EPSG:3857", "EPSG:4326");
                const direction = normalizeDegree((viewpoint[2] * 180) / Math.PI);
                this.dispatchEvent(new CustomEvent("changeViewpoint", {
                    x: center[0],
                    y: center[1],
                    longitude: ll[0],
                    latitude: ll[1],
                    mercator_x: viewpoint[0][0],
                    mercator_y: viewpoint[0][1],
                    zoom,
                    mercZoom: viewpoint[1],
                    direction,
                    rotation
                }));
                this.requestUpdateState({
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
        return createMapInfo(this.from);
    }
    mapInfo(mapID) {
        return createMapInfo(this.cacheHash[mapID]);
    }
    setMarker(data) {
        this.logger.debug(data);
        const lnglat = data.lnglat || [
            data.lng || data.longitude,
            data.lat || data.latitude
        ];
        const x = data.x;
        const y = data.y;
        const coords = data.coordinates;
        const src = this.from;
        const icon = data.icon
            ? this.__selectedMarker == data.namespaceID && data.selectedIcon
                ? data.selectedIcon
                : data.icon
            : this.__selectedMarker == data.namespaceID
                ? defaultpin_selected
                : defaultpin;
        const promise = coords
            ? (function () {
                return src.merc2SysCoordAsync_ignoreBackground(coords);
            })()
            : x && y
                ? new Promise(resolve => {
                    resolve(src.xy2SysCoord([x, y]));
                })
                : (function () {
                    const merc = transform(lnglat, "EPSG:4326", "EPSG:3857");
                    return src.merc2SysCoordAsync_ignoreBackground(merc);
                })();
        return promise.then((xy) => {
            if (!xy)
                return;
            if (src.insideCheckSysCoord(xy)) {
                this.mapObject.setMarker(xy, { datum: data }, icon);
            }
        });
    }
    resetMarker() {
        this.mapObject.resetMarker();
    }
    setLine(data) {
        data.type = "Line";
        if (!data.style && data.stroke) {
            data.style = {
                stroke: data.stroke
            };
        }
        this.setVector(data);
    }
    setVector(data) {
        this.logger.debug(data);
        let xyPromises;
        const merc2XyRecurse = (coords, isLnglat = false) => Promise.all(coords.map((coord) => {
            if (Array.isArray(coord[0])) {
                return merc2XyRecurse(coord, isLnglat);
            }
            else {
                if (isLnglat)
                    coord = transform(coord, "EPSG:4326", "EPSG:3857");
                return this.from.merc2SysCoordAsync(coord);
            }
        }));
        if (data.coordinates) {
            xyPromises = merc2XyRecurse(data.coordinates);
        }
        else {
            xyPromises = merc2XyRecurse(data.lnglats, true);
        }
        xyPromises.then(xys => {
            this.mapObject.setVector(xys, data.type, data.style);
        });
    }
    resetLine() {
        this.resetVector();
    }
    resetVector() {
        this.mapObject.resetVector();
    }
    redrawMarkers(source = undefined) {
        if (!source) {
            source = this.from;
        }
        if (this.__redrawMarkerBlock) {
            if (!this.__redrawMarkerThrottle)
                this.__redrawMarkerThrottle = [];
            const throttle = this.__redrawMarkerThrottle;
            if (throttle.length == 0 || throttle[throttle.length - 1] !== source) {
                throttle.push(source);
                return;
            }
        }
        this.__redrawMarkerBlock = true;
        const redrawLogic = (source) => {
            const promises = [];
            this.resetMarker();
            let selected;
            if (!this.stateBuffer.hideMarker) {
                Object.keys(this.pois).map(key => {
                    const cluster = this.pois[key];
                    if (!cluster.hide) {
                        cluster.pois.map((data) => {
                            const dataCopy = createIconSet(data, cluster, this);
                            createHtmlFromTemplate(dataCopy, cluster, this);
                            if (this.__selectedMarker == dataCopy.namespaceID) {
                                selected = dataCopy;
                            }
                            else {
                                promises.push(this.setMarker(dataCopy));
                            }
                        });
                    }
                });
                if (source.pois) {
                    Object.keys(source.pois).map(key => {
                        const cluster = source.pois[key];
                        if (!cluster.hide) {
                            cluster.pois.map((data) => {
                                const dataCopy = createIconSet(data, cluster, source, this);
                                createHtmlFromTemplate(dataCopy, cluster, source, this);
                                if (this.__selectedMarker == dataCopy.namespaceID) {
                                    selected = dataCopy;
                                }
                                else {
                                    promises.push(this.setMarker(dataCopy));
                                }
                            });
                        }
                    });
                }
            }
            let promise_var = Promise.all(promises);
            if (selected) {
                promise_var = promise_var.then(() => this.setMarker(selected));
            }
            promise_var.then(() => {
                if (this.__redrawMarkerThrottle &&
                    this.__redrawMarkerThrottle.length > 0) {
                    redrawLogic(this.__redrawMarkerThrottle.shift());
                }
                else {
                    this.__redrawMarkerBlock = false;
                }
            });
        };
        redrawLogic(source);
    }
    selectMarker(id) {
        const data = this.getMarker(id);
        if (!data)
            return;
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
        this.redrawMarkers();
    }
    unselectMarker() {
        delete this.__selectedMarker;
        this.redrawMarkers();
    }
    getMarker(id) {
        if (id.indexOf("#") < 0) {
            let ret = undefined;
            Object.keys(this.pois).map(key => {
                this.pois[key].pois.map((poi, i) => {
                    if (poi.id == id) {
                        ret = this.pois[key].pois[i];
                    }
                });
            });
            return ret;
        }
        else {
            const splits = id.split("#");
            const source = this.cacheHash[splits[0]];
            if (source) {
                return source.getPoi(splits[1]);
            }
        }
    }
    updateMarker(id, data, overwrite) {
        const poi = this.getMarker(id);
        if (!poi)
            return;
        data = normalizePoi(data || {});
        if (overwrite) {
            Object.keys(poi).map(key => {
                if (key != "id" && key != "namespaceID") {
                    delete poi[key];
                }
            });
            Object.assign(poi, data);
        }
        else {
            Object.keys(data).map(key => {
                if (key == "id" || key == "namespaceID")
                    return;
                if (data[key] == "____delete____") {
                    delete poi[key];
                }
                else {
                    poi[key] = data[key];
                }
            });
        }
        this.redrawMarkers();
    }
    addMarker(data, clusterId) {
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
                this.redrawMarkers();
                return data.namespaceID;
            }
        }
        else {
            const splits = clusterId.split("#");
            const source = this.cacheHash[splits[0]];
            if (source) {
                const ret = source.addPoi(data, splits[1]);
                this.dispatchPoiNumber();
                this.redrawMarkers();
                return ret;
            }
        }
    }
    removeMarker(id) {
        if (id.indexOf("#") < 0) {
            Object.keys(this.pois).map(key => {
                this.pois[key].pois.map((poi, i) => {
                    if (poi.id == id) {
                        delete this.pois[key].pois[i];
                        this.dispatchPoiNumber();
                        this.redrawMarkers();
                    }
                });
            });
        }
        else {
            const splits = id.split("#");
            const source = this.cacheHash[splits[0]];
            if (source) {
                source.removePoi(splits[1]);
                this.dispatchPoiNumber();
                this.redrawMarkers();
            }
        }
    }
    clearMarker(clusterId) {
        if (!clusterId) {
            clusterId = "main";
        }
        if (clusterId.indexOf("#") < 0) {
            if (clusterId == "all") {
                Object.keys(this.pois).map(key => {
                    this.pois[key]["pois"] = [];
                });
            }
            else if (this.pois[clusterId]) {
                this.pois[clusterId]["pois"] = [];
            }
            else
                return;
            this.dispatchPoiNumber();
            this.redrawMarkers();
        }
        else {
            const splits = clusterId.split("#");
            const source = this.cacheHash[splits[0]];
            if (source) {
                source.clearPoi(splits[1]);
                this.dispatchPoiNumber();
                this.redrawMarkers();
            }
        }
    }
    showAllMarkers() {
        this.requestUpdateState({ hideMarker: 0 });
        this.redrawMarkers();
    }
    hideAllMarkers() {
        this.requestUpdateState({ hideMarker: 1 });
        this.redrawMarkers();
    }
    dispatchPoiNumber() {
        this.dispatchEvent(new CustomEvent("poi_number", this.listPoiLayers(false, true).reduce((prev, curr) => prev + curr.pois.length, 0)));
    }
    listPoiLayers(hideOnly = false, nonzero = false) {
        const appPois = Object.keys(this.pois)
            .sort((a, b) => {
            if (a == "main")
                return -1;
            else if (b == "main")
                return 1;
            else if (a < b)
                return -1;
            else if (a > b)
                return 1;
            else
                return 0;
        })
            .map(key => this.pois[key])
            .filter(layer => nonzero
            ? hideOnly
                ? layer.pois.length && layer.hide
                : layer.pois.length
            : hideOnly
                ? layer.hide
                : true);
        const mapPois = this.from.listPoiLayers(hideOnly, nonzero);
        return appPois.concat(mapPois);
    }
    showPoiLayer(id) {
        const layer = this.getPoiLayer(id);
        if (layer) {
            delete layer.hide;
            this.requestUpdateState({
                hideLayer: this.listPoiLayers(true)
                    .map(layer => layer.namespaceID)
                    .join(",")
            });
            this.redrawMarkers();
        }
    }
    hidePoiLayer(id) {
        const layer = this.getPoiLayer(id);
        if (layer) {
            layer.hide = true;
            this.requestUpdateState({
                hideLayer: this.listPoiLayers(true)
                    .map(layer => layer.namespaceID)
                    .join(",")
            });
            this.redrawMarkers();
        }
    }
    getPoiLayer(id) {
        if (id.indexOf("#") < 0) {
            return this.pois[id];
        }
        else {
            const splits = id.split("#");
            const source = this.cacheHash[splits[0]];
            if (source) {
                return source.getPoiLayer(splits[1]);
            }
        }
    }
    addPoiLayer(id, data) {
        if (id == "main")
            return;
        if (this.pois[id])
            return;
        if (id.indexOf("#") < 0) {
            this.pois[id] = normalizeLayer(data || [], id, {
                name: this.appName
            });
            this.redrawMarkers();
        }
        else {
            const splits = id.split("#");
            const source = this.cacheHash[splits[0]];
            if (source) {
                source.addPoiLayer(splits[1], data);
                this.redrawMarkers();
            }
        }
    }
    removePoiLayer(id) {
        if (id == "main")
            return;
        if (!this.pois[id])
            return;
        if (id.indexOf("#") < 0) {
            delete this.pois[id];
            this.requestUpdateState({
                hideLayer: this.listPoiLayers(true)
                    .map(layer => layer.namespaceID)
                    .join(",")
            });
            this.dispatchPoiNumber();
            this.redrawMarkers();
        }
        else {
            const splits = id.split("#");
            const source = this.cacheHash[splits[0]];
            if (source) {
                source.removePoiLayer(splits[1]);
                this.requestUpdateState({
                    hideLayer: this.listPoiLayers(true)
                        .map(layer => layer.namespaceID)
                        .join(",")
                });
                this.dispatchPoiNumber();
                this.redrawMarkers();
            }
        }
    }
    addLine(data) {
        this.vectors.push(data);
        this.setLine(data);
    }
    addVector(data) {
        this.vectors.push(data);
        this.setVector(data);
    }
    clearLine() {
        this.vectors = [];
        this.resetLine();
    }
    clearVector() {
        this.vectors = [];
        this.resetVector();
    }
    setGPSMarker(position) {
        this.currentPosition = position;
        this.from.setGPSMarker(position, true);
    }
    changeMap(mapID, restore) {
        if (restore === undefined)
            restore = {};
        const now = this.mercSrc;
        const to = this.cacheHash[mapID];
        if (!this.changeMapSeq) {
            this.changeMapSeq = Promise.resolve();
        }
        return (this.changeMapSeq = this.changeMapSeq.then(() => new Promise((resolve, _reject) => {
            this.convertParametersFromCurrent(to, (size) => {
                let backSrc = null;
                let backTo = null;
                const backRestore = restore.backgroundID
                    ? this.cacheHash[restore.backgroundID]
                    : undefined;
                if (this.backMap) {
                    backSrc = this.backMap.getSource();
                    if (!(to instanceof NowMap)) {
                        if (backRestore) {
                            backTo = backRestore;
                            this.backMap.exchangeSource(backTo);
                        }
                        else {
                            if (!backSrc) {
                                backTo = now;
                                if (this.from instanceof NowMap) {
                                    backTo =
                                        this.from instanceof TmsMap
                                            ? this.mapObject.getSource()
                                            :
                                                this.from;
                                }
                                this.backMap.exchangeSource(backTo);
                            }
                            else {
                                backTo = backSrc;
                            }
                        }
                        this.requestUpdateState({ backgroundID: backTo.mapID });
                    }
                    else {
                        this.backMap.exchangeSource();
                    }
                }
                if (to instanceof TmsMap) {
                    this.mapObject.setLayer(to);
                    if (backRestore) {
                        this.mapObject.exchangeSource(backRestore);
                    }
                    else if (!(this.from instanceof NowMap)) {
                        const backToLocal = backSrc || now;
                        this.mapObject.exchangeSource(backToLocal);
                    }
                    this.requestUpdateState({
                        backgroundID: this.mapObject.getSource().mapID
                    });
                }
                else {
                    this.mapObject.setLayer();
                    this.mapObject.exchangeSource(to);
                }
                const updateState = {
                    mapID: to.mapID
                };
                if (to instanceof NowMap && !(to instanceof TmsMap)) {
                    updateState.backgroundID = "____delete____";
                }
                this.requestUpdateState(updateState);
                this.from = to;
                this.dispatchPoiNumber();
                const view = this.mapObject.getView();
                if (this.appData.zoomRestriction) {
                    view.setMaxZoom(to.maxZoom);
                    view.setMinZoom(to.minZoom || 0);
                }
                if (to.insideCheckSysCoord(size[0])) {
                    view.setCenter(size[0]);
                    view.setZoom(size[1]);
                    view.setRotation(this.noRotate ? 0 : size[2]);
                }
                else if (!this.__init) {
                    this.dispatchEvent(new CustomEvent("outOfMap", {}));
                    to.goHome();
                }
                to.setGPSMarker(this.currentPosition, true);
                if (restore.hideLayer) {
                    const layers = restore.hideLayer.split(",");
                    layers.map((key) => {
                        const layer = this.getPoiLayer(key);
                        if (layer) {
                            layer.hide = true;
                        }
                    });
                    this.requestUpdateState({ hideLayer: restore.hideLayer });
                }
                if (restore.hideMarker) {
                    this.hideAllMarkers();
                }
                else {
                    this.redrawMarkers();
                }
                this.resetVector();
                for (let i = 0; i < this.vectors.length; i++) {
                    (data => {
                        this.setVector(data);
                    })(this.vectors[i]);
                }
                this.dispatchEvent(new CustomEvent("mapChanged", this.getMapMeta(to.mapID)));
                this.mapObject.updateSize();
                this.mapObject.renderSync();
                if (restore.position) {
                    this.__init = false;
                    to.setViewpoint(restore.position);
                }
                if (restore.transparency) {
                    this.setTransparency(restore.transparency);
                }
                if (this.__init) {
                    this.__init = false;
                    to.goHome();
                }
                else if (this.backMap && backTo) {
                    this.convertParametersFromCurrent(backTo, (size) => {
                        const view = this.backMap.getView();
                        view.setCenter(size[0]);
                        view.setZoom(size[1]);
                        view.setRotation(this.noRotate ? 0 : size[2]);
                        this.backMap.updateSize();
                        this.backMap.renderSync();
                    });
                }
                resolve(undefined);
            });
        })));
    }
    requestUpdateState(data) {
        this.stateBuffer = Object.assign(this.stateBuffer, data);
        if (this.stateBuffer.backgroundID == "____delete____") {
            delete this.stateBuffer.backgroundID;
        }
        if (this.restoreSession) {
            const currentTime = Math.floor(new Date().getTime() / 1000);
            localStorage.setItem("epoch", `${currentTime}`);
            const loopSession = function (data) {
                Object.keys(data).map(key => {
                    if (key == "position") {
                        loopSession(data[key]);
                    }
                    else if (key == "backgroundID" && data[key] == "____delete____") {
                        localStorage.removeItem(key);
                    }
                    else {
                        localStorage.setItem(key, data[key]);
                    }
                });
            };
            loopSession(data);
        }
        if (this.timer)
            clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.timer = undefined;
            this.dispatchEvent(new CustomEvent("updateState", this.stateBuffer));
        }, 50);
    }
    setTransparency(percentage) {
        this.__transparency = percentage;
        this.mapObject.setTransparency(percentage);
        this.requestUpdateState({ transparency: percentage });
    }
    getTransparency() {
        return this.__transparency == null ? 0 : this.__transparency;
    }
    setViewpoint(cond) {
        this.from.setViewpoint(cond);
    }
    getMapMeta(mapID) {
        let source;
        if (!mapID) {
            source = this.from;
        }
        else {
            source = this.cacheHash[mapID];
        }
        if (!source)
            return;
        return META_KEYS.reduce((prev, curr) => {
            prev[curr] = source[curr];
            return prev;
        }, {
            mapID: source.mapID,
            label: source.label
        });
    }
    getMapCacheEnable(mapID) {
        let source;
        if (!mapID) {
            source = this.from;
        }
        else {
            source = this.cacheHash[mapID];
        }
        if (!source)
            return false;
        return source.getCacheEnable();
    }
    async getMapTileCacheStatsAsync(mapID) {
        let source;
        if (!mapID) {
            source = this.from;
        }
        else {
            source = this.cacheHash[mapID];
        }
        if (!source)
            return {};
        return await source.getTileCacheStatsAsync();
    }
    async getMapTileCacheSizeAsync(mapID) {
        const stats = await this.getMapTileCacheStatsAsync(mapID);
        return stats.size || 0;
    }
    async clearMapTileCacheAsync(mapID) {
        let source;
        if (!mapID) {
            source = this.from;
        }
        else {
            source = this.cacheHash[mapID];
        }
        if (!source)
            return;
        await source.clearTileCacheAsync();
    }
    async fetchAllMapTileCacheAsync(mapID, callback) {
        let source;
        if (!mapID) {
            source = this.from;
        }
        else {
            source = this.cacheHash[mapID];
        }
        if (!source) {
            callback("stop", {});
            return;
        }
        await source.fetchAllTileCacheAsync(callback);
    }
    async cancelMapTileCacheAsync(mapID) {
        let source;
        if (!mapID) {
            source = this.from;
        }
        else {
            source = this.cacheHash[mapID];
        }
        if (!source)
            return;
        await source.cancelTileCacheAsync();
    }
    convertParametersFromCurrent(to, callback) {
        const view = this.mapObject.getView();
        let fromPromise = this.from.viewpoint2MercsAsync();
        const current = recursiveRound([view.getCenter(), view.getZoom(), view.getRotation()], 10);
        if (this.mercBuffer &&
            this.mercBuffer.mercs &&
            this.mercBuffer.buffer[this.from.mapID]) {
            const buffer = this.mercBuffer.buffer[this.from.mapID];
            if (buffer[0][0] == current[0][0] &&
                buffer[0][1] == current[0][1] &&
                buffer[1] == current[1] &&
                buffer[2] == current[2]) {
                this.logger.debug(buffer);
                this.logger.debug(current);
                this.logger.debug("From: Use buffer");
                fromPromise = new Promise((res, _rej) => {
                    res(this.mercBuffer.mercs);
                });
            }
            else {
                this.mercBuffer = {
                    buffer: {}
                };
                this.mercBuffer.buffer[this.from.mapID] = current;
            }
        }
        else {
            this.mercBuffer = {
                buffer: {}
            };
            this.mercBuffer.buffer[this.from.mapID] = current;
        }
        this.logger.debug(`From: Center: ${current[0]} Zoom: ${current[1]} Rotation: ${current[2]}`);
        this.logger.debug(`From: ${this.from.mapID}`);
        fromPromise
            .then((mercs) => {
            this.mercBuffer.mercs = mercs;
            this.logger.debug(`Mercs: ${mercs}`);
            let toPromise = to.mercs2ViewpointAsync(mercs);
            const key = to.mapID;
            if (this.mercBuffer.buffer[key]) {
                this.logger.debug("To: Use buffer");
                toPromise = new Promise((res, _rej) => {
                    res(this.mercBuffer.buffer[key]);
                });
            }
            toPromise
                .then((size) => {
                this.logger.debug(`To: Center: ${size[0]} Zoom: ${size[1]} Rotation: ${size[2]}`);
                this.logger.debug(`To: ${to.mapID}`);
                this.mercBuffer.buffer[to.mapID] = recursiveRound(size, 10);
                callback(size);
            })
                .catch((err) => {
                throw err;
            });
        })
            .catch((err) => {
            throw err;
        });
    }
    translate(dataFragment) {
        if (!dataFragment || typeof dataFragment === "string")
            return dataFragment;
        const langs = Object.keys(dataFragment);
        let key = langs.reduce((prev, curr, idx, arr) => {
            if (curr == this.appLang) {
                prev = [dataFragment[curr], true];
            }
            else if (!prev || (curr == "en" && !prev[1])) {
                prev = [dataFragment[curr], false];
            }
            if (idx == arr.length - 1)
                return prev[0];
            return prev;
        }, undefined);
        key = typeof key === "string" ? key : `${key}`;
        if (this.i18n.exists(key, {
            ns: "translation",
            nsSeparator: "__X__yX__X__"
        }))
            return this.t(key, {
                ns: "translation",
                nsSeparator: "__X__yX__X__"
            });
        for (let i = 0; i < langs.length; i++) {
            const lang = langs[i];
            this.i18n.addResource(lang, "translation", key, dataFragment[lang]);
        }
        return this.t(key, {
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
//# sourceMappingURL=index.js.map