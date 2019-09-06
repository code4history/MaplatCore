import { View } from 'ol';

View.prototype.getDecimalZoom = function() {
    let offset;
    const resolution = this.getResolution();

    offset = Math.log(this.maxResolution_ / resolution) / Math.log(2);
    return offset !== undefined ? this.minZoom_ + offset : offset;
};

export { View }
