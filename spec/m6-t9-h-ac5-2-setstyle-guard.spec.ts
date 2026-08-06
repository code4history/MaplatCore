// m6-t9 §3.4 実装レビュー round2 H-AC5-2 回帰テスト。
// layer_maplibre.ts / layer_mapbox.ts の render() は OpenLayers のレンダーフレーム
// ごとに呼ばれるが、setStyle(source.style) を直前値との比較なしに無条件で呼んでいた。
// MapLibre/Mapbox の setStyle は差分がゼロでない場合スタイル再構築（スプライト再取得含む）を
// 伴うため、毎フレーム呼ぶとスタイルの再読み込みが継続しちらつき（ブリンク）として現れる
// （実運用スタイルである MapTiler v3-openmaptiles で人間検証により再現・原因特定済み）。
// 本テストは「同一 style での連続 render は setStyle を1回のみ呼ぶ」ことを回帰的に固定する。
import { describe, expect, it, vi } from "vitest";
import { MapLibreLayer } from "../src/layer_maplibre";
import { MapboxLayer } from "../src/layer_mapbox";

// render() クロージャが読む frameState の最小形。viewState.center は EPSG:3857 座標
// （toLonLat に渡される）。[0, 0] は緯度経度 [0, 0] に変換される安全な値
const frameState: any = {
  viewState: { rotation: 0, center: [0, 0], zoom: 5 },
  size: [800, 600],
};

// Layer コンストラクタが setSource() 経由で source を ol/source/Source 相当として扱う
// （EventTarget としての addEventListener/removeEventListener、および
// handleSourcePropertyChange_ が読む getState() を要求する）ため最小限のスタブを持たせる
function withEventTargetStub<T extends object>(source: T): T {
  return Object.assign(source, {
    addEventListener: () => {},
    removeEventListener: () => {},
    getState: () => "ready",
  });
}

function makeCanvasStub() {
  return { style: {}, width: 800, height: 600 };
}

function makeMlMapStub() {
  return {
    setStyle: vi.fn(),
    getCanvas: () => makeCanvasStub(),
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

function makeMbMapStub() {
  return {
    setStyle: vi.fn(),
    getCanvas: () => makeCanvasStub(),
    getBearing: () => 0,
    getCenter: () => ({ toArray: () => [0, 0] }),
    getZoom: () => 4,
    rotateTo: vi.fn(),
    jumpTo: vi.fn(),
    _frame: null as any,
    _render: vi.fn(),
  };
}

describe("m6-t9 H-AC5-2: render() 内の setStyle は style 変更時のみ呼ばれる", () => {
  it("MapLibreLayer: 同一 style での連続 render は setStyle を1回のみ呼ぶ", () => {
    const mlMap = makeMlMapStub();
    const source = withEventTargetStub({ maplibreMap: mlMap, style: "https://example.test/style-a.json" });
    const layer = new MapLibreLayer({ source });

    layer.render(frameState, undefined as any);
    layer.render(frameState, undefined as any);
    layer.render(frameState, undefined as any);

    expect(mlMap.setStyle).toHaveBeenCalledTimes(1);
    expect(mlMap.setStyle).toHaveBeenCalledWith("https://example.test/style-a.json");
  });

  it("MapLibreLayer: style が変わったら setStyle が再度呼ばれる（同一 style 中の連続 render では増えないことも同時に確認）", () => {
    const mlMap = makeMlMapStub();
    const source: any = withEventTargetStub({ maplibreMap: mlMap, style: "https://example.test/style-a.json" });
    const layer = new MapLibreLayer({ source });

    // style-a のまま2回 render（ガードが無いとここだけで2回呼ばれてしまう）
    layer.render(frameState, undefined as any);
    layer.render(frameState, undefined as any);
    source.style = "https://example.test/style-b.json";
    // style-b のまま2回 render
    layer.render(frameState, undefined as any);
    layer.render(frameState, undefined as any);

    expect(mlMap.setStyle).toHaveBeenCalledTimes(2);
    expect(mlMap.setStyle).toHaveBeenNthCalledWith(1, "https://example.test/style-a.json");
    expect(mlMap.setStyle).toHaveBeenNthCalledWith(2, "https://example.test/style-b.json");
  });

  it("MapboxLayer（予防的整合。実運用での顕在化は未確認だが同型のガードを適用）: 同一 style での連続 render は setStyle を1回のみ呼ぶ", () => {
    const mbMap = makeMbMapStub();
    const source = withEventTargetStub({ mapboxMap: mbMap, style: "mapbox://styles/mapbox/streets-v12" });
    const layer = new MapboxLayer({ source });

    layer.render(frameState, undefined as any);
    layer.render(frameState, undefined as any);
    layer.render(frameState, undefined as any);

    expect(mbMap.setStyle).toHaveBeenCalledTimes(1);
    expect(mbMap.setStyle).toHaveBeenCalledWith("mapbox://styles/mapbox/streets-v12");
  });

  it("MapboxLayer: style が変わったら setStyle が再度呼ばれる（同一 style 中の連続 render では増えないことも同時に確認）", () => {
    const mbMap = makeMbMapStub();
    const source: any = withEventTargetStub({ mapboxMap: mbMap, style: "mapbox://styles/mapbox/streets-v12" });
    const layer = new MapboxLayer({ source });

    layer.render(frameState, undefined as any);
    layer.render(frameState, undefined as any);
    source.style = "mapbox://styles/mapbox/satellite-v9";
    layer.render(frameState, undefined as any);
    layer.render(frameState, undefined as any);

    expect(mbMap.setStyle).toHaveBeenCalledTimes(2);
    expect(mbMap.setStyle).toHaveBeenNthCalledWith(1, "mapbox://styles/mapbox/streets-v12");
    expect(mbMap.setStyle).toHaveBeenNthCalledWith(2, "mapbox://styles/mapbox/satellite-v9");
  });
});
