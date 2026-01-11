import { describe, it, expect, vi } from "vitest";
import { MaplatApp } from "../src/index";

type DispatchEvent = (event: any) => boolean;

function createAppStub(): any {
  const app = Object.create(MaplatApp.prototype) as any;
  app.uiHooks = undefined;
  app.lifecycleHookResults = {};
  app.mapDivDocument = document.createElement("div");
  app.dispatchEvent = vi.fn<DispatchEvent>(() => true);
  app.logger = { debug: vi.fn() };
  return app;
}

describe("lifecycle phases", () => {
  it("propagates uiHook return values into context", async () => {
    const app = createAppStub();
    app.uiHooks = {
      onUiConfigure: () => ({ ok: true })
    };

    await (app as any).runLifecyclePhase("ui-configure");

    const event = app.dispatchEvent.mock.calls.find(
      (call: [any]) => call[0]?.type === "lifecycle:ui-configure"
    )?.[0];
    expect(event).toBeTruthy();
    expect(event.detail.uiHookResult).toEqual({ ok: true });
    expect(event.detail.uiHookResults["ui-configure"]).toEqual({ ok: true });
  });

  it("emits lifecycle:error and stops on hook failure", async () => {
    const app = createAppStub();
    app.uiHooks = {
      onUiConfigure: () => {
        throw new Error("boom");
      }
    };

    await expect((app as any).runLifecyclePhase("ui-configure")).rejects.toThrow(
      "boom"
    );

    const errorEvent = app.dispatchEvent.mock.calls.find(
      (call: [any]) => call[0]?.type === "lifecycle:error"
    )?.[0];
    expect(errorEvent).toBeTruthy();
    expect(errorEvent.detail.phaseId).toBe("ui-configure");
  });

  it("emits phases in the expected order", async () => {
    const app = createAppStub();
    const phases = [
      "setting-loaded",
      "appdata-ready",
      "ui-configure",
      "core-dom-ready",
      "ui-dom-ready",
      "core-ready",
      "ui-ready"
    ];

    for (const phase of phases) {
      await (app as any).runLifecyclePhase(phase);
    }

    const emitted = app.dispatchEvent.mock.calls
      .map((call: [any]) => call[0]?.type)
      .filter(
        (type: unknown): type is string =>
          typeof type === "string" && type.startsWith("lifecycle:")
      )
      .filter((type: string) => type !== "lifecycle:error");

    expect(emitted).toEqual(phases.map((phase) => `lifecycle:${phase}`));
  });
});
