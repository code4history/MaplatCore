/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Feature, Geolocation, Map } from "ol";
import { View } from "./view_ex";
import { Layer, Group, Tile, Vector as layerVector } from "ol/layer";
import { Vector as sourceVector } from "ol/source";
import { Circle, LineString, Point, Polygon } from "ol/geom";
import { Fill, Icon, Stroke, Style } from "ol/style";
import { MapboxMap } from "./source/mapboxmap";
import { GoogleMap } from "./source/googlemap";
import { NowMap } from "./source/nowmap";
import { randomFromCenter } from "./math_ex";
import { MapboxLayer } from "./layer_mapbox";
import { normalizeArg } from "./functions";
import { MaplatSource } from "./source_ex";
import { Coordinate } from "ol/coordinate";
import CustomEvent from "./customevent";

// @ts-ignore
import bluedot from "../parts/bluedot.png";                         // @ts-ignore
import bluedot_transparent from "../parts/bluedot_transparent.png"; // @ts-ignore
import bluedot_small from "../parts/bluedot_small.png";             // @ts-ignore
import defaultpin from "../parts/defaultpin.png";

const gpsStyle = new Style({
  image: new Icon({
    anchor: [0.5, 0.5],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    src: bluedot
  })
});
const gpsHideStyle = new Style({
  image: new Icon({
    anchor: [0.5, 0.5],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    src: bluedot_transparent
  })
});
const gpsSubStyle = new Style({
  image: new Icon({
    anchor: [0.5, 0.5],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
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
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    src: defaultpin
  })
});

export class MaplatMap extends Map {
  fakeGps: any;
  fakeRadius: any;
  geolocation: any;
  homePosition: any;
  northUp: boolean;
  tapDuration: number;
  homeMarginPixels: number;
  tapUIVanish: boolean;
  alwaysGpsOn: boolean;
  private __timer_id?: number;
  private __first_gps_request = true;
  private __ignore_first_move: boolean;

