import FormatGeoJSON from 'ol/format/GeoJSON.js';
import FormatKML from 'ol/format/KML.js';
import Map from 'ol/Map.js';
import MaplatFactory from '../src/ol/maplat/source/Factory.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import WebGLTileLayer from 'ol/layer/WebGLTile.js';
import clusterRegister from '../src/ol/maplat/clusterRegister.ts';
import localeSelector from '../src/ol/maplat/locale/selector.js';
import vectorFilter from '../src/ol/maplat/vector/filter.js';
import viewportSwitcher from '../src/ol/maplat/viewport/switcher.js';
import {DragRotate} from 'ol/interaction.js';
import {Icon, Style} from 'ol/style.js';
import {altKeyOnly} from 'ol/events/condition.js';
import {defaults} from 'ol/interaction/defaults.js';
import {transform} from 'ol/proj.js';

(async () => {
const centerLngLat = [139.53671, 36.24668];

const createPoiSource = async url => {
  const vectorReq = await fetch(url);
  const vectorJSON = await vectorReq.json();
  const vectorSource = new VectorSource({
    features: new FormatGeoJSON().readFeatures(vectorJSON, {
      featureProjection: 'EPSG:4326',
      dataProjection: 'EPSG:4326',
    }),
  });
  return vectorSource;
};

const createKmlSource = async url => {
  const contourReq = await fetch(url);
  const contourText = await contourReq.text();
  const contourSource = new VectorSource({
    features: new FormatKML().readFeatures(contourText, {
      featureProjection: 'EPSG:4326',
      dataProjection: 'EPSG:4326',
    }),
  });
  return contourSource;
};

const stockIconHash = {};
const stockIconStyle = clusterMember => {
  // eslint-disable-next-line no-undef
  const key = iconSelector(clusterMember);
  if (!stockIconHash[key]) {
    stockIconHash[key] = new Icon({
      src: key,
      anchor: [0.5, 1.0],
    });
  }
  return new Style({
    geometry: clusterMember.getGeometry(),
    image: stockIconHash[key],
  });
};

const dataSources = [
  {
    area: '館林',
    raster: [
      'https://s.maplat.jp/r/tatebayashimap/maps/tatebayashi_ojozu.json',
      'https://s.maplat.jp/r/tatebayashimap/maps/tatebayashi_castle_akimoto.json',
      'https://s.maplat.jp/r/tatebayashimap/maps/tatebayashi_satonuma_village_1.json',
      'data/maplat/kanto_rapid-900913.json',
      'data/maplat/osm.json',
    ],
    vector: [
      {
        url: 'data/maplat/yagoe_contour.kml',
        type: 'kml',
      },
      {
        url: 'https://raw.githubusercontent.com/code4history/TatebayashiStones/master/tatebayashi_stones.geojson',
        type: 'geojson',
        style: stockIconStyle,
      },
    ],
  },
  {
    area: '奈良',
    raster: [
      'https://s.maplat.jp/r/naramap/maps/nara_saiken_ndl.json',
      'https://s.maplat.jp/r/naramap/maps/nara_ezuya.json',
      'data/maplat/osm.json',
    ],
    vector: [
      {
        url: 'https://raw.githubusercontent.com/code4history/JizoProject/master/jizo_project.geojson',
        type: 'geojson',
        style: stockIconStyle,
      },
    ],
  },
  {
    area: '姫路',
    raster: [
      'https://s.maplat.jp/r/himejimap/maps/Jissoku_Himeji_Shigai.json',
      'data/maplat/txu-oclc-6565467.json',
      'data/maplat/osm.json',
    ],
  },
  {
    area: '延岡',
    raster: [
      'data/maplat/1932_nobeoka.json',
      'data/maplat/osm.json',
    ],
  },
  {
    area: '種子島',
    raster: [
      'data/maplat/iiif_test.json',
      'data/maplat/osm.json'
    ],
  },
];
await Promise.all(
  dataSources.map(async dataSource => {
    if (dataSource.raster) {
      dataSource.raster = await Promise.all(
        dataSource.raster.map(url =>
          MaplatFactory.factoryMaplatSourceFromUrl(null, url)
        )
      );
    }
    if (dataSource.vector) {
      dataSource.vector = await Promise.all(
        dataSource.vector.map(async vector => {
          const source =
            vector.type == 'geojson'
              ? await createPoiSource(vector.url)
              : await createKmlSource(vector.url);
          return {
            source,
            style: vector.style,
          };
        })
      );
    }
  })
);

let map;

const areaSelect = document.getElementById('area_select');
const layerSelect = document.getElementById('layer_select');
areaSelect.onchange = function () {
  const area = areaSelect.value;
  // eslint-disable-next-line no-console
  areaSelectFunc(area * 1);
};
layerSelect.onchange = function () {
  const layer = layerSelect.value;
  // eslint-disable-next-line no-console
  layerSelectFunc(layer * 1);
};
let areaOptions = '';
dataSources.forEach((data, index) => {
  areaOptions = `${areaOptions}<option value="${index}">${data.area}</option>`;
});
areaSelect.innerHTML = areaOptions;
areaSelectFunc(0);

function areaSelectFunc(area_id) {
  const areaData = dataSources[area_id];
  let layerOptions = '';
  areaData.raster.forEach((raster, index) => {
    layerOptions = `${layerOptions}<option value="${index}">${localeSelector(
      raster.get('title'),
      'ja'
    )}</option>`;
  });
  layerSelect.innerHTML = layerOptions;
  layerSelectFunc(0, true);
}

function layerSelectFunc(layer_id, clearMap) {
  const area_id = areaSelect.value * 1;
  const areaData = dataSources[area_id];

  const fromSource =
    clearMap || !map ? null : map.getLayers().getArray()[0].getSource();
  const toSource = areaData.raster[layer_id];
  console.log(toSource.getProjection());

  let toCenter, toResolution, toRotation, toParam;
  if (!fromSource) {
    toParam = {
      center: transform(centerLngLat, 'EPSG:4326', toSource.getProjection()),
      rotation: 0,
      zoom: 0,
    };
  } else {
    const fromView = map.getView();
    const fromCenter = fromView.getCenter();
    const fromRotation = fromView.getRotation();
    const fromResolution = fromView.getResolution();
    [toCenter, toRotation, toResolution] = viewportSwitcher(
      fromCenter,
      fromRotation,
      fromResolution,
      500,
      fromSource.getProjection(),
      toSource.getProjection()
    );
    toParam = {
      center: toCenter,
      rotation: toRotation,
      resolution: toResolution,
    };
  }
  toParam = Object.assign(toParam, {
    projection: toSource.getProjection(),
    constrainRotation: false,
  });
  const view = new View(toParam);

  let addMapToCluster;
  const layers = areaData.vector
    ? areaData.vector.map(vector => {
        const source = vector.source;
        const filteredSource = vectorFilter(source, {
          projectTo: toSource.getProjection(),
          extent: toSource.getProjection().getExtent(),
        });
        if (vector.style) {
          const clusterLayer = new clusterRegister({});
          addMapToCluster = () => {
            clusterLayer.registerMap(filteredSource, map, vector.style);
          };
          return clusterLayer;
        }
        return new VectorLayer({
          source: filteredSource,
        });
      })
    : [];

  layers.unshift(
    new WebGLTileLayer({
      title: localeSelector(toSource.get('title'), 'ja'),
      source: toSource,
    })
  );

  const frontDiv = document.querySelector('#map');
  if (!map) {
    map = new Map({
      target: frontDiv,
      layers,
      view,
      interactions: defaults({altShiftDragRotate: false}).extend([
        new DragRotate({condition: altKeyOnly}),
      ]),
    });
  } else {
    map.getLayers().forEach(layer => {
      if (layer.removeMap) {
        layer.removeMap();
      }
    });
    map.setLayers(layers);
    map.setView(view);
  }
  if (addMapToCluster) {
    addMapToCluster();
  }
  if (!fromSource) {
    view.fit(toSource.getProjection().getExtent(), {padding: [50, 50, 50, 50]});
  }
}
})();