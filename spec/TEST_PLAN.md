# MaplatCore テスト計画

## 1. 既存テストのVitest対応
- [x] **spec/pois.spec.ts**: POI機能のテスト → Vitestに対応
- [x] **spec/template.spec.ts**: テンプレート機能のテスト → Vitestに対応  
- [ ] **spec/puppeteer.spec.js**: E2Eテスト → PlaywrightでE2Eテスト環境構築後に対応

## 2. 新規テストの追加

### 優先度高（Playwrightなしで実装可能）
1. **MaplatApp基本機能テスト** (spec/maplat-app.spec.ts)
   - [ ] インスタンス作成
   - [ ] 地図切り替え (changeMap)
   - [ ] マーカー操作 (addMarker, removeMarker, clearMarker)
   - [ ] マーカー選択 (selectMarker, unselectMarker)

2. **座標変換テスト** (spec/transform.spec.ts)
   - [ ] @maplat/transformの動作確認
   - [ ] 前方変換・逆変換の精度テスト
   - [ ] エッジケースの処理（地図範囲外など）

3. **ソースファクトリーテスト** (spec/source-factory.spec.ts)
   - [ ] 各種地図ソースの作成
   - [ ] NowMap (OSM/GSI)の初期化
   - [ ] HistMapの初期化
   - [ ] エラーハンドリング

### 優先度中（一部Playwright必要）
4. **GPS機能テスト** (spec/geolocation.spec.ts)
   - [ ] GPS ON/OFF
   - [ ] fakeGpsモード
   - [ ] 地図外での動作
   - [ ] エラーイベント

5. **イベントシステムテスト** (spec/events.spec.ts)
   - [ ] clickMap, clickMarker（要Playwright）
   - [ ] gps_result, gps_error
   - [ ] sourceLoaded, appReady

### 優先度低（Playwright必要）
6. **UI機能テスト** (spec/ui.spec.ts)
   - [ ] 透明度調整
   - [ ] 回転・方向リセット
   - [ ] ホームボタン
   - [ ] レイヤー表示/非表示

## 3. E2Eテスト（Playwright導入後）
- [ ] 実際のブラウザでの統合テスト
- [ ] 各種ブラウザでの動作確認
- [ ] モバイルデバイスのエミュレーション

## 注記
- Vitestでは、DOM操作やイベント処理の基本的なテストが可能
- 実際の地図描画やユーザーインタラクションのテストにはPlaywrightが必要
- 現時点では、ロジック部分のユニットテストに集中する