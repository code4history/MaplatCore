# `<maplat-app>` element API signatures

> Release-dependent signatures for the `<maplat-app>` Custom Element of
> `@maplat/core`.
> The release these signatures track is listed in the release block of the
> [README](../../README.md#quick-start).
> For the `MaplatApp` class see [`maplat-core.md`](maplat-core.md).
> For the conceptual guide see the
> [Wiki API-Reference](https://github.com/code4history/MaplatCore/wiki/API-Reference).

`<maplat-app>` is the element form of the Maplat map ("layer A"). It is the
common entry point shared by MaplatCore (`implementation: "core"`) and the
commercial MaplatCore-Pro (`implementation: "core-pro"`): a page or a UI layer
written against the element runs on either implementation. The viewer element
`<maplat-ui>` of `@maplat/ui` is built on this surface.

The `MaplatApp` class is deprecated and remains available in the 1.x releases
(it closes in the next major version, 2.0); the two changes made to it are
listed in [Relationship to the `MaplatApp` class](#relationship-to-the-maplatapp-class).

## Getting started

```typescript
import 'ol/ol.css';               // REQUIRED: OpenLayers CSS
import '@maplat/core/element';    // registers <maplat-app> (side effect)
```

```html
<!-- reads the setting file apps/morioka.json -->
<maplat-app app-id="morioka"></maplat-app>

<script type="module">
  const el = document.querySelector('maplat-app');
  await el.ready;
  el.addEventListener('mapChanged', (e) => console.log(e.detail.mapID));
  el.addMarker({ lnglat: [141.152, 39.7006], name: 'Morioka Castle' }, 'main');
</script>
```

- `@maplat/core/element` is an ES module entry (`dist/maplat_core_element.js`).
  It imports `@maplat/core` and `@maplat/core/common`, so it needs a bundler or
  an import map, and the `ol` peer dependency. There is no UMD build of the
  element.
- The element is the map container itself (the role of `appOption.div`). It
  renders into its **light DOM**; the children are owned by the element — do not
  modify them. Default style:
  `:where(maplat-app){display:block;position:relative;overflow:hidden;height:400px}`
  (`:where()` has zero specificity, so any page CSS wins).
- The map is created when the element is connected and at least one of
  `app-id`, `app-src`, `setting` or `appOption` is given. Keys set in the same
  task as the connection are all taken into account.
- Removing the element from the document disposes the map (the former
  `remove()`). Moving it within the same task (detach and re-attach before the
  next microtask) does not dispose it. `el.remove()` is the standard
  `HTMLElement.remove()`. To switch to another app, replace the element.
- If another implementation has already registered `<maplat-app>`, the import
  does not redefine it and warns
  (`<maplat-app> is already defined by another implementation; …`).
- TypeScript: `import type { MaplatAppElement } from '@maplat/core/element'`
  (also exported from `@maplat/core/common`). `HTMLElementTagNameMap` is
  augmented, so `document.querySelector('maplat-app')` is typed.

## Attributes and properties

Every attribute has a camelCase property that reads and writes the **same
value** (the last write wins). Precedence when the same key is given in several
places:

```
property / attribute  >  the same key in appOption  >  setting file  >  default
```

"Given" is decided by `undefined` (`false`, `0` and `""` are given values).
Assigning `null` to a property resets the key (and removes the attribute).

### Attribute values

| Kind | Attribute string → value | Property → attribute |
|---|---|---|
| boolean | **attribute absent = unspecified**; `""`, `"true"` or the attribute's own name = `true`; `"false"` = `false`; anything else warns and is unspecified | `true` → `attr=""`; `false` → `attr="false"`; `null` → attribute removed |
| number | `Number(s)`; `""` is unspecified; `NaN` warns and is unspecified | `String(n)` |
| string | as is; `""` is unspecified | as is |

Boolean attributes are interpreted by **value**, not by presence, so that a
setting-file value can be cancelled from HTML (`north-up="false"`). Writing
`<maplat-app north-up>` still means `true`.

### Attribute-backed keys

"Startup" keys are fixed once the map is created (see
[Startup-only keys](#startup-only-keys)).

| Attribute | Property | Type | Startup | Change after startup | Legacy `appOption` |
|---|---|---|---|---|---|
| `app-id` | `appId` | string | yes | — | `appid` (default `"sample"`) |
| `app-src` | `appSrc` | string | yes | — (URL of the setting file; default `apps/${appId}.json`) | — |
| `map-id` | `mapId` | string | no | `changeMap(mapId)`. An unusable id warns and the attribute is reverted to the current map. **Written back** when the map changes | `restore.mapID` |
| `transparency` | `transparency` | number (0–100) | no | `setTransparency(n)`. **Written back** (once per frame) when the transparency changes | `restore.transparency` |
| `no-rotate` | `noRotate` | boolean | yes | — | `noRotate` |
| `north-up` | `northUp` | boolean | no | Takes effect from the next viewpoint operation (`goHome`, `setViewpoint`) | `northUp` |
| `home-margin-pixels` | `homeMarginPixels` | number | no | From the next `goHome` (default 50; `0` is valid) | `homeMarginPixels` |
| `always-gps-on` | `alwaysGpsOn` | boolean | yes | — | `alwaysGpsOn` |
| `fake` | `fake` | boolean | yes | — | `fake` |
| `enable-cache` | `enableCache` | boolean | yes | — | `enableCache` |
| `restore-session` | `restoreSession` | boolean | yes | — | `restoreSession` |
| `overlay` | `overlay` | boolean | yes | — | `overlay` |
| `debug` | `debug` | boolean | no | Changes the log level | `debug` |
| `icon` / `selected-icon` | `icon` / `selectedIcon` | string | no | Redraws the markers | `icon` / `selectedIcon` |
| `no-center-marker` | `noCenterMarker` | boolean | no | Hides the centre marker. Applied to the DOM immediately (does not wait for `ready`) | — |
| `center-marker-src` | `centerMarkerSrc` | string | no | Replaces the centre-marker image (class `maplat-center-marker--custom` is added). Applied immediately | — |
| `display-mode` | `displayMode` | string | — | **MaplatCore-Pro only** (`supports("display-mode")`). MaplatCore warns once per key (`<maplat-app>: ignored unsupported attribute "display-mode"`) and ignores it; the property reads `undefined` | — |

### Property-only keys

| Property | Type | Startup | Change after startup | Legacy `appOption` |
|---|---|---|---|---|
| `setting` | object | yes | — (the setting-file content itself; when given the file is not fetched) | `setting` |
| `restore` | `Restore` | yes | — | `restore` |
| `restoreExtensionKeys` | `string[]` | yes | — (extension keys to restore from `localStorage` with `restoreSession`) | `restoreExtensionKeys` (new in this release) |
| `googleApiKey` | string | yes | — (keys are property-only; never attributes) | `googleApiKey` |
| `mapboxToken` | string | yes | — | `mapboxToken` |
| `maplibregl` / `mapboxgl` | library object | yes | — (default `window.maplibregl` / `window.mapboxgl`) | same |
| `uiHooks` | object | yes | — (see [`uiHooks`](#uihooks)) | `uiHooks` |
| `appOption` | object | yes | — (migration entry; see below) | the whole object |
| `poiTemplate` / `poiStyle` / `iconTemplate` | string | no | Redraws the markers | same |

Removing a runtime attribute (or assigning `null`) after startup returns the
key to the next source: the same key in `appOption`, then (for the template
keys) the setting file, then the default. Two exceptions: removing `map-id`
leaves the displayed map as it is, and removing `transparency` sets the
transparency to 0.

### Startup-only keys

`appId`, `appSrc`, `setting`, `noRotate`, `alwaysGpsOn`, `fake`, `enableCache`,
`restoreSession`, `overlay`, `googleApiKey`, `mapboxToken`, `maplibregl`,
`mapboxgl`, `uiHooks`, `restore`, `restoreExtensionKeys`, `appOption`
(`ELEMENT_STARTUP_KEYS` of `@maplat/core/common`).

Once the map is created, changing one of these — by attribute or by property —
is **ignored with a warning**, once per key:

```
<maplat-app>: attribute "app-id" is fixed at startup and cannot be changed after the map is created; the change was ignored.
```

The property keeps returning the value that was used at startup. The map is
not re-created; to change an app, replace the element. When the element is
removed and re-attached, the keys are read again.

### Attribute write-back

State that changes through the map itself (a UI, a method call, a restored
state) is written back to the attribute **for keys that have one**:
`map-id` (on every `mapChanged`, before the event is dispatched, so a listener
can read `el.mapId`), `transparency` (coalesced to once per animation frame;
written as `transparency="0"` at startup) and, on MaplatCore-Pro,
`display-mode`. A write-back is not treated as an attribute change (no loop),
and a pending change made by the page wins over it. The viewpoint and the GPS
state have no attribute; read them with the properties and events below.

### Setting-file keys the element does not read

The setting file holds **content** (`sources`, `pois`, `homePosition`,
`defaultZoom`, `appName`, `lang`, `splash`, `poiTemplate`, `poiStyle`,
`iconTemplate`, …). **Presentation (feature) keys** are given to the element,
not to the setting file. The element does not read `noRotate`, `northUp`,
`homeMarginPixels`, `tapDuration`, `tapUIVanish` or `controls` from the setting
file; a file that still has one gets one warning per key:

```
<maplat-app>: the setting file key "northUp" is a presentation (feature) setting and is ignored; give it as an attribute or property of the element instead.
```

`fakeGps` / `fakeRadius` are not read either (silently; the fake GPS is decided
by `fake` alone).

The `MaplatApp` class still reads these keys from the setting file but warns
that this is deprecated and will be removed in the next major version (2.0).

### `appOption` (migration entry)

`el.appOption = { … }` accepts a whole legacy `appOption` object. `appId` is
accepted as an alias of `appid` and `tapUiVanish` of `tapUIVanish`. Its keys
are weaker than the individual attributes and properties; `div` is replaced by
the element itself. One exception: `appOption.setting` (the setting-file
content) is stronger than the `app-src` attribute, because the order of the
setting-file sources is `setting` > `app-src` > `apps/${appId}.json`. The
entry closes in the next major version (2.0). Keys that begin with `__` are
internal to Maplat — do not use them.

## State (read-only properties)

- `ready: Promise<void>`
  - Resolves when the map is ready. Rejects if the map cannot be created (for
    example `app-src` fails to load:
    `<maplat-app>: failed to load <url> (<status>)`). Only re-placing the
    element yields a new Promise.
- `implementation: "core" | "core-pro"`
  - The implementation name (`"core"` for this package). Use it for logs and
    reports; branch on `supports()` instead.
- `version: string`
  - The implementation's version (`@maplat/core`'s version).
- `appData: Readonly<object> | null`
  - The setting-file content (a frozen shallow copy). Readable from
    `lifecycle:appdata-ready`; `null` before.
- `initialRestore: Readonly<Restore>`
  - The restore values used at startup (`restore`, `map-id`, `transparency`,
    `localStorage` with `restore-session`).
- `state: Readonly<Restore>`
  - The current state (a copy of the former `stateBuffer`). Changes are
    reported by `updateState`.
- `currentMapId: string | null`
  - The mapID of the displayed map.
- `viewpoint: Viewpoint | null`
  - The current viewpoint (the detail of the last `changeViewpoint`).
- `gpsEnabled: boolean`
  - Whether GPS tracking is on (same as `getGPSEnabled()`).

## Methods

### Delegated methods (`MAPLAT_APP_METHODS`)

The 46 public methods of `MaplatApp` exist on the element under the same names
and delegate to the map. Arguments and behaviour are those of
[`maplat-core.md`](maplat-core.md); differences are noted below.

- Called before the map object exists, they throw a `DOMException`
  (`InvalidStateError`): `<maplat-app>.changeMap(): the map is not created yet (…)`.
  That is the case while the element is not connected, while none of `app-id`,
  `app-src`, `setting` or `appOption` is given, **and in the same task right
  after connecting** (the map object is created in a later microtask). Call
  them after `await el.ready`.
- Called while the map is being created (the map object exists but is not
  ready), they return a Promise that waits for `ready` and then runs the method.

| Group | Methods |
|---|---|
| Map state & control | `currentMapInfo(): object`, `mapInfo(mapID): object`, `changeMap(mapID, restore?): Promise<unknown>`, `requestUpdateState(partial: Partial<AppState>): void`, `getRotation(): number`, `getDirection(): Promise<number>`, `setViewpoint(cond)`, `goHome()`, `resetRotation()`, `resetDirection()`, `resetCirculation()`, `getMapMeta(mapID?): MapMeta \| undefined`, `setTransparency(percentage): void` (also writes back the `transparency` attribute), `getTransparency(): number` |
| Coordinate system | `clientPointToLngLat(clientX, clientY): Promise<{ longitude, latitude } \| null>`, `lngLatToClientPoint(longitude, latitude): Promise<{ x, y } \| null>` — the element resolves `null` where the class resolves `undefined` |
| Markers | `addMarker(data, clusterId?)`, `removeMarker(id)`, `updateMarker(id, data, overwrite?)`, `clearMarker(clusterId?)`, `selectMarker(id)`, `unselectMarker()`, `getMarker(id): MaplatPoi \| undefined`, `showAllMarkers()`, `hideAllMarkers()` |
| Lines & vectors | `addLine(data): string`, `addVector(data): string`, `removeLine(id): boolean`, `removeVector(id): boolean`, `clearLine(filter?)`, `clearVector(filter?)` |
| POI layers | `listPoiLayers(hideOnly?, nonzero?): PoiLayer[]`, `getPoiLayer(id): PoiLayer \| undefined`, `showPoiLayer(id)`, `hidePoiLayer(id)`, `addPoiLayer(id, data)`, `removePoiLayer(id)` |
| GPS | `handleGPS(enable, avoidEventForOff?)` (may fire `gpsEnabledChanged`), `getGPSEnabled(): boolean`, `setGPSMarker(position)` |
| Tile cache | `getMapCacheEnable(mapID?): boolean`, `getMapTileCacheStatsAsync(mapID?): Promise<{ size?, count?, total?, percent? }>`, `getMapTileCacheSizeAsync(mapID?): Promise<number>`, `clearMapTileCacheAsync(mapID?): Promise<void>`, `fetchAllMapTileCacheAsync(mapID, callback): Promise<void>`, `cancelMapTileCacheAsync(mapID?): Promise<void>` |

Not on the element: `mapObject`, `from`, `cacheHash`, `mapDivDocument`,
`stateBuffer`, the class's `remove()` (the element's `remove()` is the DOM
standard one, which disposes the map by detaching the element) and the internal
methods of the class (`setMarker`, `setLine`, `setVector`, `resetLine`, …). Use the element-specific methods below
instead. The `app` getter that returns the inner `MaplatApp` is an internal
migration escape hatch, not part of the public surface, and will be removed in
the next major version (2.0).

### Element-specific methods (`ELEMENT_OWN_METHODS`)

- `getViewpoint(): Viewpoint | null`
  - The current viewpoint (same as the `viewpoint` property). `null` before the
    map is ready.
- `listMaps(): MapListItem[]`
  - The usable maps in the order of the setting file's `sources`. Each item has
    `mapID`, `label`, `thumbnail` (`string | null`), `isBasemap`, `isOldMap`,
    `isOverlay`, `hasEnvelope` and `cacheEnable`. `[]` before the map is ready.
- `supports(feature: string): boolean`
  - Feature query. Answers before the map is ready; unknown names are `false`.
    MaplatCore: `tile-cache`, `mapbox`, `pointer-move`, `envelopes` are `true`;
    `display-mode`, `display-mode:map-warp` are `false`.
- `setEnvelopes(items: EnvelopeSpec[]): void`
  - Draws the extent of maps as outlines and fills:
    `{ mapID, stroke?: { color, width?, lineDash? }, fill?: string }`. The
    current historical map is drawn as the four corners of its image; other
    maps as their `getMapEnvelope`. Redrawn in the new map's coordinates on
    every map change; `[]` clears.
- `getMapEnvelope(mapID: string): LngLat[] | null`
  - The extent of a map as a longitude/latitude polygon (the last vertex does
    not repeat the first). `null` for a map without an envelope.
- `getViewExtent(): LngLat[] | null`
  - The four corners of the viewport (top-left, top-right, bottom-right,
    bottom-left) in longitude/latitude. Updated on every `changeViewpoint`;
    `null` before the first one or when the corners cannot be converted.
- `zoomBy(delta: number): void`
  - Changes the zoom of the current map by `delta` (animated, 250 ms).
- `getDefaultPinIcon(selected?: boolean): string`
  - The default pin image used for markers without an `icon` (the selected
    image when `selected` is true). Answers before the map is ready.

Pro-only methods (`setDisplayMode`, `getDisplayMode`) are **not defined** on
the MaplatCore element; check `supports("display-mode")` before calling them.

## Events (`MAPLAT_APP_EVENTS`, `ELEMENT_OWN_EVENTS`)

All events are DOM `CustomEvent`s dispatched from the element with
`bubbles: true`, `composed: false`, `cancelable: false`. The names are those of
the `MaplatApp` class, so existing listeners keep their names. The detail types
are exported from `@maplat/core/common` (`MaplatAppEventDetailMap`,
`MaplatAppEvent<K>`).

| Event | `detail` | When |
|---|---|---|
| `lifecycle:setting-loaded`, `lifecycle:appdata-ready`, `lifecycle:ui-configure`, `lifecycle:core-dom-ready`, `lifecycle:ui-dom-ready`, `lifecycle:core-ready`, `lifecycle:ui-ready` | `{ phaseId, appData }` — the internal `core`, `mapDivDocument` and `uiHookResults` of the class event are **not** included | The lifecycle phases, in the former order |
| `lifecycle:error` | `{ phaseId, error }` | A `uiHooks` hook failed |
| `sourceLoaded` | `{ mapID: string \| null; usable: boolean }[]` (the class passes the source objects) | Right after the sources are loaded, including the ones that failed |
| `mapChanged` | `MapMeta` (`mapID`, `label`, `title`, `license`, …) | A map change completed (`map-id` has already been written back) |
| `changeViewpoint` | `Viewpoint` (`x`, `y`, `longitude`, `latitude`, `mercator_x`, `mercator_y`, `zoom`, `mercZoom`, `direction`, `rotation`) | The viewpoint changed |
| `updateState` | `AppState` (= `Restore`) | The state changed (throttled) |
| `outOfMap` | `{}` | The view left the map |
| `poi_number` | `number` | The number of displayed POIs changed |
| `clickMarker` / `clickMarkers` | `MaplatPoi` / `MaplatPoi[]` (`clickMarkers` follows synchronously, all markers under the point) | A marker was clicked |
| `clickMap` / `clickMapXy` / `clickMapMerc` | `{ longitude, latitude }` / `[x, y]` / `[mx, my]` | The map was clicked |
| `pointerMoveOnMapXy` / `pointerMoveOnMapMerc` | `[x, y]` / `[mx, my]` | The pointer moved |
| `gps_request` / `gps_result` / `gps_error` | none / `{ lnglat, acc } \| { error }` / error name | GPS |
| **new** `gpsEnabledChanged` | `{ enabled: boolean }` | `gpsEnabled` changed (including internal switches) |
| **new** `moveStart` / `moveEnd` | `{}` / `Viewpoint \| null` | A continuous viewpoint change began / stopped for 150 ms |

MaplatCore-Pro also fires `modechange` and `viewchange`; MaplatCore does not.

## `uiHooks`

`el.uiHooks` (or `appOption.uiHooks`) takes the same hook object as the class
(`onSettingLoaded` … `onUiReady`). In the element path the hook's
`context.core` **and** `context.mapDivDocument` are the **element**, not the
`MaplatApp` instance / container `div`. The hook object itself is not modified
(`this` inside a hook is still your object), so the same object can be given to
the class path, where `context.core` stays a `MaplatApp`.

## POI template syntax

`poiTemplate` and `iconTemplate` (given to `<maplat-app>`, to `MaplatApp`, in the
setting file, or on a POI layer) are evaluated with [Nunjucks](https://mozilla.github.io/nunjucks/templating.html)
through Quyuan's `@c4h/quyuan/template` since **@maplat/core 1.3.0**. Until 1.2 they were
evaluated with lodash.template; that syntax is **no longer evaluated** (see
"Detection of the old syntax" below). The POI's properties are the template variables.

| lodash.template (up to 1.2) | Nunjucks (from 1.3) | Notes |
|---|---|---|
| `<%= name %>` (not escaped) | `{{ name \| safe }}` | `{{ name }}` HTML-escapes in 1.3. Use `\| safe` only when you want to output HTML (`sanitizeHtml` on the UI side still applies) |
| `<%- name %>` (HTML-escaped) | `{{ name }}` | |
| `${name}` (ES interpolation; lodash evaluated this by default too) | `{{ name }}` | |
| `<% if (a) { %>…<% } else { %>…<% } %>` | `{% if a %}…{% else %}…{% endif %}` | |
| `<% list.forEach(x => { %>…<%= x %>…<% }) %>` | `{% for x in list %}…{{ x }}…{% endfor %}` | |
| `!a` / `a && b` / `a \|\| b` | `not a` / `a and b` / `a or b` | |
| `typeof a === "string"` | `a is string` | `is number` and `is defined` also work |
| `name.ja` | `name.ja` (same) | A missing key is an empty string |
| `<% var x = …; %>` | `{% set x = … %}` | |
| `"icon": "<%= url %>"` in `iconTemplate` | `"icon": {{ url \| dump \| safe }}` | **`iconTemplate` produces JSON, so use `dump` + `safe`.** `"{{ url }}"` breaks URLs that contain `&`, `"` or `<` |
| Arbitrary JavaScript | Write it with filters (`dump`, `lower`, `replace`, …) | JavaScript is not part of the syntax. Nunjucks is not a sandbox, though: there are ways around this, so do not evaluate untrusted templates (see the note below) |
| Outputting `<%`, `%>` or `${`…`}` literally | Wrap it in `{% raw %}…{% endraw %}` | Otherwise it hits the detection below and is not evaluated |
| (new) A slider in the POI info window | `<qy-swiper><qy-swiper-slide image-url="{{ … }}" image-type="image" caption="{{ … }}"></qy-swiper-slide></qy-swiper>` | From 1.3. Only the attributes allowed by `sanitizeHtml` remain |

### Detection of the old syntax

Each template string is checked before it is evaluated:

```text
S   = the template with the contents of {% raw %}…{% endraw %} and {% verbatim %}…{% endverbatim %} removed
old = S matches /<%[\s\S]*?%>/  (<% %>, <%= %>, <%- %>)
   or S matches /\$\{[^}]*\}/   (${ })
```

- A template in the old syntax is **not evaluated** (neither by Nunjucks nor by lodash).
  It is treated as if it were absent: a `poiTemplate` moves on to the next level (the
  layer, the map, the app; that level's `poiStyle` is not used either), and an
  `iconTemplate` falls back to the `icon` of the same level, or to the next level.
- The page gets **one** `console.warn` that names the first such template (its first 80 characters).
- A template that fails to render (a syntax error, or an `iconTemplate` whose output is
  not a JSON object) is treated the same way, with a separate single `console.warn`.
  Rendering of the map does not stop.
- To output `<%` or `${` literally, wrap the part in `{% raw %}…{% endraw %}`
  (for example `{% raw %}<p>${price}</p>{% endraw %}`).
- One case is not detected: an old template that contained no lodash syntax but wrote
  `{{ }}` or `{% %}` as literal text is now evaluated by Nunjucks.

**Nunjucks is not a sandbox.** Values (a POI's name, description and so on) cannot
inject code through `{{ }}`, but a template string written by an untrusted party can
still run code with the page's privileges. Do not use templates from untrusted POI or
map data.

### Sliders in the info window

From **@maplat/core 1.3.0**, `sanitizeHtml` keeps two elements in the template output, so
a `poiTemplate` can show a media slider ([Quyuan](https://github.com/code4history/Quyuan)):

```html
<qy-swiper has-thumb>
  {% for m in media %}
  <qy-swiper-slide image-url="{{ m.url }}" image-type="image" caption="{{ m.caption }}"></qy-swiper-slide>
  {% endfor %}
</qy-swiper>
```

| Element | Attributes that remain | Checks on the value |
|---|---|---|
| `<qy-swiper>` | `has-thumb`, `autoplay` | Boolean: the value is dropped (`has-thumb=""`) |
| `<qy-swiper-slide>` | `image-url`, `thumbnail-url`, `material-url` | URL: relative paths, `/…`, `//…` and `http(s):` only. Dropped if the value contains a quote, a backquote, `<`, `>` or whitespace |
| | `caption` | Turned into plain text (HTML in the value is removed) |
| | `image-type`, `camera-position`, `camera-target`, `show-texture` | Kept as they are |
| | `fit-to-container`, `debug-mode` | Boolean: the value is dropped |

- These are the same checks as a POI's `media`. Any other attribute on these two elements
  (`class`, `style`, `on*`, …) is removed, and these attribute names are not kept on other elements.
- **A boolean attribute in a template is true when it is present**, whatever its value:
  `fit-to-container="false"` is still true (this is how HTML and the element read it).
  In a POI's `media`, a boolean key is written only when its value is truthy.
- `cc-swiper`, `cc-swiper-slide`, `qy-viewer` and `cc-viewer` are not allowed (the elements
  are removed; their text stays). Use `qy-swiper` and `qy-swiper-slide`.
- Showing the slider needs **@maplat/ui 1.3 or later**, which registers the elements.
  @maplat/core itself does not register them.

## `@maplat/core/common` — the shared base for other implementations

`@maplat/core/common` (`dist/maplat_core_common.js`) holds everything that
does not depend on the map engine: it imports neither OpenLayers nor the tile
cache, and registers no element. Use it to write another layer-A implementation
or a layer-B element on top of `<maplat-app>`:

- Name tables: `MAPLAT_APP_TAG`, `MAPLAT_APP_EVENTS`, `ELEMENT_OWN_EVENTS`,
  `LIFECYCLE_PHASES`, `MAPLAT_APP_METHODS`, `ELEMENT_OWN_METHODS`,
  `LAYER_A_PRO_METHODS`, `LAYER_A_PRO_EVENTS`, `LAYER_A_STATE_PROPERTIES`,
  `ELEMENT_ATTRIBUTES`, `ELEMENT_PROPERTIES`, `LAYER_A_PRO_ATTRIBUTES`,
  `LAYER_A_PRO_PROPERTIES`, `ELEMENT_STARTUP_KEYS`, `APP_OPTION_ALIASES`,
  `LAYER_A_FEATURES` / `LAYER_A_FEATURE_NAMES` / `featuresOf(implementation)`,
  and the layer-B tables `MAPLAT_UI_TAG`, `MAPLAT_UI_ATTRIBUTES`,
  `MAPLAT_UI_EVENTS`, `MAPLAT_UI_METHODS`.
- Value helpers: `parseAttributeValue`, `formatAttributeValue`,
  `propToAttributeName`, `attributeToPropName`, `unsupportedKeyMessage`.
- Types: `MaplatAppElement`, `MaplatUiElement`, `Viewpoint`, `MapMeta`,
  `MapListItem`, `Restore` / `AppState`, `EnvelopeSpec`, `MaplatPoi`,
  `PoiLayer`, `MaplatAppEventDetailMap`, … and type guards (`isViewpoint`,
  `isMapMeta`, `isMapListItem`, `isMaplatPoi`, `isPoiLayer`,
  `isSourceLoadedDetail`, `isLifecycleDetail`, `isLngLat`).
- The element shell: `MaplatAppElementBase` (abstract class),
  `defineMaplatAppElementOnce(ctor, tagName?, label?)`,
  `injectMaplatAppStyle(document)`, and the types `LayerAImplementation`,
  `ElementStartupConfig`, `RuntimeValueResolver`, `MaplatAppElementProSettings`.
- Helper functions. Also exported from `@maplat/core`: `sanitizeHtml`,
  `escapeAttr`, `toPlainText`, `buildSlideAttrs`, `createElement`, `assets`.
  Exported from `@maplat/core/common` only: `normalizeArg`, `META_KEYS`,
  `META_KEYS_OPTION`.

`@maplat/core/element` itself exports the element class `MaplatAppElement`,
`defineMaplatAppElement(tagName?)` (registers the element under another tag
name; the default tag is registered by the import), the name tables above that
the element uses, and the deprecated type aliases `MaplatViewpoint` /
`MaplatMapListItem` (use `Viewpoint` / `MapListItem` from
`@maplat/core/common`).

A layer-A implementation extends `MaplatAppElementBase`, which already
provides the attribute/property table, creation and disposal, event
re-dispatch, startup-key locking and the 46 delegated methods. The subclass
supplies `implementation`, `version`, `features()`,
`createImplementation(config)` (returns an object with the shape of
`MaplatApp`: `waitReady`, `addEventListener`, `removeEventListener`, the
delegated methods, `appData`, `stateBuffer`, …), `listMaps`, `setEnvelopes`,
`getMapEnvelope`, `getViewExtent`, `zoomBy` and `getDefaultPinIcon`, and may
override the hooks (`applyRuntimeChanges`, `convertEventDetail`,
`onImplementationReady`, `disposeImplementation`, `applyDomKeys`, …). Register
it with `defineMaplatAppElementOnce(MyElement, "maplat-app", "my package")`.

## `@maplat/core/conformance` — conformance tests for layer A

`@maplat/core/conformance` (`dist/maplat_core_conformance.js`) runs the shared
layer-A test cases against **any** `<maplat-app>` implementation through its
public surface only, and ships a mock implementation for testing a layer-B
element without a map.

- `runLayerAConformance(options, { describe, it })`
  - Registers the cases with a test runner (Vitest, Jest, …).
- `runLayerAConformanceInPage(options, onResult?): Promise<ConformanceResult[]>`
  - Runs the cases inside a page (for browser tests) and returns
    `{ group, name, ok, error?, ms }[]`.
- `createLayerAConformanceCases(options): ConformanceCase[]`
  - The raw cases (`{ group, name, run() }`) for other runners.
- `options: LayerAConformanceOptions`
  - `implementation` (expected value), `register` (a function that registers the
    element; called more than once), `fixture: { attributes?, properties?,
    initialMapId, otherMapId, envelopeMapId? }`, optional `tagName`,
    `expectedFeatures`, `capabilities: { layout? }`, `timeout`.
- `ConformanceError`
  - The error thrown by a failing case.
- Mock layer A: `defineMockMaplatApp(tagName?, options?)`,
  `createMockMaplatAppClass(options?)`, `getMockLayerAController(el)`,
  `MockLayerAApp`; types `MockSource`, `MockLayerAOptions`
  (`{ implementation?, version?, features? }`).

```typescript
import { describe, it } from 'vitest';
import { runLayerAConformance } from '@maplat/core/conformance';

runLayerAConformance(
  {
    implementation: 'core',
    register: () => import('@maplat/core/element'),
    fixture: { attributes: { 'app-id': 'morioka' }, initialMapId: 'morioka_ndl', otherMapId: 'morioka' },
  },
  { describe, it },
);
```

## Relationship to the `MaplatApp` class

In the 1.x releases `@maplat/core` exposes both the `MaplatApp` class and the
element, and the two share one implementation. The class keeps working; what
changed in it with this release is (1) assigning a startup-only field
(`appid`, `enableCache`, `noRotate`, `alwaysGpsOn`, `overlay`, `googleApiKey`,
`restoreSession`, `initialRestore`, `uiHooks`, …) after construction is ignored
with a warning, and (2) reading a feature key from the setting file warns that
it is deprecated. It also accepts `appOption.div` as an element and
`appOption.restoreExtensionKeys`. The class is deprecated and **closes in the
next major version (2.0)**, which keeps the element API only. MaplatCore-Pro
provides the element API only.

| `MaplatApp` class | `<maplat-app>` |
|---|---|
| `new MaplatApp({ div, appid, … })` / `MaplatApp.createObject(option)` | `<maplat-app app-id="…">` + attributes / properties; `await el.ready` |
| `app.waitReady` | `el.ready` |
| `appOption.div` | the element itself |
| `app.addEventListener(name, fn)` (OpenLayers `EventTarget`) | `el.addEventListener(name, fn)` (DOM, same names) |
| `app.remove()` | remove the element from the DOM |
| `app.appData` (writable) / `app.stateBuffer` / `app.initialRestore` | `el.appData` (frozen) / `el.state` / `el.initialRestore` |
| `app.from.mapID` / `app.cacheHash` / `app.mapObject` | `el.currentMapId` / `el.listMaps()` / the element-specific methods |
| `appOption.uiHooks` (`context.core` is the `MaplatApp`) | `el.uiHooks` (`context.core` is the element) |
| `sourceLoaded` detail: source objects | `{ mapID, usable }[]` |
| Startup-only fields assigned after construction: warning, ignored | same (attribute or property) |
| Feature keys in the setting file: read, with a deprecation warning | not read, with a warning |
