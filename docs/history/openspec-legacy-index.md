# MaplatCore openspec 時代の開発履歴索引

> 本ファイルは openspec ワークフロー（〜2026年）時代に作成された開発提案・記録を、那由多開発サイクル形式の履歴として集約した索引です。
> 原文は `docs/history/openspec-legacy/<change-id>/` 配下にそのまま保存されています（内容は変更していません）。
> 那由多開発サイクルについては `docs/superpowers/`（存在する場合）を参照してください。
>
> 「推定時期」は、各 change の `proposal.md` に対して `git log --follow --diff-filter=A -1` を実行して得た**作成日**（そのファイルが最初にリポジトリへ追加されたコミットの日付）を記載しています。archive 化の際にディレクトリ名へ日付プレフィックスが付与される・リネームされるケースがあるため、ディレクトリ単位ではなくファイル単位で `--follow` を適用し、archive 日ではなく作成日を実測しています。

## 開発提案一覧（openspec/changes、archive済み + 未archive、計13件）

| change-id | 由来 | 推定時期 | 目的 | 実装状況 | 現在の扱い | 原文 |
|---|---|---|---|---|---|---|
| 2025-12-13-issue-59-rotation-mutation | archive済み | 2025-12-10（398500d） | Issue #59対応。`restore.position` の `rotation`/`direction` が初期化・`changeMap` 時に破壊的変更されてしまう不具合を、入力オブジェクトの複製により解消する。 | 完了 | 完了・削除対象 | [原文](openspec-legacy/2025-12-13-issue-59-rotation-mutation/) |
| 2025-12-18-weiwudi-vite-pnpm | archive済み | 2025-12-18（8fdee06） | CommonJS遺物・Webpack残骸・UMDグローバル破損等の技術的負債（Issue #60/#62/#64/#65）を解消し、ビルド・CIの安定性を回復する。 | 完了 | 完了・削除対象 | [原文](openspec-legacy/2025-12-18-weiwudi-vite-pnpm/) |
| add-map-blend-control | archive済み | 2025-12-08（32c60a6） | 歪み補正済み historical tile と現行ベースマップをフェード比較できる第一級のUI（ブレンドコントロール）を追加し、CSSによる場当たり実装を解消する。 | 完了 | 完了・削除対象 | [原文](openspec-legacy/add-map-blend-control/) |
| cleanup-legacy-files | archive済み | 2025-12-08（419bb60） | プロジェクトルートに散在する不要ファイル（zip・重複ドキュメント・Denoサポート等）を整理し、開発者・AIエージェント双方にとっての見通しを改善する。 | 完了 | 完了・削除対象 | [原文](openspec-legacy/cleanup-legacy-files/) |
| fix-playwright-e2e-test | archive済み | 2025-12-08（32c60a6） | `morioka` 地図切替後にキャンバスがビューポート外へスクロールしCIのE2Eテストが `clickMap` で止まる不具合を、`scrollIntoViewIfNeeded` 呼び出し等で修正する。 | 完了 | 完了・削除対象 | [原文](openspec-legacy/fix-playwright-e2e-test/) |
| issue-66-migration | archive済み | 2025-12-21（17e5a77） | メンテナンスされていない依存関係を除去し、ビルドシステムを現行のプロジェクト標準へ整合させる。 | 完了 | 完了・削除対象 | [原文](openspec-legacy/issue-66-migration/) |
| remove-commonjs-and-verify-consumption | archive済み | 2025-12-14（23e1b27） | ESM/UMD/Node/CDN/セルフホスト等、様々な消費方法でMaplatCoreが正しく動作することを検証するスモークテストを整備し、回帰を防止する。 | 完了 | 完了・削除対象 | [原文](openspec-legacy/remove-commonjs-and-verify-consumption/) |
| update-readme | archive済み | 2025-12-09（8fab32c） | Deno関連の陳腐化した記述を除去し、インストール手順・OpenLayers peer dependency記載を最新化、日本語版README（README.ja.md）を新設する。 | 完了 | 完了・削除対象 | [原文](openspec-legacy/update-readme/) |
| add-viewpoint-getters | 未archive | 2026-07-04（90bfec9） | `app.mapObject.getView().getRotation()` のような内部実装への直接アクセスと度数⇔ラジアン変換をconsumer側に強いていた非一貫なインターフェースを解消し、`getRotation()`/`getDirection()` を公式APIとして提供する。 | 完了（実装確認済み・4/4） | 完了・削除対象 | [原文](openspec-legacy/add-viewpoint-getters/) |
| cicd-etc | 未archive | 2025-12-24（8716272） | パッケージマネージャーバージョン強制の欠如・散らかったビルド出力構造・Turf.js依存の重複・一貫しないデプロイワークフローを標準化する提案。 | 未実装（0/0、記述レベルの提案） | queued_future登録済み（m12-t25。§2.5の人間確認手順を実施） | [原文](openspec-legacy/cicd-etc/) |
| export-map-primitives | 未archive | 2026-07-04（90bfec9） | MaplatEditorがカスタム地図投影・ソース管理のために `src/map_ex.ts`/`src/source_ex.ts` への深い内部importを強いられていた問題を解消し、`MaplatMap`/`mapSourceFactory` を公式exportとして提供する。 | 完了（実装確認済み・3/3） | 完了・削除対象 | [原文](openspec-legacy/export-map-primitives/) |
| remove-i18n-dependency | 未archive | 2025-12-14（23e1b27） | i18n状態（現在の言語設定等）はUIレイヤーの責務でありCoreロジックに属さないという方針のもと、`i18next` 依存とローカライズロジックをCoreから除去しステートレス化する。 | 完了（実装確認済み。`i18next` はsrc/package.jsonに不残存） | 完了・削除対象 | [原文](openspec-legacy/remove-i18n-dependency/) |
| use-quyuan | 未archive | 2025-12-21（a5bac88） | Code for Historyの標準テンプレート処理ライブラリQuyuan（`@c4h/quyuan`）へ、現行の `lodash.template` ベースの独自継承ロジックから移行する提案。 | 未実装（0/3。`template_works.ts` は現在も `lodash.template` を import、`@c4h/quyuan` は package.json に不在） | queued_future登録済み（m12-t26。§2.5の人間確認手順を実施） | [原文](openspec-legacy/use-quyuan/) |

