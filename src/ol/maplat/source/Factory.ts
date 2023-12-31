/**
 * @module ol/maplat/source/Factory
 */
import { Options, default as Maplat } from './Maplat';
import Tin, { Compiled } from '@maplat/tin/lib/index.js';
import proj4 from 'proj4';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const proj4List = require('proj4-list');
import {
  Projection,
  addCoordinateTransforms,
  addProjection,
  get as getProjection,
  transform,
} from 'ol/proj.js';
import {XYZ, IIIF, Source} from 'ol/source.js';
import IIIFInfo from 'ol/format/IIIFInfo.js';
import {polygon} from '@turf/helpers';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const manifesto = require('manifesto.js');
import { MaplatDefinition } from '../types/specFile';
import { GeoJSONPolygonFeature, MaplatSpecLegacy } from '../types/specLegacy';
import { Position } from '@turf/turf';
import { MaplatProjection } from '../proj/Maplat';
import { Coordinate2D } from '../types/basics';

proj4.defs([
  ['TOKYO', '+proj=longlat +ellps=bessel +towgs84=-146.336,506.832,680.254'],
  ['JCP:NAD27', '+proj=longlat +ellps=clrk66 +datum=NAD27 +no_defs'],
  [
    'JCP:ZONEA:NAD27',
    '+proj=poly +lat_0=40.5 +lon_0=143 +x_0=914398.5307444408 +y_0=1828797.0614888816 +ellps=clrk66 +to_meter=0.9143985307444408 +no_defs',
  ],
  [
    'JCP:ZONEB:NAD27',
    '+proj=poly +lat_0=40.5 +lon_0=135 +x_0=914398.5307444408 +y_0=1828797.0614888816 +ellps=clrk66 +to_meter=0.9143985307444408 +no_defs',
  ],
  [
    'JCP:ZONEC:NAD27',
    '+proj=poly +lat_0=40.5 +lon_0=127 +x_0=914398.5307444408 +y_0=1828797.0614888816 +ellps=clrk66 +to_meter=0.9143985307444408 +no_defs',
  ],
]);

/**
 * @private
 * @type {Array<string>}
 */
const maplatProjectionStore: string[] = [];

class Factory {
  /**
   * @param {MaplatDefinition | MaplatSpecLegacy} settings Settings of Maplat
   * @param {import('./Maplat.js').Options} options Options for ol/source/TileImage
   * @return {Promise<import('./Maplat.js').default>} Maplat instance
   */
  static async factoryMaplatSource(settings: MaplatDefinition | MaplatSpecLegacy, options: Options = {} as Options) {
    const mapID = settings.mapID;
    options.mapID = mapID;
    let SourceClass: any;

    // IIIFの場合、IIIF用のoptionsを取得
    const settingsNew = settings as MaplatDefinition;
    if (settingsNew.sourceSpec && settingsNew.sourceSpec.tileSourceType === 'IIIF') { 
      SourceClass = IIIF;
      delete options.url;
      const manifest = await manifesto.loadManifest(settingsNew.sourceSpec.url!) as any;
      if (manifest.sequences && manifest.sequences[0] && manifest.sequences[0].canvases) {
        const infoUrl = `${manifest.sequences[0].canvases[settingsNew.sourceSpec.iiifNumber || 0].images[0].resource.service['@id']}/info.json`;
        const infoObj = await (await fetch(infoUrl)).json();
        const iiifOption = new IIIFInfo(infoObj).getTileSourceOptions();
        if (iiifOption === undefined || iiifOption.version === undefined) throw new Error('Invalid Image setting in IIIF settings');
        options = Object.assign(options, iiifOption);
      } else {
        throw new Error('Invalid IIIF settings');
      }
    } else if(!('url' in options)) {
      options.url = settingsNew.sourceSpec
        ? settingsNew.sourceSpec.url!
        : (settings as MaplatSpecLegacy).url!;
    }

    // Set up Maplat projection
    const createdProjection = createProjection(settings, options);
    const maplatProjection = Array.isArray(createdProjection)
      ? createdProjection[0]
      : createdProjection;
    options.projection = maplatProjection;
    if (!SourceClass) SourceClass = maplatProjection.getUnits() === 'pixels' ? Maplat : XYZ;
    const source = new SourceClass(options);
    console.log(source);
    source.set(
      'title',
      'metaData' in settings ? settings.metaData.title : settings.title
    );
    return source;
  }

  /**
   * @param {string} mapID ID of Map
   * @param {string} url URL of Map tile
   * @param {import('./Maplat.js').Options} options Options for ol/source/TileImage
   * @return {Promise<import('./Maplat.js').default>} Maplat instance
   */
  static async factoryMaplatSourceFromUrl(mapID: string, url: string, options: Options = {} as Options): Promise<Source> {
    const settingsReq = await fetch(url);
    const settings = await settingsReq.json();

    if (!mapID) {
      if (settings.mapID) {
        mapID = settings.mapID;
      } else {
        const mapDivide = url.split(/[\\/\\.]/);
        mapID = mapDivide[mapDivide.length - 2];
      }
    }
    settings.mapID = mapID;

    return this.factoryMaplatSource(settings, options);
  }
}

