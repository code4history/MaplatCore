import VectorSource from 'ol/source/Vector';
import { Extent } from 'ol/extent';
import { ProjectionLike } from 'ol/proj';
declare type Options = {
    extent?: Extent;
    projectTo?: ProjectionLike;
};
declare function filter(source: VectorSource, options?: Options): VectorSource;
export default filter;
