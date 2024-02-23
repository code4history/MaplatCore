export declare type LocaleDictFragment = {
    [key: string]: string;
};
export declare type LocaleFragment = LocaleDictFragment | string;
export declare type Coordinate2D = [number, number];
export declare type ValuesOfVertices = [number, number, number, number];
export declare type DataLicense = "All right reserved" | "CC BY" | "CC BY-SA" | "CC BY-ND" | "CC BY-NC" | "CC BY-NC-SA" | "CC BY-NC-ND" | "CC0";
export declare type MapLicense = DataLicense | "PD";
export declare type BiDirectionKey = "forw" | "bakw";
export declare type EdgeIndex = string | number;
export declare type MaplatLegacyWeightBufferList = {
    [key: string]: number;
};
export declare type LegacyMapType = "overlay" | "base" | "maplat" | "mapbox";
