import { View } from "ol";

View.prototype.getDecimalZoom = function (this: View): number {
  const resolution = this.getResolution();
  const offset =
    // NOTE: `resolution` maybe `undefined`
    // NOTE: `offset` maybe `NaN`
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    Math.log(this.maxResolution_ / resolution!) / Math.log(2);
  return offset !== undefined ? this.minZoom_ + offset : offset;
};

export { View };
