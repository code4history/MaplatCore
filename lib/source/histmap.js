import { addCoordinateTransforms, addProjection, Projection } from "ol/proj";
import { MERC_MAX, tileSize, transPng } from "../const_ex";
import { addCommonOptions, setCustomFunctionMaplat } from "./mixin";
import { XYZ } from "ol/source";
import { createFromTemplates, expandUrl } from "ol/tileurlfunction";
for (let z = 0; z < 9; z++) {
    const key = `ZOOM:${z}`;
    const maxxy = 256 * Math.pow(2, z);
    (function (key, maxxy) {
        const projection = new Projection({
            code: key,
            extent: [0.0, 0.0, maxxy, maxxy],
            units: "m"
        });
        addProjection(projection);
        addCoordinateTransforms("EPSG:3857", projection, coordinate => {
            const x = ((coordinate[0] + MERC_MAX) * maxxy) / (2 * MERC_MAX);
            const y = ((-coordinate[1] + MERC_MAX) * maxxy) / (2 * MERC_MAX);
            return [x, y];
        }, coordinate => {
            const x = (coordinate[0] * (2 * MERC_MAX)) / maxxy - MERC_MAX;
            const y = -1 * ((coordinate[1] * (2 * MERC_MAX)) / maxxy - MERC_MAX);
            return [x, y];
        });
    })(key, maxxy);
}
export class HistMap extends setCustomFunctionMaplat(XYZ) {
    constructor(options = {}) {
        options = addCommonOptions(options);
        options.wrapX = false;
        const zW = Math.log2(options.width / tileSize);
        const zH = Math.log2(options.height / tileSize);
        options.maxZoom = Math.ceil(Math.max(zW, zH));
        options.tileUrlFunction =
            options.tileUrlFunction ||
                function (coord) {
                    const z = coord[0];
                    const x = coord[1];
                    const y = coord[2];
                    if (x * tileSize * Math.pow(2, this.maxZoom - z) >= this.width ||
                        y * tileSize * Math.pow(2, this.maxZoom - z) >= this.height ||
                        x < 0 ||
                        y < 0) {
                        return transPng;
                    }
                    return this._tileUrlFunction(coord);
                };
        super(options);
        if (options.mapID) {
            this.mapID = options.mapID;
        }
        if (options.urls) {
            this._tileUrlFunction = createFromTemplates(options.urls);
        }
        else if (options.url) {
            this._tileUrlFunction = createFromTemplates(expandUrl(options.url));
        }
        this.width = options.width;
        this.height = options.height;
        this.maxZoom = options.maxZoom;
        this._maxxy = Math.pow(2, this.maxZoom) * tileSize;
        this.initialize(options);
    }
}
//# sourceMappingURL=histmap.js.map