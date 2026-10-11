// <maplat-app>（src/element.ts）の骨組みの検査。
// 地図の実体（OL）は jsdom で動かさず、MaplatApp の代わりに FakeCore を createCore で差し込む。
import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import EventTarget from "ol/events/Target";
import {
  MaplatAppElement,
  MAPLAT_APP_EVENTS,
  MAPLAT_APP_METHODS,
  defineMaplatAppElement
} from "../src/element";
import { MaplatApp, CustomEvent as CoreEvent, GPSRequestEvent } from "../src/index";

// 1 拍（マイクロタスク）と、その後に続く Promise の連鎖を流し切る
const tick = () => new Promise(r => setTimeout(r, 0));

class FakeCore extends EventTarget {
  option: any;
  waitReady: Promise<void>;
  resolveReady!: () => void;
  currentMap: string;
  changeMap = vi.fn((id: string) => {
    this.currentMap = id;
    return Promise.resolve();
  });
  setTransparency = vi.fn();
  addMarker = vi.fn(() => "main#1");
  remove = vi.fn();
  getGPSEnabled = vi.fn(() => false);
  redrawMarkers = vi.fn();
  clientPointToLngLat = vi.fn(async () => undefined);
  mapObject: any = { updateSize: vi.fn(), setTarget: vi.fn(), northUp: false, homeMarginPixels: 50 };
  cacheHash: any = undefined;
  from: any = undefined;
  appData: any = undefined;
  poiTemplate: any = false;
  constructor(option: any) {
    super();
    this.option = option;
    this.currentMap = option.__restoreOverride?.mapID ?? option.restore?.mapID ?? "start";
    // 本物の MaplatApp と同じく、中心の目印を箱に入れる
    const img = document.createElement("img");
    img.id = "center_circle";
    img.className = "prevent-default maplat-center-marker";
    img.setAttribute("src", "default.png");
    option.div.insertBefore(img, option.div.firstChild);
    this.waitReady = new Promise<void>(r => {
      this.resolveReady = r;
    });
  }
  currentMapInfo() {
    return { mapID: this.currentMap };
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
  const tag = `test-maplat-app-${++seq}`;
  customElements.define(tag, TestElement);
  return { tag, created, TestElement };
}

function extractClassBody(): string {
  const src = readFileSync(resolve(__dirname, "../src/index.ts"), "utf-8");
  const start = src.indexOf("export class MaplatApp extends EventTarget");
  const end = src.indexOf("\nexport const MAPLAT_APP_STARTUP_FIELDS");
  return src.slice(start, end);
}

describe("<maplat-app> 登録", () => {
  it("副作用 import で maplat-app が MaplatAppElement として登録される", () => {
    expect(customElements.get("maplat-app")).toBe(MaplatAppElement);
    const el = document.createElement("maplat-app");
    expect(el).toBeInstanceOf(MaplatAppElement);
    expect(el.implementation).toBe("core");
  });

  it("二重登録しない。別実装が登録済みなら警告して何もしない", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    expect(() => defineMaplatAppElement()).not.toThrow();
    expect(warn).not.toHaveBeenCalled();
    class Other extends HTMLElement {}
    customElements.define("taken-maplat-app", Other);
    defineMaplatAppElement("taken-maplat-app");
    expect(customElements.get("taken-maplat-app")).toBe(Other);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it("observedAttributes は §3.2 の属性と中心の目印の 2 つ（U5）と Pro 固有の display-mode（U3: 警告して無視するため観測する）", () => {
    expect(MaplatAppElement.observedAttributes).toEqual([
      "app-id", "app-src", "map-id", "transparency", "no-rotate", "north-up", "home-margin-pixels",
      "always-gps-on", "fake", "enable-cache", "restore-session", "overlay", "debug", "icon",
      "selected-icon", "no-center-marker", "center-marker-src", "display-mode"
    ]);
  });
});

describe("<maplat-app> 公開面の一覧（src/index.ts との突き合わせ）", () => {
  it("出し直すイベントは MaplatApp が dispatch する全種と一致する", () => {
    const src = readFileSync(resolve(__dirname, "../src/index.ts"), "utf-8");
    const found = new Set<string>();
    for (const m of src.matchAll(/new CustomEvent\(\s*"([^"]+)"/g)) found.add(m[1]);
    // lifecycle:${phaseId} は LifecyclePhaseId の全値
    const phases = src.match(/type LifecyclePhaseId =([^;]+);/)![1];
    for (const m of phases.matchAll(/"([^"]+)"/g)) found.add(`lifecycle:${m[1]}`);
    // GPS 系は BaseEvent の派生クラスの super("...")
    for (const m of src.matchAll(/extends BaseEvent \{[\s\S]*?super\("([^"]+)"\)/g)) found.add(m[1]);
    expect([...found].sort()).toEqual([...MAPLAT_APP_EVENTS].sort());
  });

  it("委譲メソッドは MaplatApp の非 private メソッドから内部用を除いたもの", () => {
    const body = extractClassBody();
    const all: string[] = [];
    for (const m of body.matchAll(/^ {2}(private |static )?(async )?([A-Za-z_$][\w$]*)\s*\(/gm)) {
      if (m[1] || m[3] === "constructor") continue;
      all.push(m[3]);
    }
    const internal = [
      "settingLoader", "sourcesLoader", "handleSetting", "initGeolocation", "prepareMap",
      "handlePois", "handleSources", "setInitialMap", "setMapClick", "setPointerEvents",
      "setMapOnOff", "setMouseCursor", "setBackMapBehavior", "raiseChangeViewpoint",
      "convertParametersFromCurrent",
      "setMarker", "resetMarker", "setLine", "setVector", "resetLine", "resetVector",
      "redrawMarkers", "dispatchPoiNumber",
      "remove"
    ];
    expect(all.length).toBe(68);
    expect(all.filter(n => !internal.includes(n))).toEqual([...MAPLAT_APP_METHODS]);
    for (const name of MAPLAT_APP_METHODS) {
      expect(typeof (MaplatApp.prototype as any)[name]).toBe("function");
      // HTMLElement の既存のメンバを潰さない
      expect(name in HTMLElement.prototype).toBe(false);
    }
  });
});

describe("<maplat-app> 作成と属性", () => {
  let env: ReturnType<typeof defineTestElement>;
  beforeEach(() => {
    env = defineTestElement();
  });

  it("接続した拍の属性・appOption をまとめて 1 回だけ作成する。div は要素自身", async () => {
    const el = document.createElement(env.tag) as MaplatAppElement;
    document.body.appendChild(el);
    el.setAttribute("app-id", "morioka");
    el.setAttribute("map-id", "morioka_ndl");
    el.setAttribute("transparency", "30");
    el.appOption = { setting: { sources: [] }, restore: { hideMarker: 1 } };
    expect(env.created.length).toBe(0);
    await tick();
    expect(env.created.length).toBe(1);
    const opt = env.created[0].option;
    expect(opt.div).toBe(el);
    expect(opt.appid).toBe("morioka");
    expect(opt.setting).toEqual({ sources: [] });
    // map-id・transparency は restore より強いが、restore には混ぜず上書きの口で渡す（§6.1）
    expect(opt.restore).toEqual({ hideMarker: 1 });
    expect(opt.__restoreOverride).toEqual({ mapID: "morioka_ndl", transparency: 30 });
    expect(opt.__maplatElementMode).toBe(true);
    expect(el.app).toBe(env.created[0]);
  });

  it("app-id も appOption も無ければ作成を待つ", async () => {
    const el = document.createElement(env.tag) as MaplatAppElement;
    document.body.appendChild(el);
    await tick();
    expect(env.created.length).toBe(0);
    el.appId = "nara";
    await tick();
    expect(env.created.length).toBe(1);
    expect(env.created[0].option.appid).toBe("nara");
  });

  it("ready 前の属性の変更は溜め、ready 後に反映する", async () => {
    const el = document.createElement(env.tag) as MaplatAppElement;
    el.setAttribute("app-id", "a");
    document.body.appendChild(el);
    await tick();
    const core = env.created[0];
    el.setAttribute("map-id", "m2");
    el.setAttribute("transparency", "50");
    await tick();
    expect(core.changeMap).not.toHaveBeenCalled();
    expect(core.setTransparency).not.toHaveBeenCalled();
    let readyDone = false;
    void el.ready.then(() => {
      readyDone = true;
    });
    core.resolveReady();
    await tick();
    expect(readyDone).toBe(true);
    expect(core.changeMap).toHaveBeenCalledTimes(1);
    expect(core.changeMap).toHaveBeenCalledWith("m2");
    expect(core.setTransparency).toHaveBeenCalledWith(50);
  });

  it("ready 後の同じ拍の変更はまとめ、最後の値だけを 1 回反映する", async () => {
    const el = document.createElement(env.tag) as MaplatAppElement;
    el.setAttribute("app-id", "a");
    document.body.appendChild(el);
    await tick();
    const core = env.created[0];
    core.resolveReady();
    await el.ready;
    el.setAttribute("map-id", "x");
    el.setAttribute("map-id", "y");
    el.mapId = "z";
    el.transparency = 10;
    el.transparency = 20;
    expect(core.changeMap).not.toHaveBeenCalled();
    await tick();
    expect(core.changeMap).toHaveBeenCalledTimes(1);
    expect(core.changeMap).toHaveBeenCalledWith("z");
    expect(core.setTransparency).toHaveBeenCalledTimes(1);
    expect(core.setTransparency).toHaveBeenCalledWith(20);
    // 表示中の地図と同じ map-id には切り替えない（メソッド経由で先に切り替わっていた場合）
    core.currentMap = "q";
    el.mapId = "q";
    await tick();
    expect(core.changeMap).toHaveBeenCalledTimes(1);
  });

  it("起動後の app-id の変更は警告して無視する（作り直さない。U2）", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const el = document.createElement(env.tag) as MaplatAppElement;
    el.setAttribute("app-id", "a");
    document.body.appendChild(el);
    await tick();
    const first = env.created[0];
    first.resolveReady();
    await el.ready;
    const firstReady = el.ready;
    el.setAttribute("app-id", "b");
    el.setAttribute("app-id", "c");
    el.appId = "d";
    await tick();
    expect(first.remove).not.toHaveBeenCalled();
    expect(env.created.length).toBe(1);
    expect(el.app).toBe(first);
    expect(el.ready).toBe(firstReady);
    // 読み取りは起動時の値
    expect(el.appId).toBe("a");
    // キーごとに 1 回
    expect(warn.mock.calls.filter(c => String(c[0]).includes("fixed at startup")).length).toBe(1);
    warn.mockRestore();
  });

  it("初期化途中（ready 前）でも起動後なので app-id は変えられない", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const el = document.createElement(env.tag) as MaplatAppElement;
    el.setAttribute("app-id", "a");
    document.body.appendChild(el);
    await tick();
    el.setAttribute("app-id", "b");
    await tick();
    expect(env.created.length).toBe(1);
    expect(env.created[0].option.appid).toBe("a");
    expect(warn).toHaveBeenCalledTimes(1);
    env.created[0].resolveReady();
    await expect(el.ready).resolves.toBeUndefined();
    warn.mockRestore();
  });
});

describe("<maplat-app> lazy property upgrade", () => {
  it("登録前に代入したプロパティを登録後に拾い直す", async () => {
    const tag = `lazy-maplat-app-${++seq}`;
    const el = document.createElement(tag) as any;
    const appOption = { setting: { sources: ["osm"] } };
    el.appOption = appOption;
    el.mapId = "osm";
    document.body.appendChild(el);
    const created: FakeCore[] = [];
    class LazyElement extends MaplatAppElement {
      protected createCore(option: Record<string, any>): any {
        const core = new FakeCore(option);
        created.push(core);
        return core;
      }
    }
    customElements.define(tag, LazyElement);
    expect(Object.prototype.hasOwnProperty.call(el, "appOption")).toBe(false);
    expect(el.appOption).toBe(appOption);
    expect(el.getAttribute("map-id")).toBe("osm");
    await tick();
    expect(created.length).toBe(1);
    expect(created[0].option.setting).toEqual({ sources: ["osm"] });
    expect(created[0].option.__restoreOverride).toEqual({ mapID: "osm" });
  });
});

describe("<maplat-app> DOM からの取り外し", () => {
  let env: ReturnType<typeof defineTestElement>;
  beforeEach(() => {
    env = defineTestElement();
  });

  it("DOM 内の移動では破棄しない。外したままなら 1 拍後に破棄する", async () => {
    const a = document.createElement("div");
    const b = document.createElement("div");
    document.body.append(a, b);
    const el = document.createElement(env.tag) as MaplatAppElement;
    el.setAttribute("app-id", "a");
    a.appendChild(el);
    await tick();
    const core = env.created[0];
    core.resolveReady();
    await el.ready;
    b.appendChild(el); // 移動
    await tick();
    expect(core.remove).not.toHaveBeenCalled();
    expect(el.app).toBe(core);
    expect(env.created.length).toBe(1);
    el.remove(); // HTMLElement.prototype.remove（委譲していない）
    expect(core.remove).not.toHaveBeenCalled();
    await tick();
    expect(core.remove).toHaveBeenCalledTimes(1);
    expect(el.app).toBeNull();
  });

  it("外してから付け直すと作り直す", async () => {
    const el = document.createElement(env.tag) as MaplatAppElement;
    el.setAttribute("app-id", "a");
    document.body.appendChild(el);
    await tick();
    env.created[0].resolveReady();
    await el.ready;
    el.remove();
    await tick();
    document.body.appendChild(el);
    await tick();
    expect(env.created.length).toBe(2);
    expect(el.app).toBe(env.created[1]);
  });
});

describe("<maplat-app> イベントの出し直しとメソッドの委譲", () => {
  let env: ReturnType<typeof defineTestElement>;
  beforeEach(() => {
    env = defineTestElement();
  });

  it("Core のイベントを DOM の CustomEvent（bubbles）として出し直す", async () => {
    const el = document.createElement(env.tag) as MaplatAppElement;
    el.setAttribute("app-id", "a");
    document.body.appendChild(el);
    await tick();
    const core = env.created[0];
    const seen: Array<{ type: string; detail: unknown; bubbles: boolean; target: unknown }> = [];
    const onBody = (evt: Event) =>
      seen.push({
        type: evt.type,
        detail: (evt as globalThis.CustomEvent).detail,
        bubbles: evt.bubbles,
        target: evt.target
      });
    for (const type of MAPLAT_APP_EVENTS) document.body.addEventListener(type, onBody);
    core.dispatchEvent(new CoreEvent("mapChanged", { mapID: "m1" }));
    core.dispatchEvent(new GPSRequestEvent());
    core.dispatchEvent(
      new CoreEvent("lifecycle:core-ready", { phaseId: "core-ready", core, mapDivDocument: el })
    );
    core.dispatchEvent(new CoreEvent("notListed", {}));
    expect(seen).toEqual([
      { type: "mapChanged", detail: { mapID: "m1" }, bubbles: true, target: el },
      { type: "gps_request", detail: null, bubbles: true, target: el },
      // lifecycle の detail から内部の core・mapDivDocument を落とす（§3.5）
      { type: "lifecycle:core-ready", detail: { phaseId: "core-ready", appData: null }, bubbles: true, target: el }
    ]);
    // 破棄後は出し直さない
    el.remove();
    await tick();
    seen.length = 0;
    core.dispatchEvent(new CoreEvent("mapChanged", { mapID: "m2" }));
    expect(seen).toEqual([]);
    for (const type of MAPLAT_APP_EVENTS) document.body.removeEventListener(type, onBody);
  });

  it("要素のメソッドは MaplatApp へ引数と戻り値をそのまま委譲する", async () => {
    const el = document.createElement(env.tag) as MaplatAppElement;
    expect(() => el.addMarker({}, "main")).toThrow(/not created yet/);
    el.setAttribute("app-id", "a");
    document.body.appendChild(el);
    await tick();
    const core = env.created[0];
    core.resolveReady();
    await el.ready;
    const data = { lnglat: [141.15, 39.7] };
    expect(el.addMarker(data, "main")).toBe("main#1");
    expect(core.addMarker).toHaveBeenCalledWith(data, "main");
    for (const name of MAPLAT_APP_METHODS) {
      expect(typeof (el as any)[name]).toBe("function");
    }
  });
});

describe("MaplatApp の div に HTMLElement を渡す", () => {
  beforeEach(() => {
    // 設定の読み込みを止め、コンストラクタの同期部分だけを見る
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => undefined)));
  });

  it("要素をそのまま地図の箱にし、id 無しなら要素に id を付けずに接頭辞を作る", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    const app = new MaplatApp({ appid: "x", div: el });
    expect(app.mapDivDocument).toBe(el);
    expect(el.classList.contains("maplat")).toBe(true);
    expect(el.querySelector("#center_circle")).not.toBeNull();
    expect(el.id).toBe("");
    expect(app.mapDiv).toMatch(/^maplat_app_\d+$/);
    vi.unstubAllGlobals();
  });

  it("要素に id があればそれを接頭辞に使う。文字列の id は従来どおり", () => {
    const el = document.createElement("div");
    el.id = "my_map";
    document.body.appendChild(el);
    expect(new MaplatApp({ appid: "x", div: el }).mapDiv).toBe("my_map");
    const legacy = document.createElement("div");
    legacy.id = "map_div";
    document.body.appendChild(legacy);
    const app = new MaplatApp({ appid: "x" });
    expect(app.mapDiv).toBe("map_div");
    expect(app.mapDivDocument).toBe(legacy);
    const byId = document.createElement("div");
    byId.id = "other_div";
    document.body.appendChild(byId);
    expect(new MaplatApp({ appid: "x", div: "other_div" }).mapDivDocument).toBe(byId);
    vi.unstubAllGlobals();
  });
});

