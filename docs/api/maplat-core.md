# MaplatApp API signatures

> Release-dependent signatures for `@maplat/core`.
> The release these signatures track is listed in the release block of the
> [README](../../README.md#quick-start).
> For the conceptual guide see the
> [Wiki API-Reference](https://github.com/code4history/MaplatCore/wiki/API-Reference).

> **Deprecated.** The `MaplatApp` class is deprecated and closes in the next major
> version (2.0). New code should use the `<maplat-app>` element instead; see
> [`maplat-app.md`](maplat-app.md) for its signatures and the migration table
> from the class. This document describes the 1.x class, which keeps working
> until 2.0.

All methods below are on the `MaplatApp` instance returned by
`MaplatApp.createObject(option)`.

## Map state & control

- `currentMapInfo(): object`
  - Get information about the currently active map.
- `mapInfo(mapID: string): object`
  - Get information about a specific map by its ID.
- `changeMap(mapID: string, restore?: object): Promise<void>`
  - Switch to a different map. `restore` object can optionally set initial
    position (x, y, zoom, rotation).
    `restore.transparency` (0–100, `0` included) sets the transparency of the new
    map; without it, the current transparency is kept across the map change.
- `requestUpdateState(data: object): Promise<void>`
  - Request an update to the map state (position, transparency, etc.).
- `getRotation(): number`
  - Get the current on-screen map rotation in degrees (same unit as
    `restore.position.rotation`).
- `getDirection(): Promise<number>`
  - Get the current real-world heading in degrees. On TIN-based historical
    maps this accounts for the local coordinate distortion, so the value can
    differ from `getRotation()`; it resolves asynchronously.

## Coordinate system

- `clientPointToLngLat(clientX: number, clientY: number): [number, number]`
  - Convert screen coordinates (pixels relative to viewport) to
    Longitude/Latitude.
- `lngLatToClientPoint(lng: number, lat: number): [number, number]`
  - Convert Longitude/Latitude to screen coordinates.

## Markers (point data)

- `addMarker(data: object, clusterId?: string): void`
  - Add a marker. `data` should contain `lng`, `lat`, `name`, `desc`
    (description), `icon`, etc.
  - `clusterId` specifies which layer to add the marker to (e.g., `'main'`,
    or specific map layer).
- `removeMarker(id: string): void`
  - Remove a specific marker by its ID (e.g. `'main_1'`).
- `updateMarker(id: string, data: object, overwrite?: boolean): void`
  - Update an existing marker's data (e.g. move position).
- `clearMarker(clusterId?: string): void`
  - Remove all markers from a specific cluster/layer.
- `selectMarker(id: string): void`
  - Programmatically select (highlight) a marker.
- `unselectMarker(): void`
  - Deselect the currently selected marker.
- `getMarker(id: string): object`
  - Get data for a specific marker.
- `setMarker(data: object): void`
  - Batch add/set markers. Useful for initialization or mass updates.
- `showAllMarkers(): void`
  - Make all markers visible.
- `hideAllMarkers(): void`
  - Hide all markers.

## Lines & vectors

- `addLine(data: object): string`
  - Add a line feature and return its id. `data`:
    `{ id?: string, lnglats: [[lng, lat], ...], stroke: { color: '#...', width: 2 } }`.
    Give `data.id` to use your own id; otherwise an id is generated
    automatically (unique within the app instance). Adding again with an
    existing id replaces the previous item. The passed `data` object is not
    modified.
- `addVector(data: object): string`
  - Add a line or polygon feature and return its id (same id rules as
    `addLine`). `data.type` of `"Line"` (or omitted) draws a line; any other
    value draws a polygon. Coordinates are given as `lnglats` (longitude/latitude) or
    `coordinates` (Web Mercator), with `style: { stroke?, fill? }`.
- `removeLine(id: string): boolean` / `removeVector(id: string): boolean`
  - Remove the single line/vector with the given id (not filtered by kind;
    `removeLine` is an alias of `removeVector`). Returns `true` if it was
    removed, `false` if no such id exists.
- `setLine(data: object): void` / `setVector(data: object): void`
  - Batch set lines/vectors. `setVector` draws without registering, so the
    item is not redrawn when the map is switched.
- `resetLine()` / `resetVector()` / `resetMarker()`
  - Clear and reset basic lines/vectors/markers (often used for default
    layers).
- `clearLine(filter?: { type?: "Line" | "Polygon" })` / `clearVector(filter?)`
  - Without an argument, clear all lines and polygons (as before).
    `{ type: "Line" }` clears lines only, `{ type: "Polygon" }` clears
    polygons only. `clearLine` is an alias of `clearVector`.

## POI layers

Maplat manages markers in "layers". Each layer has both a local `id` and a
`namespaceID` of the form `"<mapID>#<layerId>"` for map-derived layers (app-level
layers use the same value for both). Pass `namespaceID` to `showPoiLayer`,
`hidePoiLayer`, `addPoiLayer`, and `removePoiLayer` when targeting map-derived
layers.

- `addPoiLayer(id: string, data: object): void`
  - Create a new POI layer. `data` can define default icons.
- `showPoiLayer(id: string): void`
  - Show a specific layer. If the layer is not found, a `console.warn` is emitted
    and the call is a no-op.
- `hidePoiLayer(id: string): void`
  - Hide a specific layer. If the layer is not found, a `console.warn` is emitted
    and the call is a no-op.
- `removePoiLayer(id: string): void`
  - Remove a layer. If the layer is not found, a `console.warn` is emitted and the
    call is a no-op.
- `getPoiLayer(id: string): PoiLayer | undefined`
  - Retrieve a layer by `namespaceID` (or bare app-level `id`). Returns `undefined`
    if not found. No warning is emitted (used internally for state restoration).
- `listPoiLayers(hideOnly?: boolean, nonzero?: boolean): PoiLayer[]`
  - Get a list of available layers, ordered as defined in the app config
    (`main` is always first; the rest keep their declared order rather than
    being alphabetically sorted). Each entry is a `PoiLayer` object with `id`,
    `namespaceID`, `name`, `pois`, and optional `hide` / `icon` /
    `selectedIcon` fields.
  - The optional fields are the **resolved** values. They may come from either
    of two levels: the POI source's own `FeatureCollection.properties`, or a
    per-reference override supplied by the layer ref (wrapper) in
    `setting.pois`. `listPoiLayers` does not report which level a value came
    from — see [Override resolution](#override-resolution) for the rule.

### Override resolution

A layer ref (wrapper) element of `setting.pois` has the form
`{ layer: <URL | FeatureCollection>, hide?, title?, icon?, selectedIcon? }`.
The referenced FeatureCollection is fetched and normalised first, then the
override keys are merged onto the resulting layer.

- **Override wins over `FeatureCollection.properties` of the same name.**
- Only the four keys above are override keys. **Unknown keys are dropped with
  a `console.warn`** — no exception is thrown, so a wrapper written for a newer
  release stays loadable on an older one.
- `title` maps to `PoiLayer.name`; `icon` / `selectedIcon` map to the
  same-named fields. `hide: true` (boolean `true` only) sets `hide`; other
  values leave the source-side value untouched.
- Internal layer keys (`pois` / `id` / `namespaceID`) are not override keys and
  cannot be set from a wrapper.
- The wrapper object passed in is **not mutated**, so the same source file can
  be referenced by several maps/apps and presented differently in each.

## GPS & user position

- `handleGPS(enable: boolean): void`
  - Turn GPS tracking on or off.
- `getGPSEnabled(): boolean`
  - Check if GPS tracking is currently active.
- `setGPSMarker(position: object): void`
  - Manually update the GPS marker position (usually handled automatically
    if GPS is on).

## Event handling

Use `app.addEventListener(type, callback)` to handle events.

- `clickMarker`: Fired when a marker is clicked. `evt.detail` contains marker
  data.
- `clickMap`: Fired when the map background is clicked.
- `gps_result`: Fired when a GPS position update happens.
- `gps_error`: Fired when GPS fails.

## Advanced: direct map and source construction

For embedding apps that need to build a map or a tile source without going
through `MaplatApp` (for example, MaplatEditor's preview panes), the package
also exports the lower-level building blocks directly:

- `MaplatMap` — the OpenLayers `Map` subclass used internally by `MaplatApp`.
- `mapSourceFactory` — the factory function that builds a `MaplatSource` for
  a given map definition.
- `MaplatSource` / `BackmapSource` (types only) — the source interfaces
  returned by `mapSourceFactory`.

These exist so that host applications can construct maps and sources
directly instead of deep-importing internal modules.

## Example

```javascript
MaplatApp.createObject(option).then(function (app) {
  // Show current map info
  console.log(app.currentMapInfo());

  // Event listener
  app.addEventListener('clickMarker', function (evt) {
    console.log('Marker clicked:', evt.detail);
    app.selectMarker(evt.detail.namespaceID);
  });

  // Add a custom marker
  app.addMarker(
    {
      lng: 141.1501111,
      lat: 39.69994722,
      name: 'Morioka Castle',
      desc: 'Historical site in Morioka',
      icon: 'parts/blue_marker.png',
    },
    'main',
  ); // 'main' is the default layer
});
```
