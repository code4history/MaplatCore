<!-- SECTION 1: Header (logo, badges, title) -->
<h1 align="center">MaplatCore</h1>

<p align="center">
  <a href="https://github.com/code4history/MaplatCore/actions/workflows/test.yml"><img src="https://github.com/code4history/MaplatCore/actions/workflows/test.yml/badge.svg" alt="CI" /></a>
  <a href="https://www.npmjs.com/package/@maplat/core"><img src="https://img.shields.io/npm/v/@maplat/core" alt="npm version" /></a>
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

> リリース依存情報（ADR-0012）。下記バージョン `1.0.0-rc1` は現在の
> リリースです。リリースごとに更新してください。

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

### CDN（jsDelivr）

ブラウザでバンドラーを使わずに直接利用する場合は、MaplatCore より先に
OpenLayers を読み込む必要があります。

```html
<!-- OpenLayers -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@10/ol.css">
<script src="https://cdn.jsdelivr.net/npm/ol@10/dist/ol.js"></script>

<!-- MaplatCore -->
<script src="https://cdn.jsdelivr.net/npm/@maplat/core@1.0.0-rc1/dist/maplat_core.umd.js"></script>

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
レイヤ単位の表示上書き（`hide` / `title` / `icon` / `selectedIcon`）を
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

<!-- SECTION 6: Prerequisites -->
## 動作環境

> Node.js は GitHub Actions の `test.yml` matrix、pnpm は `package.json` の `engines` フィールドに基づく（ADR-0012: リリース依存）。

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

- `mapbox-gl`: `^1.0.0 || ^2.0.0 || ^3.0.0`（オプション）
- `maplibre-gl`: `^3.0.0 || ^4.0.0`（オプション）

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

> MaplatEditor は上記ビューアライブラリが描画する地図・POI を作成する
> データ作成ツールです。Maplat エコシステムはエンドツーエンド:
> MaplatEditor で作成し、いずれかのビューアライブラリで公開、という流れになります。

<!-- SECTION 9: Nayuta links -->
## リンク

| 対象 | リンク | 用途 |
|---|---|---|
| プロジェクト情報・機能紹介・事例 | <https://www.maplat.jp/> | 製品サイト |
| 支援企業・案件問い合わせ | <https://www.nayuta-inc.co.jp/> | コーポレートサイト（那由多社） |

> ADR-0013: Apache ライセンスのリポジトリ（本リポジトリ）は両サイトへリンクします。
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
