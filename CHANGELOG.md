# Changelog

このプロジェクトの主な変更を記録します。版数は [Semantic Versioning](https://semver.org/) に従います。

## [Unreleased]

### Added
- Custom Element `<maplat-app>`（入口 `@maplat/core/element`）。要素そのものが地図の入れ物で、属性・プロパティ（`app-id`・`map-id`・`transparency`・`north-up` …）、`MaplatApp` の公開メソッド 46 個の委譲、同じ名前の DOM イベント、状態の読み取り（`ready`・`implementation`・`version`・`appData`・`initialRestore`・`state`・`currentMapId`・`viewpoint`・`gpsEnabled`）を持つ
- `<maplat-app>` の `map-id`・`transparency` は地図の側の変化を属性へ書き戻す。中心の目印は `no-center-marker`・`center-marker-src` で消す・差し替える。`uiHooks` の `context.core`・`context.mapDivDocument` は要素の経路では要素になる（`MaplatApp` の経路は従来どおり）
- 要素の新設 API: `listMaps`・`getViewpoint`・`supports`・`setEnvelopes`・`getMapEnvelope`・`getViewExtent`・`zoomBy`・`getDefaultPinIcon`、イベント `gpsEnabledChanged`・`moveStart`・`moveEnd`
- 入口 `@maplat/core/common`（地図を持たない共通部分: 名前の表・型・要素の基底クラス `MaplatAppElementBase`・補助関数）と `@maplat/core/conformance`（層 A の適合テスト群と模擬の `<maplat-app>`）
- 利用者向けの文書 `docs/api/maplat-app.md`・`maplat-app.ja.md`
- `MaplatApp` の `appOption.div` に HTMLElement も渡せる（従来の id 文字列も可）。`appOption.restoreExtensionKeys`（`restoreSession` で `localStorage` から拡張キーも読む）。中心の目印の `img` に class `maplat-center-marker`（表現の差し替え口。id `center_circle` は従来どおり）

### Changed
- `MaplatApp` の起動時だけ効くフィールド（`appid`・`enableCache`・`noRotate`・`alwaysGpsOn`・`overlay`・`googleApiKey`・`restoreSession`・`initialRestore`・`uiHooks` など）への構築後の代入は、警告して無視する（読み取りは従来どおり）
- `MaplatApp` が設定ファイルの機能系キー（`noRotate`・`northUp`・`tapDuration`・`tapUIVanish`・`homeMarginPixels`・`controls`）を読むと、次のメジャー版（2.0）で廃止する旨を 1 回警告する。`<maplat-app>` はこれらを設定ファイルから読まない（属性・プロパティで与える）

### Deprecated
- `MaplatApp` クラスの API（`new MaplatApp(appOption)`・`createObject`・`waitReady`・`mapObject`・`appOption.div` など）。1.x では従来どおり使えるが、削除予定のメジャー **2.0**（次のメジャー版）で閉じ、`<maplat-app>` だけになる。移行の対応表は `docs/api/maplat-app.md`
  - 型定義の JSDoc に `@deprecated` を付けた。また、利用者がこのクラスを直接作ると（`new MaplatApp`・`createObject`）、同じページの中で 1 回だけ `console.warn` で告知する。`<maplat-app>` が中で作る分と、旧 UI API（`@maplat/ui` の `MaplatUi`）から使う分では告知しない

### Removed
- POI の `poiTemplate`・`iconTemplate` を lodash.template で評価するのをやめ、Nunjucks の記法（Quyuan の `@c4h/quyuan/template`）で評価するようにした。依存 `lodash.template` を外した（#93）
  - 理由: lodash.template はテンプレートの中身を JavaScript としてそのまま実行するため、地図データや POI データに書かれたテンプレートからページの権限でコードが動いた。利用がほとんど無いため、予告の期間を置かずに外した
  - 旧い記法の検出: テンプレート（`{% raw %}…{% endraw %}`・`{% verbatim %}…{% endverbatim %}` の中を除く）に `<%`…`%>` または `${`…`}` があれば旧い記法とみなし、評価せずにそのテンプレートは無いものとして扱い、ページで 1 回だけ `console.warn` で知らせる。`<%`・`${` を文字として出したいときは `{% raw %}…{% endraw %}` で囲む
  - 書き換え: `<%- name %>` → `{{ name }}`、`<%= html %>` → `{{ html | safe }}`、`${name}` → `{{ name }}`、`<% if (a) { %>…<% } %>` → `{% if a %}…{% endif %}`、`<% list.forEach(x => { %>…<% }) %>` → `{% for x in list %}…{% endfor %}`。`iconTemplate` は JSON を作るので、文字列の値は `"icon": {{ url | dump | safe }}` と書く（`"{{ url }}"` は `&` などを HTML の形に置き換える）。対応表は `docs/api/maplat-app.md` を参照
  - `{{ }}` は既定で HTML エスケープする（lodash の `<%= %>` はしなかった）。テンプレートの誤りや存在しない値で地図の描画が止まらなくなった（存在しない値は空文字）
  - 検出に当たらないまま表示が変わる場合が 1 つだけある: lodash の記法を含まず、`{{ }}`・`{% %}` を文字として書いていたテンプレートは、1.3 から Nunjucks として評価される

### Security
- 上記により、`poiTemplate`・`iconTemplate` の値（POI の名前・説明など）からの注入は起きにくくなった。ただし **Nunjucks もサンドボックスではない**: テンプレートの文字列そのものを第三者が書ける構成（第三者の POI JSON・地図 JSON を読む構成）では、引き続きページの権限でコードが動きうる。そのような構成では、信頼できないデータのテンプレートを使わないこと

## [1.2.0-rc.1] - 2026-10-26

### Fixed
- 設定ファイル・オプションの 8 キーで `false`／`0` が効くようになった（#116）
- 透過度 0・地図の切替で透過度を保つ（#117）
- 背面地図の追従を座標変換の例外で止めない（#108）
- DPR>1 で描画ごとに GL の resize を呼ばない（#107）

### Added
- 線・面の個別削除の API（#91）

### Changed
- 地図ごとのキー `noCache`（真でタイルキャッシュから除外）。既存のキャッシュは消えない（#90）
- 例外で ERROR になったタイルを回数上限つきで読み直す（#110）

## [1.1.0] - 2026-10-05

1.1.0-rc.1 と同じ内容の正式版です。版番号と、依存 `@maplat/transform`・`@c4h/weiwudi` の指定を RC から正式版（`^1.1.0`）へ戻したことだけが違います。変更点は 1.1.0-rc.1 までの各項を参照してください。

## [1.1.0-rc.1] - 2026-09-28

### Changed
- 同梱する `@maplat/transform` を 1.1.0-rc.1 へ追随（三角形内を純アフィンで変換するため、変換結果が変わる）。`@c4h/weiwudi` を 1.1.0-rc.1 へ追随
- 依存関係を更新

### Fixed
- GPS / POI の表示候補から紙外の本図を除き、範囲外で GPS マーカーを消す（#104・#105。`@maplat/transform` の `merc2XyVisibleLayers` を利用）
- `removeMarker` / `removePoi` で POI 配列に穴を残さない（#111）
- タイルの onload 内の例外でタイルが LOADING のまま残り TileQueue が詰まる問題を修正（#109）
- 非表示コンテナで初期化・地図切り替えをしても視点が壊れないようにした（#101）
- MapboxLayer の canvas を frameState へ同期する（#100）
