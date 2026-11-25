# 古地図の座標変換データ

[English](map-data.md)

`maps/<mapID>.json` の地図は、三角網（TIN）と world file を層ごとに選べます。
本図は最上位、副層は `sub_maps` の各要素に変換の設定を書きます。
画像の配信と地図の書誌は、従来の古地図と同じ鍵を使います。

## world file の層

`tinEnabled: false`・`crs`・`worldFile` を書きます。
本図では画素単位の正の有限な `width` と `height` が必要です。
副層では画像座標で 3 頂点以上の多角形 `bounds` と、従来の
`priority`・`importance` を指定します。
`tinEnabled: false` と `compiled` キーを同じ層に書くと読み込みエラーになります。
制御点（`gcps`）と辺（`edges`）はこの変換には使いません。

```json
{
  "tinEnabled": false,
  "width": 512,
  "height": 512,
  "crs": { "epsg": 4326 },
  "worldFile": {
    "xScale": 0.00002,
    "xSkew": 0,
    "xOrigin": 139.80001,
    "ySkew": 0,
    "yScale": -0.00002,
    "yOrigin": 36.00999
  }
}
```

**world file の出力と三角網の地理側の座標は、CRS の公式な軸順に関わらず東・北の順です。**
EPSG:4326 は経度・緯度、日本の平面直角座標系は東距・北距の順で書きます。

標準の world file の 6 行は上から `xScale`、`ySkew`、`xSkew`、`yScale`、
`xOrigin`、`yOrigin` です。最後の 2 つは**左上画素の中心**の CRS 座標です。
Maplat の連続した画像座標は左上の**角**が原点なので、左上画素の中心は
`(0.5, 0.5)` です。

```text
東 = xScale · (x − 0.5) + xSkew  · (y − 0.5) + xOrigin
北 = ySkew  · (x − 0.5) + yScale · (y − 0.5) + yOrigin
```

標準の `.tfw` は係数をそのまま写します。画像の角を原点として求めた係数から作る場合は、
`xOrigin` に `0.5 · (xScale + xSkew)`、`yOrigin` に
`0.5 · (ySkew + yScale)` を足します。

画像の y は下向きで、地理側の y は北向きです。係数はすべて有限で、行列式
`xScale · yScale − xSkew · ySkew` は負である必要があります。
行列式が 0 の非正則な係数と、正の鏡像の係数は読み込みエラーになります。
鏡像になった場合は `yScale` の符号を確かめてください。

## 三角網の層と外周

`tinEnabled` を省略するか `true` とし、三角網を `compiled` に置きます。
本図の大きさは `compiled.wh`、副層の境界は `bounds` または
`compiled.bounds` から読みます。`compiled` も `tinEnabled: false` の宣言も
無い未作成の副層は読み飛ばします。

三角網の地理側に使う座標系は、`compiled` と同じ階層の `crs` に書きます。
外周の方式は `compiled.outerTransform` で、既定の `"extrapolate"` は
扇形外挿です。`"worldFile"` なら、四辺形の外は `compiled.worldFile` で変換し、
`compiled.vertices_points` に境界の頂点列を持ちます。
三角網の層で `compiled` と同じ階層にある `worldFile` と
`outerTransform` は読み飛ばします。

## CRS と配布

`crs` は `epsg`・`authority`・`code`・`proj4`・`wkt` を持てる
オブジェクトです。三角網の層で `crs` を省略すると EPSG:3857 になります。
数値の `epsg: 3857` と `epsg: 4326` には内蔵式を使います。この 2 つの
コードに `proj4` を併記するときは、内蔵式で判定できる同等の定義を使ってください。
矛盾する定義や判定できない定義は読み込みエラーになります。

それ以外の座標系には `proj4` 定義が必要です。例えば JGD2011 の平面直角 IX 系は、
次の定義を東・北の順で使います。

```json
{
  "epsg": 6677,
  "proj4": "+proj=tmerc +lat_0=36 +lon_0=139.833333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs"
}
```

定義と EPSG 番号や `authority`・`code` の一致はデータの作成時に確認してください。
Core は内蔵の 2 系統以外を識別子から検索しません。`+axis` は省略するか
`+axis=enu` を指定します。WKT のみの定義、パイプライン、グリッドを使う定義は
読み込めません。`+nadgrids=@null` は使えます。定義のエラーには地図 ID が出ます。

ES 版は必要な層を読むときに proj4js を取得します。ES 版を自分で配信する場合は、
生成されたチャンクを `maplat_core.js` と同じディレクトリに置いてください。
UMD 版は proj4js を同梱します。

**world file 未対応の古い MaplatEditor では、この形式の地図を開いたり取り込んだりしないでください。**
変換の鍵が失われ、制御点があると三角網の地図へ変わることがあります。
対応前の Core は、`compiled.wh` が無い world file の本図を読み込みエラーにします。
