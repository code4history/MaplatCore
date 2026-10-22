import { MAPLAT_APP_TAG as ae, featuresOf as ne, ELEMENT_ATTRIBUTES as z, ELEMENT_PROPERTIES as le, MAPLAT_APP_METHODS as pe, ELEMENT_OWN_METHODS as de, isMapListItem as me, isMapMeta as Z, isPoiLayer as ue, isMaplatPoi as B, isViewpoint as j, isLngLat as O, LIFECYCLE_PHASES as he, isLifecycleDetail as fe, isSourceLoadedDetail as ye, LAYER_A_FEATURE_NAMES as ge, LAYER_A_PRO_METHODS as we, LAYER_A_PRO_ATTRIBUTES as Me, MAPLAT_APP_EVENTS as G, LAYER_A_PRO_EVENTS as ve } from "./maplat_core_common.js";
import { defineMaplatAppElementOnce as Y, MaplatAppElementBase as Ie } from "./maplat_core_common.js";
class _ extends Error {
  constructor(t) {
    super(t), this.name = "ConformanceError";
  }
}
function m(p, t) {
  if (!p) throw new _(t);
}
function s(p, t, a) {
  const i = JSON.stringify(p), l = JSON.stringify(t);
  if (i !== l) throw new _(`${a}: expected ${l}, got ${i}`);
}
const v = (p) => new Promise((t) => setTimeout(t, p)), F = () => new Promise((p) => typeof requestAnimationFrame == "function" ? requestAnimationFrame(() => p()) : setTimeout(p, 16));
function Q(p, t) {
  const a = [], i = new MutationObserver((l) => {
    for (const h of l) h.attributeName === t && a.push(h.target.getAttribute(t));
  });
  return i.observe(p, { attributes: !0, attributeFilter: [t] }), {
    values: a,
    stop() {
      for (const l of i.takeRecords()) l.attributeName === t && a.push(p.getAttribute(t));
      i.disconnect();
    }
  };
}
function be(p, t) {
  const a = document.elementFromPoint(p, t) ?? document.body, i = {
    bubbles: !0,
    cancelable: !0,
    composed: !0,
    clientX: p,
    clientY: t,
    pointerId: 1,
    pointerType: "mouse",
    isPrimary: !0,
    button: 0
  };
  a.dispatchEvent(new PointerEvent("pointerdown", { ...i, buttons: 1 })), a.dispatchEvent(new PointerEvent("pointerup", { ...i, buttons: 0 }));
}
const U = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
async function I(p, t, a) {
  const i = Date.now();
  for (; ; ) {
    const l = p();
    if (l) return l;
    if (Date.now() - i > t) throw new _(`timeout: ${a}`);
    await v(20);
  }
}
function V(p, t, a) {
  return new Promise((i, l) => {
    const h = setTimeout(() => l(new _(`timeout: ${a}`)), t);
    p.then(
      (y) => {
        clearTimeout(h), i(y);
      },
      (y) => {
        clearTimeout(h), l(y);
      }
    );
  });
}
function k(p, t, a, i) {
  return V(
    new Promise((l) => {
      const h = (y) => {
        i && !i(y) || (p.removeEventListener(t, h), l(y));
      };
      p.addEventListener(t, h);
    }),
    a,
    `event "${t}"`
  );
}
function R() {
  const p = console.warn, t = [];
  return console.warn = (...a) => {
    t.push(a.map((i) => String(i)).join(" "));
  }, {
    messages: t,
    restore() {
      console.warn = p;
    }
  };
}
function J(p, t) {
  return new Promise((a) => {
    const i = new Image(), l = setTimeout(() => a(!1), t);
    i.onload = () => {
      clearTimeout(l), a(i.naturalWidth > 0);
    }, i.onerror = () => {
      clearTimeout(l), a(!1);
    }, i.src = p;
  });
}
const Ae = ["osm", "gsi", "gsi_ortho"], X = (p) => !!p && typeof p == "object" && p.name === "InvalidStateError";
function oe(p) {
  const t = p.tagName ?? ae, a = p.fixture, i = p.timeout ?? 3e4, l = p.capabilities?.layout === !0, h = p.expectedFeatures ?? ne(p.implementation);
  let y = null;
  const d = () => (y || (y = Promise.resolve(p.register()).then(() => {
  })), y.then(() => customElements.whenDefined(t)).then(() => {
  })), g = (r) => async () => {
    await d();
    const e = new Le(t, a, i);
    try {
      await r(e);
    } finally {
      e.cleanup();
    }
  }, b = [], u = (r, e, o) => b.push({ group: r, name: e, run: g(o) });
  u("A-形", "タグが登録され、要素は HTMLElement で implementation・version を持つ", async () => {
    m(customElements.get(t), `<${t}> is not defined`);
    const r = document.createElement(t);
    m(r instanceof HTMLElement, "element is not an HTMLElement"), s(r.implementation, p.implementation, "implementation"), m(typeof r.version == "string" && /^\d+\.\d+\.\d+/.test(r.version), `version is not semver: ${r.version}`);
  }), u("A-形", "登録をもう一度呼んでも上書きせず、例外にしない", async () => {
    const r = customElements.get(t);
    await p.register(), m(customElements.get(t) === r, "the definition was replaced");
  }), u("A-形", "light DOM（shadowRoot が null）で、操作ボタン（押せる要素）を持たない", async (r) => {
    const e = await r.mountReady();
    m(e.shadowRoot === null, "shadowRoot is not null (layer A must use light DOM)");
    const o = e.querySelectorAll('button, input, select, textarea, [role="button"], .ol-control');
    s(o.length, 0, "clickable controls inside the element");
  }), l && u("A-形", "既定の箱は display:block・高さ 400px で、ページの CSS が常に勝つ", async (r) => {
    const e = r.mount({ bare: !0 });
    await v(0);
    const o = getComputedStyle(e);
    s(o.display, "block", "default display"), s(Math.round(e.getBoundingClientRect().height), 400, "default height");
    const n = document.createElement("style");
    n.textContent = ".maplat-conformance-css { height: 123px; }", document.head.appendChild(n), r.onCleanup(() => n.remove()), e.classList.add("maplat-conformance-css"), s(Math.round(e.getBoundingClientRect().height), 123, "height from the page CSS");
  });
  const P = z.filter((r) => r.kind === "boolean"), T = z.filter((r) => r.kind === "number"), D = z.filter((r) => r.kind === "string");
  u("A-同期", '真偽の属性: ""・"true"・属性名＝true、"false"＝false、不正値は警告して未指定', async (r) => {
    const e = r.mount({ bare: !0, connect: !1 }), o = R();
    try {
      for (const n of P) {
        const c = () => e[n.prop];
        s(c(), void 0, `${n.attr}: no attribute`);
        for (const [w, M] of [["", !0], ["true", !0], [n.attr, !0], ["false", !1]])
          e.setAttribute(n.attr, w), s(c(), M, `${n.attr}="${w}"`);
        const f = o.messages.length;
        e.setAttribute(n.attr, "bogus"), s(c(), void 0, `${n.attr}="bogus"`), m(o.messages.length > f, `${n.attr}="bogus" did not warn`), e.removeAttribute(n.attr), s(c(), void 0, `${n.attr} removed`);
      }
    } finally {
      o.restore();
    }
  }), u("A-同期", '数の属性: "" は未指定、数でない値は警告して未指定', async (r) => {
    const e = r.mount({ bare: !0, connect: !1 }), o = R();
    try {
      for (const n of T) {
        e.setAttribute(n.attr, "12"), s(e[n.prop], 12, `${n.attr}="12"`), e.setAttribute(n.attr, "0"), s(e[n.prop], 0, `${n.attr}="0"`), e.setAttribute(n.attr, ""), s(e[n.prop], void 0, `${n.attr}=""`);
        const c = o.messages.length;
        e.setAttribute(n.attr, "abc"), s(e[n.prop], void 0, `${n.attr}="abc"`), m(o.messages.length > c, `${n.attr}="abc" did not warn`), e.removeAttribute(n.attr);
      }
    } finally {
      o.restore();
    }
  }), u("A-同期", '文字列の属性: "" は未指定・そのままの値', async (r) => {
    const e = r.mount({ bare: !0, connect: !1 });
    for (const o of D)
      e.setAttribute(o.attr, ""), s(e[o.prop], void 0, `${o.attr}=""`), e.setAttribute(o.attr, "conformance-value"), s(e[o.prop], "conformance-value", `${o.attr}="conformance-value"`), e.removeAttribute(o.attr);
  }), u("A-同期", 'プロパティ → 属性の書き戻し（true→""・false→"false"・数・文字列、null・undefined→外す）', async (r) => {
    const e = r.mount({ bare: !0, connect: !1 }), o = (n, c, f) => {
      e[n.prop] = c, s(e.getAttribute(n.attr), f, `${n.prop} = ${JSON.stringify(c)} → attribute`);
    };
    for (const n of P)
      o(n, !0, ""), o(n, !1, "false"), o(n, null, null), o(n, !1, "false"), o(n, void 0, null);
    for (const n of T)
      o(n, 5, "5"), o(n, 0, "0"), o(n, null, null);
    for (const n of D)
      o(n, "x", "x"), o(n, void 0, null);
  }), u("A-同期", "プロパティのみのキーは属性へ書き戻さず、null で未指定に戻る", async (r) => {
    const e = r.mount({ bare: !0, connect: !1 }), o = e.getAttributeNames().length;
    for (const n of le) {
      const c = n.prop === "restoreExtensionKeys" ? ["k"] : n.prop === "maplibregl" || n.prop === "mapboxgl" ? {} : n.prop.endsWith("Template") || n.prop === "poiStyle" || n.prop.endsWith("Key") || n.prop.endsWith("Token") ? "v" : {};
      e[n.prop] = c, m(e[n.prop] === c, `${n.prop}: read back`), e[n.prop] = null, s(e[n.prop], void 0, `${n.prop} = null`);
    }
    s(e.getAttributeNames().length, o, "attributes written by property-only keys");
  }), u("A-優先", "起動時の map-id・transparency が restore より強い", async (r) => {
    const e = await r.mountReady({
      attributes: { "map-id": a.otherMapId, transparency: "30" },
      properties: { restore: { mapID: a.initialMapId, transparency: 70 } }
    });
    s(e.currentMapId, a.otherMapId, "currentMapId"), s(e.getTransparency(), 30, "getTransparency()"), s(e.initialRestore.mapID, a.otherMapId, "initialRestore.mapID");
  }), u("A-優先", 'false・0 が与えた値として残る（north-up="false"・home-margin-pixels="0"）', async (r) => {
    const e = await r.mountReady({ attributes: { "north-up": "false", "home-margin-pixels": "0" } });
    s(e.northUp, !1, "northUp"), s(e.homeMarginPixels, 0, "homeMarginPixels");
  }), u("A-起動後", "起動時キーの属性の起動後の変更は警告して無視し、作り直さない", async (r) => {
    const e = await r.mountReady(), o = e.ready, n = e.appId, c = [];
    e.addEventListener("lifecycle:setting-loaded", (w) => c.push(w));
    const f = R();
    try {
      e.setAttribute("app-id", "conformance-other-app"), e.setAttribute("app-id", "conformance-other-app-2"), await v(300), s(f.messages.length, 1, "warnings for app-id");
    } finally {
      f.restore();
    }
    s(e.appId, n, "appId after the change"), m(e.ready === o, "ready was replaced"), s(c.length, 0, "the map was recreated (lifecycle:setting-loaded)"), m(e.currentMapId !== null, "currentMapId is null after the ignored change");
  }), u("A-起動後", "起動時キーのプロパティの起動後の代入は警告して無視し、起動時の値を返す", async (r) => {
    const e = await r.mountReady(), o = e.restore, n = R();
    try {
      e.restore = { mapID: "conformance-no-such-map" }, e.restore = { mapID: "conformance-no-such-map-2" }, s(n.messages.length, 1, "warnings for restore");
    } finally {
      n.restore();
    }
    s(e.restore, o, "restore after the assignment");
  }), u("A-起動後", "起動した地図が map-id へ書き戻され、map-id の変更で地図が切り替わる", async (r) => {
    const e = await r.mountReady();
    await I(() => e.getAttribute("map-id") === a.initialMapId, i, `map-id="${a.initialMapId}" after startup`), s(e.mapId, a.initialMapId, "mapId after startup");
    const o = k(e, "mapChanged", i, (n) => n.detail?.mapID === a.otherMapId);
    e.setAttribute("map-id", a.otherMapId), await o, s(e.currentMapId, a.otherMapId, "currentMapId after map-id"), s(e.mapId, a.otherMapId, "mapId after map-id");
  }), u("A-起動後", "内部の操作（changeMap）で map-id が書き戻され、書き戻しで二重に切り替えない", async (r) => {
    const e = await r.mountReady({ attributes: { "map-id": a.initialMapId } });
    await v(200);
    const o = [];
    let n;
    e.addEventListener("mapChanged", (f) => {
      o.push(f.detail?.mapID), n === void 0 && (n = e.getAttribute("map-id"));
    });
    const c = Q(e, "map-id");
    await e.changeMap(a.otherMapId), await I(() => e.currentMapId === a.otherMapId, i, "map switched by changeMap()"), await v(400), c.stop(), s(e.getAttribute("map-id"), a.otherMapId, "map-id attribute after changeMap()"), s(e.mapId, a.otherMapId, "mapId after changeMap()"), s(e.currentMapId, e.mapId, "currentMapId equals mapId"), s(n, a.otherMapId, "map-id seen by the mapChanged listener (written back before the event)"), s(o, [a.otherMapId], "mapChanged events after changeMap()"), s(c.values, [a.otherMapId], "map-id attribute mutations");
  }), u("A-起動後", "書き戻しの後に元の値を setAttribute すると、その地図へ戻せる", async (r) => {
    const e = await r.mountReady({ attributes: { "map-id": a.initialMapId } });
    await e.changeMap(a.otherMapId), await I(() => e.getAttribute("map-id") === a.otherMapId, i, "map-id written back");
    const o = k(e, "mapChanged", i, (n) => n.detail?.mapID === a.initialMapId);
    e.setAttribute("map-id", a.initialMapId), await o, s(e.currentMapId, a.initialMapId, "currentMapId after setAttribute(map-id, the first map)"), s(e.getAttribute("map-id"), a.initialMapId, "map-id attribute");
  }), u("A-起動後", "transparency の変更が state・updateState に載り、setTransparency() の変更も属性へ書き戻される", async (r) => {
    const e = await r.mountReady(), o = k(e, "updateState", i, (n) => n.detail?.transparency === 35);
    e.transparency = 35, await o, s(e.state.transparency, 35, "state.transparency"), s(e.getTransparency(), 35, "getTransparency()"), e.setTransparency(10), await I(() => e.getAttribute("transparency") === "10", i, 'transparency="10" after setTransparency(10)'), s(e.transparency, 10, "transparency property after setTransparency()"), await v(200), s(e.getTransparency(), 10, "getTransparency() after the write-back (not re-applied from the attribute)");
  }), u("A-起動後", "setTransparency() を続けて呼んでも、属性の書き戻しは描画 1 回につき 1 回で最後の値が残る", async (r) => {
    const e = await r.mountReady();
    await I(() => e.getAttribute("transparency") === "0", i, 'transparency="0" after startup'), await v(200);
    const o = Q(e, "transparency");
    for (let n = 1; n <= 20; n++) e.setTransparency(n * 3);
    s(e.getAttribute("transparency"), "0", "transparency attribute right after the calls (written on the next frame)"), await F(), await F(), await v(300), await F(), o.stop(), s(o.values, ["60"], "transparency attribute mutations for 20 calls in one frame"), s(e.transparency, 60, "transparency property"), s(e.getTransparency(), 60, "getTransparency()");
  }), u("A-起動後", "地図を切り替えても透過度を保つ（§3.8 A4）", async (r) => {
    const e = await r.mountReady();
    e.setTransparency(40), await e.changeMap(a.otherMapId), await I(() => e.currentMapId === a.otherMapId, i, "map switched"), s(e.getTransparency(), 40, "getTransparency() after changeMap"), await I(() => e.state.transparency === 40, i, "state.transparency stays 40");
  }), u("A-メソッド", "46 の委譲メソッドと新設メソッドが関数として在る", async () => {
    const r = document.createElement(t);
    for (const e of [...pe, ...de])
      s(typeof r[e], "function", `typeof ${e}`);
  }), u("A-メソッド", "地図を作る前の委譲メソッドは例外を投げ、新設の読み取りは空を返す", async (r) => {
    const e = r.mount({ bare: !0, connect: !1 });
    for (const o of ["getTransparency", "changeMap", "goHome", "getMapMeta"]) {
      let n;
      try {
        e[o](a.initialMapId);
      } catch (c) {
        n = c;
      }
      m(X(n), `${o}() before creation did not throw InvalidStateError`);
    }
    s(e.listMaps(), [], "listMaps() before creation"), s(e.getViewpoint(), null, "getViewpoint() before creation"), s(e.getMapEnvelope(a.initialMapId), null, "getMapEnvelope() before creation"), s(e.getViewExtent(), null, "getViewExtent() before creation"), s(e.currentMapId, null, "currentMapId before creation"), s(e.appData, null, "appData before creation"), s(e.gpsEnabled, !1, "gpsEnabled before creation");
  }), u("A-メソッド", "listMaps・currentMapInfo・getMapMeta・appData の形", async (r) => {
    const e = await r.mountReady(), o = e.listMaps();
    m(Array.isArray(o) && o.length >= 2, "listMaps() has fewer than 2 maps");
    for (const f of o) m(me(f), `listMaps() item has a wrong shape: ${JSON.stringify(f)}`);
    const n = o.map((f) => f.mapID);
    m(n.includes(a.initialMapId) && n.includes(a.otherMapId), `listMaps() lacks the fixture maps: ${n}`), s(new Set(n).size, n.length, "duplicated mapID in listMaps()"), m(Z(e.getMapMeta(a.otherMapId)), "getMapMeta(mapID) shape"), s(e.getMapMeta(a.otherMapId).mapID, a.otherMapId, "getMapMeta(mapID).mapID"), s(e.currentMapInfo()?.mapID, a.initialMapId, "currentMapInfo().mapID");
    const c = e.appData;
    m(c && Object.isFrozen(c), "appData is not a frozen object"), m(Object.isFrozen(e.state) && Object.isFrozen(e.initialRestore), "state / initialRestore are not frozen");
  }), u("A-メソッド", "listPoiLayers の要素は PoiLayer の形（main が先頭・addPoiLayer の icon を保つ・POI に namespaceID）", async (r) => {
    const e = await r.mountReady(), o = await I(() => e.getViewpoint(), i, "a viewpoint"), n = "conformance-layer";
    e.addPoiLayer(n, { name: "conformance", icon: U, pois: [] }), e.addMarker({ lnglat: [o.longitude, o.latitude], name: "conformance-poi" }, n);
    const c = e.listPoiLayers();
    m(Array.isArray(c) && c.length >= 2, `listPoiLayers() has fewer than 2 layers: ${JSON.stringify(c?.length)}`);
    for (const M of c)
      m(ue(M), `listPoiLayers() item has a wrong shape: ${JSON.stringify({ ...M, pois: M?.pois?.length })}`);
    s(c[0].namespaceID, "main", "the first layer of listPoiLayers()");
    const f = c.find((M) => M.namespaceID === n);
    m(f, `listPoiLayers() lacks ${n}`), s(f.icon, U, "icon of the layer given to addPoiLayer()"), s(f.name, "conformance", "name of the layer given to addPoiLayer()"), s(f.pois.length, 1, "POIs of the layer after addMarker()"), m(B(f.pois[0]) && f.pois[0].namespaceID !== "", "the POI added by addMarker() has no namespaceID"), s(e.getPoiLayer(n)?.icon, U, "getPoiLayer().icon"), m(
      e.listPoiLayers(!1, !0).every((M) => M.pois.length > 0) && e.listPoiLayers(!1, !0).some((M) => M.namespaceID === n),
      "listPoiLayers(false, true) must list only the layers with POIs"
    ), e.hidePoiLayer(n);
    const w = e.listPoiLayers(!0);
    m(w.every((M) => M.hide === !0) && w.some((M) => M.namespaceID === n), "listPoiLayers(true) must list the hidden layers"), e.showPoiLayer(n), e.removePoiLayer(n), m(!e.listPoiLayers().some((M) => M.namespaceID === n), "removePoiLayer() did not remove the layer");
  }), u("A-メソッド", "getDefaultPinIcon は既定のピンの画像の URL（選択中の画像も。地図を作る前でも答える）", async () => {
    const r = document.createElement(t), e = r.getDefaultPinIcon(), o = r.getDefaultPinIcon(!0);
    m(typeof e == "string" && e !== "", `getDefaultPinIcon(): ${JSON.stringify(e)}`), m(typeof o == "string" && o !== "", `getDefaultPinIcon(true): ${JSON.stringify(o)}`), s(r.getDefaultPinIcon(!1), e, "getDefaultPinIcon(false)"), l && (m(await J(e, i), `getDefaultPinIcon() does not load: ${e.slice(0, 80)}`), m(await J(o, i), `getDefaultPinIcon(true) does not load: ${o.slice(0, 80)}`));
  }), u("A-互換", "同梱ベースマップ（osm・gsi・gsi_ortho）の listMaps の thumbnail は実装が用意した画像の URL", async (r) => {
    const o = (await r.mountReady()).listMaps().filter((n) => Ae.includes(n.mapID));
    for (const n of o)
      m(
        typeof n.thumbnail == "string" && n.thumbnail !== "",
        `listMaps() ${n.mapID}: thumbnail is ${JSON.stringify(n.thumbnail)}`
      ), m(
        !/(^|\/)tmbs\//.test(n.thumbnail),
        `listMaps() ${n.mapID}: thumbnail points to the page's tmbs/ (${n.thumbnail}); a bundled base map must use the implementation's image`
      ), l && m(await J(n.thumbnail, i), `listMaps() ${n.mapID}: thumbnail does not load: ${n.thumbnail.slice(0, 80)}`);
  }), u("A-メソッド", "getViewpoint・viewpoint の形（changeViewpoint の後）", async (r) => {
    const e = await r.mountReady(), o = await I(() => e.getViewpoint(), i, "a viewpoint");
    m(j(o), `getViewpoint() shape: ${JSON.stringify(o)}`), s(e.viewpoint, o, "viewpoint property equals getViewpoint()"), m(e.viewpoint !== e.viewpoint, "viewpoint must return a copy");
  }), u("A-メソッド", "clientPointToLngLat・lngLatToClientPoint は Promise でオブジェクトか null（§3.8 A1）", async (r) => {
    const e = await r.mountReady();
    await I(() => e.getViewpoint(), i, "a viewpoint");
    const o = e.getBoundingClientRect(), n = o.left + o.width / 2, c = o.top + o.height / 2, f = e.clientPointToLngLat(n, c);
    m(f instanceof Promise, "clientPointToLngLat() does not return a Promise");
    const w = await f;
    if (m(w === null || O(w), `clientPointToLngLat() result: ${JSON.stringify(w)}`), l) {
      m(w !== null, "clientPointToLngLat(center) is null");
      const M = await e.lngLatToClientPoint(w.longitude, w.latitude);
      m(M !== null && Math.abs(M.x - n) < 2 && Math.abs(M.y - c) < 2, `round trip: ${JSON.stringify(M)}`);
    } else {
      const M = await e.lngLatToClientPoint(0, 0);
      m(M === null || typeof M.x == "number" && typeof M.y == "number", "lngLatToClientPoint() result");
    }
  }), u("A-メソッド", "getMapEnvelope は範囲の多角形か null、getViewExtent は 4 隅か null", async (r) => {
    const e = await r.mountReady();
    s(e.getMapEnvelope("conformance-no-such-map"), null, "getMapEnvelope(unknown)");
    for (const o of e.listMaps()) {
      const n = e.getMapEnvelope(o.mapID);
      s(n !== null, o.hasEnvelope, `getMapEnvelope(${o.mapID}) vs hasEnvelope`);
    }
    if (a.envelopeMapId) {
      const o = e.getMapEnvelope(a.envelopeMapId);
      m(Array.isArray(o) && o.length >= 3 && o.every(O), `getMapEnvelope(${a.envelopeMapId})`);
    }
    if (l) {
      const o = await I(() => e.getViewExtent(), i, "getViewExtent()");
      m(o.length === 4 && o.every(O), `getViewExtent() shape: ${JSON.stringify(o)}`);
      const n = new Set(o.map((c) => `${c.longitude.toFixed(9)},${c.latitude.toFixed(9)}`));
      s(n.size, 4, "getViewExtent(): distinct corners");
    } else {
      const o = e.getViewExtent();
      m(o === null || o.length === 4 && o.every(O), "getViewExtent() shape");
    }
  }), u("A-メソッド", "setEnvelopes は指定・空配列・未知の地図で例外を投げない", async (r) => {
    const e = await r.mountReady(), o = a.envelopeMapId ?? a.otherMapId;
    e.setEnvelopes([
      { mapID: o, stroke: { color: "#ff0000", width: 2, lineDash: [6, 6] } },
      { mapID: o, fill: "rgba(0, 0, 255, 0.4)" },
      { mapID: "conformance-no-such-map", stroke: { color: "#000" } }
    ]), await v(100), await e.changeMap(a.otherMapId), await v(100), e.setEnvelopes([]), await v(50);
  }), u("A-メソッド", "タイルキャッシュの統計は Promise でオブジェクト（数は number）", async (r) => {
    const e = await r.mountReady(), o = await e.getMapTileCacheStatsAsync();
    m(o && typeof o == "object", "getMapTileCacheStatsAsync() result");
    for (const n of ["size", "count", "total"]) {
      const c = o[n];
      m(c === void 0 || typeof c == "number", `stats.${n} is not a number: ${c}`);
    }
    s(typeof await e.getMapTileCacheSizeAsync(), "number", "getMapTileCacheSizeAsync()"), s(typeof e.getMapCacheEnable(a.initialMapId), "boolean", "getMapCacheEnable()");
  }), u("A-メソッド", "キャッシュを持つ地図の統計には全タイル数 total が数で載る（§3.8 A10）", async (r) => {
    const e = await r.mountReady();
    if (!e.supports("tile-cache")) return;
    const o = e.listMaps().find((f) => f.cacheEnable);
    if (!o) return;
    const n = await e.getMapTileCacheStatsAsync(o.mapID);
    m(n && typeof n == "object", `getMapTileCacheStatsAsync(${o.mapID}) result`), m(
      typeof n.total == "number" && Number.isFinite(n.total) && Number.isInteger(n.total) && n.total >= 0,
      `getMapTileCacheStatsAsync(${o.mapID}).total is not a tile count: ${JSON.stringify(n)}`
    ), s(typeof n.size, "number", "stats.size of a cached map"), s(typeof n.count, "number", "stats.count of a cached map");
    const c = e.listMaps().find((f) => !f.cacheEnable);
    if (c) {
      const f = await e.getMapTileCacheStatsAsync(c.mapID);
      m(
        f && typeof f == "object" && f.total === void 0,
        `getMapTileCacheStatsAsync(${c.mapID}) of a map without cache: ${JSON.stringify(f)}`
      );
    }
  }), u("A-メソッド", "requestUpdateState の拡張キーが state と updateState に載る", async (r) => {
    const e = await r.mountReady(), o = k(e, "updateState", i, (n) => n.detail?.conformanceExt === 1);
    e.requestUpdateState({ conformanceExt: 1 }), await o, s(e.state.conformanceExt, 1, "state.conformanceExt");
  }), u("A-メソッド", "zoomBy で視点の zoom が変わる", async (r) => {
    const e = await r.mountReady(), o = await I(() => e.getViewpoint(), i, "a viewpoint");
    e.zoomBy(1), await I(() => (e.getViewpoint()?.zoom ?? -1 / 0) > o.zoom + 0.5, i, "zoom increased");
  });
  const L = () => ({ lnglats: [[141.15, 39.7], [141.16, 39.71]] }), A = (r = {}) => ({
    type: "Polygon",
    lnglats: [[141.14, 39.69], [141.16, 39.69], [141.16, 39.71], [141.14, 39.69]],
    ...r
  });
  return u("A-ベクター", "addLine・addVector は id（文字列）を返し、与えた id はそのまま・自動の id は重ならない", async (r) => {
    const e = await r.mountReady(), o = e.addLine(L()), n = e.addVector(A());
    m(typeof o == "string" && o !== "", `addLine() returned ${JSON.stringify(o)}`), m(typeof n == "string" && n !== "", `addVector() returned ${JSON.stringify(n)}`), m(o !== n, `two automatic ids collide: ${o}`), s(e.addVector(A({ id: "conformance-vector" })), "conformance-vector", "addVector({ id })"), s(e.addLine({ ...L(), id: 42 }), "42", "addLine({ id: 42 }) (the id is a string)"), e.clearVector();
  }), u("A-ベクター", "addLine・addVector は呼び手の data を変えない（凍結した data でも例外にしない）", async (r) => {
    const e = await r.mountReady(), o = Object.freeze({ lnglats: [[141.15, 39.7], [141.16, 39.71]], stroke: { color: "#ff0000", width: 2 } }), n = Object.freeze(A({ id: "conformance-frozen" })), c = [JSON.stringify(o), JSON.stringify(n)];
    e.addLine(o), e.addVector(n), s([JSON.stringify(o), JSON.stringify(n)], c, "the caller's data after addLine() / addVector()"), e.clearVector();
  }), u("A-ベクター", "既にある id で足すと置き換わり、1 件のまま新しい種類で数える", async (r) => {
    const e = await r.mountReady(), o = e.addLine({ ...L(), id: "conformance-replace" });
    s(o, "conformance-replace", "the id of the first addLine()"), s(e.addVector(A({ id: o })), o, "the id of the replacing addVector()"), e.clearVector({ type: "Polygon" }), s(e.removeVector(o), !1, "the Line replaced by the Polygon is gone (an entry was left behind)");
  }), u("A-ベクター", "type を省いた addVector は線として数え、{ type } の clear がその種類だけを消す", async (r) => {
    const e = await r.mountReady(), o = e.addVector(L());
    e.clearVector({ type: "Line" }), s(e.removeVector(o), !1, "addVector() without type is counted as Line");
    const n = e.addVector(A()), c = e.addLine(L());
    e.clearLine({ type: "Line" }), s(e.removeVector(c), !1, "addLine() is cleared by clearLine({ type: 'Line' })"), s(e.removeVector(n), !0, "a Polygon is not cleared by clearLine({ type: 'Line' })"), e.clearVector();
  }), u("A-ベクター", "removeVector・removeLine はその 1 件だけを消し、消したら true・無ければ false", async (r) => {
    const e = await r.mountReady(), o = e.addLine(L()), n = e.addVector(A());
    s(e.removeVector(o), !0, "removeVector(a line)"), s(e.removeVector(o), !1, "removeVector(the same id again)"), s(e.removeVector("conformance-no-such-vector"), !1, "removeVector(unknown)"), s(e.removeLine(n), !0, "removeLine(a polygon)"), s(e.removeLine(n), !1, "removeLine(the same id again)"), s(e.addVector(A({ id: o })), o, "addVector() with the removed id"), s(e.removeLine(o), !0, "removeLine(the re-added entry)");
  }), u("A-ベクター", "clearLine・clearVector は引数なしで全部、filter.type でその種類だけを消す（どちらも別名）", async (r) => {
    const e = await r.mountReady(), o = e.addLine(L()), n = e.addLine(L()), c = e.addVector(A()), f = e.addVector(A());
    e.clearVector({ type: "Line" }), s(e.removeVector(o), !1, "clearVector({ type: 'Line' }) removed the first line"), s(e.removeVector(n), !1, "clearVector({ type: 'Line' }) removed the second line"), s(e.removeVector(c), !0, "clearVector({ type: 'Line' }) kept the first polygon"), s(e.removeVector(f), !0, "clearVector({ type: 'Line' }) kept the second polygon");
    const w = e.addLine(L()), M = e.addVector(A());
    e.clearVector(), s(e.removeVector(w), !1, "clearVector() removed the line"), s(e.removeVector(M), !1, "clearVector() removed the polygon");
    const E = e.addLine(L()), x = e.addVector(A());
    e.clearLine(), s(e.removeVector(E), !1, "clearLine() removed the line"), s(e.removeVector(x), !1, "clearLine() removed the polygon"), e.clearLine({ type: "Polygon" });
  }), u("A-イベント", "lifecycle の 7 段階が旧と同順で出て、detail は phaseId と appData だけ", async (r) => {
    const e = he.map((c) => `lifecycle:${c}`), o = await r.mountReady({ record: e }), n = r.recorded(o).filter((c) => c.type.startsWith("lifecycle:") && c.type !== "lifecycle:error");
    s(
      n.map((c) => c.type),
      e,
      "lifecycle order"
    );
    for (const c of n)
      m(fe(c.detail), `${c.type} detail keys: ${Object.keys(c.detail || {})}`);
  }), u("A-イベント", "sourceLoaded の detail は {mapID, usable}[]（§3.8 A2）", async (r) => {
    const e = await r.mountReady({ record: ["sourceLoaded"] }), o = r.recorded(e).filter((c) => c.type === "sourceLoaded");
    m(o.length >= 1, "sourceLoaded was not dispatched");
    const n = o[0].detail;
    m(ye(n), `sourceLoaded detail: ${JSON.stringify(n)}`), m(
      n.some((c) => c.mapID === a.initialMapId && c.usable),
      `sourceLoaded lacks ${a.initialMapId} as usable`
    );
  }), u("A-イベント", "イベントは CustomEvent で bubbles・composed なし・cancelable なし（mapChanged）", async (r) => {
    const e = await r.mountReady(), o = e.parentElement, n = k(o, "mapChanged", i, (f) => f.detail?.mapID === a.otherMapId);
    await e.changeMap(a.otherMapId);
    const c = await n;
    m(c instanceof CustomEvent, "not a CustomEvent"), m(c.target === e, "target is not the element"), s([c.bubbles, c.composed, c.cancelable], [!0, !1, !1], "bubbles / composed / cancelable"), m(Z(c.detail), "mapChanged detail shape");
  }), u("A-イベント", "視点の変化で changeViewpoint・moveStart・moveEnd が出る", async (r) => {
    const e = await r.mountReady();
    await I(() => e.getViewpoint(), i, "a viewpoint"), await v(400);
    const o = k(e, "changeViewpoint", i), n = k(e, "moveStart", i), c = k(e, "moveEnd", i);
    e.zoomBy(-1), m(j((await o).detail), "changeViewpoint detail shape"), await n;
    const f = await c;
    m(f.detail === null || j(f.detail), "moveEnd detail shape");
  }), l && u("A-イベント", "マーカーのクリックで clickMarker の直後に同期で clickMarkers が出る（1 件でも出す）", async (r) => {
    const e = await r.mountReady();
    await I(() => e.getViewpoint(), i, "a viewpoint"), await v(400);
    const o = e.getBoundingClientRect(), n = o.left + o.width / 2, c = o.top + o.height / 2, f = await e.clientPointToLngLat(n, c);
    m(f, "clientPointToLngLat(center) is null"), e.addMarker({ lnglat: [f.longitude, f.latitude], name: "conformance-click" }, "main");
    const w = [];
    let M, E, x, N = !1;
    const K = (S) => {
      w.push("clickMarker"), M = S.detail, N = !0, queueMicrotask(() => {
        N = !1;
      });
    }, W = (S) => {
      w.push("clickMarkers"), E = S.detail, x === void 0 && (x = N);
    };
    e.addEventListener("clickMarker", K), e.addEventListener("clickMarkers", W), r.onCleanup(() => {
      e.removeEventListener("clickMarker", K), e.removeEventListener("clickMarkers", W);
    });
    for (let S = 0; S < 15 && w.length === 0; S++)
      be(n, c - 12), await v(400);
    await v(100), s(w.slice(0, 2), ["clickMarker", "clickMarkers"], "event order of a marker click"), s(x, !0, "clickMarkers was dispatched in the same task as clickMarker (synchronously right after it)"), m(B(M), `clickMarker detail: ${JSON.stringify(M)}`), m(Array.isArray(E) && E.length >= 1 && E.every(B), `clickMarkers detail: ${JSON.stringify(E)}`), s(E[0].namespaceID, M.namespaceID, "clickMarkers[0] equals clickMarker"), m(
      E.some((S) => S.name === "conformance-click"),
      "clickMarkers lacks the clicked marker"
    );
  }), u("A-機能", "supports() は機能表どおりで、未知の名前は false、作る前でも答える", async () => {
    const r = document.createElement(t);
    for (const e of ge)
      s(r.supports(e), !!h[e], `supports("${e}")`);
    s(r.supports("conformance-no-such-feature"), !1, "supports(unknown)");
  }), u("A-機能", "supports() が偽の Pro 固有メソッドは要素に無い（真なら関数）", async () => {
    const r = document.createElement(t);
    for (const { method: e, feature: o } of we)
      s(typeof r[e], r.supports(o) ? "function" : "undefined", `typeof ${e}`);
  }), u("A-機能", "未対応の Pro 固有の属性・プロパティはキーごとに 1 回警告して無視する（U3）", async (r) => {
    const e = Me.filter((o) => o.feature && !document.createElement(t).supports(o.feature));
    for (const o of e) {
      const n = r.mount({ bare: !0, connect: !1 }), c = R();
      try {
        n.setAttribute(o.attr, "map-warp"), n.setAttribute(o.attr, "maplat"), n[o.prop] = "map-warp";
        const f = c.messages.filter((w) => w.includes(o.attr) || w.includes(o.prop));
        s(f.length, 1, `warnings for ${o.attr}`), m(!/pro\b/i.test(f[0]), `the warning names the other implementation: ${f[0]}`);
      } finally {
        c.restore();
      }
      s(n[o.prop], void 0, `${o.prop} on an implementation without "${o.feature}"`);
    }
  }), u("A-破棄", "同じタスク内の付け替えでは作り直さない", async (r) => {
    const e = await r.mountReady(), o = e.ready;
    let n = 0;
    e.addEventListener("lifecycle:setting-loaded", () => n++);
    const c = e.parentElement;
    c.removeChild(e), c.appendChild(e), await v(300), m(e.ready === o, "ready was replaced"), s(n, 0, "recreated"), s(typeof e.getTransparency(), "number", "the map is still usable");
  }), u("A-破棄", "DOM から外すと破棄し、置き直すと新しい ready で作り直す", async (r) => {
    const e = await r.mountReady(), o = e.ready, n = e.parentElement;
    e.remove(), await v(50);
    let c;
    try {
      e.getTransparency();
    } catch (f) {
      c = f;
    }
    m(X(c), "methods still work after removal"), s(e.currentMapId, null, "currentMapId after removal"), n.appendChild(e), await v(0), m(e.ready !== o, "ready was not replaced"), await V(e.ready, i, "ready after re-append"), m(e.currentMapId !== null, "currentMapId after re-append");
  }), u("A-破棄", "付け直しても今の地図のまま（古い map-id から作り直さない）", async (r) => {
    const e = await r.mountReady({ attributes: { "map-id": a.initialMapId } });
    await e.changeMap(a.otherMapId), await I(() => e.currentMapId === a.otherMapId, i, "map switched by changeMap()");
    const o = e.parentElement;
    e.remove(), await v(50), o.appendChild(e), await V(e.ready, i, "ready after re-append"), s(e.currentMapId, a.otherMapId, "currentMapId after re-append"), s(e.getAttribute("map-id"), a.otherMapId, "map-id attribute after re-append");
  }), u("A-破棄", "破棄が決まった時点で ready が新しい Promise に替わり、付け直した直後も前の Promise を返さない", async (r) => {
    const e = await r.mountReady(), o = e.ready, n = e.parentElement;
    e.remove(), await v(0);
    const c = e.ready;
    m(c !== o, "ready was not replaced when the element was disposed");
    const f = /* @__PURE__ */ Symbol("pending"), w = await Promise.race([c.then(() => "resolved", () => "rejected"), v(20).then(() => f)]);
    s(w === f ? "pending" : w, "pending", "the new ready before re-append"), n.appendChild(e), m(e.ready === c, "ready was replaced again on re-append"), await V(e.ready, i, "ready after re-append"), m(e.appData !== null, "appData is null after the new ready resolved"), m(e.currentMapId !== null, "currentMapId is null after the new ready resolved");
  }), u("A-優先", "restoreSession の localStorage から restoreExtensionKeys も読む（期限内のみ）", async (r) => {
    let e = await r.mountReady();
    const o = await I(() => e.getViewpoint(), i, "a viewpoint");
    e.remove(), e = null, await v(50);
    const c = ["epoch", "mapID", "x", "y", "zoom", "rotation", "transparency", "hideMarker", "hideLayer", "backgroundID", "conformanceExt"].map((w) => [w, localStorage.getItem(w)]);
    r.onCleanup(() => {
      for (const [w, M] of c)
        M === null ? localStorage.removeItem(w) : localStorage.setItem(w, M);
    }), localStorage.setItem("epoch", `${Math.floor(Date.now() / 1e3)}`), localStorage.setItem("mapID", a.initialMapId), localStorage.setItem("x", `${o.x}`), localStorage.setItem("y", `${o.y}`), localStorage.setItem("zoom", `${o.zoom}`), localStorage.setItem("rotation", "0"), localStorage.setItem("transparency", "20"), localStorage.setItem("conformanceExt", "1");
    const f = await r.mountReady({
      attributes: { "restore-session": "" },
      properties: { restoreExtensionKeys: ["conformanceExt", "conformanceMissing"] }
    });
    s(f.initialRestore.conformanceExt, "1", "initialRestore.conformanceExt"), m(!("conformanceMissing" in f.initialRestore), "a missing extension key was added"), s(f.initialRestore.mapID, a.initialMapId, "initialRestore.mapID"), s(f.getTransparency(), 20, "transparency from localStorage");
  }), u("A-優先", "restoreSession で保存した hideMarker が、作り直した要素の initialRestore に入る", async (r) => {
    const e = ["epoch", "mapID", "sourceID", "x", "y", "zoom", "rotation", "transparency", "hideMarker", "hideLayer", "backgroundID", "backID"], o = e.map((w) => [w, localStorage.getItem(w)]);
    r.onCleanup(() => {
      for (const [w, M] of o)
        M === null ? localStorage.removeItem(w) : localStorage.setItem(w, M);
    });
    for (const w of e) localStorage.removeItem(w);
    let n = await r.mountReady({ attributes: { "restore-session": "" } });
    await I(() => n.getViewpoint(), i, "a viewpoint");
    const c = k(n, "updateState", i, (w) => w.detail?.hideMarker === 1);
    n.hideAllMarkers(), await c, s(localStorage.getItem("hideMarker"), "1", "localStorage.hideMarker after hideAllMarkers()"), n.remove(), n = null, await v(50);
    const f = await r.mountReady({ attributes: { "restore-session": "" } });
    s(f.initialRestore.hideMarker, 1, "initialRestore.hideMarker"), await I(() => f.state.hideMarker === 1, i, "state.hideMarker from the session");
  }), b;
}
class Le {
  constructor(t, a, i) {
    this.tag = t, this.fx = a, this.timeout = i;
    const l = document.createElement("div");
    l.className = "maplat-conformance-container", l.style.cssText = "position:relative;width:480px;height:360px;", document.body.appendChild(l), this.#e = l, this.#i.push(() => l.remove());
  }
  tag;
  fx;
  timeout;
  #i = [];
  #t = /* @__PURE__ */ new WeakMap();
  #e;
  onCleanup(t) {
    this.#i.push(t);
  }
  mount(t = {}) {
    const a = document.createElement(this.tag), i = { ...t.bare ? {} : this.fx.attributes || {}, ...t.attributes || {} }, l = { ...t.bare ? {} : this.fx.properties || {}, ...t.properties || {} };
    for (const [h, y] of Object.entries(l)) a[h] = y;
    for (const [h, y] of Object.entries(i)) a.setAttribute(h, y);
    if (t.record) {
      const h = [];
      this.#t.set(a, h);
      for (const y of t.record) a.addEventListener(y, (d) => h.push(d));
    }
    return t.connect !== !1 && this.#e.appendChild(a), a;
  }
  async mountReady(t = {}) {
    const a = this.mount(t);
    return await V(a.ready, this.timeout, "ready"), a;
  }
  recorded(t) {
    return this.#t.get(t) || [];
  }
  cleanup() {
    for (const t of this.#i.reverse())
      try {
        t();
      } catch {
      }
    this.#i = [];
  }
}
function Ve(p, t) {
  const a = oe(p), i = [...new Set(a.map((l) => l.group))];
  t.describe(`layer A conformance (${p.implementation})`, () => {
    for (const l of i)
      t.describe(l, () => {
        for (const h of a.filter((y) => y.group === l))
          t.it(h.name, () => h.run(), (p.timeout ?? 3e4) * 3);
      });
  });
}
async function $e(p, t) {
  const a = [];
  for (const i of oe(p)) {
    const l = Date.now();
    let h;
    try {
      await i.run(), h = { group: i.group, name: i.name, ok: !0, ms: Date.now() - l };
    } catch (y) {
      h = {
        group: i.group,
        name: i.name,
        ok: !1,
        error: y instanceof Error ? `${y.name}: ${y.message}` : String(y),
        ms: Date.now() - l
      };
    }
    a.push(h), t?.(h);
  }
  return a;
}
const $ = 20037508342789244e-9, C = (p, t) => [
  p * $ / 180,
  Math.log(Math.tan((90 + t) * Math.PI / 360)) / (Math.PI / 180) * ($ / 180)
], q = (p, t) => [
  p / $ * 180,
  180 / Math.PI * (2 * Math.atan(Math.exp(t / $ * 180 * Math.PI / 180)) - Math.PI / 2)
], H = (p) => 2 * $ / (256 * Math.pow(2, p)), Ee = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#cfd8e3"/></svg>'
)}`, ke = [24, 36], ie = (p) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36"><path d="M12 35C12 35 1 20 1 12A11 11 0 0 1 23 12C23 20 12 35 12 35Z" fill="${p ? "#d32f2f" : "#2e7d32"}" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="#fff"/></svg>`
)}`, De = ie(!1), Se = ie(!0);
function re(p) {
  const t = { ...p };
  return t.lnglat || (t.lnglat = [t.lng ?? t.longitude, t.lat ?? t.latitude]), delete t.lng, delete t.lat, delete t.longitude, delete t.latitude, t;
}
function se(p) {
  for (const t of p.pois)
    t.id || (t.id = `${p.id}_${p.__nextId++}`), t.namespaceID || (t.namespaceID = `${t.id}`);
}
function ee(p, t, a) {
  const i = Array.isArray(t) ? { pois: t } : t && typeof t == "object" ? { ...t } : {}, l = Array.isArray(i.pois) ? i.pois : [], h = {
    ...i,
    id: p,
    namespaceID: p,
    name: i.name ?? a,
    pois: l.filter((y) => y && typeof y == "object").map((y) => re(y)),
    __nextId: 0
  };
  return se(h), h;
}
function Pe(p) {
  return typeof p == "string" ? { mapID: p, label: p, isBasemap: !0, thumbnail: Ee } : p && typeof p == "object" && typeof p.mapID == "string" ? { ...p } : null;
}
class Te extends EventTarget {
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
  #i;
  #t = null;
  #e = [0, 0];
  // merc
  #a = 2;
  #r = 0;
  // 度
  #m = 0;
  // 度
  #M;
  #f = !1;
  #p;
  #n = /* @__PURE__ */ new Map();
  #y;
  /** addLine／addVector で登録した線・面の登録簿（Map の挿入順が一覧の順。置き換えは末尾へ移る）。 */
  #s = /* @__PURE__ */ new Map();
  /** 自動の id の連番（clear では戻さない。Core の __vectorSeq と同じ）。 */
  #I = 0;
  #g = !1;
  /** 視点の連続変化の始まり・止まり（要素が moveStart / moveEnd に変える） */
  onMove = null;
  constructor(t) {
    super(), this.#i = t.element;
    const a = t.values, i = t.appOption;
    this.appid = a.appId ?? i.appid, this.restoreSession = !!(a.restoreSession ?? i.restoreSession);
    const l = a.restore ?? i.restore;
    l ? this.initialRestore = { ...l } : this.restoreSession && (this.initialRestore = this.#b(a.restoreExtensionKeys ?? i.restoreExtensionKeys)), a.mapId !== void 0 && (a.mapId !== this.initialRestore.mapID && delete this.initialRestore.position, this.initialRestore.mapID = a.mapId), a.transparency !== void 0 && (this.initialRestore.transparency = a.transparency), this.waitReady = this.#A(t);
  }
  // ---- 初期化 ----
  #b(t) {
    const a = {};
    try {
      const i = parseInt(localStorage.getItem("epoch") || "0", 10), l = Math.floor(Date.now() / 1e3);
      if (!i || l - i >= 3600) return a;
      if (a.mapID = localStorage.getItem("mapID") || localStorage.getItem("sourceID") || void 0, a.backgroundID = localStorage.getItem("backgroundID") || localStorage.getItem("backID") || void 0, a.position = {
        x: parseFloat(localStorage.getItem("x") || "0"),
        y: parseFloat(localStorage.getItem("y") || "0"),
        zoom: parseFloat(localStorage.getItem("zoom") || "0"),
        rotation: parseFloat(localStorage.getItem("rotation") || "0")
      }, a.transparency = parseFloat(localStorage.getItem("transparency") || "0"), a.hideMarker = parseInt(localStorage.getItem("hideMarker") || "0", 10), a.hideLayer = localStorage.getItem("hideLayer") || void 0, Array.isArray(t))
        for (const h of t) {
          if (typeof h != "string" || h in a) continue;
          const y = localStorage.getItem(h);
          y !== null && (a[h] = y);
        }
    } catch {
    }
    return a;
  }
  async #c(t, a) {
    const i = `on${t.split("-").map((h) => h[0].toUpperCase() + h.slice(1)).join("")}`, l = { phaseId: t, appData: this.appData, mapDivDocument: this.#i, core: this.#i };
    try {
      typeof a?.[i] == "function" && await a[i](l);
    } catch (h) {
      this.#o("lifecycle:error", { phaseId: t, error: h });
    }
    this.#o(`lifecycle:${t}`, l);
  }
  async #A(t) {
    const a = t.values.uiHooks ?? t.appOption.uiHooks;
    let i = t.setting;
    if (i === void 0 && this.appid) {
      const d = await fetch(`apps/${this.appid}.json`);
      if (!d.ok) throw new Error(`mock <maplat-app>: failed to load apps/${this.appid}.json (${d.status})`);
      i = await d.json();
    }
    this.appData = { ...await i }, await this.#c("setting-loaded", a), await this.#c("appdata-ready", a), await this.#c("ui-configure", a), await this.#c("core-dom-ready", a), await this.#c("ui-dom-ready", a);
    const h = (Array.isArray(this.appData.sources) ? this.appData.sources : []).map(Pe);
    this.sources = h.filter((d) => !!d && d.usable !== !1), this.#o(
      "sourceLoaded",
      h.map((d) => ({ mapID: d?.mapID ?? null, usable: !!d && d.usable !== !1 }))
    );
    const y = Array.isArray(this.appData.pois) ? this.appData.pois : [];
    if (this.#n.set("main", ee("main", { pois: y, hide: !1 }, this.appData.appName ?? "main")), this.sources.length > 0) {
      const d = this.initialRestore, g = (d.mapID && this.#d(d.mapID) ? d.mapID : void 0) ?? (this.appData.startFrom && this.#d(this.appData.startFrom) ? this.appData.startFrom : void 0) ?? this.sources[this.sources.length - 1].mapID;
      await this.changeMap(g, d);
    }
    await this.#c("core-ready", a), await this.#c("ui-ready", a);
  }
  // ---- 道具 ----
  #o(t, a) {
    this.#g || this.dispatchEvent(new CustomEvent(t, { detail: a }));
  }
  #d(t) {
    return t ? this.sources.find((a) => a.mapID === t) : void 0;
  }
  #L() {
    const [t, a] = q(this.#e[0], this.#e[1]);
    return {
      x: this.#e[0],
      y: this.#e[1],
      longitude: t,
      latitude: a,
      mercator_x: this.#e[0],
      mercator_y: this.#e[1],
      zoom: this.#a,
      mercZoom: this.#a,
      direction: this.#m,
      rotation: this.#r
    };
  }
  #l() {
    this.onMove?.("start"), this.#o("changeViewpoint", this.#L()), setTimeout(() => this.onMove?.("end"), 30);
  }
  /** 要素の矩形（大きさが無ければ null） */
  #u() {
    const t = this.#i.getBoundingClientRect();
    return t.width > 0 && t.height > 0 ? t : null;
  }
  pixelToLngLat(t, a) {
    const i = this.#u();
    if (!i) return null;
    const l = H(this.#a), h = this.#e[0] + (t - i.width / 2) * l, y = this.#e[1] - (a - i.height / 2) * l, [d, g] = q(h, y);
    return { longitude: d, latitude: g };
  }
  // ---- 旧クラスと同じ 44 のメソッド ----
  handleGPS(t, a) {
    this.#f = !!t, t ? this.#o("gps_request", void 0) : a || this.#o("gps_result", { error: "gps_off" });
  }
  getGPSEnabled() {
    return this.#f;
  }
  getRotation() {
    return this.#r;
  }
  getDirection() {
    return this.#m;
  }
  currentMapInfo() {
    return this.#t ? this.getMapMeta(this.#t.mapID) : void 0;
  }
  mapInfo(t) {
    return this.getMapMeta(t);
  }
  async clientPointToLngLat(t, a) {
    const i = this.#u();
    if (!(!i || !this.#t))
      return this.pixelToLngLat(t - i.left, a - i.top) ?? void 0;
  }
  async lngLatToClientPoint(t, a) {
    const i = this.#u();
    if (!i || !this.#t) return;
    const [l, h] = C(t, a), y = H(this.#a);
    return {
      x: i.left + i.width / 2 + (l - this.#e[0]) / y,
      y: i.top + i.height / 2 - (h - this.#e[1]) / y
    };
  }
  selectMarker(t) {
    this.#y = t;
  }
  unselectMarker() {
    this.#y = void 0;
  }
  getMarker(t) {
    for (const a of this.#n.values()) {
      const i = a.pois.find((l) => l.namespaceID === t || l.id === t);
      if (i) return i;
    }
  }
  updateMarker(t, a, i) {
    const l = this.getMarker(t);
    if (l) {
      if (i)
        for (const h of Object.keys(l)) h !== "id" && h !== "namespaceID" && delete l[h];
      return Object.assign(l, a), t;
    }
  }
  addMarker(t, a = "main") {
    const i = this.#n.get(a);
    if (!i) return;
    const l = re(t);
    return i.pois.push(l), se(i), this.#h(), l.namespaceID;
  }
  removeMarker(t) {
    for (const a of this.#n.values()) {
      const i = a.pois.findIndex((l) => l.namespaceID === t || l.id === t);
      if (i >= 0) {
        a.pois.splice(i, 1), this.#h();
        return;
      }
    }
  }
  clearMarker(t) {
    for (const a of this.#n.values()) (!t || a.id === t) && (a.pois = []);
    this.#h();
  }
  showAllMarkers() {
    this.requestUpdateState({ hideMarker: 0 });
  }
  hideAllMarkers() {
    this.requestUpdateState({ hideMarker: 1 });
  }
  listPoiLayers(t = !1, a = !1) {
    return [...this.#n.values()].filter(
      (i) => a ? i.pois.length > 0 && (!t || !!i.hide) : !t || !!i.hide
    );
  }
  showPoiLayer(t) {
    const a = this.#n.get(t);
    a && (a.hide = !1), this.#w();
  }
  hidePoiLayer(t) {
    const a = this.#n.get(t);
    a && (a.hide = !0), this.#w();
  }
  getPoiLayer(t) {
    return this.#n.get(t);
  }
  addPoiLayer(t, a) {
    this.#n.has(t) || t === "main" || this.#n.set(t, ee(t, a, t));
  }
  removePoiLayer(t) {
    t !== "main" && this.#n.delete(t);
  }
  // nov26-m4-t5（#91）: 線を足して id を返す。data.id があればその id、無ければ自動の id。
  // 呼び手の data は変えず、写しに setLine と同じ正規化（type・stroke → style）をする（Core と同じ）。
  addLine(t) {
    const a = { ...t, type: "Line" };
    return !a.style && a.stroke && (a.style = {
      stroke: a.stroke
    }), delete a.id, this.#v(t.id, a);
  }
  // 線・面を足して id を返す（data.type が "Line" または未指定なら線、それ以外は面）
  addVector(t) {
    const a = { ...t };
    return delete a.id, this.#v(t.id, a);
  }
  // id の 1 件だけを消す。消したら true、無ければ false
  removeVector(t) {
    return this.#s.delete(t);
  }
  // removeVector の別名（種類で絞らない）
  removeLine(t) {
    return this.removeVector(t);
  }
  // 引数なしは線も面も全部消す。filter.type で線だけ・面だけを消す
  clearLine(t) {
    this.clearVector(t);
  }
  clearVector(t) {
    const a = t?.type;
    if (!a) {
      this.#s.clear();
      return;
    }
    for (const i of Array.from(this.#s.values()))
      i.kind === a && this.#s.delete(i.id);
  }
  // addLine／addVector で登録した線・面の data（写し）の配列。読み取り専用（Core の getter と同じ）
  get vectors() {
    return Array.from(this.#s.values()).map((t) => t.data);
  }
  /** 登録簿に 1 件足す（既にある id なら置き換え、末尾＝描画では最前面へ移る）。 */
  #v(t, a) {
    let i;
    if (t != null)
      i = String(t);
    else
      do
        i = `vector_${++this.#I}`;
      while (this.#s.has(i));
    return this.#s.delete(i), this.#s.set(i, {
      id: i,
      data: a,
      kind: a.type === void 0 || a.type === "Line" ? "Line" : "Polygon"
    }), i;
  }
  setGPSMarker(t) {
  }
  changeMap(t, a = {}) {
    const i = this.#d(t);
    if (!i) return Promise.resolve();
    const l = !this.#t;
    this.#t = i;
    const h = i.homePosition ?? this.appData?.homePosition ?? [139.7, 35.7];
    if (l && (this.#e = C(h[0], h[1]), this.#a = i.defaultZoom ?? this.appData?.defaultZoom ?? 14), a.position && typeof a.position.x == "number" && typeof a.position.y == "number" && (this.#e = [a.position.x, a.position.y], typeof a.position.zoom == "number" && a.position.zoom > 0 && (this.#a = a.position.zoom)), this.requestUpdateState({ mapID: i.mapID }), this.#o("mapChanged", this.getMapMeta(i.mapID)), this.setTransparency(a.transparency ?? this.getTransparency()), a.hideLayer) {
      for (const y of a.hideLayer.split(",")) {
        const d = this.#n.get(y);
        d && (d.hide = !0);
      }
      this.#w();
    }
    return a.hideMarker && this.hideAllMarkers(), this.#h(), this.#l(), Promise.resolve();
  }
  requestUpdateState(t) {
    if (this.stateBuffer = Object.assign(this.stateBuffer, t), this.restoreSession)
      try {
        localStorage.setItem("epoch", `${Math.floor(Date.now() / 1e3)}`);
        for (const [a, i] of Object.entries(t))
          if (a === "position" && i && typeof i == "object")
            for (const [l, h] of Object.entries(i)) localStorage.setItem(l, String(h));
          else
            localStorage.setItem(a, String(i));
      } catch {
      }
    this.#p && clearTimeout(this.#p), this.#p = setTimeout(() => {
      this.#p = void 0, this.#o("updateState", { ...this.stateBuffer });
    }, 50);
  }
  setTransparency(t) {
    this.#M = t, this.requestUpdateState({ transparency: t });
  }
  getTransparency() {
    return this.#M ?? 0;
  }
  setViewpoint(t) {
    typeof t.longitude == "number" && typeof t.latitude == "number" && (this.#e = C(t.longitude, t.latitude));
    const a = t.mercZoom ?? t.zoom;
    typeof a == "number" && (this.#a = a), typeof t.rotation == "number" && (this.#r = t.rotation), typeof t.direction == "number" && (this.#m = t.direction), this.#l();
  }
  goHome() {
    const t = this.#t?.homePosition ?? this.appData?.homePosition;
    t && (this.#e = C(t[0], t[1])), this.#a = this.#t?.defaultZoom ?? this.appData?.defaultZoom ?? this.#a, this.#l();
  }
  resetRotation() {
    this.#r = 0, this.#l();
  }
  resetDirection() {
    this.#m = 0, this.#l();
  }
  resetCirculation() {
    this.#r = 0, this.#m = 0, this.#l();
  }
  getMapMeta(t) {
    const a = t ? this.#d(t) : this.#t;
    if (a)
      return { ...a.meta || {}, mapID: a.mapID, label: a.label ?? a.mapID };
  }
  getMapCacheEnable(t) {
    return !!(t ? this.#d(t) : this.#t)?.cacheEnable;
  }
  async getMapTileCacheStatsAsync(t) {
    if (!this.getMapCacheEnable(t)) return {};
    const i = (t ? this.#d(t) : this.#t)?.tileCacheTotal;
    return typeof i == "number" ? { size: 0, count: 0, total: i } : { size: 0, count: 0 };
  }
  async getMapTileCacheSizeAsync(t) {
    return (await this.getMapTileCacheStatsAsync(t)).size || 0;
  }
  async clearMapTileCacheAsync(t) {
  }
  async fetchAllMapTileCacheAsync(t, a) {
    if (!this.getMapCacheEnable(t)) {
      a("stop", {});
      return;
    }
    a("proceed", { processed: 0, total: 0 }), a("finish", { processed: 0, total: 0, size: 0, count: 0 });
  }
  async cancelMapTileCacheAsync(t) {
  }
  // ---- 要素から呼ぶもの ----
  /**
   * 要素の上のクリック（タップ）。マーカー（既定のピンの大きさ・下端の中央が POI の位置）に当たれば
   * clickMarker と、その直後に同期で clickMarkers（重なる全部。1 件でも出す）を出す。当たらなければ clickMap*。
   */
  tapAt(t, a) {
    const i = this.#u();
    if (!i || !this.#t || this.#g) return;
    const l = H(this.#a), h = !!this.stateBuffer.hideMarker, y = [];
    if (!h) {
      for (const P of this.#n.values())
        if (!P.hide)
          for (const T of P.pois) {
            const D = T.lnglat;
            if (!Array.isArray(D) || !Number.isFinite(D[0]) || !Number.isFinite(D[1])) continue;
            const [L, A] = C(D[0], D[1]), r = i.left + i.width / 2 + (L - this.#e[0]) / l, e = i.top + i.height / 2 - (A - this.#e[1]) / l, o = t - r, n = a - e;
            Math.abs(o) <= ke[0] / 2 && n <= 0 && n >= -36 && y.push(T);
          }
    }
    if (y.length > 0) {
      this.#o("clickMarker", y[0]), this.#o("clickMarkers", y);
      return;
    }
    const d = this.#e[0] + (t - i.left - i.width / 2) * l, g = this.#e[1] - (a - i.top - i.height / 2) * l;
    this.#o("clickMapXy", [d, g]), this.#o("clickMapMerc", [d, g]);
    const [b, u] = q(d, g);
    this.#o("clickMap", { longitude: b, latitude: u });
  }
  zoomBy(t) {
    this.#a += t, this.#l();
  }
  viewExtent() {
    const t = this.#u();
    if (!t || !this.#t) return null;
    const i = [
      [0, 0],
      [t.width, 0],
      [t.width, t.height],
      [0, t.height]
    ].map(([l, h]) => this.pixelToLngLat(l, h));
    return i.every(Boolean) ? i : null;
  }
  remove() {
    this.#g = !0, this.#p && clearTimeout(this.#p);
  }
  // ---- 試験から読む・起こすもの（getMockLayerAController 経由）----
  /** 選択中のマーカー（selectMarker の引数）。 */
  get selectedMarker() {
    return this.#y;
  }
  /** 中身からイベントを出す（例: outOfMap・clickMarkers・gps_result・gps_error）。 */
  fire(t, a) {
    this.#o(t, a);
  }
  /** GPS の状態を中身の都合で変える（handleGPS(false, true) 相当の内部の切替）。 */
  setGpsEnabledInternally(t) {
    this.#f = t, this.#o("gps_result", t ? { lnglat: [0, 0], acc: 10 } : { error: "gps_out_hide" });
  }
  #h() {
    let t = 0;
    for (const a of this.#n.values()) a.hide || (t += a.pois.length);
    this.#o("poi_number", t);
  }
  #w() {
    const t = [...this.#n.values()].filter((a) => a.hide).map((a) => a.id);
    this.requestUpdateState({ hideLayer: t.join(",") });
  }
}
const ce = /* @__PURE__ */ new WeakMap();
function te(p) {
  return ce.get(p)?.() ?? null;
}
function xe(p = {}) {
  const t = p.implementation ?? "core", a = p.version ?? "0.0.0-mock", i = Object.freeze({
    ...ne(t),
    ...Object.fromEntries(
      Object.entries(p.features ?? {}).filter(([, y]) => typeof y == "boolean")
    )
  }), l = i["display-mode"] === !0;
  class h extends Ie {
    implementation = t;
    version = a;
    #i = [];
    #t = null;
    #e;
    #a = !1;
    #r = null;
    constructor() {
      if (super(), this.addEventListener("pointerdown", (d) => {
        d.pointerType === "mouse" && d.button !== 0 || (this.#r = { pointerId: d.pointerId, x: d.clientX, y: d.clientY, t: d.timeStamp });
      }), this.addEventListener("pointerup", (d) => {
        const g = this.#r;
        if (this.#r = null, !g || g.pointerId !== d.pointerId || Math.hypot(d.clientX - g.x, d.clientY - g.y) >= 9 || d.timeStamp - g.t > 250) return;
        const b = this.currentImplementation();
        b && this.isImplementationReady() && b.tapAt(d.clientX, d.clientY);
      }), typeof this.attachShadow == "function") {
        const d = this.attachShadow({ mode: "closed" }), g = document.createElement("div");
        g.style.cssText = "font:12px system-ui;color:#555;padding:4px;", g.textContent = "maplat-app (mock)", d.appendChild(g), this.#t = g;
      }
      ce.set(this, () => this.currentImplementation());
    }
    features() {
      return i;
    }
    forwardedEvents() {
      return l ? [...G, ...ve.map((d) => d.event)] : G;
    }
    createImplementation(d) {
      const g = new Te(d);
      return g.envelopes = this.#i, l && typeof d.values.displayMode == "string" && (g.displayMode = d.values.displayMode), g.onMove = (b) => {
        if (b === "start") {
          this.#e && clearTimeout(this.#e), this.#a || (this.#a = !0, this.dispatchLayerAEvent("moveStart", {}));
          return;
        }
        this.#e && clearTimeout(this.#e), this.#e = setTimeout(() => {
          this.#e = void 0, this.#a && (this.#a = !1, this.dispatchLayerAEvent("moveEnd", this.viewpoint));
        }, 150);
      }, g;
    }
    onImplementationEvent(d, g) {
      d === "mapChanged" && this.#t && (this.#t.textContent = `maplat-app (mock): ${g?.mapID ?? "-"}`);
    }
    onImplementationDetached(d) {
      this.#e && clearTimeout(this.#e), this.#a = !1;
    }
    applyRuntimeChanges(d, g, b) {
      if (l && g.has("displayMode")) {
        const u = b("displayMode", void 0, "maplat");
        u !== d.displayMode && (d.displayMode = u, d.fire("modechange", { mode: u }));
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
      this.#i = Array.isArray(d) ? d.map((b) => ({ ...b })) : [];
      const g = this.currentImplementation();
      g && (g.envelopes = this.#i);
    }
    getMapEnvelope(d) {
      const b = this.currentImplementation()?.sources.find((u) => u.mapID === d);
      return !b || !Array.isArray(b.envelope) || b.envelope.length < 3 ? null : b.envelope.map(([u, P]) => ({ longitude: u, latitude: P }));
    }
    getViewExtent() {
      const d = this.currentImplementation();
      return d && this.isImplementationReady() ? d.viewExtent() : null;
    }
    zoomBy(d) {
      this.requireImplementation("zoomBy").zoomBy(d);
    }
    getDefaultPinIcon(d = !1) {
      return d ? Se : De;
    }
  }
  return l && Object.defineProperties(h.prototype, {
    setDisplayMode: {
      configurable: !0,
      writable: !0,
      value(y) {
        const d = te(this);
        if (!d)
          throw new DOMException("<maplat-app>.setDisplayMode(): the map is not created yet.", "InvalidStateError");
        return d.displayMode !== y && (d.displayMode = y, d.fire("modechange", { mode: y })), Promise.resolve();
      }
    },
    getDisplayMode: {
      configurable: !0,
      writable: !0,
      value() {
        const y = te(this);
        return y ? y.displayMode : null;
      }
    }
  }), h;
}
function Oe(p = ae, t = {}) {
  const a = typeof customElements < "u" ? customElements.get(p) : void 0;
  if (a)
    return Y(a, p, "the mock layer A"), a;
  const i = xe(t);
  return Y(i, p, "the mock layer A"), i;
}
export {
  _ as ConformanceError,
  Te as MockLayerAApp,
  oe as createLayerAConformanceCases,
  xe as createMockMaplatAppClass,
  Oe as defineMockMaplatApp,
  te as getMockLayerAController,
  Ve as runLayerAConformance,
  $e as runLayerAConformanceInPage
};
//# sourceMappingURL=maplat_core_conformance.js.map
