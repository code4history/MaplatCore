// <maplat-app>（src/element.ts）の今回の追加分の検査（仕様 §3.4.2・§3.8・§5.2・§10.1 U3）:
//   - setEnvelopes / getMapEnvelope / getViewExtent と supports("envelopes")
//   - Pro 固有の属性・プロパティ（display-mode）はキーごとに 1 回警告して無視（U3）
//   - restoreExtensionKeys の配線（要素 → MaplatApp → localStorage）
//   - §3.8 の Core 側の是正のうち jsdom で確かめられるもの（A7・A10）
// 地図の実体（OL）は jsdom で動かさず、MaplatApp の代わりに FakeCore を createCore で差し込む。
// 透過度の当て直し（A4）・状態の transparency は実ブラウザの適合テスト（e2e/wc-conformance.spec.ts）で見る。
import { describe, it, expect, vi, beforeEach, beforeAll, afterEach } from "vitest";
import EventTarget from "ol/events/Target";
import { toLonLat } from "ol/proj";
import { MaplatAppElement } from "../src/element";
import { MaplatApp, CustomEvent as CoreEvent } from "../src/index";
import { NowMap } from "../src/source/nowmap";

const tick = () => new Promise(r => setTimeout(r, 0));

beforeAll(() => {
  if (typeof (globalThis as any).ResizeObserver === "undefined") {
    const noop = () => undefined;
    (globalThis as any).ResizeObserver = class {
      observe = noop;
      unobserve = noop;
      disconnect = noop;
    };
  }
});
afterEach(() => {
  vi.restoreAllMocks();
});

const M = 20037508.342789244;
// 東経 141.1〜141.2・北緯 39.65〜39.75 付近の矩形（merc）
const ring = [
  [15707000, 4815000],
  [15718000, 4815000],
  [15718000, 4829000],
  [15707000, 4829000],
  [15707000, 4815000]
];

class FakeCore extends EventTarget {
  option: any;
  waitReady: Promise<void>;
  resolveReady!: () => void;
  remove = vi.fn();
  getGPSEnabled = vi.fn(() => false);
  getMapCacheEnable = vi.fn(() => false);
  mapObject: any = {
    updateSize: vi.fn(),
    setTarget: vi.fn(),
    resetEnvelope: vi.fn(),
    setEnvelope: vi.fn(),
    setFillEnvelope: vi.fn(),
    getSize: () => [400, 300],
    getCoordinateFromPixel: (px: number[]) => [15700000 + px[0] * 10, 4830000 - px[1] * 10]
  };
  cacheHash: any = {
    old: {
      mapID: "old",
      width: 1000,
      height: 800,
      xy2SysCoord: (xy: number[]) => [xy[0] - M, M - xy[1]],
      isWmts: () => false,
      isBasemap: () => false,
      envelope: { geometry: { coordinates: [ring] } }
    },
    gsi: { mapID: "gsi", isWmts: () => true, isBasemap: () => true }
  };
  from: any;
  constructor(option: any) {
    super();
    this.option = option;
    this.from = {
      mapID: "gsi",
      merc2SysCoordAsync: async (m: number[]) => [m[0] + 1, m[1] + 1],
      sysCoord2MercAsync: async (c: number[]) => c
    };
    this.waitReady = new Promise<void>(r => {
      this.resolveReady = r;
    });
  }
  currentMapInfo() {
    return { mapID: this.from.mapID };
  }
}

let seq = 0;
function defineTestElement() {
  const created: FakeCore[] = [];
  class TestElement extends MaplatAppElement {
    protected createCore(option: Record<string, any>): any {
      const core = new FakeCore(option);
      created.push(core);
      return core;
    }
  }
  const tag = `test-maplat-app-add-${++seq}`;
  customElements.define(tag, TestElement);
  return { tag, created };
}

