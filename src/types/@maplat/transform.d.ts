import { Feature, Polygon } from "@turf/turf";
export * from "@maplat/transform";

declare module "@maplat/transform" {
  interface Transform {
    xyBounds: Feature<Polygon>;
    mercBounds: Feature<Polygon>;
    priority: number;
    importance: number;
    wh?: number[];
    xy?: number[];
  }
}
