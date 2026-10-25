// mercToLngLat（src/index.ts のモジュール関数）の検査。
// 要素（<maplat-app>）の getMapEnvelope・getViewExtent が使う EPSG:3857 → 経緯度の変換。
// ol の toLonLat と同じく経度を ±180 に巻き戻す（旧クラスの transform の直呼びは巻き戻さない）。
import { describe, it, expect } from "vitest";
import { transform } from "ol/proj";
import { mercToLngLat } from "../src/index";

const HALF_SIZE = 20037508.342789244;

describe("mercToLngLat", () => {
  it("[0, 0] は [0, 0]", () => {
    expect(mercToLngLat([0, 0])).toEqual([0, 0]);
  });

  it("東端は経度 180・緯度 85.0511…（球面メルカトルの逆変換）", () => {
    const [lon, lat] = mercToLngLat([HALF_SIZE, HALF_SIZE]);
    expect(lon).toBeCloseTo(180, 9);
    expect(lat).toBeCloseTo(85.0511287798066, 6);
  });

  it("経度 190 度相当の merc は -170 に巻き戻す（ol の toLonLat と同じ規則）", () => {
    const merc = [(190 / 180) * HALF_SIZE, 0];
    const [lon, lat] = mercToLngLat(merc);
    expect(lon).toBeCloseTo(-170, 9);
    expect(lat).toBeCloseTo(0, 9);
    // 巻き戻さない transform は 190 を返す（この 2 つを取り違えないことの固定）
    expect(transform(merc, "EPSG:3857", "EPSG:4326")[0]).toBeCloseTo(190, 9);
  });

  it("要素の従来の手書きの式と同じ値（既知の点で 1e-9 の差に収まる）", () => {
    const point = [15707000, 4815000];
    const [lon, lat] = mercToLngLat(point);
    expect(lon).toBeCloseTo(141.09838167665322, 9);
    expect(lat).toBeCloseTo(39.648541775455016, 9);
  });
});
