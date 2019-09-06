import { getDistance, randomFromCenter, recursiveRound } from './math_ex';
import { transformDirect } from './proj_ex';
import { View } from './view_ex';
import { setCustomFunctionet } from "./source_x";

import { Style, Icon, Fill, Stroke } from 'ol/style';

//define(['ol3', 'turf'], function(ol, turf) {
// 透明PNG定義
const transPng = 'data:image/png;base64,'+
    'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAB3RJTUUH3QgIBToaSbAjlwAAABd0'+
    'RVh0U29mdHdhcmUAR0xEUE5HIHZlciAzLjRxhaThAAAACHRwTkdHTEQzAAAAAEqAKR8AAAAEZ0FN'+
    'QQAAsY8L/GEFAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAFRJREFUeNrtwQEBAAAAgJD+'+
    'r+4ICgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
    'AAAAAAAAAAAAABgBDwABHHIJwwAAAABJRU5ErkJggg==';
// タイル画像サイズ
const tileSize = 256;
// canvasのテンプレート
const canvBase = '<canvas width="' + ol.tileSize + '" height="' + ol.tileSize + '" src="' + ol.transPng + '"></canvas>';

export const MERC_MAX = 20037508.342789244;
export const MERC_CROSSMATRIX = [
    [0.0, 0.0],
    [0.0, 1.0],
    [1.0, 0.0],
    [0.0, -1.0],
    [-1.0, 0.0]
];

const gpsStyle = new Style({
    image: new Icon(({
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'parts/bluedot.png'
    }))
});
const gpsHideStyle = new Style({
    image: new Icon(({
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'parts/bluedot_transparent.png'
    }))
});
const gpsSubStyle = new Style({
    image: new Icon(({
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'parts/bluedot_small.png'
    }))
});
const accCircleStyle = new Style({
    fill: new Fill({
        color: [128, 128, 256, 0.2]
    }),
    stroke: new Stroke({
        color: [128, 128, 256, 1.0],
        width: 3
    })
});
const markerDefaultStyle = new Style({
    image: new Icon(({
        anchor: [0.5, 1.0],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'parts/defaultpin.png'
    }))
});
