<!-- SECTION 1: Header (logo, badges, title) -->
<h1 align="center">MaplatCore</h1>

<p align="center">
  <a href="https://github.com/code4history/MaplatCore/actions/workflows/test.yml"><img src="https://github.com/code4history/MaplatCore/actions/workflows/test.yml/badge.svg" alt="CI" /></a>
  <a href="https://www.npmjs.com/package/@maplat/core"><img src="https://img.shields.io/npm/v/@maplat/core" alt="npm version" /></a>
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

> Release-dependent information (ADR-0012). The version `1.0.0-rc1` below is the
> current release; update it on each new release.

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

### CDN (jsDelivr)

For usage directly in the browser without a bundler, you must load OpenLayers
before loading MaplatCore.

```html
<!-- OpenLayers -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@10/ol.css">
<script src="https://cdn.jsdelivr.net/npm/ol@10/dist/ol.js"></script>

<!-- MaplatCore -->
<script src="https://cdn.jsdelivr.net/npm/@maplat/core@1.0.0-rc1/dist/maplat_core.umd.js"></script>

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

### Lifecycle

- See [docs/ui-core-lifecycle.md](docs/ui-core-lifecycle.md) for lifecycle
  phases and uiHooks (this document lives in the Maplat viewer repository; the
  lifecycle is shared with `@maplat/ui`).

### API reference

- **API signatures** (release-dependent): see [`docs/api/`](docs/api/)
- **Conceptual guide** (release-independent): see the
  [Wiki API-Reference](https://github.com/code4history/MaplatCore/wiki/API-Reference)

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

<!-- SECTION 6: Prerequisites -->
## Prerequisites

> Node.js follows the GitHub Actions `test.yml` matrix; pnpm follows the `engines` field in `package.json` (ADR-0012: release-dependent).

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

- `mapbox-gl`: `^1.0.0 || ^2.0.0 || ^3.0.0` (optional)
- `maplibre-gl`: `^3.0.0 || ^4.0.0` (optional)

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

> MaplatEditor is the data authoring tool used to create the maps and POIs
> that the viewers above render. The Maplat ecosystem is end-to-end:
> author with MaplatEditor, serve with any of the viewer libraries.

<!-- SECTION 9: Nayuta links -->
## Links

| Audience | Link | Purpose |
|---|---|---|
| Project info / features / cases | <https://www.maplat.jp/en/> | Product site |
| Sponsor / business inquiry | <https://www.nayuta-inc.co.jp/en/> | Corporate site (Nayuta, Inc.) |

> ADR-0013: Apache-licensed repositories (this one) link to both sites.
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
