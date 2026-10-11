import { MapTransform } from '@maplat/transform';
import { Coordinate } from 'ol/coordinate';
export type MapTransformWithVisibleLayers = MapTransform & Partial<{
    merc2XyVisibleLayers(merc: number[]): [number, number[]][];
}>;
export declare function selectDisplayCandidates(mapTransform: MapTransformWithVisibleLayers, merc: number[], insideCheckXy: (xy: Coordinate) => boolean): [number, Coordinate][] | null;
