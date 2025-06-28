import BaseEvent from 'ol/events/Event';
import BaseObject from 'ol/Object';
import { randomFromCenter } from "./math_ex";
import {toRadians} from 'ol/math';

const Property = {
  ACCURACY: 'accuracy',
  ACCURACY_GEOMETRY: 'accuracyGeometry',
  ALTITUDE: 'altitude',
  ALTITUDE_ACCURACY: 'altitudeAccuracy',
  HEADING: 'heading',
  POSITION: 'position',
  PROJECTION: 'projection',
  SPEED: 'speed',
  TRACKING: 'tracking',
  TRACKING_OPTIONS: 'trackingOptions',
};

const GeolocationErrorType = {
  ERROR: 'error',
};

type GeolocationErrorOptions = {
  code: number;
  message: string;
};

type GeolocationOptions = {
  timerBase?: boolean;
  homePosition?: number[];
  trackingOptions?: {
    enableHighAccuracy: boolean;
    timeout: number;
    maximumAge: number;
  };
  tracking?: boolean;
};

type PositionObject = {
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

export class GeolocationError extends BaseEvent {
  code: number;
  message: string;
  constructor(error: GeolocationErrorOptions) {
    super(GeolocationErrorType.ERROR);
    this.code = error.code;
    this.message = error.message;
  }
}

export class Geolocation extends BaseObject {
  task_id_?: NodeJS.Timer | number;
  timer_base_ = false;
  home_position_: number[] | boolean = false;

  constructor(options?: GeolocationOptions) {
    super();

    // Methods are inherited from BaseObject
    // this.on, this.once, this.un are available

    options = options || {} as GeolocationOptions;

    this.timer_base_ = options.timerBase !== undefined ? options.timerBase : false;

    this.task_id_ = undefined;

    this.home_position_ = options.homePosition !== undefined ? options.homePosition : false;

    this.addChangeListener(Property.TRACKING, this.handleTrackingChanged_);

    if (options.trackingOptions !== undefined) {
      this.setTrackingOptions(options.trackingOptions);
    } else {
      this.setTrackingOptions({
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 1000
      });
    }

    this.setTracking(options.tracking !== undefined ? options.tracking : false);
  }

  disposeInternal() {
    this.setTracking(false);
    super.disposeInternal();
  }

  handleTrackingChanged_() {
    if (this.timer_base_) {
      const tracking = this.getTracking();
      const trackingOptions = this.getTrackingOptions();
      if (tracking && this.task_id_ === undefined) {
        const allowGps = window.confirm("Allow GPS?");
        if (allowGps) {
          this.task_id_ = setInterval(this.timerPositionChange_.bind(this), trackingOptions.maximumAge);
        } else {
          setTimeout(this.timerPositionError_.bind(this), trackingOptions.maximumAge * 10);
        }
      } else if (!tracking && this.task_id_ !== undefined) {
        clearInterval(this.task_id_ as number);
        this.task_id_ = undefined;
      }
    } else {
      if ('geolocation' in navigator) {
        const tracking = this.getTracking();
        if (tracking && this.task_id_ === undefined) {
          this.task_id_ = navigator.geolocation.watchPosition(
            this.positionChange_.bind(this) as PositionCallback,
            this.positionError_.bind(this),
            this.getTrackingOptions(),
          );
        } else if (!tracking && this.task_id_ !== undefined) {
          navigator.geolocation.clearWatch(this.task_id_ as number);
          this.task_id_ = undefined;
        }
      }
    }

  }

  timerPositionChange_() {
    const coords = {
      longitude: randomFromCenter((this.home_position_ as number[])[0], 0.05),
      latitude: randomFromCenter((this.home_position_ as number[])[1], 0.05),
      accuracy: randomFromCenter(15.0, 10)
    };
    this.positionChange_({coords});
  }

  positionChange_(position: PositionObject) {
    const coords = position.coords;
    this.set(Property.ACCURACY, coords.accuracy);
    this.set(
      Property.ALTITUDE,
      coords.altitude === null ? undefined : coords.altitude,
    );
    this.set(
      Property.ALTITUDE_ACCURACY,
      coords.altitudeAccuracy === null ? undefined : coords.altitudeAccuracy,
    );
    this.set(
      Property.HEADING,
      coords.heading === null ? undefined : toRadians(coords.heading!),
    );
    this.set(Property.POSITION, [coords.longitude, coords.latitude]);
    this.set(Property.SPEED, coords.speed === null ? undefined : coords.speed);
    this.changed();
  }

  timerPositionError_() {
    const code = Math.floor(Math.random() * 3) + 1;
    const error = {
      code,
      message: code === 1 ? "User denied Geolocation" : code === 2 ? "Position unavailable" : "Timeout expired"
    }
    this.positionError_(error);
  }

  positionError_(error: GeolocationErrorOptions) {
    const desc = new GeolocationError(error);
    this.dispatchEvent(desc);
  }

  getAccuracy() {
    return (this.get(Property.ACCURACY));
  }

  getAltitude() {
    return (this.get(Property.ALTITUDE));
  }

  getAltitudeAccuracy() {
    return (this.get(Property.ALTITUDE_ACCURACY));
  }

  getHeading() {
    return (this.get(Property.HEADING));
  }

  getPosition() {
    return (this.get(Property.POSITION));
  }

  getSpeed() {
    return (this.get(Property.SPEED));
  }

  getTracking() {
    return (this.get(Property.TRACKING));
  }

  getTrackingOptions() {
    return (this.get(Property.TRACKING_OPTIONS));
  }

  setTracking(tracking: boolean) {
    this.set(Property.TRACKING, tracking);
  }

  setTrackingOptions(options: any) {
    this.set(Property.TRACKING_OPTIONS, options);
  }
};