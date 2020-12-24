import { View } from "ol";
(View.prototype as any).getDecimalZoom = function () {
    const resolution = this.getResolution();
    const offset = Math.log(this.maxResolution_ / resolution) / Math.log(2);
    return offset !== undefined ? (this as any).minZoom_ + offset : offset;
};
export { View };
