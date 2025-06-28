import { NowMap } from "./nowmap";
export class TmsMap extends NowMap {
    constructor(options = {}) {
        super(Object.assign(options, { opaque: false }));
    }
}
TmsMap.isBasemap_ = false;
//# sourceMappingURL=tmsmap.js.map