import { addProjection, addCoordinateTransforms, Projection } from 'ol/proj';
import { XYZ } from 'ol/source';
import {setCustomFunction, setCustomInitialize, setupTileLoadFunction, NowMap, TmsMap, MapboxMap} from './source_ex';
import { createFromTemplates, expandUrl } from 'ol/tileurlfunction';
import { MERC_MAX, tileSize, transPng } from './const_ex';
import { HistMap_tin } from './histmap_tin';

for (let z = 0; z < 9; z++) {
    const key = `ZOOM:${z}`;
    const maxxy = 256 * Math.pow(2, z);

    (function(key, maxxy) {
        const projection = new Projection({
            code: key,
            // The extent is used to determine zoom level 0. Recommended values for a
            // projection's validity extent can be found at https://epsg.io/.
            extent: [0.0, 0.0, maxxy, maxxy],
            units: 'm'
        });
        addProjection(projection);

        // We also declare EPSG:21781/EPSG:4326 transform functions. These functions
        // are necessary for the ScaleLine control and when calling ol.proj.transform
        // for setting the view's initial center (see below).

        addCoordinateTransforms('EPSG:3857', projection,
            (coordinate) => {
                const x = (coordinate[0] + MERC_MAX) * maxxy / (2 * MERC_MAX);
                const y = (-coordinate[1] + MERC_MAX) * maxxy / (2 * MERC_MAX);
                return [x, y];
            },
            (coordinate) => {
                const x = coordinate[0] * (2 * MERC_MAX) / maxxy - MERC_MAX;
                const y = -1 * (coordinate[1] * (2 * MERC_MAX) / maxxy - MERC_MAX);
                return [x, y];
            });
    })(key, maxxy);
}

const baseDict = {
    osm: {
        mapID: 'osm',
        title: {
            ja: 'オープンストリートマップ',
            en: 'OpenStreetMap'
        },
        label: {
            ja: 'OSM(現在)',
            en: 'OSM(Now)'
        },
        attr: '©︎ OpenStreetMap contributors',
        maptype: 'base'
    },
    gsi: {
        mapID: 'gsi',
        title: {
            ja: '地理院地図',
            en: 'Geospatial Information Authority of Japan Map'
        },
        label: {
            ja: '地理院地図',
            en: 'GSI Map'
        },
        attr: {
            ja: '国土地理院',
            en: 'The Geospatial Information Authority of Japan'
        },
        maptype: 'base',
        url: 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
        maxZoom: 18
    },
    gsi_ortho: {
        mapID: 'gsi_ortho',
        title: {
            ja: '地理院地図オルソ航空写真',
            en: 'Geospatial Information Authority of Japan Ortho aerial photo'
        },
        label: {
            ja: '地理院オルソ',
            en: 'GSI Ortho'
        },
        attr: {
            ja: '国土地理院',
            en: 'The Geospatial Information Authority of Japan'
        },
        maptype: 'base',
        url: 'https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg',
        maxZoom: 18
    }
};

export class HistMap extends setCustomFunction(XYZ) {
    constructor(optOptions) {
        const options = optOptions || {};
        options.wrapX = false;
        if (!options.imageExtention) options.imageExtention = 'jpg';
        if (options.mapID) {
            options.url = options.url || `tiles/${options.mapID}/{z}/{x}/{y}.${options.imageExtention}`;
        }

        const zW = Math.log2(options.width/tileSize);
        const zH = Math.log2(options.height/tileSize);
        options.maxZoom = Math.ceil(Math.max(zW, zH));

        options.tileUrlFunction = options.tileUrlFunction || function(coord) {
            const z = coord[0];
            const x = coord[1];
            const y = -1 * coord[2] - 1;
            if (x * tileSize * Math.pow(2, this.maxZoom - z) >= this.width ||
                y * tileSize * Math.pow(2, this.maxZoom - z) >= this.height ||
                x < 0 || y < 0 ) {
                return transPng;
            }
            return this._tileUrlFunction(coord);
        };

        super(options);
        if (options.mapID) {
            this.mapID = options.mapID;
        }
        if (options.urls) {
            this._tileUrlFunction =
                createFromTemplates(
                    options.urls);
        } else if (options.url) {
            this._tileUrlFunction =
                createFromTemplates(
                    expandUrl(options.url));
        }

        this.width = options.width;
        this.height = options.height;
        this.maxZoom = options.maxZoom;
        this._maxxy = Math.pow(2, this.maxZoom) * tileSize;

        setCustomInitialize(this, options);
        setupTileLoadFunction(this);
    }

