/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * @module ol/maplat/clusterRegister
 */
import Feature from 'ol/Feature.js';
import LayerGroup from 'ol/layer/Group.js';
// @ts-ignore
import monotoneChainConvexHull from 'monotone-chain-convex-hull';
import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style.js';
import {Cluster} from 'ol/source.js';
import {LineString, Point, Polygon} from 'ol/geom.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import {createEmpty, extend, getHeight, getWidth} from 'ol/extent.js';
import { StyleLike } from 'ol/style/Style';

class clusterRegister extends LayerGroup {
  pointermove__;
  pointerclick__;
  removeMap: () => void;

  registerMap(source, map, callback) {
    const circleDistanceMultiplier = 1;
    const circleFootSeparation = 28;
    const circleStartAngle = Math.PI / 2;

    const convexHullFill = new Fill({
      color: 'rgba(255, 153, 0, 0.4)',
    });
    const convexHullStroke = new Stroke({
      color: 'rgba(204, 85, 0, 1)',
      width: 1.5,
    });
    const outerCircleFill = new Fill({
      color: 'rgba(255, 153, 102, 0.3)',
    });
    const innerCircleFill = new Fill({
      color: 'rgba(255, 165, 0, 0.7)',
    });
    const textFill = new Fill({
      color: '#fff',
    });
    const textStroke = new Stroke({
      color: 'rgba(0, 0, 0, 0.6)',
      width: 3,
    });
    const innerCircle = new CircleStyle({
      radius: 14,
      fill: innerCircleFill,
    });
    const outerCircle = new CircleStyle({
      radius: 20,
      fill: outerCircleFill,
    });

    let clickFeature, clickResolution;
    /**
     * Style for clusters with features that are too close to each other, activated on click.
     * @param {Feature} cluster A cluster with overlapping members.
     * @param {number} resolution The current view resolution.
     * @return {Array<Style>|null} A style to render an expanded view of the cluster members.
     */
    function clusterCircleStyle(cluster, resolution) {
      if (cluster !== clickFeature || resolution !== clickResolution) {
        return null;
      }
      const clusterMembers = cluster.get('features');
      // @ts-ignore
      return generatePointsCircle(
        clusterMembers.length,
        // @ts-ignore
        cluster.getGeometry().getCoordinates(),
        resolution
      ).reduce((styles, coordinates, i) => {
        const footPoint = clusterMembers[i].getGeometry().getCoordinates();
        const point = new Point(coordinates);
        const line = new LineString([footPoint, coordinates]);
        styles.unshift(
          // @ts-ignore
          new Style({
            geometry: line,
            stroke: convexHullStroke,
          })
        );
        styles.push(
          callback(
            new Feature({
              ...clusterMembers[i].getProperties(),
              geometry: point,
            }) as any
          )
        );
        return styles;
      }, [] as any[]);
    }

    /**
     * From
     * https://github.com/Leaflet/Leaflet.markercluster/blob/31360f2/src/MarkerCluster.Spiderfier.js#L55-L72
     * Arranges points in a circle around the cluster center, with a line pointing from the center to
     * each point.
     * @param {number} count Number of cluster members.
     * @param {Array<number>} clusterCenter Center coordinate of the cluster.
     * @param {number} resolution Current view resolution.
     * @return {Array<Array<number>>} An array of coordinates representing the cluster members.
     */
    function generatePointsCircle(count, clusterCenter, resolution) {
      const circumference =
        circleDistanceMultiplier * circleFootSeparation * (2 + count);
      let legLength = circumference / (Math.PI * 2); //radius from circumference
      const angleStep = (Math.PI * 2) / count;
      const res = [] as number[][];
      let angle;

      legLength = Math.max(legLength, 35) * resolution; // Minimum distance to get outside the cluster icon.

      for (let i = 0; i < count; ++i) {
        // Clockwise, like spiral.
        angle = circleStartAngle + i * angleStep;
        res.push([
          clusterCenter[0] + legLength * Math.cos(angle),
          clusterCenter[1] + legLength * Math.sin(angle),
        ]);
      }

      return res;
    }

    let hoverFeature;
    /**
     * Style for convex hulls of clusters, activated on hover.
     * @param {Feature} cluster The cluster feature.
     * @return {Style|null} Polygon style for the convex hull of the cluster.
     */
    function clusterHullStyle(cluster) {
      if (cluster !== hoverFeature) {
        return null;
      }
      const originalFeatures = cluster.get('features');
      const points = originalFeatures.map(feature => feature.getGeometry().getCoordinates());
      return new Style({
        geometry: new Polygon([monotoneChainConvexHull(points)]),
        fill: convexHullFill,
        stroke: convexHullStroke,
      });
    }

    function clusterStyle(feature) {
      const size = feature.get('features').length;
      if (size > 1) {
        return [
          new Style({
            image: outerCircle,
          }),
          new Style({
            image: innerCircle,
            text: new Text({
              text: size.toString(),
              fill: textFill,
              stroke: textStroke,
            }),
          }),
        ];
      }
      const originalFeature = feature.get('features')[0];
      return callback(originalFeature);
    }

    const clusterSource = new Cluster({
      attributions:
        'Data: <a href="https://www.data.gv.at/auftritte/?organisation=stadt-wien">Stadt Wien</a>',
      distance: 35,
      source,
    });

    // Layer displaying the convex hull of the hovered cluster.
    const clusterHulls = new VectorLayer({
      source: clusterSource,
      style: clusterHullStyle as StyleLike,
    });

    // Layer displaying the clusters and individual features.
    const clusters = new VectorLayer({
      source: clusterSource,
      style: clusterStyle,
    });

    // Layer displaying the expanded view of overlapping cluster members.
    const clusterCircles = new VectorLayer({
      source: clusterSource,
      style: clusterCircleStyle as StyleLike,
    });

    this.getLayers().push(clusterHulls);
    this.getLayers().push(clusters);
    this.getLayers().push(clusterCircles);

    this.pointermove__ = event => {
      clusters.getFeatures(event.pixel).then(features => {
        if (features[0] !== hoverFeature) {
          // Display the convex hull on hover.
          hoverFeature = features[0];
          clusterHulls.setStyle(clusterHullStyle as StyleLike);
          // Change the cursor style to indicate that the cluster is clickable.
          map.getTargetElement().style.cursor =
            hoverFeature && hoverFeature.get('features').length > 1
              ? 'pointer'
              : '';
        }
      });
    };
    map.on('pointermove', this.pointermove__);

    this.pointerclick__ = async event => {
      let features = await clusterCircles.getFeatures(event.pixel);
      if (features.length > 0) {
        // eslint-disable-next-line no-console
        console.log(features[0].get('features')[0].getProperties());
      } else {
        features = await clusters.getFeatures(event.pixel);
        if (features.length > 0) {
          const clusterMembers = features[0].get('features');
          if (clusterMembers.length > 1) {
            // Calculate the extent of the cluster members.
            const extent = createEmpty();
            clusterMembers.forEach(feature =>
              extend(extent, feature.getGeometry().getExtent())
            );
            const view = map.getView();
            const resolution = map.getView().getResolution();
            if (
              view.getZoom() === view.getMaxZoom() ||
              (getWidth(extent) < resolution && getHeight(extent) < resolution)
            ) {
              // Show an expanded view of the cluster members.
              clickFeature = features[0];
              clickResolution = resolution;
              clusterCircles.setStyle(clusterCircleStyle as StyleLike);
            } else {
              // Zoom to the extent of the cluster members.
              view.fit(extent, {duration: 500, padding: [50, 50, 50, 50]});
            }
          } else {
            // eslint-disable-next-line no-console
            console.log(clusterMembers[0].getProperties());
          }
        }
      }
    };
    map.on('click', this.pointerclick__);

    this.removeMap = () => {
      map.un('pointermove', this.pointermove__);
      map.un('click', this.pointerclick__);
    };
  }
}

export default clusterRegister;
