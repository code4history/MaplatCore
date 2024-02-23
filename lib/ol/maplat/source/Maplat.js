import TileGrid from 'ol/tilegrid/TileGrid.js';
import TileImage from 'ol/source/TileImage.js';
import { CustomTile } from 'ol/source/Zoomify.js';
import { DEFAULT_TILE_SIZE } from 'ol/tilegrid/common.js';
import { toSize } from 'ol/size.js';
;
class Maplat extends TileImage {
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
        while (width > tileSizeForTierSizeCalculation ||
            height > tileSizeForTierSizeCalculation) {
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
            tileCountUpToTier.push(tierSizeInTiles[i - 1][0] * tierSizeInTiles[i - 1][1] +
                tileCountUpToTier[i - 1]);
        }
        resolutions.reverse();
        const tileGrid = new TileGrid({
            tileSize,
            extent: options.extent || [0, -imageHeight, imageWidth, 0],
            resolutions,
        });
        const url = options.url;
        const tileUrlFunction = (tileCoord) => url
            .replace('{z}', `${tileCoord[0]}`)
            .replace('{x}', `${tileCoord[1]}`)
            .replace('{y}', `${tileCoord[2]}`);
        const ZoomifyTileClass = CustomTile.bind(null, toSize(tileSize * tilePixelRatio));
        super({
            attributions: options.attributions,
            cacheSize: options.cacheSize,
            crossOrigin: options.crossOrigin,
            interpolate: options.interpolate,
            projection: options.projection,
            tilePixelRatio,
            reprojectionErrorThreshold: options.reprojectionErrorThreshold,
            tileClass: ZoomifyTileClass,
            tileGrid,
            tileUrlFunction,
            transition: options.transition,
        });
        this.zDirection = options.zDirection;
    }
}
export default Maplat;
//# sourceMappingURL=Maplat.js.map