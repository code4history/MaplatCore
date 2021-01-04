export * as ol from "ol";

declare module "ol" {
  export interface View {
    getDecimalZoom(): number;
    getResolution(): number;
    minZoom_: number;
    maxResolution_: number;
  }
}
