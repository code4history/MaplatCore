import Feature from 'ol/Feature.js';
import LayerGroup from 'ol/layer/Group.js';
import monotoneChainConvexHull from 'monotone-chain-convex-hull';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style.js';
import { Cluster } from 'ol/source.js';
import { LineString, Point, Polygon } from 'ol/geom.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import { createEmpty, extend, getHeight, getWidth } from 'ol/extent.js';
class clusterRegister extends LayerGroup {
    removeMap() {
        this.map__.un('pointermove', this.pointermove__);
        this.map__.un('click', this.pointerclick__);
    }
    registerMap(source, map, callback) {
        const circleDistanceMultiplier = 1;
        const circleFootSeparation = 28;
        const circleStartAngle = Math.PI / 2;
        this.map__ = map;
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
        function clusterCircleStyle(cluster, resolution) {
            if (cluster !== clickFeature || resolution !== clickResolution) {
                return null;
            }
            const clusterMembers = cluster.get('features');
            return generatePointsCircle(clusterMembers.length, cluster.getGeometry().getCoordinates(), resolution).reduce((styles, coordinates, i) => {
                const footPoint = clusterMembers[i].getGeometry().getCoordinates();
                const point = new Point(coordinates);
                const line = new LineString([footPoint, coordinates]);
                styles.unshift(new Style({
                    geometry: line,
                    stroke: convexHullStroke,
                }));
                styles.push(callback(new Feature({
                    ...clusterMembers[i].getProperties(),
                    geometry: point,
                })));
                return styles;
            }, []);
        }
        function generatePointsCircle(count, clusterCenter, resolution) {
            const circumference = circleDistanceMultiplier * circleFootSeparation * (2 + count);
            let legLength = circumference / (Math.PI * 2);
            const angleStep = (Math.PI * 2) / count;
            const res = [];
            let angle;
            legLength = Math.max(legLength, 35) * resolution;
            for (let i = 0; i < count; ++i) {
                angle = circleStartAngle + i * angleStep;
                res.push([
                    clusterCenter[0] + legLength * Math.cos(angle),
                    clusterCenter[1] + legLength * Math.sin(angle),
                ]);
            }
            return res;
        }
        let hoverFeature;
        function clusterHullStyle(cluster) {
            if (cluster !== hoverFeature) {
                return null;
            }
            const originalFeatures = cluster.get('features');
            const points = originalFeatures.map((feature) => feature.getGeometry().getCoordinates());
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
            attributions: 'Data: <a href="https://www.data.gv.at/auftritte/?organisation=stadt-wien">Stadt Wien</a>',
            distance: 35,
            source,
        });
        const clusterHulls = new VectorLayer({
            source: clusterSource,
            style: clusterHullStyle,
        });
        const clusters = new VectorLayer({
            source: clusterSource,
            style: clusterStyle,
        });
        const clusterCircles = new VectorLayer({
            source: clusterSource,
            style: clusterCircleStyle,
        });
        this.getLayers().push(clusterHulls);
        this.getLayers().push(clusters);
        this.getLayers().push(clusterCircles);
        this.pointermove__ = (event) => {
            clusters.getFeatures(event.pixel).then(features => {
                if (features[0] !== hoverFeature) {
                    hoverFeature = features[0];
                    clusterHulls.setStyle(clusterHullStyle);
                    map.getTargetElement().style.cursor =
                        hoverFeature && hoverFeature.get('features').length > 1
                            ? 'pointer'
                            : '';
                }
            });
        };
        map.on('pointermove', this.pointermove__);
        this.pointerclick__ = async (event) => {
            let features = await clusterCircles.getFeatures(event.pixel);
            if (features.length > 0) {
                console.log(features[0].get('features')[0].getProperties());
            }
            else {
                features = await clusters.getFeatures(event.pixel);
                if (features.length > 0) {
                    const clusterMembers = features[0].get('features');
                    if (clusterMembers.length > 1) {
                        const extent = createEmpty();
                        clusterMembers.forEach((feature) => extend(extent, feature.getGeometry().getExtent()));
                        const view = map.getView();
                        const resolution = map.getView().getResolution();
                        if (view.getZoom() === view.getMaxZoom() ||
                            (getWidth(extent) < resolution && getHeight(extent) < resolution)) {
                            clickFeature = features[0];
                            clickResolution = resolution;
                            clusterCircles.setStyle(clusterCircleStyle);
                        }
                        else {
                            view.fit(extent, { duration: 500, padding: [50, 50, 50, 50] });
                        }
                    }
                    else {
                        console.log(clusterMembers[0].getProperties());
                    }
                }
            }
        };
        map.on('click', this.pointerclick__);
    }
}
export default clusterRegister;
//# sourceMappingURL=clusterRegister.js.map