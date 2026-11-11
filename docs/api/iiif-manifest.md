# IIIF Manifest の読み取り

`listIiifCanvases` は Presentation 2・3 の canvas を列挙します。画像サービスの `id` と `@id` は Presentation の版と独立に読みます。サービスが配列なら、画像サービスでないものや空の ID を飛ばし、最初に読めた画像サービスを選びます。型（`type`／`@type`）があるサービスは `ImageService1`〜`ImageService3` だけを画像サービスとします。Image API 2 で従来使われる型のないサービスは、`@context` か `profile` に `iiif.io/api/image/` を含む URI、または `level0`〜`level2` の profile があるものだけを受け付けます。型のない認証サービス（`/api/auth/` を含むもの）と annex のサービス（`annex/services` を含むもの）は、画像サービスより前にあっても画像として選びません。型も Image API の印もないサービスも選びません。

`proposeIiifBindings` の題名は Manifest の `label` を使います。読めない場合、canvas の `page 1` などへ切り替えず、題名の結び付けを省きます。空の言語配列は値として写さず、空白だけの言語値も既定の結び付けを作る根拠にしません。

`resolveIiifMetadata` の書誌表（`copiedMetadata`）では、値が空の行（`{"en": []}`・空の文字列・空白だけの値・空の配列・値のない行など）を警告なしで捨てます。写す側から見て、空の行には写す価値がないためです。中身があって形の読めない値（数や入れ子の配列など）の行は、これまでどおり「metadata の値の形が読めません」と警告して捨てます。題名など結び付けた鍵の判定は別で、空の `label` は読めない値として扱います。

canvas の `width`・`height` は描画領域の寸法です。配信画像の実画素数とは限らないため、画像の大きさを照合する呼び出し側は画像サービスの `info.json` を使います。このモジュール自体は通信しません。

対象は先頭の画像アノテーションの単一画像 body です。複数画像の合成、Choice、外部 AnnotationPage の読み込みは扱いません。サービスを複数列挙していても、通信失敗時に別候補へ自動再試行する API ではありません。

参照: [Presentation 3 の service](https://iiif.io/api/presentation/3.0/#service)、[IIIF Cookbook の画像サービス](https://iiif.io/api/cookbook/recipe/0005-image-service/)。
