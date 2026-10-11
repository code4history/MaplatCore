import { MAPLAT_APP_TAG as tt, featuresOf as et, ELEMENT_ATTRIBUTES as z, ELEMENT_PROPERTIES as rt, MAPLAT_APP_METHODS as ct, ELEMENT_OWN_METHODS as lt, isMapListItem as pt, isMapMeta as K, isPoiLayer as dt, isMaplatPoi as N, isViewpoint as V, isLngLat as C, LIFECYCLE_PHASES as ut, isLifecycleDetail as mt, isSourceLoadedDetail as ht, LAYER_A_FEATURE_NAMES as ft, LAYER_A_PRO_METHODS as yt, LAYER_A_PRO_ATTRIBUTES as gt, MAPLAT_APP_EVENTS as W, LAYER_A_PRO_EVENTS as wt } from "./maplat_core_common.js";
import { defineMaplatAppElementOnce as Z, MaplatAppElementBase as Mt } from "./maplat_core_common.js";
class $ extends Error {
  constructor(e) {
    super(e), this.name = "ConformanceError";
  }
}
function u(p, e) {
  if (!p) throw new $(e);
}
function r(p, e, a) {
  const i = JSON.stringify(p), c = JSON.stringify(e);
  if (i !== c) throw new $(`${a}: expected ${c}, got ${i}`);
}
const v = (p) => new Promise((e) => setTimeout(e, p)), B = () => new Promise((p) => typeof requestAnimationFrame == "function" ? requestAnimationFrame(() => p()) : setTimeout(p, 16));
function G(p, e) {
  const a = [], i = new MutationObserver((c) => {
    for (const m of c) m.attributeName === e && a.push(m.target.getAttribute(e));
  });
  return i.observe(p, { attributes: !0, attributeFilter: [e] }), {
    values: a,
    stop() {
      for (const c of i.takeRecords()) c.attributeName === e && a.push(p.getAttribute(e));
      i.disconnect();
    }
  };
}
function It(p, e) {
  const a = document.elementFromPoint(p, e) ?? document.body, i = {
    bubbles: !0,
    cancelable: !0,
    composed: !0,
    clientX: p,
    clientY: e,
    pointerId: 1,
    pointerType: "mouse",
    isPrimary: !0,
    button: 0
  };
  a.dispatchEvent(new PointerEvent("pointerdown", { ...i, buttons: 1 })), a.dispatchEvent(new PointerEvent("pointerup", { ...i, buttons: 0 }));
}
const F = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
async function b(p, e, a) {
  const i = Date.now();
  for (; ; ) {
    const c = p();
    if (c) return c;
    if (Date.now() - i > e) throw new $(`timeout: ${a}`);
    await v(20);
  }
}
function x(p, e, a) {
  return new Promise((i, c) => {
    const m = setTimeout(() => c(new $(`timeout: ${a}`)), e);
    p.then(
      (f) => {
        clearTimeout(m), i(f);
      },
      (f) => {
        clearTimeout(m), c(f);
      }
    );
  });
}
function D(p, e, a, i) {
  return x(
    new Promise((c) => {
      const m = (f) => {
        i && !i(f) || (p.removeEventListener(e, m), c(f));
      };
      p.addEventListener(e, m);
    }),
    a,
    `event "${e}"`
  );
}
function S() {
  const p = console.warn, e = [];
  return console.warn = (...a) => {
    e.push(a.map((i) => String(i)).join(" "));
  }, {
    messages: e,
    restore() {
      console.warn = p;
    }
  };
}
function U(p, e) {
  return new Promise((a) => {
    const i = new Image(), c = setTimeout(() => a(!1), e);
    i.onload = () => {
      clearTimeout(c), a(i.naturalWidth > 0);
    }, i.onerror = () => {
      clearTimeout(c), a(!1);
    }, i.src = p;
  });
}
const vt = ["osm", "gsi", "gsi_ortho"], Y = (p) => !!p && typeof p == "object" && p.name === "InvalidStateError";
function at(p) {
  const e = p.tagName ?? tt, a = p.fixture, i = p.timeout ?? 3e4, c = p.capabilities?.layout === !0, m = p.expectedFeatures ?? et(p.implementation);
  let f = null;
  const d = () => (f || (f = Promise.resolve(p.register()).then(() => {
  })), f.then(() => customElements.whenDefined(e)).then(() => {
  })), g = (s) => async () => {
    await d();
    const t = new bt(e, a, i);
    try {
      await s(t);
    } finally {
      t.cleanup();
    }
  }, I = [], h = (s, t, o) => I.push({ group: s, name: t, run: g(o) });
  h("A-形", "タグが登録され、要素は HTMLElement で implementation・version を持つ", async () => {
    u(customElements.get(e), `<${e}> is not defined`);
    const s = document.createElement(e);
    u(s instanceof HTMLElement, "element is not an HTMLElement"), r(s.implementation, p.implementation, "implementation"), u(typeof s.version == "string" && /^\d+\.\d+\.\d+/.test(s.version), `version is not semver: ${s.version}`);
  }), h("A-形", "登録をもう一度呼んでも上書きせず、例外にしない", async () => {
    const s = customElements.get(e);
    await p.register(), u(customElements.get(e) === s, "the definition was replaced");
  }), h("A-形", "light DOM（shadowRoot が null）で、操作ボタン（押せる要素）を持たない", async (s) => {
    const t = await s.mountReady();
    u(t.shadowRoot === null, "shadowRoot is not null (layer A must use light DOM)");
    const o = t.querySelectorAll('button, input, select, textarea, [role="button"], .ol-control');
    r(o.length, 0, "clickable controls inside the element");
  }), c && h("A-形", "既定の箱は display:block・高さ 400px で、ページの CSS が常に勝つ", async (s) => {
    const t = s.mount({ bare: !0 });
    await v(0);
    const o = getComputedStyle(t);
    r(o.display, "block", "default display"), r(Math.round(t.getBoundingClientRect().height), 400, "default height");
    const n = document.createElement("style");
    n.textContent = ".maplat-conformance-css { height: 123px; }", document.head.appendChild(n), s.onCleanup(() => n.remove()), t.classList.add("maplat-conformance-css"), r(Math.round(t.getBoundingClientRect().height), 123, "height from the page CSS");
  });
  const k = z.filter((s) => s.kind === "boolean"), P = z.filter((s) => s.kind === "number"), A = z.filter((s) => s.kind === "string");
  return h("A-同期", '真偽の属性: ""・"true"・属性名＝true、"false"＝false、不正値は警告して未指定', async (s) => {
    const t = s.mount({ bare: !0, connect: !1 }), o = S();
    try {
      for (const n of k) {
        const l = () => t[n.prop];
        r(l(), void 0, `${n.attr}: no attribute`);
        for (const [M, w] of [["", !0], ["true", !0], [n.attr, !0], ["false", !1]])
          t.setAttribute(n.attr, M), r(l(), w, `${n.attr}="${M}"`);
        const y = o.messages.length;
        t.setAttribute(n.attr, "bogus"), r(l(), void 0, `${n.attr}="bogus"`), u(o.messages.length > y, `${n.attr}="bogus" did not warn`), t.removeAttribute(n.attr), r(l(), void 0, `${n.attr} removed`);
      }
    } finally {
      o.restore();
    }
  }), h("A-同期", '数の属性: "" は未指定、数でない値は警告して未指定', async (s) => {
    const t = s.mount({ bare: !0, connect: !1 }), o = S();
    try {
      for (const n of P) {
        t.setAttribute(n.attr, "12"), r(t[n.prop], 12, `${n.attr}="12"`), t.setAttribute(n.attr, "0"), r(t[n.prop], 0, `${n.attr}="0"`), t.setAttribute(n.attr, ""), r(t[n.prop], void 0, `${n.attr}=""`);
        const l = o.messages.length;
        t.setAttribute(n.attr, "abc"), r(t[n.prop], void 0, `${n.attr}="abc"`), u(o.messages.length > l, `${n.attr}="abc" did not warn`), t.removeAttribute(n.attr);
      }
    } finally {
      o.restore();
    }
  }), h("A-同期", '文字列の属性: "" は未指定・そのままの値', async (s) => {
    const t = s.mount({ bare: !0, connect: !1 });
    for (const o of A)
      t.setAttribute(o.attr, ""), r(t[o.prop], void 0, `${o.attr}=""`), t.setAttribute(o.attr, "conformance-value"), r(t[o.prop], "conformance-value", `${o.attr}="conformance-value"`), t.removeAttribute(o.attr);
  }), h("A-同期", 'プロパティ → 属性の書き戻し（true→""・false→"false"・数・文字列、null・undefined→外す）', async (s) => {
    const t = s.mount({ bare: !0, connect: !1 }), o = (n, l, y) => {
      t[n.prop] = l, r(t.getAttribute(n.attr), y, `${n.prop} = ${JSON.stringify(l)} → attribute`);
    };
    for (const n of k)
      o(n, !0, ""), o(n, !1, "false"), o(n, null, null), o(n, !1, "false"), o(n, void 0, null);
    for (const n of P)
      o(n, 5, "5"), o(n, 0, "0"), o(n, null, null);
    for (const n of A)
      o(n, "x", "x"), o(n, void 0, null);
  }), h("A-同期", "プロパティのみのキーは属性へ書き戻さず、null で未指定に戻る", async (s) => {
    const t = s.mount({ bare: !0, connect: !1 }), o = t.getAttributeNames().length;
    for (const n of rt) {
      const l = n.prop === "restoreExtensionKeys" ? ["k"] : n.prop === "maplibregl" || n.prop === "mapboxgl" ? {} : n.prop.endsWith("Template") || n.prop === "poiStyle" || n.prop.endsWith("Key") || n.prop.endsWith("Token") ? "v" : {};
      t[n.prop] = l, u(t[n.prop] === l, `${n.prop}: read back`), t[n.prop] = null, r(t[n.prop], void 0, `${n.prop} = null`);
    }
    r(t.getAttributeNames().length, o, "attributes written by property-only keys");
  }), h("A-優先", "起動時の map-id・transparency が restore より強い", async (s) => {
    const t = await s.mountReady({
      attributes: { "map-id": a.otherMapId, transparency: "30" },
      properties: { restore: { mapID: a.initialMapId, transparency: 70 } }
    });
    r(t.currentMapId, a.otherMapId, "currentMapId"), r(t.getTransparency(), 30, "getTransparency()"), r(t.initialRestore.mapID, a.otherMapId, "initialRestore.mapID");
  }), h("A-優先", 'false・0 が与えた値として残る（north-up="false"・home-margin-pixels="0"）', async (s) => {
    const t = await s.mountReady({ attributes: { "north-up": "false", "home-margin-pixels": "0" } });
    r(t.northUp, !1, "northUp"), r(t.homeMarginPixels, 0, "homeMarginPixels");
  }), h("A-起動後", "起動時キーの属性の起動後の変更は警告して無視し、作り直さない", async (s) => {
    const t = await s.mountReady(), o = t.ready, n = t.appId, l = [];
    t.addEventListener("lifecycle:setting-loaded", (M) => l.push(M));
    const y = S();
    try {
      t.setAttribute("app-id", "conformance-other-app"), t.setAttribute("app-id", "conformance-other-app-2"), await v(300), r(y.messages.length, 1, "warnings for app-id");
    } finally {
      y.restore();
    }
    r(t.appId, n, "appId after the change"), u(t.ready === o, "ready was replaced"), r(l.length, 0, "the map was recreated (lifecycle:setting-loaded)"), u(t.currentMapId !== null, "currentMapId is null after the ignored change");
  }), h("A-起動後", "起動時キーのプロパティの起動後の代入は警告して無視し、起動時の値を返す", async (s) => {
    const t = await s.mountReady(), o = t.restore, n = S();
    try {
      t.restore = { mapID: "conformance-no-such-map" }, t.restore = { mapID: "conformance-no-such-map-2" }, r(n.messages.length, 1, "warnings for restore");
    } finally {
      n.restore();
    }
    r(t.restore, o, "restore after the assignment");
  }), h("A-起動後", "起動した地図が map-id へ書き戻され、map-id の変更で地図が切り替わる", async (s) => {
    const t = await s.mountReady();
    await b(() => t.getAttribute("map-id") === a.initialMapId, i, `map-id="${a.initialMapId}" after startup`), r(t.mapId, a.initialMapId, "mapId after startup");
    const o = D(t, "mapChanged", i, (n) => n.detail?.mapID === a.otherMapId);
    t.setAttribute("map-id", a.otherMapId), await o, r(t.currentMapId, a.otherMapId, "currentMapId after map-id"), r(t.mapId, a.otherMapId, "mapId after map-id");
  }), h("A-起動後", "内部の操作（changeMap）で map-id が書き戻され、書き戻しで二重に切り替えない", async (s) => {
    const t = await s.mountReady({ attributes: { "map-id": a.initialMapId } });
    await v(200);
    const o = [];
    let n;
    t.addEventListener("mapChanged", (y) => {
      o.push(y.detail?.mapID), n === void 0 && (n = t.getAttribute("map-id"));
    });
    const l = G(t, "map-id");
    await t.changeMap(a.otherMapId), await b(() => t.currentMapId === a.otherMapId, i, "map switched by changeMap()"), await v(400), l.stop(), r(t.getAttribute("map-id"), a.otherMapId, "map-id attribute after changeMap()"), r(t.mapId, a.otherMapId, "mapId after changeMap()"), r(t.currentMapId, t.mapId, "currentMapId equals mapId"), r(n, a.otherMapId, "map-id seen by the mapChanged listener (written back before the event)"), r(o, [a.otherMapId], "mapChanged events after changeMap()"), r(l.values, [a.otherMapId], "map-id attribute mutations");
  }), h("A-起動後", "書き戻しの後に元の値を setAttribute すると、その地図へ戻せる", async (s) => {
    const t = await s.mountReady({ attributes: { "map-id": a.initialMapId } });
    await t.changeMap(a.otherMapId), await b(() => t.getAttribute("map-id") === a.otherMapId, i, "map-id written back");
    const o = D(t, "mapChanged", i, (n) => n.detail?.mapID === a.initialMapId);
    t.setAttribute("map-id", a.initialMapId), await o, r(t.currentMapId, a.initialMapId, "currentMapId after setAttribute(map-id, the first map)"), r(t.getAttribute("map-id"), a.initialMapId, "map-id attribute");
  }), h("A-起動後", "transparency の変更が state・updateState に載り、setTransparency() の変更も属性へ書き戻される", async (s) => {
    const t = await s.mountReady(), o = D(t, "updateState", i, (n) => n.detail?.transparency === 35);
    t.transparency = 35, await o, r(t.state.transparency, 35, "state.transparency"), r(t.getTransparency(), 35, "getTransparency()"), t.setTransparency(10), await b(() => t.getAttribute("transparency") === "10", i, 'transparency="10" after setTransparency(10)'), r(t.transparency, 10, "transparency property after setTransparency()"), await v(200), r(t.getTransparency(), 10, "getTransparency() after the write-back (not re-applied from the attribute)");
  }), h("A-起動後", "setTransparency() を続けて呼んでも、属性の書き戻しは描画 1 回につき 1 回で最後の値が残る", async (s) => {
    const t = await s.mountReady();
    await b(() => t.getAttribute("transparency") === "0", i, 'transparency="0" after startup'), await v(200);
    const o = G(t, "transparency");
    for (let n = 1; n <= 20; n++) t.setTransparency(n * 3);
    r(t.getAttribute("transparency"), "0", "transparency attribute right after the calls (written on the next frame)"), await B(), await B(), await v(300), await B(), o.stop(), r(o.values, ["60"], "transparency attribute mutations for 20 calls in one frame"), r(t.transparency, 60, "transparency property"), r(t.getTransparency(), 60, "getTransparency()");
  }), h("A-起動後", "地図を切り替えても透過度を保つ（§3.8 A4）", async (s) => {
    const t = await s.mountReady();
    t.setTransparency(40), await t.changeMap(a.otherMapId), await b(() => t.currentMapId === a.otherMapId, i, "map switched"), r(t.getTransparency(), 40, "getTransparency() after changeMap"), await b(() => t.state.transparency === 40, i, "state.transparency stays 40");
  }), h("A-メソッド", "44 の委譲メソッドと新設メソッドが関数として在る", async () => {
    const s = document.createElement(e);
    for (const t of [...ct, ...lt])
      r(typeof s[t], "function", `typeof ${t}`);
  }), h("A-メソッド", "地図を作る前の委譲メソッドは例外を投げ、新設の読み取りは空を返す", async (s) => {
    const t = s.mount({ bare: !0, connect: !1 });
    for (const o of ["getTransparency", "changeMap", "goHome", "getMapMeta"]) {
      let n;
      try {
        t[o](a.initialMapId);
      } catch (l) {
        n = l;
      }
      u(Y(n), `${o}() before creation did not throw InvalidStateError`);
    }
    r(t.listMaps(), [], "listMaps() before creation"), r(t.getViewpoint(), null, "getViewpoint() before creation"), r(t.getMapEnvelope(a.initialMapId), null, "getMapEnvelope() before creation"), r(t.getViewExtent(), null, "getViewExtent() before creation"), r(t.currentMapId, null, "currentMapId before creation"), r(t.appData, null, "appData before creation"), r(t.gpsEnabled, !1, "gpsEnabled before creation");
  }), h("A-メソッド", "listMaps・currentMapInfo・getMapMeta・appData の形", async (s) => {
    const t = await s.mountReady(), o = t.listMaps();
    u(Array.isArray(o) && o.length >= 2, "listMaps() has fewer than 2 maps");
    for (const y of o) u(pt(y), `listMaps() item has a wrong shape: ${JSON.stringify(y)}`);
    const n = o.map((y) => y.mapID);
    u(n.includes(a.initialMapId) && n.includes(a.otherMapId), `listMaps() lacks the fixture maps: ${n}`), r(new Set(n).size, n.length, "duplicated mapID in listMaps()"), u(K(t.getMapMeta(a.otherMapId)), "getMapMeta(mapID) shape"), r(t.getMapMeta(a.otherMapId).mapID, a.otherMapId, "getMapMeta(mapID).mapID"), r(t.currentMapInfo()?.mapID, a.initialMapId, "currentMapInfo().mapID");
    const l = t.appData;
    u(l && Object.isFrozen(l), "appData is not a frozen object"), u(Object.isFrozen(t.state) && Object.isFrozen(t.initialRestore), "state / initialRestore are not frozen");
  }), h("A-メソッド", "listPoiLayers の要素は PoiLayer の形（main が先頭・addPoiLayer の icon を保つ・POI に namespaceID）", async (s) => {
    const t = await s.mountReady(), o = await b(() => t.getViewpoint(), i, "a viewpoint"), n = "conformance-layer";
    t.addPoiLayer(n, { name: "conformance", icon: F, pois: [] }), t.addMarker({ lnglat: [o.longitude, o.latitude], name: "conformance-poi" }, n);
    const l = t.listPoiLayers();
    u(Array.isArray(l) && l.length >= 2, `listPoiLayers() has fewer than 2 layers: ${JSON.stringify(l?.length)}`);
    for (const w of l)
      u(dt(w), `listPoiLayers() item has a wrong shape: ${JSON.stringify({ ...w, pois: w?.pois?.length })}`);
    r(l[0].namespaceID, "main", "the first layer of listPoiLayers()");
    const y = l.find((w) => w.namespaceID === n);
    u(y, `listPoiLayers() lacks ${n}`), r(y.icon, F, "icon of the layer given to addPoiLayer()"), r(y.name, "conformance", "name of the layer given to addPoiLayer()"), r(y.pois.length, 1, "POIs of the layer after addMarker()"), u(N(y.pois[0]) && y.pois[0].namespaceID !== "", "the POI added by addMarker() has no namespaceID"), r(t.getPoiLayer(n)?.icon, F, "getPoiLayer().icon"), u(
      t.listPoiLayers(!1, !0).every((w) => w.pois.length > 0) && t.listPoiLayers(!1, !0).some((w) => w.namespaceID === n),
      "listPoiLayers(false, true) must list only the layers with POIs"
    ), t.hidePoiLayer(n);
    const M = t.listPoiLayers(!0);
    u(M.every((w) => w.hide === !0) && M.some((w) => w.namespaceID === n), "listPoiLayers(true) must list the hidden layers"), t.showPoiLayer(n), t.removePoiLayer(n), u(!t.listPoiLayers().some((w) => w.namespaceID === n), "removePoiLayer() did not remove the layer");
  }), h("A-メソッド", "getDefaultPinIcon は既定のピンの画像の URL（選択中の画像も。地図を作る前でも答える）", async () => {
    const s = document.createElement(e), t = s.getDefaultPinIcon(), o = s.getDefaultPinIcon(!0);
    u(typeof t == "string" && t !== "", `getDefaultPinIcon(): ${JSON.stringify(t)}`), u(typeof o == "string" && o !== "", `getDefaultPinIcon(true): ${JSON.stringify(o)}`), r(s.getDefaultPinIcon(!1), t, "getDefaultPinIcon(false)"), c && (u(await U(t, i), `getDefaultPinIcon() does not load: ${t.slice(0, 80)}`), u(await U(o, i), `getDefaultPinIcon(true) does not load: ${o.slice(0, 80)}`));
  }), h("A-互換", "同梱ベースマップ（osm・gsi・gsi_ortho）の listMaps の thumbnail は実装が用意した画像の URL", async (s) => {
    const o = (await s.mountReady()).listMaps().filter((n) => vt.includes(n.mapID));
    for (const n of o)
      u(
        typeof n.thumbnail == "string" && n.thumbnail !== "",
        `listMaps() ${n.mapID}: thumbnail is ${JSON.stringify(n.thumbnail)}`
      ), u(
        !/(^|\/)tmbs\//.test(n.thumbnail),
        `listMaps() ${n.mapID}: thumbnail points to the page's tmbs/ (${n.thumbnail}); a bundled base map must use the implementation's image`
      ), c && u(await U(n.thumbnail, i), `listMaps() ${n.mapID}: thumbnail does not load: ${n.thumbnail.slice(0, 80)}`);
  }), h("A-メソッド", "getViewpoint・viewpoint の形（changeViewpoint の後）", async (s) => {
    const t = await s.mountReady(), o = await b(() => t.getViewpoint(), i, "a viewpoint");
    u(V(o), `getViewpoint() shape: ${JSON.stringify(o)}`), r(t.viewpoint, o, "viewpoint property equals getViewpoint()"), u(t.viewpoint !== t.viewpoint, "viewpoint must return a copy");
  }), h("A-メソッド", "clientPointToLngLat・lngLatToClientPoint は Promise でオブジェクトか null（§3.8 A1）", async (s) => {
    const t = await s.mountReady();
    await b(() => t.getViewpoint(), i, "a viewpoint");
    const o = t.getBoundingClientRect(), n = o.left + o.width / 2, l = o.top + o.height / 2, y = t.clientPointToLngLat(n, l);
    u(y instanceof Promise, "clientPointToLngLat() does not return a Promise");
    const M = await y;
    if (u(M === null || C(M), `clientPointToLngLat() result: ${JSON.stringify(M)}`), c) {
      u(M !== null, "clientPointToLngLat(center) is null");
      const w = await t.lngLatToClientPoint(M.longitude, M.latitude);
      u(w !== null && Math.abs(w.x - n) < 2 && Math.abs(w.y - l) < 2, `round trip: ${JSON.stringify(w)}`);
    } else {
      const w = await t.lngLatToClientPoint(0, 0);
      u(w === null || typeof w.x == "number" && typeof w.y == "number", "lngLatToClientPoint() result");
    }
  }), h("A-メソッド", "getMapEnvelope は範囲の多角形か null、getViewExtent は 4 隅か null", async (s) => {
    const t = await s.mountReady();
    r(t.getMapEnvelope("conformance-no-such-map"), null, "getMapEnvelope(unknown)");
    for (const o of t.listMaps()) {
      const n = t.getMapEnvelope(o.mapID);
      r(n !== null, o.hasEnvelope, `getMapEnvelope(${o.mapID}) vs hasEnvelope`);
    }
    if (a.envelopeMapId) {
      const o = t.getMapEnvelope(a.envelopeMapId);
      u(Array.isArray(o) && o.length >= 3 && o.every(C), `getMapEnvelope(${a.envelopeMapId})`);
    }
    if (c) {
      const o = await b(() => t.getViewExtent(), i, "getViewExtent()");
      u(o.length === 4 && o.every(C), `getViewExtent() shape: ${JSON.stringify(o)}`);
      const n = new Set(o.map((l) => `${l.longitude.toFixed(9)},${l.latitude.toFixed(9)}`));
      r(n.size, 4, "getViewExtent(): distinct corners");
    } else {
      const o = t.getViewExtent();
      u(o === null || o.length === 4 && o.every(C), "getViewExtent() shape");
    }
  }), h("A-メソッド", "setEnvelopes は指定・空配列・未知の地図で例外を投げない", async (s) => {
    const t = await s.mountReady(), o = a.envelopeMapId ?? a.otherMapId;
    t.setEnvelopes([
      { mapID: o, stroke: { color: "#ff0000", width: 2, lineDash: [6, 6] } },
      { mapID: o, fill: "rgba(0, 0, 255, 0.4)" },
      { mapID: "conformance-no-such-map", stroke: { color: "#000" } }
    ]), await v(100), await t.changeMap(a.otherMapId), await v(100), t.setEnvelopes([]), await v(50);
  }), h("A-メソッド", "タイルキャッシュの統計は Promise でオブジェクト（数は number）", async (s) => {
    const t = await s.mountReady(), o = await t.getMapTileCacheStatsAsync();
    u(o && typeof o == "object", "getMapTileCacheStatsAsync() result");
    for (const n of ["size", "count", "total"]) {
      const l = o[n];
      u(l === void 0 || typeof l == "number", `stats.${n} is not a number: ${l}`);
    }
    r(typeof await t.getMapTileCacheSizeAsync(), "number", "getMapTileCacheSizeAsync()"), r(typeof t.getMapCacheEnable(a.initialMapId), "boolean", "getMapCacheEnable()");
  }), h("A-メソッド", "requestUpdateState の拡張キーが state と updateState に載る", async (s) => {
    const t = await s.mountReady(), o = D(t, "updateState", i, (n) => n.detail?.conformanceExt === 1);
    t.requestUpdateState({ conformanceExt: 1 }), await o, r(t.state.conformanceExt, 1, "state.conformanceExt");
  }), h("A-メソッド", "zoomBy で視点の zoom が変わる", async (s) => {
    const t = await s.mountReady(), o = await b(() => t.getViewpoint(), i, "a viewpoint");
    t.zoomBy(1), await b(() => (t.getViewpoint()?.zoom ?? -1 / 0) > o.zoom + 0.5, i, "zoom increased");
  }), h("A-イベント", "lifecycle の 7 段階が旧と同順で出て、detail は phaseId と appData だけ", async (s) => {
    const t = ut.map((l) => `lifecycle:${l}`), o = await s.mountReady({ record: t }), n = s.recorded(o).filter((l) => l.type.startsWith("lifecycle:") && l.type !== "lifecycle:error");
    r(
      n.map((l) => l.type),
      t,
      "lifecycle order"
    );
    for (const l of n)
      u(mt(l.detail), `${l.type} detail keys: ${Object.keys(l.detail || {})}`);
  }), h("A-イベント", "sourceLoaded の detail は {mapID, usable}[]（§3.8 A2）", async (s) => {
    const t = await s.mountReady({ record: ["sourceLoaded"] }), o = s.recorded(t).filter((l) => l.type === "sourceLoaded");
    u(o.length >= 1, "sourceLoaded was not dispatched");
    const n = o[0].detail;
    u(ht(n), `sourceLoaded detail: ${JSON.stringify(n)}`), u(
      n.some((l) => l.mapID === a.initialMapId && l.usable),
      `sourceLoaded lacks ${a.initialMapId} as usable`
    );
  }), h("A-イベント", "イベントは CustomEvent で bubbles・composed なし・cancelable なし（mapChanged）", async (s) => {
    const t = await s.mountReady(), o = t.parentElement, n = D(o, "mapChanged", i, (y) => y.detail?.mapID === a.otherMapId);
    await t.changeMap(a.otherMapId);
    const l = await n;
    u(l instanceof CustomEvent, "not a CustomEvent"), u(l.target === t, "target is not the element"), r([l.bubbles, l.composed, l.cancelable], [!0, !1, !1], "bubbles / composed / cancelable"), u(K(l.detail), "mapChanged detail shape");
  }), h("A-イベント", "視点の変化で changeViewpoint・moveStart・moveEnd が出る", async (s) => {
    const t = await s.mountReady();
    await b(() => t.getViewpoint(), i, "a viewpoint"), await v(400);
    const o = D(t, "changeViewpoint", i), n = D(t, "moveStart", i), l = D(t, "moveEnd", i);
    t.zoomBy(-1), u(V((await o).detail), "changeViewpoint detail shape"), await n;
    const y = await l;
    u(y.detail === null || V(y.detail), "moveEnd detail shape");
  }), c && h("A-イベント", "マーカーのクリックで clickMarker の直後に同期で clickMarkers が出る（1 件でも出す）", async (s) => {
    const t = await s.mountReady();
    await b(() => t.getViewpoint(), i, "a viewpoint"), await v(400);
    const o = t.getBoundingClientRect(), n = o.left + o.width / 2, l = o.top + o.height / 2, y = await t.clientPointToLngLat(n, l);
    u(y, "clientPointToLngLat(center) is null"), t.addMarker({ lnglat: [y.longitude, y.latitude], name: "conformance-click" }, "main");
    const M = [];
    let w, L, O, _ = !1;
    const q = (E) => {
      M.push("clickMarker"), w = E.detail, _ = !0, queueMicrotask(() => {
        _ = !1;
      });
    }, H = (E) => {
      M.push("clickMarkers"), L = E.detail, O === void 0 && (O = _);
    };
    t.addEventListener("clickMarker", q), t.addEventListener("clickMarkers", H), s.onCleanup(() => {
      t.removeEventListener("clickMarker", q), t.removeEventListener("clickMarkers", H);
    });
    for (let E = 0; E < 15 && M.length === 0; E++)
      It(n, l - 12), await v(400);
    await v(100), r(M.slice(0, 2), ["clickMarker", "clickMarkers"], "event order of a marker click"), r(O, !0, "clickMarkers was dispatched in the same task as clickMarker (synchronously right after it)"), u(N(w), `clickMarker detail: ${JSON.stringify(w)}`), u(Array.isArray(L) && L.length >= 1 && L.every(N), `clickMarkers detail: ${JSON.stringify(L)}`), r(L[0].namespaceID, w.namespaceID, "clickMarkers[0] equals clickMarker"), u(
      L.some((E) => E.name === "conformance-click"),
      "clickMarkers lacks the clicked marker"
    );
  }), h("A-機能", "supports() は機能表どおりで、未知の名前は false、作る前でも答える", async () => {
    const s = document.createElement(e);
    for (const t of ft)
      r(s.supports(t), !!m[t], `supports("${t}")`);
    r(s.supports("conformance-no-such-feature"), !1, "supports(unknown)");
  }), h("A-機能", "supports() が偽の Pro 固有メソッドは要素に無い（真なら関数）", async () => {
    const s = document.createElement(e);
    for (const { method: t, feature: o } of yt)
      r(typeof s[t], s.supports(o) ? "function" : "undefined", `typeof ${t}`);
  }), h("A-機能", "未対応の Pro 固有の属性・プロパティはキーごとに 1 回警告して無視する（U3）", async (s) => {
    const t = gt.filter((o) => o.feature && !document.createElement(e).supports(o.feature));
    for (const o of t) {
      const n = s.mount({ bare: !0, connect: !1 }), l = S();
      try {
        n.setAttribute(o.attr, "map-warp"), n.setAttribute(o.attr, "maplat"), n[o.prop] = "map-warp";
        const y = l.messages.filter((M) => M.includes(o.attr) || M.includes(o.prop));
        r(y.length, 1, `warnings for ${o.attr}`), u(!/pro\b/i.test(y[0]), `the warning names the other implementation: ${y[0]}`);
      } finally {
        l.restore();
      }
      r(n[o.prop], void 0, `${o.prop} on an implementation without "${o.feature}"`);
    }
  }), h("A-破棄", "同じタスク内の付け替えでは作り直さない", async (s) => {
    const t = await s.mountReady(), o = t.ready;
    let n = 0;
    t.addEventListener("lifecycle:setting-loaded", () => n++);
    const l = t.parentElement;
    l.removeChild(t), l.appendChild(t), await v(300), u(t.ready === o, "ready was replaced"), r(n, 0, "recreated"), r(typeof t.getTransparency(), "number", "the map is still usable");
  }), h("A-破棄", "DOM から外すと破棄し、置き直すと新しい ready で作り直す", async (s) => {
    const t = await s.mountReady(), o = t.ready, n = t.parentElement;
    t.remove(), await v(50);
    let l;
    try {
      t.getTransparency();
    } catch (y) {
      l = y;
    }
    u(Y(l), "methods still work after removal"), r(t.currentMapId, null, "currentMapId after removal"), n.appendChild(t), await v(0), u(t.ready !== o, "ready was not replaced"), await x(t.ready, i, "ready after re-append"), u(t.currentMapId !== null, "currentMapId after re-append");
  }), h("A-破棄", "付け直しても今の地図のまま（古い map-id から作り直さない）", async (s) => {
    const t = await s.mountReady({ attributes: { "map-id": a.initialMapId } });
    await t.changeMap(a.otherMapId), await b(() => t.currentMapId === a.otherMapId, i, "map switched by changeMap()");
    const o = t.parentElement;
    t.remove(), await v(50), o.appendChild(t), await x(t.ready, i, "ready after re-append"), r(t.currentMapId, a.otherMapId, "currentMapId after re-append"), r(t.getAttribute("map-id"), a.otherMapId, "map-id attribute after re-append");
  }), h("A-破棄", "破棄が決まった時点で ready が新しい Promise に替わり、付け直した直後も前の Promise を返さない", async (s) => {
    const t = await s.mountReady(), o = t.ready, n = t.parentElement;
    t.remove(), await v(0);
    const l = t.ready;
    u(l !== o, "ready was not replaced when the element was disposed");
    const y = /* @__PURE__ */ Symbol("pending"), M = await Promise.race([l.then(() => "resolved", () => "rejected"), v(20).then(() => y)]);
    r(M === y ? "pending" : M, "pending", "the new ready before re-append"), n.appendChild(t), u(t.ready === l, "ready was replaced again on re-append"), await x(t.ready, i, "ready after re-append"), u(t.appData !== null, "appData is null after the new ready resolved"), u(t.currentMapId !== null, "currentMapId is null after the new ready resolved");
  }), h("A-優先", "restoreSession の localStorage から restoreExtensionKeys も読む（期限内のみ）", async (s) => {
    let t = await s.mountReady();
    const o = await b(() => t.getViewpoint(), i, "a viewpoint");
    t.remove(), t = null, await v(50);
    const l = ["epoch", "mapID", "x", "y", "zoom", "rotation", "transparency", "hideMarker", "hideLayer", "backgroundID", "conformanceExt"].map((M) => [M, localStorage.getItem(M)]);
    s.onCleanup(() => {
      for (const [M, w] of l)
        w === null ? localStorage.removeItem(M) : localStorage.setItem(M, w);
    }), localStorage.setItem("epoch", `${Math.floor(Date.now() / 1e3)}`), localStorage.setItem("mapID", a.initialMapId), localStorage.setItem("x", `${o.x}`), localStorage.setItem("y", `${o.y}`), localStorage.setItem("zoom", `${o.zoom}`), localStorage.setItem("rotation", "0"), localStorage.setItem("transparency", "20"), localStorage.setItem("conformanceExt", "1");
    const y = await s.mountReady({
      attributes: { "restore-session": "" },
      properties: { restoreExtensionKeys: ["conformanceExt", "conformanceMissing"] }
    });
    r(y.initialRestore.conformanceExt, "1", "initialRestore.conformanceExt"), u(!("conformanceMissing" in y.initialRestore), "a missing extension key was added"), r(y.initialRestore.mapID, a.initialMapId, "initialRestore.mapID"), r(y.getTransparency(), 20, "transparency from localStorage");
  }), I;
}
class bt {
  constructor(e, a, i) {
    this.tag = e, this.fx = a, this.timeout = i;
    const c = document.createElement("div");
    c.className = "maplat-conformance-container", c.style.cssText = "position:relative;width:480px;height:360px;", document.body.appendChild(c), this.#t = c, this.#o.push(() => c.remove());
  }
  tag;
  fx;
  timeout;
  #o = [];
  #e = /* @__PURE__ */ new WeakMap();
  #t;
  onCleanup(e) {
    this.#o.push(e);
  }
  mount(e = {}) {
    const a = document.createElement(this.tag), i = { ...e.bare ? {} : this.fx.attributes || {}, ...e.attributes || {} }, c = { ...e.bare ? {} : this.fx.properties || {}, ...e.properties || {} };
    for (const [m, f] of Object.entries(c)) a[m] = f;
    for (const [m, f] of Object.entries(i)) a.setAttribute(m, f);
    if (e.record) {
      const m = [];
      this.#e.set(a, m);
      for (const f of e.record) a.addEventListener(f, (d) => m.push(d));
    }
    return e.connect !== !1 && this.#t.appendChild(a), a;
  }
  async mountReady(e = {}) {
    const a = this.mount(e);
    return await x(a.ready, this.timeout, "ready"), a;
  }
  recorded(e) {
    return this.#e.get(e) || [];
  }
  cleanup() {
    for (const e of this.#o.reverse())
      try {
        e();
      } catch {
      }
    this.#o = [];
  }
}
function Rt(p, e) {
  const a = at(p), i = [...new Set(a.map((c) => c.group))];
  e.describe(`layer A conformance (${p.implementation})`, () => {
    for (const c of i)
      e.describe(c, () => {
        for (const m of a.filter((f) => f.group === c))
          e.it(m.name, () => m.run(), (p.timeout ?? 3e4) * 3);
      });
  });
}
async function Ct(p, e) {
  const a = [];
  for (const i of at(p)) {
    const c = Date.now();
    let m;
    try {
      await i.run(), m = { group: i.group, name: i.name, ok: !0, ms: Date.now() - c };
    } catch (f) {
      m = {
        group: i.group,
        name: i.name,
        ok: !1,
        error: f instanceof Error ? `${f.name}: ${f.message}` : String(f),
        ms: Date.now() - c
      };
    }
    a.push(m), e?.(m);
  }
  return a;
}
const R = 20037508342789244e-9, T = (p, e) => [
  p * R / 180,
  Math.log(Math.tan((90 + e) * Math.PI / 360)) / (Math.PI / 180) * (R / 180)
], j = (p, e) => [
  p / R * 180,
  180 / Math.PI * (2 * Math.atan(Math.exp(e / R * 180 * Math.PI / 180)) - Math.PI / 2)
], J = (p) => 2 * R / (256 * Math.pow(2, p)), At = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#cfd8e3"/></svg>'
)}`, Et = [24, 36], nt = (p) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36"><path d="M12 35C12 35 1 20 1 12A11 11 0 0 1 23 12C23 20 12 35 12 35Z" fill="${p ? "#d32f2f" : "#2e7d32"}" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="#fff"/></svg>`
)}`, Dt = nt(!1), kt = nt(!0);
function it(p) {
  const e = { ...p };
  return e.lnglat || (e.lnglat = [e.lng ?? e.longitude, e.lat ?? e.latitude]), delete e.lng, delete e.lat, delete e.longitude, delete e.latitude, e;
}
function ot(p) {
  for (const e of p.pois)
    e.id || (e.id = `${p.id}_${p.__nextId++}`), e.namespaceID || (e.namespaceID = `${e.id}`);
}
function Q(p, e, a) {
  const i = Array.isArray(e) ? { pois: e } : e && typeof e == "object" ? { ...e } : {}, c = Array.isArray(i.pois) ? i.pois : [], m = {
    ...i,
    id: p,
    namespaceID: p,
    name: i.name ?? a,
    pois: c.filter((f) => f && typeof f == "object").map((f) => it(f)),
    __nextId: 0
  };
  return ot(m), m;
}
function Lt(p) {
  return typeof p == "string" ? { mapID: p, label: p, isBasemap: !0, thumbnail: At } : p && typeof p == "object" && typeof p.mapID == "string" ? { ...p } : null;
}
class Pt extends EventTarget {
  waitReady;
  appid;
  appData = null;
  initialRestore = {};
  stateBuffer = {};
  restoreSession = !1;
  sources = [];
  displayMode = "maplat";
  /** 要素の setEnvelopes で最後に指定された枠線（試験から読む） */
  envelopes = [];
  #o;
  #e = null;
  #t = [0, 0];
  // merc
  #a = 2;
  #s = 0;
  // 度
  #p = 0;
  // 度
  #g;
  #h = !1;
  #l;
  #i = /* @__PURE__ */ new Map();
  #f;
  #w = [];
  #M = [];
  #y = !1;
  /** 視点の連続変化の始まり・止まり（要素が moveStart / moveEnd に変える） */
  onMove = null;
  constructor(e) {
    super(), this.#o = e.element;
    const a = e.values, i = e.appOption;
    this.appid = a.appId ?? i.appid, this.restoreSession = !!(a.restoreSession ?? i.restoreSession);
    const c = a.restore ?? i.restore;
    c ? this.initialRestore = { ...c } : this.restoreSession && (this.initialRestore = this.#v(a.restoreExtensionKeys ?? i.restoreExtensionKeys)), a.mapId !== void 0 && (a.mapId !== this.initialRestore.mapID && delete this.initialRestore.position, this.initialRestore.mapID = a.mapId), a.transparency !== void 0 && (this.initialRestore.transparency = a.transparency), this.waitReady = this.#b(e);
  }
  // ---- 初期化 ----
  #v(e) {
    const a = {};
    try {
      const i = parseInt(localStorage.getItem("epoch") || "0", 10), c = Math.floor(Date.now() / 1e3);
      if (!i || c - i >= 3600) return a;
      const m = localStorage.getItem("mapID");
      m && (a.mapID = m);
      const f = localStorage.getItem("x"), d = localStorage.getItem("y");
      f !== null && d !== null && (a.position = {
        x: parseFloat(f),
        y: parseFloat(d),
        zoom: parseFloat(localStorage.getItem("zoom") || "0"),
        rotation: parseFloat(localStorage.getItem("rotation") || "0")
      });
      const g = localStorage.getItem("transparency");
      if (g !== null && (a.transparency = parseFloat(g)), Array.isArray(e))
        for (const I of e) {
          if (typeof I != "string" || I in a) continue;
          const h = localStorage.getItem(I);
          h !== null && (a[I] = h);
        }
    } catch {
    }
    return a;
  }
  async #r(e, a) {
    const i = `on${e.split("-").map((m) => m[0].toUpperCase() + m.slice(1)).join("")}`, c = { phaseId: e, appData: this.appData, mapDivDocument: this.#o, core: this.#o };
    try {
      typeof a?.[i] == "function" && await a[i](c);
    } catch (m) {
      this.#n("lifecycle:error", { phaseId: e, error: m });
    }
    this.#n(`lifecycle:${e}`, c);
  }
  async #b(e) {
    const a = e.values.uiHooks ?? e.appOption.uiHooks;
    let i = e.setting;
    if (i === void 0 && this.appid) {
      const d = await fetch(`apps/${this.appid}.json`);
      if (!d.ok) throw new Error(`mock <maplat-app>: failed to load apps/${this.appid}.json (${d.status})`);
      i = await d.json();
    }
    this.appData = { ...await i }, await this.#r("setting-loaded", a), await this.#r("appdata-ready", a), await this.#r("ui-configure", a), await this.#r("core-dom-ready", a), await this.#r("ui-dom-ready", a);
    const m = (Array.isArray(this.appData.sources) ? this.appData.sources : []).map(Lt);
    this.sources = m.filter((d) => !!d && d.usable !== !1), this.#n(
      "sourceLoaded",
      m.map((d) => ({ mapID: d?.mapID ?? null, usable: !!d && d.usable !== !1 }))
    );
    const f = Array.isArray(this.appData.pois) ? this.appData.pois : [];
    if (this.#i.set("main", Q("main", { pois: f, hide: !1 }, this.appData.appName ?? "main")), this.sources.length > 0) {
      const d = this.initialRestore, g = (d.mapID && this.#d(d.mapID) ? d.mapID : void 0) ?? (this.appData.startFrom && this.#d(this.appData.startFrom) ? this.appData.startFrom : void 0) ?? this.sources[this.sources.length - 1].mapID;
      await this.changeMap(g, d);
    }
    await this.#r("core-ready", a), await this.#r("ui-ready", a);
  }
  // ---- 道具 ----
  #n(e, a) {
    this.#y || this.dispatchEvent(new CustomEvent(e, { detail: a }));
  }
  #d(e) {
    return e ? this.sources.find((a) => a.mapID === e) : void 0;
  }
  #A() {
    const [e, a] = j(this.#t[0], this.#t[1]);
    return {
      x: this.#t[0],
      y: this.#t[1],
      longitude: e,
      latitude: a,
      mercator_x: this.#t[0],
      mercator_y: this.#t[1],
      zoom: this.#a,
      mercZoom: this.#a,
      direction: this.#p,
      rotation: this.#s
    };
  }
  #c() {
    this.onMove?.("start"), this.#n("changeViewpoint", this.#A()), setTimeout(() => this.onMove?.("end"), 30);
  }
  /** 要素の矩形（大きさが無ければ null） */
  #u() {
    const e = this.#o.getBoundingClientRect();
    return e.width > 0 && e.height > 0 ? e : null;
  }
  pixelToLngLat(e, a) {
    const i = this.#u();
    if (!i) return null;
    const c = J(this.#a), m = this.#t[0] + (e - i.width / 2) * c, f = this.#t[1] - (a - i.height / 2) * c, [d, g] = j(m, f);
    return { longitude: d, latitude: g };
  }
  // ---- 旧クラスと同じ 44 のメソッド ----
  handleGPS(e, a) {
    this.#h = !!e, e ? this.#n("gps_request", void 0) : a || this.#n("gps_result", { error: "gps_off" });
  }
  getGPSEnabled() {
    return this.#h;
  }
  getRotation() {
    return this.#s;
  }
  getDirection() {
    return this.#p;
  }
  currentMapInfo() {
    return this.#e ? this.getMapMeta(this.#e.mapID) : void 0;
  }
  mapInfo(e) {
    return this.getMapMeta(e);
  }
  async clientPointToLngLat(e, a) {
    const i = this.#u();
    if (!(!i || !this.#e))
      return this.pixelToLngLat(e - i.left, a - i.top) ?? void 0;
  }
  async lngLatToClientPoint(e, a) {
    const i = this.#u();
    if (!i || !this.#e) return;
    const [c, m] = T(e, a), f = J(this.#a);
    return {
      x: i.left + i.width / 2 + (c - this.#t[0]) / f,
      y: i.top + i.height / 2 - (m - this.#t[1]) / f
    };
  }
  selectMarker(e) {
    this.#f = e;
  }
  unselectMarker() {
    this.#f = void 0;
  }
  getMarker(e) {
    for (const a of this.#i.values()) {
      const i = a.pois.find((c) => c.namespaceID === e || c.id === e);
      if (i) return i;
    }
  }
  updateMarker(e, a, i) {
    const c = this.getMarker(e);
    if (c) {
      if (i)
        for (const m of Object.keys(c)) m !== "id" && m !== "namespaceID" && delete c[m];
      return Object.assign(c, a), e;
    }
  }
  addMarker(e, a = "main") {
    const i = this.#i.get(a);
    if (!i) return;
    const c = it(e);
    return i.pois.push(c), ot(i), this.#m(), c.namespaceID;
  }
  removeMarker(e) {
    for (const a of this.#i.values()) {
      const i = a.pois.findIndex((c) => c.namespaceID === e || c.id === e);
      if (i >= 0) {
        a.pois.splice(i, 1), this.#m();
        return;
      }
    }
  }
  clearMarker(e) {
    for (const a of this.#i.values()) (!e || a.id === e) && (a.pois = []);
    this.#m();
  }
  showAllMarkers() {
    this.requestUpdateState({ hideMarker: 0 });
  }
  hideAllMarkers() {
    this.requestUpdateState({ hideMarker: 1 });
  }
  listPoiLayers(e = !1, a = !1) {
    return [...this.#i.values()].filter(
      (i) => a ? i.pois.length > 0 && (!e || !!i.hide) : !e || !!i.hide
    );
  }
  showPoiLayer(e) {
    const a = this.#i.get(e);
    a && (a.hide = !1), this.#I();
  }
  hidePoiLayer(e) {
    const a = this.#i.get(e);
    a && (a.hide = !0), this.#I();
  }
  getPoiLayer(e) {
    return this.#i.get(e);
  }
  addPoiLayer(e, a) {
    this.#i.has(e) || e === "main" || this.#i.set(e, Q(e, a, e));
  }
  removePoiLayer(e) {
    e !== "main" && this.#i.delete(e);
  }
  addLine(e) {
    this.#w.push(e);
  }
  addVector(e) {
    this.#M.push(e);
  }
  clearLine() {
    this.#w = [];
  }
  clearVector() {
    this.#M = [];
  }
  setGPSMarker(e) {
  }
  changeMap(e, a = {}) {
    const i = this.#d(e);
    if (!i) return Promise.resolve();
    const c = !this.#e;
    this.#e = i;
    const m = i.homePosition ?? this.appData?.homePosition ?? [139.7, 35.7];
    return c && (this.#t = T(m[0], m[1]), this.#a = i.defaultZoom ?? this.appData?.defaultZoom ?? 14), a.position && typeof a.position.x == "number" && typeof a.position.y == "number" && (this.#t = [a.position.x, a.position.y], typeof a.position.zoom == "number" && a.position.zoom > 0 && (this.#a = a.position.zoom)), this.requestUpdateState({ mapID: i.mapID }), this.#n("mapChanged", this.getMapMeta(i.mapID)), this.setTransparency(a.transparency ?? this.getTransparency()), a.hideMarker && this.hideAllMarkers(), this.#m(), this.#c(), Promise.resolve();
  }
  requestUpdateState(e) {
    if (this.stateBuffer = Object.assign(this.stateBuffer, e), this.restoreSession)
      try {
        localStorage.setItem("epoch", `${Math.floor(Date.now() / 1e3)}`);
        for (const [a, i] of Object.entries(e))
          if (a === "position" && i && typeof i == "object")
            for (const [c, m] of Object.entries(i)) localStorage.setItem(c, String(m));
          else
            localStorage.setItem(a, String(i));
      } catch {
      }
    this.#l && clearTimeout(this.#l), this.#l = setTimeout(() => {
      this.#l = void 0, this.#n("updateState", { ...this.stateBuffer });
    }, 50);
  }
  setTransparency(e) {
    this.#g = e, this.requestUpdateState({ transparency: e });
  }
  getTransparency() {
    return this.#g ?? 0;
  }
  setViewpoint(e) {
    typeof e.longitude == "number" && typeof e.latitude == "number" && (this.#t = T(e.longitude, e.latitude));
    const a = e.mercZoom ?? e.zoom;
    typeof a == "number" && (this.#a = a), typeof e.rotation == "number" && (this.#s = e.rotation), typeof e.direction == "number" && (this.#p = e.direction), this.#c();
  }
  goHome() {
    const e = this.#e?.homePosition ?? this.appData?.homePosition;
    e && (this.#t = T(e[0], e[1])), this.#a = this.#e?.defaultZoom ?? this.appData?.defaultZoom ?? this.#a, this.#c();
  }
  resetRotation() {
    this.#s = 0, this.#c();
  }
  resetDirection() {
    this.#p = 0, this.#c();
  }
  resetCirculation() {
    this.#s = 0, this.#p = 0, this.#c();
  }
  getMapMeta(e) {
    const a = e ? this.#d(e) : this.#e;
    if (a)
      return { ...a.meta || {}, mapID: a.mapID, label: a.label ?? a.mapID };
  }
  getMapCacheEnable(e) {
    return !!(e ? this.#d(e) : this.#e)?.cacheEnable;
  }
  async getMapTileCacheStatsAsync(e) {
    return this.getMapCacheEnable(e) ? { size: 0, count: 0, total: 0 } : {};
  }
  async getMapTileCacheSizeAsync(e) {
    return (await this.getMapTileCacheStatsAsync(e)).size || 0;
  }
  async clearMapTileCacheAsync(e) {
  }
  async fetchAllMapTileCacheAsync(e, a) {
    if (!this.getMapCacheEnable(e)) {
      a("stop", {});
      return;
    }
    a("proceed", { processed: 0, total: 0 }), a("finish", { processed: 0, total: 0, size: 0, count: 0 });
  }
  async cancelMapTileCacheAsync(e) {
  }
  // ---- 要素から呼ぶもの ----
  /**
   * 要素の上のクリック（タップ）。マーカー（既定のピンの大きさ・下端の中央が POI の位置）に当たれば
   * clickMarker と、その直後に同期で clickMarkers（重なる全部。1 件でも出す）を出す。当たらなければ clickMap*。
   */
  tapAt(e, a) {
    const i = this.#u();
    if (!i || !this.#e || this.#y) return;
    const c = J(this.#a), m = !!this.stateBuffer.hideMarker, f = [];
    if (!m) {
      for (const k of this.#i.values())
        if (!k.hide)
          for (const P of k.pois) {
            const A = P.lnglat;
            if (!Array.isArray(A) || !Number.isFinite(A[0]) || !Number.isFinite(A[1])) continue;
            const [s, t] = T(A[0], A[1]), o = i.left + i.width / 2 + (s - this.#t[0]) / c, n = i.top + i.height / 2 - (t - this.#t[1]) / c, l = e - o, y = a - n;
            Math.abs(l) <= Et[0] / 2 && y <= 0 && y >= -36 && f.push(P);
          }
    }
    if (f.length > 0) {
      this.#n("clickMarker", f[0]), this.#n("clickMarkers", f);
      return;
    }
    const d = this.#t[0] + (e - i.left - i.width / 2) * c, g = this.#t[1] - (a - i.top - i.height / 2) * c;
    this.#n("clickMapXy", [d, g]), this.#n("clickMapMerc", [d, g]);
    const [I, h] = j(d, g);
    this.#n("clickMap", { longitude: I, latitude: h });
  }
  zoomBy(e) {
    this.#a += e, this.#c();
  }
  viewExtent() {
    const e = this.#u();
    if (!e || !this.#e) return null;
    const i = [
      [0, 0],
      [e.width, 0],
      [e.width, e.height],
      [0, e.height]
    ].map(([c, m]) => this.pixelToLngLat(c, m));
    return i.every(Boolean) ? i : null;
  }
  remove() {
    this.#y = !0, this.#l && clearTimeout(this.#l);
  }
  // ---- 試験から読む・起こすもの（getMockLayerAController 経由）----
  /** 選択中のマーカー（selectMarker の引数）。 */
  get selectedMarker() {
    return this.#f;
  }
  /** 中身からイベントを出す（例: outOfMap・clickMarkers・gps_result・gps_error）。 */
  fire(e, a) {
    this.#n(e, a);
  }
  /** GPS の状態を中身の都合で変える（handleGPS(false, true) 相当の内部の切替）。 */
  setGpsEnabledInternally(e) {
    this.#h = e, this.#n("gps_result", e ? { lnglat: [0, 0], acc: 10 } : { error: "gps_out_hide" });
  }
  #m() {
    let e = 0;
    for (const a of this.#i.values()) a.hide || (e += a.pois.length);
    this.#n("poi_number", e);
  }
  #I() {
    const e = [...this.#i.values()].filter((a) => a.hide).map((a) => a.id);
    this.requestUpdateState({ hideLayer: e.join(",") });
  }
}
const st = /* @__PURE__ */ new WeakMap();
function X(p) {
  return st.get(p)?.() ?? null;
}
function St(p = {}) {
  const e = p.implementation ?? "core", a = p.version ?? "0.0.0-mock", i = Object.freeze({
    ...et(e),
    ...Object.fromEntries(
      Object.entries(p.features ?? {}).filter(([, f]) => typeof f == "boolean")
    )
  }), c = i["display-mode"] === !0;
  class m extends Mt {
    implementation = e;
    version = a;
    #o = [];
    #e = null;
    #t;
    #a = !1;
    #s = null;
    constructor() {
      if (super(), this.addEventListener("pointerdown", (d) => {
        d.pointerType === "mouse" && d.button !== 0 || (this.#s = { pointerId: d.pointerId, x: d.clientX, y: d.clientY, t: d.timeStamp });
      }), this.addEventListener("pointerup", (d) => {
        const g = this.#s;
        if (this.#s = null, !g || g.pointerId !== d.pointerId || Math.hypot(d.clientX - g.x, d.clientY - g.y) >= 9 || d.timeStamp - g.t > 250) return;
        const I = this.currentImplementation();
        I && this.isImplementationReady() && I.tapAt(d.clientX, d.clientY);
      }), typeof this.attachShadow == "function") {
        const d = this.attachShadow({ mode: "closed" }), g = document.createElement("div");
        g.style.cssText = "font:12px system-ui;color:#555;padding:4px;", g.textContent = "maplat-app (mock)", d.appendChild(g), this.#e = g;
      }
      st.set(this, () => this.currentImplementation());
    }
    features() {
      return i;
    }
    forwardedEvents() {
      return c ? [...W, ...wt.map((d) => d.event)] : W;
    }
    createImplementation(d) {
      const g = new Pt(d);
      return g.envelopes = this.#o, c && typeof d.values.displayMode == "string" && (g.displayMode = d.values.displayMode), g.onMove = (I) => {
        if (I === "start") {
          this.#t && clearTimeout(this.#t), this.#a || (this.#a = !0, this.dispatchLayerAEvent("moveStart", {}));
          return;
        }
        this.#t && clearTimeout(this.#t), this.#t = setTimeout(() => {
          this.#t = void 0, this.#a && (this.#a = !1, this.dispatchLayerAEvent("moveEnd", this.viewpoint));
        }, 150);
      }, g;
    }
    onImplementationEvent(d, g) {
      d === "mapChanged" && this.#e && (this.#e.textContent = `maplat-app (mock): ${g?.mapID ?? "-"}`);
    }
    onImplementationDetached(d) {
      this.#t && clearTimeout(this.#t), this.#a = !1;
    }
    applyRuntimeChanges(d, g, I) {
      if (c && g.has("displayMode")) {
        const h = I("displayMode", void 0, "maplat");
        h !== d.displayMode && (d.displayMode = h, d.fire("modechange", { mode: h }));
      }
    }
    listMaps() {
      const d = this.currentImplementation();
      return d ? d.sources.map((g) => ({
        mapID: g.mapID,
        label: g.label ?? g.mapID,
        thumbnail: g.thumbnail ?? null,
        isBasemap: !!g.isBasemap,
        isOldMap: !!g.isOldMap,
        isOverlay: !!g.isOverlay,
        hasEnvelope: Array.isArray(g.envelope) && g.envelope.length >= 3,
        cacheEnable: !!g.cacheEnable
      })) : [];
    }
    setEnvelopes(d) {
      this.#o = Array.isArray(d) ? d.map((I) => ({ ...I })) : [];
      const g = this.currentImplementation();
      g && (g.envelopes = this.#o);
    }
    getMapEnvelope(d) {
      const I = this.currentImplementation()?.sources.find((h) => h.mapID === d);
      return !I || !Array.isArray(I.envelope) || I.envelope.length < 3 ? null : I.envelope.map(([h, k]) => ({ longitude: h, latitude: k }));
    }
    getViewExtent() {
      const d = this.currentImplementation();
      return d && this.isImplementationReady() ? d.viewExtent() : null;
    }
    zoomBy(d) {
      this.requireImplementation("zoomBy").zoomBy(d);
    }
    getDefaultPinIcon(d = !1) {
      return d ? kt : Dt;
    }
  }
  return c && Object.defineProperties(m.prototype, {
    setDisplayMode: {
      configurable: !0,
      writable: !0,
      value(f) {
        const d = X(this);
        if (!d)
          throw new DOMException("<maplat-app>.setDisplayMode(): the map is not created yet.", "InvalidStateError");
        return d.displayMode !== f && (d.displayMode = f, d.fire("modechange", { mode: f })), Promise.resolve();
      }
    },
    getDisplayMode: {
      configurable: !0,
      writable: !0,
      value() {
        const f = X(this);
        return f ? f.displayMode : null;
      }
    }
  }), m;
}
function $t(p = tt, e = {}) {
  const a = typeof customElements < "u" ? customElements.get(p) : void 0;
  if (a)
    return Z(a, p, "the mock layer A"), a;
  const i = St(e);
  return Z(i, p, "the mock layer A"), i;
}
export {
  $ as ConformanceError,
  Pt as MockLayerAApp,
  at as createLayerAConformanceCases,
  St as createMockMaplatAppClass,
  $t as defineMockMaplatApp,
  X as getMockLayerAController,
  Rt as runLayerAConformance,
  Ct as runLayerAConformanceInPage
};
//# sourceMappingURL=maplat_core_conformance.js.map
