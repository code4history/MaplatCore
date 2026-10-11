// 旧クラス MaplatApp の不具合修正（Web Components 仕様 §10.1 の人間の決定）:
//   U2      起動時だけ効くキーのフィールドは、起動後に外から代入されたら警告して無視する
//   U1 追補 設定ファイルの機能系キーは読み続けるが「メジャー版で廃止」を警告する（要素の経路では読まない）
//   §6.1    appOption.x || appData.x || 既定値 の false / 0 負けを undefined 判定へ直す
// 地図の実体は jsdom で作れる範囲（sources を空にして初期化を最後まで流す）で確かめる。
import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { MaplatApp, MAPLAT_APP_STARTUP_FIELDS } from "../src/index";

beforeAll(() => {
  // OL の Map は ResizeObserver を使う（jsdom には無い）
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

function makeDiv() {
  const el = document.createElement("div");
  document.body.appendChild(el);
  return el;
}

async function boot(appOption: Record<string, any>, setting: Record<string, any>) {
  const app = new MaplatApp({ div: makeDiv(), setting: { sources: [], ...setting }, ...appOption });
  await app.waitReady;
  return app;
}

const FEATURE_KEYS_IN_CORE = ["noRotate", "northUp", "tapDuration", "tapUIVanish", "homeMarginPixels", "controls"];

describe("MaplatApp: 起動時だけ効くフィールドは起動後に変更不可（U2）", () => {
  it("一覧は 13 個で、どれも getter を持つ", () => {
    expect([...MAPLAT_APP_STARTUP_FIELDS]).toEqual([
      "appid", "mapDiv", "mapDivDocument", "enableCache", "noRotate", "alwaysGpsOn", "overlay",
      "googleApiKey", "restoreSession", "initialRestore", "uiHooks", "fakeGps", "fakeRadius"
    ]);
    for (const name of MAPLAT_APP_STARTUP_FIELDS) {
      const desc = Object.getOwnPropertyDescriptor(MaplatApp.prototype, name)!;
      expect(typeof desc.get).toBe("function");
      expect(typeof desc.set).toBe("function");
    }
  });

  it("起動後の代入は例外にせず、警告して無視する（キーごとに 1 回）。読み取りは従来どおり", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const hooks = { onUiReady: vi.fn() };
    const restore = { mapID: "nothing", hideMarker: 1 };
    const app: any = await boot(
      {
        appid: "morioka",
        enableCache: false,
        noRotate: true,
        alwaysGpsOn: false,
        overlay: false,
        googleApiKey: "k",
        restoreSession: true,
        restore,
        uiHooks: hooks
      },
      {}
    );
    const before: Record<string, unknown> = {};
    for (const name of MAPLAT_APP_STARTUP_FIELDS) before[name] = app[name];
    expect(before.appid).toBe("morioka");
    expect(before.noRotate).toBe(true);
    expect(before.overlay).toBe(false);
    expect(before.googleApiKey).toBe("k");
    expect(before.restoreSession).toBe(true);
    expect(before.initialRestore).toEqual(restore);
    expect(before.uiHooks).toBe(hooks);
    expect(hooks.onUiReady).toHaveBeenCalledTimes(1);
    warn.mockClear();

    for (const name of MAPLAT_APP_STARTUP_FIELDS) {
      expect(() => {
        app[name] = "changed";
      }).not.toThrow();
      app[name] = "changed again";
    }
    for (const name of MAPLAT_APP_STARTUP_FIELDS) expect(app[name]).toBe(before[name]);
    expect(warn).toHaveBeenCalledTimes(MAPLAT_APP_STARTUP_FIELDS.length);
    for (const name of MAPLAT_APP_STARTUP_FIELDS) {
      expect(warn.mock.calls.some(c => String(c[0]).includes(`"${name}" is fixed at startup`))).toBe(true);
    }
  });

  it("警告はインスタンスごと（別のインスタンスでは改めて 1 回出る）", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const a: any = await boot({ appid: "a" }, {});
    const b: any = await boot({ appid: "b" }, {});
    a.appid = "x";
    b.appid = "y";
    expect(a.appid).toBe("a");
    expect(b.appid).toBe("b");
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it("Core 自身の起動中の書き込み（prepareMap の noRotate・initGeolocation の alwaysGpsOn）は効く", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const app = await boot({ noRotate: true, alwaysGpsOn: true }, {});
    expect(app.noRotate).toBe(true);
    expect(app.alwaysGpsOn).toBe(true);
    expect(warn.mock.calls.some(c => String(c[0]).includes("is fixed at startup"))).toBe(false);
  });

  it("コンストラクタを通らない検査用の殻（Object.create）には今までどおり書ける", () => {
    const stub: any = Object.create(MaplatApp.prototype);
    stub.uiHooks = { onUiReady: () => 1 };
    stub.initialRestore = { mapID: "m" };
    expect(stub.uiHooks.onUiReady()).toBe(1);
    expect(stub.initialRestore).toEqual({ mapID: "m" });
  });

  it("overlay: undefined を渡しても既定の true（undefined 判定）", async () => {
    const app = await boot({ overlay: undefined }, {});
    expect(app.overlay).toBe(true);
    expect(app.backMap).toBeTruthy();
  });
});

describe("MaplatApp: 設定ファイルの機能系キー（U1 追補）と undefined 判定（§6.1）", () => {
  it("設定ファイルの機能系キーは読み続け、キーごとに 1 回「メジャー版で廃止」を警告する", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const app = await boot(
      {},
      { noRotate: true, northUp: true, tapDuration: 1000, tapUIVanish: true, homeMarginPixels: 10, controls: [] }
    );
    expect(app.noRotate).toBe(true);
    expect(app.mapObject.northUp).toBe(true);
    expect(app.mapObject.tapDuration).toBe(1000);
    expect(app.mapObject.tapUIVanish).toBe(true);
    expect(app.mapObject.homeMarginPixels).toBe(10);
    const deprecations = warn.mock.calls.map(c => String(c[0])).filter(m => m.includes("deprecated"));
    for (const key of FEATURE_KEYS_IN_CORE) {
      expect(deprecations.filter(m => m.includes(`"${key}"`)).length).toBe(1);
    }
    expect(deprecations.length).toBe(FEATURE_KEYS_IN_CORE.length);
  });

  it("appOption で与えたキーは設定ファイルを読まないので警告しない", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    await boot({ northUp: true }, { northUp: false });
    expect(warn.mock.calls.some(c => String(c[0]).includes("deprecated"))).toBe(false);
  });

  it("テンプレート類はコンテンツ側として今までどおり設定ファイルから読み、警告しない", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const app = await boot(
      {},
      { poiTemplate: "<b>${name}</b>", poiStyle: "s", iconTemplate: "<i></i>" }
    );
    expect(app.poiTemplate).toBe("<b>${name}</b>");
    expect(app.poiStyle).toBe("s");
    expect(app.iconTemplate).toBe("<i></i>");
    expect(warn.mock.calls.some(c => String(c[0]).includes("deprecated"))).toBe(false);
  });

  it("false / 0 は与えられた値として設定ファイル・既定値に負けない", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const app = await boot(
      { northUp: false, noRotate: false, tapDuration: 0, homeMarginPixels: 0, tapUIVanish: false },
      { northUp: true, noRotate: true, tapDuration: 5000, homeMarginPixels: 99, tapUIVanish: true }
    );
    expect(app.mapObject.northUp).toBe(false);
    expect(app.noRotate).toBe(false);
    expect(app.mapObject.tapDuration).toBe(0);
    expect(app.mapObject.homeMarginPixels).toBe(0);
    expect(app.mapObject.tapUIVanish).toBe(false);
  });

  it("設定ファイルの 0 も既定値に負けない", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const app = await boot({}, { tapDuration: 0, homeMarginPixels: 0 });
    expect(app.mapObject.tapDuration).toBe(0);
    expect(app.mapObject.homeMarginPixels).toBe(0);
  });

  it("どこにも無ければ既定値（tapDuration 3000・homeMarginPixels 50・その他 false）", async () => {
    const app = await boot({}, {});
    expect(app.mapObject.tapDuration).toBe(3000);
    expect(app.mapObject.homeMarginPixels).toBe(50);
    expect(app.mapObject.northUp).toBe(false);
    expect(app.mapObject.tapUIVanish).toBe(false);
    expect(app.noRotate).toBe(false);
    expect(app.poiTemplate).toBe(false);
  });

  it("要素の経路（__maplatElementMode）では設定ファイルの機能系キーを読まない（無視の旨を 1 回警告）", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const app = await boot(
      { __maplatElementMode: true, homeMarginPixels: 20 },
      {
        noRotate: true, northUp: true, tapDuration: 1000, tapUIVanish: true, homeMarginPixels: 10,
        controls: [{ fake: "control" }], poiTemplate: "<b>t</b>"
      }
    );
    expect(app.noRotate).toBe(false);
    expect(app.mapObject.northUp).toBe(false);
    expect(app.mapObject.tapDuration).toBe(3000);
    expect(app.mapObject.tapUIVanish).toBe(false);
    // 個別に与えた値は効く
    expect(app.mapObject.homeMarginPixels).toBe(20);
    expect(app.mapObject.getControls().getLength()).toBe(0);
    // テンプレート類は要素の経路でも設定ファイルから読む
    expect(app.poiTemplate).toBe("<b>t</b>");
    const messages = warn.mock.calls.map(c => String(c[0]));
    expect(messages.some(m => m.includes("deprecated"))).toBe(false);
    const ignored = messages.filter(m => m.includes("is ignored"));
    expect(ignored.length).toBe(5); // homeMarginPixels は appOption で与えたので読みに行かない
  });

  it("要素の経路の map-id・transparency は restore・localStorage より強い（__restoreOverride）", async () => {
    const restore = { mapID: "a", transparency: 10, position: { x: 1, y: 2, zoom: 3, rotation: 0 } };
    const app = await boot({ restore, __restoreOverride: { mapID: "b", transparency: 40 } }, {});
    expect(app.initialRestore).toEqual({ mapID: "b", transparency: 40 });
    // 渡した restore 自体は書き換えない
    expect(restore.mapID).toBe("a");
    const same = await boot({ restore, __restoreOverride: { mapID: "a" } }, {});
    expect(same.initialRestore.position).toEqual(restore.position);
  });

  it("中心の目印は既定で表示し、class maplat-center-marker を持つ（U5）", async () => {
    const app = await boot({}, {});
    const img = app.mapDivDocument!.querySelector("#center_circle") as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img.classList.contains("maplat-center-marker")).toBe(true);
    expect(img.hidden).toBe(false);
  });
});
