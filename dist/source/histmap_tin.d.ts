import { HistMap } from './histmap';
import { MapTransform } from '@maplat/transform';
import { Coordinate } from 'ol/coordinate';
import { Size } from 'ol/size';
import { CrossCoordinatesArray, ViewpointArray } from './mixin';
export declare class HistMap_tin extends HistMap {
    mapTransform: MapTransform;
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
    /**
     * @param layerIndex - 層番号（省略時は従来の層選択）。0 = 本図、1 以上 = 副層。
     *   使える副層（tinEnabled === false または compiled あり）だけに絞り込んだ後の
     *   添字 + 1 なので、地図 JSON の sub_maps の元の添字とはずれる場合がある。
     *   範囲外の番号・非整数は例外になる
     */
    viewpoint2MercsAsync(viewpoint?: ViewpointArray, size?: Size, layerIndex?: number): Promise<CrossCoordinatesArray>;
    /**
     * @param layerIndex - 層番号（省略時は従来の層選択）。0 = 本図、1 以上 = 副層。
     *   使える副層（tinEnabled === false または compiled あり）だけに絞り込んだ後の
     *   添字 + 1 なので、地図 JSON の sub_maps の元の添字とはずれる場合がある。
     *   範囲外の番号・非整数は例外になる
     */
    mercs2ViewpointAsync(mercs: CrossCoordinatesArray, layerIndex?: number): Promise<ViewpointArray>;
}
