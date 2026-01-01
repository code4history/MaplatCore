[![CI](https://github.com/code4history/MaplatCore/actions/workflows/test.yml/badge.svg)](https://github.com/code4history/MaplatCore/actions/workflows/test.yml)

# MaplatCore library

Maplat is the cool Historical Map/Illustrated Map Viewer API.  
It can transform each map coordinates with nonlinear but homeomorphic projection and makes possible that the maps can collaborate with GPS/accurate maps, without distorting original maps.  
This is part of [Maplat](https://github.com/code4history/Maplat/wiki) project.

日本語版は[こちら](README.ja.md)をご覧ください。

## Requirements

- **Node.js**: Version 20 or 22 (tested in CI)
- **pnpm**: Version 9 or higher
- **Required Library**: OpenLayers (Architecture requirement)
- **Optional Libraries**: MapLibre GL JS or Mapbox GL JS (For vector tile support etc.)

## Installation

### Browser (ES Modules)

You can use MaplatCore directly in the browser using ES Modules and a CDN.
Note that you **must** include OpenLayers CSS and JS.

```html
<!-- OpenLayers CSS (Required) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@latest/ol.css" />
<!-- OpenLayers JS (Required) -->
<script src="https://cdn.jsdelivr.net/npm/ol@latest/dist/ol.js"></script>

<script type="module">
  import { MaplatApp } from 'https://cdn.jsdelivr.net/npm/@maplat/core@latest/dist/maplat_core.js';
  // ... usage
</script>
```

### Bundler (Vite / Webpack / etc.)

Install via pnpm (recommended):

```sh
pnpm add @maplat/core
```

Or via npm:

```sh
npm install @maplat/core
```

## Peer Dependencies

MaplatCore strictly requires **OpenLayers** to function. Mapbox GL JS and MapLibre GL JS are optional extensions for vector tile support.

### Required: OpenLayers

OpenLayers is architecturally required for MaplatCore. You must install it and import its CSS.

**pnpm:**
```sh
pnpm add ol
```

**CDN:**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@latest/ol.css" />
<script src="https://cdn.jsdelivr.net/npm/ol@latest/dist/ol.js"></script>
```

### Optional: Mapbox GL JS

Only required if you use Mapbox vector tiles.

**pnpm:**
```sh
pnpm add mapbox-gl
```

**CDN:**
```html
<link href="https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.css" rel="stylesheet" />
<script src="https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.js"></script>
```

Note: Mapbox GL JS requires an access token. Provide it via the `mapboxToken` option.

### Optional: MapLibre GL JS

Only required if you use MapLibre vector tiles.

**pnpm:**
```sh
pnpm add maplibre-gl
```

**CDN:**
```html
<link href="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css" rel="stylesheet" />
<script src="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js"></script>
```

## Usage

### Browser (ES Modules)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <!-- OpenLayers CSS is REQUIRED -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@latest/ol.css" />
  
  <!-- Optional: MapLibre GL JS -->
  <link href="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css" rel="stylesheet" />
  <script src="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js"></script>
</head>
<body>
  <div id="map_div" style="width: 100%; height: 100vh;"></div>
  
  <!-- OpenLayers JS is REQUIRED -->
  <script src="https://cdn.jsdelivr.net/npm/ol@latest/dist/ol.js"></script>

  <script type="module">
    import { MaplatApp } from 'https://cdn.jsdelivr.net/npm/@maplat/core@latest/dist/maplat_core.js';

    const option = {
      maplibregl: maplibregl, // Inject only if you use it
      // mapboxgl: mapboxgl, 
      // mapboxToken: 'YOUR_ACCESS_TOKEN',
      startFrom: 'gsi', // Initial map ID
      div: 'map_div' // Target div ID (optional, default is 'map_div')
    };

    MaplatApp.createObject(option).then(function(app){
        console.log('Maplat initialized', app);
    });
  </script>
</body>
</html>
```

### Bundler (TypeScript / Vite)

```typescript
import { MaplatApp } from '@maplat/core';
import 'ol/ol.css'; // REQUIRED: OpenLayers CSS

// Optional: Import MapLibre if needed
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const option = {
  maplibregl: maplibregl, // Optional
  startFrom: 'gsi',
};

MaplatApp.createObject(option).then((app) => {
  console.log('Maplat initialized', app);
});
```

### API Reference

#### Map State & Control

- `currentMapInfo(): object`
  - Get information about the currently active map.
- `mapInfo(mapID: string): object`
  - Get information about a specific map by its ID.
- `changeMap(mapID: string, restore?: object): Promise<void>`
  - Switch to a different map. `restore` object can optionally set initial position (x, y, zoom, rotation).
- `requestUpdateState(data: object): Promise<void>`
  - Request an update to the map state (position, transparency, etc.).

#### Coordinate System

- `clientPointToLngLat(clientX: number, clientY: number): [number, number]`
  - Convert screen coordinates (pixels relative to viewport) to Longitude/Latitude.
- `lngLatToClientPoint(lng: number, lat: number): [number, number]`
  - Convert Longitude/Latitude to screen coordinates.

#### Markers (Point Data)

- `addMarker(data: object, clusterId?: string): void`
  - Add a marker. `data` should contain `lng`, `lat`, `name`, `desc` (description), `icon`, etc.
  - `clusterId` specifies which layer to add the marker to (e.g., 'main', or specific map layer).
- `removeMarker(id: string): void`
  - Remove a specific marker by its ID (e.g. 'main_1').
- `updateMarker(id: string, data: object, overwrite?: boolean): void`
  - Update an existing marker's data (e.g. move position).
- `clearMarker(clusterId?: string): void`
  - Remove all markers from a specific cluster/layer.
- `selectMarker(id: string): void`
  - Programmatically select (highlight) a marker.
- `unselectMarker(): void`
  - Deselect the currently selected marker.
- `getMarker(id: string): object`
  - Get data for a specific marker.
- `setMarker(data: object): void`
  - Batch add/set markers. Useful for initialization or mass updates.
- `showAllMarkers(): void`
  - Make all markers visible.
- `hideAllMarkers(): void`
  - Hide all markers.

#### Lines & Vectors

- `addLine(data: object): void`
  - Add a line feature. data: `{ lnglats: [[lng, lat], ...], stroke: { color: '#...', width: 2 } }`
- `addVector(data: object): void`
  - Add a polygon/vector feature (GeoJSON compatible).
- `setLine(data: object): void` / `setVector(data: object): void`
  - Batch set lines/vectors.
- `resetLine()` / `resetVector()` / `resetMarker()`
  - Clear and reset basic lines/vectors/markers (often used for default layers).
- `clearLine()` / `clearVector()`
  - Clear all lines/vectors.

#### POI Layers

Maplat manages markers in "layers".

- `addPoiLayer(id: string, data: object): void`
  - Create a new POI layer. `data` can define default icons.
- `showPoiLayer(id: string): void`
  - Show a specific layer.
- `hidePoiLayer(id: string): void`
  - Hide a specific layer.
- `listPoiLayers(hideOnly?: boolean, nonzero?: boolean): string[]`
  - Get a list of available layer IDs.

#### GPS & User Position

- `handleGPS(enable: boolean): void`
  - Turn GPS tracking on or off.
- `getGPSEnabled(): boolean`
  - Check if GPS tracking is currently active.
- `setGPSMarker(position: object): void`
  - Manually update the GPS marker position (usually handled automatically if GPS is on).

#### Event Handling

Use `app.addEventListener(type, callback)` to handle events.

- `clickMarker`: Fired when a marker is clicked. `evt.detail` contains marker data.
- `clickMap`: Fired when the map background is clicked.
- `gps_result`: Fired when a GPS position update happens.
- `gps_error`: Fired when GPS fails.

### Example

```javascript
MaplatApp.createObject(option).then(function(app){
    // Show current map info
    console.log(app.currentMapInfo());

    // Event Listener
    app.addEventListener('clickMarker', function(evt) {
        console.log('Marker clicked:', evt.detail);
        app.selectMarker(evt.detail.namespaceID);
    });

    // Add a custom marker
    app.addMarker({
        lng: 141.1501111,
        lat: 39.69994722,
        name: "Morioka Castle",
        desc: "Historical site in Morioka",
        icon: "parts/blue_marker.png"
    }, 'main'); // 'main' is the default layer
});
```

## Development

### Running Tests

```sh
# Run linting
pnpm run lint

# Run type checking
pnpm run typecheck

# Run unit tests
pnpm test

# Run E2E tests
pnpm run test:e2e
```

### Building

```sh
# Build the library
pnpm run build

# Build development demo
pnpm run build:demo

# Run development server
pnpm run dev
```

## License

Copyright (c) 2019-2026 Kohei Otsuka, Code for History

MaplatCore is under [Maplat Limited License](LICENSE) (based on Apache 2.0 with some restrictions).
Please see [LICENSE](LICENSE) file for details.
