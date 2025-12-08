# MaplatCore library

Maplat は、クールな古地図/絵地図ビューアー API です。
各地図の座標を非線形かつ同相な投影で変換し、元の地図を歪めることなく、GPS/正確な地図と連携させることを可能にします。
これは [Maplat](https://github.com/code4history/Maplat/wiki) プロジェクトの一部です。

English version is [here](README.md).

## インストール

### ブラウザ (ES Modules)

ES Modules と CDN を使用して、ブラウザで直接 MaplatCore を使用できます。

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@maplat/core@0.11.0/dist/maplat_core.css">
<script type="module">
  import { MaplatApp } from 'https://cdn.jsdelivr.net/npm/@maplat/core@0.11.0/dist/maplat_core.js';
  // ... 使用法
</script>
```

### バンドラー (Vite / Webpack / etc.)

npm 経由でインストールします:

```sh
npm install @maplat/core
```

## ピア依存関係 (Peer Dependencies)

MaplatCore は、**OpenLayers** がインストールまたは含まれている必要があります。Mapbox GL JS および MapLibre GL JS はオプションです。ライブラリのインスタンスをオプション経由で Maplat に提供する必要があります。

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

注意: Mapbox GL JS にはアクセストークンが必要です。`mapboxToken` オプション経由で提供してください。

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

## 使い方

### ブラウザ (ES Modules)

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
      maplibregl: maplibregl, // グローバルな maplibregl オブジェクトを注入
      // mapboxgl: mapboxgl, // Mapbox を使用する場合
      // mapboxToken: 'YOUR_ACCESS_TOKEN', // Mapbox を使用する場合
      startFrom: 'gsi', // 初期地図 ID
      div: 'map_div' // ターゲット div ID (オプション、デフォルトは 'map_div')
    };

    MaplatApp.createObject(option).then(function(app){
        console.log('Maplat initialized', app);
    });
  </script>
</body>
</html>
```

### バンドラー (TypeScript / Vite)

```typescript
import { MaplatApp } from '@maplat/core';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
// import mapboxgl from 'mapbox-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import { Map, View } from 'ol'; // OpenLayers の場合

const option = {
  maplibregl: maplibregl,
  // mapboxgl: mapboxgl,
  startFrom: 'gsi',
};

MaplatApp.createObject(option).then((app) => {
  console.log('Maplat initialized', app);
});
```

### API 使用例

`app` インスタンスを取得したら、それを使用して地図を制御できます。

```javascript
    MaplatApp.createObject(option).then(function(app){
        // 現在の地図情報をコンソールに表示
        console.log(app.currentMapInfo());
        // ID が 'gsi' の地図情報をコンソールに表示
        console.log(app.mapInfo('gsi'));
        // クリックされたピンを選択状態にし、クリックイベントの詳細をコンソールに表示
        var moveFlag = false;
        app.addEventListener('clickMarker', function(evt) {
            app.selectMarker(evt.detail.namespaceID);
            console.log(evt);
        });
        // 地図クリックイベントの詳細をコンソールに表示
        app.addEventListener('clickMap', function (evt) {
            console.log(evt);
        });
        // 地図にラインオブジェクトを追加
        app.addLine({
            lnglats: [[141.151995, 39.701599], [141.151137, 39.703736], [141.1521671, 39.7090232]],
            stroke: {
                color: '#ffcc33',
                width: 2
            }
        });
        // 'main2' という名前の地図レイヤーを追加し、そのレイヤーにオンデマンドマーカーを追加
        app.addPoiLayer('main2');
        app.addPoiLayer('morioka_ndl2#main2', {
            icon: 'parts/blue_marker.png',
            selectedIcon: 'parts/red_marker.png'
        });
        // ボタン機能: 'main' レイヤーのすべてのマーカーを表示
        document.getElementById('show').addEventListener('click', function(e) {
            app.showPoiLayer('main');
        });
        // ボタン機能: 'main' レイヤーのすべてのマーカーを非表示
        document.getElementById('hide').addEventListener('click', function(e) {
            app.hidePoiLayer('main');
        });
        // ボタン機能: 'main' レイヤーのすべてのマーカーを削除
        document.getElementById('clear').addEventListener('click', function(e) {
            app.clearMarker('main');
        });
        // ボタン機能: 単一マーカーの位置を切り替え
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
        // ボタン機能: 単一マーカーを削除
        document.getElementById('remove').addEventListener('click', function(e) {
            app.removeMarker('main_2');
        });
        // ボタン機能: 'main2' レイヤーに単一マーカーを追加
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
        // ボタン機能: 'main2' レイヤーのすべてのマーカーを削除
        document.getElementById('clear2').addEventListener('click', function(e) {
            app.clearMarker('main2');
        });
        // ボタン機能: 'morioka_ndl2#main2' (各地図の POI レイヤー) に単一マーカーを追加
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
        // ボタン機能: 'morioka_ndl2#main2' (各地図の POI レイヤー) のすべてのマーカーを削除
        document.getElementById('clearMap').addEventListener('click', function(e) {
            app.clearMarker('morioka_ndl2#all');
        });
        // ボタン機能: すべてのマーカーを非選択状態にする
        document.getElementById('unSelect').addEventListener('click', function(e) {
            app.unselectMarker();
        });
        // ボタン機能: すべてのレイヤーのすべてのマーカーを表示
        document.getElementById('showAll').addEventListener('click', function(e) {
            app.showAllMarkers();
        });
        // ボタン機能: すべてのレイヤーのすべてのマーカーを非表示
        document.getElementById('hideAll').addEventListener('click', function(e) {
            app.hideAllMarkers();
        });
    });
```
