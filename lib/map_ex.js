import { Feature, Geolocation, Map, MapEvent } from "ol";
import { View } from "./view_ex";
import { Group, Tile, Vector as layerVector } from "ol/layer";
import { Vector as sourceVector } from "ol/source";
import { Circle, LineString, Point, Polygon } from "ol/geom";
import { Fill, Icon, Stroke, Style } from "ol/style";
import { MapboxMap } from "./source/mapboxmap";
import { NowMap } from "./source/nowmap";
import { getDistance, randomFromCenter } from "./math_ex";
import { MapboxLayer } from "./layer_mapbox";
import { normalizeArg } from "./functions";
import bluedot from "../parts/bluedot.png";
import bluedot_transparent from "../parts/bluedot_transparent.png";
import bluedot_small from "../parts/bluedot_small.png";
import defaultpin from "../parts/defaultpin.png";
import IconAnchorUnits from "ol/style/IconAnchorUnits";
const gpsStyle = new Style({
    image: new Icon({
        anchor: [0.5, 0.5],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.FRACTION,
        src: bluedot
    })
});
const gpsHideStyle = new Style({
    image: new Icon({
        anchor: [0.5, 0.5],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.FRACTION,
        src: bluedot_transparent
    })
});
const gpsSubStyle = new Style({
    image: new Icon({
        anchor: [0.5, 0.5],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.FRACTION,
        src: bluedot_small
    })
});
const accCircleStyle = new Style({
    fill: new Fill({
        color: [128, 128, 256, 0.2]
    }),
    stroke: new Stroke({
        color: [128, 128, 256, 1.0],
        width: 3
    })
});
const markerDefaultStyle = new Style({
    image: new Icon({
        anchor: [0.5, 1.0],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.FRACTION,
        src: defaultpin
    })
});
export class MaplatMap extends Map {
    constructor(optOptions) {
        optOptions = normalizeArg(optOptions || {});
        const vectorLayer = new layerVector({
            source: new sourceVector({
                wrapX: false
            })
        });
        vectorLayer.set("name", "gps");
        const markerLayer = new layerVector({
            source: new sourceVector({
                wrapX: false
            })
        });
        markerLayer.set("name", "marker");
        const featureLayer = new layerVector({
            source: new sourceVector({
                wrapX: false
            })
        });
        featureLayer.set("name", "feature");
        const envelopeLayer = new layerVector({
            source: new sourceVector({
                wrapX: false
            })
        });
        envelopeLayer.set("name", "envelope");
        const baseLayer = MaplatMap.spawnLayer(null, optOptions.source, optOptions.target);
        const overlayLayer = new Group();
        overlayLayer.set("name", "overlay");
        const controls = optOptions.controls ? optOptions.controls : [];
        const options = {
            controls,
            layers: [
                baseLayer,
                overlayLayer,
                envelopeLayer,
                featureLayer,
                vectorLayer,
                markerLayer
            ],
            target: optOptions.div,
            view: new View({
                center: optOptions.defaultCenter || [0, 0],
                zoom: optOptions.defaultZoom || 2,
                rotation: optOptions.defaultRotation || 0,
                multiWorld: true
            })
        };
        if (optOptions.interactions) {
            options.interactions = optOptions.interactions;
        }
        super(options);
        this._overlay_group = overlayLayer;
        this.fakeGps = optOptions.fakeGps;
        this.fakeRadius = optOptions.fakeRadius;
        this.homePosition = optOptions.homePosition;
        const view = this.getView();
        this.__AvoidFirstMoveStart = true;
        const movestart = () => {
            if (!this.__AvoidFirstMoveStart)
                this.dispatchEvent("movestart");
            this.__AvoidFirstMoveStart = false;
            view.un("propertychange", movestart);
        };
        view.on("propertychange", movestart);
        this.on("moveend", () => {
            view.on("propertychange", movestart);
        });
    }
    static spawnLayer(layer, source, container) {
        if (source instanceof MapboxMap || !(layer instanceof Tile)) {
            if (source instanceof MapboxMap) {
                layer = new MapboxLayer({
                    style: source.style,
                    accessToken: source.accessToken,
                    container,
                    source
                });
            }
            else {
                layer = new Tile({
                    source
                });
            }
            layer.set("name", "base");
        }
        else {
            layer.setSource(source);
        }
        return layer;
    }
    getLayer(name = "base") {
        const recur = (layers) => {
            const filtered = layers
                .getArray()
                .map((layer) => {
                if (layer.get("name") == name)
                    return layer;
                if (layer.getLayers)
                    return recur(layer.getLayers());
                return;
            })
                .filter((layer) => layer);
            if (filtered.length == 0)
                return;
            return filtered[0];
        };
        return recur(this.getLayers());
    }
    getSource(name = "base") {
        const layer = this.getLayer(name);
        if (!layer)
            return;
        return layer.getSource();
    }
    setFeature(data, style, layer) {
        const src = this.getSource(layer);
        const feature = new Feature(data);
        if (style) {
            feature.setStyle(style);
        }
        src.addFeature(feature);
        return feature;
    }
    removeFeature(feature, layer) {
        const src = this.getSource(layer);
        src.removeFeature(feature);
    }
    resetFeature(layer) {
        const src = this.getSource(layer);
        src.clear();
    }
    setGPSPosition(pos, type = undefined) {
        const style = type == "sub" ? gpsSubStyle : type == "hide" ? gpsHideStyle : gpsStyle;
        if (type != "sub") {
            this.resetFeature("gps");
        }
        if (pos) {
            this.setFeature({
                geometry: new Point(pos.xy)
            }, style, "gps");
            if (!type) {
                this.setFeature({
                    geometry: new Circle(pos.xy, pos.rad)
                }, accCircleStyle, "gps");
            }
        }
    }
    setMarker(xy, data, markerStyle, layer) {
        if (!layer)
            layer = "marker";
        data["geometry"] = new Point(xy);
        if (!markerStyle)
            markerStyle = markerDefaultStyle;
        else if (typeof markerStyle == "string") {
            markerStyle = new Style({
                image: new Icon({
                    anchor: [0.5, 1.0],
                    anchorXUnits: IconAnchorUnits.FRACTION,
                    anchorYUnits: IconAnchorUnits.FRACTION,
                    src: markerStyle
                })
            });
        }
        else if (!(markerStyle instanceof Style)) {
            markerStyle = new Style({
                image: new Icon(markerStyle)
            });
        }
        return this.setFeature(data, markerStyle, layer);
    }
    resetMarker(layer) {
        if (!layer)
            layer = "marker";
        this.resetFeature(layer);
    }
    setLine(xys, stroke, layer) {
        return this.setVector(xys, "Line", stroke ? { stroke } : null, layer);
    }
    setVector(coords, type = "Line", style, layer) {
        if (!layer)
            layer = "feature";
        const option = {};
        if (style.stroke != null)
            option.stroke = new Stroke(style.stroke);
        if (style.fill != null)
            option.fill = new Fill(style.fill);
        const styleObj = new Style(option);
        const geometry = type === "Line" ? new LineString(coords) : new Polygon(coords);
        return this.setFeature({
            geometry,
            name: type
        }, styleObj, layer);
    }
    resetLine(layer) {
        this.resetVector(layer);
    }
    resetVector(layer) {
        if (!layer)
            layer = "feature";
        this.resetFeature(layer);
    }
    setEnvelope(xys, stroke, layer) {
        if (!layer)
            layer = "envelope";
        return this.setLine(xys, stroke, layer);
    }
    removeEnvelope(feature, layer) {
        if (!layer)
            layer = "envelope";
        this.removeFeature(feature, layer);
    }
    resetEnvelope(layer) {
        if (!layer)
            layer = "envelope";
        this.resetFeature(layer);
    }
    setFillEnvelope(xys, stroke, fill, layer) {
        if (!layer)
            layer = "envelope";
        let style = null;
        if (stroke != null || fill != null) {
            const option = {};
            if (stroke != null)
                option.stroke = new Stroke(stroke);
            if (fill != null)
                option.fill = new Fill(fill);
            style = new Style(option);
        }
        return this.setFeature({
            geometry: new Polygon([xys])
        }, style, layer);
    }
    exchangeSource(source = undefined) {
        const layers = this.getLayers();
        const prevLayer = layers.item(0);
        const layer = MaplatMap.spawnLayer(prevLayer, source, this.getTarget());
        if (layer != prevLayer)
            layers.setAt(0, layer);
        if (source) {
            source._map = this;
        }
    }
    setLayer(source = undefined) {
        const layers = this.getLayer("overlay").getLayers();
        layers.clear();
        if (source) {
            const layer = new Tile({
                source
            });
            layers.push(layer);
        }
    }
    setTransparency(percentage) {
        const opacity = (100 - percentage) / 100;
        const source = this.getSource();
        if (source instanceof NowMap) {
            this.getLayers().item(0).setOpacity(1);
            this.getLayers().item(1).setOpacity(opacity);
        }
        else {
            this.getLayers().item(0).setOpacity(opacity);
        }
    }
    setGPSMarker(position, ignoreMove) {
        const source = this.getLayers().item(0).getSource();
        source.setGPSMarker(position, ignoreMove);
    }
    handleGPS(launch, avoidEventForOff) {
        if (launch) {
            this.dispatchEvent("gps_request");
            this._first_gps_request = true;
            if (!this.geolocation) {
                const geolocation = (this.geolocation = new Geolocation({
                    tracking: true
                }));
                geolocation.on("change", _evt => {
                    const overlayLayer = this.getLayer("overlay").getLayers().item(0);
                    const source = overlayLayer
                        ? overlayLayer.getSource()
                        : this.getLayers().item(0).getSource();
                    let lnglat = geolocation.getPosition();
                    let acc = geolocation.getAccuracy();
                    if (this.fakeGps &&
                        getDistance(this.homePosition, lnglat) >
                            this.fakeGps) {
                        lnglat = [
                            randomFromCenter(this.homePosition[0], 0.001),
                            randomFromCenter(this.homePosition[1], 0.001)
                        ];
                        acc = randomFromCenter(15.0, 10);
                    }
                    let gpsVal = { lnglat, acc };
                    source
                        .setGPSMarkerAsync(gpsVal, !this._first_gps_request)
                        .then((result) => {
                        if (!result) {
                            gpsVal = { error: "gps_out" };
                        }
                        this._first_gps_request = false;
                        this.dispatchEvent(new MapEvent("gps_result", this, gpsVal));
                    });
                });
                geolocation.on("error", _evt => {
                    const source = this.getLayers().item(0).getSource();
                    let gpsVal = null;
                    if (this.fakeGps) {
                        const lnglat = [
                            randomFromCenter(this.homePosition[0], 0.001),
                            randomFromCenter(this.homePosition[1], 0.001)
                        ];
                        const acc = randomFromCenter(15.0, 10);
                        gpsVal = { lnglat, acc };
                    }
                    source
                        .setGPSMarkerAsync(gpsVal, !this._first_gps_request)
                        .then((result) => {
                        if (!result) {
                            gpsVal = { error: "gps_out" };
                        }
                        this._first_gps_request = false;
                        this.dispatchEvent(new MapEvent("gps_result", this, gpsVal));
                    });
                });
            }
            else {
                this.geolocation.setTracking(true);
            }
        }
        else {
            if (this.geolocation)
                this.geolocation.setTracking(false);
            const source = this.getLayers().item(0).getSource();
            source.setGPSMarker();
            if (!avoidEventForOff)
                this.dispatchEvent(new MapEvent("gps_result", this, { error: "gps_off" }));
        }
    }
}
//# sourceMappingURL=map_ex.js.map