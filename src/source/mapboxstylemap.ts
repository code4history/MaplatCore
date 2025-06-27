import VectorTileSource from "ol/source/VectorTile";
import MVT from "ol/format/MVT";
import { applyStyle } from "ol-mapbox-style";
import { MapOptions } from "../map_ex";
import { setCustomFunctionBase } from "./mixin";

/**
 * MapboxStyleMap - OpenLayers map with Mapbox style support
 * Extends VectorTileSource with MaplatCore's mixin functionality
 */
export class MapboxStyleMap extends setCustomFunctionBase(VectorTileSource) {
  style?: string;
  accessToken?: string;
  private styleApplied = false;
  private stylePromise?: Promise<void>;
  private targetLayer?: any;
  private styleJson?: any;
  
  constructor(option?: MapOptions) {
    const style = option?.style || option?.url;
    const accessToken = option?.accessToken;
    
    // Initialize VectorTileSource without URL first
    // The actual URL will be set after fetching the style
    super({
      format: new MVT(),
      maxZoom: option?.maxZoom || 22,
      minZoom: option?.minZoom || 0
    });
    
    console.log('MapboxStyleMap constructor called with option:', option);
    this.style = style;
    this.accessToken = accessToken;
    
    // Initialize MaplatCore properties
    if (option?.mapID) {
      this.mapID = option.mapID;
    }
    this.initialize(option || {});
    
    console.log('MapboxStyleMap created with style:', this.style, 'accessToken:', this.accessToken);
  }

  static title = "MapboxStyle";
  static isBasemap_ = true;
  static isWmts_ = true; // This is a WMTS-compatible source
  
  // Override to prevent tile load function setup
  getTileLoadFunction() {
    return null;
  }
  
  // Override setMap to apply style when added to map
  setMap(map: any) {
    console.log('MapboxStyleMap.setMap called');
    super.setMap(map);
    this._map = map;
    
    // Don't apply style here - wait for setTargetLayer to be called
  }
  
  // Method to set the target layer and apply style
  setTargetLayer(layer: any) {
    console.log('MapboxStyleMap.setTargetLayer called');
    this.targetLayer = layer;
    
    if (!this.stylePromise && this._map && this.style && layer) {
      this.stylePromise = this.applyMapboxStyleAsync();
    }
  }
  
  // Method to check if style is ready
  async waitForStyle(): Promise<void> {
    if (this.stylePromise) {
      await this.stylePromise;
    }
  }
  
  private async applyMapboxStyleAsync(): Promise<void> {
    if (this.styleApplied || !this.targetLayer) return;
    
    console.log('Applying Mapbox style to layer');
    
    if (this.targetLayer) {
      try {
        console.log('Found target layer, applying style');
        console.log('Style URL:', this.style);
        console.log('Access token:', this.accessToken);
        
        // Fetch the style JSON first
        const styleUrl = this.style.replace('mapbox://styles/', 'https://api.mapbox.com/styles/v1/') + `?access_token=${this.accessToken}`;
        console.log('Fetching style from:', styleUrl);
        
        const response = await fetch(styleUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch style: ${response.status} ${response.statusText}`);
        }
        
        const styleJson = await response.json();
        console.log('Style JSON fetched successfully');
        
        // Find the first vector source in the style
        if (styleJson.sources) {
          for (const [sourceName, sourceConfig] of Object.entries(styleJson.sources)) {
            if ((sourceConfig as any).type === 'vector' && (sourceConfig as any).url) {
              // Extract the tile URL from the source
              const tilesetUrl = (sourceConfig as any).url;
              if (tilesetUrl.startsWith('mapbox://')) {
                const tilesetId = tilesetUrl.replace('mapbox://', '');
                const tileUrl = `https://api.mapbox.com/v4/${tilesetId}/{z}/{x}/{y}.mvt?access_token=${this.accessToken}`;
                console.log('Setting tile URL:', tileUrl);
                this.setUrl(tileUrl);
                break;
              }
            }
          }
        }
        
        // Store the style JSON for later use
        this.styleJson = styleJson;
        
        // Apply basic rendering first to see if tiles are loading
        console.log('Setting up basic vector tile rendering');
        
        // Import style classes
        const { Style, Fill, Stroke, Circle } = await import('ol/style');
        
        // Set a basic style function that can render the tiles
        this.targetLayer.setStyle((feature: any, resolution: any) => {
          const geomType = feature.getGeometry()?.getType();
          
          // Different styles for different geometry types
          if (geomType === 'Point' || geomType === 'MultiPoint') {
            // Style for POIs
            return new Style({
              image: new Circle({
                radius: 5,
                fill: new Fill({
                  color: 'rgba(0, 153, 255, 0.6)'
                }),
                stroke: new Stroke({
                  color: '#0099ff',
                  width: 1
                })
              })
            });
          } else if (geomType === 'LineString' || geomType === 'MultiLineString') {
            // Style for roads, etc.
            return new Style({
              stroke: new Stroke({
                color: '#0099ff',
                width: 1
              })
            });
          } else if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
            // Style for buildings, areas, etc.
            return new Style({
              fill: new Fill({
                color: 'rgba(250, 250, 250, 0.8)'
              }),
              stroke: new Stroke({
                color: '#0099ff',
                width: 1
              })
            });
          }
          
          // Default style
          return new Style({
            fill: new Fill({
              color: 'rgba(250, 250, 250, 0.8)'
            }),
            stroke: new Stroke({
              color: '#666',
              width: 1
            })
          });
        });
        
        this.styleApplied = true;
        console.log('Basic vector tile style applied');
        
        // TODO: Apply full Mapbox style later
        console.log('Full Mapbox style application is pending implementation');
      } catch (error) {
        console.error('Failed to apply Mapbox style:', error);
      }
    } else {
      console.warn('No target layer set for Mapbox style');
    }
  }

  // Override to handle Mapbox style
  insideCheckSysCoord(_coord: any): boolean {
    // Mapbox styles typically cover the whole world
    return true;
  }

  // Override isMapbox to return false since this is not using Mapbox GL
  static isMapbox() {
    return false;
  }

  isMapbox() {
    return false;
  }
}