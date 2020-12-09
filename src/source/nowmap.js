import {OSM} from "ol/source";
import {normalizeArg} from "../functions";
import {lineString, point} from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import lineIntersect from "@turf/line-intersect";
import {setCustomFunction, setCustomInitialize, setupTileLoadFunction} from "../source_ex";

export class NowMap extends setCustomFunction(OSM) {
    constructor(optOptions) {
        const options = normalizeArg(Object.assign({}, optOptions || {}));
        if (!options.image_extention) options.image_extention = options.imageExtention || 'jpg';
        if (options.map_id) {
            if (options.map_id != 'osm') {
                options.url = options.url ||
                    (options.tms ? `tiles/${options.map_id}/{z}/{x}/{-y}.${options.image_extention}` :
                        `tiles/${options.map_id}/{z}/{x}/{y}.${options.image_extention}`);
            }
        }
        super(options);
        if (options.map_id) {
            this.mapID = options.map_id;
        }
        setCustomInitialize(this, options);
        setupTileLoadFunction(this);
    }

    static async createAsync(options) {
        return new Promise(((resolve, reject) => { // eslint-disable-line no-unused-vars
            const obj = new NowMap(options);
            resolve(obj);
        })).catch((err) => { throw err; });
    }

    xy2MercAsync(xy) {
        return new Promise(((resolve, reject) => { // eslint-disable-line no-unused-vars
            resolve(xy);
        })).catch((err) => { throw err; });
    }

    merc2XyAsync(merc) {
        return new Promise(((resolve, reject) => { // eslint-disable-line no-unused-vars
            resolve(merc);
        }));
    }

    insideCheckXy(xy) {
        if (!this.envelope) return true;
        const point_ = point(xy);
        return booleanPointInPolygon(point_, this.envelope);
    }

    insideCheckHistMapCoords(histCoords) {
        return this.insideCheckXy(histCoords);
    }

    modulateXyInside(xy) {
        if (!this.centroid) return xy;
        const expandLine = lineString([xy, this.centroid]);
        const intersect = lineIntersect(this.envelope, expandLine);
        if (intersect.features.length > 0 && intersect.features[0].geometry) {
            return intersect.features[0].geometry.coordinates;
        } else {
            return xy;
        }
    }

    modulateHistMapCoordsInside(histCoords) {
        return this.modulateXyInside(histCoords);
    }
}
