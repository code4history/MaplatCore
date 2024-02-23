import { Coordinate2D, DataLicense, LocaleFragment, MapLicense } from "./basics";
export interface MaplatMetaData extends Object {
    lang: string;
    mapID?: string;
    title: LocaleFragment;
    officialTitle?: LocaleFragment;
    attr: LocaleFragment;
    dataAttr?: LocaleFragment;
    author: LocaleFragment;
    contributor?: LocaleFragment;
    mapper?: LocaleFragment;
    description?: LocaleFragment;
    license: MapLicense;
    dataLicense: DataLicense;
    createdAt: LocaleFragment;
    era?: LocaleFragment;
    reference: string;
}
export interface MaplatWorldParams extends Object {
    xScale: number;
    yRotation: number;
    xRotation: number;
    yScale: number;
    xOrigin: number;
    yOrigin: number;
}
export interface MaplatProjectionSpec extends Object {
    size?: Coordinate2D;
    mapCoord: string;
    mapCoordText?: string;
    worldParams?: MaplatWorldParams;
    interOperationCode: string;
    warp: "TIN" | "SHIFT" | "NONE";
    coordShift?: Coordinate2D;
    envelopeLngLats?: Coordinate2D[];
}
export interface MaplatSourceSpec extends Object {
    tileSourceType: "PIXEL" | "WMTS" | "TMS" | "IIIF";
    url?: string;
    extension?: string;
    iiifNumber?: number;
    maxZoom?: number;
}
export interface MaplatDefinition extends Object {
    version: string;
    mapID: string;
    metaData: MaplatMetaData;
    projectionSpec: MaplatProjectionSpec;
    sourceSpec: MaplatSourceSpec;
}
