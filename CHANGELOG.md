# Changelog

このプロジェクトの主な変更を記録します。版数は [Semantic Versioning](https://semver.org/) に従います。

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
