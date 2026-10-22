// 模擬の層 A（src/conformance/mock-layer-a.ts）に、層 A の適合テスト群（src/conformance/layer-a.ts）を流す。
// 模擬が層 A の公開面を満たすことと、群が公開面だけで書けていることの確認（仕様 §8・U7）。
// 実物の Core の要素には実ブラウザで同じ群を流す（e2e/wc-conformance.spec.ts）。
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  runLayerAConformance,
  createLayerAConformanceCases,
  defineMockMaplatApp,
  getMockLayerAController
} from "../src/conformance";
import { featuresOf, MAPLAT_APP_METHODS, ELEMENT_OWN_METHODS, MaplatAppElementBase } from "../src/common";

const SETTING = {
  appName: "conformance",
  homePosition: [141.15, 39.7],
  defaultZoom: 14,
  startFrom: "old",
  sources: [
    {
      mapID: "old",
      label: "古地図",
      isOldMap: true,
      envelope: [
        [141.1, 39.65],
        [141.2, 39.65],
        [141.2, 39.75],
        [141.1, 39.75]
      ],
      meta: { title: "古地図", license: "CC BY" },
      // タイルキャッシュを持つ地図（§3.8 A10 の total の検査を、模擬の固定データでも通す）
      cacheEnable: true,
      tileCacheTotal: 48
    },
    { mapID: "broken", usable: false },
    "gsi",
    "osm"
  ]
};

const fixture = {
  properties: { setting: SETTING },
  initialMapId: "old",
  otherMapId: "gsi",
  envelopeMapId: "old"
};

// 実装名 "core" の列で（Core と同じ機能表）
runLayerAConformance(
  {
    implementation: "core",
    register: () => defineMockMaplatApp("maplat-app"),
    fixture,
    timeout: 5000
  },
  { describe, it }
);

// display-mode を持つ模擬（有償版の列）。Pro 固有メソッドが「在る」側の分岐を通す
runLayerAConformance(
  {
    implementation: "core-pro",
    tagName: "maplat-app-pro-mock",
    register: () => defineMockMaplatApp("maplat-app-pro-mock", { implementation: "core-pro" }),
    fixture,
    timeout: 5000
  },
  { describe, it }
);

