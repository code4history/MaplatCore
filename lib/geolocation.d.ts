/// <reference types="node" />
import BaseEvent from 'ol/events/Event';
import BaseObject from 'ol/Object';
declare type GeolocationErrorOptions = {
    code: number;
    message: string;
};
declare type GeolocationOptions = {
    timerBase: boolean;
    homePosition: number[];
    trackingOptions?: {
        enableHighAccuracy: boolean;
        timeout: number;
        maximumAge: number;
    };
    tracking?: boolean;
};
declare type PositionObject = {
    coords: {
        longitude: number;
        latitude: number;
        accuracy: number;
        altitude?: number;
        altitudeAccuracy?: number;
        heading?: number;
        speed?: number;
    };
};
export declare class GeolocationError extends BaseEvent {
    code: number;
    message: string;
    constructor(error: GeolocationErrorOptions);
}
export declare class Geolocation extends BaseObject {
    task_id_?: NodeJS.Timer | number;
    timer_base_: boolean;
    home_position_: number[] | boolean;
    constructor(options: GeolocationOptions);
    disposeInternal(): void;
    handleTrackingChanged_(): void;
    timerPositionChange_(): void;
    positionChange_(position: PositionObject): void;
    timerPositionError_(): void;
    positionError_(error: GeolocationErrorOptions): void;
    getAccuracy(): any;
    getAltitude(): any;
    getAltitudeAccuracy(): any;
    getHeading(): any;
    getPosition(): any;
    getSpeed(): any;
    getTracking(): any;
    getTrackingOptions(): any;
    setTracking(tracking: boolean): void;
    setTrackingOptions(options: any): void;
}
export {};
