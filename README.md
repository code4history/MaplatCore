# Maplat Core library

Maplat is the cool Historical Map/Illustrated Map Viewer API.  
It can transform each map coordinates with nonlinear but homeomorphic projection and makes possible that the maps can collaborate with GPS/accurate maps, without distorting original maps.  
This is part of [Maplat](https://github.com/code4history/Maplat/wiki) project.

## Installation

### Browser

Use [this zip file](https://code4history.github.io/MaplatCore/distribution.zip).  
This include 
* dist/maplat_core.js
* dist/maplat_core.css
* parts

Put them under your web site root directory and call them like this:

```html
<link rel="stylesheet" href="dist/maplat_core.css">
<script type="text/javascript" src="maplat_core.js"></script>
```

Working example is [here](https://code4history.github.io/MaplatCore/).  
Example (including sample data) zip file is [here](https://code4history.github.io/MaplatCore/example.zip).

### node.js

NOTICE: Maplat core is not working on server side.  
Installing this from npm is just for developing use.

The easiest way to install maplat_core is with [`npm`][npm].

[npm]: https://www.npmjs.com/

```sh
npm install @maplat/core
```

## How to use (In browser)

```javascript
    Maplat.createObject(option).then(function(app){
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
