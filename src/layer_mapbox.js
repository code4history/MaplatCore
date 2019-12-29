import Layer from "ol/layer/Layer";
import { toLonLat } from "ol/proj";

export class MapboxLayer extends Layer {
    constructor(options) {
        const render = function(frameState) {
            const source = this.getSource();
            const mbMap = source.mapboxMap;
            mbMap.setStyle(source.style);
            const canvas = mbMap.getCanvas();
            const viewState = frameState.viewState;

            const visible = this.getVisible();
            canvas.style.display = visible ? "block" : "none";

            const opacity = this.getOpacity();
            canvas.style.opacity = opacity;

            // adjust view parameters in mapbox
            const rotation = (viewState.rotation * -180) / Math.PI;
            console.log(rotation); // eslint-disable-line no-undef
            console.log(mbMap.getBearing()); // eslint-disable-line no-undef
            console.log('==='); // eslint-disable-line no-undef
            if (mbMap.getBearing() != rotation) {
                mbMap.rotateTo(rotation, {
                    animate: false
                });
            }
            mbMap.jumpTo({
                center: toLonLat(viewState.center),
                zoom: viewState.zoom - 1,
                animate: false
            });

            // cancel the scheduled update & trigger synchronous redraw
            // see https://github.com/mapbox/mapbox-gl-js/issues/7893#issue-408992184
            // NOTE: THIS MIGHT BREAK WHEN UPDATING MAPBOX
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