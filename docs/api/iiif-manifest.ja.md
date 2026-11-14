# IIIF Manifest の読み取り

[English](iiif-manifest.md)

`src/iiif/manifest.ts` の関数（`listIiifCanvases`・`proposeIiifBindings`・`resolveIiifMetadata`・`compareIiifCopy`・`iiifRightsToLicense`・`IIIF_BINDABLE_KEYS`）の読み方を説明します。これらはパッケージの公開 API ではありません。`package.json` の公開の入口（`exports`）には無く、互換も保証しません。MaplatEditor などの作成の道具が使う内部の関数です。

## canvas の一覧（`listIiifCanvases`）

`listIiifCanvases` は Presentation 2・3 の canvas を列挙します。画像サービスの `id` と `@id` は Presentation の版と独立に読みます。サービスが配列なら、画像サービスでないものや空の ID を飛ばし、最初に読めた画像サービスを選びます。型（`type`／`@type`）があるサービスは `ImageService1`〜`ImageService3` だけを画像サービスとします。Image API 2 で従来使われる型のないサービスは、`@context` か `profile` に `iiif.io/api/image/` を含む URI、または `level0`〜`level2` の profile があるものだけを受け付けます。型のない認証サービス（`/api/auth/` を含むもの）と annex のサービス（`annex/services` を含むもの）は、画像サービスより前にあっても画像として選びません。型も Image API の印もないサービスも選びません。

canvas の `width`・`height` は描画領域の寸法です。配信画像の実画素数とは限らないため、画像の大きさを照合する呼び出し側は画像サービスの `info.json` を使います。このモジュール自体は通信しません。

## 既定の結び付け（`proposeIiifBindings`）

`proposeIiifBindings` の題名は Manifest の `label` を使います。読めない場合、canvas の `page 1` などへ切り替えず、題名の結び付けを省きます。空の言語配列は値として写さず、空白だけの言語値も既定の結び付けを作る根拠にしません。

## 値の読み方（`resolveIiifMetadata`）

IIIF の値（`label`・`summary`／`description`・`requiredStatement`／`attribution`・metadata の `label` と `value` など）は、文字列、版 2 の言語つきの値（`{"@value", "@language"}`）とその配列、版 3 の言語の表を読みます。

値の中に配列の中の配列があるときは、平らにして中の値を読みます。たとえば metadata の値が `["Creator", ["作者名"]]` なら、`Creator` と `作者名` の 2 つを読みます。複数の値は、題名など文字として入る鍵では ` / `、HTML として入る鍵と metadata の値では `<br>` でつなぎます。入れ子をたどる深さには上限（32 段）があり、自分自身を含む（循環する）値でも止まります。

書誌表（`copiedMetadata`）では、値が空の行（`{"en": []}`・空の文字列・空白だけの値・空の配列・入れ子の配列の中まで空の値・値のない行など）を警告なしで捨てます。写す側から見て、空の行には写す価値がないためです。中身があって形の読めない値（数、循環する値、深さの上限を超えた入れ子など）の行は、「Manifest の metadata の値の形が読めません」（canvas の行は「canvas の …」）と警告して捨てます。ただし、読める値が 1 つでもあれば、読めない部分だけを警告なしで外して行を残します。

題名など結び付けた鍵の判定は書誌表とは別です。値が無い（空の文字列を含む）ときは「鍵 〈鍵〉 の IIIF の値がありません」、空の言語の表のように値はあっても読めないときは「鍵 〈鍵〉 の IIIF の値の形が読めません」と警告し、その鍵を未解決（`unresolved`）にします。ライセンス（`rights`／`license`）は URI の文字列だけを読み、警告の文は「IIIF の値」の代わりに「ライセンスの値」になります。

## 写した値との比べ方（`compareIiifCopy`）

`compareIiifCopy(current, copiedValues, fresh, lang)` は、鍵・言語ごとに 1 行（`{ key, lang, humanEdited, iiifChanged }`）を返します。人が直したか（`humanEdited`）は今の地図の値と前回写した時点の値（`copiedValues`）で、IIIF の側が変わったか（`iiifChanged`）は前回写した時点の値と取り直した値（`fresh`）で見ます。今の IIIF の値と今の地図の値は直接比べません。今の地図の値が文字列なら、`lang` の言語の値として比べます。

取り直した値（`fresh`）を渡すと、前回写した値に無い鍵・言語も行になります。写した後で新しく結び付けた鍵、前回は Manifest に値が無く写せなかった鍵、取り直した値で増えた言語がこれに当たります。これらの行は IIIF の側が変わった（`iiifChanged: true`）とし、写した時点の値が無いので、人が直したかは今の地図にその言語の値があるかで決めます。

行の順は、`copiedValues` の鍵ごとに前回写した言語、続けてその鍵で増えた言語を並べ、最後に `copiedValues` に無い鍵を取り直した値の順に並べます。`fresh` を渡さない（`undefined`）ときは、`copiedValues` にある鍵・言語だけを返し、`iiifChanged` は `undefined` です。

## 扱わないもの

対象は先頭の画像アノテーションの単一画像 body です。複数画像の合成、Choice、外部 AnnotationPage の読み込みは扱いません。サービスを複数列挙していても、通信失敗時に別候補へ自動再試行する API ではありません。

参照: [Presentation 3 の service](https://iiif.io/api/presentation/3.0/#service)、[IIIF Cookbook の画像サービス](https://iiif.io/api/cookbook/recipe/0005-image-service/)。
