# Changelog

このプロジェクトの主な変更を記録します。版数は [Semantic Versioning](https://semver.org/) に従います。

## [Unreleased]

### Added
- 変換の形のデモページ `layered-map.html` を追加。CRS・三角網＋大域外挿・三角網＋扇形外挿・従来型（3857＋三角網＋扇形外挿。V2）のうち 2 つの型を切り替えて、紙から変換した結果（赤い細い線）が正解（青い太い帯）の中に収まるかを見る 4 つのデモ。各デモに「確認のポイント」の 1 行を付けた。紙はランベルト正角円錐図法の合成図（P1 は正確・P2 は既知の歪み）で、海岸線は Natural Earth の 1:50m の陸地（パブリックドメイン）を同梱。GCP は固定の乱数種で散らばらせた 24 組を、紙の面と 3857 の面に同じ番号で出す。見せ方の文法（色は赤・青・黒の 3 色。太さと線種で意味を分ける）は `demo/layered-map/grammar.ts` に集め、試験で固定する。背景の地理院タイル以外はネットワークに出ない
- Added the `layered-map.html` demo page: four demos that switch between two of four shapes: CRS only, TIN + global extrapolation, TIN + fan extrapolation and legacy (3857 + TIN + fan extrapolation, V2), and show whether the converted paper (thin red line) stays inside the truth (thick blue band). Each demo has a one-line "確認のポイント" (what to check). The papers are synthetic Lambert conformal conic charts (P1 accurate, P2 with a known distortion); the coastline is Natural Earth 1:50m land (public domain), bundled. 24 GCPs scattered with a fixed random seed appear with the same number on the paper face and the 3857 face. The visual grammar (three hues: red, blue, black; meaning split by width and dash pattern) lives in `demo/layered-map/grammar.ts` and is pinned by tests. Only the GSI background tiles use the network.
- 古地図の本図・副層に `tinEnabled: false` の world file と CRS 付き三角網を追加（#97・#200）。三角網の四辺形の外では compiled 内の world file も使える。ES 版は必要な CRS の地図で proj4js を取得し、UMD 版は同梱する。world file 未対応の旧 MaplatEditor ではこの形式の地図を開いたり取り込んだりしないこと。詳しくは [地図データの仕様](docs/map-data.ja.md)
- Added world-file layers (`tinEnabled: false`), per-layer CRS for TINs, and TINs with a compiled world file for the outer region (#97, #200). The ES build loads proj4js on demand and UMD bundles it. Avoid opening or importing world-file maps in MaplatEditor versions that predate support. See the [map data format](docs/map-data.md).
- Custom Element `<maplat-app>`（入口 `@maplat/core/element`）。要素そのものが地図の入れ物で、属性・プロパティ（`app-id`・`map-id`・`transparency`・`north-up` …）、`MaplatApp` の公開メソッド 46 個の委譲、同じ名前の DOM イベント、状態の読み取り（`ready`・`implementation`・`version`・`appData`・`initialRestore`・`state`・`currentMapId`・`viewpoint`・`gpsEnabled`）を持つ
- `<maplat-app>` の `map-id`・`transparency` は地図の側の変化を属性へ書き戻す。中心の目印は `no-center-marker`・`center-marker-src` で消す・差し替える。`uiHooks` の `context.core`・`context.mapDivDocument` は要素の経路では要素になる（`MaplatApp` の経路は従来どおり）
- 要素の新設 API: `listMaps`・`getViewpoint`・`supports`・`setEnvelopes`・`getMapEnvelope`・`getViewExtent`・`zoomBy`・`getDefaultPinIcon`、イベント `gpsEnabledChanged`・`moveStart`・`moveEnd`
- 入口 `@maplat/core/common`（地図を持たない共通部分: 名前の表・型・要素の基底クラス `MaplatAppElementBase`・補助関数）と `@maplat/core/conformance`（層 A の適合テスト群と模擬の `<maplat-app>`）
- 利用者向けの文書 `docs/api/maplat-app.md`・`maplat-app.ja.md`
- `MaplatApp` の `appOption.div` に HTMLElement も渡せる（従来の id 文字列も可）。`appOption.restoreExtensionKeys`（`restoreSession` で `localStorage` から拡張キーも読む）。中心の目印の `img` に class `maplat-center-marker`（表現の差し替え口。id `center_circle` は従来どおり）
- POI のテンプレートの出力（`html`）で、マルチメディアのスライダー `<qy-swiper>`・`<qy-swiper-slide>`（[Quyuan](https://github.com/code4history/Quyuan)）を使えるようにした。`sanitizeHtml` が 2 つの要素を残す。`qy-swiper-slide` に残る属性は `image-url`・`image-type`・`thumbnail-url`・`caption`・`material-url`・`camera-position`・`camera-target`・`show-texture`・`fit-to-container`・`debug-mode`、`qy-swiper` に残る属性は `has-thumb`・`autoplay` だけで、値は POI の `media` と同じ検査を通る（表示には `@maplat/ui` 1.3 以降が要る）
- 古地図の画像を IIIF Image API の画像サービスから直接配る `delivery: { type: "iiifImage", url }`（地図の設定）。`info.json` の読み取りと要求の URL は Core が組み立て、OpenLayers の IIIF の実装との一致を試験する。Image API 2・3 の任意の領域を返せるサービスと、タイルが 256 px の level 0 に対応。使えない地図は `sourceLoaded` で `usable: false` になり、他の地図で起動する。タイルキャッシュには登録しない。判定・取得の関数 `checkIiifDelivery`・`resolveIiifDelivery` は `@maplat/core/common` から公開する
- `@maplat/core/common` に IIIF の画像の解釈・タイル URL・配信の準備・書誌の正規化の関数と型を追加（`parseIiifImageInfo`・`iiifTileUrl`・`prepareIiifDelivery`・`mapMetaIiif` など）。上位の実装も同じ規則を使える
- OpenLayers から移植した IIIF の処理の著作権・BSD-2-Clause の全文を `THIRD-PARTY-NOTICES.md` とソースに掲載し、配布する JavaScript にもライセンス表記を残す
- 同梱ベースマップのサムネイル（`parts/osm.jpg`・`parts/gsi.jpg`・`parts/gsi_ortho.jpg`）の出典（OpenStreetMap・国土地理院）を `THIRD-PARTY-NOTICES.md` に掲載
- `<maplat-app>` の属性 `hide-outside-pois`（プロパティ `hideOutsidePois`）。範囲外の POI を描かない。起動後にも変えられ、変えるとマーカーを描き直す
- 地図の設定の `iiif` 節（IIIF の Manifest から写した書誌: `manifest`・`canvas`・`image`・`bindings`・`copiedAt`・`copiedValues`・`copiedMetadata`）。`getMapMeta`・`mapChanged` の `MapMeta` に `iiif`（`display` はアプリの設定の `sources[]` の `iiifMetadata`、既定 `"hidden"`）。Viewer は Manifest を取得しない。Manifest の値の中の入れ子の配列は、捨てずに平らにして読む（深さの上限は 32 段。循環する値でも止まる）。Manifest を読む純粋な関数（`resolveIiifMetadata` ほか）は `src/iiif/manifest.ts`（MaplatEditor などが使う内部の関数で、パッケージの公開 API ではない）、IIIF の値のサニタイズは `sanitizeHtml(dirty, { profile: "iiif" })`・`sanitizeIiifHtml`。`@maplat/core/common` から `sanitizeIiifHtml`・型 `MapMetaIiif`・型ガード `isIiifMetadataEntry` を import できる。`iiif.copiedMetadata` の形の合わない要素は、地図ごとに 1 回警告して外す
- 入口 `@maplat/core/template`（`dist/maplat_core_template.js`）。POI テンプレートを評価する関数 `applyPoiTemplates`・`createIconSet`・`createHtmlFromTemplate` と型 `PoiTemplateLevel`・`PoiTemplateFields` を出す。`MaplatApp` がマーカーの描画と `getMarker` に使うのと同じ実装で、上位の実装が同じ設定ファイルで同じ表示を出せるようにするため。Nunjucks（Quyuan の `@c4h/quyuan/template`）を同梱するので `@maplat/core/common` には入れない（`@maplat/core/element`・`@maplat/core/common` は Nunjucks を含まない）。実行時は `@maplat/core` の中の分とは別の写しで、両方を読み込むページでは Nunjucks が 2 重に載る
- Google の地図を表示しているあいだ、Map Tiles API の利用条件に従い、Google の出典（copyright）の左隣に Google Maps のロゴを出すようにした（#193）。ロゴは公式の配布物の SVG を原寸（105×22 px）で手を加えずに使い、地図は白い枠の灰色、衛星写真は濃い枠の白。余白は上・左右 10 px、下 5 px。前面が古地図で背面が Google の地図のときも出す。出典の文字が入らなければロゴの下へ折り返し、使える幅が 125 px より狭いときだけロゴの代わりに文字「Google Maps」を出す。状態は `div.maplat-attribution` の `data-google-maps`（`logo`・`text`）。Google の地図は `attr` を書いても表示範囲の copyright を必ず出し、`attr` は別の箱にして上に出す。Google の地図の上の重ね地図などの出典も、Google の出典と別の箱にして上に出す。ロゴの出どころとライセンスの扱いを `THIRD-PARTY-NOTICES.md` に掲載
- `<maplat-app>` の読み取り専用のプロパティ `providerAttributions`（表示中の現代の地図ごとの提供元の申告: Google の Map Tiles API の copyright と、`attr` の無い `TileJSON` の source の `attribution`。値は `{ mapID, attributions }[]` で、狭い許可表で洗った HTML。地図の定義の `attr`・ライブラリの既定値・作るときに渡した `attributions` は含まない）と、イベント `attributionChanged`（`providerAttributions` の値が変わったときだけ要素から出る。detail なし・`bubbles: true`・`composed: false`）。地図の右下で切った出典の全文を UI の地図情報で見せるため。MaplatCore の要素だけにあり、層 A の契約の外（`MAPLAT_APP_EVENTS`・`ELEMENT_OWN_EVENTS` などの表には入らない。使う前に `"providerAttributions" in el` で確かめる）。`MaplatApp` の prototype は変えない

### Changed
- 範囲外の POI が背面の地図に見えるようになった。古地図の紙の外にある POI は背面の `marker` 層にメルカトルの座標で立ち、TMS・基本地図では前面に立つ。範囲外の POI を選んでいる間は中心を紙の内側へ引き戻さず、背面のピンは紙の外の点でだけ押せる
- `MaplatApp` の起動時だけ効くフィールド（`appid`・`enableCache`・`noRotate`・`alwaysGpsOn`・`overlay`・`googleApiKey`・`restoreSession`・`initialRestore`・`uiHooks` など）への構築後の代入は、警告して無視する（読み取りは従来どおり）
- 上の起動時だけ効くフィールドのうち公開の 12 個は、TypeScript の型定義でも読み取り専用になった（`get` のみ）。`app.restoreSession = false` のような代入はコンパイルエラー（`TS2540`）になる。実行時も、インスタンスの列挙できるプロパティから prototype の accessor（列挙されない）に変わり、`Object.keys(app)`・スプレッドに同じ名前のキー（`appid`・`restoreSession` など）は出ない。値の保管場所 `__appid`・`__restoreSession` などはインスタンスの列挙できるプロパティなので、こちらは出る
- `appOption.overlay` に `undefined`・`null` を明示したときの扱いを変えた。従来は背面の地図なしになっていたが、省略したときと同じく背面の地図ありになる。背面の地図を使わないときは `overlay: false` を渡す
- `MaplatApp` が設定ファイルの機能系キー（`noRotate`・`northUp`・`tapDuration`・`tapUIVanish`・`homeMarginPixels`・`controls`）を読むと、次のメジャー版（2.0）で廃止する旨を 1 回警告する。`<maplat-app>` はこれらを設定ファイルから読まない（属性・プロパティで与える）

### Deprecated
- `MaplatApp` クラスの API（`new MaplatApp(appOption)`・`createObject`・`waitReady`・`mapObject`・`appOption.div` など）。1.x では従来どおり使えるが、削除予定のメジャー **2.0**（次のメジャー版）で閉じ、`<maplat-app>` だけになる。移行の対応表は `docs/api/maplat-app.md`
  - 型定義の JSDoc に `@deprecated` を付けた。また、利用者がこのクラスを直接作ると（`new MaplatApp`・`createObject`）、同じページの中で 1 回だけ `console.warn` で告知する。`<maplat-app>` が中で作る分と、旧 UI API（`@maplat/ui` の `MaplatUi`）から使う分では告知しない

### Removed
- POI の `poiTemplate`・`iconTemplate` を lodash.template で評価するのをやめ、Nunjucks の記法（Quyuan の `@c4h/quyuan/template`）で評価するようにした。依存 `lodash.template` を外した（#93）
  - 理由: lodash.template はテンプレートの中身を JavaScript としてそのまま実行するため、地図データや POI データに書かれたテンプレートからページの権限でコードが動いた。利用がほとんど無いため、予告の期間を置かずに外した
  - 旧い記法の検出: テンプレート（`{% raw %}…{% endraw %}`・`{% verbatim %}…{% endverbatim %}` の中を除く）に `<%`…`%>` または `${`…`}` があれば旧い記法とみなし、評価せずにそのテンプレートは無いものとして扱い、1 回だけ `console.warn` で知らせる（評価のコードの写しごとに 1 回。`@maplat/core/template` も読み込むページでは、そちらからも 1 回出うる）。`<%`・`${` を文字として出したいときは `{% raw %}…{% endraw %}` で囲む
  - 書き換え: `<%- name %>` → `{{ name }}`、`<%= html %>` → `{{ html | safe }}`、`${name}` → `{{ name }}`、`<% if (a) { %>…<% } %>` → `{% if a %}…{% endif %}`、`<% list.forEach(x => { %>…<% }) %>` → `{% for x in list %}…{% endfor %}`。`iconTemplate` は JSON を作るので、文字列の値は `"icon": {{ url | dump | safe }}` と書く（`"{{ url }}"` は `&` などを HTML の形に置き換える）。対応表は `docs/api/maplat-app.md` を参照
  - `{{ }}` は既定で HTML エスケープする（lodash の `<%= %>` はしなかった）。テンプレートの誤りや存在しない値で地図の描画が止まらなくなった（存在しない値は空文字）
  - 検出に当たらないまま表示が変わる場合が 1 つだけある: lodash の記法を含まず、`{{ }}`・`{% %}` を文字として書いていたテンプレートは、1.3 から Nunjucks として評価される

### Fixed
- 未作成の副層を読み飛ばした後も、変換・境界・OpenLayers 投影の層番号を揃える。投影の extent は、左上に幅と高さを足して右下を求める。
- Keep transformation, bounds, and OpenLayers projection layer numbering in sync when skipping unfinished insets. The lower-right corner of the projection extent now includes the inset offset.
- 表示中の背景地図・タイルの重ね地図の出典を、地図の右下に出すようにした（#191）。これまでは OpenLayers の地図を `controls: []` で作っていたため、OpenStreetMap・地理院地図のタイルを表示していても、出典は UI の地図情報の中にしか出ていなかった。表示は `div.maplat-attribution`。古地図の出典は従来どおり UI の地図情報に出す。Google Maps のロゴは #193 で出す（Added の項目）
  - 出すのは「地図の定義の `attr`」と「提供元の申告」だけ。ライブラリの既定値では埋めない（OpenLayers の `OSM`・`StadiaMaps`・`BingMaps` などが持つ既定の出典や、source を作るときに渡した `attributions` は出さない）。`attr` も提供元の申告も無い地図には何も出ないので、アプリの設定で定義する背景地図・重ね地図には `attr` を書くこと。空や空白だけの `attr` は無いものとみなす。Core の組み込みの `osm`・`gsi`・`gsi_ortho` と、同梱の見本の地図は、Google の地図を除いて `attr` を持つ
  - 提供元の申告として読むのは 2 つの型の source だけ: Google の地図（Map Tiles API の copyright。`attr` を書いても必ず出す）と、OpenLayers の `TileJSON` の source（TileJSON に書かれた `attribution` と同じ値だけ）。Core が今作る source で提供元の申告を持つのは Google の地図だけで、TileJSON はアプリが `TileJSON` の source を渡したときの扱い
  - 箱は背景地図と重ね地図で分ける（下の段が背景地図。Google の地図ならロゴと Google の copyright の行。その上が重ね地図）。Google の地図に書いた `attr` も、Google の copyright と別の箱にして上に出す。同じ表示の文字は 1 回だけ出す（`attr` の `A &amp; B` と提供元の `A & B` は同じもの）
  - Google の copyright 以外の箱（`.maplat-attribution-clamp`）は 2 行までにし、超えた分は「…」で切る。箱は 2 行の高さと地図の幅を超えない。箱の中では段落・表・箇条書き・`pre` などを行の中の文字として（後ろに空白を入れて）並べ、画像は 1 行の高さまで縮める。切った出典の全文は UI の地図情報などで見せることを想定する。ただし今の版の `<maplat-ui>` の地図情報は今の地図のメタデータしか出さず、重ね地図のときの下の背景地図の `attr`・古地図の背面の背景地図・提供元の申告はそこに出ない（UI 側の直しは別の PR で行う）。Google の copyright は利用条件の "in full as provided" のため切らず、全文を折り返して出す
  - 言語は `<maplat-ui>` と同じ順で選び、地図の切り替えと `lang` 属性の変更で作り直し、要素を外す（`remove()`）と消える。位置は CSS の変数 `--maplat-attribution-right`・`--maplat-attribution-bottom`・`--maplat-attribution-max-width` で変えられ、`<maplat-ui>` の中では UI の部品に重ならない位置を既定にする（その数値も `--maplat-attribution-ui-*` の変数。変数は `maplat-app` の要素そのものに書く）
- IIIF の書誌の写し直しで、前回写した後に結び付けた鍵、前回は Manifest に値が無く写せなかった鍵、取り直した値で増えた言語も、写し直しの候補に出るようにした（`compareIiifCopy`）。これまでは候補に出ず、値を入れるには全部を上書きして写すしかなかった
  - 新しく出る候補は、欄にすでに値があれば（欄が言語の区別の無い文字列ならどの言語でも）人が直した扱いにし、既定では選ばない
- `proposeIiifBindings` の題名の既定を常に Manifest の `label` にした。読めなければ `title` を返さず、canvas の label に切り替えない。明示的な canvas の指定は引き続き使える
- `getMarker(id)` が、マーカーの描画と同じく祖先（POI のレイヤー → 地図 → アプリ）の `poiTemplate`・`iconTemplate` を当てた POI を返すようにした。これまでは格納しているデータをそのまま返していたため、`poiTemplate` で本文を作る POI を `@maplat/ui` の `openMarker()`・マーカー一覧・状態 URL（`om:`）から開くと本文が空になり、地図上のマーカーを押したときだけテンプレートが当たっていた（#150）。戻り値は `clickMarker` の detail と同じ形の複製で、格納している POI そのものではない。POI の書き換えは従来どおり `updateMarker` で行う
- `lngLatToClientPoint` が、古地図の紙の外の点で、背面の地図に描かれた位置（範囲外の POI のピンの位置）を返すようにした。これまでは前面の古地図の変換を紙の外へ延ばした位置を返していたため、紙から離れるほど、また縮尺を上げるほど背面のピンとずれた（館林のデモで縮尺 14.5 で 14〜65 px、16 で 100〜361 px）。範囲内の点は、ピンを置くときと同じ判定の前面の座標を返す。背面の無い古地図（`overlay: false`）の紙の外は従来どおり
- `clientPointToLngLat`、地図のクリックの `clickMapMerc`・`clickMap`、ポインタの移動の `pointerMoveOnMapMerc` が、古地図の紙の外の点で、背面の地図がそこに見せている地点を返すようにした。これまでは前面の古地図の変換を紙の外へ延ばした地点を返していたため、背面の地図に見えている地点と離れ、`lngLatToClientPoint` とも往復しなかった（館林のデモで、`clientPointToLngLat` の点を `lngLatToClientPoint` に戻すと縮尺 14.5 で最大 91 px、16 で最大 225 px ずれた）。戻り値の型は変えていない（変換できないときは従来どおりクラスは `undefined`・要素は `null`）。背面の無い古地図（`overlay: false`）・前面がメルカトルの地図（TMS・基本地図）・紙の内の点は従来どおり。`clickMapXy`・`pointerMoveOnMapXy` は前面の座標のまま、`getViewExtent` の 4 隅は従来どおり前面の変換で求める。紙の外で背面の画素が座標にならないときは、クリックは `clickMapXy` だけを出し（`clickMapMerc`・`clickMap` は出ない）、ポインタの移動は `pointerMoveOnMapXy` だけを出す。座標の判定や変換が失敗した移動も `pointerMoveOnMapMerc` を出さないだけで、その後の移動は従来どおり受け付ける（これまでは変換が失敗すると以後の `pointerMoveOnMapMerc` が出なくなった）

### Security
- 地図の右下の出典の表示（#191）は、提供元の申告（Google の copyright、TileJSON の `attribution`。第三者のサーバーから来うる値）を、地図の設定の `attr` より狭い許可表（`sanitizeHtml(text, { profile: "iiif" })`）で洗う。残すタグは `a`・`b`・`br`・`i`・`p`・`small`・`span`・`sub`・`sup`、属性は `http(s)` の `href` だけで、リンクには `rel="noopener noreferrer"` を付ける。外の値の `<a href="https://…"><img src="https://…" width="4000" height="4000"></a>` で、出典の箱が地図を覆い、地図全体が外へのリンクになり、外の画像を読みに行って見ている人の情報が第三者に渡ることを防ぐ。狭い許可表を通る長い値でも地図を覆わないよう、Google の copyright 以外の箱は 2 行まで（上の #191 の項目）。文字だけの Google の copyright と、文字とリンクの TileJSON の `attribution` はそのまま出る
- 状態 URL や `localStorage` から来る地図 ID・層 ID の引き当てを、自分の鍵（`Object.hasOwn`）だけに限った。存在しない ID は、継承した名前でも今までの未知の ID と同じ扱いになり、起動や以後の地図の切り替えに影響しない。公開メソッドの `addMarker`・`clearMarker` に渡す層 ID も同じ
- 地図 ID は文字列だけを受ける（公開の型のとおり）。地図の設定の `mapID: 5` のような数値の ID を `changeMap(5)`・`mapInfo(5)`・`startFrom: 5` のように数値のまま渡しても引き当たらない。文字列（`"5"`）で渡す
- 上記により、`poiTemplate`・`iconTemplate` の値（POI の名前・説明など）からの注入は起きにくくなった。ただし **Nunjucks もサンドボックスではない**: テンプレートの文字列そのものを第三者が書ける構成（第三者の POI JSON・地図 JSON を読む構成）では、引き続きページの権限でコードが動きうる。そのような構成では、信頼できないデータのテンプレートを使わないこと
- `sanitizeHtml` が残す `qy-swiper-slide` の属性は、要素を限った検査で POI の `media` と同じ選別（名前の許可表・URL の検査・テキスト化）を通す。ほかの要素にはこれらの属性を残さない
- `qy-swiper-slide`（POI の `media` とテンプレートの出力の両方）に渡す値の検査を足した。`caption` は文字参照で書いた HTML も取り除く。`image-type` は `image`・`panorama`・`youtube`・`video`・`3dmodel`・`gaussian` のどれか、`camera-position`・`camera-target` は数をコンマで並べた形、`show-texture` は `true`・`false` だけを残し、ほかの値は属性ごと落とす（テクスチャを消すには `false` と書く。`0`・`no`・`False` は落ちて表示のままになる）。`sanitizeHtml` は `target` のあるリンクに、値を問わず `rel="noopener noreferrer"` を付ける（従来は `target="_blank"` のときだけ）。旧い記法のテンプレートの判定は、入力の長さに比例する時間で終わる

## [1.2.0] - 2026-11-02

1.2.0-rc.1 と同じ内容の正式版です（版番号と、内部依存の指定を RC から正式版（^1.1.1）へ戻したことだけが違います）。変更点は 1.2.0-rc.1 までの各項を参照してください。

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
