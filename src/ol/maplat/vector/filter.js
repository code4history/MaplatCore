/**
 * @module ol/maplat/vector/filter
 */
import VectorSource from 'ol/source/Vector.js';

/**
 * @typedef {Object} Options
 * @property {import("ol/extent").Extent} [extent] Extent to be filterd. If `projectTo` is specfied, extent is based on `projectTo` projection.
 * @property {import("ol/proj").ProjectionLike} [projectTo] Projection to reproject.
 */

/**
 * Get a reprojected / filtered vector source.
 * @param {VectorSource} source A vector source to be reprojected / filtered.
 * @param {Options} options Options of vectorFilter
 * @return {VectorSource} The reprojected / filtered vector source.
 */
function filter(source, options = {}) {
  const extent = options.extent;
  const projectTo = options.projectTo;
  const retSource = new VectorSource();
  source.forEachFeature((f) => {
    const retF = f.clone();
    if (projectTo) {
      retF.setGeometry(retF.getGeometry().transform('EPSG:4326', projectTo));
    }
    if (!extent || retF.getGeometry().intersectsExtent(extent)) {
      retSource.addFeature(retF);
    }
  });
  return retSource;
}

export default filter;
