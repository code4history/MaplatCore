import { Types as OLMapBrowserEventTypes } from 'ol/MapBrowserEventType';
import Map from 'ol/Map';
import MapBrowserEvent from 'ol/MapBrowserEvent';

// 新しい型を作成
type ExtendedMapBrowserEventTypes = OLMapBrowserEventTypes | 'pointerdown' | 'pointerup';

// Map型を拡張したカスタム型を作成
type ExtendedMap = Omit<Map, 'on'> & {
    on(type: ExtendedMapBrowserEventTypes, listener: (evt: MapBrowserEvent<PointerEvent>) => void): void;
};

// 既存のMap型を拡張された型として扱うための型アサーション関数
export function asExtendedMap(map: Map): ExtendedMap {
    return map as ExtendedMap;
}

declare module "ol" {
  interface View {
    getDecimalZoom(): number;
    getResolution(): number;
    //minZoom_: number;
    //maxResolution_: number;
  }
}