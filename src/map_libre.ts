import maplibregl from 'maplibre-gl';
(window as any).maplibregl = maplibregl;
import { Feature } from 'geojson';
import { normalizeArg } from './functions';

// Import marker images
import bluedot from "../parts/bluedot.png";
import bluedot_transparent from "../parts/bluedot_transparent.png";
import bluedot_small from "../parts/bluedot_small.png";
import defaultpin from "../parts/defaultpin.png";

export class MaplatMapLibre extends maplibregl.Map {
  _first_gps_request: any;
  _overlay_group: any;
  fakeGps: any;
  fakeRadius: any;
  geolocation: any;
  homePosition: any;
  __AvoidFirstMoveStart: boolean;
  northUp: boolean;
  tapDuration: number;
  homeMarginPixels: number;
  tapUIVanish: boolean;
  layers: Map<string, any>;
  sources: Map<string, any>;
  markers: Map<string, maplibregl.Marker>;
  
  constructor(optOptions: any) {
    optOptions = normalizeArg(optOptions || {});
    
    // Convert OpenLayers options to MapLibre options
    const mapOptions: maplibregl.MapOptions = {
      container: optOptions.div || 'map_div',
      style: {
        version: 8,
        sources: {},
        layers: []
      },
      center: optOptions.defaultCenter || [0, 0],
      zoom: optOptions.defaultZoom || 2,
      bearing: -(optOptions.defaultRotation || 0) * 180 / Math.PI, // Convert from radians to degrees
      interactive: true
    };

    // Initialize MapLibre map
    super(mapOptions);
    
    // Initialize layer and source tracking
    this.layers = new Map();
    this.sources = new Map();
    this.markers = new Map();
    
    // Copy options
    this.fakeGps = optOptions.fakeGps;
    this.fakeRadius = optOptions.fakeRadius;
    this.homePosition = optOptions.homePosition;
    this.northUp = optOptions.northUp;
    this.tapDuration = optOptions.tapDuration;
    this.homeMarginPixels = optOptions.homeMarginPixels;
    this.tapUIVanish = optOptions.tapUIVanish;
    
    // Set up event handling
    this.__AvoidFirstMoveStart = true;
    
    // Add default layers once the map is loaded
    this.on('load', () => {
      // Add image resources for markers
      this.loadImage(bluedot, (error, image) => {
        if (!error && image) this.addImage('bluedot', image);
      });
      this.loadImage(bluedot_transparent, (error, image) => {
        if (!error && image) this.addImage('bluedot_transparent', image);
      });
      this.loadImage(bluedot_small, (error, image) => {
        if (!error && image) this.addImage('bluedot_small', image);
      });
      this.loadImage(defaultpin, (error, image) => {
        if (!error && image) this.addImage('defaultpin', image);
      });
      
      // Initialize default sources and layers
      this.addSource('gps', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });
      this.sources.set('gps', 'gps');
      
      this.addSource('marker', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });
      this.sources.set('marker', 'marker');
      
      this.addSource('feature', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });
      this.sources.set('feature', 'feature');
      
      this.addSource('envelope', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });
      this.sources.set('envelope', 'envelope');
      
      // Add corresponding layers
      this.addLayer({
        id: 'gps-layer',
        type: 'symbol',
        source: 'gps',
        layout: {
          'icon-image': 'bluedot',
          'icon-size': 1
        }
      });
      this.layers.set('gps', 'gps-layer');
      
      this.addLayer({
        id: 'marker-layer',
        type: 'symbol',
        source: 'marker',
        layout: {
          'icon-image': 'defaultpin',
          'icon-size': 1,
          'icon-anchor': 'bottom'
        }
      });
      this.layers.set('marker', 'marker-layer');
    });
    
    // Handle move events
    const handleMove = () => {
      if (!this.__AvoidFirstMoveStart) {
        this.fire('movestart', {});
      }
      this.__AvoidFirstMoveStart = false;
      this.off('move', handleMove);
    };
    
    this.on('move', handleMove);
    this.on('moveend', () => {
      this.on('move', handleMove);
    });
  }
  
  static spawnLayer(layer: any, source: any, container: any) {
    // This will be implemented when we handle different source types
    return layer;
  }
  
  getLayer(name = 'base') {
    return this.layers.get(name);
  }
  
  getSource(name = 'base'): any {
    const sourceId = this.sources.get(name);
    if (!sourceId) return null;
    return super.getSource(sourceId);
  }
  
  setFeature(data: any, style: any, layer: any) {
    const sourceId = this.sources.get(layer);
    if (!sourceId) return;
    
    const source = this.getSource(sourceId) as maplibregl.GeoJSONSource;
    if (!source) return;
    
    // Get current features
    const currentData = source._data as any;
    const features = currentData.features || [];
    
    // Create new feature
    const feature: Feature = {
      type: 'Feature',
      geometry: data.geometry || data,
      properties: data.properties || {}
    };
    
    // Add feature to collection
    features.push(feature);
    
    // Update source
    source.setData({
      type: 'FeatureCollection',
      features
    });
    
    return feature;
  }
  
  getView() {
    // Return a view-like object that mimics OpenLayers View API
    return {
      getCenter: () => {
        const center = this.getCenter();
        return [center.lng, center.lat];
      },
      setCenter: (center: [number, number]) => {
        this.setCenter(center);
      },
      getZoom: () => this.getZoom(),
      setZoom: (zoom: number) => this.setZoom(zoom),
      getRotation: () => -this.getBearing() * Math.PI / 180,
      setRotation: (rotation: number) => this.setBearing(-rotation * 180 / Math.PI),
      on: (event: string, handler: (...args: any[]) => void) => {
        if (event === 'propertychange') {
          this.on('move', handler as any);
        }
      },
      un: (event: string, handler: (...args: any[]) => void) => {
        if (event === 'propertychange') {
          this.off('move', handler as any);
        }
      }
    };
  }
  
  getViewport() {
    return this.getContainer();
  }
  
  updateSize() {
    this.resize();
  }
}