import { transform as re, toLonLat as lr, Projection as Gc, addProjection as ps, addCoordinateTransforms as tr, getTransform as Dr, identityTransform as Br } from "ol/proj";
import { View as TA, Map as zc, Feature as _A } from "ol";
import { Vector as Ri, Group as Uc, Tile as Nr } from "ol/layer";
import { XYZ as kA, Google as Xc, Vector as Pi } from "ol/source";
import { Style as ye, Stroke as ms, Fill as ys, Icon as Ln } from "ol/style";
class Le {
  /**
   * @param {string} type Type.
   */
  constructor(t) {
    this.propagationStopped, this.defaultPrevented, this.type = t, this.target = null;
  }
  /**
   * Prevent default. This means that no emulated `click`, `singleclick` or `doubleclick` events
   * will be fired.
   * @api
   */
  preventDefault() {
    this.defaultPrevented = !0;
  }
  /**
   * Stop event propagation.
   * @api
   */
  stopPropagation() {
    this.propagationStopped = !0;
  }
}
let Gt = class extends Le {
  detail;
  constructor(t, e) {
    super(t), this.detail = e;
  }
};
const Zc = ["ALL", "OFF"], $e = {
  ALL: -99,
  DEBUG: -1,
  INFO: 0,
  WARN: 1,
  ERROR: 2,
  OFF: 99
};
class No {
  constructor(t = $e.INFO) {
    this.level = t, this.make();
  }
  level;
  make() {
    const t = Object.keys($e).filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (e) => !Zc.includes(e)
    );
    for (const e of t) {
      const i = $e[e], r = e.toLowerCase();
      this[r] = this.level <= i ? console.log : () => {
      };
    }
  }
}
function Wc(n, t) {
  return n.isMapbox() ? t.mapboxMap ? (n.mapboxMap = t.mapboxMap, !0) : (t.warn?.(
    "Mapbox GL JS is not available; skipping Mapbox source:",
    n.mapID
  ), !1) : typeof n.isMapLibre == "function" && n.isMapLibre() ? t.maplibreMap ? (n.maplibreMap = t.maplibreMap, !0) : (t.warn?.(
    "MapLibre GL JS is not available; skipping MapLibre source:",
    n.mapID
  ), !1) : !0;
}
const Ai = [
  "title",
  "officialTitle",
  "author",
  "createdAt",
  "era",
  "contributor",
  "mapper",
  "license",
  "dataLicense",
  // ライセンスの自由記述欄。META_KEYS_OPTION と lockstep (同じ index) で足す。
  "licenseNote",
  "dataLicenseNote",
  "attr",
  "dataAttr",
  "reference",
  "description"
], Vc = [
  "title",
  "official_title",
  "author",
  "created_at",
  "era",
  "contributor",
  "mapper",
  "license",
  "data_license",
  "license_note",
  "data_license_note",
  "attr",
  "data_attr",
  "reference",
  "description"
];
function RA() {
  const n = /* @__PURE__ */ new Set();
  return (t, e) => {
    n.has(t) || (n.add(t), console.warn(e));
  };
}
let Fo = !1;
const Hc = "MaplatApp: the MaplatApp class is deprecated and will be removed in 2.0. Use the <maplat-app> element (@maplat/core/element) instead.";
function Qc() {
  Fo || (Fo = !0, console.warn(Hc));
}
function Hn(n) {
  const t = document, e = t.createDocumentFragment(), i = [];
  n = n.replace(/(<\/?)d([ >])/g, "$1div$2").replace(/(<\/?)s([ >])/g, "$1span$2").replace(/ din="/g, ' data-i18n="').replace(/ dinh="/g, ' data-i18n-html="').replace(/ c="/g, ' class="');
  const r = e.appendChild(t.createElement("div"));
  r.innerHTML = n;
  for (let s = 0; s < r.childNodes.length; s++) {
    const o = r.childNodes[s];
    if (o.nodeName && o.nodeName.toLowerCase() === "script") {
      const A = t.createElement("script");
      o.type && (A.type = o.type), o.src ? A.src = o.src : A.text = o.text, i[s] = A;
    } else
      i[s] = o;
  }
  return i;
}
function Oi(n) {
  for (; !(n <= 180 && n > -180); ) {
    const t = n > 0 ? -1 : 1;
    n = n + t * 360;
  }
  return n;
}
function jo(n) {
  if (!n) return;
  const t = {
    mapID: n.mapID
  };
  for (let e = 0; e < Ai.length; e++) {
    const i = Ai[e];
    n[i] && (t[i] = n[i]);
  }
  return t;
}
function ve(n) {
  const t = {
    max_zoom: "maxZoom",
    min_zoom: "minZoom",
    envelope_lnglats: "envelopeLngLats",
    envelopLngLats: "envelopeLngLats",
    image_extention: "imageExtension",
    image_extension: "imageExtension",
    imageExtention: "imageExtension",
    map_id: "mapID",
    sourceID: "mapID",
    source_id: "mapID",
    merc_max_zoom: "mercMaxZoom",
    merc_min_zoom: "mercMinZoom",
    zoom_restriction: "zoomRestriction",
    enable_cache: "enableCache",
    default_zoom: "defaultZoom",
    start_from: "startFrom",
    home_position: "homePosition",
    fake_radius: "fakeRadius",
    fake_center: "fakeCenter",
    fake_gps: "fakeGps",
    app_name: "appName",
    setting_file: "settingFile",
    merc_zoom: "mercZoom",
    mapbox_token: "mapboxToken",
    translate_ui: "translateUI",
    restore_session: "restoreSession",
    no_rotate: "noRotate",
    poi_template: "poiTemplate",
    poi_style: "poiStyle",
    icon_template: "iconTemplate",
    default_center: "defaultCenter",
    default_rotation: "defaultRotation",
    selected_icon: "selectedIcon",
    namespace_id: "namespaceID",
    mercator_x_shift: "mercatorXShift",
    mercator_y_shift: "mercatorYShift"
  };
  return Object.keys(t).reduce((e, i) => {
    if (e[i] !== void 0)
      throw new Error(`Invalid Maplat option key: ${i}. Use "${t[i]}" instead.`);
    return e;
  }, n);
}
class PA {
  constructor() {
    this.disposed = !1;
  }
  /**
   * Clean up.
   */
  dispose() {
    this.disposed || (this.disposed = !0, this.disposeInternal());
  }
  /**
   * Extension point for disposable objects.
   * @protected
   */
  disposeInternal() {
  }
}
function Yc(n, t, e) {
  let i, r;
  e = e || OA;
  let s = 0, o = n.length, A = !1;
  for (; s < o; )
    i = s + (o - s >> 1), r = +e(n[i], t), r < 0 ? s = i + 1 : (o = i, A = !r);
  return A ? s : ~s;
}
function OA(n, t) {
  return n > t ? 1 : n < t ? -1 : 0;
}
function LA(n, t, e) {
  if (n[0] <= t)
    return 0;
  const i = n.length;
  if (t <= n[i - 1])
    return i - 1;
  if (typeof e == "function") {
    for (let r = 1; r < i; ++r) {
      const s = n[r];
      if (s === t)
        return r;
      if (s < t)
        return e(t, n[r - 1], s) > 0 ? r - 1 : r;
    }
    return i - 1;
  }
  if (e > 0) {
    for (let r = 1; r < i; ++r)
      if (n[r] < t)
        return r - 1;
    return i - 1;
  }
  if (e < 0) {
    for (let r = 1; r < i; ++r)
      if (n[r] <= t)
        return r;
    return i - 1;
  }
  for (let r = 1; r < i; ++r) {
    if (n[r] == t)
      return r;
    if (n[r] < t)
      return n[r - 1] - t < t - n[r] ? r - 1 : r;
  }
  return i - 1;
}
function DA(n, t) {
  const e = Array.isArray(t) ? t : [t], i = e.length;
  for (let r = 0; r < i; r++)
    n[n.length] = e[r];
}
function Kc(n, t) {
  const e = n.length;
  if (e !== t.length)
    return !1;
  for (let i = 0; i < e; i++)
    if (n[i] !== t[i])
      return !1;
  return !0;
}
function Jt() {
  throw new Error("Unimplemented abstract method.");
}
let Jc = 0;
function qc(n) {
  const t = (
    /** @type {{ol_uid: (string|undefined)}} */
    /** @type {unknown} */
    n
  );
  return t.ol_uid || (t.ol_uid = String(++Jc));
}
function $c() {
  return !0;
}
function ur() {
  return !1;
}
function vs() {
}
function tl(n) {
  let t, e, i;
  return function() {
    const r = Array.prototype.slice.call(arguments);
    return (!e || this !== i || !Kc(r, e)) && (i = this, e = r, t = n.apply(this, r)), t;
  };
}
function BA(n) {
  for (const t in n)
    delete n[t];
}
function el(n) {
  let t;
  for (t in n)
    return !1;
  return !t;
}
class NA extends PA {
  /**
   * @param {*} [target] Default event target for dispatched events.
   */
  constructor(t) {
    super(), this.eventTarget_ = t, this.pendingRemovals_ = null, this.dispatching_ = null, this.listeners_ = null;
  }
  /**
   * @param {string} type Type.
   * @param {import("../events.js").Listener} listener Listener.
   */
  addEventListener(t, e) {
    if (!t || !e)
      return;
    const i = this.listeners_ || (this.listeners_ = {}), r = i[t] || (i[t] = []);
    r.includes(e) || r.push(e);
  }
  /**
   * Dispatches an event and calls all listeners listening for events
   * of this type. The event parameter can either be a string or an
   * Object with a `type` property.
   *
   * @param {import("./Event.js").default|string} event Event object.
   * @return {boolean|undefined} `false` if anyone called preventDefault on the
   *     event object or if any of the listeners returned false.
   * @api
   */
  dispatchEvent(t) {
    const e = typeof t == "string", i = e ? t : t.type, r = this.listeners_ && this.listeners_[i];
    if (!r)
      return;
    const s = e ? new Le(t) : (
      /** @type {Event} */
      t
    );
    s.target || (s.target = this.eventTarget_ || this);
    const o = this.dispatching_ || (this.dispatching_ = {}), A = this.pendingRemovals_ || (this.pendingRemovals_ = {});
    i in o || (o[i] = 0, A[i] = 0), ++o[i];
    let a;
    for (let g = 0, c = r.length; g < c; ++g)
      if ("handleEvent" in r[g] ? a = /** @type {import("../events.js").ListenerObject} */
      r[g].handleEvent(s) : a = /** @type {import("../events.js").ListenerFunction} */
      r[g].call(this, s), a === !1 || s.propagationStopped) {
        a = !1;
        break;
      }
    if (--o[i] === 0) {
      let g = A[i];
      for (delete A[i]; g--; )
        this.removeEventListener(i, vs);
      delete o[i];
    }
    return (
      /** @type {boolean|undefined} */
      a
    );
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.listeners_ && BA(this.listeners_);
  }
  /**
   * Get the listeners for a specified event type. Listeners are returned in the
   * order that they will be called in.
   *
   * @param {string} type Type.
   * @return {Array<import("../events.js").Listener>|undefined} Listeners.
   */
  getListeners(t) {
    return this.listeners_ && this.listeners_[t] || void 0;
  }
  /**
   * @param {string} [type] Type. If not provided,
   *     `true` will be returned if this event target has any listeners.
   * @return {boolean} Has listeners.
   */
  hasListener(t) {
    return this.listeners_ ? t ? t in this.listeners_ : Object.keys(this.listeners_).length > 0 : !1;
  }
  /**
   * @param {string} type Type.
   * @param {import("../events.js").Listener} listener Listener.
   */
  removeEventListener(t, e) {
    if (!this.listeners_)
      return;
    const i = this.listeners_[t];
    if (!i)
      return;
    const r = i.indexOf(e);
    r !== -1 && (this.pendingRemovals_ && t in this.pendingRemovals_ ? (i[r] = vs, ++this.pendingRemovals_[t]) : (i.splice(r, 1), i.length === 0 && delete this.listeners_[t]));
  }
}
TA.prototype.getDecimalZoom = function() {
  const n = this.getResolution(), t = (
    // NOTE: `resolution` maybe `undefined`
    // NOTE: `offset` maybe `NaN`
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Math.log(this.maxResolution_ / n) / Math.log(2)
  );
  return t !== void 0 ? this.minZoom_ + t : t;
};
const Bt = {
  UNKNOWN: 0,
  INTERSECTING: 1,
  ABOVE: 2,
  RIGHT: 4,
  BELOW: 8,
  LEFT: 16
};
function Hs(n, t, e) {
  let i, r;
  return t < n[0] ? i = n[0] - t : n[2] < t ? i = t - n[2] : i = 0, e < n[1] ? r = n[1] - e : n[3] < e ? r = e - n[3] : r = 0, i * i + r * r;
}
function nl(n, t, e) {
  return n[0] <= t && t <= n[2] && n[1] <= e && e <= n[3];
}
function Go(n, t) {
  const e = n[0], i = n[1], r = n[2], s = n[3], o = t[0], A = t[1];
  let a = Bt.UNKNOWN;
  return o < e ? a = a | Bt.LEFT : o > r && (a = a | Bt.RIGHT), A < i ? a = a | Bt.BELOW : A > s && (a = a | Bt.ABOVE), a === Bt.UNKNOWN && (a = Bt.INTERSECTING), a;
}
function FA() {
  return [1 / 0, 1 / 0, -1 / 0, -1 / 0];
}
function Ir(n, t, e, i, r) {
  return r ? (r[0] = n, r[1] = t, r[2] = e, r[3] = i, r) : [n, t, e, i];
}
function jA(n) {
  return Ir(1 / 0, 1 / 0, -1 / 0, -1 / 0, n);
}
function il(n, t) {
  const e = n[0], i = n[1];
  return Ir(e, i, e, i, t);
}
function rl(n, t, e, i, r) {
  const s = jA(r);
  return GA(s, n, t, e, i);
}
function GA(n, t, e, i, r) {
  for (; e < i; e += r)
    sl(n, t[e], t[e + 1]);
  return n;
}
function sl(n, t, e) {
  n[0] = Math.min(n[0], t), n[1] = Math.min(n[1], e), n[2] = Math.max(n[2], t), n[3] = Math.max(n[3], e);
}
function zA(n, t) {
  let e;
  return e = t(ol(n)), e || (e = t(al(n)), e) || (e = t(ll(n)), e) || (e = t(cl(n)), e) ? e : !1;
}
function ol(n) {
  return [n[0], n[1]];
}
function al(n) {
  return [n[2], n[1]];
}
function er(n) {
  return [(n[0] + n[2]) / 2, (n[1] + n[3]) / 2];
}
function Al(n, t, e, i, r) {
  const [s, o, A, a, g, c, u, h] = gl(
    n,
    t,
    e,
    i
  );
  return Ir(
    Math.min(s, A, g, u),
    Math.min(o, a, c, h),
    Math.max(s, A, g, u),
    Math.max(o, a, c, h),
    r
  );
}
function gl(n, t, e, i) {
  const r = t * i[0] / 2, s = t * i[1] / 2, o = Math.cos(e), A = Math.sin(e), a = r * o, g = r * A, c = s * o, u = s * A, h = n[0], p = n[1];
  return [
    h - a + u,
    p - g - c,
    h - a - u,
    p - g + c,
    h + a - u,
    p + g + c,
    h + a + u,
    p + g - c,
    h - a + u,
    p - g - c
  ];
}
function gi(n) {
  return n[3] - n[1];
}
function cl(n) {
  return [n[0], n[3]];
}
function ll(n) {
  return [n[2], n[3]];
}
function Qs(n) {
  return n[2] - n[0];
}
function Ys(n, t) {
  return n[0] <= t[2] && n[2] >= t[0] && n[1] <= t[3] && n[3] >= t[1];
}
function UA(n) {
  return n[2] < n[0] || n[3] < n[1];
}
function ul(n, t) {
  return t ? (t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t) : n;
}
function Il(n, t, e) {
  let i = !1;
  const r = Go(n, t), s = Go(n, e);
  if (r === Bt.INTERSECTING || s === Bt.INTERSECTING)
    i = !0;
  else {
    const o = n[0], A = n[1], a = n[2], g = n[3], c = t[0], u = t[1], h = e[0], p = e[1], m = (p - u) / (h - c);
    let l, I;
    s & Bt.ABOVE && !(r & Bt.ABOVE) && (l = h - (p - g) / m, i = l >= o && l <= a), !i && s & Bt.RIGHT && !(r & Bt.RIGHT) && (I = p - (h - a) * m, i = I >= A && I <= g), !i && s & Bt.BELOW && !(r & Bt.BELOW) && (l = h - (p - A) / m, i = l >= o && l <= a), !i && s & Bt.LEFT && !(r & Bt.LEFT) && (I = p - (h - o) * m, i = I >= A && I <= g);
  }
  return i;
}
const hl = {
  /**
   * Triggered when a property is changed.
   * @event module:ol/Object.ObjectEvent#propertychange
   * @api
   */
  PROPERTYCHANGE: "propertychange"
};
function Sn(n, t, e, i, r) {
  if (r) {
    const o = e;
    e = function(A) {
      return n.removeEventListener(t, e), o.call(i ?? this, A);
    };
  } else i && i !== n && (e = e.bind(i));
  const s = {
    target: n,
    type: t,
    listener: e
  };
  return n.addEventListener(t, e), s;
}
function zo(n, t, e, i) {
  return Sn(n, t, e, i, !0);
}
function si(n) {
  n && n.target && (n.target.removeEventListener(n.type, n.listener), BA(n));
}
const Ve = {
  /**
   * Generic change event. Triggered when the revision counter is increased.
   * @event module:ol/events/Event~BaseEvent#change
   * @api
   */
  CHANGE: "change",
  DBLCLICK: "dblclick",
  KEYDOWN: "keydown",
  KEYPRESS: "keypress",
  WHEEL: "wheel"
};
class hr extends NA {
  constructor() {
    super(), this.on = /** @type {ObservableOnSignature<import("./events.js").EventsKey>} */
    this.onInternal, this.once = /** @type {ObservableOnSignature<import("./events.js").EventsKey>} */
    this.onceInternal, this.un = /** @type {ObservableOnSignature<void>} */
    this.unInternal, this.revision_ = 0;
  }
  /**
   * Increases the revision counter and dispatches a 'change' event.
   * @api
   */
  changed() {
    ++this.revision_, this.dispatchEvent(Ve.CHANGE);
  }
  /**
   * Get the version number for this object.  Each time the object is modified,
   * its version number will be incremented.
   * @return {number} Revision.
   * @api
   */
  getRevision() {
    return this.revision_;
  }
  /**
   * @param {string|Array<string>} type Type.
   * @param {function((Event|import("./events/Event.js").default)): ?} listener Listener.
   * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Event key.
   * @protected
   */
  onInternal(t, e) {
    if (Array.isArray(t)) {
      const i = t.length, r = new Array(i);
      for (let s = 0; s < i; ++s)
        r[s] = Sn(this, t[s], e);
      return r;
    }
    return Sn(
      this,
      /** @type {string} */
      t,
      e
    );
  }
  /**
   * @param {string|Array<string>} type Type.
   * @param {function((Event|import("./events/Event.js").default)): ?} listener Listener.
   * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Event key.
   * @protected
   */
  onceInternal(t, e) {
    let i;
    if (Array.isArray(t)) {
      const r = t.length;
      i = new Array(r);
      for (let s = 0; s < r; ++s)
        i[s] = zo(this, t[s], e);
    } else
      i = zo(
        this,
        /** @type {string} */
        t,
        e
      );
    return e.ol_key = i, i;
  }
  /**
   * Unlisten for a certain type of event.
   * @param {string|Array<string>} type Type.
   * @param {function((Event|import("./events/Event.js").default)): ?} listener Listener.
   * @protected
   */
  unInternal(t, e) {
    const i = (
      /** @type {ListenerWithKey} */
      e.ol_key
    );
    if (i)
      Cl(i);
    else if (Array.isArray(t))
      for (let r = 0, s = t.length; r < s; ++r)
        this.removeEventListener(t[r], e);
    else
      this.removeEventListener(t, e);
  }
}
hr.prototype.on;
hr.prototype.once;
hr.prototype.un;
function Cl(n) {
  if (Array.isArray(n))
    for (let t = 0, e = n.length; t < e; ++t)
      si(n[t]);
  else
    si(
      /** @type {import("./events.js").EventsKey} */
      n
    );
}
class Uo extends Le {
  /**
   * @param {string} type The event type.
   * @param {string} key The property name.
   * @param {*} oldValue The old value for `key`.
   */
  constructor(t, e, i) {
    super(t), this.key = e, this.oldValue = i;
  }
}
class jn extends hr {
  /**
   * @param {NoInfer<Properties>} [values] An object with key-value pairs.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, qc(this), this.values_ = null, t !== void 0 && this.setProperties(t);
  }
  /**
   * Gets a value.
   * @param {string} key Key name.
   * @return {*} Value.
   * @api
   */
  get(t) {
    let e;
    return this.values_ && this.values_.hasOwnProperty(t) && (e = this.values_[t]), e;
  }
  /**
   * Get a list of object property names.
   * @return {Array<string>} List of property names.
   * @api
   */
  getKeys() {
    return this.values_ && Object.keys(this.values_) || [];
  }
  /**
   * Get an object of all property names and values.
   * @return {NoInfer<Properties>} Object.
   * @api
   */
  getProperties() {
    return (
      /** @type {NoInfer<Properties>} */
      this.values_ && Object.assign({}, this.values_) || {}
    );
  }
  /**
   * Get an object of all property names and values.
   * @return {Partial<NoInfer<Properties>>?} Object.
   */
  getPropertiesInternal() {
    return this.values_;
  }
  /**
   * @return {boolean} The object has properties.
   */
  hasProperties() {
    return !!this.values_;
  }
  /**
   * @param {string} key Key name.
   * @param {*} oldValue Old value.
   */
  notify(t, e) {
    let i;
    i = `change:${t}`, this.hasListener(i) && this.dispatchEvent(new Uo(i, t, e)), i = hl.PROPERTYCHANGE, this.hasListener(i) && this.dispatchEvent(new Uo(i, t, e));
  }
  /**
   * @param {string} key Key name.
   * @param {import("./events.js").Listener} listener Listener.
   */
  addChangeListener(t, e) {
    this.addEventListener(`change:${t}`, e);
  }
  /**
   * @param {string} key Key name.
   * @param {import("./events.js").Listener} listener Listener.
   */
  removeChangeListener(t, e) {
    this.removeEventListener(`change:${t}`, e);
  }
  /**
   * Sets a value.
   * @param {string} key Key name.
   * @param {*} value Value.
   * @param {boolean} [silent] Update without triggering an event.
   * @api
   */
  set(t, e, i) {
    const r = (
      /** @type {Object<string, *>} */
      this.values_ || (this.values_ = /** @type {Partial<NoInfer<Properties>>} */
      {})
    );
    if (i)
      r[t] = e;
    else {
      const s = r[t];
      r[t] = e, s !== e && this.notify(t, s);
    }
  }
  /**
   * Sets a collection of key-value pairs.  Note that this changes any existing
   * properties and adds new ones (it does not remove any existing properties).
   * @param {Partial<NoInfer<Properties>>} values Values.
   * @param {boolean} [silent] Update without triggering an event.
   * @api
   */
  setProperties(t, e) {
    for (const i in t)
      this.set(i, t[i], e);
  }
  /**
   * Apply any properties from another object without triggering events.
   * @param {BaseObject} source The source object.
   * @protected
   */
  applyProperties(t) {
    t.values_ && Object.assign(this.values_ || (this.values_ = {}), t.values_);
  }
  /**
   * Unsets a property.
   * @param {string} key Key name.
   * @param {boolean} [silent] Unset without triggering an event.
   * @api
   */
  unset(t, e) {
    if (this.values_ && t in this.values_) {
      const i = this.values_[t];
      delete this.values_[t], el(this.values_) && (this.values_ = null), e || this.notify(t, i);
    }
  }
}
function fl(...n) {
  console.warn(...n);
}
function fe(n, t, e) {
  return Math.min(Math.max(n, t), e);
}
function dl(n, t, e, i, r, s) {
  const o = r - e, A = s - i;
  if (o !== 0 || A !== 0) {
    const a = ((n - e) * o + (t - i) * A) / (o * o + A * A);
    a > 1 ? (e = r, i = s) : a > 0 && (e += o * a, i += A * a);
  }
  return Tn(n, t, e, i);
}
function Tn(n, t, e, i) {
  const r = e - n, s = i - t;
  return r * r + s * s;
}
function Xo(n) {
  return n * 180 / Math.PI;
}
function _n(n) {
  return n * Math.PI / 180;
}
function ws(n, t) {
  const e = n % t;
  return e * t < 0 ? e + t : e;
}
function Ks(n, t, e) {
  return n + e * (t - n);
}
function bs(n, t, e) {
  if (n >= t && n < e)
    return n;
  const i = e - t;
  return ((n - t) % i + i) % i + t;
}
function pl(n, t) {
  return n[0] += +t[0], n[1] += +t[1], n;
}
function nr(n, t) {
  let e = !0;
  for (let i = n.length - 1; i >= 0; --i)
    if (n[i] != t[i]) {
      e = !1;
      break;
    }
  return e;
}
function Js(n, t) {
  const e = Math.cos(t), i = Math.sin(t), r = n[0] * e - n[1] * i, s = n[1] * e + n[0] * i;
  return n[0] = r, n[1] = s, n;
}
function ml(n, t) {
  return n[0] *= t, n[1] *= t, n;
}
const XA = {
  // use the radius of the Normal sphere
  radians: 6370997 / (2 * Math.PI),
  degrees: 2 * Math.PI * 6370997 / 360,
  ft: 0.3048,
  m: 1,
  "us-ft": 1200 / 3937
};
class ci {
  /**
   * @param {Options} options Projection options.
   */
  constructor(t) {
    this.code_ = t.code, this.units_ = /** @type {import("./Units.js").Units} */
    t.units, this.extent_ = t.extent !== void 0 ? t.extent : null, this.worldExtent_ = t.worldExtent !== void 0 ? t.worldExtent : null, this.axisOrientation_ = t.axisOrientation !== void 0 ? t.axisOrientation : "enu", this.global_ = t.global !== void 0 ? t.global : !1, this.canWrapX_ = !!(this.global_ && this.extent_), this.getPointResolutionFunc_ = t.getPointResolution, this.defaultTileGrid_ = null, this.metersPerUnit_ = t.metersPerUnit;
  }
  /**
   * @return {boolean} The projection is suitable for wrapping the x-axis
   */
  canWrapX() {
    return this.canWrapX_;
  }
  /**
   * Get the code for this projection, e.g. 'EPSG:4326'.
   * @return {string} Code.
   * @api
   */
  getCode() {
    return this.code_;
  }
  /**
   * Get the validity extent for this projection.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getExtent() {
    return (
      /** @type {import("../extent.js").Extent} */
      this.extent_
    );
  }
  /**
   * Get the units of this projection.
   * @return {import("./Units.js").Units} Units.
   * @api
   */
  getUnits() {
    return this.units_;
  }
  /**
   * Get the amount of meters per unit of this projection.  If the projection is
   * not configured with `metersPerUnit` or a units identifier, the return is
   * `undefined`.
   * @return {number|undefined} Meters.
   * @api
   */
  getMetersPerUnit() {
    return this.metersPerUnit_ || XA[this.units_];
  }
  /**
   * Get the world extent for this projection.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getWorldExtent() {
    return (
      /** @type {import("../extent.js").Extent} */
      this.worldExtent_
    );
  }
  /**
   * Get the axis orientation of this projection.
   * Example values are:
   * enu - the default easting, northing, elevation.
   * neu - northing, easting, up - useful for "lat/long" geographic coordinates,
   *     or south orientated transverse mercator.
   * wnu - westing, northing, up - some planetary coordinate systems have
   *     "west positive" coordinate systems
   * @return {string} Axis orientation.
   * @api
   */
  getAxisOrientation() {
    return this.axisOrientation_;
  }
  /**
   * Is this projection a global projection which spans the whole world?
   * @return {boolean} Whether the projection is global.
   * @api
   */
  isGlobal() {
    return this.global_;
  }
  /**
   * Set if the projection is a global projection which spans the whole world
   * @param {boolean} global Whether the projection is global.
   * @api
   */
  setGlobal(t) {
    this.global_ = t, this.canWrapX_ = !!(t && this.extent_);
  }
  /**
   * @return {import("../tilegrid/TileGrid.js").default|null} The default tile grid.
   */
  getDefaultTileGrid() {
    return this.defaultTileGrid_;
  }
  /**
   * @param {import("../tilegrid/TileGrid.js").default} tileGrid The default tile grid.
   */
  setDefaultTileGrid(t) {
    this.defaultTileGrid_ = t;
  }
  /**
   * Set the validity extent for this projection.
   * @param {import("../extent.js").Extent} extent Extent.
   * @api
   */
  setExtent(t) {
    this.extent_ = t, this.canWrapX_ = !!(this.global_ && t);
  }
  /**
   * Set the world extent for this projection.
   * @param {import("../extent.js").Extent} worldExtent World extent
   *     [minlon, minlat, maxlon, maxlat].
   * @api
   */
  setWorldExtent(t) {
    this.worldExtent_ = t;
  }
  /**
   * Set the getPointResolution function (see {@link module:ol/proj.getPointResolution}
   * for this projection.
   * @param {function(number, import("../coordinate.js").Coordinate):number} func Function
   * @api
   */
  setGetPointResolution(t) {
    this.getPointResolutionFunc_ = t;
  }
  /**
   * Get the custom point resolution function for this projection (if set).
   * @return {GetPointResolution|undefined} The custom point
   * resolution function (if set).
   */
  getPointResolutionFunc() {
    return this.getPointResolutionFunc_;
  }
}
const pi = 6378137, xn = Math.PI * pi, yl = [-xn, -xn, xn, xn], vl = [-180, -85, 180, 85], Li = pi * Math.log(Math.tan(Math.PI / 2));
class hn extends ci {
  /**
   * @param {string} code Code.
   */
  constructor(t) {
    super({
      code: t,
      units: "m",
      extent: yl,
      global: !0,
      worldExtent: vl,
      getPointResolution: function(e, i) {
        return e / Math.cosh(i[1] / pi);
      }
    });
  }
}
const Zo = [
  new hn("EPSG:3857"),
  new hn("EPSG:102100"),
  new hn("EPSG:102113"),
  new hn("EPSG:900913"),
  new hn("http://www.opengis.net/def/crs/EPSG/0/3857"),
  new hn("http://www.opengis.net/gml/srs/epsg.xml#3857")
];
function wl(n, t, e, i) {
  const r = n.length;
  e = e !== void 0 && e > 1 ? e : 2, i = i ?? e, t === void 0 && (e > 2 ? t = n.slice() : t = new Array(r));
  for (let s = 0; s < r; s += i) {
    t[s] = xn * n[s] / 180;
    let o = pi * Math.log(Math.tan(Math.PI * (+n[s + 1] + 90) / 360));
    o > Li ? o = Li : o < -Li && (o = -Li), t[s + 1] = o;
  }
  return t;
}
function bl(n, t, e, i) {
  const r = n.length;
  e = e !== void 0 && e > 1 ? e : 2, i = i ?? e, t === void 0 && (e > 2 ? t = n.slice() : t = new Array(r));
  for (let s = 0; s < r; s += i)
    t[s] = 180 * n[s] / xn, t[s + 1] = 360 * Math.atan(Math.exp(n[s + 1] / pi)) / Math.PI - 90;
  return t;
}
const El = 6378137, Wo = [-180, -90, 180, 90], xl = Math.PI * El / 180;
class Qe extends ci {
  /**
   * @param {string} code Code.
   * @param {string} [axisOrientation] Axis orientation.
   */
  constructor(t, e) {
    super({
      code: t,
      units: "degrees",
      extent: Wo,
      axisOrientation: e,
      global: !0,
      metersPerUnit: xl,
      worldExtent: Wo
    });
  }
}
const Vo = [
  new Qe("CRS:84"),
  new Qe("EPSG:4326", "neu"),
  new Qe("urn:ogc:def:crs:OGC:1.3:CRS84"),
  new Qe("urn:ogc:def:crs:OGC:2:84"),
  new Qe("http://www.opengis.net/def/crs/OGC/1.3/CRS84"),
  new Qe("http://www.opengis.net/gml/srs/epsg.xml#4326", "neu"),
  new Qe("http://www.opengis.net/def/crs/EPSG/0/4326", "neu")
];
let Es = {};
function Ml(n) {
  return Es[n] || Es[n.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/, "EPSG:$3")] || null;
}
function Sl(n, t) {
  Es[n] = t;
}
let kn = {};
function li(n, t, e) {
  const i = n.getCode(), r = t.getCode();
  i in kn || (kn[i] = {}), kn[i][r] = e;
}
function Fr(n, t) {
  return n in kn && t in kn[n] ? kn[n][t] : null;
}
const ir = 0.9996, ue = 669438e-8, Cr = ue * ue, fr = Cr * ue, tn = ue / (1 - ue), Ho = Math.sqrt(1 - ue), Dn = (1 - Ho) / (1 + Ho), ZA = Dn * Dn, qs = ZA * Dn, $s = qs * Dn, WA = $s * Dn, VA = 1 - ue / 4 - 3 * Cr / 64 - 5 * fr / 256, Tl = 3 * ue / 8 + 3 * Cr / 32 + 45 * fr / 1024, _l = 15 * Cr / 256 + 45 * fr / 1024, kl = 35 * fr / 3072, Rl = 3 / 2 * Dn - 27 / 32 * qs + 269 / 512 * WA, Pl = 21 / 16 * ZA - 55 / 32 * $s, Ol = 151 / 96 * qs - 417 / 128 * WA, Ll = 1097 / 512 * $s, rr = 6378137;
function Dl(n, t, e) {
  const i = n - 5e5, o = (e.north ? t : t - 1e7) / ir / (rr * VA), A = o + Rl * Math.sin(2 * o) + Pl * Math.sin(4 * o) + Ol * Math.sin(6 * o) + Ll * Math.sin(8 * o), a = Math.sin(A), g = a * a, c = Math.cos(A), u = a / c, h = u * u, p = h * h, m = 1 - ue * g, l = Math.sqrt(1 - ue * g), I = rr / l, C = (1 - ue) / m, d = tn * c ** 2, x = d * d, w = i / (I * ir), f = w * w, y = f * w, v = y * w, M = v * w, S = M * w, E = A - u / C * (f / 2 - v / 24 * (5 + 3 * h + 10 * d - 4 * x - 9 * tn)) + S / 720 * (61 + 90 * h + 298 * d + 45 * p - 252 * tn - 3 * x);
  let T = (w - y / 6 * (1 + 2 * h + d) + M / 120 * (5 - 2 * d + 28 * h - 3 * x + 8 * tn + 24 * p)) / c;
  return T = bs(
    T + _n(HA(e.number)),
    -Math.PI,
    Math.PI
  ), [Xo(T), Xo(E)];
}
const Qo = -80, Yo = 84, Bl = -180, Nl = 180;
function Fl(n, t, e) {
  n = bs(n, Bl, Nl), t < Qo ? t = Qo : t > Yo && (t = Yo);
  const i = _n(t), r = Math.sin(i), s = Math.cos(i), o = r / s, A = o * o, a = A * A, g = _n(n), c = HA(e.number), u = _n(c), h = rr / Math.sqrt(1 - ue * r ** 2), p = tn * s ** 2, m = s * bs(g - u, -Math.PI, Math.PI), l = m * m, I = l * m, C = I * m, d = C * m, x = d * m, w = rr * (VA * i - Tl * Math.sin(2 * i) + _l * Math.sin(4 * i) - kl * Math.sin(6 * i)), f = ir * h * (m + I / 6 * (1 - A + p) + d / 120 * (5 - 18 * A + a + 72 * p - 58 * tn)) + 5e5;
  let y = ir * (w + h * o * (l / 2 + C / 24 * (5 - A + 9 * p + 4 * p ** 2) + x / 720 * (61 - 58 * A + a + 600 * p - 330 * tn)));
  return e.north || (y += 1e7), [f, y];
}
function HA(n) {
  return (n - 1) * 6 - 180 + 3;
}
const jl = [
  /^EPSG:(\d+)$/,
  /^urn:ogc:def:crs:EPSG::(\d+)$/,
  /^http:\/\/www\.opengis\.net\/def\/crs\/EPSG\/0\/(\d+)$/
];
function QA(n) {
  let t = 0;
  for (const r of jl) {
    const s = n.match(r);
    if (s) {
      t = parseInt(s[1]);
      break;
    }
  }
  if (!t)
    return null;
  let e = 0, i = !1;
  return t > 32700 && t < 32761 ? e = t - 32700 : t > 32600 && t < 32661 && (i = !0, e = t - 32600), e ? { number: e, north: i } : null;
}
function Ko(n, t) {
  return function(e, i, r, s) {
    const o = e.length;
    r = r !== void 0 && r > 1 ? r : 2, s = s ?? r, i || (r > 2 ? i = e.slice() : i = new Array(o));
    for (let A = 0; A < o; A += s) {
      const a = e[A], g = e[A + 1], c = n(a, g, t);
      i[A] = c[0], i[A + 1] = c[1];
    }
    return i;
  };
}
function Gl(n) {
  return QA(n) ? new ci({ code: n, units: "m" }) : null;
}
function zl(n) {
  const t = QA(n.getCode());
  return t ? {
    forward: Ko(Fl, t),
    inverse: Ko(Dl, t)
  } : null;
}
const Ul = [zl], Xl = [Gl];
let xs = !0;
function Zl(n) {
  xs = !1;
}
function YA(n, t) {
  if (t !== void 0) {
    for (let e = 0, i = n.length; e < i; ++e)
      t[e] = n[e];
    t = t;
  } else
    t = n.slice();
  return t;
}
function Ms(n) {
  Sl(n.getCode(), n), li(n, n, YA);
}
function Wl(n) {
  n.forEach(Ms);
}
function ui(n) {
  if (typeof n != "string")
    return n !== void 0 ? n : null;
  const t = Ml(n);
  if (t)
    return t;
  for (const e of Xl) {
    const i = e(n);
    if (i)
      return i;
  }
  return null;
}
function Jo(n) {
  Wl(n), n.forEach(function(t) {
    n.forEach(function(e) {
      t !== e && li(t, e, YA);
    });
  });
}
function Vl(n, t, e, i) {
  n.forEach(function(r) {
    t.forEach(function(s) {
      li(r, s, e), li(s, r, i);
    });
  });
}
function to(n, t) {
  return n ? typeof n == "string" ? ui(n) : (
    /** @type {Projection} */
    n
  ) : ui(t);
}
function Hl(n, t) {
  if (!n || !t)
    return null;
  const e = n.getCode(), i = t.getCode();
  let r = Fr(e, i);
  if (r)
    return r;
  let s = null, o = null;
  for (const a of Ul)
    s || (s = a(n)), o || (o = a(t));
  if (!s && !o)
    return null;
  const A = "EPSG:4326";
  if (!o && s) {
    const a = Fr(A, i);
    a && (r = jr(
      s.inverse,
      a
    ));
  } else if (!s && o) {
    const a = Fr(e, A);
    a && (r = jr(
      a,
      o.forward
    ));
  } else s && o && (r = jr(
    s.inverse,
    o.forward
  ));
  return r && (Ms(n), Ms(t), li(n, t, r)), r;
}
function jr(n, t) {
  return function(e, i, r, s) {
    return i = n(e, i, r, s), t(i, i, r, s);
  };
}
function qo(n, t) {
  const e = ui(n), i = ui(t);
  return Hl(e, i);
}
let Ql = null;
function Yl() {
  return Ql;
}
function $o(n, t) {
  return n;
}
function Fe(n, t) {
  return xs && !nr(n, [0, 0]) && n[0] >= -180 && n[0] <= 180 && n[1] >= -90 && n[1] <= 90 && (xs = !1, fl(
    "Call useGeographic() from ol/proj once to work with [longitude, latitude] coordinates."
  )), n;
}
function Kl(n, t) {
  return n;
}
function Di(n, t) {
  return n;
}
function Jl() {
  Jo(Zo), Jo(Vo), Vl(
    Vo,
    Zo,
    wl,
    bl
  );
}
Jl();
function Xe(n, t) {
  if (!n)
    throw new Error(t);
}
const ql = [1, 0, 0, 1, 0, 0];
new Array(6);
function $l() {
  return ql.slice(0);
}
function tu(n, t, e, i, r, s, o, A) {
  const a = Math.sin(s), g = Math.cos(s);
  return n[0] = i * g, n[1] = r * a, n[2] = -i * a, n[3] = r * g, n[4] = o * i * g - A * i * a + t, n[5] = o * r * a + A * r * g + e, n;
}
function eu(n, t, e, i, r, s, o) {
  s = s || [], o = o || 2;
  let A = 0;
  for (let a = t; a < e; a += i) {
    const g = n[a], c = n[a + 1];
    s[A++] = r[0] * g + r[2] * c + r[4], s[A++] = r[1] * g + r[3] * c + r[5];
    for (let u = 2; u < o; u++)
      s[A++] = n[a + u];
  }
  return s && s.length != A && (s.length = A), s;
}
function KA(n, t, e, i, r, s, o) {
  o = o || [];
  const A = Math.cos(r), a = Math.sin(r), g = s[0], c = s[1];
  let u = 0;
  for (let h = t; h < e; h += i) {
    const p = n[h] - g, m = n[h + 1] - c;
    o[u++] = g + p * A - m * a, o[u++] = c + p * a + m * A;
    for (let l = h + 2; l < h + i; ++l)
      o[u++] = n[l];
  }
  return o && o.length != u && (o.length = u), o;
}
function nu(n, t, e, i, r, s, o, A) {
  A = A || [];
  const a = o[0], g = o[1];
  let c = 0;
  for (let u = t; u < e; u += i) {
    const h = n[u] - a, p = n[u + 1] - g;
    A[c++] = a + r * h, A[c++] = g + s * p;
    for (let m = u + 2; m < u + i; ++m)
      A[c++] = n[m];
  }
  return A && A.length != c && (A.length = c), A;
}
function iu(n, t, e, i, r, s, o) {
  o = o || [];
  let A = 0;
  for (let a = t; a < e; a += i) {
    o[A++] = n[a] + r, o[A++] = n[a + 1] + s;
    for (let g = a + 2; g < a + i; ++g)
      o[A++] = n[g];
  }
  return o && o.length != A && (o.length = A), o;
}
const ta = $l(), ru = [NaN, NaN];
class su extends jn {
  constructor() {
    super(), this.extent_ = FA(), this.extentRevision_ = -1, this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = 0, this.simplifyTransformedInternal = tl(
      (t, e, i) => {
        if (!i)
          return this.getSimplifiedGeometry(e);
        const r = this.clone();
        return r.applyTransform(i), r.getSimplifiedGeometry(e);
      }
    );
  }
  /**
   * Get a transformed and simplified version of the geometry.
   * @abstract
   * @param {number} squaredTolerance Squared tolerance.
   * @param {import("../proj.js").TransformFunction} [transform] Optional transform function.
   * @return {Geometry} Simplified geometry.
   */
  simplifyTransformed(t, e) {
    return this.simplifyTransformedInternal(
      this.getRevision(),
      t,
      e
    );
  }
  /**
   * Make a complete copy of the geometry.
   * @abstract
   * @return {!Geometry} Clone.
   */
  clone() {
    return Jt();
  }
  /**
   * @abstract
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   */
  closestPointXY(t, e, i, r) {
    return Jt();
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   */
  containsXY(t, e) {
    return this.closestPointXY(t, e, ru, Number.MIN_VALUE) === 0;
  }
  /**
   * Return the closest point of the geometry to the passed point as
   * {@link module:ol/coordinate~Coordinate coordinate}.
   * @param {import("../coordinate.js").Coordinate} point Point.
   * @param {import("../coordinate.js").Coordinate} [closestPoint] Closest point.
   * @return {import("../coordinate.js").Coordinate} Closest point.
   * @api
   */
  getClosestPoint(t, e) {
    return e = e || [NaN, NaN], this.closestPointXY(t[0], t[1], e, 1 / 0), e;
  }
  /**
   * Returns true if this geometry includes the specified coordinate. If the
   * coordinate is on the boundary of the geometry, returns false.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @return {boolean} Contains coordinate.
   * @api
   */
  intersectsCoordinate(t) {
    return this.containsXY(t[0], t[1]);
  }
  /**
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @protected
   * @return {import("../extent.js").Extent} extent Extent.
   */
  computeExtent(t) {
    return Jt();
  }
  /**
   * Get the extent of the geometry.
   * @param {import("../extent.js").Extent} [extent] Extent.
   * @return {import("../extent.js").Extent} extent Extent.
   * @api
   */
  getExtent(t) {
    if (this.extentRevision_ != this.getRevision()) {
      const e = this.computeExtent(this.extent_);
      (isNaN(e[0]) || isNaN(e[1])) && jA(e), this.extentRevision_ = this.getRevision();
    }
    return ul(this.extent_, t);
  }
  /**
   * Rotate the geometry around a given coordinate. This modifies the geometry
   * coordinates in place.
   * @abstract
   * @param {number} angle Rotation angle in radians.
   * @param {import("../coordinate.js").Coordinate} anchor The rotation center.
   * @api
   */
  rotate(t, e) {
    Jt();
  }
  /**
   * Scale the geometry (with an optional origin).  This modifies the geometry
   * coordinates in place.
   * @abstract
   * @param {number} sx The scaling factor in the x-direction.
   * @param {number} [sy] The scaling factor in the y-direction (defaults to sx).
   * @param {import("../coordinate.js").Coordinate} [anchor] The scale origin (defaults to the center
   *     of the geometry extent).
   * @api
   */
  scale(t, e, i) {
    Jt();
  }
  /**
   * Create a simplified version of this geometry.  For linestrings, this uses
   * the [Douglas Peucker](https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm)
   * algorithm.  For polygons, a quantization-based
   * simplification is used to preserve topology.
   * @param {number} tolerance The tolerance distance for simplification.
   * @return {Geometry} A new, simplified version of the original geometry.
   * @api
   */
  simplify(t) {
    return this.getSimplifiedGeometry(t * t);
  }
  /**
   * Create a simplified version of this geometry using the Douglas Peucker
   * algorithm.
   * See https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm.
   * @abstract
   * @param {number} squaredTolerance Squared tolerance.
   * @return {Geometry} Simplified geometry.
   */
  getSimplifiedGeometry(t) {
    return Jt();
  }
  /**
   * Get the type of this geometry.
   * @abstract
   * @return {Type} Geometry type.
   */
  getType() {
    return Jt();
  }
  /**
   * Apply a transform function to the coordinates of the geometry.
   * The geometry is modified in place.
   * If you do not want the geometry modified in place, first `clone()` it and
   * then use this function on the clone.
   * @abstract
   * @param {import("../proj.js").TransformFunction} transformFn Transform function.
   * Called with a flat array of geometry coordinates.
   */
  applyTransform(t) {
    Jt();
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   */
  intersectsExtent(t) {
    return Jt();
  }
  /**
   * Translate the geometry.  This modifies the geometry coordinates in place.  If
   * instead you want a new geometry, first `clone()` this geometry.
   * @abstract
   * @param {number} deltaX Delta X.
   * @param {number} deltaY Delta Y.
   * @api
   */
  translate(t, e) {
    Jt();
  }
  /**
   * Transform each coordinate of the geometry from one coordinate reference
   * system to another. The geometry is modified in place.
   * For example, a line will be transformed to a line and a circle to a circle.
   * If you do not want the geometry modified in place, first `clone()` it and
   * then use this function on the clone.
   *
   * @param {import("../proj.js").ProjectionLike} source The current projection.  Can be a
   *     string identifier or a {@link module:ol/proj/Projection~Projection} object.
   * @param {import("../proj.js").ProjectionLike} destination The desired projection.  Can be a
   *     string identifier or a {@link module:ol/proj/Projection~Projection} object.
   * @return {this} This geometry.  Note that original geometry is
   *     modified in place.
   * @api
   */
  transform(t, e) {
    const i = ui(t);
    if (!i)
      return this;
    const r = i.getUnits() == "tile-pixels" ? (
      /**
       * @param {Array<number>} inCoordinates Input coordinates.
       * @param {Array<number>} outCoordinates Output coordinates.
       * @param {number} stride Stride.
       * @return {Array<number>} Output coordinates.
       */
      function(s, o, A) {
        const a = i.getExtent(), g = i.getWorldExtent(), c = gi(g) / gi(a);
        tu(
          ta,
          g[0],
          g[3],
          c,
          -c,
          0,
          0,
          0
        );
        const u = eu(
          s,
          0,
          s.length,
          A,
          ta,
          o
        ), h = qo(i, e);
        return h ? h(u, u, A) : u;
      }
    ) : qo(i, e);
    return r && this.applyTransform(
      /** @type {import("../proj.js").TransformFunction} */
      r
    ), this;
  }
}
class mi extends su {
  constructor() {
    super(), this.layout = "XY", this.stride = 2, this.flatCoordinates;
  }
  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @protected
   * @return {import("../extent.js").Extent} extent Extent.
   * @override
   */
  computeExtent(t) {
    return rl(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t
    );
  }
  /**
   * @abstract
   * @return {Array<*> | null} Coordinates.
   */
  getCoordinates() {
    return Jt();
  }
  /**
   * Return the first coordinate of the geometry.
   * @return {import("../coordinate.js").Coordinate} First coordinate.
   * @api
   */
  getFirstCoordinate() {
    return this.flatCoordinates.slice(0, this.stride);
  }
  /**
   * @return {Array<number>} Flat coordinates.
   */
  getFlatCoordinates() {
    return this.flatCoordinates;
  }
  /**
   * Return the last coordinate of the geometry.
   * @return {import("../coordinate.js").Coordinate} Last point.
   * @api
   */
  getLastCoordinate() {
    return this.flatCoordinates.slice(
      this.flatCoordinates.length - this.stride
    );
  }
  /**
   * Return the {@link import("./Geometry.js").GeometryLayout layout} of the geometry.
   * @return {import("./Geometry.js").GeometryLayout} Layout.
   * @api
   */
  getLayout() {
    return this.layout;
  }
  /**
   * Create a simplified version of this geometry using the Douglas Peucker algorithm.
   * @param {number} squaredTolerance Squared tolerance.
   * @return {SimpleGeometry} Simplified geometry.
   * @override
   */
  getSimplifiedGeometry(t) {
    if (this.simplifiedGeometryRevision !== this.getRevision() && (this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = this.getRevision()), t < 0 || this.simplifiedGeometryMaxMinSquaredTolerance !== 0 && t <= this.simplifiedGeometryMaxMinSquaredTolerance)
      return this;
    const e = this.getSimplifiedGeometryInternal(t);
    return e.getFlatCoordinates().length < this.flatCoordinates.length ? e : (this.simplifiedGeometryMaxMinSquaredTolerance = t, this);
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {SimpleGeometry} Simplified geometry.
   * @protected
   */
  getSimplifiedGeometryInternal(t) {
    return this;
  }
  /**
   * @return {number} Stride.
   */
  getStride() {
    return this.stride;
  }
  /**
   * @param {import("./Geometry.js").GeometryLayout} layout Layout.
   * @param {Array<number>} flatCoordinates Flat coordinates.
   */
  setFlatCoordinates(t, e) {
    this.stride = ea(t), this.layout = t, this.flatCoordinates = e;
  }
  /**
   * @abstract
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  setCoordinates(t, e) {
    Jt();
  }
  /**
   * @param {import("./Geometry.js").GeometryLayout|undefined} layout Layout.
   * @param {Array<*>} coordinates Coordinates.
   * @param {number} nesting Nesting.
   * @protected
   */
  setLayout(t, e, i) {
    let r;
    if (t)
      r = ea(t);
    else {
      for (let s = 0; s < i; ++s) {
        if (e.length === 0) {
          this.layout = "XY", this.stride = 2;
          return;
        }
        e = /** @type {Array<unknown>} */
        e[0];
      }
      r = e.length, t = ou(r);
    }
    this.layout = t, this.stride = r;
  }
  /**
   * Apply a transform function to the coordinates of the geometry.
   * The geometry is modified in place.
   * If you do not want the geometry modified in place, first `clone()` it and
   * then use this function on the clone.
   * @param {import("../proj.js").TransformFunction} transformFn Transform function.
   * Called with a flat array of geometry coordinates.
   * @api
   * @override
   */
  applyTransform(t) {
    this.flatCoordinates && (t(
      this.flatCoordinates,
      this.flatCoordinates,
      this.layout.startsWith("XYZ") ? 3 : 2,
      this.stride
    ), this.changed());
  }
  /**
   * Rotate the geometry around a given coordinate. This modifies the geometry
   * coordinates in place.
   * @param {number} angle Rotation angle in counter-clockwise radians.
   * @param {import("../coordinate.js").Coordinate} anchor The rotation center.
   * @api
   * @override
   */
  rotate(t, e) {
    const i = this.getFlatCoordinates();
    if (i) {
      const r = this.getStride();
      KA(
        i,
        0,
        i.length,
        r,
        t,
        e,
        i
      ), this.changed();
    }
  }
  /**
   * Scale the geometry (with an optional origin).  This modifies the geometry
   * coordinates in place.
   * @param {number} sx The scaling factor in the x-direction.
   * @param {number} [sy] The scaling factor in the y-direction (defaults to sx).
   * @param {import("../coordinate.js").Coordinate} [anchor] The scale origin (defaults to the center
   *     of the geometry extent).
   * @api
   * @override
   */
  scale(t, e, i) {
    e === void 0 && (e = t), i || (i = er(this.getExtent()));
    const r = this.getFlatCoordinates();
    if (r) {
      const s = this.getStride();
      nu(
        r,
        0,
        r.length,
        s,
        t,
        e,
        i,
        r
      ), this.changed();
    }
  }
  /**
   * Translate the geometry.  This modifies the geometry coordinates in place.  If
   * instead you want a new geometry, first `clone()` this geometry.
   * @param {number} deltaX Delta X.
   * @param {number} deltaY Delta Y.
   * @api
   * @override
   */
  translate(t, e) {
    const i = this.getFlatCoordinates();
    if (i) {
      const r = this.getStride();
      iu(
        i,
        0,
        i.length,
        r,
        t,
        e,
        i
      ), this.changed();
    }
  }
}
function ou(n) {
  let t;
  return n == 2 ? t = "XY" : n == 3 ? t = "XYZ" : n == 4 && (t = "XYZM"), /** @type {import("./Geometry.js").GeometryLayout} */
  t;
}
function ea(n) {
  let t;
  return n == "XY" ? t = 2 : n == "XYZ" || n == "XYM" ? t = 3 : n == "XYZM" && (t = 4), /** @type {number} */
  t;
}
function JA(n, t, e, i) {
  for (let r = 0; r < i; ++r)
    n[t++] = e[r];
  return t;
}
function eo(n, t, e, i) {
  for (let r = 0, s = e.length; r < s; ++r) {
    const o = e[r];
    for (let A = 0; A < i; ++A)
      n[t++] = o[A];
  }
  return t;
}
function au(n, t, e, i, r) {
  r = r || [];
  let s = 0;
  for (let o = 0, A = e.length; o < A; ++o) {
    const a = eo(
      n,
      t,
      e[o],
      i
    );
    r[s++] = a, t = a;
  }
  return r.length = s, r;
}
class no extends mi {
  /**
   * @param {!import("../coordinate.js").Coordinate} center Center.
   *     For internal use, flat coordinates in combination with `layout` and no
   *     `radius` are also accepted.
   * @param {number} [radius] Radius in units of the projection.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(t, e, i) {
    super(), i !== void 0 && e === void 0 ? this.setFlatCoordinates(i, t) : (e = e || 0, this.setCenterAndRadius(t, e, i));
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Circle} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new no(
      this.flatCoordinates.slice(),
      void 0,
      this.layout
    );
    return t.applyProperties(this), t;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, i, r) {
    const s = this.flatCoordinates, o = t - s[0], A = e - s[1], a = o * o + A * A;
    if (a < r) {
      if (a === 0)
        for (let g = 0; g < this.stride; ++g)
          i[g] = s[g];
      else {
        const g = this.getRadius() / Math.sqrt(a);
        i[0] = s[0] + g * o, i[1] = s[1] + g * A;
        for (let c = 2; c < this.stride; ++c)
          i[c] = s[c];
      }
      return i.length = this.stride, a;
    }
    return r;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   * @override
   */
  containsXY(t, e) {
    const i = this.flatCoordinates, r = t - i[0], s = e - i[1];
    return r * r + s * s <= this.getRadiusSquared_();
  }
  /**
   * Return the center of the circle as {@link module:ol/coordinate~Coordinate coordinate}.
   * @return {import("../coordinate.js").Coordinate} Center.
   * @api
   */
  getCenter() {
    return this.flatCoordinates.slice(0, this.stride);
  }
  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @protected
   * @return {import("../extent.js").Extent} extent Extent.
   * @override
   */
  computeExtent(t) {
    const e = this.flatCoordinates, i = e[this.stride] - e[0];
    return Ir(
      e[0] - i,
      e[1] - i,
      e[0] + i,
      e[1] + i,
      t
    );
  }
  /**
   * Return the radius of the circle.
   * @return {number} Radius.
   * @api
   */
  getRadius() {
    return Math.sqrt(this.getRadiusSquared_());
  }
  /**
   * @private
   * @return {number} Radius squared.
   */
  getRadiusSquared_() {
    const t = this.flatCoordinates[this.stride] - this.flatCoordinates[0], e = this.flatCoordinates[this.stride + 1] - this.flatCoordinates[1];
    return t * t + e * e;
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "Circle";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(t) {
    const e = this.getExtent();
    if (Ys(t, e)) {
      const i = this.getCenter();
      return t[0] <= i[0] && t[2] >= i[0] || t[1] <= i[1] && t[3] >= i[1] ? !0 : zA(t, this.intersectsCoordinate.bind(this));
    }
    return !1;
  }
  /**
   * Set the center of the circle as {@link module:ol/coordinate~Coordinate coordinate}.
   * @param {import("../coordinate.js").Coordinate} center Center.
   * @api
   */
  setCenter(t) {
    const e = this.stride, i = this.flatCoordinates[e] - this.flatCoordinates[0], r = t.slice();
    r[e] = r[0] + i;
    for (let s = 1; s < e; ++s)
      r[e + s] = t[s];
    this.setFlatCoordinates(this.layout, r), this.changed();
  }
  /**
   * Set the center (as {@link module:ol/coordinate~Coordinate coordinate}) and the radius (as
   * number) of the circle.
   * @param {!import("../coordinate.js").Coordinate} center Center.
   * @param {number} radius Radius.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   */
  setCenterAndRadius(t, e, i) {
    this.setLayout(i, t, 0), this.flatCoordinates || (this.flatCoordinates = []);
    const r = this.flatCoordinates;
    let s = JA(r, 0, t, this.stride);
    r[s++] = r[0] + e;
    for (let o = 1, A = this.stride; o < A; ++o)
      r[s++] = r[o];
    r.length = s, this.changed();
  }
  /**
   * @override
   */
  getCoordinates() {
    return null;
  }
  /**
   * @param {import("../coordinate.js").Coordinate} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @override
   */
  setCoordinates(t, e) {
  }
  /**
   * Set the radius of the circle. The radius is in the units of the projection.
   * @param {number} radius Radius.
   * @api
   */
  setRadius(t) {
    this.flatCoordinates[this.stride] = this.flatCoordinates[0] + t, this.changed();
  }
  /**
   * Rotate the geometry around a given coordinate. This modifies the geometry
   * coordinates in place.
   * @param {number} angle Rotation angle in counter-clockwise radians.
   * @param {import("../coordinate.js").Coordinate} anchor The rotation center.
   * @api
   * @override
   */
  rotate(t, e) {
    const i = this.getCenter(), r = this.getStride();
    this.setCenter(
      KA(i, 0, i.length, r, t, e, i)
    ), this.changed();
  }
}
function qA(n, t, e, i) {
  let r = 0;
  const s = n[e - i], o = n[e - i + 1];
  let A = 0, a = 0;
  for (; t < e; t += i) {
    const g = n[t] - s, c = n[t + 1] - o;
    r += a * g - A * c, A = g, a = c;
  }
  return r / 2;
}
function Au(n, t, e, i) {
  let r = 0;
  for (let s = 0, o = e.length; s < o; ++s) {
    const A = e[s];
    r += qA(n, t, A, i), t = A;
  }
  return r;
}
function na(n, t, e, i, r, s, o) {
  const A = n[t], a = n[t + 1], g = n[e] - A, c = n[e + 1] - a;
  let u;
  if (g === 0 && c === 0)
    u = t;
  else {
    const h = ((r - A) * g + (s - a) * c) / (g * g + c * c);
    if (h > 1)
      u = e;
    else if (h > 0) {
      for (let p = 0; p < i; ++p)
        o[p] = Ks(
          n[t + p],
          n[e + p],
          h
        );
      o.length = i;
      return;
    } else
      u = t;
  }
  for (let h = 0; h < i; ++h)
    o[h] = n[u + h];
  o.length = i;
}
function io(n, t, e, i, r) {
  let s = n[t], o = n[t + 1];
  for (t += i; t < e; t += i) {
    const A = n[t], a = n[t + 1], g = Tn(s, o, A, a);
    g > r && (r = g), s = A, o = a;
  }
  return r;
}
function gu(n, t, e, i, r) {
  for (let s = 0, o = e.length; s < o; ++s) {
    const A = e[s];
    r = io(n, t, A, i, r), t = A;
  }
  return r;
}
function ro(n, t, e, i, r, s, o, A, a, g, c) {
  if (t == e)
    return g;
  let u, h;
  if (r === 0) {
    if (h = Tn(
      o,
      A,
      n[t],
      n[t + 1]
    ), h < g) {
      for (u = 0; u < i; ++u)
        a[u] = n[t + u];
      return a.length = i, h;
    }
    return g;
  }
  c = c || [NaN, NaN];
  let p = t + i;
  for (; p < e; )
    if (na(
      n,
      p - i,
      p,
      i,
      o,
      A,
      c
    ), h = Tn(o, A, c[0], c[1]), h < g) {
      for (g = h, u = 0; u < i; ++u)
        a[u] = c[u];
      a.length = i, p += i;
    } else
      p += i * Math.max(
        (Math.sqrt(h) - Math.sqrt(g)) / r | 0,
        1
      );
  if (s && (na(
    n,
    e - i,
    t,
    i,
    o,
    A,
    c
  ), h = Tn(o, A, c[0], c[1]), h < g)) {
    for (g = h, u = 0; u < i; ++u)
      a[u] = c[u];
    a.length = i;
  }
  return g;
}
function cu(n, t, e, i, r, s, o, A, a, g, c) {
  c = c || [NaN, NaN];
  for (let u = 0, h = e.length; u < h; ++u) {
    const p = e[u];
    g = ro(
      n,
      t,
      p,
      i,
      r,
      s,
      o,
      A,
      a,
      g,
      c
    ), t = p;
  }
  return g;
}
function so(n, t, e, i, r) {
  r = r !== void 0 ? r : [];
  let s = 0;
  for (let o = t; o < e; o += i)
    r[s++] = n.slice(o, o + i);
  return r.length = s, r;
}
function lu(n, t, e, i, r) {
  r = r !== void 0 ? r : [];
  let s = 0;
  for (let o = 0, A = e.length; o < A; ++o) {
    const a = e[o];
    r[s++] = so(
      n,
      t,
      a,
      i,
      r[s]
    ), t = a;
  }
  return r.length = s, r;
}
function uu(n, t, e, i, r) {
  return !zA(
    r,
    /**
     * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
     * @return {boolean} Contains (x, y).
     */
    function(o) {
      return !en(
        n,
        t,
        e,
        i,
        o[0],
        o[1]
      );
    }
  );
}
function en(n, t, e, i, r, s) {
  let o = 0, A = n[e - i], a = n[e - i + 1];
  for (; t < e; t += i) {
    const g = n[t], c = n[t + 1];
    a <= s ? c > s && (g - A) * (s - a) - (r - A) * (c - a) > 0 && o++ : c <= s && (g - A) * (s - a) - (r - A) * (c - a) < 0 && o--, A = g, a = c;
  }
  return o !== 0;
}
function $A(n, t, e, i, r, s) {
  if (e.length === 0 || !en(n, t, e[0], i, r, s))
    return !1;
  for (let o = 1, A = e.length; o < A; ++o)
    if (en(n, e[o - 1], e[o], i, r, s))
      return !1;
  return !0;
}
function tg(n, t, e, i, r) {
  let s;
  for (t += i; t < e; t += i)
    if (s = r(
      n.slice(t - i, t),
      n.slice(t, t + i)
    ), s)
      return s;
  return !1;
}
function dr(n, t, e, i, r, s) {
  return s = s ?? GA(FA(), n, t, e, i), Ys(r, s) ? s[0] >= r[0] && s[2] <= r[2] || s[1] >= r[1] && s[3] <= r[3] ? !0 : tg(
    n,
    t,
    e,
    i,
    /**
     * @param {import("../../coordinate.js").Coordinate} point1 Start point.
     * @param {import("../../coordinate.js").Coordinate} point2 End point.
     * @return {boolean} `true` if the segment and the extent intersect,
     *     `false` otherwise.
     */
    function(o, A) {
      return Il(r, o, A);
    }
  ) : !1;
}
function Iu(n, t, e, i, r) {
  return !!(dr(n, t, e, i, r) || en(
    n,
    t,
    e,
    i,
    r[0],
    r[1]
  ) || en(
    n,
    t,
    e,
    i,
    r[0],
    r[3]
  ) || en(
    n,
    t,
    e,
    i,
    r[2],
    r[1]
  ) || en(
    n,
    t,
    e,
    i,
    r[2],
    r[3]
  ));
}
function hu(n, t, e, i, r) {
  if (!Iu(n, t, e[0], i, r))
    return !1;
  if (e.length === 1)
    return !0;
  for (let s = 1, o = e.length; s < o; ++s)
    if (uu(
      n,
      e[s - 1],
      e[s],
      i,
      r
    ) && !dr(
      n,
      e[s - 1],
      e[s],
      i,
      r
    ))
      return !1;
  return !0;
}
function eg(n, t, e, i, r, s, o) {
  const A = (e - t) / i;
  if (A < 3) {
    for (; t < e; t += i)
      s[o++] = n[t], s[o++] = n[t + 1];
    return o;
  }
  const a = new Array(A);
  a[0] = 1, a[A - 1] = 1;
  const g = [t, e - i];
  let c = 0;
  for (; g.length > 0; ) {
    const u = (
      /** @type {number} */
      g.pop()
    ), h = (
      /** @type {number} */
      g.pop()
    );
    let p = 0;
    const m = n[h], l = n[h + 1], I = n[u], C = n[u + 1];
    for (let d = h + i; d < u; d += i) {
      const x = n[d], w = n[d + 1], f = dl(x, w, m, l, I, C);
      f > p && (c = d, p = f);
    }
    p > r && (a[(c - t) / i] = 1, h + i < c && g.push(h, c), c + i < u && g.push(c, u));
  }
  for (let u = 0; u < A; ++u)
    a[u] && (s[o++] = n[t + u * i], s[o++] = n[t + u * i + 1]);
  return o;
}
function Cn(n, t) {
  return t * Math.round(n / t);
}
function Cu(n, t, e, i, r, s, o) {
  if (t == e)
    return o;
  let A = Cn(n[t], r), a = Cn(n[t + 1], r);
  t += i, s[o++] = A, s[o++] = a;
  let g, c;
  do
    if (g = Cn(n[t], r), c = Cn(n[t + 1], r), t += i, t == e)
      return s[o++] = g, s[o++] = c, o;
  while (g == A && c == a);
  for (; t < e; ) {
    const u = Cn(n[t], r), h = Cn(n[t + 1], r);
    if (t += i, u == g && h == c)
      continue;
    const p = g - A, m = c - a, l = u - A, I = h - a;
    if (p * I == m * l && (p < 0 && l < p || p == l || p > 0 && l > p) && (m < 0 && I < m || m == I || m > 0 && I > m)) {
      g = u, c = h;
      continue;
    }
    s[o++] = g, s[o++] = c, A = g, a = c, g = u, c = h;
  }
  return s[o++] = g, s[o++] = c, o;
}
function fu(n, t, e, i, r, s, o, A) {
  for (let a = 0, g = e.length; a < g; ++a) {
    const c = e[a];
    o = Cu(
      n,
      t,
      c,
      i,
      r,
      s,
      o
    ), A.push(o), t = c;
  }
  return o;
}
class Ii extends mi {
  /**
   * @param {Array<import("../coordinate.js").Coordinate>|Array<number>} coordinates Coordinates.
   *     For internal use, flat coordinates in combination with `layout` are also accepted.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(t, e) {
    super(), this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, e !== void 0 && !Array.isArray(t[0]) ? this.setFlatCoordinates(
      e,
      /** @type {Array<number>} */
      t
    ) : this.setCoordinates(
      /** @type {Array<import("../coordinate.js").Coordinate>} */
      t,
      e
    );
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!LinearRing} Clone.
   * @api
   * @override
   */
  clone() {
    return new Ii(this.flatCoordinates.slice(), this.layout);
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, i, r) {
    return r < Hs(this.getExtent(), t, e) ? r : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      io(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), ro(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      this.maxDelta_,
      !0,
      t,
      e,
      i,
      r
    ));
  }
  /**
   * Return the area of the linear ring on projected plane.
   * @return {number} Area (on projected plane).
   * @api
   */
  getArea() {
    return qA(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  /**
   * Return the coordinates of the linear ring.
   * @return {Array<import("../coordinate.js").Coordinate>} Coordinates.
   * @api
   * @override
   */
  getCoordinates() {
    return so(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {LinearRing} Simplified LinearRing.
   * @protected
   * @override
   */
  getSimplifiedGeometryInternal(t) {
    const e = [];
    return e.length = eg(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      0
    ), new Ii(e, "XY");
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "LinearRing";
  }
  /**
   * Test if the geometry and the passed extent intersect. A linear ring is
   * treated as a line string for this test.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(t) {
    return dr(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t
    );
  }
  /**
   * Set the coordinates of the linear ring.
   * @param {!Array<import("../coordinate.js").Coordinate>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = eo(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function du(n, t, e, i, r, s, o) {
  let A, a;
  const g = (e - t) / i;
  if (g === 1)
    A = t;
  else if (g === 2)
    A = t, a = r;
  else if (g !== 0) {
    let c = n[t], u = n[t + 1], h = 0;
    const p = [0];
    for (let I = t + i; I < e; I += i) {
      const C = n[I], d = n[I + 1];
      h += Math.sqrt((C - c) * (C - c) + (d - u) * (d - u)), p.push(h), c = C, u = d;
    }
    const m = r * h, l = Yc(p, m);
    l < 0 ? (a = (m - p[-l - 2]) / (p[-l - 1] - p[-l - 2]), A = t + (-l - 2) * i) : A = t + l * i;
  }
  o = o !== void 0 && o > 1 ? o : 2, s = s || new Array(o);
  for (let c = 0; c < o; ++c)
    s[c] = A === void 0 ? NaN : a === void 0 ? n[A + c] : Ks(n[A + c], n[A + i + c], a);
  return s;
}
function pu(n, t, e, i, r, s) {
  if (e == t)
    return null;
  let o;
  if (r < n[t + i - 1])
    return s ? (o = n.slice(t, t + i), o[i - 1] = r, o) : null;
  if (n[e - 1] < r)
    return s ? (o = n.slice(e - i, e), o[i - 1] = r, o) : null;
  if (r == n[t + i - 1])
    return n.slice(t, t + i);
  let A = t / i, a = e / i;
  for (; A < a; ) {
    const h = A + a >> 1;
    r < n[(h + 1) * i - 1] ? a = h : A = h + 1;
  }
  const g = n[A * i - 1];
  if (r == g)
    return n.slice((A - 1) * i, (A - 1) * i + i);
  const c = n[(A + 1) * i - 1], u = (r - g) / (c - g);
  o = [];
  for (let h = 0; h < i - 1; ++h)
    o.push(
      Ks(
        n[(A - 1) * i + h],
        n[A * i + h],
        u
      )
    );
  return o.push(r), o;
}
function mu(n, t, e, i) {
  let r = n[t], s = n[t + 1], o = 0;
  for (let A = t + i; A < e; A += i) {
    const a = n[A], g = n[A + 1];
    o += Math.sqrt((a - r) * (a - r) + (g - s) * (g - s)), r = a, s = g;
  }
  return o;
}
class sr extends mi {
  /**
   * @param {Array<import("../coordinate.js").Coordinate>|Array<number>} coordinates Coordinates.
   *     For internal use, flat coordinates in combination with `layout` are also accepted.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(t, e) {
    super(), this.flatMidpoint_ = null, this.flatMidpointRevision_ = -1, this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, e !== void 0 && !Array.isArray(t[0]) ? this.setFlatCoordinates(
      e,
      /** @type {Array<number>} */
      t
    ) : this.setCoordinates(
      /** @type {Array<import("../coordinate.js").Coordinate>} */
      t,
      e
    );
  }
  /**
   * Append the passed coordinate to the coordinates of the linestring.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @api
   */
  appendCoordinate(t) {
    DA(this.flatCoordinates, t), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!LineString} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new sr(
      this.flatCoordinates.slice(),
      this.layout
    );
    return t.applyProperties(this), t;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, i, r) {
    return r < Hs(this.getExtent(), t, e) ? r : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      io(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), ro(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      this.maxDelta_,
      !1,
      t,
      e,
      i,
      r
    ));
  }
  /**
   * Iterate over each segment, calling the provided callback.
   * If the callback returns a truthy value the function returns that
   * value immediately. Otherwise the function returns `false`.
   *
   * @param {function(this: S, import("../coordinate.js").Coordinate, import("../coordinate.js").Coordinate): T} callback Function
   *     called for each segment. The function will receive two arguments, the start and end coordinates of the segment.
   * @return {T|boolean} Value.
   * @template T,S
   * @api
   */
  forEachSegment(t) {
    return tg(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t
    );
  }
  /**
   * Returns the coordinate at `m` using linear interpolation, or `null` if no
   * such coordinate exists.
   *
   * `extrapolate` controls extrapolation beyond the range of Ms in the
   * MultiLineString. If `extrapolate` is `true` then Ms less than the first
   * M will return the first coordinate and Ms greater than the last M will
   * return the last coordinate.
   *
   * @param {number} m M.
   * @param {boolean} [extrapolate] Extrapolate. Default is `false`.
   * @return {import("../coordinate.js").Coordinate|null} Coordinate.
   * @api
   */
  getCoordinateAtM(t, e) {
    return this.layout != "XYM" && this.layout != "XYZM" ? null : (e = e !== void 0 ? e : !1, pu(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e
    ));
  }
  /**
   * Return the coordinates of the linestring.
   * @return {Array<import("../coordinate.js").Coordinate>} Coordinates.
   * @api
   * @override
   */
  getCoordinates() {
    return so(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  /**
   * Return the coordinate at the provided fraction along the linestring.
   * The `fraction` is a number between 0 and 1, where 0 is the start of the
   * linestring and 1 is the end.
   * @param {number} fraction Fraction.
   * @param {import("../coordinate.js").Coordinate} [dest] Optional coordinate whose values will
   *     be modified. If not provided, a new coordinate will be returned.
   * @return {import("../coordinate.js").Coordinate} Coordinate of the interpolated point.
   * @api
   */
  getCoordinateAt(t, e) {
    return du(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      this.stride
    );
  }
  /**
   * Return the length of the linestring on projected plane.
   * @return {number} Length (on projected plane).
   * @api
   */
  getLength() {
    return mu(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  /**
   * @return {Array<number>} Flat midpoint.
   */
  getFlatMidpoint() {
    return this.flatMidpointRevision_ != this.getRevision() && (this.flatMidpoint_ = this.getCoordinateAt(
      0.5,
      this.flatMidpoint_ ?? void 0
    ), this.flatMidpointRevision_ = this.getRevision()), /** @type {Array<number>} */
    this.flatMidpoint_;
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {LineString} Simplified LineString.
   * @protected
   * @override
   */
  getSimplifiedGeometryInternal(t) {
    const e = [];
    return e.length = eg(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      0
    ), new sr(e, "XY");
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "LineString";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(t) {
    return dr(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      this.getExtent()
    );
  }
  /**
   * Set the coordinates of the linestring.
   * @param {!Array<import("../coordinate.js").Coordinate>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = eo(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
class Bn extends mi {
  /**
   * @param {import("../coordinate.js").Coordinate} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(t, e) {
    super(), this.setCoordinates(t, e);
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Point} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new Bn(this.flatCoordinates.slice(), this.layout);
    return t.applyProperties(this), t;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, i, r) {
    const s = this.flatCoordinates, o = Tn(
      t,
      e,
      s[0],
      s[1]
    );
    if (o < r) {
      const A = this.stride;
      for (let a = 0; a < A; ++a)
        i[a] = s[a];
      return i.length = A, o;
    }
    return r;
  }
  /**
   * Return the coordinate of the point.
   * @return {import("../coordinate.js").Coordinate} Coordinates.
   * @api
   * @override
   */
  getCoordinates() {
    return this.flatCoordinates.slice();
  }
  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @protected
   * @return {import("../extent.js").Extent} extent Extent.
   * @override
   */
  computeExtent(t) {
    return il(this.flatCoordinates, t);
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "Point";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(t) {
    return nl(t, this.flatCoordinates[0], this.flatCoordinates[1]);
  }
  /**
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 0), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = JA(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function yu(n, t, e, i, r, s, o) {
  let A, a, g, c, u, h, p;
  const m = r[s + 1], l = [];
  for (let d = 0, x = e.length; d < x; ++d) {
    const w = e[d];
    for (c = n[w - i], h = n[w - i + 1], A = t; A < w; A += i)
      u = n[A], p = n[A + 1], (m <= h && p <= m || h <= m && m <= p) && (g = (m - h) / (p - h) * (u - c) + c, l.push(g)), c = u, h = p;
  }
  let I = NaN, C = -1 / 0;
  for (l.sort(OA), c = l[0], A = 1, a = l.length; A < a; ++A) {
    u = l[A];
    const d = Math.abs(u - c);
    d > C && (g = (c + u) / 2, $A(n, t, e, i, g, m) && (I = g, C = d)), c = u;
  }
  return isNaN(I) && (I = r[s]), [I, m, C];
}
function vu(n, t, e, i) {
  for (; t < e - i; ) {
    for (let r = 0; r < i; ++r) {
      const s = n[t + r];
      n[t + r] = n[e - i + r], n[e - i + r] = s;
    }
    t += i, e -= i;
  }
}
function ng(n, t, e, i) {
  let r = 0, s = n[e - i], o = n[e - i + 1];
  for (; t < e; t += i) {
    const A = n[t], a = n[t + 1];
    r += (A - s) * (a + o), s = A, o = a;
  }
  return r === 0 ? void 0 : r > 0;
}
function wu(n, t, e, i, r) {
  r = r !== void 0 ? r : !1;
  for (let s = 0, o = e.length; s < o; ++s) {
    const A = e[s], a = ng(
      n,
      t,
      A,
      i
    );
    if (s === 0) {
      if (r && a || !r && !a)
        return !1;
    } else if (r && !a || !r && a)
      return !1;
    t = A;
  }
  return !0;
}
function ia(n, t, e, i, r) {
  r = r !== void 0 ? r : !1;
  for (let s = 0, o = e.length; s < o; ++s) {
    const A = e[s], a = ng(
      n,
      t,
      A,
      i
    );
    (s === 0 ? r && a || !r && !a : r && !a || !r && a) && vu(n, t, A, i), t = A;
  }
  return t;
}
class rn extends mi {
  /**
   * @param {!Array<Array<import("../coordinate.js").Coordinate>>|!Array<number>} coordinates
   *     Array of linear rings that define the polygon. The first linear ring of the
   *     array defines the outer-boundary or surface of the polygon. Each subsequent
   *     linear ring defines a hole in the surface of the polygon. A linear ring is
   *     an array of vertices' coordinates where the first coordinate and the last are
   *     equivalent. (For internal use, flat coordinates in combination with
   *     `layout` and `ends` are also accepted.)
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @param {Array<number>} [ends] Ends (for internal use with flat coordinates).
   */
  constructor(t, e, i) {
    super(), this.ends_ = [], this.flatInteriorPointRevision_ = -1, this.flatInteriorPoint_ = null, this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, this.orientedRevision_ = -1, this.orientedFlatCoordinates_ = null, e !== void 0 && i ? (this.setFlatCoordinates(
      e,
      /** @type {Array<number>} */
      t
    ), this.ends_ = i) : this.setCoordinates(
      /** @type {Array<Array<import("../coordinate.js").Coordinate>>} */
      t,
      e
    );
  }
  /**
   * Append the passed linear ring to this polygon.
   * @param {LinearRing} linearRing Linear ring.
   * @api
   */
  appendLinearRing(t) {
    this.flatCoordinates ? DA(this.flatCoordinates, t.getFlatCoordinates()) : this.flatCoordinates = t.getFlatCoordinates().slice(), this.ends_.push(this.flatCoordinates.length), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Polygon} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new rn(
      this.flatCoordinates.slice(),
      this.layout,
      this.ends_.slice()
    );
    return t.applyProperties(this), t;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, i, r) {
    return r < Hs(this.getExtent(), t, e) ? r : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      gu(
        this.flatCoordinates,
        0,
        this.ends_,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), cu(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      this.maxDelta_,
      !0,
      t,
      e,
      i,
      r
    ));
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   * @override
   */
  containsXY(t, e) {
    return $A(
      this.getOrientedFlatCoordinates(),
      0,
      this.ends_,
      this.stride,
      t,
      e
    );
  }
  /**
   * Return the area of the polygon on projected plane.
   * @return {number} Area (on projected plane).
   * @api
   */
  getArea() {
    return Au(
      this.getOrientedFlatCoordinates(),
      0,
      this.ends_,
      this.stride
    );
  }
  /**
   * Get the coordinate array for this geometry.  This array has the structure
   * of a GeoJSON coordinate array for polygons.
   *
   * @param {boolean} [right] Orient coordinates according to the right-hand
   *     rule (counter-clockwise for exterior and clockwise for interior rings).
   *     If `false`, coordinates will be oriented according to the left-hand rule
   *     (clockwise for exterior and counter-clockwise for interior rings).
   *     By default, coordinate orientation will depend on how the geometry was
   *     constructed.
   * @return {Array<Array<import("../coordinate.js").Coordinate>>} Coordinates.
   * @api
   * @override
   */
  getCoordinates(t) {
    let e;
    return t !== void 0 ? (e = this.getOrientedFlatCoordinates().slice(), ia(e, 0, this.ends_, this.stride, t)) : e = this.flatCoordinates, lu(e, 0, this.ends_, this.stride);
  }
  /**
   * @return {Array<number>} Ends.
   */
  getEnds() {
    return this.ends_;
  }
  /**
   * @return {Array<number>} Interior point.
   */
  getFlatInteriorPoint() {
    if (this.flatInteriorPointRevision_ != this.getRevision()) {
      const t = er(this.getExtent());
      this.flatInteriorPoint_ = yu(
        this.getOrientedFlatCoordinates(),
        0,
        this.ends_,
        this.stride,
        t,
        0
      ), this.flatInteriorPointRevision_ = this.getRevision();
    }
    return (
      /** @type {import("../coordinate.js").Coordinate} */
      this.flatInteriorPoint_
    );
  }
  /**
   * Return an interior point of the polygon.
   * @return {Point} Interior point as XYM coordinate, where M is the
   * length of the horizontal intersection that the point belongs to.
   * @api
   */
  getInteriorPoint() {
    return new Bn(this.getFlatInteriorPoint(), "XYM");
  }
  /**
   * Return the number of rings of the polygon,  this includes the exterior
   * ring and any interior rings.
   *
   * @return {number} Number of rings.
   * @api
   */
  getLinearRingCount() {
    return this.ends_.length;
  }
  /**
   * Return the Nth linear ring of the polygon geometry. Return `null` if the
   * given index is out of range.
   * The exterior linear ring is available at index `0` and the interior rings
   * at index `1` and beyond.
   *
   * @param {number} index Index.
   * @return {LinearRing|null} Linear ring.
   * @api
   */
  getLinearRing(t) {
    return t < 0 || this.ends_.length <= t ? null : new Ii(
      this.flatCoordinates.slice(
        t === 0 ? 0 : this.ends_[t - 1],
        this.ends_[t]
      ),
      this.layout
    );
  }
  /**
   * Return the linear rings of the polygon.
   * @return {Array<LinearRing>} Linear rings.
   * @api
   */
  getLinearRings() {
    const t = this.layout, e = this.flatCoordinates, i = this.ends_, r = [];
    let s = 0;
    for (let o = 0, A = i.length; o < A; ++o) {
      const a = i[o], g = new Ii(
        e.slice(s, a),
        t
      );
      r.push(g), s = a;
    }
    return r;
  }
  /**
   * @return {Array<number>} Oriented flat coordinates.
   */
  getOrientedFlatCoordinates() {
    if (this.orientedRevision_ != this.getRevision()) {
      const t = this.flatCoordinates;
      wu(t, 0, this.ends_, this.stride) ? this.orientedFlatCoordinates_ = t : (this.orientedFlatCoordinates_ = t.slice(), this.orientedFlatCoordinates_.length = ia(
        this.orientedFlatCoordinates_,
        0,
        this.ends_,
        this.stride
      )), this.orientedRevision_ = this.getRevision();
    }
    return (
      /** @type {Array<number>} */
      this.orientedFlatCoordinates_
    );
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {Polygon} Simplified Polygon.
   * @protected
   * @override
   */
  getSimplifiedGeometryInternal(t) {
    const e = [], i = [];
    return e.length = fu(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      Math.sqrt(t),
      e,
      0,
      i
    ), new rn(e, "XY", i);
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "Polygon";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(t) {
    return hu(
      this.getOrientedFlatCoordinates(),
      0,
      this.ends_,
      this.stride,
      t
    );
  }
  /**
   * Set the coordinates of the polygon.
   * @param {!Array<Array<import("../coordinate.js").Coordinate>>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 2), this.flatCoordinates || (this.flatCoordinates = []);
    const i = au(
      this.flatCoordinates,
      0,
      t,
      this.stride,
      this.ends_
    );
    this.flatCoordinates.length = i.length === 0 ? 0 : i[i.length - 1], this.changed();
  }
}
function ra(n) {
  if (UA(n))
    throw new Error("Cannot create polygon from empty extent");
  const t = n[0], e = n[1], i = n[2], r = n[3], s = [
    t,
    e,
    t,
    r,
    i,
    r,
    i,
    e,
    t,
    e
  ];
  return new rn(s, "XY", [s.length]);
}
const bu = {
  /**
   * Indicates that tile loading failed
   * @type {number}
   */
  ERROR: 3
};
function ig(n, t, e = {}) {
  const i = { type: "Feature" };
  return (e.id === 0 || e.id) && (i.id = e.id), e.bbox && (i.bbox = e.bbox), i.properties = t || {}, i.geometry = n, i;
}
function ke(n, t, e = {}) {
  if (!n)
    throw new Error("coordinates is required");
  if (!Array.isArray(n))
    throw new Error("coordinates must be an Array");
  if (n.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!sa(n[0]) || !sa(n[1]))
    throw new Error("coordinates must contain numbers");
  return ig({
    type: "Point",
    coordinates: n
  }, t, e);
}
function Ss(n, t, e = {}) {
  for (const i of n) {
    if (i.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (i[i.length - 1].length !== i[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let r = 0; r < i[i.length - 1].length; r++)
      if (i[i.length - 1][r] !== i[0][r])
        throw new Error("First and last Position are not equivalent.");
  }
  return ig({
    type: "Polygon",
    coordinates: n
  }, t, e);
}
function Nn(n, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = n, e;
}
function sa(n) {
  return !isNaN(n) && n !== null && !Array.isArray(n);
}
function Eu(n) {
  if (!n)
    throw new Error("coord is required");
  if (!Array.isArray(n)) {
    if (n.type === "Feature" && n.geometry !== null && n.geometry.type === "Point")
      return [...n.geometry.coordinates];
    if (n.type === "Point")
      return [...n.coordinates];
  }
  if (Array.isArray(n) && n.length >= 2 && !Array.isArray(n[0]) && !Array.isArray(n[1]))
    return [...n];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function oa(n) {
  if (Array.isArray(n))
    return n;
  if (n.type === "Feature") {
    if (n.geometry !== null)
      return n.geometry.coordinates;
  } else if (n.coordinates)
    return n.coordinates;
  throw new Error(
    "coords must be GeoJSON Feature, Geometry Object or an Array"
  );
}
function xu(n) {
  return n.type === "Feature" ? n.geometry : n;
}
const Re = 11102230246251565e-32, zt = 134217729, Mu = (3 + 8 * Re) * Re;
function Gr(n, t, e, i, r) {
  let s, o, A, a, g = t[0], c = i[0], u = 0, h = 0;
  c > g == c > -g ? (s = g, g = t[++u]) : (s = c, c = i[++h]);
  let p = 0;
  if (u < n && h < e)
    for (c > g == c > -g ? (o = g + s, A = s - (o - g), g = t[++u]) : (o = c + s, A = s - (o - c), c = i[++h]), s = o, A !== 0 && (r[p++] = A); u < n && h < e; )
      c > g == c > -g ? (o = s + g, a = o - s, A = s - (o - a) + (g - a), g = t[++u]) : (o = s + c, a = o - s, A = s - (o - a) + (c - a), c = i[++h]), s = o, A !== 0 && (r[p++] = A);
  for (; u < n; )
    o = s + g, a = o - s, A = s - (o - a) + (g - a), g = t[++u], s = o, A !== 0 && (r[p++] = A);
  for (; h < e; )
    o = s + c, a = o - s, A = s - (o - a) + (c - a), c = i[++h], s = o, A !== 0 && (r[p++] = A);
  return (s !== 0 || p === 0) && (r[p++] = s), p;
}
function Su(n, t) {
  let e = t[0];
  for (let i = 1; i < n; i++) e += t[i];
  return e;
}
function yi(n) {
  return new Float64Array(n);
}
const Tu = (3 + 16 * Re) * Re, _u = (2 + 12 * Re) * Re, ku = (9 + 64 * Re) * Re * Re, fn = yi(4), aa = yi(8), Aa = yi(12), ga = yi(16), Qt = yi(4);
function Ru(n, t, e, i, r, s, o) {
  let A, a, g, c, u, h, p, m, l, I, C, d, x, w, f, y, v, M;
  const S = n - r, E = e - r, T = t - s, _ = i - s;
  w = S * _, h = zt * S, p = h - (h - S), m = S - p, h = zt * _, l = h - (h - _), I = _ - l, f = m * I - (w - p * l - m * l - p * I), y = T * E, h = zt * T, p = h - (h - T), m = T - p, h = zt * E, l = h - (h - E), I = E - l, v = m * I - (y - p * l - m * l - p * I), C = f - v, u = f - C, fn[0] = f - (C + u) + (u - v), d = w + C, u = d - w, x = w - (d - u) + (C - u), C = x - y, u = x - C, fn[1] = x - (C + u) + (u - y), M = d + C, u = M - d, fn[2] = d - (M - u) + (C - u), fn[3] = M;
  let L = Su(4, fn), D = _u * o;
  if (L >= D || -L >= D || (u = n - S, A = n - (S + u) + (u - r), u = e - E, g = e - (E + u) + (u - r), u = t - T, a = t - (T + u) + (u - s), u = i - _, c = i - (_ + u) + (u - s), A === 0 && a === 0 && g === 0 && c === 0) || (D = ku * o + Mu * Math.abs(L), L += S * c + _ * A - (T * g + E * a), L >= D || -L >= D)) return L;
  w = A * _, h = zt * A, p = h - (h - A), m = A - p, h = zt * _, l = h - (h - _), I = _ - l, f = m * I - (w - p * l - m * l - p * I), y = a * E, h = zt * a, p = h - (h - a), m = a - p, h = zt * E, l = h - (h - E), I = E - l, v = m * I - (y - p * l - m * l - p * I), C = f - v, u = f - C, Qt[0] = f - (C + u) + (u - v), d = w + C, u = d - w, x = w - (d - u) + (C - u), C = x - y, u = x - C, Qt[1] = x - (C + u) + (u - y), M = d + C, u = M - d, Qt[2] = d - (M - u) + (C - u), Qt[3] = M;
  const F = Gr(4, fn, 4, Qt, aa);
  w = S * c, h = zt * S, p = h - (h - S), m = S - p, h = zt * c, l = h - (h - c), I = c - l, f = m * I - (w - p * l - m * l - p * I), y = T * g, h = zt * T, p = h - (h - T), m = T - p, h = zt * g, l = h - (h - g), I = g - l, v = m * I - (y - p * l - m * l - p * I), C = f - v, u = f - C, Qt[0] = f - (C + u) + (u - v), d = w + C, u = d - w, x = w - (d - u) + (C - u), C = x - y, u = x - C, Qt[1] = x - (C + u) + (u - y), M = d + C, u = M - d, Qt[2] = d - (M - u) + (C - u), Qt[3] = M;
  const z = Gr(F, aa, 4, Qt, Aa);
  w = A * c, h = zt * A, p = h - (h - A), m = A - p, h = zt * c, l = h - (h - c), I = c - l, f = m * I - (w - p * l - m * l - p * I), y = a * g, h = zt * a, p = h - (h - a), m = a - p, h = zt * g, l = h - (h - g), I = g - l, v = m * I - (y - p * l - m * l - p * I), C = f - v, u = f - C, Qt[0] = f - (C + u) + (u - v), d = w + C, u = d - w, x = w - (d - u) + (C - u), C = x - y, u = x - C, Qt[1] = x - (C + u) + (u - y), M = d + C, u = M - d, Qt[2] = d - (M - u) + (C - u), Qt[3] = M;
  const k = Gr(z, Aa, 4, Qt, ga);
  return ga[k - 1];
}
function Pu(n, t, e, i, r, s) {
  const o = (t - s) * (e - r), A = (n - r) * (i - s), a = o - A, g = Math.abs(o + A);
  return Math.abs(a) >= Tu * g ? a : -Ru(n, t, e, i, r, s, g);
}
function Ou(n, t) {
  var e, i, r = 0, s, o, A, a, g, c, u, h = n[0], p = n[1], m = t.length;
  for (e = 0; e < m; e++) {
    i = 0;
    var l = t[e], I = l.length - 1;
    if (c = l[0], c[0] !== l[I][0] && c[1] !== l[I][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (o = c[0] - h, A = c[1] - p, i; i < I; i++) {
      if (u = l[i + 1], a = u[0] - h, g = u[1] - p, A === 0 && g === 0) {
        if (a <= 0 && o >= 0 || o <= 0 && a >= 0)
          return 0;
      } else if (g >= 0 && A <= 0 || g <= 0 && A >= 0) {
        if (s = Pu(o, a, A, g, 0, 0), s === 0)
          return 0;
        (s > 0 && g > 0 && A <= 0 || s < 0 && g <= 0 && A > 0) && r++;
      }
      c = u, A = g, o = a;
    }
  }
  return r % 2 !== 0;
}
function nn(n, t, e = {}) {
  if (!n)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = Eu(n), r = xu(t), s = r.type, o = t.bbox;
  let A = r.coordinates;
  if (o && Lu(i, o) === !1)
    return !1;
  s === "Polygon" && (A = [A]);
  for (var a = 0; a < A.length; ++a) {
    const g = Ou(i, A[a]);
    if (g === 0 && !e.ignoreBoundary || g) return !0;
  }
  return !1;
}
function Lu(n, t) {
  return t[0] <= n[0] && t[1] <= n[1] && t[2] >= n[0] && t[3] >= n[1];
}
function zr(n, t) {
  for (let e = 0; e < t.features.length; e++)
    if (nn(n, t.features[e]))
      return t.features[e];
}
function rg(n, t) {
  const e = t.geometry.coordinates[0][0], i = t.geometry.coordinates[0][1], r = t.geometry.coordinates[0][2], s = n.geometry.coordinates, o = t.properties.a.geom, A = t.properties.b.geom, a = t.properties.c.geom, g = [i[0] - e[0], i[1] - e[1]], c = [r[0] - e[0], r[1] - e[1]], u = [s[0] - e[0], s[1] - e[1]], h = [A[0] - o[0], A[1] - o[1]], p = [a[0] - o[0], a[1] - o[1]], m = (c[1] * u[0] - c[0] * u[1]) / (g[0] * c[1] - g[1] * c[0]), l = (g[0] * u[1] - g[1] * u[0]) / (g[0] * c[1] - g[1] * c[0]);
  return [
    m * h[0] + l * p[0] + o[0],
    m * h[1] + l * p[1] + o[1]
  ];
}
function Du(n, t, e) {
  const i = n.geometry.coordinates, r = e.geometry.coordinates, s = Math.atan2(i[0] - r[0], i[1] - r[1]), o = Fu(s, t[0]);
  if (o === void 0)
    throw new Error("Unable to determine vertex index");
  const A = t[1][o];
  return rg(n, A.features[0]);
}
function Bu(n, t, e, i, r, s, o, A) {
  let a;
  if (o && (a = zr(n, Nn([o]))), !a)
    if (e) {
      const g = n.geometry.coordinates, c = e.gridNum, u = e.xOrigin, h = e.yOrigin, p = e.xUnit, m = e.yUnit, l = e.gridCache, I = ne(g[0], u, p, c), C = ne(g[1], h, m, c), d = l[I] ? l[I][C] ? l[I][C] : [] : [], x = Nn(d.map((w) => t.features[w]));
      a = zr(n, x);
    } else
      a = zr(n, t);
  return A && A(a), a ? rg(n, a) : Du(n, i, r);
}
function ne(n, t, e, i) {
  let r = Math.floor((n - t) / e);
  return r < 0 && (r = 0), r >= i && (r = i - 1), r;
}
const Nu = 36;
function ca(n, t, e) {
  const i = (t[1][0] - t[0][0]) / e, r = (t[1][1] - t[0][1]) / e;
  return n.reduce((s, o) => {
    const A = ne(o[0][0], t[0][0], i, e), a = ne(o[1][0], t[0][0], i, e), g = ne(o[0][1], t[0][1], r, e), c = ne(o[1][1], t[0][1], r, e), u = (a - A + 1) * (c - g + 1);
    return u > 0 ? s + u : s;
  }, 0);
}
function Fu(n, t) {
  let e = la(n - t[0]), i = Math.PI * 2, r;
  for (let s = 0; s < t.length; s++) {
    const o = (s + 1) % t.length, A = la(n - t[o]), a = Math.min(Math.abs(e), Math.abs(A));
    e * A <= 0 && a < i && (i = a, r = s), e = A;
  }
  return r;
}
function la(n, t = !1) {
  const e = 2 * Math.PI, i = n - Math.floor(n / e) * e;
  return t ? i : i > Math.PI ? i - e : i;
}
function ju(n) {
  const t = [0, 1, 2, 0].map((i) => n[i][0][0]), e = {
    a: { geom: n[0][0][1], index: n[0][1] },
    b: { geom: n[1][0][1], index: n[1][1] },
    c: { geom: n[2][0][1], index: n[2][1] }
  };
  return Ss([t], e);
}
function Ts(n, t, e, i, r, s = !1, o) {
  const A = n.map(
    (a) => {
      (!o || o < 2.00703) && (a = Gu(a));
      const g = isFinite(a) ? t[a] : a === "c" ? i : (function() {
        const c = a.match(/^b(\d+)$/);
        if (c) return r[parseInt(c[1])];
        const u = a.match(/^e(\d+)$/);
        if (u) return e[parseInt(u[1])];
        throw new Error("Bad index value for indexesToTri");
      })();
      return s ? [[g[1], g[0]], a] : [[g[0], g[1]], a];
    }
  );
  return ju(A);
}
function Gu(n) {
  return typeof n == "number" ? n : n.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
}
function zu(n, t) {
  return t && t >= 2.00703 || Array.isArray(n[0]) ? n : n.map((e) => [
    e.illstNodes,
    e.mercNodes,
    e.startEnd
  ]);
}
const Uu = 2.00704;
function Xu(n) {
  return !!(n.version !== void 0 || !n.tins && n.points && n.tins_points);
}
function Zu(n) {
  return {
    points: n.points,
    strictStatus: Vu(n),
    verticesParams: Hu(n),
    centroid: Qu(n),
    edges: zu(n.edges || []),
    edgeNodes: n.edgeNodes || [],
    tins: Yu(n),
    kinks: Ku(n.kinks_points),
    yaxisMode: n.yaxisMode ?? "invert",
    strictMode: n.strictMode ?? "auto",
    vertexMode: n.vertexMode,
    bounds: n.bounds,
    boundsPolygon: n.boundsPolygon,
    wh: n.wh,
    xy: n.xy ?? [0, 0]
  };
}
function Wu(n) {
  const t = Ju(n), e = t.tins, i = t.vertices_params;
  return i != null && sg(i), {
    compiled: t,
    tins: e,
    points: qu(e),
    strictStatus: t.strict_status,
    verticesParams: i,
    centroid: t.centroid,
    kinks: t.kinks
  };
}
function Vu(n) {
  return n.strict_status ? n.strict_status : n.kinks_points ? "strict_error" : n.tins_points.length === 2 ? "loose" : "strict";
}
function Hu(n) {
  if (!Array.isArray(n.vertices_params) || !Array.isArray(n.vertices_points))
    throw new Error(
      "Invalid compiled data: vertices_params and vertices_points must be arrays"
    );
  const t = {
    forw: [n.vertices_params[0]],
    bakw: [n.vertices_params[1]]
  };
  return t.forw[1] = ua(n, !1), t.bakw[1] = ua(n, !0), sg(t), t;
}
function sg(n) {
  if (typeof n != "object")
    throw new Error("Invalid compiled data: vertices_params has a wrong shape");
  ["forw", "bakw"].forEach((t) => {
    const e = n[t];
    if (e == null) return;
    const i = `vertices_params.${t}`, r = e[0], s = e[1];
    if (!Array.isArray(r) || !Array.isArray(s))
      throw new Error(`Invalid compiled data: ${i} must hold two arrays`);
    if (r.length !== s.length)
      throw new Error(
        `Invalid compiled data: ${i} must have one angle per vertex`
      );
    for (let o = 0; o < r.length; o++)
      if (typeof r[o] != "number" || !Number.isFinite(r[o]))
        throw new Error(
          `Invalid compiled data: ${i} must contain only finite numbers`
        );
  });
}
function ua(n, t) {
  const e = n.vertices_points.length;
  return Array.from({ length: e }, (i, r) => {
    const s = (r + 1) % e, o = Ts(
      ["c", `b${r}`, `b${s}`],
      n.points,
      n.edgeNodes || [],
      n.centroid_point,
      n.vertices_points,
      t,
      Uu
    );
    return Nn([o]);
  });
}
function Qu(n) {
  return {
    forw: ke(n.centroid_point[0], {
      target: {
        geom: n.centroid_point[1],
        index: "c"
      }
    }),
    bakw: ke(n.centroid_point[1], {
      target: {
        geom: n.centroid_point[0],
        index: "c"
      }
    })
  };
}
function Yu(n) {
  const t = n.tins_points.length === 1 ? 0 : 1;
  return {
    forw: Nn(
      n.tins_points[0].map(
        (e) => Ts(
          e,
          n.points,
          n.edgeNodes || [],
          n.centroid_point,
          n.vertices_points,
          !1,
          n.version
        )
      )
    ),
    bakw: Nn(
      n.tins_points[t].map(
        (e) => Ts(
          e,
          n.points,
          n.edgeNodes || [],
          n.centroid_point,
          n.vertices_points,
          !0,
          n.version
        )
      )
    )
  };
}
function Ku(n) {
  if (n)
    return {
      bakw: Nn(
        n.map((t) => ke(t))
      )
    };
}
function Ju(n) {
  return JSON.parse(
    JSON.stringify(n).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"')
  );
}
function qu(n) {
  const t = [], e = n.forw.features;
  for (let i = 0; i < e.length; i++) {
    const r = e[i];
    ["a", "b", "c"].forEach((s, o) => {
      const A = r.geometry.coordinates[0][o], a = r.properties[s].geom, g = r.properties[s].index;
      typeof g == "number" && (t[g] = [A, a]);
    });
  }
  return t;
}
class ce {
  /**
   * 各種モードの定数定義
   * すべてreadonlyで、型安全性を確保
   */
  static VERTEX_PLAIN = "plain";
  static VERTEX_BIRDEYE = "birdeye";
  static MODE_STRICT = "strict";
  static MODE_AUTO = "auto";
  static MODE_LOOSE = "loose";
  static STATUS_STRICT = "strict";
  static STATUS_ERROR = "strict_error";
  static STATUS_LOOSE = "loose";
  static YAXIS_FOLLOW = "follow";
  static YAXIS_INVERT = "invert";
  points = [];
  /** @deprecated 2.00704 以降、Transform はこのプロパティを設定も参照もしない。サブクラス（MaplatTin）は、旧 @maplat/transform と組まれたときの互換のため {} を入れる */
  pointsWeightBuffer;
  strict_status;
  vertices_params;
  centroid;
  edgeNodes;
  edges;
  tins;
  kinks;
  yaxisMode = ce.YAXIS_INVERT;
  strictMode = ce.MODE_AUTO;
  vertexMode = ce.VERTEX_PLAIN;
  bounds;
  boundsPolygon;
  wh;
  xy;
  indexedTins;
  stateFull = !1;
  stateTriangle;
  stateBackward;
  /**
   * Optional properties for MaplatCore extension
   * These properties allow consuming applications to extend Transform instances
   * with additional metadata without requiring Module Augmentation
   */
  /** Layer priority for rendering order */
  priority;
  /** Layer importance for display decisions */
  importance;
  /** Bounds in XY (source) coordinate system */
  xyBounds;
  /** Bounds in Mercator (Web Mercator) coordinate system */
  mercBounds;
  constructor() {
  }
  /**
   * コンパイルされた設定を適用します
   *
   * @param compiled - コンパイルされた設定オブジェクト
   * @returns 変換に必要な主要なオブジェクトのセット
   *
   * 以下の処理を行います：
   * 1. バージョンに応じた設定の解釈
   * 2. 各種パラメータの復元
   * 3. TINネットワークの再構築
   * 4. インデックスの作成
   */
  setCompiled(t) {
    if (Xu(t)) {
      this.applyModernState(Zu(t));
      return;
    }
    this.applyLegacyState(Wu(t));
  }
  applyModernState(t) {
    this.points = t.points, this.strict_status = t.strictStatus, this.vertices_params = t.verticesParams, this.centroid = t.centroid, this.edges = t.edges, this.edgeNodes = t.edgeNodes || [], this.tins = t.tins, this.addIndexedTin(), this.kinks = t.kinks, this.yaxisMode = t.yaxisMode ?? ce.YAXIS_INVERT, this.vertexMode = t.vertexMode ?? ce.VERTEX_PLAIN, this.strictMode = t.strictMode ?? ce.MODE_AUTO, t.bounds ? (this.bounds = t.bounds, this.boundsPolygon = t.boundsPolygon, this.xy = t.xy, this.wh = t.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = t.xy ?? [0, 0], t.wh && (this.wh = t.wh));
  }
  applyLegacyState(t) {
    this.tins = t.tins, this.addIndexedTin(), this.strict_status = t.strictStatus, this.vertices_params = t.verticesParams, this.centroid = t.centroid, this.kinks = t.kinks, this.points = t.points;
  }
  /**
   * TINネットワークのインデックスを作成します
   *
   * インデックスは変換処理を高速化するために使用されます。
   * グリッド形式のインデックスを作成し、各グリッドに
   * 含まれる三角形を記録します。
   * セル数が MAX_INDEX_CELLS_PER_TRIANGLE で決まる上限を超えるデータは
   * 索引を作らず、変換時に全三角形を線形に探します。
   */
  addIndexedTin() {
    const t = this.tins, e = t.forw, i = t.bakw, r = Math.ceil(Math.sqrt(e.features.length));
    if (r < 3) {
      this.indexedTins = void 0;
      return;
    }
    let s = [], o = [];
    const A = e.features.map((l) => {
      let I = [];
      return oa(l)[0].map((C) => {
        s.length === 0 ? s = [Array.from(C), Array.from(C)] : (C[0] < s[0][0] && (s[0][0] = C[0]), C[0] > s[1][0] && (s[1][0] = C[0]), C[1] < s[0][1] && (s[0][1] = C[1]), C[1] > s[1][1] && (s[1][1] = C[1])), I.length === 0 ? I = [Array.from(C), Array.from(C)] : (C[0] < I[0][0] && (I[0][0] = C[0]), C[0] > I[1][0] && (I[1][0] = C[0]), C[1] < I[0][1] && (I[0][1] = C[1]), C[1] > I[1][1] && (I[1][1] = C[1]));
      }), I;
    }), a = i.features.map((l) => {
      let I = [];
      return oa(l)[0].map((C) => {
        o.length === 0 ? o = [Array.from(C), Array.from(C)] : (C[0] < o[0][0] && (o[0][0] = C[0]), C[0] > o[1][0] && (o[1][0] = C[0]), C[1] < o[0][1] && (o[0][1] = C[1]), C[1] > o[1][1] && (o[1][1] = C[1])), I.length === 0 ? I = [Array.from(C), Array.from(C)] : (C[0] < I[0][0] && (I[0][0] = C[0]), C[0] > I[1][0] && (I[1][0] = C[0]), C[1] < I[0][1] && (I[0][1] = C[1]), C[1] > I[1][1] && (I[1][1] = C[1]));
      }), I;
    });
    if (Math.max(
      ca(A, s, r),
      ca(a, o, r)
    ) > Nu * e.features.length) {
      this.indexedTins = void 0;
      return;
    }
    const g = (s[1][0] - s[0][0]) / r, c = (s[1][1] - s[0][1]) / r, u = A.reduce(
      (l, I, C) => {
        const d = ne(I[0][0], s[0][0], g, r), x = ne(I[1][0], s[0][0], g, r), w = ne(I[0][1], s[0][1], c, r), f = ne(I[1][1], s[0][1], c, r);
        for (let y = d; y <= x; y++) {
          l[y] || (l[y] = []);
          for (let v = w; v <= f; v++)
            l[y][v] || (l[y][v] = []), l[y][v].push(C);
        }
        return l;
      },
      []
    ), h = (o[1][0] - o[0][0]) / r, p = (o[1][1] - o[0][1]) / r, m = a.reduce(
      (l, I, C) => {
        const d = ne(I[0][0], o[0][0], h, r), x = ne(I[1][0], o[0][0], h, r), w = ne(I[0][1], o[0][1], p, r), f = ne(I[1][1], o[0][1], p, r);
        for (let y = d; y <= x; y++) {
          l[y] || (l[y] = []);
          for (let v = w; v <= f; v++)
            l[y][v] || (l[y][v] = []), l[y][v].push(C);
        }
        return l;
      },
      []
    );
    this.indexedTins = {
      forw: {
        gridNum: r,
        xOrigin: s[0][0],
        yOrigin: s[0][1],
        xUnit: g,
        yUnit: c,
        gridCache: u
      },
      bakw: {
        gridNum: r,
        xOrigin: o[0][0],
        yOrigin: o[0][1],
        xUnit: h,
        yUnit: p,
        gridCache: m
      }
    };
  }
  /**
   * 座標変換を実行します
   *
   * @param apoint - 変換する座標
   * @param backward - 逆方向の変換かどうか
   * @param ignoreBounds - 境界チェックを無視するかどうか
   * @returns 変換後の座標、または境界外の場合はfalse
   *
   * @throws {Error} 逆方向変換が許可されていない状態での逆変換時
   */
  transform(t, e, i) {
    if (!this.tins)
      throw new Error("setCompiled() must be called before transform()");
    if (e && this.strict_status == ce.STATUS_ERROR)
      throw new Error('Backward transform is not allowed if strict_status == "strict_error"');
    this.yaxisMode == ce.YAXIS_FOLLOW && e && (t = [t[0], -1 * t[1]]);
    const r = ke(t);
    if (this.bounds && !e && !i && !nn(r, this.boundsPolygon))
      return !1;
    const s = e ? this.tins.bakw : this.tins.forw, o = e ? this.indexedTins?.bakw : this.indexedTins?.forw, A = e ? this.vertices_params.bakw : this.vertices_params.forw, a = e ? this.centroid.bakw : this.centroid.forw;
    let g, c;
    this.stateFull && (this.stateBackward == e ? g = this.stateTriangle : (this.stateBackward = e, this.stateTriangle = void 0), c = (h) => {
      this.stateTriangle = h;
    });
    let u = Bu(
      r,
      s,
      o,
      A,
      a,
      void 0,
      g,
      c
    );
    if (this.bounds && e && !i) {
      const h = ke(u);
      if (!nn(h, this.boundsPolygon)) return !1;
    } else this.yaxisMode == ce.YAXIS_FOLLOW && !e && (u = [u[0], -1 * u[1]]);
    return u;
  }
}
const dt = 20037508342789244e-9, og = [
  [0, 0],
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
];
function oo(n, t) {
  return Math.floor(Math.min(n[0], n[1]) / 4) * dt / 128 / Math.pow(2, t);
}
function ag(n, t) {
  const e = [];
  for (let i = 0; i < n.length; i++) {
    const r = n[i], s = r[0] * Math.cos(t) - r[1] * Math.sin(t), o = r[0] * Math.sin(t) + r[1] * Math.cos(t);
    e.push([s, o]);
  }
  return e;
}
function _s(n, t, e, i) {
  const r = oo(i, t);
  return ag(og, e).map((s) => [
    s[0] * r + n[0],
    s[1] * r + n[1]
  ]);
}
function ks(n, t) {
  const e = n[0], i = n.slice(1, 5).map((h) => [
    h[0] - e[0],
    h[1] - e[1]
  ]), r = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
  ];
  let s = 0, o = 0, A = 0;
  for (let h = 0; h < 4; h++) {
    const p = i[h], m = r[h], l = Math.sqrt(Math.pow(p[0], 2) + Math.pow(p[1], 2));
    s += l;
    const I = p[0] * m[1] - p[1] * m[0], C = Math.acos(
      (p[0] * m[0] + p[1] * m[1]) / l
    ), d = I > 0 ? -1 * C : C;
    o += Math.cos(d), A += Math.sin(d);
  }
  const a = s / 4, g = Math.atan2(A, o), c = Math.floor(Math.min(t[0], t[1]) / 4), u = Math.log(c * dt / 128 / a) / Math.log(2);
  return { center: e, zoom: u, rotation: g };
}
function Ur(n, t) {
  const e = n[0] * (2 * dt) / t - dt, i = -1 * (n[1] * (2 * dt) / t - dt);
  return [e, i];
}
function Ia(n, t) {
  const e = (n[0] + dt) * t / (2 * dt), i = (-n[1] + dt) * t / (2 * dt);
  return [e, i];
}
const Xr = 256;
class Ag {
  mainTin = null;
  subTins = [];
  _maxxy = 0;
  // ─── 初期化 ────────────────────────────────────────────────────────────────
  /**
   * 地図データ（コンパイル済み TIN + sub_maps）をロードする
   *
   * @param mapData - メイン TIN と sub_maps の情報
   */
  setMapData(t) {
    const e = new ce();
    if (e.setCompiled(t.compiled), this.mainTin = e, t.maxZoom !== void 0)
      this._maxxy = Math.pow(2, t.maxZoom) * Xr;
    else if (t.compiled.wh) {
      const i = Math.max(t.compiled.wh[0], t.compiled.wh[1]), r = Math.ceil(Math.log2(i / Xr));
      this._maxxy = Math.pow(2, r) * Xr;
    }
    if (this.subTins = [], t.sub_maps)
      for (const i of t.sub_maps) {
        const r = new ce();
        r.setCompiled(i.compiled);
        const s = i.bounds ?? i.compiled.bounds;
        if (!s)
          throw new Error(
            "SubMapData must have bounds or compiled.bounds to create xyBounds polygon"
          );
        const o = [...s, s[0]], A = o.map((a) => {
          const g = r.transform(a, !1);
          if (!g) throw new Error("Failed to transform sub-map bounds to mercator");
          return g;
        });
        this.subTins.push({
          tin: r,
          priority: i.priority,
          importance: i.importance,
          xyBounds: Ss([o]),
          mercBounds: Ss([A])
        });
      }
  }
  // ─── 処理2: submap TIN 選択付き変換 ───────────────────────────────────────
  /**
   * ピクセル座標 → メルカトル座標（最適レイヤー選択）
   *
   * @param xy - ピクセル座標 [x, y]
   * @returns メルカトル座標、または範囲外の場合は false
   */
  xy2Merc(t) {
    const e = this.xy2MercWithLayer(t);
    return e ? e[1] : !1;
  }
  /**
   * メルカトル座標 → ピクセル座標（最適レイヤー選択）
   *
   * @param merc - メルカトル座標 [x, y]
   * @returns ピクセル座標、または範囲外の場合は false
   */
  merc2Xy(t) {
    const e = this.merc2XyWithLayer(t), i = e[0] || e[1];
    return i ? i[1] : !1;
  }
  /**
   * ピクセル座標 → メルカトル座標（レイヤーID付き）
   * histmap_tin.ts xy2MercAsync_returnLayer() の同期版
   *
   * @param xy - ピクセル座標 [x, y]
   * @returns [レイヤーインデックス, メルカトル座標] または false
   */
  xy2MercWithLayer(t) {
    this._assertMapData();
    const e = this._getTinsSortedByPriority();
    for (let i = 0; i < e.length; i++) {
      const { index: r, isMain: s } = e[i];
      if (s || nn(ke(t), this.subTins[r - 1].xyBounds)) {
        const o = this._transformByIndex(t, r, !1);
        if (o === !1) continue;
        return [r, o];
      }
    }
    return !1;
  }
  /**
   * メルカトル座標 → ピクセル座標（複数レイヤー結果）
   * histmap_tin.ts merc2XyAsync_returnLayer() の同期版
   *
   * 現在は MaplatCore の仕様に合わせ、最大2レイヤーまで返す。
   * 3レイヤー以上返したい場合は、下記の .slice(0, 2) および .filter(i < 2) の
   * 上限値を増やすか、引数で上限を指定できるようにすること。
   *
   * @param merc - メルカトル座標 [x, y]
   * @returns 最大2要素の配列。各要素は [レイヤーインデックス, ピクセル座標] または undefined
   */
  merc2XyWithLayer(t) {
    return this._assertMapData(), this._getAllTinsWithIndex().map(({ index: e, tin: i, isMain: r }) => {
      const s = this._transformByIndex(t, e, !0);
      return s === !1 ? [i, e] : r || nn(ke(s), this.subTins[e - 1].xyBounds) ? [i, e, s] : [i, e];
    }).sort((e, i) => {
      const r = e[0].priority ?? 0, s = i[0].priority ?? 0;
      return r < s ? 1 : -1;
    }).reduce(
      (e, i, r, s) => {
        const o = i[0], A = i[1], a = i[2];
        if (!a) return e;
        for (let g = 0; g < r; g++) {
          const c = s[g][1], u = c === 0;
          if (s[g][2] && (u || nn(ke(a), this.subTins[c - 1].xyBounds)))
            if (e.length) {
              const h = !e[0], p = h ? e[1][2] : e[0][2], m = o.importance ?? 0, l = p.importance ?? 0;
              return h ? m < l ? e : [void 0, [A, a, o]] : [...e.filter(
                (I) => I !== void 0
              ), [A, a, o]].sort(
                (I, C) => (I[2].importance ?? 0) < (C[2].importance ?? 0) ? 1 : -1
              ).slice(0, 2);
            } else
              return [[A, a, o]];
        }
        return !e.length || !e[0] ? [[A, a, o]] : (e.push([A, a, o]), e.sort((g, c) => {
          const u = g[2].importance ?? 0, h = c[2].importance ?? 0;
          return u < h ? 1 : -1;
        }).filter((g, c) => c < 2));
      },
      []
    ).map((e) => {
      if (e)
        return [e[0], e[1]];
    });
  }
  /**
   * メルカトル座標 → 覆われていない対応層の一覧（GPS / POI の表示候補用）
   *
   * `merc2XyWithLayer` は視点換算・一般座標変換用で、本図を常に候補に含める。
   * GPS マーカー・POI ピンをどの層に描くかの判定には本メソッドを使う（MaplatTransform#9）。
   *
   * 1. 各層の TIN で逆変換し、sub_map は自身の `xyBounds` 内に入るものだけを対応層とする。
   *    本図（層 0）は紙の内外を判定せず常に対応層の候補とする（紙外の除外は呼び出し側が行う）
   * 2. 対応層の座標が、より priority の高い sub_map の `xyBounds` 内なら覆われている。
   *    その高 priority 層自身が当該地点に対応するかは関係しない。
   *    本図は priority 0 の sub_map の `xyBounds` 内でも覆われている
   * 3. 同じ priority の sub_map どうしは互いを覆わない
   * 4. 覆われていない対応層を importance 降順 → priority 降順 → 層番号昇順で並べ、上限を切らずに全件返す
   * 5. 覆われていない対応層が無ければ空配列（表現範囲外）。`undefined`（旧 hide 表現）は返さない
   *
   * @param merc - メルカトル座標 [x, y]
   * @returns [レイヤーインデックス, ピクセル座標] の配列（0 件以上・上限なし）
   */
  merc2XyVisibleLayers(t) {
    this._assertMapData();
    const e = this._getAllTinsWithIndex(), i = (a) => a === 0 ? 0 : this.subTins[a - 1].priority ?? 0, r = (a) => a === 0 ? 0 : this.subTins[a - 1].importance ?? 0, s = (a, g) => a === 0 || nn(ke(g), this.subTins[a - 1].xyBounds), o = [];
    for (const { index: a } of e) {
      const g = this._transformByIndex(t, a, !0);
      g !== !1 && s(a, g) && o.push({ index: a, xy: g });
    }
    const A = (a) => e.some(
      ({ index: g }) => g !== 0 && g !== a.index && (i(g) > i(a.index) || a.index === 0 && i(g) === 0) && s(g, a.xy)
    );
    return o.filter((a) => !A(a)).sort((a, g) => r(g.index) - r(a.index) || i(g.index) - i(a.index) || a.index - g.index).map((a) => [a.index, a.xy]);
  }
  /**
   * メルカトル5点 → システム座標（複数レイヤー）
   * histmap_tin.ts mercs2SysCoordsAsync_multiLayer() の同期版
   *
   * @param mercs - 5点のメルカトル座標配列（中心＋上下左右）
   * @returns 各レイヤーのシステム座標配列（または undefined）
   */
  mercs2SysCoords(t) {
    this._assertMapData();
    const e = this.merc2XyWithLayer(t[0]);
    let i = !1;
    return e.map((r, s) => {
      if (!r) {
        i = !0;
        return;
      }
      const o = r[0], A = r[1];
      return s !== 0 && !i ? [this.xy2SysCoordInternal(A)] : t.map((a, g) => g === 0 ? A : this._transformByIndex(a, o, !0)).map((a) => this.xy2SysCoordInternal(a));
    });
  }
  // ─── 処理3: ビューポート変換 ───────────────────────────────────────────────
  /**
   * ビューポート → TIN 適用後メルカトル5点
   * histmap_tin.ts viewpoint2MercsAsync() の同期版
   *
   * @param viewpoint - ビューポート（center, zoom, rotation）
   * @param size - 画面サイズ [width, height]
   * @returns TIN 変換後のメルカトル5点
   */
  viewpoint2Mercs(t, e) {
    this._assertMapData(), this._assertMaxxy();
    const i = _s(t.center, t.zoom, t.rotation, e).map((A) => Ia(A, this._maxxy)), r = this.xy2MercWithLayer(i[0]);
    if (!r) throw new Error("viewpoint2Mercs: center point is out of bounds");
    const s = r[0], o = r[1];
    return i.map((A, a) => {
      if (a === 0) return o;
      const g = this._transformByIndex(A, s, !1);
      if (g === !1) throw new Error(`viewpoint2Mercs: point ${a} is out of bounds`);
      return g;
    });
  }
  /**
   * TIN 適用後メルカトル5点 → ビューポート
   * histmap_tin.ts mercs2ViewpointAsync() の同期版
   *
   * @param mercs - TIN 変換後のメルカトル5点
   * @param size - 画面サイズ [width, height]
   * @returns ビューポート（center, zoom, rotation）
   */
  mercs2Viewpoint(t, e) {
    this._assertMapData(), this._assertMaxxy();
    const i = this.merc2XyWithLayer(t[0]), r = i[0] || i[1];
    if (!r) throw new Error("mercs2Viewpoint: center point is out of bounds");
    const s = r[0], o = r[1], A = t.map((a, g) => {
      if (g === 0) return o;
      const c = this._transformByIndex(a, s, !0);
      if (c === !1) throw new Error(`mercs2Viewpoint: point ${g} is out of bounds`);
      return c;
    }).map((a) => Ur(a, this._maxxy));
    return ks(A, e);
  }
  // ─── ユーティリティ（静的メソッド）────────────────────────────────────────
  /** zoom2Radius の静的ラッパー */
  static zoom2Radius(t, e) {
    return oo(t, e);
  }
  /** mercViewpoint2Mercs の静的ラッパー */
  static mercViewpoint2Mercs(t, e, i, r) {
    return _s(t, e, i, r);
  }
  /** mercs2MercViewpoint の静的ラッパー */
  static mercs2MercViewpoint(t, e) {
    return ks(t, e);
  }
  /** xy2SysCoord の静的ラッパー */
  static xy2SysCoord(t, e) {
    return Ur(t, e);
  }
  /** sysCoord2Xy の静的ラッパー */
  static sysCoord2Xy(t, e) {
    return Ia(t, e);
  }
  // ─── 内部ヘルパー ──────────────────────────────────────────────────────────
  _assertMapData() {
    if (!this.mainTin)
      throw new Error("setMapData() must be called before transformation");
  }
  _assertMaxxy() {
    if (this._maxxy === 0)
      throw new Error(
        "MapData.maxZoom or compiled.wh must be set for viewpoint conversion (xy2SysCoord / sysCoord2Xy)"
      );
  }
  /**
   * レイヤーインデックスに対応する Transform インスタンスを返す（三角網描画などの用途）
   *
   * @param idx - 0 = メイン TIN、1以上 = sub_maps[idx-1]
   * @returns 対応する Transform、または範囲外の場合は null
   */
  getLayerTransform(t) {
    if (t === 0) return this.mainTin;
    const e = this.subTins[t - 1];
    return e ? e.tin : null;
  }
  /** レイヤー数を返す（メイン + sub 数） */
  get layerCount() {
    return 1 + this.subTins.length;
  }
  /**
   * viewpoint 変換に使用する最大ピクセル幅（2^maxZoom × 256）
   * stateToViewpoint / viewpointToState で zoom ↔ scale 変換に使用する
   * zoom = log2(scale × maxxy / 256) の関係
   */
  get maxxy() {
    return this._maxxy;
  }
  /** priority 降順でソートした [index, tin, isMain] の配列を返す */
  _getTinsSortedByPriority() {
    return this._getAllTinsWithIndex().sort((t, e) => {
      const i = t.tin.priority ?? 0, r = e.tin.priority ?? 0;
      return i < r ? 1 : -1;
    });
  }
  /** メイン TIN + 全 sub TIN を index 付きで返す */
  _getAllTinsWithIndex() {
    const t = [
      { index: 0, tin: this.mainTin, isMain: !0 }
    ];
    return this.subTins.forEach((e, i) => {
      e.tin.priority = e.priority, e.tin.importance = e.importance, t.push({ index: i + 1, tin: e.tin, isMain: !1 });
    }), t;
  }
  /**
   * 指定レイヤーインデックスで TIN 変換を実行する
   * index 0 → mainTin, index 1..n → subTins[index-1]
   */
  _transformByIndex(t, e, i) {
    if (e === 0)
      return this.mainTin.transform(t, i);
    const r = this.subTins[e - 1];
    return r ? r.tin.transform(t, i, !0) : !1;
  }
  /** 内部用 xy2SysCoord（_maxxy を使用） */
  xy2SysCoordInternal(t) {
    return Ur(t, this._maxxy);
  }
}
/*!
 * IIIF info parsing and tile URLs adapted from OpenLayers 10.11.0
 * ol/format/IIIFInfo.js and ol/source/IIIF.js.
 *
 * BSD 2-Clause License
 *
 * Copyright 2005-present, OpenLayers Contributors
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
const Dt = 256, $u = {
  2: [
    [],
    ["regionByPx", "sizeByW", "sizeByH", "sizeByPct"],
    [
      "regionByPx",
      "regionByPct",
      "sizeByW",
      "sizeByH",
      "sizeByPct",
      "sizeByConfinedWh",
      "sizeByDistortedWh",
      "sizeByWh"
    ]
  ],
  3: [
    [],
    ["regionByPx", "regionSquare", "sizeByW", "sizeByH", "sizeByWh"],
    [
      "regionByPx",
      "regionSquare",
      "regionByPct",
      "sizeByW",
      "sizeByH",
      "sizeByPct",
      "sizeByConfinedWh",
      "sizeByWh"
    ]
  ]
}, tI = /^https?:\/\/iiif\.io\/api\/image\/2\/level[0-2](?:\.json)?$/, eI = /(^https?:\/\/iiif\.io\/api\/image\/3\/level[0-2](?:\.json)?$)|(^level[0-2]$)/;
function gg(n) {
  const t = cg(n);
  if (!t) return { ok: !1, reason: "not-json" };
  try {
    let e = t["@context"] || "ol-no-context";
    typeof e == "string" && (e = [e]);
    let i;
    for (let l = 0; l < e.length; l++) {
      const I = e[l];
      if (I === "http://library.stanford.edu/iiif/image-api/1.1/context.json" || I === "http://iiif.io/api/image/1/context.json")
        return { ok: !1, reason: "unsupported-version" };
      if (I === "http://iiif.io/api/image/2/context.json" && (i = "2"), I === "http://iiif.io/api/image/3/context.json" && (i = "3"), i) break;
    }
    if (!i) return { ok: !1, reason: "unsupported-version" };
    let r = t.profile;
    i === "2" && Array.isArray(r) && (r = r[0]);
    const o = (i === "2" ? typeof r == "string" && tI.test(r) : eI.test(r)) ? r.match(/level[0-2](?:\.json)?$/g) : void 0, A = o ? Number(o[0].replace(".json", "").slice(-1)) : 0, a = i === "2" && Array.isArray(t.profile) && t.profile.length > 1 ? t.profile[1] : {}, g = [
      ...o ? $u[i][A] : [],
      ...i === "2" ? a.supports || [] : t.extraFeatures === void 0 ? [] : t.extraFeatures
    ], c = [
      ...o ? A === 2 ? ["jpg", "png"] : ["jpg"] : [],
      ...i === "2" ? a.formats || [] : t.extraFormats === void 0 ? [] : t.extraFormats
    ], u = [
      ...o ? i === "2" && A === 2 ? ["default", "bitonal"] : ["default"] : [],
      ...i === "2" ? a.qualities || [] : t.extraQualities === void 0 ? [] : t.extraQualities
    ], h = i === "3" && Array.isArray(t.preferredFormats) ? t.preferredFormats.find(
      (l) => ["jpg", "png", "gif"].includes(l) && c.includes(l)
    ) : void 0, p = t.tiles === void 0 ? void 0 : [
      t.tiles.map((l) => l.width)[0],
      t.tiles.map(
        (l) => i === "2" && l.height === void 0 ? l.width : l.height
      )[0]
    ], m = t.tiles === void 0 ? void 0 : t.tiles.map((l) => l.scaleFactors)[0];
    return {
      ok: !0,
      service: {
        version: i,
        level: A,
        width: t.width,
        height: t.height,
        id: i === "2" ? t["@id"].replace(/\/?(?:info\.json)?$/g, "") : t.id,
        supports: g,
        format: h === void 0 ? "jpg" : h,
        quality: u.includes("native") ? "native" : "default",
        tileSize: p,
        // OL は元の配列を sort するが、純粋な解釈関数では入力を変更しない。
        scaleFactors: Array.isArray(m) ? [...m].sort((l, I) => I - l) : void 0,
        sizes: t.sizes === void 0 ? void 0 : t.sizes.map((l) => [l.width, l.height])
      }
    };
  } catch {
    return { ok: !1, reason: "unsupported-version" };
  }
}
function ao(n) {
  return (n.includes("regionByPx") || n.includes("regionByPct")) && (n.includes("sizeByWh") || n.includes("sizeByH") || n.includes("sizeByW") || n.includes("sizeByPct"));
}
function nI(n) {
  if (ao(n.supports)) return;
  const t = lg(n.tileSize);
  if (t.width !== Dt || t.height !== Dt || !ug(n.scaleFactors))
    return;
  const e = Math.ceil(
    Math.max(
      Math.log2(n.width / Dt),
      Math.log2(n.height / Dt)
    )
  );
  return Math.max(0, e - Math.log2(Math.max(...n.scaleFactors)));
}
function Qn(n) {
  return n.toLocaleString("en", { maximumFractionDigits: 10 });
}
function iI(n, t, e, i, r) {
  const { width: s, height: o, supports: A, version: a } = t, g = Math.max(
    Math.ceil(Math.log(s / Dt) / Math.LN2),
    Math.ceil(Math.log(o / Dt) / Math.LN2)
  );
  if (e > g || e < 0 || !Number.isInteger(e)) return;
  const c = 2 ** (g - e);
  if (i === void 0 || r === void 0 || i < 0 || Math.ceil(s / c / Dt) <= i || r < 0 || Math.ceil(o / c / Dt) <= r)
    return;
  const u = ao(A), h = i * Dt * c, p = r * Dt * c, m = Math.min(Dt * c, s - h), l = Math.min(Dt * c, o - p), I = h + Dt * c > s ? Math.floor((s - h + c - 1) / c) : Dt, C = p + Dt * c > o ? Math.floor((o - p + c - 1) / c) : Dt;
  let d, x;
  return h === 0 && m === s && p === 0 && l === o ? d = "full" : !u || A.includes("regionByPx") ? d = `${h},${p},${m},${l}` : A.includes("regionByPct") && (d = `pct:${Qn(h / s * 100)},${Qn(p / o * 100)},${Qn(m / s * 100)},${Qn(l / o * 100)}`), a === "3" && (!u || A.includes("sizeByWh")) ? x = `${I},${C}` : !u || A.includes("sizeByW") ? x = `${I},` : A.includes("sizeByH") ? x = `,${C}` : A.includes("sizeByWh") ? x = `${I},${C}` : A.includes("sizeByPct") && (x = `pct:${Qn(100 / c)}`), `${n + (n.lastIndexOf("/") === n.length - 1 || n === "" ? "" : "/")}${d}/${x}/0/${t.quality || "default"}.${t.format || "jpg"}`;
}
class ie extends Error {
  reason;
  mapID;
  constructor(t, e, i) {
    super(e || t), this.name = "IiifDeliveryError", this.reason = t, this.mapID = i;
  }
}
function Yn(n) {
  return `${n.replace(/\/+$/, "")}/info.json`;
}
function cg(n) {
  if (typeof n == "string")
    try {
      return JSON.parse(n);
    } catch {
      return;
    }
  if (n && typeof n == "object") return n;
}
function lg(n) {
  if (n == null) return {};
  if (typeof n == "number")
    return { width: n, height: n };
  if (Array.isArray(n)) {
    const t = n[0], e = n[1] === void 0 ? n[0] : n[1];
    return { width: t, height: e };
  }
  return {};
}
function Bi(n) {
  return Number.isInteger(n) && n > 0;
}
function ug(n) {
  return !Array.isArray(n) || n.length === 0 ? !1 : [...n].sort((e, i) => e - i).every((e, i) => e === 2 ** i);
}
function rI(n, t) {
  const e = cg(n);
  if (!e) return { ok: !1, reason: "not-json" };
  if (!Bi(e.width) || !Bi(e.height))
    return { ok: !1, reason: "size-mismatch" };
  if (t && (!Bi(t.width) || !Bi(t.height) || e.width !== t.width || e.height !== t.height))
    return { ok: !1, reason: "size-mismatch" };
  const i = gg(e);
  if (!i.ok) return i;
  const { service: r } = i, { level: s, version: o, supports: A } = r;
  if (ao(A))
    return { ok: !0, version: o, level: s, tiling: "arbitrary" };
  const { width: g, height: c } = lg(r.tileSize);
  return g === 256 && c === 256 && ug(r.scaleFactors) ? { ok: !0, version: o, level: s, tiling: "level0-256" } : { ok: !1, reason: "unsupported-level0" };
}
const sI = 1e4, oI = 1024 * 1024;
function aI(n) {
  return typeof TextEncoder > "u" ? n.length : new TextEncoder().encode(n).length;
}
function AI(n) {
  let t;
  try {
    t = new URL(n);
  } catch {
    throw new ie(
      "bad-url",
      `IIIF image URL is not a URL: ${n}`
    );
  }
  if (t.protocol !== "http:" && t.protocol !== "https:")
    throw new ie(
      "bad-url",
      `IIIF image URL must be http or https: ${n}`
    );
}
async function gI(n, t) {
  const e = n.headers?.get?.("content-length");
  if (e != null) {
    const s = Number(e);
    if (!Number.isNaN(s) && s > t)
      throw new ie(
        "too-large",
        `IIIF info.json is larger than ${t} bytes`
      );
  }
  const i = n.body;
  if (i && typeof i.getReader == "function") {
    const s = i.getReader(), o = typeof TextDecoder > "u" ? void 0 : new TextDecoder();
    let A = 0, a = "";
    for (; ; ) {
      const { done: g, value: c } = await s.read();
      if (g) break;
      if (A += c.byteLength, A > t) {
        try {
          await s.cancel();
        } catch {
        }
        throw new ie(
          "too-large",
          `IIIF info.json is larger than ${t} bytes`
        );
      }
      a += o ? o.decode(c, { stream: !0 }) : String.fromCharCode.apply(null, Array.from(c));
    }
    return o && (a += o.decode()), a;
  }
  const r = await n.text();
  if (aI(r) > t)
    throw new ie(
      "too-large",
      `IIIF info.json is larger than ${t} bytes`
    );
  return r;
}
function ha(n) {
  try {
    const t = new URL(n);
    return `${t.protocol}//${t.host}${t.pathname.replace(/\/+$/, "")}`;
  } catch {
    return n.replace(/\/+$/, "");
  }
}
async function cI(n, t, e) {
  if (!n || n.type !== "iiifImage" || typeof n.url != "string")
    throw new ie(
      "bad-url",
      "IIIF delivery must have { type: 'iiifImage', url }"
    );
  const i = n.url.replace(/\/+$/, "");
  AI(i);
  const r = fetch, s = new AbortController();
  let o = !1;
  const A = setTimeout(() => {
    o = !0, s.abort();
  }, sI);
  let a;
  try {
    let C;
    try {
      if (C = await r(Yn(i), {
        credentials: "omit",
        signal: s.signal
      }), !C || !C.ok)
        throw new ie(
          "fetch-failed",
          `Failed to fetch IIIF info.json: ${Yn(i)}`
        );
      a = await gI(C, oI);
    } catch (d) {
      throw d instanceof ie ? d : o ? new ie(
        "timeout",
        `Timed out fetching IIIF info.json: ${Yn(i)}`
      ) : new ie(
        "fetch-failed",
        `Failed to fetch IIIF info.json: ${Yn(i)}`
      );
    }
  } finally {
    clearTimeout(A);
  }
  let g;
  try {
    g = JSON.parse(a);
  } catch {
    throw new ie(
      "not-json",
      `IIIF info.json is not JSON: ${Yn(i)}`
    );
  }
  const c = rI(g, t);
  if (!c.ok) throw new ie(c.reason);
  const u = [], h = g["@id"] || g.id;
  typeof h == "string" && ha(h) !== ha(i) && u.push(
    `Maplat: the IIIF image service "${h}" differs from the delivery URL "${i}"; using the delivery URL.`
  );
  const p = gg(g);
  if (!p.ok) throw new ie(p.reason);
  const m = p.service, l = nI(m);
  return {
    tileUrl: (C, d, x) => iI(i, m, C, d, x),
    service: m,
    url: i,
    width: g.width,
    height: g.height,
    info: g,
    warnings: u,
    ...l !== void 0 ? { minZoom: l } : {}
  };
}
function Ca(n) {
  const t = n && n.delivery;
  return t ? t.type === "iiifImage" ? !0 : (console.warn(
    `Maplat: map "${n.mapID}" has delivery type "${t.type}"; ignoring delivery.`
  ), !1) : !1;
}
async function lI(n, t, e) {
  const i = await cI(n.delivery, t);
  (n.url || n.urls) && (console.warn(
    `Maplat: map "${n.mapID}" has both delivery and url; using delivery.`
  ), delete n.url, delete n.urls);
  for (const r of i.warnings) console.warn(r);
  return i.minZoom !== void 0 && (n.minZoom = i.minZoom), i;
}
function uI(n) {
  return n?.delivery?.type === "iiifImage";
}
const Ao = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAB3RJTUUH3QgIBToaSbAjlwAAABd0RVh0U29mdHdhcmUAR0xEUE5HIHZlciAzLjRxhaThAAAACHRwTkdHTEQzAAAAAEqAKR8AAAAEZ0FNQQAAsY8L/GEFAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAFRJREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgBDwABHHIJwwAAAABJRU5ErkJggg==", Je = Dt, II = `<canvas width="${Je}" height="${Je}" src="${Ao}"></canvas>`;
async function Kn(n) {
  if (typeof n == "string") {
    const t = n.match(/\//) ? n : `pois/${n}`, e = await fetch(t);
    if (!e.ok)
      throw new Error("Fail to load poi json");
    return await e.json();
  } else
    return n;
}
const Ig = ["hide", "title", "icon", "selectedIcon"], hI = [
  "lnglat",
  "lng",
  "lat",
  "longitude",
  "latitude"
];
function or(n) {
  return typeof n == "object" && n !== null && !Array.isArray(n);
}
function Rs(n) {
  if (!or(n) || n.type === "FeatureCollection") return !1;
  const t = n.layer, e = typeof t == "string", i = or(t) && t.type === "FeatureCollection";
  return !(!e && !i || hI.some((r) => n[r] !== void 0));
}
function CI(n) {
  return Rs(n) && Ig.some((t) => n[t] !== void 0);
}
function fa(n) {
  const t = {};
  for (const [e, i] of Object.entries(n))
    if (e !== "layer") {
      if (Ig.includes(e)) {
        t[e] = i;
        continue;
      }
      console.warn(`[Maplat] pois layer ref: unknown override key ignored: ${e}`);
    }
  return t;
}
function da(n, t) {
  if (!t) return n;
  t.hide === !0 && (n.hide = !0);
  const e = t.title;
  (typeof e == "string" ? e !== "" : or(e) && Object.keys(e).length > 0) && (n.name = e);
  for (const i of ["icon", "selectedIcon"]) {
    const r = t[i];
    typeof r == "string" && r !== "" && (n[i] = r);
  }
  return n;
}
async function hg(n, t) {
  if (n = await Kn(n), Array.isArray(n)) {
    const e = n[0];
    if (n.length > 0 && (typeof e == "string" || or(e) && e.type === "FeatureCollection" || Rs(e))) {
      const r = await Promise.all(
        n.map(async (s, o) => {
          let A, a;
          Rs(s) ? (A = await Kn(s.layer), a = fa(s)) : (A = await Kn(s), a = null);
          let g = A.id || A.properties && A.properties.id;
          if (!g)
            if (o === 0) g = "main";
            else throw "POI layers include bad key setting";
          const c = Ue(A, g, t);
          return [g, da(c, a)];
        })
      );
      n = Object.fromEntries(r);
    } else
      n = await Promise.all(n.map(async (r) => await Kn(r))), n = {
        main: Ue(n, "main", t)
      };
  } else if (n.type === "FeatureCollection") {
    const e = n.id || n.properties && n.properties.id || "main";
    n = { [e]: Ue(n, e, t) };
  } else if (CI(n)) {
    const e = await Kn(n.layer), i = e.id || e.properties && e.properties.id || "main", r = Ue(e, i, t);
    n = { [i]: da(r, fa(n)) };
  } else
    Object.keys(n).map((e) => {
      n[e] = Ue(n[e], e, t);
    });
  return n.main || (n.main = Ue([], "main", t)), Object.keys(n).map((e) => {
    go(n, e, t);
  }), n;
}
function Ue(n, t, e) {
  if (Array.isArray(n))
    n = {
      pois: n.map((i) => hi(i))
    };
  else if (n.type === "FeatureCollection") {
    const i = Object.assign({}, n.properties || {});
    n.name && (i.name = n.name), i.pois = n.features.map((r) => hi(r)), n = i;
  }
  if (typeof n.id > "u")
    n.id = t;
  else if (n.id !== t) throw "POI layers include bad key setting";
  return n.namespaceID || (n.namespaceID = `${e.namespace ? `${e.namespace}#` : ""}${t}`), n.name || (n.name = t === "main" ? e.name : t), n.pois || (n.pois = []), n;
}
function hi(n) {
  if (n.type === "Feature") {
    const t = Object.assign({}, n.properties || {});
    t.lnglat = n.geometry.coordinates, t.id || (t.id = n.id), t.name || (t.name = n.name), n = t;
  }
  return n.lnglat || (n.lnglat = [n.lng || n.longitude, n.lat || n.latitude]), delete n.lng, delete n.lat, delete n.longitude, delete n.latitude, n;
}
function go(n, t, e) {
  if (!n[t]) return;
  const i = n[t], r = i.pois;
  i.__nextId || (i.__nextId = 0), r.map((s) => {
    s.id || (s.id = `${t}_${i.__nextId}`, i.__nextId++), s.namespaceID || (s.namespaceID = `${e.namespace ? `${e.namespace}#` : ""}${s.id}`);
  });
}
function Et(n, t) {
  if (!(n === null || typeof n != "object") && typeof t == "string")
    return Object.hasOwn(n, t) ? n[t] : void 0;
}
function Ci(n, t, e = {}) {
  const i = { type: "Feature" };
  return (e.id === 0 || e.id) && (i.id = e.id), e.bbox && (i.bbox = e.bbox), i.properties = t || {}, i.geometry = n, i;
}
function Cg(n, t, e = {}) {
  if (!n)
    throw new Error("coordinates is required");
  if (!Array.isArray(n))
    throw new Error("coordinates must be an Array");
  if (n.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!ma(n[0]) || !ma(n[1]))
    throw new Error("coordinates must contain numbers");
  return Ci({
    type: "Point",
    coordinates: n
  }, t, e);
}
function fg(n, t, e = {}) {
  for (const r of n) {
    if (r.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (r[r.length - 1].length !== r[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let s = 0; s < r[r.length - 1].length; s++)
      if (r[r.length - 1][s] !== r[0][s])
        throw new Error("First and last Position are not equivalent.");
  }
  return Ci({
    type: "Polygon",
    coordinates: n
  }, t, e);
}
function fI(n, t, e = {}) {
  if (n.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return Ci({
    type: "LineString",
    coordinates: n
  }, t, e);
}
function pa(n, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = n, e;
}
function ma(n) {
  return !isNaN(n) && n !== null && !Array.isArray(n);
}
function dI(n) {
  if (!n)
    throw new Error("coord is required");
  if (!Array.isArray(n)) {
    if (n.type === "Feature" && n.geometry !== null && n.geometry.type === "Point")
      return [...n.geometry.coordinates];
    if (n.type === "Point")
      return [...n.coordinates];
  }
  if (Array.isArray(n) && n.length >= 2 && !Array.isArray(n[0]) && !Array.isArray(n[1]))
    return [...n];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function pI(n) {
  return n.type === "Feature" ? n.geometry : n;
}
function dg(n, t, e) {
  if (n !== null)
    for (var i, r, s, o, A, a, g, c = 0, u = 0, h, p = n.type, m = p === "FeatureCollection", l = p === "Feature", I = m ? n.features.length : 1, C = 0; C < I; C++) {
      g = m ? (
        // @ts-expect-error: Known type conflict
        n.features[C].geometry
      ) : l ? (
        // @ts-expect-error: Known type conflict
        n.geometry
      ) : n, h = g ? g.type === "GeometryCollection" : !1, A = h ? g.geometries.length : 1;
      for (var d = 0; d < A; d++) {
        var x = 0, w = 0;
        if (o = h ? g.geometries[d] : g, o !== null) {
          a = o.coordinates;
          var f = o.type;
          switch (c = f === "Polygon" || f === "MultiPolygon" ? 1 : 0, f) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  a,
                  u,
                  C,
                  x,
                  w
                ) === !1
              )
                return !1;
              u++, x++;
              break;
            case "LineString":
            case "MultiPoint":
              for (i = 0; i < a.length; i++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    a[i],
                    u,
                    C,
                    x,
                    w
                  ) === !1
                )
                  return !1;
                u++, f === "MultiPoint" && x++;
              }
              f === "LineString" && x++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (i = 0; i < a.length; i++) {
                for (r = 0; r < a[i].length - c; r++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      a[i][r],
                      u,
                      C,
                      x,
                      w
                    ) === !1
                  )
                    return !1;
                  u++;
                }
                f === "MultiLineString" && x++, f === "Polygon" && w++;
              }
              f === "Polygon" && x++;
              break;
            case "MultiPolygon":
              for (i = 0; i < a.length; i++) {
                for (w = 0, r = 0; r < a[i].length; r++) {
                  for (s = 0; s < a[i][r].length - c; s++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        a[i][r][s],
                        u,
                        C,
                        x,
                        w
                      ) === !1
                    )
                      return !1;
                    u++;
                  }
                  w++;
                }
                x++;
              }
              break;
            case "GeometryCollection":
              for (i = 0; i < o.geometries.length; i++)
                if (
                  // @ts-expect-error: Known type conflict
                  dg(o.geometries[i], t) === !1
                )
                  return !1;
              break;
            default:
              throw new Error("Unknown Geometry Type");
          }
        }
      }
    }
}
const Pe = 11102230246251565e-32, Ut = 134217729, mI = (3 + 8 * Pe) * Pe;
function Zr(n, t, e, i, r) {
  let s, o, A, a, g = t[0], c = i[0], u = 0, h = 0;
  c > g == c > -g ? (s = g, g = t[++u]) : (s = c, c = i[++h]);
  let p = 0;
  if (u < n && h < e)
    for (c > g == c > -g ? (o = g + s, A = s - (o - g), g = t[++u]) : (o = c + s, A = s - (o - c), c = i[++h]), s = o, A !== 0 && (r[p++] = A); u < n && h < e; )
      c > g == c > -g ? (o = s + g, a = o - s, A = s - (o - a) + (g - a), g = t[++u]) : (o = s + c, a = o - s, A = s - (o - a) + (c - a), c = i[++h]), s = o, A !== 0 && (r[p++] = A);
  for (; u < n; )
    o = s + g, a = o - s, A = s - (o - a) + (g - a), g = t[++u], s = o, A !== 0 && (r[p++] = A);
  for (; h < e; )
    o = s + c, a = o - s, A = s - (o - a) + (c - a), c = i[++h], s = o, A !== 0 && (r[p++] = A);
  return (s !== 0 || p === 0) && (r[p++] = s), p;
}
function yI(n, t) {
  let e = t[0];
  for (let i = 1; i < n; i++) e += t[i];
  return e;
}
function vi(n) {
  return new Float64Array(n);
}
const vI = (3 + 16 * Pe) * Pe, wI = (2 + 12 * Pe) * Pe, bI = (9 + 64 * Pe) * Pe * Pe, dn = vi(4), ya = vi(8), va = vi(12), wa = vi(16), Yt = vi(4);
function EI(n, t, e, i, r, s, o) {
  let A, a, g, c, u, h, p, m, l, I, C, d, x, w, f, y, v, M;
  const S = n - r, E = e - r, T = t - s, _ = i - s;
  w = S * _, h = Ut * S, p = h - (h - S), m = S - p, h = Ut * _, l = h - (h - _), I = _ - l, f = m * I - (w - p * l - m * l - p * I), y = T * E, h = Ut * T, p = h - (h - T), m = T - p, h = Ut * E, l = h - (h - E), I = E - l, v = m * I - (y - p * l - m * l - p * I), C = f - v, u = f - C, dn[0] = f - (C + u) + (u - v), d = w + C, u = d - w, x = w - (d - u) + (C - u), C = x - y, u = x - C, dn[1] = x - (C + u) + (u - y), M = d + C, u = M - d, dn[2] = d - (M - u) + (C - u), dn[3] = M;
  let L = yI(4, dn), D = wI * o;
  if (L >= D || -L >= D || (u = n - S, A = n - (S + u) + (u - r), u = e - E, g = e - (E + u) + (u - r), u = t - T, a = t - (T + u) + (u - s), u = i - _, c = i - (_ + u) + (u - s), A === 0 && a === 0 && g === 0 && c === 0) || (D = bI * o + mI * Math.abs(L), L += S * c + _ * A - (T * g + E * a), L >= D || -L >= D)) return L;
  w = A * _, h = Ut * A, p = h - (h - A), m = A - p, h = Ut * _, l = h - (h - _), I = _ - l, f = m * I - (w - p * l - m * l - p * I), y = a * E, h = Ut * a, p = h - (h - a), m = a - p, h = Ut * E, l = h - (h - E), I = E - l, v = m * I - (y - p * l - m * l - p * I), C = f - v, u = f - C, Yt[0] = f - (C + u) + (u - v), d = w + C, u = d - w, x = w - (d - u) + (C - u), C = x - y, u = x - C, Yt[1] = x - (C + u) + (u - y), M = d + C, u = M - d, Yt[2] = d - (M - u) + (C - u), Yt[3] = M;
  const F = Zr(4, dn, 4, Yt, ya);
  w = S * c, h = Ut * S, p = h - (h - S), m = S - p, h = Ut * c, l = h - (h - c), I = c - l, f = m * I - (w - p * l - m * l - p * I), y = T * g, h = Ut * T, p = h - (h - T), m = T - p, h = Ut * g, l = h - (h - g), I = g - l, v = m * I - (y - p * l - m * l - p * I), C = f - v, u = f - C, Yt[0] = f - (C + u) + (u - v), d = w + C, u = d - w, x = w - (d - u) + (C - u), C = x - y, u = x - C, Yt[1] = x - (C + u) + (u - y), M = d + C, u = M - d, Yt[2] = d - (M - u) + (C - u), Yt[3] = M;
  const z = Zr(F, ya, 4, Yt, va);
  w = A * c, h = Ut * A, p = h - (h - A), m = A - p, h = Ut * c, l = h - (h - c), I = c - l, f = m * I - (w - p * l - m * l - p * I), y = a * g, h = Ut * a, p = h - (h - a), m = a - p, h = Ut * g, l = h - (h - g), I = g - l, v = m * I - (y - p * l - m * l - p * I), C = f - v, u = f - C, Yt[0] = f - (C + u) + (u - v), d = w + C, u = d - w, x = w - (d - u) + (C - u), C = x - y, u = x - C, Yt[1] = x - (C + u) + (u - y), M = d + C, u = M - d, Yt[2] = d - (M - u) + (C - u), Yt[3] = M;
  const k = Zr(z, va, 4, Yt, wa);
  return wa[k - 1];
}
function xI(n, t, e, i, r, s) {
  const o = (t - s) * (e - r), A = (n - r) * (i - s), a = o - A, g = Math.abs(o + A);
  return Math.abs(a) >= vI * g ? a : -EI(n, t, e, i, r, s, g);
}
function MI(n, t) {
  var e, i, r = 0, s, o, A, a, g, c, u, h = n[0], p = n[1], m = t.length;
  for (e = 0; e < m; e++) {
    i = 0;
    var l = t[e], I = l.length - 1;
    if (c = l[0], c[0] !== l[I][0] && c[1] !== l[I][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (o = c[0] - h, A = c[1] - p, i; i < I; i++) {
      if (u = l[i + 1], a = u[0] - h, g = u[1] - p, A === 0 && g === 0) {
        if (a <= 0 && o >= 0 || o <= 0 && a >= 0)
          return 0;
      } else if (g >= 0 && A <= 0 || g <= 0 && A >= 0) {
        if (s = xI(o, a, A, g, 0, 0), s === 0)
          return 0;
        (s > 0 && g > 0 && A <= 0 || s < 0 && g <= 0 && A > 0) && r++;
      }
      c = u, A = g, o = a;
    }
  }
  return r % 2 !== 0;
}
function SI(n, t, e = {}) {
  if (!n)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = dI(n), r = pI(t), s = r.type, o = t.bbox;
  let A = r.coordinates;
  if (o && TI(i, o) === !1)
    return !1;
  s === "Polygon" && (A = [A]);
  for (var a = 0; a < A.length; ++a) {
    const g = MI(i, A[a]);
    if (g === 0 && !e.ignoreBoundary) return !0;
    if (g) return !0;
  }
  return !1;
}
function TI(n, t) {
  return t[0] <= n[0] && t[1] <= n[1] && t[2] >= n[0] && t[3] >= n[1];
}
class pg {
  constructor(t = [], e = _I) {
    if (this.data = t, this.length = this.data.length, this.compare = e, this.length > 0)
      for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
  }
  push(t) {
    this.data.push(t), this.length++, this._up(this.length - 1);
  }
  pop() {
    if (this.length === 0) return;
    const t = this.data[0], e = this.data.pop();
    return this.length--, this.length > 0 && (this.data[0] = e, this._down(0)), t;
  }
  peek() {
    return this.data[0];
  }
  _up(t) {
    const { data: e, compare: i } = this, r = e[t];
    for (; t > 0; ) {
      const s = t - 1 >> 1, o = e[s];
      if (i(r, o) >= 0) break;
      e[t] = o, t = s;
    }
    e[t] = r;
  }
  _down(t) {
    const { data: e, compare: i } = this, r = this.length >> 1, s = e[t];
    for (; t < r; ) {
      let o = (t << 1) + 1, A = e[o];
      const a = o + 1;
      if (a < this.length && i(e[a], A) < 0 && (o = a, A = e[a]), i(A, s) >= 0) break;
      e[t] = A, t = o;
    }
    e[t] = s;
  }
}
function _I(n, t) {
  return n < t ? -1 : n > t ? 1 : 0;
}
const Oe = 11102230246251565e-32, Xt = 134217729, kI = (3 + 8 * Oe) * Oe;
function Wr(n, t, e, i, r) {
  let s, o, A, a, g = t[0], c = i[0], u = 0, h = 0;
  c > g == c > -g ? (s = g, g = t[++u]) : (s = c, c = i[++h]);
  let p = 0;
  if (u < n && h < e)
    for (c > g == c > -g ? (o = g + s, A = s - (o - g), g = t[++u]) : (o = c + s, A = s - (o - c), c = i[++h]), s = o, A !== 0 && (r[p++] = A); u < n && h < e; )
      c > g == c > -g ? (o = s + g, a = o - s, A = s - (o - a) + (g - a), g = t[++u]) : (o = s + c, a = o - s, A = s - (o - a) + (c - a), c = i[++h]), s = o, A !== 0 && (r[p++] = A);
  for (; u < n; )
    o = s + g, a = o - s, A = s - (o - a) + (g - a), g = t[++u], s = o, A !== 0 && (r[p++] = A);
  for (; h < e; )
    o = s + c, a = o - s, A = s - (o - a) + (c - a), c = i[++h], s = o, A !== 0 && (r[p++] = A);
  return (s !== 0 || p === 0) && (r[p++] = s), p;
}
function RI(n, t) {
  let e = t[0];
  for (let i = 1; i < n; i++) e += t[i];
  return e;
}
function wi(n) {
  return new Float64Array(n);
}
const PI = (3 + 16 * Oe) * Oe, OI = (2 + 12 * Oe) * Oe, LI = (9 + 64 * Oe) * Oe * Oe, pn = wi(4), ba = wi(8), Ea = wi(12), xa = wi(16), Kt = wi(4);
function DI(n, t, e, i, r, s, o) {
  let A, a, g, c, u, h, p, m, l, I, C, d, x, w, f, y, v, M;
  const S = n - r, E = e - r, T = t - s, _ = i - s;
  w = S * _, h = Xt * S, p = h - (h - S), m = S - p, h = Xt * _, l = h - (h - _), I = _ - l, f = m * I - (w - p * l - m * l - p * I), y = T * E, h = Xt * T, p = h - (h - T), m = T - p, h = Xt * E, l = h - (h - E), I = E - l, v = m * I - (y - p * l - m * l - p * I), C = f - v, u = f - C, pn[0] = f - (C + u) + (u - v), d = w + C, u = d - w, x = w - (d - u) + (C - u), C = x - y, u = x - C, pn[1] = x - (C + u) + (u - y), M = d + C, u = M - d, pn[2] = d - (M - u) + (C - u), pn[3] = M;
  let L = RI(4, pn), D = OI * o;
  if (L >= D || -L >= D || (u = n - S, A = n - (S + u) + (u - r), u = e - E, g = e - (E + u) + (u - r), u = t - T, a = t - (T + u) + (u - s), u = i - _, c = i - (_ + u) + (u - s), A === 0 && a === 0 && g === 0 && c === 0) || (D = LI * o + kI * Math.abs(L), L += S * c + _ * A - (T * g + E * a), L >= D || -L >= D)) return L;
  w = A * _, h = Xt * A, p = h - (h - A), m = A - p, h = Xt * _, l = h - (h - _), I = _ - l, f = m * I - (w - p * l - m * l - p * I), y = a * E, h = Xt * a, p = h - (h - a), m = a - p, h = Xt * E, l = h - (h - E), I = E - l, v = m * I - (y - p * l - m * l - p * I), C = f - v, u = f - C, Kt[0] = f - (C + u) + (u - v), d = w + C, u = d - w, x = w - (d - u) + (C - u), C = x - y, u = x - C, Kt[1] = x - (C + u) + (u - y), M = d + C, u = M - d, Kt[2] = d - (M - u) + (C - u), Kt[3] = M;
  const F = Wr(4, pn, 4, Kt, ba);
  w = S * c, h = Xt * S, p = h - (h - S), m = S - p, h = Xt * c, l = h - (h - c), I = c - l, f = m * I - (w - p * l - m * l - p * I), y = T * g, h = Xt * T, p = h - (h - T), m = T - p, h = Xt * g, l = h - (h - g), I = g - l, v = m * I - (y - p * l - m * l - p * I), C = f - v, u = f - C, Kt[0] = f - (C + u) + (u - v), d = w + C, u = d - w, x = w - (d - u) + (C - u), C = x - y, u = x - C, Kt[1] = x - (C + u) + (u - y), M = d + C, u = M - d, Kt[2] = d - (M - u) + (C - u), Kt[3] = M;
  const z = Wr(F, ba, 4, Kt, Ea);
  w = A * c, h = Xt * A, p = h - (h - A), m = A - p, h = Xt * c, l = h - (h - c), I = c - l, f = m * I - (w - p * l - m * l - p * I), y = a * g, h = Xt * a, p = h - (h - a), m = a - p, h = Xt * g, l = h - (h - g), I = g - l, v = m * I - (y - p * l - m * l - p * I), C = f - v, u = f - C, Kt[0] = f - (C + u) + (u - v), d = w + C, u = d - w, x = w - (d - u) + (C - u), C = x - y, u = x - C, Kt[1] = x - (C + u) + (u - y), M = d + C, u = M - d, Kt[2] = d - (M - u) + (C - u), Kt[3] = M;
  const k = Wr(z, Ea, 4, Kt, xa);
  return xa[k - 1];
}
function Ma(n, t, e, i, r, s) {
  const o = (t - s) * (e - r), A = (n - r) * (i - s), a = o - A;
  if (o === 0 || A === 0 || o > 0 != A > 0) return a;
  const g = Math.abs(o + A);
  return Math.abs(a) >= PI * g ? a : -DI(n, t, e, i, r, s, g);
}
function BI(n, t) {
  const e = new pg([], mg);
  return FI(n, e), GI(e, t);
}
function mg(n, t) {
  return n.p.x > t.p.x ? 1 : n.p.x < t.p.x || n.p.x === t.p.x && (n.featureId !== t.featureId || n.ringId !== t.ringId) && n.isLeftEndpoint && !t.isLeftEndpoint ? -1 : n.p.y !== t.p.y ? n.p.y > t.p.y ? 1 : -1 : 1;
}
function NI(n, t) {
  return n.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : n.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : n.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? n.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function FI(n, t) {
  {
    const e = n.features;
    for (let i = 0; i < e.length; i++)
      jI(e[i], t);
  }
}
var Ni = 0, Fi = 0, ji = 0;
function jI(n, t) {
  const e = n.type === "Feature" ? n.geometry : n;
  let i = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (i = [i]), e.type === "LineString" && (i = [[i]]);
  for (let r = 0; r < i.length; r++)
    for (let s = 0; s < i[r].length; s++) {
      let o = i[r][s][0], A = null;
      Fi = Fi + 1;
      for (let a = 0; a < i[r][s].length - 1; a++) {
        A = i[r][s][a + 1];
        const g = new Sa(o, Ni, Fi, ji), c = new Sa(A, Ni, Fi, ji + 1);
        g.otherEvent = c, c.otherEvent = g, mg(g, c) > 0 ? (c.isLeftEndpoint = !0, g.isLeftEndpoint = !1) : (g.isLeftEndpoint = !0, c.isLeftEndpoint = !1), t.push(g), t.push(c), o = A, ji = ji + 1;
      }
    }
  Ni = Ni + 1;
}
var Sa = class {
  constructor(n, t, e, i) {
    this.p = {
      x: n[0],
      y: n[1]
    }, this.featureId = t, this.ringId = e, this.eventId = i, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(n) {
    return this.p.x === n.p.x && this.p.y === n.p.y;
  }
  asNewXY() {
    return [this.p.x, this.p.y];
  }
};
function GI(n, t = !1) {
  const e = [], i = new pg([], NI);
  for (; n.length; ) {
    const r = n.pop();
    if (r.isLeftEndpoint) {
      const s = new zI(r);
      for (let o = 0; o < i.data.length; o++) {
        const A = i.data[o];
        if (t && A.leftSweepEvent.featureId === r.featureId)
          continue;
        const a = UI(s, A);
        a !== !1 && e.push(a);
      }
      i.push(s);
    } else r.isLeftEndpoint === !1 && i.pop();
  }
  return e;
}
var zI = class {
  /** @param event must have otherEvent non-null */
  constructor(n) {
    this.leftSweepEvent = n, this.rightSweepEvent = n.otherEvent;
  }
};
function UI(n, t) {
  if (n === null || t === null) return !1;
  const e = n.leftSweepEvent.p.x, i = n.leftSweepEvent.p.y, r = n.rightSweepEvent.p.x, s = n.rightSweepEvent.p.y, o = t.leftSweepEvent.p.x, A = t.leftSweepEvent.p.y, a = t.rightSweepEvent.p.x, g = t.rightSweepEvent.p.y, c = Ma(e, i, r, s, o, A), u = Ma(e, i, r, s, a, g);
  if (c > 0 && u > 0) return !1;
  if (c < 0 && u < 0) return !1;
  if (n.leftSweepEvent.ringId === t.leftSweepEvent.ringId) {
    if (n.rightSweepEvent.isSamePoint(t.leftSweepEvent) || n.rightSweepEvent.isSamePoint(t.rightSweepEvent) || n.leftSweepEvent.isSamePoint(t.leftSweepEvent) || n.leftSweepEvent.isSamePoint(t.rightSweepEvent))
      return !1;
  } else {
    if (n.rightSweepEvent.isSamePoint(t.leftSweepEvent))
      return t.leftSweepEvent.asNewXY();
    if (n.rightSweepEvent.isSamePoint(t.rightSweepEvent))
      return t.rightSweepEvent.asNewXY();
    if (n.leftSweepEvent.isSamePoint(t.leftSweepEvent))
      return t.leftSweepEvent.asNewXY();
    if (n.leftSweepEvent.isSamePoint(t.rightSweepEvent))
      return t.rightSweepEvent.asNewXY();
  }
  const h = (g - A) * (r - e) - (a - o) * (s - i), p = (a - o) * (i - A) - (g - A) * (e - o), m = (r - e) * (i - A) - (s - i) * (e - o);
  if (h === 0)
    return !1;
  const l = p / h, I = m / h;
  if (l >= 0 && l <= 1 && I >= 0 && I <= 1) {
    const C = e + l * (r - e), d = i + l * (s - i);
    return [C, d];
  }
  return !1;
}
function XI(n, t, e = {}) {
  const { removeDuplicates: i = !0, ignoreSelfIntersections: r = !0 } = e;
  let s = [];
  n.type === "FeatureCollection" ? s = s.concat(n.features) : n.type === "Feature" ? s.push(n) : (n.type === "LineString" || n.type === "Polygon" || n.type === "MultiLineString" || n.type === "MultiPolygon") && s.push(Ci(n)), t.type === "FeatureCollection" ? s = s.concat(t.features) : t.type === "Feature" ? s.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && s.push(Ci(t));
  const o = BI(
    pa(s),
    r
  );
  let A = [];
  if (i) {
    const a = {};
    o.forEach((g) => {
      const c = g.join(",");
      a[c] || (a[c] = !0, A.push(g));
    });
  } else
    A = o;
  return pa(A.map((a) => Cg(a)));
}
function ZI(n, t = {}) {
  let e = 0, i = 0, r = 0;
  return dg(
    n,
    function(s) {
      e += s[0], i += s[1], r++;
    }
  ), Cg([e / r, i / r], t.properties);
}
const Qi = "maplat-ui", WI = [
  { attr: "app-id", prop: "appId", kind: "string", startup: !0, option: "appid" },
  { attr: "app-src", prop: "appSrc", kind: "string", startup: !0 },
  { attr: "map-id", prop: "mapId", kind: "string", state: "change" },
  { attr: "transparency", prop: "transparency", kind: "number", state: "frame" },
  { attr: "no-rotate", prop: "noRotate", kind: "boolean", startup: !0, option: "noRotate" },
  { attr: "north-up", prop: "northUp", kind: "boolean", option: "northUp" },
  { attr: "home-margin-pixels", prop: "homeMarginPixels", kind: "number", option: "homeMarginPixels" },
  { attr: "always-gps-on", prop: "alwaysGpsOn", kind: "boolean", startup: !0, option: "alwaysGpsOn" },
  { attr: "fake", prop: "fake", kind: "boolean", startup: !0, option: "fake" },
  { attr: "enable-cache", prop: "enableCache", kind: "boolean", startup: !0, option: "enableCache" },
  { attr: "restore-session", prop: "restoreSession", kind: "boolean", startup: !0, option: "restoreSession" },
  { attr: "overlay", prop: "overlay", kind: "boolean", startup: !0, option: "overlay" },
  { attr: "debug", prop: "debug", kind: "boolean", option: "debug" },
  { attr: "icon", prop: "icon", kind: "string", option: "icon" },
  { attr: "selected-icon", prop: "selectedIcon", kind: "string", option: "selectedIcon" },
  // 中心の目印（既定で表示。消す・画像を差し替える口）
  { attr: "no-center-marker", prop: "noCenterMarker", kind: "boolean", dom: !0 },
  { attr: "center-marker-src", prop: "centerMarkerSrc", kind: "string", dom: !0 },
  // 範囲外の POI を描かない指定（起動後にも変えられる）
  { attr: "hide-outside-pois", prop: "hideOutsidePois", kind: "boolean", option: "hideOutsidePois" }
], VI = [
  { prop: "setting", startup: !0, option: "setting" },
  { prop: "restore", startup: !0, option: "restore" },
  { prop: "restoreExtensionKeys", startup: !0, option: "restoreExtensionKeys" },
  { prop: "googleApiKey", startup: !0, option: "googleApiKey" },
  { prop: "mapboxToken", startup: !0, option: "mapboxToken" },
  { prop: "maplibregl", startup: !0, option: "maplibregl" },
  { prop: "mapboxgl", startup: !0, option: "mapboxgl" },
  { prop: "uiHooks", startup: !0, option: "uiHooks" },
  { prop: "appOption", startup: !0 },
  { prop: "poiTemplate", option: "poiTemplate" },
  { prop: "poiStyle", option: "poiStyle" },
  { prop: "iconTemplate", option: "iconTemplate" }
];
[
  ...WI.filter((n) => n.startup).map((n) => n.prop),
  ...VI.filter((n) => n.startup).map((n) => n.prop)
];
const Ta = (n) => typeof n == "string" || !!n && typeof n == "object" && Object.values(n).every((t) => typeof t == "string");
function HI(n) {
  const t = n;
  return !t || typeof t != "object" || Array.isArray(t) || Array.isArray(t.label) || Array.isArray(t.value) ? !1 : (t.from === "manifest" || t.from === "canvas") && Ta(t.label) && Ta(t.value);
}
const QI = "hidden";
function Vr(n) {
  return typeof n == "object" && n !== null && !Array.isArray(n);
}
function yg(n, t) {
  if (!Vr(n)) return;
  const e = {};
  if (typeof n.manifest == "string" && (e.manifest = n.manifest), typeof n.canvas == "string" && (e.canvas = n.canvas), typeof n.image == "string" && (e.image = n.image), typeof n.copiedAt == "string" && (e.copiedAt = n.copiedAt), Vr(n.bindings) && (e.bindings = n.bindings), Vr(n.copiedValues) && (e.copiedValues = n.copiedValues), Array.isArray(n.copiedMetadata)) {
    const i = n.copiedMetadata.filter(HI), r = n.copiedMetadata.length - i.length;
    r > 0 && t !== void 0 && console.warn(
      `Maplat: ignored ${r} malformed entries in iiif.copiedMetadata (mapID: "${t}").`
    ), e.copiedMetadata = i;
  }
  return e;
}
function vg(n) {
  return n === "all" || n === "hidden" ? n : void 0;
}
function YI(n, t) {
  const e = yg(n);
  if (!e) return;
  const i = {
    display: vg(t) ?? QI
  };
  return e.manifest !== void 0 && (i.manifest = e.manifest), e.canvas !== void 0 && (i.canvas = e.canvas), e.image !== void 0 && (i.image = e.image), e.copiedAt !== void 0 && (i.copiedAt = e.copiedAt), e.copiedMetadata !== void 0 && (i.metadata = e.copiedMetadata), i;
}
function wg(n) {
  class t extends n {
    weiwudi;
    _map;
    homePosition;
    mercZoom;
    pois;
    officialTitle = "";
    title = "";
    mapID = "";
    label = "";
    initialWait;
    maxZoom;
    minZoom;
    envelope;
    centroid;
    homeMarginPixels = 0;
    thumbnail;
    poiTemplate;
    poiStyle;
    iconTemplate;
    startFrom;
    controls;
    northUp;
    tapDuration;
    mercatorXShift = 0;
    mercatorYShift = 0;
    icon;
    selectedIcon;
    /** 地図データの iiif 節（IIIF の書誌の写し） */
    iiif;
    /** アプリの設定で選んだ、書誌の表の出し方 */
    iiifMetadataDisplay;
    static isBasemap_ = !1;
    static isWmts_ = !0;
    static isMapbox_ = !1;
    static isMapLibre_ = !1;
    initialize(i) {
      if (i = ve(i), this.mapID = i.mapID, this.homePosition = i.homePosition, this.mercZoom = i.mercZoom, this.label = i.label, this.maxZoom = i.maxZoom, this.minZoom = i.minZoom, this.poiTemplate = i.poiTemplate, this.poiStyle = i.poiStyle, this.iconTemplate = i.iconTemplate, this.icon = i.icon, this.selectedIcon = i.selectedIcon, this.mercatorXShift = i.mercatorXShift, this.mercatorYShift = i.mercatorYShift, this.weiwudi = i.weiwudi, this.iiif = yg(i.iiif, this.mapID), this.iiifMetadataDisplay = vg(i.iiifMetadata), i.envelopeLngLats) {
        const A = i.envelopeLngLats.map(
          (a) => re(a, "EPSG:4326", "EPSG:3857")
        );
        A.push(A[0]), this.envelope = fg([A]), this.centroid = ZI(this.envelope).geometry?.coordinates;
      }
      for (let o = 0; o < Ai.length; o++) {
        const A = Ai[o], a = Vc[o];
        this.set(A, i[a] || i[A]);
      }
      const r = i.thumbnail ? new Promise((o) => {
        this.thumbnail = i.thumbnail, o(void 0);
      }) : new Promise((o) => {
        this.thumbnail = `./tmbs/${i.mapID}.jpg`, fetch(this.thumbnail).then((A) => {
          A.ok || (this.thumbnail = `./tmbs/${i.mapID}_menu.jpg`), o(void 0);
        }).catch((A) => {
          this.thumbnail = `./tmbs/${i.mapID}_menu.jpg`, o(void 0);
        });
      }).catch((o) => {
        this.thumbnail = `./tmbs/${i.mapID || i.sourceID}_menu.jpg`;
      }), s = this.resolvePois(i.pois);
      this.initialWait = Promise.all([s, r]), JI(this);
    }
    static isBasemap() {
      return this.isBasemap_;
    }
    static isWmts() {
      return this.isWmts_;
    }
    static isMapbox() {
      return !!this.isMapbox_;
    }
    static isMapLibre() {
      return !!this.isMapLibre_;
    }
    isBasemap() {
      return this.constructor.isBasemap();
    }
    isWmts() {
      return this.constructor.isWmts();
    }
    isMapbox() {
      return this.constructor.isMapbox();
    }
    isMapLibre() {
      return this.constructor.isMapLibre && this.constructor.isMapLibre();
    }
    getCacheEnable() {
      return !!this.weiwudi;
    }
    async getTileCacheStatsAsync() {
      if (!this.weiwudi) return {};
      try {
        const i = await this.weiwudi.stats(), r = this.weiwudi.totalTile;
        return i && typeof i == "object" && i.total == null && typeof r == "number" ? { ...i, total: r } : i;
      } catch {
        return {};
      }
    }
    async getTileCacheSizeAsync() {
      return (await this.getTileCacheStatsAsync()).size || 0;
    }
    async fetchAllTileCacheAsync(i) {
      if (this.weiwudi)
        try {
          const r = (o) => {
            i(o.type, o.detail);
          }, s = (o) => {
            this.weiwudi.removeEventListener("proceed", r), this.weiwudi.removeEventListener("finish", s), this.weiwudi.removeEventListener("stop", s), this.weiwudi.removeEventListener("canceled", s), r(o);
          };
          this.weiwudi.addEventListener("proceed", r), this.weiwudi.addEventListener("finish", s), this.weiwudi.addEventListener("stop", s), this.weiwudi.addEventListener("canceled", s), await this.weiwudi.fetchAll();
        } catch {
        }
    }
    async cancelTileCacheAsync() {
      if (this.weiwudi)
        try {
          await this.weiwudi.cancel();
        } catch {
        }
    }
    async clearTileCacheAsync() {
      if (this.weiwudi)
        try {
          await this.weiwudi.clean();
        } catch {
        }
    }
    getMap() {
      return this._map;
    }
    setMap(i) {
      this._map = i;
    }
    // 経緯度lnglat、メルカトルズームmercZoom、地図ズームzoom、方角direction、地図回転rotation等を指定し地図移動
    setViewpointRadian(i) {
      let r, s;
      const o = i.mercZoom, A = i.zoom, a = i.direction, g = i.rotation, c = this.getMap(), u = c?.getView(), h = c ? c.getSize() : void 0;
      u && (!h || h[0] <= 0 || h[1] <= 0) || (i.latitude !== void 0 && i.longitude !== void 0 && (r = re(
        [i.longitude, i.latitude],
        "EPSG:4326",
        "EPSG:3857"
      )), i.x !== void 0 && i.y != null && (s = [i.x, i.y]), this.viewpoint2MercsAsync().then((p) => this.mercs2MercViewpoint(p)).then((p) => {
        const m = this.mercViewpoint2Mercs([
          r || p[0],
          o || p[1] || 17,
          a ?? g ?? p[2]
        ]);
        this.mercs2ViewpointAsync(m).then((l) => {
          r != null ? u?.setCenter(l[0]) : s != null && u?.setCenter(s), o != null ? u?.setZoom(l[1]) : A != null && u?.setZoom(A), a != null ? u?.setRotation(l[2]) : g != null && u?.setRotation(g);
        });
      }));
    }
    setViewpoint(i) {
      const r = { ...i };
      r.rotation && (r.rotation = r.rotation * Math.PI / 180), r.direction && (r.direction = r.direction * Math.PI / 180), this.setViewpointRadian(r);
    }
    goHome() {
      const r = this.getMap();
      let s = r.getTarget();
      typeof s == "string" && (s = document.getElementById(s));
      const o = r.homeMarginPixels, A = [
        (s.clientWidth - o - 10) * 1,
        (s.clientHeight - o - 10) * 1
      ], a = {
        longitude: this.homePosition[0],
        latitude: this.homePosition[1],
        zoom: this.defZoom(A)
      };
      this.getMap().northUp ? a.direction = 0 : a.rotation = 0, this.setViewpointRadian(a);
    }
    resetRotation() {
      this.setViewpointRadian({ rotation: 0 });
    }
    resetDirection() {
      this.setViewpointRadian({ direction: 0 });
    }
    resetCirculation() {
      this.getMap().northUp ? this.resetDirection() : this.resetRotation();
    }
    setGPSMarkerAsync(i, r = !1) {
      const s = this.getMap(), o = s?.getView();
      if (!i)
        return new Promise((a, g) => {
          s?.setGPSPosition(null), a(!0);
        });
      const A = this.mercsFromGPSValue(i.lnglat, i.acc);
      return this.mercs2SysCoordsAsync_multiLayer([A]).then((a) => {
        const g = !a[0], c = g ? a[1] : a[0];
        if (!c || !this.insideCheckSysCoord(c[0][0]))
          return s?.setGPSPosition(null), !1;
        const u = g ? null : a[1], h = { xy: c[0][0] }, p = c[0].slice(1);
        return h.rad = p.reduce(
          (m, l, I) => {
            const C = m + Math.sqrt(
              Math.pow(l[0] - h.xy[0], 2) + Math.pow(l[1] - h.xy[1], 2)
            );
            return I === 3 ? C / 4 : C;
          },
          0
        ), r || o?.setCenter(h.xy), s?.setGPSPosition(h, g ? "hide" : null), u && s?.setGPSPosition({ xy: u[0][0] }, "sub"), !0;
      }).catch((a) => {
        throw a;
      });
    }
    setGPSMarker(i, r = !1) {
      this.setGPSMarkerAsync(i, r).then(() => {
      });
    }
    mercsFromGPSValue(i, r) {
      const s = re(i, "EPSG:4326", "EPSG:3857"), o = i[1] * Math.PI / 180, A = r / Math.cos(o);
      return og.map((a) => [
        a[0] * A + s[0],
        a[1] * A + s[1]
      ]);
    }
    // 与えられた差分行列を回転。theta無指定の場合は自動取得
    rotateMatrix(i, r) {
      return r === void 0 && (r = this.getMap().getView().getRotation()), ag(i, r);
    }
    async resolvePois(i) {
      this.pois = await hg(i || [], {
        name: this.officialTitle || this.title,
        namespace: this.mapID
      });
    }
    getPoi(i) {
      let r;
      return Object.keys(this.pois).map((s) => {
        this.pois[s].pois.map((o, A) => {
          o.id === i && (r = this.pois[s].pois[A]);
        });
      }), r;
    }
    addPoi(i, r) {
      r || (r = "main");
      const s = Et(this.pois, r);
      if (s)
        return i = hi(i), s.pois.push(i), go(this.pois, r, {
          name: this.officialTitle || this.title,
          namespace: this.mapID
        }), i.namespaceID;
    }
    removePoi(i) {
      Object.keys(this.pois).forEach((r) => {
        const s = this.pois[r].pois;
        for (let o = s.length - 1; o >= 0; o--)
          s[o].id === i && s.splice(o, 1);
      });
    }
    clearPoi(i) {
      if (i || (i = "main"), i === "all")
        Object.keys(this.pois).map((r) => {
          this.pois[r].pois = [];
        });
      else {
        const r = Et(this.pois, i);
        r && (r.pois = []);
      }
    }
    listPoiLayers(i = !1, r = !1) {
      return Object.keys(this.pois).sort((s, o) => s === "main" ? -1 : o === "main" ? 1 : 0).map((s) => this.pois[s]).filter(
        (s) => r ? i ? s.pois.length && s.hide : s.pois.length : i ? s.hide : !0
      );
    }
    getPoiLayer(i) {
      return Et(this.pois, i);
    }
    addPoiLayer(i, r) {
      i !== "main" && (this.pois[i] || (this.pois[i] = Ue(r || [], i, {
        name: this.officialTitle || this.title,
        namespace: this.mapID
      })));
    }
    removePoiLayer(i) {
      i !== "main" && this.pois[i] && delete this.pois[i];
    }
    merc2SysCoordAsync_ignoreBackground(i) {
      return this.merc2XyAsync_ignoreBackground(i).then(
        (r) => r ? this.xy2SysCoord(r) : void 0
      );
    }
    merc2SysCoordAsync(i) {
      return this.merc2XyAsync(i).then(
        (r) => r && this.xy2SysCoord(r)
      );
    }
    sysCoord2MercAsync(i) {
      const r = this.sysCoord2Xy(i);
      return this.xy2MercAsync(r);
    }
    // size(画面サイズ)とズームから、地図面座標上での半径を得る。zoom無指定の場合は自動取得
    zoom2Radius(i, r) {
      return r === void 0 && (r = this.getMap().getView().getDecimalZoom()), oo(i, r);
    }
    // 画面サイズと地図ズームから、地図面座標上での5座標を取得する。zoom, rotate無指定の場合は自動取得
    viewpoint2SysCoords(i, r) {
      return this.mercViewpoint2Mercs(i, r);
    }
    mercViewpoint2Mercs(i, r) {
      let s = i ? i[0] : void 0;
      const o = i ? i[1] : void 0, A = i ? i[2] : void 0;
      s === void 0 && (s = this.getMap().getView().getCenter()), r === void 0 && (r = this.getMap().getSize());
      const a = o ?? this.getMap().getView().getDecimalZoom(), g = A ?? this.getMap().getView().getRotation();
      return [_s(
        s,
        a,
        g,
        r
      ), r];
    }
    // 地図座標5地点情報から地図サイズ情報（中心座標、サイズ、回転）を得る
    sysCoords2Viewpoint(i) {
      return this.mercs2MercViewpoint(i);
    }
    // メルカトル5地点情報からメルカトル地図でのサイズ情報（中心座標、サイズ、回転）を得る
    mercs2MercViewpoint(i) {
      let r = i[1];
      r || (r = this.getMap().getSize());
      const s = ks(
        i[0],
        r
      );
      return [s.center, s.zoom, s.rotation];
    }
    sysCoords2Xys(i) {
      return [
        i[0].map((r) => this.sysCoord2Xy(r)),
        i[1]
      ];
    }
    xys2SysCoords(i) {
      return [i[0].map((r) => this.xy2SysCoord(r)), i[1]];
    }
    mercs2XysAsync(i) {
      return Promise.all(i[0].map((r) => this.merc2XyAsync(r))).then(
        (r) => [r, i[1]]
      );
    }
    xys2MercsAsync(i) {
      return Promise.all(i[0].map((r) => this.xy2MercAsync(r))).then(
        (r) => [r, i[1]]
      );
    }
    static async createAsync(i) {
      return new this(i);
    }
  }
  return t;
}
function bg(n) {
  class t extends wg(n) {
    static isBasemap_ = !0;
    static isWmts_ = !0;
    insideCheckXy(i) {
      return this.envelope ? SI(i, this.envelope) : !0;
    }
    insideCheckSysCoord(i) {
      return this.insideCheckXy(i);
    }
    modulateXyInside(i) {
      if (!this.centroid) return i;
      const r = fI([i, this.centroid]), s = XI(this.envelope, r);
      return s.features.length > 0 && s.features[0].geometry ? s.features[0].geometry.coordinates : i;
    }
    modulateSysCoordInside(i) {
      return this.modulateXyInside(i);
    }
    // unifyTerm対応
    // https://github.com/code4history/MaplatCore/issues/19
    merc2XyAsync(i) {
      return Promise.resolve(i);
    }
    merc2XyAsync_ignoreBackground(i) {
      return this.merc2XyAsync(i);
    }
    xy2MercAsync(i) {
      return Promise.resolve(i);
    }
    xy2SysCoord(i) {
      return i;
    }
    sysCoord2Xy(i) {
      return i;
    }
    viewpoint2MercsAsync(i, r) {
      const s = this.viewpoint2SysCoords(i, r), o = this.sysCoords2Xys(s);
      return this.xys2MercsAsync(o);
    }
    mercs2ViewpointAsync(i) {
      return this.mercs2XysAsync(i).then((r) => {
        const s = this.xys2SysCoords(r);
        return this.sysCoords2Viewpoint(s);
      });
    }
    mercs2SysCoordsAsync_multiLayer(i) {
      return Promise.all(
        i[0].map((r) => this.merc2SysCoordAsync(r))
      ).then((r) => [[r, i[1]]]);
    }
    defZoom() {
      return this.mercZoom;
    }
  }
  return t;
}
function KI(n) {
  class t extends wg(n) {
    static isBasemap_ = !1;
    static isWmts_ = !1;
    width = 0;
    height = 0;
    _maxxy = 0;
    insideCheckXy(i) {
      return !(i[0] < 0 || i[0] > this.width || i[1] < 0 || i[1] > this.height);
    }
    insideCheckSysCoord(i) {
      return this.insideCheckXy(this.sysCoord2Xy(i));
    }
    modulateXyInside(i) {
      const r = i[0] / (this.width / 2) - 1, s = i[1] / (this.height / 2) - 1, o = Math.max(Math.abs(r), Math.abs(s));
      return [
        (r / o + 1) * this.width / 2,
        (s / o + 1) * this.height / 2
      ];
    }
    modulateSysCoordInside(i) {
      const r = this.sysCoord2Xy(i), s = this.modulateXyInside(r);
      return this.xy2SysCoord(s);
    }
    // unifyTerm対応
    // https://github.com/code4history/MaplatCore/issues/19
    xy2SysCoord(i) {
      const r = i[0] * (2 * dt) / this._maxxy - dt, s = -1 * (i[1] * (2 * dt) / this._maxxy - dt);
      return [r, s];
    }
    sysCoord2Xy(i) {
      const r = (i[0] + dt) * this._maxxy / (2 * dt), s = (-i[1] + dt) * this._maxxy / (2 * dt);
      return [r, s];
    }
    defZoom(i) {
      const r = i[0], s = i[1], o = Math.log2((r - 10) / this.width), A = Math.log2((s - 10) / this.height), a = this.maxZoom;
      let g;
      return A > o ? g = A : g = o, a + g;
    }
  }
  return t;
}
const Ps = (n) => (n || "").match(/^(?:google(?:_(?:roadmap|satellite|hybrid|terrain))?|mapbox|maplibre)$/);
function Eg(n) {
  return n = ve(n), n.imageExtension || (n.imageExtension = "jpg"), Ps(n.maptype) ? (delete n.url, delete n.urls) : n.mapID && !n.url && !n.urls && (n.url = n.tms ? `tiles/${n.mapID}/{z}/{x}/{-y}.${n.imageExtension}` : `tiles/${n.mapID}/{z}/{x}/{y}.${n.imageExtension}`), n;
}
function JI(n) {
  const t = n;
  n.setTileLoadFunction(
    (function() {
      const e = t.getTileLoadFunction(), i = [1e3, 2e3, 4e3], r = /* @__PURE__ */ new WeakMap();
      let s = !1;
      const o = function(a, g) {
        s || (s = !0, console.warn(
          "Maplat: tile composition failed by an exception; retrying (up to 3 times)",
          g
        ));
        const c = r.get(a) ?? 0;
        c >= i.length || (r.set(a, c + 1), setTimeout(() => {
          const u = t.getMap?.()?.getTargetElement?.();
          u && !u.isConnected || a.getState?.() === bu.ERROR && a.load();
        }, i[c]));
      }, A = function(a, g, c, u, h, p, m) {
        return new Promise((l, I) => {
          const C = function(d, x = void 0) {
            const w = document.createElement("img");
            w.crossOrigin = "Anonymous", w.onload = w.onerror = function() {
              try {
                if (w.width && w.height) {
                  const f = c.getContext("2d"), y = u === 0 ? 256 - p : 0, v = h === 0 ? 256 - m : 0;
                  p = u + p > w.width ? w.width - u : p, m = h + m > w.height ? w.height - h : m, f.drawImage(w, u, h, p, m, y, v, p, m), l(void 0);
                } else
                  x ? C(x) : l("tileLoadError");
              } catch {
                l("tileException");
              }
            }, w.src = d;
          };
          C(g);
        });
      };
      return function(a, g) {
        const c = a.tileCoord[0];
        let u = a.tileCoord[1], h = a.tileCoord[2], p = Math.round(
          (t.mercatorXShift || 0) * 128 * Math.pow(2, c) / dt
        ), m = Math.round(
          (t.mercatorYShift || 0) * -128 * Math.pow(2, c) / dt
        );
        for (; p < 0 || p >= 256; )
          p < 0 ? (p = p + 256, u++) : (p = p - 256, u--);
        for (; m < 0 || m >= 256; )
          m < 0 ? (m = m + 256, h++) : (m = m - 256, h--);
        const l = document.createElement("div");
        l.innerHTML = II;
        const I = l.childNodes[0], C = [
          [[c, u, h], 0, 0, 256 - p, 256 - m]
        ];
        p !== 0 && C.push([
          [c, u - 1, h],
          256 - p,
          0,
          p,
          256 - m
        ]), m !== 0 && (C.push([
          [c, u, h - 1],
          0,
          256 - m,
          256 - p,
          m
        ]), p !== 0 && C.push([
          [c, u - 1, h - 1],
          256 - p,
          256 - m,
          p,
          m
        ])), Promise.all(
          C.map((d) => {
            const x = t.tileUrlFunction(
              d[0],
              t.tilePixelRatio_,
              t.projection_
            );
            return A(
              d[0],
              x,
              I,
              d[1],
              d[2],
              d[3],
              d[4]
            );
          })
        ).then((d) => {
          if (d.reduce((w, f) => w && f, !0))
            a.handleImageError_(), d.includes("tileException") && o(a);
          else {
            const w = I.toDataURL(), f = a.getImage();
            f.crossOrigin = null, e(a, w), r.delete(a);
          }
        }).catch((d) => {
          a.handleImageError_(), o(a, d);
        });
      };
    })()
  );
}
class Fn extends bg(kA) {
  constructor(t = {}) {
    const e = Eg(t);
    if (super(e), t.mapID && (this.mapID = t.mapID), t.mapID === "morioka_ndl_affine") {
      const i = this.getTileUrlFunction();
      this.setTileUrlFunction((r, s, o) => i(r, s, o));
    }
    this.initialize(t);
  }
}
class ar extends Fn {
  style = "";
  accessToken = "";
  mapboxMap;
  static isMapbox_ = !0;
  constructor(t = {}) {
    super(t), this.style = t.style, this.mapboxMap = t.mapboxMap, this.accessToken = t.accessToken;
  }
}
class Ar extends Fn {
  style = "";
  maplibreMap;
  static isMapLibre_ = !0;
  constructor(t = {}) {
    super(t), this.style = t.style || "https://tile.openstreetmap.jp/styles/osm-bright/style.json", this.maplibreMap = t.maplibreMap;
  }
}
function qI(n, t) {
  const i = n ? {
    google_roadmap: { mapType: "roadmap", derivedLayers: [] },
    google_satellite: { mapType: "satellite", derivedLayers: [] },
    google_hybrid: { mapType: "satellite", derivedLayers: ["layerRoadmap"] },
    google_terrain: { mapType: "terrain", derivedLayers: ["layerRoadmap"] }
  }[n] : void 0, r = i?.mapType ?? "roadmap", s = i?.derivedLayers ?? [], o = (t || []).map(
    (a) => `layer${a.charAt(0).toUpperCase()}${a.slice(1).toLowerCase()}`
  ), A = new Set(s);
  for (const a of o) A.add(a);
  return { mapType: r, layerTypes: [...A] };
}
class Os extends bg(Xc) {
  /**
   * Map Tiles API の mapType（roadmap・satellite・terrain）。出典の表示（src/attribution.ts）が、
   * Google の地図かどうかと、Google Maps のロゴの種類（衛星は白い字）を決めるのに読む。
   */
  googleMapType;
  constructor(t = {}) {
    const e = Object.assign({}, t), { mapType: i, layerTypes: r } = qI(t.maptype, t.layers);
    e.mapType = i, e.layerTypes = r, super(e), this.googleMapType = i, t.mapID && (this.mapID = t.mapID), this.initialize(t);
  }
}
const je = {
  ANIMATING: 0,
  INTERACTING: 1
}, Ce = {
  CENTER: "center",
  RESOLUTION: "resolution",
  ROTATION: "rotation"
};
function _a(n, t, e) {
  return (
    /**
     * @param {import("./coordinate.js").Coordinate|undefined} center Center.
     * @param {number|undefined} resolution Resolution.
     * @param {import("./size.js").Size} size Viewport size; unused if `onlyCenter` was specified.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @param {Array<number>} [centerShift] Shift between map center and viewport center.
     * @return {import("./coordinate.js").Coordinate|undefined} Center.
     */
    (function(i, r, s, o, A) {
      if (!i)
        return;
      if (!r && !t)
        return i;
      const a = t ? 0 : s[0] * (r ?? 0), g = t ? 0 : s[1] * (r ?? 0), c = A ? A[0] : 0, u = A ? A[1] : 0;
      let h = n[0] + a / 2 + c, p = n[2] - a / 2 + c, m = n[1] + g / 2 + u, l = n[3] - g / 2 + u;
      h > p && (h = (p + h) / 2, p = h), m > l && (m = (l + m) / 2, l = m);
      let I = fe(i[0], h, p), C = fe(i[1], m, l);
      if (o && e && r) {
        const d = 30 * r;
        I += -d * Math.log(1 + Math.max(0, h - i[0]) / d) + d * Math.log(1 + Math.max(0, i[0] - p) / d), C += -d * Math.log(1 + Math.max(0, m - i[1]) / d) + d * Math.log(1 + Math.max(0, i[1] - l) / d);
      }
      return [I, C];
    })
  );
}
function $I(n) {
  return n;
}
function th(n) {
  return Math.pow(n, 3);
}
function pr(n) {
  return 1 - th(1 - n);
}
function eh(n) {
  return 3 * n * n - 2 * n * n * n;
}
function nh(n) {
  return n;
}
function co(n, t, e, i) {
  const r = Qs(t) / e[0], s = gi(t) / e[1];
  return i ? Math.min(n, Math.max(r, s)) : Math.min(n, Math.min(r, s));
}
function lo(n, t, e) {
  let i = Math.min(n, t);
  const r = 50;
  return i *= Math.log(1 + r * Math.max(0, n / t - 1)) / r + 1, e && (i = Math.max(i, e), i /= Math.log(1 + r * Math.max(0, e / n - 1)) / r + 1), fe(i, e / 2, t * 2);
}
function ih(n, t, e, i) {
  return t = t !== void 0 ? t : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(r, s, o, A) {
    if (r !== void 0) {
      const a = n[0], g = n[n.length - 1], c = e ? co(
        a,
        e,
        o,
        !!i
      ) : a;
      if (A)
        return t ? lo(
          r,
          c,
          g
        ) : fe(r, g, c);
      const u = Math.min(c, r), h = Math.floor(LA(n, u, s));
      return n[h] > c && h < n.length - 1 ? n[h + 1] : n[h];
    }
  });
}
function rh(n, t, e, i, r, s) {
  return i = i !== void 0 ? i : !0, e = e !== void 0 ? e : 0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(o, A, a, g) {
    if (o !== void 0) {
      const c = r ? co(
        t,
        r,
        a,
        !!s
      ) : t;
      if (g)
        return i ? lo(
          o,
          c,
          e
        ) : fe(o, e, c);
      const u = 1e-9, h = Math.ceil(
        Math.log(t / c) / Math.log(n) - u
      ), p = -A * (0.5 - u) + 0.5, m = Math.min(c, o), l = Math.floor(
        Math.log(t / m) / Math.log(n) + p
      ), I = Math.max(h, l), C = t / Math.pow(n, I);
      return fe(C, e, c);
    }
  });
}
function ka(n, t, e, i, r) {
  return e = e !== void 0 ? e : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(s, o, A, a) {
    if (s !== void 0) {
      const g = i ? co(
        n,
        i,
        A,
        !!r
      ) : n;
      return !e || !a ? fe(s, t, g) : lo(
        s,
        g,
        t
      );
    }
  });
}
function uo(n) {
  if (n !== void 0)
    return 0;
}
function Ra(n) {
  if (n !== void 0)
    return n;
}
function sh(n) {
  const t = 2 * Math.PI / n;
  return (
    /**
     * @param {number|undefined} rotation Rotation.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @return {number|undefined} Rotation.
     */
    (function(e, i) {
      if (i)
        return e;
      if (e !== void 0)
        return e = Math.floor(e / t + 0.5) * t, e;
    })
  );
}
function oh(n) {
  const t = _n(5);
  return (
    /**
     * @param {number|undefined} rotation Rotation.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @return {number|undefined} Rotation.
     */
    (function(e, i) {
      return i || e === void 0 ? e : Math.abs(e) <= t ? 0 : e;
    })
  );
}
const ah = 256, Hr = 0;
class Pa extends jn {
  /**
   * @param {ViewOptions} [options] View options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = Object.assign({}, t), this.hints_ = [0, 0], this.animations_ = [], this.updateAnimationKey_, this.projection_ = to(t.projection, "EPSG:3857"), this.viewportSize_ = [100, 100], this.targetCenter_ = null, this.targetResolution_, this.targetRotation_, this.nextCenter_ = null, this.nextResolution_, this.nextRotation_, this.cancelAnchor_ = void 0, t.projection && Zl(), t.center && (t.center = Fe(
      t.center,
      /** @type {import("./proj.js").ProjectionLike} */
      this.projection_
    )), t.extent && (t.extent = Di(
      t.extent,
      /** @type {import("./proj.js").ProjectionLike} */
      this.projection_
    )), this.applyOptions_(t);
  }
  /**
   * Set up the view with the given options.
   * @param {ViewOptions} options View options.
   */
  applyOptions_(t) {
    const e = (
      /** @type {Object<string, *>} */
      Object.assign({}, t)
    );
    for (const A in Ce)
      delete e[A];
    this.setProperties(e, !0);
    const i = gh(t);
    this.maxResolution_ = i.maxResolution, this.minResolution_ = i.minResolution, this.zoomFactor_ = i.zoomFactor, this.resolutions_ = t.resolutions, this.padding_ = t.padding, this.minZoom_ = i.minZoom;
    const r = Ah(t), s = i.constraint, o = ch(t);
    this.constraints_ = {
      center: r,
      resolution: s,
      rotation: o
    }, this.setRotation(t.rotation !== void 0 ? t.rotation : 0), this.setCenterInternal(
      t.center !== void 0 ? t.center : null
    ), t.resolution !== void 0 ? this.setResolution(t.resolution) : t.zoom !== void 0 && this.setZoom(t.zoom);
  }
  /**
   * Padding (in css pixels).
   * If the map viewport is partially covered with other content (overlays) along
   * its edges, this setting allows to shift the center of the viewport away from that
   * content. The order of the values in the array is top, right, bottom, left.
   * The default is no padding, which is equivalent to `[0, 0, 0, 0]`.
   * @type {Array<number>|undefined}
   * @api
   */
  get padding() {
    return this.padding_;
  }
  set padding(t) {
    let e = this.padding_;
    this.padding_ = t;
    const i = this.getCenterInternal();
    if (i) {
      const r = t || [0, 0, 0, 0];
      e = e || [0, 0, 0, 0];
      const s = (
        /** @type {number} */
        this.getResolution()
      ), o = s / 2 * (r[3] - e[3] + e[1] - r[1]), A = s / 2 * (r[0] - e[0] + e[2] - r[2]);
      this.setCenterInternal([i[0] + o, i[1] - A]);
    }
  }
  /**
   * Get an updated version of the view options used to construct the view.  The
   * current resolution (or zoom), center, and rotation are applied to any stored
   * options.  The provided options can be used to apply new min/max zoom or
   * resolution limits.
   * @param {ViewOptions} newOptions New options to be applied.
   * @return {ViewOptions} New options updated with the current view state.
   */
  getUpdatedOptions_(t) {
    const e = this.getProperties();
    return e.resolution !== void 0 ? e.resolution = this.getResolution() : e.zoom = this.getZoom(), e.center = this.getCenterInternal(), e.rotation = this.getRotation(), Object.assign({}, e, t);
  }
  /**
   * Animate the view.  The view's center, zoom (or resolution), and rotation
   * can be animated for smooth transitions between view states.  For example,
   * to animate the view to a new zoom level:
   *
   *     view.animate({zoom: view.getZoom() + 1});
   *
   * By default, the animation lasts one second and uses in-and-out easing.  You
   * can customize this behavior by including `duration` (in milliseconds) and
   * `easing` options (see {@link module:ol/easing}).
   *
   * To chain together multiple animations, call the method with multiple
   * animation objects.  For example, to first zoom and then pan:
   *
   *     view.animate({zoom: 10}, {center: [0, 0]});
   *
   * If you provide a function as the last argument to the animate method, it
   * will get called at the end of an animation series.  The callback will be
   * called with `true` if the animation series completed on its own or `false`
   * if it was cancelled.
   *
   * Animations are cancelled by user interactions (e.g. dragging the map) or by
   * calling `view.setCenter()`, `view.setResolution()`, or `view.setRotation()`
   * (or another method that calls one of these).
   *
   * @param {...(AnimationOptions|function(boolean): void)} var_args Animation
   *     options.  Multiple animations can be run in series by passing multiple
   *     options objects.  To run multiple animations in parallel, call the method
   *     multiple times.  An optional callback can be provided as a final
   *     argument.  The callback will be called with a boolean indicating whether
   *     the animation completed without being cancelled.
   * @api
   */
  animate(t) {
    this.isDef() && !this.getAnimating() && this.resolveConstraints(0);
    const e = new Array(arguments.length);
    for (let i = 0; i < e.length; ++i) {
      let r = arguments[i];
      r.center && (r = Object.assign({}, r), r.center = Fe(
        r.center,
        this.getProjection()
      )), r.anchor && (r = Object.assign({}, r), r.anchor = Fe(
        r.anchor,
        this.getProjection()
      )), e[i] = r;
    }
    this.animateInternal.apply(this, e);
  }
  /**
   * @param {...(AnimationOptions|function(boolean): void)} var_args Animation options.
   */
  animateInternal(t) {
    let e = arguments.length, i;
    e > 1 && typeof arguments[e - 1] == "function" && (i = arguments[e - 1], --e);
    let r = 0;
    for (; r < e && !this.isDef(); ++r) {
      const c = arguments[r];
      c.center && this.setCenterInternal(c.center), c.zoom !== void 0 ? this.setZoom(c.zoom) : c.resolution && this.setResolution(c.resolution), c.rotation !== void 0 && this.setRotation(c.rotation);
    }
    if (r === e) {
      i && Gi(i, !0);
      return;
    }
    let s = Date.now(), o = (
      /** @type {import("./coordinate.js").Coordinate} */
      /** @type {import("./coordinate.js").Coordinate} */
      this.targetCenter_.slice()
    ), A = this.targetResolution_, a = (
      /** @type {number} */
      this.targetRotation_
    );
    const g = [];
    for (; r < e; ++r) {
      const c = (
        /** @type {AnimationOptions} */
        arguments[r]
      ), u = (
        /** @type {Animation} */
        {
          start: s,
          complete: !1,
          anchor: c.anchor,
          duration: c.duration !== void 0 ? c.duration : 1e3,
          easing: c.easing || eh,
          callback: i
        }
      );
      if (c.center && (u.sourceCenter = o, u.targetCenter = c.center.slice(), o = u.targetCenter), c.zoom !== void 0 ? (u.sourceResolution = A, u.targetResolution = this.getResolutionForZoom(c.zoom), A = u.targetResolution) : c.resolution && (u.sourceResolution = A, u.targetResolution = c.resolution, A = u.targetResolution), c.rotation !== void 0) {
        u.sourceRotation = a;
        const h = ws(c.rotation - a + Math.PI, 2 * Math.PI) - Math.PI;
        u.targetRotation = a + h, a = u.targetRotation;
      }
      lh(u) ? u.complete = !0 : s += u.duration, g.push(u);
    }
    this.animations_.push(g), this.setHint(je.ANIMATING, 1), this.updateAnimations_();
  }
  /**
   * Determine if the view is being animated.
   * @return {boolean} The view is being animated.
   * @api
   */
  getAnimating() {
    return this.hints_[je.ANIMATING] > 0;
  }
  /**
   * Determine if the user is interacting with the view, such as panning or zooming.
   * @return {boolean} The view is being interacted with.
   * @api
   */
  getInteracting() {
    return this.hints_[je.INTERACTING] > 0;
  }
  /**
   * Cancel any ongoing animations.
   * @api
   */
  cancelAnimations() {
    this.setHint(je.ANIMATING, -this.hints_[je.ANIMATING]);
    let t;
    for (let e = 0, i = this.animations_.length; e < i; ++e) {
      const r = (
        /** @type {Array<Animation>} */
        this.animations_[e]
      );
      if (
        /** @type {Animation} */
        r[0].callback && Gi(
          /** @type {Animation} */
          r[0].callback,
          !1
        ), !t
      )
        for (let s = 0, o = r.length; s < o; ++s) {
          const A = r[s];
          if (!A.complete) {
            t = A.anchor;
            break;
          }
        }
    }
    this.animations_.length = 0, this.cancelAnchor_ = t, this.nextCenter_ = null, this.nextResolution_ = NaN, this.nextRotation_ = NaN;
  }
  /**
   * Update all animations.
   */
  updateAnimations_() {
    if (this.updateAnimationKey_ !== void 0 && (cancelAnimationFrame(this.updateAnimationKey_), this.updateAnimationKey_ = void 0), !this.getAnimating())
      return;
    const t = Date.now();
    let e = !1;
    for (let i = this.animations_.length - 1; i >= 0; --i) {
      const r = (
        /** @type {Array<Animation>} */
        this.animations_[i]
      );
      let s = !0;
      for (let o = 0, A = r.length; o < A; ++o) {
        const a = r[o];
        if (a.complete)
          continue;
        const g = t - a.start;
        let c = a.duration > 0 ? g / a.duration : 1;
        c >= 1 ? (a.complete = !0, c = 1) : s = !1;
        const u = a.easing(c);
        if (a.sourceCenter) {
          const h = a.sourceCenter[0], p = a.sourceCenter[1], m = (
            /** @type {import("./coordinate.js").Coordinate} */
            a.targetCenter[0]
          ), l = (
            /** @type {import("./coordinate.js").Coordinate} */
            a.targetCenter[1]
          );
          this.nextCenter_ = /** @type {import("./coordinate.js").Coordinate} */
          a.targetCenter;
          const I = h + u * (m - h), C = p + u * (l - p);
          this.targetCenter_ = [I, C];
        }
        if (a.sourceResolution && a.targetResolution) {
          const h = u === 1 ? a.targetResolution : a.sourceResolution + u * (a.targetResolution - a.sourceResolution);
          if (a.anchor) {
            const p = this.getViewportSize_(this.getRotation()), m = (
              /** @type {Constraints} */
              this.constraints_.resolution(h, 0, p, !0)
            );
            this.targetCenter_ = this.calculateCenterZoom(
              /** @type {number} */
              m,
              /** @type {import("./coordinate.js").Coordinate} */
              a.anchor
            );
          }
          this.nextResolution_ = a.targetResolution, this.targetResolution_ = h, this.applyTargetState_(!0);
        }
        if (a.sourceRotation !== void 0 && a.targetRotation !== void 0) {
          const h = u === 1 ? ws(a.targetRotation + Math.PI, 2 * Math.PI) - Math.PI : a.sourceRotation + u * (a.targetRotation - a.sourceRotation);
          if (a.anchor) {
            const p = (
              /** @type {Constraints} */
              this.constraints_.rotation(h, !0)
            );
            this.targetCenter_ = this.calculateCenterRotate(
              /** @type {number} */
              p,
              /** @type {import("./coordinate.js").Coordinate} */
              a.anchor
            );
          }
          this.nextRotation_ = a.targetRotation, this.targetRotation_ = h;
        }
        if (this.applyTargetState_(!0), e = !0, !a.complete)
          break;
      }
      if (s) {
        this.animations_[i] = null, this.setHint(je.ANIMATING, -1), this.nextCenter_ = null, this.nextResolution_ = NaN, this.nextRotation_ = NaN;
        const o = r[0].callback;
        o && Gi(o, !0);
      }
    }
    this.animations_ = this.animations_.filter(Boolean), e && this.updateAnimationKey_ === void 0 && (this.updateAnimationKey_ = requestAnimationFrame(
      this.updateAnimations_.bind(this)
    ));
  }
  /**
   * @param {number} rotation Target rotation.
   * @param {import("./coordinate.js").Coordinate} anchor Rotation anchor.
   * @return {import("./coordinate.js").Coordinate|undefined} Center for rotation and anchor.
   */
  calculateCenterRotate(t, e) {
    let i;
    const r = this.getCenterInternal();
    return r !== void 0 && (i = [r[0] - e[0], r[1] - e[1]], Js(i, t - this.getRotation()), pl(i, e)), i;
  }
  /**
   * @param {number} resolution Target resolution.
   * @param {import("./coordinate.js").Coordinate} anchor Zoom anchor.
   * @return {import("./coordinate.js").Coordinate|undefined} Center for resolution and anchor.
   */
  calculateCenterZoom(t, e) {
    let i;
    const r = this.getCenterInternal(), s = this.getResolution();
    if (r !== void 0 && s !== void 0) {
      const o = e[0] - t * (e[0] - r[0]) / s, A = e[1] - t * (e[1] - r[1]) / s;
      i = [o, A];
    }
    return i;
  }
  /**
   * Returns the current viewport size.
   * @private
   * @param {number} [rotation] Take into account the rotation of the viewport when giving the size
   * @return {import("./size.js").Size} Viewport size or `[100, 100]` when no viewport is found.
   */
  getViewportSize_(t) {
    const e = this.viewportSize_;
    if (t) {
      const i = e[0], r = e[1];
      return [
        Math.abs(i * Math.cos(t)) + Math.abs(r * Math.sin(t)),
        Math.abs(i * Math.sin(t)) + Math.abs(r * Math.cos(t))
      ];
    }
    return e;
  }
  /**
   * Stores the viewport size on the view. The viewport size is not read every time from the DOM
   * to avoid performance hit and layout reflow.
   * This should be done on map size change.
   * Note: the constraints are not resolved during an animation to avoid stopping it
   * @param {import("./size.js").Size} [size] Viewport size; if undefined, [100, 100] is assumed
   */
  setViewportSize(t) {
    this.viewportSize_ = Array.isArray(t) ? t.slice() : [100, 100], this.getAnimating() || this.resolveConstraints(0);
  }
  /**
   * Get the view center.
   * @return {import("./coordinate.js").Coordinate|undefined} The center of the view.
   * @observable
   * @api
   */
  getCenter() {
    const t = this.getCenterInternal();
    return t && $o(t, this.getProjection());
  }
  /**
   * Get the view center without transforming to user projection.
   * @return {import("./coordinate.js").Coordinate|undefined} The center of the view.
   */
  getCenterInternal() {
    return (
      /** @type {import("./coordinate.js").Coordinate|undefined} */
      this.get(Ce.CENTER)
    );
  }
  /**
   * @return {Constraints} Constraints.
   */
  getConstraints() {
    return (
      /** @type {Constraints} */
      this.constraints_
    );
  }
  /**
   * @return {boolean} Resolution constraint is set
   */
  getConstrainResolution() {
    return this.get("constrainResolution");
  }
  /**
   * @param {Array<number>} [hints] Destination array.
   * @return {Array<number>} Hint.
   */
  getHints(t) {
    return t !== void 0 ? (t[0] = this.hints_[0], t[1] = this.hints_[1], t) : this.hints_.slice();
  }
  /**
   * Calculate the extent for the current view state and the passed box size.
   * @param {import("./size.js").Size} [size] The pixel dimensions of the box
   * into which the calculated extent should fit. Defaults to the size of the
   * map the view is associated with.
   * If no map or multiple maps are connected to the view, provide the desired
   * box size (e.g. `map.getSize()`).
   * @return {import("./extent.js").Extent} Extent.
   * @api
   */
  calculateExtent(t) {
    const e = this.calculateExtentInternal(t);
    return Kl(e, this.getProjection());
  }
  /**
   * @param {import("./size.js").Size} [size] Box pixel size. If not provided,
   * the map's last known viewport size will be used.
   * @return {import("./extent.js").Extent} Extent.
   */
  calculateExtentInternal(t) {
    t = t || this.getViewportSizeMinusPadding_();
    const e = (
      /** @type {!import("./coordinate.js").Coordinate} */
      this.getCenterInternal()
    );
    Xe(e, "The view center is not defined");
    const i = (
      /** @type {!number} */
      this.getResolution()
    );
    Xe(i !== void 0, "The view resolution is not defined");
    const r = (
      /** @type {!number} */
      this.getRotation()
    );
    return Xe(r !== void 0, "The view rotation is not defined"), Al(e, i, r, t);
  }
  /**
   * Get the maximum resolution of the view.
   * @return {number} The maximum resolution of the view.
   * @api
   */
  getMaxResolution() {
    return (
      /** @type {number} */
      this.maxResolution_
    );
  }
  /**
   * Get the minimum resolution of the view.
   * @return {number} The minimum resolution of the view.
   * @api
   */
  getMinResolution() {
    return (
      /** @type {number} */
      this.minResolution_
    );
  }
  /**
   * Get the maximum zoom level for the view.
   * @return {number} The maximum zoom level.
   * @api
   */
  getMaxZoom() {
    return (
      /** @type {number} */
      this.getZoomForResolution(
        /** @type {number} */
        this.minResolution_
      )
    );
  }
  /**
   * Set a new maximum zoom level for the view.
   * @param {number} zoom The maximum zoom level.
   * @api
   */
  setMaxZoom(t) {
    this.applyOptions_(this.getUpdatedOptions_({ maxZoom: t }));
  }
  /**
   * Get the minimum zoom level for the view.
   * @return {number} The minimum zoom level.
   * @api
   */
  getMinZoom() {
    return (
      /** @type {number} */
      this.getZoomForResolution(
        /** @type {number} */
        this.maxResolution_
      )
    );
  }
  /**
   * Set a new minimum zoom level for the view.
   * @param {number} zoom The minimum zoom level.
   * @api
   */
  setMinZoom(t) {
    this.applyOptions_(this.getUpdatedOptions_({ minZoom: t }));
  }
  /**
   * Set whether the view should allow intermediary zoom levels.
   * @param {boolean} enabled Whether the resolution is constrained.
   * @api
   */
  setConstrainResolution(t) {
    this.applyOptions_(this.getUpdatedOptions_({ constrainResolution: t }));
  }
  /**
   * Get the view projection.
   * @return {import("./proj/Projection.js").default} The projection of the view.
   * @api
   */
  getProjection() {
    return (
      /** @type {import("./proj/Projection.js").default} */
      this.projection_
    );
  }
  /**
   * Get the view resolution.
   * @return {number|undefined} The resolution of the view.
   * @observable
   * @api
   */
  getResolution() {
    return (
      /** @type {number|undefined} */
      this.get(Ce.RESOLUTION)
    );
  }
  /**
   * Get the resolutions for the view. This returns the array of resolutions
   * passed to the constructor of the View, or undefined if none were given.
   * @return {Array<number>|undefined} The resolutions of the view.
   * @api
   */
  getResolutions() {
    return this.resolutions_;
  }
  /**
   * Get the resolution for a provided extent (in map units) and size (in pixels).
   * @param {import("./extent.js").Extent} extent Extent.
   * @param {import("./size.js").Size} [size] Box pixel size.
   * @return {number} The resolution at which the provided extent will render at
   *     the given size.
   * @api
   */
  getResolutionForExtent(t, e) {
    return this.getResolutionForExtentInternal(
      Di(t, this.getProjection()),
      e
    );
  }
  /**
   * Get the resolution for a provided extent (in map units) and size (in pixels).
   * @param {import("./extent.js").Extent} extent Extent.
   * @param {import("./size.js").Size} [size] Box pixel size.
   * @return {number} The resolution at which the provided extent will render at
   *     the given size.
   */
  getResolutionForExtentInternal(t, e) {
    e = e || this.getViewportSizeMinusPadding_();
    const i = Qs(t) / e[0], r = gi(t) / e[1];
    return Math.max(i, r);
  }
  /**
   * Return a function that returns a value between 0 and 1 for a
   * resolution. Exponential scaling is assumed.
   * @param {number} [power] Power.
   * @return {function(number): number} Resolution for value function.
   */
  getResolutionForValueFunction(t) {
    t = t || 2;
    const e = (
      /** @type {number} */
      this.getConstrainedResolution(
        /** @type {number} */
        this.maxResolution_
      )
    ), i = (
      /** @type {number} */
      this.minResolution_
    ), r = Math.log(e / i) / Math.log(t);
    return (
      /**
       * @param {number} value Value.
       * @return {number} Resolution.
       */
      (function(s) {
        return e / Math.pow(t, s * r);
      })
    );
  }
  /**
   * Get the view rotation.
   * @return {number} The rotation of the view in radians.
   * @observable
   * @api
   */
  getRotation() {
    return (
      /** @type {number} */
      this.get(Ce.ROTATION)
    );
  }
  /**
   * Return a function that returns a resolution for a value between
   * 0 and 1. Exponential scaling is assumed.
   * @param {number} [power] Power.
   * @return {function(number): number} Value for resolution function.
   */
  getValueForResolutionFunction(t) {
    const e = Math.log(t || 2), i = (
      /** @type {number} */
      this.getConstrainedResolution(
        /** @type {number} */
        this.maxResolution_
      )
    ), r = (
      /** @type {number} */
      this.minResolution_
    ), s = Math.log(i / r) / e;
    return (
      /**
       * @param {number} resolution Resolution.
       * @return {number} Value.
       */
      (function(o) {
        return Math.log(i / o) / e / s;
      })
    );
  }
  /**
   * Returns the size of the viewport minus padding.
   * @private
   * @param {number} [rotation] Take into account the rotation of the viewport when giving the size
   * @return {import("./size.js").Size} Viewport size reduced by the padding.
   */
  getViewportSizeMinusPadding_(t) {
    let e = this.getViewportSize_(t);
    const i = this.padding_;
    return i && (e = [
      e[0] - i[1] - i[3],
      e[1] - i[0] - i[2]
    ]), e;
  }
  /**
   * @return {State} View state.
   */
  getState() {
    const t = this.getProjection(), e = this.getResolution(), i = this.getRotation();
    let r = (
      /** @type {import("./coordinate.js").Coordinate} */
      this.getCenterInternal()
    );
    const s = this.padding_;
    if (s) {
      const o = this.getViewportSizeMinusPadding_();
      r = Qr(
        r,
        this.getViewportSize_(),
        [o[0] / 2 + s[3], o[1] / 2 + s[0]],
        /** @type {number} */
        e,
        i
      );
    }
    return {
      center: r.slice(0),
      projection: (
        /** @type {import("./proj/Projection.js").default} */
        t !== void 0 ? t : null
      ),
      resolution: (
        /** @type {number} */
        e
      ),
      nextCenter: (
        /** @type {import("./coordinate.js").Coordinate|undefined} */
        /** @type {unknown} */
        this.nextCenter_
      ),
      nextResolution: this.nextResolution_,
      nextRotation: this.nextRotation_,
      rotation: i,
      zoom: (
        /** @type {number} */
        this.getZoom()
      )
    };
  }
  /**
   * @return {ViewStateLayerStateExtent} Like `FrameState`, but just `viewState` and `extent`.
   */
  getViewStateAndExtent() {
    return {
      viewState: this.getState(),
      extent: this.calculateExtent()
    };
  }
  /**
   * Get the current zoom level. This method may return non-integer zoom levels
   * if the view does not constrain the resolution, or if an interaction or
   * animation is underway.
   * @return {number|undefined} Zoom.
   * @api
   */
  getZoom() {
    let t;
    const e = this.getResolution();
    return e !== void 0 && (t = this.getZoomForResolution(e)), t;
  }
  /**
   * Get the zoom level for a resolution.
   * @param {number} resolution The resolution.
   * @return {number|undefined} The zoom level for the provided resolution.
   * @api
   */
  getZoomForResolution(t) {
    let e = this.minZoom_ || 0, i, r;
    if (this.resolutions_) {
      const s = LA(this.resolutions_, t, 1);
      e = s, i = this.resolutions_[s], s == this.resolutions_.length - 1 ? r = 2 : r = i / this.resolutions_[s + 1];
    } else
      i = /** @type {number} */
      this.maxResolution_, r = /** @type {number} */
      this.zoomFactor_;
    return e + Math.log(
      /** @type {number} */
      i / t
    ) / Math.log(
      /** @type {number} */
      r
    );
  }
  /**
   * Get the resolution for a zoom level.
   * @param {number} zoom Zoom level.
   * @return {number} The view resolution for the provided zoom level.
   * @api
   */
  getResolutionForZoom(t) {
    if (this.resolutions_?.length) {
      if (this.resolutions_.length === 1)
        return this.resolutions_[0];
      const e = fe(
        Math.floor(t),
        0,
        this.resolutions_.length - 2
      ), i = this.resolutions_[e] / this.resolutions_[e + 1];
      return this.resolutions_[e] / Math.pow(i, fe(t - e, 0, 1));
    }
    return (
      /** @type {number} */
      this.maxResolution_ / Math.pow(
        /** @type {number} */
        this.zoomFactor_,
        t - /** @type {number} */
        this.minZoom_
      )
    );
  }
  /**
   * Fit the given geometry or extent based on the given map size and border.
   * The size is pixel dimensions of the box to fit the extent into.
   * In most cases you will want to use the map size, that is `map.getSize()`.
   * Takes care of the map angle.
   * @param {import("./geom/SimpleGeometry.js").default|import("./extent.js").Extent} geometryOrExtent The geometry or
   *     extent to fit the view to.
   * @param {FitOptions} [options] Options.
   * @api
   */
  fit(t, e) {
    let i;
    if (Xe(
      Array.isArray(t) || typeof /** @type {?} */
      t.getSimplifiedGeometry == "function",
      "Invalid extent or geometry provided as `geometry`"
    ), Array.isArray(t)) {
      Xe(
        !UA(t),
        "Cannot fit empty extent provided as `geometry`"
      );
      const r = Di(t, this.getProjection());
      i = ra(r);
    } else if (t.getType() === "Circle") {
      const r = Di(
        t.getExtent(),
        this.getProjection()
      );
      i = ra(r), i.rotate(this.getRotation(), er(r));
    } else {
      const r = Yl();
      r ? i = /** @type {import("./geom/SimpleGeometry.js").default} */
      t.clone().transform(r, this.getProjection()) : i = t;
    }
    this.fitInternal(i, e);
  }
  /**
   * Calculate rotated extent
   * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
   * @return {import("./extent.js").Extent} The rotated extent for the geometry.
   */
  rotatedExtentForGeometry(t) {
    const e = this.getRotation(), i = Math.cos(e), r = Math.sin(-e), s = t.getFlatCoordinates(), o = t.getStride();
    let A = 1 / 0, a = 1 / 0, g = -1 / 0, c = -1 / 0;
    for (let u = 0, h = s.length; u < h; u += o) {
      const p = s[u] * i - s[u + 1] * r, m = s[u] * r + s[u + 1] * i;
      A = Math.min(A, p), a = Math.min(a, m), g = Math.max(g, p), c = Math.max(c, m);
    }
    return [A, a, g, c];
  }
  /**
   * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
   * @param {FitOptions} [options] Options.
   */
  fitInternal(t, e) {
    e = e || {};
    let i = e.size;
    i || (i = this.getViewportSizeMinusPadding_());
    const r = e.padding !== void 0 ? e.padding : [0, 0, 0, 0], s = e.nearest !== void 0 ? e.nearest : !1;
    let o;
    e.minResolution !== void 0 ? o = e.minResolution : e.maxZoom !== void 0 ? o = this.getResolutionForZoom(e.maxZoom) : o = 0;
    const A = this.rotatedExtentForGeometry(t);
    let a = this.getResolutionForExtentInternal(A, [
      i[0] - r[1] - r[3],
      i[1] - r[0] - r[2]
    ]);
    a = isNaN(a) ? o : Math.max(a, o), a = /** @type {number} */
    this.getConstrainedResolution(a, s ? 0 : 1);
    const g = this.getRotation(), c = Math.sin(g), u = Math.cos(g), h = er(A);
    h[0] += (r[1] - r[3]) / 2 * a, h[1] += (r[0] - r[2]) / 2 * a;
    const p = h[0] * u - h[1] * c, m = h[1] * u + h[0] * c, l = this.getConstrainedCenter([p, m], a), I = e.callback ? e.callback : vs;
    e.duration !== void 0 ? this.animateInternal(
      {
        resolution: a,
        center: l,
        duration: e.duration,
        easing: e.easing
      },
      I
    ) : (this.targetResolution_ = a, this.targetCenter_ = l, this.applyTargetState_(!1, !0), Gi(I, !0));
  }
  /**
   * Center on coordinate and view position.
   * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("./size.js").Size} size Box pixel size.
   * @param {import("./pixel.js").Pixel} position Position on the view to center on.
   * @api
   */
  centerOn(t, e, i) {
    this.centerOnInternal(
      Fe(t, this.getProjection()),
      e,
      i
    );
  }
  /**
   * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("./size.js").Size} size Box pixel size.
   * @param {import("./pixel.js").Pixel} position Position on the view to center on.
   */
  centerOnInternal(t, e, i) {
    this.setCenterInternal(
      Qr(
        t,
        e,
        i,
        /** @type {number} */
        this.getResolution(),
        this.getRotation()
      )
    );
  }
  /**
   * Calculates the shift between map and viewport center.
   * @param {import("./coordinate.js").Coordinate} center Center.
   * @param {number} resolution Resolution.
   * @param {number} rotation Rotation.
   * @param {import("./size.js").Size} size Size.
   * @return {Array<number>|undefined} Center shift.
   */
  calculateCenterShift(t, e, i, r) {
    let s;
    const o = this.padding_;
    if (o && t) {
      const A = this.getViewportSizeMinusPadding_(-i), a = Qr(
        t,
        r,
        [A[0] / 2 + o[3], A[1] / 2 + o[0]],
        e,
        i
      );
      s = [
        t[0] - a[0],
        t[1] - a[1]
      ];
    }
    return s;
  }
  /**
   * @return {boolean} Is defined.
   */
  isDef() {
    return !!this.getCenterInternal() && this.getResolution() !== void 0;
  }
  /**
   * Adds relative coordinates to the center of the view. Any extent constraint will apply.
   * @param {import("./coordinate.js").Coordinate} deltaCoordinates Relative value to add.
   * @api
   */
  adjustCenter(t) {
    const e = $o(
      /** @type {import("./coordinate.js").Coordinate} */
      this.targetCenter_,
      this.getProjection()
    );
    this.setCenter([
      e[0] + t[0],
      e[1] + t[1]
    ]);
  }
  /**
   * Adds relative coordinates to the center of the view. Any extent constraint will apply.
   * @param {import("./coordinate.js").Coordinate} deltaCoordinates Relative value to add.
   */
  adjustCenterInternal(t) {
    const e = (
      /** @type {import("./coordinate.js").Coordinate} */
      this.targetCenter_
    );
    this.setCenterInternal([
      e[0] + t[0],
      e[1] + t[1]
    ]);
  }
  /**
   * Multiply the view resolution by a ratio, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} ratio The ratio to apply on the view resolution.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   * @api
   */
  adjustResolution(t, e) {
    e = e && Fe(e, this.getProjection()), this.adjustResolutionInternal(t, e);
  }
  /**
   * Multiply the view resolution by a ratio, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} ratio The ratio to apply on the view resolution.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  adjustResolutionInternal(t, e) {
    const i = this.getAnimating() || this.getInteracting(), r = this.getViewportSize_(this.getRotation()), s = (
      /** @type {Constraints} */
      this.constraints_.resolution(
        /** @type {number} */
        this.targetResolution_ * t,
        0,
        r,
        i
      )
    );
    e && (this.targetCenter_ = this.calculateCenterZoom(
      /** @type {number} */
      s,
      e
    )), this.targetResolution_ = /** @type {number} */
    this.targetResolution_ * t, this.applyTargetState_();
  }
  /**
   * Adds a value to the view zoom level, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} delta Relative value to add to the zoom level.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   * @api
   */
  adjustZoom(t, e) {
    this.adjustResolution(
      Math.pow(
        /** @type {number} */
        this.zoomFactor_,
        -t
      ),
      e
    );
  }
  /**
   * Adds a value to the view rotation, optionally using an anchor. Any rotation
   * constraint will apply.
   * @param {number} delta Relative value to add to the zoom rotation, in radians.
   * @param {import("./coordinate.js").Coordinate} [anchor] The rotation center.
   * @api
   */
  adjustRotation(t, e) {
    e && (e = Fe(e, this.getProjection())), this.adjustRotationInternal(t, e);
  }
  /**
   * @param {number} delta Relative value to add to the zoom rotation, in radians.
   * @param {import("./coordinate.js").Coordinate} [anchor] The rotation center.
   */
  adjustRotationInternal(t, e) {
    const i = this.getAnimating() || this.getInteracting(), r = (
      /** @type {Constraints} */
      this.constraints_.rotation(
        /** @type {number} */
        this.targetRotation_ + t,
        i
      )
    );
    e && (this.targetCenter_ = this.calculateCenterRotate(
      /** @type {number} */
      r,
      e
    )), this.targetRotation_ = /** @type {number} */
    this.targetRotation_ + t, this.applyTargetState_();
  }
  /**
   * Set the center of the current view. Any extent constraint will apply.
   * @param {import("./coordinate.js").Coordinate|undefined} center The center of the view.
   * @observable
   * @api
   */
  setCenter(t) {
    this.setCenterInternal(
      t && Fe(t, this.getProjection())
    );
  }
  /**
   * Set the center using the view projection (not the user projection).
   * @param {import("./coordinate.js").Coordinate|null|undefined} center The center of the view.
   */
  setCenterInternal(t) {
    this.targetCenter_ = t, this.applyTargetState_();
  }
  /**
   * @param {import("./ViewHint.js").default} hint Hint.
   * @param {number} delta Delta.
   * @return {number} New value.
   */
  setHint(t, e) {
    return this.hints_[t] += e, this.changed(), this.hints_[t];
  }
  /**
   * Set the resolution for this view. Any resolution constraint will apply.
   * @param {number|undefined} resolution The resolution of the view.
   * @observable
   * @api
   */
  setResolution(t) {
    this.targetResolution_ = t, this.applyTargetState_();
  }
  /**
   * Set the rotation for this view. Any rotation constraint will apply.
   * @param {number} rotation The rotation of the view in radians.
   * @observable
   * @api
   */
  setRotation(t) {
    this.targetRotation_ = t, this.applyTargetState_();
  }
  /**
   * Zoom to a specific zoom level. Any resolution constrain will apply.
   * @param {number} zoom Zoom level.
   * @api
   */
  setZoom(t) {
    this.setResolution(this.getResolutionForZoom(t));
  }
  /**
   * Recompute rotation/resolution/center based on target values.
   * Note: we have to compute rotation first, then resolution and center considering that
   * parameters can influence one another in case a view extent constraint is present.
   * @param {boolean} [doNotCancelAnims] Do not cancel animations.
   * @param {boolean} [forceMoving] Apply constraints as if the view is moving.
   * @private
   */
  applyTargetState_(t, e) {
    const i = this.getAnimating() || this.getInteracting() || e, r = (
      /** @type {Constraints} */
      this.constraints_.rotation(
        /** @type {number} */
        this.targetRotation_,
        i
      )
    ), s = this.getViewportSize_(r), o = (
      /** @type {Constraints} */
      this.constraints_.resolution(
        /** @type {number} */
        this.targetResolution_,
        0,
        s,
        i
      )
    ), A = (
      /** @type {Constraints} */
      this.constraints_.center(
        /** @type {import("./coordinate.js").Coordinate|undefined} */
        this.targetCenter_,
        /** @type {number} */
        o,
        s,
        i,
        /** @type {import("./coordinate.js").Coordinate} */
        this.calculateCenterShift(
          /** @type {import("./coordinate.js").Coordinate} */
          this.targetCenter_,
          /** @type {number} */
          o,
          /** @type {number} */
          r,
          s
        )
      )
    );
    this.get(Ce.ROTATION) !== r && this.set(Ce.ROTATION, r), this.get(Ce.RESOLUTION) !== o && (this.set(Ce.RESOLUTION, o), this.set("zoom", this.getZoom(), !0)), (!A || !this.get(Ce.CENTER) || !nr(this.get(Ce.CENTER), A)) && this.set(Ce.CENTER, A), this.getAnimating() && !t && this.cancelAnimations(), this.cancelAnchor_ = void 0;
  }
  /**
   * If any constraints need to be applied, an animation will be triggered.
   * This is typically done on interaction end.
   * Note: calling this with a duration of 0 will apply the constrained values straight away,
   * without animation.
   * @param {number} [duration] The animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  resolveConstraints(t, e, i) {
    t = t !== void 0 ? t : 200;
    const r = e || 0, s = (
      /** @type {Constraints} */
      this.constraints_.rotation(
        /** @type {number} */
        this.targetRotation_
      )
    ), o = this.getViewportSize_(s), A = (
      /** @type {Constraints} */
      this.constraints_.resolution(
        /** @type {number} */
        this.targetResolution_,
        r,
        o
      )
    ), a = (
      /** @type {Constraints} */
      this.constraints_.center(
        /** @type {import("./coordinate.js").Coordinate|undefined} */
        this.targetCenter_,
        /** @type {number} */
        A,
        o,
        !1,
        /** @type {import("./coordinate.js").Coordinate} */
        this.calculateCenterShift(
          /** @type {import("./coordinate.js").Coordinate} */
          this.targetCenter_,
          /** @type {number} */
          A,
          /** @type {number} */
          s,
          o
        )
      )
    );
    if (t === 0 && !this.cancelAnchor_) {
      this.targetResolution_ = A, this.targetRotation_ = s, this.targetCenter_ = a, this.applyTargetState_();
      return;
    }
    i = i || (t === 0 ? this.cancelAnchor_ : void 0), this.cancelAnchor_ = void 0, (this.getResolution() !== A || this.getRotation() !== s || !this.getCenterInternal() || !nr(
      /** @type {import("./coordinate.js").Coordinate} */
      this.getCenterInternal(),
      /** @type {import("./coordinate.js").Coordinate} */
      a
    )) && (this.getAnimating() && this.cancelAnimations(), this.animateInternal({
      rotation: s,
      center: a,
      resolution: A,
      duration: t,
      easing: pr,
      anchor: i
    }));
  }
  /**
   * Notify the View that an interaction has started.
   * The view state will be resolved to a stable one if needed
   * (depending on its constraints).
   * @api
   */
  beginInteraction() {
    this.resolveConstraints(0), this.setHint(je.INTERACTING, 1);
  }
  /**
   * Notify the View that an interaction has ended. The view state will be resolved
   * to a stable one if needed (depending on its constraints).
   * @param {number} [duration] Animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   * @api
   */
  endInteraction(t, e, i) {
    i = i && Fe(i, this.getProjection()), this.endInteractionInternal(t, e, i);
  }
  /**
   * Notify the View that an interaction has ended. The view state will be resolved
   * to a stable one if needed (depending on its constraints).
   * @param {number} [duration] Animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  endInteractionInternal(t, e, i) {
    this.getInteracting() && (this.setHint(je.INTERACTING, -1), this.resolveConstraints(t, e, i));
  }
  /**
   * Get a valid position for the view center according to the current constraints.
   * @param {import("./coordinate.js").Coordinate|undefined} targetCenter Target center position.
   * @param {number} [targetResolution] Target resolution. If not supplied, the current one will be used.
   * This is useful to guess a valid center position at a different zoom level.
   * @return {import("./coordinate.js").Coordinate|undefined} Valid center position.
   */
  getConstrainedCenter(t, e) {
    const i = this.getViewportSize_(this.getRotation());
    return (
      /** @type {Constraints} */
      this.constraints_.center(
        t,
        e || /** @type {number} */
        this.getResolution(),
        i
      )
    );
  }
  /**
   * Get a valid zoom level according to the current view constraints.
   * @param {number|undefined} targetZoom Target zoom.
   * @param {number} [direction] Indicate which resolution should be used
   * by a renderer if the view resolution does not match any resolution of the tile source.
   * If 0, the nearest resolution will be used. If 1, the nearest lower resolution
   * will be used. If -1, the nearest higher resolution will be used.
   * @return {number|undefined} Valid zoom level.
   */
  getConstrainedZoom(t, e) {
    const i = this.getResolutionForZoom(
      /** @type {number} */
      t
    );
    return this.getZoomForResolution(
      /** @type {number} */
      this.getConstrainedResolution(i, e)
    );
  }
  /**
   * Get a valid resolution according to the current view constraints.
   * @param {number|undefined} targetResolution Target resolution.
   * @param {number} [direction] Indicate which resolution should be used
   * by a renderer if the view resolution does not match any resolution of the tile source.
   * If 0, the nearest resolution will be used. If 1, the nearest lower resolution
   * will be used. If -1, the nearest higher resolution will be used.
   * @return {number|undefined} Valid resolution.
   */
  getConstrainedResolution(t, e) {
    e = e || 0;
    const i = this.getViewportSize_(this.getRotation());
    return (
      /** @type {Constraints} */
      this.constraints_.resolution(
        t,
        e,
        i
      )
    );
  }
}
function Gi(n, t) {
  setTimeout(function() {
    n(t);
  }, 0);
}
function Ah(n) {
  if (n.extent !== void 0) {
    const e = n.smoothExtentConstraint !== void 0 ? n.smoothExtentConstraint : !0;
    return _a(
      n.extent,
      /** @type {boolean} */
      n.constrainOnlyCenter,
      e
    );
  }
  const t = (
    /** @type {import("./proj/Projection.js").default} */
    to(n.projection, "EPSG:3857")
  );
  if (n.multiWorld !== !0 && t.isGlobal()) {
    const e = t.getExtent().slice();
    return e[0] = -1 / 0, e[2] = 1 / 0, _a(e, !1, !1);
  }
  return $I;
}
function gh(n) {
  let t, e, i, o = n.minZoom !== void 0 ? n.minZoom : Hr, A = n.maxZoom !== void 0 ? n.maxZoom : 28;
  const a = n.zoomFactor !== void 0 ? n.zoomFactor : 2, g = n.multiWorld !== void 0 ? n.multiWorld : !1, c = n.smoothResolutionConstraint !== void 0 ? n.smoothResolutionConstraint : !0, u = n.showFullExtent !== void 0 ? n.showFullExtent : !1, h = (
    /** @type {import("./proj/Projection.js").default} */
    to(n.projection, "EPSG:3857")
  ), p = h.getExtent();
  let m = n.constrainOnlyCenter, l = n.extent;
  if (!g && !l && h.isGlobal() && (m = !1, l = p), n.resolutions !== void 0) {
    const I = n.resolutions;
    e = I[o], i = I[A] !== void 0 ? I[A] : I[I.length - 1], n.constrainResolution ? t = ih(
      I,
      c,
      /** @type {import("./extent.js").Extent|undefined} */
      !m && l,
      u
    ) : t = ka(
      e,
      i,
      c,
      /** @type {import("./extent.js").Extent|undefined} */
      !m && l,
      u
    );
  } else {
    const C = (p ? Math.max(Qs(p), gi(p)) : (
      // use an extent that can fit the whole world if need be
      360 * /** @type {number} */
      XA.degrees / /** @type {number} */
      h.getMetersPerUnit()
    )) / ah / Math.pow(2, Hr), d = C / Math.pow(2, 28 - Hr);
    e = n.maxResolution, e !== void 0 ? o = 0 : e = C / Math.pow(a, o), i = n.minResolution, i === void 0 && (n.maxZoom !== void 0 ? n.maxResolution !== void 0 ? i = e / Math.pow(a, A) : i = C / Math.pow(a, A) : i = d), A = o + Math.floor(
      Math.log(e / i) / Math.log(a)
    ), i = e / Math.pow(a, A - o), n.constrainResolution ? t = rh(
      a,
      e,
      i,
      c,
      /** @type {import("./extent.js").Extent|undefined} */
      !m && l,
      u
    ) : t = ka(
      e,
      i,
      c,
      /** @type {import("./extent.js").Extent|undefined} */
      !m && l,
      u
    );
  }
  return {
    constraint: t,
    maxResolution: e,
    minResolution: i,
    minZoom: o,
    zoomFactor: a
  };
}
function ch(n) {
  if (n.enableRotation !== void 0 ? n.enableRotation : !0) {
    const e = n.constrainRotation;
    return e === void 0 || e === !0 ? oh() : e === !1 ? Ra : typeof e == "number" ? sh(e) : Ra;
  }
  return uo;
}
function lh(n) {
  return !(n.sourceCenter && n.targetCenter && !nr(n.sourceCenter, n.targetCenter) || n.sourceResolution !== n.targetResolution || n.sourceRotation !== n.targetRotation);
}
function Qr(n, t, e, i, r) {
  const s = Math.cos(-r);
  let o = Math.sin(-r), A = n[0] * s - n[1] * o, a = n[1] * s + n[0] * o;
  A += (t[0] / 2 - e[0]) * i, a += (e[1] - t[1] / 2) * i, o = -o;
  const g = A * s - a * o, c = a * s + A * o;
  return [g, c];
}
const uh = {
  /**
   * Triggered before layers are composed.  When dispatched by the map, the event object will not have
   * a `context` set.  When dispatched by a layer, the event object will have a `context` set.  Only
   * WebGL layers currently dispatch this event.
   * @event module:ol/render/Event~RenderEvent#precompose
   * @api
   */
  PRECOMPOSE: "precompose"
}, ft = {
  OPACITY: "opacity",
  VISIBLE: "visible",
  EXTENT: "extent",
  Z_INDEX: "zIndex",
  MAX_RESOLUTION: "maxResolution",
  MIN_RESOLUTION: "minResolution",
  MAX_ZOOM: "maxZoom",
  MIN_ZOOM: "minZoom",
  SOURCE: "source",
  MAP: "map"
};
class Ih extends jn {
  /**
   * @param {Options<NoInfer<Properties>>} options Layer options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, this.background_ = t.background;
    const e = Object.assign({}, t);
    typeof t.properties == "object" && (delete e.properties, Object.assign(e, t.properties)), e[ft.OPACITY] = t.opacity !== void 0 ? t.opacity : 1, Xe(
      typeof e[ft.OPACITY] == "number",
      "Layer opacity must be a number"
    ), e[ft.VISIBLE] = t.visible !== void 0 ? t.visible : !0, e[ft.Z_INDEX] = t.zIndex, e[ft.MAX_RESOLUTION] = t.maxResolution !== void 0 ? t.maxResolution : 1 / 0, e[ft.MIN_RESOLUTION] = t.minResolution !== void 0 ? t.minResolution : 0, e[ft.MIN_ZOOM] = t.minZoom !== void 0 ? t.minZoom : -1 / 0, e[ft.MAX_ZOOM] = t.maxZoom !== void 0 ? t.maxZoom : 1 / 0, this.className_ = e.className !== void 0 ? e.className : "ol-layer", delete e.className, this.setProperties(e), this.state_ = null;
  }
  /**
   * Get the background for this layer.
   * @return {BackgroundColor|false|undefined} Layer background.
   */
  getBackground() {
    return this.background_;
  }
  /**
   * @return {string} CSS class name.
   */
  getClassName() {
    return this.className_;
  }
  /**
   * This method is not meant to be called by layers or layer renderers because the state
   * is incorrect if the layer is included in a layer group.
   *
   * @param {boolean} [managed] Layer is managed.
   * @return {import("./Layer.js").State} Layer state.
   */
  getLayerState(t) {
    const e = this.state_ || /** @type {?} */
    {
      layer: this,
      managed: t === void 0 ? !0 : t
    }, i = this.getZIndex();
    return e.opacity = fe(Math.round(this.getOpacity() * 100) / 100, 0, 1), e.visible = this.getVisible(), e.extent = this.getExtent(), e.zIndex = i === void 0 && !e.managed ? 1 / 0 : i, e.maxResolution = this.getMaxResolution(), e.minResolution = Math.max(this.getMinResolution(), 0), e.minZoom = this.getMinZoom(), e.maxZoom = this.getMaxZoom(), this.state_ = e, e;
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").default>} [array] Array of layers (to be
   *     modified in place).
   * @return {Array<import("./Layer.js").default>} Array of layers.
   */
  getLayersArray(t) {
    return Jt();
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").State>} [states] Optional list of layer
   *     states (to be modified in place).
   * @return {Array<import("./Layer.js").State>} List of layer states.
   */
  getLayerStatesArray(t) {
    return Jt();
  }
  /**
   * Return the {@link module:ol/extent~Extent extent} of the layer or `undefined` if it
   * will be visible regardless of extent.
   * @return {import("../extent.js").Extent|undefined} The layer extent.
   * @observable
   * @api
   */
  getExtent() {
    return (
      /** @type {import("../extent.js").Extent|undefined} */
      this.get(ft.EXTENT)
    );
  }
  /**
   * Return the maximum resolution of the layer. Returns Infinity if
   * the layer has no maximum resolution set.
   * @return {number} The maximum resolution of the layer.
   * @observable
   * @api
   */
  getMaxResolution() {
    return (
      /** @type {number} */
      this.get(ft.MAX_RESOLUTION)
    );
  }
  /**
   * Return the minimum resolution of the layer. Returns 0 if
   * the layer has no minimum resolution set.
   * @return {number} The minimum resolution of the layer.
   * @observable
   * @api
   */
  getMinResolution() {
    return (
      /** @type {number} */
      this.get(ft.MIN_RESOLUTION)
    );
  }
  /**
   * Return the minimum zoom level of the layer. Returns -Infinity if
   * the layer has no minimum zoom set.
   * @return {number} The minimum zoom level of the layer.
   * @observable
   * @api
   */
  getMinZoom() {
    return (
      /** @type {number} */
      this.get(ft.MIN_ZOOM)
    );
  }
  /**
   * Return the maximum zoom level of the layer. Returns Infinity if
   * the layer has no maximum zoom set.
   * @return {number} The maximum zoom level of the layer.
   * @observable
   * @api
   */
  getMaxZoom() {
    return (
      /** @type {number} */
      this.get(ft.MAX_ZOOM)
    );
  }
  /**
   * Return the opacity of the layer (between 0 and 1).
   * @return {number} The opacity of the layer.
   * @observable
   * @api
   */
  getOpacity() {
    return (
      /** @type {number} */
      this.get(ft.OPACITY)
    );
  }
  /**
   * @abstract
   * @return {import("../source/Source.js").State} Source state.
   */
  getSourceState() {
    return Jt();
  }
  /**
   * Return the value of this layer's `visible` property. To find out whether the layer
   * is visible on a map, use `isVisible()` instead.
   * @return {boolean} The value of the `visible` property of the layer.
   * @observable
   * @api
   */
  getVisible() {
    return (
      /** @type {boolean} */
      this.get(ft.VISIBLE)
    );
  }
  /**
   * Return the Z-index of the layer, which is used to order layers before
   * rendering. Returns undefined if the layer is unmanaged.
   * @return {number|undefined} The Z-index of the layer.
   * @observable
   * @api
   */
  getZIndex() {
    return (
      /** @type {number|undefined} */
      this.get(ft.Z_INDEX)
    );
  }
  /**
   * Sets the background color.
   * @param {BackgroundColor|undefined} [background] Background color.
   */
  setBackground(t) {
    this.background_ = t, this.changed();
  }
  /**
   * Set the extent at which the layer is visible.  If `undefined`, the layer
   * will be visible at all extents.
   * @param {import("../extent.js").Extent|undefined} extent The extent of the layer.
   * @observable
   * @api
   */
  setExtent(t) {
    this.set(ft.EXTENT, t);
  }
  /**
   * Set the maximum resolution at which the layer is visible.
   * @param {number} maxResolution The maximum resolution of the layer.
   * @observable
   * @api
   */
  setMaxResolution(t) {
    this.set(ft.MAX_RESOLUTION, t);
  }
  /**
   * Set the minimum resolution at which the layer is visible.
   * @param {number} minResolution The minimum resolution of the layer.
   * @observable
   * @api
   */
  setMinResolution(t) {
    this.set(ft.MIN_RESOLUTION, t);
  }
  /**
   * Set the maximum zoom (exclusive) at which the layer is visible.
   * Note that the zoom levels for layer visibility are based on the
   * view zoom level, which may be different from a tile source zoom level.
   * @param {number} maxZoom The maximum zoom of the layer.
   * @observable
   * @api
   */
  setMaxZoom(t) {
    this.set(ft.MAX_ZOOM, t);
  }
  /**
   * Set the minimum zoom (inclusive) at which the layer is visible.
   * Note that the zoom levels for layer visibility are based on the
   * view zoom level, which may be different from a tile source zoom level.
   * @param {number} minZoom The minimum zoom of the layer.
   * @observable
   * @api
   */
  setMinZoom(t) {
    this.set(ft.MIN_ZOOM, t);
  }
  /**
   * Set the opacity of the layer, allowed values range from 0 to 1.
   * @param {number} opacity The opacity of the layer.
   * @observable
   * @api
   */
  setOpacity(t) {
    Xe(typeof t == "number", "Layer opacity must be a number"), this.set(ft.OPACITY, t);
  }
  /**
   * Set the visibility of the layer (`true` or `false`).
   * @param {boolean} visible The visibility of the layer.
   * @observable
   * @api
   */
  setVisible(t) {
    this.set(ft.VISIBLE, t);
  }
  /**
   * Set Z-index of the layer, which is used to order layers before rendering.
   * The default Z-index is 0.
   * @param {number} zindex The z-index of the layer.
   * @observable
   * @api
   */
  setZIndex(t) {
    this.set(ft.Z_INDEX, t);
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.state_ && (this.state_.layer = /** @type {?} */
    null, this.state_ = null), super.disposeInternal();
  }
}
class xg extends Ih {
  /**
   * @param {Options<SourceType, NoInfer<Properties>>} options Layer options.
   */
  constructor(t) {
    const e = Object.assign({}, t);
    delete e.source, super(e), this.on, this.once, this.un, this.mapPrecomposeKey_ = null, this.mapRenderKey_ = null, this.sourceChangeKey_ = null, this.renderer_ = null, this.sourceReady_ = !1, this.rendered = !1, t.render && (this.render = t.render), t.map && this.setMap(t.map), this.addChangeListener(
      ft.SOURCE,
      this.handleSourcePropertyChange_
    );
    const i = t.source ? (
      /** @type {SourceType} */
      t.source
    ) : null;
    this.setSource(i);
  }
  /**
   * @param {Array<import("./Layer.js").default>} [array] Array of layers (to be modified in place).
   * @return {Array<import("./Layer.js").default>} Array of layers.
   * @override
   */
  getLayersArray(t) {
    return t = t || [], t.push(this), t;
  }
  /**
   * @param {Array<import("./Layer.js").State>} [states] Optional list of layer states (to be modified in place).
   * @return {Array<import("./Layer.js").State>} List of layer states.
   * @override
   */
  getLayerStatesArray(t) {
    return t = t || [], t.push(this.getLayerState()), t;
  }
  /**
   * Get the layer source.
   * @return {SourceType|null} The layer source (or `null` if not yet set).
   * @observable
   * @api
   */
  getSource() {
    return (
      /** @type {SourceType} */
      this.get(ft.SOURCE) || null
    );
  }
  /**
   * @return {SourceType|null} The source being rendered.
   */
  getRenderSource() {
    return this.getSource();
  }
  /**
   * @return {import("../source/Source.js").State} Source state.
   * @override
   */
  getSourceState() {
    const t = this.getSource();
    return t ? t.getState() : "undefined";
  }
  /**
   * @private
   */
  handleSourceChange_() {
    this.changed();
    const t = this.getSource();
    !t || this.sourceReady_ || t.getState() !== "ready" || (this.sourceReady_ = !0, this.dispatchEvent("sourceready"));
  }
  /**
   * @private
   */
  handleSourcePropertyChange_() {
    this.sourceChangeKey_ && (si(this.sourceChangeKey_), this.sourceChangeKey_ = null), this.sourceReady_ = !1;
    const t = this.getSource();
    t && (this.sourceChangeKey_ = Sn(
      t,
      Ve.CHANGE,
      this.handleSourceChange_,
      this
    ), t.getState() === "ready" && (this.sourceReady_ = !0, setTimeout(() => {
      this.dispatchEvent("sourceready");
    }, 0))), this.changed();
  }
  /**
   * @param {import("../pixel.js").Pixel} pixel Pixel.
   * @return {Promise<Array<import("../Feature.js").FeatureLike>>} Promise that resolves with
   * an array of features.
   */
  getFeatures(t) {
    return this.renderer_ ? this.renderer_.getFeatures(t) : Promise.resolve([]);
  }
  /**
   * @param {import("../pixel.js").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray|Uint8Array|Float32Array|DataView|null} Pixel data.
   */
  getData(t) {
    return !this.renderer_ || !this.rendered ? null : this.renderer_.getData(t);
  }
  /**
   * The layer is visible on the map view, i.e. within its min/max resolution or zoom and
   * extent, not set to `visible: false`, and not inside a layer group that is set
   * to `visible: false`.
   * @param {View|import("../View.js").ViewStateLayerStateExtent} [view] View or {@link import("../Map.js").FrameState}.
   * Only required when the layer is not added to a map.
   * @return {boolean} The layer is visible in the map view.
   * @api
   */
  isVisible(t) {
    let e;
    const i = this.getMapInternal();
    !t && i && (t = i.getView()), t instanceof Pa ? e = {
      viewState: t.getState(),
      extent: t.calculateExtent()
    } : e = t;
    const r = (
      /** @type {import("../View.js").ViewStateLayerStateExtent} */
      e
    );
    !r.layerStatesArray && i && (r.layerStatesArray = i.getLayerGroup().getLayerStatesArray());
    let s;
    if (r.layerStatesArray) {
      if (s = r.layerStatesArray.find(
        (A) => A.layer === this
      ), !s)
        return !1;
    } else
      s = this.getLayerState();
    const o = this.getExtent();
    return hh(s, r.viewState) && (!o || Ys(o, r.extent));
  }
  /**
   * Get the attributions of the source of this layer for the given view.
   * @param {View|import("../View.js").ViewStateLayerStateExtent} [view] View or {@link import("../Map.js").FrameState}.
   * Only required when the layer is not added to a map.
   * @return {Array<string>} Attributions for this layer at the given view.
   * @api
   */
  getAttributions(t) {
    if (!this.isVisible(t))
      return [];
    const e = this.getSource()?.getAttributions();
    if (!e)
      return [];
    const i = t instanceof Pa ? t.getViewStateAndExtent() : t;
    let r = e(
      /** @type {import("../View.js").ViewStateLayerStateExtent} */
      i
    );
    return Array.isArray(r) || (r = [r]), r;
  }
  /**
   * In charge to manage the rendering of the layer. One layer type is
   * bounded with one layer renderer.
   * @param {?import("../Map.js").FrameState} frameState Frame state.
   * @param {HTMLElement} target Target which the renderer may (but need not) use
   * for rendering its content.
   * @return {HTMLElement|null} The rendered element.
   */
  render(t, e) {
    const i = (
      /** @type {RendererType} */
      this.getRenderer()
    );
    return i.prepareFrame(
      /** @type {import("../Map.js").FrameState} */
      t
    ) ? (this.rendered = !0, i.renderFrame(
      /** @type {import("../Map.js").FrameState} */
      t,
      e
    )) : null;
  }
  /**
   * Called when a layer is not visible during a map render.
   */
  unrender() {
    this.rendered = !1;
  }
  /** @return {string|undefined} Declutter */
  getDeclutter() {
  }
  /**
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @param {import("../layer/Layer.js").State} layerState Layer state.
   */
  renderDeclutter(t, e) {
  }
  /**
   * When the renderer follows a layout -> render approach, do the final rendering here.
   * @param {import('../Map.js').FrameState} frameState Frame state
   */
  renderDeferred(t) {
    const e = this.getRenderer();
    e && e.renderDeferred(t);
  }
  /**
   * For use inside the library only.
   * @param {import("../Map.js").default|null} map Map.
   */
  setMapInternal(t) {
    t || this.unrender(), this.set(ft.MAP, t);
  }
  /**
   * For use inside the library only.
   * @return {import("../Map.js").default|null} Map.
   */
  getMapInternal() {
    return this.get(ft.MAP);
  }
  /**
   * Sets the layer to be rendered on top of other layers on a map. The map will
   * not manage this layer in its layers collection. This
   * is useful for temporary layers. To remove an unmanaged layer from the map,
   * use `#setMap(null)`.
   *
   * To add the layer to a map and have it managed by the map, use
   * {@link module:ol/Map~Map#addLayer} instead.
   * @param {import("../Map.js").default|null} map Map.
   * @api
   */
  setMap(t) {
    this.mapPrecomposeKey_ && (si(this.mapPrecomposeKey_), this.mapPrecomposeKey_ = null), t || this.changed(), this.mapRenderKey_ && (si(this.mapRenderKey_), this.mapRenderKey_ = null), t && (this.mapPrecomposeKey_ = Sn(
      t,
      uh.PRECOMPOSE,
      /** @type {import("../events.js").ListenerFunction} */
      this.handlePrecompose_,
      this
    ), this.mapRenderKey_ = Sn(this, Ve.CHANGE, t.render, t), this.changed());
  }
  /**
   * @param {import("../events/Event.js").default} renderEvent Render event
   * @private
   */
  handlePrecompose_(t) {
    const e = (
      /** @type {import("../render/Event.js").default} */
      t.frameState?.layerStatesArray
    );
    if (!e)
      return;
    const i = this.getLayerState(!1);
    Xe(
      !e.some(
        (r) => r.layer === i.layer
      ),
      "A layer can only be added to the map once. Use either `layer.setMap()` or `map.addLayer()`, not both."
    ), e.push(i);
  }
  /**
   * Set the layer source.
   * @param {SourceType|null} source The layer source.
   * @observable
   * @api
   */
  setSource(t) {
    this.set(ft.SOURCE, t);
  }
  /**
   * Get the renderer for this layer.
   * @return {RendererType|null} The layer renderer.
   */
  getRenderer() {
    return this.renderer_ || (this.renderer_ = this.createRenderer()), this.renderer_;
  }
  /**
   * @return {boolean} The layer has a renderer.
   */
  hasRenderer() {
    return !!this.renderer_;
  }
  /**
   * Create a renderer for this layer.
   * @return {RendererType} A layer renderer.
   * @protected
   */
  createRenderer() {
    return (
      /** @type {RendererType} */
      /** @type {unknown} */
      null
    );
  }
  /**
   * This will clear the renderer so that a new one can be created next time it is needed
   */
  clearRenderer() {
    this.renderer_ && (this.renderer_.dispose(), delete this.renderer_);
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.clearRenderer(), this.setSource(null), super.disposeInternal();
  }
}
function hh(n, t) {
  if (!n.visible)
    return !1;
  const e = t.resolution;
  if (e < n.minResolution || e >= n.maxResolution)
    return !1;
  const i = t.zoom;
  return i > n.minZoom && i <= n.maxZoom;
}
function Ch(n) {
  const t = n && typeof n.getPixelRatio == "function" ? n.getPixelRatio() : typeof window < "u" && window.devicePixelRatio || 1;
  return typeof t == "number" && Number.isFinite(t) && t > 0 ? t : 1;
}
function Mg(n, t, e) {
  const i = Ch(n);
  return Math.abs(t.width / i - e[0]) < 1 && Math.abs(t.height / i - e[1]) < 1;
}
class fh extends xg {
  constructor(t) {
    let e;
    const i = function(r) {
      const s = this.getSource(), o = s.mapboxMap;
      if (!o)
        return console.error("MapboxLayer: mapboxMap is undefined!"), null;
      s.style !== e && (o.setStyle(s.style), e = s.style);
      const A = o.getCanvas(), a = r.viewState, g = this.getVisible();
      A.style.display = g ? "block" : "none";
      const c = this.getOpacity();
      A.style.opacity = c, A.style.position = "absolute", A.style.left = "0", A.style.top = "0";
      let u = !1;
      if (r.size) {
        const [d, x] = r.size;
        Mg(o, A, [d, x]) || (o.resize(), u = !0);
      }
      const h = a.rotation * -180 / Math.PI, p = lr(a.center), m = a.zoom - 1, l = o.getBearing(), I = o.getCenter().toArray(), C = o.getZoom();
      return !u && h == l && p[0] == I[0] && p[1] == I[1] && m == C || (h != l && o.rotateTo(h, {
        animate: !1
      }), (p[0] != I[0] || p[1] != I[1] || m != C) && o.jumpTo({
        center: p,
        zoom: m,
        animate: !1
      }), o._frame && (o._frame.cancel(), o._frame = null), o._render()), A;
    };
    super({
      render: i,
      source: t.source
    });
  }
}
class dh extends xg {
  constructor(t) {
    let e;
    const i = function(r) {
      const s = this.getSource(), o = s.maplibreMap;
      if (!o)
        return console.error("MapLibreLayer: maplibreMap is undefined!"), null;
      s.style !== e && (o.setStyle(s.style), e = s.style);
      const A = o.getCanvas(), a = r.viewState, g = this.getVisible();
      A.style.display = g ? "block" : "none";
      const c = this.getOpacity();
      A.style.opacity = c;
      const h = -a.rotation * 180 / Math.PI, p = o.getBearing();
      Math.abs(h - p) > 0.01 && (o.stop(), o.setBearing(h));
      const m = lr(a.center), l = a.zoom - 1;
      if ((o.getCenter().toArray().toString() !== m.toString() || o.getZoom() !== l) && o.jumpTo({
        center: m,
        zoom: l,
        animate: !1
      }), o._frame && (o._frame.cancel(), o._frame = null), r.size) {
        const [I, C] = r.size;
        Mg(o, A, [I, C]) || o.resize();
      }
      return o._render(), Math.abs(o.getZoom() - l) > 0.01 && o.setZoom(l), A.style.position = "absolute", A.style.left = "0", A.style.top = "0", A;
    };
    super({
      render: i,
      source: t.source
    });
  }
}
const Sg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAxMS0xMC0yNlQyMTo1MjoxOFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAxMS0xMC0yN1QxNzo0MjowN1o8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgkVIwmwAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTM5jWRgMAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTAvMjYvMTHjwOqVAAARQHByVld4nMWbB3wURdvAd6/u3V6/27sts/PMQQhFpEU6SlNBRXqTfgkkQOhFSigHIgIWkJqAIJ1QBCz0KkJoQYrSQaQjioBKC+XezWU5fH2/3+/L8fu+fWd3bubZKf95nnlmdjeX2/dk602qD9UnooRc5YjkKp9KyIrkZikfkazcSFaWcuZmpUZScyOpWcqZm6rkU3OTIpGk3EhSViQpVTlzk5IiSUm5VCRC5UaorAiVqpy5VFKESspND6UY03O6U0oYGHo3NCg0ODSj59BQRmhYaHhoaDofFsJiGIVfC78e/hnOwwW4CI1Ttve/AlehLClH6oTrhl8N1wu3CIcFKhqWiwVpWvrG9EcjmXC2nC/1Sd+dHgonh1PCpxQ5nN4pfHHk3qGzOlFUepiiPk5PC/cO9wn3DfcL59deGOqWXC95Saigp/fCY8Lvh0e9Xm94q3DBlXLd2qm5kmRpSrdw9/CEqNwneWQ4HH6hXul6FHVs5Gfh2eGbI6eFp0fLxoZqhE/KC6P5Oa9lhzN7ymofy5PN4anhCRlfFpSVXxNeG26UQf0jyBSO5R1UcjTdF/3c8o+a66j11AbqhCrtpvZQe6lzqnSRukRdjtU8Q52lfqJuqNJt6g/qTzW/ltpKbaO2U99SO9QrF6j71AMqL9b2OvUr9VtMYmgLbaU9dIHkpwM0r+YdtJN20W76ytOa/zZWjpZpTANdNlr7NJVEv0RXpCtFpR+panR1ugZdPCodoGrTdei69MNou3p0ffoN+k36aT+rqcZqfheVQzWiW9HUP0Kn6BVEJ9DF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zV6+JT3q/K+UUkoppZ5Tl9rnzXTvZS/51pTrIJewYX0bzb5r+vfUX7X2ebU/rDnUmslszXqN0v99bSO/80ff/EtrIayb9PNrKMs56kf84zG7v5Te6HqW1yytUb8m7mzNaVbmv4r9stz7I1/WPPKc9sIzuc6ebST3XjlnDZd7OSawd7MmvNs6y5nriXWP9WbWmvq6UoX3Ota9TCttV8f0GZBXXqMep8R6JfdJl73upTKfo+6XbG+j/s9aG7ZmP75rNPZXvNzHLegjrPOtCT9WL+yXY17/tyH3IRB7GXXMtcq0VabZ8xrZt/8TQZzR/ZH/R2U+R33+P8X/GX/2/pB24py9GY74M//JWBN+ar36nJd7Avh6VKf0QbdPXs/yyrDRPhP3sz9znXmPynyutvB/30cpn1CmPC8x1jF+MpbRnteGn1Ivwhg3+I8AG9O+EHNt938fc3KP8pj/+X8i8yj1+93/szKfq2P+z7kdO/R+knUt9fEpfYO/iMs8tlX4MbtnGLbk/TrnYcZw4mLntDV7nfgz9yiPlYN/a/EhbSdtyp7ZyP+jMp/zLsh+W9YpfUffzrpij9FYRdxMr+fX/dn7wZpwwpbqlWHUg7mk+zfn8tE3GM/350Z59TDaQN+LTBsTP/Oelbn3tUtoab1APb70v1JKKaWUUkoppZRSSl1NOxERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERGRO+Qfh5eOajemXSYAAAFTbWtCVPrOyv4Af1WJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4nO3W4WmDYBSGUQdxEQdxEBdxEAdxEQexvIELt6Yh/4oJ54FDm0/7601szlOSJEmSJEmSJEmSJEmSJEmSJEkf0XEc577vT+c5y7V397+6T/dvXddzHMdzmqbHz+wY/Sz31L11FsuyPF7HMAx/vod077JjlX2zYXatzfs9tX/VN7/+je5ftut7Vjnrn+V6nX37xtm/ul7T/ctzvu9f/9fneX7aP9fs/31l23ru1+/btv36zPfnv/2/r/oe1/er90Cu1Xf7nEXVnx3Xa5IkSZIkSZIk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b24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+zWqGFQAACShJREFUWIWVmGusXFUVx39r73POzJy5M3fmPtrblj7p7btYGigGmojExISHQQ0miDFA4lc0SCBRNH4gRhNJ/aIfNAIxUkKIkMgjBBKMCHwQEGKhpbS39HXfve+5M3fmnr23H84+M7e1PDyTlbPPnDl7//da//Vf64zwBQ9jjCilAiDyFgIaUP4nFjDAMtACWtbaRGvtPmte59Lb8gUW137hGCgDFaDkrzMwrABRBxaAWWDeX7esteZyoD4XSJIkorXO+cV7gQFg9fMvLdz74bHm+hOnTP/QsOmeaxBYoJTDbF2n5wa36At7d+XOfOOW0uPAmLcpYN4Y0wyC4LIeuiwQ55wC8kA/sHF62tz5+F/mDz7zytKOTxpBMKsCEq1BCWjBiQAOcRAYQylpcWW0bG6/Kf/Rvd/rfmP1Kn0YOANMAksiYj8XiAcRew9se/ZvtR8/+seFr3xQj3QtDHGhQCCIFtAqDYxI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", Tg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACC2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjE8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KD0UqkwAACBNJREFUWAnNWN9vXMUVPmfm3l3vrtdeO3FA4ATiEtEI4iSKigQvpUlfeEDqQ5F44al/VJ8r+lCJhz4lLUQqQn2goLqRINBIAYfQWBBMbMfLen/dmdPvm7t3s01QE9QHeuzxzJ0f53zznTPnzrXI/4noo+MwlRdlrrl30Cl87JgLjUy0JqqZBImFxJE6P/DR3+27/R356LG+iMZH1f9wIK+Zb3/c7Qy8W1Wxk1HsbAyyIiqZmGYmlqtZEKcjGI1O9a6qXQGGqzXLbvXmWndkQ8cPA/RfgJiTc7vtfFA7bhYvRJN1c9qUlheZz0XqUI2m5FARTISmCpReEOmOBaaHTuNmnsulbKTXu6fae/KWYvD75fuBnLO8UfSPFGF8PkQ9bzU/L8s1kWVMd1BEAEkAoBI26QjWNNdF2QWgXtH3zj50an8aDhZvyWc6xMgD8iCQZ6xen98/Fkb66xjstB2pe3k8KxkAlgSkWkUmKsNVNFSACIYM7QXRr0bmnHzh1P1+1G5dl/cV8fOfUqkse8FEPew/HYb6G+hdsycaKkcwpYFhgmCZZYOG6JLKKJpTVgiM/Sycs40w2hndAZjfjoeta/czQ6InYq4x7j+WmCCINYB4HCDmMcyyjHIU5TjKkyjzGKujzKFNcCx4LNtAweccNcLJLaCczCSu1A4h3t6ot7pPCTaNGVMB5xNBYBaD7EJyx2pTZQFamxhroRxCeRaYVyfPPdRbKJ/D0LeYV5u4iCxQFHM9Hqz0U4Q/XcvE/dRL/EaOyUh+1Qq930HN7XKB4AhSXrYs3z1YCyH8PMXEISinO1gIhiDOoH6SRlHzoB6mEfT3YJD0kwG6YFYwXTzmxSiaYe4xFf1ZQ+OHg/Wg9qw8Y3uVizAq0u52OxbCL63h27ICbCSNhcqXUMgEQPyhabKBzME6gaKrOF6DRR5nuqlax7UUgnEEDWmY+DNe7GheL4K92mj2V8qBtCVzg4FbRZJ6TpYAghxxF6lwMQrdAyZOoDobovwEdWKGbDF+CKACMwWEPbKPgBIzYI66EGv+LOIl2iry4FoVK07WbzfUwnOWaUsWsaoCwMWUAQpjAu64jmrDO7mGOrmnzKUJlAMYB0OOriMYFraR8ByTHtqefdiUh6vtcJ4V0V6UwX4bvZI1x+2FkQvr0gQI0J7yBEfIJvPEXSjZQhsx8TrcQ0ORALYRfNuoR9gpDXLnHnNz9KMrxc3ISWTQMoYaYAggHBmEuKfgom+L4/XMlpDhdrKQhwUbg7AGNJEFFgoXszD18HQQ4a5JpCKsdLdRf1V249VXzk2BiTbwG8FCpQMYMayvXMwaogAS/yHNaFnJSAxuDupzybEAv1MhCCpjoPGIDqCMxps4ipw0xEkgvsQEarbxgk4osFbZz3jjZLjTM5e0cGrACsn2T4CtaLUsiw0etkxcgde4zyYHGV0ToWKCYYwwT5AZAHJzGAADiYUKBGtKwoE/dGk1xn4Ylw6GsQnGTtpAG/OQZoGdcB8wz757QiCET2HAVSk9LUUfDaPtZ48sQWBdqMCh9gDh+MIkILqxIAjUM4JzlBWAWMAIY3oipGMys2JmDAMEgKIBiggSShMIKicYLokYw9yEYzLH4cgqIoGnKlIH2e1BX7SoptyeZM7HARLf2MawGGdhzoCZdLspQ1DCE1LRTxAEw2fOobBmYIMFXcHcBSgBEAegyFkStqAfl6kiuvQmdn7s9/Fq2JE+RqE/FWKYNtIDO8odQ2dJFiazzZNCoARRuYjPbCMO3GFMaiPAeVrARtJG0zdN1OTAacGbi7iDvLuPS8vHcgAgVMyZFaDU4LSJVGMVNr7UuHNc31LN8Ocz9Di8ND1eltoBKjCjdDxZhCNsF9Nu4NLk5cbQFE/cCy65Zv6qFnbADOq4M7qIvk4CI/AdcwF/pkBpsCoEMMK8IQokHVMEqCyVIDzZYLrn8D5C6BNclrbHReb0fZlbKBkB1liv2RZuUP+UbSQOnPWU/UhtqbdsVEZRp2TFHDNbGHKg3jEmZkAkl8xNNoWNGpKg/bUQ5/SWqt+sLtb0pnzn5vc082/rfujKFg5RohV+7Xj4Fkowi2k7BSuMpzt5BYwKGKi4KPlFJKxDmLx4jwmdgDBk4/g12LhciG2OR5nqpf5BY5vLKTxMeJPpeHxuZzMvsvfC9eEr0vFen4dSJrKArMikRna4MTIFf3vmBFLOY4mgVGROmQcAngyMK9/IjAkIGYy3oeoDfABd7uNjQD7y6j6t7iKcUwJha2Opmz3f/ws+nFbjRv+0LjfUn0TAzIMKxg1PBwW2yEBiCkaVYPhCm7x9qVGr1z+WGE4ImbBrJsU7cEmQL5HH/9jLWjtUV8k9IIiVft2+rhfdt+D7NpCvyRBgXgAKZkbePZDeU2qvwTDdgZ2n1z7aSqYyMEDQFLBg35Ugwt8IAh1fju6ouTeHvdZNsMEQn0rJ3fQRDX5O4HKLS/RrMcZTenbOZ+dz5AMYW4RyBmNiAXOxDUcANE4QFMYO44GH8hvg+TM+Rt+FO6LcdNG9+WifE1RE4QcWbvRFKC7gQvYL6/iWX6+JfwnB24FBAEpgyAoLgRAANi1gQfbweCVI8QEC89Zo4M3+DpdcHA4X/jUbF5g5lQcZmQ7hk/PM3kJu+OQMAbd7OYWv3KY7moue8OKZtpfhIr7M+giG7SgB9xXZRL2Jk9ePQxfjjdzLxSzXz7pr7d0f/sk5BYPGj/8RPouG7fv+LaGhictMjfcJ3C/C//pvifut/WjP/wZbyT3jNC/KbwAAAABJRU5ErkJggg==", _g = "data:image/png;base64,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", kg = "data:image/png;base64,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", ph = new ye({
  image: new Ln({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: Sg
  })
}), mh = new ye({
  image: new Ln({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: Tg
  })
}), yh = new ye({
  image: new Ln({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: _g
  })
}), vh = new ye({
  fill: new ys({
    color: [128, 128, 256, 0.2]
  }),
  stroke: new ms({
    color: [128, 128, 256, 1],
    width: 3
  })
}), wh = new ye({
  image: new Ln({
    anchor: [0.5, 1],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: kg
  })
});
function Rg(n) {
  return n ? n instanceof ye ? n : typeof n == "string" ? new ye({
    image: new Ln({
      anchor: [0.5, 1],
      anchorXUnits: "fraction",
      anchorYUnits: "fraction",
      src: n
    })
  }) : new ye({
    image: new Ln(n)
  }) : wh;
}
class Ze extends zc {
  fakeGps;
  fakeRadius;
  geolocation;
  homePosition;
  northUp;
  tapDuration;
  homeMarginPixels;
  tapUIVanish;
  alwaysGpsOn;
  __ignore_first_move;
  constructor(t) {
    t = ve(t || {});
    const e = new Ri({
      source: new Pi({
        wrapX: !1
      })
    });
    e.set("name", "gps");
    const i = new Ri({
      source: new Pi({
        wrapX: !1
      })
    });
    i.set("name", "marker");
    const r = new Ri({
      source: new Pi({
        wrapX: !1
      })
    });
    r.set("name", "feature");
    const s = new Ri({
      source: new Pi({
        wrapX: !1
      })
    });
    s.set("name", "envelope");
    const o = Ze.spawnLayer(
      null,
      t.source,
      t.target
    ), A = new Uc();
    A.set("name", "overlay");
    const g = {
      controls: t.controls ? t.controls : [],
      layers: [
        o,
        A,
        s,
        r,
        e,
        i
      ],
      target: t.div,
      view: new TA({
        center: t.defaultCenter || [0, 0],
        zoom: t.defaultZoom || 2,
        rotation: t.defaultRotation || 0,
        multiWorld: !0
      })
    };
    t.interactions && (g.interactions = t.interactions), super(g), this.fakeGps = t.fakeGps, this.fakeRadius = t.fakeRadius, this.homePosition = t.homePosition, this.northUp = t.northUp, this.tapDuration = t.tapDuration, this.homeMarginPixels = t.homeMarginPixels, this.tapUIVanish = t.tapUIVanish, this.alwaysGpsOn = t.alwaysGpsOn || !1;
    const c = this.getView();
    this.__ignore_first_move = !0;
    const u = () => {
      this.__ignore_first_move || this.dispatchEvent("movestart"), this.__ignore_first_move = !1, c.un("propertychange", u);
    };
    c.on("propertychange", u), this.on("moveend", () => {
      c.on("propertychange", u);
    }), c.on("change:resolution", () => {
      this.getSource();
    });
  }
  // WMTS-like tile sources start their tile grid at source.minZoom. Rendering
  // them at view zooms far below that makes OpenLayers enumerate the whole
  // viewport in z=minZoom tiles (4^minZoom times the viewport), freezing the
  // renderer — and no tiles exist below minZoom anyway. Gate the layer at
  // minZoom - 4: within 4 levels the minZoom tiles are upscaled to fill the
  // view (enumeration stays within 256x the viewport), below that the layer is
  // simply hidden. The gate must be reset when the same layer is reused for a
  // source without such a grid (e.g. Maplat maps), hence the else branch.
  static applyWmtsZoomGate(t, e) {
    const i = e && typeof e.isWmts == "function" && e.isWmts() ? e.minZoom : void 0;
    typeof i == "number" && Number.isFinite(i) && i > 4 ? t.setMinZoom(i - 4) : t.setMinZoom(-1 / 0);
  }
  static spawnLayer(t, e, i) {
    return e instanceof ar || e instanceof Ar || !(t instanceof Nr) ? (e instanceof ar ? t = new fh({
      style: e.style,
      accessToken: e.accessToken,
      container: i,
      source: e
    }) : e instanceof Ar ? t = new dh({
      style: e.style,
      container: i,
      source: e
    }) : (t = new Nr({
      source: e
    }), Ze.applyWmtsZoomGate(t, e)), t.set("name", "base")) : (t.setSource(e), Ze.applyWmtsZoomGate(t, e)), t;
  }
  getLayer(t = "base") {
    const e = (i) => {
      const r = i.getArray().map((s) => {
        if (s.get("name") == t) return s;
        if (s.getLayers) return e(s.getLayers());
      }).filter((s) => s);
      if (r.length != 0)
        return r[0];
    };
    return e(this.getLayers());
  }
  getSource(t = "base") {
    const e = this.getLayer(t);
    if (e)
      return e.getSource();
  }
  setFeature(t, e, i) {
    const r = this.getSource(i), s = new _A(t);
    return e && s.setStyle(e), r.addFeature(s), s;
  }
  removeFeature(t, e) {
    this.getSource(e).removeFeature(t);
  }
  resetFeature(t) {
    this.getSource(t).clear();
  }
  setGPSPosition(t, e = void 0) {
    const i = e == "sub" ? yh : e == "hide" ? mh : ph;
    e != "sub" && this.resetFeature("gps"), t && (this.setFeature(
      {
        geometry: new Bn(t.xy)
      },
      i,
      "gps"
    ), e || this.setFeature(
      {
        geometry: new no(t.xy, t.rad)
      },
      vh,
      "gps"
    ));
  }
  setMarker(t, e, i, r) {
    return r || (r = "marker"), e.geometry = new Bn(t), this.setFeature(e, Rg(i), r);
  }
  resetMarker(t) {
    t || (t = "marker"), this.resetFeature(t);
  }
  setLine(t, e, i) {
    return this.setVector(t, "Line", e ? { stroke: e } : null, i);
  }
  setVector(t, e = "Line", i, r) {
    r || (r = "feature");
    const s = {};
    i.stroke != null && (s.stroke = new ms(i.stroke)), i.fill != null && (s.fill = new ys(i.fill));
    const o = new ye(s), A = e === "Line" ? new sr(t) : new rn(t);
    return this.setFeature(
      {
        geometry: A,
        name: e
      },
      o,
      r
    );
  }
  resetLine(t) {
    this.resetVector(t);
  }
  resetVector(t) {
    t || (t = "feature"), this.resetFeature(t);
  }
  setEnvelope(t, e, i) {
    return i || (i = "envelope"), this.setLine(t, e, i);
  }
  removeEnvelope(t, e) {
    e || (e = "envelope"), this.removeFeature(t, e);
  }
  resetEnvelope(t) {
    t || (t = "envelope"), this.resetFeature(t);
  }
  setFillEnvelope(t, e, i, r) {
    r || (r = "envelope");
    let s;
    if (e != null || i != null) {
      const o = {};
      e != null && (o.stroke = new ms(e)), i != null && (o.fill = new ys(i)), s = new ye(o);
    }
    return this.setFeature(
      {
        geometry: new rn([t])
      },
      s,
      r
    );
  }
  exchangeSource(t = void 0) {
    const e = this.getLayers(), i = e.item(0), r = Ze.spawnLayer(i, t, this.getTarget());
    r != i && e.setAt(0, r), t && t.setMap(this);
  }
  setLayer(t = void 0) {
    const e = this.getLayer("overlay").getLayers();
    if (e.clear(), t) {
      const i = new Nr({
        source: t
      });
      Ze.applyWmtsZoomGate(i, t), e.push(i);
    }
  }
  setTransparency(t) {
    const e = (100 - t) / 100, i = this.getSource();
    i instanceof Fn || i instanceof Os ? (this.getLayers().item(0).setOpacity(1), this.getLayers().item(1).setOpacity(e)) : this.getLayers().item(0).setOpacity(e);
  }
  setGPSMarker(t, e) {
    this.getLayers().item(0).getSource().setGPSMarker(t, e);
  }
}
const ri = {
  /**
   * A true double click, with no dragging.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#dblclick
   * @api
   */
  DBLCLICK: Ve.DBLCLICK,
  /**
   * Triggered when a pointer is dragged.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#pointerdrag
   * @api
   */
  POINTERDRAG: "pointerdrag",
  /**
   * Triggered when a pointer is moved. Note that on touch devices this is
   * triggered when the map is panned, so is not the same as mousemove.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#pointermove
   * @api
   */
  POINTERMOVE: "pointermove",
  POINTERDOWN: "pointerdown",
  POINTERUP: "pointerup"
}, Oa = {
  ACTIVE: "active"
};
class bi extends jn {
  /**
   * @param {InteractionOptions} [options] Options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t && t.handleEvent && (this.handleEvent = t.handleEvent), this.map_ = null, this.setActive(!0);
  }
  /**
   * Return whether the interaction is currently active.
   * @return {boolean} `true` if the interaction is active, `false` otherwise.
   * @observable
   * @api
   */
  getActive() {
    return (
      /** @type {boolean} */
      this.get(Oa.ACTIVE)
    );
  }
  /**
   * Get the map associated with this interaction.
   * @return {import("../Map.js").default|null} Map.
   * @api
   */
  getMap() {
    return this.map_;
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event}.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @api
   */
  handleEvent(t) {
    return !0;
  }
  /**
   * Activate or deactivate the interaction.
   * @param {boolean} active Active.
   * @observable
   * @api
   */
  setActive(t) {
    this.set(Oa.ACTIVE, t);
  }
  /**
   * Remove the interaction from its current map and attach it to the new map.
   * Subclasses may set up event handlers to get notified about changes to
   * the map here.
   * @param {import("../Map.js").default|null} map Map.
   */
  setMap(t) {
    this.map_ = t;
  }
}
function bh(n, t, e) {
  const i = n.getCenterInternal();
  if (i) {
    const r = [i[0] + t[0], i[1] + t[1]];
    n.animateInternal({
      duration: e !== void 0 ? e : 250,
      easing: nh,
      center: n.getConstrainedCenter(r)
    });
  }
}
function Io(n, t, e, i) {
  const r = n.getZoom();
  if (r === void 0)
    return;
  const s = n.getConstrainedZoom(r + t);
  if (s === void 0)
    return;
  const o = n.getResolutionForZoom(s);
  o !== void 0 && (n.getAnimating() && n.cancelAnimations(), n.animate({
    resolution: o,
    anchor: e,
    duration: i !== void 0 ? i : 250,
    easing: pr
  }));
}
const zi = {
  /**
   * Triggered when an item is added to the collection.
   * @event module:ol/Collection.CollectionEvent#add
   * @api
   */
  ADD: "add",
  /**
   * Triggered when an item is removed from the collection.
   * @event module:ol/Collection.CollectionEvent#remove
   * @api
   */
  REMOVE: "remove"
}, La = {
  LENGTH: "length"
};
class Ui extends Le {
  /**
   * @param {import("./CollectionEventType.js").default} type Type.
   * @param {T} element Element.
   * @param {number} index The index of the added or removed element.
   */
  constructor(t, e, i) {
    super(t), this.element = e, this.index = i;
  }
}
class Eh extends jn {
  /**
   * @param {Array<T>} [array] Array.
   * @param {Options} [options] Collection options.
   */
  constructor(t, e) {
    if (super(), this.on, this.once, this.un, e = e || {}, this.unique_ = !!e.unique, this.array_ = t ?? [], this.unique_)
      for (let i = 1, r = this.array_.length; i < r; ++i)
        this.assertUnique_(this.array_[i], i);
    this.updateLength_();
  }
  /**
   * Remove all elements from the collection.
   * @api
   */
  clear() {
    for (; this.getLength() > 0; )
      this.pop();
  }
  /**
   * Add elements to the collection.  This pushes each item in the provided array
   * to the end of the collection.
   * @param {!Array<T>} arr Array.
   * @return {Collection<T>} This collection.
   * @api
   */
  extend(t) {
    for (let e = 0, i = t.length; e < i; ++e)
      this.push(t[e]);
    return this;
  }
  /**
   * Iterate over each element, calling the provided callback.
   * @param {function(T, number, Array<T>): *} f The function to call
   *     for every element. This function takes 3 arguments (the element, the
   *     index and the array). The return value is ignored.
   * @api
   */
  forEach(t) {
    const e = this.array_;
    for (let i = 0, r = e.length; i < r; ++i)
      t(e[i], i, e);
  }
  /**
   * Get a reference to the underlying Array object. Warning: if the array
   * is mutated, no events will be dispatched by the collection, and the
   * collection's "length" property won't be in sync with the actual length
   * of the array.
   * @return {!Array<T>} Array.
   * @api
   */
  getArray() {
    return this.array_;
  }
  /**
   * Get the element at the provided index.
   * @param {number} index Index.
   * @return {T} Element.
   * @api
   */
  item(t) {
    return this.array_[t];
  }
  /**
   * Get the length of this collection.
   * @return {number} The length of the array.
   * @observable
   * @api
   */
  getLength() {
    return this.get(La.LENGTH);
  }
  /**
   * Insert an element at the provided index.
   * @param {number} index Index.
   * @param {T} elem Element.
   * @api
   */
  insertAt(t, e) {
    if (t < 0 || t > this.getLength())
      throw new Error("Index out of bounds: " + t);
    this.unique_ && this.assertUnique_(e), this.array_.splice(t, 0, e), this.updateLength_(), this.dispatchEvent(
      new Ui(zi.ADD, e, t)
    );
  }
  /**
   * Remove the last element of the collection and return it.
   * Return `undefined` if the collection is empty.
   * @return {T|undefined} Element.
   * @api
   */
  pop() {
    return this.removeAt(this.getLength() - 1);
  }
  /**
   * Insert the provided element at the end of the collection.
   * @param {T} elem Element.
   * @return {number} New length of the collection.
   * @api
   */
  push(t) {
    const e = this.getLength();
    return this.insertAt(e, t), this.getLength();
  }
  /**
   * Remove the first occurrence of an element from the collection.
   * @param {T} elem Element.
   * @return {T|undefined} The removed element or undefined if none found.
   * @api
   */
  remove(t) {
    const e = this.array_;
    for (let i = 0, r = e.length; i < r; ++i)
      if (e[i] === t)
        return this.removeAt(i);
  }
  /**
   * Remove the element at the provided index and return it.
   * Return `undefined` if the collection does not contain this index.
   * @param {number} index Index.
   * @return {T|undefined} Value.
   * @api
   */
  removeAt(t) {
    if (t < 0 || t >= this.getLength())
      return;
    const e = this.array_[t];
    return this.array_.splice(t, 1), this.updateLength_(), this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new Ui(zi.REMOVE, e, t)
    ), e;
  }
  /**
   * Set the element at the provided index.
   * @param {number} index Index.
   * @param {T} elem Element.
   * @api
   */
  setAt(t, e) {
    const i = this.getLength();
    if (t >= i) {
      this.insertAt(t, e);
      return;
    }
    if (t < 0)
      throw new Error("Index out of bounds: " + t);
    this.unique_ && this.assertUnique_(e, t);
    const r = this.array_[t];
    this.array_[t] = e, this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new Ui(zi.REMOVE, r, t)
    ), this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new Ui(zi.ADD, e, t)
    );
  }
  /**
   * @private
   */
  updateLength_() {
    this.set(La.LENGTH, this.array_.length);
  }
  /**
   * @private
   * @param {T} elem Element.
   * @param {number} [except] Optional index to ignore.
   */
  assertUnique_(t, e) {
    const i = this.array_;
    for (let r = 0, s = i.length; r < s; ++r)
      if (i[r] === t && r !== e)
        throw new Error("Duplicate item added to a unique collection");
  }
}
class xh {
  /**
   * @param {number} decay Rate of decay (must be negative).
   * @param {number} minVelocity Minimum velocity (pixels/millisecond).
   * @param {number} delay Delay to consider to calculate the kinetic
   *     initial values (milliseconds).
   */
  constructor(t, e, i) {
    this.decay_ = t, this.minVelocity_ = e, this.delay_ = i, this.points_ = [], this.angle_ = 0, this.initialVelocity_ = 0;
  }
  /**
   * FIXME empty description for jsdoc
   */
  begin() {
    this.points_.length = 0, this.angle_ = 0, this.initialVelocity_ = 0;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   */
  update(t, e) {
    this.points_.push(t, e, Date.now());
  }
  /**
   * @return {boolean} Whether we should do kinetic animation.
   */
  end() {
    if (this.points_.length < 6)
      return !1;
    const t = Date.now() - this.delay_, e = this.points_.length - 3;
    if (this.points_[e + 2] < t)
      return !1;
    let i = e - 3;
    for (; i > 0 && this.points_[i + 2] > t; )
      i -= 3;
    const r = this.points_[e + 2] - this.points_[i + 2];
    if (r < 1e3 / 60)
      return !1;
    const s = this.points_[e] - this.points_[i], o = this.points_[e + 1] - this.points_[i + 1];
    return this.angle_ = Math.atan2(o, s), this.initialVelocity_ = Math.sqrt(s * s + o * o) / r, this.initialVelocity_ > this.minVelocity_;
  }
  /**
   * @return {number} Total distance travelled (pixels).
   */
  getDistance() {
    return (this.minVelocity_ - this.initialVelocity_) / this.decay_;
  }
  /**
   * @return {number} Angle of the kinetic panning animation (radians).
   */
  getAngle() {
    return this.angle_;
  }
}
class Mh extends bi {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.delta_ = t.delta ? t.delta : 1, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} (if it was a
   * doubleclick) and eventually zooms the map.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @override
   */
  handleEvent(t) {
    let e = !1;
    if (t.type == ri.DBLCLICK) {
      const i = (
        /** @type {MouseEvent} */
        t.originalEvent
      ), r = t.map, s = t.coordinate, o = i.shiftKey ? -this.delta_ : this.delta_, A = r.getView();
      Io(A, o, s, this.duration_), i.preventDefault(), e = !0;
    }
    return !e;
  }
}
const sn = typeof navigator < "u" && typeof navigator.userAgent < "u" ? navigator.userAgent.toLowerCase() : "", Sh = sn.includes("safari") && !sn.includes("chrom");
Sh && (sn.includes("version/15.4") || /cpu (os|iphone os) 15_4 like mac os x/.test(sn));
const Th = sn.includes("webkit") && !sn.includes("edge"), Pg = sn.includes("macintosh");
typeof WorkerGlobalScope < "u" && typeof OffscreenCanvas < "u" && self instanceof WorkerGlobalScope;
(function() {
  let n = !1;
  try {
    const t = Object.defineProperty({}, "passive", {
      get: function() {
        n = !0;
      }
    });
    window.addEventListener("_", null, t), window.removeEventListener("_", null, t);
  } catch {
  }
  return n;
})();
function Ls(n) {
  const t = arguments;
  return function(e) {
    let i = !0;
    for (let r = 0, s = t.length; r < s && (i = i && t[r](e), !!i); ++r)
      ;
    return i;
  };
}
const _h = function(n) {
  const t = n.originalEvent;
  return t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, kh = function(n) {
  const t = n.originalEvent;
  return t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, Rh = function(n) {
  const t = n.map.getTargetElement();
  if (!t)
    return !1;
  const e = t.getRootNode(), i = n.map.getOwnerDocument().activeElement;
  return e instanceof ShadowRoot ? e.host.contains(i) : t.contains(i);
}, Og = function(n) {
  const t = n.map.getTargetElement();
  if (!t)
    return !0;
  const e = t.getRootNode();
  return (e instanceof ShadowRoot ? e.host : t).hasAttribute("tabindex") ? Rh(n) : !0;
}, Ph = $c, Lg = function(n) {
  const t = n.originalEvent;
  return "pointerId" in t && t.button == 0 && !(Th && Pg && t.ctrlKey);
}, Dg = function(n) {
  const t = (
    /** @type {KeyboardEvent|MouseEvent|TouchEvent} */
    n.originalEvent
  );
  return !t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, Oh = function(n) {
  const t = n.originalEvent;
  return Pg ? t.metaKey : t.ctrlKey;
}, Bg = function(n) {
  const t = n.originalEvent;
  return !t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, Ng = function(n) {
  const t = n.originalEvent, e = (
    /** @type {Element} */
    t.target.tagName
  );
  return e !== "INPUT" && e !== "SELECT" && e !== "TEXTAREA" && // `isContentEditable` is only available on `HTMLElement`, but it may also be a
  // different type like `SVGElement`.
  // @ts-ignore
  !t.target.isContentEditable;
}, Rn = function(n) {
  const t = n.originalEvent;
  return "pointerId" in t && t.pointerType == "mouse";
}, Lh = function(n) {
  const t = n.originalEvent;
  return "pointerId" in t && t.isPrimary && t.button === 0;
};
class Gn extends bi {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Interaction.js").InteractionOptions} */
      t
    ), t.handleDownEvent && (this.handleDownEvent = t.handleDownEvent), t.handleDragEvent && (this.handleDragEvent = t.handleDragEvent), t.handleMoveEvent && (this.handleMoveEvent = t.handleMoveEvent), t.handleUpEvent && (this.handleUpEvent = t.handleUpEvent), t.stopDown && (this.stopDown = t.stopDown), this.handlingDownUpSequence = !1, this.targetPointers = [];
  }
  /**
   * Returns the current number of pointers involved in the interaction,
   * e.g. `2` when two fingers are used.
   * @return {number} The number of pointers.
   * @api
   */
  getPointerCount() {
    return this.targetPointers.length;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @protected
   */
  handleDownEvent(t) {
    return !1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @protected
   */
  handleDragEvent(t) {
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} and may call into
   * other functions, if event sequences like e.g. 'drag' or 'down-up' etc. are
   * detected.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @api
   * @override
   */
  handleEvent(t) {
    if (!t.originalEvent)
      return !0;
    let e = !1;
    if (this.updateTrackedPointers_(t), this.handlingDownUpSequence) {
      if (t.type == ri.POINTERDRAG)
        this.handleDragEvent(t), t.originalEvent.preventDefault();
      else if (t.type == ri.POINTERUP) {
        const i = this.handleUpEvent(t);
        this.handlingDownUpSequence = i && this.targetPointers.length > 0;
      }
    } else if (t.type == ri.POINTERDOWN) {
      const i = this.handleDownEvent(t);
      this.handlingDownUpSequence = i, e = this.stopDown(i);
    } else t.type == ri.POINTERMOVE && this.handleMoveEvent(t);
    return !e;
  }
  /**
   * Handle pointer move events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @protected
   */
  handleMoveEvent(t) {
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @protected
   */
  handleUpEvent(t) {
    return !1;
  }
  /**
   * This function is used to determine if "down" events should be propagated
   * to other interactions or should be stopped.
   * @param {boolean} handled Was the event handled by the interaction?
   * @return {boolean} Should the `down` event be stopped?
   */
  stopDown(t) {
    return t;
  }
  /**
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @private
   */
  updateTrackedPointers_(t) {
    t.activePointers && (this.targetPointers = t.activePointers);
  }
}
function ho(n) {
  const t = n.length;
  let e = 0, i = 0;
  for (let r = 0; r < t; r++)
    e += n[r].clientX, i += n[r].clientY;
  return { clientX: e / t, clientY: i / t };
}
class Dh extends Gn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super({
      stopDown: ur
    }), t = t || {}, this.kinetic_ = t.kinetic, this.lastCentroid = null, this.lastPointersCount_, this.panning_ = !1;
    const e = t.condition ? t.condition : Ls(Dg, Lh);
    this.condition_ = t.onFocusOnly ? Ls(Og, e) : e, this.noKinetic_ = !1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    const e = t.map;
    this.panning_ || (this.panning_ = !0, e.getView().beginInteraction());
    const i = this.targetPointers, r = e.getEventPixel(ho(i));
    if (i.length == this.lastPointersCount_) {
      if (this.kinetic_ && this.kinetic_.update(r[0], r[1]), this.lastCentroid) {
        const s = [
          this.lastCentroid[0] - r[0],
          r[1] - this.lastCentroid[1]
        ], A = t.map.getView(), a = A.getResolution();
        a !== void 0 && (ml(s, a), Js(s, A.getRotation()), A.adjustCenterInternal(s));
      }
    } else this.kinetic_ && this.kinetic_.begin();
    this.lastCentroid = r, this.lastPointersCount_ = i.length, t.originalEvent.preventDefault();
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    const e = t.map, i = e.getView();
    if (this.targetPointers.length === 0) {
      if (!this.noKinetic_ && this.kinetic_ && this.kinetic_.end()) {
        const r = this.kinetic_.getDistance(), s = this.kinetic_.getAngle(), o = i.getCenterInternal();
        if (o) {
          const A = (
            /** @type {import("../pixel.js").Pixel} */
            e.getPixelFromCoordinateInternal(o)
          ), a = e.getCoordinateFromPixelInternal([
            A[0] - r * Math.cos(s),
            A[1] - r * Math.sin(s)
          ]);
          i.animateInternal({
            center: i.getConstrainedCenter(
              /** @type {import("../coordinate.js").Coordinate} */
              a
            ),
            duration: 500,
            easing: pr
          });
        }
      }
      return this.panning_ && (this.panning_ = !1, i.endInteraction()), !1;
    }
    return this.kinetic_ && this.kinetic_.begin(), this.lastCentroid = null, !0;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    if (this.targetPointers.length > 0 && this.condition_(t)) {
      const i = t.map.getView();
      return this.lastCentroid = null, i.getAnimating() && i.cancelAnimations(), this.kinetic_ && this.kinetic_.begin(), this.noKinetic_ = this.targetPointers.length > 1, !0;
    }
    return !1;
  }
}
class Bh extends Gn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super({
      stopDown: ur
    }), this.condition_ = t.condition ? t.condition : kh, this.lastAngle_ = void 0, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    if (!Rn(t))
      return;
    const e = t.map, i = e.getView();
    if (i.getConstraints().rotation === uo)
      return;
    const r = e.getSize();
    if (!r)
      return;
    const s = t.pixel, o = Math.atan2(r[1] / 2 - s[1], s[0] - r[0] / 2);
    if (this.lastAngle_ !== void 0) {
      const A = o - this.lastAngle_;
      i.adjustRotationInternal(-A);
    }
    this.lastAngle_ = o;
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    return Rn(t) ? (t.map.getView().endInteraction(this.duration_), !1) : !0;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    return Rn(t) && Lg(t) && this.condition_(t) ? (t.map.getView().beginInteraction(), this.lastAngle_ = void 0, !0) : !1;
  }
}
class Nh extends PA {
  /**
   * @param {string} className CSS class name.
   */
  constructor(t) {
    super(), this.geometry_ = null, this.element_ = document.createElement("div"), this.element_.style.position = "absolute", this.element_.style.pointerEvents = "auto", this.element_.className = "ol-box " + t, this.map_ = null, this.startPixel_ = null, this.endPixel_ = null;
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.setMap(null);
  }
  /**
   * @private
   */
  render_() {
    const t = this.startPixel_, e = this.endPixel_;
    if (!t || !e)
      return;
    const i = "px", r = this.element_.style;
    r.left = Math.min(t[0], e[0]) + i, r.top = Math.min(t[1], e[1]) + i, r.width = Math.abs(e[0] - t[0]) + i, r.height = Math.abs(e[1] - t[1]) + i;
  }
  /**
   * @param {import("../Map.js").default|null} map Map.
   */
  setMap(t) {
    if (this.map_) {
      const e = this.map_.getOverlayContainer();
      e && e.removeChild(this.element_);
      const i = this.element_.style;
      i.left = "inherit", i.top = "inherit", i.width = "inherit", i.height = "inherit";
    }
    if (this.map_ = t, this.map_) {
      const e = this.map_.getOverlayContainer();
      e && e.appendChild(this.element_);
    }
  }
  /**
   * @param {import("../pixel.js").Pixel} startPixel Start pixel.
   * @param {import("../pixel.js").Pixel} endPixel End pixel.
   */
  setPixels(t, e) {
    this.startPixel_ = t, this.endPixel_ = e, this.createOrUpdateGeometry(), this.render_();
  }
  /**
   * Creates or updates the cached geometry.
   */
  createOrUpdateGeometry() {
    if (!this.map_)
      return;
    const t = this.startPixel_, e = this.endPixel_;
    if (!t || !e)
      return;
    const i = [
      t,
      [t[0], e[1]],
      e,
      [e[0], t[1]]
    ], r = this.map_, s = i.map(
      (a) => r.getCoordinateFromPixelInternal(a)
    ), o = s[0];
    if (!o)
      return;
    s[4] = o.slice();
    const A = (
      /** @type {Array<import("../coordinate.js").Coordinate>} */
      s
    );
    this.geometry_ ? this.geometry_.setCoordinates([A]) : this.geometry_ = new rn([A]);
  }
  /**
   * @return {import("../geom/Polygon.js").default} Geometry.
   */
  getGeometry() {
    return (
      /** @type {import("../geom/Polygon.js").default} */
      this.geometry_
    );
  }
}
const mn = {
  /**
   * Triggered upon drag box start.
   * @event DragBoxEvent#boxstart
   * @api
   */
  BOXSTART: "boxstart",
  /**
   * Triggered on drag when box is active.
   * @event DragBoxEvent#boxdrag
   * @api
   */
  BOXDRAG: "boxdrag",
  /**
   * Triggered upon drag box end.
   * @event DragBoxEvent#boxend
   * @api
   */
  BOXEND: "boxend",
  /**
   * Triggered upon drag box canceled.
   * @event DragBoxEvent#boxcancel
   * @api
   */
  BOXCANCEL: "boxcancel"
};
class Jn extends Le {
  /**
   * @param {string} type The event type.
   * @param {import("../coordinate.js").Coordinate} coordinate The event coordinate.
   * @param {import("../MapBrowserEvent.js").default|null} mapBrowserEvent Originating event.
   */
  constructor(t, e, i) {
    super(t), this.coordinate = e, this.mapBrowserEvent = i;
  }
}
class Fh extends Gn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = t ?? {}, this.box_ = new Nh(t.className || "ol-dragbox"), this.minArea_ = t.minArea ?? 64, t.onBoxEnd && (this.onBoxEnd = t.onBoxEnd), this.startPixel_ = null, this.condition_ = t.condition ?? Lg, this.boxEndCondition_ = t.boxEndCondition ?? this.defaultBoxEndCondition;
  }
  /**
   * The default condition for determining whether the boxend event
   * should fire.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent The originating MapBrowserEvent
   *     leading to the box end.
   * @param {import("../pixel.js").Pixel} startPixel The starting pixel of the box.
   * @param {import("../pixel.js").Pixel} endPixel The end pixel of the box.
   * @return {boolean} Whether or not the boxend condition should be fired.
   */
  defaultBoxEndCondition(t, e, i) {
    const r = i[0] - e[0], s = i[1] - e[1];
    return r * r + s * s >= this.minArea_;
  }
  /**
   * Returns geometry of last drawn box.
   * @return {import("../geom/Polygon.js").default} Geometry.
   * @api
   */
  getGeometry() {
    return this.box_.getGeometry();
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    this.startPixel_ && (this.box_.setPixels(this.startPixel_, t.pixel), this.dispatchEvent(
      new Jn(
        mn.BOXDRAG,
        t.coordinate,
        t
      )
    ));
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    if (!this.startPixel_)
      return !1;
    const e = this.boxEndCondition_(
      t,
      this.startPixel_,
      t.pixel
    );
    return e && this.onBoxEnd(t), this.dispatchEvent(
      new Jn(
        e ? mn.BOXEND : mn.BOXCANCEL,
        t.coordinate,
        t
      )
    ), this.box_.setMap(null), this.startPixel_ = null, !1;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    return this.condition_(t) ? (this.startPixel_ = t.pixel, this.box_.setMap(t.map), this.box_.setPixels(this.startPixel_, this.startPixel_), this.dispatchEvent(
      new Jn(
        mn.BOXSTART,
        t.coordinate,
        t
      )
    ), !0) : !1;
  }
  /**
   * Function to execute just before `onboxend` is fired
   * @param {import("../MapBrowserEvent.js").default} event Event.
   */
  onBoxEnd(t) {
  }
  /**
   * Activate or deactivate the interaction.
   * @param {boolean} active Active.
   * @observable
   * @api
   * @override
   */
  setActive(t) {
    t || (this.box_.setMap(null), this.startPixel_ && (this.dispatchEvent(
      new Jn(mn.BOXCANCEL, this.startPixel_, null)
    ), this.startPixel_ = null)), super.setActive(t);
  }
  /**
   * @param {import("../Map.js").default|null} map Map.
   * @override
   */
  setMap(t) {
    this.getMap() && (this.box_.setMap(null), this.startPixel_ && (this.dispatchEvent(
      new Jn(mn.BOXCANCEL, this.startPixel_, null)
    ), this.startPixel_ = null)), super.setMap(t);
  }
}
class jh extends Fh {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = t.condition ? t.condition : Bg;
    super({
      condition: e,
      className: t.className || "ol-dragzoom",
      minArea: t.minArea
    }), this.duration_ = t.duration !== void 0 ? t.duration : 200, this.out_ = t.out !== void 0 ? t.out : !1;
  }
  /**
   * Function to execute just before `onboxend` is fired
   * @param {import("../MapBrowserEvent.js").default} event Event.
   * @override
   */
  onBoxEnd(t) {
    const e = this.getMap();
    if (!e)
      return;
    const i = e.getView();
    let r = this.getGeometry();
    if (this.out_) {
      const s = i.rotatedExtentForGeometry(r), o = i.getResolutionForExtentInternal(s), A = i.getResolution();
      if (o === void 0 || A === void 0)
        return;
      const a = A / o;
      r = r.clone(), r.scale(a * a);
    }
    i.fitInternal(r, {
      duration: this.duration_,
      easing: pr
    });
  }
}
const Ye = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown"
};
class Gh extends bi {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.defaultCondition_ = function(e) {
      return Dg(e) && Ng(e);
    }, this.condition_ = t.condition !== void 0 ? t.condition : this.defaultCondition_, this.duration_ = t.duration !== void 0 ? t.duration : 100, this.pixelDelta_ = t.pixelDelta !== void 0 ? t.pixelDelta : 128;
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} if it was a
   * `KeyEvent`, and decides the direction to pan to (if an arrow key was
   * pressed).
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @override
   */
  handleEvent(t) {
    let e = !1;
    if (t.type == Ve.KEYDOWN) {
      const i = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), r = i.key;
      if (this.condition_(t) && (r == Ye.DOWN || r == Ye.LEFT || r == Ye.RIGHT || r == Ye.UP)) {
        const o = t.map.getView(), A = o.getResolution();
        if (A === void 0)
          return !0;
        const a = A * this.pixelDelta_;
        let g = 0, c = 0;
        r == Ye.DOWN ? c = -a : r == Ye.LEFT ? g = -a : r == Ye.RIGHT ? g = a : c = a;
        const u = [g, c];
        Js(u, o.getRotation()), bh(o, u, this.duration_), i.preventDefault(), e = !0;
      }
    }
    return !e;
  }
}
class zh extends bi {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.condition_ = t.condition ? t.condition : function(e) {
      return !Oh(e) && Ng(e);
    }, this.delta_ = t.delta ? t.delta : 1, this.duration_ = t.duration !== void 0 ? t.duration : 100;
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} if it was a
   * `KeyEvent`, and decides whether to zoom in or out (depending on whether the
   * key pressed was '+' or '-').
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @override
   */
  handleEvent(t) {
    let e = !1;
    if (t.type == Ve.KEYDOWN || t.type == Ve.KEYPRESS) {
      const i = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), r = i.key;
      if (this.condition_(t) && (r === "+" || r === "-")) {
        const s = t.map, o = r === "+" ? this.delta_ : -this.delta_, A = s.getView();
        Io(A, o, void 0, this.duration_), i.preventDefault(), e = !0;
      }
    }
    return !e;
  }
}
const Uh = 40, Xh = 300, Zh = 3;
class Wh extends bi {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Interaction.js").InteractionOptions} */
      t
    ), this.totalDelta_ = 0, this.lastDelta_ = 0, this.maxDelta_ = t.maxDelta !== void 0 ? t.maxDelta : 1, this.duration_ = t.duration !== void 0 ? t.duration : 250, this.timeout_ = t.timeout !== void 0 ? t.timeout : 80, this.useAnchor_ = t.useAnchor !== void 0 ? t.useAnchor : !0, this.constrainResolution_ = t.constrainResolution !== void 0 ? t.constrainResolution : !1;
    const e = t.condition ? t.condition : Ph;
    this.condition_ = t.onFocusOnly ? Ls(Og, e) : e, this.lastAnchor_ = null, this.startTime_ = void 0, this.timeoutId_, this.mode_ = void 0, this.trackpadEventGap_ = 400, this.trackpadTimeoutId_, this.deltaPerZoom_ = 300;
  }
  /**
   * @private
   */
  endInteraction_() {
    this.trackpadTimeoutId_ = void 0;
    const t = this.getMap();
    if (!t)
      return;
    const e = t.getView(), i = this.lastDelta_ ? this.lastDelta_ > 0 ? 1 : -1 : 0;
    e.endInteraction(
      this.constrainResolution_ || e.getConstrainResolution() ? 100 : void 0,
      i,
      this.lastAnchor_ ? t.getCoordinateFromPixel(this.lastAnchor_) : void 0
    );
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} (if it was a mousewheel-event) and eventually
   * zooms the map.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @override
   */
  handleEvent(t) {
    if (!this.condition_(t) || t.type !== Ve.WHEEL)
      return !0;
    const i = t.map, r = (
      /** @type {WheelEvent} */
      t.originalEvent
    );
    r.preventDefault();
    const s = r.ctrlKey && !t.ctrlKey;
    this.useAnchor_ && (this.lastAnchor_ = t.pixel);
    let o = r.deltaY;
    switch (r.deltaMode) {
      case WheelEvent.DOM_DELTA_LINE:
        o *= Uh;
        break;
      case WheelEvent.DOM_DELTA_PAGE:
        o *= Xh;
        break;
    }
    if (o === 0)
      return !1;
    this.lastDelta_ = o;
    const A = Date.now();
    this.startTime_ === void 0 && (this.startTime_ = A), (!this.mode_ || A - this.startTime_ > this.trackpadEventGap_) && (this.mode_ = Math.abs(o) < 4 ? "trackpad" : "wheel");
    const a = i.getView();
    if (this.mode_ === "trackpad")
      return this.trackpadTimeoutId_ ? clearTimeout(this.trackpadTimeoutId_) : (a.getAnimating() && a.cancelAnimations(), a.beginInteraction()), this.trackpadTimeoutId_ = setTimeout(
        this.endInteraction_.bind(this),
        this.timeout_
      ), s && (o = o * Zh), a.adjustZoom(
        -o / this.deltaPerZoom_,
        this.lastAnchor_ ? i.getCoordinateFromPixel(this.lastAnchor_) : void 0
      ), this.startTime_ = A, !1;
    this.totalDelta_ += o;
    const g = Math.max(this.timeout_ - (A - this.startTime_), 0);
    return clearTimeout(this.timeoutId_), this.timeoutId_ = setTimeout(
      this.handleWheelZoom_.bind(this, i),
      g
    ), !1;
  }
  /**
   * @private
   * @param {import("../Map.js").default} map Map.
   */
  handleWheelZoom_(t) {
    const e = t.getView();
    e.getAnimating() && e.cancelAnimations();
    let i = -fe(
      this.totalDelta_,
      -this.maxDelta_ * this.deltaPerZoom_,
      this.maxDelta_ * this.deltaPerZoom_
    ) / this.deltaPerZoom_;
    (e.getConstrainResolution() || this.constrainResolution_) && (i = i ? i > 0 ? 1 : -1 : 0), Io(
      e,
      i,
      this.lastAnchor_ ? t.getCoordinateFromPixel(this.lastAnchor_) : void 0,
      this.duration_
    ), this.mode_ = void 0, this.totalDelta_ = 0, this.lastAnchor_ = null, this.startTime_ = void 0, this.timeoutId_ = void 0;
  }
  /**
   * Enable or disable using the mouse's location as an anchor when zooming
   * @param {boolean} useAnchor true to zoom to the mouse's location, false
   * to zoom to the center of the map
   * @api
   */
  setMouseAnchor(t) {
    this.useAnchor_ = t, t || (this.lastAnchor_ = null);
  }
}
class Vh extends Gn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = ur), super(e), this.anchor_ = null, this.lastAngle_ = void 0, this.rotating_ = !1, this.rotationDelta_ = 0, this.threshold_ = t.threshold !== void 0 ? t.threshold : 0.3, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    let e = 0;
    const i = this.targetPointers[0], r = this.targetPointers[1], s = Math.atan2(
      r.clientY - i.clientY,
      r.clientX - i.clientX
    );
    if (this.lastAngle_ !== void 0) {
      const a = s - this.lastAngle_;
      this.rotationDelta_ += a, !this.rotating_ && Math.abs(this.rotationDelta_) > this.threshold_ && (this.rotating_ = !0), e = a;
    }
    this.lastAngle_ = s;
    const o = t.map, A = o.getView();
    A.getConstraints().rotation !== uo && (this.anchor_ = o.getCoordinateFromPixelInternal(
      o.getEventPixel(ho(this.targetPointers))
    ) ?? null, this.rotating_ && (o.render(), A.adjustRotationInternal(e, this.anchor_ ?? void 0)));
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    return this.targetPointers.length < 2 ? (t.map.getView().endInteraction(this.duration_), !1) : !0;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    if (this.targetPointers.length >= 2) {
      const e = t.map;
      return this.anchor_ = null, this.lastAngle_ = void 0, this.rotating_ = !1, this.rotationDelta_ = 0, this.handlingDownUpSequence || e.getView().beginInteraction(), !0;
    }
    return !1;
  }
}
class Hh extends Gn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = ur), super(e), this.anchor_ = null, this.duration_ = t.duration !== void 0 ? t.duration : 400, this.lastDistance_ = void 0, this.lastScaleDelta_ = 1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    let e = 1;
    const i = this.targetPointers[0], r = this.targetPointers[1], s = i.clientX - r.clientX, o = i.clientY - r.clientY, A = Math.sqrt(s * s + o * o);
    this.lastDistance_ !== void 0 && (e = this.lastDistance_ / A), this.lastDistance_ = A;
    const a = t.map, g = a.getView();
    e != 1 && (this.lastScaleDelta_ = e), this.anchor_ = a.getCoordinateFromPixelInternal(
      a.getEventPixel(ho(this.targetPointers))
    ) ?? null, a.render(), g.adjustResolutionInternal(e, this.anchor_ ?? void 0);
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    if (this.targetPointers.length < 2) {
      const i = t.map.getView(), r = this.lastScaleDelta_ > 1 ? 1 : -1;
      return i.endInteraction(this.duration_, r), !1;
    }
    return !0;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    if (this.targetPointers.length >= 2) {
      const e = t.map;
      return this.anchor_ = null, this.lastDistance_ = void 0, this.lastScaleDelta_ = 1, this.handlingDownUpSequence || e.getView().beginInteraction(), !0;
    }
    return !1;
  }
}
function Da(n) {
  n = n || {};
  const t = new Eh(), e = new xh(-5e-3, 0.05, 100);
  return (n.altShiftDragRotate === void 0 || n.altShiftDragRotate) && t.push(new Bh()), (n.doubleClickZoom === void 0 || n.doubleClickZoom) && t.push(
    new Mh({
      delta: n.zoomDelta,
      duration: n.zoomDuration
    })
  ), (n.dragPan === void 0 || n.dragPan) && t.push(
    new Dh({
      onFocusOnly: n.onFocusOnly,
      kinetic: e
    })
  ), (n.pinchRotate === void 0 || n.pinchRotate) && t.push(new Vh()), (n.pinchZoom === void 0 || n.pinchZoom) && t.push(
    new Hh({
      duration: n.zoomDuration
    })
  ), (n.keyboard === void 0 || n.keyboard) && (t.push(new Gh()), t.push(
    new zh({
      delta: n.zoomDelta,
      duration: n.zoomDuration
    })
  )), (n.mouseWheelZoom === void 0 || n.mouseWheelZoom) && t.push(
    new Wh({
      onFocusOnly: n.onFocusOnly,
      duration: n.zoomDuration
    })
  ), (n.shiftDragZoom === void 0 || n.shiftDragZoom) && t.push(
    new jh({
      duration: n.zoomDuration
    })
  ), t;
}
class Qh extends Gn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Pointer.js").Options} */
      t
    ), this.condition_ = t.condition ? t.condition : Bg, this.lastAngle_ = void 0, this.lastMagnitude_ = void 0, this.lastScaleDelta_ = 0, this.duration_ = t.duration !== void 0 ? t.duration : 400;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    if (!Rn(t))
      return;
    const e = t.map, i = e.getSize();
    if (!i)
      return;
    const r = t.pixel, s = r[0] - i[0] / 2, o = i[1] / 2 - r[1], A = Math.atan2(o, s), a = Math.sqrt(s * s + o * o), g = e.getView();
    if (this.lastAngle_ !== void 0) {
      const c = this.lastAngle_ - A;
      g.adjustRotationInternal(c);
    }
    this.lastAngle_ = A, this.lastMagnitude_ !== void 0 && g.adjustResolutionInternal(this.lastMagnitude_ / a), this.lastMagnitude_ !== void 0 && (this.lastScaleDelta_ = this.lastMagnitude_ / a), this.lastMagnitude_ = a;
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    if (!Rn(t))
      return !0;
    const i = t.map.getView(), r = this.lastScaleDelta_ > 1 ? 1 : -1;
    return i.endInteraction(this.duration_, r), this.lastScaleDelta_ = 0, !1;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    return Rn(t) && this.condition_(t) ? (t.map.getView().beginInteraction(), this.lastAngle_ = void 0, this.lastMagnitude_ = void 0, !0) : !1;
  }
}
function Yh(n) {
  return Kh(n[0], n[1], n[2]);
}
function Kh(n, t, e) {
  return (t << n) + e;
}
const Jh = /\{z\}/g, qh = /\{x\}/g, $h = /\{y\}/g, tC = /\{-y\}/g;
function eC(n, t, e, i, r) {
  return n.replace(Jh, t.toString()).replace(qh, e.toString()).replace($h, i.toString()).replace(tC, function() {
    throw new Error(
      "If the URL template has a {-y} placeholder, the grid extent must be known"
    );
  });
}
function nC(n, t) {
  return (
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile Coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @return {string|undefined} Tile URL.
     */
    (function(e, i, r) {
      if (!e)
        return;
      const s = e[0];
      return eC(n, s, e[1], e[2]);
    })
  );
}
function Ba(n, t) {
  const e = n.length, i = new Array(e);
  for (let r = 0; r < e; ++r)
    i[r] = nC(n[r]);
  return iC(i);
}
function iC(n) {
  return n.length === 1 ? n[0] : (
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile Coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @return {string|undefined} Tile URL.
     */
    (function(t, e, i) {
      if (!t)
        return;
      const r = Yh(t), s = ws(r, n.length);
      return n[s](t, e, i);
    })
  );
}
for (let n = 0; n < 9; n++) {
  const t = `ZOOM:${n}`, e = 256 * Math.pow(2, n);
  (function(i, r) {
    const s = new Gc({
      code: i,
      // The extent is used to determine zoom level 0. Recommended values for a
      // projection's validity extent can be found at https://epsg.io/.
      extent: [0, 0, r, r],
      units: "m"
    });
    ps(s), tr(
      "EPSG:3857",
      s,
      (o) => {
        const A = (o[0] + dt) * r / (2 * dt), a = (-o[1] + dt) * r / (2 * dt);
        return [A, a];
      },
      (o) => {
        const A = o[0] * (2 * dt) / r - dt, a = -1 * (o[1] * (2 * dt) / r - dt);
        return [A, a];
      }
    );
  })(t, e);
}
class Fg extends KI(kA) {
  constructor(t = {}) {
    t = Eg(t), t.wrapX = !1;
    const e = Math.log2(t.width / Je), i = Math.log2(t.height / Je);
    t.maxZoom = Math.ceil(Math.max(e, i)), t.tileUrlFunction = t.tileUrlFunction || function(r) {
      const s = r[0], o = r[1], A = r[2];
      return (
        // @ts-ignore
        o * Je * Math.pow(2, this.maxZoom - s) >= this.width || // @ts-ignore
        A * Je * Math.pow(2, this.maxZoom - s) >= this.height || o < 0 || A < 0 ? Ao : this._tileUrlFunction(r)
      );
    }, super(t), t.mapID && (this.mapID = t.mapID), t.urls ? this._tileUrlFunction = Ba(t.urls) : t.url && (this._tileUrlFunction = Ba(Array.isArray(t.url) ? t.url : [t.url])), this.width = t.width, this.height = t.height, this.maxZoom = t.maxZoom, this._maxxy = Math.pow(2, this.maxZoom) * Je, this.initialize(t);
  }
}
class Mn extends Fn {
  static isBasemap_ = !1;
  constructor(t = {}) {
    super(Object.assign(t, { opaque: !1 }));
  }
}
const rC = [
  "sw-unsupported",
  "sw-register-failed",
  "sw-not-controlling",
  "sw-not-implemented",
  "map-id-required",
  "instance-released",
  "attribute-missing",
  "attribute-invalid",
  "unknown-type",
  "map-not-found",
  "map-busy",
  "no-fetch-process",
  "cache-path-invalid",
  "cannot-fetch-all",
  "fetch-busy",
  "api-not-found"
], sC = ["db-blocked", "quota", "network", "upstream", "storage", "internal"], oC = [
  "unsupported-template",
  "invalid-style",
  "opaque",
  "sw-outdated",
  "credential-rejected",
  "source-not-found",
  "resource-conflict",
  // その版がまだ扱わない kind（旧い版では style・asset）
  "unsupported-kind",
  // WeiwudiSource.removeResource の id がその Source の Resource でない
  "resource-not-found"
], aC = /* @__PURE__ */ new Set([...rC, ...sC, ...oC]), jg = /^[a-z][a-z0-9-]*$/, Gg = (n) => typeof n == "string" && jg.test(n), zg = /* @__PURE__ */ Symbol.for("@c4h/weiwudi/error"), Ug = [
  ["sw-unsupported", "Error: Service worker is not supported"],
  ["sw-register-failed", "Error: Service worker registration failed with ${error}"],
  ["sw-not-controlling", "Error: Service worker did not control this page within 10000 ms"],
  ["sw-not-implemented", "Weiwudi service worker is not implemented."],
  ["map-id-required", "MapID is necessary."],
  ["instance-released", "This instance is already released."],
  ["attribute-missing", 'Error: Attribute "${target}" is missing'],
  ["attribute-invalid", 'Error: Attribute "cacheMaxBytes" is not a valid non-negative integer'],
  ["unknown-type", 'Error: Unknown "type" value'],
  ["map-not-found", 'Error: MapID "${mapID}" not found'],
  ["map-busy", "Error: ${mapID} is under fetching process. Please cancel it first"],
  ["no-fetch-process", "Error: There are no fetching process of ${mapID}"],
  ["cache-path-invalid", 'Error: "cache" api needs mapID, zoom, x, y settings'],
  ["cannot-fetch-all", 'Error: Map "${mapID}" cannot fetch all tiles'],
  ["fetch-busy", 'Error: Another fetching process is running: "${mapID}" (${count} / ${total})'],
  ["api-not-found", "Error: API ${apiName} not found"]
], Xg = /\$\{(\w+)\}/g, AC = new Map(Ug.map(([n, t]) => [n, t])), gC = Ug.map(([n, t], e) => {
  const i = t.split(Xg), r = i.filter((A, a) => a % 2 === 1), s = i.filter((A, a) => a % 2 === 0), o = s.reduce((A, a) => A + a.length, 0);
  return { code: n, names: r, fixed: s, fixedLength: o, order: e };
}), cC = (n, t) => {
  const { fixed: e } = n, i = e[0], r = e[e.length - 1];
  if (e.length === 1) return t === i ? [] : void 0;
  if (t.length < i.length + r.length || !t.startsWith(i) || !t.endsWith(r)) return;
  const s = i.length;
  let o = t.length - r.length;
  const A = [];
  for (let a = e.length - 2; a >= 1; a--) {
    const g = e[a], c = o - g.length < s ? -1 : t.lastIndexOf(g, o - g.length);
    if (c < s) return;
    A.unshift(t.slice(c + g.length, o)), o = c;
  }
  return A.unshift(t.slice(s, o)), A;
}, lC = (n) => {
  let t;
  for (const e of gC) {
    const i = cC(e, n);
    if (!i) continue;
    const r = e.names.length === 0 ? void 0 : Object.fromEntries(e.names.map((s, o) => [s, i[o]]));
    le(e.code, r) === n && (!t || uC(e, t.m)) && (t = { m: e, detail: r });
  }
  if (t)
    return t.detail ? { code: t.m.code, detail: t.detail } : { code: t.m.code };
}, uC = (n, t) => n.fixed[0].length !== t.fixed[0].length ? n.fixed[0].length > t.fixed[0].length : n.fixedLength !== t.fixedLength ? n.fixedLength > t.fixedLength : n.order < t.order, le = (n, t) => {
  const e = AC.get(n);
  if (e === void 0) throw new Error(`Unknown legacy error code: ${n}`);
  return e.replace(Xg, (i, r) => String(t?.[r]));
}, Na = (n) => n === "QuotaExceededError" ? "quota" : n === "BlockedError" ? "db-blocked" : "internal", IC = () => {
  const n = Error.isError;
  return typeof n == "function" ? n : void 0;
}, Fa = (n) => typeof DOMException == "function" && n instanceof DOMException, Zg = (n) => {
  const t = IC();
  return t ? t(n) || Fa(n) : n instanceof Error || Fa(n);
}, Ds = (n) => {
  try {
    return String(n);
  } catch {
    return "[unprintable]";
  }
}, Yr = (n, t) => {
  const e = Object.getOwnPropertyDescriptor(n, t);
  if (!(!e || !("value" in e)))
    return { value: e.value, enumerable: !!e.enumerable };
}, hC = (n) => {
  if (typeof n != "object" || n === null || !Zg(n)) return !1;
  const t = Yr(n, "code");
  if (!t || typeof t.value != "string") return !1;
  const e = Yr(n, zg);
  return e && e.value === !0 && !e.enumerable ? jg.test(t.value) : aC.has(t.value) ? (Yr(n, "name")?.value ?? n.name) === "WeiwudiError" : !1;
}, CC = (n) => {
  if (hC(n)) return n;
  if (typeof n == "string") {
    const t = lC(n);
    if (t) return new Zt(t.code, n, t.detail);
    const e = n.match(/^Error: (\w+)(?::|$)/);
    return new Zt(Na(e ? e[1] : void 0), n);
  }
  if (Zg(n)) {
    const t = n.name, e = n.message;
    return new Zt(
      Na(typeof t == "string" ? t : void 0),
      typeof e == "string" ? e : Ds(n)
    );
  }
  return new Zt("internal", Ds(n));
};
class Zt extends Error {
  constructor(t, e, i) {
    super(e), this.name = "WeiwudiError", this.code = t, i !== void 0 && (this.detail = i), Object.defineProperty(this, zg, { value: !0, enumerable: !1, writable: !1, configurable: !1 });
  }
  /**
   * 文字列・Error・その他から作る。どんな値を渡しても throw しない。
   * そのまま返すのは、本物の Error で、code を自前の文字列として持ち、印があって code が書式（/^[a-z][a-z0-9-]*$/）に
   * 合うもの（未知の code も保つ）か、name が 'WeiwudiError' で code が既知のものだけ（別のコピーの WeiwudiError を含む）。
   * 読み取りの途中で例外が起きる値（throw する getter・Proxy など）は internal で作り直す
   */
  static from(t) {
    try {
      return CC(t);
    } catch {
      return new Zt("internal", Ds(t));
    }
  }
}
const ja = 200, qn = (n) => new Zt("attribute-invalid", `Attribute "userAgent" ${n}`, { attribute: "userAgent" });
function fC(n) {
  if (typeof n != "string") throw qn("must be a string");
  const t = n.trim();
  if (t === "") throw qn("must not be blank");
  if (/[\u0000-\u001f\u007f]/.test(t)) throw qn("must not contain a control character");
  if (/[^ -~]/.test(t)) throw qn("must contain only printable ASCII characters");
  if (t.length > ja) throw qn(`must not be longer than ${ja} characters`);
  return t;
}
const dC = (n) => new Zt("unsupported-template", `Unsupported URL template: ${n}`), pC = (n) => {
  const t = [];
  return { text: n.replace(/\{[^{}]*\}/g, (e) => (t.push(e), `__weiwudi${t.length - 1}__`)), tokens: t };
}, mC = (n, t) => n.replace(/__weiwudi(\d+)__/gi, (e, i) => t[Number(i)] ?? e);
function yC(n, t) {
  const e = pC(n);
  let i;
  try {
    i = new URL(e.text, t).href;
  } catch {
    throw dC("cannot be resolved");
  }
  return mC(i, e.tokens);
}
const Wg = "weiwudi.example.com", vC = "/v2/", Me = `https://${Wg}/api/`;
let Kr, yn;
const Vg = `https://${Wg}${vC}`, Hg = Object.freeze({ cache: "no-store", redirect: "error" });
let Yi = /* @__PURE__ */ new WeakMap(), vn, Ga = !1;
const We = (n) => new Zt("sw-not-controlling", n), Jr = (n) => new Zt("sw-outdated", n), oi = () => typeof navigator < "u" && navigator.serviceWorker ? navigator.serviceWorker.controller : null, wC = async () => {
  let n;
  try {
    n = await fetch(`${Vg}ping`, { ...Hg });
  } catch {
    throw We("The service worker did not answer /v2/ping");
  }
  if (n.status === 404) throw Jr("The service worker does not provide the new API (/v2/ping is 404)");
  if (n.status !== 200) throw We(`The service worker answered /v2/ping with status ${n.status}`);
  let t;
  try {
    t = await n.json();
  } catch {
    throw Jr("The service worker answered /v2/ping with an unexpected body");
  }
  const e = t;
  if (!e || typeof e != "object" || e.api !== 2 || typeof e.version != "string" || e.version === "")
    throw Jr("The service worker answered /v2/ping with an unexpected body");
}, bC = async () => {
  for (let n = 0; n < 2; n++) {
    const t = oi();
    if (!t) throw We("This page is not controlled by a service worker");
    let e, i = !1;
    try {
      await wC();
    } catch (r) {
      i = !0, e = r;
    }
    if (oi() === t) {
      if (i) throw e;
      Yi.set(t, !0);
      return;
    }
  }
  throw We("The controlling service worker changed while checking /v2/ping");
}, EC = async () => {
  if (!oi()) throw We("This page is not controlled by a service worker");
  Ga || (Ga = !0, navigator.serviceWorker.addEventListener("controllerchange", () => {
    Yi = /* @__PURE__ */ new WeakMap(), vn = void 0;
  }));
  for (let t = 0; t < 2; t++) {
    const e = oi();
    if (!e) throw We("This page is not controlled by a service worker");
    if (Yi.has(e)) return;
    if (!vn) {
      const i = bC();
      vn = i;
      const r = () => {
        vn === i && (vn = void 0);
      };
      i.then(r, r);
    }
    await vn;
  }
  const n = oi();
  if (!n || !Yi.has(n)) throw We("The controlling service worker changed while checking /v2/ping");
}, Rt = async (n, t) => {
  await EC();
  let e;
  try {
    e = await fetch(`${Vg}${n}`, {
      ...Hg,
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(t)
    });
  } catch {
    throw We(`The service worker did not answer /v2/${n}`);
  }
  let i;
  try {
    i = await e.json();
  } catch {
    throw new Zt("internal", `The service worker answered /v2/${n} with an unexpected body`);
  }
  if (i && i.ok === !0) return i.result;
  const r = i && typeof i.error == "object" && i.error !== null ? i.error : {}, s = r.detail !== null && typeof r.detail == "object" && Object.keys(r.detail).length > 0 ? r.detail : void 0;
  throw new Zt(
    Gg(r.code) ? r.code : "internal",
    typeof r.message == "string" ? r.message : `/v2/${n} failed`,
    s
  );
}, xC = (n) => {
  if (n === null || typeof n != "object") return n;
  const t = typeof location < "u" ? location.href : void 0;
  if (t === void 0) return n;
  const e = (r) => typeof r == "string" && !/^[a-z][a-z0-9+.-]*:/i.test(r) ? yC(r, t) : r, i = n.url;
  return { ...n, url: Array.isArray(i) ? i.map(e) : e(i) };
}, za = 3e4, MC = 64, qr = (n) => n === "finish" || n === "stop" || n === "canceled", $r = (n, t) => new Zt(
  Gg(n) ? n : "internal",
  typeof t == "string" ? t : "The range fetching stopped"
);
class Qg {
  constructor() {
    this.listeners = {};
  }
  addEventListener(t, e) {
    t in this.listeners || (this.listeners[t] = []), this.listeners[t].push(e);
  }
  removeEventListener(t, e) {
    if (!(t in this.listeners))
      return;
    const i = this.listeners[t];
    for (let r = 0, s = i.length; r < s; r++)
      if (i[r] === e) {
        i.splice(r, 1);
        return;
      }
  }
  dispatchEvent(t) {
    if (!(t.type in this.listeners))
      return !0;
    const e = this.listeners[t.type].slice();
    for (let i = 0, r = e.length; i < r; i++)
      e[i].call(this, t);
    return !t.defaultPrevented;
  }
}
class Ua extends Qg {
  constructor(t) {
    super(), this.released = !1, this.waiters = /* @__PURE__ */ new Set(), this.releasers = /* @__PURE__ */ new Set(), this.ended = /* @__PURE__ */ new Map(), this.id = t.id, this.url = Array.isArray(t.url) ? t.url.slice() : t.url, this.resources = t.resources.map((e) => ({ ...e, templates: e.templates.slice() })), this.warnings = t.warnings.slice(), this.listener = (e) => {
      const i = e.data;
      if (!i || i.sourceId !== this.id || typeof i.type != "string") return;
      const r = i;
      if (typeof r.regionId == "string" && qr(r.type)) {
        this.ended.set(r.regionId, r);
        for (const s of this.ended.keys()) {
          if (this.ended.size <= MC) break;
          this.ended.delete(s);
        }
      }
      for (const s of [...this.waiters]) s(r);
      this.dispatchEvent(new CustomEvent(i.type, { detail: i }));
    }, navigator.serviceWorker?.addEventListener("message", this.listener);
  }
  alive() {
    if (this.released) throw new Zt("instance-released", le("instance-released"));
  }
  async stats() {
    return this.alive(), Rt("stats", { id: this.id });
  }
  /** 保存した登録内容で合流と方針を作り直し、CORS の判定をやり直す。自分自身の衝突は resource-conflict で reject */
  async update() {
    this.alive();
    const t = await Rt("update", { id: this.id });
    this.resources = t.resources, this.warnings = t.warnings;
  }
  /** 排他の Entry を消す。範囲ありはタイルだけで固定を残し、force で固定も消して重なる自分の region を partial にする */
  async clean(t, e) {
    this.alive(), await Rt("clean", { id: this.id, range: t, options: e });
  }
  /** region を解放する。keep または共有の Resource なら本体は残す。他の固定つき region の分は保つ */
  async releaseRange(t, e = {}) {
    this.alive(), await Rt("releaseRange", { id: this.id, regionId: t, options: e });
  }
  /**
   * その Source（スタイルは子）の Resource の Entry を消す（#38）。共有・範囲だけの参照でも消す（clean() は共有を残す）。
   * Resource の記録と捕捉は残る（次の要求は取り直して保存する）。無ければ resource-not-found
   */
  async removeResource(t) {
    this.alive(), await Rt("removeResource", { id: this.id, resourceId: t });
  }
  /** 登録と Entry を消し、ページ側のリスナを外す */
  async remove() {
    this.alive(), await Rt("remove", { id: this.id }), this.release();
  }
  /** タイルの枚数（非タイルの資源は数えない） */
  async estimate(t) {
    return this.alive(), Rt("estimate", { id: this.id, range: t });
  }
  /**
   * 範囲を取得して固定する。持続的な保存領域を求め（待たず、失敗は無視）、ratio の既定は devicePixelRatio > 1 なら
   * '@2x'。終わり（finish・canceled は resolve、stop は WeiwudiError で reject）まで待つ。30 秒イベントが来なければ
   * job/resume を送る
   */
  async fetchRange(t, e = {}) {
    this.alive();
    try {
      navigator.storage?.persist?.()?.catch(() => {
      });
    } catch {
    }
    const i = e.ratio ?? (typeof devicePixelRatio == "number" && devicePixelRatio > 1 ? "@2x" : ""), r = await Rt("fetchRange", { id: this.id, range: t, options: { ...e, ratio: i } });
    if (r.status === "stopped") throw $r(r.code, void 0);
    return r.status !== "running" ? r : this.waitRegion(r);
  }
  /** この Source の region の一覧。SW が止まって running のままのものは partial */
  async regions() {
    return this.alive(), Rt("regions", { id: this.id });
  }
  /**
   * この Source の取得を止める。取り消したジョブの canceled（か終わりのイベント）を受けてから解決する（30 秒来なければ
   * regions() を読んで解決する）。旧 API のジョブなど regionId が無ければすぐ解決。無ければ no-fetch-process
   */
  async cancel() {
    this.alive();
    const t = await Rt("cancel", { id: this.id }), e = t && typeof t.regionId == "string" ? t.regionId : void 0;
    e !== void 0 && await new Promise((i, r) => {
      let s, o = !1;
      const A = (c) => {
        o || (o = !0, s !== void 0 && clearTimeout(s), this.waiters.delete(a), this.releasers.delete(g), c());
      }, a = (c) => {
        c.regionId === e && qr(c.type) && A(i);
      }, g = () => A(() => r(new Zt("instance-released", le("instance-released"))));
      if (this.waiters.add(a), this.releasers.add(g), this.ended.has(e)) {
        A(i);
        return;
      }
      s = setTimeout(() => {
        this.regions().then(() => A(i), (c) => A(() => r(c)));
      }, za);
    });
  }
  /** fetchRange の待ち。終わりのメッセージ・job/resume の終わりの status・release() のどれかで決まる */
  waitRegion(t) {
    return new Promise((e, i) => {
      let r, s = !1;
      const o = (m) => {
        s || (s = !0, r !== void 0 && clearTimeout(r), this.waiters.delete(u), this.releasers.delete(h), m());
      }, A = (m) => o(() => {
        this.regions().then((l) => {
          e(l.find((I) => I.id === t.id) ?? { ...t, status: m });
        }, i);
      }), a = (m) => {
        m.type === "stop" ? o(() => i($r(m.code, m.message))) : m.type === "canceled" ? A("canceled") : A(typeof m.error == "number" && m.error > 0 ? "partial" : "complete");
      }, g = () => {
        Rt("job/resume", { id: this.id, regionId: t.id }).then((m) => {
          s || (m.status === "running" ? c() : m.status === "stopped" ? o(() => i($r(m.code, void 0))) : o(() => e(m)));
        }, (m) => o(() => i(m)));
      }, c = () => {
        r !== void 0 && clearTimeout(r), r = setTimeout(g, za);
      }, u = (m) => {
        m.regionId === t.id && (qr(m.type) ? a(m) : c());
      }, h = () => o(() => i(new Zt("instance-released", le("instance-released"))));
      this.waiters.add(u), this.releasers.add(h);
      const p = this.ended.get(t.id);
      p ? a(p) : c();
    });
  }
  /** ページ側のリスナを外す（以後のメソッドは instance-released で reject。範囲取得の待ちも reject する） */
  release() {
    if (!this.released) {
      this.released = !0, navigator.serviceWorker?.removeEventListener("message", this.listener);
      for (const t of [...this.releasers]) t();
      this.ended.clear();
    }
  }
}
let SC = class _e extends Qg {
  /**
   * SW を登録し、ページが制御下に入るまで待つ。options.userAgent は登録の前に検査し（不正なら
   * WeiwudiError('attribute-invalid')）、制御下に入った後で SW へ渡す（POST /v2/setUserAgent。SW の kv に保存）。
   * 省略したときは、前に渡した値を外す（SW が新 API を持たなければ何もしない）
   */
  static async registerSW(t, e) {
    const i = !!e && e.userAgent !== void 0, r = i ? fC(e.userAgent) : void 0;
    let s = e;
    if (e && "userAgent" in e) {
      const { userAgent: A, ...a } = e;
      s = a;
    }
    if (!("serviceWorker" in navigator))
      throw le("sw-unsupported");
    let o;
    try {
      o = await navigator.serviceWorker.register(t, s);
    } catch (A) {
      throw le("sw-register-failed", { error: `${A}` });
    }
    return await _e.waitForController(), await _e.swCheck(), i ? await Rt("setUserAgent", { userAgent: r }) : await Rt("setUserAgent", {}).catch(() => {
    }), o;
  }
  static async waitForController() {
    return new Promise((t, e) => {
      let i = !1, r;
      function s() {
        i || (i = !0, r !== void 0 && clearTimeout(r), navigator.serviceWorker.removeEventListener("controllerchange", o));
      }
      function o() {
        navigator.serviceWorker.controller && (s(), t());
      }
      navigator.serviceWorker.addEventListener("controllerchange", o), r = setTimeout(() => {
        s(), e(le("sw-not-controlling"));
      }, 1e4), navigator.serviceWorker.ready.then(() => {
        navigator.serviceWorker.controller && (s(), t());
      }).catch(() => {
      });
    });
  }
  static async swCheck() {
    return yn !== void 0 ? yn : (Kr === void 0 && (Kr = new Promise((t, e) => {
      fetch(`${Me}ping`).then((i) => {
        yn = !!i, t(yn);
      }).catch((i) => {
        yn = !1, t(yn);
      });
    })), Kr);
  }
  /**
   * 新 API の登録。資源の衝突では失敗せず warnings に書く。register の完了を待ってから
   * 地図を作る（先に作ると最初の要求が捕捉されない）
   */
  static async register(t) {
    const e = xC(t);
    return new Ua(await Rt("register", e));
  }
  /** 登録済みの Source。無ければ source-not-found（旧 API の地図も） */
  static async source(t) {
    return new Ua(await Rt("source", { id: t }));
  }
  /** 全体と提供元別の使用量（#38）。byProvider は null プロトタイプ（鍵が __proto__ でも自前の項目） */
  static async usage() {
    const t = await Rt("usage", {}), e = /* @__PURE__ */ Object.create(null), i = t && typeof t.byProvider == "object" && t.byProvider !== null ? t.byProvider : {};
    for (const r of Object.keys(i)) {
      const s = i[r];
      e[r] = { count: s.count, bytes: s.bytes };
    }
    return { count: t.count, bytes: t.bytes, byProvider: e };
  }
  /** 新 API で登録した Source の一覧（旧 API の地図は含まない） */
  static async sources() {
    return Rt("sources", {});
  }
  /**
   * 全体のキャッシュ上限（byte）。固定でない Entry の和が超えると、Source をまたいで
   * 古い順に消す（各 Source の cacheMaxBytes と両方を満たす）。maxBytes: 0 は何も保存しない。省略で上限を外す。
   * 0 以上の有限の整数でなければ attribute-invalid
   */
  static async setLimits(t) {
    await Rt("setLimits", { maxBytes: t?.maxBytes });
  }
  static async registerMap(t, e) {
    if (!await _e.swCheck()) throw le("sw-not-implemented");
    let i;
    const r = ["type", "url", "width", "height", "tileSize", "minZoom", "maxZoom", "maxLng", "maxLat", "minLng", "minLat", "cacheTtl", "cacheMaxBytes"].reduce((o, A) => (typeof e[A] < "u" && (e[A] instanceof Array ? e[A].map((a) => {
      o.append(A, a);
    }) : o.append(A, String(e[A]))), o), new URLSearchParams());
    r.append("mapID", t);
    const s = new URL(`${Me}add`);
    if (s.search = r.toString(), i = await (await fetch(s.href)).text(), i.match(/^Error: /))
      throw i;
    return new _e(t, JSON.parse(i));
  }
  static async retrieveMap(t) {
    if (!await _e.swCheck()) throw le("sw-not-implemented");
    let e;
    if (e = await (await fetch(`${Me}info?mapID=${t}`)).text(), e.match(/^Error: /))
      throw e;
    return console.log(e), new _e(t, JSON.parse(e));
  }
  static async removeMap(t) {
    if (!await _e.swCheck()) throw le("sw-not-implemented");
    let e;
    if (e = await (await fetch(`${Me}delete?mapID=${t}`)).text(), e.match(/^Error: /))
      throw e;
  }
  constructor(t, e) {
    if (super(), !t) throw le("map-id-required");
    this.mapID = t, e && Object.assign(this, e), this.url = `${Me}cache/${t}/{z}/{x}/{y}`, this.listener = (i) => {
      i.data.mapID === t && this.dispatchEvent(new CustomEvent(i.data.type, { detail: i.data }));
    }, navigator.serviceWorker.addEventListener("message", this.listener);
  }
  release() {
    navigator.serviceWorker.removeEventListener("message", this.listener), delete this.mapID;
  }
  checkAspect() {
    if (!this.mapID) throw le("instance-released");
  }
  async stats() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${Me}stats?mapID=${this.mapID}`)).text(), typeof t == "string" && t.match(/^Error: /))
      throw t;
    return JSON.parse(t);
  }
  async clean() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${Me}clean?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
  async fetchAll() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${Me}fetchAll?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
  async remove() {
    this.checkAspect(), this.mapID && await _e.removeMap(this.mapID), this.release();
  }
  async cancel() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${Me}cancel?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
};
function Xi(n, t, e) {
  const i = typeof n == "string" ? n : n.getCode(), r = typeof t == "string" ? t : t.getCode();
  let s = Dr(n, t);
  if (s == Br && i != r) {
    const o = Dr(n, "EPSG:3857"), A = Dr("EPSG:3857", t);
    if (o == Br && i != "EPSG:3857")
      throw "Transform of Source projection is not defined.";
    if (A == Br && r != "EPSG:3857")
      throw "Transform of Distination projection is not defined.";
    s = function(g) {
      return re(re(g, n, "EPSG:3857"), "EPSG:3857", t);
    }, tr(n, t, s, function(g) {
      return re(re(g, t, "EPSG:3857"), "EPSG:3857", n);
    });
  }
  if (e)
    return s(e);
}
const TC = [
  "title",
  "attr",
  "officialTitle",
  "dataAttr",
  "author",
  "createdAt",
  "era",
  "license",
  "dataLicense",
  "licenseNote",
  "dataLicenseNote",
  "contributor",
  "mapper",
  "reference",
  "description",
  "url",
  "lang",
  "imageExtension",
  "homePosition",
  "mercZoom"
];
async function _C(n) {
  const t = n;
  if (TC.forEach((s) => {
    t[s] = n[s];
  }), (n.imageExtention || n.imageExtension) && (t.imageExtension = n.imageExtension || n.imageExtention), !n.compiled)
    throw new Error(
      "@maplat/transform requires pre-compiled data. Cannot create MapTransform from GCPs."
    );
  const e = { compiled: n.compiled };
  n.sub_maps?.length && (e.sub_maps = n.sub_maps.filter((s) => s.compiled).map((s) => ({
    compiled: s.compiled,
    priority: s.priority,
    importance: s.importance,
    bounds: s.bounds
  })));
  const i = new Ag();
  i.setMapData(e);
  const r = i.getLayerTransform(0);
  if (t.strictMode = r.strictMode, t.vertexMode = r.vertexMode, t.yaxisMode = r.yaxisMode, t.width = r.wh?.[0], t.height = r.wh?.[1], t.gcps = r.points, t.edges = r.edges, n.sub_maps) {
    const s = n.sub_maps.map((o, A) => {
      const a = {
        importance: o.importance,
        priority: o.priority
      };
      if (o.compiled) {
        const g = i.getLayerTransform(A + 1);
        a.bounds = g?.bounds ?? o.bounds, a.gcps = g?.points, a.edges = g?.edges;
      } else
        a.bounds = o.bounds, a.gcps = o.gcps, a.edges = o.edges;
      return a;
    });
    t.sub_maps = s;
  }
  return [t, i];
}
function Xa(n, t, e) {
  return typeof n.merc2XyVisibleLayers != "function" ? null : n.merc2XyVisibleLayers(t).filter(([, i]) => e(i)).slice(0, 2).map(([i, r]) => [i, r]);
}
class gr extends Fg {
  mapTransform;
  constructor(t = {}) {
    super(t), this.mapTransform = new Ag();
  }
  static async createAsync(t) {
    const [e, i] = await _C(t);
    t = e;
    const r = new gr(t);
    r.mapTransform = i;
    const s = i.getLayerTransform(0), o = new ci({
      code: `Illst:${r.mapID}`,
      extent: [0, 0, r.width, r.height],
      units: "m"
    });
    return ps(o), tr(
      o,
      "EPSG:3857",
      (A) => s.transform(A, !1),
      (A) => s.transform(A, !0)
    ), Xi("EPSG:4326", o), t.sub_maps && t.sub_maps.forEach((A, a) => {
      const g = a + 1, c = `Illst:${r.mapID}#${g}`, u = i.getLayerTransform(g);
      if (!u) return;
      const h = new ci({
        code: c,
        extent: [u.xy[0], u.xy[1], u.wh[0], u.wh[1]],
        units: "m"
      });
      ps(h), tr(
        h,
        "EPSG:3857",
        (p) => u.transform(p, !1, !0),
        (p) => u.transform(p, !0, !0)
      ), Xi("EPSG:4326", h);
    }), r;
  }
  xy2MercAsync_specifyLayer(t, e) {
    const i = `Illst:${this.mapID}${e ? `#${e}` : ""}`;
    return new Promise((r, s) => {
      r(Xi(i, "EPSG:3857", t));
    });
  }
  merc2XyAsync_specifyLayer(t, e) {
    const i = `Illst:${this.mapID}${e ? `#${e}` : ""}`;
    return new Promise((r, s) => {
      r(Xi("EPSG:3857", i, t));
    });
  }
  xy2MercAsync_returnLayer(t) {
    const e = this.mapTransform.xy2MercWithLayer(t);
    return e ? Promise.resolve(e) : Promise.reject(new Error("xy2MercWithLayer: out of bounds"));
  }
  merc2XyAsync_returnLayer(t) {
    const e = this.mapTransform.merc2XyWithLayer(t);
    return Promise.resolve(
      e.map(
        (i) => i ? [i[0], i[1]] : void 0
      )
    );
  }
  setupMapParameter(t) {
    const e = [this.width / 2, this.height / 2], i = this.mapTransform.xy2MercWithLayer(e);
    if (!i) return;
    const [r, s] = i, o = this.mapTransform.getLayerTransform(r), A = this.mapTransform.getLayerTransform(0);
    if (!o) return;
    const a = [
      [e[0] - 150, e[1]],
      [e[0] + 150, e[1]],
      [e[0], e[1] - 150],
      [e[0], e[1] + 150]
    ], g = [
      [0, 0],
      [this.width, 0],
      [this.width, this.height],
      [0, this.height]
    ], c = a.map((l) => o.transform(l, !1)), u = g.map(
      (l) => A.transform(l, !1)
    ), h = Math.sqrt(
      Math.pow(c[0][0] - c[1][0], 2) + Math.pow(c[0][1] - c[1][1], 2)
    ), p = Math.sqrt(
      Math.pow(c[2][0] - c[3][0], 2) + Math.pow(c[2][1] - c[3][1], 2)
    ), m = (h + p) / 2;
    this.mercZoom || (this.mercZoom = Math.log(300 * (2 * dt) / 256 / m) / Math.log(2) - 3), this.homePosition || (this.homePosition = lr(s)), this.envelope = fg([
      [
        u[0],
        u[1],
        u[2],
        u[3],
        u[0]
      ]
    ]), t(this);
  }
  // GPS マーカー用（呼び出し元は mixin の setGPSMarkerAsync のみ）。
  // Transform が merc2XyVisibleLayers を持てば、紙外の本図を除いた表示候補の 1・2 位を返す（MaplatCore#104）:
  // 1 位は中心＋周囲 4 点を同じ層で逆変換した 5 点、2 位は中心だけ。undefined（旧 hide 表現）を含まない 0〜2 件。
  // 持たない（@maplat/transform 1.0.x）なら従来経路（mercs2SysCoords）。
  mercs2SysCoordsAsync_multiLayer(t) {
    const e = t[0], i = Xa(
      this.mapTransform,
      e[0],
      (s) => this.insideCheckXy(s)
    );
    if (i)
      return Promise.resolve(
        i.map(([s, o], A) => {
          if (A > 0)
            return [[this.xy2SysCoord(o)], t[1]];
          const a = this.mapTransform.getLayerTransform(s);
          return [
            e.map(
              (c, u) => u === 0 ? o : a.transform(c, !0, s > 0)
            ).map((c) => this.xy2SysCoord(c)),
            t[1]
          ];
        })
      );
    const r = this.mapTransform.mercs2SysCoords(t[0]);
    return Promise.resolve(
      r.map((s) => {
        if (s)
          return [s.map((o) => o), t[1]];
      })
    );
  }
  merc2XyAsync_base(t, e) {
    return this.merc2XyAsync_returnLayer(t).then((i) => e && !i[0] ? void 0 : (i[0] ? i[0] : i[1])[1]);
  }
  // POI ピン用（呼び出し元は mixin の merc2SysCoordAsync_ignoreBackground → index.ts の setMarker のみ）。
  // Transform が merc2XyVisibleLayers を持てば、紙外の本図を除いた表示候補の 1 位、無ければ undefined（MaplatCore#104）。
  // 持たない（@maplat/transform 1.0.x）なら従来経路。
  merc2XyAsync_ignoreBackground(t) {
    const e = Xa(
      this.mapTransform,
      t,
      (i) => this.insideCheckXy(i)
    );
    return e ? Promise.resolve(e.length ? e[0][1] : void 0) : this.merc2XyAsync_base(t, !0);
  }
  merc2XyAsync(t) {
    return this.merc2XyAsync_base(t, !1);
  }
  xy2MercAsync(t) {
    return this.xy2MercAsync_returnLayer(t).then((e) => e[1]);
  }
  viewpoint2MercsAsync(t, e) {
    const i = t?.[0] ?? this.getMap().getView().getCenter(), r = t?.[1] ?? this.getMap().getView().getDecimalZoom(), s = t?.[2] ?? this.getMap().getView().getRotation();
    e || (e = this.getMap().getSize());
    const o = this.mapTransform.viewpoint2Mercs(
      { center: i, zoom: r, rotation: s },
      e
    );
    return Promise.resolve([o, e]);
  }
  mercs2ViewpointAsync(t) {
    const e = t[1] ?? this.getMap().getSize(), i = this.mapTransform.mercs2Viewpoint(
      t[0],
      e
    );
    return Promise.resolve([
      i.center,
      i.zoom,
      i.rotation
    ]);
  }
}
function kC(n, t) {
  return {
    mapID: typeof n == "string" ? n : n?.mapID ?? "",
    __maplatUnusable: { reason: t.reason }
  };
}
function RC(n) {
  return !!n && typeof n == "object" && "__maplatUnusable" in n;
}
const Yg = /* @__PURE__ */ new WeakMap();
function PC(n, t) {
  Yg.set(n, [...t]);
}
function OC(n) {
  return [...Yg.get(n) ?? []];
}
function LC(n) {
  return (t) => n.tileUrl(t[0], t[1], t[2]) ?? Ao;
}
async function Za(n, t, e) {
  const i = await lI(n, t);
  n.tileUrlFunction = LC(i), n.__maplatIiifUrl = i.url;
}
function Wa(n, t) {
  !t || !t.__maplatIiifUrl || typeof n?.setTileUrlFunction == "function" && n.setTileUrlFunction(t.tileUrlFunction, t.__maplatIiifUrl);
}
var Nt = typeof globalThis < "u" && globalThis || typeof self < "u" && self || // eslint-disable-next-line no-undef
typeof globalThis < "u" && globalThis || {}, qt = {
  searchParams: "URLSearchParams" in Nt,
  iterable: "Symbol" in Nt && "iterator" in Symbol,
  blob: "FileReader" in Nt && "Blob" in Nt && (function() {
    try {
      return new Blob(), !0;
    } catch {
      return !1;
    }
  })(),
  formData: "FormData" in Nt,
  arrayBuffer: "ArrayBuffer" in Nt
};
function DC(n) {
  return n && DataView.prototype.isPrototypeOf(n);
}
if (qt.arrayBuffer)
  var BC = [
    "[object Int8Array]",
    "[object Uint8Array]",
    "[object Uint8ClampedArray]",
    "[object Int16Array]",
    "[object Uint16Array]",
    "[object Int32Array]",
    "[object Uint32Array]",
    "[object Float32Array]",
    "[object Float64Array]"
  ], NC = ArrayBuffer.isView || function(n) {
    return n && BC.indexOf(Object.prototype.toString.call(n)) > -1;
  };
function zn(n) {
  if (typeof n != "string" && (n = String(n)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(n) || n === "")
    throw new TypeError('Invalid character in header field name: "' + n + '"');
  return n.toLowerCase();
}
function Co(n) {
  return typeof n != "string" && (n = String(n)), n;
}
function fo(n) {
  var t = {
    next: function() {
      var e = n.shift();
      return { done: e === void 0, value: e };
    }
  };
  return qt.iterable && (t[Symbol.iterator] = function() {
    return t;
  }), t;
}
function kt(n) {
  this.map = {}, n instanceof kt ? n.forEach(function(t, e) {
    this.append(e, t);
  }, this) : Array.isArray(n) ? n.forEach(function(t) {
    if (t.length != 2)
      throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + t.length);
    this.append(t[0], t[1]);
  }, this) : n && Object.getOwnPropertyNames(n).forEach(function(t) {
    this.append(t, n[t]);
  }, this);
}
kt.prototype.append = function(n, t) {
  n = zn(n), t = Co(t);
  var e = this.map[n];
  this.map[n] = e ? e + ", " + t : t;
};
kt.prototype.delete = function(n) {
  delete this.map[zn(n)];
};
kt.prototype.get = function(n) {
  return n = zn(n), this.has(n) ? this.map[n] : null;
};
kt.prototype.has = function(n) {
  return this.map.hasOwnProperty(zn(n));
};
kt.prototype.set = function(n, t) {
  this.map[zn(n)] = Co(t);
};
kt.prototype.forEach = function(n, t) {
  for (var e in this.map)
    this.map.hasOwnProperty(e) && n.call(t, this.map[e], e, this);
};
kt.prototype.keys = function() {
  var n = [];
  return this.forEach(function(t, e) {
    n.push(e);
  }), fo(n);
};
kt.prototype.values = function() {
  var n = [];
  return this.forEach(function(t) {
    n.push(t);
  }), fo(n);
};
kt.prototype.entries = function() {
  var n = [];
  return this.forEach(function(t, e) {
    n.push([e, t]);
  }), fo(n);
};
qt.iterable && (kt.prototype[Symbol.iterator] = kt.prototype.entries);
function ts(n) {
  if (!n._noBody) {
    if (n.bodyUsed)
      return Promise.reject(new TypeError("Already read"));
    n.bodyUsed = !0;
  }
}
function Kg(n) {
  return new Promise(function(t, e) {
    n.onload = function() {
      t(n.result);
    }, n.onerror = function() {
      e(n.error);
    };
  });
}
function FC(n) {
  var t = new FileReader(), e = Kg(t);
  return t.readAsArrayBuffer(n), e;
}
function jC(n) {
  var t = new FileReader(), e = Kg(t), i = /charset=([A-Za-z0-9_-]+)/.exec(n.type), r = i ? i[1] : "utf-8";
  return t.readAsText(n, r), e;
}
function GC(n) {
  for (var t = new Uint8Array(n), e = new Array(t.length), i = 0; i < t.length; i++)
    e[i] = String.fromCharCode(t[i]);
  return e.join("");
}
function Va(n) {
  if (n.slice)
    return n.slice(0);
  var t = new Uint8Array(n.byteLength);
  return t.set(new Uint8Array(n)), t.buffer;
}
function Jg() {
  return this.bodyUsed = !1, this._initBody = function(n) {
    this.bodyUsed = this.bodyUsed, this._bodyInit = n, n ? typeof n == "string" ? this._bodyText = n : qt.blob && Blob.prototype.isPrototypeOf(n) ? this._bodyBlob = n : qt.formData && FormData.prototype.isPrototypeOf(n) ? this._bodyFormData = n : qt.searchParams && URLSearchParams.prototype.isPrototypeOf(n) ? this._bodyText = n.toString() : qt.arrayBuffer && qt.blob && DC(n) ? (this._bodyArrayBuffer = Va(n.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : qt.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(n) || NC(n)) ? this._bodyArrayBuffer = Va(n) : this._bodyText = n = Object.prototype.toString.call(n) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof n == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : qt.searchParams && URLSearchParams.prototype.isPrototypeOf(n) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
  }, qt.blob && (this.blob = function() {
    var n = ts(this);
    if (n)
      return n;
    if (this._bodyBlob)
      return Promise.resolve(this._bodyBlob);
    if (this._bodyArrayBuffer)
      return Promise.resolve(new Blob([this._bodyArrayBuffer]));
    if (this._bodyFormData)
      throw new Error("could not read FormData body as blob");
    return Promise.resolve(new Blob([this._bodyText]));
  }), this.arrayBuffer = function() {
    if (this._bodyArrayBuffer) {
      var n = ts(this);
      return n || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
        this._bodyArrayBuffer.buffer.slice(
          this._bodyArrayBuffer.byteOffset,
          this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
        )
      ) : Promise.resolve(this._bodyArrayBuffer));
    } else {
      if (qt.blob)
        return this.blob().then(FC);
      throw new Error("could not read as ArrayBuffer");
    }
  }, this.text = function() {
    var n = ts(this);
    if (n)
      return n;
    if (this._bodyBlob)
      return jC(this._bodyBlob);
    if (this._bodyArrayBuffer)
      return Promise.resolve(GC(this._bodyArrayBuffer));
    if (this._bodyFormData)
      throw new Error("could not read FormData body as text");
    return Promise.resolve(this._bodyText);
  }, qt.formData && (this.formData = function() {
    return this.text().then(XC);
  }), this.json = function() {
    return this.text().then(JSON.parse);
  }, this;
}
var zC = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
function UC(n) {
  var t = n.toUpperCase();
  return zC.indexOf(t) > -1 ? t : n;
}
function on(n, t) {
  if (!(this instanceof on))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  t = t || {};
  var e = t.body;
  if (n instanceof on) {
    if (n.bodyUsed)
      throw new TypeError("Already read");
    this.url = n.url, this.credentials = n.credentials, t.headers || (this.headers = new kt(n.headers)), this.method = n.method, this.mode = n.mode, this.signal = n.signal, !e && n._bodyInit != null && (e = n._bodyInit, n.bodyUsed = !0);
  } else
    this.url = String(n);
  if (this.credentials = t.credentials || this.credentials || "same-origin", (t.headers || !this.headers) && (this.headers = new kt(t.headers)), this.method = UC(t.method || this.method || "GET"), this.mode = t.mode || this.mode || null, this.signal = t.signal || this.signal || (function() {
    if ("AbortController" in Nt) {
      var s = new AbortController();
      return s.signal;
    }
  })(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && e)
    throw new TypeError("Body not allowed for GET or HEAD requests");
  if (this._initBody(e), (this.method === "GET" || this.method === "HEAD") && (t.cache === "no-store" || t.cache === "no-cache")) {
    var i = /([?&])_=[^&]*/;
    if (i.test(this.url))
      this.url = this.url.replace(i, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
    else {
      var r = /\?/;
      this.url += (r.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
    }
  }
}
on.prototype.clone = function() {
  return new on(this, { body: this._bodyInit });
};
function XC(n) {
  var t = new FormData();
  return n.trim().split("&").forEach(function(e) {
    if (e) {
      var i = e.split("="), r = i.shift().replace(/\+/g, " "), s = i.join("=").replace(/\+/g, " ");
      t.append(decodeURIComponent(r), decodeURIComponent(s));
    }
  }), t;
}
function ZC(n) {
  var t = new kt(), e = n.replace(/\r?\n[\t ]+/g, " ");
  return e.split("\r").map(function(i) {
    return i.indexOf(`
`) === 0 ? i.substr(1, i.length) : i;
  }).forEach(function(i) {
    var r = i.split(":"), s = r.shift().trim();
    if (s) {
      var o = r.join(":").trim();
      try {
        t.append(s, o);
      } catch (A) {
        console.warn("Response " + A.message);
      }
    }
  }), t;
}
Jg.call(on.prototype);
function we(n, t) {
  if (!(this instanceof we))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  if (t || (t = {}), this.type = "default", this.status = t.status === void 0 ? 200 : t.status, this.status < 200 || this.status > 599)
    throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
  this.ok = this.status >= 200 && this.status < 300, this.statusText = t.statusText === void 0 ? "" : "" + t.statusText, this.headers = new kt(t.headers), this.url = t.url || "", this._initBody(n);
}
Jg.call(we.prototype);
we.prototype.clone = function() {
  return new we(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new kt(this.headers),
    url: this.url
  });
};
we.error = function() {
  var n = new we(null, { status: 200, statusText: "" });
  return n.ok = !1, n.status = 0, n.type = "error", n;
};
var WC = [301, 302, 303, 307, 308];
we.redirect = function(n, t) {
  if (WC.indexOf(t) === -1)
    throw new RangeError("Invalid status code");
  return new we(null, { status: t, headers: { location: n } });
};
var qe = Nt.DOMException;
try {
  new qe();
} catch {
  qe = function(t, e) {
    this.message = t, this.name = e;
    var i = Error(t);
    this.stack = i.stack;
  }, qe.prototype = Object.create(Error.prototype), qe.prototype.constructor = qe;
}
function qg(n, t) {
  return new Promise(function(e, i) {
    var r = new on(n, t);
    if (r.signal && r.signal.aborted)
      return i(new qe("Aborted", "AbortError"));
    var s = new XMLHttpRequest();
    function o() {
      s.abort();
    }
    s.onload = function() {
      var g = {
        statusText: s.statusText,
        headers: ZC(s.getAllResponseHeaders() || "")
      };
      r.url.indexOf("file://") === 0 && (s.status < 200 || s.status > 599) ? g.status = 200 : g.status = s.status, g.url = "responseURL" in s ? s.responseURL : g.headers.get("X-Request-URL");
      var c = "response" in s ? s.response : s.responseText;
      setTimeout(function() {
        e(new we(c, g));
      }, 0);
    }, s.onerror = function() {
      setTimeout(function() {
        i(new TypeError("Network request failed"));
      }, 0);
    }, s.ontimeout = function() {
      setTimeout(function() {
        i(new TypeError("Network request timed out"));
      }, 0);
    }, s.onabort = function() {
      setTimeout(function() {
        i(new qe("Aborted", "AbortError"));
      }, 0);
    };
    function A(g) {
      try {
        return g === "" && Nt.location.href ? Nt.location.href : g;
      } catch {
        return g;
      }
    }
    if (s.open(r.method, A(r.url), !0), r.credentials === "include" ? s.withCredentials = !0 : r.credentials === "omit" && (s.withCredentials = !1), "responseType" in s && (qt.blob ? s.responseType = "blob" : qt.arrayBuffer && (s.responseType = "arraybuffer")), t && typeof t.headers == "object" && !(t.headers instanceof kt || Nt.Headers && t.headers instanceof Nt.Headers)) {
      var a = [];
      Object.getOwnPropertyNames(t.headers).forEach(function(g) {
        a.push(zn(g)), s.setRequestHeader(g, Co(t.headers[g]));
      }), r.headers.forEach(function(g, c) {
        a.indexOf(c) === -1 && s.setRequestHeader(c, g);
      });
    } else
      r.headers.forEach(function(g, c) {
        s.setRequestHeader(c, g);
      });
    r.signal && (r.signal.addEventListener("abort", o), s.onreadystatechange = function() {
      s.readyState === 4 && r.signal.removeEventListener("abort", o);
    }), s.send(typeof r._bodyInit > "u" ? null : r._bodyInit);
  });
}
qg.polyfill = !0;
Nt.fetch || (Nt.fetch = qg, Nt.Headers = kt, Nt.Request = on, Nt.Response = we);
const $g = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAAqACAAQAAAABAAAANKADAAQAAAABAAAANAAAAAD/4QkhaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/4hskSUNDX1BST0ZJTEUAAQEAABsUYXBwbAIQAABtbnRyUkdCIFhZWiAH4AAKAB0AFAA0AAZhY3NwQVBQTAAAAABBUFBMAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFkZXNjAAABUAAAAGJkc2NtAAABtAAABBhjcHJ0AAAFzAAAACN3dHB0AAAF8AAAABRyWFlaAAAGBAAAABRnWFlaAAAGGAAAABRiWFlaAAAGLAAAABRyVFJDAAAGQAAACAxhYXJnAAAOTAAAACB2Y2d0AAAObAAABhJuZGluAAAUgAAABj5jaGFkAAAawAAAACxtbW9kAAAa7AAAAChiVFJDAAAGQAAACAxnVFJDAAAGQAAACAxhYWJnAAAOTAAAACBhYWdnAAAOTAAAACBkZXNjAAAAAAAAAAhEaXNwbGF5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbWx1YwAAAAAAAAAiAAAADGhySFIAAAAUAAABqGtvS1IAAAAMAAABvG5iTk8AAAASAAAByGlkAAAAAAASAAAB2mh1SFUAAAAUAAAB7GNzQ1oAAAAWAAACAGRhREsAAAAcAAACFnVrVUEAAAAcAAACMmFyAAAAAAAUAAACTml0SVQAAAAUAAACYnJvUk8AAAASAAACdm5sTkwAAAAWAAACiGhlSUwAAAAWAAACnmVzRVMAAAASAAACdmZpRkkAAAAQAAACtHpoVFcAAAAMAAACxHZpVk4AAAAOAAAC0HNrU0sAAAAWAAAC3npoQ04AAAAMAAACxHJ1UlUAAAAkAAAC9GZyRlIAAAAWAAADGG1zAAAAAAASAAADLmNhRVMAAAAYAAADQHRoVEgAAAAMAAADWGVzWEwAAAASAAACdmRlREUAAAAQAAADZGVuVVMAAAASAAADdHB0QlIAAAAYAAADhnBsUEwAAAASAAADnmVsR1IAAAAiAAADsHN2U0UAAAAQAAAD0nRyVFIAAAAUAAAD4mphSlAAAAAMAAAD9nB0UFQAAAAWAAAEAgBMAEMARAAgAHUAIABiAG8AagBpzuy37AAgAEwAQwBEAEYAYQByAGcAZQAtAEwAQwBEAEwAQwBEACAAVwBhAHIAbgBhAFMAegDtAG4AZQBzACAATABDAEQAQgBhAHIAZQB2AG4A/QAgAEwAQwBEAEwAQwBEAC0AZgBhAHIAdgBlAHMAawDmAHIAbQQaBD4EOwRMBD4EQAQ+BDIEOAQ5ACAATABDAEQgDwBMAEMARAAgBkUGRAZIBkYGKQBMAEMARAAgAGMAbwBsAG8AcgBpAEwAQwBEACAAYwBvAGwAbwByAEsAbABlAHUAcgBlAG4ALQBMAEMARCAPAEwAQwBEACAF5gXRBeIF1QXgBdkAVgDkAHIAaQAtAEwAQwBEX2mCcgAgAEwAQwBEAEwAQwBEACAATQDgAHUARgBhAHIAZQBiAG4A6QAgAEwAQwBEBCYEMgQ1BEIEPQQ+BDkAIAQWBBoALQQ0BDgEQQQ/BDsENQQ5AEwAQwBEACAAYwBvAHUAbABlAHUAcgBXAGEAcgBuAGEAIABMAEMARABMAEMARAAgAGUAbgAgAGMAbwBsAG8AcgBMAEMARAAgDioONQBGAGEAcgBiAC0ATABDAEQAQwBvAGwAbwByACAATABDAEQATABDAEQAIABDAG8AbABvAHIAaQBkAG8ASwBvAGwAbwByACAATABDAEQDiAOzA8cDwQPJA7wDtwAgA78DuAPMA70DtwAgAEwAQwBEAEYA5AByAGcALQBMAEMARABSAGUAbgBrAGwAaQAgAEwAQwBEMKsw6TD8AEwAQwBEAEwAQwBEACAAYQAgAEMAbwByAGUAc3RleHQAAAAAQ29weXJpZ2h0IEFwcGxlIEluYy4sIDIwMTYAAFhZWiAAAAAAAADzUgABAAAAARbPWFlaIAAAAAAAAGXoAAA8EAAACdBYWVogAAAAAAAAapMAAKrFAAAXilhZWiAAAAAAAAAmWwAAGSwAALHSY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA2ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKMAqACtALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkH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", tc = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAAqACAAQAAAABAAAANKADAAQAAAABAAAANAAAAAD/4QkhaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/4gKESUNDX1BST0ZJTEUAAQEAAAJ0YXBwbAQAAABtbnRyUkdCIFhZWiAH3AALAAwAEgA6ABdhY3NwQVBQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGxmSfnZPIV3n7QGSpkeOnQsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtkZXNjAAABCAAAAGNkc2NtAAABbAAAACxjcHJ0AAABmAAAAC13dHB0AAAByAAAABRyWFlaAAAB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", ec = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCARXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAKgAgAEAAAAAQAAADSgAwAEAAAAAQAAADQAAAAA/+EJIWh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/PgD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/+IbJElDQ19QUk9GSUxFAAEBAAAbFGFwcGwCEAAAbW50clJHQiBYWVogB+EABAAEABcABgAzYWNzcEFQUEwAAAAAQVBQTAAAAAAAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1hcHBsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARZGVzYwAAAVAAAABiZHNjbQAAAbQAAAQYY3BydAAABcwAAAAjd3RwdAAABfAAAAAUclhZWgAABgQAAAAUZ1hZWgAABhgAAAAUYlhZWgAABiwAAAAUclRSQwAABkAAAAgMYWFyZwAADkwAAAAgdmNndAAADmwAAAYSbmRpbgAAFIAAAAY+Y2hhZAAAGsAAAAAsbW1vZAAAGuwAAAAoYlRSQwAABkAAAAgMZ1RSQwAABkAAAAgMYWFiZwAADkwAAAAgYWFnZwAADkwAAAAgZGVzYwAAAAAAAAAIRGlzcGxheQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG1sdWMAAAAAAAAAIgAAAAxockhSAAAAFAAAAahrb0tSAAAADAAAAbxuYk5PAAAAEgAAAchpZAAAAAAAEgAAAdpodUhVAAAAFAAAAexjc0NaAAAAFgAAAgBkYURLAAAAHAAAAhZ1a1VBAAAAHAAAAjJhcgAAAAAAFAAAAk5pdElUAAAAFAAAAmJyb1JPAAAAEgAAAnZubE5MAAAAFgAAAohoZUlMAAAAFgAAAp5lc0VTAAAAEgAAAnZmaUZJAAAAEAAAArR6aFRXAAAADAAAAsR2aVZOAAAADgAAAtBza1NLAAAAFgAAAt56aENOAAAADAAAAsRydVJVAAAAJAAAAvRmckZSAAAAFgAAAxhtcwAAAAAAEgAAAy5jYUVTAAAAGAAAA0B0aFRIAAAADAAAA1hlc1hMAAAAEgAAAnZkZURFAAAAEAAAA2RlblVTAAAAEgAAA3RwdEJSAAAAGAAAA4ZwbFBMAAAAEgAAA55lbEdSAAAAIgAAA7BzdlNFAAAAEAAAA9J0clRSAAAAFAAAA+JqYUpQAAAADAAAA/ZwdFBUAAAAFgAABAIATABDAEQAIAB1ACAAYgBvAGoAac7st+wAIABMAEMARABGAGEAcgBnAGUALQBMAEMARABMAEMARAAgAFcAYQByAG4AYQBTAHoA7QBuAGUAcwAgAEwAQwBEAEIAYQByAGUAdgBuAP0AIABMAEMARABMAEMARAAtAGYAYQByAHYAZQBzAGsA5gByAG0EGgQ+BDsETAQ+BEAEPgQyBDgEOQAgAEwAQwBEIA8ATABDAEQAIAZFBkQGSAZGBikATABDAEQAIABjAG8AbABvAHIAaQBMAEMARAAgAGMAbwBsAG8AcgBLAGwAZQB1AHIAZQBuAC0ATABDAEQgDwBMAEMARAAgBeYF0QXiBdUF4AXZAFYA5AByAGkALQBMAEMARF9pgnIAIABMAEMARABMAEMARAAgAE0A4AB1AEYAYQByAGUAYgBuAP0AIABMAEMARAQmBDIENQRCBD0EPgQ5ACAEFgQaAC0ENAQ4BEEEPwQ7BDUEOQBMAEMARAAgAGMAbwB1AGwAZQB1AHIAVwBhAHIAbgBhACAATABDAEQATABDAEQAIABlAG4AIABjAG8AbABvAHIATABDAEQAIA4qDjUARgBhAHIAYgAtAEwAQwBEAEMAbwBsAG8AcgAgAEwAQwBEAEwAQwBEACAAQwBvAGwAbwByAGkAZABvAEsAbwBsAG8AcgAgAEwAQwBEA4gDswPHA8EDyQO8A7cAIAO/A7gDzAO9A7cAIABMAEMARABGAOQAcgBnAC0ATABDAEQAUgBlAG4AawBsAGkAIABMAEMARDCrMOkw/ABMAEMARABMAEMARAAgAGEAIABDAG8AcgBlAHN0ZXh0AAAAAENvcHlyaWdodCBBcHBsZSBJbmMuLCAyMDE3AABYWVogAAAAAAAA81IAAQAAAAEWz1hZWiAAAAAAAABl6AAAPBAAAAnQWFlaIAAAAAAAAGqTAACqxQAAF4pYWVogAAAAAAAAJlsAABksAACx0mN1cnYAAAAAAAAEAAAAAAUACgAPABQAGQAeACMAKAAtADIANgA7AEAARQBKAE8AVABZAF4AYwBoAG0AcgB3AHwAgQCGAIsAkACVAJoAnwCjAKgArQCyALcAvADBAMYAywDQANUA2wDgAOUA6wDwAPYA+wEBAQcBDQETARkBHwElASsBMgE4AT4BRQFMAVIBWQFgAWcBbgF1AXwBgwGLAZIBmgGhAakBsQG5AcEByQHRAdkB4QHpAfIB+gIDAgwCFAIdAiYCLwI4AkECSwJUAl0CZwJxAnoChAKOApgCogKsArYCwQLLAtUC4ALrAvUDAAMLAxYDIQMtAzgDQwNPA1oDZgNyA34DigOWA6IDrgO6A8cD0wPgA+wD+QQGBBMEIAQtBDsESARVBGMEcQR+BIwEmgSoBLYExATTBOEE8AT+BQ0FHAUrBToFSQVYBWcF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", VC = {
  osm: {
    mapID: "osm",
    title: {
      ja: "オープンストリートマップ",
      en: "OpenStreetMap"
    },
    label: {
      ja: "OSM(現在)",
      en: "OSM(Now)"
    },
    attr: "©︎ OpenStreetMap contributors",
    license: "Custom",
    dataLicense: "ODbL",
    licenseNote: {
      ja: "©︎ OpenStreetMap contributors（OpenStreetMap Copyright: https://www.openstreetmap.org/copyright）",
      en: "©︎ OpenStreetMap contributors (OpenStreetMap Copyright: https://www.openstreetmap.org/copyright)"
    },
    maptype: "base",
    // maxZoom必須: 未指定だとWeiwudi(SWタイルキャッシュ)登録時にズーム上限0と
    // 解釈される環境があり、キャッシュ経由の全タイルが404になる (#78)
    maxZoom: 19,
    thumbnail: $g,
    urls: [
      "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
      "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
      "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
    ]
  },
  gsi: {
    mapID: "gsi",
    title: {
      ja: "地理院地図",
      en: "Geospatial Information Authority of Japan Map"
    },
    label: {
      ja: "地理院地図",
      en: "GSI Map"
    },
    attr: {
      ja: "国土地理院",
      en: "The Geospatial Information Authority of Japan"
    },
    license: "Custom",
    dataLicense: "Custom",
    licenseNote: {
      ja: "公共データ利用規約 第1.0版（PDL1.0）／出典：国土地理院ウェブサイト",
      en: "Public Data License 1.0 / Source: GSI website"
    },
    dataLicenseNote: {
      ja: "公共データ利用規約 第1.0版（PDL1.0）",
      en: "Public Data License 1.0"
    },
    maptype: "base",
    url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
    maxZoom: 18,
    thumbnail: tc
  },
  gsi_ortho: {
    mapID: "gsi_ortho",
    title: {
      ja: "地理院地図オルソ航空写真",
      en: "Geospatial Information Authority of Japan Ortho aerial photo"
    },
    label: {
      ja: "地理院オルソ",
      en: "GSI Ortho"
    },
    attr: {
      ja: "国土地理院",
      en: "The Geospatial Information Authority of Japan"
    },
    license: "Custom",
    dataLicense: "Custom",
    licenseNote: {
      ja: "公共データ利用規約 第1.0版（PDL1.0）／出典：国土地理院ウェブサイト",
      en: "Public Data License 1.0 / Source: GSI website"
    },
    dataLicenseNote: {
      ja: "公共データ利用規約 第1.0版（PDL1.0）",
      en: "Public Data License 1.0"
    },
    maptype: "base",
    url: "https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg",
    maxZoom: 18,
    thumbnail: ec
  }
}, Ha = (n) => (n || "").match(/^(?:base|overlay|google(?:_(?:roadmap|satellite|hybrid|terrain))?|mapbox|maplibre|osm)$/);
async function HC(n, t) {
  typeof n == "string" && (n = { ...VC[n] }), n = ve(Object.assign(n, t));
  const e = n.label || n.year;
  if (e !== void 0 && (n.label = e), Ha(n.maptype)) {
    const a = n.maptype === "base" ? Fn : n.maptype === "overlay" ? Mn : n.maptype === "mapbox" ? ar : n.maptype === "maplibre" ? Ar : Os;
    a.isBasemap() ? (n.homePosition = n.homePos, n.mercZoom = n.defZoom) : (n.homePosition || (n.homePosition = n.homePos), n.mercZoom || (n.mercZoom = n.defZoom)), delete n.homePos, delete n.defZoom, n.zoomRestriction && (n.maxZoom = n.maxZoom || n.mercMaxZoom, n.minZoom = n.minZoom || n.mercMinZoom), n.zoomRestriction = n.mercMaxZoom = n.mercMinZoom = void 0, n.imageExtension || (n.imageExtension = "jpg"), Ps(n.maptype) ? (delete n.url, delete n.urls) : n.mapID && !n.url && !n.urls && (n.url = n.tms ? `tiles/${n.mapID}/{z}/{x}/{-y}.${n.imageExtension}` : `tiles/${n.mapID}/{z}/{x}/{y}.${n.imageExtension}`), n.weiwudi = await es(n), n.weiwudi && (n.url = n.weiwudi.url, delete n.urls);
    const g = await a.createAsync(n);
    return await g.initialWait, g;
  } else if (n.noload) {
    n.mercMaxZoom = n.mercMinZoom = void 0;
    const a = Ca(n);
    a && await Za(n, {
      width: n.width,
      height: n.height
    });
    const g = new gr(n);
    return a && Wa(g, n), g;
  }
  const i = n.settingFile || `maps/${n.mapID}.json`, r = await fetch(i);
  if (!r.ok)
    throw new Error("Fail to load map json");
  const s = await r.json();
  if (n = ve(Object.assign(s, n)), n.label = n.label || s.year, n.maptype || (n.maptype = "maplat"), Ha(n.maptype)) {
    const a = n.maptype === "base" ? Fn : n.maptype === "overlay" ? Mn : n.maptype === "mapbox" ? ar : n.maptype === "maplibre" ? Ar : Os;
    a.isBasemap() ? (n.homePosition = n.homePos, n.mercZoom = n.defZoom) : (n.homePosition || (n.homePosition = n.homePos), n.mercZoom || (n.mercZoom = n.defZoom)), delete n.homePos, delete n.defZoom, n.zoomRestriction && (n.maxZoom = n.maxZoom || n.mercMaxZoom, n.minZoom = n.minZoom || n.mercMinZoom), n.zoomRestriction = n.mercMaxZoom = n.mercMinZoom = void 0, n.imageExtension || (n.imageExtension = "jpg"), Ps(n.maptype) ? (delete n.url, delete n.urls) : n.mapID && !n.url && !n.urls && (n.url = n.tms ? `tiles/${n.mapID}/{z}/{x}/{-y}.${n.imageExtension}` : `tiles/${n.mapID}/{z}/{x}/{y}.${n.imageExtension}`), n.weiwudi = await es(n), n.weiwudi && (n.url = n.weiwudi.url, delete n.urls);
    const g = await a.createAsync(n);
    try {
      return await g.initialWait, g;
    } catch {
      return g;
    }
  }
  delete n.homePos, delete n.defZoom, n.imageExtension || (n.imageExtension = "jpg");
  const o = Ca(n);
  if (!o && n.mapID && !n.url && !n.urls && (n.url = `tiles/${n.mapID}/{z}/{x}/{y}.${n.imageExtension}`), !n.compiled || !n.compiled.wh)
    throw console.error(
      `[Maplat] Missing compiled.wh for mapID=${n.mapID}. Check map setting file: ${i}`
    ), new Error(`Map ${n.mapID} is missing compiled data.`);
  n.width = n.width || n.compiled.wh[0], n.height = n.height || n.compiled.wh[1], o && await Za(n, {
    width: n.compiled.wh[0],
    height: n.compiled.wh[1]
  }), n.weiwudi = await es(n), n.weiwudi && (n.url = n.weiwudi.url, delete n.urls);
  const A = await gr.createAsync(n);
  return Wa(A, n), await A.initialWait, await new Promise((a) => {
    A.setupMapParameter(() => a());
  }), A;
}
async function es(n) {
  const t = {};
  if (n.maptype === "mapbox" || n.maptype === "maplibre" || n.maptype === "google" || !n.enableCache || n.noCache === !0 || uI(n)) return;
  n.maptype === "base" || n.maptype === "overlay" ? t.type = "wmts" : t.type = "xyz", t.url = n.urls ? n.urls : n.url, t.width = n.width, t.height = n.height, t.maxZoom = n.maxZoom, t.minZoom = n.minZoom, n.cacheTtl !== void 0 && (t.cacheTtl = n.cacheTtl);
  const e = n.envelopeLngLats;
  if (e) {
    const r = e.reduce(
      (s, o) => (s[0] = s[0] > o[0] ? o[0] : s[0], s[1] = s[1] < o[0] ? o[0] : s[1], s[2] = s[2] > o[1] ? o[1] : s[2], s[3] = s[3] < o[1] ? o[1] : s[3], s),
      [1 / 0, -1 / 0, 1 / 0, -1 / 0]
    );
    ["minLng", "maxLng", "minLat", "maxLat"].map((s, o) => {
      t[s] = r[o];
    });
  }
  let i;
  try {
    i = await SC.registerMap(n.mapID, t);
  } catch {
  }
  return i;
}
function ns(n, t) {
  return n + (Math.random() - 0.5) * t;
}
function Bs(n, t) {
  if (n instanceof Array)
    return n.map((i) => Bs(i, t));
  const e = Math.pow(10, t);
  return Math.round(n * e) / e;
}
function QC(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var Ns = { exports: {} }, YC = Ns.exports, Qa;
function KC() {
  return Qa || (Qa = 1, (function(n, t) {
    (function(e, i) {
      n.exports = i();
    })(typeof self < "u" ? self : YC, function() {
      return (
        /******/
        (function(e) {
          var i = {};
          function r(s) {
            if (i[s])
              return i[s].exports;
            var o = i[s] = {
              /******/
              i: s,
              /******/
              l: !1,
              /******/
              exports: {}
              /******/
            };
            return e[s].call(o.exports, o, o.exports, r), o.l = !0, o.exports;
          }
          return r.m = e, r.c = i, r.d = function(s, o, A) {
            r.o(s, o) || Object.defineProperty(s, o, {
              /******/
              configurable: !1,
              /******/
              enumerable: !0,
              /******/
              get: A
              /******/
            });
          }, r.n = function(s) {
            var o = s && s.__esModule ? (
              /******/
              (function() {
                return s.default;
              })
            ) : (
              /******/
              (function() {
                return s;
              })
            );
            return r.d(o, "a", o), o;
          }, r.o = function(s, o) {
            return Object.prototype.hasOwnProperty.call(s, o);
          }, r.p = "", r(r.s = 11);
        })([
          /* 0 */
          /***/
          (function(e, g, r) {
            var s = Array.prototype, o = Object.prototype, A = {
              "&": "&amp;",
              '"': "&quot;",
              "'": "&#39;",
              "<": "&lt;",
              ">": "&gt;",
              "\\": "&#92;"
            }, a = /[&"'<>\\]/g, g = e.exports = {};
            function c(O, X) {
              return o.hasOwnProperty.call(O, X);
            }
            g.hasOwnProp = c;
            function u(O) {
              return A[O];
            }
            function h(O, X, Z) {
              if (Z.Update || (Z = new g.TemplateError(Z)), Z.Update(O), !X) {
                var W = Z;
                Z = new Error(W.message), Z.name = W.name;
              }
              return Z;
            }
            g._prettifyError = h;
            function p(O, X, Z) {
              var W, st;
              O instanceof Error && (st = O, O = st.name + ": " + st.message), Object.setPrototypeOf ? (W = new Error(O), Object.setPrototypeOf(W, p.prototype)) : (W = this, Object.defineProperty(W, "message", {
                enumerable: !1,
                writable: !0,
                value: O
              })), Object.defineProperty(W, "name", {
                value: "Template render error"
              }), Error.captureStackTrace && Error.captureStackTrace(W, this.constructor);
              var rt;
              if (st) {
                var at = Object.getOwnPropertyDescriptor(st, "stack");
                rt = at && (at.get || function() {
                  return at.value;
                }), rt || (rt = function() {
                  return st.stack;
                });
              } else {
                var nt = new Error(O).stack;
                rt = function() {
                  return nt;
                };
              }
              return Object.defineProperty(W, "stack", {
                get: function() {
                  return rt.call(W);
                }
              }), Object.defineProperty(W, "cause", {
                value: st
              }), W.lineno = X, W.colno = Z, W.firstUpdate = !0, W.Update = function(pt) {
                var At = "(" + (pt || "unknown path") + ")";
                return this.firstUpdate && (this.lineno && this.colno ? At += " [Line " + this.lineno + ", Column " + this.colno + "]" : this.lineno && (At += " [Line " + this.lineno + "]")), At += `
 `, this.firstUpdate && (At += " "), this.message = At + (this.message || ""), this.firstUpdate = !1, this;
              }, W;
            }
            Object.setPrototypeOf ? Object.setPrototypeOf(p.prototype, Error.prototype) : p.prototype = Object.create(Error.prototype, {
              constructor: {
                value: p
              }
            }), g.TemplateError = p;
            function m(O) {
              return O.replace(a, u);
            }
            g.escape = m;
            function l(O) {
              return o.toString.call(O) === "[object Function]";
            }
            g.isFunction = l;
            function I(O) {
              return o.toString.call(O) === "[object Array]";
            }
            g.isArray = I;
            function C(O) {
              return o.toString.call(O) === "[object String]";
            }
            g.isString = C;
            function d(O) {
              return o.toString.call(O) === "[object Object]";
            }
            g.isObject = d;
            function x(O) {
              return O ? typeof O == "string" ? O.split(".") : [O] : [];
            }
            function w(O) {
              var X = x(O);
              return function(Z) {
                for (var W = Z, st = 0; st < X.length; st++) {
                  var rt = X[st];
                  if (c(W, rt))
                    W = W[rt];
                  else
                    return;
                }
                return W;
              };
            }
            g.getAttrGetter = w;
            function f(O, X, Z) {
              for (var W = {}, st = l(X) ? X : w(X), rt = 0; rt < O.length; rt++) {
                var at = O[rt], nt = st(at, rt);
                if (nt === void 0 && Z === !0)
                  throw new TypeError('groupby: attribute "' + X + '" resolved to undefined');
                (W[nt] || (W[nt] = [])).push(at);
              }
              return W;
            }
            g.groupBy = f;
            function y(O) {
              return Array.prototype.slice.call(O);
            }
            g.toArray = y;
            function v(O) {
              var X = [];
              if (!O)
                return X;
              for (var Z = O.length, W = y(arguments).slice(1), st = -1; ++st < Z; )
                L(W, O[st]) === -1 && X.push(O[st]);
              return X;
            }
            g.without = v;
            function M(O, X) {
              for (var Z = "", W = 0; W < X; W++)
                Z += O;
              return Z;
            }
            g.repeat = M;
            function S(O, X, Z) {
              if (O != null) {
                if (s.forEach && O.forEach === s.forEach)
                  O.forEach(X, Z);
                else if (O.length === +O.length)
                  for (var W = 0, st = O.length; W < st; W++)
                    X.call(Z, O[W], W, O);
              }
            }
            g.each = S;
            function E(O, X) {
              var Z = [];
              if (O == null)
                return Z;
              if (s.map && O.map === s.map)
                return O.map(X);
              for (var W = 0; W < O.length; W++)
                Z[Z.length] = X(O[W], W);
              return O.length === +O.length && (Z.length = O.length), Z;
            }
            g.map = E;
            function T(O, X, Z) {
              var W = -1;
              function st() {
                W++, W < O.length ? X(O[W], W, st, Z) : Z();
              }
              st();
            }
            g.asyncIter = T;
            function _(O, X, Z) {
              var W = D(O || {}), st = W.length, rt = -1;
              function at() {
                rt++;
                var nt = W[rt];
                rt < st ? X(nt, O[nt], rt, st, at) : Z();
              }
              at();
            }
            g.asyncFor = _;
            function L(O, X, Z) {
              return Array.prototype.indexOf.call(O || [], X, Z);
            }
            g.indexOf = L;
            function D(O) {
              var X = [];
              for (var Z in O)
                c(O, Z) && X.push(Z);
              return X;
            }
            g.keys = D;
            function F(O) {
              return D(O).map(function(X) {
                return [X, O[X]];
              });
            }
            g._entries = F;
            function z(O) {
              return D(O).map(function(X) {
                return O[X];
              });
            }
            g._values = z;
            function k(O, X) {
              return O = O || {}, D(X).forEach(function(Z) {
                O[Z] = X[Z];
              }), O;
            }
            g._assign = g.extend = k;
            function N(O, X) {
              if (I(X) || C(X))
                return X.indexOf(O) !== -1;
              if (d(X))
                return O in X;
              throw new Error('Cannot use "in" operator to search for "' + O + '" in unexpected types.');
            }
            g.inOperator = N;
          }),
          /* 1 */
          /***/
          (function(e, i, r) {
            function s(C, d) {
              for (var x = 0; x < d.length; x++) {
                var w = d[x];
                w.enumerable = w.enumerable || !1, w.configurable = !0, "value" in w && (w.writable = !0), Object.defineProperty(C, A(w.key), w);
              }
            }
            function o(C, d, x) {
              return d && s(C.prototype, d), Object.defineProperty(C, "prototype", { writable: !1 }), C;
            }
            function A(C) {
              var d = a(C, "string");
              return typeof d == "symbol" ? d : String(d);
            }
            function a(C, d) {
              if (typeof C != "object" || C === null) return C;
              var x = C[Symbol.toPrimitive];
              if (x !== void 0) {
                var w = x.call(C, d);
                if (typeof w != "object") return w;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return String(C);
            }
            function g(C, d) {
              C.prototype = Object.create(d.prototype), C.prototype.constructor = C, c(C, d);
            }
            function c(C, d) {
              return c = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(x, w) {
                return x.__proto__ = w, x;
              }, c(C, d);
            }
            var u = r(16), h = r(0);
            function p(C, d) {
              return typeof C != "function" || typeof d != "function" ? d : function() {
                var x = this.parent;
                this.parent = C;
                var w = d.apply(this, arguments);
                return this.parent = x, w;
              };
            }
            function m(C, d, x) {
              x = x || {}, h.keys(x).forEach(function(f) {
                x[f] = p(C.prototype[f], x[f]);
              });
              var w = /* @__PURE__ */ (function(f) {
                g(y, f);
                function y() {
                  return f.apply(this, arguments) || this;
                }
                return o(y, [{
                  key: "typename",
                  get: function() {
                    return d;
                  }
                }]), y;
              })(C);
              return h._assign(w.prototype, x), w;
            }
            var l = /* @__PURE__ */ (function() {
              function C() {
                this.init.apply(this, arguments);
              }
              var d = C.prototype;
              return d.init = function() {
              }, C.extend = function(x, w) {
                return typeof x == "object" && (w = x, x = "anonymous"), m(this, x, w);
              }, o(C, [{
                key: "typename",
                get: function() {
                  return this.constructor.name;
                }
              }]), C;
            })(), I = /* @__PURE__ */ (function(C) {
              g(d, C);
              function d() {
                var w, f;
                return f = C.call(this) || this, (w = f).init.apply(w, arguments), f;
              }
              var x = d.prototype;
              return x.init = function() {
              }, d.extend = function(w, f) {
                return typeof w == "object" && (f = w, w = "anonymous"), m(this, w, f);
              }, o(d, [{
                key: "typename",
                get: function() {
                  return this.constructor.name;
                }
              }]), d;
            })(u);
            e.exports = {
              Obj: l,
              EmitterObj: I
            };
          }),
          /* 2 */
          /***/
          (function(e, i, r) {
            var s = r(0), o = Array.from, A = typeof Symbol == "function" && Symbol.iterator && typeof o == "function", a = /* @__PURE__ */ (function() {
              function E(_, L) {
                this.variables = /* @__PURE__ */ Object.create(null), this.parent = _, this.topLevel = !1, this.isolateWrites = L;
              }
              var T = E.prototype;
              return T.set = function(_, L, D) {
                var F = _.split("."), z = this.variables, k = this;
                if (D && (k = this.resolve(F[0], !0))) {
                  k.set(_, L);
                  return;
                }
                for (var N = 0; N < F.length - 1; N++) {
                  var O = F[N];
                  z[O] || (z[O] = {}), z = z[O];
                }
                z[F[F.length - 1]] = L;
              }, T.get = function(_) {
                var L = this.variables[_];
                return L !== void 0 ? L : null;
              }, T.lookup = function(_) {
                var L = this.parent, D = this.variables[_];
                return D !== void 0 ? D : L && L.lookup(_);
              }, T.resolve = function(_, L) {
                var D = L && this.isolateWrites ? void 0 : this.parent, F = this.variables[_];
                return F !== void 0 ? this : D && D.resolve(_);
              }, T.push = function(_) {
                return new E(this, _);
              }, T.pop = function() {
                return this.parent;
              }, E;
            })();
            function g(E, T, _) {
              return function() {
                for (var L = arguments.length, D = new Array(L), F = 0; F < L; F++)
                  D[F] = arguments[F];
                var z = p(D), k, N = h(D);
                if (z > E.length)
                  k = D.slice(0, E.length), D.slice(k.length, z).forEach(function(Z, W) {
                    W < T.length && (N[T[W]] = Z);
                  }), k.push(N);
                else if (z < E.length) {
                  k = D.slice(0, z);
                  for (var O = z; O < E.length; O++) {
                    var X = E[O];
                    k.push(N[X]), delete N[X];
                  }
                  k.push(N);
                } else
                  k = D;
                return _.apply(this, k);
              };
            }
            function c(E) {
              return E.__keywords = !0, E;
            }
            function u(E) {
              return E && Object.prototype.hasOwnProperty.call(E, "__keywords");
            }
            function h(E) {
              var T = E.length;
              if (T) {
                var _ = E[T - 1];
                if (u(_))
                  return _;
              }
              return {};
            }
            function p(E) {
              var T = E.length;
              if (T === 0)
                return 0;
              var _ = E[T - 1];
              return u(_) ? T - 1 : T;
            }
            function m(E) {
              if (typeof E != "string")
                return E;
              this.val = E, this.length = E.length;
            }
            m.prototype = Object.create(String.prototype, {
              length: {
                writable: !0,
                configurable: !0,
                value: 0
              }
            }), m.prototype.valueOf = function() {
              return this.val;
            }, m.prototype.toString = function() {
              return this.val;
            };
            function l(E, T) {
              return E instanceof m ? new m(T) : T.toString();
            }
            function I(E) {
              var T = typeof E;
              return T === "string" ? new m(E) : T !== "function" ? E : function(_) {
                var L = E.apply(this, arguments);
                return typeof L == "string" ? new m(L) : L;
              };
            }
            function C(E, T) {
              return E = E ?? "", T && !(E instanceof m) && (E = s.escape(E.toString())), E;
            }
            function d(E, T, _) {
              if (E == null)
                throw new s.TemplateError("attempted to output null or undefined value", T + 1, _ + 1);
              return E;
            }
            function x(E, T) {
              if (E != null)
                return typeof E[T] == "function" ? function() {
                  for (var _ = arguments.length, L = new Array(_), D = 0; D < _; D++)
                    L[D] = arguments[D];
                  return E[T].apply(E, L);
                } : E[T];
            }
            function w(E, T, _, L) {
              if (E) {
                if (typeof E != "function")
                  throw new Error("Unable to call `" + T + "`, which is not a function");
              } else throw new Error("Unable to call `" + T + "`, which is undefined or falsey");
              return E.apply(_, L);
            }
            function f(E, T, _) {
              var L = T.lookup(_);
              return L !== void 0 ? L : E.lookup(_);
            }
            function y(E, T, _) {
              return E.lineno ? E : new s.TemplateError(E, T, _);
            }
            function v(E, T, _, L) {
              if (s.isArray(E)) {
                var D = E.length;
                s.asyncIter(E, function(F, z, k) {
                  switch (T) {
                    case 1:
                      _(F, z, D, k);
                      break;
                    case 2:
                      _(F[0], F[1], z, D, k);
                      break;
                    case 3:
                      _(F[0], F[1], F[2], z, D, k);
                      break;
                    default:
                      F.push(z, D, k), _.apply(this, F);
                  }
                }, L);
              } else
                s.asyncFor(E, function(F, z, k, N, O) {
                  _(F, z, k, N, O);
                }, L);
            }
            function M(E, T, _, L) {
              var D = 0, F, z;
              function k(st, rt) {
                D++, z[st] = rt, D === F && L(null, z.join(""));
              }
              if (s.isArray(E))
                if (F = E.length, z = new Array(F), F === 0)
                  L(null, "");
                else
                  for (var N = 0; N < E.length; N++) {
                    var O = E[N];
                    switch (T) {
                      case 1:
                        _(O, N, F, k);
                        break;
                      case 2:
                        _(O[0], O[1], N, F, k);
                        break;
                      case 3:
                        _(O[0], O[1], O[2], N, F, k);
                        break;
                      default:
                        O.push(N, F, k), _.apply(this, O);
                    }
                  }
              else {
                var X = s.keys(E || {});
                if (F = X.length, z = new Array(F), F === 0)
                  L(null, "");
                else
                  for (var Z = 0; Z < X.length; Z++) {
                    var W = X[Z];
                    _(W, E[W], Z, F, k);
                  }
              }
            }
            function S(E) {
              return typeof E != "object" || E === null || s.isArray(E) ? E : A && Symbol.iterator in E ? o(E) : E;
            }
            e.exports = {
              Frame: a,
              makeMacro: g,
              makeKeywordArgs: c,
              numArgs: p,
              suppressValue: C,
              ensureDefined: d,
              memberLookup: x,
              contextOrFrameLookup: f,
              callWrap: w,
              handleError: y,
              isArray: s.isArray,
              keys: s.keys,
              SafeString: m,
              copySafeness: l,
              markSafe: I,
              asyncEach: v,
              asyncAll: M,
              inOperator: s.inOperator,
              fromIterator: S
            };
          }),
          /* 3 */
          /***/
          (function(e, i, r) {
            function s(K, $) {
              for (var ut = 0; ut < $.length; ut++) {
                var ct = $[ut];
                ct.enumerable = ct.enumerable || !1, ct.configurable = !0, "value" in ct && (ct.writable = !0), Object.defineProperty(K, A(ct.key), ct);
              }
            }
            function o(K, $, ut) {
              return $ && s(K.prototype, $), Object.defineProperty(K, "prototype", { writable: !1 }), K;
            }
            function A(K) {
              var $ = a(K, "string");
              return typeof $ == "symbol" ? $ : String($);
            }
            function a(K, $) {
              if (typeof K != "object" || K === null) return K;
              var ut = K[Symbol.toPrimitive];
              if (ut !== void 0) {
                var ct = ut.call(K, $);
                if (typeof ct != "object") return ct;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return String(K);
            }
            function g(K, $) {
              K.prototype = Object.create($.prototype), K.prototype.constructor = K, c(K, $);
            }
            function c(K, $) {
              return c = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(ut, ct) {
                return ut.__proto__ = ct, ut;
              }, c(K, $);
            }
            var u = r(1), h = u.Obj;
            function p(K, $, ut) {
              K instanceof $ && ut.push(K), K instanceof m && K.findAll($, ut);
            }
            var m = /* @__PURE__ */ (function(K) {
              g($, K);
              function $() {
                return K.apply(this, arguments) || this;
              }
              var ut = $.prototype;
              return ut.init = function(ct, ht) {
                for (var bt = arguments, Tt = this, Ae = arguments.length, xe = new Array(Ae > 2 ? Ae - 2 : 0), He = 2; He < Ae; He++)
                  xe[He - 2] = arguments[He];
                this.lineno = ct, this.colno = ht, this.fields.forEach(function(Ei, xi) {
                  var An = bt[xi + 2];
                  An === void 0 && (An = null), Tt[Ei] = An;
                });
              }, ut.findAll = function(ct, ht) {
                var bt = this;
                return ht = ht || [], this instanceof I ? this.children.forEach(function(Tt) {
                  return p(Tt, ct, ht);
                }) : this.fields.forEach(function(Tt) {
                  return p(bt[Tt], ct, ht);
                }), ht;
              }, ut.iterFields = function(ct) {
                var ht = this;
                this.fields.forEach(function(bt) {
                  ct(ht[bt], bt);
                });
              }, $;
            })(h), l = /* @__PURE__ */ (function(K) {
              g($, K);
              function $() {
                return K.apply(this, arguments) || this;
              }
              return o($, [{
                key: "typename",
                get: function() {
                  return "Value";
                }
              }, {
                key: "fields",
                get: function() {
                  return ["value"];
                }
              }]), $;
            })(m), I = /* @__PURE__ */ (function(K) {
              g($, K);
              function $() {
                return K.apply(this, arguments) || this;
              }
              var ut = $.prototype;
              return ut.init = function(ct, ht, bt) {
                K.prototype.init.call(this, ct, ht, bt || []);
              }, ut.addChild = function(ct) {
                this.children.push(ct);
              }, o($, [{
                key: "typename",
                get: function() {
                  return "NodeList";
                }
              }, {
                key: "fields",
                get: function() {
                  return ["children"];
                }
              }]), $;
            })(m), C = I.extend("Root"), d = l.extend("Literal"), x = l.extend("Symbol"), w = I.extend("Group"), f = I.extend("Array"), y = m.extend("Pair", {
              fields: ["key", "value"]
            }), v = I.extend("Dict"), M = m.extend("LookupVal", {
              fields: ["target", "val"]
            }), S = m.extend("If", {
              fields: ["cond", "body", "else_"]
            }), E = S.extend("IfAsync"), T = m.extend("InlineIf", {
              fields: ["cond", "body", "else_"]
            }), _ = m.extend("For", {
              fields: ["arr", "name", "body", "else_"]
            }), L = _.extend("AsyncEach"), D = _.extend("AsyncAll"), F = m.extend("Macro", {
              fields: ["name", "args", "body"]
            }), z = F.extend("Caller"), k = m.extend("Import", {
              fields: ["template", "target", "withContext"]
            }), N = /* @__PURE__ */ (function(K) {
              g($, K);
              function $() {
                return K.apply(this, arguments) || this;
              }
              var ut = $.prototype;
              return ut.init = function(ct, ht, bt, Tt, Ae) {
                K.prototype.init.call(this, ct, ht, bt, Tt || new I(), Ae);
              }, o($, [{
                key: "typename",
                get: function() {
                  return "FromImport";
                }
              }, {
                key: "fields",
                get: function() {
                  return ["template", "names", "withContext"];
                }
              }]), $;
            })(m), O = m.extend("FunCall", {
              fields: ["name", "args"]
            }), X = O.extend("Filter"), Z = X.extend("FilterAsync", {
              fields: ["name", "args", "symbol"]
            }), W = v.extend("KeywordArgs"), st = m.extend("Block", {
              fields: ["name", "body"]
            }), rt = m.extend("Super", {
              fields: ["blockName", "symbol"]
            }), at = m.extend("TemplateRef", {
              fields: ["template"]
            }), nt = at.extend("Extends"), pt = m.extend("Include", {
              fields: ["template", "ignoreMissing"]
            }), At = m.extend("Set", {
              fields: ["targets", "value"]
            }), Q = m.extend("Switch", {
              fields: ["expr", "cases", "default"]
            }), J = m.extend("Case", {
              fields: ["cond", "body"]
            }), Y = I.extend("Output"), mt = m.extend("Capture", {
              fields: ["body"]
            }), jt = d.extend("TemplateData"), ae = m.extend("UnaryOp", {
              fields: ["target"]
            }), yt = m.extend("BinOp", {
              fields: ["left", "right"]
            }), Ct = yt.extend("In"), P = yt.extend("Is"), B = yt.extend("Or"), V = yt.extend("And"), H = ae.extend("Not"), it = yt.extend("Add"), tt = yt.extend("Concat"), gt = yt.extend("Sub"), ot = yt.extend("Mul"), wt = yt.extend("Div"), St = yt.extend("FloorDiv"), Vt = yt.extend("Mod"), Ie = yt.extend("Pow"), be = ae.extend("Neg"), Ee = ae.extend("Pos"), Un = m.extend("Compare", {
              fields: ["expr", "ops"]
            }), an = m.extend("CompareOperand", {
              fields: ["expr", "type"]
            }), De = m.extend("CallExtension", {
              init: function(K, $, ut, ct) {
                this.parent(), this.extName = K.__name || K, this.prop = $, this.args = ut || new I(), this.contentArgs = ct || [], this.autoescape = K.autoescape;
              },
              fields: ["extName", "prop", "args", "contentArgs"]
            }), Xn = De.extend("CallExtensionAsync");
            function se(K, $, ut) {
              var ct = K.split(`
`);
              ct.forEach(function(ht, bt) {
                ht && (ut && bt > 0 || !ut) && process.stdout.write(" ".repeat($));
                var Tt = bt === ct.length - 1 ? "" : `
`;
                process.stdout.write("" + ht + Tt);
              });
            }
            function de(K, $) {
              if ($ = $ || 0, se(K.typename + ": ", $), K instanceof I)
                se(`
`), K.children.forEach(function(ht) {
                  de(ht, $ + 2);
                });
              else if (K instanceof De)
                se(K.extName + "." + K.prop + `
`), K.args && de(K.args, $ + 2), K.contentArgs && K.contentArgs.forEach(function(ht) {
                  de(ht, $ + 2);
                });
              else {
                var ut = [], ct = null;
                K.iterFields(function(ht, bt) {
                  ht instanceof m ? ut.push([bt, ht]) : (ct = ct || {}, ct[bt] = ht);
                }), ct ? se(JSON.stringify(ct, null, 2) + `
`, null, !0) : se(`
`), ut.forEach(function(ht) {
                  var bt = ht[0], Tt = ht[1];
                  se("[" + bt + "] =>", $ + 2), de(Tt, $ + 4);
                });
              }
            }
            e.exports = {
              Node: m,
              Root: C,
              NodeList: I,
              Value: l,
              Literal: d,
              Symbol: x,
              Group: w,
              Array: f,
              Pair: y,
              Dict: v,
              Output: Y,
              Capture: mt,
              TemplateData: jt,
              If: S,
              IfAsync: E,
              InlineIf: T,
              For: _,
              AsyncEach: L,
              AsyncAll: D,
              Macro: F,
              Caller: z,
              Import: k,
              FromImport: N,
              FunCall: O,
              Filter: X,
              FilterAsync: Z,
              KeywordArgs: W,
              Block: st,
              Super: rt,
              Extends: nt,
              Include: pt,
              Set: At,
              Switch: Q,
              Case: J,
              LookupVal: M,
              BinOp: yt,
              In: Ct,
              Is: P,
              Or: B,
              And: V,
              Not: H,
              Add: it,
              Concat: tt,
              Sub: gt,
              Mul: ot,
              Div: wt,
              FloorDiv: St,
              Mod: Vt,
              Pow: Ie,
              Neg: be,
              Pos: Ee,
              Compare: Un,
              CompareOperand: an,
              CallExtension: De,
              CallExtensionAsync: Xn,
              printNodes: de
            };
          }),
          /* 4 */
          /***/
          (function(e, i) {
          }),
          /* 5 */
          /***/
          (function(e, i, r) {
            function s(d, x) {
              d.prototype = Object.create(x.prototype), d.prototype.constructor = d, o(d, x);
            }
            function o(d, x) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(w, f) {
                return w.__proto__ = f, w;
              }, o(d, x);
            }
            var A = r(8), a = r(17), g = r(3), c = r(0), u = c.TemplateError, h = r(2), p = h.Frame, m = r(1), l = m.Obj, I = {
              "==": "==",
              "===": "===",
              "!=": "!=",
              "!==": "!==",
              "<": "<",
              ">": ">",
              "<=": "<=",
              ">=": ">="
            }, C = /* @__PURE__ */ (function(d) {
              s(x, d);
              function x() {
                return d.apply(this, arguments) || this;
              }
              var w = x.prototype;
              return w.init = function(f, y) {
                this.templateName = f, this.codebuf = [], this.lastId = 0, this.buffer = null, this.bufferStack = [], this._scopeClosers = "", this.inBlock = !1, this.throwOnUndefined = y;
              }, w.fail = function(f, y, v) {
                throw y !== void 0 && (y += 1), v !== void 0 && (v += 1), new u(f, y, v);
              }, w._pushBuffer = function() {
                var f = this._tmpid();
                return this.bufferStack.push(this.buffer), this.buffer = f, this._emit("var " + this.buffer + ' = "";'), f;
              }, w._popBuffer = function() {
                this.buffer = this.bufferStack.pop();
              }, w._emit = function(f) {
                this.codebuf.push(f);
              }, w._emitLine = function(f) {
                this._emit(f + `
`);
              }, w._emitLines = function() {
                for (var f = this, y = arguments.length, v = new Array(y), M = 0; M < y; M++)
                  v[M] = arguments[M];
                v.forEach(function(S) {
                  return f._emitLine(S);
                });
              }, w._emitFuncBegin = function(f, y) {
                this.buffer = "output", this._scopeClosers = "", this._emitLine("function " + y + "(env, context, frame, runtime, cb) {"), this._emitLine("var lineno = " + f.lineno + ";"), this._emitLine("var colno = " + f.colno + ";"), this._emitLine("var " + this.buffer + ' = "";'), this._emitLine("try {");
              }, w._emitFuncEnd = function(f) {
                f || this._emitLine("cb(null, " + this.buffer + ");"), this._closeScopeLevels(), this._emitLine("} catch (e) {"), this._emitLine("  cb(runtime.handleError(e, lineno, colno));"), this._emitLine("}"), this._emitLine("}"), this.buffer = null;
              }, w._addScopeLevel = function() {
                this._scopeClosers += "})";
              }, w._closeScopeLevels = function() {
                this._emitLine(this._scopeClosers + ";"), this._scopeClosers = "";
              }, w._withScopedSyntax = function(f) {
                var y = this._scopeClosers;
                this._scopeClosers = "", f.call(this), this._closeScopeLevels(), this._scopeClosers = y;
              }, w._makeCallback = function(f) {
                var y = this._tmpid();
                return "function(" + y + (f ? "," + f : "") + `) {
if(` + y + ") { cb(" + y + "); return; }";
              }, w._tmpid = function() {
                return this.lastId++, "t_" + this.lastId;
              }, w._templateName = function() {
                return this.templateName == null ? "undefined" : JSON.stringify(this.templateName);
              }, w._compileChildren = function(f, y) {
                var v = this;
                f.children.forEach(function(M) {
                  v.compile(M, y);
                });
              }, w._compileAggregate = function(f, y, v, M) {
                var S = this;
                v && this._emit(v), f.children.forEach(function(E, T) {
                  T > 0 && S._emit(","), S.compile(E, y);
                }), M && this._emit(M);
              }, w._compileExpression = function(f, y) {
                this.assertType(f, g.Literal, g.Symbol, g.Group, g.Array, g.Dict, g.FunCall, g.Caller, g.Filter, g.LookupVal, g.Compare, g.InlineIf, g.In, g.Is, g.And, g.Or, g.Not, g.Add, g.Concat, g.Sub, g.Mul, g.Div, g.FloorDiv, g.Mod, g.Pow, g.Neg, g.Pos, g.Compare, g.NodeList), this.compile(f, y);
              }, w.assertType = function(f) {
                for (var y = arguments.length, v = new Array(y > 1 ? y - 1 : 0), M = 1; M < y; M++)
                  v[M - 1] = arguments[M];
                v.some(function(S) {
                  return f instanceof S;
                }) || this.fail("assertType: invalid type: " + f.typename, f.lineno, f.colno);
              }, w.compileCallExtension = function(f, y, v) {
                var M = this, S = f.args, E = f.contentArgs, T = typeof f.autoescape == "boolean" ? f.autoescape : !0;
                if (v || this._emit(this.buffer + " += runtime.suppressValue("), this._emit('env.getExtension("' + f.extName + '")["' + f.prop + '"]('), this._emit("context"), (S || E) && this._emit(","), S && (S instanceof g.NodeList || this.fail("compileCallExtension: arguments must be a NodeList, use `parser.parseSignature`"), S.children.forEach(function(L, D) {
                  M._compileExpression(L, y), (D !== S.children.length - 1 || E.length) && M._emit(",");
                })), E.length && E.forEach(function(L, D) {
                  if (D > 0 && M._emit(","), L) {
                    M._emitLine("function(cb) {"), M._emitLine("if(!cb) { cb = function(err) { if(err) { throw err; }}}");
                    var F = M._pushBuffer();
                    M._withScopedSyntax(function() {
                      M.compile(L, y), M._emitLine("cb(null, " + F + ");");
                    }), M._popBuffer(), M._emitLine("return " + F + ";"), M._emitLine("}");
                  } else
                    M._emit("null");
                }), v) {
                  var _ = this._tmpid();
                  this._emitLine(", " + this._makeCallback(_)), this._emitLine(this.buffer + " += runtime.suppressValue(" + _ + ", " + T + " && env.opts.autoescape);"), this._addScopeLevel();
                } else
                  this._emit(")"), this._emit(", " + T + ` && env.opts.autoescape);
`);
              }, w.compileCallExtensionAsync = function(f, y) {
                this.compileCallExtension(f, y, !0);
              }, w.compileNodeList = function(f, y) {
                this._compileChildren(f, y);
              }, w.compileLiteral = function(f) {
                if (typeof f.value == "string") {
                  var y = f.value.replace(/\\/g, "\\\\");
                  y = y.replace(/"/g, '\\"'), y = y.replace(/\n/g, "\\n"), y = y.replace(/\r/g, "\\r"), y = y.replace(/\t/g, "\\t"), y = y.replace(/\u2028/g, "\\u2028"), this._emit('"' + y + '"');
                } else f.value === null ? this._emit("null") : this._emit(f.value.toString());
              }, w.compileSymbol = function(f, y) {
                var v = f.value, M = y.lookup(v);
                M ? this._emit(M) : this._emit('runtime.contextOrFrameLookup(context, frame, "' + v + '")');
              }, w.compileGroup = function(f, y) {
                this._compileAggregate(f, y, "(", ")");
              }, w.compileArray = function(f, y) {
                this._compileAggregate(f, y, "[", "]");
              }, w.compileDict = function(f, y) {
                this._compileAggregate(f, y, "{", "}");
              }, w.compilePair = function(f, y) {
                var v = f.key, M = f.value;
                v instanceof g.Symbol ? v = new g.Literal(v.lineno, v.colno, v.value) : v instanceof g.Literal && typeof v.value == "string" || this.fail("compilePair: Dict keys must be strings or names", v.lineno, v.colno), this.compile(v, y), this._emit(": "), this._compileExpression(M, y);
              }, w.compileInlineIf = function(f, y) {
                this._emit("("), this.compile(f.cond, y), this._emit("?"), this.compile(f.body, y), this._emit(":"), f.else_ !== null ? this.compile(f.else_, y) : this._emit('""'), this._emit(")");
              }, w.compileIn = function(f, y) {
                this._emit("runtime.inOperator("), this.compile(f.left, y), this._emit(","), this.compile(f.right, y), this._emit(")");
              }, w.compileIs = function(f, y) {
                var v = f.right.name ? f.right.name.value : f.right.value;
                this._emit('env.getTest("' + v + '").call(context, '), this.compile(f.left, y), f.right.args && (this._emit(","), this.compile(f.right.args, y)), this._emit(") === true");
              }, w._binOpEmitter = function(f, y, v) {
                this.compile(f.left, y), this._emit(v), this.compile(f.right, y);
              }, w.compileOr = function(f, y) {
                return this._binOpEmitter(f, y, " || ");
              }, w.compileAnd = function(f, y) {
                return this._binOpEmitter(f, y, " && ");
              }, w.compileAdd = function(f, y) {
                return this._binOpEmitter(f, y, " + ");
              }, w.compileConcat = function(f, y) {
                return this._binOpEmitter(f, y, ' + "" + ');
              }, w.compileSub = function(f, y) {
                return this._binOpEmitter(f, y, " - ");
              }, w.compileMul = function(f, y) {
                return this._binOpEmitter(f, y, " * ");
              }, w.compileDiv = function(f, y) {
                return this._binOpEmitter(f, y, " / ");
              }, w.compileMod = function(f, y) {
                return this._binOpEmitter(f, y, " % ");
              }, w.compileNot = function(f, y) {
                this._emit("!"), this.compile(f.target, y);
              }, w.compileFloorDiv = function(f, y) {
                this._emit("Math.floor("), this.compile(f.left, y), this._emit(" / "), this.compile(f.right, y), this._emit(")");
              }, w.compilePow = function(f, y) {
                this._emit("Math.pow("), this.compile(f.left, y), this._emit(", "), this.compile(f.right, y), this._emit(")");
              }, w.compileNeg = function(f, y) {
                this._emit("-"), this.compile(f.target, y);
              }, w.compilePos = function(f, y) {
                this._emit("+"), this.compile(f.target, y);
              }, w.compileCompare = function(f, y) {
                var v = this;
                this.compile(f.expr, y), f.ops.forEach(function(M) {
                  v._emit(" " + I[M.type] + " "), v.compile(M.expr, y);
                });
              }, w.compileLookupVal = function(f, y) {
                this._emit("runtime.memberLookup(("), this._compileExpression(f.target, y), this._emit("),"), this._compileExpression(f.val, y), this._emit(")");
              }, w._getNodeName = function(f) {
                switch (f.typename) {
                  case "Symbol":
                    return f.value;
                  case "FunCall":
                    return "the return value of (" + this._getNodeName(f.name) + ")";
                  case "LookupVal":
                    return this._getNodeName(f.target) + '["' + this._getNodeName(f.val) + '"]';
                  case "Literal":
                    return f.value.toString();
                  default:
                    return "--expression--";
                }
              }, w.compileFunCall = function(f, y) {
                this._emit("(lineno = " + f.lineno + ", colno = " + f.colno + ", "), this._emit("runtime.callWrap("), this._compileExpression(f.name, y), this._emit(', "' + this._getNodeName(f.name).replace(/"/g, '\\"') + '", context, '), this._compileAggregate(f.args, y, "[", "])"), this._emit(")");
              }, w.compileFilter = function(f, y) {
                var v = f.name;
                this.assertType(v, g.Symbol), this._emit('env.getFilter("' + v.value + '").call(context, '), this._compileAggregate(f.args, y), this._emit(")");
              }, w.compileFilterAsync = function(f, y) {
                var v = f.name, M = f.symbol.value;
                this.assertType(v, g.Symbol), y.set(M, M), this._emit('env.getFilter("' + v.value + '").call(context, '), this._compileAggregate(f.args, y), this._emitLine(", " + this._makeCallback(M)), this._addScopeLevel();
              }, w.compileKeywordArgs = function(f, y) {
                this._emit("runtime.makeKeywordArgs("), this.compileDict(f, y), this._emit(")");
              }, w.compileSet = function(f, y) {
                var v = this, M = [];
                f.targets.forEach(function(S) {
                  var E = S.value, T = y.lookup(E);
                  T == null && (T = v._tmpid(), v._emitLine("var " + T + ";")), M.push(T);
                }), f.value ? (this._emit(M.join(" = ") + " = "), this._compileExpression(f.value, y), this._emitLine(";")) : (this._emit(M.join(" = ") + " = "), this.compile(f.body, y), this._emitLine(";")), f.targets.forEach(function(S, E) {
                  var T = M[E], _ = S.value;
                  v._emitLine('frame.set("' + _ + '", ' + T + ", true);"), v._emitLine("if(frame.topLevel) {"), v._emitLine('context.setVariable("' + _ + '", ' + T + ");"), v._emitLine("}"), _.charAt(0) !== "_" && (v._emitLine("if(frame.topLevel) {"), v._emitLine('context.addExport("' + _ + '", ' + T + ");"), v._emitLine("}"));
                });
              }, w.compileSwitch = function(f, y) {
                var v = this;
                this._emit("switch ("), this.compile(f.expr, y), this._emit(") {"), f.cases.forEach(function(M, S) {
                  v._emit("case "), v.compile(M.cond, y), v._emit(": "), v.compile(M.body, y), M.body.children.length && v._emitLine("break;");
                }), f.default && (this._emit("default:"), this.compile(f.default, y)), this._emit("}");
              }, w.compileIf = function(f, y, v) {
                var M = this;
                this._emit("if("), this._compileExpression(f.cond, y), this._emitLine(") {"), this._withScopedSyntax(function() {
                  M.compile(f.body, y), v && M._emit("cb()");
                }), f.else_ ? (this._emitLine(`}
else {`), this._withScopedSyntax(function() {
                  M.compile(f.else_, y), v && M._emit("cb()");
                })) : v && (this._emitLine(`}
else {`), this._emit("cb()")), this._emitLine("}");
              }, w.compileIfAsync = function(f, y) {
                this._emit("(function(cb) {"), this.compileIf(f, y, !0), this._emit("})(" + this._makeCallback()), this._addScopeLevel();
              }, w._emitLoopBindings = function(f, y, v, M) {
                var S = this, E = [{
                  name: "index",
                  val: v + " + 1"
                }, {
                  name: "index0",
                  val: v
                }, {
                  name: "revindex",
                  val: M + " - " + v
                }, {
                  name: "revindex0",
                  val: M + " - " + v + " - 1"
                }, {
                  name: "first",
                  val: v + " === 0"
                }, {
                  name: "last",
                  val: v + " === " + M + " - 1"
                }, {
                  name: "length",
                  val: M
                }];
                E.forEach(function(T) {
                  S._emitLine('frame.set("loop.' + T.name + '", ' + T.val + ");");
                });
              }, w.compileFor = function(f, y) {
                var v = this, M = this._tmpid(), S = this._tmpid(), E = this._tmpid();
                if (y = y.push(), this._emitLine("frame = frame.push();"), this._emit("var " + E + " = "), this._compileExpression(f.arr, y), this._emitLine(";"), this._emit("if(" + E + ") {"), this._emitLine(E + " = runtime.fromIterator(" + E + ");"), f.name instanceof g.Array) {
                  this._emitLine("var " + M + ";"), this._emitLine("if(runtime.isArray(" + E + ")) {"), this._emitLine("var " + S + " = " + E + ".length;"), this._emitLine("for(" + M + "=0; " + M + " < " + E + ".length; " + M + "++) {"), f.name.children.forEach(function(k, N) {
                    var O = v._tmpid();
                    v._emitLine("var " + O + " = " + E + "[" + M + "][" + N + "];"), v._emitLine('frame.set("' + k + '", ' + E + "[" + M + "][" + N + "]);"), y.set(f.name.children[N].value, O);
                  }), this._emitLoopBindings(f, E, M, S), this._withScopedSyntax(function() {
                    v.compile(f.body, y);
                  }), this._emitLine("}"), this._emitLine("} else {");
                  var T = f.name.children, _ = T[0], L = T[1], D = this._tmpid(), F = this._tmpid();
                  y.set(_.value, D), y.set(L.value, F), this._emitLine(M + " = -1;"), this._emitLine("var " + S + " = runtime.keys(" + E + ").length;"), this._emitLine("for(var " + D + " in " + E + ") {"), this._emitLine(M + "++;"), this._emitLine("var " + F + " = " + E + "[" + D + "];"), this._emitLine('frame.set("' + _.value + '", ' + D + ");"), this._emitLine('frame.set("' + L.value + '", ' + F + ");"), this._emitLoopBindings(f, E, M, S), this._withScopedSyntax(function() {
                    v.compile(f.body, y);
                  }), this._emitLine("}"), this._emitLine("}");
                } else {
                  var z = this._tmpid();
                  y.set(f.name.value, z), this._emitLine("var " + S + " = " + E + ".length;"), this._emitLine("for(var " + M + "=0; " + M + " < " + E + ".length; " + M + "++) {"), this._emitLine("var " + z + " = " + E + "[" + M + "];"), this._emitLine('frame.set("' + f.name.value + '", ' + z + ");"), this._emitLoopBindings(f, E, M, S), this._withScopedSyntax(function() {
                    v.compile(f.body, y);
                  }), this._emitLine("}");
                }
                this._emitLine("}"), f.else_ && (this._emitLine("if (!" + S + ") {"), this.compile(f.else_, y), this._emitLine("}")), this._emitLine("frame = frame.pop();");
              }, w._compileAsyncLoop = function(f, y, v) {
                var M = this, S = this._tmpid(), E = this._tmpid(), T = this._tmpid(), _ = v ? "asyncAll" : "asyncEach";
                if (y = y.push(), this._emitLine("frame = frame.push();"), this._emit("var " + T + " = runtime.fromIterator("), this._compileExpression(f.arr, y), this._emitLine(");"), f.name instanceof g.Array) {
                  var L = f.name.children.length;
                  this._emit("runtime." + _ + "(" + T + ", " + L + ", function("), f.name.children.forEach(function(z) {
                    M._emit(z.value + ",");
                  }), this._emit(S + "," + E + ",next) {"), f.name.children.forEach(function(z) {
                    var k = z.value;
                    y.set(k, k), M._emitLine('frame.set("' + k + '", ' + k + ");");
                  });
                } else {
                  var D = f.name.value;
                  this._emitLine("runtime." + _ + "(" + T + ", 1, function(" + D + ", " + S + ", " + E + ",next) {"), this._emitLine('frame.set("' + D + '", ' + D + ");"), y.set(D, D);
                }
                this._emitLoopBindings(f, T, S, E), this._withScopedSyntax(function() {
                  var z;
                  v && (z = M._pushBuffer()), M.compile(f.body, y), M._emitLine("next(" + S + (z ? "," + z : "") + ");"), v && M._popBuffer();
                });
                var F = this._tmpid();
                this._emitLine("}, " + this._makeCallback(F)), this._addScopeLevel(), v && this._emitLine(this.buffer + " += " + F + ";"), f.else_ && (this._emitLine("if (!" + T + ".length) {"), this.compile(f.else_, y), this._emitLine("}")), this._emitLine("frame = frame.pop();");
              }, w.compileAsyncEach = function(f, y) {
                this._compileAsyncLoop(f, y);
              }, w.compileAsyncAll = function(f, y) {
                this._compileAsyncLoop(f, y, !0);
              }, w._compileMacro = function(f, y) {
                var v = this, M = [], S = null, E = "macro_" + this._tmpid(), T = y !== void 0;
                f.args.children.forEach(function(k, N) {
                  N === f.args.children.length - 1 && k instanceof g.Dict ? S = k : (v.assertType(k, g.Symbol), M.push(k));
                });
                var _ = [].concat(M.map(function(k) {
                  return "l_" + k.value;
                }), ["kwargs"]), L = M.map(function(k) {
                  return '"' + k.value + '"';
                }), D = (S && S.children || []).map(function(k) {
                  return '"' + k.key.value + '"';
                }), F;
                T ? F = y.push(!0) : F = new p(), this._emitLines("var " + E + " = runtime.makeMacro(", "[" + L.join(", ") + "], ", "[" + D.join(", ") + "], ", "function (" + _.join(", ") + ") {", "var callerFrame = frame;", "frame = " + (T ? "frame.push(true);" : "new runtime.Frame();"), "kwargs = kwargs || {};", 'if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {', 'frame.set("caller", kwargs.caller); }'), M.forEach(function(k) {
                  v._emitLine('frame.set("' + k.value + '", l_' + k.value + ");"), F.set(k.value, "l_" + k.value);
                }), S && S.children.forEach(function(k) {
                  var N = k.key.value;
                  v._emit('frame.set("' + N + '", '), v._emit('Object.prototype.hasOwnProperty.call(kwargs, "' + N + '")'), v._emit(' ? kwargs["' + N + '"] : '), v._compileExpression(k.value, F), v._emit(");");
                });
                var z = this._pushBuffer();
                return this._withScopedSyntax(function() {
                  v.compile(f.body, F);
                }), this._emitLine("frame = " + (T ? "frame.pop();" : "callerFrame;")), this._emitLine("return new runtime.SafeString(" + z + ");"), this._emitLine("});"), this._popBuffer(), E;
              }, w.compileMacro = function(f, y) {
                var v = this._compileMacro(f), M = f.name.value;
                y.set(M, v), y.parent ? this._emitLine('frame.set("' + M + '", ' + v + ");") : (f.name.value.charAt(0) !== "_" && this._emitLine('context.addExport("' + M + '");'), this._emitLine('context.setVariable("' + M + '", ' + v + ");"));
              }, w.compileCaller = function(f, y) {
                this._emit("(function (){");
                var v = this._compileMacro(f, y);
                this._emit("return " + v + ";})()");
              }, w._compileGetTemplate = function(f, y, v, M) {
                var S = this._tmpid(), E = this._templateName(), T = this._makeCallback(S), _ = v ? "true" : "false", L = M ? "true" : "false";
                return this._emit("env.getTemplate("), this._compileExpression(f.template, y), this._emitLine(", " + _ + ", " + E + ", " + L + ", " + T), S;
              }, w.compileImport = function(f, y) {
                var v = f.target.value, M = this._compileGetTemplate(f, y, !1, !1);
                this._addScopeLevel(), this._emitLine(M + ".getExported(" + (f.withContext ? "context.getVariables(), frame, " : "") + this._makeCallback(M)), this._addScopeLevel(), y.set(v, M), y.parent ? this._emitLine('frame.set("' + v + '", ' + M + ");") : this._emitLine('context.setVariable("' + v + '", ' + M + ");");
              }, w.compileFromImport = function(f, y) {
                var v = this, M = this._compileGetTemplate(f, y, !1, !1);
                this._addScopeLevel(), this._emitLine(M + ".getExported(" + (f.withContext ? "context.getVariables(), frame, " : "") + this._makeCallback(M)), this._addScopeLevel(), f.names.children.forEach(function(S) {
                  var E, T, _ = v._tmpid();
                  S instanceof g.Pair ? (E = S.key.value, T = S.value.value) : (E = S.value, T = E), v._emitLine("if(Object.prototype.hasOwnProperty.call(" + M + ', "' + E + '")) {'), v._emitLine("var " + _ + " = " + M + "." + E + ";"), v._emitLine("} else {"), v._emitLine(`cb(new Error("cannot import '` + E + `'")); return;`), v._emitLine("}"), y.set(T, _), y.parent ? v._emitLine('frame.set("' + T + '", ' + _ + ");") : v._emitLine('context.setVariable("' + T + '", ' + _ + ");");
                });
              }, w.compileBlock = function(f) {
                var y = this._tmpid();
                this.inBlock || this._emit('(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : '), this._emit('context.getBlock("' + f.name.value + '")'), this.inBlock || this._emit(")"), this._emitLine("(env, context, frame, runtime, " + this._makeCallback(y)), this._emitLine(this.buffer + " += " + y + ";"), this._addScopeLevel();
              }, w.compileSuper = function(f, y) {
                var v = f.blockName.value, M = f.symbol.value, S = this._makeCallback(M);
                this._emitLine('context.getSuper(env, "' + v + '", b_' + v + ", frame, runtime, " + S), this._emitLine(M + " = runtime.markSafe(" + M + ");"), this._addScopeLevel(), y.set(M, M);
              }, w.compileExtends = function(f, y) {
                var v = this._tmpid(), M = this._compileGetTemplate(f, y, !0, !1);
                this._emitLine("parentTemplate = " + M), this._emitLine("for(var " + v + " in parentTemplate.blocks) {"), this._emitLine("context.addBlock(" + v + ", parentTemplate.blocks[" + v + "]);"), this._emitLine("}"), this._addScopeLevel();
              }, w.compileInclude = function(f, y) {
                this._emitLine("var tasks = [];"), this._emitLine("tasks.push("), this._emitLine("function(callback) {");
                var v = this._compileGetTemplate(f, y, !1, f.ignoreMissing);
                this._emitLine("callback(null," + v + ");});"), this._emitLine("});");
                var M = this._tmpid();
                this._emitLine("tasks.push("), this._emitLine("function(template, callback){"), this._emitLine("template.render(context.getVariables(), frame, " + this._makeCallback(M)), this._emitLine("callback(null," + M + ");});"), this._emitLine("});"), this._emitLine("tasks.push("), this._emitLine("function(result, callback){"), this._emitLine(this.buffer + " += result;"), this._emitLine("callback(null);"), this._emitLine("});"), this._emitLine("env.waterfall(tasks, function(){"), this._addScopeLevel();
              }, w.compileTemplateData = function(f, y) {
                this.compileLiteral(f, y);
              }, w.compileCapture = function(f, y) {
                var v = this, M = this.buffer;
                this.buffer = "output", this._emitLine("(function() {"), this._emitLine('var output = "";'), this._withScopedSyntax(function() {
                  v.compile(f.body, y);
                }), this._emitLine("return output;"), this._emitLine("})()"), this.buffer = M;
              }, w.compileOutput = function(f, y) {
                var v = this, M = f.children;
                M.forEach(function(S) {
                  S instanceof g.TemplateData ? S.value && (v._emit(v.buffer + " += "), v.compileLiteral(S, y), v._emitLine(";")) : (v._emit(v.buffer + " += runtime.suppressValue("), v.throwOnUndefined && v._emit("runtime.ensureDefined("), v.compile(S, y), v.throwOnUndefined && v._emit("," + f.lineno + "," + f.colno + ")"), v._emit(`, env.opts.autoescape);
`));
                });
              }, w.compileRoot = function(f, y) {
                var v = this;
                y && this.fail("compileRoot: root node can't have frame"), y = new p(), this._emitFuncBegin(f, "root"), this._emitLine("var parentTemplate = null;"), this._compileChildren(f, y), this._emitLine("if(parentTemplate) {"), this._emitLine("parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);"), this._emitLine("} else {"), this._emitLine("cb(null, " + this.buffer + ");"), this._emitLine("}"), this._emitFuncEnd(!0), this.inBlock = !0;
                var M = [], S = f.findAll(g.Block);
                S.forEach(function(E, T) {
                  var _ = E.name.value;
                  if (M.indexOf(_) !== -1)
                    throw new Error('Block "' + _ + '" defined more than once.');
                  M.push(_), v._emitFuncBegin(E, "b_" + _);
                  var L = new p();
                  v._emitLine("var frame = frame.push(true);"), v.compile(E.body, L), v._emitFuncEnd();
                }), this._emitLine("return {"), S.forEach(function(E, T) {
                  var _ = "b_" + E.name.value;
                  v._emitLine(_ + ": " + _ + ",");
                }), this._emitLine(`root: root
};`);
              }, w.compile = function(f, y) {
                var v = this["compile" + f.typename];
                v ? v.call(this, f, y) : this.fail("compile: Cannot compile node: " + f.typename, f.lineno, f.colno);
              }, w.getCode = function() {
                return this.codebuf.join("");
              }, x;
            })(l);
            e.exports = {
              compile: function(d, x, w, f, y) {
                y === void 0 && (y = {});
                var v = new C(f, y.throwOnUndefined), M = (w || []).map(function(E) {
                  return E.preprocess;
                }).filter(function(E) {
                  return !!E;
                }), S = M.reduce(function(E, T) {
                  return T(E);
                }, d);
                return v.compile(a.transform(A.parse(S, w, y), x, f)), v.getCode();
              },
              Compiler: C
            };
          }),
          /* 6 */
          /***/
          (function(e, i, r) {
            function s(c, u) {
              c.prototype = Object.create(u.prototype), c.prototype.constructor = c, o(c, u);
            }
            function o(c, u) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(h, p) {
                return h.__proto__ = p, h;
              }, o(c, u);
            }
            var A = r(4), a = r(1), g = a.EmitterObj;
            e.exports = /* @__PURE__ */ (function(c) {
              s(u, c);
              function u() {
                return c.apply(this, arguments) || this;
              }
              var h = u.prototype;
              return h.resolve = function(p, m) {
                return A.resolve(A.dirname(p), m);
              }, h.isRelative = function(p) {
                return p.indexOf("./") === 0 || p.indexOf("../") === 0;
              }, u;
            })(g);
          }),
          /* 7 */
          /***/
          (function(e, i, r) {
            function s(D, F) {
              D.prototype = Object.create(F.prototype), D.prototype.constructor = D, o(D, F);
            }
            function o(D, F) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(z, k) {
                return z.__proto__ = k, z;
              }, o(D, F);
            }
            var A = r(12), a = r(15), g = r(0), c = r(5), u = r(18), h = r(10), p = h.FileSystemLoader, m = h.WebLoader, l = h.PrecompiledLoader, I = r(20), C = r(21), d = r(1), x = d.Obj, w = d.EmitterObj, f = r(2), y = f.handleError, v = f.Frame, M = r(22);
            function S(D, F, z) {
              A(function() {
                D(F, z);
              });
            }
            var E = {
              type: "code",
              obj: {
                root: function(D, F, z, k, N) {
                  try {
                    N(null, "");
                  } catch (O) {
                    N(y(O, null, null));
                  }
                }
              }
            }, T = /* @__PURE__ */ (function(D) {
              s(F, D);
              function F() {
                return D.apply(this, arguments) || this;
              }
              var z = F.prototype;
              return z.init = function(k, N) {
                var O = this;
                N = this.opts = N || {}, this.opts.dev = !!N.dev, this.opts.autoescape = N.autoescape != null ? N.autoescape : !0, this.opts.throwOnUndefined = !!N.throwOnUndefined, this.opts.trimBlocks = !!N.trimBlocks, this.opts.lstripBlocks = !!N.lstripBlocks, this.loaders = [], k ? this.loaders = g.isArray(k) ? k : [k] : p ? this.loaders = [new p("views")] : m && (this.loaders = [new m("/views")]), typeof window < "u" && window.nunjucksPrecompiled && this.loaders.unshift(new l(window.nunjucksPrecompiled)), this._initLoaders(), this.globals = C(), this.filters = {}, this.tests = {}, this.asyncFilters = [], this.extensions = {}, this.extensionsList = [], g._entries(u).forEach(function(X) {
                  var Z = X[0], W = X[1];
                  return O.addFilter(Z, W);
                }), g._entries(I).forEach(function(X) {
                  var Z = X[0], W = X[1];
                  return O.addTest(Z, W);
                });
              }, z._initLoaders = function() {
                var k = this;
                this.loaders.forEach(function(N) {
                  N.cache = {}, typeof N.on == "function" && (N.on("update", function(O, X) {
                    N.cache[O] = null, k.emit("update", O, X, N);
                  }), N.on("load", function(O, X) {
                    k.emit("load", O, X, N);
                  }));
                });
              }, z.invalidateCache = function() {
                this.loaders.forEach(function(k) {
                  k.cache = {};
                });
              }, z.addExtension = function(k, N) {
                return N.__name = k, this.extensions[k] = N, this.extensionsList.push(N), this;
              }, z.removeExtension = function(k) {
                var N = this.getExtension(k);
                N && (this.extensionsList = g.without(this.extensionsList, N), delete this.extensions[k]);
              }, z.getExtension = function(k) {
                return this.extensions[k];
              }, z.hasExtension = function(k) {
                return !!this.extensions[k];
              }, z.addGlobal = function(k, N) {
                return this.globals[k] = N, this;
              }, z.getGlobal = function(k) {
                if (typeof this.globals[k] > "u")
                  throw new Error("global not found: " + k);
                return this.globals[k];
              }, z.addFilter = function(k, N, O) {
                var X = N;
                return O && this.asyncFilters.push(k), this.filters[k] = X, this;
              }, z.getFilter = function(k) {
                if (!this.filters[k])
                  throw new Error("filter not found: " + k);
                return this.filters[k];
              }, z.addTest = function(k, N) {
                return this.tests[k] = N, this;
              }, z.getTest = function(k) {
                if (!this.tests[k])
                  throw new Error("test not found: " + k);
                return this.tests[k];
              }, z.resolveTemplate = function(k, N, O) {
                var X = k.isRelative && N ? k.isRelative(O) : !1;
                return X && k.resolve ? k.resolve(N, O) : O;
              }, z.getTemplate = function(k, N, O, X, Z) {
                var W = this, st = this, rt = null;
                if (k && k.raw && (k = k.raw), g.isFunction(O) && (Z = O, O = null, N = N || !1), g.isFunction(N) && (Z = N, N = !1), k instanceof L)
                  rt = k;
                else {
                  if (typeof k != "string")
                    throw new Error("template names must be a string: " + k);
                  for (var at = 0; at < this.loaders.length; at++) {
                    var nt = this.loaders[at];
                    if (rt = nt.cache[this.resolveTemplate(nt, O, k)], rt)
                      break;
                  }
                }
                if (rt)
                  if (N && rt.compile(), Z) {
                    Z(null, rt);
                    return;
                  } else
                    return rt;
                var pt, At = function(Q, J) {
                  if (!J && !Q && !X && (Q = new Error("template not found: " + k)), Q)
                    if (Z) {
                      Z(Q);
                      return;
                    } else
                      throw Q;
                  var Y;
                  J ? (Y = new L(J.src, W, J.path, N), J.noCache || (J.loader.cache[k] = Y)) : Y = new L(E, W, "", N), Z ? Z(null, Y) : pt = Y;
                };
                return g.asyncIter(this.loaders, function(Q, J, Y, mt) {
                  function jt(ae, yt) {
                    ae ? mt(ae) : yt ? (yt.loader = Q, mt(null, yt)) : Y();
                  }
                  k = st.resolveTemplate(Q, O, k), Q.async ? Q.getSource(k, jt) : jt(null, Q.getSource(k));
                }, At), pt;
              }, z.express = function(k) {
                return M(this, k);
              }, z.render = function(k, N, O) {
                g.isFunction(N) && (O = N, N = null);
                var X = null;
                return this.getTemplate(k, function(Z, W) {
                  if (Z && O)
                    S(O, Z);
                  else {
                    if (Z)
                      throw Z;
                    X = W.render(N, O);
                  }
                }), X;
              }, z.renderString = function(k, N, O, X) {
                g.isFunction(O) && (X = O, O = {}), O = O || {};
                var Z = new L(k, this, O.path);
                return Z.render(N, X);
              }, z.waterfall = function(k, N, O) {
                return a(k, N, O);
              }, F;
            })(w), _ = /* @__PURE__ */ (function(D) {
              s(F, D);
              function F() {
                return D.apply(this, arguments) || this;
              }
              var z = F.prototype;
              return z.init = function(k, N, O) {
                var X = this;
                this.env = O || new T(), this.ctx = g.extend({}, k), this.blocks = {}, this.exported = [], g.keys(N).forEach(function(Z) {
                  X.addBlock(Z, N[Z]);
                });
              }, z.lookup = function(k) {
                return k in this.env.globals && !(k in this.ctx) ? this.env.globals[k] : this.ctx[k];
              }, z.setVariable = function(k, N) {
                this.ctx[k] = N;
              }, z.getVariables = function() {
                return this.ctx;
              }, z.addBlock = function(k, N) {
                return this.blocks[k] = this.blocks[k] || [], this.blocks[k].push(N), this;
              }, z.getBlock = function(k) {
                if (!this.blocks[k])
                  throw new Error('unknown block "' + k + '"');
                return this.blocks[k][0];
              }, z.getSuper = function(k, N, O, X, Z, W) {
                var st = g.indexOf(this.blocks[N] || [], O), rt = this.blocks[N][st + 1], at = this;
                if (st === -1 || !rt)
                  throw new Error('no super block available for "' + N + '"');
                rt(k, at, X, Z, W);
              }, z.addExport = function(k) {
                this.exported.push(k);
              }, z.getExported = function() {
                var k = this, N = {};
                return this.exported.forEach(function(O) {
                  N[O] = k.ctx[O];
                }), N;
              }, F;
            })(x), L = /* @__PURE__ */ (function(D) {
              s(F, D);
              function F() {
                return D.apply(this, arguments) || this;
              }
              var z = F.prototype;
              return z.init = function(k, N, O, X) {
                if (this.env = N || new T(), g.isObject(k))
                  switch (k.type) {
                    case "code":
                      this.tmplProps = k.obj;
                      break;
                    case "string":
                      this.tmplStr = k.obj;
                      break;
                    default:
                      throw new Error("Unexpected template object type " + k.type + "; expected 'code', or 'string'");
                  }
                else if (g.isString(k))
                  this.tmplStr = k;
                else
                  throw new Error("src must be a string or an object describing the source");
                if (this.path = O, X)
                  try {
                    this._compile();
                  } catch (Z) {
                    throw g._prettifyError(this.path, this.env.opts.dev, Z);
                  }
                else
                  this.compiled = !1;
              }, z.render = function(k, N, O) {
                var X = this;
                typeof k == "function" ? (O = k, k = {}) : typeof N == "function" && (O = N, N = null);
                var Z = !N;
                try {
                  this.compile();
                } catch (pt) {
                  var W = g._prettifyError(this.path, this.env.opts.dev, pt);
                  if (O)
                    return S(O, W);
                  throw W;
                }
                var st = new _(k || {}, this.blocks, this.env), rt = N ? N.push(!0) : new v();
                rt.topLevel = !0;
                var at = null, nt = !1;
                return this.rootRenderFunc(this.env, st, rt, f, function(pt, At) {
                  if (!(nt && O && typeof At < "u"))
                    if (pt && (pt = g._prettifyError(X.path, X.env.opts.dev, pt), nt = !0), O)
                      Z ? S(O, pt, At) : O(pt, At);
                    else {
                      if (pt)
                        throw pt;
                      at = At;
                    }
                }), at;
              }, z.getExported = function(k, N, O) {
                typeof k == "function" && (O = k, k = {}), typeof N == "function" && (O = N, N = null);
                try {
                  this.compile();
                } catch (W) {
                  if (O)
                    return O(W);
                  throw W;
                }
                var X = N ? N.push() : new v();
                X.topLevel = !0;
                var Z = new _(k || {}, this.blocks, this.env);
                this.rootRenderFunc(this.env, Z, X, f, function(W) {
                  W ? O(W, null) : O(null, Z.getExported());
                });
              }, z.compile = function() {
                this.compiled || this._compile();
              }, z._compile = function() {
                var k;
                if (this.tmplProps)
                  k = this.tmplProps;
                else {
                  var N = c.compile(this.tmplStr, this.env.asyncFilters, this.env.extensionsList, this.path, this.env.opts), O = new Function(N);
                  k = O();
                }
                this.blocks = this._getBlocks(k), this.rootRenderFunc = k.root, this.compiled = !0;
              }, z._getBlocks = function(k) {
                var N = {};
                return g.keys(k).forEach(function(O) {
                  O.slice(0, 2) === "b_" && (N[O.slice(2)] = k[O]);
                }), N;
              }, F;
            })(x);
            e.exports = {
              Environment: T,
              Template: L
            };
          }),
          /* 8 */
          /***/
          (function(e, i, r) {
            function s(h, p) {
              h.prototype = Object.create(p.prototype), h.prototype.constructor = h, o(h, p);
            }
            function o(h, p) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(m, l) {
                return m.__proto__ = l, m;
              }, o(h, p);
            }
            var A = r(9), a = r(3), g = r(1).Obj, c = r(0), u = /* @__PURE__ */ (function(h) {
              s(p, h);
              function p() {
                return h.apply(this, arguments) || this;
              }
              var m = p.prototype;
              return m.init = function(l) {
                this.tokens = l, this.peeked = null, this.breakOnBlocks = null, this.dropLeadingWhitespace = !1, this.extensions = [];
              }, m.nextToken = function(l) {
                var I;
                if (this.peeked)
                  if (!l && this.peeked.type === A.TOKEN_WHITESPACE)
                    this.peeked = null;
                  else
                    return I = this.peeked, this.peeked = null, I;
                if (I = this.tokens.nextToken(), !l)
                  for (; I && I.type === A.TOKEN_WHITESPACE; )
                    I = this.tokens.nextToken();
                return I;
              }, m.peekToken = function() {
                return this.peeked = this.peeked || this.nextToken(), this.peeked;
              }, m.pushToken = function(l) {
                if (this.peeked)
                  throw new Error("pushToken: can only push one token on between reads");
                this.peeked = l;
              }, m.error = function(l, I, C) {
                if (I === void 0 || C === void 0) {
                  var d = this.peekToken() || {};
                  I = d.lineno, C = d.colno;
                }
                return I !== void 0 && (I += 1), C !== void 0 && (C += 1), new c.TemplateError(l, I, C);
              }, m.fail = function(l, I, C) {
                throw this.error(l, I, C);
              }, m.skip = function(l) {
                var I = this.nextToken();
                return !I || I.type !== l ? (this.pushToken(I), !1) : !0;
              }, m.expect = function(l) {
                var I = this.nextToken();
                return I.type !== l && this.fail("expected " + l + ", got " + I.type, I.lineno, I.colno), I;
              }, m.skipValue = function(l, I) {
                var C = this.nextToken();
                return !C || C.type !== l || C.value !== I ? (this.pushToken(C), !1) : !0;
              }, m.skipSymbol = function(l) {
                return this.skipValue(A.TOKEN_SYMBOL, l);
              }, m.advanceAfterBlockEnd = function(l) {
                var I;
                return l || (I = this.peekToken(), I || this.fail("unexpected end of file"), I.type !== A.TOKEN_SYMBOL && this.fail("advanceAfterBlockEnd: expected symbol token or explicit name to be passed"), l = this.nextToken().value), I = this.nextToken(), I && I.type === A.TOKEN_BLOCK_END ? I.value.charAt(0) === "-" && (this.dropLeadingWhitespace = !0) : this.fail("expected block end in " + l + " statement"), I;
              }, m.advanceAfterVariableEnd = function() {
                var l = this.nextToken();
                l && l.type === A.TOKEN_VARIABLE_END ? this.dropLeadingWhitespace = l.value.charAt(l.value.length - this.tokens.tags.VARIABLE_END.length - 1) === "-" : (this.pushToken(l), this.fail("expected variable end"));
              }, m.parseFor = function() {
                var l = this.peekToken(), I, C;
                this.skipSymbol("for") ? (I = new a.For(l.lineno, l.colno), C = "endfor") : this.skipSymbol("asyncEach") ? (I = new a.AsyncEach(l.lineno, l.colno), C = "endeach") : this.skipSymbol("asyncAll") ? (I = new a.AsyncAll(l.lineno, l.colno), C = "endall") : this.fail("parseFor: expected for{Async}", l.lineno, l.colno), I.name = this.parsePrimary(), I.name instanceof a.Symbol || this.fail("parseFor: variable name expected for loop");
                var d = this.peekToken().type;
                if (d === A.TOKEN_COMMA) {
                  var x = I.name;
                  for (I.name = new a.Array(x.lineno, x.colno), I.name.addChild(x); this.skip(A.TOKEN_COMMA); ) {
                    var w = this.parsePrimary();
                    I.name.addChild(w);
                  }
                }
                return this.skipSymbol("in") || this.fail('parseFor: expected "in" keyword for loop', l.lineno, l.colno), I.arr = this.parseExpression(), this.advanceAfterBlockEnd(l.value), I.body = this.parseUntilBlocks(C, "else"), this.skipSymbol("else") && (this.advanceAfterBlockEnd("else"), I.else_ = this.parseUntilBlocks(C)), this.advanceAfterBlockEnd(), I;
              }, m.parseMacro = function() {
                var l = this.peekToken();
                this.skipSymbol("macro") || this.fail("expected macro");
                var I = this.parsePrimary(!0), C = this.parseSignature(), d = new a.Macro(l.lineno, l.colno, I, C);
                return this.advanceAfterBlockEnd(l.value), d.body = this.parseUntilBlocks("endmacro"), this.advanceAfterBlockEnd(), d;
              }, m.parseCall = function() {
                var l = this.peekToken();
                this.skipSymbol("call") || this.fail("expected call");
                var I = this.parseSignature(!0) || new a.NodeList(), C = this.parsePrimary();
                this.advanceAfterBlockEnd(l.value);
                var d = this.parseUntilBlocks("endcall");
                this.advanceAfterBlockEnd();
                var x = new a.Symbol(l.lineno, l.colno, "caller"), w = new a.Caller(l.lineno, l.colno, x, I, d), f = C.args.children;
                f[f.length - 1] instanceof a.KeywordArgs || f.push(new a.KeywordArgs());
                var y = f[f.length - 1];
                return y.addChild(new a.Pair(l.lineno, l.colno, x, w)), new a.Output(l.lineno, l.colno, [C]);
              }, m.parseWithContext = function() {
                var l = this.peekToken(), I = null;
                return this.skipSymbol("with") ? I = !0 : this.skipSymbol("without") && (I = !1), I !== null && (this.skipSymbol("context") || this.fail("parseFrom: expected context after with/without", l.lineno, l.colno)), I;
              }, m.parseImport = function() {
                var l = this.peekToken();
                this.skipSymbol("import") || this.fail("parseImport: expected import", l.lineno, l.colno);
                var I = this.parseExpression();
                this.skipSymbol("as") || this.fail('parseImport: expected "as" keyword', l.lineno, l.colno);
                var C = this.parseExpression(), d = this.parseWithContext(), x = new a.Import(l.lineno, l.colno, I, C, d);
                return this.advanceAfterBlockEnd(l.value), x;
              }, m.parseFrom = function() {
                var l = this.peekToken();
                this.skipSymbol("from") || this.fail("parseFrom: expected from");
                var I = this.parseExpression();
                this.skipSymbol("import") || this.fail("parseFrom: expected import", l.lineno, l.colno);
                for (var C = new a.NodeList(), d; ; ) {
                  var x = this.peekToken();
                  if (x.type === A.TOKEN_BLOCK_END) {
                    C.children.length || this.fail("parseFrom: Expected at least one import name", l.lineno, l.colno), x.value.charAt(0) === "-" && (this.dropLeadingWhitespace = !0), this.nextToken();
                    break;
                  }
                  C.children.length > 0 && !this.skip(A.TOKEN_COMMA) && this.fail("parseFrom: expected comma", l.lineno, l.colno);
                  var w = this.parsePrimary();
                  if (w.value.charAt(0) === "_" && this.fail("parseFrom: names starting with an underscore cannot be imported", w.lineno, w.colno), this.skipSymbol("as")) {
                    var f = this.parsePrimary();
                    C.addChild(new a.Pair(w.lineno, w.colno, w, f));
                  } else
                    C.addChild(w);
                  d = this.parseWithContext();
                }
                return new a.FromImport(l.lineno, l.colno, I, C, d);
              }, m.parseBlock = function() {
                var l = this.peekToken();
                this.skipSymbol("block") || this.fail("parseBlock: expected block", l.lineno, l.colno);
                var I = new a.Block(l.lineno, l.colno);
                I.name = this.parsePrimary(), I.name instanceof a.Symbol || this.fail("parseBlock: variable name expected", l.lineno, l.colno), this.advanceAfterBlockEnd(l.value), I.body = this.parseUntilBlocks("endblock"), this.skipSymbol("endblock"), this.skipSymbol(I.name.value);
                var C = this.peekToken();
                return C || this.fail("parseBlock: expected endblock, got end of file"), this.advanceAfterBlockEnd(C.value), I;
              }, m.parseExtends = function() {
                var l = "extends", I = this.peekToken();
                this.skipSymbol(l) || this.fail("parseTemplateRef: expected " + l);
                var C = new a.Extends(I.lineno, I.colno);
                return C.template = this.parseExpression(), this.advanceAfterBlockEnd(I.value), C;
              }, m.parseInclude = function() {
                var l = "include", I = this.peekToken();
                this.skipSymbol(l) || this.fail("parseInclude: expected " + l);
                var C = new a.Include(I.lineno, I.colno);
                return C.template = this.parseExpression(), this.skipSymbol("ignore") && this.skipSymbol("missing") && (C.ignoreMissing = !0), this.advanceAfterBlockEnd(I.value), C;
              }, m.parseIf = function() {
                var l = this.peekToken(), I;
                this.skipSymbol("if") || this.skipSymbol("elif") || this.skipSymbol("elseif") ? I = new a.If(l.lineno, l.colno) : this.skipSymbol("ifAsync") ? I = new a.IfAsync(l.lineno, l.colno) : this.fail("parseIf: expected if, elif, or elseif", l.lineno, l.colno), I.cond = this.parseExpression(), this.advanceAfterBlockEnd(l.value), I.body = this.parseUntilBlocks("elif", "elseif", "else", "endif");
                var C = this.peekToken();
                switch (C && C.value) {
                  case "elseif":
                  case "elif":
                    I.else_ = this.parseIf();
                    break;
                  case "else":
                    this.advanceAfterBlockEnd(), I.else_ = this.parseUntilBlocks("endif"), this.advanceAfterBlockEnd();
                    break;
                  case "endif":
                    I.else_ = null, this.advanceAfterBlockEnd();
                    break;
                  default:
                    this.fail("parseIf: expected elif, else, or endif, got end of file");
                }
                return I;
              }, m.parseSet = function() {
                var l = this.peekToken();
                this.skipSymbol("set") || this.fail("parseSet: expected set", l.lineno, l.colno);
                for (var I = new a.Set(l.lineno, l.colno, []), C; (C = this.parsePrimary()) && (I.targets.push(C), !!this.skip(A.TOKEN_COMMA)); )
                  ;
                return this.skipValue(A.TOKEN_OPERATOR, "=") ? (I.value = this.parseExpression(), this.advanceAfterBlockEnd(l.value)) : this.skip(A.TOKEN_BLOCK_END) ? (I.body = new a.Capture(l.lineno, l.colno, this.parseUntilBlocks("endset")), I.value = null, this.advanceAfterBlockEnd()) : this.fail("parseSet: expected = or block end in set tag", l.lineno, l.colno), I;
              }, m.parseSwitch = function() {
                var l = "switch", I = "endswitch", C = "case", d = "default", x = this.peekToken();
                !this.skipSymbol(l) && !this.skipSymbol(C) && !this.skipSymbol(d) && this.fail('parseSwitch: expected "switch," "case" or "default"', x.lineno, x.colno);
                var w = this.parseExpression();
                this.advanceAfterBlockEnd(l), this.parseUntilBlocks(C, d, I);
                var f = this.peekToken(), y = [], v;
                do {
                  this.skipSymbol(C);
                  var M = this.parseExpression();
                  this.advanceAfterBlockEnd(l);
                  var S = this.parseUntilBlocks(C, d, I);
                  y.push(new a.Case(f.line, f.col, M, S)), f = this.peekToken();
                } while (f && f.value === C);
                switch (f.value) {
                  case d:
                    this.advanceAfterBlockEnd(), v = this.parseUntilBlocks(I), this.advanceAfterBlockEnd();
                    break;
                  case I:
                    this.advanceAfterBlockEnd();
                    break;
                  default:
                    this.fail('parseSwitch: expected "case," "default" or "endswitch," got EOF.');
                }
                return new a.Switch(x.lineno, x.colno, w, y, v);
              }, m.parseStatement = function() {
                var l = this.peekToken(), I;
                if (l.type !== A.TOKEN_SYMBOL && this.fail("tag name expected", l.lineno, l.colno), this.breakOnBlocks && c.indexOf(this.breakOnBlocks, l.value) !== -1)
                  return null;
                switch (l.value) {
                  case "raw":
                    return this.parseRaw();
                  case "verbatim":
                    return this.parseRaw("verbatim");
                  case "if":
                  case "ifAsync":
                    return this.parseIf();
                  case "for":
                  case "asyncEach":
                  case "asyncAll":
                    return this.parseFor();
                  case "block":
                    return this.parseBlock();
                  case "extends":
                    return this.parseExtends();
                  case "include":
                    return this.parseInclude();
                  case "set":
                    return this.parseSet();
                  case "macro":
                    return this.parseMacro();
                  case "call":
                    return this.parseCall();
                  case "import":
                    return this.parseImport();
                  case "from":
                    return this.parseFrom();
                  case "filter":
                    return this.parseFilterStatement();
                  case "switch":
                    return this.parseSwitch();
                  default:
                    if (this.extensions.length)
                      for (var C = 0; C < this.extensions.length; C++) {
                        var d = this.extensions[C];
                        if (c.indexOf(d.tags || [], l.value) !== -1)
                          return d.parse(this, a, A);
                      }
                    this.fail("unknown block tag: " + l.value, l.lineno, l.colno);
                }
                return I;
              }, m.parseRaw = function(l) {
                l = l || "raw";
                for (var I = "end" + l, C = new RegExp("([\\s\\S]*?){%\\s*(" + l + "|" + I + ")\\s*(?=%})%}"), d = 1, x = "", w = null, f = this.advanceAfterBlockEnd(); (w = this.tokens._extractRegex(C)) && d > 0; ) {
                  var y = w[0], v = w[1], M = w[2];
                  M === l ? d += 1 : M === I && (d -= 1), d === 0 ? (x += v, this.tokens.backN(y.length - v.length)) : x += y;
                }
                return new a.Output(f.lineno, f.colno, [new a.TemplateData(f.lineno, f.colno, x)]);
              }, m.parsePostfix = function(l) {
                for (var I, C = this.peekToken(); C; ) {
                  if (C.type === A.TOKEN_LEFT_PAREN)
                    l = new a.FunCall(C.lineno, C.colno, l, this.parseSignature());
                  else if (C.type === A.TOKEN_LEFT_BRACKET)
                    I = this.parseAggregate(), I.children.length > 1 && this.fail("invalid index"), l = new a.LookupVal(C.lineno, C.colno, l, I.children[0]);
                  else if (C.type === A.TOKEN_OPERATOR && C.value === ".") {
                    this.nextToken();
                    var d = this.nextToken();
                    d.type !== A.TOKEN_SYMBOL && this.fail("expected name as lookup value, got " + d.value, d.lineno, d.colno), I = new a.Literal(d.lineno, d.colno, d.value), l = new a.LookupVal(C.lineno, C.colno, l, I);
                  } else
                    break;
                  C = this.peekToken();
                }
                return l;
              }, m.parseExpression = function() {
                var l = this.parseInlineIf();
                return l;
              }, m.parseInlineIf = function() {
                var l = this.parseOr();
                if (this.skipSymbol("if")) {
                  var I = this.parseOr(), C = l;
                  l = new a.InlineIf(l.lineno, l.colno), l.body = C, l.cond = I, this.skipSymbol("else") ? l.else_ = this.parseOr() : l.else_ = null;
                }
                return l;
              }, m.parseOr = function() {
                for (var l = this.parseAnd(); this.skipSymbol("or"); ) {
                  var I = this.parseAnd();
                  l = new a.Or(l.lineno, l.colno, l, I);
                }
                return l;
              }, m.parseAnd = function() {
                for (var l = this.parseNot(); this.skipSymbol("and"); ) {
                  var I = this.parseNot();
                  l = new a.And(l.lineno, l.colno, l, I);
                }
                return l;
              }, m.parseNot = function() {
                var l = this.peekToken();
                return this.skipSymbol("not") ? new a.Not(l.lineno, l.colno, this.parseNot()) : this.parseIn();
              }, m.parseIn = function() {
                for (var l = this.parseIs(); ; ) {
                  var I = this.nextToken();
                  if (!I)
                    break;
                  var C = I.type === A.TOKEN_SYMBOL && I.value === "not";
                  if (C || this.pushToken(I), this.skipSymbol("in")) {
                    var d = this.parseIs();
                    l = new a.In(l.lineno, l.colno, l, d), C && (l = new a.Not(l.lineno, l.colno, l));
                  } else {
                    C && this.pushToken(I);
                    break;
                  }
                }
                return l;
              }, m.parseIs = function() {
                var l = this.parseCompare();
                if (this.skipSymbol("is")) {
                  var I = this.skipSymbol("not"), C = this.parseCompare();
                  l = new a.Is(l.lineno, l.colno, l, C), I && (l = new a.Not(l.lineno, l.colno, l));
                }
                return l;
              }, m.parseCompare = function() {
                for (var l = ["==", "===", "!=", "!==", "<", ">", "<=", ">="], I = this.parseConcat(), C = []; ; ) {
                  var d = this.nextToken();
                  if (d)
                    if (l.indexOf(d.value) !== -1)
                      C.push(new a.CompareOperand(d.lineno, d.colno, this.parseConcat(), d.value));
                    else {
                      this.pushToken(d);
                      break;
                    }
                  else break;
                }
                return C.length ? new a.Compare(C[0].lineno, C[0].colno, I, C) : I;
              }, m.parseConcat = function() {
                for (var l = this.parseAdd(); this.skipValue(A.TOKEN_TILDE, "~"); ) {
                  var I = this.parseAdd();
                  l = new a.Concat(l.lineno, l.colno, l, I);
                }
                return l;
              }, m.parseAdd = function() {
                for (var l = this.parseSub(); this.skipValue(A.TOKEN_OPERATOR, "+"); ) {
                  var I = this.parseSub();
                  l = new a.Add(l.lineno, l.colno, l, I);
                }
                return l;
              }, m.parseSub = function() {
                for (var l = this.parseMul(); this.skipValue(A.TOKEN_OPERATOR, "-"); ) {
                  var I = this.parseMul();
                  l = new a.Sub(l.lineno, l.colno, l, I);
                }
                return l;
              }, m.parseMul = function() {
                for (var l = this.parseDiv(); this.skipValue(A.TOKEN_OPERATOR, "*"); ) {
                  var I = this.parseDiv();
                  l = new a.Mul(l.lineno, l.colno, l, I);
                }
                return l;
              }, m.parseDiv = function() {
                for (var l = this.parseFloorDiv(); this.skipValue(A.TOKEN_OPERATOR, "/"); ) {
                  var I = this.parseFloorDiv();
                  l = new a.Div(l.lineno, l.colno, l, I);
                }
                return l;
              }, m.parseFloorDiv = function() {
                for (var l = this.parseMod(); this.skipValue(A.TOKEN_OPERATOR, "//"); ) {
                  var I = this.parseMod();
                  l = new a.FloorDiv(l.lineno, l.colno, l, I);
                }
                return l;
              }, m.parseMod = function() {
                for (var l = this.parsePow(); this.skipValue(A.TOKEN_OPERATOR, "%"); ) {
                  var I = this.parsePow();
                  l = new a.Mod(l.lineno, l.colno, l, I);
                }
                return l;
              }, m.parsePow = function() {
                for (var l = this.parseUnary(); this.skipValue(A.TOKEN_OPERATOR, "**"); ) {
                  var I = this.parseUnary();
                  l = new a.Pow(l.lineno, l.colno, l, I);
                }
                return l;
              }, m.parseUnary = function(l) {
                var I = this.peekToken(), C;
                return this.skipValue(A.TOKEN_OPERATOR, "-") ? C = new a.Neg(I.lineno, I.colno, this.parseUnary(!0)) : this.skipValue(A.TOKEN_OPERATOR, "+") ? C = new a.Pos(I.lineno, I.colno, this.parseUnary(!0)) : C = this.parsePrimary(), l || (C = this.parseFilter(C)), C;
              }, m.parsePrimary = function(l) {
                var I = this.nextToken(), C, d = null;
                if (I ? I.type === A.TOKEN_STRING ? C = I.value : I.type === A.TOKEN_INT ? C = parseInt(I.value, 10) : I.type === A.TOKEN_FLOAT ? C = parseFloat(I.value) : I.type === A.TOKEN_BOOLEAN ? I.value === "true" ? C = !0 : I.value === "false" ? C = !1 : this.fail("invalid boolean: " + I.value, I.lineno, I.colno) : I.type === A.TOKEN_NONE ? C = null : I.type === A.TOKEN_REGEX && (C = new RegExp(I.value.body, I.value.flags)) : this.fail("expected expression, got end of file"), C !== void 0 ? d = new a.Literal(I.lineno, I.colno, C) : I.type === A.TOKEN_SYMBOL ? d = new a.Symbol(I.lineno, I.colno, I.value) : (this.pushToken(I), d = this.parseAggregate()), l || (d = this.parsePostfix(d)), d)
                  return d;
                throw this.error("unexpected token: " + I.value, I.lineno, I.colno);
              }, m.parseFilterName = function() {
                for (var l = this.expect(A.TOKEN_SYMBOL), I = l.value; this.skipValue(A.TOKEN_OPERATOR, "."); )
                  I += "." + this.expect(A.TOKEN_SYMBOL).value;
                return new a.Symbol(l.lineno, l.colno, I);
              }, m.parseFilterArgs = function(l) {
                if (this.peekToken().type === A.TOKEN_LEFT_PAREN) {
                  var I = this.parsePostfix(l);
                  return I.args.children;
                }
                return [];
              }, m.parseFilter = function(l) {
                for (; this.skip(A.TOKEN_PIPE); ) {
                  var I = this.parseFilterName();
                  l = new a.Filter(I.lineno, I.colno, I, new a.NodeList(I.lineno, I.colno, [l].concat(this.parseFilterArgs(l))));
                }
                return l;
              }, m.parseFilterStatement = function() {
                var l = this.peekToken();
                this.skipSymbol("filter") || this.fail("parseFilterStatement: expected filter");
                var I = this.parseFilterName(), C = this.parseFilterArgs(I);
                this.advanceAfterBlockEnd(l.value);
                var d = new a.Capture(I.lineno, I.colno, this.parseUntilBlocks("endfilter"));
                this.advanceAfterBlockEnd();
                var x = new a.Filter(I.lineno, I.colno, I, new a.NodeList(I.lineno, I.colno, [d].concat(C)));
                return new a.Output(I.lineno, I.colno, [x]);
              }, m.parseAggregate = function() {
                var l = this.nextToken(), I;
                switch (l.type) {
                  case A.TOKEN_LEFT_PAREN:
                    I = new a.Group(l.lineno, l.colno);
                    break;
                  case A.TOKEN_LEFT_BRACKET:
                    I = new a.Array(l.lineno, l.colno);
                    break;
                  case A.TOKEN_LEFT_CURLY:
                    I = new a.Dict(l.lineno, l.colno);
                    break;
                  default:
                    return null;
                }
                for (; ; ) {
                  var C = this.peekToken().type;
                  if (C === A.TOKEN_RIGHT_PAREN || C === A.TOKEN_RIGHT_BRACKET || C === A.TOKEN_RIGHT_CURLY) {
                    this.nextToken();
                    break;
                  }
                  if (I.children.length > 0 && (this.skip(A.TOKEN_COMMA) || this.fail("parseAggregate: expected comma after expression", l.lineno, l.colno)), I instanceof a.Dict) {
                    var d = this.parsePrimary();
                    this.skip(A.TOKEN_COLON) || this.fail("parseAggregate: expected colon after dict key", l.lineno, l.colno);
                    var x = this.parseExpression();
                    I.addChild(new a.Pair(d.lineno, d.colno, d, x));
                  } else {
                    var w = this.parseExpression();
                    I.addChild(w);
                  }
                }
                return I;
              }, m.parseSignature = function(l, I) {
                var C = this.peekToken();
                if (!I && C.type !== A.TOKEN_LEFT_PAREN) {
                  if (l)
                    return null;
                  this.fail("expected arguments", C.lineno, C.colno);
                }
                C.type === A.TOKEN_LEFT_PAREN && (C = this.nextToken());
                for (var d = new a.NodeList(C.lineno, C.colno), x = new a.KeywordArgs(C.lineno, C.colno), w = !1; ; ) {
                  if (C = this.peekToken(), !I && C.type === A.TOKEN_RIGHT_PAREN) {
                    this.nextToken();
                    break;
                  } else if (I && C.type === A.TOKEN_BLOCK_END)
                    break;
                  if (w && !this.skip(A.TOKEN_COMMA))
                    this.fail("parseSignature: expected comma after expression", C.lineno, C.colno);
                  else {
                    var f = this.parseExpression();
                    this.skipValue(A.TOKEN_OPERATOR, "=") ? x.addChild(new a.Pair(f.lineno, f.colno, f, this.parseExpression())) : d.addChild(f);
                  }
                  w = !0;
                }
                return x.children.length && d.addChild(x), d;
              }, m.parseUntilBlocks = function() {
                for (var l = this.breakOnBlocks, I = arguments.length, C = new Array(I), d = 0; d < I; d++)
                  C[d] = arguments[d];
                this.breakOnBlocks = C;
                var x = this.parse();
                return this.breakOnBlocks = l, x;
              }, m.parseNodes = function() {
                for (var l, I = []; l = this.nextToken(); )
                  if (l.type === A.TOKEN_DATA) {
                    var C = l.value, d = this.peekToken(), x = d && d.value;
                    this.dropLeadingWhitespace && (C = C.replace(/^\s*/, ""), this.dropLeadingWhitespace = !1), d && (d.type === A.TOKEN_BLOCK_START && x.charAt(x.length - 1) === "-" || d.type === A.TOKEN_VARIABLE_START && x.charAt(this.tokens.tags.VARIABLE_START.length) === "-" || d.type === A.TOKEN_COMMENT && x.charAt(this.tokens.tags.COMMENT_START.length) === "-") && (C = C.replace(/\s*$/, "")), I.push(new a.Output(l.lineno, l.colno, [new a.TemplateData(l.lineno, l.colno, C)]));
                  } else if (l.type === A.TOKEN_BLOCK_START) {
                    this.dropLeadingWhitespace = !1;
                    var w = this.parseStatement();
                    if (!w)
                      break;
                    I.push(w);
                  } else if (l.type === A.TOKEN_VARIABLE_START) {
                    var f = this.parseExpression();
                    this.dropLeadingWhitespace = !1, this.advanceAfterVariableEnd(), I.push(new a.Output(l.lineno, l.colno, [f]));
                  } else l.type === A.TOKEN_COMMENT ? this.dropLeadingWhitespace = l.value.charAt(l.value.length - this.tokens.tags.COMMENT_END.length - 1) === "-" : this.fail("Unexpected token at top-level: " + l.type, l.lineno, l.colno);
                return I;
              }, m.parse = function() {
                return new a.NodeList(0, 0, this.parseNodes());
              }, m.parseAsRoot = function() {
                return new a.Root(0, 0, this.parseNodes());
              }, p;
            })(g);
            e.exports = {
              parse: function(h, p, m) {
                var l = new u(A.lex(h, m));
                return p !== void 0 && (l.extensions = p), l.parseAsRoot();
              },
              Parser: u
            };
          }),
          /* 9 */
          /***/
          (function(e, i, r) {
            var s = r(0), o = ` 
	\r `, A = "()[]{}%*-+~/#,:|.<>=!", a = "0123456789", g = "{%", c = "%}", u = "{{", h = "}}", p = "{#", m = "#}", l = "string", I = "whitespace", C = "data", d = "block-start", x = "block-end", w = "variable-start", f = "variable-end", y = "comment", v = "left-paren", M = "right-paren", S = "left-bracket", E = "right-bracket", T = "left-curly", _ = "right-curly", L = "operator", D = "comma", F = "colon", z = "tilde", k = "pipe", N = "int", O = "float", X = "boolean", Z = "none", W = "symbol", st = "special", rt = "regex";
            function at(pt, At, Q, J) {
              return {
                type: pt,
                value: At,
                lineno: Q,
                colno: J
              };
            }
            var nt = /* @__PURE__ */ (function() {
              function pt(Q, J) {
                this.str = Q, this.index = 0, this.len = Q.length, this.lineno = 0, this.colno = 0, this.in_code = !1, J = J || {};
                var Y = J.tags || {};
                this.tags = {
                  BLOCK_START: Y.blockStart || g,
                  BLOCK_END: Y.blockEnd || c,
                  VARIABLE_START: Y.variableStart || u,
                  VARIABLE_END: Y.variableEnd || h,
                  COMMENT_START: Y.commentStart || p,
                  COMMENT_END: Y.commentEnd || m
                }, this.trimBlocks = !!J.trimBlocks, this.lstripBlocks = !!J.lstripBlocks;
              }
              var At = pt.prototype;
              return At.nextToken = function() {
                var Q = this.lineno, J = this.colno, Y;
                if (this.in_code) {
                  var mt = this.current();
                  if (this.isFinished())
                    return null;
                  if (mt === '"' || mt === "'")
                    return at(l, this._parseString(mt), Q, J);
                  if (Y = this._extract(o))
                    return at(I, Y, Q, J);
                  if ((Y = this._extractString(this.tags.BLOCK_END)) || (Y = this._extractString("-" + this.tags.BLOCK_END)))
                    return this.in_code = !1, this.trimBlocks && (mt = this.current(), mt === `
` ? this.forward() : mt === "\r" && (this.forward(), mt = this.current(), mt === `
` ? this.forward() : this.back())), at(x, Y, Q, J);
                  if ((Y = this._extractString(this.tags.VARIABLE_END)) || (Y = this._extractString("-" + this.tags.VARIABLE_END)))
                    return this.in_code = !1, at(f, Y, Q, J);
                  if (mt === "r" && this.str.charAt(this.index + 1) === "/") {
                    this.forwardN(2);
                    for (var jt = ""; !this.isFinished(); )
                      if (this.current() === "/" && this.previous() !== "\\") {
                        this.forward();
                        break;
                      } else
                        jt += this.current(), this.forward();
                    for (var ae = ["g", "i", "m", "y"], yt = ""; !this.isFinished(); ) {
                      var Ct = ae.indexOf(this.current()) !== -1;
                      if (Ct)
                        yt += this.current(), this.forward();
                      else
                        break;
                    }
                    return at(rt, {
                      body: jt,
                      flags: yt
                    }, Q, J);
                  } else if (A.indexOf(mt) !== -1) {
                    this.forward();
                    var P = ["==", "===", "!=", "!==", "<=", ">=", "//", "**"], B = mt + this.current(), V;
                    switch (s.indexOf(P, B) !== -1 && (this.forward(), mt = B, s.indexOf(P, B + this.current()) !== -1 && (mt = B + this.current(), this.forward())), mt) {
                      case "(":
                        V = v;
                        break;
                      case ")":
                        V = M;
                        break;
                      case "[":
                        V = S;
                        break;
                      case "]":
                        V = E;
                        break;
                      case "{":
                        V = T;
                        break;
                      case "}":
                        V = _;
                        break;
                      case ",":
                        V = D;
                        break;
                      case ":":
                        V = F;
                        break;
                      case "~":
                        V = z;
                        break;
                      case "|":
                        V = k;
                        break;
                      default:
                        V = L;
                    }
                    return at(V, mt, Q, J);
                  } else if (Y = this._extractUntil(o + A), Y.match(/^[-+]?[0-9]+$/))
                    if (this.current() === ".") {
                      this.forward();
                      var H = this._extract(a);
                      return at(O, Y + "." + H, Q, J);
                    } else
                      return at(N, Y, Q, J);
                  else {
                    if (Y.match(/^(true|false)$/))
                      return at(X, Y, Q, J);
                    if (Y === "none" || Y === "null")
                      return at(Z, Y, Q, J);
                    if (Y)
                      return at(W, Y, Q, J);
                    throw new Error("Unexpected value while parsing: " + Y);
                  }
                } else {
                  var it = this.tags.BLOCK_START.charAt(0) + this.tags.VARIABLE_START.charAt(0) + this.tags.COMMENT_START.charAt(0) + this.tags.COMMENT_END.charAt(0);
                  if (this.isFinished())
                    return null;
                  if ((Y = this._extractString(this.tags.BLOCK_START + "-")) || (Y = this._extractString(this.tags.BLOCK_START)))
                    return this.in_code = !0, at(d, Y, Q, J);
                  if ((Y = this._extractString(this.tags.VARIABLE_START + "-")) || (Y = this._extractString(this.tags.VARIABLE_START)))
                    return this.in_code = !0, at(w, Y, Q, J);
                  Y = "";
                  var tt, gt = !1;
                  for (this._matches(this.tags.COMMENT_START) && (gt = !0, Y = this._extractString(this.tags.COMMENT_START)); (tt = this._extractUntil(it)) !== null; )
                    if (Y += tt, (this._matches(this.tags.BLOCK_START) || this._matches(this.tags.VARIABLE_START) || this._matches(this.tags.COMMENT_START)) && !gt) {
                      if (this.lstripBlocks && this._matches(this.tags.BLOCK_START) && this.colno > 0 && this.colno <= Y.length) {
                        var ot = Y.slice(-this.colno);
                        if (/^\s+$/.test(ot) && (Y = Y.slice(0, -this.colno), !Y.length))
                          return this.nextToken();
                      }
                      break;
                    } else if (this._matches(this.tags.COMMENT_END)) {
                      if (!gt)
                        throw new Error("unexpected end of comment");
                      Y += this._extractString(this.tags.COMMENT_END);
                      break;
                    } else
                      Y += this.current(), this.forward();
                  if (tt === null && gt)
                    throw new Error("expected end of comment, got end of file");
                  return at(gt ? y : C, Y, Q, J);
                }
              }, At._parseString = function(Q) {
                this.forward();
                for (var J = ""; !this.isFinished() && this.current() !== Q; ) {
                  var Y = this.current();
                  if (Y === "\\") {
                    switch (this.forward(), this.current()) {
                      case "n":
                        J += `
`;
                        break;
                      case "t":
                        J += "	";
                        break;
                      case "r":
                        J += "\r";
                        break;
                      default:
                        J += this.current();
                    }
                    this.forward();
                  } else
                    J += Y, this.forward();
                }
                return this.forward(), J;
              }, At._matches = function(Q) {
                if (this.index + Q.length > this.len)
                  return null;
                var J = this.str.slice(this.index, this.index + Q.length);
                return J === Q;
              }, At._extractString = function(Q) {
                return this._matches(Q) ? (this.forwardN(Q.length), Q) : null;
              }, At._extractUntil = function(Q) {
                return this._extractMatching(!0, Q || "");
              }, At._extract = function(Q) {
                return this._extractMatching(!1, Q);
              }, At._extractMatching = function(Q, J) {
                if (this.isFinished())
                  return null;
                var Y = J.indexOf(this.current());
                if (Q && Y === -1 || !Q && Y !== -1) {
                  var mt = this.current();
                  this.forward();
                  for (var jt = J.indexOf(this.current()); (Q && jt === -1 || !Q && jt !== -1) && !this.isFinished(); )
                    mt += this.current(), this.forward(), jt = J.indexOf(this.current());
                  return mt;
                }
                return "";
              }, At._extractRegex = function(Q) {
                var J = this.currentStr().match(Q);
                return J ? (this.forwardN(J[0].length), J) : null;
              }, At.isFinished = function() {
                return this.index >= this.len;
              }, At.forwardN = function(Q) {
                for (var J = 0; J < Q; J++)
                  this.forward();
              }, At.forward = function() {
                this.index++, this.previous() === `
` ? (this.lineno++, this.colno = 0) : this.colno++;
              }, At.backN = function(Q) {
                for (var J = 0; J < Q; J++)
                  this.back();
              }, At.back = function() {
                if (this.index--, this.current() === `
`) {
                  this.lineno--;
                  var Q = this.src.lastIndexOf(`
`, this.index - 1);
                  Q === -1 ? this.colno = this.index : this.colno = this.index - Q;
                } else
                  this.colno--;
              }, At.current = function() {
                return this.isFinished() ? "" : this.str.charAt(this.index);
              }, At.currentStr = function() {
                return this.isFinished() ? "" : this.str.substr(this.index);
              }, At.previous = function() {
                return this.str.charAt(this.index - 1);
              }, pt;
            })();
            e.exports = {
              lex: function(pt, At) {
                return new nt(pt, At);
              },
              TOKEN_STRING: l,
              TOKEN_WHITESPACE: I,
              TOKEN_DATA: C,
              TOKEN_BLOCK_START: d,
              TOKEN_BLOCK_END: x,
              TOKEN_VARIABLE_START: w,
              TOKEN_VARIABLE_END: f,
              TOKEN_COMMENT: y,
              TOKEN_LEFT_PAREN: v,
              TOKEN_RIGHT_PAREN: M,
              TOKEN_LEFT_BRACKET: S,
              TOKEN_RIGHT_BRACKET: E,
              TOKEN_LEFT_CURLY: T,
              TOKEN_RIGHT_CURLY: _,
              TOKEN_OPERATOR: L,
              TOKEN_COMMA: D,
              TOKEN_COLON: F,
              TOKEN_TILDE: z,
              TOKEN_PIPE: k,
              TOKEN_INT: N,
              TOKEN_FLOAT: O,
              TOKEN_BOOLEAN: X,
              TOKEN_NONE: Z,
              TOKEN_SYMBOL: W,
              TOKEN_SPECIAL: st,
              TOKEN_REGEX: rt
            };
          }),
          /* 10 */
          /***/
          (function(e, i, r) {
            function s(u, h) {
              u.prototype = Object.create(h.prototype), u.prototype.constructor = u, o(u, h);
            }
            function o(u, h) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(p, m) {
                return p.__proto__ = m, p;
              }, o(u, h);
            }
            var A = r(6), a = r(19), g = a.PrecompiledLoader, c = /* @__PURE__ */ (function(u) {
              s(h, u);
              function h(m, l) {
                var I;
                return I = u.call(this) || this, I.baseURL = m || ".", l = l || {}, I.useCache = !!l.useCache, I.async = !!l.async, I;
              }
              var p = h.prototype;
              return p.resolve = function(m, l) {
                throw new Error("relative templates not support in the browser yet");
              }, p.getSource = function(m, l) {
                var I = this, C = this.useCache, d;
                return this.fetch(this.baseURL + "/" + m, function(x, w) {
                  if (x)
                    if (l)
                      l(x.content);
                    else if (x.status === 404)
                      d = null;
                    else
                      throw x.content;
                  else
                    d = {
                      src: w,
                      path: m,
                      noCache: !C
                    }, I.emit("load", m, d), l && l(null, d);
                }), d;
              }, p.fetch = function(m, l) {
                if (typeof window > "u")
                  throw new Error("WebLoader can only by used in a browser");
                var I = new XMLHttpRequest(), C = !0;
                I.onreadystatechange = function() {
                  I.readyState === 4 && C && (C = !1, I.status === 0 || I.status === 200 ? l(null, I.responseText) : l({
                    status: I.status,
                    content: I.responseText
                  }));
                }, m += (m.indexOf("?") === -1 ? "?" : "&") + "s=" + (/* @__PURE__ */ new Date()).getTime(), I.open("GET", m, this.async), I.send();
              }, h;
            })(A);
            e.exports = {
              WebLoader: c,
              PrecompiledLoader: g
            };
          }),
          /* 11 */
          /***/
          (function(e, i, r) {
            var s = r(0), o = r(7), A = o.Environment, a = o.Template, g = r(6), c = r(10), u = r(23), h = r(5), p = r(8), m = r(9), l = r(2), I = r(3), C = r(25), d;
            function x(w, f) {
              f = f || {}, s.isObject(w) && (f = w, w = null);
              var y;
              return c.FileSystemLoader ? y = new c.FileSystemLoader(w, {
                watch: f.watch,
                noCache: f.noCache
              }) : c.WebLoader && (y = new c.WebLoader(w, {
                useCache: f.web && f.web.useCache,
                async: f.web && f.web.async
              })), d = new A(y, f), f && f.express && d.express(f.express), d;
            }
            e.exports = {
              Environment: A,
              Template: a,
              Loader: g,
              FileSystemLoader: c.FileSystemLoader,
              NodeResolveLoader: c.NodeResolveLoader,
              PrecompiledLoader: c.PrecompiledLoader,
              WebLoader: c.WebLoader,
              compiler: h,
              parser: p,
              lexer: m,
              runtime: l,
              lib: s,
              nodes: I,
              installJinjaCompat: C,
              configure: x,
              reset: function() {
                d = void 0;
              },
              compile: function(w, f, y, v) {
                return d || x(), new a(w, f, y, v);
              },
              render: function(w, f, y) {
                return d || x(), d.render(w, f, y);
              },
              renderString: function(w, f, y) {
                return d || x(), d.renderString(w, f, y);
              },
              precompile: u ? u.precompile : void 0,
              precompileString: u ? u.precompileString : void 0
            };
          }),
          /* 12 */
          /***/
          (function(e, i, r) {
            var s = r(13), o = [], A = [], a = s.makeRequestCallFromTimer(g);
            function g() {
              if (A.length)
                throw A.shift();
            }
            e.exports = c;
            function c(h) {
              var p;
              o.length ? p = o.pop() : p = new u(), p.task = h, s(p);
            }
            function u() {
              this.task = null;
            }
            u.prototype.call = function() {
              try {
                this.task.call();
              } catch (h) {
                c.onerror ? c.onerror(h) : (A.push(h), a());
              } finally {
                this.task = null, o[o.length] = this;
              }
            };
          }),
          /* 13 */
          /***/
          (function(e, i, r) {
            (function(s) {
              e.exports = o;
              function o(I) {
                A.length || a(), A[A.length] = I;
              }
              var A = [], a, g = 0, c = 1024;
              function u() {
                for (; g < A.length; ) {
                  var I = g;
                  if (g = g + 1, A[I].call(), g > c) {
                    for (var C = 0, d = A.length - g; C < d; C++)
                      A[C] = A[C + g];
                    A.length -= g, g = 0;
                  }
                }
                A.length = 0, g = 0;
              }
              var h = typeof s < "u" ? s : self, p = h.MutationObserver || h.WebKitMutationObserver;
              typeof p == "function" ? a = m(u) : a = l(u), o.requestFlush = a;
              function m(I) {
                var C = 1, d = new p(I), x = document.createTextNode("");
                return d.observe(x, { characterData: !0 }), function() {
                  C = -C, x.data = C;
                };
              }
              function l(I) {
                return function() {
                  var C = setTimeout(x, 0), d = setInterval(x, 50);
                  function x() {
                    clearTimeout(C), clearInterval(d), I();
                  }
                };
              }
              o.makeRequestCallFromTimer = l;
            }).call(i, r(14));
          }),
          /* 14 */
          /***/
          (function(e, i) {
            var r;
            r = /* @__PURE__ */ (function() {
              return this;
            })();
            try {
              r = r || Function("return this")() || (0, eval)("this");
            } catch {
              typeof window == "object" && (r = window);
            }
            e.exports = r;
          }),
          /* 15 */
          /***/
          (function(e, i, r) {
            var s, o;
            (function(A) {
              var a = function() {
                var p = Array.prototype.slice.call(arguments);
                typeof p[0] == "function" && p[0].apply(null, p.splice(1));
              }, g = function(p) {
                typeof setImmediate == "function" ? setImmediate(p) : typeof process < "u" && process.nextTick ? process.nextTick(p) : setTimeout(p, 0);
              }, c = function(p) {
                var m = function(l) {
                  var I = function() {
                    return p.length && p[l].apply(null, arguments), I.next();
                  };
                  return I.next = function() {
                    return l < p.length - 1 ? m(l + 1) : null;
                  }, I;
                };
                return m(0);
              }, u = Array.isArray || function(p) {
                return Object.prototype.toString.call(p) === "[object Array]";
              }, h = function(p, m, l) {
                var I = l ? g : a;
                if (m = m || function() {
                }, !u(p)) {
                  var C = new Error("First argument to waterfall must be an array of functions");
                  return m(C);
                }
                if (!p.length)
                  return m();
                var d = function(x) {
                  return function(w) {
                    if (w)
                      m.apply(null, arguments), m = function() {
                      };
                    else {
                      var f = Array.prototype.slice.call(arguments, 1), y = x.next();
                      y ? f.push(d(y)) : f.push(m), I(function() {
                        x.apply(null, f);
                      });
                    }
                  };
                };
                d(c(p))();
              };
              s = [], o = (function() {
                return h;
              }).apply(i, s), o !== void 0 && (e.exports = o);
            })();
          }),
          /* 16 */
          /***/
          (function(e, i, r) {
            var s = typeof Reflect == "object" ? Reflect : null, o = s && typeof s.apply == "function" ? s.apply : function(S, E, T) {
              return Function.prototype.apply.call(S, E, T);
            }, A;
            s && typeof s.ownKeys == "function" ? A = s.ownKeys : Object.getOwnPropertySymbols ? A = function(S) {
              return Object.getOwnPropertyNames(S).concat(Object.getOwnPropertySymbols(S));
            } : A = function(S) {
              return Object.getOwnPropertyNames(S);
            };
            function a(S) {
              console && console.warn && console.warn(S);
            }
            var g = Number.isNaN || function(S) {
              return S !== S;
            };
            function c() {
              c.init.call(this);
            }
            e.exports = c, e.exports.once = y, c.EventEmitter = c, c.prototype._events = void 0, c.prototype._eventsCount = 0, c.prototype._maxListeners = void 0;
            var u = 10;
            function h(S) {
              if (typeof S != "function")
                throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof S);
            }
            Object.defineProperty(c, "defaultMaxListeners", {
              enumerable: !0,
              get: function() {
                return u;
              },
              set: function(S) {
                if (typeof S != "number" || S < 0 || g(S))
                  throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + S + ".");
                u = S;
              }
            }), c.init = function() {
              (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
            }, c.prototype.setMaxListeners = function(S) {
              if (typeof S != "number" || S < 0 || g(S))
                throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + S + ".");
              return this._maxListeners = S, this;
            };
            function p(S) {
              return S._maxListeners === void 0 ? c.defaultMaxListeners : S._maxListeners;
            }
            c.prototype.getMaxListeners = function() {
              return p(this);
            }, c.prototype.emit = function(S) {
              for (var E = [], T = 1; T < arguments.length; T++) E.push(arguments[T]);
              var _ = S === "error", L = this._events;
              if (L !== void 0)
                _ = _ && L.error === void 0;
              else if (!_)
                return !1;
              if (_) {
                var D;
                if (E.length > 0 && (D = E[0]), D instanceof Error)
                  throw D;
                var F = new Error("Unhandled error." + (D ? " (" + D.message + ")" : ""));
                throw F.context = D, F;
              }
              var z = L[S];
              if (z === void 0)
                return !1;
              if (typeof z == "function")
                o(z, this, E);
              else
                for (var k = z.length, N = x(z, k), T = 0; T < k; ++T)
                  o(N[T], this, E);
              return !0;
            };
            function m(S, E, T, _) {
              var L, D, F;
              if (h(T), D = S._events, D === void 0 ? (D = S._events = /* @__PURE__ */ Object.create(null), S._eventsCount = 0) : (D.newListener !== void 0 && (S.emit(
                "newListener",
                E,
                T.listener ? T.listener : T
              ), D = S._events), F = D[E]), F === void 0)
                F = D[E] = T, ++S._eventsCount;
              else if (typeof F == "function" ? F = D[E] = _ ? [T, F] : [F, T] : _ ? F.unshift(T) : F.push(T), L = p(S), L > 0 && F.length > L && !F.warned) {
                F.warned = !0;
                var z = new Error("Possible EventEmitter memory leak detected. " + F.length + " " + String(E) + " listeners added. Use emitter.setMaxListeners() to increase limit");
                z.name = "MaxListenersExceededWarning", z.emitter = S, z.type = E, z.count = F.length, a(z);
              }
              return S;
            }
            c.prototype.addListener = function(S, E) {
              return m(this, S, E, !1);
            }, c.prototype.on = c.prototype.addListener, c.prototype.prependListener = function(S, E) {
              return m(this, S, E, !0);
            };
            function l() {
              if (!this.fired)
                return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
            }
            function I(S, E, T) {
              var _ = { fired: !1, wrapFn: void 0, target: S, type: E, listener: T }, L = l.bind(_);
              return L.listener = T, _.wrapFn = L, L;
            }
            c.prototype.once = function(S, E) {
              return h(E), this.on(S, I(this, S, E)), this;
            }, c.prototype.prependOnceListener = function(S, E) {
              return h(E), this.prependListener(S, I(this, S, E)), this;
            }, c.prototype.removeListener = function(S, E) {
              var T, _, L, D, F;
              if (h(E), _ = this._events, _ === void 0)
                return this;
              if (T = _[S], T === void 0)
                return this;
              if (T === E || T.listener === E)
                --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete _[S], _.removeListener && this.emit("removeListener", S, T.listener || E));
              else if (typeof T != "function") {
                for (L = -1, D = T.length - 1; D >= 0; D--)
                  if (T[D] === E || T[D].listener === E) {
                    F = T[D].listener, L = D;
                    break;
                  }
                if (L < 0)
                  return this;
                L === 0 ? T.shift() : w(T, L), T.length === 1 && (_[S] = T[0]), _.removeListener !== void 0 && this.emit("removeListener", S, F || E);
              }
              return this;
            }, c.prototype.off = c.prototype.removeListener, c.prototype.removeAllListeners = function(S) {
              var E, T, _;
              if (T = this._events, T === void 0)
                return this;
              if (T.removeListener === void 0)
                return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : T[S] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete T[S]), this;
              if (arguments.length === 0) {
                var L = Object.keys(T), D;
                for (_ = 0; _ < L.length; ++_)
                  D = L[_], D !== "removeListener" && this.removeAllListeners(D);
                return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
              }
              if (E = T[S], typeof E == "function")
                this.removeListener(S, E);
              else if (E !== void 0)
                for (_ = E.length - 1; _ >= 0; _--)
                  this.removeListener(S, E[_]);
              return this;
            };
            function C(S, E, T) {
              var _ = S._events;
              if (_ === void 0)
                return [];
              var L = _[E];
              return L === void 0 ? [] : typeof L == "function" ? T ? [L.listener || L] : [L] : T ? f(L) : x(L, L.length);
            }
            c.prototype.listeners = function(S) {
              return C(this, S, !0);
            }, c.prototype.rawListeners = function(S) {
              return C(this, S, !1);
            }, c.listenerCount = function(S, E) {
              return typeof S.listenerCount == "function" ? S.listenerCount(E) : d.call(S, E);
            }, c.prototype.listenerCount = d;
            function d(S) {
              var E = this._events;
              if (E !== void 0) {
                var T = E[S];
                if (typeof T == "function")
                  return 1;
                if (T !== void 0)
                  return T.length;
              }
              return 0;
            }
            c.prototype.eventNames = function() {
              return this._eventsCount > 0 ? A(this._events) : [];
            };
            function x(S, E) {
              for (var T = new Array(E), _ = 0; _ < E; ++_)
                T[_] = S[_];
              return T;
            }
            function w(S, E) {
              for (; E + 1 < S.length; E++)
                S[E] = S[E + 1];
              S.pop();
            }
            function f(S) {
              for (var E = new Array(S.length), T = 0; T < E.length; ++T)
                E[T] = S[T].listener || S[T];
              return E;
            }
            function y(S, E) {
              return new Promise(function(T, _) {
                function L(F) {
                  S.removeListener(E, D), _(F);
                }
                function D() {
                  typeof S.removeListener == "function" && S.removeListener("error", L), T([].slice.call(arguments));
                }
                M(S, E, D, { once: !0 }), E !== "error" && v(S, L, { once: !0 });
              });
            }
            function v(S, E, T) {
              typeof S.on == "function" && M(S, "error", E, T);
            }
            function M(S, E, T, _) {
              if (typeof S.on == "function")
                _.once ? S.once(E, T) : S.on(E, T);
              else if (typeof S.addEventListener == "function")
                S.addEventListener(E, function L(D) {
                  _.once && S.removeEventListener(E, L), T(D);
                });
              else
                throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof S);
            }
          }),
          /* 17 */
          /***/
          (function(e, i, r) {
            var s = r(3), o = r(0), A = 0;
            function a() {
              return "hole_" + A++;
            }
            function g(d, x) {
              for (var w = null, f = 0; f < d.length; f++) {
                var y = x(d[f]);
                y !== d[f] && (w || (w = d.slice()), w[f] = y);
              }
              return w || d;
            }
            function c(d, x, w) {
              if (!(d instanceof s.Node))
                return d;
              if (!w) {
                var f = x(d);
                if (f && f !== d)
                  return f;
              }
              if (d instanceof s.NodeList) {
                var y = g(d.children, function(T) {
                  return c(T, x, w);
                });
                y !== d.children && (d = new s[d.typename](d.lineno, d.colno, y));
              } else if (d instanceof s.CallExtension) {
                var v = c(d.args, x, w), M = g(d.contentArgs, function(T) {
                  return c(T, x, w);
                });
                (v !== d.args || M !== d.contentArgs) && (d = new s[d.typename](d.extName, d.prop, v, M));
              } else {
                var S = d.fields.map(function(T) {
                  return d[T];
                }), E = g(S, function(T) {
                  return c(T, x, w);
                });
                E !== S && (d = new s[d.typename](d.lineno, d.colno), E.forEach(function(T, _) {
                  d[d.fields[_]] = T;
                }));
              }
              return w && x(d) || d;
            }
            function u(d, x) {
              return c(d, x, !0);
            }
            function h(d, x, w) {
              var f = [], y = u(w ? d[w] : d, function(v) {
                var M;
                return v instanceof s.Block ? v : ((v instanceof s.Filter && o.indexOf(x, v.name.value) !== -1 || v instanceof s.CallExtensionAsync) && (M = new s.Symbol(v.lineno, v.colno, a()), f.push(new s.FilterAsync(v.lineno, v.colno, v.name, v.args, M))), M);
              });
              return w ? d[w] = y : d = y, f.length ? (f.push(d), new s.NodeList(d.lineno, d.colno, f)) : d;
            }
            function p(d, x) {
              return u(d, function(w) {
                return w instanceof s.Output ? h(w, x) : w instanceof s.Set ? h(w, x, "value") : w instanceof s.For ? h(w, x, "arr") : w instanceof s.If ? h(w, x, "cond") : w instanceof s.CallExtension ? h(w, x, "args") : void 0;
              });
            }
            function m(d) {
              return c(d, function(x) {
                if (x instanceof s.Block) {
                  var w = !1, f = a();
                  x.body = c(x.body, function(y) {
                    if (y instanceof s.FunCall && y.name.value === "super")
                      return w = !0, new s.Symbol(y.lineno, y.colno, f);
                  }), w && x.body.children.unshift(new s.Super(0, 0, x.name, new s.Symbol(0, 0, f)));
                }
              });
            }
            function l(d) {
              return u(d, function(x) {
                if (!(!(x instanceof s.If) && !(x instanceof s.For))) {
                  var w = !1;
                  if (c(x, function(f) {
                    if (f instanceof s.FilterAsync || f instanceof s.IfAsync || f instanceof s.AsyncEach || f instanceof s.AsyncAll || f instanceof s.CallExtensionAsync)
                      return w = !0, f;
                  }), w) {
                    if (x instanceof s.If)
                      return new s.IfAsync(x.lineno, x.colno, x.cond, x.body, x.else_);
                    if (x instanceof s.For && !(x instanceof s.AsyncAll))
                      return new s.AsyncEach(x.lineno, x.colno, x.arr, x.name, x.body, x.else_);
                  }
                }
              });
            }
            function I(d, x) {
              return l(m(p(d, x)));
            }
            function C(d, x) {
              return I(d, x || []);
            }
            e.exports = {
              transform: C
            };
          }),
          /* 18 */
          /***/
          (function(e, A, r) {
            var s = r(0), o = r(2), A = e.exports = {};
            function a(P, B) {
              return P == null || P === !1 ? B : P;
            }
            A.abs = Math.abs;
            function g(P) {
              return P !== P;
            }
            function c(P, B, V) {
              var H, it = [], tt = [];
              for (H = 0; H < P.length; H++)
                H % B === 0 && tt.length && (it.push(tt), tt = []), tt.push(P[H]);
              if (tt.length) {
                if (V)
                  for (H = tt.length; H < B; H++)
                    tt.push(V);
                it.push(tt);
              }
              return it;
            }
            A.batch = c;
            function u(P) {
              P = a(P, "");
              var B = P.toLowerCase();
              return o.copySafeness(P, B.charAt(0).toUpperCase() + B.slice(1));
            }
            A.capitalize = u;
            function h(P, B) {
              if (P = a(P, ""), B = B || 80, P.length >= B)
                return P;
              var V = B - P.length, H = s.repeat(" ", V / 2 - V % 2), it = s.repeat(" ", V / 2);
              return o.copySafeness(P, H + P + it);
            }
            A.center = h;
            function p(P, B, V) {
              return V ? P || B : P !== void 0 ? P : B;
            }
            A.default = p;
            function m(P, B, V) {
              if (!s.isObject(P))
                throw new s.TemplateError("dictsort filter: val must be an object");
              var H = [];
              for (var it in P)
                H.push([it, P[it]]);
              var tt;
              if (V === void 0 || V === "key")
                tt = 0;
              else if (V === "value")
                tt = 1;
              else
                throw new s.TemplateError("dictsort filter: You can only sort by either key or value");
              return H.sort(function(gt, ot) {
                var wt = gt[tt], St = ot[tt];
                return B || (s.isString(wt) && (wt = wt.toUpperCase()), s.isString(St) && (St = St.toUpperCase())), wt > St ? 1 : wt === St ? 0 : -1;
              }), H;
            }
            A.dictsort = m;
            function l(P, B) {
              return JSON.stringify(P, null, B);
            }
            A.dump = l;
            function I(P) {
              return P instanceof o.SafeString ? P : (P = P ?? "", o.markSafe(s.escape(P.toString())));
            }
            A.escape = I;
            function C(P) {
              return P instanceof o.SafeString ? P : (P = P ?? "", o.markSafe(P.toString()));
            }
            A.safe = C;
            function d(P) {
              return P[0];
            }
            A.first = d;
            function x(P) {
              return P = P ?? "", o.markSafe(s.escape(P.toString()));
            }
            A.forceescape = x;
            function w(P, B) {
              return s.groupBy(P, B, this.env.opts.throwOnUndefined);
            }
            A.groupby = w;
            function f(P, B, V) {
              if (P = a(P, ""), P === "")
                return "";
              B = B || 4;
              var H = P.split(`
`), it = s.repeat(" ", B), tt = H.map(function(gt, ot) {
                return ot === 0 && !V ? gt : "" + it + gt;
              }).join(`
`);
              return o.copySafeness(P, tt);
            }
            A.indent = f;
            function y(P, B, V) {
              return B = B || "", V && (P = s.map(P, function(H) {
                return H[V];
              })), P.join(B);
            }
            A.join = y;
            function v(P) {
              return P[P.length - 1];
            }
            A.last = v;
            function M(P) {
              var B = a(P, "");
              return B !== void 0 ? typeof Map == "function" && B instanceof Map || typeof Set == "function" && B instanceof Set ? B.size : s.isObject(B) && !(B instanceof o.SafeString) ? s.keys(B).length : B.length : 0;
            }
            A.length = M;
            function S(P) {
              if (s.isString(P))
                return P.split("");
              if (s.isObject(P))
                return s._entries(P || {}).map(function(B) {
                  var V = B[0], H = B[1];
                  return {
                    key: V,
                    value: H
                  };
                });
              if (s.isArray(P))
                return P;
              throw new s.TemplateError("list filter: type not iterable");
            }
            A.list = S;
            function E(P) {
              return P = a(P, ""), P.toLowerCase();
            }
            A.lower = E;
            function T(P) {
              return P == null ? "" : o.copySafeness(P, P.replace(/\r\n|\n/g, `<br />
`));
            }
            A.nl2br = T;
            function _(P) {
              return P[Math.floor(Math.random() * P.length)];
            }
            A.random = _;
            function L(P) {
              function B(V, H, it) {
                H === void 0 && (H = "truthy");
                var tt = this, gt = tt.env.getTest(H);
                return s.toArray(V).filter(function(ot) {
                  return gt.call(tt, ot, it) === P;
                });
              }
              return B;
            }
            A.reject = L(!1);
            function D(P, B) {
              return P.filter(function(V) {
                return !V[B];
              });
            }
            A.rejectattr = D, A.select = L(!0);
            function F(P, B) {
              return P.filter(function(V) {
                return !!V[B];
              });
            }
            A.selectattr = F;
            function z(P, B, V, H) {
              var it = P;
              if (B instanceof RegExp)
                return P.replace(B, V);
              typeof H > "u" && (H = -1);
              var tt = "";
              if (typeof B == "number")
                B = "" + B;
              else if (typeof B != "string")
                return P;
              if (typeof P == "number" && (P = "" + P), typeof P != "string" && !(P instanceof o.SafeString))
                return P;
              if (B === "")
                return tt = V + P.split("").join(V) + V, o.copySafeness(P, tt);
              var gt = P.indexOf(B);
              if (H === 0 || gt === -1)
                return P;
              for (var ot = 0, wt = 0; gt > -1 && (H === -1 || wt < H); )
                tt += P.substring(ot, gt) + V, ot = gt + B.length, wt++, gt = P.indexOf(B, ot);
              return ot < P.length && (tt += P.substring(ot)), o.copySafeness(it, tt);
            }
            A.replace = z;
            function k(P) {
              var B;
              return s.isString(P) ? B = S(P) : B = s.map(P, function(V) {
                return V;
              }), B.reverse(), s.isString(P) ? o.copySafeness(P, B.join("")) : B;
            }
            A.reverse = k;
            function N(P, B, V) {
              B = B || 0;
              var H = Math.pow(10, B), it;
              return V === "ceil" ? it = Math.ceil : V === "floor" ? it = Math.floor : it = Math.round, it(P * H) / H;
            }
            A.round = N;
            function O(P, B, V) {
              for (var H = Math.floor(P.length / B), it = P.length % B, tt = [], gt = 0, ot = 0; ot < B; ot++) {
                var wt = gt + ot * H;
                ot < it && gt++;
                var St = gt + (ot + 1) * H, Vt = P.slice(wt, St);
                V && ot >= it && Vt.push(V), tt.push(Vt);
              }
              return tt;
            }
            A.slice = O;
            function X(P, B, V) {
              return V === void 0 && (V = 0), B && (P = s.map(P, function(H) {
                return H[B];
              })), V + P.reduce(function(H, it) {
                return H + it;
              }, 0);
            }
            A.sum = X, A.sort = o.makeMacro(["value", "reverse", "case_sensitive", "attribute"], [], function(P, B, V, H) {
              var it = this, tt = s.map(P, function(ot) {
                return ot;
              }), gt = s.getAttrGetter(H);
              return tt.sort(function(ot, wt) {
                var St = H ? gt(ot) : ot, Vt = H ? gt(wt) : wt;
                if (it.env.opts.throwOnUndefined && H && (St === void 0 || Vt === void 0))
                  throw new TypeError('sort: attribute "' + H + '" resolved to undefined');
                return !V && s.isString(St) && s.isString(Vt) && (St = St.toLowerCase(), Vt = Vt.toLowerCase()), St < Vt ? B ? 1 : -1 : St > Vt ? B ? -1 : 1 : 0;
              }), tt;
            });
            function Z(P) {
              return o.copySafeness(P, P);
            }
            A.string = Z;
            function W(P, B) {
              P = a(P, "");
              var V = /<\/?([a-z][a-z0-9]*)\b[^>]*>|<!--[\s\S]*?-->/gi, H = rt(P.replace(V, "")), it = "";
              return B ? it = H.replace(/^ +| +$/gm, "").replace(/ +/g, " ").replace(/(\r\n)/g, `
`).replace(/\n\n\n+/g, `

`) : it = H.replace(/\s+/gi, " "), o.copySafeness(P, it);
            }
            A.striptags = W;
            function st(P) {
              P = a(P, "");
              var B = P.split(" ").map(function(V) {
                return u(V);
              });
              return o.copySafeness(P, B.join(" "));
            }
            A.title = st;
            function rt(P) {
              return o.copySafeness(P, P.replace(/^\s*|\s*$/g, ""));
            }
            A.trim = rt;
            function at(P, B, V, H) {
              var it = P;
              if (P = a(P, ""), B = B || 255, P.length <= B)
                return P;
              if (V)
                P = P.substring(0, B);
              else {
                var tt = P.lastIndexOf(" ", B);
                tt === -1 && (tt = B), P = P.substring(0, tt);
              }
              return P += H ?? "...", o.copySafeness(it, P);
            }
            A.truncate = at;
            function nt(P) {
              return P = a(P, ""), P.toUpperCase();
            }
            A.upper = nt;
            function pt(P) {
              var B = encodeURIComponent;
              if (s.isString(P))
                return B(P);
              var V = s.isArray(P) ? P : s._entries(P);
              return V.map(function(H) {
                var it = H[0], tt = H[1];
                return B(it) + "=" + B(tt);
              }).join("&");
            }
            A.urlencode = pt;
            var At = /^(?:\(|<|&lt;)?(.*?)(?:\.|,|\)|\n|&gt;)?$/, Q = /^[\w.!#$%&'*+\-\/=?\^`{|}~]+@[a-z\d\-]+(\.[a-z\d\-]+)+$/i, J = /^https?:\/\/.*$/, Y = /^www\./, mt = /\.(?:org|net|com)(?:\:|\/|$)/;
            function jt(P, B, V) {
              g(B) && (B = 1 / 0);
              var H = V === !0 ? ' rel="nofollow"' : "", it = P.split(/(\s+)/).filter(function(tt) {
                return tt && tt.length;
              }).map(function(tt) {
                var gt = tt.match(At), ot = gt ? gt[1] : tt, wt = ot.substr(0, B);
                return J.test(ot) ? '<a href="' + ot + '"' + H + ">" + wt + "</a>" : Y.test(ot) ? '<a href="http://' + ot + '"' + H + ">" + wt + "</a>" : Q.test(ot) ? '<a href="mailto:' + ot + '">' + ot + "</a>" : mt.test(ot) ? '<a href="http://' + ot + '"' + H + ">" + wt + "</a>" : tt;
              });
              return it.join("");
            }
            A.urlize = jt;
            function ae(P) {
              P = a(P, "");
              var B = P ? P.match(/\w+/g) : null;
              return B ? B.length : null;
            }
            A.wordcount = ae;
            function yt(P, B) {
              var V = parseFloat(P);
              return g(V) ? B : V;
            }
            A.float = yt;
            var Ct = o.makeMacro(["value", "default", "base"], [], function(P, B, V) {
              V === void 0 && (V = 10);
              var H = parseInt(P, V);
              return g(H) ? B : H;
            });
            A.int = Ct, A.d = A.default, A.e = A.escape;
          }),
          /* 19 */
          /***/
          (function(e, i, r) {
            function s(g, c) {
              g.prototype = Object.create(c.prototype), g.prototype.constructor = g, o(g, c);
            }
            function o(g, c) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(u, h) {
                return u.__proto__ = h, u;
              }, o(g, c);
            }
            var A = r(6), a = /* @__PURE__ */ (function(g) {
              s(c, g);
              function c(h) {
                var p;
                return p = g.call(this) || this, p.precompiled = h || {}, p;
              }
              var u = c.prototype;
              return u.getSource = function(h) {
                return this.precompiled[h] ? {
                  src: {
                    type: "code",
                    obj: this.precompiled[h]
                  },
                  path: h
                } : null;
              }, c;
            })(A);
            e.exports = {
              PrecompiledLoader: a
            };
          }),
          /* 20 */
          /***/
          (function(e, i, r) {
            var s = r(2).SafeString;
            function o(_) {
              return typeof _ == "function";
            }
            i.callable = o;
            function A(_) {
              return _ !== void 0;
            }
            i.defined = A;
            function a(_, L) {
              return _ % L === 0;
            }
            i.divisibleby = a;
            function g(_) {
              return _ instanceof s;
            }
            i.escaped = g;
            function c(_, L) {
              return _ === L;
            }
            i.equalto = c, i.eq = i.equalto, i.sameas = i.equalto;
            function u(_) {
              return _ % 2 === 0;
            }
            i.even = u;
            function h(_) {
              return !_;
            }
            i.falsy = h;
            function p(_, L) {
              return _ >= L;
            }
            i.ge = p;
            function m(_, L) {
              return _ > L;
            }
            i.greaterthan = m, i.gt = i.greaterthan;
            function l(_, L) {
              return _ <= L;
            }
            i.le = l;
            function I(_, L) {
              return _ < L;
            }
            i.lessthan = I, i.lt = i.lessthan;
            function C(_) {
              return _.toLowerCase() === _;
            }
            i.lower = C;
            function d(_, L) {
              return _ !== L;
            }
            i.ne = d;
            function x(_) {
              return _ === null;
            }
            i.null = x;
            function w(_) {
              return typeof _ == "number";
            }
            i.number = w;
            function f(_) {
              return _ % 2 === 1;
            }
            i.odd = f;
            function y(_) {
              return typeof _ == "string";
            }
            i.string = y;
            function v(_) {
              return !!_;
            }
            i.truthy = v;
            function M(_) {
              return _ === void 0;
            }
            i.undefined = M;
            function S(_) {
              return _.toUpperCase() === _;
            }
            i.upper = S;
            function E(_) {
              return typeof Symbol < "u" ? !!_[Symbol.iterator] : Array.isArray(_) || typeof _ == "string";
            }
            i.iterable = E;
            function T(_) {
              var L = _ != null && typeof _ == "object" && !Array.isArray(_);
              return Set ? L && !(_ instanceof Set) : L;
            }
            i.mapping = T;
          }),
          /* 21 */
          /***/
          (function(e, i, r) {
            function s(a) {
              var g = -1;
              return {
                current: null,
                reset: function() {
                  g = -1, this.current = null;
                },
                next: function() {
                  return g++, g >= a.length && (g = 0), this.current = a[g], this.current;
                }
              };
            }
            function o(a) {
              a = a || ",";
              var g = !0;
              return function() {
                var c = g ? "" : a;
                return g = !1, c;
              };
            }
            function A() {
              return {
                range: function(a, g, c) {
                  typeof g > "u" ? (g = a, a = 0, c = 1) : c || (c = 1);
                  var u = [];
                  if (c > 0)
                    for (var h = a; h < g; h += c)
                      u.push(h);
                  else
                    for (var p = a; p > g; p += c)
                      u.push(p);
                  return u;
                },
                cycler: function() {
                  return s(Array.prototype.slice.call(arguments));
                },
                joiner: function(a) {
                  return o(a);
                }
              };
            }
            e.exports = A;
          }),
          /* 22 */
          /***/
          (function(e, i, r) {
            var s = r(4);
            e.exports = function(o, A) {
              function a(g, c) {
                if (this.name = g, this.path = g, this.defaultEngine = c.defaultEngine, this.ext = s.extname(g), !this.ext && !this.defaultEngine)
                  throw new Error("No default engine was specified and no extension was provided.");
                this.ext || (this.name += this.ext = (this.defaultEngine[0] !== "." ? "." : "") + this.defaultEngine);
              }
              return a.prototype.render = function(g, c) {
                o.render(this.name, g, c);
              }, A.set("view", a), A.set("nunjucksEnv", o), o;
            };
          }),
          /* 23 */
          /***/
          (function(e, i, r) {
            var s = r(4), o = r(4), A = r(0), a = A._prettifyError, g = r(5), c = r(7), u = c.Environment, h = r(24);
            function p(C, d) {
              return Array.isArray(d) ? d.some(function(x) {
                return C.match(x);
              }) : !1;
            }
            function m(C, d) {
              d = d || {}, d.isString = !0;
              var x = d.env || new u([]), w = d.wrapper || h;
              if (!d.name)
                throw new Error('the "name" option is required when compiling a string');
              return w([I(C, d.name, x)], d);
            }
            function l(C, d) {
              d = d || {};
              var x = d.env || new u([]), w = d.wrapper || h;
              if (d.isString)
                return m(C, d);
              var f = s.existsSync(C) && s.statSync(C), y = [], v = [];
              function M(T) {
                s.readdirSync(T).forEach(function(_) {
                  var L = o.join(T, _), D = L.substr(o.join(C, "/").length), F = s.statSync(L);
                  F && F.isDirectory() ? (D += "/", p(D, d.exclude) || M(L)) : p(D, d.include) && v.push(L);
                });
              }
              if (f.isFile())
                y.push(I(s.readFileSync(C, "utf-8"), d.name || C, x));
              else if (f.isDirectory()) {
                M(C);
                for (var S = 0; S < v.length; S++) {
                  var E = v[S].replace(o.join(C, "/"), "");
                  try {
                    y.push(I(s.readFileSync(v[S], "utf-8"), E, x));
                  } catch (T) {
                    if (d.force)
                      console.error(T);
                    else
                      throw T;
                  }
                }
              }
              return w(y, d);
            }
            function I(C, d, x) {
              x = x || new u([]);
              var w = x.asyncFilters, f = x.extensionsList, y;
              d = d.replace(/\\/g, "/");
              try {
                y = g.compile(C, w, f, d, x.opts);
              } catch (v) {
                throw a(d, !1, v);
              }
              return {
                name: d,
                template: y
              };
            }
            e.exports = {
              precompile: l,
              precompileString: m
            };
          }),
          /* 24 */
          /***/
          (function(e, i, r) {
            function s(o, A) {
              var a = "";
              A = A || {};
              for (var g = 0; g < o.length; g++) {
                var c = JSON.stringify(o[g].name), u = o[g].template;
                a += "(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})[" + c + `] = (function() {
` + u + `
})();
`, A.asFunction && (a += "return function(ctx, cb) { return nunjucks.render(" + c + `, ctx, cb); }
`), a += `})();
`;
              }
              return a;
            }
            e.exports = s;
          }),
          /* 25 */
          /***/
          (function(e, i, r) {
            function s() {
              var o = this.runtime, A = this.lib, a = this.compiler.Compiler, g = this.parser.Parser, c = this.nodes, u = this.lexer, h = o.contextOrFrameLookup, p = o.memberLookup, m, l;
              a && (m = a.prototype.assertType), g && (l = g.prototype.parseAggregate);
              function I() {
                o.contextOrFrameLookup = h, o.memberLookup = p, a && (a.prototype.assertType = m), g && (g.prototype.parseAggregate = l);
              }
              o.contextOrFrameLookup = function(v, M, S) {
                var E = h.apply(this, arguments);
                if (E !== void 0)
                  return E;
                switch (S) {
                  case "True":
                    return !0;
                  case "False":
                    return !1;
                  case "None":
                    return null;
                  default:
                    return;
                }
              };
              function C(v) {
                return {
                  index: v.index,
                  lineno: v.lineno,
                  colno: v.colno
                };
              }
              if (c && a && g) {
                var d = c.Node.extend("Slice", {
                  fields: ["start", "stop", "step"],
                  init: function(v, M, S, E, T) {
                    S = S || new c.Literal(v, M, null), E = E || new c.Literal(v, M, null), T = T || new c.Literal(v, M, 1), this.parent(v, M, S, E, T);
                  }
                });
                a.prototype.assertType = function(v) {
                  v instanceof d || m.apply(this, arguments);
                }, a.prototype.compileSlice = function(v, M) {
                  this._emit("("), this._compileExpression(v.start, M), this._emit("),("), this._compileExpression(v.stop, M), this._emit("),("), this._compileExpression(v.step, M), this._emit(")");
                }, g.prototype.parseAggregate = function() {
                  var v = this, M = C(this.tokens);
                  M.colno--, M.index--;
                  try {
                    return l.apply(this);
                  } catch (z) {
                    var S = C(this.tokens), E = function() {
                      return A._assign(v.tokens, S), z;
                    };
                    A._assign(this.tokens, M), this.peeked = !1;
                    var T = this.peekToken();
                    if (T.type !== u.TOKEN_LEFT_BRACKET)
                      throw E();
                    this.nextToken();
                    for (var _ = new d(T.lineno, T.colno), L = !1, D = 0; D <= _.fields.length && !this.skip(u.TOKEN_RIGHT_BRACKET); D++) {
                      if (D === _.fields.length)
                        if (L)
                          this.fail("parseSlice: too many slice components", T.lineno, T.colno);
                        else
                          break;
                      if (this.skip(u.TOKEN_COLON))
                        L = !0;
                      else {
                        var F = _.fields[D];
                        _[F] = this.parseExpression(), L = this.skip(u.TOKEN_COLON) || L;
                      }
                    }
                    if (!L)
                      throw E();
                    return new c.Array(T.lineno, T.colno, [_]);
                  }
                };
              }
              function x(v, M, S, E) {
                v = v || [], M === null && (M = E < 0 ? v.length - 1 : 0), S === null ? S = E < 0 ? -1 : v.length : S < 0 && (S += v.length), M < 0 && (M += v.length);
                for (var T = [], _ = M; !(_ < 0 || _ > v.length || E > 0 && _ >= S || E < 0 && _ <= S); _ += E)
                  T.push(o.memberLookup(v, _));
                return T;
              }
              function w(v, M) {
                return Object.prototype.hasOwnProperty.call(v, M);
              }
              var f = {
                pop: function(v) {
                  if (v === void 0)
                    return this.pop();
                  if (v >= this.length || v < 0)
                    throw new Error("KeyError");
                  return this.splice(v, 1);
                },
                append: function(v) {
                  return this.push(v);
                },
                remove: function(v) {
                  for (var M = 0; M < this.length; M++)
                    if (this[M] === v)
                      return this.splice(M, 1);
                  throw new Error("ValueError");
                },
                count: function(v) {
                  for (var M = 0, S = 0; S < this.length; S++)
                    this[S] === v && M++;
                  return M;
                },
                index: function(v) {
                  var M;
                  if ((M = this.indexOf(v)) === -1)
                    throw new Error("ValueError");
                  return M;
                },
                find: function(v) {
                  return this.indexOf(v);
                },
                insert: function(v, M) {
                  return this.splice(v, 0, M);
                }
              }, y = {
                items: function() {
                  return A._entries(this);
                },
                values: function() {
                  return A._values(this);
                },
                keys: function() {
                  return A.keys(this);
                },
                get: function(v, M) {
                  var S = this[v];
                  return S === void 0 && (S = M), S;
                },
                has_key: function(v) {
                  return w(this, v);
                },
                pop: function(v, M) {
                  var S = this[v];
                  if (S === void 0 && M !== void 0)
                    S = M;
                  else {
                    if (S === void 0)
                      throw new Error("KeyError");
                    delete this[v];
                  }
                  return S;
                },
                popitem: function() {
                  var v = A.keys(this);
                  if (!v.length)
                    throw new Error("KeyError");
                  var M = v[0], S = this[M];
                  return delete this[M], [M, S];
                },
                setdefault: function(v, M) {
                  return M === void 0 && (M = null), v in this || (this[v] = M), this[v];
                },
                update: function(v) {
                  return A._assign(this, v), null;
                }
              };
              return y.iteritems = y.items, y.itervalues = y.values, y.iterkeys = y.keys, o.memberLookup = function(v, M, S) {
                return arguments.length === 4 ? x.apply(this, arguments) : (v = v || {}, A.isArray(v) && w(f, M) ? f[M].bind(v) : A.isObject(v) && w(y, M) ? y[M].bind(v) : p.apply(this, arguments));
              }, I;
            }
            e.exports = s;
          })
          /******/
        ])
      );
    });
  })(Ns)), Ns.exports;
}
var JC = KC();
const mr = /* @__PURE__ */ QC(JC), Fs = /* @__PURE__ */ new Set([
  "constructor",
  "__proto__",
  "prototype",
  "__defineGetter__",
  "__defineSetter__",
  "__lookupGetter__",
  "__lookupSetter__",
  "call",
  "apply",
  "bind"
]), Zi = /* @__PURE__ */ new Set([
  Function,
  Object.getPrototypeOf(async function() {
  }).constructor,
  Object.getPrototypeOf(function* () {
  }).constructor,
  Object.getPrototypeOf(async function* () {
  }).constructor,
  Object,
  Reflect
]), ai = (n, t) => Object.prototype.hasOwnProperty.call(n, t), qC = (n) => typeof n == "symbol" ? n : String(n), $C = /^(?:[\w$]|[^\p{ASCII}\p{C}\p{Z}])+$/u, tf = /[\\\r\n\u2028\u2029]/, nc = (n) => {
  throw new Error("The name " + JSON.stringify(n) + " is not allowed in templates");
}, Ya = (n) => {
  $C.test(String(n)) || nc(n);
}, Ki = (n) => {
  n?.typename === "FunCall" ? Ki(n.name) : n?.typename === "LookupVal" ? (Ki(n.target), Ki(n.val)) : n?.typename === "Literal" && typeof n.value == "string" && tf.test(n.value) && nc(n.value);
}, ef = (n) => {
  switch (n.typename) {
    case "Set":
      return n.targets ?? [];
    case "Macro":
    case "Caller":
      return [n.name];
    default:
      return [];
  }
}, nf = (n) => {
  switch (n.typename) {
    case "For":
    case "AsyncEach":
    case "AsyncAll":
      return n.name?.typename === "Array" ? n.name.children ?? [] : [];
    case "Macro":
    case "Caller": {
      const t = n.args?.children[n.args.children.length - 1];
      return t?.typename === "Dict" || t?.typename === "KeywordArgs" ? (t.children ?? []).map((e) => e.key) : [];
    }
    default:
      return [];
  }
}, Ka = (n) => {
  if (n?.typename !== "Symbol")
    throw new Error("Only plain names can be assigned in templates");
}, rf = /* @__PURE__ */ new Set(["Include", "Import", "FromImport", "Extends"]), sf = (n) => {
  if (rf.has(n.typename))
    throw new Error("Loading another template is not allowed in templates");
  if (n.typename === "Symbol")
    Ya(n.value);
  else if (n.typename === "Is") {
    const t = n.right?.name ?? n.right;
    t?.value !== void 0 && Ya(t.value);
  } else n.typename === "FunCall" && Ki(n.name);
  for (const t of ef(n))
    if (Ka(t), Fs.has(String(t?.value)))
      throw new Error("Assigning to `" + String(t?.value) + "` is not allowed in templates");
  nf(n).forEach(Ka);
}, of = (n) => typeof n == "object" && n !== null && "typename" in n, js = (n, t) => {
  Array.isArray(n) ? n.forEach((e) => js(e, t)) : of(n) && (t(n), Object.values(n).forEach((e) => js(e, t)));
}, af = (n) => {
  if (typeof n != "string")
    throw new Error("Templates must be strings");
  const t = mr;
  let e;
  try {
    e = t.parser.parse(n);
  } catch {
    return;
  }
  js(e, sf);
}, Af = () => mr.runtime, gf = () => {
  const n = new mr.Environment([]);
  n.loaders = [];
  const t = n;
  return t.getFilter = function(e) {
    if (!ai(this.filters, e) || !this.filters[e])
      throw new Error("filter not found: " + e);
    return this.filters[e];
  }, t.getTest = function(e) {
    if (!ai(this.tests, e) || !this.tests[e])
      throw new Error("test not found: " + e);
    return this.tests[e];
  }, t.getGlobal = function(e) {
    if (!ai(this.globals, e) || typeof this.globals[e] > "u")
      throw new Error("global not found: " + e);
    return this.globals[e];
  }, n;
};
let is = !1;
function cf(n) {
  const t = Af();
  if (is || !t)
    return n();
  const e = t.memberLookup, i = t.contextOrFrameLookup, r = t.callWrap;
  t.memberLookup = (s, o) => {
    if (s == null || Zi.has(s))
      return;
    const A = qC(o);
    if (!(typeof A == "string" && Fs.has(A)) && !Zi.has(s[A]))
      return e(s, A);
  }, t.contextOrFrameLookup = (s, o, A) => {
    const a = String(A);
    if (Fs.has(a))
      return;
    let g = o.lookup(a);
    if (g === void 0) {
      const { ctx: c, env: u } = s;
      ai(c, a) ? g = c[a] : ai(u.globals, a) && (g = u.globals[a]);
    }
    if (!Zi.has(g))
      return g;
  }, t.callWrap = (s, o, A, a) => {
    if (Zi.has(s))
      throw new Error("Unable to call `" + String(o) + "`, which is not allowed in templates");
    return r(s, o, A, a);
  }, is = !0;
  try {
    return n();
  } finally {
    t.memberLookup = e, t.contextOrFrameLookup = i, t.callWrap = r, is = !1;
  }
}
function lf(n) {
  const t = {};
  for (const [i, r] of Object.entries(n.templates))
    af(r), t[i] = mr.compile(r, gf());
  const e = (i) => {
    i.result = {};
    for (const r of Object.keys(n.templates))
      i.result[r] = t[r].render(i.properties || {});
  };
  return cf(() => {
    "features" in n.geojson ? n.geojson.features.forEach(e) : e(n.geojson);
  }), n.geojson;
}
const uf = {
  templateExtractor: lf
}, rs = /\{%-?\s*(end)?(raw|verbatim)\s*-?%\}/g;
function If(n) {
  if (!n.includes("{%")) return n;
  const t = [];
  rs.lastIndex = 0;
  for (let A = rs.exec(n); A; A = rs.exec(n))
    t.push({ start: A.index, end: A.index + A[0].length, close: !!A[1], kind: A[2] });
  if (t.length === 0) return n;
  const e = { raw: [], verbatim: [] };
  t.forEach((A, a) => {
    A.close && e[A.kind].push(a);
  });
  const i = { raw: 0, verbatim: 0 };
  let r = "", s = 0, o = 0;
  for (; o < t.length; ) {
    const A = t[o];
    if (A.close) {
      o++;
      continue;
    }
    const a = e[A.kind];
    let g = i[A.kind];
    for (; g < a.length && a[g] < o; ) g++;
    if (i[A.kind] = g, g === a.length) {
      o++;
      continue;
    }
    r += n.slice(s, A.start), s = t[a[g]].end, o = a[g] + 1;
  }
  return r + n.slice(s);
}
function Ja(n, t, e) {
  const i = n.indexOf(t);
  return i >= 0 && n.indexOf(e, i + t.length) >= 0;
}
const hf = 'MaplatApp: poiTemplate/iconTemplate written in the lodash.template syntax (<% %>, <%= %>, <%- %>, ${ }) is no longer evaluated since @maplat/core 1.3.0, and was ignored. Rewrite it in the Nunjucks syntax ({{ }}, {% %}); wrap literal "<%" or "${" in {% raw %}...{% endraw %}.', Cf = 'See the "Removed" section of the 1.3.0 CHANGELOG: https://github.com/code4history/MaplatCore/blob/master/CHANGELOG.md';
let qa = !1, $a = !1;
function ic(n) {
  return Array.from(n).slice(0, 80).join("");
}
function ff(n) {
  const t = If(n);
  return Ja(t, "<%", "%>") || Ja(t, "${", "}");
}
function df(n, t) {
  qa || (qa = !0, console.warn(`${hf} First template found (${n}): "${ic(t)}". ${Cf}`));
}
function Gs(n, t) {
  if ($a) return;
  $a = !0;
  const i = (t instanceof Error ? t.message : String(t)).split(`
`).map((r) => r.trim()).filter((r) => r).join(" ");
  console.warn(`MaplatApp: a poiTemplate/iconTemplate failed to render and was ignored: ${i}. First template: "${ic(n)}".`);
}
function rc(n, t, e) {
  if (ff(t)) {
    df(n, t);
    return;
  }
  try {
    const i = { type: "Feature", geometry: null, properties: e };
    return uf.templateExtractor({ geojson: i, templates: { t } }), i.result.t;
  } catch (i) {
    Gs(t, i);
    return;
  }
}
function pf(n, t) {
  const e = rc("iconTemplate", n, t);
  if (e === void 0) return;
  let i;
  try {
    i = JSON.parse(e);
  } catch (r) {
    Gs(n, r);
    return;
  }
  if (i === null || typeof i != "object" || Array.isArray(i)) {
    Gs(n, new Error("iconTemplate did not produce a JSON object"));
    return;
  }
  return i;
}
function mf(n, ...t) {
  const e = ve(Object.assign({}, n));
  if (e.icon) return e;
  const i = t.reduce((r, s) => {
    if (r) return r;
    const o = s.iconTemplate, A = o ? pf(o, e) : void 0;
    if (A)
      return A;
    if (s.icon)
      return {
        icon: s.icon,
        selectedIcon: s.selectedIcon
      };
  }, void 0);
  return i && (e.icon = i.icon, e.selectedIcon = i.selectedIcon), e;
}
function yf(n, ...t) {
  const e = ve(n);
  return e.html ? e : t.reduce((i, r) => {
    if (i) return i;
    const s = r.poiTemplate;
    if (s) {
      const o = rc("poiTemplate", s, e);
      return o === void 0 ? void 0 : (e.html = o, e.poiStyle = e.poiStyle || r.poiStyle, e);
    }
  }, void 0) || e;
}
function tA(n, ...t) {
  const e = mf(n, ...t);
  return yf(e, ...t);
}
function Pn(n, t) {
  const e = n.getViewport(), i = t.getViewport();
  if (!e || !i) return [0, 0];
  const r = e.getBoundingClientRect(), s = i.getBoundingClientRect();
  return [r.left - s.left, r.top - s.top];
}
class vf {
  #e;
  #r;
  #t;
  #s;
  #i;
  // 大きさの変化を見張れないとき（viewport か ResizeObserver が無い）は取っておかず毎回測る
  #a = !1;
  #n = () => {
    this.#t = void 0;
  };
  constructor(t, e) {
    this.#e = t, this.#r = e;
    const i = t.getViewport(), r = e.getViewport();
    !i || !r || typeof ResizeObserver > "u" || (this.#s = new ResizeObserver(this.#n), this.#s.observe(i), this.#s.observe(r), t.on?.("change:size", this.#n), e.on?.("change:size", this.#n), i.addEventListener("pointerenter", this.#n), this.#i = i, this.#a = !0);
  }
  /** 取っておいた値。捨てられていれば測り直す。 */
  get() {
    return this.#a ? (this.#t || (this.#t = Pn(this.#e, this.#r)), this.#t) : Pn(this.#e, this.#r);
  }
  /** いま測り直して、その値を取っておく。 */
  refresh() {
    const t = Pn(this.#e, this.#r);
    return this.#a && (this.#t = t), t;
  }
  /** 取っておいた値を捨てる（次の get で測り直す）。 */
  invalidate() {
    this.#n();
  }
  dispose() {
    this.#a = !1, this.#s?.disconnect(), this.#s = void 0, this.#e.un?.("change:size", this.#n), this.#r.un?.("change:size", this.#n), this.#i?.removeEventListener("pointerenter", this.#n), this.#i = void 0, this.#t = void 0;
  }
}
const sc = "marker", wf = (n) => n.lnglat || [n.lng || n.longitude, n.lat || n.latitude];
async function Ji(n, t) {
  const e = n.from;
  if (!e) return { kind: "skip" };
  const i = (o) => !!o && !!e.insideCheckSysCoord(o);
  if (t.coordinates) {
    const o = await e.merc2SysCoordAsync_ignoreBackground(t.coordinates);
    return i(o) ? { kind: "inside", xy: o } : { kind: "outside", merc: t.coordinates };
  }
  if (t.x && t.y) {
    const o = e.xy2SysCoord([t.x, t.y]);
    return i(o) ? { kind: "inside", xy: o } : { kind: "skip" };
  }
  const r = re(wf(t), "EPSG:4326", "EPSG:3857"), s = await e.merc2SysCoordAsync_ignoreBackground(r);
  return i(s) ? { kind: "inside", xy: s } : { kind: "outside", merc: r };
}
async function bf(n, t) {
  const e = await Ji(n, { coordinates: t });
  if (e.kind === "inside") return { map: n.mapObject, coord: e.xy };
  if (e.kind === "outside") {
    if (yr(n.from)) return { map: n.mapObject, coord: t };
    if (n.backMap) return { map: n.backMap, coord: t };
  }
}
function ss(n, t, e) {
  const i = n.from, r = n.mapObject, s = n.backMap;
  if (!i || !r || !s || yr(i)) return;
  const o = r.getCoordinateFromPixel(t);
  if (!o || i.insideCheckSysCoord(o)) return;
  const [A, a] = e ? e() : Pn(r, s), g = s.getCoordinateFromPixel([t[0] + A, t[1] + a]);
  return { merc: g ? [g[0], g[1]] : void 0 };
}
function yr(n) {
  return typeof n?.isWmts == "function" ? n.isWmts() === !0 : !1;
}
function oc(n) {
  return n.__hideOutsidePois || !n.from ? "none" : yr(n.from) ? "front" : n.backMap ? "back" : "none";
}
function Ef(n, t, e) {
  const i = oc(n), r = [], s = [];
  return t.forEach((o, A) => {
    const a = e[A];
    a.kind === "inside" ? r.push({ ...o, xy: a.xy }) : a.kind === "outside" && i === "back" ? s.push({ ...o, merc: a.merc }) : a.kind === "outside" && i === "front" && r.push({ ...o, xy: a.merc });
  }), { front: r, back: s };
}
function eA(n) {
  return n?.getSource ? n.getSource(sc) : void 0;
}
const nA = (n) => {
  const t = n.xy || n.merc, e = new _A({
    geometry: new Bn(t),
    datum: n.data
  }), i = Rg(n.icon);
  return i && e.setStyle(i), e;
};
function iA(n, t) {
  const e = eA(n.mapObject);
  if (!e) return;
  const i = n.backMap ? eA(n.backMap) : void 0;
  e.clear(), i && i.clear(), t.front.length > 0 && e.addFeatures(t.front.map(nA)), i && t.back.length > 0 && i.addFeatures(t.back.map(nA));
}
function xf(n, t, e, i) {
  if (i.kind === "skip") return;
  const s = i.kind === "outside" && oc(n) === "back" ? n.backMap : n.mapObject;
  if (!s?.setMarker) return;
  const o = i.kind === "inside" ? i.xy : i.merc;
  s.setMarker(o, { datum: t }, e);
}
function Mf(n, t) {
  const e = n.from;
  return e?.insideCheckSysCoord ? !e.insideCheckSysCoord(t) : !1;
}
function rA(n, t) {
  const e = n.backMap;
  if (!e?.forEachFeatureAtPixel) return [];
  if (!Mf(n, t.coordinate)) return [];
  const i = e.getLayer ? e.getLayer(sc) : void 0, r = [];
  return e.forEachFeatureAtPixel(
    t.pixel,
    (s) => {
      const o = s?.get ? s.get("datum") : void 0;
      o && r.push(o);
    },
    i ? { layerFilter: (s) => s === i } : void 0
  ), r;
}
function zs(n, t) {
  if (!n.from || !t || n.__outsideSelection || n.__pendingView) return;
  const e = n.from, i = t.getCenter();
  if (i && !e.insideCheckSysCoord(i)) {
    const r = e.modulateSysCoordInside(i);
    r && t.setCenter(r);
  }
}
const Sf = (n) => {
  const t = re(n, "EPSG:3857", "EPSG:4326");
  return { longitude: t[0], latitude: t[1] };
};
function ac(n, t) {
  !n.from || !n.mapObject || (yr(n.from) ? n.mapObject.getView().setCenter(t) : n.setViewpoint && n.setViewpoint(Sf(t)));
}
function os(n, t, e) {
  const i = n.__outsideSelection;
  if (!i) return;
  const r = e?.recenter ?? !!i.pending;
  if (!t || t.kind === "skip") {
    delete n.__outsideSelection, delete n.__selectedMarker;
    const s = n.mapObject?.getView?.();
    s && zs(n, s);
    return;
  }
  if (t.kind === "inside") {
    delete n.__outsideSelection;
    const s = n.getMarker ? n.getMarker(i.id) : void 0;
    r && s && n.setViewpoint && n.setViewpoint({
      latitude: s.lnglat ? s.lnglat[1] : s.lat ?? s.latitude,
      longitude: s.lnglat ? s.lnglat[0] : s.lng ?? s.longitude
    });
    return;
  }
  n.__outsideSelection = { id: i.id, merc: t.merc }, r && ac(n, t.merc);
}
const Ot = {
  ACCURACY: "accuracy",
  ALTITUDE: "altitude",
  ALTITUDE_ACCURACY: "altitudeAccuracy",
  HEADING: "heading",
  POSITION: "position",
  SPEED: "speed",
  TRACKING: "tracking",
  TRACKING_OPTIONS: "trackingOptions"
}, Tf = {
  ERROR: "error"
};
class _f extends Le {
  code;
  message;
  constructor(t) {
    super(Tf.ERROR), this.code = t.code, this.message = t.message;
  }
}
class kf extends jn {
  task_id_;
  timer_base_ = !1;
  home_position_ = !1;
  constructor(t) {
    super(), t = t || {}, this.timer_base_ = t.timerBase !== void 0 ? t.timerBase : !1, this.task_id_ = void 0, this.home_position_ = t.homePosition !== void 0 ? t.homePosition : !1, this.addChangeListener(Ot.TRACKING, this.handleTrackingChanged_), t.trackingOptions !== void 0 ? this.setTrackingOptions(t.trackingOptions) : this.setTrackingOptions({
      enableHighAccuracy: !0,
      timeout: 5e3,
      maximumAge: 1e3
    }), this.setTracking(t.tracking !== void 0 ? t.tracking : !1);
  }
  disposeInternal() {
    this.setTracking(!1), super.disposeInternal();
  }
  handleTrackingChanged_() {
    if (this.timer_base_) {
      const t = this.getTracking(), e = this.getTrackingOptions();
      t && this.task_id_ === void 0 ? window.confirm("Allow GPS?") ? this.task_id_ = setInterval(this.timerPositionChange_.bind(this), e.maximumAge) : setTimeout(this.timerPositionError_.bind(this), e.maximumAge * 10) : !t && this.task_id_ !== void 0 && (clearInterval(this.task_id_), this.task_id_ = void 0);
    } else if ("geolocation" in navigator) {
      const t = this.getTracking();
      t && this.task_id_ === void 0 ? this.task_id_ = navigator.geolocation.watchPosition(
        this.positionChange_.bind(this),
        this.positionError_.bind(this),
        this.getTrackingOptions()
      ) : !t && this.task_id_ !== void 0 && (navigator.geolocation.clearWatch(this.task_id_), this.task_id_ = void 0);
    }
  }
  timerPositionChange_() {
    const t = {
      longitude: ns(this.home_position_[0], 0.05),
      latitude: ns(this.home_position_[1], 0.05),
      accuracy: ns(15, 10)
    };
    this.positionChange_({ coords: t });
  }
  positionChange_(t) {
    const e = t.coords;
    this.set(Ot.ACCURACY, e.accuracy), this.set(
      Ot.ALTITUDE,
      e.altitude === null ? void 0 : e.altitude
    ), this.set(
      Ot.ALTITUDE_ACCURACY,
      e.altitudeAccuracy === null ? void 0 : e.altitudeAccuracy
    ), this.set(
      Ot.HEADING,
      e.heading === null ? void 0 : _n(e.heading)
    ), this.set(Ot.POSITION, [e.longitude, e.latitude]), this.set(Ot.SPEED, e.speed === null ? void 0 : e.speed), this.changed();
  }
  timerPositionError_() {
    const t = Math.floor(Math.random() * 3) + 1, e = {
      code: t,
      message: t === 1 ? "User denied Geolocation" : t === 2 ? "Position unavailable" : "Timeout expired"
    };
    this.positionError_(e);
  }
  positionError_(t) {
    const e = new _f(t);
    this.dispatchEvent(e);
  }
  getAccuracy() {
    return this.get(Ot.ACCURACY);
  }
  getAltitude() {
    return this.get(Ot.ALTITUDE);
  }
  getAltitudeAccuracy() {
    return this.get(Ot.ALTITUDE_ACCURACY);
  }
  getHeading() {
    return this.get(Ot.HEADING);
  }
  getPosition() {
    return this.get(Ot.POSITION);
  }
  getSpeed() {
    return this.get(Ot.SPEED);
  }
  getTracking() {
    return this.get(Ot.TRACKING);
  }
  getTrackingOptions() {
    return this.get(Ot.TRACKING_OPTIONS);
  }
  setTracking(t) {
    this.set(Ot.TRACKING, t);
  }
  setTrackingOptions(t) {
    this.set(Ot.TRACKING_OPTIONS, t);
  }
}
const Rf = () => {
  const n = window.navigator.userAgent.toLowerCase();
  try {
    let t;
    return n.indexOf("chrome") != -1 ? (t = (navigator.languages[0] || navigator.browserLanguage || navigator.language || navigator.userLanguage).split(";"), t[0]) : (t = (navigator.browserLanguage || navigator.language || navigator.userLanguage).split(";"), t[0]);
  } catch {
    return "";
  }
}, Pf = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="105px" height="22px" viewBox="0 0 105 22" enable-background="new 0 0 105 22" xml:space="preserve"><g><g opacity="0.8"><path fill="#FFFFFF" d="M59.77,11.44l-0.93-2.32c-0.16-0.4-0.36-0.81-0.61-1.22c-0.26-0.42-0.6-0.85-1.01-1.27 c-0.49-0.5-1.1-0.9-1.8-1.2c-0.71-0.3-1.49-0.46-2.3-0.46c-1.16,0-2.25,0.3-3.19,0.87V0.48h-5.98v4.77H42 c-0.54-0.18-1.12-0.27-1.72-0.27c-1.68,0-3.21,0.66-4.44,1.92c-0.09,0.09-0.18,0.19-0.26,0.29c-0.1-0.12-0.21-0.24-0.33-0.35 c-1.26-1.23-2.81-1.86-4.6-1.86c-1.77,0-3.36,0.64-4.6,1.86c-0.11,0.11-0.22,0.22-0.32,0.34c-0.1-0.12-0.21-0.23-0.32-0.34 c-1.26-1.23-2.81-1.86-4.6-1.86c-1.55,0-2.91,0.46-4.06,1.38h-2.47l2.46-2.46l-1.48-1.41C13.53,0.83,11.46,0,9.08,0 C6.62,0,4.47,0.88,2.7,2.62C0.91,4.38,0,6.51,0,8.98s0.91,4.61,2.7,6.36c1.78,1.74,3.93,2.62,6.39,2.62 c2.56,0,4.68-0.87,6.28-2.54c0.04-0.04,0.08-0.08,0.12-0.13c0.21,0.29,0.44,0.56,0.7,0.81c1.24,1.22,2.83,1.86,4.6,1.86 c1.8,0,3.34-0.62,4.6-1.86c0.11-0.11,0.22-0.22,0.32-0.34c0.1,0.12,0.21,0.23,0.32,0.34c1.24,1.22,2.83,1.86,4.6,1.86 c1.26,0,2.4-0.31,3.4-0.92l0.45,1.07c0.43,1.02,1.13,1.91,2.08,2.66c1.04,0.81,2.3,1.23,3.75,1.23c1.78,0,3.29-0.58,4.47-1.73 c0.71-0.69,1.21-1.55,1.5-2.58h3.64v-0.67c1,0.62,2.16,0.94,3.42,0.94c1.3,0,2.44-0.32,3.39-0.94c0.85-0.55,1.53-1.21,2.02-1.94 l1.11-1.66l-1.87-1.25L59.77,11.44z"/><path fill="#FFFFFF" d="M105,10.11l-0.74-1.84c-0.42-1.05-1.13-1.86-2.1-2.43c-0.89-0.51-1.89-0.77-2.98-0.77 c-1.31,0-2.48,0.35-3.48,1.05c-0.24,0.17-0.45,0.36-0.65,0.56c-1.11-1.05-2.46-1.61-3.95-1.61c-0.63,0-1.22,0.09-1.78,0.27h-4.63 v0.6c-0.93-0.58-2-0.87-3.21-0.87c-1.26,0-2.34,0.31-3.22,0.9V1.5h-4.73l-3.11,5.45l-3.1-5.45H62.6v16.19h5.57V15.1h0.65h3.24 h0.65v2.59h5.57v-0.37c0.77,0.42,1.65,0.64,2.62,0.64c0.64,0,1.23-0.09,1.78-0.27h2.03v3.68h5.57v-3.46 c0.27,0.04,0.56,0.06,0.84,0.06c1.5,0,2.87-0.57,3.98-1.64c0.2,0.2,0.42,0.39,0.65,0.56c0.96,0.72,2.14,1.08,3.51,1.08 c1.43,0,2.65-0.4,3.63-1.2c1.08-0.88,1.66-2.07,1.66-3.42c0-0.97-0.32-1.89-0.93-2.66L105,10.11z"/></g><g><g><path fill="#474747" d="M9.08,8.35v1.9h4.58c-0.14,1.04-0.48,1.84-1.04,2.4c-0.94,0.93-2.11,1.4-3.53,1.4 c-1.4,0-2.58-0.49-3.55-1.48c-0.97-0.98-1.46-2.18-1.46-3.59c0-1.41,0.48-2.6,1.45-3.59C6.5,4.4,7.68,3.91,9.08,3.91 c1.33,0,2.47,0.45,3.44,1.36l1.35-1.35C12.53,2.64,10.93,2,9.08,2C7.15,2,5.49,2.68,4.09,4.05C2.7,5.42,2,7.06,2,8.98 c0,1.92,0.7,3.56,2.09,4.93c1.4,1.37,3.06,2.05,4.99,2.05c2,0,3.63-0.65,4.87-1.96c1.1-1.1,1.65-2.59,1.65-4.46 c0-0.45-0.03-0.85-0.1-1.19H9.08z"/><path fill="#474747" d="M42.72,7.97h-0.07c-0.24-0.29-0.57-0.53-0.98-0.72c-0.42-0.19-0.88-0.29-1.39-0.29 c-1.14,0-2.15,0.44-3.01,1.32c-0.86,0.88-1.29,1.94-1.29,3.19c0,1.24,0.43,2.3,1.29,3.17c0.86,0.87,1.86,1.31,3.01,1.31 c1.02,0,1.81-0.34,2.37-1.02h0.07v0.65c0,0.85-0.21,1.51-0.64,1.96c-0.42,0.45-1.01,0.68-1.76,0.68c-0.55,0-1.02-0.16-1.41-0.48 c-0.38-0.31-0.67-0.69-0.85-1.12l-1.72,0.72c0.29,0.71,0.78,1.33,1.46,1.86c0.68,0.53,1.52,0.8,2.52,0.8 c1.25,0,2.27-0.39,3.07-1.17c0.8-0.78,1.2-1.95,1.2-3.52V7.24h-1.87V7.97z M42.16,13.42c-0.46,0.51-1.03,0.77-1.71,0.77 c-0.69,0-1.28-0.26-1.77-0.78c-0.49-0.51-0.73-1.16-0.73-1.93c0-0.78,0.24-1.44,0.73-1.96c0.49-0.52,1.08-0.78,1.77-0.78 c0.68,0,1.25,0.26,1.71,0.79c0.46,0.52,0.69,1.18,0.69,1.96C42.85,12.26,42.62,12.9,42.16,13.42z"/><path fill="#474747" d="M20.8,6.97c-1.26,0-2.33,0.43-3.2,1.29s-1.31,1.93-1.31,3.21c0,1.28,0.44,2.35,1.31,3.21 s1.94,1.29,3.2,1.29s2.33-0.43,3.2-1.29c0.88-0.86,1.31-1.93,1.31-3.21c0-1.28-0.44-2.35-1.31-3.21S22.06,6.97,20.8,6.97z M22.59,13.42c-0.5,0.51-1.1,0.77-1.79,0.77s-1.29-0.25-1.79-0.77c-0.5-0.52-0.75-1.17-0.75-1.95c0-0.8,0.25-1.45,0.74-1.96 c0.5-0.51,1.1-0.77,1.8-0.77S22.1,9,22.6,9.51c0.49,0.51,0.74,1.17,0.74,1.96C23.34,12.25,23.09,12.9,22.59,13.42z"/><rect x="45.95" y="2.48" fill="#474747" width="1.98" height="13.21"/><path fill="#474747" d="M53.34,14.2c-0.99,0-1.71-0.45-2.18-1.36l6.01-2.49l-0.2-0.51c-0.11-0.3-0.26-0.59-0.44-0.89 c-0.18-0.29-0.42-0.6-0.73-0.91c-0.31-0.32-0.69-0.57-1.16-0.77c-0.47-0.2-0.97-0.3-1.52-0.3c-1.19,0-2.19,0.42-3.01,1.26 c-0.82,0.84-1.23,1.92-1.23,3.24c0,1.27,0.43,2.34,1.28,3.2c0.85,0.86,1.91,1.29,3.18,1.29c0.91,0,1.68-0.2,2.29-0.6 c0.63-0.41,1.11-0.87,1.45-1.38l-1.53-1.02C54.99,13.79,54.25,14.2,53.34,14.2z M51.56,9.43c0.51-0.48,1.05-0.72,1.63-0.72 c0.39,0,0.73,0.08,1.04,0.26c0.31,0.18,0.52,0.41,0.63,0.69l-4.02,1.67C50.82,10.54,51.06,9.9,51.56,9.43z"/><path fill="#474747" d="M30.65,6.97c-1.26,0-2.33,0.43-3.2,1.29s-1.31,1.93-1.31,3.21c0,1.28,0.44,2.35,1.31,3.21 s1.94,1.29,3.2,1.29c1.26,0,2.33-0.43,3.2-1.29c0.87-0.86,1.31-1.93,1.31-3.21c0-1.28-0.44-2.35-1.31-3.21S31.91,6.97,30.65,6.97 z M32.44,13.42c-0.5,0.51-1.1,0.77-1.79,0.77s-1.29-0.25-1.79-0.77c-0.5-0.52-0.75-1.17-0.75-1.95c0-0.8,0.25-1.45,0.74-1.96 c0.5-0.51,1.1-0.77,1.8-0.77c0.71,0,1.31,0.26,1.8,0.77s0.74,1.17,0.74,1.96C33.19,12.25,32.94,12.9,32.44,13.42z"/></g><g><polygon fill="#474747" points="70.48,10.92 70.41,10.92 66.17,3.5 64.6,3.5 64.6,15.69 66.17,15.69 66.17,8.45 66.1,6.41 66.17,6.41 69.98,13.1 70.9,13.1 74.72,6.41 74.79,6.41 74.72,8.45 74.72,15.69 76.29,15.69 76.29,3.5 74.72,3.5 "/><path fill="#474747" d="M81.5,7.07c-0.93,0-1.68,0.21-2.25,0.64S78.3,8.6,78.11,9.1l1.44,0.61c0.14-0.38,0.39-0.67,0.76-0.89 c0.36-0.21,0.78-0.32,1.23-0.32c0.61,0,1.13,0.18,1.55,0.55c0.42,0.37,0.63,0.86,0.63,1.47v0.24c-0.59-0.34-1.34-0.51-2.26-0.51 c-1.04,0-1.91,0.25-2.61,0.77c-0.71,0.52-1.06,1.23-1.06,2.14c0,0.84,0.29,1.52,0.89,2.03c0.59,0.51,1.33,0.77,2.22,0.77 c1.21,0,2.12-0.47,2.75-1.43h0.07v1.16h1.5v-5.04c0-1.14-0.36-2.02-1.06-2.64C83.45,7.38,82.57,7.07,81.5,7.07z M82.92,13.81 c-0.53,0.48-1.11,0.72-1.76,0.72c-0.46,0-0.86-0.12-1.21-0.35c-0.35-0.24-0.53-0.56-0.53-0.97c0-0.44,0.19-0.83,0.58-1.16 s0.96-0.49,1.72-0.49c0.88,0,1.55,0.18,1.99,0.54C83.71,12.76,83.45,13.33,82.92,13.81z"/><path fill="#474747" d="M91.12,7.08c-0.63,0-1.2,0.14-1.71,0.41c-0.5,0.27-0.88,0.61-1.13,1.02h-0.07V7.35h-1.5v12.02h1.57v-3.68 l-0.07-1.16h0.07c0.25,0.41,0.62,0.75,1.13,1.02c0.5,0.27,1.07,0.41,1.71,0.41c1.08,0,2.01-0.42,2.79-1.26 c0.79-0.85,1.18-1.91,1.18-3.17c0-1.26-0.4-2.32-1.18-3.17C93.13,7.51,92.2,7.08,91.12,7.08z M92.73,13.7 c-0.52,0.55-1.14,0.83-1.87,0.83c-0.73,0-1.36-0.27-1.88-0.82c-0.51-0.55-0.77-1.28-0.77-2.2s0.25-1.66,0.77-2.2 c0.51-0.55,1.14-0.82,1.88-0.82c0.72,0,1.35,0.28,1.87,0.83c0.52,0.55,0.78,1.28,0.78,2.19C93.51,12.42,93.25,13.15,92.73,13.7z" /><path fill="#474747" d="M101.96,11.84c-0.38-0.45-0.96-0.76-1.74-0.94l-1.65-0.39c-0.74-0.17-1.11-0.49-1.11-0.97 c0-0.33,0.16-0.59,0.48-0.78s0.71-0.29,1.18-0.29c0.97,0,1.6,0.37,1.91,1.11l1.36-0.56c-0.25-0.63-0.66-1.1-1.24-1.44 c-0.58-0.33-1.24-0.5-1.98-0.5c-0.89,0-1.67,0.23-2.32,0.69c-0.65,0.46-0.98,1.06-0.98,1.8c0,0.65,0.24,1.16,0.72,1.54 s0.99,0.63,1.52,0.77l1.69,0.41c0.76,0.2,1.14,0.57,1.14,1.11c0,0.35-0.16,0.63-0.47,0.85c-0.31,0.21-0.71,0.32-1.2,0.32 c-1.06,0-1.82-0.53-2.26-1.57l-1.4,0.58c0.29,0.68,0.73,1.25,1.34,1.7c0.61,0.45,1.38,0.68,2.31,0.68c0.96,0,1.75-0.25,2.34-0.75 c0.61-0.5,0.92-1.12,0.92-1.87C102.52,12.78,102.33,12.28,101.96,11.84z"/></g></g></g></svg>', Of = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="105px" height="22px" viewBox="0 0 105 22" enable-background="new 0 0 105 22" xml:space="preserve"><g><g opacity="0.8"><path fill="#1E1E1E" d="M59.77,11.44l-0.93-2.32c-0.16-0.4-0.36-0.81-0.61-1.22c-0.26-0.42-0.6-0.85-1.01-1.27 c-0.49-0.5-1.1-0.9-1.8-1.2c-0.71-0.3-1.49-0.46-2.3-0.46c-1.16,0-2.25,0.3-3.19,0.87V0.48h-5.98v4.77H42 c-0.54-0.18-1.12-0.27-1.72-0.27c-1.68,0-3.21,0.66-4.44,1.92c-0.09,0.09-0.18,0.19-0.26,0.29c-0.1-0.12-0.21-0.24-0.33-0.35 c-1.26-1.23-2.81-1.86-4.6-1.86c-1.77,0-3.36,0.64-4.6,1.86c-0.11,0.11-0.22,0.22-0.32,0.34c-0.1-0.12-0.21-0.23-0.32-0.34 c-1.26-1.23-2.81-1.86-4.6-1.86c-1.55,0-2.91,0.46-4.06,1.38h-2.47l2.46-2.46l-1.48-1.41C13.53,0.83,11.46,0,9.08,0 C6.62,0,4.47,0.88,2.7,2.62C0.91,4.38,0,6.51,0,8.98s0.91,4.61,2.7,6.36c1.78,1.74,3.93,2.62,6.39,2.62 c2.56,0,4.68-0.87,6.28-2.54c0.04-0.04,0.08-0.08,0.12-0.13c0.21,0.29,0.44,0.56,0.7,0.81c1.24,1.22,2.83,1.86,4.6,1.86 c1.8,0,3.34-0.62,4.6-1.86c0.11-0.11,0.22-0.22,0.32-0.34c0.1,0.12,0.21,0.23,0.32,0.34c1.24,1.22,2.83,1.86,4.6,1.86 c1.26,0,2.4-0.31,3.4-0.92l0.45,1.07c0.43,1.02,1.13,1.91,2.08,2.66c1.04,0.81,2.3,1.23,3.75,1.23c1.78,0,3.29-0.58,4.47-1.73 c0.71-0.69,1.21-1.55,1.5-2.58h3.64v-0.67c1,0.62,2.16,0.94,3.42,0.94c1.3,0,2.44-0.32,3.39-0.94c0.85-0.55,1.53-1.21,2.02-1.94 l1.11-1.66l-1.87-1.25L59.77,11.44z"/><path fill="#1E1E1E" d="M105,10.11l-0.74-1.84c-0.42-1.05-1.13-1.86-2.1-2.43c-0.89-0.51-1.89-0.77-2.98-0.77 c-1.31,0-2.48,0.35-3.48,1.05c-0.24,0.17-0.45,0.36-0.65,0.56c-1.11-1.05-2.46-1.61-3.95-1.61c-0.63,0-1.22,0.09-1.78,0.27h-4.63 v0.6c-0.93-0.58-2-0.87-3.21-0.87c-1.26,0-2.34,0.31-3.22,0.9V1.5h-4.73l-3.11,5.45l-3.1-5.45H62.6v16.19h5.57V15.1h0.65h3.24 h0.65v2.59h5.57v-0.37c0.77,0.42,1.65,0.64,2.62,0.64c0.64,0,1.23-0.09,1.78-0.27h2.03v3.68h5.57v-3.46 c0.27,0.04,0.56,0.06,0.84,0.06c1.5,0,2.87-0.57,3.98-1.64c0.2,0.2,0.42,0.39,0.65,0.56c0.96,0.72,2.14,1.08,3.51,1.08 c1.43,0,2.65-0.4,3.63-1.2c1.08-0.88,1.66-2.07,1.66-3.42c0-0.97-0.32-1.89-0.93-2.66L105,10.11z"/></g><g><g><path fill="#FFFFFF" d="M9.08,8.35v1.9h4.58c-0.14,1.04-0.48,1.84-1.04,2.4c-0.94,0.93-2.11,1.4-3.53,1.4 c-1.4,0-2.58-0.49-3.55-1.48c-0.97-0.98-1.46-2.18-1.46-3.59c0-1.41,0.48-2.6,1.45-3.59C6.5,4.4,7.68,3.91,9.08,3.91 c1.33,0,2.47,0.45,3.44,1.36l1.35-1.35C12.53,2.64,10.93,2,9.08,2C7.15,2,5.49,2.68,4.09,4.05C2.7,5.42,2,7.06,2,8.98 c0,1.92,0.7,3.56,2.09,4.93c1.4,1.37,3.06,2.05,4.99,2.05c2,0,3.63-0.65,4.87-1.96c1.1-1.1,1.65-2.59,1.65-4.46 c0-0.45-0.03-0.85-0.1-1.19H9.08z"/><path fill="#FFFFFF" d="M42.72,7.97h-0.07c-0.24-0.29-0.57-0.53-0.98-0.72c-0.42-0.19-0.88-0.29-1.39-0.29 c-1.14,0-2.15,0.44-3.01,1.32c-0.86,0.88-1.29,1.94-1.29,3.19c0,1.24,0.43,2.3,1.29,3.17c0.86,0.87,1.86,1.31,3.01,1.31 c1.02,0,1.81-0.34,2.37-1.02h0.07v0.65c0,0.85-0.21,1.51-0.64,1.96c-0.42,0.45-1.01,0.68-1.76,0.68c-0.55,0-1.02-0.16-1.41-0.48 c-0.38-0.31-0.67-0.69-0.85-1.12l-1.72,0.72c0.29,0.71,0.78,1.33,1.46,1.86c0.68,0.53,1.52,0.8,2.52,0.8 c1.25,0,2.27-0.39,3.07-1.17c0.8-0.78,1.2-1.95,1.2-3.52V7.24h-1.87V7.97z M42.16,13.42c-0.46,0.51-1.03,0.77-1.71,0.77 c-0.69,0-1.28-0.26-1.77-0.78c-0.49-0.51-0.73-1.16-0.73-1.93c0-0.78,0.24-1.44,0.73-1.96c0.49-0.52,1.08-0.78,1.77-0.78 c0.68,0,1.25,0.26,1.71,0.79c0.46,0.52,0.69,1.18,0.69,1.96C42.85,12.26,42.62,12.9,42.16,13.42z"/><path fill="#FFFFFF" d="M20.8,6.97c-1.26,0-2.33,0.43-3.2,1.29s-1.31,1.93-1.31,3.21c0,1.28,0.44,2.35,1.31,3.21 s1.94,1.29,3.2,1.29s2.33-0.43,3.2-1.29c0.88-0.86,1.31-1.93,1.31-3.21c0-1.28-0.44-2.35-1.31-3.21S22.06,6.97,20.8,6.97z M22.59,13.42c-0.5,0.51-1.1,0.77-1.79,0.77s-1.29-0.25-1.79-0.77c-0.5-0.52-0.75-1.17-0.75-1.95c0-0.8,0.25-1.45,0.74-1.96 c0.5-0.51,1.1-0.77,1.8-0.77S22.1,9,22.6,9.51c0.49,0.51,0.74,1.17,0.74,1.96C23.34,12.25,23.09,12.9,22.59,13.42z"/><rect x="45.95" y="2.48" fill="#FFFFFF" width="1.98" height="13.21"/><path fill="#FFFFFF" d="M53.34,14.2c-0.99,0-1.71-0.45-2.18-1.36l6.01-2.49l-0.2-0.51c-0.11-0.3-0.26-0.59-0.44-0.89 c-0.18-0.29-0.42-0.6-0.73-0.91c-0.31-0.32-0.69-0.57-1.16-0.77c-0.47-0.2-0.97-0.3-1.52-0.3c-1.19,0-2.19,0.42-3.01,1.26 c-0.82,0.84-1.23,1.92-1.23,3.24c0,1.27,0.43,2.34,1.28,3.2c0.85,0.86,1.91,1.29,3.18,1.29c0.91,0,1.68-0.2,2.29-0.6 c0.63-0.41,1.11-0.87,1.45-1.38l-1.53-1.02C54.99,13.79,54.25,14.2,53.34,14.2z M51.56,9.43c0.51-0.48,1.05-0.72,1.63-0.72 c0.39,0,0.73,0.08,1.04,0.26c0.31,0.18,0.52,0.41,0.63,0.69l-4.02,1.67C50.82,10.54,51.06,9.9,51.56,9.43z"/><path fill="#FFFFFF" d="M30.65,6.97c-1.26,0-2.33,0.43-3.2,1.29s-1.31,1.93-1.31,3.21c0,1.28,0.44,2.35,1.31,3.21 s1.94,1.29,3.2,1.29c1.26,0,2.33-0.43,3.2-1.29c0.87-0.86,1.31-1.93,1.31-3.21c0-1.28-0.44-2.35-1.31-3.21S31.91,6.97,30.65,6.97 z M32.44,13.42c-0.5,0.51-1.1,0.77-1.79,0.77s-1.29-0.25-1.79-0.77c-0.5-0.52-0.75-1.17-0.75-1.95c0-0.8,0.25-1.45,0.74-1.96 c0.5-0.51,1.1-0.77,1.8-0.77c0.71,0,1.31,0.26,1.8,0.77s0.74,1.17,0.74,1.96C33.19,12.25,32.94,12.9,32.44,13.42z"/></g><g><polygon fill="#FFFFFF" points="70.48,10.92 70.41,10.92 66.17,3.5 64.6,3.5 64.6,15.69 66.17,15.69 66.17,8.45 66.1,6.41 66.17,6.41 69.98,13.1 70.9,13.1 74.72,6.41 74.79,6.41 74.72,8.45 74.72,15.69 76.29,15.69 76.29,3.5 74.72,3.5 "/><path fill="#FFFFFF" d="M81.5,7.07c-0.93,0-1.68,0.21-2.25,0.64S78.3,8.6,78.11,9.1l1.44,0.61c0.14-0.38,0.39-0.67,0.76-0.89 c0.36-0.21,0.78-0.32,1.23-0.32c0.61,0,1.13,0.18,1.55,0.55c0.42,0.37,0.63,0.86,0.63,1.47v0.24c-0.59-0.34-1.34-0.51-2.26-0.51 c-1.04,0-1.91,0.25-2.61,0.77c-0.71,0.52-1.06,1.23-1.06,2.14c0,0.84,0.29,1.52,0.89,2.03c0.59,0.51,1.33,0.77,2.22,0.77 c1.21,0,2.12-0.47,2.75-1.43h0.07v1.16h1.5v-5.04c0-1.14-0.36-2.02-1.06-2.64C83.45,7.38,82.57,7.07,81.5,7.07z M82.92,13.81 c-0.53,0.48-1.11,0.72-1.76,0.72c-0.46,0-0.86-0.12-1.21-0.35c-0.35-0.24-0.53-0.56-0.53-0.97c0-0.44,0.19-0.83,0.58-1.16 s0.96-0.49,1.72-0.49c0.88,0,1.55,0.18,1.99,0.54C83.71,12.76,83.45,13.33,82.92,13.81z"/><path fill="#FFFFFF" d="M91.12,7.08c-0.63,0-1.2,0.14-1.71,0.41c-0.5,0.27-0.88,0.61-1.13,1.02h-0.07V7.35h-1.5v12.02h1.57v-3.68 l-0.07-1.16h0.07c0.25,0.41,0.62,0.75,1.13,1.02c0.5,0.27,1.07,0.41,1.71,0.41c1.08,0,2.01-0.42,2.79-1.26 c0.79-0.85,1.18-1.91,1.18-3.17c0-1.26-0.4-2.32-1.18-3.17C93.13,7.51,92.2,7.08,91.12,7.08z M92.73,13.7 c-0.52,0.55-1.14,0.83-1.87,0.83c-0.73,0-1.36-0.27-1.88-0.82c-0.51-0.55-0.77-1.28-0.77-2.2s0.25-1.66,0.77-2.2 c0.51-0.55,1.14-0.82,1.88-0.82c0.72,0,1.35,0.28,1.87,0.83c0.52,0.55,0.78,1.28,0.78,2.19C93.51,12.42,93.25,13.15,92.73,13.7z" /><path fill="#FFFFFF" d="M101.96,11.84c-0.38-0.45-0.96-0.76-1.74-0.94l-1.65-0.39c-0.74-0.17-1.11-0.49-1.11-0.97 c0-0.33,0.16-0.59,0.48-0.78s0.71-0.29,1.18-0.29c0.97,0,1.6,0.37,1.91,1.11l1.36-0.56c-0.25-0.63-0.66-1.1-1.24-1.44 c-0.58-0.33-1.24-0.5-1.98-0.5c-0.89,0-1.67,0.23-2.32,0.69c-0.65,0.46-0.98,1.06-0.98,1.8c0,0.65,0.24,1.16,0.72,1.54 s0.99,0.63,1.52,0.77l1.69,0.41c0.76,0.2,1.14,0.57,1.14,1.11c0,0.35-0.16,0.63-0.47,0.85c-0.31,0.21-0.71,0.32-1.2,0.32 c-1.06,0-1.82-0.53-2.26-1.57l-1.4,0.58c0.29,0.68,0.73,1.25,1.34,1.7c0.61,0.45,1.38,0.68,2.31,0.68c0.96,0,1.75-0.25,2.34-0.75 c0.61-0.5,0.92-1.12,0.92-1.87C102.52,12.78,102.33,12.28,101.96,11.84z"/></g></g></g></svg>';
/*! @license DOMPurify 3.4.17 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.17/LICENSE */
function sA(n, t) {
  (t == null || t > n.length) && (t = n.length);
  for (var e = 0, i = Array(t); e < t; e++) i[e] = n[e];
  return i;
}
function Lf(n) {
  if (Array.isArray(n)) return n;
}
function Df(n, t) {
  var e = n == null ? null : typeof Symbol < "u" && n[Symbol.iterator] || n["@@iterator"];
  if (e != null) {
    var i, r, s, o, A = [], a = !0, g = !1;
    try {
      if (s = (e = e.call(n)).next, t !== 0) for (; !(a = (i = s.call(e)).done) && (A.push(i.value), A.length !== t); a = !0) ;
    } catch (c) {
      g = !0, r = c;
    } finally {
      try {
        if (!a && e.return != null && (o = e.return(), Object(o) !== o)) return;
      } finally {
        if (g) throw r;
      }
    }
    return A;
  }
}
function Bf() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
function Nf(n, t) {
  return Lf(n) || Df(n, t) || Ff(n, t) || Bf();
}
function Ff(n, t) {
  if (n) {
    if (typeof n == "string") return sA(n, t);
    var e = {}.toString.call(n).slice(8, -1);
    return e === "Object" && n.constructor && (e = n.constructor.name), e === "Map" || e === "Set" ? Array.from(n) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? sA(n, t) : void 0;
  }
}
const Ac = Object.entries, oA = Object.setPrototypeOf, jf = Object.isFrozen, gc = Object.getPrototypeOf, cc = Object.getOwnPropertyDescriptor;
let Pt = Object.freeze, Ft = Object.seal, En = Object.create, lc = typeof Reflect < "u" && Reflect, Us = lc.apply, Xs = lc.construct;
Pt || (Pt = function(t) {
  return t;
});
Ft || (Ft = function(t) {
  return t;
});
Us || (Us = function(t, e) {
  for (var i = arguments.length, r = new Array(i > 2 ? i - 2 : 0), s = 2; s < i; s++) r[s - 2] = arguments[s];
  return t.apply(e, r);
});
Xs || (Xs = function(t) {
  for (var e = arguments.length, i = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) i[r - 1] = arguments[r];
  return new t(...i);
});
const Se = vt(Array.prototype.forEach), Gf = vt(Array.prototype.lastIndexOf), aA = vt(Array.prototype.pop), $n = vt(Array.prototype.push), zf = vt(Array.prototype.slice), Uf = vt(Array.prototype.splice), On = Array.isArray, as = uc(Set), As = vt(Set.prototype.add), ti = vt(Set.prototype.has), Ke = vt(String.prototype.toLowerCase), gs = vt(String.prototype.toString), AA = vt(String.prototype.match), ei = vt(String.prototype.replace), gA = vt(String.prototype.indexOf), Xf = vt(String.prototype.trim), Zf = vt(Number.prototype.toString), Wf = vt(Boolean.prototype.toString), cA = typeof BigInt > "u" ? null : vt(BigInt.prototype.toString), lA = typeof Symbol > "u" ? null : vt(Symbol.prototype.toString), ee = vt(Object.prototype.hasOwnProperty), ni = vt(Object.prototype.toString), Lt = vt(RegExp.prototype.test), Te = uc(TypeError);
function vt(n) {
  return function(t) {
    t instanceof RegExp && (t.lastIndex = 0);
    for (var e = arguments.length, i = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) i[r - 1] = arguments[r];
    return Us(n, t, i);
  };
}
function uc(n) {
  return function() {
    for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++) e[i] = arguments[i];
    return Xs(n, e);
  };
}
function It(n, t) {
  let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Ke;
  if (oA && oA(n, null), !On(t)) return n;
  let i = t.length;
  for (; i--; ) {
    let r = t[i];
    if (typeof r == "string") {
      const s = e(r);
      s !== r && (jf(t) || (t[i] = s), r = s);
    }
    n[r] = !0;
  }
  return n;
}
function Vf(n) {
  for (let t = 0; t < n.length; t++) ee(n, t) || (n[t] = null);
  return n;
}
function oe(n) {
  const t = En(null);
  for (const i of Ac(n)) {
    var e = Nf(i, 2);
    const r = e[0], s = e[1];
    ee(n, r) && (On(s) ? t[r] = Vf(s) : s && typeof s == "object" && s.constructor === Object ? t[r] = oe(s) : t[r] = s);
  }
  return t;
}
function Hf(n) {
  switch (typeof n) {
    case "string":
      return n;
    case "number":
      return Zf(n);
    case "boolean":
      return Wf(n);
    case "bigint":
      return cA ? cA(n) : "0";
    case "symbol":
      return lA ? lA(n) : "Symbol()";
    case "undefined":
      return ni(n);
    case "function":
    case "object": {
      if (n === null) return ni(n);
      const t = n, e = ge(t, "toString");
      if (typeof e == "function") {
        const i = e(t);
        return typeof i == "string" ? i : ni(i);
      }
      return ni(n);
    }
    default:
      return ni(n);
  }
}
function ge(n, t) {
  for (; n !== null; ) {
    const i = cc(n, t);
    if (i) {
      if (i.get) return vt(i.get);
      if (typeof i.value == "function") return vt(i.value);
    }
    n = gc(n);
  }
  function e() {
    return null;
  }
  return e;
}
function Qf(n, t) {
  for (; n !== null; ) {
    const e = cc(n, t);
    if (e) return e.get ? vt(e.get) : null;
    n = gc(n);
  }
  return null;
}
function Yf(n) {
  try {
    return Lt(n, ""), !0;
  } catch {
    return !1;
  }
}
const uA = Pt([
  "a",
  "abbr",
  "acronym",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "bdi",
  "bdo",
  "big",
  "blink",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "content",
  "data",
  "datalist",
  "dd",
  "decorator",
  "del",
  "details",
  "dfn",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "element",
  "em",
  "fieldset",
  "figcaption",
  "figure",
  "font",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "main",
  "map",
  "mark",
  "marquee",
  "menu",
  "menuitem",
  "meter",
  "nav",
  "nobr",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "search",
  "section",
  "select",
  "shadow",
  "slot",
  "small",
  "source",
  "spacer",
  "span",
  "strike",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "track",
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr"
]), cs = Pt([
  "svg",
  "a",
  "altglyph",
  "altglyphdef",
  "altglyphitem",
  "animatecolor",
  "animatemotion",
  "animatetransform",
  "circle",
  "clippath",
  "defs",
  "desc",
  "ellipse",
  "enterkeyhint",
  "exportparts",
  "filter",
  "font",
  "g",
  "glyph",
  "glyphref",
  "hkern",
  "image",
  "inputmode",
  "line",
  "lineargradient",
  "marker",
  "mask",
  "metadata",
  "mpath",
  "part",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialgradient",
  "rect",
  "stop",
  "style",
  "switch",
  "symbol",
  "text",
  "textpath",
  "title",
  "tref",
  "tspan",
  "view",
  "vkern"
]), ls = Pt([
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence"
]), Kf = Pt([
  "animate",
  "color-profile",
  "cursor",
  "discard",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignobject",
  "hatch",
  "hatchpath",
  "mesh",
  "meshgradient",
  "meshpatch",
  "meshrow",
  "missing-glyph",
  "script",
  "set",
  "solidcolor",
  "unknown",
  "use"
]), us = Pt([
  "math",
  "menclose",
  "merror",
  "mfenced",
  "mfrac",
  "mglyph",
  "mi",
  "mlabeledtr",
  "mmultiscripts",
  "mn",
  "mo",
  "mover",
  "mpadded",
  "mphantom",
  "mroot",
  "mrow",
  "ms",
  "mspace",
  "msqrt",
  "mstyle",
  "msub",
  "msup",
  "msubsup",
  "mtable",
  "mtd",
  "mtext",
  "mtr",
  "munder",
  "munderover",
  "mprescripts"
]), Jf = Pt([
  "maction",
  "maligngroup",
  "malignmark",
  "mlongdiv",
  "mscarries",
  "mscarry",
  "msgroup",
  "mstack",
  "msline",
  "msrow",
  "semantics",
  "annotation",
  "annotation-xml",
  "mprescripts",
  "none"
]), IA = Pt(["#text"]), hA = Pt([
  "accept",
  "action",
  "align",
  "alt",
  "autocapitalize",
  "autocomplete",
  "autopictureinpicture",
  "autoplay",
  "background",
  "bgcolor",
  "border",
  "capture",
  "cellpadding",
  "cellspacing",
  "checked",
  "cite",
  "class",
  "clear",
  "color",
  "cols",
  "colspan",
  "command",
  "commandfor",
  "controls",
  "controlslist",
  "coords",
  "crossorigin",
  "datetime",
  "decoding",
  "default",
  "dir",
  "disabled",
  "disablepictureinpicture",
  "disableremoteplayback",
  "download",
  "draggable",
  "enctype",
  "enterkeyhint",
  "exportparts",
  "face",
  "for",
  "headers",
  "height",
  "hidden",
  "high",
  "href",
  "hreflang",
  "id",
  "inert",
  "inputmode",
  "integrity",
  "ismap",
  "kind",
  "label",
  "lang",
  "list",
  "loading",
  "loop",
  "low",
  "max",
  "maxlength",
  "media",
  "method",
  "min",
  "minlength",
  "multiple",
  "muted",
  "name",
  "nonce",
  "noshade",
  "novalidate",
  "nowrap",
  "open",
  "optimum",
  "part",
  "pattern",
  "placeholder",
  "playsinline",
  "popover",
  "popovertarget",
  "popovertargetaction",
  "poster",
  "preload",
  "pubdate",
  "radiogroup",
  "readonly",
  "rel",
  "required",
  "rev",
  "reversed",
  "role",
  "rows",
  "rowspan",
  "spellcheck",
  "scope",
  "selected",
  "shape",
  "size",
  "sizes",
  "slot",
  "span",
  "srclang",
  "start",
  "src",
  "srcset",
  "step",
  "style",
  "summary",
  "tabindex",
  "title",
  "translate",
  "type",
  "usemap",
  "valign",
  "value",
  "width",
  "wrap",
  "xmlns"
]), Is = Pt([
  "accent-height",
  "accumulate",
  "additive",
  "alignment-baseline",
  "amplitude",
  "ascent",
  "attributename",
  "attributetype",
  "azimuth",
  "basefrequency",
  "baseline-shift",
  "begin",
  "bias",
  "by",
  "class",
  "clip",
  "clippathunits",
  "clip-path",
  "clip-rule",
  "color",
  "color-interpolation",
  "color-interpolation-filters",
  "color-profile",
  "color-rendering",
  "cx",
  "cy",
  "d",
  "dx",
  "dy",
  "diffuseconstant",
  "direction",
  "display",
  "divisor",
  "dominant-baseline",
  "dur",
  "edgemode",
  "elevation",
  "end",
  "exponent",
  "fill",
  "fill-opacity",
  "fill-rule",
  "filter",
  "filterunits",
  "flood-color",
  "flood-opacity",
  "font-family",
  "font-size",
  "font-size-adjust",
  "font-stretch",
  "font-style",
  "font-variant",
  "font-weight",
  "fx",
  "fy",
  "g1",
  "g2",
  "glyph-name",
  "glyphref",
  "gradientunits",
  "gradienttransform",
  "height",
  "href",
  "id",
  "image-rendering",
  "in",
  "in2",
  "intercept",
  "k",
  "k1",
  "k2",
  "k3",
  "k4",
  "kerning",
  "keypoints",
  "keysplines",
  "keytimes",
  "lang",
  "lengthadjust",
  "letter-spacing",
  "kernelmatrix",
  "kernelunitlength",
  "lighting-color",
  "local",
  "marker-end",
  "marker-mid",
  "marker-start",
  "markerheight",
  "markerunits",
  "markerwidth",
  "maskcontentunits",
  "maskunits",
  "max",
  "mask",
  "mask-type",
  "media",
  "method",
  "mode",
  "min",
  "name",
  "numoctaves",
  "offset",
  "operator",
  "opacity",
  "order",
  "orient",
  "orientation",
  "origin",
  "overflow",
  "paint-order",
  "path",
  "pathlength",
  "patterncontentunits",
  "patterntransform",
  "patternunits",
  "pointer-events",
  "points",
  "preservealpha",
  "preserveaspectratio",
  "primitiveunits",
  "r",
  "rx",
  "ry",
  "radius",
  "refx",
  "refy",
  "repeatcount",
  "repeatdur",
  "restart",
  "result",
  "rotate",
  "scale",
  "seed",
  "shape-rendering",
  "slope",
  "specularconstant",
  "specularexponent",
  "spreadmethod",
  "startoffset",
  "stddeviation",
  "stitchtiles",
  "stop-color",
  "stop-opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke",
  "stroke-width",
  "style",
  "surfacescale",
  "systemlanguage",
  "tabindex",
  "tablevalues",
  "targetx",
  "targety",
  "transform",
  "transform-origin",
  "text-anchor",
  "text-decoration",
  "text-orientation",
  "text-rendering",
  "textlength",
  "type",
  "u1",
  "u2",
  "unicode",
  "values",
  "vector-effect",
  "viewbox",
  "visibility",
  "version",
  "vert-adv-y",
  "vert-origin-x",
  "vert-origin-y",
  "width",
  "word-spacing",
  "wrap",
  "writing-mode",
  "xchannelselector",
  "ychannelselector",
  "x",
  "x1",
  "x2",
  "xmlns",
  "y",
  "y1",
  "y2",
  "z",
  "zoomandpan"
]), CA = Pt([
  "accent",
  "accentunder",
  "align",
  "bevelled",
  "close",
  "columnalign",
  "columnlines",
  "columnspacing",
  "columnspan",
  "denomalign",
  "depth",
  "dir",
  "display",
  "displaystyle",
  "encoding",
  "fence",
  "frame",
  "height",
  "href",
  "id",
  "largeop",
  "length",
  "linethickness",
  "lquote",
  "lspace",
  "mathbackground",
  "mathcolor",
  "mathsize",
  "mathvariant",
  "maxsize",
  "minsize",
  "movablelimits",
  "notation",
  "numalign",
  "open",
  "rowalign",
  "rowlines",
  "rowspacing",
  "rowspan",
  "rspace",
  "rquote",
  "scriptlevel",
  "scriptminsize",
  "scriptsizemultiplier",
  "selection",
  "separator",
  "separators",
  "stretchy",
  "subscriptshift",
  "supscriptshift",
  "symmetric",
  "voffset",
  "width",
  "xmlns"
]), Wi = Pt([
  "xlink:href",
  "xml:id",
  "xlink:title",
  "xml:space",
  "xmlns:xlink"
]), qf = Ft(/{{[\w\W]*|^[\w\W]*}}/g), $f = Ft(/<%[\w\W]*|^[\w\W]*%>/g), td = Ft(/\${[\w\W]*/g), ed = Ft(/^data-[\-\w.\u00B7-\uFFFF]+$/), nd = Ft(/^aria-[\-\w]+$/), fA = Ft(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), id = Ft(/^(?:\w+script|data):/i), rd = Ft(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), sd = Ft(/^html$/i), od = Ft(/^[a-z][.\w]*(-[.\w]+)+$/i), hs = Ft(/<[/\w!]/g), dA = Ft(/<[/\w]/g), ad = Ft(/<\/no(script|embed|frames)/i), pA = Ft(/\/>/i), Mt = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  entityNode: 6,
  processingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12
}, Ad = Pt(It({}, [
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
])), gd = function() {
  return typeof window > "u" ? null : window;
}, cd = function(t, e) {
  if (typeof t != "object" || typeof t.createPolicy != "function") return null;
  let i = null;
  const r = "data-tt-policy-suffix";
  e && e.hasAttribute(r) && (i = e.getAttribute(r));
  const s = "dompurify" + (i ? "#" + i : "");
  try {
    return t.createPolicy(s, {
      createHTML(o) {
        return o;
      },
      createScriptURL(o) {
        return o;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + s + " could not be created."), null;
  }
}, mA = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
}, Ge = function(t, e, i, r) {
  return ee(t, e) && On(t[e]) ? It(r.base ? oe(r.base) : {}, t[e], r.transform) : i;
}, Cs = function(t, e, i) {
  const r = ee(t, e) ? t[e] : void 0;
  return r && typeof r == "object" ? oe(r) : i();
};
function Ic() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : gd();
  const t = (U) => Ic(U);
  if (t.version = "3.4.17", t.removed = [], !n || !n.document || n.document.nodeType !== Mt.document || !n.Element)
    return t.isSupported = !1, t;
  let e = n.document;
  const i = e, r = i.currentScript;
  n.DocumentFragment;
  const s = n.HTMLTemplateElement, o = n.Node, A = n.Element, a = n.NodeFilter;
  n.NamedNodeMap === void 0 && (n.NamedNodeMap || n.MozNamedAttrMap), n.HTMLFormElement;
  const g = n.DOMParser, c = n.trustedTypes, u = A.prototype, h = ge(u, "cloneNode"), p = ge(u, "remove"), m = ge(u, "removeAttributeNode"), l = ge(u, "nextSibling"), I = ge(u, "childNodes"), C = ge(u, "parentNode"), d = ge(u, "shadowRoot"), x = ge(u, "attributes"), w = o && o.prototype ? ge(o.prototype, "nodeType") : null, f = o && o.prototype ? ge(o.prototype, "nodeName") : null, y = o && o.prototype ? ge(o.prototype, "ownerDocument") : null, v = function(b) {
    return w ? w(b) : b.nodeType;
  }, M = function(b) {
    return f ? f(b) : b.nodeName;
  }, S = Qf(u, "namespaceURI"), E = function(b) {
    return S ? S(b) : b.namespaceURI;
  };
  if (typeof s == "function") {
    const U = e.createElement("template");
    U.content && U.content.ownerDocument && (e = U.content.ownerDocument);
  }
  let T, _ = "", L, D = !1, F = 0;
  const z = function() {
    if (F > 0) throw Te('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, k = function(b) {
    z(), F++;
    try {
      return T.createHTML(b);
    } finally {
      F--;
    }
  }, N = function(b) {
    z(), F++;
    try {
      return T.createScriptURL(b);
    } finally {
      F--;
    }
  }, O = function() {
    return D || (L = cd(c, r), D = !0), L;
  }, X = e, Z = X.implementation, W = X.createNodeIterator, st = X.createDocumentFragment, rt = X.getElementsByTagName, at = i.importNode;
  let nt = mA();
  t.isSupported = typeof Ac == "function" && typeof C == "function" && Z && Z.createHTMLDocument !== void 0;
  const pt = qf, At = $f, Q = td, J = ed, Y = nd, mt = id, jt = rd, ae = od;
  let yt = fA, Ct = null;
  const P = It({}, [
    ...uA,
    ...cs,
    ...ls,
    ...us,
    ...IA
  ]);
  let B = null;
  const V = It({}, [
    ...hA,
    ...Is,
    ...CA,
    ...Wi
  ]);
  let H = Object.seal(En(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), it = null, tt = null;
  const gt = Object.seal(En(null, {
    tagCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    }
  }));
  let ot = !0, wt = !0, St = !1, Vt = !0, Ie = !1, be = !0, Ee = !1, Un = !1, an = null, De = null, Xn = !1, se = !1, de = !1, K = !1, $ = !0, ut = !1;
  const ct = "user-content-";
  let ht = !0, bt = !1, Tt = null, Ae = {}, xe = null;
  const He = It({}, [
    "annotation-xml",
    "audio",
    "colgroup",
    "desc",
    "foreignobject",
    "head",
    "iframe",
    "math",
    "mi",
    "mn",
    "mo",
    "ms",
    "mtext",
    "noembed",
    "noframes",
    "noscript",
    "plaintext",
    "script",
    "selectedcontent",
    "style",
    "svg",
    "template",
    "thead",
    "title",
    "video",
    "xmp"
  ]);
  let Ei = null;
  const xi = It({}, [
    "audio",
    "video",
    "img",
    "source",
    "image",
    "track"
  ]);
  let An = null;
  const yo = It({}, [
    "alt",
    "class",
    "for",
    "id",
    "label",
    "name",
    "pattern",
    "placeholder",
    "role",
    "summary",
    "title",
    "value",
    "style",
    "xmlns"
  ]), Mi = "http://www.w3.org/1998/Math/MathML", Si = "http://www.w3.org/2000/svg", pe = "http://www.w3.org/1999/xhtml";
  let gn = pe, vr = !1, wr = null;
  const yc = It({}, [
    Mi,
    Si,
    pe
  ], gs), vo = Pt([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext"
  ]);
  let br = It({}, vo);
  const wo = Pt(["annotation-xml"]);
  let Er = It({}, wo);
  const vc = It({}, [
    "title",
    "style",
    "font",
    "a",
    "script"
  ]);
  let Zn = null;
  const wc = ["application/xhtml+xml", "text/html"], bc = "text/html";
  let xt = null, cn = null;
  const Ec = e.createElement("form"), bo = function(b) {
    return b instanceof RegExp || b instanceof Function;
  }, xr = function() {
    let b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (cn && cn === b) return;
    (!b || typeof b != "object") && (b = {}), b = oe(b), Zn = wc.indexOf(b.PARSER_MEDIA_TYPE) === -1 ? bc : b.PARSER_MEDIA_TYPE, xt = Zn === "application/xhtml+xml" ? gs : Ke, Ct = Ge(b, "ALLOWED_TAGS", P, { transform: xt }), B = Ge(b, "ALLOWED_ATTR", V, { transform: xt }), wr = Ge(b, "ALLOWED_NAMESPACES", yc, { transform: gs }), An = Ge(b, "ADD_URI_SAFE_ATTR", yo, {
      transform: xt,
      base: yo
    }), Ei = Ge(b, "ADD_DATA_URI_TAGS", xi, {
      transform: xt,
      base: xi
    }), xe = Ge(b, "FORBID_CONTENTS", He, { transform: xt }), it = Ge(b, "FORBID_TAGS", oe({}), { transform: xt }), tt = Ge(b, "FORBID_ATTR", oe({}), { transform: xt }), Ae = ee(b, "USE_PROFILES") ? b.USE_PROFILES && typeof b.USE_PROFILES == "object" ? oe(b.USE_PROFILES) : b.USE_PROFILES : !1, ot = b.ALLOW_ARIA_ATTR !== !1, wt = b.ALLOW_DATA_ATTR !== !1, St = b.ALLOW_UNKNOWN_PROTOCOLS || !1, Vt = b.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Ie = b.SAFE_FOR_TEMPLATES || !1, be = b.SAFE_FOR_XML !== !1, Ee = b.WHOLE_DOCUMENT || !1, se = b.RETURN_DOM || !1, de = b.RETURN_DOM_FRAGMENT || !1, K = b.RETURN_TRUSTED_TYPE || !1, Xn = b.FORCE_BODY || !1, $ = b.SANITIZE_DOM !== !1, ut = b.SANITIZE_NAMED_PROPS || !1, ht = b.KEEP_CONTENT !== !1, bt = b.IN_PLACE || !1, yt = Yf(b.ALLOWED_URI_REGEXP) ? b.ALLOWED_URI_REGEXP : fA, gn = typeof b.NAMESPACE == "string" ? b.NAMESPACE : pe, br = Cs(b, "MATHML_TEXT_INTEGRATION_POINTS", () => It({}, vo)), Er = Cs(b, "HTML_INTEGRATION_POINTS", () => It({}, wo));
    const R = Cs(b, "CUSTOM_ELEMENT_HANDLING", () => En(null));
    if (H = En(null), ee(R, "tagNameCheck") && bo(R.tagNameCheck) && (H.tagNameCheck = R.tagNameCheck), ee(R, "attributeNameCheck") && bo(R.attributeNameCheck) && (H.attributeNameCheck = R.attributeNameCheck), ee(R, "allowCustomizedBuiltInElements") && typeof R.allowCustomizedBuiltInElements == "boolean" && (H.allowCustomizedBuiltInElements = R.allowCustomizedBuiltInElements), Ft(H), Ie && (wt = !1), de && (se = !0), Ae && (Ct = It({}, IA), B = En(null), Ae.html === !0 && (It(Ct, uA), It(B, hA)), Ae.svg === !0 && (It(Ct, cs), It(B, Is), It(B, Wi)), Ae.svgFilters === !0 && (It(Ct, ls), It(B, Is), It(B, Wi)), Ae.mathMl === !0 && (It(Ct, us), It(B, CA), It(B, Wi))), gt.tagCheck = null, gt.attributeCheck = null, ee(b, "ADD_TAGS") && (typeof b.ADD_TAGS == "function" ? gt.tagCheck = b.ADD_TAGS : On(b.ADD_TAGS) && (Ct === P && (Ct = oe(Ct)), It(Ct, b.ADD_TAGS, xt))), ee(b, "ADD_ATTR") && (typeof b.ADD_ATTR == "function" ? gt.attributeCheck = b.ADD_ATTR : On(b.ADD_ATTR) && (B === V && (B = oe(B)), It(B, b.ADD_ATTR, xt))), ee(b, "ADD_FORBID_CONTENTS") && On(b.ADD_FORBID_CONTENTS) && (xe === He && (xe = oe(xe)), It(xe, b.ADD_FORBID_CONTENTS, xt)), ht && (Ct["#text"] = !0), Ee && It(Ct, [
      "html",
      "head",
      "body"
    ]), Ct.table && (It(Ct, ["tbody"]), delete it.tbody), b.TRUSTED_TYPES_POLICY) {
      if (typeof b.TRUSTED_TYPES_POLICY.createHTML != "function") throw Te('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof b.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw Te('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const j = T;
      T = b.TRUSTED_TYPES_POLICY;
      try {
        _ = k("");
      } catch (G) {
        throw T = j, G;
      }
    } else b.TRUSTED_TYPES_POLICY === null ? (T = void 0, _ = "") : (T === void 0 && (T = O()), T && typeof _ == "string" && (_ = k("")));
    Pt && Pt(b), cn = b;
  }, Eo = It({}, [
    ...cs,
    ...ls,
    ...Kf
  ]), xo = It({}, [...us, ...Jf]), xc = function(b, R, j) {
    return R.namespaceURI === pe ? b === "svg" : R.namespaceURI === Mi ? b === "svg" && (j === "annotation-xml" || br[j]) : !!Eo[b];
  }, Mc = function(b, R, j) {
    return R.namespaceURI === pe ? b === "math" : R.namespaceURI === Si ? b === "math" && Er[j] : !!xo[b];
  }, Sc = function(b, R, j) {
    return R.namespaceURI === Si && !Er[j] || R.namespaceURI === Mi && !br[j] ? !1 : !xo[b] && (vc[b] || !Eo[b]);
  }, Tc = function(b) {
    const R = E(b), j = Ke(M(b)), G = C(b);
    let q, et;
    return G && v(G) === Mt.element ? (q = { namespaceURI: E(G) }, et = Ke(M(G))) : (q = { namespaceURI: gn }, et = "template"), wr[R] ? R === Si ? xc(j, q, et) : R === Mi ? Mc(j, q, et) : R === pe ? Sc(j, q, et) : !!(Zn === "application/xhtml+xml" && wr[R]) : !1;
  }, Be = function(b) {
    $n(t.removed, { element: b });
    try {
      C(b).removeChild(b);
    } catch {
      if (p(b), !C(b)) throw Te("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, Mo = function(b, R, j) {
    try {
      m(b, R);
    } catch {
      try {
        b.removeAttribute(j);
      } catch {
      }
    }
  }, Mr = function(b) {
    Tr(b);
    const R = I(b);
    R && Se(zf(R), (G) => {
      try {
        p(G);
      } catch {
      }
    });
    const j = v(b) === Mt.element ? x(b) : null;
    if (j) for (let G = j.length - 1; G >= 0; --G) {
      const q = j[G], et = q && q.name;
      typeof et == "string" && Mo(b, q, et);
    }
  }, ln = function(b, R, j) {
    if (!j) try {
      j = R.getAttributeNode(b);
    } catch {
      j = null;
    }
    $n(t.removed, {
      attribute: j || null,
      from: R
    });
    try {
      j ? m(R, j) : R.removeAttribute(b);
    } catch {
      try {
        R.removeAttribute(b);
      } catch {
      }
    }
    if (b === "is")
      if (se || de) try {
        Be(R);
      } catch {
      }
      else try {
        R.setAttribute(b, "");
      } catch {
      }
  }, So = function(b) {
    const R = x(b);
    if (R)
      for (let j = R.length - 1; j >= 0; --j) {
        const G = R[j], q = G && G.name;
        typeof q != "string" || B[xt(q)] || Mo(b, G, q);
      }
  }, Sr = function(b, R) {
    let j = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
    const G = [b];
    for (; G.length > 0; ) {
      const q = G.pop();
      if (R(q) === !1) continue;
      if (j && v(q) === Mt.element) {
        const lt = d(q);
        Ne(lt) && G.push(lt);
      }
      const et = I(q);
      if (et) for (let lt = et.length - 1; lt >= 0; --lt) G.push(et[lt]);
    }
  }, Tr = function(b) {
    Sr(b, (R) => {
      v(R) === Mt.element && So(R);
    });
  }, _r = function(b) {
    const R = [];
    return Sr(b, (j) => {
      R.push(j);
    }, !0), R;
  }, _c = function(b, R) {
    const j = as();
    Se(_r(b), (G) => {
      v(G) === Mt.element && As(j, G);
    }), Se(R, (G) => {
      v(G) === Mt.element && !ti(j, G) && So(G);
    });
  }, To = function(b, R) {
    let j = !1;
    return Se(t.removed, (G) => {
      G.element && (j = j || G.element === b, Tr(G.element));
    }), _c(b, R), j;
  }, kc = 8, Rc = function(b, R) {
    const j = Tt;
    let G = null;
    const q = () => (G || (G = as(), Se(R, (et) => {
      As(G, et);
    })), G);
    for (let et = 0; ; et++) {
      const lt = _r(b), _t = [b];
      let me = !1;
      if (Se(lt, (Ht) => {
        v(Ht) === Mt.documentFragment ? $n(_t, Ht) : !me && !ti(j, Ht) && (me = ti(q(), Ht));
      }), !me) return;
      if (et >= kc) throw Te("the tree kept changing during in-place sanitization; refusing to return it");
      Se(_t, (Ht, $t) => {
        Pc(Ht, $t > 0, b, q());
      });
    }
  }, Pc = function(b, R, j, G) {
    const q = kr(b);
    let et;
    for (; et = q.nextNode(); )
      !ti(G, et) || ti(Tt, et) || (R && he(nt.uponSanitizeShadowNode, et, null), Pr(et, j), Or(et, j), Ne(et.content) && Vn(et.content));
  }, Oc = function(b) {
    Tt && As(Tt, b);
  }, _o = function(b, R) {
    return be ? b === "patchsrc" ? !0 : b === "for" && R !== "label" && R !== "output" : !1;
  }, Lc = function(b) {
    be && Sr(b, (R) => {
      const j = v(R);
      if (j === Mt.processingInstruction || j === Mt.comment && Lt(dA, R.data)) {
        try {
          p(R);
        } catch {
        }
        return !1;
      }
      if (j === Mt.element) {
        const G = R, q = xt(M(R));
        try {
          G.hasAttribute && G.hasAttribute("patchsrc") && G.removeAttribute("patchsrc"), G.hasAttribute && G.hasAttribute("for") && _o("for", q) && G.removeAttribute("for");
        } catch {
        }
      }
      return !0;
    });
  }, ko = function(b) {
    let R = null, j = null;
    if (Xn) b = "<remove></remove>" + b;
    else {
      const et = AA(b, /^[\r\n\t ]+/);
      j = et && et[0];
    }
    Zn === "application/xhtml+xml" && gn === pe && (b = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + b + "</body></html>");
    const G = T ? k(b) : b;
    if (gn === pe) try {
      R = new g().parseFromString(G, Zn);
    } catch {
    }
    if (!R || !R.documentElement) {
      R = Z.createDocument(gn, "template", null);
      try {
        R.documentElement.innerHTML = vr ? _ : G;
      } catch {
      }
    }
    const q = R.body || R.documentElement;
    return b && j && q.insertBefore(e.createTextNode(j), q.childNodes[0] || null), gn === pe ? rt.call(R, Ee ? "html" : "body")[0] : Ee ? R.documentElement : q;
  }, kr = function(b) {
    const R = y ? y(b) : b.ownerDocument;
    return W.call(R || b, b, a.SHOW_ELEMENT | a.SHOW_COMMENT | a.SHOW_TEXT | a.SHOW_PROCESSING_INSTRUCTION | a.SHOW_CDATA_SECTION, null);
  }, Ti = function(b) {
    return b = ei(b, pt, " "), b = ei(b, At, " "), b = ei(b, Q, " "), b;
  }, Rr = function(b) {
    var R;
    Ro(b);
    const j = (R = b.querySelectorAll) === null || R === void 0 ? void 0 : R.call(b, "template");
    j && Se(j, (G) => {
      Ne(G.content) && Rr(G.content);
    });
  }, Ro = function(b) {
    b.normalize();
    const R = y ? y(b) : b.ownerDocument, j = W.call(R || b, b, a.SHOW_TEXT | a.SHOW_COMMENT | a.SHOW_CDATA_SECTION | a.SHOW_PROCESSING_INSTRUCTION, null);
    let G = j.nextNode();
    for (; G; )
      G.data = Ti(G.data), G = j.nextNode();
  }, _i = function(b) {
    const R = f ? f(b) : null;
    return typeof R != "string" || xt(R) !== "form" ? !1 : typeof b.nodeName != "string" || typeof b.textContent != "string" || typeof b.removeChild != "function" || b.attributes !== x(b) || typeof b.removeAttribute != "function" || typeof b.removeAttributeNode != "function" || typeof b.getAttributeNode != "function" || typeof b.setAttribute != "function" || typeof b.namespaceURI != "string" || typeof b.insertBefore != "function" || typeof b.hasChildNodes != "function" || b.nodeType !== w(b) || b.childNodes !== I(b);
  }, Ne = function(b) {
    if (!w || typeof b != "object" || b === null) return !1;
    try {
      return w(b) === Mt.documentFragment;
    } catch {
      return !1;
    }
  }, Wn = function(b) {
    if (!w || typeof b != "object" || b === null) return !1;
    try {
      return typeof w(b) == "number";
    } catch {
      return !1;
    }
  };
  function he(U, b, R) {
    U.length !== 0 && Se(U, (j) => {
      j.call(t, b, R, cn);
    });
  }
  const Dc = function(b, R) {
    return !!(be && b.hasChildNodes() && !Wn(b.firstElementChild) && Lt(hs, b.textContent) && Lt(hs, b.innerHTML) || be && Ad[R] && v(b) === Mt.element && E(b) === pe && (Wn(b.firstElementChild) || typeof b.textContent == "string" && Lt(hs, b.textContent)) || b.nodeType === Mt.processingInstruction || be && b.nodeType === Mt.comment && Lt(dA, b.data));
  }, ki = function(b, R) {
    if (b instanceof RegExp) return Lt(b, R);
    if (b instanceof Function) {
      for (var j = arguments.length, G = new Array(j > 2 ? j - 2 : 0), q = 2; q < j; q++) G[q - 2] = arguments[q];
      return !!b(R, ...G);
    }
    return !1;
  }, Bc = function(b, R, j) {
    if (!it[R] && Lo(R) && ki(H.tagNameCheck, R)) return !1;
    if (ht && !xe[R] && !xe[Ke(R)]) {
      const G = C(b), q = I(b);
      if (q && G) {
        const et = q.length;
        for (let lt = et - 1; lt >= 0; --lt) {
          const _t = b === j ? h(q[lt], !0) : q[lt];
          G.insertBefore(_t, l(b));
        }
      }
    }
    return Be(b), !0;
  }, Po = function(b, R, j, G) {
    return b.length === 0 ? R : R === j || R === G ? oe(R) : R;
  }, un = function(b, R) {
    return b === R || C(b) !== null ? !1 : (bt && Tr(b), !0);
  }, Pr = function(b, R) {
    if (Oc(b), he(nt.beforeSanitizeElements, b, null), un(b, R)) return !0;
    if (_i(b))
      return Be(b), !0;
    const j = xt(M(b));
    if (Ct = Po(nt.uponSanitizeElement, Ct, P, an), he(nt.uponSanitizeElement, b, {
      tagName: j,
      allowedTags: Ct
    }), un(b, R)) return !0;
    if (Dc(b, j))
      return Be(b), !0;
    if (it[j] || !(gt.tagCheck instanceof Function && gt.tagCheck(j)) && !Ct[j]) {
      const G = Bc(b, j, R);
      return G === !1 && (he(nt.afterSanitizeElements, b, null), un(b, R)) ? !0 : G;
    }
    if (v(b) === Mt.element && !Tc(b) || (j === "noscript" || j === "noembed" || j === "noframes") && Lt(ad, b.innerHTML))
      return Be(b), !0;
    if (Ie && b.nodeType === Mt.text) {
      const G = Ti(b.textContent);
      b.textContent !== G && ($n(t.removed, { element: b.cloneNode() }), b.textContent = G);
    }
    return he(nt.afterSanitizeElements, b, null), un(b, R);
  }, Oo = function(b, R, j) {
    if (tt[R] || _o(R, b) || $ && (R === "id" || R === "name") && (j in e || j in Ec)) return !1;
    const G = B[R] || gt.attributeCheck instanceof Function && gt.attributeCheck(R, b);
    return wt && Lt(J, R) || ot && Lt(Y, R) ? !0 : G ? An[R] || Lt(yt, ei(j, jt, "")) || (R === "src" || R === "xlink:href" || R === "href") && b !== "script" && gA(j, "data:") === 0 && Ei[b] || St && !Lt(mt, ei(j, jt, "")) ? !0 : !j : Lo(b) && ki(H.tagNameCheck, b) && ki(H.attributeNameCheck, R, b) || R === "is" && H.allowCustomizedBuiltInElements && ki(H.tagNameCheck, j);
  }, Nc = It({}, [
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "missing-glyph"
  ]), Lo = function(b) {
    return !Nc[Ke(b)] && Lt(ae, b);
  }, Fc = function(b, R, j, G) {
    if (T && typeof c == "object" && typeof c.getAttributeType == "function" && !j) switch (c.getAttributeType(b, R)) {
      case "TrustedHTML":
        return k(G);
      case "TrustedScriptURL":
        return N(G);
    }
    return G;
  }, jc = function(b, R, j, G) {
    try {
      return j ? b.setAttributeNS(j, R, G) : b.setAttribute(R, G), _i(b) ? (Be(b), !1) : !0;
    } catch {
      return ln(R, b), !1;
    }
  }, Do = function(b, R) {
    return be && Lt(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, R) ? !0 : Ke(b) === "attributename" && AA(R, "href") !== null;
  }, Or = function(b, R) {
    if (he(nt.beforeSanitizeAttributes, b, null), un(b, R)) return;
    const j = b.attributes;
    if (!j || _i(b)) return;
    B = Po(nt.uponSanitizeAttribute, B, V, De);
    const G = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: B,
      forceKeepAttr: void 0
    };
    let q = j.length;
    const et = xt(b.nodeName);
    for (; q--; ) {
      const lt = j[q], _t = lt.name, me = lt.namespaceURI, Ht = lt.value, $t = xt(_t), In = Ht;
      let te = _t === "value" ? In : Xf(In), Bo = !1;
      if (G.attrName = $t, G.attrValue = te, G.keepAttr = !0, G.forceKeepAttr = void 0, he(nt.uponSanitizeAttribute, b, G), te = G.attrValue, ut && ($t === "id" || $t === "name") && gA(te, ct) !== 0 && (ln(_t, b, lt), te = ct + te, Bo = !0), Do(_t, te)) {
        ln(_t, b, lt);
        continue;
      }
      if (!G.forceKeepAttr) {
        if (!G.keepAttr) {
          ln(_t, b, lt);
          continue;
        }
        if (!Vt && Lt(pA, te)) {
          ln(_t, b, lt);
          continue;
        }
        if (Ie && (te = Ti(te)), !Oo(et, $t, te)) {
          ln(_t, b, lt);
          continue;
        }
        te = Fc(et, $t, me, te), te !== In && jc(b, _t, me, te) && Bo && aA(t.removed);
      }
    }
    he(nt.afterSanitizeAttributes, b, null), un(b, R);
  }, Vn = function(b) {
    let R = null;
    const j = kr(b);
    for (he(nt.beforeSanitizeShadowDOM, b, null); R = j.nextNode(); )
      if (he(nt.uponSanitizeShadowNode, R, null), Pr(R, b), Or(R, b), Ne(R.content) && Vn(R.content), v(R) === Mt.element) {
        const G = d(R);
        Ne(G) && (Lr(G), Vn(G));
      }
    Ie && Ro(b), he(nt.afterSanitizeShadowDOM, b, null);
  }, Lr = function(b) {
    const R = [{
      node: b,
      shadow: null
    }];
    for (; R.length > 0; ) {
      const j = R.pop();
      if (j.shadow) {
        Vn(j.shadow);
        continue;
      }
      const G = j.node, q = v(G) === Mt.element, et = I(G);
      if (et) for (let lt = et.length - 1; lt >= 0; --lt) R.push({
        node: et[lt],
        shadow: null
      });
      if (q) {
        const lt = f ? f(G) : null;
        if (typeof lt == "string" && xt(lt) === "template") {
          const _t = G.content;
          Ne(_t) && R.push({
            node: _t,
            shadow: null
          });
        }
      }
      if (q) {
        const lt = d(G);
        Ne(lt) && R.push({
          node: null,
          shadow: lt
        }, {
          node: lt,
          shadow: null
        });
      }
    }
  };
  return t.sanitize = function(U) {
    let b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, R = null, j = null, G = null, q = null;
    if (vr = !U, vr && (U = "<!-->"), typeof U != "string" && !Wn(U) && (U = Hf(U), typeof U != "string"))
      throw Te("dirty is not a string, aborting");
    if (!t.isSupported) return U;
    Un ? (Ct = an, B = De) : xr(b), (nt.uponSanitizeElement.length > 0 || nt.uponSanitizeAttribute.length > 0) && (Ct = oe(Ct)), nt.uponSanitizeAttribute.length > 0 && (B = oe(B)), t.removed = [];
    const et = bt && typeof U != "string" && Wn(U);
    let lt = [];
    const _t = Tt;
    if (et) {
      Lc(U);
      const $t = M(U);
      if (typeof $t == "string") {
        const In = xt($t);
        if (!Ct[In] || it[In])
          throw Mr(U), Te("root node is forbidden and cannot be sanitized in-place");
      }
      if (_i(U))
        throw Mr(U), Te("root node is clobbered and cannot be sanitized in-place");
      lt = _r(U), Tt = as();
    } else if (Wn(U))
      R = ko("<!---->"), j = R.ownerDocument.importNode(U, !0), j.nodeType === Mt.element && j.nodeName === "BODY" || j.nodeName === "HTML" ? R = j : R.appendChild(j), Lr(R);
    else {
      if (!se && !Ie && !Ee && U.indexOf("<") === -1) return T && K ? k(U) : U;
      if (R = ko(U), !R) return se ? null : K ? _ : "";
    }
    R && Xn && Be(R.firstChild);
    const me = et ? U : R;
    try {
      et && Lr(U);
      const $t = kr(me);
      for (; G = $t.nextNode(); )
        Pr(G, me), Or(G, me), Ne(G.content) && Vn(G.content);
      et && Rc(U, lt);
    } catch ($t) {
      throw et && (Mr(U), To(U, lt)), $t;
    } finally {
      Tt = _t;
    }
    if (et) {
      if (To(U, lt)) throw Te("a node selected for removal could not be safely returned; refusing to sanitize in place");
      return Ie && Rr(U), U;
    }
    if (se) {
      if (Ie && Rr(R), de)
        for (q = st.call(R.ownerDocument); R.firstChild; ) q.appendChild(R.firstChild);
      else q = R;
      return (B.shadowroot || B.shadowrootmode) && (q = at.call(i, q, !0)), q;
    }
    let Ht = Ee ? R.outerHTML : R.innerHTML;
    return Ee && Ct["!doctype"] && R.ownerDocument && R.ownerDocument.doctype && R.ownerDocument.doctype.name && Lt(sd, R.ownerDocument.doctype.name) && (Ht = "<!DOCTYPE " + R.ownerDocument.doctype.name + `>
` + Ht), Ie && (Ht = Ti(Ht)), T && K ? k(Ht) : Ht;
  }, t.setConfig = function() {
    let U = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    xr(U), Un = !0, an = Ct, De = B;
  }, t.clearConfig = function() {
    cn = null, Un = !1, an = null, De = null, T = L, _ = "";
  }, t.isValidAttribute = function(U, b, R) {
    cn || xr({});
    const j = xt(U), G = xt(b);
    return typeof R == "string" && (Do(b, R) || !Vt && Lt(pA, R)) ? !1 : Oo(j, G, R);
  }, t.addHook = function(U, b) {
    typeof b == "function" && ee(nt, U) && $n(nt[U], b);
  }, t.removeHook = function(U, b) {
    if (ee(nt, U)) {
      if (b !== void 0) {
        const R = Gf(nt[U], b);
        return R === -1 ? void 0 : Uf(nt[U], R, 1)[0];
      }
      return aA(nt[U]);
    }
  }, t.removeHooks = function(U) {
    ee(nt, U) && (nt[U] = []);
  }, t.removeAllHooks = function() {
    nt = mA();
  }, t;
}
var hc = Ic();
const ld = ["b", "strong", "i", "em", "u", "s", "br", "p", "span", "div", "ul", "ol", "li", "a", "img", "small", "sub", "sup", "code", "pre", "table", "thead", "tbody", "tr", "th", "td", "qy-swiper", "qy-swiper-slide"], ud = ["href", "src", "alt", "title", "class", "target", "rel", "width", "height"], Id = { values: ["target", "rel", "width", "height"] }, hd = ["script", "style", "iframe", "object", "embed", "form", "input", "textarea", "link", "meta", "base"], Cd = ["srcdoc", "style", "formaction", "xlink:href"], fd = { valueAttributes: ["image-url", "image-type", "thumbnail-url", "caption", "material-url", "camera-position", "camera-target", "show-texture"], booleanAttributes: ["fit-to-container", "debug-mode"], urlAttributes: ["image-url", "thumbnail-url", "material-url"], textAttributes: { values: ["caption"] }, imageTypes: { values: ["image", "panorama", "youtube", "video", "3dmodel", "gaussian"] }, numberListAttributes: ["camera-position", "camera-target"], trueFalseAttributes: ["show-texture"] }, dd = { booleanAttributes: ["has-thumb", "autoplay"] }, pd = { tags: ["a", "b", "br", "i", "p", "small", "span", "sub", "sup"], attributes: ["href"], forbidContents: { tags: ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "selectedcontent", "style", "svg", "template", "title", "video", "xmp"] } }, Wt = {
  tags: ld,
  attributes: ud,
  uriSafeAttributes: Id,
  forbidTags: hd,
  forbidAttributes: Cd,
  slide: fd,
  swiper: dd,
  iiif: pd
}, md = Wt.tags, yd = Wt.attributes, vd = /^(?:https?|mailto|tel|data):/i, wd = Wt.uriSafeAttributes.values, bd = Wt.forbidTags, Ed = Wt.forbidAttributes, xd = Wt.iiif.tags, Md = Wt.iiif.attributes, Sd = /^https?:/i, Td = Wt.iiif.forbidContents.tags;
let qi;
const _d = /^data:image\/(png|jpeg|gif|webp|avif);/i, yA = (n) => !!n && /^\s*data:/i.test(n);
function kd(n) {
  if (n.tagName === "A" && n.hasAttribute("target") && n.setAttribute("rel", "noopener noreferrer"), qi === "iiif" && n.tagName === "A" && n.hasAttribute("href") && (n.setAttribute("target", "_blank"), n.setAttribute("rel", "noopener noreferrer")), n.tagName === "IMG") {
    const e = n.getAttribute("src");
    yA(e) && !_d.test(e.trim()) && n.removeAttribute("src"), n.hasAttribute("srcset") && n.removeAttribute("srcset");
  } else
    for (const e of ["src", "href", "xlink:href"])
      yA(n.getAttribute(e)) && n.removeAttribute(e);
}
let wn;
function Rd() {
  if (wn) return wn;
  const n = globalThis.window;
  if (!n)
    throw new Error(
      "sanitizeHtml: window の無い環境では使用できません（DOMPurify の初期化に必要）"
    );
  return wn = hc(n), wn.addHook("afterSanitizeAttributes", kd), wn.addHook("uponSanitizeAttribute", Od), wn;
}
let Vi;
function Pd() {
  if (Vi) return Vi;
  const n = globalThis.window;
  if (!n)
    throw new Error(
      "sanitizeHtml: window の無い環境では使用できません（DOMPurify の初期化に必要）"
    );
  return Vi = hc(n), Vi;
}
function Od(n, t) {
  const e = n.nodeName.toLowerCase(), i = t.attrName;
  if (e === "qy-swiper-slide") {
    const r = po.has(i) ? "" : fc(i, t.attrValue);
    if (r === null) {
      t.keepAttr = !1;
      return;
    }
    n.setAttribute(i, r), t.forceKeepAttr = !0;
    return;
  }
  e === "qy-swiper" && (Fd.has(i) ? (n.setAttribute(i, ""), t.forceKeepAttr = !0) : t.keepAttr = !1);
}
function Cc(n, t) {
  if (n == null) return "";
  const e = t?.profile === "iiif", i = qi;
  qi = e ? "iiif" : void 0;
  try {
    return Rd().sanitize(String(n), {
      ALLOWED_TAGS: e ? xd : md,
      ALLOWED_ATTR: e ? Md : yd,
      ALLOWED_URI_REGEXP: e ? Sd : vd,
      ADD_URI_SAFE_ATTR: wd,
      FORBID_TAGS: bd,
      FORBID_ATTR: Ed,
      ALLOW_DATA_ATTR: !1,
      // aria-* も許可表の外に出さない（IIIF の値で残す属性は href だけ）
      ALLOW_ARIA_ATTR: !e,
      // 禁止タグを落としても中身のテキストは残す（実データの可読性を保つ）
      KEEP_CONTENT: !0,
      // profile: "iiif" のときだけ、文字も捨てる要素の一覧を差し替える
      ...e ? { FORBID_CONTENTS: Td } : {}
    });
  } finally {
    qi = i;
  }
}
function Ld(n) {
  return n == null ? "" : String(n).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
const Dd = 5;
function Bd(n) {
  if (n == null) return "";
  const t = globalThis.window.document;
  let e = String(n);
  for (let i = 0; i < Dd; i++) {
    const r = Pd().sanitize(e, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: !0
    }), s = t.createElement("div");
    s.innerHTML = r;
    const o = s.textContent || "";
    if (o === e) return o;
    e = o;
  }
  return "";
}
const Nd = new Set(Wt.slide.valueAttributes), po = new Set(Wt.slide.booleanAttributes), Fd = new Set(Wt.swiper.booleanAttributes), jd = new Set(Wt.slide.textAttributes.values), Gd = new Set(Wt.slide.imageTypes.values), zd = new Set(Wt.slide.numberListAttributes), Ud = new Set(Wt.slide.trueFalseAttributes), vA = "[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][-+]?\\d+)?", Xd = new RegExp(`^${vA}(?:[ \\t]*,[ \\t]*${vA})*$`), Zd = new Set(Wt.slide.urlAttributes), Wd = (n) => /^(?:https?:)?\/\/|^\/|^[^:]*$/i.test(n.trim()), Vd = /["'`<>\s]/;
function fc(n, t) {
  if (po.has(n)) return t ? "" : null;
  if (!Nd.has(n) || t == null) return null;
  let e = String(t);
  return Zd.has(n) && (!Wd(e) || Vd.test(e)) || (jd.has(n) && (e = Bd(e)), n === "image-type" && !Gd.has(e)) || zd.has(n) && (e = e.trim(), !Xd.test(e)) || Ud.has(n) && e !== "true" && e !== "false" ? null : e;
}
function wp(n) {
  const t = [];
  for (const [e, i] of Object.entries(n || {})) {
    const r = String(e).toLowerCase(), s = fc(r, i);
    s !== null && t.push(po.has(r) ? r : `${r}="${Ld(s)}"`);
  }
  return t.join(" ");
}
const Hd = "attributionChanged", Qd = 125, wA = "Google Maps";
function cr(n) {
  return typeof n.googleMapType == "string" && n.googleMapType !== "";
}
function bA(n) {
  for (const t of n) {
    const e = t.googleMapType;
    if (!(typeof e != "string" || !e))
      return e === "satellite" ? "dark" : "light";
  }
}
function EA(n) {
  return n > 0 && n < Qd ? "text" : "logo";
}
function dc(n, t) {
  if (n == null) return;
  if (typeof n == "string") return n.trim() ? n : void 0;
  if (typeof n != "object") return String(n);
  let e, i;
  for (const [r, s] of Object.entries(n))
    if (!(typeof s != "string" || !s.trim())) {
      if (r === t) return s;
      r === "en" && i === void 0 && (i = s), e === void 0 && (e = s);
    }
  return i ?? e;
}
function fs(n) {
  const t = n.toLowerCase();
  return t === "zh-hk" || t === "zh-hant" ? "zh-TW" : n;
}
function mo(n, t) {
  let e = n;
  for (; e; ) {
    const i = e.closest(t);
    if (i) return i;
    const r = e.getRootNode?.();
    e = r && "host" in r ? r.host : null;
  }
  return null;
}
function Yd(n) {
  return mo(n, '[lang]:not([lang=""])')?.getAttribute("lang") || void 0;
}
function Kd(n, t, e) {
  const i = mo(n, Qi);
  if (i) {
    let s;
    try {
      s = i.currentLang;
    } catch {
      s = void 0;
    }
    if (typeof s == "string" && s) return fs(s);
  }
  const r = [
    n?.getAttribute("lang"),
    i?.getAttribute("lang"),
    t,
    e,
    Yd(n)
  ];
  for (const s of r)
    if (typeof s == "string" && s) return fs(s);
  return fs(Rf() || "en");
}
function Jd(n) {
  const t = [], e = (i) => {
    !i || t.includes(i) || typeof i.isWmts == "function" && !i.isWmts() || t.push(i);
  };
  return e(n.front), e(n.overlay), e(n.back), t;
}
function qd(n) {
  if (cr(n)) return "google";
  if (typeof n.getTileJSON == "function") return "tilejson";
}
function $d(n) {
  const t = n.getTileJSON;
  if (typeof t != "function") return;
  let e;
  try {
    e = t.call(n)?.attribution;
  } catch {
    return;
  }
  return typeof e == "string" && e.trim() ? e.trim() : void 0;
}
function tp(n) {
  const t = typeof n.get == "function" ? n.get("attr") : void 0;
  return dc(t, "en") !== void 0;
}
function ep(n) {
  return (Array.isArray(n) ? n : [n]).filter((e) => typeof e == "string" && e.trim() !== "").map((e) => e.trim());
}
const ds = 2;
function np(n) {
  const t = document.createElement("template");
  return t.innerHTML = n, t.content;
}
function pc(n) {
  return (np(n).textContent ?? "").replace(/\s+/g, " ").trim();
}
function Zs(n) {
  return n.map((t) => Cc(t, { profile: "iiif" }).trim()).filter((t) => t !== "");
}
function mc(n, t) {
  const e = typeof n.get == "function" ? n.get("attr") : void 0, i = dc(e, t)?.trim();
  if (!i) return [];
  const r = Cc(i);
  return [{ text: i, html: r, key: pc(r) || r }];
}
function Ws(n, t) {
  const e = [];
  for (const i of t?.get(n) ?? []) {
    const [r] = Zs([i.trim()]);
    r && e.push({ text: i.trim(), html: r, key: pc(r) || r });
  }
  return e;
}
function Vs(n, t, e) {
  const i = mc(n, t);
  return cr(n) ? [...Ws(n, e), ...i] : i.length > 0 ? i : Ws(n, e);
}
function $i(n, t) {
  const e = [];
  for (const i of n)
    for (const r of i)
      t.has(r.key) || (t.add(r.key), e.push(r));
  return e;
}
function ip(n, t, e, i = []) {
  const r = n.filter((c) => !i.includes(c)), s = n.filter((c) => i.includes(c)), o = /* @__PURE__ */ new Set(), A = $i(
    r.filter(cr).map((c) => Ws(c, e)),
    o
  ), a = $i(
    r.map((c) => cr(c) ? mc(c, t) : Vs(c, t, e)),
    o
  ), g = $i(
    s.map((c) => Vs(c, t, e)),
    o
  );
  return { google: A, base: a, overlay: g };
}
function rp(n, t, e) {
  return $i(
    n.map((i) => Vs(i, t, e)),
    /* @__PURE__ */ new Set()
  ).map((i) => i.text);
}
const xA = "maplat-attribution-style", sp = `
.maplat-attribution {
  position: absolute;
  right: var(--maplat-attribution-right, 0px);
  bottom: var(--maplat-attribution-bottom, 0px);
  max-width: var(--maplat-attribution-max-width, 100%);
  box-sizing: border-box;
  margin: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.maplat-attribution[hidden] { display: none; }
.maplat-attribution-google {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: flex-end;
  max-width: 100%;
}
.maplat-attribution-stacked {
  margin-bottom: 4px;
  border-radius: 4px;
}
.maplat-attribution-google-logo {
  display: block;
  flex: 0 0 auto;
  width: 105px;
  height: 22px;
  margin: 10px 10px 5px 10px;
  line-height: 0;
}
.maplat-attribution-google-logo svg {
  display: block;
  width: 105px;
  height: 22px;
}
.maplat-attribution-text {
  display: block;
  min-width: 0;
  padding: 1px 5px;
  font-size: 11px;
  line-height: 1.4;
  color: #333;
  background-color: rgba(255, 255, 255, .8);
  border-top-left-radius: 4px;
  text-align: right;
  white-space: normal;
  overflow-wrap: anywhere;
}
.maplat-attribution-sep { color: #777; }
.maplat-attribution-clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${ds};
  line-clamp: ${ds};
  max-width: 100%;
  /* 行の高さ × 行数 ＋ 上下の余白（.maplat-attribution-text の padding 1px ずつ）。幅も余白込みで地図の箱まで */
  box-sizing: border-box;
  max-height: calc(${ds} * 1.4em + 2px);
  overflow: hidden;
}
.maplat-attribution-clamp img {
  max-width: 100%;
  max-height: 1.4em;
  object-fit: contain;
  vertical-align: bottom;
}
.maplat-attribution-clamp :is(p, div, pre, code, ul, ol, li, table, thead, tbody, tr, th, td) {
  display: inline;
  margin: 0;
  padding: 0;
  white-space: normal;
  font: inherit;
}
.maplat-attribution-clamp :is(p, div, pre, li, tr, td, th)::after { content: " "; }
.maplat-attribution-item p { margin: 0; }
.maplat-attribution a { pointer-events: auto; color: #0645ad; }
:where(maplat-ui > maplat-app) {
  --maplat-attribution-ui-inset: .5em;
  --maplat-attribution-ui-bottom-offset: 65px;
  --maplat-attribution-ui-button-width: 3.09375em;
  --maplat-attribution-ui-gap: var(--maplat-ui-control-gap, 7px);
  --maplat-attribution-bottom: calc(var(--maplat-attribution-ui-bottom-offset) + var(--maplat-attribution-ui-inset) + env(safe-area-inset-bottom, 0px));
  --maplat-attribution-right: calc(var(--maplat-attribution-ui-inset) + var(--maplat-attribution-ui-button-width) + var(--maplat-attribution-ui-gap) + env(safe-area-inset-right, 0px));
  --maplat-attribution-max-width: calc(100% - 2 * (var(--maplat-attribution-ui-inset) + var(--maplat-attribution-ui-button-width) + var(--maplat-attribution-ui-gap)));
}
:where(maplat-ui > maplat-app) .maplat-attribution-text { border-radius: 4px; }
`;
function op(n) {
  if (n.getElementById(xA)) return;
  const t = n.createElement("style");
  t.id = xA, t.textContent = sp, (n.head || n.documentElement).appendChild(t);
}
class ap {
  element;
  #e;
  #r;
  #t = [];
  // #sources のうち重ね地図のもの（別の箱に出す）
  #s = [];
  // 地図の設定の attr が無い source（と Google の地図）の、提供元の申告として読んだ出典（元の値）。
  // 読むのは providerAttributionKind が決まる source だけ（ライブラリの既定値は読まない）。
  // 外の値なので、描くときに狭い許可表で洗う（sanitizeSourceAttributions）
  #i = /* @__PURE__ */ new Map();
  // 最後に知らせた providerAttributions（比べる形）。変わったときだけ ATTRIBUTION_CHANGED_EVENT を出す
  #a = "[]";
  #n = null;
  #A = null;
  #o = !1;
  constructor(t, e) {
    this.#e = t, this.#r = e;
    const i = t.ownerDocument;
    op(i);
    const r = i.createElement("div");
    r.className = "maplat-attribution", r.hidden = !0, this.element = r, t.appendChild(r), this.#f(), this.#C(), this.#h();
  }
  /** 今出している Google Maps の表示（ロゴか文字）。Google の地図が無ければ undefined（試験と診断用）。 */
  get googleAttribution() {
    const t = this.element.dataset.googleMaps;
    return t === "logo" || t === "text" ? t : void 0;
  }
  /**
   * 表示中の source ごとの、提供元の申告（OpenLayers の source から読んだ出典を、狭い許可表で洗った HTML）。
   * 地図の右下に出すのと同じ表から作る。申告の無い source・mapID の無い source は載せない。
   * 地図の定義の attr は載せない（getMapMeta で取れる）。並びは表示の順（前面 → 重ね地図 → 背面）。
   */
  get providerAttributions() {
    const t = [];
    for (const e of this.#t) {
      const { mapID: i } = e;
      if (typeof i != "string" || !i) continue;
      const r = Zs(this.#i.get(e) ?? []);
      r.length > 0 && t.push({ mapID: i, attributions: r });
    }
    return t;
  }
  /** 今の言語で出典の文字列を返す（試験と診断用）。 */
  get texts() {
    return rp(this.#t, this.#r(), this.#i);
  }
  /**
   * 表示する source を差し替えて描き直す。overlays は sources のうち重ね地図のもの（背景地図と別の箱に出す）。
   */
  update(t, e = []) {
    if (!this.#o) {
      this.#t = t.slice(), this.#s = e.filter((i) => this.#t.includes(i));
      for (const i of [...this.#i.keys()])
        this.#t.includes(i) || this.#i.delete(i);
      this.render(), this.#g();
    }
  }
  /**
   * providerAttributions の値が前に知らせたときから変わっていれば、地図の入れ物から ATTRIBUTION_CHANGED_EVENT を出す。
   */
  #g() {
    if (this.#o || typeof CustomEvent > "u") return;
    const t = JSON.stringify(this.providerAttributions);
    t !== this.#a && (this.#a = t, this.#e.dispatchEvent(
      new CustomEvent(Hd, { bubbles: !0, composed: !1, cancelable: !1 })
    ));
  }
  /**
   * 地図の設定の attr が無い source の、提供元の申告の出典を、OpenLayers の source（getAttributions）から読む。
   * 提供元の申告でない source（providerAttributionKind が undefined）は読まない（ライブラリの既定値で埋めない）。
   * 地図の描画（postrender）のたびに、その地図が描いている source と frameState を渡す。
   * Google の source は表示範囲が変わったときだけ取りに行き、それ以外は前の値を返す（OpenLayers の実装）。
   */
  refreshDynamic(t, e) {
    if (!this.#o)
      for (const i of t) {
        if (!i || !this.#t.includes(i)) continue;
        const r = qd(i);
        if (!r || tp(i) && r !== "google") continue;
        const s = typeof i.getAttributions == "function" ? i.getAttributions() : void 0;
        if (typeof s != "function") continue;
        let o;
        try {
          o = s(e);
        } catch {
          continue;
        }
        Promise.resolve(o).then(
          (A) => {
            let a = ep(A);
            if (r === "tilejson") {
              const g = $d(i);
              a = a.filter((c) => c === g);
            }
            this.#u(i, a);
          },
          () => {
          }
          // 取りに行けなかったときは前の値のまま
        );
      }
  }
  #u(t, e) {
    if (this.#o || !this.#t.includes(t) || Zs(e).length === 0) return;
    const i = this.#i.get(t);
    i && i.length === e.length && i.every((r, s) => r === e[s]) || (this.#i.set(t, e), this.render(), this.#g());
  }
  /** 今の source と言語で描き直す。 */
  render() {
    if (this.#o) return;
    const t = this.element;
    t.parentNode !== this.#e && this.#e.appendChild(t);
    const e = t.ownerDocument, i = bA(this.#t), r = i ? EA(this.#l()) : void 0, { google: s, base: o, overlay: A } = ip(
      this.#t,
      this.#r(),
      this.#i,
      this.#s
    ), a = [];
    for (const [g, c] of [
      [A, "overlay"],
      [o, "base"]
    ]) {
      const u = this.#c(g);
      u && (u.classList.add("maplat-attribution-clamp", `maplat-attribution-${c}`), a.push(u));
    }
    if (i) {
      const g = e.createElement("span");
      g.className = "maplat-attribution-google", r === "logo" && g.appendChild(this.#I(i));
      const c = this.#c(s, r === "text");
      c && g.appendChild(c), a.push(g);
    }
    a.slice(0, -1).forEach((g) => g.classList.add("maplat-attribution-stacked")), t.replaceChildren(...a), r ? t.dataset.googleMaps = r : delete t.dataset.googleMaps, t.hidden = a.length === 0;
  }
  /** Google Maps のロゴ（公式の SVG。読み上げは "Google Maps"）。 */
  #I(t) {
    const i = this.element.ownerDocument.createElement("span");
    return i.className = "maplat-attribution-google-logo", i.dataset.variant = t, i.setAttribute("role", "img"), i.setAttribute("aria-label", wA), i.innerHTML = t === "dark" ? Of : Pf, i.firstElementChild?.setAttribute("aria-hidden", "true"), i.firstElementChild?.setAttribute("focusable", "false"), i;
  }
  /**
   * 出典を " | " で区切って並べた箱（出すものが無ければ null）。
   * googleText が true なら、先頭に文字 "Google Maps"（ロゴの代わり）を入れる。
   */
  #c(t, e = !1) {
    if (t.length === 0 && !e) return null;
    const i = this.element.ownerDocument, r = i.createElement("span");
    r.className = "maplat-attribution-text";
    const s = [];
    if (e) {
      const o = i.createElement("span");
      o.className = "maplat-attribution-item maplat-attribution-google-text", o.textContent = wA, s.push(o);
    }
    for (const o of t) {
      const A = i.createElement("span");
      A.className = "maplat-attribution-item", A.innerHTML = o.html, s.push(A);
    }
    return s.forEach((o, A) => {
      if (A > 0) {
        const a = i.createElement("span");
        a.className = "maplat-attribution-sep", a.setAttribute("aria-hidden", "true"), a.textContent = " | ", r.appendChild(a);
      }
      r.appendChild(o);
    }), r;
  }
  /**
   * 出典の表示に使える幅（px）。箱に一時的に width: 100% を当て、右の位置と max-width の変数が
   * 効いた結果の幅を測る。レイアウトが無い（非表示の入れ物・jsdom）ときは 0。
   */
  #l() {
    const t = this.element, { width: e, display: i } = t.style, r = t.hidden;
    t.hidden = !1, t.style.width = "100%", t.style.display = "block";
    const s = t.getBoundingClientRect().width;
    return t.style.width = e, t.style.display = i, t.hidden = r, s;
  }
  /** 表示を外し、言語の監視をやめる。 */
  dispose() {
    this.#o || (this.#o = !0, this.#n?.disconnect(), this.#n = null, this.#A?.disconnect(), this.#A = null, this.#t = [], this.#s = [], this.#i.clear(), this.element.remove());
  }
  /**
   * 地図が <maplat-ui> の中にあり、その要素がまだ定義されていないときは、定義を待って一度だけ描き直す
   * （定義の前は currentLang が無く、仮の順で言語を選んでいるため）。破棄の後は描かない。
   */
  #h() {
    typeof customElements > "u" || customElements.get(Qi) || mo(this.#e, Qi) && customElements.whenDefined(Qi).then(
      () => this.render(),
      () => {
      }
    );
  }
  /**
   * 地図の箱の大きさが変わったら、Google の地図を出しているときだけ、ロゴと文字のどちらにするかを決め直す
   * （変わるときだけ描き直す）。
   */
  #C() {
    typeof ResizeObserver > "u" || (this.#A = new ResizeObserver(() => {
      if (this.#o || !bA(this.#t)) return;
      EA(this.#l()) !== this.googleAttribution && this.render();
    }), this.#A.observe(this.#e));
  }
  #f() {
    if (typeof MutationObserver > "u") return;
    this.#n = new MutationObserver(() => this.render());
    const t = { attributes: !0, attributeFilter: ["lang"], subtree: !0 }, e = this.#e.getRootNode?.();
    e && e.nodeType === 11 && this.#n.observe(e, t);
    const i = this.#e.ownerDocument.documentElement;
    i && this.#n.observe(i, t);
  }
}
const Ap = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjcyNTIxMjZFMDJBMTExRTBCOTNGRTVBRkM1QzM1Qjc5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjcyNTIxMjZGMDJBMTExRTBCOTNGRTVBRkM1QzM1Qjc5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzI1MjEyNkMwMkExMTFFMEI5M0ZFNUFGQzVDMzVCNzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzI1MjEyNkQwMkExMTFFMEI5M0ZFNUFGQzVDMzVCNzkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4RaveOAAAB1UlEQVR42qzUTyikcRzH8d+OsUNbSOTvgW2LREqjHKSk9FjZxAGXlXJQDsqNokRzcebiRC5mT8tllBE7LlzYKBHFJpKMkD+7hvH+6ftMT4M0Y3/1uswzz+d5nu/3+/t9CAaD6n8uu/L5lHK5XroWjwI4kYWP8GMdv3H47A6nk8CDA6U8nvBLX/Ed+TjDEe7lAS24wE+M4zR0180NgXa7NSgOvajHKvqwZglMxBfUoBmVlv/wTXxU0O1WuoqIgQvLaIJDfn9NISbhRd7Tb4ahbJa3a0QthjCFv2/UfwNduJKv0jUOBSajDb8wE0FTdf1GUAzDGliOdExEMSleedsGxJiBZdiVC5GuABbxGZm2p1lUKg1/dOOjnGf9IglIsUkxY3H+jg1yIc136MBb6WjqOwLNe6904AP2kSuDG80qkW15YjZlCdkojSLsEyqwiWMzcAVbaJV6RrK+IQc/dB3NwGuMohAdEYQVoROz8FkHW68FCW1Hv4zS68eeUnWyS/YwLL1Q9rA/jsn4dEtd5mRo9WlzJ03Tda6S7TaPQWmIPCkQCH+6Ww5RfR5WowmX+IckOca2MYBp2SmW8zCb5hpGeKjuWA8yZEulSbP8sqN2JPjZif0owACin4C7wCjG6AAAAABJRU5ErkJggg==", gp = "data:image/png;base64,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", fi = {
  osm: $g,
  gsi: tc,
  gsi_ortho: ec,
  redcircle: Ap,
  defaultpin_selected: gp,
  defaultpin: kg,
  bluedot: Sg,
  bluedot_transparent: Tg,
  bluedot_small: _g
};
function bp(n) {
  const t = lr(n);
  return [t[0], t[1]];
}
function cp(n = !1) {
  return n ? fi.defaultpin_selected : fi.defaultpin;
}
const ze = {
  noRotate: !1,
  northUp: !1,
  homeMarginPixels: 50,
  tapDuration: 3e3,
  tapUIVanish: !1,
  debug: !1
};
function Hi(n, t) {
  return n?.[t] ?? !1;
}
function MA(n, t) {
  const e = n.__selectedMarker == t.namespaceID;
  return t.icon ? e && t.selectedIcon ? t.selectedIcon : t.icon : cp(e);
}
function SA(n, t) {
  if (!t.includes("#")) {
    for (const s of Object.keys(n.pois)) {
      const o = n.pois[s];
      for (const A of o.pois)
        if (A.id === t) return { poi: A, ancestors: [o, n] };
    }
    return;
  }
  const e = t.split("#"), i = Et(n.cacheHash, e[0]);
  if (!i?.pois) return;
  let r;
  for (const s of Object.keys(i.pois)) {
    const o = i.pois[s];
    for (const A of o.pois)
      A.id === e[1] && (r = { poi: A, ancestors: [o, i, n] });
  }
  return r;
}
const lp = {
  "setting-loaded": "onSettingLoaded",
  "appdata-ready": "onAppdataReady",
  "ui-configure": "onUiConfigure",
  "core-dom-ready": "onCoreDomReady",
  "ui-dom-ready": "onUiDomReady",
  "core-ready": "onCoreReady",
  "ui-ready": "onUiReady"
};
class up extends Le {
  detail;
  constructor(t) {
    super("gps_error"), this.detail = t;
  }
}
class ii extends Le {
  detail;
  constructor(t) {
    super("gps_result"), this.detail = t;
  }
}
class Ip extends Le {
  constructor() {
    super("gps_request");
  }
}
function bn(n, t) {
  console.warn(
    `MaplatCore: POI layer "${n}" not found (${t}). Pass namespaceID (e.g. "<mapID>#<layerId>" for map-derived layers), not the layer-local id.`
  );
}
let hp = 0;
class di extends NA {
  // Static method declaration
  /**
   * 旧 API の生成口（`new MaplatApp(option)` のあと `waitReady` を待つ）。
   *
   * @deprecated `MaplatApp` クラスは非推奨です。代わりに `<maplat-app>` 要素
   *   （`@maplat/core/element`）を使ってください。1.x では従来どおり使えますが、
   *   この口は 2.0 で閉じます（2.0 で削除します）。
   */
  static createObject;
  translateUI = !1;
  stateBuffer = {};
  mobileMapMoveBuffer;
  waitReady;
  // Changed to Promise<any> to match settingLoader
  changeMapSeq;
  appData;
  backMap;
  mercSrc;
  mercBuffer;
  timer = void 0;
  appName;
  cacheHash;
  currentPosition;
  startFrom = "";
  from;
  mapObject;
  mapboxMap;
  maplibreMap;
  pois;
  poiTemplate;
  poiStyle;
  iconTemplate;
  logger;
  icon;
  selectedIcon;
  homePosition;
  geolocation;
  moveTo_ = !1;
  gpsEnabled_ = !1;
  firstGpsRequest_ = !1;
  initialGpsMove_ = !1;
  __backMapMoving = !1;
  __backMapErrorWarned = !1;
  /** @internal 選択中の POI の namespaceID（範囲外の扱いは src/outside_pois.ts が読む） */
  __selectedMarker;
  /** @internal 範囲外の POI を選んでいる間の状態（src/outside_pois.ts が読む） */
  __outsideSelection;
  /** @internal 範囲外の POI を描かない指定（hide-outside-pois。src/outside_pois.ts が読む） */
  __hideOutsidePois = !1;
  /** @internal 範囲外の選択を外した後の引き戻しの予約（selectMarker で取り消す） */
  __pullBackTimer;
  // 可視化時の自己修復（issue #101）で使うリソース参照。
  __resizeObserver = null;
  // 前面と背面の viewport のずれ（紙の外のポインタの移動で毎回測らないために取っておく）
  __viewportOffset;
  __visibilityHandler = () => {
    this.__applyInitialViewpoint(), this.__schedulePendingView();
  };
  // 非表示中の changeMap で保留した視点確定と、その適用の予約状態。
  __pendingView = null;
  __pendingViewScheduled = !1;
  // 中心の目印の img（setCenterMarker が表現を当てる）
  __centerMarkerImg;
  lifecycleHookResults = {};
  __init = !0;
  __redrawMarkerBlock = !1;
  __redrawMarkerThrottle = [];
  __transparency;
  // 線・面の登録簿と連番。Object.create(MaplatApp.prototype) の殻でも
  // 動くよう初期化子に頼らず遅延で作る（__vectorStore・連番は undefined を 0 とみなす）。
  __vectors;
  __vectorSeq;
  __vectorDrawSeq;
  // 表示中の現代の地図の出典の表示（src/attribution.ts）と、appOption.lang（言語の候補の 1 つ）
  __attribution;
  __attributionLangOption;
  lastClickEvent;
  // ---- 起動時だけ効くキー（起動後は変更不可） ----
  // 公開面は getter のみ（TypeScript 上は readonly）。実行時は lockStartupFields() が
  // 警告して無視する setter を足す（strict mode の代入で例外にしないため）。
  // Core 自身の書き込みは下の __ で始まる保管場所へ行う。
  // lockStartupFields() の setter だけが読む（private だと未使用扱いになるので protected）
  /** @internal */
  __startupLocked = !1;
  /** @internal */
  __startupWarner;
  __appid = "sample";
  __mapDiv = "map_div";
  __mapDivDocument = null;
  __enableCache = !1;
  __noRotate = !1;
  __alwaysGpsOn = !1;
  __overlay = !0;
  __googleApiKey;
  __restoreSession = !1;
  __initialRestore = {};
  __uiHooks;
  __fakeGps = !1;
  __fakeRadius;
  // 設定ファイルの機能系キーの扱い
  __elementMode = !1;
  __settingFileKeys;
  __featureKeyWarner;
  /** アプリ ID（appOption.appid）。起動後は変更不可。 */
  get appid() {
    return this.__appid;
  }
  /** 地図の箱の id（要素で渡したときは内部の子要素の id 接頭辞）。起動後は変更不可。 */
  get mapDiv() {
    return this.__mapDiv;
  }
  /** 地図の箱の要素。起動後は変更不可。 */
  get mapDivDocument() {
    return this.__mapDivDocument;
  }
  /** タイルキャッシュを使うか（appOption.enableCache）。起動後は変更不可。 */
  get enableCache() {
    return this.__enableCache;
  }
  /** 回転操作を止めるか（appOption.noRotate ／設定ファイル）。起動後は変更不可。 */
  get noRotate() {
    return this.__noRotate;
  }
  /** 常時 GPS モード（appOption.alwaysGpsOn）。起動後は変更不可。 */
  get alwaysGpsOn() {
    return this.__alwaysGpsOn;
  }
  /** 背面地図を持つか（appOption.overlay）。起動後は変更不可。 */
  get overlay() {
    return this.__overlay;
  }
  /** Google の API キー（appOption.googleApiKey）。起動後は変更不可。 */
  get googleApiKey() {
    return this.__googleApiKey;
  }
  /** 状態を localStorage に保存・復元するか（appOption.restoreSession）。起動後は変更不可。 */
  get restoreSession() {
    return this.__restoreSession;
  }
  /** 起動時に使った復元値（appOption.restore または localStorage）。起動後は差し替え不可。 */
  get initialRestore() {
    return this.__initialRestore;
  }
  /** 偽 GPS の中心（appOption.fake が真のときの設定ファイルの fakeGps）。起動後は変更不可。 */
  get fakeGps() {
    return this.__fakeGps;
  }
  /** 偽 GPS の半径（同上）。起動後は変更不可。 */
  get fakeRadius() {
    return this.__fakeRadius;
  }
  /** 起動時の hook（appOption.uiHooks）。起動後は変更不可。 */
  get uiHooks() {
    return this.__uiHooks;
  }
  /**
   * 機能系キーを appOption ＞ 設定ファイル ＞ 既定値 の順で決める。
   * 「与えられたか」は undefined / null で判定する（false・0 は与えられた値）。
   * 要素の経路（<maplat-app>）では設定ファイルの値を読まない。旧クラスの経路では読むが、
   * メジャー版で廃止する旨を 1 回警告する。
   */
  __featureOption(t, e, i) {
    const r = t?.[e];
    if (r != null) return r;
    const s = this.appData?.[e];
    return s == null ? i : !this.__settingFileKeys || this.__settingFileKeys.has(e) ? (this.__featureKeyWarner || (this.__featureKeyWarner = RA()), this.__elementMode ? (this.__featureKeyWarner(
      e,
      `<maplat-app>: the setting file key "${e}" is a presentation (feature) setting and is ignored; give it as an attribute or property of the element instead.`
    ), i) : (this.__featureKeyWarner(
      e,
      `MaplatApp: reading the feature key "${e}" from the setting file is deprecated and will be removed in the next major version; pass it in appOption (or as an attribute of <maplat-app>) instead.`
    ), s)) : s;
  }
  // Maplat App Class
  constructor(t) {
    super(), t = ve(t), t && "__maplatElementMode" in t || Qc(), this.__appid = t.appid || "sample", this.__elementMode = t.__maplatElementMode === !0;
    const e = t.mapboxgl || (typeof window < "u" ? window.mapboxgl : void 0);
    e && t.mapboxToken && (e.accessToken = t.mapboxToken), t.googleApiKey && (this.__googleApiKey = t.googleApiKey);
    const i = t.div;
    i && typeof i == "object" && i.nodeType === 1 ? (this.__mapDivDocument = i, this.__mapDiv = i.id || `maplat_app_${++hp}`) : (this.__mapDiv = i || "map_div", this.__mapDivDocument = document.querySelector(`#${this.__mapDiv}`)), this.mapDivDocument.classList.add("maplat"), this.logger = new No(
      t.debug ? $e.ALL : $e.INFO
    ), this.__enableCache = t.enableCache || !1, this.icon = t.icon, this.selectedIcon = t.selectedIcon, this.translateUI = t.translateUI, this.__uiHooks = t.uiHooks;
    const r = t.setting;
    if (t.restore)
      t.restoreSession && (this.__restoreSession = !0), this.__initialRestore = t.restore;
    else if (t.restoreSession) {
      this.__restoreSession = !0;
      const g = parseInt(localStorage.getItem("epoch") || "0"), c = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
      if (g && c - g < 3600) {
        this.initialRestore.mapID = localStorage.getItem("mapID") || localStorage.getItem("sourceID") || void 0, this.initialRestore.backgroundID = localStorage.getItem("backgroundID") || localStorage.getItem("backID") || void 0, this.initialRestore.position = {
          x: parseFloat(localStorage.getItem("x") || "0"),
          y: parseFloat(localStorage.getItem("y") || "0"),
          zoom: parseFloat(localStorage.getItem("zoom") || "0"),
          rotation: parseFloat(localStorage.getItem("rotation") || "0")
        }, this.initialRestore.transparency = parseFloat(
          localStorage.getItem("transparency") || "0"
        ), this.initialRestore.hideMarker = parseInt(
          localStorage.getItem("hideMarker") || "0"
        ), this.initialRestore.hideLayer = localStorage.getItem("hideLayer") || void 0;
        const u = t.restoreExtensionKeys;
        if (Array.isArray(u))
          for (const h of u) {
            if (typeof h != "string" || h in this.__initialRestore) continue;
            const p = localStorage.getItem(h);
            p !== null && (this.__initialRestore[h] = p);
          }
      }
    }
    const s = t.__restoreOverride;
    if (s) {
      const g = { ...this.__initialRestore };
      s.mapID !== void 0 && s.mapID !== g.mapID && delete g.position;
      for (const [c, u] of Object.entries(s))
        u !== void 0 && (g[c] = u);
      this.__initialRestore = g;
    }
    const o = Hn(`<img id="center_circle" class="prevent-default maplat-center-marker" alt=""
            style="position:absolute;top:50%;left:50%;margin-top:-10px;
            margin-left:-10px;" src="${fi.redcircle}">`);
    this.__centerMarkerImg = o[0], [...o].reverse().forEach((g) => {
      this.mapDivDocument.insertBefore(
        g,
        this.mapDivDocument.firstChild
      );
    });
    const A = "maplat-core-style";
    if (!document.getElementById(A)) {
      const g = document.createElement("style");
      g.id = A, g.innerHTML = `
        .maplat * {
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
      `, document.head.appendChild(g);
    }
    this.mapDivDocument.querySelectorAll(".prevent-default").forEach((g) => {
      g.addEventListener("touchstart", (c) => {
        c.preventDefault();
      });
    }), this.__overlay = t.overlay ?? !0, this.overlay && this.mapDivDocument.classList.add("with-opacity"), this.waitReady = (async () => {
      const g = await this.settingLoader(r);
      return this.handleSetting(g, t);
    })(), this.__startupLocked = !0;
  }
  /**
   * @internal 中心の目印の表現を当てる。既定の画像は Core が持つ assets.redcircle で、
   * 要素は「既定 src の控え」を持たない。
   */
  setCenterMarker(t) {
    const e = this.__centerMarkerImg;
    if (!e) return;
    const i = t.hidden === !0;
    e.hidden = i, e.style.display = i ? "none" : "", t.src ? (e.setAttribute("src", t.src), e.style.margin = "0", e.style.transform = "translate(-50%, -50%)", e.classList.add("maplat-center-marker--custom")) : (e.setAttribute("src", fi.redcircle), e.style.margin = "-10px 0 0 -10px", e.style.transform = "", e.classList.remove("maplat-center-marker--custom"));
  }
  /**
   * @internal 起動後の機能系キー・テンプレート・icon を当てる。
   * `undefined` は「与えられていない」＝ Core の既定（RUNTIME_DEFAULTS）／設定ファイルの値。
   * キーの有無は `in` で見る（`{ northUp: undefined }` は「外された」を意味する）。
   */
  applyRuntimeOptions(t) {
    const e = this.mapObject;
    "northUp" in t && e && (e.northUp = t.northUp ?? ze.northUp), "homeMarginPixels" in t && e && (e.homeMarginPixels = t.homeMarginPixels ?? ze.homeMarginPixels), "debug" in t && (this.logger = new No(
      t.debug ?? ze.debug ? $e.ALL : $e.INFO
    ));
    let i = !1;
    for (const r of ["icon", "selectedIcon"])
      r in t && (this[r] = t[r], i = !0);
    for (const r of ["poiTemplate", "poiStyle", "iconTemplate"])
      r in t && (this[r] = t[r] ?? Hi(this.appData, r), i = !0);
    "hideOutsidePois" in t && (this.__hideOutsidePois = t.hideOutsidePois === !0, i = !0), i && this.from && this.redrawMarkers();
  }
  buildLifecycleContext(t, e) {
    return {
      phaseId: t,
      appData: e ?? this.appData,
      mapDivDocument: this.mapDivDocument,
      core: this,
      uiHookResults: { ...this.lifecycleHookResults }
    };
  }
  async runLifecyclePhase(t, e) {
    this.logger?.debug?.(`lifecycle:${t}`);
    const i = this.buildLifecycleContext(t, e), r = lp[t], s = this.uiHooks?.[r];
    if (s)
      try {
        const o = await s(i);
        this.lifecycleHookResults[t] = o, i.uiHookResult = o, i.uiHookResults = { ...this.lifecycleHookResults };
      } catch (o) {
        throw this.logger?.debug?.(`lifecycle:error:${t}`), this.dispatchEvent(new Gt("lifecycle:error", { phaseId: t, error: o })), o;
      }
    return this.dispatchEvent(
      new Gt(`lifecycle:${t}`, i)
    ), i;
  }
  // Async initializers 1: Load application setting
  async settingLoader(t) {
    return t || (await fetch(`apps/${this.appid}.json`)).json();
  }
  // Async initializer 6: Load pois setting => move to normalize_pois.js
  // Async initializer 8: Load sources setting asynchronous
  async sourcesLoader(t) {
    const e = this.appData.sources, i = [], r = {
      homePos: t.homePos,
      defZoom: t.defZoom,
      zoomRestriction: t.zoomRestriction,
      mercMinZoom: t.mercMinZoom,
      mercMaxZoom: t.mercMaxZoom,
      enableCache: this.enableCache,
      key: this.googleApiKey,
      mapboxMap: this.mapboxMap,
      // Pass mapbox map instance
      maplibreMap: this.maplibreMap
      // Pass maplibre map instance
    };
    return e.forEach((s) => {
      i.push(
        HC(s, r).catch(
          (o) => o instanceof ie ? kC(s, o) : Promise.reject(o)
        )
      );
    }), Promise.all(i);
  }
  // Async initializers 2: Handle application setting
  async handleSetting(t, e) {
    await this.runLifecyclePhase("setting-loaded", t), this.appData = ve(t), this.__settingFileKeys = new Set(Object.keys(this.appData || {})), await this.runLifecyclePhase("appdata-ready"), await this.runLifecyclePhase("ui-configure");
    const i = await this.prepareMap(e);
    await this.runLifecyclePhase("ui-dom-ready");
    const r = await hg(this.appData.pois || [], this);
    await this.handlePois(r, i), this.initGeolocation(e);
  }
  // Async Initializers 2.5: For geolocation settings
  initGeolocation(t) {
    this.__alwaysGpsOn = t.alwaysGpsOn || !1;
    const e = this.geolocation = new kf({
      timerBase: t.fake,
      homePosition: this.appData.homePosition
    });
    this.alwaysGpsOn ? (e.setTracking(!0), this.gpsEnabled_ = !0, this.initialGpsMove_ = !0) : (e.setTracking(!1), this.gpsEnabled_ = !1), e.on("change", () => {
      (async () => {
        const i = this.mapObject, r = i.getLayer("overlay").getLayers().item(0), s = i.getLayers().item(0), o = r ? r.getSource() : s.getSource(), A = e.getPosition(), a = e.getAccuracy();
        if (!A || !a) return;
        let g = !this.moveTo_ && !this.firstGpsRequest_;
        this.alwaysGpsOn && (g = !this.initialGpsMove_), this.__outsideSelection && (g = !0);
        const c = await o.setGPSMarkerAsync({ lnglat: A, acc: a }, g);
        this.moveTo_ = !1, this.firstGpsRequest_ = !1, this.initialGpsMove_ = !1, c || (this.alwaysGpsOn || this.handleGPS(!1, !0), o.setGPSMarker());
        const u = this.alwaysGpsOn ? "gps_out_hide" : "gps_out";
        this.dispatchEvent(new ii(c ? { lnglat: A, acc: a } : { error: u }));
      })();
    }), e.on("error", (i) => {
      const r = i.code;
      if (r === 3) return;
      e.setTracking(!1), this.gpsEnabled_ = !1;
      const s = this.mapObject, o = s.getLayer("overlay").getLayers().item(0), A = s.getLayers().item(0);
      (o ? o.getSource() : A.getSource()).setGPSMarker(), this.dispatchEvent(new up(r === 1 ? "user_gps_deny" : r === 2 ? "gps_miss" : "gps_timeout")), this.dispatchEvent(new ii({ error: "gps_off" }));
    }), this.addEventListener("mapChanged", () => {
      (async () => {
        if (e.getTracking()) {
          const i = this.mapObject, r = i.getLayer("overlay").getLayers().item(0), s = i.getLayers().item(0), o = r ? r.getSource() : s.getSource(), A = e.getPosition(), a = e.getAccuracy();
          if (!A || !a) return;
          const g = await o.setGPSMarkerAsync({ lnglat: A, acc: a }, !0);
          g || (this.alwaysGpsOn || this.handleGPS(!1, !0), o.setGPSMarker());
          const c = this.alwaysGpsOn ? "gps_out_hide" : "gps_out";
          this.dispatchEvent(new ii(g ? { lnglat: A, acc: a } : { error: c }));
        }
      })();
    });
  }
  // GPS handling methods
  handleGPS(t, e = !1) {
    if (this.geolocation) {
      if (t)
        if (!this.alwaysGpsOn)
          this.firstGpsRequest_ = !0, this.geolocation.setTracking(!0), this.gpsEnabled_ = !0, this.dispatchEvent(new Ip());
        else {
          const i = this.geolocation.getPosition(), r = this.geolocation.getAccuracy();
          if (i && r) {
            const s = this.mapObject, o = s.getLayer("overlay").getLayers().item(0), A = s.getLayers().item(0), a = o ? o.getSource() : A.getSource();
            (async () => await a.setGPSMarkerAsync(
              { lnglat: i, acc: r },
              !!this.__outsideSelection
            ) || (a.setGPSMarker(), this.dispatchEvent(new ii({ error: "gps_out" }))))();
          }
        }
      else if (!this.alwaysGpsOn) {
        this.geolocation.setTracking(!1), this.gpsEnabled_ = !1;
        const i = this.mapObject, r = i.getLayer("overlay").getLayers().item(0), s = i.getLayers().item(0);
        (r ? r.getSource() : s.getSource()).setGPSMarker(), e || this.dispatchEvent(new ii({ error: "gps_off" }));
      }
    }
  }
  getGPSEnabled() {
    return this.gpsEnabled_;
  }
  // Async initializers 5: Prepare map base elements and objects
  async prepareMap(t) {
    t = ve(t), this.mercBuffer = null;
    const e = this.appData.homePosition, i = this.appData.defaultZoom, r = this.appData.zoomRestriction, s = this.appData.minZoom, o = this.appData.maxZoom;
    this.appName = this.appData.appName;
    const A = t.fake && !this.__elementMode ? this.appData.fakeGps : !1, a = t.fake && !this.__elementMode ? this.appData.fakeRadius : !1;
    this.__noRotate = this.__featureOption(t, "noRotate", ze.noRotate), this.poiTemplate = t.poiTemplate ?? Hi(this.appData, "poiTemplate"), this.poiStyle = t.poiStyle ?? Hi(this.appData, "poiStyle"), this.iconTemplate = t.iconTemplate ?? Hi(this.appData, "iconTemplate"), this.currentPosition = null, this.__hideOutsidePois = t.hideOutsidePois === !0, this.__init = !0;
    const g = `${this.mapDiv}_front`;
    let c = Hn(
      `<div id="${g}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;"></div>`
    )[0];
    this.mapDivDocument.insertBefore(c, this.mapDivDocument.firstChild), this.__fakeGps = A, this.__fakeRadius = a, this.homePosition = e, this.mapObject = new Ze({
      div: g,
      controls: this.__featureOption(t, "controls", []),
      interactions: this.noRotate ? Da({ altShiftDragRotate: !1, pinchRotate: !1 }) : Da().extend([
        new Qh({
          condition: _h
        })
      ]),
      fakeGps: A,
      fakeRadius: a,
      homePosition: e,
      northUp: this.__featureOption(t, "northUp", ze.northUp),
      tapDuration: this.__featureOption(t, "tapDuration", ze.tapDuration),
      homeMarginPixels: this.__featureOption(t, "homeMarginPixels", ze.homeMarginPixels),
      tapUIVanish: this.__featureOption(t, "tapUIVanish", ze.tapUIVanish),
      alwaysGpsOn: t.alwaysGpsOn || !1
    });
    let u;
    this.overlay && (u = `${this.mapDiv}_back`, c = Hn(
      `<div id="${u}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;"></div>`
    )[0], this.mapDivDocument.insertBefore(
      c,
      this.mapDivDocument.firstChild
    ), this.backMap = new Ze({
      off_control: !0,
      div: u
    }), this.__viewportOffset = new vf(this.mapObject, this.backMap));
    const h = t.mapboxgl || (typeof window < "u" ? window.mapboxgl : void 0);
    if (h) {
      const I = `${this.mapDiv}_mapbox`;
      c = Hn(
        `<div id="${I}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;visibility:hidden;"></div>`
      )[0], this.mapDivDocument.insertBefore(
        c,
        this.mapDivDocument.firstChild
      ), this.mapboxMap = new h.Map({
        attributionControl: !1,
        boxZoom: !1,
        container: I,
        doubleClickZoom: !1,
        dragPan: !1,
        dragRotate: !1,
        interactive: !1,
        keyboard: !1,
        pitchWithRotate: !1,
        scrollZoom: !1,
        touchZoomRotate: !1,
        // mapbox-gl-js v3 系は既定・状況により Globe 投影になり得るため、
        // Maplat は常に平面（Mercator）表示を前提とする本ライブラリの用途上、明示的に固定する
        projection: "mercator"
      });
    }
    this.registerSelfHeal();
    const p = t.maplibregl || (typeof window < "u" ? window.maplibregl : void 0);
    if (p) {
      const I = `${this.mapDiv}_maplibre`;
      c = Hn(
        `<div id="${I}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;visibility:hidden;"></div>`
      )[0], this.mapDivDocument.insertBefore(
        c,
        this.mapDivDocument.firstChild
      ), this.maplibreMap = new p.Map({
        attributionControl: !1,
        boxZoom: !1,
        container: I,
        doubleClickZoom: !1,
        dragPan: !1,
        dragRotate: !1,
        interactive: !1,
        keyboard: !1,
        pitchWithRotate: !1,
        scrollZoom: !1,
        touchZoomRotate: !1,
        // Set a basic style to prevent render errors
        style: {
          version: 8,
          sources: {},
          layers: []
        }
      });
    }
    this.__attributionLangOption = t.lang, this.__attribution?.dispose(), this.__attribution = new ap(
      this.mapDivDocument,
      () => Kd(this.mapDivDocument, this.__attributionLangOption, this.appData?.lang)
    );
    const m = this.mapObject;
    m.on("postrender", (I) => {
      this.__attribution?.refreshDynamic(
        [m.getSource(), this.from instanceof Mn ? this.from : void 0],
        I.frameState
      );
    });
    const l = this.backMap;
    return l?.on("postrender", (I) => {
      this.__attribution?.refreshDynamic([l.getSource()], I.frameState);
    }), await this.runLifecyclePhase("core-dom-ready"), this.startFrom = this.appData.startFrom, {
      homePos: e,
      defZoom: i,
      zoomRestriction: r,
      mercMinZoom: s,
      mercMaxZoom: o
    };
  }
  // Async initializer 7: Handle pois loading result
  async handlePois(t, e) {
    this.pois = t;
    const i = await this.sourcesLoader(e);
    return this.handleSources(i);
  }
  /**
   * @internal sourceLoaded の材料。「GL 未ロード等で落とした source は usable: false」の
   * 判断は keep を決めている側（cacheHash の同一性）に 1 つだけ置く。Set は持たない。
   */
  sourceLoadedDetail(t) {
    const i = (Array.isArray(t) ? t : []).map((r) => ({
      mapID: r?.mapID ?? null,
      usable: !!(r && this.cacheHash?.[r.mapID] === r)
    }));
    return OC(this).forEach((r) => {
      i.push({ mapID: r.mapID, usable: !1 });
    }), i;
  }
  // Async initializer 9: Handle sources loading result
  async handleSources(t) {
    const e = [], i = [], r = [];
    if (this.cacheHash = /* @__PURE__ */ Object.create(null), t.forEach((s) => {
      if (RC(s)) {
        r.push({
          mapID: s.mapID,
          reason: s.__maplatUnusable.reason
        }), console.error(
          `Maplat: IIIF image for map "${s.mapID}" is not usable: ${s.__maplatUnusable.reason}`
        );
        return;
      }
      i.push(s), s.setMap(this.mapObject), Wc(s, {
        mapboxMap: this.mapboxMap,
        maplibreMap: this.maplibreMap,
        warn: (A, ...a) => {
          this.logger?.warn ? this.logger.warn(A, ...a) : console.warn(A, ...a);
        }
      }) && (e.push(s), this.cacheHash[s.mapID] = s);
    }), PC(this, r), this.mercSrc = e.reduce((s, o) => {
      if (s) return s;
      if (o.isBasemap()) return o;
    }, null), this.dispatchEvent(new Gt("sourceLoaded", i)), e.length === 0) {
      this.logger?.warn ? this.logger.warn("No usable sources; skipping map initialization handlers") : console.warn("No usable sources; skipping map initialization handlers"), await this.runLifecyclePhase("core-ready"), await this.runLifecyclePhase("ui-ready");
      return;
    }
    await this.setInitialMap(e), this.setMapClick(), this.setPointerEvents(), this.__elementMode || this.setMapOnOff(), this.setMouseCursor(), this.setBackMapBehavior(), this.raiseChangeViewpoint(), await this.runLifecyclePhase("core-ready"), await this.runLifecyclePhase("ui-ready");
  }
  // Async initializer 10: Handle initial map
  async setInitialMap(t) {
    let e = this.initialRestore.mapID || this.startFrom || t[t.length - 1].mapID;
    if (!t.some((i) => i.mapID === e)) {
      const i = t[t.length - 1].mapID;
      console.warn(
        `Maplat: the initial map "${e}" is not usable; starting from "${i}" instead.`
      ), e = i;
    }
    this.from = t.reduce(
      (i, r) => i ? !(i instanceof Fg) && r.mapID != e ? r : i : r.mapID != e ? r : i,
      void 0
    ), await this.changeMap(e, this.initialRestore);
  }
  // Async initializer 11: Handle map click event
  setMapClick() {
    this.mapObject.on("click", (t) => {
      this.logger.debug(t.pixel), this.lastClickEvent = t;
      const e = [];
      if (t.target.forEachFeatureAtPixel(t.pixel, (i) => {
        this.logger.debug(t.pixel), i.get("datum") && e.push(i.get("datum"));
      }), e.length === 0 && e.push(...rA(this, t)), e.length > 0)
        this.dispatchEvent(new Gt("clickMarker", e[0])), this.dispatchEvent(new Gt("clickMarkers", e));
      else {
        const i = t.coordinate;
        this.dispatchEvent(new Gt("clickMapXy", i));
        const r = ss(this, t.pixel, this.__offsetNow);
        (r ? Promise.resolve(r.merc) : this.from.sysCoord2MercAsync(i)).then((s) => {
          if (!s) return;
          this.dispatchEvent(new Gt("clickMapMerc", s));
          const o = re(s, "EPSG:3857", "EPSG:4326");
          this.dispatchEvent(
            new Gt("clickMap", {
              longitude: o[0],
              latitude: o[1]
            })
          );
        });
      }
    });
  }
  // Async initializer 12: Handle pointer event
  setPointerEvents() {
    let t = !1, e = !1;
    const i = {};
    let r;
    const s = (o, A) => {
      this.dispatchEvent(new Gt("pointerMoveOnMapXy", o)), new Promise((a) => {
        const g = A ? ss(this, A, this.__offsetCached) : void 0;
        a(g ? g.merc : this.from.sysCoord2MercAsync(o));
      }).then((a) => {
        a && this.dispatchEvent(new Gt("pointerMoveOnMapMerc", a));
      }).catch((a) => {
        this.logger.debug(a);
      }).then(() => {
        if (r) {
          const a = r;
          r = void 0, s(a.xy, a.pixel);
        } else
          t = !1;
      });
    };
    this.mapObject.on("pointermove", (o) => {
      e || (t ? r = { xy: o.coordinate, pixel: o.pixel } : (t = !0, s(o.coordinate, o.pixel)));
    }), this.mapObject.on("pointerdown", (o) => {
      o.originalEvent && o.originalEvent.pointerId != null && (i[o.originalEvent.pointerId] = !0), e = !0;
    }), this.mapObject.on("pointerdrag", (o) => {
      o.originalEvent && o.originalEvent.pointerId != null && (i[o.originalEvent.pointerId] = !0), e = !0;
    }), this.mapObject.on("pointerup", (o) => {
      o.originalEvent && o.originalEvent.pointerId != null ? (delete i[o.originalEvent.pointerId], Object.keys(i).length == 0 && (e = !1)) : o.originalEvent && o.originalEvent.touches ? o.originalEvent.touches.length == 0 && (e = !1) : e = !1;
    });
  }
  // Async initializer 13: Handle map UI on/off
  setMapOnOff() {
    let t;
    const e = () => this.mapDivDocument.querySelectorAll(".ol-control"), i = (s) => {
      s.forEach((o) => o.classList.add("fade"));
    }, r = (s) => {
      s.forEach((o) => o.classList.remove("fade"));
    };
    this.mapObject.on("click", () => {
      t && (clearTimeout(t), t = void 0);
      const s = e(), o = s.length && s[0].classList.contains("fade");
      !this.mapObject.tapUIVanish || o ? r(s) : (i(s), t = setTimeout(() => {
        t = void 0, r(e());
      }, this.mapObject.tapDuration));
    }), this.mapObject.on("pointerdrag", () => {
      t && (clearTimeout(t), t = void 0), i(e());
    }), this.mapObject.on("moveend", () => {
      t && (clearTimeout(t), t = void 0), t = setTimeout(() => {
        t = void 0, r(e());
      }, this.mapObject.tapDuration);
    });
  }
  // Async initializer 14: Handle mouse cursor
  setMouseCursor() {
    const t = (r, s) => {
      const o = this.mapDivDocument.querySelector(`#${r}`);
      o.style.cursor !== s && (o.style.cursor = s);
    }, e = (r) => {
      const s = r.pixel, o = r.target.hasFeatureAtPixel(s), A = r.target.getTarget();
      if (o) {
        const g = r.target.forEachFeatureAtPixel(
          s,
          (c) => {
            if (c.get("datum")) return c;
          }
        );
        t(A, g ? "pointer" : "");
        return;
      }
      const a = rA(this, r).length > 0;
      t(A, a ? "pointer" : "");
    };
    this.mapObject.on("pointermove", e);
    const i = (r) => {
      zs(this, r.target.getView());
    };
    this.mapObject.on("moveend", i);
  }
  // Async initializer 15: Handle back map's behavior
  setBackMapBehavior() {
    const t = (e) => {
      if (!this.backMap || this.__pendingView) return;
      if (this.__backMapMoving) {
        this.logger.debug("Backmap moving skipped");
        return;
      }
      const i = this.backMap.getSource();
      if (i) {
        this.__backMapMoving = !0, this.logger.debug("Backmap moving started");
        const r = (s) => {
          this.__backMapMoving = !1, this.__reportBackMapError(s);
        };
        this.__convertFromCurrent(i, (s) => {
          if (!s) {
            this.__backMapMoving = !1;
            return;
          }
          const o = this.backMap.getView();
          o.setCenter(s[0]), o.setZoom(s[1]), o.setRotation(this.noRotate ? 0 : s[2]), this.logger.debug("Backmap moving ended"), this.__backMapMoving = !1;
        }, r);
      }
    };
    this.mapObject.on("postrender", t);
  }
  // #108: 変換が恒常的に失敗する地図では postrender ごとに失敗するので、
  // warn は最初の 1 回だけにし、以降は debug に落とす。
  __reportBackMapError(t) {
    this.__backMapErrorWarned ? this.logger.debug("Backmap follow skipped: coordinate conversion failed", t) : (this.__backMapErrorWarned = !0, this.logger.warn("Backmap follow skipped: coordinate conversion failed", t));
  }
  // Async initializer 16: Handle back map's behavior
  raiseChangeViewpoint() {
    this.mapObject.on("postrender", async (t) => {
      if (!this.__hasMapSize()) return;
      if (this.__pendingView) {
        this.__schedulePendingView();
        return;
      }
      const e = this.mapObject.getView(), i = e.getCenter(), r = e.getDecimalZoom(), s = Oi(e.getRotation() * 180 / Math.PI), o = await this.from.viewpoint2MercsAsync(), A = await this.mercSrc.mercs2ViewpointAsync(o);
      if (this.mobileMapMoveBuffer && this.mobileMapMoveBuffer[0][0] == A[0][0] && this.mobileMapMoveBuffer[0][1] == A[0][1] && this.mobileMapMoveBuffer[1] == A[1] && this.mobileMapMoveBuffer[2] == A[2]) return;
      this.mobileMapMoveBuffer = A;
      const a = re(A[0], "EPSG:3857", "EPSG:4326"), g = Oi(A[2] * 180 / Math.PI);
      this.dispatchEvent(
        new Gt("changeViewpoint", {
          x: i[0],
          y: i[1],
          longitude: a[0],
          latitude: a[1],
          mercator_x: A[0][0],
          mercator_y: A[0][1],
          zoom: r,
          mercZoom: A[1],
          direction: g,
          rotation: s
        })
      ), this.requestUpdateState({
        position: {
          x: i[0],
          y: i[1],
          zoom: r,
          rotation: s
        }
      });
    });
  }
  // 現在の地図回転角を度数で返す (入力側restore.position.rotationと同じ単位系, #61)
  getRotation() {
    const t = this.mapObject?.getView();
    return t ? Oi(t.getRotation() * 180 / Math.PI) : 0;
  }
  // 現在の実世界方位角を度数で返す。TIN地図では歪み補正込みの非同期計算になるためPromiseを返す (#61)
  async getDirection() {
    if (!this.from || !this.mercSrc) return this.getRotation();
    const t = await this.from.viewpoint2MercsAsync(), e = await this.mercSrc.mercs2ViewpointAsync(t);
    return Oi(e[2] * 180 / Math.PI);
  }
  currentMapInfo() {
    return jo(this.from);
  }
  mapInfo(t) {
    return jo(Et(this.cacheHash, t));
  }
  /** @internal 要素の viewExtent。pixel → 地図の座標 → merc を旧の連鎖のまま返す。 */
  async pixelToMerc(t) {
    const e = this.mapObject, i = this.from;
    if (!e || !i) return;
    const r = e.getCoordinateFromPixel(t);
    return r ? await i.sysCoord2MercAsync(r) : void 0;
  }
  /** @internal 表示領域の大きさ。4 隅の作り方は要素が持つ。 */
  viewportSize() {
    const t = this.mapObject?.getSize?.();
    if (!(!t || !(t[0] > 0 && t[1] > 0)))
      return [t[0], t[1]];
  }
  // 前面と背面の viewport のずれ。ポインタの移動は取っておいた値、クリックと
  // clientPointToLngLat は回数が少ないので毎回測り、その値を取っておく
  __offsetCached = () => this.__viewportOffset ? this.__viewportOffset.get() : Pn(this.mapObject, this.backMap);
  __offsetNow = () => this.__viewportOffset ? this.__viewportOffset.refresh() : Pn(this.mapObject, this.backMap);
  /** @internal 前面と背面の地図の大きさを測り直す。 */
  updateSize() {
    this.mapObject?.updateSize?.(), this.backMap?.updateSize?.();
  }
  async clientPointToLngLat(t, e) {
    if (!this.from || !this.mapObject) return;
    const r = this.mapObject.getViewport().getBoundingClientRect(), s = [t - r.left, e - r.top], o = ss(this, s, this.__offsetNow), A = o ? o.merc : await this.pixelToMerc(s);
    if (!A) return;
    const a = re(A, "EPSG:3857", "EPSG:4326");
    return {
      longitude: a[0],
      latitude: a[1]
    };
  }
  async lngLatToClientPoint(t, e) {
    if (!this.from || !this.mapObject) return;
    const i = re([t, e], "EPSG:4326", "EPSG:3857"), r = await bf(this, i), s = r ? r.map : this.mapObject, o = r ? r.coord : await this.from.merc2SysCoordAsync(i), A = s.getPixelFromCoordinate(o);
    if (!A) return;
    const a = s.getViewport().getBoundingClientRect();
    return {
      x: A[0] + a.left,
      y: A[1] + a.top
    };
  }
  setMarker(t) {
    this.logger.debug(t);
    const e = MA(this, t);
    return Ji(this, t).then((i) => {
      xf(this, t, e, i);
    });
  }
  resetMarker() {
    iA(this, { front: [], back: [] });
  }
  setLine(t) {
    t.type = "Line", !t.style && t.stroke && (t.style = {
      stroke: t.stroke
    }), this.setVector(t);
  }
  setVector(t) {
    this.__projectVector(t).then((e) => {
      this.mapObject.setVector(e, t.type, t.style);
    });
  }
  // data の座標（coordinates はメルカトル・lnglats は経緯度）を今の地図の座標へ変換する
  __projectVector(t) {
    this.logger.debug(t);
    let e;
    const i = (r, s = !1) => Promise.all(
      r.map((o) => Array.isArray(o[0]) ? i(o, s) : (s && (o = re(o, "EPSG:4326", "EPSG:3857")), this.from.merc2SysCoordAsync(o)))
    );
    return t.coordinates ? e = i(t.coordinates) : e = i(t.lnglats, !0), e;
  }
  __vectorStore() {
    return this.__vectors || (this.__vectors = /* @__PURE__ */ new Map()), this.__vectors;
  }
  __nextVectorDrawToken() {
    return this.__vectorDrawSeq = (this.__vectorDrawSeq || 0) + 1, this.__vectorDrawSeq;
  }
  // 登録簿の 1 件を描く。変換の解決までに消された・置き換えられた・
  // 描き直しが始まった（世代が進んだ）場合は描かない。
  __drawVectorEntry(t) {
    const e = this.__nextVectorDrawToken();
    t.drawToken = e, t.feature = void 0, this.__projectVector(t.data).then((i) => {
      this.__vectorStore().get(t.id) !== t || t.drawToken !== e || (t.feature = this.mapObject.setVector(
        i,
        t.data.type,
        t.data.style
      ));
    });
  }
  __addEntry(t, e) {
    const i = this.__vectorStore();
    let r;
    if (t != null)
      r = String(t);
    else
      do
        this.__vectorSeq = (this.__vectorSeq || 0) + 1, r = `vector_${this.__vectorSeq}`;
      while (i.has(r));
    i.has(r) && this.removeVector(r);
    const s = {
      id: r,
      data: e,
      kind: e.type === void 0 || e.type === "Line" ? "Line" : "Polygon",
      drawToken: 0
    };
    return i.set(r, s), this.__drawVectorEntry(s), r;
  }
  // addLine／addVector で登録した線・面の data（写し）の配列。読み取り専用。
  get vectors() {
    return Array.from(this.__vectorStore().values()).map((t) => t.data);
  }
  resetLine() {
    this.resetVector();
  }
  resetVector() {
    this.mapObject.resetVector(), this.__vectorStore().forEach((t) => {
      t.feature = void 0, t.drawToken = this.__nextVectorDrawToken();
    });
  }
  redrawMarkers(t = void 0) {
    if (t || (t = this.from), this.__redrawMarkerBlock) {
      this.__redrawMarkerThrottle = [t];
      return;
    }
    this.__redrawMarkerBlock = !0;
    const e = (i) => {
      const r = [];
      let s;
      const o = (a, ...g) => {
        const c = tA(a, ...g), u = {
          data: c,
          icon: MA(this, c)
        };
        this.__selectedMarker == c.namespaceID ? s = u : r.push(u);
      };
      if (!this.stateBuffer.hideMarker) {
        for (const a of Object.keys(this.pois)) {
          const g = this.pois[a];
          if (!g.hide)
            for (const c of g.pois) o(c, g, this);
        }
        if (i.pois)
          for (const a of Object.keys(i.pois)) {
            const g = i.pois[a];
            if (!g.hide)
              for (const c of g.pois)
                o(c, g, i, this);
          }
      }
      const A = s ? [...r, s] : r;
      Promise.all(A.map((a) => Ji(this, a.data))).then(
        (a) => {
          iA(this, Ef(this, A, a));
          const g = this.__outsideSelection;
          g && !this.stateBuffer.hideMarker && (s ? s.data?.namespaceID === g.id && os(this, a[a.length - 1]) : g.pending && os(this, void 0)), this.__redrawMarkerThrottle && this.__redrawMarkerThrottle.length > 0 ? e(this.__redrawMarkerThrottle.shift()) : this.__redrawMarkerBlock = !1;
        }
      );
    };
    e(t);
  }
  selectMarker(t) {
    const e = this.getMarker(t);
    if (!e) return;
    this.__selectedMarker = t, this.__pullBackTimer = void 0, this.__outsideSelection = { id: t, pending: !0 };
    const i = {
      latitude: e.lnglat ? e.lnglat[1] : e.lat ? e.lat : e.latitude,
      longitude: e.lnglat ? e.lnglat[0] : e.lng ? e.lng : e.longitude
    };
    this.setViewpoint(i), this.redrawMarkers(), Ji(this, e).then((r) => {
      this.__selectedMarker === t && os(this, r, { recenter: !0 });
    });
  }
  unselectMarker() {
    delete this.__selectedMarker;
    const t = !!this.__outsideSelection;
    if (delete this.__outsideSelection, this.redrawMarkers(), !t) return;
    const e = {};
    this.__pullBackTimer = e, queueMicrotask(() => {
      if (this.__pullBackTimer !== e) return;
      this.__pullBackTimer = void 0;
      const i = this.mapObject?.getView?.();
      i && zs(this, i);
    });
  }
  getMarker(t) {
    const e = SA(this, t);
    if (e)
      return tA(e.poi, ...e.ancestors);
  }
  updateMarker(t, e, i) {
    const r = SA(this, t)?.poi;
    if (r) {
      if (e = hi(e || {}), i) {
        for (const s of Object.keys(r))
          s !== "id" && s !== "namespaceID" && delete r[s];
        Object.assign(r, e);
      } else
        for (const s of Object.keys(e))
          s === "id" || s === "namespaceID" || (e[s] === "____delete____" ? delete r[s] : r[s] = e[s]);
      this.redrawMarkers();
    }
  }
  addMarker(t, e) {
    if (e || (e = "main"), e.includes("#")) {
      const i = e.split("#"), r = Et(this.cacheHash, i[0]);
      if (r) {
        const s = r.addPoi(t, i[1]);
        return this.dispatchPoiNumber(), this.redrawMarkers(), s;
      }
    } else {
      const i = Et(this.pois, e);
      if (i)
        return i.pois.push(hi(t)), go(this.pois, e, {
          name: this.appName
        }), this.dispatchPoiNumber(), this.redrawMarkers(), t.namespaceID;
    }
  }
  removeMarker(t) {
    if (t.includes("#")) {
      const e = t.split("#"), i = Et(this.cacheHash, e[0]);
      i && (i.removePoi(e[1]), this.dispatchPoiNumber(), this.redrawMarkers());
    } else {
      let e = 0;
      for (const i of Object.keys(this.pois)) {
        const r = this.pois[i].pois;
        for (let s = r.length - 1; s >= 0; s--)
          r[s].id === t && (r.splice(s, 1), e++);
      }
      e > 0 && (this.dispatchPoiNumber(), this.redrawMarkers());
    }
  }
  clearMarker(t) {
    if (t || (t = "main"), t.includes("#")) {
      const e = t.split("#"), i = Et(this.cacheHash, e[0]);
      i && (i.clearPoi(e[1]), this.dispatchPoiNumber(), this.redrawMarkers());
    } else {
      if (t === "all")
        for (const e of Object.keys(this.pois))
          this.pois[e].pois = [];
      else {
        const e = Et(this.pois, t);
        if (!e) return;
        e.pois = [];
      }
      this.dispatchPoiNumber(), this.redrawMarkers();
    }
  }
  showAllMarkers() {
    this.requestUpdateState({ hideMarker: 0 }), this.redrawMarkers();
  }
  hideAllMarkers() {
    this.requestUpdateState({ hideMarker: 1 }), this.redrawMarkers();
  }
  dispatchPoiNumber() {
    this.dispatchEvent(
      new Gt(
        "poi_number",
        this.listPoiLayers(!1, !0).reduce(
          (t, e) => t + e.pois.length,
          0
        )
      )
    );
  }
  listPoiLayers(t = !1, e = !1) {
    const i = Object.keys(this.pois).sort((s, o) => s === "main" ? -1 : o === "main" ? 1 : 0).map((s) => this.pois[s]).filter(
      (s) => e ? t ? s.pois.length && s.hide : s.pois.length : t ? s.hide : !0
    ), r = this.from.listPoiLayers(
      t,
      e
    );
    return i.concat(r);
  }
  showPoiLayer(t) {
    const e = this.getPoiLayer(t);
    if (!e) {
      bn(t, "showPoiLayer");
      return;
    }
    delete e.hide, this.requestUpdateState({
      hideLayer: this.listPoiLayers(!0).map((i) => i.namespaceID).join(",")
    }), this.redrawMarkers();
  }
  hidePoiLayer(t) {
    const e = this.getPoiLayer(t);
    if (!e) {
      bn(t, "hidePoiLayer");
      return;
    }
    e.hide = !0, this.requestUpdateState({
      hideLayer: this.listPoiLayers(!0).map((i) => i.namespaceID).join(",")
    }), this.redrawMarkers();
  }
  getPoiLayer(t) {
    if (typeof t == "string")
      if (t.includes("#")) {
        const e = t.split("#"), i = Et(this.cacheHash, e[0]);
        if (i)
          return i.getPoiLayer(e[1]);
      } else
        return Et(this.pois, t);
  }
  addPoiLayer(t, e) {
    if (t !== "main" && !this.pois[t])
      if (!t.includes("#"))
        this.pois[t] = Ue(e || [], t, {
          name: this.appName
        }), this.redrawMarkers();
      else {
        const i = t.split("#"), r = Et(this.cacheHash, i[0]);
        r ? (r.addPoiLayer(i[1], e), this.redrawMarkers()) : bn(t, "addPoiLayer");
      }
  }
  removePoiLayer(t) {
    if (t !== "main")
      if (t.includes("#")) {
        const e = t.split("#"), i = Et(this.cacheHash, e[0]);
        if (!i) {
          bn(t, "removePoiLayer");
          return;
        }
        if (!i.getPoiLayer(e[1])) {
          bn(t, "removePoiLayer");
          return;
        }
        i.removePoiLayer(e[1]), this.requestUpdateState({
          hideLayer: this.listPoiLayers(!0).map((r) => r.namespaceID).join(",")
        }), this.dispatchPoiNumber(), this.redrawMarkers();
      } else {
        if (!this.pois[t]) {
          bn(t, "removePoiLayer");
          return;
        }
        delete this.pois[t], this.requestUpdateState({
          hideLayer: this.listPoiLayers(!0).map((e) => e.namespaceID).join(",")
        }), this.dispatchPoiNumber(), this.redrawMarkers();
      }
  }
  // #91: 線を足して id を返す。data.id を与えればその id、無ければ自動の id。
  // 呼び手の data は変えず、写しに setLine と同じ正規化（type・stroke → style）をする。
  addLine(t) {
    const e = { ...t, type: "Line" };
    return !e.style && e.stroke && (e.style = {
      stroke: e.stroke
    }), delete e.id, this.__addEntry(t.id, e);
  }
  // #91: 線・面を足して id を返す（data.type が "Line" なら線、それ以外は面）
  addVector(t) {
    const e = { ...t };
    return delete e.id, this.__addEntry(t.id, e);
  }
  // #91: id の 1 件だけを消す。消したら true、無ければ false
  removeVector(t) {
    const e = this.__vectorStore(), i = e.get(t);
    return i ? (e.delete(t), i.feature && (this.mapObject.removeFeature(i.feature, "feature"), i.feature = void 0), !0) : !1;
  }
  // removeVector の別名（種類で絞らない）
  removeLine(t) {
    return this.removeVector(t);
  }
  // 引数なしは線も面も全部消す（従来どおり）。filter.type で線だけ・面だけを消す
  clearLine(t) {
    this.clearVector(t);
  }
  clearVector(t) {
    const e = t?.type;
    if (!e) {
      this.__vectorStore().clear(), this.resetVector();
      return;
    }
    Array.from(this.__vectorStore().values()).filter((i) => i.kind === e).forEach((i) => this.removeVector(i.id));
  }
  setGPSMarker(t) {
    this.currentPosition = t, this.from.setGPSMarker(t, !0);
  }
  changeMap(t, e) {
    e === void 0 && (e = {});
    const i = this.mercSrc, r = Et(this.cacheHash, t);
    return r ? (this.changeMapSeq || (this.changeMapSeq = Promise.resolve()), this.changeMapSeq = this.changeMapSeq.then(
      () => new Promise((s, o) => {
        const A = () => this.convertParametersFromCurrent(r, (a) => {
          const g = this.from, c = this.__captureViewState();
          let u = null, h = null;
          const p = e.backgroundID ? Et(this.cacheHash, e.backgroundID) : void 0;
          if (this.backMap && (u = this.backMap.getSource(), r.isWmts() ? this.backMap.exchangeSource() : (p ? (h = p, this.backMap.exchangeSource(h)) : u ? h = u : (h = i, this.from.isWmts() && (h = this.from instanceof Mn ? (
            // If current foreground is a TMS overlay, use the current
            // basemap as new background. On initial load no foreground
            // source is set yet, so fall back to the default basemap
            // (mercSrc) to avoid a null background source.
            this.mapObject.getSource() || i
          ) : this.from), h && this.backMap.exchangeSource(h)), h && this.requestUpdateState({ backgroundID: h.mapID }))), r instanceof Mn) {
            if (this.mapObject.setLayer(r), p)
              this.mapObject.exchangeSource(p);
            else if (!this.from.isWmts()) {
              const d = u || i;
              this.mapObject.exchangeSource(d);
            }
            const C = this.mapObject.getSource();
            C && this.requestUpdateState({ backgroundID: C.mapID });
          } else
            this.mapObject.setLayer(), this.mapObject.exchangeSource(r);
          const m = {
            mapID: r.mapID
          };
          r.isBasemap() && (m.backgroundID = "____delete____"), this.requestUpdateState(m), this.from = r, this.dispatchPoiNumber();
          const l = this.mapObject.getView();
          this.appData.zoomRestriction && (l.setMaxZoom(r.maxZoom), l.setMinZoom(r.minZoom || 0)), a && r.insideCheckSysCoord(a[0]) ? (this.__outsideSelection && (this.__outsideSelection = {
            ...this.__outsideSelection,
            pending: !0
          }), l.setCenter(a[0]), l.setZoom(a[1]), l.setRotation(this.noRotate ? 0 : a[2])) : !this.__init && !a && !this.__hasMapSize() && g ? this.__pendingView ? this.__pendingView.positionMapID !== r.mapID && (delete this.__pendingView.position, delete this.__pendingView.positionMapID) : this.__pendingView = { from: g, state: c } : this.__init ? a || this.__hasMapSize() && this.goHome(r) : this.__outsideSelection ? this.__outsideSelection = {
            ...this.__outsideSelection,
            pending: !0
          } : (this.dispatchEvent(new Gt("outOfMap", {})), this.goHome(r)), r.setGPSMarker(this.currentPosition, !0), e.hideLayer && (e.hideLayer.split(",").map((d) => {
            const x = this.getPoiLayer(d);
            x && (x.hide = !0);
          }), this.requestUpdateState({ hideLayer: e.hideLayer })), e.hideMarker ? this.hideAllMarkers() : this.redrawMarkers(), this.resetVector(), this.__vectorStore().forEach((C) => this.__drawVectorEntry(C));
          const I = r instanceof Mn ? r : void 0;
          this.__attribution?.update(
            Jd({
              front: this.mapObject.getSource(),
              overlay: I,
              back: this.backMap?.getSource()
            }),
            I ? [I] : []
          ), this.dispatchEvent(
            new Gt("mapChanged", this.getMapMeta(r.mapID))
          ), this.mapObject.updateSize(), this.mapObject.render(), e.position && (this.__hasMapSize() ? (this.__init = !1, r.setViewpoint(e.position)) : this.__pendingView && (this.__pendingView.position = e.position, this.__pendingView.positionMapID = r.mapID)), this.setTransparency(
            e.transparency !== void 0 && e.transparency !== null ? e.transparency : this.getTransparency()
          ), this.__init ? this.__hasMapSize() && (this.__init = !1, this.goHome(r)) : this.backMap && h && this.convertParametersFromCurrent(h, (C) => {
            if (!C)
              return;
            const d = this.backMap.getView();
            d.setCenter(C[0]), d.setZoom(C[1]), d.setRotation(this.noRotate ? 0 : C[2]), this.backMap.updateSize(), this.backMap.render();
          }), s(void 0);
        });
        this.__pendingView ? this.__applyPendingView().then(A) : A();
      })
    )) : (this.logger.warn(`changeMap: mapID "${t}" not found in cacheHash`), Promise.resolve());
  }
  requestUpdateState(t) {
    if (this.stateBuffer = Object.assign(this.stateBuffer, t), this.stateBuffer.backgroundID == "____delete____" && delete this.stateBuffer.backgroundID, this.restoreSession) {
      const e = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
      localStorage.setItem("epoch", `${e}`);
      const i = function(r) {
        Object.keys(r).map((s) => {
          s == "position" ? i(r[s]) : s == "backgroundID" && r[s] == "____delete____" ? localStorage.removeItem(s) : localStorage.setItem(s, r[s]);
        });
      };
      i(t);
    }
    this.timer && clearTimeout(this.timer), this.timer = setTimeout(() => {
      this.timer = void 0, this.dispatchEvent(new Gt("updateState", this.stateBuffer));
    }, 50);
  }
  setTransparency(t) {
    this.__transparency = t, this.mapObject.setTransparency(t), this.requestUpdateState({ transparency: t });
  }
  getTransparency() {
    return this.__transparency == null ? 0 : this.__transparency;
  }
  setViewpoint(t) {
    this.from.setViewpoint(t);
  }
  goHome(t) {
    (t || this.from).goHome();
  }
  // 可視化時の自己修復ハンドラの登録（issue #101）。
  // 非表示コンテナ（寸法 0）で初期化すると view の resolution が未確定のままとなり、
  // changeMap での初期視点適用（goHome / setViewpoint）が defer される（__init が
  // true のまま残る）。可視化の契機（visibilitychange / コンテナ寸法確定）で
  // __applyInitialViewpoint を呼び、初期視点を再適用する。
  registerSelfHeal() {
    const t = this.mapDivDocument;
    typeof document < "u" && document.addEventListener("visibilitychange", this.__visibilityHandler), t && typeof ResizeObserver < "u" && (this.__resizeObserver = new ResizeObserver(() => {
      this.__applyInitialViewpoint(), this.__schedulePendingView();
    }), this.__resizeObserver.observe(t));
  }
  // 初期視点が未適用（__init）かつコンテナ寸法が有効なときに、初期視点
  // を再適用して view を確定させる。再適用は initialRestore.position があれば
  // setViewpoint、なければ goHome を使い、適用後に updateSize + render を呼ぶ
  // （changeMap の既存描画順序 mapChanged → updateSize → render と同一の流れ）。
  __applyInitialViewpoint() {
    if (!this.__init) return;
    const t = this.mapObject, e = t ? t.getView() : void 0;
    if (!t || !e || !this.mapDivDocument) return;
    const i = this.from;
    i && (t.updateSize(), this.__hasMapSize() && (this.__init = !1, this.initialRestore.position ? i.setViewpoint(this.initialRestore.position) : i.goHome(), t.updateSize(), t.render()));
  }
  // 保留した視点確定の適用を changeMapSeq の後ろに予約する。
  // 寸法が無ければ予約しない。ResizeObserver・visibilitychange・postrender が
  // 続けて来ても、適用が走るまでは 1 回だけ予約する。
  __schedulePendingView() {
    if (!this.__pendingView || this.__pendingViewScheduled) return;
    const t = this.mapObject;
    t && (t.updateSize(), this.__hasMapSize() && (this.__pendingViewScheduled = !0, this.changeMapSeq || (this.changeMapSeq = Promise.resolve()), this.changeMapSeq = this.changeMapSeq.then(() => (this.__pendingViewScheduled = !1, this.__applyPendingView()))));
  }
  // 保留した視点確定を、表示中の changeMap と同じ規則で適用する。
  // 切替前の地図と視点を変換核 __convertParameters に通し（mercBuffer を含む同じ変換）、
  // 範囲内なら setCenter/setZoom/setRotation、範囲外なら outOfMap + goHome。
  // 保留に position があり行き先が一致すれば、変換の後で setViewpoint で上書きする。
  // 締めは __applyInitialViewpoint と同じ updateSize + render。
  __applyPendingView() {
    const t = this.__pendingView, e = this.mapObject, i = this.from;
    return !t || !e || !i || (e.updateSize(), !this.__hasMapSize()) ? Promise.resolve() : new Promise((r) => {
      let s = !1;
      const o = () => {
        s || (s = !0, this.__pendingView === t && (this.__pendingView = null), t.position && t.positionMapID === i.mapID && i.setViewpoint(t.position), e.updateSize(), e.render(), r());
      }, A = (a) => {
        s || (this.logger.warn(`changeMap: pending viewpoint conversion failed: ${a}`), this.goHome(i), o());
      };
      if (!t.state) {
        this.goHome(i), o();
        return;
      }
      try {
        this.__convertParameters(
          t.from,
          t.state,
          i,
          (a) => {
            const g = e.getView();
            a && i.insideCheckSysCoord(a[0]) ? (g.setCenter(a[0]), g.setZoom(a[1]), g.setRotation(this.noRotate ? 0 : a[2])) : this.__outsideSelection?.merc ? ac(this, this.__outsideSelection.merc) : (this.dispatchEvent(new Gt("outOfMap", {})), this.goHome(i)), o();
          },
          A
        );
      } catch (a) {
        A(a);
      }
    });
  }
  // 現在の view の視点を控える。有限でない値を含む場合は undefined
  // （非表示中に resolution が NaN へ崩れた後など。変換核へ流すと #101 と同じ例外になる）。
  __captureViewState() {
    const t = this.mapObject ? this.mapObject.getView() : void 0;
    if (!t) return;
    const e = this.__captureRawViewState(t), { center: i, zoom: r, decimalZoom: s, rotation: o } = e;
    if (!(!i || ![i[0], i[1], r, s, o].every(
      (A) => Number.isFinite(A)
    )))
      return { center: [i[0], i[1]], zoom: r, decimalZoom: s, rotation: o };
  }
  // view の値を検査せずにそのまま読む（切り出し前の
  // convertParametersFromCurrent が変換の直前に読んでいた値と同じ）。
  __captureRawViewState(t) {
    return {
      center: t.getCenter(),
      zoom: t.getZoom(),
      decimalZoom: t.getDecimalZoom(),
      rotation: t.getRotation()
    };
  }
  // コンテナ寸法が有効（map size が正）かどうか。非表示コンテナ
  // （display:none 等）では OL の map size が [0,0] となり、view の resolution が
  // NaN に崩れて座標変換が破綻する（issue #101）。未確定ガードと自己修復の判定に使う。
  __hasMapSize() {
    const t = this.mapObject ? this.mapObject.getSize() : void 0;
    return !!(t && t[0] > 0 && t[1] > 0);
  }
  resetRotation() {
    this.from.resetRotation();
  }
  resetDirection() {
    this.from.resetDirection();
  }
  resetCirculation() {
    this.from.resetCirculation();
  }
  getMapMeta(t) {
    let e;
    if (t ? e = Et(this.cacheHash, t) : e = this.from, !e) return;
    const i = Ai.reduce(
      (s, o) => (s[o] = e.get(o), s),
      {
        mapID: e.mapID,
        label: e.label
      }
    ), r = YI(e?.iiif, e?.iiifMetadataDisplay);
    return r && (i.iiif = r), i;
  }
  getMapCacheEnable(t) {
    let e;
    return t ? e = Et(this.cacheHash, t) : e = this.from, e ? e.getCacheEnable() : !1;
  }
  async getMapTileCacheStatsAsync(t) {
    let e;
    return t ? e = Et(this.cacheHash, t) : e = this.from, e ? await e.getTileCacheStatsAsync() : {};
  }
  async getMapTileCacheSizeAsync(t) {
    return (await this.getMapTileCacheStatsAsync(t)).size || 0;
  }
  async clearMapTileCacheAsync(t) {
    let e;
    t ? e = Et(this.cacheHash, t) : e = this.from, e && await e.clearTileCacheAsync();
  }
  async fetchAllMapTileCacheAsync(t, e) {
    let i;
    if (t ? i = Et(this.cacheHash, t) : i = this.from, !i) {
      e("stop", {});
      return;
    }
    await i.fetchAllTileCacheAsync(e);
  }
  async cancelMapTileCacheAsync(t) {
    let e;
    t ? e = Et(this.cacheHash, t) : e = this.from, e && await e.cancelTileCacheAsync();
  }
  convertParametersFromCurrent(t, e) {
    this.__convertFromCurrent(t, e);
  }
  // #108: convertParametersFromCurrent の本体。公開の型を変えずに
  // onError の口を得るために private へ移した。onError を渡したときだけ、同期例外も
  // 非同期の失敗（__convertParameters の onError）も投げずに onError へ渡す。
  // onError が無いときは今までと同じ（例外をそのまま投げる）。
  __convertFromCurrent(t, e, i) {
    try {
      const r = this.mapObject.getView();
      if (r && !this.__hasMapSize()) {
        e && e();
        return;
      }
      if (!this.from) {
        e && e();
        return;
      }
      const s = this.__captureRawViewState(r);
      this.__convertParameters(
        this.from,
        s,
        t,
        e,
        i
      );
    } catch (r) {
      if (i) i(r);
      else throw r;
    }
  }
  // 変換核。切替前の地図 fromSrc と、そのときの視点 state（地図の
  // 座標系の値）から、行き先 to の視点を求めて callback(size) を呼ぶ。中身は切り出し前の
  // convertParametersFromCurrent と同じ（mercBuffer のキャッシュ判定・
  // viewpoint2MercsAsync・mercs2ViewpointAsync・mercBuffer の更新）。
  // viewpoint2MercsAsync へは省略時に内部で読む値（center・getDecimalZoom・rotation）を
  // 明示で渡す。onError を渡した場合だけ、変換の失敗を投げずに onError へ渡す。
  __convertParameters(t, e, i, r, s) {
    let o = t.viewpoint2MercsAsync([
      e.center,
      e.decimalZoom,
      e.rotation
    ]);
    const A = Bs(
      [e.center, e.zoom, e.rotation],
      10
    );
    if (this.mercBuffer && this.mercBuffer.mercs && this.mercBuffer.buffer[t.mapID]) {
      const a = this.mercBuffer.buffer[t.mapID];
      a[0][0] == A[0][0] && a[0][1] == A[0][1] && a[1] == A[1] && a[2] == A[2] ? (this.logger.debug(a), this.logger.debug(A), this.logger.debug("From: Use buffer"), o = new Promise((g, c) => {
        g(this.mercBuffer.mercs);
      })) : (this.mercBuffer = {
        buffer: {}
      }, this.mercBuffer.buffer[t.mapID] = A);
    } else
      this.mercBuffer = {
        buffer: {}
      }, this.mercBuffer.buffer[t.mapID] = A;
    this.logger.debug(
      `From: Center: ${A[0]} Zoom: ${A[1]} Rotation: ${A[2]}`
    ), this.logger.debug(`From: ${t.mapID}`), o.then((a) => {
      this.mercBuffer.mercs = a, this.logger.debug(`Mercs: ${a}`);
      let g = i.mercs2ViewpointAsync(a);
      const c = i.mapID;
      this.mercBuffer.buffer[c] && (this.logger.debug("To: Use buffer"), g = new Promise((u, h) => {
        u(this.mercBuffer.buffer[c]);
      })), g.then((u) => {
        this.logger.debug(
          `To: Center: ${u[0]} Zoom: ${u[1]} Rotation: ${u[2]}`
        ), this.logger.debug(`To: ${i.mapID}`), this.mercBuffer.buffer[i.mapID] = Bs(u, 10), r(u);
      }).catch((u) => {
        if (s) s(u);
        else throw u;
      });
    }).catch((a) => {
      if (s) s(a);
      else throw a;
    });
  }
  remove() {
    typeof document < "u" && document.removeEventListener("visibilitychange", this.__visibilityHandler), this.__resizeObserver && (this.__resizeObserver.disconnect(), this.__resizeObserver = null), this.__viewportOffset?.dispose(), this.__viewportOffset = void 0, this.__attribution?.dispose(), this.__attribution = void 0, this.mapObject?.setTarget?.(void 0), this.backMap?.setTarget?.(void 0), this.maplibreMap?.remove?.(), this.mapboxMap && this.mapboxMap.remove(), this.mapDivDocument.innerHTML = "", this.mapDivDocument.classList.remove("maplat");
  }
}
const Cp = [
  "appid",
  "mapDiv",
  "mapDivDocument",
  "enableCache",
  "noRotate",
  "alwaysGpsOn",
  "overlay",
  "googleApiKey",
  "restoreSession",
  "initialRestore",
  "uiHooks",
  "fakeGps",
  "fakeRadius"
];
(function() {
  const t = di.prototype;
  for (const e of Cp) {
    const i = Object.getOwnPropertyDescriptor(t, e);
    if (!i?.get) throw new Error(`MaplatApp: missing getter for startup field "${e}"`);
    const r = `__${e}`;
    Object.defineProperty(t, e, {
      configurable: !0,
      enumerable: !1,
      get: i.get,
      set(s) {
        if (!this.__startupLocked) {
          this[r] = s;
          return;
        }
        this.__startupWarner || (this.__startupWarner = RA()), this.__startupWarner(
          e,
          `MaplatApp: "${e}" is fixed at startup and cannot be changed after construction; the assignment was ignored.`
        );
      }
    });
  }
})();
di.createObject = function(n) {
  return new Promise((t) => {
    const e = new di(n);
    e.waitReady.then(() => {
      t(e);
    });
  });
};
if (typeof window < "u") {
  const n = {
    createObject: di.createObject
  };
  window.Maplat = n, window.MaplatApp = di, window.assets = fi;
}
export {
  Gt as CustomEvent,
  up as GPSErrorEvent,
  Ip as GPSRequestEvent,
  ii as GPSResultEvent,
  Cp as MAPLAT_APP_STARTUP_FIELDS,
  di as MaplatApp,
  Ze as MaplatMap,
  fi as assets,
  wp as buildSlideAttrs,
  Hn as createElement,
  cp as defaultPinIcon,
  Ld as escapeAttr,
  HC as mapSourceFactory,
  bp as mercToLngLat,
  Cc as sanitizeHtml,
  Bd as toPlainText
};
//# sourceMappingURL=maplat_core.js.map
