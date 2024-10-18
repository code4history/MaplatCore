var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "ol/events/Event", "ol/Object", "./math_ex", "ol/math"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Geolocation = exports.GeolocationError = void 0;
    var Event_1 = __importDefault(require("ol/events/Event"));
    var Object_1 = __importDefault(require("ol/Object"));
    var math_ex_1 = require("./math_ex");
    var math_1 = require("ol/math");
    var Property = {
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
    var GeolocationErrorType = {
        ERROR: 'error',
    };
    var GeolocationError = (function (_super) {
        __extends(GeolocationError, _super);
        function GeolocationError(error) {
            var _this = _super.call(this, GeolocationErrorType.ERROR) || this;
            _this.code = error.code;
            _this.message = error.message;
            return _this;
        }
        return GeolocationError;
    }(Event_1.default));
    exports.GeolocationError = GeolocationError;
    var Geolocation = (function (_super) {
        __extends(Geolocation, _super);
        function Geolocation(options) {
            var _this = _super.call(this) || this;
            _this.timer_base_ = false;
            _this.home_position_ = false;
            _this.on;
            _this.once;
            _this.un;
            options = options || {};
            _this.timer_base_ = options.timerBase !== undefined ? options.timerBase : false;
            _this.task_id_ = undefined;
            _this.home_position_ = options.homePosition !== undefined ? options.homePosition : false;
            _this.addChangeListener(Property.TRACKING, _this.handleTrackingChanged_);
            if (options.trackingOptions !== undefined) {
                _this.setTrackingOptions(options.trackingOptions);
            }
            else {
                _this.setTrackingOptions({
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 1000
                });
            }
            _this.setTracking(options.tracking !== undefined ? options.tracking : false);
            return _this;
        }
        Geolocation.prototype.disposeInternal = function () {
            this.setTracking(false);
            _super.prototype.disposeInternal.call(this);
        };
        Geolocation.prototype.handleTrackingChanged_ = function () {
            if (this.timer_base_) {
                var tracking = this.getTracking();
                var trackingOptions = this.getTrackingOptions();
                if (tracking && this.task_id_ === undefined) {
                    var allowGps = window.confirm("Allow GPS?");
                    if (allowGps) {
                        this.task_id_ = setInterval(this.timerPositionChange_.bind(this), trackingOptions.maximumAge);
                    }
                    else {
                        setTimeout(this.timerPositionError_.bind(this), trackingOptions.maximumAge * 10);
                    }
                }
                else if (!tracking && this.task_id_ !== undefined) {
                    clearInterval(this.task_id_);
                    this.task_id_ = undefined;
                }
            }
            else {
                if ('geolocation' in navigator) {
                    var tracking = this.getTracking();
                    if (tracking && this.task_id_ === undefined) {
                        this.task_id_ = navigator.geolocation.watchPosition(this.positionChange_.bind(this), this.positionError_.bind(this), this.getTrackingOptions());
                    }
                    else if (!tracking && this.task_id_ !== undefined) {
                        navigator.geolocation.clearWatch(this.task_id_);
                        this.task_id_ = undefined;
                    }
                }
            }
        };
        Geolocation.prototype.timerPositionChange_ = function () {
            var coords = {
                longitude: (0, math_ex_1.randomFromCenter)(this.home_position_[0], 0.05),
                latitude: (0, math_ex_1.randomFromCenter)(this.home_position_[1], 0.05),
                accuracy: (0, math_ex_1.randomFromCenter)(15.0, 10)
            };
            this.positionChange_({ coords: coords });
        };
        Geolocation.prototype.positionChange_ = function (position) {
            var coords = position.coords;
            this.set(Property.ACCURACY, coords.accuracy);
            this.set(Property.ALTITUDE, coords.altitude === null ? undefined : coords.altitude);
            this.set(Property.ALTITUDE_ACCURACY, coords.altitudeAccuracy === null ? undefined : coords.altitudeAccuracy);
            this.set(Property.HEADING, coords.heading === null ? undefined : (0, math_1.toRadians)(coords.heading));
            this.set(Property.POSITION, [coords.longitude, coords.latitude]);
            this.set(Property.SPEED, coords.speed === null ? undefined : coords.speed);
            this.changed();
        };
        Geolocation.prototype.timerPositionError_ = function () {
            var code = Math.floor(Math.random() * 3) + 1;
            var error = {
                code: code,
                message: code === 1 ? "User denied Geolocation" : code === 2 ? "Position unavailable" : "Timeout expired"
            };
            this.positionError_(error);
        };
        Geolocation.prototype.positionError_ = function (error) {
            var desc = new GeolocationError(error);
            this.dispatchEvent(desc);
        };
        Geolocation.prototype.getAccuracy = function () {
            return (this.get(Property.ACCURACY));
        };
        Geolocation.prototype.getAltitude = function () {
            return (this.get(Property.ALTITUDE));
        };
        Geolocation.prototype.getAltitudeAccuracy = function () {
            return (this.get(Property.ALTITUDE_ACCURACY));
        };
        Geolocation.prototype.getHeading = function () {
            return (this.get(Property.HEADING));
        };
        Geolocation.prototype.getPosition = function () {
            return (this.get(Property.POSITION));
        };
        Geolocation.prototype.getSpeed = function () {
            return (this.get(Property.SPEED));
        };
        Geolocation.prototype.getTracking = function () {
            return (this.get(Property.TRACKING));
        };
        Geolocation.prototype.getTrackingOptions = function () {
            return (this.get(Property.TRACKING_OPTIONS));
        };
        Geolocation.prototype.setTracking = function (tracking) {
            this.set(Property.TRACKING, tracking);
        };
        Geolocation.prototype.setTrackingOptions = function (options) {
            this.set(Property.TRACKING_OPTIONS, options);
        };
        return Geolocation;
    }(Object_1.default));
    exports.Geolocation = Geolocation;
    ;
});
//# sourceMappingURL=geolocation.js.map