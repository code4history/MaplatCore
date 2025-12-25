import type { Feature, FeatureCollection, Point } from "geojson";

/**
 * JSON POI object with various coordinate formats
 */
export interface JSONPoi {
  id?: string | number;
  // Coordinate formats
  lnglat?: [number, number];
  lng?: number;
  lat?: number;
  longitude?: number;
  latitude?: number;
  // Other properties
  name?: string;
  description?: string;
  [key: string]: any; // Allow additional custom properties
}

/**
 * JSON Layer - can be an array of POIs or a FeatureCollection
 */
export type JSONLayer = JSONPoi[] | FeatureCollection<Point>;

/**
 * Internal POI Layer structure (always GeoJSON FeatureCollection)
 */
export interface POILayer extends FeatureCollection<Point> {
  id: string;
  name?: string;
  namespaceID?: string;
  __nextId?: number;
  [key: string]: any; // Allow additional layer metadata
}

/**
 * Options for POI normalization
 */
export interface NormalizeOptions {
  name?: string;
  namespace?: string;
}

/**
 * Layers collection - maps layer ID to POI layer
 */
export type LayersCollection = Record<string, POILayer>;

// Async initializer 6: Load pois setting
export async function nodesLoader(
  nodes: string | Record<string, unknown>
): Promise<Record<string, unknown>> {
  if (typeof nodes === "string") {
    return new Promise((resolve, reject) => {
      const url = nodes.match(/\//) ? nodes : `pois/${nodes}`;

      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "json";

      xhr.onload = function (_e) {
        if (this.status == 200 || this.status == 0) {
          // 0 for UIWebView
          try {
            let resp: string | Record<string, unknown> = this.response;
            if (typeof resp === "string") resp = JSON.parse(resp);
            resolve(resp as Record<string, unknown>);
          } catch (err) {
            reject(err);
          }
        } else {
          reject("Fail to load poi json");
        }
      };
      xhr.send();
    });
  } else {
    return nodes;
  }
}

/**
 * Normalizes coordinates from various JSON formats to GeoJSON coordinate array
 * Supports: lnglat, lng/lat, longitude/latitude
 */
function normalizeCoordinates(poi: JSONPoi): [number, number] {
  if (poi.lnglat && Array.isArray(poi.lnglat)) {
    return poi.lnglat as [number, number];
  }
  if (poi.lng !== undefined && poi.lat !== undefined) {
    return [poi.lng, poi.lat];
  }
  if (poi.longitude !== undefined && poi.latitude !== undefined) {
    return [poi.longitude, poi.latitude];
  }
  throw new Error("POI missing coordinates");
}

//pois: Process layers
export async function normalizeLayers(
  layers: any,
  options: NormalizeOptions
): Promise<LayersCollection> {
  // Resolve url cases
  layers = await nodesLoader(layers);

  //In case "layers" is array
  if (Array.isArray(layers)) {
    layers = await Promise.all(layers.map(async x => await nodesLoader(x)));
    //In case of array of FeatureCollection (GeoJSON input - preserve)
    if (layers.length > 0 && layers[0].type === "FeatureCollection") {
      layers = layers.reduce((prev: any, layer: any, index: any) => {
        let key = layer.id || (layer.properties && layer.properties.id);
        if (!key) {
          if (index === 0) key = "main";
          else throw "POI layers include bad key setting";
        }
        prev[key] = normalizeLayer(layer, key, options);
        return prev;
      }, {});
      //In case old type single layer spec (JSON array input - convert to GeoJSON)
    } else {
      layers = {
        main: normalizeLayer(layers, "main", options)
      };
    }
    // In case of single FeatureCollection (GeoJSON input - preserve)
  } else if (layers.type === "FeatureCollection") {
    const key =
      layers.id || (layers.properties && layers.properties.id) || "main";
    layers = { [key]: normalizeLayer(layers, key, options) };
    // In case current non-geojson layers spec (Object with layer keys)
  } else {
    Object.keys(layers).map(key => {
      layers[key] = normalizeLayer(layers[key], key, options);
    });
  }

  // Add main layer if not exists
  if (!layers["main"]) {
    layers["main"] = normalizeLayer([], "main", options);
  }
  Object.keys(layers).map(key => {
    addIdToFeature(layers, key, options);
  });

  return layers;
}

//pois: Process layers
export function normalizeLayer(
  layer: JSONLayer,
  key: string,
  options: NormalizeOptions
): POILayer {
  let result: POILayer;

  //In case "layer" is array (Old JSON array spec - convert to GeoJSON)
  if (Array.isArray(layer)) {
    const features = layer.map(x => normalizePoi(x));
    result = {
      type: "FeatureCollection",
      features,
      id: key
    } as POILayer;
    //In case "layer" is FeatureCollection (GeoJSON input - preserve with metadata)
  } else if (layer.type === "FeatureCollection") {
    // Preserve FeatureCollection, ensure all features are normalized
    const layerWithMeta = layer as any; // Temporarily cast to access custom properties
    const buffer: any = Object.assign({}, layerWithMeta.properties || {});
    if (layerWithMeta.name) buffer.name = layerWithMeta.name;
    buffer.type = "FeatureCollection";
    buffer.features = layer.features.map((x: any) => normalizePoi(x));
    buffer.id = key;
    result = buffer as POILayer;
  } else {
    // Fallback: create empty FeatureCollection
    result = {
      type: "FeatureCollection",
      features: [],
      id: key
    } as POILayer;
  }

  // Add layer metadata
  if (!result.namespaceID) {
    result.namespaceID = `${options.namespace ? `${options.namespace}#` : ""
      }${key}`;
  }
  if (!result.name) result.name = key === "main" ? options.name : key;
  if (!result.features) result.features = [];

  return result;
}

//pois: Process poi - converts JSON POI to GeoJSON Feature
export function normalizePoi(poi: JSONPoi | Feature<Point>): Feature<Point> {
  //In case "poi" is already a GeoJSON Feature (preserve)
  if (poi.type === "Feature") {
    // Validate it has required fields
    if (!poi.geometry || !poi.geometry.coordinates) {
      throw new Error("Invalid GeoJSON Feature: missing geometry.coordinates");
    }
    // Ensure properties exist
    if (!poi.properties) {
      poi.properties = {};
    }
    // If Feature doesn't have id but properties.id exists, use it
    if (!poi.id && poi.properties.id) {
      poi.id = poi.properties.id;
    }
    return poi as Feature<Point>;
  }

  // Convert JSON POI object to GeoJSON Feature
  // Type narrow to JSONPoi since we've already handled Feature case above
  const jsonPoi = poi as JSONPoi;
  const coordinates = normalizeCoordinates(jsonPoi);
  const properties: any = {};

  // Copy all properties except coordinate fields and id
  Object.keys(jsonPoi).forEach(key => {
    if (
      key !== "lnglat" &&
      key !== "lng" &&
      key !== "lat" &&
      key !== "longitude" &&
      key !== "latitude" &&
      key !== "id"
    ) {
      properties[key] = jsonPoi[key];
    }
  });

  const feature: Feature<Point> = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates
    },
    properties
  };

  // Preserve id if provided
  if (poi.id) {
    feature.id = poi.id;
  }

  return feature;
}

// Add id to every feature in a FeatureCollection
export function addIdToFeature(
  layers: LayersCollection,
  key: string,
  options: NormalizeOptions
) {
  if (!layers[key]) return;
  const collection = layers[key];
  const features = collection.features;
  if (!collection.__nextId) {
    collection.__nextId = 0;
  }
  features.forEach((feature: Feature) => {
    if (!feature.id) {
      feature.id = `${key}_${collection.__nextId ?? 0}`;
      collection.__nextId = (collection.__nextId ?? 0) + 1;
    }
    if (!feature.properties) {
      feature.properties = {};
    }
    if (!feature.properties.namespaceID) {
      feature.properties.namespaceID = `${options.namespace ? `${options.namespace}#` : ""
        }${feature.id}`;
    }
  });
}
