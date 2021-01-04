import { NowMap } from "./nowmap";
export class TmsMap extends NowMap {
    constructor(options = {}) {
        super(Object.assign(options, { opaque: false }));
    }
    static async createAsync(options) {
        return new TmsMap(options);
    }
}
//# sourceMappingURL=tmsmap.js.map