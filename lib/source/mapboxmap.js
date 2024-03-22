import { NowMap } from "./nowmap";
export class MapboxMap extends NowMap {
    constructor(options = {}) {
        super(options);
        this.style = "";
        this.accessToken = "";
        this.style = options.style;
        this.mapboxMap = options.mapboxMap;
    }
}
MapboxMap.isMapbox_ = true;
//# sourceMappingURL=mapboxmap.js.map