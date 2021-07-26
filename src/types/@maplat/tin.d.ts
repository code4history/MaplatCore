import { Feature, Polygon } from "@turf/turf";
export * from "@maplat/tin";

declare module "@maplat/tin" {
  export default interface Tin {
    xyBounds: Feature<Polygon>;
    mercBounds: Feature<Polygon>;
  }
}
