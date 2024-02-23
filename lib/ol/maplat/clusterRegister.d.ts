import Feature from 'ol/Feature.js';
import LayerGroup from 'ol/layer/Group.js';
import { Geometry } from 'ol/geom.js';
import { StyleLike } from 'ol/style/Style';
import { Map } from 'ol';
import VectorSource from 'ol/source/Vector';
declare class clusterRegister extends LayerGroup {
    pointermove__: any;
    pointerclick__: any;
    map__: Map | undefined;
    removeMap(): void;
    registerMap(source: VectorSource<Feature<Geometry>>, map: Map, callback: (feature: Feature<Geometry>) => StyleLike): void;
}
export default clusterRegister;
