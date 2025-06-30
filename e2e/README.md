# E2Eテストについて

## テスト戦略

このプロジェクトでは、E2Eテスト用に専用のHTMLファイル（`e2e-test.html`）を使用しています。

### なぜテスト専用HTMLを使用するのか

#### 本番HTMLとテストHTMLの違い

**本番HTML (`index.html`)**:
```javascript
window.addEventListener('DOMContentLoaded', async () => {
  window.Maplat = MaplatApp;
  Maplat.createObject(option).then(function (app) {
    // 初期化処理
  });
});
```

**テストHTML (`e2e-test.html`)**:
```javascript
// 即座にグローバル変数として設定
window.Maplat = MaplatApp;
window.MaplatApp = MaplatApp;

// 初期化
MaplatApp.createObject(option).then(function (app) {
  window.maplatApp = app;
});
```

#### 技術的な理由

1. **モジュール読み込みのタイミング問題**
   - 本番HTMLでは`DOMContentLoaded`イベント内でMaplatAppが定義される
   - PlaywrightがページロードしてもすぐにはMaplatが利用できない
   - `waitForFunction`でMaplatの存在を待つ必要があるが、タイミングが不安定

2. **Viteの開発モードとES6モジュール**
   - 開発環境ではViteがES6モジュールを動的に読み込む
   - 本番ビルドとは異なる読み込み方式
   - テスト環境での再現性を高めるために同期的な読み込みが必要

3. **テストの信頼性**
   - 非同期イベントに依存しないテストが書ける
   - 初期化の成功/失敗を確実に検証できる
   - デバッグが容易

### このアプローチの妥当性

テスト専用HTMLを使用することは、多くのフロントエンドプロジェクトで採用されている標準的なアプローチです：

1. **React/Vue/Angularなどのフレームワーク**でも、E2Eテスト用に簡略化されたエントリーポイントを使用
2. **Storybookなどのツール**も、コンポーネントを独立した環境でテスト
3. **実際にテストしているのはライブラリの機能**であり、HTMLの構造ではない

### テスト対象

- Maplatライブラリの基本機能（初期化、API）
- 地図の切り替え機能
- マーカーやレイヤーの操作（今後追加予定）

### 本番環境のテスト

本番環境に近い条件でのテストは、以下の方法で実施：

1. **ビルド後のテスト**: `npm run build` 後に `dist/index.html` をテスト
2. **統合テスト**: 実際の地図データを使用したテスト
3. **手動テスト**: ブラウザでの動作確認

### 将来の改善案

本番HTMLでのテストを可能にするには：

1. **MaplatAppのグローバル公開タイミングの変更**
   - モジュール読み込み直後にグローバル変数として公開
   - DOMContentLoaded内では初期化のみ実行

2. **テストヘルパーの追加**
   - MaplatAppの初期化状態を確認するAPIの追加
   - テスト用のイベントフックの実装

## テストの実行

```bash
# 開発環境でのE2Eテスト
pnpm test:e2e

# CI環境でのE2Eテスト（Chromiumのみ）
pnpm test:e2e:ci

# デバッグモード
pnpm test:e2e:ui
```