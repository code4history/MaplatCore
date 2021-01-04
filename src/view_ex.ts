import { View } from "ol";

declare module "ol" {
  interface View {
    getDecimalZoom(): number;
  }
}

View.prototype.getDecimalZoom = function (): number {
  const resolution = (this as View).getResolution();
  const offset =
    // NOTE: `resolution` maybe `undefined`
    // NOTE: `offset` maybe `NaN`
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    Math.log((this as any).maxResolution_ / resolution!) / Math.log(2);
  return offset !== undefined
    ? ((this as View) as any).minZoom_ + offset
    : offset;
};

export { View };
