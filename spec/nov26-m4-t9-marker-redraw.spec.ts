// nov26-m4-t9（MaplatCore #134）: 実メソッドを呼び、座標変換の完了だけを手動で制御する。
import { describe, expect, it, vi } from "vitest";
import { MaplatApp } from "../src/index";

const proto = MaplatApp.prototype as any;
const poi = (namespaceID: string) => ({ namespaceID, lnglat: [0, 0] });
const layer = (ids: string[], hide = false) => ({ pois: ids.map(poi), hide });

async function flushMicrotasks() {
  // Promise.all → selected → 次回描画の連結を、時間待ちや再試行なしで処理する。
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

function makeApp(appPois: Record<string, any> = {}) {
  const features: any[] = [];
  const conversions: { source: string; done: boolean; resolve: (xy: number[]) => void }[] = [];
  const calls: { source: string; id: string }[] = [];
  const sources = Object.fromEntries(["A", "B", "C"].map(mapID => [mapID, {
    mapID,
    pois: {},
    insideCheckSysCoord: () => true,
    merc2SysCoordAsync_ignoreBackground: vi.fn(() => new Promise<number[]>(resolve => {
      conversions.push({ source: mapID, done: false, resolve });
    }))
  }])) as Record<string, any>;
  const self: any = {
    pois: appPois,
    from: sources.A,
    stateBuffer: {},
    logger: { debug: vi.fn() },
    mapObject: {
      resetMarker: vi.fn(() => { features.length = 0; }),
      setMarker: vi.fn((_xy: number[], properties: any) => { features.push(properties.datum); })
    }
  };
  self.resetMarker = () => proto.resetMarker.call(self);
  self.setMarker = (data: any) => {
    calls.push({ source: self.from.mapID, id: data.namespaceID });
    return proto.setMarker.call(self, data);
  };
  const redraw = (source?: any) => proto.redrawMarkers.call(self, source);
  const complete = async (targets = conversions.filter(c => !c.done)) => {
    // この時点で開始済みの変換だけを完了させる。後続回を一緒に完了させない。
    targets.forEach(c => { c.done = true; c.resolve([1, 1]); });
    await flushMicrotasks();
  };
  const ids = () => features.map(f => f.namespaceID).sort();
  return { self, sources, calls, conversions, redraw, complete, ids };
}

describe("nov26-m4-t9 #134 marker 再描画は直列で最新の要求を残す", () => {
  it("U-1a: 同 source を3回要求しても現在回の変換未完了中の reset は1回だけ", async () => {
    const h = makeApp({ main: layer(["app_0", "app_1"]) });
    h.redraw();
    h.redraw();
    h.redraw();
    expect(h.self.mapObject.resetMarker).toHaveBeenCalledTimes(1);
    await h.complete();
    expect(h.self.mapObject.resetMarker).toHaveBeenCalledTimes(2);
    await h.complete();
    expect(h.ids()).toEqual(["app_0", "app_1"]);
    expect(h.self.__redrawMarkerBlock).toBe(false);
  });

  it("U-1b: 変換後に実際に追加された Feature の多重集合は各 POI 一件ずつ", async () => {
    const h = makeApp({ main: layer(["app_0", "app_1"]) });
    h.redraw();
    h.redraw();
    h.redraw();
    // 現在回だけを先に完了する。旧実装の素通り回は後から完了し重複を追加する。
    await h.complete(h.conversions.slice(0, 2));
    await h.complete();
    expect(h.ids()).toEqual(["app_0", "app_1"]);
  });

  it("U-2a: A の途中の B→C→C は最新 C 一件だけを保留する", async () => {
    const h = makeApp();
    h.sources.A.pois = { main: layer(["A#0"]) };
    h.sources.B.pois = { main: layer(["B#0"]) };
    h.sources.C.pois = { main: layer(["C#0", "C#1"]) };
    h.redraw();
    h.self.from = h.sources.B;
    h.redraw(h.sources.B);
    h.self.from = h.sources.C;
    h.redraw(h.sources.C);
    h.redraw(h.sources.C);
    expect(h.self.__redrawMarkerThrottle).toEqual([h.sources.C]);
    expect(h.self.mapObject.resetMarker).toHaveBeenCalledTimes(1);
    await h.complete();
    await h.complete();
    expect(h.calls.map(c => c.source)).toEqual(["A", "C", "C"]);
    expect(h.ids()).toEqual(["C#0", "C#1"]);
  });

  it("U-2b: 途中の B は描画せず、最終 C の Feature だけが残る", async () => {
    const h = makeApp();
    h.sources.A.pois = { main: layer(["A#0"]) };
    h.sources.B.pois = { main: layer(["B#0"]) };
    h.sources.C.pois = { main: layer(["C#0"]) };
    h.redraw();
    h.self.from = h.sources.B;
    h.redraw();
    h.self.from = h.sources.C;
    h.redraw();
    await h.complete();
    await h.complete();
    expect(h.calls.map(c => c.id)).toEqual(["A#0", "C#0"]);
    expect(h.ids()).toEqual(["C#0"]);
  });

  it("U-3a: 保留後に追加・削除・層 hide を変えると次回開始時の POI が描かれる", async () => {
    const h = makeApp({ main: layer(["app_old"]), hidden: layer(["app_hidden"]) });
    h.sources.A.pois = { main: layer(["A#old"]), hidden: layer(["A#hidden"]) };
    h.redraw();
    h.redraw();
    h.self.pois.main.pois = [poi("app_new")];
    h.self.pois.hidden.hide = true;
    h.sources.A.pois.main.pois = [poi("A#new")];
    h.sources.A.pois.hidden.hide = true;
    await h.complete();
    await h.complete();
    expect(h.ids()).toEqual(["A#new", "app_new"]);
  });

  it("U-3b: 描画途中の全体 hide は保留回に反映され Feature が空になる", async () => {
    const h = makeApp({ main: layer(["app_0"]) });
    h.sources.A.pois = { main: layer(["A#0"]) };
    h.redraw();
    h.redraw();
    h.self.stateBuffer.hideMarker = true;
    await h.complete();
    expect(h.ids()).toEqual([]);
    expect(h.self.__redrawMarkerBlock).toBe(false);
  });

  it("U-4: selected は最後に一回、selected の Promise 未完了中は次 reset を始めない", async () => {
    const h = makeApp({ main: layer(["app_selected", "app_normal"]) });
    h.self.__selectedMarker = "app_selected";
    h.redraw();
    h.redraw();
    expect(h.calls.map(c => c.id)).toEqual(["app_normal"]);
    await h.complete();
    expect(h.calls.map(c => c.id)).toEqual(["app_normal", "app_selected"]);
    expect(h.conversions.filter(c => !c.done)).toHaveLength(1);
    expect(h.self.mapObject.resetMarker).toHaveBeenCalledTimes(1);
    expect(h.ids()).toEqual(["app_normal"]);
    await h.complete();
    expect(h.self.mapObject.resetMarker).toHaveBeenCalledTimes(2);
    await h.complete();
    expect(h.calls.map(c => c.id)).toEqual(["app_normal", "app_selected", "app_normal", "app_selected"]);
    expect(h.self.mapObject.resetMarker).toHaveBeenCalledTimes(2);
    await h.complete();
    expect(h.ids()).toEqual(["app_normal", "app_selected"]);
    expect(h.self.mapObject.setMarker.mock.calls.map((c: any[]) => c[1].datum.namespaceID)).toEqual([
      "app_normal", "app_selected", "app_normal", "app_selected"
    ]);
    expect(h.self.__redrawMarkerBlock).toBe(false);
  });

  it("U-5: 保留が空になった後の独立 redraw は新しい POI を描く", async () => {
    const h = makeApp({ main: layer(["app_0"]) });
    h.redraw();
    h.redraw();
    await h.complete();
    await h.complete();
    expect(h.self.__redrawMarkerBlock).toBe(false);
    expect(h.self.__redrawMarkerThrottle).toEqual([]);
    h.self.pois.main.pois = [poi("app_next")];
    h.redraw();
    expect(h.self.mapObject.resetMarker).toHaveBeenCalledTimes(3);
    await h.complete();
    expect(h.ids()).toEqual(["app_next"]);
    expect(h.self.__redrawMarkerBlock).toBe(false);
  });
});
