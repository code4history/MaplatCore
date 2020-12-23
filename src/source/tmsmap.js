import { NowMap } from "./nowmap";

export class TmsMap extends NowMap {
    constructor(optOptions) {
        const options = optOptions || {};
        options.opaque = false;
        super(options);
    }

    static async createAsync(options) {
        const promise = new Promise(((resolve, reject) => { // eslint-disable-line no-unused-vars
            const obj = new TmsMap(options);
            resolve(obj);
        }));
        return promise.catch((err) => { throw err; });
    }
}