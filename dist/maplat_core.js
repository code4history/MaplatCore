import { transform as $t, toLonLat as zi, Projection as Ka, addProjection as Br, addCoordinateTransforms as ki, getTransform as cr, identityTransform as lr } from "ol/proj";
import { View as lA, Map as Ja, Feature as qa } from "ol";
import { Vector as fi, Group as $a, Tile as Ir } from "ol/layer";
import { XYZ as IA, Google as tg, Vector as di } from "ol/source";
import { Style as ue, Icon as En, Stroke as Nr, Fill as Gr } from "ol/style";
class Te {
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
let Nt = class extends Te {
  detail;
  constructor(t, e) {
    super(t), this.detail = e;
  }
};
const eg = ["ALL", "OFF"], We = {
  ALL: -99,
  DEBUG: -1,
  INFO: 0,
  WARN: 1,
  ERROR: 2,
  OFF: 99
};
class Zs {
  constructor(t = We.INFO) {
    this.level = t, this.make();
  }
  level;
  make() {
    const t = Object.keys(We).filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (e) => !eg.includes(e)
    );
    for (const e of t) {
      const n = We[e], r = e.toLowerCase();
      this[r] = this.level <= n ? console.log : () => {
      };
    }
  }
}
function ng(i, t) {
  return i.isMapbox() ? t.mapboxMap ? (i.mapboxMap = t.mapboxMap, !0) : (t.warn?.(
    "Mapbox GL JS is not available; skipping Mapbox source:",
    i.mapID
  ), !1) : typeof i.isMapLibre == "function" && i.isMapLibre() ? t.maplibreMap ? (i.maplibreMap = t.maplibreMap, !0) : (t.warn?.(
    "MapLibre GL JS is not available; skipping MapLibre source:",
    i.mapID
  ), !1) : !0;
}
const Wn = [
  "title",
  "officialTitle",
  "author",
  "createdAt",
  "era",
  "contributor",
  "mapper",
  "license",
  "dataLicense",
  // m6-t2: ライセンスの自由記述欄。META_KEYS_OPTION と lockstep (同じ index) で足す。
  "licenseNote",
  "dataLicenseNote",
  "attr",
  "dataAttr",
  "reference",
  "description"
], ig = [
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
function CA() {
  const i = /* @__PURE__ */ new Set();
  return (t, e) => {
    i.has(t) || (i.add(t), console.warn(e));
  };
}
let Vs = !1;
const rg = "MaplatApp: the MaplatApp class is deprecated and will be removed in 2.0. Use the <maplat-app> element (@maplat/core/element) instead.";
function sg() {
  Vs || (Vs = !0, console.warn(rg));
}
function Bn(i) {
  const t = document, e = t.createDocumentFragment(), n = [];
  i = i.replace(/(<\/?)d([ >])/g, "$1div$2").replace(/(<\/?)s([ >])/g, "$1span$2").replace(/ din="/g, ' data-i18n="').replace(/ dinh="/g, ' data-i18n-html="').replace(/ c="/g, ' class="');
  const r = e.appendChild(t.createElement("div"));
  r.innerHTML = i;
  for (let s = 0; s < r.childNodes.length; s++) {
    const o = r.childNodes[s];
    if (o.nodeName && o.nodeName.toLowerCase() === "script") {
      const A = t.createElement("script");
      o.type && (A.type = o.type), o.src ? A.src = o.src : A.text = o.text, n[s] = A;
    } else
      n[s] = o;
  }
  return n;
}
function pi(i) {
  for (; !(i <= 180 && i > -180); ) {
    const t = i > 0 ? -1 : 1;
    i = i + t * 360;
  }
  return i;
}
function Ws(i) {
  if (!i) return;
  const t = {
    mapID: i.mapID
  };
  for (let e = 0; e < Wn.length; e++) {
    const n = Wn[e];
    i[n] && (t[n] = i[n]);
  }
  return t;
}
function he(i) {
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
  return Object.keys(t).reduce((e, n) => {
    if (e[n] !== void 0)
      throw new Error(`Invalid Maplat option key: ${n}. Use "${t[n]}" instead.`);
    return e;
  }, i);
}
class uA {
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
function og(i, t, e) {
  let n, r;
  e = e || hA;
  let s = 0, o = i.length, A = !1;
  for (; s < o; )
    n = s + (o - s >> 1), r = +e(i[n], t), r < 0 ? s = n + 1 : (o = n, A = !r);
  return A ? s : ~s;
}
function hA(i, t) {
  return i > t ? 1 : i < t ? -1 : 0;
}
function fA(i, t, e) {
  if (i[0] <= t)
    return 0;
  const n = i.length;
  if (t <= i[n - 1])
    return n - 1;
  if (typeof e == "function") {
    for (let r = 1; r < n; ++r) {
      const s = i[r];
      if (s === t)
        return r;
      if (s < t)
        return e(t, i[r - 1], s) > 0 ? r - 1 : r;
    }
    return n - 1;
  }
  if (e > 0) {
    for (let r = 1; r < n; ++r)
      if (i[r] < t)
        return r - 1;
    return n - 1;
  }
  if (e < 0) {
    for (let r = 1; r < n; ++r)
      if (i[r] <= t)
        return r;
    return n - 1;
  }
  for (let r = 1; r < n; ++r) {
    if (i[r] == t)
      return r;
    if (i[r] < t)
      return i[r - 1] - t < t - i[r] ? r - 1 : r;
  }
  return n - 1;
}
function dA(i, t) {
  const e = Array.isArray(t) ? t : [t], n = e.length;
  for (let r = 0; r < n; r++)
    i[i.length] = e[r];
}
function Ag(i, t) {
  const e = i.length;
  if (e !== t.length)
    return !1;
  for (let n = 0; n < e; n++)
    if (i[n] !== t[n])
      return !1;
  return !0;
}
function Wt() {
  throw new Error("Unimplemented abstract method.");
}
let ag = 0;
function gg(i) {
  const t = (
    /** @type {{ol_uid: (string|undefined)}} */
    /** @type {unknown} */
    i
  );
  return t.ol_uid || (t.ol_uid = String(++ag));
}
function cg() {
  return !0;
}
function Xi() {
  return !1;
}
function Fr() {
}
function lg(i) {
  let t, e, n;
  return function() {
    const r = Array.prototype.slice.call(arguments);
    return (!e || this !== n || !Ag(r, e)) && (n = this, e = r, t = i.apply(this, r)), t;
  };
}
function pA(i) {
  for (const t in i)
    delete i[t];
}
function Ig(i) {
  let t;
  for (t in i)
    return !1;
  return !t;
}
class mA extends uA {
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
    const n = this.listeners_ || (this.listeners_ = {}), r = n[t] || (n[t] = []);
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
    const e = typeof t == "string", n = e ? t : t.type, r = this.listeners_ && this.listeners_[n];
    if (!r)
      return;
    const s = e ? new Te(t) : (
      /** @type {Event} */
      t
    );
    s.target || (s.target = this.eventTarget_ || this);
    const o = this.dispatching_ || (this.dispatching_ = {}), A = this.pendingRemovals_ || (this.pendingRemovals_ = {});
    n in o || (o[n] = 0, A[n] = 0), ++o[n];
    let a;
    for (let g = 0, I = r.length; g < I; ++g)
      if ("handleEvent" in r[g] ? a = /** @type {import("../events.js").ListenerObject} */
      r[g].handleEvent(s) : a = /** @type {import("../events.js").ListenerFunction} */
      r[g].call(this, s), a === !1 || s.propagationStopped) {
        a = !1;
        break;
      }
    if (--o[n] === 0) {
      let g = A[n];
      for (delete A[n]; g--; )
        this.removeEventListener(n, Fr);
      delete o[n];
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
    this.listeners_ && pA(this.listeners_);
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
    const n = this.listeners_[t];
    if (!n)
      return;
    const r = n.indexOf(e);
    r !== -1 && (this.pendingRemovals_ && t in this.pendingRemovals_ ? (n[r] = Fr, ++this.pendingRemovals_[t]) : (n.splice(r, 1), n.length === 0 && delete this.listeners_[t]));
  }
}
lA.prototype.getDecimalZoom = function() {
  const i = this.getResolution(), t = (
    // NOTE: `resolution` maybe `undefined`
    // NOTE: `offset` maybe `NaN`
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Math.log(this.maxResolution_ / i) / Math.log(2)
  );
  return t !== void 0 ? this.minZoom_ + t : t;
};
const Ot = {
  UNKNOWN: 0,
  INTERSECTING: 1,
  ABOVE: 2,
  RIGHT: 4,
  BELOW: 8,
  LEFT: 16
};
function rs(i, t, e) {
  let n, r;
  return t < i[0] ? n = i[0] - t : i[2] < t ? n = t - i[2] : n = 0, e < i[1] ? r = i[1] - e : i[3] < e ? r = e - i[3] : r = 0, n * n + r * r;
}
function Cg(i, t, e) {
  return i[0] <= t && t <= i[2] && i[1] <= e && e <= i[3];
}
function Hs(i, t) {
  const e = i[0], n = i[1], r = i[2], s = i[3], o = t[0], A = t[1];
  let a = Ot.UNKNOWN;
  return o < e ? a = a | Ot.LEFT : o > r && (a = a | Ot.RIGHT), A < n ? a = a | Ot.BELOW : A > s && (a = a | Ot.ABOVE), a === Ot.UNKNOWN && (a = Ot.INTERSECTING), a;
}
function yA() {
  return [1 / 0, 1 / 0, -1 / 0, -1 / 0];
}
function Zi(i, t, e, n, r) {
  return r ? (r[0] = i, r[1] = t, r[2] = e, r[3] = n, r) : [i, t, e, n];
}
function vA(i) {
  return Zi(1 / 0, 1 / 0, -1 / 0, -1 / 0, i);
}
function ug(i, t) {
  const e = i[0], n = i[1];
  return Zi(e, n, e, n, t);
}
function hg(i, t, e, n, r) {
  const s = vA(r);
  return wA(s, i, t, e, n);
}
function wA(i, t, e, n, r) {
  for (; e < n; e += r)
    fg(i, t[e], t[e + 1]);
  return i;
}
function fg(i, t, e) {
  i[0] = Math.min(i[0], t), i[1] = Math.min(i[1], e), i[2] = Math.max(i[2], t), i[3] = Math.max(i[3], e);
}
function bA(i, t) {
  let e;
  return e = t(dg(i)), e || (e = t(pg(i)), e) || (e = t(wg(i)), e) || (e = t(vg(i)), e) ? e : !1;
}
function dg(i) {
  return [i[0], i[1]];
}
function pg(i) {
  return [i[2], i[1]];
}
function _i(i) {
  return [(i[0] + i[2]) / 2, (i[1] + i[3]) / 2];
}
function mg(i, t, e, n, r) {
  const [s, o, A, a, g, I, l, u] = yg(
    i,
    t,
    e,
    n
  );
  return Zi(
    Math.min(s, A, g, l),
    Math.min(o, a, I, u),
    Math.max(s, A, g, l),
    Math.max(o, a, I, u),
    r
  );
}
function yg(i, t, e, n) {
  const r = t * n[0] / 2, s = t * n[1] / 2, o = Math.cos(e), A = Math.sin(e), a = r * o, g = r * A, I = s * o, l = s * A, u = i[0], p = i[1];
  return [
    u - a + l,
    p - g - I,
    u - a - l,
    p - g + I,
    u + a - l,
    p + g + I,
    u + a + l,
    p + g - I,
    u - a + l,
    p - g - I
  ];
}
function Hn(i) {
  return i[3] - i[1];
}
function vg(i) {
  return [i[0], i[3]];
}
function wg(i) {
  return [i[2], i[3]];
}
function ss(i) {
  return i[2] - i[0];
}
function os(i, t) {
  return i[0] <= t[2] && i[2] >= t[0] && i[1] <= t[3] && i[3] >= t[1];
}
function EA(i) {
  return i[2] < i[0] || i[3] < i[1];
}
function bg(i, t) {
  return t ? (t[0] = i[0], t[1] = i[1], t[2] = i[2], t[3] = i[3], t) : i;
}
function Eg(i, t, e) {
  let n = !1;
  const r = Hs(i, t), s = Hs(i, e);
  if (r === Ot.INTERSECTING || s === Ot.INTERSECTING)
    n = !0;
  else {
    const o = i[0], A = i[1], a = i[2], g = i[3], I = t[0], l = t[1], u = e[0], p = e[1], m = (p - l) / (u - I);
    let c, C;
    s & Ot.ABOVE && !(r & Ot.ABOVE) && (c = u - (p - g) / m, n = c >= o && c <= a), !n && s & Ot.RIGHT && !(r & Ot.RIGHT) && (C = p - (u - a) * m, n = C >= A && C <= g), !n && s & Ot.BELOW && !(r & Ot.BELOW) && (c = u - (p - A) / m, n = c >= o && c <= a), !n && s & Ot.LEFT && !(r & Ot.LEFT) && (C = p - (u - o) * m, n = C >= A && C <= g);
  }
  return n;
}
const xg = {
  /**
   * Triggered when a property is changed.
   * @event module:ol/Object.ObjectEvent#propertychange
   * @api
   */
  PROPERTYCHANGE: "propertychange"
};
function pn(i, t, e, n, r) {
  if (r) {
    const o = e;
    e = function(A) {
      return i.removeEventListener(t, e), o.call(n ?? this, A);
    };
  } else n && n !== i && (e = e.bind(n));
  const s = {
    target: i,
    type: t,
    listener: e
  };
  return i.addEventListener(t, e), s;
}
function Qs(i, t, e, n) {
  return pn(i, t, e, n, !0);
}
function Vn(i) {
  i && i.target && (i.target.removeEventListener(i.type, i.listener), pA(i));
}
const Fe = {
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
class Vi extends mA {
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
    ++this.revision_, this.dispatchEvent(Fe.CHANGE);
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
      const n = t.length, r = new Array(n);
      for (let s = 0; s < n; ++s)
        r[s] = pn(this, t[s], e);
      return r;
    }
    return pn(
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
    let n;
    if (Array.isArray(t)) {
      const r = t.length;
      n = new Array(r);
      for (let s = 0; s < r; ++s)
        n[s] = Qs(this, t[s], e);
    } else
      n = Qs(
        this,
        /** @type {string} */
        t,
        e
      );
    return e.ol_key = n, n;
  }
  /**
   * Unlisten for a certain type of event.
   * @param {string|Array<string>} type Type.
   * @param {function((Event|import("./events/Event.js").default)): ?} listener Listener.
   * @protected
   */
  unInternal(t, e) {
    const n = (
      /** @type {ListenerWithKey} */
      e.ol_key
    );
    if (n)
      Mg(n);
    else if (Array.isArray(t))
      for (let r = 0, s = t.length; r < s; ++r)
        this.removeEventListener(t[r], e);
    else
      this.removeEventListener(t, e);
  }
}
Vi.prototype.on;
Vi.prototype.once;
Vi.prototype.un;
function Mg(i) {
  if (Array.isArray(i))
    for (let t = 0, e = i.length; t < e; ++t)
      Vn(i[t]);
  else
    Vn(
      /** @type {import("./events.js").EventsKey} */
      i
    );
}
class Ys extends Te {
  /**
   * @param {string} type The event type.
   * @param {string} key The property name.
   * @param {*} oldValue The old value for `key`.
   */
  constructor(t, e, n) {
    super(t), this.key = e, this.oldValue = n;
  }
}
class Tn extends Vi {
  /**
   * @param {NoInfer<Properties>} [values] An object with key-value pairs.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, gg(this), this.values_ = null, t !== void 0 && this.setProperties(t);
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
    let n;
    n = `change:${t}`, this.hasListener(n) && this.dispatchEvent(new Ys(n, t, e)), n = xg.PROPERTYCHANGE, this.hasListener(n) && this.dispatchEvent(new Ys(n, t, e));
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
  set(t, e, n) {
    const r = (
      /** @type {Object<string, *>} */
      this.values_ || (this.values_ = /** @type {Partial<NoInfer<Properties>>} */
      {})
    );
    if (n)
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
    for (const n in t)
      this.set(n, t[n], e);
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
      const n = this.values_[t];
      delete this.values_[t], Ig(this.values_) && (this.values_ = null), e || this.notify(t, n);
    }
  }
}
function Sg(...i) {
  console.warn(...i);
}
function ae(i, t, e) {
  return Math.min(Math.max(i, t), e);
}
function Tg(i, t, e, n, r, s) {
  const o = r - e, A = s - n;
  if (o !== 0 || A !== 0) {
    const a = ((i - e) * o + (t - n) * A) / (o * o + A * A);
    a > 1 ? (e = r, n = s) : a > 0 && (e += o * a, n += A * a);
  }
  return mn(i, t, e, n);
}
function mn(i, t, e, n) {
  const r = e - i, s = n - t;
  return r * r + s * s;
}
function Ks(i) {
  return i * 180 / Math.PI;
}
function yn(i) {
  return i * Math.PI / 180;
}
function jr(i, t) {
  const e = i % t;
  return e * t < 0 ? e + t : e;
}
function As(i, t, e) {
  return i + e * (t - i);
}
function Ur(i, t, e) {
  if (i >= t && i < e)
    return i;
  const n = e - t;
  return ((i - t) % n + n) % n + t;
}
function Rg(i, t) {
  return i[0] += +t[0], i[1] += +t[1], i;
}
function Oi(i, t) {
  let e = !0;
  for (let n = i.length - 1; n >= 0; --n)
    if (i[n] != t[n]) {
      e = !1;
      break;
    }
  return e;
}
function as(i, t) {
  const e = Math.cos(t), n = Math.sin(t), r = i[0] * e - i[1] * n, s = i[1] * e + i[0] * n;
  return i[0] = r, i[1] = s, i;
}
function Pg(i, t) {
  return i[0] *= t, i[1] *= t, i;
}
const xA = {
  // use the radius of the Normal sphere
  radians: 6370997 / (2 * Math.PI),
  degrees: 2 * Math.PI * 6370997 / 360,
  ft: 0.3048,
  m: 1,
  "us-ft": 1200 / 3937
};
class Qn {
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
    return this.metersPerUnit_ || xA[this.units_];
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
const ii = 6378137, dn = Math.PI * ii, kg = [-dn, -dn, dn, dn], _g = [-180, -85, 180, 85], mi = ii * Math.log(Math.tan(Math.PI / 2));
class An extends Qn {
  /**
   * @param {string} code Code.
   */
  constructor(t) {
    super({
      code: t,
      units: "m",
      extent: kg,
      global: !0,
      worldExtent: _g,
      getPointResolution: function(e, n) {
        return e / Math.cosh(n[1] / ii);
      }
    });
  }
}
const Js = [
  new An("EPSG:3857"),
  new An("EPSG:102100"),
  new An("EPSG:102113"),
  new An("EPSG:900913"),
  new An("http://www.opengis.net/def/crs/EPSG/0/3857"),
  new An("http://www.opengis.net/gml/srs/epsg.xml#3857")
];
function Og(i, t, e, n) {
  const r = i.length;
  e = e !== void 0 && e > 1 ? e : 2, n = n ?? e, t === void 0 && (e > 2 ? t = i.slice() : t = new Array(r));
  for (let s = 0; s < r; s += n) {
    t[s] = dn * i[s] / 180;
    let o = ii * Math.log(Math.tan(Math.PI * (+i[s + 1] + 90) / 360));
    o > mi ? o = mi : o < -mi && (o = -mi), t[s + 1] = o;
  }
  return t;
}
function Lg(i, t, e, n) {
  const r = i.length;
  e = e !== void 0 && e > 1 ? e : 2, n = n ?? e, t === void 0 && (e > 2 ? t = i.slice() : t = new Array(r));
  for (let s = 0; s < r; s += n)
    t[s] = 180 * i[s] / dn, t[s + 1] = 360 * Math.atan(Math.exp(i[s + 1] / ii)) / Math.PI - 90;
  return t;
}
const Dg = 6378137, qs = [-180, -90, 180, 90], Bg = Math.PI * Dg / 180;
class Ue extends Qn {
  /**
   * @param {string} code Code.
   * @param {string} [axisOrientation] Axis orientation.
   */
  constructor(t, e) {
    super({
      code: t,
      units: "degrees",
      extent: qs,
      axisOrientation: e,
      global: !0,
      metersPerUnit: Bg,
      worldExtent: qs
    });
  }
}
const $s = [
  new Ue("CRS:84"),
  new Ue("EPSG:4326", "neu"),
  new Ue("urn:ogc:def:crs:OGC:1.3:CRS84"),
  new Ue("urn:ogc:def:crs:OGC:2:84"),
  new Ue("http://www.opengis.net/def/crs/OGC/1.3/CRS84"),
  new Ue("http://www.opengis.net/gml/srs/epsg.xml#4326", "neu"),
  new Ue("http://www.opengis.net/def/crs/EPSG/0/4326", "neu")
];
let zr = {};
function Ng(i) {
  return zr[i] || zr[i.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/, "EPSG:$3")] || null;
}
function Gg(i, t) {
  zr[i] = t;
}
let vn = {};
function Yn(i, t, e) {
  const n = i.getCode(), r = t.getCode();
  n in vn || (vn[n] = {}), vn[n][r] = e;
}
function Cr(i, t) {
  return i in vn && t in vn[i] ? vn[i][t] : null;
}
const Li = 0.9996, re = 669438e-8, Wi = re * re, Hi = Wi * re, He = re / (1 - re), to = Math.sqrt(1 - re), xn = (1 - to) / (1 + to), MA = xn * xn, gs = MA * xn, cs = gs * xn, SA = cs * xn, TA = 1 - re / 4 - 3 * Wi / 64 - 5 * Hi / 256, Fg = 3 * re / 8 + 3 * Wi / 32 + 45 * Hi / 1024, jg = 15 * Wi / 256 + 45 * Hi / 1024, Ug = 35 * Hi / 3072, zg = 3 / 2 * xn - 27 / 32 * gs + 269 / 512 * SA, Xg = 21 / 16 * MA - 55 / 32 * cs, Zg = 151 / 96 * gs - 417 / 128 * SA, Vg = 1097 / 512 * cs, Di = 6378137;
function Wg(i, t, e) {
  const n = i - 5e5, o = (e.north ? t : t - 1e7) / Li / (Di * TA), A = o + zg * Math.sin(2 * o) + Xg * Math.sin(4 * o) + Zg * Math.sin(6 * o) + Vg * Math.sin(8 * o), a = Math.sin(A), g = a * a, I = Math.cos(A), l = a / I, u = l * l, p = u * u, m = 1 - re * g, c = Math.sqrt(1 - re * g), C = Di / c, h = (1 - re) / m, d = He * I ** 2, S = d * d, w = n / (C * Li), f = w * w, y = f * w, v = y * w, x = v * w, M = x * w, E = A - l / h * (f / 2 - v / 24 * (5 + 3 * u + 10 * d - 4 * S - 9 * He)) + M / 720 * (61 + 90 * u + 298 * d + 45 * p - 252 * He - 3 * S);
  let T = (w - y / 6 * (1 + 2 * u + d) + x / 120 * (5 - 2 * d + 28 * u - 3 * S + 8 * He + 24 * p)) / I;
  return T = Ur(
    T + yn(RA(e.number)),
    -Math.PI,
    Math.PI
  ), [Ks(T), Ks(E)];
}
const eo = -80, no = 84, Hg = -180, Qg = 180;
function Yg(i, t, e) {
  i = Ur(i, Hg, Qg), t < eo ? t = eo : t > no && (t = no);
  const n = yn(t), r = Math.sin(n), s = Math.cos(n), o = r / s, A = o * o, a = A * A, g = yn(i), I = RA(e.number), l = yn(I), u = Di / Math.sqrt(1 - re * r ** 2), p = He * s ** 2, m = s * Ur(g - l, -Math.PI, Math.PI), c = m * m, C = c * m, h = C * m, d = h * m, S = d * m, w = Di * (TA * n - Fg * Math.sin(2 * n) + jg * Math.sin(4 * n) - Ug * Math.sin(6 * n)), f = Li * u * (m + C / 6 * (1 - A + p) + d / 120 * (5 - 18 * A + a + 72 * p - 58 * He)) + 5e5;
  let y = Li * (w + u * o * (c / 2 + h / 24 * (5 - A + 9 * p + 4 * p ** 2) + S / 720 * (61 - 58 * A + a + 600 * p - 330 * He)));
  return e.north || (y += 1e7), [f, y];
}
function RA(i) {
  return (i - 1) * 6 - 180 + 3;
}
const Kg = [
  /^EPSG:(\d+)$/,
  /^urn:ogc:def:crs:EPSG::(\d+)$/,
  /^http:\/\/www\.opengis\.net\/def\/crs\/EPSG\/0\/(\d+)$/
];
function PA(i) {
  let t = 0;
  for (const r of Kg) {
    const s = i.match(r);
    if (s) {
      t = parseInt(s[1]);
      break;
    }
  }
  if (!t)
    return null;
  let e = 0, n = !1;
  return t > 32700 && t < 32761 ? e = t - 32700 : t > 32600 && t < 32661 && (n = !0, e = t - 32600), e ? { number: e, north: n } : null;
}
function io(i, t) {
  return function(e, n, r, s) {
    const o = e.length;
    r = r !== void 0 && r > 1 ? r : 2, s = s ?? r, n || (r > 2 ? n = e.slice() : n = new Array(o));
    for (let A = 0; A < o; A += s) {
      const a = e[A], g = e[A + 1], I = i(a, g, t);
      n[A] = I[0], n[A + 1] = I[1];
    }
    return n;
  };
}
function Jg(i) {
  return PA(i) ? new Qn({ code: i, units: "m" }) : null;
}
function qg(i) {
  const t = PA(i.getCode());
  return t ? {
    forward: io(Yg, t),
    inverse: io(Wg, t)
  } : null;
}
const $g = [qg], tc = [Jg];
let Xr = !0;
function ec(i) {
  Xr = !1;
}
function kA(i, t) {
  if (t !== void 0) {
    for (let e = 0, n = i.length; e < n; ++e)
      t[e] = i[e];
    t = t;
  } else
    t = i.slice();
  return t;
}
function Zr(i) {
  Gg(i.getCode(), i), Yn(i, i, kA);
}
function nc(i) {
  i.forEach(Zr);
}
function Kn(i) {
  if (typeof i != "string")
    return i !== void 0 ? i : null;
  const t = Ng(i);
  if (t)
    return t;
  for (const e of tc) {
    const n = e(i);
    if (n)
      return n;
  }
  return null;
}
function ro(i) {
  nc(i), i.forEach(function(t) {
    i.forEach(function(e) {
      t !== e && Yn(t, e, kA);
    });
  });
}
function ic(i, t, e, n) {
  i.forEach(function(r) {
    t.forEach(function(s) {
      Yn(r, s, e), Yn(s, r, n);
    });
  });
}
function ls(i, t) {
  return i ? typeof i == "string" ? Kn(i) : (
    /** @type {Projection} */
    i
  ) : Kn(t);
}
function rc(i, t) {
  if (!i || !t)
    return null;
  const e = i.getCode(), n = t.getCode();
  let r = Cr(e, n);
  if (r)
    return r;
  let s = null, o = null;
  for (const a of $g)
    s || (s = a(i)), o || (o = a(t));
  if (!s && !o)
    return null;
  const A = "EPSG:4326";
  if (!o && s) {
    const a = Cr(A, n);
    a && (r = ur(
      s.inverse,
      a
    ));
  } else if (!s && o) {
    const a = Cr(e, A);
    a && (r = ur(
      a,
      o.forward
    ));
  } else s && o && (r = ur(
    s.inverse,
    o.forward
  ));
  return r && (Zr(i), Zr(t), Yn(i, t, r)), r;
}
function ur(i, t) {
  return function(e, n, r, s) {
    return n = i(e, n, r, s), t(n, n, r, s);
  };
}
function so(i, t) {
  const e = Kn(i), n = Kn(t);
  return rc(e, n);
}
let sc = null;
function oc() {
  return sc;
}
function oo(i, t) {
  return i;
}
function _e(i, t) {
  return Xr && !Oi(i, [0, 0]) && i[0] >= -180 && i[0] <= 180 && i[1] >= -90 && i[1] <= 90 && (Xr = !1, Sg(
    "Call useGeographic() from ol/proj once to work with [longitude, latitude] coordinates."
  )), i;
}
function Ac(i, t) {
  return i;
}
function yi(i, t) {
  return i;
}
function ac() {
  ro(Js), ro($s), ic(
    $s,
    Js,
    Og,
    Lg
  );
}
ac();
function Ne(i, t) {
  if (!i)
    throw new Error(t);
}
const gc = [1, 0, 0, 1, 0, 0];
new Array(6);
function cc() {
  return gc.slice(0);
}
function lc(i, t, e, n, r, s, o, A) {
  const a = Math.sin(s), g = Math.cos(s);
  return i[0] = n * g, i[1] = r * a, i[2] = -n * a, i[3] = r * g, i[4] = o * n * g - A * n * a + t, i[5] = o * r * a + A * r * g + e, i;
}
function Ic(i, t, e, n, r, s, o) {
  s = s || [], o = o || 2;
  let A = 0;
  for (let a = t; a < e; a += n) {
    const g = i[a], I = i[a + 1];
    s[A++] = r[0] * g + r[2] * I + r[4], s[A++] = r[1] * g + r[3] * I + r[5];
    for (let l = 2; l < o; l++)
      s[A++] = i[a + l];
  }
  return s && s.length != A && (s.length = A), s;
}
function _A(i, t, e, n, r, s, o) {
  o = o || [];
  const A = Math.cos(r), a = Math.sin(r), g = s[0], I = s[1];
  let l = 0;
  for (let u = t; u < e; u += n) {
    const p = i[u] - g, m = i[u + 1] - I;
    o[l++] = g + p * A - m * a, o[l++] = I + p * a + m * A;
    for (let c = u + 2; c < u + n; ++c)
      o[l++] = i[c];
  }
  return o && o.length != l && (o.length = l), o;
}
function Cc(i, t, e, n, r, s, o, A) {
  A = A || [];
  const a = o[0], g = o[1];
  let I = 0;
  for (let l = t; l < e; l += n) {
    const u = i[l] - a, p = i[l + 1] - g;
    A[I++] = a + r * u, A[I++] = g + s * p;
    for (let m = l + 2; m < l + n; ++m)
      A[I++] = i[m];
  }
  return A && A.length != I && (A.length = I), A;
}
function uc(i, t, e, n, r, s, o) {
  o = o || [];
  let A = 0;
  for (let a = t; a < e; a += n) {
    o[A++] = i[a] + r, o[A++] = i[a + 1] + s;
    for (let g = a + 2; g < a + n; ++g)
      o[A++] = i[g];
  }
  return o && o.length != A && (o.length = A), o;
}
const Ao = cc(), hc = [NaN, NaN];
class fc extends Tn {
  constructor() {
    super(), this.extent_ = yA(), this.extentRevision_ = -1, this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = 0, this.simplifyTransformedInternal = lg(
      (t, e, n) => {
        if (!n)
          return this.getSimplifiedGeometry(e);
        const r = this.clone();
        return r.applyTransform(n), r.getSimplifiedGeometry(e);
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
    return Wt();
  }
  /**
   * @abstract
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   */
  closestPointXY(t, e, n, r) {
    return Wt();
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   */
  containsXY(t, e) {
    return this.closestPointXY(t, e, hc, Number.MIN_VALUE) === 0;
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
    return Wt();
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
      (isNaN(e[0]) || isNaN(e[1])) && vA(e), this.extentRevision_ = this.getRevision();
    }
    return bg(this.extent_, t);
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
    Wt();
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
  scale(t, e, n) {
    Wt();
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
    return Wt();
  }
  /**
   * Get the type of this geometry.
   * @abstract
   * @return {Type} Geometry type.
   */
  getType() {
    return Wt();
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
    Wt();
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   */
  intersectsExtent(t) {
    return Wt();
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
    Wt();
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
    const n = Kn(t);
    if (!n)
      return this;
    const r = n.getUnits() == "tile-pixels" ? (
      /**
       * @param {Array<number>} inCoordinates Input coordinates.
       * @param {Array<number>} outCoordinates Output coordinates.
       * @param {number} stride Stride.
       * @return {Array<number>} Output coordinates.
       */
      function(s, o, A) {
        const a = n.getExtent(), g = n.getWorldExtent(), I = Hn(g) / Hn(a);
        lc(
          Ao,
          g[0],
          g[3],
          I,
          -I,
          0,
          0,
          0
        );
        const l = Ic(
          s,
          0,
          s.length,
          A,
          Ao,
          o
        ), u = so(n, e);
        return u ? u(l, l, A) : l;
      }
    ) : so(n, e);
    return r && this.applyTransform(
      /** @type {import("../proj.js").TransformFunction} */
      r
    ), this;
  }
}
class ri extends fc {
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
    return hg(
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
    return Wt();
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
    this.stride = ao(t), this.layout = t, this.flatCoordinates = e;
  }
  /**
   * @abstract
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  setCoordinates(t, e) {
    Wt();
  }
  /**
   * @param {import("./Geometry.js").GeometryLayout|undefined} layout Layout.
   * @param {Array<*>} coordinates Coordinates.
   * @param {number} nesting Nesting.
   * @protected
   */
  setLayout(t, e, n) {
    let r;
    if (t)
      r = ao(t);
    else {
      for (let s = 0; s < n; ++s) {
        if (e.length === 0) {
          this.layout = "XY", this.stride = 2;
          return;
        }
        e = /** @type {Array<unknown>} */
        e[0];
      }
      r = e.length, t = dc(r);
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
    const n = this.getFlatCoordinates();
    if (n) {
      const r = this.getStride();
      _A(
        n,
        0,
        n.length,
        r,
        t,
        e,
        n
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
  scale(t, e, n) {
    e === void 0 && (e = t), n || (n = _i(this.getExtent()));
    const r = this.getFlatCoordinates();
    if (r) {
      const s = this.getStride();
      Cc(
        r,
        0,
        r.length,
        s,
        t,
        e,
        n,
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
    const n = this.getFlatCoordinates();
    if (n) {
      const r = this.getStride();
      uc(
        n,
        0,
        n.length,
        r,
        t,
        e,
        n
      ), this.changed();
    }
  }
}
function dc(i) {
  let t;
  return i == 2 ? t = "XY" : i == 3 ? t = "XYZ" : i == 4 && (t = "XYZM"), /** @type {import("./Geometry.js").GeometryLayout} */
  t;
}
function ao(i) {
  let t;
  return i == "XY" ? t = 2 : i == "XYZ" || i == "XYM" ? t = 3 : i == "XYZM" && (t = 4), /** @type {number} */
  t;
}
function OA(i, t, e, n) {
  for (let r = 0; r < n; ++r)
    i[t++] = e[r];
  return t;
}
function Is(i, t, e, n) {
  for (let r = 0, s = e.length; r < s; ++r) {
    const o = e[r];
    for (let A = 0; A < n; ++A)
      i[t++] = o[A];
  }
  return t;
}
function pc(i, t, e, n, r) {
  r = r || [];
  let s = 0;
  for (let o = 0, A = e.length; o < A; ++o) {
    const a = Is(
      i,
      t,
      e[o],
      n
    );
    r[s++] = a, t = a;
  }
  return r.length = s, r;
}
class Cs extends ri {
  /**
   * @param {!import("../coordinate.js").Coordinate} center Center.
   *     For internal use, flat coordinates in combination with `layout` and no
   *     `radius` are also accepted.
   * @param {number} [radius] Radius in units of the projection.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(t, e, n) {
    super(), n !== void 0 && e === void 0 ? this.setFlatCoordinates(n, t) : (e = e || 0, this.setCenterAndRadius(t, e, n));
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Circle} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new Cs(
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
  closestPointXY(t, e, n, r) {
    const s = this.flatCoordinates, o = t - s[0], A = e - s[1], a = o * o + A * A;
    if (a < r) {
      if (a === 0)
        for (let g = 0; g < this.stride; ++g)
          n[g] = s[g];
      else {
        const g = this.getRadius() / Math.sqrt(a);
        n[0] = s[0] + g * o, n[1] = s[1] + g * A;
        for (let I = 2; I < this.stride; ++I)
          n[I] = s[I];
      }
      return n.length = this.stride, a;
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
    const n = this.flatCoordinates, r = t - n[0], s = e - n[1];
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
    const e = this.flatCoordinates, n = e[this.stride] - e[0];
    return Zi(
      e[0] - n,
      e[1] - n,
      e[0] + n,
      e[1] + n,
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
    if (os(t, e)) {
      const n = this.getCenter();
      return t[0] <= n[0] && t[2] >= n[0] || t[1] <= n[1] && t[3] >= n[1] ? !0 : bA(t, this.intersectsCoordinate.bind(this));
    }
    return !1;
  }
  /**
   * Set the center of the circle as {@link module:ol/coordinate~Coordinate coordinate}.
   * @param {import("../coordinate.js").Coordinate} center Center.
   * @api
   */
  setCenter(t) {
    const e = this.stride, n = this.flatCoordinates[e] - this.flatCoordinates[0], r = t.slice();
    r[e] = r[0] + n;
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
  setCenterAndRadius(t, e, n) {
    this.setLayout(n, t, 0), this.flatCoordinates || (this.flatCoordinates = []);
    const r = this.flatCoordinates;
    let s = OA(r, 0, t, this.stride);
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
    const n = this.getCenter(), r = this.getStride();
    this.setCenter(
      _A(n, 0, n.length, r, t, e, n)
    ), this.changed();
  }
}
function LA(i, t, e, n) {
  let r = 0;
  const s = i[e - n], o = i[e - n + 1];
  let A = 0, a = 0;
  for (; t < e; t += n) {
    const g = i[t] - s, I = i[t + 1] - o;
    r += a * g - A * I, A = g, a = I;
  }
  return r / 2;
}
function mc(i, t, e, n) {
  let r = 0;
  for (let s = 0, o = e.length; s < o; ++s) {
    const A = e[s];
    r += LA(i, t, A, n), t = A;
  }
  return r;
}
function go(i, t, e, n, r, s, o) {
  const A = i[t], a = i[t + 1], g = i[e] - A, I = i[e + 1] - a;
  let l;
  if (g === 0 && I === 0)
    l = t;
  else {
    const u = ((r - A) * g + (s - a) * I) / (g * g + I * I);
    if (u > 1)
      l = e;
    else if (u > 0) {
      for (let p = 0; p < n; ++p)
        o[p] = As(
          i[t + p],
          i[e + p],
          u
        );
      o.length = n;
      return;
    } else
      l = t;
  }
  for (let u = 0; u < n; ++u)
    o[u] = i[l + u];
  o.length = n;
}
function us(i, t, e, n, r) {
  let s = i[t], o = i[t + 1];
  for (t += n; t < e; t += n) {
    const A = i[t], a = i[t + 1], g = mn(s, o, A, a);
    g > r && (r = g), s = A, o = a;
  }
  return r;
}
function yc(i, t, e, n, r) {
  for (let s = 0, o = e.length; s < o; ++s) {
    const A = e[s];
    r = us(i, t, A, n, r), t = A;
  }
  return r;
}
function hs(i, t, e, n, r, s, o, A, a, g, I) {
  if (t == e)
    return g;
  let l, u;
  if (r === 0) {
    if (u = mn(
      o,
      A,
      i[t],
      i[t + 1]
    ), u < g) {
      for (l = 0; l < n; ++l)
        a[l] = i[t + l];
      return a.length = n, u;
    }
    return g;
  }
  I = I || [NaN, NaN];
  let p = t + n;
  for (; p < e; )
    if (go(
      i,
      p - n,
      p,
      n,
      o,
      A,
      I
    ), u = mn(o, A, I[0], I[1]), u < g) {
      for (g = u, l = 0; l < n; ++l)
        a[l] = I[l];
      a.length = n, p += n;
    } else
      p += n * Math.max(
        (Math.sqrt(u) - Math.sqrt(g)) / r | 0,
        1
      );
  if (s && (go(
    i,
    e - n,
    t,
    n,
    o,
    A,
    I
  ), u = mn(o, A, I[0], I[1]), u < g)) {
    for (g = u, l = 0; l < n; ++l)
      a[l] = I[l];
    a.length = n;
  }
  return g;
}
function vc(i, t, e, n, r, s, o, A, a, g, I) {
  I = I || [NaN, NaN];
  for (let l = 0, u = e.length; l < u; ++l) {
    const p = e[l];
    g = hs(
      i,
      t,
      p,
      n,
      r,
      s,
      o,
      A,
      a,
      g,
      I
    ), t = p;
  }
  return g;
}
function fs(i, t, e, n, r) {
  r = r !== void 0 ? r : [];
  let s = 0;
  for (let o = t; o < e; o += n)
    r[s++] = i.slice(o, o + n);
  return r.length = s, r;
}
function wc(i, t, e, n, r) {
  r = r !== void 0 ? r : [];
  let s = 0;
  for (let o = 0, A = e.length; o < A; ++o) {
    const a = e[o];
    r[s++] = fs(
      i,
      t,
      a,
      n,
      r[s]
    ), t = a;
  }
  return r.length = s, r;
}
function bc(i, t, e, n, r) {
  return !bA(
    r,
    /**
     * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
     * @return {boolean} Contains (x, y).
     */
    function(o) {
      return !Qe(
        i,
        t,
        e,
        n,
        o[0],
        o[1]
      );
    }
  );
}
function Qe(i, t, e, n, r, s) {
  let o = 0, A = i[e - n], a = i[e - n + 1];
  for (; t < e; t += n) {
    const g = i[t], I = i[t + 1];
    a <= s ? I > s && (g - A) * (s - a) - (r - A) * (I - a) > 0 && o++ : I <= s && (g - A) * (s - a) - (r - A) * (I - a) < 0 && o--, A = g, a = I;
  }
  return o !== 0;
}
function DA(i, t, e, n, r, s) {
  if (e.length === 0 || !Qe(i, t, e[0], n, r, s))
    return !1;
  for (let o = 1, A = e.length; o < A; ++o)
    if (Qe(i, e[o - 1], e[o], n, r, s))
      return !1;
  return !0;
}
function BA(i, t, e, n, r) {
  let s;
  for (t += n; t < e; t += n)
    if (s = r(
      i.slice(t - n, t),
      i.slice(t, t + n)
    ), s)
      return s;
  return !1;
}
function Qi(i, t, e, n, r, s) {
  return s = s ?? wA(yA(), i, t, e, n), os(r, s) ? s[0] >= r[0] && s[2] <= r[2] || s[1] >= r[1] && s[3] <= r[3] ? !0 : BA(
    i,
    t,
    e,
    n,
    /**
     * @param {import("../../coordinate.js").Coordinate} point1 Start point.
     * @param {import("../../coordinate.js").Coordinate} point2 End point.
     * @return {boolean} `true` if the segment and the extent intersect,
     *     `false` otherwise.
     */
    function(o, A) {
      return Eg(r, o, A);
    }
  ) : !1;
}
function Ec(i, t, e, n, r) {
  return !!(Qi(i, t, e, n, r) || Qe(
    i,
    t,
    e,
    n,
    r[0],
    r[1]
  ) || Qe(
    i,
    t,
    e,
    n,
    r[0],
    r[3]
  ) || Qe(
    i,
    t,
    e,
    n,
    r[2],
    r[1]
  ) || Qe(
    i,
    t,
    e,
    n,
    r[2],
    r[3]
  ));
}
function xc(i, t, e, n, r) {
  if (!Ec(i, t, e[0], n, r))
    return !1;
  if (e.length === 1)
    return !0;
  for (let s = 1, o = e.length; s < o; ++s)
    if (bc(
      i,
      e[s - 1],
      e[s],
      n,
      r
    ) && !Qi(
      i,
      e[s - 1],
      e[s],
      n,
      r
    ))
      return !1;
  return !0;
}
function NA(i, t, e, n, r, s, o) {
  const A = (e - t) / n;
  if (A < 3) {
    for (; t < e; t += n)
      s[o++] = i[t], s[o++] = i[t + 1];
    return o;
  }
  const a = new Array(A);
  a[0] = 1, a[A - 1] = 1;
  const g = [t, e - n];
  let I = 0;
  for (; g.length > 0; ) {
    const l = (
      /** @type {number} */
      g.pop()
    ), u = (
      /** @type {number} */
      g.pop()
    );
    let p = 0;
    const m = i[u], c = i[u + 1], C = i[l], h = i[l + 1];
    for (let d = u + n; d < l; d += n) {
      const S = i[d], w = i[d + 1], f = Tg(S, w, m, c, C, h);
      f > p && (I = d, p = f);
    }
    p > r && (a[(I - t) / n] = 1, u + n < I && g.push(u, I), I + n < l && g.push(I, l));
  }
  for (let l = 0; l < A; ++l)
    a[l] && (s[o++] = i[t + l * n], s[o++] = i[t + l * n + 1]);
  return o;
}
function an(i, t) {
  return t * Math.round(i / t);
}
function Mc(i, t, e, n, r, s, o) {
  if (t == e)
    return o;
  let A = an(i[t], r), a = an(i[t + 1], r);
  t += n, s[o++] = A, s[o++] = a;
  let g, I;
  do
    if (g = an(i[t], r), I = an(i[t + 1], r), t += n, t == e)
      return s[o++] = g, s[o++] = I, o;
  while (g == A && I == a);
  for (; t < e; ) {
    const l = an(i[t], r), u = an(i[t + 1], r);
    if (t += n, l == g && u == I)
      continue;
    const p = g - A, m = I - a, c = l - A, C = u - a;
    if (p * C == m * c && (p < 0 && c < p || p == c || p > 0 && c > p) && (m < 0 && C < m || m == C || m > 0 && C > m)) {
      g = l, I = u;
      continue;
    }
    s[o++] = g, s[o++] = I, A = g, a = I, g = l, I = u;
  }
  return s[o++] = g, s[o++] = I, o;
}
function Sc(i, t, e, n, r, s, o, A) {
  for (let a = 0, g = e.length; a < g; ++a) {
    const I = e[a];
    o = Mc(
      i,
      t,
      I,
      n,
      r,
      s,
      o
    ), A.push(o), t = I;
  }
  return o;
}
class Jn extends ri {
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
    return new Jn(this.flatCoordinates.slice(), this.layout);
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, n, r) {
    return r < rs(this.getExtent(), t, e) ? r : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      us(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), hs(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      this.maxDelta_,
      !0,
      t,
      e,
      n,
      r
    ));
  }
  /**
   * Return the area of the linear ring on projected plane.
   * @return {number} Area (on projected plane).
   * @api
   */
  getArea() {
    return LA(
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
    return fs(
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
    return e.length = NA(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      0
    ), new Jn(e, "XY");
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
    return Qi(
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
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = Is(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function Tc(i, t, e, n, r, s, o) {
  let A, a;
  const g = (e - t) / n;
  if (g === 1)
    A = t;
  else if (g === 2)
    A = t, a = r;
  else if (g !== 0) {
    let I = i[t], l = i[t + 1], u = 0;
    const p = [0];
    for (let C = t + n; C < e; C += n) {
      const h = i[C], d = i[C + 1];
      u += Math.sqrt((h - I) * (h - I) + (d - l) * (d - l)), p.push(u), I = h, l = d;
    }
    const m = r * u, c = og(p, m);
    c < 0 ? (a = (m - p[-c - 2]) / (p[-c - 1] - p[-c - 2]), A = t + (-c - 2) * n) : A = t + c * n;
  }
  o = o !== void 0 && o > 1 ? o : 2, s = s || new Array(o);
  for (let I = 0; I < o; ++I)
    s[I] = A === void 0 ? NaN : a === void 0 ? i[A + I] : As(i[A + I], i[A + n + I], a);
  return s;
}
function Rc(i, t, e, n, r, s) {
  if (e == t)
    return null;
  let o;
  if (r < i[t + n - 1])
    return s ? (o = i.slice(t, t + n), o[n - 1] = r, o) : null;
  if (i[e - 1] < r)
    return s ? (o = i.slice(e - n, e), o[n - 1] = r, o) : null;
  if (r == i[t + n - 1])
    return i.slice(t, t + n);
  let A = t / n, a = e / n;
  for (; A < a; ) {
    const u = A + a >> 1;
    r < i[(u + 1) * n - 1] ? a = u : A = u + 1;
  }
  const g = i[A * n - 1];
  if (r == g)
    return i.slice((A - 1) * n, (A - 1) * n + n);
  const I = i[(A + 1) * n - 1], l = (r - g) / (I - g);
  o = [];
  for (let u = 0; u < n - 1; ++u)
    o.push(
      As(
        i[(A - 1) * n + u],
        i[A * n + u],
        l
      )
    );
  return o.push(r), o;
}
function Pc(i, t, e, n) {
  let r = i[t], s = i[t + 1], o = 0;
  for (let A = t + n; A < e; A += n) {
    const a = i[A], g = i[A + 1];
    o += Math.sqrt((a - r) * (a - r) + (g - s) * (g - s)), r = a, s = g;
  }
  return o;
}
class Bi extends ri {
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
    dA(this.flatCoordinates, t), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!LineString} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new Bi(
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
  closestPointXY(t, e, n, r) {
    return r < rs(this.getExtent(), t, e) ? r : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      us(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), hs(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      this.maxDelta_,
      !1,
      t,
      e,
      n,
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
    return BA(
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
    return this.layout != "XYM" && this.layout != "XYZM" ? null : (e = e !== void 0 ? e : !1, Rc(
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
    return fs(
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
    return Tc(
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
    return Pc(
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
    return e.length = NA(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      0
    ), new Bi(e, "XY");
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
    return Qi(
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
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = Is(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
class qn extends ri {
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
    const t = new qn(this.flatCoordinates.slice(), this.layout);
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
  closestPointXY(t, e, n, r) {
    const s = this.flatCoordinates, o = mn(
      t,
      e,
      s[0],
      s[1]
    );
    if (o < r) {
      const A = this.stride;
      for (let a = 0; a < A; ++a)
        n[a] = s[a];
      return n.length = A, o;
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
    return ug(this.flatCoordinates, t);
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
    return Cg(t, this.flatCoordinates[0], this.flatCoordinates[1]);
  }
  /**
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 0), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = OA(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function kc(i, t, e, n, r, s, o) {
  let A, a, g, I, l, u, p;
  const m = r[s + 1], c = [];
  for (let d = 0, S = e.length; d < S; ++d) {
    const w = e[d];
    for (I = i[w - n], u = i[w - n + 1], A = t; A < w; A += n)
      l = i[A], p = i[A + 1], (m <= u && p <= m || u <= m && m <= p) && (g = (m - u) / (p - u) * (l - I) + I, c.push(g)), I = l, u = p;
  }
  let C = NaN, h = -1 / 0;
  for (c.sort(hA), I = c[0], A = 1, a = c.length; A < a; ++A) {
    l = c[A];
    const d = Math.abs(l - I);
    d > h && (g = (I + l) / 2, DA(i, t, e, n, g, m) && (C = g, h = d)), I = l;
  }
  return isNaN(C) && (C = r[s]), [C, m, h];
}
function _c(i, t, e, n) {
  for (; t < e - n; ) {
    for (let r = 0; r < n; ++r) {
      const s = i[t + r];
      i[t + r] = i[e - n + r], i[e - n + r] = s;
    }
    t += n, e -= n;
  }
}
function GA(i, t, e, n) {
  let r = 0, s = i[e - n], o = i[e - n + 1];
  for (; t < e; t += n) {
    const A = i[t], a = i[t + 1];
    r += (A - s) * (a + o), s = A, o = a;
  }
  return r === 0 ? void 0 : r > 0;
}
function Oc(i, t, e, n, r) {
  r = r !== void 0 ? r : !1;
  for (let s = 0, o = e.length; s < o; ++s) {
    const A = e[s], a = GA(
      i,
      t,
      A,
      n
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
function co(i, t, e, n, r) {
  r = r !== void 0 ? r : !1;
  for (let s = 0, o = e.length; s < o; ++s) {
    const A = e[s], a = GA(
      i,
      t,
      A,
      n
    );
    (s === 0 ? r && a || !r && !a : r && !a || !r && a) && _c(i, t, A, n), t = A;
  }
  return t;
}
class Ke extends ri {
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
  constructor(t, e, n) {
    super(), this.ends_ = [], this.flatInteriorPointRevision_ = -1, this.flatInteriorPoint_ = null, this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, this.orientedRevision_ = -1, this.orientedFlatCoordinates_ = null, e !== void 0 && n ? (this.setFlatCoordinates(
      e,
      /** @type {Array<number>} */
      t
    ), this.ends_ = n) : this.setCoordinates(
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
    this.flatCoordinates ? dA(this.flatCoordinates, t.getFlatCoordinates()) : this.flatCoordinates = t.getFlatCoordinates().slice(), this.ends_.push(this.flatCoordinates.length), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Polygon} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new Ke(
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
  closestPointXY(t, e, n, r) {
    return r < rs(this.getExtent(), t, e) ? r : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      yc(
        this.flatCoordinates,
        0,
        this.ends_,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), vc(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      this.maxDelta_,
      !0,
      t,
      e,
      n,
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
    return DA(
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
    return mc(
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
    return t !== void 0 ? (e = this.getOrientedFlatCoordinates().slice(), co(e, 0, this.ends_, this.stride, t)) : e = this.flatCoordinates, wc(e, 0, this.ends_, this.stride);
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
      const t = _i(this.getExtent());
      this.flatInteriorPoint_ = kc(
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
    return new qn(this.getFlatInteriorPoint(), "XYM");
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
    return t < 0 || this.ends_.length <= t ? null : new Jn(
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
    const t = this.layout, e = this.flatCoordinates, n = this.ends_, r = [];
    let s = 0;
    for (let o = 0, A = n.length; o < A; ++o) {
      const a = n[o], g = new Jn(
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
      Oc(t, 0, this.ends_, this.stride) ? this.orientedFlatCoordinates_ = t : (this.orientedFlatCoordinates_ = t.slice(), this.orientedFlatCoordinates_.length = co(
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
    const e = [], n = [];
    return e.length = Sc(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      Math.sqrt(t),
      e,
      0,
      n
    ), new Ke(e, "XY", n);
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
    return xc(
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
    const n = pc(
      this.flatCoordinates,
      0,
      t,
      this.stride,
      this.ends_
    );
    this.flatCoordinates.length = n.length === 0 ? 0 : n[n.length - 1], this.changed();
  }
}
function lo(i) {
  if (EA(i))
    throw new Error("Cannot create polygon from empty extent");
  const t = i[0], e = i[1], n = i[2], r = i[3], s = [
    t,
    e,
    t,
    r,
    n,
    r,
    n,
    e,
    t,
    e
  ];
  return new Ke(s, "XY", [s.length]);
}
const Lc = {
  /**
   * Indicates that tile loading failed
   * @type {number}
   */
  ERROR: 3
};
function FA(i, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = i, n;
}
function Ee(i, t, e = {}) {
  if (!i)
    throw new Error("coordinates is required");
  if (!Array.isArray(i))
    throw new Error("coordinates must be an Array");
  if (i.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!Io(i[0]) || !Io(i[1]))
    throw new Error("coordinates must contain numbers");
  return FA({
    type: "Point",
    coordinates: i
  }, t, e);
}
function Vr(i, t, e = {}) {
  for (const n of i) {
    if (n.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (n[n.length - 1].length !== n[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let r = 0; r < n[n.length - 1].length; r++)
      if (n[n.length - 1][r] !== n[0][r])
        throw new Error("First and last Position are not equivalent.");
  }
  return FA({
    type: "Polygon",
    coordinates: i
  }, t, e);
}
function Mn(i, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = i, e;
}
function Io(i) {
  return !isNaN(i) && i !== null && !Array.isArray(i);
}
function Dc(i) {
  if (!i)
    throw new Error("coord is required");
  if (!Array.isArray(i)) {
    if (i.type === "Feature" && i.geometry !== null && i.geometry.type === "Point")
      return [...i.geometry.coordinates];
    if (i.type === "Point")
      return [...i.coordinates];
  }
  if (Array.isArray(i) && i.length >= 2 && !Array.isArray(i[0]) && !Array.isArray(i[1]))
    return [...i];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function Co(i) {
  if (Array.isArray(i))
    return i;
  if (i.type === "Feature") {
    if (i.geometry !== null)
      return i.geometry.coordinates;
  } else if (i.coordinates)
    return i.coordinates;
  throw new Error(
    "coords must be GeoJSON Feature, Geometry Object or an Array"
  );
}
function Bc(i) {
  return i.type === "Feature" ? i.geometry : i;
}
const xe = 11102230246251565e-32, Gt = 134217729, Nc = (3 + 8 * xe) * xe;
function hr(i, t, e, n, r) {
  let s, o, A, a, g = t[0], I = n[0], l = 0, u = 0;
  I > g == I > -g ? (s = g, g = t[++l]) : (s = I, I = n[++u]);
  let p = 0;
  if (l < i && u < e)
    for (I > g == I > -g ? (o = g + s, A = s - (o - g), g = t[++l]) : (o = I + s, A = s - (o - I), I = n[++u]), s = o, A !== 0 && (r[p++] = A); l < i && u < e; )
      I > g == I > -g ? (o = s + g, a = o - s, A = s - (o - a) + (g - a), g = t[++l]) : (o = s + I, a = o - s, A = s - (o - a) + (I - a), I = n[++u]), s = o, A !== 0 && (r[p++] = A);
  for (; l < i; )
    o = s + g, a = o - s, A = s - (o - a) + (g - a), g = t[++l], s = o, A !== 0 && (r[p++] = A);
  for (; u < e; )
    o = s + I, a = o - s, A = s - (o - a) + (I - a), I = n[++u], s = o, A !== 0 && (r[p++] = A);
  return (s !== 0 || p === 0) && (r[p++] = s), p;
}
function Gc(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function si(i) {
  return new Float64Array(i);
}
const Fc = (3 + 16 * xe) * xe, jc = (2 + 12 * xe) * xe, Uc = (9 + 64 * xe) * xe * xe, gn = si(4), uo = si(8), ho = si(12), fo = si(16), Xt = si(4);
function zc(i, t, e, n, r, s, o) {
  let A, a, g, I, l, u, p, m, c, C, h, d, S, w, f, y, v, x;
  const M = i - r, E = e - r, T = t - s, R = n - s;
  w = M * R, u = Gt * M, p = u - (u - M), m = M - p, u = Gt * R, c = u - (u - R), C = R - c, f = m * C - (w - p * c - m * c - p * C), y = T * E, u = Gt * T, p = u - (u - T), m = T - p, u = Gt * E, c = u - (u - E), C = E - c, v = m * C - (y - p * c - m * c - p * C), h = f - v, l = f - h, gn[0] = f - (h + l) + (l - v), d = w + h, l = d - w, S = w - (d - l) + (h - l), h = S - y, l = S - h, gn[1] = S - (h + l) + (l - y), x = d + h, l = x - d, gn[2] = d - (x - l) + (h - l), gn[3] = x;
  let L = Gc(4, gn), D = jc * o;
  if (L >= D || -L >= D || (l = i - M, A = i - (M + l) + (l - r), l = e - E, g = e - (E + l) + (l - r), l = t - T, a = t - (T + l) + (l - s), l = n - R, I = n - (R + l) + (l - s), A === 0 && a === 0 && g === 0 && I === 0) || (D = Uc * o + Nc * Math.abs(L), L += M * I + R * A - (T * g + E * a), L >= D || -L >= D)) return L;
  w = A * R, u = Gt * A, p = u - (u - A), m = A - p, u = Gt * R, c = u - (u - R), C = R - c, f = m * C - (w - p * c - m * c - p * C), y = a * E, u = Gt * a, p = u - (u - a), m = a - p, u = Gt * E, c = u - (u - E), C = E - c, v = m * C - (y - p * c - m * c - p * C), h = f - v, l = f - h, Xt[0] = f - (h + l) + (l - v), d = w + h, l = d - w, S = w - (d - l) + (h - l), h = S - y, l = S - h, Xt[1] = S - (h + l) + (l - y), x = d + h, l = x - d, Xt[2] = d - (x - l) + (h - l), Xt[3] = x;
  const G = hr(4, gn, 4, Xt, uo);
  w = M * I, u = Gt * M, p = u - (u - M), m = M - p, u = Gt * I, c = u - (u - I), C = I - c, f = m * C - (w - p * c - m * c - p * C), y = T * g, u = Gt * T, p = u - (u - T), m = T - p, u = Gt * g, c = u - (u - g), C = g - c, v = m * C - (y - p * c - m * c - p * C), h = f - v, l = f - h, Xt[0] = f - (h + l) + (l - v), d = w + h, l = d - w, S = w - (d - l) + (h - l), h = S - y, l = S - h, Xt[1] = S - (h + l) + (l - y), x = d + h, l = x - d, Xt[2] = d - (x - l) + (h - l), Xt[3] = x;
  const U = hr(G, uo, 4, Xt, ho);
  w = A * I, u = Gt * A, p = u - (u - A), m = A - p, u = Gt * I, c = u - (u - I), C = I - c, f = m * C - (w - p * c - m * c - p * C), y = a * g, u = Gt * a, p = u - (u - a), m = a - p, u = Gt * g, c = u - (u - g), C = g - c, v = m * C - (y - p * c - m * c - p * C), h = f - v, l = f - h, Xt[0] = f - (h + l) + (l - v), d = w + h, l = d - w, S = w - (d - l) + (h - l), h = S - y, l = S - h, Xt[1] = S - (h + l) + (l - y), x = d + h, l = x - d, Xt[2] = d - (x - l) + (h - l), Xt[3] = x;
  const P = hr(U, ho, 4, Xt, fo);
  return fo[P - 1];
}
function Xc(i, t, e, n, r, s) {
  const o = (t - s) * (e - r), A = (i - r) * (n - s), a = o - A, g = Math.abs(o + A);
  return Math.abs(a) >= Fc * g ? a : -zc(i, t, e, n, r, s, g);
}
function Zc(i, t) {
  var e, n, r = 0, s, o, A, a, g, I, l, u = i[0], p = i[1], m = t.length;
  for (e = 0; e < m; e++) {
    n = 0;
    var c = t[e], C = c.length - 1;
    if (I = c[0], I[0] !== c[C][0] && I[1] !== c[C][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (o = I[0] - u, A = I[1] - p, n; n < C; n++) {
      if (l = c[n + 1], a = l[0] - u, g = l[1] - p, A === 0 && g === 0) {
        if (a <= 0 && o >= 0 || o <= 0 && a >= 0)
          return 0;
      } else if (g >= 0 && A <= 0 || g <= 0 && A >= 0) {
        if (s = Xc(o, a, A, g, 0, 0), s === 0)
          return 0;
        (s > 0 && g > 0 && A <= 0 || s < 0 && g <= 0 && A > 0) && r++;
      }
      I = l, A = g, o = a;
    }
  }
  return r % 2 !== 0;
}
function Ye(i, t, e = {}) {
  if (!i)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = Dc(i), r = Bc(t), s = r.type, o = t.bbox;
  let A = r.coordinates;
  if (o && Vc(n, o) === !1)
    return !1;
  s === "Polygon" && (A = [A]);
  for (var a = 0; a < A.length; ++a) {
    const g = Zc(n, A[a]);
    if (g === 0 && !e.ignoreBoundary || g) return !0;
  }
  return !1;
}
function Vc(i, t) {
  return t[0] <= i[0] && t[1] <= i[1] && t[2] >= i[0] && t[3] >= i[1];
}
function fr(i, t) {
  for (let e = 0; e < t.features.length; e++)
    if (Ye(i, t.features[e]))
      return t.features[e];
}
function jA(i, t) {
  const e = t.geometry.coordinates[0][0], n = t.geometry.coordinates[0][1], r = t.geometry.coordinates[0][2], s = i.geometry.coordinates, o = t.properties.a.geom, A = t.properties.b.geom, a = t.properties.c.geom, g = [n[0] - e[0], n[1] - e[1]], I = [r[0] - e[0], r[1] - e[1]], l = [s[0] - e[0], s[1] - e[1]], u = [A[0] - o[0], A[1] - o[1]], p = [a[0] - o[0], a[1] - o[1]], m = (I[1] * l[0] - I[0] * l[1]) / (g[0] * I[1] - g[1] * I[0]), c = (g[0] * l[1] - g[1] * l[0]) / (g[0] * I[1] - g[1] * I[0]);
  return [
    m * u[0] + c * p[0] + o[0],
    m * u[1] + c * p[1] + o[1]
  ];
}
function Wc(i, t, e) {
  const n = i.geometry.coordinates, r = e.geometry.coordinates, s = Math.atan2(n[0] - r[0], n[1] - r[1]), o = Qc(s, t[0]);
  if (o === void 0)
    throw new Error("Unable to determine vertex index");
  const A = t[1][o];
  return jA(i, A.features[0]);
}
function Hc(i, t, e, n, r, s, o, A) {
  let a;
  if (o && (a = fr(i, Mn([o]))), !a)
    if (e) {
      const g = i.geometry.coordinates, I = e.gridNum, l = e.xOrigin, u = e.yOrigin, p = e.xUnit, m = e.yUnit, c = e.gridCache, C = Ie(g[0], l, p, I), h = Ie(g[1], u, m, I), d = c[C] ? c[C][h] ? c[C][h] : [] : [], S = Mn(d.map((w) => t.features[w]));
      a = fr(i, S);
    } else
      a = fr(i, t);
  return A && A(a), a ? jA(i, a) : Wc(i, n, r);
}
function Ie(i, t, e, n) {
  let r = Math.floor((i - t) / e);
  return r < 0 && (r = 0), r >= n && (r = n - 1), r;
}
function Qc(i, t) {
  let e = po(i - t[0]), n = Math.PI * 2, r;
  for (let s = 0; s < t.length; s++) {
    const o = (s + 1) % t.length, A = po(i - t[o]), a = Math.min(Math.abs(e), Math.abs(A));
    e * A <= 0 && a < n && (n = a, r = s), e = A;
  }
  return r;
}
function po(i, t = !1) {
  const e = 2 * Math.PI, n = i - Math.floor(i / e) * e;
  return t ? n : n > Math.PI ? n - e : n;
}
function Yc(i) {
  const t = [0, 1, 2, 0].map((n) => i[n][0][0]), e = {
    a: { geom: i[0][0][1], index: i[0][1] },
    b: { geom: i[1][0][1], index: i[1][1] },
    c: { geom: i[2][0][1], index: i[2][1] }
  };
  return Vr([t], e);
}
function Wr(i, t, e, n, r, s = !1, o) {
  const A = i.map(
    (a) => {
      (!o || o < 2.00703) && (a = Kc(a));
      const g = isFinite(a) ? t[a] : a === "c" ? n : (function() {
        const I = a.match(/^b(\d+)$/);
        if (I) return r[parseInt(I[1])];
        const l = a.match(/^e(\d+)$/);
        if (l) return e[parseInt(l[1])];
        throw new Error("Bad index value for indexesToTri");
      })();
      return s ? [[g[1], g[0]], a] : [[g[0], g[1]], a];
    }
  );
  return Yc(A);
}
function Kc(i) {
  return typeof i == "number" ? i : i.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
}
function Jc(i, t) {
  return t && t >= 2.00703 || Array.isArray(i[0]) ? i : i.map((e) => [
    e.illstNodes,
    e.mercNodes,
    e.startEnd
  ]);
}
const qc = 2.00704;
function $c(i) {
  return !!(i.version !== void 0 || !i.tins && i.points && i.tins_points);
}
function tl(i) {
  return {
    points: i.points,
    strictStatus: nl(i),
    verticesParams: il(i),
    centroid: rl(i),
    edges: Jc(i.edges || []),
    edgeNodes: i.edgeNodes || [],
    tins: sl(i),
    kinks: ol(i.kinks_points),
    yaxisMode: i.yaxisMode ?? "invert",
    strictMode: i.strictMode ?? "auto",
    vertexMode: i.vertexMode,
    bounds: i.bounds,
    boundsPolygon: i.boundsPolygon,
    wh: i.wh,
    xy: i.xy ?? [0, 0]
  };
}
function el(i) {
  const t = Al(i), e = t.tins;
  return {
    compiled: t,
    tins: e,
    points: al(e),
    strictStatus: t.strict_status,
    verticesParams: t.vertices_params,
    centroid: t.centroid,
    kinks: t.kinks
  };
}
function nl(i) {
  return i.strict_status ? i.strict_status : i.kinks_points ? "strict_error" : i.tins_points.length === 2 ? "loose" : "strict";
}
function il(i) {
  const t = {
    forw: [i.vertices_params[0]],
    bakw: [i.vertices_params[1]]
  };
  return t.forw[1] = mo(i, !1), t.bakw[1] = mo(i, !0), t;
}
function mo(i, t) {
  const e = i.vertices_points.length;
  return Array.from({ length: e }, (n, r) => {
    const s = (r + 1) % e, o = Wr(
      ["c", `b${r}`, `b${s}`],
      i.points,
      i.edgeNodes || [],
      i.centroid_point,
      i.vertices_points,
      t,
      qc
    );
    return Mn([o]);
  });
}
function rl(i) {
  return {
    forw: Ee(i.centroid_point[0], {
      target: {
        geom: i.centroid_point[1],
        index: "c"
      }
    }),
    bakw: Ee(i.centroid_point[1], {
      target: {
        geom: i.centroid_point[0],
        index: "c"
      }
    })
  };
}
function sl(i) {
  const t = i.tins_points.length === 1 ? 0 : 1;
  return {
    forw: Mn(
      i.tins_points[0].map(
        (e) => Wr(
          e,
          i.points,
          i.edgeNodes || [],
          i.centroid_point,
          i.vertices_points,
          !1,
          i.version
        )
      )
    ),
    bakw: Mn(
      i.tins_points[t].map(
        (e) => Wr(
          e,
          i.points,
          i.edgeNodes || [],
          i.centroid_point,
          i.vertices_points,
          !0,
          i.version
        )
      )
    )
  };
}
function ol(i) {
  if (i)
    return {
      bakw: Mn(
        i.map((t) => Ee(t))
      )
    };
}
function Al(i) {
  return JSON.parse(
    JSON.stringify(i).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"')
  );
}
function al(i) {
  const t = [], e = i.forw.features;
  for (let n = 0; n < e.length; n++) {
    const r = e[n];
    ["a", "b", "c"].forEach((s, o) => {
      const A = r.geometry.coordinates[0][o], a = r.properties[s].geom, g = r.properties[s].index;
      typeof g == "number" && (t[g] = [A, a]);
    });
  }
  return t;
}
class ie {
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
  /** @deprecated 2.00704 以降、Transform はこのプロパティを設定も参照もしない。サブクラス（MaplatTin）は、旧 @maplat/transform と組まれたときの互換のため {} を入れる（t2 設計 §2.1） */
  pointsWeightBuffer;
  strict_status;
  vertices_params;
  centroid;
  edgeNodes;
  edges;
  tins;
  kinks;
  yaxisMode = ie.YAXIS_INVERT;
  strictMode = ie.MODE_AUTO;
  vertexMode = ie.VERTEX_PLAIN;
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
    if ($c(t)) {
      this.applyModernState(tl(t));
      return;
    }
    this.applyLegacyState(el(t));
  }
  applyModernState(t) {
    this.points = t.points, this.strict_status = t.strictStatus, this.vertices_params = t.verticesParams, this.centroid = t.centroid, this.edges = t.edges, this.edgeNodes = t.edgeNodes || [], this.tins = t.tins, this.addIndexedTin(), this.kinks = t.kinks, this.yaxisMode = t.yaxisMode ?? ie.YAXIS_INVERT, this.vertexMode = t.vertexMode ?? ie.VERTEX_PLAIN, this.strictMode = t.strictMode ?? ie.MODE_AUTO, t.bounds ? (this.bounds = t.bounds, this.boundsPolygon = t.boundsPolygon, this.xy = t.xy, this.wh = t.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = t.xy ?? [0, 0], t.wh && (this.wh = t.wh));
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
   */
  addIndexedTin() {
    const t = this.tins, e = t.forw, n = t.bakw, r = Math.ceil(Math.sqrt(e.features.length));
    if (r < 3) {
      this.indexedTins = void 0;
      return;
    }
    let s = [], o = [];
    const A = e.features.map((c) => {
      let C = [];
      return Co(c)[0].map((h) => {
        s.length === 0 ? s = [Array.from(h), Array.from(h)] : (h[0] < s[0][0] && (s[0][0] = h[0]), h[0] > s[1][0] && (s[1][0] = h[0]), h[1] < s[0][1] && (s[0][1] = h[1]), h[1] > s[1][1] && (s[1][1] = h[1])), C.length === 0 ? C = [Array.from(h), Array.from(h)] : (h[0] < C[0][0] && (C[0][0] = h[0]), h[0] > C[1][0] && (C[1][0] = h[0]), h[1] < C[0][1] && (C[0][1] = h[1]), h[1] > C[1][1] && (C[1][1] = h[1]));
      }), C;
    }), a = (s[1][0] - s[0][0]) / r, g = (s[1][1] - s[0][1]) / r, I = A.reduce(
      (c, C, h) => {
        const d = Ie(C[0][0], s[0][0], a, r), S = Ie(C[1][0], s[0][0], a, r), w = Ie(C[0][1], s[0][1], g, r), f = Ie(C[1][1], s[0][1], g, r);
        for (let y = d; y <= S; y++) {
          c[y] || (c[y] = []);
          for (let v = w; v <= f; v++)
            c[y][v] || (c[y][v] = []), c[y][v].push(h);
        }
        return c;
      },
      []
    ), l = n.features.map((c) => {
      let C = [];
      return Co(c)[0].map((h) => {
        o.length === 0 ? o = [Array.from(h), Array.from(h)] : (h[0] < o[0][0] && (o[0][0] = h[0]), h[0] > o[1][0] && (o[1][0] = h[0]), h[1] < o[0][1] && (o[0][1] = h[1]), h[1] > o[1][1] && (o[1][1] = h[1])), C.length === 0 ? C = [Array.from(h), Array.from(h)] : (h[0] < C[0][0] && (C[0][0] = h[0]), h[0] > C[1][0] && (C[1][0] = h[0]), h[1] < C[0][1] && (C[0][1] = h[1]), h[1] > C[1][1] && (C[1][1] = h[1]));
      }), C;
    }), u = (o[1][0] - o[0][0]) / r, p = (o[1][1] - o[0][1]) / r, m = l.reduce(
      (c, C, h) => {
        const d = Ie(C[0][0], o[0][0], u, r), S = Ie(C[1][0], o[0][0], u, r), w = Ie(C[0][1], o[0][1], p, r), f = Ie(C[1][1], o[0][1], p, r);
        for (let y = d; y <= S; y++) {
          c[y] || (c[y] = []);
          for (let v = w; v <= f; v++)
            c[y][v] || (c[y][v] = []), c[y][v].push(h);
        }
        return c;
      },
      []
    );
    this.indexedTins = {
      forw: {
        gridNum: r,
        xOrigin: s[0][0],
        yOrigin: s[0][1],
        xUnit: a,
        yUnit: g,
        gridCache: I
      },
      bakw: {
        gridNum: r,
        xOrigin: o[0][0],
        yOrigin: o[0][1],
        xUnit: u,
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
  transform(t, e, n) {
    if (!this.tins)
      throw new Error("setCompiled() must be called before transform()");
    if (e && this.strict_status == ie.STATUS_ERROR)
      throw new Error('Backward transform is not allowed if strict_status == "strict_error"');
    this.yaxisMode == ie.YAXIS_FOLLOW && e && (t = [t[0], -1 * t[1]]);
    const r = Ee(t);
    if (this.bounds && !e && !n && !Ye(r, this.boundsPolygon))
      return !1;
    const s = e ? this.tins.bakw : this.tins.forw, o = e ? this.indexedTins.bakw : this.indexedTins.forw, A = e ? this.vertices_params.bakw : this.vertices_params.forw, a = e ? this.centroid.bakw : this.centroid.forw;
    let g, I;
    this.stateFull && (this.stateBackward == e ? g = this.stateTriangle : (this.stateBackward = e, this.stateTriangle = void 0), I = (u) => {
      this.stateTriangle = u;
    });
    let l = Hc(
      r,
      s,
      o,
      A,
      a,
      void 0,
      g,
      I
    );
    if (this.bounds && e && !n) {
      const u = Ee(l);
      if (!Ye(u, this.boundsPolygon)) return !1;
    } else this.yaxisMode == ie.YAXIS_FOLLOW && !e && (l = [l[0], -1 * l[1]]);
    return l;
  }
}
const dt = 20037508342789244e-9, UA = [
  [0, 0],
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
];
function ds(i, t) {
  return Math.floor(Math.min(i[0], i[1]) / 4) * dt / 128 / Math.pow(2, t);
}
function zA(i, t) {
  const e = [];
  for (let n = 0; n < i.length; n++) {
    const r = i[n], s = r[0] * Math.cos(t) - r[1] * Math.sin(t), o = r[0] * Math.sin(t) + r[1] * Math.cos(t);
    e.push([s, o]);
  }
  return e;
}
function Hr(i, t, e, n) {
  const r = ds(n, t);
  return zA(UA, e).map((s) => [
    s[0] * r + i[0],
    s[1] * r + i[1]
  ]);
}
function Qr(i, t) {
  const e = i[0], n = i.slice(1, 5).map((u) => [
    u[0] - e[0],
    u[1] - e[1]
  ]), r = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
  ];
  let s = 0, o = 0, A = 0;
  for (let u = 0; u < 4; u++) {
    const p = n[u], m = r[u], c = Math.sqrt(Math.pow(p[0], 2) + Math.pow(p[1], 2));
    s += c;
    const C = p[0] * m[1] - p[1] * m[0], h = Math.acos(
      (p[0] * m[0] + p[1] * m[1]) / c
    ), d = C > 0 ? -1 * h : h;
    o += Math.cos(d), A += Math.sin(d);
  }
  const a = s / 4, g = Math.atan2(A, o), I = Math.floor(Math.min(t[0], t[1]) / 4), l = Math.log(I * dt / 128 / a) / Math.log(2);
  return { center: e, zoom: l, rotation: g };
}
function dr(i, t) {
  const e = i[0] * (2 * dt) / t - dt, n = -1 * (i[1] * (2 * dt) / t - dt);
  return [e, n];
}
function yo(i, t) {
  const e = (i[0] + dt) * t / (2 * dt), n = (-i[1] + dt) * t / (2 * dt);
  return [e, n];
}
const pr = 256;
class XA {
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
    const e = new ie();
    if (e.setCompiled(t.compiled), this.mainTin = e, t.maxZoom !== void 0)
      this._maxxy = Math.pow(2, t.maxZoom) * pr;
    else if (t.compiled.wh) {
      const n = Math.max(t.compiled.wh[0], t.compiled.wh[1]), r = Math.ceil(Math.log2(n / pr));
      this._maxxy = Math.pow(2, r) * pr;
    }
    if (this.subTins = [], t.sub_maps)
      for (const n of t.sub_maps) {
        const r = new ie();
        r.setCompiled(n.compiled);
        const s = n.bounds ?? n.compiled.bounds;
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
          priority: n.priority,
          importance: n.importance,
          xyBounds: Vr([o]),
          mercBounds: Vr([A])
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
    const e = this.merc2XyWithLayer(t), n = e[0] || e[1];
    return n ? n[1] : !1;
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
    for (let n = 0; n < e.length; n++) {
      const { index: r, isMain: s } = e[n];
      if (s || Ye(Ee(t), this.subTins[r - 1].xyBounds)) {
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
    return this._assertMapData(), this._getAllTinsWithIndex().map(({ index: e, tin: n, isMain: r }) => {
      const s = this._transformByIndex(t, e, !0);
      return s === !1 ? [n, e] : r || Ye(Ee(s), this.subTins[e - 1].xyBounds) ? [n, e, s] : [n, e];
    }).sort((e, n) => {
      const r = e[0].priority ?? 0, s = n[0].priority ?? 0;
      return r < s ? 1 : -1;
    }).reduce(
      (e, n, r, s) => {
        const o = n[0], A = n[1], a = n[2];
        if (!a) return e;
        for (let g = 0; g < r; g++) {
          const I = s[g][1], l = I === 0;
          if (s[g][2] && (l || Ye(Ee(a), this.subTins[I - 1].xyBounds)))
            if (e.length) {
              const u = !e[0], p = u ? e[1][2] : e[0][2], m = o.importance ?? 0, c = p.importance ?? 0;
              return u ? m < c ? e : [void 0, [A, a, o]] : [...e.filter(
                (C) => C !== void 0
              ), [A, a, o]].sort(
                (C, h) => (C[2].importance ?? 0) < (h[2].importance ?? 0) ? 1 : -1
              ).slice(0, 2);
            } else
              return [[A, a, o]];
        }
        return !e.length || !e[0] ? [[A, a, o]] : (e.push([A, a, o]), e.sort((g, I) => {
          const l = g[2].importance ?? 0, u = I[2].importance ?? 0;
          return l < u ? 1 : -1;
        }).filter((g, I) => I < 2));
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
    const e = this._getAllTinsWithIndex(), n = (a) => a === 0 ? 0 : this.subTins[a - 1].priority ?? 0, r = (a) => a === 0 ? 0 : this.subTins[a - 1].importance ?? 0, s = (a, g) => a === 0 || Ye(Ee(g), this.subTins[a - 1].xyBounds), o = [];
    for (const { index: a } of e) {
      const g = this._transformByIndex(t, a, !0);
      g !== !1 && s(a, g) && o.push({ index: a, xy: g });
    }
    const A = (a) => e.some(
      ({ index: g }) => g !== 0 && g !== a.index && (n(g) > n(a.index) || a.index === 0 && n(g) === 0) && s(g, a.xy)
    );
    return o.filter((a) => !A(a)).sort((a, g) => r(g.index) - r(a.index) || n(g.index) - n(a.index) || a.index - g.index).map((a) => [a.index, a.xy]);
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
    let n = !1;
    return e.map((r, s) => {
      if (!r) {
        n = !0;
        return;
      }
      const o = r[0], A = r[1];
      return s !== 0 && !n ? [this.xy2SysCoordInternal(A)] : t.map((a, g) => g === 0 ? A : this._transformByIndex(a, o, !0)).map((a) => this.xy2SysCoordInternal(a));
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
    const n = Hr(t.center, t.zoom, t.rotation, e).map((A) => yo(A, this._maxxy)), r = this.xy2MercWithLayer(n[0]);
    if (!r) throw new Error("viewpoint2Mercs: center point is out of bounds");
    const s = r[0], o = r[1];
    return n.map((A, a) => {
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
    const n = this.merc2XyWithLayer(t[0]), r = n[0] || n[1];
    if (!r) throw new Error("mercs2Viewpoint: center point is out of bounds");
    const s = r[0], o = r[1], A = t.map((a, g) => {
      if (g === 0) return o;
      const I = this._transformByIndex(a, s, !0);
      if (I === !1) throw new Error(`mercs2Viewpoint: point ${g} is out of bounds`);
      return I;
    }).map((a) => dr(a, this._maxxy));
    return Qr(A, e);
  }
  // ─── ユーティリティ（静的メソッド）────────────────────────────────────────
  /** zoom2Radius の静的ラッパー */
  static zoom2Radius(t, e) {
    return ds(t, e);
  }
  /** mercViewpoint2Mercs の静的ラッパー */
  static mercViewpoint2Mercs(t, e, n, r) {
    return Hr(t, e, n, r);
  }
  /** mercs2MercViewpoint の静的ラッパー */
  static mercs2MercViewpoint(t, e) {
    return Qr(t, e);
  }
  /** xy2SysCoord の静的ラッパー */
  static xy2SysCoord(t, e) {
    return dr(t, e);
  }
  /** sysCoord2Xy の静的ラッパー */
  static sysCoord2Xy(t, e) {
    return yo(t, e);
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
      const n = t.tin.priority ?? 0, r = e.tin.priority ?? 0;
      return n < r ? 1 : -1;
    });
  }
  /** メイン TIN + 全 sub TIN を index 付きで返す */
  _getAllTinsWithIndex() {
    const t = [
      { index: 0, tin: this.mainTin, isMain: !0 }
    ];
    return this.subTins.forEach((e, n) => {
      e.tin.priority = e.priority, e.tin.importance = e.importance, t.push({ index: n + 1, tin: e.tin, isMain: !1 });
    }), t;
  }
  /**
   * 指定レイヤーインデックスで TIN 変換を実行する
   * index 0 → mainTin, index 1..n → subTins[index-1]
   */
  _transformByIndex(t, e, n) {
    if (e === 0)
      return this.mainTin.transform(t, n);
    const r = this.subTins[e - 1];
    return r ? r.tin.transform(t, n, !0) : !1;
  }
  /** 内部用 xy2SysCoord（_maxxy を使用） */
  xy2SysCoordInternal(t) {
    return dr(t, this._maxxy);
  }
}
const ZA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAB3RJTUUH3QgIBToaSbAjlwAAABd0RVh0U29mdHdhcmUAR0xEUE5HIHZlciAzLjRxhaThAAAACHRwTkdHTEQzAAAAAEqAKR8AAAAEZ0FNQQAAsY8L/GEFAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAFRJREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgBDwABHHIJwwAAAABJRU5ErkJggg==", Ze = 256, gl = `<canvas width="${Ze}" height="${Ze}" src="${ZA}"></canvas>`;
async function Nn(i) {
  if (typeof i == "string") {
    const t = i.match(/\//) ? i : `pois/${i}`, e = await fetch(t);
    if (!e.ok)
      throw new Error("Fail to load poi json");
    return await e.json();
  } else
    return i;
}
const VA = ["hide", "title", "icon", "selectedIcon"], cl = [
  "lnglat",
  "lng",
  "lat",
  "longitude",
  "latitude"
];
function Ni(i) {
  return typeof i == "object" && i !== null && !Array.isArray(i);
}
function Yr(i) {
  if (!Ni(i) || i.type === "FeatureCollection") return !1;
  const t = i.layer, e = typeof t == "string", n = Ni(t) && t.type === "FeatureCollection";
  return !(!e && !n || cl.some((r) => i[r] !== void 0));
}
function ll(i) {
  return Yr(i) && VA.some((t) => i[t] !== void 0);
}
function vo(i) {
  const t = {};
  for (const [e, n] of Object.entries(i))
    if (e !== "layer") {
      if (VA.includes(e)) {
        t[e] = n;
        continue;
      }
      console.warn(`[Maplat] pois layer ref: unknown override key ignored: ${e}`);
    }
  return t;
}
function wo(i, t) {
  if (!t) return i;
  t.hide === !0 && (i.hide = !0);
  const e = t.title;
  (typeof e == "string" ? e !== "" : Ni(e) && Object.keys(e).length > 0) && (i.name = e);
  for (const n of ["icon", "selectedIcon"]) {
    const r = t[n];
    typeof r == "string" && r !== "" && (i[n] = r);
  }
  return i;
}
async function WA(i, t) {
  if (i = await Nn(i), Array.isArray(i)) {
    const e = i[0];
    if (i.length > 0 && (typeof e == "string" || Ni(e) && e.type === "FeatureCollection" || Yr(e))) {
      const r = await Promise.all(
        i.map(async (s, o) => {
          let A, a;
          Yr(s) ? (A = await Nn(s.layer), a = vo(s)) : (A = await Nn(s), a = null);
          let g = A.id || A.properties && A.properties.id;
          if (!g)
            if (o === 0) g = "main";
            else throw "POI layers include bad key setting";
          const I = Be(A, g, t);
          return [g, wo(I, a)];
        })
      );
      i = Object.fromEntries(r);
    } else
      i = await Promise.all(i.map(async (r) => await Nn(r))), i = {
        main: Be(i, "main", t)
      };
  } else if (i.type === "FeatureCollection") {
    const e = i.id || i.properties && i.properties.id || "main";
    i = { [e]: Be(i, e, t) };
  } else if (ll(i)) {
    const e = await Nn(i.layer), n = e.id || e.properties && e.properties.id || "main", r = Be(e, n, t);
    i = { [n]: wo(r, vo(i)) };
  } else
    Object.keys(i).map((e) => {
      i[e] = Be(i[e], e, t);
    });
  return i.main || (i.main = Be([], "main", t)), Object.keys(i).map((e) => {
    ps(i, e, t);
  }), i;
}
function Be(i, t, e) {
  if (Array.isArray(i))
    i = {
      pois: i.map((n) => $n(n))
    };
  else if (i.type === "FeatureCollection") {
    const n = Object.assign({}, i.properties || {});
    i.name && (n.name = i.name), n.pois = i.features.map((r) => $n(r)), i = n;
  }
  if (typeof i.id > "u")
    i.id = t;
  else if (i.id !== t) throw "POI layers include bad key setting";
  return i.namespaceID || (i.namespaceID = `${e.namespace ? `${e.namespace}#` : ""}${t}`), i.name || (i.name = t === "main" ? e.name : t), i.pois || (i.pois = []), i;
}
function $n(i) {
  if (i.type === "Feature") {
    const t = Object.assign({}, i.properties || {});
    t.lnglat = i.geometry.coordinates, t.id || (t.id = i.id), t.name || (t.name = i.name), i = t;
  }
  return i.lnglat || (i.lnglat = [i.lng || i.longitude, i.lat || i.latitude]), delete i.lng, delete i.lat, delete i.longitude, delete i.latitude, i;
}
function ps(i, t, e) {
  if (!i[t]) return;
  const n = i[t], r = n.pois;
  n.__nextId || (n.__nextId = 0), r.map((s) => {
    s.id || (s.id = `${t}_${n.__nextId}`, n.__nextId++), s.namespaceID || (s.namespaceID = `${e.namespace ? `${e.namespace}#` : ""}${s.id}`);
  });
}
function ti(i, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = i, n;
}
function HA(i, t, e = {}) {
  if (!i)
    throw new Error("coordinates is required");
  if (!Array.isArray(i))
    throw new Error("coordinates must be an Array");
  if (i.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!Eo(i[0]) || !Eo(i[1]))
    throw new Error("coordinates must contain numbers");
  return ti({
    type: "Point",
    coordinates: i
  }, t, e);
}
function QA(i, t, e = {}) {
  for (const r of i) {
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
  return ti({
    type: "Polygon",
    coordinates: i
  }, t, e);
}
function Il(i, t, e = {}) {
  if (i.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return ti({
    type: "LineString",
    coordinates: i
  }, t, e);
}
function bo(i, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = i, e;
}
function Eo(i) {
  return !isNaN(i) && i !== null && !Array.isArray(i);
}
function Cl(i) {
  if (!i)
    throw new Error("coord is required");
  if (!Array.isArray(i)) {
    if (i.type === "Feature" && i.geometry !== null && i.geometry.type === "Point")
      return [...i.geometry.coordinates];
    if (i.type === "Point")
      return [...i.coordinates];
  }
  if (Array.isArray(i) && i.length >= 2 && !Array.isArray(i[0]) && !Array.isArray(i[1]))
    return [...i];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function ul(i) {
  return i.type === "Feature" ? i.geometry : i;
}
function YA(i, t, e) {
  if (i !== null)
    for (var n, r, s, o, A, a, g, I = 0, l = 0, u, p = i.type, m = p === "FeatureCollection", c = p === "Feature", C = m ? i.features.length : 1, h = 0; h < C; h++) {
      g = m ? (
        // @ts-expect-error: Known type conflict
        i.features[h].geometry
      ) : c ? (
        // @ts-expect-error: Known type conflict
        i.geometry
      ) : i, u = g ? g.type === "GeometryCollection" : !1, A = u ? g.geometries.length : 1;
      for (var d = 0; d < A; d++) {
        var S = 0, w = 0;
        if (o = u ? g.geometries[d] : g, o !== null) {
          a = o.coordinates;
          var f = o.type;
          switch (I = f === "Polygon" || f === "MultiPolygon" ? 1 : 0, f) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  a,
                  l,
                  h,
                  S,
                  w
                ) === !1
              )
                return !1;
              l++, S++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < a.length; n++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    a[n],
                    l,
                    h,
                    S,
                    w
                  ) === !1
                )
                  return !1;
                l++, f === "MultiPoint" && S++;
              }
              f === "LineString" && S++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < a.length; n++) {
                for (r = 0; r < a[n].length - I; r++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      a[n][r],
                      l,
                      h,
                      S,
                      w
                    ) === !1
                  )
                    return !1;
                  l++;
                }
                f === "MultiLineString" && S++, f === "Polygon" && w++;
              }
              f === "Polygon" && S++;
              break;
            case "MultiPolygon":
              for (n = 0; n < a.length; n++) {
                for (w = 0, r = 0; r < a[n].length; r++) {
                  for (s = 0; s < a[n][r].length - I; s++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        a[n][r][s],
                        l,
                        h,
                        S,
                        w
                      ) === !1
                    )
                      return !1;
                    l++;
                  }
                  w++;
                }
                S++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < o.geometries.length; n++)
                if (
                  // @ts-expect-error: Known type conflict
                  YA(o.geometries[n], t) === !1
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
const Me = 11102230246251565e-32, Ft = 134217729, hl = (3 + 8 * Me) * Me;
function mr(i, t, e, n, r) {
  let s, o, A, a, g = t[0], I = n[0], l = 0, u = 0;
  I > g == I > -g ? (s = g, g = t[++l]) : (s = I, I = n[++u]);
  let p = 0;
  if (l < i && u < e)
    for (I > g == I > -g ? (o = g + s, A = s - (o - g), g = t[++l]) : (o = I + s, A = s - (o - I), I = n[++u]), s = o, A !== 0 && (r[p++] = A); l < i && u < e; )
      I > g == I > -g ? (o = s + g, a = o - s, A = s - (o - a) + (g - a), g = t[++l]) : (o = s + I, a = o - s, A = s - (o - a) + (I - a), I = n[++u]), s = o, A !== 0 && (r[p++] = A);
  for (; l < i; )
    o = s + g, a = o - s, A = s - (o - a) + (g - a), g = t[++l], s = o, A !== 0 && (r[p++] = A);
  for (; u < e; )
    o = s + I, a = o - s, A = s - (o - a) + (I - a), I = n[++u], s = o, A !== 0 && (r[p++] = A);
  return (s !== 0 || p === 0) && (r[p++] = s), p;
}
function fl(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function oi(i) {
  return new Float64Array(i);
}
const dl = (3 + 16 * Me) * Me, pl = (2 + 12 * Me) * Me, ml = (9 + 64 * Me) * Me * Me, cn = oi(4), xo = oi(8), Mo = oi(12), So = oi(16), Zt = oi(4);
function yl(i, t, e, n, r, s, o) {
  let A, a, g, I, l, u, p, m, c, C, h, d, S, w, f, y, v, x;
  const M = i - r, E = e - r, T = t - s, R = n - s;
  w = M * R, u = Ft * M, p = u - (u - M), m = M - p, u = Ft * R, c = u - (u - R), C = R - c, f = m * C - (w - p * c - m * c - p * C), y = T * E, u = Ft * T, p = u - (u - T), m = T - p, u = Ft * E, c = u - (u - E), C = E - c, v = m * C - (y - p * c - m * c - p * C), h = f - v, l = f - h, cn[0] = f - (h + l) + (l - v), d = w + h, l = d - w, S = w - (d - l) + (h - l), h = S - y, l = S - h, cn[1] = S - (h + l) + (l - y), x = d + h, l = x - d, cn[2] = d - (x - l) + (h - l), cn[3] = x;
  let L = fl(4, cn), D = pl * o;
  if (L >= D || -L >= D || (l = i - M, A = i - (M + l) + (l - r), l = e - E, g = e - (E + l) + (l - r), l = t - T, a = t - (T + l) + (l - s), l = n - R, I = n - (R + l) + (l - s), A === 0 && a === 0 && g === 0 && I === 0) || (D = ml * o + hl * Math.abs(L), L += M * I + R * A - (T * g + E * a), L >= D || -L >= D)) return L;
  w = A * R, u = Ft * A, p = u - (u - A), m = A - p, u = Ft * R, c = u - (u - R), C = R - c, f = m * C - (w - p * c - m * c - p * C), y = a * E, u = Ft * a, p = u - (u - a), m = a - p, u = Ft * E, c = u - (u - E), C = E - c, v = m * C - (y - p * c - m * c - p * C), h = f - v, l = f - h, Zt[0] = f - (h + l) + (l - v), d = w + h, l = d - w, S = w - (d - l) + (h - l), h = S - y, l = S - h, Zt[1] = S - (h + l) + (l - y), x = d + h, l = x - d, Zt[2] = d - (x - l) + (h - l), Zt[3] = x;
  const G = mr(4, cn, 4, Zt, xo);
  w = M * I, u = Ft * M, p = u - (u - M), m = M - p, u = Ft * I, c = u - (u - I), C = I - c, f = m * C - (w - p * c - m * c - p * C), y = T * g, u = Ft * T, p = u - (u - T), m = T - p, u = Ft * g, c = u - (u - g), C = g - c, v = m * C - (y - p * c - m * c - p * C), h = f - v, l = f - h, Zt[0] = f - (h + l) + (l - v), d = w + h, l = d - w, S = w - (d - l) + (h - l), h = S - y, l = S - h, Zt[1] = S - (h + l) + (l - y), x = d + h, l = x - d, Zt[2] = d - (x - l) + (h - l), Zt[3] = x;
  const U = mr(G, xo, 4, Zt, Mo);
  w = A * I, u = Ft * A, p = u - (u - A), m = A - p, u = Ft * I, c = u - (u - I), C = I - c, f = m * C - (w - p * c - m * c - p * C), y = a * g, u = Ft * a, p = u - (u - a), m = a - p, u = Ft * g, c = u - (u - g), C = g - c, v = m * C - (y - p * c - m * c - p * C), h = f - v, l = f - h, Zt[0] = f - (h + l) + (l - v), d = w + h, l = d - w, S = w - (d - l) + (h - l), h = S - y, l = S - h, Zt[1] = S - (h + l) + (l - y), x = d + h, l = x - d, Zt[2] = d - (x - l) + (h - l), Zt[3] = x;
  const P = mr(U, Mo, 4, Zt, So);
  return So[P - 1];
}
function vl(i, t, e, n, r, s) {
  const o = (t - s) * (e - r), A = (i - r) * (n - s), a = o - A, g = Math.abs(o + A);
  return Math.abs(a) >= dl * g ? a : -yl(i, t, e, n, r, s, g);
}
function wl(i, t) {
  var e, n, r = 0, s, o, A, a, g, I, l, u = i[0], p = i[1], m = t.length;
  for (e = 0; e < m; e++) {
    n = 0;
    var c = t[e], C = c.length - 1;
    if (I = c[0], I[0] !== c[C][0] && I[1] !== c[C][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (o = I[0] - u, A = I[1] - p, n; n < C; n++) {
      if (l = c[n + 1], a = l[0] - u, g = l[1] - p, A === 0 && g === 0) {
        if (a <= 0 && o >= 0 || o <= 0 && a >= 0)
          return 0;
      } else if (g >= 0 && A <= 0 || g <= 0 && A >= 0) {
        if (s = vl(o, a, A, g, 0, 0), s === 0)
          return 0;
        (s > 0 && g > 0 && A <= 0 || s < 0 && g <= 0 && A > 0) && r++;
      }
      I = l, A = g, o = a;
    }
  }
  return r % 2 !== 0;
}
function bl(i, t, e = {}) {
  if (!i)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = Cl(i), r = ul(t), s = r.type, o = t.bbox;
  let A = r.coordinates;
  if (o && El(n, o) === !1)
    return !1;
  s === "Polygon" && (A = [A]);
  for (var a = 0; a < A.length; ++a) {
    const g = wl(n, A[a]);
    if (g === 0 && !e.ignoreBoundary) return !0;
    if (g) return !0;
  }
  return !1;
}
function El(i, t) {
  return t[0] <= i[0] && t[1] <= i[1] && t[2] >= i[0] && t[3] >= i[1];
}
class KA {
  constructor(t = [], e = xl) {
    if (this.data = t, this.length = this.data.length, this.compare = e, this.length > 0)
      for (let n = (this.length >> 1) - 1; n >= 0; n--) this._down(n);
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
    const { data: e, compare: n } = this, r = e[t];
    for (; t > 0; ) {
      const s = t - 1 >> 1, o = e[s];
      if (n(r, o) >= 0) break;
      e[t] = o, t = s;
    }
    e[t] = r;
  }
  _down(t) {
    const { data: e, compare: n } = this, r = this.length >> 1, s = e[t];
    for (; t < r; ) {
      let o = (t << 1) + 1, A = e[o];
      const a = o + 1;
      if (a < this.length && n(e[a], A) < 0 && (o = a, A = e[a]), n(A, s) >= 0) break;
      e[t] = A, t = o;
    }
    e[t] = s;
  }
}
function xl(i, t) {
  return i < t ? -1 : i > t ? 1 : 0;
}
const Se = 11102230246251565e-32, jt = 134217729, Ml = (3 + 8 * Se) * Se;
function yr(i, t, e, n, r) {
  let s, o, A, a, g = t[0], I = n[0], l = 0, u = 0;
  I > g == I > -g ? (s = g, g = t[++l]) : (s = I, I = n[++u]);
  let p = 0;
  if (l < i && u < e)
    for (I > g == I > -g ? (o = g + s, A = s - (o - g), g = t[++l]) : (o = I + s, A = s - (o - I), I = n[++u]), s = o, A !== 0 && (r[p++] = A); l < i && u < e; )
      I > g == I > -g ? (o = s + g, a = o - s, A = s - (o - a) + (g - a), g = t[++l]) : (o = s + I, a = o - s, A = s - (o - a) + (I - a), I = n[++u]), s = o, A !== 0 && (r[p++] = A);
  for (; l < i; )
    o = s + g, a = o - s, A = s - (o - a) + (g - a), g = t[++l], s = o, A !== 0 && (r[p++] = A);
  for (; u < e; )
    o = s + I, a = o - s, A = s - (o - a) + (I - a), I = n[++u], s = o, A !== 0 && (r[p++] = A);
  return (s !== 0 || p === 0) && (r[p++] = s), p;
}
function Sl(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function Ai(i) {
  return new Float64Array(i);
}
const Tl = (3 + 16 * Se) * Se, Rl = (2 + 12 * Se) * Se, Pl = (9 + 64 * Se) * Se * Se, ln = Ai(4), To = Ai(8), Ro = Ai(12), Po = Ai(16), Vt = Ai(4);
function kl(i, t, e, n, r, s, o) {
  let A, a, g, I, l, u, p, m, c, C, h, d, S, w, f, y, v, x;
  const M = i - r, E = e - r, T = t - s, R = n - s;
  w = M * R, u = jt * M, p = u - (u - M), m = M - p, u = jt * R, c = u - (u - R), C = R - c, f = m * C - (w - p * c - m * c - p * C), y = T * E, u = jt * T, p = u - (u - T), m = T - p, u = jt * E, c = u - (u - E), C = E - c, v = m * C - (y - p * c - m * c - p * C), h = f - v, l = f - h, ln[0] = f - (h + l) + (l - v), d = w + h, l = d - w, S = w - (d - l) + (h - l), h = S - y, l = S - h, ln[1] = S - (h + l) + (l - y), x = d + h, l = x - d, ln[2] = d - (x - l) + (h - l), ln[3] = x;
  let L = Sl(4, ln), D = Rl * o;
  if (L >= D || -L >= D || (l = i - M, A = i - (M + l) + (l - r), l = e - E, g = e - (E + l) + (l - r), l = t - T, a = t - (T + l) + (l - s), l = n - R, I = n - (R + l) + (l - s), A === 0 && a === 0 && g === 0 && I === 0) || (D = Pl * o + Ml * Math.abs(L), L += M * I + R * A - (T * g + E * a), L >= D || -L >= D)) return L;
  w = A * R, u = jt * A, p = u - (u - A), m = A - p, u = jt * R, c = u - (u - R), C = R - c, f = m * C - (w - p * c - m * c - p * C), y = a * E, u = jt * a, p = u - (u - a), m = a - p, u = jt * E, c = u - (u - E), C = E - c, v = m * C - (y - p * c - m * c - p * C), h = f - v, l = f - h, Vt[0] = f - (h + l) + (l - v), d = w + h, l = d - w, S = w - (d - l) + (h - l), h = S - y, l = S - h, Vt[1] = S - (h + l) + (l - y), x = d + h, l = x - d, Vt[2] = d - (x - l) + (h - l), Vt[3] = x;
  const G = yr(4, ln, 4, Vt, To);
  w = M * I, u = jt * M, p = u - (u - M), m = M - p, u = jt * I, c = u - (u - I), C = I - c, f = m * C - (w - p * c - m * c - p * C), y = T * g, u = jt * T, p = u - (u - T), m = T - p, u = jt * g, c = u - (u - g), C = g - c, v = m * C - (y - p * c - m * c - p * C), h = f - v, l = f - h, Vt[0] = f - (h + l) + (l - v), d = w + h, l = d - w, S = w - (d - l) + (h - l), h = S - y, l = S - h, Vt[1] = S - (h + l) + (l - y), x = d + h, l = x - d, Vt[2] = d - (x - l) + (h - l), Vt[3] = x;
  const U = yr(G, To, 4, Vt, Ro);
  w = A * I, u = jt * A, p = u - (u - A), m = A - p, u = jt * I, c = u - (u - I), C = I - c, f = m * C - (w - p * c - m * c - p * C), y = a * g, u = jt * a, p = u - (u - a), m = a - p, u = jt * g, c = u - (u - g), C = g - c, v = m * C - (y - p * c - m * c - p * C), h = f - v, l = f - h, Vt[0] = f - (h + l) + (l - v), d = w + h, l = d - w, S = w - (d - l) + (h - l), h = S - y, l = S - h, Vt[1] = S - (h + l) + (l - y), x = d + h, l = x - d, Vt[2] = d - (x - l) + (h - l), Vt[3] = x;
  const P = yr(U, Ro, 4, Vt, Po);
  return Po[P - 1];
}
function ko(i, t, e, n, r, s) {
  const o = (t - s) * (e - r), A = (i - r) * (n - s), a = o - A;
  if (o === 0 || A === 0 || o > 0 != A > 0) return a;
  const g = Math.abs(o + A);
  return Math.abs(a) >= Tl * g ? a : -kl(i, t, e, n, r, s, g);
}
function _l(i, t) {
  const e = new KA([], JA);
  return Ll(i, e), Bl(e, t);
}
function JA(i, t) {
  return i.p.x > t.p.x ? 1 : i.p.x < t.p.x || i.p.x === t.p.x && (i.featureId !== t.featureId || i.ringId !== t.ringId) && i.isLeftEndpoint && !t.isLeftEndpoint ? -1 : i.p.y !== t.p.y ? i.p.y > t.p.y ? 1 : -1 : 1;
}
function Ol(i, t) {
  return i.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : i.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : i.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? i.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function Ll(i, t) {
  {
    const e = i.features;
    for (let n = 0; n < e.length; n++)
      Dl(e[n], t);
  }
}
var vi = 0, wi = 0, bi = 0;
function Dl(i, t) {
  const e = i.type === "Feature" ? i.geometry : i;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let r = 0; r < n.length; r++)
    for (let s = 0; s < n[r].length; s++) {
      let o = n[r][s][0], A = null;
      wi = wi + 1;
      for (let a = 0; a < n[r][s].length - 1; a++) {
        A = n[r][s][a + 1];
        const g = new _o(o, vi, wi, bi), I = new _o(A, vi, wi, bi + 1);
        g.otherEvent = I, I.otherEvent = g, JA(g, I) > 0 ? (I.isLeftEndpoint = !0, g.isLeftEndpoint = !1) : (g.isLeftEndpoint = !0, I.isLeftEndpoint = !1), t.push(g), t.push(I), o = A, bi = bi + 1;
      }
    }
  vi = vi + 1;
}
var _o = class {
  constructor(i, t, e, n) {
    this.p = {
      x: i[0],
      y: i[1]
    }, this.featureId = t, this.ringId = e, this.eventId = n, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(i) {
    return this.p.x === i.p.x && this.p.y === i.p.y;
  }
  asNewXY() {
    return [this.p.x, this.p.y];
  }
};
function Bl(i, t = !1) {
  const e = [], n = new KA([], Ol);
  for (; i.length; ) {
    const r = i.pop();
    if (r.isLeftEndpoint) {
      const s = new Nl(r);
      for (let o = 0; o < n.data.length; o++) {
        const A = n.data[o];
        if (t && A.leftSweepEvent.featureId === r.featureId)
          continue;
        const a = Gl(s, A);
        a !== !1 && e.push(a);
      }
      n.push(s);
    } else r.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var Nl = class {
  /** @param event must have otherEvent non-null */
  constructor(i) {
    this.leftSweepEvent = i, this.rightSweepEvent = i.otherEvent;
  }
};
function Gl(i, t) {
  if (i === null || t === null) return !1;
  const e = i.leftSweepEvent.p.x, n = i.leftSweepEvent.p.y, r = i.rightSweepEvent.p.x, s = i.rightSweepEvent.p.y, o = t.leftSweepEvent.p.x, A = t.leftSweepEvent.p.y, a = t.rightSweepEvent.p.x, g = t.rightSweepEvent.p.y, I = ko(e, n, r, s, o, A), l = ko(e, n, r, s, a, g);
  if (I > 0 && l > 0) return !1;
  if (I < 0 && l < 0) return !1;
  if (i.leftSweepEvent.ringId === t.leftSweepEvent.ringId) {
    if (i.rightSweepEvent.isSamePoint(t.leftSweepEvent) || i.rightSweepEvent.isSamePoint(t.rightSweepEvent) || i.leftSweepEvent.isSamePoint(t.leftSweepEvent) || i.leftSweepEvent.isSamePoint(t.rightSweepEvent))
      return !1;
  } else {
    if (i.rightSweepEvent.isSamePoint(t.leftSweepEvent))
      return t.leftSweepEvent.asNewXY();
    if (i.rightSweepEvent.isSamePoint(t.rightSweepEvent))
      return t.rightSweepEvent.asNewXY();
    if (i.leftSweepEvent.isSamePoint(t.leftSweepEvent))
      return t.leftSweepEvent.asNewXY();
    if (i.leftSweepEvent.isSamePoint(t.rightSweepEvent))
      return t.rightSweepEvent.asNewXY();
  }
  const u = (g - A) * (r - e) - (a - o) * (s - n), p = (a - o) * (n - A) - (g - A) * (e - o), m = (r - e) * (n - A) - (s - n) * (e - o);
  if (u === 0)
    return !1;
  const c = p / u, C = m / u;
  if (c >= 0 && c <= 1 && C >= 0 && C <= 1) {
    const h = e + c * (r - e), d = n + c * (s - n);
    return [h, d];
  }
  return !1;
}
function Fl(i, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: r = !0 } = e;
  let s = [];
  i.type === "FeatureCollection" ? s = s.concat(i.features) : i.type === "Feature" ? s.push(i) : (i.type === "LineString" || i.type === "Polygon" || i.type === "MultiLineString" || i.type === "MultiPolygon") && s.push(ti(i)), t.type === "FeatureCollection" ? s = s.concat(t.features) : t.type === "Feature" ? s.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && s.push(ti(t));
  const o = _l(
    bo(s),
    r
  );
  let A = [];
  if (n) {
    const a = {};
    o.forEach((g) => {
      const I = g.join(",");
      a[I] || (a[I] = !0, A.push(g));
    });
  } else
    A = o;
  return bo(A.map((a) => HA(a)));
}
function jl(i, t = {}) {
  let e = 0, n = 0, r = 0;
  return YA(
    i,
    function(s) {
      e += s[0], n += s[1], r++;
    }
  ), HA([e / r, n / r], t.properties);
}
function qA(i) {
  class t extends i {
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
    static isBasemap_ = !1;
    static isWmts_ = !0;
    static isMapbox_ = !1;
    static isMapLibre_ = !1;
    initialize(n) {
      if (n = he(n), this.mapID = n.mapID, this.homePosition = n.homePosition, this.mercZoom = n.mercZoom, this.label = n.label, this.maxZoom = n.maxZoom, this.minZoom = n.minZoom, this.poiTemplate = n.poiTemplate, this.poiStyle = n.poiStyle, this.iconTemplate = n.iconTemplate, this.icon = n.icon, this.selectedIcon = n.selectedIcon, this.mercatorXShift = n.mercatorXShift, this.mercatorYShift = n.mercatorYShift, this.weiwudi = n.weiwudi, n.envelopeLngLats) {
        const A = n.envelopeLngLats.map(
          (a) => $t(a, "EPSG:4326", "EPSG:3857")
        );
        A.push(A[0]), this.envelope = QA([A]), this.centroid = jl(this.envelope).geometry?.coordinates;
      }
      for (let o = 0; o < Wn.length; o++) {
        const A = Wn[o], a = ig[o];
        this.set(A, n[a] || n[A]);
      }
      const r = n.thumbnail ? new Promise((o) => {
        this.thumbnail = n.thumbnail, o(void 0);
      }) : new Promise((o) => {
        this.thumbnail = `./tmbs/${n.mapID}.jpg`, fetch(this.thumbnail).then((A) => {
          A.ok || (this.thumbnail = `./tmbs/${n.mapID}_menu.jpg`), o(void 0);
        }).catch((A) => {
          this.thumbnail = `./tmbs/${n.mapID}_menu.jpg`, o(void 0);
        });
      }).catch((o) => {
        this.thumbnail = `./tmbs/${n.mapID || n.sourceID}_menu.jpg`;
      }), s = this.resolvePois(n.pois);
      this.initialWait = Promise.all([s, r]), zl(this);
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
        const n = await this.weiwudi.stats(), r = this.weiwudi.totalTile;
        return n && typeof n == "object" && n.total == null && typeof r == "number" ? { ...n, total: r } : n;
      } catch {
        return {};
      }
    }
    async getTileCacheSizeAsync() {
      return (await this.getTileCacheStatsAsync()).size || 0;
    }
    async fetchAllTileCacheAsync(n) {
      if (this.weiwudi)
        try {
          const r = (o) => {
            n(o.type, o.detail);
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
    setMap(n) {
      this._map = n;
    }
    // 経緯度lnglat、メルカトルズームmercZoom、地図ズームzoom、方角direction、地図回転rotation等を指定し地図移動
    setViewpointRadian(n) {
      let r, s;
      const o = n.mercZoom, A = n.zoom, a = n.direction, g = n.rotation, I = this.getMap(), l = I?.getView(), u = I ? I.getSize() : void 0;
      l && (!u || u[0] <= 0 || u[1] <= 0) || (n.latitude !== void 0 && n.longitude !== void 0 && (r = $t(
        [n.longitude, n.latitude],
        "EPSG:4326",
        "EPSG:3857"
      )), n.x !== void 0 && n.y != null && (s = [n.x, n.y]), this.viewpoint2MercsAsync().then((p) => this.mercs2MercViewpoint(p)).then((p) => {
        const m = this.mercViewpoint2Mercs([
          r || p[0],
          o || p[1] || 17,
          a ?? g ?? p[2]
        ]);
        this.mercs2ViewpointAsync(m).then((c) => {
          r != null ? l?.setCenter(c[0]) : s != null && l?.setCenter(s), o != null ? l?.setZoom(c[1]) : A != null && l?.setZoom(A), a != null ? l?.setRotation(c[2]) : g != null && l?.setRotation(g);
        });
      }));
    }
    setViewpoint(n) {
      const r = { ...n };
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
    setGPSMarkerAsync(n, r = !1) {
      const s = this.getMap(), o = s?.getView();
      if (!n)
        return new Promise((a, g) => {
          s?.setGPSPosition(null), a(!0);
        });
      const A = this.mercsFromGPSValue(n.lnglat, n.acc);
      return this.mercs2SysCoordsAsync_multiLayer([A]).then((a) => {
        const g = !a[0], I = g ? a[1] : a[0];
        if (!I || !this.insideCheckSysCoord(I[0][0]))
          return s?.setGPSPosition(null), !1;
        const l = g ? null : a[1], u = { xy: I[0][0] }, p = I[0].slice(1);
        return u.rad = p.reduce(
          (m, c, C) => {
            const h = m + Math.sqrt(
              Math.pow(c[0] - u.xy[0], 2) + Math.pow(c[1] - u.xy[1], 2)
            );
            return C === 3 ? h / 4 : h;
          },
          0
        ), r || o?.setCenter(u.xy), s?.setGPSPosition(u, g ? "hide" : null), l && s?.setGPSPosition({ xy: l[0][0] }, "sub"), !0;
      }).catch((a) => {
        throw a;
      });
    }
    setGPSMarker(n, r = !1) {
      this.setGPSMarkerAsync(n, r).then(() => {
      });
    }
    mercsFromGPSValue(n, r) {
      const s = $t(n, "EPSG:4326", "EPSG:3857"), o = n[1] * Math.PI / 180, A = r / Math.cos(o);
      return UA.map((a) => [
        a[0] * A + s[0],
        a[1] * A + s[1]
      ]);
    }
    // 与えられた差分行列を回転。theta無指定の場合は自動取得
    rotateMatrix(n, r) {
      return r === void 0 && (r = this.getMap().getView().getRotation()), zA(n, r);
    }
    async resolvePois(n) {
      this.pois = await WA(n || [], {
        name: this.officialTitle || this.title,
        namespace: this.mapID
      });
    }
    getPoi(n) {
      let r;
      return Object.keys(this.pois).map((s) => {
        this.pois[s].pois.map((o, A) => {
          o.id === n && (r = this.pois[s].pois[A]);
        });
      }), r;
    }
    addPoi(n, r) {
      if (r || (r = "main"), this.pois[r])
        return n = $n(n), this.pois[r].pois.push(n), ps(this.pois, r, {
          name: this.officialTitle || this.title,
          namespace: this.mapID
        }), n.namespaceID;
    }
    removePoi(n) {
      Object.keys(this.pois).forEach((r) => {
        const s = this.pois[r].pois;
        for (let o = s.length - 1; o >= 0; o--)
          s[o].id === n && s.splice(o, 1);
      });
    }
    clearPoi(n) {
      n || (n = "main"), n === "all" ? Object.keys(this.pois).map((r) => {
        this.pois[r].pois = [];
      }) : this.pois[n] && (this.pois[n].pois = []);
    }
    listPoiLayers(n = !1, r = !1) {
      return Object.keys(this.pois).sort((s, o) => s === "main" ? -1 : o === "main" ? 1 : 0).map((s) => this.pois[s]).filter(
        (s) => r ? n ? s.pois.length && s.hide : s.pois.length : n ? s.hide : !0
      );
    }
    getPoiLayer(n) {
      return this.pois[n];
    }
    addPoiLayer(n, r) {
      n !== "main" && (this.pois[n] || (this.pois[n] = Be(r || [], n, {
        name: this.officialTitle || this.title,
        namespace: this.mapID
      })));
    }
    removePoiLayer(n) {
      n !== "main" && this.pois[n] && delete this.pois[n];
    }
    merc2SysCoordAsync_ignoreBackground(n) {
      return this.merc2XyAsync_ignoreBackground(n).then(
        (r) => r ? this.xy2SysCoord(r) : void 0
      );
    }
    merc2SysCoordAsync(n) {
      return this.merc2XyAsync(n).then(
        (r) => r && this.xy2SysCoord(r)
      );
    }
    sysCoord2MercAsync(n) {
      const r = this.sysCoord2Xy(n);
      return this.xy2MercAsync(r);
    }
    // size(画面サイズ)とズームから、地図面座標上での半径を得る。zoom無指定の場合は自動取得
    zoom2Radius(n, r) {
      return r === void 0 && (r = this.getMap().getView().getDecimalZoom()), ds(n, r);
    }
    // 画面サイズと地図ズームから、地図面座標上での5座標を取得する。zoom, rotate無指定の場合は自動取得
    viewpoint2SysCoords(n, r) {
      return this.mercViewpoint2Mercs(n, r);
    }
    mercViewpoint2Mercs(n, r) {
      let s = n ? n[0] : void 0;
      const o = n ? n[1] : void 0, A = n ? n[2] : void 0;
      s === void 0 && (s = this.getMap().getView().getCenter()), r === void 0 && (r = this.getMap().getSize());
      const a = o ?? this.getMap().getView().getDecimalZoom(), g = A ?? this.getMap().getView().getRotation();
      return [Hr(
        s,
        a,
        g,
        r
      ), r];
    }
    // 地図座標5地点情報から地図サイズ情報（中心座標、サイズ、回転）を得る
    sysCoords2Viewpoint(n) {
      return this.mercs2MercViewpoint(n);
    }
    // メルカトル5地点情報からメルカトル地図でのサイズ情報（中心座標、サイズ、回転）を得る
    mercs2MercViewpoint(n) {
      let r = n[1];
      r || (r = this.getMap().getSize());
      const s = Qr(
        n[0],
        r
      );
      return [s.center, s.zoom, s.rotation];
    }
    sysCoords2Xys(n) {
      return [
        n[0].map((r) => this.sysCoord2Xy(r)),
        n[1]
      ];
    }
    xys2SysCoords(n) {
      return [n[0].map((r) => this.xy2SysCoord(r)), n[1]];
    }
    mercs2XysAsync(n) {
      return Promise.all(n[0].map((r) => this.merc2XyAsync(r))).then(
        (r) => [r, n[1]]
      );
    }
    xys2MercsAsync(n) {
      return Promise.all(n[0].map((r) => this.xy2MercAsync(r))).then(
        (r) => [r, n[1]]
      );
    }
    static async createAsync(n) {
      return new this(n);
    }
  }
  return t;
}
function $A(i) {
  class t extends qA(i) {
    static isBasemap_ = !0;
    static isWmts_ = !0;
    insideCheckXy(n) {
      return this.envelope ? bl(n, this.envelope) : !0;
    }
    insideCheckSysCoord(n) {
      return this.insideCheckXy(n);
    }
    modulateXyInside(n) {
      if (!this.centroid) return n;
      const r = Il([n, this.centroid]), s = Fl(this.envelope, r);
      return s.features.length > 0 && s.features[0].geometry ? s.features[0].geometry.coordinates : n;
    }
    modulateSysCoordInside(n) {
      return this.modulateXyInside(n);
    }
    // unifyTerm対応
    // https://github.com/code4history/MaplatCore/issues/19
    merc2XyAsync(n) {
      return Promise.resolve(n);
    }
    merc2XyAsync_ignoreBackground(n) {
      return this.merc2XyAsync(n);
    }
    xy2MercAsync(n) {
      return Promise.resolve(n);
    }
    xy2SysCoord(n) {
      return n;
    }
    sysCoord2Xy(n) {
      return n;
    }
    viewpoint2MercsAsync(n, r) {
      const s = this.viewpoint2SysCoords(n, r), o = this.sysCoords2Xys(s);
      return this.xys2MercsAsync(o);
    }
    mercs2ViewpointAsync(n) {
      return this.mercs2XysAsync(n).then((r) => {
        const s = this.xys2SysCoords(r);
        return this.sysCoords2Viewpoint(s);
      });
    }
    mercs2SysCoordsAsync_multiLayer(n) {
      return Promise.all(
        n[0].map((r) => this.merc2SysCoordAsync(r))
      ).then((r) => [[r, n[1]]]);
    }
    defZoom() {
      return this.mercZoom;
    }
  }
  return t;
}
function Ul(i) {
  class t extends qA(i) {
    static isBasemap_ = !1;
    static isWmts_ = !1;
    width = 0;
    height = 0;
    _maxxy = 0;
    insideCheckXy(n) {
      return !(n[0] < 0 || n[0] > this.width || n[1] < 0 || n[1] > this.height);
    }
    insideCheckSysCoord(n) {
      return this.insideCheckXy(this.sysCoord2Xy(n));
    }
    modulateXyInside(n) {
      const r = n[0] / (this.width / 2) - 1, s = n[1] / (this.height / 2) - 1, o = Math.max(Math.abs(r), Math.abs(s));
      return [
        (r / o + 1) * this.width / 2,
        (s / o + 1) * this.height / 2
      ];
    }
    modulateSysCoordInside(n) {
      const r = this.sysCoord2Xy(n), s = this.modulateXyInside(r);
      return this.xy2SysCoord(s);
    }
    // unifyTerm対応
    // https://github.com/code4history/MaplatCore/issues/19
    xy2SysCoord(n) {
      const r = n[0] * (2 * dt) / this._maxxy - dt, s = -1 * (n[1] * (2 * dt) / this._maxxy - dt);
      return [r, s];
    }
    sysCoord2Xy(n) {
      const r = (n[0] + dt) * this._maxxy / (2 * dt), s = (-n[1] + dt) * this._maxxy / (2 * dt);
      return [r, s];
    }
    defZoom(n) {
      const r = n[0], s = n[1], o = Math.log2((r - 10) / this.width), A = Math.log2((s - 10) / this.height), a = this.maxZoom;
      let g;
      return A > o ? g = A : g = o, a + g;
    }
  }
  return t;
}
const Kr = (i) => (i || "").match(/^(?:google(?:_(?:roadmap|satellite|hybrid|terrain))?|mapbox|maplibre)$/);
function ta(i) {
  return i = he(i), i.imageExtension || (i.imageExtension = "jpg"), Kr(i.maptype) ? (delete i.url, delete i.urls) : i.mapID && !i.url && !i.urls && (i.url = i.tms ? `tiles/${i.mapID}/{z}/{x}/{-y}.${i.imageExtension}` : `tiles/${i.mapID}/{z}/{x}/{y}.${i.imageExtension}`), i;
}
function zl(i) {
  const t = i;
  i.setTileLoadFunction(
    (function() {
      const e = t.getTileLoadFunction(), n = [1e3, 2e3, 4e3], r = /* @__PURE__ */ new WeakMap();
      let s = !1;
      const o = function(a, g) {
        s || (s = !0, console.warn(
          "Maplat: tile composition failed by an exception; retrying (up to 3 times)",
          g
        ));
        const I = r.get(a) ?? 0;
        I >= n.length || (r.set(a, I + 1), setTimeout(() => {
          const l = t.getMap?.()?.getTargetElement?.();
          l && !l.isConnected || a.getState?.() === Lc.ERROR && a.load();
        }, n[I]));
      }, A = function(a, g, I, l, u, p, m) {
        return new Promise((c, C) => {
          const h = function(d, S = void 0) {
            const w = document.createElement("img");
            w.crossOrigin = "Anonymous", w.onload = w.onerror = function() {
              try {
                if (w.width && w.height) {
                  const f = I.getContext("2d"), y = l === 0 ? 256 - p : 0, v = u === 0 ? 256 - m : 0;
                  p = l + p > w.width ? w.width - l : p, m = u + m > w.height ? w.height - u : m, f.drawImage(w, l, u, p, m, y, v, p, m), c(void 0);
                } else
                  S ? h(S) : c("tileLoadError");
              } catch {
                c("tileException");
              }
            }, w.src = d;
          };
          h(g);
        });
      };
      return function(a, g) {
        const I = a.tileCoord[0];
        let l = a.tileCoord[1], u = a.tileCoord[2], p = Math.round(
          (t.mercatorXShift || 0) * 128 * Math.pow(2, I) / dt
        ), m = Math.round(
          (t.mercatorYShift || 0) * -128 * Math.pow(2, I) / dt
        );
        for (; p < 0 || p >= 256; )
          p < 0 ? (p = p + 256, l++) : (p = p - 256, l--);
        for (; m < 0 || m >= 256; )
          m < 0 ? (m = m + 256, u++) : (m = m - 256, u--);
        const c = document.createElement("div");
        c.innerHTML = gl;
        const C = c.childNodes[0], h = [
          [[I, l, u], 0, 0, 256 - p, 256 - m]
        ];
        p !== 0 && h.push([
          [I, l - 1, u],
          256 - p,
          0,
          p,
          256 - m
        ]), m !== 0 && (h.push([
          [I, l, u - 1],
          0,
          256 - m,
          256 - p,
          m
        ]), p !== 0 && h.push([
          [I, l - 1, u - 1],
          256 - p,
          256 - m,
          p,
          m
        ])), Promise.all(
          h.map((d) => {
            const S = t.tileUrlFunction(
              d[0],
              t.tilePixelRatio_,
              t.projection_
            );
            return A(
              d[0],
              S,
              C,
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
            const w = C.toDataURL(), f = a.getImage();
            f.crossOrigin = null, e(a, w), r.delete(a);
          }
        }).catch((d) => {
          a.handleImageError_(), o(a, d);
        });
      };
    })()
  );
}
class Sn extends $A(IA) {
  constructor(t = {}) {
    const e = ta(t);
    if (super(e), t.mapID && (this.mapID = t.mapID), t.mapID === "morioka_ndl_affine") {
      const n = this.getTileUrlFunction();
      this.setTileUrlFunction((r, s, o) => n(r, s, o));
    }
    this.initialize(t);
  }
}
class Gi extends Sn {
  style = "";
  accessToken = "";
  mapboxMap;
  static isMapbox_ = !0;
  constructor(t = {}) {
    super(t), this.style = t.style, this.mapboxMap = t.mapboxMap, this.accessToken = t.accessToken;
  }
}
class Fi extends Sn {
  style = "";
  maplibreMap;
  static isMapLibre_ = !0;
  constructor(t = {}) {
    super(t), this.style = t.style || "https://tile.openstreetmap.jp/styles/osm-bright/style.json", this.maplibreMap = t.maplibreMap;
  }
}
function Xl(i, t) {
  const n = i ? {
    google_roadmap: { mapType: "roadmap", derivedLayers: [] },
    google_satellite: { mapType: "satellite", derivedLayers: [] },
    google_hybrid: { mapType: "satellite", derivedLayers: ["layerRoadmap"] },
    google_terrain: { mapType: "terrain", derivedLayers: ["layerRoadmap"] }
  }[i] : void 0, r = n?.mapType ?? "roadmap", s = n?.derivedLayers ?? [], o = (t || []).map(
    (a) => `layer${a.charAt(0).toUpperCase()}${a.slice(1).toLowerCase()}`
  ), A = new Set(s);
  for (const a of o) A.add(a);
  return { mapType: r, layerTypes: [...A] };
}
class Jr extends $A(tg) {
  constructor(t = {}) {
    const e = Object.assign({}, t), { mapType: n, layerTypes: r } = Xl(t.maptype, t.layers);
    e.mapType = n, e.layerTypes = r, super(e), t.mapID && (this.mapID = t.mapID), this.initialize(t);
  }
}
const Oe = {
  ANIMATING: 0,
  INTERACTING: 1
}, Ae = {
  CENTER: "center",
  RESOLUTION: "resolution",
  ROTATION: "rotation"
};
function Oo(i, t, e) {
  return (
    /**
     * @param {import("./coordinate.js").Coordinate|undefined} center Center.
     * @param {number|undefined} resolution Resolution.
     * @param {import("./size.js").Size} size Viewport size; unused if `onlyCenter` was specified.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @param {Array<number>} [centerShift] Shift between map center and viewport center.
     * @return {import("./coordinate.js").Coordinate|undefined} Center.
     */
    (function(n, r, s, o, A) {
      if (!n)
        return;
      if (!r && !t)
        return n;
      const a = t ? 0 : s[0] * (r ?? 0), g = t ? 0 : s[1] * (r ?? 0), I = A ? A[0] : 0, l = A ? A[1] : 0;
      let u = i[0] + a / 2 + I, p = i[2] - a / 2 + I, m = i[1] + g / 2 + l, c = i[3] - g / 2 + l;
      u > p && (u = (p + u) / 2, p = u), m > c && (m = (c + m) / 2, c = m);
      let C = ae(n[0], u, p), h = ae(n[1], m, c);
      if (o && e && r) {
        const d = 30 * r;
        C += -d * Math.log(1 + Math.max(0, u - n[0]) / d) + d * Math.log(1 + Math.max(0, n[0] - p) / d), h += -d * Math.log(1 + Math.max(0, m - n[1]) / d) + d * Math.log(1 + Math.max(0, n[1] - c) / d);
      }
      return [C, h];
    })
  );
}
function Zl(i) {
  return i;
}
function Vl(i) {
  return Math.pow(i, 3);
}
function Yi(i) {
  return 1 - Vl(1 - i);
}
function Wl(i) {
  return 3 * i * i - 2 * i * i * i;
}
function Hl(i) {
  return i;
}
function ms(i, t, e, n) {
  const r = ss(t) / e[0], s = Hn(t) / e[1];
  return n ? Math.min(i, Math.max(r, s)) : Math.min(i, Math.min(r, s));
}
function ys(i, t, e) {
  let n = Math.min(i, t);
  const r = 50;
  return n *= Math.log(1 + r * Math.max(0, i / t - 1)) / r + 1, e && (n = Math.max(n, e), n /= Math.log(1 + r * Math.max(0, e / i - 1)) / r + 1), ae(n, e / 2, t * 2);
}
function Ql(i, t, e, n) {
  return t = t !== void 0 ? t : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(r, s, o, A) {
    if (r !== void 0) {
      const a = i[0], g = i[i.length - 1], I = e ? ms(
        a,
        e,
        o,
        !!n
      ) : a;
      if (A)
        return t ? ys(
          r,
          I,
          g
        ) : ae(r, g, I);
      const l = Math.min(I, r), u = Math.floor(fA(i, l, s));
      return i[u] > I && u < i.length - 1 ? i[u + 1] : i[u];
    }
  });
}
function Yl(i, t, e, n, r, s) {
  return n = n !== void 0 ? n : !0, e = e !== void 0 ? e : 0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(o, A, a, g) {
    if (o !== void 0) {
      const I = r ? ms(
        t,
        r,
        a,
        !!s
      ) : t;
      if (g)
        return n ? ys(
          o,
          I,
          e
        ) : ae(o, e, I);
      const l = 1e-9, u = Math.ceil(
        Math.log(t / I) / Math.log(i) - l
      ), p = -A * (0.5 - l) + 0.5, m = Math.min(I, o), c = Math.floor(
        Math.log(t / m) / Math.log(i) + p
      ), C = Math.max(u, c), h = t / Math.pow(i, C);
      return ae(h, e, I);
    }
  });
}
function Lo(i, t, e, n, r) {
  return e = e !== void 0 ? e : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(s, o, A, a) {
    if (s !== void 0) {
      const g = n ? ms(
        i,
        n,
        A,
        !!r
      ) : i;
      return !e || !a ? ae(s, t, g) : ys(
        s,
        g,
        t
      );
    }
  });
}
function vs(i) {
  if (i !== void 0)
    return 0;
}
function Do(i) {
  if (i !== void 0)
    return i;
}
function Kl(i) {
  const t = 2 * Math.PI / i;
  return (
    /**
     * @param {number|undefined} rotation Rotation.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @return {number|undefined} Rotation.
     */
    (function(e, n) {
      if (n)
        return e;
      if (e !== void 0)
        return e = Math.floor(e / t + 0.5) * t, e;
    })
  );
}
function Jl(i) {
  const t = yn(5);
  return (
    /**
     * @param {number|undefined} rotation Rotation.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @return {number|undefined} Rotation.
     */
    (function(e, n) {
      return n || e === void 0 ? e : Math.abs(e) <= t ? 0 : e;
    })
  );
}
const ql = 256, vr = 0;
class Bo extends Tn {
  /**
   * @param {ViewOptions} [options] View options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = Object.assign({}, t), this.hints_ = [0, 0], this.animations_ = [], this.updateAnimationKey_, this.projection_ = ls(t.projection, "EPSG:3857"), this.viewportSize_ = [100, 100], this.targetCenter_ = null, this.targetResolution_, this.targetRotation_, this.nextCenter_ = null, this.nextResolution_, this.nextRotation_, this.cancelAnchor_ = void 0, t.projection && ec(), t.center && (t.center = _e(
      t.center,
      /** @type {import("./proj.js").ProjectionLike} */
      this.projection_
    )), t.extent && (t.extent = yi(
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
    for (const A in Ae)
      delete e[A];
    this.setProperties(e, !0);
    const n = tI(t);
    this.maxResolution_ = n.maxResolution, this.minResolution_ = n.minResolution, this.zoomFactor_ = n.zoomFactor, this.resolutions_ = t.resolutions, this.padding_ = t.padding, this.minZoom_ = n.minZoom;
    const r = $l(t), s = n.constraint, o = eI(t);
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
    const n = this.getCenterInternal();
    if (n) {
      const r = t || [0, 0, 0, 0];
      e = e || [0, 0, 0, 0];
      const s = (
        /** @type {number} */
        this.getResolution()
      ), o = s / 2 * (r[3] - e[3] + e[1] - r[1]), A = s / 2 * (r[0] - e[0] + e[2] - r[2]);
      this.setCenterInternal([n[0] + o, n[1] - A]);
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
    for (let n = 0; n < e.length; ++n) {
      let r = arguments[n];
      r.center && (r = Object.assign({}, r), r.center = _e(
        r.center,
        this.getProjection()
      )), r.anchor && (r = Object.assign({}, r), r.anchor = _e(
        r.anchor,
        this.getProjection()
      )), e[n] = r;
    }
    this.animateInternal.apply(this, e);
  }
  /**
   * @param {...(AnimationOptions|function(boolean): void)} var_args Animation options.
   */
  animateInternal(t) {
    let e = arguments.length, n;
    e > 1 && typeof arguments[e - 1] == "function" && (n = arguments[e - 1], --e);
    let r = 0;
    for (; r < e && !this.isDef(); ++r) {
      const I = arguments[r];
      I.center && this.setCenterInternal(I.center), I.zoom !== void 0 ? this.setZoom(I.zoom) : I.resolution && this.setResolution(I.resolution), I.rotation !== void 0 && this.setRotation(I.rotation);
    }
    if (r === e) {
      n && Ei(n, !0);
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
      const I = (
        /** @type {AnimationOptions} */
        arguments[r]
      ), l = (
        /** @type {Animation} */
        {
          start: s,
          complete: !1,
          anchor: I.anchor,
          duration: I.duration !== void 0 ? I.duration : 1e3,
          easing: I.easing || Wl,
          callback: n
        }
      );
      if (I.center && (l.sourceCenter = o, l.targetCenter = I.center.slice(), o = l.targetCenter), I.zoom !== void 0 ? (l.sourceResolution = A, l.targetResolution = this.getResolutionForZoom(I.zoom), A = l.targetResolution) : I.resolution && (l.sourceResolution = A, l.targetResolution = I.resolution, A = l.targetResolution), I.rotation !== void 0) {
        l.sourceRotation = a;
        const u = jr(I.rotation - a + Math.PI, 2 * Math.PI) - Math.PI;
        l.targetRotation = a + u, a = l.targetRotation;
      }
      nI(l) ? l.complete = !0 : s += l.duration, g.push(l);
    }
    this.animations_.push(g), this.setHint(Oe.ANIMATING, 1), this.updateAnimations_();
  }
  /**
   * Determine if the view is being animated.
   * @return {boolean} The view is being animated.
   * @api
   */
  getAnimating() {
    return this.hints_[Oe.ANIMATING] > 0;
  }
  /**
   * Determine if the user is interacting with the view, such as panning or zooming.
   * @return {boolean} The view is being interacted with.
   * @api
   */
  getInteracting() {
    return this.hints_[Oe.INTERACTING] > 0;
  }
  /**
   * Cancel any ongoing animations.
   * @api
   */
  cancelAnimations() {
    this.setHint(Oe.ANIMATING, -this.hints_[Oe.ANIMATING]);
    let t;
    for (let e = 0, n = this.animations_.length; e < n; ++e) {
      const r = (
        /** @type {Array<Animation>} */
        this.animations_[e]
      );
      if (
        /** @type {Animation} */
        r[0].callback && Ei(
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
    for (let n = this.animations_.length - 1; n >= 0; --n) {
      const r = (
        /** @type {Array<Animation>} */
        this.animations_[n]
      );
      let s = !0;
      for (let o = 0, A = r.length; o < A; ++o) {
        const a = r[o];
        if (a.complete)
          continue;
        const g = t - a.start;
        let I = a.duration > 0 ? g / a.duration : 1;
        I >= 1 ? (a.complete = !0, I = 1) : s = !1;
        const l = a.easing(I);
        if (a.sourceCenter) {
          const u = a.sourceCenter[0], p = a.sourceCenter[1], m = (
            /** @type {import("./coordinate.js").Coordinate} */
            a.targetCenter[0]
          ), c = (
            /** @type {import("./coordinate.js").Coordinate} */
            a.targetCenter[1]
          );
          this.nextCenter_ = /** @type {import("./coordinate.js").Coordinate} */
          a.targetCenter;
          const C = u + l * (m - u), h = p + l * (c - p);
          this.targetCenter_ = [C, h];
        }
        if (a.sourceResolution && a.targetResolution) {
          const u = l === 1 ? a.targetResolution : a.sourceResolution + l * (a.targetResolution - a.sourceResolution);
          if (a.anchor) {
            const p = this.getViewportSize_(this.getRotation()), m = (
              /** @type {Constraints} */
              this.constraints_.resolution(u, 0, p, !0)
            );
            this.targetCenter_ = this.calculateCenterZoom(
              /** @type {number} */
              m,
              /** @type {import("./coordinate.js").Coordinate} */
              a.anchor
            );
          }
          this.nextResolution_ = a.targetResolution, this.targetResolution_ = u, this.applyTargetState_(!0);
        }
        if (a.sourceRotation !== void 0 && a.targetRotation !== void 0) {
          const u = l === 1 ? jr(a.targetRotation + Math.PI, 2 * Math.PI) - Math.PI : a.sourceRotation + l * (a.targetRotation - a.sourceRotation);
          if (a.anchor) {
            const p = (
              /** @type {Constraints} */
              this.constraints_.rotation(u, !0)
            );
            this.targetCenter_ = this.calculateCenterRotate(
              /** @type {number} */
              p,
              /** @type {import("./coordinate.js").Coordinate} */
              a.anchor
            );
          }
          this.nextRotation_ = a.targetRotation, this.targetRotation_ = u;
        }
        if (this.applyTargetState_(!0), e = !0, !a.complete)
          break;
      }
      if (s) {
        this.animations_[n] = null, this.setHint(Oe.ANIMATING, -1), this.nextCenter_ = null, this.nextResolution_ = NaN, this.nextRotation_ = NaN;
        const o = r[0].callback;
        o && Ei(o, !0);
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
    let n;
    const r = this.getCenterInternal();
    return r !== void 0 && (n = [r[0] - e[0], r[1] - e[1]], as(n, t - this.getRotation()), Rg(n, e)), n;
  }
  /**
   * @param {number} resolution Target resolution.
   * @param {import("./coordinate.js").Coordinate} anchor Zoom anchor.
   * @return {import("./coordinate.js").Coordinate|undefined} Center for resolution and anchor.
   */
  calculateCenterZoom(t, e) {
    let n;
    const r = this.getCenterInternal(), s = this.getResolution();
    if (r !== void 0 && s !== void 0) {
      const o = e[0] - t * (e[0] - r[0]) / s, A = e[1] - t * (e[1] - r[1]) / s;
      n = [o, A];
    }
    return n;
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
      const n = e[0], r = e[1];
      return [
        Math.abs(n * Math.cos(t)) + Math.abs(r * Math.sin(t)),
        Math.abs(n * Math.sin(t)) + Math.abs(r * Math.cos(t))
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
    return t && oo(t, this.getProjection());
  }
  /**
   * Get the view center without transforming to user projection.
   * @return {import("./coordinate.js").Coordinate|undefined} The center of the view.
   */
  getCenterInternal() {
    return (
      /** @type {import("./coordinate.js").Coordinate|undefined} */
      this.get(Ae.CENTER)
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
    return Ac(e, this.getProjection());
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
    Ne(e, "The view center is not defined");
    const n = (
      /** @type {!number} */
      this.getResolution()
    );
    Ne(n !== void 0, "The view resolution is not defined");
    const r = (
      /** @type {!number} */
      this.getRotation()
    );
    return Ne(r !== void 0, "The view rotation is not defined"), mg(e, n, r, t);
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
      this.get(Ae.RESOLUTION)
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
      yi(t, this.getProjection()),
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
    const n = ss(t) / e[0], r = Hn(t) / e[1];
    return Math.max(n, r);
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
    ), n = (
      /** @type {number} */
      this.minResolution_
    ), r = Math.log(e / n) / Math.log(t);
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
      this.get(Ae.ROTATION)
    );
  }
  /**
   * Return a function that returns a resolution for a value between
   * 0 and 1. Exponential scaling is assumed.
   * @param {number} [power] Power.
   * @return {function(number): number} Value for resolution function.
   */
  getValueForResolutionFunction(t) {
    const e = Math.log(t || 2), n = (
      /** @type {number} */
      this.getConstrainedResolution(
        /** @type {number} */
        this.maxResolution_
      )
    ), r = (
      /** @type {number} */
      this.minResolution_
    ), s = Math.log(n / r) / e;
    return (
      /**
       * @param {number} resolution Resolution.
       * @return {number} Value.
       */
      (function(o) {
        return Math.log(n / o) / e / s;
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
    const n = this.padding_;
    return n && (e = [
      e[0] - n[1] - n[3],
      e[1] - n[0] - n[2]
    ]), e;
  }
  /**
   * @return {State} View state.
   */
  getState() {
    const t = this.getProjection(), e = this.getResolution(), n = this.getRotation();
    let r = (
      /** @type {import("./coordinate.js").Coordinate} */
      this.getCenterInternal()
    );
    const s = this.padding_;
    if (s) {
      const o = this.getViewportSizeMinusPadding_();
      r = wr(
        r,
        this.getViewportSize_(),
        [o[0] / 2 + s[3], o[1] / 2 + s[0]],
        /** @type {number} */
        e,
        n
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
      rotation: n,
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
    let e = this.minZoom_ || 0, n, r;
    if (this.resolutions_) {
      const s = fA(this.resolutions_, t, 1);
      e = s, n = this.resolutions_[s], s == this.resolutions_.length - 1 ? r = 2 : r = n / this.resolutions_[s + 1];
    } else
      n = /** @type {number} */
      this.maxResolution_, r = /** @type {number} */
      this.zoomFactor_;
    return e + Math.log(
      /** @type {number} */
      n / t
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
      const e = ae(
        Math.floor(t),
        0,
        this.resolutions_.length - 2
      ), n = this.resolutions_[e] / this.resolutions_[e + 1];
      return this.resolutions_[e] / Math.pow(n, ae(t - e, 0, 1));
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
    let n;
    if (Ne(
      Array.isArray(t) || typeof /** @type {?} */
      t.getSimplifiedGeometry == "function",
      "Invalid extent or geometry provided as `geometry`"
    ), Array.isArray(t)) {
      Ne(
        !EA(t),
        "Cannot fit empty extent provided as `geometry`"
      );
      const r = yi(t, this.getProjection());
      n = lo(r);
    } else if (t.getType() === "Circle") {
      const r = yi(
        t.getExtent(),
        this.getProjection()
      );
      n = lo(r), n.rotate(this.getRotation(), _i(r));
    } else {
      const r = oc();
      r ? n = /** @type {import("./geom/SimpleGeometry.js").default} */
      t.clone().transform(r, this.getProjection()) : n = t;
    }
    this.fitInternal(n, e);
  }
  /**
   * Calculate rotated extent
   * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
   * @return {import("./extent.js").Extent} The rotated extent for the geometry.
   */
  rotatedExtentForGeometry(t) {
    const e = this.getRotation(), n = Math.cos(e), r = Math.sin(-e), s = t.getFlatCoordinates(), o = t.getStride();
    let A = 1 / 0, a = 1 / 0, g = -1 / 0, I = -1 / 0;
    for (let l = 0, u = s.length; l < u; l += o) {
      const p = s[l] * n - s[l + 1] * r, m = s[l] * r + s[l + 1] * n;
      A = Math.min(A, p), a = Math.min(a, m), g = Math.max(g, p), I = Math.max(I, m);
    }
    return [A, a, g, I];
  }
  /**
   * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
   * @param {FitOptions} [options] Options.
   */
  fitInternal(t, e) {
    e = e || {};
    let n = e.size;
    n || (n = this.getViewportSizeMinusPadding_());
    const r = e.padding !== void 0 ? e.padding : [0, 0, 0, 0], s = e.nearest !== void 0 ? e.nearest : !1;
    let o;
    e.minResolution !== void 0 ? o = e.minResolution : e.maxZoom !== void 0 ? o = this.getResolutionForZoom(e.maxZoom) : o = 0;
    const A = this.rotatedExtentForGeometry(t);
    let a = this.getResolutionForExtentInternal(A, [
      n[0] - r[1] - r[3],
      n[1] - r[0] - r[2]
    ]);
    a = isNaN(a) ? o : Math.max(a, o), a = /** @type {number} */
    this.getConstrainedResolution(a, s ? 0 : 1);
    const g = this.getRotation(), I = Math.sin(g), l = Math.cos(g), u = _i(A);
    u[0] += (r[1] - r[3]) / 2 * a, u[1] += (r[0] - r[2]) / 2 * a;
    const p = u[0] * l - u[1] * I, m = u[1] * l + u[0] * I, c = this.getConstrainedCenter([p, m], a), C = e.callback ? e.callback : Fr;
    e.duration !== void 0 ? this.animateInternal(
      {
        resolution: a,
        center: c,
        duration: e.duration,
        easing: e.easing
      },
      C
    ) : (this.targetResolution_ = a, this.targetCenter_ = c, this.applyTargetState_(!1, !0), Ei(C, !0));
  }
  /**
   * Center on coordinate and view position.
   * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("./size.js").Size} size Box pixel size.
   * @param {import("./pixel.js").Pixel} position Position on the view to center on.
   * @api
   */
  centerOn(t, e, n) {
    this.centerOnInternal(
      _e(t, this.getProjection()),
      e,
      n
    );
  }
  /**
   * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("./size.js").Size} size Box pixel size.
   * @param {import("./pixel.js").Pixel} position Position on the view to center on.
   */
  centerOnInternal(t, e, n) {
    this.setCenterInternal(
      wr(
        t,
        e,
        n,
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
  calculateCenterShift(t, e, n, r) {
    let s;
    const o = this.padding_;
    if (o && t) {
      const A = this.getViewportSizeMinusPadding_(-n), a = wr(
        t,
        r,
        [A[0] / 2 + o[3], A[1] / 2 + o[0]],
        e,
        n
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
    const e = oo(
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
    e = e && _e(e, this.getProjection()), this.adjustResolutionInternal(t, e);
  }
  /**
   * Multiply the view resolution by a ratio, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} ratio The ratio to apply on the view resolution.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  adjustResolutionInternal(t, e) {
    const n = this.getAnimating() || this.getInteracting(), r = this.getViewportSize_(this.getRotation()), s = (
      /** @type {Constraints} */
      this.constraints_.resolution(
        /** @type {number} */
        this.targetResolution_ * t,
        0,
        r,
        n
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
    e && (e = _e(e, this.getProjection())), this.adjustRotationInternal(t, e);
  }
  /**
   * @param {number} delta Relative value to add to the zoom rotation, in radians.
   * @param {import("./coordinate.js").Coordinate} [anchor] The rotation center.
   */
  adjustRotationInternal(t, e) {
    const n = this.getAnimating() || this.getInteracting(), r = (
      /** @type {Constraints} */
      this.constraints_.rotation(
        /** @type {number} */
        this.targetRotation_ + t,
        n
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
      t && _e(t, this.getProjection())
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
    const n = this.getAnimating() || this.getInteracting() || e, r = (
      /** @type {Constraints} */
      this.constraints_.rotation(
        /** @type {number} */
        this.targetRotation_,
        n
      )
    ), s = this.getViewportSize_(r), o = (
      /** @type {Constraints} */
      this.constraints_.resolution(
        /** @type {number} */
        this.targetResolution_,
        0,
        s,
        n
      )
    ), A = (
      /** @type {Constraints} */
      this.constraints_.center(
        /** @type {import("./coordinate.js").Coordinate|undefined} */
        this.targetCenter_,
        /** @type {number} */
        o,
        s,
        n,
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
    this.get(Ae.ROTATION) !== r && this.set(Ae.ROTATION, r), this.get(Ae.RESOLUTION) !== o && (this.set(Ae.RESOLUTION, o), this.set("zoom", this.getZoom(), !0)), (!A || !this.get(Ae.CENTER) || !Oi(this.get(Ae.CENTER), A)) && this.set(Ae.CENTER, A), this.getAnimating() && !t && this.cancelAnimations(), this.cancelAnchor_ = void 0;
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
  resolveConstraints(t, e, n) {
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
    n = n || (t === 0 ? this.cancelAnchor_ : void 0), this.cancelAnchor_ = void 0, (this.getResolution() !== A || this.getRotation() !== s || !this.getCenterInternal() || !Oi(
      /** @type {import("./coordinate.js").Coordinate} */
      this.getCenterInternal(),
      /** @type {import("./coordinate.js").Coordinate} */
      a
    )) && (this.getAnimating() && this.cancelAnimations(), this.animateInternal({
      rotation: s,
      center: a,
      resolution: A,
      duration: t,
      easing: Yi,
      anchor: n
    }));
  }
  /**
   * Notify the View that an interaction has started.
   * The view state will be resolved to a stable one if needed
   * (depending on its constraints).
   * @api
   */
  beginInteraction() {
    this.resolveConstraints(0), this.setHint(Oe.INTERACTING, 1);
  }
  /**
   * Notify the View that an interaction has ended. The view state will be resolved
   * to a stable one if needed (depending on its constraints).
   * @param {number} [duration] Animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   * @api
   */
  endInteraction(t, e, n) {
    n = n && _e(n, this.getProjection()), this.endInteractionInternal(t, e, n);
  }
  /**
   * Notify the View that an interaction has ended. The view state will be resolved
   * to a stable one if needed (depending on its constraints).
   * @param {number} [duration] Animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  endInteractionInternal(t, e, n) {
    this.getInteracting() && (this.setHint(Oe.INTERACTING, -1), this.resolveConstraints(t, e, n));
  }
  /**
   * Get a valid position for the view center according to the current constraints.
   * @param {import("./coordinate.js").Coordinate|undefined} targetCenter Target center position.
   * @param {number} [targetResolution] Target resolution. If not supplied, the current one will be used.
   * This is useful to guess a valid center position at a different zoom level.
   * @return {import("./coordinate.js").Coordinate|undefined} Valid center position.
   */
  getConstrainedCenter(t, e) {
    const n = this.getViewportSize_(this.getRotation());
    return (
      /** @type {Constraints} */
      this.constraints_.center(
        t,
        e || /** @type {number} */
        this.getResolution(),
        n
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
    const n = this.getResolutionForZoom(
      /** @type {number} */
      t
    );
    return this.getZoomForResolution(
      /** @type {number} */
      this.getConstrainedResolution(n, e)
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
    const n = this.getViewportSize_(this.getRotation());
    return (
      /** @type {Constraints} */
      this.constraints_.resolution(
        t,
        e,
        n
      )
    );
  }
}
function Ei(i, t) {
  setTimeout(function() {
    i(t);
  }, 0);
}
function $l(i) {
  if (i.extent !== void 0) {
    const e = i.smoothExtentConstraint !== void 0 ? i.smoothExtentConstraint : !0;
    return Oo(
      i.extent,
      /** @type {boolean} */
      i.constrainOnlyCenter,
      e
    );
  }
  const t = (
    /** @type {import("./proj/Projection.js").default} */
    ls(i.projection, "EPSG:3857")
  );
  if (i.multiWorld !== !0 && t.isGlobal()) {
    const e = t.getExtent().slice();
    return e[0] = -1 / 0, e[2] = 1 / 0, Oo(e, !1, !1);
  }
  return Zl;
}
function tI(i) {
  let t, e, n, o = i.minZoom !== void 0 ? i.minZoom : vr, A = i.maxZoom !== void 0 ? i.maxZoom : 28;
  const a = i.zoomFactor !== void 0 ? i.zoomFactor : 2, g = i.multiWorld !== void 0 ? i.multiWorld : !1, I = i.smoothResolutionConstraint !== void 0 ? i.smoothResolutionConstraint : !0, l = i.showFullExtent !== void 0 ? i.showFullExtent : !1, u = (
    /** @type {import("./proj/Projection.js").default} */
    ls(i.projection, "EPSG:3857")
  ), p = u.getExtent();
  let m = i.constrainOnlyCenter, c = i.extent;
  if (!g && !c && u.isGlobal() && (m = !1, c = p), i.resolutions !== void 0) {
    const C = i.resolutions;
    e = C[o], n = C[A] !== void 0 ? C[A] : C[C.length - 1], i.constrainResolution ? t = Ql(
      C,
      I,
      /** @type {import("./extent.js").Extent|undefined} */
      !m && c,
      l
    ) : t = Lo(
      e,
      n,
      I,
      /** @type {import("./extent.js").Extent|undefined} */
      !m && c,
      l
    );
  } else {
    const h = (p ? Math.max(ss(p), Hn(p)) : (
      // use an extent that can fit the whole world if need be
      360 * /** @type {number} */
      xA.degrees / /** @type {number} */
      u.getMetersPerUnit()
    )) / ql / Math.pow(2, vr), d = h / Math.pow(2, 28 - vr);
    e = i.maxResolution, e !== void 0 ? o = 0 : e = h / Math.pow(a, o), n = i.minResolution, n === void 0 && (i.maxZoom !== void 0 ? i.maxResolution !== void 0 ? n = e / Math.pow(a, A) : n = h / Math.pow(a, A) : n = d), A = o + Math.floor(
      Math.log(e / n) / Math.log(a)
    ), n = e / Math.pow(a, A - o), i.constrainResolution ? t = Yl(
      a,
      e,
      n,
      I,
      /** @type {import("./extent.js").Extent|undefined} */
      !m && c,
      l
    ) : t = Lo(
      e,
      n,
      I,
      /** @type {import("./extent.js").Extent|undefined} */
      !m && c,
      l
    );
  }
  return {
    constraint: t,
    maxResolution: e,
    minResolution: n,
    minZoom: o,
    zoomFactor: a
  };
}
function eI(i) {
  if (i.enableRotation !== void 0 ? i.enableRotation : !0) {
    const e = i.constrainRotation;
    return e === void 0 || e === !0 ? Jl() : e === !1 ? Do : typeof e == "number" ? Kl(e) : Do;
  }
  return vs;
}
function nI(i) {
  return !(i.sourceCenter && i.targetCenter && !Oi(i.sourceCenter, i.targetCenter) || i.sourceResolution !== i.targetResolution || i.sourceRotation !== i.targetRotation);
}
function wr(i, t, e, n, r) {
  const s = Math.cos(-r);
  let o = Math.sin(-r), A = i[0] * s - i[1] * o, a = i[1] * s + i[0] * o;
  A += (t[0] / 2 - e[0]) * n, a += (e[1] - t[1] / 2) * n, o = -o;
  const g = A * s - a * o, I = a * s + A * o;
  return [g, I];
}
const iI = {
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
class rI extends Tn {
  /**
   * @param {Options<NoInfer<Properties>>} options Layer options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, this.background_ = t.background;
    const e = Object.assign({}, t);
    typeof t.properties == "object" && (delete e.properties, Object.assign(e, t.properties)), e[ft.OPACITY] = t.opacity !== void 0 ? t.opacity : 1, Ne(
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
    }, n = this.getZIndex();
    return e.opacity = ae(Math.round(this.getOpacity() * 100) / 100, 0, 1), e.visible = this.getVisible(), e.extent = this.getExtent(), e.zIndex = n === void 0 && !e.managed ? 1 / 0 : n, e.maxResolution = this.getMaxResolution(), e.minResolution = Math.max(this.getMinResolution(), 0), e.minZoom = this.getMinZoom(), e.maxZoom = this.getMaxZoom(), this.state_ = e, e;
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").default>} [array] Array of layers (to be
   *     modified in place).
   * @return {Array<import("./Layer.js").default>} Array of layers.
   */
  getLayersArray(t) {
    return Wt();
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").State>} [states] Optional list of layer
   *     states (to be modified in place).
   * @return {Array<import("./Layer.js").State>} List of layer states.
   */
  getLayerStatesArray(t) {
    return Wt();
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
    return Wt();
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
    Ne(typeof t == "number", "Layer opacity must be a number"), this.set(ft.OPACITY, t);
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
class ea extends rI {
  /**
   * @param {Options<SourceType, NoInfer<Properties>>} options Layer options.
   */
  constructor(t) {
    const e = Object.assign({}, t);
    delete e.source, super(e), this.on, this.once, this.un, this.mapPrecomposeKey_ = null, this.mapRenderKey_ = null, this.sourceChangeKey_ = null, this.renderer_ = null, this.sourceReady_ = !1, this.rendered = !1, t.render && (this.render = t.render), t.map && this.setMap(t.map), this.addChangeListener(
      ft.SOURCE,
      this.handleSourcePropertyChange_
    );
    const n = t.source ? (
      /** @type {SourceType} */
      t.source
    ) : null;
    this.setSource(n);
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
    this.sourceChangeKey_ && (Vn(this.sourceChangeKey_), this.sourceChangeKey_ = null), this.sourceReady_ = !1;
    const t = this.getSource();
    t && (this.sourceChangeKey_ = pn(
      t,
      Fe.CHANGE,
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
    const n = this.getMapInternal();
    !t && n && (t = n.getView()), t instanceof Bo ? e = {
      viewState: t.getState(),
      extent: t.calculateExtent()
    } : e = t;
    const r = (
      /** @type {import("../View.js").ViewStateLayerStateExtent} */
      e
    );
    !r.layerStatesArray && n && (r.layerStatesArray = n.getLayerGroup().getLayerStatesArray());
    let s;
    if (r.layerStatesArray) {
      if (s = r.layerStatesArray.find(
        (A) => A.layer === this
      ), !s)
        return !1;
    } else
      s = this.getLayerState();
    const o = this.getExtent();
    return sI(s, r.viewState) && (!o || os(o, r.extent));
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
    const n = t instanceof Bo ? t.getViewStateAndExtent() : t;
    let r = e(
      /** @type {import("../View.js").ViewStateLayerStateExtent} */
      n
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
    const n = (
      /** @type {RendererType} */
      this.getRenderer()
    );
    return n.prepareFrame(
      /** @type {import("../Map.js").FrameState} */
      t
    ) ? (this.rendered = !0, n.renderFrame(
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
    this.mapPrecomposeKey_ && (Vn(this.mapPrecomposeKey_), this.mapPrecomposeKey_ = null), t || this.changed(), this.mapRenderKey_ && (Vn(this.mapRenderKey_), this.mapRenderKey_ = null), t && (this.mapPrecomposeKey_ = pn(
      t,
      iI.PRECOMPOSE,
      /** @type {import("../events.js").ListenerFunction} */
      this.handlePrecompose_,
      this
    ), this.mapRenderKey_ = pn(this, Fe.CHANGE, t.render, t), this.changed());
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
    const n = this.getLayerState(!1);
    Ne(
      !e.some(
        (r) => r.layer === n.layer
      ),
      "A layer can only be added to the map once. Use either `layer.setMap()` or `map.addLayer()`, not both."
    ), e.push(n);
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
function sI(i, t) {
  if (!i.visible)
    return !1;
  const e = t.resolution;
  if (e < i.minResolution || e >= i.maxResolution)
    return !1;
  const n = t.zoom;
  return n > i.minZoom && n <= i.maxZoom;
}
function oI(i) {
  const t = i && typeof i.getPixelRatio == "function" ? i.getPixelRatio() : typeof window < "u" && window.devicePixelRatio || 1;
  return typeof t == "number" && Number.isFinite(t) && t > 0 ? t : 1;
}
function na(i, t, e) {
  const n = oI(i);
  return Math.abs(t.width / n - e[0]) < 1 && Math.abs(t.height / n - e[1]) < 1;
}
class AI extends ea {
  constructor(t) {
    let e;
    const n = function(r) {
      const s = this.getSource(), o = s.mapboxMap;
      if (!o)
        return console.error("MapboxLayer: mapboxMap is undefined!"), null;
      s.style !== e && (o.setStyle(s.style), e = s.style);
      const A = o.getCanvas(), a = r.viewState, g = this.getVisible();
      A.style.display = g ? "block" : "none";
      const I = this.getOpacity();
      A.style.opacity = I, A.style.position = "absolute", A.style.left = "0", A.style.top = "0";
      let l = !1;
      if (r.size) {
        const [d, S] = r.size;
        na(o, A, [d, S]) || (o.resize(), l = !0);
      }
      const u = a.rotation * -180 / Math.PI, p = zi(a.center), m = a.zoom - 1, c = o.getBearing(), C = o.getCenter().toArray(), h = o.getZoom();
      return !l && u == c && p[0] == C[0] && p[1] == C[1] && m == h || (u != c && o.rotateTo(u, {
        animate: !1
      }), (p[0] != C[0] || p[1] != C[1] || m != h) && o.jumpTo({
        center: p,
        zoom: m,
        animate: !1
      }), o._frame && (o._frame.cancel(), o._frame = null), o._render()), A;
    };
    super({
      render: n,
      source: t.source
    });
  }
}
class aI extends ea {
  constructor(t) {
    let e;
    const n = function(r) {
      const s = this.getSource(), o = s.maplibreMap;
      if (!o)
        return console.error("MapLibreLayer: maplibreMap is undefined!"), null;
      s.style !== e && (o.setStyle(s.style), e = s.style);
      const A = o.getCanvas(), a = r.viewState, g = this.getVisible();
      A.style.display = g ? "block" : "none";
      const I = this.getOpacity();
      A.style.opacity = I;
      const u = -a.rotation * 180 / Math.PI, p = o.getBearing();
      Math.abs(u - p) > 0.01 && (o.stop(), o.setBearing(u));
      const m = zi(a.center), c = a.zoom - 1;
      if ((o.getCenter().toArray().toString() !== m.toString() || o.getZoom() !== c) && o.jumpTo({
        center: m,
        zoom: c,
        animate: !1
      }), o._frame && (o._frame.cancel(), o._frame = null), r.size) {
        const [C, h] = r.size;
        na(o, A, [C, h]) || o.resize();
      }
      return o._render(), Math.abs(o.getZoom() - c) > 0.01 && o.setZoom(c), A.style.position = "absolute", A.style.left = "0", A.style.top = "0", A;
    };
    super({
      render: n,
      source: t.source
    });
  }
}
const ia = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAxMS0xMC0yNlQyMTo1MjoxOFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAxMS0xMC0yN1QxNzo0MjowN1o8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgkVIwmwAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTM5jWRgMAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTAvMjYvMTHjwOqVAAARQHByVld4nMWbB3wURdvAd6/u3V6/27sts/PMQQhFpEU6SlNBRXqTfgkkQOhFSigHIgIWkJqAIJ1QBCz0KkJoQYrSQaQjioBKC+XezWU5fH2/3+/L8fu+fWd3bubZKf95nnlmdjeX2/dk602qD9UnooRc5YjkKp9KyIrkZikfkazcSFaWcuZmpUZScyOpWcqZm6rkU3OTIpGk3EhSViQpVTlzk5IiSUm5VCRC5UaorAiVqpy5VFKESspND6UY03O6U0oYGHo3NCg0ODSj59BQRmhYaHhoaDofFsJiGIVfC78e/hnOwwW4CI1Ttve/AlehLClH6oTrhl8N1wu3CIcFKhqWiwVpWvrG9EcjmXC2nC/1Sd+dHgonh1PCpxQ5nN4pfHHk3qGzOlFUepiiPk5PC/cO9wn3DfcL59deGOqWXC95Saigp/fCY8Lvh0e9Xm94q3DBlXLd2qm5kmRpSrdw9/CEqNwneWQ4HH6hXul6FHVs5Gfh2eGbI6eFp0fLxoZqhE/KC6P5Oa9lhzN7ymofy5PN4anhCRlfFpSVXxNeG26UQf0jyBSO5R1UcjTdF/3c8o+a66j11AbqhCrtpvZQe6lzqnSRukRdjtU8Q52lfqJuqNJt6g/qTzW/ltpKbaO2U99SO9QrF6j71AMqL9b2OvUr9VtMYmgLbaU9dIHkpwM0r+YdtJN20W76ytOa/zZWjpZpTANdNlr7NJVEv0RXpCtFpR+panR1ugZdPCodoGrTdei69MNou3p0ffoN+k36aT+rqcZqfheVQzWiW9HUP0Kn6BVEJ9DF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zV6+JT3q/K+UUkoppZ5Tl9rnzXTvZS/51pTrIJewYX0bzb5r+vfUX7X2ebU/rDnUmslszXqN0v99bSO/80ff/EtrIayb9PNrKMs56kf84zG7v5Te6HqW1yytUb8m7mzNaVbmv4r9stz7I1/WPPKc9sIzuc6ebST3XjlnDZd7OSawd7MmvNs6y5nriXWP9WbWmvq6UoX3Ota9TCttV8f0GZBXXqMep8R6JfdJl73upTKfo+6XbG+j/s9aG7ZmP75rNPZXvNzHLegjrPOtCT9WL+yXY17/tyH3IRB7GXXMtcq0VabZ8xrZt/8TQZzR/ZH/R2U+R33+P8X/GX/2/pB24py9GY74M//JWBN+ar36nJd7Avh6VKf0QbdPXs/yyrDRPhP3sz9znXmPynyutvB/30cpn1CmPC8x1jF+MpbRnteGn1Ivwhg3+I8AG9O+EHNt938fc3KP8pj/+X8i8yj1+93/szKfq2P+z7kdO/R+knUt9fEpfYO/iMs8tlX4MbtnGLbk/TrnYcZw4mLntDV7nfgz9yiPlYN/a/EhbSdtyp7ZyP+jMp/zLsh+W9YpfUffzrpij9FYRdxMr+fX/dn7wZpwwpbqlWHUg7mk+zfn8tE3GM/350Z59TDaQN+LTBsTP/Oelbn3tUtoab1APb70v1JKKaWUUkoppZRSSl1NOxERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERGRO+Qfh5eOajemXSYAAAFTbWtCVPrOyv4Af1WJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4nO3W4WmDYBSGUQdxEQdxEBdxEAdxEQexvIELt6Yh/4oJ54FDm0/7601szlOSJEmSJEmSJEmSJEmSJEmSJEkf0XEc577vT+c5y7V397+6T/dvXddzHMdzmqbHz+wY/Sz31L11FsuyPF7HMAx/vod077JjlX2zYXatzfs9tX/VN7/+je5ftut7Vjnrn+V6nX37xtm/ul7T/ctzvu9f/9fneX7aP9fs/31l23ru1+/btv36zPfnv/2/r/oe1/er90Cu1Xf7nEXVnx3Xa5IkSZIkSZIk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b24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+zWqGFQAACShJREFUWIWVmGusXFUVx39r73POzJy5M3fmPtrblj7p7btYGigGmojExISHQQ0miDFA4lc0SCBRNH4gRhNJ/aIfNAIxUkKIkMgjBBKMCHwQEGKhpbS39HXfve+5M3fmnr23H84+M7e1PDyTlbPPnDl7//da//Vf64zwBQ9jjCilAiDyFgIaUP4nFjDAMtACWtbaRGvtPmte59Lb8gUW137hGCgDFaDkrzMwrABRBxaAWWDeX7esteZyoD4XSJIkorXO+cV7gQFg9fMvLdz74bHm+hOnTP/QsOmeaxBYoJTDbF2n5wa36At7d+XOfOOW0uPAmLcpYN4Y0wyC4LIeuiwQ55wC8kA/sHF62tz5+F/mDz7zytKOTxpBMKsCEq1BCWjBiQAOcRAYQylpcWW0bG6/Kf/Rvd/rfmP1Kn0YOANMAksiYj8XiAcRew9se/ZvtR8/+seFr3xQj3QtDHGhQCCIFtAqDYxI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", ra = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACC2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjE8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KD0UqkwAACBNJREFUWAnNWN9vXMUVPmfm3l3vrtdeO3FA4ATiEtEI4iSKigQvpUlfeEDqQ5F44al/VJ8r+lCJhz4lLUQqQn2goLqRINBIAYfQWBBMbMfLen/dmdPvm7t3s01QE9QHeuzxzJ0f53zznTPnzrXI/4noo+MwlRdlrrl30Cl87JgLjUy0JqqZBImFxJE6P/DR3+27/R356LG+iMZH1f9wIK+Zb3/c7Qy8W1Wxk1HsbAyyIiqZmGYmlqtZEKcjGI1O9a6qXQGGqzXLbvXmWndkQ8cPA/RfgJiTc7vtfFA7bhYvRJN1c9qUlheZz0XqUI2m5FARTISmCpReEOmOBaaHTuNmnsulbKTXu6fae/KWYvD75fuBnLO8UfSPFGF8PkQ9bzU/L8s1kWVMd1BEAEkAoBI26QjWNNdF2QWgXtH3zj50an8aDhZvyWc6xMgD8iCQZ6xen98/Fkb66xjstB2pe3k8KxkAlgSkWkUmKsNVNFSACIYM7QXRr0bmnHzh1P1+1G5dl/cV8fOfUqkse8FEPew/HYb6G+hdsycaKkcwpYFhgmCZZYOG6JLKKJpTVgiM/Sycs40w2hndAZjfjoeta/czQ6InYq4x7j+WmCCINYB4HCDmMcyyjHIU5TjKkyjzGKujzKFNcCx4LNtAweccNcLJLaCczCSu1A4h3t6ot7pPCTaNGVMB5xNBYBaD7EJyx2pTZQFamxhroRxCeRaYVyfPPdRbKJ/D0LeYV5u4iCxQFHM9Hqz0U4Q/XcvE/dRL/EaOyUh+1Qq930HN7XKB4AhSXrYs3z1YCyH8PMXEISinO1gIhiDOoH6SRlHzoB6mEfT3YJD0kwG6YFYwXTzmxSiaYe4xFf1ZQ+OHg/Wg9qw8Y3uVizAq0u52OxbCL63h27ICbCSNhcqXUMgEQPyhabKBzME6gaKrOF6DRR5nuqlax7UUgnEEDWmY+DNe7GheL4K92mj2V8qBtCVzg4FbRZJ6TpYAghxxF6lwMQrdAyZOoDobovwEdWKGbDF+CKACMwWEPbKPgBIzYI66EGv+LOIl2iry4FoVK07WbzfUwnOWaUsWsaoCwMWUAQpjAu64jmrDO7mGOrmnzKUJlAMYB0OOriMYFraR8ByTHtqefdiUh6vtcJ4V0V6UwX4bvZI1x+2FkQvr0gQI0J7yBEfIJvPEXSjZQhsx8TrcQ0ORALYRfNuoR9gpDXLnHnNz9KMrxc3ISWTQMoYaYAggHBmEuKfgom+L4/XMlpDhdrKQhwUbg7AGNJEFFgoXszD18HQQ4a5JpCKsdLdRf1V249VXzk2BiTbwG8FCpQMYMayvXMwaogAS/yHNaFnJSAxuDupzybEAv1MhCCpjoPGIDqCMxps4ipw0xEkgvsQEarbxgk4osFbZz3jjZLjTM5e0cGrACsn2T4CtaLUsiw0etkxcgde4zyYHGV0ToWKCYYwwT5AZAHJzGAADiYUKBGtKwoE/dGk1xn4Ylw6GsQnGTtpAG/OQZoGdcB8wz757QiCET2HAVSk9LUUfDaPtZ48sQWBdqMCh9gDh+MIkILqxIAjUM4JzlBWAWMAIY3oipGMys2JmDAMEgKIBiggSShMIKicYLokYw9yEYzLH4cgqIoGnKlIH2e1BX7SoptyeZM7HARLf2MawGGdhzoCZdLspQ1DCE1LRTxAEw2fOobBmYIMFXcHcBSgBEAegyFkStqAfl6kiuvQmdn7s9/Fq2JE+RqE/FWKYNtIDO8odQ2dJFiazzZNCoARRuYjPbCMO3GFMaiPAeVrARtJG0zdN1OTAacGbi7iDvLuPS8vHcgAgVMyZFaDU4LSJVGMVNr7UuHNc31LN8Ocz9Di8ND1eltoBKjCjdDxZhCNsF9Nu4NLk5cbQFE/cCy65Zv6qFnbADOq4M7qIvk4CI/AdcwF/pkBpsCoEMMK8IQokHVMEqCyVIDzZYLrn8D5C6BNclrbHReb0fZlbKBkB1liv2RZuUP+UbSQOnPWU/UhtqbdsVEZRp2TFHDNbGHKg3jEmZkAkl8xNNoWNGpKg/bUQ5/SWqt+sLtb0pnzn5vc082/rfujKFg5RohV+7Xj4Fkowi2k7BSuMpzt5BYwKGKi4KPlFJKxDmLx4jwmdgDBk4/g12LhciG2OR5nqpf5BY5vLKTxMeJPpeHxuZzMvsvfC9eEr0vFen4dSJrKArMikRna4MTIFf3vmBFLOY4mgVGROmQcAngyMK9/IjAkIGYy3oeoDfABd7uNjQD7y6j6t7iKcUwJha2Opmz3f/ws+nFbjRv+0LjfUn0TAzIMKxg1PBwW2yEBiCkaVYPhCm7x9qVGr1z+WGE4ImbBrJsU7cEmQL5HH/9jLWjtUV8k9IIiVft2+rhfdt+D7NpCvyRBgXgAKZkbePZDeU2qvwTDdgZ2n1z7aSqYyMEDQFLBg35Ugwt8IAh1fju6ouTeHvdZNsMEQn0rJ3fQRDX5O4HKLS/RrMcZTenbOZ+dz5AMYW4RyBmNiAXOxDUcANE4QFMYO44GH8hvg+TM+Rt+FO6LcdNG9+WifE1RE4QcWbvRFKC7gQvYL6/iWX6+JfwnB24FBAEpgyAoLgRAANi1gQfbweCVI8QEC89Zo4M3+DpdcHA4X/jUbF5g5lQcZmQ7hk/PM3kJu+OQMAbd7OYWv3KY7moue8OKZtpfhIr7M+giG7SgB9xXZRL2Jk9ePQxfjjdzLxSzXz7pr7d0f/sk5BYPGj/8RPouG7fv+LaGhictMjfcJ3C/C//pvifut/WjP/wZbyT3jNC/KbwAAAABJRU5ErkJggg==", sa = "data:image/png;base64,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", oa = "data:image/png;base64,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", gI = new ue({
  image: new En({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: ia
  })
}), cI = new ue({
  image: new En({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: ra
  })
}), lI = new ue({
  image: new En({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: sa
  })
}), II = new ue({
  fill: new Gr({
    color: [128, 128, 256, 0.2]
  }),
  stroke: new Nr({
    color: [128, 128, 256, 1],
    width: 3
  })
}), CI = new ue({
  image: new En({
    anchor: [0.5, 1],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: oa
  })
});
class Ge extends Ja {
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
    t = he(t || {});
    const e = new fi({
      source: new di({
        wrapX: !1
      })
    });
    e.set("name", "gps");
    const n = new fi({
      source: new di({
        wrapX: !1
      })
    });
    n.set("name", "marker");
    const r = new fi({
      source: new di({
        wrapX: !1
      })
    });
    r.set("name", "feature");
    const s = new fi({
      source: new di({
        wrapX: !1
      })
    });
    s.set("name", "envelope");
    const o = Ge.spawnLayer(
      null,
      t.source,
      t.target
    ), A = new $a();
    A.set("name", "overlay");
    const g = {
      controls: t.controls ? t.controls : [],
      layers: [
        o,
        A,
        s,
        r,
        e,
        n
      ],
      target: t.div,
      view: new lA({
        center: t.defaultCenter || [0, 0],
        zoom: t.defaultZoom || 2,
        rotation: t.defaultRotation || 0,
        multiWorld: !0
      })
    };
    t.interactions && (g.interactions = t.interactions), super(g), this.fakeGps = t.fakeGps, this.fakeRadius = t.fakeRadius, this.homePosition = t.homePosition, this.northUp = t.northUp, this.tapDuration = t.tapDuration, this.homeMarginPixels = t.homeMarginPixels, this.tapUIVanish = t.tapUIVanish, this.alwaysGpsOn = t.alwaysGpsOn || !1;
    const I = this.getView();
    this.__ignore_first_move = !0;
    const l = () => {
      this.__ignore_first_move || this.dispatchEvent("movestart"), this.__ignore_first_move = !1, I.un("propertychange", l);
    };
    I.on("propertychange", l), this.on("moveend", () => {
      I.on("propertychange", l);
    }), I.on("change:resolution", () => {
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
    const n = e && typeof e.isWmts == "function" && e.isWmts() ? e.minZoom : void 0;
    typeof n == "number" && Number.isFinite(n) && n > 4 ? t.setMinZoom(n - 4) : t.setMinZoom(-1 / 0);
  }
  static spawnLayer(t, e, n) {
    return e instanceof Gi || e instanceof Fi || !(t instanceof Ir) ? (e instanceof Gi ? t = new AI({
      style: e.style,
      accessToken: e.accessToken,
      container: n,
      source: e
    }) : e instanceof Fi ? t = new aI({
      style: e.style,
      container: n,
      source: e
    }) : (t = new Ir({
      source: e
    }), Ge.applyWmtsZoomGate(t, e)), t.set("name", "base")) : (t.setSource(e), Ge.applyWmtsZoomGate(t, e)), t;
  }
  getLayer(t = "base") {
    const e = (n) => {
      const r = n.getArray().map((s) => {
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
  setFeature(t, e, n) {
    const r = this.getSource(n), s = new qa(t);
    return e && s.setStyle(e), r.addFeature(s), s;
  }
  removeFeature(t, e) {
    this.getSource(e).removeFeature(t);
  }
  resetFeature(t) {
    this.getSource(t).clear();
  }
  setGPSPosition(t, e = void 0) {
    const n = e == "sub" ? lI : e == "hide" ? cI : gI;
    e != "sub" && this.resetFeature("gps"), t && (this.setFeature(
      {
        geometry: new qn(t.xy)
      },
      n,
      "gps"
    ), e || this.setFeature(
      {
        geometry: new Cs(t.xy, t.rad)
      },
      II,
      "gps"
    ));
  }
  setMarker(t, e, n, r) {
    return r || (r = "marker"), e.geometry = new qn(t), n ? typeof n == "string" ? n = new ue({
      image: new En({
        anchor: [0.5, 1],
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: n
      })
    }) : n instanceof ue || (n = new ue({
      image: new En(n)
    })) : n = CI, this.setFeature(e, n, r);
  }
  resetMarker(t) {
    t || (t = "marker"), this.resetFeature(t);
  }
  setLine(t, e, n) {
    return this.setVector(t, "Line", e ? { stroke: e } : null, n);
  }
  setVector(t, e = "Line", n, r) {
    r || (r = "feature");
    const s = {};
    n.stroke != null && (s.stroke = new Nr(n.stroke)), n.fill != null && (s.fill = new Gr(n.fill));
    const o = new ue(s), A = e === "Line" ? new Bi(t) : new Ke(t);
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
  setEnvelope(t, e, n) {
    return n || (n = "envelope"), this.setLine(t, e, n);
  }
  removeEnvelope(t, e) {
    e || (e = "envelope"), this.removeFeature(t, e);
  }
  resetEnvelope(t) {
    t || (t = "envelope"), this.resetFeature(t);
  }
  setFillEnvelope(t, e, n, r) {
    r || (r = "envelope");
    let s;
    if (e != null || n != null) {
      const o = {};
      e != null && (o.stroke = new Nr(e)), n != null && (o.fill = new Gr(n)), s = new ue(o);
    }
    return this.setFeature(
      {
        geometry: new Ke([t])
      },
      s,
      r
    );
  }
  exchangeSource(t = void 0) {
    const e = this.getLayers(), n = e.item(0), r = Ge.spawnLayer(n, t, this.getTarget());
    r != n && e.setAt(0, r), t && t.setMap(this);
  }
  setLayer(t = void 0) {
    const e = this.getLayer("overlay").getLayers();
    if (e.clear(), t) {
      const n = new Ir({
        source: t
      });
      Ge.applyWmtsZoomGate(n, t), e.push(n);
    }
  }
  setTransparency(t) {
    const e = (100 - t) / 100, n = this.getSource();
    n instanceof Sn || n instanceof Jr ? (this.getLayers().item(0).setOpacity(1), this.getLayers().item(1).setOpacity(e)) : this.getLayers().item(0).setOpacity(e);
  }
  setGPSMarker(t, e) {
    this.getLayers().item(0).getSource().setGPSMarker(t, e);
  }
}
const Zn = {
  /**
   * A true double click, with no dragging.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#dblclick
   * @api
   */
  DBLCLICK: Fe.DBLCLICK,
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
}, No = {
  ACTIVE: "active"
};
class ai extends Tn {
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
      this.get(No.ACTIVE)
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
    this.set(No.ACTIVE, t);
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
function uI(i, t, e) {
  const n = i.getCenterInternal();
  if (n) {
    const r = [n[0] + t[0], n[1] + t[1]];
    i.animateInternal({
      duration: e !== void 0 ? e : 250,
      easing: Hl,
      center: i.getConstrainedCenter(r)
    });
  }
}
function ws(i, t, e, n) {
  const r = i.getZoom();
  if (r === void 0)
    return;
  const s = i.getConstrainedZoom(r + t);
  if (s === void 0)
    return;
  const o = i.getResolutionForZoom(s);
  o !== void 0 && (i.getAnimating() && i.cancelAnimations(), i.animate({
    resolution: o,
    anchor: e,
    duration: n !== void 0 ? n : 250,
    easing: Yi
  }));
}
const xi = {
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
}, Go = {
  LENGTH: "length"
};
class Mi extends Te {
  /**
   * @param {import("./CollectionEventType.js").default} type Type.
   * @param {T} element Element.
   * @param {number} index The index of the added or removed element.
   */
  constructor(t, e, n) {
    super(t), this.element = e, this.index = n;
  }
}
class hI extends Tn {
  /**
   * @param {Array<T>} [array] Array.
   * @param {Options} [options] Collection options.
   */
  constructor(t, e) {
    if (super(), this.on, this.once, this.un, e = e || {}, this.unique_ = !!e.unique, this.array_ = t ?? [], this.unique_)
      for (let n = 1, r = this.array_.length; n < r; ++n)
        this.assertUnique_(this.array_[n], n);
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
    for (let e = 0, n = t.length; e < n; ++e)
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
    for (let n = 0, r = e.length; n < r; ++n)
      t(e[n], n, e);
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
    return this.get(Go.LENGTH);
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
      new Mi(xi.ADD, e, t)
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
    for (let n = 0, r = e.length; n < r; ++n)
      if (e[n] === t)
        return this.removeAt(n);
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
      new Mi(xi.REMOVE, e, t)
    ), e;
  }
  /**
   * Set the element at the provided index.
   * @param {number} index Index.
   * @param {T} elem Element.
   * @api
   */
  setAt(t, e) {
    const n = this.getLength();
    if (t >= n) {
      this.insertAt(t, e);
      return;
    }
    if (t < 0)
      throw new Error("Index out of bounds: " + t);
    this.unique_ && this.assertUnique_(e, t);
    const r = this.array_[t];
    this.array_[t] = e, this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new Mi(xi.REMOVE, r, t)
    ), this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new Mi(xi.ADD, e, t)
    );
  }
  /**
   * @private
   */
  updateLength_() {
    this.set(Go.LENGTH, this.array_.length);
  }
  /**
   * @private
   * @param {T} elem Element.
   * @param {number} [except] Optional index to ignore.
   */
  assertUnique_(t, e) {
    const n = this.array_;
    for (let r = 0, s = n.length; r < s; ++r)
      if (n[r] === t && r !== e)
        throw new Error("Duplicate item added to a unique collection");
  }
}
class fI {
  /**
   * @param {number} decay Rate of decay (must be negative).
   * @param {number} minVelocity Minimum velocity (pixels/millisecond).
   * @param {number} delay Delay to consider to calculate the kinetic
   *     initial values (milliseconds).
   */
  constructor(t, e, n) {
    this.decay_ = t, this.minVelocity_ = e, this.delay_ = n, this.points_ = [], this.angle_ = 0, this.initialVelocity_ = 0;
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
    let n = e - 3;
    for (; n > 0 && this.points_[n + 2] > t; )
      n -= 3;
    const r = this.points_[e + 2] - this.points_[n + 2];
    if (r < 1e3 / 60)
      return !1;
    const s = this.points_[e] - this.points_[n], o = this.points_[e + 1] - this.points_[n + 1];
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
class dI extends ai {
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
    if (t.type == Zn.DBLCLICK) {
      const n = (
        /** @type {MouseEvent} */
        t.originalEvent
      ), r = t.map, s = t.coordinate, o = n.shiftKey ? -this.delta_ : this.delta_, A = r.getView();
      ws(A, o, s, this.duration_), n.preventDefault(), e = !0;
    }
    return !e;
  }
}
const Je = typeof navigator < "u" && typeof navigator.userAgent < "u" ? navigator.userAgent.toLowerCase() : "", pI = Je.includes("safari") && !Je.includes("chrom");
pI && (Je.includes("version/15.4") || /cpu (os|iphone os) 15_4 like mac os x/.test(Je));
const mI = Je.includes("webkit") && !Je.includes("edge"), Aa = Je.includes("macintosh");
typeof WorkerGlobalScope < "u" && typeof OffscreenCanvas < "u" && self instanceof WorkerGlobalScope;
(function() {
  let i = !1;
  try {
    const t = Object.defineProperty({}, "passive", {
      get: function() {
        i = !0;
      }
    });
    window.addEventListener("_", null, t), window.removeEventListener("_", null, t);
  } catch {
  }
  return i;
})();
function qr(i) {
  const t = arguments;
  return function(e) {
    let n = !0;
    for (let r = 0, s = t.length; r < s && (n = n && t[r](e), !!n); ++r)
      ;
    return n;
  };
}
const yI = function(i) {
  const t = i.originalEvent;
  return t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, vI = function(i) {
  const t = i.originalEvent;
  return t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, wI = function(i) {
  const t = i.map.getTargetElement();
  if (!t)
    return !1;
  const e = t.getRootNode(), n = i.map.getOwnerDocument().activeElement;
  return e instanceof ShadowRoot ? e.host.contains(n) : t.contains(n);
}, aa = function(i) {
  const t = i.map.getTargetElement();
  if (!t)
    return !0;
  const e = t.getRootNode();
  return (e instanceof ShadowRoot ? e.host : t).hasAttribute("tabindex") ? wI(i) : !0;
}, bI = cg, ga = function(i) {
  const t = i.originalEvent;
  return "pointerId" in t && t.button == 0 && !(mI && Aa && t.ctrlKey);
}, ca = function(i) {
  const t = (
    /** @type {KeyboardEvent|MouseEvent|TouchEvent} */
    i.originalEvent
  );
  return !t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, EI = function(i) {
  const t = i.originalEvent;
  return Aa ? t.metaKey : t.ctrlKey;
}, la = function(i) {
  const t = i.originalEvent;
  return !t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, Ia = function(i) {
  const t = i.originalEvent, e = (
    /** @type {Element} */
    t.target.tagName
  );
  return e !== "INPUT" && e !== "SELECT" && e !== "TEXTAREA" && // `isContentEditable` is only available on `HTMLElement`, but it may also be a
  // different type like `SVGElement`.
  // @ts-ignore
  !t.target.isContentEditable;
}, wn = function(i) {
  const t = i.originalEvent;
  return "pointerId" in t && t.pointerType == "mouse";
}, xI = function(i) {
  const t = i.originalEvent;
  return "pointerId" in t && t.isPrimary && t.button === 0;
};
class Rn extends ai {
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
      if (t.type == Zn.POINTERDRAG)
        this.handleDragEvent(t), t.originalEvent.preventDefault();
      else if (t.type == Zn.POINTERUP) {
        const n = this.handleUpEvent(t);
        this.handlingDownUpSequence = n && this.targetPointers.length > 0;
      }
    } else if (t.type == Zn.POINTERDOWN) {
      const n = this.handleDownEvent(t);
      this.handlingDownUpSequence = n, e = this.stopDown(n);
    } else t.type == Zn.POINTERMOVE && this.handleMoveEvent(t);
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
function bs(i) {
  const t = i.length;
  let e = 0, n = 0;
  for (let r = 0; r < t; r++)
    e += i[r].clientX, n += i[r].clientY;
  return { clientX: e / t, clientY: n / t };
}
class MI extends Rn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super({
      stopDown: Xi
    }), t = t || {}, this.kinetic_ = t.kinetic, this.lastCentroid = null, this.lastPointersCount_, this.panning_ = !1;
    const e = t.condition ? t.condition : qr(ca, xI);
    this.condition_ = t.onFocusOnly ? qr(aa, e) : e, this.noKinetic_ = !1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    const e = t.map;
    this.panning_ || (this.panning_ = !0, e.getView().beginInteraction());
    const n = this.targetPointers, r = e.getEventPixel(bs(n));
    if (n.length == this.lastPointersCount_) {
      if (this.kinetic_ && this.kinetic_.update(r[0], r[1]), this.lastCentroid) {
        const s = [
          this.lastCentroid[0] - r[0],
          r[1] - this.lastCentroid[1]
        ], A = t.map.getView(), a = A.getResolution();
        a !== void 0 && (Pg(s, a), as(s, A.getRotation()), A.adjustCenterInternal(s));
      }
    } else this.kinetic_ && this.kinetic_.begin();
    this.lastCentroid = r, this.lastPointersCount_ = n.length, t.originalEvent.preventDefault();
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    const e = t.map, n = e.getView();
    if (this.targetPointers.length === 0) {
      if (!this.noKinetic_ && this.kinetic_ && this.kinetic_.end()) {
        const r = this.kinetic_.getDistance(), s = this.kinetic_.getAngle(), o = n.getCenterInternal();
        if (o) {
          const A = (
            /** @type {import("../pixel.js").Pixel} */
            e.getPixelFromCoordinateInternal(o)
          ), a = e.getCoordinateFromPixelInternal([
            A[0] - r * Math.cos(s),
            A[1] - r * Math.sin(s)
          ]);
          n.animateInternal({
            center: n.getConstrainedCenter(
              /** @type {import("../coordinate.js").Coordinate} */
              a
            ),
            duration: 500,
            easing: Yi
          });
        }
      }
      return this.panning_ && (this.panning_ = !1, n.endInteraction()), !1;
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
      const n = t.map.getView();
      return this.lastCentroid = null, n.getAnimating() && n.cancelAnimations(), this.kinetic_ && this.kinetic_.begin(), this.noKinetic_ = this.targetPointers.length > 1, !0;
    }
    return !1;
  }
}
class SI extends Rn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super({
      stopDown: Xi
    }), this.condition_ = t.condition ? t.condition : vI, this.lastAngle_ = void 0, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    if (!wn(t))
      return;
    const e = t.map, n = e.getView();
    if (n.getConstraints().rotation === vs)
      return;
    const r = e.getSize();
    if (!r)
      return;
    const s = t.pixel, o = Math.atan2(r[1] / 2 - s[1], s[0] - r[0] / 2);
    if (this.lastAngle_ !== void 0) {
      const A = o - this.lastAngle_;
      n.adjustRotationInternal(-A);
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
    return wn(t) ? (t.map.getView().endInteraction(this.duration_), !1) : !0;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    return wn(t) && ga(t) && this.condition_(t) ? (t.map.getView().beginInteraction(), this.lastAngle_ = void 0, !0) : !1;
  }
}
class TI extends uA {
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
    const n = "px", r = this.element_.style;
    r.left = Math.min(t[0], e[0]) + n, r.top = Math.min(t[1], e[1]) + n, r.width = Math.abs(e[0] - t[0]) + n, r.height = Math.abs(e[1] - t[1]) + n;
  }
  /**
   * @param {import("../Map.js").default|null} map Map.
   */
  setMap(t) {
    if (this.map_) {
      const e = this.map_.getOverlayContainer();
      e && e.removeChild(this.element_);
      const n = this.element_.style;
      n.left = "inherit", n.top = "inherit", n.width = "inherit", n.height = "inherit";
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
    const n = [
      t,
      [t[0], e[1]],
      e,
      [e[0], t[1]]
    ], r = this.map_, s = n.map(
      (a) => r.getCoordinateFromPixelInternal(a)
    ), o = s[0];
    if (!o)
      return;
    s[4] = o.slice();
    const A = (
      /** @type {Array<import("../coordinate.js").Coordinate>} */
      s
    );
    this.geometry_ ? this.geometry_.setCoordinates([A]) : this.geometry_ = new Ke([A]);
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
const In = {
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
class Gn extends Te {
  /**
   * @param {string} type The event type.
   * @param {import("../coordinate.js").Coordinate} coordinate The event coordinate.
   * @param {import("../MapBrowserEvent.js").default|null} mapBrowserEvent Originating event.
   */
  constructor(t, e, n) {
    super(t), this.coordinate = e, this.mapBrowserEvent = n;
  }
}
class RI extends Rn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = t ?? {}, this.box_ = new TI(t.className || "ol-dragbox"), this.minArea_ = t.minArea ?? 64, t.onBoxEnd && (this.onBoxEnd = t.onBoxEnd), this.startPixel_ = null, this.condition_ = t.condition ?? ga, this.boxEndCondition_ = t.boxEndCondition ?? this.defaultBoxEndCondition;
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
  defaultBoxEndCondition(t, e, n) {
    const r = n[0] - e[0], s = n[1] - e[1];
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
      new Gn(
        In.BOXDRAG,
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
      new Gn(
        e ? In.BOXEND : In.BOXCANCEL,
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
      new Gn(
        In.BOXSTART,
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
      new Gn(In.BOXCANCEL, this.startPixel_, null)
    ), this.startPixel_ = null)), super.setActive(t);
  }
  /**
   * @param {import("../Map.js").default|null} map Map.
   * @override
   */
  setMap(t) {
    this.getMap() && (this.box_.setMap(null), this.startPixel_ && (this.dispatchEvent(
      new Gn(In.BOXCANCEL, this.startPixel_, null)
    ), this.startPixel_ = null)), super.setMap(t);
  }
}
class PI extends RI {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = t.condition ? t.condition : la;
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
    const n = e.getView();
    let r = this.getGeometry();
    if (this.out_) {
      const s = n.rotatedExtentForGeometry(r), o = n.getResolutionForExtentInternal(s), A = n.getResolution();
      if (o === void 0 || A === void 0)
        return;
      const a = A / o;
      r = r.clone(), r.scale(a * a);
    }
    n.fitInternal(r, {
      duration: this.duration_,
      easing: Yi
    });
  }
}
const ze = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown"
};
class kI extends ai {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.defaultCondition_ = function(e) {
      return ca(e) && Ia(e);
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
    if (t.type == Fe.KEYDOWN) {
      const n = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), r = n.key;
      if (this.condition_(t) && (r == ze.DOWN || r == ze.LEFT || r == ze.RIGHT || r == ze.UP)) {
        const o = t.map.getView(), A = o.getResolution();
        if (A === void 0)
          return !0;
        const a = A * this.pixelDelta_;
        let g = 0, I = 0;
        r == ze.DOWN ? I = -a : r == ze.LEFT ? g = -a : r == ze.RIGHT ? g = a : I = a;
        const l = [g, I];
        as(l, o.getRotation()), uI(o, l, this.duration_), n.preventDefault(), e = !0;
      }
    }
    return !e;
  }
}
class _I extends ai {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.condition_ = t.condition ? t.condition : function(e) {
      return !EI(e) && Ia(e);
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
    if (t.type == Fe.KEYDOWN || t.type == Fe.KEYPRESS) {
      const n = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), r = n.key;
      if (this.condition_(t) && (r === "+" || r === "-")) {
        const s = t.map, o = r === "+" ? this.delta_ : -this.delta_, A = s.getView();
        ws(A, o, void 0, this.duration_), n.preventDefault(), e = !0;
      }
    }
    return !e;
  }
}
const OI = 40, LI = 300, DI = 3;
class BI extends ai {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Interaction.js").InteractionOptions} */
      t
    ), this.totalDelta_ = 0, this.lastDelta_ = 0, this.maxDelta_ = t.maxDelta !== void 0 ? t.maxDelta : 1, this.duration_ = t.duration !== void 0 ? t.duration : 250, this.timeout_ = t.timeout !== void 0 ? t.timeout : 80, this.useAnchor_ = t.useAnchor !== void 0 ? t.useAnchor : !0, this.constrainResolution_ = t.constrainResolution !== void 0 ? t.constrainResolution : !1;
    const e = t.condition ? t.condition : bI;
    this.condition_ = t.onFocusOnly ? qr(aa, e) : e, this.lastAnchor_ = null, this.startTime_ = void 0, this.timeoutId_, this.mode_ = void 0, this.trackpadEventGap_ = 400, this.trackpadTimeoutId_, this.deltaPerZoom_ = 300;
  }
  /**
   * @private
   */
  endInteraction_() {
    this.trackpadTimeoutId_ = void 0;
    const t = this.getMap();
    if (!t)
      return;
    const e = t.getView(), n = this.lastDelta_ ? this.lastDelta_ > 0 ? 1 : -1 : 0;
    e.endInteraction(
      this.constrainResolution_ || e.getConstrainResolution() ? 100 : void 0,
      n,
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
    if (!this.condition_(t) || t.type !== Fe.WHEEL)
      return !0;
    const n = t.map, r = (
      /** @type {WheelEvent} */
      t.originalEvent
    );
    r.preventDefault();
    const s = r.ctrlKey && !t.ctrlKey;
    this.useAnchor_ && (this.lastAnchor_ = t.pixel);
    let o = r.deltaY;
    switch (r.deltaMode) {
      case WheelEvent.DOM_DELTA_LINE:
        o *= OI;
        break;
      case WheelEvent.DOM_DELTA_PAGE:
        o *= LI;
        break;
    }
    if (o === 0)
      return !1;
    this.lastDelta_ = o;
    const A = Date.now();
    this.startTime_ === void 0 && (this.startTime_ = A), (!this.mode_ || A - this.startTime_ > this.trackpadEventGap_) && (this.mode_ = Math.abs(o) < 4 ? "trackpad" : "wheel");
    const a = n.getView();
    if (this.mode_ === "trackpad")
      return this.trackpadTimeoutId_ ? clearTimeout(this.trackpadTimeoutId_) : (a.getAnimating() && a.cancelAnimations(), a.beginInteraction()), this.trackpadTimeoutId_ = setTimeout(
        this.endInteraction_.bind(this),
        this.timeout_
      ), s && (o = o * DI), a.adjustZoom(
        -o / this.deltaPerZoom_,
        this.lastAnchor_ ? n.getCoordinateFromPixel(this.lastAnchor_) : void 0
      ), this.startTime_ = A, !1;
    this.totalDelta_ += o;
    const g = Math.max(this.timeout_ - (A - this.startTime_), 0);
    return clearTimeout(this.timeoutId_), this.timeoutId_ = setTimeout(
      this.handleWheelZoom_.bind(this, n),
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
    let n = -ae(
      this.totalDelta_,
      -this.maxDelta_ * this.deltaPerZoom_,
      this.maxDelta_ * this.deltaPerZoom_
    ) / this.deltaPerZoom_;
    (e.getConstrainResolution() || this.constrainResolution_) && (n = n ? n > 0 ? 1 : -1 : 0), ws(
      e,
      n,
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
class NI extends Rn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = Xi), super(e), this.anchor_ = null, this.lastAngle_ = void 0, this.rotating_ = !1, this.rotationDelta_ = 0, this.threshold_ = t.threshold !== void 0 ? t.threshold : 0.3, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    let e = 0;
    const n = this.targetPointers[0], r = this.targetPointers[1], s = Math.atan2(
      r.clientY - n.clientY,
      r.clientX - n.clientX
    );
    if (this.lastAngle_ !== void 0) {
      const a = s - this.lastAngle_;
      this.rotationDelta_ += a, !this.rotating_ && Math.abs(this.rotationDelta_) > this.threshold_ && (this.rotating_ = !0), e = a;
    }
    this.lastAngle_ = s;
    const o = t.map, A = o.getView();
    A.getConstraints().rotation !== vs && (this.anchor_ = o.getCoordinateFromPixelInternal(
      o.getEventPixel(bs(this.targetPointers))
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
class GI extends Rn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = Xi), super(e), this.anchor_ = null, this.duration_ = t.duration !== void 0 ? t.duration : 400, this.lastDistance_ = void 0, this.lastScaleDelta_ = 1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    let e = 1;
    const n = this.targetPointers[0], r = this.targetPointers[1], s = n.clientX - r.clientX, o = n.clientY - r.clientY, A = Math.sqrt(s * s + o * o);
    this.lastDistance_ !== void 0 && (e = this.lastDistance_ / A), this.lastDistance_ = A;
    const a = t.map, g = a.getView();
    e != 1 && (this.lastScaleDelta_ = e), this.anchor_ = a.getCoordinateFromPixelInternal(
      a.getEventPixel(bs(this.targetPointers))
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
      const n = t.map.getView(), r = this.lastScaleDelta_ > 1 ? 1 : -1;
      return n.endInteraction(this.duration_, r), !1;
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
function Fo(i) {
  i = i || {};
  const t = new hI(), e = new fI(-5e-3, 0.05, 100);
  return (i.altShiftDragRotate === void 0 || i.altShiftDragRotate) && t.push(new SI()), (i.doubleClickZoom === void 0 || i.doubleClickZoom) && t.push(
    new dI({
      delta: i.zoomDelta,
      duration: i.zoomDuration
    })
  ), (i.dragPan === void 0 || i.dragPan) && t.push(
    new MI({
      onFocusOnly: i.onFocusOnly,
      kinetic: e
    })
  ), (i.pinchRotate === void 0 || i.pinchRotate) && t.push(new NI()), (i.pinchZoom === void 0 || i.pinchZoom) && t.push(
    new GI({
      duration: i.zoomDuration
    })
  ), (i.keyboard === void 0 || i.keyboard) && (t.push(new kI()), t.push(
    new _I({
      delta: i.zoomDelta,
      duration: i.zoomDuration
    })
  )), (i.mouseWheelZoom === void 0 || i.mouseWheelZoom) && t.push(
    new BI({
      onFocusOnly: i.onFocusOnly,
      duration: i.zoomDuration
    })
  ), (i.shiftDragZoom === void 0 || i.shiftDragZoom) && t.push(
    new PI({
      duration: i.zoomDuration
    })
  ), t;
}
class FI extends Rn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Pointer.js").Options} */
      t
    ), this.condition_ = t.condition ? t.condition : la, this.lastAngle_ = void 0, this.lastMagnitude_ = void 0, this.lastScaleDelta_ = 0, this.duration_ = t.duration !== void 0 ? t.duration : 400;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    if (!wn(t))
      return;
    const e = t.map, n = e.getSize();
    if (!n)
      return;
    const r = t.pixel, s = r[0] - n[0] / 2, o = n[1] / 2 - r[1], A = Math.atan2(o, s), a = Math.sqrt(s * s + o * o), g = e.getView();
    if (this.lastAngle_ !== void 0) {
      const I = this.lastAngle_ - A;
      g.adjustRotationInternal(I);
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
    if (!wn(t))
      return !0;
    const n = t.map.getView(), r = this.lastScaleDelta_ > 1 ? 1 : -1;
    return n.endInteraction(this.duration_, r), this.lastScaleDelta_ = 0, !1;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    return wn(t) && this.condition_(t) ? (t.map.getView().beginInteraction(), this.lastAngle_ = void 0, this.lastMagnitude_ = void 0, !0) : !1;
  }
}
function jI(i) {
  return UI(i[0], i[1], i[2]);
}
function UI(i, t, e) {
  return (t << i) + e;
}
const zI = /\{z\}/g, XI = /\{x\}/g, ZI = /\{y\}/g, VI = /\{-y\}/g;
function WI(i, t, e, n, r) {
  return i.replace(zI, t.toString()).replace(XI, e.toString()).replace(ZI, n.toString()).replace(VI, function() {
    throw new Error(
      "If the URL template has a {-y} placeholder, the grid extent must be known"
    );
  });
}
function HI(i, t) {
  return (
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile Coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @return {string|undefined} Tile URL.
     */
    (function(e, n, r) {
      if (!e)
        return;
      const s = e[0];
      return WI(i, s, e[1], e[2]);
    })
  );
}
function jo(i, t) {
  const e = i.length, n = new Array(e);
  for (let r = 0; r < e; ++r)
    n[r] = HI(i[r]);
  return QI(n);
}
function QI(i) {
  return i.length === 1 ? i[0] : (
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile Coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @return {string|undefined} Tile URL.
     */
    (function(t, e, n) {
      if (!t)
        return;
      const r = jI(t), s = jr(r, i.length);
      return i[s](t, e, n);
    })
  );
}
for (let i = 0; i < 9; i++) {
  const t = `ZOOM:${i}`, e = 256 * Math.pow(2, i);
  (function(n, r) {
    const s = new Ka({
      code: n,
      // The extent is used to determine zoom level 0. Recommended values for a
      // projection's validity extent can be found at https://epsg.io/.
      extent: [0, 0, r, r],
      units: "m"
    });
    Br(s), ki(
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
class Ca extends Ul(IA) {
  constructor(t = {}) {
    t = ta(t), t.wrapX = !1;
    const e = Math.log2(t.width / Ze), n = Math.log2(t.height / Ze);
    t.maxZoom = Math.ceil(Math.max(e, n)), t.tileUrlFunction = t.tileUrlFunction || function(r) {
      const s = r[0], o = r[1], A = r[2];
      return (
        // @ts-ignore
        o * Ze * Math.pow(2, this.maxZoom - s) >= this.width || // @ts-ignore
        A * Ze * Math.pow(2, this.maxZoom - s) >= this.height || o < 0 || A < 0 ? ZA : this._tileUrlFunction(r)
      );
    }, super(t), t.mapID && (this.mapID = t.mapID), t.urls ? this._tileUrlFunction = jo(t.urls) : t.url && (this._tileUrlFunction = jo(Array.isArray(t.url) ? t.url : [t.url])), this.width = t.width, this.height = t.height, this.maxZoom = t.maxZoom, this._maxxy = Math.pow(2, this.maxZoom) * Ze, this.initialize(t);
  }
}
class ji extends Sn {
  static isBasemap_ = !1;
  constructor(t = {}) {
    super(Object.assign(t, { opaque: !1 }));
  }
}
const ve = "https://weiwudi.example.com/api/";
let br, Cn;
class YI {
  constructor() {
    this.listeners = {};
  }
  addEventListener(t, e) {
    t in this.listeners || (this.listeners[t] = []), this.listeners[t].push(e);
  }
  removeEventListener(t, e) {
    if (!(t in this.listeners))
      return;
    const n = this.listeners[t];
    for (let r = 0, s = n.length; r < s; r++)
      if (n[r] === e) {
        n.splice(r, 1);
        return;
      }
  }
  dispatchEvent(t) {
    if (!(t.type in this.listeners))
      return !0;
    const e = this.listeners[t.type].slice();
    for (let n = 0, r = e.length; n < r; n++)
      e[n].call(this, t);
    return !t.defaultPrevented;
  }
}
class Ce extends YI {
  static async registerSW(t, e) {
    if (!("serviceWorker" in navigator))
      throw "Error: Service worker is not supported";
    let n;
    try {
      n = await navigator.serviceWorker.register(t, e);
    } catch (r) {
      throw `Error: Service worker registration failed with ${r}`;
    }
    return await Ce.waitForController(), await Ce.swCheck(), n;
  }
  static async waitForController() {
    return new Promise((t, e) => {
      let n = !1, r;
      function s() {
        n || (n = !0, r !== void 0 && clearTimeout(r), navigator.serviceWorker.removeEventListener("controllerchange", o));
      }
      function o() {
        navigator.serviceWorker.controller && (s(), t());
      }
      navigator.serviceWorker.addEventListener("controllerchange", o), r = setTimeout(() => {
        s(), e("Error: Service worker did not control this page within 10000 ms");
      }, 1e4), navigator.serviceWorker.ready.then(() => {
        navigator.serviceWorker.controller && (s(), t());
      }).catch(() => {
      });
    });
  }
  static async swCheck() {
    return Cn !== void 0 ? Cn : (br === void 0 && (br = new Promise((t, e) => {
      fetch(`${ve}ping`).then((n) => {
        Cn = !!n, t(Cn);
      }).catch((n) => {
        Cn = !1, t(Cn);
      });
    })), br);
  }
  static async registerMap(t, e) {
    if (!await Ce.swCheck()) throw "Weiwudi service worker is not implemented.";
    let n;
    const r = ["type", "url", "width", "height", "tileSize", "minZoom", "maxZoom", "maxLng", "maxLat", "minLng", "minLat", "cacheTtl", "cacheMaxBytes"].reduce((o, A) => (typeof e[A] < "u" && (e[A] instanceof Array ? e[A].map((a) => {
      o.append(A, a);
    }) : o.append(A, String(e[A]))), o), new URLSearchParams());
    r.append("mapID", t);
    const s = new URL(`${ve}add`);
    if (s.search = r.toString(), n = await (await fetch(s.href)).text(), n.match(/^Error: /))
      throw n;
    return new Ce(t, JSON.parse(n));
  }
  static async retrieveMap(t) {
    if (!await Ce.swCheck()) throw "Weiwudi service worker is not implemented.";
    let e;
    if (e = await (await fetch(`${ve}info?mapID=${t}`)).text(), e.match(/^Error: /))
      throw e;
    return console.log(e), new Ce(t, JSON.parse(e));
  }
  static async removeMap(t) {
    if (!await Ce.swCheck()) throw "Weiwudi service worker is not implemented.";
    let e;
    if (e = await (await fetch(`${ve}delete?mapID=${t}`)).text(), e.match(/^Error: /))
      throw e;
  }
  constructor(t, e) {
    if (super(), !t) throw "MapID is necessary.";
    this.mapID = t, e && Object.assign(this, e), this.url = `${ve}cache/${t}/{z}/{x}/{y}`, this.listener = (n) => {
      n.data.mapID === t && this.dispatchEvent(new CustomEvent(n.data.type, { detail: n.data }));
    }, navigator.serviceWorker.addEventListener("message", this.listener);
  }
  release() {
    navigator.serviceWorker.removeEventListener("message", this.listener), delete this.mapID;
  }
  checkAspect() {
    if (!this.mapID) throw "This instance is already released.";
  }
  async stats() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${ve}stats?mapID=${this.mapID}`)).text(), typeof t == "string" && t.match(/^Error: /))
      throw t;
    return JSON.parse(t);
  }
  async clean() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${ve}clean?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
  async fetchAll() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${ve}fetchAll?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
  async remove() {
    this.checkAspect(), this.mapID && await Ce.removeMap(this.mapID), this.release();
  }
  async cancel() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${ve}cancel?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
}
function Si(i, t, e) {
  const n = typeof i == "string" ? i : i.getCode(), r = typeof t == "string" ? t : t.getCode();
  let s = cr(i, t);
  if (s == lr && n != r) {
    const o = cr(i, "EPSG:3857"), A = cr("EPSG:3857", t);
    if (o == lr && n != "EPSG:3857")
      throw "Transform of Source projection is not defined.";
    if (A == lr && r != "EPSG:3857")
      throw "Transform of Distination projection is not defined.";
    s = function(g) {
      return $t($t(g, i, "EPSG:3857"), "EPSG:3857", t);
    }, ki(i, t, s, function(g) {
      return $t($t(g, t, "EPSG:3857"), "EPSG:3857", i);
    });
  }
  if (e)
    return s(e);
}
const KI = [
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
async function JI(i) {
  const t = i;
  if (KI.forEach((s) => {
    t[s] = i[s];
  }), (i.imageExtention || i.imageExtension) && (t.imageExtension = i.imageExtension || i.imageExtention), !i.compiled)
    throw new Error(
      "@maplat/transform requires pre-compiled data. Cannot create MapTransform from GCPs."
    );
  const e = { compiled: i.compiled };
  i.sub_maps?.length && (e.sub_maps = i.sub_maps.filter((s) => s.compiled).map((s) => ({
    compiled: s.compiled,
    priority: s.priority,
    importance: s.importance,
    bounds: s.bounds
  })));
  const n = new XA();
  n.setMapData(e);
  const r = n.getLayerTransform(0);
  if (t.strictMode = r.strictMode, t.vertexMode = r.vertexMode, t.yaxisMode = r.yaxisMode, t.width = r.wh?.[0], t.height = r.wh?.[1], t.gcps = r.points, t.edges = r.edges, i.sub_maps) {
    const s = i.sub_maps.map((o, A) => {
      const a = {
        importance: o.importance,
        priority: o.priority
      };
      if (o.compiled) {
        const g = n.getLayerTransform(A + 1);
        a.bounds = g?.bounds ?? o.bounds, a.gcps = g?.points, a.edges = g?.edges;
      } else
        a.bounds = o.bounds, a.gcps = o.gcps, a.edges = o.edges;
      return a;
    });
    t.sub_maps = s;
  }
  return [t, n];
}
function Uo(i, t, e) {
  return typeof i.merc2XyVisibleLayers != "function" ? null : i.merc2XyVisibleLayers(t).filter(([, n]) => e(n)).slice(0, 2).map(([n, r]) => [n, r]);
}
class Ui extends Ca {
  mapTransform;
  constructor(t = {}) {
    super(t), this.mapTransform = new XA();
  }
  static async createAsync(t) {
    const [e, n] = await JI(t);
    t = e;
    const r = new Ui(t);
    r.mapTransform = n;
    const s = n.getLayerTransform(0), o = new Qn({
      code: `Illst:${r.mapID}`,
      extent: [0, 0, r.width, r.height],
      units: "m"
    });
    return Br(o), ki(
      o,
      "EPSG:3857",
      (A) => s.transform(A, !1),
      (A) => s.transform(A, !0)
    ), Si("EPSG:4326", o), t.sub_maps && t.sub_maps.forEach((A, a) => {
      const g = a + 1, I = `Illst:${r.mapID}#${g}`, l = n.getLayerTransform(g);
      if (!l) return;
      const u = new Qn({
        code: I,
        extent: [l.xy[0], l.xy[1], l.wh[0], l.wh[1]],
        units: "m"
      });
      Br(u), ki(
        u,
        "EPSG:3857",
        (p) => l.transform(p, !1, !0),
        (p) => l.transform(p, !0, !0)
      ), Si("EPSG:4326", u);
    }), r;
  }
  xy2MercAsync_specifyLayer(t, e) {
    const n = `Illst:${this.mapID}${e ? `#${e}` : ""}`;
    return new Promise((r, s) => {
      r(Si(n, "EPSG:3857", t));
    });
  }
  merc2XyAsync_specifyLayer(t, e) {
    const n = `Illst:${this.mapID}${e ? `#${e}` : ""}`;
    return new Promise((r, s) => {
      r(Si("EPSG:3857", n, t));
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
        (n) => n ? [n[0], n[1]] : void 0
      )
    );
  }
  setupMapParameter(t) {
    const e = [this.width / 2, this.height / 2], n = this.mapTransform.xy2MercWithLayer(e);
    if (!n) return;
    const [r, s] = n, o = this.mapTransform.getLayerTransform(r), A = this.mapTransform.getLayerTransform(0);
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
    ], I = a.map((c) => o.transform(c, !1)), l = g.map(
      (c) => A.transform(c, !1)
    ), u = Math.sqrt(
      Math.pow(I[0][0] - I[1][0], 2) + Math.pow(I[0][1] - I[1][1], 2)
    ), p = Math.sqrt(
      Math.pow(I[2][0] - I[3][0], 2) + Math.pow(I[2][1] - I[3][1], 2)
    ), m = (u + p) / 2;
    this.mercZoom || (this.mercZoom = Math.log(300 * (2 * dt) / 256 / m) / Math.log(2) - 3), this.homePosition || (this.homePosition = zi(s)), this.envelope = QA([
      [
        l[0],
        l[1],
        l[2],
        l[3],
        l[0]
      ]
    ]), t(this);
  }
  // GPS マーカー用（呼び出し元は mixin の setGPSMarkerAsync のみ）。
  // Transform が merc2XyVisibleLayers を持てば、紙外の本図を除いた表示候補の 1・2 位を返す（MaplatCore#104）:
  // 1 位は中心＋周囲 4 点を同じ層で逆変換した 5 点、2 位は中心だけ。undefined（旧 hide 表現）を含まない 0〜2 件。
  // 持たない（@maplat/transform 1.0.x）なら従来経路（mercs2SysCoords）。
  mercs2SysCoordsAsync_multiLayer(t) {
    const e = t[0], n = Uo(
      this.mapTransform,
      e[0],
      (s) => this.insideCheckXy(s)
    );
    if (n)
      return Promise.resolve(
        n.map(([s, o], A) => {
          if (A > 0)
            return [[this.xy2SysCoord(o)], t[1]];
          const a = this.mapTransform.getLayerTransform(s);
          return [
            e.map(
              (I, l) => l === 0 ? o : a.transform(I, !0, s > 0)
            ).map((I) => this.xy2SysCoord(I)),
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
    return this.merc2XyAsync_returnLayer(t).then((n) => e && !n[0] ? void 0 : (n[0] ? n[0] : n[1])[1]);
  }
  // POI ピン用（呼び出し元は mixin の merc2SysCoordAsync_ignoreBackground → index.ts の setMarker のみ）。
  // Transform が merc2XyVisibleLayers を持てば、紙外の本図を除いた表示候補の 1 位、無ければ undefined（MaplatCore#104）。
  // 持たない（@maplat/transform 1.0.x）なら従来経路。
  merc2XyAsync_ignoreBackground(t) {
    const e = Uo(
      this.mapTransform,
      t,
      (n) => this.insideCheckXy(n)
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
    const n = t?.[0] ?? this.getMap().getView().getCenter(), r = t?.[1] ?? this.getMap().getView().getDecimalZoom(), s = t?.[2] ?? this.getMap().getView().getRotation();
    e || (e = this.getMap().getSize());
    const o = this.mapTransform.viewpoint2Mercs(
      { center: n, zoom: r, rotation: s },
      e
    );
    return Promise.resolve([o, e]);
  }
  mercs2ViewpointAsync(t) {
    const e = t[1] ?? this.getMap().getSize(), n = this.mapTransform.mercs2Viewpoint(
      t[0],
      e
    );
    return Promise.resolve([
      n.center,
      n.zoom,
      n.rotation
    ]);
  }
}
var Lt = typeof globalThis < "u" && globalThis || typeof self < "u" && self || // eslint-disable-next-line no-undef
typeof globalThis < "u" && globalThis || {}, Ht = {
  searchParams: "URLSearchParams" in Lt,
  iterable: "Symbol" in Lt && "iterator" in Symbol,
  blob: "FileReader" in Lt && "Blob" in Lt && (function() {
    try {
      return new Blob(), !0;
    } catch {
      return !1;
    }
  })(),
  formData: "FormData" in Lt,
  arrayBuffer: "ArrayBuffer" in Lt
};
function qI(i) {
  return i && DataView.prototype.isPrototypeOf(i);
}
if (Ht.arrayBuffer)
  var $I = [
    "[object Int8Array]",
    "[object Uint8Array]",
    "[object Uint8ClampedArray]",
    "[object Int16Array]",
    "[object Uint16Array]",
    "[object Int32Array]",
    "[object Uint32Array]",
    "[object Float32Array]",
    "[object Float64Array]"
  ], tC = ArrayBuffer.isView || function(i) {
    return i && $I.indexOf(Object.prototype.toString.call(i)) > -1;
  };
function Pn(i) {
  if (typeof i != "string" && (i = String(i)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(i) || i === "")
    throw new TypeError('Invalid character in header field name: "' + i + '"');
  return i.toLowerCase();
}
function Es(i) {
  return typeof i != "string" && (i = String(i)), i;
}
function xs(i) {
  var t = {
    next: function() {
      var e = i.shift();
      return { done: e === void 0, value: e };
    }
  };
  return Ht.iterable && (t[Symbol.iterator] = function() {
    return t;
  }), t;
}
function Rt(i) {
  this.map = {}, i instanceof Rt ? i.forEach(function(t, e) {
    this.append(e, t);
  }, this) : Array.isArray(i) ? i.forEach(function(t) {
    if (t.length != 2)
      throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + t.length);
    this.append(t[0], t[1]);
  }, this) : i && Object.getOwnPropertyNames(i).forEach(function(t) {
    this.append(t, i[t]);
  }, this);
}
Rt.prototype.append = function(i, t) {
  i = Pn(i), t = Es(t);
  var e = this.map[i];
  this.map[i] = e ? e + ", " + t : t;
};
Rt.prototype.delete = function(i) {
  delete this.map[Pn(i)];
};
Rt.prototype.get = function(i) {
  return i = Pn(i), this.has(i) ? this.map[i] : null;
};
Rt.prototype.has = function(i) {
  return this.map.hasOwnProperty(Pn(i));
};
Rt.prototype.set = function(i, t) {
  this.map[Pn(i)] = Es(t);
};
Rt.prototype.forEach = function(i, t) {
  for (var e in this.map)
    this.map.hasOwnProperty(e) && i.call(t, this.map[e], e, this);
};
Rt.prototype.keys = function() {
  var i = [];
  return this.forEach(function(t, e) {
    i.push(e);
  }), xs(i);
};
Rt.prototype.values = function() {
  var i = [];
  return this.forEach(function(t) {
    i.push(t);
  }), xs(i);
};
Rt.prototype.entries = function() {
  var i = [];
  return this.forEach(function(t, e) {
    i.push([e, t]);
  }), xs(i);
};
Ht.iterable && (Rt.prototype[Symbol.iterator] = Rt.prototype.entries);
function Er(i) {
  if (!i._noBody) {
    if (i.bodyUsed)
      return Promise.reject(new TypeError("Already read"));
    i.bodyUsed = !0;
  }
}
function ua(i) {
  return new Promise(function(t, e) {
    i.onload = function() {
      t(i.result);
    }, i.onerror = function() {
      e(i.error);
    };
  });
}
function eC(i) {
  var t = new FileReader(), e = ua(t);
  return t.readAsArrayBuffer(i), e;
}
function nC(i) {
  var t = new FileReader(), e = ua(t), n = /charset=([A-Za-z0-9_-]+)/.exec(i.type), r = n ? n[1] : "utf-8";
  return t.readAsText(i, r), e;
}
function iC(i) {
  for (var t = new Uint8Array(i), e = new Array(t.length), n = 0; n < t.length; n++)
    e[n] = String.fromCharCode(t[n]);
  return e.join("");
}
function zo(i) {
  if (i.slice)
    return i.slice(0);
  var t = new Uint8Array(i.byteLength);
  return t.set(new Uint8Array(i)), t.buffer;
}
function ha() {
  return this.bodyUsed = !1, this._initBody = function(i) {
    this.bodyUsed = this.bodyUsed, this._bodyInit = i, i ? typeof i == "string" ? this._bodyText = i : Ht.blob && Blob.prototype.isPrototypeOf(i) ? this._bodyBlob = i : Ht.formData && FormData.prototype.isPrototypeOf(i) ? this._bodyFormData = i : Ht.searchParams && URLSearchParams.prototype.isPrototypeOf(i) ? this._bodyText = i.toString() : Ht.arrayBuffer && Ht.blob && qI(i) ? (this._bodyArrayBuffer = zo(i.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : Ht.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(i) || tC(i)) ? this._bodyArrayBuffer = zo(i) : this._bodyText = i = Object.prototype.toString.call(i) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof i == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : Ht.searchParams && URLSearchParams.prototype.isPrototypeOf(i) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
  }, Ht.blob && (this.blob = function() {
    var i = Er(this);
    if (i)
      return i;
    if (this._bodyBlob)
      return Promise.resolve(this._bodyBlob);
    if (this._bodyArrayBuffer)
      return Promise.resolve(new Blob([this._bodyArrayBuffer]));
    if (this._bodyFormData)
      throw new Error("could not read FormData body as blob");
    return Promise.resolve(new Blob([this._bodyText]));
  }), this.arrayBuffer = function() {
    if (this._bodyArrayBuffer) {
      var i = Er(this);
      return i || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
        this._bodyArrayBuffer.buffer.slice(
          this._bodyArrayBuffer.byteOffset,
          this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
        )
      ) : Promise.resolve(this._bodyArrayBuffer));
    } else {
      if (Ht.blob)
        return this.blob().then(eC);
      throw new Error("could not read as ArrayBuffer");
    }
  }, this.text = function() {
    var i = Er(this);
    if (i)
      return i;
    if (this._bodyBlob)
      return nC(this._bodyBlob);
    if (this._bodyArrayBuffer)
      return Promise.resolve(iC(this._bodyArrayBuffer));
    if (this._bodyFormData)
      throw new Error("could not read FormData body as text");
    return Promise.resolve(this._bodyText);
  }, Ht.formData && (this.formData = function() {
    return this.text().then(oC);
  }), this.json = function() {
    return this.text().then(JSON.parse);
  }, this;
}
var rC = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
function sC(i) {
  var t = i.toUpperCase();
  return rC.indexOf(t) > -1 ? t : i;
}
function qe(i, t) {
  if (!(this instanceof qe))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  t = t || {};
  var e = t.body;
  if (i instanceof qe) {
    if (i.bodyUsed)
      throw new TypeError("Already read");
    this.url = i.url, this.credentials = i.credentials, t.headers || (this.headers = new Rt(i.headers)), this.method = i.method, this.mode = i.mode, this.signal = i.signal, !e && i._bodyInit != null && (e = i._bodyInit, i.bodyUsed = !0);
  } else
    this.url = String(i);
  if (this.credentials = t.credentials || this.credentials || "same-origin", (t.headers || !this.headers) && (this.headers = new Rt(t.headers)), this.method = sC(t.method || this.method || "GET"), this.mode = t.mode || this.mode || null, this.signal = t.signal || this.signal || (function() {
    if ("AbortController" in Lt) {
      var s = new AbortController();
      return s.signal;
    }
  })(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && e)
    throw new TypeError("Body not allowed for GET or HEAD requests");
  if (this._initBody(e), (this.method === "GET" || this.method === "HEAD") && (t.cache === "no-store" || t.cache === "no-cache")) {
    var n = /([?&])_=[^&]*/;
    if (n.test(this.url))
      this.url = this.url.replace(n, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
    else {
      var r = /\?/;
      this.url += (r.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
    }
  }
}
qe.prototype.clone = function() {
  return new qe(this, { body: this._bodyInit });
};
function oC(i) {
  var t = new FormData();
  return i.trim().split("&").forEach(function(e) {
    if (e) {
      var n = e.split("="), r = n.shift().replace(/\+/g, " "), s = n.join("=").replace(/\+/g, " ");
      t.append(decodeURIComponent(r), decodeURIComponent(s));
    }
  }), t;
}
function AC(i) {
  var t = new Rt(), e = i.replace(/\r?\n[\t ]+/g, " ");
  return e.split("\r").map(function(n) {
    return n.indexOf(`
`) === 0 ? n.substr(1, n.length) : n;
  }).forEach(function(n) {
    var r = n.split(":"), s = r.shift().trim();
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
ha.call(qe.prototype);
function fe(i, t) {
  if (!(this instanceof fe))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  if (t || (t = {}), this.type = "default", this.status = t.status === void 0 ? 200 : t.status, this.status < 200 || this.status > 599)
    throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
  this.ok = this.status >= 200 && this.status < 300, this.statusText = t.statusText === void 0 ? "" : "" + t.statusText, this.headers = new Rt(t.headers), this.url = t.url || "", this._initBody(i);
}
ha.call(fe.prototype);
fe.prototype.clone = function() {
  return new fe(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Rt(this.headers),
    url: this.url
  });
};
fe.error = function() {
  var i = new fe(null, { status: 200, statusText: "" });
  return i.ok = !1, i.status = 0, i.type = "error", i;
};
var aC = [301, 302, 303, 307, 308];
fe.redirect = function(i, t) {
  if (aC.indexOf(t) === -1)
    throw new RangeError("Invalid status code");
  return new fe(null, { status: t, headers: { location: i } });
};
var Ve = Lt.DOMException;
try {
  new Ve();
} catch {
  Ve = function(t, e) {
    this.message = t, this.name = e;
    var n = Error(t);
    this.stack = n.stack;
  }, Ve.prototype = Object.create(Error.prototype), Ve.prototype.constructor = Ve;
}
function fa(i, t) {
  return new Promise(function(e, n) {
    var r = new qe(i, t);
    if (r.signal && r.signal.aborted)
      return n(new Ve("Aborted", "AbortError"));
    var s = new XMLHttpRequest();
    function o() {
      s.abort();
    }
    s.onload = function() {
      var g = {
        statusText: s.statusText,
        headers: AC(s.getAllResponseHeaders() || "")
      };
      r.url.indexOf("file://") === 0 && (s.status < 200 || s.status > 599) ? g.status = 200 : g.status = s.status, g.url = "responseURL" in s ? s.responseURL : g.headers.get("X-Request-URL");
      var I = "response" in s ? s.response : s.responseText;
      setTimeout(function() {
        e(new fe(I, g));
      }, 0);
    }, s.onerror = function() {
      setTimeout(function() {
        n(new TypeError("Network request failed"));
      }, 0);
    }, s.ontimeout = function() {
      setTimeout(function() {
        n(new TypeError("Network request timed out"));
      }, 0);
    }, s.onabort = function() {
      setTimeout(function() {
        n(new Ve("Aborted", "AbortError"));
      }, 0);
    };
    function A(g) {
      try {
        return g === "" && Lt.location.href ? Lt.location.href : g;
      } catch {
        return g;
      }
    }
    if (s.open(r.method, A(r.url), !0), r.credentials === "include" ? s.withCredentials = !0 : r.credentials === "omit" && (s.withCredentials = !1), "responseType" in s && (Ht.blob ? s.responseType = "blob" : Ht.arrayBuffer && (s.responseType = "arraybuffer")), t && typeof t.headers == "object" && !(t.headers instanceof Rt || Lt.Headers && t.headers instanceof Lt.Headers)) {
      var a = [];
      Object.getOwnPropertyNames(t.headers).forEach(function(g) {
        a.push(Pn(g)), s.setRequestHeader(g, Es(t.headers[g]));
      }), r.headers.forEach(function(g, I) {
        a.indexOf(I) === -1 && s.setRequestHeader(I, g);
      });
    } else
      r.headers.forEach(function(g, I) {
        s.setRequestHeader(I, g);
      });
    r.signal && (r.signal.addEventListener("abort", o), s.onreadystatechange = function() {
      s.readyState === 4 && r.signal.removeEventListener("abort", o);
    }), s.send(typeof r._bodyInit > "u" ? null : r._bodyInit);
  });
}
fa.polyfill = !0;
Lt.fetch || (Lt.fetch = fa, Lt.Headers = Rt, Lt.Request = qe, Lt.Response = fe);
const da = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAAqACAAQAAAABAAAANKADAAQAAAABAAAANAAAAAD/4QkhaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/4hskSUNDX1BST0ZJTEUAAQEAABsUYXBwbAIQAABtbnRyUkdCIFhZWiAH4AAKAB0AFAA0AAZhY3NwQVBQTAAAAABBUFBMAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFkZXNjAAABUAAAAGJkc2NtAAABtAAABBhjcHJ0AAAFzAAAACN3dHB0AAAF8AAAABRyWFlaAAAGBAAAABRnWFlaAAAGGAAAABRiWFlaAAAGLAAAABRyVFJDAAAGQAAACAxhYXJnAAAOTAAAACB2Y2d0AAAObAAABhJuZGluAAAUgAAABj5jaGFkAAAawAAAACxtbW9kAAAa7AAAAChiVFJDAAAGQAAACAxnVFJDAAAGQAAACAxhYWJnAAAOTAAAACBhYWdnAAAOTAAAACBkZXNjAAAAAAAAAAhEaXNwbGF5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbWx1YwAAAAAAAAAiAAAADGhySFIAAAAUAAABqGtvS1IAAAAMAAABvG5iTk8AAAASAAAByGlkAAAAAAASAAAB2mh1SFUAAAAUAAAB7GNzQ1oAAAAWAAACAGRhREsAAAAcAAACFnVrVUEAAAAcAAACMmFyAAAAAAAUAAACTml0SVQAAAAUAAACYnJvUk8AAAASAAACdm5sTkwAAAAWAAACiGhlSUwAAAAWAAACnmVzRVMAAAASAAACdmZpRkkAAAAQAAACtHpoVFcAAAAMAAACxHZpVk4AAAAOAAAC0HNrU0sAAAAWAAAC3npoQ04AAAAMAAACxHJ1UlUAAAAkAAAC9GZyRlIAAAAWAAADGG1zAAAAAAASAAADLmNhRVMAAAAYAAADQHRoVEgAAAAMAAADWGVzWEwAAAASAAACdmRlREUAAAAQAAADZGVuVVMAAAASAAADdHB0QlIAAAAYAAADhnBsUEwAAAASAAADnmVsR1IAAAAiAAADsHN2U0UAAAAQAAAD0nRyVFIAAAAUAAAD4mphSlAAAAAMAAAD9nB0UFQAAAAWAAAEAgBMAEMARAAgAHUAIABiAG8AagBpzuy37AAgAEwAQwBEAEYAYQByAGcAZQAtAEwAQwBEAEwAQwBEACAAVwBhAHIAbgBhAFMAegDtAG4AZQBzACAATABDAEQAQgBhAHIAZQB2AG4A/QAgAEwAQwBEAEwAQwBEAC0AZgBhAHIAdgBlAHMAawDmAHIAbQQaBD4EOwRMBD4EQAQ+BDIEOAQ5ACAATABDAEQgDwBMAEMARAAgBkUGRAZIBkYGKQBMAEMARAAgAGMAbwBsAG8AcgBpAEwAQwBEACAAYwBvAGwAbwByAEsAbABlAHUAcgBlAG4ALQBMAEMARCAPAEwAQwBEACAF5gXRBeIF1QXgBdkAVgDkAHIAaQAtAEwAQwBEX2mCcgAgAEwAQwBEAEwAQwBEACAATQDgAHUARgBhAHIAZQBiAG4A6QAgAEwAQwBEBCYEMgQ1BEIEPQQ+BDkAIAQWBBoALQQ0BDgEQQQ/BDsENQQ5AEwAQwBEACAAYwBvAHUAbABlAHUAcgBXAGEAcgBuAGEAIABMAEMARABMAEMARAAgAGUAbgAgAGMAbwBsAG8AcgBMAEMARAAgDioONQBGAGEAcgBiAC0ATABDAEQAQwBvAGwAbwByACAATABDAEQATABDAEQAIABDAG8AbABvAHIAaQBkAG8ASwBvAGwAbwByACAATABDAEQDiAOzA8cDwQPJA7wDtwAgA78DuAPMA70DtwAgAEwAQwBEAEYA5AByAGcALQBMAEMARABSAGUAbgBrAGwAaQAgAEwAQwBEMKsw6TD8AEwAQwBEAEwAQwBEACAAYQAgAEMAbwByAGUAc3RleHQAAAAAQ29weXJpZ2h0IEFwcGxlIEluYy4sIDIwMTYAAFhZWiAAAAAAAADzUgABAAAAARbPWFlaIAAAAAAAAGXoAAA8EAAACdBYWVogAAAAAAAAapMAAKrFAAAXilhZWiAAAAAAAAAmWwAAGSwAALHSY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA2ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKMAqACtALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkHKwc9B08HYQd0B4YHmQesB78H0gflB/gICwgfCDIIRghaCG4IggiWCKoIvgjSCOcI+wkQCSUJOglPCWQJeQmPCaQJugnPCeUJ+woRCicKPQpUCmoKgQqYCq4KxQrcCvMLCwsiCzkLUQtpC4ALmAuwC8gL4Qv5DBIMKgxDDFwMdQyODKcMwAzZDPMNDQ0mDUANWg10DY4NqQ3DDd4N+A4TDi4OSQ5kDn8Omw62DtIO7g8JDyUPQQ9eD3oPlg+zD88P7BAJECYQQxBhEH4QmxC5ENcQ9RETETERTxFtEYwRqhHJEegSBxImEkUSZBKEEqMSwxLjEwMTIxNDE2MTgxOkE8UT5RQGFCcUSRRqFIsUrRTOFPAVEhU0FVYVeBWbFb0V4BYDFiYWSRZsFo8WshbWFvoXHRdBF2UXiReuF9IX9xgbGEAYZRiKGK8Y1Rj6GSAZRRlrGZEZtxndGgQaKhpRGncanhrFGuwbFBs7G2MbihuyG9ocAhwqHFIcexyjHMwc9R0eHUcdcB2ZHcMd7B4WHkAeah6UHr4e6R8THz4faR+UH78f6iAVIEEgbCCYIMQg8CEcIUghdSGhIc4h+yInIlUigiKvIt0jCiM4I2YjlCPCI/AkHyRNJHwkqyTaJQklOCVoJZclxyX3JicmVyaHJrcm6CcYJ0kneierJ9woDSg/KHEooijUKQYpOClrKZ0p0CoCKjUqaCqbKs8rAis2K2krnSvRLAUsOSxuLKIs1y0MLUEtdi2rLeEuFi5MLoIuty7uLyQvWi+RL8cv/jA1MGwwpDDbMRIxSjGCMbox8jIqMmMymzLUMw0zRjN/M7gz8TQrNGU0njTYNRM1TTWHNcI1/TY3NnI2rjbpNyQ3YDecN9c4FDhQOIw4yDkFOUI5fzm8Ofk6Njp0OrI67zstO2s7qjvoPCc8ZTykPOM9Ij1hPaE94D4gPmA+oD7gPyE/YT+iP+JAI0BkQKZA50EpQWpBrEHuQjBCckK1QvdDOkN9Q8BEA0RHRIpEzkUSRVVFmkXeRiJGZ0arRvBHNUd7R8BIBUhLSJFI10kdSWNJqUnwSjdKfUrESwxLU0uaS+JMKkxyTLpNAk1KTZNN3E4lTm5Ot08AT0lPk0/dUCdQcVC7UQZRUFGbUeZSMVJ8UsdTE1NfU6pT9lRCVI9U21UoVXVVwlYPVlxWqVb3V0RXklfgWC9YfVjLWRpZaVm4WgdaVlqmWvVbRVuVW+VcNVyGXNZdJ114XcleGl5sXr1fD19hX7NgBWBXYKpg/GFPYaJh9WJJYpxi8GNDY5dj62RAZJRk6WU9ZZJl52Y9ZpJm6Gc9Z5Nn6Wg/aJZo7GlDaZpp8WpIap9q92tPa6dr/2xXbK9tCG1gbbluEm5rbsRvHm94b9FwK3CGcOBxOnGVcfByS3KmcwFzXXO4dBR0cHTMdSh1hXXhdj52m3b4d1Z3s3gReG54zHkqeYl553pGeqV7BHtje8J8IXyBfOF9QX2hfgF+Yn7CfyN/hH/lgEeAqIEKgWuBzYIwgpKC9INXg7qEHYSAhOOFR4Wrhg6GcobXhzuHn4gEiGmIzokziZmJ/opkisqLMIuWi/yMY4zKjTGNmI3/jmaOzo82j56QBpBukNaRP5GokhGSepLjk02TtpQglIqU9JVflcmWNJaflwqXdZfgmEyYuJkkmZCZ/JpomtWbQpuvnByciZz3nWSd0p5Anq6fHZ+Ln/qgaaDYoUehtqImopajBqN2o+akVqTHpTilqaYapoum/adup+CoUqjEqTepqaocqo+rAqt1q+msXKzQrUStuK4trqGvFq+LsACwdbDqsWCx1rJLssKzOLOutCW0nLUTtYq2AbZ5tvC3aLfguFm40blKucK6O7q1uy67p7whvJu9Fb2Pvgq+hL7/v3q/9cBwwOzBZ8Hjwl/C28NYw9TEUcTOxUvFyMZGxsPHQce/yD3IvMk6ybnKOMq3yzbLtsw1zLXNNc21zjbOts83z7jQOdC60TzRvtI/0sHTRNPG1EnUy9VO1dHWVdbY11zX4Nhk2OjZbNnx2nba+9uA3AXcit0Q3ZbeHN6i3ynfr+A24L3hROHM4lPi2+Nj4+vkc+T85YTmDeaW5x/nqegy6LzpRunQ6lvq5etw6/vshu0R7ZzuKO6070DvzPBY8OXxcvH/8ozzGfOn9DT0wvVQ9d72bfb794r4Gfio+Tj5x/pX+uf7d/wH/Jj9Kf26/kv+3P9t//9wYXJhAAAAAAADAAAAAmZmAADypwAADVkAABPQAAAKDnZjZ3QAAAAAAAAAAAADAQAAAgAAAFYBRQJBAzgEGAUKBggHMAhZCYMKvwwGDWEOtxAKEWwSyhQ1FZwXABhrGc4bNhyQHesfQCCPIdEjCiQ5JVkmaydtKFwpQiodKvErxiyZLWsuPS8NL98wrzGAMlEzITPtNLk1hTZRNxw35TiuOXg6QTsKO9M8nD1kPiw+8j+3QHxBQkIMQt9DvkSqRZ1GkUd+SGFJP0oYSvFLzEyuTZ1OoU+8UONSBVMZVBpVEFYDVvxX+1kAWglbDlwNXQRd9V7iX9BgwGGzYqZjmWSKZXlmZ2dUaEJpNGoqayFsGW0PbgNu9G/icNBxu3Kkc450f3WGdrV4BHllesB8AH0mfjp/SYBbgXWCjoOVhHuFNIXjho+HUIgliQuKAIsCjBGNKI4+j06QV5FaklqTWJRWlVSWUZdOmEuZR5pCmz6cOZ0zni2fKqAwoUuig6PgpUmmrKfrqRGqJasxrDutRK5Nr1ewX7FosnCzd7R+tYK2hbeIuIu5j7qVu5y8pr20vsW/18DgwdbCr8NmxBjEyMWWxnfHZshdyVfKUctLzEfNSM5Uz3HQoNHZ0wvUL9VD1knXRdg42SXaDtr52+jc2N3B3qPfg+Bn4VXiTuNN5E/lT+ZK5znoF+jg6YrqNOrg66jseu1I7gjuqe9H7+Pwo/F48l7zT/RN9Wr2wviH+rf9RP//AAAAVgFFAjEDBAPpBOAF4wbwCAMJNgpoC5wM4A4qD3cQxhIZE3kU1BYyF4IY3Ro1G4Yc0B4aH1ggkSG8Itwj9ST2JeomzSejKHIpPioIKtQrnyxqLTUt/i7GL44wVzEfMecyrjN2ND01ATXFNoo3TzgTONY5mTpbOx073DycPVw+GT7XP5dAW0EmQftC1UOxRIxFZUY8RxFH5ki8SZVKdktlTGJNaE5vT21QYlFPUjtTKlQbVQ5WAlb2V+dY1lnDWq5bm1yKXXpeaV9YYERhL2IYYwFj6mTVZcRmtWemaJZphGpva1lsQG0nbg1u9G/hcN5x9HMhdF91mXbBd9h443nsevl8C30efih/IIAGgN+BtYKPg3KEXoVVhliHaYiDiZ2KrYu1jLaNtI6xj62QqZGlkqCTm5SVlY+WiZeCmHmZb5pnm2mcgJ2/nymgqKIno5Kk06X5pw6oGqkjqiqrMaw3rT6uRK9NsFmxbLKGs6O0vrXRtt636LjzugO7F7wrvTu+QL83wCHBAsHiwsfDtcSnxZvGkMeFyHrJcsp0y4nMvM4Wz33Q3dIa0z/UVNVm1oDXpdjP2fTbEtwt3UzecN+X4Lvh0uLe4+Lk6+YF5znogenR6xHsMO017ibvD+/48Obx1/LK87n0ofV/9lb3J/f2+Lz5evo7+wz8RP3p//8AAABWAS4B6wKdA14EKQUHBfEG6QfqCOIJ8QsKDCUNQQ5aD4EQrBHREv8UJRVFFmoXhRifGbQaxRvIHMYdux6hH3ggQiD6IaQiSyLrI4gkJyTCJV4l+SaUJzAnyihnKQcppypIKucrhiwoLMUtYy4ALp0vPC/YMHUxEjGvMkwy6DODNB40uDVSNew2hTcfN7c4UDjoOX86FjqrO0E70jxjPO49ez4HPps/ND/WQHpBHkG4Qk9C2UNoQ/9EokVQRglGw0d8SDRI6kmiSlxLGEvWTJVNU04PTslPg1A7UPRRr1JrUydT5FShVV1WGVbUV49YSFj/WbVabFskW91cll1OXfZelF8lX7RgQWDaYXhiImLYY5lkaGVHZjdnOWhJaWFqbWthbD9tEG3cbqVvbXA1cPxxw3KKc1B0FXTbdZ92ZHcmd+Z4nnlFedx6bHsUe9N8u32+fsR/w4C5gamCloODhG+FW4ZFhyqIBYjUiZmKWoski/uM4I3NjrmPoJB+kVuSOpMak/mU1pWylpeXjZiSmaGas5vGnNid6p77oA2hIKIzo0ikXKVvpn6niaiMqYCqYas3rA6s8q3trvmwDLEesjKzULR7tbS2+Lg5uXC6mbuwvLi9u77Jv/XBR8K5xFPF9ceWyTPK1MyNzmDQSdJB1ELWbNkO3Ovizur19Pn//wAAbmRpbgAAAAAAAAY2AACTgQAAWIYAAFU/AACRxAAAJtUAABcKAABQDQAAVDkAAiZmAAIMzAABOuEAAwEAAAIAAAABAAMABgALABEAGAAfACcAMAA6AEQATwBaAGYAcwCBAI8AngCuAL4AzwDhAPQBBwEcATEBRwFfAXcBkQGsAcgB5gIGAigCTAJzAp0CywL/AzgDdgO5A/4ERwSTBOIFMwWIBd8GOgaZBvsHYQfKCDcIpwkbCZEKCwqJCwoLkAwaDKcNNA28Dj0Oug84D7sQSBDbEXQSEBKtE0QT0RRUFNEVTxXSFl8W+BeZGD0Y3hl9GhsauhteHAkcvB12HjQe8x+yIHIhNSH8IscjliRoJTwmDibgJ7MoiCliKkErJiwOLPst7i7kL9UwtTF7MjEy3jOINDU07zW4NpI3eThkOUw6MDsXPA49Lj6bQCtBjULJQ+9FCEYVRxlIHEkkSjRLTkxxTZhOxE/yUSNSV1OOVMdWBFdEWIZZzFsWXGJdql7kYAZhEWIGYvVj5WTcZepnD2hLaZVq52w8bZRu7nBKcapzDHRxddp3Rni4ei17pn0gfpuAFoGRgwqEgYX1h2qI64qLjG2OtZERkxqU7ZapmF+aFpvQnY2fR6D1oo+kFKWIpvaoa6nyq5CtRa8RsPGy5rTotuu457rjvPG/F8FDw17FYMdTyT/LL80pzzbRbtP41wTaCdyf3xPhvuUO6HzrQe2v7/vyNvRG9gr3jfjK+ej65fvZ/LT9kP5i/zD//wAAAAEAAwAHAAwAEgAZACEAKgAzAD0ASABUAGAAbQB7AIkAmQCpALkAywDdAPABBQEaATABRwFfAXkBlAGwAc4B7QIPAjMCWgKDArIC5QMfA18DpAPsBDYEhATVBSkFgQXcBjoGmwcAB2gH1QhFCLgJLwmqCikKrAs0C78MUAzjDXgOCQ6VDyEPsBBDENsRdxIWErcTVhPtFH0VChWYFi0WyhdvGBcYwBlpGhQawBtvHCQc3B2ZHlgfGB/ZIJ0hZCIwIwAj1CSrJYQmXCc0KA0o6inMKrMrnyyPLYMufC90MGMxQDIMMs4zijRLNRc18TbZN8c4tjmiOow7ejx2PYk+uD/3QTNCZEOLRKZFtka7R7tIvUnJSuFMAk0qTlZPhVC3UexTJFRfVZ1W3lgiWWpatlwHXVdeml/FYNFhwmKpY4hkaWVSZkhnWWiCacBrDWxibbxvGnB6cd1zQnSpdg93cHjLeiF7dnzQfjV/pIEbgpSECoV7huyIYYnii3qNMI8CkN2SsZR2ljSX8pmxm3WdOp76oKaiMqOdpOemJ6doqLCqF6ucrT2u7bCZsjmzzrVhtvu4orpRvAC9qb9MwPHCn8RixjrIIcoEy83Nds8G0IrSDNOi1V/XTdls26fd5+Af4lDkgea+6RfrkO4m8M3zlPaM+Un7Mvye/eT+8f//AAAAAQAEAAkAEAAYACEAKwA2AEMAUABeAG0AfQCPAKEAtADIAN4A9AEMASYBQAFdAXsBmwG9AeECCQIzAmEClQLQAxUDZQO9BBwEgATqBVkFzQZDBr0HPQfBCEwI3QlzCg8KsAtWDAMMtw1xDjEO+A/FEJkRdRJZE0kUShVRFkoXNxgpGTUaXxt5HHQdYh5UH04gTSFNIkwjTSRSJV8mcyeNKKopyCrpLA0tNy5mL5ow1jIaM2Q0rzX7N1A4zTqJPFk+BT+QQPxCS0ODRKZFt0a8R75Izkn7S0tMtk4uT6xRLlK2VENV1ldtWQparFxWXhFgC2JfZFtl5Gc7aItp5mtSbMxuTW/ScVty6HR7dh533nnGe8B9nX9VgPqCoYRWhh+H8Im9i4yNZo9HkRmSy5RmlfaXg5kRmqKcNp3Nn2ahAaKcpDil1ad1qRuqyKx/rkewL7JGtH+2oriPulm8F73Xv5vBWcMHxKXGNMe7yUXK18x4zi/QA9Hw0+jV0deR2Sfandv+3UXeit/L4Q/iVeOg5OnmMedr6KDpyOrq7AXtHO4w70TwV/Fh8mTzUPQi9PX1jfYc9qr3Ofea9/n4V/i2+Rb5cvm2+fv6QPqE+sn7DvtT+5f70PwI/ED8ePyx/On9If1Z/ZL9yv39/jH+ZP6X/sv+/v8x/2X/mP/M//8AAHNmMzIAAAAAAAEMQgAABd7///MmAAAHkgAA/ZH///ui///9owAAA9wAAMBsbW1vZAAAAAAAAAYQAACc8AAAAADLuPqAAAAAAAAAAAAAAAAAAAAAAP/AABEIADQANAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDAAICAgICAgMCAgMEAwMDBAUEBAQEBQcFBQUFBQcIBwcHBwcHCAgICAgICAgKCgoKCgoLCwsLCw0NDQ0NDQ0NDQ3/2wBDAQICAgMDAwYDAwYNCQcJDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ3/3QAEAAT/2gAMAwEAAhEDEQA/AP08v5vGOr3niqfwPYQ+J7eySCG3ZLCwhNpqk955VzBaSyyxW94dPtWZ7jzpWQ3CCNZN/mRR9Z4d8Qy6l4c+1aHfbL25sJUtL/VLaK0lN551xFMhihCwJNaGF0fYjggByWTr5pat4T0TQv8AhGPDXh6TTdMjeHZFHq+pYiFsrJEsDJcRvAoV2UrGwVlOCCAKpRagbSeyfTLe30+DTY4obK1tYxHb28MP3I405woJJ5ySSSSSTXxOIzfmjzUG1J21a8+z8tNflbr05vxbkcY2wdFSkpxabhGOiST5rNp3t8KstXdt25fQvE/gTwxrZttV8W3En9rS28K3cejyEveSx8eYWZdwDoqpn5MYwGztx4v4/wDhJovicada6NZQeFLTTRLvdLc3E9x55TDXEzyRu7KI8jcWYZPJr2G11BX1satMF8u/BkA44Y9Mg9MMpUN149DXTXxgv7cJLHnc23aD6AuGOMcYUgVvhcZicBjlifauc0rp2srOOrUb2bs2tb/fqfL53x1nGKtg/aWoKySv7vlp2XTt3PI/EHhDwQL43d94attP0+eRVW5s5WgETbeHeFAiomTkkFlGckbQSK3jq18F6Bpp+GkNzDZy+L/NuNMi1K4mWDSGKLayX5ufNV5TExJtbYl5nmwUeKNXlj9RtLNrqSWzKu1ncRSxSq4MkZK/KOWx6nIBPIx2zWl8OfEniK40HT1iubWOZ7Ni0F4zAPNGQmYyPmwWySoHzZByMfN5ODq/VsVGClJwqK2utmte+1rrfs/I/QeD+OMwxlCpTxs3N0OV/E1dNOzejV4tLpqrrS7PGfEOp+FdG8Wa9aeJE8L+NLgX22O71fWL8XtpFFDFD9klittKvYYWieNiVWQby5lZQ0hJzP8AhKfhp/0JngX/AMG2rf8AzPV7R8TfjvoHw01630LWW1Uzz2aXa/Y7eGaPY8kiDLS3ETbsxnjBGMc9ced/8NdeCfXxB/4BWv8A8mV6kcTiaqVSnh5NPVfDs/me9Q45hTpxpuk9El/Ea28lGy9Foj//0P0+ttJ8X6To93JZgPaXSlZBG6y5XncwAJxwCD39vTB06zt0tZdRvYZJEixhF+XcQwDZY5wFyuQBu+YcjrWtbQeJ4poNJspLl7eW3a4hhV9gaGQE5K7gM88jJ59e+haWmrwRWWkTWxhlnuXmHmKeBIVTDH+78h3Ljpg+lfFUsNCfLurXWuqW2v47dT4dUFPl5YyslbXVX026bs1oAuu6TBHpdlIZrd5XSTyRFEExnaclgxYjAwxYHkmrNvfPJDHOUlxNMVfEbMrY6jhSOQ2DzgN1PpT+MN7ceCvgz4j1rT7i9gXw3pEuoodPujZXUzWUbOI/OEcu1JMYbCMfQcYr8/TefEF/jJO0eoeLGnbw2hJB8Tef5bXj8H/inPO2Zz/yx8vP/LTd8te1PLfbUo8796PX9PT/AIJ62OyNVoLnlaVrPT+tvxP0T1/Up9Oskj02FHeaVYEBxsDuxXBUc7eCWOOACeazbttN0HTILt7WY3Fs8cGnySAmGQxmOUgsrbjgxAkkAFkxu5wfAZPFmpT/ALOui/EC11vxNY3S2Vnq7hdQtJJ5JNVmS1W2ku77TZwIoSxb/j3RlB5BzgeT+JNL+Ifw5tdf+It74i1B5J4oZ9Uay8XaNPcTmALEhSFvDSqSq8BVxnue9fPYrJI4ypf2nux0Wn2r638raaffufT8G4OhlNHkrQcueV5PZuK2Xo3e/dM918VXNt4v1h9Y1e10G6lKJEhurWWZ0RB90N9qUY3EnAA5J+p5z+wNB/6Bfhn/AMF8n/yZX0bbafrmgWsGjRW19rIs4xAb+7RBPceV8ivIIYYoslVH3EAxjvmpvtHiH/oCTfk3/wATWftMPR/dfXLculu1vmfeLiPK1osDD8P8j//R/V/QNeknuEfQL57vT5VZI47jawRijGHY6sQV3KF5I6gdTSeI3v4r5m1O4jhuUsEkRoIyQzq7AKVZiMkM3OcZxXzPomq6r4P8Qz6ffB3C3BtL2CR/NZJhheTuy/GCjAlyNqgPmLy/ZdY+Ifgq6aO/1bWbWKW2iKbTLFIX8piwygZSzYPKqeTjjnA+fpwVePs6au3e0b33T1Xl1+9dr9vF/COKyeXsYt1KUrShNX5WnpbrZrSyvrdNb2Og8U3Gran4B1Dw1Z2mk+Ipr4mxlTXbl7bT57S4BSR58RTNIEVgTEoBfpvXOT8sTfsg6fYeLH8YT6nEbpNHjkXUfJU6Y+rG6I+yDRxLg2TQlUVN/nEneJ/O+evoh/Gn2nzUv7ie0g2hEnu4U8hlKEsRs3mAADB3Imc4LEmuqn1SxuVt20iVLmyskVkaCRSs08o8uKIOG2k4bkN/E6HPWuDMs7hg8Hz0Gm9u+vy7dr6pbnj08rzKOY0cBXpShFq7cotWgt3d3Xl5Pc4P/hDvE2u+AbDwNJbeG/C1rBcLaa2mnyG/tYtKtysqLYxT2qRJJcAAFbgH7KhDDzGC15n4Y+E2geItR8barPomieBr7X5tOk8Outjp2rtYyafEBvdIEmt1hnmwHTcpdN2CrFTX1Tql9oFhppfX7b7GH2Qm4tX+WSRtqIGBALOzAKu5Hx61znwzsbu1065Xw/qNtA42WpspFR/3cSZUt95gMOONoyB15yPJwWe+yfLiYciveWj166dXe2vT8j6TKo08bhcVmjnelDlhTt1ve6emjirO1uvTRnrfhmfXbnw9p1x4nSyj1aW2je8XTZXnsxMygt5EkiRu8efullBx+Z3a868RaJqN/qAa1trgQQxJFH9nkiVCo5+6zqQQSR0xgCsL/hFtY/54X/8A3+g/+O18nWxnPUlNU1q2+p5vI3rp95//0v151n4S+DNQv7rX5reZb6VmnaRJmxuB3j5DlMb8t93qzHua+XPi/wCC9LvtOsLuaW4D24vdoVlAO2Ay85Qn70YH0z9R933X/HrN/wBc2/ka+P8A4pf8gS3+l/8A+kclfmPCWKrLH0Gpu6ulq9FaS0+R+m5JUnXySdGs+aKaST1Vua+z031MW/vLm2F7NG+RZJp+1CBtkN7cNE5fjOVVPl2lRknIPAEmvapf6B4alk0SX7ELEtcRLCiKvmPkEkBeeXLf72Capav/AMe+tf7uh/8ApbLTfGv/ACK2o/8AXL/2YVx0YRlUhzK//Ds/VM0oU6uEq06sU4tPRq6+Ht8395BpXjvxH4n02ystbmS4T+0ViZvLVWYJbyzKTtwMh41IOBX0H8Mdck1C1tNMurO0YJJdbJvK/fr5V1cqo35/6YqeR1z7Y+S/Bf8AqrP/ALCv/tnc19M/CX/j5tv+ul9/6WX9fS49JYjERW3s5fmfg+CoU6XCKVOKS9u9lbpJfovuO9naczO5ubkF3Z8LcSqo3MTgBXAAGcD2qLdN/wA/N1/4FT//ABypZvv1DXdhMswcqEG6Ub2X2V29DSnRp8i91fcf/9k=", pa = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAAqACAAQAAAABAAAANKADAAQAAAABAAAANAAAAAD/4QkhaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/4gKESUNDX1BST0ZJTEUAAQEAAAJ0YXBwbAQAAABtbnRyUkdCIFhZWiAH3AALAAwAEgA6ABdhY3NwQVBQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGxmSfnZPIV3n7QGSpkeOnQsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtkZXNjAAABCAAAAGNkc2NtAAABbAAAACxjcHJ0AAABmAAAAC13dHB0AAAByAAAABRyWFlaAAAB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", ma = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCARXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAKgAgAEAAAAAQAAADSgAwAEAAAAAQAAADQAAAAA/+EJIWh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/PgD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/+IbJElDQ19QUk9GSUxFAAEBAAAbFGFwcGwCEAAAbW50clJHQiBYWVogB+EABAAEABcABgAzYWNzcEFQUEwAAAAAQVBQTAAAAAAAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1hcHBsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARZGVzYwAAAVAAAABiZHNjbQAAAbQAAAQYY3BydAAABcwAAAAjd3RwdAAABfAAAAAUclhZWgAABgQAAAAUZ1hZWgAABhgAAAAUYlhZWgAABiwAAAAUclRSQwAABkAAAAgMYWFyZwAADkwAAAAgdmNndAAADmwAAAYSbmRpbgAAFIAAAAY+Y2hhZAAAGsAAAAAsbW1vZAAAGuwAAAAoYlRSQwAABkAAAAgMZ1RSQwAABkAAAAgMYWFiZwAADkwAAAAgYWFnZwAADkwAAAAgZGVzYwAAAAAAAAAIRGlzcGxheQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG1sdWMAAAAAAAAAIgAAAAxockhSAAAAFAAAAahrb0tSAAAADAAAAbxuYk5PAAAAEgAAAchpZAAAAAAAEgAAAdpodUhVAAAAFAAAAexjc0NaAAAAFgAAAgBkYURLAAAAHAAAAhZ1a1VBAAAAHAAAAjJhcgAAAAAAFAAAAk5pdElUAAAAFAAAAmJyb1JPAAAAEgAAAnZubE5MAAAAFgAAAohoZUlMAAAAFgAAAp5lc0VTAAAAEgAAAnZmaUZJAAAAEAAAArR6aFRXAAAADAAAAsR2aVZOAAAADgAAAtBza1NLAAAAFgAAAt56aENOAAAADAAAAsRydVJVAAAAJAAAAvRmckZSAAAAFgAAAxhtcwAAAAAAEgAAAy5jYUVTAAAAGAAAA0B0aFRIAAAADAAAA1hlc1hMAAAAEgAAAnZkZURFAAAAEAAAA2RlblVTAAAAEgAAA3RwdEJSAAAAGAAAA4ZwbFBMAAAAEgAAA55lbEdSAAAAIgAAA7BzdlNFAAAAEAAAA9J0clRSAAAAFAAAA+JqYUpQAAAADAAAA/ZwdFBUAAAAFgAABAIATABDAEQAIAB1ACAAYgBvAGoAac7st+wAIABMAEMARABGAGEAcgBnAGUALQBMAEMARABMAEMARAAgAFcAYQByAG4AYQBTAHoA7QBuAGUAcwAgAEwAQwBEAEIAYQByAGUAdgBuAP0AIABMAEMARABMAEMARAAtAGYAYQByAHYAZQBzAGsA5gByAG0EGgQ+BDsETAQ+BEAEPgQyBDgEOQAgAEwAQwBEIA8ATABDAEQAIAZFBkQGSAZGBikATABDAEQAIABjAG8AbABvAHIAaQBMAEMARAAgAGMAbwBsAG8AcgBLAGwAZQB1AHIAZQBuAC0ATABDAEQgDwBMAEMARAAgBeYF0QXiBdUF4AXZAFYA5AByAGkALQBMAEMARF9pgnIAIABMAEMARABMAEMARAAgAE0A4AB1AEYAYQByAGUAYgBuAP0AIABMAEMARAQmBDIENQRCBD0EPgQ5ACAEFgQaAC0ENAQ4BEEEPwQ7BDUEOQBMAEMARAAgAGMAbwB1AGwAZQB1AHIAVwBhAHIAbgBhACAATABDAEQATABDAEQAIABlAG4AIABjAG8AbABvAHIATABDAEQAIA4qDjUARgBhAHIAYgAtAEwAQwBEAEMAbwBsAG8AcgAgAEwAQwBEAEwAQwBEACAAQwBvAGwAbwByAGkAZABvAEsAbwBsAG8AcgAgAEwAQwBEA4gDswPHA8EDyQO8A7cAIAO/A7gDzAO9A7cAIABMAEMARABGAOQAcgBnAC0ATABDAEQAUgBlAG4AawBsAGkAIABMAEMARDCrMOkw/ABMAEMARABMAEMARAAgAGEAIABDAG8AcgBlAHN0ZXh0AAAAAENvcHlyaWdodCBBcHBsZSBJbmMuLCAyMDE3AABYWVogAAAAAAAA81IAAQAAAAEWz1hZWiAAAAAAAABl6AAAPBAAAAnQWFlaIAAAAAAAAGqTAACqxQAAF4pYWVogAAAAAAAAJlsAABksAACx0mN1cnYAAAAAAAAEAAAAAAUACgAPABQAGQAeACMAKAAtADIANgA7AEAARQBKAE8AVABZAF4AYwBoAG0AcgB3AHwAgQCGAIsAkACVAJoAnwCjAKgArQCyALcAvADBAMYAywDQANUA2wDgAOUA6wDwAPYA+wEBAQcBDQETARkBHwElASsBMgE4AT4BRQFMAVIBWQFgAWcBbgF1AXwBgwGLAZIBmgGhAakBsQG5AcEByQHRAdkB4QHpAfIB+gIDAgwCFAIdAiYCLwI4AkECSwJUAl0CZwJxAnoChAKOApgCogKsArYCwQLLAtUC4ALrAvUDAAMLAxYDIQMtAzgDQwNPA1oDZgNyA34DigOWA6IDrgO6A8cD0wPgA+wD+QQGBBMEIAQtBDsESARVBGMEcQR+BIwEmgSoBLYExATTBOEE8AT+BQ0FHAUrBToFSQVYBWcF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", gC = {
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
    thumbnail: da,
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
    thumbnail: pa
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
    thumbnail: ma
  }
}, Xo = (i) => (i || "").match(/^(?:base|overlay|google(?:_(?:roadmap|satellite|hybrid|terrain))?|mapbox|maplibre|osm)$/);
async function cC(i, t) {
  typeof i == "string" && (i = { ...gC[i] }), i = he(Object.assign(i, t));
  const e = i.label || i.year;
  if (e !== void 0 && (i.label = e), Xo(i.maptype)) {
    const A = i.maptype === "base" ? Sn : i.maptype === "overlay" ? ji : i.maptype === "mapbox" ? Gi : i.maptype === "maplibre" ? Fi : Jr;
    A.isBasemap() ? (i.homePosition = i.homePos, i.mercZoom = i.defZoom) : (i.homePosition || (i.homePosition = i.homePos), i.mercZoom || (i.mercZoom = i.defZoom)), delete i.homePos, delete i.defZoom, i.zoomRestriction && (i.maxZoom = i.maxZoom || i.mercMaxZoom, i.minZoom = i.minZoom || i.mercMinZoom), i.zoomRestriction = i.mercMaxZoom = i.mercMinZoom = void 0, i.imageExtension || (i.imageExtension = "jpg"), Kr(i.maptype) ? (delete i.url, delete i.urls) : i.mapID && !i.url && !i.urls && (i.url = i.tms ? `tiles/${i.mapID}/{z}/{x}/{-y}.${i.imageExtension}` : `tiles/${i.mapID}/{z}/{x}/{y}.${i.imageExtension}`), i.weiwudi = await xr(i), i.weiwudi && (i.url = i.weiwudi.url, delete i.urls);
    const a = await A.createAsync(i);
    return await a.initialWait, a;
  } else if (i.noload)
    return i.mercMaxZoom = i.mercMinZoom = void 0, new Ui(i);
  const n = i.settingFile || `maps/${i.mapID}.json`, r = await fetch(n);
  if (!r.ok)
    throw new Error("Fail to load map json");
  const s = await r.json();
  if (i = he(Object.assign(s, i)), i.label = i.label || s.year, i.maptype || (i.maptype = "maplat"), Xo(i.maptype)) {
    const A = i.maptype === "base" ? Sn : i.maptype === "overlay" ? ji : i.maptype === "mapbox" ? Gi : i.maptype === "maplibre" ? Fi : Jr;
    A.isBasemap() ? (i.homePosition = i.homePos, i.mercZoom = i.defZoom) : (i.homePosition || (i.homePosition = i.homePos), i.mercZoom || (i.mercZoom = i.defZoom)), delete i.homePos, delete i.defZoom, i.zoomRestriction && (i.maxZoom = i.maxZoom || i.mercMaxZoom, i.minZoom = i.minZoom || i.mercMinZoom), i.zoomRestriction = i.mercMaxZoom = i.mercMinZoom = void 0, i.imageExtension || (i.imageExtension = "jpg"), Kr(i.maptype) ? (delete i.url, delete i.urls) : i.mapID && !i.url && !i.urls && (i.url = i.tms ? `tiles/${i.mapID}/{z}/{x}/{-y}.${i.imageExtension}` : `tiles/${i.mapID}/{z}/{x}/{y}.${i.imageExtension}`), i.weiwudi = await xr(i), i.weiwudi && (i.url = i.weiwudi.url, delete i.urls);
    const a = await A.createAsync(i);
    try {
      return await a.initialWait, a;
    } catch {
      return a;
    }
  }
  if (delete i.homePos, delete i.defZoom, i.imageExtension || (i.imageExtension = "jpg"), i.mapID && !i.url && !i.urls && (i.url = `tiles/${i.mapID}/{z}/{x}/{y}.${i.imageExtension}`), !i.compiled || !i.compiled.wh)
    throw console.error(
      `[Maplat] Missing compiled.wh for mapID=${i.mapID}. Check map setting file: ${n}`
    ), new Error(`Map ${i.mapID} is missing compiled data.`);
  i.width = i.width || i.compiled.wh[0], i.height = i.height || i.compiled.wh[1], i.weiwudi = await xr(i), i.weiwudi && (i.url = i.weiwudi.url, delete i.urls);
  const o = await Ui.createAsync(i);
  return await o.initialWait, await new Promise((A) => {
    o.setupMapParameter(() => A());
  }), o;
}
async function xr(i) {
  const t = {};
  if (i.maptype === "mapbox" || i.maptype === "maplibre" || i.maptype === "google" || !i.enableCache || i.noCache === !0) return;
  i.maptype === "base" || i.maptype === "overlay" ? t.type = "wmts" : t.type = "xyz", t.url = i.urls ? i.urls : i.url, t.width = i.width, t.height = i.height, t.maxZoom = i.maxZoom, t.minZoom = i.minZoom, i.cacheTtl !== void 0 && (t.cacheTtl = i.cacheTtl);
  const e = i.envelopeLngLats;
  if (e) {
    const r = e.reduce(
      (s, o) => (s[0] = s[0] > o[0] ? o[0] : s[0], s[1] = s[1] < o[0] ? o[0] : s[1], s[2] = s[2] > o[1] ? o[1] : s[2], s[3] = s[3] < o[1] ? o[1] : s[3], s),
      [1 / 0, -1 / 0, 1 / 0, -1 / 0]
    );
    ["minLng", "maxLng", "minLat", "maxLat"].map((s, o) => {
      t[s] = r[o];
    });
  }
  let n;
  try {
    n = await Ce.registerMap(i.mapID, t);
  } catch {
  }
  return n;
}
function Mr(i, t) {
  return i + (Math.random() - 0.5) * t;
}
function $r(i, t) {
  if (i instanceof Array)
    return i.map((n) => $r(n, t));
  const e = Math.pow(10, t);
  return Math.round(i * e) / e;
}
function lC(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
var ts = { exports: {} }, IC = ts.exports, Zo;
function CC() {
  return Zo || (Zo = 1, (function(i, t) {
    (function(e, n) {
      i.exports = n();
    })(typeof self < "u" ? self : IC, function() {
      return (
        /******/
        (function(e) {
          var n = {};
          function r(s) {
            if (n[s])
              return n[s].exports;
            var o = n[s] = {
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
          return r.m = e, r.c = n, r.d = function(s, o, A) {
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
            function I(O, X) {
              return o.hasOwnProperty.call(O, X);
            }
            g.hasOwnProp = I;
            function l(O) {
              return A[O];
            }
            function u(O, X, Z) {
              if (Z.Update || (Z = new g.TemplateError(Z)), Z.Update(O), !X) {
                var V = Z;
                Z = new Error(V.message), Z.name = V.name;
              }
              return Z;
            }
            g._prettifyError = u;
            function p(O, X, Z) {
              var V, st;
              O instanceof Error && (st = O, O = st.name + ": " + st.message), Object.setPrototypeOf ? (V = new Error(O), Object.setPrototypeOf(V, p.prototype)) : (V = this, Object.defineProperty(V, "message", {
                enumerable: !1,
                writable: !0,
                value: O
              })), Object.defineProperty(V, "name", {
                value: "Template render error"
              }), Error.captureStackTrace && Error.captureStackTrace(V, this.constructor);
              var rt;
              if (st) {
                var At = Object.getOwnPropertyDescriptor(st, "stack");
                rt = At && (At.get || function() {
                  return At.value;
                }), rt || (rt = function() {
                  return st.stack;
                });
              } else {
                var nt = new Error(O).stack;
                rt = function() {
                  return nt;
                };
              }
              return Object.defineProperty(V, "stack", {
                get: function() {
                  return rt.call(V);
                }
              }), Object.defineProperty(V, "cause", {
                value: st
              }), V.lineno = X, V.colno = Z, V.firstUpdate = !0, V.Update = function(pt) {
                var at = "(" + (pt || "unknown path") + ")";
                return this.firstUpdate && (this.lineno && this.colno ? at += " [Line " + this.lineno + ", Column " + this.colno + "]" : this.lineno && (at += " [Line " + this.lineno + "]")), at += `
 `, this.firstUpdate && (at += " "), this.message = at + (this.message || ""), this.firstUpdate = !1, this;
              }, V;
            }
            Object.setPrototypeOf ? Object.setPrototypeOf(p.prototype, Error.prototype) : p.prototype = Object.create(Error.prototype, {
              constructor: {
                value: p
              }
            }), g.TemplateError = p;
            function m(O) {
              return O.replace(a, l);
            }
            g.escape = m;
            function c(O) {
              return o.toString.call(O) === "[object Function]";
            }
            g.isFunction = c;
            function C(O) {
              return o.toString.call(O) === "[object Array]";
            }
            g.isArray = C;
            function h(O) {
              return o.toString.call(O) === "[object String]";
            }
            g.isString = h;
            function d(O) {
              return o.toString.call(O) === "[object Object]";
            }
            g.isObject = d;
            function S(O) {
              return O ? typeof O == "string" ? O.split(".") : [O] : [];
            }
            function w(O) {
              var X = S(O);
              return function(Z) {
                for (var V = Z, st = 0; st < X.length; st++) {
                  var rt = X[st];
                  if (I(V, rt))
                    V = V[rt];
                  else
                    return;
                }
                return V;
              };
            }
            g.getAttrGetter = w;
            function f(O, X, Z) {
              for (var V = {}, st = c(X) ? X : w(X), rt = 0; rt < O.length; rt++) {
                var At = O[rt], nt = st(At, rt);
                if (nt === void 0 && Z === !0)
                  throw new TypeError('groupby: attribute "' + X + '" resolved to undefined');
                (V[nt] || (V[nt] = [])).push(At);
              }
              return V;
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
              for (var Z = O.length, V = y(arguments).slice(1), st = -1; ++st < Z; )
                L(V, O[st]) === -1 && X.push(O[st]);
              return X;
            }
            g.without = v;
            function x(O, X) {
              for (var Z = "", V = 0; V < X; V++)
                Z += O;
              return Z;
            }
            g.repeat = x;
            function M(O, X, Z) {
              if (O != null) {
                if (s.forEach && O.forEach === s.forEach)
                  O.forEach(X, Z);
                else if (O.length === +O.length)
                  for (var V = 0, st = O.length; V < st; V++)
                    X.call(Z, O[V], V, O);
              }
            }
            g.each = M;
            function E(O, X) {
              var Z = [];
              if (O == null)
                return Z;
              if (s.map && O.map === s.map)
                return O.map(X);
              for (var V = 0; V < O.length; V++)
                Z[Z.length] = X(O[V], V);
              return O.length === +O.length && (Z.length = O.length), Z;
            }
            g.map = E;
            function T(O, X, Z) {
              var V = -1;
              function st() {
                V++, V < O.length ? X(O[V], V, st, Z) : Z();
              }
              st();
            }
            g.asyncIter = T;
            function R(O, X, Z) {
              var V = D(O || {}), st = V.length, rt = -1;
              function At() {
                rt++;
                var nt = V[rt];
                rt < st ? X(nt, O[nt], rt, st, At) : Z();
              }
              At();
            }
            g.asyncFor = R;
            function L(O, X, Z) {
              return Array.prototype.indexOf.call(O || [], X, Z);
            }
            g.indexOf = L;
            function D(O) {
              var X = [];
              for (var Z in O)
                I(O, Z) && X.push(Z);
              return X;
            }
            g.keys = D;
            function G(O) {
              return D(O).map(function(X) {
                return [X, O[X]];
              });
            }
            g._entries = G;
            function U(O) {
              return D(O).map(function(X) {
                return O[X];
              });
            }
            g._values = U;
            function P(O, X) {
              return O = O || {}, D(X).forEach(function(Z) {
                O[Z] = X[Z];
              }), O;
            }
            g._assign = g.extend = P;
            function N(O, X) {
              if (C(X) || h(X))
                return X.indexOf(O) !== -1;
              if (d(X))
                return O in X;
              throw new Error('Cannot use "in" operator to search for "' + O + '" in unexpected types.');
            }
            g.inOperator = N;
          }),
          /* 1 */
          /***/
          (function(e, n, r) {
            function s(h, d) {
              for (var S = 0; S < d.length; S++) {
                var w = d[S];
                w.enumerable = w.enumerable || !1, w.configurable = !0, "value" in w && (w.writable = !0), Object.defineProperty(h, A(w.key), w);
              }
            }
            function o(h, d, S) {
              return d && s(h.prototype, d), Object.defineProperty(h, "prototype", { writable: !1 }), h;
            }
            function A(h) {
              var d = a(h, "string");
              return typeof d == "symbol" ? d : String(d);
            }
            function a(h, d) {
              if (typeof h != "object" || h === null) return h;
              var S = h[Symbol.toPrimitive];
              if (S !== void 0) {
                var w = S.call(h, d);
                if (typeof w != "object") return w;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return String(h);
            }
            function g(h, d) {
              h.prototype = Object.create(d.prototype), h.prototype.constructor = h, I(h, d);
            }
            function I(h, d) {
              return I = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(S, w) {
                return S.__proto__ = w, S;
              }, I(h, d);
            }
            var l = r(16), u = r(0);
            function p(h, d) {
              return typeof h != "function" || typeof d != "function" ? d : function() {
                var S = this.parent;
                this.parent = h;
                var w = d.apply(this, arguments);
                return this.parent = S, w;
              };
            }
            function m(h, d, S) {
              S = S || {}, u.keys(S).forEach(function(f) {
                S[f] = p(h.prototype[f], S[f]);
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
              })(h);
              return u._assign(w.prototype, S), w;
            }
            var c = /* @__PURE__ */ (function() {
              function h() {
                this.init.apply(this, arguments);
              }
              var d = h.prototype;
              return d.init = function() {
              }, h.extend = function(S, w) {
                return typeof S == "object" && (w = S, S = "anonymous"), m(this, S, w);
              }, o(h, [{
                key: "typename",
                get: function() {
                  return this.constructor.name;
                }
              }]), h;
            })(), C = /* @__PURE__ */ (function(h) {
              g(d, h);
              function d() {
                var w, f;
                return f = h.call(this) || this, (w = f).init.apply(w, arguments), f;
              }
              var S = d.prototype;
              return S.init = function() {
              }, d.extend = function(w, f) {
                return typeof w == "object" && (f = w, w = "anonymous"), m(this, w, f);
              }, o(d, [{
                key: "typename",
                get: function() {
                  return this.constructor.name;
                }
              }]), d;
            })(l);
            e.exports = {
              Obj: c,
              EmitterObj: C
            };
          }),
          /* 2 */
          /***/
          (function(e, n, r) {
            var s = r(0), o = Array.from, A = typeof Symbol == "function" && Symbol.iterator && typeof o == "function", a = /* @__PURE__ */ (function() {
              function E(R, L) {
                this.variables = /* @__PURE__ */ Object.create(null), this.parent = R, this.topLevel = !1, this.isolateWrites = L;
              }
              var T = E.prototype;
              return T.set = function(R, L, D) {
                var G = R.split("."), U = this.variables, P = this;
                if (D && (P = this.resolve(G[0], !0))) {
                  P.set(R, L);
                  return;
                }
                for (var N = 0; N < G.length - 1; N++) {
                  var O = G[N];
                  U[O] || (U[O] = {}), U = U[O];
                }
                U[G[G.length - 1]] = L;
              }, T.get = function(R) {
                var L = this.variables[R];
                return L !== void 0 ? L : null;
              }, T.lookup = function(R) {
                var L = this.parent, D = this.variables[R];
                return D !== void 0 ? D : L && L.lookup(R);
              }, T.resolve = function(R, L) {
                var D = L && this.isolateWrites ? void 0 : this.parent, G = this.variables[R];
                return G !== void 0 ? this : D && D.resolve(R);
              }, T.push = function(R) {
                return new E(this, R);
              }, T.pop = function() {
                return this.parent;
              }, E;
            })();
            function g(E, T, R) {
              return function() {
                for (var L = arguments.length, D = new Array(L), G = 0; G < L; G++)
                  D[G] = arguments[G];
                var U = p(D), P, N = u(D);
                if (U > E.length)
                  P = D.slice(0, E.length), D.slice(P.length, U).forEach(function(Z, V) {
                    V < T.length && (N[T[V]] = Z);
                  }), P.push(N);
                else if (U < E.length) {
                  P = D.slice(0, U);
                  for (var O = U; O < E.length; O++) {
                    var X = E[O];
                    P.push(N[X]), delete N[X];
                  }
                  P.push(N);
                } else
                  P = D;
                return R.apply(this, P);
              };
            }
            function I(E) {
              return E.__keywords = !0, E;
            }
            function l(E) {
              return E && Object.prototype.hasOwnProperty.call(E, "__keywords");
            }
            function u(E) {
              var T = E.length;
              if (T) {
                var R = E[T - 1];
                if (l(R))
                  return R;
              }
              return {};
            }
            function p(E) {
              var T = E.length;
              if (T === 0)
                return 0;
              var R = E[T - 1];
              return l(R) ? T - 1 : T;
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
            function c(E, T) {
              return E instanceof m ? new m(T) : T.toString();
            }
            function C(E) {
              var T = typeof E;
              return T === "string" ? new m(E) : T !== "function" ? E : function(R) {
                var L = E.apply(this, arguments);
                return typeof L == "string" ? new m(L) : L;
              };
            }
            function h(E, T) {
              return E = E ?? "", T && !(E instanceof m) && (E = s.escape(E.toString())), E;
            }
            function d(E, T, R) {
              if (E == null)
                throw new s.TemplateError("attempted to output null or undefined value", T + 1, R + 1);
              return E;
            }
            function S(E, T) {
              if (E != null)
                return typeof E[T] == "function" ? function() {
                  for (var R = arguments.length, L = new Array(R), D = 0; D < R; D++)
                    L[D] = arguments[D];
                  return E[T].apply(E, L);
                } : E[T];
            }
            function w(E, T, R, L) {
              if (E) {
                if (typeof E != "function")
                  throw new Error("Unable to call `" + T + "`, which is not a function");
              } else throw new Error("Unable to call `" + T + "`, which is undefined or falsey");
              return E.apply(R, L);
            }
            function f(E, T, R) {
              var L = T.lookup(R);
              return L !== void 0 ? L : E.lookup(R);
            }
            function y(E, T, R) {
              return E.lineno ? E : new s.TemplateError(E, T, R);
            }
            function v(E, T, R, L) {
              if (s.isArray(E)) {
                var D = E.length;
                s.asyncIter(E, function(G, U, P) {
                  switch (T) {
                    case 1:
                      R(G, U, D, P);
                      break;
                    case 2:
                      R(G[0], G[1], U, D, P);
                      break;
                    case 3:
                      R(G[0], G[1], G[2], U, D, P);
                      break;
                    default:
                      G.push(U, D, P), R.apply(this, G);
                  }
                }, L);
              } else
                s.asyncFor(E, function(G, U, P, N, O) {
                  R(G, U, P, N, O);
                }, L);
            }
            function x(E, T, R, L) {
              var D = 0, G, U;
              function P(st, rt) {
                D++, U[st] = rt, D === G && L(null, U.join(""));
              }
              if (s.isArray(E))
                if (G = E.length, U = new Array(G), G === 0)
                  L(null, "");
                else
                  for (var N = 0; N < E.length; N++) {
                    var O = E[N];
                    switch (T) {
                      case 1:
                        R(O, N, G, P);
                        break;
                      case 2:
                        R(O[0], O[1], N, G, P);
                        break;
                      case 3:
                        R(O[0], O[1], O[2], N, G, P);
                        break;
                      default:
                        O.push(N, G, P), R.apply(this, O);
                    }
                  }
              else {
                var X = s.keys(E || {});
                if (G = X.length, U = new Array(G), G === 0)
                  L(null, "");
                else
                  for (var Z = 0; Z < X.length; Z++) {
                    var V = X[Z];
                    R(V, E[V], Z, G, P);
                  }
              }
            }
            function M(E) {
              return typeof E != "object" || E === null || s.isArray(E) ? E : A && Symbol.iterator in E ? o(E) : E;
            }
            e.exports = {
              Frame: a,
              makeMacro: g,
              makeKeywordArgs: I,
              numArgs: p,
              suppressValue: h,
              ensureDefined: d,
              memberLookup: S,
              contextOrFrameLookup: f,
              callWrap: w,
              handleError: y,
              isArray: s.isArray,
              keys: s.keys,
              SafeString: m,
              copySafeness: c,
              markSafe: C,
              asyncEach: v,
              asyncAll: x,
              inOperator: s.inOperator,
              fromIterator: M
            };
          }),
          /* 3 */
          /***/
          (function(e, n, r) {
            function s(K, $) {
              for (var It = 0; It < $.length; It++) {
                var ct = $[It];
                ct.enumerable = ct.enumerable || !1, ct.configurable = !0, "value" in ct && (ct.writable = !0), Object.defineProperty(K, A(ct.key), ct);
              }
            }
            function o(K, $, It) {
              return $ && s(K.prototype, $), Object.defineProperty(K, "prototype", { writable: !1 }), K;
            }
            function A(K) {
              var $ = a(K, "string");
              return typeof $ == "symbol" ? $ : String($);
            }
            function a(K, $) {
              if (typeof K != "object" || K === null) return K;
              var It = K[Symbol.toPrimitive];
              if (It !== void 0) {
                var ct = It.call(K, $);
                if (typeof ct != "object") return ct;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return String(K);
            }
            function g(K, $) {
              K.prototype = Object.create($.prototype), K.prototype.constructor = K, I(K, $);
            }
            function I(K, $) {
              return I = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(It, ct) {
                return It.__proto__ = ct, It;
              }, I(K, $);
            }
            var l = r(1), u = l.Obj;
            function p(K, $, It) {
              K instanceof $ && It.push(K), K instanceof m && K.findAll($, It);
            }
            var m = /* @__PURE__ */ (function(K) {
              g($, K);
              function $() {
                return K.apply(this, arguments) || this;
              }
              var It = $.prototype;
              return It.init = function(ct, ut) {
                for (var bt = arguments, St = this, ee = arguments.length, ye = new Array(ee > 2 ? ee - 2 : 0), je = 2; je < ee; je++)
                  ye[je - 2] = arguments[je];
                this.lineno = ct, this.colno = ut, this.fields.forEach(function(gi, ci) {
                  var tn = bt[ci + 2];
                  tn === void 0 && (tn = null), St[gi] = tn;
                });
              }, It.findAll = function(ct, ut) {
                var bt = this;
                return ut = ut || [], this instanceof C ? this.children.forEach(function(St) {
                  return p(St, ct, ut);
                }) : this.fields.forEach(function(St) {
                  return p(bt[St], ct, ut);
                }), ut;
              }, It.iterFields = function(ct) {
                var ut = this;
                this.fields.forEach(function(bt) {
                  ct(ut[bt], bt);
                });
              }, $;
            })(u), c = /* @__PURE__ */ (function(K) {
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
            })(m), C = /* @__PURE__ */ (function(K) {
              g($, K);
              function $() {
                return K.apply(this, arguments) || this;
              }
              var It = $.prototype;
              return It.init = function(ct, ut, bt) {
                K.prototype.init.call(this, ct, ut, bt || []);
              }, It.addChild = function(ct) {
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
            })(m), h = C.extend("Root"), d = c.extend("Literal"), S = c.extend("Symbol"), w = C.extend("Group"), f = C.extend("Array"), y = m.extend("Pair", {
              fields: ["key", "value"]
            }), v = C.extend("Dict"), x = m.extend("LookupVal", {
              fields: ["target", "val"]
            }), M = m.extend("If", {
              fields: ["cond", "body", "else_"]
            }), E = M.extend("IfAsync"), T = m.extend("InlineIf", {
              fields: ["cond", "body", "else_"]
            }), R = m.extend("For", {
              fields: ["arr", "name", "body", "else_"]
            }), L = R.extend("AsyncEach"), D = R.extend("AsyncAll"), G = m.extend("Macro", {
              fields: ["name", "args", "body"]
            }), U = G.extend("Caller"), P = m.extend("Import", {
              fields: ["template", "target", "withContext"]
            }), N = /* @__PURE__ */ (function(K) {
              g($, K);
              function $() {
                return K.apply(this, arguments) || this;
              }
              var It = $.prototype;
              return It.init = function(ct, ut, bt, St, ee) {
                K.prototype.init.call(this, ct, ut, bt, St || new C(), ee);
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
            }), V = v.extend("KeywordArgs"), st = m.extend("Block", {
              fields: ["name", "body"]
            }), rt = m.extend("Super", {
              fields: ["blockName", "symbol"]
            }), At = m.extend("TemplateRef", {
              fields: ["template"]
            }), nt = At.extend("Extends"), pt = m.extend("Include", {
              fields: ["template", "ignoreMissing"]
            }), at = m.extend("Set", {
              fields: ["targets", "value"]
            }), Q = m.extend("Switch", {
              fields: ["expr", "cases", "default"]
            }), J = m.extend("Case", {
              fields: ["cond", "body"]
            }), Y = C.extend("Output"), mt = m.extend("Capture", {
              fields: ["body"]
            }), Bt = d.extend("TemplateData"), te = m.extend("UnaryOp", {
              fields: ["target"]
            }), yt = m.extend("BinOp", {
              fields: ["left", "right"]
            }), ht = yt.extend("In"), _ = yt.extend("Is"), B = yt.extend("Or"), W = yt.extend("And"), H = te.extend("Not"), it = yt.extend("Add"), tt = yt.extend("Concat"), gt = yt.extend("Sub"), ot = yt.extend("Mul"), wt = yt.extend("Div"), Mt = yt.extend("FloorDiv"), Ut = yt.extend("Mod"), se = yt.extend("Pow"), pe = te.extend("Neg"), me = te.extend("Pos"), kn = m.extend("Compare", {
              fields: ["expr", "ops"]
            }), $e = m.extend("CompareOperand", {
              fields: ["expr", "type"]
            }), Re = m.extend("CallExtension", {
              init: function(K, $, It, ct) {
                this.parent(), this.extName = K.__name || K, this.prop = $, this.args = It || new C(), this.contentArgs = ct || [], this.autoescape = K.autoescape;
              },
              fields: ["extName", "prop", "args", "contentArgs"]
            }), _n = Re.extend("CallExtensionAsync");
            function Jt(K, $, It) {
              var ct = K.split(`
`);
              ct.forEach(function(ut, bt) {
                ut && (It && bt > 0 || !It) && process.stdout.write(" ".repeat($));
                var St = bt === ct.length - 1 ? "" : `
`;
                process.stdout.write("" + ut + St);
              });
            }
            function ge(K, $) {
              if ($ = $ || 0, Jt(K.typename + ": ", $), K instanceof C)
                Jt(`
`), K.children.forEach(function(ut) {
                  ge(ut, $ + 2);
                });
              else if (K instanceof Re)
                Jt(K.extName + "." + K.prop + `
`), K.args && ge(K.args, $ + 2), K.contentArgs && K.contentArgs.forEach(function(ut) {
                  ge(ut, $ + 2);
                });
              else {
                var It = [], ct = null;
                K.iterFields(function(ut, bt) {
                  ut instanceof m ? It.push([bt, ut]) : (ct = ct || {}, ct[bt] = ut);
                }), ct ? Jt(JSON.stringify(ct, null, 2) + `
`, null, !0) : Jt(`
`), It.forEach(function(ut) {
                  var bt = ut[0], St = ut[1];
                  Jt("[" + bt + "] =>", $ + 2), ge(St, $ + 4);
                });
              }
            }
            e.exports = {
              Node: m,
              Root: h,
              NodeList: C,
              Value: c,
              Literal: d,
              Symbol: S,
              Group: w,
              Array: f,
              Pair: y,
              Dict: v,
              Output: Y,
              Capture: mt,
              TemplateData: Bt,
              If: M,
              IfAsync: E,
              InlineIf: T,
              For: R,
              AsyncEach: L,
              AsyncAll: D,
              Macro: G,
              Caller: U,
              Import: P,
              FromImport: N,
              FunCall: O,
              Filter: X,
              FilterAsync: Z,
              KeywordArgs: V,
              Block: st,
              Super: rt,
              Extends: nt,
              Include: pt,
              Set: at,
              Switch: Q,
              Case: J,
              LookupVal: x,
              BinOp: yt,
              In: ht,
              Is: _,
              Or: B,
              And: W,
              Not: H,
              Add: it,
              Concat: tt,
              Sub: gt,
              Mul: ot,
              Div: wt,
              FloorDiv: Mt,
              Mod: Ut,
              Pow: se,
              Neg: pe,
              Pos: me,
              Compare: kn,
              CompareOperand: $e,
              CallExtension: Re,
              CallExtensionAsync: _n,
              printNodes: ge
            };
          }),
          /* 4 */
          /***/
          (function(e, n) {
          }),
          /* 5 */
          /***/
          (function(e, n, r) {
            function s(d, S) {
              d.prototype = Object.create(S.prototype), d.prototype.constructor = d, o(d, S);
            }
            function o(d, S) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(w, f) {
                return w.__proto__ = f, w;
              }, o(d, S);
            }
            var A = r(8), a = r(17), g = r(3), I = r(0), l = I.TemplateError, u = r(2), p = u.Frame, m = r(1), c = m.Obj, C = {
              "==": "==",
              "===": "===",
              "!=": "!=",
              "!==": "!==",
              "<": "<",
              ">": ">",
              "<=": "<=",
              ">=": ">="
            }, h = /* @__PURE__ */ (function(d) {
              s(S, d);
              function S() {
                return d.apply(this, arguments) || this;
              }
              var w = S.prototype;
              return w.init = function(f, y) {
                this.templateName = f, this.codebuf = [], this.lastId = 0, this.buffer = null, this.bufferStack = [], this._scopeClosers = "", this.inBlock = !1, this.throwOnUndefined = y;
              }, w.fail = function(f, y, v) {
                throw y !== void 0 && (y += 1), v !== void 0 && (v += 1), new l(f, y, v);
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
                for (var f = this, y = arguments.length, v = new Array(y), x = 0; x < y; x++)
                  v[x] = arguments[x];
                v.forEach(function(M) {
                  return f._emitLine(M);
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
                f.children.forEach(function(x) {
                  v.compile(x, y);
                });
              }, w._compileAggregate = function(f, y, v, x) {
                var M = this;
                v && this._emit(v), f.children.forEach(function(E, T) {
                  T > 0 && M._emit(","), M.compile(E, y);
                }), x && this._emit(x);
              }, w._compileExpression = function(f, y) {
                this.assertType(f, g.Literal, g.Symbol, g.Group, g.Array, g.Dict, g.FunCall, g.Caller, g.Filter, g.LookupVal, g.Compare, g.InlineIf, g.In, g.Is, g.And, g.Or, g.Not, g.Add, g.Concat, g.Sub, g.Mul, g.Div, g.FloorDiv, g.Mod, g.Pow, g.Neg, g.Pos, g.Compare, g.NodeList), this.compile(f, y);
              }, w.assertType = function(f) {
                for (var y = arguments.length, v = new Array(y > 1 ? y - 1 : 0), x = 1; x < y; x++)
                  v[x - 1] = arguments[x];
                v.some(function(M) {
                  return f instanceof M;
                }) || this.fail("assertType: invalid type: " + f.typename, f.lineno, f.colno);
              }, w.compileCallExtension = function(f, y, v) {
                var x = this, M = f.args, E = f.contentArgs, T = typeof f.autoescape == "boolean" ? f.autoescape : !0;
                if (v || this._emit(this.buffer + " += runtime.suppressValue("), this._emit('env.getExtension("' + f.extName + '")["' + f.prop + '"]('), this._emit("context"), (M || E) && this._emit(","), M && (M instanceof g.NodeList || this.fail("compileCallExtension: arguments must be a NodeList, use `parser.parseSignature`"), M.children.forEach(function(L, D) {
                  x._compileExpression(L, y), (D !== M.children.length - 1 || E.length) && x._emit(",");
                })), E.length && E.forEach(function(L, D) {
                  if (D > 0 && x._emit(","), L) {
                    x._emitLine("function(cb) {"), x._emitLine("if(!cb) { cb = function(err) { if(err) { throw err; }}}");
                    var G = x._pushBuffer();
                    x._withScopedSyntax(function() {
                      x.compile(L, y), x._emitLine("cb(null, " + G + ");");
                    }), x._popBuffer(), x._emitLine("return " + G + ";"), x._emitLine("}");
                  } else
                    x._emit("null");
                }), v) {
                  var R = this._tmpid();
                  this._emitLine(", " + this._makeCallback(R)), this._emitLine(this.buffer + " += runtime.suppressValue(" + R + ", " + T + " && env.opts.autoescape);"), this._addScopeLevel();
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
                var v = f.value, x = y.lookup(v);
                x ? this._emit(x) : this._emit('runtime.contextOrFrameLookup(context, frame, "' + v + '")');
              }, w.compileGroup = function(f, y) {
                this._compileAggregate(f, y, "(", ")");
              }, w.compileArray = function(f, y) {
                this._compileAggregate(f, y, "[", "]");
              }, w.compileDict = function(f, y) {
                this._compileAggregate(f, y, "{", "}");
              }, w.compilePair = function(f, y) {
                var v = f.key, x = f.value;
                v instanceof g.Symbol ? v = new g.Literal(v.lineno, v.colno, v.value) : v instanceof g.Literal && typeof v.value == "string" || this.fail("compilePair: Dict keys must be strings or names", v.lineno, v.colno), this.compile(v, y), this._emit(": "), this._compileExpression(x, y);
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
                this.compile(f.expr, y), f.ops.forEach(function(x) {
                  v._emit(" " + C[x.type] + " "), v.compile(x.expr, y);
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
                var v = f.name, x = f.symbol.value;
                this.assertType(v, g.Symbol), y.set(x, x), this._emit('env.getFilter("' + v.value + '").call(context, '), this._compileAggregate(f.args, y), this._emitLine(", " + this._makeCallback(x)), this._addScopeLevel();
              }, w.compileKeywordArgs = function(f, y) {
                this._emit("runtime.makeKeywordArgs("), this.compileDict(f, y), this._emit(")");
              }, w.compileSet = function(f, y) {
                var v = this, x = [];
                f.targets.forEach(function(M) {
                  var E = M.value, T = y.lookup(E);
                  T == null && (T = v._tmpid(), v._emitLine("var " + T + ";")), x.push(T);
                }), f.value ? (this._emit(x.join(" = ") + " = "), this._compileExpression(f.value, y), this._emitLine(";")) : (this._emit(x.join(" = ") + " = "), this.compile(f.body, y), this._emitLine(";")), f.targets.forEach(function(M, E) {
                  var T = x[E], R = M.value;
                  v._emitLine('frame.set("' + R + '", ' + T + ", true);"), v._emitLine("if(frame.topLevel) {"), v._emitLine('context.setVariable("' + R + '", ' + T + ");"), v._emitLine("}"), R.charAt(0) !== "_" && (v._emitLine("if(frame.topLevel) {"), v._emitLine('context.addExport("' + R + '", ' + T + ");"), v._emitLine("}"));
                });
              }, w.compileSwitch = function(f, y) {
                var v = this;
                this._emit("switch ("), this.compile(f.expr, y), this._emit(") {"), f.cases.forEach(function(x, M) {
                  v._emit("case "), v.compile(x.cond, y), v._emit(": "), v.compile(x.body, y), x.body.children.length && v._emitLine("break;");
                }), f.default && (this._emit("default:"), this.compile(f.default, y)), this._emit("}");
              }, w.compileIf = function(f, y, v) {
                var x = this;
                this._emit("if("), this._compileExpression(f.cond, y), this._emitLine(") {"), this._withScopedSyntax(function() {
                  x.compile(f.body, y), v && x._emit("cb()");
                }), f.else_ ? (this._emitLine(`}
else {`), this._withScopedSyntax(function() {
                  x.compile(f.else_, y), v && x._emit("cb()");
                })) : v && (this._emitLine(`}
else {`), this._emit("cb()")), this._emitLine("}");
              }, w.compileIfAsync = function(f, y) {
                this._emit("(function(cb) {"), this.compileIf(f, y, !0), this._emit("})(" + this._makeCallback()), this._addScopeLevel();
              }, w._emitLoopBindings = function(f, y, v, x) {
                var M = this, E = [{
                  name: "index",
                  val: v + " + 1"
                }, {
                  name: "index0",
                  val: v
                }, {
                  name: "revindex",
                  val: x + " - " + v
                }, {
                  name: "revindex0",
                  val: x + " - " + v + " - 1"
                }, {
                  name: "first",
                  val: v + " === 0"
                }, {
                  name: "last",
                  val: v + " === " + x + " - 1"
                }, {
                  name: "length",
                  val: x
                }];
                E.forEach(function(T) {
                  M._emitLine('frame.set("loop.' + T.name + '", ' + T.val + ");");
                });
              }, w.compileFor = function(f, y) {
                var v = this, x = this._tmpid(), M = this._tmpid(), E = this._tmpid();
                if (y = y.push(), this._emitLine("frame = frame.push();"), this._emit("var " + E + " = "), this._compileExpression(f.arr, y), this._emitLine(";"), this._emit("if(" + E + ") {"), this._emitLine(E + " = runtime.fromIterator(" + E + ");"), f.name instanceof g.Array) {
                  this._emitLine("var " + x + ";"), this._emitLine("if(runtime.isArray(" + E + ")) {"), this._emitLine("var " + M + " = " + E + ".length;"), this._emitLine("for(" + x + "=0; " + x + " < " + E + ".length; " + x + "++) {"), f.name.children.forEach(function(P, N) {
                    var O = v._tmpid();
                    v._emitLine("var " + O + " = " + E + "[" + x + "][" + N + "];"), v._emitLine('frame.set("' + P + '", ' + E + "[" + x + "][" + N + "]);"), y.set(f.name.children[N].value, O);
                  }), this._emitLoopBindings(f, E, x, M), this._withScopedSyntax(function() {
                    v.compile(f.body, y);
                  }), this._emitLine("}"), this._emitLine("} else {");
                  var T = f.name.children, R = T[0], L = T[1], D = this._tmpid(), G = this._tmpid();
                  y.set(R.value, D), y.set(L.value, G), this._emitLine(x + " = -1;"), this._emitLine("var " + M + " = runtime.keys(" + E + ").length;"), this._emitLine("for(var " + D + " in " + E + ") {"), this._emitLine(x + "++;"), this._emitLine("var " + G + " = " + E + "[" + D + "];"), this._emitLine('frame.set("' + R.value + '", ' + D + ");"), this._emitLine('frame.set("' + L.value + '", ' + G + ");"), this._emitLoopBindings(f, E, x, M), this._withScopedSyntax(function() {
                    v.compile(f.body, y);
                  }), this._emitLine("}"), this._emitLine("}");
                } else {
                  var U = this._tmpid();
                  y.set(f.name.value, U), this._emitLine("var " + M + " = " + E + ".length;"), this._emitLine("for(var " + x + "=0; " + x + " < " + E + ".length; " + x + "++) {"), this._emitLine("var " + U + " = " + E + "[" + x + "];"), this._emitLine('frame.set("' + f.name.value + '", ' + U + ");"), this._emitLoopBindings(f, E, x, M), this._withScopedSyntax(function() {
                    v.compile(f.body, y);
                  }), this._emitLine("}");
                }
                this._emitLine("}"), f.else_ && (this._emitLine("if (!" + M + ") {"), this.compile(f.else_, y), this._emitLine("}")), this._emitLine("frame = frame.pop();");
              }, w._compileAsyncLoop = function(f, y, v) {
                var x = this, M = this._tmpid(), E = this._tmpid(), T = this._tmpid(), R = v ? "asyncAll" : "asyncEach";
                if (y = y.push(), this._emitLine("frame = frame.push();"), this._emit("var " + T + " = runtime.fromIterator("), this._compileExpression(f.arr, y), this._emitLine(");"), f.name instanceof g.Array) {
                  var L = f.name.children.length;
                  this._emit("runtime." + R + "(" + T + ", " + L + ", function("), f.name.children.forEach(function(U) {
                    x._emit(U.value + ",");
                  }), this._emit(M + "," + E + ",next) {"), f.name.children.forEach(function(U) {
                    var P = U.value;
                    y.set(P, P), x._emitLine('frame.set("' + P + '", ' + P + ");");
                  });
                } else {
                  var D = f.name.value;
                  this._emitLine("runtime." + R + "(" + T + ", 1, function(" + D + ", " + M + ", " + E + ",next) {"), this._emitLine('frame.set("' + D + '", ' + D + ");"), y.set(D, D);
                }
                this._emitLoopBindings(f, T, M, E), this._withScopedSyntax(function() {
                  var U;
                  v && (U = x._pushBuffer()), x.compile(f.body, y), x._emitLine("next(" + M + (U ? "," + U : "") + ");"), v && x._popBuffer();
                });
                var G = this._tmpid();
                this._emitLine("}, " + this._makeCallback(G)), this._addScopeLevel(), v && this._emitLine(this.buffer + " += " + G + ";"), f.else_ && (this._emitLine("if (!" + T + ".length) {"), this.compile(f.else_, y), this._emitLine("}")), this._emitLine("frame = frame.pop();");
              }, w.compileAsyncEach = function(f, y) {
                this._compileAsyncLoop(f, y);
              }, w.compileAsyncAll = function(f, y) {
                this._compileAsyncLoop(f, y, !0);
              }, w._compileMacro = function(f, y) {
                var v = this, x = [], M = null, E = "macro_" + this._tmpid(), T = y !== void 0;
                f.args.children.forEach(function(P, N) {
                  N === f.args.children.length - 1 && P instanceof g.Dict ? M = P : (v.assertType(P, g.Symbol), x.push(P));
                });
                var R = [].concat(x.map(function(P) {
                  return "l_" + P.value;
                }), ["kwargs"]), L = x.map(function(P) {
                  return '"' + P.value + '"';
                }), D = (M && M.children || []).map(function(P) {
                  return '"' + P.key.value + '"';
                }), G;
                T ? G = y.push(!0) : G = new p(), this._emitLines("var " + E + " = runtime.makeMacro(", "[" + L.join(", ") + "], ", "[" + D.join(", ") + "], ", "function (" + R.join(", ") + ") {", "var callerFrame = frame;", "frame = " + (T ? "frame.push(true);" : "new runtime.Frame();"), "kwargs = kwargs || {};", 'if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {', 'frame.set("caller", kwargs.caller); }'), x.forEach(function(P) {
                  v._emitLine('frame.set("' + P.value + '", l_' + P.value + ");"), G.set(P.value, "l_" + P.value);
                }), M && M.children.forEach(function(P) {
                  var N = P.key.value;
                  v._emit('frame.set("' + N + '", '), v._emit('Object.prototype.hasOwnProperty.call(kwargs, "' + N + '")'), v._emit(' ? kwargs["' + N + '"] : '), v._compileExpression(P.value, G), v._emit(");");
                });
                var U = this._pushBuffer();
                return this._withScopedSyntax(function() {
                  v.compile(f.body, G);
                }), this._emitLine("frame = " + (T ? "frame.pop();" : "callerFrame;")), this._emitLine("return new runtime.SafeString(" + U + ");"), this._emitLine("});"), this._popBuffer(), E;
              }, w.compileMacro = function(f, y) {
                var v = this._compileMacro(f), x = f.name.value;
                y.set(x, v), y.parent ? this._emitLine('frame.set("' + x + '", ' + v + ");") : (f.name.value.charAt(0) !== "_" && this._emitLine('context.addExport("' + x + '");'), this._emitLine('context.setVariable("' + x + '", ' + v + ");"));
              }, w.compileCaller = function(f, y) {
                this._emit("(function (){");
                var v = this._compileMacro(f, y);
                this._emit("return " + v + ";})()");
              }, w._compileGetTemplate = function(f, y, v, x) {
                var M = this._tmpid(), E = this._templateName(), T = this._makeCallback(M), R = v ? "true" : "false", L = x ? "true" : "false";
                return this._emit("env.getTemplate("), this._compileExpression(f.template, y), this._emitLine(", " + R + ", " + E + ", " + L + ", " + T), M;
              }, w.compileImport = function(f, y) {
                var v = f.target.value, x = this._compileGetTemplate(f, y, !1, !1);
                this._addScopeLevel(), this._emitLine(x + ".getExported(" + (f.withContext ? "context.getVariables(), frame, " : "") + this._makeCallback(x)), this._addScopeLevel(), y.set(v, x), y.parent ? this._emitLine('frame.set("' + v + '", ' + x + ");") : this._emitLine('context.setVariable("' + v + '", ' + x + ");");
              }, w.compileFromImport = function(f, y) {
                var v = this, x = this._compileGetTemplate(f, y, !1, !1);
                this._addScopeLevel(), this._emitLine(x + ".getExported(" + (f.withContext ? "context.getVariables(), frame, " : "") + this._makeCallback(x)), this._addScopeLevel(), f.names.children.forEach(function(M) {
                  var E, T, R = v._tmpid();
                  M instanceof g.Pair ? (E = M.key.value, T = M.value.value) : (E = M.value, T = E), v._emitLine("if(Object.prototype.hasOwnProperty.call(" + x + ', "' + E + '")) {'), v._emitLine("var " + R + " = " + x + "." + E + ";"), v._emitLine("} else {"), v._emitLine(`cb(new Error("cannot import '` + E + `'")); return;`), v._emitLine("}"), y.set(T, R), y.parent ? v._emitLine('frame.set("' + T + '", ' + R + ");") : v._emitLine('context.setVariable("' + T + '", ' + R + ");");
                });
              }, w.compileBlock = function(f) {
                var y = this._tmpid();
                this.inBlock || this._emit('(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : '), this._emit('context.getBlock("' + f.name.value + '")'), this.inBlock || this._emit(")"), this._emitLine("(env, context, frame, runtime, " + this._makeCallback(y)), this._emitLine(this.buffer + " += " + y + ";"), this._addScopeLevel();
              }, w.compileSuper = function(f, y) {
                var v = f.blockName.value, x = f.symbol.value, M = this._makeCallback(x);
                this._emitLine('context.getSuper(env, "' + v + '", b_' + v + ", frame, runtime, " + M), this._emitLine(x + " = runtime.markSafe(" + x + ");"), this._addScopeLevel(), y.set(x, x);
              }, w.compileExtends = function(f, y) {
                var v = this._tmpid(), x = this._compileGetTemplate(f, y, !0, !1);
                this._emitLine("parentTemplate = " + x), this._emitLine("for(var " + v + " in parentTemplate.blocks) {"), this._emitLine("context.addBlock(" + v + ", parentTemplate.blocks[" + v + "]);"), this._emitLine("}"), this._addScopeLevel();
              }, w.compileInclude = function(f, y) {
                this._emitLine("var tasks = [];"), this._emitLine("tasks.push("), this._emitLine("function(callback) {");
                var v = this._compileGetTemplate(f, y, !1, f.ignoreMissing);
                this._emitLine("callback(null," + v + ");});"), this._emitLine("});");
                var x = this._tmpid();
                this._emitLine("tasks.push("), this._emitLine("function(template, callback){"), this._emitLine("template.render(context.getVariables(), frame, " + this._makeCallback(x)), this._emitLine("callback(null," + x + ");});"), this._emitLine("});"), this._emitLine("tasks.push("), this._emitLine("function(result, callback){"), this._emitLine(this.buffer + " += result;"), this._emitLine("callback(null);"), this._emitLine("});"), this._emitLine("env.waterfall(tasks, function(){"), this._addScopeLevel();
              }, w.compileTemplateData = function(f, y) {
                this.compileLiteral(f, y);
              }, w.compileCapture = function(f, y) {
                var v = this, x = this.buffer;
                this.buffer = "output", this._emitLine("(function() {"), this._emitLine('var output = "";'), this._withScopedSyntax(function() {
                  v.compile(f.body, y);
                }), this._emitLine("return output;"), this._emitLine("})()"), this.buffer = x;
              }, w.compileOutput = function(f, y) {
                var v = this, x = f.children;
                x.forEach(function(M) {
                  M instanceof g.TemplateData ? M.value && (v._emit(v.buffer + " += "), v.compileLiteral(M, y), v._emitLine(";")) : (v._emit(v.buffer + " += runtime.suppressValue("), v.throwOnUndefined && v._emit("runtime.ensureDefined("), v.compile(M, y), v.throwOnUndefined && v._emit("," + f.lineno + "," + f.colno + ")"), v._emit(`, env.opts.autoescape);
`));
                });
              }, w.compileRoot = function(f, y) {
                var v = this;
                y && this.fail("compileRoot: root node can't have frame"), y = new p(), this._emitFuncBegin(f, "root"), this._emitLine("var parentTemplate = null;"), this._compileChildren(f, y), this._emitLine("if(parentTemplate) {"), this._emitLine("parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);"), this._emitLine("} else {"), this._emitLine("cb(null, " + this.buffer + ");"), this._emitLine("}"), this._emitFuncEnd(!0), this.inBlock = !0;
                var x = [], M = f.findAll(g.Block);
                M.forEach(function(E, T) {
                  var R = E.name.value;
                  if (x.indexOf(R) !== -1)
                    throw new Error('Block "' + R + '" defined more than once.');
                  x.push(R), v._emitFuncBegin(E, "b_" + R);
                  var L = new p();
                  v._emitLine("var frame = frame.push(true);"), v.compile(E.body, L), v._emitFuncEnd();
                }), this._emitLine("return {"), M.forEach(function(E, T) {
                  var R = "b_" + E.name.value;
                  v._emitLine(R + ": " + R + ",");
                }), this._emitLine(`root: root
};`);
              }, w.compile = function(f, y) {
                var v = this["compile" + f.typename];
                v ? v.call(this, f, y) : this.fail("compile: Cannot compile node: " + f.typename, f.lineno, f.colno);
              }, w.getCode = function() {
                return this.codebuf.join("");
              }, S;
            })(c);
            e.exports = {
              compile: function(d, S, w, f, y) {
                y === void 0 && (y = {});
                var v = new h(f, y.throwOnUndefined), x = (w || []).map(function(E) {
                  return E.preprocess;
                }).filter(function(E) {
                  return !!E;
                }), M = x.reduce(function(E, T) {
                  return T(E);
                }, d);
                return v.compile(a.transform(A.parse(M, w, y), S, f)), v.getCode();
              },
              Compiler: h
            };
          }),
          /* 6 */
          /***/
          (function(e, n, r) {
            function s(I, l) {
              I.prototype = Object.create(l.prototype), I.prototype.constructor = I, o(I, l);
            }
            function o(I, l) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(u, p) {
                return u.__proto__ = p, u;
              }, o(I, l);
            }
            var A = r(4), a = r(1), g = a.EmitterObj;
            e.exports = /* @__PURE__ */ (function(I) {
              s(l, I);
              function l() {
                return I.apply(this, arguments) || this;
              }
              var u = l.prototype;
              return u.resolve = function(p, m) {
                return A.resolve(A.dirname(p), m);
              }, u.isRelative = function(p) {
                return p.indexOf("./") === 0 || p.indexOf("../") === 0;
              }, l;
            })(g);
          }),
          /* 7 */
          /***/
          (function(e, n, r) {
            function s(D, G) {
              D.prototype = Object.create(G.prototype), D.prototype.constructor = D, o(D, G);
            }
            function o(D, G) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(U, P) {
                return U.__proto__ = P, U;
              }, o(D, G);
            }
            var A = r(12), a = r(15), g = r(0), I = r(5), l = r(18), u = r(10), p = u.FileSystemLoader, m = u.WebLoader, c = u.PrecompiledLoader, C = r(20), h = r(21), d = r(1), S = d.Obj, w = d.EmitterObj, f = r(2), y = f.handleError, v = f.Frame, x = r(22);
            function M(D, G, U) {
              A(function() {
                D(G, U);
              });
            }
            var E = {
              type: "code",
              obj: {
                root: function(D, G, U, P, N) {
                  try {
                    N(null, "");
                  } catch (O) {
                    N(y(O, null, null));
                  }
                }
              }
            }, T = /* @__PURE__ */ (function(D) {
              s(G, D);
              function G() {
                return D.apply(this, arguments) || this;
              }
              var U = G.prototype;
              return U.init = function(P, N) {
                var O = this;
                N = this.opts = N || {}, this.opts.dev = !!N.dev, this.opts.autoescape = N.autoescape != null ? N.autoescape : !0, this.opts.throwOnUndefined = !!N.throwOnUndefined, this.opts.trimBlocks = !!N.trimBlocks, this.opts.lstripBlocks = !!N.lstripBlocks, this.loaders = [], P ? this.loaders = g.isArray(P) ? P : [P] : p ? this.loaders = [new p("views")] : m && (this.loaders = [new m("/views")]), typeof window < "u" && window.nunjucksPrecompiled && this.loaders.unshift(new c(window.nunjucksPrecompiled)), this._initLoaders(), this.globals = h(), this.filters = {}, this.tests = {}, this.asyncFilters = [], this.extensions = {}, this.extensionsList = [], g._entries(l).forEach(function(X) {
                  var Z = X[0], V = X[1];
                  return O.addFilter(Z, V);
                }), g._entries(C).forEach(function(X) {
                  var Z = X[0], V = X[1];
                  return O.addTest(Z, V);
                });
              }, U._initLoaders = function() {
                var P = this;
                this.loaders.forEach(function(N) {
                  N.cache = {}, typeof N.on == "function" && (N.on("update", function(O, X) {
                    N.cache[O] = null, P.emit("update", O, X, N);
                  }), N.on("load", function(O, X) {
                    P.emit("load", O, X, N);
                  }));
                });
              }, U.invalidateCache = function() {
                this.loaders.forEach(function(P) {
                  P.cache = {};
                });
              }, U.addExtension = function(P, N) {
                return N.__name = P, this.extensions[P] = N, this.extensionsList.push(N), this;
              }, U.removeExtension = function(P) {
                var N = this.getExtension(P);
                N && (this.extensionsList = g.without(this.extensionsList, N), delete this.extensions[P]);
              }, U.getExtension = function(P) {
                return this.extensions[P];
              }, U.hasExtension = function(P) {
                return !!this.extensions[P];
              }, U.addGlobal = function(P, N) {
                return this.globals[P] = N, this;
              }, U.getGlobal = function(P) {
                if (typeof this.globals[P] > "u")
                  throw new Error("global not found: " + P);
                return this.globals[P];
              }, U.addFilter = function(P, N, O) {
                var X = N;
                return O && this.asyncFilters.push(P), this.filters[P] = X, this;
              }, U.getFilter = function(P) {
                if (!this.filters[P])
                  throw new Error("filter not found: " + P);
                return this.filters[P];
              }, U.addTest = function(P, N) {
                return this.tests[P] = N, this;
              }, U.getTest = function(P) {
                if (!this.tests[P])
                  throw new Error("test not found: " + P);
                return this.tests[P];
              }, U.resolveTemplate = function(P, N, O) {
                var X = P.isRelative && N ? P.isRelative(O) : !1;
                return X && P.resolve ? P.resolve(N, O) : O;
              }, U.getTemplate = function(P, N, O, X, Z) {
                var V = this, st = this, rt = null;
                if (P && P.raw && (P = P.raw), g.isFunction(O) && (Z = O, O = null, N = N || !1), g.isFunction(N) && (Z = N, N = !1), P instanceof L)
                  rt = P;
                else {
                  if (typeof P != "string")
                    throw new Error("template names must be a string: " + P);
                  for (var At = 0; At < this.loaders.length; At++) {
                    var nt = this.loaders[At];
                    if (rt = nt.cache[this.resolveTemplate(nt, O, P)], rt)
                      break;
                  }
                }
                if (rt)
                  if (N && rt.compile(), Z) {
                    Z(null, rt);
                    return;
                  } else
                    return rt;
                var pt, at = function(Q, J) {
                  if (!J && !Q && !X && (Q = new Error("template not found: " + P)), Q)
                    if (Z) {
                      Z(Q);
                      return;
                    } else
                      throw Q;
                  var Y;
                  J ? (Y = new L(J.src, V, J.path, N), J.noCache || (J.loader.cache[P] = Y)) : Y = new L(E, V, "", N), Z ? Z(null, Y) : pt = Y;
                };
                return g.asyncIter(this.loaders, function(Q, J, Y, mt) {
                  function Bt(te, yt) {
                    te ? mt(te) : yt ? (yt.loader = Q, mt(null, yt)) : Y();
                  }
                  P = st.resolveTemplate(Q, O, P), Q.async ? Q.getSource(P, Bt) : Bt(null, Q.getSource(P));
                }, at), pt;
              }, U.express = function(P) {
                return x(this, P);
              }, U.render = function(P, N, O) {
                g.isFunction(N) && (O = N, N = null);
                var X = null;
                return this.getTemplate(P, function(Z, V) {
                  if (Z && O)
                    M(O, Z);
                  else {
                    if (Z)
                      throw Z;
                    X = V.render(N, O);
                  }
                }), X;
              }, U.renderString = function(P, N, O, X) {
                g.isFunction(O) && (X = O, O = {}), O = O || {};
                var Z = new L(P, this, O.path);
                return Z.render(N, X);
              }, U.waterfall = function(P, N, O) {
                return a(P, N, O);
              }, G;
            })(w), R = /* @__PURE__ */ (function(D) {
              s(G, D);
              function G() {
                return D.apply(this, arguments) || this;
              }
              var U = G.prototype;
              return U.init = function(P, N, O) {
                var X = this;
                this.env = O || new T(), this.ctx = g.extend({}, P), this.blocks = {}, this.exported = [], g.keys(N).forEach(function(Z) {
                  X.addBlock(Z, N[Z]);
                });
              }, U.lookup = function(P) {
                return P in this.env.globals && !(P in this.ctx) ? this.env.globals[P] : this.ctx[P];
              }, U.setVariable = function(P, N) {
                this.ctx[P] = N;
              }, U.getVariables = function() {
                return this.ctx;
              }, U.addBlock = function(P, N) {
                return this.blocks[P] = this.blocks[P] || [], this.blocks[P].push(N), this;
              }, U.getBlock = function(P) {
                if (!this.blocks[P])
                  throw new Error('unknown block "' + P + '"');
                return this.blocks[P][0];
              }, U.getSuper = function(P, N, O, X, Z, V) {
                var st = g.indexOf(this.blocks[N] || [], O), rt = this.blocks[N][st + 1], At = this;
                if (st === -1 || !rt)
                  throw new Error('no super block available for "' + N + '"');
                rt(P, At, X, Z, V);
              }, U.addExport = function(P) {
                this.exported.push(P);
              }, U.getExported = function() {
                var P = this, N = {};
                return this.exported.forEach(function(O) {
                  N[O] = P.ctx[O];
                }), N;
              }, G;
            })(S), L = /* @__PURE__ */ (function(D) {
              s(G, D);
              function G() {
                return D.apply(this, arguments) || this;
              }
              var U = G.prototype;
              return U.init = function(P, N, O, X) {
                if (this.env = N || new T(), g.isObject(P))
                  switch (P.type) {
                    case "code":
                      this.tmplProps = P.obj;
                      break;
                    case "string":
                      this.tmplStr = P.obj;
                      break;
                    default:
                      throw new Error("Unexpected template object type " + P.type + "; expected 'code', or 'string'");
                  }
                else if (g.isString(P))
                  this.tmplStr = P;
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
              }, U.render = function(P, N, O) {
                var X = this;
                typeof P == "function" ? (O = P, P = {}) : typeof N == "function" && (O = N, N = null);
                var Z = !N;
                try {
                  this.compile();
                } catch (pt) {
                  var V = g._prettifyError(this.path, this.env.opts.dev, pt);
                  if (O)
                    return M(O, V);
                  throw V;
                }
                var st = new R(P || {}, this.blocks, this.env), rt = N ? N.push(!0) : new v();
                rt.topLevel = !0;
                var At = null, nt = !1;
                return this.rootRenderFunc(this.env, st, rt, f, function(pt, at) {
                  if (!(nt && O && typeof at < "u"))
                    if (pt && (pt = g._prettifyError(X.path, X.env.opts.dev, pt), nt = !0), O)
                      Z ? M(O, pt, at) : O(pt, at);
                    else {
                      if (pt)
                        throw pt;
                      At = at;
                    }
                }), At;
              }, U.getExported = function(P, N, O) {
                typeof P == "function" && (O = P, P = {}), typeof N == "function" && (O = N, N = null);
                try {
                  this.compile();
                } catch (V) {
                  if (O)
                    return O(V);
                  throw V;
                }
                var X = N ? N.push() : new v();
                X.topLevel = !0;
                var Z = new R(P || {}, this.blocks, this.env);
                this.rootRenderFunc(this.env, Z, X, f, function(V) {
                  V ? O(V, null) : O(null, Z.getExported());
                });
              }, U.compile = function() {
                this.compiled || this._compile();
              }, U._compile = function() {
                var P;
                if (this.tmplProps)
                  P = this.tmplProps;
                else {
                  var N = I.compile(this.tmplStr, this.env.asyncFilters, this.env.extensionsList, this.path, this.env.opts), O = new Function(N);
                  P = O();
                }
                this.blocks = this._getBlocks(P), this.rootRenderFunc = P.root, this.compiled = !0;
              }, U._getBlocks = function(P) {
                var N = {};
                return g.keys(P).forEach(function(O) {
                  O.slice(0, 2) === "b_" && (N[O.slice(2)] = P[O]);
                }), N;
              }, G;
            })(S);
            e.exports = {
              Environment: T,
              Template: L
            };
          }),
          /* 8 */
          /***/
          (function(e, n, r) {
            function s(u, p) {
              u.prototype = Object.create(p.prototype), u.prototype.constructor = u, o(u, p);
            }
            function o(u, p) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(m, c) {
                return m.__proto__ = c, m;
              }, o(u, p);
            }
            var A = r(9), a = r(3), g = r(1).Obj, I = r(0), l = /* @__PURE__ */ (function(u) {
              s(p, u);
              function p() {
                return u.apply(this, arguments) || this;
              }
              var m = p.prototype;
              return m.init = function(c) {
                this.tokens = c, this.peeked = null, this.breakOnBlocks = null, this.dropLeadingWhitespace = !1, this.extensions = [];
              }, m.nextToken = function(c) {
                var C;
                if (this.peeked)
                  if (!c && this.peeked.type === A.TOKEN_WHITESPACE)
                    this.peeked = null;
                  else
                    return C = this.peeked, this.peeked = null, C;
                if (C = this.tokens.nextToken(), !c)
                  for (; C && C.type === A.TOKEN_WHITESPACE; )
                    C = this.tokens.nextToken();
                return C;
              }, m.peekToken = function() {
                return this.peeked = this.peeked || this.nextToken(), this.peeked;
              }, m.pushToken = function(c) {
                if (this.peeked)
                  throw new Error("pushToken: can only push one token on between reads");
                this.peeked = c;
              }, m.error = function(c, C, h) {
                if (C === void 0 || h === void 0) {
                  var d = this.peekToken() || {};
                  C = d.lineno, h = d.colno;
                }
                return C !== void 0 && (C += 1), h !== void 0 && (h += 1), new I.TemplateError(c, C, h);
              }, m.fail = function(c, C, h) {
                throw this.error(c, C, h);
              }, m.skip = function(c) {
                var C = this.nextToken();
                return !C || C.type !== c ? (this.pushToken(C), !1) : !0;
              }, m.expect = function(c) {
                var C = this.nextToken();
                return C.type !== c && this.fail("expected " + c + ", got " + C.type, C.lineno, C.colno), C;
              }, m.skipValue = function(c, C) {
                var h = this.nextToken();
                return !h || h.type !== c || h.value !== C ? (this.pushToken(h), !1) : !0;
              }, m.skipSymbol = function(c) {
                return this.skipValue(A.TOKEN_SYMBOL, c);
              }, m.advanceAfterBlockEnd = function(c) {
                var C;
                return c || (C = this.peekToken(), C || this.fail("unexpected end of file"), C.type !== A.TOKEN_SYMBOL && this.fail("advanceAfterBlockEnd: expected symbol token or explicit name to be passed"), c = this.nextToken().value), C = this.nextToken(), C && C.type === A.TOKEN_BLOCK_END ? C.value.charAt(0) === "-" && (this.dropLeadingWhitespace = !0) : this.fail("expected block end in " + c + " statement"), C;
              }, m.advanceAfterVariableEnd = function() {
                var c = this.nextToken();
                c && c.type === A.TOKEN_VARIABLE_END ? this.dropLeadingWhitespace = c.value.charAt(c.value.length - this.tokens.tags.VARIABLE_END.length - 1) === "-" : (this.pushToken(c), this.fail("expected variable end"));
              }, m.parseFor = function() {
                var c = this.peekToken(), C, h;
                this.skipSymbol("for") ? (C = new a.For(c.lineno, c.colno), h = "endfor") : this.skipSymbol("asyncEach") ? (C = new a.AsyncEach(c.lineno, c.colno), h = "endeach") : this.skipSymbol("asyncAll") ? (C = new a.AsyncAll(c.lineno, c.colno), h = "endall") : this.fail("parseFor: expected for{Async}", c.lineno, c.colno), C.name = this.parsePrimary(), C.name instanceof a.Symbol || this.fail("parseFor: variable name expected for loop");
                var d = this.peekToken().type;
                if (d === A.TOKEN_COMMA) {
                  var S = C.name;
                  for (C.name = new a.Array(S.lineno, S.colno), C.name.addChild(S); this.skip(A.TOKEN_COMMA); ) {
                    var w = this.parsePrimary();
                    C.name.addChild(w);
                  }
                }
                return this.skipSymbol("in") || this.fail('parseFor: expected "in" keyword for loop', c.lineno, c.colno), C.arr = this.parseExpression(), this.advanceAfterBlockEnd(c.value), C.body = this.parseUntilBlocks(h, "else"), this.skipSymbol("else") && (this.advanceAfterBlockEnd("else"), C.else_ = this.parseUntilBlocks(h)), this.advanceAfterBlockEnd(), C;
              }, m.parseMacro = function() {
                var c = this.peekToken();
                this.skipSymbol("macro") || this.fail("expected macro");
                var C = this.parsePrimary(!0), h = this.parseSignature(), d = new a.Macro(c.lineno, c.colno, C, h);
                return this.advanceAfterBlockEnd(c.value), d.body = this.parseUntilBlocks("endmacro"), this.advanceAfterBlockEnd(), d;
              }, m.parseCall = function() {
                var c = this.peekToken();
                this.skipSymbol("call") || this.fail("expected call");
                var C = this.parseSignature(!0) || new a.NodeList(), h = this.parsePrimary();
                this.advanceAfterBlockEnd(c.value);
                var d = this.parseUntilBlocks("endcall");
                this.advanceAfterBlockEnd();
                var S = new a.Symbol(c.lineno, c.colno, "caller"), w = new a.Caller(c.lineno, c.colno, S, C, d), f = h.args.children;
                f[f.length - 1] instanceof a.KeywordArgs || f.push(new a.KeywordArgs());
                var y = f[f.length - 1];
                return y.addChild(new a.Pair(c.lineno, c.colno, S, w)), new a.Output(c.lineno, c.colno, [h]);
              }, m.parseWithContext = function() {
                var c = this.peekToken(), C = null;
                return this.skipSymbol("with") ? C = !0 : this.skipSymbol("without") && (C = !1), C !== null && (this.skipSymbol("context") || this.fail("parseFrom: expected context after with/without", c.lineno, c.colno)), C;
              }, m.parseImport = function() {
                var c = this.peekToken();
                this.skipSymbol("import") || this.fail("parseImport: expected import", c.lineno, c.colno);
                var C = this.parseExpression();
                this.skipSymbol("as") || this.fail('parseImport: expected "as" keyword', c.lineno, c.colno);
                var h = this.parseExpression(), d = this.parseWithContext(), S = new a.Import(c.lineno, c.colno, C, h, d);
                return this.advanceAfterBlockEnd(c.value), S;
              }, m.parseFrom = function() {
                var c = this.peekToken();
                this.skipSymbol("from") || this.fail("parseFrom: expected from");
                var C = this.parseExpression();
                this.skipSymbol("import") || this.fail("parseFrom: expected import", c.lineno, c.colno);
                for (var h = new a.NodeList(), d; ; ) {
                  var S = this.peekToken();
                  if (S.type === A.TOKEN_BLOCK_END) {
                    h.children.length || this.fail("parseFrom: Expected at least one import name", c.lineno, c.colno), S.value.charAt(0) === "-" && (this.dropLeadingWhitespace = !0), this.nextToken();
                    break;
                  }
                  h.children.length > 0 && !this.skip(A.TOKEN_COMMA) && this.fail("parseFrom: expected comma", c.lineno, c.colno);
                  var w = this.parsePrimary();
                  if (w.value.charAt(0) === "_" && this.fail("parseFrom: names starting with an underscore cannot be imported", w.lineno, w.colno), this.skipSymbol("as")) {
                    var f = this.parsePrimary();
                    h.addChild(new a.Pair(w.lineno, w.colno, w, f));
                  } else
                    h.addChild(w);
                  d = this.parseWithContext();
                }
                return new a.FromImport(c.lineno, c.colno, C, h, d);
              }, m.parseBlock = function() {
                var c = this.peekToken();
                this.skipSymbol("block") || this.fail("parseBlock: expected block", c.lineno, c.colno);
                var C = new a.Block(c.lineno, c.colno);
                C.name = this.parsePrimary(), C.name instanceof a.Symbol || this.fail("parseBlock: variable name expected", c.lineno, c.colno), this.advanceAfterBlockEnd(c.value), C.body = this.parseUntilBlocks("endblock"), this.skipSymbol("endblock"), this.skipSymbol(C.name.value);
                var h = this.peekToken();
                return h || this.fail("parseBlock: expected endblock, got end of file"), this.advanceAfterBlockEnd(h.value), C;
              }, m.parseExtends = function() {
                var c = "extends", C = this.peekToken();
                this.skipSymbol(c) || this.fail("parseTemplateRef: expected " + c);
                var h = new a.Extends(C.lineno, C.colno);
                return h.template = this.parseExpression(), this.advanceAfterBlockEnd(C.value), h;
              }, m.parseInclude = function() {
                var c = "include", C = this.peekToken();
                this.skipSymbol(c) || this.fail("parseInclude: expected " + c);
                var h = new a.Include(C.lineno, C.colno);
                return h.template = this.parseExpression(), this.skipSymbol("ignore") && this.skipSymbol("missing") && (h.ignoreMissing = !0), this.advanceAfterBlockEnd(C.value), h;
              }, m.parseIf = function() {
                var c = this.peekToken(), C;
                this.skipSymbol("if") || this.skipSymbol("elif") || this.skipSymbol("elseif") ? C = new a.If(c.lineno, c.colno) : this.skipSymbol("ifAsync") ? C = new a.IfAsync(c.lineno, c.colno) : this.fail("parseIf: expected if, elif, or elseif", c.lineno, c.colno), C.cond = this.parseExpression(), this.advanceAfterBlockEnd(c.value), C.body = this.parseUntilBlocks("elif", "elseif", "else", "endif");
                var h = this.peekToken();
                switch (h && h.value) {
                  case "elseif":
                  case "elif":
                    C.else_ = this.parseIf();
                    break;
                  case "else":
                    this.advanceAfterBlockEnd(), C.else_ = this.parseUntilBlocks("endif"), this.advanceAfterBlockEnd();
                    break;
                  case "endif":
                    C.else_ = null, this.advanceAfterBlockEnd();
                    break;
                  default:
                    this.fail("parseIf: expected elif, else, or endif, got end of file");
                }
                return C;
              }, m.parseSet = function() {
                var c = this.peekToken();
                this.skipSymbol("set") || this.fail("parseSet: expected set", c.lineno, c.colno);
                for (var C = new a.Set(c.lineno, c.colno, []), h; (h = this.parsePrimary()) && (C.targets.push(h), !!this.skip(A.TOKEN_COMMA)); )
                  ;
                return this.skipValue(A.TOKEN_OPERATOR, "=") ? (C.value = this.parseExpression(), this.advanceAfterBlockEnd(c.value)) : this.skip(A.TOKEN_BLOCK_END) ? (C.body = new a.Capture(c.lineno, c.colno, this.parseUntilBlocks("endset")), C.value = null, this.advanceAfterBlockEnd()) : this.fail("parseSet: expected = or block end in set tag", c.lineno, c.colno), C;
              }, m.parseSwitch = function() {
                var c = "switch", C = "endswitch", h = "case", d = "default", S = this.peekToken();
                !this.skipSymbol(c) && !this.skipSymbol(h) && !this.skipSymbol(d) && this.fail('parseSwitch: expected "switch," "case" or "default"', S.lineno, S.colno);
                var w = this.parseExpression();
                this.advanceAfterBlockEnd(c), this.parseUntilBlocks(h, d, C);
                var f = this.peekToken(), y = [], v;
                do {
                  this.skipSymbol(h);
                  var x = this.parseExpression();
                  this.advanceAfterBlockEnd(c);
                  var M = this.parseUntilBlocks(h, d, C);
                  y.push(new a.Case(f.line, f.col, x, M)), f = this.peekToken();
                } while (f && f.value === h);
                switch (f.value) {
                  case d:
                    this.advanceAfterBlockEnd(), v = this.parseUntilBlocks(C), this.advanceAfterBlockEnd();
                    break;
                  case C:
                    this.advanceAfterBlockEnd();
                    break;
                  default:
                    this.fail('parseSwitch: expected "case," "default" or "endswitch," got EOF.');
                }
                return new a.Switch(S.lineno, S.colno, w, y, v);
              }, m.parseStatement = function() {
                var c = this.peekToken(), C;
                if (c.type !== A.TOKEN_SYMBOL && this.fail("tag name expected", c.lineno, c.colno), this.breakOnBlocks && I.indexOf(this.breakOnBlocks, c.value) !== -1)
                  return null;
                switch (c.value) {
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
                      for (var h = 0; h < this.extensions.length; h++) {
                        var d = this.extensions[h];
                        if (I.indexOf(d.tags || [], c.value) !== -1)
                          return d.parse(this, a, A);
                      }
                    this.fail("unknown block tag: " + c.value, c.lineno, c.colno);
                }
                return C;
              }, m.parseRaw = function(c) {
                c = c || "raw";
                for (var C = "end" + c, h = new RegExp("([\\s\\S]*?){%\\s*(" + c + "|" + C + ")\\s*(?=%})%}"), d = 1, S = "", w = null, f = this.advanceAfterBlockEnd(); (w = this.tokens._extractRegex(h)) && d > 0; ) {
                  var y = w[0], v = w[1], x = w[2];
                  x === c ? d += 1 : x === C && (d -= 1), d === 0 ? (S += v, this.tokens.backN(y.length - v.length)) : S += y;
                }
                return new a.Output(f.lineno, f.colno, [new a.TemplateData(f.lineno, f.colno, S)]);
              }, m.parsePostfix = function(c) {
                for (var C, h = this.peekToken(); h; ) {
                  if (h.type === A.TOKEN_LEFT_PAREN)
                    c = new a.FunCall(h.lineno, h.colno, c, this.parseSignature());
                  else if (h.type === A.TOKEN_LEFT_BRACKET)
                    C = this.parseAggregate(), C.children.length > 1 && this.fail("invalid index"), c = new a.LookupVal(h.lineno, h.colno, c, C.children[0]);
                  else if (h.type === A.TOKEN_OPERATOR && h.value === ".") {
                    this.nextToken();
                    var d = this.nextToken();
                    d.type !== A.TOKEN_SYMBOL && this.fail("expected name as lookup value, got " + d.value, d.lineno, d.colno), C = new a.Literal(d.lineno, d.colno, d.value), c = new a.LookupVal(h.lineno, h.colno, c, C);
                  } else
                    break;
                  h = this.peekToken();
                }
                return c;
              }, m.parseExpression = function() {
                var c = this.parseInlineIf();
                return c;
              }, m.parseInlineIf = function() {
                var c = this.parseOr();
                if (this.skipSymbol("if")) {
                  var C = this.parseOr(), h = c;
                  c = new a.InlineIf(c.lineno, c.colno), c.body = h, c.cond = C, this.skipSymbol("else") ? c.else_ = this.parseOr() : c.else_ = null;
                }
                return c;
              }, m.parseOr = function() {
                for (var c = this.parseAnd(); this.skipSymbol("or"); ) {
                  var C = this.parseAnd();
                  c = new a.Or(c.lineno, c.colno, c, C);
                }
                return c;
              }, m.parseAnd = function() {
                for (var c = this.parseNot(); this.skipSymbol("and"); ) {
                  var C = this.parseNot();
                  c = new a.And(c.lineno, c.colno, c, C);
                }
                return c;
              }, m.parseNot = function() {
                var c = this.peekToken();
                return this.skipSymbol("not") ? new a.Not(c.lineno, c.colno, this.parseNot()) : this.parseIn();
              }, m.parseIn = function() {
                for (var c = this.parseIs(); ; ) {
                  var C = this.nextToken();
                  if (!C)
                    break;
                  var h = C.type === A.TOKEN_SYMBOL && C.value === "not";
                  if (h || this.pushToken(C), this.skipSymbol("in")) {
                    var d = this.parseIs();
                    c = new a.In(c.lineno, c.colno, c, d), h && (c = new a.Not(c.lineno, c.colno, c));
                  } else {
                    h && this.pushToken(C);
                    break;
                  }
                }
                return c;
              }, m.parseIs = function() {
                var c = this.parseCompare();
                if (this.skipSymbol("is")) {
                  var C = this.skipSymbol("not"), h = this.parseCompare();
                  c = new a.Is(c.lineno, c.colno, c, h), C && (c = new a.Not(c.lineno, c.colno, c));
                }
                return c;
              }, m.parseCompare = function() {
                for (var c = ["==", "===", "!=", "!==", "<", ">", "<=", ">="], C = this.parseConcat(), h = []; ; ) {
                  var d = this.nextToken();
                  if (d)
                    if (c.indexOf(d.value) !== -1)
                      h.push(new a.CompareOperand(d.lineno, d.colno, this.parseConcat(), d.value));
                    else {
                      this.pushToken(d);
                      break;
                    }
                  else break;
                }
                return h.length ? new a.Compare(h[0].lineno, h[0].colno, C, h) : C;
              }, m.parseConcat = function() {
                for (var c = this.parseAdd(); this.skipValue(A.TOKEN_TILDE, "~"); ) {
                  var C = this.parseAdd();
                  c = new a.Concat(c.lineno, c.colno, c, C);
                }
                return c;
              }, m.parseAdd = function() {
                for (var c = this.parseSub(); this.skipValue(A.TOKEN_OPERATOR, "+"); ) {
                  var C = this.parseSub();
                  c = new a.Add(c.lineno, c.colno, c, C);
                }
                return c;
              }, m.parseSub = function() {
                for (var c = this.parseMul(); this.skipValue(A.TOKEN_OPERATOR, "-"); ) {
                  var C = this.parseMul();
                  c = new a.Sub(c.lineno, c.colno, c, C);
                }
                return c;
              }, m.parseMul = function() {
                for (var c = this.parseDiv(); this.skipValue(A.TOKEN_OPERATOR, "*"); ) {
                  var C = this.parseDiv();
                  c = new a.Mul(c.lineno, c.colno, c, C);
                }
                return c;
              }, m.parseDiv = function() {
                for (var c = this.parseFloorDiv(); this.skipValue(A.TOKEN_OPERATOR, "/"); ) {
                  var C = this.parseFloorDiv();
                  c = new a.Div(c.lineno, c.colno, c, C);
                }
                return c;
              }, m.parseFloorDiv = function() {
                for (var c = this.parseMod(); this.skipValue(A.TOKEN_OPERATOR, "//"); ) {
                  var C = this.parseMod();
                  c = new a.FloorDiv(c.lineno, c.colno, c, C);
                }
                return c;
              }, m.parseMod = function() {
                for (var c = this.parsePow(); this.skipValue(A.TOKEN_OPERATOR, "%"); ) {
                  var C = this.parsePow();
                  c = new a.Mod(c.lineno, c.colno, c, C);
                }
                return c;
              }, m.parsePow = function() {
                for (var c = this.parseUnary(); this.skipValue(A.TOKEN_OPERATOR, "**"); ) {
                  var C = this.parseUnary();
                  c = new a.Pow(c.lineno, c.colno, c, C);
                }
                return c;
              }, m.parseUnary = function(c) {
                var C = this.peekToken(), h;
                return this.skipValue(A.TOKEN_OPERATOR, "-") ? h = new a.Neg(C.lineno, C.colno, this.parseUnary(!0)) : this.skipValue(A.TOKEN_OPERATOR, "+") ? h = new a.Pos(C.lineno, C.colno, this.parseUnary(!0)) : h = this.parsePrimary(), c || (h = this.parseFilter(h)), h;
              }, m.parsePrimary = function(c) {
                var C = this.nextToken(), h, d = null;
                if (C ? C.type === A.TOKEN_STRING ? h = C.value : C.type === A.TOKEN_INT ? h = parseInt(C.value, 10) : C.type === A.TOKEN_FLOAT ? h = parseFloat(C.value) : C.type === A.TOKEN_BOOLEAN ? C.value === "true" ? h = !0 : C.value === "false" ? h = !1 : this.fail("invalid boolean: " + C.value, C.lineno, C.colno) : C.type === A.TOKEN_NONE ? h = null : C.type === A.TOKEN_REGEX && (h = new RegExp(C.value.body, C.value.flags)) : this.fail("expected expression, got end of file"), h !== void 0 ? d = new a.Literal(C.lineno, C.colno, h) : C.type === A.TOKEN_SYMBOL ? d = new a.Symbol(C.lineno, C.colno, C.value) : (this.pushToken(C), d = this.parseAggregate()), c || (d = this.parsePostfix(d)), d)
                  return d;
                throw this.error("unexpected token: " + C.value, C.lineno, C.colno);
              }, m.parseFilterName = function() {
                for (var c = this.expect(A.TOKEN_SYMBOL), C = c.value; this.skipValue(A.TOKEN_OPERATOR, "."); )
                  C += "." + this.expect(A.TOKEN_SYMBOL).value;
                return new a.Symbol(c.lineno, c.colno, C);
              }, m.parseFilterArgs = function(c) {
                if (this.peekToken().type === A.TOKEN_LEFT_PAREN) {
                  var C = this.parsePostfix(c);
                  return C.args.children;
                }
                return [];
              }, m.parseFilter = function(c) {
                for (; this.skip(A.TOKEN_PIPE); ) {
                  var C = this.parseFilterName();
                  c = new a.Filter(C.lineno, C.colno, C, new a.NodeList(C.lineno, C.colno, [c].concat(this.parseFilterArgs(c))));
                }
                return c;
              }, m.parseFilterStatement = function() {
                var c = this.peekToken();
                this.skipSymbol("filter") || this.fail("parseFilterStatement: expected filter");
                var C = this.parseFilterName(), h = this.parseFilterArgs(C);
                this.advanceAfterBlockEnd(c.value);
                var d = new a.Capture(C.lineno, C.colno, this.parseUntilBlocks("endfilter"));
                this.advanceAfterBlockEnd();
                var S = new a.Filter(C.lineno, C.colno, C, new a.NodeList(C.lineno, C.colno, [d].concat(h)));
                return new a.Output(C.lineno, C.colno, [S]);
              }, m.parseAggregate = function() {
                var c = this.nextToken(), C;
                switch (c.type) {
                  case A.TOKEN_LEFT_PAREN:
                    C = new a.Group(c.lineno, c.colno);
                    break;
                  case A.TOKEN_LEFT_BRACKET:
                    C = new a.Array(c.lineno, c.colno);
                    break;
                  case A.TOKEN_LEFT_CURLY:
                    C = new a.Dict(c.lineno, c.colno);
                    break;
                  default:
                    return null;
                }
                for (; ; ) {
                  var h = this.peekToken().type;
                  if (h === A.TOKEN_RIGHT_PAREN || h === A.TOKEN_RIGHT_BRACKET || h === A.TOKEN_RIGHT_CURLY) {
                    this.nextToken();
                    break;
                  }
                  if (C.children.length > 0 && (this.skip(A.TOKEN_COMMA) || this.fail("parseAggregate: expected comma after expression", c.lineno, c.colno)), C instanceof a.Dict) {
                    var d = this.parsePrimary();
                    this.skip(A.TOKEN_COLON) || this.fail("parseAggregate: expected colon after dict key", c.lineno, c.colno);
                    var S = this.parseExpression();
                    C.addChild(new a.Pair(d.lineno, d.colno, d, S));
                  } else {
                    var w = this.parseExpression();
                    C.addChild(w);
                  }
                }
                return C;
              }, m.parseSignature = function(c, C) {
                var h = this.peekToken();
                if (!C && h.type !== A.TOKEN_LEFT_PAREN) {
                  if (c)
                    return null;
                  this.fail("expected arguments", h.lineno, h.colno);
                }
                h.type === A.TOKEN_LEFT_PAREN && (h = this.nextToken());
                for (var d = new a.NodeList(h.lineno, h.colno), S = new a.KeywordArgs(h.lineno, h.colno), w = !1; ; ) {
                  if (h = this.peekToken(), !C && h.type === A.TOKEN_RIGHT_PAREN) {
                    this.nextToken();
                    break;
                  } else if (C && h.type === A.TOKEN_BLOCK_END)
                    break;
                  if (w && !this.skip(A.TOKEN_COMMA))
                    this.fail("parseSignature: expected comma after expression", h.lineno, h.colno);
                  else {
                    var f = this.parseExpression();
                    this.skipValue(A.TOKEN_OPERATOR, "=") ? S.addChild(new a.Pair(f.lineno, f.colno, f, this.parseExpression())) : d.addChild(f);
                  }
                  w = !0;
                }
                return S.children.length && d.addChild(S), d;
              }, m.parseUntilBlocks = function() {
                for (var c = this.breakOnBlocks, C = arguments.length, h = new Array(C), d = 0; d < C; d++)
                  h[d] = arguments[d];
                this.breakOnBlocks = h;
                var S = this.parse();
                return this.breakOnBlocks = c, S;
              }, m.parseNodes = function() {
                for (var c, C = []; c = this.nextToken(); )
                  if (c.type === A.TOKEN_DATA) {
                    var h = c.value, d = this.peekToken(), S = d && d.value;
                    this.dropLeadingWhitespace && (h = h.replace(/^\s*/, ""), this.dropLeadingWhitespace = !1), d && (d.type === A.TOKEN_BLOCK_START && S.charAt(S.length - 1) === "-" || d.type === A.TOKEN_VARIABLE_START && S.charAt(this.tokens.tags.VARIABLE_START.length) === "-" || d.type === A.TOKEN_COMMENT && S.charAt(this.tokens.tags.COMMENT_START.length) === "-") && (h = h.replace(/\s*$/, "")), C.push(new a.Output(c.lineno, c.colno, [new a.TemplateData(c.lineno, c.colno, h)]));
                  } else if (c.type === A.TOKEN_BLOCK_START) {
                    this.dropLeadingWhitespace = !1;
                    var w = this.parseStatement();
                    if (!w)
                      break;
                    C.push(w);
                  } else if (c.type === A.TOKEN_VARIABLE_START) {
                    var f = this.parseExpression();
                    this.dropLeadingWhitespace = !1, this.advanceAfterVariableEnd(), C.push(new a.Output(c.lineno, c.colno, [f]));
                  } else c.type === A.TOKEN_COMMENT ? this.dropLeadingWhitespace = c.value.charAt(c.value.length - this.tokens.tags.COMMENT_END.length - 1) === "-" : this.fail("Unexpected token at top-level: " + c.type, c.lineno, c.colno);
                return C;
              }, m.parse = function() {
                return new a.NodeList(0, 0, this.parseNodes());
              }, m.parseAsRoot = function() {
                return new a.Root(0, 0, this.parseNodes());
              }, p;
            })(g);
            e.exports = {
              parse: function(u, p, m) {
                var c = new l(A.lex(u, m));
                return p !== void 0 && (c.extensions = p), c.parseAsRoot();
              },
              Parser: l
            };
          }),
          /* 9 */
          /***/
          (function(e, n, r) {
            var s = r(0), o = ` 
	\r `, A = "()[]{}%*-+~/#,:|.<>=!", a = "0123456789", g = "{%", I = "%}", l = "{{", u = "}}", p = "{#", m = "#}", c = "string", C = "whitespace", h = "data", d = "block-start", S = "block-end", w = "variable-start", f = "variable-end", y = "comment", v = "left-paren", x = "right-paren", M = "left-bracket", E = "right-bracket", T = "left-curly", R = "right-curly", L = "operator", D = "comma", G = "colon", U = "tilde", P = "pipe", N = "int", O = "float", X = "boolean", Z = "none", V = "symbol", st = "special", rt = "regex";
            function At(pt, at, Q, J) {
              return {
                type: pt,
                value: at,
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
                  BLOCK_END: Y.blockEnd || I,
                  VARIABLE_START: Y.variableStart || l,
                  VARIABLE_END: Y.variableEnd || u,
                  COMMENT_START: Y.commentStart || p,
                  COMMENT_END: Y.commentEnd || m
                }, this.trimBlocks = !!J.trimBlocks, this.lstripBlocks = !!J.lstripBlocks;
              }
              var at = pt.prototype;
              return at.nextToken = function() {
                var Q = this.lineno, J = this.colno, Y;
                if (this.in_code) {
                  var mt = this.current();
                  if (this.isFinished())
                    return null;
                  if (mt === '"' || mt === "'")
                    return At(c, this._parseString(mt), Q, J);
                  if (Y = this._extract(o))
                    return At(C, Y, Q, J);
                  if ((Y = this._extractString(this.tags.BLOCK_END)) || (Y = this._extractString("-" + this.tags.BLOCK_END)))
                    return this.in_code = !1, this.trimBlocks && (mt = this.current(), mt === `
` ? this.forward() : mt === "\r" && (this.forward(), mt = this.current(), mt === `
` ? this.forward() : this.back())), At(S, Y, Q, J);
                  if ((Y = this._extractString(this.tags.VARIABLE_END)) || (Y = this._extractString("-" + this.tags.VARIABLE_END)))
                    return this.in_code = !1, At(f, Y, Q, J);
                  if (mt === "r" && this.str.charAt(this.index + 1) === "/") {
                    this.forwardN(2);
                    for (var Bt = ""; !this.isFinished(); )
                      if (this.current() === "/" && this.previous() !== "\\") {
                        this.forward();
                        break;
                      } else
                        Bt += this.current(), this.forward();
                    for (var te = ["g", "i", "m", "y"], yt = ""; !this.isFinished(); ) {
                      var ht = te.indexOf(this.current()) !== -1;
                      if (ht)
                        yt += this.current(), this.forward();
                      else
                        break;
                    }
                    return At(rt, {
                      body: Bt,
                      flags: yt
                    }, Q, J);
                  } else if (A.indexOf(mt) !== -1) {
                    this.forward();
                    var _ = ["==", "===", "!=", "!==", "<=", ">=", "//", "**"], B = mt + this.current(), W;
                    switch (s.indexOf(_, B) !== -1 && (this.forward(), mt = B, s.indexOf(_, B + this.current()) !== -1 && (mt = B + this.current(), this.forward())), mt) {
                      case "(":
                        W = v;
                        break;
                      case ")":
                        W = x;
                        break;
                      case "[":
                        W = M;
                        break;
                      case "]":
                        W = E;
                        break;
                      case "{":
                        W = T;
                        break;
                      case "}":
                        W = R;
                        break;
                      case ",":
                        W = D;
                        break;
                      case ":":
                        W = G;
                        break;
                      case "~":
                        W = U;
                        break;
                      case "|":
                        W = P;
                        break;
                      default:
                        W = L;
                    }
                    return At(W, mt, Q, J);
                  } else if (Y = this._extractUntil(o + A), Y.match(/^[-+]?[0-9]+$/))
                    if (this.current() === ".") {
                      this.forward();
                      var H = this._extract(a);
                      return At(O, Y + "." + H, Q, J);
                    } else
                      return At(N, Y, Q, J);
                  else {
                    if (Y.match(/^(true|false)$/))
                      return At(X, Y, Q, J);
                    if (Y === "none" || Y === "null")
                      return At(Z, Y, Q, J);
                    if (Y)
                      return At(V, Y, Q, J);
                    throw new Error("Unexpected value while parsing: " + Y);
                  }
                } else {
                  var it = this.tags.BLOCK_START.charAt(0) + this.tags.VARIABLE_START.charAt(0) + this.tags.COMMENT_START.charAt(0) + this.tags.COMMENT_END.charAt(0);
                  if (this.isFinished())
                    return null;
                  if ((Y = this._extractString(this.tags.BLOCK_START + "-")) || (Y = this._extractString(this.tags.BLOCK_START)))
                    return this.in_code = !0, At(d, Y, Q, J);
                  if ((Y = this._extractString(this.tags.VARIABLE_START + "-")) || (Y = this._extractString(this.tags.VARIABLE_START)))
                    return this.in_code = !0, At(w, Y, Q, J);
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
                  return At(gt ? y : h, Y, Q, J);
                }
              }, at._parseString = function(Q) {
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
              }, at._matches = function(Q) {
                if (this.index + Q.length > this.len)
                  return null;
                var J = this.str.slice(this.index, this.index + Q.length);
                return J === Q;
              }, at._extractString = function(Q) {
                return this._matches(Q) ? (this.forwardN(Q.length), Q) : null;
              }, at._extractUntil = function(Q) {
                return this._extractMatching(!0, Q || "");
              }, at._extract = function(Q) {
                return this._extractMatching(!1, Q);
              }, at._extractMatching = function(Q, J) {
                if (this.isFinished())
                  return null;
                var Y = J.indexOf(this.current());
                if (Q && Y === -1 || !Q && Y !== -1) {
                  var mt = this.current();
                  this.forward();
                  for (var Bt = J.indexOf(this.current()); (Q && Bt === -1 || !Q && Bt !== -1) && !this.isFinished(); )
                    mt += this.current(), this.forward(), Bt = J.indexOf(this.current());
                  return mt;
                }
                return "";
              }, at._extractRegex = function(Q) {
                var J = this.currentStr().match(Q);
                return J ? (this.forwardN(J[0].length), J) : null;
              }, at.isFinished = function() {
                return this.index >= this.len;
              }, at.forwardN = function(Q) {
                for (var J = 0; J < Q; J++)
                  this.forward();
              }, at.forward = function() {
                this.index++, this.previous() === `
` ? (this.lineno++, this.colno = 0) : this.colno++;
              }, at.backN = function(Q) {
                for (var J = 0; J < Q; J++)
                  this.back();
              }, at.back = function() {
                if (this.index--, this.current() === `
`) {
                  this.lineno--;
                  var Q = this.src.lastIndexOf(`
`, this.index - 1);
                  Q === -1 ? this.colno = this.index : this.colno = this.index - Q;
                } else
                  this.colno--;
              }, at.current = function() {
                return this.isFinished() ? "" : this.str.charAt(this.index);
              }, at.currentStr = function() {
                return this.isFinished() ? "" : this.str.substr(this.index);
              }, at.previous = function() {
                return this.str.charAt(this.index - 1);
              }, pt;
            })();
            e.exports = {
              lex: function(pt, at) {
                return new nt(pt, at);
              },
              TOKEN_STRING: c,
              TOKEN_WHITESPACE: C,
              TOKEN_DATA: h,
              TOKEN_BLOCK_START: d,
              TOKEN_BLOCK_END: S,
              TOKEN_VARIABLE_START: w,
              TOKEN_VARIABLE_END: f,
              TOKEN_COMMENT: y,
              TOKEN_LEFT_PAREN: v,
              TOKEN_RIGHT_PAREN: x,
              TOKEN_LEFT_BRACKET: M,
              TOKEN_RIGHT_BRACKET: E,
              TOKEN_LEFT_CURLY: T,
              TOKEN_RIGHT_CURLY: R,
              TOKEN_OPERATOR: L,
              TOKEN_COMMA: D,
              TOKEN_COLON: G,
              TOKEN_TILDE: U,
              TOKEN_PIPE: P,
              TOKEN_INT: N,
              TOKEN_FLOAT: O,
              TOKEN_BOOLEAN: X,
              TOKEN_NONE: Z,
              TOKEN_SYMBOL: V,
              TOKEN_SPECIAL: st,
              TOKEN_REGEX: rt
            };
          }),
          /* 10 */
          /***/
          (function(e, n, r) {
            function s(l, u) {
              l.prototype = Object.create(u.prototype), l.prototype.constructor = l, o(l, u);
            }
            function o(l, u) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(p, m) {
                return p.__proto__ = m, p;
              }, o(l, u);
            }
            var A = r(6), a = r(19), g = a.PrecompiledLoader, I = /* @__PURE__ */ (function(l) {
              s(u, l);
              function u(m, c) {
                var C;
                return C = l.call(this) || this, C.baseURL = m || ".", c = c || {}, C.useCache = !!c.useCache, C.async = !!c.async, C;
              }
              var p = u.prototype;
              return p.resolve = function(m, c) {
                throw new Error("relative templates not support in the browser yet");
              }, p.getSource = function(m, c) {
                var C = this, h = this.useCache, d;
                return this.fetch(this.baseURL + "/" + m, function(S, w) {
                  if (S)
                    if (c)
                      c(S.content);
                    else if (S.status === 404)
                      d = null;
                    else
                      throw S.content;
                  else
                    d = {
                      src: w,
                      path: m,
                      noCache: !h
                    }, C.emit("load", m, d), c && c(null, d);
                }), d;
              }, p.fetch = function(m, c) {
                if (typeof window > "u")
                  throw new Error("WebLoader can only by used in a browser");
                var C = new XMLHttpRequest(), h = !0;
                C.onreadystatechange = function() {
                  C.readyState === 4 && h && (h = !1, C.status === 0 || C.status === 200 ? c(null, C.responseText) : c({
                    status: C.status,
                    content: C.responseText
                  }));
                }, m += (m.indexOf("?") === -1 ? "?" : "&") + "s=" + (/* @__PURE__ */ new Date()).getTime(), C.open("GET", m, this.async), C.send();
              }, u;
            })(A);
            e.exports = {
              WebLoader: I,
              PrecompiledLoader: g
            };
          }),
          /* 11 */
          /***/
          (function(e, n, r) {
            var s = r(0), o = r(7), A = o.Environment, a = o.Template, g = r(6), I = r(10), l = r(23), u = r(5), p = r(8), m = r(9), c = r(2), C = r(3), h = r(25), d;
            function S(w, f) {
              f = f || {}, s.isObject(w) && (f = w, w = null);
              var y;
              return I.FileSystemLoader ? y = new I.FileSystemLoader(w, {
                watch: f.watch,
                noCache: f.noCache
              }) : I.WebLoader && (y = new I.WebLoader(w, {
                useCache: f.web && f.web.useCache,
                async: f.web && f.web.async
              })), d = new A(y, f), f && f.express && d.express(f.express), d;
            }
            e.exports = {
              Environment: A,
              Template: a,
              Loader: g,
              FileSystemLoader: I.FileSystemLoader,
              NodeResolveLoader: I.NodeResolveLoader,
              PrecompiledLoader: I.PrecompiledLoader,
              WebLoader: I.WebLoader,
              compiler: u,
              parser: p,
              lexer: m,
              runtime: c,
              lib: s,
              nodes: C,
              installJinjaCompat: h,
              configure: S,
              reset: function() {
                d = void 0;
              },
              compile: function(w, f, y, v) {
                return d || S(), new a(w, f, y, v);
              },
              render: function(w, f, y) {
                return d || S(), d.render(w, f, y);
              },
              renderString: function(w, f, y) {
                return d || S(), d.renderString(w, f, y);
              },
              precompile: l ? l.precompile : void 0,
              precompileString: l ? l.precompileString : void 0
            };
          }),
          /* 12 */
          /***/
          (function(e, n, r) {
            var s = r(13), o = [], A = [], a = s.makeRequestCallFromTimer(g);
            function g() {
              if (A.length)
                throw A.shift();
            }
            e.exports = I;
            function I(u) {
              var p;
              o.length ? p = o.pop() : p = new l(), p.task = u, s(p);
            }
            function l() {
              this.task = null;
            }
            l.prototype.call = function() {
              try {
                this.task.call();
              } catch (u) {
                I.onerror ? I.onerror(u) : (A.push(u), a());
              } finally {
                this.task = null, o[o.length] = this;
              }
            };
          }),
          /* 13 */
          /***/
          (function(e, n, r) {
            (function(s) {
              e.exports = o;
              function o(C) {
                A.length || a(), A[A.length] = C;
              }
              var A = [], a, g = 0, I = 1024;
              function l() {
                for (; g < A.length; ) {
                  var C = g;
                  if (g = g + 1, A[C].call(), g > I) {
                    for (var h = 0, d = A.length - g; h < d; h++)
                      A[h] = A[h + g];
                    A.length -= g, g = 0;
                  }
                }
                A.length = 0, g = 0;
              }
              var u = typeof s < "u" ? s : self, p = u.MutationObserver || u.WebKitMutationObserver;
              typeof p == "function" ? a = m(l) : a = c(l), o.requestFlush = a;
              function m(C) {
                var h = 1, d = new p(C), S = document.createTextNode("");
                return d.observe(S, { characterData: !0 }), function() {
                  h = -h, S.data = h;
                };
              }
              function c(C) {
                return function() {
                  var h = setTimeout(S, 0), d = setInterval(S, 50);
                  function S() {
                    clearTimeout(h), clearInterval(d), C();
                  }
                };
              }
              o.makeRequestCallFromTimer = c;
            }).call(n, r(14));
          }),
          /* 14 */
          /***/
          (function(e, n) {
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
          (function(e, n, r) {
            var s, o;
            (function(A) {
              var a = function() {
                var p = Array.prototype.slice.call(arguments);
                typeof p[0] == "function" && p[0].apply(null, p.splice(1));
              }, g = function(p) {
                typeof setImmediate == "function" ? setImmediate(p) : typeof process < "u" && process.nextTick ? process.nextTick(p) : setTimeout(p, 0);
              }, I = function(p) {
                var m = function(c) {
                  var C = function() {
                    return p.length && p[c].apply(null, arguments), C.next();
                  };
                  return C.next = function() {
                    return c < p.length - 1 ? m(c + 1) : null;
                  }, C;
                };
                return m(0);
              }, l = Array.isArray || function(p) {
                return Object.prototype.toString.call(p) === "[object Array]";
              }, u = function(p, m, c) {
                var C = c ? g : a;
                if (m = m || function() {
                }, !l(p)) {
                  var h = new Error("First argument to waterfall must be an array of functions");
                  return m(h);
                }
                if (!p.length)
                  return m();
                var d = function(S) {
                  return function(w) {
                    if (w)
                      m.apply(null, arguments), m = function() {
                      };
                    else {
                      var f = Array.prototype.slice.call(arguments, 1), y = S.next();
                      y ? f.push(d(y)) : f.push(m), C(function() {
                        S.apply(null, f);
                      });
                    }
                  };
                };
                d(I(p))();
              };
              s = [], o = (function() {
                return u;
              }).apply(n, s), o !== void 0 && (e.exports = o);
            })();
          }),
          /* 16 */
          /***/
          (function(e, n, r) {
            var s = typeof Reflect == "object" ? Reflect : null, o = s && typeof s.apply == "function" ? s.apply : function(M, E, T) {
              return Function.prototype.apply.call(M, E, T);
            }, A;
            s && typeof s.ownKeys == "function" ? A = s.ownKeys : Object.getOwnPropertySymbols ? A = function(M) {
              return Object.getOwnPropertyNames(M).concat(Object.getOwnPropertySymbols(M));
            } : A = function(M) {
              return Object.getOwnPropertyNames(M);
            };
            function a(M) {
              console && console.warn && console.warn(M);
            }
            var g = Number.isNaN || function(M) {
              return M !== M;
            };
            function I() {
              I.init.call(this);
            }
            e.exports = I, e.exports.once = y, I.EventEmitter = I, I.prototype._events = void 0, I.prototype._eventsCount = 0, I.prototype._maxListeners = void 0;
            var l = 10;
            function u(M) {
              if (typeof M != "function")
                throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof M);
            }
            Object.defineProperty(I, "defaultMaxListeners", {
              enumerable: !0,
              get: function() {
                return l;
              },
              set: function(M) {
                if (typeof M != "number" || M < 0 || g(M))
                  throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + M + ".");
                l = M;
              }
            }), I.init = function() {
              (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
            }, I.prototype.setMaxListeners = function(M) {
              if (typeof M != "number" || M < 0 || g(M))
                throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + M + ".");
              return this._maxListeners = M, this;
            };
            function p(M) {
              return M._maxListeners === void 0 ? I.defaultMaxListeners : M._maxListeners;
            }
            I.prototype.getMaxListeners = function() {
              return p(this);
            }, I.prototype.emit = function(M) {
              for (var E = [], T = 1; T < arguments.length; T++) E.push(arguments[T]);
              var R = M === "error", L = this._events;
              if (L !== void 0)
                R = R && L.error === void 0;
              else if (!R)
                return !1;
              if (R) {
                var D;
                if (E.length > 0 && (D = E[0]), D instanceof Error)
                  throw D;
                var G = new Error("Unhandled error." + (D ? " (" + D.message + ")" : ""));
                throw G.context = D, G;
              }
              var U = L[M];
              if (U === void 0)
                return !1;
              if (typeof U == "function")
                o(U, this, E);
              else
                for (var P = U.length, N = S(U, P), T = 0; T < P; ++T)
                  o(N[T], this, E);
              return !0;
            };
            function m(M, E, T, R) {
              var L, D, G;
              if (u(T), D = M._events, D === void 0 ? (D = M._events = /* @__PURE__ */ Object.create(null), M._eventsCount = 0) : (D.newListener !== void 0 && (M.emit(
                "newListener",
                E,
                T.listener ? T.listener : T
              ), D = M._events), G = D[E]), G === void 0)
                G = D[E] = T, ++M._eventsCount;
              else if (typeof G == "function" ? G = D[E] = R ? [T, G] : [G, T] : R ? G.unshift(T) : G.push(T), L = p(M), L > 0 && G.length > L && !G.warned) {
                G.warned = !0;
                var U = new Error("Possible EventEmitter memory leak detected. " + G.length + " " + String(E) + " listeners added. Use emitter.setMaxListeners() to increase limit");
                U.name = "MaxListenersExceededWarning", U.emitter = M, U.type = E, U.count = G.length, a(U);
              }
              return M;
            }
            I.prototype.addListener = function(M, E) {
              return m(this, M, E, !1);
            }, I.prototype.on = I.prototype.addListener, I.prototype.prependListener = function(M, E) {
              return m(this, M, E, !0);
            };
            function c() {
              if (!this.fired)
                return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
            }
            function C(M, E, T) {
              var R = { fired: !1, wrapFn: void 0, target: M, type: E, listener: T }, L = c.bind(R);
              return L.listener = T, R.wrapFn = L, L;
            }
            I.prototype.once = function(M, E) {
              return u(E), this.on(M, C(this, M, E)), this;
            }, I.prototype.prependOnceListener = function(M, E) {
              return u(E), this.prependListener(M, C(this, M, E)), this;
            }, I.prototype.removeListener = function(M, E) {
              var T, R, L, D, G;
              if (u(E), R = this._events, R === void 0)
                return this;
              if (T = R[M], T === void 0)
                return this;
              if (T === E || T.listener === E)
                --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete R[M], R.removeListener && this.emit("removeListener", M, T.listener || E));
              else if (typeof T != "function") {
                for (L = -1, D = T.length - 1; D >= 0; D--)
                  if (T[D] === E || T[D].listener === E) {
                    G = T[D].listener, L = D;
                    break;
                  }
                if (L < 0)
                  return this;
                L === 0 ? T.shift() : w(T, L), T.length === 1 && (R[M] = T[0]), R.removeListener !== void 0 && this.emit("removeListener", M, G || E);
              }
              return this;
            }, I.prototype.off = I.prototype.removeListener, I.prototype.removeAllListeners = function(M) {
              var E, T, R;
              if (T = this._events, T === void 0)
                return this;
              if (T.removeListener === void 0)
                return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : T[M] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete T[M]), this;
              if (arguments.length === 0) {
                var L = Object.keys(T), D;
                for (R = 0; R < L.length; ++R)
                  D = L[R], D !== "removeListener" && this.removeAllListeners(D);
                return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
              }
              if (E = T[M], typeof E == "function")
                this.removeListener(M, E);
              else if (E !== void 0)
                for (R = E.length - 1; R >= 0; R--)
                  this.removeListener(M, E[R]);
              return this;
            };
            function h(M, E, T) {
              var R = M._events;
              if (R === void 0)
                return [];
              var L = R[E];
              return L === void 0 ? [] : typeof L == "function" ? T ? [L.listener || L] : [L] : T ? f(L) : S(L, L.length);
            }
            I.prototype.listeners = function(M) {
              return h(this, M, !0);
            }, I.prototype.rawListeners = function(M) {
              return h(this, M, !1);
            }, I.listenerCount = function(M, E) {
              return typeof M.listenerCount == "function" ? M.listenerCount(E) : d.call(M, E);
            }, I.prototype.listenerCount = d;
            function d(M) {
              var E = this._events;
              if (E !== void 0) {
                var T = E[M];
                if (typeof T == "function")
                  return 1;
                if (T !== void 0)
                  return T.length;
              }
              return 0;
            }
            I.prototype.eventNames = function() {
              return this._eventsCount > 0 ? A(this._events) : [];
            };
            function S(M, E) {
              for (var T = new Array(E), R = 0; R < E; ++R)
                T[R] = M[R];
              return T;
            }
            function w(M, E) {
              for (; E + 1 < M.length; E++)
                M[E] = M[E + 1];
              M.pop();
            }
            function f(M) {
              for (var E = new Array(M.length), T = 0; T < E.length; ++T)
                E[T] = M[T].listener || M[T];
              return E;
            }
            function y(M, E) {
              return new Promise(function(T, R) {
                function L(G) {
                  M.removeListener(E, D), R(G);
                }
                function D() {
                  typeof M.removeListener == "function" && M.removeListener("error", L), T([].slice.call(arguments));
                }
                x(M, E, D, { once: !0 }), E !== "error" && v(M, L, { once: !0 });
              });
            }
            function v(M, E, T) {
              typeof M.on == "function" && x(M, "error", E, T);
            }
            function x(M, E, T, R) {
              if (typeof M.on == "function")
                R.once ? M.once(E, T) : M.on(E, T);
              else if (typeof M.addEventListener == "function")
                M.addEventListener(E, function L(D) {
                  R.once && M.removeEventListener(E, L), T(D);
                });
              else
                throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof M);
            }
          }),
          /* 17 */
          /***/
          (function(e, n, r) {
            var s = r(3), o = r(0), A = 0;
            function a() {
              return "hole_" + A++;
            }
            function g(d, S) {
              for (var w = null, f = 0; f < d.length; f++) {
                var y = S(d[f]);
                y !== d[f] && (w || (w = d.slice()), w[f] = y);
              }
              return w || d;
            }
            function I(d, S, w) {
              if (!(d instanceof s.Node))
                return d;
              if (!w) {
                var f = S(d);
                if (f && f !== d)
                  return f;
              }
              if (d instanceof s.NodeList) {
                var y = g(d.children, function(T) {
                  return I(T, S, w);
                });
                y !== d.children && (d = new s[d.typename](d.lineno, d.colno, y));
              } else if (d instanceof s.CallExtension) {
                var v = I(d.args, S, w), x = g(d.contentArgs, function(T) {
                  return I(T, S, w);
                });
                (v !== d.args || x !== d.contentArgs) && (d = new s[d.typename](d.extName, d.prop, v, x));
              } else {
                var M = d.fields.map(function(T) {
                  return d[T];
                }), E = g(M, function(T) {
                  return I(T, S, w);
                });
                E !== M && (d = new s[d.typename](d.lineno, d.colno), E.forEach(function(T, R) {
                  d[d.fields[R]] = T;
                }));
              }
              return w && S(d) || d;
            }
            function l(d, S) {
              return I(d, S, !0);
            }
            function u(d, S, w) {
              var f = [], y = l(w ? d[w] : d, function(v) {
                var x;
                return v instanceof s.Block ? v : ((v instanceof s.Filter && o.indexOf(S, v.name.value) !== -1 || v instanceof s.CallExtensionAsync) && (x = new s.Symbol(v.lineno, v.colno, a()), f.push(new s.FilterAsync(v.lineno, v.colno, v.name, v.args, x))), x);
              });
              return w ? d[w] = y : d = y, f.length ? (f.push(d), new s.NodeList(d.lineno, d.colno, f)) : d;
            }
            function p(d, S) {
              return l(d, function(w) {
                return w instanceof s.Output ? u(w, S) : w instanceof s.Set ? u(w, S, "value") : w instanceof s.For ? u(w, S, "arr") : w instanceof s.If ? u(w, S, "cond") : w instanceof s.CallExtension ? u(w, S, "args") : void 0;
              });
            }
            function m(d) {
              return I(d, function(S) {
                if (S instanceof s.Block) {
                  var w = !1, f = a();
                  S.body = I(S.body, function(y) {
                    if (y instanceof s.FunCall && y.name.value === "super")
                      return w = !0, new s.Symbol(y.lineno, y.colno, f);
                  }), w && S.body.children.unshift(new s.Super(0, 0, S.name, new s.Symbol(0, 0, f)));
                }
              });
            }
            function c(d) {
              return l(d, function(S) {
                if (!(!(S instanceof s.If) && !(S instanceof s.For))) {
                  var w = !1;
                  if (I(S, function(f) {
                    if (f instanceof s.FilterAsync || f instanceof s.IfAsync || f instanceof s.AsyncEach || f instanceof s.AsyncAll || f instanceof s.CallExtensionAsync)
                      return w = !0, f;
                  }), w) {
                    if (S instanceof s.If)
                      return new s.IfAsync(S.lineno, S.colno, S.cond, S.body, S.else_);
                    if (S instanceof s.For && !(S instanceof s.AsyncAll))
                      return new s.AsyncEach(S.lineno, S.colno, S.arr, S.name, S.body, S.else_);
                  }
                }
              });
            }
            function C(d, S) {
              return c(m(p(d, S)));
            }
            function h(d, S) {
              return C(d, S || []);
            }
            e.exports = {
              transform: h
            };
          }),
          /* 18 */
          /***/
          (function(e, A, r) {
            var s = r(0), o = r(2), A = e.exports = {};
            function a(_, B) {
              return _ == null || _ === !1 ? B : _;
            }
            A.abs = Math.abs;
            function g(_) {
              return _ !== _;
            }
            function I(_, B, W) {
              var H, it = [], tt = [];
              for (H = 0; H < _.length; H++)
                H % B === 0 && tt.length && (it.push(tt), tt = []), tt.push(_[H]);
              if (tt.length) {
                if (W)
                  for (H = tt.length; H < B; H++)
                    tt.push(W);
                it.push(tt);
              }
              return it;
            }
            A.batch = I;
            function l(_) {
              _ = a(_, "");
              var B = _.toLowerCase();
              return o.copySafeness(_, B.charAt(0).toUpperCase() + B.slice(1));
            }
            A.capitalize = l;
            function u(_, B) {
              if (_ = a(_, ""), B = B || 80, _.length >= B)
                return _;
              var W = B - _.length, H = s.repeat(" ", W / 2 - W % 2), it = s.repeat(" ", W / 2);
              return o.copySafeness(_, H + _ + it);
            }
            A.center = u;
            function p(_, B, W) {
              return W ? _ || B : _ !== void 0 ? _ : B;
            }
            A.default = p;
            function m(_, B, W) {
              if (!s.isObject(_))
                throw new s.TemplateError("dictsort filter: val must be an object");
              var H = [];
              for (var it in _)
                H.push([it, _[it]]);
              var tt;
              if (W === void 0 || W === "key")
                tt = 0;
              else if (W === "value")
                tt = 1;
              else
                throw new s.TemplateError("dictsort filter: You can only sort by either key or value");
              return H.sort(function(gt, ot) {
                var wt = gt[tt], Mt = ot[tt];
                return B || (s.isString(wt) && (wt = wt.toUpperCase()), s.isString(Mt) && (Mt = Mt.toUpperCase())), wt > Mt ? 1 : wt === Mt ? 0 : -1;
              }), H;
            }
            A.dictsort = m;
            function c(_, B) {
              return JSON.stringify(_, null, B);
            }
            A.dump = c;
            function C(_) {
              return _ instanceof o.SafeString ? _ : (_ = _ ?? "", o.markSafe(s.escape(_.toString())));
            }
            A.escape = C;
            function h(_) {
              return _ instanceof o.SafeString ? _ : (_ = _ ?? "", o.markSafe(_.toString()));
            }
            A.safe = h;
            function d(_) {
              return _[0];
            }
            A.first = d;
            function S(_) {
              return _ = _ ?? "", o.markSafe(s.escape(_.toString()));
            }
            A.forceescape = S;
            function w(_, B) {
              return s.groupBy(_, B, this.env.opts.throwOnUndefined);
            }
            A.groupby = w;
            function f(_, B, W) {
              if (_ = a(_, ""), _ === "")
                return "";
              B = B || 4;
              var H = _.split(`
`), it = s.repeat(" ", B), tt = H.map(function(gt, ot) {
                return ot === 0 && !W ? gt : "" + it + gt;
              }).join(`
`);
              return o.copySafeness(_, tt);
            }
            A.indent = f;
            function y(_, B, W) {
              return B = B || "", W && (_ = s.map(_, function(H) {
                return H[W];
              })), _.join(B);
            }
            A.join = y;
            function v(_) {
              return _[_.length - 1];
            }
            A.last = v;
            function x(_) {
              var B = a(_, "");
              return B !== void 0 ? typeof Map == "function" && B instanceof Map || typeof Set == "function" && B instanceof Set ? B.size : s.isObject(B) && !(B instanceof o.SafeString) ? s.keys(B).length : B.length : 0;
            }
            A.length = x;
            function M(_) {
              if (s.isString(_))
                return _.split("");
              if (s.isObject(_))
                return s._entries(_ || {}).map(function(B) {
                  var W = B[0], H = B[1];
                  return {
                    key: W,
                    value: H
                  };
                });
              if (s.isArray(_))
                return _;
              throw new s.TemplateError("list filter: type not iterable");
            }
            A.list = M;
            function E(_) {
              return _ = a(_, ""), _.toLowerCase();
            }
            A.lower = E;
            function T(_) {
              return _ == null ? "" : o.copySafeness(_, _.replace(/\r\n|\n/g, `<br />
`));
            }
            A.nl2br = T;
            function R(_) {
              return _[Math.floor(Math.random() * _.length)];
            }
            A.random = R;
            function L(_) {
              function B(W, H, it) {
                H === void 0 && (H = "truthy");
                var tt = this, gt = tt.env.getTest(H);
                return s.toArray(W).filter(function(ot) {
                  return gt.call(tt, ot, it) === _;
                });
              }
              return B;
            }
            A.reject = L(!1);
            function D(_, B) {
              return _.filter(function(W) {
                return !W[B];
              });
            }
            A.rejectattr = D, A.select = L(!0);
            function G(_, B) {
              return _.filter(function(W) {
                return !!W[B];
              });
            }
            A.selectattr = G;
            function U(_, B, W, H) {
              var it = _;
              if (B instanceof RegExp)
                return _.replace(B, W);
              typeof H > "u" && (H = -1);
              var tt = "";
              if (typeof B == "number")
                B = "" + B;
              else if (typeof B != "string")
                return _;
              if (typeof _ == "number" && (_ = "" + _), typeof _ != "string" && !(_ instanceof o.SafeString))
                return _;
              if (B === "")
                return tt = W + _.split("").join(W) + W, o.copySafeness(_, tt);
              var gt = _.indexOf(B);
              if (H === 0 || gt === -1)
                return _;
              for (var ot = 0, wt = 0; gt > -1 && (H === -1 || wt < H); )
                tt += _.substring(ot, gt) + W, ot = gt + B.length, wt++, gt = _.indexOf(B, ot);
              return ot < _.length && (tt += _.substring(ot)), o.copySafeness(it, tt);
            }
            A.replace = U;
            function P(_) {
              var B;
              return s.isString(_) ? B = M(_) : B = s.map(_, function(W) {
                return W;
              }), B.reverse(), s.isString(_) ? o.copySafeness(_, B.join("")) : B;
            }
            A.reverse = P;
            function N(_, B, W) {
              B = B || 0;
              var H = Math.pow(10, B), it;
              return W === "ceil" ? it = Math.ceil : W === "floor" ? it = Math.floor : it = Math.round, it(_ * H) / H;
            }
            A.round = N;
            function O(_, B, W) {
              for (var H = Math.floor(_.length / B), it = _.length % B, tt = [], gt = 0, ot = 0; ot < B; ot++) {
                var wt = gt + ot * H;
                ot < it && gt++;
                var Mt = gt + (ot + 1) * H, Ut = _.slice(wt, Mt);
                W && ot >= it && Ut.push(W), tt.push(Ut);
              }
              return tt;
            }
            A.slice = O;
            function X(_, B, W) {
              return W === void 0 && (W = 0), B && (_ = s.map(_, function(H) {
                return H[B];
              })), W + _.reduce(function(H, it) {
                return H + it;
              }, 0);
            }
            A.sum = X, A.sort = o.makeMacro(["value", "reverse", "case_sensitive", "attribute"], [], function(_, B, W, H) {
              var it = this, tt = s.map(_, function(ot) {
                return ot;
              }), gt = s.getAttrGetter(H);
              return tt.sort(function(ot, wt) {
                var Mt = H ? gt(ot) : ot, Ut = H ? gt(wt) : wt;
                if (it.env.opts.throwOnUndefined && H && (Mt === void 0 || Ut === void 0))
                  throw new TypeError('sort: attribute "' + H + '" resolved to undefined');
                return !W && s.isString(Mt) && s.isString(Ut) && (Mt = Mt.toLowerCase(), Ut = Ut.toLowerCase()), Mt < Ut ? B ? 1 : -1 : Mt > Ut ? B ? -1 : 1 : 0;
              }), tt;
            });
            function Z(_) {
              return o.copySafeness(_, _);
            }
            A.string = Z;
            function V(_, B) {
              _ = a(_, "");
              var W = /<\/?([a-z][a-z0-9]*)\b[^>]*>|<!--[\s\S]*?-->/gi, H = rt(_.replace(W, "")), it = "";
              return B ? it = H.replace(/^ +| +$/gm, "").replace(/ +/g, " ").replace(/(\r\n)/g, `
`).replace(/\n\n\n+/g, `

`) : it = H.replace(/\s+/gi, " "), o.copySafeness(_, it);
            }
            A.striptags = V;
            function st(_) {
              _ = a(_, "");
              var B = _.split(" ").map(function(W) {
                return l(W);
              });
              return o.copySafeness(_, B.join(" "));
            }
            A.title = st;
            function rt(_) {
              return o.copySafeness(_, _.replace(/^\s*|\s*$/g, ""));
            }
            A.trim = rt;
            function At(_, B, W, H) {
              var it = _;
              if (_ = a(_, ""), B = B || 255, _.length <= B)
                return _;
              if (W)
                _ = _.substring(0, B);
              else {
                var tt = _.lastIndexOf(" ", B);
                tt === -1 && (tt = B), _ = _.substring(0, tt);
              }
              return _ += H ?? "...", o.copySafeness(it, _);
            }
            A.truncate = At;
            function nt(_) {
              return _ = a(_, ""), _.toUpperCase();
            }
            A.upper = nt;
            function pt(_) {
              var B = encodeURIComponent;
              if (s.isString(_))
                return B(_);
              var W = s.isArray(_) ? _ : s._entries(_);
              return W.map(function(H) {
                var it = H[0], tt = H[1];
                return B(it) + "=" + B(tt);
              }).join("&");
            }
            A.urlencode = pt;
            var at = /^(?:\(|<|&lt;)?(.*?)(?:\.|,|\)|\n|&gt;)?$/, Q = /^[\w.!#$%&'*+\-\/=?\^`{|}~]+@[a-z\d\-]+(\.[a-z\d\-]+)+$/i, J = /^https?:\/\/.*$/, Y = /^www\./, mt = /\.(?:org|net|com)(?:\:|\/|$)/;
            function Bt(_, B, W) {
              g(B) && (B = 1 / 0);
              var H = W === !0 ? ' rel="nofollow"' : "", it = _.split(/(\s+)/).filter(function(tt) {
                return tt && tt.length;
              }).map(function(tt) {
                var gt = tt.match(at), ot = gt ? gt[1] : tt, wt = ot.substr(0, B);
                return J.test(ot) ? '<a href="' + ot + '"' + H + ">" + wt + "</a>" : Y.test(ot) ? '<a href="http://' + ot + '"' + H + ">" + wt + "</a>" : Q.test(ot) ? '<a href="mailto:' + ot + '">' + ot + "</a>" : mt.test(ot) ? '<a href="http://' + ot + '"' + H + ">" + wt + "</a>" : tt;
              });
              return it.join("");
            }
            A.urlize = Bt;
            function te(_) {
              _ = a(_, "");
              var B = _ ? _.match(/\w+/g) : null;
              return B ? B.length : null;
            }
            A.wordcount = te;
            function yt(_, B) {
              var W = parseFloat(_);
              return g(W) ? B : W;
            }
            A.float = yt;
            var ht = o.makeMacro(["value", "default", "base"], [], function(_, B, W) {
              W === void 0 && (W = 10);
              var H = parseInt(_, W);
              return g(H) ? B : H;
            });
            A.int = ht, A.d = A.default, A.e = A.escape;
          }),
          /* 19 */
          /***/
          (function(e, n, r) {
            function s(g, I) {
              g.prototype = Object.create(I.prototype), g.prototype.constructor = g, o(g, I);
            }
            function o(g, I) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(l, u) {
                return l.__proto__ = u, l;
              }, o(g, I);
            }
            var A = r(6), a = /* @__PURE__ */ (function(g) {
              s(I, g);
              function I(u) {
                var p;
                return p = g.call(this) || this, p.precompiled = u || {}, p;
              }
              var l = I.prototype;
              return l.getSource = function(u) {
                return this.precompiled[u] ? {
                  src: {
                    type: "code",
                    obj: this.precompiled[u]
                  },
                  path: u
                } : null;
              }, I;
            })(A);
            e.exports = {
              PrecompiledLoader: a
            };
          }),
          /* 20 */
          /***/
          (function(e, n, r) {
            var s = r(2).SafeString;
            function o(R) {
              return typeof R == "function";
            }
            n.callable = o;
            function A(R) {
              return R !== void 0;
            }
            n.defined = A;
            function a(R, L) {
              return R % L === 0;
            }
            n.divisibleby = a;
            function g(R) {
              return R instanceof s;
            }
            n.escaped = g;
            function I(R, L) {
              return R === L;
            }
            n.equalto = I, n.eq = n.equalto, n.sameas = n.equalto;
            function l(R) {
              return R % 2 === 0;
            }
            n.even = l;
            function u(R) {
              return !R;
            }
            n.falsy = u;
            function p(R, L) {
              return R >= L;
            }
            n.ge = p;
            function m(R, L) {
              return R > L;
            }
            n.greaterthan = m, n.gt = n.greaterthan;
            function c(R, L) {
              return R <= L;
            }
            n.le = c;
            function C(R, L) {
              return R < L;
            }
            n.lessthan = C, n.lt = n.lessthan;
            function h(R) {
              return R.toLowerCase() === R;
            }
            n.lower = h;
            function d(R, L) {
              return R !== L;
            }
            n.ne = d;
            function S(R) {
              return R === null;
            }
            n.null = S;
            function w(R) {
              return typeof R == "number";
            }
            n.number = w;
            function f(R) {
              return R % 2 === 1;
            }
            n.odd = f;
            function y(R) {
              return typeof R == "string";
            }
            n.string = y;
            function v(R) {
              return !!R;
            }
            n.truthy = v;
            function x(R) {
              return R === void 0;
            }
            n.undefined = x;
            function M(R) {
              return R.toUpperCase() === R;
            }
            n.upper = M;
            function E(R) {
              return typeof Symbol < "u" ? !!R[Symbol.iterator] : Array.isArray(R) || typeof R == "string";
            }
            n.iterable = E;
            function T(R) {
              var L = R != null && typeof R == "object" && !Array.isArray(R);
              return Set ? L && !(R instanceof Set) : L;
            }
            n.mapping = T;
          }),
          /* 21 */
          /***/
          (function(e, n, r) {
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
                var I = g ? "" : a;
                return g = !1, I;
              };
            }
            function A() {
              return {
                range: function(a, g, I) {
                  typeof g > "u" ? (g = a, a = 0, I = 1) : I || (I = 1);
                  var l = [];
                  if (I > 0)
                    for (var u = a; u < g; u += I)
                      l.push(u);
                  else
                    for (var p = a; p > g; p += I)
                      l.push(p);
                  return l;
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
          (function(e, n, r) {
            var s = r(4);
            e.exports = function(o, A) {
              function a(g, I) {
                if (this.name = g, this.path = g, this.defaultEngine = I.defaultEngine, this.ext = s.extname(g), !this.ext && !this.defaultEngine)
                  throw new Error("No default engine was specified and no extension was provided.");
                this.ext || (this.name += this.ext = (this.defaultEngine[0] !== "." ? "." : "") + this.defaultEngine);
              }
              return a.prototype.render = function(g, I) {
                o.render(this.name, g, I);
              }, A.set("view", a), A.set("nunjucksEnv", o), o;
            };
          }),
          /* 23 */
          /***/
          (function(e, n, r) {
            var s = r(4), o = r(4), A = r(0), a = A._prettifyError, g = r(5), I = r(7), l = I.Environment, u = r(24);
            function p(h, d) {
              return Array.isArray(d) ? d.some(function(S) {
                return h.match(S);
              }) : !1;
            }
            function m(h, d) {
              d = d || {}, d.isString = !0;
              var S = d.env || new l([]), w = d.wrapper || u;
              if (!d.name)
                throw new Error('the "name" option is required when compiling a string');
              return w([C(h, d.name, S)], d);
            }
            function c(h, d) {
              d = d || {};
              var S = d.env || new l([]), w = d.wrapper || u;
              if (d.isString)
                return m(h, d);
              var f = s.existsSync(h) && s.statSync(h), y = [], v = [];
              function x(T) {
                s.readdirSync(T).forEach(function(R) {
                  var L = o.join(T, R), D = L.substr(o.join(h, "/").length), G = s.statSync(L);
                  G && G.isDirectory() ? (D += "/", p(D, d.exclude) || x(L)) : p(D, d.include) && v.push(L);
                });
              }
              if (f.isFile())
                y.push(C(s.readFileSync(h, "utf-8"), d.name || h, S));
              else if (f.isDirectory()) {
                x(h);
                for (var M = 0; M < v.length; M++) {
                  var E = v[M].replace(o.join(h, "/"), "");
                  try {
                    y.push(C(s.readFileSync(v[M], "utf-8"), E, S));
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
            function C(h, d, S) {
              S = S || new l([]);
              var w = S.asyncFilters, f = S.extensionsList, y;
              d = d.replace(/\\/g, "/");
              try {
                y = g.compile(h, w, f, d, S.opts);
              } catch (v) {
                throw a(d, !1, v);
              }
              return {
                name: d,
                template: y
              };
            }
            e.exports = {
              precompile: c,
              precompileString: m
            };
          }),
          /* 24 */
          /***/
          (function(e, n, r) {
            function s(o, A) {
              var a = "";
              A = A || {};
              for (var g = 0; g < o.length; g++) {
                var I = JSON.stringify(o[g].name), l = o[g].template;
                a += "(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})[" + I + `] = (function() {
` + l + `
})();
`, A.asFunction && (a += "return function(ctx, cb) { return nunjucks.render(" + I + `, ctx, cb); }
`), a += `})();
`;
              }
              return a;
            }
            e.exports = s;
          }),
          /* 25 */
          /***/
          (function(e, n, r) {
            function s() {
              var o = this.runtime, A = this.lib, a = this.compiler.Compiler, g = this.parser.Parser, I = this.nodes, l = this.lexer, u = o.contextOrFrameLookup, p = o.memberLookup, m, c;
              a && (m = a.prototype.assertType), g && (c = g.prototype.parseAggregate);
              function C() {
                o.contextOrFrameLookup = u, o.memberLookup = p, a && (a.prototype.assertType = m), g && (g.prototype.parseAggregate = c);
              }
              o.contextOrFrameLookup = function(v, x, M) {
                var E = u.apply(this, arguments);
                if (E !== void 0)
                  return E;
                switch (M) {
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
              function h(v) {
                return {
                  index: v.index,
                  lineno: v.lineno,
                  colno: v.colno
                };
              }
              if (I && a && g) {
                var d = I.Node.extend("Slice", {
                  fields: ["start", "stop", "step"],
                  init: function(v, x, M, E, T) {
                    M = M || new I.Literal(v, x, null), E = E || new I.Literal(v, x, null), T = T || new I.Literal(v, x, 1), this.parent(v, x, M, E, T);
                  }
                });
                a.prototype.assertType = function(v) {
                  v instanceof d || m.apply(this, arguments);
                }, a.prototype.compileSlice = function(v, x) {
                  this._emit("("), this._compileExpression(v.start, x), this._emit("),("), this._compileExpression(v.stop, x), this._emit("),("), this._compileExpression(v.step, x), this._emit(")");
                }, g.prototype.parseAggregate = function() {
                  var v = this, x = h(this.tokens);
                  x.colno--, x.index--;
                  try {
                    return c.apply(this);
                  } catch (U) {
                    var M = h(this.tokens), E = function() {
                      return A._assign(v.tokens, M), U;
                    };
                    A._assign(this.tokens, x), this.peeked = !1;
                    var T = this.peekToken();
                    if (T.type !== l.TOKEN_LEFT_BRACKET)
                      throw E();
                    this.nextToken();
                    for (var R = new d(T.lineno, T.colno), L = !1, D = 0; D <= R.fields.length && !this.skip(l.TOKEN_RIGHT_BRACKET); D++) {
                      if (D === R.fields.length)
                        if (L)
                          this.fail("parseSlice: too many slice components", T.lineno, T.colno);
                        else
                          break;
                      if (this.skip(l.TOKEN_COLON))
                        L = !0;
                      else {
                        var G = R.fields[D];
                        R[G] = this.parseExpression(), L = this.skip(l.TOKEN_COLON) || L;
                      }
                    }
                    if (!L)
                      throw E();
                    return new I.Array(T.lineno, T.colno, [R]);
                  }
                };
              }
              function S(v, x, M, E) {
                v = v || [], x === null && (x = E < 0 ? v.length - 1 : 0), M === null ? M = E < 0 ? -1 : v.length : M < 0 && (M += v.length), x < 0 && (x += v.length);
                for (var T = [], R = x; !(R < 0 || R > v.length || E > 0 && R >= M || E < 0 && R <= M); R += E)
                  T.push(o.memberLookup(v, R));
                return T;
              }
              function w(v, x) {
                return Object.prototype.hasOwnProperty.call(v, x);
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
                  for (var x = 0; x < this.length; x++)
                    if (this[x] === v)
                      return this.splice(x, 1);
                  throw new Error("ValueError");
                },
                count: function(v) {
                  for (var x = 0, M = 0; M < this.length; M++)
                    this[M] === v && x++;
                  return x;
                },
                index: function(v) {
                  var x;
                  if ((x = this.indexOf(v)) === -1)
                    throw new Error("ValueError");
                  return x;
                },
                find: function(v) {
                  return this.indexOf(v);
                },
                insert: function(v, x) {
                  return this.splice(v, 0, x);
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
                get: function(v, x) {
                  var M = this[v];
                  return M === void 0 && (M = x), M;
                },
                has_key: function(v) {
                  return w(this, v);
                },
                pop: function(v, x) {
                  var M = this[v];
                  if (M === void 0 && x !== void 0)
                    M = x;
                  else {
                    if (M === void 0)
                      throw new Error("KeyError");
                    delete this[v];
                  }
                  return M;
                },
                popitem: function() {
                  var v = A.keys(this);
                  if (!v.length)
                    throw new Error("KeyError");
                  var x = v[0], M = this[x];
                  return delete this[x], [x, M];
                },
                setdefault: function(v, x) {
                  return x === void 0 && (x = null), v in this || (this[v] = x), this[v];
                },
                update: function(v) {
                  return A._assign(this, v), null;
                }
              };
              return y.iteritems = y.items, y.itervalues = y.values, y.iterkeys = y.keys, o.memberLookup = function(v, x, M) {
                return arguments.length === 4 ? S.apply(this, arguments) : (v = v || {}, A.isArray(v) && w(f, x) ? f[x].bind(v) : A.isObject(v) && w(y, x) ? y[x].bind(v) : p.apply(this, arguments));
              }, C;
            }
            e.exports = s;
          })
          /******/
        ])
      );
    });
  })(ts)), ts.exports;
}
var uC = CC();
const hC = /* @__PURE__ */ lC(uC);
function fC(i) {
  const t = {};
  for (const [n, r] of Object.entries(i.templates))
    t[n] = hC.compile(r);
  const e = (n) => {
    n.result = {};
    for (const r of Object.keys(i.templates))
      n.result[r] = t[r].render(n.properties || {});
  };
  return "features" in i.geojson ? i.geojson.features.forEach(e) : e(i.geojson), i.geojson;
}
const dC = {
  templateExtractor: fC
}, pC = /\{%-?\s*(raw|verbatim)\s*-?%\}[\s\S]*?\{%-?\s*end\1\s*-?%\}/g, mC = /<%[\s\S]*?%>/, yC = /\$\{[^}]*\}/, vC = 'MaplatApp: poiTemplate/iconTemplate written in the lodash.template syntax (<% %>, <%= %>, <%- %>, ${ }) is no longer evaluated since @maplat/core 1.3.0, and was ignored. Rewrite it in the Nunjucks syntax ({{ }}, {% %}); wrap literal "<%" or "${" in {% raw %}...{% endraw %}.', wC = 'See the "Removed" section of the 1.3.0 CHANGELOG: https://github.com/code4history/MaplatCore/blob/master/CHANGELOG.md';
let Vo = !1, Wo = !1;
function ya(i) {
  return Array.from(i).slice(0, 80).join("");
}
function bC(i) {
  const t = i.replace(pC, "");
  return mC.test(t) || yC.test(t);
}
function EC(i, t) {
  Vo || (Vo = !0, console.warn(`${vC} First template found (${i}): "${ya(t)}". ${wC}`));
}
function es(i, t) {
  if (Wo) return;
  Wo = !0;
  const n = (t instanceof Error ? t.message : String(t)).split(`
`).map((r) => r.trim()).filter((r) => r).join(" ");
  console.warn(`MaplatApp: a poiTemplate/iconTemplate failed to render and was ignored: ${n}. First template: "${ya(i)}".`);
}
function va(i, t, e) {
  if (bC(t)) {
    EC(i, t);
    return;
  }
  try {
    const n = { type: "Feature", geometry: null, properties: e };
    return dC.templateExtractor({ geojson: n, templates: { t } }), n.result.t;
  } catch (n) {
    es(t, n);
    return;
  }
}
function xC(i, t) {
  const e = va("iconTemplate", i, t);
  if (e === void 0) return;
  let n;
  try {
    n = JSON.parse(e);
  } catch (r) {
    es(i, r);
    return;
  }
  if (n === null || typeof n != "object" || Array.isArray(n)) {
    es(i, new Error("iconTemplate did not produce a JSON object"));
    return;
  }
  return n;
}
function Ho(i, ...t) {
  const e = he(Object.assign({}, i));
  if (e.icon) return e;
  const n = t.reduce((r, s) => {
    if (r) return r;
    const o = s.iconTemplate, A = o ? xC(o, e) : void 0;
    if (A)
      return A;
    if (s.icon)
      return {
        icon: s.icon,
        selectedIcon: s.selectedIcon
      };
  }, void 0);
  return n && (e.icon = n.icon, e.selectedIcon = n.selectedIcon), e;
}
function Qo(i, ...t) {
  return i = he(i), i.html ? i : t.reduce((e, n) => {
    if (e) return e;
    const r = n.poiTemplate;
    if (r) {
      const s = va("poiTemplate", r, i);
      return s === void 0 ? void 0 : (i.html = s, i.poiStyle = i.poiStyle || n.poiStyle, i);
    }
  }, void 0) || i;
}
const kt = {
  ACCURACY: "accuracy",
  ALTITUDE: "altitude",
  ALTITUDE_ACCURACY: "altitudeAccuracy",
  HEADING: "heading",
  POSITION: "position",
  SPEED: "speed",
  TRACKING: "tracking",
  TRACKING_OPTIONS: "trackingOptions"
}, MC = {
  ERROR: "error"
};
class SC extends Te {
  code;
  message;
  constructor(t) {
    super(MC.ERROR), this.code = t.code, this.message = t.message;
  }
}
class TC extends Tn {
  task_id_;
  timer_base_ = !1;
  home_position_ = !1;
  constructor(t) {
    super(), t = t || {}, this.timer_base_ = t.timerBase !== void 0 ? t.timerBase : !1, this.task_id_ = void 0, this.home_position_ = t.homePosition !== void 0 ? t.homePosition : !1, this.addChangeListener(kt.TRACKING, this.handleTrackingChanged_), t.trackingOptions !== void 0 ? this.setTrackingOptions(t.trackingOptions) : this.setTrackingOptions({
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
      longitude: Mr(this.home_position_[0], 0.05),
      latitude: Mr(this.home_position_[1], 0.05),
      accuracy: Mr(15, 10)
    };
    this.positionChange_({ coords: t });
  }
  positionChange_(t) {
    const e = t.coords;
    this.set(kt.ACCURACY, e.accuracy), this.set(
      kt.ALTITUDE,
      e.altitude === null ? void 0 : e.altitude
    ), this.set(
      kt.ALTITUDE_ACCURACY,
      e.altitudeAccuracy === null ? void 0 : e.altitudeAccuracy
    ), this.set(
      kt.HEADING,
      e.heading === null ? void 0 : yn(e.heading)
    ), this.set(kt.POSITION, [e.longitude, e.latitude]), this.set(kt.SPEED, e.speed === null ? void 0 : e.speed), this.changed();
  }
  timerPositionError_() {
    const t = Math.floor(Math.random() * 3) + 1, e = {
      code: t,
      message: t === 1 ? "User denied Geolocation" : t === 2 ? "Position unavailable" : "Timeout expired"
    };
    this.positionError_(e);
  }
  positionError_(t) {
    const e = new SC(t);
    this.dispatchEvent(e);
  }
  getAccuracy() {
    return this.get(kt.ACCURACY);
  }
  getAltitude() {
    return this.get(kt.ALTITUDE);
  }
  getAltitudeAccuracy() {
    return this.get(kt.ALTITUDE_ACCURACY);
  }
  getHeading() {
    return this.get(kt.HEADING);
  }
  getPosition() {
    return this.get(kt.POSITION);
  }
  getSpeed() {
    return this.get(kt.SPEED);
  }
  getTracking() {
    return this.get(kt.TRACKING);
  }
  getTrackingOptions() {
    return this.get(kt.TRACKING_OPTIONS);
  }
  setTracking(t) {
    this.set(kt.TRACKING, t);
  }
  setTrackingOptions(t) {
    this.set(kt.TRACKING_OPTIONS, t);
  }
}
function Yo(i, t) {
  (t == null || t > i.length) && (t = i.length);
  for (var e = 0, n = Array(t); e < t; e++) n[e] = i[e];
  return n;
}
function RC(i) {
  if (Array.isArray(i)) return i;
}
function PC(i, t) {
  var e = i == null ? null : typeof Symbol < "u" && i[Symbol.iterator] || i["@@iterator"];
  if (e != null) {
    var n, r, s, o, A = [], a = !0, g = !1;
    try {
      if (s = (e = e.call(i)).next, t !== 0) for (; !(a = (n = s.call(e)).done) && (A.push(n.value), A.length !== t); a = !0) ;
    } catch (I) {
      g = !0, r = I;
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
function kC() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function _C(i, t) {
  return RC(i) || PC(i, t) || OC(i, t) || kC();
}
function OC(i, t) {
  if (i) {
    if (typeof i == "string") return Yo(i, t);
    var e = {}.toString.call(i).slice(8, -1);
    return e === "Object" && i.constructor && (e = i.constructor.name), e === "Map" || e === "Set" ? Array.from(i) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Yo(i, t) : void 0;
  }
}
const wa = Object.entries, Ko = Object.setPrototypeOf, LC = Object.isFrozen, ba = Object.getPrototypeOf, Ea = Object.getOwnPropertyDescriptor;
let Pt = Object.freeze, Dt = Object.seal, fn = Object.create, xa = typeof Reflect < "u" && Reflect, ns = xa.apply, is = xa.construct;
Pt || (Pt = function(t) {
  return t;
});
Dt || (Dt = function(t) {
  return t;
});
ns || (ns = function(t, e) {
  for (var n = arguments.length, r = new Array(n > 2 ? n - 2 : 0), s = 2; s < n; s++) r[s - 2] = arguments[s];
  return t.apply(e, r);
});
is || (is = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) n[r - 1] = arguments[r];
  return new t(...n);
});
const we = vt(Array.prototype.forEach), DC = vt(Array.prototype.lastIndexOf), Jo = vt(Array.prototype.pop), Fn = vt(Array.prototype.push), BC = vt(Array.prototype.slice), NC = vt(Array.prototype.splice), bn = Array.isArray, Sr = Ma(Set), Tr = vt(Set.prototype.add), jn = vt(Set.prototype.has), Xe = vt(String.prototype.toLowerCase), Rr = vt(String.prototype.toString), qo = vt(String.prototype.match), Un = vt(String.prototype.replace), $o = vt(String.prototype.indexOf), GC = vt(String.prototype.trim), FC = vt(Number.prototype.toString), jC = vt(Boolean.prototype.toString), tA = typeof BigInt > "u" ? null : vt(BigInt.prototype.toString), eA = typeof Symbol > "u" ? null : vt(Symbol.prototype.toString), Kt = vt(Object.prototype.hasOwnProperty), zn = vt(Object.prototype.toString), _t = vt(RegExp.prototype.test), be = Ma(TypeError);
function vt(i) {
  return function(t) {
    t instanceof RegExp && (t.lastIndex = 0);
    for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) n[r - 1] = arguments[r];
    return ns(i, t, n);
  };
}
function Ma(i) {
  return function() {
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
    return is(i, e);
  };
}
function Ct(i, t) {
  let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Xe;
  if (Ko && Ko(i, null), !bn(t)) return i;
  let n = t.length;
  for (; n--; ) {
    let r = t[n];
    if (typeof r == "string") {
      const s = e(r);
      s !== r && (LC(t) || (t[n] = s), r = s);
    }
    i[r] = !0;
  }
  return i;
}
function UC(i) {
  for (let t = 0; t < i.length; t++) Kt(i, t) || (i[t] = null);
  return i;
}
function qt(i) {
  const t = fn(null);
  for (const n of wa(i)) {
    var e = _C(n, 2);
    const r = e[0], s = e[1];
    Kt(i, r) && (bn(s) ? t[r] = UC(s) : s && typeof s == "object" && s.constructor === Object ? t[r] = qt(s) : t[r] = s);
  }
  return t;
}
function zC(i) {
  switch (typeof i) {
    case "string":
      return i;
    case "number":
      return FC(i);
    case "boolean":
      return jC(i);
    case "bigint":
      return tA ? tA(i) : "0";
    case "symbol":
      return eA ? eA(i) : "Symbol()";
    case "undefined":
      return zn(i);
    case "function":
    case "object": {
      if (i === null) return zn(i);
      const t = i, e = ne(t, "toString");
      if (typeof e == "function") {
        const n = e(t);
        return typeof n == "string" ? n : zn(n);
      }
      return zn(i);
    }
    default:
      return zn(i);
  }
}
function ne(i, t) {
  for (; i !== null; ) {
    const n = Ea(i, t);
    if (n) {
      if (n.get) return vt(n.get);
      if (typeof n.value == "function") return vt(n.value);
    }
    i = ba(i);
  }
  function e() {
    return null;
  }
  return e;
}
function XC(i, t) {
  for (; i !== null; ) {
    const e = Ea(i, t);
    if (e) return e.get ? vt(e.get) : null;
    i = ba(i);
  }
  return null;
}
function ZC(i) {
  try {
    return _t(i, ""), !0;
  } catch {
    return !1;
  }
}
const nA = Pt([
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
]), Pr = Pt([
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
]), kr = Pt([
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
]), VC = Pt([
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
]), _r = Pt([
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
]), WC = Pt([
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
]), iA = Pt(["#text"]), rA = Pt([
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
]), Or = Pt([
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
]), sA = Pt([
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
]), Ti = Pt([
  "xlink:href",
  "xml:id",
  "xlink:title",
  "xml:space",
  "xmlns:xlink"
]), HC = Dt(/{{[\w\W]*|^[\w\W]*}}/g), QC = Dt(/<%[\w\W]*|^[\w\W]*%>/g), YC = Dt(/\${[\w\W]*/g), KC = Dt(/^data-[\-\w.\u00B7-\uFFFF]+$/), JC = Dt(/^aria-[\-\w]+$/), oA = Dt(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), qC = Dt(/^(?:\w+script|data):/i), $C = Dt(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), tu = Dt(/^html$/i), eu = Dt(/^[a-z][.\w]*(-[.\w]+)+$/i), Lr = Dt(/<[/\w!]/g), AA = Dt(/<[/\w]/g), nu = Dt(/<\/no(script|embed|frames)/i), aA = Dt(/\/>/i), xt = {
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
}, iu = Pt(Ct({}, [
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
])), ru = function() {
  return typeof window > "u" ? null : window;
}, su = function(t, e) {
  if (typeof t != "object" || typeof t.createPolicy != "function") return null;
  let n = null;
  const r = "data-tt-policy-suffix";
  e && e.hasAttribute(r) && (n = e.getAttribute(r));
  const s = "dompurify" + (n ? "#" + n : "");
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
}, gA = function() {
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
}, Le = function(t, e, n, r) {
  return Kt(t, e) && bn(t[e]) ? Ct(r.base ? qt(r.base) : {}, t[e], r.transform) : n;
}, Dr = function(t, e, n) {
  const r = Kt(t, e) ? t[e] : void 0;
  return r && typeof r == "object" ? qt(r) : n();
};
function Sa() {
  let i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ru();
  const t = (z) => Sa(z);
  if (t.version = "3.4.17", t.removed = [], !i || !i.document || i.document.nodeType !== xt.document || !i.Element)
    return t.isSupported = !1, t;
  let e = i.document;
  const n = e, r = n.currentScript;
  i.DocumentFragment;
  const s = i.HTMLTemplateElement, o = i.Node, A = i.Element, a = i.NodeFilter;
  i.NamedNodeMap === void 0 && (i.NamedNodeMap || i.MozNamedAttrMap), i.HTMLFormElement;
  const g = i.DOMParser, I = i.trustedTypes, l = A.prototype, u = ne(l, "cloneNode"), p = ne(l, "remove"), m = ne(l, "removeAttributeNode"), c = ne(l, "nextSibling"), C = ne(l, "childNodes"), h = ne(l, "parentNode"), d = ne(l, "shadowRoot"), S = ne(l, "attributes"), w = o && o.prototype ? ne(o.prototype, "nodeType") : null, f = o && o.prototype ? ne(o.prototype, "nodeName") : null, y = o && o.prototype ? ne(o.prototype, "ownerDocument") : null, v = function(b) {
    return w ? w(b) : b.nodeType;
  }, x = function(b) {
    return f ? f(b) : b.nodeName;
  }, M = XC(l, "namespaceURI"), E = function(b) {
    return M ? M(b) : b.namespaceURI;
  };
  if (typeof s == "function") {
    const z = e.createElement("template");
    z.content && z.content.ownerDocument && (e = z.content.ownerDocument);
  }
  let T, R = "", L, D = !1, G = 0;
  const U = function() {
    if (G > 0) throw be('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, P = function(b) {
    U(), G++;
    try {
      return T.createHTML(b);
    } finally {
      G--;
    }
  }, N = function(b) {
    U(), G++;
    try {
      return T.createScriptURL(b);
    } finally {
      G--;
    }
  }, O = function() {
    return D || (L = su(I, r), D = !0), L;
  }, X = e, Z = X.implementation, V = X.createNodeIterator, st = X.createDocumentFragment, rt = X.getElementsByTagName, At = n.importNode;
  let nt = gA();
  t.isSupported = typeof wa == "function" && typeof h == "function" && Z && Z.createHTMLDocument !== void 0;
  const pt = HC, at = QC, Q = YC, J = KC, Y = JC, mt = qC, Bt = $C, te = eu;
  let yt = oA, ht = null;
  const _ = Ct({}, [
    ...nA,
    ...Pr,
    ...kr,
    ..._r,
    ...iA
  ]);
  let B = null;
  const W = Ct({}, [
    ...rA,
    ...Or,
    ...sA,
    ...Ti
  ]);
  let H = Object.seal(fn(null, {
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
  const gt = Object.seal(fn(null, {
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
  let ot = !0, wt = !0, Mt = !1, Ut = !0, se = !1, pe = !0, me = !1, kn = !1, $e = null, Re = null, _n = !1, Jt = !1, ge = !1, K = !1, $ = !0, It = !1;
  const ct = "user-content-";
  let ut = !0, bt = !1, St = null, ee = {}, ye = null;
  const je = Ct({}, [
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
  let gi = null;
  const ci = Ct({}, [
    "audio",
    "video",
    "img",
    "source",
    "image",
    "track"
  ]);
  let tn = null;
  const Ss = Ct({}, [
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
  ]), li = "http://www.w3.org/1998/Math/MathML", Ii = "http://www.w3.org/2000/svg", ce = "http://www.w3.org/1999/xhtml";
  let en = ce, Ki = !1, Ji = null;
  const Pa = Ct({}, [
    li,
    Ii,
    ce
  ], Rr), Ts = Pt([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext"
  ]);
  let qi = Ct({}, Ts);
  const Rs = Pt(["annotation-xml"]);
  let $i = Ct({}, Rs);
  const ka = Ct({}, [
    "title",
    "style",
    "font",
    "a",
    "script"
  ]);
  let On = null;
  const _a = ["application/xhtml+xml", "text/html"], Oa = "text/html";
  let Et = null, nn = null;
  const La = e.createElement("form"), Ps = function(b) {
    return b instanceof RegExp || b instanceof Function;
  }, tr = function() {
    let b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (nn && nn === b) return;
    (!b || typeof b != "object") && (b = {}), b = qt(b), On = _a.indexOf(b.PARSER_MEDIA_TYPE) === -1 ? Oa : b.PARSER_MEDIA_TYPE, Et = On === "application/xhtml+xml" ? Rr : Xe, ht = Le(b, "ALLOWED_TAGS", _, { transform: Et }), B = Le(b, "ALLOWED_ATTR", W, { transform: Et }), Ji = Le(b, "ALLOWED_NAMESPACES", Pa, { transform: Rr }), tn = Le(b, "ADD_URI_SAFE_ATTR", Ss, {
      transform: Et,
      base: Ss
    }), gi = Le(b, "ADD_DATA_URI_TAGS", ci, {
      transform: Et,
      base: ci
    }), ye = Le(b, "FORBID_CONTENTS", je, { transform: Et }), it = Le(b, "FORBID_TAGS", qt({}), { transform: Et }), tt = Le(b, "FORBID_ATTR", qt({}), { transform: Et }), ee = Kt(b, "USE_PROFILES") ? b.USE_PROFILES && typeof b.USE_PROFILES == "object" ? qt(b.USE_PROFILES) : b.USE_PROFILES : !1, ot = b.ALLOW_ARIA_ATTR !== !1, wt = b.ALLOW_DATA_ATTR !== !1, Mt = b.ALLOW_UNKNOWN_PROTOCOLS || !1, Ut = b.ALLOW_SELF_CLOSE_IN_ATTR !== !1, se = b.SAFE_FOR_TEMPLATES || !1, pe = b.SAFE_FOR_XML !== !1, me = b.WHOLE_DOCUMENT || !1, Jt = b.RETURN_DOM || !1, ge = b.RETURN_DOM_FRAGMENT || !1, K = b.RETURN_TRUSTED_TYPE || !1, _n = b.FORCE_BODY || !1, $ = b.SANITIZE_DOM !== !1, It = b.SANITIZE_NAMED_PROPS || !1, ut = b.KEEP_CONTENT !== !1, bt = b.IN_PLACE || !1, yt = ZC(b.ALLOWED_URI_REGEXP) ? b.ALLOWED_URI_REGEXP : oA, en = typeof b.NAMESPACE == "string" ? b.NAMESPACE : ce, qi = Dr(b, "MATHML_TEXT_INTEGRATION_POINTS", () => Ct({}, Ts)), $i = Dr(b, "HTML_INTEGRATION_POINTS", () => Ct({}, Rs));
    const k = Dr(b, "CUSTOM_ELEMENT_HANDLING", () => fn(null));
    if (H = fn(null), Kt(k, "tagNameCheck") && Ps(k.tagNameCheck) && (H.tagNameCheck = k.tagNameCheck), Kt(k, "attributeNameCheck") && Ps(k.attributeNameCheck) && (H.attributeNameCheck = k.attributeNameCheck), Kt(k, "allowCustomizedBuiltInElements") && typeof k.allowCustomizedBuiltInElements == "boolean" && (H.allowCustomizedBuiltInElements = k.allowCustomizedBuiltInElements), Dt(H), se && (wt = !1), ge && (Jt = !0), ee && (ht = Ct({}, iA), B = fn(null), ee.html === !0 && (Ct(ht, nA), Ct(B, rA)), ee.svg === !0 && (Ct(ht, Pr), Ct(B, Or), Ct(B, Ti)), ee.svgFilters === !0 && (Ct(ht, kr), Ct(B, Or), Ct(B, Ti)), ee.mathMl === !0 && (Ct(ht, _r), Ct(B, sA), Ct(B, Ti))), gt.tagCheck = null, gt.attributeCheck = null, Kt(b, "ADD_TAGS") && (typeof b.ADD_TAGS == "function" ? gt.tagCheck = b.ADD_TAGS : bn(b.ADD_TAGS) && (ht === _ && (ht = qt(ht)), Ct(ht, b.ADD_TAGS, Et))), Kt(b, "ADD_ATTR") && (typeof b.ADD_ATTR == "function" ? gt.attributeCheck = b.ADD_ATTR : bn(b.ADD_ATTR) && (B === W && (B = qt(B)), Ct(B, b.ADD_ATTR, Et))), Kt(b, "ADD_FORBID_CONTENTS") && bn(b.ADD_FORBID_CONTENTS) && (ye === je && (ye = qt(ye)), Ct(ye, b.ADD_FORBID_CONTENTS, Et)), ut && (ht["#text"] = !0), me && Ct(ht, [
      "html",
      "head",
      "body"
    ]), ht.table && (Ct(ht, ["tbody"]), delete it.tbody), b.TRUSTED_TYPES_POLICY) {
      if (typeof b.TRUSTED_TYPES_POLICY.createHTML != "function") throw be('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof b.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw be('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const F = T;
      T = b.TRUSTED_TYPES_POLICY;
      try {
        R = P("");
      } catch (j) {
        throw T = F, j;
      }
    } else b.TRUSTED_TYPES_POLICY === null ? (T = void 0, R = "") : (T === void 0 && (T = O()), T && typeof R == "string" && (R = P("")));
    Pt && Pt(b), nn = b;
  }, ks = Ct({}, [
    ...Pr,
    ...kr,
    ...VC
  ]), _s = Ct({}, [..._r, ...WC]), Da = function(b, k, F) {
    return k.namespaceURI === ce ? b === "svg" : k.namespaceURI === li ? b === "svg" && (F === "annotation-xml" || qi[F]) : !!ks[b];
  }, Ba = function(b, k, F) {
    return k.namespaceURI === ce ? b === "math" : k.namespaceURI === Ii ? b === "math" && $i[F] : !!_s[b];
  }, Na = function(b, k, F) {
    return k.namespaceURI === Ii && !$i[F] || k.namespaceURI === li && !qi[F] ? !1 : !_s[b] && (ka[b] || !ks[b]);
  }, Ga = function(b) {
    const k = E(b), F = Xe(x(b)), j = h(b);
    let q, et;
    return j && v(j) === xt.element ? (q = { namespaceURI: E(j) }, et = Xe(x(j))) : (q = { namespaceURI: en }, et = "template"), Ji[k] ? k === Ii ? Da(F, q, et) : k === li ? Ba(F, q, et) : k === ce ? Na(F, q, et) : !!(On === "application/xhtml+xml" && Ji[k]) : !1;
  }, Pe = function(b) {
    Fn(t.removed, { element: b });
    try {
      h(b).removeChild(b);
    } catch {
      if (p(b), !h(b)) throw be("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, Os = function(b, k, F) {
    try {
      m(b, k);
    } catch {
      try {
        b.removeAttribute(F);
      } catch {
      }
    }
  }, er = function(b) {
    ir(b);
    const k = C(b);
    k && we(BC(k), (j) => {
      try {
        p(j);
      } catch {
      }
    });
    const F = v(b) === xt.element ? S(b) : null;
    if (F) for (let j = F.length - 1; j >= 0; --j) {
      const q = F[j], et = q && q.name;
      typeof et == "string" && Os(b, q, et);
    }
  }, rn = function(b, k, F) {
    if (!F) try {
      F = k.getAttributeNode(b);
    } catch {
      F = null;
    }
    Fn(t.removed, {
      attribute: F || null,
      from: k
    });
    try {
      F ? m(k, F) : k.removeAttribute(b);
    } catch {
      try {
        k.removeAttribute(b);
      } catch {
      }
    }
    if (b === "is")
      if (Jt || ge) try {
        Pe(k);
      } catch {
      }
      else try {
        k.setAttribute(b, "");
      } catch {
      }
  }, Ls = function(b) {
    const k = S(b);
    if (k)
      for (let F = k.length - 1; F >= 0; --F) {
        const j = k[F], q = j && j.name;
        typeof q != "string" || B[Et(q)] || Os(b, j, q);
      }
  }, nr = function(b, k) {
    let F = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
    const j = [b];
    for (; j.length > 0; ) {
      const q = j.pop();
      if (k(q) === !1) continue;
      if (F && v(q) === xt.element) {
        const lt = d(q);
        ke(lt) && j.push(lt);
      }
      const et = C(q);
      if (et) for (let lt = et.length - 1; lt >= 0; --lt) j.push(et[lt]);
    }
  }, ir = function(b) {
    nr(b, (k) => {
      v(k) === xt.element && Ls(k);
    });
  }, rr = function(b) {
    const k = [];
    return nr(b, (F) => {
      k.push(F);
    }, !0), k;
  }, Fa = function(b, k) {
    const F = Sr();
    we(rr(b), (j) => {
      v(j) === xt.element && Tr(F, j);
    }), we(k, (j) => {
      v(j) === xt.element && !jn(F, j) && Ls(j);
    });
  }, Ds = function(b, k) {
    let F = !1;
    return we(t.removed, (j) => {
      j.element && (F = F || j.element === b, ir(j.element));
    }), Fa(b, k), F;
  }, ja = 8, Ua = function(b, k) {
    const F = St;
    let j = null;
    const q = () => (j || (j = Sr(), we(k, (et) => {
      Tr(j, et);
    })), j);
    for (let et = 0; ; et++) {
      const lt = rr(b), Tt = [b];
      let le = !1;
      if (we(lt, (zt) => {
        v(zt) === xt.documentFragment ? Fn(Tt, zt) : !le && !jn(F, zt) && (le = jn(q(), zt));
      }), !le) return;
      if (et >= ja) throw be("the tree kept changing during in-place sanitization; refusing to return it");
      we(Tt, (zt, Qt) => {
        za(zt, Qt > 0, b, q());
      });
    }
  }, za = function(b, k, F, j) {
    const q = sr(b);
    let et;
    for (; et = q.nextNode(); )
      !jn(j, et) || jn(St, et) || (k && oe(nt.uponSanitizeShadowNode, et, null), Ar(et, F), ar(et, F), ke(et.content) && Dn(et.content));
  }, Xa = function(b) {
    St && Tr(St, b);
  }, Bs = function(b, k) {
    return pe ? b === "patchsrc" ? !0 : b === "for" && k !== "label" && k !== "output" : !1;
  }, Za = function(b) {
    pe && nr(b, (k) => {
      const F = v(k);
      if (F === xt.processingInstruction || F === xt.comment && _t(AA, k.data)) {
        try {
          p(k);
        } catch {
        }
        return !1;
      }
      if (F === xt.element) {
        const j = k, q = Et(x(k));
        try {
          j.hasAttribute && j.hasAttribute("patchsrc") && j.removeAttribute("patchsrc"), j.hasAttribute && j.hasAttribute("for") && Bs("for", q) && j.removeAttribute("for");
        } catch {
        }
      }
      return !0;
    });
  }, Ns = function(b) {
    let k = null, F = null;
    if (_n) b = "<remove></remove>" + b;
    else {
      const et = qo(b, /^[\r\n\t ]+/);
      F = et && et[0];
    }
    On === "application/xhtml+xml" && en === ce && (b = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + b + "</body></html>");
    const j = T ? P(b) : b;
    if (en === ce) try {
      k = new g().parseFromString(j, On);
    } catch {
    }
    if (!k || !k.documentElement) {
      k = Z.createDocument(en, "template", null);
      try {
        k.documentElement.innerHTML = Ki ? R : j;
      } catch {
      }
    }
    const q = k.body || k.documentElement;
    return b && F && q.insertBefore(e.createTextNode(F), q.childNodes[0] || null), en === ce ? rt.call(k, me ? "html" : "body")[0] : me ? k.documentElement : q;
  }, sr = function(b) {
    const k = y ? y(b) : b.ownerDocument;
    return V.call(k || b, b, a.SHOW_ELEMENT | a.SHOW_COMMENT | a.SHOW_TEXT | a.SHOW_PROCESSING_INSTRUCTION | a.SHOW_CDATA_SECTION, null);
  }, Ci = function(b) {
    return b = Un(b, pt, " "), b = Un(b, at, " "), b = Un(b, Q, " "), b;
  }, or = function(b) {
    var k;
    Gs(b);
    const F = (k = b.querySelectorAll) === null || k === void 0 ? void 0 : k.call(b, "template");
    F && we(F, (j) => {
      ke(j.content) && or(j.content);
    });
  }, Gs = function(b) {
    b.normalize();
    const k = y ? y(b) : b.ownerDocument, F = V.call(k || b, b, a.SHOW_TEXT | a.SHOW_COMMENT | a.SHOW_CDATA_SECTION | a.SHOW_PROCESSING_INSTRUCTION, null);
    let j = F.nextNode();
    for (; j; )
      j.data = Ci(j.data), j = F.nextNode();
  }, ui = function(b) {
    const k = f ? f(b) : null;
    return typeof k != "string" || Et(k) !== "form" ? !1 : typeof b.nodeName != "string" || typeof b.textContent != "string" || typeof b.removeChild != "function" || b.attributes !== S(b) || typeof b.removeAttribute != "function" || typeof b.removeAttributeNode != "function" || typeof b.getAttributeNode != "function" || typeof b.setAttribute != "function" || typeof b.namespaceURI != "string" || typeof b.insertBefore != "function" || typeof b.hasChildNodes != "function" || b.nodeType !== w(b) || b.childNodes !== C(b);
  }, ke = function(b) {
    if (!w || typeof b != "object" || b === null) return !1;
    try {
      return w(b) === xt.documentFragment;
    } catch {
      return !1;
    }
  }, Ln = function(b) {
    if (!w || typeof b != "object" || b === null) return !1;
    try {
      return typeof w(b) == "number";
    } catch {
      return !1;
    }
  };
  function oe(z, b, k) {
    z.length !== 0 && we(z, (F) => {
      F.call(t, b, k, nn);
    });
  }
  const Va = function(b, k) {
    return !!(pe && b.hasChildNodes() && !Ln(b.firstElementChild) && _t(Lr, b.textContent) && _t(Lr, b.innerHTML) || pe && iu[k] && v(b) === xt.element && E(b) === ce && (Ln(b.firstElementChild) || typeof b.textContent == "string" && _t(Lr, b.textContent)) || b.nodeType === xt.processingInstruction || pe && b.nodeType === xt.comment && _t(AA, b.data));
  }, hi = function(b, k) {
    if (b instanceof RegExp) return _t(b, k);
    if (b instanceof Function) {
      for (var F = arguments.length, j = new Array(F > 2 ? F - 2 : 0), q = 2; q < F; q++) j[q - 2] = arguments[q];
      return !!b(k, ...j);
    }
    return !1;
  }, Wa = function(b, k, F) {
    if (!it[k] && Us(k) && hi(H.tagNameCheck, k)) return !1;
    if (ut && !ye[k] && !ye[Xe(k)]) {
      const j = h(b), q = C(b);
      if (q && j) {
        const et = q.length;
        for (let lt = et - 1; lt >= 0; --lt) {
          const Tt = b === F ? u(q[lt], !0) : q[lt];
          j.insertBefore(Tt, c(b));
        }
      }
    }
    return Pe(b), !0;
  }, Fs = function(b, k, F, j) {
    return b.length === 0 ? k : k === F || k === j ? qt(k) : k;
  }, sn = function(b, k) {
    return b === k || h(b) !== null ? !1 : (bt && ir(b), !0);
  }, Ar = function(b, k) {
    if (Xa(b), oe(nt.beforeSanitizeElements, b, null), sn(b, k)) return !0;
    if (ui(b))
      return Pe(b), !0;
    const F = Et(x(b));
    if (ht = Fs(nt.uponSanitizeElement, ht, _, $e), oe(nt.uponSanitizeElement, b, {
      tagName: F,
      allowedTags: ht
    }), sn(b, k)) return !0;
    if (Va(b, F))
      return Pe(b), !0;
    if (it[F] || !(gt.tagCheck instanceof Function && gt.tagCheck(F)) && !ht[F]) {
      const j = Wa(b, F, k);
      return j === !1 && (oe(nt.afterSanitizeElements, b, null), sn(b, k)) ? !0 : j;
    }
    if (v(b) === xt.element && !Ga(b) || (F === "noscript" || F === "noembed" || F === "noframes") && _t(nu, b.innerHTML))
      return Pe(b), !0;
    if (se && b.nodeType === xt.text) {
      const j = Ci(b.textContent);
      b.textContent !== j && (Fn(t.removed, { element: b.cloneNode() }), b.textContent = j);
    }
    return oe(nt.afterSanitizeElements, b, null), sn(b, k);
  }, js = function(b, k, F) {
    if (tt[k] || Bs(k, b) || $ && (k === "id" || k === "name") && (F in e || F in La)) return !1;
    const j = B[k] || gt.attributeCheck instanceof Function && gt.attributeCheck(k, b);
    return wt && _t(J, k) || ot && _t(Y, k) ? !0 : j ? tn[k] || _t(yt, Un(F, Bt, "")) || (k === "src" || k === "xlink:href" || k === "href") && b !== "script" && $o(F, "data:") === 0 && gi[b] || Mt && !_t(mt, Un(F, Bt, "")) ? !0 : !F : Us(b) && hi(H.tagNameCheck, b) && hi(H.attributeNameCheck, k, b) || k === "is" && H.allowCustomizedBuiltInElements && hi(H.tagNameCheck, F);
  }, Ha = Ct({}, [
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "missing-glyph"
  ]), Us = function(b) {
    return !Ha[Xe(b)] && _t(te, b);
  }, Qa = function(b, k, F, j) {
    if (T && typeof I == "object" && typeof I.getAttributeType == "function" && !F) switch (I.getAttributeType(b, k)) {
      case "TrustedHTML":
        return P(j);
      case "TrustedScriptURL":
        return N(j);
    }
    return j;
  }, Ya = function(b, k, F, j) {
    try {
      return F ? b.setAttributeNS(F, k, j) : b.setAttribute(k, j), ui(b) ? (Pe(b), !1) : !0;
    } catch {
      return rn(k, b), !1;
    }
  }, zs = function(b, k) {
    return pe && _t(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, k) ? !0 : Xe(b) === "attributename" && qo(k, "href") !== null;
  }, ar = function(b, k) {
    if (oe(nt.beforeSanitizeAttributes, b, null), sn(b, k)) return;
    const F = b.attributes;
    if (!F || ui(b)) return;
    B = Fs(nt.uponSanitizeAttribute, B, W, Re);
    const j = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: B,
      forceKeepAttr: void 0
    };
    let q = F.length;
    const et = Et(b.nodeName);
    for (; q--; ) {
      const lt = F[q], Tt = lt.name, le = lt.namespaceURI, zt = lt.value, Qt = Et(Tt), on = zt;
      let Yt = Tt === "value" ? on : GC(on), Xs = !1;
      if (j.attrName = Qt, j.attrValue = Yt, j.keepAttr = !0, j.forceKeepAttr = void 0, oe(nt.uponSanitizeAttribute, b, j), Yt = j.attrValue, It && (Qt === "id" || Qt === "name") && $o(Yt, ct) !== 0 && (rn(Tt, b, lt), Yt = ct + Yt, Xs = !0), zs(Tt, Yt)) {
        rn(Tt, b, lt);
        continue;
      }
      if (!j.forceKeepAttr) {
        if (!j.keepAttr) {
          rn(Tt, b, lt);
          continue;
        }
        if (!Ut && _t(aA, Yt)) {
          rn(Tt, b, lt);
          continue;
        }
        if (se && (Yt = Ci(Yt)), !js(et, Qt, Yt)) {
          rn(Tt, b, lt);
          continue;
        }
        Yt = Qa(et, Qt, le, Yt), Yt !== on && Ya(b, Tt, le, Yt) && Xs && Jo(t.removed);
      }
    }
    oe(nt.afterSanitizeAttributes, b, null), sn(b, k);
  }, Dn = function(b) {
    let k = null;
    const F = sr(b);
    for (oe(nt.beforeSanitizeShadowDOM, b, null); k = F.nextNode(); )
      if (oe(nt.uponSanitizeShadowNode, k, null), Ar(k, b), ar(k, b), ke(k.content) && Dn(k.content), v(k) === xt.element) {
        const j = d(k);
        ke(j) && (gr(j), Dn(j));
      }
    se && Gs(b), oe(nt.afterSanitizeShadowDOM, b, null);
  }, gr = function(b) {
    const k = [{
      node: b,
      shadow: null
    }];
    for (; k.length > 0; ) {
      const F = k.pop();
      if (F.shadow) {
        Dn(F.shadow);
        continue;
      }
      const j = F.node, q = v(j) === xt.element, et = C(j);
      if (et) for (let lt = et.length - 1; lt >= 0; --lt) k.push({
        node: et[lt],
        shadow: null
      });
      if (q) {
        const lt = f ? f(j) : null;
        if (typeof lt == "string" && Et(lt) === "template") {
          const Tt = j.content;
          ke(Tt) && k.push({
            node: Tt,
            shadow: null
          });
        }
      }
      if (q) {
        const lt = d(j);
        ke(lt) && k.push({
          node: null,
          shadow: lt
        }, {
          node: lt,
          shadow: null
        });
      }
    }
  };
  return t.sanitize = function(z) {
    let b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, k = null, F = null, j = null, q = null;
    if (Ki = !z, Ki && (z = "<!-->"), typeof z != "string" && !Ln(z) && (z = zC(z), typeof z != "string"))
      throw be("dirty is not a string, aborting");
    if (!t.isSupported) return z;
    kn ? (ht = $e, B = Re) : tr(b), (nt.uponSanitizeElement.length > 0 || nt.uponSanitizeAttribute.length > 0) && (ht = qt(ht)), nt.uponSanitizeAttribute.length > 0 && (B = qt(B)), t.removed = [];
    const et = bt && typeof z != "string" && Ln(z);
    let lt = [];
    const Tt = St;
    if (et) {
      Za(z);
      const Qt = x(z);
      if (typeof Qt == "string") {
        const on = Et(Qt);
        if (!ht[on] || it[on])
          throw er(z), be("root node is forbidden and cannot be sanitized in-place");
      }
      if (ui(z))
        throw er(z), be("root node is clobbered and cannot be sanitized in-place");
      lt = rr(z), St = Sr();
    } else if (Ln(z))
      k = Ns("<!---->"), F = k.ownerDocument.importNode(z, !0), F.nodeType === xt.element && F.nodeName === "BODY" || F.nodeName === "HTML" ? k = F : k.appendChild(F), gr(k);
    else {
      if (!Jt && !se && !me && z.indexOf("<") === -1) return T && K ? P(z) : z;
      if (k = Ns(z), !k) return Jt ? null : K ? R : "";
    }
    k && _n && Pe(k.firstChild);
    const le = et ? z : k;
    try {
      et && gr(z);
      const Qt = sr(le);
      for (; j = Qt.nextNode(); )
        Ar(j, le), ar(j, le), ke(j.content) && Dn(j.content);
      et && Ua(z, lt);
    } catch (Qt) {
      throw et && (er(z), Ds(z, lt)), Qt;
    } finally {
      St = Tt;
    }
    if (et) {
      if (Ds(z, lt)) throw be("a node selected for removal could not be safely returned; refusing to sanitize in place");
      return se && or(z), z;
    }
    if (Jt) {
      if (se && or(k), ge)
        for (q = st.call(k.ownerDocument); k.firstChild; ) q.appendChild(k.firstChild);
      else q = k;
      return (B.shadowroot || B.shadowrootmode) && (q = At.call(n, q, !0)), q;
    }
    let zt = me ? k.outerHTML : k.innerHTML;
    return me && ht["!doctype"] && k.ownerDocument && k.ownerDocument.doctype && k.ownerDocument.doctype.name && _t(tu, k.ownerDocument.doctype.name) && (zt = "<!DOCTYPE " + k.ownerDocument.doctype.name + `>
` + zt), se && (zt = Ci(zt)), T && K ? P(zt) : zt;
  }, t.setConfig = function() {
    let z = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    tr(z), kn = !0, $e = ht, Re = B;
  }, t.clearConfig = function() {
    nn = null, kn = !1, $e = null, Re = null, T = L, R = "";
  }, t.isValidAttribute = function(z, b, k) {
    nn || tr({});
    const F = Et(z), j = Et(b);
    return typeof k == "string" && (zs(b, k) || !Ut && _t(aA, k)) ? !1 : js(F, j, k);
  }, t.addHook = function(z, b) {
    typeof b == "function" && Kt(nt, z) && Fn(nt[z], b);
  }, t.removeHook = function(z, b) {
    if (Kt(nt, z)) {
      if (b !== void 0) {
        const k = DC(nt[z], b);
        return k === -1 ? void 0 : NC(nt[z], k, 1)[0];
      }
      return Jo(nt[z]);
    }
  }, t.removeHooks = function(z) {
    Kt(nt, z) && (nt[z] = []);
  }, t.removeAllHooks = function() {
    nt = gA();
  }, t;
}
var Ta = Sa();
const ou = ["b", "strong", "i", "em", "u", "s", "br", "p", "span", "div", "ul", "ol", "li", "a", "img", "small", "sub", "sup", "code", "pre", "table", "thead", "tbody", "tr", "th", "td", "qy-swiper", "qy-swiper-slide"], Au = ["href", "src", "alt", "title", "class", "target", "rel", "width", "height"], au = { values: ["target", "rel", "width", "height"] }, gu = ["script", "style", "iframe", "object", "embed", "form", "input", "textarea", "link", "meta", "base"], cu = ["srcdoc", "style", "formaction", "xlink:href"], lu = { valueAttributes: ["image-url", "image-type", "thumbnail-url", "caption", "material-url", "camera-position", "camera-target", "show-texture"], booleanAttributes: ["fit-to-container", "debug-mode"], urlAttributes: ["image-url", "thumbnail-url", "material-url"], textAttributes: { values: ["caption"] } }, Iu = { booleanAttributes: ["has-thumb", "autoplay"] }, de = {
  tags: ou,
  attributes: Au,
  uriSafeAttributes: au,
  forbidTags: gu,
  forbidAttributes: cu,
  slide: lu,
  swiper: Iu
}, Cu = de.tags, uu = de.attributes, hu = /^(?:https?|mailto|tel|data):/i, fu = de.uriSafeAttributes.values, du = de.forbidTags, pu = de.forbidAttributes, mu = /^data:image\/(png|jpeg|gif|webp|avif);/i, cA = (i) => !!i && /^\s*data:/i.test(i);
function yu(i) {
  if (i.tagName === "A" && i.getAttribute("target") === "_blank" && i.setAttribute("rel", "noopener noreferrer"), i.tagName === "IMG") {
    const e = i.getAttribute("src");
    cA(e) && !mu.test(e.trim()) && i.removeAttribute("src"), i.hasAttribute("srcset") && i.removeAttribute("srcset");
  } else
    for (const e of ["src", "href", "xlink:href"])
      cA(i.getAttribute(e)) && i.removeAttribute(e);
}
let un;
function vu() {
  if (un) return un;
  const i = globalThis.window;
  if (!i)
    throw new Error(
      "sanitizeHtml: window の無い環境では使用できません（DOMPurify の初期化に必要）"
    );
  return un = Ta(i), un.addHook("afterSanitizeAttributes", yu), un.addHook("uponSanitizeAttribute", bu), un;
}
let Ri;
function wu() {
  if (Ri) return Ri;
  const i = globalThis.window;
  if (!i)
    throw new Error(
      "sanitizeHtml: window の無い環境では使用できません（DOMPurify の初期化に必要）"
    );
  return Ri = Ta(i), Ri;
}
function bu(i, t) {
  const e = i.nodeName.toLowerCase(), n = t.attrName;
  if (e === "qy-swiper-slide") {
    const r = Ms.has(n) ? "" : Ra(n, t.attrValue);
    if (r === null) {
      t.keepAttr = !1;
      return;
    }
    i.setAttribute(n, r), t.forceKeepAttr = !0;
    return;
  }
  e === "qy-swiper" && (Su.has(n) ? (i.setAttribute(n, ""), t.forceKeepAttr = !0) : t.keepAttr = !1);
}
function Wu(i) {
  return i == null ? "" : vu().sanitize(String(i), {
    ALLOWED_TAGS: Cu,
    ALLOWED_ATTR: uu,
    ALLOWED_URI_REGEXP: hu,
    ADD_URI_SAFE_ATTR: fu,
    FORBID_TAGS: du,
    FORBID_ATTR: pu,
    ALLOW_DATA_ATTR: !1,
    // 禁止タグを落としても中身のテキストは残す（実データの可読性を保つ）
    KEEP_CONTENT: !0
  });
}
function Eu(i) {
  return i == null ? "" : String(i).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function xu(i) {
  if (i == null) return "";
  const t = wu().sanitize(String(i), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: !0
  }), e = globalThis.window.document.createElement("div");
  return e.innerHTML = t, e.textContent || "";
}
const Mu = new Set(de.slide.valueAttributes), Ms = new Set(de.slide.booleanAttributes), Su = new Set(de.swiper.booleanAttributes), Tu = new Set(de.slide.textAttributes.values), Ru = new Set(de.slide.urlAttributes), Pu = (i) => /^(?:https?:)?\/\/|^\/|^[^:]*$/i.test(i.trim()), ku = /["'`<>\s]/;
function Ra(i, t) {
  if (Ms.has(i)) return t ? "" : null;
  if (!Mu.has(i) || t == null) return null;
  let e = String(t);
  return Ru.has(i) && (!Pu(e) || ku.test(e)) ? null : (Tu.has(i) && (e = xu(e)), e);
}
function Hu(i) {
  const t = [];
  for (const [e, n] of Object.entries(i || {})) {
    const r = String(e).toLowerCase(), s = Ra(r, n);
    s !== null && t.push(Ms.has(r) ? r : `${r}="${Eu(s)}"`);
  }
  return t.join(" ");
}
const _u = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjcyNTIxMjZFMDJBMTExRTBCOTNGRTVBRkM1QzM1Qjc5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjcyNTIxMjZGMDJBMTExRTBCOTNGRTVBRkM1QzM1Qjc5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzI1MjEyNkMwMkExMTFFMEI5M0ZFNUFGQzVDMzVCNzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzI1MjEyNkQwMkExMTFFMEI5M0ZFNUFGQzVDMzVCNzkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4RaveOAAAB1UlEQVR42qzUTyikcRzH8d+OsUNbSOTvgW2LREqjHKSk9FjZxAGXlXJQDsqNokRzcebiRC5mT8tllBE7LlzYKBHFJpKMkD+7hvH+6ftMT4M0Y3/1uswzz+d5nu/3+/t9CAaD6n8uu/L5lHK5XroWjwI4kYWP8GMdv3H47A6nk8CDA6U8nvBLX/Ed+TjDEe7lAS24wE+M4zR0180NgXa7NSgOvajHKvqwZglMxBfUoBmVlv/wTXxU0O1WuoqIgQvLaIJDfn9NISbhRd7Tb4ahbJa3a0QthjCFv2/UfwNduJKv0jUOBSajDb8wE0FTdf1GUAzDGliOdExEMSleedsGxJiBZdiVC5GuABbxGZm2p1lUKg1/dOOjnGf9IglIsUkxY3H+jg1yIc136MBb6WjqOwLNe6904AP2kSuDG80qkW15YjZlCdkojSLsEyqwiWMzcAVbaJV6RrK+IQc/dB3NwGuMohAdEYQVoROz8FkHW68FCW1Hv4zS68eeUnWyS/YwLL1Q9rA/jsn4dEtd5mRo9WlzJ03Tda6S7TaPQWmIPCkQCH+6Ww5RfR5WowmX+IckOca2MYBp2SmW8zCb5hpGeKjuWA8yZEulSbP8sqN2JPjZif0owACin4C7wCjG6AAAAABJRU5ErkJggg==", Ou = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAwCAYAAAALiLqjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAHkUlEQVR42oyWa6hdRxXHf2tm9j77PHLuq2kak+bRmlKbhpi0FBsqiBRaBJUqFEqlIq2I3xUEafGDilgfn0QQtEWwxS9+0SoVSwsVX8TU2kdsWpM0pm1y0/s+955z9p5Zyw/7pM3t65yBYTPDrPXf/7X+s9bIdGOGiyMhTMchNxc5L053CVXs3qKrn6CR3XrANQ7PrpybrbzzC1t3Lx7rLT+/NoiPr7Rnn2yFsLBw7jynVbm+sQWQt3wG3jFMYB3HDtE77vJLX7u9Wd4869ZkmGDYgVIT1dpJPuP42HLT3/eU2rFn2fqDs+YeVRQB7BJ/QS9ZRYyhke2z4Te+Kr37rymGWVXCcAOSgGtABtgQBg4aJG4La4f39weP9MTfMG/+/gR9fwmA39Fu0wpCEWBbs8WtOvz2A93eA7vz5NdWoVwKqGyBWCC9iHrDGpAiDBR6CVooH23EI8OS6XnX/r1IzcIAv7PdIXeCieNwIfc92F77/lymrK4B/Tb+wCHCLUfw+/YhFuDcAuQJ8xAVKoP1BMHDwUxv+pdlvaeD++u8GG84w7ezjA1NhCru/Lpb+9nBUM0tRZA1wV/5YcKdd5B/8R7CTTdiWiEn/4etLKFN0AilwNCgV8FcDlul2v90yh/ru2zBi+CWBwMWyorrm+5zR0K5b7ECM8AcMjuDv+5awqHD+MM34PddA1PTkKTWiYBYrRkTWKrgQEg7Pt7wd/sUcdUQt1QO6ZfD5qebclflaroJwCmsrWH/PYm9/BLpxEvo6dP1nhhmozhLPVVgmCAp3Mb653u9pe58b5Uwk7eZJu7ZN1w6uA7EBCEDaxrp1ZPIb/+AnTmDVZH0zHPY+bPQhmT1VAEFTGulDRR2uPVrrpqa27/o87+FmW6ncbnF7UNfZcOoKBBLiAWgPTj6d9ILLwKG9VdJzZKYQRxCCZRWJxupQxUNYnBud9HeW7j8dLBmq0kqW1VC+tTaCgauBGuB5gNkOMAEmK7DN6xgAAwVBlIDIeAM1MAQaTpfdEPWCK+t9ntQrqRCrbT6DzCwBNkAcg+uGJUShSpBqbBBPUutw+RHdpkDb2YXynJ5vmItlP21OG/xlOVhxYhzpdZ/ET3kBnkEN7qVCgxHYRmOQIajehOk1kVDYbXSjVOD1eMrPl9wlOtsqJ092rnij61QexkqrCusGSwDq5fMnkEP6MnIuUDuwEdoJOgIHLf2sQv9wSvrq0v4DxVNcu9Z7g+Gt/p0ZzeaG1RQyegSUV+kvkGf+luO5BmAQsGXUESYA1aa2I9l6pu9ovvsTKuNb7WnkZAx7/IzUw134ydDuU/XBaJgcaQMqSWYRmHKgDxBUUGjglwzptRxWaH82hVPP6HFtwqx0mP4RmcKdZ7oXHzdF8e3p+r2AxqnC9cka3RoqFBUUFRKUUK7gnYlFDHQylp0ujPMZAWX2QZPey48nDpfiSKvNFTJVAmzZclInWjlnvlJGb5UBh75LOUV3fY0/ZntpODRskJThXiPz3Jc0STLM9qLy2Svn+Z3Li0+GLN7K+HPMxbfLtc7Q0FmRm6GqLIR0+ljvnhqo5sf2ttb2LFNAzMz0+Tbt9PatZfujl205maYS0rz3DkuzJ/iN7l//rul+8Ip5U/bfLapgQW9dCVCBqi4fz7W7H7qNHrP4Wrh3gMn3tx1tcs7a1MFzjm6vchzabD+iqteezwvfvl6Z/YXtvHmG6GuYpsB3tUyAQ80TN+8kBU/eijx0/PD8tq7d84+9Kkj+w+qc/z8L8//+1dn17/8kW54QX2+7kzxmzrx28PxASM3o6HaXyoazxy97tDLN37vYW764aMcPXzLicX2ln80kq43zJD3dP0+DGoahsMYYFStabbkJp1+r0N/AzGjs7Ha2dKdknUKS+WQwhQxex8AkU05EBGqosGiazAfcvri8VUfQg6zM1iWgTiyFHm12SWESMeU9e4WZHkVk81sQn/bzLuSYA76CLg6rkmEKsvRRgNEiAgpKaRIRFgUj+tOM9XpsvROBubeO37yjsXFVwKmmGrdV+veirPN5zYDvE/sNpMyVFPtGFDTulW+lwTflYMJAMQMU6OK9VlTq5M6gW3AlPEUDDNFUxotL4ZovG1Qk7GH1AQziHoRoN6bxDbIeJaI1WEpy+qSENX74wEmOFWfMcqY3sqmiDGJbUgTJCqZkZKRhnUHSmr13iRJvii9D06CopaIWtd5TQlUmcQ2IH48gPOYCVWM4KwuBy4wiW1wjKfpAIdSVRHEcKY46oI4XqZpPE1NSkpKVVUwqkM6muMBmCAF1A/dOHKYDK8gyngKAUkTXISEkYhlHIk0JSTZJLZBzU9QKTxJHWWMozeqw8wziW0QnazYSVKqEQNJdQebxDaImwDAGTglXXzvOEWcMYltMB1fsEwdmoRUpZGqBFPHJLYBJxNcNAGHxpRqSQlqTrAJbMOF82+MPVTFyJ49V4WyTIgDw8LChfOEECYodjqBTKGLsK3fH+CcgHE50FXVlbEAO3dsHyNRwznZtXfPlbtOnHiJVFVcvnV2z1VX794FPDcWIG8UkwD8xzm7/+D+3Q8sLCyEJ584853gs+POubHU/z8AvZAksib10AQAAAAASUVORK5CYII=", ei = {
  osm: da,
  gsi: pa,
  gsi_ortho: ma,
  redcircle: _u,
  defaultpin_selected: Ou,
  defaultpin: oa,
  bluedot: ia,
  bluedot_transparent: ra,
  bluedot_small: sa
};
function Qu(i) {
  const t = zi(i);
  return [t[0], t[1]];
}
function Lu(i = !1) {
  return i ? ei.defaultpin_selected : ei.defaultpin;
}
const De = {
  noRotate: !1,
  northUp: !1,
  homeMarginPixels: 50,
  tapDuration: 3e3,
  tapUIVanish: !1,
  debug: !1
};
function Pi(i, t) {
  return i?.[t] ?? !1;
}
const Du = {
  "setting-loaded": "onSettingLoaded",
  "appdata-ready": "onAppdataReady",
  "ui-configure": "onUiConfigure",
  "core-dom-ready": "onCoreDomReady",
  "ui-dom-ready": "onUiDomReady",
  "core-ready": "onCoreReady",
  "ui-ready": "onUiReady"
};
class Bu extends Te {
  detail;
  constructor(t) {
    super("gps_error"), this.detail = t;
  }
}
class Xn extends Te {
  detail;
  constructor(t) {
    super("gps_result"), this.detail = t;
  }
}
class Nu extends Te {
  constructor() {
    super("gps_request");
  }
}
function hn(i, t) {
  console.warn(
    `MaplatCore: POI layer "${i}" not found (${t}). Pass namespaceID (e.g. "<mapID>#<layerId>" for map-derived layers), not the layer-local id.`
  );
}
let Gu = 0;
class ni extends mA {
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
  __selectedMarker;
  // oct26-m2-t1: 可視化時の自己修復（issue #101）で使うリソース参照。
  __resizeObserver = null;
  __visibilityHandler = () => {
    this.__applyInitialViewpoint(), this.__schedulePendingView();
  };
  // oct26-m2-t1-ff: 非表示中の changeMap で保留した視点確定と、その適用の予約状態。
  __pendingView = null;
  __pendingViewScheduled = !1;
  // 中心の目印の img（setCenterMarker が表現を当てる）
  __centerMarkerImg;
  lifecycleHookResults = {};
  __init = !0;
  __redrawMarkerBlock = !1;
  __redrawMarkerThrottle = [];
  __transparency;
  // nov26-m4-t5: 線・面の登録簿と連番。Object.create(MaplatApp.prototype) の殻でも
  // 動くよう初期化子に頼らず遅延で作る（__vectorStore・連番は undefined を 0 とみなす）。
  __vectors;
  __vectorSeq;
  __vectorDrawSeq;
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
  __featureOption(t, e, n) {
    const r = t?.[e];
    if (r != null) return r;
    const s = this.appData?.[e];
    return s == null ? n : !this.__settingFileKeys || this.__settingFileKeys.has(e) ? (this.__featureKeyWarner || (this.__featureKeyWarner = CA()), this.__elementMode ? (this.__featureKeyWarner(
      e,
      `<maplat-app>: the setting file key "${e}" is a presentation (feature) setting and is ignored; give it as an attribute or property of the element instead.`
    ), n) : (this.__featureKeyWarner(
      e,
      `MaplatApp: reading the feature key "${e}" from the setting file is deprecated and will be removed in the next major version; pass it in appOption (or as an attribute of <maplat-app>) instead.`
    ), s)) : s;
  }
  // Maplat App Class
  constructor(t) {
    super(), t = he(t), t && "__maplatElementMode" in t || sg(), this.__appid = t.appid || "sample", this.__elementMode = t.__maplatElementMode === !0;
    const e = t.mapboxgl || (typeof window < "u" ? window.mapboxgl : void 0);
    e && t.mapboxToken && (e.accessToken = t.mapboxToken), t.googleApiKey && (this.__googleApiKey = t.googleApiKey);
    const n = t.div;
    n && typeof n == "object" && n.nodeType === 1 ? (this.__mapDivDocument = n, this.__mapDiv = n.id || `maplat_app_${++Gu}`) : (this.__mapDiv = n || "map_div", this.__mapDivDocument = document.querySelector(`#${this.__mapDiv}`)), this.mapDivDocument.classList.add("maplat"), this.logger = new Zs(
      t.debug ? We.ALL : We.INFO
    ), this.__enableCache = t.enableCache || !1, this.icon = t.icon, this.selectedIcon = t.selectedIcon, this.translateUI = t.translateUI, this.__uiHooks = t.uiHooks;
    const r = t.setting;
    if (t.restore)
      t.restoreSession && (this.__restoreSession = !0), this.__initialRestore = t.restore;
    else if (t.restoreSession) {
      this.__restoreSession = !0;
      const g = parseInt(localStorage.getItem("epoch") || "0"), I = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
      if (g && I - g < 3600) {
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
        const l = t.restoreExtensionKeys;
        if (Array.isArray(l))
          for (const u of l) {
            if (typeof u != "string" || u in this.__initialRestore) continue;
            const p = localStorage.getItem(u);
            p !== null && (this.__initialRestore[u] = p);
          }
      }
    }
    const s = t.__restoreOverride;
    if (s) {
      const g = { ...this.__initialRestore };
      s.mapID !== void 0 && s.mapID !== g.mapID && delete g.position;
      for (const [I, l] of Object.entries(s))
        l !== void 0 && (g[I] = l);
      this.__initialRestore = g;
    }
    const o = Bn(`<img id="center_circle" class="prevent-default maplat-center-marker" alt=""
            style="position:absolute;top:50%;left:50%;margin-top:-10px;
            margin-left:-10px;" src="${ei.redcircle}">`);
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
      g.addEventListener("touchstart", (I) => {
        I.preventDefault();
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
    const n = t.hidden === !0;
    e.hidden = n, e.style.display = n ? "none" : "", t.src ? (e.setAttribute("src", t.src), e.style.margin = "0", e.style.transform = "translate(-50%, -50%)", e.classList.add("maplat-center-marker--custom")) : (e.setAttribute("src", ei.redcircle), e.style.margin = "-10px 0 0 -10px", e.style.transform = "", e.classList.remove("maplat-center-marker--custom"));
  }
  /**
   * @internal 起動後の機能系キー・テンプレート・icon を当てる。
   * `undefined` は「与えられていない」＝ Core の既定（RUNTIME_DEFAULTS）／設定ファイルの値。
   * キーの有無は `in` で見る（`{ northUp: undefined }` は「外された」を意味する）。
   */
  applyRuntimeOptions(t) {
    const e = this.mapObject;
    "northUp" in t && e && (e.northUp = t.northUp ?? De.northUp), "homeMarginPixels" in t && e && (e.homeMarginPixels = t.homeMarginPixels ?? De.homeMarginPixels), "debug" in t && (this.logger = new Zs(
      t.debug ?? De.debug ? We.ALL : We.INFO
    ));
    let n = !1;
    for (const r of ["icon", "selectedIcon"])
      r in t && (this[r] = t[r], n = !0);
    for (const r of ["poiTemplate", "poiStyle", "iconTemplate"])
      r in t && (this[r] = t[r] ?? Pi(this.appData, r), n = !0);
    n && this.from && this.redrawMarkers();
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
    const n = this.buildLifecycleContext(t, e), r = Du[t], s = this.uiHooks?.[r];
    if (s)
      try {
        const o = await s(n);
        this.lifecycleHookResults[t] = o, n.uiHookResult = o, n.uiHookResults = { ...this.lifecycleHookResults };
      } catch (o) {
        throw this.logger?.debug?.(`lifecycle:error:${t}`), this.dispatchEvent(new Nt("lifecycle:error", { phaseId: t, error: o })), o;
      }
    return this.dispatchEvent(
      new Nt(`lifecycle:${t}`, n)
    ), n;
  }
  // Async initializers 1: Load application setting
  async settingLoader(t) {
    return t || (await fetch(`apps/${this.appid}.json`)).json();
  }
  // Async initializer 6: Load pois setting => move to normalize_pois.js
  // Async initializer 8: Load sources setting asynchronous
  async sourcesLoader(t) {
    const e = this.appData.sources, n = [], r = {
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
      n.push(cC(s, r));
    }), Promise.all(n);
  }
  // Async initializers 2: Handle application setting
  async handleSetting(t, e) {
    await this.runLifecyclePhase("setting-loaded", t), this.appData = he(t), this.__settingFileKeys = new Set(Object.keys(this.appData || {})), await this.runLifecyclePhase("appdata-ready"), await this.runLifecyclePhase("ui-configure");
    const n = await this.prepareMap(e);
    await this.runLifecyclePhase("ui-dom-ready");
    const r = await WA(this.appData.pois || [], this);
    await this.handlePois(r, n), this.initGeolocation(e);
  }
  // Async Initializers 2.5: For geolocation settings
  initGeolocation(t) {
    this.__alwaysGpsOn = t.alwaysGpsOn || !1;
    const e = this.geolocation = new TC({
      timerBase: t.fake,
      homePosition: this.appData.homePosition
    });
    this.alwaysGpsOn ? (e.setTracking(!0), this.gpsEnabled_ = !0, this.initialGpsMove_ = !0) : (e.setTracking(!1), this.gpsEnabled_ = !1), e.on("change", () => {
      (async () => {
        const n = this.mapObject, r = n.getLayer("overlay").getLayers().item(0), s = n.getLayers().item(0), o = r ? r.getSource() : s.getSource(), A = e.getPosition(), a = e.getAccuracy();
        if (!A || !a) return;
        let g = !this.moveTo_ && !this.firstGpsRequest_;
        this.alwaysGpsOn && (g = !this.initialGpsMove_);
        const I = await o.setGPSMarkerAsync({ lnglat: A, acc: a }, g);
        this.moveTo_ = !1, this.firstGpsRequest_ = !1, this.initialGpsMove_ = !1, I || (this.alwaysGpsOn || this.handleGPS(!1, !0), o.setGPSMarker());
        const l = this.alwaysGpsOn ? "gps_out_hide" : "gps_out";
        this.dispatchEvent(new Xn(I ? { lnglat: A, acc: a } : { error: l }));
      })();
    }), e.on("error", (n) => {
      const r = n.code;
      if (r === 3) return;
      e.setTracking(!1), this.gpsEnabled_ = !1;
      const s = this.mapObject, o = s.getLayer("overlay").getLayers().item(0), A = s.getLayers().item(0);
      (o ? o.getSource() : A.getSource()).setGPSMarker(), this.dispatchEvent(new Bu(r === 1 ? "user_gps_deny" : r === 2 ? "gps_miss" : "gps_timeout")), this.dispatchEvent(new Xn({ error: "gps_off" }));
    }), this.addEventListener("mapChanged", () => {
      (async () => {
        if (e.getTracking()) {
          const n = this.mapObject, r = n.getLayer("overlay").getLayers().item(0), s = n.getLayers().item(0), o = r ? r.getSource() : s.getSource(), A = e.getPosition(), a = e.getAccuracy();
          if (!A || !a) return;
          const g = await o.setGPSMarkerAsync({ lnglat: A, acc: a }, !0);
          g || (this.alwaysGpsOn || this.handleGPS(!1, !0), o.setGPSMarker());
          const I = this.alwaysGpsOn ? "gps_out_hide" : "gps_out";
          this.dispatchEvent(new Xn(g ? { lnglat: A, acc: a } : { error: I }));
        }
      })();
    });
  }
  // GPS handling methods
  handleGPS(t, e = !1) {
    if (this.geolocation) {
      if (t)
        if (!this.alwaysGpsOn)
          this.firstGpsRequest_ = !0, this.geolocation.setTracking(!0), this.gpsEnabled_ = !0, this.dispatchEvent(new Nu());
        else {
          const n = this.geolocation.getPosition(), r = this.geolocation.getAccuracy();
          if (n && r) {
            const s = this.mapObject, o = s.getLayer("overlay").getLayers().item(0), A = s.getLayers().item(0), a = o ? o.getSource() : A.getSource();
            (async () => await a.setGPSMarkerAsync({ lnglat: n, acc: r }, !1) || (a.setGPSMarker(), this.dispatchEvent(new Xn({ error: "gps_out" }))))();
          }
        }
      else if (!this.alwaysGpsOn) {
        this.geolocation.setTracking(!1), this.gpsEnabled_ = !1;
        const n = this.mapObject, r = n.getLayer("overlay").getLayers().item(0), s = n.getLayers().item(0);
        (r ? r.getSource() : s.getSource()).setGPSMarker(), e || this.dispatchEvent(new Xn({ error: "gps_off" }));
      }
    }
  }
  getGPSEnabled() {
    return this.gpsEnabled_;
  }
  // Async initializers 5: Prepare map base elements and objects
  async prepareMap(t) {
    t = he(t), this.mercBuffer = null;
    const e = this.appData.homePosition, n = this.appData.defaultZoom, r = this.appData.zoomRestriction, s = this.appData.minZoom, o = this.appData.maxZoom;
    this.appName = this.appData.appName;
    const A = t.fake && !this.__elementMode ? this.appData.fakeGps : !1, a = t.fake && !this.__elementMode ? this.appData.fakeRadius : !1;
    this.__noRotate = this.__featureOption(t, "noRotate", De.noRotate), this.poiTemplate = t.poiTemplate ?? Pi(this.appData, "poiTemplate"), this.poiStyle = t.poiStyle ?? Pi(this.appData, "poiStyle"), this.iconTemplate = t.iconTemplate ?? Pi(this.appData, "iconTemplate"), this.currentPosition = null, this.__init = !0;
    const g = `${this.mapDiv}_front`;
    let I = Bn(
      `<div id="${g}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;"></div>`
    )[0];
    this.mapDivDocument.insertBefore(I, this.mapDivDocument.firstChild), this.__fakeGps = A, this.__fakeRadius = a, this.homePosition = e, this.mapObject = new Ge({
      div: g,
      controls: this.__featureOption(t, "controls", []),
      interactions: this.noRotate ? Fo({ altShiftDragRotate: !1, pinchRotate: !1 }) : Fo().extend([
        new FI({
          condition: yI
        })
      ]),
      fakeGps: A,
      fakeRadius: a,
      homePosition: e,
      northUp: this.__featureOption(t, "northUp", De.northUp),
      tapDuration: this.__featureOption(t, "tapDuration", De.tapDuration),
      homeMarginPixels: this.__featureOption(t, "homeMarginPixels", De.homeMarginPixels),
      tapUIVanish: this.__featureOption(t, "tapUIVanish", De.tapUIVanish),
      alwaysGpsOn: t.alwaysGpsOn || !1
    });
    let l;
    this.overlay && (l = `${this.mapDiv}_back`, I = Bn(
      `<div id="${l}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;"></div>`
    )[0], this.mapDivDocument.insertBefore(
      I,
      this.mapDivDocument.firstChild
    ), this.backMap = new Ge({
      off_control: !0,
      div: l
    }));
    const u = t.mapboxgl || (typeof window < "u" ? window.mapboxgl : void 0);
    if (u) {
      const m = `${this.mapDiv}_mapbox`;
      I = Bn(
        `<div id="${m}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;visibility:hidden;"></div>`
      )[0], this.mapDivDocument.insertBefore(
        I,
        this.mapDivDocument.firstChild
      ), this.mapboxMap = new u.Map({
        attributionControl: !1,
        boxZoom: !1,
        container: m,
        doubleClickZoom: !1,
        dragPan: !1,
        dragRotate: !1,
        interactive: !1,
        keyboard: !1,
        pitchWithRotate: !1,
        scrollZoom: !1,
        touchZoomRotate: !1,
        // m6-t9 §3.3: mapbox-gl-js v3 系は既定・状況により Globe 投影になり得るため、
        // Maplat は常に平面（Mercator）表示を前提とする本ライブラリの用途上、明示的に固定する
        projection: "mercator"
      });
    }
    this.registerSelfHeal();
    const p = t.maplibregl || (typeof window < "u" ? window.maplibregl : void 0);
    if (p) {
      const m = `${this.mapDiv}_maplibre`;
      I = Bn(
        `<div id="${m}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;visibility:hidden;"></div>`
      )[0], this.mapDivDocument.insertBefore(
        I,
        this.mapDivDocument.firstChild
      ), this.maplibreMap = new p.Map({
        attributionControl: !1,
        boxZoom: !1,
        container: m,
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
    return await this.runLifecyclePhase("core-dom-ready"), this.startFrom = this.appData.startFrom, {
      homePos: e,
      defZoom: n,
      zoomRestriction: r,
      mercMinZoom: s,
      mercMaxZoom: o
    };
  }
  // Async initializer 7: Handle pois loading result
  async handlePois(t, e) {
    this.pois = t;
    const n = await this.sourcesLoader(e);
    return this.handleSources(n);
  }
  /**
   * @internal sourceLoaded の材料。「GL 未ロード等で落とした source は usable: false」の
   * 判断は keep を決めている側（cacheHash の同一性）に 1 つだけ置く。Set は持たない。
   */
  sourceLoadedDetail(t) {
    return (Array.isArray(t) ? t : []).map((n) => ({
      mapID: n?.mapID ?? null,
      usable: !!(n && this.cacheHash?.[n.mapID] === n)
    }));
  }
  // Async initializer 9: Handle sources loading result
  async handleSources(t) {
    const e = [];
    if (this.cacheHash = {}, t.forEach((n) => {
      n.setMap(this.mapObject), ng(n, {
        mapboxMap: this.mapboxMap,
        maplibreMap: this.maplibreMap,
        warn: (s, ...o) => {
          this.logger?.warn ? this.logger.warn(s, ...o) : console.warn(s, ...o);
        }
      }) && (e.push(n), this.cacheHash[n.mapID] = n);
    }), this.mercSrc = e.reduce((n, r) => {
      if (n) return n;
      if (r.isBasemap()) return r;
    }, null), this.dispatchEvent(new Nt("sourceLoaded", t)), e.length === 0) {
      this.logger?.warn ? this.logger.warn("No usable sources; skipping map initialization handlers") : console.warn("No usable sources; skipping map initialization handlers"), await this.runLifecyclePhase("core-ready"), await this.runLifecyclePhase("ui-ready");
      return;
    }
    await this.setInitialMap(e), this.setMapClick(), this.setPointerEvents(), this.__elementMode || this.setMapOnOff(), this.setMouseCursor(), this.setBackMapBehavior(), this.raiseChangeViewpoint(), await this.runLifecyclePhase("core-ready"), await this.runLifecyclePhase("ui-ready");
  }
  // Async initializer 10: Handle initial map
  async setInitialMap(t) {
    const e = this.initialRestore.mapID || this.startFrom || t[t.length - 1].mapID;
    this.from = t.reduce(
      (n, r) => n ? !(n instanceof Ca) && r.mapID != e ? r : n : r.mapID != e ? r : n,
      void 0
    ), await this.changeMap(e, this.initialRestore);
  }
  // Async initializer 11: Handle map click event
  setMapClick() {
    this.mapObject.on("click", (t) => {
      this.logger.debug(t.pixel), this.lastClickEvent = t;
      const e = [];
      if (t.target.forEachFeatureAtPixel(t.pixel, (n) => {
        this.logger.debug(t.pixel), n.get("datum") && e.push(n.get("datum"));
      }), e.length > 0)
        this.dispatchEvent(new Nt("clickMarker", e[0])), this.dispatchEvent(new Nt("clickMarkers", e));
      else {
        const n = t.coordinate;
        this.dispatchEvent(new Nt("clickMapXy", n)), this.from.sysCoord2MercAsync(n).then((r) => {
          this.dispatchEvent(new Nt("clickMapMerc", r));
          const s = $t(r, "EPSG:3857", "EPSG:4326");
          this.dispatchEvent(
            new Nt("clickMap", {
              longitude: s[0],
              latitude: s[1]
            })
          );
        });
      }
    });
  }
  // Async initializer 12: Handle pointer event
  setPointerEvents() {
    let t, e = !1, n = !1;
    const r = {}, s = (o) => {
      this.dispatchEvent(new Nt("pointerMoveOnMapXy", o)), this.from.sysCoord2MercAsync(o).then((A) => {
        if (this.dispatchEvent(new Nt("pointerMoveOnMapMerc", A)), t) {
          const a = t;
          t = !1, s(a);
        } else
          e = !1;
      });
    };
    this.mapObject.on("pointermove", (o) => {
      n || (e ? t = o.coordinate : (e = !0, s(o.coordinate)));
    }), this.mapObject.on("pointerdown", (o) => {
      o.originalEvent && o.originalEvent.pointerId != null && (r[o.originalEvent.pointerId] = !0), n = !0;
    }), this.mapObject.on("pointerdrag", (o) => {
      o.originalEvent && o.originalEvent.pointerId != null && (r[o.originalEvent.pointerId] = !0), n = !0;
    }), this.mapObject.on("pointerup", (o) => {
      o.originalEvent && o.originalEvent.pointerId != null ? (delete r[o.originalEvent.pointerId], Object.keys(r).length == 0 && (n = !1)) : o.originalEvent && o.originalEvent.touches ? o.originalEvent.touches.length == 0 && (n = !1) : n = !1;
    });
  }
  // Async initializer 13: Handle map UI on/off
  setMapOnOff() {
    let t;
    const e = () => this.mapDivDocument.querySelectorAll(".ol-control"), n = (s) => {
      s.forEach((o) => o.classList.add("fade"));
    }, r = (s) => {
      s.forEach((o) => o.classList.remove("fade"));
    };
    this.mapObject.on("click", () => {
      t && (clearTimeout(t), t = void 0);
      const s = e(), o = s.length && s[0].classList.contains("fade");
      !this.mapObject.tapUIVanish || o ? r(s) : (n(s), t = setTimeout(() => {
        t = void 0, r(e());
      }, this.mapObject.tapDuration));
    }), this.mapObject.on("pointerdrag", () => {
      t && (clearTimeout(t), t = void 0), n(e());
    }), this.mapObject.on("moveend", () => {
      t && (clearTimeout(t), t = void 0), t = setTimeout(() => {
        t = void 0, r(e());
      }, this.mapObject.tapDuration);
    });
  }
  // Async initializer 14: Handle mouse cursor
  setMouseCursor() {
    const t = (n) => {
      const r = n.target.getEventPixel(n.originalEvent), s = n.target.hasFeatureAtPixel(r), o = n.target.getTarget();
      if (s) {
        const A = n.target.forEachFeatureAtPixel(
          n.pixel,
          (a) => {
            if (a.get("datum")) return a;
          }
        );
        this.mapDivDocument.querySelector(`#${o}`).style.cursor = A ? "pointer" : "";
        return;
      }
      this.mapDivDocument.querySelector(`#${o}`).style.cursor = "";
    };
    this.mapObject.on("pointermove", t);
    const e = (n) => {
      if (this.__pendingView) return;
      let r = n.frameState.viewState.center;
      const s = this.from;
      s.insideCheckSysCoord(r) || (r = s.modulateSysCoordInside(
        r
      ), n.target.getView().setCenter(r));
    };
    this.mapObject.on("moveend", e);
  }
  // Async initializer 15: Handle back map's behavior
  setBackMapBehavior() {
    const t = (e) => {
      if (!this.backMap || this.__pendingView) return;
      if (this.__backMapMoving) {
        this.logger.debug("Backmap moving skipped");
        return;
      }
      const n = this.backMap.getSource();
      if (n) {
        this.__backMapMoving = !0, this.logger.debug("Backmap moving started");
        const r = (s) => {
          this.__backMapMoving = !1, this.__reportBackMapError(s);
        };
        this.__convertFromCurrent(n, (s) => {
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
  // nov26-m4-t1（#108）: 変換が恒常的に失敗する地図では postrender ごとに失敗するので、
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
      const e = this.mapObject.getView(), n = e.getCenter(), r = e.getDecimalZoom(), s = pi(e.getRotation() * 180 / Math.PI), o = await this.from.viewpoint2MercsAsync(), A = await this.mercSrc.mercs2ViewpointAsync(o);
      if (this.mobileMapMoveBuffer && this.mobileMapMoveBuffer[0][0] == A[0][0] && this.mobileMapMoveBuffer[0][1] == A[0][1] && this.mobileMapMoveBuffer[1] == A[1] && this.mobileMapMoveBuffer[2] == A[2]) return;
      this.mobileMapMoveBuffer = A;
      const a = $t(A[0], "EPSG:3857", "EPSG:4326"), g = pi(A[2] * 180 / Math.PI);
      this.dispatchEvent(
        new Nt("changeViewpoint", {
          x: n[0],
          y: n[1],
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
          x: n[0],
          y: n[1],
          zoom: r,
          rotation: s
        }
      });
    });
  }
  // 現在の地図回転角を度数で返す (入力側restore.position.rotationと同じ単位系, #61)
  getRotation() {
    const t = this.mapObject?.getView();
    return t ? pi(t.getRotation() * 180 / Math.PI) : 0;
  }
  // 現在の実世界方位角を度数で返す。TIN地図では歪み補正込みの非同期計算になるためPromiseを返す (#61)
  async getDirection() {
    if (!this.from || !this.mercSrc) return this.getRotation();
    const t = await this.from.viewpoint2MercsAsync(), e = await this.mercSrc.mercs2ViewpointAsync(t);
    return pi(e[2] * 180 / Math.PI);
  }
  currentMapInfo() {
    return Ws(this.from);
  }
  mapInfo(t) {
    return Ws(this.cacheHash[t]);
  }
  /** @internal 要素の viewExtent。pixel → 地図の座標 → merc を旧の連鎖のまま返す。 */
  async pixelToMerc(t) {
    const e = this.mapObject, n = this.from;
    if (!e || !n) return;
    const r = e.getCoordinateFromPixel(t);
    return r ? await n.sysCoord2MercAsync(r) : void 0;
  }
  /** @internal 表示領域の大きさ。4 隅の作り方は要素が持つ。 */
  viewportSize() {
    const t = this.mapObject?.getSize?.();
    if (!(!t || !(t[0] > 0 && t[1] > 0)))
      return [t[0], t[1]];
  }
  /** @internal 前面と背面の地図の大きさを測り直す。 */
  updateSize() {
    this.mapObject?.updateSize?.(), this.backMap?.updateSize?.();
  }
  async clientPointToLngLat(t, e) {
    if (!this.from || !this.mapObject) return;
    const r = this.mapObject.getViewport().getBoundingClientRect(), s = [t - r.left, e - r.top], o = await this.pixelToMerc(s);
    if (!o) return;
    const A = $t(o, "EPSG:3857", "EPSG:4326");
    return {
      longitude: A[0],
      latitude: A[1]
    };
  }
  async lngLatToClientPoint(t, e) {
    if (!this.from || !this.mapObject) return;
    const n = $t([t, e], "EPSG:4326", "EPSG:3857"), r = await this.from.merc2SysCoordAsync(n), s = this.mapObject.getPixelFromCoordinate(r);
    if (!s) return;
    const o = this.mapObject.getViewport().getBoundingClientRect();
    return {
      x: s[0] + o.left,
      y: s[1] + o.top
    };
  }
  setMarker(t) {
    this.logger.debug(t);
    const e = t.lnglat || [
      t.lng || t.longitude,
      t.lat || t.latitude
    ], n = t.x, r = t.y, s = t.coordinates, o = this.from, A = t.icon ? this.__selectedMarker == t.namespaceID && t.selectedIcon ? t.selectedIcon : t.icon : Lu(this.__selectedMarker == t.namespaceID);
    return (s ? (function() {
      return o.merc2SysCoordAsync_ignoreBackground(
        s
      );
    })() : n && r ? new Promise((g) => {
      g(o.xy2SysCoord([n, r]));
    }) : (function() {
      const g = $t(e, "EPSG:4326", "EPSG:3857");
      return o.merc2SysCoordAsync_ignoreBackground(
        g
      );
    })()).then((g) => {
      g && o.insideCheckSysCoord(g) && this.mapObject.setMarker(g, { datum: t }, A);
    });
  }
  resetMarker() {
    this.mapObject.resetMarker();
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
  // nov26-m4-t5: data の座標（coordinates はメルカトル・lnglats は経緯度）を今の地図の座標へ変換する
  __projectVector(t) {
    this.logger.debug(t);
    let e;
    const n = (r, s = !1) => Promise.all(
      r.map((o) => Array.isArray(o[0]) ? n(o, s) : (s && (o = $t(o, "EPSG:4326", "EPSG:3857")), this.from.merc2SysCoordAsync(o)))
    );
    return t.coordinates ? e = n(t.coordinates) : e = n(t.lnglats, !0), e;
  }
  __vectorStore() {
    return this.__vectors || (this.__vectors = /* @__PURE__ */ new Map()), this.__vectors;
  }
  __nextVectorDrawToken() {
    return this.__vectorDrawSeq = (this.__vectorDrawSeq || 0) + 1, this.__vectorDrawSeq;
  }
  // nov26-m4-t5: 登録簿の 1 件を描く。変換の解決までに消された・置き換えられた・
  // 描き直しが始まった（世代が進んだ）場合は描かない。
  __drawVectorEntry(t) {
    const e = this.__nextVectorDrawToken();
    t.drawToken = e, t.feature = void 0, this.__projectVector(t.data).then((n) => {
      this.__vectorStore().get(t.id) !== t || t.drawToken !== e || (t.feature = this.mapObject.setVector(
        n,
        t.data.type,
        t.data.style
      ));
    });
  }
  __addEntry(t, e) {
    const n = this.__vectorStore();
    let r;
    if (t != null)
      r = String(t);
    else
      do
        this.__vectorSeq = (this.__vectorSeq || 0) + 1, r = `vector_${this.__vectorSeq}`;
      while (n.has(r));
    n.has(r) && this.removeVector(r);
    const s = {
      id: r,
      data: e,
      kind: e.type === void 0 || e.type === "Line" ? "Line" : "Polygon",
      drawToken: 0
    };
    return n.set(r, s), this.__drawVectorEntry(s), r;
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
    const e = (n) => {
      const r = [];
      this.resetMarker();
      let s;
      if (!this.stateBuffer.hideMarker) {
        for (const A of Object.keys(this.pois)) {
          const a = this.pois[A];
          if (!a.hide)
            for (const g of a.pois) {
              const I = Ho(g, a, this);
              Qo(I, a, this), this.__selectedMarker == I.namespaceID ? s = I : r.push(this.setMarker(I));
            }
        }
        if (n.pois)
          for (const A of Object.keys(n.pois)) {
            const a = n.pois[A];
            if (!a.hide)
              for (const g of a.pois) {
                const I = Ho(g, a, n, this);
                Qo(I, a, n, this), this.__selectedMarker == I.namespaceID ? s = I : r.push(this.setMarker(I));
              }
          }
      }
      let o = Promise.all(r);
      s && (o = o.then(() => this.setMarker(s))), o.then(() => {
        this.__redrawMarkerThrottle && this.__redrawMarkerThrottle.length > 0 ? e(this.__redrawMarkerThrottle.shift()) : this.__redrawMarkerBlock = !1;
      });
    };
    e(t);
  }
  selectMarker(t) {
    const e = this.getMarker(t);
    if (!e) return;
    this.__selectedMarker = t;
    const n = {
      latitude: e.lnglat ? e.lnglat[1] : e.lat ? e.lat : e.latitude,
      longitude: e.lnglat ? e.lnglat[0] : e.lng ? e.lng : e.longitude
    };
    this.setViewpoint(n), this.redrawMarkers();
  }
  unselectMarker() {
    delete this.__selectedMarker, this.redrawMarkers();
  }
  getMarker(t) {
    if (t.includes("#")) {
      const e = t.split("#");
      return this.cacheHash[e[0]]?.getPoi(e[1]);
    } else {
      for (const e of Object.keys(this.pois))
        for (const n of this.pois[e].pois)
          if (n.id === t)
            return n;
      return;
    }
  }
  updateMarker(t, e, n) {
    const r = this.getMarker(t);
    if (r) {
      if (e = $n(e || {}), n) {
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
      const n = e.split("#"), r = this.cacheHash[n[0]];
      if (r) {
        const s = r.addPoi(t, n[1]);
        return this.dispatchPoiNumber(), this.redrawMarkers(), s;
      }
    } else if (this.pois[e])
      return this.pois[e].pois.push($n(t)), ps(this.pois, e, {
        name: this.appName
      }), this.dispatchPoiNumber(), this.redrawMarkers(), t.namespaceID;
  }
  removeMarker(t) {
    if (t.includes("#")) {
      const e = t.split("#"), n = this.cacheHash[e[0]];
      n && (n.removePoi(e[1]), this.dispatchPoiNumber(), this.redrawMarkers());
    } else {
      let e = 0;
      for (const n of Object.keys(this.pois)) {
        const r = this.pois[n].pois;
        for (let s = r.length - 1; s >= 0; s--)
          r[s].id === t && (r.splice(s, 1), e++);
      }
      e > 0 && (this.dispatchPoiNumber(), this.redrawMarkers());
    }
  }
  clearMarker(t) {
    if (t || (t = "main"), t.includes("#")) {
      const e = t.split("#"), n = this.cacheHash[e[0]];
      n && (n.clearPoi(e[1]), this.dispatchPoiNumber(), this.redrawMarkers());
    } else {
      if (t === "all")
        for (const e of Object.keys(this.pois))
          this.pois[e].pois = [];
      else if (this.pois[t])
        this.pois[t].pois = [];
      else return;
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
      new Nt(
        "poi_number",
        this.listPoiLayers(!1, !0).reduce(
          (t, e) => t + e.pois.length,
          0
        )
      )
    );
  }
  listPoiLayers(t = !1, e = !1) {
    const n = Object.keys(this.pois).sort((s, o) => s === "main" ? -1 : o === "main" ? 1 : 0).map((s) => this.pois[s]).filter(
      (s) => e ? t ? s.pois.length && s.hide : s.pois.length : t ? s.hide : !0
    ), r = this.from.listPoiLayers(
      t,
      e
    );
    return n.concat(r);
  }
  showPoiLayer(t) {
    const e = this.getPoiLayer(t);
    if (!e) {
      hn(t, "showPoiLayer");
      return;
    }
    delete e.hide, this.requestUpdateState({
      hideLayer: this.listPoiLayers(!0).map((n) => n.namespaceID).join(",")
    }), this.redrawMarkers();
  }
  hidePoiLayer(t) {
    const e = this.getPoiLayer(t);
    if (!e) {
      hn(t, "hidePoiLayer");
      return;
    }
    e.hide = !0, this.requestUpdateState({
      hideLayer: this.listPoiLayers(!0).map((n) => n.namespaceID).join(",")
    }), this.redrawMarkers();
  }
  getPoiLayer(t) {
    if (t.includes("#")) {
      const e = t.split("#"), n = this.cacheHash[e[0]];
      if (n)
        return n.getPoiLayer(e[1]);
    } else
      return this.pois[t];
  }
  addPoiLayer(t, e) {
    if (t !== "main" && !this.pois[t])
      if (!t.includes("#"))
        this.pois[t] = Be(e || [], t, {
          name: this.appName
        }), this.redrawMarkers();
      else {
        const n = t.split("#"), r = this.cacheHash[n[0]];
        r ? (r.addPoiLayer(n[1], e), this.redrawMarkers()) : hn(t, "addPoiLayer");
      }
  }
  removePoiLayer(t) {
    if (t !== "main")
      if (t.includes("#")) {
        const e = t.split("#"), n = this.cacheHash[e[0]];
        if (!n) {
          hn(t, "removePoiLayer");
          return;
        }
        if (!n.getPoiLayer(e[1])) {
          hn(t, "removePoiLayer");
          return;
        }
        n.removePoiLayer(e[1]), this.requestUpdateState({
          hideLayer: this.listPoiLayers(!0).map((r) => r.namespaceID).join(",")
        }), this.dispatchPoiNumber(), this.redrawMarkers();
      } else {
        if (!this.pois[t]) {
          hn(t, "removePoiLayer");
          return;
        }
        delete this.pois[t], this.requestUpdateState({
          hideLayer: this.listPoiLayers(!0).map((e) => e.namespaceID).join(",")
        }), this.dispatchPoiNumber(), this.redrawMarkers();
      }
  }
  // nov26-m4-t5（#91）: 線を足して id を返す。data.id を与えればその id、無ければ自動の id。
  // 呼び手の data は変えず、写しに setLine と同じ正規化（type・stroke → style）をする。
  addLine(t) {
    const e = { ...t, type: "Line" };
    return !e.style && e.stroke && (e.style = {
      stroke: e.stroke
    }), delete e.id, this.__addEntry(t.id, e);
  }
  // nov26-m4-t5（#91）: 線・面を足して id を返す（data.type が "Line" なら線、それ以外は面）
  addVector(t) {
    const e = { ...t };
    return delete e.id, this.__addEntry(t.id, e);
  }
  // nov26-m4-t5（#91）: id の 1 件だけを消す。消したら true、無ければ false
  removeVector(t) {
    const e = this.__vectorStore(), n = e.get(t);
    return n ? (e.delete(t), n.feature && (this.mapObject.removeFeature(n.feature, "feature"), n.feature = void 0), !0) : !1;
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
    Array.from(this.__vectorStore().values()).filter((n) => n.kind === e).forEach((n) => this.removeVector(n.id));
  }
  setGPSMarker(t) {
    this.currentPosition = t, this.from.setGPSMarker(t, !0);
  }
  changeMap(t, e) {
    e === void 0 && (e = {});
    const n = this.mercSrc, r = this.cacheHash[t];
    return r ? (this.changeMapSeq || (this.changeMapSeq = Promise.resolve()), this.changeMapSeq = this.changeMapSeq.then(
      () => new Promise((s, o) => {
        const A = () => this.convertParametersFromCurrent(r, (a) => {
          const g = this.from, I = this.__captureViewState();
          let l = null, u = null;
          const p = e.backgroundID ? this.cacheHash[e.backgroundID] : void 0;
          if (this.backMap && (l = this.backMap.getSource(), r.isWmts() ? this.backMap.exchangeSource() : (p ? (u = p, this.backMap.exchangeSource(u)) : l ? u = l : (u = n, this.from.isWmts() && (u = this.from instanceof ji ? (
            // If current foreground is a TMS overlay, use the current
            // basemap as new background. On initial load no foreground
            // source is set yet, so fall back to the default basemap
            // (mercSrc) to avoid a null background source.
            this.mapObject.getSource() || n
          ) : this.from), u && this.backMap.exchangeSource(u)), u && this.requestUpdateState({ backgroundID: u.mapID }))), r instanceof ji) {
            if (this.mapObject.setLayer(r), p)
              this.mapObject.exchangeSource(p);
            else if (!this.from.isWmts()) {
              const h = l || n;
              this.mapObject.exchangeSource(h);
            }
            const C = this.mapObject.getSource();
            C && this.requestUpdateState({ backgroundID: C.mapID });
          } else
            this.mapObject.setLayer(), this.mapObject.exchangeSource(r);
          const m = {
            mapID: r.mapID
          };
          r.isBasemap() && (m.backgroundID = "____delete____"), this.requestUpdateState(m), this.from = r, this.dispatchPoiNumber();
          const c = this.mapObject.getView();
          this.appData.zoomRestriction && (c.setMaxZoom(r.maxZoom), c.setMinZoom(r.minZoom || 0)), a && r.insideCheckSysCoord(a[0]) ? (c.setCenter(a[0]), c.setZoom(a[1]), c.setRotation(this.noRotate ? 0 : a[2])) : !this.__init && !a && !this.__hasMapSize() && g ? this.__pendingView ? this.__pendingView.positionMapID !== r.mapID && (delete this.__pendingView.position, delete this.__pendingView.positionMapID) : this.__pendingView = { from: g, state: I } : this.__init ? a || this.__hasMapSize() && this.goHome(r) : (this.dispatchEvent(new Nt("outOfMap", {})), this.goHome(r)), r.setGPSMarker(this.currentPosition, !0), e.hideLayer && (e.hideLayer.split(",").map((h) => {
            const d = this.getPoiLayer(h);
            d && (d.hide = !0);
          }), this.requestUpdateState({ hideLayer: e.hideLayer })), e.hideMarker ? this.hideAllMarkers() : this.redrawMarkers(), this.resetVector(), this.__vectorStore().forEach((C) => this.__drawVectorEntry(C)), this.dispatchEvent(
            new Nt("mapChanged", this.getMapMeta(r.mapID))
          ), this.mapObject.updateSize(), this.mapObject.render(), e.position && (this.__hasMapSize() ? (this.__init = !1, r.setViewpoint(e.position)) : this.__pendingView && (this.__pendingView.position = e.position, this.__pendingView.positionMapID = r.mapID)), this.setTransparency(
            e.transparency !== void 0 && e.transparency !== null ? e.transparency : this.getTransparency()
          ), this.__init ? this.__hasMapSize() && (this.__init = !1, this.goHome(r)) : this.backMap && u && this.convertParametersFromCurrent(u, (C) => {
            if (!C)
              return;
            const h = this.backMap.getView();
            h.setCenter(C[0]), h.setZoom(C[1]), h.setRotation(this.noRotate ? 0 : C[2]), this.backMap.updateSize(), this.backMap.render();
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
      const n = function(r) {
        Object.keys(r).map((s) => {
          s == "position" ? n(r[s]) : s == "backgroundID" && r[s] == "____delete____" ? localStorage.removeItem(s) : localStorage.setItem(s, r[s]);
        });
      };
      n(t);
    }
    this.timer && clearTimeout(this.timer), this.timer = setTimeout(() => {
      this.timer = void 0, this.dispatchEvent(new Nt("updateState", this.stateBuffer));
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
  // oct26-m2-t1: 可視化時の自己修復ハンドラの登録（issue #101）。
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
  // oct26-m2-t1: 初期視点が未適用（__init）かつコンテナ寸法が有効なときに、初期視点
  // を再適用して view を確定させる。再適用は initialRestore.position があれば
  // setViewpoint、なければ goHome を使い、適用後に updateSize + render を呼ぶ
  // （changeMap の既存描画順序 mapChanged → updateSize → render と同一の流れ）。
  __applyInitialViewpoint() {
    if (!this.__init) return;
    const t = this.mapObject, e = t ? t.getView() : void 0;
    if (!t || !e || !this.mapDivDocument) return;
    const n = this.from;
    n && (t.updateSize(), this.__hasMapSize() && (this.__init = !1, this.initialRestore.position ? n.setViewpoint(this.initialRestore.position) : n.goHome(), t.updateSize(), t.render()));
  }
  // oct26-m2-t1-ff: 保留した視点確定の適用を changeMapSeq の後ろに予約する。
  // 寸法が無ければ予約しない。ResizeObserver・visibilitychange・postrender が
  // 続けて来ても、適用が走るまでは 1 回だけ予約する。
  __schedulePendingView() {
    if (!this.__pendingView || this.__pendingViewScheduled) return;
    const t = this.mapObject;
    t && (t.updateSize(), this.__hasMapSize() && (this.__pendingViewScheduled = !0, this.changeMapSeq || (this.changeMapSeq = Promise.resolve()), this.changeMapSeq = this.changeMapSeq.then(() => (this.__pendingViewScheduled = !1, this.__applyPendingView()))));
  }
  // oct26-m2-t1-ff: 保留した視点確定を、表示中の changeMap と同じ規則で適用する。
  // 切替前の地図と視点を変換核 __convertParameters に通し（mercBuffer を含む同じ変換）、
  // 範囲内なら setCenter/setZoom/setRotation、範囲外なら outOfMap + goHome。
  // 保留に position があり行き先が一致すれば、変換の後で setViewpoint で上書きする。
  // 締めは m2-t1 の __applyInitialViewpoint と同じ updateSize + render。
  __applyPendingView() {
    const t = this.__pendingView, e = this.mapObject, n = this.from;
    return !t || !e || !n || (e.updateSize(), !this.__hasMapSize()) ? Promise.resolve() : new Promise((r) => {
      let s = !1;
      const o = () => {
        s || (s = !0, this.__pendingView === t && (this.__pendingView = null), t.position && t.positionMapID === n.mapID && n.setViewpoint(t.position), e.updateSize(), e.render(), r());
      }, A = (a) => {
        s || (this.logger.warn(`changeMap: pending viewpoint conversion failed: ${a}`), this.goHome(n), o());
      };
      if (!t.state) {
        this.goHome(n), o();
        return;
      }
      try {
        this.__convertParameters(
          t.from,
          t.state,
          n,
          (a) => {
            const g = e.getView();
            a && n.insideCheckSysCoord(a[0]) ? (g.setCenter(a[0]), g.setZoom(a[1]), g.setRotation(this.noRotate ? 0 : a[2])) : (this.dispatchEvent(new Nt("outOfMap", {})), this.goHome(n)), o();
          },
          A
        );
      } catch (a) {
        A(a);
      }
    });
  }
  // oct26-m2-t1-ff: 現在の view の視点を控える。有限でない値を含む場合は undefined
  // （非表示中に resolution が NaN へ崩れた後など。変換核へ流すと #101 と同じ例外になる）。
  __captureViewState() {
    const t = this.mapObject ? this.mapObject.getView() : void 0;
    if (!t) return;
    const e = this.__captureRawViewState(t), { center: n, zoom: r, decimalZoom: s, rotation: o } = e;
    if (!(!n || ![n[0], n[1], r, s, o].every(
      (A) => Number.isFinite(A)
    )))
      return { center: [n[0], n[1]], zoom: r, decimalZoom: s, rotation: o };
  }
  // oct26-m2-t1-ff: view の値を検査せずにそのまま読む（切り出し前の
  // convertParametersFromCurrent が変換の直前に読んでいた値と同じ）。
  __captureRawViewState(t) {
    return {
      center: t.getCenter(),
      zoom: t.getZoom(),
      decimalZoom: t.getDecimalZoom(),
      rotation: t.getRotation()
    };
  }
  // oct26-m2-t1: コンテナ寸法が有効（map size が正）かどうか。非表示コンテナ
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
    if (t ? e = this.cacheHash[t] : e = this.from, !!e)
      return Wn.reduce(
        (n, r) => (n[r] = e.get(r), n),
        {
          mapID: e.mapID,
          label: e.label
        }
      );
  }
  getMapCacheEnable(t) {
    let e;
    return t ? e = this.cacheHash[t] : e = this.from, e ? e.getCacheEnable() : !1;
  }
  async getMapTileCacheStatsAsync(t) {
    let e;
    return t ? e = this.cacheHash[t] : e = this.from, e ? await e.getTileCacheStatsAsync() : {};
  }
  async getMapTileCacheSizeAsync(t) {
    return (await this.getMapTileCacheStatsAsync(t)).size || 0;
  }
  async clearMapTileCacheAsync(t) {
    let e;
    t ? e = this.cacheHash[t] : e = this.from, e && await e.clearTileCacheAsync();
  }
  async fetchAllMapTileCacheAsync(t, e) {
    let n;
    if (t ? n = this.cacheHash[t] : n = this.from, !n) {
      e("stop", {});
      return;
    }
    await n.fetchAllTileCacheAsync(e);
  }
  async cancelMapTileCacheAsync(t) {
    let e;
    t ? e = this.cacheHash[t] : e = this.from, e && await e.cancelTileCacheAsync();
  }
  convertParametersFromCurrent(t, e) {
    this.__convertFromCurrent(t, e);
  }
  // nov26-m4-t1（#108）: convertParametersFromCurrent の本体。公開の型を変えずに
  // onError の口を得るために private へ移した。onError を渡したときだけ、同期例外も
  // 非同期の失敗（__convertParameters の onError）も投げずに onError へ渡す。
  // onError が無いときは今までと同じ（例外をそのまま投げる）。
  __convertFromCurrent(t, e, n) {
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
        n
      );
    } catch (r) {
      if (n) n(r);
      else throw r;
    }
  }
  // oct26-m2-t1-ff: 変換核。切替前の地図 fromSrc と、そのときの視点 state（地図の
  // 座標系の値）から、行き先 to の視点を求めて callback(size) を呼ぶ。中身は切り出し前の
  // convertParametersFromCurrent と同じ（mercBuffer のキャッシュ判定・
  // viewpoint2MercsAsync・mercs2ViewpointAsync・mercBuffer の更新）。
  // viewpoint2MercsAsync へは省略時に内部で読む値（center・getDecimalZoom・rotation）を
  // 明示で渡す。onError を渡した場合だけ、変換の失敗を投げずに onError へ渡す。
  __convertParameters(t, e, n, r, s) {
    let o = t.viewpoint2MercsAsync([
      e.center,
      e.decimalZoom,
      e.rotation
    ]);
    const A = $r(
      [e.center, e.zoom, e.rotation],
      10
    );
    if (this.mercBuffer && this.mercBuffer.mercs && this.mercBuffer.buffer[t.mapID]) {
      const a = this.mercBuffer.buffer[t.mapID];
      a[0][0] == A[0][0] && a[0][1] == A[0][1] && a[1] == A[1] && a[2] == A[2] ? (this.logger.debug(a), this.logger.debug(A), this.logger.debug("From: Use buffer"), o = new Promise((g, I) => {
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
      let g = n.mercs2ViewpointAsync(a);
      const I = n.mapID;
      this.mercBuffer.buffer[I] && (this.logger.debug("To: Use buffer"), g = new Promise((l, u) => {
        l(this.mercBuffer.buffer[I]);
      })), g.then((l) => {
        this.logger.debug(
          `To: Center: ${l[0]} Zoom: ${l[1]} Rotation: ${l[2]}`
        ), this.logger.debug(`To: ${n.mapID}`), this.mercBuffer.buffer[n.mapID] = $r(l, 10), r(l);
      }).catch((l) => {
        if (s) s(l);
        else throw l;
      });
    }).catch((a) => {
      if (s) s(a);
      else throw a;
    });
  }
  remove() {
    typeof document < "u" && document.removeEventListener("visibilitychange", this.__visibilityHandler), this.__resizeObserver && (this.__resizeObserver.disconnect(), this.__resizeObserver = null), this.mapObject?.setTarget?.(void 0), this.backMap?.setTarget?.(void 0), this.maplibreMap?.remove?.(), this.mapboxMap && this.mapboxMap.remove(), this.mapDivDocument.innerHTML = "", this.mapDivDocument.classList.remove("maplat");
  }
}
const Fu = [
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
  const t = ni.prototype;
  for (const e of Fu) {
    const n = Object.getOwnPropertyDescriptor(t, e);
    if (!n?.get) throw new Error(`MaplatApp: missing getter for startup field "${e}"`);
    const r = `__${e}`;
    Object.defineProperty(t, e, {
      configurable: !0,
      enumerable: !1,
      get: n.get,
      set(s) {
        if (!this.__startupLocked) {
          this[r] = s;
          return;
        }
        this.__startupWarner || (this.__startupWarner = CA()), this.__startupWarner(
          e,
          `MaplatApp: "${e}" is fixed at startup and cannot be changed after construction; the assignment was ignored.`
        );
      }
    });
  }
})();
ni.createObject = function(i) {
  return new Promise((t) => {
    const e = new ni(i);
    e.waitReady.then(() => {
      t(e);
    });
  });
};
if (typeof window < "u") {
  const i = {
    createObject: ni.createObject
  };
  window.Maplat = i, window.MaplatApp = ni, window.assets = ei;
}
export {
  Nt as CustomEvent,
  Bu as GPSErrorEvent,
  Nu as GPSRequestEvent,
  Xn as GPSResultEvent,
  Fu as MAPLAT_APP_STARTUP_FIELDS,
  ni as MaplatApp,
  Ge as MaplatMap,
  ei as assets,
  Hu as buildSlideAttrs,
  Bn as createElement,
  Lu as defaultPinIcon,
  Eu as escapeAttr,
  cC as mapSourceFactory,
  Qu as mercToLngLat,
  Wu as sanitizeHtml,
  xu as toPlainText
};
//# sourceMappingURL=maplat_core.js.map