async function boot(env: ReturnType<typeof defineTestElement>, setup?: (el: any) => void) {
  const el = document.createElement(env.tag) as any;
  el.setAttribute("app-id", "a");
  setup?.(el);
  document.body.appendChild(el);
  await tick();
  const core = env.created[env.created.length - 1];
  return { el, core };
}

describe("<maplat-app> 枠線と範囲（§3.4.2）", () => {
  let env: ReturnType<typeof defineTestElement>;
  beforeEach(() => {
    env = defineTestElement();
  });

  it('supports("envelopes") は真', () => {
    const el = document.createElement(env.tag) as any;
    expect(el.supports("envelopes")).toBe(true);
  });

  it("getMapEnvelope は merc の範囲を経緯度の多角形にする（閉じの頂点は繰り返さない）。範囲の無い地図は null", async () => {
    const { el, core } = await boot(env);
    expect(document.createElement(env.tag) as any).toBeTruthy();
    expect((document.createElement(env.tag) as any).getMapEnvelope("old")).toBeNull(); // 作る前は例外にせず null
    core.resolveReady();
    await el.ready;
    const env1 = el.getMapEnvelope("old");
    expect(env1).toHaveLength(4);
    env1.forEach((p: any, i: number) => {
      const [lng, lat] = toLonLat(ring[i]);
      expect(p.longitude).toBeCloseTo(lng, 9);
      expect(p.latitude).toBeCloseTo(lat, 9);
    });
    expect(el.getMapEnvelope("gsi")).toBeNull();
    expect(el.getMapEnvelope("nothing")).toBeNull();
    expect(el.listMaps().map((m: any) => [m.mapID, m.hasEnvelope])).toEqual([
      ["old", true],
      ["gsi", false]
    ]);
  });

  it("setEnvelopes は ready 前の指定を ready 後に描き、地図を切り替えたら描き直す。空配列で消す", async () => {
    const { el, core } = await boot(env);
    el.setEnvelopes([
      { mapID: "old", stroke: { color: "#ff0000", width: 3, lineDash: [6, 6] }, fill: "rgba(0,0,255,0.4)" },
      { mapID: "gsi", stroke: { color: "#000" } }, // 範囲の無い地図は描かない
      { mapID: "nothing", stroke: { color: "#000" } }
    ]);
    await tick();
    expect(core.mapObject.setEnvelope).not.toHaveBeenCalled();
    core.resolveReady();
    await el.ready;
    await tick();
    const map = core.mapObject;
    expect(map.resetEnvelope).toHaveBeenCalledTimes(1);
    expect(map.setEnvelope).toHaveBeenCalledTimes(1);
    // 今の地図（gsi）の座標へ変換した範囲（merc2SysCoordAsync は +1 する偽物）
    const expected = ring.map(m => [m[0] + 1, m[1] + 1]);
    expect(map.setEnvelope).toHaveBeenCalledWith(expected, { color: "#ff0000", width: 3, lineDash: [6, 6] });
    expect(map.setFillEnvelope).toHaveBeenCalledWith(expected, null, { color: "rgba(0,0,255,0.4)" });

    // 地図を古地図（old）へ切り替えたら、現在の古地図は画像の 4 隅で描き直す
    core.from = { ...core.cacheHash.old, merc2SysCoordAsync: async (m: number[]) => m };
    core.dispatchEvent(new CoreEvent("mapChanged", { mapID: "old" }));
    await tick();
    expect(map.resetEnvelope).toHaveBeenCalledTimes(2);
    expect(map.setEnvelope).toHaveBeenLastCalledWith(
      [
        [0, 0],
        [1000, 0],
        [1000, 800],
        [0, 800],
        [0, 0]
      ].map(xy => [xy[0] - M, M - xy[1]]),
      expect.objectContaining({ color: "#ff0000" })
    );

    el.setEnvelopes([]);
    await tick();
    expect(map.resetEnvelope).toHaveBeenCalledTimes(3);
    expect(map.setEnvelope).toHaveBeenCalledTimes(2);
    // 消した後の地図切替では描かない
    core.dispatchEvent(new CoreEvent("mapChanged", { mapID: "gsi" }));
    await tick();
    expect(map.resetEnvelope).toHaveBeenCalledTimes(3);
  });

  it("getViewExtent は視点が変わるたびに画面の 4 隅（左上・右上・右下・左下）を経緯度で控える", async () => {
    const { el, core } = await boot(env);
    core.resolveReady();
    await el.ready;
    expect(el.getViewExtent()).toBeNull();
    core.dispatchEvent(new CoreEvent("changeViewpoint", { x: 0, y: 0 }));
    await tick();
    const extent = el.getViewExtent();
    expect(extent).toHaveLength(4);
    const corners = [
      [0, 0],
      [400, 0],
      [400, 300],
      [0, 300]
    ].map(px => toLonLat([15700000 + px[0] * 10, 4830000 - px[1] * 10]));
    extent.forEach((p: any, i: number) => {
      expect(p.longitude).toBeCloseTo(corners[i][0], 9);
      expect(p.latitude).toBeCloseTo(corners[i][1], 9);
    });
    expect(extent[0].latitude).toBeGreaterThan(extent[3].latitude);
    expect(el.getViewExtent()).not.toBe(el.getViewExtent()); // 複製を返す
    // 破棄したら null
    el.remove();
    await tick();
    expect(el.getViewExtent()).toBeNull();
  });
});

