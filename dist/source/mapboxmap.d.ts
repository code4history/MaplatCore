import { NowMap } from './nowmap';
export declare class MapboxMap extends NowMap {
    style: string;
    accessToken: string;
    mapboxMap: any;
    static isMapbox_: boolean;
    constructor(options?: any);
}
