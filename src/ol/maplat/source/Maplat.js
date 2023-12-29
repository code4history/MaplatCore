/**
 * @module ol/maplat/source/Maplat
 */
import TileGrid from 'ol/tilegrid/TileGrid.js';
import TileImage from 'ol/source/TileImage.js';
import {CustomTile} from 'ol/source/Zoomify.js';
import {DEFAULT_TILE_SIZE} from 'ol/tilegrid/common.js';
import {toSize} from 'ol/size.js';

/**
 * @typedef {'default' | 'truncated'} TierSizeCalculation
 */

/*
 * @property {import("ol/source/Source").AttributionLike} [attributions] Attributions.
 * @property {number} [cacheSize] Initial tile cache size. Will auto-grow to hold at least the number of tiles in the viewport.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
 * you must provide a `crossOrigin` value  you want to access pixel data with the Canvas renderer.
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
 * @property {boolean} [interpolate=true] Use interpolated values when resampling.  By default,
 * linear interpolation is used when resampling.  Set to false to use the nearest neighbor instead.
 * @property {number} [tilePixelRatio] The pixel ratio used by the tile service. For example, if the tile service advertizes 256px by 256px tiles but actually sends 512px by 512px images (for retina/hidpi devices) then `tilePixelRatio` should be set to `2`
 * @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
 * Higher values can increase reprojection performance, but decrease precision.
 * @property {string} url URL template of the Maplat tile.
 * @property {import("ol/size").Size} size Size.
 * @property {number} [transition] Duration of the opacity transition for rendering.
 * To disable the opacity transition, pass `transition: 0`.
 * @property {number} [tileSize=256] Tile size. Same tile size is used for all zoom levels.
 * @property {number|import("ol/array").NearestDirectionFunction} [zDirection=0]
 * Choose whether to use tiles with a higher or lower zoom level when between integer
 * zoom levels. See {@link module:ol/tilegrid/TileGrid~TileGrid#getZForResolution}.
 * @property {MaplatCompiledLegacy} [tinCompiled] Compiled data of Maplat TIN (Triangle Irregular Network) setting.
 * @property {string} [mapID] Map ID of Maplat data.
 * @property {MaplatSpecLegacy} settings Setting of Tin.
 */

/**
 * @typedef {Object} Options
 * @property {import("ol/source/Source.js").AttributionLike} [attributions] Attributions.
 * @property {number} [cacheSize] Initial tile cache size. Will auto-grow to hold at least the number of tiles in the viewport.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
 * you must provide a `crossOrigin` value  you want to access pixel data with the Canvas renderer.
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
 * @property {boolean} [interpolate=true] Use interpolated values when resampling.  By default,
 * linear interpolation is used when resampling.  Set to false to use the nearest neighbor instead.
 * @property {import("ol/proj.js").ProjectionLike} [projection] Projection.
 * @property {number} [tilePixelRatio] The pixel ratio used by the tile service. For example, if the tile service advertizes 256px by 256px tiles but actually sends 512px by 512px images (for retina/hidpi devices) then `tilePixelRatio` should be set to `2`
 * @property {number} [reprojectionErrorThreshold=0.5] Maximum allowed reprojection error (in pixels).
 * Higher values can increase reprojection performance, but decrease precision.
 * @property {string} url URL template or base URL of the Zoomify service.
 * A base URL is the fixed part
 * of the URL, excluding the tile group, z, x, and y folder structure, e.g.
 * `http://my.zoomify.info/IMAGE.TIF/`. A URL template must include
 * `{TileGroup}`, `{x}`, `{y}`, and `{z}` placeholders, e.g.
 * `http://my.zoomify.info/IMAGE.TIF/{TileGroup}/{z}-{x}-{y}.jpg`.
 * Internet Imaging Protocol (IIP) with JTL extension can be also used with
 * `{tileIndex}` and `{z}` placeholders, e.g.
 * `http://my.zoomify.info?FIF=IMAGE.TIF&JTL={z},{tileIndex}`.
 * A `{?-?}` template pattern, for example `subdomain{a-f}.domain.com`, may be
 * used instead of defining each one separately in the `urls` option.
 * @property {TierSizeCalculation} [tierSizeCalculation] Tier size calculation method: `default` or `truncated`.
 * @property {import("ol/size.js").Size} size Size.
 * @property {import("ol/extent.js").Extent} [extent] Extent for the TileGrid that is created.
 * Default sets the TileGrid in the
 * fourth quadrant, meaning extent is `[0, -height, width, 0]`. To change the
 * extent to the first quadrant (the default for OpenLayers 2) set the extent
 * as `[0, 0, width, height]`.
 * @property {number} [transition] Duration of the opacity transition for rendering.
 * To disable the opacity transition, pass `transition: 0`.
 * @property {number} [tileSize=256] Tile size. Same tile size is used for all zoom levels.
 * @property {number|import("ol/array.js").NearestDirectionFunction} [zDirection=0]
 * Choose whether to use tiles with a higher or lower zoom level when between integer
 * zoom levels. See {@link module:ol/tilegrid/TileGrid~TileGrid#getZForResolution}.
 * @property {MaplatCompiledLegacy} [tinCompiled] Compiled data of Maplat TIN (Triangle Irregular Network) setting.
 * @property {string} [mapID] Map ID of Maplat data.
 * @property {MaplatSpecLegacy} settings Setting of Tin.
 */

