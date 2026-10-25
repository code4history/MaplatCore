// 要素（<maplat-app>）と**実物の** MaplatApp を組み合わせた検査。
//   中心の目印の DOM の効果（FakeCore のテストから移す）
//   起動後に外したときに appOption の値へ戻る（Core に控えを足さずに成り立つこと）
//   remove() の後始末（前面・背面の target・MapLibre の地図）
//   uiHooks の context.core / context.mapDivDocument（要素経路は要素・旧クラス経路は MaplatApp）
// 地図の実体（OL）は sources を空にして jsdom で起動する（spec/wc-legacy-startup-feature-keys.spec.ts の boot と同じ作り方）。
import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { MaplatApp, assets } from "../src/index";
import "../src/element"; // 副作用で maplat-app を登録する

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

afterEach(async () => {
  document.querySelectorAll("maplat-app").forEach(el => el.remove());
  await tick();
  vi.restoreAllMocks();
});

function makeDiv() {
  const el = document.createElement("div");
  document.body.appendChild(el);
  return el;
}

async function bootApp(appOption: Record<string, any>, setting: Record<string, any> = {}) {
  const app = new MaplatApp({ div: makeDiv(), setting: { sources: [], ...setting }, ...appOption });
  await app.waitReady;
  return app;
}

async function bootElement(setup: (el: any) => void = () => undefined) {
  const el = document.createElement("maplat-app") as any;
  el.setAttribute("app-id", "a");
  el.appOption = { setting: { sources: [] } };
  setup(el);
  document.body.appendChild(el);
  await el.ready;
  return el;
}

describe("中心の目印は実物の Core が当てる", () => {
  it("既定で表示・no-center-marker で消え・center-marker-src で差し替え・外すと戻る", async () => {
    const el = await bootElement(e => e.setAttribute("no-center-marker", ""));
    const img = el.querySelector("img.maplat-center-marker") as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img.id).toBe("center_circle");
    expect(img.hidden).toBe(true);
    expect(img.style.display).toBe("none");

    el.noCenterMarker = false;
    expect(img.hidden).toBe(false);
    expect(img.style.display).toBe("");

    el.centerMarkerSrc = "cross.svg";
    expect(img.getAttribute("src")).toBe("cross.svg");
    expect(img.classList.contains("maplat-center-marker--custom")).toBe(true);
    expect(img.style.transform).toBe("translate(-50%, -50%)");
    expect(img.style.marginTop).toBe("0px");

    el.removeAttribute("center-marker-src");
    expect(img.getAttribute("src")).toBe(assets.redcircle);
    expect(img.classList.contains("maplat-center-marker--custom")).toBe(false);
    expect(img.style.transform).toBe("");
    expect(img.style.marginTop).toBe("-10px");
    expect(img.style.marginLeft).toBe("-10px");
  });

  it("何も指定しなければ既定の画像と余白（setCenterMarker を呼ばない場合と同じ）", async () => {
    const el = await bootElement();
    const img = el.querySelector("img.maplat-center-marker") as HTMLImageElement;
    expect(img.getAttribute("src")).toBe(assets.redcircle);
    expect(img.hidden).toBe(false);
    expect(img.style.marginTop).toBe("-10px");
    expect(img.classList.contains("maplat-center-marker--custom")).toBe(false);
  });

  it("Core の setCenterMarker 単体: hidden・src・戻しの 3 通り", async () => {
    const app = await bootApp({});
    const img = app.mapDivDocument!.querySelector("img.maplat-center-marker") as HTMLImageElement;
    app.setCenterMarker({ hidden: true });
    expect(img.hidden).toBe(true);
    app.setCenterMarker({ src: "x.svg" });
    expect(img.hidden).toBe(false);
    expect(img.getAttribute("src")).toBe("x.svg");
    app.setCenterMarker({});
    expect(img.getAttribute("src")).toBe(assets.redcircle);
  });
});

