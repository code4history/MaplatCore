export * from "@maplat/tin";

declare module "@maplat/tin" {
  export default interface Tin {
    xyBounds: any;
    mercBounds: any;
  }
}
