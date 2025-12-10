# MaplatCore library

Maplat is the cool Historical Map/Illustrated Map Viewer API.  
It can transform each map coordinates with nonlinear but homeomorphic projection and makes possible that the maps can collaborate with GPS/accurate maps, without distorting original maps.  
This is part of [Maplat](https://github.com/code4history/Maplat/wiki) project.

日本語版は[こちら](README.ja.md)をご覧ください。

## Installation

### Browser (ES Modules)

You can use MaplatCore directly in the browser using ES Modules and a CDN.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@maplat/core@0.11.0/dist/maplat_core.css">
<script type="module">
  import { MaplatApp } from 'https://cdn.jsdelivr.net/npm/@maplat/core@0.11.0/dist/maplat_core.js';
  // ... usage
</script>
```

### Bundler (Vite / Webpack / etc.)

Install via npm:

```sh
npm install @maplat/core
```

## Peer Dependencies

MaplatCore requires **OpenLayers** to be installed or included. Mapbox GL JS and MapLibre GL JS are optional. You must provide the library instance to Maplat via the options.

### Mapbox GL JS

**npm:**
```sh
npm install mapbox-gl
```

**CDN:**
```html
<link href="https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.css" rel="stylesheet" />
<script src="https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.js"></script>
```

Note: Mapbox GL JS requires an access token. Provide it via the `mapboxToken` option.

### MapLibre GL JS

**npm:**
```sh
npm install maplibre-gl
```

**CDN:**
```html
<link href="https://unpkg.com/maplibre-gl@4.5.0/dist/maplibre-gl.css" rel="stylesheet" />
<script src="https://unpkg.com/maplibre-gl@4.5.0/dist/maplibre-gl.js"></script>
```

### OpenLayers

**npm:**
```sh
npm install ol
```

**CDN:**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@10.6.1/ol.css" />
<script src="https://cdn.jsdelivr.net/npm/ol@10.6.1/dist/ol.js"></script>
```

## Usage

### Browser (ES Modules)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <link href="https://unpkg.com/maplibre-gl@4.5.0/dist/maplibre-gl.css" rel="stylesheet" />
  <script src="https://unpkg.com/maplibre-gl@4.5.0/dist/maplibre-gl.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@maplat/core@0.11.0/dist/maplat_core.css">
</head>
<body>
  <div id="map_div" style="width: 100%; height: 100vh;"></div>
  <script type="module">
    import { MaplatApp } from 'https://cdn.jsdelivr.net/npm/@maplat/core@0.11.0/dist/maplat_core.js';

    const option = {
      maplibregl: maplibregl, // Inject the global maplibregl object
      // mapboxgl: mapboxgl, // If using Mapbox
      // mapboxToken: 'YOUR_ACCESS_TOKEN', // If using Mapbox
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
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
// import mapboxgl from 'mapbox-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import { Map, View } from 'ol'; // For OpenLayers

const option = {
  maplibregl: maplibregl,
  // mapboxgl: mapboxgl,
  startFrom: 'gsi',
};

MaplatApp.createObject(option).then((app) => {
  console.log('Maplat initialized', app);
});
```

### API Usage Example

Once you have the `app` instance, you can use it to control the map.

```javascript
    MaplatApp.createObject(option).then(function(app){
        // Show current map information in console.
        console.log(app.currentMapInfo());
        // Show information of the map which id is 'gsi' in console.
        console.log(app.mapInfo('gsi'));
        // Make clicked pin as selected and show click event detail in console.
        var moveFlag = false;
        app.addEventListener('clickMarker', function(evt) {
            app.selectMarker(evt.detail.namespaceID);
            console.log(evt);
        });
        // show detail of map click event in console.
        app.addEventListener('clickMap', function (evt) {
            console.log(evt);
        });
        // Add line object to the map
        app.addLine({
            lnglats: [[141.151995, 39.701599], [141.151137, 39.703736], [141.1521671, 39.7090232]],
            stroke: {
                color: '#ffcc33',
                width: 2
            }
        });
        // Add map layer called 'main2' and add on-demand marker to the layer.
        app.addPoiLayer('main2');
        app.addPoiLayer('morioka_ndl2#main2', {
            icon: 'parts/blue_marker.png',
            selectedIcon: 'parts/red_marker.png'
        });
        // Button function: Show all markers in the layer named 'main'.
        document.getElementById('show').addEventListener('click', function(e) {
            app.showPoiLayer('main');
        });
        // Button function: Hide all markers in the layer named 'main'.
        document.getElementById('hide').addEventListener('click', function(e) {
            app.hidePoiLayer('main');
        });
        // Button function: Remove all markers in the layer named 'main'.
        document.getElementById('clear').addEventListener('click', function(e) {
            app.clearMarker('main');
        });
        // Button function: Switch the location of single marker.
        document.getElementById('move').addEventListener('click', function(e) {
            var data;
            if (moveFlag) {
                data = {lat: 39.698620, lng: 141.145358};
            } else {
                data = {lat: 39.694758, lng: 141.146534};
            }
            moveFlag = !moveFlag;
            app.updateMarker('main_1', data);
        });
        // Button function: Remove the single marker.
        document.getElementById('remove').addEventListener('click', function(e) {
            app.removeMarker('main_2');
        });
        // Button function: Add the single marker to the layer named 'main2'.
        document.getElementById('add2').addEventListener('click', function(e) {
            app.addMarker({
                address: "岩手県盛岡市内丸1-42",
                desc: "寛延２年創建で当時の藩主南部利視が初代藩主南部信直の功績を称え社殿を建立し御霊を勧請したのが始まりとされている。",
                icon: undefined,
                image: "sakurayama_jinja.jpg",
                lat: 39.701599,
                lng: 141.151995,
                name: "桜山神社",
                selectedIcon: undefined,
                start: 1749
            }, 'main2');
        });
        // Button function: Remove all markers in the layer named 'main2'.
        document.getElementById('clear2').addEventListener('click', function(e) {
            app.clearMarker('main2');
        });
        // Button function: Add the single marker to the layer named 'morioka_ndl2#main2' (POI layer of the each map).
        document.getElementById('addMap').addEventListener('click', function(e) {
            app.addMarker({
                address: "岩手県盛岡市内丸1-37",
                desc: "南部（盛岡）藩南部氏の居城である。西部を流れる北上川と南東部を流れる中津川の合流地、現在の盛岡市中心部にあった花崗岩丘陵に築城された連郭式平山城。",
                icon: undefined,
                image: "moriokajo.jpg",
                lat: 39.69994722,
                lng: 141.1501111,
                name: {ja: "盛岡城", en: "Morioka Castle"},
                selectedIcon: undefined,
                start: 1598
            }, 'morioka_ndl2#main2');
        });
        // Button function: Remove all markers in the layer named 'morioka_ndl2#main2' (POI layer of the each map).
        document.getElementById('clearMap').addEventListener('click', function(e) {
            app.clearMarker('morioka_ndl2#all');
        });
        // Button function: Make all markers' status to unselect.
        document.getElementById('unSelect').addEventListener('click', function(e) {
            app.unselectMarker();
        });
        // Button function: Show all markers on all layers.
        document.getElementById('showAll').addEventListener('click', function(e) {
            app.showAllMarkers();
        });
        // Button function: Hide all markers on all layers.
        document.getElementById('hideAll').addEventListener('click', function(e) {
            app.hideAllMarkers();
        });
    });
```
