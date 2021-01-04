declare module "weiwudi" {
  export default class Weiwudi {
    public stats(): Promise<{ size: number }>;
    public clean(): Promise<void>;
    static registerMap(mapID: any, setting: any): Promise<any>;
  }
}
