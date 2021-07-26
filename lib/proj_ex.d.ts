import { ProjectionLike } from "ol/proj";
import { Coordinate } from "ol/coordinate";
export declare function transformDirect(src: ProjectionLike, dist: ProjectionLike, xy?: Coordinate): Coordinate | undefined;
