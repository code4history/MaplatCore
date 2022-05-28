import {
  getTransform,
  identityTransform,
  transform,
  addCoordinateTransforms,
  ProjectionLike
} from "ol/proj";
import { Coordinate } from "ol/coordinate";

// Direct transformation between 2 projection
export function transformDirect(
  src: ProjectionLike,
  dist: ProjectionLike,
  xy?: Coordinate
): Coordinate | undefined {
  const srcCode = typeof src === "string" ? src : src!.getCode();
  const distCode = typeof dist === "string" ? dist : dist!.getCode();
  let func = getTransform(src, dist);
  if (func == identityTransform && srcCode != distCode) {
    const srcFunc = getTransform(src, "EPSG:3857");
    const distFunc = getTransform("EPSG:3857", dist);
    if (srcFunc == identityTransform && srcCode != "EPSG:3857")
      throw "Transform of Source projection is not defined.";
    if (distFunc == identityTransform && distCode != "EPSG:3857")
      throw "Transform of Distination projection is not defined.";
    func = function (xy: Coordinate): Coordinate {
      return transform(transform(xy, src, "EPSG:3857"), "EPSG:3857", dist);
    };
    const invFunc = function (xy: Coordinate): Coordinate {
      return transform(transform(xy, dist, "EPSG:3857"), "EPSG:3857", src);
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    addCoordinateTransforms(src, dist, func, invFunc);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  if (xy) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return func(xy);
  }
}
