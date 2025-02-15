import {Tile as TileLayer, Vector as VectorLayer} from "ol/layer.js";
import { XYZ, OSM, Vector as VectorSource } from "ol/source.js";
import { Style, Icon } from "ol/style.js";
import Map from "ol/Map.js";
import View from "ol/View.js";
import Feature from "ol/Feature.js";
import { transform, fromLonLat, getTransform } from "ol/proj.js";
import { Point } from "ol/geom.js";
import { toRadians } from "ol/math.js";

(async () => {
    // カスタムレイヤークラス（OpenStreetMap用）
    class CustomRotatedLayer extends TileLayer {
        constructor(options) {
            super(options);
        }

        render(frameState) {
            if (!frameState) return;
            
            // フレームステート全体のクローンを作成
            const originalState = {
                viewState: { ...frameState.viewState },
                extent: [...frameState.extent],
                focus: frameState.focus ? [...frameState.focus] : null,
                size: frameState.size ? [...frameState.size] : null,
                pixelRatio: frameState.pixelRatio,
                time: frameState.time,
                animate: frameState.animate
            };

            try {
                const viewState = frameState.viewState;
                const extentRadius = Math.round(Math.sqrt(
                    Math.pow(frameState.extent[0] - viewState.center[0], 2) + 
                    Math.pow(frameState.extent[1] - viewState.center[1], 2)
                ));
                
                const newExtent = [
                    viewState.center[0] - extentRadius,
                    viewState.center[1] - extentRadius,
                    viewState.center[0] + extentRadius,
                    viewState.center[1] + extentRadius
                ];

                const rotationOffset = toRadians(45);
                viewState.rotation += rotationOffset;
                frameState.extent = newExtent;
                viewState.zoom += 1;
                viewState.resolution /= 2;

                const transform = getTransform('EPSG:3857', 'EPSG:3857');
                viewState.center = transform(viewState.center);

                return super.render(frameState);
            } finally {
                // フレームステートを確実に元に戻す
                Object.assign(frameState.viewState, originalState.viewState);
                frameState.extent = originalState.extent;
                if (originalState.focus) frameState.focus = originalState.focus;
                if (originalState.size) frameState.size = originalState.size;
                frameState.pixelRatio = originalState.pixelRatio;
                frameState.time = originalState.time;
                frameState.animate = originalState.animate;
            }
        }
    }

    class CustomRotatedVectorLayer extends VectorLayer {
        constructor(options) {
            super(options);
            this.originalPositions = new Map();  // 元の位置を保存
            
            // ソースの各フィーチャーの元の位置を保存
            const source = this.getSource();
            source.getFeatures().forEach(feature => {
                this.originalPositions.set(feature, feature.getGeometry().getCoordinates().slice());
            });

            // 新しいフィーチャーが追加されたときのハンドラー
            source.on('addfeature', (event) => {
                this.originalPositions.set(event.feature, event.feature.getGeometry().getCoordinates().slice());
            });
        }

        updateFeaturePositions(viewState) {
            const rotationOffset = toRadians(45);
            const zoomFactor = 2;  // zoom + 1 の効果

            const source = this.getSource();
            source.getFeatures().forEach(feature => {
                const originalPos = this.originalPositions.get(feature);
                if (!originalPos) return;

                // 中心からの相対位置を計算
                const dx = originalPos[0] - viewState.center[0];
                const dy = originalPos[1] - viewState.center[1];

                // 回転を適用
                const cos = Math.cos(rotationOffset);
                const sin = Math.sin(rotationOffset);
                const rotatedX = dx * cos - dy * sin;
                const rotatedY = dx * sin + dy * cos;

                // 新しい位置を設定
                const newPos = [
                    viewState.center[0] + rotatedX,
                    viewState.center[1] + rotatedY
                ];
                feature.getGeometry().setCoordinates(newPos);
            });
        }

        render(frameState) {
            if (!frameState) return;
            
            const originalState = {
                viewState: { ...frameState.viewState }
            };

            try {
                this.updateFeaturePositions(frameState.viewState);
                return super.render(frameState);
            } finally {
                Object.assign(frameState.viewState, originalState.viewState);
            }
        }
    }

    // 地理院地図pale（レイヤーA）
    const gsiPale = new TileLayer({
        source: new XYZ({
            url: 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
            attributions: '<a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>'
        }),
        opacity: 0.5
    });

    // OpenStreetMap（レイヤーB）
    const osm = new CustomRotatedLayer({
        source: new OSM()
    });

    // マーカーの作成
    function createMarker(coords, color) {
        return new Feature({
            geometry: new Point(fromLonLat(coords))
        });
    }

    // レイヤーA用のマーカー
    const markersA = new VectorLayer({
        source: new VectorSource({
            features: [
                createMarker([139.7671, 35.6812], 'red'),    // 東京駅
                createMarker([139.7500, 35.6800], 'blue')    // 別の地点
            ]
        }),
        style: new Style({
            image: new Icon({
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
                    <svg width="32" height="48" viewBox="0 0 32 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 32 16 32s16-20 16-32c0-8.84-7.16-16-16-16z" fill="red"/>
                        <circle cx="16" cy="16" r="8" fill="white"/>
                    </svg>
                `),
                scale: 0.75,
                rotateWithView: true
            })
        })
    });

    // レイヤーB用のマーカー
    const markersB = new CustomRotatedVectorLayer({
        source: new VectorSource({
            features: [
                createMarker([139.7530, 35.6855], 'green'),  // 皇居
                createMarker([139.7600, 35.6700], 'yellow')  // 別の地点
            ]
        }),
        style: new Style({
            image: new Icon({
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
                    <svg width="32" height="48" viewBox="0 0 32 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 32 16 32s16-20 16-32c0-8.84-7.16-16-16-16z" fill="green"/>
                        <circle cx="16" cy="16" r="8" fill="white"/>
                    </svg>
                `),
                scale: 0.75,
                rotateWithView: true
            })
        })
    });

    // 初期表示位置（東京）
    const tokyo = fromLonLat([139.7671, 35.6812]);

    // メインビュー
    const view = new View({
        center: tokyo,
        zoom: 13,
        rotation: 0
    });

    // メインマップ
    const map = new Map({
        target: 'map',
        layers: [osm, gsiPale, markersA, markersB],
        view: view
    });

    // クリックイベントの処理
    map.on('click', function(event) {
        const pixel = event.pixel;
        map.forEachFeatureAtPixel(pixel, function(feature, layer) {
            const coords = transform(
                feature.getGeometry().getCoordinates(),
                'EPSG:3857',
                'EPSG:4326'
            );
            alert((layer === markersB ? 'レイヤーB' : 'レイヤーA') + 
                  'のマーカー: ' + coords.map(c => c.toFixed(4)).join(', '));
            return true;
        }, {
            hitTolerance: 5,
            layerFilter: layer => layer === markersA || layer === markersB
        });
    });

    // 情報表示の更新
    /*view.on('change', function() {
        const center = transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
        document.getElementById('center').textContent = 
            `${center[0].toFixed(4)}, ${center[1].toFixed(4)}`;
        document.getElementById('zoom').textContent = view.getZoom().toFixed(2);
        document.getElementById('rotation').textContent = 
            ((view.getRotation() * 180 / Math.PI) % 360).toFixed(1);
    });*/
})();