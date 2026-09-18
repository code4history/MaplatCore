// oct26-m11-t5（MaplatCore #111）: removeMarker / removePoi が delete で POI 配列に穴を残さないことを固定する。
// 変更前は `delete this.pois[key].pois[i]` で要素が詰まらず length も変わらないため、
// 2 回目の removeMarker・getMarker の for…of が穴で TypeError になり、dispatchPoiNumber の数も減らなかった。
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MaplatApp } from "../src/index";
import { setCustomFunction } from "../src/source/mixin";

const proto = MaplatApp.prototype as any;
const removeMarker = proto.removeMarker as (id: any) => void;
const getMarker = proto.getMarker as (id: any) => any;
const dispatchPoiNumber = proto.dispatchPoiNumber as () => void;
const appListPoiLayers = proto.listPoiLayers as (hideOnly?: boolean, nonzero?: boolean) => any[];

const Mixed = setCustomFunction(class {});
const mixinProto = Mixed.prototype as any;
const removePoi = mixinProto.removePoi as (id: string) => void;
const getPoi = mixinProto.getPoi as (id: string) => any;
const mixinListPoiLayers = mixinProto.listPoiLayers as (hideOnly?: boolean, nonzero?: boolean) => any[];

const poi = (id: string) => ({ id, namespaceID: id, lnglat: [0, 0] });
const layer = (id: string, ids: string[]) => ({ id, namespaceID: id, pois: ids.map(poi) });
// 穴が無いこと: includes は穴を undefined として数える。
const hasHole = (arr: any[]) => arr.includes(undefined);
const ids = (arr: any[]) => arr.map(p => p.id);

function makeMapSource(mapID: string, pois: Record<string, any>) {
  const source: any = { mapID, pois };
  source.removePoi = (id: string) => removePoi.call(source, id);
  source.getPoi = (id: string) => getPoi.call(source, id);
  source.listPoiLayers = (h = false, n = false) => mixinListPoiLayers.call(source, h, n);
  return source;
}

function makeApp(appPois: Record<string, any>, cacheHash: Record<string, any> = {}, from?: any) {
  const events: any[] = [];
  const self: any = {
    pois: appPois,
    cacheHash,
    from: from ?? { listPoiLayers: () => [] },
    redrawMarkers: vi.fn(),
    dispatchEvent: (evt: any) => events.push(evt)
  };
  self.listPoiLayers = (h = false, n = false) => appListPoiLayers.call(self, h, n);
  self.dispatchPoiNumber = vi.fn(() => dispatchPoiNumber.call(self));
  self.events = events;
  self.lastPoiNumber = () => events.filter(e => e.type === "poi_number").at(-1)?.detail;
  return self;
}