describe("模擬の層 A: 公開面以外を持たない", () => {
  it("内部への逃げ道（app・mapObject・from・cacheHash・stateBuffer）を持たず、子の DOM も見えない", async () => {
    defineMockMaplatApp("maplat-app");
    const el = document.createElement("maplat-app") as any;
    el.setting = SETTING;
    document.body.appendChild(el);
    await el.ready;
    for (const name of ["app", "mapObject", "from", "cacheHash", "stateBuffer", "mapDivDocument", "core"]) {
      expect(name in el, name).toBe(false);
    }
    expect(el.shadowRoot).toBeNull();
    expect(el.children.length).toBe(0);
    expect(el.currentMapId).toBe("old");
  });

  it("supports() の答えを切り替えられ、display-mode を真にすると Pro 固有メソッドと modechange が付く", async () => {
    defineMockMaplatApp("maplat-app-dm", { features: { "display-mode": true } });
    const el = document.createElement("maplat-app-dm") as any;
    expect(el.supports("display-mode")).toBe(true);
    expect(el.supports("mapbox")).toBe(featuresOf("core").mapbox);
    el.setting = SETTING;
    el.setAttribute("display-mode", "map-warp");
    document.body.appendChild(el);
    await el.ready;
    expect(el.getDisplayMode()).toBe("map-warp");
    const modes: string[] = [];
    el.addEventListener("modechange", (e: CustomEvent) => modes.push(e.detail.mode));
    let attrAtEvent: string | null = null;
    el.addEventListener("modechange", () => (attrAtEvent = el.getAttribute("display-mode")), { once: true });
    await el.setDisplayMode("maplat");
    expect(el.getDisplayMode()).toBe("maplat");
    // 内部の操作で変わった表示モードは display-mode へ書き戻す（§6.2.3）。modechange のリスナから新しい値が読める
    expect(el.getAttribute("display-mode")).toBe("maplat");
    expect(el.displayMode).toBe("maplat");
    expect(attrAtEvent).toBe("maplat");
    await new Promise(r => setTimeout(r, 0));
    expect(modes).toEqual(["maplat"]); // 書き戻しで二重に切り替えない
    el.displayMode = "map-warp"; // 属性・プロパティは (ii)
    await new Promise(r => setTimeout(r, 0));
    expect(modes).toEqual(["maplat", "map-warp"]);
    // 書き戻しの後に元の値を属性へ書くと戻せる
    await el.setDisplayMode("maplat");
    expect(el.getAttribute("display-mode")).toBe("maplat");
    el.setAttribute("display-mode", "map-warp");
    await new Promise(r => setTimeout(r, 0));
    expect(el.getDisplayMode()).toBe("map-warp");
    expect(modes).toEqual(["maplat", "map-warp", "maplat", "map-warp"]);
    // 付け直しても今の表示モードのまま
    await el.setDisplayMode("maplat");
    el.remove();
    await new Promise(r => setTimeout(r, 10));
    document.body.appendChild(el);
    await el.ready;
    await new Promise(r => setTimeout(r, 0));
    expect(el.getDisplayMode()).toBe("maplat");
  });

  it("本物と同じく、main の POI に id・namespaceID を振り、addPoiLayer の icon を保つ（実装確認 5）", async () => {
    defineMockMaplatApp("maplat-app");
    const el = document.createElement("maplat-app") as any;
    el.setting = { ...SETTING, pois: [{ name: "p", lnglat: [141.15, 39.7] }, { id: "given", name: "q", lng: 141.1, lat: 39.6 }] };
    document.body.appendChild(el);
    await el.ready;
    const [main] = el.listPoiLayers();
    expect(main.namespaceID).toBe("main");
    expect(main.name).toBe("conformance"); // Core と同じくアプリの appName
    expect(main.pois.map((p: any) => [p.id, p.namespaceID])).toEqual([
      ["main_0", "main_0"],
      ["given", "given"]
    ]);
    expect(main.pois[1].lnglat).toEqual([141.1, 39.6]);
    expect("lng" in main.pois[1]).toBe(false);
    el.addPoiLayer("spots", { name: "Spots", icon: "img/spot.png", selectedIcon: "img/spot_s.png", pois: [{ name: "s" }] });
    const spots = el.getPoiLayer("spots");
    expect([spots.icon, spots.selectedIcon, spots.pois[0].namespaceID]).toEqual(["img/spot.png", "img/spot_s.png", "spots_0"]);
    expect(el.addMarker({ name: "added", lnglat: [0, 0] }, "spots")).toBe("spots_1");
    expect(el.listPoiLayers(false, true).map((l: any) => l.namespaceID)).toEqual(["main", "spots"]);
    el.hidePoiLayer("spots");
    expect(el.listPoiLayers(true).map((l: any) => l.namespaceID)).toEqual(["spots"]);
    expect(el.getDefaultPinIcon()).toMatch(/^data:image\/svg\+xml/);
    expect(el.getDefaultPinIcon(true)).not.toBe(el.getDefaultPinIcon());
  });

  it("試験から中身のイベントを起こせる（getMockLayerAController）", async () => {
    defineMockMaplatApp("maplat-app");
    const el = document.createElement("maplat-app") as any;
    expect(getMockLayerAController(el)).toBeNull();
    el.setting = SETTING;
    document.body.appendChild(el);
    await el.ready;
    const ctl = getMockLayerAController(el)!;
    const got = vi.fn();
    el.addEventListener("outOfMap", got);
    ctl.fire("outOfMap", {});
    expect(got).toHaveBeenCalledTimes(1);
    const gps: unknown[] = [];
    el.addEventListener("gpsEnabledChanged", (e: CustomEvent) => gps.push(e.detail));
    el.handleGPS(true);
    ctl.setGpsEnabledInternally(false);
    expect(gps).toEqual([{ enabled: true }, { enabled: false }]);
    el.setEnvelopes([{ mapID: "old", stroke: { color: "#f00" } }]);
    expect(ctl.envelopes).toEqual([{ mapID: "old", stroke: { color: "#f00" } }]);
  });
});