  constructor(optOptions: any) {
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
    const baseLayer = MaplatMap.spawnLayer(
      null,
      optOptions.source,
      optOptions.target
    );
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
      (options as any).interactions = optOptions.interactions;
    }
    super(options);
    this.fakeGps = optOptions.fakeGps;
    this.fakeRadius = optOptions.fakeRadius;
    this.homePosition = optOptions.homePosition;
    this.northUp = optOptions.northUp;
    this.tapDuration = optOptions.tapDuration;
    this.homeMarginPixels = optOptions.homeMarginPixels;
    this.tapUIVanish = optOptions.tapUIVanish;
    this.alwaysGpsOn = optOptions.alwaysGpsOn || false;
    const view = this.getView();
    this.__ignore_first_move = true;
    const movestart = () => {
      if (!this.__ignore_first_move) this.dispatchEvent("movestart");
      this.__ignore_first_move = false;
      view.un("propertychange", movestart);
    };
    view.on("propertychange", movestart);
    this.on("moveend", () => {
      view.on("propertychange", movestart);
    });
  }
  static spawnLayer(layer: any, source: any, container: any) {
    if (source instanceof MapboxMap || !(layer instanceof Tile)) {
      if (source instanceof MapboxMap) {
        layer = new MapboxLayer({
          style: source.style,
          accessToken: source.accessToken,
          container,
          source
        });
      } else {
        layer = new Tile({
          source
        });
      }
      layer.set("name", "base");
    } else {
      layer.setSource(source);
    }
    return layer;
  }
  getLayer(name = "base") {
    const recur = (layers: any) => {
      const filtered = layers
        .getArray()
        .map((layer: any) => {
          if (layer.get("name") == name) return layer;
          if (layer.getLayers) return recur(layer.getLayers());
          return;
        })
        .filter((layer: any) => layer);
      if (filtered.length == 0) return;
      return filtered[0];
    };
    return recur(this.getLayers());
  }
  getSource(name = "base") {
    const layer = this.getLayer(name);
    if (!layer) return;
    return layer.getSource();
  }
  setFeature(data: any, style: any, layer: any) {
    const src = this.getSource(layer);
    const feature = new Feature(data);
    if (style) {
      feature.setStyle(style);
    }
    src.addFeature(feature);
    return feature;
  }
  removeFeature(feature: any, layer: any) {
    const src = this.getSource(layer);
    src.removeFeature(feature);
  }
  resetFeature(layer: any) {
    const src = this.getSource(layer);
    src.clear();
  }
  setGPSPosition(pos: any, type: any = undefined) {
    const style =
      type == "sub" ? gpsSubStyle : type == "hide" ? gpsHideStyle : gpsStyle;
    if (type != "sub") {
      this.resetFeature("gps");
    }
    if (pos) {
      this.setFeature(
        {
          geometry: new Point(pos.xy)
        },
        style,
        "gps"
      );
      if (!type) {
        this.setFeature(
          {
            geometry: new Circle(pos.xy, pos.rad)
          },
          accCircleStyle,
          "gps"
        );
      }
    }
  }
  setMarker(xy: any, data: any, markerStyle: any, layer: any) {
    if (!layer) layer = "marker";
    data["geometry"] = new Point(xy);
    if (!markerStyle) markerStyle = markerDefaultStyle;
    else if (typeof markerStyle == "string") {
      markerStyle = new Style({
        image: new Icon({
          anchor: [0.5, 1.0],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: markerStyle
        })
      });
    } else if (!(markerStyle instanceof Style)) {
      markerStyle = new Style({
        image: new Icon(markerStyle)
      });
    }
    return this.setFeature(data, markerStyle, layer);
  }
  resetMarker(layer: any) {
    if (!layer) layer = "marker";
    this.resetFeature(layer);
  }
  setLine(xys: any, stroke: any, layer: any) {
    // Ready for Polygon
    return this.setVector(xys, "Line", stroke ? { stroke } : null, layer);
  }
  setVector(coords: any, type = "Line", style: any, layer: any) {
    // Ready for Polygon
    if (!layer) layer = "feature";
    const option = {};
    if (style.stroke != null) (option as any).stroke = new Stroke(style.stroke);
    if (style.fill != null) (option as any).fill = new Fill(style.fill);
    const styleObj = new Style(option);
    const geometry =
      type === "Line" ? new LineString(coords) : new Polygon(coords);
    return this.setFeature(
      {
        geometry,
        name: type
      },
      styleObj,
      layer
    );
  }
  resetLine(layer: any) {
    // Ready for Polygon
    this.resetVector(layer);
  }
  resetVector(layer: any) {
    // Ready for Polygon
    if (!layer) layer = "feature";
    this.resetFeature(layer);
  }
  setEnvelope(xys: any, stroke: any, layer: any) {
    if (!layer) layer = "envelope";
    return this.setLine(xys, stroke, layer);
  }
  removeEnvelope(feature: any, layer: any) {
    if (!layer) layer = "envelope";
    this.removeFeature(feature, layer);
  }
  resetEnvelope(layer: any) {
    if (!layer) layer = "envelope";
    this.resetFeature(layer);
  }
  setFillEnvelope(xys: any, stroke: any, fill: any, layer: any) {
    if (!layer) layer = "envelope";
    let style: (Style | undefined);
    if (stroke != null || fill != null) {
      const option = {};
      if (stroke != null) (option as any).stroke = new Stroke(stroke);
      if (fill != null) (option as any).fill = new Fill(fill);
      style = new Style(option);
    }
    return this.setFeature(
      {
        geometry: new Polygon([xys])
      },
      style,
      layer
    );
  }
  exchangeSource(source: any = undefined) {
    const layers = this.getLayers();
    const prevLayer = layers.item(0);
    const layer = MaplatMap.spawnLayer(prevLayer, source, this.getTarget());
    if (layer != prevLayer) layers.setAt(0, layer);
    if (source) {
      source.setMap(this);
    }
  }
  setLayer(source: any = undefined) {
    const layers = this.getLayer("overlay").getLayers();
    layers.clear();
    if (source) {
      const layer = new Tile({
        source
      });
      layers.push(layer);
    }
  }
  setTransparency(percentage: any) {
    const opacity = (100 - percentage) / 100;
    const source = this.getSource();
    if (source instanceof NowMap || source instanceof GoogleMap) {
      this.getLayers().item(0).setOpacity(1);
      this.getLayers().item(1).setOpacity(opacity);
    } else {
      this.getLayers().item(0).setOpacity(opacity);
    }
  }
  setGPSMarker(position: any, ignoreMove: any) {
    // alert("ol.MaplatMap.prototype.setGPSMarker");
    const source = (this.getLayers().item(0) as any).getSource();
    source.setGPSMarker(position, ignoreMove);
  }
  /*handleGPS(launch: any, avoidEventForOff: any) {
    //const map = this;
    if (launch) {
      this.dispatchEvent("gps_request");
      this._first_gps_request = true;
      if (!this.geolocation) {
        const geolocation = (this.geolocation = new Geolocation({
          tracking: true
        }));
        // listen to changes in position
        geolocation.on("change", _evt => {
          const overlayLayer = this.getLayer("overlay").getLayers().item(0);
          const source = overlayLayer
            ? overlayLayer.getSource()
            : (this.getLayers().item(0) as any).getSource();
          let lnglat = geolocation.getPosition();
          let acc = geolocation.getAccuracy();
          if (
            this.fakeGps &&
            getDistance(this.homePosition, lnglat as [number, number]) >
              this.fakeGps
          ) {
            lnglat = [
              randomFromCenter(this.homePosition[0], 0.001),
              randomFromCenter(this.homePosition[1], 0.001)
            ];
            acc = randomFromCenter(15.0, 10);
          }
          let gpsVal: any = { lnglat, acc };
          source
            .setGPSMarkerAsync(gpsVal, !this._first_gps_request)
            .then((result: any) => {
              if (!result) {
                gpsVal = { error: "gps_out" };
              }
              this._first_gps_request = false;
              this.dispatchEvent(new MapEvent("gps_result", this, gpsVal));
            });
        });
        geolocation.on("error", _evt => {
          const source = (this.getLayers().item(0) as any).getSource();
          let gpsVal: any = null;
          if (this.fakeGps) {
            const lnglat = [
              randomFromCenter(this.homePosition[0], 0.001),
              randomFromCenter(this.homePosition[1], 0.001)
            ];
            const acc = randomFromCenter(15.0, 10);
            gpsVal = { lnglat, acc };
          }
          (source as NowMap | HistMap | GoogleMap)
            .setGPSMarkerAsync(gpsVal, !this._first_gps_request)
            .then((result: any) => {
              if (!result) {
                gpsVal = { error: "gps_out" };
              }
              this._first_gps_request = false;
              this.dispatchEvent(new MapEvent("gps_result", this, gpsVal));
            });
        });
      } else {
        this.geolocation.setTracking(true);
      }
    } else {
      if (this.geolocation) this.geolocation.setTracking(false);
      const source = (this.getLayers().item(0) as any).getSource();
      source.setGPSMarker();
      if (!avoidEventForOff)
        this.dispatchEvent(
          new MapEvent("gps_result", this, { error: "gps_off" } as any)
        );
    }
  }*/
  handleGPS(launch: any, avoidEventForOff = false) { 
    console.log(`GPS trigger${launch}`);
    // launch: true = GPS on, false = GPS off
    // avoidEventForOff: true = No event for GPS off, false = Event for GPS off
    if (launch) {
      this.dispatchEvent(new CustomEvent("gps_request", {}));
      this.__first_gps_request = !this.alwaysGpsOn;
      if (this.fakeGps) {
        this.__timer_id = setInterval(evt => {
          console.log(`GPS Change ${evt}`);
          this.handleGPSResults("change", evt);
        }, 10000);
        this.handleGPSResults("change");
      } else {
        if (!this.geolocation) {
          const geolocation = (this.geolocation = new Geolocation({
            tracking: true
          }));
          // listen to changes in position
          geolocation.on("change", evt => {
            console.log(`GPS Change ${evt}`);
            console.log(evt);
            this.handleGPSResults("change", evt);
          });
          geolocation.on("error", evt => {
            console.log(`GPS Error ${evt}`);
            console.log(evt);
            this.handleGPSResults("error", evt);
          });
        } else {
          this.geolocation.setTracking(true);
        }
      }
    } else {
      if (this.geolocation) this.geolocation.setTracking(false);
      else if (this.__timer_id) {
        clearInterval(this.__timer_id);
        this.__timer_id = undefined;
      }
      const source = (this.getLayers().item(0) as Layer).getSource() as MaplatSource;
      source.setGPSMarker(null);
      if (!avoidEventForOff)
        this.dispatchEvent(
          new CustomEvent("gps_result", { error: "gps_off" })
        );
    }
  }
  
  handleGPSResults(type: "change" | "error", event?: any) {
    const overlayLayer = this.getLayer("overlay").getLayers().item(0) as Layer;
    const firstLayer = this.getLayers().item(0) as Layer;
    const source = (overlayLayer ? overlayLayer.getSource() : firstLayer.getSource()) as MaplatSource;
    let gpsVal: {
      lnglat?: Coordinate;
      acc?: number;
      error?: any;
      code?: number;
      message?: string;
    } | null = null;
    if (!this.geolocation) {
      console.log("1");
      const lnglat: Coordinate = [
        randomFromCenter(this.homePosition![0], 0.05),
        randomFromCenter(this.homePosition![1], 0.05)
      ];
      const acc = randomFromCenter(15.0, 10);
      gpsVal = { lnglat, acc };
    } else if (type == "change") {
      console.log("2");
      const lnglat = this.geolocation!.getPosition()!;
      const acc = this.geolocation!.getAccuracy()!;
      gpsVal = { lnglat, acc };
    } else {
      gpsVal = { error: "gps_error", code: event.code, message: event.message };
      source.setGPSMarker(false);
      this.dispatchEvent(new CustomEvent("gps_result", gpsVal));
      if (!this.alwaysGpsOn) this.handleGPS(false);
      return;
    }
    source.setGPSMarkerAsync(gpsVal, !this.__first_gps_request)
      .then((result: any) => {
        console.log("Out event dispatch");
        console.log(result);
        if (!result) {
          gpsVal!.error = "gps_out";
          //if (!this.alwaysGpsOn) this.handleGPS(false);
        }
        this.__first_gps_request = false;
        this.dispatchEvent(new CustomEvent("gps_result", gpsVal));
      });
  }
}