describe("<maplat-app> 設定のキー（§6）", () => {
  let env: ReturnType<typeof defineTestElement>;
  beforeEach(() => {
    env = defineTestElement();
  });
  const warnings = (warn: { mock: { calls: unknown[][] } }): string[] =>
    warn.mock.calls.map(c => String(c[0]));

  it("属性・プロパティ・appOption を §6.1 の優先順位で MaplatApp の option にまとめる", async () => {
    const el = document.createElement(env.tag) as MaplatAppElement;
    el.appOption = { appId: "fromOption", noRotate: true, enableCache: true, tapUiVanish: true, debug: true };
    el.setAttribute("no-rotate", "false"); // 属性 ＞ appOption（false も与えられた値）
    el.setAttribute("north-up", "north-up"); // 属性名と同じ値＝true
    el.setAttribute("home-margin-pixels", "0");
    el.setAttribute("overlay", "false");
    el.setAttribute("always-gps-on", "");
    el.googleApiKey = "key";
    el.poiTemplate = "<b>${name}</b>";
    document.body.appendChild(el);
    await tick();
    const opt = env.created[0].option;
    expect(opt.appid).toBe("fromOption");
    expect(opt.appId).toBeUndefined();
    expect(opt.tapUIVanish).toBe(true);
    expect(opt.noRotate).toBe(false);
    expect(opt.northUp).toBe(true);
    expect(opt.homeMarginPixels).toBe(0);
    expect(opt.overlay).toBe(false);
    expect(opt.alwaysGpsOn).toBe(true);
    expect(opt.enableCache).toBe(true);
    expect(opt.debug).toBe(true);
    expect(opt.googleApiKey).toBe("key");
    expect(opt.poiTemplate).toBe("<b>${name}</b>");
    // 与えていないキーは option に載せない（undefined で旧の既定値を潰さない）
    expect("fake" in opt).toBe(false);
    expect("restoreSession" in opt).toBe(false);
  });

  it("真偽属性は値で解釈する。無い＝未指定、不正な値は警告して未指定（§6.2.2）", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const el = document.createElement(env.tag) as MaplatAppElement;
    expect(el.northUp).toBeUndefined();
    el.setAttribute("north-up", "true");
    expect(el.northUp).toBe(true);
    el.setAttribute("north-up", "false");
    expect(el.northUp).toBe(false);
    el.setAttribute("north-up", "yes");
    expect(el.northUp).toBeUndefined();
    expect(warn).toHaveBeenCalledTimes(1);
    el.northUp = true;
    expect(el.getAttribute("north-up")).toBe("");
    el.northUp = false;
    expect(el.getAttribute("north-up")).toBe("false");
    el.northUp = undefined;
    expect(el.hasAttribute("north-up")).toBe(false);
    el.homeMarginPixels = 0;
    expect(el.getAttribute("home-margin-pixels")).toBe("0");
    expect(el.homeMarginPixels).toBe(0);
    warn.mockRestore();
  });

  it("app-src は設定ファイルの URL。setting が無ければそこから読む", async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ sources: ["a"] }) }));
    vi.stubGlobal("fetch", fetchMock);
    const el = document.createElement(env.tag) as MaplatAppElement;
    el.setAttribute("app-src", "conf/my.json");
    document.body.appendChild(el);
    await tick();
    expect(env.created.length).toBe(1);
    await expect(env.created[0].option.setting).resolves.toEqual({ sources: ["a"] });
    expect(fetchMock).toHaveBeenCalledWith("conf/my.json");
    vi.unstubAllGlobals();
  });

  it("setting プロパティだけでも作る（app-id 不要）", async () => {
    const el = document.createElement(env.tag) as MaplatAppElement;
    el.setting = { sources: [] };
    document.body.appendChild(el);
    await tick();
    expect(env.created.length).toBe(1);
    expect(env.created[0].option.setting).toEqual({ sources: [] });
  });

  it("起動時だけ効くキーは起動後に変更不可: 属性もプロパティも警告して無視、読み取りは起動時の値（U2）", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const hooks = { onUiReady: () => undefined };
    const el = document.createElement(env.tag) as MaplatAppElement;
    el.setAttribute("app-id", "a");
    el.setAttribute("enable-cache", "");
    el.uiHooks = hooks;
    document.body.appendChild(el);
    await tick();
    env.created[0].resolveReady();
    await el.ready;
    const startup = [
      ["appId", "z"], ["appSrc", "x.json"], ["noRotate", true], ["alwaysGpsOn", true], ["fake", true],
      ["enableCache", false], ["restoreSession", true], ["overlay", false],
      ["setting", { sources: [] }], ["restore", { mapID: "q" }], ["restoreExtensionKeys", ["k"]],
      ["googleApiKey", "k2"], ["mapboxToken", "t"], ["maplibregl", {}], ["mapboxgl", {}],
      ["uiHooks", {}], ["appOption", { appid: "q" }]
    ] as const;
    for (const [prop, value] of startup) {
      (el as any)[prop] = value;
      (el as any)[prop] = value; // 2 回目は警告しない
    }
    el.setAttribute("enable-cache", "false"); // 属性経由（同じキーは既に警告済み）
    el.setAttribute("fake", "true");
    await tick();
    expect(env.created.length).toBe(1);
    expect(el.appId).toBe("a");
    expect(el.enableCache).toBe(true);
    expect(el.uiHooks).toBe(hooks);
    expect(el.setting).toBeUndefined();
    const fixed = warnings(warn).filter(m => m.includes("fixed at startup"));
    expect(fixed.length).toBe(startup.length);
    // 属性は書き戻さない（属性の値は変わっても、効いている値は起動時のもの）
    expect(el.getAttribute("app-id")).toBe("a");
    expect(el.getAttribute("enable-cache")).toBe("false");
    warn.mockRestore();
  });

  it("外して破棄した後は、付け直した時点の属性で作る（起動時キーの固定は地図ごと）", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const el = document.createElement(env.tag) as MaplatAppElement;
    el.setAttribute("app-id", "a");
    document.body.appendChild(el);
    await tick();
    env.created[0].resolveReady();
    await el.ready;
    el.remove();
    await tick();
    el.setAttribute("app-id", "b");
    expect(el.appId).toBe("b");
    document.body.appendChild(el);
    await tick();
    expect(env.created.length).toBe(2);
    expect(env.created[1].option.appid).toBe("b");
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it("(ii) のキーは ready 後に地図へ反映し、外したら appOption ＞ 既定値に戻る", async () => {
    const el = document.createElement(env.tag) as MaplatAppElement;
    el.setAttribute("app-id", "a");
    el.appOption = { homeMarginPixels: 30 };
    document.body.appendChild(el);
    await tick();
    const core = env.created[0];
    el.northUp = true;
    el.homeMarginPixels = 0;
    await tick();
    expect(core.mapObject.northUp).toBe(false); // ready 前は保留
    core.resolveReady();
    await el.ready;
    await tick();
    expect(core.mapObject.northUp).toBe(true);
    expect(core.mapObject.homeMarginPixels).toBe(0);
    el.removeAttribute("north-up");
    el.removeAttribute("home-margin-pixels");
    await tick();
    expect(core.mapObject.northUp).toBe(false);
    expect(core.mapObject.homeMarginPixels).toBe(30);
  });

  it("テンプレート類・icon の変更はマーカーを描き直す。外したら設定ファイルの値に戻る", async () => {
    const el = document.createElement(env.tag) as MaplatAppElement;
    el.setAttribute("app-id", "a");
    document.body.appendChild(el);
    await tick();
    const core = env.created[0];
    core.appData = { poiTemplate: "<i>file</i>" };
    core.from = { mapID: "m" };
    core.resolveReady();
    await el.ready;
    el.poiTemplate = "<b>prop</b>";
    el.icon = "pin.png";
    await tick();
    expect(core.poiTemplate).toBe("<b>prop</b>");
    expect((core as any).icon).toBe("pin.png");
    expect(core.redrawMarkers).toHaveBeenCalledTimes(1);
    el.poiTemplate = undefined;
    await tick();
    expect(core.poiTemplate).toBe("<i>file</i>");
  });

  it("使えない map-id は警告して切り替えない", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const el = document.createElement(env.tag) as MaplatAppElement;
    el.setAttribute("app-id", "a");
    document.body.appendChild(el);
    await tick();
    const core = env.created[0];
    core.cacheHash = { osm: {} };
    core.resolveReady();
    await el.ready;
    el.mapId = "nothing";
    await tick();
    expect(core.changeMap).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledTimes(1);
    el.mapId = "osm";
    await tick();
    expect(core.changeMap).toHaveBeenCalledWith("osm");
    warn.mockRestore();
  });
});

