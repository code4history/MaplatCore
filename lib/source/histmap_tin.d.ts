import { HistMap } from "./histmap";
import Tin from "@maplat/tin";
import { Coordinate } from "ol/coordinate";
export declare class HistMap_tin extends HistMap {
    tins: Tin[];
    constructor(options?: any);
    static createAsync(options: any): Promise<HistMap_tin>;
    xy2MercAsync_specifyLayer(xy: Coordinate, layerId: number): Promise<Coordinate>;
    merc2XyAsync_specifyLayer(merc: any, layerId: any): Promise<unknown>;
    xy2MercAsync_returnLayer(xy: Coordinate): Promise<[number, Coordinate]>;
    merc2XyAsync_returnLayer(merc: any): Promise<any>;
    mapSize2MercSize(callback: any): void;
    size2MercsAsync(center: any, zoom: any, rotate: any): Promise<any[]>;
    mercs2SizeAsync(mercs: any, asMerc: any): Promise<[Coordinate, number, number]>;
    mercs2XysAsync(mercs: any): Promise<any[]>;
    xy2MercAsync(xy: Coordinate): Promise<Coordinate>;
    merc2XyAsync(merc: Coordinate, ignoreBackside: any): Promise<Coordinate | undefined>;
}
