import { NowMap } from "./nowmap";
export declare class MapboxMap extends NowMap {
    style: string;
    accessToken: string;
    mapboxMap: any;
    constructor(options?: any);
    static createAsync(options: any): Promise<MapboxMap>;
}