describe("起動後の反映（Core の applyRuntimeOptions）", () => {
  it("undefined は既定に戻る（起動時の属性値 true に戻らない。テスト 1）", async () => {
    const app = await bootApp({ __maplatElementMode: true, northUp: true });
    expect(app.mapObject.northUp).toBe(true);
    app.applyRuntimeOptions({ northUp: undefined });
    expect(app.mapObject.northUp).toBe(false);
  });

  it("undefined は設定ファイルのテンプレート値に戻る（テスト 2）", async () => {
    const app = await bootApp({ __maplatElementMode: true }, { poiTemplate: "<i>file</i>" });
    app.poiTemplate = "<b>prop</b>";
    app.applyRuntimeOptions({ poiTemplate: undefined });
    expect(app.poiTemplate).toBe("<i>file</i>");
  });

  it("homeMarginPixels の undefined は RUNTIME_DEFAULTS の 50（30 ではない）", async () => {
    const app = await bootApp({ __maplatElementMode: true, homeMarginPixels: 30 });
    expect(app.mapObject.homeMarginPixels).toBe(30);
    app.applyRuntimeOptions({ homeMarginPixels: undefined });
    expect(app.mapObject.homeMarginPixels).toBe(50);
  });

  it("icon・テンプレート・debug を当て、マーカーの描き直しは 1 回だけ", async () => {
    const app = await bootApp({});
    app.from = { mapID: "m" } as any;
    app.redrawMarkers = vi.fn();
    app.applyRuntimeOptions({ icon: "pin.png", poiTemplate: "<b>x</b>", debug: true });
    expect(app.icon).toBe("pin.png");
    expect(app.poiTemplate).toBe("<b>x</b>");
    expect(app.logger.level).toBe(-99); // LOGGER_LEVEL.ALL
    expect(app.redrawMarkers).toHaveBeenCalledTimes(1);
    app.applyRuntimeOptions({ debug: undefined, northUp: true });
    expect(app.logger.level).toBe(0); // LOGGER_LEVEL.INFO（既定）
    expect(app.mapObject.northUp).toBe(true);
    expect(app.redrawMarkers).toHaveBeenCalledTimes(1); // icon・テンプレートが来なければ描き直さない
  });

  it("要素で外すと appOption の 30 に戻る（実物。「要素と実 MaplatApp」）", async () => {
    const el = await bootElement(e => {
      e.appOption = { setting: { sources: [] }, homeMarginPixels: 30 };
    });
    const app = el.app as MaplatApp;
    expect(app.mapObject.homeMarginPixels).toBe(30);
    el.homeMarginPixels = 0;
    await tick();
    expect(app.mapObject.homeMarginPixels).toBe(0);
    el.removeAttribute("home-margin-pixels");
    await tick();
    expect(app.mapObject.homeMarginPixels).toBe(30);
  });
});

