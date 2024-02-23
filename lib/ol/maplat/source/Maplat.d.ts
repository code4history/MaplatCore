import TileImage from 'ol/source/TileImage.js';
import { Size } from 'ol/size.js';
import { AttributionLike } from 'ol/source/Source';
import { ProjectionLike } from 'ol/proj';
import { Extent } from 'ol/extent';
import { NearestDirectionFunction } from 'ol/array';
import { MaplatCompiledLegacy, MaplatSpecLegacy } from '../types/specLegacy';
declare type TierSizeCalculation = 'default' | 'truncated';
export interface Options extends Object {
    attributions: AttributionLike;
    cacheSize?: number;
    crossOrigin?: null | string;
    interpolate?: boolean;
    projection?: ProjectionLike;
    tilePixelRatio?: number;
    reprojectionErrorThreshold?: number;
    url?: string;
    tierSizeCalculation?: TierSizeCalculation;
    size?: Size;
    extent?: Extent;
    transition?: number;
    tileSize?: number;
    zDirection?: number | NearestDirectionFunction;
    tinCompiled?: MaplatCompiledLegacy;
    mapID?: string;
    settings: MaplatSpecLegacy;
    maxZoom?: number;
}
declare class Maplat extends TileImage {
    constructor(options: Options);
}
export default Maplat;