describe("模擬の層 A: 線・面の登録簿（nov26-m4-t5・#91）", () => {
  // 適合テスト群は要素の公開面（メソッドの戻り値と clear の絞り込み）だけで書くので、一覧の並びと
  // stroke → style の正規化は公開面から読めない。模擬の中身が Core と同じ結果を返すことは、ここで見る。
  it("id・置き換えは末尾・stroke → style の正規化・呼び手の data を変えない（Core と同じ）", async () => {
    defineMockMaplatApp("maplat-app");
    const el = document.createElement("maplat-app") as any;
    el.setting = SETTING;
    document.body.appendChild(el);
    await el.ready;
    const ctl = getMockLayerAController(el)!;
    const stroke = { color: "#ff0000", width: 2 };
    const lineData: any = { lnglats: [[141.15, 39.7], [141.16, 39.71]], stroke };
    const a = el.addLine(lineData);
    const b = el.addVector({ type: "Polygon", lnglats: [[141.14, 39.69], [141.16, 39.69], [141.16, 39.71], [141.14, 39.69]] });
    const c = el.addVector({ lnglats: [[141.15, 39.7], [141.17, 39.72]] }); // type を省くと線
    expect([typeof a, typeof b, typeof c]).toEqual(["string", "string", "string"]);
    expect(new Set([a, b, c]).size).toBe(3);
    // type を省いた addVector は登録簿でも線として数える（data 自体には type を書かない）
    expect(ctl.vectors.map(v => v.type)).toEqual(["Line", "Polygon", undefined]);
    // addLine は写しに stroke を style.stroke へ正規化し、呼び手の data は変えない
    expect(ctl.vectors[0].style).toEqual({ stroke });
    expect(lineData.type).toBeUndefined();
    expect(lineData.style).toBeUndefined();
    // 既にある id で足すと置き換わり、末尾（描画では最前面）へ移る: a・b・c の後に a を置き換えると b・c・a
    expect(el.addLine({ id: a, lnglats: [[141.17, 39.72], [141.18, 39.73]], stroke })).toBe(a);
    expect(ctl.vectors.map(v => v.type)).toEqual(["Polygon", undefined, "Line"]);
    expect(ctl.vectors.map(v => v.lnglats[0])).toEqual([
      [141.14, 39.69],
      [141.15, 39.7],
      [141.17, 39.72]
    ]);
    expect(el.removeVector(a)).toBe(true);
    expect(el.removeVector(a)).toBe(false);
    expect(el.removeLine(b)).toBe(true);
    el.clearVector();
    expect(ctl.vectors).toEqual([]);
  });
});

// CORE-MOCK-FIX-1023: 模擬を本物の Core に揃えた 2 件（タイルキャッシュの統計の total・
// restoreSession の hideMarker）の中身を、模擬の設定を直接与えて確かめる。適合テスト群は
// 公開面だけを使うので値までは見られない（total が数であること・initialRestore に載ることだけを見る）。
describe("模擬の層 A: タイルキャッシュの統計の total（§3.8 A10・CORE-MOCK-FIX-1023）", () => {
  it("設定の tileCacheTotal を total として返し、総数が分からない地図は total を載せず、キャッシュを持たない地図は {}", async () => {
    defineMockMaplatApp("maplat-app");
    const el = document.createElement("maplat-app") as any;
    el.setting = {
      ...SETTING,
      sources: [
        { mapID: "cached", cacheEnable: true, tileCacheTotal: 48 },
        { mapID: "no-total", cacheEnable: true },
        { mapID: "plain" },
        "gsi"
      ]
    };
    document.body.appendChild(el);
    await el.ready;
    expect(await el.getMapTileCacheStatsAsync("cached")).toEqual({ size: 0, count: 0, total: 48 });
    expect(await el.getMapTileCacheStatsAsync("no-total")).toEqual({ size: 0, count: 0 });
    expect(await el.getMapTileCacheStatsAsync("plain")).toEqual({});
    expect(await el.getMapTileCacheStatsAsync()).toEqual({}); // 表示中の地図（sources の最後の gsi）はキャッシュを持たない
    expect(await el.getMapTileCacheSizeAsync("cached")).toBe(0);
  });
});

