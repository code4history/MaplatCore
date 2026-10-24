// 旧クラス MaplatApp の不具合修正（Web Components 仕様 §10.1 の人間の決定）:
//   U2      起動時だけ効くキーのフィールドは、起動後に外から代入されたら警告して無視する
//   U1 追補 設定ファイルの機能系キーは読み続けるが「メジャー版で廃止」を警告する（要素の経路では読まない）
//   §6.1    appOption.x || appData.x || 既定値 の false / 0 負けを undefined 判定へ直す
// 地図の実体は jsdom で作れる範囲（sources を空にして初期化を最後まで流す）で確かめる。
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from "vitest";
import { MaplatApp, MAPLAT_APP_STARTUP_FIELDS } from "../src/index";
// 「1 回だけ」の記憶をテストの間で初期化する口（公開面ではない。@internal）
import { resetMaplatAppDeprecationWarning } from "../src/functions";
import "../src/element"; // 副作用で <maplat-app> を登録する（要素の経路の検査に使う）

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
    // クラス自体の非推奨の告知（1 回だけ）が混ざらないよう、起動時に固まる項目の警告だけを数える
    const fixed = warn.mock.calls.filter(c => String(c[0]).includes("is fixed at startup"));
    expect(fixed.length).toBe(MAPLAT_APP_STARTUP_FIELDS.length);
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
    expect(warn.mock.calls.filter(c => String(c[0]).includes("is fixed at startup")).length).toBe(2);
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
    // クラス自体の非推奨の告知（release-policy §9.1）も "deprecated" を含むので、
    // 設定ファイルの機能系キーの警告だけを「reading the feature key」で数える
    const deprecations = warn.mock.calls
      .map(c => String(c[0]))
      .filter(m => m.includes("reading the feature key"));
    for (const key of FEATURE_KEYS_IN_CORE) {
      expect(deprecations.filter(m => m.includes(`"${key}"`)).length).toBe(1);
    }
    expect(deprecations.length).toBe(FEATURE_KEYS_IN_CORE.length);
  });

  it("appOption で与えたキーは設定ファイルを読まないので警告しない", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    await boot({ northUp: true }, { northUp: false });
    expect(warn.mock.calls.some(c => String(c[0]).includes("reading the feature key"))).toBe(false);
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
    expect(warn.mock.calls.some(c => String(c[0]).includes("reading the feature key"))).toBe(false);
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

// release-policy §9.1 手順 1 の 2 点目「実行時に 1 回だけ警告を出す」の検査。
//   文言は英語（人間の決定）。粒度は**同一プロセスで 1 回**（インスタンスごとではない）。
//   要素（<maplat-app>）の経路は内部で MaplatApp を作るので警告しない。旧 UI API の互換層
//   （MaplatUI）も <maplat-app> を経由するので同じ。見分けは option の内部キー
//   "__maplatElementMode" の有無（値ではない。src/index.ts のコンストラクタを参照）。
describe("MaplatApp の非推奨の告知（release-policy §9.1 手順 1）", () => {
  const DEPRECATION_MESSAGE =
    "MaplatApp: the MaplatApp class is deprecated and will be removed in 2.0. " +
    "Use the <maplat-app> element (@maplat/core/element) instead.";

  // どのテストも「まだ 1 度も警告していない」状態から始める（記憶はモジュール水準なので明示的に戻す）
  beforeEach(() => {
    resetMaplatAppDeprecationWarning();
  });

  afterEach(() => {
    document.querySelectorAll("maplat-app").forEach(el => el.remove());
    resetMaplatAppDeprecationWarning();
  });

  const said = (warn: { mock: { calls: unknown[][] } }) =>
    warn.mock.calls.map(c => String(c[0])).filter(m => m === DEPRECATION_MESSAGE);

  it("直接 new すると 1 回だけ警告する。2 つ作っても 1 回（同一プロセスで重複させない）", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    await boot({}, {});
    await boot({}, {});
    expect(said(warn)).toEqual([DEPRECATION_MESSAGE]);
  });

  it("要素の経路（通常モード）では警告しない。内部で実物の MaplatApp を作っている", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const el: any = document.createElement("maplat-app");
    el.appOption = { setting: { sources: [] } };
    document.body.appendChild(el);
    await el.ready;
    expect(el.app).toBeInstanceOf(MaplatApp); // 警告しない理由が「作っていないから」ではないこと
    expect(said(warn)).toEqual([]);
  });

  it("要素の経路（旧 UI API の互換層＝互換モード。__maplatElementMode は false）でも警告しない", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const el: any = document.createElement("maplat-app");
    el.appOption = { setting: { sources: [] }, __maplatCompat: true };
    document.body.appendChild(el);
    await el.ready;
    expect(el.app).toBeInstanceOf(MaplatApp);
    expect(said(warn)).toEqual([]);
  });

  it("要素の経路は「1 回だけ」の記憶を使わない（要素の後に直接 new すると 1 回出る）", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const el: any = document.createElement("maplat-app");
    el.appOption = { setting: { sources: [] } };
    document.body.appendChild(el);
    await el.ready;
    expect(said(warn)).toEqual([]);
    await boot({}, {});
    expect(said(warn)).toEqual([DEPRECATION_MESSAGE]);
  });

  it("MaplatApp.createObject から作っても 1 回だけ警告する", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const app = await MaplatApp.createObject({ div: makeDiv(), setting: { sources: [] } });
    expect(app).toBeInstanceOf(MaplatApp);
    expect(said(warn)).toEqual([DEPRECATION_MESSAGE]);
  });
});
