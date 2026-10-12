import { describe, it, expect, vi } from "vitest";
import { MaplatApp } from "../src/index";

// nov26-m4-t5（#91）: 線・面を個別に、または種類ごとに消せる公開 API。
// 殻は Object.create(MaplatApp.prototype)（前例 spec/lifecycle.spec.ts）。

function createAppStub(): any {
  const app = Object.create(MaplatApp.prototype) as any;
  // 修正前は vectors がインスタンスのフィールド（初期化子）なので、殻にも同じものを置く。
  // 修正後は prototype の getter になるので置かない（置くと getter を隠す／代入できない）。
  if (!Object.getOwnPropertyDescriptor(MaplatApp.prototype, "vectors")) {
    app.vectors = [];
  }
  app.logger = { debug: vi.fn() };
  app.from = { merc2SysCoordAsync: vi.fn((c: any) => Promise.resolve(c)) };
  app.mapObject = {
    setVector: vi.fn((_xys: any, type: any) => ({ type })),
    removeFeature: vi.fn(),
    resetVector: vi.fn()
  };
  return app;
}

// Promise の連鎖が流れ切るのを待つ（前例 spec/oct26-m2-t5-tile-load-exception.spec.ts）
async function settle() {
  for (let i = 0; i < 10; i++) await new Promise(r => setTimeout(r, 0));
}

const line = (extra: any = {}) => ({
  lnglats: [
    [141.15, 39.7],
    [141.16, 39.71]
  ],
  ...extra
});
const polygon = (extra: any = {}) => ({
  type: "Polygon",
  coordinates: [
    [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 0]
    ]
  ],
  ...extra
});

