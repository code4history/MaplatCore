declare module "weiwudi" {
  export default class Weiwudi {
    public stats(): Promise<{
      size?: number;
      count?: number;
      total?: number;
      percent?: number;
    }>;
    public clean(): Promise<void>;
    public fetchAll(): Promise<void>;
    public cancel(): Promise<void>;
    public addEventListener(type: string, handler: any): void;
    public removeEventListener(type: string, handler: any): void;
    static registerMap(mapID: any, setting: any): Promise<any>;
  }
}
