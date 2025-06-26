/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Feature, Map } from "ol";
import { View } from "./view_ex";
import { Group, Tile, Vector as layerVector, VectorTile } from "ol/layer";
import { Vector as sourceVector } from "ol/source";
import { Circle, LineString, Point, Polygon } from "ol/geom";
import { Fill, Icon, Stroke, Style } from "ol/style";
import { MapboxStyleMap } from "./source/mapboxstylemap";
import { GoogleMap } from "./source/googlemap";
import { NowMap } from "./source/nowmap";
import { normalizeArg } from "./functions";

export interface MapOptions {
  mapID?: string;
  style?: string;
  url?: string;
  urls?: string[];
  accessToken?: string;
  maxZoom?: number;
  minZoom?: number;
  homePosition?: any;
  mercZoom?: number;
  label?: string;
  poiTemplate?: string;
  poiStyle?: string;
  iconTemplate?: string;
  icon?: string;
  selectedIcon?: string;
  mercatorXShift?: number;
  mercatorYShift?: number;
  weiwudi?: any;
  envelopeLngLats?: any;
  width?: number;
  height?: number;
  imageExtension?: string;
  tms?: boolean;
  pois?: any;
  thumbnail?: string;
}

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
    // Special handling for MapboxStyleMap - create VectorTile layer
    if (source instanceof MapboxStyleMap) {
      if (!(layer instanceof VectorTile)) {
        layer = new VectorTile({
          source,
          declutter: true
        });
        layer.set("name", "base");
      } else {
        layer.setSource(source);
      }
      // Set the target layer so MapboxStyleMap can apply style
      source.setTargetLayer(layer);
      return layer;
    }
    
    if (!(layer instanceof Tile)) {
      layer = new Tile({
        source
      });
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
  async exchangeSource(source: any = undefined) {
    const layers = this.getLayers();
    const prevLayer = layers.item(0);
    const prevSource = prevLayer ? prevLayer.getSource() : null;
    
    // Skip if the source is the same
    if (source && prevSource === source) {
      return;
    }
    
    // Hide previous source if it has a hide method
    if (prevSource && typeof prevSource.hide === 'function') {
      prevSource.hide();
    }
    
    const layer = MaplatMap.spawnLayer(prevLayer, source, this.getTarget());
    if (layer != prevLayer) layers.setAt(0, layer);
    if (source) {
      source.setMap(this);
      
      // Wait for MapboxStyleMap to apply style
      if (source instanceof MapboxStyleMap && source.waitForStyle) {
        await source.waitForStyle();
      }
      
      // Show new source if it has a show method
      if (typeof source.show === 'function') {
        source.show();
      }
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
}
