// oct26-m2-t2（MaplatCore #100）AC-1（主判定）: MapboxLayer.render() が OpenLayers の frameState へ
// canvas を同期することを、mapbox-gl をスタブにして決定論的に検証する。
// 同期の内容は MapLibreLayer.render() と同型の 2 点:
//   (a) canvas.width / canvas.height が frameState.size[0] / [1] と一致しないとき mapboxMap.resize() を呼ぶ
//       （pixelRatio は掛けない。MapLibreLayer と同じ比較式）
//   (b) canvas を position:absolute; left:0; top:0 に配置する
// MapLibreLayer の描画後 zoom 再同期（setZoom）は MapLibre 固有の回避策なので移植しておらず、ここでは検証しない。
// 正常対照として MapLibreLayer も同じ条件で走らせ、スタブ自体が健全であることを併せて確かめる。
import { describe, expect, it, vi } from "vitest";
import { MapboxLayer } from "../src/layer_mapbox";
import { MapLibreLayer } from "../src/layer_maplibre";

function withEventTargetStub<T extends object>(source: T): T {
  return Object.assign(source, {
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    getState: () => "ready",
  });
}

// getCenter / getZoom / getBearing は frameState.viewState と一致させてある（view は不変）。
// canvas の寸法は既定で 300x150 とし、frameState.size（800x600）と食い違わせる。
function makeMbMapStub(canvasSize: [number, number] = [300, 150]) {
  const canvas: any = { style: {}, width: canvasSize[0], height: canvasSize[1] };
  return {
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
}

function makeMlMapStub() {
  const canvas: any = { style: {}, width: 300, height: 150 };
  return {
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
}

// viewState.zoom 5 → mapbox zoom 4（= スタブの getZoom）。center / rotation もスタブと一致。
const frameState: any = {
  viewState: { rotation: 0, center: [0, 0], zoom: 5 },
  size: [800, 600],
};

function makeMapboxLayer(mbMap: ReturnType<typeof makeMbMapStub>) {
  const source = withEventTargetStub({ mapboxMap: mbMap, style: "mapbox://styles/mapbox/streets-v12" });
  return new MapboxLayer({ source });
}

describe("oct26-m2-t2 AC-1: MapboxLayer は frameState へ canvas を同期する（MapLibreLayer と同型）", () => {
  it("MapLibreLayer（正常対照）: size 不一致時に resize() を呼ぶ", () => {
    const mlMap = makeMlMapStub();
    const source = withEventTargetStub({ maplibreMap: mlMap, style: "https://example.test/a.json" });
    const layer = new MapLibreLayer({ source });
    layer.render(frameState, undefined as any);
    expect(mlMap.resize).toHaveBeenCalled();
  });

  it("MapLibreLayer（正常対照）: canvas を position:absolute; left:0; top:0 に配置する", () => {
    const mlMap = makeMlMapStub();
    const source = withEventTargetStub({ maplibreMap: mlMap, style: "https://example.test/a.json" });
    const layer = new MapLibreLayer({ source });
    layer.render(frameState, undefined as any);
    const canvas = mlMap.getCanvas();
    expect(canvas.style.position).toBe("absolute");
    expect(canvas.style.left).toBe("0");
    expect(canvas.style.top).toBe("0");
  });

  it("MapboxLayer: size 不一致時に resize() を呼ぶ", () => {
    const mbMap = makeMbMapStub();
    makeMapboxLayer(mbMap).render(frameState, undefined as any);
    expect(mbMap.resize).toHaveBeenCalled();
  });

  it("MapboxLayer: canvas を position:absolute; left:0; top:0 に配置する", () => {
    const mbMap = makeMbMapStub();
    makeMapboxLayer(mbMap).render(frameState, undefined as any);
    const canvas = mbMap.getCanvas();
    expect(canvas.style.position).toBe("absolute");
    expect(canvas.style.left).toBe("0");
    expect(canvas.style.top).toBe("0");
  });

  it("MapboxLayer: canvas 寸法が frameState.size と一致するときは resize() を呼ばない（pixelRatio を掛けない比較）", () => {
    const mbMap = makeMbMapStub([800, 600]);
    makeMapboxLayer(mbMap).render(frameState, undefined as any);
    expect(mbMap.resize).not.toHaveBeenCalled();
    // 配置は寸法に関係なく行う
    expect(mbMap.getCanvas().style.position).toBe("absolute");
  });

  it("MapboxLayer: view 不変でも寸法だけ変わった frame は resize() の後に同期描画する", () => {
    const mbMap = makeMbMapStub();
    makeMapboxLayer(mbMap).render(frameState, undefined as any);
    expect(mbMap.resize).toHaveBeenCalledTimes(1);
    expect(mbMap._render).toHaveBeenCalledTimes(1);
    expect(mbMap.resize.mock.invocationCallOrder[0]).toBeLessThan(
      mbMap._render.mock.invocationCallOrder[0],
    );
  });

  it("MapboxLayer: view 不変かつ寸法一致の frame は従来どおり描画を省く", () => {
    const mbMap = makeMbMapStub([800, 600]);
    makeMapboxLayer(mbMap).render(frameState, undefined as any);
    expect(mbMap._render).not.toHaveBeenCalled();
    expect(mbMap.jumpTo).not.toHaveBeenCalled();
  });

  it("MapboxLayer: frameState.size が無いときは resize() を呼ばない", () => {
    const mbMap = makeMbMapStub();
    makeMapboxLayer(mbMap).render({ viewState: frameState.viewState } as any, undefined as any);
    expect(mbMap.resize).not.toHaveBeenCalled();
    expect(mbMap.getCanvas().style.position).toBe("absolute");
  });
});
