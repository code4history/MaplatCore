import { mercToLngLat as u, defaultPinIcon as f, MaplatApp as d } from "./maplat_core.js";
import { defineMaplatAppElementOnce as v, MaplatAppElementBase as y } from "./maplat_core_common.js";
import { featuresOf as A, ELEMENT_ATTRIBUTES as T, ELEMENT_PROPERTIES as _, MAPLAT_APP_TAG as I } from "./maplat_core_common.js";
import { ELEMENT_ATTRIBUTES as L, ELEMENT_OWN_EVENTS as k, ELEMENT_OWN_METHODS as x, ELEMENT_PROPERTIES as C, ELEMENT_STARTUP_KEYS as N, LAYER_A_PRO_ATTRIBUTES as j, MAPLAT_APP_EVENTS as B, MAPLAT_APP_METHODS as U, MAPLAT_APP_TAG as V } from "./maplat_core_common.js";
const M = "1.1.0", O = Object.freeze(A("core")), c = (l) => Array.isArray(l) && Number.isFinite(l[0]) && Number.isFinite(l[1]);
class P extends y {
  /** 実装の種別（§3.6）。有償版は "core-pro"。 */
  implementation = "core";
  /** 実装の版（@maplat/core の版）。 */
  version = M;
  // 枠線（setEnvelopes）の最後の指定。地図を切り替えたら描き直す
  #t = [];
  #i = 0;
  // 画面の 4 隅の経緯度（changeViewpoint のたびに非同期で求めて控える。getViewExtent は同期）
  #e = null;
  #n = 0;
  #r = null;
  // 互換モード（旧クラス MaplatApp の読み方・警告に合わせる）。appOption.__maplatCompat = true のときだけ
  #o = !1;
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
    return e?.cacheHash ? Object.entries(e.cacheHash).map(([n, t]) => ({
      mapID: t.mapID ?? n,
      label: t.label ?? t.mapID ?? n,
      thumbnail: t.thumbnail ?? null,
      isBasemap: !!t.isBasemap?.(),
      isOldMap: !(t.isWmts?.() ?? !0),
      isOverlay: !!t.isWmts?.() && !t.isBasemap?.(),
      hasEnvelope: !!t.envelope,
      cacheEnable: !!e.getMapCacheEnable?.(t.mapID ?? n)
    })) : [];
  }
  /** 地図の範囲（経緯度の多角形。最後の頂点は最初の頂点を繰り返さない）。範囲を持たない地図は null。 */
  getMapEnvelope(e) {
    const t = this.currentImplementation()?.cacheHash?.[e]?.envelope?.geometry?.coordinates?.[0];
    if (!Array.isArray(t) || t.length < 3) return null;
    const i = t.filter(c);
    if (i.length > 1) {
      const [o, r] = [i[0], i[i.length - 1]];
      o[0] === r[0] && o[1] === r[1] && i.pop();
    }
    return i.map((o) => {
      const [r, s] = u(o);
      return { longitude: r, latitude: s };
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
    this.#t = Array.isArray(e) ? e.map((n) => ({ ...n })) : [], this.#a();
  }
  /** 既定のピンの画像（POI にも祖先にも icon が無いマーカーに地図が描く画像。Core の parts/defaultpin*.png）。 */
  getDefaultPinIcon(e = !1) {
    return f(e);
  }
  /** 現在の地図の zoom を delta だけ変える。 */
  zoomBy(e) {
    const n = this.requireImplementation("zoomBy").mapObject?.getView?.();
    if (!n) return;
    const t = n.getZoom();
    typeof t == "number" && (typeof n.animate == "function" ? n.animate({ zoom: t + e, duration: 250 }) : n.setZoom(t + e));
  }
  /**
   * MaplatApp の生成（テスト用の差し替え口）。
   * @internal
   */
  createCore(e) {
    return new d(e);
  }
  // ---- 基底クラスの hook ----
  features() {
    return O;
  }
  /**
   * 互換モードでは、要素の機能系キーの getter が Core の実際の値（設定ファイルから読んだ値を含む）を返す。
   * 通常モードは undefined（基底の既定）を返し、今までどおり属性・起動時の値を返す（挙動を変えない）。
   * 旧クラス互換層の <maplat-ui> は this.#app?.northUp を読むので、地図とコンパスを食い違わせない。
   * Core 固有の読み口はここに置く（element_base.ts は Core-Pro と共有する土台なので、口だけを置く）。
   */
  implementationKeyValue(e, n) {
    if (!this.#o) return;
    const t = n;
    let i;
    switch (e) {
      case "northUp":
        i = t.mapObject?.northUp;
        break;
      case "homeMarginPixels":
        i = t.mapObject?.homeMarginPixels;
        break;
      case "tapDuration":
        i = t.mapObject?.tapDuration;
        break;
      case "tapUIVanish":
        i = t.mapObject?.tapUIVanish;
        break;
      case "noRotate":
        i = t.noRotate;
        break;
      default:
        return;
    }
    return i === void 0 ? void 0 : { value: i };
  }
  /** MaplatApp に渡す appOption を組む（§6.1: 個別のキー ＞ appOption ＞ 設定ファイル ＞ 既定値）。 */
  createImplementation(e) {
    const n = { ...e.appOption };
    for (const [i, o] of Object.entries(e.values)) {
      const r = h.get(i);
      r && (n[r] = o);
    }
    n.div = e.element, this.#o = e.appOption?.__maplatCompat === !0, n.__maplatElementMode = e.appOption?.__maplatCompat !== !0, e.setting !== void 0 && (n.setting = e.setting);
    const t = {};
    return e.values.mapId !== void 0 && (t.mapID = e.values.mapId), e.values.transparency !== void 0 && (t.transparency = e.values.transparency), Object.keys(t).length > 0 && (n.__restoreOverride = t), this.createCore(n);
  }
  onImplementationCreated(e) {
    this.#e = null;
  }
  onImplementationReady(e) {
    this.#l(e), this.#t.length > 0 && this.#a();
  }
  onImplementationDetached(e) {
    this.#r?.(), this.#r = null, this.#e = null, this.#i++, this.#n++;
  }
  onImplementationEvent(e, n, t) {
    e === "changeViewpoint" && this.#s(t), e === "mapChanged" && this.#t.length > 0 && this.#a();
  }
  onResize(e) {
    e.updateSize?.();
  }
  convertEventDetail(e, n, t) {
    return e === "sourceLoaded" && Array.isArray(n) ? t.sourceLoadedDetail(n) : super.convertEventDetail(e, n, t);
  }
  applyRuntimeChanges(e, n, t) {
    const i = {};
    for (const o of [
      "northUp",
      "homeMarginPixels",
      "debug",
      "icon",
      "selectedIcon",
      "poiTemplate",
      "poiStyle",
      "iconTemplate"
    ]) {
      if (!n.has(o)) continue;
      const r = h.get(o);
      i[r ?? o] = t(o, r, void 0);
    }
    Object.keys(i).length > 0 && e.applyRuntimeOptions(i);
  }
  /** 中心の目印（U5）。既定で表示。no-center-marker で消し、center-marker-src で画像を差し替える。 */
  applyDomKeys() {
    const e = this.currentImplementation();
    e && e.setCenterMarker({
      hidden: this.readKey("noCenterMarker") === !0,
      src: this.readKey("centerMarkerSrc") ?? null
    });
  }
  // ---- 内部 ----
  /**
   * 画面の 4 隅を今の地図の座標 → merc → 経緯度にして控える。
   * 4 隅の作り方・大きさの点検・undefined（据え置き）/null（消す）の意味づけはここに残す（A7・Minor 1）。
   */
  async #s(e) {
    const n = ++this.#n, t = e, i = t.viewportSize();
    if (!i) return;
    const o = [
      [0, 0],
      [i[0], 0],
      [i[0], i[1]],
      [0, i[1]]
    ];
    try {
      const r = await Promise.all(o.map((s) => t.pixelToMerc(s)));
      if (n !== this.#n || r.some((s) => s === void 0)) return;
      if (!r.every(c)) {
        this.#e = null;
        return;
      }
      this.#e = r.map((s) => {
        const [a, p] = u(s);
        return { longitude: a, latitude: p };
      });
    } catch {
      n === this.#n && (this.#e = null);
    }
  }
  /** setEnvelopes の指定を今の地図に描く（旧 UI の updateEnvelope と同じ規則。§3.7）。 */
  async #a() {
    const e = ++this.#i, n = this.currentImplementation();
    if (!n || !this.isImplementationReady()) return;
    const t = n.mapObject, i = n.from;
    if (!t || !i) return;
    const o = this.#t, r = await Promise.all(
      o.map(async (s) => {
        const a = n.cacheHash?.[s.mapID];
        if (!a) return null;
        try {
          let p;
          if (s.mapID === i.mapID && typeof a.xy2SysCoord == "function" && a.width && a.height)
            p = [
              [0, 0],
              [a.width, 0],
              [a.width, a.height],
              [0, a.height],
              [0, 0]
            ].map((m) => a.xy2SysCoord(m));
          else {
            const m = a.envelope?.geometry?.coordinates?.[0];
            if (!Array.isArray(m)) return null;
            p = await Promise.all(m.map((E) => i.merc2SysCoordAsync(E)));
          }
          return p.every(c) ? { spec: s, xys: p } : null;
        } catch {
          return null;
        }
      })
    );
    if (!(e !== this.#i || this.currentImplementation() !== n)) {
      t.resetEnvelope();
      for (const s of r) {
        if (!s) continue;
        const { spec: a, xys: p } = s;
        a.stroke && t.setEnvelope(p, {
          color: a.stroke.color,
          width: a.stroke.width ?? 2,
          ...a.stroke.lineDash ? { lineDash: a.stroke.lineDash } : {}
        }), a.fill && t.setFillEnvelope(p, null, { color: a.fill });
      }
    }
  }
  /** moveStart / moveEnd（§3.5。止まって 150 ms 後に moveEnd）。 */
  #l(e) {
    const n = e.mapObject;
    if (!n?.on) return;
    let t, i = !1;
    const o = () => {
      t && (clearTimeout(t), t = void 0), !i && (i = !0, this.dispatchLayerAEvent("moveStart", {}));
    }, r = () => {
      t && clearTimeout(t), t = setTimeout(() => {
        t = void 0, i && (i = !1, this.dispatchLayerAEvent("moveEnd", this.viewpoint));
      }, 150);
    };
    n.on("movestart", o), n.on("moveend", r), this.#r = () => {
      t && clearTimeout(t), n.un?.("movestart", o), n.un?.("moveend", r);
    };
  }
}
const h = new Map(
  [...T, ..._].filter((l) => l.option).map((l) => [l.prop, l.option])
);
function b(l = I) {
  v(P, l, "@maplat/core/element");
}
b();
export {
  L as ELEMENT_ATTRIBUTES,
  k as ELEMENT_OWN_EVENTS,
  x as ELEMENT_OWN_METHODS,
  C as ELEMENT_PROPERTIES,
  N as ELEMENT_STARTUP_KEYS,
  j as LAYER_A_PRO_ATTRIBUTES,
  B as MAPLAT_APP_EVENTS,
  U as MAPLAT_APP_METHODS,
  V as MAPLAT_APP_TAG,
  P as MaplatAppElement,
  b as defineMaplatAppElement
};
//# sourceMappingURL=maplat_core_element.js.map
