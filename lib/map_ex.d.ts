import { Feature, Map } from "ol";
export declare class MaplatMap extends Map {
    _first_gps_request: any;
    _overlay_group: any;
    fakeGps: any;
    fakeRadius: any;
    geolocation: any;
    homePosition: any;
    __AvoidFirstMoveStart: boolean;
    constructor(optOptions: any);
    static spawnLayer(layer: any, source: any, container: any): any;
    getLayer(name?: string): any;
    getSource(name?: string): any;
    setFeature(data: any, style: any, layer: any): Feature<any>;
    removeFeature(feature: any, layer: any): void;
    resetFeature(layer: any): void;
    setGPSPosition(pos: any, type?: any): void;
    setMarker(xy: any, data: any, markerStyle: any, layer: any): Feature<any>;
    resetMarker(layer: any): void;
    setLine(xys: any, stroke: any, layer: any): Feature<any>;
    setVector(coords: any, type: string | undefined, style: any, layer: any): Feature<any>;
    resetLine(layer: any): void;
    resetVector(layer: any): void;
    setEnvelope(xys: any, stroke: any, layer: any): Feature<any>;
    removeEnvelope(feature: any, layer: any): void;
    resetEnvelope(layer: any): void;
    setFillEnvelope(xys: any, stroke: any, fill: any, layer: any): Feature<any>;
    exchangeSource(source?: any): void;
    setLayer(source?: any): void;
    setTransparency(percentage: any): void;
    setGPSMarker(position: any, ignoreMove: any): void;
    handleGPS(launch: any, avoidEventForOff: any): void;
}
