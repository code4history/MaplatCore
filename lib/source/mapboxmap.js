import { NowMap } from "./nowmap";
export class MapboxMap extends NowMap {
    constructor(optOptions) {
        super(optOptions || {});
        this.style = "";
        this.accessToken = "";
        this.style = optOptions.style;
        this.mapboxMap = optOptions.mapboxMap;
    }
    static async createAsync(options) {
        return new MapboxMap(options);
    }
}
//# sourceMappingURL=mapboxmap.js.map