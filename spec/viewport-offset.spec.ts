// 前面と背面の viewport のずれを取っておく処理（src/viewport_offset.ts）の検査。
//   - 連続するポインタの移動で getBoundingClientRect を呼ばない
//   - 大きさの変化（ResizeObserver・change:size）と pointerenter の後は測り直した値を使う
//   - クリックと clientPointToLngLat は毎回測り、その値を取っておく
// ResizeObserver は jsdom に無いので、呼び出しを外から起こせる偽物に差し替える。
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { ViewportOffsetCache } from "../src/viewport_offset";
import { MaplatApp } from "../src/index";

const observers: FakeResizeObserver[] = [];
class FakeResizeObserver {
  callback: () => void;
  targets: Element[] = [];
  disconnected = false;
  constructor(callback: () => void) {
    this.callback = callback;
    observers.push(this);
  }
  observe(el: Element) {
    this.targets.push(el);
  }
  unobserve = () => undefined;
  disconnect() {
    this.disconnected = true;
  }
}
/** el を見張っている偽の ResizeObserver をすべて呼ぶ（ブラウザが大きさの変化を知らせたのと同じ）。 */
function fireResize(el: Element) {
  for (const o of observers) if (!o.disconnected && o.targets.includes(el)) o.callback();
}

let savedRO: any;
beforeAll(() => {
  savedRO = (globalThis as any).ResizeObserver;
  (globalThis as any).ResizeObserver = FakeResizeObserver;
});
afterAll(() => {
  (globalThis as any).ResizeObserver = savedRO;
});

/** 左上を差し替えられる viewport と、getBoundingClientRect の呼び出しの記録。 */
function rectViewport(el: HTMLElement, pos: { left: number; top: number }) {
  return vi
    .spyOn(el, "getBoundingClientRect")
    .mockImplementation(() => ({ left: pos.left, top: pos.top }) as DOMRect);
}

function fakeMap() {
  const viewport = document.createElement("div");
  const listeners: Record<string, Array<() => void>> = {};
  return {
    viewport,
    getViewport: () => viewport,
    on: vi.fn((type: string, fn: () => void) => {
      (listeners[type] ||= []).push(fn);
    }),
    un: vi.fn((type: string, fn: () => void) => {
      listeners[type] = (listeners[type] || []).filter(f => f !== fn);
    }),
    emit: (type: string) => (listeners[type] || []).forEach(fn => fn())
  };
}

describe("ViewportOffsetCache", () => {
  function setup() {
    const front = fakeMap();
    const back = fakeMap();
    const fpos = { left: 30, top: 40 };
    const bpos = { left: 10, top: 10 };
    const fspy = rectViewport(front.viewport, fpos);
    const bspy = rectViewport(back.viewport, bpos);
    const cache = new ViewportOffsetCache(front, back);
    const calls = () => fspy.mock.calls.length + bspy.mock.calls.length;
    return { front, back, fpos, bpos, cache, calls };
  }

  it("続けて使っても 1 度しか測らない", () => {
    const h = setup();
    expect(h.cache.get()).toEqual([20, 30]);
    expect(h.calls()).toBe(2);
    for (let i = 0; i < 10; i++) h.cache.get();
    expect(h.calls()).toBe(2);
  });

  it("前面・背面の大きさの変化の後は測り直した値を使う", () => {
    const h = setup();
    h.cache.get();
    h.fpos.left = 100;
    expect(h.cache.get()).toEqual([20, 30]);
    fireResize(h.front.viewport);
    expect(h.cache.get()).toEqual([90, 30]);
    h.bpos.top = 0;
    fireResize(h.back.viewport);
    expect(h.cache.get()).toEqual([90, 40]);
    expect(h.calls()).toBe(6);
  });

  it("地図の change:size と前面への pointerenter の後も測り直す", () => {
    const h = setup();
    h.cache.get();
    h.fpos.left = 50;
    h.back.emit("change:size");
    expect(h.cache.get()).toEqual([40, 30]);
    h.fpos.top = 0;
    h.front.viewport.dispatchEvent(new Event("pointerenter"));
    expect(h.cache.get()).toEqual([40, -10]);
  });

  it("refresh は毎回測り、その値を get に残す", () => {
    const h = setup();
    h.cache.get();
    h.fpos.left = 70;
    expect(h.cache.refresh()).toEqual([60, 30]);
    const n = h.calls();
    expect(h.cache.get()).toEqual([60, 30]);
    expect(h.calls()).toBe(n);
  });

  it("dispose で見張りを外し、以後は毎回測る", () => {
    const h = setup();
    const own = observers[observers.length - 1];
    h.cache.dispose();
    expect(own.disconnected).toBe(true);
    expect(h.front.un).toHaveBeenCalledWith("change:size", expect.any(Function));
    expect(h.back.un).toHaveBeenCalledWith("change:size", expect.any(Function));
    h.cache.get();
    h.cache.get();
    expect(h.calls()).toBe(4);
  });
});