describe("oct26-m11-t5 #111 removeMarker（app 経路）は配列を詰める", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("R-1: 消してからもう一度（別の id を）消しても例外にならず、両方消える", () => {
    const self = makeApp({ main: layer("main", ["main_0", "main_1"]) });
    removeMarker.call(self, "main_0");
    expect(() => removeMarker.call(self, "main_1")).not.toThrow();
    expect(self.pois.main.pois).toHaveLength(0);
  });

  it("R-2: 同じ id を 2 回消すと、2 回目は何もしない（例外なし・通知なし）", () => {
    const self = makeApp({ main: layer("main", ["main_0", "main_1"]) });
    removeMarker.call(self, "main_0");
    self.dispatchPoiNumber.mockClear();
    self.redrawMarkers.mockClear();
    expect(() => removeMarker.call(self, "main_0")).not.toThrow();
    expect(ids(self.pois.main.pois)).toEqual(["main_1"]);
    expect(self.dispatchPoiNumber).not.toHaveBeenCalled();
    expect(self.redrawMarkers).not.toHaveBeenCalled();
  });

  it("R-3: 消したあと数える — poi_number が消した分だけ減り、穴が無い", () => {
    const self = makeApp({ main: layer("main", ["main_0", "main_1", "main_2"]) });
    removeMarker.call(self, "main_1");
    expect(self.lastPoiNumber()).toBe(2);
    expect(self.pois.main.pois).toHaveLength(2);
    expect(hasHole(self.pois.main.pois)).toBe(false);
  });

  it("R-4: 全件消すと poi_number は 0 で、listPoiLayers(false, true) からレイヤが外れる", () => {
    const self = makeApp({ main: layer("main", ["main_0"]), sub: layer("sub", ["sub_0"]) });
    removeMarker.call(self, "main_0");
    expect(self.lastPoiNumber()).toBe(1);
    expect(self.listPoiLayers(false, true).map((l: any) => l.id)).toEqual(["sub"]);
    removeMarker.call(self, "sub_0");
    expect(self.lastPoiNumber()).toBe(0);
    expect(self.listPoiLayers(false, true)).toEqual([]);
  });

  it("R-5: 消したあとも getMarker（for…of）が残りの POI を引ける", () => {
    const self = makeApp({ main: layer("main", ["main_0", "main_1"]) });
    removeMarker.call(self, "main_0");
    expect(() => getMarker.call(self, "main_1")).not.toThrow();
    expect(getMarker.call(self, "main_1")?.id).toBe("main_1");
    expect(getMarker.call(self, "main_0")).toBeUndefined();
  });

  it("R-6: 途中の 1 件を消すと、残りの順序が保たれる", () => {
    const self = makeApp({ main: layer("main", ["a", "b", "c"]) });
    removeMarker.call(self, "b");
    expect(ids(self.pois.main.pois)).toEqual(["a", "c"]);
  });

  it("R-7: 同じ id が複数（連続・別レイヤ）あると全部消し、通知は 1 回だけ", () => {
    const self = makeApp({
      main: layer("main", ["dup", "dup", "x"]),
      sub: layer("sub", ["y", "dup"])
    });
    removeMarker.call(self, "dup");
    expect(ids(self.pois.main.pois)).toEqual(["x"]);
    expect(ids(self.pois.sub.pois)).toEqual(["y"]);
    expect(self.dispatchPoiNumber).toHaveBeenCalledTimes(1);
    expect(self.redrawMarkers).toHaveBeenCalledTimes(1);
    expect(self.lastPoiNumber()).toBe(2);
  });

  it("R-8: 無い id を消しても何も変わらない（例外なし・通知なし）", () => {
    const self = makeApp({ main: layer("main", ["main_0"]) });
    expect(() => removeMarker.call(self, "ghost")).not.toThrow();
    expect(ids(self.pois.main.pois)).toEqual(["main_0"]);
    expect(self.dispatchPoiNumber).not.toHaveBeenCalled();
    expect(self.redrawMarkers).not.toHaveBeenCalled();
  });
});

describe("oct26-m11-t5 #111 cluster 経路（<mapID>#<id>）は source.removePoi で配列を詰める", () => {
  it("C-1: removeMarker('omt#…') を 2 回（別 id）呼ぶと、map source の配列が空になり穴が無い", () => {
    const source = makeMapSource("omt", { main: layer("main", ["main_0", "main_1"]) });
    const self = makeApp({}, { omt: source }, source);
    removeMarker.call(self, "omt#main_0");
    expect(() => removeMarker.call(self, "omt#main_1")).not.toThrow();
    expect(source.pois.main.pois).toHaveLength(0);
    expect(hasHole(source.pois.main.pois)).toBe(false);
  });

  it("C-2: cluster 経路で消したあと数える — poi_number に map source の件数が正しく入る", () => {
    const source = makeMapSource("omt", { main: layer("main", ["main_0", "main_1", "main_2"]) });
    const self = makeApp({}, { omt: source }, source);
    removeMarker.call(self, "omt#main_1");
    expect(self.lastPoiNumber()).toBe(2);
    expect(ids(source.pois.main.pois)).toEqual(["main_0", "main_2"]);
  });

  it("C-3: source.removePoi を直接呼んでも穴が残らず、全件消すと nonzero 一覧から外れる", () => {
    const source = makeMapSource("omt", { main: layer("main", ["dup", "k", "dup"]) });
    source.removePoi("dup");
    expect(ids(source.pois.main.pois)).toEqual(["k"]);
    source.removePoi("dup");
    expect(ids(source.pois.main.pois)).toEqual(["k"]);
    source.removePoi("k");
    expect(source.pois.main.pois).toHaveLength(0);
    expect(source.listPoiLayers(false, true)).toEqual([]);
    expect(source.getPoi("k")).toBeUndefined();
  });
});
