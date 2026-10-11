// e2e/wc-conformance.html の中身: 層 A の適合テスト群（src/conformance）を実ブラウザで流す。
//   ?impl=core（既定）: 実物の Core の要素（src/element.ts）
//   ?impl=mock       : 模擬の層 A（src/conformance/mock-layer-a.ts）
// 結果は window.__conformance に置く（e2e/wc-conformance.spec.ts が読む）。
import { runLayerAConformanceInPage, defineMockMaplatApp } from "../src/conformance";
import type { ConformanceResult, LayerAFixture } from "../src/conformance";

declare global {
  interface Window {
    __conformance?: { done: boolean; implementation: string; results: ConformanceResult[] };
  }
}

const params = new URLSearchParams(location.search);
const impl = params.get("impl") === "mock" ? "mock" : "core";
document.getElementById("impl")!.textContent = impl;
const list = document.getElementById("results")!;
const summary = document.getElementById("summary")!;

// 地図の入れ物（適合テストが作る）を見える場所に置く
const stage = document.getElementById("stage")!;
const observer = new MutationObserver(() => {
  for (const c of document.querySelectorAll("body > .maplat-conformance-container")) stage.appendChild(c);
});
observer.observe(document.body, { childList: true });

// Core: public/apps/morioka.json（古地図 2 枚＋TMS＋地理院＋OSM）。模擬: 同じ形の setting を渡す
const fixture: LayerAFixture =
  impl === "core"
    ? { attributes: { "app-id": "morioka" }, initialMapId: "morioka_ndl", otherMapId: "morioka", envelopeMapId: "morioka_ndl" }
    : {
        properties: {
          setting: {
            appName: "mock",
            homePosition: [141.149989, 39.699952],
            defaultZoom: 14,
            startFrom: "morioka_ndl",
            sources: [
              {
                mapID: "morioka_ndl",
                label: "1644 正保城絵図",
                isOldMap: true,
                envelope: [
                  [141.13, 39.69],
                  [141.17, 39.69],
                  [141.17, 39.71],
                  [141.13, 39.71]
                ]
              },
              { mapID: "morioka", label: "1735 奥州盛岡城図", isOldMap: true },
              "gsi",
              "osm"
            ]
          }
        },
        initialMapId: "morioka_ndl",
        otherMapId: "morioka",
        envelopeMapId: "morioka_ndl"
      };

const register = impl === "core" ? () => import("../src/element") : () => defineMockMaplatApp("maplat-app");

window.__conformance = { done: false, implementation: impl, results: [] };
runLayerAConformanceInPage(
  { implementation: "core", register, fixture, capabilities: { layout: true }, timeout: 30000 },
  r => {
    window.__conformance!.results.push(r);
    const li = document.createElement("li");
    li.className = r.ok ? "ok" : "ng";
    li.innerHTML = `<span class="group"></span> <span class="name"></span>`;
    li.querySelector(".group")!.textContent = `[${r.group}]`;
    li.querySelector(".name")!.textContent = `${r.ok ? "OK" : "NG"} ${r.name}（${r.ms} ms）${r.error ? ` — ${r.error}` : ""}`;
    list.appendChild(li);
    summary.textContent = `実行中… ${window.__conformance!.results.length} 件`;
  }
).then(results => {
  const ng = results.filter(r => !r.ok).length;
  summary.textContent = `完了: ${results.length} 件中 合格 ${results.length - ng}・不合格 ${ng}`;
  summary.dataset.done = "true";
  window.__conformance!.done = true;
});
