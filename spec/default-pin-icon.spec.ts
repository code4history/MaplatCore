// defaultPinIcon（src/index.ts のモジュール関数）の検査。
// 「選択中なら defaultpin_selected、そうでなければ defaultpin」の分岐を Core の 1 か所に置く。
// 要素の getDefaultPinIcon と旧クラスの setMarker の既定の画像が同じ関数を読む。
import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { MaplatApp, assets, defaultPinIcon } from "../src/index";

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

function makeDiv() {
  const el = document.createElement("div");
  document.body.appendChild(el);
  return el;
}

describe("defaultPinIcon", () => {
  it("選択中は defaultpin_selected、そうでなければ defaultpin（assets と同じ画像）", () => {
    expect(defaultPinIcon(true)).toBe(assets.defaultpin_selected);
    expect(defaultPinIcon(false)).toBe(assets.defaultpin);
    expect(defaultPinIcon()).toBe(assets.defaultpin);
    expect(defaultPinIcon(true)).not.toBe(defaultPinIcon(false));
  });

  it("icon の無い POI を描くと既定のピンを使う（旧クラスの setMarker・jsdom）", async () => {
    const app = new MaplatApp({ div: makeDiv(), setting: { sources: [] } });
    await app.waitReady;
    // 地図の実体（OL）は使わず、連鎖の出口だけを見る
    (app as any).from = {
      mapID: "m",
      merc2SysCoordAsync_ignoreBackground: async (m: number[]) => m,
      insideCheckSysCoord: () => true
    };
    const setMarker = vi.spyOn(app.mapObject, "setMarker").mockImplementation(() => undefined as any);

    await app.setMarker({ lnglat: [139.7, 35.7], namespaceID: "poi#1" });
    expect(setMarker).toHaveBeenCalledTimes(1);
    expect(setMarker.mock.calls[0][2]).toBe(assets.defaultpin);

    (app as any).__selectedMarker = "poi#1";
    await app.setMarker({ lnglat: [139.7, 35.7], namespaceID: "poi#1" });
    expect(setMarker).toHaveBeenCalledTimes(2);
    expect(setMarker.mock.calls[1][2]).toBe(assets.defaultpin_selected);

    // icon があればそちらを使う（既定の分岐に入らない）
    await app.setMarker({ lnglat: [139.7, 35.7], namespaceID: "poi#1", icon: "pin.png" });
    expect(setMarker.mock.calls[2][2]).toBe("pin.png");
  });
});
