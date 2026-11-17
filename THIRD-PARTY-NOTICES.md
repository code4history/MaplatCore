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

| File | Source | License / terms |
|---|---|---|
| `parts/osm.jpg` | OpenStreetMap standard tile layer. © OpenStreetMap contributors | Data available under the Open Database License (ODbL): <https://www.openstreetmap.org/copyright> |
| `parts/gsi.jpg` | GSI Tiles (Standard Map), Geospatial Information Authority of Japan. 出典：国土地理院（地理院タイル 標準地図）。地理院タイル（標準地図）を縮小・切り抜きして作成 | GSI Content Terms of Use: <https://maps.gsi.go.jp/development/ichiran.html> |
| `parts/gsi_ortho.jpg` | GSI Tiles (Photo), Geospatial Information Authority of Japan. 出典：国土地理院（地理院タイル 写真）。地理院タイル（写真）を縮小・切り抜きして作成 | GSI Content Terms of Use: <https://maps.gsi.go.jp/development/ichiran.html> |