describe("模擬の層 A: restoreSession の読み取り（CORE-MOCK-FIX-1023）", () => {
  const KEYS = ["epoch", "mapID", "sourceID", "x", "y", "zoom", "rotation", "transparency", "hideMarker", "hideLayer", "backgroundID", "backID"];
  let saved: Array<[string, string | null]> = [];
  beforeEach(() => {
    defineMockMaplatApp("maplat-app");
    saved = KEYS.map(k => [k, localStorage.getItem(k)]);
    for (const k of KEYS) localStorage.removeItem(k);
  });
  afterEach(() => {
    for (const [k, v] of saved) {
      if (v === null) localStorage.removeItem(k);
      else localStorage.setItem(k, v);
    }
  });

  it("本物の Core と同じく、hideMarker・hideLayer・backgroundID（sourceID・backID への落とし込みも）を読む", async () => {
    localStorage.setItem("epoch", `${Math.floor(Date.now() / 1000)}`);
    localStorage.setItem("sourceID", "old"); // mapID が無ければ sourceID
    localStorage.setItem("x", "1");
    localStorage.setItem("y", "2");
    localStorage.setItem("zoom", "3");
    localStorage.setItem("rotation", "0");
    localStorage.setItem("transparency", "40");
    localStorage.setItem("hideMarker", "1");
    localStorage.setItem("hideLayer", "main");
    localStorage.setItem("backID", "gsi"); // backgroundID が無ければ backID
    const el = document.createElement("maplat-app") as any;
    el.setting = SETTING;
    el.setAttribute("restore-session", "");
    document.body.appendChild(el);
    await el.ready;
    expect(el.initialRestore.mapID).toBe("old");
    expect(el.initialRestore.backgroundID).toBe("gsi");
    // position・transparency・hideMarker は本物と同じく、無ければ 0 で載る（ここでは全部ある）
    expect(el.initialRestore.position).toEqual({ x: 1, y: 2, zoom: 3, rotation: 0 });
    expect(el.initialRestore.transparency).toBe(40);
    expect(el.initialRestore.hideMarker).toBe(1); // parseInt（文字列ではない）
    expect(el.initialRestore.hideLayer).toBe("main");
    // 読んだ hideMarker・hideLayer が起動時に当たる（本物の Core と同じ）
    expect(el.state.hideMarker).toBe(1);
    expect(el.listPoiLayers(true).map((l: any) => l.namespaceID)).toEqual(["main"]);
  });

  it("hideMarker が保存されていなければ 0（number）で、hideLayer は載らない", async () => {
    localStorage.setItem("epoch", `${Math.floor(Date.now() / 1000)}`);
    localStorage.setItem("mapID", "old");
    const el = document.createElement("maplat-app") as any;
    el.setting = SETTING;
    el.setAttribute("restore-session", "");
    document.body.appendChild(el);
    await el.ready;
    expect(el.initialRestore.mapID).toBe("old");
    expect(el.initialRestore.hideMarker).toBe(0);
    expect(el.initialRestore.hideLayer).toBeUndefined();
    // 保存が無い position・transparency も本物と同じく 0 で載る（メルカトル原点に当たる）
    expect(el.initialRestore.position).toEqual({ x: 0, y: 0, zoom: 0, rotation: 0 });
    expect(el.initialRestore.transparency).toBe(0);
  });
});

describe("適合テスト群の形", () => {
  it("群の名前は仕様 §8.2 の群で、名前は重ならない", () => {
    const cases = createLayerAConformanceCases({
      implementation: "core",
      register: () => undefined,
      fixture
    });
    expect(new Set(cases.map(c => c.group))).toEqual(
      new Set(["A-形", "A-同期", "A-優先", "A-起動後", "A-メソッド", "A-互換", "A-ベクター", "A-イベント", "A-機能", "A-破棄"])
    );
    expect(new Set(cases.map(c => c.name)).size).toBe(cases.length);
    // 件数の下限（nov26-m4-t5・#91 の A-ベクター 6 件・CORE-MOCK-FIX-1023 の 2 件を含む）。
    // layout の 2 件を足すと e2e の下限 53
    expect(cases.length).toBeGreaterThanOrEqual(51);
    // 実ブラウザ（layout）でだけ足す群がある
    const withLayout = createLayerAConformanceCases({
      implementation: "core",
      register: () => undefined,
      fixture,
      capabilities: { layout: true }
    });
    // 既定の箱の寸法と、マーカーのクリック（clickMarker → clickMarkers）
    expect(withLayout.length).toBe(cases.length + 2);
  });

  it("委譲メソッド 46・新設メソッド 8 の表", () => {
    expect(MAPLAT_APP_METHODS.length).toBe(46);
    expect([...ELEMENT_OWN_METHODS]).toEqual([
      "getViewpoint", "listMaps", "supports", "setEnvelopes", "getMapEnvelope", "getViewExtent", "zoomBy",
      "getDefaultPinIcon"
    ]);
  });
});

