import { NowMap } from "./source/nowmap";
import { GoogleMap } from "./source/googlemap";
import { HistMap } from "./source/histmap";
import "whatwg-fetch";
export declare type MaplatSource = HistMap | NowMap | GoogleMap;
export declare type BackmapSource = NowMap | GoogleMap;
export declare function mapSourceFactory(options: any, commonOptions: any): Promise<unknown>;
export declare function registerMapToSW(options: any): Promise<any>;
declare const _default: {
    mapSourceFactory: typeof mapSourceFactory;
    registerMapToSW: typeof registerMapToSW;
    checkIsBaseMap: (source: MaplatSource) => boolean;
    checkIsMapbox: (source: MaplatSource) => boolean;
    checkIsWMTSMap: (source: MaplatSource) => boolean;
};
export default _default;
