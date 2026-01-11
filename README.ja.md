[![CI](https://github.com/code4history/MaplatCore/actions/workflows/test.yml/badge.svg)](https://github.com/code4history/MaplatCore/actions/workflows/test.yml)

# MaplatCore library

Maplat は、クールな古地図/絵地図ビューアー API です。
各地図の座標を非線形かつ同相な投影で変換し、元の地図を歪めることなく、GPS/正確な地図と連携させることを可能にします。
これは [Maplat](https://github.com/code4history/Maplat/wiki) プロジェクトの一部です。

English version is [here](README.md).

## 動作要件

- **Node.js**: バージョン 20 または 22 (CI でテスト済み)
- **pnpm**: バージョン 9 以上
- **必須ライブラリ**: OpenLayers (MaplatCoreのアーキテクチャ上必須)
- **オプションライブラリ**: MapLibre GL JS または Mapbox GL JS (ベクタータイル機能等を使用する場合)

## インストール

### ブラウザ (ES Modules)

ES Modules と CDN を使用して、ブラウザで直接 MaplatCore を使用できます。
OpenLayers の CSS と JS を**必ず**読み込んでください。

```html
<!-- OpenLayers CSS (必須) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@latest/ol.css" />
<!-- OpenLayers JS (必須) -->
<script src="https://cdn.jsdelivr.net/npm/ol@latest/dist/ol.js"></script>

<script type="module">
  import { MaplatApp } from 'https://cdn.jsdelivr.net/npm/@maplat/core@latest/dist/maplat_core.js';
  // ... 使用法
</script>
```

### バンドラー (Vite / Webpack / etc.)

pnpm 経由でインストールします (推奨):

```sh
pnpm add @maplat/core
```

または npm:

```sh
npm install @maplat/core
```

## ピア依存関係 (Peer Dependencies)

MaplatCore が動作するためには **OpenLayers** が厳密に必要です。Mapbox GL JS および MapLibre GL JS は、ベクタータイルサポートなどのためのオプション拡張です。

### 必須: OpenLayers

OpenLayers は MaplatCore のアーキテクチャ上必須です。インストールし、CSSもインポートする必要があります。

**pnpm:**
```sh
pnpm add ol
```

**CDN:**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@latest/ol.css" />
<script src="https://cdn.jsdelivr.net/npm/ol@latest/dist/ol.js"></script>
```

### オプション: Mapbox GL JS

Mapbox ベクタータイルを使用する場合のみ必要です。

**pnpm:**
```sh
pnpm add mapbox-gl
```

**CDN:**
```html
<link href="https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.css" rel="stylesheet" />
<script src="https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.js"></script>
```

注意: Mapbox GL JS にはアクセストークンが必要です。`mapboxToken` オプション経由で提供してください。

### オプション: MapLibre GL JS

MapLibre ベクタータイルを使用する場合のみ必要です。

**pnpm:**
```sh
pnpm add maplibre-gl
```

**CDN:**
```html
<link href="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css" rel="stylesheet" />
<script src="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js"></script>
```

## 使い方

## ライフサイクル
- フェーズや uiHooks については `docs/ui-core-lifecycle.ja.md` を参照してください。

### ブラウザ (ES Modules)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <!-- OpenLayers CSS は必須です -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@latest/ol.css" />
  
  <!-- オプション: MapLibre GL JS -->
  <link href="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css" rel="stylesheet" />
  <script src="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js"></script>
</head>
<body>
  <div id="map_div" style="width: 100%; height: 100vh;"></div>
  
  <!-- OpenLayers JS は必須です -->
  <script src="https://cdn.jsdelivr.net/npm/ol@latest/dist/ol.js"></script>
  
  <script type="module">
    import { MaplatApp } from 'https://cdn.jsdelivr.net/npm/@maplat/core@latest/dist/maplat_core.js';

    const option = {
      maplibregl: maplibregl, // 使用する場合のみ注入
      // mapboxgl: mapboxgl, 
      // mapboxToken: 'YOUR_ACCESS_TOKEN',
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
import 'ol/ol.css'; // 必須: OpenLayers CSS

// オプション: 必要に応じて MapLibre 等をインポート
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const option = {
  maplibregl: maplibregl, // オプション
  startFrom: 'gsi',
};

MaplatApp.createObject(option).then((app) => {
  console.log('Maplat initialized', app);
});
```

### API リファレンス

#### 地図の状態と制御

- `currentMapInfo(): object`
  - 現在アクティブな地図の情報を取得します。
- `mapInfo(mapID: string): object`
  - 指定した ID の地図情報を取得します。
- `changeMap(mapID: string, restore?: object): Promise<void>`
  - 別の地図に切り替えます。 `restore` オブジェクトで初期位置 (x, y, zoom, rotation) を指定できます。
- `requestUpdateState(data: object): Promise<void>`
  - 地図の状態（位置、透過度など）の更新をリクエストします。

#### 座標系

- `clientPointToLngLat(clientX: number, clientY: number): [number, number]`
  - 画面座標（ビューポートに対するピクセル）を 経度/緯度 に変換します。
- `lngLatToClientPoint(lng: number, lat: number): [number, number]`
  - 経度/緯度 を画面座標に変換します。

#### マーカー (ポイントデータ)

- `addMarker(data: object, clusterId?: string): void`
  - マーカーを追加します。 `data` には `lng`, `lat`, `name`, `desc` (説明), `icon` などを含める必要があります。
  - `clusterId` はマーカーを追加するレイヤーを指定します（例: 'main' または特定の地図レイヤー）。
- `removeMarker(id: string): void`
  - ID を指定して特定のマーカーを削除します (例: 'main_1')。
- `updateMarker(id: string, data: object, overwrite?: boolean): void`
  - 既存のマーカーのデータを更新します (例: 位置の移動)。
- `clearMarker(clusterId?: string): void`
  - 特定のクラスター/レイヤーからすべてのマーカーを削除します。
- `selectMarker(id: string): void`
  - プログラムでマーカーを選択（ハイライト）します。
- `unselectMarker(): void`
  - 現在選択されているマーカーを非選択にします。
- `getMarker(id: string): object`
  - 特定のマーカーのデータを取得します。
- `setMarker(data: object): void`
  - マーカーを一括追加/設定します。初期化や大量更新に便利です。
- `showAllMarkers(): void`
  - すべてのマーカーを表示します。
- `hideAllMarkers(): void`
  - すべてのマーカーを非表示にします。

#### ラインとベクター

- `addLine(data: object): void`
  - ラインフィーチャを追加します。 data: `{ lnglats: [[lng, lat], ...], stroke: { color: '#...', width: 2 } }`
- `addVector(data: object): void`
  - ポリゴン/ベクターフィーチャを追加します (GeoJSON 互換)。
- `setLine(data: object): void` / `setVector(data: object): void`
  - ライン/ベクターを一括設定します。
- `resetLine()` / `resetVector()` / `resetMarker()`
  - 基本的なライン/ベクター/マーカーをクリアしてリセットします（デフォルトレイヤーなどで使用）。
- `clearLine()` / `clearVector()`
  - すべてのライン/ベクターをクリアします。

#### POI レイヤー

Maplat はマーカーを「レイヤー」で管理します。

- `addPoiLayer(id: string, data: object): void`
  - 新しい POI レイヤーを作成します。 `data` でデフォルトアイコンなどを定義できます。
- `showPoiLayer(id: string): void`
  - 特定のレイヤーを表示します。
- `hidePoiLayer(id: string): void`
  - 特定のレイヤーを非表示にします。
- `listPoiLayers(hideOnly?: boolean, nonzero?: boolean): string[]`
  - 利用可能なレイヤー ID のリストを取得します。

#### GPS とユーザー位置

- `handleGPS(enable: boolean): void`
  - GPS トラッキングをオンまたはオフにします。
- `getGPSEnabled(): boolean`
  - GPS トラッキングが現在アクティブかどうかを確認します。
- `setGPSMarker(position: object): void`
  - GPS マーカーの位置を手動で更新します（通常、GPS がオンの場合は自動的に処理されます）。

#### イベントハンドリング

`app.addEventListener(type, callback)` を使用してイベントを処理します。

- `clickMarker`: マーカーがクリックされたときに発火します。 `evt.detail` にマーカーデータが含まれます。
- `clickMap`: 地図の背景がクリックされたときに発火します。
- `gps_result`: GPS 位置更新があったときに発火します。
- `gps_error`: GPS が失敗したときに発火します。

### 使用例

```javascript
MaplatApp.createObject(option).then(function(app){
    // 現在の地図情報を表示
    console.log(app.currentMapInfo());

    // イベントリスナー
    app.addEventListener('clickMarker', function(evt) {
        console.log('Marker clicked:', evt.detail);
        app.selectMarker(evt.detail.namespaceID);
    });

    // カスタムマーカーを追加
    app.addMarker({
        lng: 141.1501111,
        lat: 39.69994722,
        name: "盛岡城",
        desc: "盛岡の史跡",
        icon: "parts/blue_marker.png"
    }, 'main'); // 'main' はデフォルトレイヤー
});
```

## 開発

### テストの実行

```sh
# Lint 実行
pnpm run lint

# 型チェック実行
pnpm run typecheck

# ユニットテスト実行
pnpm test

# E2E テスト実行
pnpm run test:e2e
```

### ビルド

```sh
# ライブラリのビルド
pnpm run build

# 開発デモのビルド
pnpm run build:demo

# 開発サーバーの実行
pnpm run dev
```

## ライセンス

Copyright (c) 2019-2026 Kohei Otsuka, Code for History

MaplatCore は [Maplat Limited License](LICENSE) (Apache 2.0 をベースにいくつかの制限を加えたもの) の下で提供されています。
詳細は [LICENSE](LICENSE) ファイルをご覧ください。
