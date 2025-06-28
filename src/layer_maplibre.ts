import Layer from "ol/layer/Layer";
import { toLonLat } from "ol/proj";

export class MapLibreLayer extends Layer {
  constructor(options: any) {
    const render = function (frameState: any) {
      // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
      const source = this.getSource();
      const mlMap = source.maplibreMap;
      if (!mlMap) {
        console.error('MapLibreLayer: maplibreMap is undefined!');
        return null;
      }
      mlMap.setStyle(source.style);
      const canvas = mlMap.getCanvas();
      const viewState = frameState.viewState;
      
      // Debug frameState and canvas position
      // const container = mlMap.getContainer();
      // console.log('MapLibre render state:', {
      //   frameState: {
      //     pixelRatio: frameState.pixelRatio,
      //     size: frameState.size,
      //     viewHints: frameState.viewHints,
      //     animate: frameState.animate
      //   },
      //   canvas: {
      //     width: canvas.width,
      //     height: canvas.height,
      //     offsetLeft: canvas.offsetLeft,
      //     offsetTop: canvas.offsetTop,
      //     style: {
      //       top: canvas.style.top,
      //       left: canvas.style.left,
      //       position: canvas.style.position,
      //       transform: canvas.style.transform
      //     }
      //   },
      //   container: {
      //     offsetTop: container.offsetTop,
      //     offsetLeft: container.offsetLeft,
      //     clientHeight: container.clientHeight,
      //     clientWidth: container.clientWidth
      //   }
      // });

      // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
      const visible = this.getVisible();
      canvas.style.display = visible ? "block" : "none";

      // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
      const opacity = this.getOpacity();
      canvas.style.opacity = opacity;

      // adjust view parameters in maplibre
      const rotation = viewState.rotation;
      const newBearing = (-rotation * 180) / Math.PI;
      const currentBearing = mlMap.getBearing();
      
      if (Math.abs(newBearing - currentBearing) > 0.01) {
        // mlMap.setBearing은 easing과 함께 천천히 회전하는 효과를 내지만 그렇게 하면 안되기 때문에...
        // stop을 호출한 상태에서 setBearing을 실행합니다.
        mlMap.stop();
        mlMap.setBearing(newBearing);
      }

      const center = toLonLat(viewState.center);
      const zoom = viewState.zoom - 1;
      
      // Debug: Check zoom levels and resolution
      const currentMLZoom = mlMap.getZoom();
      const olResolution = frameState.viewState.resolution;
      const expectedZoom = Math.log2(156543.03392804097 / olResolution) - 1; // OL to ML zoom conversion
      
      // console.log('MapLibre render:', {
      //   viewStateZoom: viewState.zoom,
      //   targetZoom: zoom,
      //   currentMLZoom: currentMLZoom,
      //   expectedZoom: expectedZoom,
      //   olResolution: olResolution,
      //   frameStateSize: frameState.size
      // });
      
      if (
        // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        mlMap.getCenter().toArray().toString() !== center.toString() ||
        mlMap.getZoom() !== zoom
      ) {
        mlMap.jumpTo({
          center,
          zoom,
          animate: false
        });
      }

      // cancel the scheduled update & trigger synchronous redraw
      // see https://github.com/mapbox/mapbox-gl-js/issues/7893#issue-408992184
      // NOTE: THIS MIGHT BREAK WHEN UPDATING MAPLIBRE
      if (mlMap._frame) {
        mlMap._frame.cancel();
        mlMap._frame = null;
      }

      // Ensure map size is correct
      if (frameState.size) {
        const [width, height] = frameState.size;
        if (canvas.width !== width || canvas.height !== height) {
          // console.log('MapLibre size mismatch, resizing:', {
          //   current: { width: canvas.width, height: canvas.height },
          //   expected: { width, height }
          // });
          mlMap.resize();
        }
      }
      
      // Force immediate render
      mlMap._render();
      
      // Additional sync to ensure MapLibre zoom is properly set
      // This might be needed because MapLibre handles zoom differently than Mapbox
      if (Math.abs(mlMap.getZoom() - zoom) > 0.01) {
        // console.log('MapLibre zoom mismatch after render, forcing sync');
        mlMap.setZoom(zoom);
      }

      // Ensure canvas is properly positioned
      canvas.style.position = 'absolute';
      canvas.style.left = '0';
      canvas.style.top = '0';
      
      return canvas;
    };
    super({
      render,
      source: options.source
    });
  }
}