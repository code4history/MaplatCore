import { XYZ } from "ol/source";
import { addCommonOptions, setCustomFunctionBase } from "./mixin";
export class NowMap extends setCustomFunctionBase(XYZ) {
    constructor(options = {}) {
        super(addCommonOptions(options));
        if (options.mapID) {
            this.mapID = options.mapID;
        }
        this.initialize(options);
    }
}
//# sourceMappingURL=nowmap.js.map