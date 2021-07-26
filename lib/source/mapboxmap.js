import { NowMap } from "./nowmap";
export class MapboxMap extends NowMap {
    constructor(options = {}) {
        super(options);
        this.style = "";
        this.accessToken = "";
        this.style = options.style;
        this.mapboxMap = options.mapboxMap;
    }
    static async createAsync(options) {
        return new MapboxMap(options);
    }
}
//# sourceMappingURL=mapboxmap.js.map