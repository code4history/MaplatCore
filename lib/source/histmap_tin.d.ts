import { HistMap } from "./histmap";
import Tin from "@maplat/tin";
import { Coordinate } from "ol/coordinate";
import { Size } from "ol/size";
import { CrossCoordinatesArray, ViewpointArray } from "./mixin";
export declare class HistMap_tin extends HistMap {
    tins: Tin[];
    constructor(options?: any);
    static createAsync(options: any): Promise<HistMap_tin>;
    xy2MercAsync_specifyLayer(xy: Coordinate, layerId: number): Promise<Coordinate>;
    merc2XyAsync_specifyLayer(merc: Coordinate, layerId: number): Promise<Coordinate>;
    xy2MercAsync_returnLayer(xy: Coordinate): Promise<[number, Coordinate]>;
    merc2XyAsync_returnLayer(merc: Coordinate): Promise<([number, Coordinate] | undefined)[]>;
    setupMapParameter(callback: any): void;
    mercs2SysCoordsAsync_multiLayer(mercs: CrossCoordinatesArray): Promise<(CrossCoordinatesArray | undefined)[]>;
    merc2XyAsync_base(merc: Coordinate, ignoreBackground: boolean): Promise<Coordinate | void>;
    merc2XyAsync_ignoreBackground(merc: Coordinate): Promise<Coordinate | void>;
    merc2XyAsync(merc: Coordinate): Promise<Coordinate>;
    xy2MercAsync(xy: Coordinate): Promise<Coordinate>;
    viewpoint2MercsAsync(viewpoint?: ViewpointArray, size?: Size): Promise<CrossCoordinatesArray>;
    mercs2ViewpointAsync(mercs: CrossCoordinatesArray): Promise<ViewpointArray>;
}
