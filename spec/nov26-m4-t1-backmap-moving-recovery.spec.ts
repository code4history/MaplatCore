import { describe, it, expect, vi } from "vitest";
import { MaplatApp } from "../src/index";

// nov26-m4-t1（#108）: 背面地図の追従（setBackMapBehavior の postrender の受け手）が、
// 座標変換の同期例外・非同期の失敗で __backMapMoving を立てたまま止まらないこと。
// 殻の作り方は spec/lifecycle.spec.ts の Object.create(MaplatApp.prototype) に倣う。

async function flush() {
  for (let i = 0; i < 10; i++) await new Promise(r => setTimeout(r, 0));
}

function createBackMapStub() {
  const app = Object.create(MaplatApp.prototype) as any;
  const handlers: Array<(evt: any) => void> = [];
  const backView = {
    setCenter: vi.fn(),
    setZoom: vi.fn(),
    setRotation: vi.fn()
  };
  const backSrc = {
    mapID: "back",
    mercs2ViewpointAsync: vi.fn(async () => [[10, 20], 5, 0.3])
  };
  const fromSrc = {
    mapID: "front",
    viewpoint2MercsAsync: vi.fn((): Promise<any> =>
      Promise.resolve([[[0, 0]], [100, 100]])
    )
  };
  app.logger = { debug: vi.fn(), warn: vi.fn() };
  app.mapObject = {
    on: (type: string, fn: (evt: any) => void) => {
      if (type === "postrender") handlers.push(fn);
    },
    getView: () => ({})
  };
  app.backMap = { getSource: () => backSrc, getView: () => backView };
  app.from = fromSrc;
  app.__hasMapSize = () => true;
  app.__captureRawViewState = () => ({
    center: [0, 0],
    zoom: 1,
    decimalZoom: 1,
    rotation: 0
  });
  app.setBackMapBehavior();
  const fire = () => handlers.forEach(h => h({}));
  return { app, handlers, backView, backSrc, fromSrc, fire };
}

const injectSyncThrow = (fromSrc: any) =>
  fromSrc.viewpoint2MercsAsync.mockImplementationOnce(() => {
    throw new Error("injected");
  });
const injectReject = (fromSrc: any) =>
  fromSrc.viewpoint2MercsAsync.mockImplementationOnce(() =>
    Promise.reject(new Error("injected"))
  );

describe("nov26-m4-t1: 背面地図の追従が座標変換の例外で止まらない（#108）", () => {
  it("AC1: 同期例外の後も __backMapMoving が戻り、次の postrender で追従する", async () => {
    const { app, backView, fromSrc, fire } = createBackMapStub();
    injectSyncThrow(fromSrc);
    try {
      fire();
    } catch {
      // 修正前は例外が外へ出る（AC3 で別に判定する）
    }
    await flush();
    expect(app.__backMapMoving).toBe(false);
    fire();
    await flush();
    expect(backView.setCenter).toHaveBeenCalledTimes(1);
    expect(backView.setCenter).toHaveBeenCalledWith([10, 20]);
  });

  it("AC2: 変換の Promise が reject した後も追従する", async () => {
    const { app, backView, fromSrc, fire } = createBackMapStub();
    injectReject(fromSrc);
    // 修正前は reject が未処理のまま再送出される。ここでは握って判定を続ける。
    const swallow = (_reason: any) => {};
    process.on("unhandledRejection", swallow);
    try {
      fire();
      await flush();
      expect(app.__backMapMoving).toBe(false);
      fire();
      await flush();
      expect(backView.setCenter).toHaveBeenCalledTimes(1);
      expect(backView.setCenter).toHaveBeenCalledWith([10, 20]);
    } finally {
      process.off("unhandledRejection", swallow);
    }
  });

  it("AC3: 例外を注入した postrender の dispatch が投げない", async () => {
    const { fromSrc, fire } = createBackMapStub();
    injectSyncThrow(fromSrc);
    expect(() => fire()).not.toThrow();
    await flush();
  });

  it("AC4: 正常系の追従（中心・zoom・回転）は変わらない", async () => {
    const { app, backView, fire } = createBackMapStub();
    fire();
    await flush();
    expect(backView.setCenter).toHaveBeenCalledWith([10, 20]);
    expect(backView.setZoom).toHaveBeenCalledWith(5);
    expect(backView.setRotation).toHaveBeenCalledWith(0.3);
    expect(app.__backMapMoving).toBe(false);
    expect(app.logger.warn).not.toHaveBeenCalled();
  });

  it("AC4: noRotate のときは回転 0", async () => {
    const { app, backView, fire } = createBackMapStub();
    app.noRotate = true;
    fire();
    await flush();
    expect(backView.setRotation).toHaveBeenCalledWith(0);
  });

  it("AC4: 変換中の postrender は \"Backmap moving skipped\" で抑止される", async () => {
    const { app, fromSrc, fire } = createBackMapStub();
    fromSrc.viewpoint2MercsAsync.mockImplementation(
      () => new Promise(() => {})
    );
    fire();
    fire();
    await flush();
    expect(app.logger.debug).toHaveBeenCalledWith("Backmap moving skipped");
    expect(fromSrc.viewpoint2MercsAsync).toHaveBeenCalledTimes(1);
  });

  it("AC5: 失敗の記録は最初の 1 回だけ warn（2 回目以降は debug）", async () => {
    const { app, fromSrc, fire } = createBackMapStub();
    injectSyncThrow(fromSrc);
    injectSyncThrow(fromSrc);
    try {
      fire();
    } catch {
      // 修正前は例外が外へ出る
    }
    await flush();
    try {
      fire();
    } catch {
      // 同上
    }
    await flush();
    expect(app.logger.warn).toHaveBeenCalledTimes(1);
  });
});
