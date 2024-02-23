import { Options } from './Maplat';
import { Source } from 'ol/source.js';
import { MaplatDefinition } from '../types/specFile';
import { MaplatSpecLegacy } from '../types/specLegacy';
declare class Factory {
    static factoryMaplatSource(settings: MaplatDefinition | MaplatSpecLegacy, options?: Options): Promise<any>;
    static factoryMaplatSourceFromUrl(mapID: string, url: string, options?: Options): Promise<Source>;
}
export default Factory;
