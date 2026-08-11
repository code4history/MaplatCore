import { describe, it, expect } from "vitest";
import { MaplatApp } from "../src/index";

function createAppStub(): any {
  const app = Object.create(MaplatApp.prototype) as any;
  app.logger = { debug: () => undefined };
  return app;
}

describe("degree-based viewpoint getters (#61)", () => {
  it("getRotation converts the view rotation from radians to degrees", () => {
    const app = createAppStub();
    app.mapObject = {
      getView: () => ({ getRotation: () => Math.PI / 2 })
    };
    expect(app.getRotation()).toBeCloseTo(90);
  });

  it("getRotation normalizes to the (-180, 180] range", () => {
    const app = createAppStub();
    app.mapObject = {
      getView: () => ({ getRotation: () => (Math.PI * 3) / 2 })
    };
    expect(app.getRotation()).toBeCloseTo(-90);
  });

  it("getRotation returns 0 before the map object exists", () => {
    const app = createAppStub();
    expect(app.getRotation()).toBe(0);
  });

  it("getDirection resolves the bearing via the source viewpoint math", async () => {
    const app = createAppStub();
    app.from = {
      viewpoint2MercsAsync: async () => "mercs-token"
    };
    app.mercSrc = {
      mercs2ViewpointAsync: async (mercs: unknown) => {
        expect(mercs).toBe("mercs-token");
        return [[0, 0], 17, Math.PI];
      }
    };
    await expect(app.getDirection()).resolves.toBeCloseTo(180);
  });

  it("getDirection falls back to the view rotation while sources are not ready", async () => {
    const app = createAppStub();
    app.mapObject = {
      getView: () => ({ getRotation: () => Math.PI / 4 })
    };
    await expect(app.getDirection()).resolves.toBeCloseTo(45);
  });
});
