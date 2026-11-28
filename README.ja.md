<!-- SECTION 1: Header (logo, badges, title) -->
<h1 align="center">MaplatCore</h1>

<p align="center">
  <a href="https://github.com/code4history/MaplatCore/actions/workflows/test.yml"><img src="https://github.com/code4history/MaplatCore/actions/workflows/test.yml/badge.svg" alt="CI" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/@maplat/core" alt="License" /></a>
</p>

<!-- SECTION 2: Elevator Pitch -->
## MaplatCore について

MaplatCore は Maplat 古地図/絵地図ビューアのコアライブラリです。
各地図の座標を非線形かつ同相な投影で変換し、元の地図を歪めることなく
GPS/正確な地図との連携を実現します。これを用いたエンドユーザー向け
ビューアは [Maplat](https://github.com/code4history/Maplat)、
データ作成ツールは
[MaplatEditor](https://github.com/code4history/MaplatEditor) です。

MaplatCore は Apache License 2.0（バージョン 0.13.2 以降）のオープンソース
プロジェクトです。

<!-- SECTION 3: Language switch link -->
**[英語版はこちら / Read this document in English](README.md)**

<!-- SECTION 4: Key Features -->
## 主な特徴

- 非線形かつ同相な座標変換による古地図/絵地図ビューア API
- 元の地図を歪めず GPS/正確な地図と連携
- プラグイン可能なベースマップ（OpenLayers ベース・ベクタータイル用途に
  Mapbox GL JS / MapLibre GL JS をオプションで対応）
- イベント駆動の POI / ライン / レイヤー管理
- オープンソース（Apache 2.0・バージョン 0.13.2 以降）— Maplat エコシステムの一部

<!-- SECTION 5: Quick Start -->
## クイックスタート

<!-- release-pinned:start -->
> **現在のリリース: `1.2.0`**。このブロックは本リポジトリで唯一
> リリース版数を持つ場所です。ブロックの外はすべて 1.0 正式版を前提に
> 書かれています。
> npm: [`@maplat/core`](https://www.npmjs.com/package/@maplat/core)
> [![npm](https://img.shields.io/npm/v/@maplat/core)](https://www.npmjs.com/package/@maplat/core)

### インストール

```bash
# pnpm（推奨）
pnpm add @maplat/core

# npm
npm install @maplat/core
```

### 最小利用例

```typescript
import { MaplatApp } from '@maplat/core';
import 'ol/ol.css'; // 必須: OpenLayers CSS

const option = {
  startFrom: 'gsi',
};

MaplatApp.createObject(option).then((app) => {
  console.log('Maplat initialized', app);
});
```

### Custom Element `<maplat-app>`

同じ地図を Custom Element としても使えます。`@maplat/core/element` を一度 import
（タグを登録します）してタグを書けば、要素そのものが地図の入れ物になり、`MaplatApp` の
メソッドとイベントは要素の上にあります。

```typescript
import 'ol/ol.css';
import '@maplat/core/element';
```

```html
<maplat-app app-id="morioka"></maplat-app>
<script type="module">
  const el = document.querySelector('maplat-app');
  await el.ready;
  el.addEventListener('mapChanged', (e) => console.log(e.detail.mapID));
</script>
```

属性・プロパティ・メソッド・イベント、共通の土台 `@maplat/core/common`、POI テンプレートの評価
`@maplat/core/template`、適合テスト `@maplat/core/conformance` は [`docs/api/maplat-app.ja.md`](docs/api/maplat-app.ja.md)
を参照してください。`MaplatApp` クラスは 1.x の間そのまま使え、次のメジャー版（2.0）で閉じます。

### CDN（jsDelivr）

ブラウザでバンドラーを使わずに直接利用する場合は、MaplatCore より先に
OpenLayers を読み込む必要があります。

```html
<!-- OpenLayers -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@10/ol.css">
<script src="https://cdn.jsdelivr.net/npm/ol@10/dist/ol.js"></script>

<!-- MaplatCore -->
<script src="https://cdn.jsdelivr.net/npm/@maplat/core@1.2.0/dist/maplat_core.umd.js"></script>

<div id="map_div"></div>
<script>
  var option = {
    startFrom: 'gsi',
    div: 'map_div',
  };
  MaplatApp.createObject(option).then(function (app) {
    console.log('Maplat initialized', app);
  });
</script>
```

※最新の互換バージョンを使用してください。

### POI 仕様（`setting.pois`）

地図/アプリ設定の `pois` フィールドは複数の歴史的形式を受け付けます。
既存形式はすべて後方互換でそのまま動作します。新たに **レイヤ参照
（ラッパー）** 形式を追加し、レイヤ本体の FeatureCollection を編集せずに
レイヤ単位の表示上書き（`hide` / `title` / `icon` / `selectedIcon`（選択時アイコン））を
アプリ側から与えられるようにしました。

| 形式 | 形 | 挙動 |
|---|---|---|
| URL 文字列 | `"pois/x.geojson"` | fetch して正規化（既存） |
| インライン FC | `{ type: "FeatureCollection", ... }` | そのまま正規化（既存） |
| FC 配列 | `[FC, FC, ...]` | 各 FC が `id` を key にレイヤ化（既存） |
| POI オブジェクト配列 | `[{lng, lat, name}, ...]` | 単一 `main` レイヤ（既存） |
| 旧レイヤ辞書 | `{ "<key>": <cluster>, ... }` | 各値を正規化（既存） |
| **レイヤ参照（ラッパー）— 配列要素** | `{ layer: <URL\|FC>, hide?, title?, icon?, selectedIcon? }` | `layer` を fetch/解決し FC を正規化した上で、上書きを結果 cluster へ合成 |
| **レイヤ参照 — `pois` 全体** | `{ layer: <URL\|FC>, hide?, title?, icon?, selectedIcon? }`（**上書きキー1つ以上必須**） | 同じ合成を FC `id` を key に行う。上書きキーがない場合は旧レイヤ辞書（key=`"layer"`）として扱い後方互換を保つ |

上書きのセマンティクス:

- 上書きキー4つのみ受理。未知キーは **`console.warn` で破棄**（throw しない・forward 互換）。
- `hide: true`（真偽値 true のみ）が `cluster.hide = true` を設定。`hide:false` / 非真偽値は無視（データ側の値が残る）。
- `title`（非空文字列、または空でない多言語オブジェクト）は `cluster.name` へ。
- `icon` / `selectedIcon`（非空文字列のみ）は `cluster.icon` / `cluster.selectedIcon` へ。
- 上書きは同名の `FeatureCollection.properties` より **優先** される。
- cluster 内部キー（`pois` / `id` / `namespaceID` / `__nextId`）はラッパーから上書き不能（上書きキーに含まれない）。
- 入力オブジェクトは **破壊しない**。

プログラマティックな表面は `src/normalize_pois.ts`（`isPoiLayerRef` /
`PoiLayerRef`）を参照してください。

### 帰属とライセンス（`attr` / `dataAttr`）

地図メタデータは、帰属とライセンスを独立した 2 系統で保持します。ひとつは
**地図画像**そのもの、もうひとつは**データ**（対応点・POI などの派生データ）に
対するものです。スキャンした地図原図と、その上に構築した位置合わせデータとで
権利者が異なるのが通常であるため、両者を分けて持ちます。

| フィールド | 型 | 意味 |
|---|---|---|
| `attr` | `string` または `{ <lang>: string }` | **地図画像帰属** — 地図画像のクレジット先 |
| `dataAttr` | `string` または `{ <lang>: string }` | **データ帰属** — データのクレジット先 |
| `license` | `string` | **地図画像ライセンス** |
| `dataLicense` | `string` | **データライセンス** |
| `licenseNote` | `string` または `{ <lang>: string }` | `license` の自由記述の補足 |
| `dataLicenseNote` | `string` または `{ <lang>: string }` | `dataLicense` の自由記述の補足 |

`attr` / `dataAttr` は多言語オブジェクトを受け付けるため、ビューアの言語ごとに
クレジット文言を変えられます。`license` / `dataLicense` は単なる文字列であり、
列挙型ではありません（ライブラリは与えられた文字列をそのまま保持・表示します）。
実運用では次の 2 つが慣例値として使われます。

- `"ODbL"` — ODbL (Open Database License)
- `"Custom"` — カスタムライセンス。実際の条件は `licenseNote` /
  `dataLicenseNote` に書きます

同梱ベースマップの定義（`src/source_ex.ts`）に両方の実例があります。
OpenStreetMap は `attr: "©︎ OpenStreetMap contributors"` に対して
`license: "Custom"` / `dataLicense: "ODbL"`、地理院地図は両方とも `"Custom"` と
した上で `licenseNote` に条件を明記しています。

これらの値を UI から選ばせるのはデータ作成ツール（MaplatEditor）の責務です。
MaplatCore はフィールドの意味の定義と、結果として得られるクレジットの描画のみを
受け持ちます。

#### 地図の上の出典の表示

同梱の背景地図のタイルの提供元は、タイルを表示しているあいだ画面に出典を出すことを
求めています（OpenStreetMap: 地図の近くに「© OpenStreetMap contributors」。
地理院タイル: 表示しているあいだ出典を画面に出す）。そのため MaplatCore は、描いている
現代の地図の出典を、地図の右下の小さな表示（`div.maplat-attribution`）に出します。

- 前面の背景地図（`osm`・`gsi`・`gsi_ortho`、またはアプリの設定で定義した背景地図）
- タイルの重ね地図（`maptype: "overlay"`）と、その下の背景地図
- 前面が古地図のときの、背面の背景地図

出典は箱を分けて出します。いちばん下が背景地図の出典の箱（Google の地図なら、Google Maps のロゴと
Google の copyright の行）、その上が重ね地図の出典の箱です。箱をまたいで「 | 」でつなぐことはしません。

ビューアが出す出典は、「地図の定義の `attr`」と「提供元の申告」の 2 つだけです。提供元の申告として読むのは、
2 つの型の source だけです。Google の地図が Map Tiles API から受け取る copyright と、OpenLayers の `TileJSON` の
source の、TileJSON に書かれた `attribution`（その値だけ）です。Core が今作る source で提供元の申告を持つのは、
Google の地図だけです。TileJSON は、アプリが `TileJSON` の source を渡したときの扱いです。TileJSON は提供元の
サーバーから取ることも、アプリが直接（`tileJSON` の項目で）渡すこともでき、後者ではアプリが書いた値になります。
ライブラリの既定値では埋めません。OpenLayers の `OSM`・`StadiaMaps`・`BingMaps` などの source が持つ既定の
出典や、source を作るときに渡した `attributions` は出しません。`attr` も提供元の申告も無い地図には、
何も出しません。Google の地図は、`attr` の有無によらず、
表示範囲の copyright を Map Tiles API から取りに行って必ず出します（利用条件が copyright を
全文で出すよう求めるため）。Google の地図に `attr` を書くと、Google の copyright の行の上の別の箱に出します。**アプリの設定で背景地図や重ね地図を自分で
定義するときは、`attr` を書いてください**。書かないと、その地図の出典は出ません（ビューアは既定値で埋めません）。
空や空白だけの `attr` は、無いものとみなします。

Google の地図（`maptype` が `google`・`google_roadmap`・`google_satellite`・`google_hybrid`・
`google_terrain` の地図）を表示しているあいだは、[Map Tiles API の利用条件](https://developers.google.com/maps/documentation/tile/policies)
に従い、Google の出典（copyright）の左隣に Google Maps のロゴを出します。前面が古地図で背面が Google の地図の
ときも出します。ほかの出典（重ね地図の出典と、Google の地図に書いた `attr`）は、Google の出典と区別できるよう、
別の箱にして、ロゴと Google の出典の行の上に出します（利用条件は、第三者の出典を Google の出典とはっきり
分けるよう求めています）。

- ロゴは Google の公式の配布物の SVG を原寸（105×22 px）で、手を加えずに出します。地図には白い枠の灰色の
  ロゴ、衛星写真（`google_satellite`・`google_hybrid`）には濃い枠の白いロゴを使います。周りに上・左右 10 px、
  下 5 px の余白を取り、出典の文字には重ねません。読み上げの名前は「Google Maps」です。
- 出典の文字がロゴの右に入らないときは、文字をロゴの下の行へ折り返します。出典の表示に使える幅が
  125 px（ロゴと左右の余白）より狭いときだけ、ロゴの代わりに文字「Google Maps」を出典の先頭に出します。
  地図の要素の大きさが変わると決め直します。
- 状態は `div.maplat-attribution` の `data-google-maps`（`logo` か `text`。Google の地図が無いときは属性なし）
  で読めます。ロゴの要素は `.maplat-attribution-google-logo` です。
- **ロゴを CSS で隠したり、大きさ・色を変えたりしないでください。** 利用条件に反します。位置は出典の表示と
  一緒に、下の CSS の変数で動かせます。
- ロゴの大きさは CSS の px で決めています。`<meta name="viewport" content="width=device-width">` の無いページを
  スマートフォンで開くと、ページ全体が縮んで表示され、ロゴも物理的に小さくなります。

同じ文字列は 1 回だけ出します。地図を切り替えたとき、`lang` 属性が変わったとき、
OpenLayers の source の出典が変わったとき（Google の表示範囲が変わったときなど）、および
`<maplat-ui>` が定義されたとき（1 回だけ）に作り直します。言語は `<maplat-ui>` と同じ順で
決めます。`<maplat-ui>` の中では、その要素が定義済みのときはその今の言語、それ以外では、地図の要素の `lang` 属性 → 最も近い `<maplat-ui>` の `lang` 属性 →
`appOption.lang` → アプリの設定の `lang` → 祖先の `lang` 属性（`<html lang>` など）→
ブラウザの言語 → `en` の順です。多言語の `attr` からの選び方も UI と同じ（その言語 → `en`
→ 最初の値）です。古地図の `attr` はここには出さず、今までどおり UI の地図情報に出します。
値は `sanitizeHtml` を通すので、`attr` にリンクを書けます。表示はリンクを除いて操作を受けません
（下の地図へ通します）。

Google の copyright 以外の箱は、2 行までにします（`.maplat-attribution-clamp`）。長い出典は 2 行目まで
折り返し、それを超えた分は「…」で切ります。箱は 2 行の高さと地図の幅を超えないので、長い出典で地図が
覆われたり、地図全体がリンクになったりはしません。箱の中では、段落・表・箇条書き・`pre` などのブロックを
行の中の文字として並べ、画像は 1 行の高さまで縮めます（切った所に「…」が付くようにするため）。これは
`attr` にも、提供元の申告にも当てます。

切った出典の全文は、UI の地図情報などで見せることを想定しています。ただし、今の版の `<maplat-ui>` の
地図情報は、今の地図のメタデータしか出しません。重ね地図を出しているときの下の背景地図の `attr`、古地図の
背面の背景地図、提供元の申告は、そこには出ません。表示中の地図それぞれの出典を出す UI の直しは、別に進めています。
提供元の申告は、`<maplat-app>` の `providerAttributions`（地図ごとの値）で読め、値が変わったことは事象
`attributionChanged` で分かります（MaplatCore の要素だけの口。`docs/api/maplat-app.ja.md`）。

Google の copyright は、利用条件が "in full as provided" で出すよう求めるため、切らずに全文を
必要なだけ折り返して出します。

提供元の申告（Google の copyright、TileJSON の `attribution`）は、
第三者のサーバーから来うる値なので、`attr` より狭い許可表（`sanitizeHtml(text, { profile: "iiif" })`）で
洗います。残すタグは `a`・`b`・`br`・`i`・`p`・`small`・`span`・`sub`・`sup` だけ、属性は `http(s)` の
`href` だけで、リンクには `target="_blank"` と `rel="noopener noreferrer"` を付けます。画像・`class`・
`style`・`javascript:` のリンクは落とすので、外の値で画像を出したり、第三者の画像を読み込ませたりはできません。
文字だけの値（Google の copyright「Imagery ©2026 Airbus, CNES / Airbus, Maxar Technologies Map data ©2026」
など）や、ふつうの TileJSON の `attribution` のような文字とリンクは、そのまま出ます。地図の設定の `attr`（アプリの作者が書く値）は、今までどおり広い許可表で洗います（画像なども書けます）。
同じものかどうかは表示される文字で比べるので、`attr` と source の出典が同じ文字なら 1 回だけ出します。

位置は地図の要素の CSS の変数（`--maplat-attribution-right`・`--maplat-attribution-bottom`・
`--maplat-attribution-max-width`）で変えられます。`<maplat-ui>` の中では、UI の部品に
重ならないよう、右下のボタンの列の左隣を既定にしています。そこで使う数値も変数
（`--maplat-attribution-ui-inset`・`--maplat-attribution-ui-bottom-offset`・
`--maplat-attribution-ui-button-width`・`--maplat-attribution-ui-gap`）で変えられます。
これらの変数は `maplat-app` の要素そのものに書いてください。`<maplat-ui>` の中では、
`<maplat-ui>` やほかの祖先に書いた値は、`maplat-app` に当たる既定の規則に負けます。

### 地図をタイルキャッシュから外す（`noCache`）

`MaplatApp` を `enableCache: true`（`MaplatApp` のオプション）で起動すると、タイルの
地図はすべて Service Worker のタイルキャッシュ（Weiwudi）に登録されます。設定に
`noCache: true` を持つ地図は**登録されません**。その地図のタイルは常にネットワークから
読み込まれ、`getMapCacheEnable(mapID)` は `false` を返します。キーが無いとき・
`noCache: false` のときは従来どおりキャッシュされます。

- JSON の真偽値で書きます。除外になるのは `true` だけで、`"true"` のような文字列は
  真とみなしません。
- 書ける場所は、地図マスタ（`maps/<mapID>.json`）と、app 設定の `sources` の要素の
  2 か所です。両方にあれば app の要素が勝ちます（例: 地図マスタの `noCache: true` を
  app の要素の `noCache: false` で打ち消せます）。
- 文字列で書いたソース（`"osm"`・`"gsi"` などの同梱ベースマップ）は `noCache` を
  持てません。外したいときはオブジェクト形で書きます:
  `{ "mapID": "osm", "noCache": true }`。
- 既に保存されたキャッシュは `noCache` を付けても消えません。除外した地図は登録され
  ないため、`clearMapTileCacheAsync(mapID)` もその地図には働きません。消すときは
  `noCache` を付ける**前に** `clearMapTileCacheAsync(mapID)` で消してください。

### 古地図の座標変換データ

一つの地図に world file の層と三角網の層を混在させられます。
EPSG:3857 と EPSG:4326 は内蔵式で変換し、ES 版では他の CRS を使うときに
proj4js を取得します。UMD 版は proj4js を同梱します。画素の原点・CRS・
副層の書き方は [地図データの仕様](docs/map-data.ja.md) を参照してください。
地図 JSON の最上位の `viewpointMode` で、視点（中心・縮尺・方角）の変換を
「動的グリッド」（既定・厳密に往復する）と「地図全体で固定」から選べます。

### IIIF の画像サービスから地図の画像を配る（`delivery`）

古地図の画像を、切り出したタイルではなく [IIIF Image API](https://iiif.io/api/image/)
の画像サービスから直接表示できます。地図の設定（`maps/<mapID>.json`）に `delivery` を書きます:

```json
{
  "delivery": { "type": "iiifImage", "url": "https://dl.ndl.go.jp/api/iiif/948741/R0000003" },
  "compiled": { "...": "..." }
}
```

`url` は画像サービスの基点の URL（`/info.json` の手前まで）です。地図を読み込むときに
`<url>/info.json` を 1 回取得し、タイルは IIIF の URL の形（`<url>/<region>/<size>/0/default.jpg`）
で要求します。`info.json` の読み取りと要求の URL の組み立ては Core が行います
（OpenLayers の IIIF の実装と同じ URL になることを試験で確かめています）。
画像の配信と書誌の関数は [`@maplat/core/common`](docs/api/maplat-core.ja.md#maplatcorecommon-の-iiif-関数) から使えます。

- 使えるもの: 任意の領域を返せる Image API 2・3 のサービス（level 1・level 2 の多く）と、
  タイルが 256 px の level 0 のサービス。
- まだ使えないもの: タイルが 256 px 以外の level 0・`sizes` だけの level 0・Image API 1。
  これらの地図や、`info.json` が読めない地図（`http:`／`https:` でない・取得の失敗・10 秒超・
  1 MiB 超・JSON でない・`width`／`height` が地図の `compiled` と違う）は使えない地図として扱い、
  エラーを記録し、他の地図は普通に起動します。`<maplat-app>` では、`sourceLoaded` のイベントに
  `{ mapID, usable: false }` で入ります。`MaplatApp` クラスでは、`sourceLoaded` の detail に
  その地図は入りません（印の要素も足しません）。それが初期の地図だったときは、既定の地図から
  起動します。
- 画像サービスは、ページからのオリジンをまたぐ要求（CORS）を許している必要があります。
- `delivery` を持つ地図はタイルキャッシュに登録しません。`enableCache: true` でも
  `getMapCacheEnable(mapID)` は `false` を返します。
- `url`・`urls` も持つ地図は `delivery` を使い、警告を記録します。`info.json` の `@id`／`id` が
  `delivery.url` と違うときも、タイルは `delivery.url` から要求します（警告を記録します）。
- `info.json` は資格情報（Cookie など）を付けずに取得します。

### 範囲外の POI

前面の地図の範囲の外にある POI も、置き場所があれば描きます。メルカトルの `coordinates`
か経緯度で与えた POI は、前面の地図がその地点を自分の座標に写せないとき範囲外、画素の
`x`・`y` で与えた POI は範囲外では描きません。

| 前面 | 範囲内 | 範囲外 |
|---|---|---|
| 古地図（背面の地図がある） | 前面の `marker` 層 | 背面の `marker` 層にメルカトルの座標で |
| TMS・`envelope` を持つ基本地図 | 前面の `marker` 層 | 前面の `marker` 層にメルカトルの座標で |
| 古地図で `overlay="false"` | 前面 | 描かない |
| `hide-outside-pois` が真 | 前面 | 描かない |

範囲外の POI の見た目は範囲内と同じです（同じアイコン・選択中は `selectedIcon`）。前面と
背面の入れ替えは 1 回で行うので、地図を切り替える途中で片方だけが空になる時間はありません。

- **背面のピンを押すとき。** クリックが前面で当たらず、背面の地図があり、押した点が古地図の
  紙の外（その点について `insideCheckSysCoord` が偽）のときだけ、背面の `marker` 層も見ます。
  当たれば前面と同じく `clickMarker`・`clickMarkers` で終わります。紙が覆っている点では、
  透過度によらず背面のピンは押せません。どちらでも当たらなければ `clickMapXy`・
  `clickMapMerc`・`clickMap` で終わります。
- **範囲外の POI を選んでいる間。** `selectMarker(id)` は、ピンが紙の外にあっても地図の中心を
  そのピンへ寄せます。その POI を選んでいる間は地図を紙の内側へ引き戻しません。
  `unselectMarker()` で選択を外すと、その処理の直後に中心が紙の内側のいちばん近い点へ
  戻ります。範囲外の POI を選んでいる間は GPS の位置が届いても中心は動きません。地図を
  切り替えると、切り替え先に無ければ選択を外して中心を紙の内側へ戻し、範囲内なら普通の
  選択として続け、まだ範囲外なら中心をそのピンに据えたままにします（`outOfMap` は
  出しません）。範囲内の POI の扱いは今までどおりです。
- **`hide-outside-pois`** は描画を止めます。ほかの真偽値の属性と同じく起動後にも変えられ
  （マーカーを描き直します）、旧 `appOption.hideOutsidePois` と同じフィールドに書きます。

### IIIF の書誌の写し（`iiif`・`iiifMetadata`）

地図の設定（`maps/<mapID>.json`）に、その地図の元の IIIF Presentation の Manifest と、
そこから MaplatEditor などの作成の道具が写した書誌を書けます:

```json
{
  "title": "新潟市圖",
  "attr": "国立国会図書館 National Diet Library, JAPAN",
  "license": "Custom",
  "licenseNote": "https://dl.ndl.go.jp/ja/help_iiif#...",
  "iiif": {
    "manifest": "https://dl.ndl.go.jp/api/iiif/948741/manifest.json",
    "canvas": "https://dl.ndl.go.jp/api/iiif/948741/canvas/3",
    "image": "https://dl.ndl.go.jp/api/iiif/948741/R0000003",
    "bindings": { "title": { "from": "manifest", "property": "label" } },
    "copiedAt": "2026-10-28T12:39:42Z",
    "copiedValues": { "title": { "ja": "新潟市圖" } },
    "copiedMetadata": [
      { "from": "manifest", "label": "Call Number", "value": "YG7-Z-1065" }
    ]
  }
}
```

- 写した値は普通の書誌の鍵（`title`・`attr`・`license`・`licenseNote` …）に入り、
  他の書誌と同じように表示されます。
- `bindings` は、それぞれの鍵を Manifest と canvas のどの項目から写したか
  （`{ from: "manifest" | "canvas", property }`）、`copiedValues` は写した時点の値
  （鍵 → 言語 → 文字列）、`copiedMetadata` は Manifest と canvas の `metadata` の全件です。
- **Viewer は Manifest を取りに行きません。** 地図の設定に書かれた値だけを読みます。
- そのような地図では、`getMapMeta()` と `mapChanged` の detail に
  `iiif: { manifest?, canvas?, image?, copiedAt?, display, metadata? }` が入ります
  （`metadata` は `copiedMetadata`。`bindings` と `copiedValues` は入りません）。
- `display` は `"all"` か `"hidden"` で、書誌の全項目の表を UI が出すかを表します。
  アプリの設定の `sources` の要素に `iiifMetadata` を書いて地図ごとに選びます
  （`{ "mapID": "...", "iiifMetadata": "all" }`）。書かなければ `"hidden"` です。
- `proposeIiifBindings` の題名の既定は常に Manifest の `label` です。読めない場合は
  `title` を返さず、canvas の label へは切り替えません。利用者が「このコマ」を選ぶための
  明示的な `{ from: "canvas", property: "label" }` の指定は引き続き使えます。
- Manifest を読んで写す値を取り出す関数（`listIiifCanvases`・`proposeIiifBindings`・
  `resolveIiifMetadata`・`compareIiifCopy`・`iiifRightsToLicense`・`IIIF_BINDABLE_KEYS`）は、
  **パッケージの公開 API ではありません**。MaplatEditor などの作成の道具が使う内部の関数で
  （ソースは `src/iiif/manifest.ts`）、公開の入口（`package.json` の `exports`）には無く、
  互換も保証しません。読み方は
  [docs/api/iiif-manifest.ja.md](docs/api/iiif-manifest.ja.md) にあります。
- これらの関数は取得をせず、DOM も使いません。HTML の値は呼び出し側が渡すサニタイザに通します。
  サニタイザ `sanitizeIiifHtml`（ブラウザの `window` が要ります）は公開 API で、型 `MapMetaIiif`・
  型ガード `isIiifMetadataEntry` とともに `@maplat/core/common` から import できます。残すのは `a`・`b`・`br`・`i`・`p`・
  `small`・`span`・`sub`・`sup` と `href` 属性だけで（`http:`／`https:` のみ）、リンクは
  `rel="noopener noreferrer"` つきの新しいタブで開きます。

### ライフサイクル

- ライフサイクルフェーズと uiHooks については
  [docs/ui-core-lifecycle.md](docs/ui-core-lifecycle.md) を参照してください
  （本ドキュメントは Maplat ビューアリポジトリに所在・ライフサイクルは
  `@maplat/ui` と共通です）。

### API リファレンス

- **API シグネチャ**（リリース依存）: [`docs/api/`](docs/api/) を参照
- **概念解説**（リリース非依存）:
  [Wiki API-Reference](https://github.com/code4history/MaplatCore/wiki/API-Reference)
  を参照

### デモ

公開デモ: <https://code4history.dev/MaplatCore/>（`master` から GitHub Pages に配備）。
手元では `pnpm dev` で起動し、`http://localhost:5175/` を開きます。ルート（`index.html`）は目次で、
古地図のデモと変換の形のデモ 1〜5 のどれにも 1 回のクリックで飛べます。各デモのページの見出しに「← 目次」のリンクがあります。

**言語の切り替え。** 3 ページ（目次・古地図のデモ・変換の形のデモ）の見出しの右に「日本語 / English」の切り替えがあります。
`?lang=ja` か `?lang=en` でも指定できます。指定が無いときは、ブラウザの言語（`navigator.language`）が日本語なら日本語、それ以外は英語です。
切り替えた言語は、ほかのページへのリンクに引き継がれます。古地図のデモでは `<html lang>` も同じ値になり、地図のデータの名前も切り替わります。
画面の文言は、`demo/i18n/` の辞書（ja・en）に 1 か所ずつまとめてあります。英語の用語は、MaplatEditor の用語集に合わせています。

#### 古地図のデモ（`old-map.html`）

`http://localhost:5175/old-map.html`（公開デモでは `old-map.html`）。

- `?region=<ID>` で地域を選びます（`morioka`・`nobeoka`・`nara`・`tatebayashi`・`hiroshima`・
  `niigata`）。無いときや知らない ID のときは `morioka` です。画面の地域の選択を変えると、
  この引数を付けて読み込み直します。
- 変換の形: 操作パネルの先頭の「変換の形」で、「三角網＋扇形外挿」（既定）と「従来型（V2）」を
  切り替えます。`?form=c|v2` でも指定できます（無いときは `c`）。`c` は `public/maps-c/<mapID>.json`
  （CRS＋三角網＋扇形外挿で作り直した地図。今のところ全地図が EPSG:3857）、`v2` は
  `public/maps/<mapID>.json`（これまでの地図データ。V2 のまま読み、A/B/C と解釈し直しません）を読みます。
  切り替えても、今の地図・位置・縮尺は保ちます（app を作り直し、`restore` で渡します）。欄には、
  今の地図の変換の形・CRS・strict か・補完点の数と、推定（Teiresias）で推奨された型・適合スコア
  （`public/maps-c/estimates.json`）を出します。推奨が C 以外の地図では、「推奨は ○○ だが、このデモでは
  三角網＋扇形外挿で作っている」と書きます。
- タイルキャッシュ: デモは Weiwudi の Service Worker（`weiwudi-sw.js`）を登録してから
  `enableCache: true` で起動します。操作パネルの節「キャッシュ」で、状態と統計（保存済みの
  バイト数・取得済み／全体のタイル数）を見て、「全タイルを取得」（進み具合・中止）と
  「キャッシュを消す」を試せます。全体のタイル数が分からない地図と 3000 枚を超える地図では、
  一括取得を止めて理由を出します。
- `?cache=0` を付けると、キャッシュ無しで起動します。Service Worker が使えない環境や、
  登録が 15 秒以内に終わらないときも、キャッシュ無しで起動して理由を節に出します。

#### 変換の形のデモ（`layered-map.html`）

`http://localhost:5175/layered-map.html`（公開デモでは `layered-map.html`）。`?demo=1`〜`5` でデモを、`?type=`（`a`・`b`・`c`・`d`）で型を、`?sup=0|1` で補完点の あり／なし を指定できます。目次には、デモごとの直接のリンクがあります。**1 つのデモは 1 つの比較だけ**を見せます。
変換の型を 2 つ切り替えて（ボタンまたは ←→ キー）、紙から変換した結果（赤い線）が、正解（青い帯）の中に収まるかを見ます。
どのデモにも「確認のポイント」の 1 行があり、何を見れば何が分かるかを書いています。

| 型 | 中身 |
|---|---|
| CRS | 地図を CRS として読み、6 つの係数（world file）で紙の全体を写します。三角網は使いません。 |
| 三角網＋大域外挿 | CRS の上に GCP の三角網を張ります。四辺形の外は、地図全体に当てはめた world file で延ばします。 |
| 三角網＋扇形外挿 | CRS の上に GCP の三角網を張ります。四辺形の外は、縁の GCP の傾向を扇形に延ばします。 |
| 従来型 | 3857＋三角網＋扇形外挿（V2）。投影を 3857 に決め打ちし、紙の四隅の 4 つの補助頂点を足した三角網で、投影の違いを吸収します。 |

| デモ | 紙 | 比べる型 | 見せたいこと |
|---|---|---|---|
| 1 | P1 正確な図 | CRS と 三角網＋扇形外挿 | 正しい CRS が分かる正確な地図では、world file だけで紙の端まで合います。三角網は精度を足さず、GCP の打ち間違いをその周りへ持ち込みます。 |
| 2 | P1 正確な図 | 従来型 と 三角網＋扇形外挿 | 従来型は、投影の違いを三角網で吸収するので、GCP の外で大きく曲がります。CRS を合わせると、曲がりが消えます。 |
| 3 | P2 地方ごとの寄せ集め | CRS と 三角網＋大域外挿 | 地図そのものが歪んでいると、CRS だけでは GCP の所でもずれが残ります。三角網は GCP のある陸の歪みを直します。GCP の無い海の上は直りません。 |
| 4 | P2 地方ごとの寄せ集め | 三角網＋大域外挿 と 三角網＋扇形外挿 | 四辺形の内側は同じです。地方ごとの歪みが全体として打ち消し合う図では、外側は大域外挿が正解に近くなります。 |
| 5 | P3 中心を大きく描いた見取り図 | 三角網＋大域外挿 と 三角網＋扇形外挿 | 四辺形の内側は同じです。中心を大きく描いた図では、大域外挿は中心の誇張に引かれて、外側の縮尺が合いません。縁の GCP の縮尺で延ばす扇形外挿が正解に近くなります。ただし、中心が GCP の重心にある図に限ります。 |

**補完点のあり・なし**（デモ 1・3・4）: MaplatTin#89・#94 の補完点は、補助頂点の三角形が GCP の凸包の内側へ食い込まないように、システムが凸包の辺の上に足す対応点です。
人間が打った対応点ではないので、黒の中抜きの菱形で、紙の面と 3857 の面に同じ番号（補 1・補 2 …）で描きます。補完点を含む三角形は短い破線、GCP の凸包は破線と点の繰り返しで描きます。
欄の「補完点あり／なし」で切り替えます（型の切り替えとは別の操作です。URL は `?sup=0`・`?sup=1`）。切り替えると、3857 の面に、選んでいない側の結果が**灰色の細い線**で薄く残るので、
動いた所が赤と灰色のずれとして見えます（正解の無い比較なので、灰色は正解ではなく「もう一方の設定の結果」です）。欄には、補完点の数・凸包の内側への食い込み（紙の面の面積の割合。あり／なし）・
補完点あり／なしの変換結果の差（凸包の外と中。最大と二乗平均）を出し、「見る場所」の「補完点」「食い込み」で、その付近を拡大します（紙の面も寄ります）。
補完点が付かない素材（デモ 2 の GCP・P3）では、切り替えても何も変わらないので、切り替えを出しません。補完点を持たない型（CRS・従来型）では、切り替えを押せなくします。

**見せ方の文法**（全デモ共通。正本は `demo/layered-map/grammar.ts` で、`spec/layered-map-demo.spec.ts` が値を固定しています）:
色は赤・青・黒の 3 色が中心です（補完点の比較だけ、もう一方の設定の結果に灰色を足します）。**赤い細い線**は紙のもの（紙に描いてあるものと、それを変換した結果）、
**青い太い帯**は地理の側の正解（3857）、**黒い点線・破線**は変換のしくみです（GCP の三角網・拡張範囲・四辺形・扇形を線種で区別します）。
地形は太い実線、グリッドは中くらいの実線、しくみは細い点線です。赤い線が帯の中にあれば合っていて、出ていれば外れています。
この読み方は、地形にもグリッドにも GCP にも同じです。GCP は紙の面（赤い丸）と 3857 の面（青い輪の中に、紙の側を変換した赤い丸）に同じ番号で出し、
どちらかで押すと両方で強調します。

画面は、左が**紙の面**（紙の画素のまま描く SVG）、中央が**3857 の面**（Core の `MaplatApp`。背景は地理院タイル）、右が欄です。
3857 の面の青い帯は経緯度の線（`addLine` の `lnglats`）、赤い線としくみは、紙の画素を `@maplat/transform` の `MapTransform` で 3857 へ変換して
`addLine` の `coordinates` で描きます（Core の公開 API に「紙の画素 → 3857」の口が無いため。この変換が Core の変換と同じ値を返すことは
`spec/layered-map-demo.spec.ts` で固定しています）。「Core でこの紙を開く」で、Core が紙の座標へ描き直した姿も見られます。

素材は `demo/layered-map/generate.mjs` が作ります（結果はコミット済みで、普段は実行しなくてよい）。紙は 3 枚で、どれもランベルト正角円錐図法
（`+proj=lcc +lat_1=30 +lat_2=42 +lat_0=35 +lon_0=136 …`・2048×2048 画素・1 画素 1,500 m）の上に日本とその周りの海岸線と 2 度ごとの経緯線を描いたものです。
P1 は正確な図です。P2 は地方ごとに縮尺・向き・位置を少しずつ変えた寄せ集めの図で、全体としては 1 つの相似に乗るように作ります。
P3 は GCP の重心を中心に 2 倍に大きく描いた見取り図で、中心から約 700 km より外は元の縮尺です。どちらの歪みも有界で、遠くは P1 と同じになり、折り返しません。
GCP は固定の乱数種で散らばらせた 24 組（密 14・疎 10。デモ 1 は打ち間違い 2 組入り）と、歪んだ図用の 34 組（九州から北海道まで、地方ごとに 3 組以上）です。
各型の誤差（紙の上の 65×65 点で、変換の結果と正解の距離。GCP の凸包の中の全体・中の陸・外・GCP の位置）と、適合スコア（Teiresias の score）と推奨は、生成のときに計算して
`public/demo-data/layered_demo_meta.json` に書き、画面は読むだけです。生成のときに、三角網＋大域外挿と三角網＋扇形外挿の内側の差が 1 km 未満であることと、歪みが折り返さないことを確かめ、満たさなければ止めます。
地図 JSON は `public/maps/layered_demo_*.json`（9 つと、補完点が付いた素材の「補完点なし」の版 `layered_demo_*_off.json` の 3 つ。`supplementPairs: false` で作る）、
紙の折れ線は `public/demo-data/layered_demo_paper_p1.json`・`..._p2.json`・`..._p3.json`、紙のタイルは `public/tiles/layered_demo_p1`・`..._p2`・`..._p3` にあります。
MaplatTin（`node demo/layered-map/generate.mjs [j1c|j1d|j1e]` で `../MaplatTin-<名前>` を選ぶ。既定は j1e＝補完点入り。j1c・j1d は補完点を持たないので「補完点なし」の版は作られない）と Teiresias は素材を作るためだけに使い、Core の依存ではありません。

**同梱とオフライン**: 海岸線は Natural Earth（<https://www.naturalearthdata.com/>）の 1:50m の陸地（`ne_50m_land`。パブリックドメイン）を、
`demo/layered-map/data/coast-lonlat.json` に切り出して同梱しています（`make-coast.mjs` が切り出す）。proj4 は依存として同梱です。
ネットワークに出るのは背景の地理院タイルだけで、出られなくても海岸線（青い帯）は出ます。

### 開発

#### セットアップ
リポジトリをクローンし依存関係をインストールします。

```bash
git clone https://github.com/code4history/MaplatCore.git
cd MaplatCore
pnpm install
```

#### 開発サーバー
ホットリロード付きの開発サーバーを起動します。

```bash
pnpm dev
```

#### ビルド

```bash
pnpm build        # npm パッケージをビルド (dist/)
pnpm build:demo   # デモアプリをビルド (dist-demo/)
```

#### テスト

```bash
pnpm test         # ユニットテスト (Vitest) を実行
pnpm typecheck    # 型チェック (TypeScript) を実行
pnpm lint         # リンター/フォーマッター (ESLint/Prettier) を実行
pnpm run test:e2e # E2E テスト (Playwright) を実行
```
<!-- release-pinned:end -->

E2E テストに Google Maps の API キーは要りません。手元で Google の地図を確かめるときだけ、環境変数 `GOOGLE_MAPS_API_KEY` で渡してください。

<!-- SECTION 6: Prerequisites -->
## 動作環境

> Node.js は GitHub Actions の `test.yml` matrix、pnpm は `package.json` の `engines` フィールドに基づく（特定のリリースに紐づく値）。

- Node.js: v22 または v24（GitHub Actions で検証済み）
- pnpm: `>=9.0.0`（必須・`package.json` で pnpm を強制）

<!-- SECTION 7: Peer Dependencies -->
## Peer Dependencies

MaplatCore は以下のライブラリを peer dependency として要求します。
手動でインストールしてください。

- **OpenLayers (`ol`)** — `^9.0.0 || ^10.0.0`（必須・MaplatCore と Maplat
  `@maplat/ui` の peer dependency）

```bash
pnpm add ol
```

ベクタータイルを使用する場合は Mapbox GL JS または MapLibre GL JS も
必要になることがあります:

- `mapbox-gl`: `^2.0.0 || ^3.0.0`（オプション）
- `maplibre-gl`: `^5.0.0 || ^6.0.0`（オプション）

<!-- SECTION 8: Ecosystem / Related Repositories -->
## エコシステム

MaplatCore は [Code for History](https://github.com/code4history) が運営する
Maplat エコシステムの一部です。全容は下記エコシステム図を参照してください。

📖 **エコシステム図** — *（図は現在外部非公開の計画リポジトリに保持して
います。下記の姉妹リポジトリ表が公開版の代替です）*

### 姉妹リポジトリ

| リポジトリ | ライセンス | npm | 役割 |
|---|---|---|---|
| [Maplat](https://github.com/code4history/Maplat) | Apache 2.0 | `@maplat/ui` | メインビューア |
| [MaplatCore](https://github.com/code4history/MaplatCore) | Apache 2.0 | `@maplat/core` | コアライブラリ |
| [MaplatTin](https://github.com/code4history/MaplatTin) | Apache 2.0 | `@maplat/tin` | TIN 変換 |
| [MaplatTransform](https://github.com/code4history/MaplatTransform) | Apache 2.0 | `@maplat/transform` | 座標変換 |
| [MaplatEditor](https://github.com/code4history/MaplatEditor) | Apache 2.0 | — | データ作成ツール（デスクトップ） |
| [Chuci](https://github.com/code4history/Chuci) | MIT | `@c4h/chuci` | マルチメディアスワイパー/ビューア Web Components |
| [Quyuan](https://github.com/code4history/Quyuan) | MIT | `@c4h/quyuan` | GeoJSON テンプレートエンジン＋マルチメディアビューア Web Components |
| [Weiwudi](https://github.com/code4history/Weiwudi) | MIT | `@c4h/weiwudi` | タイルキャッシュ用 Service Worker |

> MaplatEditor は上記ビューアライブラリが描画する地図・POI を作成する
> データ作成ツールです。Maplat エコシステムはエンドツーエンド:
> MaplatEditor で作成し、いずれかのビューアライブラリで公開、という流れになります。

<!-- SECTION 9: Nayuta links -->
## リンク

| 対象 | リンク | 用途 |
|---|---|---|
| プロジェクト情報・機能紹介・事例 | <https://www.maplat.jp/> | 製品サイト |
| 支援企業・案件問い合わせ | <https://www.nayuta-inc.co.jp/> | コーポレートサイト（那由多社） |

> Apache ライセンスのリポジトリ（本リポジトリ）は両サイトへリンクします。
> MIT ライセンスの姉妹リポジトリ（Weiwudi / Quyuan / Chuci）へは那由多社リンクを置きません。
> 英語ページへ遷移する場合は `/en/` を付与してください（例: `https://www.maplat.jp/en/`）。

<!-- SECTION 10: License -->
## License

Apache License 2.0 — 詳細は [LICENSE](LICENSE) を参照。

```
Copyright 2019-2026 Kohei Otsuka, Code for History / Nayuta, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

> **特許注記**: Maplat の座標変換技術は日本国内で特許登録されています
> （Patent No. 6684776）。

> **過去のバージョン**: 0.13.2 より前のバージョンは Maplat Limited License
> 1.1 の下で配布されていました。Apache 2.0 へのライセンス復帰は 0.13.2
> 以降に適用されます。npmjs.com 上の過去版は元の制限付きライセンス条項の
> まま残ります。
