import {NowMap} from "./nowmap";

export class MapboxMap extends NowMap {
    constructor(optOptions) {
        const options = optOptions || {};
        super(options);
        this.style = options.style;
        this.mapboxMap = options.mapboxMap;
    }

    static async createAsync(options) {
        const promise = new Promise(((resolve, reject) => { // eslint-disable-line no-unused-vars
            const obj = new MapboxMap(options);
            resolve(obj);
        }));
        return promise.catch((err) => { throw err; });
    }
}