describe("<maplat-app> Pro 固有の属性・プロパティ（U3）", () => {
  let env: ReturnType<typeof defineTestElement>;
  beforeEach(() => {
    env = defineTestElement();
  });

  it("display-mode の属性・プロパティはキーごとに 1 回だけ警告して無視する（警告文に実装名を出さない）", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { el, core } = await boot(env, e => e.setAttribute("display-mode", "map-warp"));
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toBe("<maplat-app>: ignored unsupported attribute \"display-mode\"");
    expect(String(warn.mock.calls[0][0])).not.toMatch(/pro/i);
    el.setAttribute("display-mode", "maplat");
    el.displayMode = "map-warp";
    expect(warn).toHaveBeenCalledTimes(1);
    expect(el.displayMode).toBeUndefined();
    expect(core.option.displayMode).toBeUndefined();
    expect("displayMode" in core.option).toBe(false);
    expect(typeof el.setDisplayMode).toBe("undefined");
    expect(typeof el.getDisplayMode).toBe("undefined");
    expect(el.supports("display-mode")).toBe(false);
  });

  it("プロパティから先に与えても 1 回だけ（別の要素では別に 1 回）", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const a = document.createElement(env.tag) as any;
    a.displayMode = "map-warp";
    a.displayMode = "maplat";
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toBe("<maplat-app>: ignored unsupported property \"displayMode\"");
    expect(a.hasAttribute("display-mode")).toBe(false); // 属性へも書き戻さない
    const b = document.createElement(env.tag) as any;
    b.setAttribute("display-mode", "map-warp");
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it("定義前に代入されたプロパティ（lazy upgrade）も警告して無視する", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const tag = `test-maplat-app-lazy-${++seq}`;
    const el = document.createElement(tag) as any;
    el.displayMode = "map-warp";
    el.setAttribute("app-id", "a");
    document.body.appendChild(el);
    class Lazy extends MaplatAppElement {
      protected createCore(option: Record<string, any>): any {
        return new FakeCore(option);
      }
    }
    customElements.define(tag, Lazy);
    await tick();
    expect(warn.mock.calls.map(c => String(c[0]))).toContain("<maplat-app>: ignored unsupported property \"displayMode\"");
    expect(el.displayMode).toBeUndefined();
  });
});

