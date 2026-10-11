import { assets as f, MaplatApp as v } from "./maplat_core.js";
import { defineMaplatAppElementOnce as y, MaplatAppElementBase as A } from "./maplat_core_common.js";
import { featuresOf as I, ELEMENT_ATTRIBUTES as M, ELEMENT_PROPERTIES as T, MAPLAT_APP_TAG as g } from "./maplat_core_common.js";
import { ELEMENT_ATTRIBUTES as C, ELEMENT_OWN_EVENTS as F, ELEMENT_OWN_METHODS as j, ELEMENT_PROPERTIES as B, ELEMENT_STARTUP_KEYS as U, LAYER_A_PRO_ATTRIBUTES as z, MAPLAT_APP_EVENTS as H, MAPLAT_APP_METHODS as K, MAPLAT_APP_TAG as V } from "./maplat_core_common.js";
const _ = ["ALL", "OFF"], c = {
  ALL: -99,
  DEBUG: -1,
  INFO: 0,
  WARN: 1,
  ERROR: 2,
  OFF: 99
};
class O {
  constructor(e = c.INFO) {
    this.level = e, this.make();
  }
  level;
  make() {
    const e = Object.keys(c).filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (t) => !_.includes(t)
    );
    for (const t of e) {
      const n = c[t], r = t.toLowerCase();
      this[r] = this.level <= n ? console.log : () => {
      };
    }
  }
}
const P = "1.1.0", b = Object.freeze(I("core")), d = 6378137;
function E(l) {
  let e = l[0] / d * 180 / Math.PI;
  const t = (2 * Math.atan(Math.exp(l[1] / d)) - Math.PI / 2) * 180 / Math.PI;
  return (e < -180 || e > 180) && (e = ((e + 180) % 360 + 360) % 360 - 180), [e, t];
}
const h = (l) => Array.isArray(l) && Number.isFinite(l[0]) && Number.isFinite(l[1]);
class L extends A {
  /** 実装の種別（§3.6）。有償版は "core-pro"。 */
  implementation = "core";
  /** 実装の版（@maplat/core の版）。 */
  version = P;
  // 枠線（setEnvelopes）の最後の指定。地図を切り替えたら描き直す
  #t = [];
  #a = 0;
  // 画面の 4 隅の経緯度（changeViewpoint のたびに非同期で求めて控える。getViewExtent は同期）
  #e = null;
  #n = 0;
  #r = null;
  #s = null;
  /**
   * 内部の MaplatApp。
   * @internal 移行期の逃げ道（§9.3）。層 A の公開面に含めない。メジャー版で消す。
   */
  get app() {
    return this.currentImplementation();
  }
  // ---- 新設メソッド（§3.4.2）----
  /** 使える地図の一覧（設定ファイルの sources の順）。地図の準備前は []。 */
  listMaps() {
    const e = this.currentImplementation();
    return e?.cacheHash ? Object.entries(e.cacheHash).map(([t, n]) => ({
      mapID: n.mapID ?? t,
      label: n.label ?? n.mapID ?? t,
      thumbnail: n.thumbnail ?? null,
      isBasemap: !!n.isBasemap?.(),
      isOldMap: !(n.isWmts?.() ?? !0),
      isOverlay: !!n.isWmts?.() && !n.isBasemap?.(),
      hasEnvelope: !!n.envelope,
      cacheEnable: !!e.getMapCacheEnable?.(n.mapID ?? t)
    })) : [];
  }
  /** 表示中の地図の mapID（前面の source の mapID）。 */
  get currentMapId() {
    return this.currentImplementation()?.from?.mapID ?? null;
  }
  /** 地図の範囲（経緯度の多角形。最後の頂点は最初の頂点を繰り返さない）。範囲を持たない地図は null。 */
  getMapEnvelope(e) {
    const n = this.currentImplementation()?.cacheHash?.[e]?.envelope?.geometry?.coordinates?.[0];
    if (!Array.isArray(n) || n.length < 3) return null;
    const r = n.filter(h);
    if (r.length > 1) {
      const [a, o] = [r[0], r[r.length - 1]];
      a[0] === o[0] && a[1] === o[1] && r.pop();
    }
    return r.map((a) => {
      const [o, s] = E(a);
      return { longitude: o, latitude: s };
    });
  }
  /**
   * 画面の 4 隅の経緯度（左上・右上・右下・左下）。地図の準備前・変換できないときは null。
   * Core の座標変換は非同期なので、視点が変わるたび（changeViewpoint）に求めて控えた値を返す。
   */
  getViewExtent() {
    return this.#e ? this.#e.map((e) => ({ ...e })) : null;
  }
  /** 地図の範囲（枠線・塗り）を描く。空配列で消す。地図を切り替えると今の地図の座標で描き直す。 */
  setEnvelopes(e) {
    this.#t = Array.isArray(e) ? e.map((t) => ({ ...t })) : [], this.#i();
  }
  /** 既定のピンの画像（POI にも祖先にも icon が無いマーカーに地図が描く画像。Core の parts/defaultpin*.png）。 */
  getDefaultPinIcon(e = !1) {
    return e ? f.defaultpin_selected : f.defaultpin;
  }
  /** 現在の地図の zoom を delta だけ変える。 */
  zoomBy(e) {
    const t = this.requireImplementation("zoomBy").mapObject?.getView?.();
    if (!t) return;
    const n = t.getZoom();
    typeof n == "number" && (typeof t.animate == "function" ? t.animate({ zoom: n + e, duration: 250 }) : t.setZoom(n + e));
  }
  /**
   * MaplatApp の生成（テスト用の差し替え口）。
   * @internal
   */
  createCore(e) {
    return new v(e);
  }
  // ---- 基底クラスの hook ----
  features() {
    return b;
  }
  /** MaplatApp に渡す appOption を組む（§6.1: 個別のキー ＞ appOption ＞ 設定ファイル ＞ 既定値）。 */
  createImplementation(e) {
    const t = { ...e.appOption };
    for (const [r, a] of Object.entries(e.values)) {
      const o = S.get(r);
      o && (t[o] = a);
    }
    t.div = e.element, t.__maplatElementMode = !0, e.setting !== void 0 && (t.setting = e.setting);
    const n = {};
    return e.values.mapId !== void 0 && (n.mapID = e.values.mapId), e.values.transparency !== void 0 && (n.transparency = e.values.transparency), Object.keys(n).length > 0 && (t.__restoreOverride = n), this.createCore(t);
  }
  onImplementationCreated(e) {
    this.#r = null, this.#e = null;
  }
  onImplementationReady(e) {
    this.#l(e), this.#t.length > 0 && this.#i();
  }
  onImplementationDetached(e) {
    this.#s?.(), this.#s = null, this.#e = null, this.#a++, this.#n++;
  }
  disposeImplementation(e) {
    const t = e;
    t.mapObject?.setTarget?.(void 0), t.backMap?.setTarget?.(void 0), t.maplibreMap?.remove?.(), t.remove();
  }
  onImplementationEvent(e, t, n) {
    e === "changeViewpoint" && this.#o(n), e === "mapChanged" && this.#t.length > 0 && this.#i();
  }
  onResize(e) {
    const t = e;
    t.mapObject?.updateSize?.(), t.backMap?.updateSize?.();
  }
  convertEventDetail(e, t, n) {
    if (e === "sourceLoaded" && Array.isArray(t)) {
      const r = n.cacheHash || {};
      return t.map((a) => ({
        mapID: a?.mapID ?? null,
        usable: !!(a && r[a.mapID] === a)
      }));
    }
    return super.convertEventDetail(e, t, n);
  }
  applyRuntimeChanges(e, t, n) {
    const r = e, a = r.mapObject;
    t.has("northUp") && a && (a.northUp = n("northUp", "northUp", !1)), t.has("homeMarginPixels") && a && (a.homeMarginPixels = n("homeMarginPixels", "homeMarginPixels", 50)), t.has("debug") && (r.logger = new O(n("debug", "debug", !1) ? c.ALL : c.INFO));
    let o = !1;
    for (const s of ["icon", "selectedIcon"])
      t.has(s) && (r[s] = n(s, s, void 0), o = !0);
    for (const s of ["poiTemplate", "poiStyle", "iconTemplate"])
      t.has(s) && (r[s] = n(s, s, r.appData?.[s] ?? !1), o = !0);
    o && r.from && r.redrawMarkers?.();
  }
  /** 中心の目印（U5）。既定で表示。no-center-marker で消し、center-marker-src で画像を差し替える。 */
  applyDomKeys() {
    const e = this.querySelector(":scope > .maplat-center-marker");
    if (!e) return;
    this.#r == null && (this.#r = e.getAttribute("src") || "");
    const t = this.readKey("noCenterMarker") === !0;
    e.hidden = t, e.style.display = t ? "none" : "";
    const n = this.readKey("centerMarkerSrc");
    n ? (e.setAttribute("src", n), e.style.margin = "0", e.style.transform = "translate(-50%, -50%)", e.classList.add("maplat-center-marker--custom")) : (e.setAttribute("src", this.#r), e.style.margin = "-10px 0 0 -10px", e.style.transform = "", e.classList.remove("maplat-center-marker--custom"));
  }
  // ---- 内部 ----
  /** 画面の 4 隅を今の地図の座標 → merc → 経緯度にして控える。 */
  async #o(e) {
    const t = ++this.#n, n = e.mapObject, r = e.from, a = n?.getSize?.();
    if (!n || !r || !a || !(a[0] > 0 && a[1] > 0)) return;
    const o = [
      [0, 0],
      [a[0], 0],
      [a[0], a[1]],
      [0, a[1]]
    ];
    try {
      const s = o.map((p) => n.getCoordinateFromPixel(p));
      if (!s.every(h)) return;
      const i = await Promise.all(s.map((p) => r.sysCoord2MercAsync(p)));
      if (t !== this.#n) return;
      if (!i.every(h)) {
        this.#e = null;
        return;
      }
      this.#e = i.map((p) => {
        const [m, u] = E(p);
        return { longitude: m, latitude: u };
      });
    } catch {
      t === this.#n && (this.#e = null);
    }
  }
  /** setEnvelopes の指定を今の地図に描く（旧 UI の updateEnvelope と同じ規則。§3.7）。 */
  async #i() {
    const e = ++this.#a, t = this.currentImplementation();
    if (!t || !this.isImplementationReady()) return;
    const n = t.mapObject, r = t.from;
    if (!n || !r) return;
    const a = this.#t, o = await Promise.all(
      a.map(async (s) => {
        const i = t.cacheHash?.[s.mapID];
        if (!i) return null;
        try {
          let p;
          if (s.mapID === r.mapID && typeof i.xy2SysCoord == "function" && i.width && i.height)
            p = [
              [0, 0],
              [i.width, 0],
              [i.width, i.height],
              [0, i.height],
              [0, 0]
            ].map((m) => i.xy2SysCoord(m));
          else {
            const m = i.envelope?.geometry?.coordinates?.[0];
            if (!Array.isArray(m)) return null;
            p = await Promise.all(m.map((u) => r.merc2SysCoordAsync(u)));
          }
          return p.every(h) ? { spec: s, xys: p } : null;
        } catch {
          return null;
        }
      })
    );
    if (!(e !== this.#a || this.currentImplementation() !== t)) {
      n.resetEnvelope();
      for (const s of o) {
        if (!s) continue;
        const { spec: i, xys: p } = s;
        i.stroke && n.setEnvelope(p, {
          color: i.stroke.color,
          width: i.stroke.width ?? 2,
          ...i.stroke.lineDash ? { lineDash: i.stroke.lineDash } : {}
        }), i.fill && n.setFillEnvelope(p, null, { color: i.fill });
      }
    }
  }
  /** moveStart / moveEnd（§3.5。止まって 150 ms 後に moveEnd）。 */
  #l(e) {
    const t = e.mapObject;
    if (!t?.on) return;
    let n, r = !1;
    const a = () => {
      n && (clearTimeout(n), n = void 0), !r && (r = !0, this.dispatchLayerAEvent("moveStart", {}));
    }, o = () => {
      n && clearTimeout(n), n = setTimeout(() => {
        n = void 0, r && (r = !1, this.dispatchLayerAEvent("moveEnd", this.viewpoint));
      }, 150);
    };
    t.on("movestart", a), t.on("moveend", o), this.#s = () => {
      n && clearTimeout(n), t.un?.("movestart", a), t.un?.("moveend", o);
    };
  }
}
const S = new Map(
  [...M, ...T].filter((l) => l.option).map((l) => [l.prop, l.option])
);
function w(l = g) {
  y(L, l, "@maplat/core/element");
}
w();
export {
  C as ELEMENT_ATTRIBUTES,
  F as ELEMENT_OWN_EVENTS,
  j as ELEMENT_OWN_METHODS,
  B as ELEMENT_PROPERTIES,
  U as ELEMENT_STARTUP_KEYS,
  z as LAYER_A_PRO_ATTRIBUTES,
  H as MAPLAT_APP_EVENTS,
  K as MAPLAT_APP_METHODS,
  V as MAPLAT_APP_TAG,
  L as MaplatAppElement,
  w as defineMaplatAppElement
};
//# sourceMappingURL=maplat_core_element.js.map
