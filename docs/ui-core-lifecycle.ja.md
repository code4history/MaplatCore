# UI/Core Lifecycle

## 概要
MaplatCore は初期化順序を明示するためにライフサイクルフェーズを発火します。
Maplat UI やカスタム実装は `appOption.uiHooks` でこれらのフェーズに接続できます。
各フェーズは Promise を返せます。Core は解決を待ってから次に進みます。

## フェーズ順序
1. `lifecycle:setting-loaded`
2. `lifecycle:appdata-ready`
3. `lifecycle:ui-configure`
4. `lifecycle:core-dom-ready`
5. `lifecycle:ui-dom-ready`
6. `lifecycle:core-ready`
7. `lifecycle:ui-ready`

## コンテキスト
各フェーズは次のコンテキストを渡します。
- `phaseId`
- `appData`（利用可能な場合）
- `mapDivDocument`（利用可能な場合）
- `core`（MaplatCore インスタンス）
- `uiHookResults`（フック戻り値の蓄積）
- `uiHookResult`（このフェーズの戻り値）

## フック
`appOption.uiHooks` で以下を登録できます。
- `onSettingLoaded`
- `onAppdataReady`
- `onUiConfigure`
- `onCoreDomReady`
- `onUiDomReady`
- `onCoreReady`
- `onUiReady`

各フックは値または Promise を返せます。戻り値は `uiHookResults` に保存されます。

## エラーハンドリング
フックが例外を投げる/Promise を reject すると、Core は以下を行います。
- `lifecycle:error` を `{ phaseId, error }` で発火
- 以降のフェーズ進行を停止

## 移行メモ
旧イベント（`appdata` / `uiPrepare`）は標準 UI では使用しません。
カスタム実装は `lifecycle:*` か `uiHooks` へ移行してください。
