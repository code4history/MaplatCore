import { Feature, Polygon } from "geojson";
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
