# `<maplat-app>` 要素 API シグネチャ

> `@maplat/core` の Custom Element `<maplat-app>` のリリース依存シグネチャ。
> 対象リリースは [README](../../README.ja.md#クイックスタート) のリリースブロックに
> 記載しています。
> `MaplatApp` クラスは [`maplat-core.ja.md`](maplat-core.ja.md) を参照してください。
> 概念解説は [Wiki API-Reference](https://github.com/code4history/MaplatCore/wiki/API-Reference) を参照してください。

`<maplat-app>` は Maplat の地図（「層 A」）の要素の形です。MaplatCore
（`implementation: "core"`）と有償の MaplatCore-Pro（`implementation: "core-pro"`）が
共通に満たす入口で、要素に向けて書いたページや UI の層はどちらの実装の上でも動きます。
`@maplat/ui` のビューア要素 `<maplat-ui>` はこの面の上に作られています。

`MaplatApp` クラスは非推奨で、1.x の間も使えます（次のメジャー版 2.0 で閉じます）。
クラスに入った 2 つの変更は [`MaplatApp` クラスとの関係](#maplatapp-クラスとの関係) に記します。

## 使い方

```typescript
import 'ol/ol.css';               // 必須: OpenLayers CSS
import '@maplat/core/element';    // <maplat-app> を登録する（副作用 import）
```

```html
<!-- 設定ファイル apps/morioka.json を読む -->
<maplat-app app-id="morioka"></maplat-app>

<script type="module">
  const el = document.querySelector('maplat-app');
  await el.ready;
  el.addEventListener('mapChanged', (e) => console.log(e.detail.mapID));
  el.addMarker({ lnglat: [141.152, 39.7006], name: '盛岡城跡' }, 'main');
</script>
```

- `@maplat/core/element` は ES モジュールの入口（`dist/maplat_core_element.js`）です。
  `@maplat/core` と `@maplat/core/common` を import するので、バンドラーか import map と、
  peer dependency の `ol` が必要です。要素の UMD ビルドはありません。
- 要素そのものが地図の入れ物（`appOption.div` の役）です。描画は **light DOM** に行い、
  子要素は要素が所有します。中に手を入れないでください。既定のスタイルは
  `:where(maplat-app){display:block;position:relative;overflow:hidden;height:400px}`
  （`:where()` は詳細度 0 なので、ページの CSS が常に勝ちます）。
- 地図は、要素が文書につながり、`app-id`・`app-src`・`setting`・`appOption` のどれかが
  与えられたときに作られます。つないだのと同じタスクで設定したキーはまとめて使われます。
- 要素を文書から外すと地図を破棄します（旧 `remove()` 相当）。同じタスクの中での移動
  （外して次のマイクロタスクより前に付け直す）では破棄しません。`el.remove()` は標準の
  `HTMLElement.remove()` です。別のアプリに替えるときは要素を置き直してください。
- 別の実装が既に `<maplat-app>` を登録していれば、この import は上書きせず警告します
  （`<maplat-app> is already defined by another implementation; …`）。
- TypeScript: `import type { MaplatAppElement } from '@maplat/core/element'`
  （`@maplat/core/common` からも export）。`HTMLElementTagNameMap` を拡張しているので
  `document.querySelector('maplat-app')` に型が付きます。

## 属性とプロパティ

属性にはそれぞれ camelCase のプロパティがあり、**同じ 1 つの値**を読み書きします
（後から書いた方が値になります）。同じキーを複数の経路で与えたときの優先順位:

```
プロパティ／属性 ＞ appOption の同名キー ＞ 設定ファイル ＞ 既定値
```

「与えられたか」は `undefined` で判定します（`false`・`0`・`""` は与えられた値）。
プロパティに `null` を代入するとそのキーを未指定に戻します（属性も外れます）。

### 属性の値の解釈

| 種類 | 属性の文字列 → 値 | プロパティ → 属性 |
|---|---|---|
| 真偽 | **属性なし＝未指定**。`""`・`"true"`・属性名と同じ値＝`true`。`"false"`＝`false`。それ以外は警告して未指定 | `true` → `attr=""`。`false` → `attr="false"`。`null` → 属性を外す |
| 数 | `Number(s)`。`""` は未指定。`NaN` は警告して未指定 | `String(n)` |
| 文字列 | そのまま。`""` は未指定 | そのまま |

真偽属性は有無でなく**値**で解釈します。設定ファイルの値を HTML から打ち消せるようにする
ためです（`north-up="false"`）。`<maplat-app north-up>` と書けば従来どおり `true` です。

### 属性と同期するキー

「起動時」の列が「はい」のキーは地図を作った後は変更できません
（[起動時だけ効くキー](#起動時だけ効くキー)）。

| 属性 | プロパティ | 型 | 起動時 | 起動後に変えたら | 旧 `appOption` |
|---|---|---|---|---|---|
| `app-id` | `appId` | string | はい | — | `appid`（既定 `"sample"`） |
| `app-src` | `appSrc` | string | はい | —（設定ファイルの URL。既定は `apps/${appId}.json`） | — |
| `map-id` | `mapId` | string | いいえ | `changeMap(mapId)`。使えない id は警告して属性を今の地図へ戻す。地図が替わると**書き戻される** | `restore.mapID` |
| `transparency` | `transparency` | number（0〜100） | いいえ | `setTransparency(n)`。透過度が変わると**書き戻される**（描画 1 回につき 1 回） | `restore.transparency` |
| `no-rotate` | `noRotate` | boolean | はい | — | `noRotate` |
| `north-up` | `northUp` | boolean | いいえ | 次の視点操作（`goHome`・`setViewpoint`）から効く | `northUp` |
| `home-margin-pixels` | `homeMarginPixels` | number | いいえ | 次の `goHome` から（既定 50。`0` も有効） | `homeMarginPixels` |
| `always-gps-on` | `alwaysGpsOn` | boolean | はい | — | `alwaysGpsOn` |
| `fake` | `fake` | boolean | はい | — | `fake` |
| `enable-cache` | `enableCache` | boolean | はい | — | `enableCache` |
| `restore-session` | `restoreSession` | boolean | はい | — | `restoreSession` |
| `overlay` | `overlay` | boolean | はい | — | `overlay` |
| `debug` | `debug` | boolean | いいえ | ログの段階を変える | `debug` |
| `icon` / `selected-icon` | `icon` / `selectedIcon` | string | いいえ | マーカーを描き直す | `icon` / `selectedIcon` |
| `no-center-marker` | `noCenterMarker` | boolean | いいえ | 中心の目印を消す。`ready` を待たずに DOM へ当たる | — |
| `center-marker-src` | `centerMarkerSrc` | string | いいえ | 中心の目印の画像を差し替える（class `maplat-center-marker--custom` が付く）。すぐに当たる | — |
| `hide-outside-pois` | `hideOutsidePois` | boolean | いいえ | 範囲外の POI を描かずにマーカーを描き直す（[範囲外の POI](#範囲外の-poi)） | `hideOutsidePois` |
| `display-mode` | `displayMode` | string | — | **MaplatCore-Pro 専用**（`supports("display-mode")`）。MaplatCore はキーごとに 1 回警告して無視し（`<maplat-app>: ignored unsupported attribute "display-mode"`）、プロパティは `undefined` を返す | — |

### プロパティのみのキー

| プロパティ | 型 | 起動時 | 起動後に変えたら | 旧 `appOption` |
|---|---|---|---|---|
| `setting` | object | はい | —（設定ファイルの中身そのもの。与えればファイルは読まない） | `setting` |
| `restore` | `Restore` | はい | — | `restore` |
| `restoreExtensionKeys` | `string[]` | はい | —（`restoreSession` で `localStorage` から読む拡張キー） | `restoreExtensionKeys`（この版で新設） |
| `googleApiKey` | string | はい | —（鍵はプロパティのみ。属性では受けない） | `googleApiKey` |
| `mapboxToken` | string | はい | — | `mapboxToken` |
| `maplibregl` / `mapboxgl` | ライブラリ | はい | —（既定は `window.maplibregl` / `window.mapboxgl`） | 同名 |
| `uiHooks` | object | はい | —（[`uiHooks`](#uihooks) を参照） | `uiHooks` |
| `appOption` | object | はい | —（移行用の口。下記） | 全体 |
| `poiTemplate` / `poiStyle` / `iconTemplate` | string | いいえ | マーカーを描き直す | 同名 |

起動後に反映されるキーの属性を外す（または `null` を代入する）と、次の経路の値に戻ります:
`appOption` の同名キー → （テンプレート類は）設定ファイル → 既定値。例外が 2 つあります:
`map-id` を外しても表示中の地図はそのまま、`transparency` を外すと透過度は 0 になります。

### 起動時だけ効くキー

`appId`・`appSrc`・`setting`・`noRotate`・`alwaysGpsOn`・`fake`・`enableCache`・
`restoreSession`・`overlay`・`googleApiKey`・`mapboxToken`・`maplibregl`・`mapboxgl`・
`uiHooks`・`restore`・`restoreExtensionKeys`・`appOption`
（`@maplat/core/common` の `ELEMENT_STARTUP_KEYS`）。

地図を作った後にこれらを変えると、属性でもプロパティでも**警告して無視**します
（キーごとに 1 回）:

```
<maplat-app>: attribute "app-id" is fixed at startup and cannot be changed after the map is created; the change was ignored.
```

プロパティは起動時に使った値を返し続けます。地図は作り直しません。アプリを替えるときは
要素を置き直してください。要素を外して付け直したときは、その時点のキーを読み直します。

### 属性への書き戻し

地図の側で変わった状態（UI の操作・メソッド・復元した状態）は、**属性を持つキーに限り**
属性へ書き戻します: `map-id`（`mapChanged` のたび。イベントを出す前に書くので、リスナは
`el.mapId` で新しい地図を読めます）・`transparency`（描画 1 回につき 1 回にまとめる。起動時に
`transparency="0"` が書かれます）・MaplatCore-Pro では `display-mode`。書き戻しは属性の変更
として扱いません（ループしません）。ページが変えて反映待ちのキーは書き戻しより優先します。
視点と GPS の状態は属性を持たないので、下のプロパティとイベントで読んでください。

### 要素が読まない設定ファイルのキー

設定ファイルは**コンテンツ**（`sources`・`pois`・`homePosition`・`defaultZoom`・`appName`・
`lang`・`splash`・`poiTemplate`・`poiStyle`・`iconTemplate` など）を持ちます。**プレゼンテーション
（機能）の設定**は設定ファイルでなく要素に与えます。要素は設定ファイルの `noRotate`・`northUp`・
`homeMarginPixels`・`tapDuration`・`tapUIVanish`・`controls` を読みません。残っているとキーごとに
1 回警告します:

```
<maplat-app>: the setting file key "northUp" is a presentation (feature) setting and is ignored; give it as an attribute or property of the element instead.
```

`fakeGps` / `fakeRadius` も読みません（警告なし。偽 GPS は `fake` だけで決まります）。

`MaplatApp` クラスは設定ファイルのこれらのキーを読み続けますが、次のメジャー版（2.0）で
廃止する旨を警告します。

### `appOption`（移行用の口）

`el.appOption = { … }` に旧 `appOption` を丸ごと渡せます。`appId` は `appid` の、`tapUiVanish`
は `tapUIVanish` の別名として受けます。中のキーは個別の属性・プロパティより弱く、`div` は
要素そのものに置き換わります。例外が 1 つあります: `appOption.setting`（設定ファイルの中身）は
属性 `app-src` より強いです（設定ファイルの場所の順が `setting` ＞ `app-src` ＞
`apps/${appId}.json` のため）。この口は次のメジャー版（2.0）で閉じます。`__` で始まるキーは
Maplat の内部用です。使わないでください。

## 状態（読み取り専用プロパティ）

- `ready: Promise<void>`
  - 地図の準備が済むと解決します。地図を作れなかったとき（例: `app-src` の読み込みに失敗
    `<maplat-app>: failed to load <url> (<status>)`）は reject します。要素を置き直したときだけ
    新しい Promise になります。
- `implementation: "core" | "core-pro"`
  - 実装名（このパッケージは `"core"`）。表示・記録に使い、分岐には `supports()` を使います。
- `version: string`
  - 実装の版（`@maplat/core` の版）。
- `appData: Readonly<object> | null`
  - 設定ファイルの中身（凍結した浅い複製）。`lifecycle:appdata-ready` から読めます。その前は `null`。
- `initialRestore: Readonly<Restore>`
  - 起動時に使った復元値（`restore`・`map-id`・`transparency`・`restore-session` の `localStorage`）。
- `state: Readonly<Restore>`
  - 現在の状態（旧 `stateBuffer` の複製）。変化は `updateState` で知ります。
- `currentMapId: string | null`
  - 表示中の地図の mapID。
- `viewpoint: Viewpoint | null`
  - 現在の視点（最後の `changeViewpoint` の detail）。
- `gpsEnabled: boolean`
  - GPS の追跡が有効か（`getGPSEnabled()` と同じ）。

## メソッド

### 委譲するメソッド（`MAPLAT_APP_METHODS`）

`MaplatApp` の公開メソッド 46 個は要素にも同名であり、地図へ委譲します。引数と挙動は
[`maplat-core.ja.md`](maplat-core.ja.md) のとおりで、違いは下に記します。

- 地図の中身ができる前に呼ぶと `DOMException`（`InvalidStateError`）を投げます:
  `<maplat-app>.changeMap(): the map is not created yet (…)`。文書につないでいないとき、
  `app-id`・`app-src`・`setting`・`appOption` のどれも無いとき、**そして文書につないだ直後の
  同じタスクの中**（中身は後のマイクロタスクで作られます）がこれに当たります。
  `await el.ready` の後に呼んでください。
- 地図を作っている途中（中身はあるが ready 前）に呼ぶと、`ready` を待ってから実行する
  Promise を返します。

| 区分 | メソッド |
|---|---|
| 地図の状態と制御 | `currentMapInfo(): object`・`mapInfo(mapID): object`・`changeMap(mapID, restore?): Promise<unknown>`・`requestUpdateState(partial: Partial<AppState>): void`・`getRotation(): number`・`getDirection(): Promise<number>`・`setViewpoint(cond)`・`goHome()`・`resetRotation()`・`resetDirection()`・`resetCirculation()`・`getMapMeta(mapID?): MapMeta \| undefined`・`setTransparency(percentage): void`（`transparency` 属性にも書き戻す）・`getTransparency(): number` |
| 座標系 | `clientPointToLngLat(clientX, clientY): Promise<{ longitude, latitude } \| null>`・`lngLatToClientPoint(longitude, latitude): Promise<{ x, y } \| null>` — クラスが `undefined` を返すところで要素は `null` を返す |
| マーカー | `addMarker(data, clusterId?)`・`removeMarker(id)`・`updateMarker(id, data, overwrite?)`・`clearMarker(clusterId?)`・`selectMarker(id)`・`unselectMarker()`・`getMarker(id): MaplatPoi \| undefined`・`showAllMarkers()`・`hideAllMarkers()` |
| ラインとベクター | `addLine(data): string`・`addVector(data): string`・`removeLine(id): boolean`・`removeVector(id): boolean`・`clearLine(filter?)`・`clearVector(filter?)` |
| POI レイヤ | `listPoiLayers(hideOnly?, nonzero?): PoiLayer[]`・`getPoiLayer(id): PoiLayer \| undefined`・`showPoiLayer(id)`・`hidePoiLayer(id)`・`addPoiLayer(id, data)`・`removePoiLayer(id)` |
| GPS | `handleGPS(enable, avoidEventForOff?)`（`gpsEnabledChanged` が出ることがある）・`getGPSEnabled(): boolean`・`setGPSMarker(position)` |
| タイルキャッシュ | `getMapCacheEnable(mapID?): boolean`・`getMapTileCacheStatsAsync(mapID?): Promise<{ size?, count?, total?, percent? }>`・`getMapTileCacheSizeAsync(mapID?): Promise<number>`・`clearMapTileCacheAsync(mapID?): Promise<void>`・`fetchAllMapTileCacheAsync(mapID, callback): Promise<void>`・`cancelMapTileCacheAsync(mapID?): Promise<void>` |

要素に無いもの: `mapObject`・`from`・`cacheHash`・`mapDivDocument`・`stateBuffer`・クラスの
`remove()`（要素の `remove()` は DOM 標準のもので、要素を外すことで地図を破棄します）・
クラスの内部メソッド（`setMarker`・`setLine`・`setVector`・`resetLine` など）。代わりに下の
要素固有のメソッドを使ってください。内部の `MaplatApp` を返す `app` getter は移行期の内部用の
逃げ道で、公開面ではなく、次のメジャー版（2.0）で消えます。

### 要素固有のメソッド（`ELEMENT_OWN_METHODS`）

- `getViewpoint(): Viewpoint | null`
  - 現在の視点（`viewpoint` プロパティと同じ）。地図の準備前は `null`。
- `listMaps(): MapListItem[]`
  - 使える地図を設定ファイルの `sources` の順で返します。各要素は `mapID`・`label`・
    `thumbnail`（`string | null`）・`isBasemap`・`isOldMap`・`isOverlay`・`hasEnvelope`・
    `cacheEnable` を持ちます。地図の準備前は `[]`。
- `supports(feature: string): boolean`
  - 機能の問い合わせ。地図の準備前でも答え、未知の名前は `false`。MaplatCore では
    `tile-cache`・`mapbox`・`pointer-move`・`envelopes` が `true`、`display-mode`・
    `display-mode:map-warp` が `false`。
- `setEnvelopes(items: EnvelopeSpec[]): void`
  - 地図の範囲を枠線と塗りで描きます:
    `{ mapID, stroke?: { color, width?, lineDash? }, fill?: string }`。現在の古地図は画像の 4 隅、
    それ以外の地図は `getMapEnvelope` の範囲で描きます。地図を切り替えると新しい地図の座標で
    描き直し、`[]` で消します。
- `getMapEnvelope(mapID: string): LngLat[] | null`
  - 地図の範囲（経緯度の多角形。最後の頂点は最初の頂点を繰り返しません）。範囲を持たない地図は `null`。
- `getViewExtent(): LngLat[] | null`
  - 画面の 4 隅（左上・右上・右下・左下）の経緯度。`changeViewpoint` のたびに更新します。
    最初の `changeViewpoint` の前や、4 隅を変換できないときは `null`。
- `zoomBy(delta: number): void`
  - 現在の地図の zoom を `delta` だけ変えます（250 ms のアニメーション）。
- `getDefaultPinIcon(selected?: boolean): string`
  - `icon` の無いマーカーに使う既定のピンの画像（`selected` が真なら選択中の画像）。
    地図の準備前でも答えます。

Pro 専用のメソッド（`setDisplayMode`・`getDisplayMode`）は MaplatCore の要素には
**定義されていません**。呼ぶ前に `supports("display-mode")` で確かめてください。

## イベント（`MAPLAT_APP_EVENTS`・`ELEMENT_OWN_EVENTS`）

すべて要素から出る DOM の `CustomEvent` で、`bubbles: true`・`composed: false`・
`cancelable: false` です。名前は `MaplatApp` クラスと同じなので、既存のリスナは名前を
変えずに移せます。detail の型は `@maplat/core/common` から export しています
（`MaplatAppEventDetailMap`・`MaplatAppEvent<K>`）。

| イベント | `detail` | 契機 |
|---|---|---|
| `lifecycle:setting-loaded`・`lifecycle:appdata-ready`・`lifecycle:ui-configure`・`lifecycle:core-dom-ready`・`lifecycle:ui-dom-ready`・`lifecycle:core-ready`・`lifecycle:ui-ready` | `{ phaseId, appData }` — クラスのイベントにある内部の `core`・`mapDivDocument`・`uiHookResults` は**載せない** | ライフサイクルの各段階（旧と同順） |
| `lifecycle:error` | `{ phaseId, error }` | `uiHooks` の hook が失敗した |
| `sourceLoaded` | `{ mapID: string \| null; usable: boolean }[]`（クラスは source オブジェクトの配列） | source の読み込み直後（落ちた source を含む） |
| `mapChanged` | `MapMeta`（`mapID`・`label`・`title`・`license` …） | 地図の切り替えの完了（`map-id` は書き戻し済み） |
| `changeViewpoint` | `Viewpoint`（`x`・`y`・`longitude`・`latitude`・`mercator_x`・`mercator_y`・`zoom`・`mercZoom`・`direction`・`rotation`） | 視点が変わった |
| `updateState` | `AppState`（= `Restore`） | 状態が変わった（間引きあり） |
| `outOfMap` | `{}` | 地図の範囲外へ出た |
| `poi_number` | `number` | 表示中の POI の数が変わった |
| `clickMarker` / `clickMarkers` | `MaplatPoi` / `MaplatPoi[]`（`clickMarkers` は直後に同期で出る。その点に重なる全マーカー） | マーカーのクリック |
| `clickMap` / `clickMapXy` / `clickMapMerc` | `{ longitude, latitude }` / `[x, y]` / `[mx, my]` | 地図のクリック |
| `pointerMoveOnMapXy` / `pointerMoveOnMapMerc` | `[x, y]` / `[mx, my]` | ポインタの移動 |
| `gps_request` / `gps_result` / `gps_error` | なし / `{ lnglat, acc } \| { error }` / エラー名 | GPS |
| **新** `gpsEnabledChanged` | `{ enabled: boolean }` | `gpsEnabled` が変わった（内部の切り替えを含む） |
| **新** `moveStart` / `moveEnd` | `{}` / `Viewpoint \| null` | 視点の連続変化が始まった／止まって 150 ms たった |

MaplatCore-Pro は `modechange`・`viewchange` も出しますが、MaplatCore は出しません。

## `uiHooks`

`el.uiHooks`（または `appOption.uiHooks`）はクラスと同じ hook オブジェクト
（`onSettingLoaded` 〜 `onUiReady`）を受けます。要素の経路では hook の `context.core` **と**
`context.mapDivDocument` が**要素**になります（`MaplatApp` のインスタンスや入れ物の `div`
ではありません）。hook オブジェクトは書き換えません（hook の中の `this` は元のオブジェクト）
ので、同じオブジェクトをクラスの経路に渡せば、そちらでは `context.core` は `MaplatApp` のままです。

## POI テンプレートの記法

`poiTemplate`・`iconTemplate`（`<maplat-app>`・`MaplatApp`・設定ファイル・POI の層に与えるもの）は、
**@maplat/core 1.3.0** から Quyuan の `@c4h/quyuan/template` を通して
[Nunjucks](https://mozilla.github.io/nunjucks/templating.html) で評価します。1.2 までは lodash.template で
評価していました。その記法は**評価しません**（下の「旧い記法の検出」）。テンプレートの変数は POI の属性です。

| lodash.template（1.2 まで） | Nunjucks（1.3 から） | 注意 |
|---|---|---|
| `<%= name %>`（エスケープなし） | `{{ name \| safe }}` | 1.3 の `{{ name }}` は HTML エスケープする。HTML を出したいときだけ `\| safe`（UI 側の `sanitizeHtml` は従来どおり掛かる） |
| `<%- name %>`（HTML エスケープ） | `{{ name }}` | |
| `${name}`（ES の埋め込み。lodash は既定でこれも評価していた） | `{{ name }}` | |
| `<% if (a) { %>…<% } else { %>…<% } %>` | `{% if a %}…{% else %}…{% endif %}` | |
| `<% list.forEach(x => { %>…<%= x %>…<% }) %>` | `{% for x in list %}…{{ x }}…{% endfor %}` | |
| `!a`・`a && b`・`a \|\| b` | `not a`・`a and b`・`a or b` | |
| `typeof a === "string"` | `a is string` | `is number`・`is defined` も使える |
| `name.ja` | `name.ja`（同じ） | 無いキーは空文字 |
| `<% var x = …; %>` | `{% set x = … %}` | |
| `iconTemplate` の `"icon": "<%= url %>"` | `"icon": {{ url \| dump \| safe }}` | **`iconTemplate` は JSON を作る ∴ `dump`＋`safe` を勧める**。`"{{ url }}"` は `&`・`"`・`<` を含む URL を壊す |
| 任意の JS | フィルタ（`dump`・`lower`・`replace` など）で書く | JS は記法に無い。ただし Nunjucks はサンドボックスではなく抜け道がある ∴ 信頼できないテンプレートを評価しない（下の注意） |
| `<%`・`%>`・`${`…`}` を文字として出したい | `{% raw %}…{% endraw %}` で囲む | 囲まないと下の検出に当たり評価されない |
| （新規）POI の情報窓でスライダー | `<qy-swiper><qy-swiper-slide image-url="{{ … }}" image-type="image" caption="{{ … }}"></qy-swiper-slide></qy-swiper>` | 1.3 から。`sanitizeHtml` が許す属性だけ残る |

### 旧い記法の検出

テンプレートの文字列ごとに、評価の前に次を判定します。

```text
S      = テンプレートの文字列から {% raw %}…{% endraw %}・{% verbatim %}…{% endverbatim %} の中身を取り除いたもの
旧い記法 = S に /<%[\s\S]*?%>/ が当たる（<% %>・<%= %>・<%- %>）
         または S に /\$\{[^}]*\}/ が当たる（${ }）
```

- 旧い記法のテンプレートは**評価しません**（Nunjucks にも lodash にも渡しません）。そのテンプレートは
  無いものとして扱います: `poiTemplate` なら次の段（層・地図・アプリ）へ進み（その段の `poiStyle` も使いません）、
  `iconTemplate` なら同じ段の `icon` を使うか、無ければ次の段へ進みます。
- ページで **1 回だけ** `console.warn` で、最初に見つかったテンプレート（先頭 80 文字）を知らせます。
- 評価できないテンプレート（記法の誤り、出力が JSON のオブジェクトにならない `iconTemplate`）も同じ扱いで、
  別の文面の `console.warn` を 1 回だけ出します。地図の描画は止まりません。
- `<%`・`${` を文字として出したいときは、その部分を `{% raw %}…{% endraw %}` で囲みます
  （例: `{% raw %}<p>${price}</p>{% endraw %}`）。
- 検出に当たらないまま表示が変わる場合が 1 つだけあります: lodash の記法を含まず、`{{ }}`・`{% %}` を
  文字として書いていた旧いテンプレートは、1.3 から Nunjucks として評価されます。

**Nunjucks はサンドボックスではありません。** 値（POI の名前・説明など）から `{{ }}` を通してコードを
注入することはできませんが、テンプレートの文字列そのものを第三者が書ける構成では、引き続きページの権限で
コードが動きえます。信頼できない POI・地図のデータのテンプレートは使わないでください。

### 情報窓のスライダー

**@maplat/core 1.3.0** から、`sanitizeHtml` がテンプレートの出力で 2 つの要素を残すので、
`poiTemplate` でマルチメディアのスライダー（[Quyuan](https://github.com/code4history/Quyuan)）を出せる:

```html
<qy-swiper has-thumb>
  {% for m in media %}
  <qy-swiper-slide image-url="{{ m.url }}" image-type="image" caption="{{ m.caption }}"></qy-swiper-slide>
  {% endfor %}
</qy-swiper>
```

| 要素 | 残る属性 | 値の検査 |
|---|---|---|
| `<qy-swiper>` | `has-thumb`・`autoplay` | 真偽値: 値は捨てる（`has-thumb=""`） |
| `<qy-swiper-slide>` | `image-url`・`thumbnail-url`・`material-url` | URL: 相対パス・`/…`・`//…`・`http(s):` だけ。値に引用符・バッククォート・`<`・`>`・空白があれば落とす |
| | `caption` | テキストにする（値の中の HTML を取り除く） |
| | `image-type`・`camera-position`・`camera-target`・`show-texture` | そのまま残す |
| | `fit-to-container`・`debug-mode` | 真偽値: 値は捨てる |

- POI の `media` と同じ検査である。この 2 つの要素の上のほかの属性（`class`・`style`・`on*` など）は
  落とし、これらの属性名をほかの要素には残さない。
- **テンプレートの真偽値の属性は、値によらず「あれば真」**: `fit-to-container="false"` も真になる
  （HTML と要素の読み方に合わせた）。POI の `media` では、真偽値の鍵は値が truthy のときだけ書き出す。
- `cc-swiper`・`cc-swiper-slide`・`qy-viewer`・`cc-viewer` は使えない（要素は落ち、中の文字は残る）。
  `qy-swiper`・`qy-swiper-slide` を使うこと。
- スライダーの表示には、要素を登録する **@maplat/ui 1.3 以降**が要る。@maplat/core 自身は登録しない。

## 範囲外の POI

前面の地図の範囲の外にある POI も、置き場所があれば描きます。判定は `setMarker` と同じです:
メルカトルの `coordinates` か経緯度で与えた POI は、前面の地図がその地点を自分の座標に
写せないとき範囲外、画素の `x`・`y` で与えた POI は範囲外では描きません（メルカトルの
位置が分からないため）。

| 前面 | 範囲内 | 範囲外 |
|---|---|---|
| 古地図（背面の地図 `backMap` がある） | 前面の `marker` 層 | 背面の `marker` 層にメルカトルの座標で |
| TMS・`envelope` を持つ基本地図 | 前面の `marker` 層 | 前面の `marker` 層にメルカトルの座標で（前面の座標がメルカトル） |
| 古地図で `overlay="false"`（背面が無い） | 前面 | 描かない |
| `hide-outside-pois` が真 | 前面 | 描かない |

範囲外の POI の見た目は範囲内と同じです（同じアイコンの決め方 `createIconSet`・選択中は
`selectedIcon`・既定のピン）。マーカーの層の入れ替えは 1 回で行うので、地図を切り替える
途中で前面と背面の片方だけが空になる時間はありません。

**背面のピンを押すとき。** クリックはまず前面を今までどおり見ます。そこで当たらず、背面の
地図があり、押した点が古地図の紙の外（その点について `insideCheckSysCoord` が偽）のとき
だけ、背面の `marker` 層も見ます。当たれば前面と同じ形の `clickMarker`（先頭の POI）・
`clickMarkers`（全部）で終わります。どちらでも当たらなければ、今までどおり `clickMapXy`・
`clickMapMerc`・`clickMap` で終わります。紙が覆っている点では、透過度によらず背面のピンは
押せません。マウスのカーソルも同じ順・同じ条件で見ます。

**範囲外の POI を選んでいる間。** `selectMarker(id)` は、ピンが紙の外にあっても地図の中心を
そのピンへ寄せます。その POI を選んでいる間は地図を紙の内側へ引き戻さないので、中心は紙の
外に居られます。`unselectMarker()` で選択を外すと、その処理の直後に中心が紙の内側の
いちばん近い点へ戻ります。範囲外の POI を選んでいる間は、GPS の位置が届いても中心は
動きません。地図を切り替えると、選択は切り替え先の地図に合わせて決まります: 切り替え先に
その POI が無ければ選択を外して中心を紙の内側へ引き戻し、範囲内になったなら普通の選択と
して続け、まだ範囲外なら中心をそのピンに据えたままにします（`outOfMap` は出しません）。
範囲内の POI の扱いは今までどおりです。

`hide-outside-pois` は描画を止めます。ほかの真偽値の属性と同じ読み方で（[属性の値の解釈](#属性の値の解釈)）、
起動後にも変えられ、変えるとマーカーを描き直します。旧 `appOption.hideOutsidePois` と同じ
フィールドに書きます。

## `@maplat/core/common` — 別の実装のための共通の土台

`@maplat/core/common`（`dist/maplat_core_common.js`）は地図エンジンに依らない部分を集めた
入口です。OpenLayers もタイルキャッシュも import せず、要素も登録しません。層 A の別の実装や、
`<maplat-app>` の上の層 B の要素を書くときに使います。

- 名前の表: `MAPLAT_APP_TAG`・`MAPLAT_APP_EVENTS`・`ELEMENT_OWN_EVENTS`・`LIFECYCLE_PHASES`・
  `MAPLAT_APP_METHODS`・`ELEMENT_OWN_METHODS`・`LAYER_A_PRO_METHODS`・`LAYER_A_PRO_EVENTS`・
  `LAYER_A_STATE_PROPERTIES`・`ELEMENT_ATTRIBUTES`・`ELEMENT_PROPERTIES`・`LAYER_A_PRO_ATTRIBUTES`・
  `LAYER_A_PRO_PROPERTIES`・`ELEMENT_STARTUP_KEYS`・`APP_OPTION_ALIASES`・`LAYER_A_FEATURES` /
  `LAYER_A_FEATURE_NAMES` / `featuresOf(implementation)`、層 B の表
  `MAPLAT_UI_TAG`・`MAPLAT_UI_ATTRIBUTES`・`MAPLAT_UI_EVENTS`・`MAPLAT_UI_METHODS`。
- 値の補助: `parseAttributeValue`・`formatAttributeValue`・`propToAttributeName`・
  `attributeToPropName`・`unsupportedKeyMessage`。
- 型: `MaplatAppElement`・`MaplatUiElement`・`Viewpoint`・`MapMeta`・`MapListItem`・
  `Restore` / `AppState`・`EnvelopeSpec`・`MaplatPoi`・`PoiLayer`・`MaplatAppEventDetailMap` …と
  型ガード（`isViewpoint`・`isMapMeta`・`isMapListItem`・`isMaplatPoi`・`isPoiLayer`・
  `isSourceLoadedDetail`・`isLifecycleDetail`・`isLngLat`）。
- 要素の殻: `MaplatAppElementBase`（抽象クラス）・`defineMaplatAppElementOnce(ctor, tagName?, label?)`・
  `injectMaplatAppStyle(document)`、型 `LayerAImplementation`・`ElementStartupConfig`・
  `RuntimeValueResolver`・`MaplatAppElementProSettings`。
- 補助関数。`@maplat/core` からも export しているもの: `sanitizeHtml`・`escapeAttr`・
  `toPlainText`・`buildSlideAttrs`・`createElement`・`assets`。`@maplat/core/common` だけが
  export するもの: `normalizeArg`・`META_KEYS`・`META_KEYS_OPTION`。

`@maplat/core/element` 自身は、要素のクラス `MaplatAppElement`・`defineMaplatAppElement(tagName?)`
（別のタグ名で登録する。既定のタグは import で登録済み）・要素が使う上記の名前の表・非推奨の
型の別名 `MaplatViewpoint` / `MaplatMapListItem`（`@maplat/core/common` の `Viewpoint` /
`MapListItem` を使う）を export しています。

層 A の実装は `MaplatAppElementBase` を継承します。基底クラスが属性・プロパティの表、作成と
破棄、イベントの出し直し、起動時キーの固定、46 の委譲メソッドを持っているので、派生クラスは
`implementation`・`version`・`features()`・`createImplementation(config)`（`MaplatApp` と同じ形の
オブジェクト＝`waitReady`・`addEventListener`・`removeEventListener`・委譲メソッド・`appData`・
`stateBuffer` …を返す）・`listMaps`・`setEnvelopes`・`getMapEnvelope`・`getViewExtent`・`zoomBy`・
`getDefaultPinIcon` を与え、必要なら hook（`applyRuntimeChanges`・`convertEventDetail`・
`onImplementationReady`・`disposeImplementation`・`applyDomKeys` …）を上書きします。登録は
`defineMaplatAppElementOnce(MyElement, "maplat-app", "my package")` で行います。

## `@maplat/core/conformance` — 層 A の適合テスト

`@maplat/core/conformance`（`dist/maplat_core_conformance.js`）は、層 A の共通のテスト群を
**どの** `<maplat-app>` 実装にも公開面だけを通して流す道具と、地図を持たない模擬の実装
（層 B の要素のテスト用）を提供します。

- `runLayerAConformance(options, { describe, it })`
  - テストランナー（Vitest・Jest など）にテストを登録します。
- `runLayerAConformanceInPage(options, onResult?): Promise<ConformanceResult[]>`
  - ページの中で（ブラウザのテストで）流し、`{ group, name, ok, error?, ms }[]` を返します。
- `createLayerAConformanceCases(options): ConformanceCase[]`
  - 生のテスト（`{ group, name, run() }`）。他のランナー向け。
- `options: LayerAConformanceOptions`
  - `implementation`（期待する値）・`register`（要素を登録する関数。複数回呼ばれる）・
    `fixture: { attributes?, properties?, initialMapId, otherMapId, envelopeMapId? }`、任意の
    `tagName`・`expectedFeatures`・`capabilities: { layout? }`・`timeout`。
- `ConformanceError`
  - 失敗したテストが投げるエラー。
- 模擬の層 A: `defineMockMaplatApp(tagName?, options?)`・`createMockMaplatAppClass(options?)`・
  `getMockLayerAController(el)`・`MockLayerAApp`、型 `MockSource`・`MockLayerAOptions`
  （`{ implementation?, version?, features? }`）。

```typescript
import { describe, it } from 'vitest';
import { runLayerAConformance } from '@maplat/core/conformance';

runLayerAConformance(
  {
    implementation: 'core',
    register: () => import('@maplat/core/element'),
    fixture: { attributes: { 'app-id': 'morioka' }, initialMapId: 'morioka_ndl', otherMapId: 'morioka' },
  },
  { describe, it },
);
```

## `MaplatApp` クラスとの関係

1.x の `@maplat/core` は `MaplatApp` クラスと要素の両方を公開し、実装は 1 つです。クラスは
引き続き使えます。この版でクラスに入った変更は (1) 起動時だけ効くフィールド（`appid`・
`enableCache`・`noRotate`・`alwaysGpsOn`・`overlay`・`googleApiKey`・`restoreSession`・
`initialRestore`・`uiHooks` など）への構築後の代入は警告して無視する、(2) 設定ファイルの機能系
キーを読むと廃止の警告を出す、の 2 つです。また `appOption.div` に要素を渡せるようになり、
`appOption.restoreExtensionKeys` を受けます。クラスは非推奨で、**次のメジャー版（2.0）で
閉じ**、要素の API だけが残ります。MaplatCore-Pro は要素の API だけを提供します。

| `MaplatApp` クラス | `<maplat-app>` |
|---|---|
| `new MaplatApp({ div, appid, … })` / `MaplatApp.createObject(option)` | `<maplat-app app-id="…">`＋属性・プロパティ。`await el.ready` |
| `app.waitReady` | `el.ready` |
| `appOption.div` | 要素そのもの |
| `app.addEventListener(name, fn)`（OpenLayers の `EventTarget`） | `el.addEventListener(name, fn)`（DOM。同じ名前） |
| `app.remove()` | 要素を DOM から外す |
| `app.appData`（書ける） / `app.stateBuffer` / `app.initialRestore` | `el.appData`（凍結） / `el.state` / `el.initialRestore` |
| `app.from.mapID` / `app.cacheHash` / `app.mapObject` | `el.currentMapId` / `el.listMaps()` / 要素固有のメソッド |
| `appOption.uiHooks`（`context.core` は `MaplatApp`） | `el.uiHooks`（`context.core` は要素） |
| `sourceLoaded` の detail: source オブジェクトの配列 | `{ mapID, usable }[]` |
| 起動時だけ効くフィールドへの構築後の代入: 警告して無視 | 同じ（属性でもプロパティでも） |
| 設定ファイルの機能系キー: 読む（廃止の警告つき） | 読まない（警告つき） |
