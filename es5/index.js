var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "i18next", "i18next-xhr-backend", "./customevent", "./browserlanguage", "./logger", "./functions", "ol/events/Target", "ol/proj", "./map_ex", "ol/interaction", "ol/events/condition", "./source/histmap", "./source/nowmap", "./source/tmsmap", "./source/mapboxmap", "./source_ex", "./source/mixin", "./math_ex", "./freeze_locales", "./normalize_pois", "./template_works", "../parts/redcircle.png", "../parts/defaultpin_selected.png", "../parts/defaultpin.png"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CustomEvent = exports.createElement = exports.MaplatApp = void 0;
    var i18next_1 = __importDefault(require("i18next"));
    var i18next_xhr_backend_1 = __importDefault(require("i18next-xhr-backend"));
    var customevent_1 = __importDefault(require("./customevent"));
    exports.CustomEvent = customevent_1.default;
    var browserlanguage_1 = __importDefault(require("./browserlanguage"));
    var logger_1 = require("./logger");
    var functions_1 = require("./functions");
    Object.defineProperty(exports, "createElement", { enumerable: true, get: function () { return functions_1.createElement; } });
    var Target_1 = __importDefault(require("ol/events/Target"));
    var proj_1 = require("ol/proj");
    var map_ex_1 = require("./map_ex");
    var interaction_1 = require("ol/interaction");
    var condition_1 = require("ol/events/condition");
    var histmap_1 = require("./source/histmap");
    var nowmap_1 = require("./source/nowmap");
    var tmsmap_1 = require("./source/tmsmap");
    var mapboxmap_1 = require("./source/mapboxmap");
    var source_ex_1 = require("./source_ex");
    var mixin_1 = require("./source/mixin");
    var math_ex_1 = require("./math_ex");
    var freeze_locales_1 = __importDefault(require("./freeze_locales"));
    var normalize_pois_1 = require("./normalize_pois");
    var template_works_1 = require("./template_works");
    var redcircle_png_1 = __importDefault(require("../parts/redcircle.png"));
    var defaultpin_selected_png_1 = __importDefault(require("../parts/defaultpin_selected.png"));
    var defaultpin_png_1 = __importDefault(require("../parts/defaultpin.png"));
    var MaplatApp = (function (_super) {
        __extends(MaplatApp, _super);
        function MaplatApp(appOption) {
            var _this = _super.call(this) || this;
            _this.translateUI = false;
            _this.noRotate = false;
            _this.initialRestore = {};
            _this.mapDiv = "map_div";
            _this.restoreSession = false;
            _this.stateBuffer = {};
            _this.overlay = true;
            _this.appLang = "ja";
            _this.timer = undefined;
            _this.startFrom = "";
            _this.vectors = [];
            _this.__backMapMoving = false;
            _this.__init = true;
            _this.__redrawMarkerBlock = false;
            _this.__redrawMarkerThrottle = [];
            appOption = (0, functions_1.normalizeArg)(appOption);
            _this.appid = appOption.appid || "sample";
            if (appOption.mapboxgl) {
                _this.mapboxgl = appOption.mapboxgl;
                if (appOption.mapboxToken) {
                    _this.mapboxgl.accessToken = appOption.mapboxToken;
                }
            }
            _this.mapDiv = appOption.div || "map_div";
            _this.mapDivDocument = document.querySelector("#".concat(_this.mapDiv));
            _this.mapDivDocument.classList.add("maplat");
            _this.logger = new logger_1.Logger(appOption.debug ? logger_1.LoggerLevel.ALL : logger_1.LoggerLevel.INFO);
            _this.enableCache = appOption.enableCache || false;
            _this.icon = appOption.icon;
            _this.selectedIcon = appOption.selectedIcon;
            _this.translateUI = appOption.translateUI;
            var setting = appOption.setting;
            _this.lang = appOption.lang;
            if (!_this.lang) {
                _this.lang = (0, browserlanguage_1.default)();
            }
            if (_this.lang.toLowerCase() == "zh-hk" ||
                _this.lang.toLowerCase() == "zh-hant")
                _this.lang = "zh-TW";
            if (appOption.restore) {
                if (appOption.restoreSession)
                    _this.restoreSession = true;
                _this.initialRestore = appOption.restore;
            }
            else if (appOption.restoreSession) {
                _this.restoreSession = true;
                var lastEpoch = parseInt(localStorage.getItem("epoch") || "0");
                var currentTime = Math.floor(new Date().getTime() / 1000);
                if (lastEpoch && currentTime - lastEpoch < 3600) {
                    _this.initialRestore.mapID =
                        localStorage.getItem("mapID") ||
                            localStorage.getItem("sourceID") ||
                            undefined;
                    _this.initialRestore.backgroundID =
                        localStorage.getItem("backgroundID") ||
                            localStorage.getItem("backID") ||
                            undefined;
                    _this.initialRestore.position = {
                        x: parseFloat(localStorage.getItem("x") || "0"),
                        y: parseFloat(localStorage.getItem("y") || "0"),
                        zoom: parseFloat(localStorage.getItem("zoom") || "0"),
                        rotation: parseFloat(localStorage.getItem("rotation") || "0")
                    };
                    _this.initialRestore.transparency = parseFloat(localStorage.getItem("transparency") || "0");
                    _this.initialRestore.hideMarker = parseInt(localStorage.getItem("hideMarker") || "0");
                    _this.initialRestore.hideLayer =
                        localStorage.getItem("hideLayer") || undefined;
                }
            }
            var newElems = (0, functions_1.createElement)("<img id=\"center_circle\" class=\"prevent-default\" alt=\"\"\n            style=\"position:absolute;top:50%;left:50%;margin-top:-10px;\n            margin-left:-10px;\" src=\"".concat(redcircle_png_1.default, "\">"));
            for (var i = newElems.length - 1; i >= 0; i--) {
                _this.mapDivDocument.insertBefore(newElems[i], _this.mapDivDocument.firstChild);
            }
            var prevDefs = _this.mapDivDocument.querySelectorAll(".prevent-default");
            for (var i = 0; i < prevDefs.length; i++) {
                var target = prevDefs[i];
                target.addEventListener("touchstart", function (evt) {
                    evt.preventDefault();
                });
            }
            _this.overlay = "overlay" in appOption ? appOption.overlay : true;
            if (_this.overlay) {
                _this.mapDivDocument.classList.add("with-opacity");
            }
            _this.waitReady = _this.settingLoader(setting).then(function (x) {
                return _this.handleSetting(x, appOption);
            });
            return _this;
        }
        MaplatApp.prototype.settingLoader = function (setting) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2, (setting ||
                            new Promise(function (resolve, _reject) {
                                var xhr = new XMLHttpRequest();
                                xhr.open("GET", "apps/".concat(_this.appid, ".json"), true);
                                xhr.responseType = "json";
                                xhr.onload = function (_e) {
                                    var value = this.response;
                                    if (typeof value != "object")
                                        value = JSON.parse(value);
                                    resolve(value);
                                };
                                xhr.send();
                            }))];
                });
            });
        };
        MaplatApp.prototype.i18nLoader = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2, new Promise(function (resolve, _reject) {
                            var localesFlag = Object.keys(freeze_locales_1.default).length != 0;
                            var translib = _this.translateUI && !localesFlag ? i18next_1.default.use(i18next_xhr_backend_1.default) : i18next_1.default;
                            translib.init({
                                lng: _this.lang,
                                fallbackLng: ["en"],
                                backend: {
                                    loadPath: "assets/locales/{{lng}}/{{ns}}.json"
                                },
                                resources: localesFlag ? freeze_locales_1.default : undefined
                            }, function (_err, t) {
                                resolve([t, i18next_1.default]);
                            });
                        })];
                });
            });
        };
        MaplatApp.prototype.sourcesLoader = function (mapReturnValue) {
            return __awaiter(this, void 0, void 0, function () {
                var dataSource, sourcePromise, commonOption, i, option;
                var _this = this;
                return __generator(this, function (_a) {
                    dataSource = this.appData.sources;
                    sourcePromise = [];
                    commonOption = {
                        homePos: mapReturnValue.homePos,
                        defZoom: mapReturnValue.defZoom,
                        zoomRestriction: mapReturnValue.zoomRestriction,
                        mercMinZoom: mapReturnValue.mercMinZoom,
                        mercMaxZoom: mapReturnValue.mercMaxZoom,
                        enableCache: this.enableCache,
                        translator: function (fragment) { return _this.translate(fragment); }
                    };
                    for (i = 0; i < dataSource.length; i++) {
                        option = dataSource[i];
                        sourcePromise.push((0, source_ex_1.mapSourceFactory)(option, commonOption));
                    }
                    return [2, Promise.all(sourcePromise)];
                });
            });
        };
        MaplatApp.prototype.handleSetting = function (setting, appOption) {
            var _this = this;
            this.appData = (0, functions_1.normalizeArg)(setting);
            if (!this.lang && this.appData.lang) {
                this.lang = this.appData.lang;
            }
            return this.i18nLoader().then(function (x) { return _this.handleI18n(x, appOption); });
        };
        MaplatApp.prototype.handleI18n = function (i18nObj, appOption) {
            var _this = this;
            this.i18n = i18nObj[1];
            this.t = i18nObj[0];
            var mapReturnValue = this.prepareMap(appOption);
            return (0, normalize_pois_1.normalizeLayers)(this.appData.pois || [], this).then(function (x) {
                return _this.handlePois(x, mapReturnValue);
            });
        };
        MaplatApp.prototype.prepareMap = function (appOption) {
            appOption = (0, functions_1.normalizeArg)(appOption);
            this.mercBuffer = null;
            var homePos = this.appData.homePosition;
            var defZoom = this.appData.defaultZoom;
            var zoomRestriction = this.appData.zoomRestriction;
            var mercMinZoom = this.appData.minZoom;
            var mercMaxZoom = this.appData.maxZoom;
            this.appName = this.appData.appName;
            var fakeGps = appOption.fake ? this.appData.fakeGps : false;
            var fakeRadius = appOption.fake ? this.appData.fakeRadius : false;
            this.appLang = this.appData.lang || "ja";
            this.noRotate = appOption.noRotate || this.appData.noRotate || false;
            this.poiTemplate =
                appOption.poiTemplate || this.appData.poiTemplate || false;
            this.poiStyle = appOption.poiStyle || this.appData.poiStyle || false;
            this.iconTemplate =
                appOption.iconTemplate || this.appData.iconTemplate || false;
            this.currentPosition = null;
            this.__init = true;
            this.dispatchEvent(new customevent_1.default("uiPrepare"));
            var frontDiv = "".concat(this.mapDiv, "_front");
            var newElem = (0, functions_1.createElement)("<div id=\"".concat(frontDiv, "\" class=\"map\" style=\"top:0; left:0; right:0; bottom:0; ") +
                "position:absolute;\"></div>")[0];
            this.mapDivDocument.insertBefore(newElem, this.mapDivDocument.firstChild);
            this.mapObject = new map_ex_1.MaplatMap({
                div: frontDiv,
                controls: this.appData.controls || [],
                interactions: this.noRotate
                    ? (0, interaction_1.defaults)({ altShiftDragRotate: false, pinchRotate: false })
                    : (0, interaction_1.defaults)().extend([
                        new interaction_1.DragRotateAndZoom({
                            condition: condition_1.altKeyOnly
                        })
                    ]),
                fakeGps: fakeGps,
                fakeRadius: fakeRadius,
                homePosition: homePos
            });
            var backDiv = null;
            if (this.overlay) {
                backDiv = "".concat(this.mapDiv, "_back");
                newElem = (0, functions_1.createElement)("<div id=\"".concat(backDiv, "\" class=\"map\" style=\"top:0; left:0; right:0; bottom:0; ") +
                    "position:absolute;\"></div>")[0];
                this.mapDivDocument.insertBefore(newElem, this.mapDivDocument.firstChild);
                this.backMap = new map_ex_1.MaplatMap({
                    off_control: true,
                    div: backDiv
                });
            }
            if (this.mapboxgl) {
                var mapboxgl = this.mapboxgl;
                delete this.mapboxgl;
                var mapboxDiv = "".concat(this.mapDiv, "_mapbox");
                newElem = (0, functions_1.createElement)("<div id=\"".concat(mapboxDiv, "\" class=\"map\" style=\"top:0; left:0; right:0; bottom:0; ") +
                    "position:absolute;visibility:hidden;\"></div>")[0];
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
                homePos: homePos,
                defZoom: defZoom,
                zoomRestriction: zoomRestriction,
                mercMinZoom: mercMinZoom,
                mercMaxZoom: mercMaxZoom
            };
        };
        MaplatApp.prototype.handlePois = function (pois, mapReturnValue) {
            var _this = this;
            this.pois = pois;
            return this.sourcesLoader(mapReturnValue).then(function (x) { return _this.handleSources(x); });
        };
        MaplatApp.prototype.handleSources = function (sources) {
            this.mercSrc = sources.reduce(function (prev, curr) {
                if (prev)
                    return prev;
                if (curr instanceof nowmap_1.NowMap && !(curr instanceof tmsmap_1.TmsMap))
                    return curr;
            }, null);
            var cache = [];
            this.cacheHash = {};
            for (var i = 0; i < sources.length; i++) {
                var source = sources[i];
                source._map = this.mapObject;
                if (source instanceof mapboxmap_1.MapboxMap) {
                    if (!this.mapboxMap) {
                        throw "To use mapbox gl based base map, you have to make Maplat object with specifying 'mapboxgl' option.";
                    }
                    source.mapboxMap = this.mapboxMap;
                }
                cache.push(source);
                this.cacheHash[source.mapID] = source;
            }
            this.dispatchEvent(new customevent_1.default("sourceLoaded", sources));
            this.setInitialMap(cache);
            this.setMapClick();
            this.setPointerEvents();
            this.setMapOnOff();
            this.setMouseCursor();
            this.setBackMapBehavior();
            this.raiseChangeViewpoint();
        };
        MaplatApp.prototype.setInitialMap = function (cache) {
            return __awaiter(this, void 0, void 0, function () {
                var initial;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            initial = this.initialRestore.mapID ||
                                this.startFrom ||
                                cache[cache.length - 1].mapID;
                            this.from = cache.reduce(function (prev, curr) {
                                if (prev) {
                                    return !(prev instanceof histmap_1.HistMap) && curr.mapID != initial
                                        ? curr
                                        : prev;
                                }
                                if (curr.mapID != initial)
                                    return curr;
                                return prev;
                            }, undefined);
                            return [4, this.changeMap(initial, this.initialRestore)];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            });
        };
        MaplatApp.prototype.setMapClick = function () {
            var _this = this;
            this.mapObject.on("click", function (evt) {
                _this.logger.debug(evt.pixel);
                _this.lastClickEvent = evt;
                var features = [];
                evt.target.forEachFeatureAtPixel(evt.pixel, function (feature) {
                    _this.logger.debug(evt.pixel);
                    if (feature.get("datum"))
                        features.push(feature.get("datum"));
                });
                if (features.length > 0) {
                    _this.dispatchEvent(new customevent_1.default("clickMarker", features[0]));
                    _this.dispatchEvent(new customevent_1.default("clickMarkers", features));
                }
                else {
                    var xy = evt.coordinate;
                    _this.dispatchEvent(new customevent_1.default("clickMapXy", xy));
                    _this.from
                        .sysCoord2MercAsync(xy)
                        .then(function (merc) {
                        _this.dispatchEvent(new customevent_1.default("clickMapMerc", merc));
                        var lnglat = (0, proj_1.transform)(merc, "EPSG:3857", "EPSG:4326");
                        _this.dispatchEvent(new customevent_1.default("clickMap", {
                            longitude: lnglat[0],
                            latitude: lnglat[1]
                        }));
                    });
                }
            });
        };
        MaplatApp.prototype.setPointerEvents = function () {
            var _this = this;
            var xyBuffer;
            var waiting = false;
            var dragging = false;
            var pointerCounter = {};
            var pointermoveHandler = function (xy) {
                _this.dispatchEvent(new customevent_1.default("pointerMoveOnMapXy", xy));
                _this.from
                    .sysCoord2MercAsync(xy)
                    .then(function (merc) {
                    _this.dispatchEvent(new customevent_1.default("pointerMoveOnMapMerc", merc));
                    if (xyBuffer) {
                        var next = xyBuffer;
                        xyBuffer = false;
                        pointermoveHandler(next);
                    }
                    else {
                        waiting = false;
                    }
                });
            };
            this.mapObject.on("pointermove", function (evt) {
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
            this.mapObject.on("pointerdown", function (evt) {
                if (evt.originalEvent && evt.originalEvent.pointerId != null) {
                    pointerCounter[evt.originalEvent.pointerId] = true;
                }
                dragging = true;
            });
            this.mapObject.on("pointerdrag", function (evt) {
                if (evt.originalEvent && evt.originalEvent.pointerId != null) {
                    pointerCounter[evt.originalEvent.pointerId] = true;
                }
                dragging = true;
            });
            this.mapObject.on("pointerup", function (evt) {
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
        };
        MaplatApp.prototype.setMapOnOff = function () {
            var _this = this;
            var timer;
            this.mapObject.on("click", function () {
                if (timer) {
                    clearTimeout(timer);
                    timer = undefined;
                }
                var ctls = _this.mapDivDocument.querySelectorAll(".ol-control");
                for (var i = 0; i < ctls.length; i++) {
                    ctls[i].classList.remove("fade");
                }
            });
            this.mapObject.on("pointerdrag", function () {
                if (timer) {
                    clearTimeout(timer);
                    timer = undefined;
                }
                var ctls = _this.mapDivDocument.querySelectorAll(".ol-control");
                for (var i = 0; i < ctls.length; i++) {
                    ctls[i].classList.add("fade");
                }
            });
            this.mapObject.on("moveend", function () {
                if (timer) {
                    clearTimeout(timer);
                    timer = undefined;
                }
                timer = setTimeout(function () {
                    timer = undefined;
                    var ctls = _this.mapDivDocument.querySelectorAll(".ol-control");
                    for (var i = 0; i < ctls.length; i++) {
                        ctls[i].classList.remove("fade");
                    }
                }, 3000);
            });
        };
        MaplatApp.prototype.setMouseCursor = function () {
            var _this = this;
            var moveHandler = function (evt) {
                var pixel = evt.target.getEventPixel(evt.originalEvent);
                var hit = evt.target.hasFeatureAtPixel(pixel);
                var target = evt.target.getTarget();
                if (hit) {
                    var feature = evt.target.forEachFeatureAtPixel(evt.pixel, function (feature) {
                        if (feature.get("datum"))
                            return feature;
                    });
                    _this.mapDivDocument.querySelector("#".concat(target)).style.cursor = feature ? "pointer" : "";
                    return;
                }
                _this.mapDivDocument.querySelector("#".concat(target)).style.cursor = "";
            };
            this.mapObject.on("pointermove", moveHandler);
            var mapOutHandler = function (evt) {
                var histCoord = evt.frameState.viewState.center;
                var source = _this.from;
                if (!source.insideCheckSysCoord(histCoord)) {
                    histCoord = source.modulateSysCoordInside(histCoord);
                    evt.target.getView().setCenter(histCoord);
                }
            };
            this.mapObject.on("moveend", mapOutHandler);
        };
        MaplatApp.prototype.setBackMapBehavior = function () {
            var _this = this;
            var backMapMove = function (_evt) {
                if (!_this.backMap)
                    return;
                if (_this.__backMapMoving) {
                    _this.logger.debug("Backmap moving skipped");
                    return;
                }
                var backSrc = _this.backMap.getSource();
                if (backSrc) {
                    _this.__backMapMoving = true;
                    _this.logger.debug("Backmap moving started");
                    _this.convertParametersFromCurrent(backSrc, function (size) {
                        var view = _this.backMap.getView();
                        view.setCenter(size[0]);
                        view.setZoom(size[1]);
                        view.setRotation(_this.noRotate ? 0 : size[2]);
                        _this.logger.debug("Backmap moving ended");
                        _this.__backMapMoving = false;
                    });
                }
            };
            this.mapObject.on("postrender", backMapMove);
        };
        MaplatApp.prototype.raiseChangeViewpoint = function () {
            var _this = this;
            this.mapObject.on("postrender", function (_evt) {
                var view = _this.mapObject.getView();
                var center = view.getCenter();
                var zoom = view.getDecimalZoom();
                var rotation = (0, functions_1.normalizeDegree)((view.getRotation() * 180) / Math.PI);
                _this.from
                    .viewpoint2MercsAsync()
                    .then(function (mercs) { return _this.mercSrc.mercs2ViewpointAsync(mercs); })
                    .then(function (viewpoint) {
                    if (_this.mobileMapMoveBuffer &&
                        _this.mobileMapMoveBuffer[0][0] == viewpoint[0][0] &&
                        _this.mobileMapMoveBuffer[0][1] == viewpoint[0][1] &&
                        _this.mobileMapMoveBuffer[1] == viewpoint[1] &&
                        _this.mobileMapMoveBuffer[2] == viewpoint[2]) {
                        return;
                    }
                    _this.mobileMapMoveBuffer = viewpoint;
                    var ll = (0, proj_1.transform)(viewpoint[0], "EPSG:3857", "EPSG:4326");
                    var direction = (0, functions_1.normalizeDegree)((viewpoint[2] * 180) / Math.PI);
                    _this.dispatchEvent(new customevent_1.default("changeViewpoint", {
                        x: center[0],
                        y: center[1],
                        longitude: ll[0],
                        latitude: ll[1],
                        mercator_x: viewpoint[0][0],
                        mercator_y: viewpoint[0][1],
                        zoom: zoom,
                        mercZoom: viewpoint[1],
                        direction: direction,
                        rotation: rotation
                    }));
                    _this.requestUpdateState({
                        position: {
                            x: center[0],
                            y: center[1],
                            zoom: zoom,
                            rotation: rotation
                        }
                    });
                });
            });
        };
        MaplatApp.prototype.currentMapInfo = function () {
            return (0, functions_1.createMapInfo)(this.from);
        };
        MaplatApp.prototype.mapInfo = function (mapID) {
            return (0, functions_1.createMapInfo)(this.cacheHash[mapID]);
        };
        MaplatApp.prototype.setMarker = function (data) {
            var _this = this;
            this.logger.debug(data);
            var lnglat = data.lnglat || [
                data.lng || data.longitude,
                data.lat || data.latitude
            ];
            var x = data.x;
            var y = data.y;
            var coords = data.coordinates;
            var src = this.from;
            var icon = data.icon
                ? this.__selectedMarker == data.namespaceID && data.selectedIcon
                    ? data.selectedIcon
                    : data.icon
                : this.__selectedMarker == data.namespaceID
                    ? defaultpin_selected_png_1.default
                    : defaultpin_png_1.default;
            var promise = coords
                ? (function () {
                    return src.merc2SysCoordAsync_ignoreBackground(coords);
                })()
                : x && y
                    ? new Promise(function (resolve) {
                        resolve(src.xy2SysCoord([x, y]));
                    })
                    : (function () {
                        var merc = (0, proj_1.transform)(lnglat, "EPSG:4326", "EPSG:3857");
                        return src.merc2SysCoordAsync_ignoreBackground(merc);
                    })();
            return promise.then(function (xy) {
                if (!xy)
                    return;
                if (src.insideCheckSysCoord(xy)) {
                    _this.mapObject.setMarker(xy, { datum: data }, icon);
                }
            });
        };
        MaplatApp.prototype.resetMarker = function () {
            this.mapObject.resetMarker();
        };
        MaplatApp.prototype.setLine = function (data) {
            data.type = "Line";
            if (!data.style && data.stroke) {
                data.style = {
                    stroke: data.stroke
                };
            }
            this.setVector(data);
        };
        MaplatApp.prototype.setVector = function (data) {
            var _this = this;
            this.logger.debug(data);
            var xyPromises;
            var merc2XyRecurse = function (coords, isLnglat) {
                if (isLnglat === void 0) { isLnglat = false; }
                return Promise.all(coords.map(function (coord) {
                    if (Array.isArray(coord[0])) {
                        return merc2XyRecurse(coord, isLnglat);
                    }
                    else {
                        if (isLnglat)
                            coord = (0, proj_1.transform)(coord, "EPSG:4326", "EPSG:3857");
                        return _this.from.merc2SysCoordAsync(coord);
                    }
                }));
            };
            if (data.coordinates) {
                xyPromises = merc2XyRecurse(data.coordinates);
            }
            else {
                xyPromises = merc2XyRecurse(data.lnglats, true);
            }
            xyPromises.then(function (xys) {
                _this.mapObject.setVector(xys, data.type, data.style);
            });
        };
        MaplatApp.prototype.resetLine = function () {
            this.resetVector();
        };
        MaplatApp.prototype.resetVector = function () {
            this.mapObject.resetVector();
        };
        MaplatApp.prototype.redrawMarkers = function (source) {
            var _this = this;
            if (source === void 0) { source = undefined; }
            if (!source) {
                source = this.from;
            }
            if (this.__redrawMarkerBlock) {
                if (!this.__redrawMarkerThrottle)
                    this.__redrawMarkerThrottle = [];
                var throttle = this.__redrawMarkerThrottle;
                if (throttle.length == 0 || throttle[throttle.length - 1] !== source) {
                    throttle.push(source);
                    return;
                }
            }
            this.__redrawMarkerBlock = true;
            var redrawLogic = function (source) {
                var promises = [];
                _this.resetMarker();
                var selected;
                if (!_this.stateBuffer.hideMarker) {
                    Object.keys(_this.pois).map(function (key) {
                        var cluster = _this.pois[key];
                        if (!cluster.hide) {
                            cluster.pois.map(function (data) {
                                var dataCopy = (0, template_works_1.createIconSet)(data, cluster, _this);
                                (0, template_works_1.createHtmlFromTemplate)(dataCopy, cluster, _this);
                                if (_this.__selectedMarker == dataCopy.namespaceID) {
                                    selected = dataCopy;
                                }
                                else {
                                    promises.push(_this.setMarker(dataCopy));
                                }
                            });
                        }
                    });
                    if (source.pois) {
                        Object.keys(source.pois).map(function (key) {
                            var cluster = source.pois[key];
                            if (!cluster.hide) {
                                cluster.pois.map(function (data) {
                                    var dataCopy = (0, template_works_1.createIconSet)(data, cluster, source, _this);
                                    (0, template_works_1.createHtmlFromTemplate)(dataCopy, cluster, source, _this);
                                    if (_this.__selectedMarker == dataCopy.namespaceID) {
                                        selected = dataCopy;
                                    }
                                    else {
                                        promises.push(_this.setMarker(dataCopy));
                                    }
                                });
                            }
                        });
                    }
                }
                var promise_var = Promise.all(promises);
                if (selected) {
                    promise_var = promise_var.then(function () { return _this.setMarker(selected); });
                }
                promise_var.then(function () {
                    if (_this.__redrawMarkerThrottle &&
                        _this.__redrawMarkerThrottle.length > 0) {
                        redrawLogic(_this.__redrawMarkerThrottle.shift());
                    }
                    else {
                        _this.__redrawMarkerBlock = false;
                    }
                });
            };
            redrawLogic(source);
        };
        MaplatApp.prototype.selectMarker = function (id) {
            var data = this.getMarker(id);
            if (!data)
                return;
            this.__selectedMarker = id;
            var latlng = {
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
        };
        MaplatApp.prototype.unselectMarker = function () {
            delete this.__selectedMarker;
            this.redrawMarkers();
        };
        MaplatApp.prototype.getMarker = function (id) {
            var _this = this;
            if (id.indexOf("#") < 0) {
                var ret_1 = undefined;
                Object.keys(this.pois).map(function (key) {
                    _this.pois[key].pois.map(function (poi, i) {
                        if (poi.id == id) {
                            ret_1 = _this.pois[key].pois[i];
                        }
                    });
                });
                return ret_1;
            }
            else {
                var splits = id.split("#");
                var source = this.cacheHash[splits[0]];
                if (source) {
                    return source.getPoi(splits[1]);
                }
            }
        };
        MaplatApp.prototype.updateMarker = function (id, data, overwrite) {
            var poi = this.getMarker(id);
            if (!poi)
                return;
            data = (0, normalize_pois_1.normalizePoi)(data || {});
            if (overwrite) {
                Object.keys(poi).map(function (key) {
                    if (key != "id" && key != "namespaceID") {
                        delete poi[key];
                    }
                });
                Object.assign(poi, data);
            }
            else {
                Object.keys(data).map(function (key) {
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
        };
        MaplatApp.prototype.addMarker = function (data, clusterId) {
            if (!clusterId) {
                clusterId = "main";
            }
            if (clusterId.indexOf("#") < 0) {
                if (this.pois[clusterId]) {
                    this.pois[clusterId]["pois"].push((0, normalize_pois_1.normalizePoi)(data));
                    (0, normalize_pois_1.addIdToPoi)(this.pois, clusterId, {
                        name: this.appName
                    });
                    this.dispatchPoiNumber();
                    this.redrawMarkers();
                    return data.namespaceID;
                }
            }
            else {
                var splits = clusterId.split("#");
                var source = this.cacheHash[splits[0]];
                if (source) {
                    var ret = source.addPoi(data, splits[1]);
                    this.dispatchPoiNumber();
                    this.redrawMarkers();
                    return ret;
                }
            }
        };
        MaplatApp.prototype.removeMarker = function (id) {
            var _this = this;
            if (id.indexOf("#") < 0) {
                Object.keys(this.pois).map(function (key) {
                    _this.pois[key].pois.map(function (poi, i) {
                        if (poi.id == id) {
                            delete _this.pois[key].pois[i];
                            _this.dispatchPoiNumber();
                            _this.redrawMarkers();
                        }
                    });
                });
            }
            else {
                var splits = id.split("#");
                var source = this.cacheHash[splits[0]];
                if (source) {
                    source.removePoi(splits[1]);
                    this.dispatchPoiNumber();
                    this.redrawMarkers();
                }
            }
        };
        MaplatApp.prototype.clearMarker = function (clusterId) {
            var _this = this;
            if (!clusterId) {
                clusterId = "main";
            }
            if (clusterId.indexOf("#") < 0) {
                if (clusterId == "all") {
                    Object.keys(this.pois).map(function (key) {
                        _this.pois[key]["pois"] = [];
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
                var splits = clusterId.split("#");
                var source = this.cacheHash[splits[0]];
                if (source) {
                    source.clearPoi(splits[1]);
                    this.dispatchPoiNumber();
                    this.redrawMarkers();
                }
            }
        };
        MaplatApp.prototype.showAllMarkers = function () {
            this.requestUpdateState({ hideMarker: 0 });
            this.redrawMarkers();
        };
        MaplatApp.prototype.hideAllMarkers = function () {
            this.requestUpdateState({ hideMarker: 1 });
            this.redrawMarkers();
        };
        MaplatApp.prototype.dispatchPoiNumber = function () {
            this.dispatchEvent(new customevent_1.default("poi_number", this.listPoiLayers(false, true).reduce(function (prev, curr) { return prev + curr.pois.length; }, 0)));
        };
        MaplatApp.prototype.listPoiLayers = function (hideOnly, nonzero) {
            var _this = this;
            if (hideOnly === void 0) { hideOnly = false; }
            if (nonzero === void 0) { nonzero = false; }
            var appPois = Object.keys(this.pois)
                .sort(function (a, b) {
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
                .map(function (key) { return _this.pois[key]; })
                .filter(function (layer) {
                return nonzero
                    ? hideOnly
                        ? layer.pois.length && layer.hide
                        : layer.pois.length
                    : hideOnly
                        ? layer.hide
                        : true;
            });
            var mapPois = this.from.listPoiLayers(hideOnly, nonzero);
            return appPois.concat(mapPois);
        };
        MaplatApp.prototype.showPoiLayer = function (id) {
            var layer = this.getPoiLayer(id);
            if (layer) {
                delete layer.hide;
                this.requestUpdateState({
                    hideLayer: this.listPoiLayers(true)
                        .map(function (layer) { return layer.namespaceID; })
                        .join(",")
                });
                this.redrawMarkers();
            }
        };
        MaplatApp.prototype.hidePoiLayer = function (id) {
            var layer = this.getPoiLayer(id);
            if (layer) {
                layer.hide = true;
                this.requestUpdateState({
                    hideLayer: this.listPoiLayers(true)
                        .map(function (layer) { return layer.namespaceID; })
                        .join(",")
                });
                this.redrawMarkers();
            }
        };
        MaplatApp.prototype.getPoiLayer = function (id) {
            if (id.indexOf("#") < 0) {
                return this.pois[id];
            }
            else {
                var splits = id.split("#");
                var source = this.cacheHash[splits[0]];
                if (source) {
                    return source.getPoiLayer(splits[1]);
                }
            }
        };
        MaplatApp.prototype.addPoiLayer = function (id, data) {
            if (id == "main")
                return;
            if (this.pois[id])
                return;
            if (id.indexOf("#") < 0) {
                this.pois[id] = (0, normalize_pois_1.normalizeLayer)(data || [], id, {
                    name: this.appName
                });
                this.redrawMarkers();
            }
            else {
                var splits = id.split("#");
                var source = this.cacheHash[splits[0]];
                if (source) {
                    source.addPoiLayer(splits[1], data);
                    this.redrawMarkers();
                }
            }
        };
        MaplatApp.prototype.removePoiLayer = function (id) {
            if (id == "main")
                return;
            if (!this.pois[id])
                return;
            if (id.indexOf("#") < 0) {
                delete this.pois[id];
                this.requestUpdateState({
                    hideLayer: this.listPoiLayers(true)
                        .map(function (layer) { return layer.namespaceID; })
                        .join(",")
                });
                this.dispatchPoiNumber();
                this.redrawMarkers();
            }
            else {
                var splits = id.split("#");
                var source = this.cacheHash[splits[0]];
                if (source) {
                    source.removePoiLayer(splits[1]);
                    this.requestUpdateState({
                        hideLayer: this.listPoiLayers(true)
                            .map(function (layer) { return layer.namespaceID; })
                            .join(",")
                    });
                    this.dispatchPoiNumber();
                    this.redrawMarkers();
                }
            }
        };
        MaplatApp.prototype.addLine = function (data) {
            this.vectors.push(data);
            this.setLine(data);
        };
        MaplatApp.prototype.addVector = function (data) {
            this.vectors.push(data);
            this.setVector(data);
        };
        MaplatApp.prototype.clearLine = function () {
            this.vectors = [];
            this.resetLine();
        };
        MaplatApp.prototype.clearVector = function () {
            this.vectors = [];
            this.resetVector();
        };
        MaplatApp.prototype.setGPSMarker = function (position) {
            this.currentPosition = position;
            this.from.setGPSMarker(position, true);
        };
        MaplatApp.prototype.changeMap = function (mapID, restore) {
            var _this = this;
            if (restore === undefined)
                restore = {};
            var now = this.mercSrc;
            var to = this.cacheHash[mapID];
            if (!this.changeMapSeq) {
                this.changeMapSeq = Promise.resolve();
            }
            return (this.changeMapSeq = this.changeMapSeq.then(function () {
                return new Promise(function (resolve, _reject) {
                    _this.convertParametersFromCurrent(to, function (size) {
                        var backSrc = null;
                        var backTo = null;
                        var backRestore = restore.backgroundID
                            ? _this.cacheHash[restore.backgroundID]
                            : undefined;
                        if (_this.backMap) {
                            backSrc = _this.backMap.getSource();
                            if (!(to instanceof nowmap_1.NowMap)) {
                                if (backRestore) {
                                    backTo = backRestore;
                                    _this.backMap.exchangeSource(backTo);
                                }
                                else {
                                    if (!backSrc) {
                                        backTo = now;
                                        if (_this.from instanceof nowmap_1.NowMap) {
                                            backTo =
                                                _this.from instanceof tmsmap_1.TmsMap
                                                    ? _this.mapObject.getSource()
                                                    :
                                                        _this.from;
                                        }
                                        _this.backMap.exchangeSource(backTo);
                                    }
                                    else {
                                        backTo = backSrc;
                                    }
                                }
                                _this.requestUpdateState({ backgroundID: backTo.mapID });
                            }
                            else {
                                _this.backMap.exchangeSource();
                            }
                        }
                        if (to instanceof tmsmap_1.TmsMap) {
                            _this.mapObject.setLayer(to);
                            if (backRestore) {
                                _this.mapObject.exchangeSource(backRestore);
                            }
                            else if (!(_this.from instanceof nowmap_1.NowMap)) {
                                var backToLocal = backSrc || now;
                                _this.mapObject.exchangeSource(backToLocal);
                            }
                            _this.requestUpdateState({
                                backgroundID: _this.mapObject.getSource().mapID
                            });
                        }
                        else {
                            _this.mapObject.setLayer();
                            _this.mapObject.exchangeSource(to);
                        }
                        var updateState = {
                            mapID: to.mapID
                        };
                        if (to instanceof nowmap_1.NowMap && !(to instanceof tmsmap_1.TmsMap)) {
                            updateState.backgroundID = "____delete____";
                        }
                        _this.requestUpdateState(updateState);
                        _this.from = to;
                        _this.dispatchPoiNumber();
                        var view = _this.mapObject.getView();
                        if (_this.appData.zoomRestriction) {
                            view.setMaxZoom(to.maxZoom);
                            view.setMinZoom(to.minZoom || 0);
                        }
                        if (to.insideCheckSysCoord(size[0])) {
                            view.setCenter(size[0]);
                            view.setZoom(size[1]);
                            view.setRotation(_this.noRotate ? 0 : size[2]);
                        }
                        else if (!_this.__init) {
                            _this.dispatchEvent(new customevent_1.default("outOfMap", {}));
                            to.goHome();
                        }
                        to.setGPSMarker(_this.currentPosition, true);
                        if (restore.hideLayer) {
                            var layers = restore.hideLayer.split(",");
                            layers.map(function (key) {
                                var layer = _this.getPoiLayer(key);
                                if (layer) {
                                    layer.hide = true;
                                }
                            });
                            _this.requestUpdateState({ hideLayer: restore.hideLayer });
                        }
                        if (restore.hideMarker) {
                            _this.hideAllMarkers();
                        }
                        else {
                            _this.redrawMarkers();
                        }
                        _this.resetVector();
                        for (var i = 0; i < _this.vectors.length; i++) {
                            (function (data) {
                                _this.setVector(data);
                            })(_this.vectors[i]);
                        }
                        _this.dispatchEvent(new customevent_1.default("mapChanged", _this.getMapMeta(to.mapID)));
                        _this.mapObject.updateSize();
                        _this.mapObject.renderSync();
                        if (restore.position) {
                            _this.__init = false;
                            to.setViewpoint(restore.position);
                        }
                        if (restore.transparency) {
                            _this.setTransparency(restore.transparency);
                        }
                        if (_this.__init) {
                            _this.__init = false;
                            to.goHome();
                        }
                        else if (_this.backMap && backTo) {
                            _this.convertParametersFromCurrent(backTo, function (size) {
                                var view = _this.backMap.getView();
                                view.setCenter(size[0]);
                                view.setZoom(size[1]);
                                view.setRotation(_this.noRotate ? 0 : size[2]);
                                _this.backMap.updateSize();
                                _this.backMap.renderSync();
                            });
                        }
                        resolve(undefined);
                    });
                });
            }));
        };
        MaplatApp.prototype.requestUpdateState = function (data) {
            var _this = this;
            this.stateBuffer = Object.assign(this.stateBuffer, data);
            if (this.stateBuffer.backgroundID == "____delete____") {
                delete this.stateBuffer.backgroundID;
            }
            if (this.restoreSession) {
                var currentTime = Math.floor(new Date().getTime() / 1000);
                localStorage.setItem("epoch", "".concat(currentTime));
                var loopSession_1 = function (data) {
                    Object.keys(data).map(function (key) {
                        if (key == "position") {
                            loopSession_1(data[key]);
                        }
                        else if (key == "backgroundID" && data[key] == "____delete____") {
                            localStorage.removeItem(key);
                        }
                        else {
                            localStorage.setItem(key, data[key]);
                        }
                    });
                };
                loopSession_1(data);
            }
            if (this.timer)
                clearTimeout(this.timer);
            this.timer = setTimeout(function () {
                _this.timer = undefined;
                _this.dispatchEvent(new customevent_1.default("updateState", _this.stateBuffer));
            }, 50);
        };
        MaplatApp.prototype.setTransparency = function (percentage) {
            this.__transparency = percentage;
            this.mapObject.setTransparency(percentage);
            this.requestUpdateState({ transparency: percentage });
        };
        MaplatApp.prototype.getTransparency = function () {
            return this.__transparency == null ? 0 : this.__transparency;
        };
        MaplatApp.prototype.setViewpoint = function (cond) {
            this.from.setViewpoint(cond);
        };
        MaplatApp.prototype.getMapMeta = function (mapID) {
            var source;
            if (!mapID) {
                source = this.from;
            }
            else {
                source = this.cacheHash[mapID];
            }
            if (!source)
                return;
            return mixin_1.META_KEYS.reduce(function (prev, curr) {
                prev[curr] = source[curr];
                return prev;
            }, {
                mapID: source.mapID,
                label: source.label
            });
        };
        MaplatApp.prototype.getMapCacheEnable = function (mapID) {
            var source;
            if (!mapID) {
                source = this.from;
            }
            else {
                source = this.cacheHash[mapID];
            }
            if (!source)
                return false;
            return source.getCacheEnable();
        };
        MaplatApp.prototype.getMapTileCacheStatsAsync = function (mapID) {
            return __awaiter(this, void 0, void 0, function () {
                var source;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!mapID) {
                                source = this.from;
                            }
                            else {
                                source = this.cacheHash[mapID];
                            }
                            if (!source)
                                return [2, {}];
                            return [4, source.getTileCacheStatsAsync()];
                        case 1: return [2, _a.sent()];
                    }
                });
            });
        };
        MaplatApp.prototype.getMapTileCacheSizeAsync = function (mapID) {
            return __awaiter(this, void 0, void 0, function () {
                var stats;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.getMapTileCacheStatsAsync(mapID)];
                        case 1:
                            stats = _a.sent();
                            return [2, stats.size || 0];
                    }
                });
            });
        };
        MaplatApp.prototype.clearMapTileCacheAsync = function (mapID) {
            return __awaiter(this, void 0, void 0, function () {
                var source;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!mapID) {
                                source = this.from;
                            }
                            else {
                                source = this.cacheHash[mapID];
                            }
                            if (!source)
                                return [2];
                            return [4, source.clearTileCacheAsync()];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            });
        };
        MaplatApp.prototype.fetchAllMapTileCacheAsync = function (mapID, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var source;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!mapID) {
                                source = this.from;
                            }
                            else {
                                source = this.cacheHash[mapID];
                            }
                            if (!source) {
                                callback("stop", {});
                                return [2];
                            }
                            return [4, source.fetchAllTileCacheAsync(callback)];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            });
        };
        MaplatApp.prototype.cancelMapTileCacheAsync = function (mapID) {
            return __awaiter(this, void 0, void 0, function () {
                var source;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!mapID) {
                                source = this.from;
                            }
                            else {
                                source = this.cacheHash[mapID];
                            }
                            if (!source)
                                return [2];
                            return [4, source.cancelTileCacheAsync()];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            });
        };
        MaplatApp.prototype.convertParametersFromCurrent = function (to, callback) {
            var _this = this;
            var view = this.mapObject.getView();
            var fromPromise = this.from.viewpoint2MercsAsync();
            var current = (0, math_ex_1.recursiveRound)([view.getCenter(), view.getZoom(), view.getRotation()], 10);
            if (this.mercBuffer &&
                this.mercBuffer.mercs &&
                this.mercBuffer.buffer[this.from.mapID]) {
                var buffer = this.mercBuffer.buffer[this.from.mapID];
                if (buffer[0][0] == current[0][0] &&
                    buffer[0][1] == current[0][1] &&
                    buffer[1] == current[1] &&
                    buffer[2] == current[2]) {
                    this.logger.debug(buffer);
                    this.logger.debug(current);
                    this.logger.debug("From: Use buffer");
                    fromPromise = new Promise(function (res, _rej) {
                        res(_this.mercBuffer.mercs);
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
            this.logger.debug("From: Center: ".concat(current[0], " Zoom: ").concat(current[1], " Rotation: ").concat(current[2]));
            this.logger.debug("From: ".concat(this.from.mapID));
            fromPromise
                .then(function (mercs) {
                _this.mercBuffer.mercs = mercs;
                _this.logger.debug("Mercs: ".concat(mercs));
                var toPromise = to.mercs2ViewpointAsync(mercs);
                var key = to.mapID;
                if (_this.mercBuffer.buffer[key]) {
                    _this.logger.debug("To: Use buffer");
                    toPromise = new Promise(function (res, _rej) {
                        res(_this.mercBuffer.buffer[key]);
                    });
                }
                toPromise
                    .then(function (size) {
                    _this.logger.debug("To: Center: ".concat(size[0], " Zoom: ").concat(size[1], " Rotation: ").concat(size[2]));
                    _this.logger.debug("To: ".concat(to.mapID));
                    _this.mercBuffer.buffer[to.mapID] = (0, math_ex_1.recursiveRound)(size, 10);
                    callback(size);
                })
                    .catch(function (err) {
                    throw err;
                });
            })
                .catch(function (err) {
                throw err;
            });
        };
        MaplatApp.prototype.translate = function (dataFragment) {
            var _this = this;
            if (!dataFragment || typeof dataFragment === "string")
                return dataFragment;
            var langs = Object.keys(dataFragment);
            var key = langs.reduce(function (prev, curr, idx, arr) {
                if (curr == _this.appLang) {
                    prev = [dataFragment[curr], true];
                }
                else if (!prev || (curr == "en" && !prev[1])) {
                    prev = [dataFragment[curr], false];
                }
                if (idx == arr.length - 1)
                    return prev[0];
                return prev;
            }, undefined);
            key = typeof key === "string" ? key : "".concat(key);
            if (this.i18n.exists(key, {
                ns: "translation",
                nsSeparator: "__X__yX__X__"
            }))
                return this.t(key, {
                    ns: "translation",
                    nsSeparator: "__X__yX__X__"
                });
            for (var i = 0; i < langs.length; i++) {
                var lang = langs[i];
                this.i18n.addResource(lang, "translation", key, dataFragment[lang]);
            }
            return this.t(key, {
                ns: "translation",
                nsSeparator: "__X__yX__X__"
            });
        };
        MaplatApp.prototype.remove = function () {
            if (this.mapboxMap) {
                this.mapboxMap.remove();
            }
            this.mapDivDocument.innerHTML = "";
            this.mapDivDocument.classList.remove("maplat");
        };
        return MaplatApp;
    }(Target_1.default));
    exports.MaplatApp = MaplatApp;
});
//# sourceMappingURL=index.js.map