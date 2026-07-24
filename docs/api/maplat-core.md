# MaplatApp API signatures

> Release-dependent signatures for `@maplat/core` (`0.13.2`).
> For the conceptual guide see the
> [Wiki API-Reference](https://github.com/code4history/MaplatCore/wiki/API-Reference).

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
- `requestUpdateState(data: object): Promise<void>`
  - Request an update to the map state (position, transparency, etc.).

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

- `addLine(data: object): void`
  - Add a line feature. `data`:
    `{ lnglats: [[lng, lat], ...], stroke: { color: '#...', width: 2 } }`.
- `addVector(data: object): void`
  - Add a polygon/vector feature (GeoJSON compatible).
- `setLine(data: object): void` / `setVector(data: object): void`
  - Batch set lines/vectors.
- `resetLine()` / `resetVector()` / `resetMarker()`
  - Clear and reset basic lines/vectors/markers (often used for default
    layers).
- `clearLine()` / `clearVector()`
  - Clear all lines/vectors.

## POI layers

Maplat manages markers in "layers".

- `addPoiLayer(id: string, data: object): void`
  - Create a new POI layer. `data` can define default icons.
- `showPoiLayer(id: string): void`
  - Show a specific layer.
- `hidePoiLayer(id: string): void`
  - Hide a specific layer.
- `listPoiLayers(hideOnly?: boolean, nonzero?: boolean): string[]`
  - Get a list of available layer IDs.

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
