import Projection from "ol/proj/Projection";
import { GeoJSONPolygonFeature } from "../types/specLegacy";
export declare class MaplatProjection extends Projection {
    pixelBoundary?: GeoJSONPolygonFeature;
    mercBoundary?: GeoJSONPolygonFeature;
}
