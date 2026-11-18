import { transform as ne, toLonLat as br, Projection as Uc, addProjection as Ss, addCoordinateTransforms as ar, getTransform as Hr, identityTransform as Qr } from "ol/proj";
import { View as jA, Map as Zc, Feature as GA } from "ol";
import { Vector as Nn, Group as Wc, Tile as Kr } from "ol/layer";
import { XYZ as zA, Google as Vc, Vector as Fn } from "ol/source";
import { Style as Ee, Stroke as Rs, Fill as ks, Icon as Xi } from "ol/style";
class Me {
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
let Xt = class extends Me {
  detail;
  constructor(t, e) {
    super(t), this.detail = e;
  }
};
const Yc = ["ALL", "OFF"], ii = {
  ALL: -99,
  DEBUG: -1,
  INFO: 0,
  WARN: 1,
  ERROR: 2,
  OFF: 99
};
class ta {
  constructor(t = ii.INFO) {
    this.level = t, this.make();
  }
  level;
  make() {
    const t = Object.keys(ii).filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (e) => !Yc.includes(e)
    );
    for (const e of t) {
      const n = ii[e], r = e.toLowerCase();
      this[r] = this.level <= n ? console.log : () => {
      };
    }
  }
}
function Hc(i, t) {
  return i.isMapbox() ? t.mapboxMap ? (i.mapboxMap = t.mapboxMap, !0) : (t.warn?.(
    "Mapbox GL JS is not available; skipping Mapbox source:",
    i.mapID
  ), !1) : typeof i.isMapLibre == "function" && i.isMapLibre() ? t.maplibreMap ? (i.maplibreMap = t.maplibreMap, !0) : (t.warn?.(
    "MapLibre GL JS is not available; skipping MapLibre source:",
    i.mapID
  ), !1) : !0;
}
const Cn = [
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
], Qc = [
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
function XA() {
  const i = /* @__PURE__ */ new Set();
  return (t, e) => {
    i.has(t) || (i.add(t), console.warn(e));
  };
}
let ea = !1;
const Kc = "MaplatApp: the MaplatApp class is deprecated and will be removed in 2.0. Use the <maplat-app> element (@maplat/core/element) instead.";
function Jc() {
  ea || (ea = !0, console.warn(Kc));
}
function rn(i) {
  const t = document, e = t.createDocumentFragment(), n = [];
  i = i.replace(/(<\/?)d([ >])/g, "$1div$2").replace(/(<\/?)s([ >])/g, "$1span$2").replace(/ din="/g, ' data-i18n="').replace(/ dinh="/g, ' data-i18n-html="').replace(/ c="/g, ' class="');
  const r = e.appendChild(t.createElement("div"));
  r.innerHTML = i;
  for (let s = 0; s < r.childNodes.length; s++) {
    const o = r.childNodes[s];
    if (o.nodeName && o.nodeName.toLowerCase() === "script") {
      const a = t.createElement("script");
      o.type && (a.type = o.type), o.src ? a.src = o.src : a.text = o.text, n[s] = a;
    } else
      n[s] = o;
  }
  return n;
}
function jn(i) {
  for (; !(i <= 180 && i > -180); ) {
    const t = i > 0 ? -1 : 1;
    i = i + t * 360;
  }
  return i;
}
function ia(i) {
  if (!i) return;
  const t = {
    mapID: i.mapID
  };
  for (let e = 0; e < Cn.length; e++) {
    const n = Cn[e];
    i[n] && (t[n] = i[n]);
  }
  return t;
}
function xe(i) {
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
function qc(i, t, e) {
  let n, r;
  e = e || to;
  let s = 0, o = i.length, a = !1;
  for (; s < o; )
    n = s + (o - s >> 1), r = +e(i[n], t), r < 0 ? s = n + 1 : (o = n, a = !r);
  return a ? s : ~s;
}
function to(i, t) {
  return i > t ? 1 : i < t ? -1 : 0;
}
function eo(i, t, e) {
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
function ZA(i, t) {
  const e = Array.isArray(t) ? t : [t], n = e.length;
  for (let r = 0; r < n; r++)
    i[i.length] = e[r];
}
function $c(i, t) {
  const e = i.length;
  if (e !== t.length)
    return !1;
  for (let n = 0; n < e; n++)
    if (i[n] !== t[n])
      return !1;
  return !0;
}
function tl(i, t, e) {
  const n = t || to;
  return i.every(function(r, s) {
    if (s === 0)
      return !0;
    const o = n(i[s - 1], r);
    return !(o > 0 || o === 0);
  });
}
function Nt() {
  throw new Error("Unimplemented abstract method.");
}
let el = 0;
function Ai(i) {
  const t = (
    /** @type {{ol_uid: (string|undefined)}} */
    /** @type {unknown} */
    i
  );
  return t.ol_uid || (t.ol_uid = String(++el));
}
function il() {
  return !0;
}
function Er() {
  return !1;
}
function Ps() {
}
function nl(i) {
  let t, e, n;
  return function() {
    const r = Array.prototype.slice.call(arguments);
    return (!e || this !== n || !$c(r, e)) && (n = this, e = r, t = i.apply(this, r)), t;
  };
}
function WA(i) {
  for (const t in i)
    delete i[t];
}
function rl(i) {
  let t;
  for (t in i)
    return !1;
  return !t;
}
class io extends UA {
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
    const s = e ? new Me(t) : (
      /** @type {Event} */
      t
    );
    s.target || (s.target = this.eventTarget_ || this);
    const o = this.dispatching_ || (this.dispatching_ = {}), a = this.pendingRemovals_ || (this.pendingRemovals_ = {});
    n in o || (o[n] = 0, a[n] = 0), ++o[n];
    let A;
    for (let g = 0, c = r.length; g < c; ++g)
      if ("handleEvent" in r[g] ? A = /** @type {import("../events.js").ListenerObject} */
      r[g].handleEvent(s) : A = /** @type {import("../events.js").ListenerFunction} */
      r[g].call(this, s), A === !1 || s.propagationStopped) {
        A = !1;
        break;
      }
    if (--o[n] === 0) {
      let g = a[n];
      for (delete a[n]; g--; )
        this.removeEventListener(n, Ps);
      delete o[n];
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
  removeEventListener(t, e) {
    if (!this.listeners_)
      return;
    const n = this.listeners_[t];
    if (!n)
      return;
    const r = n.indexOf(e);
    r !== -1 && (this.pendingRemovals_ && t in this.pendingRemovals_ ? (n[r] = Ps, ++this.pendingRemovals_[t]) : (n.splice(r, 1), n.length === 0 && delete this.listeners_[t]));
  }
}
jA.prototype.getDecimalZoom = function() {
  const i = this.getResolution(), t = (
    // NOTE: `resolution` maybe `undefined`
    // NOTE: `offset` maybe `NaN`
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Math.log(this.maxResolution_ / i) / Math.log(2)
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
function na(i) {
  const t = Hi();
  for (let e = 0, n = i.length; e < n; ++e)
    ir(t, i[e]);
  return t;
}
function sl(i, t, e) {
  const n = Math.min.apply(null, i), r = Math.min.apply(null, t), s = Math.max.apply(null, i), o = Math.max.apply(null, t);
  return ui(n, r, s, o, e);
}
function no(i, t, e) {
  let n, r;
  return t < i[0] ? n = i[0] - t : i[2] < t ? n = t - i[2] : n = 0, e < i[1] ? r = i[1] - e : i[3] < e ? r = e - i[3] : r = 0, n * n + r * r;
}
function VA(i, t) {
  return YA(i, t[0], t[1]);
}
function YA(i, t, e) {
  return i[0] <= t && t <= i[2] && i[1] <= e && e <= i[3];
}
function ra(i, t) {
  const e = i[0], n = i[1], r = i[2], s = i[3], o = t[0], a = t[1];
  let A = Ft.UNKNOWN;
  return o < e ? A = A | Ft.LEFT : o > r && (A = A | Ft.RIGHT), a < n ? A = A | Ft.BELOW : a > s && (A = A | Ft.ABOVE), A === Ft.UNKNOWN && (A = Ft.INTERSECTING), A;
}
function Hi() {
  return [1 / 0, 1 / 0, -1 / 0, -1 / 0];
}
function ui(i, t, e, n, r) {
  return r ? (r[0] = i, r[1] = t, r[2] = e, r[3] = n, r) : [i, t, e, n];
}
function xr(i) {
  return ui(1 / 0, 1 / 0, -1 / 0, -1 / 0, i);
}
function ol(i, t) {
  const e = i[0], n = i[1];
  return ui(e, n, e, n, t);
}
function al(i, t, e, n, r) {
  const s = xr(r);
  return HA(s, i, t, e, n);
}
function Al(i, t) {
  return t[0] < i[0] && (i[0] = t[0]), t[2] > i[2] && (i[2] = t[2]), t[1] < i[1] && (i[1] = t[1]), t[3] > i[3] && (i[3] = t[3]), i;
}
function ir(i, t) {
  t[0] < i[0] && (i[0] = t[0]), t[0] > i[2] && (i[2] = t[0]), t[1] < i[1] && (i[1] = t[1]), t[1] > i[3] && (i[3] = t[1]);
}
function HA(i, t, e, n, r) {
  for (; e < n; e += r)
    gl(i, t[e], t[e + 1]);
  return i;
}
function gl(i, t, e) {
  i[0] = Math.min(i[0], t), i[1] = Math.min(i[1], e), i[2] = Math.max(i[2], t), i[3] = Math.max(i[3], e);
}
function ro(i, t) {
  let e;
  return e = t(so(i)), e || (e = t(oo(i)), e) || (e = t(ao(i)), e) || (e = t(bn(i)), e) ? e : !1;
}
function Os(i) {
  let t = 0;
  return Tr(i) || (t = _t(i) * pe(i)), t;
}
function so(i) {
  return [i[0], i[1]];
}
function oo(i) {
  return [i[2], i[1]];
}
function Ui(i) {
  return [(i[0] + i[2]) / 2, (i[1] + i[3]) / 2];
}
function cl(i, t) {
  let e;
  if (t === "bottom-left")
    e = so(i);
  else if (t === "bottom-right")
    e = oo(i);
  else if (t === "top-left")
    e = bn(i);
  else if (t === "top-right")
    e = ao(i);
  else
    throw new Error("Invalid corner");
  return e;
}
function ll(i, t, e, n, r) {
  const [s, o, a, A, g, c, u, C] = ul(
    i,
    t,
    e,
    n
  );
  return ui(
    Math.min(s, a, g, u),
    Math.min(o, A, c, C),
    Math.max(s, a, g, u),
    Math.max(o, A, c, C),
    r
  );
}
function ul(i, t, e, n) {
  const r = t * n[0] / 2, s = t * n[1] / 2, o = Math.cos(e), a = Math.sin(e), A = r * o, g = r * a, c = s * o, u = s * a, C = i[0], p = i[1];
  return [
    C - A + u,
    p - g - c,
    C - A - u,
    p - g + c,
    C + A - u,
    p + g + c,
    C + A + u,
    p + g - c,
    C - A + u,
    p - g - c
  ];
}
function pe(i) {
  return i[3] - i[1];
}
function Jr(i, t, e) {
  const n = Hi();
  return Qi(i, t) ? (i[0] > t[0] ? n[0] = i[0] : n[0] = t[0], i[1] > t[1] ? n[1] = i[1] : n[1] = t[1], i[2] < t[2] ? n[2] = i[2] : n[2] = t[2], i[3] < t[3] ? n[3] = i[3] : n[3] = t[3]) : xr(n), n;
}
function bn(i) {
  return [i[0], i[3]];
}
function ao(i) {
  return [i[2], i[3]];
}
function _t(i) {
  return i[2] - i[0];
}
function Qi(i, t) {
  return i[0] <= t[2] && i[2] >= t[0] && i[1] <= t[3] && i[3] >= t[1];
}
function Tr(i) {
  return i[2] < i[0] || i[3] < i[1];
}
function hl(i, t) {
  return t ? (t[0] = i[0], t[1] = i[1], t[2] = i[2], t[3] = i[3], t) : i;
}
function Il(i, t, e) {
  let n = !1;
  const r = ra(i, t), s = ra(i, e);
  if (r === Ft.INTERSECTING || s === Ft.INTERSECTING)
    n = !0;
  else {
    const o = i[0], a = i[1], A = i[2], g = i[3], c = t[0], u = t[1], C = e[0], p = e[1], m = (p - u) / (C - c);
    let l, h;
    s & Ft.ABOVE && !(r & Ft.ABOVE) && (l = C - (p - g) / m, n = l >= o && l <= A), !n && s & Ft.RIGHT && !(r & Ft.RIGHT) && (h = p - (C - A) * m, n = h >= a && h <= g), !n && s & Ft.BELOW && !(r & Ft.BELOW) && (l = C - (p - a) / m, n = l >= o && l <= A), !n && s & Ft.LEFT && !(r & Ft.LEFT) && (h = p - (C - o) * m, n = h >= a && h <= g);
  }
  return n;
}
function Cl(i, t, e, n) {
  if (Tr(i))
    return xr(e);
  let r = [];
  r = [
    i[0],
    i[1],
    i[2],
    i[1],
    i[2],
    i[3],
    i[0],
    i[3]
  ], t(r, r, 2);
  const s = [], o = [];
  for (let a = 0, A = r.length; a < A; a += 2)
    s.push(r[a]), o.push(r[a + 1]);
  return sl(s, o, e);
}
function fl(i, t) {
  const e = t.getExtent(), n = Ui(i);
  if (t.canWrapX() && (n[0] < e[0] || n[0] >= e[2])) {
    const r = _t(e), o = Math.floor(
      (n[0] - e[0]) / r
    ) * r;
    i[0] -= o, i[2] -= o;
  }
  return i;
}
function dl(i, t, e) {
  if (t.canWrapX()) {
    const n = t.getExtent();
    if (!isFinite(i[0]) || !isFinite(i[2]))
      return [[n[0], i[1], n[2], i[3]]];
    fl(i, t);
    const r = _t(n);
    if (_t(i) > r, i[0] < n[0])
      return [
        [i[0] + r, i[1], n[2], i[3]],
        [n[0], i[1], i[2], i[3]]
      ];
    if (i[2] > n[2])
      return [
        [i[0], i[1], n[2], i[3]],
        [n[0], i[1], i[2] - r, i[3]]
      ];
  }
  return [i];
}
const pl = {
  /**
   * Triggered when a property is changed.
   * @event module:ol/Object.ObjectEvent#propertychange
   * @api
   */
  PROPERTYCHANGE: "propertychange"
};
function ai(i, t, e, n, r) {
  if (r) {
    const o = e;
    e = function(a) {
      return i.removeEventListener(t, e), o.call(n ?? this, a);
    };
  } else n && n !== i && (e = e.bind(n));
  const s = {
    target: i,
    type: t,
    listener: e
  };
  return i.addEventListener(t, e), s;
}
function Ar(i, t, e, n) {
  return ai(i, t, e, n, !0);
}
function Qe(i) {
  i && i.target && (i.target.removeEventListener(i.type, i.listener), WA(i));
}
const Ae = {
  /**
   * Generic change event. Triggered when the revision counter is increased.
   * @event module:ol/events/Event~BaseEvent#change
   * @api
   */
  CHANGE: "change",
  /**
   * Generic error event. Triggered when an error occurs.
   * @event module:ol/events/Event~BaseEvent#error
   * @api
   */
  ERROR: "error",
  DBLCLICK: "dblclick",
  KEYDOWN: "keydown",
  KEYPRESS: "keypress",
  LOAD: "load",
  WHEEL: "wheel"
};
class Mr extends io {
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
    ++this.revision_, this.dispatchEvent(Ae.CHANGE);
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
        r[s] = ai(this, t[s], e);
      return r;
    }
    return ai(
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
        n[s] = Ar(this, t[s], e);
    } else
      n = Ar(
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
      ml(n);
    else if (Array.isArray(t))
      for (let r = 0, s = t.length; r < s; ++r)
        this.removeEventListener(t[r], e);
    else
      this.removeEventListener(t, e);
  }
}
Mr.prototype.on;
Mr.prototype.once;
Mr.prototype.un;
function ml(i) {
  if (Array.isArray(i))
    for (let t = 0, e = i.length; t < e; ++t)
      Qe(i[t]);
  else
    Qe(
      /** @type {import("./events.js").EventsKey} */
      i
    );
}
class sa extends Me {
  /**
   * @param {string} type The event type.
   * @param {string} key The property name.
   * @param {*} oldValue The old value for `key`.
   */
  constructor(t, e, n) {
    super(t), this.key = e, this.oldValue = n;
  }
}
class hi extends Mr {
  /**
   * @param {NoInfer<Properties>} [values] An object with key-value pairs.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, Ai(this), this.values_ = null, t !== void 0 && this.setProperties(t);
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
    n = `change:${t}`, this.hasListener(n) && this.dispatchEvent(new sa(n, t, e)), n = pl.PROPERTYCHANGE, this.hasListener(n) && this.dispatchEvent(new sa(n, t, e));
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
      delete this.values_[t], rl(this.values_) && (this.values_ = null), e || this.notify(t, n);
    }
  }
}
function yl(...i) {
  console.warn(...i);
}
function re(i, t, e) {
  return Math.min(Math.max(i, t), e);
}
function vl(i, t, e, n, r, s) {
  const o = r - e, a = s - n;
  if (o !== 0 || a !== 0) {
    const A = ((i - e) * o + (t - n) * a) / (o * o + a * a);
    A > 1 ? (e = r, n = s) : A > 0 && (e += o * A, n += a * A);
  }
  return Di(i, t, e, n);
}
function Di(i, t, e, n) {
  const r = e - i, s = n - t;
  return r * r + s * s;
}
function wl(i) {
  const t = i.length;
  for (let n = 0; n < t; n++) {
    let r = n, s = Math.abs(i[n][n]);
    for (let a = n + 1; a < t; a++) {
      const A = Math.abs(i[a][n]);
      A > s && (s = A, r = a);
    }
    if (s === 0)
      return null;
    const o = i[r];
    i[r] = i[n], i[n] = o;
    for (let a = n + 1; a < t; a++) {
      const A = -i[a][n] / i[n][n];
      for (let g = n; g < t + 1; g++)
        n == g ? i[a][g] = 0 : i[a][g] += A * i[n][g];
    }
  }
  const e = new Array(t);
  for (let n = t - 1; n >= 0; n--) {
    e[n] = i[n][t] / i[n][n];
    for (let r = n - 1; r >= 0; r--)
      i[r][t] -= i[r][n] * e[n];
  }
  return e;
}
function oa(i) {
  return i * 180 / Math.PI;
}
function De(i) {
  return i * Math.PI / 180;
}
function Bi(i, t) {
  const e = i % t;
  return e * t < 0 ? e + t : e;
}
function Ao(i, t, e) {
  return i + e * (t - i);
}
function QA(i, t) {
  const e = Math.pow(10, t);
  return Math.round(i * e) / e;
}
function Gn(i, t) {
  return Math.floor(QA(i, t));
}
function zn(i, t) {
  return Math.ceil(QA(i, t));
}
function Ls(i, t, e) {
  if (i >= t && i < e)
    return i;
  const n = e - t;
  return ((i - t) % n + n) % n + t;
}
function bl(i, t) {
  return i[0] += +t[0], i[1] += +t[1], i;
}
function gr(i, t) {
  let e = !0;
  for (let n = i.length - 1; n >= 0; --n)
    if (i[n] != t[n]) {
      e = !1;
      break;
    }
  return e;
}
function go(i, t) {
  const e = Math.cos(t), n = Math.sin(t), r = i[0] * e - i[1] * n, s = i[1] * e + i[0] * n;
  return i[0] = r, i[1] = s, i;
}
function El(i, t) {
  return i[0] *= t, i[1] *= t, i;
}
const co = {
  // use the radius of the Normal sphere
  radians: 6370997 / (2 * Math.PI),
  degrees: 2 * Math.PI * 6370997 / 360,
  ft: 0.3048,
  m: 1,
  "us-ft": 1200 / 3937
};
class fn {
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
    return this.metersPerUnit_ || co[this.units_];
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
const En = 6378137, Oi = Math.PI * En, xl = [-Oi, -Oi, Oi, Oi], Tl = [-180, -85, 180, 85], Xn = En * Math.log(Math.tan(Math.PI / 2));
class vi extends fn {
  /**
   * @param {string} code Code.
   */
  constructor(t) {
    super({
      code: t,
      units: "m",
      extent: xl,
      global: !0,
      worldExtent: Tl,
      getPointResolution: function(e, n) {
        return e / Math.cosh(n[1] / En);
      }
    });
  }
}
const aa = [
  new vi("EPSG:3857"),
  new vi("EPSG:102100"),
  new vi("EPSG:102113"),
  new vi("EPSG:900913"),
  new vi("http://www.opengis.net/def/crs/EPSG/0/3857"),
  new vi("http://www.opengis.net/gml/srs/epsg.xml#3857")
];
function Ml(i, t, e, n) {
  const r = i.length;
  e = e !== void 0 && e > 1 ? e : 2, n = n ?? e, t === void 0 && (e > 2 ? t = i.slice() : t = new Array(r));
  for (let s = 0; s < r; s += n) {
    t[s] = Oi * i[s] / 180;
    let o = En * Math.log(Math.tan(Math.PI * (+i[s + 1] + 90) / 360));
    o > Xn ? o = Xn : o < -Xn && (o = -Xn), t[s + 1] = o;
  }
  return t;
}
function _l(i, t, e, n) {
  const r = i.length;
  e = e !== void 0 && e > 1 ? e : 2, n = n ?? e, t === void 0 && (e > 2 ? t = i.slice() : t = new Array(r));
  for (let s = 0; s < r; s += n)
    t[s] = 180 * i[s] / Oi, t[s + 1] = 360 * Math.atan(Math.exp(i[s + 1] / En)) / Math.PI - 90;
  return t;
}
const Sl = 6378137, Aa = [-180, -90, 180, 90], Rl = Math.PI * Sl / 180;
class Je extends fn {
  /**
   * @param {string} code Code.
   * @param {string} [axisOrientation] Axis orientation.
   */
  constructor(t, e) {
    super({
      code: t,
      units: "degrees",
      extent: Aa,
      axisOrientation: e,
      global: !0,
      metersPerUnit: Rl,
      worldExtent: Aa
    });
  }
}
const ga = [
  new Je("CRS:84"),
  new Je("EPSG:4326", "neu"),
  new Je("urn:ogc:def:crs:OGC:1.3:CRS84"),
  new Je("urn:ogc:def:crs:OGC:2:84"),
  new Je("http://www.opengis.net/def/crs/OGC/1.3/CRS84"),
  new Je("http://www.opengis.net/gml/srs/epsg.xml#4326", "neu"),
  new Je("http://www.opengis.net/def/crs/EPSG/0/4326", "neu")
];
let Ds = {};
function kl(i) {
  return Ds[i] || Ds[i.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/, "EPSG:$3")] || null;
}
function Pl(i, t) {
  Ds[i] = t;
}
let Ni = {};
function dn(i, t, e) {
  const n = i.getCode(), r = t.getCode();
  n in Ni || (Ni[n] = {}), Ni[n][r] = e;
}
function qr(i, t) {
  return i in Ni && t in Ni[i] ? Ni[i][t] : null;
}
const cr = 0.9996, Ie = 669438e-8, _r = Ie * Ie, Sr = _r * Ie, ni = Ie / (1 - Ie), ca = Math.sqrt(1 - Ie), Zi = (1 - ca) / (1 + ca), KA = Zi * Zi, lo = KA * Zi, uo = lo * Zi, JA = uo * Zi, qA = 1 - Ie / 4 - 3 * _r / 64 - 5 * Sr / 256, Ol = 3 * Ie / 8 + 3 * _r / 32 + 45 * Sr / 1024, Ll = 15 * _r / 256 + 45 * Sr / 1024, Dl = 35 * Sr / 3072, Bl = 3 / 2 * Zi - 27 / 32 * lo + 269 / 512 * JA, Nl = 21 / 16 * KA - 55 / 32 * uo, Fl = 151 / 96 * lo - 417 / 128 * JA, jl = 1097 / 512 * uo, lr = 6378137;
function Gl(i, t, e) {
  const n = i - 5e5, o = (e.north ? t : t - 1e7) / cr / (lr * qA), a = o + Bl * Math.sin(2 * o) + Nl * Math.sin(4 * o) + Fl * Math.sin(6 * o) + jl * Math.sin(8 * o), A = Math.sin(a), g = A * A, c = Math.cos(a), u = A / c, C = u * u, p = C * C, m = 1 - Ie * g, l = Math.sqrt(1 - Ie * g), h = lr / l, I = (1 - Ie) / m, d = ni * c ** 2, E = d * d, v = n / (h * cr), f = v * v, y = f * v, w = y * v, T = w * v, M = T * v, x = a - u / I * (f / 2 - w / 24 * (5 + 3 * C + 10 * d - 4 * E - 9 * ni)) + M / 720 * (61 + 90 * C + 298 * d + 45 * p - 252 * ni - 3 * E);
  let _ = (v - y / 6 * (1 + 2 * C + d) + T / 120 * (5 - 2 * d + 28 * C - 3 * E + 8 * ni + 24 * p)) / c;
  return _ = Ls(
    _ + De($A(e.number)),
    -Math.PI,
    Math.PI
  ), [oa(_), oa(x)];
}
const la = -80, ua = 84, zl = -180, Xl = 180;
function Ul(i, t, e) {
  i = Ls(i, zl, Xl), t < la ? t = la : t > ua && (t = ua);
  const n = De(t), r = Math.sin(n), s = Math.cos(n), o = r / s, a = o * o, A = a * a, g = De(i), c = $A(e.number), u = De(c), C = lr / Math.sqrt(1 - Ie * r ** 2), p = ni * s ** 2, m = s * Ls(g - u, -Math.PI, Math.PI), l = m * m, h = l * m, I = h * m, d = I * m, E = d * m, v = lr * (qA * n - Ol * Math.sin(2 * n) + Ll * Math.sin(4 * n) - Dl * Math.sin(6 * n)), f = cr * C * (m + h / 6 * (1 - a + p) + d / 120 * (5 - 18 * a + A + 72 * p - 58 * ni)) + 5e5;
  let y = cr * (v + C * o * (l / 2 + I / 24 * (5 - a + 9 * p + 4 * p ** 2) + E / 720 * (61 - 58 * a + A + 600 * p - 330 * ni)));
  return e.north || (y += 1e7), [f, y];
}
function $A(i) {
  return (i - 1) * 6 - 180 + 3;
}
const Zl = [
  /^EPSG:(\d+)$/,
  /^urn:ogc:def:crs:EPSG::(\d+)$/,
  /^http:\/\/www\.opengis\.net\/def\/crs\/EPSG\/0\/(\d+)$/
];
function tg(i) {
  let t = 0;
  for (const r of Zl) {
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
function ha(i, t) {
  return function(e, n, r, s) {
    const o = e.length;
    r = r !== void 0 && r > 1 ? r : 2, s = s ?? r, n || (r > 2 ? n = e.slice() : n = new Array(o));
    for (let a = 0; a < o; a += s) {
      const A = e[a], g = e[a + 1], c = i(A, g, t);
      n[a] = c[0], n[a + 1] = c[1];
    }
    return n;
  };
}
function Wl(i) {
  return tg(i) ? new fn({ code: i, units: "m" }) : null;
}
function Vl(i) {
  const t = tg(i.getCode());
  return t ? {
    forward: ha(Ul, t),
    inverse: ha(Gl, t)
  } : null;
}
const Yl = 63710088e-1;
function Ia(i, t, e) {
  e = e || Yl;
  const n = De(i[1]), r = De(t[1]), s = (r - n) / 2, o = De(t[0] - i[0]) / 2, a = Math.sin(s) * Math.sin(s) + Math.sin(o) * Math.sin(o) * Math.cos(n) * Math.cos(r);
  return 2 * e * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
const Hl = [Vl], Ql = [Wl];
let Bs = !0;
function Kl(i) {
  Bs = !1;
}
function ho(i, t) {
  if (t !== void 0) {
    for (let e = 0, n = i.length; e < n; ++e)
      t[e] = i[e];
    t = t;
  } else
    t = i.slice();
  return t;
}
function Ns(i) {
  Pl(i.getCode(), i), dn(i, i, ho);
}
function Jl(i) {
  i.forEach(Ns);
}
function qt(i) {
  if (typeof i != "string")
    return i !== void 0 ? i : null;
  const t = kl(i);
  if (t)
    return t;
  for (const e of Ql) {
    const n = e(i);
    if (n)
      return n;
  }
  return null;
}
function Ca(i, t, e, n) {
  const r = qt(i);
  if (!r)
    return t;
  let s;
  const o = r.getPointResolutionFunc();
  if (o)
    s = o(t, e);
  else {
    const a = r.getUnits();
    if (a == "degrees" && !n || n == "degrees")
      s = t;
    else {
      const A = Rr(
        r,
        qt("EPSG:4326")
      );
      if (!A && a !== "degrees")
        s = t * (r.getMetersPerUnit() ?? 1);
      else {
        let c = [
          e[0] - t / 2,
          e[1],
          e[0] + t / 2,
          e[1],
          e[0],
          e[1] - t / 2,
          e[0],
          e[1] + t / 2
        ];
        A && (c = A(c, c, 2));
        const u = Ia(c.slice(0, 2), c.slice(2, 4)), C = Ia(c.slice(4, 6), c.slice(6, 8));
        s = (u + C) / 2;
      }
      const g = r.getMetersPerUnit();
      g !== void 0 && (s /= g);
    }
  }
  return s;
}
function fa(i) {
  Jl(i), i.forEach(function(t) {
    i.forEach(function(e) {
      t !== e && dn(t, e, ho);
    });
  });
}
function ql(i, t, e, n) {
  i.forEach(function(r) {
    t.forEach(function(s) {
      dn(r, s, e), dn(s, r, n);
    });
  });
}
function Io(i, t) {
  return i ? typeof i == "string" ? qt(i) : (
    /** @type {Projection} */
    i
  ) : qt(t);
}
function $l(i) {
  return (
    /**
     * @param {Array<number>} input Input.
     * @param {Array<number>} [output] Output.
     * @param {number} [dimension] Dimensions that should be transformed.
     * @param {number} [stride] Stride.
     * @return {Array<number>} Output.
     */
    (function(t, e, n, r) {
      const s = t.length;
      n = n !== void 0 ? n : 2, r = r ?? n, e = e !== void 0 ? e : new Array(s);
      for (let o = 0; o < s; o += r) {
        const a = i(t.slice(o, o + n)), A = a.length;
        for (let g = 0, c = r; g < c; ++g)
          e[o + g] = g >= A ? t[o + g] : a[g];
      }
      return e;
    })
  );
}
function $r(i, t) {
  if (i === t)
    return !0;
  const e = i.getUnits() === t.getUnits();
  return (i.getCode() === t.getCode() || Rr(i, t) === ho) && e;
}
function Rr(i, t) {
  if (!i || !t)
    return null;
  const e = i.getCode(), n = t.getCode();
  let r = qr(e, n);
  if (r)
    return r;
  let s = null, o = null;
  for (const A of Hl)
    s || (s = A(i)), o || (o = A(t));
  if (!s && !o)
    return null;
  const a = "EPSG:4326";
  if (!o && s) {
    const A = qr(a, n);
    A && (r = ts(
      s.inverse,
      A
    ));
  } else if (!s && o) {
    const A = qr(e, a);
    A && (r = ts(
      A,
      o.forward
    ));
  } else s && o && (r = ts(
    s.inverse,
    o.forward
  ));
  return r && (Ns(i), Ns(t), dn(i, t, r)), r;
}
function ts(i, t) {
  return function(e, n, r, s) {
    return n = i(e, n, r, s), t(n, n, r, s);
  };
}
function ur(i, t) {
  const e = qt(i), n = qt(t);
  return Rr(e, n);
}
function eg(i, t, e) {
  const n = ur(t, e);
  if (!n) {
    const r = qt(t)?.getCode() ?? String(t), s = qt(e)?.getCode() ?? String(e);
    throw new Error(
      `No transform available between ${r} and ${s}`
    );
  }
  return n(i, void 0, i.length);
}
let tu = null;
function eu() {
  return tu;
}
function da(i, t) {
  return i;
}
function Xe(i, t) {
  return Bs && !gr(i, [0, 0]) && i[0] >= -180 && i[0] <= 180 && i[1] >= -90 && i[1] <= 90 && (Bs = !1, yl(
    "Call useGeographic() from ol/proj once to work with [longitude, latitude] coordinates."
  )), i;
}
function iu(i, t) {
  return i;
}
function Un(i, t) {
  return i;
}
function nu() {
  fa(aa), fa(ga), ql(
    ga,
    aa,
    Ml,
    _l
  );
}
nu();
function ae(i, t) {
  if (!i)
    throw new Error(t);
}
const ru = [1, 0, 0, 1, 0, 0];
new Array(6);
function su() {
  return ru.slice(0);
}
function ou(i, t) {
  const e = t[0], n = t[1];
  return t[0] = i[0] * e + i[2] * n + i[4], t[1] = i[1] * e + i[3] * n + i[5], t;
}
function au(i, t, e, n, r, s, o, a) {
  const A = Math.sin(s), g = Math.cos(s);
  return i[0] = n * g, i[1] = r * A, i[2] = -n * A, i[3] = r * g, i[4] = o * n * g - a * n * A + t, i[5] = o * r * A + a * r * g + e, i;
}
function Au(i, t, e, n, r, s, o) {
  s = s || [], o = o || 2;
  let a = 0;
  for (let A = t; A < e; A += n) {
    const g = i[A], c = i[A + 1];
    s[a++] = r[0] * g + r[2] * c + r[4], s[a++] = r[1] * g + r[3] * c + r[5];
    for (let u = 2; u < o; u++)
      s[a++] = i[A + u];
  }
  return s && s.length != a && (s.length = a), s;
}
function ig(i, t, e, n, r, s, o) {
  o = o || [];
  const a = Math.cos(r), A = Math.sin(r), g = s[0], c = s[1];
  let u = 0;
  for (let C = t; C < e; C += n) {
    const p = i[C] - g, m = i[C + 1] - c;
    o[u++] = g + p * a - m * A, o[u++] = c + p * A + m * a;
    for (let l = C + 2; l < C + n; ++l)
      o[u++] = i[l];
  }
  return o && o.length != u && (o.length = u), o;
}
function gu(i, t, e, n, r, s, o, a) {
  a = a || [];
  const A = o[0], g = o[1];
  let c = 0;
  for (let u = t; u < e; u += n) {
    const C = i[u] - A, p = i[u + 1] - g;
    a[c++] = A + r * C, a[c++] = g + s * p;
    for (let m = u + 2; m < u + n; ++m)
      a[c++] = i[m];
  }
  return a && a.length != c && (a.length = c), a;
}
function cu(i, t, e, n, r, s, o) {
  o = o || [];
  let a = 0;
  for (let A = t; A < e; A += n) {
    o[a++] = i[A] + r, o[a++] = i[A + 1] + s;
    for (let g = A + 2; g < A + n; ++g)
      o[a++] = i[g];
  }
  return o && o.length != a && (o.length = a), o;
}
const pa = su(), lu = [NaN, NaN];
class uu extends hi {
  constructor() {
    super(), this.extent_ = Hi(), this.extentRevision_ = -1, this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = 0, this.simplifyTransformedInternal = nl(
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
    return Nt();
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
    return Nt();
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   */
  containsXY(t, e) {
    return this.closestPointXY(t, e, lu, Number.MIN_VALUE) === 0;
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
    return Nt();
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
      (isNaN(e[0]) || isNaN(e[1])) && xr(e), this.extentRevision_ = this.getRevision();
    }
    return hl(this.extent_, t);
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
    Nt();
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
    Nt();
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
    return Nt();
  }
  /**
   * Get the type of this geometry.
   * @abstract
   * @return {Type} Geometry type.
   */
  getType() {
    return Nt();
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
    Nt();
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   */
  intersectsExtent(t) {
    return Nt();
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
    Nt();
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
    const n = qt(t);
    if (!n)
      return this;
    const r = n.getUnits() == "tile-pixels" ? (
      /**
       * @param {Array<number>} inCoordinates Input coordinates.
       * @param {Array<number>} outCoordinates Output coordinates.
       * @param {number} stride Stride.
       * @return {Array<number>} Output coordinates.
       */
      function(s, o, a) {
        const A = n.getExtent(), g = n.getWorldExtent(), c = pe(g) / pe(A);
        au(
          pa,
          g[0],
          g[3],
          c,
          -c,
          0,
          0,
          0
        );
        const u = Au(
          s,
          0,
          s.length,
          a,
          pa,
          o
        ), C = ur(n, e);
        return C ? C(u, u, a) : u;
      }
    ) : ur(n, e);
    return r && this.applyTransform(
      /** @type {import("../proj.js").TransformFunction} */
      r
    ), this;
  }
}
class xn extends uu {
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
    return al(
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
    return Nt();
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
    this.stride = ma(t), this.layout = t, this.flatCoordinates = e;
  }
  /**
   * @abstract
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  setCoordinates(t, e) {
    Nt();
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
      r = ma(t);
    else {
      for (let s = 0; s < n; ++s) {
        if (e.length === 0) {
          this.layout = "XY", this.stride = 2;
          return;
        }
        e = /** @type {Array<unknown>} */
        e[0];
      }
      r = e.length, t = hu(r);
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
      ig(
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
    e === void 0 && (e = t), n || (n = Ui(this.getExtent()));
    const r = this.getFlatCoordinates();
    if (r) {
      const s = this.getStride();
      gu(
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
      cu(
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
function hu(i) {
  let t;
  return i == 2 ? t = "XY" : i == 3 ? t = "XYZ" : i == 4 && (t = "XYZM"), /** @type {import("./Geometry.js").GeometryLayout} */
  t;
}
function ma(i) {
  let t;
  return i == "XY" ? t = 2 : i == "XYZ" || i == "XYM" ? t = 3 : i == "XYZM" && (t = 4), /** @type {number} */
  t;
}
function ng(i, t, e, n) {
  for (let r = 0; r < n; ++r)
    i[t++] = e[r];
  return t;
}
function Co(i, t, e, n) {
  for (let r = 0, s = e.length; r < s; ++r) {
    const o = e[r];
    for (let a = 0; a < n; ++a)
      i[t++] = o[a];
  }
  return t;
}
function Iu(i, t, e, n, r) {
  r = r || [];
  let s = 0;
  for (let o = 0, a = e.length; o < a; ++o) {
    const A = Co(
      i,
      t,
      e[o],
      n
    );
    r[s++] = A, t = A;
  }
  return r.length = s, r;
}
class fo extends xn {
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
    const t = new fo(
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
    const s = this.flatCoordinates, o = t - s[0], a = e - s[1], A = o * o + a * a;
    if (A < r) {
      if (A === 0)
        for (let g = 0; g < this.stride; ++g)
          n[g] = s[g];
      else {
        const g = this.getRadius() / Math.sqrt(A);
        n[0] = s[0] + g * o, n[1] = s[1] + g * a;
        for (let c = 2; c < this.stride; ++c)
          n[c] = s[c];
      }
      return n.length = this.stride, A;
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
    return ui(
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
    if (Qi(t, e)) {
      const n = this.getCenter();
      return t[0] <= n[0] && t[2] >= n[0] || t[1] <= n[1] && t[3] >= n[1] ? !0 : ro(t, this.intersectsCoordinate.bind(this));
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
    let s = ng(r, 0, t, this.stride);
    r[s++] = r[0] + e;
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
      ig(n, 0, n.length, r, t, e, n)
    ), this.changed();
  }
}
function rg(i, t, e, n) {
  let r = 0;
  const s = i[e - n], o = i[e - n + 1];
  let a = 0, A = 0;
  for (; t < e; t += n) {
    const g = i[t] - s, c = i[t + 1] - o;
    r += A * g - a * c, a = g, A = c;
  }
  return r / 2;
}
function Cu(i, t, e, n) {
  let r = 0;
  for (let s = 0, o = e.length; s < o; ++s) {
    const a = e[s];
    r += rg(i, t, a, n), t = a;
  }
  return r;
}
function ya(i, t, e, n, r, s, o) {
  const a = i[t], A = i[t + 1], g = i[e] - a, c = i[e + 1] - A;
  let u;
  if (g === 0 && c === 0)
    u = t;
  else {
    const C = ((r - a) * g + (s - A) * c) / (g * g + c * c);
    if (C > 1)
      u = e;
    else if (C > 0) {
      for (let p = 0; p < n; ++p)
        o[p] = Ao(
          i[t + p],
          i[e + p],
          C
        );
      o.length = n;
      return;
    } else
      u = t;
  }
  for (let C = 0; C < n; ++C)
    o[C] = i[u + C];
  o.length = n;
}
function po(i, t, e, n, r) {
  let s = i[t], o = i[t + 1];
  for (t += n; t < e; t += n) {
    const a = i[t], A = i[t + 1], g = Di(s, o, a, A);
    g > r && (r = g), s = a, o = A;
  }
  return r;
}
function fu(i, t, e, n, r) {
  for (let s = 0, o = e.length; s < o; ++s) {
    const a = e[s];
    r = po(i, t, a, n, r), t = a;
  }
  return r;
}
function mo(i, t, e, n, r, s, o, a, A, g, c) {
  if (t == e)
    return g;
  let u, C;
  if (r === 0) {
    if (C = Di(
      o,
      a,
      i[t],
      i[t + 1]
    ), C < g) {
      for (u = 0; u < n; ++u)
        A[u] = i[t + u];
      return A.length = n, C;
    }
    return g;
  }
  c = c || [NaN, NaN];
  let p = t + n;
  for (; p < e; )
    if (ya(
      i,
      p - n,
      p,
      n,
      o,
      a,
      c
    ), C = Di(o, a, c[0], c[1]), C < g) {
      for (g = C, u = 0; u < n; ++u)
        A[u] = c[u];
      A.length = n, p += n;
    } else
      p += n * Math.max(
        (Math.sqrt(C) - Math.sqrt(g)) / r | 0,
        1
      );
  if (s && (ya(
    i,
    e - n,
    t,
    n,
    o,
    a,
    c
  ), C = Di(o, a, c[0], c[1]), C < g)) {
    for (g = C, u = 0; u < n; ++u)
      A[u] = c[u];
    A.length = n;
  }
  return g;
}
function du(i, t, e, n, r, s, o, a, A, g, c) {
  c = c || [NaN, NaN];
  for (let u = 0, C = e.length; u < C; ++u) {
    const p = e[u];
    g = mo(
      i,
      t,
      p,
      n,
      r,
      s,
      o,
      a,
      A,
      g,
      c
    ), t = p;
  }
  return g;
}
function yo(i, t, e, n, r) {
  r = r !== void 0 ? r : [];
  let s = 0;
  for (let o = t; o < e; o += n)
    r[s++] = i.slice(o, o + n);
  return r.length = s, r;
}
function pu(i, t, e, n, r) {
  r = r !== void 0 ? r : [];
  let s = 0;
  for (let o = 0, a = e.length; o < a; ++o) {
    const A = e[o];
    r[s++] = yo(
      i,
      t,
      A,
      n,
      r[s]
    ), t = A;
  }
  return r.length = s, r;
}
function mu(i, t, e, n, r) {
  return !ro(
    r,
    /**
     * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
     * @return {boolean} Contains (x, y).
     */
    function(o) {
      return !ri(
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
function ri(i, t, e, n, r, s) {
  let o = 0, a = i[e - n], A = i[e - n + 1];
  for (; t < e; t += n) {
    const g = i[t], c = i[t + 1];
    A <= s ? c > s && (g - a) * (s - A) - (r - a) * (c - A) > 0 && o++ : c <= s && (g - a) * (s - A) - (r - a) * (c - A) < 0 && o--, a = g, A = c;
  }
  return o !== 0;
}
function sg(i, t, e, n, r, s) {
  if (e.length === 0 || !ri(i, t, e[0], n, r, s))
    return !1;
  for (let o = 1, a = e.length; o < a; ++o)
    if (ri(i, e[o - 1], e[o], n, r, s))
      return !1;
  return !0;
}
function og(i, t, e, n, r) {
  let s;
  for (t += n; t < e; t += n)
    if (s = r(
      i.slice(t - n, t),
      i.slice(t, t + n)
    ), s)
      return s;
  return !1;
}
function kr(i, t, e, n, r, s) {
  return s = s ?? HA(Hi(), i, t, e, n), Qi(r, s) ? s[0] >= r[0] && s[2] <= r[2] || s[1] >= r[1] && s[3] <= r[3] ? !0 : og(
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
    function(o, a) {
      return Il(r, o, a);
    }
  ) : !1;
}
function ag(i, t, e, n, r) {
  return !!(kr(i, t, e, n, r) || ri(
    i,
    t,
    e,
    n,
    r[0],
    r[1]
  ) || ri(
    i,
    t,
    e,
    n,
    r[0],
    r[3]
  ) || ri(
    i,
    t,
    e,
    n,
    r[2],
    r[1]
  ) || ri(
    i,
    t,
    e,
    n,
    r[2],
    r[3]
  ));
}
function yu(i, t, e, n, r) {
  if (!ag(i, t, e[0], n, r))
    return !1;
  if (e.length === 1)
    return !0;
  for (let s = 1, o = e.length; s < o; ++s)
    if (mu(
      i,
      e[s - 1],
      e[s],
      n,
      r
    ) && !kr(
      i,
      e[s - 1],
      e[s],
      n,
      r
    ))
      return !1;
  return !0;
}
function Ag(i, t, e, n, r, s, o) {
  const a = (e - t) / n;
  if (a < 3) {
    for (; t < e; t += n)
      s[o++] = i[t], s[o++] = i[t + 1];
    return o;
  }
  const A = new Array(a);
  A[0] = 1, A[a - 1] = 1;
  const g = [t, e - n];
  let c = 0;
  for (; g.length > 0; ) {
    const u = (
      /** @type {number} */
      g.pop()
    ), C = (
      /** @type {number} */
      g.pop()
    );
    let p = 0;
    const m = i[C], l = i[C + 1], h = i[u], I = i[u + 1];
    for (let d = C + n; d < u; d += n) {
      const E = i[d], v = i[d + 1], f = vl(E, v, m, l, h, I);
      f > p && (c = d, p = f);
    }
    p > r && (A[(c - t) / n] = 1, C + n < c && g.push(C, c), c + n < u && g.push(c, u));
  }
  for (let u = 0; u < a; ++u)
    A[u] && (s[o++] = i[t + u * n], s[o++] = i[t + u * n + 1]);
  return o;
}
function wi(i, t) {
  return t * Math.round(i / t);
}
function vu(i, t, e, n, r, s, o) {
  if (t == e)
    return o;
  let a = wi(i[t], r), A = wi(i[t + 1], r);
  t += n, s[o++] = a, s[o++] = A;
  let g, c;
  do
    if (g = wi(i[t], r), c = wi(i[t + 1], r), t += n, t == e)
      return s[o++] = g, s[o++] = c, o;
  while (g == a && c == A);
  for (; t < e; ) {
    const u = wi(i[t], r), C = wi(i[t + 1], r);
    if (t += n, u == g && C == c)
      continue;
    const p = g - a, m = c - A, l = u - a, h = C - A;
    if (p * h == m * l && (p < 0 && l < p || p == l || p > 0 && l > p) && (m < 0 && h < m || m == h || m > 0 && h > m)) {
      g = u, c = C;
      continue;
    }
    s[o++] = g, s[o++] = c, a = g, A = c, g = u, c = C;
  }
  return s[o++] = g, s[o++] = c, o;
}
function wu(i, t, e, n, r, s, o, a) {
  for (let A = 0, g = e.length; A < g; ++A) {
    const c = e[A];
    o = vu(
      i,
      t,
      c,
      n,
      r,
      s,
      o
    ), a.push(o), t = c;
  }
  return o;
}
class pn extends xn {
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
    return new pn(this.flatCoordinates.slice(), this.layout);
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
    return r < no(this.getExtent(), t, e) ? r : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      po(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), mo(
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
    return rg(
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
    return yo(
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
    return e.length = Ag(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      0
    ), new pn(e, "XY");
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
    return kr(
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
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = Co(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function bu(i, t, e, n, r, s, o) {
  let a, A;
  const g = (e - t) / n;
  if (g === 1)
    a = t;
  else if (g === 2)
    a = t, A = r;
  else if (g !== 0) {
    let c = i[t], u = i[t + 1], C = 0;
    const p = [0];
    for (let h = t + n; h < e; h += n) {
      const I = i[h], d = i[h + 1];
      C += Math.sqrt((I - c) * (I - c) + (d - u) * (d - u)), p.push(C), c = I, u = d;
    }
    const m = r * C, l = qc(p, m);
    l < 0 ? (A = (m - p[-l - 2]) / (p[-l - 1] - p[-l - 2]), a = t + (-l - 2) * n) : a = t + l * n;
  }
  o = o !== void 0 && o > 1 ? o : 2, s = s || new Array(o);
  for (let c = 0; c < o; ++c)
    s[c] = a === void 0 ? NaN : A === void 0 ? i[a + c] : Ao(i[a + c], i[a + n + c], A);
  return s;
}
function Eu(i, t, e, n, r, s) {
  if (e == t)
    return null;
  let o;
  if (r < i[t + n - 1])
    return s ? (o = i.slice(t, t + n), o[n - 1] = r, o) : null;
  if (i[e - 1] < r)
    return s ? (o = i.slice(e - n, e), o[n - 1] = r, o) : null;
  if (r == i[t + n - 1])
    return i.slice(t, t + n);
  let a = t / n, A = e / n;
  for (; a < A; ) {
    const C = a + A >> 1;
    r < i[(C + 1) * n - 1] ? A = C : a = C + 1;
  }
  const g = i[a * n - 1];
  if (r == g)
    return i.slice((a - 1) * n, (a - 1) * n + n);
  const c = i[(a + 1) * n - 1], u = (r - g) / (c - g);
  o = [];
  for (let C = 0; C < n - 1; ++C)
    o.push(
      Ao(
        i[(a - 1) * n + C],
        i[a * n + C],
        u
      )
    );
  return o.push(r), o;
}
function xu(i, t, e, n) {
  let r = i[t], s = i[t + 1], o = 0;
  for (let a = t + n; a < e; a += n) {
    const A = i[a], g = i[a + 1];
    o += Math.sqrt((A - r) * (A - r) + (g - s) * (g - s)), r = A, s = g;
  }
  return o;
}
class hr extends xn {
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
    ZA(this.flatCoordinates, t), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!LineString} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new hr(
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
    return r < no(this.getExtent(), t, e) ? r : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      po(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), mo(
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
    return og(
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
    return this.layout != "XYM" && this.layout != "XYZM" ? null : (e = e !== void 0 ? e : !1, Eu(
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
    return yo(
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
    return bu(
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
    return xu(
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
    return e.length = Ag(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      0
    ), new hr(e, "XY");
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
    return kr(
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
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = Co(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
class Wi extends xn {
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
    const t = new Wi(this.flatCoordinates.slice(), this.layout);
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
    const s = this.flatCoordinates, o = Di(
      t,
      e,
      s[0],
      s[1]
    );
    if (o < r) {
      const a = this.stride;
      for (let A = 0; A < a; ++A)
        n[A] = s[A];
      return n.length = a, o;
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
    return ol(this.flatCoordinates, t);
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
    return YA(t, this.flatCoordinates[0], this.flatCoordinates[1]);
  }
  /**
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 0), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = ng(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function Tu(i, t, e, n, r, s, o) {
  let a, A, g, c, u, C, p;
  const m = r[s + 1], l = [];
  for (let d = 0, E = e.length; d < E; ++d) {
    const v = e[d];
    for (c = i[v - n], C = i[v - n + 1], a = t; a < v; a += n)
      u = i[a], p = i[a + 1], (m <= C && p <= m || C <= m && m <= p) && (g = (m - C) / (p - C) * (u - c) + c, l.push(g)), c = u, C = p;
  }
  let h = NaN, I = -1 / 0;
  for (l.sort(to), c = l[0], a = 1, A = l.length; a < A; ++a) {
    u = l[a];
    const d = Math.abs(u - c);
    d > I && (g = (c + u) / 2, sg(i, t, e, n, g, m) && (h = g, I = d)), c = u;
  }
  return isNaN(h) && (h = r[s]), [h, m, I];
}
function Mu(i, t, e, n) {
  for (; t < e - n; ) {
    for (let r = 0; r < n; ++r) {
      const s = i[t + r];
      i[t + r] = i[e - n + r], i[e - n + r] = s;
    }
    t += n, e -= n;
  }
}
function gg(i, t, e, n) {
  let r = 0, s = i[e - n], o = i[e - n + 1];
  for (; t < e; t += n) {
    const a = i[t], A = i[t + 1];
    r += (a - s) * (A + o), s = a, o = A;
  }
  return r === 0 ? void 0 : r > 0;
}
function _u(i, t, e, n, r) {
  r = r !== void 0 ? r : !1;
  for (let s = 0, o = e.length; s < o; ++s) {
    const a = e[s], A = gg(
      i,
      t,
      a,
      n
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
function va(i, t, e, n, r) {
  r = r !== void 0 ? r : !1;
  for (let s = 0, o = e.length; s < o; ++s) {
    const a = e[s], A = gg(
      i,
      t,
      a,
      n
    );
    (s === 0 ? r && A || !r && !A : r && !A || !r && A) && Mu(i, t, a, n), t = a;
  }
  return t;
}
class gi extends xn {
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
    this.flatCoordinates ? ZA(this.flatCoordinates, t.getFlatCoordinates()) : this.flatCoordinates = t.getFlatCoordinates().slice(), this.ends_.push(this.flatCoordinates.length), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Polygon} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new gi(
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
    return r < no(this.getExtent(), t, e) ? r : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      fu(
        this.flatCoordinates,
        0,
        this.ends_,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), du(
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
    return sg(
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
    return Cu(
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
    return t !== void 0 ? (e = this.getOrientedFlatCoordinates().slice(), va(e, 0, this.ends_, this.stride, t)) : e = this.flatCoordinates, pu(e, 0, this.ends_, this.stride);
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
      const t = Ui(this.getExtent());
      this.flatInteriorPoint_ = Tu(
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
    return new Wi(this.getFlatInteriorPoint(), "XYM");
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
    return t < 0 || this.ends_.length <= t ? null : new pn(
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
    for (let o = 0, a = n.length; o < a; ++o) {
      const A = n[o], g = new pn(
        e.slice(s, A),
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
      _u(t, 0, this.ends_, this.stride) ? this.orientedFlatCoordinates_ = t : (this.orientedFlatCoordinates_ = t.slice(), this.orientedFlatCoordinates_.length = va(
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
    return e.length = wu(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      Math.sqrt(t),
      e,
      0,
      n
    ), new gi(e, "XY", n);
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
    return yu(
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
    const n = Iu(
      this.flatCoordinates,
      0,
      t,
      this.stride,
      this.ends_
    );
    this.flatCoordinates.length = n.length === 0 ? 0 : n[n.length - 1], this.changed();
  }
}
function wa(i) {
  if (Tr(i))
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
  return new gi(s, "XY", [s.length]);
}
const ht = {
  IDLE: 0,
  LOADING: 1,
  LOADED: 2,
  /**
   * Indicates that tile loading failed
   * @type {number}
   */
  ERROR: 3,
  EMPTY: 4
};
function cg(i, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = i, n;
}
function Le(i, t, e = {}) {
  if (!i)
    throw new Error("coordinates is required");
  if (!Array.isArray(i))
    throw new Error("coordinates must be an Array");
  if (i.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!ba(i[0]) || !ba(i[1]))
    throw new Error("coordinates must contain numbers");
  return cg({
    type: "Point",
    coordinates: i
  }, t, e);
}
function Fs(i, t, e = {}) {
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
  return cg({
    type: "Polygon",
    coordinates: i
  }, t, e);
}
function Vi(i, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = i, e;
}
function ba(i) {
  return !isNaN(i) && i !== null && !Array.isArray(i);
}
function Su(i) {
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
function Ea(i) {
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
function Ru(i) {
  return i.type === "Feature" ? i.geometry : i;
}
const Be = 11102230246251565e-32, Ut = 134217729, ku = (3 + 8 * Be) * Be;
function es(i, t, e, n, r) {
  let s, o, a, A, g = t[0], c = n[0], u = 0, C = 0;
  c > g == c > -g ? (s = g, g = t[++u]) : (s = c, c = n[++C]);
  let p = 0;
  if (u < i && C < e)
    for (c > g == c > -g ? (o = g + s, a = s - (o - g), g = t[++u]) : (o = c + s, a = s - (o - c), c = n[++C]), s = o, a !== 0 && (r[p++] = a); u < i && C < e; )
      c > g == c > -g ? (o = s + g, A = o - s, a = s - (o - A) + (g - A), g = t[++u]) : (o = s + c, A = o - s, a = s - (o - A) + (c - A), c = n[++C]), s = o, a !== 0 && (r[p++] = a);
  for (; u < i; )
    o = s + g, A = o - s, a = s - (o - A) + (g - A), g = t[++u], s = o, a !== 0 && (r[p++] = a);
  for (; C < e; )
    o = s + c, A = o - s, a = s - (o - A) + (c - A), c = n[++C], s = o, a !== 0 && (r[p++] = a);
  return (s !== 0 || p === 0) && (r[p++] = s), p;
}
function Pu(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function Tn(i) {
  return new Float64Array(i);
}
const Ou = (3 + 16 * Be) * Be, Lu = (2 + 12 * Be) * Be, Du = (9 + 64 * Be) * Be * Be, bi = Tn(4), xa = Tn(8), Ta = Tn(12), Ma = Tn(16), Ht = Tn(4);
function Bu(i, t, e, n, r, s, o) {
  let a, A, g, c, u, C, p, m, l, h, I, d, E, v, f, y, w, T;
  const M = i - r, x = e - r, _ = t - s, S = n - s;
  v = M * S, C = Ut * M, p = C - (C - M), m = M - p, C = Ut * S, l = C - (C - S), h = S - l, f = m * h - (v - p * l - m * l - p * h), y = _ * x, C = Ut * _, p = C - (C - _), m = _ - p, C = Ut * x, l = C - (C - x), h = x - l, w = m * h - (y - p * l - m * l - p * h), I = f - w, u = f - I, bi[0] = f - (I + u) + (u - w), d = v + I, u = d - v, E = v - (d - u) + (I - u), I = E - y, u = E - I, bi[1] = E - (I + u) + (u - y), T = d + I, u = T - d, bi[2] = d - (T - u) + (I - u), bi[3] = T;
  let L = Pu(4, bi), D = Lu * o;
  if (L >= D || -L >= D || (u = i - M, a = i - (M + u) + (u - r), u = e - x, g = e - (x + u) + (u - r), u = t - _, A = t - (_ + u) + (u - s), u = n - S, c = n - (S + u) + (u - s), a === 0 && A === 0 && g === 0 && c === 0) || (D = Du * o + ku * Math.abs(L), L += M * c + S * a - (_ * g + x * A), L >= D || -L >= D)) return L;
  v = a * S, C = Ut * a, p = C - (C - a), m = a - p, C = Ut * S, l = C - (C - S), h = S - l, f = m * h - (v - p * l - m * l - p * h), y = A * x, C = Ut * A, p = C - (C - A), m = A - p, C = Ut * x, l = C - (C - x), h = x - l, w = m * h - (y - p * l - m * l - p * h), I = f - w, u = f - I, Ht[0] = f - (I + u) + (u - w), d = v + I, u = d - v, E = v - (d - u) + (I - u), I = E - y, u = E - I, Ht[1] = E - (I + u) + (u - y), T = d + I, u = T - d, Ht[2] = d - (T - u) + (I - u), Ht[3] = T;
  const F = es(4, bi, 4, Ht, xa);
  v = M * c, C = Ut * M, p = C - (C - M), m = M - p, C = Ut * c, l = C - (C - c), h = c - l, f = m * h - (v - p * l - m * l - p * h), y = _ * g, C = Ut * _, p = C - (C - _), m = _ - p, C = Ut * g, l = C - (C - g), h = g - l, w = m * h - (y - p * l - m * l - p * h), I = f - w, u = f - I, Ht[0] = f - (I + u) + (u - w), d = v + I, u = d - v, E = v - (d - u) + (I - u), I = E - y, u = E - I, Ht[1] = E - (I + u) + (u - y), T = d + I, u = T - d, Ht[2] = d - (T - u) + (I - u), Ht[3] = T;
  const j = es(F, xa, 4, Ht, Ta);
  v = a * c, C = Ut * a, p = C - (C - a), m = a - p, C = Ut * c, l = C - (C - c), h = c - l, f = m * h - (v - p * l - m * l - p * h), y = A * g, C = Ut * A, p = C - (C - A), m = A - p, C = Ut * g, l = C - (C - g), h = g - l, w = m * h - (y - p * l - m * l - p * h), I = f - w, u = f - I, Ht[0] = f - (I + u) + (u - w), d = v + I, u = d - v, E = v - (d - u) + (I - u), I = E - y, u = E - I, Ht[1] = E - (I + u) + (u - y), T = d + I, u = T - d, Ht[2] = d - (T - u) + (I - u), Ht[3] = T;
  const R = es(j, Ta, 4, Ht, Ma);
  return Ma[R - 1];
}
function Nu(i, t, e, n, r, s) {
  const o = (t - s) * (e - r), a = (i - r) * (n - s), A = o - a, g = Math.abs(o + a);
  return Math.abs(A) >= Ou * g ? A : -Bu(i, t, e, n, r, s, g);
}
function Fu(i, t) {
  var e, n, r = 0, s, o, a, A, g, c, u, C = i[0], p = i[1], m = t.length;
  for (e = 0; e < m; e++) {
    n = 0;
    var l = t[e], h = l.length - 1;
    if (c = l[0], c[0] !== l[h][0] && c[1] !== l[h][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (o = c[0] - C, a = c[1] - p, n; n < h; n++) {
      if (u = l[n + 1], A = u[0] - C, g = u[1] - p, a === 0 && g === 0) {
        if (A <= 0 && o >= 0 || o <= 0 && A >= 0)
          return 0;
      } else if (g >= 0 && a <= 0 || g <= 0 && a >= 0) {
        if (s = Nu(o, A, a, g, 0, 0), s === 0)
          return 0;
        (s > 0 && g > 0 && a <= 0 || s < 0 && g <= 0 && a > 0) && r++;
      }
      c = u, a = g, o = A;
    }
  }
  return r % 2 !== 0;
}
function si(i, t, e = {}) {
  if (!i)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = Su(i), r = Ru(t), s = r.type, o = t.bbox;
  let a = r.coordinates;
  if (o && ju(n, o) === !1)
    return !1;
  s === "Polygon" && (a = [a]);
  for (var A = 0; A < a.length; ++A) {
    const g = Fu(n, a[A]);
    if (g === 0 && !e.ignoreBoundary || g) return !0;
  }
  return !1;
}
function ju(i, t) {
  return t[0] <= i[0] && t[1] <= i[1] && t[2] >= i[0] && t[3] >= i[1];
}
function is(i, t) {
  for (let e = 0; e < t.features.length; e++)
    if (si(i, t.features[e]))
      return t.features[e];
}
function lg(i, t) {
  const e = t.geometry.coordinates[0][0], n = t.geometry.coordinates[0][1], r = t.geometry.coordinates[0][2], s = i.geometry.coordinates, o = t.properties.a.geom, a = t.properties.b.geom, A = t.properties.c.geom, g = [n[0] - e[0], n[1] - e[1]], c = [r[0] - e[0], r[1] - e[1]], u = [s[0] - e[0], s[1] - e[1]], C = [a[0] - o[0], a[1] - o[1]], p = [A[0] - o[0], A[1] - o[1]], m = (c[1] * u[0] - c[0] * u[1]) / (g[0] * c[1] - g[1] * c[0]), l = (g[0] * u[1] - g[1] * u[0]) / (g[0] * c[1] - g[1] * c[0]);
  return [
    m * C[0] + l * p[0] + o[0],
    m * C[1] + l * p[1] + o[1]
  ];
}
function Gu(i, t, e) {
  const n = i.geometry.coordinates, r = e.geometry.coordinates, s = Math.atan2(n[0] - r[0], n[1] - r[1]), o = Xu(s, t[0]);
  if (o === void 0)
    throw new Error("Unable to determine vertex index");
  const a = t[1][o];
  return lg(i, a.features[0]);
}
function zu(i, t, e, n, r, s, o, a) {
  let A;
  if (o && (A = is(i, Vi([o]))), !A)
    if (e) {
      const g = i.geometry.coordinates, c = e.gridNum, u = e.xOrigin, C = e.yOrigin, p = e.xUnit, m = e.yUnit, l = e.gridCache, h = we(g[0], u, p, c), I = we(g[1], C, m, c), d = l[h] ? l[h][I] ? l[h][I] : [] : [], E = Vi(d.map((v) => t.features[v]));
      A = is(i, E);
    } else
      A = is(i, t);
  return a && a(A), A ? lg(i, A) : Gu(i, n, r);
}
function we(i, t, e, n) {
  let r = Math.floor((i - t) / e);
  return r < 0 && (r = 0), r >= n && (r = n - 1), r;
}
function Xu(i, t) {
  let e = _a(i - t[0]), n = Math.PI * 2, r;
  for (let s = 0; s < t.length; s++) {
    const o = (s + 1) % t.length, a = _a(i - t[o]), A = Math.min(Math.abs(e), Math.abs(a));
    e * a <= 0 && A < n && (n = A, r = s), e = a;
  }
  return r;
}
function _a(i, t = !1) {
  const e = 2 * Math.PI, n = i - Math.floor(i / e) * e;
  return t ? n : n > Math.PI ? n - e : n;
}
function Uu(i) {
  const t = [0, 1, 2, 0].map((n) => i[n][0][0]), e = {
    a: { geom: i[0][0][1], index: i[0][1] },
    b: { geom: i[1][0][1], index: i[1][1] },
    c: { geom: i[2][0][1], index: i[2][1] }
  };
  return Fs([t], e);
}
function js(i, t, e, n, r, s = !1, o) {
  const a = i.map(
    (A) => {
      (!o || o < 2.00703) && (A = Zu(A));
      const g = isFinite(A) ? t[A] : A === "c" ? n : (function() {
        const c = A.match(/^b(\d+)$/);
        if (c) return r[parseInt(c[1])];
        const u = A.match(/^e(\d+)$/);
        if (u) return e[parseInt(u[1])];
        throw new Error("Bad index value for indexesToTri");
      })();
      return s ? [[g[1], g[0]], A] : [[g[0], g[1]], A];
    }
  );
  return Uu(a);
}
function Zu(i) {
  return typeof i == "number" ? i : i.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
}
function Wu(i, t) {
  return t && t >= 2.00703 || Array.isArray(i[0]) ? i : i.map((e) => [
    e.illstNodes,
    e.mercNodes,
    e.startEnd
  ]);
}
const Vu = 2.00704;
function Yu(i) {
  return !!(i.version !== void 0 || !i.tins && i.points && i.tins_points);
}
function Hu(i) {
  return {
    points: i.points,
    strictStatus: Ku(i),
    verticesParams: Ju(i),
    centroid: qu(i),
    edges: Wu(i.edges || []),
    edgeNodes: i.edgeNodes || [],
    tins: $u(i),
    kinks: th(i.kinks_points),
    yaxisMode: i.yaxisMode ?? "invert",
    strictMode: i.strictMode ?? "auto",
    vertexMode: i.vertexMode,
    bounds: i.bounds,
    boundsPolygon: i.boundsPolygon,
    wh: i.wh,
    xy: i.xy ?? [0, 0]
  };
}
function Qu(i) {
  const t = eh(i), e = t.tins;
  return {
    compiled: t,
    tins: e,
    points: ih(e),
    strictStatus: t.strict_status,
    verticesParams: t.vertices_params,
    centroid: t.centroid,
    kinks: t.kinks
  };
}
function Ku(i) {
  return i.strict_status ? i.strict_status : i.kinks_points ? "strict_error" : i.tins_points.length === 2 ? "loose" : "strict";
}
function Ju(i) {
  const t = {
    forw: [i.vertices_params[0]],
    bakw: [i.vertices_params[1]]
  };
  return t.forw[1] = Sa(i, !1), t.bakw[1] = Sa(i, !0), t;
}
function Sa(i, t) {
  const e = i.vertices_points.length;
  return Array.from({ length: e }, (n, r) => {
    const s = (r + 1) % e, o = js(
      ["c", `b${r}`, `b${s}`],
      i.points,
      i.edgeNodes || [],
      i.centroid_point,
      i.vertices_points,
      t,
      Vu
    );
    return Vi([o]);
  });
}
function qu(i) {
  return {
    forw: Le(i.centroid_point[0], {
      target: {
        geom: i.centroid_point[1],
        index: "c"
      }
    }),
    bakw: Le(i.centroid_point[1], {
      target: {
        geom: i.centroid_point[0],
        index: "c"
      }
    })
  };
}
function $u(i) {
  const t = i.tins_points.length === 1 ? 0 : 1;
  return {
    forw: Vi(
      i.tins_points[0].map(
        (e) => js(
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
    bakw: Vi(
      i.tins_points[t].map(
        (e) => js(
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
function th(i) {
  if (i)
    return {
      bakw: Vi(
        i.map((t) => Le(t))
      )
    };
}
function eh(i) {
  return JSON.parse(
    JSON.stringify(i).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"')
  );
}
function ih(i) {
  const t = [], e = i.forw.features;
  for (let n = 0; n < e.length; n++) {
    const r = e[n];
    ["a", "b", "c"].forEach((s, o) => {
      const a = r.geometry.coordinates[0][o], A = r.properties[s].geom, g = r.properties[s].index;
      typeof g == "number" && (t[g] = [a, A]);
    });
  }
  return t;
}
class he {
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
  yaxisMode = he.YAXIS_INVERT;
  strictMode = he.MODE_AUTO;
  vertexMode = he.VERTEX_PLAIN;
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
    if (Yu(t)) {
      this.applyModernState(Hu(t));
      return;
    }
    this.applyLegacyState(Qu(t));
  }
  applyModernState(t) {
    this.points = t.points, this.strict_status = t.strictStatus, this.vertices_params = t.verticesParams, this.centroid = t.centroid, this.edges = t.edges, this.edgeNodes = t.edgeNodes || [], this.tins = t.tins, this.addIndexedTin(), this.kinks = t.kinks, this.yaxisMode = t.yaxisMode ?? he.YAXIS_INVERT, this.vertexMode = t.vertexMode ?? he.VERTEX_PLAIN, this.strictMode = t.strictMode ?? he.MODE_AUTO, t.bounds ? (this.bounds = t.bounds, this.boundsPolygon = t.boundsPolygon, this.xy = t.xy, this.wh = t.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = t.xy ?? [0, 0], t.wh && (this.wh = t.wh));
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
    const a = e.features.map((l) => {
      let h = [];
      return Ea(l)[0].map((I) => {
        s.length === 0 ? s = [Array.from(I), Array.from(I)] : (I[0] < s[0][0] && (s[0][0] = I[0]), I[0] > s[1][0] && (s[1][0] = I[0]), I[1] < s[0][1] && (s[0][1] = I[1]), I[1] > s[1][1] && (s[1][1] = I[1])), h.length === 0 ? h = [Array.from(I), Array.from(I)] : (I[0] < h[0][0] && (h[0][0] = I[0]), I[0] > h[1][0] && (h[1][0] = I[0]), I[1] < h[0][1] && (h[0][1] = I[1]), I[1] > h[1][1] && (h[1][1] = I[1]));
      }), h;
    }), A = (s[1][0] - s[0][0]) / r, g = (s[1][1] - s[0][1]) / r, c = a.reduce(
      (l, h, I) => {
        const d = we(h[0][0], s[0][0], A, r), E = we(h[1][0], s[0][0], A, r), v = we(h[0][1], s[0][1], g, r), f = we(h[1][1], s[0][1], g, r);
        for (let y = d; y <= E; y++) {
          l[y] || (l[y] = []);
          for (let w = v; w <= f; w++)
            l[y][w] || (l[y][w] = []), l[y][w].push(I);
        }
        return l;
      },
      []
    ), u = n.features.map((l) => {
      let h = [];
      return Ea(l)[0].map((I) => {
        o.length === 0 ? o = [Array.from(I), Array.from(I)] : (I[0] < o[0][0] && (o[0][0] = I[0]), I[0] > o[1][0] && (o[1][0] = I[0]), I[1] < o[0][1] && (o[0][1] = I[1]), I[1] > o[1][1] && (o[1][1] = I[1])), h.length === 0 ? h = [Array.from(I), Array.from(I)] : (I[0] < h[0][0] && (h[0][0] = I[0]), I[0] > h[1][0] && (h[1][0] = I[0]), I[1] < h[0][1] && (h[0][1] = I[1]), I[1] > h[1][1] && (h[1][1] = I[1]));
      }), h;
    }), C = (o[1][0] - o[0][0]) / r, p = (o[1][1] - o[0][1]) / r, m = u.reduce(
      (l, h, I) => {
        const d = we(h[0][0], o[0][0], C, r), E = we(h[1][0], o[0][0], C, r), v = we(h[0][1], o[0][1], p, r), f = we(h[1][1], o[0][1], p, r);
        for (let y = d; y <= E; y++) {
          l[y] || (l[y] = []);
          for (let w = v; w <= f; w++)
            l[y][w] || (l[y][w] = []), l[y][w].push(I);
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
        xUnit: A,
        yUnit: g,
        gridCache: c
      },
      bakw: {
        gridNum: r,
        xOrigin: o[0][0],
        yOrigin: o[0][1],
        xUnit: C,
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
    if (e && this.strict_status == he.STATUS_ERROR)
      throw new Error('Backward transform is not allowed if strict_status == "strict_error"');
    this.yaxisMode == he.YAXIS_FOLLOW && e && (t = [t[0], -1 * t[1]]);
    const r = Le(t);
    if (this.bounds && !e && !n && !si(r, this.boundsPolygon))
      return !1;
    const s = e ? this.tins.bakw : this.tins.forw, o = e ? this.indexedTins.bakw : this.indexedTins.forw, a = e ? this.vertices_params.bakw : this.vertices_params.forw, A = e ? this.centroid.bakw : this.centroid.forw;
    let g, c;
    this.stateFull && (this.stateBackward == e ? g = this.stateTriangle : (this.stateBackward = e, this.stateTriangle = void 0), c = (C) => {
      this.stateTriangle = C;
    });
    let u = zu(
      r,
      s,
      o,
      a,
      A,
      void 0,
      g,
      c
    );
    if (this.bounds && e && !n) {
      const C = Le(u);
      if (!si(C, this.boundsPolygon)) return !1;
    } else this.yaxisMode == he.YAXIS_FOLLOW && !e && (u = [u[0], -1 * u[1]]);
    return u;
  }
}
const mt = 20037508342789244e-9, ug = [
  [0, 0],
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
];
function vo(i, t) {
  return Math.floor(Math.min(i[0], i[1]) / 4) * mt / 128 / Math.pow(2, t);
}
function hg(i, t) {
  const e = [];
  for (let n = 0; n < i.length; n++) {
    const r = i[n], s = r[0] * Math.cos(t) - r[1] * Math.sin(t), o = r[0] * Math.sin(t) + r[1] * Math.cos(t);
    e.push([s, o]);
  }
  return e;
}
function Gs(i, t, e, n) {
  const r = vo(n, t);
  return hg(ug, e).map((s) => [
    s[0] * r + i[0],
    s[1] * r + i[1]
  ]);
}
function zs(i, t) {
  const e = i[0], n = i.slice(1, 5).map((C) => [
    C[0] - e[0],
    C[1] - e[1]
  ]), r = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
  ];
  let s = 0, o = 0, a = 0;
  for (let C = 0; C < 4; C++) {
    const p = n[C], m = r[C], l = Math.sqrt(Math.pow(p[0], 2) + Math.pow(p[1], 2));
    s += l;
    const h = p[0] * m[1] - p[1] * m[0], I = Math.acos(
      (p[0] * m[0] + p[1] * m[1]) / l
    ), d = h > 0 ? -1 * I : I;
    o += Math.cos(d), a += Math.sin(d);
  }
  const A = s / 4, g = Math.atan2(a, o), c = Math.floor(Math.min(t[0], t[1]) / 4), u = Math.log(c * mt / 128 / A) / Math.log(2);
  return { center: e, zoom: u, rotation: g };
}
function ns(i, t) {
  const e = i[0] * (2 * mt) / t - mt, n = -1 * (i[1] * (2 * mt) / t - mt);
  return [e, n];
}
function Ra(i, t) {
  const e = (i[0] + mt) * t / (2 * mt), n = (-i[1] + mt) * t / (2 * mt);
  return [e, n];
}
const rs = 256;
class Ig {
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
    const e = new he();
    if (e.setCompiled(t.compiled), this.mainTin = e, t.maxZoom !== void 0)
      this._maxxy = Math.pow(2, t.maxZoom) * rs;
    else if (t.compiled.wh) {
      const n = Math.max(t.compiled.wh[0], t.compiled.wh[1]), r = Math.ceil(Math.log2(n / rs));
      this._maxxy = Math.pow(2, r) * rs;
    }
    if (this.subTins = [], t.sub_maps)
      for (const n of t.sub_maps) {
        const r = new he();
        r.setCompiled(n.compiled);
        const s = n.bounds ?? n.compiled.bounds;
        if (!s)
          throw new Error(
            "SubMapData must have bounds or compiled.bounds to create xyBounds polygon"
          );
        const o = [...s, s[0]], a = o.map((A) => {
          const g = r.transform(A, !1);
          if (!g) throw new Error("Failed to transform sub-map bounds to mercator");
          return g;
        });
        this.subTins.push({
          tin: r,
          priority: n.priority,
          importance: n.importance,
          xyBounds: Fs([o]),
          mercBounds: Fs([a])
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
      if (s || si(Le(t), this.subTins[r - 1].xyBounds)) {
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
      return s === !1 ? [n, e] : r || si(Le(s), this.subTins[e - 1].xyBounds) ? [n, e, s] : [n, e];
    }).sort((e, n) => {
      const r = e[0].priority ?? 0, s = n[0].priority ?? 0;
      return r < s ? 1 : -1;
    }).reduce(
      (e, n, r, s) => {
        const o = n[0], a = n[1], A = n[2];
        if (!A) return e;
        for (let g = 0; g < r; g++) {
          const c = s[g][1], u = c === 0;
          if (s[g][2] && (u || si(Le(A), this.subTins[c - 1].xyBounds)))
            if (e.length) {
              const C = !e[0], p = C ? e[1][2] : e[0][2], m = o.importance ?? 0, l = p.importance ?? 0;
              return C ? m < l ? e : [void 0, [a, A, o]] : [...e.filter(
                (h) => h !== void 0
              ), [a, A, o]].sort(
                (h, I) => (h[2].importance ?? 0) < (I[2].importance ?? 0) ? 1 : -1
              ).slice(0, 2);
            } else
              return [[a, A, o]];
        }
        return !e.length || !e[0] ? [[a, A, o]] : (e.push([a, A, o]), e.sort((g, c) => {
          const u = g[2].importance ?? 0, C = c[2].importance ?? 0;
          return u < C ? 1 : -1;
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
    const e = this._getAllTinsWithIndex(), n = (A) => A === 0 ? 0 : this.subTins[A - 1].priority ?? 0, r = (A) => A === 0 ? 0 : this.subTins[A - 1].importance ?? 0, s = (A, g) => A === 0 || si(Le(g), this.subTins[A - 1].xyBounds), o = [];
    for (const { index: A } of e) {
      const g = this._transformByIndex(t, A, !0);
      g !== !1 && s(A, g) && o.push({ index: A, xy: g });
    }
    const a = (A) => e.some(
      ({ index: g }) => g !== 0 && g !== A.index && (n(g) > n(A.index) || A.index === 0 && n(g) === 0) && s(g, A.xy)
    );
    return o.filter((A) => !a(A)).sort((A, g) => r(g.index) - r(A.index) || n(g.index) - n(A.index) || A.index - g.index).map((A) => [A.index, A.xy]);
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
      const o = r[0], a = r[1];
      return s !== 0 && !n ? [this.xy2SysCoordInternal(a)] : t.map((A, g) => g === 0 ? a : this._transformByIndex(A, o, !0)).map((A) => this.xy2SysCoordInternal(A));
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
    const n = Gs(t.center, t.zoom, t.rotation, e).map((a) => Ra(a, this._maxxy)), r = this.xy2MercWithLayer(n[0]);
    if (!r) throw new Error("viewpoint2Mercs: center point is out of bounds");
    const s = r[0], o = r[1];
    return n.map((a, A) => {
      if (A === 0) return o;
      const g = this._transformByIndex(a, s, !1);
      if (g === !1) throw new Error(`viewpoint2Mercs: point ${A} is out of bounds`);
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
    const s = r[0], o = r[1], a = t.map((A, g) => {
      if (g === 0) return o;
      const c = this._transformByIndex(A, s, !0);
      if (c === !1) throw new Error(`mercs2Viewpoint: point ${g} is out of bounds`);
      return c;
    }).map((A) => ns(A, this._maxxy));
    return zs(a, e);
  }
  // ─── ユーティリティ（静的メソッド）────────────────────────────────────────
  /** zoom2Radius の静的ラッパー */
  static zoom2Radius(t, e) {
    return vo(t, e);
  }
  /** mercViewpoint2Mercs の静的ラッパー */
  static mercViewpoint2Mercs(t, e, n, r) {
    return Gs(t, e, n, r);
  }
  /** mercs2MercViewpoint の静的ラッパー */
  static mercs2MercViewpoint(t, e) {
    return zs(t, e);
  }
  /** xy2SysCoord の静的ラッパー */
  static xy2SysCoord(t, e) {
    return ns(t, e);
  }
  /** sysCoord2Xy の静的ラッパー */
  static sysCoord2Xy(t, e) {
    return Ra(t, e);
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
    return ns(t, this._maxxy);
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
const Bt = 256, nh = {
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
}, rh = /^https?:\/\/iiif\.io\/api\/image\/2\/level[0-2](?:\.json)?$/, sh = /(^https?:\/\/iiif\.io\/api\/image\/3\/level[0-2](?:\.json)?$)|(^level[0-2]$)/;
function Cg(i) {
  const t = fg(i);
  if (!t) return { ok: !1, reason: "not-json" };
  try {
    let e = t["@context"] || "ol-no-context";
    typeof e == "string" && (e = [e]);
    let n;
    for (let l = 0; l < e.length; l++) {
      const h = e[l];
      if (h === "http://library.stanford.edu/iiif/image-api/1.1/context.json" || h === "http://iiif.io/api/image/1/context.json")
        return { ok: !1, reason: "unsupported-version" };
      if (h === "http://iiif.io/api/image/2/context.json" && (n = "2"), h === "http://iiif.io/api/image/3/context.json" && (n = "3"), n) break;
    }
    if (!n) return { ok: !1, reason: "unsupported-version" };
    let r = t.profile;
    n === "2" && Array.isArray(r) && (r = r[0]);
    const o = (n === "2" ? typeof r == "string" && rh.test(r) : sh.test(r)) ? r.match(/level[0-2](?:\.json)?$/g) : void 0, a = o ? Number(o[0].replace(".json", "").slice(-1)) : 0, A = n === "2" && Array.isArray(t.profile) && t.profile.length > 1 ? t.profile[1] : {}, g = [
      ...o ? nh[n][a] : [],
      ...n === "2" ? A.supports || [] : t.extraFeatures === void 0 ? [] : t.extraFeatures
    ], c = [
      ...o ? a === 2 ? ["jpg", "png"] : ["jpg"] : [],
      ...n === "2" ? A.formats || [] : t.extraFormats === void 0 ? [] : t.extraFormats
    ], u = [
      ...o ? n === "2" && a === 2 ? ["default", "bitonal"] : ["default"] : [],
      ...n === "2" ? A.qualities || [] : t.extraQualities === void 0 ? [] : t.extraQualities
    ], C = n === "3" && Array.isArray(t.preferredFormats) ? t.preferredFormats.find(
      (l) => ["jpg", "png", "gif"].includes(l) && c.includes(l)
    ) : void 0, p = t.tiles === void 0 ? void 0 : [
      t.tiles.map((l) => l.width)[0],
      t.tiles.map(
        (l) => n === "2" && l.height === void 0 ? l.width : l.height
      )[0]
    ], m = t.tiles === void 0 ? void 0 : t.tiles.map((l) => l.scaleFactors)[0];
    return {
      ok: !0,
      service: {
        version: n,
        level: a,
        width: t.width,
        height: t.height,
        id: n === "2" ? t["@id"].replace(/\/?(?:info\.json)?$/g, "") : t.id,
        supports: g,
        format: C === void 0 ? "jpg" : C,
        quality: u.includes("native") ? "native" : "default",
        tileSize: p,
        // OL は元の配列を sort するが、純粋な解釈関数では入力を変更しない。
        scaleFactors: Array.isArray(m) ? [...m].sort((l, h) => h - l) : void 0,
        sizes: t.sizes === void 0 ? void 0 : t.sizes.map((l) => [l.width, l.height])
      }
    };
  } catch {
    return { ok: !1, reason: "unsupported-version" };
  }
}
function wo(i) {
  return (i.includes("regionByPx") || i.includes("regionByPct")) && (i.includes("sizeByWh") || i.includes("sizeByH") || i.includes("sizeByW") || i.includes("sizeByPct"));
}
function oh(i) {
  if (wo(i.supports)) return;
  const t = dg(i.tileSize);
  if (t.width !== Bt || t.height !== Bt || !pg(i.scaleFactors))
    return;
  const e = Math.ceil(
    Math.max(
      Math.log2(i.width / Bt),
      Math.log2(i.height / Bt)
    )
  );
  return Math.max(0, e - Math.log2(Math.max(...i.scaleFactors)));
}
function sn(i) {
  return i.toLocaleString("en", { maximumFractionDigits: 10 });
}
function ah(i, t, e, n, r) {
  const { width: s, height: o, supports: a, version: A } = t, g = Math.max(
    Math.ceil(Math.log(s / Bt) / Math.LN2),
    Math.ceil(Math.log(o / Bt) / Math.LN2)
  );
  if (e > g || e < 0 || !Number.isInteger(e)) return;
  const c = 2 ** (g - e);
  if (n === void 0 || r === void 0 || n < 0 || Math.ceil(s / c / Bt) <= n || r < 0 || Math.ceil(o / c / Bt) <= r)
    return;
  const u = wo(a), C = n * Bt * c, p = r * Bt * c, m = Math.min(Bt * c, s - C), l = Math.min(Bt * c, o - p), h = C + Bt * c > s ? Math.floor((s - C + c - 1) / c) : Bt, I = p + Bt * c > o ? Math.floor((o - p + c - 1) / c) : Bt;
  let d, E;
  return C === 0 && m === s && p === 0 && l === o ? d = "full" : !u || a.includes("regionByPx") ? d = `${C},${p},${m},${l}` : a.includes("regionByPct") && (d = `pct:${sn(C / s * 100)},${sn(p / o * 100)},${sn(m / s * 100)},${sn(l / o * 100)}`), A === "3" && (!u || a.includes("sizeByWh")) ? E = `${h},${I}` : !u || a.includes("sizeByW") ? E = `${h},` : a.includes("sizeByH") ? E = `,${I}` : a.includes("sizeByWh") ? E = `${h},${I}` : a.includes("sizeByPct") && (E = `pct:${sn(100 / c)}`), `${i + (i.lastIndexOf("/") === i.length - 1 || i === "" ? "" : "/")}${d}/${E}/0/${t.quality || "default"}.${t.format || "jpg"}`;
}
class ie extends Error {
  reason;
  mapID;
  constructor(t, e, n) {
    super(e || t), this.name = "IiifDeliveryError", this.reason = t, this.mapID = n;
  }
}
function on(i) {
  return `${i.replace(/\/+$/, "")}/info.json`;
}
function fg(i) {
  if (typeof i == "string")
    try {
      return JSON.parse(i);
    } catch {
      return;
    }
  if (i && typeof i == "object") return i;
}
function dg(i) {
  if (i == null) return {};
  if (typeof i == "number")
    return { width: i, height: i };
  if (Array.isArray(i)) {
    const t = i[0], e = i[1] === void 0 ? i[0] : i[1];
    return { width: t, height: e };
  }
  return {};
}
function Zn(i) {
  return Number.isInteger(i) && i > 0;
}
function pg(i) {
  return !Array.isArray(i) || i.length === 0 ? !1 : [...i].sort((e, n) => e - n).every((e, n) => e === 2 ** n);
}
function Ah(i, t) {
  const e = fg(i);
  if (!e) return { ok: !1, reason: "not-json" };
  if (!Zn(e.width) || !Zn(e.height))
    return { ok: !1, reason: "size-mismatch" };
  if (t && (!Zn(t.width) || !Zn(t.height) || e.width !== t.width || e.height !== t.height))
    return { ok: !1, reason: "size-mismatch" };
  const n = Cg(e);
  if (!n.ok) return n;
  const { service: r } = n, { level: s, version: o, supports: a } = r;
  if (wo(a))
    return { ok: !0, version: o, level: s, tiling: "arbitrary" };
  const { width: g, height: c } = dg(r.tileSize);
  return g === 256 && c === 256 && pg(r.scaleFactors) ? { ok: !0, version: o, level: s, tiling: "level0-256" } : { ok: !1, reason: "unsupported-level0" };
}
const gh = 1e4, ch = 1024 * 1024;
function lh(i) {
  return typeof TextEncoder > "u" ? i.length : new TextEncoder().encode(i).length;
}
function uh(i) {
  let t;
  try {
    t = new URL(i);
  } catch {
    throw new ie(
      "bad-url",
      `IIIF image URL is not a URL: ${i}`
    );
  }
  if (t.protocol !== "http:" && t.protocol !== "https:")
    throw new ie(
      "bad-url",
      `IIIF image URL must be http or https: ${i}`
    );
}
async function hh(i, t) {
  const e = i.headers?.get?.("content-length");
  if (e != null) {
    const s = Number(e);
    if (!Number.isNaN(s) && s > t)
      throw new ie(
        "too-large",
        `IIIF info.json is larger than ${t} bytes`
      );
  }
  const n = i.body;
  if (n && typeof n.getReader == "function") {
    const s = n.getReader(), o = typeof TextDecoder > "u" ? void 0 : new TextDecoder();
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
  const r = await i.text();
  if (lh(r) > t)
    throw new ie(
      "too-large",
      `IIIF info.json is larger than ${t} bytes`
    );
  return r;
}
function ka(i) {
  try {
    const t = new URL(i);
    return `${t.protocol}//${t.host}${t.pathname.replace(/\/+$/, "")}`;
  } catch {
    return i.replace(/\/+$/, "");
  }
}
async function Ih(i, t, e) {
  if (!i || i.type !== "iiifImage" || typeof i.url != "string")
    throw new ie(
      "bad-url",
      "IIIF delivery must have { type: 'iiifImage', url }"
    );
  const n = i.url.replace(/\/+$/, "");
  uh(n);
  const r = fetch, s = new AbortController();
  let o = !1;
  const a = setTimeout(() => {
    o = !0, s.abort();
  }, gh);
  let A;
  try {
    let I;
    try {
      if (I = await r(on(n), {
        credentials: "omit",
        signal: s.signal
      }), !I || !I.ok)
        throw new ie(
          "fetch-failed",
          `Failed to fetch IIIF info.json: ${on(n)}`
        );
      A = await hh(I, ch);
    } catch (d) {
      throw d instanceof ie ? d : o ? new ie(
        "timeout",
        `Timed out fetching IIIF info.json: ${on(n)}`
      ) : new ie(
        "fetch-failed",
        `Failed to fetch IIIF info.json: ${on(n)}`
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
      `IIIF info.json is not JSON: ${on(n)}`
    );
  }
  const c = Ah(g, t);
  if (!c.ok) throw new ie(c.reason);
  const u = [], C = g["@id"] || g.id;
  typeof C == "string" && ka(C) !== ka(n) && u.push(
    `Maplat: the IIIF image service "${C}" differs from the delivery URL "${n}"; using the delivery URL.`
  );
  const p = Cg(g);
  if (!p.ok) throw new ie(p.reason);
  const m = p.service, l = oh(m);
  return {
    tileUrl: (I, d, E) => ah(n, m, I, d, E),
    service: m,
    url: n,
    width: g.width,
    height: g.height,
    info: g,
    warnings: u,
    ...l !== void 0 ? { minZoom: l } : {}
  };
}
function Pa(i) {
  const t = i && i.delivery;
  return t ? t.type === "iiifImage" ? !0 : (console.warn(
    `Maplat: map "${i.mapID}" has delivery type "${t.type}"; ignoring delivery.`
  ), !1) : !1;
}
async function Ch(i, t, e) {
  const n = await Ih(i.delivery, t);
  (i.url || i.urls) && (console.warn(
    `Maplat: map "${i.mapID}" has both delivery and url; using delivery.`
  ), delete i.url, delete i.urls);
  for (const r of n.warnings) console.warn(r);
  return n.minZoom !== void 0 && (i.minZoom = n.minZoom), n;
}
function fh(i) {
  return i?.delivery?.type === "iiifImage";
}
const bo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAB3RJTUUH3QgIBToaSbAjlwAAABd0RVh0U29mdHdhcmUAR0xEUE5HIHZlciAzLjRxhaThAAAACHRwTkdHTEQzAAAAAEqAKR8AAAAEZ0FNQQAAsY8L/GEFAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAFRJREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgBDwABHHIJwwAAAABJRU5ErkJggg==", ti = Bt, dh = `<canvas width="${ti}" height="${ti}" src="${bo}"></canvas>`;
async function an(i) {
  if (typeof i == "string") {
    const t = i.match(/\//) ? i : `pois/${i}`, e = await fetch(t);
    if (!e.ok)
      throw new Error("Fail to load poi json");
    return await e.json();
  } else
    return i;
}
const mg = ["hide", "title", "icon", "selectedIcon"], ph = [
  "lnglat",
  "lng",
  "lat",
  "longitude",
  "latitude"
];
function Ir(i) {
  return typeof i == "object" && i !== null && !Array.isArray(i);
}
function Xs(i) {
  if (!Ir(i) || i.type === "FeatureCollection") return !1;
  const t = i.layer, e = typeof t == "string", n = Ir(t) && t.type === "FeatureCollection";
  return !(!e && !n || ph.some((r) => i[r] !== void 0));
}
function mh(i) {
  return Xs(i) && mg.some((t) => i[t] !== void 0);
}
function Oa(i) {
  const t = {};
  for (const [e, n] of Object.entries(i))
    if (e !== "layer") {
      if (mg.includes(e)) {
        t[e] = n;
        continue;
      }
      console.warn(`[Maplat] pois layer ref: unknown override key ignored: ${e}`);
    }
  return t;
}
function La(i, t) {
  if (!t) return i;
  t.hide === !0 && (i.hide = !0);
  const e = t.title;
  (typeof e == "string" ? e !== "" : Ir(e) && Object.keys(e).length > 0) && (i.name = e);
  for (const n of ["icon", "selectedIcon"]) {
    const r = t[n];
    typeof r == "string" && r !== "" && (i[n] = r);
  }
  return i;
}
async function yg(i, t) {
  if (i = await an(i), Array.isArray(i)) {
    const e = i[0];
    if (i.length > 0 && (typeof e == "string" || Ir(e) && e.type === "FeatureCollection" || Xs(e))) {
      const r = await Promise.all(
        i.map(async (s, o) => {
          let a, A;
          Xs(s) ? (a = await an(s.layer), A = Oa(s)) : (a = await an(s), A = null);
          let g = a.id || a.properties && a.properties.id;
          if (!g)
            if (o === 0) g = "main";
            else throw "POI layers include bad key setting";
          const c = Ye(a, g, t);
          return [g, La(c, A)];
        })
      );
      i = Object.fromEntries(r);
    } else
      i = await Promise.all(i.map(async (r) => await an(r))), i = {
        main: Ye(i, "main", t)
      };
  } else if (i.type === "FeatureCollection") {
    const e = i.id || i.properties && i.properties.id || "main";
    i = { [e]: Ye(i, e, t) };
  } else if (mh(i)) {
    const e = await an(i.layer), n = e.id || e.properties && e.properties.id || "main", r = Ye(e, n, t);
    i = { [n]: La(r, Oa(i)) };
  } else
    Object.keys(i).map((e) => {
      i[e] = Ye(i[e], e, t);
    });
  return i.main || (i.main = Ye([], "main", t)), Object.keys(i).map((e) => {
    Eo(i, e, t);
  }), i;
}
function Ye(i, t, e) {
  if (Array.isArray(i))
    i = {
      pois: i.map((n) => mn(n))
    };
  else if (i.type === "FeatureCollection") {
    const n = Object.assign({}, i.properties || {});
    i.name && (n.name = i.name), n.pois = i.features.map((r) => mn(r)), i = n;
  }
  if (typeof i.id > "u")
    i.id = t;
  else if (i.id !== t) throw "POI layers include bad key setting";
  return i.namespaceID || (i.namespaceID = `${e.namespace ? `${e.namespace}#` : ""}${t}`), i.name || (i.name = t === "main" ? e.name : t), i.pois || (i.pois = []), i;
}
function mn(i) {
  if (i.type === "Feature") {
    const t = Object.assign({}, i.properties || {});
    t.lnglat = i.geometry.coordinates, t.id || (t.id = i.id), t.name || (t.name = i.name), i = t;
  }
  return i.lnglat || (i.lnglat = [i.lng || i.longitude, i.lat || i.latitude]), delete i.lng, delete i.lat, delete i.longitude, delete i.latitude, i;
}
function Eo(i, t, e) {
  if (!i[t]) return;
  const n = i[t], r = n.pois;
  n.__nextId || (n.__nextId = 0), r.map((s) => {
    s.id || (s.id = `${t}_${n.__nextId}`, n.__nextId++), s.namespaceID || (s.namespaceID = `${e.namespace ? `${e.namespace}#` : ""}${s.id}`);
  });
}
function xt(i, t) {
  if (!(i === null || typeof i != "object") && typeof t == "string")
    return Object.hasOwn(i, t) ? i[t] : void 0;
}
function yn(i, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = i, n;
}
function vg(i, t, e = {}) {
  if (!i)
    throw new Error("coordinates is required");
  if (!Array.isArray(i))
    throw new Error("coordinates must be an Array");
  if (i.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!Ba(i[0]) || !Ba(i[1]))
    throw new Error("coordinates must contain numbers");
  return yn({
    type: "Point",
    coordinates: i
  }, t, e);
}
function wg(i, t, e = {}) {
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
  return yn({
    type: "Polygon",
    coordinates: i
  }, t, e);
}
function yh(i, t, e = {}) {
  if (i.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return yn({
    type: "LineString",
    coordinates: i
  }, t, e);
}
function Da(i, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = i, e;
}
function Ba(i) {
  return !isNaN(i) && i !== null && !Array.isArray(i);
}
function vh(i) {
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
function wh(i) {
  return i.type === "Feature" ? i.geometry : i;
}
function bg(i, t, e) {
  if (i !== null)
    for (var n, r, s, o, a, A, g, c = 0, u = 0, C, p = i.type, m = p === "FeatureCollection", l = p === "Feature", h = m ? i.features.length : 1, I = 0; I < h; I++) {
      g = m ? (
        // @ts-expect-error: Known type conflict
        i.features[I].geometry
      ) : l ? (
        // @ts-expect-error: Known type conflict
        i.geometry
      ) : i, C = g ? g.type === "GeometryCollection" : !1, a = C ? g.geometries.length : 1;
      for (var d = 0; d < a; d++) {
        var E = 0, v = 0;
        if (o = C ? g.geometries[d] : g, o !== null) {
          A = o.coordinates;
          var f = o.type;
          switch (c = f === "Polygon" || f === "MultiPolygon" ? 1 : 0, f) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  A,
                  u,
                  I,
                  E,
                  v
                ) === !1
              )
                return !1;
              u++, E++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < A.length; n++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    A[n],
                    u,
                    I,
                    E,
                    v
                  ) === !1
                )
                  return !1;
                u++, f === "MultiPoint" && E++;
              }
              f === "LineString" && E++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < A.length; n++) {
                for (r = 0; r < A[n].length - c; r++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      A[n][r],
                      u,
                      I,
                      E,
                      v
                    ) === !1
                  )
                    return !1;
                  u++;
                }
                f === "MultiLineString" && E++, f === "Polygon" && v++;
              }
              f === "Polygon" && E++;
              break;
            case "MultiPolygon":
              for (n = 0; n < A.length; n++) {
                for (v = 0, r = 0; r < A[n].length; r++) {
                  for (s = 0; s < A[n][r].length - c; s++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        A[n][r][s],
                        u,
                        I,
                        E,
                        v
                      ) === !1
                    )
                      return !1;
                    u++;
                  }
                  v++;
                }
                E++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < o.geometries.length; n++)
                if (
                  // @ts-expect-error: Known type conflict
                  bg(o.geometries[n], t) === !1
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
const Ne = 11102230246251565e-32, Zt = 134217729, bh = (3 + 8 * Ne) * Ne;
function ss(i, t, e, n, r) {
  let s, o, a, A, g = t[0], c = n[0], u = 0, C = 0;
  c > g == c > -g ? (s = g, g = t[++u]) : (s = c, c = n[++C]);
  let p = 0;
  if (u < i && C < e)
    for (c > g == c > -g ? (o = g + s, a = s - (o - g), g = t[++u]) : (o = c + s, a = s - (o - c), c = n[++C]), s = o, a !== 0 && (r[p++] = a); u < i && C < e; )
      c > g == c > -g ? (o = s + g, A = o - s, a = s - (o - A) + (g - A), g = t[++u]) : (o = s + c, A = o - s, a = s - (o - A) + (c - A), c = n[++C]), s = o, a !== 0 && (r[p++] = a);
  for (; u < i; )
    o = s + g, A = o - s, a = s - (o - A) + (g - A), g = t[++u], s = o, a !== 0 && (r[p++] = a);
  for (; C < e; )
    o = s + c, A = o - s, a = s - (o - A) + (c - A), c = n[++C], s = o, a !== 0 && (r[p++] = a);
  return (s !== 0 || p === 0) && (r[p++] = s), p;
}
function Eh(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function Mn(i) {
  return new Float64Array(i);
}
const xh = (3 + 16 * Ne) * Ne, Th = (2 + 12 * Ne) * Ne, Mh = (9 + 64 * Ne) * Ne * Ne, Ei = Mn(4), Na = Mn(8), Fa = Mn(12), ja = Mn(16), Qt = Mn(4);
function _h(i, t, e, n, r, s, o) {
  let a, A, g, c, u, C, p, m, l, h, I, d, E, v, f, y, w, T;
  const M = i - r, x = e - r, _ = t - s, S = n - s;
  v = M * S, C = Zt * M, p = C - (C - M), m = M - p, C = Zt * S, l = C - (C - S), h = S - l, f = m * h - (v - p * l - m * l - p * h), y = _ * x, C = Zt * _, p = C - (C - _), m = _ - p, C = Zt * x, l = C - (C - x), h = x - l, w = m * h - (y - p * l - m * l - p * h), I = f - w, u = f - I, Ei[0] = f - (I + u) + (u - w), d = v + I, u = d - v, E = v - (d - u) + (I - u), I = E - y, u = E - I, Ei[1] = E - (I + u) + (u - y), T = d + I, u = T - d, Ei[2] = d - (T - u) + (I - u), Ei[3] = T;
  let L = Eh(4, Ei), D = Th * o;
  if (L >= D || -L >= D || (u = i - M, a = i - (M + u) + (u - r), u = e - x, g = e - (x + u) + (u - r), u = t - _, A = t - (_ + u) + (u - s), u = n - S, c = n - (S + u) + (u - s), a === 0 && A === 0 && g === 0 && c === 0) || (D = Mh * o + bh * Math.abs(L), L += M * c + S * a - (_ * g + x * A), L >= D || -L >= D)) return L;
  v = a * S, C = Zt * a, p = C - (C - a), m = a - p, C = Zt * S, l = C - (C - S), h = S - l, f = m * h - (v - p * l - m * l - p * h), y = A * x, C = Zt * A, p = C - (C - A), m = A - p, C = Zt * x, l = C - (C - x), h = x - l, w = m * h - (y - p * l - m * l - p * h), I = f - w, u = f - I, Qt[0] = f - (I + u) + (u - w), d = v + I, u = d - v, E = v - (d - u) + (I - u), I = E - y, u = E - I, Qt[1] = E - (I + u) + (u - y), T = d + I, u = T - d, Qt[2] = d - (T - u) + (I - u), Qt[3] = T;
  const F = ss(4, Ei, 4, Qt, Na);
  v = M * c, C = Zt * M, p = C - (C - M), m = M - p, C = Zt * c, l = C - (C - c), h = c - l, f = m * h - (v - p * l - m * l - p * h), y = _ * g, C = Zt * _, p = C - (C - _), m = _ - p, C = Zt * g, l = C - (C - g), h = g - l, w = m * h - (y - p * l - m * l - p * h), I = f - w, u = f - I, Qt[0] = f - (I + u) + (u - w), d = v + I, u = d - v, E = v - (d - u) + (I - u), I = E - y, u = E - I, Qt[1] = E - (I + u) + (u - y), T = d + I, u = T - d, Qt[2] = d - (T - u) + (I - u), Qt[3] = T;
  const j = ss(F, Na, 4, Qt, Fa);
  v = a * c, C = Zt * a, p = C - (C - a), m = a - p, C = Zt * c, l = C - (C - c), h = c - l, f = m * h - (v - p * l - m * l - p * h), y = A * g, C = Zt * A, p = C - (C - A), m = A - p, C = Zt * g, l = C - (C - g), h = g - l, w = m * h - (y - p * l - m * l - p * h), I = f - w, u = f - I, Qt[0] = f - (I + u) + (u - w), d = v + I, u = d - v, E = v - (d - u) + (I - u), I = E - y, u = E - I, Qt[1] = E - (I + u) + (u - y), T = d + I, u = T - d, Qt[2] = d - (T - u) + (I - u), Qt[3] = T;
  const R = ss(j, Fa, 4, Qt, ja);
  return ja[R - 1];
}
function Sh(i, t, e, n, r, s) {
  const o = (t - s) * (e - r), a = (i - r) * (n - s), A = o - a, g = Math.abs(o + a);
  return Math.abs(A) >= xh * g ? A : -_h(i, t, e, n, r, s, g);
}
function Rh(i, t) {
  var e, n, r = 0, s, o, a, A, g, c, u, C = i[0], p = i[1], m = t.length;
  for (e = 0; e < m; e++) {
    n = 0;
    var l = t[e], h = l.length - 1;
    if (c = l[0], c[0] !== l[h][0] && c[1] !== l[h][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (o = c[0] - C, a = c[1] - p, n; n < h; n++) {
      if (u = l[n + 1], A = u[0] - C, g = u[1] - p, a === 0 && g === 0) {
        if (A <= 0 && o >= 0 || o <= 0 && A >= 0)
          return 0;
      } else if (g >= 0 && a <= 0 || g <= 0 && a >= 0) {
        if (s = Sh(o, A, a, g, 0, 0), s === 0)
          return 0;
        (s > 0 && g > 0 && a <= 0 || s < 0 && g <= 0 && a > 0) && r++;
      }
      c = u, a = g, o = A;
    }
  }
  return r % 2 !== 0;
}
function kh(i, t, e = {}) {
  if (!i)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = vh(i), r = wh(t), s = r.type, o = t.bbox;
  let a = r.coordinates;
  if (o && Ph(n, o) === !1)
    return !1;
  s === "Polygon" && (a = [a]);
  for (var A = 0; A < a.length; ++A) {
    const g = Rh(n, a[A]);
    if (g === 0 && !e.ignoreBoundary) return !0;
    if (g) return !0;
  }
  return !1;
}
function Ph(i, t) {
  return t[0] <= i[0] && t[1] <= i[1] && t[2] >= i[0] && t[3] >= i[1];
}
class Eg {
  constructor(t = [], e = Oh) {
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
      let o = (t << 1) + 1, a = e[o];
      const A = o + 1;
      if (A < this.length && n(e[A], a) < 0 && (o = A, a = e[A]), n(a, s) >= 0) break;
      e[t] = a, t = o;
    }
    e[t] = s;
  }
}
function Oh(i, t) {
  return i < t ? -1 : i > t ? 1 : 0;
}
const Fe = 11102230246251565e-32, Wt = 134217729, Lh = (3 + 8 * Fe) * Fe;
function os(i, t, e, n, r) {
  let s, o, a, A, g = t[0], c = n[0], u = 0, C = 0;
  c > g == c > -g ? (s = g, g = t[++u]) : (s = c, c = n[++C]);
  let p = 0;
  if (u < i && C < e)
    for (c > g == c > -g ? (o = g + s, a = s - (o - g), g = t[++u]) : (o = c + s, a = s - (o - c), c = n[++C]), s = o, a !== 0 && (r[p++] = a); u < i && C < e; )
      c > g == c > -g ? (o = s + g, A = o - s, a = s - (o - A) + (g - A), g = t[++u]) : (o = s + c, A = o - s, a = s - (o - A) + (c - A), c = n[++C]), s = o, a !== 0 && (r[p++] = a);
  for (; u < i; )
    o = s + g, A = o - s, a = s - (o - A) + (g - A), g = t[++u], s = o, a !== 0 && (r[p++] = a);
  for (; C < e; )
    o = s + c, A = o - s, a = s - (o - A) + (c - A), c = n[++C], s = o, a !== 0 && (r[p++] = a);
  return (s !== 0 || p === 0) && (r[p++] = s), p;
}
function Dh(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function _n(i) {
  return new Float64Array(i);
}
const Bh = (3 + 16 * Fe) * Fe, Nh = (2 + 12 * Fe) * Fe, Fh = (9 + 64 * Fe) * Fe * Fe, xi = _n(4), Ga = _n(8), za = _n(12), Xa = _n(16), Kt = _n(4);
function jh(i, t, e, n, r, s, o) {
  let a, A, g, c, u, C, p, m, l, h, I, d, E, v, f, y, w, T;
  const M = i - r, x = e - r, _ = t - s, S = n - s;
  v = M * S, C = Wt * M, p = C - (C - M), m = M - p, C = Wt * S, l = C - (C - S), h = S - l, f = m * h - (v - p * l - m * l - p * h), y = _ * x, C = Wt * _, p = C - (C - _), m = _ - p, C = Wt * x, l = C - (C - x), h = x - l, w = m * h - (y - p * l - m * l - p * h), I = f - w, u = f - I, xi[0] = f - (I + u) + (u - w), d = v + I, u = d - v, E = v - (d - u) + (I - u), I = E - y, u = E - I, xi[1] = E - (I + u) + (u - y), T = d + I, u = T - d, xi[2] = d - (T - u) + (I - u), xi[3] = T;
  let L = Dh(4, xi), D = Nh * o;
  if (L >= D || -L >= D || (u = i - M, a = i - (M + u) + (u - r), u = e - x, g = e - (x + u) + (u - r), u = t - _, A = t - (_ + u) + (u - s), u = n - S, c = n - (S + u) + (u - s), a === 0 && A === 0 && g === 0 && c === 0) || (D = Fh * o + Lh * Math.abs(L), L += M * c + S * a - (_ * g + x * A), L >= D || -L >= D)) return L;
  v = a * S, C = Wt * a, p = C - (C - a), m = a - p, C = Wt * S, l = C - (C - S), h = S - l, f = m * h - (v - p * l - m * l - p * h), y = A * x, C = Wt * A, p = C - (C - A), m = A - p, C = Wt * x, l = C - (C - x), h = x - l, w = m * h - (y - p * l - m * l - p * h), I = f - w, u = f - I, Kt[0] = f - (I + u) + (u - w), d = v + I, u = d - v, E = v - (d - u) + (I - u), I = E - y, u = E - I, Kt[1] = E - (I + u) + (u - y), T = d + I, u = T - d, Kt[2] = d - (T - u) + (I - u), Kt[3] = T;
  const F = os(4, xi, 4, Kt, Ga);
  v = M * c, C = Wt * M, p = C - (C - M), m = M - p, C = Wt * c, l = C - (C - c), h = c - l, f = m * h - (v - p * l - m * l - p * h), y = _ * g, C = Wt * _, p = C - (C - _), m = _ - p, C = Wt * g, l = C - (C - g), h = g - l, w = m * h - (y - p * l - m * l - p * h), I = f - w, u = f - I, Kt[0] = f - (I + u) + (u - w), d = v + I, u = d - v, E = v - (d - u) + (I - u), I = E - y, u = E - I, Kt[1] = E - (I + u) + (u - y), T = d + I, u = T - d, Kt[2] = d - (T - u) + (I - u), Kt[3] = T;
  const j = os(F, Ga, 4, Kt, za);
  v = a * c, C = Wt * a, p = C - (C - a), m = a - p, C = Wt * c, l = C - (C - c), h = c - l, f = m * h - (v - p * l - m * l - p * h), y = A * g, C = Wt * A, p = C - (C - A), m = A - p, C = Wt * g, l = C - (C - g), h = g - l, w = m * h - (y - p * l - m * l - p * h), I = f - w, u = f - I, Kt[0] = f - (I + u) + (u - w), d = v + I, u = d - v, E = v - (d - u) + (I - u), I = E - y, u = E - I, Kt[1] = E - (I + u) + (u - y), T = d + I, u = T - d, Kt[2] = d - (T - u) + (I - u), Kt[3] = T;
  const R = os(j, za, 4, Kt, Xa);
  return Xa[R - 1];
}
function Ua(i, t, e, n, r, s) {
  const o = (t - s) * (e - r), a = (i - r) * (n - s), A = o - a;
  if (o === 0 || a === 0 || o > 0 != a > 0) return A;
  const g = Math.abs(o + a);
  return Math.abs(A) >= Bh * g ? A : -jh(i, t, e, n, r, s, g);
}
function Gh(i, t) {
  const e = new Eg([], xg);
  return Xh(i, e), Zh(e, t);
}
function xg(i, t) {
  return i.p.x > t.p.x ? 1 : i.p.x < t.p.x || i.p.x === t.p.x && (i.featureId !== t.featureId || i.ringId !== t.ringId) && i.isLeftEndpoint && !t.isLeftEndpoint ? -1 : i.p.y !== t.p.y ? i.p.y > t.p.y ? 1 : -1 : 1;
}
function zh(i, t) {
  return i.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : i.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : i.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? i.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
function Xh(i, t) {
  {
    const e = i.features;
    for (let n = 0; n < e.length; n++)
      Uh(e[n], t);
  }
}
var Wn = 0, Vn = 0, Yn = 0;
function Uh(i, t) {
  const e = i.type === "Feature" ? i.geometry : i;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let r = 0; r < n.length; r++)
    for (let s = 0; s < n[r].length; s++) {
      let o = n[r][s][0], a = null;
      Vn = Vn + 1;
      for (let A = 0; A < n[r][s].length - 1; A++) {
        a = n[r][s][A + 1];
        const g = new Za(o, Wn, Vn, Yn), c = new Za(a, Wn, Vn, Yn + 1);
        g.otherEvent = c, c.otherEvent = g, xg(g, c) > 0 ? (c.isLeftEndpoint = !0, g.isLeftEndpoint = !1) : (g.isLeftEndpoint = !0, c.isLeftEndpoint = !1), t.push(g), t.push(c), o = a, Yn = Yn + 1;
      }
    }
  Wn = Wn + 1;
}
var Za = class {
  constructor(t, e, n, r) {
    this.p = {
      x: t[0],
      y: t[1]
    }, this.featureId = e, this.ringId = n, this.eventId = r, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(t) {
    return this.p.x === t.p.x && this.p.y === t.p.y;
  }
  asNewXY() {
    return [this.p.x, this.p.y];
  }
};
function Zh(i, t = !1) {
  const e = [], n = new Eg([], zh);
  for (; i.length; ) {
    const r = i.pop();
    if (r.isLeftEndpoint) {
      const s = new Wh(r);
      for (let o = 0; o < n.data.length; o++) {
        const a = n.data[o];
        if (t && a.leftSweepEvent.featureId === r.featureId)
          continue;
        const A = Vh(s, a);
        A !== !1 && e.push(A);
      }
      n.push(s);
    } else r.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
var Wh = class {
  /** @param event must have otherEvent non-null */
  constructor(i) {
    this.leftSweepEvent = i, this.rightSweepEvent = i.otherEvent;
  }
};
function Vh(i, t) {
  if (i === null || t === null) return !1;
  const e = i.leftSweepEvent.p.x, n = i.leftSweepEvent.p.y, r = i.rightSweepEvent.p.x, s = i.rightSweepEvent.p.y, o = t.leftSweepEvent.p.x, a = t.leftSweepEvent.p.y, A = t.rightSweepEvent.p.x, g = t.rightSweepEvent.p.y, c = Ua(e, n, r, s, o, a), u = Ua(e, n, r, s, A, g);
  if (c > 0 && u > 0) return !1;
  if (c < 0 && u < 0) return !1;
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
  const C = (g - a) * (r - e) - (A - o) * (s - n), p = (A - o) * (n - a) - (g - a) * (e - o), m = (r - e) * (n - a) - (s - n) * (e - o);
  if (C === 0)
    return !1;
  const l = p / C, h = m / C;
  if (l >= 0 && l <= 1 && h >= 0 && h <= 1) {
    const I = e + l * (r - e), d = n + l * (s - n);
    return [I, d];
  }
  return !1;
}
function Yh(i, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: r = !0 } = e;
  let s = [];
  i.type === "FeatureCollection" ? s = s.concat(i.features) : i.type === "Feature" ? s.push(i) : (i.type === "LineString" || i.type === "Polygon" || i.type === "MultiLineString" || i.type === "MultiPolygon") && s.push(yn(i)), t.type === "FeatureCollection" ? s = s.concat(t.features) : t.type === "Feature" ? s.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && s.push(yn(t));
  const o = Gh(
    Da(s),
    r
  );
  let a = [];
  if (n) {
    const A = {};
    o.forEach((g) => {
      const c = g.join(",");
      A[c] || (A[c] = !0, a.push(g));
    });
  } else
    a = o;
  return Da(a.map((A) => vg(A)));
}
function Hh(i, t = {}) {
  let e = 0, n = 0, r = 0;
  return bg(
    i,
    function(s) {
      e += s[0], n += s[1], r++;
    }
  ), vg([e / r, n / r], t.properties);
}
const nr = "maplat-ui", Qh = [
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
], Kh = [
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
  ...Qh.filter((i) => i.startup).map((i) => i.prop),
  ...Kh.filter((i) => i.startup).map((i) => i.prop)
];
const Wa = (i) => typeof i == "string" || !!i && typeof i == "object" && Object.values(i).every((t) => typeof t == "string");
function Jh(i) {
  const t = i;
  return !t || typeof t != "object" || Array.isArray(t) || Array.isArray(t.label) || Array.isArray(t.value) ? !1 : (t.from === "manifest" || t.from === "canvas") && Wa(t.label) && Wa(t.value);
}
const qh = "hidden";
function as(i) {
  return typeof i == "object" && i !== null && !Array.isArray(i);
}
function Tg(i, t) {
  if (!as(i)) return;
  const e = {};
  if (typeof i.manifest == "string" && (e.manifest = i.manifest), typeof i.canvas == "string" && (e.canvas = i.canvas), typeof i.image == "string" && (e.image = i.image), typeof i.copiedAt == "string" && (e.copiedAt = i.copiedAt), as(i.bindings) && (e.bindings = i.bindings), as(i.copiedValues) && (e.copiedValues = i.copiedValues), Array.isArray(i.copiedMetadata)) {
    const n = i.copiedMetadata.filter(Jh), r = i.copiedMetadata.length - n.length;
    r > 0 && t !== void 0 && console.warn(
      `Maplat: ignored ${r} malformed entries in iiif.copiedMetadata (mapID: "${t}").`
    ), e.copiedMetadata = n;
  }
  return e;
}
function Mg(i) {
  return i === "all" || i === "hidden" ? i : void 0;
}
function $h(i, t) {
  const e = Tg(i);
  if (!e) return;
  const n = {
    display: Mg(t) ?? qh
  };
  return e.manifest !== void 0 && (n.manifest = e.manifest), e.canvas !== void 0 && (n.canvas = e.canvas), e.image !== void 0 && (n.image = e.image), e.copiedAt !== void 0 && (n.copiedAt = e.copiedAt), e.copiedMetadata !== void 0 && (n.metadata = e.copiedMetadata), n;
}
function _g(i) {
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
    /** 地図データの iiif 節（IIIF の書誌の写し） */
    iiif;
    /** アプリの設定で選んだ、書誌の表の出し方 */
    iiifMetadataDisplay;
    static isBasemap_ = !1;
    static isWmts_ = !0;
    static isMapbox_ = !1;
    static isMapLibre_ = !1;
    initialize(n) {
      if (n = xe(n), this.mapID = n.mapID, this.homePosition = n.homePosition, this.mercZoom = n.mercZoom, this.label = n.label, this.maxZoom = n.maxZoom, this.minZoom = n.minZoom, this.poiTemplate = n.poiTemplate, this.poiStyle = n.poiStyle, this.iconTemplate = n.iconTemplate, this.icon = n.icon, this.selectedIcon = n.selectedIcon, this.mercatorXShift = n.mercatorXShift, this.mercatorYShift = n.mercatorYShift, this.weiwudi = n.weiwudi, this.iiif = Tg(n.iiif, this.mapID), this.iiifMetadataDisplay = Mg(n.iiifMetadata), n.envelopeLngLats) {
        const a = n.envelopeLngLats.map(
          (A) => ne(A, "EPSG:4326", "EPSG:3857")
        );
        a.push(a[0]), this.envelope = wg([a]), this.centroid = Hh(this.envelope).geometry?.coordinates;
      }
      for (let o = 0; o < Cn.length; o++) {
        const a = Cn[o], A = Qc[o];
        this.set(a, n[A] || n[a]);
      }
      const r = n.thumbnail ? new Promise((o) => {
        this.thumbnail = n.thumbnail, o(void 0);
      }) : new Promise((o) => {
        this.thumbnail = `./tmbs/${n.mapID}.jpg`, fetch(this.thumbnail).then((a) => {
          a.ok || (this.thumbnail = `./tmbs/${n.mapID}_menu.jpg`), o(void 0);
        }).catch((a) => {
          this.thumbnail = `./tmbs/${n.mapID}_menu.jpg`, o(void 0);
        });
      }).catch((o) => {
        this.thumbnail = `./tmbs/${n.mapID || n.sourceID}_menu.jpg`;
      }), s = this.resolvePois(n.pois);
      this.initialWait = Promise.all([s, r]), eI(this);
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
      const o = n.mercZoom, a = n.zoom, A = n.direction, g = n.rotation, c = this.getMap(), u = c?.getView(), C = c ? c.getSize() : void 0;
      u && (!C || C[0] <= 0 || C[1] <= 0) || (n.latitude !== void 0 && n.longitude !== void 0 && (r = ne(
        [n.longitude, n.latitude],
        "EPSG:4326",
        "EPSG:3857"
      )), n.x !== void 0 && n.y != null && (s = [n.x, n.y]), this.viewpoint2MercsAsync().then((p) => this.mercs2MercViewpoint(p)).then((p) => {
        const m = this.mercViewpoint2Mercs([
          r || p[0],
          o || p[1] || 17,
          A ?? g ?? p[2]
        ]);
        this.mercs2ViewpointAsync(m).then((l) => {
          r != null ? u?.setCenter(l[0]) : s != null && u?.setCenter(s), o != null ? u?.setZoom(l[1]) : a != null && u?.setZoom(a), A != null ? u?.setRotation(l[2]) : g != null && u?.setRotation(g);
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
    setGPSMarkerAsync(n, r = !1) {
      const s = this.getMap(), o = s?.getView();
      if (!n)
        return new Promise((A, g) => {
          s?.setGPSPosition(null), A(!0);
        });
      const a = this.mercsFromGPSValue(n.lnglat, n.acc);
      return this.mercs2SysCoordsAsync_multiLayer([a]).then((A) => {
        const g = !A[0], c = g ? A[1] : A[0];
        if (!c || !this.insideCheckSysCoord(c[0][0]))
          return s?.setGPSPosition(null), !1;
        const u = g ? null : A[1], C = { xy: c[0][0] }, p = c[0].slice(1);
        return C.rad = p.reduce(
          (m, l, h) => {
            const I = m + Math.sqrt(
              Math.pow(l[0] - C.xy[0], 2) + Math.pow(l[1] - C.xy[1], 2)
            );
            return h === 3 ? I / 4 : I;
          },
          0
        ), r || o?.setCenter(C.xy), s?.setGPSPosition(C, g ? "hide" : null), u && s?.setGPSPosition({ xy: u[0][0] }, "sub"), !0;
      }).catch((A) => {
        throw A;
      });
    }
    setGPSMarker(n, r = !1) {
      this.setGPSMarkerAsync(n, r).then(() => {
      });
    }
    mercsFromGPSValue(n, r) {
      const s = ne(n, "EPSG:4326", "EPSG:3857"), o = n[1] * Math.PI / 180, a = r / Math.cos(o);
      return ug.map((A) => [
        A[0] * a + s[0],
        A[1] * a + s[1]
      ]);
    }
    // 与えられた差分行列を回転。theta無指定の場合は自動取得
    rotateMatrix(n, r) {
      return r === void 0 && (r = this.getMap().getView().getRotation()), hg(n, r);
    }
    async resolvePois(n) {
      this.pois = await yg(n || [], {
        name: this.officialTitle || this.title,
        namespace: this.mapID
      });
    }
    getPoi(n) {
      let r;
      return Object.keys(this.pois).map((s) => {
        this.pois[s].pois.map((o, a) => {
          o.id === n && (r = this.pois[s].pois[a]);
        });
      }), r;
    }
    addPoi(n, r) {
      r || (r = "main");
      const s = xt(this.pois, r);
      if (s)
        return n = mn(n), s.pois.push(n), Eo(this.pois, r, {
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
      if (n || (n = "main"), n === "all")
        Object.keys(this.pois).map((r) => {
          this.pois[r].pois = [];
        });
      else {
        const r = xt(this.pois, n);
        r && (r.pois = []);
      }
    }
    listPoiLayers(n = !1, r = !1) {
      return Object.keys(this.pois).sort((s, o) => s === "main" ? -1 : o === "main" ? 1 : 0).map((s) => this.pois[s]).filter(
        (s) => r ? n ? s.pois.length && s.hide : s.pois.length : n ? s.hide : !0
      );
    }
    getPoiLayer(n) {
      return xt(this.pois, n);
    }
    addPoiLayer(n, r) {
      n !== "main" && (this.pois[n] || (this.pois[n] = Ye(r || [], n, {
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
      return r === void 0 && (r = this.getMap().getView().getDecimalZoom()), vo(n, r);
    }
    // 画面サイズと地図ズームから、地図面座標上での5座標を取得する。zoom, rotate無指定の場合は自動取得
    viewpoint2SysCoords(n, r) {
      return this.mercViewpoint2Mercs(n, r);
    }
    mercViewpoint2Mercs(n, r) {
      let s = n ? n[0] : void 0;
      const o = n ? n[1] : void 0, a = n ? n[2] : void 0;
      s === void 0 && (s = this.getMap().getView().getCenter()), r === void 0 && (r = this.getMap().getSize());
      const A = o ?? this.getMap().getView().getDecimalZoom(), g = a ?? this.getMap().getView().getRotation();
      return [Gs(
        s,
        A,
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
      const s = zs(
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
function Sg(i) {
  class t extends _g(i) {
    static isBasemap_ = !0;
    static isWmts_ = !0;
    insideCheckXy(n) {
      return this.envelope ? kh(n, this.envelope) : !0;
    }
    insideCheckSysCoord(n) {
      return this.insideCheckXy(n);
    }
    modulateXyInside(n) {
      if (!this.centroid) return n;
      const r = yh([n, this.centroid]), s = Yh(this.envelope, r);
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
function tI(i) {
  class t extends _g(i) {
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
      const r = n[0] * (2 * mt) / this._maxxy - mt, s = -1 * (n[1] * (2 * mt) / this._maxxy - mt);
      return [r, s];
    }
    sysCoord2Xy(n) {
      const r = (n[0] + mt) * this._maxxy / (2 * mt), s = (-n[1] + mt) * this._maxxy / (2 * mt);
      return [r, s];
    }
    defZoom(n) {
      const r = n[0], s = n[1], o = Math.log2((r - 10) / this.width), a = Math.log2((s - 10) / this.height), A = this.maxZoom;
      let g;
      return a > o ? g = a : g = o, A + g;
    }
  }
  return t;
}
const Us = (i) => (i || "").match(/^(?:google(?:_(?:roadmap|satellite|hybrid|terrain))?|mapbox|maplibre)$/);
function Rg(i) {
  return i = xe(i), i.imageExtension || (i.imageExtension = "jpg"), Us(i.maptype) ? (delete i.url, delete i.urls) : i.mapID && !i.url && !i.urls && (i.url = i.tms ? `tiles/${i.mapID}/{z}/{x}/{-y}.${i.imageExtension}` : `tiles/${i.mapID}/{z}/{x}/{y}.${i.imageExtension}`), i;
}
function eI(i) {
  const t = i;
  i.setTileLoadFunction(
    (function() {
      const e = t.getTileLoadFunction(), n = [1e3, 2e3, 4e3], r = /* @__PURE__ */ new WeakMap();
      let s = !1;
      const o = function(A, g) {
        s || (s = !0, console.warn(
          "Maplat: tile composition failed by an exception; retrying (up to 3 times)",
          g
        ));
        const c = r.get(A) ?? 0;
        c >= n.length || (r.set(A, c + 1), setTimeout(() => {
          const u = t.getMap?.()?.getTargetElement?.();
          u && !u.isConnected || A.getState?.() === ht.ERROR && A.load();
        }, n[c]));
      }, a = function(A, g, c, u, C, p, m) {
        return new Promise((l, h) => {
          const I = function(d, E = void 0) {
            const v = document.createElement("img");
            v.crossOrigin = "Anonymous", v.onload = v.onerror = function() {
              try {
                if (v.width && v.height) {
                  const f = c.getContext("2d"), y = u === 0 ? 256 - p : 0, w = C === 0 ? 256 - m : 0;
                  p = u + p > v.width ? v.width - u : p, m = C + m > v.height ? v.height - C : m, f.drawImage(v, u, C, p, m, y, w, p, m), l(void 0);
                } else
                  E ? I(E) : l("tileLoadError");
              } catch {
                l("tileException");
              }
            }, v.src = d;
          };
          I(g);
        });
      };
      return function(A, g) {
        const c = A.tileCoord[0];
        let u = A.tileCoord[1], C = A.tileCoord[2], p = Math.round(
          (t.mercatorXShift || 0) * 128 * Math.pow(2, c) / mt
        ), m = Math.round(
          (t.mercatorYShift || 0) * -128 * Math.pow(2, c) / mt
        );
        for (; p < 0 || p >= 256; )
          p < 0 ? (p = p + 256, u++) : (p = p - 256, u--);
        for (; m < 0 || m >= 256; )
          m < 0 ? (m = m + 256, C++) : (m = m - 256, C--);
        const l = document.createElement("div");
        l.innerHTML = dh;
        const h = l.childNodes[0], I = [
          [[c, u, C], 0, 0, 256 - p, 256 - m]
        ];
        p !== 0 && I.push([
          [c, u - 1, C],
          256 - p,
          0,
          p,
          256 - m
        ]), m !== 0 && (I.push([
          [c, u, C - 1],
          0,
          256 - m,
          256 - p,
          m
        ]), p !== 0 && I.push([
          [c, u - 1, C - 1],
          256 - p,
          256 - m,
          p,
          m
        ])), Promise.all(
          I.map((d) => {
            const E = t.tileUrlFunction(
              d[0],
              t.tilePixelRatio_,
              t.projection_
            );
            return a(
              d[0],
              E,
              h,
              d[1],
              d[2],
              d[3],
              d[4]
            );
          })
        ).then((d) => {
          if (d.reduce((v, f) => v && f, !0))
            A.handleImageError_(), d.includes("tileException") && o(A);
          else {
            const v = h.toDataURL(), f = A.getImage();
            f.crossOrigin = null, e(A, v), r.delete(A);
          }
        }).catch((d) => {
          A.handleImageError_(), o(A, d);
        });
      };
    })()
  );
}
class Yi extends Sg(zA) {
  constructor(t = {}) {
    const e = Rg(t);
    if (super(e), t.mapID && (this.mapID = t.mapID), t.mapID === "morioka_ndl_affine") {
      const n = this.getTileUrlFunction();
      this.setTileUrlFunction((r, s, o) => n(r, s, o));
    }
    this.initialize(t);
  }
}
class Cr extends Yi {
  style = "";
  accessToken = "";
  mapboxMap;
  static isMapbox_ = !0;
  constructor(t = {}) {
    super(t), this.style = t.style, this.mapboxMap = t.mapboxMap, this.accessToken = t.accessToken;
  }
}
class fr extends Yi {
  style = "";
  maplibreMap;
  static isMapLibre_ = !0;
  constructor(t = {}) {
    super(t), this.style = t.style || "https://tile.openstreetmap.jp/styles/osm-bright/style.json", this.maplibreMap = t.maplibreMap;
  }
}
function iI(i, t) {
  const n = i ? {
    google_roadmap: { mapType: "roadmap", derivedLayers: [] },
    google_satellite: { mapType: "satellite", derivedLayers: [] },
    google_hybrid: { mapType: "satellite", derivedLayers: ["layerRoadmap"] },
    google_terrain: { mapType: "terrain", derivedLayers: ["layerRoadmap"] }
  }[i] : void 0, r = n?.mapType ?? "roadmap", s = n?.derivedLayers ?? [], o = (t || []).map(
    (A) => `layer${A.charAt(0).toUpperCase()}${A.slice(1).toLowerCase()}`
  ), a = new Set(s);
  for (const A of o) a.add(A);
  return { mapType: r, layerTypes: [...a] };
}
class Zs extends Sg(Vc) {
  /**
   * Map Tiles API の mapType（roadmap・satellite・terrain）。出典の表示（src/attribution.ts）が、
   * Google の地図かどうかと、Google Maps のロゴの種類（衛星は白い字）を決めるのに読む。
   */
  googleMapType;
  constructor(t = {}) {
    const e = Object.assign({}, t), { mapType: n, layerTypes: r } = iI(t.maptype, t.layers);
    e.mapType = n, e.layerTypes = r, super(e), this.googleMapType = n, t.mapID && (this.mapID = t.mapID), this.initialize(t);
  }
}
const Ue = {
  ANIMATING: 0,
  INTERACTING: 1
}, de = {
  CENTER: "center",
  RESOLUTION: "resolution",
  ROTATION: "rotation"
};
function Va(i, t, e) {
  return (
    /**
     * @param {import("./coordinate.js").Coordinate|undefined} center Center.
     * @param {number|undefined} resolution Resolution.
     * @param {import("./size.js").Size} size Viewport size; unused if `onlyCenter` was specified.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @param {Array<number>} [centerShift] Shift between map center and viewport center.
     * @return {import("./coordinate.js").Coordinate|undefined} Center.
     */
    (function(n, r, s, o, a) {
      if (!n)
        return;
      if (!r && !t)
        return n;
      const A = t ? 0 : s[0] * (r ?? 0), g = t ? 0 : s[1] * (r ?? 0), c = a ? a[0] : 0, u = a ? a[1] : 0;
      let C = i[0] + A / 2 + c, p = i[2] - A / 2 + c, m = i[1] + g / 2 + u, l = i[3] - g / 2 + u;
      C > p && (C = (p + C) / 2, p = C), m > l && (m = (l + m) / 2, l = m);
      let h = re(n[0], C, p), I = re(n[1], m, l);
      if (o && e && r) {
        const d = 30 * r;
        h += -d * Math.log(1 + Math.max(0, C - n[0]) / d) + d * Math.log(1 + Math.max(0, n[0] - p) / d), I += -d * Math.log(1 + Math.max(0, m - n[1]) / d) + d * Math.log(1 + Math.max(0, n[1] - l) / d);
      }
      return [h, I];
    })
  );
}
function nI(i) {
  return i;
}
function kg(i) {
  return Math.pow(i, 3);
}
function Pr(i) {
  return 1 - kg(1 - i);
}
function rI(i) {
  return 3 * i * i - 2 * i * i * i;
}
function sI(i) {
  return i;
}
function xo(i, t, e, n) {
  const r = _t(t) / e[0], s = pe(t) / e[1];
  return n ? Math.min(i, Math.max(r, s)) : Math.min(i, Math.min(r, s));
}
function To(i, t, e) {
  let n = Math.min(i, t);
  const r = 50;
  return n *= Math.log(1 + r * Math.max(0, i / t - 1)) / r + 1, e && (n = Math.max(n, e), n /= Math.log(1 + r * Math.max(0, e / i - 1)) / r + 1), re(n, e / 2, t * 2);
}
function oI(i, t, e, n) {
  return t = t !== void 0 ? t : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(r, s, o, a) {
    if (r !== void 0) {
      const A = i[0], g = i[i.length - 1], c = e ? xo(
        A,
        e,
        o,
        !!n
      ) : A;
      if (a)
        return t ? To(
          r,
          c,
          g
        ) : re(r, g, c);
      const u = Math.min(c, r), C = Math.floor(eo(i, u, s));
      return i[C] > c && C < i.length - 1 ? i[C + 1] : i[C];
    }
  });
}
function aI(i, t, e, n, r, s) {
  return n = n !== void 0 ? n : !0, e = e !== void 0 ? e : 0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(o, a, A, g) {
    if (o !== void 0) {
      const c = r ? xo(
        t,
        r,
        A,
        !!s
      ) : t;
      if (g)
        return n ? To(
          o,
          c,
          e
        ) : re(o, e, c);
      const u = 1e-9, C = Math.ceil(
        Math.log(t / c) / Math.log(i) - u
      ), p = -a * (0.5 - u) + 0.5, m = Math.min(c, o), l = Math.floor(
        Math.log(t / m) / Math.log(i) + p
      ), h = Math.max(C, l), I = t / Math.pow(i, h);
      return re(I, e, c);
    }
  });
}
function Ya(i, t, e, n, r) {
  return e = e !== void 0 ? e : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(s, o, a, A) {
    if (s !== void 0) {
      const g = n ? xo(
        i,
        n,
        a,
        !!r
      ) : i;
      return !e || !A ? re(s, t, g) : To(
        s,
        g,
        t
      );
    }
  });
}
function Mo(i) {
  if (i !== void 0)
    return 0;
}
function Ha(i) {
  if (i !== void 0)
    return i;
}
function AI(i) {
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
function gI(i) {
  const t = De(5);
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
const cI = 42, dr = 256, As = 0;
class Qa extends hi {
  /**
   * @param {ViewOptions} [options] View options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = Object.assign({}, t), this.hints_ = [0, 0], this.animations_ = [], this.updateAnimationKey_, this.projection_ = Io(t.projection, "EPSG:3857"), this.viewportSize_ = [100, 100], this.targetCenter_ = null, this.targetResolution_, this.targetRotation_, this.nextCenter_ = null, this.nextResolution_, this.nextRotation_, this.cancelAnchor_ = void 0, t.projection && Kl(), t.center && (t.center = Xe(
      t.center,
      /** @type {import("./proj.js").ProjectionLike} */
      this.projection_
    )), t.extent && (t.extent = Un(
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
    for (const a in de)
      delete e[a];
    this.setProperties(e, !0);
    const n = uI(t);
    this.maxResolution_ = n.maxResolution, this.minResolution_ = n.minResolution, this.zoomFactor_ = n.zoomFactor, this.resolutions_ = t.resolutions, this.padding_ = t.padding, this.minZoom_ = n.minZoom;
    const r = lI(t), s = n.constraint, o = hI(t);
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
      ), o = s / 2 * (r[3] - e[3] + e[1] - r[1]), a = s / 2 * (r[0] - e[0] + e[2] - r[2]);
      this.setCenterInternal([n[0] + o, n[1] - a]);
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
      r.center && (r = Object.assign({}, r), r.center = Xe(
        r.center,
        this.getProjection()
      )), r.anchor && (r = Object.assign({}, r), r.anchor = Xe(
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
      const c = arguments[r];
      c.center && this.setCenterInternal(c.center), c.zoom !== void 0 ? this.setZoom(c.zoom) : c.resolution && this.setResolution(c.resolution), c.rotation !== void 0 && this.setRotation(c.rotation);
    }
    if (r === e) {
      n && Hn(n, !0);
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
          easing: c.easing || rI,
          callback: n
        }
      );
      if (c.center && (u.sourceCenter = o, u.targetCenter = c.center.slice(), o = u.targetCenter), c.zoom !== void 0 ? (u.sourceResolution = a, u.targetResolution = this.getResolutionForZoom(c.zoom), a = u.targetResolution) : c.resolution && (u.sourceResolution = a, u.targetResolution = c.resolution, a = u.targetResolution), c.rotation !== void 0) {
        u.sourceRotation = A;
        const C = Bi(c.rotation - A + Math.PI, 2 * Math.PI) - Math.PI;
        u.targetRotation = A + C, A = u.targetRotation;
      }
      II(u) ? u.complete = !0 : s += u.duration, g.push(u);
    }
    this.animations_.push(g), this.setHint(Ue.ANIMATING, 1), this.updateAnimations_();
  }
  /**
   * Determine if the view is being animated.
   * @return {boolean} The view is being animated.
   * @api
   */
  getAnimating() {
    return this.hints_[Ue.ANIMATING] > 0;
  }
  /**
   * Determine if the user is interacting with the view, such as panning or zooming.
   * @return {boolean} The view is being interacted with.
   * @api
   */
  getInteracting() {
    return this.hints_[Ue.INTERACTING] > 0;
  }
  /**
   * Cancel any ongoing animations.
   * @api
   */
  cancelAnimations() {
    this.setHint(Ue.ANIMATING, -this.hints_[Ue.ANIMATING]);
    let t;
    for (let e = 0, n = this.animations_.length; e < n; ++e) {
      const r = (
        /** @type {Array<Animation>} */
        this.animations_[e]
      );
      if (
        /** @type {Animation} */
        r[0].callback && Hn(
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
    let e = !1;
    for (let n = this.animations_.length - 1; n >= 0; --n) {
      const r = (
        /** @type {Array<Animation>} */
        this.animations_[n]
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
          const C = A.sourceCenter[0], p = A.sourceCenter[1], m = (
            /** @type {import("./coordinate.js").Coordinate} */
            A.targetCenter[0]
          ), l = (
            /** @type {import("./coordinate.js").Coordinate} */
            A.targetCenter[1]
          );
          this.nextCenter_ = /** @type {import("./coordinate.js").Coordinate} */
          A.targetCenter;
          const h = C + u * (m - C), I = p + u * (l - p);
          this.targetCenter_ = [h, I];
        }
        if (A.sourceResolution && A.targetResolution) {
          const C = u === 1 ? A.targetResolution : A.sourceResolution + u * (A.targetResolution - A.sourceResolution);
          if (A.anchor) {
            const p = this.getViewportSize_(this.getRotation()), m = (
              /** @type {Constraints} */
              this.constraints_.resolution(C, 0, p, !0)
            );
            this.targetCenter_ = this.calculateCenterZoom(
              /** @type {number} */
              m,
              /** @type {import("./coordinate.js").Coordinate} */
              A.anchor
            );
          }
          this.nextResolution_ = A.targetResolution, this.targetResolution_ = C, this.applyTargetState_(!0);
        }
        if (A.sourceRotation !== void 0 && A.targetRotation !== void 0) {
          const C = u === 1 ? Bi(A.targetRotation + Math.PI, 2 * Math.PI) - Math.PI : A.sourceRotation + u * (A.targetRotation - A.sourceRotation);
          if (A.anchor) {
            const p = (
              /** @type {Constraints} */
              this.constraints_.rotation(C, !0)
            );
            this.targetCenter_ = this.calculateCenterRotate(
              /** @type {number} */
              p,
              /** @type {import("./coordinate.js").Coordinate} */
              A.anchor
            );
          }
          this.nextRotation_ = A.targetRotation, this.targetRotation_ = C;
        }
        if (this.applyTargetState_(!0), e = !0, !A.complete)
          break;
      }
      if (s) {
        this.animations_[n] = null, this.setHint(Ue.ANIMATING, -1), this.nextCenter_ = null, this.nextResolution_ = NaN, this.nextRotation_ = NaN;
        const o = r[0].callback;
        o && Hn(o, !0);
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
    return r !== void 0 && (n = [r[0] - e[0], r[1] - e[1]], go(n, t - this.getRotation()), bl(n, e)), n;
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
      const o = e[0] - t * (e[0] - r[0]) / s, a = e[1] - t * (e[1] - r[1]) / s;
      n = [o, a];
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
    return t && da(t, this.getProjection());
  }
  /**
   * Get the view center without transforming to user projection.
   * @return {import("./coordinate.js").Coordinate|undefined} The center of the view.
   */
  getCenterInternal() {
    return (
      /** @type {import("./coordinate.js").Coordinate|undefined} */
      this.get(de.CENTER)
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
    return iu(e, this.getProjection());
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
    ae(e, "The view center is not defined");
    const n = (
      /** @type {!number} */
      this.getResolution()
    );
    ae(n !== void 0, "The view resolution is not defined");
    const r = (
      /** @type {!number} */
      this.getRotation()
    );
    return ae(r !== void 0, "The view rotation is not defined"), ll(e, n, r, t);
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
      this.get(de.RESOLUTION)
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
      Un(t, this.getProjection()),
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
    const n = _t(t) / e[0], r = pe(t) / e[1];
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
      this.get(de.ROTATION)
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
      r = gs(
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
      const s = eo(this.resolutions_, t, 1);
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
      const e = re(
        Math.floor(t),
        0,
        this.resolutions_.length - 2
      ), n = this.resolutions_[e] / this.resolutions_[e + 1];
      return this.resolutions_[e] / Math.pow(n, re(t - e, 0, 1));
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
    if (ae(
      Array.isArray(t) || typeof /** @type {?} */
      t.getSimplifiedGeometry == "function",
      "Invalid extent or geometry provided as `geometry`"
    ), Array.isArray(t)) {
      ae(
        !Tr(t),
        "Cannot fit empty extent provided as `geometry`"
      );
      const r = Un(t, this.getProjection());
      n = wa(r);
    } else if (t.getType() === "Circle") {
      const r = Un(
        t.getExtent(),
        this.getProjection()
      );
      n = wa(r), n.rotate(this.getRotation(), Ui(r));
    } else {
      const r = eu();
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
    let a = 1 / 0, A = 1 / 0, g = -1 / 0, c = -1 / 0;
    for (let u = 0, C = s.length; u < C; u += o) {
      const p = s[u] * n - s[u + 1] * r, m = s[u] * r + s[u + 1] * n;
      a = Math.min(a, p), A = Math.min(A, m), g = Math.max(g, p), c = Math.max(c, m);
    }
    return [a, A, g, c];
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
    const a = this.rotatedExtentForGeometry(t);
    let A = this.getResolutionForExtentInternal(a, [
      n[0] - r[1] - r[3],
      n[1] - r[0] - r[2]
    ]);
    A = isNaN(A) ? o : Math.max(A, o), A = /** @type {number} */
    this.getConstrainedResolution(A, s ? 0 : 1);
    const g = this.getRotation(), c = Math.sin(g), u = Math.cos(g), C = Ui(a);
    C[0] += (r[1] - r[3]) / 2 * A, C[1] += (r[0] - r[2]) / 2 * A;
    const p = C[0] * u - C[1] * c, m = C[1] * u + C[0] * c, l = this.getConstrainedCenter([p, m], A), h = e.callback ? e.callback : Ps;
    e.duration !== void 0 ? this.animateInternal(
      {
        resolution: A,
        center: l,
        duration: e.duration,
        easing: e.easing
      },
      h
    ) : (this.targetResolution_ = A, this.targetCenter_ = l, this.applyTargetState_(!1, !0), Hn(h, !0));
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
      Xe(t, this.getProjection()),
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
      gs(
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
      const a = this.getViewportSizeMinusPadding_(-n), A = gs(
        t,
        r,
        [a[0] / 2 + o[3], a[1] / 2 + o[0]],
        e,
        n
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
    const e = da(
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
    e = e && Xe(e, this.getProjection()), this.adjustResolutionInternal(t, e);
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
    e && (e = Xe(e, this.getProjection())), this.adjustRotationInternal(t, e);
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
      t && Xe(t, this.getProjection())
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
    ), a = (
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
    this.get(de.ROTATION) !== r && this.set(de.ROTATION, r), this.get(de.RESOLUTION) !== o && (this.set(de.RESOLUTION, o), this.set("zoom", this.getZoom(), !0)), (!a || !this.get(de.CENTER) || !gr(this.get(de.CENTER), a)) && this.set(de.CENTER, a), this.getAnimating() && !t && this.cancelAnimations(), this.cancelAnchor_ = void 0;
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
    n = n || (t === 0 ? this.cancelAnchor_ : void 0), this.cancelAnchor_ = void 0, (this.getResolution() !== a || this.getRotation() !== s || !this.getCenterInternal() || !gr(
      /** @type {import("./coordinate.js").Coordinate} */
      this.getCenterInternal(),
      /** @type {import("./coordinate.js").Coordinate} */
      A
    )) && (this.getAnimating() && this.cancelAnimations(), this.animateInternal({
      rotation: s,
      center: A,
      resolution: a,
      duration: t,
      easing: Pr,
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
    this.resolveConstraints(0), this.setHint(Ue.INTERACTING, 1);
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
    n = n && Xe(n, this.getProjection()), this.endInteractionInternal(t, e, n);
  }
  /**
   * Notify the View that an interaction has ended. The view state will be resolved
   * to a stable one if needed (depending on its constraints).
   * @param {number} [duration] Animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  endInteractionInternal(t, e, n) {
    this.getInteracting() && (this.setHint(Ue.INTERACTING, -1), this.resolveConstraints(t, e, n));
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
function Hn(i, t) {
  setTimeout(function() {
    i(t);
  }, 0);
}
function lI(i) {
  if (i.extent !== void 0) {
    const e = i.smoothExtentConstraint !== void 0 ? i.smoothExtentConstraint : !0;
    return Va(
      i.extent,
      /** @type {boolean} */
      i.constrainOnlyCenter,
      e
    );
  }
  const t = (
    /** @type {import("./proj/Projection.js").default} */
    Io(i.projection, "EPSG:3857")
  );
  if (i.multiWorld !== !0 && t.isGlobal()) {
    const e = t.getExtent().slice();
    return e[0] = -1 / 0, e[2] = 1 / 0, Va(e, !1, !1);
  }
  return nI;
}
function uI(i) {
  let t, e, n, o = i.minZoom !== void 0 ? i.minZoom : As, a = i.maxZoom !== void 0 ? i.maxZoom : 28;
  const A = i.zoomFactor !== void 0 ? i.zoomFactor : 2, g = i.multiWorld !== void 0 ? i.multiWorld : !1, c = i.smoothResolutionConstraint !== void 0 ? i.smoothResolutionConstraint : !0, u = i.showFullExtent !== void 0 ? i.showFullExtent : !1, C = (
    /** @type {import("./proj/Projection.js").default} */
    Io(i.projection, "EPSG:3857")
  ), p = C.getExtent();
  let m = i.constrainOnlyCenter, l = i.extent;
  if (!g && !l && C.isGlobal() && (m = !1, l = p), i.resolutions !== void 0) {
    const h = i.resolutions;
    e = h[o], n = h[a] !== void 0 ? h[a] : h[h.length - 1], i.constrainResolution ? t = oI(
      h,
      c,
      /** @type {import("./extent.js").Extent|undefined} */
      !m && l,
      u
    ) : t = Ya(
      e,
      n,
      c,
      /** @type {import("./extent.js").Extent|undefined} */
      !m && l,
      u
    );
  } else {
    const I = (p ? Math.max(_t(p), pe(p)) : (
      // use an extent that can fit the whole world if need be
      360 * /** @type {number} */
      co.degrees / /** @type {number} */
      C.getMetersPerUnit()
    )) / dr / Math.pow(2, As), d = I / Math.pow(2, 28 - As);
    e = i.maxResolution, e !== void 0 ? o = 0 : e = I / Math.pow(A, o), n = i.minResolution, n === void 0 && (i.maxZoom !== void 0 ? i.maxResolution !== void 0 ? n = e / Math.pow(A, a) : n = I / Math.pow(A, a) : n = d), a = o + Math.floor(
      Math.log(e / n) / Math.log(A)
    ), n = e / Math.pow(A, a - o), i.constrainResolution ? t = aI(
      A,
      e,
      n,
      c,
      /** @type {import("./extent.js").Extent|undefined} */
      !m && l,
      u
    ) : t = Ya(
      e,
      n,
      c,
      /** @type {import("./extent.js").Extent|undefined} */
      !m && l,
      u
    );
  }
  return {
    constraint: t,
    maxResolution: e,
    minResolution: n,
    minZoom: o,
    zoomFactor: A
  };
}
function hI(i) {
  if (i.enableRotation !== void 0 ? i.enableRotation : !0) {
    const e = i.constrainRotation;
    return e === void 0 || e === !0 ? gI() : e === !1 ? Ha : typeof e == "number" ? AI(e) : Ha;
  }
  return Mo;
}
function II(i) {
  return !(i.sourceCenter && i.targetCenter && !gr(i.sourceCenter, i.targetCenter) || i.sourceResolution !== i.targetResolution || i.sourceRotation !== i.targetRotation);
}
function gs(i, t, e, n, r) {
  const s = Math.cos(-r);
  let o = Math.sin(-r), a = i[0] * s - i[1] * o, A = i[1] * s + i[0] * o;
  a += (t[0] / 2 - e[0]) * n, A += (e[1] - t[1] / 2) * n, o = -o;
  const g = a * s - A * o, c = A * s + a * o;
  return [g, c];
}
const CI = {
  /**
   * Triggered before layers are composed.  When dispatched by the map, the event object will not have
   * a `context` set.  When dispatched by a layer, the event object will have a `context` set.  Only
   * WebGL layers currently dispatch this event.
   * @event module:ol/render/Event~RenderEvent#precompose
   * @api
   */
  PRECOMPOSE: "precompose"
}, pt = {
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
class fI extends hi {
  /**
   * @param {Options<NoInfer<Properties>>} options Layer options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, this.background_ = t.background;
    const e = Object.assign({}, t);
    typeof t.properties == "object" && (delete e.properties, Object.assign(e, t.properties)), e[pt.OPACITY] = t.opacity !== void 0 ? t.opacity : 1, ae(
      typeof e[pt.OPACITY] == "number",
      "Layer opacity must be a number"
    ), e[pt.VISIBLE] = t.visible !== void 0 ? t.visible : !0, e[pt.Z_INDEX] = t.zIndex, e[pt.MAX_RESOLUTION] = t.maxResolution !== void 0 ? t.maxResolution : 1 / 0, e[pt.MIN_RESOLUTION] = t.minResolution !== void 0 ? t.minResolution : 0, e[pt.MIN_ZOOM] = t.minZoom !== void 0 ? t.minZoom : -1 / 0, e[pt.MAX_ZOOM] = t.maxZoom !== void 0 ? t.maxZoom : 1 / 0, this.className_ = e.className !== void 0 ? e.className : "ol-layer", delete e.className, this.setProperties(e), this.state_ = null;
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
    return e.opacity = re(Math.round(this.getOpacity() * 100) / 100, 0, 1), e.visible = this.getVisible(), e.extent = this.getExtent(), e.zIndex = n === void 0 && !e.managed ? 1 / 0 : n, e.maxResolution = this.getMaxResolution(), e.minResolution = Math.max(this.getMinResolution(), 0), e.minZoom = this.getMinZoom(), e.maxZoom = this.getMaxZoom(), this.state_ = e, e;
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").default>} [array] Array of layers (to be
   *     modified in place).
   * @return {Array<import("./Layer.js").default>} Array of layers.
   */
  getLayersArray(t) {
    return Nt();
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").State>} [states] Optional list of layer
   *     states (to be modified in place).
   * @return {Array<import("./Layer.js").State>} List of layer states.
   */
  getLayerStatesArray(t) {
    return Nt();
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
      this.get(pt.EXTENT)
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
      this.get(pt.MAX_RESOLUTION)
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
      this.get(pt.MIN_RESOLUTION)
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
      this.get(pt.MIN_ZOOM)
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
      this.get(pt.MAX_ZOOM)
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
      this.get(pt.OPACITY)
    );
  }
  /**
   * @abstract
   * @return {import("../source/Source.js").State} Source state.
   */
  getSourceState() {
    return Nt();
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
      this.get(pt.VISIBLE)
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
      this.get(pt.Z_INDEX)
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
    this.set(pt.EXTENT, t);
  }
  /**
   * Set the maximum resolution at which the layer is visible.
   * @param {number} maxResolution The maximum resolution of the layer.
   * @observable
   * @api
   */
  setMaxResolution(t) {
    this.set(pt.MAX_RESOLUTION, t);
  }
  /**
   * Set the minimum resolution at which the layer is visible.
   * @param {number} minResolution The minimum resolution of the layer.
   * @observable
   * @api
   */
  setMinResolution(t) {
    this.set(pt.MIN_RESOLUTION, t);
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
    this.set(pt.MAX_ZOOM, t);
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
    this.set(pt.MIN_ZOOM, t);
  }
  /**
   * Set the opacity of the layer, allowed values range from 0 to 1.
   * @param {number} opacity The opacity of the layer.
   * @observable
   * @api
   */
  setOpacity(t) {
    ae(typeof t == "number", "Layer opacity must be a number"), this.set(pt.OPACITY, t);
  }
  /**
   * Set the visibility of the layer (`true` or `false`).
   * @param {boolean} visible The visibility of the layer.
   * @observable
   * @api
   */
  setVisible(t) {
    this.set(pt.VISIBLE, t);
  }
  /**
   * Set Z-index of the layer, which is used to order layers before rendering.
   * The default Z-index is 0.
   * @param {number} zindex The z-index of the layer.
   * @observable
   * @api
   */
  setZIndex(t) {
    this.set(pt.Z_INDEX, t);
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
class Pg extends fI {
  /**
   * @param {Options<SourceType, NoInfer<Properties>>} options Layer options.
   */
  constructor(t) {
    const e = Object.assign({}, t);
    delete e.source, super(e), this.on, this.once, this.un, this.mapPrecomposeKey_ = null, this.mapRenderKey_ = null, this.sourceChangeKey_ = null, this.renderer_ = null, this.sourceReady_ = !1, this.rendered = !1, t.render && (this.render = t.render), t.map && this.setMap(t.map), this.addChangeListener(
      pt.SOURCE,
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
      this.get(pt.SOURCE) || null
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
    this.sourceChangeKey_ && (Qe(this.sourceChangeKey_), this.sourceChangeKey_ = null), this.sourceReady_ = !1;
    const t = this.getSource();
    t && (this.sourceChangeKey_ = ai(
      t,
      Ae.CHANGE,
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
    !t && n && (t = n.getView()), t instanceof Qa ? e = {
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
        (a) => a.layer === this
      ), !s)
        return !1;
    } else
      s = this.getLayerState();
    const o = this.getExtent();
    return dI(s, r.viewState) && (!o || Qi(o, r.extent));
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
    const n = t instanceof Qa ? t.getViewStateAndExtent() : t;
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
    t || this.unrender(), this.set(pt.MAP, t);
  }
  /**
   * For use inside the library only.
   * @return {import("../Map.js").default|null} Map.
   */
  getMapInternal() {
    return this.get(pt.MAP);
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
    this.mapPrecomposeKey_ && (Qe(this.mapPrecomposeKey_), this.mapPrecomposeKey_ = null), t || this.changed(), this.mapRenderKey_ && (Qe(this.mapRenderKey_), this.mapRenderKey_ = null), t && (this.mapPrecomposeKey_ = ai(
      t,
      CI.PRECOMPOSE,
      /** @type {import("../events.js").ListenerFunction} */
      this.handlePrecompose_,
      this
    ), this.mapRenderKey_ = ai(this, Ae.CHANGE, t.render, t), this.changed());
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
    ae(
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
    this.set(pt.SOURCE, t);
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
function dI(i, t) {
  if (!i.visible)
    return !1;
  const e = t.resolution;
  if (e < i.minResolution || e >= i.maxResolution)
    return !1;
  const n = t.zoom;
  return n > i.minZoom && n <= i.maxZoom;
}
function pI(i) {
  const t = i && typeof i.getPixelRatio == "function" ? i.getPixelRatio() : typeof window < "u" && window.devicePixelRatio || 1;
  return typeof t == "number" && Number.isFinite(t) && t > 0 ? t : 1;
}
function Og(i, t, e) {
  const n = pI(i);
  return Math.abs(t.width / n - e[0]) < 1 && Math.abs(t.height / n - e[1]) < 1;
}
class mI extends Pg {
  constructor(t) {
    let e;
    const n = function(r) {
      const s = this.getSource(), o = s.mapboxMap;
      if (!o)
        return console.error("MapboxLayer: mapboxMap is undefined!"), null;
      s.style !== e && (o.setStyle(s.style), e = s.style);
      const a = o.getCanvas(), A = r.viewState, g = this.getVisible();
      a.style.display = g ? "block" : "none";
      const c = this.getOpacity();
      a.style.opacity = c, a.style.position = "absolute", a.style.left = "0", a.style.top = "0";
      let u = !1;
      if (r.size) {
        const [d, E] = r.size;
        Og(o, a, [d, E]) || (o.resize(), u = !0);
      }
      const C = A.rotation * -180 / Math.PI, p = br(A.center), m = A.zoom - 1, l = o.getBearing(), h = o.getCenter().toArray(), I = o.getZoom();
      return !u && C == l && p[0] == h[0] && p[1] == h[1] && m == I || (C != l && o.rotateTo(C, {
        animate: !1
      }), (p[0] != h[0] || p[1] != h[1] || m != I) && o.jumpTo({
        center: p,
        zoom: m,
        animate: !1
      }), o._frame && (o._frame.cancel(), o._frame = null), o._render()), a;
    };
    super({
      render: n,
      source: t.source
    });
  }
}
class yI extends Pg {
  constructor(t) {
    let e;
    const n = function(r) {
      const s = this.getSource(), o = s.maplibreMap;
      if (!o)
        return console.error("MapLibreLayer: maplibreMap is undefined!"), null;
      s.style !== e && (o.setStyle(s.style), e = s.style);
      const a = o.getCanvas(), A = r.viewState, g = this.getVisible();
      a.style.display = g ? "block" : "none";
      const c = this.getOpacity();
      a.style.opacity = c;
      const C = -A.rotation * 180 / Math.PI, p = o.getBearing();
      Math.abs(C - p) > 0.01 && (o.stop(), o.setBearing(C));
      const m = br(A.center), l = A.zoom - 1;
      if ((o.getCenter().toArray().toString() !== m.toString() || o.getZoom() !== l) && o.jumpTo({
        center: m,
        zoom: l,
        animate: !1
      }), o._frame && (o._frame.cancel(), o._frame = null), r.size) {
        const [h, I] = r.size;
        Og(o, a, [h, I]) || o.resize();
      }
      return o._render(), Math.abs(o.getZoom() - l) > 0.01 && o.setZoom(l), a.style.position = "absolute", a.style.left = "0", a.style.top = "0", a;
    };
    super({
      render: n,
      source: t.source
    });
  }
}
const Lg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAxMS0xMC0yNlQyMTo1MjoxOFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAxMS0xMC0yN1QxNzo0MjowN1o8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgkVIwmwAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTM5jWRgMAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTAvMjYvMTHjwOqVAAARQHByVld4nMWbB3wURdvAd6/u3V6/27sts/PMQQhFpEU6SlNBRXqTfgkkQOhFSigHIgIWkJqAIJ1QBCz0KkJoQYrSQaQjioBKC+XezWU5fH2/3+/L8fu+fWd3bubZKf95nnlmdjeX2/dk602qD9UnooRc5YjkKp9KyIrkZikfkazcSFaWcuZmpUZScyOpWcqZm6rkU3OTIpGk3EhSViQpVTlzk5IiSUm5VCRC5UaorAiVqpy5VFKESspND6UY03O6U0oYGHo3NCg0ODSj59BQRmhYaHhoaDofFsJiGIVfC78e/hnOwwW4CI1Ttve/AlehLClH6oTrhl8N1wu3CIcFKhqWiwVpWvrG9EcjmXC2nC/1Sd+dHgonh1PCpxQ5nN4pfHHk3qGzOlFUepiiPk5PC/cO9wn3DfcL59deGOqWXC95Saigp/fCY8Lvh0e9Xm94q3DBlXLd2qm5kmRpSrdw9/CEqNwneWQ4HH6hXul6FHVs5Gfh2eGbI6eFp0fLxoZqhE/KC6P5Oa9lhzN7ymofy5PN4anhCRlfFpSVXxNeG26UQf0jyBSO5R1UcjTdF/3c8o+a66j11AbqhCrtpvZQe6lzqnSRukRdjtU8Q52lfqJuqNJt6g/qTzW/ltpKbaO2U99SO9QrF6j71AMqL9b2OvUr9VtMYmgLbaU9dIHkpwM0r+YdtJN20W76ytOa/zZWjpZpTANdNlr7NJVEv0RXpCtFpR+panR1ugZdPCodoGrTdei69MNou3p0ffoN+k36aT+rqcZqfheVQzWiW9HUP0Kn6BVEJ9DF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zV6+JT3q/K+UUkoppZ5Tl9rnzXTvZS/51pTrIJewYX0bzb5r+vfUX7X2ebU/rDnUmslszXqN0v99bSO/80ff/EtrIayb9PNrKMs56kf84zG7v5Te6HqW1yytUb8m7mzNaVbmv4r9stz7I1/WPPKc9sIzuc6ebST3XjlnDZd7OSawd7MmvNs6y5nriXWP9WbWmvq6UoX3Ota9TCttV8f0GZBXXqMep8R6JfdJl73upTKfo+6XbG+j/s9aG7ZmP75rNPZXvNzHLegjrPOtCT9WL+yXY17/tyH3IRB7GXXMtcq0VabZ8xrZt/8TQZzR/ZH/R2U+R33+P8X/GX/2/pB24py9GY74M//JWBN+ar36nJd7Avh6VKf0QbdPXs/yyrDRPhP3sz9znXmPynyutvB/30cpn1CmPC8x1jF+MpbRnteGn1Ivwhg3+I8AG9O+EHNt938fc3KP8pj/+X8i8yj1+93/szKfq2P+z7kdO/R+knUt9fEpfYO/iMs8tlX4MbtnGLbk/TrnYcZw4mLntDV7nfgz9yiPlYN/a/EhbSdtyp7ZyP+jMp/zLsh+W9YpfUffzrpij9FYRdxMr+fX/dn7wZpwwpbqlWHUg7mk+zfn8tE3GM/350Z59TDaQN+LTBsTP/Oelbn3tUtoab1APb70v1JKKaWUUkoppZRSSl1NOxERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERGRO+Qfh5eOajemXSYAAAFTbWtCVPrOyv4Af1WJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4nO3W4WmDYBSGUQdxEQdxEBdxEAdxEQexvIELt6Yh/4oJ54FDm0/7601szlOSJEmSJEmSJEmSJEmSJEmSJEkf0XEc577vT+c5y7V397+6T/dvXddzHMdzmqbHz+wY/Sz31L11FsuyPF7HMAx/vod077JjlX2zYXatzfs9tX/VN7/+je5ftut7Vjnrn+V6nX37xtm/ul7T/ctzvu9f/9fneX7aP9fs/31l23ru1+/btv36zPfnv/2/r/oe1/er90Cu1Xf7nEXVnx3Xa5IkSZIkSZIk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b24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+zWqGFQAACShJREFUWIWVmGusXFUVx39r73POzJy5M3fmPtrblj7p7btYGigGmojExISHQQ0miDFA4lc0SCBRNH4gRhNJ/aIfNAIxUkKIkMgjBBKMCHwQEGKhpbS39HXfve+5M3fmnr23H84+M7e1PDyTlbPPnDl7//da//Vf64zwBQ9jjCilAiDyFgIaUP4nFjDAMtACWtbaRGvtPmte59Lb8gUW137hGCgDFaDkrzMwrABRBxaAWWDeX7esteZyoD4XSJIkorXO+cV7gQFg9fMvLdz74bHm+hOnTP/QsOmeaxBYoJTDbF2n5wa36At7d+XOfOOW0uPAmLcpYN4Y0wyC4LIeuiwQ55wC8kA/sHF62tz5+F/mDz7zytKOTxpBMKsCEq1BCWjBiQAOcRAYQylpcWW0bG6/Kf/Rvd/rfmP1Kn0YOANMAksiYj8XiAcRew9se/ZvtR8/+seFr3xQj3QtDHGhQCCIFtAqDYxI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", Dg = "data:image/png;base64,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", Bg = "data:image/png;base64,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", Ng = "data:image/png;base64,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", vI = new Ee({
  image: new Xi({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: Lg
  })
}), wI = new Ee({
  image: new Xi({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: Dg
  })
}), bI = new Ee({
  image: new Xi({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: Bg
  })
}), EI = new Ee({
  fill: new ks({
    color: [128, 128, 256, 0.2]
  }),
  stroke: new Rs({
    color: [128, 128, 256, 1],
    width: 3
  })
}), xI = new Ee({
  image: new Xi({
    anchor: [0.5, 1],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: Ng
  })
});
function Fg(i) {
  return i ? i instanceof Ee ? i : typeof i == "string" ? new Ee({
    image: new Xi({
      anchor: [0.5, 1],
      anchorXUnits: "fraction",
      anchorYUnits: "fraction",
      src: i
    })
  }) : new Ee({
    image: new Xi(i)
  }) : xI;
}
class He extends Zc {
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
    t = xe(t || {});
    const e = new Nn({
      source: new Fn({
        wrapX: !1
      })
    });
    e.set("name", "gps");
    const n = new Nn({
      source: new Fn({
        wrapX: !1
      })
    });
    n.set("name", "marker");
    const r = new Nn({
      source: new Fn({
        wrapX: !1
      })
    });
    r.set("name", "feature");
    const s = new Nn({
      source: new Fn({
        wrapX: !1
      })
    });
    s.set("name", "envelope");
    const o = He.spawnLayer(
      null,
      t.source,
      t.target
    ), a = new Wc();
    a.set("name", "overlay");
    const g = {
      controls: t.controls ? t.controls : [],
      layers: [
        o,
        a,
        s,
        r,
        e,
        n
      ],
      target: t.div,
      view: new jA({
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
    const n = e && typeof e.isWmts == "function" && e.isWmts() ? e.minZoom : void 0;
    typeof n == "number" && Number.isFinite(n) && n > 4 ? t.setMinZoom(n - 4) : t.setMinZoom(-1 / 0);
  }
  static spawnLayer(t, e, n) {
    return e instanceof Cr || e instanceof fr || !(t instanceof Kr) ? (e instanceof Cr ? t = new mI({
      style: e.style,
      accessToken: e.accessToken,
      container: n,
      source: e
    }) : e instanceof fr ? t = new yI({
      style: e.style,
      container: n,
      source: e
    }) : (t = new Kr({
      source: e
    }), He.applyWmtsZoomGate(t, e)), t.set("name", "base")) : (t.setSource(e), He.applyWmtsZoomGate(t, e)), t;
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
    const r = this.getSource(n), s = new GA(t);
    return e && s.setStyle(e), r.addFeature(s), s;
  }
  removeFeature(t, e) {
    this.getSource(e).removeFeature(t);
  }
  resetFeature(t) {
    this.getSource(t).clear();
  }
  setGPSPosition(t, e = void 0) {
    const n = e == "sub" ? bI : e == "hide" ? wI : vI;
    e != "sub" && this.resetFeature("gps"), t && (this.setFeature(
      {
        geometry: new Wi(t.xy)
      },
      n,
      "gps"
    ), e || this.setFeature(
      {
        geometry: new fo(t.xy, t.rad)
      },
      EI,
      "gps"
    ));
  }
  setMarker(t, e, n, r) {
    return r || (r = "marker"), e.geometry = new Wi(t), this.setFeature(e, Fg(n), r);
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
    n.stroke != null && (s.stroke = new Rs(n.stroke)), n.fill != null && (s.fill = new ks(n.fill));
    const o = new Ee(s), a = e === "Line" ? new hr(t) : new gi(t);
    return this.setFeature(
      {
        geometry: a,
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
      e != null && (o.stroke = new Rs(e)), n != null && (o.fill = new ks(n)), s = new Ee(o);
    }
    return this.setFeature(
      {
        geometry: new gi([t])
      },
      s,
      r
    );
  }
  exchangeSource(t = void 0) {
    const e = this.getLayers(), n = e.item(0), r = He.spawnLayer(n, t, this.getTarget());
    r != n && e.setAt(0, r), t && t.setMap(this);
  }
  setLayer(t = void 0) {
    const e = this.getLayer("overlay").getLayers();
    if (e.clear(), t) {
      const n = new Kr({
        source: t
      });
      He.applyWmtsZoomGate(n, t), e.push(n);
    }
  }
  setTransparency(t) {
    const e = (100 - t) / 100, n = this.getSource();
    n instanceof Yi || n instanceof Zs ? (this.getLayers().item(0).setOpacity(1), this.getLayers().item(1).setOpacity(e)) : this.getLayers().item(0).setOpacity(e);
  }
  setGPSMarker(t, e) {
    this.getLayers().item(0).getSource().setGPSMarker(t, e);
  }
}
const In = {
  /**
   * A true double click, with no dragging.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#dblclick
   * @api
   */
  DBLCLICK: Ae.DBLCLICK,
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
class Sn extends hi {
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
function TI(i, t, e) {
  const n = i.getCenterInternal();
  if (n) {
    const r = [n[0] + t[0], n[1] + t[1]];
    i.animateInternal({
      duration: e !== void 0 ? e : 250,
      easing: sI,
      center: i.getConstrainedCenter(r)
    });
  }
}
function _o(i, t, e, n) {
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
    easing: Pr
  }));
}
const Qn = {
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
class Kn extends Me {
  /**
   * @param {import("./CollectionEventType.js").default} type Type.
   * @param {T} element Element.
   * @param {number} index The index of the added or removed element.
   */
  constructor(t, e, n) {
    super(t), this.element = e, this.index = n;
  }
}
class MI extends hi {
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
    return this.get(Ja.LENGTH);
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
      new Kn(Qn.ADD, e, t)
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
      new Kn(Qn.REMOVE, e, t)
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
      new Kn(Qn.REMOVE, r, t)
    ), this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new Kn(Qn.ADD, e, t)
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
  assertUnique_(t, e) {
    const n = this.array_;
    for (let r = 0, s = n.length; r < s; ++r)
      if (n[r] === t && r !== e)
        throw new Error("Duplicate item added to a unique collection");
  }
}
class _I {
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
class SI extends Sn {
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
    if (t.type == In.DBLCLICK) {
      const n = (
        /** @type {MouseEvent} */
        t.originalEvent
      ), r = t.map, s = t.coordinate, o = n.shiftKey ? -this.delta_ : this.delta_, a = r.getView();
      _o(a, o, s, this.duration_), n.preventDefault(), e = !0;
    }
    return !e;
  }
}
const ci = typeof navigator < "u" && typeof navigator.userAgent < "u" ? navigator.userAgent.toLowerCase() : "", RI = ci.includes("safari") && !ci.includes("chrom");
RI && (ci.includes("version/15.4") || /cpu (os|iphone os) 15_4 like mac os x/.test(ci));
const kI = ci.includes("webkit") && !ci.includes("edge"), jg = ci.includes("macintosh"), pr = typeof WorkerGlobalScope < "u" && typeof OffscreenCanvas < "u" && self instanceof WorkerGlobalScope, PI = typeof Image < "u" && Image.prototype.decode;
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
function Ws(i) {
  const t = arguments;
  return function(e) {
    let n = !0;
    for (let r = 0, s = t.length; r < s && (n = n && t[r](e), !!n); ++r)
      ;
    return n;
  };
}
const OI = function(i) {
  const t = i.originalEvent;
  return t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, LI = function(i) {
  const t = i.originalEvent;
  return t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, DI = function(i) {
  const t = i.map.getTargetElement();
  if (!t)
    return !1;
  const e = t.getRootNode(), n = i.map.getOwnerDocument().activeElement;
  return e instanceof ShadowRoot ? e.host.contains(n) : t.contains(n);
}, Gg = function(i) {
  const t = i.map.getTargetElement();
  if (!t)
    return !0;
  const e = t.getRootNode();
  return (e instanceof ShadowRoot ? e.host : t).hasAttribute("tabindex") ? DI(i) : !0;
}, BI = il, zg = function(i) {
  const t = i.originalEvent;
  return "pointerId" in t && t.button == 0 && !(kI && jg && t.ctrlKey);
}, Xg = function(i) {
  const t = (
    /** @type {KeyboardEvent|MouseEvent|TouchEvent} */
    i.originalEvent
  );
  return !t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, NI = function(i) {
  const t = i.originalEvent;
  return jg ? t.metaKey : t.ctrlKey;
}, Ug = function(i) {
  const t = i.originalEvent;
  return !t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, Zg = function(i) {
  const t = i.originalEvent, e = (
    /** @type {Element} */
    t.target.tagName
  );
  return e !== "INPUT" && e !== "SELECT" && e !== "TEXTAREA" && // `isContentEditable` is only available on `HTMLElement`, but it may also be a
  // different type like `SVGElement`.
  // @ts-ignore
  !t.target.isContentEditable;
}, Fi = function(i) {
  const t = i.originalEvent;
  return "pointerId" in t && t.pointerType == "mouse";
}, FI = function(i) {
  const t = i.originalEvent;
  return "pointerId" in t && t.isPrimary && t.button === 0;
};
class Ki extends Sn {
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
      if (t.type == In.POINTERDRAG)
        this.handleDragEvent(t), t.originalEvent.preventDefault();
      else if (t.type == In.POINTERUP) {
        const n = this.handleUpEvent(t);
        this.handlingDownUpSequence = n && this.targetPointers.length > 0;
      }
    } else if (t.type == In.POINTERDOWN) {
      const n = this.handleDownEvent(t);
      this.handlingDownUpSequence = n, e = this.stopDown(n);
    } else t.type == In.POINTERMOVE && this.handleMoveEvent(t);
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
function So(i) {
  const t = i.length;
  let e = 0, n = 0;
  for (let r = 0; r < t; r++)
    e += i[r].clientX, n += i[r].clientY;
  return { clientX: e / t, clientY: n / t };
}
class jI extends Ki {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super({
      stopDown: Er
    }), t = t || {}, this.kinetic_ = t.kinetic, this.lastCentroid = null, this.lastPointersCount_, this.panning_ = !1;
    const e = t.condition ? t.condition : Ws(Xg, FI);
    this.condition_ = t.onFocusOnly ? Ws(Gg, e) : e, this.noKinetic_ = !1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    const e = t.map;
    this.panning_ || (this.panning_ = !0, e.getView().beginInteraction());
    const n = this.targetPointers, r = e.getEventPixel(So(n));
    if (n.length == this.lastPointersCount_) {
      if (this.kinetic_ && this.kinetic_.update(r[0], r[1]), this.lastCentroid) {
        const s = [
          this.lastCentroid[0] - r[0],
          r[1] - this.lastCentroid[1]
        ], a = t.map.getView(), A = a.getResolution();
        A !== void 0 && (El(s, A), go(s, a.getRotation()), a.adjustCenterInternal(s));
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
          const a = (
            /** @type {import("../pixel.js").Pixel} */
            e.getPixelFromCoordinateInternal(o)
          ), A = e.getCoordinateFromPixelInternal([
            a[0] - r * Math.cos(s),
            a[1] - r * Math.sin(s)
          ]);
          n.animateInternal({
            center: n.getConstrainedCenter(
              /** @type {import("../coordinate.js").Coordinate} */
              A
            ),
            duration: 500,
            easing: Pr
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
class GI extends Ki {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super({
      stopDown: Er
    }), this.condition_ = t.condition ? t.condition : LI, this.lastAngle_ = void 0, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    if (!Fi(t))
      return;
    const e = t.map, n = e.getView();
    if (n.getConstraints().rotation === Mo)
      return;
    const r = e.getSize();
    if (!r)
      return;
    const s = t.pixel, o = Math.atan2(r[1] / 2 - s[1], s[0] - r[0] / 2);
    if (this.lastAngle_ !== void 0) {
      const a = o - this.lastAngle_;
      n.adjustRotationInternal(-a);
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
    return Fi(t) ? (t.map.getView().endInteraction(this.duration_), !1) : !0;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    return Fi(t) && zg(t) && this.condition_(t) ? (t.map.getView().beginInteraction(), this.lastAngle_ = void 0, !0) : !1;
  }
}
class zI extends UA {
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
      (A) => r.getCoordinateFromPixelInternal(A)
    ), o = s[0];
    if (!o)
      return;
    s[4] = o.slice();
    const a = (
      /** @type {Array<import("../coordinate.js").Coordinate>} */
      s
    );
    this.geometry_ ? this.geometry_.setCoordinates([a]) : this.geometry_ = new gi([a]);
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
const Ti = {
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
class An extends Me {
  /**
   * @param {string} type The event type.
   * @param {import("../coordinate.js").Coordinate} coordinate The event coordinate.
   * @param {import("../MapBrowserEvent.js").default|null} mapBrowserEvent Originating event.
   */
  constructor(t, e, n) {
    super(t), this.coordinate = e, this.mapBrowserEvent = n;
  }
}
class XI extends Ki {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = t ?? {}, this.box_ = new zI(t.className || "ol-dragbox"), this.minArea_ = t.minArea ?? 64, t.onBoxEnd && (this.onBoxEnd = t.onBoxEnd), this.startPixel_ = null, this.condition_ = t.condition ?? zg, this.boxEndCondition_ = t.boxEndCondition ?? this.defaultBoxEndCondition;
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
      new An(
        Ti.BOXDRAG,
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
      new An(
        e ? Ti.BOXEND : Ti.BOXCANCEL,
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
      new An(
        Ti.BOXSTART,
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
      new An(Ti.BOXCANCEL, this.startPixel_, null)
    ), this.startPixel_ = null)), super.setActive(t);
  }
  /**
   * @param {import("../Map.js").default|null} map Map.
   * @override
   */
  setMap(t) {
    this.getMap() && (this.box_.setMap(null), this.startPixel_ && (this.dispatchEvent(
      new An(Ti.BOXCANCEL, this.startPixel_, null)
    ), this.startPixel_ = null)), super.setMap(t);
  }
}
class UI extends XI {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = t.condition ? t.condition : Ug;
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
      const s = n.rotatedExtentForGeometry(r), o = n.getResolutionForExtentInternal(s), a = n.getResolution();
      if (o === void 0 || a === void 0)
        return;
      const A = a / o;
      r = r.clone(), r.scale(A * A);
    }
    n.fitInternal(r, {
      duration: this.duration_,
      easing: Pr
    });
  }
}
const qe = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown"
};
class ZI extends Sn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.defaultCondition_ = function(e) {
      return Xg(e) && Zg(e);
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
    if (t.type == Ae.KEYDOWN) {
      const n = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), r = n.key;
      if (this.condition_(t) && (r == qe.DOWN || r == qe.LEFT || r == qe.RIGHT || r == qe.UP)) {
        const o = t.map.getView(), a = o.getResolution();
        if (a === void 0)
          return !0;
        const A = a * this.pixelDelta_;
        let g = 0, c = 0;
        r == qe.DOWN ? c = -A : r == qe.LEFT ? g = -A : r == qe.RIGHT ? g = A : c = A;
        const u = [g, c];
        go(u, o.getRotation()), TI(o, u, this.duration_), n.preventDefault(), e = !0;
      }
    }
    return !e;
  }
}
class WI extends Sn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.condition_ = t.condition ? t.condition : function(e) {
      return !NI(e) && Zg(e);
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
    if (t.type == Ae.KEYDOWN || t.type == Ae.KEYPRESS) {
      const n = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), r = n.key;
      if (this.condition_(t) && (r === "+" || r === "-")) {
        const s = t.map, o = r === "+" ? this.delta_ : -this.delta_, a = s.getView();
        _o(a, o, void 0, this.duration_), n.preventDefault(), e = !0;
      }
    }
    return !e;
  }
}
const VI = 40, YI = 300, HI = 3;
class QI extends Sn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Interaction.js").InteractionOptions} */
      t
    ), this.totalDelta_ = 0, this.lastDelta_ = 0, this.maxDelta_ = t.maxDelta !== void 0 ? t.maxDelta : 1, this.duration_ = t.duration !== void 0 ? t.duration : 250, this.timeout_ = t.timeout !== void 0 ? t.timeout : 80, this.useAnchor_ = t.useAnchor !== void 0 ? t.useAnchor : !0, this.constrainResolution_ = t.constrainResolution !== void 0 ? t.constrainResolution : !1;
    const e = t.condition ? t.condition : BI;
    this.condition_ = t.onFocusOnly ? Ws(Gg, e) : e, this.lastAnchor_ = null, this.startTime_ = void 0, this.timeoutId_, this.mode_ = void 0, this.trackpadEventGap_ = 400, this.trackpadTimeoutId_, this.deltaPerZoom_ = 300;
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
    if (!this.condition_(t) || t.type !== Ae.WHEEL)
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
        o *= VI;
        break;
      case WheelEvent.DOM_DELTA_PAGE:
        o *= YI;
        break;
    }
    if (o === 0)
      return !1;
    this.lastDelta_ = o;
    const a = Date.now();
    this.startTime_ === void 0 && (this.startTime_ = a), (!this.mode_ || a - this.startTime_ > this.trackpadEventGap_) && (this.mode_ = Math.abs(o) < 4 ? "trackpad" : "wheel");
    const A = n.getView();
    if (this.mode_ === "trackpad")
      return this.trackpadTimeoutId_ ? clearTimeout(this.trackpadTimeoutId_) : (A.getAnimating() && A.cancelAnimations(), A.beginInteraction()), this.trackpadTimeoutId_ = setTimeout(
        this.endInteraction_.bind(this),
        this.timeout_
      ), s && (o = o * HI), A.adjustZoom(
        -o / this.deltaPerZoom_,
        this.lastAnchor_ ? n.getCoordinateFromPixel(this.lastAnchor_) : void 0
      ), this.startTime_ = a, !1;
    this.totalDelta_ += o;
    const g = Math.max(this.timeout_ - (a - this.startTime_), 0);
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
    let n = -re(
      this.totalDelta_,
      -this.maxDelta_ * this.deltaPerZoom_,
      this.maxDelta_ * this.deltaPerZoom_
    ) / this.deltaPerZoom_;
    (e.getConstrainResolution() || this.constrainResolution_) && (n = n ? n > 0 ? 1 : -1 : 0), _o(
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
class KI extends Ki {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = Er), super(e), this.anchor_ = null, this.lastAngle_ = void 0, this.rotating_ = !1, this.rotationDelta_ = 0, this.threshold_ = t.threshold !== void 0 ? t.threshold : 0.3, this.duration_ = t.duration !== void 0 ? t.duration : 250;
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
      const A = s - this.lastAngle_;
      this.rotationDelta_ += A, !this.rotating_ && Math.abs(this.rotationDelta_) > this.threshold_ && (this.rotating_ = !0), e = A;
    }
    this.lastAngle_ = s;
    const o = t.map, a = o.getView();
    a.getConstraints().rotation !== Mo && (this.anchor_ = o.getCoordinateFromPixelInternal(
      o.getEventPixel(So(this.targetPointers))
    ) ?? null, this.rotating_ && (o.render(), a.adjustRotationInternal(e, this.anchor_ ?? void 0)));
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
class JI extends Ki {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = Er), super(e), this.anchor_ = null, this.duration_ = t.duration !== void 0 ? t.duration : 400, this.lastDistance_ = void 0, this.lastScaleDelta_ = 1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    let e = 1;
    const n = this.targetPointers[0], r = this.targetPointers[1], s = n.clientX - r.clientX, o = n.clientY - r.clientY, a = Math.sqrt(s * s + o * o);
    this.lastDistance_ !== void 0 && (e = this.lastDistance_ / a), this.lastDistance_ = a;
    const A = t.map, g = A.getView();
    e != 1 && (this.lastScaleDelta_ = e), this.anchor_ = A.getCoordinateFromPixelInternal(
      A.getEventPixel(So(this.targetPointers))
    ) ?? null, A.render(), g.adjustResolutionInternal(e, this.anchor_ ?? void 0);
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
function qa(i) {
  i = i || {};
  const t = new MI(), e = new _I(-5e-3, 0.05, 100);
  return (i.altShiftDragRotate === void 0 || i.altShiftDragRotate) && t.push(new GI()), (i.doubleClickZoom === void 0 || i.doubleClickZoom) && t.push(
    new SI({
      delta: i.zoomDelta,
      duration: i.zoomDuration
    })
  ), (i.dragPan === void 0 || i.dragPan) && t.push(
    new jI({
      onFocusOnly: i.onFocusOnly,
      kinetic: e
    })
  ), (i.pinchRotate === void 0 || i.pinchRotate) && t.push(new KI()), (i.pinchZoom === void 0 || i.pinchZoom) && t.push(
    new JI({
      duration: i.zoomDuration
    })
  ), (i.keyboard === void 0 || i.keyboard) && (t.push(new ZI()), t.push(
    new WI({
      delta: i.zoomDelta,
      duration: i.zoomDuration
    })
  )), (i.mouseWheelZoom === void 0 || i.mouseWheelZoom) && t.push(
    new QI({
      onFocusOnly: i.onFocusOnly,
      duration: i.zoomDuration
    })
  ), (i.shiftDragZoom === void 0 || i.shiftDragZoom) && t.push(
    new UI({
      duration: i.zoomDuration
    })
  ), t;
}
class qI extends Ki {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Pointer.js").Options} */
      t
    ), this.condition_ = t.condition ? t.condition : Ug, this.lastAngle_ = void 0, this.lastMagnitude_ = void 0, this.lastScaleDelta_ = 0, this.duration_ = t.duration !== void 0 ? t.duration : 400;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    if (!Fi(t))
      return;
    const e = t.map, n = e.getSize();
    if (!n)
      return;
    const r = t.pixel, s = r[0] - n[0] / 2, o = n[1] / 2 - r[1], a = Math.atan2(o, s), A = Math.sqrt(s * s + o * o), g = e.getView();
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
    if (!Fi(t))
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
    return Fi(t) && this.condition_(t) ? (t.map.getView().beginInteraction(), this.lastAngle_ = void 0, this.lastMagnitude_ = void 0, !0) : !1;
  }
}
function mr(i, t, e, n) {
  let r;
  return e && e.length ? r = /** @type {HTMLCanvasElement} */
  e.shift() : pr ? r = new class extends OffscreenCanvas {
    style = {};
  }(i ?? 300, t ?? 150) : r = document.createElement("canvas"), i && (r.width = i), t && (r.height = t), /** @type {CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D} */
  r.getContext("2d", n);
}
function Ro(i) {
  const t = i.canvas;
  t.width = 1, t.height = 1, i.clearRect(0, 0, 1, 1);
}
function $I(i, t, e) {
  const n = (
    /** @type {HTMLImageElement} */
    i
  );
  let r = !0, s = !1, o = !1;
  const a = [
    Ar(n, Ae.LOAD, function() {
      o = !0, s || t();
    })
  ];
  return n.src && PI ? (s = !0, n.decode().then(function() {
    r && t();
  }).catch(function(A) {
    r && (o ? t() : e());
  })) : a.push(Ar(n, Ae.ERROR, e)), function() {
    r = !1, a.forEach(Qe);
  };
}
function tC(i, t, e) {
  return e === void 0 && (e = [0, 0]), e[0] = i[0] * t + 0.5 | 0, e[1] = i[1] * t + 0.5 | 0, e;
}
function oi(i, t) {
  return Array.isArray(i) ? i : (t === void 0 ? t = [i, i] : (t[0] = i, t[1] = i), t);
}
class eC extends hi {
  /**
   * @param {Options} options Source options.
   */
  constructor(t) {
    super(), this.projection = qt(t.projection), this.attributions_ = $a(t.attributions), this.attributionsCollapsible_ = t.attributionsCollapsible ?? !0, this.loading = !1, this.canRotate = !1, this.state_ = t.state !== void 0 ? t.state : "ready", this.wrapX_ = t.wrapX !== void 0 ? t.wrapX : !1, this.interpolate_ = !!t.interpolate, this.viewResolver = null, this.viewRejector = null;
    const e = this;
    this.viewPromise_ = new Promise(function(n, r) {
      e.viewResolver = n, e.viewRejector = r;
    });
  }
  /**
   * Get the attribution function for the source.
   * @return {?Attribution} Attribution function.
   * @api
   */
  getAttributions() {
    return this.attributions_;
  }
  /**
   * @return {boolean} Attributions are collapsible.
   * @api
   */
  getAttributionsCollapsible() {
    return this.attributionsCollapsible_;
  }
  /**
   * Get the projection of the source.
   * @return {import("../proj/Projection.js").default|null} Projection.
   * @api
   */
  getProjection() {
    return this.projection;
  }
  /**
   * @param {import("../proj/Projection.js").default} [projection] Projection.
   * @return {Array<number>|null} Resolutions.
   */
  getResolutions(t) {
    return null;
  }
  /**
   * @return {Promise<import("../View.js").ViewOptions>} A promise for view-related properties.
   */
  getView() {
    return this.viewPromise_;
  }
  /**
   * Resolve once the source is ready to be used (its state is `ready`), or
   * reject if it fails to load (its state is `error`). Sources that configure
   * asynchronously can use this to expose data (e.g. dimensions) through a
   * promise instead of the `change` event.
   * @return {Promise<void>} Resolves when the source is ready.
   * @protected
   */
  ready() {
    const t = this.getState();
    return t === "ready" ? Promise.resolve() : t === "error" ? Promise.reject(new Error("Source failed to load")) : new Promise((e, n) => {
      const r = () => {
        const s = this.getState();
        s === "ready" ? (this.un("change", r), e()) : s === "error" && (this.un("change", r), n(new Error("Source failed to load")));
      };
      this.on("change", r);
    });
  }
  /**
   * Get the state of the source, see {@link import("./Source.js").State} for possible states.
   * @return {import("./Source.js").State} State.
   * @api
   */
  getState() {
    return this.state_;
  }
  /**
   * @return {boolean|undefined} Wrap X.
   */
  getWrapX() {
    return this.wrapX_;
  }
  /**
   * @return {boolean} Use linear interpolation when resampling.
   */
  getInterpolate() {
    return this.interpolate_;
  }
  /**
   * Refreshes the source. The source will be cleared, and data from the server will be reloaded.
   * @api
   */
  refresh() {
    this.changed();
  }
  /**
   * Set the attributions of the source.
   * @param {AttributionLike|undefined} attributions Attributions.
   *     Can be passed as `string`, `Array<string>`, {@link module:ol/source/Source~Attribution},
   *     or `undefined`.
   * @api
   */
  setAttributions(t) {
    this.attributions_ = $a(t), this.changed();
  }
  /**
   * Set the state of the source.
   * @param {import("./Source.js").State} state State.
   */
  setState(t) {
    this.state_ = t, this.changed();
  }
}
function $a(i) {
  return i ? typeof i == "function" ? i : (Array.isArray(i) || (i = [i]), (t) => i) : null;
}
function tA(i, t, e, n) {
  return n !== void 0 ? (n[0] = i, n[1] = t, n[2] = e, n) : [i, t, e];
}
function iC(i, t, e) {
  return i + "/" + t + "/" + e;
}
function nC(i, t, e, n, r) {
  return `${Ai(i)},${t},${iC(e, n, r)}`;
}
function rC(i) {
  return sC(i[0], i[1], i[2]);
}
function sC(i, t, e) {
  return (t << i) + e;
}
function oC(i, t) {
  const e = i[0], n = i[1], r = i[2];
  if (t.getMinZoom() > e || e > t.getMaxZoom())
    return !1;
  const s = t.getFullTileRange(e);
  return s ? s.containsXY(n, r) : !0;
}
const aC = /\{z\}/g, AC = /\{x\}/g, gC = /\{y\}/g, cC = /\{-y\}/g;
function lC(i, t, e, n, r) {
  return i.replace(aC, t.toString()).replace(AC, e.toString()).replace(gC, n.toString()).replace(cC, function() {
    if (r === void 0)
      throw new Error(
        "If the URL template has a {-y} placeholder, the grid extent must be known"
      );
    return (r - n).toString();
  });
}
function uC(i) {
  const t = [];
  let e = /\{([a-z])-([a-z])\}/.exec(i);
  if (e) {
    const n = e[1].charCodeAt(0), r = e[2].charCodeAt(0);
    let s;
    for (s = n; s <= r; ++s)
      t.push(i.replace(e[0], String.fromCharCode(s)));
    return t;
  }
  if (e = /\{(\d+)-(\d+)\}/.exec(i), e) {
    const n = parseInt(e[2], 10);
    for (let r = parseInt(e[1], 10); r <= n; r++)
      t.push(i.replace(e[0], r.toString()));
    return t;
  }
  return t.push(i), t;
}
function hC(i, t) {
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
      let s;
      const o = e[0];
      if (t) {
        const a = t.getFullTileRange(o);
        a && (s = a.getHeight() - 1);
      }
      return lC(i, o, e[1], e[2], s);
    })
  );
}
function yr(i, t) {
  const e = i.length, n = new Array(e);
  for (let r = 0; r < e; ++r)
    n[r] = hC(i[r], t);
  return IC(n);
}
function IC(i) {
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
      const r = rC(t), s = Bi(r, i.length);
      return i[s](t, e, n);
    })
  );
}
for (let i = 0; i < 9; i++) {
  const t = `ZOOM:${i}`, e = 256 * Math.pow(2, i);
  (function(n, r) {
    const s = new Uc({
      code: n,
      // The extent is used to determine zoom level 0. Recommended values for a
      // projection's validity extent can be found at https://epsg.io/.
      extent: [0, 0, r, r],
      units: "m"
    });
    Ss(s), ar(
      "EPSG:3857",
      s,
      (o) => {
        const a = (o[0] + mt) * r / (2 * mt), A = (-o[1] + mt) * r / (2 * mt);
        return [a, A];
      },
      (o) => {
        const a = o[0] * (2 * mt) / r - mt, A = -1 * (o[1] * (2 * mt) / r - mt);
        return [a, A];
      }
    );
  })(t, e);
}
class Wg extends tI(zA) {
  constructor(t = {}) {
    t = Rg(t), t.wrapX = !1;
    const e = Math.log2(t.width / ti), n = Math.log2(t.height / ti);
    t.maxZoom = Math.ceil(Math.max(e, n)), t.tileUrlFunction = t.tileUrlFunction || function(r) {
      const s = r[0], o = r[1], a = r[2];
      return (
        // @ts-ignore
        o * ti * Math.pow(2, this.maxZoom - s) >= this.width || // @ts-ignore
        a * ti * Math.pow(2, this.maxZoom - s) >= this.height || o < 0 || a < 0 ? bo : this._tileUrlFunction(r)
      );
    }, super(t), t.mapID && (this.mapID = t.mapID), t.urls ? this._tileUrlFunction = yr(t.urls) : t.url && (this._tileUrlFunction = yr(Array.isArray(t.url) ? t.url : [t.url])), this.width = t.width, this.height = t.height, this.maxZoom = t.maxZoom, this._maxxy = Math.pow(2, this.maxZoom) * ti, this.initialize(t);
  }
}
class Li extends Yi {
  static isBasemap_ = !1;
  constructor(t = {}) {
    super(Object.assign(t, { opaque: !1 }));
  }
}
const ke = "https://weiwudi.example.com/api/";
let cs, Mi;
class CC {
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
class be extends CC {
  static async registerSW(t, e) {
    if (!("serviceWorker" in navigator))
      throw "Error: Service worker is not supported";
    let n;
    try {
      n = await navigator.serviceWorker.register(t, e);
    } catch (r) {
      throw `Error: Service worker registration failed with ${r}`;
    }
    return await be.waitForController(), await be.swCheck(), n;
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
    return Mi !== void 0 ? Mi : (cs === void 0 && (cs = new Promise((t, e) => {
      fetch(`${ke}ping`).then((n) => {
        Mi = !!n, t(Mi);
      }).catch((n) => {
        Mi = !1, t(Mi);
      });
    })), cs);
  }
  static async registerMap(t, e) {
    if (!await be.swCheck()) throw "Weiwudi service worker is not implemented.";
    let n;
    const r = ["type", "url", "width", "height", "tileSize", "minZoom", "maxZoom", "maxLng", "maxLat", "minLng", "minLat", "cacheTtl", "cacheMaxBytes"].reduce((o, a) => (typeof e[a] < "u" && (e[a] instanceof Array ? e[a].map((A) => {
      o.append(a, A);
    }) : o.append(a, String(e[a]))), o), new URLSearchParams());
    r.append("mapID", t);
    const s = new URL(`${ke}add`);
    if (s.search = r.toString(), n = await (await fetch(s.href)).text(), n.match(/^Error: /))
      throw n;
    return new be(t, JSON.parse(n));
  }
  static async retrieveMap(t) {
    if (!await be.swCheck()) throw "Weiwudi service worker is not implemented.";
    let e;
    if (e = await (await fetch(`${ke}info?mapID=${t}`)).text(), e.match(/^Error: /))
      throw e;
    return console.log(e), new be(t, JSON.parse(e));
  }
  static async removeMap(t) {
    if (!await be.swCheck()) throw "Weiwudi service worker is not implemented.";
    let e;
    if (e = await (await fetch(`${ke}delete?mapID=${t}`)).text(), e.match(/^Error: /))
      throw e;
  }
  constructor(t, e) {
    if (super(), !t) throw "MapID is necessary.";
    this.mapID = t, e && Object.assign(this, e), this.url = `${ke}cache/${t}/{z}/{x}/{y}`, this.listener = (n) => {
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
    if (this.checkAspect(), t = await (await fetch(`${ke}stats?mapID=${this.mapID}`)).text(), typeof t == "string" && t.match(/^Error: /))
      throw t;
    return JSON.parse(t);
  }
  async clean() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${ke}clean?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
  async fetchAll() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${ke}fetchAll?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
  async remove() {
    this.checkAspect(), this.mapID && await be.removeMap(this.mapID), this.release();
  }
  async cancel() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${ke}cancel?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
}
function Jn(i, t, e) {
  const n = typeof i == "string" ? i : i.getCode(), r = typeof t == "string" ? t : t.getCode();
  let s = Hr(i, t);
  if (s == Qr && n != r) {
    const o = Hr(i, "EPSG:3857"), a = Hr("EPSG:3857", t);
    if (o == Qr && n != "EPSG:3857")
      throw "Transform of Source projection is not defined.";
    if (a == Qr && r != "EPSG:3857")
      throw "Transform of Distination projection is not defined.";
    s = function(g) {
      return ne(ne(g, i, "EPSG:3857"), "EPSG:3857", t);
    }, ar(i, t, s, function(g) {
      return ne(ne(g, t, "EPSG:3857"), "EPSG:3857", i);
    });
  }
  if (e)
    return s(e);
}
const fC = [
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
async function dC(i) {
  const t = i;
  if (fC.forEach((s) => {
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
  const n = new Ig();
  n.setMapData(e);
  const r = n.getLayerTransform(0);
  if (t.strictMode = r.strictMode, t.vertexMode = r.vertexMode, t.yaxisMode = r.yaxisMode, t.width = r.wh?.[0], t.height = r.wh?.[1], t.gcps = r.points, t.edges = r.edges, i.sub_maps) {
    const s = i.sub_maps.map((o, a) => {
      const A = {
        importance: o.importance,
        priority: o.priority
      };
      if (o.compiled) {
        const g = n.getLayerTransform(a + 1);
        A.bounds = g?.bounds ?? o.bounds, A.gcps = g?.points, A.edges = g?.edges;
      } else
        A.bounds = o.bounds, A.gcps = o.gcps, A.edges = o.edges;
      return A;
    });
    t.sub_maps = s;
  }
  return [t, n];
}
function eA(i, t, e) {
  return typeof i.merc2XyVisibleLayers != "function" ? null : i.merc2XyVisibleLayers(t).filter(([, n]) => e(n)).slice(0, 2).map(([n, r]) => [n, r]);
}
class vr extends Wg {
  mapTransform;
  constructor(t = {}) {
    super(t), this.mapTransform = new Ig();
  }
  static async createAsync(t) {
    const [e, n] = await dC(t);
    t = e;
    const r = new vr(t);
    r.mapTransform = n;
    const s = n.getLayerTransform(0), o = new fn({
      code: `Illst:${r.mapID}`,
      extent: [0, 0, r.width, r.height],
      units: "m"
    });
    return Ss(o), ar(
      o,
      "EPSG:3857",
      (a) => s.transform(a, !1),
      (a) => s.transform(a, !0)
    ), Jn("EPSG:4326", o), t.sub_maps && t.sub_maps.forEach((a, A) => {
      const g = A + 1, c = `Illst:${r.mapID}#${g}`, u = n.getLayerTransform(g);
      if (!u) return;
      const C = new fn({
        code: c,
        extent: [u.xy[0], u.xy[1], u.wh[0], u.wh[1]],
        units: "m"
      });
      Ss(C), ar(
        C,
        "EPSG:3857",
        (p) => u.transform(p, !1, !0),
        (p) => u.transform(p, !0, !0)
      ), Jn("EPSG:4326", C);
    }), r;
  }
  xy2MercAsync_specifyLayer(t, e) {
    const n = `Illst:${this.mapID}${e ? `#${e}` : ""}`;
    return new Promise((r, s) => {
      r(Jn(n, "EPSG:3857", t));
    });
  }
  merc2XyAsync_specifyLayer(t, e) {
    const n = `Illst:${this.mapID}${e ? `#${e}` : ""}`;
    return new Promise((r, s) => {
      r(Jn("EPSG:3857", n, t));
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
    const [r, s] = n, o = this.mapTransform.getLayerTransform(r), a = this.mapTransform.getLayerTransform(0);
    if (!o) return;
    const A = [
      [e[0] - 150, e[1]],
      [e[0] + 150, e[1]],
      [e[0], e[1] - 150],
      [e[0], e[1] + 150]
    ], g = [
      [0, 0],
      [this.width, 0],
      [this.width, this.height],
      [0, this.height]
    ], c = A.map((l) => o.transform(l, !1)), u = g.map(
      (l) => a.transform(l, !1)
    ), C = Math.sqrt(
      Math.pow(c[0][0] - c[1][0], 2) + Math.pow(c[0][1] - c[1][1], 2)
    ), p = Math.sqrt(
      Math.pow(c[2][0] - c[3][0], 2) + Math.pow(c[2][1] - c[3][1], 2)
    ), m = (C + p) / 2;
    this.mercZoom || (this.mercZoom = Math.log(300 * (2 * mt) / 256 / m) / Math.log(2) - 3), this.homePosition || (this.homePosition = br(s)), this.envelope = wg([
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
    const e = t[0], n = eA(
      this.mapTransform,
      e[0],
      (s) => this.insideCheckXy(s)
    );
    if (n)
      return Promise.resolve(
        n.map(([s, o], a) => {
          if (a > 0)
            return [[this.xy2SysCoord(o)], t[1]];
          const A = this.mapTransform.getLayerTransform(s);
          return [
            e.map(
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
    const e = eA(
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
function pC(i, t) {
  return {
    mapID: typeof i == "string" ? i : i?.mapID ?? "",
    __maplatUnusable: { reason: t.reason }
  };
}
function mC(i) {
  return !!i && typeof i == "object" && "__maplatUnusable" in i;
}
const Vg = /* @__PURE__ */ new WeakMap();
function yC(i, t) {
  Vg.set(i, [...t]);
}
function vC(i) {
  return [...Vg.get(i) ?? []];
}
function wC(i) {
  return (t) => i.tileUrl(t[0], t[1], t[2]) ?? bo;
}
async function iA(i, t, e) {
  const n = await Ch(i, t);
  i.tileUrlFunction = wC(n), i.__maplatIiifUrl = n.url;
}
function nA(i, t) {
  !t || !t.__maplatIiifUrl || typeof i?.setTileUrlFunction == "function" && i.setTileUrlFunction(t.tileUrlFunction, t.__maplatIiifUrl);
}
var jt = typeof globalThis < "u" && globalThis || typeof self < "u" && self || // eslint-disable-next-line no-undef
typeof globalThis < "u" && globalThis || {}, Jt = {
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
function bC(i) {
  return i && DataView.prototype.isPrototypeOf(i);
}
if (Jt.arrayBuffer)
  var EC = [
    "[object Int8Array]",
    "[object Uint8Array]",
    "[object Uint8ClampedArray]",
    "[object Int16Array]",
    "[object Uint16Array]",
    "[object Int32Array]",
    "[object Uint32Array]",
    "[object Float32Array]",
    "[object Float64Array]"
  ], xC = ArrayBuffer.isView || function(i) {
    return i && EC.indexOf(Object.prototype.toString.call(i)) > -1;
  };
function Ji(i) {
  if (typeof i != "string" && (i = String(i)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(i) || i === "")
    throw new TypeError('Invalid character in header field name: "' + i + '"');
  return i.toLowerCase();
}
function ko(i) {
  return typeof i != "string" && (i = String(i)), i;
}
function Po(i) {
  var t = {
    next: function() {
      var e = i.shift();
      return { done: e === void 0, value: e };
    }
  };
  return Jt.iterable && (t[Symbol.iterator] = function() {
    return t;
  }), t;
}
function Pt(i) {
  this.map = {}, i instanceof Pt ? i.forEach(function(t, e) {
    this.append(e, t);
  }, this) : Array.isArray(i) ? i.forEach(function(t) {
    if (t.length != 2)
      throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + t.length);
    this.append(t[0], t[1]);
  }, this) : i && Object.getOwnPropertyNames(i).forEach(function(t) {
    this.append(t, i[t]);
  }, this);
}
Pt.prototype.append = function(i, t) {
  i = Ji(i), t = ko(t);
  var e = this.map[i];
  this.map[i] = e ? e + ", " + t : t;
};
Pt.prototype.delete = function(i) {
  delete this.map[Ji(i)];
};
Pt.prototype.get = function(i) {
  return i = Ji(i), this.has(i) ? this.map[i] : null;
};
Pt.prototype.has = function(i) {
  return this.map.hasOwnProperty(Ji(i));
};
Pt.prototype.set = function(i, t) {
  this.map[Ji(i)] = ko(t);
};
Pt.prototype.forEach = function(i, t) {
  for (var e in this.map)
    this.map.hasOwnProperty(e) && i.call(t, this.map[e], e, this);
};
Pt.prototype.keys = function() {
  var i = [];
  return this.forEach(function(t, e) {
    i.push(e);
  }), Po(i);
};
Pt.prototype.values = function() {
  var i = [];
  return this.forEach(function(t) {
    i.push(t);
  }), Po(i);
};
Pt.prototype.entries = function() {
  var i = [];
  return this.forEach(function(t, e) {
    i.push([e, t]);
  }), Po(i);
};
Jt.iterable && (Pt.prototype[Symbol.iterator] = Pt.prototype.entries);
function ls(i) {
  if (!i._noBody) {
    if (i.bodyUsed)
      return Promise.reject(new TypeError("Already read"));
    i.bodyUsed = !0;
  }
}
function Yg(i) {
  return new Promise(function(t, e) {
    i.onload = function() {
      t(i.result);
    }, i.onerror = function() {
      e(i.error);
    };
  });
}
function TC(i) {
  var t = new FileReader(), e = Yg(t);
  return t.readAsArrayBuffer(i), e;
}
function MC(i) {
  var t = new FileReader(), e = Yg(t), n = /charset=([A-Za-z0-9_-]+)/.exec(i.type), r = n ? n[1] : "utf-8";
  return t.readAsText(i, r), e;
}
function _C(i) {
  for (var t = new Uint8Array(i), e = new Array(t.length), n = 0; n < t.length; n++)
    e[n] = String.fromCharCode(t[n]);
  return e.join("");
}
function rA(i) {
  if (i.slice)
    return i.slice(0);
  var t = new Uint8Array(i.byteLength);
  return t.set(new Uint8Array(i)), t.buffer;
}
function Hg() {
  return this.bodyUsed = !1, this._initBody = function(i) {
    this.bodyUsed = this.bodyUsed, this._bodyInit = i, i ? typeof i == "string" ? this._bodyText = i : Jt.blob && Blob.prototype.isPrototypeOf(i) ? this._bodyBlob = i : Jt.formData && FormData.prototype.isPrototypeOf(i) ? this._bodyFormData = i : Jt.searchParams && URLSearchParams.prototype.isPrototypeOf(i) ? this._bodyText = i.toString() : Jt.arrayBuffer && Jt.blob && bC(i) ? (this._bodyArrayBuffer = rA(i.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : Jt.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(i) || xC(i)) ? this._bodyArrayBuffer = rA(i) : this._bodyText = i = Object.prototype.toString.call(i) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof i == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : Jt.searchParams && URLSearchParams.prototype.isPrototypeOf(i) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
  }, Jt.blob && (this.blob = function() {
    var i = ls(this);
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
      var i = ls(this);
      return i || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
        this._bodyArrayBuffer.buffer.slice(
          this._bodyArrayBuffer.byteOffset,
          this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
        )
      ) : Promise.resolve(this._bodyArrayBuffer));
    } else {
      if (Jt.blob)
        return this.blob().then(TC);
      throw new Error("could not read as ArrayBuffer");
    }
  }, this.text = function() {
    var i = ls(this);
    if (i)
      return i;
    if (this._bodyBlob)
      return MC(this._bodyBlob);
    if (this._bodyArrayBuffer)
      return Promise.resolve(_C(this._bodyArrayBuffer));
    if (this._bodyFormData)
      throw new Error("could not read FormData body as text");
    return Promise.resolve(this._bodyText);
  }, Jt.formData && (this.formData = function() {
    return this.text().then(kC);
  }), this.json = function() {
    return this.text().then(JSON.parse);
  }, this;
}
var SC = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
function RC(i) {
  var t = i.toUpperCase();
  return SC.indexOf(t) > -1 ? t : i;
}
function li(i, t) {
  if (!(this instanceof li))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  t = t || {};
  var e = t.body;
  if (i instanceof li) {
    if (i.bodyUsed)
      throw new TypeError("Already read");
    this.url = i.url, this.credentials = i.credentials, t.headers || (this.headers = new Pt(i.headers)), this.method = i.method, this.mode = i.mode, this.signal = i.signal, !e && i._bodyInit != null && (e = i._bodyInit, i.bodyUsed = !0);
  } else
    this.url = String(i);
  if (this.credentials = t.credentials || this.credentials || "same-origin", (t.headers || !this.headers) && (this.headers = new Pt(t.headers)), this.method = RC(t.method || this.method || "GET"), this.mode = t.mode || this.mode || null, this.signal = t.signal || this.signal || (function() {
    if ("AbortController" in jt) {
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
li.prototype.clone = function() {
  return new li(this, { body: this._bodyInit });
};
function kC(i) {
  var t = new FormData();
  return i.trim().split("&").forEach(function(e) {
    if (e) {
      var n = e.split("="), r = n.shift().replace(/\+/g, " "), s = n.join("=").replace(/\+/g, " ");
      t.append(decodeURIComponent(r), decodeURIComponent(s));
    }
  }), t;
}
function PC(i) {
  var t = new Pt(), e = i.replace(/\r?\n[\t ]+/g, " ");
  return e.split("\r").map(function(n) {
    return n.indexOf(`
`) === 0 ? n.substr(1, n.length) : n;
  }).forEach(function(n) {
    var r = n.split(":"), s = r.shift().trim();
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
Hg.call(li.prototype);
function Te(i, t) {
  if (!(this instanceof Te))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  if (t || (t = {}), this.type = "default", this.status = t.status === void 0 ? 200 : t.status, this.status < 200 || this.status > 599)
    throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
  this.ok = this.status >= 200 && this.status < 300, this.statusText = t.statusText === void 0 ? "" : "" + t.statusText, this.headers = new Pt(t.headers), this.url = t.url || "", this._initBody(i);
}
Hg.call(Te.prototype);
Te.prototype.clone = function() {
  return new Te(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Pt(this.headers),
    url: this.url
  });
};
Te.error = function() {
  var i = new Te(null, { status: 200, statusText: "" });
  return i.ok = !1, i.status = 0, i.type = "error", i;
};
var OC = [301, 302, 303, 307, 308];
Te.redirect = function(i, t) {
  if (OC.indexOf(t) === -1)
    throw new RangeError("Invalid status code");
  return new Te(null, { status: t, headers: { location: i } });
};
var ei = jt.DOMException;
try {
  new ei();
} catch {
  ei = function(t, e) {
    this.message = t, this.name = e;
    var n = Error(t);
    this.stack = n.stack;
  }, ei.prototype = Object.create(Error.prototype), ei.prototype.constructor = ei;
}
function Qg(i, t) {
  return new Promise(function(e, n) {
    var r = new li(i, t);
    if (r.signal && r.signal.aborted)
      return n(new ei("Aborted", "AbortError"));
    var s = new XMLHttpRequest();
    function o() {
      s.abort();
    }
    s.onload = function() {
      var g = {
        statusText: s.statusText,
        headers: PC(s.getAllResponseHeaders() || "")
      };
      r.url.indexOf("file://") === 0 && (s.status < 200 || s.status > 599) ? g.status = 200 : g.status = s.status, g.url = "responseURL" in s ? s.responseURL : g.headers.get("X-Request-URL");
      var c = "response" in s ? s.response : s.responseText;
      setTimeout(function() {
        e(new Te(c, g));
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
        n(new ei("Aborted", "AbortError"));
      }, 0);
    };
    function a(g) {
      try {
        return g === "" && jt.location.href ? jt.location.href : g;
      } catch {
        return g;
      }
    }
    if (s.open(r.method, a(r.url), !0), r.credentials === "include" ? s.withCredentials = !0 : r.credentials === "omit" && (s.withCredentials = !1), "responseType" in s && (Jt.blob ? s.responseType = "blob" : Jt.arrayBuffer && (s.responseType = "arraybuffer")), t && typeof t.headers == "object" && !(t.headers instanceof Pt || jt.Headers && t.headers instanceof jt.Headers)) {
      var A = [];
      Object.getOwnPropertyNames(t.headers).forEach(function(g) {
        A.push(Ji(g)), s.setRequestHeader(g, ko(t.headers[g]));
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
Qg.polyfill = !0;
jt.fetch || (jt.fetch = Qg, jt.Headers = Pt, jt.Request = li, jt.Response = Te);
const Kg = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAAqACAAQAAAABAAAANKADAAQAAAABAAAANAAAAAD/4QkhaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/4hskSUNDX1BST0ZJTEUAAQEAABsUYXBwbAIQAABtbnRyUkdCIFhZWiAH4AAKAB0AFAA0AAZhY3NwQVBQTAAAAABBUFBMAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFkZXNjAAABUAAAAGJkc2NtAAABtAAABBhjcHJ0AAAFzAAAACN3dHB0AAAF8AAAABRyWFlaAAAGBAAAABRnWFlaAAAGGAAAABRiWFlaAAAGLAAAABRyVFJDAAAGQAAACAxhYXJnAAAOTAAAACB2Y2d0AAAObAAABhJuZGluAAAUgAAABj5jaGFkAAAawAAAACxtbW9kAAAa7AAAAChiVFJDAAAGQAAACAxnVFJDAAAGQAAACAxhYWJnAAAOTAAAACBhYWdnAAAOTAAAACBkZXNjAAAAAAAAAAhEaXNwbGF5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbWx1YwAAAAAAAAAiAAAADGhySFIAAAAUAAABqGtvS1IAAAAMAAABvG5iTk8AAAASAAAByGlkAAAAAAASAAAB2mh1SFUAAAAUAAAB7GNzQ1oAAAAWAAACAGRhREsAAAAcAAACFnVrVUEAAAAcAAACMmFyAAAAAAAUAAACTml0SVQAAAAUAAACYnJvUk8AAAASAAACdm5sTkwAAAAWAAACiGhlSUwAAAAWAAACnmVzRVMAAAASAAACdmZpRkkAAAAQAAACtHpoVFcAAAAMAAACxHZpVk4AAAAOAAAC0HNrU0sAAAAWAAAC3npoQ04AAAAMAAACxHJ1UlUAAAAkAAAC9GZyRlIAAAAWAAADGG1zAAAAAAASAAADLmNhRVMAAAAYAAADQHRoVEgAAAAMAAADWGVzWEwAAAASAAACdmRlREUAAAAQAAADZGVuVVMAAAASAAADdHB0QlIAAAAYAAADhnBsUEwAAAASAAADnmVsR1IAAAAiAAADsHN2U0UAAAAQAAAD0nRyVFIAAAAUAAAD4mphSlAAAAAMAAAD9nB0UFQAAAAWAAAEAgBMAEMARAAgAHUAIABiAG8AagBpzuy37AAgAEwAQwBEAEYAYQByAGcAZQAtAEwAQwBEAEwAQwBEACAAVwBhAHIAbgBhAFMAegDtAG4AZQBzACAATABDAEQAQgBhAHIAZQB2AG4A/QAgAEwAQwBEAEwAQwBEAC0AZgBhAHIAdgBlAHMAawDmAHIAbQQaBD4EOwRMBD4EQAQ+BDIEOAQ5ACAATABDAEQgDwBMAEMARAAgBkUGRAZIBkYGKQBMAEMARAAgAGMAbwBsAG8AcgBpAEwAQwBEACAAYwBvAGwAbwByAEsAbABlAHUAcgBlAG4ALQBMAEMARCAPAEwAQwBEACAF5gXRBeIF1QXgBdkAVgDkAHIAaQAtAEwAQwBEX2mCcgAgAEwAQwBEAEwAQwBEACAATQDgAHUARgBhAHIAZQBiAG4A6QAgAEwAQwBEBCYEMgQ1BEIEPQQ+BDkAIAQWBBoALQQ0BDgEQQQ/BDsENQQ5AEwAQwBEACAAYwBvAHUAbABlAHUAcgBXAGEAcgBuAGEAIABMAEMARABMAEMARAAgAGUAbgAgAGMAbwBsAG8AcgBMAEMARAAgDioONQBGAGEAcgBiAC0ATABDAEQAQwBvAGwAbwByACAATABDAEQATABDAEQAIABDAG8AbABvAHIAaQBkAG8ASwBvAGwAbwByACAATABDAEQDiAOzA8cDwQPJA7wDtwAgA78DuAPMA70DtwAgAEwAQwBEAEYA5AByAGcALQBMAEMARABSAGUAbgBrAGwAaQAgAEwAQwBEMKsw6TD8AEwAQwBEAEwAQwBEACAAYQAgAEMAbwByAGUAc3RleHQAAAAAQ29weXJpZ2h0IEFwcGxlIEluYy4sIDIwMTYAAFhZWiAAAAAAAADzUgABAAAAARbPWFlaIAAAAAAAAGXoAAA8EAAACdBYWVogAAAAAAAAapMAAKrFAAAXilhZWiAAAAAAAAAmWwAAGSwAALHSY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA2ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKMAqACtALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkH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", Jg = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAAqACAAQAAAABAAAANKADAAQAAAABAAAANAAAAAD/4QkhaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/4gKESUNDX1BST0ZJTEUAAQEAAAJ0YXBwbAQAAABtbnRyUkdCIFhZWiAH3AALAAwAEgA6ABdhY3NwQVBQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGxmSfnZPIV3n7QGSpkeOnQsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtkZXNjAAABCAAAAGNkc2NtAAABbAAAACxjcHJ0AAABmAAAAC13dHB0AAAByAAAABRyWFlaAAAB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", qg = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCARXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAKgAgAEAAAAAQAAADSgAwAEAAAAAQAAADQAAAAA/+EJIWh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/PgD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/+IbJElDQ19QUk9GSUxFAAEBAAAbFGFwcGwCEAAAbW50clJHQiBYWVogB+EABAAEABcABgAzYWNzcEFQUEwAAAAAQVBQTAAAAAAAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1hcHBsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARZGVzYwAAAVAAAABiZHNjbQAAAbQAAAQYY3BydAAABcwAAAAjd3RwdAAABfAAAAAUclhZWgAABgQAAAAUZ1hZWgAABhgAAAAUYlhZWgAABiwAAAAUclRSQwAABkAAAAgMYWFyZwAADkwAAAAgdmNndAAADmwAAAYSbmRpbgAAFIAAAAY+Y2hhZAAAGsAAAAAsbW1vZAAAGuwAAAAoYlRSQwAABkAAAAgMZ1RSQwAABkAAAAgMYWFiZwAADkwAAAAgYWFnZwAADkwAAAAgZGVzYwAAAAAAAAAIRGlzcGxheQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG1sdWMAAAAAAAAAIgAAAAxockhSAAAAFAAAAahrb0tSAAAADAAAAbxuYk5PAAAAEgAAAchpZAAAAAAAEgAAAdpodUhVAAAAFAAAAexjc0NaAAAAFgAAAgBkYURLAAAAHAAAAhZ1a1VBAAAAHAAAAjJhcgAAAAAAFAAAAk5pdElUAAAAFAAAAmJyb1JPAAAAEgAAAnZubE5MAAAAFgAAAohoZUlMAAAAFgAAAp5lc0VTAAAAEgAAAnZmaUZJAAAAEAAAArR6aFRXAAAADAAAAsR2aVZOAAAADgAAAtBza1NLAAAAFgAAAt56aENOAAAADAAAAsRydVJVAAAAJAAAAvRmckZSAAAAFgAAAxhtcwAAAAAAEgAAAy5jYUVTAAAAGAAAA0B0aFRIAAAADAAAA1hlc1hMAAAAEgAAAnZkZURFAAAAEAAAA2RlblVTAAAAEgAAA3RwdEJSAAAAGAAAA4ZwbFBMAAAAEgAAA55lbEdSAAAAIgAAA7BzdlNFAAAAEAAAA9J0clRSAAAAFAAAA+JqYUpQAAAADAAAA/ZwdFBUAAAAFgAABAIATABDAEQAIAB1ACAAYgBvAGoAac7st+wAIABMAEMARABGAGEAcgBnAGUALQBMAEMARABMAEMARAAgAFcAYQByAG4AYQBTAHoA7QBuAGUAcwAgAEwAQwBEAEIAYQByAGUAdgBuAP0AIABMAEMARABMAEMARAAtAGYAYQByAHYAZQBzAGsA5gByAG0EGgQ+BDsETAQ+BEAEPgQyBDgEOQAgAEwAQwBEIA8ATABDAEQAIAZFBkQGSAZGBikATABDAEQAIABjAG8AbABvAHIAaQBMAEMARAAgAGMAbwBsAG8AcgBLAGwAZQB1AHIAZQBuAC0ATABDAEQgDwBMAEMARAAgBeYF0QXiBdUF4AXZAFYA5AByAGkALQBMAEMARF9pgnIAIABMAEMARABMAEMARAAgAE0A4AB1AEYAYQByAGUAYgBuAP0AIABMAEMARAQmBDIENQRCBD0EPgQ5ACAEFgQaAC0ENAQ4BEEEPwQ7BDUEOQBMAEMARAAgAGMAbwB1AGwAZQB1AHIAVwBhAHIAbgBhACAATABDAEQATABDAEQAIABlAG4AIABjAG8AbABvAHIATABDAEQAIA4qDjUARgBhAHIAYgAtAEwAQwBEAEMAbwBsAG8AcgAgAEwAQwBEAEwAQwBEACAAQwBvAGwAbwByAGkAZABvAEsAbwBsAG8AcgAgAEwAQwBEA4gDswPHA8EDyQO8A7cAIAO/A7gDzAO9A7cAIABMAEMARABGAOQAcgBnAC0ATABDAEQAUgBlAG4AawBsAGkAIABMAEMARDCrMOkw/ABMAEMARABMAEMARAAgAGEAIABDAG8AcgBlAHN0ZXh0AAAAAENvcHlyaWdodCBBcHBsZSBJbmMuLCAyMDE3AABYWVogAAAAAAAA81IAAQAAAAEWz1hZWiAAAAAAAABl6AAAPBAAAAnQWFlaIAAAAAAAAGqTAACqxQAAF4pYWVogAAAAAAAAJlsAABksAACx0mN1cnYAAAAAAAAEAAAAAAUACgAPABQAGQAeACMAKAAtADIANgA7AEAARQBKAE8AVABZAF4AYwBoAG0AcgB3AHwAgQCGAIsAkACVAJoAnwCjAKgArQCyALcAvADBAMYAywDQANUA2wDgAOUA6wDwAPYA+wEBAQcBDQETARkBHwElASsBMgE4AT4BRQFMAVIBWQFgAWcBbgF1AXwBgwGLAZIBmgGhAakBsQG5AcEByQHRAdkB4QHpAfIB+gIDAgwCFAIdAiYCLwI4AkECSwJUAl0CZwJxAnoChAKOApgCogKsArYCwQLLAtUC4ALrAvUDAAMLAxYDIQMtAzgDQwNPA1oDZgNyA34DigOWA6IDrgO6A8cD0wPgA+wD+QQGBBMEIAQtBDsESARVBGMEcQR+BIwEmgSoBLYExATTBOEE8AT+BQ0FHAUrBToFSQVYBWcF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", LC = {
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
    thumbnail: Kg,
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
    thumbnail: Jg
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
    thumbnail: qg
  }
}, sA = (i) => (i || "").match(/^(?:base|overlay|google(?:_(?:roadmap|satellite|hybrid|terrain))?|mapbox|maplibre|osm)$/);
async function DC(i, t) {
  typeof i == "string" && (i = { ...LC[i] }), i = xe(Object.assign(i, t));
  const e = i.label || i.year;
  if (e !== void 0 && (i.label = e), sA(i.maptype)) {
    const A = i.maptype === "base" ? Yi : i.maptype === "overlay" ? Li : i.maptype === "mapbox" ? Cr : i.maptype === "maplibre" ? fr : Zs;
    A.isBasemap() ? (i.homePosition = i.homePos, i.mercZoom = i.defZoom) : (i.homePosition || (i.homePosition = i.homePos), i.mercZoom || (i.mercZoom = i.defZoom)), delete i.homePos, delete i.defZoom, i.zoomRestriction && (i.maxZoom = i.maxZoom || i.mercMaxZoom, i.minZoom = i.minZoom || i.mercMinZoom), i.zoomRestriction = i.mercMaxZoom = i.mercMinZoom = void 0, i.imageExtension || (i.imageExtension = "jpg"), Us(i.maptype) ? (delete i.url, delete i.urls) : i.mapID && !i.url && !i.urls && (i.url = i.tms ? `tiles/${i.mapID}/{z}/{x}/{-y}.${i.imageExtension}` : `tiles/${i.mapID}/{z}/{x}/{y}.${i.imageExtension}`), i.weiwudi = await us(i), i.weiwudi && (i.url = i.weiwudi.url, delete i.urls);
    const g = await A.createAsync(i);
    return await g.initialWait, g;
  } else if (i.noload) {
    i.mercMaxZoom = i.mercMinZoom = void 0;
    const A = Pa(i);
    A && await iA(i, {
      width: i.width,
      height: i.height
    });
    const g = new vr(i);
    return A && nA(g, i), g;
  }
  const n = i.settingFile || `maps/${i.mapID}.json`, r = await fetch(n);
  if (!r.ok)
    throw new Error("Fail to load map json");
  const s = await r.json();
  if (i = xe(Object.assign(s, i)), i.label = i.label || s.year, i.maptype || (i.maptype = "maplat"), sA(i.maptype)) {
    const A = i.maptype === "base" ? Yi : i.maptype === "overlay" ? Li : i.maptype === "mapbox" ? Cr : i.maptype === "maplibre" ? fr : Zs;
    A.isBasemap() ? (i.homePosition = i.homePos, i.mercZoom = i.defZoom) : (i.homePosition || (i.homePosition = i.homePos), i.mercZoom || (i.mercZoom = i.defZoom)), delete i.homePos, delete i.defZoom, i.zoomRestriction && (i.maxZoom = i.maxZoom || i.mercMaxZoom, i.minZoom = i.minZoom || i.mercMinZoom), i.zoomRestriction = i.mercMaxZoom = i.mercMinZoom = void 0, i.imageExtension || (i.imageExtension = "jpg"), Us(i.maptype) ? (delete i.url, delete i.urls) : i.mapID && !i.url && !i.urls && (i.url = i.tms ? `tiles/${i.mapID}/{z}/{x}/{-y}.${i.imageExtension}` : `tiles/${i.mapID}/{z}/{x}/{y}.${i.imageExtension}`), i.weiwudi = await us(i), i.weiwudi && (i.url = i.weiwudi.url, delete i.urls);
    const g = await A.createAsync(i);
    try {
      return await g.initialWait, g;
    } catch {
      return g;
    }
  }
  delete i.homePos, delete i.defZoom, i.imageExtension || (i.imageExtension = "jpg");
  const o = Pa(i);
  if (!o && i.mapID && !i.url && !i.urls && (i.url = `tiles/${i.mapID}/{z}/{x}/{y}.${i.imageExtension}`), !i.compiled || !i.compiled.wh)
    throw console.error(
      `[Maplat] Missing compiled.wh for mapID=${i.mapID}. Check map setting file: ${n}`
    ), new Error(`Map ${i.mapID} is missing compiled data.`);
  i.width = i.width || i.compiled.wh[0], i.height = i.height || i.compiled.wh[1], o && await iA(i, {
    width: i.compiled.wh[0],
    height: i.compiled.wh[1]
  }), i.weiwudi = await us(i), i.weiwudi && (i.url = i.weiwudi.url, delete i.urls);
  const a = await vr.createAsync(i);
  return nA(a, i), await a.initialWait, await new Promise((A) => {
    a.setupMapParameter(() => A());
  }), a;
}
async function us(i) {
  const t = {};
  if (i.maptype === "mapbox" || i.maptype === "maplibre" || i.maptype === "google" || !i.enableCache || i.noCache === !0 || fh(i)) return;
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
    n = await be.registerMap(i.mapID, t);
  } catch {
  }
  return n;
}
function hs(i, t) {
  return i + (Math.random() - 0.5) * t;
}
function Vs(i, t) {
  if (i instanceof Array)
    return i.map((n) => Vs(n, t));
  const e = Math.pow(10, t);
  return Math.round(i * e) / e;
}
function BC(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
var Ys = { exports: {} }, NC = Ys.exports, oA;
function FC() {
  return oA || (oA = 1, (function(i, t) {
    (function(e, n) {
      i.exports = n();
    })(typeof self < "u" ? self : NC, function() {
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
          return r.m = e, r.c = n, r.d = function(s, o, a) {
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
          (function(e, g, r) {
            var s = Array.prototype, o = Object.prototype, a = {
              "&": "&amp;",
              '"': "&quot;",
              "'": "&#39;",
              "<": "&lt;",
              ">": "&gt;",
              "\\": "&#92;"
            }, A = /[&"'<>\\]/g, g = e.exports = {};
            function c(k, X) {
              return o.hasOwnProperty.call(k, X);
            }
            g.hasOwnProp = c;
            function u(k) {
              return a[k];
            }
            function C(k, X, Z) {
              if (Z.Update || (Z = new g.TemplateError(Z)), Z.Update(k), !X) {
                var W = Z;
                Z = new Error(W.message), Z.name = W.name;
              }
              return Z;
            }
            g._prettifyError = C;
            function p(k, X, Z) {
              var W, nt;
              k instanceof Error && (nt = k, k = nt.name + ": " + nt.message), Object.setPrototypeOf ? (W = new Error(k), Object.setPrototypeOf(W, p.prototype)) : (W = this, Object.defineProperty(W, "message", {
                enumerable: !1,
                writable: !0,
                value: k
              })), Object.defineProperty(W, "name", {
                value: "Template render error"
              }), Error.captureStackTrace && Error.captureStackTrace(W, this.constructor);
              var rt;
              if (nt) {
                var st = Object.getOwnPropertyDescriptor(nt, "stack");
                rt = st && (st.get || function() {
                  return st.value;
                }), rt || (rt = function() {
                  return nt.stack;
                });
              } else {
                var tt = new Error(k).stack;
                rt = function() {
                  return tt;
                };
              }
              return Object.defineProperty(W, "stack", {
                get: function() {
                  return rt.call(W);
                }
              }), Object.defineProperty(W, "cause", {
                value: nt
              }), W.lineno = X, W.colno = Z, W.firstUpdate = !0, W.Update = function(ut) {
                var at = "(" + (ut || "unknown path") + ")";
                return this.firstUpdate && (this.lineno && this.colno ? at += " [Line " + this.lineno + ", Column " + this.colno + "]" : this.lineno && (at += " [Line " + this.lineno + "]")), at += `
 `, this.firstUpdate && (at += " "), this.message = at + (this.message || ""), this.firstUpdate = !1, this;
              }, W;
            }
            Object.setPrototypeOf ? Object.setPrototypeOf(p.prototype, Error.prototype) : p.prototype = Object.create(Error.prototype, {
              constructor: {
                value: p
              }
            }), g.TemplateError = p;
            function m(k) {
              return k.replace(A, u);
            }
            g.escape = m;
            function l(k) {
              return o.toString.call(k) === "[object Function]";
            }
            g.isFunction = l;
            function h(k) {
              return o.toString.call(k) === "[object Array]";
            }
            g.isArray = h;
            function I(k) {
              return o.toString.call(k) === "[object String]";
            }
            g.isString = I;
            function d(k) {
              return o.toString.call(k) === "[object Object]";
            }
            g.isObject = d;
            function E(k) {
              return k ? typeof k == "string" ? k.split(".") : [k] : [];
            }
            function v(k) {
              var X = E(k);
              return function(Z) {
                for (var W = Z, nt = 0; nt < X.length; nt++) {
                  var rt = X[nt];
                  if (c(W, rt))
                    W = W[rt];
                  else
                    return;
                }
                return W;
              };
            }
            g.getAttrGetter = v;
            function f(k, X, Z) {
              for (var W = {}, nt = l(X) ? X : v(X), rt = 0; rt < k.length; rt++) {
                var st = k[rt], tt = nt(st, rt);
                if (tt === void 0 && Z === !0)
                  throw new TypeError('groupby: attribute "' + X + '" resolved to undefined');
                (W[tt] || (W[tt] = [])).push(st);
              }
              return W;
            }
            g.groupBy = f;
            function y(k) {
              return Array.prototype.slice.call(k);
            }
            g.toArray = y;
            function w(k) {
              var X = [];
              if (!k)
                return X;
              for (var Z = k.length, W = y(arguments).slice(1), nt = -1; ++nt < Z; )
                L(W, k[nt]) === -1 && X.push(k[nt]);
              return X;
            }
            g.without = w;
            function T(k, X) {
              for (var Z = "", W = 0; W < X; W++)
                Z += k;
              return Z;
            }
            g.repeat = T;
            function M(k, X, Z) {
              if (k != null) {
                if (s.forEach && k.forEach === s.forEach)
                  k.forEach(X, Z);
                else if (k.length === +k.length)
                  for (var W = 0, nt = k.length; W < nt; W++)
                    X.call(Z, k[W], W, k);
              }
            }
            g.each = M;
            function x(k, X) {
              var Z = [];
              if (k == null)
                return Z;
              if (s.map && k.map === s.map)
                return k.map(X);
              for (var W = 0; W < k.length; W++)
                Z[Z.length] = X(k[W], W);
              return k.length === +k.length && (Z.length = k.length), Z;
            }
            g.map = x;
            function _(k, X, Z) {
              var W = -1;
              function nt() {
                W++, W < k.length ? X(k[W], W, nt, Z) : Z();
              }
              nt();
            }
            g.asyncIter = _;
            function S(k, X, Z) {
              var W = D(k || {}), nt = W.length, rt = -1;
              function st() {
                rt++;
                var tt = W[rt];
                rt < nt ? X(tt, k[tt], rt, nt, st) : Z();
              }
              st();
            }
            g.asyncFor = S;
            function L(k, X, Z) {
              return Array.prototype.indexOf.call(k || [], X, Z);
            }
            g.indexOf = L;
            function D(k) {
              var X = [];
              for (var Z in k)
                c(k, Z) && X.push(Z);
              return X;
            }
            g.keys = D;
            function F(k) {
              return D(k).map(function(X) {
                return [X, k[X]];
              });
            }
            g._entries = F;
            function j(k) {
              return D(k).map(function(X) {
                return k[X];
              });
            }
            g._values = j;
            function R(k, X) {
              return k = k || {}, D(X).forEach(function(Z) {
                k[Z] = X[Z];
              }), k;
            }
            g._assign = g.extend = R;
            function B(k, X) {
              if (h(X) || I(X))
                return X.indexOf(k) !== -1;
              if (d(X))
                return k in X;
              throw new Error('Cannot use "in" operator to search for "' + k + '" in unexpected types.');
            }
            g.inOperator = B;
          }),
          /* 1 */
          /***/
          (function(e, n, r) {
            function s(I, d) {
              for (var E = 0; E < d.length; E++) {
                var v = d[E];
                v.enumerable = v.enumerable || !1, v.configurable = !0, "value" in v && (v.writable = !0), Object.defineProperty(I, a(v.key), v);
              }
            }
            function o(I, d, E) {
              return d && s(I.prototype, d), Object.defineProperty(I, "prototype", { writable: !1 }), I;
            }
            function a(I) {
              var d = A(I, "string");
              return typeof d == "symbol" ? d : String(d);
            }
            function A(I, d) {
              if (typeof I != "object" || I === null) return I;
              var E = I[Symbol.toPrimitive];
              if (E !== void 0) {
                var v = E.call(I, d);
                if (typeof v != "object") return v;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return String(I);
            }
            function g(I, d) {
              I.prototype = Object.create(d.prototype), I.prototype.constructor = I, c(I, d);
            }
            function c(I, d) {
              return c = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(E, v) {
                return E.__proto__ = v, E;
              }, c(I, d);
            }
            var u = r(16), C = r(0);
            function p(I, d) {
              return typeof I != "function" || typeof d != "function" ? d : function() {
                var E = this.parent;
                this.parent = I;
                var v = d.apply(this, arguments);
                return this.parent = E, v;
              };
            }
            function m(I, d, E) {
              E = E || {}, C.keys(E).forEach(function(f) {
                E[f] = p(I.prototype[f], E[f]);
              });
              var v = /* @__PURE__ */ (function(f) {
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
              })(I);
              return C._assign(v.prototype, E), v;
            }
            var l = /* @__PURE__ */ (function() {
              function I() {
                this.init.apply(this, arguments);
              }
              var d = I.prototype;
              return d.init = function() {
              }, I.extend = function(E, v) {
                return typeof E == "object" && (v = E, E = "anonymous"), m(this, E, v);
              }, o(I, [{
                key: "typename",
                get: function() {
                  return this.constructor.name;
                }
              }]), I;
            })(), h = /* @__PURE__ */ (function(I) {
              g(d, I);
              function d() {
                var v, f;
                return f = I.call(this) || this, (v = f).init.apply(v, arguments), f;
              }
              var E = d.prototype;
              return E.init = function() {
              }, d.extend = function(v, f) {
                return typeof v == "object" && (f = v, v = "anonymous"), m(this, v, f);
              }, o(d, [{
                key: "typename",
                get: function() {
                  return this.constructor.name;
                }
              }]), d;
            })(u);
            e.exports = {
              Obj: l,
              EmitterObj: h
            };
          }),
          /* 2 */
          /***/
          (function(e, n, r) {
            var s = r(0), o = Array.from, a = typeof Symbol == "function" && Symbol.iterator && typeof o == "function", A = /* @__PURE__ */ (function() {
              function x(S, L) {
                this.variables = /* @__PURE__ */ Object.create(null), this.parent = S, this.topLevel = !1, this.isolateWrites = L;
              }
              var _ = x.prototype;
              return _.set = function(S, L, D) {
                var F = S.split("."), j = this.variables, R = this;
                if (D && (R = this.resolve(F[0], !0))) {
                  R.set(S, L);
                  return;
                }
                for (var B = 0; B < F.length - 1; B++) {
                  var k = F[B];
                  j[k] || (j[k] = {}), j = j[k];
                }
                j[F[F.length - 1]] = L;
              }, _.get = function(S) {
                var L = this.variables[S];
                return L !== void 0 ? L : null;
              }, _.lookup = function(S) {
                var L = this.parent, D = this.variables[S];
                return D !== void 0 ? D : L && L.lookup(S);
              }, _.resolve = function(S, L) {
                var D = L && this.isolateWrites ? void 0 : this.parent, F = this.variables[S];
                return F !== void 0 ? this : D && D.resolve(S);
              }, _.push = function(S) {
                return new x(this, S);
              }, _.pop = function() {
                return this.parent;
              }, x;
            })();
            function g(x, _, S) {
              return function() {
                for (var L = arguments.length, D = new Array(L), F = 0; F < L; F++)
                  D[F] = arguments[F];
                var j = p(D), R, B = C(D);
                if (j > x.length)
                  R = D.slice(0, x.length), D.slice(R.length, j).forEach(function(Z, W) {
                    W < _.length && (B[_[W]] = Z);
                  }), R.push(B);
                else if (j < x.length) {
                  R = D.slice(0, j);
                  for (var k = j; k < x.length; k++) {
                    var X = x[k];
                    R.push(B[X]), delete B[X];
                  }
                  R.push(B);
                } else
                  R = D;
                return S.apply(this, R);
              };
            }
            function c(x) {
              return x.__keywords = !0, x;
            }
            function u(x) {
              return x && Object.prototype.hasOwnProperty.call(x, "__keywords");
            }
            function C(x) {
              var _ = x.length;
              if (_) {
                var S = x[_ - 1];
                if (u(S))
                  return S;
              }
              return {};
            }
            function p(x) {
              var _ = x.length;
              if (_ === 0)
                return 0;
              var S = x[_ - 1];
              return u(S) ? _ - 1 : _;
            }
            function m(x) {
              if (typeof x != "string")
                return x;
              this.val = x, this.length = x.length;
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
            function l(x, _) {
              return x instanceof m ? new m(_) : _.toString();
            }
            function h(x) {
              var _ = typeof x;
              return _ === "string" ? new m(x) : _ !== "function" ? x : function(S) {
                var L = x.apply(this, arguments);
                return typeof L == "string" ? new m(L) : L;
              };
            }
            function I(x, _) {
              return x = x ?? "", _ && !(x instanceof m) && (x = s.escape(x.toString())), x;
            }
            function d(x, _, S) {
              if (x == null)
                throw new s.TemplateError("attempted to output null or undefined value", _ + 1, S + 1);
              return x;
            }
            function E(x, _) {
              if (x != null)
                return typeof x[_] == "function" ? function() {
                  for (var S = arguments.length, L = new Array(S), D = 0; D < S; D++)
                    L[D] = arguments[D];
                  return x[_].apply(x, L);
                } : x[_];
            }
            function v(x, _, S, L) {
              if (x) {
                if (typeof x != "function")
                  throw new Error("Unable to call `" + _ + "`, which is not a function");
              } else throw new Error("Unable to call `" + _ + "`, which is undefined or falsey");
              return x.apply(S, L);
            }
            function f(x, _, S) {
              var L = _.lookup(S);
              return L !== void 0 ? L : x.lookup(S);
            }
            function y(x, _, S) {
              return x.lineno ? x : new s.TemplateError(x, _, S);
            }
            function w(x, _, S, L) {
              if (s.isArray(x)) {
                var D = x.length;
                s.asyncIter(x, function(F, j, R) {
                  switch (_) {
                    case 1:
                      S(F, j, D, R);
                      break;
                    case 2:
                      S(F[0], F[1], j, D, R);
                      break;
                    case 3:
                      S(F[0], F[1], F[2], j, D, R);
                      break;
                    default:
                      F.push(j, D, R), S.apply(this, F);
                  }
                }, L);
              } else
                s.asyncFor(x, function(F, j, R, B, k) {
                  S(F, j, R, B, k);
                }, L);
            }
            function T(x, _, S, L) {
              var D = 0, F, j;
              function R(nt, rt) {
                D++, j[nt] = rt, D === F && L(null, j.join(""));
              }
              if (s.isArray(x))
                if (F = x.length, j = new Array(F), F === 0)
                  L(null, "");
                else
                  for (var B = 0; B < x.length; B++) {
                    var k = x[B];
                    switch (_) {
                      case 1:
                        S(k, B, F, R);
                        break;
                      case 2:
                        S(k[0], k[1], B, F, R);
                        break;
                      case 3:
                        S(k[0], k[1], k[2], B, F, R);
                        break;
                      default:
                        k.push(B, F, R), S.apply(this, k);
                    }
                  }
              else {
                var X = s.keys(x || {});
                if (F = X.length, j = new Array(F), F === 0)
                  L(null, "");
                else
                  for (var Z = 0; Z < X.length; Z++) {
                    var W = X[Z];
                    S(W, x[W], Z, F, R);
                  }
              }
            }
            function M(x) {
              return typeof x != "object" || x === null || s.isArray(x) ? x : a && Symbol.iterator in x ? o(x) : x;
            }
            e.exports = {
              Frame: A,
              makeMacro: g,
              makeKeywordArgs: c,
              numArgs: p,
              suppressValue: I,
              ensureDefined: d,
              memberLookup: E,
              contextOrFrameLookup: f,
              callWrap: v,
              handleError: y,
              isArray: s.isArray,
              keys: s.keys,
              SafeString: m,
              copySafeness: l,
              markSafe: h,
              asyncEach: w,
              asyncAll: T,
              inOperator: s.inOperator,
              fromIterator: M
            };
          }),
          /* 3 */
          /***/
          (function(e, n, r) {
            function s(J, $) {
              for (var It = 0; It < $.length; It++) {
                var ct = $[It];
                ct.enumerable = ct.enumerable || !1, ct.configurable = !0, "value" in ct && (ct.writable = !0), Object.defineProperty(J, a(ct.key), ct);
              }
            }
            function o(J, $, It) {
              return $ && s(J.prototype, $), Object.defineProperty(J, "prototype", { writable: !1 }), J;
            }
            function a(J) {
              var $ = A(J, "string");
              return typeof $ == "symbol" ? $ : String($);
            }
            function A(J, $) {
              if (typeof J != "object" || J === null) return J;
              var It = J[Symbol.toPrimitive];
              if (It !== void 0) {
                var ct = It.call(J, $);
                if (typeof ct != "object") return ct;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return String(J);
            }
            function g(J, $) {
              J.prototype = Object.create($.prototype), J.prototype.constructor = J, c(J, $);
            }
            function c(J, $) {
              return c = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(It, ct) {
                return It.__proto__ = ct, It;
              }, c(J, $);
            }
            var u = r(1), C = u.Obj;
            function p(J, $, It) {
              J instanceof $ && It.push(J), J instanceof m && J.findAll($, It);
            }
            var m = /* @__PURE__ */ (function(J) {
              g($, J);
              function $() {
                return J.apply(this, arguments) || this;
              }
              var It = $.prototype;
              return It.init = function(ct, ft) {
                for (var Et = arguments, Rt = this, le = arguments.length, Re = new Array(le > 2 ? le - 2 : 0), Ke = 2; Ke < le; Ke++)
                  Re[Ke - 2] = arguments[Ke];
                this.lineno = ct, this.colno = ft, this.fields.forEach(function(Rn, kn) {
                  var Ci = Et[kn + 2];
                  Ci === void 0 && (Ci = null), Rt[Rn] = Ci;
                });
              }, It.findAll = function(ct, ft) {
                var Et = this;
                return ft = ft || [], this instanceof h ? this.children.forEach(function(Rt) {
                  return p(Rt, ct, ft);
                }) : this.fields.forEach(function(Rt) {
                  return p(Et[Rt], ct, ft);
                }), ft;
              }, It.iterFields = function(ct) {
                var ft = this;
                this.fields.forEach(function(Et) {
                  ct(ft[Et], Et);
                });
              }, $;
            })(C), l = /* @__PURE__ */ (function(J) {
              g($, J);
              function $() {
                return J.apply(this, arguments) || this;
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
            })(m), h = /* @__PURE__ */ (function(J) {
              g($, J);
              function $() {
                return J.apply(this, arguments) || this;
              }
              var It = $.prototype;
              return It.init = function(ct, ft, Et) {
                J.prototype.init.call(this, ct, ft, Et || []);
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
            })(m), I = h.extend("Root"), d = l.extend("Literal"), E = l.extend("Symbol"), v = h.extend("Group"), f = h.extend("Array"), y = m.extend("Pair", {
              fields: ["key", "value"]
            }), w = h.extend("Dict"), T = m.extend("LookupVal", {
              fields: ["target", "val"]
            }), M = m.extend("If", {
              fields: ["cond", "body", "else_"]
            }), x = M.extend("IfAsync"), _ = m.extend("InlineIf", {
              fields: ["cond", "body", "else_"]
            }), S = m.extend("For", {
              fields: ["arr", "name", "body", "else_"]
            }), L = S.extend("AsyncEach"), D = S.extend("AsyncAll"), F = m.extend("Macro", {
              fields: ["name", "args", "body"]
            }), j = F.extend("Caller"), R = m.extend("Import", {
              fields: ["template", "target", "withContext"]
            }), B = /* @__PURE__ */ (function(J) {
              g($, J);
              function $() {
                return J.apply(this, arguments) || this;
              }
              var It = $.prototype;
              return It.init = function(ct, ft, Et, Rt, le) {
                J.prototype.init.call(this, ct, ft, Et, Rt || new h(), le);
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
            })(m), k = m.extend("FunCall", {
              fields: ["name", "args"]
            }), X = k.extend("Filter"), Z = X.extend("FilterAsync", {
              fields: ["name", "args", "symbol"]
            }), W = w.extend("KeywordArgs"), nt = m.extend("Block", {
              fields: ["name", "body"]
            }), rt = m.extend("Super", {
              fields: ["blockName", "symbol"]
            }), st = m.extend("TemplateRef", {
              fields: ["template"]
            }), tt = st.extend("Extends"), ut = m.extend("Include", {
              fields: ["template", "ignoreMissing"]
            }), at = m.extend("Set", {
              fields: ["targets", "value"]
            }), H = m.extend("Switch", {
              fields: ["expr", "cases", "default"]
            }), Q = m.extend("Case", {
              fields: ["cond", "body"]
            }), K = h.extend("Output"), yt = m.extend("Capture", {
              fields: ["body"]
            }), zt = d.extend("TemplateData"), ce = m.extend("UnaryOp", {
              fields: ["target"]
            }), vt = m.extend("BinOp", {
              fields: ["left", "right"]
            }), dt = vt.extend("In"), O = vt.extend("Is"), N = vt.extend("Or"), V = vt.extend("And"), Y = ce.extend("Not"), ot = vt.extend("Add"), et = vt.extend("Concat"), gt = vt.extend("Sub"), At = vt.extend("Mul"), bt = vt.extend("Div"), St = vt.extend("FloorDiv"), Vt = vt.extend("Mod"), Ce = vt.extend("Pow"), _e = ce.extend("Neg"), Se = ce.extend("Pos"), qi = m.extend("Compare", {
              fields: ["expr", "ops"]
            }), Ii = m.extend("CompareOperand", {
              fields: ["expr", "type"]
            }), je = m.extend("CallExtension", {
              init: function(J, $, It, ct) {
                this.parent(), this.extName = J.__name || J, this.prop = $, this.args = It || new h(), this.contentArgs = ct || [], this.autoescape = J.autoescape;
              },
              fields: ["extName", "prop", "args", "contentArgs"]
            }), $i = je.extend("CallExtensionAsync");
            function se(J, $, It) {
              var ct = J.split(`
`);
              ct.forEach(function(ft, Et) {
                ft && (It && Et > 0 || !It) && process.stdout.write(" ".repeat($));
                var Rt = Et === ct.length - 1 ? "" : `
`;
                process.stdout.write("" + ft + Rt);
              });
            }
            function me(J, $) {
              if ($ = $ || 0, se(J.typename + ": ", $), J instanceof h)
                se(`
`), J.children.forEach(function(ft) {
                  me(ft, $ + 2);
                });
              else if (J instanceof je)
                se(J.extName + "." + J.prop + `
`), J.args && me(J.args, $ + 2), J.contentArgs && J.contentArgs.forEach(function(ft) {
                  me(ft, $ + 2);
                });
              else {
                var It = [], ct = null;
                J.iterFields(function(ft, Et) {
                  ft instanceof m ? It.push([Et, ft]) : (ct = ct || {}, ct[Et] = ft);
                }), ct ? se(JSON.stringify(ct, null, 2) + `
`, null, !0) : se(`
`), It.forEach(function(ft) {
                  var Et = ft[0], Rt = ft[1];
                  se("[" + Et + "] =>", $ + 2), me(Rt, $ + 4);
                });
              }
            }
            e.exports = {
              Node: m,
              Root: I,
              NodeList: h,
              Value: l,
              Literal: d,
              Symbol: E,
              Group: v,
              Array: f,
              Pair: y,
              Dict: w,
              Output: K,
              Capture: yt,
              TemplateData: zt,
              If: M,
              IfAsync: x,
              InlineIf: _,
              For: S,
              AsyncEach: L,
              AsyncAll: D,
              Macro: F,
              Caller: j,
              Import: R,
              FromImport: B,
              FunCall: k,
              Filter: X,
              FilterAsync: Z,
              KeywordArgs: W,
              Block: nt,
              Super: rt,
              Extends: tt,
              Include: ut,
              Set: at,
              Switch: H,
              Case: Q,
              LookupVal: T,
              BinOp: vt,
              In: dt,
              Is: O,
              Or: N,
              And: V,
              Not: Y,
              Add: ot,
              Concat: et,
              Sub: gt,
              Mul: At,
              Div: bt,
              FloorDiv: St,
              Mod: Vt,
              Pow: Ce,
              Neg: _e,
              Pos: Se,
              Compare: qi,
              CompareOperand: Ii,
              CallExtension: je,
              CallExtensionAsync: $i,
              printNodes: me
            };
          }),
          /* 4 */
          /***/
          (function(e, n) {
          }),
          /* 5 */
          /***/
          (function(e, n, r) {
            function s(d, E) {
              d.prototype = Object.create(E.prototype), d.prototype.constructor = d, o(d, E);
            }
            function o(d, E) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(v, f) {
                return v.__proto__ = f, v;
              }, o(d, E);
            }
            var a = r(8), A = r(17), g = r(3), c = r(0), u = c.TemplateError, C = r(2), p = C.Frame, m = r(1), l = m.Obj, h = {
              "==": "==",
              "===": "===",
              "!=": "!=",
              "!==": "!==",
              "<": "<",
              ">": ">",
              "<=": "<=",
              ">=": ">="
            }, I = /* @__PURE__ */ (function(d) {
              s(E, d);
              function E() {
                return d.apply(this, arguments) || this;
              }
              var v = E.prototype;
              return v.init = function(f, y) {
                this.templateName = f, this.codebuf = [], this.lastId = 0, this.buffer = null, this.bufferStack = [], this._scopeClosers = "", this.inBlock = !1, this.throwOnUndefined = y;
              }, v.fail = function(f, y, w) {
                throw y !== void 0 && (y += 1), w !== void 0 && (w += 1), new u(f, y, w);
              }, v._pushBuffer = function() {
                var f = this._tmpid();
                return this.bufferStack.push(this.buffer), this.buffer = f, this._emit("var " + this.buffer + ' = "";'), f;
              }, v._popBuffer = function() {
                this.buffer = this.bufferStack.pop();
              }, v._emit = function(f) {
                this.codebuf.push(f);
              }, v._emitLine = function(f) {
                this._emit(f + `
`);
              }, v._emitLines = function() {
                for (var f = this, y = arguments.length, w = new Array(y), T = 0; T < y; T++)
                  w[T] = arguments[T];
                w.forEach(function(M) {
                  return f._emitLine(M);
                });
              }, v._emitFuncBegin = function(f, y) {
                this.buffer = "output", this._scopeClosers = "", this._emitLine("function " + y + "(env, context, frame, runtime, cb) {"), this._emitLine("var lineno = " + f.lineno + ";"), this._emitLine("var colno = " + f.colno + ";"), this._emitLine("var " + this.buffer + ' = "";'), this._emitLine("try {");
              }, v._emitFuncEnd = function(f) {
                f || this._emitLine("cb(null, " + this.buffer + ");"), this._closeScopeLevels(), this._emitLine("} catch (e) {"), this._emitLine("  cb(runtime.handleError(e, lineno, colno));"), this._emitLine("}"), this._emitLine("}"), this.buffer = null;
              }, v._addScopeLevel = function() {
                this._scopeClosers += "})";
              }, v._closeScopeLevels = function() {
                this._emitLine(this._scopeClosers + ";"), this._scopeClosers = "";
              }, v._withScopedSyntax = function(f) {
                var y = this._scopeClosers;
                this._scopeClosers = "", f.call(this), this._closeScopeLevels(), this._scopeClosers = y;
              }, v._makeCallback = function(f) {
                var y = this._tmpid();
                return "function(" + y + (f ? "," + f : "") + `) {
if(` + y + ") { cb(" + y + "); return; }";
              }, v._tmpid = function() {
                return this.lastId++, "t_" + this.lastId;
              }, v._templateName = function() {
                return this.templateName == null ? "undefined" : JSON.stringify(this.templateName);
              }, v._compileChildren = function(f, y) {
                var w = this;
                f.children.forEach(function(T) {
                  w.compile(T, y);
                });
              }, v._compileAggregate = function(f, y, w, T) {
                var M = this;
                w && this._emit(w), f.children.forEach(function(x, _) {
                  _ > 0 && M._emit(","), M.compile(x, y);
                }), T && this._emit(T);
              }, v._compileExpression = function(f, y) {
                this.assertType(f, g.Literal, g.Symbol, g.Group, g.Array, g.Dict, g.FunCall, g.Caller, g.Filter, g.LookupVal, g.Compare, g.InlineIf, g.In, g.Is, g.And, g.Or, g.Not, g.Add, g.Concat, g.Sub, g.Mul, g.Div, g.FloorDiv, g.Mod, g.Pow, g.Neg, g.Pos, g.Compare, g.NodeList), this.compile(f, y);
              }, v.assertType = function(f) {
                for (var y = arguments.length, w = new Array(y > 1 ? y - 1 : 0), T = 1; T < y; T++)
                  w[T - 1] = arguments[T];
                w.some(function(M) {
                  return f instanceof M;
                }) || this.fail("assertType: invalid type: " + f.typename, f.lineno, f.colno);
              }, v.compileCallExtension = function(f, y, w) {
                var T = this, M = f.args, x = f.contentArgs, _ = typeof f.autoescape == "boolean" ? f.autoescape : !0;
                if (w || this._emit(this.buffer + " += runtime.suppressValue("), this._emit('env.getExtension("' + f.extName + '")["' + f.prop + '"]('), this._emit("context"), (M || x) && this._emit(","), M && (M instanceof g.NodeList || this.fail("compileCallExtension: arguments must be a NodeList, use `parser.parseSignature`"), M.children.forEach(function(L, D) {
                  T._compileExpression(L, y), (D !== M.children.length - 1 || x.length) && T._emit(",");
                })), x.length && x.forEach(function(L, D) {
                  if (D > 0 && T._emit(","), L) {
                    T._emitLine("function(cb) {"), T._emitLine("if(!cb) { cb = function(err) { if(err) { throw err; }}}");
                    var F = T._pushBuffer();
                    T._withScopedSyntax(function() {
                      T.compile(L, y), T._emitLine("cb(null, " + F + ");");
                    }), T._popBuffer(), T._emitLine("return " + F + ";"), T._emitLine("}");
                  } else
                    T._emit("null");
                }), w) {
                  var S = this._tmpid();
                  this._emitLine(", " + this._makeCallback(S)), this._emitLine(this.buffer + " += runtime.suppressValue(" + S + ", " + _ + " && env.opts.autoescape);"), this._addScopeLevel();
                } else
                  this._emit(")"), this._emit(", " + _ + ` && env.opts.autoescape);
`);
              }, v.compileCallExtensionAsync = function(f, y) {
                this.compileCallExtension(f, y, !0);
              }, v.compileNodeList = function(f, y) {
                this._compileChildren(f, y);
              }, v.compileLiteral = function(f) {
                if (typeof f.value == "string") {
                  var y = f.value.replace(/\\/g, "\\\\");
                  y = y.replace(/"/g, '\\"'), y = y.replace(/\n/g, "\\n"), y = y.replace(/\r/g, "\\r"), y = y.replace(/\t/g, "\\t"), y = y.replace(/\u2028/g, "\\u2028"), this._emit('"' + y + '"');
                } else f.value === null ? this._emit("null") : this._emit(f.value.toString());
              }, v.compileSymbol = function(f, y) {
                var w = f.value, T = y.lookup(w);
                T ? this._emit(T) : this._emit('runtime.contextOrFrameLookup(context, frame, "' + w + '")');
              }, v.compileGroup = function(f, y) {
                this._compileAggregate(f, y, "(", ")");
              }, v.compileArray = function(f, y) {
                this._compileAggregate(f, y, "[", "]");
              }, v.compileDict = function(f, y) {
                this._compileAggregate(f, y, "{", "}");
              }, v.compilePair = function(f, y) {
                var w = f.key, T = f.value;
                w instanceof g.Symbol ? w = new g.Literal(w.lineno, w.colno, w.value) : w instanceof g.Literal && typeof w.value == "string" || this.fail("compilePair: Dict keys must be strings or names", w.lineno, w.colno), this.compile(w, y), this._emit(": "), this._compileExpression(T, y);
              }, v.compileInlineIf = function(f, y) {
                this._emit("("), this.compile(f.cond, y), this._emit("?"), this.compile(f.body, y), this._emit(":"), f.else_ !== null ? this.compile(f.else_, y) : this._emit('""'), this._emit(")");
              }, v.compileIn = function(f, y) {
                this._emit("runtime.inOperator("), this.compile(f.left, y), this._emit(","), this.compile(f.right, y), this._emit(")");
              }, v.compileIs = function(f, y) {
                var w = f.right.name ? f.right.name.value : f.right.value;
                this._emit('env.getTest("' + w + '").call(context, '), this.compile(f.left, y), f.right.args && (this._emit(","), this.compile(f.right.args, y)), this._emit(") === true");
              }, v._binOpEmitter = function(f, y, w) {
                this.compile(f.left, y), this._emit(w), this.compile(f.right, y);
              }, v.compileOr = function(f, y) {
                return this._binOpEmitter(f, y, " || ");
              }, v.compileAnd = function(f, y) {
                return this._binOpEmitter(f, y, " && ");
              }, v.compileAdd = function(f, y) {
                return this._binOpEmitter(f, y, " + ");
              }, v.compileConcat = function(f, y) {
                return this._binOpEmitter(f, y, ' + "" + ');
              }, v.compileSub = function(f, y) {
                return this._binOpEmitter(f, y, " - ");
              }, v.compileMul = function(f, y) {
                return this._binOpEmitter(f, y, " * ");
              }, v.compileDiv = function(f, y) {
                return this._binOpEmitter(f, y, " / ");
              }, v.compileMod = function(f, y) {
                return this._binOpEmitter(f, y, " % ");
              }, v.compileNot = function(f, y) {
                this._emit("!"), this.compile(f.target, y);
              }, v.compileFloorDiv = function(f, y) {
                this._emit("Math.floor("), this.compile(f.left, y), this._emit(" / "), this.compile(f.right, y), this._emit(")");
              }, v.compilePow = function(f, y) {
                this._emit("Math.pow("), this.compile(f.left, y), this._emit(", "), this.compile(f.right, y), this._emit(")");
              }, v.compileNeg = function(f, y) {
                this._emit("-"), this.compile(f.target, y);
              }, v.compilePos = function(f, y) {
                this._emit("+"), this.compile(f.target, y);
              }, v.compileCompare = function(f, y) {
                var w = this;
                this.compile(f.expr, y), f.ops.forEach(function(T) {
                  w._emit(" " + h[T.type] + " "), w.compile(T.expr, y);
                });
              }, v.compileLookupVal = function(f, y) {
                this._emit("runtime.memberLookup(("), this._compileExpression(f.target, y), this._emit("),"), this._compileExpression(f.val, y), this._emit(")");
              }, v._getNodeName = function(f) {
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
              }, v.compileFunCall = function(f, y) {
                this._emit("(lineno = " + f.lineno + ", colno = " + f.colno + ", "), this._emit("runtime.callWrap("), this._compileExpression(f.name, y), this._emit(', "' + this._getNodeName(f.name).replace(/"/g, '\\"') + '", context, '), this._compileAggregate(f.args, y, "[", "])"), this._emit(")");
              }, v.compileFilter = function(f, y) {
                var w = f.name;
                this.assertType(w, g.Symbol), this._emit('env.getFilter("' + w.value + '").call(context, '), this._compileAggregate(f.args, y), this._emit(")");
              }, v.compileFilterAsync = function(f, y) {
                var w = f.name, T = f.symbol.value;
                this.assertType(w, g.Symbol), y.set(T, T), this._emit('env.getFilter("' + w.value + '").call(context, '), this._compileAggregate(f.args, y), this._emitLine(", " + this._makeCallback(T)), this._addScopeLevel();
              }, v.compileKeywordArgs = function(f, y) {
                this._emit("runtime.makeKeywordArgs("), this.compileDict(f, y), this._emit(")");
              }, v.compileSet = function(f, y) {
                var w = this, T = [];
                f.targets.forEach(function(M) {
                  var x = M.value, _ = y.lookup(x);
                  _ == null && (_ = w._tmpid(), w._emitLine("var " + _ + ";")), T.push(_);
                }), f.value ? (this._emit(T.join(" = ") + " = "), this._compileExpression(f.value, y), this._emitLine(";")) : (this._emit(T.join(" = ") + " = "), this.compile(f.body, y), this._emitLine(";")), f.targets.forEach(function(M, x) {
                  var _ = T[x], S = M.value;
                  w._emitLine('frame.set("' + S + '", ' + _ + ", true);"), w._emitLine("if(frame.topLevel) {"), w._emitLine('context.setVariable("' + S + '", ' + _ + ");"), w._emitLine("}"), S.charAt(0) !== "_" && (w._emitLine("if(frame.topLevel) {"), w._emitLine('context.addExport("' + S + '", ' + _ + ");"), w._emitLine("}"));
                });
              }, v.compileSwitch = function(f, y) {
                var w = this;
                this._emit("switch ("), this.compile(f.expr, y), this._emit(") {"), f.cases.forEach(function(T, M) {
                  w._emit("case "), w.compile(T.cond, y), w._emit(": "), w.compile(T.body, y), T.body.children.length && w._emitLine("break;");
                }), f.default && (this._emit("default:"), this.compile(f.default, y)), this._emit("}");
              }, v.compileIf = function(f, y, w) {
                var T = this;
                this._emit("if("), this._compileExpression(f.cond, y), this._emitLine(") {"), this._withScopedSyntax(function() {
                  T.compile(f.body, y), w && T._emit("cb()");
                }), f.else_ ? (this._emitLine(`}
else {`), this._withScopedSyntax(function() {
                  T.compile(f.else_, y), w && T._emit("cb()");
                })) : w && (this._emitLine(`}
else {`), this._emit("cb()")), this._emitLine("}");
              }, v.compileIfAsync = function(f, y) {
                this._emit("(function(cb) {"), this.compileIf(f, y, !0), this._emit("})(" + this._makeCallback()), this._addScopeLevel();
              }, v._emitLoopBindings = function(f, y, w, T) {
                var M = this, x = [{
                  name: "index",
                  val: w + " + 1"
                }, {
                  name: "index0",
                  val: w
                }, {
                  name: "revindex",
                  val: T + " - " + w
                }, {
                  name: "revindex0",
                  val: T + " - " + w + " - 1"
                }, {
                  name: "first",
                  val: w + " === 0"
                }, {
                  name: "last",
                  val: w + " === " + T + " - 1"
                }, {
                  name: "length",
                  val: T
                }];
                x.forEach(function(_) {
                  M._emitLine('frame.set("loop.' + _.name + '", ' + _.val + ");");
                });
              }, v.compileFor = function(f, y) {
                var w = this, T = this._tmpid(), M = this._tmpid(), x = this._tmpid();
                if (y = y.push(), this._emitLine("frame = frame.push();"), this._emit("var " + x + " = "), this._compileExpression(f.arr, y), this._emitLine(";"), this._emit("if(" + x + ") {"), this._emitLine(x + " = runtime.fromIterator(" + x + ");"), f.name instanceof g.Array) {
                  this._emitLine("var " + T + ";"), this._emitLine("if(runtime.isArray(" + x + ")) {"), this._emitLine("var " + M + " = " + x + ".length;"), this._emitLine("for(" + T + "=0; " + T + " < " + x + ".length; " + T + "++) {"), f.name.children.forEach(function(R, B) {
                    var k = w._tmpid();
                    w._emitLine("var " + k + " = " + x + "[" + T + "][" + B + "];"), w._emitLine('frame.set("' + R + '", ' + x + "[" + T + "][" + B + "]);"), y.set(f.name.children[B].value, k);
                  }), this._emitLoopBindings(f, x, T, M), this._withScopedSyntax(function() {
                    w.compile(f.body, y);
                  }), this._emitLine("}"), this._emitLine("} else {");
                  var _ = f.name.children, S = _[0], L = _[1], D = this._tmpid(), F = this._tmpid();
                  y.set(S.value, D), y.set(L.value, F), this._emitLine(T + " = -1;"), this._emitLine("var " + M + " = runtime.keys(" + x + ").length;"), this._emitLine("for(var " + D + " in " + x + ") {"), this._emitLine(T + "++;"), this._emitLine("var " + F + " = " + x + "[" + D + "];"), this._emitLine('frame.set("' + S.value + '", ' + D + ");"), this._emitLine('frame.set("' + L.value + '", ' + F + ");"), this._emitLoopBindings(f, x, T, M), this._withScopedSyntax(function() {
                    w.compile(f.body, y);
                  }), this._emitLine("}"), this._emitLine("}");
                } else {
                  var j = this._tmpid();
                  y.set(f.name.value, j), this._emitLine("var " + M + " = " + x + ".length;"), this._emitLine("for(var " + T + "=0; " + T + " < " + x + ".length; " + T + "++) {"), this._emitLine("var " + j + " = " + x + "[" + T + "];"), this._emitLine('frame.set("' + f.name.value + '", ' + j + ");"), this._emitLoopBindings(f, x, T, M), this._withScopedSyntax(function() {
                    w.compile(f.body, y);
                  }), this._emitLine("}");
                }
                this._emitLine("}"), f.else_ && (this._emitLine("if (!" + M + ") {"), this.compile(f.else_, y), this._emitLine("}")), this._emitLine("frame = frame.pop();");
              }, v._compileAsyncLoop = function(f, y, w) {
                var T = this, M = this._tmpid(), x = this._tmpid(), _ = this._tmpid(), S = w ? "asyncAll" : "asyncEach";
                if (y = y.push(), this._emitLine("frame = frame.push();"), this._emit("var " + _ + " = runtime.fromIterator("), this._compileExpression(f.arr, y), this._emitLine(");"), f.name instanceof g.Array) {
                  var L = f.name.children.length;
                  this._emit("runtime." + S + "(" + _ + ", " + L + ", function("), f.name.children.forEach(function(j) {
                    T._emit(j.value + ",");
                  }), this._emit(M + "," + x + ",next) {"), f.name.children.forEach(function(j) {
                    var R = j.value;
                    y.set(R, R), T._emitLine('frame.set("' + R + '", ' + R + ");");
                  });
                } else {
                  var D = f.name.value;
                  this._emitLine("runtime." + S + "(" + _ + ", 1, function(" + D + ", " + M + ", " + x + ",next) {"), this._emitLine('frame.set("' + D + '", ' + D + ");"), y.set(D, D);
                }
                this._emitLoopBindings(f, _, M, x), this._withScopedSyntax(function() {
                  var j;
                  w && (j = T._pushBuffer()), T.compile(f.body, y), T._emitLine("next(" + M + (j ? "," + j : "") + ");"), w && T._popBuffer();
                });
                var F = this._tmpid();
                this._emitLine("}, " + this._makeCallback(F)), this._addScopeLevel(), w && this._emitLine(this.buffer + " += " + F + ";"), f.else_ && (this._emitLine("if (!" + _ + ".length) {"), this.compile(f.else_, y), this._emitLine("}")), this._emitLine("frame = frame.pop();");
              }, v.compileAsyncEach = function(f, y) {
                this._compileAsyncLoop(f, y);
              }, v.compileAsyncAll = function(f, y) {
                this._compileAsyncLoop(f, y, !0);
              }, v._compileMacro = function(f, y) {
                var w = this, T = [], M = null, x = "macro_" + this._tmpid(), _ = y !== void 0;
                f.args.children.forEach(function(R, B) {
                  B === f.args.children.length - 1 && R instanceof g.Dict ? M = R : (w.assertType(R, g.Symbol), T.push(R));
                });
                var S = [].concat(T.map(function(R) {
                  return "l_" + R.value;
                }), ["kwargs"]), L = T.map(function(R) {
                  return '"' + R.value + '"';
                }), D = (M && M.children || []).map(function(R) {
                  return '"' + R.key.value + '"';
                }), F;
                _ ? F = y.push(!0) : F = new p(), this._emitLines("var " + x + " = runtime.makeMacro(", "[" + L.join(", ") + "], ", "[" + D.join(", ") + "], ", "function (" + S.join(", ") + ") {", "var callerFrame = frame;", "frame = " + (_ ? "frame.push(true);" : "new runtime.Frame();"), "kwargs = kwargs || {};", 'if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {', 'frame.set("caller", kwargs.caller); }'), T.forEach(function(R) {
                  w._emitLine('frame.set("' + R.value + '", l_' + R.value + ");"), F.set(R.value, "l_" + R.value);
                }), M && M.children.forEach(function(R) {
                  var B = R.key.value;
                  w._emit('frame.set("' + B + '", '), w._emit('Object.prototype.hasOwnProperty.call(kwargs, "' + B + '")'), w._emit(' ? kwargs["' + B + '"] : '), w._compileExpression(R.value, F), w._emit(");");
                });
                var j = this._pushBuffer();
                return this._withScopedSyntax(function() {
                  w.compile(f.body, F);
                }), this._emitLine("frame = " + (_ ? "frame.pop();" : "callerFrame;")), this._emitLine("return new runtime.SafeString(" + j + ");"), this._emitLine("});"), this._popBuffer(), x;
              }, v.compileMacro = function(f, y) {
                var w = this._compileMacro(f), T = f.name.value;
                y.set(T, w), y.parent ? this._emitLine('frame.set("' + T + '", ' + w + ");") : (f.name.value.charAt(0) !== "_" && this._emitLine('context.addExport("' + T + '");'), this._emitLine('context.setVariable("' + T + '", ' + w + ");"));
              }, v.compileCaller = function(f, y) {
                this._emit("(function (){");
                var w = this._compileMacro(f, y);
                this._emit("return " + w + ";})()");
              }, v._compileGetTemplate = function(f, y, w, T) {
                var M = this._tmpid(), x = this._templateName(), _ = this._makeCallback(M), S = w ? "true" : "false", L = T ? "true" : "false";
                return this._emit("env.getTemplate("), this._compileExpression(f.template, y), this._emitLine(", " + S + ", " + x + ", " + L + ", " + _), M;
              }, v.compileImport = function(f, y) {
                var w = f.target.value, T = this._compileGetTemplate(f, y, !1, !1);
                this._addScopeLevel(), this._emitLine(T + ".getExported(" + (f.withContext ? "context.getVariables(), frame, " : "") + this._makeCallback(T)), this._addScopeLevel(), y.set(w, T), y.parent ? this._emitLine('frame.set("' + w + '", ' + T + ");") : this._emitLine('context.setVariable("' + w + '", ' + T + ");");
              }, v.compileFromImport = function(f, y) {
                var w = this, T = this._compileGetTemplate(f, y, !1, !1);
                this._addScopeLevel(), this._emitLine(T + ".getExported(" + (f.withContext ? "context.getVariables(), frame, " : "") + this._makeCallback(T)), this._addScopeLevel(), f.names.children.forEach(function(M) {
                  var x, _, S = w._tmpid();
                  M instanceof g.Pair ? (x = M.key.value, _ = M.value.value) : (x = M.value, _ = x), w._emitLine("if(Object.prototype.hasOwnProperty.call(" + T + ', "' + x + '")) {'), w._emitLine("var " + S + " = " + T + "." + x + ";"), w._emitLine("} else {"), w._emitLine(`cb(new Error("cannot import '` + x + `'")); return;`), w._emitLine("}"), y.set(_, S), y.parent ? w._emitLine('frame.set("' + _ + '", ' + S + ");") : w._emitLine('context.setVariable("' + _ + '", ' + S + ");");
                });
              }, v.compileBlock = function(f) {
                var y = this._tmpid();
                this.inBlock || this._emit('(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : '), this._emit('context.getBlock("' + f.name.value + '")'), this.inBlock || this._emit(")"), this._emitLine("(env, context, frame, runtime, " + this._makeCallback(y)), this._emitLine(this.buffer + " += " + y + ";"), this._addScopeLevel();
              }, v.compileSuper = function(f, y) {
                var w = f.blockName.value, T = f.symbol.value, M = this._makeCallback(T);
                this._emitLine('context.getSuper(env, "' + w + '", b_' + w + ", frame, runtime, " + M), this._emitLine(T + " = runtime.markSafe(" + T + ");"), this._addScopeLevel(), y.set(T, T);
              }, v.compileExtends = function(f, y) {
                var w = this._tmpid(), T = this._compileGetTemplate(f, y, !0, !1);
                this._emitLine("parentTemplate = " + T), this._emitLine("for(var " + w + " in parentTemplate.blocks) {"), this._emitLine("context.addBlock(" + w + ", parentTemplate.blocks[" + w + "]);"), this._emitLine("}"), this._addScopeLevel();
              }, v.compileInclude = function(f, y) {
                this._emitLine("var tasks = [];"), this._emitLine("tasks.push("), this._emitLine("function(callback) {");
                var w = this._compileGetTemplate(f, y, !1, f.ignoreMissing);
                this._emitLine("callback(null," + w + ");});"), this._emitLine("});");
                var T = this._tmpid();
                this._emitLine("tasks.push("), this._emitLine("function(template, callback){"), this._emitLine("template.render(context.getVariables(), frame, " + this._makeCallback(T)), this._emitLine("callback(null," + T + ");});"), this._emitLine("});"), this._emitLine("tasks.push("), this._emitLine("function(result, callback){"), this._emitLine(this.buffer + " += result;"), this._emitLine("callback(null);"), this._emitLine("});"), this._emitLine("env.waterfall(tasks, function(){"), this._addScopeLevel();
              }, v.compileTemplateData = function(f, y) {
                this.compileLiteral(f, y);
              }, v.compileCapture = function(f, y) {
                var w = this, T = this.buffer;
                this.buffer = "output", this._emitLine("(function() {"), this._emitLine('var output = "";'), this._withScopedSyntax(function() {
                  w.compile(f.body, y);
                }), this._emitLine("return output;"), this._emitLine("})()"), this.buffer = T;
              }, v.compileOutput = function(f, y) {
                var w = this, T = f.children;
                T.forEach(function(M) {
                  M instanceof g.TemplateData ? M.value && (w._emit(w.buffer + " += "), w.compileLiteral(M, y), w._emitLine(";")) : (w._emit(w.buffer + " += runtime.suppressValue("), w.throwOnUndefined && w._emit("runtime.ensureDefined("), w.compile(M, y), w.throwOnUndefined && w._emit("," + f.lineno + "," + f.colno + ")"), w._emit(`, env.opts.autoescape);
`));
                });
              }, v.compileRoot = function(f, y) {
                var w = this;
                y && this.fail("compileRoot: root node can't have frame"), y = new p(), this._emitFuncBegin(f, "root"), this._emitLine("var parentTemplate = null;"), this._compileChildren(f, y), this._emitLine("if(parentTemplate) {"), this._emitLine("parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);"), this._emitLine("} else {"), this._emitLine("cb(null, " + this.buffer + ");"), this._emitLine("}"), this._emitFuncEnd(!0), this.inBlock = !0;
                var T = [], M = f.findAll(g.Block);
                M.forEach(function(x, _) {
                  var S = x.name.value;
                  if (T.indexOf(S) !== -1)
                    throw new Error('Block "' + S + '" defined more than once.');
                  T.push(S), w._emitFuncBegin(x, "b_" + S);
                  var L = new p();
                  w._emitLine("var frame = frame.push(true);"), w.compile(x.body, L), w._emitFuncEnd();
                }), this._emitLine("return {"), M.forEach(function(x, _) {
                  var S = "b_" + x.name.value;
                  w._emitLine(S + ": " + S + ",");
                }), this._emitLine(`root: root
};`);
              }, v.compile = function(f, y) {
                var w = this["compile" + f.typename];
                w ? w.call(this, f, y) : this.fail("compile: Cannot compile node: " + f.typename, f.lineno, f.colno);
              }, v.getCode = function() {
                return this.codebuf.join("");
              }, E;
            })(l);
            e.exports = {
              compile: function(d, E, v, f, y) {
                y === void 0 && (y = {});
                var w = new I(f, y.throwOnUndefined), T = (v || []).map(function(x) {
                  return x.preprocess;
                }).filter(function(x) {
                  return !!x;
                }), M = T.reduce(function(x, _) {
                  return _(x);
                }, d);
                return w.compile(A.transform(a.parse(M, v, y), E, f)), w.getCode();
              },
              Compiler: I
            };
          }),
          /* 6 */
          /***/
          (function(e, n, r) {
            function s(c, u) {
              c.prototype = Object.create(u.prototype), c.prototype.constructor = c, o(c, u);
            }
            function o(c, u) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(C, p) {
                return C.__proto__ = p, C;
              }, o(c, u);
            }
            var a = r(4), A = r(1), g = A.EmitterObj;
            e.exports = /* @__PURE__ */ (function(c) {
              s(u, c);
              function u() {
                return c.apply(this, arguments) || this;
              }
              var C = u.prototype;
              return C.resolve = function(p, m) {
                return a.resolve(a.dirname(p), m);
              }, C.isRelative = function(p) {
                return p.indexOf("./") === 0 || p.indexOf("../") === 0;
              }, u;
            })(g);
          }),
          /* 7 */
          /***/
          (function(e, n, r) {
            function s(D, F) {
              D.prototype = Object.create(F.prototype), D.prototype.constructor = D, o(D, F);
            }
            function o(D, F) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(j, R) {
                return j.__proto__ = R, j;
              }, o(D, F);
            }
            var a = r(12), A = r(15), g = r(0), c = r(5), u = r(18), C = r(10), p = C.FileSystemLoader, m = C.WebLoader, l = C.PrecompiledLoader, h = r(20), I = r(21), d = r(1), E = d.Obj, v = d.EmitterObj, f = r(2), y = f.handleError, w = f.Frame, T = r(22);
            function M(D, F, j) {
              a(function() {
                D(F, j);
              });
            }
            var x = {
              type: "code",
              obj: {
                root: function(D, F, j, R, B) {
                  try {
                    B(null, "");
                  } catch (k) {
                    B(y(k, null, null));
                  }
                }
              }
            }, _ = /* @__PURE__ */ (function(D) {
              s(F, D);
              function F() {
                return D.apply(this, arguments) || this;
              }
              var j = F.prototype;
              return j.init = function(R, B) {
                var k = this;
                B = this.opts = B || {}, this.opts.dev = !!B.dev, this.opts.autoescape = B.autoescape != null ? B.autoescape : !0, this.opts.throwOnUndefined = !!B.throwOnUndefined, this.opts.trimBlocks = !!B.trimBlocks, this.opts.lstripBlocks = !!B.lstripBlocks, this.loaders = [], R ? this.loaders = g.isArray(R) ? R : [R] : p ? this.loaders = [new p("views")] : m && (this.loaders = [new m("/views")]), typeof window < "u" && window.nunjucksPrecompiled && this.loaders.unshift(new l(window.nunjucksPrecompiled)), this._initLoaders(), this.globals = I(), this.filters = {}, this.tests = {}, this.asyncFilters = [], this.extensions = {}, this.extensionsList = [], g._entries(u).forEach(function(X) {
                  var Z = X[0], W = X[1];
                  return k.addFilter(Z, W);
                }), g._entries(h).forEach(function(X) {
                  var Z = X[0], W = X[1];
                  return k.addTest(Z, W);
                });
              }, j._initLoaders = function() {
                var R = this;
                this.loaders.forEach(function(B) {
                  B.cache = {}, typeof B.on == "function" && (B.on("update", function(k, X) {
                    B.cache[k] = null, R.emit("update", k, X, B);
                  }), B.on("load", function(k, X) {
                    R.emit("load", k, X, B);
                  }));
                });
              }, j.invalidateCache = function() {
                this.loaders.forEach(function(R) {
                  R.cache = {};
                });
              }, j.addExtension = function(R, B) {
                return B.__name = R, this.extensions[R] = B, this.extensionsList.push(B), this;
              }, j.removeExtension = function(R) {
                var B = this.getExtension(R);
                B && (this.extensionsList = g.without(this.extensionsList, B), delete this.extensions[R]);
              }, j.getExtension = function(R) {
                return this.extensions[R];
              }, j.hasExtension = function(R) {
                return !!this.extensions[R];
              }, j.addGlobal = function(R, B) {
                return this.globals[R] = B, this;
              }, j.getGlobal = function(R) {
                if (typeof this.globals[R] > "u")
                  throw new Error("global not found: " + R);
                return this.globals[R];
              }, j.addFilter = function(R, B, k) {
                var X = B;
                return k && this.asyncFilters.push(R), this.filters[R] = X, this;
              }, j.getFilter = function(R) {
                if (!this.filters[R])
                  throw new Error("filter not found: " + R);
                return this.filters[R];
              }, j.addTest = function(R, B) {
                return this.tests[R] = B, this;
              }, j.getTest = function(R) {
                if (!this.tests[R])
                  throw new Error("test not found: " + R);
                return this.tests[R];
              }, j.resolveTemplate = function(R, B, k) {
                var X = R.isRelative && B ? R.isRelative(k) : !1;
                return X && R.resolve ? R.resolve(B, k) : k;
              }, j.getTemplate = function(R, B, k, X, Z) {
                var W = this, nt = this, rt = null;
                if (R && R.raw && (R = R.raw), g.isFunction(k) && (Z = k, k = null, B = B || !1), g.isFunction(B) && (Z = B, B = !1), R instanceof L)
                  rt = R;
                else {
                  if (typeof R != "string")
                    throw new Error("template names must be a string: " + R);
                  for (var st = 0; st < this.loaders.length; st++) {
                    var tt = this.loaders[st];
                    if (rt = tt.cache[this.resolveTemplate(tt, k, R)], rt)
                      break;
                  }
                }
                if (rt)
                  if (B && rt.compile(), Z) {
                    Z(null, rt);
                    return;
                  } else
                    return rt;
                var ut, at = function(H, Q) {
                  if (!Q && !H && !X && (H = new Error("template not found: " + R)), H)
                    if (Z) {
                      Z(H);
                      return;
                    } else
                      throw H;
                  var K;
                  Q ? (K = new L(Q.src, W, Q.path, B), Q.noCache || (Q.loader.cache[R] = K)) : K = new L(x, W, "", B), Z ? Z(null, K) : ut = K;
                };
                return g.asyncIter(this.loaders, function(H, Q, K, yt) {
                  function zt(ce, vt) {
                    ce ? yt(ce) : vt ? (vt.loader = H, yt(null, vt)) : K();
                  }
                  R = nt.resolveTemplate(H, k, R), H.async ? H.getSource(R, zt) : zt(null, H.getSource(R));
                }, at), ut;
              }, j.express = function(R) {
                return T(this, R);
              }, j.render = function(R, B, k) {
                g.isFunction(B) && (k = B, B = null);
                var X = null;
                return this.getTemplate(R, function(Z, W) {
                  if (Z && k)
                    M(k, Z);
                  else {
                    if (Z)
                      throw Z;
                    X = W.render(B, k);
                  }
                }), X;
              }, j.renderString = function(R, B, k, X) {
                g.isFunction(k) && (X = k, k = {}), k = k || {};
                var Z = new L(R, this, k.path);
                return Z.render(B, X);
              }, j.waterfall = function(R, B, k) {
                return A(R, B, k);
              }, F;
            })(v), S = /* @__PURE__ */ (function(D) {
              s(F, D);
              function F() {
                return D.apply(this, arguments) || this;
              }
              var j = F.prototype;
              return j.init = function(R, B, k) {
                var X = this;
                this.env = k || new _(), this.ctx = g.extend({}, R), this.blocks = {}, this.exported = [], g.keys(B).forEach(function(Z) {
                  X.addBlock(Z, B[Z]);
                });
              }, j.lookup = function(R) {
                return R in this.env.globals && !(R in this.ctx) ? this.env.globals[R] : this.ctx[R];
              }, j.setVariable = function(R, B) {
                this.ctx[R] = B;
              }, j.getVariables = function() {
                return this.ctx;
              }, j.addBlock = function(R, B) {
                return this.blocks[R] = this.blocks[R] || [], this.blocks[R].push(B), this;
              }, j.getBlock = function(R) {
                if (!this.blocks[R])
                  throw new Error('unknown block "' + R + '"');
                return this.blocks[R][0];
              }, j.getSuper = function(R, B, k, X, Z, W) {
                var nt = g.indexOf(this.blocks[B] || [], k), rt = this.blocks[B][nt + 1], st = this;
                if (nt === -1 || !rt)
                  throw new Error('no super block available for "' + B + '"');
                rt(R, st, X, Z, W);
              }, j.addExport = function(R) {
                this.exported.push(R);
              }, j.getExported = function() {
                var R = this, B = {};
                return this.exported.forEach(function(k) {
                  B[k] = R.ctx[k];
                }), B;
              }, F;
            })(E), L = /* @__PURE__ */ (function(D) {
              s(F, D);
              function F() {
                return D.apply(this, arguments) || this;
              }
              var j = F.prototype;
              return j.init = function(R, B, k, X) {
                if (this.env = B || new _(), g.isObject(R))
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
                if (this.path = k, X)
                  try {
                    this._compile();
                  } catch (Z) {
                    throw g._prettifyError(this.path, this.env.opts.dev, Z);
                  }
                else
                  this.compiled = !1;
              }, j.render = function(R, B, k) {
                var X = this;
                typeof R == "function" ? (k = R, R = {}) : typeof B == "function" && (k = B, B = null);
                var Z = !B;
                try {
                  this.compile();
                } catch (ut) {
                  var W = g._prettifyError(this.path, this.env.opts.dev, ut);
                  if (k)
                    return M(k, W);
                  throw W;
                }
                var nt = new S(R || {}, this.blocks, this.env), rt = B ? B.push(!0) : new w();
                rt.topLevel = !0;
                var st = null, tt = !1;
                return this.rootRenderFunc(this.env, nt, rt, f, function(ut, at) {
                  if (!(tt && k && typeof at < "u"))
                    if (ut && (ut = g._prettifyError(X.path, X.env.opts.dev, ut), tt = !0), k)
                      Z ? M(k, ut, at) : k(ut, at);
                    else {
                      if (ut)
                        throw ut;
                      st = at;
                    }
                }), st;
              }, j.getExported = function(R, B, k) {
                typeof R == "function" && (k = R, R = {}), typeof B == "function" && (k = B, B = null);
                try {
                  this.compile();
                } catch (W) {
                  if (k)
                    return k(W);
                  throw W;
                }
                var X = B ? B.push() : new w();
                X.topLevel = !0;
                var Z = new S(R || {}, this.blocks, this.env);
                this.rootRenderFunc(this.env, Z, X, f, function(W) {
                  W ? k(W, null) : k(null, Z.getExported());
                });
              }, j.compile = function() {
                this.compiled || this._compile();
              }, j._compile = function() {
                var R;
                if (this.tmplProps)
                  R = this.tmplProps;
                else {
                  var B = c.compile(this.tmplStr, this.env.asyncFilters, this.env.extensionsList, this.path, this.env.opts), k = new Function(B);
                  R = k();
                }
                this.blocks = this._getBlocks(R), this.rootRenderFunc = R.root, this.compiled = !0;
              }, j._getBlocks = function(R) {
                var B = {};
                return g.keys(R).forEach(function(k) {
                  k.slice(0, 2) === "b_" && (B[k.slice(2)] = R[k]);
                }), B;
              }, F;
            })(E);
            e.exports = {
              Environment: _,
              Template: L
            };
          }),
          /* 8 */
          /***/
          (function(e, n, r) {
            function s(C, p) {
              C.prototype = Object.create(p.prototype), C.prototype.constructor = C, o(C, p);
            }
            function o(C, p) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(m, l) {
                return m.__proto__ = l, m;
              }, o(C, p);
            }
            var a = r(9), A = r(3), g = r(1).Obj, c = r(0), u = /* @__PURE__ */ (function(C) {
              s(p, C);
              function p() {
                return C.apply(this, arguments) || this;
              }
              var m = p.prototype;
              return m.init = function(l) {
                this.tokens = l, this.peeked = null, this.breakOnBlocks = null, this.dropLeadingWhitespace = !1, this.extensions = [];
              }, m.nextToken = function(l) {
                var h;
                if (this.peeked)
                  if (!l && this.peeked.type === a.TOKEN_WHITESPACE)
                    this.peeked = null;
                  else
                    return h = this.peeked, this.peeked = null, h;
                if (h = this.tokens.nextToken(), !l)
                  for (; h && h.type === a.TOKEN_WHITESPACE; )
                    h = this.tokens.nextToken();
                return h;
              }, m.peekToken = function() {
                return this.peeked = this.peeked || this.nextToken(), this.peeked;
              }, m.pushToken = function(l) {
                if (this.peeked)
                  throw new Error("pushToken: can only push one token on between reads");
                this.peeked = l;
              }, m.error = function(l, h, I) {
                if (h === void 0 || I === void 0) {
                  var d = this.peekToken() || {};
                  h = d.lineno, I = d.colno;
                }
                return h !== void 0 && (h += 1), I !== void 0 && (I += 1), new c.TemplateError(l, h, I);
              }, m.fail = function(l, h, I) {
                throw this.error(l, h, I);
              }, m.skip = function(l) {
                var h = this.nextToken();
                return !h || h.type !== l ? (this.pushToken(h), !1) : !0;
              }, m.expect = function(l) {
                var h = this.nextToken();
                return h.type !== l && this.fail("expected " + l + ", got " + h.type, h.lineno, h.colno), h;
              }, m.skipValue = function(l, h) {
                var I = this.nextToken();
                return !I || I.type !== l || I.value !== h ? (this.pushToken(I), !1) : !0;
              }, m.skipSymbol = function(l) {
                return this.skipValue(a.TOKEN_SYMBOL, l);
              }, m.advanceAfterBlockEnd = function(l) {
                var h;
                return l || (h = this.peekToken(), h || this.fail("unexpected end of file"), h.type !== a.TOKEN_SYMBOL && this.fail("advanceAfterBlockEnd: expected symbol token or explicit name to be passed"), l = this.nextToken().value), h = this.nextToken(), h && h.type === a.TOKEN_BLOCK_END ? h.value.charAt(0) === "-" && (this.dropLeadingWhitespace = !0) : this.fail("expected block end in " + l + " statement"), h;
              }, m.advanceAfterVariableEnd = function() {
                var l = this.nextToken();
                l && l.type === a.TOKEN_VARIABLE_END ? this.dropLeadingWhitespace = l.value.charAt(l.value.length - this.tokens.tags.VARIABLE_END.length - 1) === "-" : (this.pushToken(l), this.fail("expected variable end"));
              }, m.parseFor = function() {
                var l = this.peekToken(), h, I;
                this.skipSymbol("for") ? (h = new A.For(l.lineno, l.colno), I = "endfor") : this.skipSymbol("asyncEach") ? (h = new A.AsyncEach(l.lineno, l.colno), I = "endeach") : this.skipSymbol("asyncAll") ? (h = new A.AsyncAll(l.lineno, l.colno), I = "endall") : this.fail("parseFor: expected for{Async}", l.lineno, l.colno), h.name = this.parsePrimary(), h.name instanceof A.Symbol || this.fail("parseFor: variable name expected for loop");
                var d = this.peekToken().type;
                if (d === a.TOKEN_COMMA) {
                  var E = h.name;
                  for (h.name = new A.Array(E.lineno, E.colno), h.name.addChild(E); this.skip(a.TOKEN_COMMA); ) {
                    var v = this.parsePrimary();
                    h.name.addChild(v);
                  }
                }
                return this.skipSymbol("in") || this.fail('parseFor: expected "in" keyword for loop', l.lineno, l.colno), h.arr = this.parseExpression(), this.advanceAfterBlockEnd(l.value), h.body = this.parseUntilBlocks(I, "else"), this.skipSymbol("else") && (this.advanceAfterBlockEnd("else"), h.else_ = this.parseUntilBlocks(I)), this.advanceAfterBlockEnd(), h;
              }, m.parseMacro = function() {
                var l = this.peekToken();
                this.skipSymbol("macro") || this.fail("expected macro");
                var h = this.parsePrimary(!0), I = this.parseSignature(), d = new A.Macro(l.lineno, l.colno, h, I);
                return this.advanceAfterBlockEnd(l.value), d.body = this.parseUntilBlocks("endmacro"), this.advanceAfterBlockEnd(), d;
              }, m.parseCall = function() {
                var l = this.peekToken();
                this.skipSymbol("call") || this.fail("expected call");
                var h = this.parseSignature(!0) || new A.NodeList(), I = this.parsePrimary();
                this.advanceAfterBlockEnd(l.value);
                var d = this.parseUntilBlocks("endcall");
                this.advanceAfterBlockEnd();
                var E = new A.Symbol(l.lineno, l.colno, "caller"), v = new A.Caller(l.lineno, l.colno, E, h, d), f = I.args.children;
                f[f.length - 1] instanceof A.KeywordArgs || f.push(new A.KeywordArgs());
                var y = f[f.length - 1];
                return y.addChild(new A.Pair(l.lineno, l.colno, E, v)), new A.Output(l.lineno, l.colno, [I]);
              }, m.parseWithContext = function() {
                var l = this.peekToken(), h = null;
                return this.skipSymbol("with") ? h = !0 : this.skipSymbol("without") && (h = !1), h !== null && (this.skipSymbol("context") || this.fail("parseFrom: expected context after with/without", l.lineno, l.colno)), h;
              }, m.parseImport = function() {
                var l = this.peekToken();
                this.skipSymbol("import") || this.fail("parseImport: expected import", l.lineno, l.colno);
                var h = this.parseExpression();
                this.skipSymbol("as") || this.fail('parseImport: expected "as" keyword', l.lineno, l.colno);
                var I = this.parseExpression(), d = this.parseWithContext(), E = new A.Import(l.lineno, l.colno, h, I, d);
                return this.advanceAfterBlockEnd(l.value), E;
              }, m.parseFrom = function() {
                var l = this.peekToken();
                this.skipSymbol("from") || this.fail("parseFrom: expected from");
                var h = this.parseExpression();
                this.skipSymbol("import") || this.fail("parseFrom: expected import", l.lineno, l.colno);
                for (var I = new A.NodeList(), d; ; ) {
                  var E = this.peekToken();
                  if (E.type === a.TOKEN_BLOCK_END) {
                    I.children.length || this.fail("parseFrom: Expected at least one import name", l.lineno, l.colno), E.value.charAt(0) === "-" && (this.dropLeadingWhitespace = !0), this.nextToken();
                    break;
                  }
                  I.children.length > 0 && !this.skip(a.TOKEN_COMMA) && this.fail("parseFrom: expected comma", l.lineno, l.colno);
                  var v = this.parsePrimary();
                  if (v.value.charAt(0) === "_" && this.fail("parseFrom: names starting with an underscore cannot be imported", v.lineno, v.colno), this.skipSymbol("as")) {
                    var f = this.parsePrimary();
                    I.addChild(new A.Pair(v.lineno, v.colno, v, f));
                  } else
                    I.addChild(v);
                  d = this.parseWithContext();
                }
                return new A.FromImport(l.lineno, l.colno, h, I, d);
              }, m.parseBlock = function() {
                var l = this.peekToken();
                this.skipSymbol("block") || this.fail("parseBlock: expected block", l.lineno, l.colno);
                var h = new A.Block(l.lineno, l.colno);
                h.name = this.parsePrimary(), h.name instanceof A.Symbol || this.fail("parseBlock: variable name expected", l.lineno, l.colno), this.advanceAfterBlockEnd(l.value), h.body = this.parseUntilBlocks("endblock"), this.skipSymbol("endblock"), this.skipSymbol(h.name.value);
                var I = this.peekToken();
                return I || this.fail("parseBlock: expected endblock, got end of file"), this.advanceAfterBlockEnd(I.value), h;
              }, m.parseExtends = function() {
                var l = "extends", h = this.peekToken();
                this.skipSymbol(l) || this.fail("parseTemplateRef: expected " + l);
                var I = new A.Extends(h.lineno, h.colno);
                return I.template = this.parseExpression(), this.advanceAfterBlockEnd(h.value), I;
              }, m.parseInclude = function() {
                var l = "include", h = this.peekToken();
                this.skipSymbol(l) || this.fail("parseInclude: expected " + l);
                var I = new A.Include(h.lineno, h.colno);
                return I.template = this.parseExpression(), this.skipSymbol("ignore") && this.skipSymbol("missing") && (I.ignoreMissing = !0), this.advanceAfterBlockEnd(h.value), I;
              }, m.parseIf = function() {
                var l = this.peekToken(), h;
                this.skipSymbol("if") || this.skipSymbol("elif") || this.skipSymbol("elseif") ? h = new A.If(l.lineno, l.colno) : this.skipSymbol("ifAsync") ? h = new A.IfAsync(l.lineno, l.colno) : this.fail("parseIf: expected if, elif, or elseif", l.lineno, l.colno), h.cond = this.parseExpression(), this.advanceAfterBlockEnd(l.value), h.body = this.parseUntilBlocks("elif", "elseif", "else", "endif");
                var I = this.peekToken();
                switch (I && I.value) {
                  case "elseif":
                  case "elif":
                    h.else_ = this.parseIf();
                    break;
                  case "else":
                    this.advanceAfterBlockEnd(), h.else_ = this.parseUntilBlocks("endif"), this.advanceAfterBlockEnd();
                    break;
                  case "endif":
                    h.else_ = null, this.advanceAfterBlockEnd();
                    break;
                  default:
                    this.fail("parseIf: expected elif, else, or endif, got end of file");
                }
                return h;
              }, m.parseSet = function() {
                var l = this.peekToken();
                this.skipSymbol("set") || this.fail("parseSet: expected set", l.lineno, l.colno);
                for (var h = new A.Set(l.lineno, l.colno, []), I; (I = this.parsePrimary()) && (h.targets.push(I), !!this.skip(a.TOKEN_COMMA)); )
                  ;
                return this.skipValue(a.TOKEN_OPERATOR, "=") ? (h.value = this.parseExpression(), this.advanceAfterBlockEnd(l.value)) : this.skip(a.TOKEN_BLOCK_END) ? (h.body = new A.Capture(l.lineno, l.colno, this.parseUntilBlocks("endset")), h.value = null, this.advanceAfterBlockEnd()) : this.fail("parseSet: expected = or block end in set tag", l.lineno, l.colno), h;
              }, m.parseSwitch = function() {
                var l = "switch", h = "endswitch", I = "case", d = "default", E = this.peekToken();
                !this.skipSymbol(l) && !this.skipSymbol(I) && !this.skipSymbol(d) && this.fail('parseSwitch: expected "switch," "case" or "default"', E.lineno, E.colno);
                var v = this.parseExpression();
                this.advanceAfterBlockEnd(l), this.parseUntilBlocks(I, d, h);
                var f = this.peekToken(), y = [], w;
                do {
                  this.skipSymbol(I);
                  var T = this.parseExpression();
                  this.advanceAfterBlockEnd(l);
                  var M = this.parseUntilBlocks(I, d, h);
                  y.push(new A.Case(f.line, f.col, T, M)), f = this.peekToken();
                } while (f && f.value === I);
                switch (f.value) {
                  case d:
                    this.advanceAfterBlockEnd(), w = this.parseUntilBlocks(h), this.advanceAfterBlockEnd();
                    break;
                  case h:
                    this.advanceAfterBlockEnd();
                    break;
                  default:
                    this.fail('parseSwitch: expected "case," "default" or "endswitch," got EOF.');
                }
                return new A.Switch(E.lineno, E.colno, v, y, w);
              }, m.parseStatement = function() {
                var l = this.peekToken(), h;
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
                      for (var I = 0; I < this.extensions.length; I++) {
                        var d = this.extensions[I];
                        if (c.indexOf(d.tags || [], l.value) !== -1)
                          return d.parse(this, A, a);
                      }
                    this.fail("unknown block tag: " + l.value, l.lineno, l.colno);
                }
                return h;
              }, m.parseRaw = function(l) {
                l = l || "raw";
                for (var h = "end" + l, I = new RegExp("([\\s\\S]*?){%\\s*(" + l + "|" + h + ")\\s*(?=%})%}"), d = 1, E = "", v = null, f = this.advanceAfterBlockEnd(); (v = this.tokens._extractRegex(I)) && d > 0; ) {
                  var y = v[0], w = v[1], T = v[2];
                  T === l ? d += 1 : T === h && (d -= 1), d === 0 ? (E += w, this.tokens.backN(y.length - w.length)) : E += y;
                }
                return new A.Output(f.lineno, f.colno, [new A.TemplateData(f.lineno, f.colno, E)]);
              }, m.parsePostfix = function(l) {
                for (var h, I = this.peekToken(); I; ) {
                  if (I.type === a.TOKEN_LEFT_PAREN)
                    l = new A.FunCall(I.lineno, I.colno, l, this.parseSignature());
                  else if (I.type === a.TOKEN_LEFT_BRACKET)
                    h = this.parseAggregate(), h.children.length > 1 && this.fail("invalid index"), l = new A.LookupVal(I.lineno, I.colno, l, h.children[0]);
                  else if (I.type === a.TOKEN_OPERATOR && I.value === ".") {
                    this.nextToken();
                    var d = this.nextToken();
                    d.type !== a.TOKEN_SYMBOL && this.fail("expected name as lookup value, got " + d.value, d.lineno, d.colno), h = new A.Literal(d.lineno, d.colno, d.value), l = new A.LookupVal(I.lineno, I.colno, l, h);
                  } else
                    break;
                  I = this.peekToken();
                }
                return l;
              }, m.parseExpression = function() {
                var l = this.parseInlineIf();
                return l;
              }, m.parseInlineIf = function() {
                var l = this.parseOr();
                if (this.skipSymbol("if")) {
                  var h = this.parseOr(), I = l;
                  l = new A.InlineIf(l.lineno, l.colno), l.body = I, l.cond = h, this.skipSymbol("else") ? l.else_ = this.parseOr() : l.else_ = null;
                }
                return l;
              }, m.parseOr = function() {
                for (var l = this.parseAnd(); this.skipSymbol("or"); ) {
                  var h = this.parseAnd();
                  l = new A.Or(l.lineno, l.colno, l, h);
                }
                return l;
              }, m.parseAnd = function() {
                for (var l = this.parseNot(); this.skipSymbol("and"); ) {
                  var h = this.parseNot();
                  l = new A.And(l.lineno, l.colno, l, h);
                }
                return l;
              }, m.parseNot = function() {
                var l = this.peekToken();
                return this.skipSymbol("not") ? new A.Not(l.lineno, l.colno, this.parseNot()) : this.parseIn();
              }, m.parseIn = function() {
                for (var l = this.parseIs(); ; ) {
                  var h = this.nextToken();
                  if (!h)
                    break;
                  var I = h.type === a.TOKEN_SYMBOL && h.value === "not";
                  if (I || this.pushToken(h), this.skipSymbol("in")) {
                    var d = this.parseIs();
                    l = new A.In(l.lineno, l.colno, l, d), I && (l = new A.Not(l.lineno, l.colno, l));
                  } else {
                    I && this.pushToken(h);
                    break;
                  }
                }
                return l;
              }, m.parseIs = function() {
                var l = this.parseCompare();
                if (this.skipSymbol("is")) {
                  var h = this.skipSymbol("not"), I = this.parseCompare();
                  l = new A.Is(l.lineno, l.colno, l, I), h && (l = new A.Not(l.lineno, l.colno, l));
                }
                return l;
              }, m.parseCompare = function() {
                for (var l = ["==", "===", "!=", "!==", "<", ">", "<=", ">="], h = this.parseConcat(), I = []; ; ) {
                  var d = this.nextToken();
                  if (d)
                    if (l.indexOf(d.value) !== -1)
                      I.push(new A.CompareOperand(d.lineno, d.colno, this.parseConcat(), d.value));
                    else {
                      this.pushToken(d);
                      break;
                    }
                  else break;
                }
                return I.length ? new A.Compare(I[0].lineno, I[0].colno, h, I) : h;
              }, m.parseConcat = function() {
                for (var l = this.parseAdd(); this.skipValue(a.TOKEN_TILDE, "~"); ) {
                  var h = this.parseAdd();
                  l = new A.Concat(l.lineno, l.colno, l, h);
                }
                return l;
              }, m.parseAdd = function() {
                for (var l = this.parseSub(); this.skipValue(a.TOKEN_OPERATOR, "+"); ) {
                  var h = this.parseSub();
                  l = new A.Add(l.lineno, l.colno, l, h);
                }
                return l;
              }, m.parseSub = function() {
                for (var l = this.parseMul(); this.skipValue(a.TOKEN_OPERATOR, "-"); ) {
                  var h = this.parseMul();
                  l = new A.Sub(l.lineno, l.colno, l, h);
                }
                return l;
              }, m.parseMul = function() {
                for (var l = this.parseDiv(); this.skipValue(a.TOKEN_OPERATOR, "*"); ) {
                  var h = this.parseDiv();
                  l = new A.Mul(l.lineno, l.colno, l, h);
                }
                return l;
              }, m.parseDiv = function() {
                for (var l = this.parseFloorDiv(); this.skipValue(a.TOKEN_OPERATOR, "/"); ) {
                  var h = this.parseFloorDiv();
                  l = new A.Div(l.lineno, l.colno, l, h);
                }
                return l;
              }, m.parseFloorDiv = function() {
                for (var l = this.parseMod(); this.skipValue(a.TOKEN_OPERATOR, "//"); ) {
                  var h = this.parseMod();
                  l = new A.FloorDiv(l.lineno, l.colno, l, h);
                }
                return l;
              }, m.parseMod = function() {
                for (var l = this.parsePow(); this.skipValue(a.TOKEN_OPERATOR, "%"); ) {
                  var h = this.parsePow();
                  l = new A.Mod(l.lineno, l.colno, l, h);
                }
                return l;
              }, m.parsePow = function() {
                for (var l = this.parseUnary(); this.skipValue(a.TOKEN_OPERATOR, "**"); ) {
                  var h = this.parseUnary();
                  l = new A.Pow(l.lineno, l.colno, l, h);
                }
                return l;
              }, m.parseUnary = function(l) {
                var h = this.peekToken(), I;
                return this.skipValue(a.TOKEN_OPERATOR, "-") ? I = new A.Neg(h.lineno, h.colno, this.parseUnary(!0)) : this.skipValue(a.TOKEN_OPERATOR, "+") ? I = new A.Pos(h.lineno, h.colno, this.parseUnary(!0)) : I = this.parsePrimary(), l || (I = this.parseFilter(I)), I;
              }, m.parsePrimary = function(l) {
                var h = this.nextToken(), I, d = null;
                if (h ? h.type === a.TOKEN_STRING ? I = h.value : h.type === a.TOKEN_INT ? I = parseInt(h.value, 10) : h.type === a.TOKEN_FLOAT ? I = parseFloat(h.value) : h.type === a.TOKEN_BOOLEAN ? h.value === "true" ? I = !0 : h.value === "false" ? I = !1 : this.fail("invalid boolean: " + h.value, h.lineno, h.colno) : h.type === a.TOKEN_NONE ? I = null : h.type === a.TOKEN_REGEX && (I = new RegExp(h.value.body, h.value.flags)) : this.fail("expected expression, got end of file"), I !== void 0 ? d = new A.Literal(h.lineno, h.colno, I) : h.type === a.TOKEN_SYMBOL ? d = new A.Symbol(h.lineno, h.colno, h.value) : (this.pushToken(h), d = this.parseAggregate()), l || (d = this.parsePostfix(d)), d)
                  return d;
                throw this.error("unexpected token: " + h.value, h.lineno, h.colno);
              }, m.parseFilterName = function() {
                for (var l = this.expect(a.TOKEN_SYMBOL), h = l.value; this.skipValue(a.TOKEN_OPERATOR, "."); )
                  h += "." + this.expect(a.TOKEN_SYMBOL).value;
                return new A.Symbol(l.lineno, l.colno, h);
              }, m.parseFilterArgs = function(l) {
                if (this.peekToken().type === a.TOKEN_LEFT_PAREN) {
                  var h = this.parsePostfix(l);
                  return h.args.children;
                }
                return [];
              }, m.parseFilter = function(l) {
                for (; this.skip(a.TOKEN_PIPE); ) {
                  var h = this.parseFilterName();
                  l = new A.Filter(h.lineno, h.colno, h, new A.NodeList(h.lineno, h.colno, [l].concat(this.parseFilterArgs(l))));
                }
                return l;
              }, m.parseFilterStatement = function() {
                var l = this.peekToken();
                this.skipSymbol("filter") || this.fail("parseFilterStatement: expected filter");
                var h = this.parseFilterName(), I = this.parseFilterArgs(h);
                this.advanceAfterBlockEnd(l.value);
                var d = new A.Capture(h.lineno, h.colno, this.parseUntilBlocks("endfilter"));
                this.advanceAfterBlockEnd();
                var E = new A.Filter(h.lineno, h.colno, h, new A.NodeList(h.lineno, h.colno, [d].concat(I)));
                return new A.Output(h.lineno, h.colno, [E]);
              }, m.parseAggregate = function() {
                var l = this.nextToken(), h;
                switch (l.type) {
                  case a.TOKEN_LEFT_PAREN:
                    h = new A.Group(l.lineno, l.colno);
                    break;
                  case a.TOKEN_LEFT_BRACKET:
                    h = new A.Array(l.lineno, l.colno);
                    break;
                  case a.TOKEN_LEFT_CURLY:
                    h = new A.Dict(l.lineno, l.colno);
                    break;
                  default:
                    return null;
                }
                for (; ; ) {
                  var I = this.peekToken().type;
                  if (I === a.TOKEN_RIGHT_PAREN || I === a.TOKEN_RIGHT_BRACKET || I === a.TOKEN_RIGHT_CURLY) {
                    this.nextToken();
                    break;
                  }
                  if (h.children.length > 0 && (this.skip(a.TOKEN_COMMA) || this.fail("parseAggregate: expected comma after expression", l.lineno, l.colno)), h instanceof A.Dict) {
                    var d = this.parsePrimary();
                    this.skip(a.TOKEN_COLON) || this.fail("parseAggregate: expected colon after dict key", l.lineno, l.colno);
                    var E = this.parseExpression();
                    h.addChild(new A.Pair(d.lineno, d.colno, d, E));
                  } else {
                    var v = this.parseExpression();
                    h.addChild(v);
                  }
                }
                return h;
              }, m.parseSignature = function(l, h) {
                var I = this.peekToken();
                if (!h && I.type !== a.TOKEN_LEFT_PAREN) {
                  if (l)
                    return null;
                  this.fail("expected arguments", I.lineno, I.colno);
                }
                I.type === a.TOKEN_LEFT_PAREN && (I = this.nextToken());
                for (var d = new A.NodeList(I.lineno, I.colno), E = new A.KeywordArgs(I.lineno, I.colno), v = !1; ; ) {
                  if (I = this.peekToken(), !h && I.type === a.TOKEN_RIGHT_PAREN) {
                    this.nextToken();
                    break;
                  } else if (h && I.type === a.TOKEN_BLOCK_END)
                    break;
                  if (v && !this.skip(a.TOKEN_COMMA))
                    this.fail("parseSignature: expected comma after expression", I.lineno, I.colno);
                  else {
                    var f = this.parseExpression();
                    this.skipValue(a.TOKEN_OPERATOR, "=") ? E.addChild(new A.Pair(f.lineno, f.colno, f, this.parseExpression())) : d.addChild(f);
                  }
                  v = !0;
                }
                return E.children.length && d.addChild(E), d;
              }, m.parseUntilBlocks = function() {
                for (var l = this.breakOnBlocks, h = arguments.length, I = new Array(h), d = 0; d < h; d++)
                  I[d] = arguments[d];
                this.breakOnBlocks = I;
                var E = this.parse();
                return this.breakOnBlocks = l, E;
              }, m.parseNodes = function() {
                for (var l, h = []; l = this.nextToken(); )
                  if (l.type === a.TOKEN_DATA) {
                    var I = l.value, d = this.peekToken(), E = d && d.value;
                    this.dropLeadingWhitespace && (I = I.replace(/^\s*/, ""), this.dropLeadingWhitespace = !1), d && (d.type === a.TOKEN_BLOCK_START && E.charAt(E.length - 1) === "-" || d.type === a.TOKEN_VARIABLE_START && E.charAt(this.tokens.tags.VARIABLE_START.length) === "-" || d.type === a.TOKEN_COMMENT && E.charAt(this.tokens.tags.COMMENT_START.length) === "-") && (I = I.replace(/\s*$/, "")), h.push(new A.Output(l.lineno, l.colno, [new A.TemplateData(l.lineno, l.colno, I)]));
                  } else if (l.type === a.TOKEN_BLOCK_START) {
                    this.dropLeadingWhitespace = !1;
                    var v = this.parseStatement();
                    if (!v)
                      break;
                    h.push(v);
                  } else if (l.type === a.TOKEN_VARIABLE_START) {
                    var f = this.parseExpression();
                    this.dropLeadingWhitespace = !1, this.advanceAfterVariableEnd(), h.push(new A.Output(l.lineno, l.colno, [f]));
                  } else l.type === a.TOKEN_COMMENT ? this.dropLeadingWhitespace = l.value.charAt(l.value.length - this.tokens.tags.COMMENT_END.length - 1) === "-" : this.fail("Unexpected token at top-level: " + l.type, l.lineno, l.colno);
                return h;
              }, m.parse = function() {
                return new A.NodeList(0, 0, this.parseNodes());
              }, m.parseAsRoot = function() {
                return new A.Root(0, 0, this.parseNodes());
              }, p;
            })(g);
            e.exports = {
              parse: function(C, p, m) {
                var l = new u(a.lex(C, m));
                return p !== void 0 && (l.extensions = p), l.parseAsRoot();
              },
              Parser: u
            };
          }),
          /* 9 */
          /***/
          (function(e, n, r) {
            var s = r(0), o = ` 
	\r `, a = "()[]{}%*-+~/#,:|.<>=!", A = "0123456789", g = "{%", c = "%}", u = "{{", C = "}}", p = "{#", m = "#}", l = "string", h = "whitespace", I = "data", d = "block-start", E = "block-end", v = "variable-start", f = "variable-end", y = "comment", w = "left-paren", T = "right-paren", M = "left-bracket", x = "right-bracket", _ = "left-curly", S = "right-curly", L = "operator", D = "comma", F = "colon", j = "tilde", R = "pipe", B = "int", k = "float", X = "boolean", Z = "none", W = "symbol", nt = "special", rt = "regex";
            function st(ut, at, H, Q) {
              return {
                type: ut,
                value: at,
                lineno: H,
                colno: Q
              };
            }
            var tt = /* @__PURE__ */ (function() {
              function ut(H, Q) {
                this.str = H, this.index = 0, this.len = H.length, this.lineno = 0, this.colno = 0, this.in_code = !1, Q = Q || {};
                var K = Q.tags || {};
                this.tags = {
                  BLOCK_START: K.blockStart || g,
                  BLOCK_END: K.blockEnd || c,
                  VARIABLE_START: K.variableStart || u,
                  VARIABLE_END: K.variableEnd || C,
                  COMMENT_START: K.commentStart || p,
                  COMMENT_END: K.commentEnd || m
                }, this.trimBlocks = !!Q.trimBlocks, this.lstripBlocks = !!Q.lstripBlocks;
              }
              var at = ut.prototype;
              return at.nextToken = function() {
                var H = this.lineno, Q = this.colno, K;
                if (this.in_code) {
                  var yt = this.current();
                  if (this.isFinished())
                    return null;
                  if (yt === '"' || yt === "'")
                    return st(l, this._parseString(yt), H, Q);
                  if (K = this._extract(o))
                    return st(h, K, H, Q);
                  if ((K = this._extractString(this.tags.BLOCK_END)) || (K = this._extractString("-" + this.tags.BLOCK_END)))
                    return this.in_code = !1, this.trimBlocks && (yt = this.current(), yt === `
` ? this.forward() : yt === "\r" && (this.forward(), yt = this.current(), yt === `
` ? this.forward() : this.back())), st(E, K, H, Q);
                  if ((K = this._extractString(this.tags.VARIABLE_END)) || (K = this._extractString("-" + this.tags.VARIABLE_END)))
                    return this.in_code = !1, st(f, K, H, Q);
                  if (yt === "r" && this.str.charAt(this.index + 1) === "/") {
                    this.forwardN(2);
                    for (var zt = ""; !this.isFinished(); )
                      if (this.current() === "/" && this.previous() !== "\\") {
                        this.forward();
                        break;
                      } else
                        zt += this.current(), this.forward();
                    for (var ce = ["g", "i", "m", "y"], vt = ""; !this.isFinished(); ) {
                      var dt = ce.indexOf(this.current()) !== -1;
                      if (dt)
                        vt += this.current(), this.forward();
                      else
                        break;
                    }
                    return st(rt, {
                      body: zt,
                      flags: vt
                    }, H, Q);
                  } else if (a.indexOf(yt) !== -1) {
                    this.forward();
                    var O = ["==", "===", "!=", "!==", "<=", ">=", "//", "**"], N = yt + this.current(), V;
                    switch (s.indexOf(O, N) !== -1 && (this.forward(), yt = N, s.indexOf(O, N + this.current()) !== -1 && (yt = N + this.current(), this.forward())), yt) {
                      case "(":
                        V = w;
                        break;
                      case ")":
                        V = T;
                        break;
                      case "[":
                        V = M;
                        break;
                      case "]":
                        V = x;
                        break;
                      case "{":
                        V = _;
                        break;
                      case "}":
                        V = S;
                        break;
                      case ",":
                        V = D;
                        break;
                      case ":":
                        V = F;
                        break;
                      case "~":
                        V = j;
                        break;
                      case "|":
                        V = R;
                        break;
                      default:
                        V = L;
                    }
                    return st(V, yt, H, Q);
                  } else if (K = this._extractUntil(o + a), K.match(/^[-+]?[0-9]+$/))
                    if (this.current() === ".") {
                      this.forward();
                      var Y = this._extract(A);
                      return st(k, K + "." + Y, H, Q);
                    } else
                      return st(B, K, H, Q);
                  else {
                    if (K.match(/^(true|false)$/))
                      return st(X, K, H, Q);
                    if (K === "none" || K === "null")
                      return st(Z, K, H, Q);
                    if (K)
                      return st(W, K, H, Q);
                    throw new Error("Unexpected value while parsing: " + K);
                  }
                } else {
                  var ot = this.tags.BLOCK_START.charAt(0) + this.tags.VARIABLE_START.charAt(0) + this.tags.COMMENT_START.charAt(0) + this.tags.COMMENT_END.charAt(0);
                  if (this.isFinished())
                    return null;
                  if ((K = this._extractString(this.tags.BLOCK_START + "-")) || (K = this._extractString(this.tags.BLOCK_START)))
                    return this.in_code = !0, st(d, K, H, Q);
                  if ((K = this._extractString(this.tags.VARIABLE_START + "-")) || (K = this._extractString(this.tags.VARIABLE_START)))
                    return this.in_code = !0, st(v, K, H, Q);
                  K = "";
                  var et, gt = !1;
                  for (this._matches(this.tags.COMMENT_START) && (gt = !0, K = this._extractString(this.tags.COMMENT_START)); (et = this._extractUntil(ot)) !== null; )
                    if (K += et, (this._matches(this.tags.BLOCK_START) || this._matches(this.tags.VARIABLE_START) || this._matches(this.tags.COMMENT_START)) && !gt) {
                      if (this.lstripBlocks && this._matches(this.tags.BLOCK_START) && this.colno > 0 && this.colno <= K.length) {
                        var At = K.slice(-this.colno);
                        if (/^\s+$/.test(At) && (K = K.slice(0, -this.colno), !K.length))
                          return this.nextToken();
                      }
                      break;
                    } else if (this._matches(this.tags.COMMENT_END)) {
                      if (!gt)
                        throw new Error("unexpected end of comment");
                      K += this._extractString(this.tags.COMMENT_END);
                      break;
                    } else
                      K += this.current(), this.forward();
                  if (et === null && gt)
                    throw new Error("expected end of comment, got end of file");
                  return st(gt ? y : I, K, H, Q);
                }
              }, at._parseString = function(H) {
                this.forward();
                for (var Q = ""; !this.isFinished() && this.current() !== H; ) {
                  var K = this.current();
                  if (K === "\\") {
                    switch (this.forward(), this.current()) {
                      case "n":
                        Q += `
`;
                        break;
                      case "t":
                        Q += "	";
                        break;
                      case "r":
                        Q += "\r";
                        break;
                      default:
                        Q += this.current();
                    }
                    this.forward();
                  } else
                    Q += K, this.forward();
                }
                return this.forward(), Q;
              }, at._matches = function(H) {
                if (this.index + H.length > this.len)
                  return null;
                var Q = this.str.slice(this.index, this.index + H.length);
                return Q === H;
              }, at._extractString = function(H) {
                return this._matches(H) ? (this.forwardN(H.length), H) : null;
              }, at._extractUntil = function(H) {
                return this._extractMatching(!0, H || "");
              }, at._extract = function(H) {
                return this._extractMatching(!1, H);
              }, at._extractMatching = function(H, Q) {
                if (this.isFinished())
                  return null;
                var K = Q.indexOf(this.current());
                if (H && K === -1 || !H && K !== -1) {
                  var yt = this.current();
                  this.forward();
                  for (var zt = Q.indexOf(this.current()); (H && zt === -1 || !H && zt !== -1) && !this.isFinished(); )
                    yt += this.current(), this.forward(), zt = Q.indexOf(this.current());
                  return yt;
                }
                return "";
              }, at._extractRegex = function(H) {
                var Q = this.currentStr().match(H);
                return Q ? (this.forwardN(Q[0].length), Q) : null;
              }, at.isFinished = function() {
                return this.index >= this.len;
              }, at.forwardN = function(H) {
                for (var Q = 0; Q < H; Q++)
                  this.forward();
              }, at.forward = function() {
                this.index++, this.previous() === `
` ? (this.lineno++, this.colno = 0) : this.colno++;
              }, at.backN = function(H) {
                for (var Q = 0; Q < H; Q++)
                  this.back();
              }, at.back = function() {
                if (this.index--, this.current() === `
`) {
                  this.lineno--;
                  var H = this.src.lastIndexOf(`
`, this.index - 1);
                  H === -1 ? this.colno = this.index : this.colno = this.index - H;
                } else
                  this.colno--;
              }, at.current = function() {
                return this.isFinished() ? "" : this.str.charAt(this.index);
              }, at.currentStr = function() {
                return this.isFinished() ? "" : this.str.substr(this.index);
              }, at.previous = function() {
                return this.str.charAt(this.index - 1);
              }, ut;
            })();
            e.exports = {
              lex: function(ut, at) {
                return new tt(ut, at);
              },
              TOKEN_STRING: l,
              TOKEN_WHITESPACE: h,
              TOKEN_DATA: I,
              TOKEN_BLOCK_START: d,
              TOKEN_BLOCK_END: E,
              TOKEN_VARIABLE_START: v,
              TOKEN_VARIABLE_END: f,
              TOKEN_COMMENT: y,
              TOKEN_LEFT_PAREN: w,
              TOKEN_RIGHT_PAREN: T,
              TOKEN_LEFT_BRACKET: M,
              TOKEN_RIGHT_BRACKET: x,
              TOKEN_LEFT_CURLY: _,
              TOKEN_RIGHT_CURLY: S,
              TOKEN_OPERATOR: L,
              TOKEN_COMMA: D,
              TOKEN_COLON: F,
              TOKEN_TILDE: j,
              TOKEN_PIPE: R,
              TOKEN_INT: B,
              TOKEN_FLOAT: k,
              TOKEN_BOOLEAN: X,
              TOKEN_NONE: Z,
              TOKEN_SYMBOL: W,
              TOKEN_SPECIAL: nt,
              TOKEN_REGEX: rt
            };
          }),
          /* 10 */
          /***/
          (function(e, n, r) {
            function s(u, C) {
              u.prototype = Object.create(C.prototype), u.prototype.constructor = u, o(u, C);
            }
            function o(u, C) {
              return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(p, m) {
                return p.__proto__ = m, p;
              }, o(u, C);
            }
            var a = r(6), A = r(19), g = A.PrecompiledLoader, c = /* @__PURE__ */ (function(u) {
              s(C, u);
              function C(m, l) {
                var h;
                return h = u.call(this) || this, h.baseURL = m || ".", l = l || {}, h.useCache = !!l.useCache, h.async = !!l.async, h;
              }
              var p = C.prototype;
              return p.resolve = function(m, l) {
                throw new Error("relative templates not support in the browser yet");
              }, p.getSource = function(m, l) {
                var h = this, I = this.useCache, d;
                return this.fetch(this.baseURL + "/" + m, function(E, v) {
                  if (E)
                    if (l)
                      l(E.content);
                    else if (E.status === 404)
                      d = null;
                    else
                      throw E.content;
                  else
                    d = {
                      src: v,
                      path: m,
                      noCache: !I
                    }, h.emit("load", m, d), l && l(null, d);
                }), d;
              }, p.fetch = function(m, l) {
                if (typeof window > "u")
                  throw new Error("WebLoader can only by used in a browser");
                var h = new XMLHttpRequest(), I = !0;
                h.onreadystatechange = function() {
                  h.readyState === 4 && I && (I = !1, h.status === 0 || h.status === 200 ? l(null, h.responseText) : l({
                    status: h.status,
                    content: h.responseText
                  }));
                }, m += (m.indexOf("?") === -1 ? "?" : "&") + "s=" + (/* @__PURE__ */ new Date()).getTime(), h.open("GET", m, this.async), h.send();
              }, C;
            })(a);
            e.exports = {
              WebLoader: c,
              PrecompiledLoader: g
            };
          }),
          /* 11 */
          /***/
          (function(e, n, r) {
            var s = r(0), o = r(7), a = o.Environment, A = o.Template, g = r(6), c = r(10), u = r(23), C = r(5), p = r(8), m = r(9), l = r(2), h = r(3), I = r(25), d;
            function E(v, f) {
              f = f || {}, s.isObject(v) && (f = v, v = null);
              var y;
              return c.FileSystemLoader ? y = new c.FileSystemLoader(v, {
                watch: f.watch,
                noCache: f.noCache
              }) : c.WebLoader && (y = new c.WebLoader(v, {
                useCache: f.web && f.web.useCache,
                async: f.web && f.web.async
              })), d = new a(y, f), f && f.express && d.express(f.express), d;
            }
            e.exports = {
              Environment: a,
              Template: A,
              Loader: g,
              FileSystemLoader: c.FileSystemLoader,
              NodeResolveLoader: c.NodeResolveLoader,
              PrecompiledLoader: c.PrecompiledLoader,
              WebLoader: c.WebLoader,
              compiler: C,
              parser: p,
              lexer: m,
              runtime: l,
              lib: s,
              nodes: h,
              installJinjaCompat: I,
              configure: E,
              reset: function() {
                d = void 0;
              },
              compile: function(v, f, y, w) {
                return d || E(), new A(v, f, y, w);
              },
              render: function(v, f, y) {
                return d || E(), d.render(v, f, y);
              },
              renderString: function(v, f, y) {
                return d || E(), d.renderString(v, f, y);
              },
              precompile: u ? u.precompile : void 0,
              precompileString: u ? u.precompileString : void 0
            };
          }),
          /* 12 */
          /***/
          (function(e, n, r) {
            var s = r(13), o = [], a = [], A = s.makeRequestCallFromTimer(g);
            function g() {
              if (a.length)
                throw a.shift();
            }
            e.exports = c;
            function c(C) {
              var p;
              o.length ? p = o.pop() : p = new u(), p.task = C, s(p);
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
          (function(e, n, r) {
            (function(s) {
              e.exports = o;
              function o(h) {
                a.length || A(), a[a.length] = h;
              }
              var a = [], A, g = 0, c = 1024;
              function u() {
                for (; g < a.length; ) {
                  var h = g;
                  if (g = g + 1, a[h].call(), g > c) {
                    for (var I = 0, d = a.length - g; I < d; I++)
                      a[I] = a[I + g];
                    a.length -= g, g = 0;
                  }
                }
                a.length = 0, g = 0;
              }
              var C = typeof s < "u" ? s : self, p = C.MutationObserver || C.WebKitMutationObserver;
              typeof p == "function" ? A = m(u) : A = l(u), o.requestFlush = A;
              function m(h) {
                var I = 1, d = new p(h), E = document.createTextNode("");
                return d.observe(E, { characterData: !0 }), function() {
                  I = -I, E.data = I;
                };
              }
              function l(h) {
                return function() {
                  var I = setTimeout(E, 0), d = setInterval(E, 50);
                  function E() {
                    clearTimeout(I), clearInterval(d), h();
                  }
                };
              }
              o.makeRequestCallFromTimer = l;
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
            (function(a) {
              var A = function() {
                var p = Array.prototype.slice.call(arguments);
                typeof p[0] == "function" && p[0].apply(null, p.splice(1));
              }, g = function(p) {
                typeof setImmediate == "function" ? setImmediate(p) : typeof process < "u" && process.nextTick ? process.nextTick(p) : setTimeout(p, 0);
              }, c = function(p) {
                var m = function(l) {
                  var h = function() {
                    return p.length && p[l].apply(null, arguments), h.next();
                  };
                  return h.next = function() {
                    return l < p.length - 1 ? m(l + 1) : null;
                  }, h;
                };
                return m(0);
              }, u = Array.isArray || function(p) {
                return Object.prototype.toString.call(p) === "[object Array]";
              }, C = function(p, m, l) {
                var h = l ? g : A;
                if (m = m || function() {
                }, !u(p)) {
                  var I = new Error("First argument to waterfall must be an array of functions");
                  return m(I);
                }
                if (!p.length)
                  return m();
                var d = function(E) {
                  return function(v) {
                    if (v)
                      m.apply(null, arguments), m = function() {
                      };
                    else {
                      var f = Array.prototype.slice.call(arguments, 1), y = E.next();
                      y ? f.push(d(y)) : f.push(m), h(function() {
                        E.apply(null, f);
                      });
                    }
                  };
                };
                d(c(p))();
              };
              s = [], o = (function() {
                return C;
              }).apply(n, s), o !== void 0 && (e.exports = o);
            })();
          }),
          /* 16 */
          /***/
          (function(e, n, r) {
            var s = typeof Reflect == "object" ? Reflect : null, o = s && typeof s.apply == "function" ? s.apply : function(M, x, _) {
              return Function.prototype.apply.call(M, x, _);
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
            e.exports = c, e.exports.once = y, c.EventEmitter = c, c.prototype._events = void 0, c.prototype._eventsCount = 0, c.prototype._maxListeners = void 0;
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
            function p(M) {
              return M._maxListeners === void 0 ? c.defaultMaxListeners : M._maxListeners;
            }
            c.prototype.getMaxListeners = function() {
              return p(this);
            }, c.prototype.emit = function(M) {
              for (var x = [], _ = 1; _ < arguments.length; _++) x.push(arguments[_]);
              var S = M === "error", L = this._events;
              if (L !== void 0)
                S = S && L.error === void 0;
              else if (!S)
                return !1;
              if (S) {
                var D;
                if (x.length > 0 && (D = x[0]), D instanceof Error)
                  throw D;
                var F = new Error("Unhandled error." + (D ? " (" + D.message + ")" : ""));
                throw F.context = D, F;
              }
              var j = L[M];
              if (j === void 0)
                return !1;
              if (typeof j == "function")
                o(j, this, x);
              else
                for (var R = j.length, B = E(j, R), _ = 0; _ < R; ++_)
                  o(B[_], this, x);
              return !0;
            };
            function m(M, x, _, S) {
              var L, D, F;
              if (C(_), D = M._events, D === void 0 ? (D = M._events = /* @__PURE__ */ Object.create(null), M._eventsCount = 0) : (D.newListener !== void 0 && (M.emit(
                "newListener",
                x,
                _.listener ? _.listener : _
              ), D = M._events), F = D[x]), F === void 0)
                F = D[x] = _, ++M._eventsCount;
              else if (typeof F == "function" ? F = D[x] = S ? [_, F] : [F, _] : S ? F.unshift(_) : F.push(_), L = p(M), L > 0 && F.length > L && !F.warned) {
                F.warned = !0;
                var j = new Error("Possible EventEmitter memory leak detected. " + F.length + " " + String(x) + " listeners added. Use emitter.setMaxListeners() to increase limit");
                j.name = "MaxListenersExceededWarning", j.emitter = M, j.type = x, j.count = F.length, A(j);
              }
              return M;
            }
            c.prototype.addListener = function(M, x) {
              return m(this, M, x, !1);
            }, c.prototype.on = c.prototype.addListener, c.prototype.prependListener = function(M, x) {
              return m(this, M, x, !0);
            };
            function l() {
              if (!this.fired)
                return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
            }
            function h(M, x, _) {
              var S = { fired: !1, wrapFn: void 0, target: M, type: x, listener: _ }, L = l.bind(S);
              return L.listener = _, S.wrapFn = L, L;
            }
            c.prototype.once = function(M, x) {
              return C(x), this.on(M, h(this, M, x)), this;
            }, c.prototype.prependOnceListener = function(M, x) {
              return C(x), this.prependListener(M, h(this, M, x)), this;
            }, c.prototype.removeListener = function(M, x) {
              var _, S, L, D, F;
              if (C(x), S = this._events, S === void 0)
                return this;
              if (_ = S[M], _ === void 0)
                return this;
              if (_ === x || _.listener === x)
                --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete S[M], S.removeListener && this.emit("removeListener", M, _.listener || x));
              else if (typeof _ != "function") {
                for (L = -1, D = _.length - 1; D >= 0; D--)
                  if (_[D] === x || _[D].listener === x) {
                    F = _[D].listener, L = D;
                    break;
                  }
                if (L < 0)
                  return this;
                L === 0 ? _.shift() : v(_, L), _.length === 1 && (S[M] = _[0]), S.removeListener !== void 0 && this.emit("removeListener", M, F || x);
              }
              return this;
            }, c.prototype.off = c.prototype.removeListener, c.prototype.removeAllListeners = function(M) {
              var x, _, S;
              if (_ = this._events, _ === void 0)
                return this;
              if (_.removeListener === void 0)
                return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : _[M] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete _[M]), this;
              if (arguments.length === 0) {
                var L = Object.keys(_), D;
                for (S = 0; S < L.length; ++S)
                  D = L[S], D !== "removeListener" && this.removeAllListeners(D);
                return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
              }
              if (x = _[M], typeof x == "function")
                this.removeListener(M, x);
              else if (x !== void 0)
                for (S = x.length - 1; S >= 0; S--)
                  this.removeListener(M, x[S]);
              return this;
            };
            function I(M, x, _) {
              var S = M._events;
              if (S === void 0)
                return [];
              var L = S[x];
              return L === void 0 ? [] : typeof L == "function" ? _ ? [L.listener || L] : [L] : _ ? f(L) : E(L, L.length);
            }
            c.prototype.listeners = function(M) {
              return I(this, M, !0);
            }, c.prototype.rawListeners = function(M) {
              return I(this, M, !1);
            }, c.listenerCount = function(M, x) {
              return typeof M.listenerCount == "function" ? M.listenerCount(x) : d.call(M, x);
            }, c.prototype.listenerCount = d;
            function d(M) {
              var x = this._events;
              if (x !== void 0) {
                var _ = x[M];
                if (typeof _ == "function")
                  return 1;
                if (_ !== void 0)
                  return _.length;
              }
              return 0;
            }
            c.prototype.eventNames = function() {
              return this._eventsCount > 0 ? a(this._events) : [];
            };
            function E(M, x) {
              for (var _ = new Array(x), S = 0; S < x; ++S)
                _[S] = M[S];
              return _;
            }
            function v(M, x) {
              for (; x + 1 < M.length; x++)
                M[x] = M[x + 1];
              M.pop();
            }
            function f(M) {
              for (var x = new Array(M.length), _ = 0; _ < x.length; ++_)
                x[_] = M[_].listener || M[_];
              return x;
            }
            function y(M, x) {
              return new Promise(function(_, S) {
                function L(F) {
                  M.removeListener(x, D), S(F);
                }
                function D() {
                  typeof M.removeListener == "function" && M.removeListener("error", L), _([].slice.call(arguments));
                }
                T(M, x, D, { once: !0 }), x !== "error" && w(M, L, { once: !0 });
              });
            }
            function w(M, x, _) {
              typeof M.on == "function" && T(M, "error", x, _);
            }
            function T(M, x, _, S) {
              if (typeof M.on == "function")
                S.once ? M.once(x, _) : M.on(x, _);
              else if (typeof M.addEventListener == "function")
                M.addEventListener(x, function L(D) {
                  S.once && M.removeEventListener(x, L), _(D);
                });
              else
                throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof M);
            }
          }),
          /* 17 */
          /***/
          (function(e, n, r) {
            var s = r(3), o = r(0), a = 0;
            function A() {
              return "hole_" + a++;
            }
            function g(d, E) {
              for (var v = null, f = 0; f < d.length; f++) {
                var y = E(d[f]);
                y !== d[f] && (v || (v = d.slice()), v[f] = y);
              }
              return v || d;
            }
            function c(d, E, v) {
              if (!(d instanceof s.Node))
                return d;
              if (!v) {
                var f = E(d);
                if (f && f !== d)
                  return f;
              }
              if (d instanceof s.NodeList) {
                var y = g(d.children, function(_) {
                  return c(_, E, v);
                });
                y !== d.children && (d = new s[d.typename](d.lineno, d.colno, y));
              } else if (d instanceof s.CallExtension) {
                var w = c(d.args, E, v), T = g(d.contentArgs, function(_) {
                  return c(_, E, v);
                });
                (w !== d.args || T !== d.contentArgs) && (d = new s[d.typename](d.extName, d.prop, w, T));
              } else {
                var M = d.fields.map(function(_) {
                  return d[_];
                }), x = g(M, function(_) {
                  return c(_, E, v);
                });
                x !== M && (d = new s[d.typename](d.lineno, d.colno), x.forEach(function(_, S) {
                  d[d.fields[S]] = _;
                }));
              }
              return v && E(d) || d;
            }
            function u(d, E) {
              return c(d, E, !0);
            }
            function C(d, E, v) {
              var f = [], y = u(v ? d[v] : d, function(w) {
                var T;
                return w instanceof s.Block ? w : ((w instanceof s.Filter && o.indexOf(E, w.name.value) !== -1 || w instanceof s.CallExtensionAsync) && (T = new s.Symbol(w.lineno, w.colno, A()), f.push(new s.FilterAsync(w.lineno, w.colno, w.name, w.args, T))), T);
              });
              return v ? d[v] = y : d = y, f.length ? (f.push(d), new s.NodeList(d.lineno, d.colno, f)) : d;
            }
            function p(d, E) {
              return u(d, function(v) {
                return v instanceof s.Output ? C(v, E) : v instanceof s.Set ? C(v, E, "value") : v instanceof s.For ? C(v, E, "arr") : v instanceof s.If ? C(v, E, "cond") : v instanceof s.CallExtension ? C(v, E, "args") : void 0;
              });
            }
            function m(d) {
              return c(d, function(E) {
                if (E instanceof s.Block) {
                  var v = !1, f = A();
                  E.body = c(E.body, function(y) {
                    if (y instanceof s.FunCall && y.name.value === "super")
                      return v = !0, new s.Symbol(y.lineno, y.colno, f);
                  }), v && E.body.children.unshift(new s.Super(0, 0, E.name, new s.Symbol(0, 0, f)));
                }
              });
            }
            function l(d) {
              return u(d, function(E) {
                if (!(!(E instanceof s.If) && !(E instanceof s.For))) {
                  var v = !1;
                  if (c(E, function(f) {
                    if (f instanceof s.FilterAsync || f instanceof s.IfAsync || f instanceof s.AsyncEach || f instanceof s.AsyncAll || f instanceof s.CallExtensionAsync)
                      return v = !0, f;
                  }), v) {
                    if (E instanceof s.If)
                      return new s.IfAsync(E.lineno, E.colno, E.cond, E.body, E.else_);
                    if (E instanceof s.For && !(E instanceof s.AsyncAll))
                      return new s.AsyncEach(E.lineno, E.colno, E.arr, E.name, E.body, E.else_);
                  }
                }
              });
            }
            function h(d, E) {
              return l(m(p(d, E)));
            }
            function I(d, E) {
              return h(d, E || []);
            }
            e.exports = {
              transform: I
            };
          }),
          /* 18 */
          /***/
          (function(e, a, r) {
            var s = r(0), o = r(2), a = e.exports = {};
            function A(O, N) {
              return O == null || O === !1 ? N : O;
            }
            a.abs = Math.abs;
            function g(O) {
              return O !== O;
            }
            function c(O, N, V) {
              var Y, ot = [], et = [];
              for (Y = 0; Y < O.length; Y++)
                Y % N === 0 && et.length && (ot.push(et), et = []), et.push(O[Y]);
              if (et.length) {
                if (V)
                  for (Y = et.length; Y < N; Y++)
                    et.push(V);
                ot.push(et);
              }
              return ot;
            }
            a.batch = c;
            function u(O) {
              O = A(O, "");
              var N = O.toLowerCase();
              return o.copySafeness(O, N.charAt(0).toUpperCase() + N.slice(1));
            }
            a.capitalize = u;
            function C(O, N) {
              if (O = A(O, ""), N = N || 80, O.length >= N)
                return O;
              var V = N - O.length, Y = s.repeat(" ", V / 2 - V % 2), ot = s.repeat(" ", V / 2);
              return o.copySafeness(O, Y + O + ot);
            }
            a.center = C;
            function p(O, N, V) {
              return V ? O || N : O !== void 0 ? O : N;
            }
            a.default = p;
            function m(O, N, V) {
              if (!s.isObject(O))
                throw new s.TemplateError("dictsort filter: val must be an object");
              var Y = [];
              for (var ot in O)
                Y.push([ot, O[ot]]);
              var et;
              if (V === void 0 || V === "key")
                et = 0;
              else if (V === "value")
                et = 1;
              else
                throw new s.TemplateError("dictsort filter: You can only sort by either key or value");
              return Y.sort(function(gt, At) {
                var bt = gt[et], St = At[et];
                return N || (s.isString(bt) && (bt = bt.toUpperCase()), s.isString(St) && (St = St.toUpperCase())), bt > St ? 1 : bt === St ? 0 : -1;
              }), Y;
            }
            a.dictsort = m;
            function l(O, N) {
              return JSON.stringify(O, null, N);
            }
            a.dump = l;
            function h(O) {
              return O instanceof o.SafeString ? O : (O = O ?? "", o.markSafe(s.escape(O.toString())));
            }
            a.escape = h;
            function I(O) {
              return O instanceof o.SafeString ? O : (O = O ?? "", o.markSafe(O.toString()));
            }
            a.safe = I;
            function d(O) {
              return O[0];
            }
            a.first = d;
            function E(O) {
              return O = O ?? "", o.markSafe(s.escape(O.toString()));
            }
            a.forceescape = E;
            function v(O, N) {
              return s.groupBy(O, N, this.env.opts.throwOnUndefined);
            }
            a.groupby = v;
            function f(O, N, V) {
              if (O = A(O, ""), O === "")
                return "";
              N = N || 4;
              var Y = O.split(`
`), ot = s.repeat(" ", N), et = Y.map(function(gt, At) {
                return At === 0 && !V ? gt : "" + ot + gt;
              }).join(`
`);
              return o.copySafeness(O, et);
            }
            a.indent = f;
            function y(O, N, V) {
              return N = N || "", V && (O = s.map(O, function(Y) {
                return Y[V];
              })), O.join(N);
            }
            a.join = y;
            function w(O) {
              return O[O.length - 1];
            }
            a.last = w;
            function T(O) {
              var N = A(O, "");
              return N !== void 0 ? typeof Map == "function" && N instanceof Map || typeof Set == "function" && N instanceof Set ? N.size : s.isObject(N) && !(N instanceof o.SafeString) ? s.keys(N).length : N.length : 0;
            }
            a.length = T;
            function M(O) {
              if (s.isString(O))
                return O.split("");
              if (s.isObject(O))
                return s._entries(O || {}).map(function(N) {
                  var V = N[0], Y = N[1];
                  return {
                    key: V,
                    value: Y
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
            function _(O) {
              return O == null ? "" : o.copySafeness(O, O.replace(/\r\n|\n/g, `<br />
`));
            }
            a.nl2br = _;
            function S(O) {
              return O[Math.floor(Math.random() * O.length)];
            }
            a.random = S;
            function L(O) {
              function N(V, Y, ot) {
                Y === void 0 && (Y = "truthy");
                var et = this, gt = et.env.getTest(Y);
                return s.toArray(V).filter(function(At) {
                  return gt.call(et, At, ot) === O;
                });
              }
              return N;
            }
            a.reject = L(!1);
            function D(O, N) {
              return O.filter(function(V) {
                return !V[N];
              });
            }
            a.rejectattr = D, a.select = L(!0);
            function F(O, N) {
              return O.filter(function(V) {
                return !!V[N];
              });
            }
            a.selectattr = F;
            function j(O, N, V, Y) {
              var ot = O;
              if (N instanceof RegExp)
                return O.replace(N, V);
              typeof Y > "u" && (Y = -1);
              var et = "";
              if (typeof N == "number")
                N = "" + N;
              else if (typeof N != "string")
                return O;
              if (typeof O == "number" && (O = "" + O), typeof O != "string" && !(O instanceof o.SafeString))
                return O;
              if (N === "")
                return et = V + O.split("").join(V) + V, o.copySafeness(O, et);
              var gt = O.indexOf(N);
              if (Y === 0 || gt === -1)
                return O;
              for (var At = 0, bt = 0; gt > -1 && (Y === -1 || bt < Y); )
                et += O.substring(At, gt) + V, At = gt + N.length, bt++, gt = O.indexOf(N, At);
              return At < O.length && (et += O.substring(At)), o.copySafeness(ot, et);
            }
            a.replace = j;
            function R(O) {
              var N;
              return s.isString(O) ? N = M(O) : N = s.map(O, function(V) {
                return V;
              }), N.reverse(), s.isString(O) ? o.copySafeness(O, N.join("")) : N;
            }
            a.reverse = R;
            function B(O, N, V) {
              N = N || 0;
              var Y = Math.pow(10, N), ot;
              return V === "ceil" ? ot = Math.ceil : V === "floor" ? ot = Math.floor : ot = Math.round, ot(O * Y) / Y;
            }
            a.round = B;
            function k(O, N, V) {
              for (var Y = Math.floor(O.length / N), ot = O.length % N, et = [], gt = 0, At = 0; At < N; At++) {
                var bt = gt + At * Y;
                At < ot && gt++;
                var St = gt + (At + 1) * Y, Vt = O.slice(bt, St);
                V && At >= ot && Vt.push(V), et.push(Vt);
              }
              return et;
            }
            a.slice = k;
            function X(O, N, V) {
              return V === void 0 && (V = 0), N && (O = s.map(O, function(Y) {
                return Y[N];
              })), V + O.reduce(function(Y, ot) {
                return Y + ot;
              }, 0);
            }
            a.sum = X, a.sort = o.makeMacro(["value", "reverse", "case_sensitive", "attribute"], [], function(O, N, V, Y) {
              var ot = this, et = s.map(O, function(At) {
                return At;
              }), gt = s.getAttrGetter(Y);
              return et.sort(function(At, bt) {
                var St = Y ? gt(At) : At, Vt = Y ? gt(bt) : bt;
                if (ot.env.opts.throwOnUndefined && Y && (St === void 0 || Vt === void 0))
                  throw new TypeError('sort: attribute "' + Y + '" resolved to undefined');
                return !V && s.isString(St) && s.isString(Vt) && (St = St.toLowerCase(), Vt = Vt.toLowerCase()), St < Vt ? N ? 1 : -1 : St > Vt ? N ? -1 : 1 : 0;
              }), et;
            });
            function Z(O) {
              return o.copySafeness(O, O);
            }
            a.string = Z;
            function W(O, N) {
              O = A(O, "");
              var V = /<\/?([a-z][a-z0-9]*)\b[^>]*>|<!--[\s\S]*?-->/gi, Y = rt(O.replace(V, "")), ot = "";
              return N ? ot = Y.replace(/^ +| +$/gm, "").replace(/ +/g, " ").replace(/(\r\n)/g, `
`).replace(/\n\n\n+/g, `

`) : ot = Y.replace(/\s+/gi, " "), o.copySafeness(O, ot);
            }
            a.striptags = W;
            function nt(O) {
              O = A(O, "");
              var N = O.split(" ").map(function(V) {
                return u(V);
              });
              return o.copySafeness(O, N.join(" "));
            }
            a.title = nt;
            function rt(O) {
              return o.copySafeness(O, O.replace(/^\s*|\s*$/g, ""));
            }
            a.trim = rt;
            function st(O, N, V, Y) {
              var ot = O;
              if (O = A(O, ""), N = N || 255, O.length <= N)
                return O;
              if (V)
                O = O.substring(0, N);
              else {
                var et = O.lastIndexOf(" ", N);
                et === -1 && (et = N), O = O.substring(0, et);
              }
              return O += Y ?? "...", o.copySafeness(ot, O);
            }
            a.truncate = st;
            function tt(O) {
              return O = A(O, ""), O.toUpperCase();
            }
            a.upper = tt;
            function ut(O) {
              var N = encodeURIComponent;
              if (s.isString(O))
                return N(O);
              var V = s.isArray(O) ? O : s._entries(O);
              return V.map(function(Y) {
                var ot = Y[0], et = Y[1];
                return N(ot) + "=" + N(et);
              }).join("&");
            }
            a.urlencode = ut;
            var at = /^(?:\(|<|&lt;)?(.*?)(?:\.|,|\)|\n|&gt;)?$/, H = /^[\w.!#$%&'*+\-\/=?\^`{|}~]+@[a-z\d\-]+(\.[a-z\d\-]+)+$/i, Q = /^https?:\/\/.*$/, K = /^www\./, yt = /\.(?:org|net|com)(?:\:|\/|$)/;
            function zt(O, N, V) {
              g(N) && (N = 1 / 0);
              var Y = V === !0 ? ' rel="nofollow"' : "", ot = O.split(/(\s+)/).filter(function(et) {
                return et && et.length;
              }).map(function(et) {
                var gt = et.match(at), At = gt ? gt[1] : et, bt = At.substr(0, N);
                return Q.test(At) ? '<a href="' + At + '"' + Y + ">" + bt + "</a>" : K.test(At) ? '<a href="http://' + At + '"' + Y + ">" + bt + "</a>" : H.test(At) ? '<a href="mailto:' + At + '">' + At + "</a>" : yt.test(At) ? '<a href="http://' + At + '"' + Y + ">" + bt + "</a>" : et;
              });
              return ot.join("");
            }
            a.urlize = zt;
            function ce(O) {
              O = A(O, "");
              var N = O ? O.match(/\w+/g) : null;
              return N ? N.length : null;
            }
            a.wordcount = ce;
            function vt(O, N) {
              var V = parseFloat(O);
              return g(V) ? N : V;
            }
            a.float = vt;
            var dt = o.makeMacro(["value", "default", "base"], [], function(O, N, V) {
              V === void 0 && (V = 10);
              var Y = parseInt(O, V);
              return g(Y) ? N : Y;
            });
            a.int = dt, a.d = a.default, a.e = a.escape;
          }),
          /* 19 */
          /***/
          (function(e, n, r) {
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
                var p;
                return p = g.call(this) || this, p.precompiled = C || {}, p;
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
            e.exports = {
              PrecompiledLoader: A
            };
          }),
          /* 20 */
          /***/
          (function(e, n, r) {
            var s = r(2).SafeString;
            function o(S) {
              return typeof S == "function";
            }
            n.callable = o;
            function a(S) {
              return S !== void 0;
            }
            n.defined = a;
            function A(S, L) {
              return S % L === 0;
            }
            n.divisibleby = A;
            function g(S) {
              return S instanceof s;
            }
            n.escaped = g;
            function c(S, L) {
              return S === L;
            }
            n.equalto = c, n.eq = n.equalto, n.sameas = n.equalto;
            function u(S) {
              return S % 2 === 0;
            }
            n.even = u;
            function C(S) {
              return !S;
            }
            n.falsy = C;
            function p(S, L) {
              return S >= L;
            }
            n.ge = p;
            function m(S, L) {
              return S > L;
            }
            n.greaterthan = m, n.gt = n.greaterthan;
            function l(S, L) {
              return S <= L;
            }
            n.le = l;
            function h(S, L) {
              return S < L;
            }
            n.lessthan = h, n.lt = n.lessthan;
            function I(S) {
              return S.toLowerCase() === S;
            }
            n.lower = I;
            function d(S, L) {
              return S !== L;
            }
            n.ne = d;
            function E(S) {
              return S === null;
            }
            n.null = E;
            function v(S) {
              return typeof S == "number";
            }
            n.number = v;
            function f(S) {
              return S % 2 === 1;
            }
            n.odd = f;
            function y(S) {
              return typeof S == "string";
            }
            n.string = y;
            function w(S) {
              return !!S;
            }
            n.truthy = w;
            function T(S) {
              return S === void 0;
            }
            n.undefined = T;
            function M(S) {
              return S.toUpperCase() === S;
            }
            n.upper = M;
            function x(S) {
              return typeof Symbol < "u" ? !!S[Symbol.iterator] : Array.isArray(S) || typeof S == "string";
            }
            n.iterable = x;
            function _(S) {
              var L = S != null && typeof S == "object" && !Array.isArray(S);
              return Set ? L && !(S instanceof Set) : L;
            }
            n.mapping = _;
          }),
          /* 21 */
          /***/
          (function(e, n, r) {
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
                    for (var p = A; p > g; p += c)
                      u.push(p);
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
            e.exports = a;
          }),
          /* 22 */
          /***/
          (function(e, n, r) {
            var s = r(4);
            e.exports = function(o, a) {
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
          (function(e, n, r) {
            var s = r(4), o = r(4), a = r(0), A = a._prettifyError, g = r(5), c = r(7), u = c.Environment, C = r(24);
            function p(I, d) {
              return Array.isArray(d) ? d.some(function(E) {
                return I.match(E);
              }) : !1;
            }
            function m(I, d) {
              d = d || {}, d.isString = !0;
              var E = d.env || new u([]), v = d.wrapper || C;
              if (!d.name)
                throw new Error('the "name" option is required when compiling a string');
              return v([h(I, d.name, E)], d);
            }
            function l(I, d) {
              d = d || {};
              var E = d.env || new u([]), v = d.wrapper || C;
              if (d.isString)
                return m(I, d);
              var f = s.existsSync(I) && s.statSync(I), y = [], w = [];
              function T(_) {
                s.readdirSync(_).forEach(function(S) {
                  var L = o.join(_, S), D = L.substr(o.join(I, "/").length), F = s.statSync(L);
                  F && F.isDirectory() ? (D += "/", p(D, d.exclude) || T(L)) : p(D, d.include) && w.push(L);
                });
              }
              if (f.isFile())
                y.push(h(s.readFileSync(I, "utf-8"), d.name || I, E));
              else if (f.isDirectory()) {
                T(I);
                for (var M = 0; M < w.length; M++) {
                  var x = w[M].replace(o.join(I, "/"), "");
                  try {
                    y.push(h(s.readFileSync(w[M], "utf-8"), x, E));
                  } catch (_) {
                    if (d.force)
                      console.error(_);
                    else
                      throw _;
                  }
                }
              }
              return v(y, d);
            }
            function h(I, d, E) {
              E = E || new u([]);
              var v = E.asyncFilters, f = E.extensionsList, y;
              d = d.replace(/\\/g, "/");
              try {
                y = g.compile(I, v, f, d, E.opts);
              } catch (w) {
                throw A(d, !1, w);
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
          (function(e, n, r) {
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
            e.exports = s;
          }),
          /* 25 */
          /***/
          (function(e, n, r) {
            function s() {
              var o = this.runtime, a = this.lib, A = this.compiler.Compiler, g = this.parser.Parser, c = this.nodes, u = this.lexer, C = o.contextOrFrameLookup, p = o.memberLookup, m, l;
              A && (m = A.prototype.assertType), g && (l = g.prototype.parseAggregate);
              function h() {
                o.contextOrFrameLookup = C, o.memberLookup = p, A && (A.prototype.assertType = m), g && (g.prototype.parseAggregate = l);
              }
              o.contextOrFrameLookup = function(w, T, M) {
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
              function I(w) {
                return {
                  index: w.index,
                  lineno: w.lineno,
                  colno: w.colno
                };
              }
              if (c && A && g) {
                var d = c.Node.extend("Slice", {
                  fields: ["start", "stop", "step"],
                  init: function(w, T, M, x, _) {
                    M = M || new c.Literal(w, T, null), x = x || new c.Literal(w, T, null), _ = _ || new c.Literal(w, T, 1), this.parent(w, T, M, x, _);
                  }
                });
                A.prototype.assertType = function(w) {
                  w instanceof d || m.apply(this, arguments);
                }, A.prototype.compileSlice = function(w, T) {
                  this._emit("("), this._compileExpression(w.start, T), this._emit("),("), this._compileExpression(w.stop, T), this._emit("),("), this._compileExpression(w.step, T), this._emit(")");
                }, g.prototype.parseAggregate = function() {
                  var w = this, T = I(this.tokens);
                  T.colno--, T.index--;
                  try {
                    return l.apply(this);
                  } catch (j) {
                    var M = I(this.tokens), x = function() {
                      return a._assign(w.tokens, M), j;
                    };
                    a._assign(this.tokens, T), this.peeked = !1;
                    var _ = this.peekToken();
                    if (_.type !== u.TOKEN_LEFT_BRACKET)
                      throw x();
                    this.nextToken();
                    for (var S = new d(_.lineno, _.colno), L = !1, D = 0; D <= S.fields.length && !this.skip(u.TOKEN_RIGHT_BRACKET); D++) {
                      if (D === S.fields.length)
                        if (L)
                          this.fail("parseSlice: too many slice components", _.lineno, _.colno);
                        else
                          break;
                      if (this.skip(u.TOKEN_COLON))
                        L = !0;
                      else {
                        var F = S.fields[D];
                        S[F] = this.parseExpression(), L = this.skip(u.TOKEN_COLON) || L;
                      }
                    }
                    if (!L)
                      throw x();
                    return new c.Array(_.lineno, _.colno, [S]);
                  }
                };
              }
              function E(w, T, M, x) {
                w = w || [], T === null && (T = x < 0 ? w.length - 1 : 0), M === null ? M = x < 0 ? -1 : w.length : M < 0 && (M += w.length), T < 0 && (T += w.length);
                for (var _ = [], S = T; !(S < 0 || S > w.length || x > 0 && S >= M || x < 0 && S <= M); S += x)
                  _.push(o.memberLookup(w, S));
                return _;
              }
              function v(w, T) {
                return Object.prototype.hasOwnProperty.call(w, T);
              }
              var f = {
                pop: function(w) {
                  if (w === void 0)
                    return this.pop();
                  if (w >= this.length || w < 0)
                    throw new Error("KeyError");
                  return this.splice(w, 1);
                },
                append: function(w) {
                  return this.push(w);
                },
                remove: function(w) {
                  for (var T = 0; T < this.length; T++)
                    if (this[T] === w)
                      return this.splice(T, 1);
                  throw new Error("ValueError");
                },
                count: function(w) {
                  for (var T = 0, M = 0; M < this.length; M++)
                    this[M] === w && T++;
                  return T;
                },
                index: function(w) {
                  var T;
                  if ((T = this.indexOf(w)) === -1)
                    throw new Error("ValueError");
                  return T;
                },
                find: function(w) {
                  return this.indexOf(w);
                },
                insert: function(w, T) {
                  return this.splice(w, 0, T);
                }
              }, y = {
                items: function() {
                  return a._entries(this);
                },
                values: function() {
                  return a._values(this);
                },
                keys: function() {
                  return a.keys(this);
                },
                get: function(w, T) {
                  var M = this[w];
                  return M === void 0 && (M = T), M;
                },
                has_key: function(w) {
                  return v(this, w);
                },
                pop: function(w, T) {
                  var M = this[w];
                  if (M === void 0 && T !== void 0)
                    M = T;
                  else {
                    if (M === void 0)
                      throw new Error("KeyError");
                    delete this[w];
                  }
                  return M;
                },
                popitem: function() {
                  var w = a.keys(this);
                  if (!w.length)
                    throw new Error("KeyError");
                  var T = w[0], M = this[T];
                  return delete this[T], [T, M];
                },
                setdefault: function(w, T) {
                  return T === void 0 && (T = null), w in this || (this[w] = T), this[w];
                },
                update: function(w) {
                  return a._assign(this, w), null;
                }
              };
              return y.iteritems = y.items, y.itervalues = y.values, y.iterkeys = y.keys, o.memberLookup = function(w, T, M) {
                return arguments.length === 4 ? E.apply(this, arguments) : (w = w || {}, a.isArray(w) && v(f, T) ? f[T].bind(w) : a.isObject(w) && v(y, T) ? y[T].bind(w) : p.apply(this, arguments));
              }, h;
            }
            e.exports = s;
          })
          /******/
        ])
      );
    });
  })(Ys)), Ys.exports;
}
var jC = FC();
const GC = /* @__PURE__ */ BC(jC);
function zC(i) {
  const t = {};
  for (const [n, r] of Object.entries(i.templates))
    t[n] = GC.compile(r);
  const e = (n) => {
    n.result = {};
    for (const r of Object.keys(i.templates))
      n.result[r] = t[r].render(n.properties || {});
  };
  return "features" in i.geojson ? i.geojson.features.forEach(e) : e(i.geojson), i.geojson;
}
const XC = {
  templateExtractor: zC
}, UC = /\{%-?\s*(raw|verbatim)\s*-?%\}[\s\S]*?\{%-?\s*end\1\s*-?%\}/g, ZC = /<%[\s\S]*?%>/, WC = /\$\{[^}]*\}/, VC = 'MaplatApp: poiTemplate/iconTemplate written in the lodash.template syntax (<% %>, <%= %>, <%- %>, ${ }) is no longer evaluated since @maplat/core 1.3.0, and was ignored. Rewrite it in the Nunjucks syntax ({{ }}, {% %}); wrap literal "<%" or "${" in {% raw %}...{% endraw %}.', YC = 'See the "Removed" section of the 1.3.0 CHANGELOG: https://github.com/code4history/MaplatCore/blob/master/CHANGELOG.md';
let aA = !1, AA = !1;
function $g(i) {
  return Array.from(i).slice(0, 80).join("");
}
function HC(i) {
  const t = i.replace(UC, "");
  return ZC.test(t) || WC.test(t);
}
function QC(i, t) {
  aA || (aA = !0, console.warn(`${VC} First template found (${i}): "${$g(t)}". ${YC}`));
}
function Hs(i, t) {
  if (AA) return;
  AA = !0;
  const n = (t instanceof Error ? t.message : String(t)).split(`
`).map((r) => r.trim()).filter((r) => r).join(" ");
  console.warn(`MaplatApp: a poiTemplate/iconTemplate failed to render and was ignored: ${n}. First template: "${$g(i)}".`);
}
function tc(i, t, e) {
  if (HC(t)) {
    QC(i, t);
    return;
  }
  try {
    const n = { type: "Feature", geometry: null, properties: e };
    return XC.templateExtractor({ geojson: n, templates: { t } }), n.result.t;
  } catch (n) {
    Hs(t, n);
    return;
  }
}
function KC(i, t) {
  const e = tc("iconTemplate", i, t);
  if (e === void 0) return;
  let n;
  try {
    n = JSON.parse(e);
  } catch (r) {
    Hs(i, r);
    return;
  }
  if (n === null || typeof n != "object" || Array.isArray(n)) {
    Hs(i, new Error("iconTemplate did not produce a JSON object"));
    return;
  }
  return n;
}
function JC(i, ...t) {
  const e = xe(Object.assign({}, i));
  if (e.icon) return e;
  const n = t.reduce((r, s) => {
    if (r) return r;
    const o = s.iconTemplate, a = o ? KC(o, e) : void 0;
    if (a)
      return a;
    if (s.icon)
      return {
        icon: s.icon,
        selectedIcon: s.selectedIcon
      };
  }, void 0);
  return n && (e.icon = n.icon, e.selectedIcon = n.selectedIcon), e;
}
function qC(i, ...t) {
  const e = xe(i);
  return e.html ? e : t.reduce((n, r) => {
    if (n) return n;
    const s = r.poiTemplate;
    if (s) {
      const o = tc("poiTemplate", s, e);
      return o === void 0 ? void 0 : (e.html = o, e.poiStyle = e.poiStyle || r.poiStyle, e);
    }
  }, void 0) || e;
}
function gA(i, ...t) {
  const e = JC(i, ...t);
  return qC(e, ...t);
}
function ji(i, t) {
  const e = i.getViewport(), n = t.getViewport();
  if (!e || !n) return [0, 0];
  const r = e.getBoundingClientRect(), s = n.getBoundingClientRect();
  return [r.left - s.left, r.top - s.top];
}
class $C {
  #e;
  #s;
  #t;
  #o;
  #n;
  // 大きさの変化を見張れないとき（viewport か ResizeObserver が無い）は取っておかず毎回測る
  #r = !1;
  #i = () => {
    this.#t = void 0;
  };
  constructor(t, e) {
    this.#e = t, this.#s = e;
    const n = t.getViewport(), r = e.getViewport();
    !n || !r || typeof ResizeObserver > "u" || (this.#o = new ResizeObserver(this.#i), this.#o.observe(n), this.#o.observe(r), t.on?.("change:size", this.#i), e.on?.("change:size", this.#i), n.addEventListener("pointerenter", this.#i), this.#n = n, this.#r = !0);
  }
  /** 取っておいた値。捨てられていれば測り直す。 */
  get() {
    return this.#r ? (this.#t || (this.#t = ji(this.#e, this.#s)), this.#t) : ji(this.#e, this.#s);
  }
  /** いま測り直して、その値を取っておく。 */
  refresh() {
    const t = ji(this.#e, this.#s);
    return this.#r && (this.#t = t), t;
  }
  /** 取っておいた値を捨てる（次の get で測り直す）。 */
  invalidate() {
    this.#i();
  }
  dispose() {
    this.#r = !1, this.#o?.disconnect(), this.#o = void 0, this.#e.un?.("change:size", this.#i), this.#s.un?.("change:size", this.#i), this.#n?.removeEventListener("pointerenter", this.#i), this.#n = void 0, this.#t = void 0;
  }
}
const ec = "marker", tf = (i) => i.lnglat || [i.lng || i.longitude, i.lat || i.latitude];
async function rr(i, t) {
  const e = i.from;
  if (!e) return { kind: "skip" };
  const n = (o) => !!o && !!e.insideCheckSysCoord(o);
  if (t.coordinates) {
    const o = await e.merc2SysCoordAsync_ignoreBackground(t.coordinates);
    return n(o) ? { kind: "inside", xy: o } : { kind: "outside", merc: t.coordinates };
  }
  if (t.x && t.y) {
    const o = e.xy2SysCoord([t.x, t.y]);
    return n(o) ? { kind: "inside", xy: o } : { kind: "skip" };
  }
  const r = ne(tf(t), "EPSG:4326", "EPSG:3857"), s = await e.merc2SysCoordAsync_ignoreBackground(r);
  return n(s) ? { kind: "inside", xy: s } : { kind: "outside", merc: r };
}
async function ef(i, t) {
  const e = await rr(i, { coordinates: t });
  if (e.kind === "inside") return { map: i.mapObject, coord: e.xy };
  if (e.kind === "outside") {
    if (Or(i.from)) return { map: i.mapObject, coord: t };
    if (i.backMap) return { map: i.backMap, coord: t };
  }
}
function Is(i, t, e) {
  const n = i.from, r = i.mapObject, s = i.backMap;
  if (!n || !r || !s || Or(n)) return;
  const o = r.getCoordinateFromPixel(t);
  if (!o || n.insideCheckSysCoord(o)) return;
  const [a, A] = e ? e() : ji(r, s), g = s.getCoordinateFromPixel([t[0] + a, t[1] + A]);
  return { merc: g ? [g[0], g[1]] : void 0 };
}
function Or(i) {
  return typeof i?.isWmts == "function" ? i.isWmts() === !0 : !1;
}
function ic(i) {
  return i.__hideOutsidePois || !i.from ? "none" : Or(i.from) ? "front" : i.backMap ? "back" : "none";
}
function nf(i, t, e) {
  const n = ic(i), r = [], s = [];
  return t.forEach((o, a) => {
    const A = e[a];
    A.kind === "inside" ? r.push({ ...o, xy: A.xy }) : A.kind === "outside" && n === "back" ? s.push({ ...o, merc: A.merc }) : A.kind === "outside" && n === "front" && r.push({ ...o, xy: A.merc });
  }), { front: r, back: s };
}
function cA(i) {
  return i?.getSource ? i.getSource(ec) : void 0;
}
const lA = (i) => {
  const t = i.xy || i.merc, e = new GA({
    geometry: new Wi(t),
    datum: i.data
  }), n = Fg(i.icon);
  return n && e.setStyle(n), e;
};
function uA(i, t) {
  const e = cA(i.mapObject);
  if (!e) return;
  const n = i.backMap ? cA(i.backMap) : void 0;
  e.clear(), n && n.clear(), t.front.length > 0 && e.addFeatures(t.front.map(lA)), n && t.back.length > 0 && n.addFeatures(t.back.map(lA));
}
function rf(i, t, e, n) {
  if (n.kind === "skip") return;
  const s = n.kind === "outside" && ic(i) === "back" ? i.backMap : i.mapObject;
  if (!s?.setMarker) return;
  const o = n.kind === "inside" ? n.xy : n.merc;
  s.setMarker(o, { datum: t }, e);
}
function sf(i, t) {
  const e = i.from;
  return e?.insideCheckSysCoord ? !e.insideCheckSysCoord(t) : !1;
}
function hA(i, t) {
  const e = i.backMap;
  if (!e?.forEachFeatureAtPixel) return [];
  if (!sf(i, t.coordinate)) return [];
  const n = e.getLayer ? e.getLayer(ec) : void 0, r = [];
  return e.forEachFeatureAtPixel(
    t.pixel,
    (s) => {
      const o = s?.get ? s.get("datum") : void 0;
      o && r.push(o);
    },
    n ? { layerFilter: (s) => s === n } : void 0
  ), r;
}
function Qs(i, t) {
  if (!i.from || !t || i.__outsideSelection || i.__pendingView) return;
  const e = i.from, n = t.getCenter();
  if (n && !e.insideCheckSysCoord(n)) {
    const r = e.modulateSysCoordInside(n);
    r && t.setCenter(r);
  }
}
const of = (i) => {
  const t = ne(i, "EPSG:3857", "EPSG:4326");
  return { longitude: t[0], latitude: t[1] };
};
function nc(i, t) {
  !i.from || !i.mapObject || (Or(i.from) ? i.mapObject.getView().setCenter(t) : i.setViewpoint && i.setViewpoint(of(t)));
}
function Cs(i, t, e) {
  const n = i.__outsideSelection;
  if (!n) return;
  const r = e?.recenter ?? !!n.pending;
  if (!t || t.kind === "skip") {
    delete i.__outsideSelection, delete i.__selectedMarker;
    const s = i.mapObject?.getView?.();
    s && Qs(i, s);
    return;
  }
  if (t.kind === "inside") {
    delete i.__outsideSelection;
    const s = i.getMarker ? i.getMarker(n.id) : void 0;
    r && s && i.setViewpoint && i.setViewpoint({
      latitude: s.lnglat ? s.lnglat[1] : s.lat ?? s.latitude,
      longitude: s.lnglat ? s.lnglat[0] : s.lng ?? s.longitude
    });
    return;
  }
  i.__outsideSelection = { id: n.id, merc: t.merc }, r && nc(i, t.merc);
}
const Lt = {
  ACCURACY: "accuracy",
  ALTITUDE: "altitude",
  ALTITUDE_ACCURACY: "altitudeAccuracy",
  HEADING: "heading",
  POSITION: "position",
  SPEED: "speed",
  TRACKING: "tracking",
  TRACKING_OPTIONS: "trackingOptions"
}, af = {
  ERROR: "error"
};
class Af extends Me {
  code;
  message;
  constructor(t) {
    super(af.ERROR), this.code = t.code, this.message = t.message;
  }
}
class gf extends hi {
  task_id_;
  timer_base_ = !1;
  home_position_ = !1;
  constructor(t) {
    super(), t = t || {}, this.timer_base_ = t.timerBase !== void 0 ? t.timerBase : !1, this.task_id_ = void 0, this.home_position_ = t.homePosition !== void 0 ? t.homePosition : !1, this.addChangeListener(Lt.TRACKING, this.handleTrackingChanged_), t.trackingOptions !== void 0 ? this.setTrackingOptions(t.trackingOptions) : this.setTrackingOptions({
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
      longitude: hs(this.home_position_[0], 0.05),
      latitude: hs(this.home_position_[1], 0.05),
      accuracy: hs(15, 10)
    };
    this.positionChange_({ coords: t });
  }
  positionChange_(t) {
    const e = t.coords;
    this.set(Lt.ACCURACY, e.accuracy), this.set(
      Lt.ALTITUDE,
      e.altitude === null ? void 0 : e.altitude
    ), this.set(
      Lt.ALTITUDE_ACCURACY,
      e.altitudeAccuracy === null ? void 0 : e.altitudeAccuracy
    ), this.set(
      Lt.HEADING,
      e.heading === null ? void 0 : De(e.heading)
    ), this.set(Lt.POSITION, [e.longitude, e.latitude]), this.set(Lt.SPEED, e.speed === null ? void 0 : e.speed), this.changed();
  }
  timerPositionError_() {
    const t = Math.floor(Math.random() * 3) + 1, e = {
      code: t,
      message: t === 1 ? "User denied Geolocation" : t === 2 ? "Position unavailable" : "Timeout expired"
    };
    this.positionError_(e);
  }
  positionError_(t) {
    const e = new Af(t);
    this.dispatchEvent(e);
  }
  getAccuracy() {
    return this.get(Lt.ACCURACY);
  }
  getAltitude() {
    return this.get(Lt.ALTITUDE);
  }
  getAltitudeAccuracy() {
    return this.get(Lt.ALTITUDE_ACCURACY);
  }
  getHeading() {
    return this.get(Lt.HEADING);
  }
  getPosition() {
    return this.get(Lt.POSITION);
  }
  getSpeed() {
    return this.get(Lt.SPEED);
  }
  getTracking() {
    return this.get(Lt.TRACKING);
  }
  getTrackingOptions() {
    return this.get(Lt.TRACKING_OPTIONS);
  }
  setTracking(t) {
    this.set(Lt.TRACKING, t);
  }
  setTrackingOptions(t) {
    this.set(Lt.TRACKING_OPTIONS, t);
  }
}
const cf = () => {
  const i = window.navigator.userAgent.toLowerCase();
  try {
    let t;
    return i.indexOf("chrome") != -1 ? (t = (navigator.languages[0] || navigator.browserLanguage || navigator.language || navigator.userLanguage).split(";"), t[0]) : (t = (navigator.browserLanguage || navigator.language || navigator.userLanguage).split(";"), t[0]);
  } catch {
    return "";
  }
}, lf = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="105px" height="22px" viewBox="0 0 105 22" enable-background="new 0 0 105 22" xml:space="preserve"><g><g opacity="0.8"><path fill="#FFFFFF" d="M59.77,11.44l-0.93-2.32c-0.16-0.4-0.36-0.81-0.61-1.22c-0.26-0.42-0.6-0.85-1.01-1.27 c-0.49-0.5-1.1-0.9-1.8-1.2c-0.71-0.3-1.49-0.46-2.3-0.46c-1.16,0-2.25,0.3-3.19,0.87V0.48h-5.98v4.77H42 c-0.54-0.18-1.12-0.27-1.72-0.27c-1.68,0-3.21,0.66-4.44,1.92c-0.09,0.09-0.18,0.19-0.26,0.29c-0.1-0.12-0.21-0.24-0.33-0.35 c-1.26-1.23-2.81-1.86-4.6-1.86c-1.77,0-3.36,0.64-4.6,1.86c-0.11,0.11-0.22,0.22-0.32,0.34c-0.1-0.12-0.21-0.23-0.32-0.34 c-1.26-1.23-2.81-1.86-4.6-1.86c-1.55,0-2.91,0.46-4.06,1.38h-2.47l2.46-2.46l-1.48-1.41C13.53,0.83,11.46,0,9.08,0 C6.62,0,4.47,0.88,2.7,2.62C0.91,4.38,0,6.51,0,8.98s0.91,4.61,2.7,6.36c1.78,1.74,3.93,2.62,6.39,2.62 c2.56,0,4.68-0.87,6.28-2.54c0.04-0.04,0.08-0.08,0.12-0.13c0.21,0.29,0.44,0.56,0.7,0.81c1.24,1.22,2.83,1.86,4.6,1.86 c1.8,0,3.34-0.62,4.6-1.86c0.11-0.11,0.22-0.22,0.32-0.34c0.1,0.12,0.21,0.23,0.32,0.34c1.24,1.22,2.83,1.86,4.6,1.86 c1.26,0,2.4-0.31,3.4-0.92l0.45,1.07c0.43,1.02,1.13,1.91,2.08,2.66c1.04,0.81,2.3,1.23,3.75,1.23c1.78,0,3.29-0.58,4.47-1.73 c0.71-0.69,1.21-1.55,1.5-2.58h3.64v-0.67c1,0.62,2.16,0.94,3.42,0.94c1.3,0,2.44-0.32,3.39-0.94c0.85-0.55,1.53-1.21,2.02-1.94 l1.11-1.66l-1.87-1.25L59.77,11.44z"/><path fill="#FFFFFF" d="M105,10.11l-0.74-1.84c-0.42-1.05-1.13-1.86-2.1-2.43c-0.89-0.51-1.89-0.77-2.98-0.77 c-1.31,0-2.48,0.35-3.48,1.05c-0.24,0.17-0.45,0.36-0.65,0.56c-1.11-1.05-2.46-1.61-3.95-1.61c-0.63,0-1.22,0.09-1.78,0.27h-4.63 v0.6c-0.93-0.58-2-0.87-3.21-0.87c-1.26,0-2.34,0.31-3.22,0.9V1.5h-4.73l-3.11,5.45l-3.1-5.45H62.6v16.19h5.57V15.1h0.65h3.24 h0.65v2.59h5.57v-0.37c0.77,0.42,1.65,0.64,2.62,0.64c0.64,0,1.23-0.09,1.78-0.27h2.03v3.68h5.57v-3.46 c0.27,0.04,0.56,0.06,0.84,0.06c1.5,0,2.87-0.57,3.98-1.64c0.2,0.2,0.42,0.39,0.65,0.56c0.96,0.72,2.14,1.08,3.51,1.08 c1.43,0,2.65-0.4,3.63-1.2c1.08-0.88,1.66-2.07,1.66-3.42c0-0.97-0.32-1.89-0.93-2.66L105,10.11z"/></g><g><g><path fill="#474747" d="M9.08,8.35v1.9h4.58c-0.14,1.04-0.48,1.84-1.04,2.4c-0.94,0.93-2.11,1.4-3.53,1.4 c-1.4,0-2.58-0.49-3.55-1.48c-0.97-0.98-1.46-2.18-1.46-3.59c0-1.41,0.48-2.6,1.45-3.59C6.5,4.4,7.68,3.91,9.08,3.91 c1.33,0,2.47,0.45,3.44,1.36l1.35-1.35C12.53,2.64,10.93,2,9.08,2C7.15,2,5.49,2.68,4.09,4.05C2.7,5.42,2,7.06,2,8.98 c0,1.92,0.7,3.56,2.09,4.93c1.4,1.37,3.06,2.05,4.99,2.05c2,0,3.63-0.65,4.87-1.96c1.1-1.1,1.65-2.59,1.65-4.46 c0-0.45-0.03-0.85-0.1-1.19H9.08z"/><path fill="#474747" d="M42.72,7.97h-0.07c-0.24-0.29-0.57-0.53-0.98-0.72c-0.42-0.19-0.88-0.29-1.39-0.29 c-1.14,0-2.15,0.44-3.01,1.32c-0.86,0.88-1.29,1.94-1.29,3.19c0,1.24,0.43,2.3,1.29,3.17c0.86,0.87,1.86,1.31,3.01,1.31 c1.02,0,1.81-0.34,2.37-1.02h0.07v0.65c0,0.85-0.21,1.51-0.64,1.96c-0.42,0.45-1.01,0.68-1.76,0.68c-0.55,0-1.02-0.16-1.41-0.48 c-0.38-0.31-0.67-0.69-0.85-1.12l-1.72,0.72c0.29,0.71,0.78,1.33,1.46,1.86c0.68,0.53,1.52,0.8,2.52,0.8 c1.25,0,2.27-0.39,3.07-1.17c0.8-0.78,1.2-1.95,1.2-3.52V7.24h-1.87V7.97z M42.16,13.42c-0.46,0.51-1.03,0.77-1.71,0.77 c-0.69,0-1.28-0.26-1.77-0.78c-0.49-0.51-0.73-1.16-0.73-1.93c0-0.78,0.24-1.44,0.73-1.96c0.49-0.52,1.08-0.78,1.77-0.78 c0.68,0,1.25,0.26,1.71,0.79c0.46,0.52,0.69,1.18,0.69,1.96C42.85,12.26,42.62,12.9,42.16,13.42z"/><path fill="#474747" d="M20.8,6.97c-1.26,0-2.33,0.43-3.2,1.29s-1.31,1.93-1.31,3.21c0,1.28,0.44,2.35,1.31,3.21 s1.94,1.29,3.2,1.29s2.33-0.43,3.2-1.29c0.88-0.86,1.31-1.93,1.31-3.21c0-1.28-0.44-2.35-1.31-3.21S22.06,6.97,20.8,6.97z M22.59,13.42c-0.5,0.51-1.1,0.77-1.79,0.77s-1.29-0.25-1.79-0.77c-0.5-0.52-0.75-1.17-0.75-1.95c0-0.8,0.25-1.45,0.74-1.96 c0.5-0.51,1.1-0.77,1.8-0.77S22.1,9,22.6,9.51c0.49,0.51,0.74,1.17,0.74,1.96C23.34,12.25,23.09,12.9,22.59,13.42z"/><rect x="45.95" y="2.48" fill="#474747" width="1.98" height="13.21"/><path fill="#474747" d="M53.34,14.2c-0.99,0-1.71-0.45-2.18-1.36l6.01-2.49l-0.2-0.51c-0.11-0.3-0.26-0.59-0.44-0.89 c-0.18-0.29-0.42-0.6-0.73-0.91c-0.31-0.32-0.69-0.57-1.16-0.77c-0.47-0.2-0.97-0.3-1.52-0.3c-1.19,0-2.19,0.42-3.01,1.26 c-0.82,0.84-1.23,1.92-1.23,3.24c0,1.27,0.43,2.34,1.28,3.2c0.85,0.86,1.91,1.29,3.18,1.29c0.91,0,1.68-0.2,2.29-0.6 c0.63-0.41,1.11-0.87,1.45-1.38l-1.53-1.02C54.99,13.79,54.25,14.2,53.34,14.2z M51.56,9.43c0.51-0.48,1.05-0.72,1.63-0.72 c0.39,0,0.73,0.08,1.04,0.26c0.31,0.18,0.52,0.41,0.63,0.69l-4.02,1.67C50.82,10.54,51.06,9.9,51.56,9.43z"/><path fill="#474747" d="M30.65,6.97c-1.26,0-2.33,0.43-3.2,1.29s-1.31,1.93-1.31,3.21c0,1.28,0.44,2.35,1.31,3.21 s1.94,1.29,3.2,1.29c1.26,0,2.33-0.43,3.2-1.29c0.87-0.86,1.31-1.93,1.31-3.21c0-1.28-0.44-2.35-1.31-3.21S31.91,6.97,30.65,6.97 z M32.44,13.42c-0.5,0.51-1.1,0.77-1.79,0.77s-1.29-0.25-1.79-0.77c-0.5-0.52-0.75-1.17-0.75-1.95c0-0.8,0.25-1.45,0.74-1.96 c0.5-0.51,1.1-0.77,1.8-0.77c0.71,0,1.31,0.26,1.8,0.77s0.74,1.17,0.74,1.96C33.19,12.25,32.94,12.9,32.44,13.42z"/></g><g><polygon fill="#474747" points="70.48,10.92 70.41,10.92 66.17,3.5 64.6,3.5 64.6,15.69 66.17,15.69 66.17,8.45 66.1,6.41 66.17,6.41 69.98,13.1 70.9,13.1 74.72,6.41 74.79,6.41 74.72,8.45 74.72,15.69 76.29,15.69 76.29,3.5 74.72,3.5 "/><path fill="#474747" d="M81.5,7.07c-0.93,0-1.68,0.21-2.25,0.64S78.3,8.6,78.11,9.1l1.44,0.61c0.14-0.38,0.39-0.67,0.76-0.89 c0.36-0.21,0.78-0.32,1.23-0.32c0.61,0,1.13,0.18,1.55,0.55c0.42,0.37,0.63,0.86,0.63,1.47v0.24c-0.59-0.34-1.34-0.51-2.26-0.51 c-1.04,0-1.91,0.25-2.61,0.77c-0.71,0.52-1.06,1.23-1.06,2.14c0,0.84,0.29,1.52,0.89,2.03c0.59,0.51,1.33,0.77,2.22,0.77 c1.21,0,2.12-0.47,2.75-1.43h0.07v1.16h1.5v-5.04c0-1.14-0.36-2.02-1.06-2.64C83.45,7.38,82.57,7.07,81.5,7.07z M82.92,13.81 c-0.53,0.48-1.11,0.72-1.76,0.72c-0.46,0-0.86-0.12-1.21-0.35c-0.35-0.24-0.53-0.56-0.53-0.97c0-0.44,0.19-0.83,0.58-1.16 s0.96-0.49,1.72-0.49c0.88,0,1.55,0.18,1.99,0.54C83.71,12.76,83.45,13.33,82.92,13.81z"/><path fill="#474747" d="M91.12,7.08c-0.63,0-1.2,0.14-1.71,0.41c-0.5,0.27-0.88,0.61-1.13,1.02h-0.07V7.35h-1.5v12.02h1.57v-3.68 l-0.07-1.16h0.07c0.25,0.41,0.62,0.75,1.13,1.02c0.5,0.27,1.07,0.41,1.71,0.41c1.08,0,2.01-0.42,2.79-1.26 c0.79-0.85,1.18-1.91,1.18-3.17c0-1.26-0.4-2.32-1.18-3.17C93.13,7.51,92.2,7.08,91.12,7.08z M92.73,13.7 c-0.52,0.55-1.14,0.83-1.87,0.83c-0.73,0-1.36-0.27-1.88-0.82c-0.51-0.55-0.77-1.28-0.77-2.2s0.25-1.66,0.77-2.2 c0.51-0.55,1.14-0.82,1.88-0.82c0.72,0,1.35,0.28,1.87,0.83c0.52,0.55,0.78,1.28,0.78,2.19C93.51,12.42,93.25,13.15,92.73,13.7z" /><path fill="#474747" d="M101.96,11.84c-0.38-0.45-0.96-0.76-1.74-0.94l-1.65-0.39c-0.74-0.17-1.11-0.49-1.11-0.97 c0-0.33,0.16-0.59,0.48-0.78s0.71-0.29,1.18-0.29c0.97,0,1.6,0.37,1.91,1.11l1.36-0.56c-0.25-0.63-0.66-1.1-1.24-1.44 c-0.58-0.33-1.24-0.5-1.98-0.5c-0.89,0-1.67,0.23-2.32,0.69c-0.65,0.46-0.98,1.06-0.98,1.8c0,0.65,0.24,1.16,0.72,1.54 s0.99,0.63,1.52,0.77l1.69,0.41c0.76,0.2,1.14,0.57,1.14,1.11c0,0.35-0.16,0.63-0.47,0.85c-0.31,0.21-0.71,0.32-1.2,0.32 c-1.06,0-1.82-0.53-2.26-1.57l-1.4,0.58c0.29,0.68,0.73,1.25,1.34,1.7c0.61,0.45,1.38,0.68,2.31,0.68c0.96,0,1.75-0.25,2.34-0.75 c0.61-0.5,0.92-1.12,0.92-1.87C102.52,12.78,102.33,12.28,101.96,11.84z"/></g></g></g></svg>', uf = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="105px" height="22px" viewBox="0 0 105 22" enable-background="new 0 0 105 22" xml:space="preserve"><g><g opacity="0.8"><path fill="#1E1E1E" d="M59.77,11.44l-0.93-2.32c-0.16-0.4-0.36-0.81-0.61-1.22c-0.26-0.42-0.6-0.85-1.01-1.27 c-0.49-0.5-1.1-0.9-1.8-1.2c-0.71-0.3-1.49-0.46-2.3-0.46c-1.16,0-2.25,0.3-3.19,0.87V0.48h-5.98v4.77H42 c-0.54-0.18-1.12-0.27-1.72-0.27c-1.68,0-3.21,0.66-4.44,1.92c-0.09,0.09-0.18,0.19-0.26,0.29c-0.1-0.12-0.21-0.24-0.33-0.35 c-1.26-1.23-2.81-1.86-4.6-1.86c-1.77,0-3.36,0.64-4.6,1.86c-0.11,0.11-0.22,0.22-0.32,0.34c-0.1-0.12-0.21-0.23-0.32-0.34 c-1.26-1.23-2.81-1.86-4.6-1.86c-1.55,0-2.91,0.46-4.06,1.38h-2.47l2.46-2.46l-1.48-1.41C13.53,0.83,11.46,0,9.08,0 C6.62,0,4.47,0.88,2.7,2.62C0.91,4.38,0,6.51,0,8.98s0.91,4.61,2.7,6.36c1.78,1.74,3.93,2.62,6.39,2.62 c2.56,0,4.68-0.87,6.28-2.54c0.04-0.04,0.08-0.08,0.12-0.13c0.21,0.29,0.44,0.56,0.7,0.81c1.24,1.22,2.83,1.86,4.6,1.86 c1.8,0,3.34-0.62,4.6-1.86c0.11-0.11,0.22-0.22,0.32-0.34c0.1,0.12,0.21,0.23,0.32,0.34c1.24,1.22,2.83,1.86,4.6,1.86 c1.26,0,2.4-0.31,3.4-0.92l0.45,1.07c0.43,1.02,1.13,1.91,2.08,2.66c1.04,0.81,2.3,1.23,3.75,1.23c1.78,0,3.29-0.58,4.47-1.73 c0.71-0.69,1.21-1.55,1.5-2.58h3.64v-0.67c1,0.62,2.16,0.94,3.42,0.94c1.3,0,2.44-0.32,3.39-0.94c0.85-0.55,1.53-1.21,2.02-1.94 l1.11-1.66l-1.87-1.25L59.77,11.44z"/><path fill="#1E1E1E" d="M105,10.11l-0.74-1.84c-0.42-1.05-1.13-1.86-2.1-2.43c-0.89-0.51-1.89-0.77-2.98-0.77 c-1.31,0-2.48,0.35-3.48,1.05c-0.24,0.17-0.45,0.36-0.65,0.56c-1.11-1.05-2.46-1.61-3.95-1.61c-0.63,0-1.22,0.09-1.78,0.27h-4.63 v0.6c-0.93-0.58-2-0.87-3.21-0.87c-1.26,0-2.34,0.31-3.22,0.9V1.5h-4.73l-3.11,5.45l-3.1-5.45H62.6v16.19h5.57V15.1h0.65h3.24 h0.65v2.59h5.57v-0.37c0.77,0.42,1.65,0.64,2.62,0.64c0.64,0,1.23-0.09,1.78-0.27h2.03v3.68h5.57v-3.46 c0.27,0.04,0.56,0.06,0.84,0.06c1.5,0,2.87-0.57,3.98-1.64c0.2,0.2,0.42,0.39,0.65,0.56c0.96,0.72,2.14,1.08,3.51,1.08 c1.43,0,2.65-0.4,3.63-1.2c1.08-0.88,1.66-2.07,1.66-3.42c0-0.97-0.32-1.89-0.93-2.66L105,10.11z"/></g><g><g><path fill="#FFFFFF" d="M9.08,8.35v1.9h4.58c-0.14,1.04-0.48,1.84-1.04,2.4c-0.94,0.93-2.11,1.4-3.53,1.4 c-1.4,0-2.58-0.49-3.55-1.48c-0.97-0.98-1.46-2.18-1.46-3.59c0-1.41,0.48-2.6,1.45-3.59C6.5,4.4,7.68,3.91,9.08,3.91 c1.33,0,2.47,0.45,3.44,1.36l1.35-1.35C12.53,2.64,10.93,2,9.08,2C7.15,2,5.49,2.68,4.09,4.05C2.7,5.42,2,7.06,2,8.98 c0,1.92,0.7,3.56,2.09,4.93c1.4,1.37,3.06,2.05,4.99,2.05c2,0,3.63-0.65,4.87-1.96c1.1-1.1,1.65-2.59,1.65-4.46 c0-0.45-0.03-0.85-0.1-1.19H9.08z"/><path fill="#FFFFFF" d="M42.72,7.97h-0.07c-0.24-0.29-0.57-0.53-0.98-0.72c-0.42-0.19-0.88-0.29-1.39-0.29 c-1.14,0-2.15,0.44-3.01,1.32c-0.86,0.88-1.29,1.94-1.29,3.19c0,1.24,0.43,2.3,1.29,3.17c0.86,0.87,1.86,1.31,3.01,1.31 c1.02,0,1.81-0.34,2.37-1.02h0.07v0.65c0,0.85-0.21,1.51-0.64,1.96c-0.42,0.45-1.01,0.68-1.76,0.68c-0.55,0-1.02-0.16-1.41-0.48 c-0.38-0.31-0.67-0.69-0.85-1.12l-1.72,0.72c0.29,0.71,0.78,1.33,1.46,1.86c0.68,0.53,1.52,0.8,2.52,0.8 c1.25,0,2.27-0.39,3.07-1.17c0.8-0.78,1.2-1.95,1.2-3.52V7.24h-1.87V7.97z M42.16,13.42c-0.46,0.51-1.03,0.77-1.71,0.77 c-0.69,0-1.28-0.26-1.77-0.78c-0.49-0.51-0.73-1.16-0.73-1.93c0-0.78,0.24-1.44,0.73-1.96c0.49-0.52,1.08-0.78,1.77-0.78 c0.68,0,1.25,0.26,1.71,0.79c0.46,0.52,0.69,1.18,0.69,1.96C42.85,12.26,42.62,12.9,42.16,13.42z"/><path fill="#FFFFFF" d="M20.8,6.97c-1.26,0-2.33,0.43-3.2,1.29s-1.31,1.93-1.31,3.21c0,1.28,0.44,2.35,1.31,3.21 s1.94,1.29,3.2,1.29s2.33-0.43,3.2-1.29c0.88-0.86,1.31-1.93,1.31-3.21c0-1.28-0.44-2.35-1.31-3.21S22.06,6.97,20.8,6.97z M22.59,13.42c-0.5,0.51-1.1,0.77-1.79,0.77s-1.29-0.25-1.79-0.77c-0.5-0.52-0.75-1.17-0.75-1.95c0-0.8,0.25-1.45,0.74-1.96 c0.5-0.51,1.1-0.77,1.8-0.77S22.1,9,22.6,9.51c0.49,0.51,0.74,1.17,0.74,1.96C23.34,12.25,23.09,12.9,22.59,13.42z"/><rect x="45.95" y="2.48" fill="#FFFFFF" width="1.98" height="13.21"/><path fill="#FFFFFF" d="M53.34,14.2c-0.99,0-1.71-0.45-2.18-1.36l6.01-2.49l-0.2-0.51c-0.11-0.3-0.26-0.59-0.44-0.89 c-0.18-0.29-0.42-0.6-0.73-0.91c-0.31-0.32-0.69-0.57-1.16-0.77c-0.47-0.2-0.97-0.3-1.52-0.3c-1.19,0-2.19,0.42-3.01,1.26 c-0.82,0.84-1.23,1.92-1.23,3.24c0,1.27,0.43,2.34,1.28,3.2c0.85,0.86,1.91,1.29,3.18,1.29c0.91,0,1.68-0.2,2.29-0.6 c0.63-0.41,1.11-0.87,1.45-1.38l-1.53-1.02C54.99,13.79,54.25,14.2,53.34,14.2z M51.56,9.43c0.51-0.48,1.05-0.72,1.63-0.72 c0.39,0,0.73,0.08,1.04,0.26c0.31,0.18,0.52,0.41,0.63,0.69l-4.02,1.67C50.82,10.54,51.06,9.9,51.56,9.43z"/><path fill="#FFFFFF" d="M30.65,6.97c-1.26,0-2.33,0.43-3.2,1.29s-1.31,1.93-1.31,3.21c0,1.28,0.44,2.35,1.31,3.21 s1.94,1.29,3.2,1.29c1.26,0,2.33-0.43,3.2-1.29c0.87-0.86,1.31-1.93,1.31-3.21c0-1.28-0.44-2.35-1.31-3.21S31.91,6.97,30.65,6.97 z M32.44,13.42c-0.5,0.51-1.1,0.77-1.79,0.77s-1.29-0.25-1.79-0.77c-0.5-0.52-0.75-1.17-0.75-1.95c0-0.8,0.25-1.45,0.74-1.96 c0.5-0.51,1.1-0.77,1.8-0.77c0.71,0,1.31,0.26,1.8,0.77s0.74,1.17,0.74,1.96C33.19,12.25,32.94,12.9,32.44,13.42z"/></g><g><polygon fill="#FFFFFF" points="70.48,10.92 70.41,10.92 66.17,3.5 64.6,3.5 64.6,15.69 66.17,15.69 66.17,8.45 66.1,6.41 66.17,6.41 69.98,13.1 70.9,13.1 74.72,6.41 74.79,6.41 74.72,8.45 74.72,15.69 76.29,15.69 76.29,3.5 74.72,3.5 "/><path fill="#FFFFFF" d="M81.5,7.07c-0.93,0-1.68,0.21-2.25,0.64S78.3,8.6,78.11,9.1l1.44,0.61c0.14-0.38,0.39-0.67,0.76-0.89 c0.36-0.21,0.78-0.32,1.23-0.32c0.61,0,1.13,0.18,1.55,0.55c0.42,0.37,0.63,0.86,0.63,1.47v0.24c-0.59-0.34-1.34-0.51-2.26-0.51 c-1.04,0-1.91,0.25-2.61,0.77c-0.71,0.52-1.06,1.23-1.06,2.14c0,0.84,0.29,1.52,0.89,2.03c0.59,0.51,1.33,0.77,2.22,0.77 c1.21,0,2.12-0.47,2.75-1.43h0.07v1.16h1.5v-5.04c0-1.14-0.36-2.02-1.06-2.64C83.45,7.38,82.57,7.07,81.5,7.07z M82.92,13.81 c-0.53,0.48-1.11,0.72-1.76,0.72c-0.46,0-0.86-0.12-1.21-0.35c-0.35-0.24-0.53-0.56-0.53-0.97c0-0.44,0.19-0.83,0.58-1.16 s0.96-0.49,1.72-0.49c0.88,0,1.55,0.18,1.99,0.54C83.71,12.76,83.45,13.33,82.92,13.81z"/><path fill="#FFFFFF" d="M91.12,7.08c-0.63,0-1.2,0.14-1.71,0.41c-0.5,0.27-0.88,0.61-1.13,1.02h-0.07V7.35h-1.5v12.02h1.57v-3.68 l-0.07-1.16h0.07c0.25,0.41,0.62,0.75,1.13,1.02c0.5,0.27,1.07,0.41,1.71,0.41c1.08,0,2.01-0.42,2.79-1.26 c0.79-0.85,1.18-1.91,1.18-3.17c0-1.26-0.4-2.32-1.18-3.17C93.13,7.51,92.2,7.08,91.12,7.08z M92.73,13.7 c-0.52,0.55-1.14,0.83-1.87,0.83c-0.73,0-1.36-0.27-1.88-0.82c-0.51-0.55-0.77-1.28-0.77-2.2s0.25-1.66,0.77-2.2 c0.51-0.55,1.14-0.82,1.88-0.82c0.72,0,1.35,0.28,1.87,0.83c0.52,0.55,0.78,1.28,0.78,2.19C93.51,12.42,93.25,13.15,92.73,13.7z" /><path fill="#FFFFFF" d="M101.96,11.84c-0.38-0.45-0.96-0.76-1.74-0.94l-1.65-0.39c-0.74-0.17-1.11-0.49-1.11-0.97 c0-0.33,0.16-0.59,0.48-0.78s0.71-0.29,1.18-0.29c0.97,0,1.6,0.37,1.91,1.11l1.36-0.56c-0.25-0.63-0.66-1.1-1.24-1.44 c-0.58-0.33-1.24-0.5-1.98-0.5c-0.89,0-1.67,0.23-2.32,0.69c-0.65,0.46-0.98,1.06-0.98,1.8c0,0.65,0.24,1.16,0.72,1.54 s0.99,0.63,1.52,0.77l1.69,0.41c0.76,0.2,1.14,0.57,1.14,1.11c0,0.35-0.16,0.63-0.47,0.85c-0.31,0.21-0.71,0.32-1.2,0.32 c-1.06,0-1.82-0.53-2.26-1.57l-1.4,0.58c0.29,0.68,0.73,1.25,1.34,1.7c0.61,0.45,1.38,0.68,2.31,0.68c0.96,0,1.75-0.25,2.34-0.75 c0.61-0.5,0.92-1.12,0.92-1.87C102.52,12.78,102.33,12.28,101.96,11.84z"/></g></g></g></svg>';
function hf(i, t, e, n) {
  const r = document.createElement("script"), s = "olc_" + Ai(t);
  function o() {
    delete /** @type {Record<string, unknown>} */
    /** @type {unknown} */
    window[s];
    const A = r.parentNode;
    A && A.removeChild(r);
  }
  r.async = !0, r.src = i + (i.includes("?") ? "&" : "?") + "callback=" + s;
  const a = setTimeout(function() {
    o(), e && e();
  }, 1e4);
  window[s] = function(A) {
    clearTimeout(a), o(), t(A);
  }, document.head.appendChild(r);
}
class rc {
  /**
   * @param {number} minX Minimum X.
   * @param {number} maxX Maximum X.
   * @param {number} minY Minimum Y.
   * @param {number} maxY Maximum Y.
   */
  constructor(t, e, n, r) {
    this.minX = t, this.maxX = e, this.minY = n, this.maxY = r;
  }
  /**
   * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @return {boolean} Contains tile coordinate.
   */
  contains(t) {
    return this.containsXY(t[1], t[2]);
  }
  /**
   * @param {TileRange} tileRange Tile range.
   * @return {boolean} Contains.
   */
  containsTileRange(t) {
    return this.minX <= t.minX && t.maxX <= this.maxX && this.minY <= t.minY && t.maxY <= this.maxY;
  }
  /**
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @return {boolean} Contains coordinate.
   */
  containsXY(t, e) {
    return this.minX <= t && t <= this.maxX && this.minY <= e && e <= this.maxY;
  }
  /**
   * @param {TileRange} tileRange Tile range.
   * @return {boolean} Equals.
   */
  equals(t) {
    return this.minX == t.minX && this.minY == t.minY && this.maxX == t.maxX && this.maxY == t.maxY;
  }
  /**
   * @param {TileRange} tileRange Tile range.
   */
  extend(t) {
    t.minX < this.minX && (this.minX = t.minX), t.maxX > this.maxX && (this.maxX = t.maxX), t.minY < this.minY && (this.minY = t.minY), t.maxY > this.maxY && (this.maxY = t.maxY);
  }
  /**
   * @return {number} Height.
   */
  getHeight() {
    return this.maxY - this.minY + 1;
  }
  /**
   * @return {import("./size.js").Size} Size.
   */
  getSize() {
    return [this.getWidth(), this.getHeight()];
  }
  /**
   * @return {number} Width.
   */
  getWidth() {
    return this.maxX - this.minX + 1;
  }
  /**
   * @param {TileRange} tileRange Tile range.
   * @return {boolean} Intersects.
   */
  intersects(t) {
    return this.minX <= t.maxX && this.maxX >= t.minX && this.minY <= t.maxY && this.maxY >= t.minY;
  }
}
function _i(i, t, e, n, r) {
  return r !== void 0 ? (r.minX = i, r.maxX = t, r.minY = e, r.maxY = n, r) : new rc(i, t, e, n);
}
const Si = [0, 0, 0], Ze = 5;
class sc {
  /**
   * @param {Options} options Tile grid options.
   */
  constructor(t) {
    let e = t.minZoom;
    const n = t.resolutions;
    e === void 0 && n && (e = n.findIndex((o) => o !== void 0)), this.minZoom = e !== void 0 ? e : 0, this.resolutions_ = n, ae(
      tl(
        this.resolutions_,
        /**
         * @param {number} a First resolution
         * @param {number} b Second resolution
         * @return {number} Comparison result
         */
        (o, a) => a - o
      ),
      "`resolutions` must be sorted in descending order"
    );
    let r;
    if (!t.origins) {
      for (let o = 0, a = this.resolutions_.length - 1; o < a; ++o)
        if (!r)
          r = this.resolutions_[o] / this.resolutions_[o + 1];
        else if (this.resolutions_[o] / this.resolutions_[o + 1] !== r) {
          r = void 0;
          break;
        }
    }
    this.zoomFactor_ = r, this.maxZoom = this.resolutions_.length - 1, this.origin_ = t.origin !== void 0 ? t.origin : null, this.origins_ = null, t.origins !== void 0 && (this.origins_ = t.origins, ae(
      this.origins_.length == this.resolutions_.length,
      "Number of `origins` and `resolutions` must be equal"
    ));
    const s = t.extent;
    s !== void 0 && !this.origin_ && !this.origins_ && (this.origin_ = bn(s)), ae(
      !this.origin_ && this.origins_ || this.origin_ && !this.origins_,
      "Either `origin` or `origins` must be configured, never both"
    ), this.tileSizes_ = null, t.tileSizes !== void 0 && (this.tileSizes_ = t.tileSizes, ae(
      this.tileSizes_.length == this.resolutions_.length,
      "Number of `tileSizes` and `resolutions` must be equal"
    )), this.tileSize_ = t.tileSize !== void 0 ? t.tileSize : this.tileSizes_ ? null : dr, ae(
      !this.tileSize_ && this.tileSizes_ || this.tileSize_ && !this.tileSizes_,
      "Either `tileSize` or `tileSizes` must be configured, never both"
    ), this.extent_ = s !== void 0 ? s : null, this.fullTileRanges_ = null, this.tmpSize_ = [0, 0], this.tmpExtent_ = [0, 0, 0, 0], t.tileRanges !== void 0 ? this.fullTileRanges_ = t.tileRanges : t.sizes !== void 0 ? this.fullTileRanges_ = t.sizes.map((o, a) => {
      const A = new rc(
        Math.min(0, o[0]),
        Math.max(o[0] - 1, -1),
        Math.min(0, o[1]),
        Math.max(o[1] - 1, -1)
      );
      if (s) {
        const g = this.getTileRangeForExtentAndZ(s, a);
        A.minX = Math.max(g.minX, A.minX), A.maxX = Math.min(g.maxX, A.maxX), A.minY = Math.max(g.minY, A.minY), A.maxY = Math.min(g.maxY, A.maxY);
      }
      return A;
    }) : s && this.calculateTileRanges_(s);
  }
  /**
   * Call a function with each tile coordinate for a given extent and zoom level.
   *
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {number} zoom Integer zoom level.
   * @param {function(import("../tilecoord.js").TileCoord): void} callback Function called with each tile coordinate.
   * @api
   */
  forEachTileCoord(t, e, n) {
    const r = this.getTileRangeForExtentAndZ(t, e);
    for (let s = r.minX, o = r.maxX; s <= o; ++s)
      for (let a = r.minY, A = r.maxY; a <= A; ++a)
        n([e, s, a]);
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {function(number, import("../TileRange.js").default): boolean} callback Callback.
   * @param {import("../TileRange.js").default} [tempTileRange] Temporary import("../TileRange.js").default object.
   * @param {import("../extent.js").Extent} [tempExtent] Temporary import("../extent.js").Extent object.
   * @return {boolean} Callback succeeded.
   */
  forEachTileCoordParentTileRange(t, e, n, r) {
    let s, o, a, A = null, g = t[0] - 1;
    for (this.zoomFactor_ === 2 ? (o = t[1], a = t[2]) : A = this.getTileCoordExtent(t, r); g >= this.minZoom; ) {
      if (o !== void 0 && a !== void 0 ? (o = Math.floor(o / 2), a = Math.floor(a / 2), s = _i(o, o, a, a, n)) : s = this.getTileRangeForExtentAndZ(
        /** @type {import("../extent.js").Extent} */
        A,
        g,
        n
      ), e(g, s))
        return !0;
      --g;
    }
    return !1;
  }
  /**
   * Get the extent for this tile grid, if it was configured.
   * @return {import("../extent.js").Extent|null} Extent.
   * @api
   */
  getExtent() {
    return this.extent_;
  }
  /**
   * Get the maximum zoom level for the grid.
   * @return {number} Max zoom.
   * @api
   */
  getMaxZoom() {
    return this.maxZoom;
  }
  /**
   * Get the minimum zoom level for the grid.
   * @return {number} Min zoom.
   * @api
   */
  getMinZoom() {
    return this.minZoom;
  }
  /**
   * Get the origin for the grid at the given zoom level.
   * @param {number} z Integer zoom level.
   * @return {import("../coordinate.js").Coordinate} Origin.
   * @api
   */
  getOrigin(t) {
    return this.origin_ ? this.origin_ : this.origins_ ? this.origins_[t] : [0, 0];
  }
  /**
   * Get the list of origins for the grid.
   * @return {Array<import("../coordinate.js").Coordinate>|null} Origin.
   */
  getOrigins() {
    return this.origins_;
  }
  /**
   * Get the resolution for the given zoom level.
   * @param {number} z Integer zoom level.
   * @return {number} Resolution.
   * @api
   */
  getResolution(t) {
    return this.resolutions_[t];
  }
  /**
   * Get the list of resolutions for the tile grid.
   * @return {Array<number>} Resolutions.
   * @api
   */
  getResolutions() {
    return this.resolutions_;
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("../TileRange.js").default} [tempTileRange] Temporary import("../TileRange.js").default object.
   * @param {import("../extent.js").Extent} [tempExtent] Temporary import("../extent.js").Extent object.
   * @return {import("../TileRange.js").default|null} Tile range.
   */
  getTileCoordChildTileRange(t, e, n) {
    if (t[0] < this.maxZoom) {
      if (this.zoomFactor_ === 2) {
        const s = t[1] * 2, o = t[2] * 2;
        return _i(
          s,
          s + 1,
          o,
          o + 1,
          e
        );
      }
      const r = this.getTileCoordExtent(
        t,
        n || this.tmpExtent_
      );
      return this.getTileRangeForExtentAndZ(
        r,
        t[0] + 1,
        e
      );
    }
    return null;
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {number} z Integer zoom level.
   * @param {import("../TileRange.js").default} [tempTileRange] Temporary import("../TileRange.js").default object.
   * @return {import("../TileRange.js").default|null} Tile range.
   */
  getTileRangeForTileCoordAndZ(t, e, n) {
    if (e > this.maxZoom || e < this.minZoom)
      return null;
    const r = t[0], s = t[1], o = t[2];
    if (e === r)
      return _i(
        s,
        s,
        o,
        o,
        n
      );
    if (this.zoomFactor_) {
      const A = Math.pow(this.zoomFactor_, e - r), g = Math.floor(s * A), c = Math.floor(o * A);
      if (e < r)
        return _i(g, g, c, c, n);
      const u = Math.floor(A * (s + 1)) - 1, C = Math.floor(A * (o + 1)) - 1;
      return _i(g, u, c, C, n);
    }
    const a = this.getTileCoordExtent(t, this.tmpExtent_);
    return this.getTileRangeForExtentAndZ(a, e, n);
  }
  /**
   * Get a tile range for the given extent and integer zoom level.
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {number} z Integer zoom level.
   * @param {import("../TileRange.js").default} [tempTileRange] Temporary tile range object.
   * @return {import("../TileRange.js").default} Tile range.
   */
  getTileRangeForExtentAndZ(t, e, n) {
    this.getTileCoordForXYAndZ_(t[0], t[3], e, !1, Si);
    const r = Si[1], s = Si[2];
    this.getTileCoordForXYAndZ_(t[2], t[1], e, !0, Si);
    const o = Si[1], a = Si[2];
    return _i(r, o, s, a, n);
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @return {import("../coordinate.js").Coordinate} Tile center.
   */
  getTileCoordCenter(t) {
    const e = this.getOrigin(t[0]), n = this.getResolution(t[0]), r = oi(this.getTileSize(t[0]), this.tmpSize_);
    return [
      e[0] + (t[1] + 0.5) * r[0] * n,
      e[1] - (t[2] + 0.5) * r[1] * n
    ];
  }
  /**
   * Get the extent of a tile coordinate.
   *
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("../extent.js").Extent} [tempExtent] Temporary extent object.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getTileCoordExtent(t, e) {
    const n = this.getOrigin(t[0]), r = this.getResolution(t[0]), s = oi(this.getTileSize(t[0]), this.tmpSize_), o = n[0] + t[1] * s[0] * r, a = n[1] - (t[2] + 1) * s[1] * r, A = o + s[0] * r, g = a + s[1] * r;
    return ui(o, a, A, g, e);
  }
  /**
   * Get the tile coordinate for the given map coordinate and resolution.  This
   * method considers that coordinates that intersect tile boundaries should be
   * assigned the higher tile coordinate.
   *
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {number} resolution Resolution.
   * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Destination import("../tilecoord.js").TileCoord object.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
   * @api
   */
  getTileCoordForCoordAndResolution(t, e, n) {
    return this.getTileCoordForXYAndResolution_(
      t[0],
      t[1],
      e,
      !1,
      n
    );
  }
  /**
   * Note that this method should not be called for resolutions that correspond
   * to an integer zoom level.  Instead call the `getTileCoordForXYAndZ_` method.
   * @param {number} x X.
   * @param {number} y Y.
   * @param {number} resolution Resolution (for a non-integer zoom level).
   * @param {boolean} reverseIntersectionPolicy Instead of letting edge
   *     intersections go to the higher tile coordinate, let edge intersections
   *     go to the lower tile coordinate.
   * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Temporary import("../tilecoord.js").TileCoord object.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
   * @private
   */
  getTileCoordForXYAndResolution_(t, e, n, r, s) {
    const o = this.getZForResolution(n), a = n / this.getResolution(o), A = this.getOrigin(o), g = oi(this.getTileSize(o), this.tmpSize_);
    let c = a * (t - A[0]) / n / g[0], u = a * (A[1] - e) / n / g[1];
    return r ? (c = zn(c, Ze) - 1, u = zn(u, Ze) - 1) : (c = Gn(c, Ze), u = Gn(u, Ze)), tA(o, c, u, s);
  }
  /**
   * Although there is repetition between this method and `getTileCoordForXYAndResolution_`,
   * they should have separate implementations.  This method is for integer zoom
   * levels.  The other method should only be called for resolutions corresponding
   * to non-integer zoom levels.
   * @param {number} x Map x coordinate.
   * @param {number} y Map y coordinate.
   * @param {number} z Integer zoom level.
   * @param {boolean} reverseIntersectionPolicy Instead of letting edge
   *     intersections go to the higher tile coordinate, let edge intersections
   *     go to the lower tile coordinate.
   * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Temporary import("../tilecoord.js").TileCoord object.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
   * @private
   */
  getTileCoordForXYAndZ_(t, e, n, r, s) {
    const o = this.getOrigin(n), a = this.getResolution(n), A = oi(this.getTileSize(n), this.tmpSize_);
    let g = (t - o[0]) / a / A[0], c = (o[1] - e) / a / A[1];
    return r ? (g = zn(g, Ze) - 1, c = zn(c, Ze) - 1) : (g = Gn(g, Ze), c = Gn(c, Ze)), tA(n, g, c, s);
  }
  /**
   * Get a tile coordinate given a map coordinate and zoom level.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {number} z Integer zoom level, e.g. the result of a `getZForResolution()` method call
   * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Destination import("../tilecoord.js").TileCoord object.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
   * @api
   */
  getTileCoordForCoordAndZ(t, e, n) {
    return this.getTileCoordForXYAndZ_(
      t[0],
      t[1],
      e,
      !1,
      n
    );
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @return {number} Tile resolution.
   */
  getTileCoordResolution(t) {
    return this.resolutions_[t[0]];
  }
  /**
   * Get the tile size for a zoom level. The type of the return value matches the
   * `tileSize` or `tileSizes` that the tile grid was configured with. To always
   * get an {@link import("../size.js").Size}, run the result through {@link module:ol/size.toSize}.
   * @param {number} z Z.
   * @return {number|import("../size.js").Size} Tile size.
   * @api
   */
  getTileSize(t) {
    return this.tileSize_ ? this.tileSize_ : this.tileSizes_ ? this.tileSizes_[t] : dr;
  }
  /**
   * @param {number} z Zoom level.
   * @return {import("../TileRange.js").default|null} Extent tile range for the specified zoom level.
   */
  getFullTileRange(t) {
    return this.fullTileRanges_ ? this.fullTileRanges_[t] : this.extent_ ? this.getTileRangeForExtentAndZ(this.extent_, t) : null;
  }
  /**
   * @param {number} resolution Resolution.
   * @param {number|import("../array.js").NearestDirectionFunction} [opt_direction]
   *     If 0, the nearest resolution will be used.
   *     If 1, the nearest higher resolution (lower Z) will be used. If -1, the
   *     nearest lower resolution (higher Z) will be used. Default is 0.
   *     Use a {@link module:ol/array~NearestDirectionFunction} for more precise control.
   *
   * For example to change tile Z at the midpoint of zoom levels
   * ```js
   * function(value, high, low) {
   *   return value - low * Math.sqrt(high / low);
   * }
   * ```
   * @return {number} Z.
   * @api
   */
  getZForResolution(t, e) {
    const n = eo(
      this.resolutions_,
      t,
      e || 0
    );
    return re(n, this.minZoom, this.maxZoom);
  }
  /**
   * The tile with the provided tile coordinate intersects the given viewport.
   * @param {import('../tilecoord.js').TileCoord} tileCoord Tile coordinate.
   * @param {Array<number>} viewport Viewport as returned from {@link module:ol/extent.getRotatedViewport}.
   * @return {boolean} The tile with the provided tile coordinate intersects the given viewport.
   */
  tileCoordIntersectsViewport(t, e) {
    return ag(
      e,
      0,
      e.length,
      2,
      this.getTileCoordExtent(t)
    );
  }
  /**
   * @param {!import("../extent.js").Extent} extent Extent for this tile grid.
   * @private
   */
  calculateTileRanges_(t) {
    const e = this.resolutions_.length, n = new Array(e);
    for (let r = this.minZoom; r < e; ++r)
      n[r] = this.getTileRangeForExtentAndZ(t, r);
    this.fullTileRanges_ = n;
  }
}
function oc(i) {
  let t = i.getDefaultTileGrid();
  return t || (t = df(i), i.setDefaultTileGrid(t)), t;
}
function If(i, t, e) {
  const n = t[0], r = i.getTileCoordCenter(t), s = Oo(e);
  if (!VA(s, r)) {
    const o = _t(s), a = Math.ceil(
      (s[0] - r[0]) / o
    );
    return r[0] += o * a, i.getTileCoordForCoordAndZ(r, n);
  }
  return t;
}
function Cf(i, t, e, n) {
  n = n !== void 0 ? n : "top-left";
  const r = ac(i, t, e);
  return new sc({
    extent: i,
    origin: cl(i, n),
    resolutions: r,
    tileSize: e
  });
}
function ff(i) {
  const t = i || {}, e = t.extent || qt("EPSG:3857")?.getExtent();
  if (!e)
    throw new Error("Unable to determine extent for XYZ tile grid");
  const n = {
    extent: e,
    minZoom: t.minZoom,
    tileSize: t.tileSize,
    resolutions: ac(
      e,
      t.maxZoom,
      t.tileSize,
      t.maxResolution
    )
  };
  return new sc(n);
}
function ac(i, t, e, n) {
  t = t !== void 0 ? t : cI, e = oi(e !== void 0 ? e : dr);
  const r = pe(i), s = _t(i);
  n = n !== void 0 && n > 0 ? n : Math.max(s / e[0], r / e[1]);
  const o = t + 1, a = new Array(o);
  for (let A = 0; A < o; ++A)
    a[A] = n / Math.pow(2, A);
  return a;
}
function df(i, t, e, n) {
  const r = Oo(i);
  return Cf(r, t, e, n);
}
function Oo(i) {
  const t = qt(i);
  if (!t)
    throw new Error("Unable to determine extent from unknown projection");
  let e = t.getExtent();
  if (!e) {
    const n = t.getMetersPerUnit();
    if (n === void 0)
      throw new Error(
        "Unable to determine extent from projection without units"
      );
    const r = 180 * /** @type {number} */
    co.degrees / n;
    e = ui(-r, -r, r, r);
  }
  return e;
}
class Ac extends io {
  /**
   * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("./TileState.js").default} state State.
   * @param {Options} [options] Tile options.
   */
  constructor(t, e, n) {
    super(), n = n || {}, this.tileCoord = t, this.state = e, this.key = "", this.transition_ = n.transition === void 0 ? 250 : n.transition, this.transitionStarts_ = {}, this.interpolate = !!n.interpolate;
  }
  /**
   * @protected
   */
  changed() {
    this.dispatchEvent(Ae.CHANGE);
  }
  /**
   * Called by the tile cache when the tile is removed from the cache due to expiry
   */
  release() {
    this.setState(ht.EMPTY);
  }
  /**
   * @return {string} Key.
   */
  getKey() {
    return this.key + "/" + this.tileCoord;
  }
  /**
   * Get the tile coordinate for this tile.
   * @return {import("./tilecoord.js").TileCoord} The tile coordinate.
   * @api
   */
  getTileCoord() {
    return this.tileCoord;
  }
  /**
   * @return {import("./TileState.js").default} State.
   */
  getState() {
    return this.state;
  }
  /**
   * Sets the state of this tile. If you write your own {@link module:ol/Tile~LoadFunction tileLoadFunction} ,
   * it is important to set the state correctly to {@link module:ol/TileState~ERROR}
   * when the tile cannot be loaded. Otherwise the tile cannot be removed from
   * the tile queue and will block other requests.
   * @param {import("./TileState.js").default} state State.
   * @api
   */
  setState(t) {
    if (this.state !== ht.EMPTY) {
      if (this.state !== ht.ERROR && this.state > t)
        throw new Error("Tile load sequence violation");
      this.state = t, this.changed();
    }
  }
  /**
   * Load the image or retry if loading previously failed.
   * Loading is taken care of by the tile queue, and calling this method is
   * only needed for preloading or for reloading in case of an error.
   * @abstract
   * @api
   */
  load() {
    Nt();
  }
  /**
   * Get the alpha value for rendering.
   * @param {string} id An id for the renderer.
   * @param {number} time The render frame time.
   * @return {number} A number between 0 and 1.
   */
  getAlpha(t, e) {
    if (!this.transition_)
      return 1;
    let n = this.transitionStarts_[t];
    if (!n)
      n = e, this.transitionStarts_[t] = n;
    else if (n === -1)
      return 1;
    const r = e - n + 1e3 / 60;
    return r >= this.transition_ ? 1 : kg(r / this.transition_);
  }
  /**
   * Determine if a tile is in an alpha transition.  A tile is considered in
   * transition if tile.getAlpha() has not yet been called or has been called
   * and returned 1.
   * @param {string} id An id for the renderer.
   * @return {boolean} The tile is in transition.
   */
  inTransition(t) {
    return this.transition_ ? this.transitionStarts_[t] !== -1 : !1;
  }
  /**
   * Mark a transition as complete.
   * @param {string} id An id for the renderer.
   */
  endTransition(t) {
    this.transition_ && (this.transitionStarts_[t] = -1);
  }
  /**
   * @override
   */
  disposeInternal() {
    this.release(), super.disposeInternal();
  }
}
class pf extends Ac {
  /**
   * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("./TileState.js").default} state State.
   * @param {string} src Image source URI.
   * @param {import('./dom.js').ImageAttributes} imageAttributes Image attributes options.
   * @param {import("./Tile.js").LoadFunction} tileLoadFunction Tile load function.
   * @param {import("./Tile.js").Options} [options] Tile options.
   */
  constructor(t, e, n, r, s, o) {
    super(t, e, o), this.crossOrigin_ = r?.crossOrigin, this.referrerPolicy_ = r?.referrerPolicy, this.src_ = n, this.key = n, this.image_, pr ? this.image_ = new OffscreenCanvas(1, 1) : (this.image_ = new Image(), this.crossOrigin_ !== null && this.crossOrigin_ !== void 0 && (this.image_.crossOrigin = this.crossOrigin_), this.referrerPolicy_ !== void 0 && (this.image_.referrerPolicy = this.referrerPolicy_)), this.unlisten_ = null, this.tileLoadFunction_ = s;
  }
  /**
   * Get the HTML image element for this tile (may be a Canvas, OffscreenCanvas, Image, or Video).
   * @return {HTMLCanvasElement|OffscreenCanvas|HTMLImageElement|HTMLVideoElement|null} Image.
   * @api
   */
  getImage() {
    return this.image_;
  }
  /**
   * Sets an HTML image element for this tile (may be a Canvas or preloaded Image).
   * @param {HTMLCanvasElement|OffscreenCanvas|HTMLImageElement} element Element.
   */
  setImage(t) {
    this.image_ = t, this.state = ht.LOADED, this.unlistenImage_(), this.changed();
  }
  /**
   * Get the cross origin of the ImageTile.
   * @return {string|null} Cross origin.
   */
  getCrossOrigin() {
    return this.crossOrigin_ ?? null;
  }
  /**
   * Get the referrer policy of the ImageTile.
   * @return {ReferrerPolicy|undefined} Referrer policy.
   */
  getReferrerPolicy() {
    return this.referrerPolicy_;
  }
  /**
   * Tracks loading or read errors.
   *
   * @private
   */
  handleImageError_() {
    this.state = ht.ERROR, this.unlistenImage_(), this.image_ = mf(), this.changed();
  }
  /**
   * Tracks successful image load.
   *
   * @private
   */
  handleImageLoad_() {
    if (pr)
      this.state = ht.LOADED;
    else {
      const t = (
        /** @type {HTMLImageElement} */
        this.image_
      );
      t.naturalWidth && t.naturalHeight ? this.state = ht.LOADED : this.state = ht.EMPTY;
    }
    this.unlistenImage_(), this.changed();
  }
  /**
   * Load the image or retry if loading previously failed.
   * Loading is taken care of by the tile queue, and calling this method is
   * only needed for preloading or for reloading in case of an error.
   *
   * To retry loading tiles on failed requests, use a custom `tileLoadFunction`
   * that checks for error status codes and reloads only when the status code is
   * 408, 429, 500, 502, 503 and 504, and only when not too many retries have been
   * made already:
   *
   * ```js
   * const retryCodes = [408, 429, 500, 502, 503, 504];
   * const retries = {};
   * source.setTileLoadFunction((tile, src) => {
   *   const image = tile.getImage();
   *   fetch(src)
   *     .then((response) => {
   *       if (retryCodes.includes(response.status)) {
   *         retries[src] = (retries[src] || 0) + 1;
   *         if (retries[src] <= 3) {
   *           setTimeout(() => tile.load(), retries[src] * 1000);
   *         }
   *         return Promise.reject();
   *       }
   *       return response.blob();
   *     })
   *     .then((blob) => {
   *       const imageUrl = URL.createObjectURL(blob);
   *       image.src = imageUrl;
   *       setTimeout(() => URL.revokeObjectURL(imageUrl), 5000);
   *     })
   *     .catch(() => tile.setState(3)); // error
   * });
   * ```
   * @api
   * @override
   */
  load() {
    if (this.state == ht.ERROR && (this.state = ht.IDLE, this.image_ = new Image(), this.crossOrigin_ !== null && this.crossOrigin_ !== void 0 && (this.image_.crossOrigin = this.crossOrigin_), this.referrerPolicy_ !== void 0 && (this.image_.referrerPolicy = this.referrerPolicy_)), this.state == ht.IDLE) {
      this.state = ht.LOADING, this.changed(), this.tileLoadFunction_(this, this.src_);
      const t = this.image_;
      t && (this.unlisten_ = $I(
        t,
        this.handleImageLoad_.bind(this),
        this.handleImageError_.bind(this)
      ));
    }
  }
  /**
   * Discards event handlers which listen for load completion or errors.
   *
   * @private
   */
  unlistenImage_() {
    this.unlisten_ && (this.unlisten_(), this.unlisten_ = null);
  }
  /**
   * @override
   */
  disposeInternal() {
    this.unlistenImage_(), this.image_ = null, super.disposeInternal();
  }
}
function mf() {
  const i = mr(1, 1);
  return i.fillStyle = "rgba(0,0,0,0)", i.fillRect(0, 0, 1, 1), i.canvas;
}
let fs;
const Gi = [];
function IA(i, t, e, n, r) {
  i.beginPath(), i.moveTo(0, 0), i.lineTo(t, e), i.lineTo(n, r), i.closePath(), i.save(), i.clip(), i.fillRect(0, 0, Math.max(t, n) + 1, Math.max(e, r)), i.restore();
}
function ds(i, t) {
  return Math.abs(i[t * 4] - 210) > 2 || Math.abs(i[t * 4 + 3] - 0.75 * 255) > 2;
}
function yf() {
  if (fs === void 0) {
    const i = mr(6, 6, Gi);
    i.globalCompositeOperation = "lighter", i.fillStyle = "rgba(210, 0, 0, 0.75)", IA(i, 4, 5, 4, 0), IA(i, 4, 5, 0, 5);
    const t = i.getImageData(0, 0, 3, 3).data;
    fs = ds(t, 0) || ds(t, 4) || ds(t, 8), Ro(i), Gi.push(i.canvas);
  }
  return fs;
}
function CA(i, t, e, n) {
  const r = eg(e, t, i);
  let s = Ca(
    t,
    n,
    e
  );
  const o = t.getMetersPerUnit();
  o !== void 0 && (s *= o);
  const a = i.getMetersPerUnit();
  a !== void 0 && (s /= a);
  const A = i.getExtent();
  if (!A || VA(A, r)) {
    const g = Ca(i, s, r) / s;
    isFinite(g) && g > 0 && (s /= g);
  }
  return s;
}
function vf(i, t, e, n) {
  const r = Ui(e);
  let s = CA(
    i,
    t,
    r,
    n
  );
  return (!isFinite(s) || s <= 0) && ro(e, function(o) {
    return s = CA(
      i,
      t,
      o,
      n
    ), isFinite(s) && s > 0;
  }), s;
}
function wf(i, t, e, n, r, s, o, a, A, g, c, u, C, p) {
  const m = mr(
    Math.round(e * i),
    Math.round(e * t),
    Gi
  );
  if (u || (m.imageSmoothingEnabled = !1), A.length === 0)
    return m.canvas;
  m.scale(e, e);
  function l(f) {
    return Math.round(f * e) / e;
  }
  m.globalCompositeOperation = "lighter";
  const h = Hi();
  A.forEach(function(f, y, w) {
    Al(h, f.extent);
  });
  let I;
  const d = e / n, E = (u ? 1 : 1 + Math.pow(2, -24)) / d;
  {
    const f = mr(
      Math.round(_t(h) * d),
      Math.round(pe(h) * d),
      Gi
    );
    I = f, u || (f.imageSmoothingEnabled = !1), A.forEach(function(y, w, T) {
      if (y.image.width > 0 && y.image.height > 0) {
        if (y.clipExtent) {
          f.save();
          const L = (y.clipExtent[0] - h[0]) * d, D = -(y.clipExtent[3] - h[3]) * d, F = _t(y.clipExtent) * d, j = pe(y.clipExtent) * d;
          f.rect(
            u ? L : Math.round(L),
            u ? D : Math.round(D),
            u ? F : Math.round(L + F) - Math.round(L),
            u ? j : Math.round(D + j) - Math.round(D)
          ), f.clip();
        }
        const M = (y.extent[0] - h[0]) * d, x = -(y.extent[3] - h[3]) * d, _ = _t(y.extent) * d, S = pe(y.extent) * d;
        f.drawImage(
          y.image,
          g,
          g,
          y.image.width - 2 * g,
          y.image.height - 2 * g,
          u ? M : Math.round(M),
          u ? x : Math.round(x),
          u ? _ : Math.round(M + _) - Math.round(M),
          u ? S : Math.round(x + S) - Math.round(x)
        ), y.clipExtent && f.restore();
      }
    });
  }
  const v = bn(o);
  return a.getTriangles().forEach(function(f, y, w) {
    const T = f.source, M = f.target;
    let x = T[0][0], _ = T[0][1], S = T[1][0], L = T[1][1], D = T[2][0], F = T[2][1];
    const j = l((M[0][0] - v[0]) / s), R = l(
      -(M[0][1] - v[1]) / s
    ), B = l((M[1][0] - v[0]) / s), k = l(
      -(M[1][1] - v[1]) / s
    ), X = l((M[2][0] - v[0]) / s), Z = l(
      -(M[2][1] - v[1]) / s
    ), W = x, nt = _;
    x = 0, _ = 0, S -= W, L -= nt, D -= W, F -= nt;
    const rt = [
      [S, L, 0, 0, B - j],
      [D, F, 0, 0, X - j],
      [0, 0, S, L, k - R],
      [0, 0, D, F, Z - R]
    ], st = wl(rt);
    if (!st)
      return;
    if (m.save(), m.beginPath(), yf() || !u) {
      m.moveTo(B, k);
      const ut = 4, at = j - B, H = R - k;
      for (let Q = 0; Q < ut; Q++)
        m.lineTo(
          B + l((Q + 1) * at / ut),
          k + l(Q * H / (ut - 1))
        ), Q != ut - 1 && m.lineTo(
          B + l((Q + 1) * at / ut),
          k + l((Q + 1) * H / (ut - 1))
        );
      m.lineTo(X, Z);
    } else
      m.moveTo(B, k), m.lineTo(j, R), m.lineTo(X, Z);
    m.clip(), m.transform(
      st[0],
      st[2],
      st[1],
      st[3],
      j,
      R
    ), m.translate(
      h[0] - W,
      h[3] - nt
    );
    let tt;
    if (I)
      tt = I.canvas, m.scale(E, -E);
    else {
      const ut = A[0], at = ut.extent;
      tt = ut.image, m.scale(
        _t(at) / tt.width,
        -pe(at) / tt.height
      );
    }
    m.drawImage(tt, 0, 0), m.restore();
  }), I && (Ro(I), Gi.push(I.canvas)), c && (m.save(), m.globalCompositeOperation = "source-over", m.strokeStyle = "black", m.lineWidth = 1, a.getTriangles().forEach(function(f, y, w) {
    const T = f.target, M = (T[0][0] - v[0]) / s, x = -(T[0][1] - v[1]) / s, _ = (T[1][0] - v[0]) / s, S = -(T[1][1] - v[1]) / s, L = (T[2][0] - v[0]) / s, D = -(T[2][1] - v[1]) / s;
    m.beginPath(), m.moveTo(_, S), m.lineTo(M, x), m.lineTo(L, D), m.closePath(), m.stroke();
  }), m.restore()), m.canvas;
}
const bf = 10, fA = 0.25;
class Ef {
  /**
   * @param {import("../proj/Projection.js").default} sourceProj Source projection.
   * @param {import("../proj/Projection.js").default} targetProj Target projection.
   * @param {import("../extent.js").Extent} targetExtent Target extent to triangulate.
   * @param {import("../extent.js").Extent|undefined} maxSourceExtent Maximal source extent that can be used.
   * @param {number} errorThreshold Acceptable error (in source units).
   * @param {?number} destinationResolution The (optional) resolution of the destination.
   * @param {import("../transform.js").Transform} [sourceMatrix] Source transform matrix.
   */
  constructor(t, e, n, r, s, o, a) {
    this.sourceProj_ = t, this.targetProj_ = e;
    let A = {};
    const g = a ? $l(
      (E) => ou(
        a,
        eg(E, this.targetProj_, this.sourceProj_)
      )
    ) : (
      /** @type {import("../proj.js").TransformFunction} */
      ur(this.targetProj_, this.sourceProj_)
    );
    this.transformInv_ = function(E) {
      const v = E[0] + "/" + E[1];
      return A[v] || (A[v] = g(E)), A[v];
    }, this.maxSourceExtent_ = r, this.errorThresholdSquared_ = s * s, this.triangles_ = [], this.wrapsXInSource_ = !1, this.canWrapXInSource_ = this.sourceProj_.canWrapX() && !!r && !!this.sourceProj_.getExtent() && _t(r) >= _t(this.sourceProj_.getExtent()), this.sourceWorldWidth_ = this.sourceProj_.getExtent() ? _t(this.sourceProj_.getExtent()) : void 0, this.targetWorldWidth_ = this.targetProj_.getExtent() ? _t(this.targetProj_.getExtent()) : void 0;
    const c = bn(n), u = ao(n), C = oo(n), p = so(n), m = this.transformInv_(c), l = this.transformInv_(u), h = this.transformInv_(C), I = this.transformInv_(p), d = bf + (o ? Math.max(
      0,
      Math.ceil(
        Math.log2(
          Os(n) / (o * o * 256 * 256)
        )
      )
    ) : 0);
    if (this.addQuad_(
      c,
      u,
      C,
      p,
      m,
      l,
      h,
      I,
      d
    ), this.wrapsXInSource_) {
      const E = this.sourceWorldWidth_;
      if (!E)
        return;
      let v = 1 / 0;
      this.triangles_.forEach(function(f, y, w) {
        v = Math.min(
          v,
          f.source[0][0],
          f.source[1][0],
          f.source[2][0]
        );
      }), this.triangles_.forEach((f) => {
        if (Math.max(
          f.source[0][0],
          f.source[1][0],
          f.source[2][0]
        ) - v > E / 2) {
          const y = [
            [f.source[0][0], f.source[0][1]],
            [f.source[1][0], f.source[1][1]],
            [f.source[2][0], f.source[2][1]]
          ];
          y[0][0] - v > E / 2 && (y[0][0] -= E), y[1][0] - v > E / 2 && (y[1][0] -= E), y[2][0] - v > E / 2 && (y[2][0] -= E);
          const w = Math.min(
            y[0][0],
            y[1][0],
            y[2][0]
          );
          Math.max(
            y[0][0],
            y[1][0],
            y[2][0]
          ) - w < E / 2 && (f.source = y);
        }
      });
    }
    A = {};
  }
  /**
   * Adds triangle to the triangulation.
   * @param {import("../coordinate.js").Coordinate} a The target a coordinate.
   * @param {import("../coordinate.js").Coordinate} b The target b coordinate.
   * @param {import("../coordinate.js").Coordinate} c The target c coordinate.
   * @param {import("../coordinate.js").Coordinate} aSrc The source a coordinate.
   * @param {import("../coordinate.js").Coordinate} bSrc The source b coordinate.
   * @param {import("../coordinate.js").Coordinate} cSrc The source c coordinate.
   * @private
   */
  addTriangle_(t, e, n, r, s, o) {
    this.triangles_.push({
      source: [r, s, o],
      target: [t, e, n]
    });
  }
  /**
   * Adds quad (points in clock-wise order) to the triangulation
   * (and reprojects the vertices) if valid.
   * Performs quad subdivision if needed to increase precision.
   *
   * @param {import("../coordinate.js").Coordinate} a The target a coordinate.
   * @param {import("../coordinate.js").Coordinate} b The target b coordinate.
   * @param {import("../coordinate.js").Coordinate} c The target c coordinate.
   * @param {import("../coordinate.js").Coordinate} d The target d coordinate.
   * @param {import("../coordinate.js").Coordinate} aSrc The source a coordinate.
   * @param {import("../coordinate.js").Coordinate} bSrc The source b coordinate.
   * @param {import("../coordinate.js").Coordinate} cSrc The source c coordinate.
   * @param {import("../coordinate.js").Coordinate} dSrc The source d coordinate.
   * @param {number} maxSubdivision Maximal allowed subdivision of the quad.
   * @private
   */
  addQuad_(t, e, n, r, s, o, a, A, g) {
    const c = na([s, o, a, A]), u = this.sourceWorldWidth_, C = u ? _t(c) / u : void 0, p = this.sourceProj_.canWrapX() && C !== void 0 && C > 0.5 && C < 1;
    let m = !1;
    if (g > 0) {
      if (this.targetProj_.isGlobal() && this.targetWorldWidth_) {
        const h = na([t, e, n, r]);
        m = _t(h) / this.targetWorldWidth_ > fA || m;
      }
      !p && this.sourceProj_.isGlobal() && C && (m = C > fA || m);
    }
    if (!m && this.maxSourceExtent_ && isFinite(c[0]) && isFinite(c[1]) && isFinite(c[2]) && isFinite(c[3]) && !Qi(c, this.maxSourceExtent_))
      return;
    let l = 0;
    if (!m && (!isFinite(s[0]) || !isFinite(s[1]) || !isFinite(o[0]) || !isFinite(o[1]) || !isFinite(a[0]) || !isFinite(a[1]) || !isFinite(A[0]) || !isFinite(A[1]))) {
      if (g > 0)
        m = !0;
      else if (l = (!isFinite(s[0]) || !isFinite(s[1]) ? 8 : 0) + (!isFinite(o[0]) || !isFinite(o[1]) ? 4 : 0) + (!isFinite(a[0]) || !isFinite(a[1]) ? 2 : 0) + (!isFinite(A[0]) || !isFinite(A[1]) ? 1 : 0), l != 1 && l != 2 && l != 4 && l != 8)
        return;
    }
    if (g > 0) {
      if (!m) {
        const h = [(t[0] + n[0]) / 2, (t[1] + n[1]) / 2], I = this.transformInv_(h);
        let d;
        if (p) {
          const f = (
            /** @type {number} */
            u
          );
          d = (Bi(s[0], f) + Bi(a[0], f)) / 2 - Bi(I[0], f);
        } else
          d = (s[0] + a[0]) / 2 - I[0];
        const E = (s[1] + a[1]) / 2 - I[1];
        m = d * d + E * E > this.errorThresholdSquared_;
      }
      if (m) {
        if (Math.abs(t[0] - n[0]) <= Math.abs(t[1] - n[1])) {
          const h = [(e[0] + n[0]) / 2, (e[1] + n[1]) / 2], I = this.transformInv_(h), d = [(r[0] + t[0]) / 2, (r[1] + t[1]) / 2], E = this.transformInv_(d);
          this.addQuad_(
            t,
            e,
            h,
            d,
            s,
            o,
            I,
            E,
            g - 1
          ), this.addQuad_(
            d,
            h,
            n,
            r,
            E,
            I,
            a,
            A,
            g - 1
          );
        } else {
          const h = [(t[0] + e[0]) / 2, (t[1] + e[1]) / 2], I = this.transformInv_(h), d = [(n[0] + r[0]) / 2, (n[1] + r[1]) / 2], E = this.transformInv_(d);
          this.addQuad_(
            t,
            h,
            d,
            r,
            s,
            I,
            E,
            A,
            g - 1
          ), this.addQuad_(
            h,
            e,
            n,
            d,
            I,
            o,
            a,
            E,
            g - 1
          );
        }
        return;
      }
    }
    if (p) {
      if (!this.canWrapXInSource_)
        return;
      this.wrapsXInSource_ = !0;
    }
    (l & 11) == 0 && this.addTriangle_(t, n, r, s, a, A), (l & 14) == 0 && this.addTriangle_(t, n, e, s, a, o), l && ((l & 13) == 0 && this.addTriangle_(e, r, t, o, A, s), (l & 7) == 0 && this.addTriangle_(e, r, n, o, A, a));
  }
  /**
   * Calculates extent of the `source` coordinates from all the triangles.
   *
   * @return {import("../extent.js").Extent} Calculated extent.
   */
  calculateSourceExtent() {
    const t = Hi();
    return this.triangles_.forEach(function(e, n, r) {
      const s = e.source;
      ir(t, s[0]), ir(t, s[1]), ir(t, s[2]);
    }), t;
  }
  /**
   * @return {Array<Triangle>} Array of the calculated triangles.
   */
  getTriangles() {
    return this.triangles_;
  }
}
const xf = 0.5;
class Tf extends Ac {
  /**
   * @param {import("../proj/Projection.js").default} sourceProj Source projection.
   * @param {import("../tilegrid/TileGrid.js").default} sourceTileGrid Source tile grid.
   * @param {import("../proj/Projection.js").default} targetProj Target projection.
   * @param {import("../tilegrid/TileGrid.js").default} targetTileGrid Target tile grid.
   * @param {import("../tilecoord.js").TileCoord} tileCoord Coordinate of the tile.
   * @param {import("../tilecoord.js").TileCoord} wrappedTileCoord Coordinate of the tile wrapped in X.
   * @param {number} pixelRatio Pixel ratio.
   * @param {number} gutter Gutter of the source tiles.
   * @param {FunctionType} getTileFunction
   *     Function returning source tiles (z, x, y, pixelRatio).
   * @param {number} [errorThreshold] Acceptable reprojection error (in px).
   * @param {boolean} [renderEdges] Render reprojection edges.
   * @param {import("../Tile.js").Options} [options] Tile options.
   */
  constructor(t, e, n, r, s, o, a, A, g, c, u, C) {
    super(s, ht.IDLE, C), this.renderEdges_ = u !== void 0 ? u : !1, this.pixelRatio_ = a, this.gutter_ = A, this.canvas_ = null, this.sourceTileGrid_ = e, this.targetTileGrid_ = r, this.wrappedTileCoord_ = o || s, this.sourceTiles_ = [], this.sourcesListenerKeys_ = null, this.sourceZ_ = 0, this.clipExtent_ = t.canWrapX() && t.getExtent() || void 0;
    const p = r.getTileCoordExtent(
      this.wrappedTileCoord_
    ), m = this.targetTileGrid_.getExtent();
    let l = this.sourceTileGrid_.getExtent();
    const h = m ? Jr(p, m) : p;
    if (Os(h) === 0) {
      this.state = ht.EMPTY;
      return;
    }
    const I = t.getExtent();
    I && (l ? l = Jr(l, I) : l = I);
    const d = r.getResolution(
      this.wrappedTileCoord_[0]
    ), E = vf(
      t,
      n,
      h,
      d
    );
    if (!isFinite(E) || E <= 0) {
      this.state = ht.EMPTY;
      return;
    }
    const v = c !== void 0 ? c : xf;
    if (this.triangulation_ = new Ef(
      t,
      n,
      h,
      l || void 0,
      E * v,
      d
    ), this.triangulation_.getTriangles().length === 0) {
      this.state = ht.EMPTY;
      return;
    }
    this.sourceZ_ = e.getZForResolution(E);
    let f = this.triangulation_.calculateSourceExtent();
    if (l && (t.canWrapX() ? (f[1] = re(
      f[1],
      l[1],
      l[3]
    ), f[3] = re(
      f[3],
      l[1],
      l[3]
    )) : f = Jr(f, l)), !Os(f))
      this.state = ht.EMPTY;
    else {
      let y = 0, w = 0;
      t.canWrapX() && (y = _t(I), w = Math.floor(
        (f[0] - I[0]) / y
      )), dl(
        f.slice(),
        t
      ).forEach((M) => {
        const x = e.getTileRangeForExtentAndZ(
          M,
          this.sourceZ_
        );
        for (let _ = x.minX; _ <= x.maxX; _++)
          for (let S = x.minY; S <= x.maxY; S++) {
            const L = w * y;
            this.sourceTiles_.push({
              getTile: () => g(this.sourceZ_, _, S, a),
              offset: L
            });
          }
        ++w;
      }), this.sourceTiles_.length === 0 && (this.state = ht.EMPTY);
    }
  }
  /**
   * Get the HTML Canvas element for this tile.
   * @return {HTMLCanvasElement|OffscreenCanvas|null} Canvas.
   */
  getImage() {
    return this.canvas_;
  }
  /**
   * @private
   */
  reproject_() {
    const t = [];
    if (this.sourceTiles_.forEach((e) => {
      const n = e.tile;
      if (n && n.getState() == ht.LOADED) {
        const r = this.sourceTileGrid_.getTileCoordExtent(n.tileCoord);
        r[0] += e.offset, r[2] += e.offset;
        const s = this.clipExtent_?.slice();
        s && (s[0] += e.offset, s[2] += e.offset);
        const o = n.getImage();
        if (!o)
          return;
        t.push({
          extent: r,
          clipExtent: s,
          image: o
        });
      }
    }), this.sourceTiles_.length = 0, t.length === 0)
      this.state = ht.ERROR;
    else {
      const e = this.wrappedTileCoord_[0], n = this.targetTileGrid_.getTileSize(e), r = typeof n == "number" ? n : n[0], s = typeof n == "number" ? n : n[1], o = this.targetTileGrid_.getResolution(e), a = this.sourceTileGrid_.getResolution(
        this.sourceZ_
      ), A = this.targetTileGrid_.getTileCoordExtent(
        this.wrappedTileCoord_
      );
      this.canvas_ = wf(
        r,
        s,
        this.pixelRatio_,
        a,
        this.sourceTileGrid_.getExtent() ?? A,
        o,
        A,
        this.triangulation_,
        t,
        this.gutter_,
        this.renderEdges_,
        this.interpolate
      ), this.state = ht.LOADED;
    }
    this.changed();
  }
  /**
   * Load not yet loaded URI.
   * @override
   */
  load() {
    for (const t of this.sourceTiles_)
      t.tile = t.getTile();
    if (this.state == ht.IDLE) {
      this.state = ht.LOADING, this.changed();
      let t = 0;
      this.sourcesListenerKeys_ = [], this.sourceTiles_.forEach((e) => {
        const n = e.tile;
        if (!n)
          return;
        const r = n.getState();
        if (r == ht.IDLE || r == ht.LOADING) {
          t++;
          const s = ai(n, Ae.CHANGE, () => {
            const o = n.getState();
            (o == ht.LOADED || o == ht.ERROR || o == ht.EMPTY) && (Qe(s), t--, t === 0 && (this.unlistenSources_(), this.reproject_()));
          });
          this.sourcesListenerKeys_.push(s);
        }
      }), t === 0 ? setTimeout(this.reproject_.bind(this), 0) : this.sourceTiles_.forEach(function(e) {
        const n = e.tile;
        if (!n)
          return;
        n.getState() == ht.IDLE && n.load();
      });
    }
  }
  /**
   * @private
   */
  unlistenSources_() {
    this.sourcesListenerKeys_ && (this.sourcesListenerKeys_.forEach(Qe), this.sourcesListenerKeys_ = null);
  }
  /**
   * Remove from the cache due to expiry
   * @override
   */
  release() {
    this.canvas_ && (Ro(
      /** @type {CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D} */
      this.canvas_.getContext("2d")
    ), Gi.push(this.canvas_), this.canvas_ = null), this.sourceTiles_.length = 0, super.release();
  }
}
class Mf extends eC {
  /**
   * @param {Options} options SourceTile source options.
   */
  constructor(t) {
    super({
      attributions: t.attributions,
      attributionsCollapsible: t.attributionsCollapsible,
      projection: t.projection,
      state: t.state,
      wrapX: t.wrapX,
      interpolate: t.interpolate
    }), this.on, this.once, this.un, this.tilePixelRatio_ = t.tilePixelRatio !== void 0 ? t.tilePixelRatio : 1, this.tileGrid = t.tileGrid !== void 0 ? t.tileGrid : null;
    const e = [256, 256];
    this.tileGrid && oi(this.tileGrid.getTileSize(this.tileGrid.getMinZoom()), e), this.tmpSize = [0, 0], this.key_ = t.key || Ai(this), this.tileOptions = {
      transition: t.transition,
      interpolate: t.interpolate
    }, this.zDirection = t.zDirection ? t.zDirection : 0;
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {number} Gutter.
   */
  getGutterForProjection(t) {
    return 0;
  }
  /**
   * Return the key to be used for all tiles in the source.
   * @return {string} The key for all tiles.
   */
  getKey() {
    return this.key_;
  }
  /**
   * Set the value to be used as the key for all tiles in the source.
   * @param {string} key The key for tiles.
   * @protected
   */
  setKey(t) {
    this.key_ !== t && (this.key_ = t, this.changed());
  }
  /**
   * @param {import("../proj/Projection.js").default} [projection] Projection.
   * @return {Array<number>|null} Resolutions.
   * @override
   */
  getResolutions(t) {
    const e = t ? this.getTileGridForProjection(t) : this.tileGrid;
    return e ? e.getResolutions() : null;
  }
  /**
   * @abstract
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @param {import("../structs/LRUCache.js").default<import("../Tile.js").default>} [tileCache] Tile cache.
   * @return {TileType|null} Tile.
   */
  getTile(t, e, n, r, s, o) {
    return Nt();
  }
  /**
   * Return the tile grid of the tile source.
   * @return {import("../tilegrid/TileGrid.js").default|null} Tile grid.
   * @api
   */
  getTileGrid() {
    return this.tileGrid;
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {!import("../tilegrid/TileGrid.js").default} Tile grid.
   */
  getTileGridForProjection(t) {
    return this.tileGrid ? this.tileGrid : oc(t);
  }
  /**
   * Get the tile pixel ratio for this source. Subclasses may override this
   * method, which is meant to return a supported pixel ratio that matches the
   * provided `pixelRatio` as close as possible.
   * @param {number} pixelRatio Pixel ratio.
   * @return {number} Tile pixel ratio.
   */
  getTilePixelRatio(t) {
    return this.tilePixelRatio_;
  }
  /**
   * @param {number} z Z.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {import("../size.js").Size} Tile size.
   */
  getTilePixelSize(t, e, n) {
    const r = this.getTileGridForProjection(n), s = this.getTilePixelRatio(e), o = oi(r.getTileSize(t), this.tmpSize);
    return s == 1 ? o : tC(o, s, this.tmpSize);
  }
  /**
   * Returns a tile coordinate wrapped around the x-axis. When the tile coordinate
   * is outside the resolution and extent range of the tile grid, `null` will be
   * returned.
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("../proj/Projection.js").default} [projection] Projection.
   * @return {import("../tilecoord.js").TileCoord|null} Tile coordinate to be passed to the tileUrlFunction or
   *     null if no tile URL should be created for the passed `tileCoord`.
   */
  getTileCoordForTileUrlFunction(t, e) {
    const n = e !== void 0 ? e : this.getProjection(), r = e !== void 0 ? this.getTileGridForProjection(
      /** @type {import("../proj/Projection.js").default} */
      n
    ) : this.tileGrid || this.getTileGridForProjection(
      /** @type {import("../proj/Projection.js").default} */
      n
    );
    return this.getWrapX() && /** @type {import("../proj/Projection.js").default} */
    n.isGlobal() && (t = If(
      r,
      t,
      /** @type {import("../proj/Projection.js").default} */
      n
    )), oC(t, r) ? t : null;
  }
  /**
   * Remove all cached reprojected tiles from the source. The next render cycle will create new tiles.
   * @api
   */
  clear() {
  }
  /**
   * @override
   */
  refresh() {
    this.clear(), super.refresh();
  }
}
class _f extends Me {
  /**
   * @param {string} type Type.
   * @param {import("../Tile.js").default} tile The tile.
   */
  constructor(t, e) {
    super(t), this.tile = e;
  }
}
const ps = {
  /**
   * Triggered when a tile starts loading.
   * @event module:ol/source/Tile.TileSourceEvent#tileloadstart
   * @api
   */
  TILELOADSTART: "tileloadstart",
  /**
   * Triggered when a tile finishes loading, either when its data is loaded,
   * or when loading was aborted because the tile is no longer needed.
   * @event module:ol/source/Tile.TileSourceEvent#tileloadend
   * @api
   */
  TILELOADEND: "tileloadend",
  /**
   * Triggered if tile loading results in an error. Note that this is not the
   * right place to re-fetch tiles. See {@link module:ol/ImageTile~ImageTile#load}
   * for details.
   * @event module:ol/source/Tile.TileSourceEvent#tileloaderror
   * @api
   */
  TILELOADERROR: "tileloaderror"
};
class Lo extends Mf {
  /**
   * @param {Options} options Image tile options.
   */
  constructor(t) {
    super({
      attributions: t.attributions,
      cacheSize: t.cacheSize,
      projection: t.projection,
      state: t.state,
      tileGrid: t.tileGrid,
      tilePixelRatio: t.tilePixelRatio,
      wrapX: t.wrapX,
      transition: t.transition,
      interpolate: t.interpolate,
      key: t.key,
      attributionsCollapsible: t.attributionsCollapsible,
      zDirection: t.zDirection
    }), this.generateTileUrlFunction_ = this.tileUrlFunction === Lo.prototype.tileUrlFunction, this.tileLoadFunction = t.tileLoadFunction, t.tileUrlFunction && (this.tileUrlFunction = t.tileUrlFunction), this.urls = null, t.urls ? this.setUrls(t.urls) : t.url && this.setUrl(t.url), this.tileLoadingKeys_ = {};
  }
  /**
   * Deprecated.  Use an ImageTile source instead.
   * Return the tile load function of the source.
   * @return {import("../Tile.js").LoadFunction} TileLoadFunction
   * @api
   */
  getTileLoadFunction() {
    return this.tileLoadFunction;
  }
  /**
   * Deprecated.  Use an ImageTile source instead.
   * Return the tile URL function of the source.
   * @return {import("../Tile.js").UrlFunction} TileUrlFunction
   * @api
   */
  getTileUrlFunction() {
    return Object.getPrototypeOf(this).tileUrlFunction === this.tileUrlFunction ? this.tileUrlFunction.bind(this) : this.tileUrlFunction;
  }
  /**
   * Deprecated.  Use an ImageTile source instead.
   * Return the URLs used for this source.
   * When a tileUrlFunction is used instead of url or urls,
   * null will be returned.
   * @return {!Array<string>|null} URLs.
   * @api
   */
  getUrls() {
    return this.urls;
  }
  /**
   * Handle tile change events.
   * @param {import("../events/Event.js").default} event Event.
   * @protected
   */
  handleTileChange(t) {
    const e = (
      /** @type {import("../Tile.js").default} */
      t.target
    ), n = Ai(e), r = e.getState();
    let s;
    r == ht.LOADING ? (this.tileLoadingKeys_[n] = !0, s = ps.TILELOADSTART) : n in this.tileLoadingKeys_ && (delete this.tileLoadingKeys_[n], s = r == ht.ERROR ? ps.TILELOADERROR : r == ht.LOADED ? ps.TILELOADEND : void 0), s != null && this.dispatchEvent(new _f(s, e));
  }
  /**
   * Deprecated.  Use an ImageTile source instead.
   * Set the tile load function of the source.
   * @param {import("../Tile.js").LoadFunction} tileLoadFunction Tile load function.
   * @api
   */
  setTileLoadFunction(t) {
    this.tileLoadFunction = t, this.changed();
  }
  /**
   * Deprecated.  Use an ImageTile source instead.
   * Set the tile URL function of the source.
   * @param {import("../Tile.js").UrlFunction} tileUrlFunction Tile URL function.
   * @param {string} [key] Optional new tile key for the source.
   * @api
   */
  setTileUrlFunction(t, e) {
    this.tileUrlFunction = t, typeof e < "u" ? this.setKey(e) : this.changed();
  }
  /**
   * Set the URL to use for requests.
   * @param {string} url URL.
   * @api
   */
  setUrl(t) {
    const e = uC(t);
    this.urls = e, this.setUrls(e);
  }
  /**
   * Deprecated.  Use an ImageTile source instead.
   * Set the URLs to use for requests.
   * @param {Array<string>} urls URLs.
   * @api
   */
  setUrls(t) {
    this.urls = t;
    const e = t.join(`
`);
    this.generateTileUrlFunction_ ? this.setTileUrlFunction(
      yr(
        t,
        /** @type {import("../tilegrid/TileGrid.js").default} */
        this.tileGrid
      ),
      e
    ) : this.setKey(e);
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {string|undefined} Tile URL.
   */
  tileUrlFunction(t, e, n) {
  }
}
class Sf extends Lo {
  /**
   * @param {!Options} options Image tile options.
   */
  constructor(t) {
    super({
      attributions: t.attributions,
      cacheSize: t.cacheSize,
      projection: t.projection,
      state: t.state,
      tileGrid: t.tileGrid,
      tileLoadFunction: t.tileLoadFunction ? t.tileLoadFunction : (
        /** @type {import("../Tile.js").LoadFunction} */
        Rf
      ),
      tilePixelRatio: t.tilePixelRatio,
      tileUrlFunction: t.tileUrlFunction,
      url: t.url,
      urls: t.urls,
      wrapX: t.wrapX,
      transition: t.transition,
      interpolate: t.interpolate !== void 0 ? t.interpolate : !0,
      key: t.key,
      attributionsCollapsible: t.attributionsCollapsible,
      zDirection: t.zDirection
    }), this.crossOrigin = t.crossOrigin !== void 0 ? t.crossOrigin : null, this.referrerPolicy = t.referrerPolicy, this.tileClass = t.tileClass !== void 0 ? t.tileClass : pf, this.tileGridForProjection = {}, this.reprojectionErrorThreshold_ = t.reprojectionErrorThreshold, this.renderReprojectionEdges_ = !1;
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {number} Gutter.
   * @override
   */
  getGutterForProjection(t) {
    const e = this.getProjection();
    return e && t && !$r(e, t) ? 0 : this.getGutter();
  }
  /**
   * @return {number} Gutter.
   */
  getGutter() {
    return 0;
  }
  /**
   * Return the key to be used for all tiles in the source.
   * @return {string} The key for all tiles.
   * @override
   */
  getKey() {
    let t = super.getKey();
    return this.getInterpolate() || (t += ":disable-interpolation"), t;
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {!import("../tilegrid/TileGrid.js").default} Tile grid.
   * @override
   */
  getTileGridForProjection(t) {
    const e = this.getProjection();
    if (this.tileGrid && (!e || $r(e, t)))
      return this.tileGrid;
    const n = Ai(t);
    return n in this.tileGridForProjection || (this.tileGridForProjection[n] = oc(t)), this.tileGridForProjection[n];
  }
  /**
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @param {string} key The key set on the tile.
   * @return {!ImageTile} Tile.
   * @private
   */
  createTile_(t, e, n, r, s, o) {
    const a = [t, e, n], A = this.getTileCoordForTileUrlFunction(
      a,
      s
    ), g = A ? this.tileUrlFunction(A, r, s) : void 0, c = new this.tileClass(
      a,
      g !== void 0 ? ht.IDLE : ht.EMPTY,
      g !== void 0 ? g : "",
      {
        crossOrigin: this.crossOrigin,
        referrerPolicy: this.referrerPolicy
      },
      this.tileLoadFunction,
      this.tileOptions
    );
    return c.key = o, c.addEventListener(
      Ae.CHANGE,
      /** @type {import("../events.js").ListenerFunction} */
      this.handleTileChange.bind(this)
    ), c;
  }
  /**
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @param {import("../structs/LRUCache.js").default<import("../Tile.js").default>} [tileCache] Tile cache.
   * @return {!(ImageTile|ReprojTile)} Tile.
   * @override
   */
  getTile(t, e, n, r, s, o) {
    const a = this.getProjection();
    if (!a || !s || $r(a, s))
      return this.getTileInternal(
        t,
        e,
        n,
        r,
        a || s
      );
    const A = [t, e, n], g = this.getKey(), c = this.getTileGridForProjection(a), u = this.getTileGridForProjection(s), C = this.getTileCoordForTileUrlFunction(A, s) || /** @type {import("../tilecoord.js").TileCoord} */
    A, p = new Tf(
      a,
      c,
      s,
      u,
      A,
      C,
      this.getTilePixelRatio(r),
      this.getGutter(),
      (m, l, h, I) => this.getTileInternal(m, l, h, I, a, o),
      this.reprojectionErrorThreshold_,
      this.renderReprojectionEdges_,
      this.tileOptions
    );
    return p.key = g, p;
  }
  /**
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {number} pixelRatio Pixel ratio.
   * @param {!import("../proj/Projection.js").default} projection Projection.
   * @param {import("../structs/LRUCache.js").default<import("../Tile.js").default>} [tileCache] Tile cache.
   * @return {!ImageTile} Tile.
   * @protected
   */
  getTileInternal(t, e, n, r, s, o) {
    const a = this.getKey(), A = nC(this, a, t, e, n);
    if (o && o.containsKey(A))
      return (
        /** @type {!ImageTile} */
        o.get(A)
      );
    const g = this.createTile_(t, e, n, r, s, a);
    return o?.set(A, g), g;
  }
  /**
   * Sets whether to render reprojection edges or not (usually for debugging).
   * @param {boolean} render Render the edges.
   * @api
   */
  setRenderReprojectionEdges(t) {
    this.renderReprojectionEdges_ != t && (this.renderReprojectionEdges_ = t, this.changed());
  }
  /**
   * Sets the tile grid to use when reprojecting the tiles to the given
   * projection instead of the default tile grid for the projection.
   *
   * This can be useful when the default tile grid cannot be created
   * (e.g. projection has no extent defined) or
   * for optimization reasons (custom tile size, resolutions, ...).
   *
   * @param {import("../proj.js").ProjectionLike} projection Projection.
   * @param {import("../tilegrid/TileGrid.js").default} tilegrid Tile grid to use for the projection.
   * @api
   */
  setTileGridForProjection(t, e) {
    const n = qt(t);
    if (n) {
      const r = Ai(n);
      r in this.tileGridForProjection || (this.tileGridForProjection[r] = e);
    }
  }
}
function Rf(i, t) {
  if (pr) {
    const e = i.getCrossOrigin();
    let n = "same-origin", r = "same-origin";
    e === "anonymous" || e === "" ? (n = "cors", r = "omit") : e === "use-credentials" && (n = "cors", r = "include");
    const s = {
      mode: n,
      credentials: r,
      referrerPolicy: i.getReferrerPolicy()
    };
    fetch(t, s).then((o) => {
      if (!o.ok)
        throw new Error(`HTTP ${o.status}`);
      return o.blob();
    }).then((o) => createImageBitmap(o)).then((o) => {
      const a = i.getImage();
      if (!a)
        return;
      a.width = o.width, a.height = o.height;
      const A = (
        /** @type {OffscreenCanvas} */
        a.getContext("2d")
      );
      A && (A.drawImage(o, 0, 0), o.close?.(), a.dispatchEvent(new Event("load")));
    }).catch(() => {
      i.getImage()?.dispatchEvent(new Event("error"));
    });
    return;
  }
  i.getImage().src = t;
}
class gc extends Sf {
  /**
   * @param {Options} options TileJSON options.
   */
  constructor(t) {
    if (super({
      attributions: t.attributions,
      cacheSize: t.cacheSize,
      crossOrigin: t.crossOrigin,
      interpolate: t.interpolate,
      projection: (
        /** @type {import("../proj.js").ProjectionLike} */
        qt("EPSG:3857")
      ),
      reprojectionErrorThreshold: t.reprojectionErrorThreshold,
      state: "loading",
      tileLoadFunction: t.tileLoadFunction,
      wrapX: t.wrapX !== void 0 ? t.wrapX : !0,
      transition: t.transition,
      zDirection: t.zDirection
    }), this.tileJSON_ = null, this.tileSize_ = t.tileSize, t.url)
      if (t.jsonp)
        hf(
          t.url,
          this.handleTileJSONResponse.bind(this),
          this.handleTileJSONError.bind(this)
        );
      else {
        const e = new XMLHttpRequest();
        e.addEventListener("load", this.onXHRLoad_.bind(this)), e.addEventListener("error", this.onXHRError_.bind(this)), e.open("GET", t.url), e.send();
      }
    else if (t.tileJSON)
      this.handleTileJSONResponse(t.tileJSON);
    else
      throw new Error("Either `url` or `tileJSON` options must be provided");
  }
  /**
   * @private
   * @param {Event} event The load event.
   */
  onXHRLoad_(t) {
    const e = (
      /** @type {XMLHttpRequest} */
      t.target
    );
    if (!e.status || e.status >= 200 && e.status < 300) {
      let n;
      try {
        n = /** @type {Config} */
        JSON.parse(e.responseText);
      } catch {
        this.handleTileJSONError();
        return;
      }
      this.handleTileJSONResponse(n);
    } else
      this.handleTileJSONError();
  }
  /**
   * @private
   * @param {Event} event The error event.
   */
  onXHRError_(t) {
    this.handleTileJSONError();
  }
  /**
   * @return {Config|null} The tilejson object.
   * @api
   */
  getTileJSON() {
    return this.tileJSON_;
  }
  /**
   * @protected
   * @param {Config} tileJSON Tile JSON.
   */
  handleTileJSONResponse(t) {
    const e = qt("EPSG:4326"), n = this.getProjection();
    if (!n || !e) {
      this.handleTileJSONError();
      return;
    }
    let r;
    if (t.bounds !== void 0) {
      const g = Rr(
        e,
        n
      );
      if (!g) {
        this.handleTileJSONError();
        return;
      }
      r = Cl(t.bounds, g);
    }
    const s = Oo(n), o = t.minzoom || 0, a = t.maxzoom || 22, A = ff({
      extent: s,
      maxZoom: a,
      minZoom: o,
      tileSize: this.tileSize_
    });
    if (this.tileGrid = A, this.tileUrlFunction = yr(t.tiles, A), t.attribution && !this.getAttributions()) {
      const g = r !== void 0 ? r : s;
      this.setAttributions(
        /** @type {import("./Source.js").Attribution} */
        (function(c) {
          return Qi(g, c.extent) ? [t.attribution] : null;
        })
      );
    }
    this.tileJSON_ = t, this.setState("ready");
  }
  /**
   * @protected
   */
  handleTileJSONError() {
    this.setState("error");
  }
}
/*! @license DOMPurify 3.4.17 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.17/LICENSE */
function dA(i, t) {
  (t == null || t > i.length) && (t = i.length);
  for (var e = 0, n = Array(t); e < t; e++) n[e] = i[e];
  return n;
}
function kf(i) {
  if (Array.isArray(i)) return i;
}
function Pf(i, t) {
  var e = i == null ? null : typeof Symbol < "u" && i[Symbol.iterator] || i["@@iterator"];
  if (e != null) {
    var n, r, s, o, a = [], A = !0, g = !1;
    try {
      if (s = (e = e.call(i)).next, t !== 0) for (; !(A = (n = s.call(e)).done) && (a.push(n.value), a.length !== t); A = !0) ;
    } catch (c) {
      g = !0, r = c;
    } finally {
      try {
        if (!A && e.return != null && (o = e.return(), Object(o) !== o)) return;
      } finally {
        if (g) throw r;
      }
    }
    return a;
  }
}
function Of() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
function Lf(i, t) {
  return kf(i) || Pf(i, t) || Df(i, t) || Of();
}
function Df(i, t) {
  if (i) {
    if (typeof i == "string") return dA(i, t);
    var e = {}.toString.call(i).slice(8, -1);
    return e === "Object" && i.constructor && (e = i.constructor.name), e === "Map" || e === "Set" ? Array.from(i) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? dA(i, t) : void 0;
  }
}
const cc = Object.entries, pA = Object.setPrototypeOf, Bf = Object.isFrozen, lc = Object.getPrototypeOf, uc = Object.getOwnPropertyDescriptor;
let Ot = Object.freeze, Gt = Object.seal, Pi = Object.create, hc = typeof Reflect < "u" && Reflect, Ks = hc.apply, Js = hc.construct;
Ot || (Ot = function(t) {
  return t;
});
Gt || (Gt = function(t) {
  return t;
});
Ks || (Ks = function(t, e) {
  for (var n = arguments.length, r = new Array(n > 2 ? n - 2 : 0), s = 2; s < n; s++) r[s - 2] = arguments[s];
  return t.apply(e, r);
});
Js || (Js = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) n[r - 1] = arguments[r];
  return new t(...n);
});
const Pe = wt(Array.prototype.forEach), Nf = wt(Array.prototype.lastIndexOf), mA = wt(Array.prototype.pop), gn = wt(Array.prototype.push), Ff = wt(Array.prototype.slice), jf = wt(Array.prototype.splice), zi = Array.isArray, ms = Ic(Set), ys = wt(Set.prototype.add), cn = wt(Set.prototype.has), $e = wt(String.prototype.toLowerCase), vs = wt(String.prototype.toString), yA = wt(String.prototype.match), ln = wt(String.prototype.replace), vA = wt(String.prototype.indexOf), Gf = wt(String.prototype.trim), zf = wt(Number.prototype.toString), Xf = wt(Boolean.prototype.toString), wA = typeof BigInt > "u" ? null : wt(BigInt.prototype.toString), bA = typeof Symbol > "u" ? null : wt(Symbol.prototype.toString), ee = wt(Object.prototype.hasOwnProperty), un = wt(Object.prototype.toString), Dt = wt(RegExp.prototype.test), Oe = Ic(TypeError);
function wt(i) {
  return function(t) {
    t instanceof RegExp && (t.lastIndex = 0);
    for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) n[r - 1] = arguments[r];
    return Ks(i, t, n);
  };
}
function Ic(i) {
  return function() {
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
    return Js(i, e);
  };
}
function Ct(i, t) {
  let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : $e;
  if (pA && pA(i, null), !zi(t)) return i;
  let n = t.length;
  for (; n--; ) {
    let r = t[n];
    if (typeof r == "string") {
      const s = e(r);
      s !== r && (Bf(t) || (t[n] = s), r = s);
    }
    i[r] = !0;
  }
  return i;
}
function Uf(i) {
  for (let t = 0; t < i.length; t++) ee(i, t) || (i[t] = null);
  return i;
}
function oe(i) {
  const t = Pi(null);
  for (const n of cc(i)) {
    var e = Lf(n, 2);
    const r = e[0], s = e[1];
    ee(i, r) && (zi(s) ? t[r] = Uf(s) : s && typeof s == "object" && s.constructor === Object ? t[r] = oe(s) : t[r] = s);
  }
  return t;
}
function Zf(i) {
  switch (typeof i) {
    case "string":
      return i;
    case "number":
      return zf(i);
    case "boolean":
      return Xf(i);
    case "bigint":
      return wA ? wA(i) : "0";
    case "symbol":
      return bA ? bA(i) : "Symbol()";
    case "undefined":
      return un(i);
    case "function":
    case "object": {
      if (i === null) return un(i);
      const t = i, e = ue(t, "toString");
      if (typeof e == "function") {
        const n = e(t);
        return typeof n == "string" ? n : un(n);
      }
      return un(i);
    }
    default:
      return un(i);
  }
}
function ue(i, t) {
  for (; i !== null; ) {
    const n = uc(i, t);
    if (n) {
      if (n.get) return wt(n.get);
      if (typeof n.value == "function") return wt(n.value);
    }
    i = lc(i);
  }
  function e() {
    return null;
  }
  return e;
}
function Wf(i, t) {
  for (; i !== null; ) {
    const e = uc(i, t);
    if (e) return e.get ? wt(e.get) : null;
    i = lc(i);
  }
  return null;
}
function Vf(i) {
  try {
    return Dt(i, ""), !0;
  } catch {
    return !1;
  }
}
const EA = Ot([
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
]), ws = Ot([
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
]), bs = Ot([
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
]), Yf = Ot([
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
]), Es = Ot([
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
]), Hf = Ot([
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
]), xA = Ot(["#text"]), TA = Ot([
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
]), xs = Ot([
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
]), MA = Ot([
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
]), qn = Ot([
  "xlink:href",
  "xml:id",
  "xlink:title",
  "xml:space",
  "xmlns:xlink"
]), Qf = Gt(/{{[\w\W]*|^[\w\W]*}}/g), Kf = Gt(/<%[\w\W]*|^[\w\W]*%>/g), Jf = Gt(/\${[\w\W]*/g), qf = Gt(/^data-[\-\w.\u00B7-\uFFFF]+$/), $f = Gt(/^aria-[\-\w]+$/), _A = Gt(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), td = Gt(/^(?:\w+script|data):/i), ed = Gt(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), id = Gt(/^html$/i), nd = Gt(/^[a-z][.\w]*(-[.\w]+)+$/i), Ts = Gt(/<[/\w!]/g), SA = Gt(/<[/\w]/g), rd = Gt(/<\/no(script|embed|frames)/i), RA = Gt(/\/>/i), Mt = {
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
}, sd = Ot(Ct({}, [
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
])), od = function() {
  return typeof window > "u" ? null : window;
}, ad = function(t, e) {
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
}, kA = function() {
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
}, We = function(t, e, n, r) {
  return ee(t, e) && zi(t[e]) ? Ct(r.base ? oe(r.base) : {}, t[e], r.transform) : n;
}, Ms = function(t, e, n) {
  const r = ee(t, e) ? t[e] : void 0;
  return r && typeof r == "object" ? oe(r) : n();
};
function Cc() {
  let i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : od();
  const t = (U) => Cc(U);
  if (t.version = "3.4.17", t.removed = [], !i || !i.document || i.document.nodeType !== Mt.document || !i.Element)
    return t.isSupported = !1, t;
  let e = i.document;
  const n = e, r = n.currentScript;
  i.DocumentFragment;
  const s = i.HTMLTemplateElement, o = i.Node, a = i.Element, A = i.NodeFilter;
  i.NamedNodeMap === void 0 && (i.NamedNodeMap || i.MozNamedAttrMap), i.HTMLFormElement;
  const g = i.DOMParser, c = i.trustedTypes, u = a.prototype, C = ue(u, "cloneNode"), p = ue(u, "remove"), m = ue(u, "removeAttributeNode"), l = ue(u, "nextSibling"), h = ue(u, "childNodes"), I = ue(u, "parentNode"), d = ue(u, "shadowRoot"), E = ue(u, "attributes"), v = o && o.prototype ? ue(o.prototype, "nodeType") : null, f = o && o.prototype ? ue(o.prototype, "nodeName") : null, y = o && o.prototype ? ue(o.prototype, "ownerDocument") : null, w = function(b) {
    return v ? v(b) : b.nodeType;
  }, T = function(b) {
    return f ? f(b) : b.nodeName;
  }, M = Wf(u, "namespaceURI"), x = function(b) {
    return M ? M(b) : b.namespaceURI;
  };
  if (typeof s == "function") {
    const U = e.createElement("template");
    U.content && U.content.ownerDocument && (e = U.content.ownerDocument);
  }
  let _, S = "", L, D = !1, F = 0;
  const j = function() {
    if (F > 0) throw Oe('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, R = function(b) {
    j(), F++;
    try {
      return _.createHTML(b);
    } finally {
      F--;
    }
  }, B = function(b) {
    j(), F++;
    try {
      return _.createScriptURL(b);
    } finally {
      F--;
    }
  }, k = function() {
    return D || (L = ad(c, r), D = !0), L;
  }, X = e, Z = X.implementation, W = X.createNodeIterator, nt = X.createDocumentFragment, rt = X.getElementsByTagName, st = n.importNode;
  let tt = kA();
  t.isSupported = typeof cc == "function" && typeof I == "function" && Z && Z.createHTMLDocument !== void 0;
  const ut = Qf, at = Kf, H = Jf, Q = qf, K = $f, yt = td, zt = ed, ce = nd;
  let vt = _A, dt = null;
  const O = Ct({}, [
    ...EA,
    ...ws,
    ...bs,
    ...Es,
    ...xA
  ]);
  let N = null;
  const V = Ct({}, [
    ...TA,
    ...xs,
    ...MA,
    ...qn
  ]);
  let Y = Object.seal(Pi(null, {
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
  })), ot = null, et = null;
  const gt = Object.seal(Pi(null, {
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
  let At = !0, bt = !0, St = !1, Vt = !0, Ce = !1, _e = !0, Se = !1, qi = !1, Ii = null, je = null, $i = !1, se = !1, me = !1, J = !1, $ = !0, It = !1;
  const ct = "user-content-";
  let ft = !0, Et = !1, Rt = null, le = {}, Re = null;
  const Ke = Ct({}, [
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
  let Rn = null;
  const kn = Ct({}, [
    "audio",
    "video",
    "img",
    "source",
    "image",
    "track"
  ]);
  let Ci = null;
  const No = Ct({}, [
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
  ]), Pn = "http://www.w3.org/1998/Math/MathML", On = "http://www.w3.org/2000/svg", ye = "http://www.w3.org/1999/xhtml";
  let fi = ye, Lr = !1, Dr = null;
  const bc = Ct({}, [
    Pn,
    On,
    ye
  ], vs), Fo = Ot([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext"
  ]);
  let Br = Ct({}, Fo);
  const jo = Ot(["annotation-xml"]);
  let Nr = Ct({}, jo);
  const Ec = Ct({}, [
    "title",
    "style",
    "font",
    "a",
    "script"
  ]);
  let tn = null;
  const xc = ["application/xhtml+xml", "text/html"], Tc = "text/html";
  let Tt = null, di = null;
  const Mc = e.createElement("form"), Go = function(b) {
    return b instanceof RegExp || b instanceof Function;
  }, Fr = function() {
    let b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (di && di === b) return;
    (!b || typeof b != "object") && (b = {}), b = oe(b), tn = xc.indexOf(b.PARSER_MEDIA_TYPE) === -1 ? Tc : b.PARSER_MEDIA_TYPE, Tt = tn === "application/xhtml+xml" ? vs : $e, dt = We(b, "ALLOWED_TAGS", O, { transform: Tt }), N = We(b, "ALLOWED_ATTR", V, { transform: Tt }), Dr = We(b, "ALLOWED_NAMESPACES", bc, { transform: vs }), Ci = We(b, "ADD_URI_SAFE_ATTR", No, {
      transform: Tt,
      base: No
    }), Rn = We(b, "ADD_DATA_URI_TAGS", kn, {
      transform: Tt,
      base: kn
    }), Re = We(b, "FORBID_CONTENTS", Ke, { transform: Tt }), ot = We(b, "FORBID_TAGS", oe({}), { transform: Tt }), et = We(b, "FORBID_ATTR", oe({}), { transform: Tt }), le = ee(b, "USE_PROFILES") ? b.USE_PROFILES && typeof b.USE_PROFILES == "object" ? oe(b.USE_PROFILES) : b.USE_PROFILES : !1, At = b.ALLOW_ARIA_ATTR !== !1, bt = b.ALLOW_DATA_ATTR !== !1, St = b.ALLOW_UNKNOWN_PROTOCOLS || !1, Vt = b.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Ce = b.SAFE_FOR_TEMPLATES || !1, _e = b.SAFE_FOR_XML !== !1, Se = b.WHOLE_DOCUMENT || !1, se = b.RETURN_DOM || !1, me = b.RETURN_DOM_FRAGMENT || !1, J = b.RETURN_TRUSTED_TYPE || !1, $i = b.FORCE_BODY || !1, $ = b.SANITIZE_DOM !== !1, It = b.SANITIZE_NAMED_PROPS || !1, ft = b.KEEP_CONTENT !== !1, Et = b.IN_PLACE || !1, vt = Vf(b.ALLOWED_URI_REGEXP) ? b.ALLOWED_URI_REGEXP : _A, fi = typeof b.NAMESPACE == "string" ? b.NAMESPACE : ye, Br = Ms(b, "MATHML_TEXT_INTEGRATION_POINTS", () => Ct({}, Fo)), Nr = Ms(b, "HTML_INTEGRATION_POINTS", () => Ct({}, jo));
    const P = Ms(b, "CUSTOM_ELEMENT_HANDLING", () => Pi(null));
    if (Y = Pi(null), ee(P, "tagNameCheck") && Go(P.tagNameCheck) && (Y.tagNameCheck = P.tagNameCheck), ee(P, "attributeNameCheck") && Go(P.attributeNameCheck) && (Y.attributeNameCheck = P.attributeNameCheck), ee(P, "allowCustomizedBuiltInElements") && typeof P.allowCustomizedBuiltInElements == "boolean" && (Y.allowCustomizedBuiltInElements = P.allowCustomizedBuiltInElements), Gt(Y), Ce && (bt = !1), me && (se = !0), le && (dt = Ct({}, xA), N = Pi(null), le.html === !0 && (Ct(dt, EA), Ct(N, TA)), le.svg === !0 && (Ct(dt, ws), Ct(N, xs), Ct(N, qn)), le.svgFilters === !0 && (Ct(dt, bs), Ct(N, xs), Ct(N, qn)), le.mathMl === !0 && (Ct(dt, Es), Ct(N, MA), Ct(N, qn))), gt.tagCheck = null, gt.attributeCheck = null, ee(b, "ADD_TAGS") && (typeof b.ADD_TAGS == "function" ? gt.tagCheck = b.ADD_TAGS : zi(b.ADD_TAGS) && (dt === O && (dt = oe(dt)), Ct(dt, b.ADD_TAGS, Tt))), ee(b, "ADD_ATTR") && (typeof b.ADD_ATTR == "function" ? gt.attributeCheck = b.ADD_ATTR : zi(b.ADD_ATTR) && (N === V && (N = oe(N)), Ct(N, b.ADD_ATTR, Tt))), ee(b, "ADD_FORBID_CONTENTS") && zi(b.ADD_FORBID_CONTENTS) && (Re === Ke && (Re = oe(Re)), Ct(Re, b.ADD_FORBID_CONTENTS, Tt)), ft && (dt["#text"] = !0), Se && Ct(dt, [
      "html",
      "head",
      "body"
    ]), dt.table && (Ct(dt, ["tbody"]), delete ot.tbody), b.TRUSTED_TYPES_POLICY) {
      if (typeof b.TRUSTED_TYPES_POLICY.createHTML != "function") throw Oe('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof b.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw Oe('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const G = _;
      _ = b.TRUSTED_TYPES_POLICY;
      try {
        S = R("");
      } catch (z) {
        throw _ = G, z;
      }
    } else b.TRUSTED_TYPES_POLICY === null ? (_ = void 0, S = "") : (_ === void 0 && (_ = k()), _ && typeof S == "string" && (S = R("")));
    Ot && Ot(b), di = b;
  }, zo = Ct({}, [
    ...ws,
    ...bs,
    ...Yf
  ]), Xo = Ct({}, [...Es, ...Hf]), _c = function(b, P, G) {
    return P.namespaceURI === ye ? b === "svg" : P.namespaceURI === Pn ? b === "svg" && (G === "annotation-xml" || Br[G]) : !!zo[b];
  }, Sc = function(b, P, G) {
    return P.namespaceURI === ye ? b === "math" : P.namespaceURI === On ? b === "math" && Nr[G] : !!Xo[b];
  }, Rc = function(b, P, G) {
    return P.namespaceURI === On && !Nr[G] || P.namespaceURI === Pn && !Br[G] ? !1 : !Xo[b] && (Ec[b] || !zo[b]);
  }, kc = function(b) {
    const P = x(b), G = $e(T(b)), z = I(b);
    let q, it;
    return z && w(z) === Mt.element ? (q = { namespaceURI: x(z) }, it = $e(T(z))) : (q = { namespaceURI: fi }, it = "template"), Dr[P] ? P === On ? _c(G, q, it) : P === Pn ? Sc(G, q, it) : P === ye ? Rc(G, q, it) : !!(tn === "application/xhtml+xml" && Dr[P]) : !1;
  }, Ge = function(b) {
    gn(t.removed, { element: b });
    try {
      I(b).removeChild(b);
    } catch {
      if (p(b), !I(b)) throw Oe("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, Uo = function(b, P, G) {
    try {
      m(b, P);
    } catch {
      try {
        b.removeAttribute(G);
      } catch {
      }
    }
  }, jr = function(b) {
    zr(b);
    const P = h(b);
    P && Pe(Ff(P), (z) => {
      try {
        p(z);
      } catch {
      }
    });
    const G = w(b) === Mt.element ? E(b) : null;
    if (G) for (let z = G.length - 1; z >= 0; --z) {
      const q = G[z], it = q && q.name;
      typeof it == "string" && Uo(b, q, it);
    }
  }, pi = function(b, P, G) {
    if (!G) try {
      G = P.getAttributeNode(b);
    } catch {
      G = null;
    }
    gn(t.removed, {
      attribute: G || null,
      from: P
    });
    try {
      G ? m(P, G) : P.removeAttribute(b);
    } catch {
      try {
        P.removeAttribute(b);
      } catch {
      }
    }
    if (b === "is")
      if (se || me) try {
        Ge(P);
      } catch {
      }
      else try {
        P.setAttribute(b, "");
      } catch {
      }
  }, Zo = function(b) {
    const P = E(b);
    if (P)
      for (let G = P.length - 1; G >= 0; --G) {
        const z = P[G], q = z && z.name;
        typeof q != "string" || N[Tt(q)] || Uo(b, z, q);
      }
  }, Gr = function(b, P) {
    let G = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
    const z = [b];
    for (; z.length > 0; ) {
      const q = z.pop();
      if (P(q) === !1) continue;
      if (G && w(q) === Mt.element) {
        const lt = d(q);
        ze(lt) && z.push(lt);
      }
      const it = h(q);
      if (it) for (let lt = it.length - 1; lt >= 0; --lt) z.push(it[lt]);
    }
  }, zr = function(b) {
    Gr(b, (P) => {
      w(P) === Mt.element && Zo(P);
    });
  }, Xr = function(b) {
    const P = [];
    return Gr(b, (G) => {
      P.push(G);
    }, !0), P;
  }, Pc = function(b, P) {
    const G = ms();
    Pe(Xr(b), (z) => {
      w(z) === Mt.element && ys(G, z);
    }), Pe(P, (z) => {
      w(z) === Mt.element && !cn(G, z) && Zo(z);
    });
  }, Wo = function(b, P) {
    let G = !1;
    return Pe(t.removed, (z) => {
      z.element && (G = G || z.element === b, zr(z.element));
    }), Pc(b, P), G;
  }, Oc = 8, Lc = function(b, P) {
    const G = Rt;
    let z = null;
    const q = () => (z || (z = ms(), Pe(P, (it) => {
      ys(z, it);
    })), z);
    for (let it = 0; ; it++) {
      const lt = Xr(b), kt = [b];
      let ve = !1;
      if (Pe(lt, (Yt) => {
        w(Yt) === Mt.documentFragment ? gn(kt, Yt) : !ve && !cn(G, Yt) && (ve = cn(q(), Yt));
      }), !ve) return;
      if (it >= Oc) throw Oe("the tree kept changing during in-place sanitization; refusing to return it");
      Pe(kt, (Yt, $t) => {
        Dc(Yt, $t > 0, b, q());
      });
    }
  }, Dc = function(b, P, G, z) {
    const q = Ur(b);
    let it;
    for (; it = q.nextNode(); )
      !cn(z, it) || cn(Rt, it) || (P && fe(tt.uponSanitizeShadowNode, it, null), Wr(it, G), Vr(it, G), ze(it.content) && nn(it.content));
  }, Bc = function(b) {
    Rt && ys(Rt, b);
  }, Vo = function(b, P) {
    return _e ? b === "patchsrc" ? !0 : b === "for" && P !== "label" && P !== "output" : !1;
  }, Nc = function(b) {
    _e && Gr(b, (P) => {
      const G = w(P);
      if (G === Mt.processingInstruction || G === Mt.comment && Dt(SA, P.data)) {
        try {
          p(P);
        } catch {
        }
        return !1;
      }
      if (G === Mt.element) {
        const z = P, q = Tt(T(P));
        try {
          z.hasAttribute && z.hasAttribute("patchsrc") && z.removeAttribute("patchsrc"), z.hasAttribute && z.hasAttribute("for") && Vo("for", q) && z.removeAttribute("for");
        } catch {
        }
      }
      return !0;
    });
  }, Yo = function(b) {
    let P = null, G = null;
    if ($i) b = "<remove></remove>" + b;
    else {
      const it = yA(b, /^[\r\n\t ]+/);
      G = it && it[0];
    }
    tn === "application/xhtml+xml" && fi === ye && (b = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + b + "</body></html>");
    const z = _ ? R(b) : b;
    if (fi === ye) try {
      P = new g().parseFromString(z, tn);
    } catch {
    }
    if (!P || !P.documentElement) {
      P = Z.createDocument(fi, "template", null);
      try {
        P.documentElement.innerHTML = Lr ? S : z;
      } catch {
      }
    }
    const q = P.body || P.documentElement;
    return b && G && q.insertBefore(e.createTextNode(G), q.childNodes[0] || null), fi === ye ? rt.call(P, Se ? "html" : "body")[0] : Se ? P.documentElement : q;
  }, Ur = function(b) {
    const P = y ? y(b) : b.ownerDocument;
    return W.call(P || b, b, A.SHOW_ELEMENT | A.SHOW_COMMENT | A.SHOW_TEXT | A.SHOW_PROCESSING_INSTRUCTION | A.SHOW_CDATA_SECTION, null);
  }, Ln = function(b) {
    return b = ln(b, ut, " "), b = ln(b, at, " "), b = ln(b, H, " "), b;
  }, Zr = function(b) {
    var P;
    Ho(b);
    const G = (P = b.querySelectorAll) === null || P === void 0 ? void 0 : P.call(b, "template");
    G && Pe(G, (z) => {
      ze(z.content) && Zr(z.content);
    });
  }, Ho = function(b) {
    b.normalize();
    const P = y ? y(b) : b.ownerDocument, G = W.call(P || b, b, A.SHOW_TEXT | A.SHOW_COMMENT | A.SHOW_CDATA_SECTION | A.SHOW_PROCESSING_INSTRUCTION, null);
    let z = G.nextNode();
    for (; z; )
      z.data = Ln(z.data), z = G.nextNode();
  }, Dn = function(b) {
    const P = f ? f(b) : null;
    return typeof P != "string" || Tt(P) !== "form" ? !1 : typeof b.nodeName != "string" || typeof b.textContent != "string" || typeof b.removeChild != "function" || b.attributes !== E(b) || typeof b.removeAttribute != "function" || typeof b.removeAttributeNode != "function" || typeof b.getAttributeNode != "function" || typeof b.setAttribute != "function" || typeof b.namespaceURI != "string" || typeof b.insertBefore != "function" || typeof b.hasChildNodes != "function" || b.nodeType !== v(b) || b.childNodes !== h(b);
  }, ze = function(b) {
    if (!v || typeof b != "object" || b === null) return !1;
    try {
      return v(b) === Mt.documentFragment;
    } catch {
      return !1;
    }
  }, en = function(b) {
    if (!v || typeof b != "object" || b === null) return !1;
    try {
      return typeof v(b) == "number";
    } catch {
      return !1;
    }
  };
  function fe(U, b, P) {
    U.length !== 0 && Pe(U, (G) => {
      G.call(t, b, P, di);
    });
  }
  const Fc = function(b, P) {
    return !!(_e && b.hasChildNodes() && !en(b.firstElementChild) && Dt(Ts, b.textContent) && Dt(Ts, b.innerHTML) || _e && sd[P] && w(b) === Mt.element && x(b) === ye && (en(b.firstElementChild) || typeof b.textContent == "string" && Dt(Ts, b.textContent)) || b.nodeType === Mt.processingInstruction || _e && b.nodeType === Mt.comment && Dt(SA, b.data));
  }, Bn = function(b, P) {
    if (b instanceof RegExp) return Dt(b, P);
    if (b instanceof Function) {
      for (var G = arguments.length, z = new Array(G > 2 ? G - 2 : 0), q = 2; q < G; q++) z[q - 2] = arguments[q];
      return !!b(P, ...z);
    }
    return !1;
  }, jc = function(b, P, G) {
    if (!ot[P] && Jo(P) && Bn(Y.tagNameCheck, P)) return !1;
    if (ft && !Re[P] && !Re[$e(P)]) {
      const z = I(b), q = h(b);
      if (q && z) {
        const it = q.length;
        for (let lt = it - 1; lt >= 0; --lt) {
          const kt = b === G ? C(q[lt], !0) : q[lt];
          z.insertBefore(kt, l(b));
        }
      }
    }
    return Ge(b), !0;
  }, Qo = function(b, P, G, z) {
    return b.length === 0 ? P : P === G || P === z ? oe(P) : P;
  }, mi = function(b, P) {
    return b === P || I(b) !== null ? !1 : (Et && zr(b), !0);
  }, Wr = function(b, P) {
    if (Bc(b), fe(tt.beforeSanitizeElements, b, null), mi(b, P)) return !0;
    if (Dn(b))
      return Ge(b), !0;
    const G = Tt(T(b));
    if (dt = Qo(tt.uponSanitizeElement, dt, O, Ii), fe(tt.uponSanitizeElement, b, {
      tagName: G,
      allowedTags: dt
    }), mi(b, P)) return !0;
    if (Fc(b, G))
      return Ge(b), !0;
    if (ot[G] || !(gt.tagCheck instanceof Function && gt.tagCheck(G)) && !dt[G]) {
      const z = jc(b, G, P);
      return z === !1 && (fe(tt.afterSanitizeElements, b, null), mi(b, P)) ? !0 : z;
    }
    if (w(b) === Mt.element && !kc(b) || (G === "noscript" || G === "noembed" || G === "noframes") && Dt(rd, b.innerHTML))
      return Ge(b), !0;
    if (Ce && b.nodeType === Mt.text) {
      const z = Ln(b.textContent);
      b.textContent !== z && (gn(t.removed, { element: b.cloneNode() }), b.textContent = z);
    }
    return fe(tt.afterSanitizeElements, b, null), mi(b, P);
  }, Ko = function(b, P, G) {
    if (et[P] || Vo(P, b) || $ && (P === "id" || P === "name") && (G in e || G in Mc)) return !1;
    const z = N[P] || gt.attributeCheck instanceof Function && gt.attributeCheck(P, b);
    return bt && Dt(Q, P) || At && Dt(K, P) ? !0 : z ? Ci[P] || Dt(vt, ln(G, zt, "")) || (P === "src" || P === "xlink:href" || P === "href") && b !== "script" && vA(G, "data:") === 0 && Rn[b] || St && !Dt(yt, ln(G, zt, "")) ? !0 : !G : Jo(b) && Bn(Y.tagNameCheck, b) && Bn(Y.attributeNameCheck, P, b) || P === "is" && Y.allowCustomizedBuiltInElements && Bn(Y.tagNameCheck, G);
  }, Gc = Ct({}, [
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "missing-glyph"
  ]), Jo = function(b) {
    return !Gc[$e(b)] && Dt(ce, b);
  }, zc = function(b, P, G, z) {
    if (_ && typeof c == "object" && typeof c.getAttributeType == "function" && !G) switch (c.getAttributeType(b, P)) {
      case "TrustedHTML":
        return R(z);
      case "TrustedScriptURL":
        return B(z);
    }
    return z;
  }, Xc = function(b, P, G, z) {
    try {
      return G ? b.setAttributeNS(G, P, z) : b.setAttribute(P, z), Dn(b) ? (Ge(b), !1) : !0;
    } catch {
      return pi(P, b), !1;
    }
  }, qo = function(b, P) {
    return _e && Dt(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, P) ? !0 : $e(b) === "attributename" && yA(P, "href") !== null;
  }, Vr = function(b, P) {
    if (fe(tt.beforeSanitizeAttributes, b, null), mi(b, P)) return;
    const G = b.attributes;
    if (!G || Dn(b)) return;
    N = Qo(tt.uponSanitizeAttribute, N, V, je);
    const z = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: N,
      forceKeepAttr: void 0
    };
    let q = G.length;
    const it = Tt(b.nodeName);
    for (; q--; ) {
      const lt = G[q], kt = lt.name, ve = lt.namespaceURI, Yt = lt.value, $t = Tt(kt), yi = Yt;
      let te = kt === "value" ? yi : Gf(yi), $o = !1;
      if (z.attrName = $t, z.attrValue = te, z.keepAttr = !0, z.forceKeepAttr = void 0, fe(tt.uponSanitizeAttribute, b, z), te = z.attrValue, It && ($t === "id" || $t === "name") && vA(te, ct) !== 0 && (pi(kt, b, lt), te = ct + te, $o = !0), qo(kt, te)) {
        pi(kt, b, lt);
        continue;
      }
      if (!z.forceKeepAttr) {
        if (!z.keepAttr) {
          pi(kt, b, lt);
          continue;
        }
        if (!Vt && Dt(RA, te)) {
          pi(kt, b, lt);
          continue;
        }
        if (Ce && (te = Ln(te)), !Ko(it, $t, te)) {
          pi(kt, b, lt);
          continue;
        }
        te = zc(it, $t, ve, te), te !== yi && Xc(b, kt, ve, te) && $o && mA(t.removed);
      }
    }
    fe(tt.afterSanitizeAttributes, b, null), mi(b, P);
  }, nn = function(b) {
    let P = null;
    const G = Ur(b);
    for (fe(tt.beforeSanitizeShadowDOM, b, null); P = G.nextNode(); )
      if (fe(tt.uponSanitizeShadowNode, P, null), Wr(P, b), Vr(P, b), ze(P.content) && nn(P.content), w(P) === Mt.element) {
        const z = d(P);
        ze(z) && (Yr(z), nn(z));
      }
    Ce && Ho(b), fe(tt.afterSanitizeShadowDOM, b, null);
  }, Yr = function(b) {
    const P = [{
      node: b,
      shadow: null
    }];
    for (; P.length > 0; ) {
      const G = P.pop();
      if (G.shadow) {
        nn(G.shadow);
        continue;
      }
      const z = G.node, q = w(z) === Mt.element, it = h(z);
      if (it) for (let lt = it.length - 1; lt >= 0; --lt) P.push({
        node: it[lt],
        shadow: null
      });
      if (q) {
        const lt = f ? f(z) : null;
        if (typeof lt == "string" && Tt(lt) === "template") {
          const kt = z.content;
          ze(kt) && P.push({
            node: kt,
            shadow: null
          });
        }
      }
      if (q) {
        const lt = d(z);
        ze(lt) && P.push({
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
    let b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, P = null, G = null, z = null, q = null;
    if (Lr = !U, Lr && (U = "<!-->"), typeof U != "string" && !en(U) && (U = Zf(U), typeof U != "string"))
      throw Oe("dirty is not a string, aborting");
    if (!t.isSupported) return U;
    qi ? (dt = Ii, N = je) : Fr(b), (tt.uponSanitizeElement.length > 0 || tt.uponSanitizeAttribute.length > 0) && (dt = oe(dt)), tt.uponSanitizeAttribute.length > 0 && (N = oe(N)), t.removed = [];
    const it = Et && typeof U != "string" && en(U);
    let lt = [];
    const kt = Rt;
    if (it) {
      Nc(U);
      const $t = T(U);
      if (typeof $t == "string") {
        const yi = Tt($t);
        if (!dt[yi] || ot[yi])
          throw jr(U), Oe("root node is forbidden and cannot be sanitized in-place");
      }
      if (Dn(U))
        throw jr(U), Oe("root node is clobbered and cannot be sanitized in-place");
      lt = Xr(U), Rt = ms();
    } else if (en(U))
      P = Yo("<!---->"), G = P.ownerDocument.importNode(U, !0), G.nodeType === Mt.element && G.nodeName === "BODY" || G.nodeName === "HTML" ? P = G : P.appendChild(G), Yr(P);
    else {
      if (!se && !Ce && !Se && U.indexOf("<") === -1) return _ && J ? R(U) : U;
      if (P = Yo(U), !P) return se ? null : J ? S : "";
    }
    P && $i && Ge(P.firstChild);
    const ve = it ? U : P;
    try {
      it && Yr(U);
      const $t = Ur(ve);
      for (; z = $t.nextNode(); )
        Wr(z, ve), Vr(z, ve), ze(z.content) && nn(z.content);
      it && Lc(U, lt);
    } catch ($t) {
      throw it && (jr(U), Wo(U, lt)), $t;
    } finally {
      Rt = kt;
    }
    if (it) {
      if (Wo(U, lt)) throw Oe("a node selected for removal could not be safely returned; refusing to sanitize in place");
      return Ce && Zr(U), U;
    }
    if (se) {
      if (Ce && Zr(P), me)
        for (q = nt.call(P.ownerDocument); P.firstChild; ) q.appendChild(P.firstChild);
      else q = P;
      return (N.shadowroot || N.shadowrootmode) && (q = st.call(n, q, !0)), q;
    }
    let Yt = Se ? P.outerHTML : P.innerHTML;
    return Se && dt["!doctype"] && P.ownerDocument && P.ownerDocument.doctype && P.ownerDocument.doctype.name && Dt(id, P.ownerDocument.doctype.name) && (Yt = "<!DOCTYPE " + P.ownerDocument.doctype.name + `>
` + Yt), Ce && (Yt = Ln(Yt)), _ && J ? R(Yt) : Yt;
  }, t.setConfig = function() {
    let U = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    Fr(U), qi = !0, Ii = dt, je = N;
  }, t.clearConfig = function() {
    di = null, qi = !1, Ii = null, je = null, _ = L, S = "";
  }, t.isValidAttribute = function(U, b, P) {
    di || Fr({});
    const G = Tt(U), z = Tt(b);
    return typeof P == "string" && (qo(b, P) || !Vt && Dt(RA, P)) ? !1 : Ko(G, z, P);
  }, t.addHook = function(U, b) {
    typeof b == "function" && ee(tt, U) && gn(tt[U], b);
  }, t.removeHook = function(U, b) {
    if (ee(tt, U)) {
      if (b !== void 0) {
        const P = Nf(tt[U], b);
        return P === -1 ? void 0 : jf(tt[U], P, 1)[0];
      }
      return mA(tt[U]);
    }
  }, t.removeHooks = function(U) {
    ee(tt, U) && (tt[U] = []);
  }, t.removeAllHooks = function() {
    tt = kA();
  }, t;
}
var fc = Cc();
const Ad = ["b", "strong", "i", "em", "u", "s", "br", "p", "span", "div", "ul", "ol", "li", "a", "img", "small", "sub", "sup", "code", "pre", "table", "thead", "tbody", "tr", "th", "td", "qy-swiper", "qy-swiper-slide"], gd = ["href", "src", "alt", "title", "class", "target", "rel", "width", "height"], cd = { values: ["target", "rel", "width", "height"] }, ld = ["script", "style", "iframe", "object", "embed", "form", "input", "textarea", "link", "meta", "base"], ud = ["srcdoc", "style", "formaction", "xlink:href"], hd = { valueAttributes: ["image-url", "image-type", "thumbnail-url", "caption", "material-url", "camera-position", "camera-target", "show-texture"], booleanAttributes: ["fit-to-container", "debug-mode"], urlAttributes: ["image-url", "thumbnail-url", "material-url"], textAttributes: { values: ["caption"] } }, Id = { booleanAttributes: ["has-thumb", "autoplay"] }, Cd = { tags: ["a", "b", "br", "i", "p", "small", "span", "sub", "sup"], attributes: ["href"], forbidContents: { tags: ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "selectedcontent", "style", "svg", "template", "title", "video", "xmp"] } }, ge = {
  tags: Ad,
  attributes: gd,
  uriSafeAttributes: cd,
  forbidTags: ld,
  forbidAttributes: ud,
  slide: hd,
  swiper: Id,
  iiif: Cd
}, fd = ge.tags, dd = ge.attributes, pd = /^(?:https?|mailto|tel|data):/i, md = ge.uriSafeAttributes.values, yd = ge.forbidTags, vd = ge.forbidAttributes, wd = ge.iiif.tags, bd = ge.iiif.attributes, Ed = /^https?:/i, xd = ge.iiif.forbidContents.tags;
let sr;
const Td = /^data:image\/(png|jpeg|gif|webp|avif);/i, PA = (i) => !!i && /^\s*data:/i.test(i);
function Md(i) {
  if (i.tagName === "A" && i.getAttribute("target") === "_blank" && i.setAttribute("rel", "noopener noreferrer"), sr === "iiif" && i.tagName === "A" && i.hasAttribute("href") && (i.setAttribute("target", "_blank"), i.setAttribute("rel", "noopener noreferrer")), i.tagName === "IMG") {
    const e = i.getAttribute("src");
    PA(e) && !Td.test(e.trim()) && i.removeAttribute("src"), i.hasAttribute("srcset") && i.removeAttribute("srcset");
  } else
    for (const e of ["src", "href", "xlink:href"])
      PA(i.getAttribute(e)) && i.removeAttribute(e);
}
let Ri;
function _d() {
  if (Ri) return Ri;
  const i = globalThis.window;
  if (!i)
    throw new Error(
      "sanitizeHtml: window の無い環境では使用できません（DOMPurify の初期化に必要）"
    );
  return Ri = fc(i), Ri.addHook("afterSanitizeAttributes", Md), Ri.addHook("uponSanitizeAttribute", Rd), Ri;
}
let $n;
function Sd() {
  if ($n) return $n;
  const i = globalThis.window;
  if (!i)
    throw new Error(
      "sanitizeHtml: window の無い環境では使用できません（DOMPurify の初期化に必要）"
    );
  return $n = fc(i), $n;
}
function Rd(i, t) {
  const e = i.nodeName.toLowerCase(), n = t.attrName;
  if (e === "qy-swiper-slide") {
    const r = Do.has(n) ? "" : pc(n, t.attrValue);
    if (r === null) {
      t.keepAttr = !1;
      return;
    }
    i.setAttribute(n, r), t.forceKeepAttr = !0;
    return;
  }
  e === "qy-swiper" && (Ld.has(n) ? (i.setAttribute(n, ""), t.forceKeepAttr = !0) : t.keepAttr = !1);
}
function dc(i, t) {
  if (i == null) return "";
  const e = t?.profile === "iiif", n = sr;
  sr = e ? "iiif" : void 0;
  try {
    return _d().sanitize(String(i), {
      ALLOWED_TAGS: e ? wd : fd,
      ALLOWED_ATTR: e ? bd : dd,
      ALLOWED_URI_REGEXP: e ? Ed : pd,
      ADD_URI_SAFE_ATTR: md,
      FORBID_TAGS: yd,
      FORBID_ATTR: vd,
      ALLOW_DATA_ATTR: !1,
      // aria-* も許可表の外に出さない（IIIF の値で残す属性は href だけ）
      ALLOW_ARIA_ATTR: !e,
      // 禁止タグを落としても中身のテキストは残す（実データの可読性を保つ）
      KEEP_CONTENT: !0,
      // profile: "iiif" のときだけ、文字も捨てる要素の一覧を差し替える
      ...e ? { FORBID_CONTENTS: xd } : {}
    });
  } finally {
    sr = n;
  }
}
function kd(i) {
  return i == null ? "" : String(i).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function Pd(i) {
  if (i == null) return "";
  const t = Sd().sanitize(String(i), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: !0
  }), e = globalThis.window.document.createElement("div");
  return e.innerHTML = t, e.textContent || "";
}
const Od = new Set(ge.slide.valueAttributes), Do = new Set(ge.slide.booleanAttributes), Ld = new Set(ge.swiper.booleanAttributes), Dd = new Set(ge.slide.textAttributes.values), Bd = new Set(ge.slide.urlAttributes), Nd = (i) => /^(?:https?:)?\/\/|^\/|^[^:]*$/i.test(i.trim()), Fd = /["'`<>\s]/;
function pc(i, t) {
  if (Do.has(i)) return t ? "" : null;
  if (!Od.has(i) || t == null) return null;
  let e = String(t);
  return Bd.has(i) && (!Nd(e) || Fd.test(e)) ? null : (Dd.has(i) && (e = Pd(e)), e);
}
function Ip(i) {
  const t = [];
  for (const [e, n] of Object.entries(i || {})) {
    const r = String(e).toLowerCase(), s = pc(r, n);
    s !== null && t.push(Do.has(r) ? r : `${r}="${kd(s)}"`);
  }
  return t.join(" ");
}
const jd = 125, OA = "Google Maps";
function wr(i) {
  return typeof i.googleMapType == "string" && i.googleMapType !== "";
}
function LA(i) {
  for (const t of i) {
    const e = t.googleMapType;
    if (!(typeof e != "string" || !e))
      return e === "satellite" ? "dark" : "light";
  }
}
function DA(i) {
  return i > 0 && i < jd ? "text" : "logo";
}
function mc(i, t) {
  if (i == null) return;
  if (typeof i == "string") return i.trim() ? i : void 0;
  if (typeof i != "object") return String(i);
  let e, n;
  for (const [r, s] of Object.entries(i))
    if (!(typeof s != "string" || !s.trim())) {
      if (r === t) return s;
      r === "en" && n === void 0 && (n = s), e === void 0 && (e = s);
    }
  return n ?? e;
}
function _s(i) {
  const t = i.toLowerCase();
  return t === "zh-hk" || t === "zh-hant" ? "zh-TW" : i;
}
function Bo(i, t) {
  let e = i;
  for (; e; ) {
    const n = e.closest(t);
    if (n) return n;
    const r = e.getRootNode?.();
    e = r && "host" in r ? r.host : null;
  }
  return null;
}
function Gd(i) {
  return Bo(i, '[lang]:not([lang=""])')?.getAttribute("lang") || void 0;
}
function zd(i, t, e) {
  const n = Bo(i, nr);
  if (n) {
    let s;
    try {
      s = n.currentLang;
    } catch {
      s = void 0;
    }
    if (typeof s == "string" && s) return _s(s);
  }
  const r = [
    i?.getAttribute("lang"),
    n?.getAttribute("lang"),
    t,
    e,
    Gd(i)
  ];
  for (const s of r)
    if (typeof s == "string" && s) return _s(s);
  return _s(cf() || "en");
}
function Xd(i) {
  const t = [], e = (n) => {
    !n || t.includes(n) || typeof n.isWmts == "function" && !n.isWmts() || t.push(n);
  };
  return e(i.front), e(i.overlay), e(i.back), t;
}
function Ud(i) {
  if (wr(i)) return "google";
  if (i instanceof gc) return "tilejson";
}
function Zd(i) {
  if (!(i instanceof gc)) return;
  const t = i.getTileJSON()?.attribution;
  return typeof t == "string" && t.trim() ? t.trim() : void 0;
}
function Wd(i) {
  const t = typeof i.get == "function" ? i.get("attr") : void 0;
  return mc(t, "en") !== void 0;
}
function Vd(i) {
  return (Array.isArray(i) ? i : [i]).filter((e) => typeof e == "string" && e.trim() !== "").map((e) => e.trim());
}
const tr = 2;
function Yd(i) {
  const t = document.createElement("template");
  return t.innerHTML = i, t.content;
}
function yc(i) {
  return (Yd(i).textContent ?? "").replace(/\s+/g, " ").trim();
}
function vc(i) {
  return i.map((t) => dc(t, { profile: "iiif" }).trim()).filter((t) => t !== "");
}
function wc(i, t) {
  const e = typeof i.get == "function" ? i.get("attr") : void 0, n = mc(e, t)?.trim();
  if (!n) return [];
  const r = dc(n);
  return [{ text: n, html: r, key: yc(r) || r }];
}
function qs(i, t) {
  const e = [];
  for (const n of t?.get(i) ?? []) {
    const [r] = vc([n.trim()]);
    r && e.push({ text: n.trim(), html: r, key: yc(r) || r });
  }
  return e;
}
function $s(i, t, e) {
  const n = wc(i, t);
  return wr(i) ? [...qs(i, e), ...n] : n.length > 0 ? n : qs(i, e);
}
function or(i, t) {
  const e = [];
  for (const n of i)
    for (const r of n)
      t.has(r.key) || (t.add(r.key), e.push(r));
  return e;
}
function Hd(i, t, e, n = []) {
  const r = i.filter((c) => !n.includes(c)), s = i.filter((c) => n.includes(c)), o = /* @__PURE__ */ new Set(), a = or(
    r.filter(wr).map((c) => qs(c, e)),
    o
  ), A = or(
    r.map((c) => wr(c) ? wc(c, t) : $s(c, t, e)),
    o
  ), g = or(
    s.map((c) => $s(c, t, e)),
    o
  );
  return { google: a, base: A, overlay: g };
}
function Qd(i, t, e) {
  return or(
    i.map((n) => $s(n, t, e)),
    /* @__PURE__ */ new Set()
  ).map((n) => n.text);
}
const BA = "maplat-attribution-style", Kd = `
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
  -webkit-line-clamp: ${tr};
  line-clamp: ${tr};
  max-width: 100%;
  /* 行の高さ × 行数 ＋ 上下の余白（.maplat-attribution-text の padding 1px ずつ）。幅も余白込みで地図の箱まで */
  box-sizing: border-box;
  max-height: calc(${tr} * 1.4em + 2px);
  overflow: hidden;
}
.maplat-attribution-clamp img {
  max-width: 100%;
  max-height: calc(${tr} * 1.4em);
  object-fit: contain;
  vertical-align: bottom;
}
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
function Jd(i) {
  if (i.getElementById(BA)) return;
  const t = i.createElement("style");
  t.id = BA, t.textContent = Kd, (i.head || i.documentElement).appendChild(t);
}
class qd {
  element;
  #e;
  #s;
  #t = [];
  // #sources のうち重ね地図のもの（別の箱に出す）
  #o = [];
  // 地図の設定の attr が無い source（と Google の地図）の、提供元の申告として読んだ出典（元の値）。
  // 読むのは providerAttributionKind が決まる source だけ（ライブラリの既定値は読まない）。
  // 外の値なので、描くときに狭い許可表で洗う（sanitizeSourceAttributions）
  #n = /* @__PURE__ */ new Map();
  #r = null;
  #i = null;
  #a = !1;
  constructor(t, e) {
    this.#e = t, this.#s = e;
    const n = t.ownerDocument;
    Jd(n);
    const r = n.createElement("div");
    r.className = "maplat-attribution", r.hidden = !0, this.element = r, t.appendChild(r), this.#I(), this.#h(), this.#u();
  }
  /** 今出している Google Maps の表示（ロゴか文字）。Google の地図が無ければ undefined（試験と診断用）。 */
  get googleAttribution() {
    const t = this.element.dataset.googleMaps;
    return t === "logo" || t === "text" ? t : void 0;
  }
  /** 今の言語で出典の文字列を返す（試験と診断用）。 */
  get texts() {
    return Qd(this.#t, this.#s(), this.#n);
  }
  /**
   * 表示する source を差し替えて描き直す。overlays は sources のうち重ね地図のもの（背景地図と別の箱に出す）。
   */
  update(t, e = []) {
    if (!this.#a) {
      this.#t = t.slice(), this.#o = e.filter((n) => this.#t.includes(n));
      for (const n of [...this.#n.keys()])
        this.#t.includes(n) || this.#n.delete(n);
      this.render();
    }
  }
  /**
   * 地図の設定の attr が無い source の、提供元の申告の出典を、OpenLayers の source（getAttributions）から読む。
   * 提供元の申告でない source（providerAttributionKind が undefined）は読まない（ライブラリの既定値で埋めない）。
   * 地図の描画（postrender）のたびに、その地図が描いている source と frameState を渡す。
   * Google の source は表示範囲が変わったときだけ取りに行き、それ以外は前の値を返す（OpenLayers の実装）。
   */
  refreshDynamic(t, e) {
    if (!this.#a)
      for (const n of t) {
        if (!n || !this.#t.includes(n)) continue;
        const r = Ud(n);
        if (!r || Wd(n) && r !== "google") continue;
        const s = typeof n.getAttributions == "function" ? n.getAttributions() : void 0;
        if (typeof s != "function") continue;
        let o;
        try {
          o = s(e);
        } catch {
          continue;
        }
        Promise.resolve(o).then(
          (a) => {
            let A = Vd(a);
            if (r === "tilejson") {
              const g = Zd(n);
              A = A.filter((c) => c === g);
            }
            this.#c(n, A);
          },
          () => {
          }
          // 取りに行けなかったときは前の値のまま
        );
      }
  }
  #c(t, e) {
    if (this.#a || !this.#t.includes(t) || vc(e).length === 0) return;
    const n = this.#n.get(t);
    n && n.length === e.length && n.every((r, s) => r === e[s]) || (this.#n.set(t, e), this.render());
  }
  /** 今の source と言語で描き直す。 */
  render() {
    if (this.#a) return;
    const t = this.element;
    t.parentNode !== this.#e && this.#e.appendChild(t);
    const e = t.ownerDocument, n = LA(this.#t), r = n ? DA(this.#g()) : void 0, { google: s, base: o, overlay: a } = Hd(
      this.#t,
      this.#s(),
      this.#n,
      this.#o
    ), A = [];
    for (const [g, c] of [
      [a, "overlay"],
      [o, "base"]
    ]) {
      const u = this.#A(g);
      u && (u.classList.add("maplat-attribution-clamp", `maplat-attribution-${c}`), A.push(u));
    }
    if (n) {
      const g = e.createElement("span");
      g.className = "maplat-attribution-google", r === "logo" && g.appendChild(this.#l(n));
      const c = this.#A(s, r === "text");
      c && g.appendChild(c), A.push(g);
    }
    A.slice(0, -1).forEach((g) => g.classList.add("maplat-attribution-stacked")), t.replaceChildren(...A), r ? t.dataset.googleMaps = r : delete t.dataset.googleMaps, t.hidden = A.length === 0;
  }
  /** Google Maps のロゴ（公式の SVG。読み上げは "Google Maps"）。 */
  #l(t) {
    const n = this.element.ownerDocument.createElement("span");
    return n.className = "maplat-attribution-google-logo", n.dataset.variant = t, n.setAttribute("role", "img"), n.setAttribute("aria-label", OA), n.innerHTML = t === "dark" ? uf : lf, n.firstElementChild?.setAttribute("aria-hidden", "true"), n.firstElementChild?.setAttribute("focusable", "false"), n;
  }
  /**
   * 出典を " | " で区切って並べた箱（出すものが無ければ null）。
   * googleText が true なら、先頭に文字 "Google Maps"（ロゴの代わり）を入れる。
   */
  #A(t, e = !1) {
    if (t.length === 0 && !e) return null;
    const n = this.element.ownerDocument, r = n.createElement("span");
    r.className = "maplat-attribution-text";
    const s = [];
    if (e) {
      const o = n.createElement("span");
      o.className = "maplat-attribution-item maplat-attribution-google-text", o.textContent = OA, s.push(o);
    }
    for (const o of t) {
      const a = n.createElement("span");
      a.className = "maplat-attribution-item", a.innerHTML = o.html, s.push(a);
    }
    return s.forEach((o, a) => {
      if (a > 0) {
        const A = n.createElement("span");
        A.className = "maplat-attribution-sep", A.setAttribute("aria-hidden", "true"), A.textContent = " | ", r.appendChild(A);
      }
      r.appendChild(o);
    }), r;
  }
  /**
   * 出典の表示に使える幅（px）。箱に一時的に width: 100% を当て、右の位置と max-width の変数が
   * 効いた結果の幅を測る。レイアウトが無い（非表示の入れ物・jsdom）ときは 0。
   */
  #g() {
    const t = this.element, { width: e, display: n } = t.style, r = t.hidden;
    t.hidden = !1, t.style.width = "100%", t.style.display = "block";
    const s = t.getBoundingClientRect().width;
    return t.style.width = e, t.style.display = n, t.hidden = r, s;
  }
  /** 表示を外し、言語の監視をやめる。 */
  dispose() {
    this.#a || (this.#a = !0, this.#r?.disconnect(), this.#r = null, this.#i?.disconnect(), this.#i = null, this.#t = [], this.#o = [], this.#n.clear(), this.element.remove());
  }
  /**
   * 地図が <maplat-ui> の中にあり、その要素がまだ定義されていないときは、定義を待って一度だけ描き直す
   * （定義の前は currentLang が無く、仮の順で言語を選んでいるため）。破棄の後は描かない。
   */
  #u() {
    typeof customElements > "u" || customElements.get(nr) || Bo(this.#e, nr) && customElements.whenDefined(nr).then(
      () => this.render(),
      () => {
      }
    );
  }
  /**
   * 地図の箱の大きさが変わったら、Google の地図を出しているときだけ、ロゴと文字のどちらにするかを決め直す
   * （変わるときだけ描き直す）。
   */
  #h() {
    typeof ResizeObserver > "u" || (this.#i = new ResizeObserver(() => {
      if (this.#a || !LA(this.#t)) return;
      DA(this.#g()) !== this.googleAttribution && this.render();
    }), this.#i.observe(this.#e));
  }
  #I() {
    if (typeof MutationObserver > "u") return;
    this.#r = new MutationObserver(() => this.render());
    const t = { attributes: !0, attributeFilter: ["lang"], subtree: !0 }, e = this.#e.getRootNode?.();
    e && e.nodeType === 11 && this.#r.observe(e, t);
    const n = this.#e.ownerDocument.documentElement;
    n && this.#r.observe(n, t);
  }
}
const $d = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjcyNTIxMjZFMDJBMTExRTBCOTNGRTVBRkM1QzM1Qjc5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjcyNTIxMjZGMDJBMTExRTBCOTNGRTVBRkM1QzM1Qjc5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzI1MjEyNkMwMkExMTFFMEI5M0ZFNUFGQzVDMzVCNzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzI1MjEyNkQwMkExMTFFMEI5M0ZFNUFGQzVDMzVCNzkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4RaveOAAAB1UlEQVR42qzUTyikcRzH8d+OsUNbSOTvgW2LREqjHKSk9FjZxAGXlXJQDsqNokRzcebiRC5mT8tllBE7LlzYKBHFJpKMkD+7hvH+6ftMT4M0Y3/1uswzz+d5nu/3+/t9CAaD6n8uu/L5lHK5XroWjwI4kYWP8GMdv3H47A6nk8CDA6U8nvBLX/Ed+TjDEe7lAS24wE+M4zR0180NgXa7NSgOvajHKvqwZglMxBfUoBmVlv/wTXxU0O1WuoqIgQvLaIJDfn9NISbhRd7Tb4ahbJa3a0QthjCFv2/UfwNduJKv0jUOBSajDb8wE0FTdf1GUAzDGliOdExEMSleedsGxJiBZdiVC5GuABbxGZm2p1lUKg1/dOOjnGf9IglIsUkxY3H+jg1yIc136MBb6WjqOwLNe6904AP2kSuDG80qkW15YjZlCdkojSLsEyqwiWMzcAVbaJV6RrK+IQc/dB3NwGuMohAdEYQVoROz8FkHW68FCW1Hv4zS68eeUnWyS/YwLL1Q9rA/jsn4dEtd5mRo9WlzJ03Tda6S7TaPQWmIPCkQCH+6Ww5RfR5WowmX+IckOca2MYBp2SmW8zCb5hpGeKjuWA8yZEulSbP8sqN2JPjZif0owACin4C7wCjG6AAAAABJRU5ErkJggg==", tp = "data:image/png;base64,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", vn = {
  osm: Kg,
  gsi: Jg,
  gsi_ortho: qg,
  redcircle: $d,
  defaultpin_selected: tp,
  defaultpin: Ng,
  bluedot: Lg,
  bluedot_transparent: Dg,
  bluedot_small: Bg
};
function Cp(i) {
  const t = br(i);
  return [t[0], t[1]];
}
function ep(i = !1) {
  return i ? vn.defaultpin_selected : vn.defaultpin;
}
const Ve = {
  noRotate: !1,
  northUp: !1,
  homeMarginPixels: 50,
  tapDuration: 3e3,
  tapUIVanish: !1,
  debug: !1
};
function er(i, t) {
  return i?.[t] ?? !1;
}
function NA(i, t) {
  const e = i.__selectedMarker == t.namespaceID;
  return t.icon ? e && t.selectedIcon ? t.selectedIcon : t.icon : ep(e);
}
function FA(i, t) {
  if (!t.includes("#")) {
    for (const s of Object.keys(i.pois)) {
      const o = i.pois[s];
      for (const a of o.pois)
        if (a.id === t) return { poi: a, ancestors: [o, i] };
    }
    return;
  }
  const e = t.split("#"), n = xt(i.cacheHash, e[0]);
  if (!n?.pois) return;
  let r;
  for (const s of Object.keys(n.pois)) {
    const o = n.pois[s];
    for (const a of o.pois)
      a.id === e[1] && (r = { poi: a, ancestors: [o, n, i] });
  }
  return r;
}
const ip = {
  "setting-loaded": "onSettingLoaded",
  "appdata-ready": "onAppdataReady",
  "ui-configure": "onUiConfigure",
  "core-dom-ready": "onCoreDomReady",
  "ui-dom-ready": "onUiDomReady",
  "core-ready": "onCoreReady",
  "ui-ready": "onUiReady"
};
class np extends Me {
  detail;
  constructor(t) {
    super("gps_error"), this.detail = t;
  }
}
class hn extends Me {
  detail;
  constructor(t) {
    super("gps_result"), this.detail = t;
  }
}
class rp extends Me {
  constructor() {
    super("gps_request");
  }
}
function ki(i, t) {
  console.warn(
    `MaplatCore: POI layer "${i}" not found (${t}). Pass namespaceID (e.g. "<mapID>#<layerId>" for map-derived layers), not the layer-local id.`
  );
}
let sp = 0;
class wn extends io {
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
  __featureOption(t, e, n) {
    const r = t?.[e];
    if (r != null) return r;
    const s = this.appData?.[e];
    return s == null ? n : !this.__settingFileKeys || this.__settingFileKeys.has(e) ? (this.__featureKeyWarner || (this.__featureKeyWarner = XA()), this.__elementMode ? (this.__featureKeyWarner(
      e,
      `<maplat-app>: the setting file key "${e}" is a presentation (feature) setting and is ignored; give it as an attribute or property of the element instead.`
    ), n) : (this.__featureKeyWarner(
      e,
      `MaplatApp: reading the feature key "${e}" from the setting file is deprecated and will be removed in the next major version; pass it in appOption (or as an attribute of <maplat-app>) instead.`
    ), s)) : s;
  }
  // Maplat App Class
  constructor(t) {
    super(), t = xe(t), t && "__maplatElementMode" in t || Jc(), this.__appid = t.appid || "sample", this.__elementMode = t.__maplatElementMode === !0;
    const e = t.mapboxgl || (typeof window < "u" ? window.mapboxgl : void 0);
    e && t.mapboxToken && (e.accessToken = t.mapboxToken), t.googleApiKey && (this.__googleApiKey = t.googleApiKey);
    const n = t.div;
    n && typeof n == "object" && n.nodeType === 1 ? (this.__mapDivDocument = n, this.__mapDiv = n.id || `maplat_app_${++sp}`) : (this.__mapDiv = n || "map_div", this.__mapDivDocument = document.querySelector(`#${this.__mapDiv}`)), this.mapDivDocument.classList.add("maplat"), this.logger = new ta(
      t.debug ? ii.ALL : ii.INFO
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
            const p = localStorage.getItem(C);
            p !== null && (this.__initialRestore[C] = p);
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
    const o = rn(`<img id="center_circle" class="prevent-default maplat-center-marker" alt=""
            style="position:absolute;top:50%;left:50%;margin-top:-10px;
            margin-left:-10px;" src="${vn.redcircle}">`);
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
    const e = this.__centerMarkerImg;
    if (!e) return;
    const n = t.hidden === !0;
    e.hidden = n, e.style.display = n ? "none" : "", t.src ? (e.setAttribute("src", t.src), e.style.margin = "0", e.style.transform = "translate(-50%, -50%)", e.classList.add("maplat-center-marker--custom")) : (e.setAttribute("src", vn.redcircle), e.style.margin = "-10px 0 0 -10px", e.style.transform = "", e.classList.remove("maplat-center-marker--custom"));
  }
  /**
   * @internal 起動後の機能系キー・テンプレート・icon を当てる。
   * `undefined` は「与えられていない」＝ Core の既定（RUNTIME_DEFAULTS）／設定ファイルの値。
   * キーの有無は `in` で見る（`{ northUp: undefined }` は「外された」を意味する）。
   */
  applyRuntimeOptions(t) {
    const e = this.mapObject;
    "northUp" in t && e && (e.northUp = t.northUp ?? Ve.northUp), "homeMarginPixels" in t && e && (e.homeMarginPixels = t.homeMarginPixels ?? Ve.homeMarginPixels), "debug" in t && (this.logger = new ta(
      t.debug ?? Ve.debug ? ii.ALL : ii.INFO
    ));
    let n = !1;
    for (const r of ["icon", "selectedIcon"])
      r in t && (this[r] = t[r], n = !0);
    for (const r of ["poiTemplate", "poiStyle", "iconTemplate"])
      r in t && (this[r] = t[r] ?? er(this.appData, r), n = !0);
    "hideOutsidePois" in t && (this.__hideOutsidePois = t.hideOutsidePois === !0, n = !0), n && this.from && this.redrawMarkers();
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
    const n = this.buildLifecycleContext(t, e), r = ip[t], s = this.uiHooks?.[r];
    if (s)
      try {
        const o = await s(n);
        this.lifecycleHookResults[t] = o, n.uiHookResult = o, n.uiHookResults = { ...this.lifecycleHookResults };
      } catch (o) {
        throw this.logger?.debug?.(`lifecycle:error:${t}`), this.dispatchEvent(new Xt("lifecycle:error", { phaseId: t, error: o })), o;
      }
    return this.dispatchEvent(
      new Xt(`lifecycle:${t}`, n)
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
      n.push(
        DC(s, r).catch(
          (o) => o instanceof ie ? pC(s, o) : Promise.reject(o)
        )
      );
    }), Promise.all(n);
  }
  // Async initializers 2: Handle application setting
  async handleSetting(t, e) {
    await this.runLifecyclePhase("setting-loaded", t), this.appData = xe(t), this.__settingFileKeys = new Set(Object.keys(this.appData || {})), await this.runLifecyclePhase("appdata-ready"), await this.runLifecyclePhase("ui-configure");
    const n = await this.prepareMap(e);
    await this.runLifecyclePhase("ui-dom-ready");
    const r = await yg(this.appData.pois || [], this);
    await this.handlePois(r, n), this.initGeolocation(e);
  }
  // Async Initializers 2.5: For geolocation settings
  initGeolocation(t) {
    this.__alwaysGpsOn = t.alwaysGpsOn || !1;
    const e = this.geolocation = new gf({
      timerBase: t.fake,
      homePosition: this.appData.homePosition
    });
    this.alwaysGpsOn ? (e.setTracking(!0), this.gpsEnabled_ = !0, this.initialGpsMove_ = !0) : (e.setTracking(!1), this.gpsEnabled_ = !1), e.on("change", () => {
      (async () => {
        const n = this.mapObject, r = n.getLayer("overlay").getLayers().item(0), s = n.getLayers().item(0), o = r ? r.getSource() : s.getSource(), a = e.getPosition(), A = e.getAccuracy();
        if (!a || !A) return;
        let g = !this.moveTo_ && !this.firstGpsRequest_;
        this.alwaysGpsOn && (g = !this.initialGpsMove_), this.__outsideSelection && (g = !0);
        const c = await o.setGPSMarkerAsync({ lnglat: a, acc: A }, g);
        this.moveTo_ = !1, this.firstGpsRequest_ = !1, this.initialGpsMove_ = !1, c || (this.alwaysGpsOn || this.handleGPS(!1, !0), o.setGPSMarker());
        const u = this.alwaysGpsOn ? "gps_out_hide" : "gps_out";
        this.dispatchEvent(new hn(c ? { lnglat: a, acc: A } : { error: u }));
      })();
    }), e.on("error", (n) => {
      const r = n.code;
      if (r === 3) return;
      e.setTracking(!1), this.gpsEnabled_ = !1;
      const s = this.mapObject, o = s.getLayer("overlay").getLayers().item(0), a = s.getLayers().item(0);
      (o ? o.getSource() : a.getSource()).setGPSMarker(), this.dispatchEvent(new np(r === 1 ? "user_gps_deny" : r === 2 ? "gps_miss" : "gps_timeout")), this.dispatchEvent(new hn({ error: "gps_off" }));
    }), this.addEventListener("mapChanged", () => {
      (async () => {
        if (e.getTracking()) {
          const n = this.mapObject, r = n.getLayer("overlay").getLayers().item(0), s = n.getLayers().item(0), o = r ? r.getSource() : s.getSource(), a = e.getPosition(), A = e.getAccuracy();
          if (!a || !A) return;
          const g = await o.setGPSMarkerAsync({ lnglat: a, acc: A }, !0);
          g || (this.alwaysGpsOn || this.handleGPS(!1, !0), o.setGPSMarker());
          const c = this.alwaysGpsOn ? "gps_out_hide" : "gps_out";
          this.dispatchEvent(new hn(g ? { lnglat: a, acc: A } : { error: c }));
        }
      })();
    });
  }
  // GPS handling methods
  handleGPS(t, e = !1) {
    if (this.geolocation) {
      if (t)
        if (!this.alwaysGpsOn)
          this.firstGpsRequest_ = !0, this.geolocation.setTracking(!0), this.gpsEnabled_ = !0, this.dispatchEvent(new rp());
        else {
          const n = this.geolocation.getPosition(), r = this.geolocation.getAccuracy();
          if (n && r) {
            const s = this.mapObject, o = s.getLayer("overlay").getLayers().item(0), a = s.getLayers().item(0), A = o ? o.getSource() : a.getSource();
            (async () => await A.setGPSMarkerAsync(
              { lnglat: n, acc: r },
              !!this.__outsideSelection
            ) || (A.setGPSMarker(), this.dispatchEvent(new hn({ error: "gps_out" }))))();
          }
        }
      else if (!this.alwaysGpsOn) {
        this.geolocation.setTracking(!1), this.gpsEnabled_ = !1;
        const n = this.mapObject, r = n.getLayer("overlay").getLayers().item(0), s = n.getLayers().item(0);
        (r ? r.getSource() : s.getSource()).setGPSMarker(), e || this.dispatchEvent(new hn({ error: "gps_off" }));
      }
    }
  }
  getGPSEnabled() {
    return this.gpsEnabled_;
  }
  // Async initializers 5: Prepare map base elements and objects
  async prepareMap(t) {
    t = xe(t), this.mercBuffer = null;
    const e = this.appData.homePosition, n = this.appData.defaultZoom, r = this.appData.zoomRestriction, s = this.appData.minZoom, o = this.appData.maxZoom;
    this.appName = this.appData.appName;
    const a = t.fake && !this.__elementMode ? this.appData.fakeGps : !1, A = t.fake && !this.__elementMode ? this.appData.fakeRadius : !1;
    this.__noRotate = this.__featureOption(t, "noRotate", Ve.noRotate), this.poiTemplate = t.poiTemplate ?? er(this.appData, "poiTemplate"), this.poiStyle = t.poiStyle ?? er(this.appData, "poiStyle"), this.iconTemplate = t.iconTemplate ?? er(this.appData, "iconTemplate"), this.currentPosition = null, this.__hideOutsidePois = t.hideOutsidePois === !0, this.__init = !0;
    const g = `${this.mapDiv}_front`;
    let c = rn(
      `<div id="${g}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;"></div>`
    )[0];
    this.mapDivDocument.insertBefore(c, this.mapDivDocument.firstChild), this.__fakeGps = a, this.__fakeRadius = A, this.homePosition = e, this.mapObject = new He({
      div: g,
      controls: this.__featureOption(t, "controls", []),
      interactions: this.noRotate ? qa({ altShiftDragRotate: !1, pinchRotate: !1 }) : qa().extend([
        new qI({
          condition: OI
        })
      ]),
      fakeGps: a,
      fakeRadius: A,
      homePosition: e,
      northUp: this.__featureOption(t, "northUp", Ve.northUp),
      tapDuration: this.__featureOption(t, "tapDuration", Ve.tapDuration),
      homeMarginPixels: this.__featureOption(t, "homeMarginPixels", Ve.homeMarginPixels),
      tapUIVanish: this.__featureOption(t, "tapUIVanish", Ve.tapUIVanish),
      alwaysGpsOn: t.alwaysGpsOn || !1
    });
    let u;
    this.overlay && (u = `${this.mapDiv}_back`, c = rn(
      `<div id="${u}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;"></div>`
    )[0], this.mapDivDocument.insertBefore(
      c,
      this.mapDivDocument.firstChild
    ), this.backMap = new He({
      off_control: !0,
      div: u
    }), this.__viewportOffset = new $C(this.mapObject, this.backMap));
    const C = t.mapboxgl || (typeof window < "u" ? window.mapboxgl : void 0);
    if (C) {
      const h = `${this.mapDiv}_mapbox`;
      c = rn(
        `<div id="${h}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;visibility:hidden;"></div>`
      )[0], this.mapDivDocument.insertBefore(
        c,
        this.mapDivDocument.firstChild
      ), this.mapboxMap = new C.Map({
        attributionControl: !1,
        boxZoom: !1,
        container: h,
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
      const h = `${this.mapDiv}_maplibre`;
      c = rn(
        `<div id="${h}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;visibility:hidden;"></div>`
      )[0], this.mapDivDocument.insertBefore(
        c,
        this.mapDivDocument.firstChild
      ), this.maplibreMap = new p.Map({
        attributionControl: !1,
        boxZoom: !1,
        container: h,
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
    this.__attributionLangOption = t.lang, this.__attribution?.dispose(), this.__attribution = new qd(
      this.mapDivDocument,
      () => zd(this.mapDivDocument, this.__attributionLangOption, this.appData?.lang)
    );
    const m = this.mapObject;
    m.on("postrender", (h) => {
      this.__attribution?.refreshDynamic(
        [m.getSource(), this.from instanceof Li ? this.from : void 0],
        h.frameState
      );
    });
    const l = this.backMap;
    return l?.on("postrender", (h) => {
      this.__attribution?.refreshDynamic([l.getSource()], h.frameState);
    }), await this.runLifecyclePhase("core-dom-ready"), this.startFrom = this.appData.startFrom, {
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
    const n = (Array.isArray(t) ? t : []).map((r) => ({
      mapID: r?.mapID ?? null,
      usable: !!(r && this.cacheHash?.[r.mapID] === r)
    }));
    return vC(this).forEach((r) => {
      n.push({ mapID: r.mapID, usable: !1 });
    }), n;
  }
  // Async initializer 9: Handle sources loading result
  async handleSources(t) {
    const e = [], n = [], r = [];
    if (this.cacheHash = /* @__PURE__ */ Object.create(null), t.forEach((s) => {
      if (mC(s)) {
        r.push({
          mapID: s.mapID,
          reason: s.__maplatUnusable.reason
        }), console.error(
          `Maplat: IIIF image for map "${s.mapID}" is not usable: ${s.__maplatUnusable.reason}`
        );
        return;
      }
      n.push(s), s.setMap(this.mapObject), Hc(s, {
        mapboxMap: this.mapboxMap,
        maplibreMap: this.maplibreMap,
        warn: (a, ...A) => {
          this.logger?.warn ? this.logger.warn(a, ...A) : console.warn(a, ...A);
        }
      }) && (e.push(s), this.cacheHash[s.mapID] = s);
    }), yC(this, r), this.mercSrc = e.reduce((s, o) => {
      if (s) return s;
      if (o.isBasemap()) return o;
    }, null), this.dispatchEvent(new Xt("sourceLoaded", n)), e.length === 0) {
      this.logger?.warn ? this.logger.warn("No usable sources; skipping map initialization handlers") : console.warn("No usable sources; skipping map initialization handlers"), await this.runLifecyclePhase("core-ready"), await this.runLifecyclePhase("ui-ready");
      return;
    }
    await this.setInitialMap(e), this.setMapClick(), this.setPointerEvents(), this.__elementMode || this.setMapOnOff(), this.setMouseCursor(), this.setBackMapBehavior(), this.raiseChangeViewpoint(), await this.runLifecyclePhase("core-ready"), await this.runLifecyclePhase("ui-ready");
  }
  // Async initializer 10: Handle initial map
  async setInitialMap(t) {
    let e = this.initialRestore.mapID || this.startFrom || t[t.length - 1].mapID;
    if (!t.some((n) => n.mapID === e)) {
      const n = t[t.length - 1].mapID;
      console.warn(
        `Maplat: the initial map "${e}" is not usable; starting from "${n}" instead.`
      ), e = n;
    }
    this.from = t.reduce(
      (n, r) => n ? !(n instanceof Wg) && r.mapID != e ? r : n : r.mapID != e ? r : n,
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
      }), e.length === 0 && e.push(...hA(this, t)), e.length > 0)
        this.dispatchEvent(new Xt("clickMarker", e[0])), this.dispatchEvent(new Xt("clickMarkers", e));
      else {
        const n = t.coordinate;
        this.dispatchEvent(new Xt("clickMapXy", n));
        const r = Is(this, t.pixel, this.__offsetNow);
        (r ? Promise.resolve(r.merc) : this.from.sysCoord2MercAsync(n)).then((s) => {
          if (!s) return;
          this.dispatchEvent(new Xt("clickMapMerc", s));
          const o = ne(s, "EPSG:3857", "EPSG:4326");
          this.dispatchEvent(
            new Xt("clickMap", {
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
    const n = {};
    let r;
    const s = (o, a) => {
      this.dispatchEvent(new Xt("pointerMoveOnMapXy", o)), new Promise((A) => {
        const g = a ? Is(this, a, this.__offsetCached) : void 0;
        A(g ? g.merc : this.from.sysCoord2MercAsync(o));
      }).then((A) => {
        A && this.dispatchEvent(new Xt("pointerMoveOnMapMerc", A));
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
      e || (t ? r = { xy: o.coordinate, pixel: o.pixel } : (t = !0, s(o.coordinate, o.pixel)));
    }), this.mapObject.on("pointerdown", (o) => {
      o.originalEvent && o.originalEvent.pointerId != null && (n[o.originalEvent.pointerId] = !0), e = !0;
    }), this.mapObject.on("pointerdrag", (o) => {
      o.originalEvent && o.originalEvent.pointerId != null && (n[o.originalEvent.pointerId] = !0), e = !0;
    }), this.mapObject.on("pointerup", (o) => {
      o.originalEvent && o.originalEvent.pointerId != null ? (delete n[o.originalEvent.pointerId], Object.keys(n).length == 0 && (e = !1)) : o.originalEvent && o.originalEvent.touches ? o.originalEvent.touches.length == 0 && (e = !1) : e = !1;
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
    const t = (r, s) => {
      const o = this.mapDivDocument.querySelector(`#${r}`);
      o.style.cursor !== s && (o.style.cursor = s);
    }, e = (r) => {
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
      const A = hA(this, r).length > 0;
      t(a, A ? "pointer" : "");
    };
    this.mapObject.on("pointermove", e);
    const n = (r) => {
      Qs(this, r.target.getView());
    };
    this.mapObject.on("moveend", n);
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
      const e = this.mapObject.getView(), n = e.getCenter(), r = e.getDecimalZoom(), s = jn(e.getRotation() * 180 / Math.PI), o = await this.from.viewpoint2MercsAsync(), a = await this.mercSrc.mercs2ViewpointAsync(o);
      if (this.mobileMapMoveBuffer && this.mobileMapMoveBuffer[0][0] == a[0][0] && this.mobileMapMoveBuffer[0][1] == a[0][1] && this.mobileMapMoveBuffer[1] == a[1] && this.mobileMapMoveBuffer[2] == a[2]) return;
      this.mobileMapMoveBuffer = a;
      const A = ne(a[0], "EPSG:3857", "EPSG:4326"), g = jn(a[2] * 180 / Math.PI);
      this.dispatchEvent(
        new Xt("changeViewpoint", {
          x: n[0],
          y: n[1],
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
    return t ? jn(t.getRotation() * 180 / Math.PI) : 0;
  }
  // 現在の実世界方位角を度数で返す。TIN地図では歪み補正込みの非同期計算になるためPromiseを返す (#61)
  async getDirection() {
    if (!this.from || !this.mercSrc) return this.getRotation();
    const t = await this.from.viewpoint2MercsAsync(), e = await this.mercSrc.mercs2ViewpointAsync(t);
    return jn(e[2] * 180 / Math.PI);
  }
  currentMapInfo() {
    return ia(this.from);
  }
  mapInfo(t) {
    return ia(xt(this.cacheHash, t));
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
  // 前面と背面の viewport のずれ。ポインタの移動は取っておいた値、クリックと
  // clientPointToLngLat は回数が少ないので毎回測り、その値を取っておく
  __offsetCached = () => this.__viewportOffset ? this.__viewportOffset.get() : ji(this.mapObject, this.backMap);
  __offsetNow = () => this.__viewportOffset ? this.__viewportOffset.refresh() : ji(this.mapObject, this.backMap);
  /** @internal 前面と背面の地図の大きさを測り直す。 */
  updateSize() {
    this.mapObject?.updateSize?.(), this.backMap?.updateSize?.();
  }
  async clientPointToLngLat(t, e) {
    if (!this.from || !this.mapObject) return;
    const r = this.mapObject.getViewport().getBoundingClientRect(), s = [t - r.left, e - r.top], o = Is(this, s, this.__offsetNow), a = o ? o.merc : await this.pixelToMerc(s);
    if (!a) return;
    const A = ne(a, "EPSG:3857", "EPSG:4326");
    return {
      longitude: A[0],
      latitude: A[1]
    };
  }
  async lngLatToClientPoint(t, e) {
    if (!this.from || !this.mapObject) return;
    const n = ne([t, e], "EPSG:4326", "EPSG:3857"), r = await ef(this, n), s = r ? r.map : this.mapObject, o = r ? r.coord : await this.from.merc2SysCoordAsync(n), a = s.getPixelFromCoordinate(o);
    if (!a) return;
    const A = s.getViewport().getBoundingClientRect();
    return {
      x: a[0] + A.left,
      y: a[1] + A.top
    };
  }
  setMarker(t) {
    this.logger.debug(t);
    const e = NA(this, t);
    return rr(this, t).then((n) => {
      rf(this, t, e, n);
    });
  }
  resetMarker() {
    uA(this, { front: [], back: [] });
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
    const n = (r, s = !1) => Promise.all(
      r.map((o) => Array.isArray(o[0]) ? n(o, s) : (s && (o = ne(o, "EPSG:4326", "EPSG:3857")), this.from.merc2SysCoordAsync(o)))
    );
    return t.coordinates ? e = n(t.coordinates) : e = n(t.lnglats, !0), e;
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
      let s;
      const o = (A, ...g) => {
        const c = gA(A, ...g), u = {
          data: c,
          icon: NA(this, c)
        };
        this.__selectedMarker == c.namespaceID ? s = u : r.push(u);
      };
      if (!this.stateBuffer.hideMarker) {
        for (const A of Object.keys(this.pois)) {
          const g = this.pois[A];
          if (!g.hide)
            for (const c of g.pois) o(c, g, this);
        }
        if (n.pois)
          for (const A of Object.keys(n.pois)) {
            const g = n.pois[A];
            if (!g.hide)
              for (const c of g.pois)
                o(c, g, n, this);
          }
      }
      const a = s ? [...r, s] : r;
      Promise.all(a.map((A) => rr(this, A.data))).then(
        (A) => {
          uA(this, nf(this, a, A));
          const g = this.__outsideSelection;
          g && !this.stateBuffer.hideMarker && (s ? s.data?.namespaceID === g.id && Cs(this, A[A.length - 1]) : g.pending && Cs(this, void 0)), this.__redrawMarkerThrottle && this.__redrawMarkerThrottle.length > 0 ? e(this.__redrawMarkerThrottle.shift()) : this.__redrawMarkerBlock = !1;
        }
      );
    };
    e(t);
  }
  selectMarker(t) {
    const e = this.getMarker(t);
    if (!e) return;
    this.__selectedMarker = t, this.__pullBackTimer = void 0, this.__outsideSelection = { id: t, pending: !0 };
    const n = {
      latitude: e.lnglat ? e.lnglat[1] : e.lat ? e.lat : e.latitude,
      longitude: e.lnglat ? e.lnglat[0] : e.lng ? e.lng : e.longitude
    };
    this.setViewpoint(n), this.redrawMarkers(), rr(this, e).then((r) => {
      this.__selectedMarker === t && Cs(this, r, { recenter: !0 });
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
      const n = this.mapObject?.getView?.();
      n && Qs(this, n);
    });
  }
  getMarker(t) {
    const e = FA(this, t);
    if (e)
      return gA(e.poi, ...e.ancestors);
  }
  updateMarker(t, e, n) {
    const r = FA(this, t)?.poi;
    if (r) {
      if (e = mn(e || {}), n) {
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
      const n = e.split("#"), r = xt(this.cacheHash, n[0]);
      if (r) {
        const s = r.addPoi(t, n[1]);
        return this.dispatchPoiNumber(), this.redrawMarkers(), s;
      }
    } else {
      const n = xt(this.pois, e);
      if (n)
        return n.pois.push(mn(t)), Eo(this.pois, e, {
          name: this.appName
        }), this.dispatchPoiNumber(), this.redrawMarkers(), t.namespaceID;
    }
  }
  removeMarker(t) {
    if (t.includes("#")) {
      const e = t.split("#"), n = xt(this.cacheHash, e[0]);
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
      const e = t.split("#"), n = xt(this.cacheHash, e[0]);
      n && (n.clearPoi(e[1]), this.dispatchPoiNumber(), this.redrawMarkers());
    } else {
      if (t === "all")
        for (const e of Object.keys(this.pois))
          this.pois[e].pois = [];
      else {
        const e = xt(this.pois, t);
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
      new Xt(
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
      ki(t, "showPoiLayer");
      return;
    }
    delete e.hide, this.requestUpdateState({
      hideLayer: this.listPoiLayers(!0).map((n) => n.namespaceID).join(",")
    }), this.redrawMarkers();
  }
  hidePoiLayer(t) {
    const e = this.getPoiLayer(t);
    if (!e) {
      ki(t, "hidePoiLayer");
      return;
    }
    e.hide = !0, this.requestUpdateState({
      hideLayer: this.listPoiLayers(!0).map((n) => n.namespaceID).join(",")
    }), this.redrawMarkers();
  }
  getPoiLayer(t) {
    if (typeof t == "string")
      if (t.includes("#")) {
        const e = t.split("#"), n = xt(this.cacheHash, e[0]);
        if (n)
          return n.getPoiLayer(e[1]);
      } else
        return xt(this.pois, t);
  }
  addPoiLayer(t, e) {
    if (t !== "main" && !this.pois[t])
      if (!t.includes("#"))
        this.pois[t] = Ye(e || [], t, {
          name: this.appName
        }), this.redrawMarkers();
      else {
        const n = t.split("#"), r = xt(this.cacheHash, n[0]);
        r ? (r.addPoiLayer(n[1], e), this.redrawMarkers()) : ki(t, "addPoiLayer");
      }
  }
  removePoiLayer(t) {
    if (t !== "main")
      if (t.includes("#")) {
        const e = t.split("#"), n = xt(this.cacheHash, e[0]);
        if (!n) {
          ki(t, "removePoiLayer");
          return;
        }
        if (!n.getPoiLayer(e[1])) {
          ki(t, "removePoiLayer");
          return;
        }
        n.removePoiLayer(e[1]), this.requestUpdateState({
          hideLayer: this.listPoiLayers(!0).map((r) => r.namespaceID).join(",")
        }), this.dispatchPoiNumber(), this.redrawMarkers();
      } else {
        if (!this.pois[t]) {
          ki(t, "removePoiLayer");
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
    const n = this.mercSrc, r = xt(this.cacheHash, t);
    return r ? (this.changeMapSeq || (this.changeMapSeq = Promise.resolve()), this.changeMapSeq = this.changeMapSeq.then(
      () => new Promise((s, o) => {
        const a = () => this.convertParametersFromCurrent(r, (A) => {
          const g = this.from, c = this.__captureViewState();
          let u = null, C = null;
          const p = e.backgroundID ? xt(this.cacheHash, e.backgroundID) : void 0;
          if (this.backMap && (u = this.backMap.getSource(), r.isWmts() ? this.backMap.exchangeSource() : (p ? (C = p, this.backMap.exchangeSource(C)) : u ? C = u : (C = n, this.from.isWmts() && (C = this.from instanceof Li ? (
            // If current foreground is a TMS overlay, use the current
            // basemap as new background. On initial load no foreground
            // source is set yet, so fall back to the default basemap
            // (mercSrc) to avoid a null background source.
            this.mapObject.getSource() || n
          ) : this.from), C && this.backMap.exchangeSource(C)), C && this.requestUpdateState({ backgroundID: C.mapID }))), r instanceof Li) {
            if (this.mapObject.setLayer(r), p)
              this.mapObject.exchangeSource(p);
            else if (!this.from.isWmts()) {
              const d = u || n;
              this.mapObject.exchangeSource(d);
            }
            const I = this.mapObject.getSource();
            I && this.requestUpdateState({ backgroundID: I.mapID });
          } else
            this.mapObject.setLayer(), this.mapObject.exchangeSource(r);
          const m = {
            mapID: r.mapID
          };
          r.isBasemap() && (m.backgroundID = "____delete____"), this.requestUpdateState(m), this.from = r, this.dispatchPoiNumber();
          const l = this.mapObject.getView();
          this.appData.zoomRestriction && (l.setMaxZoom(r.maxZoom), l.setMinZoom(r.minZoom || 0)), A && r.insideCheckSysCoord(A[0]) ? (this.__outsideSelection && (this.__outsideSelection = {
            ...this.__outsideSelection,
            pending: !0
          }), l.setCenter(A[0]), l.setZoom(A[1]), l.setRotation(this.noRotate ? 0 : A[2])) : !this.__init && !A && !this.__hasMapSize() && g ? this.__pendingView ? this.__pendingView.positionMapID !== r.mapID && (delete this.__pendingView.position, delete this.__pendingView.positionMapID) : this.__pendingView = { from: g, state: c } : this.__init ? A || this.__hasMapSize() && this.goHome(r) : this.__outsideSelection ? this.__outsideSelection = {
            ...this.__outsideSelection,
            pending: !0
          } : (this.dispatchEvent(new Xt("outOfMap", {})), this.goHome(r)), r.setGPSMarker(this.currentPosition, !0), e.hideLayer && (e.hideLayer.split(",").map((d) => {
            const E = this.getPoiLayer(d);
            E && (E.hide = !0);
          }), this.requestUpdateState({ hideLayer: e.hideLayer })), e.hideMarker ? this.hideAllMarkers() : this.redrawMarkers(), this.resetVector(), this.__vectorStore().forEach((I) => this.__drawVectorEntry(I));
          const h = r instanceof Li ? r : void 0;
          this.__attribution?.update(
            Xd({
              front: this.mapObject.getSource(),
              overlay: h,
              back: this.backMap?.getSource()
            }),
            h ? [h] : []
          ), this.dispatchEvent(
            new Xt("mapChanged", this.getMapMeta(r.mapID))
          ), this.mapObject.updateSize(), this.mapObject.render(), e.position && (this.__hasMapSize() ? (this.__init = !1, r.setViewpoint(e.position)) : this.__pendingView && (this.__pendingView.position = e.position, this.__pendingView.positionMapID = r.mapID)), this.setTransparency(
            e.transparency !== void 0 && e.transparency !== null ? e.transparency : this.getTransparency()
          ), this.__init ? this.__hasMapSize() && (this.__init = !1, this.goHome(r)) : this.backMap && C && this.convertParametersFromCurrent(C, (I) => {
            if (!I)
              return;
            const d = this.backMap.getView();
            d.setCenter(I[0]), d.setZoom(I[1]), d.setRotation(this.noRotate ? 0 : I[2]), this.backMap.updateSize(), this.backMap.render();
          }), s(void 0);
        });
        this.__pendingView ? this.__applyPendingView().then(a) : a();
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
      this.timer = void 0, this.dispatchEvent(new Xt("updateState", this.stateBuffer));
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
    const n = this.from;
    n && (t.updateSize(), this.__hasMapSize() && (this.__init = !1, this.initialRestore.position ? n.setViewpoint(this.initialRestore.position) : n.goHome(), t.updateSize(), t.render()));
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
    const t = this.__pendingView, e = this.mapObject, n = this.from;
    return !t || !e || !n || (e.updateSize(), !this.__hasMapSize()) ? Promise.resolve() : new Promise((r) => {
      let s = !1;
      const o = () => {
        s || (s = !0, this.__pendingView === t && (this.__pendingView = null), t.position && t.positionMapID === n.mapID && n.setViewpoint(t.position), e.updateSize(), e.render(), r());
      }, a = (A) => {
        s || (this.logger.warn(`changeMap: pending viewpoint conversion failed: ${A}`), this.goHome(n), o());
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
          (A) => {
            const g = e.getView();
            A && n.insideCheckSysCoord(A[0]) ? (g.setCenter(A[0]), g.setZoom(A[1]), g.setRotation(this.noRotate ? 0 : A[2])) : this.__outsideSelection?.merc ? nc(this, this.__outsideSelection.merc) : (this.dispatchEvent(new Xt("outOfMap", {})), this.goHome(n)), o();
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
    const e = this.__captureRawViewState(t), { center: n, zoom: r, decimalZoom: s, rotation: o } = e;
    if (!(!n || ![n[0], n[1], r, s, o].every(
      (a) => Number.isFinite(a)
    )))
      return { center: [n[0], n[1]], zoom: r, decimalZoom: s, rotation: o };
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
    if (t ? e = xt(this.cacheHash, t) : e = this.from, !e) return;
    const n = Cn.reduce(
      (s, o) => (s[o] = e.get(o), s),
      {
        mapID: e.mapID,
        label: e.label
      }
    ), r = $h(e?.iiif, e?.iiifMetadataDisplay);
    return r && (n.iiif = r), n;
  }
  getMapCacheEnable(t) {
    let e;
    return t ? e = xt(this.cacheHash, t) : e = this.from, e ? e.getCacheEnable() : !1;
  }
  async getMapTileCacheStatsAsync(t) {
    let e;
    return t ? e = xt(this.cacheHash, t) : e = this.from, e ? await e.getTileCacheStatsAsync() : {};
  }
  async getMapTileCacheSizeAsync(t) {
    return (await this.getMapTileCacheStatsAsync(t)).size || 0;
  }
  async clearMapTileCacheAsync(t) {
    let e;
    t ? e = xt(this.cacheHash, t) : e = this.from, e && await e.clearTileCacheAsync();
  }
  async fetchAllMapTileCacheAsync(t, e) {
    let n;
    if (t ? n = xt(this.cacheHash, t) : n = this.from, !n) {
      e("stop", {});
      return;
    }
    await n.fetchAllTileCacheAsync(e);
  }
  async cancelMapTileCacheAsync(t) {
    let e;
    t ? e = xt(this.cacheHash, t) : e = this.from, e && await e.cancelTileCacheAsync();
  }
  convertParametersFromCurrent(t, e) {
    this.__convertFromCurrent(t, e);
  }
  // #108: convertParametersFromCurrent の本体。公開の型を変えずに
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
  // 変換核。切替前の地図 fromSrc と、そのときの視点 state（地図の
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
    const a = Vs(
      [e.center, e.zoom, e.rotation],
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
      let g = n.mercs2ViewpointAsync(A);
      const c = n.mapID;
      this.mercBuffer.buffer[c] && (this.logger.debug("To: Use buffer"), g = new Promise((u, C) => {
        u(this.mercBuffer.buffer[c]);
      })), g.then((u) => {
        this.logger.debug(
          `To: Center: ${u[0]} Zoom: ${u[1]} Rotation: ${u[2]}`
        ), this.logger.debug(`To: ${n.mapID}`), this.mercBuffer.buffer[n.mapID] = Vs(u, 10), r(u);
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
const op = [
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
  const t = wn.prototype;
  for (const e of op) {
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
        this.__startupWarner || (this.__startupWarner = XA()), this.__startupWarner(
          e,
          `MaplatApp: "${e}" is fixed at startup and cannot be changed after construction; the assignment was ignored.`
        );
      }
    });
  }
})();
wn.createObject = function(i) {
  return new Promise((t) => {
    const e = new wn(i);
    e.waitReady.then(() => {
      t(e);
    });
  });
};
if (typeof window < "u") {
  const i = {
    createObject: wn.createObject
  };
  window.Maplat = i, window.MaplatApp = wn, window.assets = vn;
}
export {
  Xt as CustomEvent,
  np as GPSErrorEvent,
  rp as GPSRequestEvent,
  hn as GPSResultEvent,
  op as MAPLAT_APP_STARTUP_FIELDS,
  wn as MaplatApp,
  He as MaplatMap,
  vn as assets,
  Ip as buildSlideAttrs,
  rn as createElement,
  ep as defaultPinIcon,
  kd as escapeAttr,
  DC as mapSourceFactory,
  Cp as mercToLngLat,
  dc as sanitizeHtml,
  Pd as toPlainText
};
//# sourceMappingURL=maplat_core.js.map
