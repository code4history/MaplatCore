import Layer from "ol/layer/Layer";
import { toLonLat } from "ol/proj";
export class MapboxLayer extends Layer {
    constructor(options) {
        const render = function (frameState) {
            const source = this.getSource();
            const mbMap = source.mapboxMap;
            mbMap.setStyle(source.style);
            const canvas = mbMap.getCanvas();
            const viewState = frameState.viewState;
            const visible = this.getVisible();
            canvas.style.display = visible ? "block" : "none";
            const opacity = this.getOpacity();
            canvas.style.opacity = opacity;
            const newBearing = (viewState.rotation * -180) / Math.PI;
            const newLonLat = toLonLat(viewState.center);
            const newZoom = viewState.zoom - 1;
            const nowBearing = mbMap.getBearing();
            const nowLonLat = mbMap.getCenter().toArray();
            const nowZoom = mbMap.getZoom();
            if (newBearing == nowBearing &&
                newLonLat[0] == nowLonLat[0] &&
                newLonLat[1] == nowLonLat[1] &&
                newZoom == nowZoom) {
                return canvas;
            }
            if (newBearing != nowBearing) {
                mbMap.rotateTo(newBearing, {
                    animate: false
                });
            }
            if (newLonLat[0] != nowLonLat[0] ||
                newLonLat[1] != nowLonLat[1] ||
                newZoom != nowZoom) {
                mbMap.jumpTo({
                    center: newLonLat,
                    zoom: newZoom,
                    animate: false
                });
            }
            if (mbMap._frame) {
                mbMap._frame.cancel();
                mbMap._frame = null;
            }
            mbMap._render();
            return canvas;
        };
        super({
            render,
            source: options.source
        });
    }
}
//# sourceMappingURL=layer_mapbox.js.map