describe("remove() の後始末", () => {
  it("前面・背面の target を外し、MapLibre の地図も消す", async () => {
    const app = await bootApp({});
    const front = app.mapObject;
    const back = app.backMap!;
    const frontTarget = makeDiv();
    const backTarget = makeDiv();
    front.setTarget(frontTarget);
    back.setTarget(backTarget);
    expect(front.getTarget()).toBe(frontTarget);
    expect(back.getTarget()).toBe(backTarget);
    const remove = vi.fn();
    (app as any).maplibreMap = { remove };

    app.remove();
    expect(front.getTarget()).toBeUndefined();
    expect(back.getTarget()).toBeUndefined();
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it("背面・MapLibre が無くても例外にしない", async () => {
    const app = await bootApp({ overlay: false });
    expect(app.backMap).toBeUndefined();
    expect(() => app.remove()).not.toThrow();
  });

  it("要素の破棄でも Core の remove が 1 回だけ呼ばれる（後始末は Core が持つ）", async () => {
    const el = await bootElement();
    const app = el.app as MaplatApp;
    const remove = vi.spyOn(app, "remove");
    const front = app.mapObject;
    el.remove();
    await tick();
    expect(remove).toHaveBeenCalledTimes(1);
    expect(front.getTarget()).toBeUndefined();
    expect(el.app).toBeNull();
  });
});

describe("uiHooks の context.core は要素", () => {
  it("要素の uiHooks プロパティ: core も mapDivDocument も要素・元の hook は書き換えない・this は元のオブジェクト", async () => {
    const seen: any[] = [];
    const thisMatches: boolean[] = [];
    const hooks = {
      onUiReady(context: any) {
        // 写しを渡しても、フックの this は元のオブジェクト（fn.call(hooks, …) で呼ぶため）
        thisMatches.push((this as any) === hooks);
        seen.push(context);
        return "ok";
      }
    };
    const originalHook = hooks.onUiReady;
    const el = await bootElement(e => {
      e.uiHooks = hooks;
    });
    expect(seen).toHaveLength(1);
    expect(seen[0].core).toBe(el);
    expect(seen[0].mapDivDocument).toBe(el);
    expect(seen[0].phaseId).toBe("ui-ready");
    expect(thisMatches).toEqual([true]);
    expect(Object.keys(hooks)).toEqual(["onUiReady"]);
    expect(hooks.onUiReady).toBe(originalHook); // 写しを渡しても元の関数はそのまま
  });

  it("appOption プロパティの中の uiHooks も包む", async () => {
    const seen: any[] = [];
    const hooks = { onUiReady: (context: any) => seen.push(context) };
    const el = await bootElement(e => {
      e.appOption = { setting: { sources: [] }, uiHooks: hooks };
    });
    expect(seen).toHaveLength(1);
    expect(seen[0].core).toBe(el);
    expect(seen[0].mapDivDocument).toBe(el);
  });

  it("旧クラスの経路は context.core が MaplatApp のまま", async () => {
    const seen: any[] = [];
    const hooks = { onUiReady: (context: any) => seen.push(context) };
    const app = await bootApp({ uiHooks: hooks });
    expect(seen).toHaveLength(1);
    expect(seen[0].core).toBe(app);
    expect(seen[0].mapDivDocument).toBe(app.mapDivDocument);
  });

  it("クラスのインスタンスの hook（プロトタイプ上のもの）も呼ばれる", async () => {
    class Hooks {
      seen: any[] = [];
      onUiReady(context: any) {
        this.seen.push(context);
        return "ok";
      }
    }
    const hooks = new Hooks();
    const el = await bootElement(e => {
      e.uiHooks = hooks;
    });
    expect(hooks.seen).toHaveLength(1);
    expect(hooks.seen[0].core).toBe(el);
    expect(hooks.seen[0].mapDivDocument).toBe(el);
  });
});

describe("互換モード（__maplatCompat。旧クラス互換層のための口）", () => {
  it("互換モードでは設定ファイルの機能系キーと fakeGps/fakeRadius を旧クラスと同じく読み、廃止警告を出す", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const el = await bootElement(e => {
      e.appOption = { setting: { sources: [] }, __maplatCompat: true, fake: true };
      e.setting = { sources: [], northUp: true, noRotate: true, fakeGps: [139, 35], fakeRadius: 30 };
    });
    const app = el.app as MaplatApp;
    expect(app.mapObject.northUp).toBe(true);
    expect(app.noRotate).toBe(true);
    expect(app.fakeGps).toEqual([139, 35]);
    expect(app.fakeRadius).toBe(30);
    const messages = warn.mock.calls.map(c => String(c[0]));
    expect(
      messages.some(m =>
        m.includes('MaplatApp: reading the feature key "northUp" from the setting file is deprecated')
      )
    ).toBe(true);
    expect(messages.some(m => m.includes('MaplatApp: reading the feature key "noRotate"'))).toBe(true);
  });

  it("通常モードでは設定ファイルの機能系キーを読まず、旧クラスの廃止警告も出さない", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const el = await bootElement(e => {
      e.setting = { sources: [], northUp: true, noRotate: true };
    });
    const app = el.app as MaplatApp;
    expect(app.mapObject.northUp).toBe(false);
    expect(app.noRotate).toBe(false);
    const messages = warn.mock.calls.map(c => String(c[0]));
    expect(messages.some(m => m.includes("deprecated"))).toBe(false);
    expect(messages.some(m => m.includes('"northUp"') && m.includes("is ignored"))).toBe(true);
  });

  it("互換モードでは機能系キーの getter が Core の実際の値（設定ファイルの値を含む）を返す", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const el = await bootElement(e => {
      e.appOption = { setting: { sources: [] }, __maplatCompat: true };
      e.setting = { sources: [], northUp: true, noRotate: true };
    });
    // <maplat-ui> のコンパスは this.#app?.northUp を読む。地図とコンパスを食い違わせない
    expect((el.app as MaplatApp).mapObject.northUp).toBe(true);
    expect(el.northUp).toBe(true);
    expect(el.noRotate).toBe(true);
  });

  it("通常モードの getter は今までどおり属性・起動時の値を返す（実装の値に差し替えない）", async () => {
    const el = await bootElement();
    const app = el.app as MaplatApp;
    expect(app.mapObject.northUp).toBe(false);
    expect(el.northUp).toBeUndefined(); // 属性もプロパティも与えていない
    el.northUp = true;
    await tick();
    expect(app.mapObject.northUp).toBe(true);
    expect(el.northUp).toBe(true);
  });
});

describe("中心の目印は ready 前", () => {
  it("no-center-marker は ready が決着する前に img へ当たる", async () => {
    const el = document.createElement("maplat-app") as any;
    el.setAttribute("app-id", "a");
    el.appOption = { setting: { sources: [] } };
    el.setAttribute("no-center-marker", "");
    document.body.appendChild(el);
    let settled = false;
    el.ready.then(
      () => {
        settled = true;
      },
      () => {
        settled = true;
      }
    );
    // setTimeout を待たず、マイクロタスクだけを上限付きで回して img が出るのを待つ
    // （要素の作成は接続の拍のマイクロタスク 2 つ先。ready は fetch 等を挟むので、ここでは決着しない）
    let img: HTMLImageElement | null = null;
    for (let i = 0; i < 20 && !img; i++) {
      await Promise.resolve();
      img = el.querySelector("img.maplat-center-marker");
    }
    expect(img).not.toBeNull();
    expect(settled).toBe(false);
    expect(img!.hidden).toBe(true);
    await el.ready;
    expect(settled).toBe(true);
  });
});

