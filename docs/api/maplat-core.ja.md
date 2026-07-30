# MaplatApp API シグネチャ

> `@maplat/core`（`0.13.2`）のリリース依存シグネチャ。
> 概念解説は [Wiki API-Reference](https://github.com/code4history/MaplatCore/wiki/API-Reference) を参照してください。

以下のメソッドはすべて `MaplatApp.createObject(option)` が返す
`MaplatApp` インスタンス上で呼び出します。

## 地図の状態と制御

- `currentMapInfo(): object`
  - 現在アクティブな地図の情報を取得します。
- `mapInfo(mapID: string): object`
  - 指定した ID の地図情報を取得します。
- `changeMap(mapID: string, restore?: object): Promise<void>`
  - 別の地図に切り替えます。`restore` オブジェクトで初期位置
    (x, y, zoom, rotation) を指定できます。
- `requestUpdateState(data: object): Promise<void>`
  - 地図の状態（位置、透過度など）の更新をリクエストします。
- `getRotation(): number`
  - 現在の画面上の地図回転角を度数で取得します（`restore.position.rotation`
    と同じ単位系）。
- `getDirection(): Promise<number>`
  - 現在の実世界方位角を度数で取得します。TIN 地図では現地座標の歪み
    補正を含むため `getRotation()` と値が異なる場合があり、非同期で解決
    します。

## 座標系

- `clientPointToLngLat(clientX: number, clientY: number): [number, number]`
  - 画面座標（ビューポートに対するピクセル）を経度/緯度に変換します。
- `lngLatToClientPoint(lng: number, lat: number): [number, number]`
  - 経度/緯度を画面座標に変換します。

## マーカー（ポイントデータ）

- `addMarker(data: object, clusterId?: string): void`
  - マーカーを追加します。`data` には `lng`, `lat`, `name`, `desc`
    (説明), `icon` などを含める必要があります。
  - `clusterId` はマーカーを追加するレイヤーを指定します
    （例: `'main'` または特定の地図レイヤー）。
- `removeMarker(id: string): void`
  - ID を指定して特定のマーカーを削除します (例: `'main_1'`)。
- `updateMarker(id: string, data: object, overwrite?: boolean): void`
  - 既存マーカーのデータを更新します（位置の移動など）。
- `clearMarker(clusterId?: string): void`
  - 特定クラスター/レイヤーからすべてのマーカーを削除します。
- `selectMarker(id: string): void`
  - プログラムでマーカーを選択（ハイライト）します。
- `unselectMarker(): void`
  - 現在選択されているマーカーを非選択にします。
- `getMarker(id: string): object`
  - 特定マーカーのデータを取得します。
- `setMarker(data: object): void`
  - マーカーを一括追加/設定します。初期化や大量更新に便利です。
- `showAllMarkers(): void`
  - すべてのマーカーを表示します。
- `hideAllMarkers(): void`
  - すべてのマーカーを非表示にします。

## ラインとベクター

- `addLine(data: object): void`
  - ラインフィーチャを追加します。`data`:
    `{ lnglats: [[lng, lat], ...], stroke: { color: '#...', width: 2 } }`。
- `addVector(data: object): void`
  - ポリゴン/ベクターフィーチャを追加します (GeoJSON 互換)。
- `setLine(data: object): void` / `setVector(data: object): void`
  - ライン/ベクターを一括設定します。
- `resetLine()` / `resetVector()` / `resetMarker()`
  - 基本的なライン/ベクター/マーカーをクリアしてリセットします
    （デフォルトレイヤーなどで使用）。
- `clearLine()` / `clearVector()`
  - すべてのライン/ベクターをクリアします。

## POI レイヤー

Maplat はマーカーを「レイヤー」で管理します。各レイヤーはローカル `id` と
`namespaceID`（`"<mapID>#<layerId>"` 形式）を持ちます。マップ由来レイヤーを
対象とする場合は `showPoiLayer` / `hidePoiLayer` / `addPoiLayer` /
`removePoiLayer` に `namespaceID` を渡してください。

- `addPoiLayer(id: string, data: object): void`
  - 新しい POI レイヤーを作成します。`data` でデフォルトアイコンなどを
    定義できます。
- `showPoiLayer(id: string): void`
  - 特定レイヤーを表示します。レイヤーが見つからない場合は `console.warn`
    を出力し、何も変更しません。
- `hidePoiLayer(id: string): void`
  - 特定レイヤーを非表示にします。レイヤーが見つからない場合は
    `console.warn` を出力し、何も変更しません。
- `removePoiLayer(id: string): void`
  - レイヤーを削除します。レイヤーが見つからない場合は `console.warn`
    を出力し、何も変更しません。
- `getPoiLayer(id: string): PoiLayer | undefined`
  - `namespaceID`（またはアプリ直下の `id`）でレイヤーを取得します。
    見つからない場合は `undefined` を返します。warning は出力しません
    （内部の state 復元で使用）。
- `listPoiLayers(hideOnly?: boolean, nonzero?: boolean): PoiLayer[]`
  - 利用可能なレイヤーのリストを、アプリ設定で定義された順序（`main`
    は常に先頭、それ以外はアルファベット順ではなく定義順）で取得します。
    各要素は `PoiLayer` オブジェクトで、`id`、`namespaceID`、`name`、
    `pois`、およびオプションで `hide` / `icon` / `selectedIcon` を持ちます。

## GPS とユーザー位置

- `handleGPS(enable: boolean): void`
  - GPS トラッキングをオン/オフします。
- `getGPSEnabled(): boolean`
  - GPS トラッキングが現在アクティブか確認します。
- `setGPSMarker(position: object): void`
  - GPS マーカーの位置を手動更新します（通常、GPS がオンの場合は自動で
    処理されます）。

## イベントハンドリング

`app.addEventListener(type, callback)` でイベントを処理します。

- `clickMarker`: マーカーがクリックされたときに発火します。
  `evt.detail` にマーカーデータが含まれます。
- `clickMap`: 地図の背景がクリックされたときに発火します。
- `gps_result`: GPS 位置更新があったときに発火します。
- `gps_error`: GPS が失敗したときに発火します。

## 上級者向け: 地図・ソースの直接構築

`MaplatApp` を経由せずに地図やタイルソースを構築したい組み込みアプリ向け
（例: MaplatEditor のプレビューペイン）に、より低レイヤーの構成要素も直接
export しています。

- `MaplatMap` — `MaplatApp` が内部で使用する OpenLayers `Map` のサブクラス。
- `mapSourceFactory` — 地図定義から `MaplatSource` を構築するファクトリ関数。
- `MaplatSource` / `BackmapSource`（型のみ） — `mapSourceFactory` が返す
  ソースのインターフェース。

これらは、ホストアプリケーションが内部モジュールを deep import せずに
地図・ソースを直接構築できるようにするために export されています。

## 使用例

```javascript
MaplatApp.createObject(option).then(function (app) {
  // 現在の地図情報を表示
  console.log(app.currentMapInfo());

  // イベントリスナー
  app.addEventListener('clickMarker', function (evt) {
    console.log('Marker clicked:', evt.detail);
    app.selectMarker(evt.detail.namespaceID);
  });

  // カスタムマーカーを追加
  app.addMarker(
    {
      lng: 141.1501111,
      lat: 39.69994722,
      name: '盛岡城',
      desc: '盛岡の史跡',
      icon: 'parts/blue_marker.png',
    },
    'main',
  ); // 'main' はデフォルトレイヤー
});
```