describe("nov26-m4-t5: 線・面の id と個別・種類ごとの削除（#91）", () => {
  it("AC1: addLine／addVector は id を返す（与えた id・自動の id は重ならず # を含まない）", async () => {
    const app = createAppStub();
    const a = app.addLine(line());
    const b = app.addVector(polygon());
    const c = app.addVector(polygon({ id: "mine" }));
    const d = app.addLine(line({ id: 42 }));
    await settle();
    expect(typeof a).toBe("string");
    expect(typeof b).toBe("string");
    expect(a).toBe("vector_1");
    expect(b).toBe("vector_2");
    expect(a).not.toBe(b);
    expect(a).not.toContain("#");
    expect(b).not.toContain("#");
    expect(c).toBe("mine");
    expect(d).toBe("42");
  });

  it("AC1: 自動の id が呼び手の id と重なるときは番号を進めて取り直す", async () => {
    const app = createAppStub();
    app.addLine(line({ id: "vector_1" }));
    const auto = app.addLine(line());
    await settle();
    expect(auto).toBe("vector_2");
    expect(app.vectors.length).toBe(2);
  });

  it("AC2: removeVector(id) はその 1 件だけを消し、true／無ければ false を返す", async () => {
    const app = createAppStub();
    const a = app.addLine(line());
    const b = app.addVector(polygon());
    await settle();
    const featureA = app.mapObject.setVector.mock.results[0].value;
    expect(app.removeVector(a)).toBe(true);
    expect(app.mapObject.removeFeature).toHaveBeenCalledTimes(1);
    expect(app.mapObject.removeFeature).toHaveBeenCalledWith(featureA, "feature");
    expect(app.vectors.length).toBe(1);
    expect(app.vectors[0].type).toBe("Polygon");
    expect(app.removeVector(a)).toBe(false);
    expect(app.removeVector("nothing")).toBe(false);
    expect(app.removeLine(b)).toBe(true);
    expect(app.vectors.length).toBe(0);
  });

  it("AC3: clearVector({ type }) は種類で絞って消す（clearLine も同じ）", async () => {
    const app = createAppStub();
    app.addLine(line());
    app.addLine(line());
    app.addVector(polygon());
    app.addVector(polygon());
    await settle();
    app.clearVector({ type: "Line" });
    expect(app.vectors.map((v: any) => v.type)).toEqual(["Polygon", "Polygon"]);
    expect(app.mapObject.removeFeature).toHaveBeenCalledTimes(2);
    expect(app.mapObject.resetVector).not.toHaveBeenCalled();
    app.addLine(line());
    app.clearLine({ type: "Polygon" });
    expect(app.vectors.map((v: any) => v.type)).toEqual(["Line"]);
  });

  it("B26-MIN-1: type を省いた addVector は線として数え、{ type: \"Line\" } で消える", async () => {
    const app = createAppStub();
    app.addVector(line());
    app.addVector(polygon());
    await settle();
    expect(app.vectors).toHaveLength(2);
    app.clearVector({ type: "Line" });
    expect(app.vectors.map((v: any) => v.type)).toEqual(["Polygon"]);
    app.addVector(line());
    app.clearVector({ type: "Polygon" });
    expect(app.vectors).toHaveLength(1);
    expect(app.vectors[0].type).toBeUndefined();
  });

  it("AC4: 引数なしの clearLine()／clearVector() は全部消す", async () => {
    const app = createAppStub();
    app.addLine(line());
    app.addVector(polygon());
    await settle();
    app.clearLine();
    expect(app.vectors.length).toBe(0);
    expect(app.mapObject.resetVector).toHaveBeenCalledTimes(1);
    app.addLine(line());
    app.addVector(polygon());
    await settle();
    app.clearVector();
    expect(app.vectors.length).toBe(0);
    expect(app.mapObject.resetVector).toHaveBeenCalledTimes(2);
  });

  it("AC6: 変換の解決前に removeVector すると、解決後に描かれない", async () => {
    const app = createAppStub();
    let resolve: (v: any) => void = () => undefined;
    app.from.merc2SysCoordAsync = vi.fn(
      (c: any) =>
        new Promise(r => {
          resolve = () => r(c);
        })
    );
    const id = app.addVector(polygon({ coordinates: [[0, 0]] }));
    expect(app.removeVector(id)).toBe(true);
    resolve(undefined);
    await settle();
    expect(app.mapObject.setVector).toHaveBeenCalledTimes(0);
  });

  it("AC6: resetVector の後に古い変換が完了しても描かない（描き直しの世代だけが描く）", async () => {
    const app = createAppStub();
    const resolvers: Array<() => void> = [];
    app.from.merc2SysCoordAsync = vi.fn(
      (c: any) =>
        new Promise(r => {
          resolvers.push(() => r(c));
        })
    );
    app.addVector(polygon({ coordinates: [[0, 0]] }));
    app.resetVector();
    resolvers[0]();
    await settle();
    expect(app.mapObject.setVector).toHaveBeenCalledTimes(0);
  });

  it("AC7: 既にある id で足すと置き換える（2 件にならない）", async () => {
    const app = createAppStub();
    app.addVector(polygon({ id: "dup" }));
    await settle();
    const oldFeature = app.mapObject.setVector.mock.results[0].value;
    app.addVector(polygon({ id: "dup" }));
    await settle();
    expect(app.vectors.length).toBe(1);
    expect(app.mapObject.removeFeature).toHaveBeenCalledTimes(1);
    expect(app.mapObject.removeFeature).toHaveBeenCalledWith(oldFeature, "feature");
    expect(app.mapObject.setVector).toHaveBeenCalledTimes(2);
  });

  it("AC8: addLine／addVector は呼び手の data を書き換えない（凍結した data でも例外にならない）", async () => {
    const app = createAppStub();
    const lineData = Object.freeze(
      line({ id: "l", stroke: { color: "#f00", width: 2 } })
    );
    const vecData = Object.freeze(polygon({ id: "p" }));
    const before = [JSON.stringify(lineData), JSON.stringify(vecData)];
    expect(() => app.addLine(lineData)).not.toThrow();
    expect(() => app.addVector(vecData)).not.toThrow();
    await settle();
    expect([JSON.stringify(lineData), JSON.stringify(vecData)]).toEqual(before);
  });

  it("MIN-t5-1: addLine({ lnglats, stroke }) は写しに正規化した style で描く", async () => {
    const app = createAppStub();
    const stroke = { color: "#ffcc33", width: 2 };
    app.addLine({
      lnglats: [
        [0, 0],
        [1, 1]
      ],
      stroke
    });
    await settle();
    expect(app.mapObject.setVector).toHaveBeenCalledTimes(1);
    const [, type, style] = app.mapObject.setVector.mock.calls[0];
    expect(type).toBe("Line");
    expect(style).toEqual({ stroke });
  });

  it("公開の setLine は従来どおり data に type・style を書く（不変）", async () => {
    const app = createAppStub();
    const data: any = line({ stroke: { color: "#000" } });
    app.setLine(data);
    await settle();
    expect(data.type).toBe("Line");
    expect(data.style).toEqual({ stroke: { color: "#000" } });
    expect(app.vectors.length).toBe(0);
  });
});
