// nov26-m4-t2（MaplatCore #107）t2/AC1・t2/AC3: DPR>1 で MapboxLayer・MapLibreLayer が描画ごとに
// GL の resize() を呼ばないこと。canvas.width/height は物理ピクセル、frameState.size は CSS ピクセルなので、
// GL ライブラリの画素比で割って CSS ピクセル同士で比べる。
// 画素比は GL の map.getPixelRatio() があればその値、無ければ window.devicePixelRatio を使う。両方の経路を走らせる。
// スタブの形は spec/oct26-m2-t2-mapbox-canvas-sync.spec.ts と同じ（既存ファイルの断言を触らないため複製する）。
import { afterEach, describe, expect, it, vi } from "vitest";
import { MapboxLayer } from "../src/layer_mapbox";
import { MapLibreLayer } from "../src/layer_maplibre";

function withEventTargetStub<T extends object>(source: T): T {
  return Object.assign(source, {
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    getState: () => "ready",
  });
}

// getPixelRatio を渡すとスタブがそのメソッドを持つ（maplibre-gl 相当）。渡さなければ持たない（mapbox-gl 1.x 相当）。
function makeMbMapStub(canvasSize: [number, number], pixelRatio?: number) {
  const canvas: any = { style: {}, width: canvasSize[0], height: canvasSize[1] };
  const stub: any = {
    setStyle: vi.fn(),
    getCanvas: () => canvas,
    getBearing: () => 0,
    getCenter: () => ({ toArray: () => [0, 0] }),
    getZoom: () => 4,
    rotateTo: vi.fn(),
    jumpTo: vi.fn(),
    resize: vi.fn(),
    setZoom: vi.fn(),
    _frame: null as any,
    _render: vi.fn(),
  };
  if (pixelRatio !== undefined) stub.getPixelRatio = () => pixelRatio;
  return stub;
}

function makeMlMapStub(canvasSize: [number, number], pixelRatio?: number) {
  const canvas: any = { style: {}, width: canvasSize[0], height: canvasSize[1] };
  const stub: any = {
    setStyle: vi.fn(),
    getCanvas: () => canvas,
    getBearing: () => 0,
    setBearing: vi.fn(),
    stop: vi.fn(),
    getCenter: () => ({ toArray: () => [0, 0] }),
    getZoom: () => 4,
    jumpTo: vi.fn(),
    resize: vi.fn(),
    setZoom: vi.fn(),
    _frame: null as any,
    _render: vi.fn(),
  };
  if (pixelRatio !== undefined) stub.getPixelRatio = () => pixelRatio;
  return stub;
}

function frameState(size: [number, number]): any {
  return { viewState: { rotation: 0, center: [0, 0], zoom: 5 }, size };
}

function setWindowDpr(value: number) {
  Object.defineProperty(window, "devicePixelRatio", { configurable: true, value });
}

const originalDprDescriptor = Object.getOwnPropertyDescriptor(window, "devicePixelRatio");
afterEach(() => {
  if (originalDprDescriptor) {
    Object.defineProperty(window, "devicePixelRatio", originalDprDescriptor);
  } else {
    delete (window as any).devicePixelRatio;
  }
});

type Kind = "mapbox" | "maplibre";
type Route = "getPixelRatio あり" | "getPixelRatio なし（window.devicePixelRatio）";

// 指定の経路で画素比 pr を与え、1 回描画して resize() の呼び出し回数を返す。
// 「getPixelRatio あり」では window.devicePixelRatio を 1 にして、GL の値が使われることを確かめる。
function renderAndCountResize(
  kind: Kind,
  route: Route,
  pr: number,
  canvasSize: [number, number],
  size: [number, number],
): number {
  const viaGl = route === "getPixelRatio あり";
  setWindowDpr(viaGl ? 1 : pr);
  if (kind === "mapbox") {
    const mbMap = makeMbMapStub(canvasSize, viaGl ? pr : undefined);
    const source = withEventTargetStub({ mapboxMap: mbMap, style: "mapbox://styles/mapbox/streets-v12" });
    new MapboxLayer({ source }).render(frameState(size), undefined as any);
    return mbMap.resize.mock.calls.length;
  }
  const mlMap = makeMlMapStub(canvasSize, viaGl ? pr : undefined);
  const source = withEventTargetStub({ maplibreMap: mlMap, style: "https://example.test/a.json" });
  new MapLibreLayer({ source }).render(frameState(size), undefined as any);
  return mlMap.resize.mock.calls.length;
}

const kinds: Kind[] = ["mapbox", "maplibre"];
const routes: Route[] = ["getPixelRatio あり", "getPixelRatio なし（window.devicePixelRatio）"];

describe("nov26-m4-t2 t2/AC1: DPR>1 で寸法が合っているときは resize() を呼ばない", () => {
  for (const kind of kinds) {
    for (const route of routes) {
      it(`${kind}・${route}: DPR 2・canvas 1600x1200・size 800x600 で 0 回`, () => {
        expect(renderAndCountResize(kind, route, 2, [1600, 1200], [800, 600])).toBe(0);
      });
      it(`${kind}・${route}: DPR 1.5・canvas 1200x900・size 800x600 で 0 回`, () => {
        expect(renderAndCountResize(kind, route, 1.5, [1200, 900], [800, 600])).toBe(0);
      });
      it(`${kind}・${route}: DPR 1.5・canvas 1201x900（丸めの差）・size 800x600 で 0 回`, () => {
        expect(renderAndCountResize(kind, route, 1.5, [1201, 900], [800, 600])).toBe(0);
      });
    }
  }
});

describe("nov26-m4-t2 t2/AC3: DPR 2 で寸法が本当に変わったときは resize() を 1 回呼ぶ", () => {
  for (const kind of kinds) {
    for (const route of routes) {
      it(`${kind}・${route}: DPR 2・canvas 1600x1200・size 640x600 で 1 回`, () => {
        expect(renderAndCountResize(kind, route, 2, [1600, 1200], [640, 600])).toBe(1);
      });
    }
  }
});

describe("nov26-m4-t2 エッジケース: 画素比・canvas 寸法が異常なとき", () => {
  for (const kind of kinds) {
    it(`${kind}: getPixelRatio が 0 を返すときは画素比 1 とみなす（800x600 同士で 0 回）`, () => {
      expect(renderAndCountResize(kind, "getPixelRatio あり", 0, [800, 600], [800, 600])).toBe(0);
    });
    it(`${kind}: getPixelRatio が NaN を返すときは画素比 1 とみなす（1600x1200 vs 800x600 で 1 回）`, () => {
      expect(renderAndCountResize(kind, "getPixelRatio あり", NaN, [1600, 1200], [800, 600])).toBe(1);
    });
    it(`${kind}: canvas の寸法が数でないときは不一致として resize() を呼ぶ`, () => {
      expect(
        renderAndCountResize(kind, "getPixelRatio なし（window.devicePixelRatio）", 2, [undefined as any, undefined as any], [800, 600]),
      ).toBe(1);
    });
    it(`${kind}: 差がちょうど 1 CSS px なら不一致として resize() を呼ぶ（DPR 2・canvas 1602x1200）`, () => {
      expect(renderAndCountResize(kind, "getPixelRatio なし（window.devicePixelRatio）", 2, [1602, 1200], [800, 600])).toBe(1);
    });
  }
});