// Maplat定義の投影系を作成
function createProjection(settings: MaplatDefinition | MaplatSpecLegacy, options: Options, subNum = 0) {
  const maplatProjection = decideProjection(settings, options, subNum);
  if (
    maplatProjection.getCode() !== 'EPSG:3857' &&
    maplatProjectionStore.indexOf(maplatProjection.getCode()) < 0
  ) {
    // ピクセル座標と投影系座標間の変換関数を作成
    const [fromSystemToMapTransform, toSystemFromMapTransform] =
      createSystem2MapTransformation(settings);
    // 投影座標内でのワーピング処理用の変換関数を作成
    const [fromMapToWarpTransformation, toMapFromWarpTransformation] =
      createMap2WarpTransformation(settings);
    // 他のMaplat定義との変換処理用座標との変換関数を作成
    const [fromWarpToOperationTransform, toWarpFromOperationTransform] =
      createWarp2OperationTransformation(settings);

    // ピクセル座標と他のMaplat定義との変換処理用座標との変換定義
    const [toOperationCoord, fromOperationCoord] = [
      (xy: Coordinate2D) => {
        // ピクセル座標から、投影系座標に変換
        const mapCoord = fromSystemToMapTransform(xy);
        // 投影系座標上でのワーピング変換
        const warpCoord = fromMapToWarpTransformation(mapCoord as Coordinate2D);
        // 他のMaplat定義との変換処理用座標への変換
        const operationCoord = fromWarpToOperationTransform(warpCoord as Coordinate2D);
        return operationCoord;
      },
      (operationCoord: Coordinate2D) => {
        // 他のMaplat定義との変換処理用座標からの変換
        const warpCoord = toWarpFromOperationTransform(operationCoord);
        // ワーピング結果からの投影系座標への変換
        const mapCoord = toMapFromWarpTransformation(warpCoord);
        // 投影系座標からピクセル座標への変換
        const xy = toSystemFromMapTransform(mapCoord as Coordinate2D);
        return xy;
      },
    ];

    addProjection(maplatProjection);
    addCoordinateTransforms(
      maplatProjection,
      'EPSG:3857',
      toOperationCoord as any,
      fromOperationCoord as any
    );
    addCoordinateTransforms(
      maplatProjection,
      'EPSG:4326',
      xy =>
        transform(
          transform(xy, maplatProjection, 'EPSG:3857'),
          'EPSG:3857',
          'EPSG:4326'
        ),
      lnglat =>
        transform(
          transform(lnglat, 'EPSG:4326', 'EPSG:3857'),
          'EPSG:3857',
          maplatProjection
        )
    );
    maplatProjectionStore.forEach(projectionCode => {
      addCoordinateTransforms(
        maplatProjection,
        projectionCode,
        xy =>
          transform(
            transform(xy, maplatProjection, 'EPSG:3857'),
            'EPSG:3857',
            projectionCode
          ),
        xy =>
          transform(
            transform(xy, projectionCode, 'EPSG:3857'),
            'EPSG:3857',
            maplatProjection
          )
      );
    });
    maplatProjectionStore.push(maplatProjection.getCode());
  }

  let returnProjs;
  /*if (settings.sub_maps) {
    returnProjs = settings.sub_maps.map((subMap, index) => {
      const subSettings = Object.assign(
        {
          mapID: settings.mapID,
        },
        subMap
      );
      console.log(subSettings);
      console.log(settings);
      const retProj = createProjection(subSettings, options, index + 1);
      //retProj.set('priority', subSettings.priority);
      //retProj.set('importance', subSettings.importance);
      return retProj;
    });
    returnProjs.unshift(maplatProjection);
  }*/
  if (maplatProjection.getUnits() !== 'pixels') {
    if ('envelopLngLats' in settings) {
      const lnglats = settings.envelopLngLats!.concat([settings.envelopLngLats![0]]);
      const coords3857 = lnglats.map((lnglat: Coordinate2D) => transform(lnglat, 'EPSG:4326', 'EPSG:3857'));
      maplatProjection.mercBoundary = polygon([coords3857]) as GeoJSONPolygonFeature;
    }
  } else {
    if ("boundsPolygon" in settings) {
      maplatProjection.pixelBoundary = settings.boundsPolygon!;
    } else {
      const xys = [
        [0, 0],
        [options.size![0], 0],
        options.size,
        [0, options.size![1]],
        [0, 0],
      ];
      maplatProjection.pixelBoundary = polygon([xys as Position[]]) as GeoJSONPolygonFeature;
    }
    maplatProjection.mercBoundary = polygon([
      maplatProjection.pixelBoundary.geometry.coordinates[0].map((xy: Coordinate2D) => transform(xy, maplatProjection, 'EPSG:3857')),
    ]) as GeoJSONPolygonFeature;
  }

  return returnProjs ? returnProjs : maplatProjection;
}

