# MaplatCore API リファレンス

本ディレクトリは `@maplat/core` の**リリース依存 API シグネチャ**を保持します。

ADR-0012 は Maplat の文書群を2層に分けます:

- **リリース依存シグネチャ**（メソッド名・引数・戻り値）— 本 `docs/api/` ディレクトリ。リリースごとに更新します。
- **リリース非依存の概念解説**（利用パターン・設計メモ）— [Wiki API-Reference](https://github.com/code4history/MaplatCore/wiki/API-Reference)。

シグネチャは意図的に Wiki 側へ重複保持せず、Wiki から本ディレクトリへリンクします。

## ファイル

- [`maplat-core.ja.md`](maplat-core.ja.md) — `MaplatApp` クラスのシグネチャ
  （地図状態・座標系・マーカー・ライン/ベクター・POI レイヤー・GPS・イベント）
- [`maplat-app.ja.md`](maplat-app.ja.md) — Custom Element `<maplat-app>`
  （`@maplat/core/element`: 属性とプロパティ・状態・委譲するメソッドと要素固有のメソッド・
  イベント・`uiHooks`）、共通の土台 `@maplat/core/common`、適合テスト
  `@maplat/core/conformance`、`MaplatApp` クラス（次のメジャー版 2.0 で閉じる）との関係

## README との関係

README のクイックスタート節はシグネチャを本ディレクトリへ、概念解説を Wiki へ導線します。
インストール・最小利用例は [../../README.ja.md](../../README.ja.md) を参照してください。
