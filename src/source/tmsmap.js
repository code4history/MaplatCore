import { NowMap } from "./nowmap";

export class TmsMap extends NowMap {
    constructor(optOptions) {
        const options = optOptions || {};
        options.opaque = false;
        super(options);
    }

    static async createAsync(options) {
        return new TmsMap(options);
    }
}