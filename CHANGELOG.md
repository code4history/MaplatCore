# Changelog

このプロジェクトの主な変更を記録します。版数は [Semantic Versioning](https://semver.org/) に従います。

## [Unreleased]

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
