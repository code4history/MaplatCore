// nov26-m4-t9（MaplatCore #134）: 実メソッドを呼び、座標変換の完了だけを手動で制御する。
//
// 観測点は「変換の前に層を消さないこと」「1 回の呼び出しで層が入れ替わること」
// 「層に置かれた地物」に移した（消すのは全件の判定が済んだ後の 1 回で、1 件ずつは描かない）。
import { describe, expect, it, vi } from "vitest";
import { MaplatApp } from "../src/index";

const proto = MaplatApp.prototype as any;
const poi = (namespaceID: string) => ({ namespaceID, lnglat: [0, 0] });
const layer = (ids: string[], hide = false) => ({ pois: ids.map(poi), hide });

async function flushMicrotasks() {
  // 判定（全件を並べる）→ 層の入れ替え → 次回描画の連結を、時間待ちや再試行なしで処理する。
  for (let i = 0; i < 12; i++) await Promise.resolve();
}

function makeSource(mapID: string) {
  const features: any[] = [];
  return {
    mapID,
    pois: {} as Record<string, any>,
    features,
    clear: vi.fn(() => {
      features.length = 0;
    }),
    addFeatures: vi.fn((next: any[]) => {
      features.push(...next);
    }),
    ids: () => features.map((f: any) => f.get("datum").namespaceID)
  };
}

function makeApp(appPois: Record<string, any> = {}) {
  const conversions: {
    source: string;
    done: boolean;
    resolve: (xy: number[]) => void;
  }[] = [];
  const sources = Object.fromEntries(
    ["A", "B", "C"].map(mapID => {
      const source = makeSource(mapID);
      return [
        mapID,
        {
          ...source,
          insideCheckSysCoord: () => true,
          merc2SysCoordAsync_ignoreBackground: vi.fn(
            () =>
              new Promise<number[]>(resolve => {
                conversions.push({ source: mapID, done: false, resolve });
              })
          )
        }
      ];
    })
  ) as Record<string, any>;
  const self: any = {
    pois: appPois,
    from: sources.A,
    stateBuffer: {},
    logger: { debug: vi.fn() },
    mapObject: {
      // marker 層の source（層に置かれた地物を観測する）
      getSource: (name: string) => (name === "marker" ? sources.A : undefined)
    }
  };
  const redraw = (source?: any) => proto.redrawMarkers.call(self, source);
  const complete = async (targets = conversions.filter(c => !c.done)) => {
    // この時点で開始済みの変換だけを完了させる。後続回を一緒に完了させない。
    targets.forEach(c => {
      c.done = true;
      c.resolve([1, 1]);
    });
    await flushMicrotasks();
  };
  const ids = (): string[] =>
    (sources.A.ids() as string[]).slice().sort();
  return { self, sources, conversions, redraw, complete, ids, front: sources.A };
}

describe("nov26-m4-t9 #134 marker 再描画は直列で最新の要求を残す", () => {
  it("U-1a: 同 source を3回要求しても走る回は1つで、変換の前に層を消さない", async () => {
    const h = makeApp({ main: layer(["app_0", "app_1"]) });
    h.redraw();
    h.redraw();
    h.redraw();
    // 走っている回は 1 つ（変換の要求はマーカーの数だけ）
    expect(h.conversions).toHaveLength(2);
    // 保留は最新の 1 件だけ
    expect(h.self.__redrawMarkerThrottle).toEqual([h.sources.A]);
    // 判定の間は層を消さない
    expect(h.front.clear).toHaveBeenCalledTimes(0);
    await h.complete();
    expect(h.front.clear).toHaveBeenCalledTimes(1);
    await h.complete();
    expect(h.front.clear).toHaveBeenCalledTimes(2);
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
    expect(h.front.clear).toHaveBeenCalledTimes(2);
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
    expect(h.front.clear).toHaveBeenCalledTimes(0);
    await h.complete();
    expect(h.front.clear).toHaveBeenCalledTimes(1);
    await h.complete();
    // 判定した地図は A の回が 1 件、最新の C の回が 2 件（途中の B は判定しない）
    expect(h.conversions.map(c => c.source)).toEqual(["A", "C", "C"]);
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
    expect(h.conversions.map(c => c.source)).toEqual(["A", "C"]);
    expect(h.ids()).toEqual(["C#0"]);
  });

  it("U-3a: 保留後に追加・削除・層 hide を変えると次回開始時の POI が描かれる", async () => {
    const h = makeApp({
      main: layer(["app_old"]),
      hidden: layer(["app_hidden"])
    });
    h.sources.A.pois = {
      main: layer(["A#old"]),
      hidden: layer(["A#hidden"])
    };
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

  it("U-4: 選択中は最後に一回だけ、層の配列の末尾に置く", async () => {
    const h = makeApp({ main: layer(["app_selected", "app_normal"]) });
    h.self.__selectedMarker = "app_selected";
    h.redraw();
    h.redraw();
    // 選択中も他の POI と同じ回で並べて判定する（選択中のためだけの待ちをしない）
    expect(h.conversions).toHaveLength(2);
    expect(h.front.clear).toHaveBeenCalledTimes(0);
    await h.complete();
    // 並べ替えずに比べる（選択中が層の配列の最後にあること）
    expect(h.front.ids()).toEqual(["app_normal", "app_selected"]);
    // 保留回も同じ形（選択中が最後に 1 回だけ）
    await h.complete();
    expect(h.front.clear).toHaveBeenCalledTimes(2);
    expect(h.front.ids()).toEqual(["app_normal", "app_selected"]);
    expect(h.front.ids().filter((id: string) => id === "app_selected")).toHaveLength(1);
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
    expect(h.front.clear).toHaveBeenCalledTimes(2);
    await h.complete();
    expect(h.front.clear).toHaveBeenCalledTimes(3);
    expect(h.ids()).toEqual(["app_next"]);
    expect(h.self.__redrawMarkerBlock).toBe(false);
  });
});
