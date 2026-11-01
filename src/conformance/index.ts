// @maplat/core/conformance: 層 A の共通の面の適合テスト群と、模擬の層 A。
//
// 公開してよい中身だけを置く（層 A の公開面だけを触る。実装の中身は含まない）。
// Pro 固有機能の試験は Pro のリポジトリに置く。
// 依存は ../element_contract・../element_base だけ（OpenLayers 等を引き込まない。副作用も無い）。
export {
  createLayerAConformanceCases,
  runLayerAConformance,
  runLayerAConformanceInPage,
  ConformanceError
} from "./layer-a";
export type { LayerAFixture, LayerAConformanceOptions, ConformanceCase, ConformanceResult } from "./layer-a";
export {
  MockLayerAApp,
  createMockMaplatAppClass,
  defineMockMaplatApp,
  getMockLayerAController
} from "./mock-layer-a";
export type { MockSource, MockLayerAOptions } from "./mock-layer-a";