describe("互換モードの機能系キーと属性", () => {
  it("設定ファイルの northUp: true を属性 north-up=\"false\" で打ち消し、Core の実値と getter が一致する", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const el = document.createElement("maplat-app") as any;
    el.setAttribute("app-id", "a");
    el.setAttribute("north-up", "false");
    el.appOption = { setting: { sources: [] }, __maplatCompat: true };
    el.setting = { sources: [], northUp: true };
    document.body.appendChild(el);
    // 作る前の getter は属性の値
    expect(el.northUp).toBe(false);
    // 作った後・ready 前（img が出た時点）でも属性の値（実装の値は ready までは読まない。I-c2）
    let img: HTMLImageElement | null = null;
    for (let i = 0; i < 20 && !img; i++) {
      await Promise.resolve();
      img = el.querySelector("img.maplat-center-marker");
    }
    expect(img).not.toBeNull();
    expect(el.app).not.toBeNull();
    expect(el.northUp).toBe(false);
    await el.ready;
    const app = el.app as MaplatApp;
    expect(app.mapObject.northUp).toBe(false);
    expect(el.northUp).toBe(false);
  });

  it("互換モードの実値の読み口は northUp・homeMarginPixels・noRotate だけ（tapDuration・tapUIVanish は <maplat-ui> のキー）", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const el = await bootElement(e => {
      e.appOption = { setting: { sources: [] }, __maplatCompat: true };
      e.setting = { sources: [], northUp: true, homeMarginPixels: 70, tapDuration: 1234, tapUIVanish: true };
    });
    const app = el.app as MaplatApp;
    // 旧クラスは読む（互換モード）
    expect(app.mapObject.tapDuration).toBe(1234);
    expect(app.mapObject.tapUIVanish).toBe(true);
    // 要素の読み口には無い（要素の属性・プロパティの表に無いキー）
    const read = (prop: string) => el.implementationKeyValue(prop, app);
    expect(read("northUp")).toEqual({ value: true });
    expect(read("homeMarginPixels")).toEqual({ value: 70 });
    expect(read("noRotate")).toEqual({ value: false });
    expect(read("tapDuration")).toBeUndefined();
    expect(read("tapUIVanish")).toBeUndefined();
    expect(el.tapDuration).toBeUndefined();
    expect(el.tapUIVanish).toBeUndefined();
  });
});

describe("uiHooks の写しは Object.prototype の名前の自作キーも落とさない（Info 1）", () => {
  it("constructor・toString という名前のキーも写され、hook の context.core は要素", async () => {
    const seen: any[] = [];
    const hooks: Record<string, any> = {
      onUiReady: (context: any) => seen.push(context),
      constructor: "mine",
      toString: () => "custom"
    };
    const el = await bootElement(e => {
      e.uiHooks = hooks;
    });
    expect(seen).toHaveLength(1);
    expect(seen[0].core).toBe(el);
    // 写しは MaplatApp の uiHooks に渡る（元のオブジェクトではなく、自作キーを保った写し）
    const passed = (el.app as any).uiHooks as Record<string, any>;
    expect(passed).not.toBe(hooks);
    expect(Object.prototype.hasOwnProperty.call(passed, "constructor")).toBe(true);
    expect(passed.constructor).toBe("mine");
    expect(Object.prototype.hasOwnProperty.call(passed, "toString")).toBe(true);
    expect(typeof passed.toString).toBe("function");
    expect((passed.toString as () => string).call(passed)).toBe("custom");
    expect(Object.keys(passed)).toEqual(expect.arrayContaining(["onUiReady", "constructor", "toString"]));
    expect(Object.keys(passed).filter(k => k === "onUiReady")).toHaveLength(1);
  });

  it("自前のキー __proto__ は写さず、写しのプロトタイプを差し替えない（I-c1）", async () => {
    const seen: any[] = [];
    const hooks: Record<string, any> = { onUiReady: (context: any) => seen.push(context) };
    Object.defineProperty(hooks, "__proto__", { value: { injected: true }, enumerable: true, configurable: true });
    const el = await bootElement(e => {
      e.uiHooks = hooks;
    });
    expect(seen).toHaveLength(1);
    const passed = (el.app as any).uiHooks as Record<string, any>;
    expect(Object.getPrototypeOf(passed)).toBe(Object.prototype);
    expect((passed as any).injected).toBeUndefined();
    expect(Object.keys(passed)).not.toContain("__proto__");
  });
});
