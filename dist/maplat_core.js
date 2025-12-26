var og = Object.defineProperty;
var gg = (i, t, e) => t in i ? og(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var M = (i, t, e) => gg(i, typeof t != "symbol" ? t + "" : t, e);
import { transform as Xt, toLonLat as ci, Projection as ag, addProjection as qr, addCoordinateTransforms as Ir, getTransform as Lr, identityTransform as kr } from "ol/proj";
import { View as ms, Map as Ig, Feature as Cg } from "ol";
import { Vector as Vn, Group as cg, Tile as Nr } from "ol/layer";
import { XYZ as ys, Google as lg, Vector as Yn } from "ol/source";
import { Style as _t, Icon as tn, Stroke as _r, Fill as $r } from "ol/style";
function ug(i, t) {
  for (var e = 0; e < t.length; e++) {
    const n = t[e];
    if (typeof n != "string" && !Array.isArray(n)) {
      for (const r in n)
        if (r !== "default" && !(r in i)) {
          const A = Object.getOwnPropertyDescriptor(n, r);
          A && Object.defineProperty(i, r, A.get ? A : {
            enumerable: !0,
            get: () => n[r]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(i, Symbol.toStringTag, { value: "Module" }));
}
function Qt(i) {
  "@babel/helpers - typeof";
  return Qt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Qt(i);
}
function re(i, t) {
  if (!(i instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function hg(i, t) {
  if (Qt(i) != "object" || !i) return i;
  var e = i[Symbol.toPrimitive];
  if (e !== void 0) {
    var n = e.call(i, t);
    if (Qt(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(i);
}
function vs(i) {
  var t = hg(i, "string");
  return Qt(t) == "symbol" ? t : t + "";
}
function tA(i, t) {
  for (var e = 0; e < t.length; e++) {
    var n = t[e];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(i, vs(n.key), n);
  }
}
function ie(i, t, e) {
  return t && tA(i.prototype, t), e && tA(i, e), Object.defineProperty(i, "prototype", {
    writable: !1
  }), i;
}
function pe(i) {
  if (i === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return i;
}
function ti(i, t) {
  return ti = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e, n) {
    return e.__proto__ = n, e;
  }, ti(i, t);
}
function yr(i, t) {
  if (typeof t != "function" && t !== null) throw new TypeError("Super expression must either be null or a function");
  i.prototype = Object.create(t && t.prototype, {
    constructor: {
      value: i,
      writable: !0,
      configurable: !0
    }
  }), Object.defineProperty(i, "prototype", {
    writable: !1
  }), t && ti(i, t);
}
function Tn(i, t) {
  if (t && (Qt(t) == "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return pe(i);
}
function ee(i) {
  return ee = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, ee(i);
}
function be(i, t, e) {
  return (t = vs(t)) in i ? Object.defineProperty(i, t, {
    value: e,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : i[t] = e, i;
}
function fg(i) {
  if (Array.isArray(i)) return i;
}
function dg(i) {
  if (typeof Symbol < "u" && i[Symbol.iterator] != null || i["@@iterator"] != null) return Array.from(i);
}
function eA(i, t) {
  (t == null || t > i.length) && (t = i.length);
  for (var e = 0, n = Array(t); e < t; e++) n[e] = i[e];
  return n;
}
function pg(i, t) {
  if (i) {
    if (typeof i == "string") return eA(i, t);
    var e = {}.toString.call(i).slice(8, -1);
    return e === "Object" && i.constructor && (e = i.constructor.name), e === "Map" || e === "Set" ? Array.from(i) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? eA(i, t) : void 0;
  }
}
function mg() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function yg(i) {
  return fg(i) || dg(i) || pg(i) || mg();
}
function nA(i, t) {
  var e = Object.keys(i);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(i);
    t && (n = n.filter(function(r) {
      return Object.getOwnPropertyDescriptor(i, r).enumerable;
    })), e.push.apply(e, n);
  }
  return e;
}
function rA(i) {
  for (var t = 1; t < arguments.length; t++) {
    var e = arguments[t] != null ? arguments[t] : {};
    t % 2 ? nA(Object(e), !0).forEach(function(n) {
      be(i, n, e[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(e)) : nA(Object(e)).forEach(function(n) {
      Object.defineProperty(i, n, Object.getOwnPropertyDescriptor(e, n));
    });
  }
  return i;
}
var vg = {
  type: "logger",
  log: function(t) {
    this.output("log", t);
  },
  warn: function(t) {
    this.output("warn", t);
  },
  error: function(t) {
    this.output("error", t);
  },
  output: function(t, e) {
    console && console[t] && console[t].apply(console, e);
  }
}, bg = (function() {
  function i(t) {
    var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    re(this, i), this.init(t, e);
  }
  return ie(i, [{
    key: "init",
    value: function(e) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      this.prefix = n.prefix || "i18next:", this.logger = e || vg, this.options = n, this.debug = n.debug;
    }
  }, {
    key: "setDebug",
    value: function(e) {
      this.debug = e;
    }
  }, {
    key: "log",
    value: function() {
      for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
        n[r] = arguments[r];
      return this.forward(n, "log", "", !0);
    }
  }, {
    key: "warn",
    value: function() {
      for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
        n[r] = arguments[r];
      return this.forward(n, "warn", "", !0);
    }
  }, {
    key: "error",
    value: function() {
      for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
        n[r] = arguments[r];
      return this.forward(n, "error", "");
    }
  }, {
    key: "deprecate",
    value: function() {
      for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
        n[r] = arguments[r];
      return this.forward(n, "warn", "WARNING DEPRECATED: ", !0);
    }
  }, {
    key: "forward",
    value: function(e, n, r, A) {
      return A && !this.debug ? null : (typeof e[0] == "string" && (e[0] = "".concat(r).concat(this.prefix, " ").concat(e[0])), this.logger[n](e));
    }
  }, {
    key: "create",
    value: function(e) {
      return new i(this.logger, rA(rA({}, {
        prefix: "".concat(this.prefix, ":").concat(e, ":")
      }), this.options));
    }
  }, {
    key: "clone",
    value: function(e) {
      return e = e || this.options, e.prefix = e.prefix || this.prefix, new i(this.logger, e);
    }
  }]), i;
})(), $t = new bg(), me = (function() {
  function i() {
    re(this, i), this.observers = {};
  }
  return ie(i, [{
    key: "on",
    value: function(e, n) {
      var r = this;
      return e.split(" ").forEach(function(A) {
        r.observers[A] = r.observers[A] || [], r.observers[A].push(n);
      }), this;
    }
  }, {
    key: "off",
    value: function(e, n) {
      if (this.observers[e]) {
        if (!n) {
          delete this.observers[e];
          return;
        }
        this.observers[e] = this.observers[e].filter(function(r) {
          return r !== n;
        });
      }
    }
  }, {
    key: "emit",
    value: function(e) {
      for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), A = 1; A < n; A++)
        r[A - 1] = arguments[A];
      if (this.observers[e]) {
        var s = [].concat(this.observers[e]);
        s.forEach(function(g) {
          g.apply(void 0, r);
        });
      }
      if (this.observers["*"]) {
        var o = [].concat(this.observers["*"]);
        o.forEach(function(g) {
          g.apply(g, [e].concat(r));
        });
      }
    }
  }]), i;
})();
function In() {
  var i, t, e = new Promise(function(n, r) {
    i = n, t = r;
  });
  return e.resolve = i, e.reject = t, e;
}
function iA(i) {
  return i == null ? "" : "" + i;
}
function wg(i, t, e) {
  i.forEach(function(n) {
    t[n] && (e[n] = t[n]);
  });
}
function li(i, t, e) {
  function n(o) {
    return o && o.indexOf("###") > -1 ? o.replace(/###/g, ".") : o;
  }
  function r() {
    return !i || typeof i == "string";
  }
  for (var A = typeof t != "string" ? [].concat(t) : t.split("."); A.length > 1; ) {
    if (r()) return {};
    var s = n(A.shift());
    !i[s] && e && (i[s] = new e()), Object.prototype.hasOwnProperty.call(i, s) ? i = i[s] : i = {};
  }
  return r() ? {} : {
    obj: i,
    k: n(A.shift())
  };
}
function AA(i, t, e) {
  var n = li(i, t, Object), r = n.obj, A = n.k;
  r[A] = e;
}
function Eg(i, t, e, n) {
  var r = li(i, t, Object), A = r.obj, s = r.k;
  A[s] = A[s] || [], A[s].push(e);
}
function Cr(i, t) {
  var e = li(i, t), n = e.obj, r = e.k;
  if (n)
    return n[r];
}
function sA(i, t, e) {
  var n = Cr(i, e);
  return n !== void 0 ? n : Cr(t, e);
}
function bs(i, t, e) {
  for (var n in t)
    n !== "__proto__" && n !== "constructor" && (n in i ? typeof i[n] == "string" || i[n] instanceof String || typeof t[n] == "string" || t[n] instanceof String ? e && (i[n] = t[n]) : bs(i[n], t[n], e) : i[n] = t[n]);
  return i;
}
function Fe(i) {
  return i.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
var Mg = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;"
};
function Pg(i) {
  return typeof i == "string" ? i.replace(/[&<>"'\/]/g, function(t) {
    return Mg[t];
  }) : i;
}
var vr = typeof window < "u" && window.navigator && typeof window.navigator.userAgentData > "u" && window.navigator.userAgent && window.navigator.userAgent.indexOf("MSIE") > -1, Rg = [" ", ",", "?", "!", ";"];
function xg(i, t, e) {
  t = t || "", e = e || "";
  var n = Rg.filter(function(o) {
    return t.indexOf(o) < 0 && e.indexOf(o) < 0;
  });
  if (n.length === 0) return !0;
  var r = new RegExp("(".concat(n.map(function(o) {
    return o === "?" ? "\\?" : o;
  }).join("|"), ")")), A = !r.test(i);
  if (!A) {
    var s = i.indexOf(e);
    s > 0 && !r.test(i.substring(0, s)) && (A = !0);
  }
  return A;
}
function oA(i, t) {
  var e = Object.keys(i);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(i);
    t && (n = n.filter(function(r) {
      return Object.getOwnPropertyDescriptor(i, r).enumerable;
    })), e.push.apply(e, n);
  }
  return e;
}
function Kn(i) {
  for (var t = 1; t < arguments.length; t++) {
    var e = arguments[t] != null ? arguments[t] : {};
    t % 2 ? oA(Object(e), !0).forEach(function(n) {
      be(i, n, e[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(e)) : oA(Object(e)).forEach(function(n) {
      Object.defineProperty(i, n, Object.getOwnPropertyDescriptor(e, n));
    });
  }
  return i;
}
function Sg(i) {
  var t = Og();
  return function() {
    var n = ee(i), r;
    if (t) {
      var A = ee(this).constructor;
      r = Reflect.construct(n, arguments, A);
    } else
      r = n.apply(this, arguments);
    return Tn(this, r);
  };
}
function Og() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
function ws(i, t) {
  var e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ".";
  if (i) {
    if (i[t]) return i[t];
    for (var n = t.split(e), r = i, A = 0; A < n.length; ++A) {
      if (!r || typeof r[n[A]] == "string" && A + 1 < n.length)
        return;
      if (r[n[A]] === void 0) {
        for (var s = 2, o = n.slice(A, A + s).join(e), g = r[o]; g === void 0 && n.length > A + s; )
          s++, o = n.slice(A, A + s).join(e), g = r[o];
        if (g === void 0) return;
        if (g === null) return null;
        if (t.endsWith(o)) {
          if (typeof g == "string") return g;
          if (o && typeof g[o] == "string") return g[o];
        }
        var a = n.slice(A + s).join(e);
        return a ? ws(g, a, e) : void 0;
      }
      r = r[n[A]];
    }
    return r;
  }
}
var Dg = (function(i) {
  yr(e, i);
  var t = Sg(e);
  function e(n) {
    var r, A = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      ns: ["translation"],
      defaultNS: "translation"
    };
    return re(this, e), r = t.call(this), vr && me.call(pe(r)), r.data = n || {}, r.options = A, r.options.keySeparator === void 0 && (r.options.keySeparator = "."), r.options.ignoreJSONStructure === void 0 && (r.options.ignoreJSONStructure = !0), r;
  }
  return ie(e, [{
    key: "addNamespaces",
    value: function(r) {
      this.options.ns.indexOf(r) < 0 && this.options.ns.push(r);
    }
  }, {
    key: "removeNamespaces",
    value: function(r) {
      var A = this.options.ns.indexOf(r);
      A > -1 && this.options.ns.splice(A, 1);
    }
  }, {
    key: "getResource",
    value: function(r, A, s) {
      var o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, g = o.keySeparator !== void 0 ? o.keySeparator : this.options.keySeparator, a = o.ignoreJSONStructure !== void 0 ? o.ignoreJSONStructure : this.options.ignoreJSONStructure, I = [r, A];
      s && typeof s != "string" && (I = I.concat(s)), s && typeof s == "string" && (I = I.concat(g ? s.split(g) : s)), r.indexOf(".") > -1 && (I = r.split("."));
      var C = Cr(this.data, I);
      return C || !a || typeof s != "string" ? C : ws(this.data && this.data[r] && this.data[r][A], s, g);
    }
  }, {
    key: "addResource",
    value: function(r, A, s, o) {
      var g = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
        silent: !1
      }, a = this.options.keySeparator;
      a === void 0 && (a = ".");
      var I = [r, A];
      s && (I = I.concat(a ? s.split(a) : s)), r.indexOf(".") > -1 && (I = r.split("."), o = A, A = I[1]), this.addNamespaces(A), AA(this.data, I, o), g.silent || this.emit("added", r, A, s, o);
    }
  }, {
    key: "addResources",
    value: function(r, A, s) {
      var o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {
        silent: !1
      };
      for (var g in s)
        (typeof s[g] == "string" || Object.prototype.toString.apply(s[g]) === "[object Array]") && this.addResource(r, A, g, s[g], {
          silent: !0
        });
      o.silent || this.emit("added", r, A, s);
    }
  }, {
    key: "addResourceBundle",
    value: function(r, A, s, o, g) {
      var a = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {
        silent: !1
      }, I = [r, A];
      r.indexOf(".") > -1 && (I = r.split("."), o = s, s = A, A = I[1]), this.addNamespaces(A);
      var C = Cr(this.data, I) || {};
      o ? bs(C, s, g) : C = Kn(Kn({}, C), s), AA(this.data, I, C), a.silent || this.emit("added", r, A, s);
    }
  }, {
    key: "removeResourceBundle",
    value: function(r, A) {
      this.hasResourceBundle(r, A) && delete this.data[r][A], this.removeNamespaces(A), this.emit("removed", r, A);
    }
  }, {
    key: "hasResourceBundle",
    value: function(r, A) {
      return this.getResource(r, A) !== void 0;
    }
  }, {
    key: "getResourceBundle",
    value: function(r, A) {
      return A || (A = this.options.defaultNS), this.options.compatibilityAPI === "v1" ? Kn(Kn({}, {}), this.getResource(r, A)) : this.getResource(r, A);
    }
  }, {
    key: "getDataByLanguage",
    value: function(r) {
      return this.data[r];
    }
  }, {
    key: "hasLanguageSomeTranslations",
    value: function(r) {
      var A = this.getDataByLanguage(r), s = A && Object.keys(A) || [];
      return !!s.find(function(o) {
        return A[o] && Object.keys(A[o]).length > 0;
      });
    }
  }, {
    key: "toJSON",
    value: function() {
      return this.data;
    }
  }]), e;
})(me), Es = {
  processors: {},
  addPostProcessor: function(t) {
    this.processors[t.name] = t;
  },
  handle: function(t, e, n, r, A) {
    var s = this;
    return t.forEach(function(o) {
      s.processors[o] && (e = s.processors[o].process(e, n, r, A));
    }), e;
  }
};
function gA(i, t) {
  var e = Object.keys(i);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(i);
    t && (n = n.filter(function(r) {
      return Object.getOwnPropertyDescriptor(i, r).enumerable;
    })), e.push.apply(e, n);
  }
  return e;
}
function St(i) {
  for (var t = 1; t < arguments.length; t++) {
    var e = arguments[t] != null ? arguments[t] : {};
    t % 2 ? gA(Object(e), !0).forEach(function(n) {
      be(i, n, e[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(e)) : gA(Object(e)).forEach(function(n) {
      Object.defineProperty(i, n, Object.getOwnPropertyDescriptor(e, n));
    });
  }
  return i;
}
function Bg(i) {
  var t = Tg();
  return function() {
    var n = ee(i), r;
    if (t) {
      var A = ee(this).constructor;
      r = Reflect.construct(n, arguments, A);
    } else
      r = n.apply(this, arguments);
    return Tn(this, r);
  };
}
function Tg() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
var aA = {}, IA = (function(i) {
  yr(e, i);
  var t = Bg(e);
  function e(n) {
    var r, A = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return re(this, e), r = t.call(this), vr && me.call(pe(r)), wg(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], n, pe(r)), r.options = A, r.options.keySeparator === void 0 && (r.options.keySeparator = "."), r.logger = $t.create("translator"), r;
  }
  return ie(e, [{
    key: "changeLanguage",
    value: function(r) {
      r && (this.language = r);
    }
  }, {
    key: "exists",
    value: function(r) {
      var A = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
        interpolation: {}
      };
      if (r == null)
        return !1;
      var s = this.resolve(r, A);
      return s && s.res !== void 0;
    }
  }, {
    key: "extractFromKey",
    value: function(r, A) {
      var s = A.nsSeparator !== void 0 ? A.nsSeparator : this.options.nsSeparator;
      s === void 0 && (s = ":");
      var o = A.keySeparator !== void 0 ? A.keySeparator : this.options.keySeparator, g = A.ns || this.options.defaultNS || [], a = s && r.indexOf(s) > -1, I = !this.options.userDefinedKeySeparator && !A.keySeparator && !this.options.userDefinedNsSeparator && !A.nsSeparator && !xg(r, s, o);
      if (a && !I) {
        var C = r.match(this.interpolator.nestingRegexp);
        if (C && C.length > 0)
          return {
            key: r,
            namespaces: g
          };
        var c = r.split(s);
        (s !== o || s === o && this.options.ns.indexOf(c[0]) > -1) && (g = c.shift()), r = c.join(o);
      }
      return typeof g == "string" && (g = [g]), {
        key: r,
        namespaces: g
      };
    }
  }, {
    key: "translate",
    value: function(r, A, s) {
      var o = this;
      if (Qt(A) !== "object" && this.options.overloadTranslationOptionHandler && (A = this.options.overloadTranslationOptionHandler(arguments)), A || (A = {}), r == null) return "";
      Array.isArray(r) || (r = [String(r)]);
      var g = A.returnDetails !== void 0 ? A.returnDetails : this.options.returnDetails, a = A.keySeparator !== void 0 ? A.keySeparator : this.options.keySeparator, I = this.extractFromKey(r[r.length - 1], A), C = I.key, c = I.namespaces, l = c[c.length - 1], h = A.lng || this.language, u = A.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
      if (h && h.toLowerCase() === "cimode") {
        if (u) {
          var m = A.nsSeparator || this.options.nsSeparator;
          return g ? (p.res = "".concat(l).concat(m).concat(C), p) : "".concat(l).concat(m).concat(C);
        }
        return g ? (p.res = C, p) : C;
      }
      var p = this.resolve(r, A), v = p && p.res, D = p && p.usedKey || C, T = p && p.exactUsedKey || C, U = Object.prototype.toString.apply(v), W = ["[object Number]", "[object Function]", "[object RegExp]"], q = A.joinArrays !== void 0 ? A.joinArrays : this.options.joinArrays, et = !this.i18nFormat || this.i18nFormat.handleAsObject, nt = typeof v != "string" && typeof v != "boolean" && typeof v != "number";
      if (et && v && nt && W.indexOf(U) < 0 && !(typeof q == "string" && U === "[object Array]")) {
        if (!A.returnObjects && !this.options.returnObjects) {
          this.options.returnedObjectHandler || this.logger.warn("accessing an object - but returnObjects options is not enabled!");
          var at = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(D, v, St(St({}, A), {}, {
            ns: c
          })) : "key '".concat(C, " (").concat(this.language, ")' returned an object instead of string.");
          return g ? (p.res = at, p) : at;
        }
        if (a) {
          var J = U === "[object Array]", rt = J ? [] : {}, dt = J ? T : D;
          for (var ut in v)
            if (Object.prototype.hasOwnProperty.call(v, ut)) {
              var b = "".concat(dt).concat(a).concat(ut);
              rt[ut] = this.translate(b, St(St({}, A), {
                joinArrays: !1,
                ns: c
              })), rt[ut] === b && (rt[ut] = v[ut]);
            }
          v = rt;
        }
      } else if (et && typeof q == "string" && U === "[object Array]")
        v = v.join(q), v && (v = this.extendTranslation(v, r, A, s));
      else {
        var w = !1, z = !1, _ = A.count !== void 0 && typeof A.count != "string", it = e.hasDefaultValue(A), Y = _ ? this.pluralResolver.getSuffix(h, A.count, A) : "", lt = A["defaultValue".concat(Y)] || A.defaultValue;
        !this.isValidLookup(v) && it && (w = !0, v = lt), this.isValidLookup(v) || (z = !0, v = C);
        var we = A.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey, pt = we && z ? void 0 : v, xt = it && lt !== v && this.options.updateMissing;
        if (z || w || xt) {
          if (this.logger.log(xt ? "updateKey" : "missingKey", h, l, C, xt ? lt : v), a) {
            var Ge = this.resolve(C, St(St({}, A), {}, {
              keySeparator: !1
            }));
            Ge && Ge.res && this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
          }
          var Ae = [], ce = this.languageUtils.getFallbackCodes(this.options.fallbackLng, A.lng || this.language);
          if (this.options.saveMissingTo === "fallback" && ce && ce[0])
            for (var se = 0; se < ce.length; se++)
              Ae.push(ce[se]);
          else this.options.saveMissingTo === "all" ? Ae = this.languageUtils.toResolveHierarchy(A.lng || this.language) : Ae.push(A.lng || this.language);
          var Vt = function(At, Ee, Me) {
            var Xe = it && Me !== v ? Me : pt;
            o.options.missingKeyHandler ? o.options.missingKeyHandler(At, l, Ee, Xe, xt, A) : o.backendConnector && o.backendConnector.saveMissing && o.backendConnector.saveMissing(At, l, Ee, Xe, xt, A), o.emit("missingKey", At, l, Ee, v);
          };
          this.options.saveMissing && (this.options.saveMissingPlurals && _ ? Ae.forEach(function(oe) {
            o.pluralResolver.getSuffixes(oe, A).forEach(function(At) {
              Vt([oe], C + At, A["defaultValue".concat(At)] || lt);
            });
          }) : Vt(Ae, C, lt));
        }
        v = this.extendTranslation(v, r, A, p, s), z && v === C && this.options.appendNamespaceToMissingKey && (v = "".concat(l, ":").concat(C)), (z || w) && this.options.parseMissingKeyHandler && (this.options.compatibilityAPI !== "v1" ? v = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? "".concat(l, ":").concat(C) : C, w ? v : void 0) : v = this.options.parseMissingKeyHandler(v));
      }
      return g ? (p.res = v, p) : v;
    }
  }, {
    key: "extendTranslation",
    value: function(r, A, s, o, g) {
      var a = this;
      if (this.i18nFormat && this.i18nFormat.parse)
        r = this.i18nFormat.parse(r, St(St({}, this.options.interpolation.defaultVariables), s), o.usedLng, o.usedNS, o.usedKey, {
          resolved: o
        });
      else if (!s.skipInterpolation) {
        s.interpolation && this.interpolator.init(St(St({}, s), {
          interpolation: St(St({}, this.options.interpolation), s.interpolation)
        }));
        var I = typeof r == "string" && (s && s.interpolation && s.interpolation.skipOnVariables !== void 0 ? s.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables), C;
        if (I) {
          var c = r.match(this.interpolator.nestingRegexp);
          C = c && c.length;
        }
        var l = s.replace && typeof s.replace != "string" ? s.replace : s;
        if (this.options.interpolation.defaultVariables && (l = St(St({}, this.options.interpolation.defaultVariables), l)), r = this.interpolator.interpolate(r, l, s.lng || this.language, s), I) {
          var h = r.match(this.interpolator.nestingRegexp), u = h && h.length;
          C < u && (s.nest = !1);
        }
        s.nest !== !1 && (r = this.interpolator.nest(r, function() {
          for (var v = arguments.length, D = new Array(v), T = 0; T < v; T++)
            D[T] = arguments[T];
          return g && g[0] === D[0] && !s.context ? (a.logger.warn("It seems you are nesting recursively key: ".concat(D[0], " in key: ").concat(A[0])), null) : a.translate.apply(a, D.concat([A]));
        }, s)), s.interpolation && this.interpolator.reset();
      }
      var m = s.postProcess || this.options.postProcess, p = typeof m == "string" ? [m] : m;
      return r != null && p && p.length && s.applyPostProcessor !== !1 && (r = Es.handle(p, r, A, this.options && this.options.postProcessPassResolved ? St({
        i18nResolved: o
      }, s) : s, this)), r;
    }
  }, {
    key: "resolve",
    value: function(r) {
      var A = this, s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o, g, a, I, C;
      return typeof r == "string" && (r = [r]), r.forEach(function(c) {
        if (!A.isValidLookup(o)) {
          var l = A.extractFromKey(c, s), h = l.key;
          g = h;
          var u = l.namespaces;
          A.options.fallbackNS && (u = u.concat(A.options.fallbackNS));
          var m = s.count !== void 0 && typeof s.count != "string", p = m && !s.ordinal && s.count === 0 && A.pluralResolver.shouldUseIntlApi(), v = s.context !== void 0 && (typeof s.context == "string" || typeof s.context == "number") && s.context !== "", D = s.lngs ? s.lngs : A.languageUtils.toResolveHierarchy(s.lng || A.language, s.fallbackLng);
          u.forEach(function(T) {
            A.isValidLookup(o) || (C = T, !aA["".concat(D[0], "-").concat(T)] && A.utils && A.utils.hasLoadedNamespace && !A.utils.hasLoadedNamespace(C) && (aA["".concat(D[0], "-").concat(T)] = !0, A.logger.warn('key "'.concat(g, '" for languages "').concat(D.join(", "), `" won't get resolved as namespace "`).concat(C, '" was not yet loaded'), "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!")), D.forEach(function(U) {
              if (!A.isValidLookup(o)) {
                I = U;
                var W = [h];
                if (A.i18nFormat && A.i18nFormat.addLookupKeys)
                  A.i18nFormat.addLookupKeys(W, h, U, T, s);
                else {
                  var q;
                  m && (q = A.pluralResolver.getSuffix(U, s.count, s));
                  var et = "".concat(A.options.pluralSeparator, "zero");
                  if (m && (W.push(h + q), p && W.push(h + et)), v) {
                    var nt = "".concat(h).concat(A.options.contextSeparator).concat(s.context);
                    W.push(nt), m && (W.push(nt + q), p && W.push(nt + et));
                  }
                }
                for (var at; at = W.pop(); )
                  A.isValidLookup(o) || (a = at, o = A.getResource(U, T, at, s));
              }
            }));
          });
        }
      }), {
        res: o,
        usedKey: g,
        exactUsedKey: a,
        usedLng: I,
        usedNS: C
      };
    }
  }, {
    key: "isValidLookup",
    value: function(r) {
      return r !== void 0 && !(!this.options.returnNull && r === null) && !(!this.options.returnEmptyString && r === "");
    }
  }, {
    key: "getResource",
    value: function(r, A, s) {
      var o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
      return this.i18nFormat && this.i18nFormat.getResource ? this.i18nFormat.getResource(r, A, s, o) : this.resourceStore.getResource(r, A, s, o);
    }
  }], [{
    key: "hasDefaultValue",
    value: function(r) {
      var A = "defaultValue";
      for (var s in r)
        if (Object.prototype.hasOwnProperty.call(r, s) && A === s.substring(0, A.length) && r[s] !== void 0)
          return !0;
      return !1;
    }
  }]), e;
})(me);
function Gr(i) {
  return i.charAt(0).toUpperCase() + i.slice(1);
}
var jg = (function() {
  function i(t) {
    re(this, i), this.options = t, this.supportedLngs = this.options.supportedLngs || !1, this.logger = $t.create("languageUtils");
  }
  return ie(i, [{
    key: "getScriptPartFromCode",
    value: function(e) {
      if (!e || e.indexOf("-") < 0) return null;
      var n = e.split("-");
      return n.length === 2 || (n.pop(), n[n.length - 1].toLowerCase() === "x") ? null : this.formatLanguageCode(n.join("-"));
    }
  }, {
    key: "getLanguagePartFromCode",
    value: function(e) {
      if (!e || e.indexOf("-") < 0) return e;
      var n = e.split("-");
      return this.formatLanguageCode(n[0]);
    }
  }, {
    key: "formatLanguageCode",
    value: function(e) {
      if (typeof e == "string" && e.indexOf("-") > -1) {
        var n = ["hans", "hant", "latn", "cyrl", "cans", "mong", "arab"], r = e.split("-");
        return this.options.lowerCaseLng ? r = r.map(function(A) {
          return A.toLowerCase();
        }) : r.length === 2 ? (r[0] = r[0].toLowerCase(), r[1] = r[1].toUpperCase(), n.indexOf(r[1].toLowerCase()) > -1 && (r[1] = Gr(r[1].toLowerCase()))) : r.length === 3 && (r[0] = r[0].toLowerCase(), r[1].length === 2 && (r[1] = r[1].toUpperCase()), r[0] !== "sgn" && r[2].length === 2 && (r[2] = r[2].toUpperCase()), n.indexOf(r[1].toLowerCase()) > -1 && (r[1] = Gr(r[1].toLowerCase())), n.indexOf(r[2].toLowerCase()) > -1 && (r[2] = Gr(r[2].toLowerCase()))), r.join("-");
      }
      return this.options.cleanCode || this.options.lowerCaseLng ? e.toLowerCase() : e;
    }
  }, {
    key: "isSupportedCode",
    value: function(e) {
      return (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) && (e = this.getLanguagePartFromCode(e)), !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(e) > -1;
    }
  }, {
    key: "getBestMatchFromCodes",
    value: function(e) {
      var n = this;
      if (!e) return null;
      var r;
      return e.forEach(function(A) {
        if (!r) {
          var s = n.formatLanguageCode(A);
          (!n.options.supportedLngs || n.isSupportedCode(s)) && (r = s);
        }
      }), !r && this.options.supportedLngs && e.forEach(function(A) {
        if (!r) {
          var s = n.getLanguagePartFromCode(A);
          if (n.isSupportedCode(s)) return r = s;
          r = n.options.supportedLngs.find(function(o) {
            if (o.indexOf(s) === 0) return o;
          });
        }
      }), r || (r = this.getFallbackCodes(this.options.fallbackLng)[0]), r;
    }
  }, {
    key: "getFallbackCodes",
    value: function(e, n) {
      if (!e) return [];
      if (typeof e == "function" && (e = e(n)), typeof e == "string" && (e = [e]), Object.prototype.toString.apply(e) === "[object Array]") return e;
      if (!n) return e.default || [];
      var r = e[n];
      return r || (r = e[this.getScriptPartFromCode(n)]), r || (r = e[this.formatLanguageCode(n)]), r || (r = e[this.getLanguagePartFromCode(n)]), r || (r = e.default), r || [];
    }
  }, {
    key: "toResolveHierarchy",
    value: function(e, n) {
      var r = this, A = this.getFallbackCodes(n || this.options.fallbackLng || [], e), s = [], o = function(a) {
        a && (r.isSupportedCode(a) ? s.push(a) : r.logger.warn("rejecting language code not found in supportedLngs: ".concat(a)));
      };
      return typeof e == "string" && e.indexOf("-") > -1 ? (this.options.load !== "languageOnly" && o(this.formatLanguageCode(e)), this.options.load !== "languageOnly" && this.options.load !== "currentOnly" && o(this.getScriptPartFromCode(e)), this.options.load !== "currentOnly" && o(this.getLanguagePartFromCode(e))) : typeof e == "string" && o(this.formatLanguageCode(e)), A.forEach(function(g) {
        s.indexOf(g) < 0 && o(r.formatLanguageCode(g));
      }), s;
    }
  }]), i;
})(), Lg = [{
  lngs: ["ach", "ak", "am", "arn", "br", "fil", "gun", "ln", "mfe", "mg", "mi", "oc", "pt", "pt-BR", "tg", "tl", "ti", "tr", "uz", "wa"],
  nr: [1, 2],
  fc: 1
}, {
  lngs: ["af", "an", "ast", "az", "bg", "bn", "ca", "da", "de", "dev", "el", "en", "eo", "es", "et", "eu", "fi", "fo", "fur", "fy", "gl", "gu", "ha", "hi", "hu", "hy", "ia", "it", "kk", "kn", "ku", "lb", "mai", "ml", "mn", "mr", "nah", "nap", "nb", "ne", "nl", "nn", "no", "nso", "pa", "pap", "pms", "ps", "pt-PT", "rm", "sco", "se", "si", "so", "son", "sq", "sv", "sw", "ta", "te", "tk", "ur", "yo"],
  nr: [1, 2],
  fc: 2
}, {
  lngs: ["ay", "bo", "cgg", "fa", "ht", "id", "ja", "jbo", "ka", "km", "ko", "ky", "lo", "ms", "sah", "su", "th", "tt", "ug", "vi", "wo", "zh"],
  nr: [1],
  fc: 3
}, {
  lngs: ["be", "bs", "cnr", "dz", "hr", "ru", "sr", "uk"],
  nr: [1, 2, 5],
  fc: 4
}, {
  lngs: ["ar"],
  nr: [0, 1, 2, 3, 11, 100],
  fc: 5
}, {
  lngs: ["cs", "sk"],
  nr: [1, 2, 5],
  fc: 6
}, {
  lngs: ["csb", "pl"],
  nr: [1, 2, 5],
  fc: 7
}, {
  lngs: ["cy"],
  nr: [1, 2, 3, 8],
  fc: 8
}, {
  lngs: ["fr"],
  nr: [1, 2],
  fc: 9
}, {
  lngs: ["ga"],
  nr: [1, 2, 3, 7, 11],
  fc: 10
}, {
  lngs: ["gd"],
  nr: [1, 2, 3, 20],
  fc: 11
}, {
  lngs: ["is"],
  nr: [1, 2],
  fc: 12
}, {
  lngs: ["jv"],
  nr: [0, 1],
  fc: 13
}, {
  lngs: ["kw"],
  nr: [1, 2, 3, 4],
  fc: 14
}, {
  lngs: ["lt"],
  nr: [1, 2, 10],
  fc: 15
}, {
  lngs: ["lv"],
  nr: [1, 2, 0],
  fc: 16
}, {
  lngs: ["mk"],
  nr: [1, 2],
  fc: 17
}, {
  lngs: ["mnk"],
  nr: [0, 1, 2],
  fc: 18
}, {
  lngs: ["mt"],
  nr: [1, 2, 11, 20],
  fc: 19
}, {
  lngs: ["or"],
  nr: [2, 1],
  fc: 2
}, {
  lngs: ["ro"],
  nr: [1, 2, 20],
  fc: 20
}, {
  lngs: ["sl"],
  nr: [5, 1, 2, 3],
  fc: 21
}, {
  lngs: ["he", "iw"],
  nr: [1, 2, 20, 21],
  fc: 22
}], kg = {
  1: function(t) {
    return +(t > 1);
  },
  2: function(t) {
    return +(t != 1);
  },
  3: function(t) {
    return 0;
  },
  4: function(t) {
    return t % 10 == 1 && t % 100 != 11 ? 0 : t % 10 >= 2 && t % 10 <= 4 && (t % 100 < 10 || t % 100 >= 20) ? 1 : 2;
  },
  5: function(t) {
    return t == 0 ? 0 : t == 1 ? 1 : t == 2 ? 2 : t % 100 >= 3 && t % 100 <= 10 ? 3 : t % 100 >= 11 ? 4 : 5;
  },
  6: function(t) {
    return t == 1 ? 0 : t >= 2 && t <= 4 ? 1 : 2;
  },
  7: function(t) {
    return t == 1 ? 0 : t % 10 >= 2 && t % 10 <= 4 && (t % 100 < 10 || t % 100 >= 20) ? 1 : 2;
  },
  8: function(t) {
    return t == 1 ? 0 : t == 2 ? 1 : t != 8 && t != 11 ? 2 : 3;
  },
  9: function(t) {
    return +(t >= 2);
  },
  10: function(t) {
    return t == 1 ? 0 : t == 2 ? 1 : t < 7 ? 2 : t < 11 ? 3 : 4;
  },
  11: function(t) {
    return t == 1 || t == 11 ? 0 : t == 2 || t == 12 ? 1 : t > 2 && t < 20 ? 2 : 3;
  },
  12: function(t) {
    return +(t % 10 != 1 || t % 100 == 11);
  },
  13: function(t) {
    return +(t !== 0);
  },
  14: function(t) {
    return t == 1 ? 0 : t == 2 ? 1 : t == 3 ? 2 : 3;
  },
  15: function(t) {
    return t % 10 == 1 && t % 100 != 11 ? 0 : t % 10 >= 2 && (t % 100 < 10 || t % 100 >= 20) ? 1 : 2;
  },
  16: function(t) {
    return t % 10 == 1 && t % 100 != 11 ? 0 : t !== 0 ? 1 : 2;
  },
  17: function(t) {
    return t == 1 || t % 10 == 1 && t % 100 != 11 ? 0 : 1;
  },
  18: function(t) {
    return t == 0 ? 0 : t == 1 ? 1 : 2;
  },
  19: function(t) {
    return t == 1 ? 0 : t == 0 || t % 100 > 1 && t % 100 < 11 ? 1 : t % 100 > 10 && t % 100 < 20 ? 2 : 3;
  },
  20: function(t) {
    return t == 1 ? 0 : t == 0 || t % 100 > 0 && t % 100 < 20 ? 1 : 2;
  },
  21: function(t) {
    return t % 100 == 1 ? 1 : t % 100 == 2 ? 2 : t % 100 == 3 || t % 100 == 4 ? 3 : 0;
  },
  22: function(t) {
    return t == 1 ? 0 : t == 2 ? 1 : (t < 0 || t > 10) && t % 10 == 0 ? 2 : 3;
  }
}, Ng = ["v1", "v2", "v3"], CA = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
};
function Gg() {
  var i = {};
  return Lg.forEach(function(t) {
    t.lngs.forEach(function(e) {
      i[e] = {
        numbers: t.nr,
        plurals: kg[t.fc]
      };
    });
  }), i;
}
var Xg = (function() {
  function i(t) {
    var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    re(this, i), this.languageUtils = t, this.options = e, this.logger = $t.create("pluralResolver"), (!this.options.compatibilityJSON || this.options.compatibilityJSON === "v4") && (typeof Intl > "u" || !Intl.PluralRules) && (this.options.compatibilityJSON = "v3", this.logger.error("Your environment seems not to be Intl API compatible, use an Intl.PluralRules polyfill. Will fallback to the compatibilityJSON v3 format handling.")), this.rules = Gg();
  }
  return ie(i, [{
    key: "addRule",
    value: function(e, n) {
      this.rules[e] = n;
    }
  }, {
    key: "getRule",
    value: function(e) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      if (this.shouldUseIntlApi())
        try {
          return new Intl.PluralRules(e, {
            type: n.ordinal ? "ordinal" : "cardinal"
          });
        } catch {
          return;
        }
      return this.rules[e] || this.rules[this.languageUtils.getLanguagePartFromCode(e)];
    }
  }, {
    key: "needsPlural",
    value: function(e) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = this.getRule(e, n);
      return this.shouldUseIntlApi() ? r && r.resolvedOptions().pluralCategories.length > 1 : r && r.numbers.length > 1;
    }
  }, {
    key: "getPluralFormsOfKey",
    value: function(e, n) {
      var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this.getSuffixes(e, r).map(function(A) {
        return "".concat(n).concat(A);
      });
    }
  }, {
    key: "getSuffixes",
    value: function(e) {
      var n = this, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, A = this.getRule(e, r);
      return A ? this.shouldUseIntlApi() ? A.resolvedOptions().pluralCategories.sort(function(s, o) {
        return CA[s] - CA[o];
      }).map(function(s) {
        return "".concat(n.options.prepend).concat(s);
      }) : A.numbers.map(function(s) {
        return n.getSuffix(e, s, r);
      }) : [];
    }
  }, {
    key: "getSuffix",
    value: function(e, n) {
      var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, A = this.getRule(e, r);
      return A ? this.shouldUseIntlApi() ? "".concat(this.options.prepend).concat(A.select(n)) : this.getSuffixRetroCompatible(A, n) : (this.logger.warn("no plural rule found for: ".concat(e)), "");
    }
  }, {
    key: "getSuffixRetroCompatible",
    value: function(e, n) {
      var r = this, A = e.noAbs ? e.plurals(n) : e.plurals(Math.abs(n)), s = e.numbers[A];
      this.options.simplifyPluralSuffix && e.numbers.length === 2 && e.numbers[0] === 1 && (s === 2 ? s = "plural" : s === 1 && (s = ""));
      var o = function() {
        return r.options.prepend && s.toString() ? r.options.prepend + s.toString() : s.toString();
      };
      return this.options.compatibilityJSON === "v1" ? s === 1 ? "" : typeof s == "number" ? "_plural_".concat(s.toString()) : o() : this.options.compatibilityJSON === "v2" || this.options.simplifyPluralSuffix && e.numbers.length === 2 && e.numbers[0] === 1 ? o() : this.options.prepend && A.toString() ? this.options.prepend + A.toString() : A.toString();
    }
  }, {
    key: "shouldUseIntlApi",
    value: function() {
      return !Ng.includes(this.options.compatibilityJSON);
    }
  }]), i;
})();
function cA(i, t) {
  var e = Object.keys(i);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(i);
    t && (n = n.filter(function(r) {
      return Object.getOwnPropertyDescriptor(i, r).enumerable;
    })), e.push.apply(e, n);
  }
  return e;
}
function zt(i) {
  for (var t = 1; t < arguments.length; t++) {
    var e = arguments[t] != null ? arguments[t] : {};
    t % 2 ? cA(Object(e), !0).forEach(function(n) {
      be(i, n, e[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(e)) : cA(Object(e)).forEach(function(n) {
      Object.defineProperty(i, n, Object.getOwnPropertyDescriptor(e, n));
    });
  }
  return i;
}
var Zg = (function() {
  function i() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    re(this, i), this.logger = $t.create("interpolator"), this.options = t, this.format = t.interpolation && t.interpolation.format || function(e) {
      return e;
    }, this.init(t);
  }
  return ie(i, [{
    key: "init",
    value: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      e.interpolation || (e.interpolation = {
        escapeValue: !0
      });
      var n = e.interpolation;
      this.escape = n.escape !== void 0 ? n.escape : Pg, this.escapeValue = n.escapeValue !== void 0 ? n.escapeValue : !0, this.useRawValueToEscape = n.useRawValueToEscape !== void 0 ? n.useRawValueToEscape : !1, this.prefix = n.prefix ? Fe(n.prefix) : n.prefixEscaped || "{{", this.suffix = n.suffix ? Fe(n.suffix) : n.suffixEscaped || "}}", this.formatSeparator = n.formatSeparator ? n.formatSeparator : n.formatSeparator || ",", this.unescapePrefix = n.unescapeSuffix ? "" : n.unescapePrefix || "-", this.unescapeSuffix = this.unescapePrefix ? "" : n.unescapeSuffix || "", this.nestingPrefix = n.nestingPrefix ? Fe(n.nestingPrefix) : n.nestingPrefixEscaped || Fe("$t("), this.nestingSuffix = n.nestingSuffix ? Fe(n.nestingSuffix) : n.nestingSuffixEscaped || Fe(")"), this.nestingOptionsSeparator = n.nestingOptionsSeparator ? n.nestingOptionsSeparator : n.nestingOptionsSeparator || ",", this.maxReplaces = n.maxReplaces ? n.maxReplaces : 1e3, this.alwaysFormat = n.alwaysFormat !== void 0 ? n.alwaysFormat : !1, this.resetRegExp();
    }
  }, {
    key: "reset",
    value: function() {
      this.options && this.init(this.options);
    }
  }, {
    key: "resetRegExp",
    value: function() {
      var e = "".concat(this.prefix, "(.+?)").concat(this.suffix);
      this.regexp = new RegExp(e, "g");
      var n = "".concat(this.prefix).concat(this.unescapePrefix, "(.+?)").concat(this.unescapeSuffix).concat(this.suffix);
      this.regexpUnescape = new RegExp(n, "g");
      var r = "".concat(this.nestingPrefix, "(.+?)").concat(this.nestingSuffix);
      this.nestingRegexp = new RegExp(r, "g");
    }
  }, {
    key: "interpolate",
    value: function(e, n, r, A) {
      var s = this, o, g, a, I = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};
      function C(m) {
        return m.replace(/\$/g, "$$$$");
      }
      var c = function(p) {
        if (p.indexOf(s.formatSeparator) < 0) {
          var v = sA(n, I, p);
          return s.alwaysFormat ? s.format(v, void 0, r, zt(zt(zt({}, A), n), {}, {
            interpolationkey: p
          })) : v;
        }
        var D = p.split(s.formatSeparator), T = D.shift().trim(), U = D.join(s.formatSeparator).trim();
        return s.format(sA(n, I, T), U, r, zt(zt(zt({}, A), n), {}, {
          interpolationkey: T
        }));
      };
      this.resetRegExp();
      var l = A && A.missingInterpolationHandler || this.options.missingInterpolationHandler, h = A && A.interpolation && A.interpolation.skipOnVariables !== void 0 ? A.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables, u = [{
        regex: this.regexpUnescape,
        safeValue: function(p) {
          return C(p);
        }
      }, {
        regex: this.regexp,
        safeValue: function(p) {
          return s.escapeValue ? C(s.escape(p)) : C(p);
        }
      }];
      return u.forEach(function(m) {
        for (a = 0; o = m.regex.exec(e); ) {
          var p = o[1].trim();
          if (g = c(p), g === void 0)
            if (typeof l == "function") {
              var v = l(e, o, A);
              g = typeof v == "string" ? v : "";
            } else if (A && A.hasOwnProperty(p))
              g = "";
            else if (h) {
              g = o[0];
              continue;
            } else
              s.logger.warn("missed to pass in variable ".concat(p, " for interpolating ").concat(e)), g = "";
          else typeof g != "string" && !s.useRawValueToEscape && (g = iA(g));
          var D = m.safeValue(g);
          if (e = e.replace(o[0], D), h ? (m.regex.lastIndex += g.length, m.regex.lastIndex -= o[0].length) : m.regex.lastIndex = 0, a++, a >= s.maxReplaces)
            break;
        }
      }), e;
    }
  }, {
    key: "nest",
    value: function(e, n) {
      var r = this, A = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, s, o, g = zt({}, A);
      g.applyPostProcessor = !1, delete g.defaultValue;
      function a(l, h) {
        var u = this.nestingOptionsSeparator;
        if (l.indexOf(u) < 0) return l;
        var m = l.split(new RegExp("".concat(u, "[ ]*{"))), p = "{".concat(m[1]);
        l = m[0], p = this.interpolate(p, g);
        var v = p.match(/'/g), D = p.match(/"/g);
        (v && v.length % 2 === 0 && !D || D.length % 2 !== 0) && (p = p.replace(/'/g, '"'));
        try {
          g = JSON.parse(p), h && (g = zt(zt({}, h), g));
        } catch (T) {
          return this.logger.warn("failed parsing options string in nesting for key ".concat(l), T), "".concat(l).concat(u).concat(p);
        }
        return delete g.defaultValue, l;
      }
      for (; s = this.nestingRegexp.exec(e); ) {
        var I = [], C = !1;
        if (s[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(s[1])) {
          var c = s[1].split(this.formatSeparator).map(function(l) {
            return l.trim();
          });
          s[1] = c.shift(), I = c, C = !0;
        }
        if (o = n(a.call(this, s[1].trim(), g), g), o && s[0] === e && typeof o != "string") return o;
        typeof o != "string" && (o = iA(o)), o || (this.logger.warn("missed to resolve ".concat(s[1], " for nesting ").concat(e)), o = ""), C && (o = I.reduce(function(l, h) {
          return r.format(l, h, A.lng, zt(zt({}, A), {}, {
            interpolationkey: s[1].trim()
          }));
        }, o.trim())), e = e.replace(s[0], o), this.regexp.lastIndex = 0;
      }
      return e;
    }
  }]), i;
})();
function lA(i, t) {
  var e = Object.keys(i);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(i);
    t && (n = n.filter(function(r) {
      return Object.getOwnPropertyDescriptor(i, r).enumerable;
    })), e.push.apply(e, n);
  }
  return e;
}
function ue(i) {
  for (var t = 1; t < arguments.length; t++) {
    var e = arguments[t] != null ? arguments[t] : {};
    t % 2 ? lA(Object(e), !0).forEach(function(n) {
      be(i, n, e[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(e)) : lA(Object(e)).forEach(function(n) {
      Object.defineProperty(i, n, Object.getOwnPropertyDescriptor(e, n));
    });
  }
  return i;
}
function Fg(i) {
  var t = i.toLowerCase().trim(), e = {};
  if (i.indexOf("(") > -1) {
    var n = i.split("(");
    t = n[0].toLowerCase().trim();
    var r = n[1].substring(0, n[1].length - 1);
    if (t === "currency" && r.indexOf(":") < 0)
      e.currency || (e.currency = r.trim());
    else if (t === "relativetime" && r.indexOf(":") < 0)
      e.range || (e.range = r.trim());
    else {
      var A = r.split(";");
      A.forEach(function(s) {
        if (s) {
          var o = s.split(":"), g = yg(o), a = g[0], I = g.slice(1), C = I.join(":").trim().replace(/^'+|'+$/g, "");
          e[a.trim()] || (e[a.trim()] = C), C === "false" && (e[a.trim()] = !1), C === "true" && (e[a.trim()] = !0), isNaN(C) || (e[a.trim()] = parseInt(C, 10));
        }
      });
    }
  }
  return {
    formatName: t,
    formatOptions: e
  };
}
function Ue(i) {
  var t = {};
  return function(n, r, A) {
    var s = r + JSON.stringify(A), o = t[s];
    return o || (o = i(r, A), t[s] = o), o(n);
  };
}
var Ug = (function() {
  function i() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    re(this, i), this.logger = $t.create("formatter"), this.options = t, this.formats = {
      number: Ue(function(e, n) {
        var r = new Intl.NumberFormat(e, n);
        return function(A) {
          return r.format(A);
        };
      }),
      currency: Ue(function(e, n) {
        var r = new Intl.NumberFormat(e, ue(ue({}, n), {}, {
          style: "currency"
        }));
        return function(A) {
          return r.format(A);
        };
      }),
      datetime: Ue(function(e, n) {
        var r = new Intl.DateTimeFormat(e, ue({}, n));
        return function(A) {
          return r.format(A);
        };
      }),
      relativetime: Ue(function(e, n) {
        var r = new Intl.RelativeTimeFormat(e, ue({}, n));
        return function(A) {
          return r.format(A, n.range || "day");
        };
      }),
      list: Ue(function(e, n) {
        var r = new Intl.ListFormat(e, ue({}, n));
        return function(A) {
          return r.format(A);
        };
      })
    }, this.init(t);
  }
  return ie(i, [{
    key: "init",
    value: function(e) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
        interpolation: {}
      }, r = n.interpolation;
      this.formatSeparator = r.formatSeparator ? r.formatSeparator : r.formatSeparator || ",";
    }
  }, {
    key: "add",
    value: function(e, n) {
      this.formats[e.toLowerCase().trim()] = n;
    }
  }, {
    key: "addCached",
    value: function(e, n) {
      this.formats[e.toLowerCase().trim()] = Ue(n);
    }
  }, {
    key: "format",
    value: function(e, n, r, A) {
      var s = this, o = n.split(this.formatSeparator), g = o.reduce(function(a, I) {
        var C = Fg(I), c = C.formatName, l = C.formatOptions;
        if (s.formats[c]) {
          var h = a;
          try {
            var u = A && A.formatParams && A.formatParams[A.interpolationkey] || {}, m = u.locale || u.lng || A.locale || A.lng || r;
            h = s.formats[c](a, m, ue(ue(ue({}, l), A), u));
          } catch (p) {
            s.logger.warn(p);
          }
          return h;
        } else
          s.logger.warn("there was no format function for ".concat(c));
        return a;
      }, e);
      return g;
    }
  }]), i;
})();
function uA(i, t) {
  var e = Object.keys(i);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(i);
    t && (n = n.filter(function(r) {
      return Object.getOwnPropertyDescriptor(i, r).enumerable;
    })), e.push.apply(e, n);
  }
  return e;
}
function hA(i) {
  for (var t = 1; t < arguments.length; t++) {
    var e = arguments[t] != null ? arguments[t] : {};
    t % 2 ? uA(Object(e), !0).forEach(function(n) {
      be(i, n, e[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(e)) : uA(Object(e)).forEach(function(n) {
      Object.defineProperty(i, n, Object.getOwnPropertyDescriptor(e, n));
    });
  }
  return i;
}
function zg(i) {
  var t = Hg();
  return function() {
    var n = ee(i), r;
    if (t) {
      var A = ee(this).constructor;
      r = Reflect.construct(n, arguments, A);
    } else
      r = n.apply(this, arguments);
    return Tn(this, r);
  };
}
function Hg() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
function Qg(i, t) {
  i.pending[t] !== void 0 && (delete i.pending[t], i.pendingCount--);
}
var Wg = (function(i) {
  yr(e, i);
  var t = zg(e);
  function e(n, r, A) {
    var s, o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    return re(this, e), s = t.call(this), vr && me.call(pe(s)), s.backend = n, s.store = r, s.services = A, s.languageUtils = A.languageUtils, s.options = o, s.logger = $t.create("backendConnector"), s.waitingReads = [], s.maxParallelReads = o.maxParallelReads || 10, s.readingCalls = 0, s.maxRetries = o.maxRetries >= 0 ? o.maxRetries : 5, s.retryTimeout = o.retryTimeout >= 1 ? o.retryTimeout : 350, s.state = {}, s.queue = [], s.backend && s.backend.init && s.backend.init(A, o.backend, o), s;
  }
  return ie(e, [{
    key: "queueLoad",
    value: function(r, A, s, o) {
      var g = this, a = {}, I = {}, C = {}, c = {};
      return r.forEach(function(l) {
        var h = !0;
        A.forEach(function(u) {
          var m = "".concat(l, "|").concat(u);
          !s.reload && g.store.hasResourceBundle(l, u) ? g.state[m] = 2 : g.state[m] < 0 || (g.state[m] === 1 ? I[m] === void 0 && (I[m] = !0) : (g.state[m] = 1, h = !1, I[m] === void 0 && (I[m] = !0), a[m] === void 0 && (a[m] = !0), c[u] === void 0 && (c[u] = !0)));
        }), h || (C[l] = !0);
      }), (Object.keys(a).length || Object.keys(I).length) && this.queue.push({
        pending: I,
        pendingCount: Object.keys(I).length,
        loaded: {},
        errors: [],
        callback: o
      }), {
        toLoad: Object.keys(a),
        pending: Object.keys(I),
        toLoadLanguages: Object.keys(C),
        toLoadNamespaces: Object.keys(c)
      };
    }
  }, {
    key: "loaded",
    value: function(r, A, s) {
      var o = r.split("|"), g = o[0], a = o[1];
      A && this.emit("failedLoading", g, a, A), s && this.store.addResourceBundle(g, a, s), this.state[r] = A ? -1 : 2;
      var I = {};
      this.queue.forEach(function(C) {
        Eg(C.loaded, [g], a), Qg(C, r), A && C.errors.push(A), C.pendingCount === 0 && !C.done && (Object.keys(C.loaded).forEach(function(c) {
          I[c] || (I[c] = {});
          var l = C.loaded[c];
          l.length && l.forEach(function(h) {
            I[c][h] === void 0 && (I[c][h] = !0);
          });
        }), C.done = !0, C.errors.length ? C.callback(C.errors) : C.callback());
      }), this.emit("loaded", I), this.queue = this.queue.filter(function(C) {
        return !C.done;
      });
    }
  }, {
    key: "read",
    value: function(r, A, s) {
      var o = this, g = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0, a = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : this.retryTimeout, I = arguments.length > 5 ? arguments[5] : void 0;
      if (!r.length) return I(null, {});
      if (this.readingCalls >= this.maxParallelReads) {
        this.waitingReads.push({
          lng: r,
          ns: A,
          fcName: s,
          tried: g,
          wait: a,
          callback: I
        });
        return;
      }
      return this.readingCalls++, this.backend[s](r, A, function(C, c) {
        if (o.readingCalls--, o.waitingReads.length > 0) {
          var l = o.waitingReads.shift();
          o.read(l.lng, l.ns, l.fcName, l.tried, l.wait, l.callback);
        }
        if (C && c && g < o.maxRetries) {
          setTimeout(function() {
            o.read.call(o, r, A, s, g + 1, a * 2, I);
          }, a);
          return;
        }
        I(C, c);
      });
    }
  }, {
    key: "prepareLoading",
    value: function(r, A) {
      var s = this, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, g = arguments.length > 3 ? arguments[3] : void 0;
      if (!this.backend)
        return this.logger.warn("No backend was added via i18next.use. Will not load resources."), g && g();
      typeof r == "string" && (r = this.languageUtils.toResolveHierarchy(r)), typeof A == "string" && (A = [A]);
      var a = this.queueLoad(r, A, o, g);
      if (!a.toLoad.length)
        return a.pending.length || g(), null;
      a.toLoad.forEach(function(I) {
        s.loadOne(I);
      });
    }
  }, {
    key: "load",
    value: function(r, A, s) {
      this.prepareLoading(r, A, {}, s);
    }
  }, {
    key: "reload",
    value: function(r, A, s) {
      this.prepareLoading(r, A, {
        reload: !0
      }, s);
    }
  }, {
    key: "loadOne",
    value: function(r) {
      var A = this, s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = r.split("|"), g = o[0], a = o[1];
      this.read(g, a, "read", void 0, void 0, function(I, C) {
        I && A.logger.warn("".concat(s, "loading namespace ").concat(a, " for language ").concat(g, " failed"), I), !I && C && A.logger.log("".concat(s, "loaded namespace ").concat(a, " for language ").concat(g), C), A.loaded(r, I, C);
      });
    }
  }, {
    key: "saveMissing",
    value: function(r, A, s, o, g) {
      var a = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {};
      if (this.services.utils && this.services.utils.hasLoadedNamespace && !this.services.utils.hasLoadedNamespace(A)) {
        this.logger.warn('did not save key "'.concat(s, '" as the namespace "').concat(A, '" was not yet loaded'), "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
        return;
      }
      s == null || s === "" || (this.backend && this.backend.create && this.backend.create(r, A, s, o, null, hA(hA({}, a), {}, {
        isUpdate: g
      })), !(!r || !r[0]) && this.store.addResource(r[0], A, s, o));
    }
  }]), e;
})(me);
function Vg() {
  return {
    debug: !1,
    initImmediate: !0,
    ns: ["translation"],
    defaultNS: ["translation"],
    fallbackLng: ["dev"],
    fallbackNS: !1,
    supportedLngs: !1,
    nonExplicitSupportedLngs: !1,
    load: "all",
    preload: !1,
    simplifyPluralSuffix: !0,
    keySeparator: ".",
    nsSeparator: ":",
    pluralSeparator: "_",
    contextSeparator: "_",
    partialBundledLanguages: !1,
    saveMissing: !1,
    updateMissing: !1,
    saveMissingTo: "fallback",
    saveMissingPlurals: !0,
    missingKeyHandler: !1,
    missingInterpolationHandler: !1,
    postProcess: !1,
    postProcessPassResolved: !1,
    returnNull: !0,
    returnEmptyString: !0,
    returnObjects: !1,
    joinArrays: !1,
    returnedObjectHandler: !1,
    parseMissingKeyHandler: !1,
    appendNamespaceToMissingKey: !1,
    appendNamespaceToCIMode: !1,
    overloadTranslationOptionHandler: function(t) {
      var e = {};
      if (Qt(t[1]) === "object" && (e = t[1]), typeof t[1] == "string" && (e.defaultValue = t[1]), typeof t[2] == "string" && (e.tDescription = t[2]), Qt(t[2]) === "object" || Qt(t[3]) === "object") {
        var n = t[3] || t[2];
        Object.keys(n).forEach(function(r) {
          e[r] = n[r];
        });
      }
      return e;
    },
    interpolation: {
      escapeValue: !0,
      format: function(t, e, n, r) {
        return t;
      },
      prefix: "{{",
      suffix: "}}",
      formatSeparator: ",",
      unescapePrefix: "-",
      nestingPrefix: "$t(",
      nestingSuffix: ")",
      nestingOptionsSeparator: ",",
      maxReplaces: 1e3,
      skipOnVariables: !0
    }
  };
}
function fA(i) {
  return typeof i.ns == "string" && (i.ns = [i.ns]), typeof i.fallbackLng == "string" && (i.fallbackLng = [i.fallbackLng]), typeof i.fallbackNS == "string" && (i.fallbackNS = [i.fallbackNS]), i.supportedLngs && i.supportedLngs.indexOf("cimode") < 0 && (i.supportedLngs = i.supportedLngs.concat(["cimode"])), i;
}
function dA(i, t) {
  var e = Object.keys(i);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(i);
    t && (n = n.filter(function(r) {
      return Object.getOwnPropertyDescriptor(i, r).enumerable;
    })), e.push.apply(e, n);
  }
  return e;
}
function Jt(i) {
  for (var t = 1; t < arguments.length; t++) {
    var e = arguments[t] != null ? arguments[t] : {};
    t % 2 ? dA(Object(e), !0).forEach(function(n) {
      be(i, n, e[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(e)) : dA(Object(e)).forEach(function(n) {
      Object.defineProperty(i, n, Object.getOwnPropertyDescriptor(e, n));
    });
  }
  return i;
}
function Yg(i) {
  var t = Kg();
  return function() {
    var n = ee(i), r;
    if (t) {
      var A = ee(this).constructor;
      r = Reflect.construct(n, arguments, A);
    } else
      r = n.apply(this, arguments);
    return Tn(this, r);
  };
}
function Kg() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
function Jn() {
}
function Jg(i) {
  var t = Object.getOwnPropertyNames(Object.getPrototypeOf(i));
  t.forEach(function(e) {
    typeof i[e] == "function" && (i[e] = i[e].bind(i));
  });
}
var cr = (function(i) {
  yr(e, i);
  var t = Yg(e);
  function e() {
    var n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, A = arguments.length > 1 ? arguments[1] : void 0;
    if (re(this, e), n = t.call(this), vr && me.call(pe(n)), n.options = fA(r), n.services = {}, n.logger = $t, n.modules = {
      external: []
    }, Jg(pe(n)), A && !n.isInitialized && !r.isClone) {
      if (!n.options.initImmediate)
        return n.init(r, A), Tn(n, pe(n));
      setTimeout(function() {
        n.init(r, A);
      }, 0);
    }
    return n;
  }
  return ie(e, [{
    key: "init",
    value: function() {
      var r = this, A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, s = arguments.length > 1 ? arguments[1] : void 0;
      typeof A == "function" && (s = A, A = {}), !A.defaultNS && A.defaultNS !== !1 && A.ns && (typeof A.ns == "string" ? A.defaultNS = A.ns : A.ns.indexOf("translation") < 0 && (A.defaultNS = A.ns[0]));
      var o = Vg();
      this.options = Jt(Jt(Jt({}, o), this.options), fA(A)), this.options.compatibilityAPI !== "v1" && (this.options.interpolation = Jt(Jt({}, o.interpolation), this.options.interpolation)), A.keySeparator !== void 0 && (this.options.userDefinedKeySeparator = A.keySeparator), A.nsSeparator !== void 0 && (this.options.userDefinedNsSeparator = A.nsSeparator);
      function g(p) {
        return p ? typeof p == "function" ? new p() : p : null;
      }
      if (!this.options.isClone) {
        this.modules.logger ? $t.init(g(this.modules.logger), this.options) : $t.init(null, this.options);
        var a;
        this.modules.formatter ? a = this.modules.formatter : typeof Intl < "u" && (a = Ug);
        var I = new jg(this.options);
        this.store = new Dg(this.options.resources, this.options);
        var C = this.services;
        C.logger = $t, C.resourceStore = this.store, C.languageUtils = I, C.pluralResolver = new Xg(I, {
          prepend: this.options.pluralSeparator,
          compatibilityJSON: this.options.compatibilityJSON,
          simplifyPluralSuffix: this.options.simplifyPluralSuffix
        }), a && (!this.options.interpolation.format || this.options.interpolation.format === o.interpolation.format) && (C.formatter = g(a), C.formatter.init(C, this.options), this.options.interpolation.format = C.formatter.format.bind(C.formatter)), C.interpolator = new Zg(this.options), C.utils = {
          hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
        }, C.backendConnector = new Wg(g(this.modules.backend), C.resourceStore, C, this.options), C.backendConnector.on("*", function(p) {
          for (var v = arguments.length, D = new Array(v > 1 ? v - 1 : 0), T = 1; T < v; T++)
            D[T - 1] = arguments[T];
          r.emit.apply(r, [p].concat(D));
        }), this.modules.languageDetector && (C.languageDetector = g(this.modules.languageDetector), C.languageDetector.init(C, this.options.detection, this.options)), this.modules.i18nFormat && (C.i18nFormat = g(this.modules.i18nFormat), C.i18nFormat.init && C.i18nFormat.init(this)), this.translator = new IA(this.services, this.options), this.translator.on("*", function(p) {
          for (var v = arguments.length, D = new Array(v > 1 ? v - 1 : 0), T = 1; T < v; T++)
            D[T - 1] = arguments[T];
          r.emit.apply(r, [p].concat(D));
        }), this.modules.external.forEach(function(p) {
          p.init && p.init(r);
        });
      }
      if (this.format = this.options.interpolation.format, s || (s = Jn), this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
        var c = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
        c.length > 0 && c[0] !== "dev" && (this.options.lng = c[0]);
      }
      !this.services.languageDetector && !this.options.lng && this.logger.warn("init: no languageDetector is used and no lng is defined");
      var l = ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"];
      l.forEach(function(p) {
        r[p] = function() {
          var v;
          return (v = r.store)[p].apply(v, arguments);
        };
      });
      var h = ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"];
      h.forEach(function(p) {
        r[p] = function() {
          var v;
          return (v = r.store)[p].apply(v, arguments), r;
        };
      });
      var u = In(), m = function() {
        var v = function(T, U) {
          r.isInitialized && !r.initializedStoreOnce && r.logger.warn("init: i18next is already initialized. You should call init just once!"), r.isInitialized = !0, r.options.isClone || r.logger.log("initialized", r.options), r.emit("initialized", r.options), u.resolve(U), s(T, U);
        };
        if (r.languages && r.options.compatibilityAPI !== "v1" && !r.isInitialized) return v(null, r.t.bind(r));
        r.changeLanguage(r.options.lng, v);
      };
      return this.options.resources || !this.options.initImmediate ? m() : setTimeout(m, 0), u;
    }
  }, {
    key: "loadResources",
    value: function(r) {
      var A = this, s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Jn, o = s, g = typeof r == "string" ? r : this.language;
      if (typeof r == "function" && (o = r), !this.options.resources || this.options.partialBundledLanguages) {
        if (g && g.toLowerCase() === "cimode") return o();
        var a = [], I = function(l) {
          if (l) {
            var h = A.services.languageUtils.toResolveHierarchy(l);
            h.forEach(function(u) {
              a.indexOf(u) < 0 && a.push(u);
            });
          }
        };
        if (g)
          I(g);
        else {
          var C = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
          C.forEach(function(c) {
            return I(c);
          });
        }
        this.options.preload && this.options.preload.forEach(function(c) {
          return I(c);
        }), this.services.backendConnector.load(a, this.options.ns, function(c) {
          !c && !A.resolvedLanguage && A.language && A.setResolvedLanguage(A.language), o(c);
        });
      } else
        o(null);
    }
  }, {
    key: "reloadResources",
    value: function(r, A, s) {
      var o = In();
      return r || (r = this.languages), A || (A = this.options.ns), s || (s = Jn), this.services.backendConnector.reload(r, A, function(g) {
        o.resolve(), s(g);
      }), o;
    }
  }, {
    key: "use",
    value: function(r) {
      if (!r) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
      if (!r.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
      return r.type === "backend" && (this.modules.backend = r), (r.type === "logger" || r.log && r.warn && r.error) && (this.modules.logger = r), r.type === "languageDetector" && (this.modules.languageDetector = r), r.type === "i18nFormat" && (this.modules.i18nFormat = r), r.type === "postProcessor" && Es.addPostProcessor(r), r.type === "formatter" && (this.modules.formatter = r), r.type === "3rdParty" && this.modules.external.push(r), this;
    }
  }, {
    key: "setResolvedLanguage",
    value: function(r) {
      if (!(!r || !this.languages) && !(["cimode", "dev"].indexOf(r) > -1))
        for (var A = 0; A < this.languages.length; A++) {
          var s = this.languages[A];
          if (!(["cimode", "dev"].indexOf(s) > -1) && this.store.hasLanguageSomeTranslations(s)) {
            this.resolvedLanguage = s;
            break;
          }
        }
    }
  }, {
    key: "changeLanguage",
    value: function(r, A) {
      var s = this;
      this.isLanguageChangingTo = r;
      var o = In();
      this.emit("languageChanging", r);
      var g = function(c) {
        s.language = c, s.languages = s.services.languageUtils.toResolveHierarchy(c), s.resolvedLanguage = void 0, s.setResolvedLanguage(c);
      }, a = function(c, l) {
        l ? (g(l), s.translator.changeLanguage(l), s.isLanguageChangingTo = void 0, s.emit("languageChanged", l), s.logger.log("languageChanged", l)) : s.isLanguageChangingTo = void 0, o.resolve(function() {
          return s.t.apply(s, arguments);
        }), A && A(c, function() {
          return s.t.apply(s, arguments);
        });
      }, I = function(c) {
        !r && !c && s.services.languageDetector && (c = []);
        var l = typeof c == "string" ? c : s.services.languageUtils.getBestMatchFromCodes(c);
        l && (s.language || g(l), s.translator.language || s.translator.changeLanguage(l), s.services.languageDetector && s.services.languageDetector.cacheUserLanguage(l)), s.loadResources(l, function(h) {
          a(h, l);
        });
      };
      return !r && this.services.languageDetector && !this.services.languageDetector.async ? I(this.services.languageDetector.detect()) : !r && this.services.languageDetector && this.services.languageDetector.async ? this.services.languageDetector.detect(I) : I(r), o;
    }
  }, {
    key: "getFixedT",
    value: function(r, A, s) {
      var o = this, g = function a(I, C) {
        var c;
        if (Qt(C) !== "object") {
          for (var l = arguments.length, h = new Array(l > 2 ? l - 2 : 0), u = 2; u < l; u++)
            h[u - 2] = arguments[u];
          c = o.options.overloadTranslationOptionHandler([I, C].concat(h));
        } else
          c = Jt({}, C);
        c.lng = c.lng || a.lng, c.lngs = c.lngs || a.lngs, c.ns = c.ns || a.ns, c.keyPrefix = c.keyPrefix || s || a.keyPrefix;
        var m = o.options.keySeparator || ".", p = c.keyPrefix ? "".concat(c.keyPrefix).concat(m).concat(I) : I;
        return o.t(p, c);
      };
      return typeof r == "string" ? g.lng = r : g.lngs = r, g.ns = A, g.keyPrefix = s, g;
    }
  }, {
    key: "t",
    value: function() {
      var r;
      return this.translator && (r = this.translator).translate.apply(r, arguments);
    }
  }, {
    key: "exists",
    value: function() {
      var r;
      return this.translator && (r = this.translator).exists.apply(r, arguments);
    }
  }, {
    key: "setDefaultNamespace",
    value: function(r) {
      this.options.defaultNS = r;
    }
  }, {
    key: "hasLoadedNamespace",
    value: function(r) {
      var A = this, s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      if (!this.isInitialized)
        return this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages), !1;
      if (!this.languages || !this.languages.length)
        return this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages), !1;
      var o = this.resolvedLanguage || this.languages[0], g = this.options ? this.options.fallbackLng : !1, a = this.languages[this.languages.length - 1];
      if (o.toLowerCase() === "cimode") return !0;
      var I = function(l, h) {
        var u = A.services.backendConnector.state["".concat(l, "|").concat(h)];
        return u === -1 || u === 2;
      };
      if (s.precheck) {
        var C = s.precheck(this, I);
        if (C !== void 0) return C;
      }
      return !!(this.hasResourceBundle(o, r) || !this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages || I(o, r) && (!g || I(a, r)));
    }
  }, {
    key: "loadNamespaces",
    value: function(r, A) {
      var s = this, o = In();
      return this.options.ns ? (typeof r == "string" && (r = [r]), r.forEach(function(g) {
        s.options.ns.indexOf(g) < 0 && s.options.ns.push(g);
      }), this.loadResources(function(g) {
        o.resolve(), A && A(g);
      }), o) : (A && A(), Promise.resolve());
    }
  }, {
    key: "loadLanguages",
    value: function(r, A) {
      var s = In();
      typeof r == "string" && (r = [r]);
      var o = this.options.preload || [], g = r.filter(function(a) {
        return o.indexOf(a) < 0;
      });
      return g.length ? (this.options.preload = o.concat(g), this.loadResources(function(a) {
        s.resolve(), A && A(a);
      }), s) : (A && A(), Promise.resolve());
    }
  }, {
    key: "dir",
    value: function(r) {
      if (r || (r = this.resolvedLanguage || (this.languages && this.languages.length > 0 ? this.languages[0] : this.language)), !r) return "rtl";
      var A = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"];
      return A.indexOf(this.services.languageUtils.getLanguagePartFromCode(r)) > -1 || r.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
    }
  }, {
    key: "cloneInstance",
    value: function() {
      var r = this, A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Jn, o = Jt(Jt(Jt({}, this.options), A), {
        isClone: !0
      }), g = new e(o);
      (A.debug !== void 0 || A.prefix !== void 0) && (g.logger = g.logger.clone(A));
      var a = ["store", "services", "language"];
      return a.forEach(function(I) {
        g[I] = r[I];
      }), g.services = Jt({}, this.services), g.services.utils = {
        hasLoadedNamespace: g.hasLoadedNamespace.bind(g)
      }, g.translator = new IA(g.services, g.options), g.translator.on("*", function(I) {
        for (var C = arguments.length, c = new Array(C > 1 ? C - 1 : 0), l = 1; l < C; l++)
          c[l - 1] = arguments[l];
        g.emit.apply(g, [I].concat(c));
      }), g.init(o, s), g.translator.options = g.options, g.translator.backendConnector.services.utils = {
        hasLoadedNamespace: g.hasLoadedNamespace.bind(g)
      }, g;
    }
  }, {
    key: "toJSON",
    value: function() {
      return {
        options: this.options,
        store: this.store,
        language: this.language,
        languages: this.languages,
        resolvedLanguage: this.resolvedLanguage
      };
    }
  }]), e;
})(me);
be(cr, "createInstance", function() {
  var i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = arguments.length > 1 ? arguments[1] : void 0;
  return new cr(i, t);
});
var Pt = cr.createInstance();
Pt.createInstance = cr.createInstance;
Pt.createInstance;
Pt.init;
Pt.loadResources;
Pt.reloadResources;
Pt.use;
Pt.changeLanguage;
Pt.getFixedT;
Pt.t;
Pt.exists;
Pt.setDefaultNamespace;
Pt.hasLoadedNamespace;
Pt.loadNamespaces;
Pt.loadLanguages;
function ei(i) {
  "@babel/helpers - typeof";
  return ei = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ei(i);
}
function Ms() {
  return typeof XMLHttpRequest == "function" || (typeof XMLHttpRequest > "u" ? "undefined" : ei(XMLHttpRequest)) === "object";
}
function qg(i) {
  return !!i && typeof i.then == "function";
}
function _g(i) {
  return qg(i) ? i : Promise.resolve(i);
}
function pA(i, t) {
  var e = Object.keys(i);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(i);
    t && (n = n.filter(function(r) {
      return Object.getOwnPropertyDescriptor(i, r).enumerable;
    })), e.push.apply(e, n);
  }
  return e;
}
function mA(i) {
  for (var t = 1; t < arguments.length; t++) {
    var e = arguments[t] != null ? arguments[t] : {};
    t % 2 ? pA(Object(e), !0).forEach(function(n) {
      $g(i, n, e[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(e)) : pA(Object(e)).forEach(function(n) {
      Object.defineProperty(i, n, Object.getOwnPropertyDescriptor(e, n));
    });
  }
  return i;
}
function $g(i, t, e) {
  return (t = ta(t)) in i ? Object.defineProperty(i, t, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : i[t] = e, i;
}
function ta(i) {
  var t = ea(i, "string");
  return je(t) == "symbol" ? t : t + "";
}
function ea(i, t) {
  if (je(i) != "object" || !i) return i;
  var e = i[Symbol.toPrimitive];
  if (e !== void 0) {
    var n = e.call(i, t);
    if (je(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(i);
}
function je(i) {
  "@babel/helpers - typeof";
  return je = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, je(i);
}
var ye = typeof fetch == "function" ? fetch : void 0;
typeof globalThis < "u" && globalThis.fetch ? ye = globalThis.fetch : typeof window < "u" && window.fetch && (ye = window.fetch);
var pn;
Ms() && (typeof globalThis < "u" && globalThis.XMLHttpRequest ? pn = globalThis.XMLHttpRequest : typeof window < "u" && window.XMLHttpRequest && (pn = window.XMLHttpRequest));
var lr;
typeof ActiveXObject == "function" && (typeof globalThis < "u" && globalThis.ActiveXObject ? lr = globalThis.ActiveXObject : typeof window < "u" && window.ActiveXObject && (lr = window.ActiveXObject));
typeof ye != "function" && (ye = void 0);
if (!ye && !pn && !lr)
  try {
    Promise.resolve().then(() => Hc).then(function(i) {
      ye = i.default;
    }).catch(function() {
    });
  } catch {
  }
var ni = function(t, e) {
  if (e && je(e) === "object") {
    var n = "";
    for (var r in e)
      n += "&" + encodeURIComponent(r) + "=" + encodeURIComponent(e[r]);
    if (!n) return t;
    t = t + (t.indexOf("?") !== -1 ? "&" : "?") + n.slice(1);
  }
  return t;
}, yA = function(t, e, n, r) {
  var A = function(g) {
    if (!g.ok) return n(g.statusText || "Error", {
      status: g.status
    });
    g.text().then(function(a) {
      n(null, {
        status: g.status,
        data: a
      });
    }).catch(n);
  };
  if (r) {
    var s = r(t, e);
    if (s instanceof Promise) {
      s.then(A).catch(n);
      return;
    }
  }
  typeof fetch == "function" ? fetch(t, e).then(A).catch(n) : ye(t, e).then(A).catch(n);
}, vA = !1, na = function(t, e, n, r) {
  t.queryStringParams && (e = ni(e, t.queryStringParams));
  var A = mA({}, typeof t.customHeaders == "function" ? t.customHeaders() : t.customHeaders);
  typeof window > "u" && typeof globalThis < "u" && typeof globalThis.process < "u" && globalThis.process.versions && globalThis.process.versions.node && (A["User-Agent"] = "i18next-http-backend (node/".concat(globalThis.process.version, "; ").concat(globalThis.process.platform, " ").concat(globalThis.process.arch, ")")), n && (A["Content-Type"] = "application/json");
  var s = typeof t.requestOptions == "function" ? t.requestOptions(n) : t.requestOptions, o = mA({
    method: n ? "POST" : "GET",
    body: n ? t.stringify(n) : void 0,
    headers: A
  }, vA ? {} : s), g = typeof t.alternateFetch == "function" && t.alternateFetch.length >= 1 ? t.alternateFetch : void 0;
  try {
    yA(e, o, r, g);
  } catch (a) {
    if (!s || Object.keys(s).length === 0 || !a.message || a.message.indexOf("not implemented") < 0)
      return r(a);
    try {
      Object.keys(s).forEach(function(I) {
        delete o[I];
      }), yA(e, o, r, g), vA = !0;
    } catch (I) {
      r(I);
    }
  }
}, ra = function(t, e, n, r) {
  n && je(n) === "object" && (n = ni("", n).slice(1)), t.queryStringParams && (e = ni(e, t.queryStringParams));
  try {
    var A = pn ? new pn() : new lr("MSXML2.XMLHTTP.3.0");
    A.open(n ? "POST" : "GET", e, 1), t.crossDomain || A.setRequestHeader("X-Requested-With", "XMLHttpRequest"), A.withCredentials = !!t.withCredentials, n && A.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), A.overrideMimeType && A.overrideMimeType("application/json");
    var s = t.customHeaders;
    if (s = typeof s == "function" ? s() : s, s)
      for (var o in s)
        A.setRequestHeader(o, s[o]);
    A.onreadystatechange = function() {
      A.readyState > 3 && r(A.status >= 400 ? A.statusText : null, {
        status: A.status,
        data: A.responseText
      });
    }, A.send(n);
  } catch (g) {
    console && console.log(g);
  }
}, ia = function(t, e, n, r) {
  if (typeof n == "function" && (r = n, n = void 0), r = r || function() {
  }, ye && e.indexOf("file:") !== 0)
    return na(t, e, n, r);
  if (Ms() || typeof ActiveXObject == "function")
    return ra(t, e, n, r);
  r(new Error("No fetch and no xhr implementation found!"));
};
function en(i) {
  "@babel/helpers - typeof";
  return en = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, en(i);
}
function bA(i, t) {
  var e = Object.keys(i);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(i);
    t && (n = n.filter(function(r) {
      return Object.getOwnPropertyDescriptor(i, r).enumerable;
    })), e.push.apply(e, n);
  }
  return e;
}
function Xr(i) {
  for (var t = 1; t < arguments.length; t++) {
    var e = arguments[t] != null ? arguments[t] : {};
    t % 2 ? bA(Object(e), !0).forEach(function(n) {
      Ps(i, n, e[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(e)) : bA(Object(e)).forEach(function(n) {
      Object.defineProperty(i, n, Object.getOwnPropertyDescriptor(e, n));
    });
  }
  return i;
}
function Aa(i, t) {
  if (!(i instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function sa(i, t) {
  for (var e = 0; e < t.length; e++) {
    var n = t[e];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(i, Rs(n.key), n);
  }
}
function oa(i, t, e) {
  return t && sa(i.prototype, t), Object.defineProperty(i, "prototype", { writable: !1 }), i;
}
function Ps(i, t, e) {
  return (t = Rs(t)) in i ? Object.defineProperty(i, t, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : i[t] = e, i;
}
function Rs(i) {
  var t = ga(i, "string");
  return en(t) == "symbol" ? t : t + "";
}
function ga(i, t) {
  if (en(i) != "object" || !i) return i;
  var e = i[Symbol.toPrimitive];
  if (e !== void 0) {
    var n = e.call(i, t);
    if (en(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(i);
}
var aa = function() {
  return {
    loadPath: "/locales/{{lng}}/{{ns}}.json",
    addPath: "/locales/add/{{lng}}/{{ns}}",
    parse: function(e) {
      return JSON.parse(e);
    },
    stringify: JSON.stringify,
    parsePayload: function(e, n, r) {
      return Ps({}, n, r || "");
    },
    parseLoadPayload: function(e, n) {
    },
    request: ia,
    reloadInterval: typeof window < "u" ? !1 : 3600 * 1e3,
    customHeaders: {},
    queryStringParams: {},
    crossDomain: !1,
    withCredentials: !1,
    overrideMimeType: !1,
    requestOptions: {
      mode: "cors",
      credentials: "same-origin",
      cache: "default"
    }
  };
}, xs = (function() {
  function i(t) {
    var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    Aa(this, i), this.services = t, this.options = e, this.allOptions = n, this.type = "backend", this.init(t, e, n);
  }
  return oa(i, [{
    key: "init",
    value: function(e) {
      var n = this, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, A = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (this.services = e, this.options = Xr(Xr(Xr({}, aa()), this.options || {}), r), this.allOptions = A, this.services && this.options.reloadInterval) {
        var s = setInterval(function() {
          return n.reload();
        }, this.options.reloadInterval);
        en(s) === "object" && typeof s.unref == "function" && s.unref();
      }
    }
  }, {
    key: "readMulti",
    value: function(e, n, r) {
      this._readAny(e, e, n, n, r);
    }
  }, {
    key: "read",
    value: function(e, n, r) {
      this._readAny([e], e, [n], n, r);
    }
  }, {
    key: "_readAny",
    value: function(e, n, r, A, s) {
      var o = this, g = this.options.loadPath;
      typeof this.options.loadPath == "function" && (g = this.options.loadPath(e, r)), g = _g(g), g.then(function(a) {
        if (!a) return s(null, {});
        var I = o.services.interpolator.interpolate(a, {
          lng: e.join("+"),
          ns: r.join("+")
        });
        o.loadUrl(I, s, n, A);
      });
    }
  }, {
    key: "loadUrl",
    value: function(e, n, r, A) {
      var s = this, o = typeof r == "string" ? [r] : r, g = typeof A == "string" ? [A] : A, a = this.options.parseLoadPayload(o, g);
      this.options.request(this.options, e, a, function(I, C) {
        if (C && (C.status >= 500 && C.status < 600 || !C.status)) return n("failed loading " + e + "; status code: " + C.status, !0);
        if (C && C.status >= 400 && C.status < 500) return n("failed loading " + e + "; status code: " + C.status, !1);
        if (!C && I && I.message) {
          var c = I.message.toLowerCase(), l = ["failed", "fetch", "network", "load"].find(function(m) {
            return c.indexOf(m) > -1;
          });
          if (l)
            return n("failed loading " + e + ": " + I.message, !0);
        }
        if (I) return n(I, !1);
        var h, u;
        try {
          typeof C.data == "string" ? h = s.options.parse(C.data, r, A) : h = C.data;
        } catch {
          u = "failed parsing " + e + " to json";
        }
        if (u) return n(u, !1);
        n(null, h);
      });
    }
  }, {
    key: "create",
    value: function(e, n, r, A, s) {
      var o = this;
      if (this.options.addPath) {
        typeof e == "string" && (e = [e]);
        var g = this.options.parsePayload(n, r, A), a = 0, I = [], C = [];
        e.forEach(function(c) {
          var l = o.options.addPath;
          typeof o.options.addPath == "function" && (l = o.options.addPath(c, n));
          var h = o.services.interpolator.interpolate(l, {
            lng: c,
            ns: n
          });
          o.options.request(o.options, h, g, function(u, m) {
            a += 1, I.push(u), C.push(m), a === e.length && typeof s == "function" && s(I, C);
          });
        });
      }
    }
  }, {
    key: "reload",
    value: function() {
      var e = this, n = this.services, r = n.backendConnector, A = n.languageUtils, s = n.logger, o = r.language;
      if (!(o && o.toLowerCase() === "cimode")) {
        var g = [], a = function(C) {
          var c = A.toResolveHierarchy(C);
          c.forEach(function(l) {
            g.indexOf(l) < 0 && g.push(l);
          });
        };
        a(o), this.allOptions.preload && this.allOptions.preload.forEach(function(I) {
          return a(I);
        }), g.forEach(function(I) {
          e.allOptions.ns.forEach(function(C) {
            r.read(I, C, "read", null, null, function(c, l) {
              c && s.warn("loading namespace ".concat(C, " for language ").concat(I, " failed"), c), !c && l && s.log("loaded namespace ".concat(C, " for language ").concat(I), l), r.loaded("".concat(I, "|").concat(C), c, l);
            });
          });
        });
      }
    }
  }]);
})();
xs.type = "backend";
class Ce {
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
let kt = class extends Ce {
  constructor(e, n) {
    super(e);
    M(this, "detail");
    this.detail = n;
  }
};
const Ia = () => {
  const i = window.navigator.userAgent.toLowerCase();
  try {
    let t;
    return i.indexOf("chrome") != -1 ? (t = (navigator.languages[0] || navigator.browserLanguage || navigator.language || navigator.userLanguage).split(";"), t[0]) : (t = (navigator.browserLanguage || navigator.language || navigator.userLanguage).split(";"), t[0]);
  } catch {
    return "";
  }
}, Ca = ["ALL", "OFF"], fn = {
  ALL: -99,
  DEBUG: -1,
  INFO: 0,
  WARN: 1,
  ERROR: 2,
  OFF: 99
};
class ca {
  constructor(t = fn.INFO) {
    this.level = t, this.make();
  }
  make() {
    const t = Object.keys(fn).filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (e) => !Ca.includes(e)
    );
    for (const e of t) {
      const n = fn[e], r = e.toLowerCase();
      this[r] = this.level <= n ? console.log : () => {
      };
    }
  }
}
const ht = 20037508342789244e-9, wA = [
  [0, 0],
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
], Ss = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAB3RJTUUH3QgIBToaSbAjlwAAABd0RVh0U29mdHdhcmUAR0xEUE5HIHZlciAzLjRxhaThAAAACHRwTkdHTEQzAAAAAEqAKR8AAAAEZ0FNQQAAsY8L/GEFAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAFRJREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgBDwABHHIJwwAAAABJRU5ErkJggg==", Se = 256, la = `<canvas width="${Se}" height="${Se}" src="${Ss}"></canvas>`;
async function EA(i) {
  return typeof i == "string" ? new Promise((t, e) => {
    const n = i.match(/\//) ? i : `pois/${i}`, r = new XMLHttpRequest();
    r.open("GET", n, !0), r.responseType = "json", r.onload = function(A) {
      if (this.status == 200 || this.status == 0)
        try {
          let s = this.response;
          typeof s == "string" && (s = JSON.parse(s)), t(s);
        } catch (s) {
          e(s);
        }
      else
        e("Fail to load poi json");
    }, r.send();
  }) : i;
}
function ua(i) {
  if (i.lnglat && Array.isArray(i.lnglat))
    return i.lnglat;
  if (i.lng !== void 0 && i.lat !== void 0)
    return [i.lng, i.lat];
  if (i.longitude !== void 0 && i.latitude !== void 0)
    return [i.longitude, i.latitude];
  throw new Error("POI missing coordinates");
}
async function Os(i, t) {
  if (i = await EA(i), Array.isArray(i))
    i = await Promise.all(i.map(async (e) => await EA(e))), i.length > 0 && i[0].type === "FeatureCollection" ? i = i.reduce((e, n, r) => {
      let A = n.id || n.properties && n.properties.id;
      if (!A)
        if (r === 0) A = "main";
        else throw "POI layers include bad key setting";
      return e[A] = Oe(n, A, t), e;
    }, {}) : i = {
      main: Oe(i, "main", t)
    };
  else if (i.type === "FeatureCollection") {
    const e = i.id || i.properties && i.properties.id || "main";
    i = { [e]: Oe(i, e, t) };
  } else
    Object.keys(i).map((e) => {
      i[e] = Oe(i[e], e, t);
    });
  return i.main || (i.main = Oe([], "main", t)), Object.keys(i).map((e) => {
    ui(i, e, t);
  }), i;
}
function Oe(i, t, e) {
  let n;
  if (Array.isArray(i))
    n = {
      type: "FeatureCollection",
      features: i.map((A) => mn(A)),
      id: t
    };
  else if (i.type === "FeatureCollection") {
    const r = i, A = Object.assign({}, r.properties || {});
    r.name && (A.name = r.name), A.type = "FeatureCollection", A.features = i.features.map((s) => mn(s)), A.id = t, n = A;
  } else
    n = {
      type: "FeatureCollection",
      features: [],
      id: t
    };
  return n.namespaceID || (n.namespaceID = `${e.namespace ? `${e.namespace}#` : ""}${t}`), n.name || (n.name = t === "main" ? e.name : t), n.features || (n.features = []), n;
}
function mn(i) {
  if (i.type === "Feature") {
    if (!i.geometry || !i.geometry.coordinates)
      throw new Error("Invalid GeoJSON Feature: missing geometry.coordinates");
    return i.properties || (i.properties = {}), !i.id && i.properties.id && (i.id = i.properties.id), i;
  }
  const t = i, e = ua(t), n = {};
  Object.keys(t).forEach((A) => {
    A !== "lnglat" && A !== "lng" && A !== "lat" && A !== "longitude" && A !== "latitude" && A !== "id" && (n[A] = t[A]);
  });
  const r = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: e
    },
    properties: n
  };
  return i.id && (r.id = i.id), r;
}
function ui(i, t, e) {
  if (!i[t]) return;
  const n = i[t], r = n.features;
  n.__nextId || (n.__nextId = 0), r.forEach((A) => {
    A.id || (A.id = `${t}_${n.__nextId ?? 0}`, n.__nextId = (n.__nextId ?? 0) + 1), A.properties || (A.properties = {}), A.properties.namespaceID || (A.properties.namespaceID = `${e.namespace ? `${e.namespace}#` : ""}${A.id}`);
  });
}
function yn(i, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = i, n;
}
function Ds(i, t, e = {}) {
  if (!i)
    throw new Error("coordinates is required");
  if (!Array.isArray(i))
    throw new Error("coordinates must be an Array");
  if (i.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!PA(i[0]) || !PA(i[1]))
    throw new Error("coordinates must contain numbers");
  return yn({
    type: "Point",
    coordinates: i
  }, t, e);
}
function gr(i, t, e = {}) {
  for (const r of i) {
    if (r.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (r[r.length - 1].length !== r[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let A = 0; A < r[r.length - 1].length; A++)
      if (r[r.length - 1][A] !== r[0][A])
        throw new Error("First and last Position are not equivalent.");
  }
  return yn({
    type: "Polygon",
    coordinates: i
  }, t, e);
}
function ha(i, t, e = {}) {
  if (i.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return yn({
    type: "LineString",
    coordinates: i
  }, t, e);
}
function MA(i, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = i, e;
}
function PA(i) {
  return !isNaN(i) && i !== null && !Array.isArray(i);
}
function fa(i) {
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
function da(i) {
  return i.type === "Feature" ? i.geometry : i;
}
function Bs(i, t, e) {
  if (i !== null)
    for (var n, r, A, s, o, g, a, I = 0, C = 0, c, l = i.type, h = l === "FeatureCollection", u = l === "Feature", m = h ? i.features.length : 1, p = 0; p < m; p++) {
      a = h ? i.features[p].geometry : u ? i.geometry : i, c = a ? a.type === "GeometryCollection" : !1, o = c ? a.geometries.length : 1;
      for (var v = 0; v < o; v++) {
        var D = 0, T = 0;
        if (s = c ? a.geometries[v] : a, s !== null) {
          g = s.coordinates;
          var U = s.type;
          switch (I = U === "Polygon" || U === "MultiPolygon" ? 1 : 0, U) {
            case null:
              break;
            case "Point":
              if (t(
                g,
                C,
                p,
                D,
                T
              ) === !1)
                return !1;
              C++, D++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < g.length; n++) {
                if (t(
                  g[n],
                  C,
                  p,
                  D,
                  T
                ) === !1)
                  return !1;
                C++, U === "MultiPoint" && D++;
              }
              U === "LineString" && D++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < g.length; n++) {
                for (r = 0; r < g[n].length - I; r++) {
                  if (t(
                    g[n][r],
                    C,
                    p,
                    D,
                    T
                  ) === !1)
                    return !1;
                  C++;
                }
                U === "MultiLineString" && D++, U === "Polygon" && T++;
              }
              U === "Polygon" && D++;
              break;
            case "MultiPolygon":
              for (n = 0; n < g.length; n++) {
                for (T = 0, r = 0; r < g[n].length; r++) {
                  for (A = 0; A < g[n][r].length - I; A++) {
                    if (t(
                      g[n][r][A],
                      C,
                      p,
                      D,
                      T
                    ) === !1)
                      return !1;
                    C++;
                  }
                  T++;
                }
                D++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < s.geometries.length; n++)
                if (Bs(s.geometries[n], t) === !1)
                  return !1;
              break;
            default:
              throw new Error("Unknown Geometry Type");
          }
        }
      }
    }
}
const Ie = 11102230246251565e-32, Rt = 134217729, pa = (3 + 8 * Ie) * Ie;
function Zr(i, t, e, n, r) {
  let A, s, o, g, a = t[0], I = n[0], C = 0, c = 0;
  I > a == I > -a ? (A = a, a = t[++C]) : (A = I, I = n[++c]);
  let l = 0;
  if (C < i && c < e)
    for (I > a == I > -a ? (s = a + A, o = A - (s - a), a = t[++C]) : (s = I + A, o = A - (s - I), I = n[++c]), A = s, o !== 0 && (r[l++] = o); C < i && c < e; )
      I > a == I > -a ? (s = A + a, g = s - A, o = A - (s - g) + (a - g), a = t[++C]) : (s = A + I, g = s - A, o = A - (s - g) + (I - g), I = n[++c]), A = s, o !== 0 && (r[l++] = o);
  for (; C < i; )
    s = A + a, g = s - A, o = A - (s - g) + (a - g), a = t[++C], A = s, o !== 0 && (r[l++] = o);
  for (; c < e; )
    s = A + I, g = s - A, o = A - (s - g) + (I - g), I = n[++c], A = s, o !== 0 && (r[l++] = o);
  return (A !== 0 || l === 0) && (r[l++] = A), l;
}
function ma(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function jn(i) {
  return new Float64Array(i);
}
const ya = (3 + 16 * Ie) * Ie, va = (2 + 12 * Ie) * Ie, ba = (9 + 64 * Ie) * Ie * Ie, ze = jn(4), RA = jn(8), xA = jn(12), SA = jn(16), Ot = jn(4);
function wa(i, t, e, n, r, A, s) {
  let o, g, a, I, C, c, l, h, u, m, p, v, D, T, U, W, q, et;
  const nt = i - r, at = e - r, J = t - A, rt = n - A;
  T = nt * rt, c = Rt * nt, l = c - (c - nt), h = nt - l, c = Rt * rt, u = c - (c - rt), m = rt - u, U = h * m - (T - l * u - h * u - l * m), W = J * at, c = Rt * J, l = c - (c - J), h = J - l, c = Rt * at, u = c - (c - at), m = at - u, q = h * m - (W - l * u - h * u - l * m), p = U - q, C = U - p, ze[0] = U - (p + C) + (C - q), v = T + p, C = v - T, D = T - (v - C) + (p - C), p = D - W, C = D - p, ze[1] = D - (p + C) + (C - W), et = v + p, C = et - v, ze[2] = v - (et - C) + (p - C), ze[3] = et;
  let dt = ma(4, ze), ut = va * s;
  if (dt >= ut || -dt >= ut || (C = i - nt, o = i - (nt + C) + (C - r), C = e - at, a = e - (at + C) + (C - r), C = t - J, g = t - (J + C) + (C - A), C = n - rt, I = n - (rt + C) + (C - A), o === 0 && g === 0 && a === 0 && I === 0) || (ut = ba * s + pa * Math.abs(dt), dt += nt * I + rt * o - (J * a + at * g), dt >= ut || -dt >= ut)) return dt;
  T = o * rt, c = Rt * o, l = c - (c - o), h = o - l, c = Rt * rt, u = c - (c - rt), m = rt - u, U = h * m - (T - l * u - h * u - l * m), W = g * at, c = Rt * g, l = c - (c - g), h = g - l, c = Rt * at, u = c - (c - at), m = at - u, q = h * m - (W - l * u - h * u - l * m), p = U - q, C = U - p, Ot[0] = U - (p + C) + (C - q), v = T + p, C = v - T, D = T - (v - C) + (p - C), p = D - W, C = D - p, Ot[1] = D - (p + C) + (C - W), et = v + p, C = et - v, Ot[2] = v - (et - C) + (p - C), Ot[3] = et;
  const b = Zr(4, ze, 4, Ot, RA);
  T = nt * I, c = Rt * nt, l = c - (c - nt), h = nt - l, c = Rt * I, u = c - (c - I), m = I - u, U = h * m - (T - l * u - h * u - l * m), W = J * a, c = Rt * J, l = c - (c - J), h = J - l, c = Rt * a, u = c - (c - a), m = a - u, q = h * m - (W - l * u - h * u - l * m), p = U - q, C = U - p, Ot[0] = U - (p + C) + (C - q), v = T + p, C = v - T, D = T - (v - C) + (p - C), p = D - W, C = D - p, Ot[1] = D - (p + C) + (C - W), et = v + p, C = et - v, Ot[2] = v - (et - C) + (p - C), Ot[3] = et;
  const w = Zr(b, RA, 4, Ot, xA);
  T = o * I, c = Rt * o, l = c - (c - o), h = o - l, c = Rt * I, u = c - (c - I), m = I - u, U = h * m - (T - l * u - h * u - l * m), W = g * a, c = Rt * g, l = c - (c - g), h = g - l, c = Rt * a, u = c - (c - a), m = a - u, q = h * m - (W - l * u - h * u - l * m), p = U - q, C = U - p, Ot[0] = U - (p + C) + (C - q), v = T + p, C = v - T, D = T - (v - C) + (p - C), p = D - W, C = D - p, Ot[1] = D - (p + C) + (C - W), et = v + p, C = et - v, Ot[2] = v - (et - C) + (p - C), Ot[3] = et;
  const z = Zr(w, xA, 4, Ot, SA);
  return SA[z - 1];
}
function Ea(i, t, e, n, r, A) {
  const s = (t - A) * (e - r), o = (i - r) * (n - A), g = s - o, a = Math.abs(s + o);
  return Math.abs(g) >= ya * a ? g : -wa(i, t, e, n, r, A, a);
}
function Ma(i, t) {
  var e, n, r = 0, A, s, o, g, a, I, C, c = i[0], l = i[1], h = t.length;
  for (e = 0; e < h; e++) {
    n = 0;
    var u = t[e], m = u.length - 1;
    if (I = u[0], I[0] !== u[m][0] && I[1] !== u[m][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = I[0] - c, o = I[1] - l, n; n < m; n++) {
      if (C = u[n + 1], g = C[0] - c, a = C[1] - l, o === 0 && a === 0) {
        if (g <= 0 && s >= 0 || s <= 0 && g >= 0)
          return 0;
      } else if (a >= 0 && o <= 0 || a <= 0 && o >= 0) {
        if (A = Ea(s, g, o, a, 0, 0), A === 0)
          return 0;
        (A > 0 && a > 0 && o <= 0 || A < 0 && a <= 0 && o > 0) && r++;
      }
      I = C, o = a, s = g;
    }
  }
  return r % 2 !== 0;
}
function ar(i, t, e = {}) {
  if (!i)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = fa(i), r = da(t), A = r.type, s = t.bbox;
  let o = r.coordinates;
  if (s && Pa(n, s) === !1)
    return !1;
  A === "Polygon" && (o = [o]);
  let g = !1;
  for (var a = 0; a < o.length; ++a) {
    const I = Ma(n, o[a]);
    if (I === 0) return !e.ignoreBoundary;
    I && (g = !0);
  }
  return g;
}
function Pa(i, t) {
  return t[0] <= i[0] && t[1] <= i[1] && t[2] >= i[0] && t[3] >= i[1];
}
class Ts {
  constructor(t = [], e = Ra) {
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
      const A = t - 1 >> 1, s = e[A];
      if (n(r, s) >= 0) break;
      e[t] = s, t = A;
    }
    e[t] = r;
  }
  _down(t) {
    const { data: e, compare: n } = this, r = this.length >> 1, A = e[t];
    for (; t < r; ) {
      let s = (t << 1) + 1, o = e[s];
      const g = s + 1;
      if (g < this.length && n(e[g], o) < 0 && (s = g, o = e[g]), n(o, A) >= 0) break;
      e[t] = o, t = s;
    }
    e[t] = A;
  }
}
function Ra(i, t) {
  return i < t ? -1 : i > t ? 1 : 0;
}
function js(i, t) {
  return i.p.x > t.p.x ? 1 : i.p.x < t.p.x ? -1 : i.p.y !== t.p.y ? i.p.y > t.p.y ? 1 : -1 : 1;
}
function xa(i, t) {
  return i.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : i.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : i.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? i.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
class OA {
  constructor(t, e, n, r) {
    this.p = {
      x: t[0],
      y: t[1]
    }, this.featureId = e, this.ringId = n, this.eventId = r, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(t) {
    return this.p.x === t.p.x && this.p.y === t.p.y;
  }
}
function Sa(i, t) {
  if (i.type === "FeatureCollection") {
    const e = i.features;
    for (let n = 0; n < e.length; n++)
      DA(e[n], t);
  } else
    DA(i, t);
}
let qn = 0, _n = 0, $n = 0;
function DA(i, t) {
  const e = i.type === "Feature" ? i.geometry : i;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let r = 0; r < n.length; r++)
    for (let A = 0; A < n[r].length; A++) {
      let s = n[r][A][0], o = null;
      _n = _n + 1;
      for (let g = 0; g < n[r][A].length - 1; g++) {
        o = n[r][A][g + 1];
        const a = new OA(s, qn, _n, $n), I = new OA(o, qn, _n, $n + 1);
        a.otherEvent = I, I.otherEvent = a, js(a, I) > 0 ? (I.isLeftEndpoint = !0, a.isLeftEndpoint = !1) : (a.isLeftEndpoint = !0, I.isLeftEndpoint = !1), t.push(a), t.push(I), s = o, $n = $n + 1;
      }
    }
  qn = qn + 1;
}
class Oa {
  constructor(t) {
    this.leftSweepEvent = t, this.rightSweepEvent = t.otherEvent;
  }
}
function Da(i, t) {
  if (i === null || t === null || i.leftSweepEvent.ringId === t.leftSweepEvent.ringId && (i.rightSweepEvent.isSamePoint(t.leftSweepEvent) || i.rightSweepEvent.isSamePoint(t.leftSweepEvent) || i.rightSweepEvent.isSamePoint(t.rightSweepEvent) || i.leftSweepEvent.isSamePoint(t.leftSweepEvent) || i.leftSweepEvent.isSamePoint(t.rightSweepEvent))) return !1;
  const e = i.leftSweepEvent.p.x, n = i.leftSweepEvent.p.y, r = i.rightSweepEvent.p.x, A = i.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, o = t.leftSweepEvent.p.y, g = t.rightSweepEvent.p.x, a = t.rightSweepEvent.p.y, I = (a - o) * (r - e) - (g - s) * (A - n), C = (g - s) * (n - o) - (a - o) * (e - s), c = (r - e) * (n - o) - (A - n) * (e - s);
  if (I === 0)
    return !1;
  const l = C / I, h = c / I;
  if (l >= 0 && l <= 1 && h >= 0 && h <= 1) {
    const u = e + l * (r - e), m = n + l * (A - n);
    return [u, m];
  }
  return !1;
}
function Ba(i, t) {
  t = t || !1;
  const e = [], n = new Ts([], xa);
  for (; i.length; ) {
    const r = i.pop();
    if (r.isLeftEndpoint) {
      const A = new Oa(r);
      for (let s = 0; s < n.data.length; s++) {
        const o = n.data[s];
        if (t && o.leftSweepEvent.featureId === r.featureId)
          continue;
        const g = Da(A, o);
        g !== !1 && e.push(g);
      }
      n.push(A);
    } else r.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
function Ta(i, t) {
  const e = new Ts([], js);
  return Sa(i, e), Ba(e, t);
}
var ja = Ta;
function La(i, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: r = !0 } = e;
  let A = [];
  i.type === "FeatureCollection" ? A = A.concat(i.features) : i.type === "Feature" ? A.push(i) : (i.type === "LineString" || i.type === "Polygon" || i.type === "MultiLineString" || i.type === "MultiPolygon") && A.push(yn(i)), t.type === "FeatureCollection" ? A = A.concat(t.features) : t.type === "Feature" ? A.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && A.push(yn(t));
  const s = ja(
    MA(A),
    r
  );
  let o = [];
  if (n) {
    const g = {};
    s.forEach((a) => {
      const I = a.join(",");
      g[I] || (g[I] = !0, o.push(a));
    });
  } else
    o = s;
  return MA(o.map((g) => Ds(g)));
}
function Ls(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
function ka(i, t = {}) {
  let e = 0, n = 0, r = 0;
  return Bs(
    i,
    function(A) {
      e += A[0], n += A[1], r++;
    }
  ), Ds([e / r, n / r], t.properties);
}
function ks(i) {
  class t extends i {
    constructor() {
      super(...arguments);
      M(this, "weiwudi");
      M(this, "_map");
      M(this, "homePosition");
      M(this, "mercZoom");
      M(this, "pois");
      M(this, "officialTitle", "");
      M(this, "title", "");
      M(this, "mapID", "");
      M(this, "label", "");
      M(this, "initialWait");
      M(this, "maxZoom");
      M(this, "minZoom");
      M(this, "envelope");
      M(this, "centroid");
      M(this, "homeMarginPixels", 0);
      M(this, "thumbnail");
      M(this, "poiTemplate");
      M(this, "poiStyle");
      M(this, "iconTemplate");
      M(this, "startFrom");
      M(this, "controls");
      M(this, "northUp");
      M(this, "tapDuration");
      M(this, "mercatorXShift", 0);
      M(this, "mercatorYShift", 0);
      M(this, "icon");
      M(this, "selectedIcon");
    }
    initialize(r) {
      var o;
      if (r = te(r), this.mapID = r.mapID, this.homePosition = r.homePosition, this.mercZoom = r.mercZoom, this.label = r.label, this.maxZoom = r.maxZoom, this.minZoom = r.minZoom, this.poiTemplate = r.poiTemplate, this.poiStyle = r.poiStyle, this.iconTemplate = r.iconTemplate, this.icon = r.icon, this.selectedIcon = r.selectedIcon, this.mercatorXShift = r.mercatorXShift, this.mercatorYShift = r.mercatorYShift, this.weiwudi = r.weiwudi, r.envelopeLngLats) {
        const a = r.envelopeLngLats.map(
          (I) => Xt(I, "EPSG:4326", "EPSG:3857")
        );
        a.push(a[0]), this.envelope = gr([a]), this.centroid = (o = ka(this.envelope).geometry) == null ? void 0 : o.coordinates;
      }
      for (let g = 0; g < vn.length; g++) {
        const a = vn[g], I = Ga[g];
        this.set(a, r[I] || r[a]);
      }
      const A = r.thumbnail ? new Promise((g) => {
        this.thumbnail = r.thumbnail, g(void 0);
      }) : new Promise((g) => {
        this.thumbnail = `./tmbs/${r.mapID}.jpg`, fetch(this.thumbnail).then((a) => {
          a.ok || (this.thumbnail = `./tmbs/${r.mapID}_menu.jpg`), g(void 0);
        }).catch((a) => {
          this.thumbnail = `./tmbs/${r.mapID}_menu.jpg`, g(void 0);
        });
      }).catch((g) => {
        this.thumbnail = `./tmbs/${r.mapID || r.sourceID}_menu.jpg`;
      }), s = this.resolvePois(r.pois);
      this.initialWait = Promise.all([s, A]), Xa(this);
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
        return await this.weiwudi.stats();
      } catch {
        return {};
      }
    }
    async getTileCacheSizeAsync() {
      return (await this.getTileCacheStatsAsync()).size || 0;
    }
    async fetchAllTileCacheAsync(r) {
      if (this.weiwudi)
        try {
          const A = (o) => {
            r(o.type, o.detail);
          }, s = (o) => {
            this.weiwudi.removeEventListener("proceed", A), this.weiwudi.removeEventListener("finish", s), this.weiwudi.removeEventListener("stop", s), this.weiwudi.removeEventListener("canceled", s), A(o);
          };
          this.weiwudi.addEventListener("proceed", A), this.weiwudi.addEventListener("finish", s), this.weiwudi.addEventListener("stop", s), this.weiwudi.addEventListener("canceled", s), await this.weiwudi.fetchAll();
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
    setMap(r) {
      this._map = r;
    }
    // 経緯度lnglat、メルカトルズームmercZoom、地図ズームzoom、方角direction、地図回転rotation等を指定し地図移動
    setViewpointRadian(r) {
      let A, s;
      const o = r.mercZoom, g = r.zoom, a = r.direction, I = r.rotation, C = this.getMap(), c = C == null ? void 0 : C.getView();
      r.latitude !== void 0 && r.longitude !== void 0 && (A = Xt(
        [r.longitude, r.latitude],
        "EPSG:4326",
        "EPSG:3857"
      )), r.x !== void 0 && r.y != null && (s = [r.x, r.y]), this.viewpoint2MercsAsync().then((l) => this.mercs2MercViewpoint(l)).then((l) => {
        const h = this.mercViewpoint2Mercs([
          A || l[0],
          o || l[1] || 17,
          a ?? I ?? l[2]
        ]);
        this.mercs2ViewpointAsync(h).then((u) => {
          A != null ? c == null || c.setCenter(u[0]) : s != null && (c == null || c.setCenter(s)), o != null ? c == null || c.setZoom(u[1]) : g != null && (c == null || c.setZoom(g)), a != null ? c == null || c.setRotation(u[2]) : I != null && (c == null || c.setRotation(I));
        });
      });
    }
    setViewpoint(r) {
      const A = { ...r };
      A.rotation && (A.rotation = A.rotation * Math.PI / 180), A.direction && (A.direction = A.direction * Math.PI / 180), this.setViewpointRadian(A);
    }
    goHome() {
      const A = this.getMap();
      let s = A.getTarget();
      typeof s == "string" && (s = document.getElementById(s));
      const o = A.homeMarginPixels, g = [
        (s.clientWidth - o - 10) * 1,
        (s.clientHeight - o - 10) * 1
      ], a = {
        longitude: this.homePosition[0],
        latitude: this.homePosition[1],
        zoom: this.defZoom(g)
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
    setGPSMarkerAsync(r, A = !1) {
      const s = this.getMap(), o = s == null ? void 0 : s.getView();
      if (!r)
        return new Promise((a, I) => {
          s == null || s.setGPSPosition(null), a(!0);
        });
      const g = this.mercsFromGPSValue(r.lnglat, r.acc);
      return this.mercs2SysCoordsAsync_multiLayer([g]).then((a) => {
        const I = !a[0], C = I ? a[1] : a[0], c = I ? null : a[1], l = { xy: C[0][0] };
        if (!this.insideCheckSysCoord(C[0][0])) return !1;
        const h = C[0].slice(1);
        return l.rad = h.reduce(
          (u, m, p) => {
            const v = u + Math.sqrt(
              Math.pow(m[0] - l.xy[0], 2) + Math.pow(m[1] - l.xy[1], 2)
            );
            return p === 3 ? v / 4 : v;
          },
          0
        ), A || o == null || o.setCenter(l.xy), s == null || s.setGPSPosition(l, I ? "hide" : null), c && (s == null || s.setGPSPosition({ xy: c[0][0] }, "sub")), !0;
      }).catch((a) => {
        throw a;
      });
    }
    setGPSMarker(r, A = !1) {
      this.setGPSMarkerAsync(r, A).then(() => {
      });
    }
    mercsFromGPSValue(r, A) {
      const s = Xt(r, "EPSG:4326", "EPSG:3857"), o = r[1] * Math.PI / 180, g = A / Math.cos(o);
      return wA.map((a) => [
        a[0] * g + s[0],
        a[1] * g + s[1]
      ]);
    }
    // 与えられた差分行列を回転。theta無指定の場合は自動取得
    rotateMatrix(r, A) {
      A === void 0 && (A = this.getMap().getView().getRotation());
      const s = [];
      for (let o = 0; o < r.length; o++) {
        const g = r[o], a = g[0] * Math.cos(A) - g[1] * Math.sin(A), I = g[0] * Math.sin(A) + g[1] * Math.cos(A);
        s.push([a, I]);
      }
      return s;
    }
    async resolvePois(r) {
      this.pois = await Os(r || [], {
        name: this.officialTitle || this.title,
        namespace: this.mapID
      });
    }
    getPoi(r) {
      let A;
      return Object.keys(this.pois).map((s) => {
        this.pois[s].features.map((o, g) => {
          o.id === r && (A = this.pois[s].features[g]);
        });
      }), A;
    }
    addPoi(r, A) {
      var s;
      if (A || (A = "main"), this.pois[A])
        return r = mn(r), this.pois[A].features.push(r), ui(this.pois, A, {
          name: this.officialTitle || this.title,
          namespace: this.mapID
        }), (s = r.properties) == null ? void 0 : s.namespaceID;
    }
    removePoi(r) {
      Object.keys(this.pois).map((A) => {
        this.pois[A].features.map((s, o) => {
          s.id === r && delete this.pois[A].features[o];
        });
      });
    }
    clearPoi(r) {
      r || (r = "main"), r === "all" ? Object.keys(this.pois).map((A) => {
        this.pois[A].features = [];
      }) : this.pois[r] && (this.pois[r].features = []);
    }
    listPoiLayers(r = !1, A = !1) {
      return Object.keys(this.pois).sort((s, o) => s === "main" ? -1 : o === "main" ? 1 : s < o ? -1 : s > o ? 1 : 0).map((s) => this.pois[s]).filter(
        (s) => A ? r ? s.features.length && s.hide : s.features.length : r ? s.hide : !0
      );
    }
    getPoiLayer(r) {
      return this.pois[r];
    }
    addPoiLayer(r, A) {
      r !== "main" && (this.pois[r] || (this.pois[r] = Oe(A || [], r, {
        name: this.officialTitle || this.title,
        namespace: this.mapID
      })));
    }
    removePoiLayer(r) {
      r !== "main" && this.pois[r] && delete this.pois[r];
    }
    merc2SysCoordAsync_ignoreBackground(r) {
      return this.merc2XyAsync_ignoreBackground(r).then(
        (A) => A ? this.xy2SysCoord(A) : void 0
      );
    }
    merc2SysCoordAsync(r) {
      return this.merc2XyAsync(r).then(
        (A) => A && this.xy2SysCoord(A)
      );
    }
    sysCoord2MercAsync(r) {
      const A = this.sysCoord2Xy(r);
      return this.xy2MercAsync(A);
    }
    // size(画面サイズ)とズームから、地図面座標上での半径を得る。zoom無指定の場合は自動取得
    zoom2Radius(r, A) {
      const s = Math.floor(Math.min(r[0], r[1]) / 4);
      return A === void 0 && (A = this.getMap().getView().getDecimalZoom()), s * ht / 128 / Math.pow(2, A);
    }
    // 画面サイズと地図ズームから、地図面座標上での5座標を取得する。zoom, rotate無指定の場合は自動取得
    viewpoint2SysCoords(r, A) {
      return this.mercViewpoint2Mercs(r, A);
    }
    mercViewpoint2Mercs(r, A) {
      let s = r ? r[0] : void 0;
      const o = r ? r[1] : void 0, g = r ? r[2] : void 0;
      s === void 0 && (s = this.getMap().getView().getCenter()), A === void 0 && (A = this.getMap().getSize());
      const a = this.zoom2Radius(A, o);
      return [this.rotateMatrix(wA, g).map((c) => [
        c[0] * a + s[0],
        c[1] * a + s[1]
      ]), A];
    }
    // 地図座標5地点情報から地図サイズ情報（中心座標、サイズ、回転）を得る
    sysCoords2Viewpoint(r) {
      return this.mercs2MercViewpoint(r);
    }
    // メルカトル5地点情報からメルカトル地図でのサイズ情報（中心座標、サイズ、回転）を得る
    mercs2MercViewpoint(r) {
      const A = r[0][0];
      let s = r[1];
      const g = r[0].slice(1, 5).map((p) => [
        p[0] - A[0],
        p[1] - A[1]
      ]), a = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0]
      ];
      let I = 0, C = 0, c = 0;
      for (let p = 0; p < 4; p++) {
        const v = g[p], D = a[p], T = Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));
        I += T;
        const U = v[0] * D[1] - v[1] * D[0], W = Math.acos(
          (v[0] * D[0] + v[1] * D[1]) / T
        ), q = U > 0 ? -1 * W : W;
        C += Math.cos(q), c += Math.sin(q);
      }
      const l = I / 4, h = Math.atan2(c, C);
      s || (s = this.getMap().getSize());
      const u = Math.floor(Math.min(s[0], s[1]) / 4), m = Math.log(u * ht / 128 / l) / Math.log(2);
      return [A, m, h];
    }
    sysCoords2Xys(r) {
      return [
        r[0].map((A) => this.sysCoord2Xy(A)),
        r[1]
      ];
    }
    xys2SysCoords(r) {
      return [r[0].map((A) => this.xy2SysCoord(A)), r[1]];
    }
    mercs2XysAsync(r) {
      return Promise.all(r[0].map((A) => this.merc2XyAsync(A))).then(
        (A) => [A, r[1]]
      );
    }
    xys2MercsAsync(r) {
      return Promise.all(r[0].map((A) => this.xy2MercAsync(A))).then(
        (A) => [A, r[1]]
      );
    }
    static async createAsync(r) {
      return new this(r);
    }
  }
  return M(t, "isBasemap_", !1), M(t, "isWmts_", !0), M(t, "isMapbox_", !1), M(t, "isMapLibre_", !1), t;
}
function Ns(i) {
  class t extends ks(i) {
    insideCheckXy(n) {
      return this.envelope ? ar(n, this.envelope) : !0;
    }
    insideCheckSysCoord(n) {
      return this.insideCheckXy(n);
    }
    modulateXyInside(n) {
      if (!this.centroid) return n;
      const r = ha([n, this.centroid]), A = La(this.envelope, r);
      return A.features.length > 0 && A.features[0].geometry ? A.features[0].geometry.coordinates : n;
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
      const A = this.viewpoint2SysCoords(n, r), s = this.sysCoords2Xys(A);
      return this.xys2MercsAsync(s);
    }
    mercs2ViewpointAsync(n) {
      return this.mercs2XysAsync(n).then((r) => {
        const A = this.xys2SysCoords(r);
        return this.sysCoords2Viewpoint(A);
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
  return M(t, "isBasemap_", !0), M(t, "isWmts_", !0), t;
}
function Na(i) {
  class t extends ks(i) {
    constructor() {
      super(...arguments);
      M(this, "width", 0);
      M(this, "height", 0);
      M(this, "_maxxy", 0);
    }
    insideCheckXy(r) {
      return !(r[0] < 0 || r[0] > this.width || r[1] < 0 || r[1] > this.height);
    }
    insideCheckSysCoord(r) {
      return this.insideCheckXy(this.sysCoord2Xy(r));
    }
    modulateXyInside(r) {
      const A = r[0] / (this.width / 2) - 1, s = r[1] / (this.height / 2) - 1, o = Math.max(Math.abs(A), Math.abs(s));
      return [
        (A / o + 1) * this.width / 2,
        (s / o + 1) * this.height / 2
      ];
    }
    modulateSysCoordInside(r) {
      const A = this.sysCoord2Xy(r), s = this.modulateXyInside(A);
      return this.xy2SysCoord(s);
    }
    // unifyTerm対応
    // https://github.com/code4history/MaplatCore/issues/19
    xy2SysCoord(r) {
      const A = r[0] * (2 * ht) / this._maxxy - ht, s = -1 * (r[1] * (2 * ht) / this._maxxy - ht);
      return [A, s];
    }
    sysCoord2Xy(r) {
      const A = (r[0] + ht) * this._maxxy / (2 * ht), s = (-r[1] + ht) * this._maxxy / (2 * ht);
      return [A, s];
    }
    defZoom(r) {
      const A = r[0], s = r[1], o = Math.log2((A - 10) / this.width), g = Math.log2((s - 10) / this.height), a = this.maxZoom;
      let I;
      return g > o ? I = g : I = o, a + I;
    }
  }
  return M(t, "isBasemap_", !1), M(t, "isWmts_", !1), t;
}
const vn = [
  "title",
  "officialTitle",
  "author",
  "createdAt",
  "era",
  "contributor",
  "mapper",
  "license",
  "dataLicense",
  "attr",
  "dataAttr",
  "reference",
  "description"
], Ga = [
  "title",
  "official_title",
  "author",
  "created_at",
  "era",
  "contributor",
  "mapper",
  "license",
  "data_license",
  "attr",
  "data_attr",
  "reference",
  "description"
];
function Gs(i) {
  return i = te(i), i.imageExtension || (i.imageExtension = "jpg"), i.mapID && !i.url && !i.urls && (i.url = i.tms ? `tiles/${i.mapID}/{z}/{x}/{-y}.${i.imageExtension}` : `tiles/${i.mapID}/{z}/{x}/{y}.${i.imageExtension}`), i;
}
function Xa(i) {
  const t = i;
  i.setTileLoadFunction(
    (function() {
      const e = t.getTileLoadFunction(), n = function(r, A, s, o, g, a, I) {
        return new Promise((C, c) => {
          const l = function(h, u = void 0) {
            const m = document.createElement("img");
            m.crossOrigin = "Anonymous", m.onload = m.onerror = function() {
              if (m.width && m.height) {
                const p = s.getContext("2d"), v = o === 0 ? 256 - a : 0, D = g === 0 ? 256 - I : 0;
                a = o + a > m.width ? m.width - o : a, I = g + I > m.height ? m.height - g : I, p.drawImage(m, o, g, a, I, v, D, a, I), C(void 0);
              } else
                u ? l(u) : C("tileLoadError");
            }, m.src = h;
          };
          l(A);
        });
      };
      return function(r, A) {
        const s = r.tileCoord[0];
        let o = r.tileCoord[1], g = r.tileCoord[2], a = Math.round(
          (t.mercatorXShift || 0) * 128 * Math.pow(2, s) / ht
        ), I = Math.round(
          (t.mercatorYShift || 0) * -128 * Math.pow(2, s) / ht
        );
        for (; a < 0 || a >= 256; )
          a < 0 ? (a = a + 256, o++) : (a = a - 256, o--);
        for (; I < 0 || I >= 256; )
          I < 0 ? (I = I + 256, g++) : (I = I - 256, g--);
        const C = document.createElement("div");
        C.innerHTML = la;
        const c = C.childNodes[0], l = [
          [[s, o, g], 0, 0, 256 - a, 256 - I]
        ];
        a !== 0 && l.push([
          [s, o - 1, g],
          256 - a,
          0,
          a,
          256 - I
        ]), I !== 0 && (l.push([
          [s, o, g - 1],
          0,
          256 - I,
          256 - a,
          I
        ]), a !== 0 && l.push([
          [s, o - 1, g - 1],
          256 - a,
          256 - I,
          a,
          I
        ])), Promise.all(
          l.map((h) => {
            const u = t.tileUrlFunction(
              h[0],
              t.tilePixelRatio_,
              t.projection_
            );
            return n(
              h[0],
              u,
              c,
              h[1],
              h[2],
              h[3],
              h[4]
            );
          })
        ).then((h) => {
          if (h.reduce((m, p) => m && p, !0))
            r.handleImageError_();
          else {
            const m = c.toDataURL(), p = r.getImage();
            p.crossOrigin = null, e(r, m);
          }
        }).catch((h) => {
          r.handleImageError_();
        });
      };
    })()
  );
}
function Cn(i) {
  const t = document, e = t.createDocumentFragment(), n = [];
  i = i.replace(/(<\/?)d([ >])/g, "$1div$2").replace(/(<\/?)s([ >])/g, "$1span$2").replace(/ din="/g, ' data-i18n="').replace(/ dinh="/g, ' data-i18n-html="').replace(/ c="/g, ' class="');
  const r = e.appendChild(t.createElement("div"));
  r.innerHTML = i;
  for (let A = 0; A < r.childNodes.length; A++) {
    const s = r.childNodes[A];
    if (s.nodeName && s.nodeName.toLowerCase() === "script") {
      const o = t.createElement("script");
      s.type && (o.type = s.type), s.src ? o.src = s.src : o.text = s.text, n[A] = o;
    } else
      n[A] = s;
  }
  return n;
}
function BA(i) {
  for (; !(i <= 180 && i > -180); ) {
    const t = i > 0 ? -1 : 1;
    i = i + t * 360;
  }
  return i;
}
function TA(i) {
  if (!i) return;
  const t = {
    mapID: i.mapID
  };
  for (let e = 0; e < vn.length; e++) {
    const n = vn[e];
    i[n] && (t[n] = i[n]);
  }
  return t;
}
function te(i) {
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
class Xs {
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
function Za(i, t, e) {
  let n, r;
  e = e || Zs;
  let A = 0, s = i.length, o = !1;
  for (; A < s; )
    n = A + (s - A >> 1), r = +e(i[n], t), r < 0 ? A = n + 1 : (s = n, o = !r);
  return o ? A : ~A;
}
function Zs(i, t) {
  return i > t ? 1 : i < t ? -1 : 0;
}
function Fs(i, t, e) {
  if (i[0] <= t)
    return 0;
  const n = i.length;
  if (t <= i[n - 1])
    return n - 1;
  if (typeof e == "function") {
    for (let r = 1; r < n; ++r) {
      const A = i[r];
      if (A === t)
        return r;
      if (A < t)
        return e(t, i[r - 1], A) > 0 ? r - 1 : r;
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
function Us(i, t) {
  const e = Array.isArray(t) ? t : [t], n = e.length;
  for (let r = 0; r < n; r++)
    i[i.length] = e[r];
}
function Fa(i, t) {
  const e = i.length;
  if (e !== t.length)
    return !1;
  for (let n = 0; n < e; n++)
    if (i[n] !== t[n])
      return !1;
  return !0;
}
function Ua() {
  return !0;
}
function br() {
  return !1;
}
function ri() {
}
function za(i) {
  let t, e, n;
  return function() {
    const r = Array.prototype.slice.call(arguments);
    return (!e || this !== n || !Fa(r, e)) && (n = this, e = r, t = i.apply(this, arguments)), t;
  };
}
function zs(i) {
  for (const t in i)
    delete i[t];
}
function Ha(i) {
  let t;
  for (t in i)
    return !1;
  return !t;
}
class Hs extends Xs {
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
    const A = e ? new Ce(t) : (
      /** @type {Event} */
      t
    );
    A.target || (A.target = this.eventTarget_ || this);
    const s = this.dispatching_ || (this.dispatching_ = {}), o = this.pendingRemovals_ || (this.pendingRemovals_ = {});
    n in s || (s[n] = 0, o[n] = 0), ++s[n];
    let g;
    for (let a = 0, I = r.length; a < I; ++a)
      if ("handleEvent" in r[a] ? g = /** @type {import("../events.js").ListenerObject} */
      r[a].handleEvent(A) : g = /** @type {import("../events.js").ListenerFunction} */
      r[a].call(this, A), g === !1 || A.propagationStopped) {
        g = !1;
        break;
      }
    if (--s[n] === 0) {
      let a = o[n];
      for (delete o[n]; a--; )
        this.removeEventListener(n, ri);
      delete s[n];
    }
    return g;
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.listeners_ && zs(this.listeners_);
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
    r !== -1 && (this.pendingRemovals_ && t in this.pendingRemovals_ ? (n[r] = ri, ++this.pendingRemovals_[t]) : (n.splice(r, 1), n.length === 0 && delete this.listeners_[t]));
  }
}
ms.prototype.getDecimalZoom = function() {
  const i = this.getResolution(), t = (
    // NOTE: `resolution` maybe `undefined`
    // NOTE: `offset` maybe `NaN`
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Math.log(this.maxResolution_ / i) / Math.log(2)
  );
  return t !== void 0 ? this.minZoom_ + t : t;
};
const Et = {
  UNKNOWN: 0,
  INTERSECTING: 1,
  ABOVE: 2,
  RIGHT: 4,
  BELOW: 8,
  LEFT: 16
};
function hi(i, t, e) {
  let n, r;
  return t < i[0] ? n = i[0] - t : i[2] < t ? n = t - i[2] : n = 0, e < i[1] ? r = i[1] - e : i[3] < e ? r = e - i[3] : r = 0, n * n + r * r;
}
function Qa(i, t, e) {
  return i[0] <= t && t <= i[2] && i[1] <= e && e <= i[3];
}
function jA(i, t) {
  const e = i[0], n = i[1], r = i[2], A = i[3], s = t[0], o = t[1];
  let g = Et.UNKNOWN;
  return s < e ? g = g | Et.LEFT : s > r && (g = g | Et.RIGHT), o < n ? g = g | Et.BELOW : o > A && (g = g | Et.ABOVE), g === Et.UNKNOWN && (g = Et.INTERSECTING), g;
}
function Qs() {
  return [1 / 0, 1 / 0, -1 / 0, -1 / 0];
}
function wr(i, t, e, n, r) {
  return r ? (r[0] = i, r[1] = t, r[2] = e, r[3] = n, r) : [i, t, e, n];
}
function Ws(i) {
  return wr(1 / 0, 1 / 0, -1 / 0, -1 / 0, i);
}
function Wa(i, t) {
  const e = i[0], n = i[1];
  return wr(e, n, e, n, t);
}
function Va(i, t, e, n, r) {
  const A = Ws(r);
  return Vs(A, i, t, e, n);
}
function Vs(i, t, e, n, r) {
  for (; e < n; e += r)
    Ya(i, t[e], t[e + 1]);
  return i;
}
function Ya(i, t, e) {
  i[0] = Math.min(i[0], t), i[1] = Math.min(i[1], e), i[2] = Math.max(i[2], t), i[3] = Math.max(i[3], e);
}
function Ys(i, t) {
  let e;
  return e = t(Ka(i)), e || (e = t(Ja(i)), e) || (e = t(tI(i)), e) || (e = t($a(i)), e) ? e : !1;
}
function Ka(i) {
  return [i[0], i[1]];
}
function Ja(i) {
  return [i[2], i[1]];
}
function ur(i) {
  return [(i[0] + i[2]) / 2, (i[1] + i[3]) / 2];
}
function qa(i, t, e, n, r) {
  const [A, s, o, g, a, I, C, c] = _a(
    i,
    t,
    e,
    n
  );
  return wr(
    Math.min(A, o, a, C),
    Math.min(s, g, I, c),
    Math.max(A, o, a, C),
    Math.max(s, g, I, c),
    r
  );
}
function _a(i, t, e, n) {
  const r = t * n[0] / 2, A = t * n[1] / 2, s = Math.cos(e), o = Math.sin(e), g = r * s, a = r * o, I = A * s, C = A * o, c = i[0], l = i[1];
  return [
    c - g + C,
    l - a - I,
    c - g - C,
    l - a + I,
    c + g - C,
    l + a + I,
    c + g + C,
    l + a - I,
    c - g + C,
    l - a - I
  ];
}
function bn(i) {
  return i[3] - i[1];
}
function $a(i) {
  return [i[0], i[3]];
}
function tI(i) {
  return [i[2], i[3]];
}
function fi(i) {
  return i[2] - i[0];
}
function di(i, t) {
  return i[0] <= t[2] && i[2] >= t[0] && i[1] <= t[3] && i[3] >= t[1];
}
function Ks(i) {
  return i[2] < i[0] || i[3] < i[1];
}
function eI(i, t) {
  return t ? (t[0] = i[0], t[1] = i[1], t[2] = i[2], t[3] = i[3], t) : i;
}
function nI(i, t, e) {
  let n = !1;
  const r = jA(i, t), A = jA(i, e);
  if (r === Et.INTERSECTING || A === Et.INTERSECTING)
    n = !0;
  else {
    const s = i[0], o = i[1], g = i[2], a = i[3], I = t[0], C = t[1], c = e[0], l = e[1], h = (l - C) / (c - I);
    let u, m;
    A & Et.ABOVE && !(r & Et.ABOVE) && (u = c - (l - a) / h, n = u >= s && u <= g), !n && A & Et.RIGHT && !(r & Et.RIGHT) && (m = l - (c - g) * h, n = m >= o && m <= a), !n && A & Et.BELOW && !(r & Et.BELOW) && (u = c - (l - o) / h, n = u >= s && u <= g), !n && A & Et.LEFT && !(r & Et.LEFT) && (m = l - (c - s) * h, n = m >= o && m <= a);
  }
  return n;
}
function Dt() {
  throw new Error("Unimplemented abstract method.");
}
let rI = 0;
function iI(i) {
  return i.ol_uid || (i.ol_uid = String(++rI));
}
const AI = {
  /**
   * Triggered when a property is changed.
   * @event module:ol/Object.ObjectEvent#propertychange
   * @api
   */
  PROPERTYCHANGE: "propertychange"
}, ve = {
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
function Ke(i, t, e, n, r) {
  if (r) {
    const s = e;
    e = function(o) {
      return i.removeEventListener(t, e), s.call(n ?? this, o);
    };
  } else n && n !== i && (e = e.bind(n));
  const A = {
    target: i,
    type: t,
    listener: e
  };
  return i.addEventListener(t, e), A;
}
function LA(i, t, e, n) {
  return Ke(i, t, e, n, !0);
}
function dn(i) {
  i && i.target && (i.target.removeEventListener(i.type, i.listener), zs(i));
}
class Er extends Hs {
  constructor() {
    super(), this.on = /** @type {ObservableOnSignature<import("./events").EventsKey>} */
    this.onInternal, this.once = /** @type {ObservableOnSignature<import("./events").EventsKey>} */
    this.onceInternal, this.un = /** @type {ObservableOnSignature<void>} */
    this.unInternal, this.revision_ = 0;
  }
  /**
   * Increases the revision counter and dispatches a 'change' event.
   * @api
   */
  changed() {
    ++this.revision_, this.dispatchEvent(ve.CHANGE);
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
   * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
   * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Event key.
   * @protected
   */
  onInternal(t, e) {
    if (Array.isArray(t)) {
      const n = t.length, r = new Array(n);
      for (let A = 0; A < n; ++A)
        r[A] = Ke(this, t[A], e);
      return r;
    }
    return Ke(
      this,
      /** @type {string} */
      t,
      e
    );
  }
  /**
   * @param {string|Array<string>} type Type.
   * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
   * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Event key.
   * @protected
   */
  onceInternal(t, e) {
    let n;
    if (Array.isArray(t)) {
      const r = t.length;
      n = new Array(r);
      for (let A = 0; A < r; ++A)
        n[A] = LA(this, t[A], e);
    } else
      n = LA(
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
   * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
   * @protected
   */
  unInternal(t, e) {
    const n = (
      /** @type {Object} */
      e.ol_key
    );
    if (n)
      sI(n);
    else if (Array.isArray(t))
      for (let r = 0, A = t.length; r < A; ++r)
        this.removeEventListener(t[r], e);
    else
      this.removeEventListener(t, e);
  }
}
Er.prototype.on;
Er.prototype.once;
Er.prototype.un;
function sI(i) {
  if (Array.isArray(i))
    for (let t = 0, e = i.length; t < e; ++t)
      dn(i[t]);
  else
    dn(
      /** @type {import("./events.js").EventsKey} */
      i
    );
}
class kA extends Ce {
  /**
   * @param {string} type The event type.
   * @param {string} key The property name.
   * @param {*} oldValue The old value for `key`.
   */
  constructor(t, e, n) {
    super(t), this.key = e, this.oldValue = n;
  }
}
class An extends Er {
  /**
   * @param {Object<string, *>} [values] An object with key-value pairs.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, iI(this), this.values_ = null, t !== void 0 && this.setProperties(t);
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
   * @return {Object<string, *>} Object.
   * @api
   */
  getProperties() {
    return this.values_ && Object.assign({}, this.values_) || {};
  }
  /**
   * Get an object of all property names and values.
   * @return {Object<string, *>?} Object.
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
    n = `change:${t}`, this.hasListener(n) && this.dispatchEvent(new kA(n, t, e)), n = AI.PROPERTYCHANGE, this.hasListener(n) && this.dispatchEvent(new kA(n, t, e));
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
    const r = this.values_ || (this.values_ = {});
    if (n)
      r[t] = e;
    else {
      const A = r[t];
      r[t] = e, A !== e && this.notify(t, A);
    }
  }
  /**
   * Sets a collection of key-value pairs.  Note that this changes any existing
   * properties and adds new ones (it does not remove any existing properties).
   * @param {Object<string, *>} values Values.
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
      delete this.values_[t], Ha(this.values_) && (this.values_ = null), e || this.notify(t, n);
    }
  }
}
function oI(...i) {
  console.warn(...i);
}
function Wt(i, t, e) {
  return Math.min(Math.max(i, t), e);
}
function gI(i, t, e, n, r, A) {
  const s = r - e, o = A - n;
  if (s !== 0 || o !== 0) {
    const g = ((i - e) * s + (t - n) * o) / (s * s + o * o);
    g > 1 ? (e = r, n = A) : g > 0 && (e += s * g, n += o * g);
  }
  return Je(i, t, e, n);
}
function Je(i, t, e, n) {
  const r = e - i, A = n - t;
  return r * r + A * A;
}
function NA(i) {
  return i * 180 / Math.PI;
}
function qe(i) {
  return i * Math.PI / 180;
}
function ii(i, t) {
  const e = i % t;
  return e * t < 0 ? e + t : e;
}
function pi(i, t, e) {
  return i + e * (t - i);
}
function Ai(i, t, e) {
  if (i >= t && i < e)
    return i;
  const n = e - t;
  return ((i - t) % n + n) % n + t;
}
function aI(i, t) {
  return i[0] += +t[0], i[1] += +t[1], i;
}
function hr(i, t) {
  let e = !0;
  for (let n = i.length - 1; n >= 0; --n)
    if (i[n] != t[n]) {
      e = !1;
      break;
    }
  return e;
}
function mi(i, t) {
  const e = Math.cos(t), n = Math.sin(t), r = i[0] * e - i[1] * n, A = i[1] * e + i[0] * n;
  return i[0] = r, i[1] = A, i;
}
function II(i, t) {
  return i[0] *= t, i[1] *= t, i;
}
const Js = {
  // use the radius of the Normal sphere
  radians: 6370997 / (2 * Math.PI),
  degrees: 2 * Math.PI * 6370997 / 360,
  ft: 0.3048,
  m: 1,
  "us-ft": 1200 / 3937
};
class wn {
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
    return this.extent_;
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
    return this.metersPerUnit_ || Js[this.units_];
  }
  /**
   * Get the world extent for this projection.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getWorldExtent() {
    return this.worldExtent_;
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
   * @return {import("../tilegrid/TileGrid.js").default} The default tile grid.
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
const Ln = 6378137, Ye = Math.PI * Ln, CI = [-Ye, -Ye, Ye, Ye], cI = [-180, -85, 180, 85], tr = Ln * Math.log(Math.tan(Math.PI / 2));
class He extends wn {
  /**
   * @param {string} code Code.
   */
  constructor(t) {
    super({
      code: t,
      units: "m",
      extent: CI,
      global: !0,
      worldExtent: cI,
      getPointResolution: function(e, n) {
        return e / Math.cosh(n[1] / Ln);
      }
    });
  }
}
const GA = [
  new He("EPSG:3857"),
  new He("EPSG:102100"),
  new He("EPSG:102113"),
  new He("EPSG:900913"),
  new He("http://www.opengis.net/def/crs/EPSG/0/3857"),
  new He("http://www.opengis.net/gml/srs/epsg.xml#3857")
];
function lI(i, t, e, n) {
  const r = i.length;
  e = e > 1 ? e : 2, n = n ?? e, t === void 0 && (e > 2 ? t = i.slice() : t = new Array(r));
  for (let A = 0; A < r; A += n) {
    t[A] = Ye * i[A] / 180;
    let s = Ln * Math.log(Math.tan(Math.PI * (+i[A + 1] + 90) / 360));
    s > tr ? s = tr : s < -tr && (s = -tr), t[A + 1] = s;
  }
  return t;
}
function uI(i, t, e, n) {
  const r = i.length;
  e = e > 1 ? e : 2, n = n ?? e, t === void 0 && (e > 2 ? t = i.slice() : t = new Array(r));
  for (let A = 0; A < r; A += n)
    t[A] = 180 * i[A] / Ye, t[A + 1] = 360 * Math.atan(Math.exp(i[A + 1] / Ln)) / Math.PI - 90;
  return t;
}
const hI = 6378137, XA = [-180, -90, 180, 90], fI = Math.PI * hI / 180;
class Re extends wn {
  /**
   * @param {string} code Code.
   * @param {string} [axisOrientation] Axis orientation.
   */
  constructor(t, e) {
    super({
      code: t,
      units: "degrees",
      extent: XA,
      axisOrientation: e,
      global: !0,
      metersPerUnit: fI,
      worldExtent: XA
    });
  }
}
const ZA = [
  new Re("CRS:84"),
  new Re("EPSG:4326", "neu"),
  new Re("urn:ogc:def:crs:OGC:1.3:CRS84"),
  new Re("urn:ogc:def:crs:OGC:2:84"),
  new Re("http://www.opengis.net/def/crs/OGC/1.3/CRS84"),
  new Re("http://www.opengis.net/gml/srs/epsg.xml#4326", "neu"),
  new Re("http://www.opengis.net/def/crs/EPSG/0/4326", "neu")
];
let si = {};
function dI(i) {
  return si[i] || si[i.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/, "EPSG:$3")] || null;
}
function pI(i, t) {
  si[i] = t;
}
let _e = {};
function En(i, t, e) {
  const n = i.getCode(), r = t.getCode();
  n in _e || (_e[n] = {}), _e[n][r] = e;
}
function Fr(i, t) {
  return i in _e && t in _e[i] ? _e[i][t] : null;
}
const fr = 0.9996, Ut = 669438e-8, Mr = Ut * Ut, Pr = Mr * Ut, Be = Ut / (1 - Ut), FA = Math.sqrt(1 - Ut), nn = (1 - FA) / (1 + FA), qs = nn * nn, yi = qs * nn, vi = yi * nn, _s = vi * nn, $s = 1 - Ut / 4 - 3 * Mr / 64 - 5 * Pr / 256, mI = 3 * Ut / 8 + 3 * Mr / 32 + 45 * Pr / 1024, yI = 15 * Mr / 256 + 45 * Pr / 1024, vI = 35 * Pr / 3072, bI = 3 / 2 * nn - 27 / 32 * yi + 269 / 512 * _s, wI = 21 / 16 * qs - 55 / 32 * vi, EI = 151 / 96 * yi - 417 / 128 * _s, MI = 1097 / 512 * vi, dr = 6378137;
function PI(i, t, e) {
  const n = i - 5e5, s = (e.north ? t : t - 1e7) / fr / (dr * $s), o = s + bI * Math.sin(2 * s) + wI * Math.sin(4 * s) + EI * Math.sin(6 * s) + MI * Math.sin(8 * s), g = Math.sin(o), a = g * g, I = Math.cos(o), C = g / I, c = C * C, l = c * c, h = 1 - Ut * a, u = Math.sqrt(1 - Ut * a), m = dr / u, p = (1 - Ut) / h, v = Be * I ** 2, D = v * v, T = n / (m * fr), U = T * T, W = U * T, q = W * T, et = q * T, nt = et * T, at = o - C / p * (U / 2 - q / 24 * (5 + 3 * c + 10 * v - 4 * D - 9 * Be)) + nt / 720 * (61 + 90 * c + 298 * v + 45 * l - 252 * Be - 3 * D);
  let J = (T - W / 6 * (1 + 2 * c + v) + et / 120 * (5 - 2 * v + 28 * c - 3 * D + 8 * Be + 24 * l)) / I;
  return J = Ai(
    J + qe(to(e.number)),
    -Math.PI,
    Math.PI
  ), [NA(J), NA(at)];
}
const UA = -80, zA = 84, RI = -180, xI = 180;
function SI(i, t, e) {
  i = Ai(i, RI, xI), t < UA ? t = UA : t > zA && (t = zA);
  const n = qe(t), r = Math.sin(n), A = Math.cos(n), s = r / A, o = s * s, g = o * o, a = qe(i), I = to(e.number), C = qe(I), c = dr / Math.sqrt(1 - Ut * r ** 2), l = Be * A ** 2, h = A * Ai(a - C, -Math.PI, Math.PI), u = h * h, m = u * h, p = m * h, v = p * h, D = v * h, T = dr * ($s * n - mI * Math.sin(2 * n) + yI * Math.sin(4 * n) - vI * Math.sin(6 * n)), U = fr * c * (h + m / 6 * (1 - o + l) + v / 120 * (5 - 18 * o + g + 72 * l - 58 * Be)) + 5e5;
  let W = fr * (T + c * s * (u / 2 + p / 24 * (5 - o + 9 * l + 4 * l ** 2) + D / 720 * (61 - 58 * o + g + 600 * l - 330 * Be)));
  return e.north || (W += 1e7), [U, W];
}
function to(i) {
  return (i - 1) * 6 - 180 + 3;
}
const OI = [
  /^EPSG:(\d+)$/,
  /^urn:ogc:def:crs:EPSG::(\d+)$/,
  /^http:\/\/www\.opengis\.net\/def\/crs\/EPSG\/0\/(\d+)$/
];
function eo(i) {
  let t = 0;
  for (const r of OI) {
    const A = i.match(r);
    if (A) {
      t = parseInt(A[1]);
      break;
    }
  }
  if (!t)
    return null;
  let e = 0, n = !1;
  return t > 32700 && t < 32761 ? e = t - 32700 : t > 32600 && t < 32661 && (n = !0, e = t - 32600), e ? { number: e, north: n } : null;
}
function HA(i, t) {
  return function(e, n, r, A) {
    const s = e.length;
    r = r > 1 ? r : 2, A = A ?? r, n || (r > 2 ? n = e.slice() : n = new Array(s));
    for (let o = 0; o < s; o += A) {
      const g = e[o], a = e[o + 1], I = i(g, a, t);
      n[o] = I[0], n[o + 1] = I[1];
    }
    return n;
  };
}
function DI(i) {
  return eo(i) ? new wn({ code: i, units: "m" }) : null;
}
function BI(i) {
  const t = eo(i.getCode());
  return t ? {
    forward: HA(SI, t),
    inverse: HA(PI, t)
  } : null;
}
const TI = [BI], jI = [DI];
let oi = !0;
function LI(i) {
  oi = !1;
}
function no(i, t) {
  if (t !== void 0) {
    for (let e = 0, n = i.length; e < n; ++e)
      t[e] = i[e];
    t = t;
  } else
    t = i.slice();
  return t;
}
function gi(i) {
  pI(i.getCode(), i), En(i, i, no);
}
function kI(i) {
  i.forEach(gi);
}
function Mn(i) {
  if (typeof i != "string")
    return i;
  const t = dI(i);
  if (t)
    return t;
  for (const e of jI) {
    const n = e(i);
    if (n)
      return n;
  }
  return null;
}
function QA(i) {
  kI(i), i.forEach(function(t) {
    i.forEach(function(e) {
      t !== e && En(t, e, no);
    });
  });
}
function NI(i, t, e, n) {
  i.forEach(function(r) {
    t.forEach(function(A) {
      En(r, A, e), En(A, r, n);
    });
  });
}
function bi(i, t) {
  return i ? typeof i == "string" ? Mn(i) : (
    /** @type {Projection} */
    i
  ) : Mn(t);
}
function GI(i, t) {
  const e = i.getCode(), n = t.getCode();
  let r = Fr(e, n);
  if (r)
    return r;
  let A = null, s = null;
  for (const g of TI)
    A || (A = g(i)), s || (s = g(t));
  if (!A && !s)
    return null;
  const o = "EPSG:4326";
  if (s)
    if (A)
      r = Ur(
        A.inverse,
        s.forward
      );
    else {
      const g = Fr(e, o);
      g && (r = Ur(
        g,
        s.forward
      ));
    }
  else {
    const g = Fr(o, n);
    g && (r = Ur(
      A.inverse,
      g
    ));
  }
  return r && (gi(i), gi(t), En(i, t, r)), r;
}
function Ur(i, t) {
  return function(e, n, r, A) {
    return n = i(e, n, r, A), t(n, n, r, A);
  };
}
function WA(i, t) {
  const e = Mn(i), n = Mn(t);
  return GI(e, n);
}
function VA(i, t) {
  return i;
}
function he(i, t) {
  return oi && !hr(i, [0, 0]) && i[0] >= -180 && i[0] <= 180 && i[1] >= -90 && i[1] <= 90 && (oi = !1, oI(
    "Call useGeographic() from ol/proj once to work with [longitude, latitude] coordinates."
  )), i;
}
function XI(i, t) {
  return i;
}
function er(i, t) {
  return i;
}
function ZI() {
  QA(GA), QA(ZA), NI(
    ZA,
    GA,
    lI,
    uI
  );
}
ZI();
function de(i, t) {
  if (!i)
    throw new Error(t);
}
new Array(6);
function FI() {
  return [1, 0, 0, 1, 0, 0];
}
function UI(i, t, e, n, r, A, s, o) {
  const g = Math.sin(A), a = Math.cos(A);
  return i[0] = n * a, i[1] = r * g, i[2] = -n * g, i[3] = r * a, i[4] = s * n * a - o * n * g + t, i[5] = s * r * g + o * r * a + e, i;
}
function zI(i, t, e, n, r, A, s) {
  A = A || [], s = s || 2;
  let o = 0;
  for (let g = t; g < e; g += n) {
    const a = i[g], I = i[g + 1];
    A[o++] = r[0] * a + r[2] * I + r[4], A[o++] = r[1] * a + r[3] * I + r[5];
    for (let C = 2; C < s; C++)
      A[o++] = i[g + C];
  }
  return A && A.length != o && (A.length = o), A;
}
function ro(i, t, e, n, r, A, s) {
  s = s || [];
  const o = Math.cos(r), g = Math.sin(r), a = A[0], I = A[1];
  let C = 0;
  for (let c = t; c < e; c += n) {
    const l = i[c] - a, h = i[c + 1] - I;
    s[C++] = a + l * o - h * g, s[C++] = I + l * g + h * o;
    for (let u = c + 2; u < c + n; ++u)
      s[C++] = i[u];
  }
  return s && s.length != C && (s.length = C), s;
}
function HI(i, t, e, n, r, A, s, o) {
  o = o || [];
  const g = s[0], a = s[1];
  let I = 0;
  for (let C = t; C < e; C += n) {
    const c = i[C] - g, l = i[C + 1] - a;
    o[I++] = g + r * c, o[I++] = a + A * l;
    for (let h = C + 2; h < C + n; ++h)
      o[I++] = i[h];
  }
  return o && o.length != I && (o.length = I), o;
}
function QI(i, t, e, n, r, A, s) {
  s = s || [];
  let o = 0;
  for (let g = t; g < e; g += n) {
    s[o++] = i[g] + r, s[o++] = i[g + 1] + A;
    for (let a = g + 2; a < g + n; ++a)
      s[o++] = i[a];
  }
  return s && s.length != o && (s.length = o), s;
}
const YA = FI(), WI = [NaN, NaN];
class VI extends An {
  constructor() {
    super(), this.extent_ = Qs(), this.extentRevision_ = -1, this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = 0, this.simplifyTransformedInternal = za(
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
    return Dt();
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
    return Dt();
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   */
  containsXY(t, e) {
    return this.closestPointXY(t, e, WI, Number.MIN_VALUE) === 0;
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
    return Dt();
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
      (isNaN(e[0]) || isNaN(e[1])) && Ws(e), this.extentRevision_ = this.getRevision();
    }
    return eI(this.extent_, t);
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
    Dt();
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
    Dt();
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
    return Dt();
  }
  /**
   * Get the type of this geometry.
   * @abstract
   * @return {Type} Geometry type.
   */
  getType() {
    return Dt();
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
    Dt();
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   */
  intersectsExtent(t) {
    return Dt();
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
    Dt();
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
    const n = Mn(t), r = n.getUnits() == "tile-pixels" ? function(A, s, o) {
      const g = n.getExtent(), a = n.getWorldExtent(), I = bn(a) / bn(g);
      UI(
        YA,
        a[0],
        a[3],
        I,
        -I,
        0,
        0,
        0
      );
      const C = zI(
        A,
        0,
        A.length,
        o,
        YA,
        s
      ), c = WA(n, e);
      return c ? c(C, C, o) : C;
    } : WA(n, e);
    return this.applyTransform(r), this;
  }
}
class kn extends VI {
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
    return Va(
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
    return Dt();
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
    this.stride = KA(t), this.layout = t, this.flatCoordinates = e;
  }
  /**
   * @abstract
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  setCoordinates(t, e) {
    Dt();
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
      r = KA(t);
    else {
      for (let A = 0; A < n; ++A) {
        if (e.length === 0) {
          this.layout = "XY", this.stride = 2;
          return;
        }
        e = /** @type {Array<unknown>} */
        e[0];
      }
      r = e.length, t = YI(r);
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
      ro(
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
    e === void 0 && (e = t), n || (n = ur(this.getExtent()));
    const r = this.getFlatCoordinates();
    if (r) {
      const A = this.getStride();
      HI(
        r,
        0,
        r.length,
        A,
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
      QI(
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
function YI(i) {
  let t;
  return i == 2 ? t = "XY" : i == 3 ? t = "XYZ" : i == 4 && (t = "XYZM"), /** @type {import("./Geometry.js").GeometryLayout} */
  t;
}
function KA(i) {
  let t;
  return i == "XY" ? t = 2 : i == "XYZ" || i == "XYM" ? t = 3 : i == "XYZM" && (t = 4), /** @type {number} */
  t;
}
function io(i, t, e, n) {
  for (let r = 0, A = e.length; r < A; ++r)
    i[t++] = e[r];
  return t;
}
function wi(i, t, e, n) {
  for (let r = 0, A = e.length; r < A; ++r) {
    const s = e[r];
    for (let o = 0; o < n; ++o)
      i[t++] = s[o];
  }
  return t;
}
function KI(i, t, e, n, r) {
  r = r || [];
  let A = 0;
  for (let s = 0, o = e.length; s < o; ++s) {
    const g = wi(
      i,
      t,
      e[s],
      n
    );
    r[A++] = g, t = g;
  }
  return r.length = A, r;
}
class Ei extends kn {
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
    const t = new Ei(
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
    const A = this.flatCoordinates, s = t - A[0], o = e - A[1], g = s * s + o * o;
    if (g < r) {
      if (g === 0)
        for (let a = 0; a < this.stride; ++a)
          n[a] = A[a];
      else {
        const a = this.getRadius() / Math.sqrt(g);
        n[0] = A[0] + a * s, n[1] = A[1] + a * o;
        for (let I = 2; I < this.stride; ++I)
          n[I] = A[I];
      }
      return n.length = this.stride, g;
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
    const n = this.flatCoordinates, r = t - n[0], A = e - n[1];
    return r * r + A * A <= this.getRadiusSquared_();
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
    return wr(
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
    if (di(t, e)) {
      const n = this.getCenter();
      return t[0] <= n[0] && t[2] >= n[0] || t[1] <= n[1] && t[3] >= n[1] ? !0 : Ys(t, this.intersectsCoordinate.bind(this));
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
    for (let A = 1; A < e; ++A)
      r[e + A] = t[A];
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
    let A = io(r, 0, t, this.stride);
    r[A++] = r[0] + e;
    for (let s = 1, o = this.stride; s < o; ++s)
      r[A++] = r[s];
    r.length = A, this.changed();
  }
  /**
   * @override
   */
  getCoordinates() {
    return null;
  }
  /**
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
      ro(n, 0, n.length, r, t, e, n)
    ), this.changed();
  }
}
function Ao(i, t, e, n) {
  let r = 0;
  const A = i[e - n], s = i[e - n + 1];
  let o = 0, g = 0;
  for (; t < e; t += n) {
    const a = i[t] - A, I = i[t + 1] - s;
    r += g * a - o * I, o = a, g = I;
  }
  return r / 2;
}
function JI(i, t, e, n) {
  let r = 0;
  for (let A = 0, s = e.length; A < s; ++A) {
    const o = e[A];
    r += Ao(i, t, o, n), t = o;
  }
  return r;
}
function JA(i, t, e, n, r, A, s) {
  const o = i[t], g = i[t + 1], a = i[e] - o, I = i[e + 1] - g;
  let C;
  if (a === 0 && I === 0)
    C = t;
  else {
    const c = ((r - o) * a + (A - g) * I) / (a * a + I * I);
    if (c > 1)
      C = e;
    else if (c > 0) {
      for (let l = 0; l < n; ++l)
        s[l] = pi(
          i[t + l],
          i[e + l],
          c
        );
      s.length = n;
      return;
    } else
      C = t;
  }
  for (let c = 0; c < n; ++c)
    s[c] = i[C + c];
  s.length = n;
}
function Mi(i, t, e, n, r) {
  let A = i[t], s = i[t + 1];
  for (t += n; t < e; t += n) {
    const o = i[t], g = i[t + 1], a = Je(A, s, o, g);
    a > r && (r = a), A = o, s = g;
  }
  return r;
}
function qI(i, t, e, n, r) {
  for (let A = 0, s = e.length; A < s; ++A) {
    const o = e[A];
    r = Mi(i, t, o, n, r), t = o;
  }
  return r;
}
function Pi(i, t, e, n, r, A, s, o, g, a, I) {
  if (t == e)
    return a;
  let C, c;
  if (r === 0) {
    if (c = Je(
      s,
      o,
      i[t],
      i[t + 1]
    ), c < a) {
      for (C = 0; C < n; ++C)
        g[C] = i[t + C];
      return g.length = n, c;
    }
    return a;
  }
  I = I || [NaN, NaN];
  let l = t + n;
  for (; l < e; )
    if (JA(
      i,
      l - n,
      l,
      n,
      s,
      o,
      I
    ), c = Je(s, o, I[0], I[1]), c < a) {
      for (a = c, C = 0; C < n; ++C)
        g[C] = I[C];
      g.length = n, l += n;
    } else
      l += n * Math.max(
        (Math.sqrt(c) - Math.sqrt(a)) / r | 0,
        1
      );
  if (A && (JA(
    i,
    e - n,
    t,
    n,
    s,
    o,
    I
  ), c = Je(s, o, I[0], I[1]), c < a)) {
    for (a = c, C = 0; C < n; ++C)
      g[C] = I[C];
    g.length = n;
  }
  return a;
}
function _I(i, t, e, n, r, A, s, o, g, a, I) {
  I = I || [NaN, NaN];
  for (let C = 0, c = e.length; C < c; ++C) {
    const l = e[C];
    a = Pi(
      i,
      t,
      l,
      n,
      r,
      A,
      s,
      o,
      g,
      a,
      I
    ), t = l;
  }
  return a;
}
function Ri(i, t, e, n, r) {
  r = r !== void 0 ? r : [];
  let A = 0;
  for (let s = t; s < e; s += n)
    r[A++] = i.slice(s, s + n);
  return r.length = A, r;
}
function $I(i, t, e, n, r) {
  r = r !== void 0 ? r : [];
  let A = 0;
  for (let s = 0, o = e.length; s < o; ++s) {
    const g = e[s];
    r[A++] = Ri(
      i,
      t,
      g,
      n,
      r[A]
    ), t = g;
  }
  return r.length = A, r;
}
function so(i, t, e, n, r, A, s) {
  const o = (e - t) / n;
  if (o < 3) {
    for (; t < e; t += n)
      A[s++] = i[t], A[s++] = i[t + 1];
    return s;
  }
  const g = new Array(o);
  g[0] = 1, g[o - 1] = 1;
  const a = [t, e - n];
  let I = 0;
  for (; a.length > 0; ) {
    const C = a.pop(), c = a.pop();
    let l = 0;
    const h = i[c], u = i[c + 1], m = i[C], p = i[C + 1];
    for (let v = c + n; v < C; v += n) {
      const D = i[v], T = i[v + 1], U = gI(D, T, h, u, m, p);
      U > l && (I = v, l = U);
    }
    l > r && (g[(I - t) / n] = 1, c + n < I && a.push(c, I), I + n < C && a.push(I, C));
  }
  for (let C = 0; C < o; ++C)
    g[C] && (A[s++] = i[t + C * n], A[s++] = i[t + C * n + 1]);
  return s;
}
function Qe(i, t) {
  return t * Math.round(i / t);
}
function tC(i, t, e, n, r, A, s) {
  if (t == e)
    return s;
  let o = Qe(i[t], r), g = Qe(i[t + 1], r);
  t += n, A[s++] = o, A[s++] = g;
  let a, I;
  do
    if (a = Qe(i[t], r), I = Qe(i[t + 1], r), t += n, t == e)
      return A[s++] = a, A[s++] = I, s;
  while (a == o && I == g);
  for (; t < e; ) {
    const C = Qe(i[t], r), c = Qe(i[t + 1], r);
    if (t += n, C == a && c == I)
      continue;
    const l = a - o, h = I - g, u = C - o, m = c - g;
    if (l * m == h * u && (l < 0 && u < l || l == u || l > 0 && u > l) && (h < 0 && m < h || h == m || h > 0 && m > h)) {
      a = C, I = c;
      continue;
    }
    A[s++] = a, A[s++] = I, o = a, g = I, a = C, I = c;
  }
  return A[s++] = a, A[s++] = I, s;
}
function eC(i, t, e, n, r, A, s, o) {
  for (let g = 0, a = e.length; g < a; ++g) {
    const I = e[g];
    s = tC(
      i,
      t,
      I,
      n,
      r,
      A,
      s
    ), o.push(s), t = I;
  }
  return s;
}
class Pn extends kn {
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
    return new Pn(this.flatCoordinates.slice(), this.layout);
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
    return r < hi(this.getExtent(), t, e) ? r : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      Mi(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), Pi(
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
    return Ao(
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
    return Ri(
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
    return e.length = so(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      0
    ), new Pn(e, "XY");
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
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(t) {
    return !1;
  }
  /**
   * Set the coordinates of the linear ring.
   * @param {!Array<import("../coordinate.js").Coordinate>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = wi(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function nC(i, t, e, n, r, A, s) {
  let o, g;
  const a = (e - t) / n;
  if (a === 1)
    o = t;
  else if (a === 2)
    o = t, g = r;
  else if (a !== 0) {
    let I = i[t], C = i[t + 1], c = 0;
    const l = [0];
    for (let m = t + n; m < e; m += n) {
      const p = i[m], v = i[m + 1];
      c += Math.sqrt((p - I) * (p - I) + (v - C) * (v - C)), l.push(c), I = p, C = v;
    }
    const h = r * c, u = Za(l, h);
    u < 0 ? (g = (h - l[-u - 2]) / (l[-u - 1] - l[-u - 2]), o = t + (-u - 2) * n) : o = t + u * n;
  }
  s = s > 1 ? s : 2, A = A || new Array(s);
  for (let I = 0; I < s; ++I)
    A[I] = o === void 0 ? NaN : g === void 0 ? i[o + I] : pi(i[o + I], i[o + n + I], g);
  return A;
}
function rC(i, t, e, n, r, A) {
  if (e == t)
    return null;
  let s;
  if (r < i[t + n - 1])
    return A ? (s = i.slice(t, t + n), s[n - 1] = r, s) : null;
  if (i[e - 1] < r)
    return A ? (s = i.slice(e - n, e), s[n - 1] = r, s) : null;
  if (r == i[t + n - 1])
    return i.slice(t, t + n);
  let o = t / n, g = e / n;
  for (; o < g; ) {
    const c = o + g >> 1;
    r < i[(c + 1) * n - 1] ? g = c : o = c + 1;
  }
  const a = i[o * n - 1];
  if (r == a)
    return i.slice((o - 1) * n, (o - 1) * n + n);
  const I = i[(o + 1) * n - 1], C = (r - a) / (I - a);
  s = [];
  for (let c = 0; c < n - 1; ++c)
    s.push(
      pi(
        i[(o - 1) * n + c],
        i[o * n + c],
        C
      )
    );
  return s.push(r), s;
}
function iC(i, t, e, n, r) {
  return !Ys(
    r,
    /**
     * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
     * @return {boolean} Contains (x, y).
     */
    function(s) {
      return !Te(
        i,
        t,
        e,
        n,
        s[0],
        s[1]
      );
    }
  );
}
function Te(i, t, e, n, r, A) {
  let s = 0, o = i[e - n], g = i[e - n + 1];
  for (; t < e; t += n) {
    const a = i[t], I = i[t + 1];
    g <= A ? I > A && (a - o) * (A - g) - (r - o) * (I - g) > 0 && s++ : I <= A && (a - o) * (A - g) - (r - o) * (I - g) < 0 && s--, o = a, g = I;
  }
  return s !== 0;
}
function oo(i, t, e, n, r, A) {
  if (e.length === 0 || !Te(i, t, e[0], n, r, A))
    return !1;
  for (let s = 1, o = e.length; s < o; ++s)
    if (Te(i, e[s - 1], e[s], n, r, A))
      return !1;
  return !0;
}
function go(i, t, e, n, r) {
  let A;
  for (t += n; t < e; t += n)
    if (A = r(
      i.slice(t - n, t),
      i.slice(t, t + n)
    ), A)
      return A;
  return !1;
}
function xi(i, t, e, n, r, A) {
  return A = A ?? Vs(Qs(), i, t, e, n), di(r, A) ? A[0] >= r[0] && A[2] <= r[2] || A[1] >= r[1] && A[3] <= r[3] ? !0 : go(
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
    function(s, o) {
      return nI(r, s, o);
    }
  ) : !1;
}
function AC(i, t, e, n, r) {
  return !!(xi(i, t, e, n, r) || Te(
    i,
    t,
    e,
    n,
    r[0],
    r[1]
  ) || Te(
    i,
    t,
    e,
    n,
    r[0],
    r[3]
  ) || Te(
    i,
    t,
    e,
    n,
    r[2],
    r[1]
  ) || Te(
    i,
    t,
    e,
    n,
    r[2],
    r[3]
  ));
}
function sC(i, t, e, n, r) {
  if (!AC(i, t, e[0], n, r))
    return !1;
  if (e.length === 1)
    return !0;
  for (let A = 1, s = e.length; A < s; ++A)
    if (iC(
      i,
      e[A - 1],
      e[A],
      n,
      r
    ) && !xi(
      i,
      e[A - 1],
      e[A],
      n,
      r
    ))
      return !1;
  return !0;
}
function oC(i, t, e, n) {
  let r = i[t], A = i[t + 1], s = 0;
  for (let o = t + n; o < e; o += n) {
    const g = i[o], a = i[o + 1];
    s += Math.sqrt((g - r) * (g - r) + (a - A) * (a - A)), r = g, A = a;
  }
  return s;
}
class pr extends kn {
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
    Us(this.flatCoordinates, t), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!LineString} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new pr(
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
    return r < hi(this.getExtent(), t, e) ? r : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      Mi(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), Pi(
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
    return go(
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
    return this.layout != "XYM" && this.layout != "XYZM" ? null : (e = e !== void 0 ? e : !1, rC(
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
    return Ri(
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
    return nC(
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
    return oC(
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
    return e.length = so(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      0
    ), new pr(e, "XY");
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
    return xi(
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
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = wi(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
class Rn extends kn {
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
    const t = new Rn(this.flatCoordinates.slice(), this.layout);
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
    const A = this.flatCoordinates, s = Je(
      t,
      e,
      A[0],
      A[1]
    );
    if (s < r) {
      const o = this.stride;
      for (let g = 0; g < o; ++g)
        n[g] = A[g];
      return n.length = o, s;
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
    return Wa(this.flatCoordinates, t);
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
    return Qa(t, this.flatCoordinates[0], this.flatCoordinates[1]);
  }
  /**
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 0), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = io(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function gC(i, t, e, n, r, A, s) {
  let o, g, a, I, C, c, l;
  const h = r[A + 1], u = [];
  for (let v = 0, D = e.length; v < D; ++v) {
    const T = e[v];
    for (I = i[T - n], c = i[T - n + 1], o = t; o < T; o += n)
      C = i[o], l = i[o + 1], (h <= c && l <= h || c <= h && h <= l) && (a = (h - c) / (l - c) * (C - I) + I, u.push(a)), I = C, c = l;
  }
  let m = NaN, p = -1 / 0;
  for (u.sort(Zs), I = u[0], o = 1, g = u.length; o < g; ++o) {
    C = u[o];
    const v = Math.abs(C - I);
    v > p && (a = (I + C) / 2, oo(i, t, e, n, a, h) && (m = a, p = v)), I = C;
  }
  return isNaN(m) && (m = r[A]), [m, h, p];
}
function aC(i, t, e, n) {
  for (; t < e - n; ) {
    for (let r = 0; r < n; ++r) {
      const A = i[t + r];
      i[t + r] = i[e - n + r], i[e - n + r] = A;
    }
    t += n, e -= n;
  }
}
function ao(i, t, e, n) {
  let r = 0, A = i[e - n], s = i[e - n + 1];
  for (; t < e; t += n) {
    const o = i[t], g = i[t + 1];
    r += (o - A) * (g + s), A = o, s = g;
  }
  return r === 0 ? void 0 : r > 0;
}
function IC(i, t, e, n, r) {
  r = r !== void 0 ? r : !1;
  for (let A = 0, s = e.length; A < s; ++A) {
    const o = e[A], g = ao(
      i,
      t,
      o,
      n
    );
    if (A === 0) {
      if (r && g || !r && !g)
        return !1;
    } else if (r && !g || !r && g)
      return !1;
    t = o;
  }
  return !0;
}
function qA(i, t, e, n, r) {
  r = r !== void 0 ? r : !1;
  for (let A = 0, s = e.length; A < s; ++A) {
    const o = e[A], g = ao(
      i,
      t,
      o,
      n
    );
    (A === 0 ? r && g || !r && !g : r && !g || !r && g) && aC(i, t, o, n), t = o;
  }
  return t;
}
class Le extends kn {
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
    this.flatCoordinates ? Us(this.flatCoordinates, t.getFlatCoordinates()) : this.flatCoordinates = t.getFlatCoordinates().slice(), this.ends_.push(this.flatCoordinates.length), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Polygon} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new Le(
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
    return r < hi(this.getExtent(), t, e) ? r : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      qI(
        this.flatCoordinates,
        0,
        this.ends_,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), _I(
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
    return oo(
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
    return JI(
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
    return t !== void 0 ? (e = this.getOrientedFlatCoordinates().slice(), qA(e, 0, this.ends_, this.stride, t)) : e = this.flatCoordinates, $I(e, 0, this.ends_, this.stride);
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
      const t = ur(this.getExtent());
      this.flatInteriorPoint_ = gC(
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
    return new Rn(this.getFlatInteriorPoint(), "XYM");
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
    return t < 0 || this.ends_.length <= t ? null : new Pn(
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
    let A = 0;
    for (let s = 0, o = n.length; s < o; ++s) {
      const g = n[s], a = new Pn(
        e.slice(A, g),
        t
      );
      r.push(a), A = g;
    }
    return r;
  }
  /**
   * @return {Array<number>} Oriented flat coordinates.
   */
  getOrientedFlatCoordinates() {
    if (this.orientedRevision_ != this.getRevision()) {
      const t = this.flatCoordinates;
      IC(t, 0, this.ends_, this.stride) ? this.orientedFlatCoordinates_ = t : (this.orientedFlatCoordinates_ = t.slice(), this.orientedFlatCoordinates_.length = qA(
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
    return e.length = eC(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      Math.sqrt(t),
      e,
      0,
      n
    ), new Le(e, "XY", n);
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
    return sC(
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
    const n = KI(
      this.flatCoordinates,
      0,
      t,
      this.stride,
      this.ends_
    );
    this.flatCoordinates.length = n.length === 0 ? 0 : n[n.length - 1], this.changed();
  }
}
function _A(i) {
  if (Ks(i))
    throw new Error("Cannot create polygon from empty extent");
  const t = i[0], e = i[1], n = i[2], r = i[3], A = [
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
  return new Le(A, "XY", [A.length]);
}
class rn extends Ns(ys) {
  constructor(t = {}) {
    const e = Gs(t);
    if (super(e), t.mapID && (this.mapID = t.mapID), t.mapID === "morioka_ndl_affine") {
      const n = this.getTileUrlFunction();
      this.setTileUrlFunction((r, A, s) => n(r, A, s));
    }
    this.initialize(t);
  }
}
class xn extends rn {
  constructor(e = {}) {
    super(e);
    M(this, "style", "");
    M(this, "accessToken", "");
    M(this, "mapboxMap");
    this.style = e.style, this.mapboxMap = e.mapboxMap, this.accessToken = e.accessToken;
  }
}
M(xn, "isMapbox_", !0);
class Sn extends rn {
  constructor(e = {}) {
    super(e);
    M(this, "style", "");
    M(this, "maplibreMap");
    this.style = e.style || "https://tile.openstreetmap.jp/styles/osm-bright/style.json", this.maplibreMap = e.maplibreMap;
  }
}
M(Sn, "isMapLibre_", !0);
class ai extends Ns(lg) {
  constructor(t = {}) {
    const e = Object.assign({}, t);
    e.mapType = t.maptype.match(/^google_(.+)$/) ? RegExp.$1 : "roadmap", e.layerTypes = (t.layers || []).map((n) => `layer${n.charAt(0).toUpperCase()}${n.slice(1).toLowerCase()}`), super(e), t.mapID && (this.mapID = t.mapID), this.initialize(t);
  }
}
const fe = {
  ANIMATING: 0,
  INTERACTING: 1
}, Ht = {
  CENTER: "center",
  RESOLUTION: "resolution",
  ROTATION: "rotation"
};
function $A(i, t, e) {
  return (
    /**
     * @param {import("./coordinate.js").Coordinate|undefined} center Center.
     * @param {number|undefined} resolution Resolution.
     * @param {import("./size.js").Size} size Viewport size; unused if `onlyCenter` was specified.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @param {Array<number>} [centerShift] Shift between map center and viewport center.
     * @return {import("./coordinate.js").Coordinate|undefined} Center.
     */
    (function(n, r, A, s, o) {
      if (!n)
        return;
      if (!r && !t)
        return n;
      const g = t ? 0 : A[0] * r, a = t ? 0 : A[1] * r, I = o ? o[0] : 0, C = o ? o[1] : 0;
      let c = i[0] + g / 2 + I, l = i[2] - g / 2 + I, h = i[1] + a / 2 + C, u = i[3] - a / 2 + C;
      c > l && (c = (l + c) / 2, l = c), h > u && (h = (u + h) / 2, u = h);
      let m = Wt(n[0], c, l), p = Wt(n[1], h, u);
      if (s && e && r) {
        const v = 30 * r;
        m += -v * Math.log(1 + Math.max(0, c - n[0]) / v) + v * Math.log(1 + Math.max(0, n[0] - l) / v), p += -v * Math.log(1 + Math.max(0, h - n[1]) / v) + v * Math.log(1 + Math.max(0, n[1] - u) / v);
      }
      return [m, p];
    })
  );
}
function CC(i) {
  return i;
}
function cC(i) {
  return Math.pow(i, 3);
}
function Rr(i) {
  return 1 - cC(1 - i);
}
function lC(i) {
  return 3 * i * i - 2 * i * i * i;
}
function uC(i) {
  return i;
}
function Si(i, t, e, n) {
  const r = fi(t) / e[0], A = bn(t) / e[1];
  return n ? Math.min(i, Math.max(r, A)) : Math.min(i, Math.min(r, A));
}
function Oi(i, t, e) {
  let n = Math.min(i, t);
  const r = 50;
  return n *= Math.log(1 + r * Math.max(0, i / t - 1)) / r + 1, e && (n = Math.max(n, e), n /= Math.log(1 + r * Math.max(0, e / i - 1)) / r + 1), Wt(n, e / 2, t * 2);
}
function hC(i, t, e, n) {
  return t = t !== void 0 ? t : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(r, A, s, o) {
    if (r !== void 0) {
      const g = i[0], a = i[i.length - 1], I = e ? Si(
        g,
        e,
        s,
        n
      ) : g;
      if (o)
        return t ? Oi(
          r,
          I,
          a
        ) : Wt(r, a, I);
      const C = Math.min(I, r), c = Math.floor(Fs(i, C, A));
      return i[c] > I && c < i.length - 1 ? i[c + 1] : i[c];
    }
  });
}
function fC(i, t, e, n, r, A) {
  return n = n !== void 0 ? n : !0, e = e !== void 0 ? e : 0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(s, o, g, a) {
    if (s !== void 0) {
      const I = r ? Si(
        t,
        r,
        g,
        A
      ) : t;
      if (a)
        return n ? Oi(
          s,
          I,
          e
        ) : Wt(s, e, I);
      const C = 1e-9, c = Math.ceil(
        Math.log(t / I) / Math.log(i) - C
      ), l = -o * (0.5 - C) + 0.5, h = Math.min(I, s), u = Math.floor(
        Math.log(t / h) / Math.log(i) + l
      ), m = Math.max(c, u), p = t / Math.pow(i, m);
      return Wt(p, e, I);
    }
  });
}
function ts(i, t, e, n, r) {
  return e = e !== void 0 ? e : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(A, s, o, g) {
    if (A !== void 0) {
      const a = n ? Si(
        i,
        n,
        o,
        r
      ) : i;
      return !e || !g ? Wt(A, t, a) : Oi(
        A,
        a,
        t
      );
    }
  });
}
function Di(i) {
  if (i !== void 0)
    return 0;
}
function es(i) {
  if (i !== void 0)
    return i;
}
function dC(i) {
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
function pC(i) {
  const t = qe(5);
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
const mC = 256, zr = 0;
class ns extends An {
  /**
   * @param {ViewOptions} [options] View options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = Object.assign({}, t), this.hints_ = [0, 0], this.animations_ = [], this.updateAnimationKey_, this.projection_ = bi(t.projection, "EPSG:3857"), this.viewportSize_ = [100, 100], this.targetCenter_ = null, this.targetResolution_, this.targetRotation_, this.nextCenter_ = null, this.nextResolution_, this.nextRotation_, this.cancelAnchor_ = void 0, t.projection && LI(), t.center && (t.center = he(t.center, this.projection_)), t.extent && (t.extent = er(t.extent, this.projection_)), this.applyOptions_(t);
  }
  /**
   * Set up the view with the given options.
   * @param {ViewOptions} options View options.
   */
  applyOptions_(t) {
    const e = Object.assign({}, t);
    for (const o in Ht)
      delete e[o];
    this.setProperties(e, !0);
    const n = vC(t);
    this.maxResolution_ = n.maxResolution, this.minResolution_ = n.minResolution, this.zoomFactor_ = n.zoomFactor, this.resolutions_ = t.resolutions, this.padding_ = t.padding, this.minZoom_ = n.minZoom;
    const r = yC(t), A = n.constraint, s = bC(t);
    this.constraints_ = {
      center: r,
      resolution: A,
      rotation: s
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
      const A = this.getResolution(), s = A / 2 * (r[3] - e[3] + e[1] - r[1]), o = A / 2 * (r[0] - e[0] + e[2] - r[2]);
      this.setCenterInternal([n[0] + s, n[1] - o]);
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
      r.center && (r = Object.assign({}, r), r.center = he(
        r.center,
        this.getProjection()
      )), r.anchor && (r = Object.assign({}, r), r.anchor = he(
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
      n && nr(n, !0);
      return;
    }
    let A = Date.now(), s = this.targetCenter_.slice(), o = this.targetResolution_, g = this.targetRotation_;
    const a = [];
    for (; r < e; ++r) {
      const I = (
        /** @type {AnimationOptions} */
        arguments[r]
      ), C = {
        start: A,
        complete: !1,
        anchor: I.anchor,
        duration: I.duration !== void 0 ? I.duration : 1e3,
        easing: I.easing || lC,
        callback: n
      };
      if (I.center && (C.sourceCenter = s, C.targetCenter = I.center.slice(), s = C.targetCenter), I.zoom !== void 0 ? (C.sourceResolution = o, C.targetResolution = this.getResolutionForZoom(I.zoom), o = C.targetResolution) : I.resolution && (C.sourceResolution = o, C.targetResolution = I.resolution, o = C.targetResolution), I.rotation !== void 0) {
        C.sourceRotation = g;
        const c = ii(I.rotation - g + Math.PI, 2 * Math.PI) - Math.PI;
        C.targetRotation = g + c, g = C.targetRotation;
      }
      wC(C) ? C.complete = !0 : A += C.duration, a.push(C);
    }
    this.animations_.push(a), this.setHint(fe.ANIMATING, 1), this.updateAnimations_();
  }
  /**
   * Determine if the view is being animated.
   * @return {boolean} The view is being animated.
   * @api
   */
  getAnimating() {
    return this.hints_[fe.ANIMATING] > 0;
  }
  /**
   * Determine if the user is interacting with the view, such as panning or zooming.
   * @return {boolean} The view is being interacted with.
   * @api
   */
  getInteracting() {
    return this.hints_[fe.INTERACTING] > 0;
  }
  /**
   * Cancel any ongoing animations.
   * @api
   */
  cancelAnimations() {
    this.setHint(fe.ANIMATING, -this.hints_[fe.ANIMATING]);
    let t;
    for (let e = 0, n = this.animations_.length; e < n; ++e) {
      const r = this.animations_[e];
      if (r[0].callback && nr(r[0].callback, !1), !t)
        for (let A = 0, s = r.length; A < s; ++A) {
          const o = r[A];
          if (!o.complete) {
            t = o.anchor;
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
      const r = this.animations_[n];
      let A = !0;
      for (let s = 0, o = r.length; s < o; ++s) {
        const g = r[s];
        if (g.complete)
          continue;
        const a = t - g.start;
        let I = g.duration > 0 ? a / g.duration : 1;
        I >= 1 ? (g.complete = !0, I = 1) : A = !1;
        const C = g.easing(I);
        if (g.sourceCenter) {
          const c = g.sourceCenter[0], l = g.sourceCenter[1], h = g.targetCenter[0], u = g.targetCenter[1];
          this.nextCenter_ = g.targetCenter;
          const m = c + C * (h - c), p = l + C * (u - l);
          this.targetCenter_ = [m, p];
        }
        if (g.sourceResolution && g.targetResolution) {
          const c = C === 1 ? g.targetResolution : g.sourceResolution + C * (g.targetResolution - g.sourceResolution);
          if (g.anchor) {
            const l = this.getViewportSize_(this.getRotation()), h = this.constraints_.resolution(
              c,
              0,
              l,
              !0
            );
            this.targetCenter_ = this.calculateCenterZoom(
              h,
              g.anchor
            );
          }
          this.nextResolution_ = g.targetResolution, this.targetResolution_ = c, this.applyTargetState_(!0);
        }
        if (g.sourceRotation !== void 0 && g.targetRotation !== void 0) {
          const c = C === 1 ? ii(g.targetRotation + Math.PI, 2 * Math.PI) - Math.PI : g.sourceRotation + C * (g.targetRotation - g.sourceRotation);
          if (g.anchor) {
            const l = this.constraints_.rotation(
              c,
              !0
            );
            this.targetCenter_ = this.calculateCenterRotate(
              l,
              g.anchor
            );
          }
          this.nextRotation_ = g.targetRotation, this.targetRotation_ = c;
        }
        if (this.applyTargetState_(!0), e = !0, !g.complete)
          break;
      }
      if (A) {
        this.animations_[n] = null, this.setHint(fe.ANIMATING, -1), this.nextCenter_ = null, this.nextResolution_ = NaN, this.nextRotation_ = NaN;
        const s = r[0].callback;
        s && nr(s, !0);
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
    return r !== void 0 && (n = [r[0] - e[0], r[1] - e[1]], mi(n, t - this.getRotation()), aI(n, e)), n;
  }
  /**
   * @param {number} resolution Target resolution.
   * @param {import("./coordinate.js").Coordinate} anchor Zoom anchor.
   * @return {import("./coordinate.js").Coordinate|undefined} Center for resolution and anchor.
   */
  calculateCenterZoom(t, e) {
    let n;
    const r = this.getCenterInternal(), A = this.getResolution();
    if (r !== void 0 && A !== void 0) {
      const s = e[0] - t * (e[0] - r[0]) / A, o = e[1] - t * (e[1] - r[1]) / A;
      n = [s, o];
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
    return t && VA(t, this.getProjection());
  }
  /**
   * Get the view center without transforming to user projection.
   * @return {import("./coordinate.js").Coordinate|undefined} The center of the view.
   */
  getCenterInternal() {
    return (
      /** @type {import("./coordinate.js").Coordinate|undefined} */
      this.get(Ht.CENTER)
    );
  }
  /**
   * @return {Constraints} Constraints.
   */
  getConstraints() {
    return this.constraints_;
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
    return XI(e, this.getProjection());
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
    de(e, "The view center is not defined");
    const n = (
      /** @type {!number} */
      this.getResolution()
    );
    de(n !== void 0, "The view resolution is not defined");
    const r = (
      /** @type {!number} */
      this.getRotation()
    );
    return de(r !== void 0, "The view rotation is not defined"), qa(e, n, r, t);
  }
  /**
   * Get the maximum resolution of the view.
   * @return {number} The maximum resolution of the view.
   * @api
   */
  getMaxResolution() {
    return this.maxResolution_;
  }
  /**
   * Get the minimum resolution of the view.
   * @return {number} The minimum resolution of the view.
   * @api
   */
  getMinResolution() {
    return this.minResolution_;
  }
  /**
   * Get the maximum zoom level for the view.
   * @return {number} The maximum zoom level.
   * @api
   */
  getMaxZoom() {
    return (
      /** @type {number} */
      this.getZoomForResolution(this.minResolution_)
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
      this.getZoomForResolution(this.maxResolution_)
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
    return this.projection_;
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
      this.get(Ht.RESOLUTION)
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
      er(t, this.getProjection()),
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
    const n = fi(t) / e[0], r = bn(t) / e[1];
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
    const e = this.getConstrainedResolution(this.maxResolution_), n = this.minResolution_, r = Math.log(e / n) / Math.log(t);
    return (
      /**
       * @param {number} value Value.
       * @return {number} Resolution.
       */
      (function(A) {
        return e / Math.pow(t, A * r);
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
      this.get(Ht.ROTATION)
    );
  }
  /**
   * Return a function that returns a resolution for a value between
   * 0 and 1. Exponential scaling is assumed.
   * @param {number} [power] Power.
   * @return {function(number): number} Value for resolution function.
   */
  getValueForResolutionFunction(t) {
    const e = Math.log(t || 2), n = this.getConstrainedResolution(this.maxResolution_), r = this.minResolution_, A = Math.log(n / r) / e;
    return (
      /**
       * @param {number} resolution Resolution.
       * @return {number} Value.
       */
      (function(s) {
        return Math.log(n / s) / e / A;
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
    const A = this.padding_;
    if (A) {
      const s = this.getViewportSizeMinusPadding_();
      r = Hr(
        r,
        this.getViewportSize_(),
        [s[0] / 2 + A[3], s[1] / 2 + A[0]],
        e,
        n
      );
    }
    return {
      center: r.slice(0),
      projection: t !== void 0 ? t : null,
      resolution: e,
      nextCenter: this.nextCenter_,
      nextResolution: this.nextResolution_,
      nextRotation: this.nextRotation_,
      rotation: n,
      zoom: this.getZoom()
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
      const A = Fs(this.resolutions_, t, 1);
      e = A, n = this.resolutions_[A], A == this.resolutions_.length - 1 ? r = 2 : r = n / this.resolutions_[A + 1];
    } else
      n = this.maxResolution_, r = this.zoomFactor_;
    return e + Math.log(n / t) / Math.log(r);
  }
  /**
   * Get the resolution for a zoom level.
   * @param {number} zoom Zoom level.
   * @return {number} The view resolution for the provided zoom level.
   * @api
   */
  getResolutionForZoom(t) {
    var e;
    if ((e = this.resolutions_) != null && e.length) {
      if (this.resolutions_.length === 1)
        return this.resolutions_[0];
      const n = Wt(
        Math.floor(t),
        0,
        this.resolutions_.length - 2
      ), r = this.resolutions_[n] / this.resolutions_[n + 1];
      return this.resolutions_[n] / Math.pow(r, Wt(t - n, 0, 1));
    }
    return this.maxResolution_ / Math.pow(this.zoomFactor_, t - this.minZoom_);
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
    if (de(
      Array.isArray(t) || typeof /** @type {?} */
      t.getSimplifiedGeometry == "function",
      "Invalid extent or geometry provided as `geometry`"
    ), Array.isArray(t)) {
      de(
        !Ks(t),
        "Cannot fit empty extent provided as `geometry`"
      );
      const r = er(t, this.getProjection());
      n = _A(r);
    } else if (t.getType() === "Circle") {
      const r = er(
        t.getExtent(),
        this.getProjection()
      );
      n = _A(r), n.rotate(this.getRotation(), ur(r));
    } else
      n = t;
    this.fitInternal(n, e);
  }
  /**
   * Calculate rotated extent
   * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
   * @return {import("./extent").Extent} The rotated extent for the geometry.
   */
  rotatedExtentForGeometry(t) {
    const e = this.getRotation(), n = Math.cos(e), r = Math.sin(-e), A = t.getFlatCoordinates(), s = t.getStride();
    let o = 1 / 0, g = 1 / 0, a = -1 / 0, I = -1 / 0;
    for (let C = 0, c = A.length; C < c; C += s) {
      const l = A[C] * n - A[C + 1] * r, h = A[C] * r + A[C + 1] * n;
      o = Math.min(o, l), g = Math.min(g, h), a = Math.max(a, l), I = Math.max(I, h);
    }
    return [o, g, a, I];
  }
  /**
   * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
   * @param {FitOptions} [options] Options.
   */
  fitInternal(t, e) {
    e = e || {};
    let n = e.size;
    n || (n = this.getViewportSizeMinusPadding_());
    const r = e.padding !== void 0 ? e.padding : [0, 0, 0, 0], A = e.nearest !== void 0 ? e.nearest : !1;
    let s;
    e.minResolution !== void 0 ? s = e.minResolution : e.maxZoom !== void 0 ? s = this.getResolutionForZoom(e.maxZoom) : s = 0;
    const o = this.rotatedExtentForGeometry(t);
    let g = this.getResolutionForExtentInternal(o, [
      n[0] - r[1] - r[3],
      n[1] - r[0] - r[2]
    ]);
    g = isNaN(g) ? s : Math.max(g, s), g = this.getConstrainedResolution(g, A ? 0 : 1);
    const a = this.getRotation(), I = Math.sin(a), C = Math.cos(a), c = ur(o);
    c[0] += (r[1] - r[3]) / 2 * g, c[1] += (r[0] - r[2]) / 2 * g;
    const l = c[0] * C - c[1] * I, h = c[1] * C + c[0] * I, u = this.getConstrainedCenter([l, h], g), m = e.callback ? e.callback : ri;
    e.duration !== void 0 ? this.animateInternal(
      {
        resolution: g,
        center: u,
        duration: e.duration,
        easing: e.easing
      },
      m
    ) : (this.targetResolution_ = g, this.targetCenter_ = u, this.applyTargetState_(!1, !0), nr(m, !0));
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
      he(t, this.getProjection()),
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
      Hr(
        t,
        e,
        n,
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
    let A;
    const s = this.padding_;
    if (s && t) {
      const o = this.getViewportSizeMinusPadding_(-n), g = Hr(
        t,
        r,
        [o[0] / 2 + s[3], o[1] / 2 + s[0]],
        e,
        n
      );
      A = [
        t[0] - g[0],
        t[1] - g[1]
      ];
    }
    return A;
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
    const e = VA(this.targetCenter_, this.getProjection());
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
    const e = this.targetCenter_;
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
    e = e && he(e, this.getProjection()), this.adjustResolutionInternal(t, e);
  }
  /**
   * Multiply the view resolution by a ratio, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} ratio The ratio to apply on the view resolution.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  adjustResolutionInternal(t, e) {
    const n = this.getAnimating() || this.getInteracting(), r = this.getViewportSize_(this.getRotation()), A = this.constraints_.resolution(
      this.targetResolution_ * t,
      0,
      r,
      n
    );
    e && (this.targetCenter_ = this.calculateCenterZoom(A, e)), this.targetResolution_ *= t, this.applyTargetState_();
  }
  /**
   * Adds a value to the view zoom level, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} delta Relative value to add to the zoom level.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   * @api
   */
  adjustZoom(t, e) {
    this.adjustResolution(Math.pow(this.zoomFactor_, -t), e);
  }
  /**
   * Adds a value to the view rotation, optionally using an anchor. Any rotation
   * constraint will apply.
   * @param {number} delta Relative value to add to the zoom rotation, in radians.
   * @param {import("./coordinate.js").Coordinate} [anchor] The rotation center.
   * @api
   */
  adjustRotation(t, e) {
    e && (e = he(e, this.getProjection())), this.adjustRotationInternal(t, e);
  }
  /**
   * @param {number} delta Relative value to add to the zoom rotation, in radians.
   * @param {import("./coordinate.js").Coordinate} [anchor] The rotation center.
   */
  adjustRotationInternal(t, e) {
    const n = this.getAnimating() || this.getInteracting(), r = this.constraints_.rotation(
      this.targetRotation_ + t,
      n
    );
    e && (this.targetCenter_ = this.calculateCenterRotate(r, e)), this.targetRotation_ += t, this.applyTargetState_();
  }
  /**
   * Set the center of the current view. Any extent constraint will apply.
   * @param {import("./coordinate.js").Coordinate|undefined} center The center of the view.
   * @observable
   * @api
   */
  setCenter(t) {
    this.setCenterInternal(
      t && he(t, this.getProjection())
    );
  }
  /**
   * Set the center using the view projection (not the user projection).
   * @param {import("./coordinate.js").Coordinate|undefined} center The center of the view.
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
    const n = this.getAnimating() || this.getInteracting() || e, r = this.constraints_.rotation(
      this.targetRotation_,
      n
    ), A = this.getViewportSize_(r), s = this.constraints_.resolution(
      this.targetResolution_,
      0,
      A,
      n
    ), o = this.constraints_.center(
      this.targetCenter_,
      s,
      A,
      n,
      this.calculateCenterShift(
        this.targetCenter_,
        s,
        r,
        A
      )
    );
    this.get(Ht.ROTATION) !== r && this.set(Ht.ROTATION, r), this.get(Ht.RESOLUTION) !== s && (this.set(Ht.RESOLUTION, s), this.set("zoom", this.getZoom(), !0)), (!o || !this.get(Ht.CENTER) || !hr(this.get(Ht.CENTER), o)) && this.set(Ht.CENTER, o), this.getAnimating() && !t && this.cancelAnimations(), this.cancelAnchor_ = void 0;
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
    const r = e || 0, A = this.constraints_.rotation(this.targetRotation_), s = this.getViewportSize_(A), o = this.constraints_.resolution(
      this.targetResolution_,
      r,
      s
    ), g = this.constraints_.center(
      this.targetCenter_,
      o,
      s,
      !1,
      this.calculateCenterShift(
        this.targetCenter_,
        o,
        A,
        s
      )
    );
    if (t === 0 && !this.cancelAnchor_) {
      this.targetResolution_ = o, this.targetRotation_ = A, this.targetCenter_ = g, this.applyTargetState_();
      return;
    }
    n = n || (t === 0 ? this.cancelAnchor_ : void 0), this.cancelAnchor_ = void 0, (this.getResolution() !== o || this.getRotation() !== A || !this.getCenterInternal() || !hr(this.getCenterInternal(), g)) && (this.getAnimating() && this.cancelAnimations(), this.animateInternal({
      rotation: A,
      center: g,
      resolution: o,
      duration: t,
      easing: Rr,
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
    this.resolveConstraints(0), this.setHint(fe.INTERACTING, 1);
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
    n = n && he(n, this.getProjection()), this.endInteractionInternal(t, e, n);
  }
  /**
   * Notify the View that an interaction has ended. The view state will be resolved
   * to a stable one if needed (depending on its constraints).
   * @param {number} [duration] Animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  endInteractionInternal(t, e, n) {
    this.getInteracting() && (this.setHint(fe.INTERACTING, -1), this.resolveConstraints(t, e, n));
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
    return this.constraints_.center(
      t,
      e || this.getResolution(),
      n
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
    const n = this.getResolutionForZoom(t);
    return this.getZoomForResolution(
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
    return this.constraints_.resolution(t, e, n);
  }
}
function nr(i, t) {
  setTimeout(function() {
    i(t);
  }, 0);
}
function yC(i) {
  if (i.extent !== void 0) {
    const e = i.smoothExtentConstraint !== void 0 ? i.smoothExtentConstraint : !0;
    return $A(i.extent, i.constrainOnlyCenter, e);
  }
  const t = bi(i.projection, "EPSG:3857");
  if (i.multiWorld !== !0 && t.isGlobal()) {
    const e = t.getExtent().slice();
    return e[0] = -1 / 0, e[2] = 1 / 0, $A(e, !1, !1);
  }
  return CC;
}
function vC(i) {
  let t, e, n, s = i.minZoom !== void 0 ? i.minZoom : zr, o = i.maxZoom !== void 0 ? i.maxZoom : 28;
  const g = i.zoomFactor !== void 0 ? i.zoomFactor : 2, a = i.multiWorld !== void 0 ? i.multiWorld : !1, I = i.smoothResolutionConstraint !== void 0 ? i.smoothResolutionConstraint : !0, C = i.showFullExtent !== void 0 ? i.showFullExtent : !1, c = bi(i.projection, "EPSG:3857"), l = c.getExtent();
  let h = i.constrainOnlyCenter, u = i.extent;
  if (!a && !u && c.isGlobal() && (h = !1, u = l), i.resolutions !== void 0) {
    const m = i.resolutions;
    e = m[s], n = m[o] !== void 0 ? m[o] : m[m.length - 1], i.constrainResolution ? t = hC(
      m,
      I,
      !h && u,
      C
    ) : t = ts(
      e,
      n,
      I,
      !h && u,
      C
    );
  } else {
    const p = (l ? Math.max(fi(l), bn(l)) : (
      // use an extent that can fit the whole world if need be
      360 * Js.degrees / c.getMetersPerUnit()
    )) / mC / Math.pow(2, zr), v = p / Math.pow(2, 28 - zr);
    e = i.maxResolution, e !== void 0 ? s = 0 : e = p / Math.pow(g, s), n = i.minResolution, n === void 0 && (i.maxZoom !== void 0 ? i.maxResolution !== void 0 ? n = e / Math.pow(g, o) : n = p / Math.pow(g, o) : n = v), o = s + Math.floor(
      Math.log(e / n) / Math.log(g)
    ), n = e / Math.pow(g, o - s), i.constrainResolution ? t = fC(
      g,
      e,
      n,
      I,
      !h && u,
      C
    ) : t = ts(
      e,
      n,
      I,
      !h && u,
      C
    );
  }
  return {
    constraint: t,
    maxResolution: e,
    minResolution: n,
    minZoom: s,
    zoomFactor: g
  };
}
function bC(i) {
  if (i.enableRotation !== void 0 ? i.enableRotation : !0) {
    const e = i.constrainRotation;
    return e === void 0 || e === !0 ? pC() : e === !1 ? es : typeof e == "number" ? dC(e) : es;
  }
  return Di;
}
function wC(i) {
  return !(i.sourceCenter && i.targetCenter && !hr(i.sourceCenter, i.targetCenter) || i.sourceResolution !== i.targetResolution || i.sourceRotation !== i.targetRotation);
}
function Hr(i, t, e, n, r) {
  const A = Math.cos(-r);
  let s = Math.sin(-r), o = i[0] * A - i[1] * s, g = i[1] * A + i[0] * s;
  o += (t[0] / 2 - e[0]) * n, g += (e[1] - t[1] / 2) * n, s = -s;
  const a = o * A - g * s, I = g * A + o * s;
  return [a, I];
}
const EC = {
  /**
   * Triggered before layers are composed.  When dispatched by the map, the event object will not have
   * a `context` set.  When dispatched by a layer, the event object will have a `context` set.  Only
   * WebGL layers currently dispatch this event.
   * @event module:ol/render/Event~RenderEvent#precompose
   * @api
   */
  PRECOMPOSE: "precompose"
}, It = {
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
class MC extends An {
  /**
   * @param {Options} options Layer options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, this.background_ = t.background;
    const e = Object.assign({}, t);
    typeof t.properties == "object" && (delete e.properties, Object.assign(e, t.properties)), e[It.OPACITY] = t.opacity !== void 0 ? t.opacity : 1, de(
      typeof e[It.OPACITY] == "number",
      "Layer opacity must be a number"
    ), e[It.VISIBLE] = t.visible !== void 0 ? t.visible : !0, e[It.Z_INDEX] = t.zIndex, e[It.MAX_RESOLUTION] = t.maxResolution !== void 0 ? t.maxResolution : 1 / 0, e[It.MIN_RESOLUTION] = t.minResolution !== void 0 ? t.minResolution : 0, e[It.MIN_ZOOM] = t.minZoom !== void 0 ? t.minZoom : -1 / 0, e[It.MAX_ZOOM] = t.maxZoom !== void 0 ? t.maxZoom : 1 / 0, this.className_ = e.className !== void 0 ? e.className : "ol-layer", delete e.className, this.setProperties(e), this.state_ = null;
  }
  /**
   * Get the background for this layer.
   * @return {BackgroundColor|false} Layer background.
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
    return e.opacity = Wt(Math.round(this.getOpacity() * 100) / 100, 0, 1), e.visible = this.getVisible(), e.extent = this.getExtent(), e.zIndex = n === void 0 && !e.managed ? 1 / 0 : n, e.maxResolution = this.getMaxResolution(), e.minResolution = Math.max(this.getMinResolution(), 0), e.minZoom = this.getMinZoom(), e.maxZoom = this.getMaxZoom(), this.state_ = e, e;
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").default>} [array] Array of layers (to be
   *     modified in place).
   * @return {Array<import("./Layer.js").default>} Array of layers.
   */
  getLayersArray(t) {
    return Dt();
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").State>} [states] Optional list of layer
   *     states (to be modified in place).
   * @return {Array<import("./Layer.js").State>} List of layer states.
   */
  getLayerStatesArray(t) {
    return Dt();
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
      this.get(It.EXTENT)
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
      this.get(It.MAX_RESOLUTION)
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
      this.get(It.MIN_RESOLUTION)
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
      this.get(It.MIN_ZOOM)
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
      this.get(It.MAX_ZOOM)
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
      this.get(It.OPACITY)
    );
  }
  /**
   * @abstract
   * @return {import("../source/Source.js").State} Source state.
   */
  getSourceState() {
    return Dt();
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
      this.get(It.VISIBLE)
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
      this.get(It.Z_INDEX)
    );
  }
  /**
   * Sets the background color.
   * @param {BackgroundColor} [background] Background color.
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
    this.set(It.EXTENT, t);
  }
  /**
   * Set the maximum resolution at which the layer is visible.
   * @param {number} maxResolution The maximum resolution of the layer.
   * @observable
   * @api
   */
  setMaxResolution(t) {
    this.set(It.MAX_RESOLUTION, t);
  }
  /**
   * Set the minimum resolution at which the layer is visible.
   * @param {number} minResolution The minimum resolution of the layer.
   * @observable
   * @api
   */
  setMinResolution(t) {
    this.set(It.MIN_RESOLUTION, t);
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
    this.set(It.MAX_ZOOM, t);
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
    this.set(It.MIN_ZOOM, t);
  }
  /**
   * Set the opacity of the layer, allowed values range from 0 to 1.
   * @param {number} opacity The opacity of the layer.
   * @observable
   * @api
   */
  setOpacity(t) {
    de(typeof t == "number", "Layer opacity must be a number"), this.set(It.OPACITY, t);
  }
  /**
   * Set the visibility of the layer (`true` or `false`).
   * @param {boolean} visible The visibility of the layer.
   * @observable
   * @api
   */
  setVisible(t) {
    this.set(It.VISIBLE, t);
  }
  /**
   * Set Z-index of the layer, which is used to order layers before rendering.
   * The default Z-index is 0.
   * @param {number} zindex The z-index of the layer.
   * @observable
   * @api
   */
  setZIndex(t) {
    this.set(It.Z_INDEX, t);
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.state_ && (this.state_.layer = null, this.state_ = null), super.disposeInternal();
  }
}
class Io extends MC {
  /**
   * @param {Options<SourceType>} options Layer options.
   */
  constructor(t) {
    const e = Object.assign({}, t);
    delete e.source, super(e), this.on, this.once, this.un, this.mapPrecomposeKey_ = null, this.mapRenderKey_ = null, this.sourceChangeKey_ = null, this.renderer_ = null, this.sourceReady_ = !1, this.rendered = !1, t.render && (this.render = t.render), t.map && this.setMap(t.map), this.addChangeListener(
      It.SOURCE,
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
      this.get(It.SOURCE) || null
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
    this.changed(), !(this.sourceReady_ || this.getSource().getState() !== "ready") && (this.sourceReady_ = !0, this.dispatchEvent("sourceready"));
  }
  /**
   * @private
   */
  handleSourcePropertyChange_() {
    this.sourceChangeKey_ && (dn(this.sourceChangeKey_), this.sourceChangeKey_ = null), this.sourceReady_ = !1;
    const t = this.getSource();
    t && (this.sourceChangeKey_ = Ke(
      t,
      ve.CHANGE,
      this.handleSourceChange_,
      this
    ), t.getState() === "ready" && (this.sourceReady_ = !0, setTimeout(() => {
      this.dispatchEvent("sourceready");
    }, 0))), this.changed();
  }
  /**
   * @param {import("../pixel").Pixel} pixel Pixel.
   * @return {Promise<Array<import("../Feature").FeatureLike>>} Promise that resolves with
   * an array of features.
   */
  getFeatures(t) {
    return this.renderer_ ? this.renderer_.getFeatures(t) : Promise.resolve([]);
  }
  /**
   * @param {import("../pixel").Pixel} pixel Pixel.
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
    !t && n && (t = n.getView()), t instanceof ns ? e = {
      viewState: t.getState(),
      extent: t.calculateExtent()
    } : e = t, !e.layerStatesArray && n && (e.layerStatesArray = n.getLayerGroup().getLayerStatesArray());
    let r;
    if (e.layerStatesArray) {
      if (r = e.layerStatesArray.find(
        (s) => s.layer === this
      ), !r)
        return !1;
    } else
      r = this.getLayerState();
    const A = this.getExtent();
    return PC(r, e.viewState) && (!A || di(A, e.extent));
  }
  /**
   * Get the attributions of the source of this layer for the given view.
   * @param {View|import("../View.js").ViewStateLayerStateExtent} [view] View or {@link import("../Map.js").FrameState}.
   * Only required when the layer is not added to a map.
   * @return {Array<string>} Attributions for this layer at the given view.
   * @api
   */
  getAttributions(t) {
    var A;
    if (!this.isVisible(t))
      return [];
    const e = (A = this.getSource()) == null ? void 0 : A.getAttributions();
    if (!e)
      return [];
    const n = t instanceof ns ? t.getViewStateAndExtent() : t;
    let r = e(n);
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
    const n = this.getRenderer();
    return n.prepareFrame(t) ? (this.rendered = !0, n.renderFrame(t, e)) : null;
  }
  /**
   * Called when a layer is not visible during a map render.
   */
  unrender() {
    this.rendered = !1;
  }
  /** @return {string} Declutter */
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
    t || this.unrender(), this.set(It.MAP, t);
  }
  /**
   * For use inside the library only.
   * @return {import("../Map.js").default|null} Map.
   */
  getMapInternal() {
    return this.get(It.MAP);
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
    this.mapPrecomposeKey_ && (dn(this.mapPrecomposeKey_), this.mapPrecomposeKey_ = null), t || this.changed(), this.mapRenderKey_ && (dn(this.mapRenderKey_), this.mapRenderKey_ = null), t && (this.mapPrecomposeKey_ = Ke(
      t,
      EC.PRECOMPOSE,
      this.handlePrecompose_,
      this
    ), this.mapRenderKey_ = Ke(this, ve.CHANGE, t.render, t), this.changed());
  }
  /**
   * @param {import("../events/Event.js").default} renderEvent Render event
   * @private
   */
  handlePrecompose_(t) {
    const e = (
      /** @type {import("../render/Event.js").default} */
      t.frameState.layerStatesArray
    ), n = this.getLayerState(!1);
    de(
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
    this.set(It.SOURCE, t);
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
    return null;
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
function PC(i, t) {
  if (!i.visible)
    return !1;
  const e = t.resolution;
  if (e < i.minResolution || e >= i.maxResolution)
    return !1;
  const n = t.zoom;
  return n > i.minZoom && n <= i.maxZoom;
}
class RC extends Io {
  constructor(t) {
    const e = function(n) {
      const r = this.getSource(), A = r.mapboxMap;
      if (!A)
        return console.error("MapboxLayer: mapboxMap is undefined!"), null;
      A.setStyle(r.style);
      const s = A.getCanvas(), o = n.viewState, g = this.getVisible();
      s.style.display = g ? "block" : "none";
      const a = this.getOpacity();
      s.style.opacity = a;
      const I = o.rotation * -180 / Math.PI, C = ci(o.center), c = o.zoom - 1, l = A.getBearing(), h = A.getCenter().toArray(), u = A.getZoom();
      return I == l && C[0] == h[0] && C[1] == h[1] && c == u || (I != l && A.rotateTo(I, {
        animate: !1
      }), (C[0] != h[0] || C[1] != h[1] || c != u) && A.jumpTo({
        center: C,
        zoom: c,
        animate: !1
      }), A._frame && (A._frame.cancel(), A._frame = null), A._render()), s;
    };
    super({
      render: e,
      source: t.source
    });
  }
}
class xC extends Io {
  constructor(t) {
    const e = function(n) {
      const r = this.getSource(), A = r.maplibreMap;
      if (!A)
        return console.error("MapLibreLayer: maplibreMap is undefined!"), null;
      A.setStyle(r.style);
      const s = A.getCanvas(), o = n.viewState, g = this.getVisible();
      s.style.display = g ? "block" : "none";
      const a = this.getOpacity();
      s.style.opacity = a;
      const C = -o.rotation * 180 / Math.PI, c = A.getBearing();
      Math.abs(C - c) > 0.01 && (A.stop(), A.setBearing(C));
      const l = ci(o.center), h = o.zoom - 1;
      if ((A.getCenter().toArray().toString() !== l.toString() || A.getZoom() !== h) && A.jumpTo({
        center: l,
        zoom: h,
        animate: !1
      }), A._frame && (A._frame.cancel(), A._frame = null), n.size) {
        const [u, m] = n.size;
        (s.width !== u || s.height !== m) && A.resize();
      }
      return A._render(), Math.abs(A.getZoom() - h) > 0.01 && A.setZoom(h), s.style.position = "absolute", s.style.left = "0", s.style.top = "0", s;
    };
    super({
      render: e,
      source: t.source
    });
  }
}
const Co = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAxMS0xMC0yNlQyMTo1MjoxOFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAxMS0xMC0yN1QxNzo0MjowN1o8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgkVIwmwAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTM5jWRgMAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTAvMjYvMTHjwOqVAAARQHByVld4nMWbB3wURdvAd6/u3V6/27sts/PMQQhFpEU6SlNBRXqTfgkkQOhFSigHIgIWkJqAIJ1QBCz0KkJoQYrSQaQjioBKC+XezWU5fH2/3+/L8fu+fWd3bubZKf95nnlmdjeX2/dk602qD9UnooRc5YjkKp9KyIrkZikfkazcSFaWcuZmpUZScyOpWcqZm6rkU3OTIpGk3EhSViQpVTlzk5IiSUm5VCRC5UaorAiVqpy5VFKESspND6UY03O6U0oYGHo3NCg0ODSj59BQRmhYaHhoaDofFsJiGIVfC78e/hnOwwW4CI1Ttve/AlehLClH6oTrhl8N1wu3CIcFKhqWiwVpWvrG9EcjmXC2nC/1Sd+dHgonh1PCpxQ5nN4pfHHk3qGzOlFUepiiPk5PC/cO9wn3DfcL59deGOqWXC95Saigp/fCY8Lvh0e9Xm94q3DBlXLd2qm5kmRpSrdw9/CEqNwneWQ4HH6hXul6FHVs5Gfh2eGbI6eFp0fLxoZqhE/KC6P5Oa9lhzN7ymofy5PN4anhCRlfFpSVXxNeG26UQf0jyBSO5R1UcjTdF/3c8o+a66j11AbqhCrtpvZQe6lzqnSRukRdjtU8Q52lfqJuqNJt6g/qTzW/ltpKbaO2U99SO9QrF6j71AMqL9b2OvUr9VtMYmgLbaU9dIHkpwM0r+YdtJN20W76ytOa/zZWjpZpTANdNlr7NJVEv0RXpCtFpR+panR1ugZdPCodoGrTdei69MNou3p0ffoN+k36aT+rqcZqfheVQzWiW9HUP0Kn6BVEJ9DF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zV6+JT3q/K+UUkoppZ5Tl9rnzXTvZS/51pTrIJewYX0bzb5r+vfUX7X2ebU/rDnUmslszXqN0v99bSO/80ff/EtrIayb9PNrKMs56kf84zG7v5Te6HqW1yytUb8m7mzNaVbmv4r9stz7I1/WPPKc9sIzuc6ebST3XjlnDZd7OSawd7MmvNs6y5nriXWP9WbWmvq6UoX3Ota9TCttV8f0GZBXXqMep8R6JfdJl73upTKfo+6XbG+j/s9aG7ZmP75rNPZXvNzHLegjrPOtCT9WL+yXY17/tyH3IRB7GXXMtcq0VabZ8xrZt/8TQZzR/ZH/R2U+R33+P8X/GX/2/pB24py9GY74M//JWBN+ar36nJd7Avh6VKf0QbdPXs/yyrDRPhP3sz9znXmPynyutvB/30cpn1CmPC8x1jF+MpbRnteGn1Ivwhg3+I8AG9O+EHNt938fc3KP8pj/+X8i8yj1+93/szKfq2P+z7kdO/R+knUt9fEpfYO/iMs8tlX4MbtnGLbk/TrnYcZw4mLntDV7nfgz9yiPlYN/a/EhbSdtyp7ZyP+jMp/zLsh+W9YpfUffzrpij9FYRdxMr+fX/dn7wZpwwpbqlWHUg7mk+zfn8tE3GM/350Z59TDaQN+LTBsTP/Oelbn3tUtoab1APb70v1JKKaWUUkoppZRSSl1NOxERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERGRO+Qfh5eOajemXSYAAAFTbWtCVPrOyv4Af1WJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4nO3W4WmDYBSGUQdxEQdxEBdxEAdxEQexvIELt6Yh/4oJ54FDm0/7601szlOSJEmSJEmSJEmSJEmSJEmSJEkf0XEc577vT+c5y7V397+6T/dvXddzHMdzmqbHz+wY/Sz31L11FsuyPF7HMAx/vod077JjlX2zYXatzfs9tX/VN7/+je5ftut7Vjnrn+V6nX37xtm/ul7T/ctzvu9f/9fneX7aP9fs/31l23ru1+/btv36zPfnv/2/r/oe1/er90Cu1Xf7nEXVnx3Xa5IkSZIkSZIk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b24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+zWqGFQAACShJREFUWIWVmGusXFUVx39r73POzJy5M3fmPtrblj7p7btYGigGmojExISHQQ0miDFA4lc0SCBRNH4gRhNJ/aIfNAIxUkKIkMgjBBKMCHwQEGKhpbS39HXfve+5M3fmnr23H84+M7e1PDyTlbPPnDl7//da//Vf64zwBQ9jjCilAiDyFgIaUP4nFjDAMtACWtbaRGvtPmte59Lb8gUW137hGCgDFaDkrzMwrABRBxaAWWDeX7esteZyoD4XSJIkorXO+cV7gQFg9fMvLdz74bHm+hOnTP/QsOmeaxBYoJTDbF2n5wa36At7d+XOfOOW0uPAmLcpYN4Y0wyC4LIeuiwQ55wC8kA/sHF62tz5+F/mDz7zytKOTxpBMKsCEq1BCWjBiQAOcRAYQylpcWW0bG6/Kf/Rvd/rfmP1Kn0YOANMAksiYj8XiAcRew9se/ZvtR8/+seFr3xQj3QtDHGhQCCIFtAqDYxI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", co = "data:image/png;base64,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", lo = "data:image/png;base64,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", Bi = "data:image/png;base64,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", SC = new _t({
  image: new tn({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: Co
  })
}), OC = new _t({
  image: new tn({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: co
  })
}), DC = new _t({
  image: new tn({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: lo
  })
}), BC = new _t({
  fill: new $r({
    color: [128, 128, 256, 0.2]
  }),
  stroke: new _r({
    color: [128, 128, 256, 1],
    width: 3
  })
}), TC = new _t({
  image: new tn({
    anchor: [0.5, 1],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: Bi
  })
});
class On extends Ig {
  constructor(e) {
    e = te(e || {});
    const n = new Vn({
      source: new Yn({
        wrapX: !1
      })
    });
    n.set("name", "gps");
    const r = new Vn({
      source: new Yn({
        wrapX: !1
      })
    });
    r.set("name", "marker");
    const A = new Vn({
      source: new Yn({
        wrapX: !1
      })
    });
    A.set("name", "feature");
    const s = new Vn({
      source: new Yn({
        wrapX: !1
      })
    });
    s.set("name", "envelope");
    const o = On.spawnLayer(
      null,
      e.source,
      e.target
    ), g = new cg();
    g.set("name", "overlay");
    const I = {
      controls: e.controls ? e.controls : [],
      layers: [
        o,
        g,
        s,
        A,
        n,
        r
      ],
      target: e.div,
      view: new ms({
        center: e.defaultCenter || [0, 0],
        zoom: e.defaultZoom || 2,
        rotation: e.defaultRotation || 0,
        multiWorld: !0
      })
    };
    e.interactions && (I.interactions = e.interactions);
    super(I);
    M(this, "fakeGps");
    M(this, "fakeRadius");
    M(this, "geolocation");
    M(this, "homePosition");
    M(this, "northUp");
    M(this, "tapDuration");
    M(this, "homeMarginPixels");
    M(this, "tapUIVanish");
    M(this, "alwaysGpsOn");
    M(this, "__ignore_first_move");
    this.fakeGps = e.fakeGps, this.fakeRadius = e.fakeRadius, this.homePosition = e.homePosition, this.northUp = e.northUp, this.tapDuration = e.tapDuration, this.homeMarginPixels = e.homeMarginPixels, this.tapUIVanish = e.tapUIVanish, this.alwaysGpsOn = e.alwaysGpsOn || !1;
    const C = this.getView();
    this.__ignore_first_move = !0;
    const c = () => {
      this.__ignore_first_move || this.dispatchEvent("movestart"), this.__ignore_first_move = !1, C.un("propertychange", c);
    };
    C.on("propertychange", c), this.on("moveend", () => {
      C.on("propertychange", c);
    }), C.on("change:resolution", () => {
      this.getSource();
    });
  }
  static spawnLayer(e, n, r) {
    return n instanceof xn || n instanceof Sn || !(e instanceof Nr) ? (n instanceof xn ? e = new RC({
      style: n.style,
      accessToken: n.accessToken,
      container: r,
      source: n
    }) : n instanceof Sn ? e = new xC({
      style: n.style,
      container: r,
      source: n
    }) : e = new Nr({
      source: n
    }), e.set("name", "base")) : e.setSource(n), e;
  }
  getLayer(e = "base") {
    const n = (r) => {
      const A = r.getArray().map((s) => {
        if (s.get("name") == e) return s;
        if (s.getLayers) return n(s.getLayers());
      }).filter((s) => s);
      if (A.length != 0)
        return A[0];
    };
    return n(this.getLayers());
  }
  getSource(e = "base") {
    const n = this.getLayer(e);
    if (n)
      return n.getSource();
  }
  setFeature(e, n, r) {
    const A = this.getSource(r), s = new Cg(e);
    return n && s.setStyle(n), A.addFeature(s), s;
  }
  removeFeature(e, n) {
    this.getSource(n).removeFeature(e);
  }
  resetFeature(e) {
    this.getSource(e).clear();
  }
  setGPSPosition(e, n = void 0) {
    const r = n == "sub" ? DC : n == "hide" ? OC : SC;
    n != "sub" && this.resetFeature("gps"), e && (this.setFeature(
      {
        geometry: new Rn(e.xy)
      },
      r,
      "gps"
    ), n || this.setFeature(
      {
        geometry: new Ei(e.xy, e.rad)
      },
      BC,
      "gps"
    ));
  }
  setMarker(e, n, r, A) {
    return A || (A = "marker"), n.geometry = new Rn(e), r ? typeof r == "string" ? r = new _t({
      image: new tn({
        anchor: [0.5, 1],
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: r
      })
    }) : r instanceof _t || (r = new _t({
      image: new tn(r)
    })) : r = TC, this.setFeature(n, r, A);
  }
  resetMarker(e) {
    e || (e = "marker"), this.resetFeature(e);
  }
  setLine(e, n, r) {
    return this.setVector(e, "Line", n ? { stroke: n } : null, r);
  }
  setVector(e, n = "Line", r, A) {
    A || (A = "feature");
    const s = {};
    r.stroke != null && (s.stroke = new _r(r.stroke)), r.fill != null && (s.fill = new $r(r.fill));
    const o = new _t(s), g = n === "Line" ? new pr(e) : new Le(e);
    return this.setFeature(
      {
        geometry: g,
        name: n
      },
      o,
      A
    );
  }
  resetLine(e) {
    this.resetVector(e);
  }
  resetVector(e) {
    e || (e = "feature"), this.resetFeature(e);
  }
  setEnvelope(e, n, r) {
    return r || (r = "envelope"), this.setLine(e, n, r);
  }
  removeEnvelope(e, n) {
    n || (n = "envelope"), this.removeFeature(e, n);
  }
  resetEnvelope(e) {
    e || (e = "envelope"), this.resetFeature(e);
  }
  setFillEnvelope(e, n, r, A) {
    A || (A = "envelope");
    let s;
    if (n != null || r != null) {
      const o = {};
      n != null && (o.stroke = new _r(n)), r != null && (o.fill = new $r(r)), s = new _t(o);
    }
    return this.setFeature(
      {
        geometry: new Le([e])
      },
      s,
      A
    );
  }
  exchangeSource(e = void 0) {
    const n = this.getLayers(), r = n.item(0), A = On.spawnLayer(r, e, this.getTarget());
    A != r && n.setAt(0, A), e && e.setMap(this);
  }
  setLayer(e = void 0) {
    const n = this.getLayer("overlay").getLayers();
    if (n.clear(), e) {
      const r = new Nr({
        source: e
      });
      n.push(r);
    }
  }
  setTransparency(e) {
    const n = (100 - e) / 100, r = this.getSource();
    r instanceof rn || r instanceof ai ? (this.getLayers().item(0).setOpacity(1), this.getLayers().item(1).setOpacity(n)) : this.getLayers().item(0).setOpacity(n);
  }
  setGPSMarker(e, n) {
    this.getLayers().item(0).getSource().setGPSMarker(e, n);
  }
}
const ln = {
  /**
   * A true double click, with no dragging.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#dblclick
   * @api
   */
  DBLCLICK: ve.DBLCLICK,
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
}, rs = {
  ACTIVE: "active"
};
class Nn extends An {
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
      this.get(rs.ACTIVE)
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
    this.set(rs.ACTIVE, t);
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
function jC(i, t, e) {
  const n = i.getCenterInternal();
  if (n) {
    const r = [n[0] + t[0], n[1] + t[1]];
    i.animateInternal({
      duration: e !== void 0 ? e : 250,
      easing: uC,
      center: i.getConstrainedCenter(r)
    });
  }
}
function Ti(i, t, e, n) {
  const r = i.getZoom();
  if (r === void 0)
    return;
  const A = i.getConstrainedZoom(r + t), s = i.getResolutionForZoom(A);
  i.getAnimating() && i.cancelAnimations(), i.animate({
    resolution: s,
    anchor: e,
    duration: n !== void 0 ? n : 250,
    easing: Rr
  });
}
class LC extends Nn {
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
    if (t.type == ln.DBLCLICK) {
      const n = (
        /** @type {MouseEvent} */
        t.originalEvent
      ), r = t.map, A = t.coordinate, s = n.shiftKey ? -this.delta_ : this.delta_, o = r.getView();
      Ti(o, s, A, this.duration_), n.preventDefault(), e = !0;
    }
    return !e;
  }
}
const ke = typeof navigator < "u" && typeof navigator.userAgent < "u" ? navigator.userAgent.toLowerCase() : "", kC = ke.includes("safari") && !ke.includes("chrom");
kC && (ke.includes("version/15.4") || /cpu (os|iphone os) 15_4 like mac os x/.test(ke));
const NC = ke.includes("webkit") && !ke.includes("edge"), uo = ke.includes("macintosh");
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
function Ii(i) {
  const t = arguments;
  return function(e) {
    let n = !0;
    for (let r = 0, A = t.length; r < A && (n = n && t[r](e), !!n); ++r)
      ;
    return n;
  };
}
const GC = function(i) {
  const t = i.originalEvent;
  return t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, XC = function(i) {
  const t = i.originalEvent;
  return t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, ZC = function(i) {
  const t = i.map.getTargetElement(), e = t.getRootNode(), n = i.map.getOwnerDocument().activeElement;
  return e instanceof ShadowRoot ? e.host.contains(n) : t.contains(n);
}, ho = function(i) {
  const t = i.map.getTargetElement(), e = t.getRootNode();
  return (e instanceof ShadowRoot ? e.host : t).hasAttribute("tabindex") ? ZC(i) : !0;
}, FC = Ua, fo = function(i) {
  const t = i.originalEvent;
  return "pointerId" in t && t.button == 0 && !(NC && uo && t.ctrlKey);
}, po = function(i) {
  const t = (
    /** @type {KeyboardEvent|MouseEvent|TouchEvent} */
    i.originalEvent
  );
  return !t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, UC = function(i) {
  const t = i.originalEvent;
  return uo ? t.metaKey : t.ctrlKey;
}, mo = function(i) {
  const t = i.originalEvent;
  return !t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, yo = function(i) {
  const t = i.originalEvent, e = (
    /** @type {Element} */
    t.target.tagName
  );
  return e !== "INPUT" && e !== "SELECT" && e !== "TEXTAREA" && // `isContentEditable` is only available on `HTMLElement`, but it may also be a
  // different type like `SVGElement`.
  // @ts-ignore
  !t.target.isContentEditable;
}, $e = function(i) {
  const t = i.originalEvent;
  return "pointerId" in t && t.pointerType == "mouse";
}, zC = function(i) {
  const t = i.originalEvent;
  return "pointerId" in t && t.isPrimary && t.button === 0;
};
class HC extends Xs {
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
    const t = this.startPixel_, e = this.endPixel_, n = "px", r = this.element_.style;
    r.left = Math.min(t[0], e[0]) + n, r.top = Math.min(t[1], e[1]) + n, r.width = Math.abs(e[0] - t[0]) + n, r.height = Math.abs(e[1] - t[1]) + n;
  }
  /**
   * @param {import("../Map.js").default|null} map Map.
   */
  setMap(t) {
    if (this.map_) {
      this.map_.getOverlayContainer().removeChild(this.element_);
      const e = this.element_.style;
      e.left = "inherit", e.top = "inherit", e.width = "inherit", e.height = "inherit";
    }
    this.map_ = t, this.map_ && this.map_.getOverlayContainer().appendChild(this.element_);
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
    const t = this.startPixel_, e = this.endPixel_, r = [
      t,
      [t[0], e[1]],
      e,
      [e[0], t[1]]
    ].map(
      this.map_.getCoordinateFromPixelInternal,
      this.map_
    );
    r[4] = r[0].slice(), this.geometry_ ? this.geometry_.setCoordinates([r]) : this.geometry_ = new Le([r]);
  }
  /**
   * @return {import("../geom/Polygon.js").default} Geometry.
   */
  getGeometry() {
    return this.geometry_;
  }
}
class sn extends Nn {
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
      if (t.type == ln.POINTERDRAG)
        this.handleDragEvent(t), t.originalEvent.preventDefault();
      else if (t.type == ln.POINTERUP) {
        const n = this.handleUpEvent(t);
        this.handlingDownUpSequence = n && this.targetPointers.length > 0;
      }
    } else if (t.type == ln.POINTERDOWN) {
      const n = this.handleDownEvent(t);
      this.handlingDownUpSequence = n, e = this.stopDown(n);
    } else t.type == ln.POINTERMOVE && this.handleMoveEvent(t);
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
function ji(i) {
  const t = i.length;
  let e = 0, n = 0;
  for (let r = 0; r < t; r++)
    e += i[r].clientX, n += i[r].clientY;
  return { clientX: e / t, clientY: n / t };
}
const We = {
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
class cn extends Ce {
  /**
   * @param {string} type The event type.
   * @param {import("../coordinate.js").Coordinate} coordinate The event coordinate.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Originating event.
   */
  constructor(t, e, n) {
    super(t), this.coordinate = e, this.mapBrowserEvent = n;
  }
}
class QC extends sn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = t ?? {}, this.box_ = new HC(t.className || "ol-dragbox"), this.minArea_ = t.minArea ?? 64, t.onBoxEnd && (this.onBoxEnd = t.onBoxEnd), this.startPixel_ = null, this.condition_ = t.condition ?? fo, this.boxEndCondition_ = t.boxEndCondition ?? this.defaultBoxEndCondition;
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
    const r = n[0] - e[0], A = n[1] - e[1];
    return r * r + A * A >= this.minArea_;
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
      new cn(
        We.BOXDRAG,
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
      new cn(
        e ? We.BOXEND : We.BOXCANCEL,
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
      new cn(
        We.BOXSTART,
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
      new cn(We.BOXCANCEL, this.startPixel_, null)
    ), this.startPixel_ = null)), super.setActive(t);
  }
  /**
   * @param {import("../Map.js").default|null} map Map.
   * @override
   */
  setMap(t) {
    this.getMap() && (this.box_.setMap(null), this.startPixel_ && (this.dispatchEvent(
      new cn(We.BOXCANCEL, this.startPixel_, null)
    ), this.startPixel_ = null)), super.setMap(t);
  }
}
class WC extends sn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super({
      stopDown: br
    }), t = t || {}, this.kinetic_ = t.kinetic, this.lastCentroid = null, this.lastPointersCount_, this.panning_ = !1;
    const e = t.condition ? t.condition : Ii(po, zC);
    this.condition_ = t.onFocusOnly ? Ii(ho, e) : e, this.noKinetic_ = !1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    const e = t.map;
    this.panning_ || (this.panning_ = !0, e.getView().beginInteraction());
    const n = this.targetPointers, r = e.getEventPixel(ji(n));
    if (n.length == this.lastPointersCount_) {
      if (this.kinetic_ && this.kinetic_.update(r[0], r[1]), this.lastCentroid) {
        const A = [
          this.lastCentroid[0] - r[0],
          r[1] - this.lastCentroid[1]
        ], o = t.map.getView();
        II(A, o.getResolution()), mi(A, o.getRotation()), o.adjustCenterInternal(A);
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
        const r = this.kinetic_.getDistance(), A = this.kinetic_.getAngle(), s = n.getCenterInternal(), o = e.getPixelFromCoordinateInternal(s), g = e.getCoordinateFromPixelInternal([
          o[0] - r * Math.cos(A),
          o[1] - r * Math.sin(A)
        ]);
        n.animateInternal({
          center: n.getConstrainedCenter(g),
          duration: 500,
          easing: Rr
        });
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
class VC extends sn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super({
      stopDown: br
    }), this.condition_ = t.condition ? t.condition : XC, this.lastAngle_ = void 0, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    if (!$e(t))
      return;
    const e = t.map, n = e.getView();
    if (n.getConstraints().rotation === Di)
      return;
    const r = e.getSize(), A = t.pixel, s = Math.atan2(r[1] / 2 - A[1], A[0] - r[0] / 2);
    if (this.lastAngle_ !== void 0) {
      const o = s - this.lastAngle_;
      n.adjustRotationInternal(-o);
    }
    this.lastAngle_ = s;
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    return $e(t) ? (t.map.getView().endInteraction(this.duration_), !1) : !0;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    return $e(t) && fo(t) && this.condition_(t) ? (t.map.getView().beginInteraction(), this.lastAngle_ = void 0, !0) : !1;
  }
}
class YC extends sn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Pointer.js").Options} */
      t
    ), this.condition_ = t.condition ? t.condition : mo, this.lastAngle_ = void 0, this.lastMagnitude_ = void 0, this.lastScaleDelta_ = 0, this.duration_ = t.duration !== void 0 ? t.duration : 400;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    if (!$e(t))
      return;
    const e = t.map, n = e.getSize(), r = t.pixel, A = r[0] - n[0] / 2, s = n[1] / 2 - r[1], o = Math.atan2(s, A), g = Math.sqrt(A * A + s * s), a = e.getView();
    if (this.lastAngle_ !== void 0) {
      const I = this.lastAngle_ - o;
      a.adjustRotationInternal(I);
    }
    this.lastAngle_ = o, this.lastMagnitude_ !== void 0 && a.adjustResolutionInternal(this.lastMagnitude_ / g), this.lastMagnitude_ !== void 0 && (this.lastScaleDelta_ = this.lastMagnitude_ / g), this.lastMagnitude_ = g;
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    if (!$e(t))
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
    return $e(t) && this.condition_(t) ? (t.map.getView().beginInteraction(), this.lastAngle_ = void 0, this.lastMagnitude_ = void 0, !0) : !1;
  }
}
class KC extends QC {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = t.condition ? t.condition : mo;
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
    const n = (
      /** @type {!import("../View.js").default} */
      this.getMap().getView()
    );
    let r = this.getGeometry();
    if (this.out_) {
      const A = n.rotatedExtentForGeometry(r), s = n.getResolutionForExtentInternal(A), o = n.getResolution() / s;
      r = r.clone(), r.scale(o * o);
    }
    n.fitInternal(r, {
      duration: this.duration_,
      easing: Rr
    });
  }
}
const rr = {
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
}, is = {
  LENGTH: "length"
};
class ir extends Ce {
  /**
   * @param {import("./CollectionEventType.js").default} type Type.
   * @param {T} element Element.
   * @param {number} index The index of the added or removed element.
   */
  constructor(t, e, n) {
    super(t), this.element = e, this.index = n;
  }
}
class JC extends An {
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
    return this.get(is.LENGTH);
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
      new ir(rr.ADD, e, t)
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
      new ir(rr.REMOVE, e, t)
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
      new ir(rr.REMOVE, r, t)
    ), this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new ir(rr.ADD, e, t)
    );
  }
  /**
   * @private
   */
  updateLength_() {
    this.set(is.LENGTH, this.array_.length);
  }
  /**
   * @private
   * @param {T} elem Element.
   * @param {number} [except] Optional index to ignore.
   */
  assertUnique_(t, e) {
    const n = this.array_;
    for (let r = 0, A = n.length; r < A; ++r)
      if (n[r] === t && r !== e)
        throw new Error("Duplicate item added to a unique collection");
  }
}
const xe = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown"
};
class qC extends Nn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.defaultCondition_ = function(e) {
      return po(e) && yo(e);
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
    if (t.type == ve.KEYDOWN) {
      const n = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), r = n.key;
      if (this.condition_(t) && (r == xe.DOWN || r == xe.LEFT || r == xe.RIGHT || r == xe.UP)) {
        const s = t.map.getView(), o = s.getResolution() * this.pixelDelta_;
        let g = 0, a = 0;
        r == xe.DOWN ? a = -o : r == xe.LEFT ? g = -o : r == xe.RIGHT ? g = o : a = o;
        const I = [g, a];
        mi(I, s.getRotation()), jC(s, I, this.duration_), n.preventDefault(), e = !0;
      }
    }
    return !e;
  }
}
class _C extends Nn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.condition_ = t.condition ? t.condition : function(e) {
      return !UC(e) && yo(e);
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
    if (t.type == ve.KEYDOWN || t.type == ve.KEYPRESS) {
      const n = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), r = n.key;
      if (this.condition_(t) && (r === "+" || r === "-")) {
        const A = t.map, s = r === "+" ? this.delta_ : -this.delta_, o = A.getView();
        Ti(o, s, void 0, this.duration_), n.preventDefault(), e = !0;
      }
    }
    return !e;
  }
}
const $C = 40, tc = 300;
class ec extends Nn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Interaction.js").InteractionOptions} */
      t
    ), this.totalDelta_ = 0, this.lastDelta_ = 0, this.maxDelta_ = t.maxDelta !== void 0 ? t.maxDelta : 1, this.duration_ = t.duration !== void 0 ? t.duration : 250, this.timeout_ = t.timeout !== void 0 ? t.timeout : 80, this.useAnchor_ = t.useAnchor !== void 0 ? t.useAnchor : !0, this.constrainResolution_ = t.constrainResolution !== void 0 ? t.constrainResolution : !1;
    const e = t.condition ? t.condition : FC;
    this.condition_ = t.onFocusOnly ? Ii(ho, e) : e, this.lastAnchor_ = null, this.startTime_ = void 0, this.timeoutId_, this.mode_ = void 0, this.trackpadEventGap_ = 400, this.trackpadTimeoutId_, this.deltaPerZoom_ = 300;
  }
  /**
   * @private
   */
  endInteraction_() {
    this.trackpadTimeoutId_ = void 0;
    const t = this.getMap();
    if (!t)
      return;
    t.getView().endInteraction(
      void 0,
      this.lastDelta_ ? this.lastDelta_ > 0 ? 1 : -1 : 0,
      this.lastAnchor_ ? t.getCoordinateFromPixel(this.lastAnchor_) : null
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
    if (!this.condition_(t) || t.type !== ve.WHEEL)
      return !0;
    const n = t.map, r = (
      /** @type {WheelEvent} */
      t.originalEvent
    );
    r.preventDefault(), this.useAnchor_ && (this.lastAnchor_ = t.pixel);
    let A = r.deltaY;
    switch (r.deltaMode) {
      case WheelEvent.DOM_DELTA_LINE:
        A *= $C;
        break;
      case WheelEvent.DOM_DELTA_PAGE:
        A *= tc;
        break;
    }
    if (A === 0)
      return !1;
    this.lastDelta_ = A;
    const s = Date.now();
    this.startTime_ === void 0 && (this.startTime_ = s), (!this.mode_ || s - this.startTime_ > this.trackpadEventGap_) && (this.mode_ = Math.abs(A) < 4 ? "trackpad" : "wheel");
    const o = n.getView();
    if (this.mode_ === "trackpad" && !(o.getConstrainResolution() || this.constrainResolution_))
      return this.trackpadTimeoutId_ ? clearTimeout(this.trackpadTimeoutId_) : (o.getAnimating() && o.cancelAnimations(), o.beginInteraction()), this.trackpadTimeoutId_ = setTimeout(
        this.endInteraction_.bind(this),
        this.timeout_
      ), o.adjustZoom(
        -A / this.deltaPerZoom_,
        this.lastAnchor_ ? n.getCoordinateFromPixel(this.lastAnchor_) : null
      ), this.startTime_ = s, !1;
    this.totalDelta_ += A;
    const g = Math.max(this.timeout_ - (s - this.startTime_), 0);
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
    let n = -Wt(
      this.totalDelta_,
      -this.maxDelta_ * this.deltaPerZoom_,
      this.maxDelta_ * this.deltaPerZoom_
    ) / this.deltaPerZoom_;
    (e.getConstrainResolution() || this.constrainResolution_) && (n = n ? n > 0 ? 1 : -1 : 0), Ti(
      e,
      n,
      this.lastAnchor_ ? t.getCoordinateFromPixel(this.lastAnchor_) : null,
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
class nc extends sn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = br), super(e), this.anchor_ = null, this.lastAngle_ = void 0, this.rotating_ = !1, this.rotationDelta_ = 0, this.threshold_ = t.threshold !== void 0 ? t.threshold : 0.3, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    let e = 0;
    const n = this.targetPointers[0], r = this.targetPointers[1], A = Math.atan2(
      r.clientY - n.clientY,
      r.clientX - n.clientX
    );
    if (this.lastAngle_ !== void 0) {
      const g = A - this.lastAngle_;
      this.rotationDelta_ += g, !this.rotating_ && Math.abs(this.rotationDelta_) > this.threshold_ && (this.rotating_ = !0), e = g;
    }
    this.lastAngle_ = A;
    const s = t.map, o = s.getView();
    o.getConstraints().rotation !== Di && (this.anchor_ = s.getCoordinateFromPixelInternal(
      s.getEventPixel(ji(this.targetPointers))
    ), this.rotating_ && (s.render(), o.adjustRotationInternal(e, this.anchor_)));
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
class rc extends sn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = br), super(e), this.anchor_ = null, this.duration_ = t.duration !== void 0 ? t.duration : 400, this.lastDistance_ = void 0, this.lastScaleDelta_ = 1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    let e = 1;
    const n = this.targetPointers[0], r = this.targetPointers[1], A = n.clientX - r.clientX, s = n.clientY - r.clientY, o = Math.sqrt(A * A + s * s);
    this.lastDistance_ !== void 0 && (e = this.lastDistance_ / o), this.lastDistance_ = o;
    const g = t.map, a = g.getView();
    e != 1 && (this.lastScaleDelta_ = e), this.anchor_ = g.getCoordinateFromPixelInternal(
      g.getEventPixel(ji(this.targetPointers))
    ), g.render(), a.adjustResolutionInternal(e, this.anchor_);
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
class ic {
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
    const A = this.points_[e] - this.points_[n], s = this.points_[e + 1] - this.points_[n + 1];
    return this.angle_ = Math.atan2(s, A), this.initialVelocity_ = Math.sqrt(A * A + s * s) / r, this.initialVelocity_ > this.minVelocity_;
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
function As(i) {
  i = i || {};
  const t = new JC(), e = new ic(-5e-3, 0.05, 100);
  return (i.altShiftDragRotate !== void 0 ? i.altShiftDragRotate : !0) && t.push(new VC()), (i.doubleClickZoom !== void 0 ? i.doubleClickZoom : !0) && t.push(
    new LC({
      delta: i.zoomDelta,
      duration: i.zoomDuration
    })
  ), (i.dragPan !== void 0 ? i.dragPan : !0) && t.push(
    new WC({
      onFocusOnly: i.onFocusOnly,
      kinetic: e
    })
  ), (i.pinchRotate !== void 0 ? i.pinchRotate : !0) && t.push(new nc()), (i.pinchZoom !== void 0 ? i.pinchZoom : !0) && t.push(
    new rc({
      duration: i.zoomDuration
    })
  ), (i.keyboard !== void 0 ? i.keyboard : !0) && (t.push(new qC()), t.push(
    new _C({
      delta: i.zoomDelta,
      duration: i.zoomDuration
    })
  )), (i.mouseWheelZoom !== void 0 ? i.mouseWheelZoom : !0) && t.push(
    new ec({
      onFocusOnly: i.onFocusOnly,
      duration: i.zoomDuration
    })
  ), (i.shiftDragZoom !== void 0 ? i.shiftDragZoom : !0) && t.push(
    new KC({
      duration: i.zoomDuration
    })
  ), t;
}
function Ac(i) {
  return sc(i[0], i[1], i[2]);
}
function sc(i, t, e) {
  return (t << i) + e;
}
const oc = /\{z\}/g, gc = /\{x\}/g, ac = /\{y\}/g, Ic = /\{-y\}/g;
function Cc(i, t, e, n, r) {
  return i.replace(oc, t.toString()).replace(gc, e.toString()).replace(ac, n.toString()).replace(Ic, function() {
    throw new Error(
      "If the URL template has a {-y} placeholder, the grid extent must be known"
    );
  });
}
function cc(i, t) {
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
      const A = e[0];
      return Cc(i, A, e[1], e[2]);
    })
  );
}
function ss(i, t) {
  const e = i.length, n = new Array(e);
  for (let r = 0; r < e; ++r)
    n[r] = cc(i[r]);
  return lc(n);
}
function lc(i) {
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
      const r = Ac(t), A = ii(r, i.length);
      return i[A](t, e, n);
    })
  );
}
for (let i = 0; i < 9; i++) {
  const t = `ZOOM:${i}`, e = 256 * Math.pow(2, i);
  (function(n, r) {
    const A = new ag({
      code: n,
      // The extent is used to determine zoom level 0. Recommended values for a
      // projection's validity extent can be found at https://epsg.io/.
      extent: [0, 0, r, r],
      units: "m"
    });
    qr(A), Ir(
      "EPSG:3857",
      A,
      (s) => {
        const o = (s[0] + ht) * r / (2 * ht), g = (-s[1] + ht) * r / (2 * ht);
        return [o, g];
      },
      (s) => {
        const o = s[0] * (2 * ht) / r - ht, g = -1 * (s[1] * (2 * ht) / r - ht);
        return [o, g];
      }
    );
  })(t, e);
}
class vo extends Na(ys) {
  constructor(t = {}) {
    t = Gs(t), t.wrapX = !1;
    const e = Math.log2(t.width / Se), n = Math.log2(t.height / Se);
    t.maxZoom = Math.ceil(Math.max(e, n)), t.tileUrlFunction = t.tileUrlFunction || function(r) {
      const A = r[0], s = r[1], o = r[2];
      return (
        // @ts-ignore
        s * Se * Math.pow(2, this.maxZoom - A) >= this.width || // @ts-ignore
        o * Se * Math.pow(2, this.maxZoom - A) >= this.height || s < 0 || o < 0 ? Ss : this._tileUrlFunction(r)
      );
    }, super(t), t.mapID && (this.mapID = t.mapID), t.urls ? this._tileUrlFunction = ss(t.urls) : t.url && (this._tileUrlFunction = ss(Array.isArray(t.url) ? t.url : [t.url])), this.width = t.width, this.height = t.height, this.maxZoom = t.maxZoom, this._maxxy = Math.pow(2, this.maxZoom) * Se, this.initialize(t);
  }
}
class Dn extends rn {
  constructor(t = {}) {
    super(Object.assign(t, { opaque: !1 }));
  }
}
M(Dn, "isBasemap_", !1);
const ge = "https://weiwudi.example.com/api/";
let Qr, Ve;
class uc {
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
    for (let r = 0, A = n.length; r < A; r++)
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
class ae extends uc {
  static async registerSW(t, e) {
    if ("serviceWorker" in navigator)
      try {
        const n = await navigator.serviceWorker.register(t, e), r = n.installing, A = n.waiting;
        return r && (r.state === "activated" && !A && window.location.reload(), r.addEventListener("statechange", (s) => {
          r.state === "activated" && !A && window.location.reload();
        })), n.onupdatefound = () => {
          n.update();
        }, await ae.swCheck(), n;
      } catch (n) {
        throw `Error: Service worker registration failed with ${n}`;
      }
    else
      throw "Error: Service worker is not supported";
  }
  static async swCheck() {
    return Ve !== void 0 ? Ve : (Qr === void 0 && (Qr = new Promise((t, e) => {
      fetch(`${ge}ping`).then((n) => {
        Ve = !!n, t(Ve);
      }).catch((n) => {
        Ve = !1, t(Ve);
      });
    })), Qr);
  }
  static async registerMap(t, e) {
    if (!await ae.swCheck()) throw "Weiwudi service worker is not implemented.";
    let n;
    const r = ["type", "url", "width", "height", "tileSize", "minZoom", "maxZoom", "maxLng", "maxLat", "minLng", "minLat"].reduce((s, o) => (typeof e[o] < "u" && (e[o] instanceof Array ? e[o].map((g) => {
      s.append(o, g);
    }) : s.append(o, String(e[o]))), s), new URLSearchParams());
    r.append("mapID", t);
    const A = new URL(`${ge}add`);
    if (A.search = r.toString(), n = await (await fetch(A.href)).text(), n.match(/^Error: /))
      throw n;
    return new ae(t, JSON.parse(n));
  }
  static async retrieveMap(t) {
    if (!await ae.swCheck()) throw "Weiwudi service worker is not implemented.";
    let e;
    if (e = await (await fetch(`${ge}info?mapID=${t}`)).text(), e.match(/^Error: /))
      throw e;
    return console.log(e), new ae(t, JSON.parse(e));
  }
  static async removeMap(t) {
    if (!await ae.swCheck()) throw "Weiwudi service worker is not implemented.";
    let e;
    if (e = await (await fetch(`${ge}delete?mapID=${t}`)).text(), e.match(/^Error: /))
      throw e;
  }
  constructor(t, e) {
    if (super(), !t) throw "MapID is necessary.";
    this.mapID = t, e && Object.assign(this, e), this.url = `${ge}cache/${t}/{z}/{x}/{y}`, this.listener = (n) => {
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
    if (this.checkAspect(), t = await (await fetch(`${ge}stats?mapID=${this.mapID}`)).text(), typeof t == "string" && t.match(/^Error: /))
      throw t;
    return JSON.parse(t);
  }
  async clean() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${ge}clean?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
  async fetchAll() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${ge}fetchAll?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
  async remove() {
    this.checkAspect(), this.mapID && await ae.removeMap(this.mapID), this.release();
  }
  async cancel() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${ge}cancel?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
}
function Ar(i, t, e) {
  const n = typeof i == "string" ? i : i.getCode(), r = typeof t == "string" ? t : t.getCode();
  let A = Lr(i, t);
  if (A == kr && n != r) {
    const s = Lr(i, "EPSG:3857"), o = Lr("EPSG:3857", t);
    if (s == kr && n != "EPSG:3857")
      throw "Transform of Source projection is not defined.";
    if (o == kr && r != "EPSG:3857")
      throw "Transform of Distination projection is not defined.";
    A = function(a) {
      return Xt(Xt(a, i, "EPSG:3857"), "EPSG:3857", t);
    }, Ir(i, t, A, function(a) {
      return Xt(Xt(a, t, "EPSG:3857"), "EPSG:3857", i);
    });
  }
  if (e)
    return A(e);
}
var un = { exports: {} }, hc = un.exports, os;
function fc() {
  return os || (os = 1, (function(i, t) {
    (function(e, n) {
      n(t);
    })(hc, (function(e) {
      var n = Object.defineProperty, r = (d, y, P) => y in d ? n(d, y, { enumerable: !0, configurable: !0, writable: !0, value: P }) : d[y] = P, A = (d, y, P) => r(d, typeof y != "symbol" ? y + "" : y, P);
      function s(d, y, P = {}) {
        const R = { type: "Feature" };
        return (P.id === 0 || P.id) && (R.id = P.id), P.bbox && (R.bbox = P.bbox), R.properties = y || {}, R.geometry = d, R;
      }
      function o(d, y, P = {}) {
        if (!d) throw new Error("coordinates is required");
        if (!Array.isArray(d)) throw new Error("coordinates must be an Array");
        if (d.length < 2) throw new Error("coordinates must be at least 2 numbers long");
        if (!I(d[0]) || !I(d[1])) throw new Error("coordinates must contain numbers");
        return s({ type: "Point", coordinates: d }, y, P);
      }
      function g(d, y, P = {}) {
        for (const R of d) {
          if (R.length < 4) throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
          if (R[R.length - 1].length !== R[0].length) throw new Error("First and last Position are not equivalent.");
          for (let G = 0; G < R[R.length - 1].length; G++) if (R[R.length - 1][G] !== R[0][G]) throw new Error("First and last Position are not equivalent.");
        }
        return s({ type: "Polygon", coordinates: d }, y, P);
      }
      function a(d, y = {}) {
        const P = { type: "FeatureCollection" };
        return y.id && (P.id = y.id), y.bbox && (P.bbox = y.bbox), P.features = d, P;
      }
      function I(d) {
        return !isNaN(d) && d !== null && !Array.isArray(d);
      }
      function C(d) {
        if (!d) throw new Error("coord is required");
        if (!Array.isArray(d)) {
          if (d.type === "Feature" && d.geometry !== null && d.geometry.type === "Point") return [...d.geometry.coordinates];
          if (d.type === "Point") return [...d.coordinates];
        }
        if (Array.isArray(d) && d.length >= 2 && !Array.isArray(d[0]) && !Array.isArray(d[1])) return [...d];
        throw new Error("coord must be GeoJSON Point or an Array of numbers");
      }
      function c(d) {
        if (Array.isArray(d)) return d;
        if (d.type === "Feature") {
          if (d.geometry !== null) return d.geometry.coordinates;
        } else if (d.coordinates) return d.coordinates;
        throw new Error("coords must be GeoJSON Feature, Geometry Object or an Array");
      }
      function l(d) {
        return d.type === "Feature" ? d.geometry : d;
      }
      const h = 11102230246251565e-32, u = 134217729, m = (3 + 8 * h) * h;
      function p(d, y, P, R, G) {
        let O, k, Z, j, F = y[0], H = R[0], B = 0, N = 0;
        H > F == H > -F ? (O = F, F = y[++B]) : (O = H, H = R[++N]);
        let Q = 0;
        if (B < d && N < P) for (H > F == H > -F ? (k = F + O, Z = O - (k - F), F = y[++B]) : (k = H + O, Z = O - (k - H), H = R[++N]), O = k, Z !== 0 && (G[Q++] = Z); B < d && N < P; ) H > F == H > -F ? (k = O + F, j = k - O, Z = O - (k - j) + (F - j), F = y[++B]) : (k = O + H, j = k - O, Z = O - (k - j) + (H - j), H = R[++N]), O = k, Z !== 0 && (G[Q++] = Z);
        for (; B < d; ) k = O + F, j = k - O, Z = O - (k - j) + (F - j), F = y[++B], O = k, Z !== 0 && (G[Q++] = Z);
        for (; N < P; ) k = O + H, j = k - O, Z = O - (k - j) + (H - j), H = R[++N], O = k, Z !== 0 && (G[Q++] = Z);
        return (O !== 0 || Q === 0) && (G[Q++] = O), Q;
      }
      function v(d, y) {
        let P = y[0];
        for (let R = 1; R < d; R++) P += y[R];
        return P;
      }
      function D(d) {
        return new Float64Array(d);
      }
      const T = (3 + 16 * h) * h, U = (2 + 12 * h) * h, W = (9 + 64 * h) * h * h, q = D(4), et = D(8), nt = D(12), at = D(16), J = D(4);
      function rt(d, y, P, R, G, O, k) {
        let Z, j, F, H, B, N, Q, $, X, L, x, V, st, gt, ct, tt, Ct, mt;
        const Tt = d - G, Gt = P - G, jt = y - O, bt = R - O;
        gt = Tt * bt, N = u * Tt, Q = N - (N - Tt), $ = Tt - Q, N = u * bt, X = N - (N - bt), L = bt - X, ct = $ * L - (gt - Q * X - $ * X - Q * L), tt = jt * Gt, N = u * jt, Q = N - (N - jt), $ = jt - Q, N = u * Gt, X = N - (N - Gt), L = Gt - X, Ct = $ * L - (tt - Q * X - $ * X - Q * L), x = ct - Ct, B = ct - x, q[0] = ct - (x + B) + (B - Ct), V = gt + x, B = V - gt, st = gt - (V - B) + (x - B), x = st - tt, B = st - x, q[1] = st - (x + B) + (B - tt), mt = V + x, B = mt - V, q[2] = V - (mt - B) + (x - B), q[3] = mt;
        let Yt = v(4, q), Pe = U * k;
        if (Yt >= Pe || -Yt >= Pe || (B = d - Tt, Z = d - (Tt + B) + (B - G), B = P - Gt, F = P - (Gt + B) + (B - G), B = y - jt, j = y - (jt + B) + (B - O), B = R - bt, H = R - (bt + B) + (B - O), Z === 0 && j === 0 && F === 0 && H === 0) || (Pe = W * k + m * Math.abs(Yt), Yt += Tt * H + bt * Z - (jt * F + Gt * j), Yt >= Pe || -Yt >= Pe)) return Yt;
        gt = Z * bt, N = u * Z, Q = N - (N - Z), $ = Z - Q, N = u * bt, X = N - (N - bt), L = bt - X, ct = $ * L - (gt - Q * X - $ * X - Q * L), tt = j * Gt, N = u * j, Q = N - (N - j), $ = j - Q, N = u * Gt, X = N - (N - Gt), L = Gt - X, Ct = $ * L - (tt - Q * X - $ * X - Q * L), x = ct - Ct, B = ct - x, J[0] = ct - (x + B) + (B - Ct), V = gt + x, B = V - gt, st = gt - (V - B) + (x - B), x = st - tt, B = st - x, J[1] = st - (x + B) + (B - tt), mt = V + x, B = mt - V, J[2] = V - (mt - B) + (x - B), J[3] = mt;
        const Sr = p(4, q, 4, J, et);
        gt = Tt * H, N = u * Tt, Q = N - (N - Tt), $ = Tt - Q, N = u * H, X = N - (N - H), L = H - X, ct = $ * L - (gt - Q * X - $ * X - Q * L), tt = jt * F, N = u * jt, Q = N - (N - jt), $ = jt - Q, N = u * F, X = N - (N - F), L = F - X, Ct = $ * L - (tt - Q * X - $ * X - Q * L), x = ct - Ct, B = ct - x, J[0] = ct - (x + B) + (B - Ct), V = gt + x, B = V - gt, st = gt - (V - B) + (x - B), x = st - tt, B = st - x, J[1] = st - (x + B) + (B - tt), mt = V + x, B = mt - V, J[2] = V - (mt - B) + (x - B), J[3] = mt;
        const Or = p(Sr, et, 4, J, nt);
        gt = Z * H, N = u * Z, Q = N - (N - Z), $ = Z - Q, N = u * H, X = N - (N - H), L = H - X, ct = $ * L - (gt - Q * X - $ * X - Q * L), tt = j * F, N = u * j, Q = N - (N - j), $ = j - Q, N = u * F, X = N - (N - F), L = F - X, Ct = $ * L - (tt - Q * X - $ * X - Q * L), x = ct - Ct, B = ct - x, J[0] = ct - (x + B) + (B - Ct), V = gt + x, B = V - gt, st = gt - (V - B) + (x - B), x = st - tt, B = st - x, J[1] = st - (x + B) + (B - tt), mt = V + x, B = mt - V, J[2] = V - (mt - B) + (x - B), J[3] = mt;
        const Dr = p(Or, nt, 4, J, at);
        return at[Dr - 1];
      }
      function dt(d, y, P, R, G, O) {
        const k = (y - O) * (P - G), Z = (d - G) * (R - O), j = k - Z, F = Math.abs(k + Z);
        return Math.abs(j) >= T * F ? j : -rt(d, y, P, R, G, O, F);
      }
      function ut(d, y) {
        var P, R, G = 0, O, k, Z, j, F, H, B, N = d[0], Q = d[1], $ = y.length;
        for (P = 0; P < $; P++) {
          R = 0;
          var X = y[P], L = X.length - 1;
          if (H = X[0], H[0] !== X[L][0] && H[1] !== X[L][1]) throw new Error("First and last coordinates in a ring must be the same");
          for (k = H[0] - N, Z = H[1] - Q, R; R < L; R++) {
            if (B = X[R + 1], j = B[0] - N, F = B[1] - Q, Z === 0 && F === 0) {
              if (j <= 0 && k >= 0 || k <= 0 && j >= 0) return 0;
            } else if (F >= 0 && Z <= 0 || F <= 0 && Z >= 0) {
              if (O = dt(k, j, Z, F, 0, 0), O === 0) return 0;
              (O > 0 && F > 0 && Z <= 0 || O < 0 && F <= 0 && Z > 0) && G++;
            }
            H = B, Z = F, k = j;
          }
        }
        return G % 2 !== 0;
      }
      function b(d, y, P = {}) {
        if (!d) throw new Error("point is required");
        if (!y) throw new Error("polygon is required");
        const R = C(d), G = l(y), O = G.type, k = y.bbox;
        let Z = G.coordinates;
        if (k && w(R, k) === !1) return !1;
        O === "Polygon" && (Z = [Z]);
        let j = !1;
        for (var F = 0; F < Z.length; ++F) {
          const H = ut(R, Z[F]);
          if (H === 0) return !P.ignoreBoundary;
          H && (j = !0);
        }
        return j;
      }
      function w(d, y) {
        return y[0] <= d[0] && y[1] <= d[1] && y[2] >= d[0] && y[3] >= d[1];
      }
      function z(d, y) {
        for (let P = 0; P < y.features.length; P++) if (b(d, y.features[P])) return y.features[P];
      }
      function _(d, y, P) {
        const R = y.geometry.coordinates[0][0], G = y.geometry.coordinates[0][1], O = y.geometry.coordinates[0][2], k = d.geometry.coordinates, Z = y.properties.a.geom, j = y.properties.b.geom, F = y.properties.c.geom, H = [G[0] - R[0], G[1] - R[1]], B = [O[0] - R[0], O[1] - R[1]], N = [k[0] - R[0], k[1] - R[1]], Q = [j[0] - Z[0], j[1] - Z[1]], $ = [F[0] - Z[0], F[1] - Z[1]];
        let X = (B[1] * N[0] - B[0] * N[1]) / (H[0] * B[1] - H[1] * B[0]), L = (H[0] * N[1] - H[1] * N[0]) / (H[0] * B[1] - H[1] * B[0]);
        if (P) {
          const x = P[y.properties.a.index], V = P[y.properties.b.index], st = P[y.properties.c.index];
          let gt;
          if (X < 0 || L < 0 || 1 - X - L < 0) {
            const ct = X / (X + L), tt = L / (X + L);
            gt = X / V / (ct / V + tt / st), L = L / st / (ct / V + tt / st);
          } else gt = X / V / (X / V + L / st + (1 - X - L) / x), L = L / st / (X / V + L / st + (1 - X - L) / x);
          X = gt;
        }
        return [X * Q[0] + L * $[0] + Z[0], X * Q[1] + L * $[1] + Z[1]];
      }
      function it(d, y, P, R) {
        const G = d.geometry.coordinates, O = P.geometry.coordinates, k = Math.atan2(G[0] - O[0], G[1] - O[1]), Z = we(k, y[0]);
        if (Z === void 0) throw new Error("Unable to determine vertex index");
        const j = y[1][Z];
        return _(d, j.features[0], R);
      }
      function Y(d, y, P, R, G, O, k, Z) {
        let j;
        if (k && (j = z(d, a([k]))), !j) {
          if (P) {
            const F = d.geometry.coordinates, H = P.gridNum, B = P.xOrigin, N = P.yOrigin, Q = P.xUnit, $ = P.yUnit, X = P.gridCache, L = lt(F[0], B, Q, H), x = lt(F[1], N, $, H), V = X[L] ? X[L][x] ? X[L][x] : [] : [];
            y = a(V.map((st) => y.features[st]));
          }
          j = z(d, y);
        }
        return Z && Z(j), j ? _(d, j, O) : it(d, R, G, O);
      }
      function lt(d, y, P, R) {
        let G = Math.floor((d - y) / P);
        return G >= R && (G = R - 1), G;
      }
      function we(d, y) {
        let P = pt(d - y[0]), R = Math.PI * 2, G;
        for (let O = 0; O < y.length; O++) {
          const k = (O + 1) % y.length, Z = pt(d - y[k]), j = Math.min(Math.abs(P), Math.abs(Z));
          P * Z <= 0 && j < R && (R = j, G = O), P = Z;
        }
        return G;
      }
      function pt(d, y = !1) {
        const P = y ? function(R) {
          return !(R >= 0 && R < Math.PI * 2);
        } : function(R) {
          return !(R > -1 * Math.PI && R <= Math.PI);
        };
        for (; P(d); ) d = d + 2 * Math.PI * (d > 0 ? -1 : 1);
        return d;
      }
      function xt(d, y) {
        return y && y >= 2.00703 || Array.isArray(d[0]) ? d : d.map((P) => [P.illstNodes, P.mercNodes, P.startEnd]);
      }
      function Ge(d) {
        const y = d.features;
        for (let P = 0; P < y.length; P++) {
          const R = y[P];
          `${R.properties.a.index}`.substring(0, 1) === "b" && `${R.properties.b.index}`.substring(0, 1) === "b" ? y[P] = { geometry: { type: "Polygon", coordinates: [[R.geometry.coordinates[0][2], R.geometry.coordinates[0][0], R.geometry.coordinates[0][1], R.geometry.coordinates[0][2]]] }, properties: { a: { geom: R.properties.c.geom, index: R.properties.c.index }, b: { geom: R.properties.a.geom, index: R.properties.a.index }, c: { geom: R.properties.b.geom, index: R.properties.b.index } }, type: "Feature" } : `${R.properties.c.index}`.substring(0, 1) === "b" && `${R.properties.a.index}`.substring(0, 1) === "b" && (y[P] = { geometry: { type: "Polygon", coordinates: [[R.geometry.coordinates[0][1], R.geometry.coordinates[0][2], R.geometry.coordinates[0][0], R.geometry.coordinates[0][1]]] }, properties: { a: { geom: R.properties.b.geom, index: R.properties.b.index }, b: { geom: R.properties.c.geom, index: R.properties.c.index }, c: { geom: R.properties.a.geom, index: R.properties.a.index } }, type: "Feature" });
        }
        return d;
      }
      function Ae(d) {
        const y = ["a", "b", "c", "a"].map((O) => d.properties[O].geom), P = d.geometry.coordinates[0], R = d.properties, G = { a: { geom: P[0], index: R.a.index }, b: { geom: P[1], index: R.b.index }, c: { geom: P[2], index: R.c.index } };
        return g([y], G);
      }
      function ce(d) {
        const y = [0, 1, 2, 0].map((R) => d[R][0][0]), P = { a: { geom: d[0][0][1], index: d[0][1] }, b: { geom: d[1][0][1], index: d[1][1] }, c: { geom: d[2][0][1], index: d[2][1] } };
        return g([y], P);
      }
      function se(d, y, P, R, G, O = !1, k) {
        const Z = d.map((j) => {
          (!k || k < 2.00703) && (j = Vt(j));
          const F = isFinite(j) ? y[j] : j === "c" ? R : j === "b0" ? G[0] : j === "b1" ? G[1] : j === "b2" ? G[2] : j === "b3" ? G[3] : (function() {
            const H = j.match(/e(\d+)/);
            if (H) {
              const B = parseInt(H[1]);
              return P[B];
            }
            throw "Bad index value for indexesToTri";
          })();
          return O ? [[F[1], F[0]], j] : [[F[0], F[1]], j];
        });
        return ce(Z);
      }
      function Vt(d) {
        return typeof d == "number" ? d : d.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
      }
      const oe = 2.00703;
      function At(d) {
        return !!(d.version || !d.tins && d.points && d.tins_points);
      }
      function Ee(d) {
        return { points: d.points, pointsWeightBuffer: Xe(d), strictStatus: gn(d), verticesParams: Gn(d), centroid: Xn(d), edges: xt(d.edges || []), edgeNodes: d.edgeNodes || [], tins: an(d), kinks: Zn(d.kinks_points), yaxisMode: d.yaxisMode ?? "invert", strictMode: d.strictMode ?? "auto", vertexMode: d.vertexMode, bounds: d.bounds, boundsPolygon: d.boundsPolygon, wh: d.wh, xy: d.bounds ? d.xy : [0, 0] };
      }
      function Me(d) {
        const y = Fn(d), P = y.tins;
        return { compiled: y, tins: P, points: Un(P), strictStatus: y.strict_status, pointsWeightBuffer: y.weight_buffer, verticesParams: y.vertices_params, centroid: y.centroid, kinks: y.kinks };
      }
      function Xe(d) {
        return !d.version || d.version < oe ? ["forw", "bakw"].reduce((y, P) => {
          const R = d.weight_buffer[P];
          return R && (y[P] = Object.keys(R).reduce((G, O) => {
            const k = Vt(O);
            return G[k] = R[O], G;
          }, {})), y;
        }, {}) : d.weight_buffer;
      }
      function gn(d) {
        return d.strict_status ? d.strict_status : d.kinks_points ? "strict_error" : d.tins_points.length === 2 ? "loose" : "strict";
      }
      function Gn(d) {
        const y = { forw: [d.vertices_params[0]], bakw: [d.vertices_params[1]] };
        return y.forw[1] = le(d, !1), y.bakw[1] = le(d, !0), y;
      }
      function le(d, y) {
        return [0, 1, 2, 3].map((P) => {
          const R = (P + 1) % 4, G = se(["c", `b${P}`, `b${R}`], d.points, d.edgeNodes || [], d.centroid_point, d.vertices_points, y, oe);
          return a([G]);
        });
      }
      function Xn(d) {
        return { forw: o(d.centroid_point[0], { target: { geom: d.centroid_point[1], index: "c" } }), bakw: o(d.centroid_point[1], { target: { geom: d.centroid_point[0], index: "c" } }) };
      }
      function an(d) {
        const y = d.tins_points.length === 1 ? 0 : 1;
        return { forw: a(d.tins_points[0].map((P) => se(P, d.points, d.edgeNodes || [], d.centroid_point, d.vertices_points, !1, d.version))), bakw: a(d.tins_points[y].map((P) => se(P, d.points, d.edgeNodes || [], d.centroid_point, d.vertices_points, !0, d.version))) };
      }
      function Zn(d) {
        if (d) return { bakw: a(d.map((y) => o(y))) };
      }
      function Fn(d) {
        return JSON.parse(JSON.stringify(d).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"'));
      }
      function Un(d) {
        const y = [], P = d.forw.features;
        for (let R = 0; R < P.length; R++) {
          const G = P[R];
          ["a", "b", "c"].map((O, k) => {
            const Z = G.geometry.coordinates[0][k], j = G.properties[O].geom, F = G.properties[O].index;
            typeof F == "number" && (y[F] = [Z, j]);
          });
        }
        return y;
      }
      const zn = oe, Nt = class qt {
        constructor() {
          A(this, "points", []), A(this, "pointsWeightBuffer"), A(this, "strict_status"), A(this, "vertices_params"), A(this, "centroid"), A(this, "edgeNodes"), A(this, "edges"), A(this, "tins"), A(this, "kinks"), A(this, "yaxisMode", qt.YAXIS_INVERT), A(this, "strictMode", qt.MODE_AUTO), A(this, "vertexMode", qt.VERTEX_PLAIN), A(this, "bounds"), A(this, "boundsPolygon"), A(this, "wh"), A(this, "xy"), A(this, "indexedTins"), A(this, "stateFull", !1), A(this, "stateTriangle"), A(this, "stateBackward"), A(this, "priority"), A(this, "importance"), A(this, "xyBounds"), A(this, "mercBounds");
        }
        setCompiled(y) {
          if (At(y)) {
            this.applyModernState(Ee(y));
            return;
          }
          this.applyLegacyState(Me(y));
        }
        applyModernState(y) {
          this.points = y.points, this.pointsWeightBuffer = y.pointsWeightBuffer, this.strict_status = y.strictStatus, this.vertices_params = y.verticesParams, this.centroid = y.centroid, this.edges = y.edges, this.edgeNodes = y.edgeNodes || [], this.tins = y.tins, this.addIndexedTin(), this.kinks = y.kinks, this.yaxisMode = y.yaxisMode ?? qt.YAXIS_INVERT, this.vertexMode = y.vertexMode ?? qt.VERTEX_PLAIN, this.strictMode = y.strictMode ?? qt.MODE_AUTO, y.bounds ? (this.bounds = y.bounds, this.boundsPolygon = y.boundsPolygon, this.xy = y.xy, this.wh = y.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = y.xy ?? [0, 0], y.wh && (this.wh = y.wh));
        }
        applyLegacyState(y) {
          this.tins = y.tins, this.addIndexedTin(), this.strict_status = y.strictStatus, this.pointsWeightBuffer = y.pointsWeightBuffer, this.vertices_params = y.verticesParams, this.centroid = y.centroid, this.kinks = y.kinks, this.points = y.points;
        }
        addIndexedTin() {
          const y = this.tins, P = y.forw, R = y.bakw, G = Math.ceil(Math.sqrt(P.features.length));
          if (G < 3) {
            this.indexedTins = void 0;
            return;
          }
          let O = [], k = [];
          const Z = P.features.map((X) => {
            let L = [];
            return c(X)[0].map((x) => {
              O.length === 0 ? O = [Array.from(x), Array.from(x)] : (x[0] < O[0][0] && (O[0][0] = x[0]), x[0] > O[1][0] && (O[1][0] = x[0]), x[1] < O[0][1] && (O[0][1] = x[1]), x[1] > O[1][1] && (O[1][1] = x[1])), L.length === 0 ? L = [Array.from(x), Array.from(x)] : (x[0] < L[0][0] && (L[0][0] = x[0]), x[0] > L[1][0] && (L[1][0] = x[0]), x[1] < L[0][1] && (L[0][1] = x[1]), x[1] > L[1][1] && (L[1][1] = x[1]));
            }), L;
          }), j = (O[1][0] - O[0][0]) / G, F = (O[1][1] - O[0][1]) / G, H = Z.reduce((X, L, x) => {
            const V = lt(L[0][0], O[0][0], j, G), st = lt(L[1][0], O[0][0], j, G), gt = lt(L[0][1], O[0][1], F, G), ct = lt(L[1][1], O[0][1], F, G);
            for (let tt = V; tt <= st; tt++) {
              X[tt] || (X[tt] = []);
              for (let Ct = gt; Ct <= ct; Ct++) X[tt][Ct] || (X[tt][Ct] = []), X[tt][Ct].push(x);
            }
            return X;
          }, []), B = R.features.map((X) => {
            let L = [];
            return c(X)[0].map((x) => {
              k.length === 0 ? k = [Array.from(x), Array.from(x)] : (x[0] < k[0][0] && (k[0][0] = x[0]), x[0] > k[1][0] && (k[1][0] = x[0]), x[1] < k[0][1] && (k[0][1] = x[1]), x[1] > k[1][1] && (k[1][1] = x[1])), L.length === 0 ? L = [Array.from(x), Array.from(x)] : (x[0] < L[0][0] && (L[0][0] = x[0]), x[0] > L[1][0] && (L[1][0] = x[0]), x[1] < L[0][1] && (L[0][1] = x[1]), x[1] > L[1][1] && (L[1][1] = x[1]));
            }), L;
          }), N = (k[1][0] - k[0][0]) / G, Q = (k[1][1] - k[0][1]) / G, $ = B.reduce((X, L, x) => {
            const V = lt(L[0][0], k[0][0], N, G), st = lt(L[1][0], k[0][0], N, G), gt = lt(L[0][1], k[0][1], Q, G), ct = lt(L[1][1], k[0][1], Q, G);
            for (let tt = V; tt <= st; tt++) {
              X[tt] || (X[tt] = []);
              for (let Ct = gt; Ct <= ct; Ct++) X[tt][Ct] || (X[tt][Ct] = []), X[tt][Ct].push(x);
            }
            return X;
          }, []);
          this.indexedTins = { forw: { gridNum: G, xOrigin: O[0][0], yOrigin: O[0][1], xUnit: j, yUnit: F, gridCache: H }, bakw: { gridNum: G, xOrigin: k[0][0], yOrigin: k[0][1], xUnit: N, yUnit: Q, gridCache: $ } };
        }
        transform(y, P, R) {
          if (P && this.strict_status == qt.STATUS_ERROR) throw 'Backward transform is not allowed if strict_status == "strict_error"';
          this.yaxisMode == qt.YAXIS_FOLLOW && P && (y = [y[0], -1 * y[1]]);
          const G = o(y);
          if (this.bounds && !P && !R && !b(G, this.boundsPolygon)) return !1;
          const O = P ? this.tins.bakw : this.tins.forw, k = P ? this.indexedTins.bakw : this.indexedTins.forw, Z = P ? this.vertices_params.bakw : this.vertices_params.forw, j = P ? this.centroid.bakw : this.centroid.forw, F = P ? this.pointsWeightBuffer.bakw : this.pointsWeightBuffer.forw;
          let H, B;
          this.stateFull && (this.stateBackward == P ? H = this.stateTriangle : (this.stateBackward = P, this.stateTriangle = void 0), B = (Q) => {
            this.stateTriangle = Q;
          });
          let N = Y(G, O, k, Z, j, F, H, B);
          if (this.bounds && P && !R) {
            const Q = o(N);
            if (!b(Q, this.boundsPolygon)) return !1;
          } else this.yaxisMode == qt.YAXIS_FOLLOW && !P && (N = [N[0], -1 * N[1]]);
          return N;
        }
      };
      A(Nt, "VERTEX_PLAIN", "plain"), A(Nt, "VERTEX_BIRDEYE", "birdeye"), A(Nt, "MODE_STRICT", "strict"), A(Nt, "MODE_AUTO", "auto"), A(Nt, "MODE_LOOSE", "loose"), A(Nt, "STATUS_STRICT", "strict"), A(Nt, "STATUS_ERROR", "strict_error"), A(Nt, "STATUS_LOOSE", "loose"), A(Nt, "YAXIS_FOLLOW", "follow"), A(Nt, "YAXIS_INVERT", "invert");
      let xr = Nt;
      e.Transform = xr, e.counterTri = Ae, e.format_version = zn, e.normalizeEdges = xt, e.rotateVerticesTriangle = Ge, e.transformArr = Y, Object.defineProperty(e, Symbol.toStringTag, { value: "Module" });
    }));
  })(un, un.exports)), un.exports;
}
var gs = fc();
const dc = [
  "title",
  "attr",
  "officialTitle",
  "dataAttr",
  "author",
  "createdAt",
  "era",
  "license",
  "dataLicense",
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
async function pc(i) {
  return mc(i, !1, !0);
}
async function mc(i, t, e) {
  var A, s;
  const n = e ? i : {}, r = [];
  if (dc.forEach((o) => {
    n[o] = i[o];
  }), (i.imageExtention || i.imageExtension) && (n.imageExtension = i.imageExtension || i.imageExtention), i.compiled) {
    let o = new gs.Transform();
    o.setCompiled(i.compiled), o.addIndexedTin();
    const g = o;
    n.strictMode = g.strictMode, n.vertexMode = g.vertexMode, n.yaxisMode = g.yaxisMode, n.width = (A = g.wh) == null ? void 0 : A[0], n.height = (s = g.wh) == null ? void 0 : s[1], n.gcps = g.points, n.edges = g.edges, r.push(o);
  } else {
    n.strictMode = i.strictMode, n.vertexMode = i.vertexMode, n.yaxisMode = i.yaxisMode, n.width = i.width, n.height = i.height, n.gcps = i.gcps, n.edges = i.edges;
    let o = await as(
      i.strictMode,
      i.vertexMode,
      i.yaxisMode,
      i.gcps,
      i.edges,
      [i.width, i.height]
    );
    r.push(o);
  }
  if (i.sub_maps) {
    const o = [];
    for (let g = 0; g < i.sub_maps.length; g++) {
      const a = i.sub_maps[g], I = {};
      if (I.importance = a.importance, I.priority = a.priority, a.compiled) {
        let C = new gs.Transform();
        C.setCompiled(a.compiled), C.addIndexedTin(), I.bounds = C.bounds, I.gcps = C.points, I.edges = C.edges, r.push(C);
      } else {
        I.bounds = a.bounds, I.gcps = a.gcps, I.edges = a.edges;
        let C = await as(
          i.strictMode,
          i.vertexMode,
          i.yaxisMode,
          a.gcps,
          a.edges,
          void 0,
          a.bounds
        );
        r.push(C);
      }
      o.push(I);
    }
    n.sub_maps = o;
  }
  return [n, r];
}
async function as(i, t, e, n = [], r = [], A, s) {
  return n.length < 3 ? "tooLessGcps" : (console.error("@maplat/transform requires pre-compiled data. Cannot create from GCPs."), console.error("Please use @maplat/editor or a separate tool to generate compiled data."), "compiledRequired");
}
class mr extends vo {
  constructor(e = {}) {
    super(e);
    M(this, "tins");
    this.tins = [];
  }
  static async createAsync(e) {
    const n = await pc(e);
    e = n[0];
    const r = new mr(e);
    r.tins = n[1];
    const A = new wn({
      code: `Illst:${r.mapID}`,
      extent: [0, 0, r.width, r.height],
      units: "m"
    });
    return qr(A), Ir(
      A,
      "EPSG:3857",
      (s) => r.tins[0].transform(s, !1),
      (s) => r.tins[0].transform(s, !0)
    ), Ar("EPSG:4326", A), e.sub_maps && e.sub_maps.map((s, o) => {
      const g = o + 1, a = `Illst:${r.mapID}#${g}`, I = r.tins[g], C = new wn({
        code: a,
        extent: [I.xy[0], I.xy[1], I.wh[0], I.wh[1]],
        units: "m"
      });
      qr(C), Ir(
        C,
        "EPSG:3857",
        (m) => I.transform(m, !1, !0),
        (m) => I.transform(m, !0, !0)
      ), Ar("EPSG:4326", C);
      const c = Object.assign([], s.bounds);
      c.push(s.bounds[0]);
      const l = c.map((m) => I.transform(m, !1)), h = gr([c]), u = gr([l]);
      I.xyBounds = h, I.mercBounds = u;
    }), r;
  }
  xy2MercAsync_specifyLayer(e, n) {
    const r = `Illst:${this.mapID}${n ? `#${n}` : ""}`;
    return new Promise((A, s) => {
      A(Ar(r, "EPSG:3857", e));
    });
  }
  merc2XyAsync_specifyLayer(e, n) {
    const r = `Illst:${this.mapID}${n ? `#${n}` : ""}`;
    return new Promise((A, s) => {
      A(Ar("EPSG:3857", r, e));
    });
  }
  xy2MercAsync_returnLayer(e) {
    return new Promise((n, r) => {
      const A = this.tins.map((s, o) => [o, s]).sort((s, o) => s[1].priority < o[1].priority ? 1 : -1);
      for (let s = 0; s < A.length; s++) {
        const o = A[s][0], g = A[s][1];
        if (o == 0 || ar(e, g.xyBounds)) {
          this.xy2MercAsync_specifyLayer(e, o).then((a) => {
            n([o, a]);
          }).catch((a) => {
            r(a);
          });
          break;
        }
      }
    });
  }
  merc2XyAsync_returnLayer(e) {
    return Promise.all(
      this.tins.map(
        (n, r) => new Promise((A, s) => {
          this.merc2XyAsync_specifyLayer(e, r).then((o) => {
            r === 0 || ar(o, n.xyBounds) ? A([n, r, o]) : A([n, r]);
          }).catch((o) => {
            s(o);
          });
        })
      )
    ).then(
      (n) => n.sort((r, A) => r[0].priority < A[0].priority ? 1 : -1).reduce(
        (r, A, s, o) => {
          const g = A[0], a = A[1], I = A[2];
          if (!I) return r;
          for (let C = 0; C < s; C++) {
            const c = o[C][0];
            if (o[C][1] === 0 || ar(I, c.xyBounds))
              if (r.length) {
                const h = !r[0], u = h ? r[1][2] : r[0][2];
                return !h || g.importance < u.importance ? r : [void 0, [a, I, g]];
              } else
                return [void 0, [a, I, g]];
          }
          return !r.length || !r[0] ? [[a, I, g]] : (r.push([a, I, g]), r.sort((C, c) => C[2].importance < c[2].importance ? 1 : -1).filter((C, c) => c < 2));
        },
        []
      ).map((r) => {
        if (r)
          return [r[0], r[1]];
      })
    );
  }
  setupMapParameter(e) {
    const n = [this.width / 2, this.height / 2];
    this.xy2MercAsync_returnLayer(n).then((r) => {
      const A = r[0], s = r[1], o = [
        [n[0] - 150, n[1]],
        [n[0] + 150, n[1]],
        [n[0], n[1] - 150],
        [n[0], n[1] + 150]
      ], g = [
        [0, 0],
        [this.width, 0],
        [this.width, this.height],
        [0, this.height]
      ], a = [];
      for (let I = 0; I < 9; I++) {
        const C = I < 4 ? this.xy2MercAsync_specifyLayer(o[I], A) : I == 4 ? Promise.resolve(s) : this.xy2MercAsync_specifyLayer(g[I - 5], 0);
        a.push(C);
      }
      Promise.all(a).then((I) => {
        const C = Math.sqrt(
          Math.pow(I[0][0] - I[1][0], 2) + Math.pow(I[0][1] - I[1][1], 2)
        ), c = Math.sqrt(
          Math.pow(I[2][0] - I[3][0], 2) + Math.pow(I[2][1] - I[3][1], 2)
        ), l = (C + c) / 2;
        this.mercZoom || (this.mercZoom = Math.log(300 * (2 * ht) / 256 / l) / Math.log(2) - 3), this.homePosition || (this.homePosition = ci(I[4])), this.envelope = gr([
          [I[5], I[6], I[7], I[8], I[5]]
        ]), e(this);
      }).catch((I) => {
        throw I;
      });
    }).catch((r) => {
      throw r;
    });
  }
  mercs2SysCoordsAsync_multiLayer(e) {
    return this.merc2XyAsync_returnLayer(e[0][0]).then(
      (r) => {
        let A = !1;
        return Promise.all(
          r.map((s, o) => {
            if (!s) {
              A = !0;
              return;
            }
            const g = s[0], a = s[1];
            return o !== 0 && !A ? Promise.resolve([a]) : Promise.all(
              e[0].map((I, C) => C === 0 ? Promise.resolve(a) : this.merc2XyAsync_specifyLayer(I, g))
            );
          })
        );
      }
    ).then(
      (r) => r.map((A) => {
        if (A)
          return [A.map((s) => this.xy2SysCoord(s)), e[1]];
      })
    );
  }
  // unifyTerm対応
  // https://github.com/code4history/MaplatCore/issues/19
  // 複数レイヤがある場合、ignoreBackside === trueであれば、先頭レイヤ以外は無視する(先頭レイヤ内でなければ変換しない)
  // ignoreBackside === falseであれば、先頭レイヤで変換できなければ他レイヤでの結果を返す
  merc2XyAsync_base(e, n) {
    return this.merc2XyAsync_returnLayer(e).then((r) => {
      if (!(n && !r[0]))
        return r[0] ? r[0][1] : r[1][1];
    });
  }
  merc2XyAsync_ignoreBackground(e) {
    return this.merc2XyAsync_base(e, !0);
  }
  merc2XyAsync(e) {
    return this.merc2XyAsync_base(e, !1);
  }
  xy2MercAsync(e) {
    return this.xy2MercAsync_returnLayer(e).then((n) => n[1]);
  }
  // 画面サイズと地図ズームから、メルカトル座標上での5座標を取得する。zoom, rotate無指定の場合は自動取得
  viewpoint2MercsAsync(e, n) {
    const r = this.viewpoint2SysCoords(e, n), A = this.sysCoords2Xys(r);
    return this.xy2MercAsync_returnLayer(A[0][0]).then((o) => {
      const g = o[0], a = o[1], I = A[0].map((C, c) => c === 0 ? Promise.resolve(a) : this.xy2MercAsync_specifyLayer(C, g));
      return Promise.all(I).then((C) => [C, n]);
    });
  }
  mercs2ViewpointAsync(e) {
    return this.merc2XyAsync_returnLayer(e[0][0]).then(
      (r) => {
        const A = r[0] || r[1], s = A[0], o = A[1];
        return Promise.all(
          e[0].map((g, a) => a === 0 ? o : this.merc2XyAsync_specifyLayer(g, s))
        );
      }
    ).then((r) => {
      const A = this.xys2SysCoords([r, e[1]]);
      return this.sysCoords2Viewpoint(A);
    });
  }
}
var Mt = typeof globalThis < "u" && globalThis || typeof self < "u" && self || // eslint-disable-next-line no-undef
typeof globalThis < "u" && globalThis || {}, Bt = {
  searchParams: "URLSearchParams" in Mt,
  iterable: "Symbol" in Mt && "iterator" in Symbol,
  blob: "FileReader" in Mt && "Blob" in Mt && (function() {
    try {
      return new Blob(), !0;
    } catch {
      return !1;
    }
  })(),
  formData: "FormData" in Mt,
  arrayBuffer: "ArrayBuffer" in Mt
};
function yc(i) {
  return i && DataView.prototype.isPrototypeOf(i);
}
if (Bt.arrayBuffer)
  var vc = [
    "[object Int8Array]",
    "[object Uint8Array]",
    "[object Uint8ClampedArray]",
    "[object Int16Array]",
    "[object Uint16Array]",
    "[object Int32Array]",
    "[object Uint32Array]",
    "[object Float32Array]",
    "[object Float64Array]"
  ], bc = ArrayBuffer.isView || function(i) {
    return i && vc.indexOf(Object.prototype.toString.call(i)) > -1;
  };
function on(i) {
  if (typeof i != "string" && (i = String(i)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(i) || i === "")
    throw new TypeError('Invalid character in header field name: "' + i + '"');
  return i.toLowerCase();
}
function Li(i) {
  return typeof i != "string" && (i = String(i)), i;
}
function ki(i) {
  var t = {
    next: function() {
      var e = i.shift();
      return { done: e === void 0, value: e };
    }
  };
  return Bt.iterable && (t[Symbol.iterator] = function() {
    return t;
  }), t;
}
function vt(i) {
  this.map = {}, i instanceof vt ? i.forEach(function(t, e) {
    this.append(e, t);
  }, this) : Array.isArray(i) ? i.forEach(function(t) {
    if (t.length != 2)
      throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + t.length);
    this.append(t[0], t[1]);
  }, this) : i && Object.getOwnPropertyNames(i).forEach(function(t) {
    this.append(t, i[t]);
  }, this);
}
vt.prototype.append = function(i, t) {
  i = on(i), t = Li(t);
  var e = this.map[i];
  this.map[i] = e ? e + ", " + t : t;
};
vt.prototype.delete = function(i) {
  delete this.map[on(i)];
};
vt.prototype.get = function(i) {
  return i = on(i), this.has(i) ? this.map[i] : null;
};
vt.prototype.has = function(i) {
  return this.map.hasOwnProperty(on(i));
};
vt.prototype.set = function(i, t) {
  this.map[on(i)] = Li(t);
};
vt.prototype.forEach = function(i, t) {
  for (var e in this.map)
    this.map.hasOwnProperty(e) && i.call(t, this.map[e], e, this);
};
vt.prototype.keys = function() {
  var i = [];
  return this.forEach(function(t, e) {
    i.push(e);
  }), ki(i);
};
vt.prototype.values = function() {
  var i = [];
  return this.forEach(function(t) {
    i.push(t);
  }), ki(i);
};
vt.prototype.entries = function() {
  var i = [];
  return this.forEach(function(t, e) {
    i.push([e, t]);
  }), ki(i);
};
Bt.iterable && (vt.prototype[Symbol.iterator] = vt.prototype.entries);
function Wr(i) {
  if (!i._noBody) {
    if (i.bodyUsed)
      return Promise.reject(new TypeError("Already read"));
    i.bodyUsed = !0;
  }
}
function bo(i) {
  return new Promise(function(t, e) {
    i.onload = function() {
      t(i.result);
    }, i.onerror = function() {
      e(i.error);
    };
  });
}
function wc(i) {
  var t = new FileReader(), e = bo(t);
  return t.readAsArrayBuffer(i), e;
}
function Ec(i) {
  var t = new FileReader(), e = bo(t), n = /charset=([A-Za-z0-9_-]+)/.exec(i.type), r = n ? n[1] : "utf-8";
  return t.readAsText(i, r), e;
}
function Mc(i) {
  for (var t = new Uint8Array(i), e = new Array(t.length), n = 0; n < t.length; n++)
    e[n] = String.fromCharCode(t[n]);
  return e.join("");
}
function Is(i) {
  if (i.slice)
    return i.slice(0);
  var t = new Uint8Array(i.byteLength);
  return t.set(new Uint8Array(i)), t.buffer;
}
function wo() {
  return this.bodyUsed = !1, this._initBody = function(i) {
    this.bodyUsed = this.bodyUsed, this._bodyInit = i, i ? typeof i == "string" ? this._bodyText = i : Bt.blob && Blob.prototype.isPrototypeOf(i) ? this._bodyBlob = i : Bt.formData && FormData.prototype.isPrototypeOf(i) ? this._bodyFormData = i : Bt.searchParams && URLSearchParams.prototype.isPrototypeOf(i) ? this._bodyText = i.toString() : Bt.arrayBuffer && Bt.blob && yc(i) ? (this._bodyArrayBuffer = Is(i.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : Bt.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(i) || bc(i)) ? this._bodyArrayBuffer = Is(i) : this._bodyText = i = Object.prototype.toString.call(i) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof i == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : Bt.searchParams && URLSearchParams.prototype.isPrototypeOf(i) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
  }, Bt.blob && (this.blob = function() {
    var i = Wr(this);
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
      var i = Wr(this);
      return i || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
        this._bodyArrayBuffer.buffer.slice(
          this._bodyArrayBuffer.byteOffset,
          this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
        )
      ) : Promise.resolve(this._bodyArrayBuffer));
    } else {
      if (Bt.blob)
        return this.blob().then(wc);
      throw new Error("could not read as ArrayBuffer");
    }
  }, this.text = function() {
    var i = Wr(this);
    if (i)
      return i;
    if (this._bodyBlob)
      return Ec(this._bodyBlob);
    if (this._bodyArrayBuffer)
      return Promise.resolve(Mc(this._bodyArrayBuffer));
    if (this._bodyFormData)
      throw new Error("could not read FormData body as text");
    return Promise.resolve(this._bodyText);
  }, Bt.formData && (this.formData = function() {
    return this.text().then(xc);
  }), this.json = function() {
    return this.text().then(JSON.parse);
  }, this;
}
var Pc = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
function Rc(i) {
  var t = i.toUpperCase();
  return Pc.indexOf(t) > -1 ? t : i;
}
function Ne(i, t) {
  if (!(this instanceof Ne))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  t = t || {};
  var e = t.body;
  if (i instanceof Ne) {
    if (i.bodyUsed)
      throw new TypeError("Already read");
    this.url = i.url, this.credentials = i.credentials, t.headers || (this.headers = new vt(i.headers)), this.method = i.method, this.mode = i.mode, this.signal = i.signal, !e && i._bodyInit != null && (e = i._bodyInit, i.bodyUsed = !0);
  } else
    this.url = String(i);
  if (this.credentials = t.credentials || this.credentials || "same-origin", (t.headers || !this.headers) && (this.headers = new vt(t.headers)), this.method = Rc(t.method || this.method || "GET"), this.mode = t.mode || this.mode || null, this.signal = t.signal || this.signal || (function() {
    if ("AbortController" in Mt) {
      var A = new AbortController();
      return A.signal;
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
Ne.prototype.clone = function() {
  return new Ne(this, { body: this._bodyInit });
};
function xc(i) {
  var t = new FormData();
  return i.trim().split("&").forEach(function(e) {
    if (e) {
      var n = e.split("="), r = n.shift().replace(/\+/g, " "), A = n.join("=").replace(/\+/g, " ");
      t.append(decodeURIComponent(r), decodeURIComponent(A));
    }
  }), t;
}
function Sc(i) {
  var t = new vt(), e = i.replace(/\r?\n[\t ]+/g, " ");
  return e.split("\r").map(function(n) {
    return n.indexOf(`
`) === 0 ? n.substr(1, n.length) : n;
  }).forEach(function(n) {
    var r = n.split(":"), A = r.shift().trim();
    if (A) {
      var s = r.join(":").trim();
      try {
        t.append(A, s);
      } catch (o) {
        console.warn("Response " + o.message);
      }
    }
  }), t;
}
wo.call(Ne.prototype);
function ne(i, t) {
  if (!(this instanceof ne))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  if (t || (t = {}), this.type = "default", this.status = t.status === void 0 ? 200 : t.status, this.status < 200 || this.status > 599)
    throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
  this.ok = this.status >= 200 && this.status < 300, this.statusText = t.statusText === void 0 ? "" : "" + t.statusText, this.headers = new vt(t.headers), this.url = t.url || "", this._initBody(i);
}
wo.call(ne.prototype);
ne.prototype.clone = function() {
  return new ne(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new vt(this.headers),
    url: this.url
  });
};
ne.error = function() {
  var i = new ne(null, { status: 200, statusText: "" });
  return i.ok = !1, i.status = 0, i.type = "error", i;
};
var Oc = [301, 302, 303, 307, 308];
ne.redirect = function(i, t) {
  if (Oc.indexOf(t) === -1)
    throw new RangeError("Invalid status code");
  return new ne(null, { status: t, headers: { location: i } });
};
var De = Mt.DOMException;
try {
  new De();
} catch {
  De = function(t, e) {
    this.message = t, this.name = e;
    var n = Error(t);
    this.stack = n.stack;
  }, De.prototype = Object.create(Error.prototype), De.prototype.constructor = De;
}
function Eo(i, t) {
  return new Promise(function(e, n) {
    var r = new Ne(i, t);
    if (r.signal && r.signal.aborted)
      return n(new De("Aborted", "AbortError"));
    var A = new XMLHttpRequest();
    function s() {
      A.abort();
    }
    A.onload = function() {
      var a = {
        statusText: A.statusText,
        headers: Sc(A.getAllResponseHeaders() || "")
      };
      r.url.indexOf("file://") === 0 && (A.status < 200 || A.status > 599) ? a.status = 200 : a.status = A.status, a.url = "responseURL" in A ? A.responseURL : a.headers.get("X-Request-URL");
      var I = "response" in A ? A.response : A.responseText;
      setTimeout(function() {
        e(new ne(I, a));
      }, 0);
    }, A.onerror = function() {
      setTimeout(function() {
        n(new TypeError("Network request failed"));
      }, 0);
    }, A.ontimeout = function() {
      setTimeout(function() {
        n(new TypeError("Network request timed out"));
      }, 0);
    }, A.onabort = function() {
      setTimeout(function() {
        n(new De("Aborted", "AbortError"));
      }, 0);
    };
    function o(a) {
      try {
        return a === "" && Mt.location.href ? Mt.location.href : a;
      } catch {
        return a;
      }
    }
    if (A.open(r.method, o(r.url), !0), r.credentials === "include" ? A.withCredentials = !0 : r.credentials === "omit" && (A.withCredentials = !1), "responseType" in A && (Bt.blob ? A.responseType = "blob" : Bt.arrayBuffer && (A.responseType = "arraybuffer")), t && typeof t.headers == "object" && !(t.headers instanceof vt || Mt.Headers && t.headers instanceof Mt.Headers)) {
      var g = [];
      Object.getOwnPropertyNames(t.headers).forEach(function(a) {
        g.push(on(a)), A.setRequestHeader(a, Li(t.headers[a]));
      }), r.headers.forEach(function(a, I) {
        g.indexOf(I) === -1 && A.setRequestHeader(I, a);
      });
    } else
      r.headers.forEach(function(a, I) {
        A.setRequestHeader(I, a);
      });
    r.signal && (r.signal.addEventListener("abort", s), A.onreadystatechange = function() {
      A.readyState === 4 && r.signal.removeEventListener("abort", s);
    }), A.send(typeof r._bodyInit > "u" ? null : r._bodyInit);
  });
}
Eo.polyfill = !0;
Mt.fetch || (Mt.fetch = Eo, Mt.Headers = vt, Mt.Request = Ne, Mt.Response = ne);
const Mo = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAAqACAAQAAAABAAAANKADAAQAAAABAAAANAAAAAD/4QkhaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/4hskSUNDX1BST0ZJTEUAAQEAABsUYXBwbAIQAABtbnRyUkdCIFhZWiAH4AAKAB0AFAA0AAZhY3NwQVBQTAAAAABBUFBMAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFkZXNjAAABUAAAAGJkc2NtAAABtAAABBhjcHJ0AAAFzAAAACN3dHB0AAAF8AAAABRyWFlaAAAGBAAAABRnWFlaAAAGGAAAABRiWFlaAAAGLAAAABRyVFJDAAAGQAAACAxhYXJnAAAOTAAAACB2Y2d0AAAObAAABhJuZGluAAAUgAAABj5jaGFkAAAawAAAACxtbW9kAAAa7AAAAChiVFJDAAAGQAAACAxnVFJDAAAGQAAACAxhYWJnAAAOTAAAACBhYWdnAAAOTAAAACBkZXNjAAAAAAAAAAhEaXNwbGF5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbWx1YwAAAAAAAAAiAAAADGhySFIAAAAUAAABqGtvS1IAAAAMAAABvG5iTk8AAAASAAAByGlkAAAAAAASAAAB2mh1SFUAAAAUAAAB7GNzQ1oAAAAWAAACAGRhREsAAAAcAAACFnVrVUEAAAAcAAACMmFyAAAAAAAUAAACTml0SVQAAAAUAAACYnJvUk8AAAASAAACdm5sTkwAAAAWAAACiGhlSUwAAAAWAAACnmVzRVMAAAASAAACdmZpRkkAAAAQAAACtHpoVFcAAAAMAAACxHZpVk4AAAAOAAAC0HNrU0sAAAAWAAAC3npoQ04AAAAMAAACxHJ1UlUAAAAkAAAC9GZyRlIAAAAWAAADGG1zAAAAAAASAAADLmNhRVMAAAAYAAADQHRoVEgAAAAMAAADWGVzWEwAAAASAAACdmRlREUAAAAQAAADZGVuVVMAAAASAAADdHB0QlIAAAAYAAADhnBsUEwAAAASAAADnmVsR1IAAAAiAAADsHN2U0UAAAAQAAAD0nRyVFIAAAAUAAAD4mphSlAAAAAMAAAD9nB0UFQAAAAWAAAEAgBMAEMARAAgAHUAIABiAG8AagBpzuy37AAgAEwAQwBEAEYAYQByAGcAZQAtAEwAQwBEAEwAQwBEACAAVwBhAHIAbgBhAFMAegDtAG4AZQBzACAATABDAEQAQgBhAHIAZQB2AG4A/QAgAEwAQwBEAEwAQwBEAC0AZgBhAHIAdgBlAHMAawDmAHIAbQQaBD4EOwRMBD4EQAQ+BDIEOAQ5ACAATABDAEQgDwBMAEMARAAgBkUGRAZIBkYGKQBMAEMARAAgAGMAbwBsAG8AcgBpAEwAQwBEACAAYwBvAGwAbwByAEsAbABlAHUAcgBlAG4ALQBMAEMARCAPAEwAQwBEACAF5gXRBeIF1QXgBdkAVgDkAHIAaQAtAEwAQwBEX2mCcgAgAEwAQwBEAEwAQwBEACAATQDgAHUARgBhAHIAZQBiAG4A6QAgAEwAQwBEBCYEMgQ1BEIEPQQ+BDkAIAQWBBoALQQ0BDgEQQQ/BDsENQQ5AEwAQwBEACAAYwBvAHUAbABlAHUAcgBXAGEAcgBuAGEAIABMAEMARABMAEMARAAgAGUAbgAgAGMAbwBsAG8AcgBMAEMARAAgDioONQBGAGEAcgBiAC0ATABDAEQAQwBvAGwAbwByACAATABDAEQATABDAEQAIABDAG8AbABvAHIAaQBkAG8ASwBvAGwAbwByACAATABDAEQDiAOzA8cDwQPJA7wDtwAgA78DuAPMA70DtwAgAEwAQwBEAEYA5AByAGcALQBMAEMARABSAGUAbgBrAGwAaQAgAEwAQwBEMKsw6TD8AEwAQwBEAEwAQwBEACAAYQAgAEMAbwByAGUAc3RleHQAAAAAQ29weXJpZ2h0IEFwcGxlIEluYy4sIDIwMTYAAFhZWiAAAAAAAADzUgABAAAAARbPWFlaIAAAAAAAAGXoAAA8EAAACdBYWVogAAAAAAAAapMAAKrFAAAXilhZWiAAAAAAAAAmWwAAGSwAALHSY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA2ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKMAqACtALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkHKwc9B08HYQd0B4YHmQesB78H0gflB/gICwgfCDIIRghaCG4IggiWCKoIvgjSCOcI+wkQCSUJOglPCWQJeQmPCaQJugnPCeUJ+woRCicKPQpUCmoKgQqYCq4KxQrcCvMLCwsiCzkLUQtpC4ALmAuwC8gL4Qv5DBIMKgxDDFwMdQyODKcMwAzZDPMNDQ0mDUANWg10DY4NqQ3DDd4N+A4TDi4OSQ5kDn8Omw62DtIO7g8JDyUPQQ9eD3oPlg+zD88P7BAJECYQQxBhEH4QmxC5ENcQ9RETETERTxFtEYwRqhHJEegSBxImEkUSZBKEEqMSwxLjEwMTIxNDE2MTgxOkE8UT5RQGFCcUSRRqFIsUrRTOFPAVEhU0FVYVeBWbFb0V4BYDFiYWSRZsFo8WshbWFvoXHRdBF2UXiReuF9IX9xgbGEAYZRiKGK8Y1Rj6GSAZRRlrGZEZtxndGgQaKhpRGncanhrFGuwbFBs7G2MbihuyG9ocAhwqHFIcexyjHMwc9R0eHUcdcB2ZHcMd7B4WHkAeah6UHr4e6R8THz4faR+UH78f6iAVIEEgbCCYIMQg8CEcIUghdSGhIc4h+yInIlUigiKvIt0jCiM4I2YjlCPCI/AkHyRNJHwkqyTaJQklOCVoJZclxyX3JicmVyaHJrcm6CcYJ0kneierJ9woDSg/KHEooijUKQYpOClrKZ0p0CoCKjUqaCqbKs8rAis2K2krnSvRLAUsOSxuLKIs1y0MLUEtdi2rLeEuFi5MLoIuty7uLyQvWi+RL8cv/jA1MGwwpDDbMRIxSjGCMbox8jIqMmMymzLUMw0zRjN/M7gz8TQrNGU0njTYNRM1TTWHNcI1/TY3NnI2rjbpNyQ3YDecN9c4FDhQOIw4yDkFOUI5fzm8Ofk6Njp0OrI67zstO2s7qjvoPCc8ZTykPOM9Ij1hPaE94D4gPmA+oD7gPyE/YT+iP+JAI0BkQKZA50EpQWpBrEHuQjBCckK1QvdDOkN9Q8BEA0RHRIpEzkUSRVVFmkXeRiJGZ0arRvBHNUd7R8BIBUhLSJFI10kdSWNJqUnwSjdKfUrESwxLU0uaS+JMKkxyTLpNAk1KTZNN3E4lTm5Ot08AT0lPk0/dUCdQcVC7UQZRUFGbUeZSMVJ8UsdTE1NfU6pT9lRCVI9U21UoVXVVwlYPVlxWqVb3V0RXklfgWC9YfVjLWRpZaVm4WgdaVlqmWvVbRVuVW+VcNVyGXNZdJ114XcleGl5sXr1fD19hX7NgBWBXYKpg/GFPYaJh9WJJYpxi8GNDY5dj62RAZJRk6WU9ZZJl52Y9ZpJm6Gc9Z5Nn6Wg/aJZo7GlDaZpp8WpIap9q92tPa6dr/2xXbK9tCG1gbbluEm5rbsRvHm94b9FwK3CGcOBxOnGVcfByS3KmcwFzXXO4dBR0cHTMdSh1hXXhdj52m3b4d1Z3s3gReG54zHkqeYl553pGeqV7BHtje8J8IXyBfOF9QX2hfgF+Yn7CfyN/hH/lgEeAqIEKgWuBzYIwgpKC9INXg7qEHYSAhOOFR4Wrhg6GcobXhzuHn4gEiGmIzokziZmJ/opkisqLMIuWi/yMY4zKjTGNmI3/jmaOzo82j56QBpBukNaRP5GokhGSepLjk02TtpQglIqU9JVflcmWNJaflwqXdZfgmEyYuJkkmZCZ/JpomtWbQpuvnByciZz3nWSd0p5Anq6fHZ+Ln/qgaaDYoUehtqImopajBqN2o+akVqTHpTilqaYapoum/adup+CoUqjEqTepqaocqo+rAqt1q+msXKzQrUStuK4trqGvFq+LsACwdbDqsWCx1rJLssKzOLOutCW0nLUTtYq2AbZ5tvC3aLfguFm40blKucK6O7q1uy67p7whvJu9Fb2Pvgq+hL7/v3q/9cBwwOzBZ8Hjwl/C28NYw9TEUcTOxUvFyMZGxsPHQce/yD3IvMk6ybnKOMq3yzbLtsw1zLXNNc21zjbOts83z7jQOdC60TzRvtI/0sHTRNPG1EnUy9VO1dHWVdbY11zX4Nhk2OjZbNnx2nba+9uA3AXcit0Q3ZbeHN6i3ynfr+A24L3hROHM4lPi2+Nj4+vkc+T85YTmDeaW5x/nqegy6LzpRunQ6lvq5etw6/vshu0R7ZzuKO6070DvzPBY8OXxcvH/8ozzGfOn9DT0wvVQ9d72bfb794r4Gfio+Tj5x/pX+uf7d/wH/Jj9Kf26/kv+3P9t//9wYXJhAAAAAAADAAAAAmZmAADypwAADVkAABPQAAAKDnZjZ3QAAAAAAAAAAAADAQAAAgAAAFYBRQJBAzgEGAUKBggHMAhZCYMKvwwGDWEOtxAKEWwSyhQ1FZwXABhrGc4bNhyQHesfQCCPIdEjCiQ5JVkmaydtKFwpQiodKvErxiyZLWsuPS8NL98wrzGAMlEzITPtNLk1hTZRNxw35TiuOXg6QTsKO9M8nD1kPiw+8j+3QHxBQkIMQt9DvkSqRZ1GkUd+SGFJP0oYSvFLzEyuTZ1OoU+8UONSBVMZVBpVEFYDVvxX+1kAWglbDlwNXQRd9V7iX9BgwGGzYqZjmWSKZXlmZ2dUaEJpNGoqayFsGW0PbgNu9G/icNBxu3Kkc450f3WGdrV4BHllesB8AH0mfjp/SYBbgXWCjoOVhHuFNIXjho+HUIgliQuKAIsCjBGNKI4+j06QV5FaklqTWJRWlVSWUZdOmEuZR5pCmz6cOZ0zni2fKqAwoUuig6PgpUmmrKfrqRGqJasxrDutRK5Nr1ewX7FosnCzd7R+tYK2hbeIuIu5j7qVu5y8pr20vsW/18DgwdbCr8NmxBjEyMWWxnfHZshdyVfKUctLzEfNSM5Uz3HQoNHZ0wvUL9VD1knXRdg42SXaDtr52+jc2N3B3qPfg+Bn4VXiTuNN5E/lT+ZK5znoF+jg6YrqNOrg66jseu1I7gjuqe9H7+Pwo/F48l7zT/RN9Wr2wviH+rf9RP//AAAAVgFFAjEDBAPpBOAF4wbwCAMJNgpoC5wM4A4qD3cQxhIZE3kU1BYyF4IY3Ro1G4Yc0B4aH1ggkSG8Itwj9ST2JeomzSejKHIpPioIKtQrnyxqLTUt/i7GL44wVzEfMecyrjN2ND01ATXFNoo3TzgTONY5mTpbOx073DycPVw+GT7XP5dAW0EmQftC1UOxRIxFZUY8RxFH5ki8SZVKdktlTGJNaE5vT21QYlFPUjtTKlQbVQ5WAlb2V+dY1lnDWq5bm1yKXXpeaV9YYERhL2IYYwFj6mTVZcRmtWemaJZphGpva1lsQG0nbg1u9G/hcN5x9HMhdF91mXbBd9h443nsevl8C30efih/IIAGgN+BtYKPg3KEXoVVhliHaYiDiZ2KrYu1jLaNtI6xj62QqZGlkqCTm5SVlY+WiZeCmHmZb5pnm2mcgJ2/nymgqKIno5Kk06X5pw6oGqkjqiqrMaw3rT6uRK9NsFmxbLKGs6O0vrXRtt636LjzugO7F7wrvTu+QL83wCHBAsHiwsfDtcSnxZvGkMeFyHrJcsp0y4nMvM4Wz33Q3dIa0z/UVNVm1oDXpdjP2fTbEtwt3UzecN+X4Lvh0uLe4+Lk6+YF5znogenR6xHsMO017ibvD+/48Obx1/LK87n0ofV/9lb3J/f2+Lz5evo7+wz8RP3p//8AAABWAS4B6wKdA14EKQUHBfEG6QfqCOIJ8QsKDCUNQQ5aD4EQrBHREv8UJRVFFmoXhRifGbQaxRvIHMYdux6hH3ggQiD6IaQiSyLrI4gkJyTCJV4l+SaUJzAnyihnKQcppypIKucrhiwoLMUtYy4ALp0vPC/YMHUxEjGvMkwy6DODNB40uDVSNew2hTcfN7c4UDjoOX86FjqrO0E70jxjPO49ez4HPps/ND/WQHpBHkG4Qk9C2UNoQ/9EokVQRglGw0d8SDRI6kmiSlxLGEvWTJVNU04PTslPg1A7UPRRr1JrUydT5FShVV1WGVbUV49YSFj/WbVabFskW91cll1OXfZelF8lX7RgQWDaYXhiImLYY5lkaGVHZjdnOWhJaWFqbWthbD9tEG3cbqVvbXA1cPxxw3KKc1B0FXTbdZ92ZHcmd+Z4nnlFedx6bHsUe9N8u32+fsR/w4C5gamCloODhG+FW4ZFhyqIBYjUiZmKWoski/uM4I3NjrmPoJB+kVuSOpMak/mU1pWylpeXjZiSmaGas5vGnNid6p77oA2hIKIzo0ikXKVvpn6niaiMqYCqYas3rA6s8q3trvmwDLEesjKzULR7tbS2+Lg5uXC6mbuwvLi9u77Jv/XBR8K5xFPF9ceWyTPK1MyNzmDQSdJB1ELWbNkO3Ovizur19Pn//wAAbmRpbgAAAAAAAAY2AACTgQAAWIYAAFU/AACRxAAAJtUAABcKAABQDQAAVDkAAiZmAAIMzAABOuEAAwEAAAIAAAABAAMABgALABEAGAAfACcAMAA6AEQATwBaAGYAcwCBAI8AngCuAL4AzwDhAPQBBwEcATEBRwFfAXcBkQGsAcgB5gIGAigCTAJzAp0CywL/AzgDdgO5A/4ERwSTBOIFMwWIBd8GOgaZBvsHYQfKCDcIpwkbCZEKCwqJCwoLkAwaDKcNNA28Dj0Oug84D7sQSBDbEXQSEBKtE0QT0RRUFNEVTxXSFl8W+BeZGD0Y3hl9GhsauhteHAkcvB12HjQe8x+yIHIhNSH8IscjliRoJTwmDibgJ7MoiCliKkErJiwOLPst7i7kL9UwtTF7MjEy3jOINDU07zW4NpI3eThkOUw6MDsXPA49Lj6bQCtBjULJQ+9FCEYVRxlIHEkkSjRLTkxxTZhOxE/yUSNSV1OOVMdWBFdEWIZZzFsWXGJdql7kYAZhEWIGYvVj5WTcZepnD2hLaZVq52w8bZRu7nBKcapzDHRxddp3Rni4ei17pn0gfpuAFoGRgwqEgYX1h2qI64qLjG2OtZERkxqU7ZapmF+aFpvQnY2fR6D1oo+kFKWIpvaoa6nyq5CtRa8RsPGy5rTotuu457rjvPG/F8FDw17FYMdTyT/LL80pzzbRbtP41wTaCdyf3xPhvuUO6HzrQe2v7/vyNvRG9gr3jfjK+ej65fvZ/LT9kP5i/zD//wAAAAEAAwAHAAwAEgAZACEAKgAzAD0ASABUAGAAbQB7AIkAmQCpALkAywDdAPABBQEaATABRwFfAXkBlAGwAc4B7QIPAjMCWgKDArIC5QMfA18DpAPsBDYEhATVBSkFgQXcBjoGmwcAB2gH1QhFCLgJLwmqCikKrAs0C78MUAzjDXgOCQ6VDyEPsBBDENsRdxIWErcTVhPtFH0VChWYFi0WyhdvGBcYwBlpGhQawBtvHCQc3B2ZHlgfGB/ZIJ0hZCIwIwAj1CSrJYQmXCc0KA0o6inMKrMrnyyPLYMufC90MGMxQDIMMs4zijRLNRc18TbZN8c4tjmiOow7ejx2PYk+uD/3QTNCZEOLRKZFtka7R7tIvUnJSuFMAk0qTlZPhVC3UexTJFRfVZ1W3lgiWWpatlwHXVdeml/FYNFhwmKpY4hkaWVSZkhnWWiCacBrDWxibbxvGnB6cd1zQnSpdg93cHjLeiF7dnzQfjV/pIEbgpSECoV7huyIYYnii3qNMI8CkN2SsZR2ljSX8pmxm3WdOp76oKaiMqOdpOemJ6doqLCqF6ucrT2u7bCZsjmzzrVhtvu4orpRvAC9qb9MwPHCn8RixjrIIcoEy83Nds8G0IrSDNOi1V/XTdls26fd5+Af4lDkgea+6RfrkO4m8M3zlPaM+Un7Mvye/eT+8f//AAAAAQAEAAkAEAAYACEAKwA2AEMAUABeAG0AfQCPAKEAtADIAN4A9AEMASYBQAFdAXsBmwG9AeECCQIzAmEClQLQAxUDZQO9BBwEgATqBVkFzQZDBr0HPQfBCEwI3QlzCg8KsAtWDAMMtw1xDjEO+A/FEJkRdRJZE0kUShVRFkoXNxgpGTUaXxt5HHQdYh5UH04gTSFNIkwjTSRSJV8mcyeNKKopyCrpLA0tNy5mL5ow1jIaM2Q0rzX7N1A4zTqJPFk+BT+QQPxCS0ODRKZFt0a8R75Izkn7S0tMtk4uT6xRLlK2VENV1ldtWQparFxWXhFgC2JfZFtl5Gc7aItp5mtSbMxuTW/ScVty6HR7dh533nnGe8B9nX9VgPqCoYRWhh+H8Im9i4yNZo9HkRmSy5RmlfaXg5kRmqKcNp3Nn2ahAaKcpDil1ad1qRuqyKx/rkewL7JGtH+2oriPulm8F73Xv5vBWcMHxKXGNMe7yUXK18x4zi/QA9Hw0+jV0deR2Sfandv+3UXeit/L4Q/iVeOg5OnmMedr6KDpyOrq7AXtHO4w70TwV/Fh8mTzUPQi9PX1jfYc9qr3Ofea9/n4V/i2+Rb5cvm2+fv6QPqE+sn7DvtT+5f70PwI/ED8ePyx/On9If1Z/ZL9yv39/jH+ZP6X/sv+/v8x/2X/mP/M//8AAHNmMzIAAAAAAAEMQgAABd7///MmAAAHkgAA/ZH///ui///9owAAA9wAAMBsbW1vZAAAAAAAAAYQAACc8AAAAADLuPqAAAAAAAAAAAAAAAAAAAAAAP/AABEIADQANAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDAAICAgICAgMCAgMEAwMDBAUEBAQEBQcFBQUFBQcIBwcHBwcHCAgICAgICAgKCgoKCgoLCwsLCw0NDQ0NDQ0NDQ3/2wBDAQICAgMDAwYDAwYNCQcJDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ3/3QAEAAT/2gAMAwEAAhEDEQA/AP08v5vGOr3niqfwPYQ+J7eySCG3ZLCwhNpqk955VzBaSyyxW94dPtWZ7jzpWQ3CCNZN/mRR9Z4d8Qy6l4c+1aHfbL25sJUtL/VLaK0lN551xFMhihCwJNaGF0fYjggByWTr5pat4T0TQv8AhGPDXh6TTdMjeHZFHq+pYiFsrJEsDJcRvAoV2UrGwVlOCCAKpRagbSeyfTLe30+DTY4obK1tYxHb28MP3I405woJJ5ySSSSSTXxOIzfmjzUG1J21a8+z8tNflbr05vxbkcY2wdFSkpxabhGOiST5rNp3t8KstXdt25fQvE/gTwxrZttV8W3En9rS28K3cejyEveSx8eYWZdwDoqpn5MYwGztx4v4/wDhJovicada6NZQeFLTTRLvdLc3E9x55TDXEzyRu7KI8jcWYZPJr2G11BX1satMF8u/BkA44Y9Mg9MMpUN149DXTXxgv7cJLHnc23aD6AuGOMcYUgVvhcZicBjlifauc0rp2srOOrUb2bs2tb/fqfL53x1nGKtg/aWoKySv7vlp2XTt3PI/EHhDwQL43d94attP0+eRVW5s5WgETbeHeFAiomTkkFlGckbQSK3jq18F6Bpp+GkNzDZy+L/NuNMi1K4mWDSGKLayX5ufNV5TExJtbYl5nmwUeKNXlj9RtLNrqSWzKu1ncRSxSq4MkZK/KOWx6nIBPIx2zWl8OfEniK40HT1iubWOZ7Ni0F4zAPNGQmYyPmwWySoHzZByMfN5ODq/VsVGClJwqK2utmte+1rrfs/I/QeD+OMwxlCpTxs3N0OV/E1dNOzejV4tLpqrrS7PGfEOp+FdG8Wa9aeJE8L+NLgX22O71fWL8XtpFFDFD9klittKvYYWieNiVWQby5lZQ0hJzP8AhKfhp/0JngX/AMG2rf8AzPV7R8TfjvoHw01630LWW1Uzz2aXa/Y7eGaPY8kiDLS3ETbsxnjBGMc9ced/8NdeCfXxB/4BWv8A8mV6kcTiaqVSnh5NPVfDs/me9Q45hTpxpuk9El/Ea28lGy9Foj//0P0+ttJ8X6To93JZgPaXSlZBG6y5XncwAJxwCD39vTB06zt0tZdRvYZJEixhF+XcQwDZY5wFyuQBu+YcjrWtbQeJ4poNJspLl7eW3a4hhV9gaGQE5K7gM88jJ59e+haWmrwRWWkTWxhlnuXmHmKeBIVTDH+78h3Ljpg+lfFUsNCfLurXWuqW2v47dT4dUFPl5YyslbXVX026bs1oAuu6TBHpdlIZrd5XSTyRFEExnaclgxYjAwxYHkmrNvfPJDHOUlxNMVfEbMrY6jhSOQ2DzgN1PpT+MN7ceCvgz4j1rT7i9gXw3pEuoodPujZXUzWUbOI/OEcu1JMYbCMfQcYr8/TefEF/jJO0eoeLGnbw2hJB8Tef5bXj8H/inPO2Zz/yx8vP/LTd8te1PLfbUo8796PX9PT/AIJ62OyNVoLnlaVrPT+tvxP0T1/Up9Oskj02FHeaVYEBxsDuxXBUc7eCWOOACeazbttN0HTILt7WY3Fs8cGnySAmGQxmOUgsrbjgxAkkAFkxu5wfAZPFmpT/ALOui/EC11vxNY3S2Vnq7hdQtJJ5JNVmS1W2ku77TZwIoSxb/j3RlB5BzgeT+JNL+Ifw5tdf+It74i1B5J4oZ9Uay8XaNPcTmALEhSFvDSqSq8BVxnue9fPYrJI4ypf2nux0Wn2r638raaffufT8G4OhlNHkrQcueV5PZuK2Xo3e/dM918VXNt4v1h9Y1e10G6lKJEhurWWZ0RB90N9qUY3EnAA5J+p5z+wNB/6Bfhn/AMF8n/yZX0bbafrmgWsGjRW19rIs4xAb+7RBPceV8ivIIYYoslVH3EAxjvmpvtHiH/oCTfk3/wATWftMPR/dfXLculu1vmfeLiPK1osDD8P8j//R/V/QNeknuEfQL57vT5VZI47jawRijGHY6sQV3KF5I6gdTSeI3v4r5m1O4jhuUsEkRoIyQzq7AKVZiMkM3OcZxXzPomq6r4P8Qz6ffB3C3BtL2CR/NZJhheTuy/GCjAlyNqgPmLy/ZdY+Ifgq6aO/1bWbWKW2iKbTLFIX8piwygZSzYPKqeTjjnA+fpwVePs6au3e0b33T1Xl1+9dr9vF/COKyeXsYt1KUrShNX5WnpbrZrSyvrdNb2Og8U3Gran4B1Dw1Z2mk+Ipr4mxlTXbl7bT57S4BSR58RTNIEVgTEoBfpvXOT8sTfsg6fYeLH8YT6nEbpNHjkXUfJU6Y+rG6I+yDRxLg2TQlUVN/nEneJ/O+evoh/Gn2nzUv7ie0g2hEnu4U8hlKEsRs3mAADB3Imc4LEmuqn1SxuVt20iVLmyskVkaCRSs08o8uKIOG2k4bkN/E6HPWuDMs7hg8Hz0Gm9u+vy7dr6pbnj08rzKOY0cBXpShFq7cotWgt3d3Xl5Pc4P/hDvE2u+AbDwNJbeG/C1rBcLaa2mnyG/tYtKtysqLYxT2qRJJcAAFbgH7KhDDzGC15n4Y+E2geItR8barPomieBr7X5tOk8Outjp2rtYyafEBvdIEmt1hnmwHTcpdN2CrFTX1Tql9oFhppfX7b7GH2Qm4tX+WSRtqIGBALOzAKu5Hx61znwzsbu1065Xw/qNtA42WpspFR/3cSZUt95gMOONoyB15yPJwWe+yfLiYciveWj166dXe2vT8j6TKo08bhcVmjnelDlhTt1ve6emjirO1uvTRnrfhmfXbnw9p1x4nSyj1aW2je8XTZXnsxMygt5EkiRu8efullBx+Z3a868RaJqN/qAa1trgQQxJFH9nkiVCo5+6zqQQSR0xgCsL/hFtY/54X/8A3+g/+O18nWxnPUlNU1q2+p5vI3rp95//0v151n4S+DNQv7rX5reZb6VmnaRJmxuB3j5DlMb8t93qzHua+XPi/wCC9LvtOsLuaW4D24vdoVlAO2Ay85Qn70YH0z9R933X/HrN/wBc2/ka+P8A4pf8gS3+l/8A+kclfmPCWKrLH0Gpu6ulq9FaS0+R+m5JUnXySdGs+aKaST1Vua+z031MW/vLm2F7NG+RZJp+1CBtkN7cNE5fjOVVPl2lRknIPAEmvapf6B4alk0SX7ELEtcRLCiKvmPkEkBeeXLf72Capav/AMe+tf7uh/8ApbLTfGv/ACK2o/8AXL/2YVx0YRlUhzK//Ds/VM0oU6uEq06sU4tPRq6+Ht8395BpXjvxH4n02ystbmS4T+0ViZvLVWYJbyzKTtwMh41IOBX0H8Mdck1C1tNMurO0YJJdbJvK/fr5V1cqo35/6YqeR1z7Y+S/Bf8AqrP/ALCv/tnc19M/CX/j5tv+ul9/6WX9fS49JYjERW3s5fmfg+CoU6XCKVOKS9u9lbpJfovuO9naczO5ubkF3Z8LcSqo3MTgBXAAGcD2qLdN/wA/N1/4FT//ABypZvv1DXdhMswcqEG6Ub2X2V29DSnRp8i91fcf/9k=", Po = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAAqACAAQAAAABAAAANKADAAQAAAABAAAANAAAAAD/4QkhaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/4gKESUNDX1BST0ZJTEUAAQEAAAJ0YXBwbAQAAABtbnRyUkdCIFhZWiAH3AALAAwAEgA6ABdhY3NwQVBQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGxmSfnZPIV3n7QGSpkeOnQsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtkZXNjAAABCAAAAGNkc2NtAAABbAAAACxjcHJ0AAABmAAAAC13dHB0AAAByAAAABRyWFlaAAAB3AAAABRnWFlaAAAB8AAAABRiWFlaAAACBAAAABRyVFJDAAACGAAAABBiVFJDAAACKAAAABBnVFJDAAACOAAAABBjaGFkAAACSAAAACxkZXNjAAAAAAAAAAlIRCA3MDktQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbWx1YwAAAAAAAAABAAAADGVuVVMAAAAQAAAAHABIAEQAIAA3ADAAOQAtAEF0ZXh0AAAAAENvcHlyaWdodCBBcHBsZSBDb21wdXRlciwgSW5jLiwgMjAxMAAAAABYWVogAAAAAAAA81IAAQAAAAEWz1hZWiAAAAAAAABvoQAAOSMAAAOMWFlaIAAAAAAAAGKWAAC3vAAAGMpYWVogAAAAAAAAJJ4AAA87AAC2znBhcmEAAAAAAAAAAAAB9gRwYXJhAAAAAAAAAAAAAfYEcGFyYQAAAAAAAAAAAAH2BHNmMzIAAAAAAAEMQgAABd7///MmAAAHkgAA/ZH///ui///9owAAA9wAAMBs/8AAEQgANAA0AwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAAgICAgICAwICAwQDAwMEBQQEBAQFBwUFBQUFBwgHBwcHBwcICAgICAgICAoKCgoKCgsLCwsLDQ0NDQ0NDQ0NDf/bAEMBAgICAwMDBgMDBg0JBwkNDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDf/dAAQABP/aAAwDAQACEQMRAD8A+4dQ+EnhC61e2+L1l8f/ABrq50Gwu9MvtZt9S0Od9NsZPJvpkkjj0oqoPkRytuQyAKMcHBxf7J+D9h+yn4n/AGd9P8e6vcjxl/a8UHiTW/D2oRB7vxPeyTRtMwtYLdi81yEDBo1diMbc4rmfhlbeHLP4DfGDVpbqHV/EGvaPcTxabYEXF+bi505NOhVbe3lnGx5GhjUnBD7y4VcEeD6V4ZtfD/jiO4vNUtHtfDuo2XhVbDGnvqH9r2OtpZrfxWElg9s/lShZUJk8zYoJbHA6puEoRUFqlr56/wBdvQySkpO/XY+0fB37JPxJ8LWzal4H+NmqaU+t3n9qalNaeFvDdvJdXcq/PcTstgWml7fOzYycHrntfC/gHWvhPa6z4b1HxTL4pnSRNeiun0vTdIWC4mkklZBBplvbRM0s0Zld2UuzOcn1+xEkht4WV5F/cJmQ8LgAZLEDgZ618uz6wLi1vPEGshppNTjl1J1EiQtDY2oUx7SWT5kTYcA7i7HFfgX0hs0nHIMPleCpyniq9el7GEFzVP3U1WnKCdleMIPW6+JdGz1snp/vnOT0Sd301Vkvm2Z/xYs7jxXbalpln4fh8SXms6vFZWdncqGtUe2AUT3BY4WCBoXkkIySMqoLMoPy74B+DfhwePbiOHStQ1fQpfEVz4eS4tWdbnTpdOt4rQalBET5ZguHQrduAxTaCMq0mK3xc+KPxDm8MPqngCPUNOhsLhI/PshcPcR/aI5D+9uYirBpHUNgkZPB3A4Pnui/HHxH4bvrXWoX1vULvTFsZYpf7Yk+zSeTbwG7tpbWRiZmuJ3xyxYFjg/IBXDwRkeeRoKpiY8k8XjKmIqxcr8tN6QpaOzekFLlbjdNPmi2nw8X5J7DMVhcTTU5U4RVlyys3e91r53utLqzT1PP/HnxA+CWiePPEfhPxPNb3l54c1KfSTdzWe/7QLbAZ02lgFEhdcZPKntiuV/4Wd+zh/dsf/ABv8Ki/aJ+Anw2+HHjiz8Opp+vaxrLaPZ3niK5tb7MTa1db5LkgPFIV8zKy7QcAPwK8G/4QHwL/wBC14m/8DF/+Rq/pWnwrw+4puVT5S0+Xkfnc+DYuTcIyS6JSlof/9D93/Dely6Po8FjNM0zqCzF/wCEtyVHsCeK4nxJrxtvE1hBod7bTXoWSI6cXCvIGILORxlFLLubOFYrnk11F14jtUhkS/0+88l4Q7Zt2dCjjlWxkZA4YHivxo8UafjxxqEmm2GnhY7fX/I1C1hs30axV7+D7Ik86yfZ4liiMSPvQ+UXVZRlia9GeJlhqjxWJinzX32d9/6Vj5/Ncf8AVqcIUlf57WsfqP4ktb9NM1PV9XuJdJvdTkNuNkqiKO1SPMryt93y0jDEMSMHHrXkvxQtAfCWpanaPayWt3Z2ltHKzEeXCJt7mJgSjCVGAJOAFXOcVwXxvj8NeLNU8OW/h2z0uazaxu4rLTo2toZ5tGsbSSYSQrJa3kaWokDAsUSMjy13gsAfALyxg/s/WdBsLe00qN7JZFhZ4muLa3vLGKSBbp7aztA0bOzPGyROvULIxUgfhHEOUY7iriPB8YZZmLo08G50oxVKMoyi5eyrKMpSuuflUVNJ2irxvds+oyHHQoY36hUoqW823Jq/JB1ddLdLW3ufQ/hhPh/cfDf/AIRvxZfaes2o65/aBka+g8lUghCL86SlHcLj922cGQEqcZr47/aP8U/Cj4PeB/DWkeHLO08VXd3rkOoPp+rDbc/Y7NEWZZ3RVbypGjWMLtEe1nAU5OdzR7OeXR5PC8t2dOXS7XVLfXb2SxF/Hb6dql5aSvcAzMJIkihcuWOA2x8AgFj8PfthSzxfG2/0VkkFto9pbWVvOwIS6BXz3miJ4KFpdvBIyvU045Lj6vGGGlUx8lGlBt0oLlhKNOScXK6l77lUg2lPWMUmuVtGcM4pZx9Yx+KopVZtO/8AivzJdbK1ldH6cfstQeEv2h/CHiL4kXely+FzN4ims49MsLyOS2hjt7KzC7DPAXwc9Og7ADgfTX/ChfA//P5qP/gRa/8Axivg79j/AEyPwz8EdNlvrdpJNZurrUxl2XEcr+XHgAjqkQb8a+oP7W0//nzP/f1//iq+lx3iJg6GJqUZ0JScZNN+5rZ2vq76mS4q9ivYrEyXLpa70tpY/9H9Rda/aY0d7qOy0q1uhYg4luEhSXK4xgJK0ZdfXA6dCav6bP8AD7W9AiufDDafNqtxIbWA2MP2STTLNdjSRiHCPFGAq/uyNjOVyGHNfPfwx8B2nxE8cSadbi6Xw/btJd3EkrhZ1tOVhRnRVCySsATgDAD4+6K6S4+H2v8AhuafVPh1e3V+90ZoreJIV+2TWUfPmcfKwH3h8oJBXA3Ntr8r8Q+LMVLI6mU0vZQr4zmo0LxlK82m7tWm5RSTd2rJpX0dn+m4rg7IaOKhQhiJwrRjGT9pbl1+y3G3JLbureep7wngc+I9BmMOiaZe6NcRNYLYyRpGZrNDtIGQYjEW3bYztGPmB+bFfO9vc6VrvxOtp7C7ntYNNKMn2smZQ+mkBYlAY4gVhtIDBdoJDfNWnof7QHjDQtEufDWrWy3ZgtXtIXC+Rc27qmxBJG23GMAHoe+2tj9nnTn0/T/FPjEMDNZ2iaZaNwSbm4w7H15Yw/ma+Xy3wsybIcGnkuYVqdR0mqk/aTlFOMVetKlUvH2l1dO3Lvo9ysJgcbltHF4zMKCVoqFPZqTqNr3ZLdKN3316DfFPiOy8OnxBqN1ptnDY3F1a3N1PY26wi8luBNPNgk4lVUCOSWbMjvz2r837L4p6P8ZPitrHgbVfAOkeJobrS30jTr++xIuhMk8tze36LGCkgeaZgmGXhIUVtpZT7B8dfjJc/FfwHr/w3+D1hFrGoaNFBDrd6siLHpWmm5eMmBpGVpJ5ESIXLRBvIj8zJ64d+zx8NPAXwwi+ya1PczvrcUH9o6tYgylYSgbbb+V+8SM7soyhjuIY/dArq8JcrzHJuGcRxBnl55hjZS5Yy05G3GDqT+zFSUIVOVWio2jFcqufkfFWc4ejWpYKg1D+89u/ppd+bfmfoL8H/gd4Ui8Bacuq6eqw7FGnQqWXydPRFWBDknJKrvz/ALXrXp//AApL4ef9A7/x814Bq/7SEHga5Tw9omoWvimyhjVotQv5oLKUqSQI8L5ayiMAKZAi5YMpG5STlf8ADYF9/wBA3SP/AAaQ/wDxVfp9LJcrpwVOcFJpWba1dur82dtHJounFxjFqy1vHX8T/9L9P/hLZw6Z8F7rUrLMdzreq/ZbqUfe8n7QtrtU9sR5x6MxPfj2r4eW0L6hrF4VAe1eGyhAGAkIiSUgDsWZ+fUKvpXkHw0/5ITY/wDYc/8AciK9m+HX+u1//r+i/wDSaGv54x3v+KeTU56qGDqyinspOUYuS7NrRtataPQ+x4ik3iMbJvX2rXyTdjiPH2l6TrnjC5fVbC1uG0mzheBniUsWm3MS7dWx5YCgnAGeMkmviz9tvxhq/wAK/gakfgUQ6W2valb6VdyxRgS/ZplkkcI4wVYsoO7kg8jnkfcHij/kbtc/68rT/wBBlr89v+Cj/wDyRLQv+xksv/RU1fgOb5pja/0icLltatKVD29Fcjk3CzpRTXK3y2alJNWs7u+7M51ZrIJxTdkm/nrr6n5x/BrT0svhr4z8UxSytPHqenaILd23Wphv4Z/NmaLHzThVKI5J2BmIAfDD9OPg/NYyw+PLe70vTrmDTdA02W0jltUzDLcXcsTukqhZlO0DgSAZUccV+a3wm/5Id43/AOxs0H/0Rc1+j/we+78Sv+xc0b/0vlr/AEHx8I+0irfZ/r8z8jUVPPYRnqnZPzXvaHm/xJ8HWUOs2Yku7uZ30+CRnYxxktIWY/LFHGnU9lyepJOTXnv/AAien/8APe5/7+f/AFq9w+KH/IbsP+wXafyavNq4U9Dkq4elzv3Vv2P/2Q==", Ro = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCARXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAKgAgAEAAAAAQAAADSgAwAEAAAAAQAAADQAAAAA/+EJIWh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/PgD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/+IbJElDQ19QUk9GSUxFAAEBAAAbFGFwcGwCEAAAbW50clJHQiBYWVogB+EABAAEABcABgAzYWNzcEFQUEwAAAAAQVBQTAAAAAAAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1hcHBsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARZGVzYwAAAVAAAABiZHNjbQAAAbQAAAQYY3BydAAABcwAAAAjd3RwdAAABfAAAAAUclhZWgAABgQAAAAUZ1hZWgAABhgAAAAUYlhZWgAABiwAAAAUclRSQwAABkAAAAgMYWFyZwAADkwAAAAgdmNndAAADmwAAAYSbmRpbgAAFIAAAAY+Y2hhZAAAGsAAAAAsbW1vZAAAGuwAAAAoYlRSQwAABkAAAAgMZ1RSQwAABkAAAAgMYWFiZwAADkwAAAAgYWFnZwAADkwAAAAgZGVzYwAAAAAAAAAIRGlzcGxheQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG1sdWMAAAAAAAAAIgAAAAxockhSAAAAFAAAAahrb0tSAAAADAAAAbxuYk5PAAAAEgAAAchpZAAAAAAAEgAAAdpodUhVAAAAFAAAAexjc0NaAAAAFgAAAgBkYURLAAAAHAAAAhZ1a1VBAAAAHAAAAjJhcgAAAAAAFAAAAk5pdElUAAAAFAAAAmJyb1JPAAAAEgAAAnZubE5MAAAAFgAAAohoZUlMAAAAFgAAAp5lc0VTAAAAEgAAAnZmaUZJAAAAEAAAArR6aFRXAAAADAAAAsR2aVZOAAAADgAAAtBza1NLAAAAFgAAAt56aENOAAAADAAAAsRydVJVAAAAJAAAAvRmckZSAAAAFgAAAxhtcwAAAAAAEgAAAy5jYUVTAAAAGAAAA0B0aFRIAAAADAAAA1hlc1hMAAAAEgAAAnZkZURFAAAAEAAAA2RlblVTAAAAEgAAA3RwdEJSAAAAGAAAA4ZwbFBMAAAAEgAAA55lbEdSAAAAIgAAA7BzdlNFAAAAEAAAA9J0clRSAAAAFAAAA+JqYUpQAAAADAAAA/ZwdFBUAAAAFgAABAIATABDAEQAIAB1ACAAYgBvAGoAac7st+wAIABMAEMARABGAGEAcgBnAGUALQBMAEMARABMAEMARAAgAFcAYQByAG4AYQBTAHoA7QBuAGUAcwAgAEwAQwBEAEIAYQByAGUAdgBuAP0AIABMAEMARABMAEMARAAtAGYAYQByAHYAZQBzAGsA5gByAG0EGgQ+BDsETAQ+BEAEPgQyBDgEOQAgAEwAQwBEIA8ATABDAEQAIAZFBkQGSAZGBikATABDAEQAIABjAG8AbABvAHIAaQBMAEMARAAgAGMAbwBsAG8AcgBLAGwAZQB1AHIAZQBuAC0ATABDAEQgDwBMAEMARAAgBeYF0QXiBdUF4AXZAFYA5AByAGkALQBMAEMARF9pgnIAIABMAEMARABMAEMARAAgAE0A4AB1AEYAYQByAGUAYgBuAP0AIABMAEMARAQmBDIENQRCBD0EPgQ5ACAEFgQaAC0ENAQ4BEEEPwQ7BDUEOQBMAEMARAAgAGMAbwB1AGwAZQB1AHIAVwBhAHIAbgBhACAATABDAEQATABDAEQAIABlAG4AIABjAG8AbABvAHIATABDAEQAIA4qDjUARgBhAHIAYgAtAEwAQwBEAEMAbwBsAG8AcgAgAEwAQwBEAEwAQwBEACAAQwBvAGwAbwByAGkAZABvAEsAbwBsAG8AcgAgAEwAQwBEA4gDswPHA8EDyQO8A7cAIAO/A7gDzAO9A7cAIABMAEMARABGAOQAcgBnAC0ATABDAEQAUgBlAG4AawBsAGkAIABMAEMARDCrMOkw/ABMAEMARABMAEMARAAgAGEAIABDAG8AcgBlAHN0ZXh0AAAAAENvcHlyaWdodCBBcHBsZSBJbmMuLCAyMDE3AABYWVogAAAAAAAA81IAAQAAAAEWz1hZWiAAAAAAAABl6AAAPBAAAAnQWFlaIAAAAAAAAGqTAACqxQAAF4pYWVogAAAAAAAAJlsAABksAACx0mN1cnYAAAAAAAAEAAAAAAUACgAPABQAGQAeACMAKAAtADIANgA7AEAARQBKAE8AVABZAF4AYwBoAG0AcgB3AHwAgQCGAIsAkACVAJoAnwCjAKgArQCyALcAvADBAMYAywDQANUA2wDgAOUA6wDwAPYA+wEBAQcBDQETARkBHwElASsBMgE4AT4BRQFMAVIBWQFgAWcBbgF1AXwBgwGLAZIBmgGhAakBsQG5AcEByQHRAdkB4QHpAfIB+gIDAgwCFAIdAiYCLwI4AkECSwJUAl0CZwJxAnoChAKOApgCogKsArYCwQLLAtUC4ALrAvUDAAMLAxYDIQMtAzgDQwNPA1oDZgNyA34DigOWA6IDrgO6A8cD0wPgA+wD+QQGBBMEIAQtBDsESARVBGMEcQR+BIwEmgSoBLYExATTBOEE8AT+BQ0FHAUrBToFSQVYBWcF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", Dc = {
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
    maptype: "base",
    thumbnail: Mo,
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
    maptype: "base",
    url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
    maxZoom: 18,
    thumbnail: Po
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
    maptype: "base",
    url: "https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg",
    maxZoom: 18,
    thumbnail: Ro
  }
}, Cs = (i) => (i || "").match(/^(?:base|overlay|google(?:_(?:roadmap|satellite|hybrid|terrain))?|mapbox|maplibre|osm)$/);
async function Bc(i, t) {
  if (typeof i == "string" && (i = Dc[i]), i = te(Object.assign(i, t)), i.label = i.label || i.year, Cs(i.maptype)) {
    const e = i.maptype === "base" ? rn : i.maptype === "overlay" ? Dn : i.maptype === "mapbox" ? xn : i.maptype === "maplibre" ? Sn : ai;
    e.isBasemap() ? (i.homePosition = i.homePos, i.mercZoom = i.defZoom) : (i.homePosition || (i.homePosition = i.homePos), i.mercZoom || (i.mercZoom = i.defZoom)), delete i.homePos, delete i.defZoom, i.zoomRestriction && (i.maxZoom = i.maxZoom || i.mercMaxZoom, i.minZoom = i.minZoom || i.mercMinZoom), i.zoomRestriction = i.mercMaxZoom = i.mercMinZoom = void 0, i.translator && (i.url = i.translator(i.url)), i.imageExtension || (i.imageExtension = "jpg"), i.mapID && !i.url && !i.urls && (i.url = i.tms ? `tiles/${i.mapID}/{z}/{x}/{-y}.${i.imageExtension}` : `tiles/${i.mapID}/{z}/{x}/{y}.${i.imageExtension}`), i.weiwudi = await Vr(i), i.weiwudi && (i.url = i.weiwudi.url, delete i.urls);
    const n = await e.createAsync(i);
    return await n.initialWait, n;
  } else if (i.noload)
    return i.mercMaxZoom = i.mercMinZoom = void 0, new mr(i);
  return new Promise((e, n) => {
    const r = i.settingFile || `maps/${i.mapID}.json`, A = new XMLHttpRequest();
    A.open("GET", r, !0), A.responseType = "json", A.onload = async function(s) {
      if (this.status === 200 || this.status === 0)
        try {
          let o = this.response;
          if (typeof o != "object" && (o = JSON.parse(o)), i = te(Object.assign(o, i)), i.label = i.label || o.year, i.translator && (i.url = i.translator(i.url)), i.maptype || (i.maptype = "maplat"), Cs(i.maptype)) {
            const g = i.maptype === "base" ? rn : i.maptype === "overlay" ? Dn : i.maptype === "mapbox" ? xn : i.maptype === "maplibre" ? Sn : ai;
            g.isBasemap() ? (i.homePosition = i.homePos, i.mercZoom = i.defZoom) : (i.homePosition || (i.homePosition = i.homePos), i.mercZoom || (i.mercZoom = i.defZoom)), delete i.homePos, delete i.defZoom, i.zoomRestriction && (i.maxZoom = i.maxZoom || i.mercMaxZoom, i.minZoom = i.minZoom || i.mercMinZoom), i.zoomRestriction = i.mercMaxZoom = i.mercMinZoom = void 0;
            try {
              i.imageExtension || (i.imageExtension = "jpg"), i.mapID && !i.url && !i.urls && (i.url = i.tms ? `tiles/${i.mapID}/{z}/{x}/{-y}.${i.imageExtension}` : `tiles/${i.mapID}/{z}/{x}/{y}.${i.imageExtension}`), i.weiwudi = await Vr(i), i.weiwudi && (i.url = i.weiwudi.url, delete i.urls);
              const a = await g.createAsync(i);
              try {
                await a.initialWait, e(a);
              } catch {
                e(a);
              }
            } catch (a) {
              n(a);
            }
            return;
          }
          try {
            if (delete i.homePos, delete i.defZoom, i.imageExtension || (i.imageExtension = "jpg"), i.mapID && !i.url && !i.urls && (i.url = `tiles/${i.mapID}/{z}/{x}/{y}.${i.imageExtension}`), !i.compiled || !i.compiled.wh) {
              console.error(
                `[Maplat] Missing compiled.wh for mapID=${i.mapID}. Check map setting file: ${r}`
              ), n(new Error(`Map ${i.mapID} is missing compiled data.`));
              return;
            }
            i.width = i.width || i.compiled.wh[0], i.height = i.height || i.compiled.wh[1], i.weiwudi = await Vr(i), i.weiwudi && (i.url = i.weiwudi.url, delete i.urls);
            const g = await mr.createAsync(i);
            try {
              await g.initialWait, g.setupMapParameter(e);
            } catch {
              g.setupMapParameter(e);
            }
          } catch (g) {
            n(g);
          }
        } catch (o) {
          n(o);
        }
      else
        n("Fail to load map json");
    }, A.send();
  });
}
async function Vr(i) {
  const t = {};
  if (i.maptype === "mapbox" || i.maptype === "maplibre" || i.maptype === "google" || !i.enableCache) return;
  i.maptype === "base" || i.maptype === "overlay" ? t.type = "wmts" : t.type = "xyz", t.url = i.urls ? i.urls : i.url, t.width = i.width, t.height = i.height, t.maxZoom = i.maxZoom, t.minZoom = i.minZoom;
  const e = i.envelopeLngLats;
  if (e) {
    const r = e.reduce(
      (A, s) => (A[0] = A[0] > s[0] ? s[0] : A[0], A[1] = A[1] < s[0] ? s[0] : A[1], A[2] = A[2] > s[1] ? s[1] : A[2], A[3] = A[3] < s[1] ? s[1] : A[3], A),
      [1 / 0, -1 / 0, 1 / 0, -1 / 0]
    );
    ["minLng", "maxLng", "minLat", "maxLat"].map((A, s) => {
      t[A] = r[s];
    });
  }
  let n;
  try {
    n = await ae.registerMap(i.mapID, t);
  } catch {
  }
  return n;
}
function Yr(i, t) {
  return i + (Math.random() - 0.5) * t;
}
function Ci(i, t) {
  if (i instanceof Array)
    return i.map((n) => Ci(n, t));
  const e = Math.pow(10, t);
  return Math.round(i * e) / e;
}
const cs = {};
var hn = { exports: {} }, Kr, ls;
function xo() {
  if (ls) return Kr;
  ls = 1;
  var i = /<%=([\s\S]+?)%>/g;
  return Kr = i, Kr;
}
var Jr, us;
function Tc() {
  if (us) return Jr;
  us = 1;
  var i = xo(), t = "[object Null]", e = "[object Symbol]", n = "[object Undefined]", r = /[&<>"']/g, A = RegExp(r.source), s = /<%-([\s\S]+?)%>/g, o = /<%([\s\S]+?)%>/g, g = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }, a = typeof globalThis == "object" && globalThis && globalThis.Object === Object && globalThis, I = typeof self == "object" && self && self.Object === Object && self, C = a || I || Function("return this")();
  function c(w, z) {
    for (var _ = -1, it = w == null ? 0 : w.length, Y = Array(it); ++_ < it; )
      Y[_] = z(w[_], _, w);
    return Y;
  }
  function l(w) {
    return function(z) {
      return w == null ? void 0 : w[z];
    };
  }
  var h = l(g), u = Object.prototype, m = u.hasOwnProperty, p = u.toString, v = C.Symbol, D = v ? v.toStringTag : void 0, T = v ? v.prototype : void 0, U = T ? T.toString : void 0, W = {
    /**
     * Used to detect `data` property values to be HTML-escaped.
     *
     * @memberOf _.templateSettings
     * @type {RegExp}
     */
    escape: s,
    /**
     * Used to detect code to be evaluated.
     *
     * @memberOf _.templateSettings
     * @type {RegExp}
     */
    evaluate: o,
    /**
     * Used to detect `data` property values to inject.
     *
     * @memberOf _.templateSettings
     * @type {RegExp}
     */
    interpolate: i,
    /**
     * Used to reference the data object in the template text.
     *
     * @memberOf _.templateSettings
     * @type {string}
     */
    variable: "",
    /**
     * Used to import variables into the compiled template.
     *
     * @memberOf _.templateSettings
     * @type {Object}
     */
    imports: {
      /**
       * A reference to the `lodash` function.
       *
       * @memberOf _.templateSettings.imports
       * @type {Function}
       */
      _: { escape: b }
    }
  };
  function q(w) {
    return w == null ? w === void 0 ? n : t : D && D in Object(w) ? nt(w) : at(w);
  }
  function et(w) {
    if (typeof w == "string")
      return w;
    if (J(w))
      return c(w, et) + "";
    if (dt(w))
      return U ? U.call(w) : "";
    var z = w + "";
    return z == "0" && 1 / w == -1 / 0 ? "-0" : z;
  }
  function nt(w) {
    var z = m.call(w, D), _ = w[D];
    try {
      w[D] = void 0;
      var it = !0;
    } catch {
    }
    var Y = p.call(w);
    return it && (z ? w[D] = _ : delete w[D]), Y;
  }
  function at(w) {
    return p.call(w);
  }
  var J = Array.isArray;
  function rt(w) {
    return w != null && typeof w == "object";
  }
  function dt(w) {
    return typeof w == "symbol" || rt(w) && q(w) == e;
  }
  function ut(w) {
    return w == null ? "" : et(w);
  }
  function b(w) {
    return w = ut(w), w && A.test(w) ? w.replace(r, h) : w;
  }
  return Jr = W, Jr;
}
hn.exports;
var hs;
function jc() {
  return hs || (hs = 1, (function(i, t) {
    var e = xo(), n = Tc(), r = 800, A = 16, s = 9007199254740991, o = "[object Arguments]", g = "[object Array]", a = "[object AsyncFunction]", I = "[object Boolean]", C = "[object Date]", c = "[object DOMException]", l = "[object Error]", h = "[object Function]", u = "[object GeneratorFunction]", m = "[object Map]", p = "[object Number]", v = "[object Null]", D = "[object Object]", T = "[object Proxy]", U = "[object RegExp]", W = "[object Set]", q = "[object String]", et = "[object Symbol]", nt = "[object Undefined]", at = "[object WeakMap]", J = "[object ArrayBuffer]", rt = "[object DataView]", dt = "[object Float32Array]", ut = "[object Float64Array]", b = "[object Int8Array]", w = "[object Int16Array]", z = "[object Int32Array]", _ = "[object Uint8Array]", it = "[object Uint8ClampedArray]", Y = "[object Uint16Array]", lt = "[object Uint32Array]", we = /\b__p \+= '';/g, pt = /\b(__p \+=) '' \+/g, xt = /(__e\(.*?\)|\b__t\)) \+\n'';/g, Ge = /[\\^$.*+?()[\]{}|]/g, Ae = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, ce = /^\[object .+?Constructor\]$/, se = /^(?:0|[1-9]\d*)$/, Vt = /($^)/, oe = /['\n\r\u2028\u2029\\]/g, At = {};
    At[dt] = At[ut] = At[b] = At[w] = At[z] = At[_] = At[it] = At[Y] = At[lt] = !0, At[o] = At[g] = At[J] = At[I] = At[rt] = At[C] = At[l] = At[h] = At[m] = At[p] = At[D] = At[U] = At[W] = At[q] = At[at] = !1;
    var Ee = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    }, Me = typeof globalThis == "object" && globalThis && globalThis.Object === Object && globalThis, Xe = typeof self == "object" && self && self.Object === Object && self, gn = Me || Xe || Function("return this")(), Gn = t && !t.nodeType && t, le = Gn && !0 && i && !i.nodeType && i, Xn = le && le.exports === Gn, an = Xn && Me.process, Zn = (function() {
      try {
        var f = le && le.require && le.require("util").types;
        return f || an && an.binding && an.binding("util");
      } catch {
      }
    })(), Fn = Zn && Zn.isTypedArray;
    function Un(f, E, S) {
      switch (S.length) {
        case 0:
          return f.call(E);
        case 1:
          return f.call(E, S[0]);
        case 2:
          return f.call(E, S[0], S[1]);
        case 3:
          return f.call(E, S[0], S[1], S[2]);
      }
      return f.apply(E, S);
    }
    function zn(f, E) {
      for (var S = -1, K = f == null ? 0 : f.length, ot = Array(K); ++S < K; )
        ot[S] = E(f[S], S, f);
      return ot;
    }
    function Nt(f, E) {
      for (var S = -1, K = Array(f); ++S < f; )
        K[S] = E(S);
      return K;
    }
    function xr(f) {
      return function(E) {
        return f(E);
      };
    }
    function d(f, E) {
      return zn(E, function(S) {
        return f[S];
      });
    }
    function y(f) {
      return "\\" + Ee[f];
    }
    function P(f, E) {
      return f == null ? void 0 : f[E];
    }
    function R(f, E) {
      return function(S) {
        return f(E(S));
      };
    }
    var G = Function.prototype, O = Object.prototype, k = gn["__core-js_shared__"], Z = G.toString, j = O.hasOwnProperty, F = (function() {
      var f = /[^.]+$/.exec(k && k.keys && k.keys.IE_PROTO || "");
      return f ? "Symbol(src)_1." + f : "";
    })(), H = O.toString, B = Z.call(Object), N = RegExp(
      "^" + Z.call(j).replace(Ge, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ), Q = Xn ? gn.Buffer : void 0, $ = gn.Symbol, X = R(Object.getPrototypeOf, Object), L = O.propertyIsEnumerable, x = $ ? $.toStringTag : void 0, V = (function() {
      try {
        var f = No(Object, "defineProperty");
        return f({}, "", {}), f;
      } catch {
      }
    })(), st = Q ? Q.isBuffer : void 0, gt = R(Object.keys, Object), ct = Math.max, tt = Date.now, Ct = $ ? $.prototype : void 0, mt = Ct ? Ct.toString : void 0;
    function Tt(f, E) {
      var S = zi(f), K = !S && Wo(f), ot = !S && !K && Vo(f), yt = !S && !K && !ot && Jo(f), Zt = S || K || ot || yt, ft = Zt ? Nt(f.length, String) : [], Kt = ft.length;
      for (var Ft in f)
        (E || j.call(f, Ft)) && !(Zt && // Safari 9 has enumerable `arguments.length` in strict mode.
        (Ft == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        ot && (Ft == "offset" || Ft == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        yt && (Ft == "buffer" || Ft == "byteLength" || Ft == "byteOffset") || // Skip index properties.
        Zi(Ft, Kt))) && ft.push(Ft);
      return ft;
    }
    function Gt(f, E, S) {
      var K = f[E];
      (!(j.call(f, E) && Br(K, S)) || S === void 0 && !(E in f)) && jt(f, E, S);
    }
    function jt(f, E, S) {
      E == "__proto__" && V ? V(f, E, {
        configurable: !0,
        enumerable: !0,
        value: S,
        writable: !0
      }) : f[E] = S;
    }
    function bt(f) {
      return f == null ? f === void 0 ? nt : v : x && x in Object(f) ? Go(f) : Fo(f);
    }
    function Yt(f) {
      return Ze(f) && bt(f) == o;
    }
    function Pe(f) {
      if (!Hn(f) || Xo(f))
        return !1;
      var E = Qi(f) ? N : ce;
      return E.test(Qo(f));
    }
    function Sr(f) {
      return Ze(f) && Wi(f.length) && !!At[bt(f)];
    }
    function Or(f) {
      if (!Ui(f))
        return gt(f);
      var E = [];
      for (var S in Object(f))
        j.call(f, S) && S != "constructor" && E.push(S);
      return E;
    }
    function Dr(f) {
      if (!Hn(f))
        return Zo(f);
      var E = Ui(f), S = [];
      for (var K in f)
        K == "constructor" && (E || !j.call(f, K)) || S.push(K);
      return S;
    }
    function Ni(f, E) {
      return zo(Uo(f, E, Yi), f + "");
    }
    var jo = V ? function(f, E) {
      return V(f, "toString", {
        configurable: !0,
        enumerable: !1,
        value: ng(E),
        writable: !0
      });
    } : Yi;
    function Gi(f) {
      if (typeof f == "string")
        return f;
      if (zi(f))
        return zn(f, Gi) + "";
      if (Ko(f))
        return mt ? mt.call(f) : "";
      var E = f + "";
      return E == "0" && 1 / f == -1 / 0 ? "-0" : E;
    }
    function Lo(f, E, S, K) {
      var ot = !S;
      S || (S = {});
      for (var yt = -1, Zt = E.length; ++yt < Zt; ) {
        var ft = E[yt], Kt = K ? K(S[ft], f[ft], ft, S, f) : void 0;
        Kt === void 0 && (Kt = f[ft]), ot ? jt(S, ft, Kt) : Gt(S, ft, Kt);
      }
      return S;
    }
    function ko(f) {
      return Ni(function(E, S) {
        var K = -1, ot = S.length, yt = ot > 1 ? S[ot - 1] : void 0, Zt = ot > 2 ? S[2] : void 0;
        for (yt = f.length > 3 && typeof yt == "function" ? (ot--, yt) : void 0, Zt && Fi(S[0], S[1], Zt) && (yt = ot < 3 ? void 0 : yt, ot = 1), E = Object(E); ++K < ot; ) {
          var ft = S[K];
          ft && f(E, ft, K, yt);
        }
        return E;
      });
    }
    function Xi(f, E, S, K) {
      return f === void 0 || Br(f, O[S]) && !j.call(K, S) ? E : f;
    }
    function No(f, E) {
      var S = P(f, E);
      return Pe(S) ? S : void 0;
    }
    function Go(f) {
      var E = j.call(f, x), S = f[x];
      try {
        f[x] = void 0;
        var K = !0;
      } catch {
      }
      var ot = H.call(f);
      return K && (E ? f[x] = S : delete f[x]), ot;
    }
    function Zi(f, E) {
      var S = typeof f;
      return E = E ?? s, !!E && (S == "number" || S != "symbol" && se.test(f)) && f > -1 && f % 1 == 0 && f < E;
    }
    function Fi(f, E, S) {
      if (!Hn(S))
        return !1;
      var K = typeof E;
      return (K == "number" ? Tr(S) && Zi(E, S.length) : K == "string" && E in S) ? Br(S[E], f) : !1;
    }
    function Xo(f) {
      return !!F && F in f;
    }
    function Ui(f) {
      var E = f && f.constructor, S = typeof E == "function" && E.prototype || O;
      return f === S;
    }
    function Zo(f) {
      var E = [];
      if (f != null)
        for (var S in Object(f))
          E.push(S);
      return E;
    }
    function Fo(f) {
      return H.call(f);
    }
    function Uo(f, E, S) {
      return E = ct(E === void 0 ? f.length - 1 : E, 0), function() {
        for (var K = arguments, ot = -1, yt = ct(K.length - E, 0), Zt = Array(yt); ++ot < yt; )
          Zt[ot] = K[E + ot];
        ot = -1;
        for (var ft = Array(E + 1); ++ot < E; )
          ft[ot] = K[ot];
        return ft[E] = S(Zt), Un(f, this, ft);
      };
    }
    var zo = Ho(jo);
    function Ho(f) {
      var E = 0, S = 0;
      return function() {
        var K = tt(), ot = A - (K - S);
        if (S = K, ot > 0) {
          if (++E >= r)
            return arguments[0];
        } else
          E = 0;
        return f.apply(void 0, arguments);
      };
    }
    function Qo(f) {
      if (f != null) {
        try {
          return Z.call(f);
        } catch {
        }
        try {
          return f + "";
        } catch {
        }
      }
      return "";
    }
    function Br(f, E) {
      return f === E || f !== f && E !== E;
    }
    var Wo = Yt(/* @__PURE__ */ (function() {
      return arguments;
    })()) ? Yt : function(f) {
      return Ze(f) && j.call(f, "callee") && !L.call(f, "callee");
    }, zi = Array.isArray;
    function Tr(f) {
      return f != null && Wi(f.length) && !Qi(f);
    }
    var Vo = st || rg;
    function Hi(f) {
      if (!Ze(f))
        return !1;
      var E = bt(f);
      return E == l || E == c || typeof f.message == "string" && typeof f.name == "string" && !Yo(f);
    }
    function Qi(f) {
      if (!Hn(f))
        return !1;
      var E = bt(f);
      return E == h || E == u || E == a || E == T;
    }
    function Wi(f) {
      return typeof f == "number" && f > -1 && f % 1 == 0 && f <= s;
    }
    function Hn(f) {
      var E = typeof f;
      return f != null && (E == "object" || E == "function");
    }
    function Ze(f) {
      return f != null && typeof f == "object";
    }
    function Yo(f) {
      if (!Ze(f) || bt(f) != D)
        return !1;
      var E = X(f);
      if (E === null)
        return !0;
      var S = j.call(E, "constructor") && E.constructor;
      return typeof S == "function" && S instanceof S && Z.call(S) == B;
    }
    function Ko(f) {
      return typeof f == "symbol" || Ze(f) && bt(f) == et;
    }
    var Jo = Fn ? xr(Fn) : Sr;
    function qo(f) {
      return f == null ? "" : Gi(f);
    }
    var Vi = ko(function(f, E, S, K) {
      Lo(E, $o(E), f, K);
    });
    function _o(f) {
      return Tr(f) ? Tt(f) : Or(f);
    }
    function $o(f) {
      return Tr(f) ? Tt(f, !0) : Dr(f);
    }
    function tg(f, E, S) {
      var K = n.imports._.templateSettings || n;
      S && Fi(f, E, S) && (E = void 0), f = qo(f), E = Vi({}, E, K, Xi);
      var ot = Vi({}, E.imports, K.imports, Xi), yt = _o(ot), Zt = d(ot, yt), ft, Kt, Ft = 0, Ki = E.interpolate || Vt, Lt = "__p += '", ig = RegExp(
        (E.escape || Vt).source + "|" + Ki.source + "|" + (Ki === e ? Ae : Vt).source + "|" + (E.evaluate || Vt).source + "|$",
        "g"
      ), Ag = j.call(E, "sourceURL") ? "//# sourceURL=" + (E.sourceURL + "").replace(/[\r\n]/g, " ") + `
` : "";
      f.replace(ig, function(Ji, qi, Wn, sg, _i, $i) {
        return Wn || (Wn = sg), Lt += f.slice(Ft, $i).replace(oe, y), qi && (ft = !0, Lt += `' +
__e(` + qi + `) +
'`), _i && (Kt = !0, Lt += `';
` + _i + `;
__p += '`), Wn && (Lt += `' +
((__t = (` + Wn + `)) == null ? '' : __t) +
'`), Ft = $i + Ji.length, Ji;
      }), Lt += `';
`;
      var jr = j.call(E, "variable") && E.variable;
      jr || (Lt = `with (obj) {
` + Lt + `
}
`), Lt = (Kt ? Lt.replace(we, "") : Lt).replace(pt, "$1").replace(xt, "$1;"), Lt = "function(" + (jr || "obj") + `) {
` + (jr ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (ft ? ", __e = _.escape" : "") + (Kt ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + Lt + `return __p
}`;
      var Qn = eg(function() {
        return Function(yt, Ag + "return " + Lt).apply(void 0, Zt);
      });
      if (Qn.source = Lt, Hi(Qn))
        throw Qn;
      return Qn;
    }
    var eg = Ni(function(f, E) {
      try {
        return Un(f, void 0, E);
      } catch (S) {
        return Hi(S) ? S : new Error(S);
      }
    });
    function ng(f) {
      return function() {
        return f;
      };
    }
    function Yi(f) {
      return f;
    }
    function rg() {
      return !1;
    }
    i.exports = tg;
  })(hn, hn.exports)), hn.exports;
}
var Lc = jc();
const So = /* @__PURE__ */ Ls(Lc);
function Oo(i) {
  var n;
  if (!i.type || i.type !== "Feature")
    return i;
  const t = i;
  return {
    ...t.properties,
    id: t.id,
    lnglat: t.geometry.coordinates,
    namespaceID: (n = t.properties) == null ? void 0 : n.namespaceID
  };
}
function fs(i, ...t) {
  const e = Oo(i), n = te(Object.assign({}, e));
  if (n.icon) return n;
  const r = t.reduce((A, s) => {
    if (A) return A;
    const o = s.iconTemplate;
    if (o)
      return JSON.parse(So(o)(n));
    if (s.icon)
      return {
        icon: s.icon,
        selectedIcon: s.selectedIcon
      };
  }, void 0);
  return r && (n.icon = r.icon, n.selectedIcon = r.selectedIcon), n;
}
function ds(i, ...t) {
  const e = Oo(i), n = te(e);
  return n.html ? n : t.reduce((r, A) => {
    if (r) return r;
    const s = A.poiTemplate;
    if (s)
      return n.html = So(s)(n), n.poiStyle = n.poiStyle || A.poiStyle, n;
  }, void 0) || n;
}
const wt = {
  ACCURACY: "accuracy",
  ALTITUDE: "altitude",
  ALTITUDE_ACCURACY: "altitudeAccuracy",
  HEADING: "heading",
  POSITION: "position",
  SPEED: "speed",
  TRACKING: "tracking",
  TRACKING_OPTIONS: "trackingOptions"
}, kc = {
  ERROR: "error"
};
class Nc extends Ce {
  constructor(e) {
    super(kc.ERROR);
    M(this, "code");
    M(this, "message");
    this.code = e.code, this.message = e.message;
  }
}
class Gc extends An {
  constructor(e) {
    super();
    M(this, "task_id_");
    M(this, "timer_base_", !1);
    M(this, "home_position_", !1);
    e = e || {}, this.timer_base_ = e.timerBase !== void 0 ? e.timerBase : !1, this.task_id_ = void 0, this.home_position_ = e.homePosition !== void 0 ? e.homePosition : !1, this.addChangeListener(wt.TRACKING, this.handleTrackingChanged_), e.trackingOptions !== void 0 ? this.setTrackingOptions(e.trackingOptions) : this.setTrackingOptions({
      enableHighAccuracy: !0,
      timeout: 5e3,
      maximumAge: 1e3
    }), this.setTracking(e.tracking !== void 0 ? e.tracking : !1);
  }
  disposeInternal() {
    this.setTracking(!1), super.disposeInternal();
  }
  handleTrackingChanged_() {
    if (this.timer_base_) {
      const e = this.getTracking(), n = this.getTrackingOptions();
      e && this.task_id_ === void 0 ? window.confirm("Allow GPS?") ? this.task_id_ = setInterval(this.timerPositionChange_.bind(this), n.maximumAge) : setTimeout(this.timerPositionError_.bind(this), n.maximumAge * 10) : !e && this.task_id_ !== void 0 && (clearInterval(this.task_id_), this.task_id_ = void 0);
    } else if ("geolocation" in navigator) {
      const e = this.getTracking();
      e && this.task_id_ === void 0 ? this.task_id_ = navigator.geolocation.watchPosition(
        this.positionChange_.bind(this),
        this.positionError_.bind(this),
        this.getTrackingOptions()
      ) : !e && this.task_id_ !== void 0 && (navigator.geolocation.clearWatch(this.task_id_), this.task_id_ = void 0);
    }
  }
  timerPositionChange_() {
    const e = {
      longitude: Yr(this.home_position_[0], 0.05),
      latitude: Yr(this.home_position_[1], 0.05),
      accuracy: Yr(15, 10)
    };
    this.positionChange_({ coords: e });
  }
  positionChange_(e) {
    const n = e.coords;
    this.set(wt.ACCURACY, n.accuracy), this.set(
      wt.ALTITUDE,
      n.altitude === null ? void 0 : n.altitude
    ), this.set(
      wt.ALTITUDE_ACCURACY,
      n.altitudeAccuracy === null ? void 0 : n.altitudeAccuracy
    ), this.set(
      wt.HEADING,
      n.heading === null ? void 0 : qe(n.heading)
    ), this.set(wt.POSITION, [n.longitude, n.latitude]), this.set(wt.SPEED, n.speed === null ? void 0 : n.speed), this.changed();
  }
  timerPositionError_() {
    const e = Math.floor(Math.random() * 3) + 1, n = {
      code: e,
      message: e === 1 ? "User denied Geolocation" : e === 2 ? "Position unavailable" : "Timeout expired"
    };
    this.positionError_(n);
  }
  positionError_(e) {
    const n = new Nc(e);
    this.dispatchEvent(n);
  }
  getAccuracy() {
    return this.get(wt.ACCURACY);
  }
  getAltitude() {
    return this.get(wt.ALTITUDE);
  }
  getAltitudeAccuracy() {
    return this.get(wt.ALTITUDE_ACCURACY);
  }
  getHeading() {
    return this.get(wt.HEADING);
  }
  getPosition() {
    return this.get(wt.POSITION);
  }
  getSpeed() {
    return this.get(wt.SPEED);
  }
  getTracking() {
    return this.get(wt.TRACKING);
  }
  getTrackingOptions() {
    return this.get(wt.TRACKING_OPTIONS);
  }
  setTracking(e) {
    this.set(wt.TRACKING, e);
  }
  setTrackingOptions(e) {
    this.set(wt.TRACKING_OPTIONS, e);
  }
}
const Do = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjcyNTIxMjZFMDJBMTExRTBCOTNGRTVBRkM1QzM1Qjc5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjcyNTIxMjZGMDJBMTExRTBCOTNGRTVBRkM1QzM1Qjc5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzI1MjEyNkMwMkExMTFFMEI5M0ZFNUFGQzVDMzVCNzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzI1MjEyNkQwMkExMTFFMEI5M0ZFNUFGQzVDMzVCNzkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4RaveOAAAB1UlEQVR42qzUTyikcRzH8d+OsUNbSOTvgW2LREqjHKSk9FjZxAGXlXJQDsqNokRzcebiRC5mT8tllBE7LlzYKBHFJpKMkD+7hvH+6ftMT4M0Y3/1uswzz+d5nu/3+/t9CAaD6n8uu/L5lHK5XroWjwI4kYWP8GMdv3H47A6nk8CDA6U8nvBLX/Ed+TjDEe7lAS24wE+M4zR0180NgXa7NSgOvajHKvqwZglMxBfUoBmVlv/wTXxU0O1WuoqIgQvLaIJDfn9NISbhRd7Tb4ahbJa3a0QthjCFv2/UfwNduJKv0jUOBSajDb8wE0FTdf1GUAzDGliOdExEMSleedsGxJiBZdiVC5GuABbxGZm2p1lUKg1/dOOjnGf9IglIsUkxY3H+jg1yIc136MBb6WjqOwLNe6904AP2kSuDG80qkW15YjZlCdkojSLsEyqwiWMzcAVbaJV6RrK+IQc/dB3NwGuMohAdEYQVoROz8FkHW68FCW1Hv4zS68eeUnWyS/YwLL1Q9rA/jsn4dEtd5mRo9WlzJ03Tda6S7TaPQWmIPCkQCH+6Ww5RfR5WowmX+IckOca2MYBp2SmW8zCb5hpGeKjuWA8yZEulSbP8sqN2JPjZif0owACin4C7wCjG6AAAAABJRU5ErkJggg==", Bo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAwCAYAAAALiLqjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAHkUlEQVR42oyWa6hdRxXHf2tm9j77PHLuq2kak+bRmlKbhpi0FBsqiBRaBJUqFEqlIq2I3xUEafGDilgfn0QQtEWwxS9+0SoVSwsVX8TU2kdsWpM0pm1y0/s+955z9p5Zyw/7pM3t65yBYTPDrPXf/7X+s9bIdGOGiyMhTMchNxc5L053CVXs3qKrn6CR3XrANQ7PrpybrbzzC1t3Lx7rLT+/NoiPr7Rnn2yFsLBw7jynVbm+sQWQt3wG3jFMYB3HDtE77vJLX7u9Wd4869ZkmGDYgVIT1dpJPuP42HLT3/eU2rFn2fqDs+YeVRQB7BJ/QS9ZRYyhke2z4Te+Kr37rymGWVXCcAOSgGtABtgQBg4aJG4La4f39weP9MTfMG/+/gR9fwmA39Fu0wpCEWBbs8WtOvz2A93eA7vz5NdWoVwKqGyBWCC9iHrDGpAiDBR6CVooH23EI8OS6XnX/r1IzcIAv7PdIXeCieNwIfc92F77/lymrK4B/Tb+wCHCLUfw+/YhFuDcAuQJ8xAVKoP1BMHDwUxv+pdlvaeD++u8GG84w7ezjA1NhCru/Lpb+9nBUM0tRZA1wV/5YcKdd5B/8R7CTTdiWiEn/4etLKFN0AilwNCgV8FcDlul2v90yh/ru2zBi+CWBwMWyorrm+5zR0K5b7ECM8AcMjuDv+5awqHD+MM34PddA1PTkKTWiYBYrRkTWKrgQEg7Pt7wd/sUcdUQt1QO6ZfD5qebclflaroJwCmsrWH/PYm9/BLpxEvo6dP1nhhmozhLPVVgmCAp3Mb653u9pe58b5Uwk7eZJu7ZN1w6uA7EBCEDaxrp1ZPIb/+AnTmDVZH0zHPY+bPQhmT1VAEFTGulDRR2uPVrrpqa27/o87+FmW6ncbnF7UNfZcOoKBBLiAWgPTj6d9ILLwKG9VdJzZKYQRxCCZRWJxupQxUNYnBud9HeW7j8dLBmq0kqW1VC+tTaCgauBGuB5gNkOMAEmK7DN6xgAAwVBlIDIeAM1MAQaTpfdEPWCK+t9ntQrqRCrbT6DzCwBNkAcg+uGJUShSpBqbBBPUutw+RHdpkDb2YXynJ5vmItlP21OG/xlOVhxYhzpdZ/ET3kBnkEN7qVCgxHYRmOQIajehOk1kVDYbXSjVOD1eMrPl9wlOtsqJ092rnij61QexkqrCusGSwDq5fMnkEP6MnIuUDuwEdoJOgIHLf2sQv9wSvrq0v4DxVNcu9Z7g+Gt/p0ZzeaG1RQyegSUV+kvkGf+luO5BmAQsGXUESYA1aa2I9l6pu9ovvsTKuNb7WnkZAx7/IzUw134ydDuU/XBaJgcaQMqSWYRmHKgDxBUUGjglwzptRxWaH82hVPP6HFtwqx0mP4RmcKdZ7oXHzdF8e3p+r2AxqnC9cka3RoqFBUUFRKUUK7gnYlFDHQylp0ujPMZAWX2QZPey48nDpfiSKvNFTJVAmzZclInWjlnvlJGb5UBh75LOUV3fY0/ZntpODRskJThXiPz3Jc0STLM9qLy2Svn+Z3Li0+GLN7K+HPMxbfLtc7Q0FmRm6GqLIR0+ljvnhqo5sf2ttb2LFNAzMz0+Tbt9PatZfujl205maYS0rz3DkuzJ/iN7l//rul+8Ip5U/bfLapgQW9dCVCBqi4fz7W7H7qNHrP4Wrh3gMn3tx1tcs7a1MFzjm6vchzabD+iqteezwvfvl6Z/YXtvHmG6GuYpsB3tUyAQ80TN+8kBU/eijx0/PD8tq7d84+9Kkj+w+qc/z8L8//+1dn17/8kW54QX2+7kzxmzrx28PxASM3o6HaXyoazxy97tDLN37vYW764aMcPXzLicX2ln80kq43zJD3dP0+DGoahsMYYFStabbkJp1+r0N/AzGjs7Ha2dKdknUKS+WQwhQxex8AkU05EBGqosGiazAfcvri8VUfQg6zM1iWgTiyFHm12SWESMeU9e4WZHkVk81sQn/bzLuSYA76CLg6rkmEKsvRRgNEiAgpKaRIRFgUj+tOM9XpsvROBubeO37yjsXFVwKmmGrdV+veirPN5zYDvE/sNpMyVFPtGFDTulW+lwTflYMJAMQMU6OK9VlTq5M6gW3AlPEUDDNFUxotL4ZovG1Qk7GH1AQziHoRoN6bxDbIeJaI1WEpy+qSENX74wEmOFWfMcqY3sqmiDGJbUgTJCqZkZKRhnUHSmr13iRJvii9D06CopaIWtd5TQlUmcQ2IH48gPOYCVWM4KwuBy4wiW1wjKfpAIdSVRHEcKY46oI4XqZpPE1NSkpKVVUwqkM6muMBmCAF1A/dOHKYDK8gyngKAUkTXISEkYhlHIk0JSTZJLZBzU9QKTxJHWWMozeqw8wziW0QnazYSVKqEQNJdQebxDaImwDAGTglXXzvOEWcMYltMB1fsEwdmoRUpZGqBFPHJLYBJxNcNAGHxpRqSQlqTrAJbMOF82+MPVTFyJ49V4WyTIgDw8LChfOEECYodjqBTKGLsK3fH+CcgHE50FXVlbEAO3dsHyNRwznZtXfPlbtOnHiJVFVcvnV2z1VX794FPDcWIG8UkwD8xzm7/+D+3Q8sLCyEJ584853gs+POubHU/z8AvZAksib10AQAAAAASUVORK5CYII=", Xc = {
  osm: Mo,
  gsi: Po,
  gsi_ortho: Ro,
  redcircle: Do,
  defaultpin_selected: Bo,
  defaultpin: Bi,
  bluedot: Co,
  bluedot_transparent: co,
  bluedot_small: lo
};
class Zc extends Ce {
  constructor(e) {
    super("gps_error");
    M(this, "detail");
    this.detail = e;
  }
}
class sr extends Ce {
  constructor(e) {
    super("gps_result");
    M(this, "detail");
    this.detail = e;
  }
}
class Fc extends Ce {
  constructor() {
    super("gps_request");
  }
}
class Bn extends Hs {
  // Maplat App Class
  constructor(e) {
    super();
    M(this, "appid");
    M(this, "translateUI", !1);
    M(this, "noRotate", !1);
    M(this, "initialRestore", {});
    M(this, "mapDiv", "map_div");
    M(this, "restoreSession", !1);
    M(this, "enableCache");
    M(this, "stateBuffer", {});
    M(this, "mobileMapMoveBuffer");
    M(this, "overlay", !0);
    M(this, "waitReady");
    M(this, "changeMapSeq");
    M(this, "i18n");
    M(this, "t");
    M(this, "lang");
    M(this, "appData");
    M(this, "appLang", "ja");
    M(this, "backMap");
    M(this, "mercSrc");
    M(this, "mercBuffer");
    M(this, "timer");
    M(this, "appName");
    M(this, "cacheHash");
    M(this, "currentPosition");
    M(this, "startFrom", "");
    M(this, "from");
    M(this, "vectors", []);
    M(this, "mapDivDocument");
    M(this, "mapObject");
    M(this, "mapboxMap");
    M(this, "maplibreMap");
    M(this, "googleApiKey");
    M(this, "pois");
    M(this, "poiTemplate");
    M(this, "poiStyle");
    M(this, "iconTemplate");
    M(this, "logger");
    M(this, "icon");
    M(this, "selectedIcon");
    M(this, "fakeGps", !1);
    M(this, "fakeRadius");
    M(this, "homePosition");
    M(this, "geolocation");
    M(this, "moveTo_", !1);
    M(this, "gpsEnabled_", !1);
    M(this, "alwaysGpsOn", !1);
    M(this, "firstGpsRequest_", !1);
    M(this, "__backMapMoving", !1);
    M(this, "__selectedMarker");
    M(this, "__init", !0);
    M(this, "__redrawMarkerBlock", !1);
    M(this, "__redrawMarkerThrottle", []);
    M(this, "__transparency");
    M(this, "lastClickEvent");
    e = te(e), this.appid = e.appid || "sample";
    const n = e.mapboxgl || (typeof window < "u" ? window.mapboxgl : void 0);
    n && e.mapboxToken && (n.accessToken = e.mapboxToken), e.googleApiKey && (this.googleApiKey = e.googleApiKey), this.mapDiv = e.div || "map_div", this.mapDivDocument = document.querySelector(`#${this.mapDiv}`), this.mapDivDocument.classList.add("maplat"), this.logger = new ca(
      e.debug ? fn.ALL : fn.INFO
    ), this.enableCache = e.enableCache || !1, this.icon = e.icon, this.selectedIcon = e.selectedIcon, this.translateUI = e.translateUI;
    const r = e.setting;
    if (this.lang = e.lang, this.lang || (this.lang = Ia()), (this.lang.toLowerCase() == "zh-hk" || this.lang.toLowerCase() == "zh-hant") && (this.lang = "zh-TW"), e.restore)
      e.restoreSession && (this.restoreSession = !0), this.initialRestore = e.restore;
    else if (e.restoreSession) {
      this.restoreSession = !0;
      const o = parseInt(localStorage.getItem("epoch") || "0"), g = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
      o && g - o < 3600 && (this.initialRestore.mapID = localStorage.getItem("mapID") || localStorage.getItem("sourceID") || void 0, this.initialRestore.backgroundID = localStorage.getItem("backgroundID") || localStorage.getItem("backID") || void 0, this.initialRestore.position = {
        x: parseFloat(localStorage.getItem("x") || "0"),
        y: parseFloat(localStorage.getItem("y") || "0"),
        zoom: parseFloat(localStorage.getItem("zoom") || "0"),
        rotation: parseFloat(localStorage.getItem("rotation") || "0")
      }, this.initialRestore.transparency = parseFloat(
        localStorage.getItem("transparency") || "0"
      ), this.initialRestore.hideMarker = parseInt(
        localStorage.getItem("hideMarker") || "0"
      ), this.initialRestore.hideLayer = localStorage.getItem("hideLayer") || void 0);
    }
    const A = Cn(`<img id="center_circle" class="prevent-default" alt=""
            style="position:absolute;top:50%;left:50%;margin-top:-10px;
            margin-left:-10px;" src="${Do}">`);
    for (let o = A.length - 1; o >= 0; o--)
      this.mapDivDocument.insertBefore(
        A[o],
        this.mapDivDocument.firstChild
      );
    const s = this.mapDivDocument.querySelectorAll(".prevent-default");
    for (let o = 0; o < s.length; o++)
      s[o].addEventListener("touchstart", (a) => {
        a.preventDefault();
      });
    this.overlay = "overlay" in e ? e.overlay : !0, this.overlay && this.mapDivDocument.classList.add("with-opacity"), this.waitReady = this.settingLoader(r).then(
      (o) => this.handleSetting(o, e)
    );
  }
  // Async initializers 1: Load application setting
  async settingLoader(e) {
    return e || new Promise((n, r) => {
      const A = new XMLHttpRequest();
      A.open("GET", `apps/${this.appid}.json`, !0), A.responseType = "json", A.onload = function(s) {
        let o = this.response;
        typeof o != "object" && (o = JSON.parse(o)), n(o);
      }, A.send();
    });
  }
  // Async initializers 3: Load i18n setting
  async i18nLoader() {
    return new Promise((e, n) => {
      const r = Object.keys(cs).length != 0;
      (this.translateUI && !r ? Pt.use(xs) : Pt).init(
        {
          lng: this.lang,
          fallbackLng: ["en"],
          backend: {
            loadPath: "assets/locales/{{lng}}/{{ns}}.json"
          },
          resources: r ? cs : void 0
        },
        (s, o) => {
          e([o, Pt]);
        }
      );
    });
  }
  // Async initializer 6: Load pois setting => move to normalize_pois.js
  // Async initializer 8: Load sources setting asynchronous
  async sourcesLoader(e) {
    const n = this.appData.sources, r = [], A = {
      //homePosition: mapReturnValue.homePos,
      //mercZoom: mapReturnValue.defZoom,
      homePos: e.homePos,
      defZoom: e.defZoom,
      zoomRestriction: e.zoomRestriction,
      mercMinZoom: e.mercMinZoom,
      mercMaxZoom: e.mercMaxZoom,
      enableCache: this.enableCache,
      key: this.googleApiKey,
      translator: (s) => this.translate(s),
      mapboxMap: this.mapboxMap,
      // Pass mapbox map instance
      maplibreMap: this.maplibreMap
      // Pass maplibre map instance
    };
    for (let s = 0; s < n.length; s++) {
      const o = n[s];
      r.push(Bc(o, A));
    }
    return Promise.all(r);
  }
  // Async initializers 2: Handle application setting
  handleSetting(e, n) {
    return this.appData = te(e), !this.lang && this.appData.lang && (this.lang = this.appData.lang), this.i18nLoader().then((r) => this.handleI18n(r, n)).then(() => this.initGeolocation(n));
  }
  // Async Initializers 2.5: For geolocation settings
  initGeolocation(e) {
    this.alwaysGpsOn = e.alwaysGpsOn || !1;
    const n = this.geolocation = new Gc({
      timerBase: e.fake,
      homePosition: this.appData.homePosition
    });
    this.alwaysGpsOn ? (n.setTracking(!0), this.gpsEnabled_ = !0) : (n.setTracking(!1), this.gpsEnabled_ = !1), n.on("change", () => {
      const r = this.mapObject, A = r.getLayer("overlay").getLayers().item(0), s = r.getLayers().item(0), o = A ? A.getSource() : s.getSource(), g = n.getPosition(), a = n.getAccuracy();
      !g || !a || o.setGPSMarkerAsync({ lnglat: g, acc: a }, !this.moveTo_ && !this.firstGpsRequest_).then((I) => {
        if (this.moveTo_ = !1, this.firstGpsRequest_ = !1, !I) {
          if (!this.alwaysGpsOn) {
            this.handleGPS(!1, !1);
            return;
          }
          o.setGPSMarker();
        }
        this.dispatchEvent(new sr(I ? { lnglat: g, acc: a } : { error: "gps_out" }));
      });
    }), n.on("error", (r) => {
      const A = r.code;
      if (A === 3) return;
      n.setTracking(!1), this.gpsEnabled_ = !1;
      const s = this.mapObject, o = s.getLayer("overlay").getLayers().item(0), g = s.getLayers().item(0);
      (o ? o.getSource() : g.getSource()).setGPSMarker(), this.dispatchEvent(new Zc(A === 1 ? "user_gps_deny" : A === 2 ? "gps_miss" : "gps_timeout")), this.dispatchEvent(new sr({ error: "gps_off" }));
    }), this.addEventListener("mapChanged", () => {
      if (n.getTracking()) {
        const r = this.mapObject, A = r.getLayer("overlay").getLayers().item(0), s = r.getLayers().item(0), o = A ? A.getSource() : s.getSource(), g = n.getPosition(), a = n.getAccuracy();
        if (!g || !a) return;
        o.setGPSMarkerAsync({ lnglat: g, acc: a }, !0).then((I) => {
          if (!I) {
            if (!this.alwaysGpsOn) {
              this.handleGPS(!1, !1);
              return;
            }
            o.setGPSMarker();
          }
          this.dispatchEvent(new sr(I ? { lnglat: g, acc: a } : { error: "gps_out" }));
        });
      }
    });
  }
  // GPS handling methods
  handleGPS(e, n = !1) {
    if (this.geolocation) {
      if (e)
        if (!this.alwaysGpsOn)
          this.firstGpsRequest_ = !0, this.geolocation.setTracking(!0), this.gpsEnabled_ = !0, this.dispatchEvent(new Fc());
        else {
          this.moveTo_ = !0;
          const r = this.geolocation.getPosition(), A = this.geolocation.getAccuracy();
          if (r && A) {
            const s = this.mapObject, o = s.getLayer("overlay").getLayers().item(0), g = s.getLayers().item(0), a = o ? o.getSource() : g.getSource();
            a.setGPSMarkerAsync({ lnglat: r, acc: A }, !1).then((I) => {
              I || a.setGPSMarker();
            });
          }
        }
      else if (!this.alwaysGpsOn) {
        this.geolocation.setTracking(!1), this.gpsEnabled_ = !1;
        const r = this.mapObject, A = r.getLayer("overlay").getLayers().item(0), s = r.getLayers().item(0);
        (A ? A.getSource() : s.getSource()).setGPSMarker(), n || this.dispatchEvent(new sr({ error: "gps_off" }));
      }
    }
  }
  getGPSEnabled() {
    return this.gpsEnabled_;
  }
  // Async initializers 4: Handle i18n setting
  handleI18n(e, n) {
    e || (e = [() => "", {}]), this.i18n = e[1], this.t = e[0];
    const r = this.prepareMap(n);
    return Os(this.appData.pois || [], {
      name: this.appName
    }).then(
      (A) => this.handlePois(A, r)
    );
  }
  // Async initializers 5: Prepare map base elements and objects
  prepareMap(e) {
    e = te(e), this.mercBuffer = null;
    const n = this.appData.homePosition, r = this.appData.defaultZoom, A = this.appData.zoomRestriction, s = this.appData.minZoom, o = this.appData.maxZoom;
    this.appName = this.appData.appName;
    const g = e.fake ? this.appData.fakeGps : !1, a = e.fake ? this.appData.fakeRadius : !1;
    this.appLang = this.appData.lang || "ja", this.noRotate = e.noRotate || this.appData.noRotate || !1, this.poiTemplate = e.poiTemplate || this.appData.poiTemplate || !1, this.poiStyle = e.poiStyle || this.appData.poiStyle || !1, this.iconTemplate = e.iconTemplate || this.appData.iconTemplate || !1, this.currentPosition = null, this.__init = !0, this.dispatchEvent(new kt("uiPrepare"));
    const I = `${this.mapDiv}_front`;
    let C = Cn(
      `<div id="${I}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;"></div>`
    )[0];
    this.mapDivDocument.insertBefore(C, this.mapDivDocument.firstChild), this.fakeGps = g, this.fakeRadius = a, this.homePosition = n, this.mapObject = new On({
      div: I,
      controls: this.appData.controls || [],
      interactions: this.noRotate ? As({ altShiftDragRotate: !1, pinchRotate: !1 }) : As().extend([
        new YC({
          condition: GC
        })
      ]),
      fakeGps: g,
      fakeRadius: a,
      homePosition: n,
      northUp: e.northUp || this.appData.northUp || !1,
      tapDuration: e.tapDuration || this.appData.tapDuration || 3e3,
      homeMarginPixels: e.homeMarginPixels || this.appData.homeMarginPixels || 50,
      tapUIVanish: e.tapUIVanish || this.appData.tapUIVanish || !1,
      alwaysGpsOn: e.alwaysGpsOn || !1
    });
    let c = null;
    this.overlay && (c = `${this.mapDiv}_back`, C = Cn(
      `<div id="${c}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;"></div>`
    )[0], this.mapDivDocument.insertBefore(
      C,
      this.mapDivDocument.firstChild
    ), this.backMap = new On({
      off_control: !0,
      div: c
    }));
    const l = e.mapboxgl || (typeof window < "u" ? window.mapboxgl : void 0);
    if (l) {
      const u = `${this.mapDiv}_mapbox`;
      C = Cn(
        `<div id="${u}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;visibility:hidden;"></div>`
      )[0], this.mapDivDocument.insertBefore(
        C,
        this.mapDivDocument.firstChild
      ), this.mapboxMap = new l.Map({
        attributionControl: !1,
        boxZoom: !1,
        container: u,
        doubleClickZoom: !1,
        dragPan: !1,
        dragRotate: !1,
        interactive: !1,
        keyboard: !1,
        pitchWithRotate: !1,
        scrollZoom: !1,
        touchZoomRotate: !1
      });
    }
    const h = e.maplibregl || (typeof window < "u" ? window.maplibregl : void 0);
    if (h) {
      const u = `${this.mapDiv}_maplibre`;
      C = Cn(
        `<div id="${u}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;visibility:hidden;"></div>`
      )[0], this.mapDivDocument.insertBefore(
        C,
        this.mapDivDocument.firstChild
      ), this.maplibreMap = new h.Map({
        attributionControl: !1,
        boxZoom: !1,
        container: u,
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
    return this.startFrom = this.appData.startFrom, {
      homePos: n,
      defZoom: r,
      zoomRestriction: A,
      mercMinZoom: s,
      mercMaxZoom: o
    };
  }
  // Async initializer 7: Handle pois loading result
  handlePois(e, n) {
    return this.pois = e, this.sourcesLoader(n).then((r) => this.handleSources(r));
  }
  // Async initializer 9: Handle sources loading result
  async handleSources(e) {
    this.mercSrc = e.reduce((r, A) => {
      if (r) return r;
      if (A.isBasemap()) return A;
    }, null);
    const n = [];
    this.cacheHash = {};
    for (let r = 0; r < e.length; r++) {
      const A = e[r];
      if (A.setMap(this.mapObject), A.isMapbox()) {
        if (!this.mapboxMap)
          throw "To use Mapbox based maps, you need to include Mapbox GL JS and provide it via mapboxgl option.";
        A.mapboxMap = this.mapboxMap;
      } else if (A.isMapLibre && A.isMapLibre()) {
        if (!this.maplibreMap)
          throw "To use MapLibre based maps, you need to include MapLibre GL JS and provide it via maplibregl option.";
        A.maplibreMap = this.maplibreMap;
      }
      n.push(A), this.cacheHash[A.mapID] = A;
    }
    this.dispatchEvent(new kt("sourceLoaded", e)), await this.setInitialMap(n), this.setMapClick(), this.setPointerEvents(), this.setMapOnOff(), this.setMouseCursor(), this.setBackMapBehavior(), this.raiseChangeViewpoint();
  }
  // Async initializer 10: Handle initial map
  async setInitialMap(e) {
    const n = this.initialRestore.mapID || this.startFrom || e[e.length - 1].mapID;
    this.from = e.reduce(
      (r, A) => r ? !(r instanceof vo) && A.mapID != n ? A : r : A.mapID != n ? A : r,
      void 0
    ), await this.changeMap(n, this.initialRestore);
  }
  // Async initializer 11: Handle map click event
  setMapClick() {
    this.mapObject.on("click", (e) => {
      this.logger.debug(e.pixel), this.lastClickEvent = e;
      const n = [];
      if (e.target.forEachFeatureAtPixel(e.pixel, (r) => {
        this.logger.debug(e.pixel), r.get("datum") && n.push(r.get("datum"));
      }), n.length > 0)
        this.dispatchEvent(new kt("clickMarker", n[0])), this.dispatchEvent(new kt("clickMarkers", n));
      else {
        const r = e.coordinate;
        this.dispatchEvent(new kt("clickMapXy", r)), this.from.sysCoord2MercAsync(r).then((A) => {
          this.dispatchEvent(new kt("clickMapMerc", A));
          const s = Xt(A, "EPSG:3857", "EPSG:4326");
          this.dispatchEvent(
            new kt("clickMap", {
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
    let e, n = !1, r = !1;
    const A = {}, s = (o) => {
      this.dispatchEvent(new kt("pointerMoveOnMapXy", o)), this.from.sysCoord2MercAsync(o).then((g) => {
        if (this.dispatchEvent(new kt("pointerMoveOnMapMerc", g)), e) {
          const a = e;
          e = !1, s(a);
        } else
          n = !1;
      });
    };
    this.mapObject.on("pointermove", (o) => {
      r || (n ? e = o.coordinate : (n = !0, s(o.coordinate)));
    }), this.mapObject.on("pointerdown", (o) => {
      o.originalEvent && o.originalEvent.pointerId != null && (A[o.originalEvent.pointerId] = !0), r = !0;
    }), this.mapObject.on("pointerdrag", (o) => {
      o.originalEvent && o.originalEvent.pointerId != null && (A[o.originalEvent.pointerId] = !0), r = !0;
    }), this.mapObject.on("pointerup", (o) => {
      o.originalEvent && o.originalEvent.pointerId != null ? (delete A[o.originalEvent.pointerId], Object.keys(A).length == 0 && (r = !1)) : o.originalEvent && o.originalEvent.touches ? o.originalEvent.touches.length == 0 && (r = !1) : r = !1;
    });
  }
  // Async initializer 13: Handle map UI on/off
  setMapOnOff() {
    let e;
    this.mapObject.on("click", () => {
      e && (clearTimeout(e), e = void 0);
      const n = this.mapDivDocument.querySelectorAll(".ol-control");
      if (!this.mapObject.tapUIVanish || n.length && n[0].classList.contains("fade"))
        for (let r = 0; r < n.length; r++)
          n[r].classList.remove("fade");
      else {
        for (let r = 0; r < n.length; r++)
          n[r].classList.add("fade");
        e = setTimeout(() => {
          e = void 0;
          const r = this.mapDivDocument.querySelectorAll(".ol-control");
          for (let A = 0; A < r.length; A++)
            r[A].classList.remove("fade");
        }, this.mapObject.tapDuration);
      }
    }), this.mapObject.on("pointerdrag", () => {
      e && (clearTimeout(e), e = void 0);
      const n = this.mapDivDocument.querySelectorAll(".ol-control");
      for (let r = 0; r < n.length; r++)
        n[r].classList.add("fade");
    }), this.mapObject.on("moveend", () => {
      e && (clearTimeout(e), e = void 0), e = setTimeout(() => {
        e = void 0;
        const n = this.mapDivDocument.querySelectorAll(".ol-control");
        for (let r = 0; r < n.length; r++)
          n[r].classList.remove("fade");
      }, this.mapObject.tapDuration);
    });
  }
  // Async initializer 14: Handle mouse cursor
  setMouseCursor() {
    const e = (r) => {
      const A = r.target.getEventPixel(r.originalEvent), s = r.target.hasFeatureAtPixel(A), o = r.target.getTarget();
      if (s) {
        const g = r.target.forEachFeatureAtPixel(
          r.pixel,
          (a) => {
            if (a.get("datum")) return a;
          }
        );
        this.mapDivDocument.querySelector(`#${o}`).style.cursor = g ? "pointer" : "";
        return;
      }
      this.mapDivDocument.querySelector(`#${o}`).style.cursor = "";
    };
    this.mapObject.on("pointermove", e);
    const n = (r) => {
      let A = r.frameState.viewState.center;
      const s = this.from;
      s.insideCheckSysCoord(A) || (A = s.modulateSysCoordInside(
        A
      ), r.target.getView().setCenter(A));
    };
    this.mapObject.on("moveend", n);
  }
  // Async initializer 15: Handle back map's behavior
  setBackMapBehavior() {
    const e = (n) => {
      if (!this.backMap) return;
      if (this.__backMapMoving) {
        this.logger.debug("Backmap moving skipped");
        return;
      }
      const r = this.backMap.getSource();
      r && (this.__backMapMoving = !0, this.logger.debug("Backmap moving started"), this.convertParametersFromCurrent(r, (A) => {
        const s = this.backMap.getView();
        s.setCenter(A[0]), s.setZoom(A[1]), s.setRotation(this.noRotate ? 0 : A[2]), this.logger.debug("Backmap moving ended"), this.__backMapMoving = !1;
      }));
    };
    this.mapObject.on("postrender", e);
  }
  // Async initializer 16: Handle back map's behavior
  raiseChangeViewpoint() {
    this.mapObject.on("postrender", async (e) => {
      const n = this.mapObject.getView(), r = n.getCenter(), A = n.getDecimalZoom(), s = BA(n.getRotation() * 180 / Math.PI), o = await this.from.viewpoint2MercsAsync(), g = await this.mercSrc.mercs2ViewpointAsync(o);
      if (this.mobileMapMoveBuffer && this.mobileMapMoveBuffer[0][0] == g[0][0] && this.mobileMapMoveBuffer[0][1] == g[0][1] && this.mobileMapMoveBuffer[1] == g[1] && this.mobileMapMoveBuffer[2] == g[2]) return;
      this.mobileMapMoveBuffer = g;
      const a = Xt(g[0], "EPSG:3857", "EPSG:4326"), I = BA(g[2] * 180 / Math.PI);
      this.dispatchEvent(
        new kt("changeViewpoint", {
          x: r[0],
          y: r[1],
          longitude: a[0],
          latitude: a[1],
          mercator_x: g[0][0],
          mercator_y: g[0][1],
          zoom: A,
          mercZoom: g[1],
          direction: I,
          rotation: s
        })
      ), this.requestUpdateState({
        position: {
          x: r[0],
          y: r[1],
          zoom: A,
          rotation: s
        }
      });
    });
  }
  currentMapInfo() {
    return TA(this.from);
  }
  mapInfo(e) {
    return TA(this.cacheHash[e]);
  }
  async clientPointToLngLat(e, n) {
    if (!this.from || !this.mapObject) return;
    const A = this.mapObject.getViewport().getBoundingClientRect(), s = [e - A.left, n - A.top], o = this.mapObject.getCoordinateFromPixel(s);
    if (!o) return;
    const g = await this.from.sysCoord2MercAsync(o), a = Xt(g, "EPSG:3857", "EPSG:4326");
    return {
      longitude: a[0],
      latitude: a[1]
    };
  }
  async lngLatToClientPoint(e, n) {
    if (!this.from || !this.mapObject) return;
    const r = Xt([e, n], "EPSG:4326", "EPSG:3857"), A = await this.from.merc2SysCoordAsync(r), s = this.mapObject.getPixelFromCoordinate(A);
    if (!s) return;
    const o = this.mapObject.getViewport().getBoundingClientRect();
    return {
      x: s[0] + o.left,
      y: s[1] + o.top
    };
  }
  setMarker(e) {
    this.logger.debug(e);
    const n = e.lnglat || [
      e.lng || e.longitude,
      e.lat || e.latitude
    ], r = e.x, A = e.y, s = e.coordinates, o = this.from, g = e.icon ? this.__selectedMarker == e.namespaceID && e.selectedIcon ? e.selectedIcon : e.icon : this.__selectedMarker == e.namespaceID ? Bo : Bi;
    return (s ? (function() {
      return o.merc2SysCoordAsync_ignoreBackground(
        s
      );
    })() : r && A ? new Promise((I) => {
      I(o.xy2SysCoord([r, A]));
    }) : (function() {
      const I = Xt(n, "EPSG:4326", "EPSG:3857");
      return o.merc2SysCoordAsync_ignoreBackground(
        I
      );
    })()).then((I) => {
      I && o.insideCheckSysCoord(I) && this.mapObject.setMarker(I, { datum: e }, g);
    });
  }
  resetMarker() {
    this.mapObject.resetMarker();
  }
  setLine(e) {
    e.type = "Line", !e.style && e.stroke && (e.style = {
      stroke: e.stroke
    }), this.setVector(e);
  }
  setVector(e) {
    this.logger.debug(e);
    let n;
    const r = (A, s = !1) => Promise.all(
      A.map((o) => Array.isArray(o[0]) ? r(o, s) : (s && (o = Xt(o, "EPSG:4326", "EPSG:3857")), this.from.merc2SysCoordAsync(o)))
    );
    e.coordinates ? n = r(e.coordinates) : n = r(e.lnglats, !0), n.then((A) => {
      this.mapObject.setVector(A, e.type, e.style);
    });
  }
  resetLine() {
    this.resetVector();
  }
  resetVector() {
    this.mapObject.resetVector();
  }
  redrawMarkers(e = void 0) {
    if (e || (e = this.from), this.__redrawMarkerBlock) {
      this.__redrawMarkerThrottle || (this.__redrawMarkerThrottle = []);
      const r = this.__redrawMarkerThrottle;
      if (r.length == 0 || r[r.length - 1] !== e) {
        r.push(e);
        return;
      }
    }
    this.__redrawMarkerBlock = !0;
    const n = (r) => {
      const A = [];
      this.resetMarker();
      let s;
      this.stateBuffer.hideMarker || (Object.keys(this.pois).map((g) => {
        const a = this.pois[g];
        a.hide || a.features.map((I) => {
          const C = fs(I, a, this);
          ds(C, a, this), this.__selectedMarker == C.namespaceID ? s = C : A.push(this.setMarker(C));
        });
      }), r.pois && Object.keys(r.pois).map((g) => {
        const a = r.pois[g];
        a.hide || a.features.map((I) => {
          const C = fs(I, a, r, this);
          ds(C, a, r, this), this.__selectedMarker == C.namespaceID ? s = C : A.push(this.setMarker(C));
        });
      }));
      let o = Promise.all(A);
      s && (o = o.then(() => this.setMarker(s))), o.then(() => {
        this.__redrawMarkerThrottle && this.__redrawMarkerThrottle.length > 0 ? n(this.__redrawMarkerThrottle.shift()) : this.__redrawMarkerBlock = !1;
      });
    };
    n(e);
  }
  selectMarker(e) {
    const n = this.getMarker(e);
    if (!n) return;
    this.__selectedMarker = e;
    const r = {
      latitude: n.lnglat ? n.lnglat[1] : n.lat ? n.lat : n.latitude,
      longitude: n.lnglat ? n.lnglat[0] : n.lng ? n.lng : n.longitude
    };
    this.setViewpoint(r), this.redrawMarkers();
  }
  unselectMarker() {
    delete this.__selectedMarker, this.redrawMarkers();
  }
  getMarker(e) {
    if (e.indexOf("#") < 0) {
      let n;
      return Object.keys(this.pois).map((r) => {
        this.pois[r].features.map((A, s) => {
          A.id == e && (n = this.pois[r].features[s]);
        });
      }), n;
    } else {
      const n = e.split("#"), r = this.cacheHash[n[0]];
      if (r)
        return r.getPoi(n[1]);
    }
  }
  updateMarker(e, n, r) {
    const A = this.getMarker(e);
    A && (n = mn(n || {}), r ? (Object.keys(A).map((s) => {
      s != "id" && s != "namespaceID" && delete A[s];
    }), Object.assign(A, n)) : Object.keys(n).map((s) => {
      s == "id" || s == "namespaceID" || (n[s] == "____delete____" ? delete A[s] : A[s] = n[s]);
    }), this.redrawMarkers());
  }
  addMarker(e, n) {
    if (n || (n = "main"), n.indexOf("#") < 0) {
      if (this.pois[n])
        return this.pois[n].features.push(mn(e)), ui(this.pois, n, {
          name: this.appName
        }), this.dispatchPoiNumber(), this.redrawMarkers(), e.namespaceID;
    } else {
      const r = n.split("#"), A = this.cacheHash[r[0]];
      if (A) {
        const s = A.addPoi(e, r[1]);
        return this.dispatchPoiNumber(), this.redrawMarkers(), s;
      }
    }
  }
  removeMarker(e) {
    if (e.indexOf("#") < 0)
      Object.keys(this.pois).map((n) => {
        this.pois[n].features.map((r, A) => {
          r.id == e && (delete this.pois[n].features[A], this.dispatchPoiNumber(), this.redrawMarkers());
        });
      });
    else {
      const n = e.split("#"), r = this.cacheHash[n[0]];
      r && (r.removePoi(n[1]), this.dispatchPoiNumber(), this.redrawMarkers());
    }
  }
  clearMarker(e) {
    if (e || (e = "main"), e.indexOf("#") < 0) {
      if (e == "all")
        Object.keys(this.pois).map((n) => {
          this.pois[n].features = [];
        });
      else if (this.pois[e])
        this.pois[e].features = [];
      else return;
      this.dispatchPoiNumber(), this.redrawMarkers();
    } else {
      const n = e.split("#"), r = this.cacheHash[n[0]];
      r && (r.clearPoi(n[1]), this.dispatchPoiNumber(), this.redrawMarkers());
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
      new kt(
        "poi_number",
        this.listPoiLayers(!1, !0).reduce(
          (e, n) => e + n.features.length,
          0
        )
      )
    );
  }
  listPoiLayers(e = !1, n = !1) {
    const r = Object.keys(this.pois).sort((s, o) => s == "main" ? -1 : o == "main" ? 1 : s < o ? -1 : s > o ? 1 : 0).map((s) => this.pois[s]).filter(
      (s) => n ? e ? s.features.length && s.hide : s.features.length : e ? s.hide : !0
    ), A = this.from.listPoiLayers(
      e,
      n
    );
    return r.concat(A);
  }
  showPoiLayer(e) {
    const n = this.getPoiLayer(e);
    n && (delete n.hide, this.requestUpdateState({
      hideLayer: this.listPoiLayers(!0).map((r) => r.namespaceID).join(",")
    }), this.redrawMarkers());
  }
  hidePoiLayer(e) {
    const n = this.getPoiLayer(e);
    n && (n.hide = !0, this.requestUpdateState({
      hideLayer: this.listPoiLayers(!0).map((r) => r.namespaceID).join(",")
    }), this.redrawMarkers());
  }
  getPoiLayer(e) {
    if (e.indexOf("#") < 0)
      return this.pois[e];
    {
      const n = e.split("#"), r = this.cacheHash[n[0]];
      if (r)
        return r.getPoiLayer(n[1]);
    }
  }
  addPoiLayer(e, n) {
    if (e != "main" && !this.pois[e])
      if (e.indexOf("#") < 0)
        this.pois[e] = Oe(n || [], e, {
          name: this.appName
        }), this.redrawMarkers();
      else {
        const r = e.split("#"), A = this.cacheHash[r[0]];
        A && (A.addPoiLayer(r[1], n), this.redrawMarkers());
      }
  }
  removePoiLayer(e) {
    if (e != "main" && this.pois[e])
      if (e.indexOf("#") < 0)
        delete this.pois[e], this.requestUpdateState({
          hideLayer: this.listPoiLayers(!0).map((n) => n.namespaceID).join(",")
        }), this.dispatchPoiNumber(), this.redrawMarkers();
      else {
        const n = e.split("#"), r = this.cacheHash[n[0]];
        r && (r.removePoiLayer(n[1]), this.requestUpdateState({
          hideLayer: this.listPoiLayers(!0).map((A) => A.namespaceID).join(",")
        }), this.dispatchPoiNumber(), this.redrawMarkers());
      }
  }
  addLine(e) {
    this.vectors.push(e), this.setLine(e);
  }
  addVector(e) {
    this.vectors.push(e), this.setVector(e);
  }
  clearLine() {
    this.vectors = [], this.resetLine();
  }
  clearVector() {
    this.vectors = [], this.resetVector();
  }
  setGPSMarker(e) {
    this.currentPosition = e, this.from.setGPSMarker(e, !0);
  }
  changeMap(e, n) {
    n === void 0 && (n = {});
    const r = this.mercSrc, A = this.cacheHash[e];
    return this.changeMapSeq || (this.changeMapSeq = Promise.resolve()), this.changeMapSeq = this.changeMapSeq.then(
      () => new Promise((s, o) => {
        this.convertParametersFromCurrent(A, (g) => {
          let a = null, I = null;
          const C = n.backgroundID ? this.cacheHash[n.backgroundID] : void 0;
          if (this.backMap && (a = this.backMap.getSource(), A.isWmts() ? this.backMap.exchangeSource() : (C ? (I = C, this.backMap.exchangeSource(I)) : a ? I = a : (I = r, this.from.isWmts() && (I = this.from instanceof Dn ? this.mapObject.getSource() : (
            // If current foreground is TMS overlay, set current basemap as new background
            this.from
          )), this.backMap.exchangeSource(I)), this.requestUpdateState({ backgroundID: I.mapID }))), A instanceof Dn) {
            if (this.mapObject.setLayer(A), C)
              this.mapObject.exchangeSource(C);
            else if (!this.from.isWmts()) {
              const h = a || r;
              this.mapObject.exchangeSource(h);
            }
            this.requestUpdateState({
              backgroundID: this.mapObject.getSource().mapID
            });
          } else
            this.mapObject.setLayer(), this.mapObject.exchangeSource(A);
          const c = {
            mapID: A.mapID
          };
          A.isBasemap() && (c.backgroundID = "____delete____"), this.requestUpdateState(c), this.from = A, this.dispatchPoiNumber();
          const l = this.mapObject.getView();
          this.appData.zoomRestriction && (l.setMaxZoom(A.maxZoom), l.setMinZoom(A.minZoom || 0)), g && A.insideCheckSysCoord(g[0]) ? (l.setCenter(g[0]), l.setZoom(g[1]), l.setRotation(this.noRotate ? 0 : g[2])) : this.__init ? g || this.goHome(A) : (this.dispatchEvent(new kt("outOfMap", {})), this.goHome(A)), A.setGPSMarker(this.currentPosition, !0), n.hideLayer && (n.hideLayer.split(",").map((u) => {
            const m = this.getPoiLayer(u);
            m && (m.hide = !0);
          }), this.requestUpdateState({ hideLayer: n.hideLayer })), n.hideMarker ? this.hideAllMarkers() : this.redrawMarkers(), this.resetVector();
          for (let h = 0; h < this.vectors.length; h++)
            ((u) => {
              this.setVector(u);
            })(this.vectors[h]);
          this.dispatchEvent(
            new kt("mapChanged", this.getMapMeta(A.mapID))
          ), this.mapObject.updateSize(), this.mapObject.render(), n.position && (this.__init = !1, A.setViewpoint(n.position)), n.transparency && this.setTransparency(n.transparency), this.__init ? (this.__init = !1, this.goHome(A)) : this.backMap && I && this.convertParametersFromCurrent(I, (h) => {
            const u = this.backMap.getView();
            u.setCenter(h[0]), u.setZoom(h[1]), u.setRotation(this.noRotate ? 0 : h[2]), this.backMap.updateSize(), this.backMap.render();
          }), s(void 0);
        });
      })
    );
  }
  requestUpdateState(e) {
    if (this.stateBuffer = Object.assign(this.stateBuffer, e), this.stateBuffer.backgroundID == "____delete____" && delete this.stateBuffer.backgroundID, this.restoreSession) {
      const n = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
      localStorage.setItem("epoch", `${n}`);
      const r = function(A) {
        Object.keys(A).map((s) => {
          s == "position" ? r(A[s]) : s == "backgroundID" && A[s] == "____delete____" ? localStorage.removeItem(s) : localStorage.setItem(s, A[s]);
        });
      };
      r(e);
    }
    this.timer && clearTimeout(this.timer), this.timer = setTimeout(() => {
      this.timer = void 0, this.dispatchEvent(new kt("updateState", this.stateBuffer));
    }, 50);
  }
  setTransparency(e) {
    this.__transparency = e, this.mapObject.setTransparency(e), this.requestUpdateState({ transparency: e });
  }
  getTransparency() {
    return this.__transparency == null ? 0 : this.__transparency;
  }
  setViewpoint(e) {
    this.from.setViewpoint(e);
  }
  goHome(e) {
    (e || this.from).goHome();
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
  getMapMeta(e) {
    let n;
    if (e ? n = this.cacheHash[e] : n = this.from, !!n)
      return vn.reduce(
        (r, A) => (r[A] = n.get(A), r),
        {
          mapID: n.mapID,
          label: n.label
        }
      );
  }
  getMapCacheEnable(e) {
    let n;
    return e ? n = this.cacheHash[e] : n = this.from, n ? n.getCacheEnable() : !1;
  }
  async getMapTileCacheStatsAsync(e) {
    let n;
    return e ? n = this.cacheHash[e] : n = this.from, n ? await n.getTileCacheStatsAsync() : {};
  }
  async getMapTileCacheSizeAsync(e) {
    return (await this.getMapTileCacheStatsAsync(e)).size || 0;
  }
  async clearMapTileCacheAsync(e) {
    let n;
    e ? n = this.cacheHash[e] : n = this.from, n && await n.clearTileCacheAsync();
  }
  async fetchAllMapTileCacheAsync(e, n) {
    let r;
    if (e ? r = this.cacheHash[e] : r = this.from, !r) {
      n("stop", {});
      return;
    }
    await r.fetchAllTileCacheAsync(n);
  }
  async cancelMapTileCacheAsync(e) {
    let n;
    e ? n = this.cacheHash[e] : n = this.from, n && await n.cancelTileCacheAsync();
  }
  convertParametersFromCurrent(e, n) {
    const r = this.mapObject.getView();
    if (!this.from) {
      n && n();
      return;
    }
    let A = this.from.viewpoint2MercsAsync();
    const s = Ci(
      [r.getCenter(), r.getZoom(), r.getRotation()],
      10
    );
    if (this.mercBuffer && this.mercBuffer.mercs && this.mercBuffer.buffer[this.from.mapID]) {
      const o = this.mercBuffer.buffer[this.from.mapID];
      o[0][0] == s[0][0] && o[0][1] == s[0][1] && o[1] == s[1] && o[2] == s[2] ? (this.logger.debug(o), this.logger.debug(s), this.logger.debug("From: Use buffer"), A = new Promise((g, a) => {
        g(this.mercBuffer.mercs);
      })) : (this.mercBuffer = {
        buffer: {}
      }, this.mercBuffer.buffer[this.from.mapID] = s);
    } else
      this.mercBuffer = {
        buffer: {}
      }, this.mercBuffer.buffer[this.from.mapID] = s;
    this.logger.debug(
      `From: Center: ${s[0]} Zoom: ${s[1]} Rotation: ${s[2]}`
    ), this.logger.debug(`From: ${this.from.mapID}`), A.then((o) => {
      this.mercBuffer.mercs = o, this.logger.debug(`Mercs: ${o}`);
      let g = e.mercs2ViewpointAsync(o);
      const a = e.mapID;
      this.mercBuffer.buffer[a] && (this.logger.debug("To: Use buffer"), g = new Promise((I, C) => {
        I(this.mercBuffer.buffer[a]);
      })), g.then((I) => {
        this.logger.debug(
          `To: Center: ${I[0]} Zoom: ${I[1]} Rotation: ${I[2]}`
        ), this.logger.debug(`To: ${e.mapID}`), this.mercBuffer.buffer[e.mapID] = Ci(I, 10), n(I);
      }).catch((I) => {
        throw I;
      });
    }).catch((o) => {
      throw o;
    });
  }
  translate(e) {
    if (!e || typeof e == "string")
      return e;
    const n = Object.keys(e);
    let r = n.reduce((A, s, o, g) => (s == this.appLang ? A = [e[s], !0] : (!A || s == "en" && !A[1]) && (A = [e[s], !1]), o == g.length - 1 ? A[0] : A), void 0);
    if (r = typeof r == "string" ? r : `${r}`, this.i18n.exists(r, {
      ns: "translation",
      nsSeparator: "__X__yX__X__"
    }))
      return this.t(r, {
        ns: "translation",
        nsSeparator: "__X__yX__X__"
      });
    for (let A = 0; A < n.length; A++) {
      const s = n[A];
      this.i18n.addResource(s, "translation", r, e[s]);
    }
    return this.t(r, {
      ns: "translation",
      nsSeparator: "__X__yX__X__"
    });
  }
  remove() {
    this.mapboxMap && this.mapboxMap.remove(), this.mapDivDocument.innerHTML = "", this.mapDivDocument.classList.remove("maplat");
  }
}
// Static method declaration
M(Bn, "createObject");
Bn.createObject = function(i) {
  return new Promise((t) => {
    const e = new Bn(i);
    e.waitReady.then(() => {
      t(e);
    });
  });
};
if (typeof window < "u") {
  const i = {
    createObject: Bn.createObject
  };
  window.Maplat = i, window.MaplatApp = Bn, window.assets = Xc;
}
var or = { exports: {} }, ps;
function Uc() {
  return ps || (ps = 1, (function(i, t) {
    var e = typeof globalThis < "u" && globalThis || typeof self < "u" && self || typeof globalThis < "u" && globalThis, n = (function() {
      function A() {
        this.fetch = !1, this.DOMException = e.DOMException;
      }
      return A.prototype = e, new A();
    })();
    (function(A) {
      (function(s) {
        var o = typeof A < "u" && A || typeof self < "u" && self || typeof o < "u" && o, g = {
          searchParams: "URLSearchParams" in o,
          iterable: "Symbol" in o && "iterator" in Symbol,
          blob: "FileReader" in o && "Blob" in o && (function() {
            try {
              return new Blob(), !0;
            } catch {
              return !1;
            }
          })(),
          formData: "FormData" in o,
          arrayBuffer: "ArrayBuffer" in o
        };
        function a(b) {
          return b && DataView.prototype.isPrototypeOf(b);
        }
        if (g.arrayBuffer)
          var I = [
            "[object Int8Array]",
            "[object Uint8Array]",
            "[object Uint8ClampedArray]",
            "[object Int16Array]",
            "[object Uint16Array]",
            "[object Int32Array]",
            "[object Uint32Array]",
            "[object Float32Array]",
            "[object Float64Array]"
          ], C = ArrayBuffer.isView || function(b) {
            return b && I.indexOf(Object.prototype.toString.call(b)) > -1;
          };
        function c(b) {
          if (typeof b != "string" && (b = String(b)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(b) || b === "")
            throw new TypeError('Invalid character in header field name: "' + b + '"');
          return b.toLowerCase();
        }
        function l(b) {
          return typeof b != "string" && (b = String(b)), b;
        }
        function h(b) {
          var w = {
            next: function() {
              var z = b.shift();
              return { done: z === void 0, value: z };
            }
          };
          return g.iterable && (w[Symbol.iterator] = function() {
            return w;
          }), w;
        }
        function u(b) {
          this.map = {}, b instanceof u ? b.forEach(function(w, z) {
            this.append(z, w);
          }, this) : Array.isArray(b) ? b.forEach(function(w) {
            this.append(w[0], w[1]);
          }, this) : b && Object.getOwnPropertyNames(b).forEach(function(w) {
            this.append(w, b[w]);
          }, this);
        }
        u.prototype.append = function(b, w) {
          b = c(b), w = l(w);
          var z = this.map[b];
          this.map[b] = z ? z + ", " + w : w;
        }, u.prototype.delete = function(b) {
          delete this.map[c(b)];
        }, u.prototype.get = function(b) {
          return b = c(b), this.has(b) ? this.map[b] : null;
        }, u.prototype.has = function(b) {
          return this.map.hasOwnProperty(c(b));
        }, u.prototype.set = function(b, w) {
          this.map[c(b)] = l(w);
        }, u.prototype.forEach = function(b, w) {
          for (var z in this.map)
            this.map.hasOwnProperty(z) && b.call(w, this.map[z], z, this);
        }, u.prototype.keys = function() {
          var b = [];
          return this.forEach(function(w, z) {
            b.push(z);
          }), h(b);
        }, u.prototype.values = function() {
          var b = [];
          return this.forEach(function(w) {
            b.push(w);
          }), h(b);
        }, u.prototype.entries = function() {
          var b = [];
          return this.forEach(function(w, z) {
            b.push([z, w]);
          }), h(b);
        }, g.iterable && (u.prototype[Symbol.iterator] = u.prototype.entries);
        function m(b) {
          if (b.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          b.bodyUsed = !0;
        }
        function p(b) {
          return new Promise(function(w, z) {
            b.onload = function() {
              w(b.result);
            }, b.onerror = function() {
              z(b.error);
            };
          });
        }
        function v(b) {
          var w = new FileReader(), z = p(w);
          return w.readAsArrayBuffer(b), z;
        }
        function D(b) {
          var w = new FileReader(), z = p(w);
          return w.readAsText(b), z;
        }
        function T(b) {
          for (var w = new Uint8Array(b), z = new Array(w.length), _ = 0; _ < w.length; _++)
            z[_] = String.fromCharCode(w[_]);
          return z.join("");
        }
        function U(b) {
          if (b.slice)
            return b.slice(0);
          var w = new Uint8Array(b.byteLength);
          return w.set(new Uint8Array(b)), w.buffer;
        }
        function W() {
          return this.bodyUsed = !1, this._initBody = function(b) {
            this.bodyUsed = this.bodyUsed, this._bodyInit = b, b ? typeof b == "string" ? this._bodyText = b : g.blob && Blob.prototype.isPrototypeOf(b) ? this._bodyBlob = b : g.formData && FormData.prototype.isPrototypeOf(b) ? this._bodyFormData = b : g.searchParams && URLSearchParams.prototype.isPrototypeOf(b) ? this._bodyText = b.toString() : g.arrayBuffer && g.blob && a(b) ? (this._bodyArrayBuffer = U(b.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : g.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(b) || C(b)) ? this._bodyArrayBuffer = U(b) : this._bodyText = b = Object.prototype.toString.call(b) : this._bodyText = "", this.headers.get("content-type") || (typeof b == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : g.searchParams && URLSearchParams.prototype.isPrototypeOf(b) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
          }, g.blob && (this.blob = function() {
            var b = m(this);
            if (b)
              return b;
            if (this._bodyBlob)
              return Promise.resolve(this._bodyBlob);
            if (this._bodyArrayBuffer)
              return Promise.resolve(new Blob([this._bodyArrayBuffer]));
            if (this._bodyFormData)
              throw new Error("could not read FormData body as blob");
            return Promise.resolve(new Blob([this._bodyText]));
          }, this.arrayBuffer = function() {
            if (this._bodyArrayBuffer) {
              var b = m(this);
              return b || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
                this._bodyArrayBuffer.buffer.slice(
                  this._bodyArrayBuffer.byteOffset,
                  this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
                )
              ) : Promise.resolve(this._bodyArrayBuffer));
            } else
              return this.blob().then(v);
          }), this.text = function() {
            var b = m(this);
            if (b)
              return b;
            if (this._bodyBlob)
              return D(this._bodyBlob);
            if (this._bodyArrayBuffer)
              return Promise.resolve(T(this._bodyArrayBuffer));
            if (this._bodyFormData)
              throw new Error("could not read FormData body as text");
            return Promise.resolve(this._bodyText);
          }, g.formData && (this.formData = function() {
            return this.text().then(at);
          }), this.json = function() {
            return this.text().then(JSON.parse);
          }, this;
        }
        var q = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
        function et(b) {
          var w = b.toUpperCase();
          return q.indexOf(w) > -1 ? w : b;
        }
        function nt(b, w) {
          if (!(this instanceof nt))
            throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
          w = w || {};
          var z = w.body;
          if (b instanceof nt) {
            if (b.bodyUsed)
              throw new TypeError("Already read");
            this.url = b.url, this.credentials = b.credentials, w.headers || (this.headers = new u(b.headers)), this.method = b.method, this.mode = b.mode, this.signal = b.signal, !z && b._bodyInit != null && (z = b._bodyInit, b.bodyUsed = !0);
          } else
            this.url = String(b);
          if (this.credentials = w.credentials || this.credentials || "same-origin", (w.headers || !this.headers) && (this.headers = new u(w.headers)), this.method = et(w.method || this.method || "GET"), this.mode = w.mode || this.mode || null, this.signal = w.signal || this.signal, this.referrer = null, (this.method === "GET" || this.method === "HEAD") && z)
            throw new TypeError("Body not allowed for GET or HEAD requests");
          if (this._initBody(z), (this.method === "GET" || this.method === "HEAD") && (w.cache === "no-store" || w.cache === "no-cache")) {
            var _ = /([?&])_=[^&]*/;
            if (_.test(this.url))
              this.url = this.url.replace(_, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
            else {
              var it = /\?/;
              this.url += (it.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
            }
          }
        }
        nt.prototype.clone = function() {
          return new nt(this, { body: this._bodyInit });
        };
        function at(b) {
          var w = new FormData();
          return b.trim().split("&").forEach(function(z) {
            if (z) {
              var _ = z.split("="), it = _.shift().replace(/\+/g, " "), Y = _.join("=").replace(/\+/g, " ");
              w.append(decodeURIComponent(it), decodeURIComponent(Y));
            }
          }), w;
        }
        function J(b) {
          var w = new u(), z = b.replace(/\r?\n[\t ]+/g, " ");
          return z.split("\r").map(function(_) {
            return _.indexOf(`
`) === 0 ? _.substr(1, _.length) : _;
          }).forEach(function(_) {
            var it = _.split(":"), Y = it.shift().trim();
            if (Y) {
              var lt = it.join(":").trim();
              w.append(Y, lt);
            }
          }), w;
        }
        W.call(nt.prototype);
        function rt(b, w) {
          if (!(this instanceof rt))
            throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
          w || (w = {}), this.type = "default", this.status = w.status === void 0 ? 200 : w.status, this.ok = this.status >= 200 && this.status < 300, this.statusText = w.statusText === void 0 ? "" : "" + w.statusText, this.headers = new u(w.headers), this.url = w.url || "", this._initBody(b);
        }
        W.call(rt.prototype), rt.prototype.clone = function() {
          return new rt(this._bodyInit, {
            status: this.status,
            statusText: this.statusText,
            headers: new u(this.headers),
            url: this.url
          });
        }, rt.error = function() {
          var b = new rt(null, { status: 0, statusText: "" });
          return b.type = "error", b;
        };
        var dt = [301, 302, 303, 307, 308];
        rt.redirect = function(b, w) {
          if (dt.indexOf(w) === -1)
            throw new RangeError("Invalid status code");
          return new rt(null, { status: w, headers: { location: b } });
        }, s.DOMException = o.DOMException;
        try {
          new s.DOMException();
        } catch {
          s.DOMException = function(w, z) {
            this.message = w, this.name = z;
            var _ = Error(w);
            this.stack = _.stack;
          }, s.DOMException.prototype = Object.create(Error.prototype), s.DOMException.prototype.constructor = s.DOMException;
        }
        function ut(b, w) {
          return new Promise(function(z, _) {
            var it = new nt(b, w);
            if (it.signal && it.signal.aborted)
              return _(new s.DOMException("Aborted", "AbortError"));
            var Y = new XMLHttpRequest();
            function lt() {
              Y.abort();
            }
            Y.onload = function() {
              var pt = {
                status: Y.status,
                statusText: Y.statusText,
                headers: J(Y.getAllResponseHeaders() || "")
              };
              pt.url = "responseURL" in Y ? Y.responseURL : pt.headers.get("X-Request-URL");
              var xt = "response" in Y ? Y.response : Y.responseText;
              setTimeout(function() {
                z(new rt(xt, pt));
              }, 0);
            }, Y.onerror = function() {
              setTimeout(function() {
                _(new TypeError("Network request failed"));
              }, 0);
            }, Y.ontimeout = function() {
              setTimeout(function() {
                _(new TypeError("Network request failed"));
              }, 0);
            }, Y.onabort = function() {
              setTimeout(function() {
                _(new s.DOMException("Aborted", "AbortError"));
              }, 0);
            };
            function we(pt) {
              try {
                return pt === "" && o.location.href ? o.location.href : pt;
              } catch {
                return pt;
              }
            }
            Y.open(it.method, we(it.url), !0), it.credentials === "include" ? Y.withCredentials = !0 : it.credentials === "omit" && (Y.withCredentials = !1), "responseType" in Y && (g.blob ? Y.responseType = "blob" : g.arrayBuffer && it.headers.get("Content-Type") && it.headers.get("Content-Type").indexOf("application/octet-stream") !== -1 && (Y.responseType = "arraybuffer")), w && typeof w.headers == "object" && !(w.headers instanceof u) ? Object.getOwnPropertyNames(w.headers).forEach(function(pt) {
              Y.setRequestHeader(pt, l(w.headers[pt]));
            }) : it.headers.forEach(function(pt, xt) {
              Y.setRequestHeader(xt, pt);
            }), it.signal && (it.signal.addEventListener("abort", lt), Y.onreadystatechange = function() {
              Y.readyState === 4 && it.signal.removeEventListener("abort", lt);
            }), Y.send(typeof it._bodyInit > "u" ? null : it._bodyInit);
          });
        }
        return ut.polyfill = !0, o.fetch || (o.fetch = ut, o.Headers = u, o.Request = nt, o.Response = rt), s.Headers = u, s.Request = nt, s.Response = rt, s.fetch = ut, s;
      })({});
    })(n), n.fetch.ponyfill = !0, delete n.fetch.polyfill;
    var r = e.fetch ? e : n;
    t = r.fetch, t.default = r.fetch, t.fetch = r.fetch, t.Headers = r.Headers, t.Request = r.Request, t.Response = r.Response, i.exports = t;
  })(or, or.exports)), or.exports;
}
var To = Uc();
const zc = /* @__PURE__ */ Ls(To), Hc = /* @__PURE__ */ ug({
  __proto__: null,
  default: zc
}, [To]);
export {
  kt as CustomEvent,
  Zc as GPSErrorEvent,
  Fc as GPSRequestEvent,
  sr as GPSResultEvent,
  Bn as MaplatApp,
  Xc as assets,
  Cn as createElement
};
//# sourceMappingURL=maplat_core.js.map
