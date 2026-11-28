# Historical map coordinate data

[日本語](map-data.ja.md)

A map in `maps/<mapID>.json` can use a triangulated irregular network (TIN), a
world file, or both in different layers. Use the same conversion fields at the
top level for the main map and in each `sub_maps` entry for an inset. Image
delivery and map metadata use the ordinary historical map settings.

## World-file layer

Set `tinEnabled: false` and provide `crs` and `worldFile`. The main map needs
positive, finite `width` and `height` in pixels. An inset needs a `bounds`
polygon with at least three vertices in image coordinates, plus the usual
`priority` and `importance` values. A layer with `tinEnabled: false` and a
`compiled` key fails to load. GCPs and edges have no effect on this conversion.

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

**World-file outputs and TIN geographic coordinates always use east, north
order**, including longitude, latitude for EPSG:4326 and easting, northing for
Japan's plane rectangular coordinate systems.

A standard world file lists the six coefficients in the order `xScale`,
`ySkew`, `xSkew`, `yScale`, `xOrigin`, `yOrigin`. The last two give the
CRS coordinate at the **center of the upper-left pixel**. Maplat's continuous
image coordinates start at the upper-left **corner**, so that center is
`(0.5, 0.5)`.

```text
east  = xScale · (x − 0.5) + xSkew  · (y − 0.5) + xOrigin
north = ySkew  · (x − 0.5) + yScale · (y − 0.5) + yOrigin
```

Copy coefficients from a standard `.tfw` as-is. If the affine coefficients
were fitted with the image corner as origin, add
`0.5 · (xScale + xSkew)` to `xOrigin` and
`0.5 · (ySkew + yScale)` to `yOrigin`.

The image y axis points down and northing points up. All six coefficients must
be finite and the determinant `xScale · yScale − xSkew · ySkew` must be
negative. Zero is non-invertible and a positive value indicates a mirrored
map. Check the sign of `yScale` if the map is unexpectedly mirrored.

## TIN layer and its outer region

Omit `tinEnabled` or set it to `true` and supply a `compiled` TIN. The main
map takes its dimensions from `compiled.wh`. An inset takes its boundary from
`bounds` or `compiled.bounds`. Core skips unfinished insets that have
neither a compiled TIN nor `tinEnabled: false`.

Set the layer's `crs` alongside `compiled` if the TIN's geographic
coordinates use a different CRS. Inside `compiled`, the default outer method
is `outerTransform: "extrapolate"` (fan extrapolation). A TIN produced with
`compiled.outerTransform: "worldFile"` uses `compiled.worldFile` outside
the surrounding quadrilateral. The compiled form includes the ordered boundary
in `vertices_points`. Core ignores `worldFile` and `outerTransform` placed
alongside `compiled` on a TIN layer.

## Viewpoint conversion mode (`viewpointMode`)

Set the top-level `viewpointMode` key to choose how viewpoints (center, scale,
direction) convert between the old map and the modern map. The whole map (the
main map and every inset) shares one value; do not write it inside `sub_maps`
entries.

| Value | Meaning |
| --- | --- |
| (omitted) | Same as `"grid"` |
| `"grid"` | Dynamic grid: the map is split into cells and each point uses its own scale and rotation (default) |
| `"constant"` | One fixed scale and rotation for the whole map |

`"grid"` gives an exact round trip (a viewpoint returns to its original
position, zoom and rotation) and moves smoothly across TIN boundaries. It suits
maps with large distortion or changing projections. `"constant"` suits maps
whose direction and scale are nearly uniform. Any value other than `"constant"`
and `"grid"` is dropped on load and behaves like an omission.

## CRS and distribution

`crs` is an object with optional `epsg`, `authority`, `code`, `proj4`,
and `wkt` fields. An omitted `crs` on a TIN means EPSG:3857. Set `epsg` to
the number `3857` or `4326` to use the built-in conversion. If you include
a `proj4` definition for one of those codes, use a recognized equivalent
definition. Conflicting or unrecognized definitions are rejected.

For other systems, provide a `proj4` definition. For example, JGD2011 Japan
Plane Rectangular CS IX uses the following definition in east, north order.

```json
{
  "epsg": 6677,
  "proj4": "+proj=tmerc +lat_0=36 +lon_0=139.833333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs"
}
```

The map author verifies that the definition matches its EPSG or
authority/code identifier. Core does not look up other definitions by ID.
Omit `+axis` or use `+axis=enu`. WKT-only definitions, transformation
pipelines, and grid shifts are unsupported, except for `+nadgrids=@null`.
Errors in the map definition include the map ID.

The ES build loads the proj4js chunk on demand for a layer that needs it.
When self-hosting the ES build, deploy the generated chunks alongside
`maplat_core.js`. The UMD distribution bundles proj4js.

**Avoid opening or importing world-file maps in MaplatEditor versions that
predate world-file support.** Those versions can discard the fields and
generate a TIN from any control points. Core versions that predate support
reject a world-file main map because it has no `compiled.wh`.