describe("紙の外のポインタの移動は、取っておいたずれで背面を測る", () => {
  async function makeApp() {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const app = new MaplatApp({ div, setting: { sources: [] } });
    await app.waitReady;
    app.from = {
      mapID: "hist",
      insideCheckSysCoord: () => false,
      sysCoord2MercAsync: vi.fn(async (xy: number[]) => xy),
      isWmts: () => false
    } as any;
    (app.mapObject as any).getCoordinateFromPixel = vi.fn(() => [3, 4]);
    const backPixels: number[][] = [];
    (app.backMap as any).getCoordinateFromPixel = vi.fn((p: number[]) => {
      backPixels.push([p[0], p[1]]);
      return [p[0], p[1]];
    });
    const fv = app.mapObject.getViewport()!;
    const bv = app.backMap!.getViewport()!;
    const fpos = { left: 5, top: 7 };
    const bpos = { left: 0, top: 0 };
    const fspy = rectViewport(fv, fpos);
    const bspy = rectViewport(bv, bpos);
    const calls = () => fspy.mock.calls.length + bspy.mock.calls.length;
    app.setPointerEvents();
    const mercs: any[] = [];
    app.addEventListener("pointerMoveOnMapMerc", (e: any) => {
      mercs.push(e.detail);
    });
    const move = async (pixel: number[]) => {
      app.mapObject.dispatchEvent({ type: "pointermove", pixel, coordinate: [3, 4] } as any);
      await new Promise(resolve => setTimeout(resolve, 0));
    };
    return { app, fv, bv, fpos, bpos, calls, mercs, backPixels, move };
  }

  it("連続する移動では getBoundingClientRect を呼ばない（最初の 1 回の 2 呼び出しだけ）", async () => {
    const h = await makeApp();
    await h.move([1, 2]);
    expect(h.calls()).toBe(2);
    for (let i = 0; i < 20; i++) await h.move([i, i]);
    expect(h.calls()).toBe(2);
    expect(h.mercs[0]).toEqual([6, 9]);
    expect(h.mercs.length).toBe(21);
  });

  it("大きさが変わった後は測り直したずれを使う", async () => {
    const h = await makeApp();
    await h.move([1, 2]);
    expect(h.mercs).toEqual([[6, 9]]);
    h.fpos.left = 50;
    fireResize(h.fv);
    await h.move([1, 2]);
    expect(h.mercs[1]).toEqual([51, 9]);
    expect(h.calls()).toBe(4);
    await h.move([1, 2]);
    expect(h.calls()).toBe(4);
  });

  it("クリックは毎回測り、その値を移動にも使う", async () => {
    const h = await makeApp();
    await h.move([1, 2]);
    h.app.setMapClick();
    h.fpos.top = 100;
    const front: any = { forEachFeatureAtPixel: () => undefined };
    (h.app.mapObject as any).dispatchEvent({
      type: "click",
      pixel: [1, 2],
      coordinate: [3, 4],
      target: front
    });
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(h.calls()).toBe(4);
    expect(h.backPixels[h.backPixels.length - 1]).toEqual([6, 102]);
    await h.move([1, 2]);
    expect(h.calls()).toBe(4);
    expect(h.mercs[h.mercs.length - 1]).toEqual([6, 102]);
  });

  it("remove で見張りを外す", async () => {
    const h = await makeApp();
    const watching = observers.filter(o => o.targets.includes(h.fv) && !o.disconnected);
    expect(watching.length).toBeGreaterThan(0);
    h.app.remove();
    expect(watching.every(o => o.disconnected)).toBe(true);
  });
});
