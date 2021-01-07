import { HistMap } from "./histmap";
import Tin from "@maplat/tin";
import { Coordinate } from "ol/coordinate";
export declare class HistMap_tin extends HistMap {
    tins: Tin[];
    constructor(options?: any);
    static createAsync(options: any): Promise<HistMap_tin>;
    xy2MercAsync_specifyLayer(xy: Coordinate, layerId: number): Promise<Coordinate>;
    merc2XyAsync_specifyLayer(merc: Coordinate, layerId: number): Promise<Coordinate>;
    xy2MercAsync_returnLayer(xy: Coordinate): Promise<[number, Coordinate]>;
    merc2XyAsync_returnLayer(merc: Coordinate): Promise<([number, Coordinate] | undefined)[]>;
    mapSize2MercSize(callback: any): void;
    size2MercsAsync(center?: Coordinate, zoom?: number, rotate?: number): Promise<number[][]>;
    mercs2SizeAsync(mercs: Coordinate[], asMerc?: boolean): Promise<[Coordinate, number, number]>;
    mercs2XysAsync(mercs: any): Promise<any[]>;
    xy2MercAsync(xy: Coordinate): Promise<Coordinate>;
    merc2XyAsync(merc: Coordinate, ignoreBackside?: boolean): Promise<Coordinate | undefined>;
}
