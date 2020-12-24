import Layer from "ol/layer/Layer";
import { toLonLat } from "ol/proj";

export class MapboxLayer extends Layer {
  constructor(options: any) {
    const render = function (frameState: any) {
      // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
      const source = this.getSource();
      const mbMap = source.mapboxMap;
      mbMap.setStyle(source.style);
      const canvas = mbMap.getCanvas();
      const viewState = frameState.viewState;

      // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
      const visible = this.getVisible();
      canvas.style.display = visible ? "block" : "none";

      // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
      const opacity = this.getOpacity();
      canvas.style.opacity = opacity;

      // adjust view parameters in mapbox
      const newBearing = (viewState.rotation * -180) / Math.PI;
      const newLonLat = toLonLat(viewState.center);
      const newZoom = viewState.zoom - 1;

      const nowBearing = mbMap.getBearing();
      const nowLonLat = mbMap.getCenter().toArray();
      const nowZoom = mbMap.getZoom();

      if (
        newBearing == nowBearing &&
        newLonLat[0] == nowLonLat[0] &&
        newLonLat[1] == nowLonLat[1] &&
        newZoom == nowZoom
      ) {
        return canvas;
      }

      if (newBearing != nowBearing) {
        mbMap.rotateTo(newBearing, {
          animate: false
        });
      }
      if (
        newLonLat[0] != nowLonLat[0] ||
        newLonLat[1] != nowLonLat[1] ||
        newZoom != nowZoom
      ) {
        mbMap.jumpTo({
          center: newLonLat,
          zoom: newZoom,
          animate: false
        });
      }

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