## 当時のプロジェクト概要（参考・陳腐化済み）

| 項目 | 推定時期 | 目的 | 現状との乖離 | 原文 |
|---|---|---|---|---|
| project.md | 2025-12-08（32c60a6） | openspecワークフロー導入時点でのMaplatCoreプロジェクト概要・規約を記述したもの。 | 那由多開発サイクル移行（本索引作成）により、開発プロセス・ドキュメント体系は本ファイル群へ置き換わっている。参考情報として保存。 | [原文](openspec-legacy/_project-snapshot/project.md) |
| specs/ci/spec.md | 2025-12-18（8fdee06） | CI関連仕様（weiwudi-vite-pnpm由来）。 | 完了済み変更の仕様記録として保存。現行CI設定の正本ではない。 | [原文](openspec-legacy/_project-snapshot/specs/ci/spec.md) |
| specs/consumption/spec.md | 2025-12-18（8fdee06） | ESM/UMD/Node/CDN等の消費方法に関する仕様（remove-commonjs-and-verify-consumption由来）。 | 完了済み変更の仕様記録として保存。 | [原文](openspec-legacy/_project-snapshot/specs/consumption/spec.md) |
| specs/build/spec.md | 2025-12-18（8fdee06） | ビルド関連仕様（weiwudi-vite-pnpm由来）。 | 完了済み変更の仕様記録として保存。 | [原文](openspec-legacy/_project-snapshot/specs/build/spec.md) |
