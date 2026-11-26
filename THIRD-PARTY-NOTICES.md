# Third-party notices

## OpenLayers

The info parsing and tile URL functions in `src/iiif/image.ts` are adapted from
OpenLayers 10.11.0 (`ol/format/IIIFInfo.js` and `ol/source/IIIF.js`).

BSD 2-Clause License

Copyright 2005-present, OpenLayers Contributors
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

## Basemap thumbnails

The thumbnails of the three built-in base maps are 52x52 px JPEG images,
cropped and reduced from map tiles around Tokyo Station and the Imperial
Palace, Tokyo. They are bundled into `dist/` (as data URLs) through
`src/assets.ts` and `src/source_ex.ts`.

`parts/osm.jpg` was made in early 2020. At that time the OpenStreetMap
copyright page stated that the cartography in its map tiles was licensed
under CC BY-SA 2.0.

| File | Source | License / terms |
|---|---|---|
| `parts/osm.jpg` | OpenStreetMap standard tile layer. © OpenStreetMap contributors. Map tiles © OpenStreetMap contributors, CC BY-SA 2.0 | Data available under the Open Database License (ODbL): <https://www.openstreetmap.org/copyright>. Map tiles: Creative Commons Attribution-ShareAlike 2.0 (CC BY-SA 2.0): <https://creativecommons.org/licenses/by-sa/2.0/>. This thumbnail is distributed under CC BY-SA 2.0. |
| `parts/gsi.jpg` | GSI Tiles (Standard Map), Geospatial Information Authority of Japan. 出典：国土地理院（地理院タイル 標準地図）。地理院タイル（標準地図）を縮小・切り抜きして作成 | GSI Content Terms of Use: <https://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html>; GSI Tiles list: <https://maps.gsi.go.jp/development/ichiran.html> |
| `parts/gsi_ortho.jpg` | GSI Tiles (Photo), Geospatial Information Authority of Japan. 出典：国土地理院（地理院タイル 写真）。地理院タイル（写真）を縮小・切り抜きして作成 | GSI Content Terms of Use: <https://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html>; GSI Tiles list: <https://maps.gsi.go.jp/development/ichiran.html> |

## Google Maps logo

The Google Maps logo is a trademark of Google LLC. It is not covered by the
license of this repository.

MaplatCore shows the logo while a Google map is displayed, because the
[Map Tiles API Policies](https://developers.google.com/maps/documentation/tile/policies)
require the Google Maps logo as attribution and ask applications to "Use the
official Google Maps logos provided below". The logo files come unmodified from
Google's "Google Maps attribution assets"
(<https://developers.google.com/static/maps/documentation/images/Google_Maps_Attribution_Assets.zip>).
Use of the logo is subject to Google's terms, including the
[Geo Guidelines](https://about.google/brand-resource-center/products-and-services/geo-guidelines/).
The logo is used only to attribute Google maps displayed by MaplatCore. No
permission is given to use it for any other purpose.

`src/google_maps_logo.ts` is in `src/`, which is published in the npm package
together with `dist/`. The files in `assets/google-maps-logo/` are not.

| File | Source |
|---|---|
| `assets/google-maps-logo/GoogleMaps_Logo_WithLightOutline.svg` | `GoogleMaps_Logo_WithLightOutline/GoogleMaps_Logo_WithLightOutline.svg` in the assets above (not included in the npm package) |
| `assets/google-maps-logo/GoogleMaps_Logo_WithDarkOutline.svg` | `GoogleMaps_Logo_WithDarkOutline/GoogleMaps_Logo_WithDarkOutline.svg` in the assets above (not included in the npm package) |
| `src/google_maps_logo.ts` (bundled into `dist/`) | The two SVG files above as strings, with only the XML declaration, comments, `id` attributes and whitespace removed (`scripts/build-google-maps-logo.mjs`). `spec/google-maps-logo.spec.ts` checks that the shapes, colours and size are the same as the files |


## Proj4js, wkt-parser, and mgrs

Core bundles Proj4js and its dependencies wkt-parser and mgrs in its UMD
distribution and ES projection chunk.

Proj4js and wkt-parser: Copyright (c) 2014, Mike Adair, Richard Greenwood,
Didier Richard, Stephen Irons, Olivier Terral and Calvin Metcalf

mgrs: Copyright (c) 2012, Mike Adair, Richard Greenwood, Didier Richard,
Stephen Irons, Olivier Terral, Calvin Metcalf

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.

## Natural Earth

The coastline of the transform-shape demo (`layered-map.html`) is cut from Natural Earth
1:50m Land (`ne_50m_land`; <https://www.naturalearthdata.com/>) into
`demo/layered-map/data/coast-lonlat.json` and `public/demo-data/`. It is not shipped in the
npm package (`files`: `src/`, `dist/`, `parts/`).

Natural Earth is in the public domain: "All versions of Natural Earth raster + vector map data
found on this website are in the public domain. You may use the maps in any manner, including
modifying the content and design, electronic dissemination, and offset printing. The primary
authors, Tom Patterson and Nathaniel Vaughn Kelso, and all other contributors renounce all
financial claim to the maps and invite you to use them for personal, educational, and
commercial purposes. No permission is needed to use Natural Earth. Crediting the authors is
unnecessary."