/**
 * @classdesc
 * Layer source for tile data in Zoomify format (both Zoomify and Internet
 * Imaging Protocol are supported).
 * @api
 */
class Maplat extends TileImage {
  /**
   * @param {!Options} options Maplat options.
   */
  constructor(options) {
    const op = options;
    const size = op.size;

    const tilePixelRatio = options.tilePixelRatio || 1;
    const imageWidth = size[0];
    const imageHeight = size[1];
    const tierSizeInTiles = [];
    const tileSize = options.tileSize || DEFAULT_TILE_SIZE;
    const tileSizeForTierSizeCalculation = tileSize * tilePixelRatio;

    let width = imageWidth;
    let height = imageHeight;
    while (
      width > tileSizeForTierSizeCalculation ||
      height > tileSizeForTierSizeCalculation
    ) {
      tierSizeInTiles.push([
        Math.ceil(width / tileSizeForTierSizeCalculation),
        Math.ceil(height / tileSizeForTierSizeCalculation),
      ]);
      width >>= 1;
      height >>= 1;
    }

    tierSizeInTiles.push([1, 1]);
    tierSizeInTiles.reverse();

    const resolutions = [tilePixelRatio];
    const tileCountUpToTier = [0];
    for (let i = 1, ii = tierSizeInTiles.length; i < ii; i++) {
      resolutions.push(tilePixelRatio << i);
      tileCountUpToTier.push(
        tierSizeInTiles[i - 1][0] * tierSizeInTiles[i - 1][1] +
          tileCountUpToTier[i - 1]
      );
    }
    resolutions.reverse();

    const tileGrid = new TileGrid({
      tileSize: tileSize,
      extent: options.extent || [0, -imageHeight, imageWidth, 0],
      resolutions: resolutions,
    });

    const url = options.url;
    const tileUrlFunction = (tileCoord) =>
      url
        .replace('{z}', `${tileCoord[0]}`)
        .replace('{x}', `${tileCoord[1]}`)
        .replace('{y}', `${tileCoord[2]}`);

    const ZoomifyTileClass = CustomTile.bind(
      null,
      toSize(tileSize * tilePixelRatio)
    );

    super({
      attributions: options.attributions,
      cacheSize: options.cacheSize,
      crossOrigin: options.crossOrigin,
      interpolate: options.interpolate,
      projection: options.projection,
      tilePixelRatio: tilePixelRatio,
      reprojectionErrorThreshold: options.reprojectionErrorThreshold,
      tileClass: ZoomifyTileClass,
      tileGrid: tileGrid,
      tileUrlFunction: tileUrlFunction,
      transition: options.transition,
    });

    /**
     * @type {number|import("ol/array.js").NearestDirectionFunction}
     */
    this.zDirection = options.zDirection;
  }
}

export default Maplat;