    getTransPng() {
        return transPng;
    }

    static createAsync(options, commonOptions) {
        if (typeof options === 'string') {
            options = baseDict[options];
        }

        options = Object.assign(options, commonOptions);
        options.label = options.label || options.year;
        options.sourceID = options.sourceID || options.mapID;
        if (options.maptype == 'base' || options.maptype == 'overlay' || options.maptype == 'mapbox') {
            const targetSrc = options.maptype == 'base' ? NowMap :
                options.maptype == 'overlay' ? TmsMap : MapboxMap;
            if (options.zoom_restriction) {
                options.maxZoom = options.maxZoom || options.merc_max_zoom;
                options.minZoom = options.minZoom || options.merc_min_zoom;
            }
            options.zoom_restriction = options.merc_max_zoom = options.merc_min_zoom = undefined;
            if (options.translator) {
                options.url = options.translator(options.url);
            }
            return targetSrc.createAsync(options).then((obj) => obj.initialWait.then(() => obj));
        } else if (options.noload) {
            options.merc_max_zoom = options.merc_min_zoom = undefined;
            return Promise.resolve(new HistMap_tin(options));
        }

        return new Promise(((resolve, reject) => {
            const url = options.setting_file || `maps/${options.mapID}.json`;
            const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
            xhr.open('GET', url, true);
            xhr.responseType = 'json';

            xhr.onload = function(e) { // eslint-disable-line no-unused-vars
                if (this.status == 200 || this.status == 0 ) { // 0 for UIWebView
                    try {
                        let resp = this.response;
                        if (typeof resp != 'object') resp = JSON.parse(resp);
                        options = Object.assign(resp, options);
                        options.label = options.label || resp.year;
                        if (options.translator) {
                            options.url = options.translator(options.url);
                        }
                        if (!options.maptype) options.maptype = 'maplat';

                        if (options.maptype == 'base' || options.maptype == 'overlay') {
                            const targetSrc = options.maptype == 'base' ? NowMap : TmsMap;
                            targetSrc.createAsync(options).then((ret) => {
                                resolve(ret);
                            }).catch((err) => {
                                reject(err);
                            });
                            return;
                        }

                        HistMap_tin.createAsync(options)
                            .then((obj) => {
                                obj.initialWait.then(() => {
                                    obj.mapSize2MercSize(resolve);
                                }).catch(() => {
                                    obj.mapSize2MercSize(resolve);
                                });
                            }).catch((err) => {
                                reject(err);
                            });
                    } catch(err) {
                        reject(err);
                    }
                } else {
                    reject('Fail to load map json');
                    // self.postMessage({'event':'cannotLoad'});
                }
            };
            xhr.send();
        }));
    }

    histMapCoords2Xy(histCoords) {
        const x = (histCoords[0] + MERC_MAX) * this._maxxy / (2*MERC_MAX);
        const y = (-histCoords[1] + MERC_MAX) * this._maxxy / (2*MERC_MAX);
        return [x, y];
    }

    xy2HistMapCoords(xy) {
        const histX = xy[0] * (2*MERC_MAX) / this._maxxy - MERC_MAX;
        const histY = -1 * (xy[1] * (2*MERC_MAX) / this._maxxy - MERC_MAX);
        return [histX, histY];
    }

    insideCheckXy(xy) {
        return !(xy[0] < 0 || xy[0] > this.width || xy[1] < 0 || xy[1] > this.height);
    }

    insideCheckHistMapCoords(histCoords) {
        return this.insideCheckXy(this.histMapCoords2Xy(histCoords));
    }

    modulateXyInside(xy) {
        const dx = xy[0] / (this.width / 2) - 1;
        const dy = xy[1] / (this.height / 2) - 1;
        const da = Math.max(Math.abs(dx), Math.abs(dy));
        return [(dx / da + 1) * this.width / 2, (dy / da + 1) * this.height / 2];
    }

    modulateHistMapCoordsInside(histCoords) {
        const xy = this.histMapCoords2Xy(histCoords);
        const ret = this.modulateXyInside(xy);
        return this.xy2HistMapCoords(ret);
    }
}


