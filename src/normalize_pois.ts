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

//pois: Process layers
export async function normalizeLayers(layers: any, options: any) {
  // Resolve url cases
  layers = await nodesLoader(layers);

  //In case "layers" is array
  if (Array.isArray(layers)) {
    layers = await Promise.all(layers.map(async x => await nodesLoader(x)));
    //In case of array of FeatureCollection
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
      //In case old type single layer spec
    } else {
      layers = {
        main: normalizeLayer(layers, "main", options)
      };
    }
    // In case of single FeatureCollection
  } else if (layers.type === "FeatureCollection") {
    const key =
      layers.id || (layers.properties && layers.properties.id) || "main";
    layers = { [key]: normalizeLayer(layers, key, options) };
    // In case current non-geojson layers spec
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
    addIdToPoi(layers, key, options);
  });

  return layers;
}

//pois: Process layers
export function normalizeLayer(layer: any, key: any, options: any) {
  //In case "layer" is array (Old spec)
  if (Array.isArray(layer)) {
    layer = {
      pois: layer.map(x => normalizePoi(x))
    };
    //In case "layer" is FeatureCollection
  } else if (layer.type === "FeatureCollection") {
    const buffer = Object.assign({}, layer.properties || {});
    if (layer.name) buffer.name = layer.name;
    buffer.pois = layer.features.map((x: any) => normalizePoi(x));
    layer = buffer;
  }

  if (typeof layer.id === "undefined") {
    layer.id = key;
  } else {
    if (layer.id !== key) throw "POI layers include bad key setting";
  }
  if (!layer.namespaceID)
    layer.namespaceID = `${
      options.namespace ? `${options.namespace}#` : ""
    }${key}`;
  if (!layer.name) layer.name = key === "main" ? options.name : key;
  if (!layer.pois) layer.pois = [];

  return layer;
}

//pois: Process poi
export function normalizePoi(poi: any) {
  //In case "poi" is GeoJson(Point)
  if (poi.type === "Feature") {
    const buffer = Object.assign({}, poi.properties || {});
    buffer.lnglat = poi.geometry.coordinates;
    if (!buffer.id) buffer.id = poi.id;
    if (!buffer.name) buffer.name = poi.name;
    poi = buffer;
  }
  if (!poi.lnglat)
    poi.lnglat = [poi.lng || poi.longitude, poi.lat || poi.latitude];
  delete poi.lng;
  delete poi.lat;
  delete poi.longitude;
  delete poi.latitude;
  return poi;
}

// Add id to every pois
export function addIdToPoi(layers: any, key: any, options: any) {
  if (!layers[key]) return;
  const cluster = layers[key];
  const pois = cluster.pois;
  if (!cluster.__nextId) {
    cluster.__nextId = 0;
  }
  pois.map((poi: any) => {
    if (!poi.id) {
      poi.id = `${key}_${cluster.__nextId}`;
      cluster.__nextId++;
    }
    if (!poi.namespaceID) {
      poi.namespaceID = `${options.namespace ? `${options.namespace}#` : ""}${
        poi.id
      }`;
    }
  });
}