describe("<maplat-app> 中心の目印（U5）", () => {
  let env: ReturnType<typeof defineTestElement>;
  beforeEach(() => {
    env = defineTestElement();
  });

  it("既定で表示。no-center-marker で消し、center-marker-src で画像を差し替え、外すと戻る", async () => {
    const el = document.createElement(env.tag) as MaplatAppElement;
    el.setAttribute("app-id", "a");
    el.setAttribute("no-center-marker", "");
    document.body.appendChild(el);
    await tick();
    const img = el.querySelector(".maplat-center-marker") as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img.hidden).toBe(true); // 作成直後（ready 前）から効く
    el.noCenterMarker = false;
    expect(img.hidden).toBe(false);
    el.centerMarkerSrc = "cross.svg";
    expect(img.getAttribute("src")).toBe("cross.svg");
    expect(img.classList.contains("maplat-center-marker--custom")).toBe(true);
    expect(img.style.transform).toBe("translate(-50%, -50%)");
    el.removeAttribute("center-marker-src");
    expect(img.getAttribute("src")).toBe("default.png");
    expect(img.classList.contains("maplat-center-marker--custom")).toBe(false);
    el.removeAttribute("no-center-marker");
    expect(img.hidden).toBe(false);
  });
});

describe("<maplat-app> 状態の読み取り・新設メソッド・イベントの変換（§3.3〜§3.6）", () => {
  let env: ReturnType<typeof defineTestElement>;
  beforeEach(() => {
    env = defineTestElement();
  });

  it("ready 前（作成中）に呼んだメソッドは ready を待ってから実行する", async () => {
    const el = document.createElement(env.tag) as MaplatAppElement;
    el.setAttribute("app-id", "a");
    document.body.appendChild(el);
    await tick();
    const core = env.created[0];
    const result = el.addMarker({ lnglat: [1, 2] }, "main") as unknown as Promise<string>;
    expect(core.addMarker).not.toHaveBeenCalled();
    core.resolveReady();
    await expect(result).resolves.toBe("main#1");
  });

  it("clientPointToLngLat は変換できないとき null（§3.8 A1）", async () => {
    const el = document.createElement(env.tag) as MaplatAppElement;
    el.setAttribute("app-id", "a");
    document.body.appendChild(el);
    await tick();
    env.created[0].resolveReady();
    await el.ready;
    await expect(el.clientPointToLngLat(1, 2)).resolves.toBeNull();
  });

  it("sourceLoaded の detail は { mapID, usable }[]（§3.8 A2）", async () => {
    const el = document.createElement(env.tag) as MaplatAppElement;
    el.setAttribute("app-id", "a");
    document.body.appendChild(el);
    await tick();
    const core = env.created[0];
    const a = { mapID: "a" };
    const b = { mapID: "b" };
    core.cacheHash = { a };
    let detail: unknown;
    el.addEventListener("sourceLoaded", e => (detail = (e as globalThis.CustomEvent).detail));
    core.dispatchEvent(new CoreEvent("sourceLoaded", [a, b]));
    expect(detail).toEqual([
      { mapID: "a", usable: true },
      { mapID: "b", usable: false }
    ]);
  });

  it("viewpoint・currentMapId・state・supports・implementation・version", async () => {
    const el = document.createElement(env.tag) as MaplatAppElement;
    expect(el.viewpoint).toBeNull();
    expect(el.currentMapId).toBeNull();
    expect(el.supports("tile-cache")).toBe(true);
    expect(el.supports("display-mode")).toBe(false);
    expect(el.supports("no-such-feature")).toBe(false);
    expect(el.implementation).toBe("core");
    expect(el.version).toBe(JSON.parse(readFileSync(resolve(__dirname, "../package.json"), "utf-8")).version);
    el.setAttribute("app-id", "a");
    document.body.appendChild(el);
    await tick();
    const core = env.created[0];
    core.from = { mapID: "m1" };
    (core as any).stateBuffer = { mapID: "m1", transparency: 0 };
    const vp = { x: 1, y: 2, longitude: 3, latitude: 4, mercator_x: 5, mercator_y: 6, zoom: 7, mercZoom: 8, direction: 9, rotation: 10 };
    core.dispatchEvent(new CoreEvent("changeViewpoint", vp));
    expect(el.viewpoint).toEqual(vp);
    expect(el.getViewpoint()).toEqual(vp);
    expect(el.currentMapId).toBe("m1");
    expect(el.state).toEqual({ mapID: "m1", transparency: 0 });
    expect(Object.isFrozen(el.state)).toBe(true);
  });

  it("gpsEnabled が変わったら gpsEnabledChanged を出す", async () => {
    const el = document.createElement(env.tag) as MaplatAppElement;
    el.setAttribute("app-id", "a");
    document.body.appendChild(el);
    await tick();
    const core = env.created[0];
    (core as any).handleGPS = vi.fn((on: boolean) => core.getGPSEnabled.mockReturnValue(on));
    core.resolveReady();
    await el.ready;
    const seen: unknown[] = [];
    el.addEventListener("gpsEnabledChanged", e => seen.push((e as globalThis.CustomEvent).detail));
    el.handleGPS(true);
    el.handleGPS(true);
    el.handleGPS(false);
    expect(seen).toEqual([{ enabled: true }, { enabled: false }]);
    expect(el.gpsEnabled).toBe(false);
  });
});
