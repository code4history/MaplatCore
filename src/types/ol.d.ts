declare module "ol" {
  export class View {
    getDecimalZoom(): number;
    getResolution(): number;
    minZoom_: number;
    maxResolution_: number;
  }
}