describe("restoreExtensionKeys（§5.2）", () => {
  let env: ReturnType<typeof defineTestElement>;
  beforeEach(() => {
    env = defineTestElement();
    localStorage.clear();
  });

  it("要素のプロパティは MaplatApp の appOption.restoreExtensionKeys に渡る（起動時のみ）", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { el, core } = await boot(env, e => {
      e.restoreExtensionKeys = ["showBorder"];
      e.setAttribute("restore-session", "");
    });
    expect(core.option.restoreExtensionKeys).toEqual(["showBorder"]);
    expect(core.option.restoreSession).toBe(true);
    el.restoreExtensionKeys = ["other"];
    expect(el.restoreExtensionKeys).toEqual(["showBorder"]);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("MaplatApp は restoreSession の期限内なら列挙されたキーも localStorage から読む（文字列のまま・無いキーは載せない）", async () => {
    const now = Math.floor(Date.now() / 1000);
    localStorage.setItem("epoch", `${now}`);
    localStorage.setItem("mapID", "m");
    localStorage.setItem("showBorder", "1");
    localStorage.setItem("transparency", "30");
    const div = document.createElement("div");
    document.body.appendChild(div);
    const app = new MaplatApp({
      div,
      setting: { sources: [] },
      restoreSession: true,
      restoreExtensionKeys: ["showBorder", "missing", "mapID"]
    });
    await app.waitReady;
    expect((app.initialRestore as any).showBorder).toBe("1");
    expect("missing" in app.initialRestore).toBe(false);
    expect(app.initialRestore.mapID).toBe("m"); // 層 A の既定のキーは上書きしない
    expect(app.initialRestore.transparency).toBe(30);
  });

  it("期限切れなら拡張キーも読まない", async () => {
    localStorage.setItem("epoch", `${Math.floor(Date.now() / 1000) - 7200}`);
    localStorage.setItem("showBorder", "1");
    const div = document.createElement("div");
    document.body.appendChild(div);
    const app = new MaplatApp({ div, setting: { sources: [] }, restoreSession: true, restoreExtensionKeys: ["showBorder"] });
    await app.waitReady;
    expect("showBorder" in app.initialRestore).toBe(false);
  });
});

describe("§3.8 の Core 側の是正（jsdom で確かめられるもの）", () => {
  it("A7: 要素の経路では設定ファイルの fakeGps / fakeRadius を読まない（旧クラスは従来どおり）", async () => {
    const setting = { sources: [], fakeGps: [141, 39], fakeRadius: 5 };
    const mk = async (extra: Record<string, unknown>) => {
      const div = document.createElement("div");
      document.body.appendChild(div);
      const app = new MaplatApp({ div, setting, fake: true, ...extra });
      await app.waitReady;
      return app;
    };
    const legacy = await mk({});
    expect(legacy.fakeGps).toEqual([141, 39]);
    expect(legacy.fakeRadius).toBe(5);
    const element = await mk({ __maplatElementMode: true });
    expect(element.fakeGps).toBe(false);
    expect(element.fakeRadius).toBe(false);
  });

  it("A10: タイルキャッシュの統計に total を含める（Weiwudi の stats に無ければ totalTile で補う）", async () => {
    const stats = (NowMap.prototype as any).getTileCacheStatsAsync;
    await expect(stats.call({ weiwudi: { stats: async () => ({ size: 1, count: 2 }), totalTile: 10 } })).resolves.toEqual({
      size: 1,
      count: 2,
      total: 10
    });
    // stats に total があればそのまま
    await expect(
      stats.call({ weiwudi: { stats: async () => ({ size: 1, count: 2, total: 5, percent: 40 }), totalTile: 10 } })
    ).resolves.toEqual({ size: 1, count: 2, total: 5, percent: 40 });
    // totalTile も無ければ足さない・Weiwudi が無ければ {}
    await expect(stats.call({ weiwudi: { stats: async () => ({ size: 1 }) } })).resolves.toEqual({ size: 1 });
    await expect(stats.call({})).resolves.toEqual({});
  });
});
