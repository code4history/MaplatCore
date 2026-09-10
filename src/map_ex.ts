/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Feature, Map } from "ol";
import { View } from "./view_ex";
import { Group, Tile, Vector as layerVector } from "ol/layer";
import { Vector as sourceVector } from "ol/source";
import { Circle, LineString, Point, Polygon } from "ol/geom";
import { Fill, Icon, Stroke, Style } from "ol/style";
import { MapboxMap } from "./source/mapboxmap";
import { MapLibreMap } from "./source/maplibremap";
import { GoogleMap } from "./source/googlemap";
import { NowMap } from "./source/nowmap";
import { MapboxLayer } from "./layer_mapbox";
import { MapLibreLayer } from "./layer_maplibre";
import { normalizeArg } from "./functions";
import { unByKey } from "ol/Observable";
import {
  create as createTransform,
  multiply as multiplyTransform,
  setFromArray as copyTransform
} from "ol/transform";

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
  private __ignore_first_move: boolean;
  // oct26-m2-t3 (#94): ソース切替中に旧フレームを保持しているリスナーのキー（解除用）
  private __frameHoldKeys: any[] | undefined;

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
    
    // Debug zoom changes
    view.on('change:resolution', () => {
      const source = this.getSource();
      if (source && (source instanceof MapboxMap || source instanceof MapLibreMap)) {
        // console.log('View zoom change:', {
        //   baseMapType: source.constructor.name,
        //   viewZoom: view.getZoom(),
        //   resolution: view.getResolution()
        // });
      }
    });
  }
  // WMTS-like tile sources start their tile grid at source.minZoom. Rendering
  // them at view zooms far below that makes OpenLayers enumerate the whole
  // viewport in z=minZoom tiles (4^minZoom times the viewport), freezing the
  // renderer — and no tiles exist below minZoom anyway. Gate the layer at
  // minZoom - 4: within 4 levels the minZoom tiles are upscaled to fill the
  // view (enumeration stays within 256x the viewport), below that the layer is
  // simply hidden. The gate must be reset when the same layer is reused for a
  // source without such a grid (e.g. Maplat maps), hence the else branch.
  static applyWmtsZoomGate(layer: any, source: any) {
    const minZoom =
      source && typeof source.isWmts === "function" && source.isWmts()
        ? source.minZoom
        : undefined;
    if (typeof minZoom === "number" && Number.isFinite(minZoom) && minZoom > 4) {
      layer.setMinZoom(minZoom - 4);
    } else {
      layer.setMinZoom(-Infinity);
    }
  }
  static spawnLayer(layer: any, source: any, container: any) {
    if (source instanceof MapboxMap || source instanceof MapLibreMap || !(layer instanceof Tile)) {
      if (source instanceof MapboxMap) {
        layer = new MapboxLayer({
          style: source.style,
          accessToken: source.accessToken,
          container,
          source
        });
      } else if (source instanceof MapLibreMap) {
        layer = new MapLibreLayer({
          style: source.style,
          container,
          source
        });
      } else {
        layer = new Tile({
          source
        });
        MaplatMap.applyWmtsZoomGate(layer, source);
      }
      layer.set("name", "base");
    } else {
      layer.setSource(source);
      MaplatMap.applyWmtsZoomGate(layer, source);
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
    // oct26-m2-t3 (#94): 切替直前に表示中の描画内容を複製しておく（setSource 前に取る）
    const heldFrame = source ? MaplatMap.captureRenderedFrame(prevLayer) : undefined;
    const layer = MaplatMap.spawnLayer(prevLayer, source, this.getTarget());
    if (layer != prevLayer) layers.setAt(0, layer);
    this.holdRenderedFrame(layer === prevLayer ? heldFrame : undefined, layer);
    if (source) {
      source.setMap(this);
    }
  }
  // oct26-m2-t3 (#94): 前面地図のちらつき対策。
  // Tile レイヤの setSource は旧ソースのタイルを描画対象から即座に外すため、新ソースのタイルが
  // 届くまでの間 canvas が完全透明で再描画される（overlay 時は背面地図もクリア済みで、ページ背景が
  // 露出して「前面地図が一瞬消える」）。そこで切替直前に表示していた canvas の画素を複製し、
  // 新ソースのタイルより先に（prerender で）同じ画面位置へ敷く。新ソースのタイルは上に重なって
  // 描かれる。地図の rendercomplete（全タイルの読込・フェード完了）で解除して再描画する。
  // 対象は同じ Tile レイヤを使い回す経路（spawnLayer の setSource）に限る。Mapbox/MapLibre への
  // 差し替え（layers.setAt）は描画先が WebGL canvas で 2D の prerender に敷けないため対象外。
  static captureRenderedFrame(layer: any) {
    // 表示中の内容が無い（ソース未設定・未描画・DOM から外れている・寸法 0）なら複製しない
    if (!(layer instanceof Tile) || !layer.getSource() || !layer.hasRenderer()) return;
    const renderer: any = layer.getRenderer();
    const canvas = renderer && renderer.context ? renderer.context.canvas : undefined;
    if (
      !canvas ||
      !canvas.isConnected ||
      !canvas.width ||
      !canvas.height ||
      !renderer.pixelTransform
    ) {
      return;
    }
    const image = document.createElement("canvas");
    image.width = canvas.width;
    image.height = canvas.height;
    const context = image.getContext("2d");
    if (!context) return;
    context.drawImage(canvas, 0, 0);
    return {
      image,
      // 複製時点の「canvas 画素 → CSS 画素」変換（敷くときに同じ画面位置へ戻すために使う）
      pixelTransform: copyTransform(createTransform(), renderer.pixelTransform)
    };
  }
  private holdRenderedFrame(frame: any, layer: any) {
    // 直前の保持は、次の切替（ソースのクリアを含む）で必ず解除する
    if (this.__frameHoldKeys) {
      unByKey(this.__frameHoldKeys);
      this.__frameHoldKeys = undefined;
    }
    if (!frame) return;
    // 切替前に描画済みのフレームの rendercomplete で解除しないよう、切替後に 1 フレーム
    // 描画されたこと（地図の postrender）を確かめてから解除する
    let renderedAfterSwitch = false;
    const keys: any[] = [];
    const release = () => {
      unByKey(keys);
      if (this.__frameHoldKeys === keys) this.__frameHoldKeys = undefined;
      this.render();
    };
    keys.push(
      layer.on("prerender", (evt: any) => {
        const context = evt.context;
        if (!context || !evt.inversePixelTransform) return;
        // 複製時の canvas 画素 → CSS 画素 → 現在の canvas 画素
        const transform = multiplyTransform(
          copyTransform(createTransform(), evt.inversePixelTransform),
          frame.pixelTransform
        );
        context.save();
        context.setTransform(
          transform[0],
          transform[1],
          transform[2],
          transform[3],
          transform[4],
          transform[5]
        );
        context.drawImage(frame.image, 0, 0);
        context.restore();
      }),
      this.once("postrender", () => {
        renderedAfterSwitch = true;
      }),
      this.on("rendercomplete", () => {
        if (renderedAfterSwitch) release();
      })
    );
    this.__frameHoldKeys = keys;
  }
  setLayer(source: any = undefined) {
    const layers = this.getLayer("overlay").getLayers();
    layers.clear();
    if (source) {
      // console.log('Creating TMS overlay layer:', {
      //   sourceType: source.constructor.name,
      //   mapID: source.mapID,
      //   maxZoom: source.maxZoom,
      //   minZoom: source.minZoom,
      //   tileGrid: source.getTileGrid()
      // });
      const layer = new Tile({
        source
      });
      MaplatMap.applyWmtsZoomGate(layer, source);
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
