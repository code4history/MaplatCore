import { MapBrowserEvent } from 'ol';
import { EventsKey } from 'ol/events';
export * as ol from "ol";

declare module "ol/View" {
  export interface View {
    getDecimalZoom(): number;
    getResolution(): number;
    //minZoom_: number;
    //maxResolution_: number;
  }
}

declare module 'ol/Map' {
  interface MapEvents {
    'pointerdown': (evt: MapBrowserEvent<UIEvent>) => void;
    'pointerup': (evt: MapBrowserEvent<UIEvent>) => void;
  }

  interface Map {
    on(type: 'pointerdown', listener: (evt: MapBrowserEvent<UIEvent>) => void): EventsKey | EventsKey[];
    on(type: 'pointerup', listener: (evt: MapBrowserEvent<UIEvent>) => void): EventsKey | EventsKey[];
    once(type: 'pointerdown', listener: (evt: MapBrowserEvent<UIEvent>) => void): EventsKey | EventsKey[];
    once(type: 'pointerup', listener: (evt: MapBrowserEvent<UIEvent>) => void): EventsKey | EventsKey[];
    un(type: 'pointerdown', listener: (evt: MapBrowserEvent<UIEvent>) => void): void;
    un(type: 'pointerup', listener: (evt: MapBrowserEvent<UIEvent>) => void): void;
  }
}