import { transform as re, toLonLat as pr, Projection as tl, addProjection as ms, addCoordinateTransforms as or, getTransform as Gr, identityTransform as zr } from "ol/proj";
import { View as FA, Map as el, Feature as jA } from "ol";
import { Vector as Di, Group as nl, Tile as Ur } from "ol/layer";
import { XYZ as GA, Google as il, Vector as Bi } from "ol/source";
import { Style as ve, Stroke as ys, Fill as vs, Icon as Nn } from "ol/style";
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
let zt = class extends Le {
  detail;
  constructor(t, n) {
    super(t), this.detail = n;
  }
};
const rl = ["ALL", "OFF"], qe = {
  ALL: -99,
  DEBUG: -1,
  INFO: 0,
  WARN: 1,
  ERROR: 2,
  OFF: 99
};
class jo {
  constructor(t = qe.INFO) {
    this.level = t, this.make();
  }
  level;
  make() {
    const t = Object.keys(qe).filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (n) => !rl.includes(n)
    );
    for (const n of t) {
      const i = qe[n], r = n.toLowerCase();
      this[r] = this.level <= i ? console.log : () => {
      };
    }
  }
}
function sl(e, t) {
  return e.isMapbox() ? t.mapboxMap ? (e.mapboxMap = t.mapboxMap, !0) : (t.warn?.(
    "Mapbox GL JS is not available; skipping Mapbox source:",
    e.mapID
  ), !1) : typeof e.isMapLibre == "function" && e.isMapLibre() ? t.maplibreMap ? (e.maplibreMap = t.maplibreMap, !0) : (t.warn?.(
    "MapLibre GL JS is not available; skipping MapLibre source:",
    e.mapID
  ), !1) : !0;
}
const li = [
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
], ol = [
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
function zA() {
  const e = /* @__PURE__ */ new Set();
  return (t, n) => {
    e.has(t) || (e.add(t), console.warn(n));
  };
}
let Go = !1;
const al = "MaplatApp: the MaplatApp class is deprecated and will be removed in 2.0. Use the <maplat-app> element (@maplat/core/element) instead.";
function Al() {
  Go || (Go = !0, console.warn(al));
}
function Qn(e) {
  const t = document, n = t.createDocumentFragment(), i = [];
  e = e.replace(/(<\/?)d([ >])/g, "$1div$2").replace(/(<\/?)s([ >])/g, "$1span$2").replace(/ din="/g, ' data-i18n="').replace(/ dinh="/g, ' data-i18n-html="').replace(/ c="/g, ' class="');
  const r = n.appendChild(t.createElement("div"));
  r.innerHTML = e;
  for (let s = 0; s < r.childNodes.length; s++) {
    const o = r.childNodes[s];
    if (o.nodeName && o.nodeName.toLowerCase() === "script") {
      const a = t.createElement("script");
      o.type && (a.type = o.type), o.src ? a.src = o.src : a.text = o.text, i[s] = a;
    } else
      i[s] = o;
  }
  return i;
}
function Ni(e) {
  for (; !(e <= 180 && e > -180); ) {
    const t = e > 0 ? -1 : 1;
    e = e + t * 360;
  }
  return e;
}
function zo(e) {
  if (!e) return;
  const t = {
    mapID: e.mapID
  };
  for (let n = 0; n < li.length; n++) {
    const i = li[n];
    e[i] && (t[i] = e[i]);
  }
  return t;
}
function we(e) {
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
  return Object.keys(t).reduce((n, i) => {
    if (n[i] !== void 0)
      throw new Error(`Invalid Maplat option key: ${i}. Use "${t[i]}" instead.`);
    return n;
  }, e);
}
class UA {
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
function gl(e, t, n) {
  let i, r;
  n = n || XA;
  let s = 0, o = e.length, a = !1;
  for (; s < o; )
    i = s + (o - s >> 1), r = +n(e[i], t), r < 0 ? s = i + 1 : (o = i, a = !r);
  return a ? s : ~s;
}
function XA(e, t) {
  return e > t ? 1 : e < t ? -1 : 0;
}
function ZA(e, t, n) {
  if (e[0] <= t)
    return 0;
  const i = e.length;
  if (t <= e[i - 1])
    return i - 1;
  if (typeof n == "function") {
    for (let r = 1; r < i; ++r) {
      const s = e[r];
      if (s === t)
        return r;
      if (s < t)
        return n(t, e[r - 1], s) > 0 ? r - 1 : r;
    }
    return i - 1;
  }
  if (n > 0) {
    for (let r = 1; r < i; ++r)
      if (e[r] < t)
        return r - 1;
    return i - 1;
  }
  if (n < 0) {
    for (let r = 1; r < i; ++r)
      if (e[r] <= t)
        return r;
    return i - 1;
  }
  for (let r = 1; r < i; ++r) {
    if (e[r] == t)
      return r;
    if (e[r] < t)
      return e[r - 1] - t < t - e[r] ? r - 1 : r;
  }
  return i - 1;
}
function VA(e, t) {
  const n = Array.isArray(t) ? t : [t], i = n.length;
  for (let r = 0; r < i; r++)
    e[e.length] = n[r];
}
function cl(e, t) {
  const n = e.length;
  if (n !== t.length)
    return !1;
  for (let i = 0; i < n; i++)
    if (e[i] !== t[i])
      return !1;
  return !0;
}
function qt() {
  throw new Error("Unimplemented abstract method.");
}
let ll = 0;
function ul(e) {
  const t = (
    /** @type {{ol_uid: (string|undefined)}} */
    /** @type {unknown} */
    e
  );
  return t.ol_uid || (t.ol_uid = String(++ll));
}
function hl() {
  return !0;
}
function dr() {
  return !1;
}
function ws() {
}
function Il(e) {
  let t, n, i;
  return function() {
    const r = Array.prototype.slice.call(arguments);
    return (!n || this !== i || !cl(r, n)) && (i = this, n = r, t = e.apply(this, r)), t;
  };
}
function WA(e) {
  for (const t in e)
    delete e[t];
}
function Cl(e) {
  let t;
  for (t in e)
    return !1;
  return !t;
}
class YA extends UA {
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
  addEventListener(t, n) {
    if (!t || !n)
      return;
    const i = this.listeners_ || (this.listeners_ = {}), r = i[t] || (i[t] = []);
    r.includes(n) || r.push(n);
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
    const n = typeof t == "string", i = n ? t : t.type, r = this.listeners_ && this.listeners_[i];
    if (!r)
      return;
    const s = n ? new Le(t) : (
      /** @type {Event} */
      t
    );
    s.target || (s.target = this.eventTarget_ || this);
    const o = this.dispatching_ || (this.dispatching_ = {}), a = this.pendingRemovals_ || (this.pendingRemovals_ = {});
    i in o || (o[i] = 0, a[i] = 0), ++o[i];
    let A;
    for (let g = 0, c = r.length; g < c; ++g)
      if ("handleEvent" in r[g] ? A = /** @type {import("../events.js").ListenerObject} */
      r[g].handleEvent(s) : A = /** @type {import("../events.js").ListenerFunction} */
      r[g].call(this, s), A === !1 || s.propagationStopped) {
        A = !1;
        break;
      }
    if (--o[i] === 0) {
      let g = a[i];
      for (delete a[i]; g--; )
        this.removeEventListener(i, ws);
      delete o[i];
    }
    return (
      /** @type {boolean|undefined} */
      A
    );
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.listeners_ && WA(this.listeners_);
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
  removeEventListener(t, n) {
    if (!this.listeners_)
      return;
    const i = this.listeners_[t];
    if (!i)
      return;
    const r = i.indexOf(n);
    r !== -1 && (this.pendingRemovals_ && t in this.pendingRemovals_ ? (i[r] = ws, ++this.pendingRemovals_[t]) : (i.splice(r, 1), i.length === 0 && delete this.listeners_[t]));
  }
}
FA.prototype.getDecimalZoom = function() {
  const e = this.getResolution(), t = (
    // NOTE: `resolution` maybe `undefined`
    // NOTE: `offset` maybe `NaN`
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Math.log(this.maxResolution_ / e) / Math.log(2)
  );
  return t !== void 0 ? this.minZoom_ + t : t;
};
const Ft = {
  UNKNOWN: 0,
  INTERSECTING: 1,
  ABOVE: 2,
  RIGHT: 4,
  BELOW: 8,
  LEFT: 16
};
function fl(e) {
  const t = Hs();
  for (let n = 0, i = e.length; n < i; ++n)
    yl(t, e[n]);
  return t;
}
function Ys(e, t, n) {
  let i, r;
  return t < e[0] ? i = e[0] - t : e[2] < t ? i = t - e[2] : i = 0, n < e[1] ? r = e[1] - n : e[3] < n ? r = n - e[3] : r = 0, i * i + r * r;
}
function pl(e, t, n) {
  return e[0] <= t && t <= e[2] && e[1] <= n && n <= e[3];
}
function Uo(e, t) {
  const n = e[0], i = e[1], r = e[2], s = e[3], o = t[0], a = t[1];
  let A = Ft.UNKNOWN;
  return o < n ? A = A | Ft.LEFT : o > r && (A = A | Ft.RIGHT), a < i ? A = A | Ft.BELOW : a > s && (A = A | Ft.ABOVE), A === Ft.UNKNOWN && (A = Ft.INTERSECTING), A;
}
function Hs() {
  return [1 / 0, 1 / 0, -1 / 0, -1 / 0];
}
function mr(e, t, n, i, r) {
  return r ? (r[0] = e, r[1] = t, r[2] = n, r[3] = i, r) : [e, t, n, i];
}
function HA(e) {
  return mr(1 / 0, 1 / 0, -1 / 0, -1 / 0, e);
}
function dl(e, t) {
  const n = e[0], i = e[1];
  return mr(n, i, n, i, t);
}
function ml(e, t, n, i, r) {
  const s = HA(r);
  return QA(s, e, t, n, i);
}
function yl(e, t) {
  t[0] < e[0] && (e[0] = t[0]), t[0] > e[2] && (e[2] = t[0]), t[1] < e[1] && (e[1] = t[1]), t[1] > e[3] && (e[3] = t[1]);
}
function QA(e, t, n, i, r) {
  for (; n < i; n += r)
    vl(e, t[n], t[n + 1]);
  return e;
}
function vl(e, t, n) {
  e[0] = Math.min(e[0], t), e[1] = Math.min(e[1], n), e[2] = Math.max(e[2], t), e[3] = Math.max(e[3], n);
}
function KA(e, t) {
  let n;
  return n = t(wl(e)), n || (n = t(bl(e)), n) || (n = t(Sl(e)), n) || (n = t(Ml(e)), n) ? n : !1;
}
function wl(e) {
  return [e[0], e[1]];
}
function bl(e) {
  return [e[2], e[1]];
}
function ar(e) {
  return [(e[0] + e[2]) / 2, (e[1] + e[3]) / 2];
}
function El(e, t, n, i, r) {
  const [s, o, a, A, g, c, u, C] = xl(
    e,
    t,
    n,
    i
  );
  return mr(
    Math.min(s, a, g, u),
    Math.min(o, A, c, C),
    Math.max(s, a, g, u),
    Math.max(o, A, c, C),
    r
  );
}
function xl(e, t, n, i) {
  const r = t * i[0] / 2, s = t * i[1] / 2, o = Math.cos(n), a = Math.sin(n), A = r * o, g = r * a, c = s * o, u = s * a, C = e[0], y = e[1];
  return [
    C - A + u,
    y - g - c,
    C - A - u,
    y - g + c,
    C + A - u,
    y + g + c,
    C + A + u,
    y + g - c,
    C - A + u,
    y - g - c
  ];
}
function ui(e) {
  return e[3] - e[1];
}
function Ml(e) {
  return [e[0], e[3]];
}
function Sl(e) {
  return [e[2], e[3]];
}
function Qs(e) {
  return e[2] - e[0];
}
function Ks(e, t) {
  return e[0] <= t[2] && e[2] >= t[0] && e[1] <= t[3] && e[3] >= t[1];
}
function JA(e) {
  return e[2] < e[0] || e[3] < e[1];
}
function Tl(e, t) {
  return t ? (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t) : e;
}
function _l(e, t, n) {
  let i = !1;
  const r = Uo(e, t), s = Uo(e, n);
  if (r === Ft.INTERSECTING || s === Ft.INTERSECTING)
    i = !0;
  else {
    const o = e[0], a = e[1], A = e[2], g = e[3], c = t[0], u = t[1], C = n[0], y = n[1], w = (y - u) / (C - c);
    let l, f;
    s & Ft.ABOVE && !(r & Ft.ABOVE) && (l = C - (y - g) / w, i = l >= o && l <= A), !i && s & Ft.RIGHT && !(r & Ft.RIGHT) && (f = y - (C - A) * w, i = f >= a && f <= g), !i && s & Ft.BELOW && !(r & Ft.BELOW) && (l = C - (y - a) / w, i = l >= o && l <= A), !i && s & Ft.LEFT && !(r & Ft.LEFT) && (f = y - (C - o) * w, i = f >= a && f <= g);
  }
  return i;
}
const kl = {
  /**
   * Triggered when a property is changed.
   * @event module:ol/Object.ObjectEvent#propertychange
   * @api
   */
  PROPERTYCHANGE: "propertychange"
};
function kn(e, t, n, i, r) {
  if (r) {
    const o = n;
    n = function(a) {
      return e.removeEventListener(t, n), o.call(i ?? this, a);
    };
  } else i && i !== e && (n = n.bind(i));
  const s = {
    target: e,
    type: t,
    listener: n
  };
  return e.addEventListener(t, n), s;
}
function Xo(e, t, n, i) {
  return kn(e, t, n, i, !0);
}
function gi(e) {
  e && e.target && (e.target.removeEventListener(e.type, e.listener), WA(e));
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
class yr extends YA {
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
  onInternal(t, n) {
    if (Array.isArray(t)) {
      const i = t.length, r = new Array(i);
      for (let s = 0; s < i; ++s)
        r[s] = kn(this, t[s], n);
      return r;
    }
    return kn(
      this,
      /** @type {string} */
      t,
      n
    );
  }
  /**
   * @param {string|Array<string>} type Type.
   * @param {function((Event|import("./events/Event.js").default)): ?} listener Listener.
   * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Event key.
   * @protected
   */
  onceInternal(t, n) {
    let i;
    if (Array.isArray(t)) {
      const r = t.length;
      i = new Array(r);
      for (let s = 0; s < r; ++s)
        i[s] = Xo(this, t[s], n);
    } else
      i = Xo(
        this,
        /** @type {string} */
        t,
        n
      );
    return n.ol_key = i, i;
  }
  /**
   * Unlisten for a certain type of event.
   * @param {string|Array<string>} type Type.
   * @param {function((Event|import("./events/Event.js").default)): ?} listener Listener.
   * @protected
   */
  unInternal(t, n) {
    const i = (
      /** @type {ListenerWithKey} */
      n.ol_key
    );
    if (i)
      Rl(i);
    else if (Array.isArray(t))
      for (let r = 0, s = t.length; r < s; ++r)
        this.removeEventListener(t[r], n);
    else
      this.removeEventListener(t, n);
  }
}
yr.prototype.on;
yr.prototype.once;
yr.prototype.un;
function Rl(e) {
  if (Array.isArray(e))
    for (let t = 0, n = e.length; t < n; ++t)
      gi(e[t]);
  else
    gi(
      /** @type {import("./events.js").EventsKey} */
      e
    );
}
class Zo extends Le {
  /**
   * @param {string} type The event type.
   * @param {string} key The property name.
   * @param {*} oldValue The old value for `key`.
   */
  constructor(t, n, i) {
    super(t), this.key = n, this.oldValue = i;
  }
}
class zn extends yr {
  /**
   * @param {NoInfer<Properties>} [values] An object with key-value pairs.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, ul(this), this.values_ = null, t !== void 0 && this.setProperties(t);
  }
  /**
   * Gets a value.
   * @param {string} key Key name.
   * @return {*} Value.
   * @api
   */
  get(t) {
    let n;
    return this.values_ && this.values_.hasOwnProperty(t) && (n = this.values_[t]), n;
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
  notify(t, n) {
    let i;
    i = `change:${t}`, this.hasListener(i) && this.dispatchEvent(new Zo(i, t, n)), i = kl.PROPERTYCHANGE, this.hasListener(i) && this.dispatchEvent(new Zo(i, t, n));
  }
  /**
   * @param {string} key Key name.
   * @param {import("./events.js").Listener} listener Listener.
   */
  addChangeListener(t, n) {
    this.addEventListener(`change:${t}`, n);
  }
  /**
   * @param {string} key Key name.
   * @param {import("./events.js").Listener} listener Listener.
   */
  removeChangeListener(t, n) {
    this.removeEventListener(`change:${t}`, n);
  }
  /**
   * Sets a value.
   * @param {string} key Key name.
   * @param {*} value Value.
   * @param {boolean} [silent] Update without triggering an event.
   * @api
   */
  set(t, n, i) {
    const r = (
      /** @type {Object<string, *>} */
      this.values_ || (this.values_ = /** @type {Partial<NoInfer<Properties>>} */
      {})
    );
    if (i)
      r[t] = n;
    else {
      const s = r[t];
      r[t] = n, s !== n && this.notify(t, s);
    }
  }
  /**
   * Sets a collection of key-value pairs.  Note that this changes any existing
   * properties and adds new ones (it does not remove any existing properties).
   * @param {Partial<NoInfer<Properties>>} values Values.
   * @param {boolean} [silent] Update without triggering an event.
   * @api
   */
  setProperties(t, n) {
    for (const i in t)
      this.set(i, t[i], n);
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
  unset(t, n) {
    if (this.values_ && t in this.values_) {
      const i = this.values_[t];
      delete this.values_[t], Cl(this.values_) && (this.values_ = null), n || this.notify(t, i);
    }
  }
}
function Pl(...e) {
  console.warn(...e);
}
function Ie(e, t, n) {
  return Math.min(Math.max(e, t), n);
}
function Ol(e, t, n, i, r, s) {
  const o = r - n, a = s - i;
  if (o !== 0 || a !== 0) {
    const A = ((e - n) * o + (t - i) * a) / (o * o + a * a);
    A > 1 ? (n = r, i = s) : A > 0 && (n += o * A, i += a * A);
  }
  return Rn(e, t, n, i);
}
function Rn(e, t, n, i) {
  const r = n - e, s = i - t;
  return r * r + s * s;
}
function Vo(e) {
  return e * 180 / Math.PI;
}
function Pn(e) {
  return e * Math.PI / 180;
}
function bs(e, t) {
  const n = e % t;
  return n * t < 0 ? n + t : n;
}
function Js(e, t, n) {
  return e + n * (t - e);
}
function Es(e, t, n) {
  if (e >= t && e < n)
    return e;
  const i = n - t;
  return ((e - t) % i + i) % i + t;
}
function Ll(e, t) {
  return e[0] += +t[0], e[1] += +t[1], e;
}
function Ar(e, t) {
  let n = !0;
  for (let i = e.length - 1; i >= 0; --i)
    if (e[i] != t[i]) {
      n = !1;
      break;
    }
  return n;
}
function qs(e, t) {
  const n = Math.cos(t), i = Math.sin(t), r = e[0] * n - e[1] * i, s = e[1] * n + e[0] * i;
  return e[0] = r, e[1] = s, e;
}
function Dl(e, t) {
  return e[0] *= t, e[1] *= t, e;
}
const qA = {
  // use the radius of the Normal sphere
  radians: 6370997 / (2 * Math.PI),
  degrees: 2 * Math.PI * 6370997 / 360,
  ft: 0.3048,
  m: 1,
  "us-ft": 1200 / 3937
};
class hi {
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
    return this.metersPerUnit_ || qA[this.units_];
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
const vi = 6378137, xn = Math.PI * vi, Bl = [-xn, -xn, xn, xn], Nl = [-180, -85, 180, 85], Fi = vi * Math.log(Math.tan(Math.PI / 2));
class In extends hi {
  /**
   * @param {string} code Code.
   */
  constructor(t) {
    super({
      code: t,
      units: "m",
      extent: Bl,
      global: !0,
      worldExtent: Nl,
      getPointResolution: function(n, i) {
        return n / Math.cosh(i[1] / vi);
      }
    });
  }
}
const Wo = [
  new In("EPSG:3857"),
  new In("EPSG:102100"),
  new In("EPSG:102113"),
  new In("EPSG:900913"),
  new In("http://www.opengis.net/def/crs/EPSG/0/3857"),
  new In("http://www.opengis.net/gml/srs/epsg.xml#3857")
];
function Fl(e, t, n, i) {
  const r = e.length;
  n = n !== void 0 && n > 1 ? n : 2, i = i ?? n, t === void 0 && (n > 2 ? t = e.slice() : t = new Array(r));
  for (let s = 0; s < r; s += i) {
    t[s] = xn * e[s] / 180;
    let o = vi * Math.log(Math.tan(Math.PI * (+e[s + 1] + 90) / 360));
    o > Fi ? o = Fi : o < -Fi && (o = -Fi), t[s + 1] = o;
  }
  return t;
}
function jl(e, t, n, i) {
  const r = e.length;
  n = n !== void 0 && n > 1 ? n : 2, i = i ?? n, t === void 0 && (n > 2 ? t = e.slice() : t = new Array(r));
  for (let s = 0; s < r; s += i)
    t[s] = 180 * e[s] / xn, t[s + 1] = 360 * Math.atan(Math.exp(e[s + 1] / vi)) / Math.PI - 90;
  return t;
}
const Gl = 6378137, Yo = [-180, -90, 180, 90], zl = Math.PI * Gl / 180;
class Ye extends hi {
  /**
   * @param {string} code Code.
   * @param {string} [axisOrientation] Axis orientation.
   */
  constructor(t, n) {
    super({
      code: t,
      units: "degrees",
      extent: Yo,
      axisOrientation: n,
      global: !0,
      metersPerUnit: zl,
      worldExtent: Yo
    });
  }
}
const Ho = [
  new Ye("CRS:84"),
  new Ye("EPSG:4326", "neu"),
  new Ye("urn:ogc:def:crs:OGC:1.3:CRS84"),
  new Ye("urn:ogc:def:crs:OGC:2:84"),
  new Ye("http://www.opengis.net/def/crs/OGC/1.3/CRS84"),
  new Ye("http://www.opengis.net/gml/srs/epsg.xml#4326", "neu"),
  new Ye("http://www.opengis.net/def/crs/EPSG/0/4326", "neu")
];
let xs = {};
function Ul(e) {
  return xs[e] || xs[e.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/, "EPSG:$3")] || null;
}
function Xl(e, t) {
  xs[e] = t;
}
let On = {};
function Ii(e, t, n) {
  const i = e.getCode(), r = t.getCode();
  i in On || (On[i] = {}), On[i][r] = n;
}
function Xr(e, t) {
  return e in On && t in On[e] ? On[e][t] : null;
}
const gr = 0.9996, ce = 669438e-8, vr = ce * ce, wr = vr * ce, $e = ce / (1 - ce), Qo = Math.sqrt(1 - ce), Fn = (1 - Qo) / (1 + Qo), $A = Fn * Fn, $s = $A * Fn, to = $s * Fn, tg = to * Fn, eg = 1 - ce / 4 - 3 * vr / 64 - 5 * wr / 256, Zl = 3 * ce / 8 + 3 * vr / 32 + 45 * wr / 1024, Vl = 15 * vr / 256 + 45 * wr / 1024, Wl = 35 * wr / 3072, Yl = 3 / 2 * Fn - 27 / 32 * $s + 269 / 512 * tg, Hl = 21 / 16 * $A - 55 / 32 * to, Ql = 151 / 96 * $s - 417 / 128 * tg, Kl = 1097 / 512 * to, cr = 6378137;
function Jl(e, t, n) {
  const i = e - 5e5, o = (n.north ? t : t - 1e7) / gr / (cr * eg), a = o + Yl * Math.sin(2 * o) + Hl * Math.sin(4 * o) + Ql * Math.sin(6 * o) + Kl * Math.sin(8 * o), A = Math.sin(a), g = A * A, c = Math.cos(a), u = A / c, C = u * u, y = C * C, w = 1 - ce * g, l = Math.sqrt(1 - ce * g), f = cr / l, p = (1 - ce) / w, I = $e * c ** 2, b = I * I, d = i / (f * gr), h = d * d, m = h * d, v = m * d, E = v * d, M = E * d, x = a - u / p * (h / 2 - v / 24 * (5 + 3 * C + 10 * I - 4 * b - 9 * $e)) + M / 720 * (61 + 90 * C + 298 * I + 45 * y - 252 * $e - 3 * b);
  let S = (d - m / 6 * (1 + 2 * C + I) + E / 120 * (5 - 2 * I + 28 * C - 3 * b + 8 * $e + 24 * y)) / c;
  return S = Es(
    S + Pn(ng(n.number)),
    -Math.PI,
    Math.PI
  ), [Vo(S), Vo(x)];
}
const Ko = -80, Jo = 84, ql = -180, $l = 180;
function tu(e, t, n) {
  e = Es(e, ql, $l), t < Ko ? t = Ko : t > Jo && (t = Jo);
  const i = Pn(t), r = Math.sin(i), s = Math.cos(i), o = r / s, a = o * o, A = a * a, g = Pn(e), c = ng(n.number), u = Pn(c), C = cr / Math.sqrt(1 - ce * r ** 2), y = $e * s ** 2, w = s * Es(g - u, -Math.PI, Math.PI), l = w * w, f = l * w, p = f * w, I = p * w, b = I * w, d = cr * (eg * i - Zl * Math.sin(2 * i) + Vl * Math.sin(4 * i) - Wl * Math.sin(6 * i)), h = gr * C * (w + f / 6 * (1 - a + y) + I / 120 * (5 - 18 * a + A + 72 * y - 58 * $e)) + 5e5;
  let m = gr * (d + C * o * (l / 2 + p / 24 * (5 - a + 9 * y + 4 * y ** 2) + b / 720 * (61 - 58 * a + A + 600 * y - 330 * $e)));
  return n.north || (m += 1e7), [h, m];
}
function ng(e) {
  return (e - 1) * 6 - 180 + 3;
}
const eu = [
  /^EPSG:(\d+)$/,
  /^urn:ogc:def:crs:EPSG::(\d+)$/,
  /^http:\/\/www\.opengis\.net\/def\/crs\/EPSG\/0\/(\d+)$/
];
function ig(e) {
  let t = 0;
  for (const r of eu) {
    const s = e.match(r);
    if (s) {
      t = parseInt(s[1]);
      break;
    }
  }
  if (!t)
    return null;
  let n = 0, i = !1;
  return t > 32700 && t < 32761 ? n = t - 32700 : t > 32600 && t < 32661 && (i = !0, n = t - 32600), n ? { number: n, north: i } : null;
}
function qo(e, t) {
  return function(n, i, r, s) {
    const o = n.length;
    r = r !== void 0 && r > 1 ? r : 2, s = s ?? r, i || (r > 2 ? i = n.slice() : i = new Array(o));
    for (let a = 0; a < o; a += s) {
      const A = n[a], g = n[a + 1], c = e(A, g, t);
      i[a] = c[0], i[a + 1] = c[1];
    }
    return i;
  };
}
function nu(e) {
  return ig(e) ? new hi({ code: e, units: "m" }) : null;
}
function iu(e) {
  const t = ig(e.getCode());
  return t ? {
    forward: qo(tu, t),
    inverse: qo(Jl, t)
  } : null;
}
const ru = [iu], su = [nu];
let Ms = !0;
function ou(e) {
  Ms = !1;
}
function rg(e, t) {
  if (t !== void 0) {
    for (let n = 0, i = e.length; n < i; ++n)
      t[n] = e[n];
    t = t;
  } else
    t = e.slice();
  return t;
}
function Ss(e) {
  Xl(e.getCode(), e), Ii(e, e, rg);
}
function au(e) {
  e.forEach(Ss);
}
function Ci(e) {
  if (typeof e != "string")
    return e !== void 0 ? e : null;
  const t = Ul(e);
  if (t)
    return t;
  for (const n of su) {
    const i = n(e);
    if (i)
      return i;
  }
  return null;
}
function $o(e) {
  au(e), e.forEach(function(t) {
    e.forEach(function(n) {
      t !== n && Ii(t, n, rg);
    });
  });
}
function Au(e, t, n, i) {
  e.forEach(function(r) {
    t.forEach(function(s) {
      Ii(r, s, n), Ii(s, r, i);
    });
  });
}
function eo(e, t) {
  return e ? typeof e == "string" ? Ci(e) : (
    /** @type {Projection} */
    e
  ) : Ci(t);
}
function gu(e, t) {
  if (!e || !t)
    return null;
  const n = e.getCode(), i = t.getCode();
  let r = Xr(n, i);
  if (r)
    return r;
  let s = null, o = null;
  for (const A of ru)
    s || (s = A(e)), o || (o = A(t));
  if (!s && !o)
    return null;
  const a = "EPSG:4326";
  if (!o && s) {
    const A = Xr(a, i);
    A && (r = Zr(
      s.inverse,
      A
    ));
  } else if (!s && o) {
    const A = Xr(n, a);
    A && (r = Zr(
      A,
      o.forward
    ));
  } else s && o && (r = Zr(
    s.inverse,
    o.forward
  ));
  return r && (Ss(e), Ss(t), Ii(e, t, r)), r;
}
function Zr(e, t) {
  return function(n, i, r, s) {
    return i = e(n, i, r, s), t(i, i, r, s);
  };
}
function ta(e, t) {
  const n = Ci(e), i = Ci(t);
  return gu(n, i);
}
let cu = null;
function lu() {
  return cu;
}
function ea(e, t) {
  return e;
}
function Fe(e, t) {
  return Ms && !Ar(e, [0, 0]) && e[0] >= -180 && e[0] <= 180 && e[1] >= -90 && e[1] <= 90 && (Ms = !1, Pl(
    "Call useGeographic() from ol/proj once to work with [longitude, latitude] coordinates."
  )), e;
}
function uu(e, t) {
  return e;
}
function ji(e, t) {
  return e;
}
function hu() {
  $o(Wo), $o(Ho), Au(
    Ho,
    Wo,
    Fl,
    jl
  );
}
hu();
function Xe(e, t) {
  if (!e)
    throw new Error(t);
}
const Iu = [1, 0, 0, 1, 0, 0];
new Array(6);
function Cu() {
  return Iu.slice(0);
}
function fu(e, t, n, i, r, s, o, a) {
  const A = Math.sin(s), g = Math.cos(s);
  return e[0] = i * g, e[1] = r * A, e[2] = -i * A, e[3] = r * g, e[4] = o * i * g - a * i * A + t, e[5] = o * r * A + a * r * g + n, e;
}
function pu(e, t, n, i, r, s, o) {
  s = s || [], o = o || 2;
  let a = 0;
  for (let A = t; A < n; A += i) {
    const g = e[A], c = e[A + 1];
    s[a++] = r[0] * g + r[2] * c + r[4], s[a++] = r[1] * g + r[3] * c + r[5];
    for (let u = 2; u < o; u++)
      s[a++] = e[A + u];
  }
  return s && s.length != a && (s.length = a), s;
}
function sg(e, t, n, i, r, s, o) {
  o = o || [];
  const a = Math.cos(r), A = Math.sin(r), g = s[0], c = s[1];
  let u = 0;
  for (let C = t; C < n; C += i) {
    const y = e[C] - g, w = e[C + 1] - c;
    o[u++] = g + y * a - w * A, o[u++] = c + y * A + w * a;
    for (let l = C + 2; l < C + i; ++l)
      o[u++] = e[l];
  }
  return o && o.length != u && (o.length = u), o;
}
function du(e, t, n, i, r, s, o, a) {
  a = a || [];
  const A = o[0], g = o[1];
  let c = 0;
  for (let u = t; u < n; u += i) {
    const C = e[u] - A, y = e[u + 1] - g;
    a[c++] = A + r * C, a[c++] = g + s * y;
    for (let w = u + 2; w < u + i; ++w)
      a[c++] = e[w];
  }
  return a && a.length != c && (a.length = c), a;
}
function mu(e, t, n, i, r, s, o) {
  o = o || [];
  let a = 0;
  for (let A = t; A < n; A += i) {
    o[a++] = e[A] + r, o[a++] = e[A + 1] + s;
    for (let g = A + 2; g < A + i; ++g)
      o[a++] = e[g];
  }
  return o && o.length != a && (o.length = a), o;
}
const na = Cu(), yu = [NaN, NaN];
class vu extends zn {
  constructor() {
    super(), this.extent_ = Hs(), this.extentRevision_ = -1, this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = 0, this.simplifyTransformedInternal = Il(
      (t, n, i) => {
        if (!i)
          return this.getSimplifiedGeometry(n);
        const r = this.clone();
        return r.applyTransform(i), r.getSimplifiedGeometry(n);
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
  simplifyTransformed(t, n) {
    return this.simplifyTransformedInternal(
      this.getRevision(),
      t,
      n
    );
  }
  /**
   * Make a complete copy of the geometry.
   * @abstract
   * @return {!Geometry} Clone.
   */
  clone() {
    return qt();
  }
  /**
   * @abstract
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   */
  closestPointXY(t, n, i, r) {
    return qt();
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   */
  containsXY(t, n) {
    return this.closestPointXY(t, n, yu, Number.MIN_VALUE) === 0;
  }
  /**
   * Return the closest point of the geometry to the passed point as
   * {@link module:ol/coordinate~Coordinate coordinate}.
   * @param {import("../coordinate.js").Coordinate} point Point.
   * @param {import("../coordinate.js").Coordinate} [closestPoint] Closest point.
   * @return {import("../coordinate.js").Coordinate} Closest point.
   * @api
   */
  getClosestPoint(t, n) {
    return n = n || [NaN, NaN], this.closestPointXY(t[0], t[1], n, 1 / 0), n;
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
    return qt();
  }
  /**
   * Get the extent of the geometry.
   * @param {import("../extent.js").Extent} [extent] Extent.
   * @return {import("../extent.js").Extent} extent Extent.
   * @api
   */
  getExtent(t) {
    if (this.extentRevision_ != this.getRevision()) {
      const n = this.computeExtent(this.extent_);
      (isNaN(n[0]) || isNaN(n[1])) && HA(n), this.extentRevision_ = this.getRevision();
    }
    return Tl(this.extent_, t);
  }
  /**
   * Rotate the geometry around a given coordinate. This modifies the geometry
   * coordinates in place.
   * @abstract
   * @param {number} angle Rotation angle in radians.
   * @param {import("../coordinate.js").Coordinate} anchor The rotation center.
   * @api
   */
  rotate(t, n) {
    qt();
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
  scale(t, n, i) {
    qt();
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
    return qt();
  }
  /**
   * Get the type of this geometry.
   * @abstract
   * @return {Type} Geometry type.
   */
  getType() {
    return qt();
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
    qt();
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   */
  intersectsExtent(t) {
    return qt();
  }
  /**
   * Translate the geometry.  This modifies the geometry coordinates in place.  If
   * instead you want a new geometry, first `clone()` this geometry.
   * @abstract
   * @param {number} deltaX Delta X.
   * @param {number} deltaY Delta Y.
   * @api
   */
  translate(t, n) {
    qt();
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
  transform(t, n) {
    const i = Ci(t);
    if (!i)
      return this;
    const r = i.getUnits() == "tile-pixels" ? (
      /**
       * @param {Array<number>} inCoordinates Input coordinates.
       * @param {Array<number>} outCoordinates Output coordinates.
       * @param {number} stride Stride.
       * @return {Array<number>} Output coordinates.
       */
      function(s, o, a) {
        const A = i.getExtent(), g = i.getWorldExtent(), c = ui(g) / ui(A);
        fu(
          na,
          g[0],
          g[3],
          c,
          -c,
          0,
          0,
          0
        );
        const u = pu(
          s,
          0,
          s.length,
          a,
          na,
          o
        ), C = ta(i, n);
        return C ? C(u, u, a) : u;
      }
    ) : ta(i, n);
    return r && this.applyTransform(
      /** @type {import("../proj.js").TransformFunction} */
      r
    ), this;
  }
}
class wi extends vu {
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
    return ml(
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
    return qt();
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
    const n = this.getSimplifiedGeometryInternal(t);
    return n.getFlatCoordinates().length < this.flatCoordinates.length ? n : (this.simplifiedGeometryMaxMinSquaredTolerance = t, this);
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
  setFlatCoordinates(t, n) {
    this.stride = ia(t), this.layout = t, this.flatCoordinates = n;
  }
  /**
   * @abstract
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  setCoordinates(t, n) {
    qt();
  }
  /**
   * @param {import("./Geometry.js").GeometryLayout|undefined} layout Layout.
   * @param {Array<*>} coordinates Coordinates.
   * @param {number} nesting Nesting.
   * @protected
   */
  setLayout(t, n, i) {
    let r;
    if (t)
      r = ia(t);
    else {
      for (let s = 0; s < i; ++s) {
        if (n.length === 0) {
          this.layout = "XY", this.stride = 2;
          return;
        }
        n = /** @type {Array<unknown>} */
        n[0];
      }
      r = n.length, t = wu(r);
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
  rotate(t, n) {
    const i = this.getFlatCoordinates();
    if (i) {
      const r = this.getStride();
      sg(
        i,
        0,
        i.length,
        r,
        t,
        n,
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
  scale(t, n, i) {
    n === void 0 && (n = t), i || (i = ar(this.getExtent()));
    const r = this.getFlatCoordinates();
    if (r) {
      const s = this.getStride();
      du(
        r,
        0,
        r.length,
        s,
        t,
        n,
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
  translate(t, n) {
    const i = this.getFlatCoordinates();
    if (i) {
      const r = this.getStride();
      mu(
        i,
        0,
        i.length,
        r,
        t,
        n,
        i
      ), this.changed();
    }
  }
}
function wu(e) {
  let t;
  return e == 2 ? t = "XY" : e == 3 ? t = "XYZ" : e == 4 && (t = "XYZM"), /** @type {import("./Geometry.js").GeometryLayout} */
  t;
}
function ia(e) {
  let t;
  return e == "XY" ? t = 2 : e == "XYZ" || e == "XYM" ? t = 3 : e == "XYZM" && (t = 4), /** @type {number} */
  t;
}
function og(e, t, n, i) {
  for (let r = 0; r < i; ++r)
    e[t++] = n[r];
  return t;
}
function no(e, t, n, i) {
  for (let r = 0, s = n.length; r < s; ++r) {
    const o = n[r];
    for (let a = 0; a < i; ++a)
      e[t++] = o[a];
  }
  return t;
}
function bu(e, t, n, i, r) {
  r = r || [];
  let s = 0;
  for (let o = 0, a = n.length; o < a; ++o) {
    const A = no(
      e,
      t,
      n[o],
      i
    );
    r[s++] = A, t = A;
  }
  return r.length = s, r;
}
class io extends wi {
  /**
   * @param {!import("../coordinate.js").Coordinate} center Center.
   *     For internal use, flat coordinates in combination with `layout` and no
   *     `radius` are also accepted.
   * @param {number} [radius] Radius in units of the projection.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(t, n, i) {
    super(), i !== void 0 && n === void 0 ? this.setFlatCoordinates(i, t) : (n = n || 0, this.setCenterAndRadius(t, n, i));
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Circle} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new io(
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
  closestPointXY(t, n, i, r) {
    const s = this.flatCoordinates, o = t - s[0], a = n - s[1], A = o * o + a * a;
    if (A < r) {
      if (A === 0)
        for (let g = 0; g < this.stride; ++g)
          i[g] = s[g];
      else {
        const g = this.getRadius() / Math.sqrt(A);
        i[0] = s[0] + g * o, i[1] = s[1] + g * a;
        for (let c = 2; c < this.stride; ++c)
          i[c] = s[c];
      }
      return i.length = this.stride, A;
    }
    return r;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   * @override
   */
  containsXY(t, n) {
    const i = this.flatCoordinates, r = t - i[0], s = n - i[1];
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
    const n = this.flatCoordinates, i = n[this.stride] - n[0];
    return mr(
      n[0] - i,
      n[1] - i,
      n[0] + i,
      n[1] + i,
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
    const t = this.flatCoordinates[this.stride] - this.flatCoordinates[0], n = this.flatCoordinates[this.stride + 1] - this.flatCoordinates[1];
    return t * t + n * n;
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
    const n = this.getExtent();
    if (Ks(t, n)) {
      const i = this.getCenter();
      return t[0] <= i[0] && t[2] >= i[0] || t[1] <= i[1] && t[3] >= i[1] ? !0 : KA(t, this.intersectsCoordinate.bind(this));
    }
    return !1;
  }
  /**
   * Set the center of the circle as {@link module:ol/coordinate~Coordinate coordinate}.
   * @param {import("../coordinate.js").Coordinate} center Center.
   * @api
   */
  setCenter(t) {
    const n = this.stride, i = this.flatCoordinates[n] - this.flatCoordinates[0], r = t.slice();
    r[n] = r[0] + i;
    for (let s = 1; s < n; ++s)
      r[n + s] = t[s];
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
  setCenterAndRadius(t, n, i) {
    this.setLayout(i, t, 0), this.flatCoordinates || (this.flatCoordinates = []);
    const r = this.flatCoordinates;
    let s = og(r, 0, t, this.stride);
    r[s++] = r[0] + n;
    for (let o = 1, a = this.stride; o < a; ++o)
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
  setCoordinates(t, n) {
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
  rotate(t, n) {
    const i = this.getCenter(), r = this.getStride();
    this.setCenter(
      sg(i, 0, i.length, r, t, n, i)
    ), this.changed();
  }
}
function ag(e, t, n, i) {
  let r = 0;
  const s = e[n - i], o = e[n - i + 1];
  let a = 0, A = 0;
  for (; t < n; t += i) {
    const g = e[t] - s, c = e[t + 1] - o;
    r += A * g - a * c, a = g, A = c;
  }
  return r / 2;
}
function Eu(e, t, n, i) {
  let r = 0;
  for (let s = 0, o = n.length; s < o; ++s) {
    const a = n[s];
    r += ag(e, t, a, i), t = a;
  }
  return r;
}
function ra(e, t, n, i, r, s, o) {
  const a = e[t], A = e[t + 1], g = e[n] - a, c = e[n + 1] - A;
  let u;
  if (g === 0 && c === 0)
    u = t;
  else {
    const C = ((r - a) * g + (s - A) * c) / (g * g + c * c);
    if (C > 1)
      u = n;
    else if (C > 0) {
      for (let y = 0; y < i; ++y)
        o[y] = Js(
          e[t + y],
          e[n + y],
          C
        );
      o.length = i;
      return;
    } else
      u = t;
  }
  for (let C = 0; C < i; ++C)
    o[C] = e[u + C];
  o.length = i;
}
function ro(e, t, n, i, r) {
  let s = e[t], o = e[t + 1];
  for (t += i; t < n; t += i) {
    const a = e[t], A = e[t + 1], g = Rn(s, o, a, A);
    g > r && (r = g), s = a, o = A;
  }
  return r;
}
function xu(e, t, n, i, r) {
  for (let s = 0, o = n.length; s < o; ++s) {
    const a = n[s];
    r = ro(e, t, a, i, r), t = a;
  }
  return r;
}
function so(e, t, n, i, r, s, o, a, A, g, c) {
  if (t == n)
    return g;
  let u, C;
  if (r === 0) {
    if (C = Rn(
      o,
      a,
      e[t],
      e[t + 1]
    ), C < g) {
      for (u = 0; u < i; ++u)
        A[u] = e[t + u];
      return A.length = i, C;
    }
    return g;
  }
  c = c || [NaN, NaN];
  let y = t + i;
  for (; y < n; )
    if (ra(
      e,
      y - i,
      y,
      i,
      o,
      a,
      c
    ), C = Rn(o, a, c[0], c[1]), C < g) {
      for (g = C, u = 0; u < i; ++u)
        A[u] = c[u];
      A.length = i, y += i;
    } else
      y += i * Math.max(
        (Math.sqrt(C) - Math.sqrt(g)) / r | 0,
        1
      );
  if (s && (ra(
    e,
    n - i,
    t,
    i,
    o,
    a,
    c
  ), C = Rn(o, a, c[0], c[1]), C < g)) {
    for (g = C, u = 0; u < i; ++u)
      A[u] = c[u];
    A.length = i;
  }
  return g;
}
function Mu(e, t, n, i, r, s, o, a, A, g, c) {
  c = c || [NaN, NaN];
  for (let u = 0, C = n.length; u < C; ++u) {
    const y = n[u];
    g = so(
      e,
      t,
      y,
      i,
      r,
      s,
      o,
      a,
      A,
      g,
      c
    ), t = y;
  }
  return g;
}
function oo(e, t, n, i, r) {
  r = r !== void 0 ? r : [];
  let s = 0;
  for (let o = t; o < n; o += i)
    r[s++] = e.slice(o, o + i);
  return r.length = s, r;
}
function Su(e, t, n, i, r) {
  r = r !== void 0 ? r : [];
  let s = 0;
  for (let o = 0, a = n.length; o < a; ++o) {
    const A = n[o];
    r[s++] = oo(
      e,
      t,
      A,
      i,
      r[s]
    ), t = A;
  }
  return r.length = s, r;
}
function Tu(e, t, n, i, r) {
  return !KA(
    r,
    /**
     * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
     * @return {boolean} Contains (x, y).
     */
    function(o) {
      return !tn(
        e,
        t,
        n,
        i,
        o[0],
        o[1]
      );
    }
  );
}
function tn(e, t, n, i, r, s) {
  let o = 0, a = e[n - i], A = e[n - i + 1];
  for (; t < n; t += i) {
    const g = e[t], c = e[t + 1];
    A <= s ? c > s && (g - a) * (s - A) - (r - a) * (c - A) > 0 && o++ : c <= s && (g - a) * (s - A) - (r - a) * (c - A) < 0 && o--, a = g, A = c;
  }
  return o !== 0;
}
function Ag(e, t, n, i, r, s) {
  if (n.length === 0 || !tn(e, t, n[0], i, r, s))
    return !1;
  for (let o = 1, a = n.length; o < a; ++o)
    if (tn(e, n[o - 1], n[o], i, r, s))
      return !1;
  return !0;
}
function gg(e, t, n, i, r) {
  let s;
  for (t += i; t < n; t += i)
    if (s = r(
      e.slice(t - i, t),
      e.slice(t, t + i)
    ), s)
      return s;
  return !1;
}
function br(e, t, n, i, r, s) {
  return s = s ?? QA(Hs(), e, t, n, i), Ks(r, s) ? s[0] >= r[0] && s[2] <= r[2] || s[1] >= r[1] && s[3] <= r[3] ? !0 : gg(
    e,
    t,
    n,
    i,
    /**
     * @param {import("../../coordinate.js").Coordinate} point1 Start point.
     * @param {import("../../coordinate.js").Coordinate} point2 End point.
     * @return {boolean} `true` if the segment and the extent intersect,
     *     `false` otherwise.
     */
    function(o, a) {
      return _l(r, o, a);
    }
  ) : !1;
}
function _u(e, t, n, i, r) {
  return !!(br(e, t, n, i, r) || tn(
    e,
    t,
    n,
    i,
    r[0],
    r[1]
  ) || tn(
    e,
    t,
    n,
    i,
    r[0],
    r[3]
  ) || tn(
    e,
    t,
    n,
    i,
    r[2],
    r[1]
  ) || tn(
    e,
    t,
    n,
    i,
    r[2],
    r[3]
  ));
}
function ku(e, t, n, i, r) {
  if (!_u(e, t, n[0], i, r))
    return !1;
  if (n.length === 1)
    return !0;
  for (let s = 1, o = n.length; s < o; ++s)
    if (Tu(
      e,
      n[s - 1],
      n[s],
      i,
      r
    ) && !br(
      e,
      n[s - 1],
      n[s],
      i,
      r
    ))
      return !1;
  return !0;
}
function cg(e, t, n, i, r, s, o) {
  const a = (n - t) / i;
  if (a < 3) {
    for (; t < n; t += i)
      s[o++] = e[t], s[o++] = e[t + 1];
    return o;
  }
  const A = new Array(a);
  A[0] = 1, A[a - 1] = 1;
  const g = [t, n - i];
  let c = 0;
  for (; g.length > 0; ) {
    const u = (
      /** @type {number} */
      g.pop()
    ), C = (
      /** @type {number} */
      g.pop()
    );
    let y = 0;
    const w = e[C], l = e[C + 1], f = e[u], p = e[u + 1];
    for (let I = C + i; I < u; I += i) {
      const b = e[I], d = e[I + 1], h = Ol(b, d, w, l, f, p);
      h > y && (c = I, y = h);
    }
    y > r && (A[(c - t) / i] = 1, C + i < c && g.push(C, c), c + i < u && g.push(c, u));
  }
  for (let u = 0; u < a; ++u)
    A[u] && (s[o++] = e[t + u * i], s[o++] = e[t + u * i + 1]);
  return o;
}
function Cn(e, t) {
  return t * Math.round(e / t);
}
function Ru(e, t, n, i, r, s, o) {
  if (t == n)
    return o;
  let a = Cn(e[t], r), A = Cn(e[t + 1], r);
  t += i, s[o++] = a, s[o++] = A;
  let g, c;
  do
    if (g = Cn(e[t], r), c = Cn(e[t + 1], r), t += i, t == n)
      return s[o++] = g, s[o++] = c, o;
  while (g == a && c == A);
  for (; t < n; ) {
    const u = Cn(e[t], r), C = Cn(e[t + 1], r);
    if (t += i, u == g && C == c)
      continue;
    const y = g - a, w = c - A, l = u - a, f = C - A;
    if (y * f == w * l && (y < 0 && l < y || y == l || y > 0 && l > y) && (w < 0 && f < w || w == f || w > 0 && f > w)) {
      g = u, c = C;
      continue;
    }
    s[o++] = g, s[o++] = c, a = g, A = c, g = u, c = C;
  }
  return s[o++] = g, s[o++] = c, o;
}
function Pu(e, t, n, i, r, s, o, a) {
  for (let A = 0, g = n.length; A < g; ++A) {
    const c = n[A];
    o = Ru(
      e,
      t,
      c,
      i,
      r,
      s,
      o
    ), a.push(o), t = c;
  }
  return o;
}
class fi extends wi {
  /**
   * @param {Array<import("../coordinate.js").Coordinate>|Array<number>} coordinates Coordinates.
   *     For internal use, flat coordinates in combination with `layout` are also accepted.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(t, n) {
    super(), this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, n !== void 0 && !Array.isArray(t[0]) ? this.setFlatCoordinates(
      n,
      /** @type {Array<number>} */
      t
    ) : this.setCoordinates(
      /** @type {Array<import("../coordinate.js").Coordinate>} */
      t,
      n
    );
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!LinearRing} Clone.
   * @api
   * @override
   */
  clone() {
    return new fi(this.flatCoordinates.slice(), this.layout);
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, n, i, r) {
    return r < Ys(this.getExtent(), t, n) ? r : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      ro(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), so(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      this.maxDelta_,
      !0,
      t,
      n,
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
    return ag(
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
    return oo(
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
    const n = [];
    return n.length = cg(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      n,
      0
    ), new fi(n, "XY");
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
    return br(
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
  setCoordinates(t, n) {
    this.setLayout(n, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = no(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function Ou(e, t, n, i, r, s, o) {
  let a, A;
  const g = (n - t) / i;
  if (g === 1)
    a = t;
  else if (g === 2)
    a = t, A = r;
  else if (g !== 0) {
    let c = e[t], u = e[t + 1], C = 0;
    const y = [0];
    for (let f = t + i; f < n; f += i) {
      const p = e[f], I = e[f + 1];
      C += Math.sqrt((p - c) * (p - c) + (I - u) * (I - u)), y.push(C), c = p, u = I;
    }
    const w = r * C, l = gl(y, w);
    l < 0 ? (A = (w - y[-l - 2]) / (y[-l - 1] - y[-l - 2]), a = t + (-l - 2) * i) : a = t + l * i;
  }
  o = o !== void 0 && o > 1 ? o : 2, s = s || new Array(o);
  for (let c = 0; c < o; ++c)
    s[c] = a === void 0 ? NaN : A === void 0 ? e[a + c] : Js(e[a + c], e[a + i + c], A);
  return s;
}
function Lu(e, t, n, i, r, s) {
  if (n == t)
    return null;
  let o;
  if (r < e[t + i - 1])
    return s ? (o = e.slice(t, t + i), o[i - 1] = r, o) : null;
  if (e[n - 1] < r)
    return s ? (o = e.slice(n - i, n), o[i - 1] = r, o) : null;
  if (r == e[t + i - 1])
    return e.slice(t, t + i);
  let a = t / i, A = n / i;
  for (; a < A; ) {
    const C = a + A >> 1;
    r < e[(C + 1) * i - 1] ? A = C : a = C + 1;
  }
  const g = e[a * i - 1];
  if (r == g)
    return e.slice((a - 1) * i, (a - 1) * i + i);
  const c = e[(a + 1) * i - 1], u = (r - g) / (c - g);
  o = [];
  for (let C = 0; C < i - 1; ++C)
    o.push(
      Js(
        e[(a - 1) * i + C],
        e[a * i + C],
        u
      )
    );
  return o.push(r), o;
}
function Du(e, t, n, i) {
  let r = e[t], s = e[t + 1], o = 0;
  for (let a = t + i; a < n; a += i) {
    const A = e[a], g = e[a + 1];
    o += Math.sqrt((A - r) * (A - r) + (g - s) * (g - s)), r = A, s = g;
  }
  return o;
}
class lr extends wi {
  /**
   * @param {Array<import("../coordinate.js").Coordinate>|Array<number>} coordinates Coordinates.
   *     For internal use, flat coordinates in combination with `layout` are also accepted.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(t, n) {
    super(), this.flatMidpoint_ = null, this.flatMidpointRevision_ = -1, this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, n !== void 0 && !Array.isArray(t[0]) ? this.setFlatCoordinates(
      n,
      /** @type {Array<number>} */
      t
    ) : this.setCoordinates(
      /** @type {Array<import("../coordinate.js").Coordinate>} */
      t,
      n
    );
  }
  /**
   * Append the passed coordinate to the coordinates of the linestring.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @api
   */
  appendCoordinate(t) {
    VA(this.flatCoordinates, t), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!LineString} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new lr(
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
  closestPointXY(t, n, i, r) {
    return r < Ys(this.getExtent(), t, n) ? r : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      ro(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), so(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      this.maxDelta_,
      !1,
      t,
      n,
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
    return gg(
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
  getCoordinateAtM(t, n) {
    return this.layout != "XYM" && this.layout != "XYZM" ? null : (n = n !== void 0 ? n : !1, Lu(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      n
    ));
  }
  /**
   * Return the coordinates of the linestring.
   * @return {Array<import("../coordinate.js").Coordinate>} Coordinates.
   * @api
   * @override
   */
  getCoordinates() {
    return oo(
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
  getCoordinateAt(t, n) {
    return Ou(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      n,
      this.stride
    );
  }
  /**
   * Return the length of the linestring on projected plane.
   * @return {number} Length (on projected plane).
   * @api
   */
  getLength() {
    return Du(
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
    const n = [];
    return n.length = cg(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      n,
      0
    ), new lr(n, "XY");
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
    return br(
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
  setCoordinates(t, n) {
    this.setLayout(n, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = no(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
class jn extends wi {
  /**
   * @param {import("../coordinate.js").Coordinate} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(t, n) {
    super(), this.setCoordinates(t, n);
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Point} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new jn(this.flatCoordinates.slice(), this.layout);
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
  closestPointXY(t, n, i, r) {
    const s = this.flatCoordinates, o = Rn(
      t,
      n,
      s[0],
      s[1]
    );
    if (o < r) {
      const a = this.stride;
      for (let A = 0; A < a; ++A)
        i[A] = s[A];
      return i.length = a, o;
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
    return dl(this.flatCoordinates, t);
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
    return pl(t, this.flatCoordinates[0], this.flatCoordinates[1]);
  }
  /**
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, n) {
    this.setLayout(n, t, 0), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = og(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function Bu(e, t, n, i, r, s, o) {
  let a, A, g, c, u, C, y;
  const w = r[s + 1], l = [];
  for (let I = 0, b = n.length; I < b; ++I) {
    const d = n[I];
    for (c = e[d - i], C = e[d - i + 1], a = t; a < d; a += i)
      u = e[a], y = e[a + 1], (w <= C && y <= w || C <= w && w <= y) && (g = (w - C) / (y - C) * (u - c) + c, l.push(g)), c = u, C = y;
  }
  let f = NaN, p = -1 / 0;
  for (l.sort(XA), c = l[0], a = 1, A = l.length; a < A; ++a) {
    u = l[a];
    const I = Math.abs(u - c);
    I > p && (g = (c + u) / 2, Ag(e, t, n, i, g, w) && (f = g, p = I)), c = u;
  }
  return isNaN(f) && (f = r[s]), [f, w, p];
}
function Nu(e, t, n, i) {
  for (; t < n - i; ) {
    for (let r = 0; r < i; ++r) {
      const s = e[t + r];
      e[t + r] = e[n - i + r], e[n - i + r] = s;
    }
    t += i, n -= i;
  }
}
function lg(e, t, n, i) {
  let r = 0, s = e[n - i], o = e[n - i + 1];
  for (; t < n; t += i) {
    const a = e[t], A = e[t + 1];
    r += (a - s) * (A + o), s = a, o = A;
  }
  return r === 0 ? void 0 : r > 0;
}
function Fu(e, t, n, i, r) {
  r = r !== void 0 ? r : !1;
  for (let s = 0, o = n.length; s < o; ++s) {
    const a = n[s], A = lg(
      e,
      t,
      a,
      i
    );
    if (s === 0) {
      if (r && A || !r && !A)
        return !1;
    } else if (r && !A || !r && A)
      return !1;
    t = a;
  }
  return !0;
}
function sa(e, t, n, i, r) {
  r = r !== void 0 ? r : !1;
  for (let s = 0, o = n.length; s < o; ++s) {
    const a = n[s], A = lg(
      e,
      t,
      a,
      i
    );
    (s === 0 ? r && A || !r && !A : r && !A || !r && A) && Nu(e, t, a, i), t = a;
  }
  return t;
}
class nn extends wi {
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
  constructor(t, n, i) {
    super(), this.ends_ = [], this.flatInteriorPointRevision_ = -1, this.flatInteriorPoint_ = null, this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, this.orientedRevision_ = -1, this.orientedFlatCoordinates_ = null, n !== void 0 && i ? (this.setFlatCoordinates(
      n,
      /** @type {Array<number>} */
      t
    ), this.ends_ = i) : this.setCoordinates(
      /** @type {Array<Array<import("../coordinate.js").Coordinate>>} */
      t,
      n
    );
  }
  /**
   * Append the passed linear ring to this polygon.
   * @param {LinearRing} linearRing Linear ring.
   * @api
   */
  appendLinearRing(t) {
    this.flatCoordinates ? VA(this.flatCoordinates, t.getFlatCoordinates()) : this.flatCoordinates = t.getFlatCoordinates().slice(), this.ends_.push(this.flatCoordinates.length), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Polygon} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new nn(
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
  closestPointXY(t, n, i, r) {
    return r < Ys(this.getExtent(), t, n) ? r : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      xu(
        this.flatCoordinates,
        0,
        this.ends_,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), Mu(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      this.maxDelta_,
      !0,
      t,
      n,
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
  containsXY(t, n) {
    return Ag(
      this.getOrientedFlatCoordinates(),
      0,
      this.ends_,
      this.stride,
      t,
      n
    );
  }
  /**
   * Return the area of the polygon on projected plane.
   * @return {number} Area (on projected plane).
   * @api
   */
  getArea() {
    return Eu(
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
    let n;
    return t !== void 0 ? (n = this.getOrientedFlatCoordinates().slice(), sa(n, 0, this.ends_, this.stride, t)) : n = this.flatCoordinates, Su(n, 0, this.ends_, this.stride);
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
      const t = ar(this.getExtent());
      this.flatInteriorPoint_ = Bu(
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
    return new jn(this.getFlatInteriorPoint(), "XYM");
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
    return t < 0 || this.ends_.length <= t ? null : new fi(
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
    const t = this.layout, n = this.flatCoordinates, i = this.ends_, r = [];
    let s = 0;
    for (let o = 0, a = i.length; o < a; ++o) {
      const A = i[o], g = new fi(
        n.slice(s, A),
        t
      );
      r.push(g), s = A;
    }
    return r;
  }
  /**
   * @return {Array<number>} Oriented flat coordinates.
   */
  getOrientedFlatCoordinates() {
    if (this.orientedRevision_ != this.getRevision()) {
      const t = this.flatCoordinates;
      Fu(t, 0, this.ends_, this.stride) ? this.orientedFlatCoordinates_ = t : (this.orientedFlatCoordinates_ = t.slice(), this.orientedFlatCoordinates_.length = sa(
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
    const n = [], i = [];
    return n.length = Pu(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      Math.sqrt(t),
      n,
      0,
      i
    ), new nn(n, "XY", i);
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
    return ku(
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
  setCoordinates(t, n) {
    this.setLayout(n, t, 2), this.flatCoordinates || (this.flatCoordinates = []);
    const i = bu(
      this.flatCoordinates,
      0,
      t,
      this.stride,
      this.ends_
    );
    this.flatCoordinates.length = i.length === 0 ? 0 : i[i.length - 1], this.changed();
  }
}
function oa(e) {
  if (JA(e))
    throw new Error("Cannot create polygon from empty extent");
  const t = e[0], n = e[1], i = e[2], r = e[3], s = [
    t,
    n,
    t,
    r,
    i,
    r,
    i,
    n,
    t,
    n
  ];
  return new nn(s, "XY", [s.length]);
}
const ju = {
  /**
   * Indicates that tile loading failed
   * @type {number}
   */
  ERROR: 3
};
function ug(e, t, n = {}) {
  const i = { type: "Feature" };
  return (n.id === 0 || n.id) && (i.id = n.id), n.bbox && (i.bbox = n.bbox), i.properties = t || {}, i.geometry = e, i;
}
function ge(e, t, n = {}) {
  if (!e)
    throw new Error("coordinates is required");
  if (!Array.isArray(e))
    throw new Error("coordinates must be an Array");
  if (e.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!aa(e[0]) || !aa(e[1]))
    throw new Error("coordinates must contain numbers");
  return ug({
    type: "Point",
    coordinates: e
  }, t, n);
}
function Mn(e, t, n = {}) {
  for (const i of e) {
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
  return ug({
    type: "Polygon",
    coordinates: e
  }, t, n);
}
function rn(e, t = {}) {
  const n = { type: "FeatureCollection" };
  return t.id && (n.id = t.id), t.bbox && (n.bbox = t.bbox), n.features = e, n;
}
function aa(e) {
  return !isNaN(e) && e !== null && !Array.isArray(e);
}
function Gu(e) {
  if (!e)
    throw new Error("coord is required");
  if (!Array.isArray(e)) {
    if (e.type === "Feature" && e.geometry !== null && e.geometry.type === "Point")
      return [...e.geometry.coordinates];
    if (e.type === "Point")
      return [...e.coordinates];
  }
  if (Array.isArray(e) && e.length >= 2 && !Array.isArray(e[0]) && !Array.isArray(e[1]))
    return [...e];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function Aa(e) {
  if (Array.isArray(e))
    return e;
  if (e.type === "Feature") {
    if (e.geometry !== null)
      return e.geometry.coordinates;
  } else if (e.coordinates)
    return e.coordinates;
  throw new Error(
    "coords must be GeoJSON Feature, Geometry Object or an Array"
  );
}
function zu(e) {
  return e.type === "Feature" ? e.geometry : e;
}
function hg(e, t, n) {
  if (e !== null)
    for (var i, r, s, o, a, A, g, c = 0, u = 0, C, y = e.type, w = y === "FeatureCollection", l = y === "Feature", f = w ? e.features.length : 1, p = 0; p < f; p++) {
      g = w ? (
        // @ts-expect-error: Known type conflict
        e.features[p].geometry
      ) : l ? (
        // @ts-expect-error: Known type conflict
        e.geometry
      ) : e, C = g ? g.type === "GeometryCollection" : !1, a = C ? g.geometries.length : 1;
      for (var I = 0; I < a; I++) {
        var b = 0, d = 0;
        if (o = C ? g.geometries[I] : g, o !== null) {
          A = o.coordinates;
          var h = o.type;
          switch (c = 0, h) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  A,
                  u,
                  p,
                  b,
                  d
                ) === !1
              )
                return !1;
              u++, b++;
              break;
            case "LineString":
            case "MultiPoint":
              for (i = 0; i < A.length; i++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    A[i],
                    u,
                    p,
                    b,
                    d
                  ) === !1
                )
                  return !1;
                u++, h === "MultiPoint" && b++;
              }
              h === "LineString" && b++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (i = 0; i < A.length; i++) {
                for (r = 0; r < A[i].length - c; r++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      A[i][r],
                      u,
                      p,
                      b,
                      d
                    ) === !1
                  )
                    return !1;
                  u++;
                }
                h === "MultiLineString" && b++, h === "Polygon" && d++;
              }
              h === "Polygon" && b++;
              break;
            case "MultiPolygon":
              for (i = 0; i < A.length; i++) {
                for (d = 0, r = 0; r < A[i].length; r++) {
                  for (s = 0; s < A[i][r].length - c; s++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        A[i][r][s],
                        u,
                        p,
                        b,
                        d
                      ) === !1
                    )
                      return !1;
                    u++;
                  }
                  d++;
                }
                b++;
              }
              break;
            case "GeometryCollection":
              for (i = 0; i < o.geometries.length; i++)
                if (
                  // @ts-expect-error: Known type conflict
                  hg(o.geometries[i], t) === !1
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
const ke = 11102230246251565e-32, Ut = 134217729, Uu = (3 + 8 * ke) * ke;
function Vr(e, t, n, i, r) {
  let s, o, a, A, g = t[0], c = i[0], u = 0, C = 0;
  c > g == c > -g ? (s = g, g = t[++u]) : (s = c, c = i[++C]);
  let y = 0;
  if (u < e && C < n)
    for (c > g == c > -g ? (o = g + s, a = s - (o - g), g = t[++u]) : (o = c + s, a = s - (o - c), c = i[++C]), s = o, a !== 0 && (r[y++] = a); u < e && C < n; )
      c > g == c > -g ? (o = s + g, A = o - s, a = s - (o - A) + (g - A), g = t[++u]) : (o = s + c, A = o - s, a = s - (o - A) + (c - A), c = i[++C]), s = o, a !== 0 && (r[y++] = a);
  for (; u < e; )
    o = s + g, A = o - s, a = s - (o - A) + (g - A), g = t[++u], s = o, a !== 0 && (r[y++] = a);
  for (; C < n; )
    o = s + c, A = o - s, a = s - (o - A) + (c - A), c = i[++C], s = o, a !== 0 && (r[y++] = a);
  return (s !== 0 || y === 0) && (r[y++] = s), y;
}
function Xu(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function bi(e) {
  return new Float64Array(e);
}
const Zu = (3 + 16 * ke) * ke, Vu = (2 + 12 * ke) * ke, Wu = (9 + 64 * ke) * ke * ke, fn = bi(4), ga = bi(8), ca = bi(12), la = bi(16), Qt = bi(4);
function Yu(e, t, n, i, r, s, o) {
  let a, A, g, c, u, C, y, w, l, f, p, I, b, d, h, m, v, E;
  const M = e - r, x = n - r, S = t - s, _ = i - s;
  d = M * _, C = Ut * M, y = C - (C - M), w = M - y, C = Ut * _, l = C - (C - _), f = _ - l, h = w * f - (d - y * l - w * l - y * f), m = S * x, C = Ut * S, y = C - (C - S), w = S - y, C = Ut * x, l = C - (C - x), f = x - l, v = w * f - (m - y * l - w * l - y * f), p = h - v, u = h - p, fn[0] = h - (p + u) + (u - v), I = d + p, u = I - d, b = d - (I - u) + (p - u), p = b - m, u = b - p, fn[1] = b - (p + u) + (u - m), E = I + p, u = E - I, fn[2] = I - (E - u) + (p - u), fn[3] = E;
  let P = Xu(4, fn), D = Vu * o;
  if (P >= D || -P >= D || (u = e - M, a = e - (M + u) + (u - r), u = n - x, g = n - (x + u) + (u - r), u = t - S, A = t - (S + u) + (u - s), u = i - _, c = i - (_ + u) + (u - s), a === 0 && A === 0 && g === 0 && c === 0) || (D = Wu * o + Uu * Math.abs(P), P += M * c + _ * a - (S * g + x * A), P >= D || -P >= D)) return P;
  d = a * _, C = Ut * a, y = C - (C - a), w = a - y, C = Ut * _, l = C - (C - _), f = _ - l, h = w * f - (d - y * l - w * l - y * f), m = A * x, C = Ut * A, y = C - (C - A), w = A - y, C = Ut * x, l = C - (C - x), f = x - l, v = w * f - (m - y * l - w * l - y * f), p = h - v, u = h - p, Qt[0] = h - (p + u) + (u - v), I = d + p, u = I - d, b = d - (I - u) + (p - u), p = b - m, u = b - p, Qt[1] = b - (p + u) + (u - m), E = I + p, u = E - I, Qt[2] = I - (E - u) + (p - u), Qt[3] = E;
  const F = Vr(4, fn, 4, Qt, ga);
  d = M * c, C = Ut * M, y = C - (C - M), w = M - y, C = Ut * c, l = C - (C - c), f = c - l, h = w * f - (d - y * l - w * l - y * f), m = S * g, C = Ut * S, y = C - (C - S), w = S - y, C = Ut * g, l = C - (C - g), f = g - l, v = w * f - (m - y * l - w * l - y * f), p = h - v, u = h - p, Qt[0] = h - (p + u) + (u - v), I = d + p, u = I - d, b = d - (I - u) + (p - u), p = b - m, u = b - p, Qt[1] = b - (p + u) + (u - m), E = I + p, u = E - I, Qt[2] = I - (E - u) + (p - u), Qt[3] = E;
  const N = Vr(F, ga, 4, Qt, ca);
  d = a * c, C = Ut * a, y = C - (C - a), w = a - y, C = Ut * c, l = C - (C - c), f = c - l, h = w * f - (d - y * l - w * l - y * f), m = A * g, C = Ut * A, y = C - (C - A), w = A - y, C = Ut * g, l = C - (C - g), f = g - l, v = w * f - (m - y * l - w * l - y * f), p = h - v, u = h - p, Qt[0] = h - (p + u) + (u - v), I = d + p, u = I - d, b = d - (I - u) + (p - u), p = b - m, u = b - p, Qt[1] = b - (p + u) + (u - m), E = I + p, u = E - I, Qt[2] = I - (E - u) + (p - u), Qt[3] = E;
  const R = Vr(N, ca, 4, Qt, la);
  return la[R - 1];
}
function Hu(e, t, n, i, r, s) {
  const o = (t - s) * (n - r), a = (e - r) * (i - s), A = o - a, g = Math.abs(o + a);
  return Math.abs(A) >= Zu * g ? A : -Yu(e, t, n, i, r, s, g);
}
function Qu(e, t) {
  var n, i, r = 0, s, o, a, A, g, c, u, C = e[0], y = e[1], w = t.length;
  for (n = 0; n < w; n++) {
    i = 0;
    var l = t[n], f = l.length - 1;
    if (c = l[0], c[0] !== l[f][0] && c[1] !== l[f][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (o = c[0] - C, a = c[1] - y, i; i < f; i++) {
      if (u = l[i + 1], A = u[0] - C, g = u[1] - y, a === 0 && g === 0) {
        if (A <= 0 && o >= 0 || o <= 0 && A >= 0)
          return 0;
      } else if (g >= 0 && a <= 0 || g <= 0 && a >= 0) {
        if (s = Hu(o, A, a, g, 0, 0), s === 0)
          return 0;
        (s > 0 && g > 0 && a <= 0 || s < 0 && g <= 0 && a > 0) && r++;
      }
      c = u, a = g, o = A;
    }
  }
  return r % 2 !== 0;
}
function ye(e, t, n = {}) {
  if (!e)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = Gu(e), r = zu(t), s = r.type, o = t.bbox;
  let a = r.coordinates;
  if (o && Ku(i, o) === !1)
    return !1;
  s === "Polygon" && (a = [a]);
  for (var A = 0; A < a.length; ++A) {
    const g = Qu(i, a[A]);
    if (g === 0 && !n.ignoreBoundary || g) return !0;
  }
  return !1;
}
function Ku(e, t) {
  return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
}
class Ju {
  constructor(t = [], n = qu) {
    if (this.data = t, this.length = this.data.length, this.compare = n, this.length > 0)
      for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
  }
  push(t) {
    this.data.push(t), this.length++, this._up(this.length - 1);
  }
  pop() {
    if (this.length === 0) return;
    const t = this.data[0], n = this.data.pop();
    return this.length--, this.length > 0 && (this.data[0] = n, this._down(0)), t;
  }
  peek() {
    return this.data[0];
  }
  _up(t) {
    const { data: n, compare: i } = this, r = n[t];
    for (; t > 0; ) {
      const s = t - 1 >> 1, o = n[s];
      if (i(r, o) >= 0) break;
      n[t] = o, t = s;
    }
    n[t] = r;
  }
  _down(t) {
    const { data: n, compare: i } = this, r = this.length >> 1, s = n[t];
    for (; t < r; ) {
      let o = (t << 1) + 1, a = n[o];
      const A = o + 1;
      if (A < this.length && i(n[A], a) < 0 && (o = A, a = n[A]), i(a, s) >= 0) break;
      n[t] = a, t = o;
    }
    n[t] = s;
  }
}
function qu(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
const $u = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ju
}, Symbol.toStringTag, { value: "Module" }));
function th(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function eh(e) {
  if (Object.prototype.hasOwnProperty.call(e, "__esModule")) return e;
  var t = e.default;
  if (typeof t == "function") {
    var n = function i() {
      var r = !1;
      try {
        r = this instanceof i;
      } catch {
      }
      return r ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(i) {
    var r = Object.getOwnPropertyDescriptor(e, i);
    Object.defineProperty(n, i, r.get ? r : {
      enumerable: !0,
      get: function() {
        return e[i];
      }
    });
  }), n;
}
var Gi = { exports: {} }, Ts = { exports: {} }, nh = Ts.exports, ua;
function ih() {
  return ua || (ua = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(nh, function() {
      function n(I, b, d, h, m) {
        (function v(E, M, x, S, _) {
          for (; S > x; ) {
            if (S - x > 600) {
              var P = S - x + 1, D = M - x + 1, F = Math.log(P), N = 0.5 * Math.exp(2 * F / 3), R = 0.5 * Math.sqrt(F * N * (P - N) / P) * (D - P / 2 < 0 ? -1 : 1), B = Math.max(x, Math.floor(M - D * N / P + R)), k = Math.min(S, Math.floor(M + (P - D) * N / P + R));
              v(E, M, B, k, _);
            }
            var j = E[M], z = x, U = S;
            for (i(E, x, M), _(E[S], j) > 0 && i(E, x, S); z < U; ) {
              for (i(E, z, U), z++, U--; _(E[z], j) < 0; ) z++;
              for (; _(E[U], j) > 0; ) U--;
            }
            _(E[x], j) === 0 ? i(E, x, U) : i(E, ++U, S), U <= M && (x = U + 1), M <= U && (S = U - 1);
          }
        })(I, b, d || 0, h || I.length - 1, m || r);
      }
      function i(I, b, d) {
        var h = I[b];
        I[b] = I[d], I[d] = h;
      }
      function r(I, b) {
        return I < b ? -1 : I > b ? 1 : 0;
      }
      var s = function(I) {
        I === void 0 && (I = 9), this._maxEntries = Math.max(4, I), this._minEntries = Math.max(2, Math.ceil(0.4 * this._maxEntries)), this.clear();
      };
      function o(I, b, d) {
        if (!d) return b.indexOf(I);
        for (var h = 0; h < b.length; h++) if (d(I, b[h])) return h;
        return -1;
      }
      function a(I, b) {
        A(I, 0, I.children.length, b, I);
      }
      function A(I, b, d, h, m) {
        m || (m = f(null)), m.minX = 1 / 0, m.minY = 1 / 0, m.maxX = -1 / 0, m.maxY = -1 / 0;
        for (var v = b; v < d; v++) {
          var E = I.children[v];
          g(m, I.leaf ? h(E) : E);
        }
        return m;
      }
      function g(I, b) {
        return I.minX = Math.min(I.minX, b.minX), I.minY = Math.min(I.minY, b.minY), I.maxX = Math.max(I.maxX, b.maxX), I.maxY = Math.max(I.maxY, b.maxY), I;
      }
      function c(I, b) {
        return I.minX - b.minX;
      }
      function u(I, b) {
        return I.minY - b.minY;
      }
      function C(I) {
        return (I.maxX - I.minX) * (I.maxY - I.minY);
      }
      function y(I) {
        return I.maxX - I.minX + (I.maxY - I.minY);
      }
      function w(I, b) {
        return I.minX <= b.minX && I.minY <= b.minY && b.maxX <= I.maxX && b.maxY <= I.maxY;
      }
      function l(I, b) {
        return b.minX <= I.maxX && b.minY <= I.maxY && b.maxX >= I.minX && b.maxY >= I.minY;
      }
      function f(I) {
        return { children: I, height: 1, leaf: !0, minX: 1 / 0, minY: 1 / 0, maxX: -1 / 0, maxY: -1 / 0 };
      }
      function p(I, b, d, h, m) {
        for (var v = [b, d]; v.length; ) if (!((d = v.pop()) - (b = v.pop()) <= h)) {
          var E = b + Math.ceil((d - b) / h / 2) * h;
          n(I, E, b, d, m), v.push(b, E, E, d);
        }
      }
      return s.prototype.all = function() {
        return this._all(this.data, []);
      }, s.prototype.search = function(I) {
        var b = this.data, d = [];
        if (!l(I, b)) return d;
        for (var h = this.toBBox, m = []; b; ) {
          for (var v = 0; v < b.children.length; v++) {
            var E = b.children[v], M = b.leaf ? h(E) : E;
            l(I, M) && (b.leaf ? d.push(E) : w(I, M) ? this._all(E, d) : m.push(E));
          }
          b = m.pop();
        }
        return d;
      }, s.prototype.collides = function(I) {
        var b = this.data;
        if (!l(I, b)) return !1;
        for (var d = []; b; ) {
          for (var h = 0; h < b.children.length; h++) {
            var m = b.children[h], v = b.leaf ? this.toBBox(m) : m;
            if (l(I, v)) {
              if (b.leaf || w(I, v)) return !0;
              d.push(m);
            }
          }
          b = d.pop();
        }
        return !1;
      }, s.prototype.load = function(I) {
        if (!I || !I.length) return this;
        if (I.length < this._minEntries) {
          for (var b = 0; b < I.length; b++) this.insert(I[b]);
          return this;
        }
        var d = this._build(I.slice(), 0, I.length - 1, 0);
        if (this.data.children.length) if (this.data.height === d.height) this._splitRoot(this.data, d);
        else {
          if (this.data.height < d.height) {
            var h = this.data;
            this.data = d, d = h;
          }
          this._insert(d, this.data.height - d.height - 1, !0);
        }
        else this.data = d;
        return this;
      }, s.prototype.insert = function(I) {
        return I && this._insert(I, this.data.height - 1), this;
      }, s.prototype.clear = function() {
        return this.data = f([]), this;
      }, s.prototype.remove = function(I, b) {
        if (!I) return this;
        for (var d, h, m, v = this.data, E = this.toBBox(I), M = [], x = []; v || M.length; ) {
          if (v || (v = M.pop(), h = M[M.length - 1], d = x.pop(), m = !0), v.leaf) {
            var S = o(I, v.children, b);
            if (S !== -1) return v.children.splice(S, 1), M.push(v), this._condense(M), this;
          }
          m || v.leaf || !w(v, E) ? h ? (d++, v = h.children[d], m = !1) : v = null : (M.push(v), x.push(d), d = 0, h = v, v = v.children[0]);
        }
        return this;
      }, s.prototype.toBBox = function(I) {
        return I;
      }, s.prototype.compareMinX = function(I, b) {
        return I.minX - b.minX;
      }, s.prototype.compareMinY = function(I, b) {
        return I.minY - b.minY;
      }, s.prototype.toJSON = function() {
        return this.data;
      }, s.prototype.fromJSON = function(I) {
        return this.data = I, this;
      }, s.prototype._all = function(I, b) {
        for (var d = []; I; ) I.leaf ? b.push.apply(b, I.children) : d.push.apply(d, I.children), I = d.pop();
        return b;
      }, s.prototype._build = function(I, b, d, h) {
        var m, v = d - b + 1, E = this._maxEntries;
        if (v <= E) return a(m = f(I.slice(b, d + 1)), this.toBBox), m;
        h || (h = Math.ceil(Math.log(v) / Math.log(E)), E = Math.ceil(v / Math.pow(E, h - 1))), (m = f([])).leaf = !1, m.height = h;
        var M = Math.ceil(v / E), x = M * Math.ceil(Math.sqrt(E));
        p(I, b, d, x, this.compareMinX);
        for (var S = b; S <= d; S += x) {
          var _ = Math.min(S + x - 1, d);
          p(I, S, _, M, this.compareMinY);
          for (var P = S; P <= _; P += M) {
            var D = Math.min(P + M - 1, _);
            m.children.push(this._build(I, P, D, h - 1));
          }
        }
        return a(m, this.toBBox), m;
      }, s.prototype._chooseSubtree = function(I, b, d, h) {
        for (; h.push(b), !b.leaf && h.length - 1 !== d; ) {
          for (var m = 1 / 0, v = 1 / 0, E = void 0, M = 0; M < b.children.length; M++) {
            var x = b.children[M], S = C(x), _ = (P = I, D = x, (Math.max(D.maxX, P.maxX) - Math.min(D.minX, P.minX)) * (Math.max(D.maxY, P.maxY) - Math.min(D.minY, P.minY)) - S);
            _ < v ? (v = _, m = S < m ? S : m, E = x) : _ === v && S < m && (m = S, E = x);
          }
          b = E || b.children[0];
        }
        var P, D;
        return b;
      }, s.prototype._insert = function(I, b, d) {
        var h = d ? I : this.toBBox(I), m = [], v = this._chooseSubtree(h, this.data, b, m);
        for (v.children.push(I), g(v, h); b >= 0 && m[b].children.length > this._maxEntries; ) this._split(m, b), b--;
        this._adjustParentBBoxes(h, m, b);
      }, s.prototype._split = function(I, b) {
        var d = I[b], h = d.children.length, m = this._minEntries;
        this._chooseSplitAxis(d, m, h);
        var v = this._chooseSplitIndex(d, m, h), E = f(d.children.splice(v, d.children.length - v));
        E.height = d.height, E.leaf = d.leaf, a(d, this.toBBox), a(E, this.toBBox), b ? I[b - 1].children.push(E) : this._splitRoot(d, E);
      }, s.prototype._splitRoot = function(I, b) {
        this.data = f([I, b]), this.data.height = I.height + 1, this.data.leaf = !1, a(this.data, this.toBBox);
      }, s.prototype._chooseSplitIndex = function(I, b, d) {
        for (var h, m, v, E, M, x, S, _ = 1 / 0, P = 1 / 0, D = b; D <= d - b; D++) {
          var F = A(I, 0, D, this.toBBox), N = A(I, D, d, this.toBBox), R = (m = F, v = N, E = void 0, M = void 0, x = void 0, S = void 0, E = Math.max(m.minX, v.minX), M = Math.max(m.minY, v.minY), x = Math.min(m.maxX, v.maxX), S = Math.min(m.maxY, v.maxY), Math.max(0, x - E) * Math.max(0, S - M)), B = C(F) + C(N);
          R < _ ? (_ = R, h = D, P = B < P ? B : P) : R === _ && B < P && (P = B, h = D);
        }
        return h || d - b;
      }, s.prototype._chooseSplitAxis = function(I, b, d) {
        var h = I.leaf ? this.compareMinX : c, m = I.leaf ? this.compareMinY : u;
        this._allDistMargin(I, b, d, h) < this._allDistMargin(I, b, d, m) && I.children.sort(h);
      }, s.prototype._allDistMargin = function(I, b, d, h) {
        I.children.sort(h);
        for (var m = this.toBBox, v = A(I, 0, b, m), E = A(I, d - b, d, m), M = y(v) + y(E), x = b; x < d - b; x++) {
          var S = I.children[x];
          g(v, I.leaf ? m(S) : S), M += y(v);
        }
        for (var _ = d - b - 1; _ >= b; _--) {
          var P = I.children[_];
          g(E, I.leaf ? m(P) : P), M += y(E);
        }
        return M;
      }, s.prototype._adjustParentBBoxes = function(I, b, d) {
        for (var h = d; h >= 0; h--) g(b[h], I);
      }, s.prototype._condense = function(I) {
        for (var b = I.length - 1, d = void 0; b >= 0; b--) I[b].children.length === 0 ? b > 0 ? (d = I[b - 1].children).splice(d.indexOf(I[b]), 1) : this.clear() : a(I[b], this.toBBox);
      }, s;
    });
  })(Ts)), Ts.exports;
}
const rh = /* @__PURE__ */ eh($u);
var Kn = { exports: {} }, ha, Ia;
function sh() {
  return Ia || (Ia = 1, ha = function(e, t, n, i) {
    var r = e[0], s = e[1], o = !1;
    n === void 0 && (n = 0), i === void 0 && (i = t.length);
    for (var a = (i - n) / 2, A = 0, g = a - 1; A < a; g = A++) {
      var c = t[n + A * 2 + 0], u = t[n + A * 2 + 1], C = t[n + g * 2 + 0], y = t[n + g * 2 + 1], w = u > s != y > s && r < (C - c) * (s - u) / (y - u) + c;
      w && (o = !o);
    }
    return o;
  }), ha;
}
var Ca, fa;
function oh() {
  return fa || (fa = 1, Ca = function(e, t, n, i) {
    var r = e[0], s = e[1], o = !1;
    n === void 0 && (n = 0), i === void 0 && (i = t.length);
    for (var a = i - n, A = 0, g = a - 1; A < a; g = A++) {
      var c = t[A + n][0], u = t[A + n][1], C = t[g + n][0], y = t[g + n][1], w = u > s != y > s && r < (C - c) * (s - u) / (y - u) + c;
      w && (o = !o);
    }
    return o;
  }), Ca;
}
var pa;
function ah() {
  if (pa) return Kn.exports;
  pa = 1;
  var e = sh(), t = oh();
  return Kn.exports = function(n, i, r, s) {
    return i.length > 0 && Array.isArray(i[0]) ? t(n, i, r, s) : e(n, i, r, s);
  }, Kn.exports.nested = t, Kn.exports.flat = e, Kn.exports;
}
var tr = { exports: {} }, Ah = tr.exports, da;
function gh() {
  return da || (da = 1, (function(e, t) {
    (function(n, i) {
      i(t);
    })(Ah, function(n) {
      const i = 33306690738754706e-32;
      function r(w, l, f, p, I) {
        let b, d, h, m, v = l[0], E = p[0], M = 0, x = 0;
        E > v == E > -v ? (b = v, v = l[++M]) : (b = E, E = p[++x]);
        let S = 0;
        if (M < w && x < f) for (E > v == E > -v ? (h = b - ((d = v + b) - v), v = l[++M]) : (h = b - ((d = E + b) - E), E = p[++x]), b = d, h !== 0 && (I[S++] = h); M < w && x < f; ) E > v == E > -v ? (h = b - ((d = b + v) - (m = d - b)) + (v - m), v = l[++M]) : (h = b - ((d = b + E) - (m = d - b)) + (E - m), E = p[++x]), b = d, h !== 0 && (I[S++] = h);
        for (; M < w; ) h = b - ((d = b + v) - (m = d - b)) + (v - m), v = l[++M], b = d, h !== 0 && (I[S++] = h);
        for (; x < f; ) h = b - ((d = b + E) - (m = d - b)) + (E - m), E = p[++x], b = d, h !== 0 && (I[S++] = h);
        return b === 0 && S !== 0 || (I[S++] = b), S;
      }
      function s(w) {
        return new Float64Array(w);
      }
      const o = 33306690738754716e-32, a = 22204460492503146e-32, A = 11093356479670487e-47, g = s(4), c = s(8), u = s(12), C = s(16), y = s(4);
      n.orient2d = function(w, l, f, p, I, b) {
        const d = (l - b) * (f - I), h = (w - I) * (p - b), m = d - h;
        if (d === 0 || h === 0 || d > 0 != h > 0) return m;
        const v = Math.abs(d + h);
        return Math.abs(m) >= o * v ? m : -(function(E, M, x, S, _, P, D) {
          let F, N, R, B, k, j, z, U, J, tt, W, $, ot, et, Y, q, K, ct;
          const yt = E - _, wt = x - _, ht = M - P, lt = S - P;
          k = (Y = (U = yt - (z = (j = 134217729 * yt) - (j - yt))) * (tt = lt - (J = (j = 134217729 * lt) - (j - lt))) - ((et = yt * lt) - z * J - U * J - z * tt)) - (W = Y - (K = (U = ht - (z = (j = 134217729 * ht) - (j - ht))) * (tt = wt - (J = (j = 134217729 * wt) - (j - wt))) - ((q = ht * wt) - z * J - U * J - z * tt))), g[0] = Y - (W + k) + (k - K), k = (ot = et - (($ = et + W) - (k = $ - et)) + (W - k)) - (W = ot - q), g[1] = ot - (W + k) + (k - q), k = (ct = $ + W) - $, g[2] = $ - (ct - k) + (W - k), g[3] = ct;
          let O = (function(rt, ut) {
            let gt = ut[0];
            for (let bt = 1; bt < rt; bt++) gt += ut[bt];
            return gt;
          })(4, g), G = a * D;
          if (O >= G || -O >= G || (F = E - (yt + (k = E - yt)) + (k - _), R = x - (wt + (k = x - wt)) + (k - _), N = M - (ht + (k = M - ht)) + (k - P), B = S - (lt + (k = S - lt)) + (k - P), F === 0 && N === 0 && R === 0 && B === 0) || (G = A * D + i * Math.abs(O), (O += yt * B + lt * F - (ht * R + wt * N)) >= G || -O >= G)) return O;
          k = (Y = (U = F - (z = (j = 134217729 * F) - (j - F))) * (tt = lt - (J = (j = 134217729 * lt) - (j - lt))) - ((et = F * lt) - z * J - U * J - z * tt)) - (W = Y - (K = (U = N - (z = (j = 134217729 * N) - (j - N))) * (tt = wt - (J = (j = 134217729 * wt) - (j - wt))) - ((q = N * wt) - z * J - U * J - z * tt))), y[0] = Y - (W + k) + (k - K), k = (ot = et - (($ = et + W) - (k = $ - et)) + (W - k)) - (W = ot - q), y[1] = ot - (W + k) + (k - q), k = (ct = $ + W) - $, y[2] = $ - (ct - k) + (W - k), y[3] = ct;
          const H = r(4, g, 4, y, c);
          k = (Y = (U = yt - (z = (j = 134217729 * yt) - (j - yt))) * (tt = B - (J = (j = 134217729 * B) - (j - B))) - ((et = yt * B) - z * J - U * J - z * tt)) - (W = Y - (K = (U = ht - (z = (j = 134217729 * ht) - (j - ht))) * (tt = R - (J = (j = 134217729 * R) - (j - R))) - ((q = ht * R) - z * J - U * J - z * tt))), y[0] = Y - (W + k) + (k - K), k = (ot = et - (($ = et + W) - (k = $ - et)) + (W - k)) - (W = ot - q), y[1] = ot - (W + k) + (k - q), k = (ct = $ + W) - $, y[2] = $ - (ct - k) + (W - k), y[3] = ct;
          const Q = r(H, c, 4, y, u);
          k = (Y = (U = F - (z = (j = 134217729 * F) - (j - F))) * (tt = B - (J = (j = 134217729 * B) - (j - B))) - ((et = F * B) - z * J - U * J - z * tt)) - (W = Y - (K = (U = N - (z = (j = 134217729 * N) - (j - N))) * (tt = R - (J = (j = 134217729 * R) - (j - R))) - ((q = N * R) - z * J - U * J - z * tt))), y[0] = Y - (W + k) + (k - K), k = (ot = et - (($ = et + W) - (k = $ - et)) + (W - k)) - (W = ot - q), y[1] = ot - (W + k) + (k - q), k = (ct = $ + W) - $, y[2] = $ - (ct - k) + (W - k), y[3] = ct;
          const at = r(Q, u, 4, y, C);
          return C[at - 1];
        })(w, l, f, p, I, b, v);
      }, n.orient2dfast = function(w, l, f, p, I, b) {
        return (l - b) * (f - I) - (w - I) * (p - b);
      }, Object.defineProperty(n, "__esModule", { value: !0 });
    });
  })(tr, tr.exports)), tr.exports;
}
var ma;
function ch() {
  if (ma) return Gi.exports;
  ma = 1;
  var e = ih(), t = rh, n = ah(), i = gh().orient2d;
  t.default && (t = t.default), Gi.exports = r, Gi.exports.default = r;
  function r(d, h, m) {
    h = Math.max(0, h === void 0 ? 2 : h), m = m || 0;
    var v = y(d), E = new e(16);
    E.toBBox = function(U) {
      return {
        minX: U[0],
        minY: U[1],
        maxX: U[0],
        maxY: U[1]
      };
    }, E.compareMinX = function(U, J) {
      return U[0] - J[0];
    }, E.compareMinY = function(U, J) {
      return U[1] - J[1];
    }, E.load(d);
    for (var M = [], x = 0, S; x < v.length; x++) {
      var _ = v[x];
      E.remove(_), S = w(_, S), M.push(S);
    }
    var P = new e(16);
    for (x = 0; x < M.length; x++) P.insert(C(M[x]));
    for (var D = h * h, F = m * m; M.length; ) {
      var N = M.shift(), R = N.p, B = N.next.p, k = l(R, B);
      if (!(k < F)) {
        var j = k / D;
        _ = s(E, N.prev.p, R, B, N.next.next.p, j, P), _ && Math.min(l(_, R), l(_, B)) <= j && (M.push(N), M.push(w(_, N)), E.remove(_), P.remove(N), P.insert(C(N)), P.insert(C(N.next)));
      }
    }
    N = S;
    var z = [];
    do
      z.push(N.p), N = N.next;
    while (N !== S);
    return z.push(N.p), z;
  }
  function s(d, h, m, v, E, M, x) {
    for (var S = new t([], o), _ = d.data; _; ) {
      for (var P = 0; P < _.children.length; P++) {
        var D = _.children[P], F = _.leaf ? f(D, m, v) : a(m, v, D);
        F > M || S.push({
          node: D,
          dist: F
        });
      }
      for (; S.length && !S.peek().node.children; ) {
        var N = S.pop(), R = N.node, B = f(R, h, m), k = f(R, v, E);
        if (N.dist < B && N.dist < k && g(m, R, x) && g(v, R, x)) return R;
      }
      _ = S.pop(), _ && (_ = _.node);
    }
    return null;
  }
  function o(d, h) {
    return d.dist - h.dist;
  }
  function a(d, h, m) {
    if (A(d, m) || A(h, m)) return 0;
    var v = p(d[0], d[1], h[0], h[1], m.minX, m.minY, m.maxX, m.minY);
    if (v === 0) return 0;
    var E = p(d[0], d[1], h[0], h[1], m.minX, m.minY, m.minX, m.maxY);
    if (E === 0) return 0;
    var M = p(d[0], d[1], h[0], h[1], m.maxX, m.minY, m.maxX, m.maxY);
    if (M === 0) return 0;
    var x = p(d[0], d[1], h[0], h[1], m.minX, m.maxY, m.maxX, m.maxY);
    return x === 0 ? 0 : Math.min(v, E, M, x);
  }
  function A(d, h) {
    return d[0] >= h.minX && d[0] <= h.maxX && d[1] >= h.minY && d[1] <= h.maxY;
  }
  function g(d, h, m) {
    for (var v = Math.min(d[0], h[0]), E = Math.min(d[1], h[1]), M = Math.max(d[0], h[0]), x = Math.max(d[1], h[1]), S = m.search({ minX: v, minY: E, maxX: M, maxY: x }), _ = 0; _ < S.length; _++)
      if (u(S[_].p, S[_].next.p, d, h)) return !1;
    return !0;
  }
  function c(d, h, m) {
    return i(d[0], d[1], h[0], h[1], m[0], m[1]);
  }
  function u(d, h, m, v) {
    return d !== v && h !== m && c(d, h, m) > 0 != c(d, h, v) > 0 && c(m, v, d) > 0 != c(m, v, h) > 0;
  }
  function C(d) {
    var h = d.p, m = d.next.p;
    return d.minX = Math.min(h[0], m[0]), d.minY = Math.min(h[1], m[1]), d.maxX = Math.max(h[0], m[0]), d.maxY = Math.max(h[1], m[1]), d;
  }
  function y(d) {
    for (var h = d[0], m = d[0], v = d[0], E = d[0], M = 0; M < d.length; M++) {
      var x = d[M];
      x[0] < h[0] && (h = x), x[0] > v[0] && (v = x), x[1] < m[1] && (m = x), x[1] > E[1] && (E = x);
    }
    var S = [h, m, v, E], _ = S.slice();
    for (M = 0; M < d.length; M++)
      n(d[M], S) || _.push(d[M]);
    return b(_);
  }
  function w(d, h) {
    var m = {
      p: d,
      prev: null,
      next: null,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0
    };
    return h ? (m.next = h.next, m.prev = h, h.next.prev = m, h.next = m) : (m.prev = m, m.next = m), m;
  }
  function l(d, h) {
    var m = d[0] - h[0], v = d[1] - h[1];
    return m * m + v * v;
  }
  function f(d, h, m) {
    var v = h[0], E = h[1], M = m[0] - v, x = m[1] - E;
    if (M !== 0 || x !== 0) {
      var S = ((d[0] - v) * M + (d[1] - E) * x) / (M * M + x * x);
      S > 1 ? (v = m[0], E = m[1]) : S > 0 && (v += M * S, E += x * S);
    }
    return M = d[0] - v, x = d[1] - E, M * M + x * x;
  }
  function p(d, h, m, v, E, M, x, S) {
    var _ = m - d, P = v - h, D = x - E, F = S - M, N = d - E, R = h - M, B = _ * _ + P * P, k = _ * D + P * F, j = D * D + F * F, z = _ * N + P * R, U = D * N + F * R, J = B * j - k * k, tt, W, $, ot, et = J, Y = J;
    J === 0 ? (W = 0, et = 1, ot = U, Y = j) : (W = k * U - j * z, ot = B * U - k * z, W < 0 ? (W = 0, ot = U, Y = j) : W > et && (W = et, ot = U + k, Y = j)), ot < 0 ? (ot = 0, -z < 0 ? W = 0 : -z > B ? W = et : (W = -z, et = B)) : ot > Y && (ot = Y, -z + k < 0 ? W = 0 : -z + k > B ? W = et : (W = -z + k, et = B)), tt = W === 0 ? 0 : W / et, $ = ot === 0 ? 0 : ot / Y;
    var q = (1 - tt) * d + tt * m, K = (1 - tt) * h + tt * v, ct = (1 - $) * E + $ * x, yt = (1 - $) * M + $ * S, wt = ct - q, ht = yt - K;
    return wt * wt + ht * ht;
  }
  function I(d, h) {
    return d[0] === h[0] ? d[1] - h[1] : d[0] - h[0];
  }
  function b(d) {
    d.sort(I);
    for (var h = [], m = 0; m < d.length; m++) {
      for (; h.length >= 2 && c(h[h.length - 2], h[h.length - 1], d[m]) <= 0; )
        h.pop();
      h.push(d[m]);
    }
    for (var v = [], E = d.length - 1; E >= 0; E--) {
      for (; v.length >= 2 && c(v[v.length - 2], v[v.length - 1], d[E]) <= 0; )
        v.pop();
      v.push(d[E]);
    }
    return v.pop(), h.pop(), h.concat(v);
  }
  return Gi.exports;
}
var lh = ch();
const uh = /* @__PURE__ */ th(lh);
function hh(e, t = {}) {
  t.concavity = t.concavity || 1 / 0;
  const n = [];
  if (hg(e, (r) => {
    n.push([r[0], r[1]]);
  }), !n.length)
    return null;
  const i = uh(n, t.concavity);
  return i.length > 3 ? Mn([i], t.properties) : null;
}
function er(e, t, n) {
  if (n) {
    const i = e.geometry.coordinates, r = Vt(i[0], n.xOrigin, n.xUnit, n.gridNum), s = Vt(i[1], n.yOrigin, n.yUnit, n.gridNum), o = n.gridCache[r]?.[s] ?? [];
    for (const a of o) {
      const A = t.features[a];
      if (A && ye(e, A)) return A;
    }
    return;
  }
  for (let i = 0; i < t.features.length; i++)
    if (ye(e, t.features[i]))
      return t.features[i];
}
function Ig(e, t) {
  const n = t.geometry.coordinates[0][0], i = t.geometry.coordinates[0][1], r = t.geometry.coordinates[0][2], s = e.geometry.coordinates, o = t.properties.a.geom, a = t.properties.b.geom, A = t.properties.c.geom, g = [i[0] - n[0], i[1] - n[1]], c = [r[0] - n[0], r[1] - n[1]], u = [s[0] - n[0], s[1] - n[1]], C = [a[0] - o[0], a[1] - o[1]], y = [A[0] - o[0], A[1] - o[1]], w = (c[1] * u[0] - c[0] * u[1]) / (g[0] * c[1] - g[1] * c[0]), l = (g[0] * u[1] - g[1] * u[0]) / (g[0] * c[1] - g[1] * c[0]);
  return [
    w * C[0] + l * y[0] + o[0],
    w * C[1] + l * y[1] + o[1]
  ];
}
function Ih(e, t, n) {
  const i = e.geometry.coordinates, r = n.geometry.coordinates, s = Math.atan2(i[0] - r[0], i[1] - r[1]), o = ph(s, t[0]);
  if (o === void 0)
    throw new Error("Unable to determine vertex index");
  const a = t[1][o];
  return Ig(e, a.features[0]);
}
function Ch(e, t, n, i, r, s, o, a, A) {
  let g = A;
  if (!g && o && (g = er(e, rn([o]))), !g)
    if (n) {
      const c = e.geometry.coordinates, u = n.gridNum, C = n.xOrigin, y = n.yOrigin, w = n.xUnit, l = n.yUnit, f = n.gridCache, p = Vt(c[0], C, w, u), I = Vt(c[1], y, l, u), b = f[p] ? f[p][I] ? f[p][I] : [] : [], d = rn(b.map((h) => t.features[h]));
      g = er(e, d);
    } else
      g = er(e, t);
  return a && a(g), g ? Ig(e, g) : Ih(e, i, r);
}
function Vt(e, t, n, i) {
  let r = Math.floor((e - t) / n);
  return r < 0 && (r = 0), r >= i && (r = i - 1), r;
}
const fh = 36;
function ya(e, t, n) {
  const i = (t[1][0] - t[0][0]) / n, r = (t[1][1] - t[0][1]) / n;
  return e.reduce((s, o) => {
    const a = Vt(o[0][0], t[0][0], i, n), A = Vt(o[1][0], t[0][0], i, n), g = Vt(o[0][1], t[0][1], r, n), c = Vt(o[1][1], t[0][1], r, n), u = (A - a + 1) * (c - g + 1);
    return u > 0 ? s + u : s;
  }, 0);
}
function ph(e, t) {
  let n = va(e - t[0]), i = Math.PI * 2, r;
  for (let s = 0; s < t.length; s++) {
    const o = (s + 1) % t.length, a = va(e - t[o]), A = Math.min(Math.abs(n), Math.abs(a));
    n * a <= 0 && A < i && (i = A, r = s), n = a;
  }
  return r;
}
function va(e, t = !1) {
  const n = 2 * Math.PI, i = e - Math.floor(e / n) * n;
  return t ? i : i > Math.PI ? i - n : i;
}
function dh(e) {
  const t = [0, 1, 2, 0].map((i) => e[i][0][0]), n = {
    a: { geom: e[0][0][1], index: e[0][1] },
    b: { geom: e[1][0][1], index: e[1][1] },
    c: { geom: e[2][0][1], index: e[2][1] }
  };
  return Mn([t], n);
}
function _s(e, t, n, i, r, s = !1, o) {
  const a = e.map(
    (A) => {
      (!o || o < 2.00703) && (A = mh(A));
      const g = isFinite(A) ? t[A] : A === "c" ? i : (function() {
        const c = A.match(/^b(\d+)$/);
        if (c) return r[parseInt(c[1])];
        const u = A.match(/^e(\d+)$/);
        if (u) return n[parseInt(u[1])];
        throw new Error("Bad index value for indexesToTri");
      })();
      return s ? [[g[1], g[0]], A] : [[g[0], g[1]], A];
    }
  );
  return dh(a);
}
function mh(e) {
  return typeof e == "number" ? e : e.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
}
function yh(e, t) {
  return t && t >= 2.00703 || Array.isArray(e[0]) ? e : e.map((n) => [
    n.illstNodes,
    n.mercNodes,
    n.startEnd
  ]);
}
const vh = 2.00704;
function wh(e) {
  return !!(e.version !== void 0 || !e.tins && e.points && e.tins_points);
}
function bh(e) {
  return {
    points: e.points,
    strictStatus: oi(e),
    verticesParams: xh(e),
    centroid: Mh(e),
    edges: yh(e.edges || []),
    edgeNodes: e.edgeNodes || [],
    tins: Sh(e),
    kinks: Th(e.kinks_points),
    yaxisMode: e.yaxisMode ?? "invert",
    strictMode: e.strictMode ?? "auto",
    vertexMode: e.vertexMode,
    bounds: e.bounds,
    boundsPolygon: e.boundsPolygon,
    wh: e.wh,
    xy: e.xy ?? [0, 0]
  };
}
function Eh(e) {
  const t = _h(e), n = t.tins, i = t.vertices_params;
  return i != null && Cg(i), {
    compiled: t,
    tins: n,
    points: kh(n),
    strictStatus: t.strict_status,
    verticesParams: i,
    centroid: t.centroid,
    kinks: t.kinks
  };
}
function oi(e) {
  return e.strict_status ? e.strict_status : e.kinks_points ? "strict_error" : Array.isArray(e.tins_points) && e.tins_points.length === 2 ? "loose" : "strict";
}
function xh(e) {
  if ("outerTransform" in e && e.outerTransform === "worldFile" && !e.vertices_params)
    return { forw: [[], []], bakw: [[], []] };
  if (!Array.isArray(e.vertices_params) || !Array.isArray(e.vertices_points))
    throw new Error(
      "Invalid compiled data: vertices_params and vertices_points must be arrays"
    );
  const t = {
    forw: [e.vertices_params[0]],
    bakw: [e.vertices_params[1]]
  };
  return t.forw[1] = wa(e, !1), t.bakw[1] = wa(e, !0), Cg(t), t;
}
function Cg(e) {
  if (typeof e != "object")
    throw new Error("Invalid compiled data: vertices_params has a wrong shape");
  ["forw", "bakw"].forEach((t) => {
    const n = e[t];
    if (n == null) return;
    const i = `vertices_params.${t}`, r = n[0], s = n[1];
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
function wa(e, t) {
  const n = e.vertices_points.length;
  return Array.from({ length: n }, (i, r) => {
    const s = (r + 1) % n, o = _s(
      ["c", `b${r}`, `b${s}`],
      e.points,
      e.edgeNodes || [],
      e.centroid_point,
      e.vertices_points,
      t,
      vh
    );
    return rn([o]);
  });
}
function Mh(e) {
  return {
    forw: ge(e.centroid_point[0], {
      target: {
        geom: e.centroid_point[1],
        index: "c"
      }
    }),
    bakw: ge(e.centroid_point[1], {
      target: {
        geom: e.centroid_point[0],
        index: "c"
      }
    })
  };
}
function Sh(e) {
  const t = e.tins_points.length === 1 ? 0 : 1;
  return {
    forw: rn(
      e.tins_points[0].map(
        (n) => _s(
          n,
          e.points,
          e.edgeNodes || [],
          e.centroid_point,
          e.vertices_points,
          !1,
          e.version
        )
      )
    ),
    bakw: rn(
      e.tins_points[t].map(
        (n) => _s(
          n,
          e.points,
          e.edgeNodes || [],
          e.centroid_point,
          e.vertices_points,
          !0,
          e.version
        )
      )
    )
  };
}
function Th(e) {
  if (e)
    return {
      bakw: rn(
        e.map((t) => ge(t))
      )
    };
}
function _h(e) {
  return JSON.parse(
    JSON.stringify(e).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"')
  );
}
function kh(e) {
  const t = [], n = e.forw.features;
  for (let i = 0; i < n.length; i++) {
    const r = n[i];
    ["a", "b", "c"].forEach((s, o) => {
      const a = r.geometry.coordinates[0][o], A = r.properties[s].geom, g = r.properties[s].index;
      typeof g == "number" && (t[g] = [a, A]);
    });
  }
  return t;
}
function fg(e) {
  if (![
    e.xScale,
    e.xSkew,
    e.xOrigin,
    e.ySkew,
    e.yScale,
    e.yOrigin
  ].every(Number.isFinite))
    throw new Error("worldFile の係数はすべて有限の数でなければなりません");
  const t = e.xScale * e.yScale - e.xSkew * e.ySkew;
  if (!Number.isFinite(t) || t === 0)
    throw new Error("worldFile は非正則です（行列式が 0）");
  if (t > 0)
    throw new Error("worldFile は鏡像です。yScale の符号を確かめてください");
}
function pg(e, t) {
  const n = t[0] - 0.5, i = t[1] - 0.5;
  return [
    e.xScale * n + e.xSkew * i + e.xOrigin,
    e.ySkew * n + e.yScale * i + e.yOrigin
  ];
}
function dg(e, t) {
  const n = e.xScale * e.yScale - e.xSkew * e.ySkew, i = t[0] - e.xOrigin, r = t[1] - e.yOrigin;
  return [
    (e.yScale * i - e.xSkew * r) / n + 0.5,
    (-e.ySkew * i + e.xScale * r) / n + 0.5
  ];
}
function Sn(e, t, n) {
  return (t[0] - e[0]) * (n[1] - e[1]) - (t[1] - e[1]) * (n[0] - e[0]);
}
function ai(e, t, n, i = 0) {
  return e[0] >= Math.min(t[0], n[0]) - i && e[0] <= Math.max(t[0], n[0]) + i && e[1] >= Math.min(t[1], n[1]) - i && e[1] <= Math.max(t[1], n[1]) + i;
}
function Rh(e, t, n, i) {
  const r = Sn(e, t, n), s = Sn(e, t, i), o = Sn(n, i, e), a = Sn(n, i, t);
  return r === 0 && ai(n, e, t) || s === 0 && ai(i, e, t) || o === 0 && ai(e, n, i) || a === 0 && ai(t, n, i) ? !0 : Math.sign(r) * Math.sign(s) === -1 && Math.sign(o) * Math.sign(a) === -1;
}
function ba(e) {
  const t = e.reduce((n, i, r) => n + Sn(e[0], i, e[(r + 1) % e.length]), 0);
  if (!Number.isFinite(t) || t === 0)
    throw new Error('compiled.outerTransform が "worldFile" のとき vertices_points の輪は面積を持つ必要があります');
  for (let n = 0; n < e.length; n++) {
    const i = e[n], r = e[(n + 1) % e.length];
    if (i[0] === r[0] && i[1] === r[1])
      throw new Error('compiled.outerTransform が "worldFile" のとき vertices_points の輪に重複頂点は許可されません');
    for (let s = n + 2; s < e.length; s++)
      if (!(n === 0 && s === e.length - 1) && Rh(i, r, e[s], e[(s + 1) % e.length]))
        throw new Error('compiled.outerTransform が "worldFile" のとき vertices_points の輪に辺の交差は許可されません');
  }
  return Math.sign(t);
}
function Ph(e, t) {
  let n = !1;
  for (let i = 0, r = t.length - 1; i < t.length; r = i++) {
    const s = t[r], o = t[i], [a, A] = s, [g, c] = o, u = g - a, C = c - A, y = e[0] - a, w = e[1] - A, l = Number.EPSILON * 16 * Math.max(1, Math.abs(a), Math.abs(A), Math.abs(g), Math.abs(c), Math.abs(e[0]), Math.abs(e[1])), f = Math.hypot(u, C), p = l * f + Number.EPSILON * 16 * (Math.abs(y * C) + Math.abs(w * u));
    if (Math.abs(Sn(s, o, e)) <= p && ai(e, s, o, l)) return "edge";
    A > e[1] != c > e[1] && e[0] < (g - a) * (e[1] - A) / (c - A) + a && (n = !n);
  }
  return n ? "inside" : "outside";
}
class St {
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
  yaxisMode = St.YAXIS_INVERT;
  strictMode = St.MODE_AUTO;
  vertexMode = St.VERTEX_PLAIN;
  bounds;
  boundsPolygon;
  wh;
  xy;
  indexedTins;
  stateFull = !1;
  stateTriangle;
  stateBackward;
  outerTransform = "extrapolate";
  worldFile;
  outerVertices;
  /** B の外周の輪（地図面・地理面）。変換のたびに作らないよう setCompiled で一度だけ作る */
  outerRings;
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
    const n = "outerTransform" in t, i = n ? t.outerTransform : void 0;
    if (i !== void 0 && i !== "extrapolate" && i !== "worldFile")
      throw new Error("Invalid compiled data: outerTransform must be extrapolate or worldFile");
    const r = n ? t.worldFile : void 0;
    if (i === "worldFile") {
      if (!r) throw new Error('compiled.outerTransform が "worldFile" ですが worldFile がありません');
      fg(r);
      const A = t.vertices_points;
      if (!Array.isArray(A) || A.length < 4 || A.some((C) => !Array.isArray(C) || C.length < 2 || C.some((y) => !Array.isArray(y) || y.length < 2 || !y.slice(0, 2).every(Number.isFinite))))
        throw new Error('compiled.outerTransform が "worldFile" のとき vertices_points は有限な 4 頂点以上の輪が必要です');
      const g = ba(A.map((C) => C[0])), c = ba(A.map((C) => C[1])), u = t.yaxisMode === St.YAXIS_FOLLOW ? -c : c;
      if (g === u)
        throw new Error('compiled.outerTransform が "worldFile" のとき vertices_points の両面の巻き方向が整合していません');
    }
    const s = i === "worldFile" ? { ...t, centroid_point: t.centroid_point ?? [[0, 0], [0, 0]] } : t, o = wh(s) ? bh(s) : Eh(s), a = Object.fromEntries(["points", "strict_status", "vertices_params", "centroid", "edges", "edgeNodes", "tins", "kinks", "yaxisMode", "vertexMode", "strictMode", "bounds", "boundsPolygon", "wh", "xy", "indexedTins", "outerTransform", "worldFile", "outerVertices", "outerRings"].map((A) => [A, this[A]]));
    try {
      "compiled" in o ? this.applyLegacyState(o) : this.applyModernState(o), this.outerTransform = i ?? "extrapolate", this.worldFile = r, this.outerVertices = i === "worldFile" ? t.vertices_points : void 0, this.outerRings = this.outerVertices ? { forw: this.outerVertices.map((A) => A[0]), bakw: this.outerVertices.map((A) => A[1]) } : void 0, this.validateCompiledProjection();
    } catch (A) {
      throw Object.assign(this, a), A;
    }
  }
  /** 層固有の検査を、失敗時に compiled の適用を取り消せる位置で行う */
  validateCompiledProjection() {
  }
  applyModernState(t) {
    this.points = t.points, this.strict_status = t.strictStatus, this.vertices_params = t.verticesParams, this.centroid = t.centroid, this.edges = t.edges, this.edgeNodes = t.edgeNodes || [], this.tins = t.tins, this.addIndexedTin(), this.kinks = t.kinks, this.yaxisMode = t.yaxisMode ?? St.YAXIS_INVERT, this.vertexMode = t.vertexMode ?? St.VERTEX_PLAIN, this.strictMode = t.strictMode ?? St.MODE_AUTO, t.bounds ? (this.bounds = t.bounds, this.boundsPolygon = t.boundsPolygon, this.xy = t.xy, this.wh = t.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = t.xy ?? [0, 0], t.wh && (this.wh = t.wh));
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
    const t = this.tins, n = t.forw, i = t.bakw, r = Math.ceil(Math.sqrt(n.features.length));
    if (r < 3) {
      this.indexedTins = void 0;
      return;
    }
    let s = [], o = [];
    const a = n.features.map((l) => {
      let f = [];
      return Aa(l)[0].map((p) => {
        s.length === 0 ? s = [Array.from(p), Array.from(p)] : (p[0] < s[0][0] && (s[0][0] = p[0]), p[0] > s[1][0] && (s[1][0] = p[0]), p[1] < s[0][1] && (s[0][1] = p[1]), p[1] > s[1][1] && (s[1][1] = p[1])), f.length === 0 ? f = [Array.from(p), Array.from(p)] : (p[0] < f[0][0] && (f[0][0] = p[0]), p[0] > f[1][0] && (f[1][0] = p[0]), p[1] < f[0][1] && (f[0][1] = p[1]), p[1] > f[1][1] && (f[1][1] = p[1]));
      }), f;
    }), A = i.features.map((l) => {
      let f = [];
      return Aa(l)[0].map((p) => {
        o.length === 0 ? o = [Array.from(p), Array.from(p)] : (p[0] < o[0][0] && (o[0][0] = p[0]), p[0] > o[1][0] && (o[1][0] = p[0]), p[1] < o[0][1] && (o[0][1] = p[1]), p[1] > o[1][1] && (o[1][1] = p[1])), f.length === 0 ? f = [Array.from(p), Array.from(p)] : (p[0] < f[0][0] && (f[0][0] = p[0]), p[0] > f[1][0] && (f[1][0] = p[0]), p[1] < f[0][1] && (f[0][1] = p[1]), p[1] > f[1][1] && (f[1][1] = p[1]));
      }), f;
    });
    if (Math.max(
      ya(a, s, r),
      ya(A, o, r)
    ) > fh * n.features.length) {
      this.indexedTins = void 0;
      return;
    }
    const g = (s[1][0] - s[0][0]) / r, c = (s[1][1] - s[0][1]) / r, u = a.reduce(
      (l, f, p) => {
        const I = Vt(f[0][0], s[0][0], g, r), b = Vt(f[1][0], s[0][0], g, r), d = Vt(f[0][1], s[0][1], c, r), h = Vt(f[1][1], s[0][1], c, r);
        for (let m = I; m <= b; m++) {
          l[m] || (l[m] = []);
          for (let v = d; v <= h; v++)
            l[m][v] || (l[m][v] = []), l[m][v].push(p);
        }
        return l;
      },
      []
    ), C = (o[1][0] - o[0][0]) / r, y = (o[1][1] - o[0][1]) / r, w = A.reduce(
      (l, f, p) => {
        const I = Vt(f[0][0], o[0][0], C, r), b = Vt(f[1][0], o[0][0], C, r), d = Vt(f[0][1], o[0][1], y, r), h = Vt(f[1][1], o[0][1], y, r);
        for (let m = I; m <= b; m++) {
          l[m] || (l[m] = []);
          for (let v = d; v <= h; v++)
            l[m][v] || (l[m][v] = []), l[m][v].push(p);
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
        xUnit: C,
        yUnit: y,
        gridCache: w
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
  transform(t, n, i) {
    if (!this.tins)
      throw new Error("setCompiled() must be called before transform()");
    if (n && this.strict_status == St.STATUS_ERROR && this.outerTransform !== "worldFile")
      throw new Error('Backward transform is not allowed if strict_status == "strict_error"');
    const r = t;
    this.yaxisMode == St.YAXIS_FOLLOW && n && (t = [t[0], -1 * t[1]]);
    const s = ge(t);
    if (this.bounds && !n && !i && !ye(s, this.boundsPolygon))
      return !1;
    const o = n ? this.tins.bakw : this.tins.forw, a = n ? this.indexedTins?.bakw : this.indexedTins?.forw;
    let A;
    if (this.outerTransform === "worldFile") {
      const w = n ? this.outerRings?.bakw : this.outerRings?.forw, l = w ? Ph(s.geometry.coordinates, w) : "outside";
      if (n && this.strict_status == St.STATUS_ERROR && l !== "outside")
        throw new Error('Backward transform is not allowed if strict_status == "strict_error"');
      if (l === "inside" && o && (A = er(s, o, a)), !A) {
        const f = n ? dg(this.worldFile, r) : pg(this.worldFile, r);
        return !f.every(Number.isFinite) || n && this.bounds && !i && !ye(ge(f), this.boundsPolygon) ? !1 : f;
      }
    }
    const g = n ? this.vertices_params.bakw : this.vertices_params.forw, c = n ? this.centroid.bakw : this.centroid.forw;
    let u, C;
    this.stateFull && (this.stateBackward == n ? u = this.stateTriangle : (this.stateBackward = n, this.stateTriangle = void 0), C = (w) => {
      this.stateTriangle = w;
    });
    let y = Ch(
      s,
      o,
      a,
      g,
      c,
      void 0,
      u,
      C,
      A
    );
    if (this.bounds && n && !i) {
      const w = ge(y);
      if (!ye(w, this.boundsPolygon)) return !1;
    } else this.yaxisMode == St.YAXIS_FOLLOW && !n && (y = [y[0], -1 * y[1]]);
    return y;
  }
}
const It = 20037508342789244e-9, mg = [
  [0, 0],
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
], zi = 6378137, Wr = 180 / Math.PI * Math.atan(Math.sinh(Math.PI));
function Re(e) {
  return e.length >= 2 && Number.isFinite(e[0]) && Number.isFinite(e[1]);
}
function Oh(e, t) {
  const n = t.trim().split(/\s+/).map((r) => {
    const [s, ...o] = r.replace(/^\+/, "").split("="), a = s.toLowerCase(), A = o.join("="), g = o.length > 0;
    if (a === "axis" && (!g || A !== "enu"))
      throw new Error("worldFile は東・北の順で書き、+axis を外してください");
    if ((a === "no_defs" || a === "wktext") && !g) return "";
    if (g && A === "") throw new Error(`+${a}= は許可されていません`);
    if (a === "wktext") throw new Error("+wktext は許可されていません");
    if (a === "type" && !g) throw new Error("+type は値が必要です");
    if (a === "type" && A.toLowerCase() === "crs" || a === "axis") return "";
    if (a === "towgs84") {
      const u = A.split(",");
      if (!g || u.some((C) => C.trim() === ""))
        throw new Error("+towgs84 は数値の値が必要です");
      if ([3, 7].includes(u.length) && u.every((C) => {
        const y = C.trim().split(/[eE]/, 1)[0].replace(/[+\-.]/g, "");
        return Number.isFinite(Number(C)) && !/[1-9]/.test(y);
      })) return "";
    }
    const c = A ? A.split(",").map((u) => {
      const C = Number(u);
      return u.trim() !== "" && Number.isFinite(C) ? Object.is(C, -0) ? "0" : String(C) : u.toLowerCase();
    }).join(",") : "";
    return `+${a}${A ? `=${c}` : ""}`;
  }).filter(Boolean), i = [...new Set(n)].sort().join(" ");
  if (!(e === 4326 ? ["+datum=wgs84 +proj=longlat", "+ellps=wgs84 +proj=longlat"] : [
    "+a=6378137 +b=6378137 +k=1 +lat_ts=0 +lon_0=0 +nadgrids=@null +proj=merc +units=m +x_0=0 +y_0=0"
  ]).includes(i))
    throw new Error(
      `epsg と proj4 が一致しないか、proj4js なしでは判定できない CRS です（EPSG:${e}）`
    );
}
const me = {
  toLonLat(e, t) {
    if (!Re(e)) return !1;
    if (t.epsg === 4326)
      return Math.abs(e[0]) <= 180 && Math.abs(e[1]) <= 90 ? [e[0], e[1]] : !1;
    if (t.epsg !== 3857 || Math.abs(e[0]) > It || Math.abs(e[1]) > It)
      return !1;
    const n = e[0], i = e[1];
    return [
      Math.abs(n) === It ? Math.sign(n) * 180 : n / zi * (180 / Math.PI),
      Math.abs(i) === It ? Math.sign(i) * Wr : (2 * Math.atan(Math.exp(i / zi)) - Math.PI / 2) * (180 / Math.PI)
    ];
  },
  fromLonLat(e, t) {
    if (!Re(e) || Math.abs(e[0]) > 180) return !1;
    const [n, i] = e;
    if (t.epsg === 4326) return Math.abs(i) <= 90 ? [n, i] : !1;
    if (t.epsg !== 3857 || Math.abs(i) > Wr) return !1;
    const r = n * Math.PI / 180, s = i * Math.PI / 180, o = [
      Math.abs(n) === 180 ? Math.sign(n) * It : zi * r,
      Math.abs(i) === Wr ? Math.sign(i) * It : zi * Math.log(Math.tan(Math.PI / 4 + s / 2))
    ];
    return o.every(Number.isFinite) ? o : !1;
  }
}, yg = { epsg: 3857 }, Ea = { epsg: 4326 }, Lh = "+proj=longlat +datum=WGS84";
function ks(e) {
  return e.epsg === 3857 || e.epsg === 4326;
}
function Dh(e) {
  if (e === null || typeof e != "object" || Array.isArray(e))
    throw new Error("CRS はオブジェクトで指定してください");
  if (e.epsg !== void 0 && (!Number.isSafeInteger(e.epsg) || e.epsg <= 0))
    throw new Error("CRS の epsg は正の整数で指定してください");
  if (e.proj4 !== void 0 && (typeof e.proj4 != "string" || !e.proj4.trim()))
    throw new Error("CRS の proj4 は空でない文字列で指定してください");
  const t = typeof e.authority == "string" && !!e.authority.trim(), n = typeof e.code == "string" ? !!e.code.trim() : Number.isFinite(e.code);
  if (e.epsg === void 0 && !(t && n) && e.proj4 === void 0)
    throw new Error(
      "CRS には epsg、authority と code の組、または proj4 が必要です。WKT のみの定義には対応していません"
    );
}
function vg(e) {
  let t = !1;
  for (const n of e.split("+")) {
    const [i, r] = n.trim().split("="), s = i.toLowerCase();
    if (s === "axis" && r !== "enu")
      throw new Error("CRS の座標は東・北の順で書き、+axis を外すか +axis=enu を指定してください");
    if (s === "nadgrids" && r !== "@null" || s === "geoidgrids" || s === "hgridshift" || s === "vgridshift" || s === "proj" && ["pipeline", "hgridshift", "vgridshift"].includes(r?.toLowerCase()))
      throw new Error(`proj4 の +${n.trim()} は読み込めません`);
    s === "proj" && r && (t = !0);
  }
  if (!e.startsWith("+") || !t)
    throw new Error("CRS の proj4 は +proj= を含む定義で指定してください");
}
function wg(e, t, n) {
  Dh(e);
  const i = ks(e);
  if (e.proj4 === void 0) {
    if (e.wkt) throw new Error("WKT だけの CRS 定義に対応していません");
    if (!i) throw new Error("EPSG:3857・4326 以外の CRS には proj4 定義が必要です");
    return;
  }
  const r = e.proj4.trim();
  if (vg(r), t.validateDefinition)
    t.validateDefinition(e, i ? n() : void 0);
  else if (i)
    Oh(e.epsg, r);
  else if (t === me)
    throw new Error("この CRS には proj4 に対応する投影エンジンが必要です");
}
function Bh(e) {
  const t = /* @__PURE__ */ new Map();
  function n(s) {
    const o = t.get(s);
    if (o) return o;
    vg(s);
    try {
      const a = e(s, Lh);
      return t.set(s, a), a;
    } catch (a) {
      throw new Error(`proj4 定義を読み込めません（${String(a)}）`, { cause: a });
    }
  }
  function i(s, [o, a]) {
    const A = s.inverse([o, a, 0], !0), g = A[2];
    return Number.isFinite(g) && Math.abs(g) > 1e-6 ? s.inverse([o, a, -g], !0) : A;
  }
  function r(s, o, a) {
    if (!Re(s)) return !1;
    try {
      const A = a(n(o), [s[0], s[1]]);
      return Re(A) ? [A[0], A[1]] : !1;
    } catch {
      return !1;
    }
  }
  return {
    toLonLat(s, o) {
      if (ks(o)) return me.toLonLat(s, o);
      if (!o.proj4) return !1;
      const a = r(
        s,
        o.proj4.trim(),
        (A, g) => A.forward(g)
      );
      return a === !1 ? !1 : me.toLonLat(a, Ea);
    },
    fromLonLat(s, o) {
      return ks(o) ? me.fromLonLat(s, o) : !o.proj4 || me.fromLonLat(s, Ea) === !1 ? !1 : r(s, o.proj4.trim(), i);
    },
    validateDefinition(s, o) {
      if (s.proj4 === void 0) return;
      const a = s.proj4.trim();
      if (n(a), !o) return;
      const A = s.epsg === 3857 ? 1e-3 : 1e-8;
      for (const g of o) {
        const c = me.toLonLat(g, s), u = c === !1 ? !1 : r(c, a, (C, y) => C.inverse(y));
        if (u === !1 || Math.hypot(u[0] - g[0], u[1] - g[1]) > A)
          throw new Error(
            `epsg と proj4 が地図の四隅または中心で一致しないか、比較できません（EPSG:${s.epsg}）`
          );
      }
    }
  };
}
function bg(e, t, n) {
  if (!Re(e)) return !1;
  const i = n.toLonLat(e, t);
  return i === !1 ? !1 : me.fromLonLat(i, yg);
}
function Eg(e, t, n) {
  const i = me.toLonLat(e, yg);
  if (i === !1) return !1;
  const r = n.fromLonLat(i, t);
  return r !== !1 && Re(r) ? r : !1;
}
function xg(e, t, n) {
  let i, r, s, o;
  if (n?.length) {
    i = r = 1 / 0, s = o = -1 / 0;
    for (const [a, A] of n)
      i = Math.min(i, a), r = Math.min(r, A), s = Math.max(s, a), o = Math.max(o, A);
  } else if (e)
    [i, r] = t ?? [0, 0], s = i + e[0], o = r + e[1];
  else
    throw new Error("epsg と proj4 の照合には地図の範囲が必要です");
  if (![i, r, s, o].every(Number.isFinite))
    throw new Error("epsg と proj4 の照合には有限な地図の範囲が必要です");
  return [
    [i, r],
    [s, r],
    [s, o],
    [i, o],
    [i / 2 + s / 2, r / 2 + o / 2]
  ];
}
class Nh {
  crs;
  worldFile;
  projectionEngine;
  wh;
  xy;
  bounds;
  priority;
  importance;
  points = [];
  edges = [];
  constructor(t) {
    if (fg(t.worldFile), !t.wh && !t.bounds) throw new Error("WorldFileSurface には wh または bounds が必要です");
    if (t.wh && (!Array.isArray(t.wh) || t.wh.length < 2 || !t.wh.slice(0, 2).every(Number.isFinite)))
      throw new Error("WorldFileSurface の wh は有限な 2 要素以上の配列でなければなりません");
    if (t.bounds && (t.bounds.length < 3 || t.bounds.some((i) => !Array.isArray(i) || i.length < 2 || !i.slice(0, 2).every(Number.isFinite)))) throw new Error("WorldFileSurface の bounds は有限な頂点を3つ以上必要とします");
    this.crs = t.crs, this.worldFile = t.worldFile, this.projectionEngine = t.projectionEngine ?? me;
    const n = t.bounds;
    if (t.wh)
      this.wh = t.wh, this.xy = t.xy;
    else {
      const i = n.map((a) => a[0]), r = n.map((a) => a[1]), s = Math.min(...i), o = Math.min(...r);
      if (this.wh = [Math.max(...i) - s, Math.max(...r) - o], !this.wh.every(Number.isFinite)) throw new Error("WorldFileSurface の bounds から算出した寸法は有限でなければなりません");
      this.xy = t.xy ?? [s, o];
    }
    this.bounds = t.bounds, this.priority = t.priority, this.importance = t.importance, wg(
      this.crs,
      this.projectionEngine,
      () => xg(t.wh, this.xy, t.wh ? void 0 : this.bounds).map((i) => this.xyToCrs(i))
    );
  }
  /** 画素座標を指定 CRS に変換する */
  xyToCrs(t) {
    return pg(this.worldFile, t);
  }
  /** 指定 CRS 座標を画素座標に変換する */
  crsToXy(t) {
    return dg(this.worldFile, t);
  }
  /** 地図画素と EPSG:3857 の間を変換する */
  transform(t, n = !1, i = !1) {
    if (!Re(t)) return !1;
    if (!n) {
      const o = this.xyToCrs(t);
      return this.crs.epsg === 3857 ? o.every((a) => Math.abs(a) <= It) ? o : !1 : bg(o, this.crs, this.projectionEngine);
    }
    if (this.crs.epsg === 3857) {
      if (Math.abs(t[0]) > It || Math.abs(t[1]) > It) return !1;
      const o = this.crsToXy(t);
      return Re(o) ? o : !1;
    }
    const r = Eg(t, this.crs, this.projectionEngine);
    if (r === !1) return !1;
    const s = this.crsToXy(r);
    return Re(s) ? s : !1;
  }
}
function ao(e, t) {
  return Math.floor(Math.min(e[0], e[1]) / 4) * It / 128 / Math.pow(2, t);
}
function Mg(e, t) {
  const n = [];
  for (let i = 0; i < e.length; i++) {
    const r = e[i], s = r[0] * Math.cos(t) - r[1] * Math.sin(t), o = r[0] * Math.sin(t) + r[1] * Math.cos(t);
    n.push([s, o]);
  }
  return n;
}
function Rs(e, t, n, i) {
  const r = ao(i, t);
  return Mg(mg, n).map((s) => [
    s[0] * r + e[0],
    s[1] * r + e[1]
  ]);
}
function Ps(e, t) {
  const n = e[0], i = e.slice(1, 5).map((C) => [
    C[0] - n[0],
    C[1] - n[1]
  ]), r = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
  ];
  let s = 0, o = 0, a = 0;
  for (let C = 0; C < 4; C++) {
    const y = i[C], w = r[C], l = Math.sqrt(Math.pow(y[0], 2) + Math.pow(y[1], 2));
    s += l;
    const f = y[0] * w[1] - y[1] * w[0], p = y[0] * w[0] + y[1] * w[1], I = -Math.atan2(f, p);
    o += Math.cos(I), a += Math.sin(I);
  }
  const A = s / 4, g = Math.atan2(a, o), c = Math.floor(Math.min(t[0], t[1]) / 4), u = Math.log(c * It / 128 / A) / Math.log(2);
  return { center: n, zoom: u, rotation: g };
}
function Fh(e) {
  const t = e - 2 * Math.PI * Math.round(e / (2 * Math.PI));
  return t === -Math.PI ? Math.PI : t;
}
function Yr(e, t) {
  const n = e[0] * (2 * It) / t - It, i = -1 * (e[1] * (2 * It) / t - It);
  return [n, i];
}
function xa(e, t) {
  const n = (e[0] + It) * t / (2 * It), i = (-e[1] + It) * t / (2 * It);
  return [n, i];
}
const jh = 16, Gh = 8, zh = 16, Tn = 2, Uh = 1, Xh = 1e-24;
function Ei(e) {
  return Array.isArray(e) && e.length >= 2 && Number.isFinite(e[0]) && Number.isFinite(e[1]);
}
function ci(e) {
  let t = 1 / 0, n = 1 / 0, i = -1 / 0, r = -1 / 0;
  for (const [s, o] of e)
    !Number.isFinite(s) || !Number.isFinite(o) || (t = Math.min(t, s), n = Math.min(n, o), i = Math.max(i, s), r = Math.max(r, o));
  if (!Number.isFinite(t)) throw new Error("視点グリッドの範囲を有限な座標から決められません");
  return { minX: t, minY: n, maxX: i, maxY: r };
}
function Sg(e, t) {
  if (t?.length) return ci(t);
  if (e.xy && e.wh)
    return {
      minX: e.xy[0],
      minY: e.xy[1],
      maxX: e.xy[0] + e.wh[0],
      maxY: e.xy[1] + e.wh[1]
    };
  if (e.wh) return { minX: 0, minY: 0, maxX: e.wh[0], maxY: e.wh[1] };
  if (e.bounds?.length) return ci(e.bounds);
  const n = e.points;
  if (n?.length) return ci(n.map((i) => i[0]));
  throw new Error("視点グリッドの紙側基準矩形を決められません（wh / bounds / GCP がありません）");
}
function Ui(e, t) {
  return e instanceof St ? e.strict_status ?? t ?? "strict" : "strict";
}
function Tg(e, t = jh) {
  const n = e.maxX - e.minX, i = e.maxY - e.minY;
  if (!(n > 0) || !(i > 0))
    throw new Error("視点グリッドの基準矩形に面積がありません");
  const r = Math.max(n, i), s = Math.min(n, i), o = Math.min(
    zh,
    Math.max(Gh, Math.round(t * s / r))
  ), a = n >= i ? t : o, A = n >= i ? o : t, g = n / a, c = i / A;
  return {
    x0: e.minX - Tn * g,
    y0: e.minY - Tn * c,
    dx: g,
    dy: c,
    mx: a + 2 * Tn,
    my: A + 2 * Tn,
    nxInner: a,
    nyInner: A
  };
}
function Zh(e, t, n, i) {
  const r = !i, s = [[n, 0], [-n, 0], [0, n], [0, -n]], o = [];
  for (const a of s) {
    const A = r ? [t[0] + a[0], t[1] - a[1]] : [t[0] + a[0], t[1] + a[1]], g = e.transform(A, i, !0);
    Ei(g) && o.push({ d: a, out: g });
  }
  return o;
}
function Os(e, t) {
  return t ? [e[0], -e[1]] : [e[0], e[1]];
}
function Ma(e, t, n, i) {
  const r = e * i - t * n;
  if (!(r > 0) || !Number.isFinite(r)) return null;
  const s = Math.sqrt(r), o = Math.atan2(n - t, e + i);
  return Number.isFinite(s) && Number.isFinite(o) ? { s, theta: o } : null;
}
function Vh(e, t, n) {
  let i = 0, r = 0, s = 0;
  for (const { d: g, out: c } of e) {
    const [u, C] = Os(c, n), y = g[0], w = g[1], l = u - t[0], f = C - t[1];
    i += y * l + w * f, r += y * f - w * l, s += y * y + w * w;
  }
  if (!(s > 0)) return null;
  const o = i / s, a = r / s, A = Math.hypot(o, a);
  return !(A > 0) || !Number.isFinite(A) ? null : n ? { s: 1 / A, theta: -Math.atan2(a, o) } : { s: A, theta: Math.atan2(a, o) };
}
function Sa(e) {
  return e ? { s: 1 / e.s, theta: -e.theta } : null;
}
function _g(e, t, n, i) {
  const r = Zh(e, t, n, i), s = (C, y) => {
    const w = r.find((l) => l.d[0] === C && l.d[1] === y);
    return w ? Os(w.out, i) : void 0;
  };
  if (r.length >= 4) {
    const C = s(n, 0), y = s(-n, 0), w = s(0, n), l = s(0, -n), f = Ma(
      (C[0] - y[0]) / (2 * n),
      (w[0] - l[0]) / (2 * n),
      (C[1] - y[1]) / (2 * n),
      (w[1] - l[1]) / (2 * n)
    );
    return i ? Sa(f) : f;
  }
  const o = e.transform(t, i, !0), a = Ei(o) ? Os(o, i) : null;
  if (!a) return null;
  const A = (C) => C[1] === 0, g = r.filter((C) => A(C.d)), c = r.filter((C) => !A(C.d)), u = g.length >= 1 && c.length >= 1;
  if (r.length >= 3 || r.length === 2 && u) {
    const C = (f, p) => f && p ? [(f[0] - p[0]) / (2 * n), (f[1] - p[1]) / (2 * n)] : f ? [(f[0] - a[0]) / n, (f[1] - a[1]) / n] : p ? [(a[0] - p[0]) / n, (a[1] - p[1]) / n] : null, y = C(s(n, 0), s(-n, 0)), w = C(s(0, n), s(0, -n));
    if (!y || !w) return null;
    const l = Ma(y[0], w[0], y[1], w[1]);
    return i ? Sa(l) : l;
  }
  return r.length === 2 ? Vh(r, a, i) : null;
}
function en(e, t, n) {
  const i = Math.min(Math.max((t - e.x0) / e.dx, 0), e.nx - 1), r = Math.min(Math.max((n - e.y0) / e.dy, 0), e.ny - 1), s = Math.min(Math.floor(i), e.nx - 2), o = Math.min(Math.floor(r), e.ny - 2), a = i - s, A = r - o, g = (1 - a) * (1 - A), c = a * (1 - A), u = (1 - a) * A, C = a * A, y = e.nx, w = e.ls, l = e.cs, f = e.sn, p = o * y + s, I = p + 1, b = p + y, d = b + 1;
  let h = g * w[p];
  h += c * w[I], h += u * w[b], h += C * w[d];
  let m = g * l[p];
  m += c * l[I], m += u * l[b], m += C * l[d];
  let v = g * f[p];
  v += c * f[I], v += u * f[b], v += C * f[d];
  const E = Math.exp(h), M = m * m + v * v > Xh ? Math.atan2(v, m) : Math.atan2(f[p], l[p]);
  return { s: E, theta: M };
}
function Ta(e, t, n, i = Uh, r) {
  const s = Tg(t, r), o = s.mx + 1, a = s.my + 1, A = new Float64Array(o * a), g = new Float64Array(o * a), c = new Float64Array(o * a), u = new Uint8Array(o * a), C = i * Math.min(s.dx, s.dy);
  for (let w = 0; w < a; w++)
    for (let l = 0; l < o; l++) {
      const f = [s.x0 + l * s.dx, s.y0 + w * s.dy], p = _g(e, f, C, n), I = w * o + l;
      p && p.s > 0 && Number.isFinite(p.s) && (A[I] = Math.log(p.s), g[I] = Math.cos(p.theta), c[I] = Math.sin(p.theta), u[I] = 1);
    }
  const y = [];
  for (let w = 0; w < u.length; w++) u[w] && y.push(w);
  if (y.length === 0)
    A.fill(0), g.fill(1), c.fill(0);
  else
    for (let w = 0; w < a; w++)
      for (let l = 0; l < o; l++) {
        const f = w * o + l;
        if (u[f]) continue;
        let p = y[0], I = 1 / 0;
        for (const b of y) {
          const d = b % o, h = (b - d) / o, m = (d - l) * (d - l) + (h - w) * (h - w);
          m < I && (I = m, p = b);
        }
        A[f] = A[p], g[f] = g[p], c[f] = c[p];
      }
  return { nx: o, ny: a, x0: s.x0, y0: s.y0, dx: s.dx, dy: s.dy, ls: A, cs: g, sn: c };
}
function Wh(e, t) {
  const n = [];
  for (let r = 0; r <= 8; r++) {
    const s = r / 8;
    n.push([t.minX + (t.maxX - t.minX) * s, t.minY]), n.push([t.minX + (t.maxX - t.minX) * s, t.maxY]), n.push([t.minX, t.minY + (t.maxY - t.minY) * s]), n.push([t.maxX, t.minY + (t.maxY - t.minY) * s]);
  }
  for (let r = 1; r <= 3; r++)
    for (let s = 1; s <= 3; s++)
      n.push([
        t.minX + (t.maxX - t.minX) * r / 4,
        t.minY + (t.maxY - t.minY) * s / 4
      ]);
  const i = [];
  for (const r of n) {
    const s = e.transform(r, !1, !0);
    Ei(s) && i.push(s);
  }
  if (!i.length)
    throw new Error("視点グリッドの地理側範囲を決められません（有効な標本点がありません）");
  return ci(i);
}
function Yh(e, t, n) {
  const i = n * e.nx + t;
  return { s: Math.exp(e.ls[i]), theta: Math.atan2(e.sn[i], e.cs[i]) };
}
function Hh(e) {
  return e.gcps?.length ? e.gcps.map((t) => t[0].slice(0, 2)) : e.surface.points?.map((t) => t[0].slice(0, 2)) ?? [];
}
function Qh(e) {
  return e.length < 3 ? null : hh(rn(e.map((t) => ge([t[0], t[1]]))));
}
function _a(e, t) {
  return ye(ge([e[0], e[1]]), t, { ignoreBoundary: !1 });
}
function Kh(e) {
  const t = e.paperRect ?? Sg(e.surface), n = Tg(t, e.nLong), i = e.strictness === "strict" ? void 0 : Ta(e.surface, t, !1, e.probeRadiusCells, e.nLong), r = e.strictness === "strict_error" ? void 0 : Ta(
    e.surface,
    Wh(e.surface, t),
    !0,
    e.probeRadiusCells,
    e.nLong
  );
  return { rect: t, spec: n, paper: i, merc: r };
}
function Jh(e, t, n) {
  if (t.strictness === "loose" || t.strictness === "strict_error")
    return e.paper ? en(e.paper, n[0], n[1]) : null;
  const i = t.surface.transform(n, !1, !0);
  return !Ei(i) || !e.merc ? null : en(e.merc, i[0], i[1]);
}
function qh(e, t) {
  const n = [];
  for (let i = 0; i <= t.spec.nyInner; i++)
    for (let r = 0; r <= t.spec.nxInner; r++) {
      const s = Tn + r, o = Tn + i, a = [t.spec.x0 + s * t.spec.dx, t.spec.y0 + o * t.spec.dy];
      if (e.strictness === "loose" || e.strictness === "strict_error") {
        t.paper && n.push({ paper: a, ...Yh(t.paper, s, o) });
        continue;
      }
      const A = e.surface.transform(a, !1, !0);
      if (!Ei(A) || !t.merc) continue;
      const g = en(t.merc, A[0], A[1]);
      g.s > 0 && Number.isFinite(g.s) && Number.isFinite(g.theta) && n.push({ paper: a, s: g.s, theta: g.theta });
    }
  return n;
}
function $h(e, t, n) {
  const i = Qh(Hh(e)), r = e.regionPolygon, s = (g) => !(i && !_a(g, i) || r && !_a(g, r)), o = n.filter((g) => s(g.paper));
  if (o.length >= 9) return o;
  const a = ci(i ? i.geometry.coordinates[0] : r ? r.geometry.coordinates[0] : n.map((g) => g.paper)), A = [];
  for (let g = 0; g < 9; g++)
    for (let c = 0; c < 9; c++) {
      const u = [
        a.minX + (a.maxX - a.minX) * (g + 0.5) / 9,
        a.minY + (a.maxY - a.minY) * (c + 0.5) / 9
      ];
      if (!s(u)) continue;
      const C = Jh(t, e, u);
      C && C.s > 0 && Number.isFinite(C.s) && A.push({ paper: u, ...C });
    }
  return A.length ? A : o.length ? o : n;
}
function tI(e) {
  if (!e.length) throw new Error("視点係数の標本がありません");
  let t = 0, n = 0, i = 0;
  for (const s of e)
    t += Math.log(s.s), n += Math.cos(s.theta), i += Math.sin(s.theta);
  const r = e.length;
  return { s: Math.exp(t / r), theta: Math.atan2(i / r, n / r) };
}
class Ao {
  mode;
  strictness;
  paperGrid;
  mercGrid;
  constant;
  constructor(t, n) {
    this.mode = t, this.strictness = n;
  }
  static build(t) {
    const n = new Ao(t.mode, t.strictness), i = Kh(t);
    if (t.mode === "constant") {
      const r = $h(t, i, qh(t, i));
      n.constant = tI(r);
    } else
      n.paperGrid = i.paper, n.mercGrid = i.merc;
    return n;
  }
  /**
   * 中心 1 点の (s, θ) を引く（§7.1）。
   * - constant: 全体の (s0, θ0)
   * - strict / Plan A: 両方向とも地理側グリッド
   * - loose: 順方向は紙側グリッド、逆方向は地理側グリッド
   * - strict_error: 紙側グリッドのみ（逆方向の例外は呼び出し側の逆変換が担う）
   */
  eval(t, n, i) {
    return this.mode === "constant" ? this.constant : this.strictness === "strict" ? en(this.mercGrid, n[0], n[1]) : this.strictness === "loose" ? i ? en(this.mercGrid, n[0], n[1]) : en(this.paperGrid, t[0], t[1]) : en(this.paperGrid, t[0], t[1]);
  }
}
function kg(e, t, n, i, r) {
  wg(t, n, () => {
    const s = i ?? e.bounds ?? (e.wh ? void 0 : e.points.map(([a]) => a)), o = e.stateFull;
    e.stateFull = !1;
    try {
      return xg(e.wh, e.xy, s).map((a) => {
        const A = r(a);
        if (A === !1) throw new Error("epsg と proj4 の照合点を三角網で変換できません");
        return A;
      });
    } finally {
      e.stateFull = o;
    }
  });
}
class eI extends St {
  constructor(t, n, i) {
    super(), this.crs = n, this.projectionEngine = i, this.layerBounds = t.bounds, this.setCompiled(t.compiled);
  }
  crs;
  projectionEngine;
  layerBounds;
  validateCompiledProjection() {
    kg(
      this,
      this.crs,
      this.projectionEngine,
      this.layerBounds,
      (t) => super.transform(t, !1, !0)
    ), this.stateTriangle = void 0;
  }
  transform(t, n, i) {
    if (n) {
      const s = Eg(t, this.crs, this.projectionEngine);
      return s === !1 ? !1 : super.transform(s, n, i);
    }
    const r = super.transform(t, n, i);
    return r === !1 ? !1 : bg(r, this.crs, this.projectionEngine);
  }
}
const pn = 256;
function ka(e) {
  if (e.kind === "worldFile") return new Nh(e);
  if ("crs" in e && e.crs === null) throw new Error("三角網の層の CRS は null にできません");
  const t = e.crs, n = e.projectionEngine ?? me;
  if (t !== void 0 && t.epsg !== 3857) return new eI(e, t, n);
  const i = new St();
  return i.setCompiled(e.compiled), t !== void 0 && kg(i, t, n, e.bounds, (r) => i.transform(r, !1, !0)), i;
}
class Rg {
  mainTin = null;
  subTins = [];
  _maxxy = 0;
  /** 視点変換モード（地図全体で共通。未指定は "grid"） */
  _viewpointMode = "grid";
  /** 層ごとの ViewpointField 遅延構築スロット（§2.3。読み込み時には作らない） */
  _fields = [];
  _layerMetas = [];
  // ─── 初期化 ────────────────────────────────────────────────────────────────
  /**
   * 地図データ（コンパイル済み TIN + sub_maps）をロードする
   *
   * @param mapData - メイン TIN と sub_maps の情報
   */
  setMapData(t) {
    this._fields = [], this._layerMetas = [];
    const n = new St();
    if (n.setCompiled(t.compiled), this.mainTin = n, t.maxZoom !== void 0)
      this._maxxy = Math.pow(2, t.maxZoom) * pn;
    else if (t.compiled.wh) {
      const r = Math.max(t.compiled.wh[0], t.compiled.wh[1]), s = Math.ceil(Math.log2(r / pn));
      this._maxxy = Math.pow(2, s) * pn;
    }
    this.subTins = [];
    const i = [
      { strictness: Ui(n, oi(t.compiled)) }
    ];
    if (t.sub_maps)
      for (const r of t.sub_maps) {
        const s = new St();
        s.setCompiled(r.compiled);
        const o = r.bounds ?? r.compiled.bounds;
        if (!o) throw new Error("SubMapData must have bounds or compiled.bounds to create xyBounds polygon");
        const a = [...o, o[0]], A = a.map((c) => {
          const u = s.transform(c, !1);
          if (!u) throw new Error("Failed to transform sub-map bounds to mercator");
          return u;
        }), g = Mn([a]);
        this.subTins.push({
          tin: s,
          priority: r.priority,
          importance: r.importance,
          xyBounds: g,
          mercBounds: Mn([A])
        }), i.push({
          strictness: Ui(s, oi(r.compiled)),
          rectOverride: o,
          regionPolygon: g
        });
      }
    this._layerMetas = i, this._viewpointMode = t.viewpointMode ?? "grid", this._fields = [];
  }
  /** TIN と world file の変換面を混在させて読み込む */
  setLayeredMapData(t) {
    this._fields = [], this._layerMetas = [];
    const n = ka(t.main);
    t.main.priority !== void 0 && (n.priority = t.main.priority), t.main.importance !== void 0 && (n.importance = t.main.importance);
    const i = t.main.kind === "tin" ? t.main.compiled.wh : n.wh;
    let r = this._maxxy;
    if (t.maxZoom !== void 0)
      r = Math.pow(2, t.maxZoom) * pn;
    else if (i) {
      const a = Math.max(i[0], i[1]), A = Math.ceil(Math.log2(a / pn));
      r = Math.pow(2, A) * pn;
    }
    const s = [], o = [
      {
        strictness: Ui(
          n,
          t.main.kind === "tin" ? oi(t.main.compiled) : void 0
        )
      }
    ];
    for (const a of t.sub_maps ?? []) {
      const A = ka(a), g = a.bounds ?? (a.kind === "tin" ? a.compiled.bounds : void 0);
      if (!g) throw new Error("副層には bounds または compiled.bounds が必要です");
      const c = [...g, g[0]], u = c.map((y) => {
        const w = A.transform(y, !1);
        if (!w) throw new Error("副層の bounds をメルカトル座標へ変換できません");
        return w;
      }), C = Mn([c]);
      s.push({
        tin: A,
        priority: a.priority ?? 0,
        importance: a.importance ?? 0,
        xyBounds: C,
        mercBounds: Mn([u])
      }), o.push({
        strictness: Ui(
          A,
          a.kind === "tin" ? oi(a.compiled) : void 0
        ),
        rectOverride: g,
        regionPolygon: C
      });
    }
    this.mainTin = n, this.subTins = s, this._maxxy = r, this._layerMetas = o, this._viewpointMode = t.viewpointMode ?? "grid", this._fields = [];
  }
  /** 読み込み時の地図全体の視点変換モード（未指定は "grid"） */
  get viewpointMode() {
    return this._viewpointMode;
  }
  // ─── 処理2: submap TIN 選択付き変換 ───────────────────────────────────────
  /**
   * ピクセル座標 → メルカトル座標（最適レイヤー選択）
   *
   * @param xy - ピクセル座標 [x, y]
   * @returns メルカトル座標、または範囲外の場合は false
   */
  xy2Merc(t) {
    const n = this.xy2MercWithLayer(t);
    return n ? n[1] : !1;
  }
  /**
   * メルカトル座標 → ピクセル座標（最適レイヤー選択）
   *
   * @param merc - メルカトル座標 [x, y]
   * @returns ピクセル座標、または範囲外の場合は false
   */
  merc2Xy(t) {
    const n = this.merc2XyWithLayer(t), i = n[0] || n[1];
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
    const n = this._getTinsSortedByPriority();
    for (let i = 0; i < n.length; i++) {
      const { index: r, isMain: s } = n[i];
      if (s || ye(ge(t), this.subTins[r - 1].xyBounds)) {
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
    return this._assertMapData(), this._getAllTinsWithIndex().map(({ index: n, tin: i, isMain: r }) => {
      const s = this._transformByIndex(t, n, !0);
      return s === !1 ? [i, n] : r || ye(ge(s), this.subTins[n - 1].xyBounds) ? [i, n, s] : [i, n];
    }).sort((n, i) => {
      const r = n[0].priority ?? 0, s = i[0].priority ?? 0;
      return r < s ? 1 : -1;
    }).reduce(
      (n, i, r, s) => {
        const o = i[0], a = i[1], A = i[2];
        if (!A) return n;
        for (let g = 0; g < r; g++) {
          const c = s[g][1], u = c === 0;
          if (s[g][2] && (u || ye(ge(A), this.subTins[c - 1].xyBounds)))
            if (n.length) {
              const C = !n[0], y = C ? n[1][2] : n[0][2], w = o.importance ?? 0, l = y.importance ?? 0;
              return C ? w < l ? n : [void 0, [a, A, o]] : [...n.filter(
                (f) => f !== void 0
              ), [a, A, o]].sort(
                (f, p) => (f[2].importance ?? 0) < (p[2].importance ?? 0) ? 1 : -1
              ).slice(0, 2);
            } else
              return [[a, A, o]];
        }
        return !n.length || !n[0] ? [[a, A, o]] : (n.push([a, A, o]), n.sort((g, c) => {
          const u = g[2].importance ?? 0, C = c[2].importance ?? 0;
          return u < C ? 1 : -1;
        }).filter((g, c) => c < 2));
      },
      []
    ).map((n) => {
      if (n)
        return [n[0], n[1]];
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
   *    本図と sub_map がともに priority 0 の場合も、本図はその sub_map の `xyBounds` 内で覆われている
   * 3. 同じ priority の sub_map どうしは互いを覆わない
   * 4. 覆われていない対応層を importance 降順 → priority 降順 → 層番号昇順で並べ、上限を切らずに全件返す
   * 5. 覆われていない対応層が無ければ空配列（表現範囲外）。`undefined`（旧 hide 表現）は返さない
   *
   * @param merc - メルカトル座標 [x, y]
   * @returns [レイヤーインデックス, ピクセル座標] の配列（0 件以上・上限なし）
   */
  merc2XyVisibleLayers(t) {
    this._assertMapData();
    const n = this._getAllTinsWithIndex(), i = (A) => (A === 0 ? this.mainTin?.priority : this.subTins[A - 1].priority) ?? 0, r = (A) => (A === 0 ? this.mainTin?.importance : this.subTins[A - 1].importance) ?? 0, s = (A, g) => A === 0 || ye(ge(g), this.subTins[A - 1].xyBounds), o = [];
    for (const { index: A } of n) {
      const g = this._transformByIndex(t, A, !0);
      g !== !1 && s(A, g) && o.push({ index: A, xy: g });
    }
    const a = (A) => n.some(
      ({ index: g }) => g !== 0 && g !== A.index && (i(g) > i(A.index) || A.index === 0 && i(0) === 0 && i(g) === 0) && s(g, A.xy)
    );
    return o.filter((A) => !a(A)).sort((A, g) => r(g.index) - r(A.index) || i(g.index) - i(A.index) || A.index - g.index).map((A) => [A.index, A.xy]);
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
    const n = this.merc2XyWithLayer(t[0]);
    let i = !1;
    return n.map((r, s) => {
      if (!r) {
        i = !0;
        return;
      }
      const o = r[0], a = r[1];
      return s !== 0 && !i ? [this.xy2SysCoordInternal(a)] : t.map((A, g) => g === 0 ? a : this._transformByIndex(A, o, !0)).map((A) => this.xy2SysCoordInternal(A));
    });
  }
  // ─── 処理3: ビューポート変換 ───────────────────────────────────────────────
  /**
   * ビューポート → TIN 適用後メルカトル5点
   * histmap_tin.ts viewpoint2MercsAsync() の同期版
   *
   * 中心と ViewpointField から理想相似 5 点をエンコードする（§7.1）。
   * 周囲 4 点の幾何は中心と同じ層の格子からだけ決める。
   *
   * @param viewpoint - ビューポート（center, zoom, rotation）
   * @param size - 画面サイズ [width, height]
   * @param layerIndex - 層番号（省略時は従来の層選択。指定時は範囲判定なしでその層を使い、範囲外は格子端へ clamp）
   * @returns TIN 変換後のメルカトル5点
   */
  viewpoint2Mercs(t, n, i) {
    this._assertMapData(), this._assertMaxxy();
    const r = xa(t.center, this._maxxy);
    let s, o;
    if (i !== void 0) {
      this._assertLayerIndex(i, "viewpoint2Mercs");
      const C = this.getSurfaceTransform(i).transform(r, !1, !0);
      if (!C)
        throw new Error(`viewpoint2Mercs: layer ${i} transform failed`);
      s = i, o = C;
    } else {
      const C = this.xy2MercWithLayer(r);
      if (!C) throw new Error("viewpoint2Mercs: center point is out of bounds");
      [s, o] = C;
    }
    const { s: a, theta: A } = this._evalViewpointCoefficients(s, r, o, !1), g = 2 * It / this._maxxy, c = t.zoom + Math.log2(g / a), u = t.rotation + A;
    return Rs(o, c, u, n);
  }
  /**
   * TIN 適用後メルカトル5点 → ビューポート
   * histmap_tin.ts mercs2ViewpointAsync() の同期版
   *
   * 5 点を理想相似としてデコードし、中心と ViewpointField から復元する（§7.1）。
   *
   * @param mercs - TIN 適用後メルカトル5点
   * @param size - 画面サイズ [width, height]
   * @param layerIndex - 層番号（省略時は従来の層選択。指定時は範囲判定なしでその層を使い、範囲外は格子端へ clamp）
   * @returns ビューポート（center, zoom, rotation）
   */
  mercs2Viewpoint(t, n, i) {
    this._assertMapData(), this._assertMaxxy();
    const r = Ps(t, n);
    let s, o;
    if (i !== void 0) {
      this._assertLayerIndex(i, "mercs2Viewpoint");
      const c = this.getSurfaceTransform(i).transform(r.center, !0, !0);
      if (!c)
        throw new Error(`mercs2Viewpoint: layer ${i} transform failed`);
      s = i, o = c;
    } else {
      const c = this.merc2XyWithLayer(r.center), u = c[0] || c[1];
      if (!u) throw new Error("mercs2Viewpoint: center point is out of bounds");
      [s, o] = u;
    }
    const { s: a, theta: A } = this._evalViewpointCoefficients(s, o, r.center, !0), g = 2 * It / this._maxxy;
    return {
      center: Yr(o, this._maxxy),
      zoom: r.zoom - Math.log2(g / a),
      rotation: Fh(r.rotation - A)
    };
  }
  /**
   * 層番号を指定して、その層の視点係数 (s, θ) を引く公開 API（§7.1 補助メソッド・M-5）。
   * デバッグ・単体試験・`setupMapParameter` 等から、層を 1 つに固定して
   * 中心 1 点の縮尺・向きを問い合わせるために使う。
   *
   * @param layerIndex - 0 = 本図、1 以上 = sub_maps[layerIndex - 1]。範囲外番号・非整数は例外
   * @param coord - 問い合わせ座標（direction が "xy2Merc" なら紙座標、"merc2Xy" ならメルカトル座標）
   * @param direction - "xy2Merc"（既定）= 紙 → 地理の係数参照、"merc2Xy" = 地理 → 紙
   * @returns 視点係数（s: 縮尺比 [3857 単位 / 地図画素]、theta: 局所回転角 [rad]）
   */
  getViewpointCoefficients(t, n, i = "xy2Merc") {
    this._assertMapData(), this._assertLayerIndex(t, "getViewpointCoefficients");
    const r = this.getSurfaceTransform(t);
    if (i === "xy2Merc") {
      const o = r.transform(n, !1, !0);
      if (!o) throw new Error("getViewpointCoefficients: transform failed");
      return this._evalViewpointCoefficients(t, n, o, !1);
    }
    const s = r.transform(n, !0, !0);
    if (!s) throw new Error("getViewpointCoefficients: transform failed");
    return this._evalViewpointCoefficients(t, s, n, !0);
  }
  /**
   * Core の既定ズーム（mercZoom が無い地図）のための口（§7.2 OQ-3）。
   * モード 2 では格子を作らずに紙の中心で測る: その層の面で紙の xy の十字 4 点
   * （半径 radiusPx、ignoreBounds = true）を測り、§1.2 の式で (s, theta) を返すだけ。
   * 視点グリッド（ViewpointField）は作らない（既存の probeCoefficients を使う）。
   *
   * @param layerIndex - 0 = 本図、1 以上 = sub_maps[layerIndex - 1]。範囲外番号・非整数は例外
   * @param xy - 紙座標（十字 4 点の中心）
   * @param radiusPx - 十字 4 点の半径（紙の画素単位。Core の既定値は 150）
   * @returns 視点係数（s: 縮尺比 [3857 単位 / 地図画素]、theta: 局所回転角 [rad]）
   */
  probeViewpointCoefficients(t, n, i) {
    this._assertMapData(), this._assertLayerIndex(t, "probeViewpointCoefficients");
    const r = this.getSurfaceTransform(t), s = _g(r, n, i, !1);
    if (!s)
      throw new Error(
        `probeViewpointCoefficients: layer ${t} probe failed at [${n[0]}, ${n[1]}]`
      );
    return s;
  }
  // ─── ユーティリティ（静的メソッド）────────────────────────────────────────
  /** zoom2Radius の静的ラッパー */
  static zoom2Radius(t, n) {
    return ao(t, n);
  }
  /** mercViewpoint2Mercs の静的ラッパー */
  static mercViewpoint2Mercs(t, n, i, r) {
    return Rs(t, n, i, r);
  }
  /** mercs2MercViewpoint の静的ラッパー */
  static mercs2MercViewpoint(t, n) {
    return Ps(t, n);
  }
  /** xy2SysCoord の静的ラッパー */
  static xy2SysCoord(t, n) {
    return Yr(t, n);
  }
  /** sysCoord2Xy の静的ラッパー */
  static sysCoord2Xy(t, n) {
    return xa(t, n);
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
  /** 層番号の明示指定の検査（範囲外番号・負数・非整数は例外、§4.2 2.） */
  _assertLayerIndex(t, n) {
    if (!Number.isInteger(t) || t < 0 || t >= this.layerCount)
      throw new Error(`${n}: invalid layerIndex ${t}`);
  }
  /** 層の ViewpointField を遅延構築して返す（§2.3。読み込み時には作らない） */
  _fieldFor(t) {
    const n = this._fields[t];
    if (n) return n;
    const i = this.getSurfaceTransform(t);
    if (!i) throw new Error(`invalid layerIndex ${t}`);
    const r = this._layerMetas[t], s = Ao.build({
      surface: i,
      mode: this._viewpointMode === "constant" ? "constant" : "grid",
      strictness: r.strictness,
      paperRect: r.rectOverride ? Sg(i, r.rectOverride) : void 0,
      regionPolygon: r.regionPolygon
    });
    return this._fields[t] = s, s;
  }
  /** 中心 1 点の視点係数を層の ViewpointField から引く */
  _evalViewpointCoefficients(t, n, i, r) {
    return this._fieldFor(t).eval(n, i, r);
  }
  /**
   * レイヤーインデックスに対応する Transform インスタンスを返す（三角網描画などの用途）
   *
   * @param idx - 0 = メイン TIN、1以上 = sub_maps[idx-1]
   * @returns 対応する Transform、または範囲外の場合は null
   */
  getLayerTransform(t) {
    if (t === 0) return this.mainTin instanceof St ? this.mainTin : null;
    const n = this.subTins[t - 1];
    return n?.tin instanceof St ? n.tin : null;
  }
  /**
   * レイヤーインデックスに対応する変換面を返す。
   * 返した面を外で差し替えたら、地図を読み込み直すこと（視点の格子は作り直されない）。
   */
  getSurfaceTransform(t) {
    return t === 0 ? this.mainTin : this.subTins[t - 1]?.tin ?? null;
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
    return this._getAllTinsWithIndex().sort((t, n) => {
      const i = t.tin.priority ?? 0, r = n.tin.priority ?? 0;
      return i < r ? 1 : -1;
    });
  }
  /** メイン TIN + 全 sub TIN を index 付きで返す */
  _getAllTinsWithIndex() {
    const t = [
      { index: 0, tin: this.mainTin, isMain: !0 }
    ];
    return this.subTins.forEach((n, i) => {
      n.tin.priority = n.priority, n.tin.importance = n.importance, t.push({ index: i + 1, tin: n.tin, isMain: !1 });
    }), t;
  }
  /**
   * 指定レイヤーインデックスで TIN 変換を実行する
   * index 0 → mainTin, index 1..n → subTins[index-1]
   */
  _transformByIndex(t, n, i) {
    if (n === 0)
      return this.mainTin.transform(t, i);
    const r = this.subTins[n - 1];
    return r ? r.tin.transform(t, i, !0) : !1;
  }
  /** 内部用 xy2SysCoord（_maxxy を使用） */
  xy2SysCoordInternal(t) {
    return Yr(t, this._maxxy);
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
const Nt = 256, nI = {
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
}, iI = /^https?:\/\/iiif\.io\/api\/image\/2\/level[0-2](?:\.json)?$/, rI = /(^https?:\/\/iiif\.io\/api\/image\/3\/level[0-2](?:\.json)?$)|(^level[0-2]$)/;
function Pg(e) {
  const t = Og(e);
  if (!t) return { ok: !1, reason: "not-json" };
  try {
    let n = t["@context"] || "ol-no-context";
    typeof n == "string" && (n = [n]);
    let i;
    for (let l = 0; l < n.length; l++) {
      const f = n[l];
      if (f === "http://library.stanford.edu/iiif/image-api/1.1/context.json" || f === "http://iiif.io/api/image/1/context.json")
        return { ok: !1, reason: "unsupported-version" };
      if (f === "http://iiif.io/api/image/2/context.json" && (i = "2"), f === "http://iiif.io/api/image/3/context.json" && (i = "3"), i) break;
    }
    if (!i) return { ok: !1, reason: "unsupported-version" };
    let r = t.profile;
    i === "2" && Array.isArray(r) && (r = r[0]);
    const o = (i === "2" ? typeof r == "string" && iI.test(r) : rI.test(r)) ? r.match(/level[0-2](?:\.json)?$/g) : void 0, a = o ? Number(o[0].replace(".json", "").slice(-1)) : 0, A = i === "2" && Array.isArray(t.profile) && t.profile.length > 1 ? t.profile[1] : {}, g = [
      ...o ? nI[i][a] : [],
      ...i === "2" ? A.supports || [] : t.extraFeatures === void 0 ? [] : t.extraFeatures
    ], c = [
      ...o ? a === 2 ? ["jpg", "png"] : ["jpg"] : [],
      ...i === "2" ? A.formats || [] : t.extraFormats === void 0 ? [] : t.extraFormats
    ], u = [
      ...o ? i === "2" && a === 2 ? ["default", "bitonal"] : ["default"] : [],
      ...i === "2" ? A.qualities || [] : t.extraQualities === void 0 ? [] : t.extraQualities
    ], C = i === "3" && Array.isArray(t.preferredFormats) ? t.preferredFormats.find(
      (l) => ["jpg", "png", "gif"].includes(l) && c.includes(l)
    ) : void 0, y = t.tiles === void 0 ? void 0 : [
      t.tiles.map((l) => l.width)[0],
      t.tiles.map(
        (l) => i === "2" && l.height === void 0 ? l.width : l.height
      )[0]
    ], w = t.tiles === void 0 ? void 0 : t.tiles.map((l) => l.scaleFactors)[0];
    return {
      ok: !0,
      service: {
        version: i,
        level: a,
        width: t.width,
        height: t.height,
        id: i === "2" ? t["@id"].replace(/\/?(?:info\.json)?$/g, "") : t.id,
        supports: g,
        format: C === void 0 ? "jpg" : C,
        quality: u.includes("native") ? "native" : "default",
        tileSize: y,
        // OL は元の配列を sort するが、純粋な解釈関数では入力を変更しない。
        scaleFactors: Array.isArray(w) ? [...w].sort((l, f) => f - l) : void 0,
        sizes: t.sizes === void 0 ? void 0 : t.sizes.map((l) => [l.width, l.height])
      }
    };
  } catch {
    return { ok: !1, reason: "unsupported-version" };
  }
}
function go(e) {
  return (e.includes("regionByPx") || e.includes("regionByPct")) && (e.includes("sizeByWh") || e.includes("sizeByH") || e.includes("sizeByW") || e.includes("sizeByPct"));
}
function sI(e) {
  if (go(e.supports)) return;
  const t = Lg(e.tileSize);
  if (t.width !== Nt || t.height !== Nt || !Dg(e.scaleFactors))
    return;
  const n = Math.ceil(
    Math.max(
      Math.log2(e.width / Nt),
      Math.log2(e.height / Nt)
    )
  );
  return Math.max(0, n - Math.log2(Math.max(...e.scaleFactors)));
}
function Jn(e) {
  return e.toLocaleString("en", { maximumFractionDigits: 10 });
}
function oI(e, t, n, i, r) {
  const { width: s, height: o, supports: a, version: A } = t, g = Math.max(
    Math.ceil(Math.log(s / Nt) / Math.LN2),
    Math.ceil(Math.log(o / Nt) / Math.LN2)
  );
  if (n > g || n < 0 || !Number.isInteger(n)) return;
  const c = 2 ** (g - n);
  if (i === void 0 || r === void 0 || i < 0 || Math.ceil(s / c / Nt) <= i || r < 0 || Math.ceil(o / c / Nt) <= r)
    return;
  const u = go(a), C = i * Nt * c, y = r * Nt * c, w = Math.min(Nt * c, s - C), l = Math.min(Nt * c, o - y), f = C + Nt * c > s ? Math.floor((s - C + c - 1) / c) : Nt, p = y + Nt * c > o ? Math.floor((o - y + c - 1) / c) : Nt;
  let I, b;
  return C === 0 && w === s && y === 0 && l === o ? I = "full" : !u || a.includes("regionByPx") ? I = `${C},${y},${w},${l}` : a.includes("regionByPct") && (I = `pct:${Jn(C / s * 100)},${Jn(y / o * 100)},${Jn(w / s * 100)},${Jn(l / o * 100)}`), A === "3" && (!u || a.includes("sizeByWh")) ? b = `${f},${p}` : !u || a.includes("sizeByW") ? b = `${f},` : a.includes("sizeByH") ? b = `,${p}` : a.includes("sizeByWh") ? b = `${f},${p}` : a.includes("sizeByPct") && (b = `pct:${Jn(100 / c)}`), `${e + (e.lastIndexOf("/") === e.length - 1 || e === "" ? "" : "/")}${I}/${b}/0/${t.quality || "default"}.${t.format || "jpg"}`;
}
class ie extends Error {
  reason;
  mapID;
  constructor(t, n, i) {
    super(n || t), this.name = "IiifDeliveryError", this.reason = t, this.mapID = i;
  }
}
function qn(e) {
  return `${e.replace(/\/+$/, "")}/info.json`;
}
function Og(e) {
  if (typeof e == "string")
    try {
      return JSON.parse(e);
    } catch {
      return;
    }
  if (e && typeof e == "object") return e;
}
function Lg(e) {
  if (e == null) return {};
  if (typeof e == "number")
    return { width: e, height: e };
  if (Array.isArray(e)) {
    const t = e[0], n = e[1] === void 0 ? e[0] : e[1];
    return { width: t, height: n };
  }
  return {};
}
function Xi(e) {
  return Number.isInteger(e) && e > 0;
}
function Dg(e) {
  return !Array.isArray(e) || e.length === 0 ? !1 : [...e].sort((n, i) => n - i).every((n, i) => n === 2 ** i);
}
function aI(e, t) {
  const n = Og(e);
  if (!n) return { ok: !1, reason: "not-json" };
  if (!Xi(n.width) || !Xi(n.height))
    return { ok: !1, reason: "size-mismatch" };
  if (t && (!Xi(t.width) || !Xi(t.height) || n.width !== t.width || n.height !== t.height))
    return { ok: !1, reason: "size-mismatch" };
  const i = Pg(n);
  if (!i.ok) return i;
  const { service: r } = i, { level: s, version: o, supports: a } = r;
  if (go(a))
    return { ok: !0, version: o, level: s, tiling: "arbitrary" };
  const { width: g, height: c } = Lg(r.tileSize);
  return g === 256 && c === 256 && Dg(r.scaleFactors) ? { ok: !0, version: o, level: s, tiling: "level0-256" } : { ok: !1, reason: "unsupported-level0" };
}
const AI = 1e4, gI = 1024 * 1024;
function cI(e) {
  return typeof TextEncoder > "u" ? e.length : new TextEncoder().encode(e).length;
}
function lI(e) {
  let t;
  try {
    t = new URL(e);
  } catch {
    throw new ie(
      "bad-url",
      `IIIF image URL is not a URL: ${e}`
    );
  }
  if (t.protocol !== "http:" && t.protocol !== "https:")
    throw new ie(
      "bad-url",
      `IIIF image URL must be http or https: ${e}`
    );
}
async function uI(e, t) {
  const n = e.headers?.get?.("content-length");
  if (n != null) {
    const s = Number(n);
    if (!Number.isNaN(s) && s > t)
      throw new ie(
        "too-large",
        `IIIF info.json is larger than ${t} bytes`
      );
  }
  const i = e.body;
  if (i && typeof i.getReader == "function") {
    const s = i.getReader(), o = typeof TextDecoder > "u" ? void 0 : new TextDecoder();
    let a = 0, A = "";
    for (; ; ) {
      const { done: g, value: c } = await s.read();
      if (g) break;
      if (a += c.byteLength, a > t) {
        try {
          await s.cancel();
        } catch {
        }
        throw new ie(
          "too-large",
          `IIIF info.json is larger than ${t} bytes`
        );
      }
      A += o ? o.decode(c, { stream: !0 }) : String.fromCharCode.apply(null, Array.from(c));
    }
    return o && (A += o.decode()), A;
  }
  const r = await e.text();
  if (cI(r) > t)
    throw new ie(
      "too-large",
      `IIIF info.json is larger than ${t} bytes`
    );
  return r;
}
function Ra(e) {
  try {
    const t = new URL(e);
    return `${t.protocol}//${t.host}${t.pathname.replace(/\/+$/, "")}`;
  } catch {
    return e.replace(/\/+$/, "");
  }
}
async function hI(e, t, n) {
  if (!e || e.type !== "iiifImage" || typeof e.url != "string")
    throw new ie(
      "bad-url",
      "IIIF delivery must have { type: 'iiifImage', url }"
    );
  const i = e.url.replace(/\/+$/, "");
  lI(i);
  const r = fetch, s = new AbortController();
  let o = !1;
  const a = setTimeout(() => {
    o = !0, s.abort();
  }, AI);
  let A;
  try {
    let p;
    try {
      if (p = await r(qn(i), {
        credentials: "omit",
        signal: s.signal
      }), !p || !p.ok)
        throw new ie(
          "fetch-failed",
          `Failed to fetch IIIF info.json: ${qn(i)}`
        );
      A = await uI(p, gI);
    } catch (I) {
      throw I instanceof ie ? I : o ? new ie(
        "timeout",
        `Timed out fetching IIIF info.json: ${qn(i)}`
      ) : new ie(
        "fetch-failed",
        `Failed to fetch IIIF info.json: ${qn(i)}`
      );
    }
  } finally {
    clearTimeout(a);
  }
  let g;
  try {
    g = JSON.parse(A);
  } catch {
    throw new ie(
      "not-json",
      `IIIF info.json is not JSON: ${qn(i)}`
    );
  }
  const c = aI(g, t);
  if (!c.ok) throw new ie(c.reason);
  const u = [], C = g["@id"] || g.id;
  typeof C == "string" && Ra(C) !== Ra(i) && u.push(
    `Maplat: the IIIF image service "${C}" differs from the delivery URL "${i}"; using the delivery URL.`
  );
  const y = Pg(g);
  if (!y.ok) throw new ie(y.reason);
  const w = y.service, l = sI(w);
  return {
    tileUrl: (p, I, b) => oI(i, w, p, I, b),
    service: w,
    url: i,
    width: g.width,
    height: g.height,
    info: g,
    warnings: u,
    ...l !== void 0 ? { minZoom: l } : {}
  };
}
function Pa(e) {
  const t = e && e.delivery;
  return t ? t.type === "iiifImage" ? !0 : (console.warn(
    `Maplat: map "${e.mapID}" has delivery type "${t.type}"; ignoring delivery.`
  ), !1) : !1;
}
async function II(e, t, n) {
  const i = await hI(e.delivery, t);
  (e.url || e.urls) && (console.warn(
    `Maplat: map "${e.mapID}" has both delivery and url; using delivery.`
  ), delete e.url, delete e.urls);
  for (const r of i.warnings) console.warn(r);
  return i.minZoom !== void 0 && (e.minZoom = i.minZoom), i;
}
function CI(e) {
  return e?.delivery?.type === "iiifImage";
}
const co = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAB3RJTUUH3QgIBToaSbAjlwAAABd0RVh0U29mdHdhcmUAR0xEUE5HIHZlciAzLjRxhaThAAAACHRwTkdHTEQzAAAAAEqAKR8AAAAEZ0FNQQAAsY8L/GEFAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAFRJREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgBDwABHHIJwwAAAABJRU5ErkJggg==", Ke = Nt, fI = `<canvas width="${Ke}" height="${Ke}" src="${co}"></canvas>`;
async function $n(e) {
  if (typeof e == "string") {
    const t = e.match(/\//) ? e : `pois/${e}`, n = await fetch(t);
    if (!n.ok)
      throw new Error("Fail to load poi json");
    return await n.json();
  } else
    return e;
}
const Bg = ["hide", "title", "icon", "selectedIcon"], pI = [
  "lnglat",
  "lng",
  "lat",
  "longitude",
  "latitude"
];
function ur(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Ls(e) {
  if (!ur(e) || e.type === "FeatureCollection") return !1;
  const t = e.layer, n = typeof t == "string", i = ur(t) && t.type === "FeatureCollection";
  return !(!n && !i || pI.some((r) => e[r] !== void 0));
}
function dI(e) {
  return Ls(e) && Bg.some((t) => e[t] !== void 0);
}
function Oa(e) {
  const t = {};
  for (const [n, i] of Object.entries(e))
    if (n !== "layer") {
      if (Bg.includes(n)) {
        t[n] = i;
        continue;
      }
      console.warn(`[Maplat] pois layer ref: unknown override key ignored: ${n}`);
    }
  return t;
}
function La(e, t) {
  if (!t) return e;
  t.hide === !0 && (e.hide = !0);
  const n = t.title;
  (typeof n == "string" ? n !== "" : ur(n) && Object.keys(n).length > 0) && (e.name = n);
  for (const i of ["icon", "selectedIcon"]) {
    const r = t[i];
    typeof r == "string" && r !== "" && (e[i] = r);
  }
  return e;
}
async function Ng(e, t) {
  if (e = await $n(e), Array.isArray(e)) {
    const n = e[0];
    if (e.length > 0 && (typeof n == "string" || ur(n) && n.type === "FeatureCollection" || Ls(n))) {
      const r = await Promise.all(
        e.map(async (s, o) => {
          let a, A;
          Ls(s) ? (a = await $n(s.layer), A = Oa(s)) : (a = await $n(s), A = null);
          let g = a.id || a.properties && a.properties.id;
          if (!g)
            if (o === 0) g = "main";
            else throw "POI layers include bad key setting";
          const c = Ue(a, g, t);
          return [g, La(c, A)];
        })
      );
      e = Object.fromEntries(r);
    } else
      e = await Promise.all(e.map(async (r) => await $n(r))), e = {
        main: Ue(e, "main", t)
      };
  } else if (e.type === "FeatureCollection") {
    const n = e.id || e.properties && e.properties.id || "main";
    e = { [n]: Ue(e, n, t) };
  } else if (dI(e)) {
    const n = await $n(e.layer), i = n.id || n.properties && n.properties.id || "main", r = Ue(n, i, t);
    e = { [i]: La(r, Oa(e)) };
  } else
    Object.keys(e).map((n) => {
      e[n] = Ue(e[n], n, t);
    });
  return e.main || (e.main = Ue([], "main", t)), Object.keys(e).map((n) => {
    lo(e, n, t);
  }), e;
}
function Ue(e, t, n) {
  if (Array.isArray(e))
    e = {
      pois: e.map((i) => pi(i))
    };
  else if (e.type === "FeatureCollection") {
    const i = Object.assign({}, e.properties || {});
    e.name && (i.name = e.name), i.pois = e.features.map((r) => pi(r)), e = i;
  }
  if (typeof e.id > "u")
    e.id = t;
  else if (e.id !== t) throw "POI layers include bad key setting";
  return e.namespaceID || (e.namespaceID = `${n.namespace ? `${n.namespace}#` : ""}${t}`), e.name || (e.name = t === "main" ? n.name : t), e.pois || (e.pois = []), e;
}
function pi(e) {
  if (e.type === "Feature") {
    const t = Object.assign({}, e.properties || {});
    t.lnglat = e.geometry.coordinates, t.id || (t.id = e.id), t.name || (t.name = e.name), e = t;
  }
  return e.lnglat || (e.lnglat = [e.lng || e.longitude, e.lat || e.latitude]), delete e.lng, delete e.lat, delete e.longitude, delete e.latitude, e;
}
function lo(e, t, n) {
  if (!e[t]) return;
  const i = e[t], r = i.pois;
  i.__nextId || (i.__nextId = 0), r.map((s) => {
    s.id || (s.id = `${t}_${i.__nextId}`, i.__nextId++), s.namespaceID || (s.namespaceID = `${n.namespace ? `${n.namespace}#` : ""}${s.id}`);
  });
}
function Mt(e, t) {
  if (!(e === null || typeof e != "object") && typeof t == "string")
    return Object.hasOwn(e, t) ? e[t] : void 0;
}
function di(e, t, n = {}) {
  const i = { type: "Feature" };
  return (n.id === 0 || n.id) && (i.id = n.id), n.bbox && (i.bbox = n.bbox), i.properties = t || {}, i.geometry = e, i;
}
function Fg(e, t, n = {}) {
  if (!e)
    throw new Error("coordinates is required");
  if (!Array.isArray(e))
    throw new Error("coordinates must be an Array");
  if (e.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!Ba(e[0]) || !Ba(e[1]))
    throw new Error("coordinates must contain numbers");
  return di({
    type: "Point",
    coordinates: e
  }, t, n);
}
function jg(e, t, n = {}) {
  for (const r of e) {
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
  return di({
    type: "Polygon",
    coordinates: e
  }, t, n);
}
function mI(e, t, n = {}) {
  if (e.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return di({
    type: "LineString",
    coordinates: e
  }, t, n);
}
function Da(e, t = {}) {
  const n = { type: "FeatureCollection" };
  return t.id && (n.id = t.id), t.bbox && (n.bbox = t.bbox), n.features = e, n;
}
function Ba(e) {
  return !isNaN(e) && e !== null && !Array.isArray(e);
}
function yI(e) {
  if (!e)
    throw new Error("coord is required");
  if (!Array.isArray(e)) {
    if (e.type === "Feature" && e.geometry !== null && e.geometry.type === "Point")
      return [...e.geometry.coordinates];
    if (e.type === "Point")
      return [...e.coordinates];
  }
  if (Array.isArray(e) && e.length >= 2 && !Array.isArray(e[0]) && !Array.isArray(e[1]))
    return [...e];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function vI(e) {
  return e.type === "Feature" ? e.geometry : e;
}
function Gg(e, t, n) {
  if (e !== null)
    for (var i, r, s, o, a, A, g, c = 0, u = 0, C, y = e.type, w = y === "FeatureCollection", l = y === "Feature", f = w ? e.features.length : 1, p = 0; p < f; p++) {
      g = w ? (
        // @ts-expect-error: Known type conflict
        e.features[p].geometry
      ) : l ? (
        // @ts-expect-error: Known type conflict
        e.geometry
      ) : e, C = g ? g.type === "GeometryCollection" : !1, a = C ? g.geometries.length : 1;
      for (var I = 0; I < a; I++) {
        var b = 0, d = 0;
        if (o = C ? g.geometries[I] : g, o !== null) {
          A = o.coordinates;
          var h = o.type;
          switch (c = h === "Polygon" || h === "MultiPolygon" ? 1 : 0, h) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  A,
                  u,
                  p,
                  b,
                  d
                ) === !1
              )
                return !1;
              u++, b++;
              break;
            case "LineString":
            case "MultiPoint":
              for (i = 0; i < A.length; i++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    A[i],
                    u,
                    p,
                    b,
                    d
                  ) === !1
                )
                  return !1;
                u++, h === "MultiPoint" && b++;
              }
              h === "LineString" && b++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (i = 0; i < A.length; i++) {
                for (r = 0; r < A[i].length - c; r++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      A[i][r],
                      u,
                      p,
                      b,
                      d
                    ) === !1
                  )
                    return !1;
                  u++;
                }
                h === "MultiLineString" && b++, h === "Polygon" && d++;
              }
              h === "Polygon" && b++;
              break;
            case "MultiPolygon":
              for (i = 0; i < A.length; i++) {
                for (d = 0, r = 0; r < A[i].length; r++) {
                  for (s = 0; s < A[i][r].length - c; s++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        A[i][r][s],
                        u,
                        p,
                        b,
                        d
                      ) === !1
                    )
                      return !1;
                    u++;
                  }
                  d++;
                }
                b++;
              }
              break;
            case "GeometryCollection":
              for (i = 0; i < o.geometries.length; i++)
                if (
                  // @ts-expect-error: Known type conflict
                  Gg(o.geometries[i], t) === !1
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
const Pe = 11102230246251565e-32, Xt = 134217729, wI = (3 + 8 * Pe) * Pe;
function Hr(e, t, n, i, r) {
  let s, o, a, A, g = t[0], c = i[0], u = 0, C = 0;
  c > g == c > -g ? (s = g, g = t[++u]) : (s = c, c = i[++C]);
  let y = 0;
  if (u < e && C < n)
    for (c > g == c > -g ? (o = g + s, a = s - (o - g), g = t[++u]) : (o = c + s, a = s - (o - c), c = i[++C]), s = o, a !== 0 && (r[y++] = a); u < e && C < n; )
      c > g == c > -g ? (o = s + g, A = o - s, a = s - (o - A) + (g - A), g = t[++u]) : (o = s + c, A = o - s, a = s - (o - A) + (c - A), c = i[++C]), s = o, a !== 0 && (r[y++] = a);
  for (; u < e; )
    o = s + g, A = o - s, a = s - (o - A) + (g - A), g = t[++u], s = o, a !== 0 && (r[y++] = a);
  for (; C < n; )
    o = s + c, A = o - s, a = s - (o - A) + (c - A), c = i[++C], s = o, a !== 0 && (r[y++] = a);
  return (s !== 0 || y === 0) && (r[y++] = s), y;
}
function bI(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function xi(e) {
  return new Float64Array(e);
}
const EI = (3 + 16 * Pe) * Pe, xI = (2 + 12 * Pe) * Pe, MI = (9 + 64 * Pe) * Pe * Pe, dn = xi(4), Na = xi(8), Fa = xi(12), ja = xi(16), Kt = xi(4);
function SI(e, t, n, i, r, s, o) {
  let a, A, g, c, u, C, y, w, l, f, p, I, b, d, h, m, v, E;
  const M = e - r, x = n - r, S = t - s, _ = i - s;
  d = M * _, C = Xt * M, y = C - (C - M), w = M - y, C = Xt * _, l = C - (C - _), f = _ - l, h = w * f - (d - y * l - w * l - y * f), m = S * x, C = Xt * S, y = C - (C - S), w = S - y, C = Xt * x, l = C - (C - x), f = x - l, v = w * f - (m - y * l - w * l - y * f), p = h - v, u = h - p, dn[0] = h - (p + u) + (u - v), I = d + p, u = I - d, b = d - (I - u) + (p - u), p = b - m, u = b - p, dn[1] = b - (p + u) + (u - m), E = I + p, u = E - I, dn[2] = I - (E - u) + (p - u), dn[3] = E;
  let P = bI(4, dn), D = xI * o;
  if (P >= D || -P >= D || (u = e - M, a = e - (M + u) + (u - r), u = n - x, g = n - (x + u) + (u - r), u = t - S, A = t - (S + u) + (u - s), u = i - _, c = i - (_ + u) + (u - s), a === 0 && A === 0 && g === 0 && c === 0) || (D = MI * o + wI * Math.abs(P), P += M * c + _ * a - (S * g + x * A), P >= D || -P >= D)) return P;
  d = a * _, C = Xt * a, y = C - (C - a), w = a - y, C = Xt * _, l = C - (C - _), f = _ - l, h = w * f - (d - y * l - w * l - y * f), m = A * x, C = Xt * A, y = C - (C - A), w = A - y, C = Xt * x, l = C - (C - x), f = x - l, v = w * f - (m - y * l - w * l - y * f), p = h - v, u = h - p, Kt[0] = h - (p + u) + (u - v), I = d + p, u = I - d, b = d - (I - u) + (p - u), p = b - m, u = b - p, Kt[1] = b - (p + u) + (u - m), E = I + p, u = E - I, Kt[2] = I - (E - u) + (p - u), Kt[3] = E;
  const F = Hr(4, dn, 4, Kt, Na);
  d = M * c, C = Xt * M, y = C - (C - M), w = M - y, C = Xt * c, l = C - (C - c), f = c - l, h = w * f - (d - y * l - w * l - y * f), m = S * g, C = Xt * S, y = C - (C - S), w = S - y, C = Xt * g, l = C - (C - g), f = g - l, v = w * f - (m - y * l - w * l - y * f), p = h - v, u = h - p, Kt[0] = h - (p + u) + (u - v), I = d + p, u = I - d, b = d - (I - u) + (p - u), p = b - m, u = b - p, Kt[1] = b - (p + u) + (u - m), E = I + p, u = E - I, Kt[2] = I - (E - u) + (p - u), Kt[3] = E;
  const N = Hr(F, Na, 4, Kt, Fa);
  d = a * c, C = Xt * a, y = C - (C - a), w = a - y, C = Xt * c, l = C - (C - c), f = c - l, h = w * f - (d - y * l - w * l - y * f), m = A * g, C = Xt * A, y = C - (C - A), w = A - y, C = Xt * g, l = C - (C - g), f = g - l, v = w * f - (m - y * l - w * l - y * f), p = h - v, u = h - p, Kt[0] = h - (p + u) + (u - v), I = d + p, u = I - d, b = d - (I - u) + (p - u), p = b - m, u = b - p, Kt[1] = b - (p + u) + (u - m), E = I + p, u = E - I, Kt[2] = I - (E - u) + (p - u), Kt[3] = E;
  const R = Hr(N, Fa, 4, Kt, ja);
  return ja[R - 1];
}
function TI(e, t, n, i, r, s) {
  const o = (t - s) * (n - r), a = (e - r) * (i - s), A = o - a, g = Math.abs(o + a);
  return Math.abs(A) >= EI * g ? A : -SI(e, t, n, i, r, s, g);
}
function _I(e, t) {
  var n, i, r = 0, s, o, a, A, g, c, u, C = e[0], y = e[1], w = t.length;
  for (n = 0; n < w; n++) {
    i = 0;
    var l = t[n], f = l.length - 1;
    if (c = l[0], c[0] !== l[f][0] && c[1] !== l[f][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (o = c[0] - C, a = c[1] - y, i; i < f; i++) {
      if (u = l[i + 1], A = u[0] - C, g = u[1] - y, a === 0 && g === 0) {
        if (A <= 0 && o >= 0 || o <= 0 && A >= 0)
          return 0;
      } else if (g >= 0 && a <= 0 || g <= 0 && a >= 0) {
        if (s = TI(o, A, a, g, 0, 0), s === 0)
          return 0;
        (s > 0 && g > 0 && a <= 0 || s < 0 && g <= 0 && a > 0) && r++;
      }
      c = u, a = g, o = A;
    }
  }
  return r % 2 !== 0;
}
function kI(e, t, n = {}) {
  if (!e)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = yI(e), r = vI(t), s = r.type, o = t.bbox;
  let a = r.coordinates;
  if (o && RI(i, o) === !1)
    return !1;
  s === "Polygon" && (a = [a]);
  for (var A = 0; A < a.length; ++A) {
    const g = _I(i, a[A]);
    if (g === 0 && !n.ignoreBoundary) return !0;
    if (g) return !0;
  }
  return !1;
}
function RI(e, t) {
  return t[0] <= e[0] && t[1] <= e[1] && t[2] >= e[0] && t[3] >= e[1];
}
class zg {
  constructor(t = [], n = PI) {
    if (this.data = t, this.length = this.data.length, this.compare = n, this.length > 0)
      for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
  }
  push(t) {
    this.data.push(t), this.length++, this._up(this.length - 1);
  }
  pop() {
    if (this.length === 0) return;
    const t = this.data[0], n = this.data.pop();
    return this.length--, this.length > 0 && (this.data[0] = n, this._down(0)), t;
  }
  peek() {
    return this.data[0];
  }
  _up(t) {
    const { data: n, compare: i } = this, r = n[t];
    for (; t > 0; ) {
      const s = t - 1 >> 1, o = n[s];
      if (i(r, o) >= 0) break;
      n[t] = o, t = s;
    }
    n[t] = r;
  }
  _down(t) {
    const { data: n, compare: i } = this, r = this.length >> 1, s = n[t];
    for (; t < r; ) {
      let o = (t << 1) + 1, a = n[o];
      const A = o + 1;
      if (A < this.length && i(n[A], a) < 0 && (o = A, a = n[A]), i(a, s) >= 0) break;
      n[t] = a, t = o;
    }
    n[t] = s;
  }
}
function PI(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
const Oe = 11102230246251565e-32, Zt = 134217729, OI = (3 + 8 * Oe) * Oe;
function Qr(e, t, n, i, r) {
  let s, o, a, A, g = t[0], c = i[0], u = 0, C = 0;
  c > g == c > -g ? (s = g, g = t[++u]) : (s = c, c = i[++C]);
  let y = 0;
  if (u < e && C < n)
    for (c > g == c > -g ? (o = g + s, a = s - (o - g), g = t[++u]) : (o = c + s, a = s - (o - c), c = i[++C]), s = o, a !== 0 && (r[y++] = a); u < e && C < n; )
      c > g == c > -g ? (o = s + g, A = o - s, a = s - (o - A) + (g - A), g = t[++u]) : (o = s + c, A = o - s, a = s - (o - A) + (c - A), c = i[++C]), s = o, a !== 0 && (r[y++] = a);
  for (; u < e; )
    o = s + g, A = o - s, a = s - (o - A) + (g - A), g = t[++u], s = o, a !== 0 && (r[y++] = a);
  for (; C < n; )
    o = s + c, A = o - s, a = s - (o - A) + (c - A), c = i[++C], s = o, a !== 0 && (r[y++] = a);
  return (s !== 0 || y === 0) && (r[y++] = s), y;
}
function LI(e, t) {
  let n = t[0];
  for (let i = 1; i < e; i++) n += t[i];
  return n;
}
function Mi(e) {
  return new Float64Array(e);
}
const DI = (3 + 16 * Oe) * Oe, BI = (2 + 12 * Oe) * Oe, NI = (9 + 64 * Oe) * Oe * Oe, mn = Mi(4), Ga = Mi(8), za = Mi(12), Ua = Mi(16), Jt = Mi(4);
function FI(e, t, n, i, r, s, o) {
  let a, A, g, c, u, C, y, w, l, f, p, I, b, d, h, m, v, E;
  const M = e - r, x = n - r, S = t - s, _ = i - s;
  d = M * _, C = Zt * M, y = C - (C - M), w = M - y, C = Zt * _, l = C - (C - _), f = _ - l, h = w * f - (d - y * l - w * l - y * f), m = S * x, C = Zt * S, y = C - (C - S), w = S - y, C = Zt * x, l = C - (C - x), f = x - l, v = w * f - (m - y * l - w * l - y * f), p = h - v, u = h - p, mn[0] = h - (p + u) + (u - v), I = d + p, u = I - d, b = d - (I - u) + (p - u), p = b - m, u = b - p, mn[1] = b - (p + u) + (u - m), E = I + p, u = E - I, mn[2] = I - (E - u) + (p - u), mn[3] = E;
  let P = LI(4, mn), D = BI * o;
  if (P >= D || -P >= D || (u = e - M, a = e - (M + u) + (u - r), u = n - x, g = n - (x + u) + (u - r), u = t - S, A = t - (S + u) + (u - s), u = i - _, c = i - (_ + u) + (u - s), a === 0 && A === 0 && g === 0 && c === 0) || (D = NI * o + OI * Math.abs(P), P += M * c + _ * a - (S * g + x * A), P >= D || -P >= D)) return P;
  d = a * _, C = Zt * a, y = C - (C - a), w = a - y, C = Zt * _, l = C - (C - _), f = _ - l, h = w * f - (d - y * l - w * l - y * f), m = A * x, C = Zt * A, y = C - (C - A), w = A - y, C = Zt * x, l = C - (C - x), f = x - l, v = w * f - (m - y * l - w * l - y * f), p = h - v, u = h - p, Jt[0] = h - (p + u) + (u - v), I = d + p, u = I - d, b = d - (I - u) + (p - u), p = b - m, u = b - p, Jt[1] = b - (p + u) + (u - m), E = I + p, u = E - I, Jt[2] = I - (E - u) + (p - u), Jt[3] = E;
  const F = Qr(4, mn, 4, Jt, Ga);
  d = M * c, C = Zt * M, y = C - (C - M), w = M - y, C = Zt * c, l = C - (C - c), f = c - l, h = w * f - (d - y * l - w * l - y * f), m = S * g, C = Zt * S, y = C - (C - S), w = S - y, C = Zt * g, l = C - (C - g), f = g - l, v = w * f - (m - y * l - w * l - y * f), p = h - v, u = h - p, Jt[0] = h - (p + u) + (u - v), I = d + p, u = I - d, b = d - (I - u) + (p - u), p = b - m, u = b - p, Jt[1] = b - (p + u) + (u - m), E = I + p, u = E - I, Jt[2] = I - (E - u) + (p - u), Jt[3] = E;
  const N = Qr(F, Ga, 4, Jt, za);
  d = a * c, C = Zt * a, y = C - (C - a), w = a - y, C = Zt * c, l = C - (C - c), f = c - l, h = w * f - (d - y * l - w * l - y * f), m = A * g, C = Zt * A, y = C - (C - A), w = A - y, C = Zt * g, l = C - (C - g), f = g - l, v = w * f - (m - y * l - w * l - y * f), p = h - v, u = h - p, Jt[0] = h - (p + u) + (u - v), I = d + p, u = I - d, b = d - (I - u) + (p - u), p = b - m, u = b - p, Jt[1] = b - (p + u) + (u - m), E = I + p, u = E - I, Jt[2] = I - (E - u) + (p - u), Jt[3] = E;
  const R = Qr(N, za, 4, Jt, Ua);
  return Ua[R - 1];
}
function Xa(e, t, n, i, r, s) {
  const o = (t - s) * (n - r), a = (e - r) * (i - s), A = o - a;
  if (o === 0 || a === 0 || o > 0 != a > 0) return A;
  const g = Math.abs(o + a);
  return Math.abs(A) >= DI * g ? A : -FI(e, t, n, i, r, s, g);
}
function jI(e, t) {
  const n = new zg([], Ug);
  return zI(e, n), XI(n, t);
}
function Ug(e, t) {
  return e.p.x > t.p.x ? 1 : e.p.x < t.p.x || e.p.x === t.p.x && (e.featureId !== t.featureId || e.ringId !== t.ringId) && e.isLeftEndpoint && !t.isLeftEndpoint ? -1 : e.p.y !== t.p.y ? e.p.y > t.p.y ? 1 : -1 : 1;
}
function GI(e, t) {
  return e.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : e.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : e.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? e.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function zI(e, t) {
  {
    const n = e.features;
    for (let i = 0; i < n.length; i++)
      UI(n[i], t);
  }
}
var Zi = 0, Vi = 0, Wi = 0;
function UI(e, t) {
  const n = e.type === "Feature" ? e.geometry : e;
  let i = n.coordinates;
  (n.type === "Polygon" || n.type === "MultiLineString") && (i = [i]), n.type === "LineString" && (i = [[i]]);
  for (let r = 0; r < i.length; r++)
    for (let s = 0; s < i[r].length; s++) {
      let o = i[r][s][0], a = null;
      Vi = Vi + 1;
      for (let A = 0; A < i[r][s].length - 1; A++) {
        a = i[r][s][A + 1];
        const g = new Za(o, Zi, Vi, Wi), c = new Za(a, Zi, Vi, Wi + 1);
        g.otherEvent = c, c.otherEvent = g, Ug(g, c) > 0 ? (c.isLeftEndpoint = !0, g.isLeftEndpoint = !1) : (g.isLeftEndpoint = !0, c.isLeftEndpoint = !1), t.push(g), t.push(c), o = a, Wi = Wi + 1;
      }
    }
  Zi = Zi + 1;
}
var Za = class {
  constructor(e, t, n, i) {
    this.p = {
      x: e[0],
      y: e[1]
    }, this.featureId = t, this.ringId = n, this.eventId = i, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(e) {
    return this.p.x === e.p.x && this.p.y === e.p.y;
  }
  asNewXY() {
    return [this.p.x, this.p.y];
  }
};
function XI(e, t = !1) {
  const n = [], i = new zg([], GI);
  for (; e.length; ) {
    const r = e.pop();
    if (r.isLeftEndpoint) {
      const s = new ZI(r);
      for (let o = 0; o < i.data.length; o++) {
        const a = i.data[o];
        if (t && a.leftSweepEvent.featureId === r.featureId)
          continue;
        const A = VI(s, a);
        A !== !1 && n.push(A);
      }
      i.push(s);
    } else r.isLeftEndpoint === !1 && i.pop();
  }
  return n;
}
var ZI = class {
  /** @param event must have otherEvent non-null */
  constructor(e) {
    this.leftSweepEvent = e, this.rightSweepEvent = e.otherEvent;
  }
};
function VI(e, t) {
  if (e === null || t === null) return !1;
  const n = e.leftSweepEvent.p.x, i = e.leftSweepEvent.p.y, r = e.rightSweepEvent.p.x, s = e.rightSweepEvent.p.y, o = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, A = t.rightSweepEvent.p.x, g = t.rightSweepEvent.p.y, c = Xa(n, i, r, s, o, a), u = Xa(n, i, r, s, A, g);
  if (c > 0 && u > 0) return !1;
  if (c < 0 && u < 0) return !1;
  if (e.leftSweepEvent.ringId === t.leftSweepEvent.ringId) {
    if (e.rightSweepEvent.isSamePoint(t.leftSweepEvent) || e.rightSweepEvent.isSamePoint(t.rightSweepEvent) || e.leftSweepEvent.isSamePoint(t.leftSweepEvent) || e.leftSweepEvent.isSamePoint(t.rightSweepEvent))
      return !1;
  } else {
    if (e.rightSweepEvent.isSamePoint(t.leftSweepEvent))
      return t.leftSweepEvent.asNewXY();
    if (e.rightSweepEvent.isSamePoint(t.rightSweepEvent))
      return t.rightSweepEvent.asNewXY();
    if (e.leftSweepEvent.isSamePoint(t.leftSweepEvent))
      return t.leftSweepEvent.asNewXY();
    if (e.leftSweepEvent.isSamePoint(t.rightSweepEvent))
      return t.rightSweepEvent.asNewXY();
  }
  const C = (g - a) * (r - n) - (A - o) * (s - i), y = (A - o) * (i - a) - (g - a) * (n - o), w = (r - n) * (i - a) - (s - i) * (n - o);
  if (C === 0)
    return !1;
  const l = y / C, f = w / C;
  if (l >= 0 && l <= 1 && f >= 0 && f <= 1) {
    const p = n + l * (r - n), I = i + l * (s - i);
    return [p, I];
  }
  return !1;
}
function WI(e, t, n = {}) {
  const { removeDuplicates: i = !0, ignoreSelfIntersections: r = !0 } = n;
  let s = [];
  e.type === "FeatureCollection" ? s = s.concat(e.features) : e.type === "Feature" ? s.push(e) : (e.type === "LineString" || e.type === "Polygon" || e.type === "MultiLineString" || e.type === "MultiPolygon") && s.push(di(e)), t.type === "FeatureCollection" ? s = s.concat(t.features) : t.type === "Feature" ? s.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && s.push(di(t));
  const o = jI(
    Da(s),
    r
  );
  let a = [];
  if (i) {
    const A = {};
    o.forEach((g) => {
      const c = g.join(",");
      A[c] || (A[c] = !0, a.push(g));
    });
  } else
    a = o;
  return Da(a.map((A) => Fg(A)));
}
function YI(e, t = {}) {
  let n = 0, i = 0, r = 0;
  return Gg(
    e,
    function(s) {
      n += s[0], i += s[1], r++;
    }
  ), Fg([n / r, i / r], t.properties);
}
const nr = "maplat-ui", HI = [
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
], QI = [
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
  ...HI.filter((e) => e.startup).map((e) => e.prop),
  ...QI.filter((e) => e.startup).map((e) => e.prop)
];
const Va = (e) => typeof e == "string" || !!e && typeof e == "object" && Object.values(e).every((t) => typeof t == "string");
function KI(e) {
  const t = e;
  return !t || typeof t != "object" || Array.isArray(t) || Array.isArray(t.label) || Array.isArray(t.value) ? !1 : (t.from === "manifest" || t.from === "canvas") && Va(t.label) && Va(t.value);
}
const JI = "hidden";
function Kr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Xg(e, t) {
  if (!Kr(e)) return;
  const n = {};
  if (typeof e.manifest == "string" && (n.manifest = e.manifest), typeof e.canvas == "string" && (n.canvas = e.canvas), typeof e.image == "string" && (n.image = e.image), typeof e.copiedAt == "string" && (n.copiedAt = e.copiedAt), Kr(e.bindings) && (n.bindings = e.bindings), Kr(e.copiedValues) && (n.copiedValues = e.copiedValues), Array.isArray(e.copiedMetadata)) {
    const i = e.copiedMetadata.filter(KI), r = e.copiedMetadata.length - i.length;
    r > 0 && t !== void 0 && console.warn(
      `Maplat: ignored ${r} malformed entries in iiif.copiedMetadata (mapID: "${t}").`
    ), n.copiedMetadata = i;
  }
  return n;
}
function Zg(e) {
  return e === "all" || e === "hidden" ? e : void 0;
}
function qI(e, t) {
  const n = Xg(e);
  if (!n) return;
  const i = {
    display: Zg(t) ?? JI
  };
  return n.manifest !== void 0 && (i.manifest = n.manifest), n.canvas !== void 0 && (i.canvas = n.canvas), n.image !== void 0 && (i.image = n.image), n.copiedAt !== void 0 && (i.copiedAt = n.copiedAt), n.copiedMetadata !== void 0 && (i.metadata = n.copiedMetadata), i;
}
function Vg(e) {
  class t extends e {
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
      if (i = we(i), this.mapID = i.mapID, this.homePosition = i.homePosition, this.mercZoom = i.mercZoom, this.label = i.label, this.maxZoom = i.maxZoom, this.minZoom = i.minZoom, this.poiTemplate = i.poiTemplate, this.poiStyle = i.poiStyle, this.iconTemplate = i.iconTemplate, this.icon = i.icon, this.selectedIcon = i.selectedIcon, this.mercatorXShift = i.mercatorXShift, this.mercatorYShift = i.mercatorYShift, this.weiwudi = i.weiwudi, this.iiif = Xg(i.iiif, this.mapID), this.iiifMetadataDisplay = Zg(i.iiifMetadata), i.envelopeLngLats) {
        const a = i.envelopeLngLats.map(
          (A) => re(A, "EPSG:4326", "EPSG:3857")
        );
        a.push(a[0]), this.envelope = jg([a]), this.centroid = YI(this.envelope).geometry?.coordinates;
      }
      for (let o = 0; o < li.length; o++) {
        const a = li[o], A = ol[o];
        this.set(a, i[A] || i[a]);
      }
      const r = i.thumbnail ? new Promise((o) => {
        this.thumbnail = i.thumbnail, o(void 0);
      }) : new Promise((o) => {
        this.thumbnail = `./tmbs/${i.mapID}.jpg`, fetch(this.thumbnail).then((a) => {
          a.ok || (this.thumbnail = `./tmbs/${i.mapID}_menu.jpg`), o(void 0);
        }).catch((a) => {
          this.thumbnail = `./tmbs/${i.mapID}_menu.jpg`, o(void 0);
        });
      }).catch((o) => {
        this.thumbnail = `./tmbs/${i.mapID || i.sourceID}_menu.jpg`;
      }), s = this.resolvePois(i.pois);
      this.initialWait = Promise.all([s, r]), tC(this);
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
      const o = i.mercZoom, a = i.zoom, A = i.direction, g = i.rotation, c = this.getMap(), u = c?.getView(), C = c ? c.getSize() : void 0;
      u && (!C || C[0] <= 0 || C[1] <= 0) || (i.latitude !== void 0 && i.longitude !== void 0 && (r = re(
        [i.longitude, i.latitude],
        "EPSG:4326",
        "EPSG:3857"
      )), i.x !== void 0 && i.y != null && (s = [i.x, i.y]), this.viewpoint2MercsAsync().then((y) => this.mercs2MercViewpoint(y)).then((y) => {
        const w = this.mercViewpoint2Mercs([
          r || y[0],
          o || y[1] || 17,
          A ?? g ?? y[2]
        ]);
        this.mercs2ViewpointAsync(w).then((l) => {
          r != null ? u?.setCenter(l[0]) : s != null && u?.setCenter(s), o != null ? u?.setZoom(l[1]) : a != null && u?.setZoom(a), A != null ? u?.setRotation(l[2]) : g != null && u?.setRotation(g);
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
      const o = r.homeMarginPixels, a = [
        (s.clientWidth - o - 10) * 1,
        (s.clientHeight - o - 10) * 1
      ], A = {
        longitude: this.homePosition[0],
        latitude: this.homePosition[1],
        zoom: this.defZoom(a)
      };
      this.getMap().northUp ? A.direction = 0 : A.rotation = 0, this.setViewpointRadian(A);
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
        return new Promise((A, g) => {
          s?.setGPSPosition(null), A(!0);
        });
      const a = this.mercsFromGPSValue(i.lnglat, i.acc);
      return this.mercs2SysCoordsAsync_multiLayer([a]).then((A) => {
        const g = !A[0], c = g ? A[1] : A[0];
        if (!c || !this.insideCheckSysCoord(c[0][0]))
          return s?.setGPSPosition(null), !1;
        const u = g ? null : A[1], C = { xy: c[0][0] }, y = c[0].slice(1);
        return C.rad = y.reduce(
          (w, l, f) => {
            const p = w + Math.sqrt(
              Math.pow(l[0] - C.xy[0], 2) + Math.pow(l[1] - C.xy[1], 2)
            );
            return f === 3 ? p / 4 : p;
          },
          0
        ), r || o?.setCenter(C.xy), s?.setGPSPosition(C, g ? "hide" : null), u && s?.setGPSPosition({ xy: u[0][0] }, "sub"), !0;
      }).catch((A) => {
        throw A;
      });
    }
    setGPSMarker(i, r = !1) {
      this.setGPSMarkerAsync(i, r).then(() => {
      });
    }
    mercsFromGPSValue(i, r) {
      const s = re(i, "EPSG:4326", "EPSG:3857"), o = i[1] * Math.PI / 180, a = r / Math.cos(o);
      return mg.map((A) => [
        A[0] * a + s[0],
        A[1] * a + s[1]
      ]);
    }
    // 与えられた差分行列を回転。theta無指定の場合は自動取得
    rotateMatrix(i, r) {
      return r === void 0 && (r = this.getMap().getView().getRotation()), Mg(i, r);
    }
    async resolvePois(i) {
      this.pois = await Ng(i || [], {
        name: this.officialTitle || this.title,
        namespace: this.mapID
      });
    }
    getPoi(i) {
      let r;
      return Object.keys(this.pois).map((s) => {
        this.pois[s].pois.map((o, a) => {
          o.id === i && (r = this.pois[s].pois[a]);
        });
      }), r;
    }
    addPoi(i, r) {
      r || (r = "main");
      const s = Mt(this.pois, r);
      if (s)
        return i = pi(i), s.pois.push(i), lo(this.pois, r, {
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
        const r = Mt(this.pois, i);
        r && (r.pois = []);
      }
    }
    listPoiLayers(i = !1, r = !1) {
      return Object.keys(this.pois).sort((s, o) => s === "main" ? -1 : o === "main" ? 1 : 0).map((s) => this.pois[s]).filter(
        (s) => r ? i ? s.pois.length && s.hide : s.pois.length : i ? s.hide : !0
      );
    }
    getPoiLayer(i) {
      return Mt(this.pois, i);
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
      return r === void 0 && (r = this.getMap().getView().getDecimalZoom()), ao(i, r);
    }
    // 画面サイズと地図ズームから、地図面座標上での5座標を取得する。zoom, rotate無指定の場合は自動取得
    viewpoint2SysCoords(i, r) {
      return this.mercViewpoint2Mercs(i, r);
    }
    mercViewpoint2Mercs(i, r) {
      let s = i ? i[0] : void 0;
      const o = i ? i[1] : void 0, a = i ? i[2] : void 0;
      s === void 0 && (s = this.getMap().getView().getCenter()), r === void 0 && (r = this.getMap().getSize());
      const A = o ?? this.getMap().getView().getDecimalZoom(), g = a ?? this.getMap().getView().getRotation();
      return [Rs(
        s,
        A,
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
      const s = Ps(
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
function Wg(e) {
  class t extends Vg(e) {
    static isBasemap_ = !0;
    static isWmts_ = !0;
    insideCheckXy(i) {
      return this.envelope ? kI(i, this.envelope) : !0;
    }
    insideCheckSysCoord(i) {
      return this.insideCheckXy(i);
    }
    modulateXyInside(i) {
      if (!this.centroid) return i;
      const r = mI([i, this.centroid]), s = WI(this.envelope, r);
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
function $I(e) {
  class t extends Vg(e) {
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
      const r = i[0] * (2 * It) / this._maxxy - It, s = -1 * (i[1] * (2 * It) / this._maxxy - It);
      return [r, s];
    }
    sysCoord2Xy(i) {
      const r = (i[0] + It) * this._maxxy / (2 * It), s = (-i[1] + It) * this._maxxy / (2 * It);
      return [r, s];
    }
    defZoom(i) {
      const r = i[0], s = i[1], o = Math.log2((r - 10) / this.width), a = Math.log2((s - 10) / this.height), A = this.maxZoom;
      let g;
      return a > o ? g = a : g = o, A + g;
    }
  }
  return t;
}
const Ds = (e) => (e || "").match(/^(?:google(?:_(?:roadmap|satellite|hybrid|terrain))?|mapbox|maplibre)$/);
function Yg(e) {
  return e = we(e), e.imageExtension || (e.imageExtension = "jpg"), Ds(e.maptype) ? (delete e.url, delete e.urls) : e.mapID && !e.url && !e.urls && (e.url = e.tms ? `tiles/${e.mapID}/{z}/{x}/{-y}.${e.imageExtension}` : `tiles/${e.mapID}/{z}/{x}/{y}.${e.imageExtension}`), e;
}
function tC(e) {
  const t = e;
  e.setTileLoadFunction(
    (function() {
      const n = t.getTileLoadFunction(), i = [1e3, 2e3, 4e3], r = /* @__PURE__ */ new WeakMap();
      let s = !1;
      const o = function(A, g) {
        s || (s = !0, console.warn(
          "Maplat: tile composition failed by an exception; retrying (up to 3 times)",
          g
        ));
        const c = r.get(A) ?? 0;
        c >= i.length || (r.set(A, c + 1), setTimeout(() => {
          const u = t.getMap?.()?.getTargetElement?.();
          u && !u.isConnected || A.getState?.() === ju.ERROR && A.load();
        }, i[c]));
      }, a = function(A, g, c, u, C, y, w) {
        return new Promise((l, f) => {
          const p = function(I, b = void 0) {
            const d = document.createElement("img");
            d.crossOrigin = "Anonymous", d.onload = d.onerror = function() {
              try {
                if (d.width && d.height) {
                  const h = c.getContext("2d"), m = u === 0 ? 256 - y : 0, v = C === 0 ? 256 - w : 0;
                  y = u + y > d.width ? d.width - u : y, w = C + w > d.height ? d.height - C : w, h.drawImage(d, u, C, y, w, m, v, y, w), l(void 0);
                } else
                  b ? p(b) : l("tileLoadError");
              } catch {
                l("tileException");
              }
            }, d.src = I;
          };
          p(g);
        });
      };
      return function(A, g) {
        const c = A.tileCoord[0];
        let u = A.tileCoord[1], C = A.tileCoord[2], y = Math.round(
          (t.mercatorXShift || 0) * 128 * Math.pow(2, c) / It
        ), w = Math.round(
          (t.mercatorYShift || 0) * -128 * Math.pow(2, c) / It
        );
        for (; y < 0 || y >= 256; )
          y < 0 ? (y = y + 256, u++) : (y = y - 256, u--);
        for (; w < 0 || w >= 256; )
          w < 0 ? (w = w + 256, C++) : (w = w - 256, C--);
        const l = document.createElement("div");
        l.innerHTML = fI;
        const f = l.childNodes[0], p = [
          [[c, u, C], 0, 0, 256 - y, 256 - w]
        ];
        y !== 0 && p.push([
          [c, u - 1, C],
          256 - y,
          0,
          y,
          256 - w
        ]), w !== 0 && (p.push([
          [c, u, C - 1],
          0,
          256 - w,
          256 - y,
          w
        ]), y !== 0 && p.push([
          [c, u - 1, C - 1],
          256 - y,
          256 - w,
          y,
          w
        ])), Promise.all(
          p.map((I) => {
            const b = t.tileUrlFunction(
              I[0],
              t.tilePixelRatio_,
              t.projection_
            );
            return a(
              I[0],
              b,
              f,
              I[1],
              I[2],
              I[3],
              I[4]
            );
          })
        ).then((I) => {
          if (I.reduce((d, h) => d && h, !0))
            A.handleImageError_(), I.includes("tileException") && o(A);
          else {
            const d = f.toDataURL(), h = A.getImage();
            h.crossOrigin = null, n(A, d), r.delete(A);
          }
        }).catch((I) => {
          A.handleImageError_(), o(A, I);
        });
      };
    })()
  );
}
class Gn extends Wg(GA) {
  constructor(t = {}) {
    const n = Yg(t);
    if (super(n), t.mapID && (this.mapID = t.mapID), t.mapID === "morioka_ndl_affine") {
      const i = this.getTileUrlFunction();
      this.setTileUrlFunction((r, s, o) => i(r, s, o));
    }
    this.initialize(t);
  }
}
class hr extends Gn {
  style = "";
  accessToken = "";
  mapboxMap;
  static isMapbox_ = !0;
  constructor(t = {}) {
    super(t), this.style = t.style, this.mapboxMap = t.mapboxMap, this.accessToken = t.accessToken;
  }
}
class Ir extends Gn {
  style = "";
  maplibreMap;
  static isMapLibre_ = !0;
  constructor(t = {}) {
    super(t), this.style = t.style || "https://tile.openstreetmap.jp/styles/osm-bright/style.json", this.maplibreMap = t.maplibreMap;
  }
}
function eC(e, t) {
  const i = e ? {
    google_roadmap: { mapType: "roadmap", derivedLayers: [] },
    google_satellite: { mapType: "satellite", derivedLayers: [] },
    google_hybrid: { mapType: "satellite", derivedLayers: ["layerRoadmap"] },
    google_terrain: { mapType: "terrain", derivedLayers: ["layerRoadmap"] }
  }[e] : void 0, r = i?.mapType ?? "roadmap", s = i?.derivedLayers ?? [], o = (t || []).map(
    (A) => `layer${A.charAt(0).toUpperCase()}${A.slice(1).toLowerCase()}`
  ), a = new Set(s);
  for (const A of o) a.add(A);
  return { mapType: r, layerTypes: [...a] };
}
class Bs extends Wg(il) {
  /**
   * Map Tiles API の mapType（roadmap・satellite・terrain）。出典の表示（src/attribution.ts）が、
   * Google の地図かどうかと、Google Maps のロゴの種類（衛星は白い字）を決めるのに読む。
   */
  googleMapType;
  constructor(t = {}) {
    const n = Object.assign({}, t), { mapType: i, layerTypes: r } = eC(t.maptype, t.layers);
    n.mapType = i, n.layerTypes = r, super(n), this.googleMapType = i, t.mapID && (this.mapID = t.mapID), this.initialize(t);
  }
}
const je = {
  ANIMATING: 0,
  INTERACTING: 1
}, he = {
  CENTER: "center",
  RESOLUTION: "resolution",
  ROTATION: "rotation"
};
function Wa(e, t, n) {
  return (
    /**
     * @param {import("./coordinate.js").Coordinate|undefined} center Center.
     * @param {number|undefined} resolution Resolution.
     * @param {import("./size.js").Size} size Viewport size; unused if `onlyCenter` was specified.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @param {Array<number>} [centerShift] Shift between map center and viewport center.
     * @return {import("./coordinate.js").Coordinate|undefined} Center.
     */
    (function(i, r, s, o, a) {
      if (!i)
        return;
      if (!r && !t)
        return i;
      const A = t ? 0 : s[0] * (r ?? 0), g = t ? 0 : s[1] * (r ?? 0), c = a ? a[0] : 0, u = a ? a[1] : 0;
      let C = e[0] + A / 2 + c, y = e[2] - A / 2 + c, w = e[1] + g / 2 + u, l = e[3] - g / 2 + u;
      C > y && (C = (y + C) / 2, y = C), w > l && (w = (l + w) / 2, l = w);
      let f = Ie(i[0], C, y), p = Ie(i[1], w, l);
      if (o && n && r) {
        const I = 30 * r;
        f += -I * Math.log(1 + Math.max(0, C - i[0]) / I) + I * Math.log(1 + Math.max(0, i[0] - y) / I), p += -I * Math.log(1 + Math.max(0, w - i[1]) / I) + I * Math.log(1 + Math.max(0, i[1] - l) / I);
      }
      return [f, p];
    })
  );
}
function nC(e) {
  return e;
}
function iC(e) {
  return Math.pow(e, 3);
}
function Er(e) {
  return 1 - iC(1 - e);
}
function rC(e) {
  return 3 * e * e - 2 * e * e * e;
}
function sC(e) {
  return e;
}
function uo(e, t, n, i) {
  const r = Qs(t) / n[0], s = ui(t) / n[1];
  return i ? Math.min(e, Math.max(r, s)) : Math.min(e, Math.min(r, s));
}
function ho(e, t, n) {
  let i = Math.min(e, t);
  const r = 50;
  return i *= Math.log(1 + r * Math.max(0, e / t - 1)) / r + 1, n && (i = Math.max(i, n), i /= Math.log(1 + r * Math.max(0, n / e - 1)) / r + 1), Ie(i, n / 2, t * 2);
}
function oC(e, t, n, i) {
  return t = t !== void 0 ? t : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(r, s, o, a) {
    if (r !== void 0) {
      const A = e[0], g = e[e.length - 1], c = n ? uo(
        A,
        n,
        o,
        !!i
      ) : A;
      if (a)
        return t ? ho(
          r,
          c,
          g
        ) : Ie(r, g, c);
      const u = Math.min(c, r), C = Math.floor(ZA(e, u, s));
      return e[C] > c && C < e.length - 1 ? e[C + 1] : e[C];
    }
  });
}
function aC(e, t, n, i, r, s) {
  return i = i !== void 0 ? i : !0, n = n !== void 0 ? n : 0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(o, a, A, g) {
    if (o !== void 0) {
      const c = r ? uo(
        t,
        r,
        A,
        !!s
      ) : t;
      if (g)
        return i ? ho(
          o,
          c,
          n
        ) : Ie(o, n, c);
      const u = 1e-9, C = Math.ceil(
        Math.log(t / c) / Math.log(e) - u
      ), y = -a * (0.5 - u) + 0.5, w = Math.min(c, o), l = Math.floor(
        Math.log(t / w) / Math.log(e) + y
      ), f = Math.max(C, l), p = t / Math.pow(e, f);
      return Ie(p, n, c);
    }
  });
}
function Ya(e, t, n, i, r) {
  return n = n !== void 0 ? n : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(s, o, a, A) {
    if (s !== void 0) {
      const g = i ? uo(
        e,
        i,
        a,
        !!r
      ) : e;
      return !n || !A ? Ie(s, t, g) : ho(
        s,
        g,
        t
      );
    }
  });
}
function Io(e) {
  if (e !== void 0)
    return 0;
}
function Ha(e) {
  if (e !== void 0)
    return e;
}
function AC(e) {
  const t = 2 * Math.PI / e;
  return (
    /**
     * @param {number|undefined} rotation Rotation.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @return {number|undefined} Rotation.
     */
    (function(n, i) {
      if (i)
        return n;
      if (n !== void 0)
        return n = Math.floor(n / t + 0.5) * t, n;
    })
  );
}
function gC(e) {
  const t = Pn(5);
  return (
    /**
     * @param {number|undefined} rotation Rotation.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @return {number|undefined} Rotation.
     */
    (function(n, i) {
      return i || n === void 0 ? n : Math.abs(n) <= t ? 0 : n;
    })
  );
}
const cC = 256, Jr = 0;
class Qa extends zn {
  /**
   * @param {ViewOptions} [options] View options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = Object.assign({}, t), this.hints_ = [0, 0], this.animations_ = [], this.updateAnimationKey_, this.projection_ = eo(t.projection, "EPSG:3857"), this.viewportSize_ = [100, 100], this.targetCenter_ = null, this.targetResolution_, this.targetRotation_, this.nextCenter_ = null, this.nextResolution_, this.nextRotation_, this.cancelAnchor_ = void 0, t.projection && ou(), t.center && (t.center = Fe(
      t.center,
      /** @type {import("./proj.js").ProjectionLike} */
      this.projection_
    )), t.extent && (t.extent = ji(
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
    const n = (
      /** @type {Object<string, *>} */
      Object.assign({}, t)
    );
    for (const a in he)
      delete n[a];
    this.setProperties(n, !0);
    const i = uC(t);
    this.maxResolution_ = i.maxResolution, this.minResolution_ = i.minResolution, this.zoomFactor_ = i.zoomFactor, this.resolutions_ = t.resolutions, this.padding_ = t.padding, this.minZoom_ = i.minZoom;
    const r = lC(t), s = i.constraint, o = hC(t);
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
    let n = this.padding_;
    this.padding_ = t;
    const i = this.getCenterInternal();
    if (i) {
      const r = t || [0, 0, 0, 0];
      n = n || [0, 0, 0, 0];
      const s = (
        /** @type {number} */
        this.getResolution()
      ), o = s / 2 * (r[3] - n[3] + n[1] - r[1]), a = s / 2 * (r[0] - n[0] + n[2] - r[2]);
      this.setCenterInternal([i[0] + o, i[1] - a]);
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
    const n = this.getProperties();
    return n.resolution !== void 0 ? n.resolution = this.getResolution() : n.zoom = this.getZoom(), n.center = this.getCenterInternal(), n.rotation = this.getRotation(), Object.assign({}, n, t);
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
    const n = new Array(arguments.length);
    for (let i = 0; i < n.length; ++i) {
      let r = arguments[i];
      r.center && (r = Object.assign({}, r), r.center = Fe(
        r.center,
        this.getProjection()
      )), r.anchor && (r = Object.assign({}, r), r.anchor = Fe(
        r.anchor,
        this.getProjection()
      )), n[i] = r;
    }
    this.animateInternal.apply(this, n);
  }
  /**
   * @param {...(AnimationOptions|function(boolean): void)} var_args Animation options.
   */
  animateInternal(t) {
    let n = arguments.length, i;
    n > 1 && typeof arguments[n - 1] == "function" && (i = arguments[n - 1], --n);
    let r = 0;
    for (; r < n && !this.isDef(); ++r) {
      const c = arguments[r];
      c.center && this.setCenterInternal(c.center), c.zoom !== void 0 ? this.setZoom(c.zoom) : c.resolution && this.setResolution(c.resolution), c.rotation !== void 0 && this.setRotation(c.rotation);
    }
    if (r === n) {
      i && Yi(i, !0);
      return;
    }
    let s = Date.now(), o = (
      /** @type {import("./coordinate.js").Coordinate} */
      /** @type {import("./coordinate.js").Coordinate} */
      this.targetCenter_.slice()
    ), a = this.targetResolution_, A = (
      /** @type {number} */
      this.targetRotation_
    );
    const g = [];
    for (; r < n; ++r) {
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
          easing: c.easing || rC,
          callback: i
        }
      );
      if (c.center && (u.sourceCenter = o, u.targetCenter = c.center.slice(), o = u.targetCenter), c.zoom !== void 0 ? (u.sourceResolution = a, u.targetResolution = this.getResolutionForZoom(c.zoom), a = u.targetResolution) : c.resolution && (u.sourceResolution = a, u.targetResolution = c.resolution, a = u.targetResolution), c.rotation !== void 0) {
        u.sourceRotation = A;
        const C = bs(c.rotation - A + Math.PI, 2 * Math.PI) - Math.PI;
        u.targetRotation = A + C, A = u.targetRotation;
      }
      IC(u) ? u.complete = !0 : s += u.duration, g.push(u);
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
    for (let n = 0, i = this.animations_.length; n < i; ++n) {
      const r = (
        /** @type {Array<Animation>} */
        this.animations_[n]
      );
      if (
        /** @type {Animation} */
        r[0].callback && Yi(
          /** @type {Animation} */
          r[0].callback,
          !1
        ), !t
      )
        for (let s = 0, o = r.length; s < o; ++s) {
          const a = r[s];
          if (!a.complete) {
            t = a.anchor;
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
    let n = !1;
    for (let i = this.animations_.length - 1; i >= 0; --i) {
      const r = (
        /** @type {Array<Animation>} */
        this.animations_[i]
      );
      let s = !0;
      for (let o = 0, a = r.length; o < a; ++o) {
        const A = r[o];
        if (A.complete)
          continue;
        const g = t - A.start;
        let c = A.duration > 0 ? g / A.duration : 1;
        c >= 1 ? (A.complete = !0, c = 1) : s = !1;
        const u = A.easing(c);
        if (A.sourceCenter) {
          const C = A.sourceCenter[0], y = A.sourceCenter[1], w = (
            /** @type {import("./coordinate.js").Coordinate} */
            A.targetCenter[0]
          ), l = (
            /** @type {import("./coordinate.js").Coordinate} */
            A.targetCenter[1]
          );
          this.nextCenter_ = /** @type {import("./coordinate.js").Coordinate} */
          A.targetCenter;
          const f = C + u * (w - C), p = y + u * (l - y);
          this.targetCenter_ = [f, p];
        }
        if (A.sourceResolution && A.targetResolution) {
          const C = u === 1 ? A.targetResolution : A.sourceResolution + u * (A.targetResolution - A.sourceResolution);
          if (A.anchor) {
            const y = this.getViewportSize_(this.getRotation()), w = (
              /** @type {Constraints} */
              this.constraints_.resolution(C, 0, y, !0)
            );
            this.targetCenter_ = this.calculateCenterZoom(
              /** @type {number} */
              w,
              /** @type {import("./coordinate.js").Coordinate} */
              A.anchor
            );
          }
          this.nextResolution_ = A.targetResolution, this.targetResolution_ = C, this.applyTargetState_(!0);
        }
        if (A.sourceRotation !== void 0 && A.targetRotation !== void 0) {
          const C = u === 1 ? bs(A.targetRotation + Math.PI, 2 * Math.PI) - Math.PI : A.sourceRotation + u * (A.targetRotation - A.sourceRotation);
          if (A.anchor) {
            const y = (
              /** @type {Constraints} */
              this.constraints_.rotation(C, !0)
            );
            this.targetCenter_ = this.calculateCenterRotate(
              /** @type {number} */
              y,
              /** @type {import("./coordinate.js").Coordinate} */
              A.anchor
            );
          }
          this.nextRotation_ = A.targetRotation, this.targetRotation_ = C;
        }
        if (this.applyTargetState_(!0), n = !0, !A.complete)
          break;
      }
      if (s) {
        this.animations_[i] = null, this.setHint(je.ANIMATING, -1), this.nextCenter_ = null, this.nextResolution_ = NaN, this.nextRotation_ = NaN;
        const o = r[0].callback;
        o && Yi(o, !0);
      }
    }
    this.animations_ = this.animations_.filter(Boolean), n && this.updateAnimationKey_ === void 0 && (this.updateAnimationKey_ = requestAnimationFrame(
      this.updateAnimations_.bind(this)
    ));
  }
  /**
   * @param {number} rotation Target rotation.
   * @param {import("./coordinate.js").Coordinate} anchor Rotation anchor.
   * @return {import("./coordinate.js").Coordinate|undefined} Center for rotation and anchor.
   */
  calculateCenterRotate(t, n) {
    let i;
    const r = this.getCenterInternal();
    return r !== void 0 && (i = [r[0] - n[0], r[1] - n[1]], qs(i, t - this.getRotation()), Ll(i, n)), i;
  }
  /**
   * @param {number} resolution Target resolution.
   * @param {import("./coordinate.js").Coordinate} anchor Zoom anchor.
   * @return {import("./coordinate.js").Coordinate|undefined} Center for resolution and anchor.
   */
  calculateCenterZoom(t, n) {
    let i;
    const r = this.getCenterInternal(), s = this.getResolution();
    if (r !== void 0 && s !== void 0) {
      const o = n[0] - t * (n[0] - r[0]) / s, a = n[1] - t * (n[1] - r[1]) / s;
      i = [o, a];
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
    const n = this.viewportSize_;
    if (t) {
      const i = n[0], r = n[1];
      return [
        Math.abs(i * Math.cos(t)) + Math.abs(r * Math.sin(t)),
        Math.abs(i * Math.sin(t)) + Math.abs(r * Math.cos(t))
      ];
    }
    return n;
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
    return t && ea(t, this.getProjection());
  }
  /**
   * Get the view center without transforming to user projection.
   * @return {import("./coordinate.js").Coordinate|undefined} The center of the view.
   */
  getCenterInternal() {
    return (
      /** @type {import("./coordinate.js").Coordinate|undefined} */
      this.get(he.CENTER)
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
    const n = this.calculateExtentInternal(t);
    return uu(n, this.getProjection());
  }
  /**
   * @param {import("./size.js").Size} [size] Box pixel size. If not provided,
   * the map's last known viewport size will be used.
   * @return {import("./extent.js").Extent} Extent.
   */
  calculateExtentInternal(t) {
    t = t || this.getViewportSizeMinusPadding_();
    const n = (
      /** @type {!import("./coordinate.js").Coordinate} */
      this.getCenterInternal()
    );
    Xe(n, "The view center is not defined");
    const i = (
      /** @type {!number} */
      this.getResolution()
    );
    Xe(i !== void 0, "The view resolution is not defined");
    const r = (
      /** @type {!number} */
      this.getRotation()
    );
    return Xe(r !== void 0, "The view rotation is not defined"), El(n, i, r, t);
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
      this.get(he.RESOLUTION)
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
  getResolutionForExtent(t, n) {
    return this.getResolutionForExtentInternal(
      ji(t, this.getProjection()),
      n
    );
  }
  /**
   * Get the resolution for a provided extent (in map units) and size (in pixels).
   * @param {import("./extent.js").Extent} extent Extent.
   * @param {import("./size.js").Size} [size] Box pixel size.
   * @return {number} The resolution at which the provided extent will render at
   *     the given size.
   */
  getResolutionForExtentInternal(t, n) {
    n = n || this.getViewportSizeMinusPadding_();
    const i = Qs(t) / n[0], r = ui(t) / n[1];
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
    const n = (
      /** @type {number} */
      this.getConstrainedResolution(
        /** @type {number} */
        this.maxResolution_
      )
    ), i = (
      /** @type {number} */
      this.minResolution_
    ), r = Math.log(n / i) / Math.log(t);
    return (
      /**
       * @param {number} value Value.
       * @return {number} Resolution.
       */
      (function(s) {
        return n / Math.pow(t, s * r);
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
      this.get(he.ROTATION)
    );
  }
  /**
   * Return a function that returns a resolution for a value between
   * 0 and 1. Exponential scaling is assumed.
   * @param {number} [power] Power.
   * @return {function(number): number} Value for resolution function.
   */
  getValueForResolutionFunction(t) {
    const n = Math.log(t || 2), i = (
      /** @type {number} */
      this.getConstrainedResolution(
        /** @type {number} */
        this.maxResolution_
      )
    ), r = (
      /** @type {number} */
      this.minResolution_
    ), s = Math.log(i / r) / n;
    return (
      /**
       * @param {number} resolution Resolution.
       * @return {number} Value.
       */
      (function(o) {
        return Math.log(i / o) / n / s;
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
    let n = this.getViewportSize_(t);
    const i = this.padding_;
    return i && (n = [
      n[0] - i[1] - i[3],
      n[1] - i[0] - i[2]
    ]), n;
  }
  /**
   * @return {State} View state.
   */
  getState() {
    const t = this.getProjection(), n = this.getResolution(), i = this.getRotation();
    let r = (
      /** @type {import("./coordinate.js").Coordinate} */
      this.getCenterInternal()
    );
    const s = this.padding_;
    if (s) {
      const o = this.getViewportSizeMinusPadding_();
      r = qr(
        r,
        this.getViewportSize_(),
        [o[0] / 2 + s[3], o[1] / 2 + s[0]],
        /** @type {number} */
        n,
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
        n
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
    const n = this.getResolution();
    return n !== void 0 && (t = this.getZoomForResolution(n)), t;
  }
  /**
   * Get the zoom level for a resolution.
   * @param {number} resolution The resolution.
   * @return {number|undefined} The zoom level for the provided resolution.
   * @api
   */
  getZoomForResolution(t) {
    let n = this.minZoom_ || 0, i, r;
    if (this.resolutions_) {
      const s = ZA(this.resolutions_, t, 1);
      n = s, i = this.resolutions_[s], s == this.resolutions_.length - 1 ? r = 2 : r = i / this.resolutions_[s + 1];
    } else
      i = /** @type {number} */
      this.maxResolution_, r = /** @type {number} */
      this.zoomFactor_;
    return n + Math.log(
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
      const n = Ie(
        Math.floor(t),
        0,
        this.resolutions_.length - 2
      ), i = this.resolutions_[n] / this.resolutions_[n + 1];
      return this.resolutions_[n] / Math.pow(i, Ie(t - n, 0, 1));
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
  fit(t, n) {
    let i;
    if (Xe(
      Array.isArray(t) || typeof /** @type {?} */
      t.getSimplifiedGeometry == "function",
      "Invalid extent or geometry provided as `geometry`"
    ), Array.isArray(t)) {
      Xe(
        !JA(t),
        "Cannot fit empty extent provided as `geometry`"
      );
      const r = ji(t, this.getProjection());
      i = oa(r);
    } else if (t.getType() === "Circle") {
      const r = ji(
        t.getExtent(),
        this.getProjection()
      );
      i = oa(r), i.rotate(this.getRotation(), ar(r));
    } else {
      const r = lu();
      r ? i = /** @type {import("./geom/SimpleGeometry.js").default} */
      t.clone().transform(r, this.getProjection()) : i = t;
    }
    this.fitInternal(i, n);
  }
  /**
   * Calculate rotated extent
   * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
   * @return {import("./extent.js").Extent} The rotated extent for the geometry.
   */
  rotatedExtentForGeometry(t) {
    const n = this.getRotation(), i = Math.cos(n), r = Math.sin(-n), s = t.getFlatCoordinates(), o = t.getStride();
    let a = 1 / 0, A = 1 / 0, g = -1 / 0, c = -1 / 0;
    for (let u = 0, C = s.length; u < C; u += o) {
      const y = s[u] * i - s[u + 1] * r, w = s[u] * r + s[u + 1] * i;
      a = Math.min(a, y), A = Math.min(A, w), g = Math.max(g, y), c = Math.max(c, w);
    }
    return [a, A, g, c];
  }
  /**
   * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
   * @param {FitOptions} [options] Options.
   */
  fitInternal(t, n) {
    n = n || {};
    let i = n.size;
    i || (i = this.getViewportSizeMinusPadding_());
    const r = n.padding !== void 0 ? n.padding : [0, 0, 0, 0], s = n.nearest !== void 0 ? n.nearest : !1;
    let o;
    n.minResolution !== void 0 ? o = n.minResolution : n.maxZoom !== void 0 ? o = this.getResolutionForZoom(n.maxZoom) : o = 0;
    const a = this.rotatedExtentForGeometry(t);
    let A = this.getResolutionForExtentInternal(a, [
      i[0] - r[1] - r[3],
      i[1] - r[0] - r[2]
    ]);
    A = isNaN(A) ? o : Math.max(A, o), A = /** @type {number} */
    this.getConstrainedResolution(A, s ? 0 : 1);
    const g = this.getRotation(), c = Math.sin(g), u = Math.cos(g), C = ar(a);
    C[0] += (r[1] - r[3]) / 2 * A, C[1] += (r[0] - r[2]) / 2 * A;
    const y = C[0] * u - C[1] * c, w = C[1] * u + C[0] * c, l = this.getConstrainedCenter([y, w], A), f = n.callback ? n.callback : ws;
    n.duration !== void 0 ? this.animateInternal(
      {
        resolution: A,
        center: l,
        duration: n.duration,
        easing: n.easing
      },
      f
    ) : (this.targetResolution_ = A, this.targetCenter_ = l, this.applyTargetState_(!1, !0), Yi(f, !0));
  }
  /**
   * Center on coordinate and view position.
   * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("./size.js").Size} size Box pixel size.
   * @param {import("./pixel.js").Pixel} position Position on the view to center on.
   * @api
   */
  centerOn(t, n, i) {
    this.centerOnInternal(
      Fe(t, this.getProjection()),
      n,
      i
    );
  }
  /**
   * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("./size.js").Size} size Box pixel size.
   * @param {import("./pixel.js").Pixel} position Position on the view to center on.
   */
  centerOnInternal(t, n, i) {
    this.setCenterInternal(
      qr(
        t,
        n,
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
  calculateCenterShift(t, n, i, r) {
    let s;
    const o = this.padding_;
    if (o && t) {
      const a = this.getViewportSizeMinusPadding_(-i), A = qr(
        t,
        r,
        [a[0] / 2 + o[3], a[1] / 2 + o[0]],
        n,
        i
      );
      s = [
        t[0] - A[0],
        t[1] - A[1]
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
    const n = ea(
      /** @type {import("./coordinate.js").Coordinate} */
      this.targetCenter_,
      this.getProjection()
    );
    this.setCenter([
      n[0] + t[0],
      n[1] + t[1]
    ]);
  }
  /**
   * Adds relative coordinates to the center of the view. Any extent constraint will apply.
   * @param {import("./coordinate.js").Coordinate} deltaCoordinates Relative value to add.
   */
  adjustCenterInternal(t) {
    const n = (
      /** @type {import("./coordinate.js").Coordinate} */
      this.targetCenter_
    );
    this.setCenterInternal([
      n[0] + t[0],
      n[1] + t[1]
    ]);
  }
  /**
   * Multiply the view resolution by a ratio, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} ratio The ratio to apply on the view resolution.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   * @api
   */
  adjustResolution(t, n) {
    n = n && Fe(n, this.getProjection()), this.adjustResolutionInternal(t, n);
  }
  /**
   * Multiply the view resolution by a ratio, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} ratio The ratio to apply on the view resolution.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  adjustResolutionInternal(t, n) {
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
    n && (this.targetCenter_ = this.calculateCenterZoom(
      /** @type {number} */
      s,
      n
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
  adjustZoom(t, n) {
    this.adjustResolution(
      Math.pow(
        /** @type {number} */
        this.zoomFactor_,
        -t
      ),
      n
    );
  }
  /**
   * Adds a value to the view rotation, optionally using an anchor. Any rotation
   * constraint will apply.
   * @param {number} delta Relative value to add to the zoom rotation, in radians.
   * @param {import("./coordinate.js").Coordinate} [anchor] The rotation center.
   * @api
   */
  adjustRotation(t, n) {
    n && (n = Fe(n, this.getProjection())), this.adjustRotationInternal(t, n);
  }
  /**
   * @param {number} delta Relative value to add to the zoom rotation, in radians.
   * @param {import("./coordinate.js").Coordinate} [anchor] The rotation center.
   */
  adjustRotationInternal(t, n) {
    const i = this.getAnimating() || this.getInteracting(), r = (
      /** @type {Constraints} */
      this.constraints_.rotation(
        /** @type {number} */
        this.targetRotation_ + t,
        i
      )
    );
    n && (this.targetCenter_ = this.calculateCenterRotate(
      /** @type {number} */
      r,
      n
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
  setHint(t, n) {
    return this.hints_[t] += n, this.changed(), this.hints_[t];
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
  applyTargetState_(t, n) {
    const i = this.getAnimating() || this.getInteracting() || n, r = (
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
    ), a = (
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
    this.get(he.ROTATION) !== r && this.set(he.ROTATION, r), this.get(he.RESOLUTION) !== o && (this.set(he.RESOLUTION, o), this.set("zoom", this.getZoom(), !0)), (!a || !this.get(he.CENTER) || !Ar(this.get(he.CENTER), a)) && this.set(he.CENTER, a), this.getAnimating() && !t && this.cancelAnimations(), this.cancelAnchor_ = void 0;
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
  resolveConstraints(t, n, i) {
    t = t !== void 0 ? t : 200;
    const r = n || 0, s = (
      /** @type {Constraints} */
      this.constraints_.rotation(
        /** @type {number} */
        this.targetRotation_
      )
    ), o = this.getViewportSize_(s), a = (
      /** @type {Constraints} */
      this.constraints_.resolution(
        /** @type {number} */
        this.targetResolution_,
        r,
        o
      )
    ), A = (
      /** @type {Constraints} */
      this.constraints_.center(
        /** @type {import("./coordinate.js").Coordinate|undefined} */
        this.targetCenter_,
        /** @type {number} */
        a,
        o,
        !1,
        /** @type {import("./coordinate.js").Coordinate} */
        this.calculateCenterShift(
          /** @type {import("./coordinate.js").Coordinate} */
          this.targetCenter_,
          /** @type {number} */
          a,
          /** @type {number} */
          s,
          o
        )
      )
    );
    if (t === 0 && !this.cancelAnchor_) {
      this.targetResolution_ = a, this.targetRotation_ = s, this.targetCenter_ = A, this.applyTargetState_();
      return;
    }
    i = i || (t === 0 ? this.cancelAnchor_ : void 0), this.cancelAnchor_ = void 0, (this.getResolution() !== a || this.getRotation() !== s || !this.getCenterInternal() || !Ar(
      /** @type {import("./coordinate.js").Coordinate} */
      this.getCenterInternal(),
      /** @type {import("./coordinate.js").Coordinate} */
      A
    )) && (this.getAnimating() && this.cancelAnimations(), this.animateInternal({
      rotation: s,
      center: A,
      resolution: a,
      duration: t,
      easing: Er,
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
  endInteraction(t, n, i) {
    i = i && Fe(i, this.getProjection()), this.endInteractionInternal(t, n, i);
  }
  /**
   * Notify the View that an interaction has ended. The view state will be resolved
   * to a stable one if needed (depending on its constraints).
   * @param {number} [duration] Animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  endInteractionInternal(t, n, i) {
    this.getInteracting() && (this.setHint(je.INTERACTING, -1), this.resolveConstraints(t, n, i));
  }
  /**
   * Get a valid position for the view center according to the current constraints.
   * @param {import("./coordinate.js").Coordinate|undefined} targetCenter Target center position.
   * @param {number} [targetResolution] Target resolution. If not supplied, the current one will be used.
   * This is useful to guess a valid center position at a different zoom level.
   * @return {import("./coordinate.js").Coordinate|undefined} Valid center position.
   */
  getConstrainedCenter(t, n) {
    const i = this.getViewportSize_(this.getRotation());
    return (
      /** @type {Constraints} */
      this.constraints_.center(
        t,
        n || /** @type {number} */
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
  getConstrainedZoom(t, n) {
    const i = this.getResolutionForZoom(
      /** @type {number} */
      t
    );
    return this.getZoomForResolution(
      /** @type {number} */
      this.getConstrainedResolution(i, n)
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
  getConstrainedResolution(t, n) {
    n = n || 0;
    const i = this.getViewportSize_(this.getRotation());
    return (
      /** @type {Constraints} */
      this.constraints_.resolution(
        t,
        n,
        i
      )
    );
  }
}
function Yi(e, t) {
  setTimeout(function() {
    e(t);
  }, 0);
}
function lC(e) {
  if (e.extent !== void 0) {
    const n = e.smoothExtentConstraint !== void 0 ? e.smoothExtentConstraint : !0;
    return Wa(
      e.extent,
      /** @type {boolean} */
      e.constrainOnlyCenter,
      n
    );
  }
  const t = (
    /** @type {import("./proj/Projection.js").default} */
    eo(e.projection, "EPSG:3857")
  );
  if (e.multiWorld !== !0 && t.isGlobal()) {
    const n = t.getExtent().slice();
    return n[0] = -1 / 0, n[2] = 1 / 0, Wa(n, !1, !1);
  }
  return nC;
}
function uC(e) {
  let t, n, i, o = e.minZoom !== void 0 ? e.minZoom : Jr, a = e.maxZoom !== void 0 ? e.maxZoom : 28;
  const A = e.zoomFactor !== void 0 ? e.zoomFactor : 2, g = e.multiWorld !== void 0 ? e.multiWorld : !1, c = e.smoothResolutionConstraint !== void 0 ? e.smoothResolutionConstraint : !0, u = e.showFullExtent !== void 0 ? e.showFullExtent : !1, C = (
    /** @type {import("./proj/Projection.js").default} */
    eo(e.projection, "EPSG:3857")
  ), y = C.getExtent();
  let w = e.constrainOnlyCenter, l = e.extent;
  if (!g && !l && C.isGlobal() && (w = !1, l = y), e.resolutions !== void 0) {
    const f = e.resolutions;
    n = f[o], i = f[a] !== void 0 ? f[a] : f[f.length - 1], e.constrainResolution ? t = oC(
      f,
      c,
      /** @type {import("./extent.js").Extent|undefined} */
      !w && l,
      u
    ) : t = Ya(
      n,
      i,
      c,
      /** @type {import("./extent.js").Extent|undefined} */
      !w && l,
      u
    );
  } else {
    const p = (y ? Math.max(Qs(y), ui(y)) : (
      // use an extent that can fit the whole world if need be
      360 * /** @type {number} */
      qA.degrees / /** @type {number} */
      C.getMetersPerUnit()
    )) / cC / Math.pow(2, Jr), I = p / Math.pow(2, 28 - Jr);
    n = e.maxResolution, n !== void 0 ? o = 0 : n = p / Math.pow(A, o), i = e.minResolution, i === void 0 && (e.maxZoom !== void 0 ? e.maxResolution !== void 0 ? i = n / Math.pow(A, a) : i = p / Math.pow(A, a) : i = I), a = o + Math.floor(
      Math.log(n / i) / Math.log(A)
    ), i = n / Math.pow(A, a - o), e.constrainResolution ? t = aC(
      A,
      n,
      i,
      c,
      /** @type {import("./extent.js").Extent|undefined} */
      !w && l,
      u
    ) : t = Ya(
      n,
      i,
      c,
      /** @type {import("./extent.js").Extent|undefined} */
      !w && l,
      u
    );
  }
  return {
    constraint: t,
    maxResolution: n,
    minResolution: i,
    minZoom: o,
    zoomFactor: A
  };
}
function hC(e) {
  if (e.enableRotation !== void 0 ? e.enableRotation : !0) {
    const n = e.constrainRotation;
    return n === void 0 || n === !0 ? gC() : n === !1 ? Ha : typeof n == "number" ? AC(n) : Ha;
  }
  return Io;
}
function IC(e) {
  return !(e.sourceCenter && e.targetCenter && !Ar(e.sourceCenter, e.targetCenter) || e.sourceResolution !== e.targetResolution || e.sourceRotation !== e.targetRotation);
}
function qr(e, t, n, i, r) {
  const s = Math.cos(-r);
  let o = Math.sin(-r), a = e[0] * s - e[1] * o, A = e[1] * s + e[0] * o;
  a += (t[0] / 2 - n[0]) * i, A += (n[1] - t[1] / 2) * i, o = -o;
  const g = a * s - A * o, c = A * s + a * o;
  return [g, c];
}
const CC = {
  /**
   * Triggered before layers are composed.  When dispatched by the map, the event object will not have
   * a `context` set.  When dispatched by a layer, the event object will have a `context` set.  Only
   * WebGL layers currently dispatch this event.
   * @event module:ol/render/Event~RenderEvent#precompose
   * @api
   */
  PRECOMPOSE: "precompose"
}, vt = {
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
class fC extends zn {
  /**
   * @param {Options<NoInfer<Properties>>} options Layer options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, this.background_ = t.background;
    const n = Object.assign({}, t);
    typeof t.properties == "object" && (delete n.properties, Object.assign(n, t.properties)), n[vt.OPACITY] = t.opacity !== void 0 ? t.opacity : 1, Xe(
      typeof n[vt.OPACITY] == "number",
      "Layer opacity must be a number"
    ), n[vt.VISIBLE] = t.visible !== void 0 ? t.visible : !0, n[vt.Z_INDEX] = t.zIndex, n[vt.MAX_RESOLUTION] = t.maxResolution !== void 0 ? t.maxResolution : 1 / 0, n[vt.MIN_RESOLUTION] = t.minResolution !== void 0 ? t.minResolution : 0, n[vt.MIN_ZOOM] = t.minZoom !== void 0 ? t.minZoom : -1 / 0, n[vt.MAX_ZOOM] = t.maxZoom !== void 0 ? t.maxZoom : 1 / 0, this.className_ = n.className !== void 0 ? n.className : "ol-layer", delete n.className, this.setProperties(n), this.state_ = null;
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
    const n = this.state_ || /** @type {?} */
    {
      layer: this,
      managed: t === void 0 ? !0 : t
    }, i = this.getZIndex();
    return n.opacity = Ie(Math.round(this.getOpacity() * 100) / 100, 0, 1), n.visible = this.getVisible(), n.extent = this.getExtent(), n.zIndex = i === void 0 && !n.managed ? 1 / 0 : i, n.maxResolution = this.getMaxResolution(), n.minResolution = Math.max(this.getMinResolution(), 0), n.minZoom = this.getMinZoom(), n.maxZoom = this.getMaxZoom(), this.state_ = n, n;
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").default>} [array] Array of layers (to be
   *     modified in place).
   * @return {Array<import("./Layer.js").default>} Array of layers.
   */
  getLayersArray(t) {
    return qt();
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").State>} [states] Optional list of layer
   *     states (to be modified in place).
   * @return {Array<import("./Layer.js").State>} List of layer states.
   */
  getLayerStatesArray(t) {
    return qt();
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
      this.get(vt.EXTENT)
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
      this.get(vt.MAX_RESOLUTION)
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
      this.get(vt.MIN_RESOLUTION)
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
      this.get(vt.MIN_ZOOM)
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
      this.get(vt.MAX_ZOOM)
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
      this.get(vt.OPACITY)
    );
  }
  /**
   * @abstract
   * @return {import("../source/Source.js").State} Source state.
   */
  getSourceState() {
    return qt();
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
      this.get(vt.VISIBLE)
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
      this.get(vt.Z_INDEX)
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
    this.set(vt.EXTENT, t);
  }
  /**
   * Set the maximum resolution at which the layer is visible.
   * @param {number} maxResolution The maximum resolution of the layer.
   * @observable
   * @api
   */
  setMaxResolution(t) {
    this.set(vt.MAX_RESOLUTION, t);
  }
  /**
   * Set the minimum resolution at which the layer is visible.
   * @param {number} minResolution The minimum resolution of the layer.
   * @observable
   * @api
   */
  setMinResolution(t) {
    this.set(vt.MIN_RESOLUTION, t);
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
    this.set(vt.MAX_ZOOM, t);
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
    this.set(vt.MIN_ZOOM, t);
  }
  /**
   * Set the opacity of the layer, allowed values range from 0 to 1.
   * @param {number} opacity The opacity of the layer.
   * @observable
   * @api
   */
  setOpacity(t) {
    Xe(typeof t == "number", "Layer opacity must be a number"), this.set(vt.OPACITY, t);
  }
  /**
   * Set the visibility of the layer (`true` or `false`).
   * @param {boolean} visible The visibility of the layer.
   * @observable
   * @api
   */
  setVisible(t) {
    this.set(vt.VISIBLE, t);
  }
  /**
   * Set Z-index of the layer, which is used to order layers before rendering.
   * The default Z-index is 0.
   * @param {number} zindex The z-index of the layer.
   * @observable
   * @api
   */
  setZIndex(t) {
    this.set(vt.Z_INDEX, t);
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
class Hg extends fC {
  /**
   * @param {Options<SourceType, NoInfer<Properties>>} options Layer options.
   */
  constructor(t) {
    const n = Object.assign({}, t);
    delete n.source, super(n), this.on, this.once, this.un, this.mapPrecomposeKey_ = null, this.mapRenderKey_ = null, this.sourceChangeKey_ = null, this.renderer_ = null, this.sourceReady_ = !1, this.rendered = !1, t.render && (this.render = t.render), t.map && this.setMap(t.map), this.addChangeListener(
      vt.SOURCE,
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
      this.get(vt.SOURCE) || null
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
    this.sourceChangeKey_ && (gi(this.sourceChangeKey_), this.sourceChangeKey_ = null), this.sourceReady_ = !1;
    const t = this.getSource();
    t && (this.sourceChangeKey_ = kn(
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
    let n;
    const i = this.getMapInternal();
    !t && i && (t = i.getView()), t instanceof Qa ? n = {
      viewState: t.getState(),
      extent: t.calculateExtent()
    } : n = t;
    const r = (
      /** @type {import("../View.js").ViewStateLayerStateExtent} */
      n
    );
    !r.layerStatesArray && i && (r.layerStatesArray = i.getLayerGroup().getLayerStatesArray());
    let s;
    if (r.layerStatesArray) {
      if (s = r.layerStatesArray.find(
        (a) => a.layer === this
      ), !s)
        return !1;
    } else
      s = this.getLayerState();
    const o = this.getExtent();
    return pC(s, r.viewState) && (!o || Ks(o, r.extent));
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
    const n = this.getSource()?.getAttributions();
    if (!n)
      return [];
    const i = t instanceof Qa ? t.getViewStateAndExtent() : t;
    let r = n(
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
  render(t, n) {
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
      n
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
  renderDeclutter(t, n) {
  }
  /**
   * When the renderer follows a layout -> render approach, do the final rendering here.
   * @param {import('../Map.js').FrameState} frameState Frame state
   */
  renderDeferred(t) {
    const n = this.getRenderer();
    n && n.renderDeferred(t);
  }
  /**
   * For use inside the library only.
   * @param {import("../Map.js").default|null} map Map.
   */
  setMapInternal(t) {
    t || this.unrender(), this.set(vt.MAP, t);
  }
  /**
   * For use inside the library only.
   * @return {import("../Map.js").default|null} Map.
   */
  getMapInternal() {
    return this.get(vt.MAP);
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
    this.mapPrecomposeKey_ && (gi(this.mapPrecomposeKey_), this.mapPrecomposeKey_ = null), t || this.changed(), this.mapRenderKey_ && (gi(this.mapRenderKey_), this.mapRenderKey_ = null), t && (this.mapPrecomposeKey_ = kn(
      t,
      CC.PRECOMPOSE,
      /** @type {import("../events.js").ListenerFunction} */
      this.handlePrecompose_,
      this
    ), this.mapRenderKey_ = kn(this, Ve.CHANGE, t.render, t), this.changed());
  }
  /**
   * @param {import("../events/Event.js").default} renderEvent Render event
   * @private
   */
  handlePrecompose_(t) {
    const n = (
      /** @type {import("../render/Event.js").default} */
      t.frameState?.layerStatesArray
    );
    if (!n)
      return;
    const i = this.getLayerState(!1);
    Xe(
      !n.some(
        (r) => r.layer === i.layer
      ),
      "A layer can only be added to the map once. Use either `layer.setMap()` or `map.addLayer()`, not both."
    ), n.push(i);
  }
  /**
   * Set the layer source.
   * @param {SourceType|null} source The layer source.
   * @observable
   * @api
   */
  setSource(t) {
    this.set(vt.SOURCE, t);
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
function pC(e, t) {
  if (!e.visible)
    return !1;
  const n = t.resolution;
  if (n < e.minResolution || n >= e.maxResolution)
    return !1;
  const i = t.zoom;
  return i > e.minZoom && i <= e.maxZoom;
}
function dC(e) {
  const t = e && typeof e.getPixelRatio == "function" ? e.getPixelRatio() : typeof window < "u" && window.devicePixelRatio || 1;
  return typeof t == "number" && Number.isFinite(t) && t > 0 ? t : 1;
}
function Qg(e, t, n) {
  const i = dC(e);
  return Math.abs(t.width / i - n[0]) < 1 && Math.abs(t.height / i - n[1]) < 1;
}
class mC extends Hg {
  constructor(t) {
    let n;
    const i = function(r) {
      const s = this.getSource(), o = s.mapboxMap;
      if (!o)
        return console.error("MapboxLayer: mapboxMap is undefined!"), null;
      s.style !== n && (o.setStyle(s.style), n = s.style);
      const a = o.getCanvas(), A = r.viewState, g = this.getVisible();
      a.style.display = g ? "block" : "none";
      const c = this.getOpacity();
      a.style.opacity = c, a.style.position = "absolute", a.style.left = "0", a.style.top = "0";
      let u = !1;
      if (r.size) {
        const [I, b] = r.size;
        Qg(o, a, [I, b]) || (o.resize(), u = !0);
      }
      const C = A.rotation * -180 / Math.PI, y = pr(A.center), w = A.zoom - 1, l = o.getBearing(), f = o.getCenter().toArray(), p = o.getZoom();
      return !u && C == l && y[0] == f[0] && y[1] == f[1] && w == p || (C != l && o.rotateTo(C, {
        animate: !1
      }), (y[0] != f[0] || y[1] != f[1] || w != p) && o.jumpTo({
        center: y,
        zoom: w,
        animate: !1
      }), o._frame && (o._frame.cancel(), o._frame = null), o._render()), a;
    };
    super({
      render: i,
      source: t.source
    });
  }
}
class yC extends Hg {
  constructor(t) {
    let n;
    const i = function(r) {
      const s = this.getSource(), o = s.maplibreMap;
      if (!o)
        return console.error("MapLibreLayer: maplibreMap is undefined!"), null;
      s.style !== n && (o.setStyle(s.style), n = s.style);
      const a = o.getCanvas(), A = r.viewState, g = this.getVisible();
      a.style.display = g ? "block" : "none";
      const c = this.getOpacity();
      a.style.opacity = c;
      const C = -A.rotation * 180 / Math.PI, y = o.getBearing();
      Math.abs(C - y) > 0.01 && (o.stop(), o.setBearing(C));
      const w = pr(A.center), l = A.zoom - 1;
      if ((o.getCenter().toArray().toString() !== w.toString() || o.getZoom() !== l) && o.jumpTo({
        center: w,
        zoom: l,
        animate: !1
      }), o._frame && (o._frame.cancel(), o._frame = null), r.size) {
        const [f, p] = r.size;
        Qg(o, a, [f, p]) || o.resize();
      }
      return o._render(), Math.abs(o.getZoom() - l) > 0.01 && o.setZoom(l), a.style.position = "absolute", a.style.left = "0", a.style.top = "0", a;
    };
    super({
      render: i,
      source: t.source
    });
  }
}
const Kg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAxMS0xMC0yNlQyMTo1MjoxOFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAxMS0xMC0yN1QxNzo0MjowN1o8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgkVIwmwAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTM5jWRgMAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTAvMjYvMTHjwOqVAAARQHByVld4nMWbB3wURdvAd6/u3V6/27sts/PMQQhFpEU6SlNBRXqTfgkkQOhFSigHIgIWkJqAIJ1QBCz0KkJoQYrSQaQjioBKC+XezWU5fH2/3+/L8fu+fWd3bubZKf95nnlmdjeX2/dk602qD9UnooRc5YjkKp9KyIrkZikfkazcSFaWcuZmpUZScyOpWcqZm6rkU3OTIpGk3EhSViQpVTlzk5IiSUm5VCRC5UaorAiVqpy5VFKESspND6UY03O6U0oYGHo3NCg0ODSj59BQRmhYaHhoaDofFsJiGIVfC78e/hnOwwW4CI1Ttve/AlehLClH6oTrhl8N1wu3CIcFKhqWiwVpWvrG9EcjmXC2nC/1Sd+dHgonh1PCpxQ5nN4pfHHk3qGzOlFUepiiPk5PC/cO9wn3DfcL59deGOqWXC95Saigp/fCY8Lvh0e9Xm94q3DBlXLd2qm5kmRpSrdw9/CEqNwneWQ4HH6hXul6FHVs5Gfh2eGbI6eFp0fLxoZqhE/KC6P5Oa9lhzN7ymofy5PN4anhCRlfFpSVXxNeG26UQf0jyBSO5R1UcjTdF/3c8o+a66j11AbqhCrtpvZQe6lzqnSRukRdjtU8Q52lfqJuqNJt6g/qTzW/ltpKbaO2U99SO9QrF6j71AMqL9b2OvUr9VtMYmgLbaU9dIHkpwM0r+YdtJN20W76ytOa/zZWjpZpTANdNlr7NJVEv0RXpCtFpR+panR1ugZdPCodoGrTdei69MNou3p0ffoN+k36aT+rqcZqfheVQzWiW9HUP0Kn6BVEJ9DF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zV6+JT3q/K+UUkoppZ5Tl9rnzXTvZS/51pTrIJewYX0bzb5r+vfUX7X2ebU/rDnUmslszXqN0v99bSO/80ff/EtrIayb9PNrKMs56kf84zG7v5Te6HqW1yytUb8m7mzNaVbmv4r9stz7I1/WPPKc9sIzuc6ebST3XjlnDZd7OSawd7MmvNs6y5nriXWP9WbWmvq6UoX3Ota9TCttV8f0GZBXXqMep8R6JfdJl73upTKfo+6XbG+j/s9aG7ZmP75rNPZXvNzHLegjrPOtCT9WL+yXY17/tyH3IRB7GXXMtcq0VabZ8xrZt/8TQZzR/ZH/R2U+R33+P8X/GX/2/pB24py9GY74M//JWBN+ar36nJd7Avh6VKf0QbdPXs/yyrDRPhP3sz9znXmPynyutvB/30cpn1CmPC8x1jF+MpbRnteGn1Ivwhg3+I8AG9O+EHNt938fc3KP8pj/+X8i8yj1+93/szKfq2P+z7kdO/R+knUt9fEpfYO/iMs8tlX4MbtnGLbk/TrnYcZw4mLntDV7nfgz9yiPlYN/a/EhbSdtyp7ZyP+jMp/zLsh+W9YpfUffzrpij9FYRdxMr+fX/dn7wZpwwpbqlWHUg7mk+zfn8tE3GM/350Z59TDaQN+LTBsTP/Oelbn3tUtoab1APb70v1JKKaWUUkoppZRSSl1NOxERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERGRO+Qfh5eOajemXSYAAAFTbWtCVPrOyv4Af1WJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4nO3W4WmDYBSGUQdxEQdxEBdxEAdxEQexvIELt6Yh/4oJ54FDm0/7601szlOSJEmSJEmSJEmSJEmSJEmSJEkf0XEc577vT+c5y7V397+6T/dvXddzHMdzmqbHz+wY/Sz31L11FsuyPF7HMAx/vod077JjlX2zYXatzfs9tX/VN7/+je5ftut7Vjnrn+V6nX37xtm/ul7T/ctzvu9f/9fneX7aP9fs/31l23ru1+/btv36zPfnv/2/r/oe1/er90Cu1Xf7nEXVnx3Xa5IkSZIkSZIk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b24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+zWqGFQAACShJREFUWIWVmGusXFUVx39r73POzJy5M3fmPtrblj7p7btYGigGmojExISHQQ0miDFA4lc0SCBRNH4gRhNJ/aIfNAIxUkKIkMgjBBKMCHwQEGKhpbS39HXfve+5M3fmnr23H84+M7e1PDyTlbPPnDl7//da//Vf64zwBQ9jjCilAiDyFgIaUP4nFjDAMtACWtbaRGvtPmte59Lb8gUW137hGCgDFaDkrzMwrABRBxaAWWDeX7esteZyoD4XSJIkorXO+cV7gQFg9fMvLdz74bHm+hOnTP/QsOmeaxBYoJTDbF2n5wa36At7d+XOfOOW0uPAmLcpYN4Y0wyC4LIeuiwQ55wC8kA/sHF62tz5+F/mDz7zytKOTxpBMKsCEq1BCWjBiQAOcRAYQylpcWW0bG6/Kf/Rvd/rfmP1Kn0YOANMAksiYj8XiAcRew9se/ZvtR8/+seFr3xQj3QtDHGhQCCIFtAqDYxI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", Jg = "data:image/png;base64,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", qg = "data:image/png;base64,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", $g = "data:image/png;base64,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", vC = new ve({
  image: new Nn({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: Kg
  })
}), wC = new ve({
  image: new Nn({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: Jg
  })
}), bC = new ve({
  image: new Nn({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: qg
  })
}), EC = new ve({
  fill: new vs({
    color: [128, 128, 256, 0.2]
  }),
  stroke: new ys({
    color: [128, 128, 256, 1],
    width: 3
  })
}), xC = new ve({
  image: new Nn({
    anchor: [0.5, 1],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: $g
  })
});
function tc(e) {
  return e ? e instanceof ve ? e : typeof e == "string" ? new ve({
    image: new Nn({
      anchor: [0.5, 1],
      anchorXUnits: "fraction",
      anchorYUnits: "fraction",
      src: e
    })
  }) : new ve({
    image: new Nn(e)
  }) : xC;
}
class Ze extends el {
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
    t = we(t || {});
    const n = new Di({
      source: new Bi({
        wrapX: !1
      })
    });
    n.set("name", "gps");
    const i = new Di({
      source: new Bi({
        wrapX: !1
      })
    });
    i.set("name", "marker");
    const r = new Di({
      source: new Bi({
        wrapX: !1
      })
    });
    r.set("name", "feature");
    const s = new Di({
      source: new Bi({
        wrapX: !1
      })
    });
    s.set("name", "envelope");
    const o = Ze.spawnLayer(
      null,
      t.source,
      t.target
    ), a = new nl();
    a.set("name", "overlay");
    const g = {
      controls: t.controls ? t.controls : [],
      layers: [
        o,
        a,
        s,
        r,
        n,
        i
      ],
      target: t.div,
      view: new FA({
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
  static applyWmtsZoomGate(t, n) {
    const i = n && typeof n.isWmts == "function" && n.isWmts() ? n.minZoom : void 0;
    typeof i == "number" && Number.isFinite(i) && i > 4 ? t.setMinZoom(i - 4) : t.setMinZoom(-1 / 0);
  }
  static spawnLayer(t, n, i) {
    return n instanceof hr || n instanceof Ir || !(t instanceof Ur) ? (n instanceof hr ? t = new mC({
      style: n.style,
      accessToken: n.accessToken,
      container: i,
      source: n
    }) : n instanceof Ir ? t = new yC({
      style: n.style,
      container: i,
      source: n
    }) : (t = new Ur({
      source: n
    }), Ze.applyWmtsZoomGate(t, n)), t.set("name", "base")) : (t.setSource(n), Ze.applyWmtsZoomGate(t, n)), t;
  }
  getLayer(t = "base") {
    const n = (i) => {
      const r = i.getArray().map((s) => {
        if (s.get("name") == t) return s;
        if (s.getLayers) return n(s.getLayers());
      }).filter((s) => s);
      if (r.length != 0)
        return r[0];
    };
    return n(this.getLayers());
  }
  getSource(t = "base") {
    const n = this.getLayer(t);
    if (n)
      return n.getSource();
  }
  setFeature(t, n, i) {
    const r = this.getSource(i), s = new jA(t);
    return n && s.setStyle(n), r.addFeature(s), s;
  }
  removeFeature(t, n) {
    this.getSource(n).removeFeature(t);
  }
  resetFeature(t) {
    this.getSource(t).clear();
  }
  setGPSPosition(t, n = void 0) {
    const i = n == "sub" ? bC : n == "hide" ? wC : vC;
    n != "sub" && this.resetFeature("gps"), t && (this.setFeature(
      {
        geometry: new jn(t.xy)
      },
      i,
      "gps"
    ), n || this.setFeature(
      {
        geometry: new io(t.xy, t.rad)
      },
      EC,
      "gps"
    ));
  }
  setMarker(t, n, i, r) {
    return r || (r = "marker"), n.geometry = new jn(t), this.setFeature(n, tc(i), r);
  }
  resetMarker(t) {
    t || (t = "marker"), this.resetFeature(t);
  }
  setLine(t, n, i) {
    return this.setVector(t, "Line", n ? { stroke: n } : null, i);
  }
  setVector(t, n = "Line", i, r) {
    r || (r = "feature");
    const s = {};
    i.stroke != null && (s.stroke = new ys(i.stroke)), i.fill != null && (s.fill = new vs(i.fill));
    const o = new ve(s), a = n === "Line" ? new lr(t) : new nn(t);
    return this.setFeature(
      {
        geometry: a,
        name: n
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
  setEnvelope(t, n, i) {
    return i || (i = "envelope"), this.setLine(t, n, i);
  }
  removeEnvelope(t, n) {
    n || (n = "envelope"), this.removeFeature(t, n);
  }
  resetEnvelope(t) {
    t || (t = "envelope"), this.resetFeature(t);
  }
  setFillEnvelope(t, n, i, r) {
    r || (r = "envelope");
    let s;
    if (n != null || i != null) {
      const o = {};
      n != null && (o.stroke = new ys(n)), i != null && (o.fill = new vs(i)), s = new ve(o);
    }
    return this.setFeature(
      {
        geometry: new nn([t])
      },
      s,
      r
    );
  }
  exchangeSource(t = void 0) {
    const n = this.getLayers(), i = n.item(0), r = Ze.spawnLayer(i, t, this.getTarget());
    r != i && n.setAt(0, r), t && t.setMap(this);
  }
  setLayer(t = void 0) {
    const n = this.getLayer("overlay").getLayers();
    if (n.clear(), t) {
      const i = new Ur({
        source: t
      });
      Ze.applyWmtsZoomGate(i, t), n.push(i);
    }
  }
  setTransparency(t) {
    const n = (100 - t) / 100, i = this.getSource();
    i instanceof Gn || i instanceof Bs ? (this.getLayers().item(0).setOpacity(1), this.getLayers().item(1).setOpacity(n)) : this.getLayers().item(0).setOpacity(n);
  }
  setGPSMarker(t, n) {
    this.getLayers().item(0).getSource().setGPSMarker(t, n);
  }
}
const Ai = {
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
}, Ka = {
  ACTIVE: "active"
};
class Si extends zn {
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
      this.get(Ka.ACTIVE)
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
    this.set(Ka.ACTIVE, t);
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
function MC(e, t, n) {
  const i = e.getCenterInternal();
  if (i) {
    const r = [i[0] + t[0], i[1] + t[1]];
    e.animateInternal({
      duration: n !== void 0 ? n : 250,
      easing: sC,
      center: e.getConstrainedCenter(r)
    });
  }
}
function Co(e, t, n, i) {
  const r = e.getZoom();
  if (r === void 0)
    return;
  const s = e.getConstrainedZoom(r + t);
  if (s === void 0)
    return;
  const o = e.getResolutionForZoom(s);
  o !== void 0 && (e.getAnimating() && e.cancelAnimations(), e.animate({
    resolution: o,
    anchor: n,
    duration: i !== void 0 ? i : 250,
    easing: Er
  }));
}
const Hi = {
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
}, Ja = {
  LENGTH: "length"
};
class Qi extends Le {
  /**
   * @param {import("./CollectionEventType.js").default} type Type.
   * @param {T} element Element.
   * @param {number} index The index of the added or removed element.
   */
  constructor(t, n, i) {
    super(t), this.element = n, this.index = i;
  }
}
class SC extends zn {
  /**
   * @param {Array<T>} [array] Array.
   * @param {Options} [options] Collection options.
   */
  constructor(t, n) {
    if (super(), this.on, this.once, this.un, n = n || {}, this.unique_ = !!n.unique, this.array_ = t ?? [], this.unique_)
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
    for (let n = 0, i = t.length; n < i; ++n)
      this.push(t[n]);
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
    const n = this.array_;
    for (let i = 0, r = n.length; i < r; ++i)
      t(n[i], i, n);
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
    return this.get(Ja.LENGTH);
  }
  /**
   * Insert an element at the provided index.
   * @param {number} index Index.
   * @param {T} elem Element.
   * @api
   */
  insertAt(t, n) {
    if (t < 0 || t > this.getLength())
      throw new Error("Index out of bounds: " + t);
    this.unique_ && this.assertUnique_(n), this.array_.splice(t, 0, n), this.updateLength_(), this.dispatchEvent(
      new Qi(Hi.ADD, n, t)
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
    const n = this.getLength();
    return this.insertAt(n, t), this.getLength();
  }
  /**
   * Remove the first occurrence of an element from the collection.
   * @param {T} elem Element.
   * @return {T|undefined} The removed element or undefined if none found.
   * @api
   */
  remove(t) {
    const n = this.array_;
    for (let i = 0, r = n.length; i < r; ++i)
      if (n[i] === t)
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
    const n = this.array_[t];
    return this.array_.splice(t, 1), this.updateLength_(), this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new Qi(Hi.REMOVE, n, t)
    ), n;
  }
  /**
   * Set the element at the provided index.
   * @param {number} index Index.
   * @param {T} elem Element.
   * @api
   */
  setAt(t, n) {
    const i = this.getLength();
    if (t >= i) {
      this.insertAt(t, n);
      return;
    }
    if (t < 0)
      throw new Error("Index out of bounds: " + t);
    this.unique_ && this.assertUnique_(n, t);
    const r = this.array_[t];
    this.array_[t] = n, this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new Qi(Hi.REMOVE, r, t)
    ), this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new Qi(Hi.ADD, n, t)
    );
  }
  /**
   * @private
   */
  updateLength_() {
    this.set(Ja.LENGTH, this.array_.length);
  }
  /**
   * @private
   * @param {T} elem Element.
   * @param {number} [except] Optional index to ignore.
   */
  assertUnique_(t, n) {
    const i = this.array_;
    for (let r = 0, s = i.length; r < s; ++r)
      if (i[r] === t && r !== n)
        throw new Error("Duplicate item added to a unique collection");
  }
}
class TC {
  /**
   * @param {number} decay Rate of decay (must be negative).
   * @param {number} minVelocity Minimum velocity (pixels/millisecond).
   * @param {number} delay Delay to consider to calculate the kinetic
   *     initial values (milliseconds).
   */
  constructor(t, n, i) {
    this.decay_ = t, this.minVelocity_ = n, this.delay_ = i, this.points_ = [], this.angle_ = 0, this.initialVelocity_ = 0;
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
  update(t, n) {
    this.points_.push(t, n, Date.now());
  }
  /**
   * @return {boolean} Whether we should do kinetic animation.
   */
  end() {
    if (this.points_.length < 6)
      return !1;
    const t = Date.now() - this.delay_, n = this.points_.length - 3;
    if (this.points_[n + 2] < t)
      return !1;
    let i = n - 3;
    for (; i > 0 && this.points_[i + 2] > t; )
      i -= 3;
    const r = this.points_[n + 2] - this.points_[i + 2];
    if (r < 1e3 / 60)
      return !1;
    const s = this.points_[n] - this.points_[i], o = this.points_[n + 1] - this.points_[i + 1];
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
class _C extends Si {
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
    let n = !1;
    if (t.type == Ai.DBLCLICK) {
      const i = (
        /** @type {MouseEvent} */
        t.originalEvent
      ), r = t.map, s = t.coordinate, o = i.shiftKey ? -this.delta_ : this.delta_, a = r.getView();
      Co(a, o, s, this.duration_), i.preventDefault(), n = !0;
    }
    return !n;
  }
}
const sn = typeof navigator < "u" && typeof navigator.userAgent < "u" ? navigator.userAgent.toLowerCase() : "", kC = sn.includes("safari") && !sn.includes("chrom");
kC && (sn.includes("version/15.4") || /cpu (os|iphone os) 15_4 like mac os x/.test(sn));
const RC = sn.includes("webkit") && !sn.includes("edge"), ec = sn.includes("macintosh");
typeof WorkerGlobalScope < "u" && typeof OffscreenCanvas < "u" && self instanceof WorkerGlobalScope;
(function() {
  let e = !1;
  try {
    const t = Object.defineProperty({}, "passive", {
      get: function() {
        e = !0;
      }
    });
    window.addEventListener("_", null, t), window.removeEventListener("_", null, t);
  } catch {
  }
  return e;
})();
function Ns(e) {
  const t = arguments;
  return function(n) {
    let i = !0;
    for (let r = 0, s = t.length; r < s && (i = i && t[r](n), !!i); ++r)
      ;
    return i;
  };
}
const PC = function(e) {
  const t = e.originalEvent;
  return t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, OC = function(e) {
  const t = e.originalEvent;
  return t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, LC = function(e) {
  const t = e.map.getTargetElement();
  if (!t)
    return !1;
  const n = t.getRootNode(), i = e.map.getOwnerDocument().activeElement;
  return n instanceof ShadowRoot ? n.host.contains(i) : t.contains(i);
}, nc = function(e) {
  const t = e.map.getTargetElement();
  if (!t)
    return !0;
  const n = t.getRootNode();
  return (n instanceof ShadowRoot ? n.host : t).hasAttribute("tabindex") ? LC(e) : !0;
}, DC = hl, ic = function(e) {
  const t = e.originalEvent;
  return "pointerId" in t && t.button == 0 && !(RC && ec && t.ctrlKey);
}, rc = function(e) {
  const t = (
    /** @type {KeyboardEvent|MouseEvent|TouchEvent} */
    e.originalEvent
  );
  return !t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, BC = function(e) {
  const t = e.originalEvent;
  return ec ? t.metaKey : t.ctrlKey;
}, sc = function(e) {
  const t = e.originalEvent;
  return !t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, oc = function(e) {
  const t = e.originalEvent, n = (
    /** @type {Element} */
    t.target.tagName
  );
  return n !== "INPUT" && n !== "SELECT" && n !== "TEXTAREA" && // `isContentEditable` is only available on `HTMLElement`, but it may also be a
  // different type like `SVGElement`.
  // @ts-ignore
  !t.target.isContentEditable;
}, Ln = function(e) {
  const t = e.originalEvent;
  return "pointerId" in t && t.pointerType == "mouse";
}, NC = function(e) {
  const t = e.originalEvent;
  return "pointerId" in t && t.isPrimary && t.button === 0;
};
class Un extends Si {
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
    let n = !1;
    if (this.updateTrackedPointers_(t), this.handlingDownUpSequence) {
      if (t.type == Ai.POINTERDRAG)
        this.handleDragEvent(t), t.originalEvent.preventDefault();
      else if (t.type == Ai.POINTERUP) {
        const i = this.handleUpEvent(t);
        this.handlingDownUpSequence = i && this.targetPointers.length > 0;
      }
    } else if (t.type == Ai.POINTERDOWN) {
      const i = this.handleDownEvent(t);
      this.handlingDownUpSequence = i, n = this.stopDown(i);
    } else t.type == Ai.POINTERMOVE && this.handleMoveEvent(t);
    return !n;
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
function fo(e) {
  const t = e.length;
  let n = 0, i = 0;
  for (let r = 0; r < t; r++)
    n += e[r].clientX, i += e[r].clientY;
  return { clientX: n / t, clientY: i / t };
}
class FC extends Un {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super({
      stopDown: dr
    }), t = t || {}, this.kinetic_ = t.kinetic, this.lastCentroid = null, this.lastPointersCount_, this.panning_ = !1;
    const n = t.condition ? t.condition : Ns(rc, NC);
    this.condition_ = t.onFocusOnly ? Ns(nc, n) : n, this.noKinetic_ = !1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    const n = t.map;
    this.panning_ || (this.panning_ = !0, n.getView().beginInteraction());
    const i = this.targetPointers, r = n.getEventPixel(fo(i));
    if (i.length == this.lastPointersCount_) {
      if (this.kinetic_ && this.kinetic_.update(r[0], r[1]), this.lastCentroid) {
        const s = [
          this.lastCentroid[0] - r[0],
          r[1] - this.lastCentroid[1]
        ], a = t.map.getView(), A = a.getResolution();
        A !== void 0 && (Dl(s, A), qs(s, a.getRotation()), a.adjustCenterInternal(s));
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
    const n = t.map, i = n.getView();
    if (this.targetPointers.length === 0) {
      if (!this.noKinetic_ && this.kinetic_ && this.kinetic_.end()) {
        const r = this.kinetic_.getDistance(), s = this.kinetic_.getAngle(), o = i.getCenterInternal();
        if (o) {
          const a = (
            /** @type {import("../pixel.js").Pixel} */
            n.getPixelFromCoordinateInternal(o)
          ), A = n.getCoordinateFromPixelInternal([
            a[0] - r * Math.cos(s),
            a[1] - r * Math.sin(s)
          ]);
          i.animateInternal({
            center: i.getConstrainedCenter(
              /** @type {import("../coordinate.js").Coordinate} */
              A
            ),
            duration: 500,
            easing: Er
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
class jC extends Un {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super({
      stopDown: dr
    }), this.condition_ = t.condition ? t.condition : OC, this.lastAngle_ = void 0, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    if (!Ln(t))
      return;
    const n = t.map, i = n.getView();
    if (i.getConstraints().rotation === Io)
      return;
    const r = n.getSize();
    if (!r)
      return;
    const s = t.pixel, o = Math.atan2(r[1] / 2 - s[1], s[0] - r[0] / 2);
    if (this.lastAngle_ !== void 0) {
      const a = o - this.lastAngle_;
      i.adjustRotationInternal(-a);
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
    return Ln(t) ? (t.map.getView().endInteraction(this.duration_), !1) : !0;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    return Ln(t) && ic(t) && this.condition_(t) ? (t.map.getView().beginInteraction(), this.lastAngle_ = void 0, !0) : !1;
  }
}
class GC extends UA {
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
    const t = this.startPixel_, n = this.endPixel_;
    if (!t || !n)
      return;
    const i = "px", r = this.element_.style;
    r.left = Math.min(t[0], n[0]) + i, r.top = Math.min(t[1], n[1]) + i, r.width = Math.abs(n[0] - t[0]) + i, r.height = Math.abs(n[1] - t[1]) + i;
  }
  /**
   * @param {import("../Map.js").default|null} map Map.
   */
  setMap(t) {
    if (this.map_) {
      const n = this.map_.getOverlayContainer();
      n && n.removeChild(this.element_);
      const i = this.element_.style;
      i.left = "inherit", i.top = "inherit", i.width = "inherit", i.height = "inherit";
    }
    if (this.map_ = t, this.map_) {
      const n = this.map_.getOverlayContainer();
      n && n.appendChild(this.element_);
    }
  }
  /**
   * @param {import("../pixel.js").Pixel} startPixel Start pixel.
   * @param {import("../pixel.js").Pixel} endPixel End pixel.
   */
  setPixels(t, n) {
    this.startPixel_ = t, this.endPixel_ = n, this.createOrUpdateGeometry(), this.render_();
  }
  /**
   * Creates or updates the cached geometry.
   */
  createOrUpdateGeometry() {
    if (!this.map_)
      return;
    const t = this.startPixel_, n = this.endPixel_;
    if (!t || !n)
      return;
    const i = [
      t,
      [t[0], n[1]],
      n,
      [n[0], t[1]]
    ], r = this.map_, s = i.map(
      (A) => r.getCoordinateFromPixelInternal(A)
    ), o = s[0];
    if (!o)
      return;
    s[4] = o.slice();
    const a = (
      /** @type {Array<import("../coordinate.js").Coordinate>} */
      s
    );
    this.geometry_ ? this.geometry_.setCoordinates([a]) : this.geometry_ = new nn([a]);
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
const yn = {
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
class ti extends Le {
  /**
   * @param {string} type The event type.
   * @param {import("../coordinate.js").Coordinate} coordinate The event coordinate.
   * @param {import("../MapBrowserEvent.js").default|null} mapBrowserEvent Originating event.
   */
  constructor(t, n, i) {
    super(t), this.coordinate = n, this.mapBrowserEvent = i;
  }
}
class zC extends Un {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = t ?? {}, this.box_ = new GC(t.className || "ol-dragbox"), this.minArea_ = t.minArea ?? 64, t.onBoxEnd && (this.onBoxEnd = t.onBoxEnd), this.startPixel_ = null, this.condition_ = t.condition ?? ic, this.boxEndCondition_ = t.boxEndCondition ?? this.defaultBoxEndCondition;
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
  defaultBoxEndCondition(t, n, i) {
    const r = i[0] - n[0], s = i[1] - n[1];
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
      new ti(
        yn.BOXDRAG,
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
    const n = this.boxEndCondition_(
      t,
      this.startPixel_,
      t.pixel
    );
    return n && this.onBoxEnd(t), this.dispatchEvent(
      new ti(
        n ? yn.BOXEND : yn.BOXCANCEL,
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
      new ti(
        yn.BOXSTART,
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
      new ti(yn.BOXCANCEL, this.startPixel_, null)
    ), this.startPixel_ = null)), super.setActive(t);
  }
  /**
   * @param {import("../Map.js").default|null} map Map.
   * @override
   */
  setMap(t) {
    this.getMap() && (this.box_.setMap(null), this.startPixel_ && (this.dispatchEvent(
      new ti(yn.BOXCANCEL, this.startPixel_, null)
    ), this.startPixel_ = null)), super.setMap(t);
  }
}
class UC extends zC {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const n = t.condition ? t.condition : sc;
    super({
      condition: n,
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
    const n = this.getMap();
    if (!n)
      return;
    const i = n.getView();
    let r = this.getGeometry();
    if (this.out_) {
      const s = i.rotatedExtentForGeometry(r), o = i.getResolutionForExtentInternal(s), a = i.getResolution();
      if (o === void 0 || a === void 0)
        return;
      const A = a / o;
      r = r.clone(), r.scale(A * A);
    }
    i.fitInternal(r, {
      duration: this.duration_,
      easing: Er
    });
  }
}
const He = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown"
};
class XC extends Si {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.defaultCondition_ = function(n) {
      return rc(n) && oc(n);
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
    let n = !1;
    if (t.type == Ve.KEYDOWN) {
      const i = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), r = i.key;
      if (this.condition_(t) && (r == He.DOWN || r == He.LEFT || r == He.RIGHT || r == He.UP)) {
        const o = t.map.getView(), a = o.getResolution();
        if (a === void 0)
          return !0;
        const A = a * this.pixelDelta_;
        let g = 0, c = 0;
        r == He.DOWN ? c = -A : r == He.LEFT ? g = -A : r == He.RIGHT ? g = A : c = A;
        const u = [g, c];
        qs(u, o.getRotation()), MC(o, u, this.duration_), i.preventDefault(), n = !0;
      }
    }
    return !n;
  }
}
class ZC extends Si {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.condition_ = t.condition ? t.condition : function(n) {
      return !BC(n) && oc(n);
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
    let n = !1;
    if (t.type == Ve.KEYDOWN || t.type == Ve.KEYPRESS) {
      const i = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), r = i.key;
      if (this.condition_(t) && (r === "+" || r === "-")) {
        const s = t.map, o = r === "+" ? this.delta_ : -this.delta_, a = s.getView();
        Co(a, o, void 0, this.duration_), i.preventDefault(), n = !0;
      }
    }
    return !n;
  }
}
const VC = 40, WC = 300, YC = 3;
class HC extends Si {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Interaction.js").InteractionOptions} */
      t
    ), this.totalDelta_ = 0, this.lastDelta_ = 0, this.maxDelta_ = t.maxDelta !== void 0 ? t.maxDelta : 1, this.duration_ = t.duration !== void 0 ? t.duration : 250, this.timeout_ = t.timeout !== void 0 ? t.timeout : 80, this.useAnchor_ = t.useAnchor !== void 0 ? t.useAnchor : !0, this.constrainResolution_ = t.constrainResolution !== void 0 ? t.constrainResolution : !1;
    const n = t.condition ? t.condition : DC;
    this.condition_ = t.onFocusOnly ? Ns(nc, n) : n, this.lastAnchor_ = null, this.startTime_ = void 0, this.timeoutId_, this.mode_ = void 0, this.trackpadEventGap_ = 400, this.trackpadTimeoutId_, this.deltaPerZoom_ = 300;
  }
  /**
   * @private
   */
  endInteraction_() {
    this.trackpadTimeoutId_ = void 0;
    const t = this.getMap();
    if (!t)
      return;
    const n = t.getView(), i = this.lastDelta_ ? this.lastDelta_ > 0 ? 1 : -1 : 0;
    n.endInteraction(
      this.constrainResolution_ || n.getConstrainResolution() ? 100 : void 0,
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
        o *= VC;
        break;
      case WheelEvent.DOM_DELTA_PAGE:
        o *= WC;
        break;
    }
    if (o === 0)
      return !1;
    this.lastDelta_ = o;
    const a = Date.now();
    this.startTime_ === void 0 && (this.startTime_ = a), (!this.mode_ || a - this.startTime_ > this.trackpadEventGap_) && (this.mode_ = Math.abs(o) < 4 ? "trackpad" : "wheel");
    const A = i.getView();
    if (this.mode_ === "trackpad")
      return this.trackpadTimeoutId_ ? clearTimeout(this.trackpadTimeoutId_) : (A.getAnimating() && A.cancelAnimations(), A.beginInteraction()), this.trackpadTimeoutId_ = setTimeout(
        this.endInteraction_.bind(this),
        this.timeout_
      ), s && (o = o * YC), A.adjustZoom(
        -o / this.deltaPerZoom_,
        this.lastAnchor_ ? i.getCoordinateFromPixel(this.lastAnchor_) : void 0
      ), this.startTime_ = a, !1;
    this.totalDelta_ += o;
    const g = Math.max(this.timeout_ - (a - this.startTime_), 0);
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
    const n = t.getView();
    n.getAnimating() && n.cancelAnimations();
    let i = -Ie(
      this.totalDelta_,
      -this.maxDelta_ * this.deltaPerZoom_,
      this.maxDelta_ * this.deltaPerZoom_
    ) / this.deltaPerZoom_;
    (n.getConstrainResolution() || this.constrainResolution_) && (i = i ? i > 0 ? 1 : -1 : 0), Co(
      n,
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
class QC extends Un {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const n = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    n.stopDown || (n.stopDown = dr), super(n), this.anchor_ = null, this.lastAngle_ = void 0, this.rotating_ = !1, this.rotationDelta_ = 0, this.threshold_ = t.threshold !== void 0 ? t.threshold : 0.3, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    let n = 0;
    const i = this.targetPointers[0], r = this.targetPointers[1], s = Math.atan2(
      r.clientY - i.clientY,
      r.clientX - i.clientX
    );
    if (this.lastAngle_ !== void 0) {
      const A = s - this.lastAngle_;
      this.rotationDelta_ += A, !this.rotating_ && Math.abs(this.rotationDelta_) > this.threshold_ && (this.rotating_ = !0), n = A;
    }
    this.lastAngle_ = s;
    const o = t.map, a = o.getView();
    a.getConstraints().rotation !== Io && (this.anchor_ = o.getCoordinateFromPixelInternal(
      o.getEventPixel(fo(this.targetPointers))
    ) ?? null, this.rotating_ && (o.render(), a.adjustRotationInternal(n, this.anchor_ ?? void 0)));
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
      const n = t.map;
      return this.anchor_ = null, this.lastAngle_ = void 0, this.rotating_ = !1, this.rotationDelta_ = 0, this.handlingDownUpSequence || n.getView().beginInteraction(), !0;
    }
    return !1;
  }
}
class KC extends Un {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const n = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    n.stopDown || (n.stopDown = dr), super(n), this.anchor_ = null, this.duration_ = t.duration !== void 0 ? t.duration : 400, this.lastDistance_ = void 0, this.lastScaleDelta_ = 1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    let n = 1;
    const i = this.targetPointers[0], r = this.targetPointers[1], s = i.clientX - r.clientX, o = i.clientY - r.clientY, a = Math.sqrt(s * s + o * o);
    this.lastDistance_ !== void 0 && (n = this.lastDistance_ / a), this.lastDistance_ = a;
    const A = t.map, g = A.getView();
    n != 1 && (this.lastScaleDelta_ = n), this.anchor_ = A.getCoordinateFromPixelInternal(
      A.getEventPixel(fo(this.targetPointers))
    ) ?? null, A.render(), g.adjustResolutionInternal(n, this.anchor_ ?? void 0);
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
      const n = t.map;
      return this.anchor_ = null, this.lastDistance_ = void 0, this.lastScaleDelta_ = 1, this.handlingDownUpSequence || n.getView().beginInteraction(), !0;
    }
    return !1;
  }
}
function qa(e) {
  e = e || {};
  const t = new SC(), n = new TC(-5e-3, 0.05, 100);
  return (e.altShiftDragRotate === void 0 || e.altShiftDragRotate) && t.push(new jC()), (e.doubleClickZoom === void 0 || e.doubleClickZoom) && t.push(
    new _C({
      delta: e.zoomDelta,
      duration: e.zoomDuration
    })
  ), (e.dragPan === void 0 || e.dragPan) && t.push(
    new FC({
      onFocusOnly: e.onFocusOnly,
      kinetic: n
    })
  ), (e.pinchRotate === void 0 || e.pinchRotate) && t.push(new QC()), (e.pinchZoom === void 0 || e.pinchZoom) && t.push(
    new KC({
      duration: e.zoomDuration
    })
  ), (e.keyboard === void 0 || e.keyboard) && (t.push(new XC()), t.push(
    new ZC({
      delta: e.zoomDelta,
      duration: e.zoomDuration
    })
  )), (e.mouseWheelZoom === void 0 || e.mouseWheelZoom) && t.push(
    new HC({
      onFocusOnly: e.onFocusOnly,
      duration: e.zoomDuration
    })
  ), (e.shiftDragZoom === void 0 || e.shiftDragZoom) && t.push(
    new UC({
      duration: e.zoomDuration
    })
  ), t;
}
class JC extends Un {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Pointer.js").Options} */
      t
    ), this.condition_ = t.condition ? t.condition : sc, this.lastAngle_ = void 0, this.lastMagnitude_ = void 0, this.lastScaleDelta_ = 0, this.duration_ = t.duration !== void 0 ? t.duration : 400;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    if (!Ln(t))
      return;
    const n = t.map, i = n.getSize();
    if (!i)
      return;
    const r = t.pixel, s = r[0] - i[0] / 2, o = i[1] / 2 - r[1], a = Math.atan2(o, s), A = Math.sqrt(s * s + o * o), g = n.getView();
    if (this.lastAngle_ !== void 0) {
      const c = this.lastAngle_ - a;
      g.adjustRotationInternal(c);
    }
    this.lastAngle_ = a, this.lastMagnitude_ !== void 0 && g.adjustResolutionInternal(this.lastMagnitude_ / A), this.lastMagnitude_ !== void 0 && (this.lastScaleDelta_ = this.lastMagnitude_ / A), this.lastMagnitude_ = A;
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    if (!Ln(t))
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
    return Ln(t) && this.condition_(t) ? (t.map.getView().beginInteraction(), this.lastAngle_ = void 0, this.lastMagnitude_ = void 0, !0) : !1;
  }
}
function qC(e) {
  return $C(e[0], e[1], e[2]);
}
function $C(e, t, n) {
  return (t << e) + n;
}
const tf = /\{z\}/g, ef = /\{x\}/g, nf = /\{y\}/g, rf = /\{-y\}/g;
function sf(e, t, n, i, r) {
  return e.replace(tf, t.toString()).replace(ef, n.toString()).replace(nf, i.toString()).replace(rf, function() {
    throw new Error(
      "If the URL template has a {-y} placeholder, the grid extent must be known"
    );
  });
}
function of(e, t) {
  return (
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile Coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @return {string|undefined} Tile URL.
     */
    (function(n, i, r) {
      if (!n)
        return;
      const s = n[0];
      return sf(e, s, n[1], n[2]);
    })
  );
}
function $a(e, t) {
  const n = e.length, i = new Array(n);
  for (let r = 0; r < n; ++r)
    i[r] = of(e[r]);
  return af(i);
}
function af(e) {
  return e.length === 1 ? e[0] : (
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile Coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @return {string|undefined} Tile URL.
     */
    (function(t, n, i) {
      if (!t)
        return;
      const r = qC(t), s = bs(r, e.length);
      return e[s](t, n, i);
    })
  );
}
for (let e = 0; e < 9; e++) {
  const t = `ZOOM:${e}`, n = 256 * Math.pow(2, e);
  (function(i, r) {
    const s = new tl({
      code: i,
      // The extent is used to determine zoom level 0. Recommended values for a
      // projection's validity extent can be found at https://epsg.io/.
      extent: [0, 0, r, r],
      units: "m"
    });
    ms(s), or(
      "EPSG:3857",
      s,
      (o) => {
        const a = (o[0] + It) * r / (2 * It), A = (-o[1] + It) * r / (2 * It);
        return [a, A];
      },
      (o) => {
        const a = o[0] * (2 * It) / r - It, A = -1 * (o[1] * (2 * It) / r - It);
        return [a, A];
      }
    );
  })(t, n);
}
class ac extends $I(GA) {
  constructor(t = {}) {
    t = Yg(t), t.wrapX = !1;
    const n = Math.log2(t.width / Ke), i = Math.log2(t.height / Ke);
    t.maxZoom = Math.ceil(Math.max(n, i)), t.tileUrlFunction = t.tileUrlFunction || function(r) {
      const s = r[0], o = r[1], a = r[2];
      return (
        // @ts-ignore
        o * Ke * Math.pow(2, this.maxZoom - s) >= this.width || // @ts-ignore
        a * Ke * Math.pow(2, this.maxZoom - s) >= this.height || o < 0 || a < 0 ? co : this._tileUrlFunction(r)
      );
    }, super(t), t.mapID && (this.mapID = t.mapID), t.urls ? this._tileUrlFunction = $a(t.urls) : t.url && (this._tileUrlFunction = $a(Array.isArray(t.url) ? t.url : [t.url])), this.width = t.width, this.height = t.height, this.maxZoom = t.maxZoom, this._maxxy = Math.pow(2, this.maxZoom) * Ke, this.initialize(t);
  }
}
class _n extends Gn {
  static isBasemap_ = !1;
  constructor(t = {}) {
    super(Object.assign(t, { opaque: !1 }));
  }
}
const Se = "https://weiwudi.example.com/api/";
let $r, vn;
class Af {
  constructor() {
    this.listeners = {};
  }
  addEventListener(t, n) {
    t in this.listeners || (this.listeners[t] = []), this.listeners[t].push(n);
  }
  removeEventListener(t, n) {
    if (!(t in this.listeners))
      return;
    const i = this.listeners[t];
    for (let r = 0, s = i.length; r < s; r++)
      if (i[r] === n) {
        i.splice(r, 1);
        return;
      }
  }
  dispatchEvent(t) {
    if (!(t.type in this.listeners))
      return !0;
    const n = this.listeners[t.type].slice();
    for (let i = 0, r = n.length; i < r; i++)
      n[i].call(this, t);
    return !t.defaultPrevented;
  }
}
class de extends Af {
  static async registerSW(t, n) {
    if (!("serviceWorker" in navigator))
      throw "Error: Service worker is not supported";
    let i;
    try {
      i = await navigator.serviceWorker.register(t, n);
    } catch (r) {
      throw `Error: Service worker registration failed with ${r}`;
    }
    return await de.waitForController(), await de.swCheck(), i;
  }
  static async waitForController() {
    return new Promise((t, n) => {
      let i = !1, r;
      function s() {
        i || (i = !0, r !== void 0 && clearTimeout(r), navigator.serviceWorker.removeEventListener("controllerchange", o));
      }
      function o() {
        navigator.serviceWorker.controller && (s(), t());
      }
      navigator.serviceWorker.addEventListener("controllerchange", o), r = setTimeout(() => {
        s(), n("Error: Service worker did not control this page within 10000 ms");
      }, 1e4), navigator.serviceWorker.ready.then(() => {
        navigator.serviceWorker.controller && (s(), t());
      }).catch(() => {
      });
    });
  }
  static async swCheck() {
    return vn !== void 0 ? vn : ($r === void 0 && ($r = new Promise((t, n) => {
      fetch(`${Se}ping`).then((i) => {
        vn = !!i, t(vn);
      }).catch((i) => {
        vn = !1, t(vn);
      });
    })), $r);
  }
  static async registerMap(t, n) {
    if (!await de.swCheck()) throw "Weiwudi service worker is not implemented.";
    let i;
    const r = ["type", "url", "width", "height", "tileSize", "minZoom", "maxZoom", "maxLng", "maxLat", "minLng", "minLat", "cacheTtl", "cacheMaxBytes"].reduce((o, a) => (typeof n[a] < "u" && (n[a] instanceof Array ? n[a].map((A) => {
      o.append(a, A);
    }) : o.append(a, String(n[a]))), o), new URLSearchParams());
    r.append("mapID", t);
    const s = new URL(`${Se}add`);
    if (s.search = r.toString(), i = await (await fetch(s.href)).text(), i.match(/^Error: /))
      throw i;
    return new de(t, JSON.parse(i));
  }
  static async retrieveMap(t) {
    if (!await de.swCheck()) throw "Weiwudi service worker is not implemented.";
    let n;
    if (n = await (await fetch(`${Se}info?mapID=${t}`)).text(), n.match(/^Error: /))
      throw n;
    return console.log(n), new de(t, JSON.parse(n));
  }
  static async removeMap(t) {
    if (!await de.swCheck()) throw "Weiwudi service worker is not implemented.";
    let n;
    if (n = await (await fetch(`${Se}delete?mapID=${t}`)).text(), n.match(/^Error: /))
      throw n;
  }
  constructor(t, n) {
    if (super(), !t) throw "MapID is necessary.";
    this.mapID = t, n && Object.assign(this, n), this.url = `${Se}cache/${t}/{z}/{x}/{y}`, this.listener = (i) => {
      i.data.mapID === t && this.dispatchEvent(new CustomEvent(i.data.type, { detail: i.data }));
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
    if (this.checkAspect(), t = await (await fetch(`${Se}stats?mapID=${this.mapID}`)).text(), typeof t == "string" && t.match(/^Error: /))
      throw t;
    return JSON.parse(t);
  }
  async clean() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${Se}clean?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
  async fetchAll() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${Se}fetchAll?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
  async remove() {
    this.checkAspect(), this.mapID && await de.removeMap(this.mapID), this.release();
  }
  async cancel() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${Se}cancel?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
}
function Ki(e, t, n) {
  const i = typeof e == "string" ? e : e.getCode(), r = typeof t == "string" ? t : t.getCode();
  let s = Gr(e, t);
  if (s == zr && i != r) {
    const o = Gr(e, "EPSG:3857"), a = Gr("EPSG:3857", t);
    if (o == zr && i != "EPSG:3857")
      throw "Transform of Source projection is not defined.";
    if (a == zr && r != "EPSG:3857")
      throw "Transform of Distination projection is not defined.";
    s = function(g) {
      return re(re(g, e, "EPSG:3857"), "EPSG:3857", t);
    }, or(e, t, s, function(g) {
      return re(re(g, t, "EPSG:3857"), "EPSG:3857", e);
    });
  }
  if (n)
    return s(n);
}
function Ac(e, t = "") {
  if (Object.hasOwn(e, "compiled"))
    throw new Error(`${t}tinEnabled:false の層は compiled を持てません`);
}
function gc(e) {
  if (e.tinEnabled === !1) {
    Ac(e, `Map ${e.mapID}: `);
    const { width: n, height: i } = e;
    if (n === void 0 || i === void 0 || !Number.isFinite(n) || !Number.isFinite(i) || n <= 0 || i <= 0)
      throw new Error(
        `Map ${e.mapID}: world file の本図には正の有限な width と height が必要です`
      );
    return [n, i];
  }
  const t = e.compiled?.wh;
  if (!t) throw new Error(`Map ${e.mapID} is missing compiled data.`);
  return [t[0], t[1]];
}
let ts;
async function es(e) {
  if (!(e?.epsg === 3857 || e?.epsg === 4326 || typeof e?.proj4 != "string" || !e.proj4.trim()))
    return ts ??= import("./index-BB4XdSO8.js").then(({ default: t }) => Bh(t)).catch((t) => {
      throw ts = void 0, t;
    }), ts;
}
async function tA(e, t) {
  const { compiled: n, crs: i, worldFile: r } = e, s = "bounds" in t ? t.bounds : void 0;
  if (e.tinEnabled === !1) {
    if (Ac(e), !i) throw new Error("world file の層には CRS（crs）が必要です");
    if (!r)
      throw new Error("tinEnabled:false の層には worldFile が必要です");
    if ("wh" in t)
      return {
        kind: "worldFile",
        crs: i,
        worldFile: r,
        wh: t.wh,
        projectionEngine: await es(i)
      };
    if (!Array.isArray(s) || s.length < 3)
      throw new Error("world file の副層には 3 頂点以上の bounds が必要です");
    return {
      kind: "worldFile",
      crs: i,
      worldFile: r,
      bounds: s,
      projectionEngine: await es(i)
    };
  }
  return {
    kind: "tin",
    compiled: n,
    crs: i,
    bounds: s,
    projectionEngine: await es(i)
  };
}
function gf(e) {
  return e === "constant" || e === "grid" ? e : void 0;
}
async function cf(e) {
  const t = gc(e);
  try {
    const n = e.sub_maps?.filter(
      (a) => a.tinEnabled === !1 || a.compiled
    ), i = {
      main: await tA(e, { wh: t }),
      sub_maps: await Promise.all(
        (n ?? []).map(async (a) => ({
          ...await tA(a, { bounds: a.bounds }),
          priority: a.priority,
          importance: a.importance
        }))
      ),
      viewpointMode: gf(e.viewpointMode)
    }, r = new Rg();
    r.setLayeredMapData(i);
    const s = r.getSurfaceTransform(0), o = {
      ...e,
      width: s.wh?.[0],
      height: s.wh?.[1]
    };
    return !o.imageExtension && e.imageExtention && (o.imageExtension = e.imageExtention), s instanceof St && (o.strictMode = s.strictMode, o.vertexMode = s.vertexMode, o.yaxisMode = s.yaxisMode, o.gcps = s.points, o.edges = s.edges), o.sub_maps = n?.map((a, A) => {
      const g = r.getSurfaceTransform(A + 1);
      return {
        ...a,
        bounds: a.bounds ?? g.bounds,
        gcps: g instanceof St ? g.points : a.gcps,
        edges: g instanceof St ? g.edges : a.edges
      };
    }), [o, r];
  } catch (n) {
    const i = n instanceof Error ? n.message : String(n);
    throw new Error(`Map ${e.mapID}: ${i}`, { cause: n });
  }
}
function eA(e, t, n) {
  return typeof e.merc2XyVisibleLayers != "function" ? null : e.merc2XyVisibleLayers(t).filter(([, i]) => n(i)).slice(0, 2).map(([i, r]) => [i, r]);
}
class Cr extends ac {
  mapTransform;
  constructor(t = {}) {
    super(t), this.mapTransform = new Rg();
  }
  static async createAsync(t) {
    const [n, i] = await cf(t), r = new Cr(n);
    r.mapTransform = i;
    const s = i.getSurfaceTransform(0), o = new hi({
      code: `Illst:${r.mapID}`,
      extent: [0, 0, r.width, r.height],
      units: "m"
    });
    ms(o), or(
      o,
      "EPSG:3857",
      (a) => s.transform(a, !1),
      (a) => s.transform(a, !0)
    ), Ki("EPSG:4326", o);
    for (let a = 1; a < i.layerCount; a++) {
      const A = i.getSurfaceTransform(a), { xy: g, wh: c } = A, u = n.sub_maps?.[a - 1]?.bounds, C = g && c ? [g[0], g[1], g[0] + c[0], g[1] + c[1]] : u && fl(u), y = new hi({
        code: `Illst:${r.mapID}#${a}`,
        extent: C,
        units: "m"
      });
      ms(y), or(
        y,
        "EPSG:3857",
        (w) => A.transform(w, !1, !0),
        (w) => A.transform(w, !0, !0)
      ), Ki("EPSG:4326", y);
    }
    return r;
  }
  xy2MercAsync_specifyLayer(t, n) {
    const i = `Illst:${this.mapID}${n ? `#${n}` : ""}`;
    return new Promise((r, s) => {
      r(Ki(i, "EPSG:3857", t));
    });
  }
  merc2XyAsync_specifyLayer(t, n) {
    const i = `Illst:${this.mapID}${n ? `#${n}` : ""}`;
    return new Promise((r, s) => {
      r(Ki("EPSG:3857", i, t));
    });
  }
  xy2MercAsync_returnLayer(t) {
    const n = this.mapTransform.xy2MercWithLayer(t);
    return n ? Promise.resolve(n) : Promise.reject(new Error("xy2MercWithLayer: out of bounds"));
  }
  merc2XyAsync_returnLayer(t) {
    const n = this.mapTransform.merc2XyWithLayer(t);
    return Promise.resolve(
      n.map(
        (i) => i ? [i[0], i[1]] : void 0
      )
    );
  }
  setupMapParameter(t) {
    const n = [this.width / 2, this.height / 2], i = this.mapTransform.xy2MercWithLayer(n);
    if (!i)
      throw new Error(`Map ${this.mapID}: 地図の中心を投影できません`);
    const [r, s] = i, o = this.mapTransform.getSurfaceTransform(0), A = [
      [0, 0],
      [this.width, 0],
      [this.width, this.height],
      [0, this.height]
    ].map((g) => o.transform(g, !1));
    if (!A.every((g) => g !== !1))
      throw new Error(`Map ${this.mapID}: 初期表示の範囲を投影できません`);
    if (!this.mercZoom) {
      let g;
      try {
        g = this.mapTransform.viewpointMode === "constant" ? this.mapTransform.getViewpointCoefficients(r, n).s : this.mapTransform.probeViewpointCoefficients(
          r,
          [n[0], n[1]],
          150
        ).s;
      } catch (c) {
        throw new Error(
          `Map ${this.mapID}: 初期表示の範囲を投影できません`,
          { cause: c }
        );
      }
      this.mercZoom = Math.log2(2 * It / (256 * g)) - 3;
    }
    this.homePosition || (this.homePosition = pr(s)), this.envelope = jg([
      [
        A[0],
        A[1],
        A[2],
        A[3],
        A[0]
      ]
    ]), t(this);
  }
  // GPS マーカー用（呼び出し元は mixin の setGPSMarkerAsync のみ）。
  // Transform が merc2XyVisibleLayers を持てば、紙外の本図を除いた表示候補の 1・2 位を返す（MaplatCore#104）:
  // 1 位は中心＋周囲 4 点を同じ層で逆変換した 5 点、2 位は中心だけ。undefined（旧 hide 表現）を含まない 0〜2 件。
  // 持たない（@maplat/transform 1.0.x）なら従来経路（mercs2SysCoords）。
  mercs2SysCoordsAsync_multiLayer(t) {
    const n = t[0], i = eA(
      this.mapTransform,
      n[0],
      (s) => this.insideCheckXy(s)
    );
    if (i)
      return Promise.resolve(
        i.map(([s, o], a) => {
          if (a > 0)
            return [[this.xy2SysCoord(o)], t[1]];
          const A = this.mapTransform.getSurfaceTransform(s);
          return [
            n.map(
              (c, u) => u === 0 ? o : A.transform(c, !0, s > 0)
            ).map((c) => this.xy2SysCoord(c)),
            t[1]
          ];
        })
      );
    const r = this.mapTransform.mercs2SysCoords(t[0]);
    return Promise.resolve(
      r.map((s) => {
        if (s)
          return [
            s.map((o) => o),
            t[1]
          ];
      })
    );
  }
  merc2XyAsync_base(t, n) {
    return this.merc2XyAsync_returnLayer(t).then((i) => n && !i[0] ? void 0 : (i[0] ? i[0] : i[1])[1]);
  }
  // POI ピン用（呼び出し元は mixin の merc2SysCoordAsync_ignoreBackground → index.ts の setMarker のみ）。
  // Transform が merc2XyVisibleLayers を持てば、紙外の本図を除いた表示候補の 1 位、無ければ undefined（MaplatCore#104）。
  // 持たない（@maplat/transform 1.0.x）なら従来経路。
  merc2XyAsync_ignoreBackground(t) {
    const n = eA(
      this.mapTransform,
      t,
      (i) => this.insideCheckXy(i)
    );
    return n ? Promise.resolve(n.length ? n[0][1] : void 0) : this.merc2XyAsync_base(t, !0);
  }
  merc2XyAsync(t) {
    return this.merc2XyAsync_base(t, !1);
  }
  xy2MercAsync(t) {
    return this.xy2MercAsync_returnLayer(t).then((n) => n[1]);
  }
  /**
   * @param layerIndex - 層番号（省略時は従来の層選択）。0 = 本図、1 以上 = 副層。
   *   使える副層（tinEnabled === false または compiled あり）だけに絞り込んだ後の
   *   添字 + 1 なので、地図 JSON の sub_maps の元の添字とはずれる場合がある。
   *   範囲外の番号・非整数は例外になる
   */
  viewpoint2MercsAsync(t, n, i) {
    const r = t?.[0] ?? this.getMap().getView().getCenter(), s = t?.[1] ?? this.getMap().getView().getDecimalZoom(), o = t?.[2] ?? this.getMap().getView().getRotation();
    n || (n = this.getMap().getSize());
    const a = this.mapTransform.viewpoint2Mercs(
      { center: r, zoom: s, rotation: o },
      n,
      i
    );
    return Promise.resolve([a, n]);
  }
  /**
   * @param layerIndex - 層番号（省略時は従来の層選択）。0 = 本図、1 以上 = 副層。
   *   使える副層（tinEnabled === false または compiled あり）だけに絞り込んだ後の
   *   添字 + 1 なので、地図 JSON の sub_maps の元の添字とはずれる場合がある。
   *   範囲外の番号・非整数は例外になる
   */
  mercs2ViewpointAsync(t, n) {
    const i = t[1] ?? this.getMap().getSize(), r = this.mapTransform.mercs2Viewpoint(
      t[0],
      i,
      n
    );
    return Promise.resolve([
      r.center,
      r.zoom,
      r.rotation
    ]);
  }
}
function lf(e, t) {
  return {
    mapID: typeof e == "string" ? e : e?.mapID ?? "",
    __maplatUnusable: { reason: t.reason }
  };
}
function uf(e) {
  return !!e && typeof e == "object" && "__maplatUnusable" in e;
}
const cc = /* @__PURE__ */ new WeakMap();
function hf(e, t) {
  cc.set(e, [...t]);
}
function If(e) {
  return [...cc.get(e) ?? []];
}
function Cf(e) {
  return (t) => e.tileUrl(t[0], t[1], t[2]) ?? co;
}
async function nA(e, t, n) {
  const i = await II(e, t);
  e.tileUrlFunction = Cf(i), e.__maplatIiifUrl = i.url;
}
function iA(e, t) {
  !t || !t.__maplatIiifUrl || typeof e?.setTileUrlFunction == "function" && e.setTileUrlFunction(t.tileUrlFunction, t.__maplatIiifUrl);
}
var jt = typeof globalThis < "u" && globalThis || typeof self < "u" && self || // eslint-disable-next-line no-undef
typeof globalThis < "u" && globalThis || {}, $t = {
  searchParams: "URLSearchParams" in jt,
  iterable: "Symbol" in jt && "iterator" in Symbol,
  blob: "FileReader" in jt && "Blob" in jt && (function() {
    try {
      return new Blob(), !0;
    } catch {
      return !1;
    }
  })(),
  formData: "FormData" in jt,
  arrayBuffer: "ArrayBuffer" in jt
};
function ff(e) {
  return e && DataView.prototype.isPrototypeOf(e);
}
if ($t.arrayBuffer)
  var pf = [
    "[object Int8Array]",
    "[object Uint8Array]",
    "[object Uint8ClampedArray]",
    "[object Int16Array]",
    "[object Uint16Array]",
    "[object Int32Array]",
    "[object Uint32Array]",
    "[object Float32Array]",
    "[object Float64Array]"
  ], df = ArrayBuffer.isView || function(e) {
    return e && pf.indexOf(Object.prototype.toString.call(e)) > -1;
  };
function Xn(e) {
  if (typeof e != "string" && (e = String(e)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(e) || e === "")
    throw new TypeError('Invalid character in header field name: "' + e + '"');
  return e.toLowerCase();
}
function po(e) {
  return typeof e != "string" && (e = String(e)), e;
}
function mo(e) {
  var t = {
    next: function() {
      var n = e.shift();
      return { done: n === void 0, value: n };
    }
  };
  return $t.iterable && (t[Symbol.iterator] = function() {
    return t;
  }), t;
}
function Ot(e) {
  this.map = {}, e instanceof Ot ? e.forEach(function(t, n) {
    this.append(n, t);
  }, this) : Array.isArray(e) ? e.forEach(function(t) {
    if (t.length != 2)
      throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + t.length);
    this.append(t[0], t[1]);
  }, this) : e && Object.getOwnPropertyNames(e).forEach(function(t) {
    this.append(t, e[t]);
  }, this);
}
Ot.prototype.append = function(e, t) {
  e = Xn(e), t = po(t);
  var n = this.map[e];
  this.map[e] = n ? n + ", " + t : t;
};
Ot.prototype.delete = function(e) {
  delete this.map[Xn(e)];
};
Ot.prototype.get = function(e) {
  return e = Xn(e), this.has(e) ? this.map[e] : null;
};
Ot.prototype.has = function(e) {
  return this.map.hasOwnProperty(Xn(e));
};
Ot.prototype.set = function(e, t) {
  this.map[Xn(e)] = po(t);
};
Ot.prototype.forEach = function(e, t) {
  for (var n in this.map)
    this.map.hasOwnProperty(n) && e.call(t, this.map[n], n, this);
};
Ot.prototype.keys = function() {
  var e = [];
  return this.forEach(function(t, n) {
    e.push(n);
  }), mo(e);
};
Ot.prototype.values = function() {
  var e = [];
  return this.forEach(function(t) {
    e.push(t);
  }), mo(e);
};
Ot.prototype.entries = function() {
  var e = [];
  return this.forEach(function(t, n) {
    e.push([n, t]);
  }), mo(e);
};
$t.iterable && (Ot.prototype[Symbol.iterator] = Ot.prototype.entries);
function ns(e) {
  if (!e._noBody) {
    if (e.bodyUsed)
      return Promise.reject(new TypeError("Already read"));
    e.bodyUsed = !0;
  }
}
function lc(e) {
  return new Promise(function(t, n) {
    e.onload = function() {
      t(e.result);
    }, e.onerror = function() {
      n(e.error);
    };
  });
}
function mf(e) {
  var t = new FileReader(), n = lc(t);
  return t.readAsArrayBuffer(e), n;
}
function yf(e) {
  var t = new FileReader(), n = lc(t), i = /charset=([A-Za-z0-9_-]+)/.exec(e.type), r = i ? i[1] : "utf-8";
  return t.readAsText(e, r), n;
}
function vf(e) {
  for (var t = new Uint8Array(e), n = new Array(t.length), i = 0; i < t.length; i++)
    n[i] = String.fromCharCode(t[i]);
  return n.join("");
}
function rA(e) {
  if (e.slice)
    return e.slice(0);
  var t = new Uint8Array(e.byteLength);
  return t.set(new Uint8Array(e)), t.buffer;
}
function uc() {
  return this.bodyUsed = !1, this._initBody = function(e) {
    this.bodyUsed = this.bodyUsed, this._bodyInit = e, e ? typeof e == "string" ? this._bodyText = e : $t.blob && Blob.prototype.isPrototypeOf(e) ? this._bodyBlob = e : $t.formData && FormData.prototype.isPrototypeOf(e) ? this._bodyFormData = e : $t.searchParams && URLSearchParams.prototype.isPrototypeOf(e) ? this._bodyText = e.toString() : $t.arrayBuffer && $t.blob && ff(e) ? (this._bodyArrayBuffer = rA(e.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : $t.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(e) || df(e)) ? this._bodyArrayBuffer = rA(e) : this._bodyText = e = Object.prototype.toString.call(e) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof e == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : $t.searchParams && URLSearchParams.prototype.isPrototypeOf(e) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
  }, $t.blob && (this.blob = function() {
    var e = ns(this);
    if (e)
      return e;
    if (this._bodyBlob)
      return Promise.resolve(this._bodyBlob);
    if (this._bodyArrayBuffer)
      return Promise.resolve(new Blob([this._bodyArrayBuffer]));
    if (this._bodyFormData)
      throw new Error("could not read FormData body as blob");
    return Promise.resolve(new Blob([this._bodyText]));
  }), this.arrayBuffer = function() {
    if (this._bodyArrayBuffer) {
      var e = ns(this);
      return e || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
        this._bodyArrayBuffer.buffer.slice(
          this._bodyArrayBuffer.byteOffset,
          this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
        )
      ) : Promise.resolve(this._bodyArrayBuffer));
    } else {
      if ($t.blob)
        return this.blob().then(mf);
      throw new Error("could not read as ArrayBuffer");
    }
  }, this.text = function() {
    var e = ns(this);
    if (e)
      return e;
    if (this._bodyBlob)
      return yf(this._bodyBlob);
    if (this._bodyArrayBuffer)
      return Promise.resolve(vf(this._bodyArrayBuffer));
    if (this._bodyFormData)
      throw new Error("could not read FormData body as text");
    return Promise.resolve(this._bodyText);
  }, $t.formData && (this.formData = function() {
    return this.text().then(Ef);
  }), this.json = function() {
    return this.text().then(JSON.parse);
  }, this;
}
var wf = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
function bf(e) {
  var t = e.toUpperCase();
  return wf.indexOf(t) > -1 ? t : e;
}
function on(e, t) {
  if (!(this instanceof on))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  t = t || {};
  var n = t.body;
  if (e instanceof on) {
    if (e.bodyUsed)
      throw new TypeError("Already read");
    this.url = e.url, this.credentials = e.credentials, t.headers || (this.headers = new Ot(e.headers)), this.method = e.method, this.mode = e.mode, this.signal = e.signal, !n && e._bodyInit != null && (n = e._bodyInit, e.bodyUsed = !0);
  } else
    this.url = String(e);
  if (this.credentials = t.credentials || this.credentials || "same-origin", (t.headers || !this.headers) && (this.headers = new Ot(t.headers)), this.method = bf(t.method || this.method || "GET"), this.mode = t.mode || this.mode || null, this.signal = t.signal || this.signal || (function() {
    if ("AbortController" in jt) {
      var s = new AbortController();
      return s.signal;
    }
  })(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && n)
    throw new TypeError("Body not allowed for GET or HEAD requests");
  if (this._initBody(n), (this.method === "GET" || this.method === "HEAD") && (t.cache === "no-store" || t.cache === "no-cache")) {
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
function Ef(e) {
  var t = new FormData();
  return e.trim().split("&").forEach(function(n) {
    if (n) {
      var i = n.split("="), r = i.shift().replace(/\+/g, " "), s = i.join("=").replace(/\+/g, " ");
      t.append(decodeURIComponent(r), decodeURIComponent(s));
    }
  }), t;
}
function xf(e) {
  var t = new Ot(), n = e.replace(/\r?\n[\t ]+/g, " ");
  return n.split("\r").map(function(i) {
    return i.indexOf(`
`) === 0 ? i.substr(1, i.length) : i;
  }).forEach(function(i) {
    var r = i.split(":"), s = r.shift().trim();
    if (s) {
      var o = r.join(":").trim();
      try {
        t.append(s, o);
      } catch (a) {
        console.warn("Response " + a.message);
      }
    }
  }), t;
}
uc.call(on.prototype);
function be(e, t) {
  if (!(this instanceof be))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  if (t || (t = {}), this.type = "default", this.status = t.status === void 0 ? 200 : t.status, this.status < 200 || this.status > 599)
    throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
  this.ok = this.status >= 200 && this.status < 300, this.statusText = t.statusText === void 0 ? "" : "" + t.statusText, this.headers = new Ot(t.headers), this.url = t.url || "", this._initBody(e);
}
uc.call(be.prototype);
be.prototype.clone = function() {
  return new be(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Ot(this.headers),
    url: this.url
  });
};
be.error = function() {
  var e = new be(null, { status: 200, statusText: "" });
  return e.ok = !1, e.status = 0, e.type = "error", e;
};
var Mf = [301, 302, 303, 307, 308];
be.redirect = function(e, t) {
  if (Mf.indexOf(t) === -1)
    throw new RangeError("Invalid status code");
  return new be(null, { status: t, headers: { location: e } });
};
var Je = jt.DOMException;
try {
  new Je();
} catch {
  Je = function(t, n) {
    this.message = t, this.name = n;
    var i = Error(t);
    this.stack = i.stack;
  }, Je.prototype = Object.create(Error.prototype), Je.prototype.constructor = Je;
}
function hc(e, t) {
  return new Promise(function(n, i) {
    var r = new on(e, t);
    if (r.signal && r.signal.aborted)
      return i(new Je("Aborted", "AbortError"));
    var s = new XMLHttpRequest();
    function o() {
      s.abort();
    }
    s.onload = function() {
      var g = {
        statusText: s.statusText,
        headers: xf(s.getAllResponseHeaders() || "")
      };
      r.url.indexOf("file://") === 0 && (s.status < 200 || s.status > 599) ? g.status = 200 : g.status = s.status, g.url = "responseURL" in s ? s.responseURL : g.headers.get("X-Request-URL");
      var c = "response" in s ? s.response : s.responseText;
      setTimeout(function() {
        n(new be(c, g));
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
        i(new Je("Aborted", "AbortError"));
      }, 0);
    };
    function a(g) {
      try {
        return g === "" && jt.location.href ? jt.location.href : g;
      } catch {
        return g;
      }
    }
    if (s.open(r.method, a(r.url), !0), r.credentials === "include" ? s.withCredentials = !0 : r.credentials === "omit" && (s.withCredentials = !1), "responseType" in s && ($t.blob ? s.responseType = "blob" : $t.arrayBuffer && (s.responseType = "arraybuffer")), t && typeof t.headers == "object" && !(t.headers instanceof Ot || jt.Headers && t.headers instanceof jt.Headers)) {
      var A = [];
      Object.getOwnPropertyNames(t.headers).forEach(function(g) {
        A.push(Xn(g)), s.setRequestHeader(g, po(t.headers[g]));
      }), r.headers.forEach(function(g, c) {
        A.indexOf(c) === -1 && s.setRequestHeader(c, g);
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
hc.polyfill = !0;
jt.fetch || (jt.fetch = hc, jt.Headers = Ot, jt.Request = on, jt.Response = be);
const Ic = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAAqACAAQAAAABAAAANKADAAQAAAABAAAANAAAAAD/4QkhaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/4hskSUNDX1BST0ZJTEUAAQEAABsUYXBwbAIQAABtbnRyUkdCIFhZWiAH4AAKAB0AFAA0AAZhY3NwQVBQTAAAAABBUFBMAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFkZXNjAAABUAAAAGJkc2NtAAABtAAABBhjcHJ0AAAFzAAAACN3dHB0AAAF8AAAABRyWFlaAAAGBAAAABRnWFlaAAAGGAAAABRiWFlaAAAGLAAAABRyVFJDAAAGQAAACAxhYXJnAAAOTAAAACB2Y2d0AAAObAAABhJuZGluAAAUgAAABj5jaGFkAAAawAAAACxtbW9kAAAa7AAAAChiVFJDAAAGQAAACAxnVFJDAAAGQAAACAxhYWJnAAAOTAAAACBhYWdnAAAOTAAAACBkZXNjAAAAAAAAAAhEaXNwbGF5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbWx1YwAAAAAAAAAiAAAADGhySFIAAAAUAAABqGtvS1IAAAAMAAABvG5iTk8AAAASAAAByGlkAAAAAAASAAAB2mh1SFUAAAAUAAAB7GNzQ1oAAAAWAAACAGRhREsAAAAcAAACFnVrVUEAAAAcAAACMmFyAAAAAAAUAAACTml0SVQAAAAUAAACYnJvUk8AAAASAAACdm5sTkwAAAAWAAACiGhlSUwAAAAWAAACnmVzRVMAAAASAAACdmZpRkkAAAAQAAACtHpoVFcAAAAMAAACxHZpVk4AAAAOAAAC0HNrU0sAAAAWAAAC3npoQ04AAAAMAAACxHJ1UlUAAAAkAAAC9GZyRlIAAAAWAAADGG1zAAAAAAASAAADLmNhRVMAAAAYAAADQHRoVEgAAAAMAAADWGVzWEwAAAASAAACdmRlREUAAAAQAAADZGVuVVMAAAASAAADdHB0QlIAAAAYAAADhnBsUEwAAAASAAADnmVsR1IAAAAiAAADsHN2U0UAAAAQAAAD0nRyVFIAAAAUAAAD4mphSlAAAAAMAAAD9nB0UFQAAAAWAAAEAgBMAEMARAAgAHUAIABiAG8AagBpzuy37AAgAEwAQwBEAEYAYQByAGcAZQAtAEwAQwBEAEwAQwBEACAAVwBhAHIAbgBhAFMAegDtAG4AZQBzACAATABDAEQAQgBhAHIAZQB2AG4A/QAgAEwAQwBEAEwAQwBEAC0AZgBhAHIAdgBlAHMAawDmAHIAbQQaBD4EOwRMBD4EQAQ+BDIEOAQ5ACAATABDAEQgDwBMAEMARAAgBkUGRAZIBkYGKQBMAEMARAAgAGMAbwBsAG8AcgBpAEwAQwBEACAAYwBvAGwAbwByAEsAbABlAHUAcgBlAG4ALQBMAEMARCAPAEwAQwBEACAF5gXRBeIF1QXgBdkAVgDkAHIAaQAtAEwAQwBEX2mCcgAgAEwAQwBEAEwAQwBEACAATQDgAHUARgBhAHIAZQBiAG4A6QAgAEwAQwBEBCYEMgQ1BEIEPQQ+BDkAIAQWBBoALQQ0BDgEQQQ/BDsENQQ5AEwAQwBEACAAYwBvAHUAbABlAHUAcgBXAGEAcgBuAGEAIABMAEMARABMAEMARAAgAGUAbgAgAGMAbwBsAG8AcgBMAEMARAAgDioONQBGAGEAcgBiAC0ATABDAEQAQwBvAGwAbwByACAATABDAEQATABDAEQAIABDAG8AbABvAHIAaQBkAG8ASwBvAGwAbwByACAATABDAEQDiAOzA8cDwQPJA7wDtwAgA78DuAPMA70DtwAgAEwAQwBEAEYA5AByAGcALQBMAEMARABSAGUAbgBrAGwAaQAgAEwAQwBEMKsw6TD8AEwAQwBEAEwAQwBEACAAYQAgAEMAbwByAGUAc3RleHQAAAAAQ29weXJpZ2h0IEFwcGxlIEluYy4sIDIwMTYAAFhZWiAAAAAAAADzUgABAAAAARbPWFlaIAAAAAAAAGXoAAA8EAAACdBYWVogAAAAAAAAapMAAKrFAAAXilhZWiAAAAAAAAAmWwAAGSwAALHSY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA2ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKMAqACtALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkH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", Cc = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAAqACAAQAAAABAAAANKADAAQAAAABAAAANAAAAAD/4QkhaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/4gKESUNDX1BST0ZJTEUAAQEAAAJ0YXBwbAQAAABtbnRyUkdCIFhZWiAH3AALAAwAEgA6ABdhY3NwQVBQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGxmSfnZPIV3n7QGSpkeOnQsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtkZXNjAAABCAAAAGNkc2NtAAABbAAAACxjcHJ0AAABmAAAAC13dHB0AAAByAAAABRyWFlaAAAB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", fc = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCARXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAKgAgAEAAAAAQAAADSgAwAEAAAAAQAAADQAAAAA/+EJIWh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/PgD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/+IbJElDQ19QUk9GSUxFAAEBAAAbFGFwcGwCEAAAbW50clJHQiBYWVogB+EABAAEABcABgAzYWNzcEFQUEwAAAAAQVBQTAAAAAAAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1hcHBsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARZGVzYwAAAVAAAABiZHNjbQAAAbQAAAQYY3BydAAABcwAAAAjd3RwdAAABfAAAAAUclhZWgAABgQAAAAUZ1hZWgAABhgAAAAUYlhZWgAABiwAAAAUclRSQwAABkAAAAgMYWFyZwAADkwAAAAgdmNndAAADmwAAAYSbmRpbgAAFIAAAAY+Y2hhZAAAGsAAAAAsbW1vZAAAGuwAAAAoYlRSQwAABkAAAAgMZ1RSQwAABkAAAAgMYWFiZwAADkwAAAAgYWFnZwAADkwAAAAgZGVzYwAAAAAAAAAIRGlzcGxheQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG1sdWMAAAAAAAAAIgAAAAxockhSAAAAFAAAAahrb0tSAAAADAAAAbxuYk5PAAAAEgAAAchpZAAAAAAAEgAAAdpodUhVAAAAFAAAAexjc0NaAAAAFgAAAgBkYURLAAAAHAAAAhZ1a1VBAAAAHAAAAjJhcgAAAAAAFAAAAk5pdElUAAAAFAAAAmJyb1JPAAAAEgAAAnZubE5MAAAAFgAAAohoZUlMAAAAFgAAAp5lc0VTAAAAEgAAAnZmaUZJAAAAEAAAArR6aFRXAAAADAAAAsR2aVZOAAAADgAAAtBza1NLAAAAFgAAAt56aENOAAAADAAAAsRydVJVAAAAJAAAAvRmckZSAAAAFgAAAxhtcwAAAAAAEgAAAy5jYUVTAAAAGAAAA0B0aFRIAAAADAAAA1hlc1hMAAAAEgAAAnZkZURFAAAAEAAAA2RlblVTAAAAEgAAA3RwdEJSAAAAGAAAA4ZwbFBMAAAAEgAAA55lbEdSAAAAIgAAA7BzdlNFAAAAEAAAA9J0clRSAAAAFAAAA+JqYUpQAAAADAAAA/ZwdFBUAAAAFgAABAIATABDAEQAIAB1ACAAYgBvAGoAac7st+wAIABMAEMARABGAGEAcgBnAGUALQBMAEMARABMAEMARAAgAFcAYQByAG4AYQBTAHoA7QBuAGUAcwAgAEwAQwBEAEIAYQByAGUAdgBuAP0AIABMAEMARABMAEMARAAtAGYAYQByAHYAZQBzAGsA5gByAG0EGgQ+BDsETAQ+BEAEPgQyBDgEOQAgAEwAQwBEIA8ATABDAEQAIAZFBkQGSAZGBikATABDAEQAIABjAG8AbABvAHIAaQBMAEMARAAgAGMAbwBsAG8AcgBLAGwAZQB1AHIAZQBuAC0ATABDAEQgDwBMAEMARAAgBeYF0QXiBdUF4AXZAFYA5AByAGkALQBMAEMARF9pgnIAIABMAEMARABMAEMARAAgAE0A4AB1AEYAYQByAGUAYgBuAP0AIABMAEMARAQmBDIENQRCBD0EPgQ5ACAEFgQaAC0ENAQ4BEEEPwQ7BDUEOQBMAEMARAAgAGMAbwB1AGwAZQB1AHIAVwBhAHIAbgBhACAATABDAEQATABDAEQAIABlAG4AIABjAG8AbABvAHIATABDAEQAIA4qDjUARgBhAHIAYgAtAEwAQwBEAEMAbwBsAG8AcgAgAEwAQwBEAEwAQwBEACAAQwBvAGwAbwByAGkAZABvAEsAbwBsAG8AcgAgAEwAQwBEA4gDswPHA8EDyQO8A7cAIAO/A7gDzAO9A7cAIABMAEMARABGAOQAcgBnAC0ATABDAEQAUgBlAG4AawBsAGkAIABMAEMARDCrMOkw/ABMAEMARABMAEMARAAgAGEAIABDAG8AcgBlAHN0ZXh0AAAAAENvcHlyaWdodCBBcHBsZSBJbmMuLCAyMDE3AABYWVogAAAAAAAA81IAAQAAAAEWz1hZWiAAAAAAAABl6AAAPBAAAAnQWFlaIAAAAAAAAGqTAACqxQAAF4pYWVogAAAAAAAAJlsAABksAACx0mN1cnYAAAAAAAAEAAAAAAUACgAPABQAGQAeACMAKAAtADIANgA7AEAARQBKAE8AVABZAF4AYwBoAG0AcgB3AHwAgQCGAIsAkACVAJoAnwCjAKgArQCyALcAvADBAMYAywDQANUA2wDgAOUA6wDwAPYA+wEBAQcBDQETARkBHwElASsBMgE4AT4BRQFMAVIBWQFgAWcBbgF1AXwBgwGLAZIBmgGhAakBsQG5AcEByQHRAdkB4QHpAfIB+gIDAgwCFAIdAiYCLwI4AkECSwJUAl0CZwJxAnoChAKOApgCogKsArYCwQLLAtUC4ALrAvUDAAMLAxYDIQMtAzgDQwNPA1oDZgNyA34DigOWA6IDrgO6A8cD0wPgA+wD+QQGBBMEIAQtBDsESARVBGMEcQR+BIwEmgSoBLYExATTBOEE8AT+BQ0FHAUrBToFSQVYBWcF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", Sf = {
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
    thumbnail: Ic,
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
    thumbnail: Cc
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
    thumbnail: fc
  }
}, sA = (e) => (e || "").match(/^(?:base|overlay|google(?:_(?:roadmap|satellite|hybrid|terrain))?|mapbox|maplibre|osm)$/);
async function Tf(e, t) {
  typeof e == "string" && (e = { ...Sf[e] }), e = we(Object.assign(e, t));
  const n = e.label || e.year;
  if (n !== void 0 && (e.label = n), sA(e.maptype)) {
    const c = e.maptype === "base" ? Gn : e.maptype === "overlay" ? _n : e.maptype === "mapbox" ? hr : e.maptype === "maplibre" ? Ir : Bs;
    c.isBasemap() ? (e.homePosition = e.homePos, e.mercZoom = e.defZoom) : (e.homePosition || (e.homePosition = e.homePos), e.mercZoom || (e.mercZoom = e.defZoom)), delete e.homePos, delete e.defZoom, e.zoomRestriction && (e.maxZoom = e.maxZoom || e.mercMaxZoom, e.minZoom = e.minZoom || e.mercMinZoom), e.zoomRestriction = e.mercMaxZoom = e.mercMinZoom = void 0, e.imageExtension || (e.imageExtension = "jpg"), Ds(e.maptype) ? (delete e.url, delete e.urls) : e.mapID && !e.url && !e.urls && (e.url = e.tms ? `tiles/${e.mapID}/{z}/{x}/{-y}.${e.imageExtension}` : `tiles/${e.mapID}/{z}/{x}/{y}.${e.imageExtension}`), e.weiwudi = await is(e), e.weiwudi && (e.url = e.weiwudi.url, delete e.urls);
    const u = await c.createAsync(e);
    return await u.initialWait, u;
  } else if (e.noload) {
    e.mercMaxZoom = e.mercMinZoom = void 0;
    const c = Pa(e);
    c && await nA(e, {
      width: e.width,
      height: e.height
    });
    const u = new Cr(e);
    return c && iA(u, e), u;
  }
  const i = e.settingFile || `maps/${e.mapID}.json`, r = await fetch(i);
  if (!r.ok)
    throw new Error("Fail to load map json");
  const s = await r.json();
  if (e = we(Object.assign(s, e)), e.label = e.label || s.year, e.maptype || (e.maptype = "maplat"), sA(e.maptype)) {
    const c = e.maptype === "base" ? Gn : e.maptype === "overlay" ? _n : e.maptype === "mapbox" ? hr : e.maptype === "maplibre" ? Ir : Bs;
    c.isBasemap() ? (e.homePosition = e.homePos, e.mercZoom = e.defZoom) : (e.homePosition || (e.homePosition = e.homePos), e.mercZoom || (e.mercZoom = e.defZoom)), delete e.homePos, delete e.defZoom, e.zoomRestriction && (e.maxZoom = e.maxZoom || e.mercMaxZoom, e.minZoom = e.minZoom || e.mercMinZoom), e.zoomRestriction = e.mercMaxZoom = e.mercMinZoom = void 0, e.imageExtension || (e.imageExtension = "jpg"), Ds(e.maptype) ? (delete e.url, delete e.urls) : e.mapID && !e.url && !e.urls && (e.url = e.tms ? `tiles/${e.mapID}/{z}/{x}/{-y}.${e.imageExtension}` : `tiles/${e.mapID}/{z}/{x}/{y}.${e.imageExtension}`), e.weiwudi = await is(e), e.weiwudi && (e.url = e.weiwudi.url, delete e.urls);
    const u = await c.createAsync(e);
    try {
      return await u.initialWait, u;
    } catch {
      return u;
    }
  }
  delete e.homePos, delete e.defZoom, e.imageExtension || (e.imageExtension = "jpg");
  const o = Pa(e);
  !o && e.mapID && !e.url && !e.urls && (e.url = `tiles/${e.mapID}/{z}/{x}/{y}.${e.imageExtension}`), e.tinEnabled !== !1 && !e.compiled?.wh && console.error(
    `[Maplat] Missing compiled.wh for mapID=${e.mapID}. Check map setting file: ${i}`
  );
  const [a, A] = gc(e);
  e.width = e.width || a, e.height = e.height || A, o && await nA(e, { width: a, height: A }), e.weiwudi = await is(e), e.weiwudi && (e.url = e.weiwudi.url, delete e.urls);
  const g = await Cr.createAsync(e);
  return iA(g, e), await g.initialWait, await new Promise((c) => {
    g.setupMapParameter(() => c());
  }), g;
}
async function is(e) {
  const t = {};
  if (e.maptype === "mapbox" || e.maptype === "maplibre" || e.maptype === "google" || !e.enableCache || e.noCache === !0 || CI(e)) return;
  e.maptype === "base" || e.maptype === "overlay" ? t.type = "wmts" : t.type = "xyz", t.url = e.urls ? e.urls : e.url, t.width = e.width, t.height = e.height, t.maxZoom = e.maxZoom, t.minZoom = e.minZoom, e.cacheTtl !== void 0 && (t.cacheTtl = e.cacheTtl);
  const n = e.envelopeLngLats;
  if (n) {
    const r = n.reduce(
      (s, o) => (s[0] = s[0] > o[0] ? o[0] : s[0], s[1] = s[1] < o[0] ? o[0] : s[1], s[2] = s[2] > o[1] ? o[1] : s[2], s[3] = s[3] < o[1] ? o[1] : s[3], s),
      [1 / 0, -1 / 0, 1 / 0, -1 / 0]
    );
    ["minLng", "maxLng", "minLat", "maxLat"].map((s, o) => {
      t[s] = r[o];
    });
  }
  let i;
  try {
    i = await de.registerMap(e.mapID, t);
  } catch {
  }
  return i;
}
function rs(e, t) {
  return e + (Math.random() - 0.5) * t;
}
function Fs(e, t) {
  if (e instanceof Array)
    return e.map((i) => Fs(i, t));
  const n = Math.pow(10, t);
  return Math.round(e * n) / n;
}
function _f(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var js = { exports: {} }, kf = js.exports, oA;
function Rf() {
  return oA || (oA = 1, (function(e, t) {
    (function(n, i) {
      e.exports = i();
    })(typeof self < "u" ? self : kf, function() {
      return (
        /******/
        (function(n) {
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
            return n[s].call(o.exports, o, o.exports, r), o.l = !0, o.exports;
          }
          return r.m = n, r.c = i, r.d = function(s, o, a) {
            r.o(s, o) || Object.defineProperty(s, o, {
              /******/
              configurable: !1,
              /******/
              enumerable: !0,
              /******/
              get: a
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
          (function(n, g, r) {
            var s = Array.prototype, o = Object.prototype, a = {
              "&": "&amp;",
              '"': "&quot;",
              "'": "&#39;",
              "<": "&lt;",
              ">": "&gt;",
              "\\": "&#92;"
            }, A = /[&"'<>\\]/g, g = n.exports = {};
            function c(k, j) {
              return o.hasOwnProperty.call(k, j);
            }
            g.hasOwnProp = c;
            function u(k) {
              return a[k];
            }
            function C(k, j, z) {
              if (z.Update || (z = new g.TemplateError(z)), z.Update(k), !j) {
                var U = z;
                z = new Error(U.message), z.name = U.name;
              }
              return z;
            }
            g._prettifyError = C;
            function y(k, j, z) {
              var U, J;
              k instanceof Error && (J = k, k = J.name + ": " + J.message), Object.setPrototypeOf ? (U = new Error(k), Object.setPrototypeOf(U, y.prototype)) : (U = this, Object.defineProperty(U, "message", {
                enumerable: !1,
                writable: !0,
                value: k
              })), Object.defineProperty(U, "name", {
                value: "Template render error"
              }), Error.captureStackTrace && Error.captureStackTrace(U, this.constructor);
              var tt;
              if (J) {
                var W = Object.getOwnPropertyDescriptor(J, "stack");
                tt = W && (W.get || function() {
                  return W.value;
                }), tt || (tt = function() {
                  return J.stack;
                });
              } else {
                var $ = new Error(k).stack;
                tt = function() {
                  return $;
                };
              }
              return Object.defineProperty(U, "stack", {
                get: function() {
                  return tt.call(U);
                }
              }), Object.defineProperty(U, "cause", {
                value: J
              }), U.lineno = j, U.colno = z, U.firstUpdate = !0, U.Update = function(ot) {
                var et = "(" + (ot || "unknown path") + ")";
                return this.firstUpdate && (this.lineno && this.colno ? et += " [Line " + this.lineno + ", Column " + this.colno + "]" : this.lineno && (et += " [Line " + this.lineno + "]")), et += `
 `, this.firstUpdate && (et += " "), this.message = et + (this.message || ""), this.firstUpdate = !1, this;
              }, U;
            }
            Object.setPrototypeOf ? Object.setPrototypeOf(y.prototype, Error.prototype) : y.prototype = Object.create(Error.prototype, {
              constructor: {
                value: y
              }
            }), g.TemplateError = y;
            function w(k) {
              return k.replace(A, u);
            }
            g.escape = w;
            function l(k) {
              return o.toString.call(k) === "[object Function]";
            }
            g.isFunction = l;
            function f(k) {
              return o.toString.call(k) === "[object Array]";
            }
            g.isArray = f;
            function p(k) {
              return o.toString.call(k) === "[object String]";
            }
            g.isString = p;
            function I(k) {
              return o.toString.call(k) === "[object Object]";
            }
            g.isObject = I;
            function b(k) {
              return k ? typeof k == "string" ? k.split(".") : [k] : [];
            }
            function d(k) {
              var j = b(k);
              return function(z) {
                for (var U = z, J = 0; J < j.length; J++) {
                  var tt = j[J];
                  if (c(U, tt))
                    U = U[tt];
                  else
                    return;
                }
                return U;
              };
            }
            g.getAttrGetter = d;
            function h(k, j, z) {
              for (var U = {}, J = l(j) ? j : d(j), tt = 0; tt < k.length; tt++) {
                var W = k[tt], $ = J(W, tt);
                if ($ === void 0 && z === !0)
                  throw new TypeError('groupby: attribute "' + j + '" resolved to undefined');
                (U[$] || (U[$] = [])).push(W);
              }
              return U;
            }
            g.groupBy = h;
            function m(k) {
              return Array.prototype.slice.call(k);
            }
            g.toArray = m;
            function v(k) {
              var j = [];
              if (!k)
                return j;
              for (var z = k.length, U = m(arguments).slice(1), J = -1; ++J < z; )
                P(U, k[J]) === -1 && j.push(k[J]);
              return j;
            }
            g.without = v;
            function E(k, j) {
              for (var z = "", U = 0; U < j; U++)
                z += k;
              return z;
            }
            g.repeat = E;
            function M(k, j, z) {
              if (k != null) {
                if (s.forEach && k.forEach === s.forEach)
                  k.forEach(j, z);
                else if (k.length === +k.length)
                  for (var U = 0, J = k.length; U < J; U++)
                    j.call(z, k[U], U, k);
              }
            }
            g.each = M;
            function x(k, j) {
              var z = [];
              if (k == null)
                return z;
              if (s.map && k.map === s.map)
                return k.map(j);
              for (var U = 0; U < k.length; U++)
                z[z.length] = j(k[U], U);
              return k.length === +k.length && (z.length = k.length), z;
            }
            g.map = x;
            function S(k, j, z) {
              var U = -1;
              function J() {
                U++, U < k.length ? j(k[U], U, J, z) : z();
              }
              J();
            }
            g.asyncIter = S;
            function _(k, j, z) {
              var U = D(k || {}), J = U.length, tt = -1;
              function W() {
                tt++;
                var $ = U[tt];
                tt < J ? j($, k[$], tt, J, W) : z();
              }
              W();
            }
            g.asyncFor = _;
            function P(k, j, z) {
              return Array.prototype.indexOf.call(k || [], j, z);
            }
            g.indexOf = P;
            function D(k) {
              var j = [];
              for (var z in k)
                c(k, z) && j.push(z);
              return j;
            }
            g.keys = D;
            function F(k) {
              return D(k).map(function(j) {
                return [j, k[j]];
              });
            }
            g._entries = F;
            function N(k) {
              return D(k).map(function(j) {
                return k[j];
              });
            }
            g._values = N;
            function R(k, j) {
              return k = k || {}, D(j).forEach(function(z) {
                k[z] = j[z];
              }), k;
            }
            g._assign = g.extend = R;
            function B(k, j) {
              if (f(j) || p(j))
                return j.indexOf(k) !== -1;
              if (I(j))
                return k in j;
              throw new Error('Cannot use "in" operator to search for "' + k + '" in unexpected types.');
            }
            g.inOperator = B;
          }),
          /* 1 */
          /***/
          (function(n, i, r) {
            function s(p, I) {
              for (var b = 0; b < I.length; b++) {
                var d = I[b];
                d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(p, a(d.key), d);
              }
            }
            function o(p, I, b) {
              return I && s(p.prototype, I), Object.defineProperty(p, "prototype", { writable: !1 }), p;
            }
            function a(p) {
              var I = A(p, "string");
              return typeof I == "symbol" ? I : String(I);
            }
            function A(p, I) {
              if (typeof p != "object" || p === null) return p;
              var b = p[Symbol.toPrimitive];
              if (b !== void 0) {
                var d = b.call(p, I);
                if (typeof d != "object") return d;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return String(p);
            }
            function g(p, I) {
              p.prototype = Object.create(I.prototype), p.prototype.constructor = p, c(p, I);
            }
            function c(p, I) {
              return c = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(b, d) {
                return b.__proto__ = d, b;
              }, c(p, I);
            }
            var u = r(16), C = r(0);
            function y(p, I) {
              return typeof p != "function" || typeof I != "function" ? I : function() {
                var b = this.parent;
                this.parent = p;
                var d = I.apply(this, arguments);
                return this.parent = b, d;
              };
            }
            function w(p, I, b) {
              b = b || {}, C.keys(b).forEach(function(h) {
                b[h] = y(p.prototype[h], b[h]);
              });
              var d = /* @__PURE__ */ (function(h) {
                g(m, h);
                function m() {
                  return h.apply(this, arguments) || this;
                }
                return o(m, [{
                  key: "typename",
                  get: function() {
                    return I;
                  }
                }]), m;
              })(p);
              return C._assign(d.prototype, b), d;
            }
            var l = /* @__PURE__ */ (function() {
              function p() {
                this.init.apply(this, arguments);
              }
              var I = p.prototype;
              return I.init = function() {
              }, p.extend = function(b, d) {
                return typeof b == "object" && (d = b, b = "anonymous"), w(this, b, d);
              }, o(p, [{
                key: "typename",
                get: function() {
                  return this.constructor.name;
                }
              }]), p;
            })(), f = /* @__PURE__ */ (function(p) {
              g(I, p);
              function I() {
                var d, h;
                return h = p.call(this) || this, (d = h).init.apply(d, arguments), h;
              }
              var b = I.prototype;
              return b.init = function() {
              }, I.extend = function(d, h) {
                return typeof d == "object" && (h = d, d = "anonymous"), w(this, d, h);
              }, o(I, [{
                key: "typename",
                get: function() {
                  return this.constructor.name;
                }
              }]), I;
            })(u);
            n.exports = {
              Obj: l,
              EmitterObj: f
            };
          }),
          /* 2 */
          /***/
          (function(n, i, r) {
            var s = r(0), o = Array.from, a = typeof Symbol == "function" && Symbol.iterator && typeof o == "function", A = /* @__PURE__ */ (function() {
              function x(_, P) {
                this.variables = /* @__PURE__ */ Object.create(null), this.parent = _, this.topLevel = !1, this.isolateWrites = P;
              }
              var S = x.prototype;
              return S.set = function(_, P, D) {
                var F = _.split("."), N = this.variables, R = this;
                if (D && (R = this.resolve(F[0], !0))) {
                  R.set(_, P);
                  return;
                }
                for (var B = 0; B < F.length - 1; B++) {
                  var k = F[B];
                  N[k] || (N[k] = {}), N = N[k];
                }
                N[F[F.length - 1]] = P;
              }, S.get = function(_) {
                var P = this.variables[_];
                return P !== void 0 ? P : null;
              }, S.lookup = function(_) {
                var P = this.parent, D = this.variables[_];
                return D !== void 0 ? D : P && P.lookup(_);
              }, S.resolve = function(_, P) {
                var D = P && this.isolateWrites ? void 0 : this.parent, F = this.variables[_];
                return F !== void 0 ? this : D && D.resolve(_);
              }, S.push = function(_) {
                return new x(this, _);
              }, S.pop = function() {
                return this.parent;
              }, x;
            })();
            function g(x, S, _) {
              return function() {
                for (var P = arguments.length, D = new Array(P), F = 0; F < P; F++)
                  D[F] = arguments[F];
                var N = y(D), R, B = C(D);
                if (N > x.length)
                  R = D.slice(0, x.length), D.slice(R.length, N).forEach(function(z, U) {
                    U < S.length && (B[S[U]] = z);
                  }), R.push(B);
                else if (N < x.length) {
                  R = D.slice(0, N);
                  for (var k = N; k < x.length; k++) {
                    var j = x[k];
                    R.push(B[j]), delete B[j];
                  }
                  R.push(B);
                } else
                  R = D;
                return _.apply(this, R);
              };
            }
            function c(x) {
              return x.__keywords = !0, x;
            }
            function u(x) {
              return x && Object.prototype.hasOwnProperty.call(x, "__keywords");
            }
            function C(x) {
              var S = x.length;
              if (S) {
                var _ = x[S - 1];
                if (u(_))
                  return _;
              }
              return {};
            }
            function y(x) {
              var S = x.length;
              if (S === 0)
                return 0;
              var _ = x[S - 1];
              return u(_) ? S - 1 : S;
            }
            function w(x) {
              if (typeof x != "string")
                return x;
              this.val = x, this.length = x.length;
            }
            w.prototype = Object.create(String.prototype, {
              length: {
                writable: !0,
                configurable: !0,
                value: 0
              }
            }), w.prototype.valueOf = function() {
              return this.val;
            }, w.prototype.toString = function() {
              return this.val;
            };
            function l(x, S) {
              return x instanceof w ? new w(S) : S.toString();
            }
            function f(x) {
              var S = typeof x;
              return S === "string" ? new w(x) : S !== "function" ? x : function(_) {
                var P = x.apply(this, arguments);
                return typeof P == "string" ? new w(P) : P;
              };
            }
            function p(x, S) {
              return x = x ?? "", S && !(x instanceof w) && (x = s.escape(x.toString())), x;
            }
            function I(x, S, _) {
              if (x == null)
                throw new s.TemplateError("attempted to output null or undefined value", S + 1, _ + 1);
              return x;
            }
            function b(x, S) {
              if (x != null)
                return typeof x[S] == "function" ? function() {
                  for (var _ = arguments.length, P = new Array(_), D = 0; D < _; D++)
                    P[D] = arguments[D];
                  return x[S].apply(x, P);
                } : x[S];
            }
            function d(x, S, _, P) {
              if (x) {
                if (typeof x != "function")
                  throw new Error("Unable to call `" + S + "`, which is not a function");
              } else throw new Error("Unable to call `" + S + "`, which is undefined or falsey");
              return x.apply(_, P);
            }
            function h(x, S, _) {
              var P = S.lookup(_);
              return P !== void 0 ? P : x.lookup(_);
            }
            function m(x, S, _) {
              return x.lineno ? x : new s.TemplateError(x, S, _);
            }
            function v(x, S, _, P) {
              if (s.isArray(x)) {
                var D = x.length;
                s.asyncIter(x, function(F, N, R) {
                  switch (S) {
                    case 1:
                      _(F, N, D, R);
                      break;
                    case 2:
                      _(F[0], F[1], N, D, R);
                      break;
                    case 3:
                      _(F[0], F[1], F[2], N, D, R);
                      break;
                    default:
                      F.push(N, D, R), _.apply(this, F);
                  }
                }, P);
              } else
                s.asyncFor(x, function(F, N, R, B, k) {
                  _(F, N, R, B, k);
                }, P);
            }
            function E(x, S, _, P) {
              var D = 0, F, N;
              function R(J, tt) {
                D++, N[J] = tt, D === F && P(null, N.join(""));
              }
              if (s.isArray(x))
                if (F = x.length, N = new Array(F), F === 0)
                  P(null, "");
                else
                  for (var B = 0; B < x.length; B++) {
                    var k = x[B];
                    switch (S) {
                      case 1:
                        _(k, B, F, R);
                        break;
                      case 2:
                        _(k[0], k[1], B, F, R);
                        break;
                      case 3:
                        _(k[0], k[1], k[2], B, F, R);
                        break;
                      default:
                        k.push(B, F, R), _.apply(this, k);
                    }
                  }
              else {
                var j = s.keys(x || {});
                if (F = j.length, N = new Array(F), F === 0)
                  P(null, "");
                else
                  for (var z = 0; z < j.length; z++) {
                    var U = j[z];
                    _(U, x[U], z, F, R);
                  }
              }
            }
            function M(x) {
              return typeof x != "object" || x === null || s.isArray(x) ? x : a && Symbol.iterator in x ? o(x) : x;
            }
            n.exports = {
              Frame: A,
              makeMacro: g,
              makeKeywordArgs: c,
              numArgs: y,
              suppressValue: p,
              ensureDefined: I,
              memberLookup: b,
              contextOrFrameLookup: h,
              callWrap: d,
              handleError: m,
              isArray: s.isArray,
              keys: s.keys,
              SafeString: w,
              copySafeness: l,
              markSafe: f,
              asyncEach: v,
              asyncAll: E,
              inOperator: s.inOperator,
              fromIterator: M
            };
          }),
          /* 3 */
          /***/
          (function(n, i, r) {
            function s(nt, st) {
              for (var pt = 0; pt < st.length; pt++) {
                var Ct = st[pt];
                Ct.enumerable = Ct.enumerable || !1, Ct.configurable = !0, "value" in Ct && (Ct.writable = !0), Object.defineProperty(nt, a(Ct.key), Ct);
              }
            }
            function o(nt, st, pt) {
              return st && s(nt.prototype, st), Object.defineProperty(nt, "prototype", { writable: !1 }), nt;
            }
            function a(nt) {
              var st = A(nt, "string");
              return typeof st == "symbol" ? st : String(st);
            }
            function A(nt, st) {
              if (typeof nt != "object" || nt === null) return nt;
              var pt = nt[Symbol.toPrimitive];
              if (pt !== void 0) {
                var Ct = pt.call(nt, st);
                if (typeof Ct != "object") return Ct;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return String(nt);
            }
            function g(nt, st) {
              nt.prototype = Object.create(st.prototype), nt.prototype.constructor = nt, c(nt, st);
            }
            function c(nt, st) {
              return c = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(pt, Ct) {
                return pt.__proto__ = Ct, pt;
              }, c(nt, st);
            }
            var u = r(1), C = u.Obj;
            function y(nt, st, pt) {
              nt instanceof st && pt.push(nt), nt instanceof w && nt.findAll(st, pt);
            }
            var w = /* @__PURE__ */ (function(nt) {
              g(st, nt);
              function st() {
                return nt.apply(this, arguments) || this;
              }
              var pt = st.prototype;
              return pt.init = function(Ct, mt) {
                for (var xt = arguments, Rt = this, ae = arguments.length, Me = new Array(ae > 2 ? ae - 2 : 0), We = 2; We < ae; We++)
                  Me[We - 2] = arguments[We];
                this.lineno = Ct, this.colno = mt, this.fields.forEach(function(Ti, _i) {
                  var An = xt[_i + 2];
                  An === void 0 && (An = null), Rt[Ti] = An;
                });
              }, pt.findAll = function(Ct, mt) {
                var xt = this;
                return mt = mt || [], this instanceof f ? this.children.forEach(function(Rt) {
                  return y(Rt, Ct, mt);
                }) : this.fields.forEach(function(Rt) {
                  return y(xt[Rt], Ct, mt);
                }), mt;
              }, pt.iterFields = function(Ct) {
                var mt = this;
                this.fields.forEach(function(xt) {
                  Ct(mt[xt], xt);
                });
              }, st;
            })(C), l = /* @__PURE__ */ (function(nt) {
              g(st, nt);
              function st() {
                return nt.apply(this, arguments) || this;
              }
              return o(st, [{
                key: "typename",
                get: function() {
                  return "Value";
                }
              }, {
                key: "fields",
                get: function() {
                  return ["value"];
                }
              }]), st;
            })(w), f = /* @__PURE__ */ (function(nt) {
              g(st, nt);
              function st() {
                return nt.apply(this, arguments) || this;
              }
              var pt = st.prototype;
              return pt.init = function(Ct, mt, xt) {
                nt.prototype.init.call(this, Ct, mt, xt || []);
              }, pt.addChild = function(Ct) {
                this.children.push(Ct);
              }, o(st, [{
                key: "typename",
                get: function() {
                  return "NodeList";
                }
              }, {
                key: "fields",
                get: function() {
                  return ["children"];
                }
              }]), st;
            })(w), p = f.extend("Root"), I = l.extend("Literal"), b = l.extend("Symbol"), d = f.extend("Group"), h = f.extend("Array"), m = w.extend("Pair", {
              fields: ["key", "value"]
            }), v = f.extend("Dict"), E = w.extend("LookupVal", {
              fields: ["target", "val"]
            }), M = w.extend("If", {
              fields: ["cond", "body", "else_"]
            }), x = M.extend("IfAsync"), S = w.extend("InlineIf", {
              fields: ["cond", "body", "else_"]
            }), _ = w.extend("For", {
              fields: ["arr", "name", "body", "else_"]
            }), P = _.extend("AsyncEach"), D = _.extend("AsyncAll"), F = w.extend("Macro", {
              fields: ["name", "args", "body"]
            }), N = F.extend("Caller"), R = w.extend("Import", {
              fields: ["template", "target", "withContext"]
            }), B = /* @__PURE__ */ (function(nt) {
              g(st, nt);
              function st() {
                return nt.apply(this, arguments) || this;
              }
              var pt = st.prototype;
              return pt.init = function(Ct, mt, xt, Rt, ae) {
                nt.prototype.init.call(this, Ct, mt, xt, Rt || new f(), ae);
              }, o(st, [{
                key: "typename",
                get: function() {
                  return "FromImport";
                }
              }, {
                key: "fields",
                get: function() {
                  return ["template", "names", "withContext"];
                }
              }]), st;
            })(w), k = w.extend("FunCall", {
              fields: ["name", "args"]
            }), j = k.extend("Filter"), z = j.extend("FilterAsync", {
              fields: ["name", "args", "symbol"]
            }), U = v.extend("KeywordArgs"), J = w.extend("Block", {
              fields: ["name", "body"]
            }), tt = w.extend("Super", {
              fields: ["blockName", "symbol"]
            }), W = w.extend("TemplateRef", {
              fields: ["template"]
            }), $ = W.extend("Extends"), ot = w.extend("Include", {
              fields: ["template", "ignoreMissing"]
            }), et = w.extend("Set", {
              fields: ["targets", "value"]
            }), Y = w.extend("Switch", {
              fields: ["expr", "cases", "default"]
            }), q = w.extend("Case", {
              fields: ["cond", "body"]
            }), K = f.extend("Output"), ct = w.extend("Capture", {
              fields: ["body"]
            }), yt = I.extend("TemplateData"), wt = w.extend("UnaryOp", {
              fields: ["target"]
            }), ht = w.extend("BinOp", {
              fields: ["left", "right"]
            }), lt = ht.extend("In"), O = ht.extend("Is"), G = ht.extend("Or"), H = ht.extend("And"), Q = wt.extend("Not"), at = ht.extend("Add"), rt = ht.extend("Concat"), ut = ht.extend("Sub"), gt = ht.extend("Mul"), bt = ht.extend("Div"), kt = ht.extend("FloorDiv"), Yt = ht.extend("Mod"), le = ht.extend("Pow"), Ee = wt.extend("Neg"), xe = wt.extend("Pos"), Zn = w.extend("Compare", {
              fields: ["expr", "ops"]
            }), an = w.extend("CompareOperand", {
              fields: ["expr", "type"]
            }), De = w.extend("CallExtension", {
              init: function(nt, st, pt, Ct) {
                this.parent(), this.extName = nt.__name || nt, this.prop = st, this.args = pt || new f(), this.contentArgs = Ct || [], this.autoescape = nt.autoescape;
              },
              fields: ["extName", "prop", "args", "contentArgs"]
            }), Vn = De.extend("CallExtensionAsync");
            function se(nt, st, pt) {
              var Ct = nt.split(`
`);
              Ct.forEach(function(mt, xt) {
                mt && (pt && xt > 0 || !pt) && process.stdout.write(" ".repeat(st));
                var Rt = xt === Ct.length - 1 ? "" : `
`;
                process.stdout.write("" + mt + Rt);
              });
            }
            function Ce(nt, st) {
              if (st = st || 0, se(nt.typename + ": ", st), nt instanceof f)
                se(`
`), nt.children.forEach(function(mt) {
                  Ce(mt, st + 2);
                });
              else if (nt instanceof De)
                se(nt.extName + "." + nt.prop + `
`), nt.args && Ce(nt.args, st + 2), nt.contentArgs && nt.contentArgs.forEach(function(mt) {
                  Ce(mt, st + 2);
                });
              else {
                var pt = [], Ct = null;
                nt.iterFields(function(mt, xt) {
                  mt instanceof w ? pt.push([xt, mt]) : (Ct = Ct || {}, Ct[xt] = mt);
                }), Ct ? se(JSON.stringify(Ct, null, 2) + `
`, null, !0) : se(`
`), pt.forEach(function(mt) {
                  var xt = mt[0], Rt = mt[1];
                  se("[" + xt + "] =>", st + 2), Ce(Rt, st + 4);
                });
              }
            }
            n.exports = {
              Node: w,
              Root: p,
              NodeList: f,
              Value: l,
              Literal: I,
              Symbol: b,
              Group: d,
              Array: h,
              Pair: m,
              Dict: v,
              Output: K,
              Capture: ct,
              TemplateData: yt,
              If: M,
              IfAsync: x,
              InlineIf: S,
              For: _,
              AsyncEach: P,
              AsyncAll: D,
              Macro: F,
              Caller: N,
              Import: R,
              FromImport: B,
              FunCall: k,
              Filter: j,
              FilterAsync: z,
              KeywordArgs: U,
              Block: J,
              Super: tt,
              Extends: $,
              Include: ot,
              Set: et,
              Switch: Y,
              Case: q,
              LookupVal: E,
              BinOp: ht,
              In: lt,
              Is: O,
              Or: G,
              And: H,
              Not: Q,
              Add: at,
              Concat: rt,
              Sub: ut,
              Mul: gt,
              Div: bt,
              FloorDiv: kt,
              Mod: Yt,
              Pow: le,
              Neg: Ee,
              Pos: xe,
              Compare: Zn,
              CompareOperand: an,
              CallExtension: De,
              CallExtensionAsync: Vn,
              printNodes: Ce
            };
          }),
          /* 4 */
          /***/
          (function(n, i) {
          }),
          /* 5 */
          /***/
          (function(n, i, r) {
            function s(I, b) {
              I.prototype = Object.create(b.prototype), I.prototype.constructor = I, o(I, b);
            }
            function o(I, b) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(d, h) {
                return d.__proto__ = h, d;
              }, o(I, b);
            }
            var a = r(8), A = r(17), g = r(3), c = r(0), u = c.TemplateError, C = r(2), y = C.Frame, w = r(1), l = w.Obj, f = {
              "==": "==",
              "===": "===",
              "!=": "!=",
              "!==": "!==",
              "<": "<",
              ">": ">",
              "<=": "<=",
              ">=": ">="
            }, p = /* @__PURE__ */ (function(I) {
              s(b, I);
              function b() {
                return I.apply(this, arguments) || this;
              }
              var d = b.prototype;
              return d.init = function(h, m) {
                this.templateName = h, this.codebuf = [], this.lastId = 0, this.buffer = null, this.bufferStack = [], this._scopeClosers = "", this.inBlock = !1, this.throwOnUndefined = m;
              }, d.fail = function(h, m, v) {
                throw m !== void 0 && (m += 1), v !== void 0 && (v += 1), new u(h, m, v);
              }, d._pushBuffer = function() {
                var h = this._tmpid();
                return this.bufferStack.push(this.buffer), this.buffer = h, this._emit("var " + this.buffer + ' = "";'), h;
              }, d._popBuffer = function() {
                this.buffer = this.bufferStack.pop();
              }, d._emit = function(h) {
                this.codebuf.push(h);
              }, d._emitLine = function(h) {
                this._emit(h + `
`);
              }, d._emitLines = function() {
                for (var h = this, m = arguments.length, v = new Array(m), E = 0; E < m; E++)
                  v[E] = arguments[E];
                v.forEach(function(M) {
                  return h._emitLine(M);
                });
              }, d._emitFuncBegin = function(h, m) {
                this.buffer = "output", this._scopeClosers = "", this._emitLine("function " + m + "(env, context, frame, runtime, cb) {"), this._emitLine("var lineno = " + h.lineno + ";"), this._emitLine("var colno = " + h.colno + ";"), this._emitLine("var " + this.buffer + ' = "";'), this._emitLine("try {");
              }, d._emitFuncEnd = function(h) {
                h || this._emitLine("cb(null, " + this.buffer + ");"), this._closeScopeLevels(), this._emitLine("} catch (e) {"), this._emitLine("  cb(runtime.handleError(e, lineno, colno));"), this._emitLine("}"), this._emitLine("}"), this.buffer = null;
              }, d._addScopeLevel = function() {
                this._scopeClosers += "})";
              }, d._closeScopeLevels = function() {
                this._emitLine(this._scopeClosers + ";"), this._scopeClosers = "";
              }, d._withScopedSyntax = function(h) {
                var m = this._scopeClosers;
                this._scopeClosers = "", h.call(this), this._closeScopeLevels(), this._scopeClosers = m;
              }, d._makeCallback = function(h) {
                var m = this._tmpid();
                return "function(" + m + (h ? "," + h : "") + `) {
if(` + m + ") { cb(" + m + "); return; }";
              }, d._tmpid = function() {
                return this.lastId++, "t_" + this.lastId;
              }, d._templateName = function() {
                return this.templateName == null ? "undefined" : JSON.stringify(this.templateName);
              }, d._compileChildren = function(h, m) {
                var v = this;
                h.children.forEach(function(E) {
                  v.compile(E, m);
                });
              }, d._compileAggregate = function(h, m, v, E) {
                var M = this;
                v && this._emit(v), h.children.forEach(function(x, S) {
                  S > 0 && M._emit(","), M.compile(x, m);
                }), E && this._emit(E);
              }, d._compileExpression = function(h, m) {
                this.assertType(h, g.Literal, g.Symbol, g.Group, g.Array, g.Dict, g.FunCall, g.Caller, g.Filter, g.LookupVal, g.Compare, g.InlineIf, g.In, g.Is, g.And, g.Or, g.Not, g.Add, g.Concat, g.Sub, g.Mul, g.Div, g.FloorDiv, g.Mod, g.Pow, g.Neg, g.Pos, g.Compare, g.NodeList), this.compile(h, m);
              }, d.assertType = function(h) {
                for (var m = arguments.length, v = new Array(m > 1 ? m - 1 : 0), E = 1; E < m; E++)
                  v[E - 1] = arguments[E];
                v.some(function(M) {
                  return h instanceof M;
                }) || this.fail("assertType: invalid type: " + h.typename, h.lineno, h.colno);
              }, d.compileCallExtension = function(h, m, v) {
                var E = this, M = h.args, x = h.contentArgs, S = typeof h.autoescape == "boolean" ? h.autoescape : !0;
                if (v || this._emit(this.buffer + " += runtime.suppressValue("), this._emit('env.getExtension("' + h.extName + '")["' + h.prop + '"]('), this._emit("context"), (M || x) && this._emit(","), M && (M instanceof g.NodeList || this.fail("compileCallExtension: arguments must be a NodeList, use `parser.parseSignature`"), M.children.forEach(function(P, D) {
                  E._compileExpression(P, m), (D !== M.children.length - 1 || x.length) && E._emit(",");
                })), x.length && x.forEach(function(P, D) {
                  if (D > 0 && E._emit(","), P) {
                    E._emitLine("function(cb) {"), E._emitLine("if(!cb) { cb = function(err) { if(err) { throw err; }}}");
                    var F = E._pushBuffer();
                    E._withScopedSyntax(function() {
                      E.compile(P, m), E._emitLine("cb(null, " + F + ");");
                    }), E._popBuffer(), E._emitLine("return " + F + ";"), E._emitLine("}");
                  } else
                    E._emit("null");
                }), v) {
                  var _ = this._tmpid();
                  this._emitLine(", " + this._makeCallback(_)), this._emitLine(this.buffer + " += runtime.suppressValue(" + _ + ", " + S + " && env.opts.autoescape);"), this._addScopeLevel();
                } else
                  this._emit(")"), this._emit(", " + S + ` && env.opts.autoescape);
`);
              }, d.compileCallExtensionAsync = function(h, m) {
                this.compileCallExtension(h, m, !0);
              }, d.compileNodeList = function(h, m) {
                this._compileChildren(h, m);
              }, d.compileLiteral = function(h) {
                if (typeof h.value == "string") {
                  var m = h.value.replace(/\\/g, "\\\\");
                  m = m.replace(/"/g, '\\"'), m = m.replace(/\n/g, "\\n"), m = m.replace(/\r/g, "\\r"), m = m.replace(/\t/g, "\\t"), m = m.replace(/\u2028/g, "\\u2028"), this._emit('"' + m + '"');
                } else h.value === null ? this._emit("null") : this._emit(h.value.toString());
              }, d.compileSymbol = function(h, m) {
                var v = h.value, E = m.lookup(v);
                E ? this._emit(E) : this._emit('runtime.contextOrFrameLookup(context, frame, "' + v + '")');
              }, d.compileGroup = function(h, m) {
                this._compileAggregate(h, m, "(", ")");
              }, d.compileArray = function(h, m) {
                this._compileAggregate(h, m, "[", "]");
              }, d.compileDict = function(h, m) {
                this._compileAggregate(h, m, "{", "}");
              }, d.compilePair = function(h, m) {
                var v = h.key, E = h.value;
                v instanceof g.Symbol ? v = new g.Literal(v.lineno, v.colno, v.value) : v instanceof g.Literal && typeof v.value == "string" || this.fail("compilePair: Dict keys must be strings or names", v.lineno, v.colno), this.compile(v, m), this._emit(": "), this._compileExpression(E, m);
              }, d.compileInlineIf = function(h, m) {
                this._emit("("), this.compile(h.cond, m), this._emit("?"), this.compile(h.body, m), this._emit(":"), h.else_ !== null ? this.compile(h.else_, m) : this._emit('""'), this._emit(")");
              }, d.compileIn = function(h, m) {
                this._emit("runtime.inOperator("), this.compile(h.left, m), this._emit(","), this.compile(h.right, m), this._emit(")");
              }, d.compileIs = function(h, m) {
                var v = h.right.name ? h.right.name.value : h.right.value;
                this._emit('env.getTest("' + v + '").call(context, '), this.compile(h.left, m), h.right.args && (this._emit(","), this.compile(h.right.args, m)), this._emit(") === true");
              }, d._binOpEmitter = function(h, m, v) {
                this.compile(h.left, m), this._emit(v), this.compile(h.right, m);
              }, d.compileOr = function(h, m) {
                return this._binOpEmitter(h, m, " || ");
              }, d.compileAnd = function(h, m) {
                return this._binOpEmitter(h, m, " && ");
              }, d.compileAdd = function(h, m) {
                return this._binOpEmitter(h, m, " + ");
              }, d.compileConcat = function(h, m) {
                return this._binOpEmitter(h, m, ' + "" + ');
              }, d.compileSub = function(h, m) {
                return this._binOpEmitter(h, m, " - ");
              }, d.compileMul = function(h, m) {
                return this._binOpEmitter(h, m, " * ");
              }, d.compileDiv = function(h, m) {
                return this._binOpEmitter(h, m, " / ");
              }, d.compileMod = function(h, m) {
                return this._binOpEmitter(h, m, " % ");
              }, d.compileNot = function(h, m) {
                this._emit("!"), this.compile(h.target, m);
              }, d.compileFloorDiv = function(h, m) {
                this._emit("Math.floor("), this.compile(h.left, m), this._emit(" / "), this.compile(h.right, m), this._emit(")");
              }, d.compilePow = function(h, m) {
                this._emit("Math.pow("), this.compile(h.left, m), this._emit(", "), this.compile(h.right, m), this._emit(")");
              }, d.compileNeg = function(h, m) {
                this._emit("-"), this.compile(h.target, m);
              }, d.compilePos = function(h, m) {
                this._emit("+"), this.compile(h.target, m);
              }, d.compileCompare = function(h, m) {
                var v = this;
                this.compile(h.expr, m), h.ops.forEach(function(E) {
                  v._emit(" " + f[E.type] + " "), v.compile(E.expr, m);
                });
              }, d.compileLookupVal = function(h, m) {
                this._emit("runtime.memberLookup(("), this._compileExpression(h.target, m), this._emit("),"), this._compileExpression(h.val, m), this._emit(")");
              }, d._getNodeName = function(h) {
                switch (h.typename) {
                  case "Symbol":
                    return h.value;
                  case "FunCall":
                    return "the return value of (" + this._getNodeName(h.name) + ")";
                  case "LookupVal":
                    return this._getNodeName(h.target) + '["' + this._getNodeName(h.val) + '"]';
                  case "Literal":
                    return h.value.toString();
                  default:
                    return "--expression--";
                }
              }, d.compileFunCall = function(h, m) {
                this._emit("(lineno = " + h.lineno + ", colno = " + h.colno + ", "), this._emit("runtime.callWrap("), this._compileExpression(h.name, m), this._emit(', "' + this._getNodeName(h.name).replace(/"/g, '\\"') + '", context, '), this._compileAggregate(h.args, m, "[", "])"), this._emit(")");
              }, d.compileFilter = function(h, m) {
                var v = h.name;
                this.assertType(v, g.Symbol), this._emit('env.getFilter("' + v.value + '").call(context, '), this._compileAggregate(h.args, m), this._emit(")");
              }, d.compileFilterAsync = function(h, m) {
                var v = h.name, E = h.symbol.value;
                this.assertType(v, g.Symbol), m.set(E, E), this._emit('env.getFilter("' + v.value + '").call(context, '), this._compileAggregate(h.args, m), this._emitLine(", " + this._makeCallback(E)), this._addScopeLevel();
              }, d.compileKeywordArgs = function(h, m) {
                this._emit("runtime.makeKeywordArgs("), this.compileDict(h, m), this._emit(")");
              }, d.compileSet = function(h, m) {
                var v = this, E = [];
                h.targets.forEach(function(M) {
                  var x = M.value, S = m.lookup(x);
                  S == null && (S = v._tmpid(), v._emitLine("var " + S + ";")), E.push(S);
                }), h.value ? (this._emit(E.join(" = ") + " = "), this._compileExpression(h.value, m), this._emitLine(";")) : (this._emit(E.join(" = ") + " = "), this.compile(h.body, m), this._emitLine(";")), h.targets.forEach(function(M, x) {
                  var S = E[x], _ = M.value;
                  v._emitLine('frame.set("' + _ + '", ' + S + ", true);"), v._emitLine("if(frame.topLevel) {"), v._emitLine('context.setVariable("' + _ + '", ' + S + ");"), v._emitLine("}"), _.charAt(0) !== "_" && (v._emitLine("if(frame.topLevel) {"), v._emitLine('context.addExport("' + _ + '", ' + S + ");"), v._emitLine("}"));
                });
              }, d.compileSwitch = function(h, m) {
                var v = this;
                this._emit("switch ("), this.compile(h.expr, m), this._emit(") {"), h.cases.forEach(function(E, M) {
                  v._emit("case "), v.compile(E.cond, m), v._emit(": "), v.compile(E.body, m), E.body.children.length && v._emitLine("break;");
                }), h.default && (this._emit("default:"), this.compile(h.default, m)), this._emit("}");
              }, d.compileIf = function(h, m, v) {
                var E = this;
                this._emit("if("), this._compileExpression(h.cond, m), this._emitLine(") {"), this._withScopedSyntax(function() {
                  E.compile(h.body, m), v && E._emit("cb()");
                }), h.else_ ? (this._emitLine(`}
else {`), this._withScopedSyntax(function() {
                  E.compile(h.else_, m), v && E._emit("cb()");
                })) : v && (this._emitLine(`}
else {`), this._emit("cb()")), this._emitLine("}");
              }, d.compileIfAsync = function(h, m) {
                this._emit("(function(cb) {"), this.compileIf(h, m, !0), this._emit("})(" + this._makeCallback()), this._addScopeLevel();
              }, d._emitLoopBindings = function(h, m, v, E) {
                var M = this, x = [{
                  name: "index",
                  val: v + " + 1"
                }, {
                  name: "index0",
                  val: v
                }, {
                  name: "revindex",
                  val: E + " - " + v
                }, {
                  name: "revindex0",
                  val: E + " - " + v + " - 1"
                }, {
                  name: "first",
                  val: v + " === 0"
                }, {
                  name: "last",
                  val: v + " === " + E + " - 1"
                }, {
                  name: "length",
                  val: E
                }];
                x.forEach(function(S) {
                  M._emitLine('frame.set("loop.' + S.name + '", ' + S.val + ");");
                });
              }, d.compileFor = function(h, m) {
                var v = this, E = this._tmpid(), M = this._tmpid(), x = this._tmpid();
                if (m = m.push(), this._emitLine("frame = frame.push();"), this._emit("var " + x + " = "), this._compileExpression(h.arr, m), this._emitLine(";"), this._emit("if(" + x + ") {"), this._emitLine(x + " = runtime.fromIterator(" + x + ");"), h.name instanceof g.Array) {
                  this._emitLine("var " + E + ";"), this._emitLine("if(runtime.isArray(" + x + ")) {"), this._emitLine("var " + M + " = " + x + ".length;"), this._emitLine("for(" + E + "=0; " + E + " < " + x + ".length; " + E + "++) {"), h.name.children.forEach(function(R, B) {
                    var k = v._tmpid();
                    v._emitLine("var " + k + " = " + x + "[" + E + "][" + B + "];"), v._emitLine('frame.set("' + R + '", ' + x + "[" + E + "][" + B + "]);"), m.set(h.name.children[B].value, k);
                  }), this._emitLoopBindings(h, x, E, M), this._withScopedSyntax(function() {
                    v.compile(h.body, m);
                  }), this._emitLine("}"), this._emitLine("} else {");
                  var S = h.name.children, _ = S[0], P = S[1], D = this._tmpid(), F = this._tmpid();
                  m.set(_.value, D), m.set(P.value, F), this._emitLine(E + " = -1;"), this._emitLine("var " + M + " = runtime.keys(" + x + ").length;"), this._emitLine("for(var " + D + " in " + x + ") {"), this._emitLine(E + "++;"), this._emitLine("var " + F + " = " + x + "[" + D + "];"), this._emitLine('frame.set("' + _.value + '", ' + D + ");"), this._emitLine('frame.set("' + P.value + '", ' + F + ");"), this._emitLoopBindings(h, x, E, M), this._withScopedSyntax(function() {
                    v.compile(h.body, m);
                  }), this._emitLine("}"), this._emitLine("}");
                } else {
                  var N = this._tmpid();
                  m.set(h.name.value, N), this._emitLine("var " + M + " = " + x + ".length;"), this._emitLine("for(var " + E + "=0; " + E + " < " + x + ".length; " + E + "++) {"), this._emitLine("var " + N + " = " + x + "[" + E + "];"), this._emitLine('frame.set("' + h.name.value + '", ' + N + ");"), this._emitLoopBindings(h, x, E, M), this._withScopedSyntax(function() {
                    v.compile(h.body, m);
                  }), this._emitLine("}");
                }
                this._emitLine("}"), h.else_ && (this._emitLine("if (!" + M + ") {"), this.compile(h.else_, m), this._emitLine("}")), this._emitLine("frame = frame.pop();");
              }, d._compileAsyncLoop = function(h, m, v) {
                var E = this, M = this._tmpid(), x = this._tmpid(), S = this._tmpid(), _ = v ? "asyncAll" : "asyncEach";
                if (m = m.push(), this._emitLine("frame = frame.push();"), this._emit("var " + S + " = runtime.fromIterator("), this._compileExpression(h.arr, m), this._emitLine(");"), h.name instanceof g.Array) {
                  var P = h.name.children.length;
                  this._emit("runtime." + _ + "(" + S + ", " + P + ", function("), h.name.children.forEach(function(N) {
                    E._emit(N.value + ",");
                  }), this._emit(M + "," + x + ",next) {"), h.name.children.forEach(function(N) {
                    var R = N.value;
                    m.set(R, R), E._emitLine('frame.set("' + R + '", ' + R + ");");
                  });
                } else {
                  var D = h.name.value;
                  this._emitLine("runtime." + _ + "(" + S + ", 1, function(" + D + ", " + M + ", " + x + ",next) {"), this._emitLine('frame.set("' + D + '", ' + D + ");"), m.set(D, D);
                }
                this._emitLoopBindings(h, S, M, x), this._withScopedSyntax(function() {
                  var N;
                  v && (N = E._pushBuffer()), E.compile(h.body, m), E._emitLine("next(" + M + (N ? "," + N : "") + ");"), v && E._popBuffer();
                });
                var F = this._tmpid();
                this._emitLine("}, " + this._makeCallback(F)), this._addScopeLevel(), v && this._emitLine(this.buffer + " += " + F + ";"), h.else_ && (this._emitLine("if (!" + S + ".length) {"), this.compile(h.else_, m), this._emitLine("}")), this._emitLine("frame = frame.pop();");
              }, d.compileAsyncEach = function(h, m) {
                this._compileAsyncLoop(h, m);
              }, d.compileAsyncAll = function(h, m) {
                this._compileAsyncLoop(h, m, !0);
              }, d._compileMacro = function(h, m) {
                var v = this, E = [], M = null, x = "macro_" + this._tmpid(), S = m !== void 0;
                h.args.children.forEach(function(R, B) {
                  B === h.args.children.length - 1 && R instanceof g.Dict ? M = R : (v.assertType(R, g.Symbol), E.push(R));
                });
                var _ = [].concat(E.map(function(R) {
                  return "l_" + R.value;
                }), ["kwargs"]), P = E.map(function(R) {
                  return '"' + R.value + '"';
                }), D = (M && M.children || []).map(function(R) {
                  return '"' + R.key.value + '"';
                }), F;
                S ? F = m.push(!0) : F = new y(), this._emitLines("var " + x + " = runtime.makeMacro(", "[" + P.join(", ") + "], ", "[" + D.join(", ") + "], ", "function (" + _.join(", ") + ") {", "var callerFrame = frame;", "frame = " + (S ? "frame.push(true);" : "new runtime.Frame();"), "kwargs = kwargs || {};", 'if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {', 'frame.set("caller", kwargs.caller); }'), E.forEach(function(R) {
                  v._emitLine('frame.set("' + R.value + '", l_' + R.value + ");"), F.set(R.value, "l_" + R.value);
                }), M && M.children.forEach(function(R) {
                  var B = R.key.value;
                  v._emit('frame.set("' + B + '", '), v._emit('Object.prototype.hasOwnProperty.call(kwargs, "' + B + '")'), v._emit(' ? kwargs["' + B + '"] : '), v._compileExpression(R.value, F), v._emit(");");
                });
                var N = this._pushBuffer();
                return this._withScopedSyntax(function() {
                  v.compile(h.body, F);
                }), this._emitLine("frame = " + (S ? "frame.pop();" : "callerFrame;")), this._emitLine("return new runtime.SafeString(" + N + ");"), this._emitLine("});"), this._popBuffer(), x;
              }, d.compileMacro = function(h, m) {
                var v = this._compileMacro(h), E = h.name.value;
                m.set(E, v), m.parent ? this._emitLine('frame.set("' + E + '", ' + v + ");") : (h.name.value.charAt(0) !== "_" && this._emitLine('context.addExport("' + E + '");'), this._emitLine('context.setVariable("' + E + '", ' + v + ");"));
              }, d.compileCaller = function(h, m) {
                this._emit("(function (){");
                var v = this._compileMacro(h, m);
                this._emit("return " + v + ";})()");
              }, d._compileGetTemplate = function(h, m, v, E) {
                var M = this._tmpid(), x = this._templateName(), S = this._makeCallback(M), _ = v ? "true" : "false", P = E ? "true" : "false";
                return this._emit("env.getTemplate("), this._compileExpression(h.template, m), this._emitLine(", " + _ + ", " + x + ", " + P + ", " + S), M;
              }, d.compileImport = function(h, m) {
                var v = h.target.value, E = this._compileGetTemplate(h, m, !1, !1);
                this._addScopeLevel(), this._emitLine(E + ".getExported(" + (h.withContext ? "context.getVariables(), frame, " : "") + this._makeCallback(E)), this._addScopeLevel(), m.set(v, E), m.parent ? this._emitLine('frame.set("' + v + '", ' + E + ");") : this._emitLine('context.setVariable("' + v + '", ' + E + ");");
              }, d.compileFromImport = function(h, m) {
                var v = this, E = this._compileGetTemplate(h, m, !1, !1);
                this._addScopeLevel(), this._emitLine(E + ".getExported(" + (h.withContext ? "context.getVariables(), frame, " : "") + this._makeCallback(E)), this._addScopeLevel(), h.names.children.forEach(function(M) {
                  var x, S, _ = v._tmpid();
                  M instanceof g.Pair ? (x = M.key.value, S = M.value.value) : (x = M.value, S = x), v._emitLine("if(Object.prototype.hasOwnProperty.call(" + E + ', "' + x + '")) {'), v._emitLine("var " + _ + " = " + E + "." + x + ";"), v._emitLine("} else {"), v._emitLine(`cb(new Error("cannot import '` + x + `'")); return;`), v._emitLine("}"), m.set(S, _), m.parent ? v._emitLine('frame.set("' + S + '", ' + _ + ");") : v._emitLine('context.setVariable("' + S + '", ' + _ + ");");
                });
              }, d.compileBlock = function(h) {
                var m = this._tmpid();
                this.inBlock || this._emit('(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : '), this._emit('context.getBlock("' + h.name.value + '")'), this.inBlock || this._emit(")"), this._emitLine("(env, context, frame, runtime, " + this._makeCallback(m)), this._emitLine(this.buffer + " += " + m + ";"), this._addScopeLevel();
              }, d.compileSuper = function(h, m) {
                var v = h.blockName.value, E = h.symbol.value, M = this._makeCallback(E);
                this._emitLine('context.getSuper(env, "' + v + '", b_' + v + ", frame, runtime, " + M), this._emitLine(E + " = runtime.markSafe(" + E + ");"), this._addScopeLevel(), m.set(E, E);
              }, d.compileExtends = function(h, m) {
                var v = this._tmpid(), E = this._compileGetTemplate(h, m, !0, !1);
                this._emitLine("parentTemplate = " + E), this._emitLine("for(var " + v + " in parentTemplate.blocks) {"), this._emitLine("context.addBlock(" + v + ", parentTemplate.blocks[" + v + "]);"), this._emitLine("}"), this._addScopeLevel();
              }, d.compileInclude = function(h, m) {
                this._emitLine("var tasks = [];"), this._emitLine("tasks.push("), this._emitLine("function(callback) {");
                var v = this._compileGetTemplate(h, m, !1, h.ignoreMissing);
                this._emitLine("callback(null," + v + ");});"), this._emitLine("});");
                var E = this._tmpid();
                this._emitLine("tasks.push("), this._emitLine("function(template, callback){"), this._emitLine("template.render(context.getVariables(), frame, " + this._makeCallback(E)), this._emitLine("callback(null," + E + ");});"), this._emitLine("});"), this._emitLine("tasks.push("), this._emitLine("function(result, callback){"), this._emitLine(this.buffer + " += result;"), this._emitLine("callback(null);"), this._emitLine("});"), this._emitLine("env.waterfall(tasks, function(){"), this._addScopeLevel();
              }, d.compileTemplateData = function(h, m) {
                this.compileLiteral(h, m);
              }, d.compileCapture = function(h, m) {
                var v = this, E = this.buffer;
                this.buffer = "output", this._emitLine("(function() {"), this._emitLine('var output = "";'), this._withScopedSyntax(function() {
                  v.compile(h.body, m);
                }), this._emitLine("return output;"), this._emitLine("})()"), this.buffer = E;
              }, d.compileOutput = function(h, m) {
                var v = this, E = h.children;
                E.forEach(function(M) {
                  M instanceof g.TemplateData ? M.value && (v._emit(v.buffer + " += "), v.compileLiteral(M, m), v._emitLine(";")) : (v._emit(v.buffer + " += runtime.suppressValue("), v.throwOnUndefined && v._emit("runtime.ensureDefined("), v.compile(M, m), v.throwOnUndefined && v._emit("," + h.lineno + "," + h.colno + ")"), v._emit(`, env.opts.autoescape);
`));
                });
              }, d.compileRoot = function(h, m) {
                var v = this;
                m && this.fail("compileRoot: root node can't have frame"), m = new y(), this._emitFuncBegin(h, "root"), this._emitLine("var parentTemplate = null;"), this._compileChildren(h, m), this._emitLine("if(parentTemplate) {"), this._emitLine("parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);"), this._emitLine("} else {"), this._emitLine("cb(null, " + this.buffer + ");"), this._emitLine("}"), this._emitFuncEnd(!0), this.inBlock = !0;
                var E = [], M = h.findAll(g.Block);
                M.forEach(function(x, S) {
                  var _ = x.name.value;
                  if (E.indexOf(_) !== -1)
                    throw new Error('Block "' + _ + '" defined more than once.');
                  E.push(_), v._emitFuncBegin(x, "b_" + _);
                  var P = new y();
                  v._emitLine("var frame = frame.push(true);"), v.compile(x.body, P), v._emitFuncEnd();
                }), this._emitLine("return {"), M.forEach(function(x, S) {
                  var _ = "b_" + x.name.value;
                  v._emitLine(_ + ": " + _ + ",");
                }), this._emitLine(`root: root
};`);
              }, d.compile = function(h, m) {
                var v = this["compile" + h.typename];
                v ? v.call(this, h, m) : this.fail("compile: Cannot compile node: " + h.typename, h.lineno, h.colno);
              }, d.getCode = function() {
                return this.codebuf.join("");
              }, b;
            })(l);
            n.exports = {
              compile: function(I, b, d, h, m) {
                m === void 0 && (m = {});
                var v = new p(h, m.throwOnUndefined), E = (d || []).map(function(x) {
                  return x.preprocess;
                }).filter(function(x) {
                  return !!x;
                }), M = E.reduce(function(x, S) {
                  return S(x);
                }, I);
                return v.compile(A.transform(a.parse(M, d, m), b, h)), v.getCode();
              },
              Compiler: p
            };
          }),
          /* 6 */
          /***/
          (function(n, i, r) {
            function s(c, u) {
              c.prototype = Object.create(u.prototype), c.prototype.constructor = c, o(c, u);
            }
            function o(c, u) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(C, y) {
                return C.__proto__ = y, C;
              }, o(c, u);
            }
            var a = r(4), A = r(1), g = A.EmitterObj;
            n.exports = /* @__PURE__ */ (function(c) {
              s(u, c);
              function u() {
                return c.apply(this, arguments) || this;
              }
              var C = u.prototype;
              return C.resolve = function(y, w) {
                return a.resolve(a.dirname(y), w);
              }, C.isRelative = function(y) {
                return y.indexOf("./") === 0 || y.indexOf("../") === 0;
              }, u;
            })(g);
          }),
          /* 7 */
          /***/
          (function(n, i, r) {
            function s(D, F) {
              D.prototype = Object.create(F.prototype), D.prototype.constructor = D, o(D, F);
            }
            function o(D, F) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(N, R) {
                return N.__proto__ = R, N;
              }, o(D, F);
            }
            var a = r(12), A = r(15), g = r(0), c = r(5), u = r(18), C = r(10), y = C.FileSystemLoader, w = C.WebLoader, l = C.PrecompiledLoader, f = r(20), p = r(21), I = r(1), b = I.Obj, d = I.EmitterObj, h = r(2), m = h.handleError, v = h.Frame, E = r(22);
            function M(D, F, N) {
              a(function() {
                D(F, N);
              });
            }
            var x = {
              type: "code",
              obj: {
                root: function(D, F, N, R, B) {
                  try {
                    B(null, "");
                  } catch (k) {
                    B(m(k, null, null));
                  }
                }
              }
            }, S = /* @__PURE__ */ (function(D) {
              s(F, D);
              function F() {
                return D.apply(this, arguments) || this;
              }
              var N = F.prototype;
              return N.init = function(R, B) {
                var k = this;
                B = this.opts = B || {}, this.opts.dev = !!B.dev, this.opts.autoescape = B.autoescape != null ? B.autoescape : !0, this.opts.throwOnUndefined = !!B.throwOnUndefined, this.opts.trimBlocks = !!B.trimBlocks, this.opts.lstripBlocks = !!B.lstripBlocks, this.loaders = [], R ? this.loaders = g.isArray(R) ? R : [R] : y ? this.loaders = [new y("views")] : w && (this.loaders = [new w("/views")]), typeof window < "u" && window.nunjucksPrecompiled && this.loaders.unshift(new l(window.nunjucksPrecompiled)), this._initLoaders(), this.globals = p(), this.filters = {}, this.tests = {}, this.asyncFilters = [], this.extensions = {}, this.extensionsList = [], g._entries(u).forEach(function(j) {
                  var z = j[0], U = j[1];
                  return k.addFilter(z, U);
                }), g._entries(f).forEach(function(j) {
                  var z = j[0], U = j[1];
                  return k.addTest(z, U);
                });
              }, N._initLoaders = function() {
                var R = this;
                this.loaders.forEach(function(B) {
                  B.cache = {}, typeof B.on == "function" && (B.on("update", function(k, j) {
                    B.cache[k] = null, R.emit("update", k, j, B);
                  }), B.on("load", function(k, j) {
                    R.emit("load", k, j, B);
                  }));
                });
              }, N.invalidateCache = function() {
                this.loaders.forEach(function(R) {
                  R.cache = {};
                });
              }, N.addExtension = function(R, B) {
                return B.__name = R, this.extensions[R] = B, this.extensionsList.push(B), this;
              }, N.removeExtension = function(R) {
                var B = this.getExtension(R);
                B && (this.extensionsList = g.without(this.extensionsList, B), delete this.extensions[R]);
              }, N.getExtension = function(R) {
                return this.extensions[R];
              }, N.hasExtension = function(R) {
                return !!this.extensions[R];
              }, N.addGlobal = function(R, B) {
                return this.globals[R] = B, this;
              }, N.getGlobal = function(R) {
                if (typeof this.globals[R] > "u")
                  throw new Error("global not found: " + R);
                return this.globals[R];
              }, N.addFilter = function(R, B, k) {
                var j = B;
                return k && this.asyncFilters.push(R), this.filters[R] = j, this;
              }, N.getFilter = function(R) {
                if (!this.filters[R])
                  throw new Error("filter not found: " + R);
                return this.filters[R];
              }, N.addTest = function(R, B) {
                return this.tests[R] = B, this;
              }, N.getTest = function(R) {
                if (!this.tests[R])
                  throw new Error("test not found: " + R);
                return this.tests[R];
              }, N.resolveTemplate = function(R, B, k) {
                var j = R.isRelative && B ? R.isRelative(k) : !1;
                return j && R.resolve ? R.resolve(B, k) : k;
              }, N.getTemplate = function(R, B, k, j, z) {
                var U = this, J = this, tt = null;
                if (R && R.raw && (R = R.raw), g.isFunction(k) && (z = k, k = null, B = B || !1), g.isFunction(B) && (z = B, B = !1), R instanceof P)
                  tt = R;
                else {
                  if (typeof R != "string")
                    throw new Error("template names must be a string: " + R);
                  for (var W = 0; W < this.loaders.length; W++) {
                    var $ = this.loaders[W];
                    if (tt = $.cache[this.resolveTemplate($, k, R)], tt)
                      break;
                  }
                }
                if (tt)
                  if (B && tt.compile(), z) {
                    z(null, tt);
                    return;
                  } else
                    return tt;
                var ot, et = function(Y, q) {
                  if (!q && !Y && !j && (Y = new Error("template not found: " + R)), Y)
                    if (z) {
                      z(Y);
                      return;
                    } else
                      throw Y;
                  var K;
                  q ? (K = new P(q.src, U, q.path, B), q.noCache || (q.loader.cache[R] = K)) : K = new P(x, U, "", B), z ? z(null, K) : ot = K;
                };
                return g.asyncIter(this.loaders, function(Y, q, K, ct) {
                  function yt(wt, ht) {
                    wt ? ct(wt) : ht ? (ht.loader = Y, ct(null, ht)) : K();
                  }
                  R = J.resolveTemplate(Y, k, R), Y.async ? Y.getSource(R, yt) : yt(null, Y.getSource(R));
                }, et), ot;
              }, N.express = function(R) {
                return E(this, R);
              }, N.render = function(R, B, k) {
                g.isFunction(B) && (k = B, B = null);
                var j = null;
                return this.getTemplate(R, function(z, U) {
                  if (z && k)
                    M(k, z);
                  else {
                    if (z)
                      throw z;
                    j = U.render(B, k);
                  }
                }), j;
              }, N.renderString = function(R, B, k, j) {
                g.isFunction(k) && (j = k, k = {}), k = k || {};
                var z = new P(R, this, k.path);
                return z.render(B, j);
              }, N.waterfall = function(R, B, k) {
                return A(R, B, k);
              }, F;
            })(d), _ = /* @__PURE__ */ (function(D) {
              s(F, D);
              function F() {
                return D.apply(this, arguments) || this;
              }
              var N = F.prototype;
              return N.init = function(R, B, k) {
                var j = this;
                this.env = k || new S(), this.ctx = g.extend({}, R), this.blocks = {}, this.exported = [], g.keys(B).forEach(function(z) {
                  j.addBlock(z, B[z]);
                });
              }, N.lookup = function(R) {
                return R in this.env.globals && !(R in this.ctx) ? this.env.globals[R] : this.ctx[R];
              }, N.setVariable = function(R, B) {
                this.ctx[R] = B;
              }, N.getVariables = function() {
                return this.ctx;
              }, N.addBlock = function(R, B) {
                return this.blocks[R] = this.blocks[R] || [], this.blocks[R].push(B), this;
              }, N.getBlock = function(R) {
                if (!this.blocks[R])
                  throw new Error('unknown block "' + R + '"');
                return this.blocks[R][0];
              }, N.getSuper = function(R, B, k, j, z, U) {
                var J = g.indexOf(this.blocks[B] || [], k), tt = this.blocks[B][J + 1], W = this;
                if (J === -1 || !tt)
                  throw new Error('no super block available for "' + B + '"');
                tt(R, W, j, z, U);
              }, N.addExport = function(R) {
                this.exported.push(R);
              }, N.getExported = function() {
                var R = this, B = {};
                return this.exported.forEach(function(k) {
                  B[k] = R.ctx[k];
                }), B;
              }, F;
            })(b), P = /* @__PURE__ */ (function(D) {
              s(F, D);
              function F() {
                return D.apply(this, arguments) || this;
              }
              var N = F.prototype;
              return N.init = function(R, B, k, j) {
                if (this.env = B || new S(), g.isObject(R))
                  switch (R.type) {
                    case "code":
                      this.tmplProps = R.obj;
                      break;
                    case "string":
                      this.tmplStr = R.obj;
                      break;
                    default:
                      throw new Error("Unexpected template object type " + R.type + "; expected 'code', or 'string'");
                  }
                else if (g.isString(R))
                  this.tmplStr = R;
                else
                  throw new Error("src must be a string or an object describing the source");
                if (this.path = k, j)
                  try {
                    this._compile();
                  } catch (z) {
                    throw g._prettifyError(this.path, this.env.opts.dev, z);
                  }
                else
                  this.compiled = !1;
              }, N.render = function(R, B, k) {
                var j = this;
                typeof R == "function" ? (k = R, R = {}) : typeof B == "function" && (k = B, B = null);
                var z = !B;
                try {
                  this.compile();
                } catch (ot) {
                  var U = g._prettifyError(this.path, this.env.opts.dev, ot);
                  if (k)
                    return M(k, U);
                  throw U;
                }
                var J = new _(R || {}, this.blocks, this.env), tt = B ? B.push(!0) : new v();
                tt.topLevel = !0;
                var W = null, $ = !1;
                return this.rootRenderFunc(this.env, J, tt, h, function(ot, et) {
                  if (!($ && k && typeof et < "u"))
                    if (ot && (ot = g._prettifyError(j.path, j.env.opts.dev, ot), $ = !0), k)
                      z ? M(k, ot, et) : k(ot, et);
                    else {
                      if (ot)
                        throw ot;
                      W = et;
                    }
                }), W;
              }, N.getExported = function(R, B, k) {
                typeof R == "function" && (k = R, R = {}), typeof B == "function" && (k = B, B = null);
                try {
                  this.compile();
                } catch (U) {
                  if (k)
                    return k(U);
                  throw U;
                }
                var j = B ? B.push() : new v();
                j.topLevel = !0;
                var z = new _(R || {}, this.blocks, this.env);
                this.rootRenderFunc(this.env, z, j, h, function(U) {
                  U ? k(U, null) : k(null, z.getExported());
                });
              }, N.compile = function() {
                this.compiled || this._compile();
              }, N._compile = function() {
                var R;
                if (this.tmplProps)
                  R = this.tmplProps;
                else {
                  var B = c.compile(this.tmplStr, this.env.asyncFilters, this.env.extensionsList, this.path, this.env.opts), k = new Function(B);
                  R = k();
                }
                this.blocks = this._getBlocks(R), this.rootRenderFunc = R.root, this.compiled = !0;
              }, N._getBlocks = function(R) {
                var B = {};
                return g.keys(R).forEach(function(k) {
                  k.slice(0, 2) === "b_" && (B[k.slice(2)] = R[k]);
                }), B;
              }, F;
            })(b);
            n.exports = {
              Environment: S,
              Template: P
            };
          }),
          /* 8 */
          /***/
          (function(n, i, r) {
            function s(C, y) {
              C.prototype = Object.create(y.prototype), C.prototype.constructor = C, o(C, y);
            }
            function o(C, y) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(w, l) {
                return w.__proto__ = l, w;
              }, o(C, y);
            }
            var a = r(9), A = r(3), g = r(1).Obj, c = r(0), u = /* @__PURE__ */ (function(C) {
              s(y, C);
              function y() {
                return C.apply(this, arguments) || this;
              }
              var w = y.prototype;
              return w.init = function(l) {
                this.tokens = l, this.peeked = null, this.breakOnBlocks = null, this.dropLeadingWhitespace = !1, this.extensions = [];
              }, w.nextToken = function(l) {
                var f;
                if (this.peeked)
                  if (!l && this.peeked.type === a.TOKEN_WHITESPACE)
                    this.peeked = null;
                  else
                    return f = this.peeked, this.peeked = null, f;
                if (f = this.tokens.nextToken(), !l)
                  for (; f && f.type === a.TOKEN_WHITESPACE; )
                    f = this.tokens.nextToken();
                return f;
              }, w.peekToken = function() {
                return this.peeked = this.peeked || this.nextToken(), this.peeked;
              }, w.pushToken = function(l) {
                if (this.peeked)
                  throw new Error("pushToken: can only push one token on between reads");
                this.peeked = l;
              }, w.error = function(l, f, p) {
                if (f === void 0 || p === void 0) {
                  var I = this.peekToken() || {};
                  f = I.lineno, p = I.colno;
                }
                return f !== void 0 && (f += 1), p !== void 0 && (p += 1), new c.TemplateError(l, f, p);
              }, w.fail = function(l, f, p) {
                throw this.error(l, f, p);
              }, w.skip = function(l) {
                var f = this.nextToken();
                return !f || f.type !== l ? (this.pushToken(f), !1) : !0;
              }, w.expect = function(l) {
                var f = this.nextToken();
                return f.type !== l && this.fail("expected " + l + ", got " + f.type, f.lineno, f.colno), f;
              }, w.skipValue = function(l, f) {
                var p = this.nextToken();
                return !p || p.type !== l || p.value !== f ? (this.pushToken(p), !1) : !0;
              }, w.skipSymbol = function(l) {
                return this.skipValue(a.TOKEN_SYMBOL, l);
              }, w.advanceAfterBlockEnd = function(l) {
                var f;
                return l || (f = this.peekToken(), f || this.fail("unexpected end of file"), f.type !== a.TOKEN_SYMBOL && this.fail("advanceAfterBlockEnd: expected symbol token or explicit name to be passed"), l = this.nextToken().value), f = this.nextToken(), f && f.type === a.TOKEN_BLOCK_END ? f.value.charAt(0) === "-" && (this.dropLeadingWhitespace = !0) : this.fail("expected block end in " + l + " statement"), f;
              }, w.advanceAfterVariableEnd = function() {
                var l = this.nextToken();
                l && l.type === a.TOKEN_VARIABLE_END ? this.dropLeadingWhitespace = l.value.charAt(l.value.length - this.tokens.tags.VARIABLE_END.length - 1) === "-" : (this.pushToken(l), this.fail("expected variable end"));
              }, w.parseFor = function() {
                var l = this.peekToken(), f, p;
                this.skipSymbol("for") ? (f = new A.For(l.lineno, l.colno), p = "endfor") : this.skipSymbol("asyncEach") ? (f = new A.AsyncEach(l.lineno, l.colno), p = "endeach") : this.skipSymbol("asyncAll") ? (f = new A.AsyncAll(l.lineno, l.colno), p = "endall") : this.fail("parseFor: expected for{Async}", l.lineno, l.colno), f.name = this.parsePrimary(), f.name instanceof A.Symbol || this.fail("parseFor: variable name expected for loop");
                var I = this.peekToken().type;
                if (I === a.TOKEN_COMMA) {
                  var b = f.name;
                  for (f.name = new A.Array(b.lineno, b.colno), f.name.addChild(b); this.skip(a.TOKEN_COMMA); ) {
                    var d = this.parsePrimary();
                    f.name.addChild(d);
                  }
                }
                return this.skipSymbol("in") || this.fail('parseFor: expected "in" keyword for loop', l.lineno, l.colno), f.arr = this.parseExpression(), this.advanceAfterBlockEnd(l.value), f.body = this.parseUntilBlocks(p, "else"), this.skipSymbol("else") && (this.advanceAfterBlockEnd("else"), f.else_ = this.parseUntilBlocks(p)), this.advanceAfterBlockEnd(), f;
              }, w.parseMacro = function() {
                var l = this.peekToken();
                this.skipSymbol("macro") || this.fail("expected macro");
                var f = this.parsePrimary(!0), p = this.parseSignature(), I = new A.Macro(l.lineno, l.colno, f, p);
                return this.advanceAfterBlockEnd(l.value), I.body = this.parseUntilBlocks("endmacro"), this.advanceAfterBlockEnd(), I;
              }, w.parseCall = function() {
                var l = this.peekToken();
                this.skipSymbol("call") || this.fail("expected call");
                var f = this.parseSignature(!0) || new A.NodeList(), p = this.parsePrimary();
                this.advanceAfterBlockEnd(l.value);
                var I = this.parseUntilBlocks("endcall");
                this.advanceAfterBlockEnd();
                var b = new A.Symbol(l.lineno, l.colno, "caller"), d = new A.Caller(l.lineno, l.colno, b, f, I), h = p.args.children;
                h[h.length - 1] instanceof A.KeywordArgs || h.push(new A.KeywordArgs());
                var m = h[h.length - 1];
                return m.addChild(new A.Pair(l.lineno, l.colno, b, d)), new A.Output(l.lineno, l.colno, [p]);
              }, w.parseWithContext = function() {
                var l = this.peekToken(), f = null;
                return this.skipSymbol("with") ? f = !0 : this.skipSymbol("without") && (f = !1), f !== null && (this.skipSymbol("context") || this.fail("parseFrom: expected context after with/without", l.lineno, l.colno)), f;
              }, w.parseImport = function() {
                var l = this.peekToken();
                this.skipSymbol("import") || this.fail("parseImport: expected import", l.lineno, l.colno);
                var f = this.parseExpression();
                this.skipSymbol("as") || this.fail('parseImport: expected "as" keyword', l.lineno, l.colno);
                var p = this.parseExpression(), I = this.parseWithContext(), b = new A.Import(l.lineno, l.colno, f, p, I);
                return this.advanceAfterBlockEnd(l.value), b;
              }, w.parseFrom = function() {
                var l = this.peekToken();
                this.skipSymbol("from") || this.fail("parseFrom: expected from");
                var f = this.parseExpression();
                this.skipSymbol("import") || this.fail("parseFrom: expected import", l.lineno, l.colno);
                for (var p = new A.NodeList(), I; ; ) {
                  var b = this.peekToken();
                  if (b.type === a.TOKEN_BLOCK_END) {
                    p.children.length || this.fail("parseFrom: Expected at least one import name", l.lineno, l.colno), b.value.charAt(0) === "-" && (this.dropLeadingWhitespace = !0), this.nextToken();
                    break;
                  }
                  p.children.length > 0 && !this.skip(a.TOKEN_COMMA) && this.fail("parseFrom: expected comma", l.lineno, l.colno);
                  var d = this.parsePrimary();
                  if (d.value.charAt(0) === "_" && this.fail("parseFrom: names starting with an underscore cannot be imported", d.lineno, d.colno), this.skipSymbol("as")) {
                    var h = this.parsePrimary();
                    p.addChild(new A.Pair(d.lineno, d.colno, d, h));
                  } else
                    p.addChild(d);
                  I = this.parseWithContext();
                }
                return new A.FromImport(l.lineno, l.colno, f, p, I);
              }, w.parseBlock = function() {
                var l = this.peekToken();
                this.skipSymbol("block") || this.fail("parseBlock: expected block", l.lineno, l.colno);
                var f = new A.Block(l.lineno, l.colno);
                f.name = this.parsePrimary(), f.name instanceof A.Symbol || this.fail("parseBlock: variable name expected", l.lineno, l.colno), this.advanceAfterBlockEnd(l.value), f.body = this.parseUntilBlocks("endblock"), this.skipSymbol("endblock"), this.skipSymbol(f.name.value);
                var p = this.peekToken();
                return p || this.fail("parseBlock: expected endblock, got end of file"), this.advanceAfterBlockEnd(p.value), f;
              }, w.parseExtends = function() {
                var l = "extends", f = this.peekToken();
                this.skipSymbol(l) || this.fail("parseTemplateRef: expected " + l);
                var p = new A.Extends(f.lineno, f.colno);
                return p.template = this.parseExpression(), this.advanceAfterBlockEnd(f.value), p;
              }, w.parseInclude = function() {
                var l = "include", f = this.peekToken();
                this.skipSymbol(l) || this.fail("parseInclude: expected " + l);
                var p = new A.Include(f.lineno, f.colno);
                return p.template = this.parseExpression(), this.skipSymbol("ignore") && this.skipSymbol("missing") && (p.ignoreMissing = !0), this.advanceAfterBlockEnd(f.value), p;
              }, w.parseIf = function() {
                var l = this.peekToken(), f;
                this.skipSymbol("if") || this.skipSymbol("elif") || this.skipSymbol("elseif") ? f = new A.If(l.lineno, l.colno) : this.skipSymbol("ifAsync") ? f = new A.IfAsync(l.lineno, l.colno) : this.fail("parseIf: expected if, elif, or elseif", l.lineno, l.colno), f.cond = this.parseExpression(), this.advanceAfterBlockEnd(l.value), f.body = this.parseUntilBlocks("elif", "elseif", "else", "endif");
                var p = this.peekToken();
                switch (p && p.value) {
                  case "elseif":
                  case "elif":
                    f.else_ = this.parseIf();
                    break;
                  case "else":
                    this.advanceAfterBlockEnd(), f.else_ = this.parseUntilBlocks("endif"), this.advanceAfterBlockEnd();
                    break;
                  case "endif":
                    f.else_ = null, this.advanceAfterBlockEnd();
                    break;
                  default:
                    this.fail("parseIf: expected elif, else, or endif, got end of file");
                }
                return f;
              }, w.parseSet = function() {
                var l = this.peekToken();
                this.skipSymbol("set") || this.fail("parseSet: expected set", l.lineno, l.colno);
                for (var f = new A.Set(l.lineno, l.colno, []), p; (p = this.parsePrimary()) && (f.targets.push(p), !!this.skip(a.TOKEN_COMMA)); )
                  ;
                return this.skipValue(a.TOKEN_OPERATOR, "=") ? (f.value = this.parseExpression(), this.advanceAfterBlockEnd(l.value)) : this.skip(a.TOKEN_BLOCK_END) ? (f.body = new A.Capture(l.lineno, l.colno, this.parseUntilBlocks("endset")), f.value = null, this.advanceAfterBlockEnd()) : this.fail("parseSet: expected = or block end in set tag", l.lineno, l.colno), f;
              }, w.parseSwitch = function() {
                var l = "switch", f = "endswitch", p = "case", I = "default", b = this.peekToken();
                !this.skipSymbol(l) && !this.skipSymbol(p) && !this.skipSymbol(I) && this.fail('parseSwitch: expected "switch," "case" or "default"', b.lineno, b.colno);
                var d = this.parseExpression();
                this.advanceAfterBlockEnd(l), this.parseUntilBlocks(p, I, f);
                var h = this.peekToken(), m = [], v;
                do {
                  this.skipSymbol(p);
                  var E = this.parseExpression();
                  this.advanceAfterBlockEnd(l);
                  var M = this.parseUntilBlocks(p, I, f);
                  m.push(new A.Case(h.line, h.col, E, M)), h = this.peekToken();
                } while (h && h.value === p);
                switch (h.value) {
                  case I:
                    this.advanceAfterBlockEnd(), v = this.parseUntilBlocks(f), this.advanceAfterBlockEnd();
                    break;
                  case f:
                    this.advanceAfterBlockEnd();
                    break;
                  default:
                    this.fail('parseSwitch: expected "case," "default" or "endswitch," got EOF.');
                }
                return new A.Switch(b.lineno, b.colno, d, m, v);
              }, w.parseStatement = function() {
                var l = this.peekToken(), f;
                if (l.type !== a.TOKEN_SYMBOL && this.fail("tag name expected", l.lineno, l.colno), this.breakOnBlocks && c.indexOf(this.breakOnBlocks, l.value) !== -1)
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
                      for (var p = 0; p < this.extensions.length; p++) {
                        var I = this.extensions[p];
                        if (c.indexOf(I.tags || [], l.value) !== -1)
                          return I.parse(this, A, a);
                      }
                    this.fail("unknown block tag: " + l.value, l.lineno, l.colno);
                }
                return f;
              }, w.parseRaw = function(l) {
                l = l || "raw";
                for (var f = "end" + l, p = new RegExp("([\\s\\S]*?){%\\s*(" + l + "|" + f + ")\\s*(?=%})%}"), I = 1, b = "", d = null, h = this.advanceAfterBlockEnd(); (d = this.tokens._extractRegex(p)) && I > 0; ) {
                  var m = d[0], v = d[1], E = d[2];
                  E === l ? I += 1 : E === f && (I -= 1), I === 0 ? (b += v, this.tokens.backN(m.length - v.length)) : b += m;
                }
                return new A.Output(h.lineno, h.colno, [new A.TemplateData(h.lineno, h.colno, b)]);
              }, w.parsePostfix = function(l) {
                for (var f, p = this.peekToken(); p; ) {
                  if (p.type === a.TOKEN_LEFT_PAREN)
                    l = new A.FunCall(p.lineno, p.colno, l, this.parseSignature());
                  else if (p.type === a.TOKEN_LEFT_BRACKET)
                    f = this.parseAggregate(), f.children.length > 1 && this.fail("invalid index"), l = new A.LookupVal(p.lineno, p.colno, l, f.children[0]);
                  else if (p.type === a.TOKEN_OPERATOR && p.value === ".") {
                    this.nextToken();
                    var I = this.nextToken();
                    I.type !== a.TOKEN_SYMBOL && this.fail("expected name as lookup value, got " + I.value, I.lineno, I.colno), f = new A.Literal(I.lineno, I.colno, I.value), l = new A.LookupVal(p.lineno, p.colno, l, f);
                  } else
                    break;
                  p = this.peekToken();
                }
                return l;
              }, w.parseExpression = function() {
                var l = this.parseInlineIf();
                return l;
              }, w.parseInlineIf = function() {
                var l = this.parseOr();
                if (this.skipSymbol("if")) {
                  var f = this.parseOr(), p = l;
                  l = new A.InlineIf(l.lineno, l.colno), l.body = p, l.cond = f, this.skipSymbol("else") ? l.else_ = this.parseOr() : l.else_ = null;
                }
                return l;
              }, w.parseOr = function() {
                for (var l = this.parseAnd(); this.skipSymbol("or"); ) {
                  var f = this.parseAnd();
                  l = new A.Or(l.lineno, l.colno, l, f);
                }
                return l;
              }, w.parseAnd = function() {
                for (var l = this.parseNot(); this.skipSymbol("and"); ) {
                  var f = this.parseNot();
                  l = new A.And(l.lineno, l.colno, l, f);
                }
                return l;
              }, w.parseNot = function() {
                var l = this.peekToken();
                return this.skipSymbol("not") ? new A.Not(l.lineno, l.colno, this.parseNot()) : this.parseIn();
              }, w.parseIn = function() {
                for (var l = this.parseIs(); ; ) {
                  var f = this.nextToken();
                  if (!f)
                    break;
                  var p = f.type === a.TOKEN_SYMBOL && f.value === "not";
                  if (p || this.pushToken(f), this.skipSymbol("in")) {
                    var I = this.parseIs();
                    l = new A.In(l.lineno, l.colno, l, I), p && (l = new A.Not(l.lineno, l.colno, l));
                  } else {
                    p && this.pushToken(f);
                    break;
                  }
                }
                return l;
              }, w.parseIs = function() {
                var l = this.parseCompare();
                if (this.skipSymbol("is")) {
                  var f = this.skipSymbol("not"), p = this.parseCompare();
                  l = new A.Is(l.lineno, l.colno, l, p), f && (l = new A.Not(l.lineno, l.colno, l));
                }
                return l;
              }, w.parseCompare = function() {
                for (var l = ["==", "===", "!=", "!==", "<", ">", "<=", ">="], f = this.parseConcat(), p = []; ; ) {
                  var I = this.nextToken();
                  if (I)
                    if (l.indexOf(I.value) !== -1)
                      p.push(new A.CompareOperand(I.lineno, I.colno, this.parseConcat(), I.value));
                    else {
                      this.pushToken(I);
                      break;
                    }
                  else break;
                }
                return p.length ? new A.Compare(p[0].lineno, p[0].colno, f, p) : f;
              }, w.parseConcat = function() {
                for (var l = this.parseAdd(); this.skipValue(a.TOKEN_TILDE, "~"); ) {
                  var f = this.parseAdd();
                  l = new A.Concat(l.lineno, l.colno, l, f);
                }
                return l;
              }, w.parseAdd = function() {
                for (var l = this.parseSub(); this.skipValue(a.TOKEN_OPERATOR, "+"); ) {
                  var f = this.parseSub();
                  l = new A.Add(l.lineno, l.colno, l, f);
                }
                return l;
              }, w.parseSub = function() {
                for (var l = this.parseMul(); this.skipValue(a.TOKEN_OPERATOR, "-"); ) {
                  var f = this.parseMul();
                  l = new A.Sub(l.lineno, l.colno, l, f);
                }
                return l;
              }, w.parseMul = function() {
                for (var l = this.parseDiv(); this.skipValue(a.TOKEN_OPERATOR, "*"); ) {
                  var f = this.parseDiv();
                  l = new A.Mul(l.lineno, l.colno, l, f);
                }
                return l;
              }, w.parseDiv = function() {
                for (var l = this.parseFloorDiv(); this.skipValue(a.TOKEN_OPERATOR, "/"); ) {
                  var f = this.parseFloorDiv();
                  l = new A.Div(l.lineno, l.colno, l, f);
                }
                return l;
              }, w.parseFloorDiv = function() {
                for (var l = this.parseMod(); this.skipValue(a.TOKEN_OPERATOR, "//"); ) {
                  var f = this.parseMod();
                  l = new A.FloorDiv(l.lineno, l.colno, l, f);
                }
                return l;
              }, w.parseMod = function() {
                for (var l = this.parsePow(); this.skipValue(a.TOKEN_OPERATOR, "%"); ) {
                  var f = this.parsePow();
                  l = new A.Mod(l.lineno, l.colno, l, f);
                }
                return l;
              }, w.parsePow = function() {
                for (var l = this.parseUnary(); this.skipValue(a.TOKEN_OPERATOR, "**"); ) {
                  var f = this.parseUnary();
                  l = new A.Pow(l.lineno, l.colno, l, f);
                }
                return l;
              }, w.parseUnary = function(l) {
                var f = this.peekToken(), p;
                return this.skipValue(a.TOKEN_OPERATOR, "-") ? p = new A.Neg(f.lineno, f.colno, this.parseUnary(!0)) : this.skipValue(a.TOKEN_OPERATOR, "+") ? p = new A.Pos(f.lineno, f.colno, this.parseUnary(!0)) : p = this.parsePrimary(), l || (p = this.parseFilter(p)), p;
              }, w.parsePrimary = function(l) {
                var f = this.nextToken(), p, I = null;
                if (f ? f.type === a.TOKEN_STRING ? p = f.value : f.type === a.TOKEN_INT ? p = parseInt(f.value, 10) : f.type === a.TOKEN_FLOAT ? p = parseFloat(f.value) : f.type === a.TOKEN_BOOLEAN ? f.value === "true" ? p = !0 : f.value === "false" ? p = !1 : this.fail("invalid boolean: " + f.value, f.lineno, f.colno) : f.type === a.TOKEN_NONE ? p = null : f.type === a.TOKEN_REGEX && (p = new RegExp(f.value.body, f.value.flags)) : this.fail("expected expression, got end of file"), p !== void 0 ? I = new A.Literal(f.lineno, f.colno, p) : f.type === a.TOKEN_SYMBOL ? I = new A.Symbol(f.lineno, f.colno, f.value) : (this.pushToken(f), I = this.parseAggregate()), l || (I = this.parsePostfix(I)), I)
                  return I;
                throw this.error("unexpected token: " + f.value, f.lineno, f.colno);
              }, w.parseFilterName = function() {
                for (var l = this.expect(a.TOKEN_SYMBOL), f = l.value; this.skipValue(a.TOKEN_OPERATOR, "."); )
                  f += "." + this.expect(a.TOKEN_SYMBOL).value;
                return new A.Symbol(l.lineno, l.colno, f);
              }, w.parseFilterArgs = function(l) {
                if (this.peekToken().type === a.TOKEN_LEFT_PAREN) {
                  var f = this.parsePostfix(l);
                  return f.args.children;
                }
                return [];
              }, w.parseFilter = function(l) {
                for (; this.skip(a.TOKEN_PIPE); ) {
                  var f = this.parseFilterName();
                  l = new A.Filter(f.lineno, f.colno, f, new A.NodeList(f.lineno, f.colno, [l].concat(this.parseFilterArgs(l))));
                }
                return l;
              }, w.parseFilterStatement = function() {
                var l = this.peekToken();
                this.skipSymbol("filter") || this.fail("parseFilterStatement: expected filter");
                var f = this.parseFilterName(), p = this.parseFilterArgs(f);
                this.advanceAfterBlockEnd(l.value);
                var I = new A.Capture(f.lineno, f.colno, this.parseUntilBlocks("endfilter"));
                this.advanceAfterBlockEnd();
                var b = new A.Filter(f.lineno, f.colno, f, new A.NodeList(f.lineno, f.colno, [I].concat(p)));
                return new A.Output(f.lineno, f.colno, [b]);
              }, w.parseAggregate = function() {
                var l = this.nextToken(), f;
                switch (l.type) {
                  case a.TOKEN_LEFT_PAREN:
                    f = new A.Group(l.lineno, l.colno);
                    break;
                  case a.TOKEN_LEFT_BRACKET:
                    f = new A.Array(l.lineno, l.colno);
                    break;
                  case a.TOKEN_LEFT_CURLY:
                    f = new A.Dict(l.lineno, l.colno);
                    break;
                  default:
                    return null;
                }
                for (; ; ) {
                  var p = this.peekToken().type;
                  if (p === a.TOKEN_RIGHT_PAREN || p === a.TOKEN_RIGHT_BRACKET || p === a.TOKEN_RIGHT_CURLY) {
                    this.nextToken();
                    break;
                  }
                  if (f.children.length > 0 && (this.skip(a.TOKEN_COMMA) || this.fail("parseAggregate: expected comma after expression", l.lineno, l.colno)), f instanceof A.Dict) {
                    var I = this.parsePrimary();
                    this.skip(a.TOKEN_COLON) || this.fail("parseAggregate: expected colon after dict key", l.lineno, l.colno);
                    var b = this.parseExpression();
                    f.addChild(new A.Pair(I.lineno, I.colno, I, b));
                  } else {
                    var d = this.parseExpression();
                    f.addChild(d);
                  }
                }
                return f;
              }, w.parseSignature = function(l, f) {
                var p = this.peekToken();
                if (!f && p.type !== a.TOKEN_LEFT_PAREN) {
                  if (l)
                    return null;
                  this.fail("expected arguments", p.lineno, p.colno);
                }
                p.type === a.TOKEN_LEFT_PAREN && (p = this.nextToken());
                for (var I = new A.NodeList(p.lineno, p.colno), b = new A.KeywordArgs(p.lineno, p.colno), d = !1; ; ) {
                  if (p = this.peekToken(), !f && p.type === a.TOKEN_RIGHT_PAREN) {
                    this.nextToken();
                    break;
                  } else if (f && p.type === a.TOKEN_BLOCK_END)
                    break;
                  if (d && !this.skip(a.TOKEN_COMMA))
                    this.fail("parseSignature: expected comma after expression", p.lineno, p.colno);
                  else {
                    var h = this.parseExpression();
                    this.skipValue(a.TOKEN_OPERATOR, "=") ? b.addChild(new A.Pair(h.lineno, h.colno, h, this.parseExpression())) : I.addChild(h);
                  }
                  d = !0;
                }
                return b.children.length && I.addChild(b), I;
              }, w.parseUntilBlocks = function() {
                for (var l = this.breakOnBlocks, f = arguments.length, p = new Array(f), I = 0; I < f; I++)
                  p[I] = arguments[I];
                this.breakOnBlocks = p;
                var b = this.parse();
                return this.breakOnBlocks = l, b;
              }, w.parseNodes = function() {
                for (var l, f = []; l = this.nextToken(); )
                  if (l.type === a.TOKEN_DATA) {
                    var p = l.value, I = this.peekToken(), b = I && I.value;
                    this.dropLeadingWhitespace && (p = p.replace(/^\s*/, ""), this.dropLeadingWhitespace = !1), I && (I.type === a.TOKEN_BLOCK_START && b.charAt(b.length - 1) === "-" || I.type === a.TOKEN_VARIABLE_START && b.charAt(this.tokens.tags.VARIABLE_START.length) === "-" || I.type === a.TOKEN_COMMENT && b.charAt(this.tokens.tags.COMMENT_START.length) === "-") && (p = p.replace(/\s*$/, "")), f.push(new A.Output(l.lineno, l.colno, [new A.TemplateData(l.lineno, l.colno, p)]));
                  } else if (l.type === a.TOKEN_BLOCK_START) {
                    this.dropLeadingWhitespace = !1;
                    var d = this.parseStatement();
                    if (!d)
                      break;
                    f.push(d);
                  } else if (l.type === a.TOKEN_VARIABLE_START) {
                    var h = this.parseExpression();
                    this.dropLeadingWhitespace = !1, this.advanceAfterVariableEnd(), f.push(new A.Output(l.lineno, l.colno, [h]));
                  } else l.type === a.TOKEN_COMMENT ? this.dropLeadingWhitespace = l.value.charAt(l.value.length - this.tokens.tags.COMMENT_END.length - 1) === "-" : this.fail("Unexpected token at top-level: " + l.type, l.lineno, l.colno);
                return f;
              }, w.parse = function() {
                return new A.NodeList(0, 0, this.parseNodes());
              }, w.parseAsRoot = function() {
                return new A.Root(0, 0, this.parseNodes());
              }, y;
            })(g);
            n.exports = {
              parse: function(C, y, w) {
                var l = new u(a.lex(C, w));
                return y !== void 0 && (l.extensions = y), l.parseAsRoot();
              },
              Parser: u
            };
          }),
          /* 9 */
          /***/
          (function(n, i, r) {
            var s = r(0), o = ` 
	\r `, a = "()[]{}%*-+~/#,:|.<>=!", A = "0123456789", g = "{%", c = "%}", u = "{{", C = "}}", y = "{#", w = "#}", l = "string", f = "whitespace", p = "data", I = "block-start", b = "block-end", d = "variable-start", h = "variable-end", m = "comment", v = "left-paren", E = "right-paren", M = "left-bracket", x = "right-bracket", S = "left-curly", _ = "right-curly", P = "operator", D = "comma", F = "colon", N = "tilde", R = "pipe", B = "int", k = "float", j = "boolean", z = "none", U = "symbol", J = "special", tt = "regex";
            function W(ot, et, Y, q) {
              return {
                type: ot,
                value: et,
                lineno: Y,
                colno: q
              };
            }
            var $ = /* @__PURE__ */ (function() {
              function ot(Y, q) {
                this.str = Y, this.index = 0, this.len = Y.length, this.lineno = 0, this.colno = 0, this.in_code = !1, q = q || {};
                var K = q.tags || {};
                this.tags = {
                  BLOCK_START: K.blockStart || g,
                  BLOCK_END: K.blockEnd || c,
                  VARIABLE_START: K.variableStart || u,
                  VARIABLE_END: K.variableEnd || C,
                  COMMENT_START: K.commentStart || y,
                  COMMENT_END: K.commentEnd || w
                }, this.trimBlocks = !!q.trimBlocks, this.lstripBlocks = !!q.lstripBlocks;
              }
              var et = ot.prototype;
              return et.nextToken = function() {
                var Y = this.lineno, q = this.colno, K;
                if (this.in_code) {
                  var ct = this.current();
                  if (this.isFinished())
                    return null;
                  if (ct === '"' || ct === "'")
                    return W(l, this._parseString(ct), Y, q);
                  if (K = this._extract(o))
                    return W(f, K, Y, q);
                  if ((K = this._extractString(this.tags.BLOCK_END)) || (K = this._extractString("-" + this.tags.BLOCK_END)))
                    return this.in_code = !1, this.trimBlocks && (ct = this.current(), ct === `
` ? this.forward() : ct === "\r" && (this.forward(), ct = this.current(), ct === `
` ? this.forward() : this.back())), W(b, K, Y, q);
                  if ((K = this._extractString(this.tags.VARIABLE_END)) || (K = this._extractString("-" + this.tags.VARIABLE_END)))
                    return this.in_code = !1, W(h, K, Y, q);
                  if (ct === "r" && this.str.charAt(this.index + 1) === "/") {
                    this.forwardN(2);
                    for (var yt = ""; !this.isFinished(); )
                      if (this.current() === "/" && this.previous() !== "\\") {
                        this.forward();
                        break;
                      } else
                        yt += this.current(), this.forward();
                    for (var wt = ["g", "i", "m", "y"], ht = ""; !this.isFinished(); ) {
                      var lt = wt.indexOf(this.current()) !== -1;
                      if (lt)
                        ht += this.current(), this.forward();
                      else
                        break;
                    }
                    return W(tt, {
                      body: yt,
                      flags: ht
                    }, Y, q);
                  } else if (a.indexOf(ct) !== -1) {
                    this.forward();
                    var O = ["==", "===", "!=", "!==", "<=", ">=", "//", "**"], G = ct + this.current(), H;
                    switch (s.indexOf(O, G) !== -1 && (this.forward(), ct = G, s.indexOf(O, G + this.current()) !== -1 && (ct = G + this.current(), this.forward())), ct) {
                      case "(":
                        H = v;
                        break;
                      case ")":
                        H = E;
                        break;
                      case "[":
                        H = M;
                        break;
                      case "]":
                        H = x;
                        break;
                      case "{":
                        H = S;
                        break;
                      case "}":
                        H = _;
                        break;
                      case ",":
                        H = D;
                        break;
                      case ":":
                        H = F;
                        break;
                      case "~":
                        H = N;
                        break;
                      case "|":
                        H = R;
                        break;
                      default:
                        H = P;
                    }
                    return W(H, ct, Y, q);
                  } else if (K = this._extractUntil(o + a), K.match(/^[-+]?[0-9]+$/))
                    if (this.current() === ".") {
                      this.forward();
                      var Q = this._extract(A);
                      return W(k, K + "." + Q, Y, q);
                    } else
                      return W(B, K, Y, q);
                  else {
                    if (K.match(/^(true|false)$/))
                      return W(j, K, Y, q);
                    if (K === "none" || K === "null")
                      return W(z, K, Y, q);
                    if (K)
                      return W(U, K, Y, q);
                    throw new Error("Unexpected value while parsing: " + K);
                  }
                } else {
                  var at = this.tags.BLOCK_START.charAt(0) + this.tags.VARIABLE_START.charAt(0) + this.tags.COMMENT_START.charAt(0) + this.tags.COMMENT_END.charAt(0);
                  if (this.isFinished())
                    return null;
                  if ((K = this._extractString(this.tags.BLOCK_START + "-")) || (K = this._extractString(this.tags.BLOCK_START)))
                    return this.in_code = !0, W(I, K, Y, q);
                  if ((K = this._extractString(this.tags.VARIABLE_START + "-")) || (K = this._extractString(this.tags.VARIABLE_START)))
                    return this.in_code = !0, W(d, K, Y, q);
                  K = "";
                  var rt, ut = !1;
                  for (this._matches(this.tags.COMMENT_START) && (ut = !0, K = this._extractString(this.tags.COMMENT_START)); (rt = this._extractUntil(at)) !== null; )
                    if (K += rt, (this._matches(this.tags.BLOCK_START) || this._matches(this.tags.VARIABLE_START) || this._matches(this.tags.COMMENT_START)) && !ut) {
                      if (this.lstripBlocks && this._matches(this.tags.BLOCK_START) && this.colno > 0 && this.colno <= K.length) {
                        var gt = K.slice(-this.colno);
                        if (/^\s+$/.test(gt) && (K = K.slice(0, -this.colno), !K.length))
                          return this.nextToken();
                      }
                      break;
                    } else if (this._matches(this.tags.COMMENT_END)) {
                      if (!ut)
                        throw new Error("unexpected end of comment");
                      K += this._extractString(this.tags.COMMENT_END);
                      break;
                    } else
                      K += this.current(), this.forward();
                  if (rt === null && ut)
                    throw new Error("expected end of comment, got end of file");
                  return W(ut ? m : p, K, Y, q);
                }
              }, et._parseString = function(Y) {
                this.forward();
                for (var q = ""; !this.isFinished() && this.current() !== Y; ) {
                  var K = this.current();
                  if (K === "\\") {
                    switch (this.forward(), this.current()) {
                      case "n":
                        q += `
`;
                        break;
                      case "t":
                        q += "	";
                        break;
                      case "r":
                        q += "\r";
                        break;
                      default:
                        q += this.current();
                    }
                    this.forward();
                  } else
                    q += K, this.forward();
                }
                return this.forward(), q;
              }, et._matches = function(Y) {
                if (this.index + Y.length > this.len)
                  return null;
                var q = this.str.slice(this.index, this.index + Y.length);
                return q === Y;
              }, et._extractString = function(Y) {
                return this._matches(Y) ? (this.forwardN(Y.length), Y) : null;
              }, et._extractUntil = function(Y) {
                return this._extractMatching(!0, Y || "");
              }, et._extract = function(Y) {
                return this._extractMatching(!1, Y);
              }, et._extractMatching = function(Y, q) {
                if (this.isFinished())
                  return null;
                var K = q.indexOf(this.current());
                if (Y && K === -1 || !Y && K !== -1) {
                  var ct = this.current();
                  this.forward();
                  for (var yt = q.indexOf(this.current()); (Y && yt === -1 || !Y && yt !== -1) && !this.isFinished(); )
                    ct += this.current(), this.forward(), yt = q.indexOf(this.current());
                  return ct;
                }
                return "";
              }, et._extractRegex = function(Y) {
                var q = this.currentStr().match(Y);
                return q ? (this.forwardN(q[0].length), q) : null;
              }, et.isFinished = function() {
                return this.index >= this.len;
              }, et.forwardN = function(Y) {
                for (var q = 0; q < Y; q++)
                  this.forward();
              }, et.forward = function() {
                this.index++, this.previous() === `
` ? (this.lineno++, this.colno = 0) : this.colno++;
              }, et.backN = function(Y) {
                for (var q = 0; q < Y; q++)
                  this.back();
              }, et.back = function() {
                if (this.index--, this.current() === `
`) {
                  this.lineno--;
                  var Y = this.src.lastIndexOf(`
`, this.index - 1);
                  Y === -1 ? this.colno = this.index : this.colno = this.index - Y;
                } else
                  this.colno--;
              }, et.current = function() {
                return this.isFinished() ? "" : this.str.charAt(this.index);
              }, et.currentStr = function() {
                return this.isFinished() ? "" : this.str.substr(this.index);
              }, et.previous = function() {
                return this.str.charAt(this.index - 1);
              }, ot;
            })();
            n.exports = {
              lex: function(ot, et) {
                return new $(ot, et);
              },
              TOKEN_STRING: l,
              TOKEN_WHITESPACE: f,
              TOKEN_DATA: p,
              TOKEN_BLOCK_START: I,
              TOKEN_BLOCK_END: b,
              TOKEN_VARIABLE_START: d,
              TOKEN_VARIABLE_END: h,
              TOKEN_COMMENT: m,
              TOKEN_LEFT_PAREN: v,
              TOKEN_RIGHT_PAREN: E,
              TOKEN_LEFT_BRACKET: M,
              TOKEN_RIGHT_BRACKET: x,
              TOKEN_LEFT_CURLY: S,
              TOKEN_RIGHT_CURLY: _,
              TOKEN_OPERATOR: P,
              TOKEN_COMMA: D,
              TOKEN_COLON: F,
              TOKEN_TILDE: N,
              TOKEN_PIPE: R,
              TOKEN_INT: B,
              TOKEN_FLOAT: k,
              TOKEN_BOOLEAN: j,
              TOKEN_NONE: z,
              TOKEN_SYMBOL: U,
              TOKEN_SPECIAL: J,
              TOKEN_REGEX: tt
            };
          }),
          /* 10 */
          /***/
          (function(n, i, r) {
            function s(u, C) {
              u.prototype = Object.create(C.prototype), u.prototype.constructor = u, o(u, C);
            }
            function o(u, C) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(y, w) {
                return y.__proto__ = w, y;
              }, o(u, C);
            }
            var a = r(6), A = r(19), g = A.PrecompiledLoader, c = /* @__PURE__ */ (function(u) {
              s(C, u);
              function C(w, l) {
                var f;
                return f = u.call(this) || this, f.baseURL = w || ".", l = l || {}, f.useCache = !!l.useCache, f.async = !!l.async, f;
              }
              var y = C.prototype;
              return y.resolve = function(w, l) {
                throw new Error("relative templates not support in the browser yet");
              }, y.getSource = function(w, l) {
                var f = this, p = this.useCache, I;
                return this.fetch(this.baseURL + "/" + w, function(b, d) {
                  if (b)
                    if (l)
                      l(b.content);
                    else if (b.status === 404)
                      I = null;
                    else
                      throw b.content;
                  else
                    I = {
                      src: d,
                      path: w,
                      noCache: !p
                    }, f.emit("load", w, I), l && l(null, I);
                }), I;
              }, y.fetch = function(w, l) {
                if (typeof window > "u")
                  throw new Error("WebLoader can only by used in a browser");
                var f = new XMLHttpRequest(), p = !0;
                f.onreadystatechange = function() {
                  f.readyState === 4 && p && (p = !1, f.status === 0 || f.status === 200 ? l(null, f.responseText) : l({
                    status: f.status,
                    content: f.responseText
                  }));
                }, w += (w.indexOf("?") === -1 ? "?" : "&") + "s=" + (/* @__PURE__ */ new Date()).getTime(), f.open("GET", w, this.async), f.send();
              }, C;
            })(a);
            n.exports = {
              WebLoader: c,
              PrecompiledLoader: g
            };
          }),
          /* 11 */
          /***/
          (function(n, i, r) {
            var s = r(0), o = r(7), a = o.Environment, A = o.Template, g = r(6), c = r(10), u = r(23), C = r(5), y = r(8), w = r(9), l = r(2), f = r(3), p = r(25), I;
            function b(d, h) {
              h = h || {}, s.isObject(d) && (h = d, d = null);
              var m;
              return c.FileSystemLoader ? m = new c.FileSystemLoader(d, {
                watch: h.watch,
                noCache: h.noCache
              }) : c.WebLoader && (m = new c.WebLoader(d, {
                useCache: h.web && h.web.useCache,
                async: h.web && h.web.async
              })), I = new a(m, h), h && h.express && I.express(h.express), I;
            }
            n.exports = {
              Environment: a,
              Template: A,
              Loader: g,
              FileSystemLoader: c.FileSystemLoader,
              NodeResolveLoader: c.NodeResolveLoader,
              PrecompiledLoader: c.PrecompiledLoader,
              WebLoader: c.WebLoader,
              compiler: C,
              parser: y,
              lexer: w,
              runtime: l,
              lib: s,
              nodes: f,
              installJinjaCompat: p,
              configure: b,
              reset: function() {
                I = void 0;
              },
              compile: function(d, h, m, v) {
                return I || b(), new A(d, h, m, v);
              },
              render: function(d, h, m) {
                return I || b(), I.render(d, h, m);
              },
              renderString: function(d, h, m) {
                return I || b(), I.renderString(d, h, m);
              },
              precompile: u ? u.precompile : void 0,
              precompileString: u ? u.precompileString : void 0
            };
          }),
          /* 12 */
          /***/
          (function(n, i, r) {
            var s = r(13), o = [], a = [], A = s.makeRequestCallFromTimer(g);
            function g() {
              if (a.length)
                throw a.shift();
            }
            n.exports = c;
            function c(C) {
              var y;
              o.length ? y = o.pop() : y = new u(), y.task = C, s(y);
            }
            function u() {
              this.task = null;
            }
            u.prototype.call = function() {
              try {
                this.task.call();
              } catch (C) {
                c.onerror ? c.onerror(C) : (a.push(C), A());
              } finally {
                this.task = null, o[o.length] = this;
              }
            };
          }),
          /* 13 */
          /***/
          (function(n, i, r) {
            (function(s) {
              n.exports = o;
              function o(f) {
                a.length || A(), a[a.length] = f;
              }
              var a = [], A, g = 0, c = 1024;
              function u() {
                for (; g < a.length; ) {
                  var f = g;
                  if (g = g + 1, a[f].call(), g > c) {
                    for (var p = 0, I = a.length - g; p < I; p++)
                      a[p] = a[p + g];
                    a.length -= g, g = 0;
                  }
                }
                a.length = 0, g = 0;
              }
              var C = typeof s < "u" ? s : self, y = C.MutationObserver || C.WebKitMutationObserver;
              typeof y == "function" ? A = w(u) : A = l(u), o.requestFlush = A;
              function w(f) {
                var p = 1, I = new y(f), b = document.createTextNode("");
                return I.observe(b, { characterData: !0 }), function() {
                  p = -p, b.data = p;
                };
              }
              function l(f) {
                return function() {
                  var p = setTimeout(b, 0), I = setInterval(b, 50);
                  function b() {
                    clearTimeout(p), clearInterval(I), f();
                  }
                };
              }
              o.makeRequestCallFromTimer = l;
            }).call(i, r(14));
          }),
          /* 14 */
          /***/
          (function(n, i) {
            var r;
            r = /* @__PURE__ */ (function() {
              return this;
            })();
            try {
              r = r || Function("return this")() || (0, eval)("this");
            } catch {
              typeof window == "object" && (r = window);
            }
            n.exports = r;
          }),
          /* 15 */
          /***/
          (function(n, i, r) {
            var s, o;
            (function(a) {
              var A = function() {
                var y = Array.prototype.slice.call(arguments);
                typeof y[0] == "function" && y[0].apply(null, y.splice(1));
              }, g = function(y) {
                typeof setImmediate == "function" ? setImmediate(y) : typeof process < "u" && process.nextTick ? process.nextTick(y) : setTimeout(y, 0);
              }, c = function(y) {
                var w = function(l) {
                  var f = function() {
                    return y.length && y[l].apply(null, arguments), f.next();
                  };
                  return f.next = function() {
                    return l < y.length - 1 ? w(l + 1) : null;
                  }, f;
                };
                return w(0);
              }, u = Array.isArray || function(y) {
                return Object.prototype.toString.call(y) === "[object Array]";
              }, C = function(y, w, l) {
                var f = l ? g : A;
                if (w = w || function() {
                }, !u(y)) {
                  var p = new Error("First argument to waterfall must be an array of functions");
                  return w(p);
                }
                if (!y.length)
                  return w();
                var I = function(b) {
                  return function(d) {
                    if (d)
                      w.apply(null, arguments), w = function() {
                      };
                    else {
                      var h = Array.prototype.slice.call(arguments, 1), m = b.next();
                      m ? h.push(I(m)) : h.push(w), f(function() {
                        b.apply(null, h);
                      });
                    }
                  };
                };
                I(c(y))();
              };
              s = [], o = (function() {
                return C;
              }).apply(i, s), o !== void 0 && (n.exports = o);
            })();
          }),
          /* 16 */
          /***/
          (function(n, i, r) {
            var s = typeof Reflect == "object" ? Reflect : null, o = s && typeof s.apply == "function" ? s.apply : function(M, x, S) {
              return Function.prototype.apply.call(M, x, S);
            }, a;
            s && typeof s.ownKeys == "function" ? a = s.ownKeys : Object.getOwnPropertySymbols ? a = function(M) {
              return Object.getOwnPropertyNames(M).concat(Object.getOwnPropertySymbols(M));
            } : a = function(M) {
              return Object.getOwnPropertyNames(M);
            };
            function A(M) {
              console && console.warn && console.warn(M);
            }
            var g = Number.isNaN || function(M) {
              return M !== M;
            };
            function c() {
              c.init.call(this);
            }
            n.exports = c, n.exports.once = m, c.EventEmitter = c, c.prototype._events = void 0, c.prototype._eventsCount = 0, c.prototype._maxListeners = void 0;
            var u = 10;
            function C(M) {
              if (typeof M != "function")
                throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof M);
            }
            Object.defineProperty(c, "defaultMaxListeners", {
              enumerable: !0,
              get: function() {
                return u;
              },
              set: function(M) {
                if (typeof M != "number" || M < 0 || g(M))
                  throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + M + ".");
                u = M;
              }
            }), c.init = function() {
              (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
            }, c.prototype.setMaxListeners = function(M) {
              if (typeof M != "number" || M < 0 || g(M))
                throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + M + ".");
              return this._maxListeners = M, this;
            };
            function y(M) {
              return M._maxListeners === void 0 ? c.defaultMaxListeners : M._maxListeners;
            }
            c.prototype.getMaxListeners = function() {
              return y(this);
            }, c.prototype.emit = function(M) {
              for (var x = [], S = 1; S < arguments.length; S++) x.push(arguments[S]);
              var _ = M === "error", P = this._events;
              if (P !== void 0)
                _ = _ && P.error === void 0;
              else if (!_)
                return !1;
              if (_) {
                var D;
                if (x.length > 0 && (D = x[0]), D instanceof Error)
                  throw D;
                var F = new Error("Unhandled error." + (D ? " (" + D.message + ")" : ""));
                throw F.context = D, F;
              }
              var N = P[M];
              if (N === void 0)
                return !1;
              if (typeof N == "function")
                o(N, this, x);
              else
                for (var R = N.length, B = b(N, R), S = 0; S < R; ++S)
                  o(B[S], this, x);
              return !0;
            };
            function w(M, x, S, _) {
              var P, D, F;
              if (C(S), D = M._events, D === void 0 ? (D = M._events = /* @__PURE__ */ Object.create(null), M._eventsCount = 0) : (D.newListener !== void 0 && (M.emit(
                "newListener",
                x,
                S.listener ? S.listener : S
              ), D = M._events), F = D[x]), F === void 0)
                F = D[x] = S, ++M._eventsCount;
              else if (typeof F == "function" ? F = D[x] = _ ? [S, F] : [F, S] : _ ? F.unshift(S) : F.push(S), P = y(M), P > 0 && F.length > P && !F.warned) {
                F.warned = !0;
                var N = new Error("Possible EventEmitter memory leak detected. " + F.length + " " + String(x) + " listeners added. Use emitter.setMaxListeners() to increase limit");
                N.name = "MaxListenersExceededWarning", N.emitter = M, N.type = x, N.count = F.length, A(N);
              }
              return M;
            }
            c.prototype.addListener = function(M, x) {
              return w(this, M, x, !1);
            }, c.prototype.on = c.prototype.addListener, c.prototype.prependListener = function(M, x) {
              return w(this, M, x, !0);
            };
            function l() {
              if (!this.fired)
                return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
            }
            function f(M, x, S) {
              var _ = { fired: !1, wrapFn: void 0, target: M, type: x, listener: S }, P = l.bind(_);
              return P.listener = S, _.wrapFn = P, P;
            }
            c.prototype.once = function(M, x) {
              return C(x), this.on(M, f(this, M, x)), this;
            }, c.prototype.prependOnceListener = function(M, x) {
              return C(x), this.prependListener(M, f(this, M, x)), this;
            }, c.prototype.removeListener = function(M, x) {
              var S, _, P, D, F;
              if (C(x), _ = this._events, _ === void 0)
                return this;
              if (S = _[M], S === void 0)
                return this;
              if (S === x || S.listener === x)
                --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete _[M], _.removeListener && this.emit("removeListener", M, S.listener || x));
              else if (typeof S != "function") {
                for (P = -1, D = S.length - 1; D >= 0; D--)
                  if (S[D] === x || S[D].listener === x) {
                    F = S[D].listener, P = D;
                    break;
                  }
                if (P < 0)
                  return this;
                P === 0 ? S.shift() : d(S, P), S.length === 1 && (_[M] = S[0]), _.removeListener !== void 0 && this.emit("removeListener", M, F || x);
              }
              return this;
            }, c.prototype.off = c.prototype.removeListener, c.prototype.removeAllListeners = function(M) {
              var x, S, _;
              if (S = this._events, S === void 0)
                return this;
              if (S.removeListener === void 0)
                return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : S[M] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete S[M]), this;
              if (arguments.length === 0) {
                var P = Object.keys(S), D;
                for (_ = 0; _ < P.length; ++_)
                  D = P[_], D !== "removeListener" && this.removeAllListeners(D);
                return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
              }
              if (x = S[M], typeof x == "function")
                this.removeListener(M, x);
              else if (x !== void 0)
                for (_ = x.length - 1; _ >= 0; _--)
                  this.removeListener(M, x[_]);
              return this;
            };
            function p(M, x, S) {
              var _ = M._events;
              if (_ === void 0)
                return [];
              var P = _[x];
              return P === void 0 ? [] : typeof P == "function" ? S ? [P.listener || P] : [P] : S ? h(P) : b(P, P.length);
            }
            c.prototype.listeners = function(M) {
              return p(this, M, !0);
            }, c.prototype.rawListeners = function(M) {
              return p(this, M, !1);
            }, c.listenerCount = function(M, x) {
              return typeof M.listenerCount == "function" ? M.listenerCount(x) : I.call(M, x);
            }, c.prototype.listenerCount = I;
            function I(M) {
              var x = this._events;
              if (x !== void 0) {
                var S = x[M];
                if (typeof S == "function")
                  return 1;
                if (S !== void 0)
                  return S.length;
              }
              return 0;
            }
            c.prototype.eventNames = function() {
              return this._eventsCount > 0 ? a(this._events) : [];
            };
            function b(M, x) {
              for (var S = new Array(x), _ = 0; _ < x; ++_)
                S[_] = M[_];
              return S;
            }
            function d(M, x) {
              for (; x + 1 < M.length; x++)
                M[x] = M[x + 1];
              M.pop();
            }
            function h(M) {
              for (var x = new Array(M.length), S = 0; S < x.length; ++S)
                x[S] = M[S].listener || M[S];
              return x;
            }
            function m(M, x) {
              return new Promise(function(S, _) {
                function P(F) {
                  M.removeListener(x, D), _(F);
                }
                function D() {
                  typeof M.removeListener == "function" && M.removeListener("error", P), S([].slice.call(arguments));
                }
                E(M, x, D, { once: !0 }), x !== "error" && v(M, P, { once: !0 });
              });
            }
            function v(M, x, S) {
              typeof M.on == "function" && E(M, "error", x, S);
            }
            function E(M, x, S, _) {
              if (typeof M.on == "function")
                _.once ? M.once(x, S) : M.on(x, S);
              else if (typeof M.addEventListener == "function")
                M.addEventListener(x, function P(D) {
                  _.once && M.removeEventListener(x, P), S(D);
                });
              else
                throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof M);
            }
          }),
          /* 17 */
          /***/
          (function(n, i, r) {
            var s = r(3), o = r(0), a = 0;
            function A() {
              return "hole_" + a++;
            }
            function g(I, b) {
              for (var d = null, h = 0; h < I.length; h++) {
                var m = b(I[h]);
                m !== I[h] && (d || (d = I.slice()), d[h] = m);
              }
              return d || I;
            }
            function c(I, b, d) {
              if (!(I instanceof s.Node))
                return I;
              if (!d) {
                var h = b(I);
                if (h && h !== I)
                  return h;
              }
              if (I instanceof s.NodeList) {
                var m = g(I.children, function(S) {
                  return c(S, b, d);
                });
                m !== I.children && (I = new s[I.typename](I.lineno, I.colno, m));
              } else if (I instanceof s.CallExtension) {
                var v = c(I.args, b, d), E = g(I.contentArgs, function(S) {
                  return c(S, b, d);
                });
                (v !== I.args || E !== I.contentArgs) && (I = new s[I.typename](I.extName, I.prop, v, E));
              } else {
                var M = I.fields.map(function(S) {
                  return I[S];
                }), x = g(M, function(S) {
                  return c(S, b, d);
                });
                x !== M && (I = new s[I.typename](I.lineno, I.colno), x.forEach(function(S, _) {
                  I[I.fields[_]] = S;
                }));
              }
              return d && b(I) || I;
            }
            function u(I, b) {
              return c(I, b, !0);
            }
            function C(I, b, d) {
              var h = [], m = u(d ? I[d] : I, function(v) {
                var E;
                return v instanceof s.Block ? v : ((v instanceof s.Filter && o.indexOf(b, v.name.value) !== -1 || v instanceof s.CallExtensionAsync) && (E = new s.Symbol(v.lineno, v.colno, A()), h.push(new s.FilterAsync(v.lineno, v.colno, v.name, v.args, E))), E);
              });
              return d ? I[d] = m : I = m, h.length ? (h.push(I), new s.NodeList(I.lineno, I.colno, h)) : I;
            }
            function y(I, b) {
              return u(I, function(d) {
                return d instanceof s.Output ? C(d, b) : d instanceof s.Set ? C(d, b, "value") : d instanceof s.For ? C(d, b, "arr") : d instanceof s.If ? C(d, b, "cond") : d instanceof s.CallExtension ? C(d, b, "args") : void 0;
              });
            }
            function w(I) {
              return c(I, function(b) {
                if (b instanceof s.Block) {
                  var d = !1, h = A();
                  b.body = c(b.body, function(m) {
                    if (m instanceof s.FunCall && m.name.value === "super")
                      return d = !0, new s.Symbol(m.lineno, m.colno, h);
                  }), d && b.body.children.unshift(new s.Super(0, 0, b.name, new s.Symbol(0, 0, h)));
                }
              });
            }
            function l(I) {
              return u(I, function(b) {
                if (!(!(b instanceof s.If) && !(b instanceof s.For))) {
                  var d = !1;
                  if (c(b, function(h) {
                    if (h instanceof s.FilterAsync || h instanceof s.IfAsync || h instanceof s.AsyncEach || h instanceof s.AsyncAll || h instanceof s.CallExtensionAsync)
                      return d = !0, h;
                  }), d) {
                    if (b instanceof s.If)
                      return new s.IfAsync(b.lineno, b.colno, b.cond, b.body, b.else_);
                    if (b instanceof s.For && !(b instanceof s.AsyncAll))
                      return new s.AsyncEach(b.lineno, b.colno, b.arr, b.name, b.body, b.else_);
                  }
                }
              });
            }
            function f(I, b) {
              return l(w(y(I, b)));
            }
            function p(I, b) {
              return f(I, b || []);
            }
            n.exports = {
              transform: p
            };
          }),
          /* 18 */
          /***/
          (function(n, a, r) {
            var s = r(0), o = r(2), a = n.exports = {};
            function A(O, G) {
              return O == null || O === !1 ? G : O;
            }
            a.abs = Math.abs;
            function g(O) {
              return O !== O;
            }
            function c(O, G, H) {
              var Q, at = [], rt = [];
              for (Q = 0; Q < O.length; Q++)
                Q % G === 0 && rt.length && (at.push(rt), rt = []), rt.push(O[Q]);
              if (rt.length) {
                if (H)
                  for (Q = rt.length; Q < G; Q++)
                    rt.push(H);
                at.push(rt);
              }
              return at;
            }
            a.batch = c;
            function u(O) {
              O = A(O, "");
              var G = O.toLowerCase();
              return o.copySafeness(O, G.charAt(0).toUpperCase() + G.slice(1));
            }
            a.capitalize = u;
            function C(O, G) {
              if (O = A(O, ""), G = G || 80, O.length >= G)
                return O;
              var H = G - O.length, Q = s.repeat(" ", H / 2 - H % 2), at = s.repeat(" ", H / 2);
              return o.copySafeness(O, Q + O + at);
            }
            a.center = C;
            function y(O, G, H) {
              return H ? O || G : O !== void 0 ? O : G;
            }
            a.default = y;
            function w(O, G, H) {
              if (!s.isObject(O))
                throw new s.TemplateError("dictsort filter: val must be an object");
              var Q = [];
              for (var at in O)
                Q.push([at, O[at]]);
              var rt;
              if (H === void 0 || H === "key")
                rt = 0;
              else if (H === "value")
                rt = 1;
              else
                throw new s.TemplateError("dictsort filter: You can only sort by either key or value");
              return Q.sort(function(ut, gt) {
                var bt = ut[rt], kt = gt[rt];
                return G || (s.isString(bt) && (bt = bt.toUpperCase()), s.isString(kt) && (kt = kt.toUpperCase())), bt > kt ? 1 : bt === kt ? 0 : -1;
              }), Q;
            }
            a.dictsort = w;
            function l(O, G) {
              return JSON.stringify(O, null, G);
            }
            a.dump = l;
            function f(O) {
              return O instanceof o.SafeString ? O : (O = O ?? "", o.markSafe(s.escape(O.toString())));
            }
            a.escape = f;
            function p(O) {
              return O instanceof o.SafeString ? O : (O = O ?? "", o.markSafe(O.toString()));
            }
            a.safe = p;
            function I(O) {
              return O[0];
            }
            a.first = I;
            function b(O) {
              return O = O ?? "", o.markSafe(s.escape(O.toString()));
            }
            a.forceescape = b;
            function d(O, G) {
              return s.groupBy(O, G, this.env.opts.throwOnUndefined);
            }
            a.groupby = d;
            function h(O, G, H) {
              if (O = A(O, ""), O === "")
                return "";
              G = G || 4;
              var Q = O.split(`
`), at = s.repeat(" ", G), rt = Q.map(function(ut, gt) {
                return gt === 0 && !H ? ut : "" + at + ut;
              }).join(`
`);
              return o.copySafeness(O, rt);
            }
            a.indent = h;
            function m(O, G, H) {
              return G = G || "", H && (O = s.map(O, function(Q) {
                return Q[H];
              })), O.join(G);
            }
            a.join = m;
            function v(O) {
              return O[O.length - 1];
            }
            a.last = v;
            function E(O) {
              var G = A(O, "");
              return G !== void 0 ? typeof Map == "function" && G instanceof Map || typeof Set == "function" && G instanceof Set ? G.size : s.isObject(G) && !(G instanceof o.SafeString) ? s.keys(G).length : G.length : 0;
            }
            a.length = E;
            function M(O) {
              if (s.isString(O))
                return O.split("");
              if (s.isObject(O))
                return s._entries(O || {}).map(function(G) {
                  var H = G[0], Q = G[1];
                  return {
                    key: H,
                    value: Q
                  };
                });
              if (s.isArray(O))
                return O;
              throw new s.TemplateError("list filter: type not iterable");
            }
            a.list = M;
            function x(O) {
              return O = A(O, ""), O.toLowerCase();
            }
            a.lower = x;
            function S(O) {
              return O == null ? "" : o.copySafeness(O, O.replace(/\r\n|\n/g, `<br />
`));
            }
            a.nl2br = S;
            function _(O) {
              return O[Math.floor(Math.random() * O.length)];
            }
            a.random = _;
            function P(O) {
              function G(H, Q, at) {
                Q === void 0 && (Q = "truthy");
                var rt = this, ut = rt.env.getTest(Q);
                return s.toArray(H).filter(function(gt) {
                  return ut.call(rt, gt, at) === O;
                });
              }
              return G;
            }
            a.reject = P(!1);
            function D(O, G) {
              return O.filter(function(H) {
                return !H[G];
              });
            }
            a.rejectattr = D, a.select = P(!0);
            function F(O, G) {
              return O.filter(function(H) {
                return !!H[G];
              });
            }
            a.selectattr = F;
            function N(O, G, H, Q) {
              var at = O;
              if (G instanceof RegExp)
                return O.replace(G, H);
              typeof Q > "u" && (Q = -1);
              var rt = "";
              if (typeof G == "number")
                G = "" + G;
              else if (typeof G != "string")
                return O;
              if (typeof O == "number" && (O = "" + O), typeof O != "string" && !(O instanceof o.SafeString))
                return O;
              if (G === "")
                return rt = H + O.split("").join(H) + H, o.copySafeness(O, rt);
              var ut = O.indexOf(G);
              if (Q === 0 || ut === -1)
                return O;
              for (var gt = 0, bt = 0; ut > -1 && (Q === -1 || bt < Q); )
                rt += O.substring(gt, ut) + H, gt = ut + G.length, bt++, ut = O.indexOf(G, gt);
              return gt < O.length && (rt += O.substring(gt)), o.copySafeness(at, rt);
            }
            a.replace = N;
            function R(O) {
              var G;
              return s.isString(O) ? G = M(O) : G = s.map(O, function(H) {
                return H;
              }), G.reverse(), s.isString(O) ? o.copySafeness(O, G.join("")) : G;
            }
            a.reverse = R;
            function B(O, G, H) {
              G = G || 0;
              var Q = Math.pow(10, G), at;
              return H === "ceil" ? at = Math.ceil : H === "floor" ? at = Math.floor : at = Math.round, at(O * Q) / Q;
            }
            a.round = B;
            function k(O, G, H) {
              for (var Q = Math.floor(O.length / G), at = O.length % G, rt = [], ut = 0, gt = 0; gt < G; gt++) {
                var bt = ut + gt * Q;
                gt < at && ut++;
                var kt = ut + (gt + 1) * Q, Yt = O.slice(bt, kt);
                H && gt >= at && Yt.push(H), rt.push(Yt);
              }
              return rt;
            }
            a.slice = k;
            function j(O, G, H) {
              return H === void 0 && (H = 0), G && (O = s.map(O, function(Q) {
                return Q[G];
              })), H + O.reduce(function(Q, at) {
                return Q + at;
              }, 0);
            }
            a.sum = j, a.sort = o.makeMacro(["value", "reverse", "case_sensitive", "attribute"], [], function(O, G, H, Q) {
              var at = this, rt = s.map(O, function(gt) {
                return gt;
              }), ut = s.getAttrGetter(Q);
              return rt.sort(function(gt, bt) {
                var kt = Q ? ut(gt) : gt, Yt = Q ? ut(bt) : bt;
                if (at.env.opts.throwOnUndefined && Q && (kt === void 0 || Yt === void 0))
                  throw new TypeError('sort: attribute "' + Q + '" resolved to undefined');
                return !H && s.isString(kt) && s.isString(Yt) && (kt = kt.toLowerCase(), Yt = Yt.toLowerCase()), kt < Yt ? G ? 1 : -1 : kt > Yt ? G ? -1 : 1 : 0;
              }), rt;
            });
            function z(O) {
              return o.copySafeness(O, O);
            }
            a.string = z;
            function U(O, G) {
              O = A(O, "");
              var H = /<\/?([a-z][a-z0-9]*)\b[^>]*>|<!--[\s\S]*?-->/gi, Q = tt(O.replace(H, "")), at = "";
              return G ? at = Q.replace(/^ +| +$/gm, "").replace(/ +/g, " ").replace(/(\r\n)/g, `
`).replace(/\n\n\n+/g, `

`) : at = Q.replace(/\s+/gi, " "), o.copySafeness(O, at);
            }
            a.striptags = U;
            function J(O) {
              O = A(O, "");
              var G = O.split(" ").map(function(H) {
                return u(H);
              });
              return o.copySafeness(O, G.join(" "));
            }
            a.title = J;
            function tt(O) {
              return o.copySafeness(O, O.replace(/^\s*|\s*$/g, ""));
            }
            a.trim = tt;
            function W(O, G, H, Q) {
              var at = O;
              if (O = A(O, ""), G = G || 255, O.length <= G)
                return O;
              if (H)
                O = O.substring(0, G);
              else {
                var rt = O.lastIndexOf(" ", G);
                rt === -1 && (rt = G), O = O.substring(0, rt);
              }
              return O += Q ?? "...", o.copySafeness(at, O);
            }
            a.truncate = W;
            function $(O) {
              return O = A(O, ""), O.toUpperCase();
            }
            a.upper = $;
            function ot(O) {
              var G = encodeURIComponent;
              if (s.isString(O))
                return G(O);
              var H = s.isArray(O) ? O : s._entries(O);
              return H.map(function(Q) {
                var at = Q[0], rt = Q[1];
                return G(at) + "=" + G(rt);
              }).join("&");
            }
            a.urlencode = ot;
            var et = /^(?:\(|<|&lt;)?(.*?)(?:\.|,|\)|\n|&gt;)?$/, Y = /^[\w.!#$%&'*+\-\/=?\^`{|}~]+@[a-z\d\-]+(\.[a-z\d\-]+)+$/i, q = /^https?:\/\/.*$/, K = /^www\./, ct = /\.(?:org|net|com)(?:\:|\/|$)/;
            function yt(O, G, H) {
              g(G) && (G = 1 / 0);
              var Q = H === !0 ? ' rel="nofollow"' : "", at = O.split(/(\s+)/).filter(function(rt) {
                return rt && rt.length;
              }).map(function(rt) {
                var ut = rt.match(et), gt = ut ? ut[1] : rt, bt = gt.substr(0, G);
                return q.test(gt) ? '<a href="' + gt + '"' + Q + ">" + bt + "</a>" : K.test(gt) ? '<a href="http://' + gt + '"' + Q + ">" + bt + "</a>" : Y.test(gt) ? '<a href="mailto:' + gt + '">' + gt + "</a>" : ct.test(gt) ? '<a href="http://' + gt + '"' + Q + ">" + bt + "</a>" : rt;
              });
              return at.join("");
            }
            a.urlize = yt;
            function wt(O) {
              O = A(O, "");
              var G = O ? O.match(/\w+/g) : null;
              return G ? G.length : null;
            }
            a.wordcount = wt;
            function ht(O, G) {
              var H = parseFloat(O);
              return g(H) ? G : H;
            }
            a.float = ht;
            var lt = o.makeMacro(["value", "default", "base"], [], function(O, G, H) {
              H === void 0 && (H = 10);
              var Q = parseInt(O, H);
              return g(Q) ? G : Q;
            });
            a.int = lt, a.d = a.default, a.e = a.escape;
          }),
          /* 19 */
          /***/
          (function(n, i, r) {
            function s(g, c) {
              g.prototype = Object.create(c.prototype), g.prototype.constructor = g, o(g, c);
            }
            function o(g, c) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(u, C) {
                return u.__proto__ = C, u;
              }, o(g, c);
            }
            var a = r(6), A = /* @__PURE__ */ (function(g) {
              s(c, g);
              function c(C) {
                var y;
                return y = g.call(this) || this, y.precompiled = C || {}, y;
              }
              var u = c.prototype;
              return u.getSource = function(C) {
                return this.precompiled[C] ? {
                  src: {
                    type: "code",
                    obj: this.precompiled[C]
                  },
                  path: C
                } : null;
              }, c;
            })(a);
            n.exports = {
              PrecompiledLoader: A
            };
          }),
          /* 20 */
          /***/
          (function(n, i, r) {
            var s = r(2).SafeString;
            function o(_) {
              return typeof _ == "function";
            }
            i.callable = o;
            function a(_) {
              return _ !== void 0;
            }
            i.defined = a;
            function A(_, P) {
              return _ % P === 0;
            }
            i.divisibleby = A;
            function g(_) {
              return _ instanceof s;
            }
            i.escaped = g;
            function c(_, P) {
              return _ === P;
            }
            i.equalto = c, i.eq = i.equalto, i.sameas = i.equalto;
            function u(_) {
              return _ % 2 === 0;
            }
            i.even = u;
            function C(_) {
              return !_;
            }
            i.falsy = C;
            function y(_, P) {
              return _ >= P;
            }
            i.ge = y;
            function w(_, P) {
              return _ > P;
            }
            i.greaterthan = w, i.gt = i.greaterthan;
            function l(_, P) {
              return _ <= P;
            }
            i.le = l;
            function f(_, P) {
              return _ < P;
            }
            i.lessthan = f, i.lt = i.lessthan;
            function p(_) {
              return _.toLowerCase() === _;
            }
            i.lower = p;
            function I(_, P) {
              return _ !== P;
            }
            i.ne = I;
            function b(_) {
              return _ === null;
            }
            i.null = b;
            function d(_) {
              return typeof _ == "number";
            }
            i.number = d;
            function h(_) {
              return _ % 2 === 1;
            }
            i.odd = h;
            function m(_) {
              return typeof _ == "string";
            }
            i.string = m;
            function v(_) {
              return !!_;
            }
            i.truthy = v;
            function E(_) {
              return _ === void 0;
            }
            i.undefined = E;
            function M(_) {
              return _.toUpperCase() === _;
            }
            i.upper = M;
            function x(_) {
              return typeof Symbol < "u" ? !!_[Symbol.iterator] : Array.isArray(_) || typeof _ == "string";
            }
            i.iterable = x;
            function S(_) {
              var P = _ != null && typeof _ == "object" && !Array.isArray(_);
              return Set ? P && !(_ instanceof Set) : P;
            }
            i.mapping = S;
          }),
          /* 21 */
          /***/
          (function(n, i, r) {
            function s(A) {
              var g = -1;
              return {
                current: null,
                reset: function() {
                  g = -1, this.current = null;
                },
                next: function() {
                  return g++, g >= A.length && (g = 0), this.current = A[g], this.current;
                }
              };
            }
            function o(A) {
              A = A || ",";
              var g = !0;
              return function() {
                var c = g ? "" : A;
                return g = !1, c;
              };
            }
            function a() {
              return {
                range: function(A, g, c) {
                  typeof g > "u" ? (g = A, A = 0, c = 1) : c || (c = 1);
                  var u = [];
                  if (c > 0)
                    for (var C = A; C < g; C += c)
                      u.push(C);
                  else
                    for (var y = A; y > g; y += c)
                      u.push(y);
                  return u;
                },
                cycler: function() {
                  return s(Array.prototype.slice.call(arguments));
                },
                joiner: function(A) {
                  return o(A);
                }
              };
            }
            n.exports = a;
          }),
          /* 22 */
          /***/
          (function(n, i, r) {
            var s = r(4);
            n.exports = function(o, a) {
              function A(g, c) {
                if (this.name = g, this.path = g, this.defaultEngine = c.defaultEngine, this.ext = s.extname(g), !this.ext && !this.defaultEngine)
                  throw new Error("No default engine was specified and no extension was provided.");
                this.ext || (this.name += this.ext = (this.defaultEngine[0] !== "." ? "." : "") + this.defaultEngine);
              }
              return A.prototype.render = function(g, c) {
                o.render(this.name, g, c);
              }, a.set("view", A), a.set("nunjucksEnv", o), o;
            };
          }),
          /* 23 */
          /***/
          (function(n, i, r) {
            var s = r(4), o = r(4), a = r(0), A = a._prettifyError, g = r(5), c = r(7), u = c.Environment, C = r(24);
            function y(p, I) {
              return Array.isArray(I) ? I.some(function(b) {
                return p.match(b);
              }) : !1;
            }
            function w(p, I) {
              I = I || {}, I.isString = !0;
              var b = I.env || new u([]), d = I.wrapper || C;
              if (!I.name)
                throw new Error('the "name" option is required when compiling a string');
              return d([f(p, I.name, b)], I);
            }
            function l(p, I) {
              I = I || {};
              var b = I.env || new u([]), d = I.wrapper || C;
              if (I.isString)
                return w(p, I);
              var h = s.existsSync(p) && s.statSync(p), m = [], v = [];
              function E(S) {
                s.readdirSync(S).forEach(function(_) {
                  var P = o.join(S, _), D = P.substr(o.join(p, "/").length), F = s.statSync(P);
                  F && F.isDirectory() ? (D += "/", y(D, I.exclude) || E(P)) : y(D, I.include) && v.push(P);
                });
              }
              if (h.isFile())
                m.push(f(s.readFileSync(p, "utf-8"), I.name || p, b));
              else if (h.isDirectory()) {
                E(p);
                for (var M = 0; M < v.length; M++) {
                  var x = v[M].replace(o.join(p, "/"), "");
                  try {
                    m.push(f(s.readFileSync(v[M], "utf-8"), x, b));
                  } catch (S) {
                    if (I.force)
                      console.error(S);
                    else
                      throw S;
                  }
                }
              }
              return d(m, I);
            }
            function f(p, I, b) {
              b = b || new u([]);
              var d = b.asyncFilters, h = b.extensionsList, m;
              I = I.replace(/\\/g, "/");
              try {
                m = g.compile(p, d, h, I, b.opts);
              } catch (v) {
                throw A(I, !1, v);
              }
              return {
                name: I,
                template: m
              };
            }
            n.exports = {
              precompile: l,
              precompileString: w
            };
          }),
          /* 24 */
          /***/
          (function(n, i, r) {
            function s(o, a) {
              var A = "";
              a = a || {};
              for (var g = 0; g < o.length; g++) {
                var c = JSON.stringify(o[g].name), u = o[g].template;
                A += "(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})[" + c + `] = (function() {
` + u + `
})();
`, a.asFunction && (A += "return function(ctx, cb) { return nunjucks.render(" + c + `, ctx, cb); }
`), A += `})();
`;
              }
              return A;
            }
            n.exports = s;
          }),
          /* 25 */
          /***/
          (function(n, i, r) {
            function s() {
              var o = this.runtime, a = this.lib, A = this.compiler.Compiler, g = this.parser.Parser, c = this.nodes, u = this.lexer, C = o.contextOrFrameLookup, y = o.memberLookup, w, l;
              A && (w = A.prototype.assertType), g && (l = g.prototype.parseAggregate);
              function f() {
                o.contextOrFrameLookup = C, o.memberLookup = y, A && (A.prototype.assertType = w), g && (g.prototype.parseAggregate = l);
              }
              o.contextOrFrameLookup = function(v, E, M) {
                var x = C.apply(this, arguments);
                if (x !== void 0)
                  return x;
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
              function p(v) {
                return {
                  index: v.index,
                  lineno: v.lineno,
                  colno: v.colno
                };
              }
              if (c && A && g) {
                var I = c.Node.extend("Slice", {
                  fields: ["start", "stop", "step"],
                  init: function(v, E, M, x, S) {
                    M = M || new c.Literal(v, E, null), x = x || new c.Literal(v, E, null), S = S || new c.Literal(v, E, 1), this.parent(v, E, M, x, S);
                  }
                });
                A.prototype.assertType = function(v) {
                  v instanceof I || w.apply(this, arguments);
                }, A.prototype.compileSlice = function(v, E) {
                  this._emit("("), this._compileExpression(v.start, E), this._emit("),("), this._compileExpression(v.stop, E), this._emit("),("), this._compileExpression(v.step, E), this._emit(")");
                }, g.prototype.parseAggregate = function() {
                  var v = this, E = p(this.tokens);
                  E.colno--, E.index--;
                  try {
                    return l.apply(this);
                  } catch (N) {
                    var M = p(this.tokens), x = function() {
                      return a._assign(v.tokens, M), N;
                    };
                    a._assign(this.tokens, E), this.peeked = !1;
                    var S = this.peekToken();
                    if (S.type !== u.TOKEN_LEFT_BRACKET)
                      throw x();
                    this.nextToken();
                    for (var _ = new I(S.lineno, S.colno), P = !1, D = 0; D <= _.fields.length && !this.skip(u.TOKEN_RIGHT_BRACKET); D++) {
                      if (D === _.fields.length)
                        if (P)
                          this.fail("parseSlice: too many slice components", S.lineno, S.colno);
                        else
                          break;
                      if (this.skip(u.TOKEN_COLON))
                        P = !0;
                      else {
                        var F = _.fields[D];
                        _[F] = this.parseExpression(), P = this.skip(u.TOKEN_COLON) || P;
                      }
                    }
                    if (!P)
                      throw x();
                    return new c.Array(S.lineno, S.colno, [_]);
                  }
                };
              }
              function b(v, E, M, x) {
                v = v || [], E === null && (E = x < 0 ? v.length - 1 : 0), M === null ? M = x < 0 ? -1 : v.length : M < 0 && (M += v.length), E < 0 && (E += v.length);
                for (var S = [], _ = E; !(_ < 0 || _ > v.length || x > 0 && _ >= M || x < 0 && _ <= M); _ += x)
                  S.push(o.memberLookup(v, _));
                return S;
              }
              function d(v, E) {
                return Object.prototype.hasOwnProperty.call(v, E);
              }
              var h = {
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
                  for (var E = 0; E < this.length; E++)
                    if (this[E] === v)
                      return this.splice(E, 1);
                  throw new Error("ValueError");
                },
                count: function(v) {
                  for (var E = 0, M = 0; M < this.length; M++)
                    this[M] === v && E++;
                  return E;
                },
                index: function(v) {
                  var E;
                  if ((E = this.indexOf(v)) === -1)
                    throw new Error("ValueError");
                  return E;
                },
                find: function(v) {
                  return this.indexOf(v);
                },
                insert: function(v, E) {
                  return this.splice(v, 0, E);
                }
              }, m = {
                items: function() {
                  return a._entries(this);
                },
                values: function() {
                  return a._values(this);
                },
                keys: function() {
                  return a.keys(this);
                },
                get: function(v, E) {
                  var M = this[v];
                  return M === void 0 && (M = E), M;
                },
                has_key: function(v) {
                  return d(this, v);
                },
                pop: function(v, E) {
                  var M = this[v];
                  if (M === void 0 && E !== void 0)
                    M = E;
                  else {
                    if (M === void 0)
                      throw new Error("KeyError");
                    delete this[v];
                  }
                  return M;
                },
                popitem: function() {
                  var v = a.keys(this);
                  if (!v.length)
                    throw new Error("KeyError");
                  var E = v[0], M = this[E];
                  return delete this[E], [E, M];
                },
                setdefault: function(v, E) {
                  return E === void 0 && (E = null), v in this || (this[v] = E), this[v];
                },
                update: function(v) {
                  return a._assign(this, v), null;
                }
              };
              return m.iteritems = m.items, m.itervalues = m.values, m.iterkeys = m.keys, o.memberLookup = function(v, E, M) {
                return arguments.length === 4 ? b.apply(this, arguments) : (v = v || {}, a.isArray(v) && d(h, E) ? h[E].bind(v) : a.isObject(v) && d(m, E) ? m[E].bind(v) : y.apply(this, arguments));
              }, f;
            }
            n.exports = s;
          })
          /******/
        ])
      );
    });
  })(js)), js.exports;
}
var Pf = Rf();
const Of = /* @__PURE__ */ _f(Pf);
function Lf(e) {
  const t = {};
  for (const [i, r] of Object.entries(e.templates))
    t[i] = Of.compile(r);
  const n = (i) => {
    i.result = {};
    for (const r of Object.keys(e.templates))
      i.result[r] = t[r].render(i.properties || {});
  };
  return "features" in e.geojson ? e.geojson.features.forEach(n) : n(e.geojson), e.geojson;
}
const Df = {
  templateExtractor: Lf
}, ss = /\{%-?\s*(end)?(raw|verbatim)\s*-?%\}/g;
function Bf(e) {
  if (!e.includes("{%")) return e;
  const t = [];
  ss.lastIndex = 0;
  for (let a = ss.exec(e); a; a = ss.exec(e))
    t.push({ start: a.index, end: a.index + a[0].length, close: !!a[1], kind: a[2] });
  if (t.length === 0) return e;
  const n = { raw: [], verbatim: [] };
  t.forEach((a, A) => {
    a.close && n[a.kind].push(A);
  });
  const i = { raw: 0, verbatim: 0 };
  let r = "", s = 0, o = 0;
  for (; o < t.length; ) {
    const a = t[o];
    if (a.close) {
      o++;
      continue;
    }
    const A = n[a.kind];
    let g = i[a.kind];
    for (; g < A.length && A[g] < o; ) g++;
    if (i[a.kind] = g, g === A.length) {
      o++;
      continue;
    }
    r += e.slice(s, a.start), s = t[A[g]].end, o = A[g] + 1;
  }
  return r + e.slice(s);
}
function aA(e, t, n) {
  const i = e.indexOf(t);
  return i >= 0 && e.indexOf(n, i + t.length) >= 0;
}
const Nf = 'MaplatApp: poiTemplate/iconTemplate written in the lodash.template syntax (<% %>, <%= %>, <%- %>, ${ }) is no longer evaluated since @maplat/core 1.3.0, and was ignored. Rewrite it in the Nunjucks syntax ({{ }}, {% %}); wrap literal "<%" or "${" in {% raw %}...{% endraw %}.', Ff = 'See the "Removed" section of the 1.3.0 CHANGELOG: https://github.com/code4history/MaplatCore/blob/master/CHANGELOG.md';
let AA = !1, gA = !1;
function pc(e) {
  return Array.from(e).slice(0, 80).join("");
}
function jf(e) {
  const t = Bf(e);
  return aA(t, "<%", "%>") || aA(t, "${", "}");
}
function Gf(e, t) {
  AA || (AA = !0, console.warn(`${Nf} First template found (${e}): "${pc(t)}". ${Ff}`));
}
function Gs(e, t) {
  if (gA) return;
  gA = !0;
  const i = (t instanceof Error ? t.message : String(t)).split(`
`).map((r) => r.trim()).filter((r) => r).join(" ");
  console.warn(`MaplatApp: a poiTemplate/iconTemplate failed to render and was ignored: ${i}. First template: "${pc(e)}".`);
}
function dc(e, t, n) {
  if (jf(t)) {
    Gf(e, t);
    return;
  }
  try {
    const i = { type: "Feature", geometry: null, properties: n };
    return Df.templateExtractor({ geojson: i, templates: { t } }), i.result.t;
  } catch (i) {
    Gs(t, i);
    return;
  }
}
function zf(e, t) {
  const n = dc("iconTemplate", e, t);
  if (n === void 0) return;
  let i;
  try {
    i = JSON.parse(n);
  } catch (r) {
    Gs(e, r);
    return;
  }
  if (i === null || typeof i != "object" || Array.isArray(i)) {
    Gs(e, new Error("iconTemplate did not produce a JSON object"));
    return;
  }
  return i;
}
function Uf(e, ...t) {
  const n = we(Object.assign({}, e));
  if (n.icon) return n;
  const i = t.reduce((r, s) => {
    if (r) return r;
    const o = s.iconTemplate, a = o ? zf(o, n) : void 0;
    if (a)
      return a;
    if (s.icon)
      return {
        icon: s.icon,
        selectedIcon: s.selectedIcon
      };
  }, void 0);
  return i && (n.icon = i.icon, n.selectedIcon = i.selectedIcon), n;
}
function Xf(e, ...t) {
  const n = we(e);
  return n.html ? n : t.reduce((i, r) => {
    if (i) return i;
    const s = r.poiTemplate;
    if (s) {
      const o = dc("poiTemplate", s, n);
      return o === void 0 ? void 0 : (n.html = o, n.poiStyle = n.poiStyle || r.poiStyle, n);
    }
  }, void 0) || n;
}
function cA(e, ...t) {
  const n = Uf(e, ...t);
  return Xf(n, ...t);
}
function Dn(e, t) {
  const n = e.getViewport(), i = t.getViewport();
  if (!n || !i) return [0, 0];
  const r = n.getBoundingClientRect(), s = i.getBoundingClientRect();
  return [r.left - s.left, r.top - s.top];
}
class Zf {
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
  constructor(t, n) {
    this.#e = t, this.#r = n;
    const i = t.getViewport(), r = n.getViewport();
    !i || !r || typeof ResizeObserver > "u" || (this.#s = new ResizeObserver(this.#n), this.#s.observe(i), this.#s.observe(r), t.on?.("change:size", this.#n), n.on?.("change:size", this.#n), i.addEventListener("pointerenter", this.#n), this.#i = i, this.#a = !0);
  }
  /** 取っておいた値。捨てられていれば測り直す。 */
  get() {
    return this.#a ? (this.#t || (this.#t = Dn(this.#e, this.#r)), this.#t) : Dn(this.#e, this.#r);
  }
  /** いま測り直して、その値を取っておく。 */
  refresh() {
    const t = Dn(this.#e, this.#r);
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
const mc = "marker", Vf = (e) => e.lnglat || [e.lng || e.longitude, e.lat || e.latitude];
async function ir(e, t) {
  const n = e.from;
  if (!n) return { kind: "skip" };
  const i = (o) => !!o && !!n.insideCheckSysCoord(o);
  if (t.coordinates) {
    const o = await n.merc2SysCoordAsync_ignoreBackground(t.coordinates);
    return i(o) ? { kind: "inside", xy: o } : { kind: "outside", merc: t.coordinates };
  }
  if (t.x && t.y) {
    const o = n.xy2SysCoord([t.x, t.y]);
    return i(o) ? { kind: "inside", xy: o } : { kind: "skip" };
  }
  const r = re(Vf(t), "EPSG:4326", "EPSG:3857"), s = await n.merc2SysCoordAsync_ignoreBackground(r);
  return i(s) ? { kind: "inside", xy: s } : { kind: "outside", merc: r };
}
async function Wf(e, t) {
  const n = await ir(e, { coordinates: t });
  if (n.kind === "inside") return { map: e.mapObject, coord: n.xy };
  if (n.kind === "outside") {
    if (xr(e.from)) return { map: e.mapObject, coord: t };
    if (e.backMap) return { map: e.backMap, coord: t };
  }
}
function os(e, t, n) {
  const i = e.from, r = e.mapObject, s = e.backMap;
  if (!i || !r || !s || xr(i)) return;
  const o = r.getCoordinateFromPixel(t);
  if (!o || i.insideCheckSysCoord(o)) return;
  const [a, A] = n ? n() : Dn(r, s), g = s.getCoordinateFromPixel([t[0] + a, t[1] + A]);
  return { merc: g ? [g[0], g[1]] : void 0 };
}
function xr(e) {
  return typeof e?.isWmts == "function" ? e.isWmts() === !0 : !1;
}
function yc(e) {
  return e.__hideOutsidePois || !e.from ? "none" : xr(e.from) ? "front" : e.backMap ? "back" : "none";
}
function Yf(e, t, n) {
  const i = yc(e), r = [], s = [];
  return t.forEach((o, a) => {
    const A = n[a];
    A.kind === "inside" ? r.push({ ...o, xy: A.xy }) : A.kind === "outside" && i === "back" ? s.push({ ...o, merc: A.merc }) : A.kind === "outside" && i === "front" && r.push({ ...o, xy: A.merc });
  }), { front: r, back: s };
}
function lA(e) {
  return e?.getSource ? e.getSource(mc) : void 0;
}
const uA = (e) => {
  const t = e.xy || e.merc, n = new jA({
    geometry: new jn(t),
    datum: e.data
  }), i = tc(e.icon);
  return i && n.setStyle(i), n;
};
function hA(e, t) {
  const n = lA(e.mapObject);
  if (!n) return;
  const i = e.backMap ? lA(e.backMap) : void 0;
  n.clear(), i && i.clear(), t.front.length > 0 && n.addFeatures(t.front.map(uA)), i && t.back.length > 0 && i.addFeatures(t.back.map(uA));
}
function Hf(e, t, n, i) {
  if (i.kind === "skip") return;
  const s = i.kind === "outside" && yc(e) === "back" ? e.backMap : e.mapObject;
  if (!s?.setMarker) return;
  const o = i.kind === "inside" ? i.xy : i.merc;
  s.setMarker(o, { datum: t }, n);
}
function Qf(e, t) {
  const n = e.from;
  return n?.insideCheckSysCoord ? !n.insideCheckSysCoord(t) : !1;
}
function IA(e, t) {
  const n = e.backMap;
  if (!n?.forEachFeatureAtPixel) return [];
  if (!Qf(e, t.coordinate)) return [];
  const i = n.getLayer ? n.getLayer(mc) : void 0, r = [];
  return n.forEachFeatureAtPixel(
    t.pixel,
    (s) => {
      const o = s?.get ? s.get("datum") : void 0;
      o && r.push(o);
    },
    i ? { layerFilter: (s) => s === i } : void 0
  ), r;
}
function zs(e, t) {
  if (!e.from || !t || e.__outsideSelection || e.__pendingView) return;
  const n = e.from, i = t.getCenter();
  if (i && !n.insideCheckSysCoord(i)) {
    const r = n.modulateSysCoordInside(i);
    r && t.setCenter(r);
  }
}
const Kf = (e) => {
  const t = re(e, "EPSG:3857", "EPSG:4326");
  return { longitude: t[0], latitude: t[1] };
};
function vc(e, t) {
  !e.from || !e.mapObject || (xr(e.from) ? e.mapObject.getView().setCenter(t) : e.setViewpoint && e.setViewpoint(Kf(t)));
}
function as(e, t, n) {
  const i = e.__outsideSelection;
  if (!i) return;
  const r = n?.recenter ?? !!i.pending;
  if (!t || t.kind === "skip") {
    delete e.__outsideSelection, delete e.__selectedMarker;
    const s = e.mapObject?.getView?.();
    s && zs(e, s);
    return;
  }
  if (t.kind === "inside") {
    delete e.__outsideSelection;
    const s = e.getMarker ? e.getMarker(i.id) : void 0;
    r && s && e.setViewpoint && e.setViewpoint({
      latitude: s.lnglat ? s.lnglat[1] : s.lat ?? s.latitude,
      longitude: s.lnglat ? s.lnglat[0] : s.lng ?? s.longitude
    });
    return;
  }
  e.__outsideSelection = { id: i.id, merc: t.merc }, r && vc(e, t.merc);
}
const Dt = {
  ACCURACY: "accuracy",
  ALTITUDE: "altitude",
  ALTITUDE_ACCURACY: "altitudeAccuracy",
  HEADING: "heading",
  POSITION: "position",
  SPEED: "speed",
  TRACKING: "tracking",
  TRACKING_OPTIONS: "trackingOptions"
}, Jf = {
  ERROR: "error"
};
class qf extends Le {
  code;
  message;
  constructor(t) {
    super(Jf.ERROR), this.code = t.code, this.message = t.message;
  }
}
class $f extends zn {
  task_id_;
  timer_base_ = !1;
  home_position_ = !1;
  constructor(t) {
    super(), t = t || {}, this.timer_base_ = t.timerBase !== void 0 ? t.timerBase : !1, this.task_id_ = void 0, this.home_position_ = t.homePosition !== void 0 ? t.homePosition : !1, this.addChangeListener(Dt.TRACKING, this.handleTrackingChanged_), t.trackingOptions !== void 0 ? this.setTrackingOptions(t.trackingOptions) : this.setTrackingOptions({
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
      const t = this.getTracking(), n = this.getTrackingOptions();
      t && this.task_id_ === void 0 ? window.confirm("Allow GPS?") ? this.task_id_ = setInterval(this.timerPositionChange_.bind(this), n.maximumAge) : setTimeout(this.timerPositionError_.bind(this), n.maximumAge * 10) : !t && this.task_id_ !== void 0 && (clearInterval(this.task_id_), this.task_id_ = void 0);
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
      longitude: rs(this.home_position_[0], 0.05),
      latitude: rs(this.home_position_[1], 0.05),
      accuracy: rs(15, 10)
    };
    this.positionChange_({ coords: t });
  }
  positionChange_(t) {
    const n = t.coords;
    this.set(Dt.ACCURACY, n.accuracy), this.set(
      Dt.ALTITUDE,
      n.altitude === null ? void 0 : n.altitude
    ), this.set(
      Dt.ALTITUDE_ACCURACY,
      n.altitudeAccuracy === null ? void 0 : n.altitudeAccuracy
    ), this.set(
      Dt.HEADING,
      n.heading === null ? void 0 : Pn(n.heading)
    ), this.set(Dt.POSITION, [n.longitude, n.latitude]), this.set(Dt.SPEED, n.speed === null ? void 0 : n.speed), this.changed();
  }
  timerPositionError_() {
    const t = Math.floor(Math.random() * 3) + 1, n = {
      code: t,
      message: t === 1 ? "User denied Geolocation" : t === 2 ? "Position unavailable" : "Timeout expired"
    };
    this.positionError_(n);
  }
  positionError_(t) {
    const n = new qf(t);
    this.dispatchEvent(n);
  }
  getAccuracy() {
    return this.get(Dt.ACCURACY);
  }
  getAltitude() {
    return this.get(Dt.ALTITUDE);
  }
  getAltitudeAccuracy() {
    return this.get(Dt.ALTITUDE_ACCURACY);
  }
  getHeading() {
    return this.get(Dt.HEADING);
  }
  getPosition() {
    return this.get(Dt.POSITION);
  }
  getSpeed() {
    return this.get(Dt.SPEED);
  }
  getTracking() {
    return this.get(Dt.TRACKING);
  }
  getTrackingOptions() {
    return this.get(Dt.TRACKING_OPTIONS);
  }
  setTracking(t) {
    this.set(Dt.TRACKING, t);
  }
  setTrackingOptions(t) {
    this.set(Dt.TRACKING_OPTIONS, t);
  }
}
const tp = () => {
  const e = window.navigator.userAgent.toLowerCase();
  try {
    let t;
    return e.indexOf("chrome") != -1 ? (t = (navigator.languages[0] || navigator.browserLanguage || navigator.language || navigator.userLanguage).split(";"), t[0]) : (t = (navigator.browserLanguage || navigator.language || navigator.userLanguage).split(";"), t[0]);
  } catch {
    return "";
  }
}, ep = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="105px" height="22px" viewBox="0 0 105 22" enable-background="new 0 0 105 22" xml:space="preserve"><g><g opacity="0.8"><path fill="#FFFFFF" d="M59.77,11.44l-0.93-2.32c-0.16-0.4-0.36-0.81-0.61-1.22c-0.26-0.42-0.6-0.85-1.01-1.27 c-0.49-0.5-1.1-0.9-1.8-1.2c-0.71-0.3-1.49-0.46-2.3-0.46c-1.16,0-2.25,0.3-3.19,0.87V0.48h-5.98v4.77H42 c-0.54-0.18-1.12-0.27-1.72-0.27c-1.68,0-3.21,0.66-4.44,1.92c-0.09,0.09-0.18,0.19-0.26,0.29c-0.1-0.12-0.21-0.24-0.33-0.35 c-1.26-1.23-2.81-1.86-4.6-1.86c-1.77,0-3.36,0.64-4.6,1.86c-0.11,0.11-0.22,0.22-0.32,0.34c-0.1-0.12-0.21-0.23-0.32-0.34 c-1.26-1.23-2.81-1.86-4.6-1.86c-1.55,0-2.91,0.46-4.06,1.38h-2.47l2.46-2.46l-1.48-1.41C13.53,0.83,11.46,0,9.08,0 C6.62,0,4.47,0.88,2.7,2.62C0.91,4.38,0,6.51,0,8.98s0.91,4.61,2.7,6.36c1.78,1.74,3.93,2.62,6.39,2.62 c2.56,0,4.68-0.87,6.28-2.54c0.04-0.04,0.08-0.08,0.12-0.13c0.21,0.29,0.44,0.56,0.7,0.81c1.24,1.22,2.83,1.86,4.6,1.86 c1.8,0,3.34-0.62,4.6-1.86c0.11-0.11,0.22-0.22,0.32-0.34c0.1,0.12,0.21,0.23,0.32,0.34c1.24,1.22,2.83,1.86,4.6,1.86 c1.26,0,2.4-0.31,3.4-0.92l0.45,1.07c0.43,1.02,1.13,1.91,2.08,2.66c1.04,0.81,2.3,1.23,3.75,1.23c1.78,0,3.29-0.58,4.47-1.73 c0.71-0.69,1.21-1.55,1.5-2.58h3.64v-0.67c1,0.62,2.16,0.94,3.42,0.94c1.3,0,2.44-0.32,3.39-0.94c0.85-0.55,1.53-1.21,2.02-1.94 l1.11-1.66l-1.87-1.25L59.77,11.44z"/><path fill="#FFFFFF" d="M105,10.11l-0.74-1.84c-0.42-1.05-1.13-1.86-2.1-2.43c-0.89-0.51-1.89-0.77-2.98-0.77 c-1.31,0-2.48,0.35-3.48,1.05c-0.24,0.17-0.45,0.36-0.65,0.56c-1.11-1.05-2.46-1.61-3.95-1.61c-0.63,0-1.22,0.09-1.78,0.27h-4.63 v0.6c-0.93-0.58-2-0.87-3.21-0.87c-1.26,0-2.34,0.31-3.22,0.9V1.5h-4.73l-3.11,5.45l-3.1-5.45H62.6v16.19h5.57V15.1h0.65h3.24 h0.65v2.59h5.57v-0.37c0.77,0.42,1.65,0.64,2.62,0.64c0.64,0,1.23-0.09,1.78-0.27h2.03v3.68h5.57v-3.46 c0.27,0.04,0.56,0.06,0.84,0.06c1.5,0,2.87-0.57,3.98-1.64c0.2,0.2,0.42,0.39,0.65,0.56c0.96,0.72,2.14,1.08,3.51,1.08 c1.43,0,2.65-0.4,3.63-1.2c1.08-0.88,1.66-2.07,1.66-3.42c0-0.97-0.32-1.89-0.93-2.66L105,10.11z"/></g><g><g><path fill="#474747" d="M9.08,8.35v1.9h4.58c-0.14,1.04-0.48,1.84-1.04,2.4c-0.94,0.93-2.11,1.4-3.53,1.4 c-1.4,0-2.58-0.49-3.55-1.48c-0.97-0.98-1.46-2.18-1.46-3.59c0-1.41,0.48-2.6,1.45-3.59C6.5,4.4,7.68,3.91,9.08,3.91 c1.33,0,2.47,0.45,3.44,1.36l1.35-1.35C12.53,2.64,10.93,2,9.08,2C7.15,2,5.49,2.68,4.09,4.05C2.7,5.42,2,7.06,2,8.98 c0,1.92,0.7,3.56,2.09,4.93c1.4,1.37,3.06,2.05,4.99,2.05c2,0,3.63-0.65,4.87-1.96c1.1-1.1,1.65-2.59,1.65-4.46 c0-0.45-0.03-0.85-0.1-1.19H9.08z"/><path fill="#474747" d="M42.72,7.97h-0.07c-0.24-0.29-0.57-0.53-0.98-0.72c-0.42-0.19-0.88-0.29-1.39-0.29 c-1.14,0-2.15,0.44-3.01,1.32c-0.86,0.88-1.29,1.94-1.29,3.19c0,1.24,0.43,2.3,1.29,3.17c0.86,0.87,1.86,1.31,3.01,1.31 c1.02,0,1.81-0.34,2.37-1.02h0.07v0.65c0,0.85-0.21,1.51-0.64,1.96c-0.42,0.45-1.01,0.68-1.76,0.68c-0.55,0-1.02-0.16-1.41-0.48 c-0.38-0.31-0.67-0.69-0.85-1.12l-1.72,0.72c0.29,0.71,0.78,1.33,1.46,1.86c0.68,0.53,1.52,0.8,2.52,0.8 c1.25,0,2.27-0.39,3.07-1.17c0.8-0.78,1.2-1.95,1.2-3.52V7.24h-1.87V7.97z M42.16,13.42c-0.46,0.51-1.03,0.77-1.71,0.77 c-0.69,0-1.28-0.26-1.77-0.78c-0.49-0.51-0.73-1.16-0.73-1.93c0-0.78,0.24-1.44,0.73-1.96c0.49-0.52,1.08-0.78,1.77-0.78 c0.68,0,1.25,0.26,1.71,0.79c0.46,0.52,0.69,1.18,0.69,1.96C42.85,12.26,42.62,12.9,42.16,13.42z"/><path fill="#474747" d="M20.8,6.97c-1.26,0-2.33,0.43-3.2,1.29s-1.31,1.93-1.31,3.21c0,1.28,0.44,2.35,1.31,3.21 s1.94,1.29,3.2,1.29s2.33-0.43,3.2-1.29c0.88-0.86,1.31-1.93,1.31-3.21c0-1.28-0.44-2.35-1.31-3.21S22.06,6.97,20.8,6.97z M22.59,13.42c-0.5,0.51-1.1,0.77-1.79,0.77s-1.29-0.25-1.79-0.77c-0.5-0.52-0.75-1.17-0.75-1.95c0-0.8,0.25-1.45,0.74-1.96 c0.5-0.51,1.1-0.77,1.8-0.77S22.1,9,22.6,9.51c0.49,0.51,0.74,1.17,0.74,1.96C23.34,12.25,23.09,12.9,22.59,13.42z"/><rect x="45.95" y="2.48" fill="#474747" width="1.98" height="13.21"/><path fill="#474747" d="M53.34,14.2c-0.99,0-1.71-0.45-2.18-1.36l6.01-2.49l-0.2-0.51c-0.11-0.3-0.26-0.59-0.44-0.89 c-0.18-0.29-0.42-0.6-0.73-0.91c-0.31-0.32-0.69-0.57-1.16-0.77c-0.47-0.2-0.97-0.3-1.52-0.3c-1.19,0-2.19,0.42-3.01,1.26 c-0.82,0.84-1.23,1.92-1.23,3.24c0,1.27,0.43,2.34,1.28,3.2c0.85,0.86,1.91,1.29,3.18,1.29c0.91,0,1.68-0.2,2.29-0.6 c0.63-0.41,1.11-0.87,1.45-1.38l-1.53-1.02C54.99,13.79,54.25,14.2,53.34,14.2z M51.56,9.43c0.51-0.48,1.05-0.72,1.63-0.72 c0.39,0,0.73,0.08,1.04,0.26c0.31,0.18,0.52,0.41,0.63,0.69l-4.02,1.67C50.82,10.54,51.06,9.9,51.56,9.43z"/><path fill="#474747" d="M30.65,6.97c-1.26,0-2.33,0.43-3.2,1.29s-1.31,1.93-1.31,3.21c0,1.28,0.44,2.35,1.31,3.21 s1.94,1.29,3.2,1.29c1.26,0,2.33-0.43,3.2-1.29c0.87-0.86,1.31-1.93,1.31-3.21c0-1.28-0.44-2.35-1.31-3.21S31.91,6.97,30.65,6.97 z M32.44,13.42c-0.5,0.51-1.1,0.77-1.79,0.77s-1.29-0.25-1.79-0.77c-0.5-0.52-0.75-1.17-0.75-1.95c0-0.8,0.25-1.45,0.74-1.96 c0.5-0.51,1.1-0.77,1.8-0.77c0.71,0,1.31,0.26,1.8,0.77s0.74,1.17,0.74,1.96C33.19,12.25,32.94,12.9,32.44,13.42z"/></g><g><polygon fill="#474747" points="70.48,10.92 70.41,10.92 66.17,3.5 64.6,3.5 64.6,15.69 66.17,15.69 66.17,8.45 66.1,6.41 66.17,6.41 69.98,13.1 70.9,13.1 74.72,6.41 74.79,6.41 74.72,8.45 74.72,15.69 76.29,15.69 76.29,3.5 74.72,3.5 "/><path fill="#474747" d="M81.5,7.07c-0.93,0-1.68,0.21-2.25,0.64S78.3,8.6,78.11,9.1l1.44,0.61c0.14-0.38,0.39-0.67,0.76-0.89 c0.36-0.21,0.78-0.32,1.23-0.32c0.61,0,1.13,0.18,1.55,0.55c0.42,0.37,0.63,0.86,0.63,1.47v0.24c-0.59-0.34-1.34-0.51-2.26-0.51 c-1.04,0-1.91,0.25-2.61,0.77c-0.71,0.52-1.06,1.23-1.06,2.14c0,0.84,0.29,1.52,0.89,2.03c0.59,0.51,1.33,0.77,2.22,0.77 c1.21,0,2.12-0.47,2.75-1.43h0.07v1.16h1.5v-5.04c0-1.14-0.36-2.02-1.06-2.64C83.45,7.38,82.57,7.07,81.5,7.07z M82.92,13.81 c-0.53,0.48-1.11,0.72-1.76,0.72c-0.46,0-0.86-0.12-1.21-0.35c-0.35-0.24-0.53-0.56-0.53-0.97c0-0.44,0.19-0.83,0.58-1.16 s0.96-0.49,1.72-0.49c0.88,0,1.55,0.18,1.99,0.54C83.71,12.76,83.45,13.33,82.92,13.81z"/><path fill="#474747" d="M91.12,7.08c-0.63,0-1.2,0.14-1.71,0.41c-0.5,0.27-0.88,0.61-1.13,1.02h-0.07V7.35h-1.5v12.02h1.57v-3.68 l-0.07-1.16h0.07c0.25,0.41,0.62,0.75,1.13,1.02c0.5,0.27,1.07,0.41,1.71,0.41c1.08,0,2.01-0.42,2.79-1.26 c0.79-0.85,1.18-1.91,1.18-3.17c0-1.26-0.4-2.32-1.18-3.17C93.13,7.51,92.2,7.08,91.12,7.08z M92.73,13.7 c-0.52,0.55-1.14,0.83-1.87,0.83c-0.73,0-1.36-0.27-1.88-0.82c-0.51-0.55-0.77-1.28-0.77-2.2s0.25-1.66,0.77-2.2 c0.51-0.55,1.14-0.82,1.88-0.82c0.72,0,1.35,0.28,1.87,0.83c0.52,0.55,0.78,1.28,0.78,2.19C93.51,12.42,93.25,13.15,92.73,13.7z" /><path fill="#474747" d="M101.96,11.84c-0.38-0.45-0.96-0.76-1.74-0.94l-1.65-0.39c-0.74-0.17-1.11-0.49-1.11-0.97 c0-0.33,0.16-0.59,0.48-0.78s0.71-0.29,1.18-0.29c0.97,0,1.6,0.37,1.91,1.11l1.36-0.56c-0.25-0.63-0.66-1.1-1.24-1.44 c-0.58-0.33-1.24-0.5-1.98-0.5c-0.89,0-1.67,0.23-2.32,0.69c-0.65,0.46-0.98,1.06-0.98,1.8c0,0.65,0.24,1.16,0.72,1.54 s0.99,0.63,1.52,0.77l1.69,0.41c0.76,0.2,1.14,0.57,1.14,1.11c0,0.35-0.16,0.63-0.47,0.85c-0.31,0.21-0.71,0.32-1.2,0.32 c-1.06,0-1.82-0.53-2.26-1.57l-1.4,0.58c0.29,0.68,0.73,1.25,1.34,1.7c0.61,0.45,1.38,0.68,2.31,0.68c0.96,0,1.75-0.25,2.34-0.75 c0.61-0.5,0.92-1.12,0.92-1.87C102.52,12.78,102.33,12.28,101.96,11.84z"/></g></g></g></svg>', np = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="105px" height="22px" viewBox="0 0 105 22" enable-background="new 0 0 105 22" xml:space="preserve"><g><g opacity="0.8"><path fill="#1E1E1E" d="M59.77,11.44l-0.93-2.32c-0.16-0.4-0.36-0.81-0.61-1.22c-0.26-0.42-0.6-0.85-1.01-1.27 c-0.49-0.5-1.1-0.9-1.8-1.2c-0.71-0.3-1.49-0.46-2.3-0.46c-1.16,0-2.25,0.3-3.19,0.87V0.48h-5.98v4.77H42 c-0.54-0.18-1.12-0.27-1.72-0.27c-1.68,0-3.21,0.66-4.44,1.92c-0.09,0.09-0.18,0.19-0.26,0.29c-0.1-0.12-0.21-0.24-0.33-0.35 c-1.26-1.23-2.81-1.86-4.6-1.86c-1.77,0-3.36,0.64-4.6,1.86c-0.11,0.11-0.22,0.22-0.32,0.34c-0.1-0.12-0.21-0.23-0.32-0.34 c-1.26-1.23-2.81-1.86-4.6-1.86c-1.55,0-2.91,0.46-4.06,1.38h-2.47l2.46-2.46l-1.48-1.41C13.53,0.83,11.46,0,9.08,0 C6.62,0,4.47,0.88,2.7,2.62C0.91,4.38,0,6.51,0,8.98s0.91,4.61,2.7,6.36c1.78,1.74,3.93,2.62,6.39,2.62 c2.56,0,4.68-0.87,6.28-2.54c0.04-0.04,0.08-0.08,0.12-0.13c0.21,0.29,0.44,0.56,0.7,0.81c1.24,1.22,2.83,1.86,4.6,1.86 c1.8,0,3.34-0.62,4.6-1.86c0.11-0.11,0.22-0.22,0.32-0.34c0.1,0.12,0.21,0.23,0.32,0.34c1.24,1.22,2.83,1.86,4.6,1.86 c1.26,0,2.4-0.31,3.4-0.92l0.45,1.07c0.43,1.02,1.13,1.91,2.08,2.66c1.04,0.81,2.3,1.23,3.75,1.23c1.78,0,3.29-0.58,4.47-1.73 c0.71-0.69,1.21-1.55,1.5-2.58h3.64v-0.67c1,0.62,2.16,0.94,3.42,0.94c1.3,0,2.44-0.32,3.39-0.94c0.85-0.55,1.53-1.21,2.02-1.94 l1.11-1.66l-1.87-1.25L59.77,11.44z"/><path fill="#1E1E1E" d="M105,10.11l-0.74-1.84c-0.42-1.05-1.13-1.86-2.1-2.43c-0.89-0.51-1.89-0.77-2.98-0.77 c-1.31,0-2.48,0.35-3.48,1.05c-0.24,0.17-0.45,0.36-0.65,0.56c-1.11-1.05-2.46-1.61-3.95-1.61c-0.63,0-1.22,0.09-1.78,0.27h-4.63 v0.6c-0.93-0.58-2-0.87-3.21-0.87c-1.26,0-2.34,0.31-3.22,0.9V1.5h-4.73l-3.11,5.45l-3.1-5.45H62.6v16.19h5.57V15.1h0.65h3.24 h0.65v2.59h5.57v-0.37c0.77,0.42,1.65,0.64,2.62,0.64c0.64,0,1.23-0.09,1.78-0.27h2.03v3.68h5.57v-3.46 c0.27,0.04,0.56,0.06,0.84,0.06c1.5,0,2.87-0.57,3.98-1.64c0.2,0.2,0.42,0.39,0.65,0.56c0.96,0.72,2.14,1.08,3.51,1.08 c1.43,0,2.65-0.4,3.63-1.2c1.08-0.88,1.66-2.07,1.66-3.42c0-0.97-0.32-1.89-0.93-2.66L105,10.11z"/></g><g><g><path fill="#FFFFFF" d="M9.08,8.35v1.9h4.58c-0.14,1.04-0.48,1.84-1.04,2.4c-0.94,0.93-2.11,1.4-3.53,1.4 c-1.4,0-2.58-0.49-3.55-1.48c-0.97-0.98-1.46-2.18-1.46-3.59c0-1.41,0.48-2.6,1.45-3.59C6.5,4.4,7.68,3.91,9.08,3.91 c1.33,0,2.47,0.45,3.44,1.36l1.35-1.35C12.53,2.64,10.93,2,9.08,2C7.15,2,5.49,2.68,4.09,4.05C2.7,5.42,2,7.06,2,8.98 c0,1.92,0.7,3.56,2.09,4.93c1.4,1.37,3.06,2.05,4.99,2.05c2,0,3.63-0.65,4.87-1.96c1.1-1.1,1.65-2.59,1.65-4.46 c0-0.45-0.03-0.85-0.1-1.19H9.08z"/><path fill="#FFFFFF" d="M42.72,7.97h-0.07c-0.24-0.29-0.57-0.53-0.98-0.72c-0.42-0.19-0.88-0.29-1.39-0.29 c-1.14,0-2.15,0.44-3.01,1.32c-0.86,0.88-1.29,1.94-1.29,3.19c0,1.24,0.43,2.3,1.29,3.17c0.86,0.87,1.86,1.31,3.01,1.31 c1.02,0,1.81-0.34,2.37-1.02h0.07v0.65c0,0.85-0.21,1.51-0.64,1.96c-0.42,0.45-1.01,0.68-1.76,0.68c-0.55,0-1.02-0.16-1.41-0.48 c-0.38-0.31-0.67-0.69-0.85-1.12l-1.72,0.72c0.29,0.71,0.78,1.33,1.46,1.86c0.68,0.53,1.52,0.8,2.52,0.8 c1.25,0,2.27-0.39,3.07-1.17c0.8-0.78,1.2-1.95,1.2-3.52V7.24h-1.87V7.97z M42.16,13.42c-0.46,0.51-1.03,0.77-1.71,0.77 c-0.69,0-1.28-0.26-1.77-0.78c-0.49-0.51-0.73-1.16-0.73-1.93c0-0.78,0.24-1.44,0.73-1.96c0.49-0.52,1.08-0.78,1.77-0.78 c0.68,0,1.25,0.26,1.71,0.79c0.46,0.52,0.69,1.18,0.69,1.96C42.85,12.26,42.62,12.9,42.16,13.42z"/><path fill="#FFFFFF" d="M20.8,6.97c-1.26,0-2.33,0.43-3.2,1.29s-1.31,1.93-1.31,3.21c0,1.28,0.44,2.35,1.31,3.21 s1.94,1.29,3.2,1.29s2.33-0.43,3.2-1.29c0.88-0.86,1.31-1.93,1.31-3.21c0-1.28-0.44-2.35-1.31-3.21S22.06,6.97,20.8,6.97z M22.59,13.42c-0.5,0.51-1.1,0.77-1.79,0.77s-1.29-0.25-1.79-0.77c-0.5-0.52-0.75-1.17-0.75-1.95c0-0.8,0.25-1.45,0.74-1.96 c0.5-0.51,1.1-0.77,1.8-0.77S22.1,9,22.6,9.51c0.49,0.51,0.74,1.17,0.74,1.96C23.34,12.25,23.09,12.9,22.59,13.42z"/><rect x="45.95" y="2.48" fill="#FFFFFF" width="1.98" height="13.21"/><path fill="#FFFFFF" d="M53.34,14.2c-0.99,0-1.71-0.45-2.18-1.36l6.01-2.49l-0.2-0.51c-0.11-0.3-0.26-0.59-0.44-0.89 c-0.18-0.29-0.42-0.6-0.73-0.91c-0.31-0.32-0.69-0.57-1.16-0.77c-0.47-0.2-0.97-0.3-1.52-0.3c-1.19,0-2.19,0.42-3.01,1.26 c-0.82,0.84-1.23,1.92-1.23,3.24c0,1.27,0.43,2.34,1.28,3.2c0.85,0.86,1.91,1.29,3.18,1.29c0.91,0,1.68-0.2,2.29-0.6 c0.63-0.41,1.11-0.87,1.45-1.38l-1.53-1.02C54.99,13.79,54.25,14.2,53.34,14.2z M51.56,9.43c0.51-0.48,1.05-0.72,1.63-0.72 c0.39,0,0.73,0.08,1.04,0.26c0.31,0.18,0.52,0.41,0.63,0.69l-4.02,1.67C50.82,10.54,51.06,9.9,51.56,9.43z"/><path fill="#FFFFFF" d="M30.65,6.97c-1.26,0-2.33,0.43-3.2,1.29s-1.31,1.93-1.31,3.21c0,1.28,0.44,2.35,1.31,3.21 s1.94,1.29,3.2,1.29c1.26,0,2.33-0.43,3.2-1.29c0.87-0.86,1.31-1.93,1.31-3.21c0-1.28-0.44-2.35-1.31-3.21S31.91,6.97,30.65,6.97 z M32.44,13.42c-0.5,0.51-1.1,0.77-1.79,0.77s-1.29-0.25-1.79-0.77c-0.5-0.52-0.75-1.17-0.75-1.95c0-0.8,0.25-1.45,0.74-1.96 c0.5-0.51,1.1-0.77,1.8-0.77c0.71,0,1.31,0.26,1.8,0.77s0.74,1.17,0.74,1.96C33.19,12.25,32.94,12.9,32.44,13.42z"/></g><g><polygon fill="#FFFFFF" points="70.48,10.92 70.41,10.92 66.17,3.5 64.6,3.5 64.6,15.69 66.17,15.69 66.17,8.45 66.1,6.41 66.17,6.41 69.98,13.1 70.9,13.1 74.72,6.41 74.79,6.41 74.72,8.45 74.72,15.69 76.29,15.69 76.29,3.5 74.72,3.5 "/><path fill="#FFFFFF" d="M81.5,7.07c-0.93,0-1.68,0.21-2.25,0.64S78.3,8.6,78.11,9.1l1.44,0.61c0.14-0.38,0.39-0.67,0.76-0.89 c0.36-0.21,0.78-0.32,1.23-0.32c0.61,0,1.13,0.18,1.55,0.55c0.42,0.37,0.63,0.86,0.63,1.47v0.24c-0.59-0.34-1.34-0.51-2.26-0.51 c-1.04,0-1.91,0.25-2.61,0.77c-0.71,0.52-1.06,1.23-1.06,2.14c0,0.84,0.29,1.52,0.89,2.03c0.59,0.51,1.33,0.77,2.22,0.77 c1.21,0,2.12-0.47,2.75-1.43h0.07v1.16h1.5v-5.04c0-1.14-0.36-2.02-1.06-2.64C83.45,7.38,82.57,7.07,81.5,7.07z M82.92,13.81 c-0.53,0.48-1.11,0.72-1.76,0.72c-0.46,0-0.86-0.12-1.21-0.35c-0.35-0.24-0.53-0.56-0.53-0.97c0-0.44,0.19-0.83,0.58-1.16 s0.96-0.49,1.72-0.49c0.88,0,1.55,0.18,1.99,0.54C83.71,12.76,83.45,13.33,82.92,13.81z"/><path fill="#FFFFFF" d="M91.12,7.08c-0.63,0-1.2,0.14-1.71,0.41c-0.5,0.27-0.88,0.61-1.13,1.02h-0.07V7.35h-1.5v12.02h1.57v-3.68 l-0.07-1.16h0.07c0.25,0.41,0.62,0.75,1.13,1.02c0.5,0.27,1.07,0.41,1.71,0.41c1.08,0,2.01-0.42,2.79-1.26 c0.79-0.85,1.18-1.91,1.18-3.17c0-1.26-0.4-2.32-1.18-3.17C93.13,7.51,92.2,7.08,91.12,7.08z M92.73,13.7 c-0.52,0.55-1.14,0.83-1.87,0.83c-0.73,0-1.36-0.27-1.88-0.82c-0.51-0.55-0.77-1.28-0.77-2.2s0.25-1.66,0.77-2.2 c0.51-0.55,1.14-0.82,1.88-0.82c0.72,0,1.35,0.28,1.87,0.83c0.52,0.55,0.78,1.28,0.78,2.19C93.51,12.42,93.25,13.15,92.73,13.7z" /><path fill="#FFFFFF" d="M101.96,11.84c-0.38-0.45-0.96-0.76-1.74-0.94l-1.65-0.39c-0.74-0.17-1.11-0.49-1.11-0.97 c0-0.33,0.16-0.59,0.48-0.78s0.71-0.29,1.18-0.29c0.97,0,1.6,0.37,1.91,1.11l1.36-0.56c-0.25-0.63-0.66-1.1-1.24-1.44 c-0.58-0.33-1.24-0.5-1.98-0.5c-0.89,0-1.67,0.23-2.32,0.69c-0.65,0.46-0.98,1.06-0.98,1.8c0,0.65,0.24,1.16,0.72,1.54 s0.99,0.63,1.52,0.77l1.69,0.41c0.76,0.2,1.14,0.57,1.14,1.11c0,0.35-0.16,0.63-0.47,0.85c-0.31,0.21-0.71,0.32-1.2,0.32 c-1.06,0-1.82-0.53-2.26-1.57l-1.4,0.58c0.29,0.68,0.73,1.25,1.34,1.7c0.61,0.45,1.38,0.68,2.31,0.68c0.96,0,1.75-0.25,2.34-0.75 c0.61-0.5,0.92-1.12,0.92-1.87C102.52,12.78,102.33,12.28,101.96,11.84z"/></g></g></g></svg>';
/*! @license DOMPurify 3.4.17 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.17/LICENSE */
function CA(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, i = Array(t); n < t; n++) i[n] = e[n];
  return i;
}
function ip(e) {
  if (Array.isArray(e)) return e;
}
function rp(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var i, r, s, o, a = [], A = !0, g = !1;
    try {
      if (s = (n = n.call(e)).next, t !== 0) for (; !(A = (i = s.call(n)).done) && (a.push(i.value), a.length !== t); A = !0) ;
    } catch (c) {
      g = !0, r = c;
    } finally {
      try {
        if (!A && n.return != null && (o = n.return(), Object(o) !== o)) return;
      } finally {
        if (g) throw r;
      }
    }
    return a;
  }
}
function sp() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
function op(e, t) {
  return ip(e) || rp(e, t) || ap(e, t) || sp();
}
function ap(e, t) {
  if (e) {
    if (typeof e == "string") return CA(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? CA(e, t) : void 0;
  }
}
const wc = Object.entries, fA = Object.setPrototypeOf, Ap = Object.isFrozen, bc = Object.getPrototypeOf, Ec = Object.getOwnPropertyDescriptor;
let Lt = Object.freeze, Gt = Object.seal, En = Object.create, xc = typeof Reflect < "u" && Reflect, Us = xc.apply, Xs = xc.construct;
Lt || (Lt = function(t) {
  return t;
});
Gt || (Gt = function(t) {
  return t;
});
Us || (Us = function(t, n) {
  for (var i = arguments.length, r = new Array(i > 2 ? i - 2 : 0), s = 2; s < i; s++) r[s - 2] = arguments[s];
  return t.apply(n, r);
});
Xs || (Xs = function(t) {
  for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++) i[r - 1] = arguments[r];
  return new t(...i);
});
const Te = Et(Array.prototype.forEach), gp = Et(Array.prototype.lastIndexOf), pA = Et(Array.prototype.pop), ei = Et(Array.prototype.push), cp = Et(Array.prototype.slice), lp = Et(Array.prototype.splice), Bn = Array.isArray, As = Mc(Set), gs = Et(Set.prototype.add), ni = Et(Set.prototype.has), Qe = Et(String.prototype.toLowerCase), cs = Et(String.prototype.toString), dA = Et(String.prototype.match), ii = Et(String.prototype.replace), mA = Et(String.prototype.indexOf), up = Et(String.prototype.trim), hp = Et(Number.prototype.toString), Ip = Et(Boolean.prototype.toString), yA = typeof BigInt > "u" ? null : Et(BigInt.prototype.toString), vA = typeof Symbol > "u" ? null : Et(Symbol.prototype.toString), ne = Et(Object.prototype.hasOwnProperty), ri = Et(Object.prototype.toString), Bt = Et(RegExp.prototype.test), _e = Mc(TypeError);
function Et(e) {
  return function(t) {
    t instanceof RegExp && (t.lastIndex = 0);
    for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++) i[r - 1] = arguments[r];
    return Us(e, t, i);
  };
}
function Mc(e) {
  return function() {
    for (var t = arguments.length, n = new Array(t), i = 0; i < t; i++) n[i] = arguments[i];
    return Xs(e, n);
  };
}
function dt(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Qe;
  if (fA && fA(e, null), !Bn(t)) return e;
  let i = t.length;
  for (; i--; ) {
    let r = t[i];
    if (typeof r == "string") {
      const s = n(r);
      s !== r && (Ap(t) || (t[i] = s), r = s);
    }
    e[r] = !0;
  }
  return e;
}
function Cp(e) {
  for (let t = 0; t < e.length; t++) ne(e, t) || (e[t] = null);
  return e;
}
function oe(e) {
  const t = En(null);
  for (const i of wc(e)) {
    var n = op(i, 2);
    const r = n[0], s = n[1];
    ne(e, r) && (Bn(s) ? t[r] = Cp(s) : s && typeof s == "object" && s.constructor === Object ? t[r] = oe(s) : t[r] = s);
  }
  return t;
}
function fp(e) {
  switch (typeof e) {
    case "string":
      return e;
    case "number":
      return hp(e);
    case "boolean":
      return Ip(e);
    case "bigint":
      return yA ? yA(e) : "0";
    case "symbol":
      return vA ? vA(e) : "Symbol()";
    case "undefined":
      return ri(e);
    case "function":
    case "object": {
      if (e === null) return ri(e);
      const t = e, n = Ae(t, "toString");
      if (typeof n == "function") {
        const i = n(t);
        return typeof i == "string" ? i : ri(i);
      }
      return ri(e);
    }
    default:
      return ri(e);
  }
}
function Ae(e, t) {
  for (; e !== null; ) {
    const i = Ec(e, t);
    if (i) {
      if (i.get) return Et(i.get);
      if (typeof i.value == "function") return Et(i.value);
    }
    e = bc(e);
  }
  function n() {
    return null;
  }
  return n;
}
function pp(e, t) {
  for (; e !== null; ) {
    const n = Ec(e, t);
    if (n) return n.get ? Et(n.get) : null;
    e = bc(e);
  }
  return null;
}
function dp(e) {
  try {
    return Bt(e, ""), !0;
  } catch {
    return !1;
  }
}
const wA = Lt([
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
]), ls = Lt([
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
]), us = Lt([
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
]), mp = Lt([
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
]), hs = Lt([
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
]), yp = Lt([
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
]), bA = Lt(["#text"]), EA = Lt([
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
]), Is = Lt([
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
]), xA = Lt([
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
]), Ji = Lt([
  "xlink:href",
  "xml:id",
  "xlink:title",
  "xml:space",
  "xmlns:xlink"
]), vp = Gt(/{{[\w\W]*|^[\w\W]*}}/g), wp = Gt(/<%[\w\W]*|^[\w\W]*%>/g), bp = Gt(/\${[\w\W]*/g), Ep = Gt(/^data-[\-\w.\u00B7-\uFFFF]+$/), xp = Gt(/^aria-[\-\w]+$/), MA = Gt(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), Mp = Gt(/^(?:\w+script|data):/i), Sp = Gt(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), Tp = Gt(/^html$/i), _p = Gt(/^[a-z][.\w]*(-[.\w]+)+$/i), Cs = Gt(/<[/\w!]/g), SA = Gt(/<[/\w]/g), kp = Gt(/<\/no(script|embed|frames)/i), TA = Gt(/\/>/i), _t = {
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
}, Rp = Lt(dt({}, [
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
])), Pp = function() {
  return typeof window > "u" ? null : window;
}, Op = function(t, n) {
  if (typeof t != "object" || typeof t.createPolicy != "function") return null;
  let i = null;
  const r = "data-tt-policy-suffix";
  n && n.hasAttribute(r) && (i = n.getAttribute(r));
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
}, _A = function() {
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
}, Ge = function(t, n, i, r) {
  return ne(t, n) && Bn(t[n]) ? dt(r.base ? oe(r.base) : {}, t[n], r.transform) : i;
}, fs = function(t, n, i) {
  const r = ne(t, n) ? t[n] : void 0;
  return r && typeof r == "object" ? oe(r) : i();
};
function Sc() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Pp();
  const t = (V) => Sc(V);
  if (t.version = "3.4.17", t.removed = [], !e || !e.document || e.document.nodeType !== _t.document || !e.Element)
    return t.isSupported = !1, t;
  let n = e.document;
  const i = n, r = i.currentScript;
  e.DocumentFragment;
  const s = e.HTMLTemplateElement, o = e.Node, a = e.Element, A = e.NodeFilter;
  e.NamedNodeMap === void 0 && (e.NamedNodeMap || e.MozNamedAttrMap), e.HTMLFormElement;
  const g = e.DOMParser, c = e.trustedTypes, u = a.prototype, C = Ae(u, "cloneNode"), y = Ae(u, "remove"), w = Ae(u, "removeAttributeNode"), l = Ae(u, "nextSibling"), f = Ae(u, "childNodes"), p = Ae(u, "parentNode"), I = Ae(u, "shadowRoot"), b = Ae(u, "attributes"), d = o && o.prototype ? Ae(o.prototype, "nodeType") : null, h = o && o.prototype ? Ae(o.prototype, "nodeName") : null, m = o && o.prototype ? Ae(o.prototype, "ownerDocument") : null, v = function(T) {
    return d ? d(T) : T.nodeType;
  }, E = function(T) {
    return h ? h(T) : T.nodeName;
  }, M = pp(u, "namespaceURI"), x = function(T) {
    return M ? M(T) : T.namespaceURI;
  };
  if (typeof s == "function") {
    const V = n.createElement("template");
    V.content && V.content.ownerDocument && (n = V.content.ownerDocument);
  }
  let S, _ = "", P, D = !1, F = 0;
  const N = function() {
    if (F > 0) throw _e('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, R = function(T) {
    N(), F++;
    try {
      return S.createHTML(T);
    } finally {
      F--;
    }
  }, B = function(T) {
    N(), F++;
    try {
      return S.createScriptURL(T);
    } finally {
      F--;
    }
  }, k = function() {
    return D || (P = Op(c, r), D = !0), P;
  }, j = n, z = j.implementation, U = j.createNodeIterator, J = j.createDocumentFragment, tt = j.getElementsByTagName, W = i.importNode;
  let $ = _A();
  t.isSupported = typeof wc == "function" && typeof p == "function" && z && z.createHTMLDocument !== void 0;
  const ot = vp, et = wp, Y = bp, q = Ep, K = xp, ct = Mp, yt = Sp, wt = _p;
  let ht = MA, lt = null;
  const O = dt({}, [
    ...wA,
    ...ls,
    ...us,
    ...hs,
    ...bA
  ]);
  let G = null;
  const H = dt({}, [
    ...EA,
    ...Is,
    ...xA,
    ...Ji
  ]);
  let Q = Object.seal(En(null, {
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
  })), at = null, rt = null;
  const ut = Object.seal(En(null, {
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
  let gt = !0, bt = !0, kt = !1, Yt = !0, le = !1, Ee = !0, xe = !1, Zn = !1, an = null, De = null, Vn = !1, se = !1, Ce = !1, nt = !1, st = !0, pt = !1;
  const Ct = "user-content-";
  let mt = !0, xt = !1, Rt = null, ae = {}, Me = null;
  const We = dt({}, [
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
  let Ti = null;
  const _i = dt({}, [
    "audio",
    "video",
    "img",
    "source",
    "image",
    "track"
  ]);
  let An = null;
  const wo = dt({}, [
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
  ]), ki = "http://www.w3.org/1998/Math/MathML", Ri = "http://www.w3.org/2000/svg", fe = "http://www.w3.org/1999/xhtml";
  let gn = fe, Mr = !1, Sr = null;
  const Lc = dt({}, [
    ki,
    Ri,
    fe
  ], cs), bo = Lt([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext"
  ]);
  let Tr = dt({}, bo);
  const Eo = Lt(["annotation-xml"]);
  let _r = dt({}, Eo);
  const Dc = dt({}, [
    "title",
    "style",
    "font",
    "a",
    "script"
  ]);
  let Wn = null;
  const Bc = ["application/xhtml+xml", "text/html"], Nc = "text/html";
  let Tt = null, cn = null;
  const Fc = n.createElement("form"), xo = function(T) {
    return T instanceof RegExp || T instanceof Function;
  }, kr = function() {
    let T = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (cn && cn === T) return;
    (!T || typeof T != "object") && (T = {}), T = oe(T), Wn = Bc.indexOf(T.PARSER_MEDIA_TYPE) === -1 ? Nc : T.PARSER_MEDIA_TYPE, Tt = Wn === "application/xhtml+xml" ? cs : Qe, lt = Ge(T, "ALLOWED_TAGS", O, { transform: Tt }), G = Ge(T, "ALLOWED_ATTR", H, { transform: Tt }), Sr = Ge(T, "ALLOWED_NAMESPACES", Lc, { transform: cs }), An = Ge(T, "ADD_URI_SAFE_ATTR", wo, {
      transform: Tt,
      base: wo
    }), Ti = Ge(T, "ADD_DATA_URI_TAGS", _i, {
      transform: Tt,
      base: _i
    }), Me = Ge(T, "FORBID_CONTENTS", We, { transform: Tt }), at = Ge(T, "FORBID_TAGS", oe({}), { transform: Tt }), rt = Ge(T, "FORBID_ATTR", oe({}), { transform: Tt }), ae = ne(T, "USE_PROFILES") ? T.USE_PROFILES && typeof T.USE_PROFILES == "object" ? oe(T.USE_PROFILES) : T.USE_PROFILES : !1, gt = T.ALLOW_ARIA_ATTR !== !1, bt = T.ALLOW_DATA_ATTR !== !1, kt = T.ALLOW_UNKNOWN_PROTOCOLS || !1, Yt = T.ALLOW_SELF_CLOSE_IN_ATTR !== !1, le = T.SAFE_FOR_TEMPLATES || !1, Ee = T.SAFE_FOR_XML !== !1, xe = T.WHOLE_DOCUMENT || !1, se = T.RETURN_DOM || !1, Ce = T.RETURN_DOM_FRAGMENT || !1, nt = T.RETURN_TRUSTED_TYPE || !1, Vn = T.FORCE_BODY || !1, st = T.SANITIZE_DOM !== !1, pt = T.SANITIZE_NAMED_PROPS || !1, mt = T.KEEP_CONTENT !== !1, xt = T.IN_PLACE || !1, ht = dp(T.ALLOWED_URI_REGEXP) ? T.ALLOWED_URI_REGEXP : MA, gn = typeof T.NAMESPACE == "string" ? T.NAMESPACE : fe, Tr = fs(T, "MATHML_TEXT_INTEGRATION_POINTS", () => dt({}, bo)), _r = fs(T, "HTML_INTEGRATION_POINTS", () => dt({}, Eo));
    const L = fs(T, "CUSTOM_ELEMENT_HANDLING", () => En(null));
    if (Q = En(null), ne(L, "tagNameCheck") && xo(L.tagNameCheck) && (Q.tagNameCheck = L.tagNameCheck), ne(L, "attributeNameCheck") && xo(L.attributeNameCheck) && (Q.attributeNameCheck = L.attributeNameCheck), ne(L, "allowCustomizedBuiltInElements") && typeof L.allowCustomizedBuiltInElements == "boolean" && (Q.allowCustomizedBuiltInElements = L.allowCustomizedBuiltInElements), Gt(Q), le && (bt = !1), Ce && (se = !0), ae && (lt = dt({}, bA), G = En(null), ae.html === !0 && (dt(lt, wA), dt(G, EA)), ae.svg === !0 && (dt(lt, ls), dt(G, Is), dt(G, Ji)), ae.svgFilters === !0 && (dt(lt, us), dt(G, Is), dt(G, Ji)), ae.mathMl === !0 && (dt(lt, hs), dt(G, xA), dt(G, Ji))), ut.tagCheck = null, ut.attributeCheck = null, ne(T, "ADD_TAGS") && (typeof T.ADD_TAGS == "function" ? ut.tagCheck = T.ADD_TAGS : Bn(T.ADD_TAGS) && (lt === O && (lt = oe(lt)), dt(lt, T.ADD_TAGS, Tt))), ne(T, "ADD_ATTR") && (typeof T.ADD_ATTR == "function" ? ut.attributeCheck = T.ADD_ATTR : Bn(T.ADD_ATTR) && (G === H && (G = oe(G)), dt(G, T.ADD_ATTR, Tt))), ne(T, "ADD_FORBID_CONTENTS") && Bn(T.ADD_FORBID_CONTENTS) && (Me === We && (Me = oe(Me)), dt(Me, T.ADD_FORBID_CONTENTS, Tt)), mt && (lt["#text"] = !0), xe && dt(lt, [
      "html",
      "head",
      "body"
    ]), lt.table && (dt(lt, ["tbody"]), delete at.tbody), T.TRUSTED_TYPES_POLICY) {
      if (typeof T.TRUSTED_TYPES_POLICY.createHTML != "function") throw _e('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof T.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw _e('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const X = S;
      S = T.TRUSTED_TYPES_POLICY;
      try {
        _ = R("");
      } catch (Z) {
        throw S = X, Z;
      }
    } else T.TRUSTED_TYPES_POLICY === null ? (S = void 0, _ = "") : (S === void 0 && (S = k()), S && typeof _ == "string" && (_ = R("")));
    Lt && Lt(T), cn = T;
  }, Mo = dt({}, [
    ...ls,
    ...us,
    ...mp
  ]), So = dt({}, [...hs, ...yp]), jc = function(T, L, X) {
    return L.namespaceURI === fe ? T === "svg" : L.namespaceURI === ki ? T === "svg" && (X === "annotation-xml" || Tr[X]) : !!Mo[T];
  }, Gc = function(T, L, X) {
    return L.namespaceURI === fe ? T === "math" : L.namespaceURI === Ri ? T === "math" && _r[X] : !!So[T];
  }, zc = function(T, L, X) {
    return L.namespaceURI === Ri && !_r[X] || L.namespaceURI === ki && !Tr[X] ? !1 : !So[T] && (Dc[T] || !Mo[T]);
  }, Uc = function(T) {
    const L = x(T), X = Qe(E(T)), Z = p(T);
    let it, At;
    return Z && v(Z) === _t.element ? (it = { namespaceURI: x(Z) }, At = Qe(E(Z))) : (it = { namespaceURI: gn }, At = "template"), Sr[L] ? L === Ri ? jc(X, it, At) : L === ki ? Gc(X, it, At) : L === fe ? zc(X, it, At) : !!(Wn === "application/xhtml+xml" && Sr[L]) : !1;
  }, Be = function(T) {
    ei(t.removed, { element: T });
    try {
      p(T).removeChild(T);
    } catch {
      if (y(T), !p(T)) throw _e("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, To = function(T, L, X) {
    try {
      w(T, L);
    } catch {
      try {
        T.removeAttribute(X);
      } catch {
      }
    }
  }, Rr = function(T) {
    Or(T);
    const L = f(T);
    L && Te(cp(L), (Z) => {
      try {
        y(Z);
      } catch {
      }
    });
    const X = v(T) === _t.element ? b(T) : null;
    if (X) for (let Z = X.length - 1; Z >= 0; --Z) {
      const it = X[Z], At = it && it.name;
      typeof At == "string" && To(T, it, At);
    }
  }, ln = function(T, L, X) {
    if (!X) try {
      X = L.getAttributeNode(T);
    } catch {
      X = null;
    }
    ei(t.removed, {
      attribute: X || null,
      from: L
    });
    try {
      X ? w(L, X) : L.removeAttribute(T);
    } catch {
      try {
        L.removeAttribute(T);
      } catch {
      }
    }
    if (T === "is")
      if (se || Ce) try {
        Be(L);
      } catch {
      }
      else try {
        L.setAttribute(T, "");
      } catch {
      }
  }, _o = function(T) {
    const L = b(T);
    if (L)
      for (let X = L.length - 1; X >= 0; --X) {
        const Z = L[X], it = Z && Z.name;
        typeof it != "string" || G[Tt(it)] || To(T, Z, it);
      }
  }, Pr = function(T, L) {
    let X = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
    const Z = [T];
    for (; Z.length > 0; ) {
      const it = Z.pop();
      if (L(it) === !1) continue;
      if (X && v(it) === _t.element) {
        const ft = I(it);
        Ne(ft) && Z.push(ft);
      }
      const At = f(it);
      if (At) for (let ft = At.length - 1; ft >= 0; --ft) Z.push(At[ft]);
    }
  }, Or = function(T) {
    Pr(T, (L) => {
      v(L) === _t.element && _o(L);
    });
  }, Lr = function(T) {
    const L = [];
    return Pr(T, (X) => {
      L.push(X);
    }, !0), L;
  }, Xc = function(T, L) {
    const X = As();
    Te(Lr(T), (Z) => {
      v(Z) === _t.element && gs(X, Z);
    }), Te(L, (Z) => {
      v(Z) === _t.element && !ni(X, Z) && _o(Z);
    });
  }, ko = function(T, L) {
    let X = !1;
    return Te(t.removed, (Z) => {
      Z.element && (X = X || Z.element === T, Or(Z.element));
    }), Xc(T, L), X;
  }, Zc = 8, Vc = function(T, L) {
    const X = Rt;
    let Z = null;
    const it = () => (Z || (Z = As(), Te(L, (At) => {
      gs(Z, At);
    })), Z);
    for (let At = 0; ; At++) {
      const ft = Lr(T), Pt = [T];
      let pe = !1;
      if (Te(ft, (Ht) => {
        v(Ht) === _t.documentFragment ? ei(Pt, Ht) : !pe && !ni(X, Ht) && (pe = ni(it(), Ht));
      }), !pe) return;
      if (At >= Zc) throw _e("the tree kept changing during in-place sanitization; refusing to return it");
      Te(Pt, (Ht, te) => {
        Wc(Ht, te > 0, T, it());
      });
    }
  }, Wc = function(T, L, X, Z) {
    const it = Dr(T);
    let At;
    for (; At = it.nextNode(); )
      !ni(Z, At) || ni(Rt, At) || (L && ue($.uponSanitizeShadowNode, At, null), Nr(At, X), Fr(At, X), Ne(At.content) && Hn(At.content));
  }, Yc = function(T) {
    Rt && gs(Rt, T);
  }, Ro = function(T, L) {
    return Ee ? T === "patchsrc" ? !0 : T === "for" && L !== "label" && L !== "output" : !1;
  }, Hc = function(T) {
    Ee && Pr(T, (L) => {
      const X = v(L);
      if (X === _t.processingInstruction || X === _t.comment && Bt(SA, L.data)) {
        try {
          y(L);
        } catch {
        }
        return !1;
      }
      if (X === _t.element) {
        const Z = L, it = Tt(E(L));
        try {
          Z.hasAttribute && Z.hasAttribute("patchsrc") && Z.removeAttribute("patchsrc"), Z.hasAttribute && Z.hasAttribute("for") && Ro("for", it) && Z.removeAttribute("for");
        } catch {
        }
      }
      return !0;
    });
  }, Po = function(T) {
    let L = null, X = null;
    if (Vn) T = "<remove></remove>" + T;
    else {
      const At = dA(T, /^[\r\n\t ]+/);
      X = At && At[0];
    }
    Wn === "application/xhtml+xml" && gn === fe && (T = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + T + "</body></html>");
    const Z = S ? R(T) : T;
    if (gn === fe) try {
      L = new g().parseFromString(Z, Wn);
    } catch {
    }
    if (!L || !L.documentElement) {
      L = z.createDocument(gn, "template", null);
      try {
        L.documentElement.innerHTML = Mr ? _ : Z;
      } catch {
      }
    }
    const it = L.body || L.documentElement;
    return T && X && it.insertBefore(n.createTextNode(X), it.childNodes[0] || null), gn === fe ? tt.call(L, xe ? "html" : "body")[0] : xe ? L.documentElement : it;
  }, Dr = function(T) {
    const L = m ? m(T) : T.ownerDocument;
    return U.call(L || T, T, A.SHOW_ELEMENT | A.SHOW_COMMENT | A.SHOW_TEXT | A.SHOW_PROCESSING_INSTRUCTION | A.SHOW_CDATA_SECTION, null);
  }, Pi = function(T) {
    return T = ii(T, ot, " "), T = ii(T, et, " "), T = ii(T, Y, " "), T;
  }, Br = function(T) {
    var L;
    Oo(T);
    const X = (L = T.querySelectorAll) === null || L === void 0 ? void 0 : L.call(T, "template");
    X && Te(X, (Z) => {
      Ne(Z.content) && Br(Z.content);
    });
  }, Oo = function(T) {
    T.normalize();
    const L = m ? m(T) : T.ownerDocument, X = U.call(L || T, T, A.SHOW_TEXT | A.SHOW_COMMENT | A.SHOW_CDATA_SECTION | A.SHOW_PROCESSING_INSTRUCTION, null);
    let Z = X.nextNode();
    for (; Z; )
      Z.data = Pi(Z.data), Z = X.nextNode();
  }, Oi = function(T) {
    const L = h ? h(T) : null;
    return typeof L != "string" || Tt(L) !== "form" ? !1 : typeof T.nodeName != "string" || typeof T.textContent != "string" || typeof T.removeChild != "function" || T.attributes !== b(T) || typeof T.removeAttribute != "function" || typeof T.removeAttributeNode != "function" || typeof T.getAttributeNode != "function" || typeof T.setAttribute != "function" || typeof T.namespaceURI != "string" || typeof T.insertBefore != "function" || typeof T.hasChildNodes != "function" || T.nodeType !== d(T) || T.childNodes !== f(T);
  }, Ne = function(T) {
    if (!d || typeof T != "object" || T === null) return !1;
    try {
      return d(T) === _t.documentFragment;
    } catch {
      return !1;
    }
  }, Yn = function(T) {
    if (!d || typeof T != "object" || T === null) return !1;
    try {
      return typeof d(T) == "number";
    } catch {
      return !1;
    }
  };
  function ue(V, T, L) {
    V.length !== 0 && Te(V, (X) => {
      X.call(t, T, L, cn);
    });
  }
  const Qc = function(T, L) {
    return !!(Ee && T.hasChildNodes() && !Yn(T.firstElementChild) && Bt(Cs, T.textContent) && Bt(Cs, T.innerHTML) || Ee && Rp[L] && v(T) === _t.element && x(T) === fe && (Yn(T.firstElementChild) || typeof T.textContent == "string" && Bt(Cs, T.textContent)) || T.nodeType === _t.processingInstruction || Ee && T.nodeType === _t.comment && Bt(SA, T.data));
  }, Li = function(T, L) {
    if (T instanceof RegExp) return Bt(T, L);
    if (T instanceof Function) {
      for (var X = arguments.length, Z = new Array(X > 2 ? X - 2 : 0), it = 2; it < X; it++) Z[it - 2] = arguments[it];
      return !!T(L, ...Z);
    }
    return !1;
  }, Kc = function(T, L, X) {
    if (!at[L] && Bo(L) && Li(Q.tagNameCheck, L)) return !1;
    if (mt && !Me[L] && !Me[Qe(L)]) {
      const Z = p(T), it = f(T);
      if (it && Z) {
        const At = it.length;
        for (let ft = At - 1; ft >= 0; --ft) {
          const Pt = T === X ? C(it[ft], !0) : it[ft];
          Z.insertBefore(Pt, l(T));
        }
      }
    }
    return Be(T), !0;
  }, Lo = function(T, L, X, Z) {
    return T.length === 0 ? L : L === X || L === Z ? oe(L) : L;
  }, un = function(T, L) {
    return T === L || p(T) !== null ? !1 : (xt && Or(T), !0);
  }, Nr = function(T, L) {
    if (Yc(T), ue($.beforeSanitizeElements, T, null), un(T, L)) return !0;
    if (Oi(T))
      return Be(T), !0;
    const X = Tt(E(T));
    if (lt = Lo($.uponSanitizeElement, lt, O, an), ue($.uponSanitizeElement, T, {
      tagName: X,
      allowedTags: lt
    }), un(T, L)) return !0;
    if (Qc(T, X))
      return Be(T), !0;
    if (at[X] || !(ut.tagCheck instanceof Function && ut.tagCheck(X)) && !lt[X]) {
      const Z = Kc(T, X, L);
      return Z === !1 && (ue($.afterSanitizeElements, T, null), un(T, L)) ? !0 : Z;
    }
    if (v(T) === _t.element && !Uc(T) || (X === "noscript" || X === "noembed" || X === "noframes") && Bt(kp, T.innerHTML))
      return Be(T), !0;
    if (le && T.nodeType === _t.text) {
      const Z = Pi(T.textContent);
      T.textContent !== Z && (ei(t.removed, { element: T.cloneNode() }), T.textContent = Z);
    }
    return ue($.afterSanitizeElements, T, null), un(T, L);
  }, Do = function(T, L, X) {
    if (rt[L] || Ro(L, T) || st && (L === "id" || L === "name") && (X in n || X in Fc)) return !1;
    const Z = G[L] || ut.attributeCheck instanceof Function && ut.attributeCheck(L, T);
    return bt && Bt(q, L) || gt && Bt(K, L) ? !0 : Z ? An[L] || Bt(ht, ii(X, yt, "")) || (L === "src" || L === "xlink:href" || L === "href") && T !== "script" && mA(X, "data:") === 0 && Ti[T] || kt && !Bt(ct, ii(X, yt, "")) ? !0 : !X : Bo(T) && Li(Q.tagNameCheck, T) && Li(Q.attributeNameCheck, L, T) || L === "is" && Q.allowCustomizedBuiltInElements && Li(Q.tagNameCheck, X);
  }, Jc = dt({}, [
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "missing-glyph"
  ]), Bo = function(T) {
    return !Jc[Qe(T)] && Bt(wt, T);
  }, qc = function(T, L, X, Z) {
    if (S && typeof c == "object" && typeof c.getAttributeType == "function" && !X) switch (c.getAttributeType(T, L)) {
      case "TrustedHTML":
        return R(Z);
      case "TrustedScriptURL":
        return B(Z);
    }
    return Z;
  }, $c = function(T, L, X, Z) {
    try {
      return X ? T.setAttributeNS(X, L, Z) : T.setAttribute(L, Z), Oi(T) ? (Be(T), !1) : !0;
    } catch {
      return ln(L, T), !1;
    }
  }, No = function(T, L) {
    return Ee && Bt(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, L) ? !0 : Qe(T) === "attributename" && dA(L, "href") !== null;
  }, Fr = function(T, L) {
    if (ue($.beforeSanitizeAttributes, T, null), un(T, L)) return;
    const X = T.attributes;
    if (!X || Oi(T)) return;
    G = Lo($.uponSanitizeAttribute, G, H, De);
    const Z = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: G,
      forceKeepAttr: void 0
    };
    let it = X.length;
    const At = Tt(T.nodeName);
    for (; it--; ) {
      const ft = X[it], Pt = ft.name, pe = ft.namespaceURI, Ht = ft.value, te = Tt(Pt), hn = Ht;
      let ee = Pt === "value" ? hn : up(hn), Fo = !1;
      if (Z.attrName = te, Z.attrValue = ee, Z.keepAttr = !0, Z.forceKeepAttr = void 0, ue($.uponSanitizeAttribute, T, Z), ee = Z.attrValue, pt && (te === "id" || te === "name") && mA(ee, Ct) !== 0 && (ln(Pt, T, ft), ee = Ct + ee, Fo = !0), No(Pt, ee)) {
        ln(Pt, T, ft);
        continue;
      }
      if (!Z.forceKeepAttr) {
        if (!Z.keepAttr) {
          ln(Pt, T, ft);
          continue;
        }
        if (!Yt && Bt(TA, ee)) {
          ln(Pt, T, ft);
          continue;
        }
        if (le && (ee = Pi(ee)), !Do(At, te, ee)) {
          ln(Pt, T, ft);
          continue;
        }
        ee = qc(At, te, pe, ee), ee !== hn && $c(T, Pt, pe, ee) && Fo && pA(t.removed);
      }
    }
    ue($.afterSanitizeAttributes, T, null), un(T, L);
  }, Hn = function(T) {
    let L = null;
    const X = Dr(T);
    for (ue($.beforeSanitizeShadowDOM, T, null); L = X.nextNode(); )
      if (ue($.uponSanitizeShadowNode, L, null), Nr(L, T), Fr(L, T), Ne(L.content) && Hn(L.content), v(L) === _t.element) {
        const Z = I(L);
        Ne(Z) && (jr(Z), Hn(Z));
      }
    le && Oo(T), ue($.afterSanitizeShadowDOM, T, null);
  }, jr = function(T) {
    const L = [{
      node: T,
      shadow: null
    }];
    for (; L.length > 0; ) {
      const X = L.pop();
      if (X.shadow) {
        Hn(X.shadow);
        continue;
      }
      const Z = X.node, it = v(Z) === _t.element, At = f(Z);
      if (At) for (let ft = At.length - 1; ft >= 0; --ft) L.push({
        node: At[ft],
        shadow: null
      });
      if (it) {
        const ft = h ? h(Z) : null;
        if (typeof ft == "string" && Tt(ft) === "template") {
          const Pt = Z.content;
          Ne(Pt) && L.push({
            node: Pt,
            shadow: null
          });
        }
      }
      if (it) {
        const ft = I(Z);
        Ne(ft) && L.push({
          node: null,
          shadow: ft
        }, {
          node: ft,
          shadow: null
        });
      }
    }
  };
  return t.sanitize = function(V) {
    let T = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, L = null, X = null, Z = null, it = null;
    if (Mr = !V, Mr && (V = "<!-->"), typeof V != "string" && !Yn(V) && (V = fp(V), typeof V != "string"))
      throw _e("dirty is not a string, aborting");
    if (!t.isSupported) return V;
    Zn ? (lt = an, G = De) : kr(T), ($.uponSanitizeElement.length > 0 || $.uponSanitizeAttribute.length > 0) && (lt = oe(lt)), $.uponSanitizeAttribute.length > 0 && (G = oe(G)), t.removed = [];
    const At = xt && typeof V != "string" && Yn(V);
    let ft = [];
    const Pt = Rt;
    if (At) {
      Hc(V);
      const te = E(V);
      if (typeof te == "string") {
        const hn = Tt(te);
        if (!lt[hn] || at[hn])
          throw Rr(V), _e("root node is forbidden and cannot be sanitized in-place");
      }
      if (Oi(V))
        throw Rr(V), _e("root node is clobbered and cannot be sanitized in-place");
      ft = Lr(V), Rt = As();
    } else if (Yn(V))
      L = Po("<!---->"), X = L.ownerDocument.importNode(V, !0), X.nodeType === _t.element && X.nodeName === "BODY" || X.nodeName === "HTML" ? L = X : L.appendChild(X), jr(L);
    else {
      if (!se && !le && !xe && V.indexOf("<") === -1) return S && nt ? R(V) : V;
      if (L = Po(V), !L) return se ? null : nt ? _ : "";
    }
    L && Vn && Be(L.firstChild);
    const pe = At ? V : L;
    try {
      At && jr(V);
      const te = Dr(pe);
      for (; Z = te.nextNode(); )
        Nr(Z, pe), Fr(Z, pe), Ne(Z.content) && Hn(Z.content);
      At && Vc(V, ft);
    } catch (te) {
      throw At && (Rr(V), ko(V, ft)), te;
    } finally {
      Rt = Pt;
    }
    if (At) {
      if (ko(V, ft)) throw _e("a node selected for removal could not be safely returned; refusing to sanitize in place");
      return le && Br(V), V;
    }
    if (se) {
      if (le && Br(L), Ce)
        for (it = J.call(L.ownerDocument); L.firstChild; ) it.appendChild(L.firstChild);
      else it = L;
      return (G.shadowroot || G.shadowrootmode) && (it = W.call(i, it, !0)), it;
    }
    let Ht = xe ? L.outerHTML : L.innerHTML;
    return xe && lt["!doctype"] && L.ownerDocument && L.ownerDocument.doctype && L.ownerDocument.doctype.name && Bt(Tp, L.ownerDocument.doctype.name) && (Ht = "<!DOCTYPE " + L.ownerDocument.doctype.name + `>
` + Ht), le && (Ht = Pi(Ht)), S && nt ? R(Ht) : Ht;
  }, t.setConfig = function() {
    let V = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    kr(V), Zn = !0, an = lt, De = G;
  }, t.clearConfig = function() {
    cn = null, Zn = !1, an = null, De = null, S = P, _ = "";
  }, t.isValidAttribute = function(V, T, L) {
    cn || kr({});
    const X = Tt(V), Z = Tt(T);
    return typeof L == "string" && (No(T, L) || !Yt && Bt(TA, L)) ? !1 : Do(X, Z, L);
  }, t.addHook = function(V, T) {
    typeof T == "function" && ne($, V) && ei($[V], T);
  }, t.removeHook = function(V, T) {
    if (ne($, V)) {
      if (T !== void 0) {
        const L = gp($[V], T);
        return L === -1 ? void 0 : lp($[V], L, 1)[0];
      }
      return pA($[V]);
    }
  }, t.removeHooks = function(V) {
    ne($, V) && ($[V] = []);
  }, t.removeAllHooks = function() {
    $ = _A();
  }, t;
}
var Tc = Sc();
const Lp = ["b", "strong", "i", "em", "u", "s", "br", "p", "span", "div", "ul", "ol", "li", "a", "img", "small", "sub", "sup", "code", "pre", "table", "thead", "tbody", "tr", "th", "td", "qy-swiper", "qy-swiper-slide"], Dp = ["href", "src", "alt", "title", "class", "target", "rel", "width", "height"], Bp = { values: ["target", "rel", "width", "height"] }, Np = ["script", "style", "iframe", "object", "embed", "form", "input", "textarea", "link", "meta", "base"], Fp = ["srcdoc", "style", "formaction", "xlink:href"], jp = { valueAttributes: ["image-url", "image-type", "thumbnail-url", "caption", "material-url", "camera-position", "camera-target", "show-texture"], booleanAttributes: ["fit-to-container", "debug-mode"], urlAttributes: ["image-url", "thumbnail-url", "material-url"], textAttributes: { values: ["caption"] }, imageTypes: { values: ["image", "panorama", "youtube", "video", "3dmodel", "gaussian"] }, numberListAttributes: ["camera-position", "camera-target"], trueFalseAttributes: ["show-texture"] }, Gp = { booleanAttributes: ["has-thumb", "autoplay"] }, zp = { tags: ["a", "b", "br", "i", "p", "small", "span", "sub", "sup"], attributes: ["href"], forbidContents: { tags: ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "selectedcontent", "style", "svg", "template", "title", "video", "xmp"] } }, Wt = {
  tags: Lp,
  attributes: Dp,
  uriSafeAttributes: Bp,
  forbidTags: Np,
  forbidAttributes: Fp,
  slide: jp,
  swiper: Gp,
  iiif: zp
}, Up = Wt.tags, Xp = Wt.attributes, Zp = /^(?:https?|mailto|tel|data):/i, Vp = Wt.uriSafeAttributes.values, Wp = Wt.forbidTags, Yp = Wt.forbidAttributes, Hp = Wt.iiif.tags, Qp = Wt.iiif.attributes, Kp = /^https?:/i, Jp = Wt.iiif.forbidContents.tags;
let rr;
const qp = /^data:image\/(png|jpeg|gif|webp|avif);/i, kA = (e) => !!e && /^\s*data:/i.test(e);
function $p(e) {
  if (e.tagName === "A" && e.hasAttribute("target") && e.setAttribute("rel", "noopener noreferrer"), rr === "iiif" && e.tagName === "A" && e.hasAttribute("href") && (e.setAttribute("target", "_blank"), e.setAttribute("rel", "noopener noreferrer")), e.tagName === "IMG") {
    const n = e.getAttribute("src");
    kA(n) && !qp.test(n.trim()) && e.removeAttribute("src"), e.hasAttribute("srcset") && e.removeAttribute("srcset");
  } else
    for (const n of ["src", "href", "xlink:href"])
      kA(e.getAttribute(n)) && e.removeAttribute(n);
}
let wn;
function td() {
  if (wn) return wn;
  const e = globalThis.window;
  if (!e)
    throw new Error(
      "sanitizeHtml: window の無い環境では使用できません（DOMPurify の初期化に必要）"
    );
  return wn = Tc(e), wn.addHook("afterSanitizeAttributes", $p), wn.addHook("uponSanitizeAttribute", nd), wn;
}
let qi;
function ed() {
  if (qi) return qi;
  const e = globalThis.window;
  if (!e)
    throw new Error(
      "sanitizeHtml: window の無い環境では使用できません（DOMPurify の初期化に必要）"
    );
  return qi = Tc(e), qi;
}
function nd(e, t) {
  const n = e.nodeName.toLowerCase(), i = t.attrName;
  if (n === "qy-swiper-slide") {
    const r = yo.has(i) ? "" : kc(i, t.attrValue);
    if (r === null) {
      t.keepAttr = !1;
      return;
    }
    e.setAttribute(i, r), t.forceKeepAttr = !0;
    return;
  }
  n === "qy-swiper" && (ad.has(i) ? (e.setAttribute(i, ""), t.forceKeepAttr = !0) : t.keepAttr = !1);
}
function _c(e, t) {
  if (e == null) return "";
  const n = t?.profile === "iiif", i = rr;
  rr = n ? "iiif" : void 0;
  try {
    return td().sanitize(String(e), {
      ALLOWED_TAGS: n ? Hp : Up,
      ALLOWED_ATTR: n ? Qp : Xp,
      ALLOWED_URI_REGEXP: n ? Kp : Zp,
      ADD_URI_SAFE_ATTR: Vp,
      FORBID_TAGS: Wp,
      FORBID_ATTR: Yp,
      ALLOW_DATA_ATTR: !1,
      // aria-* も許可表の外に出さない（IIIF の値で残す属性は href だけ）
      ALLOW_ARIA_ATTR: !n,
      // 禁止タグを落としても中身のテキストは残す（実データの可読性を保つ）
      KEEP_CONTENT: !0,
      // profile: "iiif" のときだけ、文字も捨てる要素の一覧を差し替える
      ...n ? { FORBID_CONTENTS: Jp } : {}
    });
  } finally {
    rr = i;
  }
}
function id(e) {
  return e == null ? "" : String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
const rd = 5;
function sd(e) {
  if (e == null) return "";
  const t = globalThis.window.document;
  let n = String(e);
  for (let i = 0; i < rd; i++) {
    const r = ed().sanitize(n, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: !0
    }), s = t.createElement("div");
    s.innerHTML = r;
    const o = s.textContent || "";
    if (o === n) return o;
    n = o;
  }
  return "";
}
const od = new Set(Wt.slide.valueAttributes), yo = new Set(Wt.slide.booleanAttributes), ad = new Set(Wt.swiper.booleanAttributes), Ad = new Set(Wt.slide.textAttributes.values), gd = new Set(Wt.slide.imageTypes.values), cd = new Set(Wt.slide.numberListAttributes), ld = new Set(Wt.slide.trueFalseAttributes), RA = "[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][-+]?\\d+)?", ud = new RegExp(`^${RA}(?:[ \\t]*,[ \\t]*${RA})*$`), hd = new Set(Wt.slide.urlAttributes), Id = (e) => /^(?:https?:)?\/\/|^\/|^[^:]*$/i.test(e.trim()), Cd = /["'`<>\s]/;
function kc(e, t) {
  if (yo.has(e)) return t ? "" : null;
  if (!od.has(e) || t == null) return null;
  let n = String(t);
  return hd.has(e) && (!Id(n) || Cd.test(n)) || (Ad.has(e) && (n = sd(n)), e === "image-type" && !gd.has(n)) || cd.has(e) && (n = n.trim(), !ud.test(n)) || ld.has(e) && n !== "true" && n !== "false" ? null : n;
}
function Vd(e) {
  const t = [];
  for (const [n, i] of Object.entries(e || {})) {
    const r = String(n).toLowerCase(), s = kc(r, i);
    s !== null && t.push(yo.has(r) ? r : `${r}="${id(s)}"`);
  }
  return t.join(" ");
}
const fd = "attributionChanged", pd = 125, PA = "Google Maps";
function fr(e) {
  return typeof e.googleMapType == "string" && e.googleMapType !== "";
}
function OA(e) {
  for (const t of e) {
    const n = t.googleMapType;
    if (!(typeof n != "string" || !n))
      return n === "satellite" ? "dark" : "light";
  }
}
function LA(e) {
  return e > 0 && e < pd ? "text" : "logo";
}
function Rc(e, t) {
  if (e == null) return;
  if (typeof e == "string") return e.trim() ? e : void 0;
  if (typeof e != "object") return String(e);
  let n, i;
  for (const [r, s] of Object.entries(e))
    if (!(typeof s != "string" || !s.trim())) {
      if (r === t) return s;
      r === "en" && i === void 0 && (i = s), n === void 0 && (n = s);
    }
  return i ?? n;
}
function ps(e) {
  const t = e.toLowerCase();
  return t === "zh-hk" || t === "zh-hant" ? "zh-TW" : e;
}
function vo(e, t) {
  let n = e;
  for (; n; ) {
    const i = n.closest(t);
    if (i) return i;
    const r = n.getRootNode?.();
    n = r && "host" in r ? r.host : null;
  }
  return null;
}
function dd(e) {
  return vo(e, '[lang]:not([lang=""])')?.getAttribute("lang") || void 0;
}
function md(e, t, n) {
  const i = vo(e, nr);
  if (i) {
    let s;
    try {
      s = i.currentLang;
    } catch {
      s = void 0;
    }
    if (typeof s == "string" && s) return ps(s);
  }
  const r = [
    e?.getAttribute("lang"),
    i?.getAttribute("lang"),
    t,
    n,
    dd(e)
  ];
  for (const s of r)
    if (typeof s == "string" && s) return ps(s);
  return ps(tp() || "en");
}
function yd(e) {
  const t = [], n = (i) => {
    !i || t.includes(i) || typeof i.isWmts == "function" && !i.isWmts() || t.push(i);
  };
  return n(e.front), n(e.overlay), n(e.back), t;
}
function vd(e) {
  if (fr(e)) return "google";
  if (typeof e.getTileJSON == "function") return "tilejson";
}
function wd(e) {
  const t = e.getTileJSON;
  if (typeof t != "function") return;
  let n;
  try {
    n = t.call(e)?.attribution;
  } catch {
    return;
  }
  return typeof n == "string" && n.trim() ? n.trim() : void 0;
}
function bd(e) {
  const t = typeof e.get == "function" ? e.get("attr") : void 0;
  return Rc(t, "en") !== void 0;
}
function Ed(e) {
  return (Array.isArray(e) ? e : [e]).filter((n) => typeof n == "string" && n.trim() !== "").map((n) => n.trim());
}
const ds = 2;
function xd(e) {
  const t = document.createElement("template");
  return t.innerHTML = e, t.content;
}
function Pc(e) {
  return (xd(e).textContent ?? "").replace(/\s+/g, " ").trim();
}
function Zs(e) {
  return e.map((t) => _c(t, { profile: "iiif" }).trim()).filter((t) => t !== "");
}
function Oc(e, t) {
  const n = typeof e.get == "function" ? e.get("attr") : void 0, i = Rc(n, t)?.trim();
  if (!i) return [];
  const r = _c(i);
  return [{ text: i, html: r, key: Pc(r) || r }];
}
function Vs(e, t) {
  const n = [];
  for (const i of t?.get(e) ?? []) {
    const [r] = Zs([i.trim()]);
    r && n.push({ text: i.trim(), html: r, key: Pc(r) || r });
  }
  return n;
}
function Ws(e, t, n) {
  const i = Oc(e, t);
  return fr(e) ? [...Vs(e, n), ...i] : i.length > 0 ? i : Vs(e, n);
}
function sr(e, t) {
  const n = [];
  for (const i of e)
    for (const r of i)
      t.has(r.key) || (t.add(r.key), n.push(r));
  return n;
}
function Md(e, t, n, i = []) {
  const r = e.filter((c) => !i.includes(c)), s = e.filter((c) => i.includes(c)), o = /* @__PURE__ */ new Set(), a = sr(
    r.filter(fr).map((c) => Vs(c, n)),
    o
  ), A = sr(
    r.map((c) => fr(c) ? Oc(c, t) : Ws(c, t, n)),
    o
  ), g = sr(
    s.map((c) => Ws(c, t, n)),
    o
  );
  return { google: a, base: A, overlay: g };
}
function Sd(e, t, n) {
  return sr(
    e.map((i) => Ws(i, t, n)),
    /* @__PURE__ */ new Set()
  ).map((i) => i.text);
}
const DA = "maplat-attribution-style", Td = `
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
function _d(e) {
  if (e.getElementById(DA)) return;
  const t = e.createElement("style");
  t.id = DA, t.textContent = Td, (e.head || e.documentElement).appendChild(t);
}
class kd {
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
  constructor(t, n) {
    this.#e = t, this.#r = n;
    const i = t.ownerDocument;
    _d(i);
    const r = i.createElement("div");
    r.className = "maplat-attribution", r.hidden = !0, this.element = r, t.appendChild(r), this.#f(), this.#C(), this.#I();
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
    for (const n of this.#t) {
      const { mapID: i } = n;
      if (typeof i != "string" || !i) continue;
      const r = Zs(this.#i.get(n) ?? []);
      r.length > 0 && t.push({ mapID: i, attributions: r });
    }
    return t;
  }
  /** 今の言語で出典の文字列を返す（試験と診断用）。 */
  get texts() {
    return Sd(this.#t, this.#r(), this.#i);
  }
  /**
   * 表示する source を差し替えて描き直す。overlays は sources のうち重ね地図のもの（背景地図と別の箱に出す）。
   */
  update(t, n = []) {
    if (!this.#o) {
      this.#t = t.slice(), this.#s = n.filter((i) => this.#t.includes(i));
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
      new CustomEvent(fd, { bubbles: !0, composed: !1, cancelable: !1 })
    ));
  }
  /**
   * 地図の設定の attr が無い source の、提供元の申告の出典を、OpenLayers の source（getAttributions）から読む。
   * 提供元の申告でない source（providerAttributionKind が undefined）は読まない（ライブラリの既定値で埋めない）。
   * 地図の描画（postrender）のたびに、その地図が描いている source と frameState を渡す。
   * Google の source は表示範囲が変わったときだけ取りに行き、それ以外は前の値を返す（OpenLayers の実装）。
   */
  refreshDynamic(t, n) {
    if (!this.#o)
      for (const i of t) {
        if (!i || !this.#t.includes(i)) continue;
        const r = vd(i);
        if (!r || bd(i) && r !== "google") continue;
        const s = typeof i.getAttributions == "function" ? i.getAttributions() : void 0;
        if (typeof s != "function") continue;
        let o;
        try {
          o = s(n);
        } catch {
          continue;
        }
        Promise.resolve(o).then(
          (a) => {
            let A = Ed(a);
            if (r === "tilejson") {
              const g = wd(i);
              A = A.filter((c) => c === g);
            }
            this.#u(i, A);
          },
          () => {
          }
          // 取りに行けなかったときは前の値のまま
        );
      }
  }
  #u(t, n) {
    if (this.#o || !this.#t.includes(t) || Zs(n).length === 0) return;
    const i = this.#i.get(t);
    i && i.length === n.length && i.every((r, s) => r === n[s]) || (this.#i.set(t, n), this.render(), this.#g());
  }
  /** 今の source と言語で描き直す。 */
  render() {
    if (this.#o) return;
    const t = this.element;
    t.parentNode !== this.#e && this.#e.appendChild(t);
    const n = t.ownerDocument, i = OA(this.#t), r = i ? LA(this.#l()) : void 0, { google: s, base: o, overlay: a } = Md(
      this.#t,
      this.#r(),
      this.#i,
      this.#s
    ), A = [];
    for (const [g, c] of [
      [a, "overlay"],
      [o, "base"]
    ]) {
      const u = this.#c(g);
      u && (u.classList.add("maplat-attribution-clamp", `maplat-attribution-${c}`), A.push(u));
    }
    if (i) {
      const g = n.createElement("span");
      g.className = "maplat-attribution-google", r === "logo" && g.appendChild(this.#h(i));
      const c = this.#c(s, r === "text");
      c && g.appendChild(c), A.push(g);
    }
    A.slice(0, -1).forEach((g) => g.classList.add("maplat-attribution-stacked")), t.replaceChildren(...A), r ? t.dataset.googleMaps = r : delete t.dataset.googleMaps, t.hidden = A.length === 0;
  }
  /** Google Maps のロゴ（公式の SVG。読み上げは "Google Maps"）。 */
  #h(t) {
    const i = this.element.ownerDocument.createElement("span");
    return i.className = "maplat-attribution-google-logo", i.dataset.variant = t, i.setAttribute("role", "img"), i.setAttribute("aria-label", PA), i.innerHTML = t === "dark" ? np : ep, i.firstElementChild?.setAttribute("aria-hidden", "true"), i.firstElementChild?.setAttribute("focusable", "false"), i;
  }
  /**
   * 出典を " | " で区切って並べた箱（出すものが無ければ null）。
   * googleText が true なら、先頭に文字 "Google Maps"（ロゴの代わり）を入れる。
   */
  #c(t, n = !1) {
    if (t.length === 0 && !n) return null;
    const i = this.element.ownerDocument, r = i.createElement("span");
    r.className = "maplat-attribution-text";
    const s = [];
    if (n) {
      const o = i.createElement("span");
      o.className = "maplat-attribution-item maplat-attribution-google-text", o.textContent = PA, s.push(o);
    }
    for (const o of t) {
      const a = i.createElement("span");
      a.className = "maplat-attribution-item", a.innerHTML = o.html, s.push(a);
    }
    return s.forEach((o, a) => {
      if (a > 0) {
        const A = i.createElement("span");
        A.className = "maplat-attribution-sep", A.setAttribute("aria-hidden", "true"), A.textContent = " | ", r.appendChild(A);
      }
      r.appendChild(o);
    }), r;
  }
  /**
   * 出典の表示に使える幅（px）。箱に一時的に width: 100% を当て、右の位置と max-width の変数が
   * 効いた結果の幅を測る。レイアウトが無い（非表示の入れ物・jsdom）ときは 0。
   */
  #l() {
    const t = this.element, { width: n, display: i } = t.style, r = t.hidden;
    t.hidden = !1, t.style.width = "100%", t.style.display = "block";
    const s = t.getBoundingClientRect().width;
    return t.style.width = n, t.style.display = i, t.hidden = r, s;
  }
  /** 表示を外し、言語の監視をやめる。 */
  dispose() {
    this.#o || (this.#o = !0, this.#n?.disconnect(), this.#n = null, this.#A?.disconnect(), this.#A = null, this.#t = [], this.#s = [], this.#i.clear(), this.element.remove());
  }
  /**
   * 地図が <maplat-ui> の中にあり、その要素がまだ定義されていないときは、定義を待って一度だけ描き直す
   * （定義の前は currentLang が無く、仮の順で言語を選んでいるため）。破棄の後は描かない。
   */
  #I() {
    typeof customElements > "u" || customElements.get(nr) || vo(this.#e, nr) && customElements.whenDefined(nr).then(
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
      if (this.#o || !OA(this.#t)) return;
      LA(this.#l()) !== this.googleAttribution && this.render();
    }), this.#A.observe(this.#e));
  }
  #f() {
    if (typeof MutationObserver > "u") return;
    this.#n = new MutationObserver(() => this.render());
    const t = { attributes: !0, attributeFilter: ["lang"], subtree: !0 }, n = this.#e.getRootNode?.();
    n && n.nodeType === 11 && this.#n.observe(n, t);
    const i = this.#e.ownerDocument.documentElement;
    i && this.#n.observe(i, t);
  }
}
const Rd = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjcyNTIxMjZFMDJBMTExRTBCOTNGRTVBRkM1QzM1Qjc5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjcyNTIxMjZGMDJBMTExRTBCOTNGRTVBRkM1QzM1Qjc5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzI1MjEyNkMwMkExMTFFMEI5M0ZFNUFGQzVDMzVCNzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzI1MjEyNkQwMkExMTFFMEI5M0ZFNUFGQzVDMzVCNzkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4RaveOAAAB1UlEQVR42qzUTyikcRzH8d+OsUNbSOTvgW2LREqjHKSk9FjZxAGXlXJQDsqNokRzcebiRC5mT8tllBE7LlzYKBHFJpKMkD+7hvH+6ftMT4M0Y3/1uswzz+d5nu/3+/t9CAaD6n8uu/L5lHK5XroWjwI4kYWP8GMdv3H47A6nk8CDA6U8nvBLX/Ed+TjDEe7lAS24wE+M4zR0180NgXa7NSgOvajHKvqwZglMxBfUoBmVlv/wTXxU0O1WuoqIgQvLaIJDfn9NISbhRd7Tb4ahbJa3a0QthjCFv2/UfwNduJKv0jUOBSajDb8wE0FTdf1GUAzDGliOdExEMSleedsGxJiBZdiVC5GuABbxGZm2p1lUKg1/dOOjnGf9IglIsUkxY3H+jg1yIc136MBb6WjqOwLNe6904AP2kSuDG80qkW15YjZlCdkojSLsEyqwiWMzcAVbaJV6RrK+IQc/dB3NwGuMohAdEYQVoROz8FkHW68FCW1Hv4zS68eeUnWyS/YwLL1Q9rA/jsn4dEtd5mRo9WlzJ03Tda6S7TaPQWmIPCkQCH+6Ww5RfR5WowmX+IckOca2MYBp2SmW8zCb5hpGeKjuWA8yZEulSbP8sqN2JPjZif0owACin4C7wCjG6AAAAABJRU5ErkJggg==", Pd = "data:image/png;base64,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", mi = {
  osm: Ic,
  gsi: Cc,
  gsi_ortho: fc,
  redcircle: Rd,
  defaultpin_selected: Pd,
  defaultpin: $g,
  bluedot: Kg,
  bluedot_transparent: Jg,
  bluedot_small: qg
};
function Wd(e) {
  const t = pr(e);
  return [t[0], t[1]];
}
function Od(e = !1) {
  return e ? mi.defaultpin_selected : mi.defaultpin;
}
const ze = {
  noRotate: !1,
  northUp: !1,
  homeMarginPixels: 50,
  tapDuration: 3e3,
  tapUIVanish: !1,
  debug: !1
};
function $i(e, t) {
  return e?.[t] ?? !1;
}
function BA(e, t) {
  const n = e.__selectedMarker == t.namespaceID;
  return t.icon ? n && t.selectedIcon ? t.selectedIcon : t.icon : Od(n);
}
function NA(e, t) {
  if (!t.includes("#")) {
    for (const s of Object.keys(e.pois)) {
      const o = e.pois[s];
      for (const a of o.pois)
        if (a.id === t) return { poi: a, ancestors: [o, e] };
    }
    return;
  }
  const n = t.split("#"), i = Mt(e.cacheHash, n[0]);
  if (!i?.pois) return;
  let r;
  for (const s of Object.keys(i.pois)) {
    const o = i.pois[s];
    for (const a of o.pois)
      a.id === n[1] && (r = { poi: a, ancestors: [o, i, e] });
  }
  return r;
}
const Ld = {
  "setting-loaded": "onSettingLoaded",
  "appdata-ready": "onAppdataReady",
  "ui-configure": "onUiConfigure",
  "core-dom-ready": "onCoreDomReady",
  "ui-dom-ready": "onUiDomReady",
  "core-ready": "onCoreReady",
  "ui-ready": "onUiReady"
};
class Dd extends Le {
  detail;
  constructor(t) {
    super("gps_error"), this.detail = t;
  }
}
class si extends Le {
  detail;
  constructor(t) {
    super("gps_result"), this.detail = t;
  }
}
class Bd extends Le {
  constructor() {
    super("gps_request");
  }
}
function bn(e, t) {
  console.warn(
    `MaplatCore: POI layer "${e}" not found (${t}). Pass namespaceID (e.g. "<mapID>#<layerId>" for map-derived layers), not the layer-local id.`
  );
}
let Nd = 0;
class yi extends YA {
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
  __featureOption(t, n, i) {
    const r = t?.[n];
    if (r != null) return r;
    const s = this.appData?.[n];
    return s == null ? i : !this.__settingFileKeys || this.__settingFileKeys.has(n) ? (this.__featureKeyWarner || (this.__featureKeyWarner = zA()), this.__elementMode ? (this.__featureKeyWarner(
      n,
      `<maplat-app>: the setting file key "${n}" is a presentation (feature) setting and is ignored; give it as an attribute or property of the element instead.`
    ), i) : (this.__featureKeyWarner(
      n,
      `MaplatApp: reading the feature key "${n}" from the setting file is deprecated and will be removed in the next major version; pass it in appOption (or as an attribute of <maplat-app>) instead.`
    ), s)) : s;
  }
  // Maplat App Class
  constructor(t) {
    super(), t = we(t), t && "__maplatElementMode" in t || Al(), this.__appid = t.appid || "sample", this.__elementMode = t.__maplatElementMode === !0;
    const n = t.mapboxgl || (typeof window < "u" ? window.mapboxgl : void 0);
    n && t.mapboxToken && (n.accessToken = t.mapboxToken), t.googleApiKey && (this.__googleApiKey = t.googleApiKey);
    const i = t.div;
    i && typeof i == "object" && i.nodeType === 1 ? (this.__mapDivDocument = i, this.__mapDiv = i.id || `maplat_app_${++Nd}`) : (this.__mapDiv = i || "map_div", this.__mapDivDocument = document.querySelector(`#${this.__mapDiv}`)), this.mapDivDocument.classList.add("maplat"), this.logger = new jo(
      t.debug ? qe.ALL : qe.INFO
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
          for (const C of u) {
            if (typeof C != "string" || C in this.__initialRestore) continue;
            const y = localStorage.getItem(C);
            y !== null && (this.__initialRestore[C] = y);
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
    const o = Qn(`<img id="center_circle" class="prevent-default maplat-center-marker" alt=""
            style="position:absolute;top:50%;left:50%;margin-top:-10px;
            margin-left:-10px;" src="${mi.redcircle}">`);
    this.__centerMarkerImg = o[0], [...o].reverse().forEach((g) => {
      this.mapDivDocument.insertBefore(
        g,
        this.mapDivDocument.firstChild
      );
    });
    const a = "maplat-core-style";
    if (!document.getElementById(a)) {
      const g = document.createElement("style");
      g.id = a, g.innerHTML = `
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
    const n = this.__centerMarkerImg;
    if (!n) return;
    const i = t.hidden === !0;
    n.hidden = i, n.style.display = i ? "none" : "", t.src ? (n.setAttribute("src", t.src), n.style.margin = "0", n.style.transform = "translate(-50%, -50%)", n.classList.add("maplat-center-marker--custom")) : (n.setAttribute("src", mi.redcircle), n.style.margin = "-10px 0 0 -10px", n.style.transform = "", n.classList.remove("maplat-center-marker--custom"));
  }
  /**
   * @internal 起動後の機能系キー・テンプレート・icon を当てる。
   * `undefined` は「与えられていない」＝ Core の既定（RUNTIME_DEFAULTS）／設定ファイルの値。
   * キーの有無は `in` で見る（`{ northUp: undefined }` は「外された」を意味する）。
   */
  applyRuntimeOptions(t) {
    const n = this.mapObject;
    "northUp" in t && n && (n.northUp = t.northUp ?? ze.northUp), "homeMarginPixels" in t && n && (n.homeMarginPixels = t.homeMarginPixels ?? ze.homeMarginPixels), "debug" in t && (this.logger = new jo(
      t.debug ?? ze.debug ? qe.ALL : qe.INFO
    ));
    let i = !1;
    for (const r of ["icon", "selectedIcon"])
      r in t && (this[r] = t[r], i = !0);
    for (const r of ["poiTemplate", "poiStyle", "iconTemplate"])
      r in t && (this[r] = t[r] ?? $i(this.appData, r), i = !0);
    "hideOutsidePois" in t && (this.__hideOutsidePois = t.hideOutsidePois === !0, i = !0), i && this.from && this.redrawMarkers();
  }
  buildLifecycleContext(t, n) {
    return {
      phaseId: t,
      appData: n ?? this.appData,
      mapDivDocument: this.mapDivDocument,
      core: this,
      uiHookResults: { ...this.lifecycleHookResults }
    };
  }
  async runLifecyclePhase(t, n) {
    this.logger?.debug?.(`lifecycle:${t}`);
    const i = this.buildLifecycleContext(t, n), r = Ld[t], s = this.uiHooks?.[r];
    if (s)
      try {
        const o = await s(i);
        this.lifecycleHookResults[t] = o, i.uiHookResult = o, i.uiHookResults = { ...this.lifecycleHookResults };
      } catch (o) {
        throw this.logger?.debug?.(`lifecycle:error:${t}`), this.dispatchEvent(new zt("lifecycle:error", { phaseId: t, error: o })), o;
      }
    return this.dispatchEvent(
      new zt(`lifecycle:${t}`, i)
    ), i;
  }
  // Async initializers 1: Load application setting
  async settingLoader(t) {
    return t || (await fetch(`apps/${this.appid}.json`)).json();
  }
  // Async initializer 6: Load pois setting => move to normalize_pois.js
  // Async initializer 8: Load sources setting asynchronous
  async sourcesLoader(t) {
    const n = this.appData.sources, i = [], r = {
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
    return n.forEach((s) => {
      i.push(
        Tf(s, r).catch(
          (o) => o instanceof ie ? lf(s, o) : Promise.reject(o)
        )
      );
    }), Promise.all(i);
  }
  // Async initializers 2: Handle application setting
  async handleSetting(t, n) {
    await this.runLifecyclePhase("setting-loaded", t), this.appData = we(t), this.__settingFileKeys = new Set(Object.keys(this.appData || {})), await this.runLifecyclePhase("appdata-ready"), await this.runLifecyclePhase("ui-configure");
    const i = await this.prepareMap(n);
    await this.runLifecyclePhase("ui-dom-ready");
    const r = await Ng(this.appData.pois || [], this);
    await this.handlePois(r, i), this.initGeolocation(n);
  }
  // Async Initializers 2.5: For geolocation settings
  initGeolocation(t) {
    this.__alwaysGpsOn = t.alwaysGpsOn || !1;
    const n = this.geolocation = new $f({
      timerBase: t.fake,
      homePosition: this.appData.homePosition
    });
    this.alwaysGpsOn ? (n.setTracking(!0), this.gpsEnabled_ = !0, this.initialGpsMove_ = !0) : (n.setTracking(!1), this.gpsEnabled_ = !1), n.on("change", () => {
      (async () => {
        const i = this.mapObject, r = i.getLayer("overlay").getLayers().item(0), s = i.getLayers().item(0), o = r ? r.getSource() : s.getSource(), a = n.getPosition(), A = n.getAccuracy();
        if (!a || !A) return;
        let g = !this.moveTo_ && !this.firstGpsRequest_;
        this.alwaysGpsOn && (g = !this.initialGpsMove_), this.__outsideSelection && (g = !0);
        const c = await o.setGPSMarkerAsync({ lnglat: a, acc: A }, g);
        this.moveTo_ = !1, this.firstGpsRequest_ = !1, this.initialGpsMove_ = !1, c || (this.alwaysGpsOn || this.handleGPS(!1, !0), o.setGPSMarker());
        const u = this.alwaysGpsOn ? "gps_out_hide" : "gps_out";
        this.dispatchEvent(new si(c ? { lnglat: a, acc: A } : { error: u }));
      })();
    }), n.on("error", (i) => {
      const r = i.code;
      if (r === 3) return;
      n.setTracking(!1), this.gpsEnabled_ = !1;
      const s = this.mapObject, o = s.getLayer("overlay").getLayers().item(0), a = s.getLayers().item(0);
      (o ? o.getSource() : a.getSource()).setGPSMarker(), this.dispatchEvent(new Dd(r === 1 ? "user_gps_deny" : r === 2 ? "gps_miss" : "gps_timeout")), this.dispatchEvent(new si({ error: "gps_off" }));
    }), this.addEventListener("mapChanged", () => {
      (async () => {
        if (n.getTracking()) {
          const i = this.mapObject, r = i.getLayer("overlay").getLayers().item(0), s = i.getLayers().item(0), o = r ? r.getSource() : s.getSource(), a = n.getPosition(), A = n.getAccuracy();
          if (!a || !A) return;
          const g = await o.setGPSMarkerAsync({ lnglat: a, acc: A }, !0);
          g || (this.alwaysGpsOn || this.handleGPS(!1, !0), o.setGPSMarker());
          const c = this.alwaysGpsOn ? "gps_out_hide" : "gps_out";
          this.dispatchEvent(new si(g ? { lnglat: a, acc: A } : { error: c }));
        }
      })();
    });
  }
  // GPS handling methods
  handleGPS(t, n = !1) {
    if (this.geolocation) {
      if (t)
        if (!this.alwaysGpsOn)
          this.firstGpsRequest_ = !0, this.geolocation.setTracking(!0), this.gpsEnabled_ = !0, this.dispatchEvent(new Bd());
        else {
          const i = this.geolocation.getPosition(), r = this.geolocation.getAccuracy();
          if (i && r) {
            const s = this.mapObject, o = s.getLayer("overlay").getLayers().item(0), a = s.getLayers().item(0), A = o ? o.getSource() : a.getSource();
            (async () => await A.setGPSMarkerAsync(
              { lnglat: i, acc: r },
              !!this.__outsideSelection
            ) || (A.setGPSMarker(), this.dispatchEvent(new si({ error: "gps_out" }))))();
          }
        }
      else if (!this.alwaysGpsOn) {
        this.geolocation.setTracking(!1), this.gpsEnabled_ = !1;
        const i = this.mapObject, r = i.getLayer("overlay").getLayers().item(0), s = i.getLayers().item(0);
        (r ? r.getSource() : s.getSource()).setGPSMarker(), n || this.dispatchEvent(new si({ error: "gps_off" }));
      }
    }
  }
  getGPSEnabled() {
    return this.gpsEnabled_;
  }
  // Async initializers 5: Prepare map base elements and objects
  async prepareMap(t) {
    t = we(t), this.mercBuffer = null;
    const n = this.appData.homePosition, i = this.appData.defaultZoom, r = this.appData.zoomRestriction, s = this.appData.minZoom, o = this.appData.maxZoom;
    this.appName = this.appData.appName;
    const a = t.fake && !this.__elementMode ? this.appData.fakeGps : !1, A = t.fake && !this.__elementMode ? this.appData.fakeRadius : !1;
    this.__noRotate = this.__featureOption(t, "noRotate", ze.noRotate), this.poiTemplate = t.poiTemplate ?? $i(this.appData, "poiTemplate"), this.poiStyle = t.poiStyle ?? $i(this.appData, "poiStyle"), this.iconTemplate = t.iconTemplate ?? $i(this.appData, "iconTemplate"), this.currentPosition = null, this.__hideOutsidePois = t.hideOutsidePois === !0, this.__init = !0;
    const g = `${this.mapDiv}_front`;
    let c = Qn(
      `<div id="${g}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;"></div>`
    )[0];
    this.mapDivDocument.insertBefore(c, this.mapDivDocument.firstChild), this.__fakeGps = a, this.__fakeRadius = A, this.homePosition = n, this.mapObject = new Ze({
      div: g,
      controls: this.__featureOption(t, "controls", []),
      interactions: this.noRotate ? qa({ altShiftDragRotate: !1, pinchRotate: !1 }) : qa().extend([
        new JC({
          condition: PC
        })
      ]),
      fakeGps: a,
      fakeRadius: A,
      homePosition: n,
      northUp: this.__featureOption(t, "northUp", ze.northUp),
      tapDuration: this.__featureOption(t, "tapDuration", ze.tapDuration),
      homeMarginPixels: this.__featureOption(t, "homeMarginPixels", ze.homeMarginPixels),
      tapUIVanish: this.__featureOption(t, "tapUIVanish", ze.tapUIVanish),
      alwaysGpsOn: t.alwaysGpsOn || !1
    });
    let u;
    this.overlay && (u = `${this.mapDiv}_back`, c = Qn(
      `<div id="${u}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;"></div>`
    )[0], this.mapDivDocument.insertBefore(
      c,
      this.mapDivDocument.firstChild
    ), this.backMap = new Ze({
      off_control: !0,
      div: u
    }), this.__viewportOffset = new Zf(this.mapObject, this.backMap));
    const C = t.mapboxgl || (typeof window < "u" ? window.mapboxgl : void 0);
    if (C) {
      const f = `${this.mapDiv}_mapbox`;
      c = Qn(
        `<div id="${f}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;visibility:hidden;"></div>`
      )[0], this.mapDivDocument.insertBefore(
        c,
        this.mapDivDocument.firstChild
      ), this.mapboxMap = new C.Map({
        attributionControl: !1,
        boxZoom: !1,
        container: f,
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
    const y = t.maplibregl || (typeof window < "u" ? window.maplibregl : void 0);
    if (y) {
      const f = `${this.mapDiv}_maplibre`;
      c = Qn(
        `<div id="${f}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;visibility:hidden;"></div>`
      )[0], this.mapDivDocument.insertBefore(
        c,
        this.mapDivDocument.firstChild
      ), this.maplibreMap = new y.Map({
        attributionControl: !1,
        boxZoom: !1,
        container: f,
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
    this.__attributionLangOption = t.lang, this.__attribution?.dispose(), this.__attribution = new kd(
      this.mapDivDocument,
      () => md(this.mapDivDocument, this.__attributionLangOption, this.appData?.lang)
    );
    const w = this.mapObject;
    w.on("postrender", (f) => {
      this.__attribution?.refreshDynamic(
        [w.getSource(), this.from instanceof _n ? this.from : void 0],
        f.frameState
      );
    });
    const l = this.backMap;
    return l?.on("postrender", (f) => {
      this.__attribution?.refreshDynamic([l.getSource()], f.frameState);
    }), await this.runLifecyclePhase("core-dom-ready"), this.startFrom = this.appData.startFrom, {
      homePos: n,
      defZoom: i,
      zoomRestriction: r,
      mercMinZoom: s,
      mercMaxZoom: o
    };
  }
  // Async initializer 7: Handle pois loading result
  async handlePois(t, n) {
    this.pois = t;
    const i = await this.sourcesLoader(n);
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
    return If(this).forEach((r) => {
      i.push({ mapID: r.mapID, usable: !1 });
    }), i;
  }
  // Async initializer 9: Handle sources loading result
  async handleSources(t) {
    const n = [], i = [], r = [];
    if (this.cacheHash = /* @__PURE__ */ Object.create(null), t.forEach((s) => {
      if (uf(s)) {
        r.push({
          mapID: s.mapID,
          reason: s.__maplatUnusable.reason
        }), console.error(
          `Maplat: IIIF image for map "${s.mapID}" is not usable: ${s.__maplatUnusable.reason}`
        );
        return;
      }
      i.push(s), s.setMap(this.mapObject), sl(s, {
        mapboxMap: this.mapboxMap,
        maplibreMap: this.maplibreMap,
        warn: (a, ...A) => {
          this.logger?.warn ? this.logger.warn(a, ...A) : console.warn(a, ...A);
        }
      }) && (n.push(s), this.cacheHash[s.mapID] = s);
    }), hf(this, r), this.mercSrc = n.reduce((s, o) => {
      if (s) return s;
      if (o.isBasemap()) return o;
    }, null), this.dispatchEvent(new zt("sourceLoaded", i)), n.length === 0) {
      this.logger?.warn ? this.logger.warn("No usable sources; skipping map initialization handlers") : console.warn("No usable sources; skipping map initialization handlers"), await this.runLifecyclePhase("core-ready"), await this.runLifecyclePhase("ui-ready");
      return;
    }
    await this.setInitialMap(n), this.setMapClick(), this.setPointerEvents(), this.__elementMode || this.setMapOnOff(), this.setMouseCursor(), this.setBackMapBehavior(), this.raiseChangeViewpoint(), await this.runLifecyclePhase("core-ready"), await this.runLifecyclePhase("ui-ready");
  }
  // Async initializer 10: Handle initial map
  async setInitialMap(t) {
    let n = this.initialRestore.mapID || this.startFrom || t[t.length - 1].mapID;
    if (!t.some((i) => i.mapID === n)) {
      const i = t[t.length - 1].mapID;
      console.warn(
        `Maplat: the initial map "${n}" is not usable; starting from "${i}" instead.`
      ), n = i;
    }
    this.from = t.reduce(
      (i, r) => i ? !(i instanceof ac) && r.mapID != n ? r : i : r.mapID != n ? r : i,
      void 0
    ), await this.changeMap(n, this.initialRestore);
  }
  // Async initializer 11: Handle map click event
  setMapClick() {
    this.mapObject.on("click", (t) => {
      this.logger.debug(t.pixel), this.lastClickEvent = t;
      const n = [];
      if (t.target.forEachFeatureAtPixel(t.pixel, (i) => {
        this.logger.debug(t.pixel), i.get("datum") && n.push(i.get("datum"));
      }), n.length === 0 && n.push(...IA(this, t)), n.length > 0)
        this.dispatchEvent(new zt("clickMarker", n[0])), this.dispatchEvent(new zt("clickMarkers", n));
      else {
        const i = t.coordinate;
        this.dispatchEvent(new zt("clickMapXy", i));
        const r = os(this, t.pixel, this.__offsetNow);
        (r ? Promise.resolve(r.merc) : this.from.sysCoord2MercAsync(i)).then((s) => {
          if (!s) return;
          this.dispatchEvent(new zt("clickMapMerc", s));
          const o = re(s, "EPSG:3857", "EPSG:4326");
          this.dispatchEvent(
            new zt("clickMap", {
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
    let t = !1, n = !1;
    const i = {};
    let r;
    const s = (o, a) => {
      this.dispatchEvent(new zt("pointerMoveOnMapXy", o)), new Promise((A) => {
        const g = a ? os(this, a, this.__offsetCached) : void 0;
        A(g ? g.merc : this.from.sysCoord2MercAsync(o));
      }).then((A) => {
        A && this.dispatchEvent(new zt("pointerMoveOnMapMerc", A));
      }).catch((A) => {
        this.logger.debug(A);
      }).then(() => {
        if (r) {
          const A = r;
          r = void 0, s(A.xy, A.pixel);
        } else
          t = !1;
      });
    };
    this.mapObject.on("pointermove", (o) => {
      n || (t ? r = { xy: o.coordinate, pixel: o.pixel } : (t = !0, s(o.coordinate, o.pixel)));
    }), this.mapObject.on("pointerdown", (o) => {
      o.originalEvent && o.originalEvent.pointerId != null && (i[o.originalEvent.pointerId] = !0), n = !0;
    }), this.mapObject.on("pointerdrag", (o) => {
      o.originalEvent && o.originalEvent.pointerId != null && (i[o.originalEvent.pointerId] = !0), n = !0;
    }), this.mapObject.on("pointerup", (o) => {
      o.originalEvent && o.originalEvent.pointerId != null ? (delete i[o.originalEvent.pointerId], Object.keys(i).length == 0 && (n = !1)) : o.originalEvent && o.originalEvent.touches ? o.originalEvent.touches.length == 0 && (n = !1) : n = !1;
    });
  }
  // Async initializer 13: Handle map UI on/off
  setMapOnOff() {
    let t;
    const n = () => this.mapDivDocument.querySelectorAll(".ol-control"), i = (s) => {
      s.forEach((o) => o.classList.add("fade"));
    }, r = (s) => {
      s.forEach((o) => o.classList.remove("fade"));
    };
    this.mapObject.on("click", () => {
      t && (clearTimeout(t), t = void 0);
      const s = n(), o = s.length && s[0].classList.contains("fade");
      !this.mapObject.tapUIVanish || o ? r(s) : (i(s), t = setTimeout(() => {
        t = void 0, r(n());
      }, this.mapObject.tapDuration));
    }), this.mapObject.on("pointerdrag", () => {
      t && (clearTimeout(t), t = void 0), i(n());
    }), this.mapObject.on("moveend", () => {
      t && (clearTimeout(t), t = void 0), t = setTimeout(() => {
        t = void 0, r(n());
      }, this.mapObject.tapDuration);
    });
  }
  // Async initializer 14: Handle mouse cursor
  setMouseCursor() {
    const t = (r, s) => {
      const o = this.mapDivDocument.querySelector(`#${r}`);
      o.style.cursor !== s && (o.style.cursor = s);
    }, n = (r) => {
      const s = r.pixel, o = r.target.hasFeatureAtPixel(s), a = r.target.getTarget();
      if (o) {
        const g = r.target.forEachFeatureAtPixel(
          s,
          (c) => {
            if (c.get("datum")) return c;
          }
        );
        t(a, g ? "pointer" : "");
        return;
      }
      const A = IA(this, r).length > 0;
      t(a, A ? "pointer" : "");
    };
    this.mapObject.on("pointermove", n);
    const i = (r) => {
      zs(this, r.target.getView());
    };
    this.mapObject.on("moveend", i);
  }
  // Async initializer 15: Handle back map's behavior
  setBackMapBehavior() {
    const t = (n) => {
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
      const n = this.mapObject.getView(), i = n.getCenter(), r = n.getDecimalZoom(), s = Ni(n.getRotation() * 180 / Math.PI), o = await this.from.viewpoint2MercsAsync(), a = await this.mercSrc.mercs2ViewpointAsync(o);
      if (this.mobileMapMoveBuffer && this.mobileMapMoveBuffer[0][0] == a[0][0] && this.mobileMapMoveBuffer[0][1] == a[0][1] && this.mobileMapMoveBuffer[1] == a[1] && this.mobileMapMoveBuffer[2] == a[2]) return;
      this.mobileMapMoveBuffer = a;
      const A = re(a[0], "EPSG:3857", "EPSG:4326"), g = Ni(a[2] * 180 / Math.PI);
      this.dispatchEvent(
        new zt("changeViewpoint", {
          x: i[0],
          y: i[1],
          longitude: A[0],
          latitude: A[1],
          mercator_x: a[0][0],
          mercator_y: a[0][1],
          zoom: r,
          mercZoom: a[1],
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
    return t ? Ni(t.getRotation() * 180 / Math.PI) : 0;
  }
  // 現在の実世界方位角を度数で返す。TIN地図では歪み補正込みの非同期計算になるためPromiseを返す (#61)
  async getDirection() {
    if (!this.from || !this.mercSrc) return this.getRotation();
    const t = await this.from.viewpoint2MercsAsync(), n = await this.mercSrc.mercs2ViewpointAsync(t);
    return Ni(n[2] * 180 / Math.PI);
  }
  currentMapInfo() {
    return zo(this.from);
  }
  mapInfo(t) {
    return zo(Mt(this.cacheHash, t));
  }
  /** @internal 要素の viewExtent。pixel → 地図の座標 → merc を旧の連鎖のまま返す。 */
  async pixelToMerc(t) {
    const n = this.mapObject, i = this.from;
    if (!n || !i) return;
    const r = n.getCoordinateFromPixel(t);
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
  __offsetCached = () => this.__viewportOffset ? this.__viewportOffset.get() : Dn(this.mapObject, this.backMap);
  __offsetNow = () => this.__viewportOffset ? this.__viewportOffset.refresh() : Dn(this.mapObject, this.backMap);
  /** @internal 前面と背面の地図の大きさを測り直す。 */
  updateSize() {
    this.mapObject?.updateSize?.(), this.backMap?.updateSize?.();
  }
  async clientPointToLngLat(t, n) {
    if (!this.from || !this.mapObject) return;
    const r = this.mapObject.getViewport().getBoundingClientRect(), s = [t - r.left, n - r.top], o = os(this, s, this.__offsetNow), a = o ? o.merc : await this.pixelToMerc(s);
    if (!a) return;
    const A = re(a, "EPSG:3857", "EPSG:4326");
    return {
      longitude: A[0],
      latitude: A[1]
    };
  }
  async lngLatToClientPoint(t, n) {
    if (!this.from || !this.mapObject) return;
    const i = re([t, n], "EPSG:4326", "EPSG:3857"), r = await Wf(this, i), s = r ? r.map : this.mapObject, o = r ? r.coord : await this.from.merc2SysCoordAsync(i), a = s.getPixelFromCoordinate(o);
    if (!a) return;
    const A = s.getViewport().getBoundingClientRect();
    return {
      x: a[0] + A.left,
      y: a[1] + A.top
    };
  }
  setMarker(t) {
    this.logger.debug(t);
    const n = BA(this, t);
    return ir(this, t).then((i) => {
      Hf(this, t, n, i);
    });
  }
  resetMarker() {
    hA(this, { front: [], back: [] });
  }
  setLine(t) {
    t.type = "Line", !t.style && t.stroke && (t.style = {
      stroke: t.stroke
    }), this.setVector(t);
  }
  setVector(t) {
    this.__projectVector(t).then((n) => {
      this.mapObject.setVector(n, t.type, t.style);
    });
  }
  // data の座標（coordinates はメルカトル・lnglats は経緯度）を今の地図の座標へ変換する
  __projectVector(t) {
    this.logger.debug(t);
    let n;
    const i = (r, s = !1) => Promise.all(
      r.map((o) => Array.isArray(o[0]) ? i(o, s) : (s && (o = re(o, "EPSG:4326", "EPSG:3857")), this.from.merc2SysCoordAsync(o)))
    );
    return t.coordinates ? n = i(t.coordinates) : n = i(t.lnglats, !0), n;
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
    const n = this.__nextVectorDrawToken();
    t.drawToken = n, t.feature = void 0, this.__projectVector(t.data).then((i) => {
      this.__vectorStore().get(t.id) !== t || t.drawToken !== n || (t.feature = this.mapObject.setVector(
        i,
        t.data.type,
        t.data.style
      ));
    });
  }
  __addEntry(t, n) {
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
      data: n,
      kind: n.type === void 0 || n.type === "Line" ? "Line" : "Polygon",
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
    const n = (i) => {
      const r = [];
      let s;
      const o = (A, ...g) => {
        const c = cA(A, ...g), u = {
          data: c,
          icon: BA(this, c)
        };
        this.__selectedMarker == c.namespaceID ? s = u : r.push(u);
      };
      if (!this.stateBuffer.hideMarker) {
        for (const A of Object.keys(this.pois)) {
          const g = this.pois[A];
          if (!g.hide)
            for (const c of g.pois) o(c, g, this);
        }
        if (i.pois)
          for (const A of Object.keys(i.pois)) {
            const g = i.pois[A];
            if (!g.hide)
              for (const c of g.pois)
                o(c, g, i, this);
          }
      }
      const a = s ? [...r, s] : r;
      Promise.all(a.map((A) => ir(this, A.data))).then(
        (A) => {
          hA(this, Yf(this, a, A));
          const g = this.__outsideSelection;
          g && !this.stateBuffer.hideMarker && (s ? s.data?.namespaceID === g.id && as(this, A[A.length - 1]) : g.pending && as(this, void 0)), this.__redrawMarkerThrottle && this.__redrawMarkerThrottle.length > 0 ? n(this.__redrawMarkerThrottle.shift()) : this.__redrawMarkerBlock = !1;
        }
      );
    };
    n(t);
  }
  selectMarker(t) {
    const n = this.getMarker(t);
    if (!n) return;
    this.__selectedMarker = t, this.__pullBackTimer = void 0, this.__outsideSelection = { id: t, pending: !0 };
    const i = {
      latitude: n.lnglat ? n.lnglat[1] : n.lat ? n.lat : n.latitude,
      longitude: n.lnglat ? n.lnglat[0] : n.lng ? n.lng : n.longitude
    };
    this.setViewpoint(i), this.redrawMarkers(), ir(this, n).then((r) => {
      this.__selectedMarker === t && as(this, r, { recenter: !0 });
    });
  }
  unselectMarker() {
    delete this.__selectedMarker;
    const t = !!this.__outsideSelection;
    if (delete this.__outsideSelection, this.redrawMarkers(), !t) return;
    const n = {};
    this.__pullBackTimer = n, queueMicrotask(() => {
      if (this.__pullBackTimer !== n) return;
      this.__pullBackTimer = void 0;
      const i = this.mapObject?.getView?.();
      i && zs(this, i);
    });
  }
  getMarker(t) {
    const n = NA(this, t);
    if (n)
      return cA(n.poi, ...n.ancestors);
  }
  updateMarker(t, n, i) {
    const r = NA(this, t)?.poi;
    if (r) {
      if (n = pi(n || {}), i) {
        for (const s of Object.keys(r))
          s !== "id" && s !== "namespaceID" && delete r[s];
        Object.assign(r, n);
      } else
        for (const s of Object.keys(n))
          s === "id" || s === "namespaceID" || (n[s] === "____delete____" ? delete r[s] : r[s] = n[s]);
      this.redrawMarkers();
    }
  }
  addMarker(t, n) {
    if (n || (n = "main"), n.includes("#")) {
      const i = n.split("#"), r = Mt(this.cacheHash, i[0]);
      if (r) {
        const s = r.addPoi(t, i[1]);
        return this.dispatchPoiNumber(), this.redrawMarkers(), s;
      }
    } else {
      const i = Mt(this.pois, n);
      if (i)
        return i.pois.push(pi(t)), lo(this.pois, n, {
          name: this.appName
        }), this.dispatchPoiNumber(), this.redrawMarkers(), t.namespaceID;
    }
  }
  removeMarker(t) {
    if (t.includes("#")) {
      const n = t.split("#"), i = Mt(this.cacheHash, n[0]);
      i && (i.removePoi(n[1]), this.dispatchPoiNumber(), this.redrawMarkers());
    } else {
      let n = 0;
      for (const i of Object.keys(this.pois)) {
        const r = this.pois[i].pois;
        for (let s = r.length - 1; s >= 0; s--)
          r[s].id === t && (r.splice(s, 1), n++);
      }
      n > 0 && (this.dispatchPoiNumber(), this.redrawMarkers());
    }
  }
  clearMarker(t) {
    if (t || (t = "main"), t.includes("#")) {
      const n = t.split("#"), i = Mt(this.cacheHash, n[0]);
      i && (i.clearPoi(n[1]), this.dispatchPoiNumber(), this.redrawMarkers());
    } else {
      if (t === "all")
        for (const n of Object.keys(this.pois))
          this.pois[n].pois = [];
      else {
        const n = Mt(this.pois, t);
        if (!n) return;
        n.pois = [];
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
      new zt(
        "poi_number",
        this.listPoiLayers(!1, !0).reduce(
          (t, n) => t + n.pois.length,
          0
        )
      )
    );
  }
  listPoiLayers(t = !1, n = !1) {
    const i = Object.keys(this.pois).sort((s, o) => s === "main" ? -1 : o === "main" ? 1 : 0).map((s) => this.pois[s]).filter(
      (s) => n ? t ? s.pois.length && s.hide : s.pois.length : t ? s.hide : !0
    ), r = this.from.listPoiLayers(
      t,
      n
    );
    return i.concat(r);
  }
  showPoiLayer(t) {
    const n = this.getPoiLayer(t);
    if (!n) {
      bn(t, "showPoiLayer");
      return;
    }
    delete n.hide, this.requestUpdateState({
      hideLayer: this.listPoiLayers(!0).map((i) => i.namespaceID).join(",")
    }), this.redrawMarkers();
  }
  hidePoiLayer(t) {
    const n = this.getPoiLayer(t);
    if (!n) {
      bn(t, "hidePoiLayer");
      return;
    }
    n.hide = !0, this.requestUpdateState({
      hideLayer: this.listPoiLayers(!0).map((i) => i.namespaceID).join(",")
    }), this.redrawMarkers();
  }
  getPoiLayer(t) {
    if (typeof t == "string")
      if (t.includes("#")) {
        const n = t.split("#"), i = Mt(this.cacheHash, n[0]);
        if (i)
          return i.getPoiLayer(n[1]);
      } else
        return Mt(this.pois, t);
  }
  addPoiLayer(t, n) {
    if (t !== "main" && !this.pois[t])
      if (!t.includes("#"))
        this.pois[t] = Ue(n || [], t, {
          name: this.appName
        }), this.redrawMarkers();
      else {
        const i = t.split("#"), r = Mt(this.cacheHash, i[0]);
        r ? (r.addPoiLayer(i[1], n), this.redrawMarkers()) : bn(t, "addPoiLayer");
      }
  }
  removePoiLayer(t) {
    if (t !== "main")
      if (t.includes("#")) {
        const n = t.split("#"), i = Mt(this.cacheHash, n[0]);
        if (!i) {
          bn(t, "removePoiLayer");
          return;
        }
        if (!i.getPoiLayer(n[1])) {
          bn(t, "removePoiLayer");
          return;
        }
        i.removePoiLayer(n[1]), this.requestUpdateState({
          hideLayer: this.listPoiLayers(!0).map((r) => r.namespaceID).join(",")
        }), this.dispatchPoiNumber(), this.redrawMarkers();
      } else {
        if (!this.pois[t]) {
          bn(t, "removePoiLayer");
          return;
        }
        delete this.pois[t], this.requestUpdateState({
          hideLayer: this.listPoiLayers(!0).map((n) => n.namespaceID).join(",")
        }), this.dispatchPoiNumber(), this.redrawMarkers();
      }
  }
  // #91: 線を足して id を返す。data.id を与えればその id、無ければ自動の id。
  // 呼び手の data は変えず、写しに setLine と同じ正規化（type・stroke → style）をする。
  addLine(t) {
    const n = { ...t, type: "Line" };
    return !n.style && n.stroke && (n.style = {
      stroke: n.stroke
    }), delete n.id, this.__addEntry(t.id, n);
  }
  // #91: 線・面を足して id を返す（data.type が "Line" なら線、それ以外は面）
  addVector(t) {
    const n = { ...t };
    return delete n.id, this.__addEntry(t.id, n);
  }
  // #91: id の 1 件だけを消す。消したら true、無ければ false
  removeVector(t) {
    const n = this.__vectorStore(), i = n.get(t);
    return i ? (n.delete(t), i.feature && (this.mapObject.removeFeature(i.feature, "feature"), i.feature = void 0), !0) : !1;
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
    const n = t?.type;
    if (!n) {
      this.__vectorStore().clear(), this.resetVector();
      return;
    }
    Array.from(this.__vectorStore().values()).filter((i) => i.kind === n).forEach((i) => this.removeVector(i.id));
  }
  setGPSMarker(t) {
    this.currentPosition = t, this.from.setGPSMarker(t, !0);
  }
  changeMap(t, n) {
    n === void 0 && (n = {});
    const i = this.mercSrc, r = Mt(this.cacheHash, t);
    return r ? (this.changeMapSeq || (this.changeMapSeq = Promise.resolve()), this.changeMapSeq = this.changeMapSeq.then(
      () => new Promise((s, o) => {
        const a = () => this.convertParametersFromCurrent(r, (A) => {
          const g = this.from, c = this.__captureViewState();
          let u = null, C = null;
          const y = n.backgroundID ? Mt(this.cacheHash, n.backgroundID) : void 0;
          if (this.backMap && (u = this.backMap.getSource(), r.isWmts() ? this.backMap.exchangeSource() : (y ? (C = y, this.backMap.exchangeSource(C)) : u ? C = u : (C = i, this.from.isWmts() && (C = this.from instanceof _n ? (
            // If current foreground is a TMS overlay, use the current
            // basemap as new background. On initial load no foreground
            // source is set yet, so fall back to the default basemap
            // (mercSrc) to avoid a null background source.
            this.mapObject.getSource() || i
          ) : this.from), C && this.backMap.exchangeSource(C)), C && this.requestUpdateState({ backgroundID: C.mapID }))), r instanceof _n) {
            if (this.mapObject.setLayer(r), y)
              this.mapObject.exchangeSource(y);
            else if (!this.from.isWmts()) {
              const I = u || i;
              this.mapObject.exchangeSource(I);
            }
            const p = this.mapObject.getSource();
            p && this.requestUpdateState({ backgroundID: p.mapID });
          } else
            this.mapObject.setLayer(), this.mapObject.exchangeSource(r);
          const w = {
            mapID: r.mapID
          };
          r.isBasemap() && (w.backgroundID = "____delete____"), this.requestUpdateState(w), this.from = r, this.dispatchPoiNumber();
          const l = this.mapObject.getView();
          this.appData.zoomRestriction && (l.setMaxZoom(r.maxZoom), l.setMinZoom(r.minZoom || 0)), A && r.insideCheckSysCoord(A[0]) ? (this.__outsideSelection && (this.__outsideSelection = {
            ...this.__outsideSelection,
            pending: !0
          }), l.setCenter(A[0]), l.setZoom(A[1]), l.setRotation(this.noRotate ? 0 : A[2])) : !this.__init && !A && !this.__hasMapSize() && g ? this.__pendingView ? this.__pendingView.positionMapID !== r.mapID && (delete this.__pendingView.position, delete this.__pendingView.positionMapID) : this.__pendingView = { from: g, state: c } : this.__init ? A || this.__hasMapSize() && this.goHome(r) : this.__outsideSelection ? this.__outsideSelection = {
            ...this.__outsideSelection,
            pending: !0
          } : (this.dispatchEvent(new zt("outOfMap", {})), this.goHome(r)), r.setGPSMarker(this.currentPosition, !0), n.hideLayer && (n.hideLayer.split(",").map((I) => {
            const b = this.getPoiLayer(I);
            b && (b.hide = !0);
          }), this.requestUpdateState({ hideLayer: n.hideLayer })), n.hideMarker ? this.hideAllMarkers() : this.redrawMarkers(), this.resetVector(), this.__vectorStore().forEach((p) => this.__drawVectorEntry(p));
          const f = r instanceof _n ? r : void 0;
          this.__attribution?.update(
            yd({
              front: this.mapObject.getSource(),
              overlay: f,
              back: this.backMap?.getSource()
            }),
            f ? [f] : []
          ), this.dispatchEvent(
            new zt("mapChanged", this.getMapMeta(r.mapID))
          ), this.mapObject.updateSize(), this.mapObject.render(), n.position && (this.__hasMapSize() ? (this.__init = !1, r.setViewpoint(n.position)) : this.__pendingView && (this.__pendingView.position = n.position, this.__pendingView.positionMapID = r.mapID)), this.setTransparency(
            n.transparency !== void 0 && n.transparency !== null ? n.transparency : this.getTransparency()
          ), this.__init ? this.__hasMapSize() && (this.__init = !1, this.goHome(r)) : this.backMap && C && this.convertParametersFromCurrent(C, (p) => {
            if (!p)
              return;
            const I = this.backMap.getView();
            I.setCenter(p[0]), I.setZoom(p[1]), I.setRotation(this.noRotate ? 0 : p[2]), this.backMap.updateSize(), this.backMap.render();
          }), s(void 0);
        });
        this.__pendingView ? this.__applyPendingView().then(a) : a();
      })
    )) : (this.logger.warn(`changeMap: mapID "${t}" not found in cacheHash`), Promise.resolve());
  }
  requestUpdateState(t) {
    if (this.stateBuffer = Object.assign(this.stateBuffer, t), this.stateBuffer.backgroundID == "____delete____" && delete this.stateBuffer.backgroundID, this.restoreSession) {
      const n = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
      localStorage.setItem("epoch", `${n}`);
      const i = function(r) {
        Object.keys(r).map((s) => {
          s == "position" ? i(r[s]) : s == "backgroundID" && r[s] == "____delete____" ? localStorage.removeItem(s) : localStorage.setItem(s, r[s]);
        });
      };
      i(t);
    }
    this.timer && clearTimeout(this.timer), this.timer = setTimeout(() => {
      this.timer = void 0, this.dispatchEvent(new zt("updateState", this.stateBuffer));
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
    const t = this.mapObject, n = t ? t.getView() : void 0;
    if (!t || !n || !this.mapDivDocument) return;
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
    const t = this.__pendingView, n = this.mapObject, i = this.from;
    return !t || !n || !i || (n.updateSize(), !this.__hasMapSize()) ? Promise.resolve() : new Promise((r) => {
      let s = !1;
      const o = () => {
        s || (s = !0, this.__pendingView === t && (this.__pendingView = null), t.position && t.positionMapID === i.mapID && i.setViewpoint(t.position), n.updateSize(), n.render(), r());
      }, a = (A) => {
        s || (this.logger.warn(`changeMap: pending viewpoint conversion failed: ${A}`), this.goHome(i), o());
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
          (A) => {
            const g = n.getView();
            A && i.insideCheckSysCoord(A[0]) ? (g.setCenter(A[0]), g.setZoom(A[1]), g.setRotation(this.noRotate ? 0 : A[2])) : this.__outsideSelection?.merc ? vc(this, this.__outsideSelection.merc) : (this.dispatchEvent(new zt("outOfMap", {})), this.goHome(i)), o();
          },
          a
        );
      } catch (A) {
        a(A);
      }
    });
  }
  // 現在の view の視点を控える。有限でない値を含む場合は undefined
  // （非表示中に resolution が NaN へ崩れた後など。変換核へ流すと #101 と同じ例外になる）。
  __captureViewState() {
    const t = this.mapObject ? this.mapObject.getView() : void 0;
    if (!t) return;
    const n = this.__captureRawViewState(t), { center: i, zoom: r, decimalZoom: s, rotation: o } = n;
    if (!(!i || ![i[0], i[1], r, s, o].every(
      (a) => Number.isFinite(a)
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
    let n;
    if (t ? n = Mt(this.cacheHash, t) : n = this.from, !n) return;
    const i = li.reduce(
      (s, o) => (s[o] = n.get(o), s),
      {
        mapID: n.mapID,
        label: n.label
      }
    ), r = qI(n?.iiif, n?.iiifMetadataDisplay);
    return r && (i.iiif = r), i;
  }
  getMapCacheEnable(t) {
    let n;
    return t ? n = Mt(this.cacheHash, t) : n = this.from, n ? n.getCacheEnable() : !1;
  }
  async getMapTileCacheStatsAsync(t) {
    let n;
    return t ? n = Mt(this.cacheHash, t) : n = this.from, n ? await n.getTileCacheStatsAsync() : {};
  }
  async getMapTileCacheSizeAsync(t) {
    return (await this.getMapTileCacheStatsAsync(t)).size || 0;
  }
  async clearMapTileCacheAsync(t) {
    let n;
    t ? n = Mt(this.cacheHash, t) : n = this.from, n && await n.clearTileCacheAsync();
  }
  async fetchAllMapTileCacheAsync(t, n) {
    let i;
    if (t ? i = Mt(this.cacheHash, t) : i = this.from, !i) {
      n("stop", {});
      return;
    }
    await i.fetchAllTileCacheAsync(n);
  }
  async cancelMapTileCacheAsync(t) {
    let n;
    t ? n = Mt(this.cacheHash, t) : n = this.from, n && await n.cancelTileCacheAsync();
  }
  convertParametersFromCurrent(t, n) {
    this.__convertFromCurrent(t, n);
  }
  // #108: convertParametersFromCurrent の本体。公開の型を変えずに
  // onError の口を得るために private へ移した。onError を渡したときだけ、同期例外も
  // 非同期の失敗（__convertParameters の onError）も投げずに onError へ渡す。
  // onError が無いときは今までと同じ（例外をそのまま投げる）。
  __convertFromCurrent(t, n, i) {
    try {
      const r = this.mapObject.getView();
      if (r && !this.__hasMapSize()) {
        n && n();
        return;
      }
      if (!this.from) {
        n && n();
        return;
      }
      const s = this.__captureRawViewState(r);
      this.__convertParameters(
        this.from,
        s,
        t,
        n,
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
  __convertParameters(t, n, i, r, s) {
    let o = t.viewpoint2MercsAsync([
      n.center,
      n.decimalZoom,
      n.rotation
    ]);
    const a = Fs(
      [n.center, n.zoom, n.rotation],
      10
    );
    if (this.mercBuffer && this.mercBuffer.mercs && this.mercBuffer.buffer[t.mapID]) {
      const A = this.mercBuffer.buffer[t.mapID];
      A[0][0] == a[0][0] && A[0][1] == a[0][1] && A[1] == a[1] && A[2] == a[2] ? (this.logger.debug(A), this.logger.debug(a), this.logger.debug("From: Use buffer"), o = new Promise((g, c) => {
        g(this.mercBuffer.mercs);
      })) : (this.mercBuffer = {
        buffer: {}
      }, this.mercBuffer.buffer[t.mapID] = a);
    } else
      this.mercBuffer = {
        buffer: {}
      }, this.mercBuffer.buffer[t.mapID] = a;
    this.logger.debug(
      `From: Center: ${a[0]} Zoom: ${a[1]} Rotation: ${a[2]}`
    ), this.logger.debug(`From: ${t.mapID}`), o.then((A) => {
      this.mercBuffer.mercs = A, this.logger.debug(`Mercs: ${A}`);
      let g = i.mercs2ViewpointAsync(A);
      const c = i.mapID;
      this.mercBuffer.buffer[c] && (this.logger.debug("To: Use buffer"), g = new Promise((u, C) => {
        u(this.mercBuffer.buffer[c]);
      })), g.then((u) => {
        this.logger.debug(
          `To: Center: ${u[0]} Zoom: ${u[1]} Rotation: ${u[2]}`
        ), this.logger.debug(`To: ${i.mapID}`), this.mercBuffer.buffer[i.mapID] = Fs(u, 10), r(u);
      }).catch((u) => {
        if (s) s(u);
        else throw u;
      });
    }).catch((A) => {
      if (s) s(A);
      else throw A;
    });
  }
  remove() {
    typeof document < "u" && document.removeEventListener("visibilitychange", this.__visibilityHandler), this.__resizeObserver && (this.__resizeObserver.disconnect(), this.__resizeObserver = null), this.__viewportOffset?.dispose(), this.__viewportOffset = void 0, this.__attribution?.dispose(), this.__attribution = void 0, this.mapObject?.setTarget?.(void 0), this.backMap?.setTarget?.(void 0), this.maplibreMap?.remove?.(), this.mapboxMap && this.mapboxMap.remove(), this.mapDivDocument.innerHTML = "", this.mapDivDocument.classList.remove("maplat");
  }
}
const Fd = [
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
  const t = yi.prototype;
  for (const n of Fd) {
    const i = Object.getOwnPropertyDescriptor(t, n);
    if (!i?.get) throw new Error(`MaplatApp: missing getter for startup field "${n}"`);
    const r = `__${n}`;
    Object.defineProperty(t, n, {
      configurable: !0,
      enumerable: !1,
      get: i.get,
      set(s) {
        if (!this.__startupLocked) {
          this[r] = s;
          return;
        }
        this.__startupWarner || (this.__startupWarner = zA()), this.__startupWarner(
          n,
          `MaplatApp: "${n}" is fixed at startup and cannot be changed after construction; the assignment was ignored.`
        );
      }
    });
  }
})();
yi.createObject = function(e) {
  return new Promise((t) => {
    const n = new yi(e);
    n.waitReady.then(() => {
      t(n);
    });
  });
};
if (typeof window < "u") {
  const e = {
    createObject: yi.createObject
  };
  window.Maplat = e, window.MaplatApp = yi, window.assets = mi;
}
export {
  zt as CustomEvent,
  Dd as GPSErrorEvent,
  Bd as GPSRequestEvent,
  si as GPSResultEvent,
  Fd as MAPLAT_APP_STARTUP_FIELDS,
  yi as MaplatApp,
  Ze as MaplatMap,
  mi as assets,
  Vd as buildSlideAttrs,
  Qn as createElement,
  Od as defaultPinIcon,
  id as escapeAttr,
  Tf as mapSourceFactory,
  Wd as mercToLngLat,
  _c as sanitizeHtml,
  sd as toPlainText
};
//# sourceMappingURL=maplat_core.js.map
