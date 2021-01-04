import { View } from "ol";
View.prototype.getDecimalZoom = function () {
    const resolution = this.getResolution();
    const offset = Math.log(this.maxResolution_ / resolution) / Math.log(2);
    return offset !== undefined ? this.minZoom_ + offset : offset;
};
export { View };
//# sourceMappingURL=view_ex.js.map