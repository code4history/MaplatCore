/**
 * @module ol/maplat/types/basics
 */

/**
 * @typedef {{[key: string]: string}} LocaleDictFragment
 */

export type LocaleDictFragment = {[key: string]: string};

/**
 * @typedef { LocaleDictFragment | string } LocaleFragment
 */

export type LocaleFragment = LocaleDictFragment | string;

/**
 * @typedef { [number, number] } Coordinate2D
 */

export type Coordinate2D = [number, number];

/**
 * @typedef { [number, number, number, number] } ValuesOfVertices
 */

export type ValuesOfVertices = [number, number, number, number];

/**
 * @typedef { "All right reserved" | "CC BY" | "CC BY-SA" | "CC BY-ND" | "CC BY-NC" | "CC BY-NC-SA" | "CC BY-NC-ND" | "CC0" } DataLicense
 */

export type DataLicense = "All right reserved" | "CC BY" | "CC BY-SA" | "CC BY-ND" | "CC BY-NC" | "CC BY-NC-SA" | "CC BY-NC-ND" | "CC0";

/**
 * @typedef { DataLicense | "PD" } MapLicense
 */

export type MapLicense = DataLicense | "PD";

/**
 * @typedef { "forw" | "bakw" } BiDirectionKey
 */

export type BiDirectionKey = "forw" | "bakw";

/**
 * @typedef { string | number } EdgeIndex
 */

export type EdgeIndex = string | number;

/**
 * @typedef { {[key: string]: number} } MaplatLegacyWeightBufferList
 */

export type MaplatLegacyWeightBufferList = {[key: string]: number};

/**
 * @typedef { "overlay" | "base" | "maplat" | "mapbox" } LegacyMapType
 */

export type LegacyMapType = "overlay" | "base" | "maplat" | "mapbox";