function decideProjection(settings: MaplatDefinition | MaplatSpecLegacy, options: Options, subNum = 0): MaplatProjection {
  const projName = `Maplat:${settings.mapID}${subNum ? `#${subNum}` : ''}`;
  let projSelect = 'PIXEL';
  if (settingsIsLegacy(settings)) { // レガシーの場合
    if (settingsIs3857OnLegacy(settings)) {
      options.maxZoom = (settings as MaplatSpecLegacy).maxZoom;
      projSelect = settingsIsNoWarpOnLegacy3857(settings) ? '3857' : '3857+';
    }
  } else if (settingsIs3857(settings)) {
    options.maxZoom = (settings as MaplatDefinition).sourceSpec.maxZoom;
    projSelect = settingsIsNoWarp(settings) ? '3857' : '3857+';
  }
  let returnProj: Projection;
  switch (projSelect) {
    case '3857':
      returnProj = getProjection('EPSG:3857')!;
      break;
    case '3857+':
      returnProj = new Projection({
        code: projName,
        units: 'm',
        extent: [
          -20037508.342789244, -20037508.342789244, 20037508.342789244,
          20037508.342789244,
        ],
        worldExtent: [-180, -85, 180, 85],
      });
      break;
    default: {
      if (!('size' in options)) {
        options.size =
          'projectionSpec' in settings
            ? settings.projectionSpec.size
            : 'width' in settings && 'height' in settings
              ? [settings.width!, settings.height!]
              : settings.compiled.wh;
      }
      options.maxZoom = Math.ceil(
        Math.max(
          Math.log2(options.size![0] / 256),
          Math.log2(options.size![1] / 256)
        )
      );
      const extent = [0, -options.size![1], options.size![0], 0];
      const worldExtentSize = 256 * Math.pow(2, options.maxZoom);
      const worldExtent = [0, -worldExtentSize, worldExtentSize, 0];
      returnProj = new Projection({
        code: projName,
        units: 'pixels',
        extent,
        worldExtent,
      });
    }
  }

  return returnProj as MaplatProjection;
}

// ピクセル座標と投影系座標間の変換関数を作成
function createSystem2MapTransformation(settings: MaplatDefinition | MaplatSpecLegacy) {
  // レガシーの場合、そのまま流す
  if (settingsIsLegacy(settings)) { 
    return [coord2Coord, coord2Coord];
  }
  // ワールドファイル設定がある場合、それを元にピクセル座標から投影系座標へ
  if (settingsHasWorldParams(settings)) { 
    const worldParams = (settings as MaplatDefinition).projectionSpec.worldParams!;
    const a = worldParams.xScale;
    const b = worldParams.xRotation;
    const c = worldParams.xOrigin;
    const d = worldParams.yRotation;
    const e = worldParams.yScale;
    const f = worldParams.yOrigin;
    return [
      (xy: Coordinate2D) => [a * xy[0] - b * xy[1] + c, d * xy[0] - e * xy[1] + f],
      (xy: Coordinate2D) => [
        (xy[0] * e - xy[1] * b - c * e + f * b) / (a * e - b * d),
        -(xy[1] * a - xy[0] * d - f * a + c * d) / (a * e - b * d),
      ],
    ];
  }
  return [coord2Coord, coord2Coord];
}

// 投影座標内でのワーピング処理用の変換関数を作成
function createMap2WarpTransformation(settings: MaplatDefinition | MaplatSpecLegacy) {
  // レガシーの場合、MaplatTinなどでの処理を行う
  if (settingsIsLegacy(settings)) {
    // レガシーかつ3857の場合、メルカトルシフトがある場合はそれを適用
    if (settingsIs3857OnLegacy(settings)) {
      if (settingsIsNoWarpOnLegacy3857(settings)) {
        return [coord2Coord, coord2Coord];
      }
      const shiftX = (settings as MaplatSpecLegacy).mercatorXShift!;
      const shiftY = (settings as MaplatSpecLegacy).mercatorYShift!;
      return [
        (xy: Coordinate2D) => [xy[0] + shiftX, xy[1] + shiftY] ,
        (xy: Coordinate2D) => [xy[0] - shiftX, xy[1] - shiftY],
      ];
    }
    // MaplatTinでの処理
    const tin = new Tin();
    tin.setCompiled((settings as MaplatSpecLegacy).compiled as any);
    return [
      (xy: Coordinate2D) => tin.transform([xy[0], -xy[1]], false) as Coordinate2D,
      (merc: Coordinate2D) => {
        const xy = tin.transform(merc, true) as Coordinate2D;
        return [xy[0], -xy[1]];
      },
    ];
  }
  const projectionSpec = (settings as MaplatDefinition).projectionSpec;
  switch (projectionSpec.warp) {
    case 'TIN':
      // TIN処理
      return [coord2Coord, coord2Coord];
    case 'SHIFT':
      {
        const coordShift = projectionSpec.coordShift!;
        return [
          (xy: Coordinate2D) => [xy[0] + coordShift[0], xy[1] + coordShift[1]] as Coordinate2D,
          (xy: Coordinate2D) => [xy[0] - coordShift[0], xy[1] - coordShift[1]] as Coordinate2D,
        ];
      }
    default:
      return [coord2Coord, coord2Coord];
  }
}

