# MaplatCore 仕様更新における懸念事項

## 1. @maplat/transform の型定義拡張について

### 現状
- MaplatCoreでは、`src/types/@maplat/transform.d.ts`で@maplat/transformの`Transform`インターフェースを拡張している
- 以下のプロパティを追加で定義：
  - `xyBounds: Feature<Polygon>`
  - `mercBounds: Feature<Polygon>`
  - `priority: number`
  - `importance: number`
  - `wh?: number[]`
  - `xy?: number[]`

### 懸念点
- これらのプロパティは@maplat/transformの`Transform`クラスには実際には存在しない
- MaplatCore特有のプロパティを外部ライブラリの型に追加することは、型の整合性の観点から問題がある可能性がある
- @maplat/transformのバージョンアップ時に型定義の競合が発生する可能性がある

### 考えられる解決策
1. **ラッパークラスの作成**
   - MaplatCore側で`Transform`をラップするクラスを作成
   - 追加プロパティはラッパークラスで管理
   
2. **インターフェースの分離**
   - `Transform`を継承した`MaplatTransform`インターフェースを定義
   - MaplatCore内では`MaplatTransform`を使用

3. **@maplat/transformへの機能追加**
   - 必要なプロパティを@maplat/transform側に追加
   - ただし、ライブラリの責務の観点から適切でない可能性もある

### 優先度
中〜高（型安全性とメンテナンス性に関わるため）

### 関連ファイル
- `/mnt/blockstorage/dev/MaplatCore/src/types/@maplat/transform.d.ts`
- `/mnt/blockstorage/dev/MaplatCore/src/source/histmap_tin.ts`（これらのプロパティを使用）
- `/mnt/blockstorage/dev/MaplatCore/src/source/store_handler.ts`

### 記録日
2025-06-25