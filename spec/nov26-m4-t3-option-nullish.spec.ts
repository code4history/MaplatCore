// nov26-m4-t3（#116）: prepareMap() の 8 キー（noRotate・poiTemplate・poiStyle・iconTemplate・
// northUp・tapDuration・homeMarginPixels・tapUIVanish）で、appOption／設定ファイルの false・0 が
// 「与えられた値」として設定ファイル・既定値に負けないこと。null は「与えていない」扱い。
// 前例: 試作 886884b の spec/wc-legacy-startup-feature-keys.spec.ts 166〜195 行の 3 件。
// 起動は jsdom で sources を空にして初期化を最後まで流す（div は master の流儀で id 文字列）。
import { describe, it, expect, beforeAll, afterEach } from "vitest";
import { MaplatApp } from "../src/index";

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

let seq = 0;
const elements: HTMLElement[] = [];

afterEach(() => {
  while (elements.length) elements.pop()!.remove();
});

async function boot(appOption: Record<string, any>, setting: Record<string, any>) {
  const el = document.createElement("div");
  el.id = `t3_${++seq}`;
  document.body.appendChild(el);
  elements.push(el);
  const app: any = new MaplatApp({ div: el.id, setting: { sources: [], ...setting }, ...appOption });
  await app.waitReady;
  return app;
}

describe("nov26-m4-t3: appOption／設定ファイルの 8 キーで false・0 が負けない（#116）", () => {
  it("false / 0 は与えられた値として設定ファイル・既定値に負けない", async () => {
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
    expect(app.poiStyle).toBe(false);
    expect(app.iconTemplate).toBe(false);
  });

  it("テンプレート 3 キー: オプションの false が設定の文字列に勝つ", async () => {
    const app = await boot(
      { poiTemplate: false, poiStyle: false, iconTemplate: false },
      { poiTemplate: "<b>${name}</b>", poiStyle: "s", iconTemplate: "<i></i>" }
    );
    expect(app.poiTemplate).toBe(false);
    expect(app.poiStyle).toBe(false);
    expect(app.iconTemplate).toBe(false);
  });

  it("テンプレート 3 キー: オプションの null は「与えていない」扱いで設定の値になる", async () => {
    const app = await boot(
      { poiTemplate: null, poiStyle: null, iconTemplate: null },
      { poiTemplate: "<b>${name}</b>", poiStyle: "s", iconTemplate: "<i></i>" }
    );
    expect(app.poiTemplate).toBe("<b>${name}</b>");
    expect(app.poiStyle).toBe("s");
    expect(app.iconTemplate).toBe("<i></i>");
  });
});