describe("MaplatAppElementBase の派生クラス向けの口（markPending・canDisposeDuringStartup）", () => {
  const tick = () => new Promise(r => setTimeout(r, 0));
  class FakeImpl extends EventTarget {
    waitReady: Promise<void>;
    resolveReady!: () => void;
    remove = vi.fn();
    changeMap = vi.fn();
    setTransparency = vi.fn();
    constructor() {
      super();
      this.waitReady = new Promise<void>(r => (this.resolveReady = r));
    }
    getGPSEnabled() {
      return false;
    }
    currentMapInfo() {
      return { mapID: "a" };
    }
  }
  let n = 0;
  function define(early: boolean) {
    const created: FakeImpl[] = [];
    const applied: string[][] = [];
    class HookElement extends MaplatAppElementBase {
      readonly implementation = "core-pro";
      readonly version = "0.0.0";
      listMaps() {
        return [];
      }
      setEnvelopes() {
        // 枠線は描かない（口の検査に要らない）
      }
      getMapEnvelope() {
        return null;
      }
      getViewExtent() {
        return null;
      }
      zoomBy() {
        // 視点は動かさない（口の検査に要らない）
      }
      getDefaultPinIcon() {
        return "data:image/png;base64,";
      }
      protected features() {
        return featuresOf("core-pro");
      }
      protected createImplementation(): any {
        const impl = new FakeImpl();
        created.push(impl);
        return impl;
      }
      protected canDisposeDuringStartup() {
        return early;
      }
      protected onImplementationReady() {
        // 作成時の材料で渡せないキー（例: display-mode）を準備の完了後に当てる
        if (this.readKey("displayMode") !== undefined) this.markPending("displayMode");
      }
      protected applyRuntimeChanges(_impl: unknown, pending: ReadonlySet<string>) {
        applied.push([...pending]);
      }
    }
    const tag = `base-hook-element-${++n}`;
    customElements.define(tag, HookElement);
    return { tag, created, applied };
  }

  it("onImplementationReady で markPending したキーは ready の直後に 1 回だけ applyRuntimeChanges へ渡る", async () => {
    const env = define(false);
    const el = document.createElement(env.tag) as any;
    el.setAttribute("app-id", "x");
    el.setAttribute("display-mode", "map-warp");
    document.body.appendChild(el);
    await tick();
    expect(env.applied).toEqual([]);
    env.created[0].resolveReady();
    await el.ready;
    await tick();
    expect(env.applied).toEqual([["displayMode"]]);
    el.remove();
    await tick();
  });

  it("既定（false）では初期化の途中で外した中身は ready を待ってから破棄する", async () => {
    const env = define(false);
    const el = document.createElement(env.tag) as any;
    el.setAttribute("app-id", "x");
    document.body.appendChild(el);
    await tick();
    el.remove();
    await tick();
    expect(env.created[0].remove).not.toHaveBeenCalled();
    env.created[0].resolveReady();
    await tick();
    expect(env.created[0].remove).toHaveBeenCalledTimes(1);
  });

  it("true なら外した時点で破棄し（ready を待たない）、置き直すと待たずに作り直す", async () => {
    const env = define(true);
    const el = document.createElement(env.tag) as any;
    el.setAttribute("app-id", "x");
    document.body.appendChild(el);
    await tick();
    el.remove();
    await tick();
    expect(env.created[0].remove).toHaveBeenCalledTimes(1);
    document.body.appendChild(el);
    await tick();
    expect(env.created).toHaveLength(2);
    el.remove();
    await tick();
    expect(env.created[1].remove).toHaveBeenCalledTimes(1);
  });
});
