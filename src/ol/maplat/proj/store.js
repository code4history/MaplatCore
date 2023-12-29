/**
 * @module ol/maplat/proj/store
 */

import {
  Projection,
  addCoordinateTransforms,
  addProjection,
  get as getProjection,
  transform,
} from 'ol/proj.js';

/**
 * @private
 * @type {Array<string>}
 */
const maplatProjectionStore = [];

function store(definition, toBase, fromBase) {
  //  const maplatProjectionCode = `Maplat:${mapID}`;
  let returnProjection;
  if (maplatProjectionStore.indexOf(definition.code) < 0) {
    returnProjection = new Projection(definition);
    addProjection(returnProjection);
    addCoordinateTransforms(returnProjection, 'EPSG:3857', toBase, fromBase);
    addCoordinateTransforms(
      returnProjection,
      'EPSG:4326',
      (xy) =>
        transform(
          transform(xy, returnProjection, 'EPSG:3857'),
          'EPSG:3857',
          'EPSG:4326'
        ),
      (lnglat) =>
        transform(
          transform(lnglat, 'EPSG:4326', 'EPSG:3857'),
          'EPSG:3857',
          returnProjection
        )
    );
    maplatProjectionStore.forEach((projectionCode) => {
      addCoordinateTransforms(
        returnProjection,
        projectionCode,
        (xy) =>
          transform(
            transform(xy, returnProjection, 'EPSG:3857'),
            'EPSG:3857',
            projectionCode
          ),
        (xy) =>
          transform(
            transform(xy, projectionCode, 'EPSG:3857'),
            'EPSG:3857',
            returnProjection
          )
      );
    });
    maplatProjectionStore.push(definition.code);
  } else {
    returnProjection = getProjection(definition.code);
  }

  return returnProjection;
}

export default store;