// 他のMaplat定義との変換処理用座標（3857）との変換関数を作成
function createWarp2OperationTransformation(settings: MaplatDefinition | MaplatSpecLegacy) {
  // レガシーの場合、3857ベースになっているので、そのまま流す
  if (settingsIsLegacy(settings)) { 
    return [coord2Coord, coord2Coord];
  }
  const projectionSpec = (settings as MaplatDefinition).projectionSpec;
  // ピクセル座標の場合、ワープの時点で3857になっているので、そのまま流す
  if (projectionSpec.mapCoord === 'PIXEL') {
    return [coord2Coord, coord2Coord];
  }
  // Japan City Planの場合、NAD27に変換してからその値をTokyoとみなし、3857に変換
  if (projectionSpec.mapCoord.match(/^(JCP:ZONE[ABC])/)) {
    const zone = RegExp.$1;
    const map2nad = proj4(`${zone}:NAD27`, 'JCP:NAD27');
    const tky2merc = proj4('TOKYO', 'EPSG:3857');
    return [
      (xy: Coordinate2D) => {
        const tokyo = map2nad.forward(xy);
        const merc = tky2merc.forward(tokyo);
        return merc as Coordinate2D;
      },
      (merc: Coordinate2D) => {
        const tokyo = tky2merc.inverse(merc);
        const xy = map2nad.inverse(tokyo);
        return xy as Coordinate2D;
      },
    ];
  }
  // その他の投影系の場合、3857に変換する
  if (projectionSpec.mapCoord.match(/^EPSG:\d+$/)) {
    const epsg = projectionSpec.mapCoord;
    if (!proj4.defs(epsg)) {
      if (projectionSpec.mapCoordText) {
        proj4.defs(epsg, projectionSpec.mapCoordText);
      } else if (proj4List[epsg]) {
        proj4.defs(epsg, proj4List[epsg][1]);
      } else {
        throw new Error(`Unsupported projection by proj4 and proj4-list: ${epsg}`);
      }
    }
    const map2merc = proj4(epsg, 'EPSG:3857');
    return [
      (xy: Coordinate2D) => {
        const merc = map2merc.forward(xy);
        return merc as Coordinate2D;
      },
      (merc: Coordinate2D) => {
        const xy = map2merc.inverse(merc);
        return xy as Coordinate2D;
      },
    ];
  }
  throw new Error(`Cannot handle projection: ${projectionSpec.mapCoord}`);
}

function coord2Coord(xy: Coordinate2D) {
  return xy;
}

// データのバージョンが設定のルートにない場合、レガシーとみなす
function settingsIsLegacy(settings: MaplatDefinition | MaplatSpecLegacy) {
  return !('version' in settings);
}

function settingsIs3857OnLegacy(settings: MaplatDefinition | MaplatSpecLegacy) {
  return "maptype" in settings && (
    settings.maptype === 'base' ||
    settings.maptype === 'overlay' ||
    settings.maptype === 'mapbox'
  );
}

function settingsIsNoWarpOnLegacy3857(settings: MaplatDefinition | MaplatSpecLegacy) {
  return !('mercatorXShift' in settings && 'mercatorYShift' in settings);
}

function settingsIs3857(settings: MaplatDefinition | MaplatSpecLegacy) {
  return (
    "projectionSpec" in settings &&
    settings.projectionSpec.mapCoord === 'EPSG:3857' &&
    (settings.sourceSpec.tileSourceType === 'WMTS' ||
      settings.sourceSpec.tileSourceType === 'TMS')
  );
}

function settingsIsNoWarp(settings: MaplatDefinition | MaplatSpecLegacy) {
  return "projectionSpec" in settings && settings.projectionSpec.warp === 'NONE';
}

function settingsHasWorldParams(settings: MaplatDefinition | MaplatSpecLegacy): boolean {
  return "projectionSpec" in settings && "worldParams" in settings.projectionSpec;
}

export default Factory;
