import { NowMap } from "./nowmap";
export declare class TmsMap extends NowMap {
    constructor(options?: any);
    static createAsync(options: any): Promise<TmsMap>;
}
