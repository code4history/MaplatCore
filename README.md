<!-- SECTION 1: Header (logo, badges, title) -->
<h1 align="center">MaplatCore</h1>

<p align="center">
  <a href="https://github.com/code4history/MaplatCore/actions/workflows/test.yml"><img src="https://github.com/code4history/MaplatCore/actions/workflows/test.yml/badge.svg" alt="CI" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/@maplat/core" alt="License" /></a>
</p>

<!-- SECTION 2: Elevator Pitch -->
## About MaplatCore

MaplatCore is the core library of the Maplat Historical Map / Illustrated Map
Viewer. It transforms each map's coordinates with a nonlinear but homeomorphic
projection, so maps can collaborate with GPS and accurate maps without
distorting the original map image. The end-user viewer built on top of it is
[Maplat](https://github.com/code4history/Maplat); the data authoring tool is
[MaplatEditor](https://github.com/code4history/MaplatEditor).

MaplatCore is open-source under the Apache License 2.0 (from version 0.13.2).

<!-- SECTION 3: Language switch link -->
**[Read this document in Japanese / 日本語で読む](README.ja.md)**

<!-- SECTION 4: Key Features -->
## Key Features

- Historical map / illustrated map viewer API with nonlinear but homeomorphic
  coordinate transformation
- GPS / accurate map collaboration without distorting the original map image
- Pluggable base maps (OpenLayers-based; optional Mapbox GL JS / MapLibre GL JS
  for vector tiles)
- Event-driven POI / line / layer management
- Open-source (Apache 2.0 from version 0.13.2) — part of the Maplat ecosystem

<!-- SECTION 5: Quick Start -->
## Quick Start

<!-- release-pinned:start -->
> **Current release: `1.2.0`**. This block is the only place in
> this repository that carries a release version; everything outside it is
> written against the 1.0 release.
> npm: [`@maplat/core`](https://www.npmjs.com/package/@maplat/core)
> [![npm](https://img.shields.io/npm/v/@maplat/core)](https://www.npmjs.com/package/@maplat/core)

### Install

```bash
# pnpm (recommended)
pnpm add @maplat/core

# npm
npm install @maplat/core
```

### Minimal usage

```typescript
import { MaplatApp } from '@maplat/core';
import 'ol/ol.css'; // REQUIRED: OpenLayers CSS

const option = {
  startFrom: 'gsi',
};

MaplatApp.createObject(option).then((app) => {
  console.log('Maplat initialized', app);
});
```

### Custom Element `<maplat-app>`

The same map is also available as a Custom Element. Import
`@maplat/core/element` once (it registers the tag) and write the tag; the
element is the map container, and the `MaplatApp` methods and events are on the
element.

```typescript
import 'ol/ol.css';
import '@maplat/core/element';
```

```html
<maplat-app app-id="morioka"></maplat-app>
<script type="module">
  const el = document.querySelector('maplat-app');
  await el.ready;
  el.addEventListener('mapChanged', (e) => console.log(e.detail.mapID));
</script>
```

See [`docs/api/maplat-app.md`](docs/api/maplat-app.md) for the attributes,
properties, methods and events, the shared base `@maplat/core/common`, the
POI template functions `@maplat/core/template` and the conformance tests
`@maplat/core/conformance`. The `MaplatApp` class stays
available in 1.x and closes in the next major version (2.0).

### CDN (jsDelivr)

For usage directly in the browser without a bundler, you must load OpenLayers
before loading MaplatCore.

```html
<!-- OpenLayers -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@10/ol.css">
<script src="https://cdn.jsdelivr.net/npm/ol@10/dist/ol.js"></script>

<!-- MaplatCore -->
<script src="https://cdn.jsdelivr.net/npm/@maplat/core@1.2.0/dist/maplat_core.umd.js"></script>

<div id="map_div"></div>
<script>
  var option = {
    startFrom: 'gsi',
    div: 'map_div',
  };
  MaplatApp.createObject(option).then(function (app) {
    console.log('Maplat initialized', app);
  });
</script>
```

*Note: Make sure to use the latest compatible versions.*

### POI specification (`setting.pois`)

The `pois` field of a map/app setting accepts several historical forms. All
existing forms continue to work unchanged (backward compatible). A new **layer
ref (wrapper)** form is added to let the app override per-layer presentation
(`hide` / `title` / `icon` / `selectedIcon`) without editing the layer's
FeatureCollection.

| Form | Shape | Behaviour |
|---|---|---|
| URL string | `"pois/x.geojson"` | fetched and normalised (legacy) |
| Inline FC | `{ type: "FeatureCollection", ... }` | normalised in place (legacy) |
| FC array | `[FC, FC, ...]` | each FC becomes a layer keyed by `id` (legacy) |
| POI object array | `[{lng, lat, name}, ...]` | single `main` layer (legacy) |
| Old layer dict | `{ "<key>": <cluster>, ... }` | each value normalised (legacy) |
| **Layer ref (wrapper) — array element** | `{ layer: <URL\|FC>, hide?, title?, icon?, selectedIcon? }` | `layer` is resolved/fetched, the FC is normalised, then the overrides are merged onto the resulting cluster |
| **Layer ref — whole `pois`** | `{ layer: <URL\|FC>, hide?, title?, icon?, selectedIcon? }` with **at least one override key** | same merge, keyed by the FC `id`. Without an override key the object is treated as the old layer dict form (key `"layer"`) for backward compatibility |

Override semantics:

- Only the four override keys are honoured. Unknown keys are **dropped with a
  `console.warn`** (no throw, forward-compatible).
- `hide: true` (boolean true only) sets `cluster.hide = true`. `hide:false` /
  non-boolean values are ignored (the data-side value is kept).
- `title` (non-empty string, or a non-empty localized object) maps to
  `cluster.name`.
- `icon` / `selectedIcon` (non-empty string only) map to `cluster.icon` /
  `cluster.selectedIcon`.
- Override **wins over** `FeatureCollection.properties` of the same name.
- Internal cluster keys (`pois` / `id` / `namespaceID` / `__nextId`) cannot be
  overwritten from a wrapper (they are not override keys).
- The input object is **not mutated**.

See `src/normalize_pois.ts` (`isPoiLayerRef`, `PoiLayerRef`) for the
programmatic surface.

### Attribution and licensing (`attr` / `dataAttr`)

Map metadata carries attribution and licensing as two independent pairs: one
for the **map image** itself, and one for the **data** (control points, POIs,
and other derived data). Keeping them apart matters because a scanned map sheet
and the georeferencing data built on top of it usually come from different
rights holders.

| Field | Type | Meaning |
|---|---|---|
| `attr` | `string` or `{ <lang>: string }` | **Map image attribution** — who the map image is credited to |
| `dataAttr` | `string` or `{ <lang>: string }` | **Data attribution** — who the data is credited to |
| `license` | `string` | **Map image license** |
| `dataLicense` | `string` | **Data license** |
| `licenseNote` | `string` or `{ <lang>: string }` | Free-form supplement to `license` |
| `dataLicenseNote` | `string` or `{ <lang>: string }` | Free-form supplement to `dataLicense` |

`attr` / `dataAttr` accept a localized object so that a credit line can differ
per viewer language; `license` / `dataLicense` are plain strings. They are not
enumerations — the library stores and renders whatever string it is given. In
practice two conventional values are used:

- `"ODbL"` — ODbL (Open Database License)
- `"Custom"` — Custom license, with the actual terms written into
  `licenseNote` / `dataLicenseNote`

The bundled base maps in `src/source_ex.ts` show both conventions: OpenStreetMap
is declared as `attr: "©︎ OpenStreetMap contributors"` with `license: "Custom"`
and `dataLicense: "ODbL"`, while the GSI base map uses `"Custom"` for both and
spells the terms out in `licenseNote`.

Choosing these values in a UI is the authoring tool's concern (MaplatEditor);
MaplatCore only defines what the fields mean and renders the resulting credit.

#### Attribution shown on the map

The tile providers of the built-in base maps ask for a credit on the screen
while their tiles are displayed (OpenStreetMap: "© OpenStreetMap contributors"
near the map; GSI Tiles: the source while the tiles are shown). MaplatCore
therefore shows the credit of the modern maps it is drawing in a small box at
the bottom right of the map (`div.maplat-attribution`):

- the base map in front (`osm`, `gsi`, `gsi_ortho`, or a base map defined in
  the app settings),
- a tile overlay (`maptype: "overlay"`) and the base map under it,
- the base map in the background while a historical map is in front.

The credits are shown in separate boxes: the base map's credit at the bottom
(for a Google map, the row with the Google Maps logo and Google's copyright)
and the tile overlay's credit in a box above it. The text is not joined with
" | " across boxes.

The viewer shows only two kinds of credit: the map's `attr` from the map
definition, and the credit declared by the provider. A provider's declaration
is read only from two source types: the copyright that a Google map receives
from the Map Tiles API, and the `attribution` written in the TileJSON of an
OpenLayers `TileJSON` source (only that value is shown). Of the sources that
Core creates today, only Google maps carry a provider's declaration; the
TileJSON rule applies when an app passes a `TileJSON` source. A TileJSON may be
fetched from the provider's server or given directly by the app (the `tileJSON`
option), in which case the value is what the app wrote. The viewer does not fill in a credit from library
defaults: the built-in credit of OpenLayers sources such as `OSM`, `StadiaMaps`
or `BingMaps`, and the `attributions` given when a source is created, are not
shown. A map with neither an `attr` nor a provider's declaration shows no
credit at all. A Google
map always shows the copyright for the current view, fetched from the Map
Tiles API, whether or not it has an `attr`, because the policies require that
copyright in full; an `attr` on a Google map is shown in a separate box above
the row with Google's copyright. **If you define your own base map or tile overlay in the app
settings, write its `attr`**; otherwise nothing is shown for it (the viewer
does not fill in a default). An `attr`
that is empty or only whitespace counts as no `attr`.

While a Google map (a map whose `maptype` is `google`, `google_roadmap`,
`google_satellite`, `google_hybrid` or `google_terrain`) is displayed, the
Google Maps logo is shown to the left of Google's credit (the copyright), as
the [Map Tiles API Policies](https://developers.google.com/maps/documentation/tile/policies)
require. This includes a Google map in the background behind a historical map.
The credits of other maps (a tile overlay, and an `attr` written on the Google
map) are shown in separate boxes above the row with the logo and Google's
credit, so that they are clearly told apart from Google's, as the policies
require.

- The logo is the official SVG from Google's attribution assets, shown
  unmodified at its own size (105×22 px). Maps use the grey logo with a white
  outline; satellite imagery (`google_satellite`, `google_hybrid`) uses the
  white logo with a dark outline. The logo keeps a clear space of 10 px on the
  left, right and top and 5 px at the bottom, and never covers the credit
  text. Its accessible name is "Google Maps".
- When the credit text does not fit to the right of the logo, the text wraps
  to the line below the logo. Only when the box has less than 125 px of width
  (the logo and its side clear space) is the text "Google Maps" shown at the
  start of the credit instead of the logo. This is decided again when the map
  element is resized.
- The state can be read from `data-google-maps` on `div.maplat-attribution`
  (`logo` or `text`; no attribute when no Google map is displayed). The logo
  element is `.maplat-attribution-google-logo`.
- **Do not hide the logo or change its size or colours with CSS**; the policies
  forbid it. Move it together with the credit through the custom properties
  below.
- The logo size is set in CSS pixels. On a page without
  `<meta name="viewport" content="width=device-width">`, a smartphone shows the
  whole page scaled down, so the logo is physically smaller too.

The same text is shown once. The box is updated when the map is switched,
when a `lang` attribute changes, when the attribution of an OpenLayers source
changes (such as the Google copyright for a new view), and once when
`<maplat-ui>` becomes defined. The language follows the same order as
`<maplat-ui>`: inside `<maplat-ui>`, its current language when the element is
defined; otherwise the `lang`
attribute of the map element, then of the closest `<maplat-ui>`, then
`appOption.lang`, `lang` of the app settings, the closest `lang` attribute of
an ancestor (such as `<html lang>`), the browser language, and `en`. A
localized `attr` is picked as the UI does (the language → `en` → the first
value). The `attr` of a historical map is not shown here; it stays in the map
information of the UI. The value goes through `sanitizeHtml`, so an `attr` may
contain a link. The box does not take pointer events except for links in it.

Each box other than Google's copyright shows at most two lines
(`.maplat-attribution-clamp`). A longer credit wraps to the second line and is
then cut with "…". The box is never taller than two lines or wider than the
map, so a long credit cannot cover the map or turn it into a link. Inside the
box, blocks (paragraphs, tables, lists, `pre` …) are laid out as inline text
and an image is scaled down to one line, so that the cut ends with "…". This
applies to both an `attr` and a provider's declaration.

The full text of a cut credit is meant to be shown elsewhere, such as in the
map information of a UI. Note that the map information of `<maplat-ui>` in its
current release shows only the metadata of the current map: while a tile
overlay is shown, the base map's `attr` under it is not there, nor is the base
map behind a historical map, nor a provider's declaration. A change to the UI
that shows the credits of every displayed map is in progress separately.

Google's copyright is never cut: it is shown in full and wraps to as many lines
as it needs, because the policies ask for it "in full as provided".

A provider's declaration (the Google copyright or the `attribution` of a
TileJSON) can come from a third-party server, so it goes
through a narrower allowlist than `attr`: `sanitizeHtml(text, { profile: "iiif" })`.
Only `a`, `b`, `br`, `i`, `p`, `small`, `span`, `sub` and `sup` are kept, the
only attribute kept is an `http(s)` `href`, and every link gets
`target="_blank"` and `rel="noopener noreferrer"`. Images, `class`, `style` and
`javascript:` links are dropped, so such a value cannot show an image or load
one from a third party. Plain text, such as the Google copyright ("Imagery
©2026 Airbus, CNES / Airbus, Maxar Technologies Map data ©2026"), and text with
links, such as a typical TileJSON `attribution`, are shown unchanged. The `attr` written in the map settings
keeps the wider allowlist (it may contain an image, for example). Duplicates
are found by the text that is shown, so an `attr` and a source attribution with
the same text are shown once.

The position can be changed with CSS custom properties on the map element:
`--maplat-attribution-right`, `--maplat-attribution-bottom` and
`--maplat-attribution-max-width`. Inside `<maplat-ui>`, the default places the
box to the left of the bottom-right buttons so that it does not overlap the UI
controls; the numbers it uses are also custom properties
(`--maplat-attribution-ui-inset`, `--maplat-attribution-ui-bottom-offset`,
`--maplat-attribution-ui-button-width`, `--maplat-attribution-ui-gap`).
Write these properties on the `maplat-app` element itself: inside
`<maplat-ui>`, values set on `<maplat-ui>` or another ancestor lose to the
default rule on `maplat-app`.

### Excluding a map from the tile cache (`noCache`)

When `MaplatApp` is started with `enableCache: true` (a `MaplatApp` option),
every tile map is registered with the Service Worker tile cache (Weiwudi). A map
whose setting has `noCache: true` is **not** registered, so its tiles are always
fetched from the network and `getMapCacheEnable(mapID)` returns `false` for it.
Without the key, or with `noCache: false`, the map is cached as before.

- Write it as a JSON boolean. Only `true` excludes the map; a string such as
  `"true"` is not treated as true.
- It can be written in two places: the map master (`maps/<mapID>.json`) and the
  element of `sources` in the app setting. When both have it, the app element
  wins (e.g. `noCache: false` in the app element cancels `noCache: true` in the
  map master).
- A source written as a string (a bundled base map such as `"osm"` or `"gsi"`)
  cannot carry `noCache`. Write it in object form instead:
  `{ "mapID": "osm", "noCache": true }`.
- Tiles that were already cached are not deleted by setting `noCache`. Once a
  map is excluded it is no longer registered, so `clearMapTileCacheAsync(mapID)`
  has nothing to act on for it; clear the cache with
  `clearMapTileCacheAsync(mapID)` **before** turning `noCache` on.

### Serving a map image from a IIIF Image API service (`delivery`)

An old map can be displayed straight from a [IIIF Image API](https://iiif.io/api/image/)
service instead of from pre-cut tiles. Add `delivery` to the map setting
(`maps/<mapID>.json`):

```json
{
  "delivery": { "type": "iiifImage", "url": "https://dl.ndl.go.jp/api/iiif/948741/R0000003" },
  "compiled": { "...": "..." }
}
```

`url` is the image service's base URL (the part before `/info.json`). Core fetches
`<url>/info.json` once when the map is loaded and requests each tile in the IIIF URL
form (`<url>/<region>/<size>/0/default.jpg`). Reading `info.json` and building the
request URLs are handled by Core. Tests verify that its URLs match the OpenLayers
IIIF implementation. The image delivery and bibliography functions are available
from [`@maplat/core/common`](docs/api/maplat-core.md#iiif-functions-in-maplatcorecommon).

- Supported: Image API 2 and 3 services that can return any region (most level 1
  and level 2 services), and level 0 services whose tiles are 256 px.
- Not supported yet: level 0 services with other tile sizes or with `sizes` only,
  and Image API 1. Such a map, or one whose `info.json` cannot be read (not
  `http:`/`https:`, network error, more than 10 seconds, larger than 1 MiB, not
  JSON, or a `width`/`height` different from the map's `compiled` data), is
  treated as unusable: an error is logged and the other maps start normally. With
  `<maplat-app>`, the `sourceLoaded` event lists it as `{ mapID, usable: false }`.
  With the `MaplatApp` class, it is simply left out of the `sourceLoaded` detail
  (no entry is added for it). If it was the initial map, the app starts from the
  default map instead.
- The image service must allow cross-origin requests (CORS) from your page.
- A map with `delivery` is never registered with the tile cache, so
  `getMapCacheEnable(mapID)` returns `false` even with `enableCache: true`.
- If the map also has `url` or `urls`, `delivery` is used and a warning is logged.
  If `info.json`'s `@id`/`id` differs from `delivery.url`, tiles are still requested
  from `delivery.url` (with a warning).
- `info.json` is fetched without credentials.

### POIs outside the map

A POI whose coordinates are outside the foreground map is still drawn when there is
somewhere to put it. A POI given as mercator `coordinates` or as lng/lat is outside when
the foreground map cannot map it into its own coordinates; a POI given as pixel `x`/`y`
is not drawn outside.

| Foreground | Inside | Outside |
|---|---|---|
| Historical map with a background map | `marker` layer of the foreground | `marker` layer of the background, in mercator coordinates |
| TMS or a basemap with an `envelope` | `marker` layer of the foreground | `marker` layer of the foreground, in mercator coordinates |
| Historical map with `overlay="false"` | foreground | not drawn |
| `hide-outside-pois` set | foreground | not drawn |

An outside POI looks the same as an inside one (same icons, `selectedIcon` while it is
selected), and the foreground and the background are swapped in one step, so the map does
not flash empty while it changes.

- **Pressing a pin on the background.** When a click misses the foreground, a background
  map exists, and the clicked point is outside the paper of the historical map
  (`insideCheckSysCoord` is false for it), the click also looks at the `marker` layer of
  the background. A hit ends in `clickMarker` / `clickMarkers` as a foreground hit does;
  a point the paper covers never presses a background pin, whatever the transparency is.
  A click that hits neither layer ends in `clickMapXy` / `clickMapMerc` / `clickMap`.
- **While an outside POI is selected.** `selectMarker(id)` centres the map on the pin even
  when it is outside the paper, and the map is not pulled back inside while that POI is
  selected. `unselectMarker()` releases it and the centre returns to the nearest point
  inside the paper just after the current task. GPS positions do not move the centre while
  an outside POI is selected. Changing the map settles the selection against the new map
  (a POI that is gone is unselected and the centre is pulled back; one that is inside
  becomes a normal selection; one that is still outside keeps the centre on the pin and
  `outOfMap` is not emitted). Inside POIs behave as before.
- **`hide-outside-pois`** turns the drawing off. It is a boolean attribute like the
  others, it can be changed after startup (the markers are redrawn), and it writes the
  same field as the legacy `appOption.hideOutsidePois`.

### Copied IIIF metadata (`iiif`, `iiifMetadata`)

A map setting (`maps/<mapID>.json`) can record the IIIF Presentation manifest the
map comes from, together with metadata copied from it by an authoring tool such as
MaplatEditor:

```json
{
  "title": "新潟市圖",
  "attr": "国立国会図書館 National Diet Library, JAPAN",
  "license": "Custom",
  "licenseNote": "https://dl.ndl.go.jp/ja/help_iiif#...",
  "iiif": {
    "manifest": "https://dl.ndl.go.jp/api/iiif/948741/manifest.json",
    "canvas": "https://dl.ndl.go.jp/api/iiif/948741/canvas/3",
    "image": "https://dl.ndl.go.jp/api/iiif/948741/R0000003",
    "bindings": { "title": { "from": "manifest", "property": "label" } },
    "copiedAt": "2026-10-28T12:39:42Z",
    "copiedValues": { "title": { "ja": "新潟市圖" } },
    "copiedMetadata": [
      { "from": "manifest", "label": "Call Number", "value": "YG7-Z-1065" }
    ]
  }
}
```

- The copied values live in the ordinary metadata keys (`title`, `attr`, `license`,
  `licenseNote`, …) and are shown like any other metadata.
- `bindings` says which manifest or canvas property each key was copied from
  (`{ from: "manifest" | "canvas", property }`), `copiedValues` keeps the values
  as they were at copy time (key → language → string), and `copiedMetadata` keeps
  every entry of the manifest's and canvas's `metadata` list.
- **The viewer never fetches the manifest.** It only reads what is written in the
  map setting.
- `getMapMeta()` and the `mapChanged` detail include
  `iiif: { manifest?, canvas?, image?, copiedAt?, display, metadata? }` for such a
  map (`metadata` is `copiedMetadata`; `bindings` and `copiedValues` are not
  included).
- `display` is `"all"` or `"hidden"` and tells a UI whether to show the full
  metadata table. Set it per map with `iiifMetadata` on the entry of the app
  setting's `sources` (`{ "mapID": "...", "iiifMetadata": "all" }`). Without it the
  value is `"hidden"`.
- `proposeIiifBindings` always proposes the manifest label for `title`. If that label
  cannot be read, it omits `title`; it does not fall back to the canvas label.
  Explicit `{ from: "canvas", property: "label" }` bindings remain supported.
- The functions that read a manifest and pick the values to copy
  (`listIiifCanvases`, `proposeIiifBindings`, `resolveIiifMetadata`,
  `compareIiifCopy`, `iiifRightsToLicense`, `IIIF_BINDABLE_KEYS`) are **not part
  of the package's public API**. They are internal functions used by authoring
  tools such as MaplatEditor (the source is `src/iiif/manifest.ts`); they are not
  in the public entry points (`exports` of `package.json`), and their compatibility is not guaranteed. How
  they read a manifest is described in
  [docs/api/iiif-manifest.md](docs/api/iiif-manifest.md).
- These functions do not fetch and do not use the DOM. HTML values are passed
  through a sanitizer given by the caller. The sanitizer `sanitizeIiifHtml` (which
  needs a browser `window`) is public API and can be imported from
  `@maplat/core/common`, together with the `MapMetaIiif` type and the
  `isIiifMetadataEntry` guard. It keeps only `a`, `b`, `br`,
  `i`, `p`, `small`, `span`, `sub`, `sup` and the `href` attribute (http(s) only;
  links open in a new tab with `rel="noopener noreferrer"`).

### Lifecycle

- See [docs/ui-core-lifecycle.md](docs/ui-core-lifecycle.md) for lifecycle
  phases and uiHooks (this document lives in the Maplat viewer repository; the
  lifecycle is shared with `@maplat/ui`).

### API reference

- **API signatures** (release-dependent): see [`docs/api/`](docs/api/)
- **Conceptual guide** (release-independent): see the
  [Wiki API-Reference](https://github.com/code4history/MaplatCore/wiki/API-Reference)

### Demo

Public demo: <https://code4history.dev/MaplatCore/> (deployed to GitHub Pages from
`master`). Locally, start it with `pnpm dev` and open `http://localhost:5175/`.

- `?region=<ID>` selects the region (`morioka`, `nobeoka`, `nara`, `tatebayashi`,
  `hiroshima`, `niigata`). Without it, or with an unknown ID, `morioka` is used.
  Changing the region selector on the page reloads it with this parameter.
- Tile cache: the demo registers the Weiwudi Service Worker (`weiwudi-sw.js`) and
  then starts with `enableCache: true`. The "キャッシュ" (cache) section of the
  control panel shows the state and statistics (stored bytes, fetched / total
  tiles) and lets you try "全タイルを取得" (fetch all tiles, with progress and
  cancel) and "キャッシュを消す" (clear the cache). For a map whose total tile
  count is unknown or exceeds 3000, bulk fetching is disabled and the reason is
  shown.
- `?cache=0` starts the demo without the cache. It also starts without the cache,
  showing the reason in that section, when Service Workers are unavailable or the
  registration does not finish within 15 seconds.

### Development

#### Setup
Clone the repository and install dependencies.

```bash
git clone https://github.com/code4history/MaplatCore.git
cd MaplatCore
pnpm install
```

#### Development Server
Start the development server with hot reload.

```bash
pnpm dev
```

#### Build

```bash
pnpm build        # Build npm package (dist/)
pnpm build:demo   # Build demo application (dist-demo/)
```

#### Test

```bash
pnpm test         # Run unit tests (Vitest)
pnpm typecheck    # Run type checks (TypeScript)
pnpm lint         # Run linter and formatter (ESLint/Prettier)
pnpm run test:e2e # Run E2E tests (Playwright)
```
<!-- release-pinned:end -->

The E2E tests need no Google Maps API key. To try the Google maps locally, set `GOOGLE_MAPS_API_KEY` in the environment.

<!-- SECTION 6: Prerequisites -->
## Prerequisites

> Node.js follows the GitHub Actions `test.yml` matrix; pnpm follows the `engines` field in `package.json` (release-dependent).

- Node.js: v22 or v24 (tested via GitHub Actions)
- pnpm: `>=9.0.0` (required; `package.json` enforces pnpm)

<!-- SECTION 7: Peer Dependencies -->
## Peer Dependencies

MaplatCore depends on the following libraries as peer dependencies. You must
install them manually.

- **OpenLayers (`ol`)** — `^9.0.0 || ^10.0.0` (required; peer dependency of
  MaplatCore and Maplat `@maplat/ui`)

```bash
pnpm add ol
```

If you use Vector Tiles, you may also need Mapbox GL JS or MapLibre GL JS:

- `mapbox-gl`: `^2.0.0 || ^3.0.0` (optional)
- `maplibre-gl`: `^5.0.0 || ^6.0.0` (optional)

<!-- SECTION 8: Ecosystem / Related Repositories -->
## Ecosystem

MaplatCore is part of the Maplat ecosystem by [Code for History](https://github.com/code4history).
See the full ecosystem map (8 repositories + product/corporate sites):

📖 **Ecosystem Map** — *(the diagram is currently kept in a private planning
repository; the Sister repositories table below is the public substitute)*

### Sister repositories

| Repository | License | npm | Role |
|---|---|---|---|
| [Maplat](https://github.com/code4history/Maplat) | Apache 2.0 | `@maplat/ui` | Main viewer |
| [MaplatCore](https://github.com/code4history/MaplatCore) | Apache 2.0 | `@maplat/core` | Core library |
| [MaplatTin](https://github.com/code4history/MaplatTin) | Apache 2.0 | `@maplat/tin` | TIN conversion |
| [MaplatTransform](https://github.com/code4history/MaplatTransform) | Apache 2.0 | `@maplat/transform` | Coordinate transform |
| [MaplatEditor](https://github.com/code4history/MaplatEditor) | Apache 2.0 | — | Data authoring tool (desktop) |
| [Chuci](https://github.com/code4history/Chuci) | MIT | `@c4h/chuci` | Multimedia swiper & viewer Web Components |
| [Quyuan](https://github.com/code4history/Quyuan) | MIT | `@c4h/quyuan` | GeoJSON template engine + multimedia viewer Web Components |
| [Weiwudi](https://github.com/code4history/Weiwudi) | MIT | `@c4h/weiwudi` | Service Worker for tile cache |

> MaplatEditor is the data authoring tool used to create the maps and POIs
> that the viewers above render. The Maplat ecosystem is end-to-end:
> author with MaplatEditor, serve with any of the viewer libraries.

<!-- SECTION 9: Nayuta links -->
## Links

| Audience | Link | Purpose |
|---|---|---|
| Project info / features / cases | <https://www.maplat.jp/en/> | Product site |
| Sponsor / business inquiry | <https://www.nayuta-inc.co.jp/en/> | Corporate site (Nayuta, Inc.) |

> Apache-licensed repositories (this one) link to both sites.
> MIT-licensed sister repos (Weiwudi / Quyuan / Chuci) carry no Nayuta link.

<!-- SECTION 10: License -->
## License

Apache License 2.0 — see [LICENSE](LICENSE).

```
Copyright 2019-2026 Kohei Otsuka, Code for History / Nayuta, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

> **Patent notice**: The Maplat coordinate-transform technology is patented
> in Japan (Patent No. 6684776).

> **Past versions**: Versions before 0.13.2 were distributed under the
> Maplat Limited License 1.1. The license restoration to Apache 2.0 takes
> effect from version 1.0.0-rc1 onward. Earlier versions available on npmjs.com
> remain under their original limited-license terms.
