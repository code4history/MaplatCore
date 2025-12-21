var eo = Object.defineProperty;
var no = (i, t, e) => t in i ? eo(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var w = (i, t, e) => no(i, typeof t != "symbol" ? t + "" : t, e);
import { transform as Lt, toLonLat as Ci, Projection as ro, addProjection as Jr, addCoordinateTransforms as ar, getTransform as Lr, identityTransform as jr } from "ol/proj";
import { View as ds, Map as io, Feature as Ao } from "ol";
import { Vector as Vn, Group as so, Tile as kr } from "ol/layer";
import { XYZ as ps, Google as go, Vector as Yn } from "ol/source";
import { Style as qt, Icon as $e, Stroke as qr, Fill as _r } from "ol/style";
function zt(i) {
  "@babel/helpers - typeof";
  return zt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, zt(i);
}
function ne(i, t) {
  if (!(i instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function oo(i, t) {
  if (zt(i) != "object" || !i) return i;
  var e = i[Symbol.toPrimitive];
  if (e !== void 0) {
    var n = e.call(i, t);
    if (zt(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(i);
}
function ms(i) {
  var t = oo(i, "string");
  return zt(t) == "symbol" ? t : t + "";
}
function $i(i, t) {
  for (var e = 0; e < t.length; e++) {
    var n = t[e];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(i, ms(n.key), n);
  }
}
function re(i, t, e) {
  return t && $i(i.prototype, t), e && $i(i, e), Object.defineProperty(i, "prototype", {
    writable: !1
  }), i;
}
function de(i) {
  if (i === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return i;
}
function $r(i, t) {
  return $r = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e, n) {
    return e.__proto__ = n, e;
  }, $r(i, t);
}
function mr(i, t) {
  if (typeof t != "function" && t !== null) throw new TypeError("Super expression must either be null or a function");
  i.prototype = Object.create(t && t.prototype, {
    constructor: {
      value: i,
      writable: !0,
      configurable: !0
    }
  }), Object.defineProperty(i, "prototype", {
    writable: !1
  }), t && $r(i, t);
}
function Tn(i, t) {
  if (t && (zt(t) == "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return de(i);
}
function te(i) {
  return te = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, te(i);
}
function ve(i, t, e) {
  return (t = ms(t)) in i ? Object.defineProperty(i, t, {
    value: e,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : i[t] = e, i;
}
function ao(i) {
  if (Array.isArray(i)) return i;
}
function Io(i) {
  if (typeof Symbol < "u" && i[Symbol.iterator] != null || i["@@iterator"] != null) return Array.from(i);
}
function tA(i, t) {
  (t == null || t > i.length) && (t = i.length);
  for (var e = 0, n = Array(t); e < t; e++) n[e] = i[e];
  return n;
}
function Co(i, t) {
  if (i) {
    if (typeof i == "string") return tA(i, t);
    var e = {}.toString.call(i).slice(8, -1);
    return e === "Object" && i.constructor && (e = i.constructor.name), e === "Map" || e === "Set" ? Array.from(i) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? tA(i, t) : void 0;
  }
}
function co() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function lo(i) {
  return ao(i) || Io(i) || Co(i) || co();
}
function eA(i, t) {
  var e = Object.keys(i);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(i);
    t && (n = n.filter(function(r) {
      return Object.getOwnPropertyDescriptor(i, r).enumerable;
    })), e.push.apply(e, n);
  }
  return e;
}
function nA(i) {
  for (var t = 1; t < arguments.length; t++) {
    var e = arguments[t] != null ? arguments[t] : {};
    t % 2 ? eA(Object(e), !0).forEach(function(n) {
      ve(i, n, e[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(e)) : eA(Object(e)).forEach(function(n) {
      Object.defineProperty(i, n, Object.getOwnPropertyDescriptor(e, n));
    });
  }
  return i;
}
var uo = {
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
}, ho = (function() {
  function i(t) {
    var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    ne(this, i), this.init(t, e);
  }
  return re(i, [{
    key: "init",
    value: function(e) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      this.prefix = n.prefix || "i18next:", this.logger = e || uo, this.options = n, this.debug = n.debug;
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
      return new i(this.logger, nA(nA({}, {
        prefix: "".concat(this.prefix, ":").concat(e, ":")
      }), this.options));
    }
  }, {
    key: "clone",
    value: function(e) {
      return e = e || this.options, e.prefix = e.prefix || this.prefix, new i(this.logger, e);
    }
  }]), i;
})(), _t = new ho(), pe = (function() {
  function i() {
    ne(this, i), this.observers = {};
  }
  return re(i, [{
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
        s.forEach(function(o) {
          o.apply(void 0, r);
        });
      }
      if (this.observers["*"]) {
        var g = [].concat(this.observers["*"]);
        g.forEach(function(o) {
          o.apply(o, [e].concat(r));
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
function rA(i) {
  return i == null ? "" : "" + i;
}
function fo(i, t, e) {
  i.forEach(function(n) {
    t[n] && (e[n] = t[n]);
  });
}
function ci(i, t, e) {
  function n(g) {
    return g && g.indexOf("###") > -1 ? g.replace(/###/g, ".") : g;
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
function iA(i, t, e) {
  var n = ci(i, t, Object), r = n.obj, A = n.k;
  r[A] = e;
}
function po(i, t, e, n) {
  var r = ci(i, t, Object), A = r.obj, s = r.k;
  A[s] = A[s] || [], A[s].push(e);
}
function Ir(i, t) {
  var e = ci(i, t), n = e.obj, r = e.k;
  if (n)
    return n[r];
}
function AA(i, t, e) {
  var n = Ir(i, e);
  return n !== void 0 ? n : Ir(t, e);
}
function ys(i, t, e) {
  for (var n in t)
    n !== "__proto__" && n !== "constructor" && (n in i ? typeof i[n] == "string" || i[n] instanceof String || typeof t[n] == "string" || t[n] instanceof String ? e && (i[n] = t[n]) : ys(i[n], t[n], e) : i[n] = t[n]);
  return i;
}
function Ze(i) {
  return i.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
var mo = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;"
};
function yo(i) {
  return typeof i == "string" ? i.replace(/[&<>"'\/]/g, function(t) {
    return mo[t];
  }) : i;
}
var yr = typeof window < "u" && window.navigator && typeof window.navigator.userAgentData > "u" && window.navigator.userAgent && window.navigator.userAgent.indexOf("MSIE") > -1, vo = [" ", ",", "?", "!", ";"];
function bo(i, t, e) {
  t = t || "", e = e || "";
  var n = vo.filter(function(g) {
    return t.indexOf(g) < 0 && e.indexOf(g) < 0;
  });
  if (n.length === 0) return !0;
  var r = new RegExp("(".concat(n.map(function(g) {
    return g === "?" ? "\\?" : g;
  }).join("|"), ")")), A = !r.test(i);
  if (!A) {
    var s = i.indexOf(e);
    s > 0 && !r.test(i.substring(0, s)) && (A = !0);
  }
  return A;
}
function sA(i, t) {
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
    t % 2 ? sA(Object(e), !0).forEach(function(n) {
      ve(i, n, e[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(e)) : sA(Object(e)).forEach(function(n) {
      Object.defineProperty(i, n, Object.getOwnPropertyDescriptor(e, n));
    });
  }
  return i;
}
function wo(i) {
  var t = Eo();
  return function() {
    var n = te(i), r;
    if (t) {
      var A = te(this).constructor;
      r = Reflect.construct(n, arguments, A);
    } else
      r = n.apply(this, arguments);
    return Tn(this, r);
  };
}
function Eo() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
function vs(i, t) {
  var e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ".";
  if (i) {
    if (i[t]) return i[t];
    for (var n = t.split(e), r = i, A = 0; A < n.length; ++A) {
      if (!r || typeof r[n[A]] == "string" && A + 1 < n.length)
        return;
      if (r[n[A]] === void 0) {
        for (var s = 2, g = n.slice(A, A + s).join(e), o = r[g]; o === void 0 && n.length > A + s; )
          s++, g = n.slice(A, A + s).join(e), o = r[g];
        if (o === void 0) return;
        if (o === null) return null;
        if (t.endsWith(g)) {
          if (typeof o == "string") return o;
          if (g && typeof o[g] == "string") return o[g];
        }
        var a = n.slice(A + s).join(e);
        return a ? vs(o, a, e) : void 0;
      }
      r = r[n[A]];
    }
    return r;
  }
}
var Mo = (function(i) {
  mr(e, i);
  var t = wo(e);
  function e(n) {
    var r, A = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      ns: ["translation"],
      defaultNS: "translation"
    };
    return ne(this, e), r = t.call(this), yr && pe.call(de(r)), r.data = n || {}, r.options = A, r.options.keySeparator === void 0 && (r.options.keySeparator = "."), r.options.ignoreJSONStructure === void 0 && (r.options.ignoreJSONStructure = !0), r;
  }
  return re(e, [{
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
      var g = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, o = g.keySeparator !== void 0 ? g.keySeparator : this.options.keySeparator, a = g.ignoreJSONStructure !== void 0 ? g.ignoreJSONStructure : this.options.ignoreJSONStructure, I = [r, A];
      s && typeof s != "string" && (I = I.concat(s)), s && typeof s == "string" && (I = I.concat(o ? s.split(o) : s)), r.indexOf(".") > -1 && (I = r.split("."));
      var C = Ir(this.data, I);
      return C || !a || typeof s != "string" ? C : vs(this.data && this.data[r] && this.data[r][A], s, o);
    }
  }, {
    key: "addResource",
    value: function(r, A, s, g) {
      var o = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
        silent: !1
      }, a = this.options.keySeparator;
      a === void 0 && (a = ".");
      var I = [r, A];
      s && (I = I.concat(a ? s.split(a) : s)), r.indexOf(".") > -1 && (I = r.split("."), g = A, A = I[1]), this.addNamespaces(A), iA(this.data, I, g), o.silent || this.emit("added", r, A, s, g);
    }
  }, {
    key: "addResources",
    value: function(r, A, s) {
      var g = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {
        silent: !1
      };
      for (var o in s)
        (typeof s[o] == "string" || Object.prototype.toString.apply(s[o]) === "[object Array]") && this.addResource(r, A, o, s[o], {
          silent: !0
        });
      g.silent || this.emit("added", r, A, s);
    }
  }, {
    key: "addResourceBundle",
    value: function(r, A, s, g, o) {
      var a = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {
        silent: !1
      }, I = [r, A];
      r.indexOf(".") > -1 && (I = r.split("."), g = s, s = A, A = I[1]), this.addNamespaces(A);
      var C = Ir(this.data, I) || {};
      g ? ys(C, s, o) : C = Kn(Kn({}, C), s), iA(this.data, I, C), a.silent || this.emit("added", r, A, s);
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
      return !!s.find(function(g) {
        return A[g] && Object.keys(A[g]).length > 0;
      });
    }
  }, {
    key: "toJSON",
    value: function() {
      return this.data;
    }
  }]), e;
})(pe), bs = {
  processors: {},
  addPostProcessor: function(t) {
    this.processors[t.name] = t;
  },
  handle: function(t, e, n, r, A) {
    var s = this;
    return t.forEach(function(g) {
      s.processors[g] && (e = s.processors[g].process(e, n, r, A));
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
function wt(i) {
  for (var t = 1; t < arguments.length; t++) {
    var e = arguments[t] != null ? arguments[t] : {};
    t % 2 ? gA(Object(e), !0).forEach(function(n) {
      ve(i, n, e[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(e)) : gA(Object(e)).forEach(function(n) {
      Object.defineProperty(i, n, Object.getOwnPropertyDescriptor(e, n));
    });
  }
  return i;
}
function Po(i) {
  var t = Ro();
  return function() {
    var n = te(i), r;
    if (t) {
      var A = te(this).constructor;
      r = Reflect.construct(n, arguments, A);
    } else
      r = n.apply(this, arguments);
    return Tn(this, r);
  };
}
function Ro() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
var oA = {}, aA = (function(i) {
  mr(e, i);
  var t = Po(e);
  function e(n) {
    var r, A = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return ne(this, e), r = t.call(this), yr && pe.call(de(r)), fo(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], n, de(r)), r.options = A, r.options.keySeparator === void 0 && (r.options.keySeparator = "."), r.logger = _t.create("translator"), r;
  }
  return re(e, [{
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
      var g = A.keySeparator !== void 0 ? A.keySeparator : this.options.keySeparator, o = A.ns || this.options.defaultNS || [], a = s && r.indexOf(s) > -1, I = !this.options.userDefinedKeySeparator && !A.keySeparator && !this.options.userDefinedNsSeparator && !A.nsSeparator && !bo(r, s, g);
      if (a && !I) {
        var C = r.match(this.interpolator.nestingRegexp);
        if (C && C.length > 0)
          return {
            key: r,
            namespaces: o
          };
        var c = r.split(s);
        (s !== g || s === g && this.options.ns.indexOf(c[0]) > -1) && (o = c.shift()), r = c.join(g);
      }
      return typeof o == "string" && (o = [o]), {
        key: r,
        namespaces: o
      };
    }
  }, {
    key: "translate",
    value: function(r, A, s) {
      var g = this;
      if (zt(A) !== "object" && this.options.overloadTranslationOptionHandler && (A = this.options.overloadTranslationOptionHandler(arguments)), A || (A = {}), r == null) return "";
      Array.isArray(r) || (r = [String(r)]);
      var o = A.returnDetails !== void 0 ? A.returnDetails : this.options.returnDetails, a = A.keySeparator !== void 0 ? A.keySeparator : this.options.keySeparator, I = this.extractFromKey(r[r.length - 1], A), C = I.key, c = I.namespaces, l = c[c.length - 1], u = A.lng || this.language, f = A.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
      if (u && u.toLowerCase() === "cimode") {
        if (f) {
          var m = A.nsSeparator || this.options.nsSeparator;
          return o ? (p.res = "".concat(l).concat(m).concat(C), p) : "".concat(l).concat(m).concat(C);
        }
        return o ? (p.res = C, p) : C;
      }
      var p = this.resolve(r, A), v = p && p.res, O = p && p.usedKey || C, D = p && p.exactUsedKey || C, z = Object.prototype.toString.apply(v), W = ["[object Number]", "[object Function]", "[object RegExp]"], K = A.joinArrays !== void 0 ? A.joinArrays : this.options.joinArrays, _ = !this.i18nFormat || this.i18nFormat.handleAsObject, At = typeof v != "string" && typeof v != "boolean" && typeof v != "number";
      if (_ && v && At && W.indexOf(z) < 0 && !(typeof K == "string" && z === "[object Array]")) {
        if (!A.returnObjects && !this.options.returnObjects) {
          this.options.returnedObjectHandler || this.logger.warn("accessing an object - but returnObjects options is not enabled!");
          var rt = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(O, v, wt(wt({}, A), {}, {
            ns: c
          })) : "key '".concat(C, " (").concat(this.language, ")' returned an object instead of string.");
          return o ? (p.res = rt, p) : rt;
        }
        if (a) {
          var V = z === "[object Array]", gt = V ? [] : {}, dt = V ? D : O;
          for (var ht in v)
            if (Object.prototype.hasOwnProperty.call(v, ht)) {
              var jt = "".concat(dt).concat(a).concat(ht);
              gt[ht] = this.translate(jt, wt(wt({}, A), {
                joinArrays: !1,
                ns: c
              })), gt[ht] === jt && (gt[ht] = v[ht]);
            }
          v = gt;
        }
      } else if (_ && typeof K == "string" && z === "[object Array]")
        v = v.join(K), v && (v = this.extendTranslation(v, r, A, s));
      else {
        var F = !1, ot = !1, Rt = A.count !== void 0 && typeof A.count != "string", kt = e.hasDefaultValue(A), Zt = Rt ? this.pluralResolver.getSuffix(u, A.count, A) : "", Ct = A["defaultValue".concat(Zt)] || A.defaultValue;
        !this.isValidLookup(v) && kt && (F = !0, v = Ct), this.isValidLookup(v) || (ot = !0, v = C);
        var gn = A.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey, ke = gn && ot ? void 0 : v, Wt = kt && Ct !== v && this.options.updateMissing;
        if (ot || F || Wt) {
          if (this.logger.log(Wt ? "updateKey" : "missingKey", u, l, C, Wt ? Ct : v), a) {
            var Ne = this.resolve(C, wt(wt({}, A), {}, {
              keySeparator: !1
            }));
            Ne && Ne.res && this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
          }
          var ie = [], Ce = this.languageUtils.getFallbackCodes(this.options.fallbackLng, A.lng || this.language);
          if (this.options.saveMissingTo === "fallback" && Ce && Ce[0])
            for (var Ae = 0; Ae < Ce.length; Ae++)
              ie.push(Ce[Ae]);
          else this.options.saveMissingTo === "all" ? ie = this.languageUtils.toResolveHierarchy(A.lng || this.language) : ie.push(A.lng || this.language);
          var Ht = function(q, be, we) {
            var Ge = kt && we !== v ? we : ke;
            g.options.missingKeyHandler ? g.options.missingKeyHandler(q, l, be, Ge, Wt, A) : g.backendConnector && g.backendConnector.saveMissing && g.backendConnector.saveMissing(q, l, be, Ge, Wt, A), g.emit("missingKey", q, l, be, v);
          };
          this.options.saveMissing && (this.options.saveMissingPlurals && Rt ? ie.forEach(function(se) {
            g.pluralResolver.getSuffixes(se, A).forEach(function(q) {
              Ht([se], C + q, A["defaultValue".concat(q)] || Ct);
            });
          }) : Ht(ie, C, Ct));
        }
        v = this.extendTranslation(v, r, A, p, s), ot && v === C && this.options.appendNamespaceToMissingKey && (v = "".concat(l, ":").concat(C)), (ot || F) && this.options.parseMissingKeyHandler && (this.options.compatibilityAPI !== "v1" ? v = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? "".concat(l, ":").concat(C) : C, F ? v : void 0) : v = this.options.parseMissingKeyHandler(v));
      }
      return o ? (p.res = v, p) : v;
    }
  }, {
    key: "extendTranslation",
    value: function(r, A, s, g, o) {
      var a = this;
      if (this.i18nFormat && this.i18nFormat.parse)
        r = this.i18nFormat.parse(r, wt(wt({}, this.options.interpolation.defaultVariables), s), g.usedLng, g.usedNS, g.usedKey, {
          resolved: g
        });
      else if (!s.skipInterpolation) {
        s.interpolation && this.interpolator.init(wt(wt({}, s), {
          interpolation: wt(wt({}, this.options.interpolation), s.interpolation)
        }));
        var I = typeof r == "string" && (s && s.interpolation && s.interpolation.skipOnVariables !== void 0 ? s.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables), C;
        if (I) {
          var c = r.match(this.interpolator.nestingRegexp);
          C = c && c.length;
        }
        var l = s.replace && typeof s.replace != "string" ? s.replace : s;
        if (this.options.interpolation.defaultVariables && (l = wt(wt({}, this.options.interpolation.defaultVariables), l)), r = this.interpolator.interpolate(r, l, s.lng || this.language, s), I) {
          var u = r.match(this.interpolator.nestingRegexp), f = u && u.length;
          C < f && (s.nest = !1);
        }
        s.nest !== !1 && (r = this.interpolator.nest(r, function() {
          for (var v = arguments.length, O = new Array(v), D = 0; D < v; D++)
            O[D] = arguments[D];
          return o && o[0] === O[0] && !s.context ? (a.logger.warn("It seems you are nesting recursively key: ".concat(O[0], " in key: ").concat(A[0])), null) : a.translate.apply(a, O.concat([A]));
        }, s)), s.interpolation && this.interpolator.reset();
      }
      var m = s.postProcess || this.options.postProcess, p = typeof m == "string" ? [m] : m;
      return r != null && p && p.length && s.applyPostProcessor !== !1 && (r = bs.handle(p, r, A, this.options && this.options.postProcessPassResolved ? wt({
        i18nResolved: g
      }, s) : s, this)), r;
    }
  }, {
    key: "resolve",
    value: function(r) {
      var A = this, s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, g, o, a, I, C;
      return typeof r == "string" && (r = [r]), r.forEach(function(c) {
        if (!A.isValidLookup(g)) {
          var l = A.extractFromKey(c, s), u = l.key;
          o = u;
          var f = l.namespaces;
          A.options.fallbackNS && (f = f.concat(A.options.fallbackNS));
          var m = s.count !== void 0 && typeof s.count != "string", p = m && !s.ordinal && s.count === 0 && A.pluralResolver.shouldUseIntlApi(), v = s.context !== void 0 && (typeof s.context == "string" || typeof s.context == "number") && s.context !== "", O = s.lngs ? s.lngs : A.languageUtils.toResolveHierarchy(s.lng || A.language, s.fallbackLng);
          f.forEach(function(D) {
            A.isValidLookup(g) || (C = D, !oA["".concat(O[0], "-").concat(D)] && A.utils && A.utils.hasLoadedNamespace && !A.utils.hasLoadedNamespace(C) && (oA["".concat(O[0], "-").concat(D)] = !0, A.logger.warn('key "'.concat(o, '" for languages "').concat(O.join(", "), `" won't get resolved as namespace "`).concat(C, '" was not yet loaded'), "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!")), O.forEach(function(z) {
              if (!A.isValidLookup(g)) {
                I = z;
                var W = [u];
                if (A.i18nFormat && A.i18nFormat.addLookupKeys)
                  A.i18nFormat.addLookupKeys(W, u, z, D, s);
                else {
                  var K;
                  m && (K = A.pluralResolver.getSuffix(z, s.count, s));
                  var _ = "".concat(A.options.pluralSeparator, "zero");
                  if (m && (W.push(u + K), p && W.push(u + _)), v) {
                    var At = "".concat(u).concat(A.options.contextSeparator).concat(s.context);
                    W.push(At), m && (W.push(At + K), p && W.push(At + _));
                  }
                }
                for (var rt; rt = W.pop(); )
                  A.isValidLookup(g) || (a = rt, g = A.getResource(z, D, rt, s));
              }
            }));
          });
        }
      }), {
        res: g,
        usedKey: o,
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
      var g = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
      return this.i18nFormat && this.i18nFormat.getResource ? this.i18nFormat.getResource(r, A, s, g) : this.resourceStore.getResource(r, A, s, g);
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
})(pe);
function Nr(i) {
  return i.charAt(0).toUpperCase() + i.slice(1);
}
var xo = (function() {
  function i(t) {
    ne(this, i), this.options = t, this.supportedLngs = this.options.supportedLngs || !1, this.logger = _t.create("languageUtils");
  }
  return re(i, [{
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
        }) : r.length === 2 ? (r[0] = r[0].toLowerCase(), r[1] = r[1].toUpperCase(), n.indexOf(r[1].toLowerCase()) > -1 && (r[1] = Nr(r[1].toLowerCase()))) : r.length === 3 && (r[0] = r[0].toLowerCase(), r[1].length === 2 && (r[1] = r[1].toUpperCase()), r[0] !== "sgn" && r[2].length === 2 && (r[2] = r[2].toUpperCase()), n.indexOf(r[1].toLowerCase()) > -1 && (r[1] = Nr(r[1].toLowerCase())), n.indexOf(r[2].toLowerCase()) > -1 && (r[2] = Nr(r[2].toLowerCase()))), r.join("-");
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
          r = n.options.supportedLngs.find(function(g) {
            if (g.indexOf(s) === 0) return g;
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
      var r = this, A = this.getFallbackCodes(n || this.options.fallbackLng || [], e), s = [], g = function(a) {
        a && (r.isSupportedCode(a) ? s.push(a) : r.logger.warn("rejecting language code not found in supportedLngs: ".concat(a)));
      };
      return typeof e == "string" && e.indexOf("-") > -1 ? (this.options.load !== "languageOnly" && g(this.formatLanguageCode(e)), this.options.load !== "languageOnly" && this.options.load !== "currentOnly" && g(this.getScriptPartFromCode(e)), this.options.load !== "currentOnly" && g(this.getLanguagePartFromCode(e))) : typeof e == "string" && g(this.formatLanguageCode(e)), A.forEach(function(o) {
        s.indexOf(o) < 0 && g(r.formatLanguageCode(o));
      }), s;
    }
  }]), i;
})(), So = [{
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
}], Oo = {
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
}, Do = ["v1", "v2", "v3"], IA = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
};
function Bo() {
  var i = {};
  return So.forEach(function(t) {
    t.lngs.forEach(function(e) {
      i[e] = {
        numbers: t.nr,
        plurals: Oo[t.fc]
      };
    });
  }), i;
}
var To = (function() {
  function i(t) {
    var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    ne(this, i), this.languageUtils = t, this.options = e, this.logger = _t.create("pluralResolver"), (!this.options.compatibilityJSON || this.options.compatibilityJSON === "v4") && (typeof Intl > "u" || !Intl.PluralRules) && (this.options.compatibilityJSON = "v3", this.logger.error("Your environment seems not to be Intl API compatible, use an Intl.PluralRules polyfill. Will fallback to the compatibilityJSON v3 format handling.")), this.rules = Bo();
  }
  return re(i, [{
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
      return A ? this.shouldUseIntlApi() ? A.resolvedOptions().pluralCategories.sort(function(s, g) {
        return IA[s] - IA[g];
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
      var g = function() {
        return r.options.prepend && s.toString() ? r.options.prepend + s.toString() : s.toString();
      };
      return this.options.compatibilityJSON === "v1" ? s === 1 ? "" : typeof s == "number" ? "_plural_".concat(s.toString()) : g() : this.options.compatibilityJSON === "v2" || this.options.simplifyPluralSuffix && e.numbers.length === 2 && e.numbers[0] === 1 ? g() : this.options.prepend && A.toString() ? this.options.prepend + A.toString() : A.toString();
    }
  }, {
    key: "shouldUseIntlApi",
    value: function() {
      return !Do.includes(this.options.compatibilityJSON);
    }
  }]), i;
})();
function CA(i, t) {
  var e = Object.keys(i);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(i);
    t && (n = n.filter(function(r) {
      return Object.getOwnPropertyDescriptor(i, r).enumerable;
    })), e.push.apply(e, n);
  }
  return e;
}
function Ft(i) {
  for (var t = 1; t < arguments.length; t++) {
    var e = arguments[t] != null ? arguments[t] : {};
    t % 2 ? CA(Object(e), !0).forEach(function(n) {
      ve(i, n, e[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(e)) : CA(Object(e)).forEach(function(n) {
      Object.defineProperty(i, n, Object.getOwnPropertyDescriptor(e, n));
    });
  }
  return i;
}
var Lo = (function() {
  function i() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    ne(this, i), this.logger = _t.create("interpolator"), this.options = t, this.format = t.interpolation && t.interpolation.format || function(e) {
      return e;
    }, this.init(t);
  }
  return re(i, [{
    key: "init",
    value: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      e.interpolation || (e.interpolation = {
        escapeValue: !0
      });
      var n = e.interpolation;
      this.escape = n.escape !== void 0 ? n.escape : yo, this.escapeValue = n.escapeValue !== void 0 ? n.escapeValue : !0, this.useRawValueToEscape = n.useRawValueToEscape !== void 0 ? n.useRawValueToEscape : !1, this.prefix = n.prefix ? Ze(n.prefix) : n.prefixEscaped || "{{", this.suffix = n.suffix ? Ze(n.suffix) : n.suffixEscaped || "}}", this.formatSeparator = n.formatSeparator ? n.formatSeparator : n.formatSeparator || ",", this.unescapePrefix = n.unescapeSuffix ? "" : n.unescapePrefix || "-", this.unescapeSuffix = this.unescapePrefix ? "" : n.unescapeSuffix || "", this.nestingPrefix = n.nestingPrefix ? Ze(n.nestingPrefix) : n.nestingPrefixEscaped || Ze("$t("), this.nestingSuffix = n.nestingSuffix ? Ze(n.nestingSuffix) : n.nestingSuffixEscaped || Ze(")"), this.nestingOptionsSeparator = n.nestingOptionsSeparator ? n.nestingOptionsSeparator : n.nestingOptionsSeparator || ",", this.maxReplaces = n.maxReplaces ? n.maxReplaces : 1e3, this.alwaysFormat = n.alwaysFormat !== void 0 ? n.alwaysFormat : !1, this.resetRegExp();
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
      var s = this, g, o, a, I = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};
      function C(m) {
        return m.replace(/\$/g, "$$$$");
      }
      var c = function(p) {
        if (p.indexOf(s.formatSeparator) < 0) {
          var v = AA(n, I, p);
          return s.alwaysFormat ? s.format(v, void 0, r, Ft(Ft(Ft({}, A), n), {}, {
            interpolationkey: p
          })) : v;
        }
        var O = p.split(s.formatSeparator), D = O.shift().trim(), z = O.join(s.formatSeparator).trim();
        return s.format(AA(n, I, D), z, r, Ft(Ft(Ft({}, A), n), {}, {
          interpolationkey: D
        }));
      };
      this.resetRegExp();
      var l = A && A.missingInterpolationHandler || this.options.missingInterpolationHandler, u = A && A.interpolation && A.interpolation.skipOnVariables !== void 0 ? A.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables, f = [{
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
      return f.forEach(function(m) {
        for (a = 0; g = m.regex.exec(e); ) {
          var p = g[1].trim();
          if (o = c(p), o === void 0)
            if (typeof l == "function") {
              var v = l(e, g, A);
              o = typeof v == "string" ? v : "";
            } else if (A && A.hasOwnProperty(p))
              o = "";
            else if (u) {
              o = g[0];
              continue;
            } else
              s.logger.warn("missed to pass in variable ".concat(p, " for interpolating ").concat(e)), o = "";
          else typeof o != "string" && !s.useRawValueToEscape && (o = rA(o));
          var O = m.safeValue(o);
          if (e = e.replace(g[0], O), u ? (m.regex.lastIndex += o.length, m.regex.lastIndex -= g[0].length) : m.regex.lastIndex = 0, a++, a >= s.maxReplaces)
            break;
        }
      }), e;
    }
  }, {
    key: "nest",
    value: function(e, n) {
      var r = this, A = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, s, g, o = Ft({}, A);
      o.applyPostProcessor = !1, delete o.defaultValue;
      function a(l, u) {
        var f = this.nestingOptionsSeparator;
        if (l.indexOf(f) < 0) return l;
        var m = l.split(new RegExp("".concat(f, "[ ]*{"))), p = "{".concat(m[1]);
        l = m[0], p = this.interpolate(p, o);
        var v = p.match(/'/g), O = p.match(/"/g);
        (v && v.length % 2 === 0 && !O || O.length % 2 !== 0) && (p = p.replace(/'/g, '"'));
        try {
          o = JSON.parse(p), u && (o = Ft(Ft({}, u), o));
        } catch (D) {
          return this.logger.warn("failed parsing options string in nesting for key ".concat(l), D), "".concat(l).concat(f).concat(p);
        }
        return delete o.defaultValue, l;
      }
      for (; s = this.nestingRegexp.exec(e); ) {
        var I = [], C = !1;
        if (s[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(s[1])) {
          var c = s[1].split(this.formatSeparator).map(function(l) {
            return l.trim();
          });
          s[1] = c.shift(), I = c, C = !0;
        }
        if (g = n(a.call(this, s[1].trim(), o), o), g && s[0] === e && typeof g != "string") return g;
        typeof g != "string" && (g = rA(g)), g || (this.logger.warn("missed to resolve ".concat(s[1], " for nesting ").concat(e)), g = ""), C && (g = I.reduce(function(l, u) {
          return r.format(l, u, A.lng, Ft(Ft({}, A), {}, {
            interpolationkey: s[1].trim()
          }));
        }, g.trim())), e = e.replace(s[0], g), this.regexp.lastIndex = 0;
      }
      return e;
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
function le(i) {
  for (var t = 1; t < arguments.length; t++) {
    var e = arguments[t] != null ? arguments[t] : {};
    t % 2 ? cA(Object(e), !0).forEach(function(n) {
      ve(i, n, e[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(e)) : cA(Object(e)).forEach(function(n) {
      Object.defineProperty(i, n, Object.getOwnPropertyDescriptor(e, n));
    });
  }
  return i;
}
function jo(i) {
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
          var g = s.split(":"), o = lo(g), a = o[0], I = o.slice(1), C = I.join(":").trim().replace(/^'+|'+$/g, "");
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
function Fe(i) {
  var t = {};
  return function(n, r, A) {
    var s = r + JSON.stringify(A), g = t[s];
    return g || (g = i(r, A), t[s] = g), g(n);
  };
}
var ko = (function() {
  function i() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    ne(this, i), this.logger = _t.create("formatter"), this.options = t, this.formats = {
      number: Fe(function(e, n) {
        var r = new Intl.NumberFormat(e, n);
        return function(A) {
          return r.format(A);
        };
      }),
      currency: Fe(function(e, n) {
        var r = new Intl.NumberFormat(e, le(le({}, n), {}, {
          style: "currency"
        }));
        return function(A) {
          return r.format(A);
        };
      }),
      datetime: Fe(function(e, n) {
        var r = new Intl.DateTimeFormat(e, le({}, n));
        return function(A) {
          return r.format(A);
        };
      }),
      relativetime: Fe(function(e, n) {
        var r = new Intl.RelativeTimeFormat(e, le({}, n));
        return function(A) {
          return r.format(A, n.range || "day");
        };
      }),
      list: Fe(function(e, n) {
        var r = new Intl.ListFormat(e, le({}, n));
        return function(A) {
          return r.format(A);
        };
      })
    }, this.init(t);
  }
  return re(i, [{
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
      this.formats[e.toLowerCase().trim()] = Fe(n);
    }
  }, {
    key: "format",
    value: function(e, n, r, A) {
      var s = this, g = n.split(this.formatSeparator), o = g.reduce(function(a, I) {
        var C = jo(I), c = C.formatName, l = C.formatOptions;
        if (s.formats[c]) {
          var u = a;
          try {
            var f = A && A.formatParams && A.formatParams[A.interpolationkey] || {}, m = f.locale || f.lng || A.locale || A.lng || r;
            u = s.formats[c](a, m, le(le(le({}, l), A), f));
          } catch (p) {
            s.logger.warn(p);
          }
          return u;
        } else
          s.logger.warn("there was no format function for ".concat(c));
        return a;
      }, e);
      return o;
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
function uA(i) {
  for (var t = 1; t < arguments.length; t++) {
    var e = arguments[t] != null ? arguments[t] : {};
    t % 2 ? lA(Object(e), !0).forEach(function(n) {
      ve(i, n, e[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(e)) : lA(Object(e)).forEach(function(n) {
      Object.defineProperty(i, n, Object.getOwnPropertyDescriptor(e, n));
    });
  }
  return i;
}
function No(i) {
  var t = Go();
  return function() {
    var n = te(i), r;
    if (t) {
      var A = te(this).constructor;
      r = Reflect.construct(n, arguments, A);
    } else
      r = n.apply(this, arguments);
    return Tn(this, r);
  };
}
function Go() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
function Xo(i, t) {
  i.pending[t] !== void 0 && (delete i.pending[t], i.pendingCount--);
}
var Zo = (function(i) {
  mr(e, i);
  var t = No(e);
  function e(n, r, A) {
    var s, g = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    return ne(this, e), s = t.call(this), yr && pe.call(de(s)), s.backend = n, s.store = r, s.services = A, s.languageUtils = A.languageUtils, s.options = g, s.logger = _t.create("backendConnector"), s.waitingReads = [], s.maxParallelReads = g.maxParallelReads || 10, s.readingCalls = 0, s.maxRetries = g.maxRetries >= 0 ? g.maxRetries : 5, s.retryTimeout = g.retryTimeout >= 1 ? g.retryTimeout : 350, s.state = {}, s.queue = [], s.backend && s.backend.init && s.backend.init(A, g.backend, g), s;
  }
  return re(e, [{
    key: "queueLoad",
    value: function(r, A, s, g) {
      var o = this, a = {}, I = {}, C = {}, c = {};
      return r.forEach(function(l) {
        var u = !0;
        A.forEach(function(f) {
          var m = "".concat(l, "|").concat(f);
          !s.reload && o.store.hasResourceBundle(l, f) ? o.state[m] = 2 : o.state[m] < 0 || (o.state[m] === 1 ? I[m] === void 0 && (I[m] = !0) : (o.state[m] = 1, u = !1, I[m] === void 0 && (I[m] = !0), a[m] === void 0 && (a[m] = !0), c[f] === void 0 && (c[f] = !0)));
        }), u || (C[l] = !0);
      }), (Object.keys(a).length || Object.keys(I).length) && this.queue.push({
        pending: I,
        pendingCount: Object.keys(I).length,
        loaded: {},
        errors: [],
        callback: g
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
      var g = r.split("|"), o = g[0], a = g[1];
      A && this.emit("failedLoading", o, a, A), s && this.store.addResourceBundle(o, a, s), this.state[r] = A ? -1 : 2;
      var I = {};
      this.queue.forEach(function(C) {
        po(C.loaded, [o], a), Xo(C, r), A && C.errors.push(A), C.pendingCount === 0 && !C.done && (Object.keys(C.loaded).forEach(function(c) {
          I[c] || (I[c] = {});
          var l = C.loaded[c];
          l.length && l.forEach(function(u) {
            I[c][u] === void 0 && (I[c][u] = !0);
          });
        }), C.done = !0, C.errors.length ? C.callback(C.errors) : C.callback());
      }), this.emit("loaded", I), this.queue = this.queue.filter(function(C) {
        return !C.done;
      });
    }
  }, {
    key: "read",
    value: function(r, A, s) {
      var g = this, o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0, a = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : this.retryTimeout, I = arguments.length > 5 ? arguments[5] : void 0;
      if (!r.length) return I(null, {});
      if (this.readingCalls >= this.maxParallelReads) {
        this.waitingReads.push({
          lng: r,
          ns: A,
          fcName: s,
          tried: o,
          wait: a,
          callback: I
        });
        return;
      }
      return this.readingCalls++, this.backend[s](r, A, function(C, c) {
        if (g.readingCalls--, g.waitingReads.length > 0) {
          var l = g.waitingReads.shift();
          g.read(l.lng, l.ns, l.fcName, l.tried, l.wait, l.callback);
        }
        if (C && c && o < g.maxRetries) {
          setTimeout(function() {
            g.read.call(g, r, A, s, o + 1, a * 2, I);
          }, a);
          return;
        }
        I(C, c);
      });
    }
  }, {
    key: "prepareLoading",
    value: function(r, A) {
      var s = this, g = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = arguments.length > 3 ? arguments[3] : void 0;
      if (!this.backend)
        return this.logger.warn("No backend was added via i18next.use. Will not load resources."), o && o();
      typeof r == "string" && (r = this.languageUtils.toResolveHierarchy(r)), typeof A == "string" && (A = [A]);
      var a = this.queueLoad(r, A, g, o);
      if (!a.toLoad.length)
        return a.pending.length || o(), null;
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
      var A = this, s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", g = r.split("|"), o = g[0], a = g[1];
      this.read(o, a, "read", void 0, void 0, function(I, C) {
        I && A.logger.warn("".concat(s, "loading namespace ").concat(a, " for language ").concat(o, " failed"), I), !I && C && A.logger.log("".concat(s, "loaded namespace ").concat(a, " for language ").concat(o), C), A.loaded(r, I, C);
      });
    }
  }, {
    key: "saveMissing",
    value: function(r, A, s, g, o) {
      var a = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {};
      if (this.services.utils && this.services.utils.hasLoadedNamespace && !this.services.utils.hasLoadedNamespace(A)) {
        this.logger.warn('did not save key "'.concat(s, '" as the namespace "').concat(A, '" was not yet loaded'), "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
        return;
      }
      s == null || s === "" || (this.backend && this.backend.create && this.backend.create(r, A, s, g, null, uA(uA({}, a), {}, {
        isUpdate: o
      })), !(!r || !r[0]) && this.store.addResource(r[0], A, s, g));
    }
  }]), e;
})(pe);
function Fo() {
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
      if (zt(t[1]) === "object" && (e = t[1]), typeof t[1] == "string" && (e.defaultValue = t[1]), typeof t[2] == "string" && (e.tDescription = t[2]), zt(t[2]) === "object" || zt(t[3]) === "object") {
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
function hA(i) {
  return typeof i.ns == "string" && (i.ns = [i.ns]), typeof i.fallbackLng == "string" && (i.fallbackLng = [i.fallbackLng]), typeof i.fallbackNS == "string" && (i.fallbackNS = [i.fallbackNS]), i.supportedLngs && i.supportedLngs.indexOf("cimode") < 0 && (i.supportedLngs = i.supportedLngs.concat(["cimode"])), i;
}
function fA(i, t) {
  var e = Object.keys(i);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(i);
    t && (n = n.filter(function(r) {
      return Object.getOwnPropertyDescriptor(i, r).enumerable;
    })), e.push.apply(e, n);
  }
  return e;
}
function Kt(i) {
  for (var t = 1; t < arguments.length; t++) {
    var e = arguments[t] != null ? arguments[t] : {};
    t % 2 ? fA(Object(e), !0).forEach(function(n) {
      ve(i, n, e[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(e)) : fA(Object(e)).forEach(function(n) {
      Object.defineProperty(i, n, Object.getOwnPropertyDescriptor(e, n));
    });
  }
  return i;
}
function Uo(i) {
  var t = zo();
  return function() {
    var n = te(i), r;
    if (t) {
      var A = te(this).constructor;
      r = Reflect.construct(n, arguments, A);
    } else
      r = n.apply(this, arguments);
    return Tn(this, r);
  };
}
function zo() {
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
function Qo(i) {
  var t = Object.getOwnPropertyNames(Object.getPrototypeOf(i));
  t.forEach(function(e) {
    typeof i[e] == "function" && (i[e] = i[e].bind(i));
  });
}
var Cr = (function(i) {
  mr(e, i);
  var t = Uo(e);
  function e() {
    var n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, A = arguments.length > 1 ? arguments[1] : void 0;
    if (ne(this, e), n = t.call(this), yr && pe.call(de(n)), n.options = hA(r), n.services = {}, n.logger = _t, n.modules = {
      external: []
    }, Qo(de(n)), A && !n.isInitialized && !r.isClone) {
      if (!n.options.initImmediate)
        return n.init(r, A), Tn(n, de(n));
      setTimeout(function() {
        n.init(r, A);
      }, 0);
    }
    return n;
  }
  return re(e, [{
    key: "init",
    value: function() {
      var r = this, A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, s = arguments.length > 1 ? arguments[1] : void 0;
      typeof A == "function" && (s = A, A = {}), !A.defaultNS && A.defaultNS !== !1 && A.ns && (typeof A.ns == "string" ? A.defaultNS = A.ns : A.ns.indexOf("translation") < 0 && (A.defaultNS = A.ns[0]));
      var g = Fo();
      this.options = Kt(Kt(Kt({}, g), this.options), hA(A)), this.options.compatibilityAPI !== "v1" && (this.options.interpolation = Kt(Kt({}, g.interpolation), this.options.interpolation)), A.keySeparator !== void 0 && (this.options.userDefinedKeySeparator = A.keySeparator), A.nsSeparator !== void 0 && (this.options.userDefinedNsSeparator = A.nsSeparator);
      function o(p) {
        return p ? typeof p == "function" ? new p() : p : null;
      }
      if (!this.options.isClone) {
        this.modules.logger ? _t.init(o(this.modules.logger), this.options) : _t.init(null, this.options);
        var a;
        this.modules.formatter ? a = this.modules.formatter : typeof Intl < "u" && (a = ko);
        var I = new xo(this.options);
        this.store = new Mo(this.options.resources, this.options);
        var C = this.services;
        C.logger = _t, C.resourceStore = this.store, C.languageUtils = I, C.pluralResolver = new To(I, {
          prepend: this.options.pluralSeparator,
          compatibilityJSON: this.options.compatibilityJSON,
          simplifyPluralSuffix: this.options.simplifyPluralSuffix
        }), a && (!this.options.interpolation.format || this.options.interpolation.format === g.interpolation.format) && (C.formatter = o(a), C.formatter.init(C, this.options), this.options.interpolation.format = C.formatter.format.bind(C.formatter)), C.interpolator = new Lo(this.options), C.utils = {
          hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
        }, C.backendConnector = new Zo(o(this.modules.backend), C.resourceStore, C, this.options), C.backendConnector.on("*", function(p) {
          for (var v = arguments.length, O = new Array(v > 1 ? v - 1 : 0), D = 1; D < v; D++)
            O[D - 1] = arguments[D];
          r.emit.apply(r, [p].concat(O));
        }), this.modules.languageDetector && (C.languageDetector = o(this.modules.languageDetector), C.languageDetector.init(C, this.options.detection, this.options)), this.modules.i18nFormat && (C.i18nFormat = o(this.modules.i18nFormat), C.i18nFormat.init && C.i18nFormat.init(this)), this.translator = new aA(this.services, this.options), this.translator.on("*", function(p) {
          for (var v = arguments.length, O = new Array(v > 1 ? v - 1 : 0), D = 1; D < v; D++)
            O[D - 1] = arguments[D];
          r.emit.apply(r, [p].concat(O));
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
      var u = ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"];
      u.forEach(function(p) {
        r[p] = function() {
          var v;
          return (v = r.store)[p].apply(v, arguments), r;
        };
      });
      var f = In(), m = function() {
        var v = function(D, z) {
          r.isInitialized && !r.initializedStoreOnce && r.logger.warn("init: i18next is already initialized. You should call init just once!"), r.isInitialized = !0, r.options.isClone || r.logger.log("initialized", r.options), r.emit("initialized", r.options), f.resolve(z), s(D, z);
        };
        if (r.languages && r.options.compatibilityAPI !== "v1" && !r.isInitialized) return v(null, r.t.bind(r));
        r.changeLanguage(r.options.lng, v);
      };
      return this.options.resources || !this.options.initImmediate ? m() : setTimeout(m, 0), f;
    }
  }, {
    key: "loadResources",
    value: function(r) {
      var A = this, s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Jn, g = s, o = typeof r == "string" ? r : this.language;
      if (typeof r == "function" && (g = r), !this.options.resources || this.options.partialBundledLanguages) {
        if (o && o.toLowerCase() === "cimode") return g();
        var a = [], I = function(l) {
          if (l) {
            var u = A.services.languageUtils.toResolveHierarchy(l);
            u.forEach(function(f) {
              a.indexOf(f) < 0 && a.push(f);
            });
          }
        };
        if (o)
          I(o);
        else {
          var C = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
          C.forEach(function(c) {
            return I(c);
          });
        }
        this.options.preload && this.options.preload.forEach(function(c) {
          return I(c);
        }), this.services.backendConnector.load(a, this.options.ns, function(c) {
          !c && !A.resolvedLanguage && A.language && A.setResolvedLanguage(A.language), g(c);
        });
      } else
        g(null);
    }
  }, {
    key: "reloadResources",
    value: function(r, A, s) {
      var g = In();
      return r || (r = this.languages), A || (A = this.options.ns), s || (s = Jn), this.services.backendConnector.reload(r, A, function(o) {
        g.resolve(), s(o);
      }), g;
    }
  }, {
    key: "use",
    value: function(r) {
      if (!r) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
      if (!r.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
      return r.type === "backend" && (this.modules.backend = r), (r.type === "logger" || r.log && r.warn && r.error) && (this.modules.logger = r), r.type === "languageDetector" && (this.modules.languageDetector = r), r.type === "i18nFormat" && (this.modules.i18nFormat = r), r.type === "postProcessor" && bs.addPostProcessor(r), r.type === "formatter" && (this.modules.formatter = r), r.type === "3rdParty" && this.modules.external.push(r), this;
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
      var g = In();
      this.emit("languageChanging", r);
      var o = function(c) {
        s.language = c, s.languages = s.services.languageUtils.toResolveHierarchy(c), s.resolvedLanguage = void 0, s.setResolvedLanguage(c);
      }, a = function(c, l) {
        l ? (o(l), s.translator.changeLanguage(l), s.isLanguageChangingTo = void 0, s.emit("languageChanged", l), s.logger.log("languageChanged", l)) : s.isLanguageChangingTo = void 0, g.resolve(function() {
          return s.t.apply(s, arguments);
        }), A && A(c, function() {
          return s.t.apply(s, arguments);
        });
      }, I = function(c) {
        !r && !c && s.services.languageDetector && (c = []);
        var l = typeof c == "string" ? c : s.services.languageUtils.getBestMatchFromCodes(c);
        l && (s.language || o(l), s.translator.language || s.translator.changeLanguage(l), s.services.languageDetector && s.services.languageDetector.cacheUserLanguage(l)), s.loadResources(l, function(u) {
          a(u, l);
        });
      };
      return !r && this.services.languageDetector && !this.services.languageDetector.async ? I(this.services.languageDetector.detect()) : !r && this.services.languageDetector && this.services.languageDetector.async ? this.services.languageDetector.detect(I) : I(r), g;
    }
  }, {
    key: "getFixedT",
    value: function(r, A, s) {
      var g = this, o = function a(I, C) {
        var c;
        if (zt(C) !== "object") {
          for (var l = arguments.length, u = new Array(l > 2 ? l - 2 : 0), f = 2; f < l; f++)
            u[f - 2] = arguments[f];
          c = g.options.overloadTranslationOptionHandler([I, C].concat(u));
        } else
          c = Kt({}, C);
        c.lng = c.lng || a.lng, c.lngs = c.lngs || a.lngs, c.ns = c.ns || a.ns, c.keyPrefix = c.keyPrefix || s || a.keyPrefix;
        var m = g.options.keySeparator || ".", p = c.keyPrefix ? "".concat(c.keyPrefix).concat(m).concat(I) : I;
        return g.t(p, c);
      };
      return typeof r == "string" ? o.lng = r : o.lngs = r, o.ns = A, o.keyPrefix = s, o;
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
      var g = this.resolvedLanguage || this.languages[0], o = this.options ? this.options.fallbackLng : !1, a = this.languages[this.languages.length - 1];
      if (g.toLowerCase() === "cimode") return !0;
      var I = function(l, u) {
        var f = A.services.backendConnector.state["".concat(l, "|").concat(u)];
        return f === -1 || f === 2;
      };
      if (s.precheck) {
        var C = s.precheck(this, I);
        if (C !== void 0) return C;
      }
      return !!(this.hasResourceBundle(g, r) || !this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages || I(g, r) && (!o || I(a, r)));
    }
  }, {
    key: "loadNamespaces",
    value: function(r, A) {
      var s = this, g = In();
      return this.options.ns ? (typeof r == "string" && (r = [r]), r.forEach(function(o) {
        s.options.ns.indexOf(o) < 0 && s.options.ns.push(o);
      }), this.loadResources(function(o) {
        g.resolve(), A && A(o);
      }), g) : (A && A(), Promise.resolve());
    }
  }, {
    key: "loadLanguages",
    value: function(r, A) {
      var s = In();
      typeof r == "string" && (r = [r]);
      var g = this.options.preload || [], o = r.filter(function(a) {
        return g.indexOf(a) < 0;
      });
      return o.length ? (this.options.preload = g.concat(o), this.loadResources(function(a) {
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
      var r = this, A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Jn, g = Kt(Kt(Kt({}, this.options), A), {
        isClone: !0
      }), o = new e(g);
      (A.debug !== void 0 || A.prefix !== void 0) && (o.logger = o.logger.clone(A));
      var a = ["store", "services", "language"];
      return a.forEach(function(I) {
        o[I] = r[I];
      }), o.services = Kt({}, this.services), o.services.utils = {
        hasLoadedNamespace: o.hasLoadedNamespace.bind(o)
      }, o.translator = new aA(o.services, o.options), o.translator.on("*", function(I) {
        for (var C = arguments.length, c = new Array(C > 1 ? C - 1 : 0), l = 1; l < C; l++)
          c[l - 1] = arguments[l];
        o.emit.apply(o, [I].concat(c));
      }), o.init(g, s), o.translator.options = o.options, o.translator.backendConnector.services.utils = {
        hasLoadedNamespace: o.hasLoadedNamespace.bind(o)
      }, o;
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
})(pe);
ve(Cr, "createInstance", function() {
  var i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = arguments.length > 1 ? arguments[1] : void 0;
  return new Cr(i, t);
});
var vt = Cr.createInstance();
vt.createInstance = Cr.createInstance;
vt.createInstance;
vt.init;
vt.loadResources;
vt.reloadResources;
vt.use;
vt.changeLanguage;
vt.getFixedT;
vt.t;
vt.exists;
vt.setDefaultNamespace;
vt.hasLoadedNamespace;
vt.loadNamespaces;
vt.loadLanguages;
function ti(i) {
  "@babel/helpers - typeof";
  return ti = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ti(i);
}
function ws() {
  return typeof XMLHttpRequest == "function" || (typeof XMLHttpRequest > "u" ? "undefined" : ti(XMLHttpRequest)) === "object";
}
function Wo(i) {
  return !!i && typeof i.then == "function";
}
function Ho(i) {
  return Wo(i) ? i : Promise.resolve(i);
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
function pA(i) {
  for (var t = 1; t < arguments.length; t++) {
    var e = arguments[t] != null ? arguments[t] : {};
    t % 2 ? dA(Object(e), !0).forEach(function(n) {
      Vo(i, n, e[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(e)) : dA(Object(e)).forEach(function(n) {
      Object.defineProperty(i, n, Object.getOwnPropertyDescriptor(e, n));
    });
  }
  return i;
}
function Vo(i, t, e) {
  return (t = Yo(t)) in i ? Object.defineProperty(i, t, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : i[t] = e, i;
}
function Yo(i) {
  var t = Ko(i, "string");
  return Be(t) == "symbol" ? t : t + "";
}
function Ko(i, t) {
  if (Be(i) != "object" || !i) return i;
  var e = i[Symbol.toPrimitive];
  if (e !== void 0) {
    var n = e.call(i, t);
    if (Be(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(i);
}
function Be(i) {
  "@babel/helpers - typeof";
  return Be = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Be(i);
}
var me = typeof fetch == "function" ? fetch : void 0;
typeof globalThis < "u" && globalThis.fetch ? me = globalThis.fetch : typeof window < "u" && window.fetch && (me = window.fetch);
var pn;
ws() && (typeof globalThis < "u" && globalThis.XMLHttpRequest ? pn = globalThis.XMLHttpRequest : typeof window < "u" && window.XMLHttpRequest && (pn = window.XMLHttpRequest));
var cr;
typeof ActiveXObject == "function" && (typeof globalThis < "u" && globalThis.ActiveXObject ? cr = globalThis.ActiveXObject : typeof window < "u" && window.ActiveXObject && (cr = window.ActiveXObject));
typeof me != "function" && (me = void 0);
if (!me && !pn && !cr)
  try {
    import("./browser-ponyfill-CaMnhrNS.js").then((i) => i.b).then(function(i) {
      me = i.default;
    }).catch(function() {
    });
  } catch {
  }
var ei = function(t, e) {
  if (e && Be(e) === "object") {
    var n = "";
    for (var r in e)
      n += "&" + encodeURIComponent(r) + "=" + encodeURIComponent(e[r]);
    if (!n) return t;
    t = t + (t.indexOf("?") !== -1 ? "&" : "?") + n.slice(1);
  }
  return t;
}, mA = function(t, e, n, r) {
  var A = function(o) {
    if (!o.ok) return n(o.statusText || "Error", {
      status: o.status
    });
    o.text().then(function(a) {
      n(null, {
        status: o.status,
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
  typeof fetch == "function" ? fetch(t, e).then(A).catch(n) : me(t, e).then(A).catch(n);
}, yA = !1, Jo = function(t, e, n, r) {
  t.queryStringParams && (e = ei(e, t.queryStringParams));
  var A = pA({}, typeof t.customHeaders == "function" ? t.customHeaders() : t.customHeaders);
  typeof window > "u" && typeof globalThis < "u" && typeof globalThis.process < "u" && globalThis.process.versions && globalThis.process.versions.node && (A["User-Agent"] = "i18next-http-backend (node/".concat(globalThis.process.version, "; ").concat(globalThis.process.platform, " ").concat(globalThis.process.arch, ")")), n && (A["Content-Type"] = "application/json");
  var s = typeof t.requestOptions == "function" ? t.requestOptions(n) : t.requestOptions, g = pA({
    method: n ? "POST" : "GET",
    body: n ? t.stringify(n) : void 0,
    headers: A
  }, yA ? {} : s), o = typeof t.alternateFetch == "function" && t.alternateFetch.length >= 1 ? t.alternateFetch : void 0;
  try {
    mA(e, g, r, o);
  } catch (a) {
    if (!s || Object.keys(s).length === 0 || !a.message || a.message.indexOf("not implemented") < 0)
      return r(a);
    try {
      Object.keys(s).forEach(function(I) {
        delete g[I];
      }), mA(e, g, r, o), yA = !0;
    } catch (I) {
      r(I);
    }
  }
}, qo = function(t, e, n, r) {
  n && Be(n) === "object" && (n = ei("", n).slice(1)), t.queryStringParams && (e = ei(e, t.queryStringParams));
  try {
    var A = pn ? new pn() : new cr("MSXML2.XMLHTTP.3.0");
    A.open(n ? "POST" : "GET", e, 1), t.crossDomain || A.setRequestHeader("X-Requested-With", "XMLHttpRequest"), A.withCredentials = !!t.withCredentials, n && A.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), A.overrideMimeType && A.overrideMimeType("application/json");
    var s = t.customHeaders;
    if (s = typeof s == "function" ? s() : s, s)
      for (var g in s)
        A.setRequestHeader(g, s[g]);
    A.onreadystatechange = function() {
      A.readyState > 3 && r(A.status >= 400 ? A.statusText : null, {
        status: A.status,
        data: A.responseText
      });
    }, A.send(n);
  } catch (o) {
    console && console.log(o);
  }
}, _o = function(t, e, n, r) {
  if (typeof n == "function" && (r = n, n = void 0), r = r || function() {
  }, me && e.indexOf("file:") !== 0)
    return Jo(t, e, n, r);
  if (ws() || typeof ActiveXObject == "function")
    return qo(t, e, n, r);
  r(new Error("No fetch and no xhr implementation found!"));
};
function tn(i) {
  "@babel/helpers - typeof";
  return tn = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, tn(i);
}
function vA(i, t) {
  var e = Object.keys(i);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(i);
    t && (n = n.filter(function(r) {
      return Object.getOwnPropertyDescriptor(i, r).enumerable;
    })), e.push.apply(e, n);
  }
  return e;
}
function Gr(i) {
  for (var t = 1; t < arguments.length; t++) {
    var e = arguments[t] != null ? arguments[t] : {};
    t % 2 ? vA(Object(e), !0).forEach(function(n) {
      Es(i, n, e[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(e)) : vA(Object(e)).forEach(function(n) {
      Object.defineProperty(i, n, Object.getOwnPropertyDescriptor(e, n));
    });
  }
  return i;
}
function $o(i, t) {
  if (!(i instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function ta(i, t) {
  for (var e = 0; e < t.length; e++) {
    var n = t[e];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(i, Ms(n.key), n);
  }
}
function ea(i, t, e) {
  return t && ta(i.prototype, t), Object.defineProperty(i, "prototype", { writable: !1 }), i;
}
function Es(i, t, e) {
  return (t = Ms(t)) in i ? Object.defineProperty(i, t, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : i[t] = e, i;
}
function Ms(i) {
  var t = na(i, "string");
  return tn(t) == "symbol" ? t : t + "";
}
function na(i, t) {
  if (tn(i) != "object" || !i) return i;
  var e = i[Symbol.toPrimitive];
  if (e !== void 0) {
    var n = e.call(i, t);
    if (tn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(i);
}
var ra = function() {
  return {
    loadPath: "/locales/{{lng}}/{{ns}}.json",
    addPath: "/locales/add/{{lng}}/{{ns}}",
    parse: function(e) {
      return JSON.parse(e);
    },
    stringify: JSON.stringify,
    parsePayload: function(e, n, r) {
      return Es({}, n, r || "");
    },
    parseLoadPayload: function(e, n) {
    },
    request: _o,
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
}, Ps = (function() {
  function i(t) {
    var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    $o(this, i), this.services = t, this.options = e, this.allOptions = n, this.type = "backend", this.init(t, e, n);
  }
  return ea(i, [{
    key: "init",
    value: function(e) {
      var n = this, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, A = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (this.services = e, this.options = Gr(Gr(Gr({}, ra()), this.options || {}), r), this.allOptions = A, this.services && this.options.reloadInterval) {
        var s = setInterval(function() {
          return n.reload();
        }, this.options.reloadInterval);
        tn(s) === "object" && typeof s.unref == "function" && s.unref();
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
      var g = this, o = this.options.loadPath;
      typeof this.options.loadPath == "function" && (o = this.options.loadPath(e, r)), o = Ho(o), o.then(function(a) {
        if (!a) return s(null, {});
        var I = g.services.interpolator.interpolate(a, {
          lng: e.join("+"),
          ns: r.join("+")
        });
        g.loadUrl(I, s, n, A);
      });
    }
  }, {
    key: "loadUrl",
    value: function(e, n, r, A) {
      var s = this, g = typeof r == "string" ? [r] : r, o = typeof A == "string" ? [A] : A, a = this.options.parseLoadPayload(g, o);
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
        var u, f;
        try {
          typeof C.data == "string" ? u = s.options.parse(C.data, r, A) : u = C.data;
        } catch {
          f = "failed parsing " + e + " to json";
        }
        if (f) return n(f, !1);
        n(null, u);
      });
    }
  }, {
    key: "create",
    value: function(e, n, r, A, s) {
      var g = this;
      if (this.options.addPath) {
        typeof e == "string" && (e = [e]);
        var o = this.options.parsePayload(n, r, A), a = 0, I = [], C = [];
        e.forEach(function(c) {
          var l = g.options.addPath;
          typeof g.options.addPath == "function" && (l = g.options.addPath(c, n));
          var u = g.services.interpolator.interpolate(l, {
            lng: c,
            ns: n
          });
          g.options.request(g.options, u, o, function(f, m) {
            a += 1, I.push(f), C.push(m), a === e.length && typeof s == "function" && s(I, C);
          });
        });
      }
    }
  }, {
    key: "reload",
    value: function() {
      var e = this, n = this.services, r = n.backendConnector, A = n.languageUtils, s = n.logger, g = r.language;
      if (!(g && g.toLowerCase() === "cimode")) {
        var o = [], a = function(C) {
          var c = A.toResolveHierarchy(C);
          c.forEach(function(l) {
            o.indexOf(l) < 0 && o.push(l);
          });
        };
        a(g), this.allOptions.preload && this.allOptions.preload.forEach(function(I) {
          return a(I);
        }), o.forEach(function(I) {
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
Ps.type = "backend";
class Ie {
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
let Dt = class extends Ie {
  constructor(e, n) {
    super(e);
    w(this, "detail");
    this.detail = n;
  }
};
const ia = () => {
  const i = window.navigator.userAgent.toLowerCase();
  try {
    let t;
    return i.indexOf("chrome") != -1 ? (t = (navigator.languages[0] || navigator.browserLanguage || navigator.language || navigator.userLanguage).split(";"), t[0]) : (t = (navigator.browserLanguage || navigator.language || navigator.userLanguage).split(";"), t[0]);
  } catch {
    return "";
  }
}, Aa = ["ALL", "OFF"], fn = {
  ALL: -99,
  DEBUG: -1,
  INFO: 0,
  WARN: 1,
  ERROR: 2,
  OFF: 99
};
class sa {
  constructor(t = fn.INFO) {
    this.level = t, this.make();
  }
  make() {
    const t = Object.keys(fn).filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (e) => !Aa.includes(e)
    );
    for (const e of t) {
      const n = fn[e], r = e.toLowerCase();
      this[r] = this.level <= n ? console.log : () => {
      };
    }
  }
}
const at = 20037508342789244e-9, bA = [
  [0, 0],
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
], Rs = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAB3RJTUUH3QgIBToaSbAjlwAAABd0RVh0U29mdHdhcmUAR0xEUE5HIHZlciAzLjRxhaThAAAACHRwTkdHTEQzAAAAAEqAKR8AAAAEZ0FNQQAAsY8L/GEFAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAFRJREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgBDwABHHIJwwAAAABJRU5ErkJggg==", Re = 256, ga = `<canvas width="${Re}" height="${Re}" src="${Rs}"></canvas>`;
async function wA(i) {
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
async function xs(i, t) {
  if (i = await wA(i), Array.isArray(i))
    i = await Promise.all(i.map(async (e) => await wA(e))), i.length > 0 && i[0].type === "FeatureCollection" ? i = i.reduce((e, n, r) => {
      let A = n.id || n.properties && n.properties.id;
      if (!A)
        if (r === 0) A = "main";
        else throw "POI layers include bad key setting";
      return e[A] = xe(n, A, t), e;
    }, {}) : i = {
      main: xe(i, "main", t)
    };
  else if (i.type === "FeatureCollection") {
    const e = i.id || i.properties && i.properties.id || "main";
    i = { [e]: xe(i, e, t) };
  } else
    Object.keys(i).map((e) => {
      i[e] = xe(i[e], e, t);
    });
  return i.main || (i.main = xe([], "main", t)), Object.keys(i).map((e) => {
    li(i, e, t);
  }), i;
}
function xe(i, t, e) {
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
function li(i, t, e) {
  if (!i[t]) return;
  const n = i[t], r = n.pois;
  n.__nextId || (n.__nextId = 0), r.map((A) => {
    A.id || (A.id = `${t}_${n.__nextId}`, n.__nextId++), A.namespaceID || (A.namespaceID = `${e.namespace ? `${e.namespace}#` : ""}${A.id}`);
  });
}
function yn(i, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = i, n;
}
function Ss(i, t, e = {}) {
  if (!i)
    throw new Error("coordinates is required");
  if (!Array.isArray(i))
    throw new Error("coordinates must be an Array");
  if (i.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!MA(i[0]) || !MA(i[1]))
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
function oa(i, t, e = {}) {
  if (i.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return yn({
    type: "LineString",
    coordinates: i
  }, t, e);
}
function EA(i, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = i, e;
}
function MA(i) {
  return !isNaN(i) && i !== null && !Array.isArray(i);
}
function Os(i, t, e) {
  if (i !== null)
    for (var n, r, A, s, g, o, a, I = 0, C = 0, c, l = i.type, u = l === "FeatureCollection", f = l === "Feature", m = u ? i.features.length : 1, p = 0; p < m; p++) {
      a = u ? i.features[p].geometry : f ? i.geometry : i, c = a ? a.type === "GeometryCollection" : !1, g = c ? a.geometries.length : 1;
      for (var v = 0; v < g; v++) {
        var O = 0, D = 0;
        if (s = c ? a.geometries[v] : a, s !== null) {
          o = s.coordinates;
          var z = s.type;
          switch (I = z === "Polygon" || z === "MultiPolygon" ? 1 : 0, z) {
            case null:
              break;
            case "Point":
              if (t(
                o,
                C,
                p,
                O,
                D
              ) === !1)
                return !1;
              C++, O++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < o.length; n++) {
                if (t(
                  o[n],
                  C,
                  p,
                  O,
                  D
                ) === !1)
                  return !1;
                C++, z === "MultiPoint" && O++;
              }
              z === "LineString" && O++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < o.length; n++) {
                for (r = 0; r < o[n].length - I; r++) {
                  if (t(
                    o[n][r],
                    C,
                    p,
                    O,
                    D
                  ) === !1)
                    return !1;
                  C++;
                }
                z === "MultiLineString" && O++, z === "Polygon" && D++;
              }
              z === "Polygon" && O++;
              break;
            case "MultiPolygon":
              for (n = 0; n < o.length; n++) {
                for (D = 0, r = 0; r < o[n].length; r++) {
                  for (A = 0; A < o[n][r].length - I; A++) {
                    if (t(
                      o[n][r][A],
                      C,
                      p,
                      O,
                      D
                    ) === !1)
                      return !1;
                    C++;
                  }
                  D++;
                }
                O++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < s.geometries.length; n++)
                if (Os(s.geometries[n], t) === !1)
                  return !1;
              break;
            default:
              throw new Error("Unknown Geometry Type");
          }
        }
      }
    }
}
function aa(i, t = {}) {
  let e = 0, n = 0, r = 0;
  return Os(
    i,
    function(A) {
      e += A[0], n += A[1], r++;
    }
  ), Ss([e / r, n / r], t.properties);
}
var Ia = aa;
const ae = 11102230246251565e-32, bt = 134217729, Ca = (3 + 8 * ae) * ae;
function Xr(i, t, e, n, r) {
  let A, s, g, o, a = t[0], I = n[0], C = 0, c = 0;
  I > a == I > -a ? (A = a, a = t[++C]) : (A = I, I = n[++c]);
  let l = 0;
  if (C < i && c < e)
    for (I > a == I > -a ? (s = a + A, g = A - (s - a), a = t[++C]) : (s = I + A, g = A - (s - I), I = n[++c]), A = s, g !== 0 && (r[l++] = g); C < i && c < e; )
      I > a == I > -a ? (s = A + a, o = s - A, g = A - (s - o) + (a - o), a = t[++C]) : (s = A + I, o = s - A, g = A - (s - o) + (I - o), I = n[++c]), A = s, g !== 0 && (r[l++] = g);
  for (; C < i; )
    s = A + a, o = s - A, g = A - (s - o) + (a - o), a = t[++C], A = s, g !== 0 && (r[l++] = g);
  for (; c < e; )
    s = A + I, o = s - A, g = A - (s - o) + (I - o), I = n[++c], A = s, g !== 0 && (r[l++] = g);
  return (A !== 0 || l === 0) && (r[l++] = A), l;
}
function ca(i, t) {
  let e = t[0];
  for (let n = 1; n < i; n++) e += t[n];
  return e;
}
function Ln(i) {
  return new Float64Array(i);
}
const la = (3 + 16 * ae) * ae, ua = (2 + 12 * ae) * ae, ha = (9 + 64 * ae) * ae * ae, Ue = Ln(4), PA = Ln(8), RA = Ln(12), xA = Ln(16), Et = Ln(4);
function fa(i, t, e, n, r, A, s) {
  let g, o, a, I, C, c, l, u, f, m, p, v, O, D, z, W, K, _;
  const At = i - r, rt = e - r, V = t - A, gt = n - A;
  D = At * gt, c = bt * At, l = c - (c - At), u = At - l, c = bt * gt, f = c - (c - gt), m = gt - f, z = u * m - (D - l * f - u * f - l * m), W = V * rt, c = bt * V, l = c - (c - V), u = V - l, c = bt * rt, f = c - (c - rt), m = rt - f, K = u * m - (W - l * f - u * f - l * m), p = z - K, C = z - p, Ue[0] = z - (p + C) + (C - K), v = D + p, C = v - D, O = D - (v - C) + (p - C), p = O - W, C = O - p, Ue[1] = O - (p + C) + (C - W), _ = v + p, C = _ - v, Ue[2] = v - (_ - C) + (p - C), Ue[3] = _;
  let dt = ca(4, Ue), ht = ua * s;
  if (dt >= ht || -dt >= ht || (C = i - At, g = i - (At + C) + (C - r), C = e - rt, a = e - (rt + C) + (C - r), C = t - V, o = t - (V + C) + (C - A), C = n - gt, I = n - (gt + C) + (C - A), g === 0 && o === 0 && a === 0 && I === 0) || (ht = ha * s + Ca * Math.abs(dt), dt += At * I + gt * g - (V * a + rt * o), dt >= ht || -dt >= ht)) return dt;
  D = g * gt, c = bt * g, l = c - (c - g), u = g - l, c = bt * gt, f = c - (c - gt), m = gt - f, z = u * m - (D - l * f - u * f - l * m), W = o * rt, c = bt * o, l = c - (c - o), u = o - l, c = bt * rt, f = c - (c - rt), m = rt - f, K = u * m - (W - l * f - u * f - l * m), p = z - K, C = z - p, Et[0] = z - (p + C) + (C - K), v = D + p, C = v - D, O = D - (v - C) + (p - C), p = O - W, C = O - p, Et[1] = O - (p + C) + (C - W), _ = v + p, C = _ - v, Et[2] = v - (_ - C) + (p - C), Et[3] = _;
  const jt = Xr(4, Ue, 4, Et, PA);
  D = At * I, c = bt * At, l = c - (c - At), u = At - l, c = bt * I, f = c - (c - I), m = I - f, z = u * m - (D - l * f - u * f - l * m), W = V * a, c = bt * V, l = c - (c - V), u = V - l, c = bt * a, f = c - (c - a), m = a - f, K = u * m - (W - l * f - u * f - l * m), p = z - K, C = z - p, Et[0] = z - (p + C) + (C - K), v = D + p, C = v - D, O = D - (v - C) + (p - C), p = O - W, C = O - p, Et[1] = O - (p + C) + (C - W), _ = v + p, C = _ - v, Et[2] = v - (_ - C) + (p - C), Et[3] = _;
  const F = Xr(jt, PA, 4, Et, RA);
  D = g * I, c = bt * g, l = c - (c - g), u = g - l, c = bt * I, f = c - (c - I), m = I - f, z = u * m - (D - l * f - u * f - l * m), W = o * a, c = bt * o, l = c - (c - o), u = o - l, c = bt * a, f = c - (c - a), m = a - f, K = u * m - (W - l * f - u * f - l * m), p = z - K, C = z - p, Et[0] = z - (p + C) + (C - K), v = D + p, C = v - D, O = D - (v - C) + (p - C), p = O - W, C = O - p, Et[1] = O - (p + C) + (C - W), _ = v + p, C = _ - v, Et[2] = v - (_ - C) + (p - C), Et[3] = _;
  const ot = Xr(F, RA, 4, Et, xA);
  return xA[ot - 1];
}
function da(i, t, e, n, r, A) {
  const s = (t - A) * (e - r), g = (i - r) * (n - A), o = s - g, a = Math.abs(s + g);
  return Math.abs(o) >= la * a ? o : -fa(i, t, e, n, r, A, a);
}
function pa(i, t) {
  var e, n, r = 0, A, s, g, o, a, I, C, c = i[0], l = i[1], u = t.length;
  for (e = 0; e < u; e++) {
    n = 0;
    var f = t[e], m = f.length - 1;
    if (I = f[0], I[0] !== f[m][0] && I[1] !== f[m][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = I[0] - c, g = I[1] - l, n; n < m; n++) {
      if (C = f[n + 1], o = C[0] - c, a = C[1] - l, g === 0 && a === 0) {
        if (o <= 0 && s >= 0 || s <= 0 && o >= 0)
          return 0;
      } else if (a >= 0 && g <= 0 || a <= 0 && g >= 0) {
        if (A = da(s, o, g, a, 0, 0), A === 0)
          return 0;
        (A > 0 && a > 0 && g <= 0 || A < 0 && a <= 0 && g > 0) && r++;
      }
      I = C, g = a, s = o;
    }
  }
  return r % 2 !== 0;
}
function ma(i) {
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
function ya(i) {
  return i.type === "Feature" ? i.geometry : i;
}
function va(i, t, e = {}) {
  if (!i)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = ma(i), r = ya(t), A = r.type, s = t.bbox;
  let g = r.coordinates;
  if (s && ba(n, s) === !1)
    return !1;
  A === "Polygon" && (g = [g]);
  let o = !1;
  for (var a = 0; a < g.length; ++a) {
    const I = pa(n, g[a]);
    if (I === 0) return !e.ignoreBoundary;
    I && (o = !0);
  }
  return o;
}
function ba(i, t) {
  return t[0] <= i[0] && t[1] <= i[1] && t[2] >= i[0] && t[3] >= i[1];
}
var or = va;
class Ds {
  constructor(t = [], e = wa) {
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
      let s = (t << 1) + 1, g = e[s];
      const o = s + 1;
      if (o < this.length && n(e[o], g) < 0 && (s = o, g = e[o]), n(g, A) >= 0) break;
      e[t] = g, t = s;
    }
    e[t] = A;
  }
}
function wa(i, t) {
  return i < t ? -1 : i > t ? 1 : 0;
}
function Bs(i, t) {
  return i.p.x > t.p.x ? 1 : i.p.x < t.p.x ? -1 : i.p.y !== t.p.y ? i.p.y > t.p.y ? 1 : -1 : 1;
}
function Ea(i, t) {
  return i.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : i.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : i.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? i.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
class SA {
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
function Ma(i, t) {
  if (i.type === "FeatureCollection") {
    const e = i.features;
    for (let n = 0; n < e.length; n++)
      OA(e[n], t);
  } else
    OA(i, t);
}
let qn = 0, _n = 0, $n = 0;
function OA(i, t) {
  const e = i.type === "Feature" ? i.geometry : i;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let r = 0; r < n.length; r++)
    for (let A = 0; A < n[r].length; A++) {
      let s = n[r][A][0], g = null;
      _n = _n + 1;
      for (let o = 0; o < n[r][A].length - 1; o++) {
        g = n[r][A][o + 1];
        const a = new SA(s, qn, _n, $n), I = new SA(g, qn, _n, $n + 1);
        a.otherEvent = I, I.otherEvent = a, Bs(a, I) > 0 ? (I.isLeftEndpoint = !0, a.isLeftEndpoint = !1) : (a.isLeftEndpoint = !0, I.isLeftEndpoint = !1), t.push(a), t.push(I), s = g, $n = $n + 1;
      }
    }
  qn = qn + 1;
}
class Pa {
  constructor(t) {
    this.leftSweepEvent = t, this.rightSweepEvent = t.otherEvent;
  }
}
function Ra(i, t) {
  if (i === null || t === null || i.leftSweepEvent.ringId === t.leftSweepEvent.ringId && (i.rightSweepEvent.isSamePoint(t.leftSweepEvent) || i.rightSweepEvent.isSamePoint(t.leftSweepEvent) || i.rightSweepEvent.isSamePoint(t.rightSweepEvent) || i.leftSweepEvent.isSamePoint(t.leftSweepEvent) || i.leftSweepEvent.isSamePoint(t.rightSweepEvent))) return !1;
  const e = i.leftSweepEvent.p.x, n = i.leftSweepEvent.p.y, r = i.rightSweepEvent.p.x, A = i.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, g = t.leftSweepEvent.p.y, o = t.rightSweepEvent.p.x, a = t.rightSweepEvent.p.y, I = (a - g) * (r - e) - (o - s) * (A - n), C = (o - s) * (n - g) - (a - g) * (e - s), c = (r - e) * (n - g) - (A - n) * (e - s);
  if (I === 0)
    return !1;
  const l = C / I, u = c / I;
  if (l >= 0 && l <= 1 && u >= 0 && u <= 1) {
    const f = e + l * (r - e), m = n + l * (A - n);
    return [f, m];
  }
  return !1;
}
function xa(i, t) {
  t = t || !1;
  const e = [], n = new Ds([], Ea);
  for (; i.length; ) {
    const r = i.pop();
    if (r.isLeftEndpoint) {
      const A = new Pa(r);
      for (let s = 0; s < n.data.length; s++) {
        const g = n.data[s];
        if (t && g.leftSweepEvent.featureId === r.featureId)
          continue;
        const o = Ra(A, g);
        o !== !1 && e.push(o);
      }
      n.push(A);
    } else r.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
function Sa(i, t) {
  const e = new Ds([], Bs);
  return Ma(i, e), xa(e, t);
}
var Oa = Sa;
function Da(i, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: r = !0 } = e;
  let A = [];
  i.type === "FeatureCollection" ? A = A.concat(i.features) : i.type === "Feature" ? A.push(i) : (i.type === "LineString" || i.type === "Polygon" || i.type === "MultiLineString" || i.type === "MultiPolygon") && A.push(yn(i)), t.type === "FeatureCollection" ? A = A.concat(t.features) : t.type === "Feature" ? A.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && A.push(yn(t));
  const s = Oa(
    EA(A),
    r
  );
  let g = [];
  if (n) {
    const o = {};
    s.forEach((a) => {
      const I = a.join(",");
      o[I] || (o[I] = !0, g.push(a));
    });
  } else
    g = s;
  return EA(g.map((o) => Ss(o)));
}
var Ba = Da;
function Ts(i) {
  class t extends i {
    constructor() {
      super(...arguments);
      w(this, "weiwudi");
      w(this, "_map");
      w(this, "homePosition");
      w(this, "mercZoom");
      w(this, "pois");
      w(this, "officialTitle", "");
      w(this, "title", "");
      w(this, "mapID", "");
      w(this, "label", "");
      w(this, "initialWait");
      w(this, "maxZoom");
      w(this, "minZoom");
      w(this, "envelope");
      w(this, "centroid");
      w(this, "homeMarginPixels", 0);
      w(this, "thumbnail");
      w(this, "poiTemplate");
      w(this, "poiStyle");
      w(this, "iconTemplate");
      w(this, "startFrom");
      w(this, "controls");
      w(this, "northUp");
      w(this, "tapDuration");
      w(this, "mercatorXShift", 0);
      w(this, "mercatorYShift", 0);
      w(this, "icon");
      w(this, "selectedIcon");
    }
    initialize(r) {
      var g;
      if (r = $t(r), this.mapID = r.mapID, this.homePosition = r.homePosition, this.mercZoom = r.mercZoom, this.label = r.label, this.maxZoom = r.maxZoom, this.minZoom = r.minZoom, this.poiTemplate = r.poiTemplate, this.poiStyle = r.poiStyle, this.iconTemplate = r.iconTemplate, this.icon = r.icon, this.selectedIcon = r.selectedIcon, this.mercatorXShift = r.mercatorXShift, this.mercatorYShift = r.mercatorYShift, this.weiwudi = r.weiwudi, r.envelopeLngLats) {
        const a = r.envelopeLngLats.map(
          (I) => Lt(I, "EPSG:4326", "EPSG:3857")
        );
        a.push(a[0]), this.envelope = gr([a]), this.centroid = (g = Ia(this.envelope).geometry) == null ? void 0 : g.coordinates;
      }
      for (let o = 0; o < vn.length; o++) {
        const a = vn[o], I = La[o];
        this.set(a, r[I] || r[a]);
      }
      const A = r.thumbnail ? new Promise((o) => {
        this.thumbnail = r.thumbnail, o(void 0);
      }) : new Promise((o) => {
        this.thumbnail = `./tmbs/${r.mapID}.jpg`, fetch(this.thumbnail).then((a) => {
          a.ok || (this.thumbnail = `./tmbs/${r.mapID}_menu.jpg`), o(void 0);
        }).catch((a) => {
          this.thumbnail = `./tmbs/${r.mapID}_menu.jpg`, o(void 0);
        });
      }).catch((o) => {
        this.thumbnail = `./tmbs/${r.mapID || r.sourceID}_menu.jpg`;
      }), s = this.resolvePois(r.pois);
      this.initialWait = Promise.all([s, A]), ja(this);
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
          const A = (g) => {
            r(g.type, g.detail);
          }, s = (g) => {
            this.weiwudi.removeEventListener("proceed", A), this.weiwudi.removeEventListener("finish", s), this.weiwudi.removeEventListener("stop", s), this.weiwudi.removeEventListener("canceled", s), A(g);
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
      const g = r.mercZoom, o = r.zoom, a = r.direction, I = r.rotation, C = this.getMap(), c = C == null ? void 0 : C.getView();
      r.latitude !== void 0 && r.longitude !== void 0 && (A = Lt(
        [r.longitude, r.latitude],
        "EPSG:4326",
        "EPSG:3857"
      )), r.x !== void 0 && r.y != null && (s = [r.x, r.y]), this.viewpoint2MercsAsync().then((l) => this.mercs2MercViewpoint(l)).then((l) => {
        const u = this.mercViewpoint2Mercs([
          A || l[0],
          g || l[1] || 17,
          a ?? I ?? l[2]
        ]);
        this.mercs2ViewpointAsync(u).then((f) => {
          A != null ? c == null || c.setCenter(f[0]) : s != null && (c == null || c.setCenter(s)), g != null ? c == null || c.setZoom(f[1]) : o != null && (c == null || c.setZoom(o)), a != null ? c == null || c.setRotation(f[2]) : I != null && (c == null || c.setRotation(I));
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
      const g = A.homeMarginPixels, o = [
        (s.clientWidth - g - 10) * 1,
        (s.clientHeight - g - 10) * 1
      ], a = {
        longitude: this.homePosition[0],
        latitude: this.homePosition[1],
        zoom: this.defZoom(o)
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
      const s = this.getMap(), g = s == null ? void 0 : s.getView();
      if (!r)
        return new Promise((a, I) => {
          s == null || s.setGPSPosition(null), a(!0);
        });
      const o = this.mercsFromGPSValue(r.lnglat, r.acc);
      return this.mercs2SysCoordsAsync_multiLayer([o]).then((a) => {
        const I = !a[0], C = I ? a[1] : a[0], c = I ? null : a[1], l = { xy: C[0][0] };
        if (!this.insideCheckSysCoord(C[0][0])) return !1;
        const u = C[0].slice(1);
        return l.rad = u.reduce(
          (f, m, p) => {
            const v = f + Math.sqrt(
              Math.pow(m[0] - l.xy[0], 2) + Math.pow(m[1] - l.xy[1], 2)
            );
            return p === 3 ? v / 4 : v;
          },
          0
        ), A || g == null || g.setCenter(l.xy), s == null || s.setGPSPosition(l, I ? "hide" : null), c && (s == null || s.setGPSPosition({ xy: c[0][0] }, "sub")), !0;
      }).catch((a) => {
        throw a;
      });
    }
    setGPSMarker(r, A = !1) {
      this.setGPSMarkerAsync(r, A).then(() => {
      });
    }
    mercsFromGPSValue(r, A) {
      const s = Lt(r, "EPSG:4326", "EPSG:3857"), g = r[1] * Math.PI / 180, o = A / Math.cos(g);
      return bA.map((a) => [
        a[0] * o + s[0],
        a[1] * o + s[1]
      ]);
    }
    // 与えられた差分行列を回転。theta無指定の場合は自動取得
    rotateMatrix(r, A) {
      A === void 0 && (A = this.getMap().getView().getRotation());
      const s = [];
      for (let g = 0; g < r.length; g++) {
        const o = r[g], a = o[0] * Math.cos(A) - o[1] * Math.sin(A), I = o[0] * Math.sin(A) + o[1] * Math.cos(A);
        s.push([a, I]);
      }
      return s;
    }
    async resolvePois(r) {
      this.pois = await xs(r || [], {
        name: this.officialTitle || this.title,
        namespace: this.mapID
      });
    }
    getPoi(r) {
      let A;
      return Object.keys(this.pois).map((s) => {
        this.pois[s].pois.map((g, o) => {
          g.id === r && (A = this.pois[s].pois[o]);
        });
      }), A;
    }
    addPoi(r, A) {
      if (A || (A = "main"), this.pois[A])
        return r = mn(r), this.pois[A].pois.push(r), li(this.pois, A, {
          name: this.officialTitle || this.title,
          namespace: this.mapID
        }), r.namespaceID;
    }
    removePoi(r) {
      Object.keys(this.pois).map((A) => {
        this.pois[A].pois.map((s, g) => {
          s.id === r && delete this.pois[A].pois[g];
        });
      });
    }
    clearPoi(r) {
      r || (r = "main"), r === "all" ? Object.keys(this.pois).map((A) => {
        this.pois[A].pois = [];
      }) : this.pois[r] && (this.pois[r].pois = []);
    }
    listPoiLayers(r = !1, A = !1) {
      return Object.keys(this.pois).sort((s, g) => s === "main" ? -1 : g === "main" ? 1 : s < g ? -1 : s > g ? 1 : 0).map((s) => this.pois[s]).filter(
        (s) => A ? r ? s.pois.length && s.hide : s.pois.length : r ? s.hide : !0
      );
    }
    getPoiLayer(r) {
      return this.pois[r];
    }
    addPoiLayer(r, A) {
      r !== "main" && (this.pois[r] || (this.pois[r] = xe(A || [], r, {
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
      return A === void 0 && (A = this.getMap().getView().getDecimalZoom()), s * at / 128 / Math.pow(2, A);
    }
    // 画面サイズと地図ズームから、地図面座標上での5座標を取得する。zoom, rotate無指定の場合は自動取得
    viewpoint2SysCoords(r, A) {
      return this.mercViewpoint2Mercs(r, A);
    }
    mercViewpoint2Mercs(r, A) {
      let s = r ? r[0] : void 0;
      const g = r ? r[1] : void 0, o = r ? r[2] : void 0;
      s === void 0 && (s = this.getMap().getView().getCenter()), A === void 0 && (A = this.getMap().getSize());
      const a = this.zoom2Radius(A, g);
      return [this.rotateMatrix(bA, o).map((c) => [
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
      const o = r[0].slice(1, 5).map((p) => [
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
        const v = o[p], O = a[p], D = Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));
        I += D;
        const z = v[0] * O[1] - v[1] * O[0], W = Math.acos(
          (v[0] * O[0] + v[1] * O[1]) / D
        ), K = z > 0 ? -1 * W : W;
        C += Math.cos(K), c += Math.sin(K);
      }
      const l = I / 4, u = Math.atan2(c, C);
      s || (s = this.getMap().getSize());
      const f = Math.floor(Math.min(s[0], s[1]) / 4), m = Math.log(f * at / 128 / l) / Math.log(2);
      return [A, m, u];
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
  return w(t, "isBasemap_", !1), w(t, "isWmts_", !0), w(t, "isMapbox_", !1), w(t, "isMapLibre_", !1), t;
}
function Ls(i) {
  class t extends Ts(i) {
    insideCheckXy(n) {
      return this.envelope ? or(n, this.envelope) : !0;
    }
    insideCheckSysCoord(n) {
      return this.insideCheckXy(n);
    }
    modulateXyInside(n) {
      if (!this.centroid) return n;
      const r = oa([n, this.centroid]), A = Ba(this.envelope, r);
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
  return w(t, "isBasemap_", !0), w(t, "isWmts_", !0), t;
}
function Ta(i) {
  class t extends Ts(i) {
    constructor() {
      super(...arguments);
      w(this, "width", 0);
      w(this, "height", 0);
      w(this, "_maxxy", 0);
    }
    insideCheckXy(r) {
      return !(r[0] < 0 || r[0] > this.width || r[1] < 0 || r[1] > this.height);
    }
    insideCheckSysCoord(r) {
      return this.insideCheckXy(this.sysCoord2Xy(r));
    }
    modulateXyInside(r) {
      const A = r[0] / (this.width / 2) - 1, s = r[1] / (this.height / 2) - 1, g = Math.max(Math.abs(A), Math.abs(s));
      return [
        (A / g + 1) * this.width / 2,
        (s / g + 1) * this.height / 2
      ];
    }
    modulateSysCoordInside(r) {
      const A = this.sysCoord2Xy(r), s = this.modulateXyInside(A);
      return this.xy2SysCoord(s);
    }
    // unifyTerm対応
    // https://github.com/code4history/MaplatCore/issues/19
    xy2SysCoord(r) {
      const A = r[0] * (2 * at) / this._maxxy - at, s = -1 * (r[1] * (2 * at) / this._maxxy - at);
      return [A, s];
    }
    sysCoord2Xy(r) {
      const A = (r[0] + at) * this._maxxy / (2 * at), s = (-r[1] + at) * this._maxxy / (2 * at);
      return [A, s];
    }
    defZoom(r) {
      const A = r[0], s = r[1], g = Math.log2((A - 10) / this.width), o = Math.log2((s - 10) / this.height), a = this.maxZoom;
      let I;
      return o > g ? I = o : I = g, a + I;
    }
  }
  return w(t, "isBasemap_", !1), w(t, "isWmts_", !1), t;
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
], La = [
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
function js(i) {
  return i = $t(i), i.imageExtension || (i.imageExtension = "jpg"), i.mapID && !i.url && !i.urls && (i.url = i.tms ? `tiles/${i.mapID}/{z}/{x}/{-y}.${i.imageExtension}` : `tiles/${i.mapID}/{z}/{x}/{y}.${i.imageExtension}`), i;
}
function ja(i) {
  const t = i;
  i.setTileLoadFunction(
    (function() {
      const e = t.getTileLoadFunction(), n = function(r, A, s, g, o, a, I) {
        return new Promise((C, c) => {
          const l = function(u, f = void 0) {
            const m = document.createElement("img");
            m.crossOrigin = "Anonymous", m.onload = m.onerror = function() {
              if (m.width && m.height) {
                const p = s.getContext("2d"), v = g === 0 ? 256 - a : 0, O = o === 0 ? 256 - I : 0;
                a = g + a > m.width ? m.width - g : a, I = o + I > m.height ? m.height - o : I, p.drawImage(m, g, o, a, I, v, O, a, I), C(void 0);
              } else
                f ? l(f) : C("tileLoadError");
            }, m.src = u;
          };
          l(A);
        });
      };
      return function(r, A) {
        const s = r.tileCoord[0];
        let g = r.tileCoord[1], o = r.tileCoord[2], a = Math.round(
          (t.mercatorXShift || 0) * 128 * Math.pow(2, s) / at
        ), I = Math.round(
          (t.mercatorYShift || 0) * -128 * Math.pow(2, s) / at
        );
        for (; a < 0 || a >= 256; )
          a < 0 ? (a = a + 256, g++) : (a = a - 256, g--);
        for (; I < 0 || I >= 256; )
          I < 0 ? (I = I + 256, o++) : (I = I - 256, o--);
        const C = document.createElement("div");
        C.innerHTML = ga;
        const c = C.childNodes[0], l = [
          [[s, g, o], 0, 0, 256 - a, 256 - I]
        ];
        a !== 0 && l.push([
          [s, g - 1, o],
          256 - a,
          0,
          a,
          256 - I
        ]), I !== 0 && (l.push([
          [s, g, o - 1],
          0,
          256 - I,
          256 - a,
          I
        ]), a !== 0 && l.push([
          [s, g - 1, o - 1],
          256 - a,
          256 - I,
          a,
          I
        ])), Promise.all(
          l.map((u) => {
            const f = t.tileUrlFunction(
              u[0],
              t.tilePixelRatio_,
              t.projection_
            );
            return n(
              u[0],
              f,
              c,
              u[1],
              u[2],
              u[3],
              u[4]
            );
          })
        ).then((u) => {
          if (u.reduce((m, p) => m && p, !0))
            r.handleImageError_();
          else {
            const m = c.toDataURL(), p = r.getImage();
            p.crossOrigin = null, e(r, m);
          }
        }).catch((u) => {
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
      const g = t.createElement("script");
      s.type && (g.type = s.type), s.src ? g.src = s.src : g.text = s.text, n[A] = g;
    } else
      n[A] = s;
  }
  return n;
}
function DA(i) {
  for (; !(i <= 180 && i > -180); ) {
    const t = i > 0 ? -1 : 1;
    i = i + t * 360;
  }
  return i;
}
function BA(i) {
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
function $t(i) {
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
class ks {
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
function ka(i, t, e) {
  let n, r;
  e = e || Ns;
  let A = 0, s = i.length, g = !1;
  for (; A < s; )
    n = A + (s - A >> 1), r = +e(i[n], t), r < 0 ? A = n + 1 : (s = n, g = !r);
  return g ? A : ~A;
}
function Ns(i, t) {
  return i > t ? 1 : i < t ? -1 : 0;
}
function Gs(i, t, e) {
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
function Xs(i, t) {
  const e = Array.isArray(t) ? t : [t], n = e.length;
  for (let r = 0; r < n; r++)
    i[i.length] = e[r];
}
function Na(i, t) {
  const e = i.length;
  if (e !== t.length)
    return !1;
  for (let n = 0; n < e; n++)
    if (i[n] !== t[n])
      return !1;
  return !0;
}
function Ga() {
  return !0;
}
function vr() {
  return !1;
}
function ni() {
}
function Xa(i) {
  let t, e, n;
  return function() {
    const r = Array.prototype.slice.call(arguments);
    return (!e || this !== n || !Na(r, e)) && (n = this, e = r, t = i.apply(this, arguments)), t;
  };
}
function Zs(i) {
  for (const t in i)
    delete i[t];
}
function Za(i) {
  let t;
  for (t in i)
    return !1;
  return !t;
}
class Fs extends ks {
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
    const A = e ? new Ie(t) : (
      /** @type {Event} */
      t
    );
    A.target || (A.target = this.eventTarget_ || this);
    const s = this.dispatching_ || (this.dispatching_ = {}), g = this.pendingRemovals_ || (this.pendingRemovals_ = {});
    n in s || (s[n] = 0, g[n] = 0), ++s[n];
    let o;
    for (let a = 0, I = r.length; a < I; ++a)
      if ("handleEvent" in r[a] ? o = /** @type {import("../events.js").ListenerObject} */
      r[a].handleEvent(A) : o = /** @type {import("../events.js").ListenerFunction} */
      r[a].call(this, A), o === !1 || A.propagationStopped) {
        o = !1;
        break;
      }
    if (--s[n] === 0) {
      let a = g[n];
      for (delete g[n]; a--; )
        this.removeEventListener(n, ni);
      delete s[n];
    }
    return o;
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.listeners_ && Zs(this.listeners_);
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
    r !== -1 && (this.pendingRemovals_ && t in this.pendingRemovals_ ? (n[r] = ni, ++this.pendingRemovals_[t]) : (n.splice(r, 1), n.length === 0 && delete this.listeners_[t]));
  }
}
ds.prototype.getDecimalZoom = function() {
  const i = this.getResolution(), t = (
    // NOTE: `resolution` maybe `undefined`
    // NOTE: `offset` maybe `NaN`
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Math.log(this.maxResolution_ / i) / Math.log(2)
  );
  return t !== void 0 ? this.minZoom_ + t : t;
};
const mt = {
  UNKNOWN: 0,
  INTERSECTING: 1,
  ABOVE: 2,
  RIGHT: 4,
  BELOW: 8,
  LEFT: 16
};
function ui(i, t, e) {
  let n, r;
  return t < i[0] ? n = i[0] - t : i[2] < t ? n = t - i[2] : n = 0, e < i[1] ? r = i[1] - e : i[3] < e ? r = e - i[3] : r = 0, n * n + r * r;
}
function Fa(i, t, e) {
  return i[0] <= t && t <= i[2] && i[1] <= e && e <= i[3];
}
function TA(i, t) {
  const e = i[0], n = i[1], r = i[2], A = i[3], s = t[0], g = t[1];
  let o = mt.UNKNOWN;
  return s < e ? o = o | mt.LEFT : s > r && (o = o | mt.RIGHT), g < n ? o = o | mt.BELOW : g > A && (o = o | mt.ABOVE), o === mt.UNKNOWN && (o = mt.INTERSECTING), o;
}
function Us() {
  return [1 / 0, 1 / 0, -1 / 0, -1 / 0];
}
function br(i, t, e, n, r) {
  return r ? (r[0] = i, r[1] = t, r[2] = e, r[3] = n, r) : [i, t, e, n];
}
function zs(i) {
  return br(1 / 0, 1 / 0, -1 / 0, -1 / 0, i);
}
function Ua(i, t) {
  const e = i[0], n = i[1];
  return br(e, n, e, n, t);
}
function za(i, t, e, n, r) {
  const A = zs(r);
  return Qs(A, i, t, e, n);
}
function Qs(i, t, e, n, r) {
  for (; e < n; e += r)
    Qa(i, t[e], t[e + 1]);
  return i;
}
function Qa(i, t, e) {
  i[0] = Math.min(i[0], t), i[1] = Math.min(i[1], e), i[2] = Math.max(i[2], t), i[3] = Math.max(i[3], e);
}
function Ws(i, t) {
  let e;
  return e = t(Wa(i)), e || (e = t(Ha(i)), e) || (e = t(Ja(i)), e) || (e = t(Ka(i)), e) ? e : !1;
}
function Wa(i) {
  return [i[0], i[1]];
}
function Ha(i) {
  return [i[2], i[1]];
}
function lr(i) {
  return [(i[0] + i[2]) / 2, (i[1] + i[3]) / 2];
}
function Va(i, t, e, n, r) {
  const [A, s, g, o, a, I, C, c] = Ya(
    i,
    t,
    e,
    n
  );
  return br(
    Math.min(A, g, a, C),
    Math.min(s, o, I, c),
    Math.max(A, g, a, C),
    Math.max(s, o, I, c),
    r
  );
}
function Ya(i, t, e, n) {
  const r = t * n[0] / 2, A = t * n[1] / 2, s = Math.cos(e), g = Math.sin(e), o = r * s, a = r * g, I = A * s, C = A * g, c = i[0], l = i[1];
  return [
    c - o + C,
    l - a - I,
    c - o - C,
    l - a + I,
    c + o - C,
    l + a + I,
    c + o + C,
    l + a - I,
    c - o + C,
    l - a - I
  ];
}
function bn(i) {
  return i[3] - i[1];
}
function Ka(i) {
  return [i[0], i[3]];
}
function Ja(i) {
  return [i[2], i[3]];
}
function hi(i) {
  return i[2] - i[0];
}
function fi(i, t) {
  return i[0] <= t[2] && i[2] >= t[0] && i[1] <= t[3] && i[3] >= t[1];
}
function Hs(i) {
  return i[2] < i[0] || i[3] < i[1];
}
function qa(i, t) {
  return t ? (t[0] = i[0], t[1] = i[1], t[2] = i[2], t[3] = i[3], t) : i;
}
function _a(i, t, e) {
  let n = !1;
  const r = TA(i, t), A = TA(i, e);
  if (r === mt.INTERSECTING || A === mt.INTERSECTING)
    n = !0;
  else {
    const s = i[0], g = i[1], o = i[2], a = i[3], I = t[0], C = t[1], c = e[0], l = e[1], u = (l - C) / (c - I);
    let f, m;
    A & mt.ABOVE && !(r & mt.ABOVE) && (f = c - (l - a) / u, n = f >= s && f <= o), !n && A & mt.RIGHT && !(r & mt.RIGHT) && (m = l - (c - o) * u, n = m >= g && m <= a), !n && A & mt.BELOW && !(r & mt.BELOW) && (f = c - (l - g) / u, n = f >= s && f <= o), !n && A & mt.LEFT && !(r & mt.LEFT) && (m = l - (c - s) * u, n = m >= g && m <= a);
  }
  return n;
}
function Mt() {
  throw new Error("Unimplemented abstract method.");
}
let $a = 0;
function tI(i) {
  return i.ol_uid || (i.ol_uid = String(++$a));
}
const eI = {
  /**
   * Triggered when a property is changed.
   * @event module:ol/Object.ObjectEvent#propertychange
   * @api
   */
  PROPERTYCHANGE: "propertychange"
}, ye = {
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
function Ye(i, t, e, n, r) {
  if (r) {
    const s = e;
    e = function(g) {
      return i.removeEventListener(t, e), s.call(n ?? this, g);
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
  return Ye(i, t, e, n, !0);
}
function dn(i) {
  i && i.target && (i.target.removeEventListener(i.type, i.listener), Zs(i));
}
class wr extends Fs {
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
    ++this.revision_, this.dispatchEvent(ye.CHANGE);
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
        r[A] = Ye(this, t[A], e);
      return r;
    }
    return Ye(
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
      nI(n);
    else if (Array.isArray(t))
      for (let r = 0, A = t.length; r < A; ++r)
        this.removeEventListener(t[r], e);
    else
      this.removeEventListener(t, e);
  }
}
wr.prototype.on;
wr.prototype.once;
wr.prototype.un;
function nI(i) {
  if (Array.isArray(i))
    for (let t = 0, e = i.length; t < e; ++t)
      dn(i[t]);
  else
    dn(
      /** @type {import("./events.js").EventsKey} */
      i
    );
}
class jA extends Ie {
  /**
   * @param {string} type The event type.
   * @param {string} key The property name.
   * @param {*} oldValue The old value for `key`.
   */
  constructor(t, e, n) {
    super(t), this.key = e, this.oldValue = n;
  }
}
class rn extends wr {
  /**
   * @param {Object<string, *>} [values] An object with key-value pairs.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, tI(this), this.values_ = null, t !== void 0 && this.setProperties(t);
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
    n = `change:${t}`, this.hasListener(n) && this.dispatchEvent(new jA(n, t, e)), n = eI.PROPERTYCHANGE, this.hasListener(n) && this.dispatchEvent(new jA(n, t, e));
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
      delete this.values_[t], Za(this.values_) && (this.values_ = null), e || this.notify(t, n);
    }
  }
}
function rI(...i) {
  console.warn(...i);
}
function Qt(i, t, e) {
  return Math.min(Math.max(i, t), e);
}
function iI(i, t, e, n, r, A) {
  const s = r - e, g = A - n;
  if (s !== 0 || g !== 0) {
    const o = ((i - e) * s + (t - n) * g) / (s * s + g * g);
    o > 1 ? (e = r, n = A) : o > 0 && (e += s * o, n += g * o);
  }
  return Ke(i, t, e, n);
}
function Ke(i, t, e, n) {
  const r = e - i, A = n - t;
  return r * r + A * A;
}
function kA(i) {
  return i * 180 / Math.PI;
}
function Je(i) {
  return i * Math.PI / 180;
}
function ri(i, t) {
  const e = i % t;
  return e * t < 0 ? e + t : e;
}
function di(i, t, e) {
  return i + e * (t - i);
}
function ii(i, t, e) {
  if (i >= t && i < e)
    return i;
  const n = e - t;
  return ((i - t) % n + n) % n + t;
}
function AI(i, t) {
  return i[0] += +t[0], i[1] += +t[1], i;
}
function ur(i, t) {
  let e = !0;
  for (let n = i.length - 1; n >= 0; --n)
    if (i[n] != t[n]) {
      e = !1;
      break;
    }
  return e;
}
function pi(i, t) {
  const e = Math.cos(t), n = Math.sin(t), r = i[0] * e - i[1] * n, A = i[1] * e + i[0] * n;
  return i[0] = r, i[1] = A, i;
}
function sI(i, t) {
  return i[0] *= t, i[1] *= t, i;
}
const Vs = {
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
    return this.metersPerUnit_ || Vs[this.units_];
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
const jn = 6378137, Ve = Math.PI * jn, gI = [-Ve, -Ve, Ve, Ve], oI = [-180, -85, 180, 85], tr = jn * Math.log(Math.tan(Math.PI / 2));
class ze extends wn {
  /**
   * @param {string} code Code.
   */
  constructor(t) {
    super({
      code: t,
      units: "m",
      extent: gI,
      global: !0,
      worldExtent: oI,
      getPointResolution: function(e, n) {
        return e / Math.cosh(n[1] / jn);
      }
    });
  }
}
const NA = [
  new ze("EPSG:3857"),
  new ze("EPSG:102100"),
  new ze("EPSG:102113"),
  new ze("EPSG:900913"),
  new ze("http://www.opengis.net/def/crs/EPSG/0/3857"),
  new ze("http://www.opengis.net/gml/srs/epsg.xml#3857")
];
function aI(i, t, e, n) {
  const r = i.length;
  e = e > 1 ? e : 2, n = n ?? e, t === void 0 && (e > 2 ? t = i.slice() : t = new Array(r));
  for (let A = 0; A < r; A += n) {
    t[A] = Ve * i[A] / 180;
    let s = jn * Math.log(Math.tan(Math.PI * (+i[A + 1] + 90) / 360));
    s > tr ? s = tr : s < -tr && (s = -tr), t[A + 1] = s;
  }
  return t;
}
function II(i, t, e, n) {
  const r = i.length;
  e = e > 1 ? e : 2, n = n ?? e, t === void 0 && (e > 2 ? t = i.slice() : t = new Array(r));
  for (let A = 0; A < r; A += n)
    t[A] = 180 * i[A] / Ve, t[A + 1] = 360 * Math.atan(Math.exp(i[A + 1] / jn)) / Math.PI - 90;
  return t;
}
const CI = 6378137, GA = [-180, -90, 180, 90], cI = Math.PI * CI / 180;
class Me extends wn {
  /**
   * @param {string} code Code.
   * @param {string} [axisOrientation] Axis orientation.
   */
  constructor(t, e) {
    super({
      code: t,
      units: "degrees",
      extent: GA,
      axisOrientation: e,
      global: !0,
      metersPerUnit: cI,
      worldExtent: GA
    });
  }
}
const XA = [
  new Me("CRS:84"),
  new Me("EPSG:4326", "neu"),
  new Me("urn:ogc:def:crs:OGC:1.3:CRS84"),
  new Me("urn:ogc:def:crs:OGC:2:84"),
  new Me("http://www.opengis.net/def/crs/OGC/1.3/CRS84"),
  new Me("http://www.opengis.net/gml/srs/epsg.xml#4326", "neu"),
  new Me("http://www.opengis.net/def/crs/EPSG/0/4326", "neu")
];
let Ai = {};
function lI(i) {
  return Ai[i] || Ai[i.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/, "EPSG:$3")] || null;
}
function uI(i, t) {
  Ai[i] = t;
}
let qe = {};
function En(i, t, e) {
  const n = i.getCode(), r = t.getCode();
  n in qe || (qe[n] = {}), qe[n][r] = e;
}
function Zr(i, t) {
  return i in qe && t in qe[i] ? qe[i][t] : null;
}
const hr = 0.9996, Xt = 669438e-8, Er = Xt * Xt, Mr = Er * Xt, Oe = Xt / (1 - Xt), ZA = Math.sqrt(1 - Xt), en = (1 - ZA) / (1 + ZA), Ys = en * en, mi = Ys * en, yi = mi * en, Ks = yi * en, Js = 1 - Xt / 4 - 3 * Er / 64 - 5 * Mr / 256, hI = 3 * Xt / 8 + 3 * Er / 32 + 45 * Mr / 1024, fI = 15 * Er / 256 + 45 * Mr / 1024, dI = 35 * Mr / 3072, pI = 3 / 2 * en - 27 / 32 * mi + 269 / 512 * Ks, mI = 21 / 16 * Ys - 55 / 32 * yi, yI = 151 / 96 * mi - 417 / 128 * Ks, vI = 1097 / 512 * yi, fr = 6378137;
function bI(i, t, e) {
  const n = i - 5e5, s = (e.north ? t : t - 1e7) / hr / (fr * Js), g = s + pI * Math.sin(2 * s) + mI * Math.sin(4 * s) + yI * Math.sin(6 * s) + vI * Math.sin(8 * s), o = Math.sin(g), a = o * o, I = Math.cos(g), C = o / I, c = C * C, l = c * c, u = 1 - Xt * a, f = Math.sqrt(1 - Xt * a), m = fr / f, p = (1 - Xt) / u, v = Oe * I ** 2, O = v * v, D = n / (m * hr), z = D * D, W = z * D, K = W * D, _ = K * D, At = _ * D, rt = g - C / p * (z / 2 - K / 24 * (5 + 3 * c + 10 * v - 4 * O - 9 * Oe)) + At / 720 * (61 + 90 * c + 298 * v + 45 * l - 252 * Oe - 3 * O);
  let V = (D - W / 6 * (1 + 2 * c + v) + _ / 120 * (5 - 2 * v + 28 * c - 3 * O + 8 * Oe + 24 * l)) / I;
  return V = ii(
    V + Je(qs(e.number)),
    -Math.PI,
    Math.PI
  ), [kA(V), kA(rt)];
}
const FA = -80, UA = 84, wI = -180, EI = 180;
function MI(i, t, e) {
  i = ii(i, wI, EI), t < FA ? t = FA : t > UA && (t = UA);
  const n = Je(t), r = Math.sin(n), A = Math.cos(n), s = r / A, g = s * s, o = g * g, a = Je(i), I = qs(e.number), C = Je(I), c = fr / Math.sqrt(1 - Xt * r ** 2), l = Oe * A ** 2, u = A * ii(a - C, -Math.PI, Math.PI), f = u * u, m = f * u, p = m * u, v = p * u, O = v * u, D = fr * (Js * n - hI * Math.sin(2 * n) + fI * Math.sin(4 * n) - dI * Math.sin(6 * n)), z = hr * c * (u + m / 6 * (1 - g + l) + v / 120 * (5 - 18 * g + o + 72 * l - 58 * Oe)) + 5e5;
  let W = hr * (D + c * s * (f / 2 + p / 24 * (5 - g + 9 * l + 4 * l ** 2) + O / 720 * (61 - 58 * g + o + 600 * l - 330 * Oe)));
  return e.north || (W += 1e7), [z, W];
}
function qs(i) {
  return (i - 1) * 6 - 180 + 3;
}
const PI = [
  /^EPSG:(\d+)$/,
  /^urn:ogc:def:crs:EPSG::(\d+)$/,
  /^http:\/\/www\.opengis\.net\/def\/crs\/EPSG\/0\/(\d+)$/
];
function _s(i) {
  let t = 0;
  for (const r of PI) {
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
function zA(i, t) {
  return function(e, n, r, A) {
    const s = e.length;
    r = r > 1 ? r : 2, A = A ?? r, n || (r > 2 ? n = e.slice() : n = new Array(s));
    for (let g = 0; g < s; g += A) {
      const o = e[g], a = e[g + 1], I = i(o, a, t);
      n[g] = I[0], n[g + 1] = I[1];
    }
    return n;
  };
}
function RI(i) {
  return _s(i) ? new wn({ code: i, units: "m" }) : null;
}
function xI(i) {
  const t = _s(i.getCode());
  return t ? {
    forward: zA(MI, t),
    inverse: zA(bI, t)
  } : null;
}
const SI = [xI], OI = [RI];
let si = !0;
function DI(i) {
  si = !1;
}
function $s(i, t) {
  if (t !== void 0) {
    for (let e = 0, n = i.length; e < n; ++e)
      t[e] = i[e];
    t = t;
  } else
    t = i.slice();
  return t;
}
function gi(i) {
  uI(i.getCode(), i), En(i, i, $s);
}
function BI(i) {
  i.forEach(gi);
}
function Mn(i) {
  if (typeof i != "string")
    return i;
  const t = lI(i);
  if (t)
    return t;
  for (const e of OI) {
    const n = e(i);
    if (n)
      return n;
  }
  return null;
}
function QA(i) {
  BI(i), i.forEach(function(t) {
    i.forEach(function(e) {
      t !== e && En(t, e, $s);
    });
  });
}
function TI(i, t, e, n) {
  i.forEach(function(r) {
    t.forEach(function(A) {
      En(r, A, e), En(A, r, n);
    });
  });
}
function vi(i, t) {
  return i ? typeof i == "string" ? Mn(i) : (
    /** @type {Projection} */
    i
  ) : Mn(t);
}
function LI(i, t) {
  const e = i.getCode(), n = t.getCode();
  let r = Zr(e, n);
  if (r)
    return r;
  let A = null, s = null;
  for (const o of SI)
    A || (A = o(i)), s || (s = o(t));
  if (!A && !s)
    return null;
  const g = "EPSG:4326";
  if (s)
    if (A)
      r = Fr(
        A.inverse,
        s.forward
      );
    else {
      const o = Zr(e, g);
      o && (r = Fr(
        o,
        s.forward
      ));
    }
  else {
    const o = Zr(g, n);
    o && (r = Fr(
      A.inverse,
      o
    ));
  }
  return r && (gi(i), gi(t), En(i, t, r)), r;
}
function Fr(i, t) {
  return function(e, n, r, A) {
    return n = i(e, n, r, A), t(n, n, r, A);
  };
}
function WA(i, t) {
  const e = Mn(i), n = Mn(t);
  return LI(e, n);
}
function HA(i, t) {
  return i;
}
function ue(i, t) {
  return si && !ur(i, [0, 0]) && i[0] >= -180 && i[0] <= 180 && i[1] >= -90 && i[1] <= 90 && (si = !1, rI(
    "Call useGeographic() from ol/proj once to work with [longitude, latitude] coordinates."
  )), i;
}
function jI(i, t) {
  return i;
}
function er(i, t) {
  return i;
}
function kI() {
  QA(NA), QA(XA), TI(
    XA,
    NA,
    aI,
    II
  );
}
kI();
function fe(i, t) {
  if (!i)
    throw new Error(t);
}
new Array(6);
function NI() {
  return [1, 0, 0, 1, 0, 0];
}
function GI(i, t, e, n, r, A, s, g) {
  const o = Math.sin(A), a = Math.cos(A);
  return i[0] = n * a, i[1] = r * o, i[2] = -n * o, i[3] = r * a, i[4] = s * n * a - g * n * o + t, i[5] = s * r * o + g * r * a + e, i;
}
function XI(i, t, e, n, r, A, s) {
  A = A || [], s = s || 2;
  let g = 0;
  for (let o = t; o < e; o += n) {
    const a = i[o], I = i[o + 1];
    A[g++] = r[0] * a + r[2] * I + r[4], A[g++] = r[1] * a + r[3] * I + r[5];
    for (let C = 2; C < s; C++)
      A[g++] = i[o + C];
  }
  return A && A.length != g && (A.length = g), A;
}
function tg(i, t, e, n, r, A, s) {
  s = s || [];
  const g = Math.cos(r), o = Math.sin(r), a = A[0], I = A[1];
  let C = 0;
  for (let c = t; c < e; c += n) {
    const l = i[c] - a, u = i[c + 1] - I;
    s[C++] = a + l * g - u * o, s[C++] = I + l * o + u * g;
    for (let f = c + 2; f < c + n; ++f)
      s[C++] = i[f];
  }
  return s && s.length != C && (s.length = C), s;
}
function ZI(i, t, e, n, r, A, s, g) {
  g = g || [];
  const o = s[0], a = s[1];
  let I = 0;
  for (let C = t; C < e; C += n) {
    const c = i[C] - o, l = i[C + 1] - a;
    g[I++] = o + r * c, g[I++] = a + A * l;
    for (let u = C + 2; u < C + n; ++u)
      g[I++] = i[u];
  }
  return g && g.length != I && (g.length = I), g;
}
function FI(i, t, e, n, r, A, s) {
  s = s || [];
  let g = 0;
  for (let o = t; o < e; o += n) {
    s[g++] = i[o] + r, s[g++] = i[o + 1] + A;
    for (let a = o + 2; a < o + n; ++a)
      s[g++] = i[a];
  }
  return s && s.length != g && (s.length = g), s;
}
const VA = NI(), UI = [NaN, NaN];
class zI extends rn {
  constructor() {
    super(), this.extent_ = Us(), this.extentRevision_ = -1, this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = 0, this.simplifyTransformedInternal = Xa(
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
    return Mt();
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
    return Mt();
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   */
  containsXY(t, e) {
    return this.closestPointXY(t, e, UI, Number.MIN_VALUE) === 0;
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
    return Mt();
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
      (isNaN(e[0]) || isNaN(e[1])) && zs(e), this.extentRevision_ = this.getRevision();
    }
    return qa(this.extent_, t);
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
    Mt();
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
    Mt();
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
    return Mt();
  }
  /**
   * Get the type of this geometry.
   * @abstract
   * @return {Type} Geometry type.
   */
  getType() {
    return Mt();
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
    Mt();
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   */
  intersectsExtent(t) {
    return Mt();
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
    Mt();
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
    const n = Mn(t), r = n.getUnits() == "tile-pixels" ? function(A, s, g) {
      const o = n.getExtent(), a = n.getWorldExtent(), I = bn(a) / bn(o);
      GI(
        VA,
        a[0],
        a[3],
        I,
        -I,
        0,
        0,
        0
      );
      const C = XI(
        A,
        0,
        A.length,
        g,
        VA,
        s
      ), c = WA(n, e);
      return c ? c(C, C, g) : C;
    } : WA(n, e);
    return this.applyTransform(r), this;
  }
}
class kn extends zI {
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
    return za(
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
    return Mt();
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
    this.stride = YA(t), this.layout = t, this.flatCoordinates = e;
  }
  /**
   * @abstract
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  setCoordinates(t, e) {
    Mt();
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
      r = YA(t);
    else {
      for (let A = 0; A < n; ++A) {
        if (e.length === 0) {
          this.layout = "XY", this.stride = 2;
          return;
        }
        e = /** @type {Array<unknown>} */
        e[0];
      }
      r = e.length, t = QI(r);
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
      tg(
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
    e === void 0 && (e = t), n || (n = lr(this.getExtent()));
    const r = this.getFlatCoordinates();
    if (r) {
      const A = this.getStride();
      ZI(
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
      FI(
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
function QI(i) {
  let t;
  return i == 2 ? t = "XY" : i == 3 ? t = "XYZ" : i == 4 && (t = "XYZM"), /** @type {import("./Geometry.js").GeometryLayout} */
  t;
}
function YA(i) {
  let t;
  return i == "XY" ? t = 2 : i == "XYZ" || i == "XYM" ? t = 3 : i == "XYZM" && (t = 4), /** @type {number} */
  t;
}
function eg(i, t, e, n) {
  for (let r = 0, A = e.length; r < A; ++r)
    i[t++] = e[r];
  return t;
}
function bi(i, t, e, n) {
  for (let r = 0, A = e.length; r < A; ++r) {
    const s = e[r];
    for (let g = 0; g < n; ++g)
      i[t++] = s[g];
  }
  return t;
}
function WI(i, t, e, n, r) {
  r = r || [];
  let A = 0;
  for (let s = 0, g = e.length; s < g; ++s) {
    const o = bi(
      i,
      t,
      e[s],
      n
    );
    r[A++] = o, t = o;
  }
  return r.length = A, r;
}
class wi extends kn {
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
    const t = new wi(
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
    const A = this.flatCoordinates, s = t - A[0], g = e - A[1], o = s * s + g * g;
    if (o < r) {
      if (o === 0)
        for (let a = 0; a < this.stride; ++a)
          n[a] = A[a];
      else {
        const a = this.getRadius() / Math.sqrt(o);
        n[0] = A[0] + a * s, n[1] = A[1] + a * g;
        for (let I = 2; I < this.stride; ++I)
          n[I] = A[I];
      }
      return n.length = this.stride, o;
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
    return br(
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
    if (fi(t, e)) {
      const n = this.getCenter();
      return t[0] <= n[0] && t[2] >= n[0] || t[1] <= n[1] && t[3] >= n[1] ? !0 : Ws(t, this.intersectsCoordinate.bind(this));
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
    let A = eg(r, 0, t, this.stride);
    r[A++] = r[0] + e;
    for (let s = 1, g = this.stride; s < g; ++s)
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
      tg(n, 0, n.length, r, t, e, n)
    ), this.changed();
  }
}
function ng(i, t, e, n) {
  let r = 0;
  const A = i[e - n], s = i[e - n + 1];
  let g = 0, o = 0;
  for (; t < e; t += n) {
    const a = i[t] - A, I = i[t + 1] - s;
    r += o * a - g * I, g = a, o = I;
  }
  return r / 2;
}
function HI(i, t, e, n) {
  let r = 0;
  for (let A = 0, s = e.length; A < s; ++A) {
    const g = e[A];
    r += ng(i, t, g, n), t = g;
  }
  return r;
}
function KA(i, t, e, n, r, A, s) {
  const g = i[t], o = i[t + 1], a = i[e] - g, I = i[e + 1] - o;
  let C;
  if (a === 0 && I === 0)
    C = t;
  else {
    const c = ((r - g) * a + (A - o) * I) / (a * a + I * I);
    if (c > 1)
      C = e;
    else if (c > 0) {
      for (let l = 0; l < n; ++l)
        s[l] = di(
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
function Ei(i, t, e, n, r) {
  let A = i[t], s = i[t + 1];
  for (t += n; t < e; t += n) {
    const g = i[t], o = i[t + 1], a = Ke(A, s, g, o);
    a > r && (r = a), A = g, s = o;
  }
  return r;
}
function VI(i, t, e, n, r) {
  for (let A = 0, s = e.length; A < s; ++A) {
    const g = e[A];
    r = Ei(i, t, g, n, r), t = g;
  }
  return r;
}
function Mi(i, t, e, n, r, A, s, g, o, a, I) {
  if (t == e)
    return a;
  let C, c;
  if (r === 0) {
    if (c = Ke(
      s,
      g,
      i[t],
      i[t + 1]
    ), c < a) {
      for (C = 0; C < n; ++C)
        o[C] = i[t + C];
      return o.length = n, c;
    }
    return a;
  }
  I = I || [NaN, NaN];
  let l = t + n;
  for (; l < e; )
    if (KA(
      i,
      l - n,
      l,
      n,
      s,
      g,
      I
    ), c = Ke(s, g, I[0], I[1]), c < a) {
      for (a = c, C = 0; C < n; ++C)
        o[C] = I[C];
      o.length = n, l += n;
    } else
      l += n * Math.max(
        (Math.sqrt(c) - Math.sqrt(a)) / r | 0,
        1
      );
  if (A && (KA(
    i,
    e - n,
    t,
    n,
    s,
    g,
    I
  ), c = Ke(s, g, I[0], I[1]), c < a)) {
    for (a = c, C = 0; C < n; ++C)
      o[C] = I[C];
    o.length = n;
  }
  return a;
}
function YI(i, t, e, n, r, A, s, g, o, a, I) {
  I = I || [NaN, NaN];
  for (let C = 0, c = e.length; C < c; ++C) {
    const l = e[C];
    a = Mi(
      i,
      t,
      l,
      n,
      r,
      A,
      s,
      g,
      o,
      a,
      I
    ), t = l;
  }
  return a;
}
function Pi(i, t, e, n, r) {
  r = r !== void 0 ? r : [];
  let A = 0;
  for (let s = t; s < e; s += n)
    r[A++] = i.slice(s, s + n);
  return r.length = A, r;
}
function KI(i, t, e, n, r) {
  r = r !== void 0 ? r : [];
  let A = 0;
  for (let s = 0, g = e.length; s < g; ++s) {
    const o = e[s];
    r[A++] = Pi(
      i,
      t,
      o,
      n,
      r[A]
    ), t = o;
  }
  return r.length = A, r;
}
function rg(i, t, e, n, r, A, s) {
  const g = (e - t) / n;
  if (g < 3) {
    for (; t < e; t += n)
      A[s++] = i[t], A[s++] = i[t + 1];
    return s;
  }
  const o = new Array(g);
  o[0] = 1, o[g - 1] = 1;
  const a = [t, e - n];
  let I = 0;
  for (; a.length > 0; ) {
    const C = a.pop(), c = a.pop();
    let l = 0;
    const u = i[c], f = i[c + 1], m = i[C], p = i[C + 1];
    for (let v = c + n; v < C; v += n) {
      const O = i[v], D = i[v + 1], z = iI(O, D, u, f, m, p);
      z > l && (I = v, l = z);
    }
    l > r && (o[(I - t) / n] = 1, c + n < I && a.push(c, I), I + n < C && a.push(I, C));
  }
  for (let C = 0; C < g; ++C)
    o[C] && (A[s++] = i[t + C * n], A[s++] = i[t + C * n + 1]);
  return s;
}
function Qe(i, t) {
  return t * Math.round(i / t);
}
function JI(i, t, e, n, r, A, s) {
  if (t == e)
    return s;
  let g = Qe(i[t], r), o = Qe(i[t + 1], r);
  t += n, A[s++] = g, A[s++] = o;
  let a, I;
  do
    if (a = Qe(i[t], r), I = Qe(i[t + 1], r), t += n, t == e)
      return A[s++] = a, A[s++] = I, s;
  while (a == g && I == o);
  for (; t < e; ) {
    const C = Qe(i[t], r), c = Qe(i[t + 1], r);
    if (t += n, C == a && c == I)
      continue;
    const l = a - g, u = I - o, f = C - g, m = c - o;
    if (l * m == u * f && (l < 0 && f < l || l == f || l > 0 && f > l) && (u < 0 && m < u || u == m || u > 0 && m > u)) {
      a = C, I = c;
      continue;
    }
    A[s++] = a, A[s++] = I, g = a, o = I, a = C, I = c;
  }
  return A[s++] = a, A[s++] = I, s;
}
function qI(i, t, e, n, r, A, s, g) {
  for (let o = 0, a = e.length; o < a; ++o) {
    const I = e[o];
    s = JI(
      i,
      t,
      I,
      n,
      r,
      A,
      s
    ), g.push(s), t = I;
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
    return r < ui(this.getExtent(), t, e) ? r : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      Ei(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), Mi(
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
    return ng(
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
    return Pi(
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
    return e.length = rg(
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
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = bi(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function _I(i, t, e, n, r, A, s) {
  let g, o;
  const a = (e - t) / n;
  if (a === 1)
    g = t;
  else if (a === 2)
    g = t, o = r;
  else if (a !== 0) {
    let I = i[t], C = i[t + 1], c = 0;
    const l = [0];
    for (let m = t + n; m < e; m += n) {
      const p = i[m], v = i[m + 1];
      c += Math.sqrt((p - I) * (p - I) + (v - C) * (v - C)), l.push(c), I = p, C = v;
    }
    const u = r * c, f = ka(l, u);
    f < 0 ? (o = (u - l[-f - 2]) / (l[-f - 1] - l[-f - 2]), g = t + (-f - 2) * n) : g = t + f * n;
  }
  s = s > 1 ? s : 2, A = A || new Array(s);
  for (let I = 0; I < s; ++I)
    A[I] = g === void 0 ? NaN : o === void 0 ? i[g + I] : di(i[g + I], i[g + n + I], o);
  return A;
}
function $I(i, t, e, n, r, A) {
  if (e == t)
    return null;
  let s;
  if (r < i[t + n - 1])
    return A ? (s = i.slice(t, t + n), s[n - 1] = r, s) : null;
  if (i[e - 1] < r)
    return A ? (s = i.slice(e - n, e), s[n - 1] = r, s) : null;
  if (r == i[t + n - 1])
    return i.slice(t, t + n);
  let g = t / n, o = e / n;
  for (; g < o; ) {
    const c = g + o >> 1;
    r < i[(c + 1) * n - 1] ? o = c : g = c + 1;
  }
  const a = i[g * n - 1];
  if (r == a)
    return i.slice((g - 1) * n, (g - 1) * n + n);
  const I = i[(g + 1) * n - 1], C = (r - a) / (I - a);
  s = [];
  for (let c = 0; c < n - 1; ++c)
    s.push(
      di(
        i[(g - 1) * n + c],
        i[g * n + c],
        C
      )
    );
  return s.push(r), s;
}
function tC(i, t, e, n, r) {
  return !Ws(
    r,
    /**
     * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
     * @return {boolean} Contains (x, y).
     */
    function(s) {
      return !De(
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
function De(i, t, e, n, r, A) {
  let s = 0, g = i[e - n], o = i[e - n + 1];
  for (; t < e; t += n) {
    const a = i[t], I = i[t + 1];
    o <= A ? I > A && (a - g) * (A - o) - (r - g) * (I - o) > 0 && s++ : I <= A && (a - g) * (A - o) - (r - g) * (I - o) < 0 && s--, g = a, o = I;
  }
  return s !== 0;
}
function ig(i, t, e, n, r, A) {
  if (e.length === 0 || !De(i, t, e[0], n, r, A))
    return !1;
  for (let s = 1, g = e.length; s < g; ++s)
    if (De(i, e[s - 1], e[s], n, r, A))
      return !1;
  return !0;
}
function Ag(i, t, e, n, r) {
  let A;
  for (t += n; t < e; t += n)
    if (A = r(
      i.slice(t - n, t),
      i.slice(t, t + n)
    ), A)
      return A;
  return !1;
}
function Ri(i, t, e, n, r, A) {
  return A = A ?? Qs(Us(), i, t, e, n), fi(r, A) ? A[0] >= r[0] && A[2] <= r[2] || A[1] >= r[1] && A[3] <= r[3] ? !0 : Ag(
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
    function(s, g) {
      return _a(r, s, g);
    }
  ) : !1;
}
function eC(i, t, e, n, r) {
  return !!(Ri(i, t, e, n, r) || De(
    i,
    t,
    e,
    n,
    r[0],
    r[1]
  ) || De(
    i,
    t,
    e,
    n,
    r[0],
    r[3]
  ) || De(
    i,
    t,
    e,
    n,
    r[2],
    r[1]
  ) || De(
    i,
    t,
    e,
    n,
    r[2],
    r[3]
  ));
}
function nC(i, t, e, n, r) {
  if (!eC(i, t, e[0], n, r))
    return !1;
  if (e.length === 1)
    return !0;
  for (let A = 1, s = e.length; A < s; ++A)
    if (tC(
      i,
      e[A - 1],
      e[A],
      n,
      r
    ) && !Ri(
      i,
      e[A - 1],
      e[A],
      n,
      r
    ))
      return !1;
  return !0;
}
function rC(i, t, e, n) {
  let r = i[t], A = i[t + 1], s = 0;
  for (let g = t + n; g < e; g += n) {
    const o = i[g], a = i[g + 1];
    s += Math.sqrt((o - r) * (o - r) + (a - A) * (a - A)), r = o, A = a;
  }
  return s;
}
class dr extends kn {
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
    Xs(this.flatCoordinates, t), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!LineString} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new dr(
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
    return r < ui(this.getExtent(), t, e) ? r : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      Ei(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), Mi(
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
    return Ag(
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
    return this.layout != "XYM" && this.layout != "XYZM" ? null : (e = e !== void 0 ? e : !1, $I(
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
    return Pi(
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
    return _I(
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
    return rC(
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
    return e.length = rg(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      0
    ), new dr(e, "XY");
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
    return Ri(
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
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = bi(
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
    const A = this.flatCoordinates, s = Ke(
      t,
      e,
      A[0],
      A[1]
    );
    if (s < r) {
      const g = this.stride;
      for (let o = 0; o < g; ++o)
        n[o] = A[o];
      return n.length = g, s;
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
    return Ua(this.flatCoordinates, t);
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
    return Fa(t, this.flatCoordinates[0], this.flatCoordinates[1]);
  }
  /**
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 0), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = eg(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function iC(i, t, e, n, r, A, s) {
  let g, o, a, I, C, c, l;
  const u = r[A + 1], f = [];
  for (let v = 0, O = e.length; v < O; ++v) {
    const D = e[v];
    for (I = i[D - n], c = i[D - n + 1], g = t; g < D; g += n)
      C = i[g], l = i[g + 1], (u <= c && l <= u || c <= u && u <= l) && (a = (u - c) / (l - c) * (C - I) + I, f.push(a)), I = C, c = l;
  }
  let m = NaN, p = -1 / 0;
  for (f.sort(Ns), I = f[0], g = 1, o = f.length; g < o; ++g) {
    C = f[g];
    const v = Math.abs(C - I);
    v > p && (a = (I + C) / 2, ig(i, t, e, n, a, u) && (m = a, p = v)), I = C;
  }
  return isNaN(m) && (m = r[A]), [m, u, p];
}
function AC(i, t, e, n) {
  for (; t < e - n; ) {
    for (let r = 0; r < n; ++r) {
      const A = i[t + r];
      i[t + r] = i[e - n + r], i[e - n + r] = A;
    }
    t += n, e -= n;
  }
}
function sg(i, t, e, n) {
  let r = 0, A = i[e - n], s = i[e - n + 1];
  for (; t < e; t += n) {
    const g = i[t], o = i[t + 1];
    r += (g - A) * (o + s), A = g, s = o;
  }
  return r === 0 ? void 0 : r > 0;
}
function sC(i, t, e, n, r) {
  r = r !== void 0 ? r : !1;
  for (let A = 0, s = e.length; A < s; ++A) {
    const g = e[A], o = sg(
      i,
      t,
      g,
      n
    );
    if (A === 0) {
      if (r && o || !r && !o)
        return !1;
    } else if (r && !o || !r && o)
      return !1;
    t = g;
  }
  return !0;
}
function JA(i, t, e, n, r) {
  r = r !== void 0 ? r : !1;
  for (let A = 0, s = e.length; A < s; ++A) {
    const g = e[A], o = sg(
      i,
      t,
      g,
      n
    );
    (A === 0 ? r && o || !r && !o : r && !o || !r && o) && AC(i, t, g, n), t = g;
  }
  return t;
}
class Te extends kn {
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
    this.flatCoordinates ? Xs(this.flatCoordinates, t.getFlatCoordinates()) : this.flatCoordinates = t.getFlatCoordinates().slice(), this.ends_.push(this.flatCoordinates.length), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Polygon} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new Te(
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
    return r < ui(this.getExtent(), t, e) ? r : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      VI(
        this.flatCoordinates,
        0,
        this.ends_,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), YI(
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
    return ig(
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
    return HI(
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
    return t !== void 0 ? (e = this.getOrientedFlatCoordinates().slice(), JA(e, 0, this.ends_, this.stride, t)) : e = this.flatCoordinates, KI(e, 0, this.ends_, this.stride);
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
      const t = lr(this.getExtent());
      this.flatInteriorPoint_ = iC(
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
    for (let s = 0, g = n.length; s < g; ++s) {
      const o = n[s], a = new Pn(
        e.slice(A, o),
        t
      );
      r.push(a), A = o;
    }
    return r;
  }
  /**
   * @return {Array<number>} Oriented flat coordinates.
   */
  getOrientedFlatCoordinates() {
    if (this.orientedRevision_ != this.getRevision()) {
      const t = this.flatCoordinates;
      sC(t, 0, this.ends_, this.stride) ? this.orientedFlatCoordinates_ = t : (this.orientedFlatCoordinates_ = t.slice(), this.orientedFlatCoordinates_.length = JA(
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
    return e.length = qI(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      Math.sqrt(t),
      e,
      0,
      n
    ), new Te(e, "XY", n);
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
    return nC(
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
    const n = WI(
      this.flatCoordinates,
      0,
      t,
      this.stride,
      this.ends_
    );
    this.flatCoordinates.length = n.length === 0 ? 0 : n[n.length - 1], this.changed();
  }
}
function qA(i) {
  if (Hs(i))
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
  return new Te(A, "XY", [A.length]);
}
class nn extends Ls(ps) {
  constructor(t = {}) {
    const e = js(t);
    if (super(e), t.mapID && (this.mapID = t.mapID), t.mapID === "morioka_ndl_affine") {
      const n = this.getTileUrlFunction();
      this.setTileUrlFunction((r, A, s) => n(r, A, s));
    }
    this.initialize(t);
  }
}
class xn extends nn {
  constructor(e = {}) {
    super(e);
    w(this, "style", "");
    w(this, "accessToken", "");
    w(this, "mapboxMap");
    this.style = e.style, this.mapboxMap = e.mapboxMap, this.accessToken = e.accessToken;
  }
}
w(xn, "isMapbox_", !0);
class Sn extends nn {
  constructor(e = {}) {
    super(e);
    w(this, "style", "");
    w(this, "maplibreMap");
    this.style = e.style || "https://tile.openstreetmap.jp/styles/osm-bright/style.json", this.maplibreMap = e.maplibreMap;
  }
}
w(Sn, "isMapLibre_", !0);
class oi extends Ls(go) {
  constructor(t = {}) {
    const e = Object.assign({}, t);
    e.mapType = t.maptype.match(/^google_(.+)$/) ? RegExp.$1 : "roadmap", e.layerTypes = (t.layers || []).map((n) => `layer${n.charAt(0).toUpperCase()}${n.slice(1).toLowerCase()}`), super(e), t.mapID && (this.mapID = t.mapID), this.initialize(t);
  }
}
const he = {
  ANIMATING: 0,
  INTERACTING: 1
}, Ut = {
  CENTER: "center",
  RESOLUTION: "resolution",
  ROTATION: "rotation"
};
function _A(i, t, e) {
  return (
    /**
     * @param {import("./coordinate.js").Coordinate|undefined} center Center.
     * @param {number|undefined} resolution Resolution.
     * @param {import("./size.js").Size} size Viewport size; unused if `onlyCenter` was specified.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @param {Array<number>} [centerShift] Shift between map center and viewport center.
     * @return {import("./coordinate.js").Coordinate|undefined} Center.
     */
    (function(n, r, A, s, g) {
      if (!n)
        return;
      if (!r && !t)
        return n;
      const o = t ? 0 : A[0] * r, a = t ? 0 : A[1] * r, I = g ? g[0] : 0, C = g ? g[1] : 0;
      let c = i[0] + o / 2 + I, l = i[2] - o / 2 + I, u = i[1] + a / 2 + C, f = i[3] - a / 2 + C;
      c > l && (c = (l + c) / 2, l = c), u > f && (u = (f + u) / 2, f = u);
      let m = Qt(n[0], c, l), p = Qt(n[1], u, f);
      if (s && e && r) {
        const v = 30 * r;
        m += -v * Math.log(1 + Math.max(0, c - n[0]) / v) + v * Math.log(1 + Math.max(0, n[0] - l) / v), p += -v * Math.log(1 + Math.max(0, u - n[1]) / v) + v * Math.log(1 + Math.max(0, n[1] - f) / v);
      }
      return [m, p];
    })
  );
}
function gC(i) {
  return i;
}
function oC(i) {
  return Math.pow(i, 3);
}
function Pr(i) {
  return 1 - oC(1 - i);
}
function aC(i) {
  return 3 * i * i - 2 * i * i * i;
}
function IC(i) {
  return i;
}
function xi(i, t, e, n) {
  const r = hi(t) / e[0], A = bn(t) / e[1];
  return n ? Math.min(i, Math.max(r, A)) : Math.min(i, Math.min(r, A));
}
function Si(i, t, e) {
  let n = Math.min(i, t);
  const r = 50;
  return n *= Math.log(1 + r * Math.max(0, i / t - 1)) / r + 1, e && (n = Math.max(n, e), n /= Math.log(1 + r * Math.max(0, e / i - 1)) / r + 1), Qt(n, e / 2, t * 2);
}
function CC(i, t, e, n) {
  return t = t !== void 0 ? t : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(r, A, s, g) {
    if (r !== void 0) {
      const o = i[0], a = i[i.length - 1], I = e ? xi(
        o,
        e,
        s,
        n
      ) : o;
      if (g)
        return t ? Si(
          r,
          I,
          a
        ) : Qt(r, a, I);
      const C = Math.min(I, r), c = Math.floor(Gs(i, C, A));
      return i[c] > I && c < i.length - 1 ? i[c + 1] : i[c];
    }
  });
}
function cC(i, t, e, n, r, A) {
  return n = n !== void 0 ? n : !0, e = e !== void 0 ? e : 0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(s, g, o, a) {
    if (s !== void 0) {
      const I = r ? xi(
        t,
        r,
        o,
        A
      ) : t;
      if (a)
        return n ? Si(
          s,
          I,
          e
        ) : Qt(s, e, I);
      const C = 1e-9, c = Math.ceil(
        Math.log(t / I) / Math.log(i) - C
      ), l = -g * (0.5 - C) + 0.5, u = Math.min(I, s), f = Math.floor(
        Math.log(t / u) / Math.log(i) + l
      ), m = Math.max(c, f), p = t / Math.pow(i, m);
      return Qt(p, e, I);
    }
  });
}
function $A(i, t, e, n, r) {
  return e = e !== void 0 ? e : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(A, s, g, o) {
    if (A !== void 0) {
      const a = n ? xi(
        i,
        n,
        g,
        r
      ) : i;
      return !e || !o ? Qt(A, t, a) : Si(
        A,
        a,
        t
      );
    }
  });
}
function Oi(i) {
  if (i !== void 0)
    return 0;
}
function ts(i) {
  if (i !== void 0)
    return i;
}
function lC(i) {
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
function uC(i) {
  const t = Je(5);
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
const hC = 256, Ur = 0;
class es extends rn {
  /**
   * @param {ViewOptions} [options] View options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = Object.assign({}, t), this.hints_ = [0, 0], this.animations_ = [], this.updateAnimationKey_, this.projection_ = vi(t.projection, "EPSG:3857"), this.viewportSize_ = [100, 100], this.targetCenter_ = null, this.targetResolution_, this.targetRotation_, this.nextCenter_ = null, this.nextResolution_, this.nextRotation_, this.cancelAnchor_ = void 0, t.projection && DI(), t.center && (t.center = ue(t.center, this.projection_)), t.extent && (t.extent = er(t.extent, this.projection_)), this.applyOptions_(t);
  }
  /**
   * Set up the view with the given options.
   * @param {ViewOptions} options View options.
   */
  applyOptions_(t) {
    const e = Object.assign({}, t);
    for (const g in Ut)
      delete e[g];
    this.setProperties(e, !0);
    const n = dC(t);
    this.maxResolution_ = n.maxResolution, this.minResolution_ = n.minResolution, this.zoomFactor_ = n.zoomFactor, this.resolutions_ = t.resolutions, this.padding_ = t.padding, this.minZoom_ = n.minZoom;
    const r = fC(t), A = n.constraint, s = pC(t);
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
      const A = this.getResolution(), s = A / 2 * (r[3] - e[3] + e[1] - r[1]), g = A / 2 * (r[0] - e[0] + e[2] - r[2]);
      this.setCenterInternal([n[0] + s, n[1] - g]);
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
      r.center && (r = Object.assign({}, r), r.center = ue(
        r.center,
        this.getProjection()
      )), r.anchor && (r = Object.assign({}, r), r.anchor = ue(
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
    let A = Date.now(), s = this.targetCenter_.slice(), g = this.targetResolution_, o = this.targetRotation_;
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
        easing: I.easing || aC,
        callback: n
      };
      if (I.center && (C.sourceCenter = s, C.targetCenter = I.center.slice(), s = C.targetCenter), I.zoom !== void 0 ? (C.sourceResolution = g, C.targetResolution = this.getResolutionForZoom(I.zoom), g = C.targetResolution) : I.resolution && (C.sourceResolution = g, C.targetResolution = I.resolution, g = C.targetResolution), I.rotation !== void 0) {
        C.sourceRotation = o;
        const c = ri(I.rotation - o + Math.PI, 2 * Math.PI) - Math.PI;
        C.targetRotation = o + c, o = C.targetRotation;
      }
      mC(C) ? C.complete = !0 : A += C.duration, a.push(C);
    }
    this.animations_.push(a), this.setHint(he.ANIMATING, 1), this.updateAnimations_();
  }
  /**
   * Determine if the view is being animated.
   * @return {boolean} The view is being animated.
   * @api
   */
  getAnimating() {
    return this.hints_[he.ANIMATING] > 0;
  }
  /**
   * Determine if the user is interacting with the view, such as panning or zooming.
   * @return {boolean} The view is being interacted with.
   * @api
   */
  getInteracting() {
    return this.hints_[he.INTERACTING] > 0;
  }
  /**
   * Cancel any ongoing animations.
   * @api
   */
  cancelAnimations() {
    this.setHint(he.ANIMATING, -this.hints_[he.ANIMATING]);
    let t;
    for (let e = 0, n = this.animations_.length; e < n; ++e) {
      const r = this.animations_[e];
      if (r[0].callback && nr(r[0].callback, !1), !t)
        for (let A = 0, s = r.length; A < s; ++A) {
          const g = r[A];
          if (!g.complete) {
            t = g.anchor;
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
      for (let s = 0, g = r.length; s < g; ++s) {
        const o = r[s];
        if (o.complete)
          continue;
        const a = t - o.start;
        let I = o.duration > 0 ? a / o.duration : 1;
        I >= 1 ? (o.complete = !0, I = 1) : A = !1;
        const C = o.easing(I);
        if (o.sourceCenter) {
          const c = o.sourceCenter[0], l = o.sourceCenter[1], u = o.targetCenter[0], f = o.targetCenter[1];
          this.nextCenter_ = o.targetCenter;
          const m = c + C * (u - c), p = l + C * (f - l);
          this.targetCenter_ = [m, p];
        }
        if (o.sourceResolution && o.targetResolution) {
          const c = C === 1 ? o.targetResolution : o.sourceResolution + C * (o.targetResolution - o.sourceResolution);
          if (o.anchor) {
            const l = this.getViewportSize_(this.getRotation()), u = this.constraints_.resolution(
              c,
              0,
              l,
              !0
            );
            this.targetCenter_ = this.calculateCenterZoom(
              u,
              o.anchor
            );
          }
          this.nextResolution_ = o.targetResolution, this.targetResolution_ = c, this.applyTargetState_(!0);
        }
        if (o.sourceRotation !== void 0 && o.targetRotation !== void 0) {
          const c = C === 1 ? ri(o.targetRotation + Math.PI, 2 * Math.PI) - Math.PI : o.sourceRotation + C * (o.targetRotation - o.sourceRotation);
          if (o.anchor) {
            const l = this.constraints_.rotation(
              c,
              !0
            );
            this.targetCenter_ = this.calculateCenterRotate(
              l,
              o.anchor
            );
          }
          this.nextRotation_ = o.targetRotation, this.targetRotation_ = c;
        }
        if (this.applyTargetState_(!0), e = !0, !o.complete)
          break;
      }
      if (A) {
        this.animations_[n] = null, this.setHint(he.ANIMATING, -1), this.nextCenter_ = null, this.nextResolution_ = NaN, this.nextRotation_ = NaN;
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
    return r !== void 0 && (n = [r[0] - e[0], r[1] - e[1]], pi(n, t - this.getRotation()), AI(n, e)), n;
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
      const s = e[0] - t * (e[0] - r[0]) / A, g = e[1] - t * (e[1] - r[1]) / A;
      n = [s, g];
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
    return t && HA(t, this.getProjection());
  }
  /**
   * Get the view center without transforming to user projection.
   * @return {import("./coordinate.js").Coordinate|undefined} The center of the view.
   */
  getCenterInternal() {
    return (
      /** @type {import("./coordinate.js").Coordinate|undefined} */
      this.get(Ut.CENTER)
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
    return jI(e, this.getProjection());
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
    fe(e, "The view center is not defined");
    const n = (
      /** @type {!number} */
      this.getResolution()
    );
    fe(n !== void 0, "The view resolution is not defined");
    const r = (
      /** @type {!number} */
      this.getRotation()
    );
    return fe(r !== void 0, "The view rotation is not defined"), Va(e, n, r, t);
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
      this.get(Ut.RESOLUTION)
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
    const n = hi(t) / e[0], r = bn(t) / e[1];
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
      this.get(Ut.ROTATION)
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
      r = zr(
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
      const A = Gs(this.resolutions_, t, 1);
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
      const n = Qt(
        Math.floor(t),
        0,
        this.resolutions_.length - 2
      ), r = this.resolutions_[n] / this.resolutions_[n + 1];
      return this.resolutions_[n] / Math.pow(r, Qt(t - n, 0, 1));
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
    if (fe(
      Array.isArray(t) || typeof /** @type {?} */
      t.getSimplifiedGeometry == "function",
      "Invalid extent or geometry provided as `geometry`"
    ), Array.isArray(t)) {
      fe(
        !Hs(t),
        "Cannot fit empty extent provided as `geometry`"
      );
      const r = er(t, this.getProjection());
      n = qA(r);
    } else if (t.getType() === "Circle") {
      const r = er(
        t.getExtent(),
        this.getProjection()
      );
      n = qA(r), n.rotate(this.getRotation(), lr(r));
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
    let g = 1 / 0, o = 1 / 0, a = -1 / 0, I = -1 / 0;
    for (let C = 0, c = A.length; C < c; C += s) {
      const l = A[C] * n - A[C + 1] * r, u = A[C] * r + A[C + 1] * n;
      g = Math.min(g, l), o = Math.min(o, u), a = Math.max(a, l), I = Math.max(I, u);
    }
    return [g, o, a, I];
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
    const g = this.rotatedExtentForGeometry(t);
    let o = this.getResolutionForExtentInternal(g, [
      n[0] - r[1] - r[3],
      n[1] - r[0] - r[2]
    ]);
    o = isNaN(o) ? s : Math.max(o, s), o = this.getConstrainedResolution(o, A ? 0 : 1);
    const a = this.getRotation(), I = Math.sin(a), C = Math.cos(a), c = lr(g);
    c[0] += (r[1] - r[3]) / 2 * o, c[1] += (r[0] - r[2]) / 2 * o;
    const l = c[0] * C - c[1] * I, u = c[1] * C + c[0] * I, f = this.getConstrainedCenter([l, u], o), m = e.callback ? e.callback : ni;
    e.duration !== void 0 ? this.animateInternal(
      {
        resolution: o,
        center: f,
        duration: e.duration,
        easing: e.easing
      },
      m
    ) : (this.targetResolution_ = o, this.targetCenter_ = f, this.applyTargetState_(!1, !0), nr(m, !0));
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
      ue(t, this.getProjection()),
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
      zr(
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
      const g = this.getViewportSizeMinusPadding_(-n), o = zr(
        t,
        r,
        [g[0] / 2 + s[3], g[1] / 2 + s[0]],
        e,
        n
      );
      A = [
        t[0] - o[0],
        t[1] - o[1]
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
    const e = HA(this.targetCenter_, this.getProjection());
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
    e = e && ue(e, this.getProjection()), this.adjustResolutionInternal(t, e);
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
    e && (e = ue(e, this.getProjection())), this.adjustRotationInternal(t, e);
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
      t && ue(t, this.getProjection())
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
    ), g = this.constraints_.center(
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
    this.get(Ut.ROTATION) !== r && this.set(Ut.ROTATION, r), this.get(Ut.RESOLUTION) !== s && (this.set(Ut.RESOLUTION, s), this.set("zoom", this.getZoom(), !0)), (!g || !this.get(Ut.CENTER) || !ur(this.get(Ut.CENTER), g)) && this.set(Ut.CENTER, g), this.getAnimating() && !t && this.cancelAnimations(), this.cancelAnchor_ = void 0;
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
    const r = e || 0, A = this.constraints_.rotation(this.targetRotation_), s = this.getViewportSize_(A), g = this.constraints_.resolution(
      this.targetResolution_,
      r,
      s
    ), o = this.constraints_.center(
      this.targetCenter_,
      g,
      s,
      !1,
      this.calculateCenterShift(
        this.targetCenter_,
        g,
        A,
        s
      )
    );
    if (t === 0 && !this.cancelAnchor_) {
      this.targetResolution_ = g, this.targetRotation_ = A, this.targetCenter_ = o, this.applyTargetState_();
      return;
    }
    n = n || (t === 0 ? this.cancelAnchor_ : void 0), this.cancelAnchor_ = void 0, (this.getResolution() !== g || this.getRotation() !== A || !this.getCenterInternal() || !ur(this.getCenterInternal(), o)) && (this.getAnimating() && this.cancelAnimations(), this.animateInternal({
      rotation: A,
      center: o,
      resolution: g,
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
    this.resolveConstraints(0), this.setHint(he.INTERACTING, 1);
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
    n = n && ue(n, this.getProjection()), this.endInteractionInternal(t, e, n);
  }
  /**
   * Notify the View that an interaction has ended. The view state will be resolved
   * to a stable one if needed (depending on its constraints).
   * @param {number} [duration] Animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  endInteractionInternal(t, e, n) {
    this.getInteracting() && (this.setHint(he.INTERACTING, -1), this.resolveConstraints(t, e, n));
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
function fC(i) {
  if (i.extent !== void 0) {
    const e = i.smoothExtentConstraint !== void 0 ? i.smoothExtentConstraint : !0;
    return _A(i.extent, i.constrainOnlyCenter, e);
  }
  const t = vi(i.projection, "EPSG:3857");
  if (i.multiWorld !== !0 && t.isGlobal()) {
    const e = t.getExtent().slice();
    return e[0] = -1 / 0, e[2] = 1 / 0, _A(e, !1, !1);
  }
  return gC;
}
function dC(i) {
  let t, e, n, s = i.minZoom !== void 0 ? i.minZoom : Ur, g = i.maxZoom !== void 0 ? i.maxZoom : 28;
  const o = i.zoomFactor !== void 0 ? i.zoomFactor : 2, a = i.multiWorld !== void 0 ? i.multiWorld : !1, I = i.smoothResolutionConstraint !== void 0 ? i.smoothResolutionConstraint : !0, C = i.showFullExtent !== void 0 ? i.showFullExtent : !1, c = vi(i.projection, "EPSG:3857"), l = c.getExtent();
  let u = i.constrainOnlyCenter, f = i.extent;
  if (!a && !f && c.isGlobal() && (u = !1, f = l), i.resolutions !== void 0) {
    const m = i.resolutions;
    e = m[s], n = m[g] !== void 0 ? m[g] : m[m.length - 1], i.constrainResolution ? t = CC(
      m,
      I,
      !u && f,
      C
    ) : t = $A(
      e,
      n,
      I,
      !u && f,
      C
    );
  } else {
    const p = (l ? Math.max(hi(l), bn(l)) : (
      // use an extent that can fit the whole world if need be
      360 * Vs.degrees / c.getMetersPerUnit()
    )) / hC / Math.pow(2, Ur), v = p / Math.pow(2, 28 - Ur);
    e = i.maxResolution, e !== void 0 ? s = 0 : e = p / Math.pow(o, s), n = i.minResolution, n === void 0 && (i.maxZoom !== void 0 ? i.maxResolution !== void 0 ? n = e / Math.pow(o, g) : n = p / Math.pow(o, g) : n = v), g = s + Math.floor(
      Math.log(e / n) / Math.log(o)
    ), n = e / Math.pow(o, g - s), i.constrainResolution ? t = cC(
      o,
      e,
      n,
      I,
      !u && f,
      C
    ) : t = $A(
      e,
      n,
      I,
      !u && f,
      C
    );
  }
  return {
    constraint: t,
    maxResolution: e,
    minResolution: n,
    minZoom: s,
    zoomFactor: o
  };
}
function pC(i) {
  if (i.enableRotation !== void 0 ? i.enableRotation : !0) {
    const e = i.constrainRotation;
    return e === void 0 || e === !0 ? uC() : e === !1 ? ts : typeof e == "number" ? lC(e) : ts;
  }
  return Oi;
}
function mC(i) {
  return !(i.sourceCenter && i.targetCenter && !ur(i.sourceCenter, i.targetCenter) || i.sourceResolution !== i.targetResolution || i.sourceRotation !== i.targetRotation);
}
function zr(i, t, e, n, r) {
  const A = Math.cos(-r);
  let s = Math.sin(-r), g = i[0] * A - i[1] * s, o = i[1] * A + i[0] * s;
  g += (t[0] / 2 - e[0]) * n, o += (e[1] - t[1] / 2) * n, s = -s;
  const a = g * A - o * s, I = o * A + g * s;
  return [a, I];
}
const yC = {
  /**
   * Triggered before layers are composed.  When dispatched by the map, the event object will not have
   * a `context` set.  When dispatched by a layer, the event object will have a `context` set.  Only
   * WebGL layers currently dispatch this event.
   * @event module:ol/render/Event~RenderEvent#precompose
   * @api
   */
  PRECOMPOSE: "precompose"
}, nt = {
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
class vC extends rn {
  /**
   * @param {Options} options Layer options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, this.background_ = t.background;
    const e = Object.assign({}, t);
    typeof t.properties == "object" && (delete e.properties, Object.assign(e, t.properties)), e[nt.OPACITY] = t.opacity !== void 0 ? t.opacity : 1, fe(
      typeof e[nt.OPACITY] == "number",
      "Layer opacity must be a number"
    ), e[nt.VISIBLE] = t.visible !== void 0 ? t.visible : !0, e[nt.Z_INDEX] = t.zIndex, e[nt.MAX_RESOLUTION] = t.maxResolution !== void 0 ? t.maxResolution : 1 / 0, e[nt.MIN_RESOLUTION] = t.minResolution !== void 0 ? t.minResolution : 0, e[nt.MIN_ZOOM] = t.minZoom !== void 0 ? t.minZoom : -1 / 0, e[nt.MAX_ZOOM] = t.maxZoom !== void 0 ? t.maxZoom : 1 / 0, this.className_ = e.className !== void 0 ? e.className : "ol-layer", delete e.className, this.setProperties(e), this.state_ = null;
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
    return e.opacity = Qt(Math.round(this.getOpacity() * 100) / 100, 0, 1), e.visible = this.getVisible(), e.extent = this.getExtent(), e.zIndex = n === void 0 && !e.managed ? 1 / 0 : n, e.maxResolution = this.getMaxResolution(), e.minResolution = Math.max(this.getMinResolution(), 0), e.minZoom = this.getMinZoom(), e.maxZoom = this.getMaxZoom(), this.state_ = e, e;
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").default>} [array] Array of layers (to be
   *     modified in place).
   * @return {Array<import("./Layer.js").default>} Array of layers.
   */
  getLayersArray(t) {
    return Mt();
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").State>} [states] Optional list of layer
   *     states (to be modified in place).
   * @return {Array<import("./Layer.js").State>} List of layer states.
   */
  getLayerStatesArray(t) {
    return Mt();
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
      this.get(nt.EXTENT)
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
      this.get(nt.MAX_RESOLUTION)
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
      this.get(nt.MIN_RESOLUTION)
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
      this.get(nt.MIN_ZOOM)
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
      this.get(nt.MAX_ZOOM)
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
      this.get(nt.OPACITY)
    );
  }
  /**
   * @abstract
   * @return {import("../source/Source.js").State} Source state.
   */
  getSourceState() {
    return Mt();
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
      this.get(nt.VISIBLE)
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
      this.get(nt.Z_INDEX)
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
    this.set(nt.EXTENT, t);
  }
  /**
   * Set the maximum resolution at which the layer is visible.
   * @param {number} maxResolution The maximum resolution of the layer.
   * @observable
   * @api
   */
  setMaxResolution(t) {
    this.set(nt.MAX_RESOLUTION, t);
  }
  /**
   * Set the minimum resolution at which the layer is visible.
   * @param {number} minResolution The minimum resolution of the layer.
   * @observable
   * @api
   */
  setMinResolution(t) {
    this.set(nt.MIN_RESOLUTION, t);
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
    this.set(nt.MAX_ZOOM, t);
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
    this.set(nt.MIN_ZOOM, t);
  }
  /**
   * Set the opacity of the layer, allowed values range from 0 to 1.
   * @param {number} opacity The opacity of the layer.
   * @observable
   * @api
   */
  setOpacity(t) {
    fe(typeof t == "number", "Layer opacity must be a number"), this.set(nt.OPACITY, t);
  }
  /**
   * Set the visibility of the layer (`true` or `false`).
   * @param {boolean} visible The visibility of the layer.
   * @observable
   * @api
   */
  setVisible(t) {
    this.set(nt.VISIBLE, t);
  }
  /**
   * Set Z-index of the layer, which is used to order layers before rendering.
   * The default Z-index is 0.
   * @param {number} zindex The z-index of the layer.
   * @observable
   * @api
   */
  setZIndex(t) {
    this.set(nt.Z_INDEX, t);
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.state_ && (this.state_.layer = null, this.state_ = null), super.disposeInternal();
  }
}
class gg extends vC {
  /**
   * @param {Options<SourceType>} options Layer options.
   */
  constructor(t) {
    const e = Object.assign({}, t);
    delete e.source, super(e), this.on, this.once, this.un, this.mapPrecomposeKey_ = null, this.mapRenderKey_ = null, this.sourceChangeKey_ = null, this.renderer_ = null, this.sourceReady_ = !1, this.rendered = !1, t.render && (this.render = t.render), t.map && this.setMap(t.map), this.addChangeListener(
      nt.SOURCE,
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
      this.get(nt.SOURCE) || null
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
    t && (this.sourceChangeKey_ = Ye(
      t,
      ye.CHANGE,
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
    !t && n && (t = n.getView()), t instanceof es ? e = {
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
    return bC(r, e.viewState) && (!A || fi(A, e.extent));
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
    const n = t instanceof es ? t.getViewStateAndExtent() : t;
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
    t || this.unrender(), this.set(nt.MAP, t);
  }
  /**
   * For use inside the library only.
   * @return {import("../Map.js").default|null} Map.
   */
  getMapInternal() {
    return this.get(nt.MAP);
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
    this.mapPrecomposeKey_ && (dn(this.mapPrecomposeKey_), this.mapPrecomposeKey_ = null), t || this.changed(), this.mapRenderKey_ && (dn(this.mapRenderKey_), this.mapRenderKey_ = null), t && (this.mapPrecomposeKey_ = Ye(
      t,
      yC.PRECOMPOSE,
      this.handlePrecompose_,
      this
    ), this.mapRenderKey_ = Ye(this, ye.CHANGE, t.render, t), this.changed());
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
    fe(
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
    this.set(nt.SOURCE, t);
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
function bC(i, t) {
  if (!i.visible)
    return !1;
  const e = t.resolution;
  if (e < i.minResolution || e >= i.maxResolution)
    return !1;
  const n = t.zoom;
  return n > i.minZoom && n <= i.maxZoom;
}
class wC extends gg {
  constructor(t) {
    const e = function(n) {
      const r = this.getSource(), A = r.mapboxMap;
      if (!A)
        return console.error("MapboxLayer: mapboxMap is undefined!"), null;
      A.setStyle(r.style);
      const s = A.getCanvas(), g = n.viewState, o = this.getVisible();
      s.style.display = o ? "block" : "none";
      const a = this.getOpacity();
      s.style.opacity = a;
      const I = g.rotation * -180 / Math.PI, C = Ci(g.center), c = g.zoom - 1, l = A.getBearing(), u = A.getCenter().toArray(), f = A.getZoom();
      return I == l && C[0] == u[0] && C[1] == u[1] && c == f || (I != l && A.rotateTo(I, {
        animate: !1
      }), (C[0] != u[0] || C[1] != u[1] || c != f) && A.jumpTo({
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
class EC extends gg {
  constructor(t) {
    const e = function(n) {
      const r = this.getSource(), A = r.maplibreMap;
      if (!A)
        return console.error("MapLibreLayer: maplibreMap is undefined!"), null;
      A.setStyle(r.style);
      const s = A.getCanvas(), g = n.viewState, o = this.getVisible();
      s.style.display = o ? "block" : "none";
      const a = this.getOpacity();
      s.style.opacity = a;
      const C = -g.rotation * 180 / Math.PI, c = A.getBearing();
      Math.abs(C - c) > 0.01 && (A.stop(), A.setBearing(C));
      const l = Ci(g.center), u = g.zoom - 1;
      if ((A.getCenter().toArray().toString() !== l.toString() || A.getZoom() !== u) && A.jumpTo({
        center: l,
        zoom: u,
        animate: !1
      }), A._frame && (A._frame.cancel(), A._frame = null), n.size) {
        const [f, m] = n.size;
        (s.width !== f || s.height !== m) && A.resize();
      }
      return A._render(), Math.abs(A.getZoom() - u) > 0.01 && A.setZoom(u), s.style.position = "absolute", s.style.left = "0", s.style.top = "0", s;
    };
    super({
      render: e,
      source: t.source
    });
  }
}
const og = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAxMS0xMC0yNlQyMTo1MjoxOFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAxMS0xMC0yN1QxNzo0MjowN1o8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgkVIwmwAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTM5jWRgMAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTAvMjYvMTHjwOqVAAARQHByVld4nMWbB3wURdvAd6/u3V6/27sts/PMQQhFpEU6SlNBRXqTfgkkQOhFSigHIgIWkJqAIJ1QBCz0KkJoQYrSQaQjioBKC+XezWU5fH2/3+/L8fu+fWd3bubZKf95nnlmdjeX2/dk602qD9UnooRc5YjkKp9KyIrkZikfkazcSFaWcuZmpUZScyOpWcqZm6rkU3OTIpGk3EhSViQpVTlzk5IiSUm5VCRC5UaorAiVqpy5VFKESspND6UY03O6U0oYGHo3NCg0ODSj59BQRmhYaHhoaDofFsJiGIVfC78e/hnOwwW4CI1Ttve/AlehLClH6oTrhl8N1wu3CIcFKhqWiwVpWvrG9EcjmXC2nC/1Sd+dHgonh1PCpxQ5nN4pfHHk3qGzOlFUepiiPk5PC/cO9wn3DfcL59deGOqWXC95Saigp/fCY8Lvh0e9Xm94q3DBlXLd2qm5kmRpSrdw9/CEqNwneWQ4HH6hXul6FHVs5Gfh2eGbI6eFp0fLxoZqhE/KC6P5Oa9lhzN7ymofy5PN4anhCRlfFpSVXxNeG26UQf0jyBSO5R1UcjTdF/3c8o+a66j11AbqhCrtpvZQe6lzqnSRukRdjtU8Q52lfqJuqNJt6g/qTzW/ltpKbaO2U99SO9QrF6j71AMqL9b2OvUr9VtMYmgLbaU9dIHkpwM0r+YdtJN20W76ytOa/zZWjpZpTANdNlr7NJVEv0RXpCtFpR+panR1ugZdPCodoGrTdei69MNou3p0ffoN+k36aT+rqcZqfheVQzWiW9HUP0Kn6BVEJ9DF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zV6+JT3q/K+UUkoppZ5Tl9rnzXTvZS/51pTrIJewYX0bzb5r+vfUX7X2ebU/rDnUmslszXqN0v99bSO/80ff/EtrIayb9PNrKMs56kf84zG7v5Te6HqW1yytUb8m7mzNaVbmv4r9stz7I1/WPPKc9sIzuc6ebST3XjlnDZd7OSawd7MmvNs6y5nriXWP9WbWmvq6UoX3Ota9TCttV8f0GZBXXqMep8R6JfdJl73upTKfo+6XbG+j/s9aG7ZmP75rNPZXvNzHLegjrPOtCT9WL+yXY17/tyH3IRB7GXXMtcq0VabZ8xrZt/8TQZzR/ZH/R2U+R33+P8X/GX/2/pB24py9GY74M//JWBN+ar36nJd7Avh6VKf0QbdPXs/yyrDRPhP3sz9znXmPynyutvB/30cpn1CmPC8x1jF+MpbRnteGn1Ivwhg3+I8AG9O+EHNt938fc3KP8pj/+X8i8yj1+93/szKfq2P+z7kdO/R+knUt9fEpfYO/iMs8tlX4MbtnGLbk/TrnYcZw4mLntDV7nfgz9yiPlYN/a/EhbSdtyp7ZyP+jMp/zLsh+W9YpfUffzrpij9FYRdxMr+fX/dn7wZpwwpbqlWHUg7mk+zfn8tE3GM/350Z59TDaQN+LTBsTP/Oelbn3tUtoab1APb70v1JKKaWUUkoppZRSSl1NOxERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERGRO+Qfh5eOajemXSYAAAFTbWtCVPrOyv4Af1WJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4nO3W4WmDYBSGUQdxEQdxEBdxEAdxEQexvIELt6Yh/4oJ54FDm0/7601szlOSJEmSJEmSJEmSJEmSJEmSJEkf0XEc577vT+c5y7V397+6T/dvXddzHMdzmqbHz+wY/Sz31L11FsuyPF7HMAx/vod077JjlX2zYXatzfs9tX/VN7/+je5ftut7Vjnrn+V6nX37xtm/ul7T/ctzvu9f/9fneX7aP9fs/31l23ru1+/btv36zPfnv/2/r/oe1/er90Cu1Xf7nEXVnx3Xa5IkSZIkSZIk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b24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+zWqGFQAACShJREFUWIWVmGusXFUVx39r73POzJy5M3fmPtrblj7p7btYGigGmojExISHQQ0miDFA4lc0SCBRNH4gRhNJ/aIfNAIxUkKIkMgjBBKMCHwQEGKhpbS39HXfve+5M3fmnr23H84+M7e1PDyTlbPPnDl7//da//Vf64zwBQ9jjCilAiDyFgIaUP4nFjDAMtACWtbaRGvtPmte59Lb8gUW137hGCgDFaDkrzMwrABRBxaAWWDeX7esteZyoD4XSJIkorXO+cV7gQFg9fMvLdz74bHm+hOnTP/QsOmeaxBYoJTDbF2n5wa36At7d+XOfOOW0uPAmLcpYN4Y0wyC4LIeuiwQ55wC8kA/sHF62tz5+F/mDz7zytKOTxpBMKsCEq1BCWjBiQAOcRAYQylpcWW0bG6/Kf/Rvd/rfmP1Kn0YOANMAksiYj8XiAcRew9se/ZvtR8/+seFr3xQj3QtDHGhQCCIFtAqDYxI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", ag = "data:image/png;base64,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", Ig = "data:image/png;base64,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", Di = "data:image/png;base64,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", MC = new qt({
  image: new $e({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: og
  })
}), PC = new qt({
  image: new $e({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: ag
  })
}), RC = new qt({
  image: new $e({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: Ig
  })
}), xC = new qt({
  fill: new _r({
    color: [128, 128, 256, 0.2]
  }),
  stroke: new qr({
    color: [128, 128, 256, 1],
    width: 3
  })
}), SC = new qt({
  image: new $e({
    anchor: [0.5, 1],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: Di
  })
});
class On extends io {
  constructor(e) {
    e = $t(e || {});
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
    const g = On.spawnLayer(
      null,
      e.source,
      e.target
    ), o = new so();
    o.set("name", "overlay");
    const I = {
      controls: e.controls ? e.controls : [],
      layers: [
        g,
        o,
        s,
        A,
        n,
        r
      ],
      target: e.div,
      view: new ds({
        center: e.defaultCenter || [0, 0],
        zoom: e.defaultZoom || 2,
        rotation: e.defaultRotation || 0,
        multiWorld: !0
      })
    };
    e.interactions && (I.interactions = e.interactions);
    super(I);
    w(this, "fakeGps");
    w(this, "fakeRadius");
    w(this, "geolocation");
    w(this, "homePosition");
    w(this, "northUp");
    w(this, "tapDuration");
    w(this, "homeMarginPixels");
    w(this, "tapUIVanish");
    w(this, "alwaysGpsOn");
    w(this, "__ignore_first_move");
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
    return n instanceof xn || n instanceof Sn || !(e instanceof kr) ? (n instanceof xn ? e = new wC({
      style: n.style,
      accessToken: n.accessToken,
      container: r,
      source: n
    }) : n instanceof Sn ? e = new EC({
      style: n.style,
      container: r,
      source: n
    }) : e = new kr({
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
    const A = this.getSource(r), s = new Ao(e);
    return n && s.setStyle(n), A.addFeature(s), s;
  }
  removeFeature(e, n) {
    this.getSource(n).removeFeature(e);
  }
  resetFeature(e) {
    this.getSource(e).clear();
  }
  setGPSPosition(e, n = void 0) {
    const r = n == "sub" ? RC : n == "hide" ? PC : MC;
    n != "sub" && this.resetFeature("gps"), e && (this.setFeature(
      {
        geometry: new Rn(e.xy)
      },
      r,
      "gps"
    ), n || this.setFeature(
      {
        geometry: new wi(e.xy, e.rad)
      },
      xC,
      "gps"
    ));
  }
  setMarker(e, n, r, A) {
    return A || (A = "marker"), n.geometry = new Rn(e), r ? typeof r == "string" ? r = new qt({
      image: new $e({
        anchor: [0.5, 1],
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: r
      })
    }) : r instanceof qt || (r = new qt({
      image: new $e(r)
    })) : r = SC, this.setFeature(n, r, A);
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
    r.stroke != null && (s.stroke = new qr(r.stroke)), r.fill != null && (s.fill = new _r(r.fill));
    const g = new qt(s), o = n === "Line" ? new dr(e) : new Te(e);
    return this.setFeature(
      {
        geometry: o,
        name: n
      },
      g,
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
      const g = {};
      n != null && (g.stroke = new qr(n)), r != null && (g.fill = new _r(r)), s = new qt(g);
    }
    return this.setFeature(
      {
        geometry: new Te([e])
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
      const r = new kr({
        source: e
      });
      n.push(r);
    }
  }
  setTransparency(e) {
    const n = (100 - e) / 100, r = this.getSource();
    r instanceof nn || r instanceof oi ? (this.getLayers().item(0).setOpacity(1), this.getLayers().item(1).setOpacity(n)) : this.getLayers().item(0).setOpacity(n);
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
  DBLCLICK: ye.DBLCLICK,
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
}, ns = {
  ACTIVE: "active"
};
class Nn extends rn {
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
      this.get(ns.ACTIVE)
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
    this.set(ns.ACTIVE, t);
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
function OC(i, t, e) {
  const n = i.getCenterInternal();
  if (n) {
    const r = [n[0] + t[0], n[1] + t[1]];
    i.animateInternal({
      duration: e !== void 0 ? e : 250,
      easing: IC,
      center: i.getConstrainedCenter(r)
    });
  }
}
function Bi(i, t, e, n) {
  const r = i.getZoom();
  if (r === void 0)
    return;
  const A = i.getConstrainedZoom(r + t), s = i.getResolutionForZoom(A);
  i.getAnimating() && i.cancelAnimations(), i.animate({
    resolution: s,
    anchor: e,
    duration: n !== void 0 ? n : 250,
    easing: Pr
  });
}
class DC extends Nn {
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
      ), r = t.map, A = t.coordinate, s = n.shiftKey ? -this.delta_ : this.delta_, g = r.getView();
      Bi(g, s, A, this.duration_), n.preventDefault(), e = !0;
    }
    return !e;
  }
}
const Le = typeof navigator < "u" && typeof navigator.userAgent < "u" ? navigator.userAgent.toLowerCase() : "", BC = Le.includes("safari") && !Le.includes("chrom");
BC && (Le.includes("version/15.4") || /cpu (os|iphone os) 15_4 like mac os x/.test(Le));
const TC = Le.includes("webkit") && !Le.includes("edge"), Cg = Le.includes("macintosh");
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
function ai(i) {
  const t = arguments;
  return function(e) {
    let n = !0;
    for (let r = 0, A = t.length; r < A && (n = n && t[r](e), !!n); ++r)
      ;
    return n;
  };
}
const LC = function(i) {
  const t = i.originalEvent;
  return t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, jC = function(i) {
  const t = i.originalEvent;
  return t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, kC = function(i) {
  const t = i.map.getTargetElement(), e = t.getRootNode(), n = i.map.getOwnerDocument().activeElement;
  return e instanceof ShadowRoot ? e.host.contains(n) : t.contains(n);
}, cg = function(i) {
  const t = i.map.getTargetElement(), e = t.getRootNode();
  return (e instanceof ShadowRoot ? e.host : t).hasAttribute("tabindex") ? kC(i) : !0;
}, NC = Ga, lg = function(i) {
  const t = i.originalEvent;
  return "pointerId" in t && t.button == 0 && !(TC && Cg && t.ctrlKey);
}, ug = function(i) {
  const t = (
    /** @type {KeyboardEvent|MouseEvent|TouchEvent} */
    i.originalEvent
  );
  return !t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, GC = function(i) {
  const t = i.originalEvent;
  return Cg ? t.metaKey : t.ctrlKey;
}, hg = function(i) {
  const t = i.originalEvent;
  return !t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, fg = function(i) {
  const t = i.originalEvent, e = (
    /** @type {Element} */
    t.target.tagName
  );
  return e !== "INPUT" && e !== "SELECT" && e !== "TEXTAREA" && // `isContentEditable` is only available on `HTMLElement`, but it may also be a
  // different type like `SVGElement`.
  // @ts-ignore
  !t.target.isContentEditable;
}, _e = function(i) {
  const t = i.originalEvent;
  return "pointerId" in t && t.pointerType == "mouse";
}, XC = function(i) {
  const t = i.originalEvent;
  return "pointerId" in t && t.isPrimary && t.button === 0;
};
class ZC extends ks {
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
    r[4] = r[0].slice(), this.geometry_ ? this.geometry_.setCoordinates([r]) : this.geometry_ = new Te([r]);
  }
  /**
   * @return {import("../geom/Polygon.js").default} Geometry.
   */
  getGeometry() {
    return this.geometry_;
  }
}
class An extends Nn {
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
function Ti(i) {
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
class cn extends Ie {
  /**
   * @param {string} type The event type.
   * @param {import("../coordinate.js").Coordinate} coordinate The event coordinate.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Originating event.
   */
  constructor(t, e, n) {
    super(t), this.coordinate = e, this.mapBrowserEvent = n;
  }
}
class FC extends An {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = t ?? {}, this.box_ = new ZC(t.className || "ol-dragbox"), this.minArea_ = t.minArea ?? 64, t.onBoxEnd && (this.onBoxEnd = t.onBoxEnd), this.startPixel_ = null, this.condition_ = t.condition ?? lg, this.boxEndCondition_ = t.boxEndCondition ?? this.defaultBoxEndCondition;
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
class UC extends An {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super({
      stopDown: vr
    }), t = t || {}, this.kinetic_ = t.kinetic, this.lastCentroid = null, this.lastPointersCount_, this.panning_ = !1;
    const e = t.condition ? t.condition : ai(ug, XC);
    this.condition_ = t.onFocusOnly ? ai(cg, e) : e, this.noKinetic_ = !1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    const e = t.map;
    this.panning_ || (this.panning_ = !0, e.getView().beginInteraction());
    const n = this.targetPointers, r = e.getEventPixel(Ti(n));
    if (n.length == this.lastPointersCount_) {
      if (this.kinetic_ && this.kinetic_.update(r[0], r[1]), this.lastCentroid) {
        const A = [
          this.lastCentroid[0] - r[0],
          r[1] - this.lastCentroid[1]
        ], g = t.map.getView();
        sI(A, g.getResolution()), pi(A, g.getRotation()), g.adjustCenterInternal(A);
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
        const r = this.kinetic_.getDistance(), A = this.kinetic_.getAngle(), s = n.getCenterInternal(), g = e.getPixelFromCoordinateInternal(s), o = e.getCoordinateFromPixelInternal([
          g[0] - r * Math.cos(A),
          g[1] - r * Math.sin(A)
        ]);
        n.animateInternal({
          center: n.getConstrainedCenter(o),
          duration: 500,
          easing: Pr
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
class zC extends An {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super({
      stopDown: vr
    }), this.condition_ = t.condition ? t.condition : jC, this.lastAngle_ = void 0, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    if (!_e(t))
      return;
    const e = t.map, n = e.getView();
    if (n.getConstraints().rotation === Oi)
      return;
    const r = e.getSize(), A = t.pixel, s = Math.atan2(r[1] / 2 - A[1], A[0] - r[0] / 2);
    if (this.lastAngle_ !== void 0) {
      const g = s - this.lastAngle_;
      n.adjustRotationInternal(-g);
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
    return _e(t) ? (t.map.getView().endInteraction(this.duration_), !1) : !0;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    return _e(t) && lg(t) && this.condition_(t) ? (t.map.getView().beginInteraction(), this.lastAngle_ = void 0, !0) : !1;
  }
}
class QC extends An {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Pointer.js").Options} */
      t
    ), this.condition_ = t.condition ? t.condition : hg, this.lastAngle_ = void 0, this.lastMagnitude_ = void 0, this.lastScaleDelta_ = 0, this.duration_ = t.duration !== void 0 ? t.duration : 400;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    if (!_e(t))
      return;
    const e = t.map, n = e.getSize(), r = t.pixel, A = r[0] - n[0] / 2, s = n[1] / 2 - r[1], g = Math.atan2(s, A), o = Math.sqrt(A * A + s * s), a = e.getView();
    if (this.lastAngle_ !== void 0) {
      const I = this.lastAngle_ - g;
      a.adjustRotationInternal(I);
    }
    this.lastAngle_ = g, this.lastMagnitude_ !== void 0 && a.adjustResolutionInternal(this.lastMagnitude_ / o), this.lastMagnitude_ !== void 0 && (this.lastScaleDelta_ = this.lastMagnitude_ / o), this.lastMagnitude_ = o;
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    if (!_e(t))
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
    return _e(t) && this.condition_(t) ? (t.map.getView().beginInteraction(), this.lastAngle_ = void 0, this.lastMagnitude_ = void 0, !0) : !1;
  }
}
class WC extends FC {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = t.condition ? t.condition : hg;
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
      const A = n.rotatedExtentForGeometry(r), s = n.getResolutionForExtentInternal(A), g = n.getResolution() / s;
      r = r.clone(), r.scale(g * g);
    }
    n.fitInternal(r, {
      duration: this.duration_,
      easing: Pr
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
}, rs = {
  LENGTH: "length"
};
class ir extends Ie {
  /**
   * @param {import("./CollectionEventType.js").default} type Type.
   * @param {T} element Element.
   * @param {number} index The index of the added or removed element.
   */
  constructor(t, e, n) {
    super(t), this.element = e, this.index = n;
  }
}
class HC extends rn {
  /**
   * @param {Array<T>} [array] Array.
   * @param {Options} [options] Collection options.
   */
  constructor(t, e) {
    if (super(), this.on, this.once, this.un, e = e || {}, this.unique_ = !!e.unique, this.array_ = t || [], this.unique_)
      for (let n = 0, r = this.array_.length; n < r; ++n)
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
    return this.get(rs.LENGTH);
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
    this.unique_ && this.assertUnique_(t);
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
    this.set(rs.LENGTH, this.array_.length);
  }
  /**
   * @private
   * @param {T} elem Element.
   * @param {number} [except] Optional index to ignore.
   */
  assertUnique_(t, e) {
    for (let n = 0, r = this.array_.length; n < r; ++n)
      if (this.array_[n] === t && n !== e)
        throw new Error("Duplicate item added to a unique collection");
  }
}
const Pe = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown"
};
class VC extends Nn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.defaultCondition_ = function(e) {
      return ug(e) && fg(e);
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
    if (t.type == ye.KEYDOWN) {
      const n = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), r = n.key;
      if (this.condition_(t) && (r == Pe.DOWN || r == Pe.LEFT || r == Pe.RIGHT || r == Pe.UP)) {
        const s = t.map.getView(), g = s.getResolution() * this.pixelDelta_;
        let o = 0, a = 0;
        r == Pe.DOWN ? a = -g : r == Pe.LEFT ? o = -g : r == Pe.RIGHT ? o = g : a = g;
        const I = [o, a];
        pi(I, s.getRotation()), OC(s, I, this.duration_), n.preventDefault(), e = !0;
      }
    }
    return !e;
  }
}
class YC extends Nn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.condition_ = t.condition ? t.condition : function(e) {
      return !GC(e) && fg(e);
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
    if (t.type == ye.KEYDOWN || t.type == ye.KEYPRESS) {
      const n = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), r = n.key;
      if (this.condition_(t) && (r === "+" || r === "-")) {
        const A = t.map, s = r === "+" ? this.delta_ : -this.delta_, g = A.getView();
        Bi(g, s, void 0, this.duration_), n.preventDefault(), e = !0;
      }
    }
    return !e;
  }
}
const KC = 40, JC = 300;
class qC extends Nn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Interaction.js").InteractionOptions} */
      t
    ), this.totalDelta_ = 0, this.lastDelta_ = 0, this.maxDelta_ = t.maxDelta !== void 0 ? t.maxDelta : 1, this.duration_ = t.duration !== void 0 ? t.duration : 250, this.timeout_ = t.timeout !== void 0 ? t.timeout : 80, this.useAnchor_ = t.useAnchor !== void 0 ? t.useAnchor : !0, this.constrainResolution_ = t.constrainResolution !== void 0 ? t.constrainResolution : !1;
    const e = t.condition ? t.condition : NC;
    this.condition_ = t.onFocusOnly ? ai(cg, e) : e, this.lastAnchor_ = null, this.startTime_ = void 0, this.timeoutId_, this.mode_ = void 0, this.trackpadEventGap_ = 400, this.trackpadTimeoutId_, this.deltaPerZoom_ = 300;
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
    if (!this.condition_(t) || t.type !== ye.WHEEL)
      return !0;
    const n = t.map, r = (
      /** @type {WheelEvent} */
      t.originalEvent
    );
    r.preventDefault(), this.useAnchor_ && (this.lastAnchor_ = t.pixel);
    let A = r.deltaY;
    switch (r.deltaMode) {
      case WheelEvent.DOM_DELTA_LINE:
        A *= KC;
        break;
      case WheelEvent.DOM_DELTA_PAGE:
        A *= JC;
        break;
    }
    if (A === 0)
      return !1;
    this.lastDelta_ = A;
    const s = Date.now();
    this.startTime_ === void 0 && (this.startTime_ = s), (!this.mode_ || s - this.startTime_ > this.trackpadEventGap_) && (this.mode_ = Math.abs(A) < 4 ? "trackpad" : "wheel");
    const g = n.getView();
    if (this.mode_ === "trackpad" && !(g.getConstrainResolution() || this.constrainResolution_))
      return this.trackpadTimeoutId_ ? clearTimeout(this.trackpadTimeoutId_) : (g.getAnimating() && g.cancelAnimations(), g.beginInteraction()), this.trackpadTimeoutId_ = setTimeout(
        this.endInteraction_.bind(this),
        this.timeout_
      ), g.adjustZoom(
        -A / this.deltaPerZoom_,
        this.lastAnchor_ ? n.getCoordinateFromPixel(this.lastAnchor_) : null
      ), this.startTime_ = s, !1;
    this.totalDelta_ += A;
    const o = Math.max(this.timeout_ - (s - this.startTime_), 0);
    return clearTimeout(this.timeoutId_), this.timeoutId_ = setTimeout(
      this.handleWheelZoom_.bind(this, n),
      o
    ), !1;
  }
  /**
   * @private
   * @param {import("../Map.js").default} map Map.
   */
  handleWheelZoom_(t) {
    const e = t.getView();
    e.getAnimating() && e.cancelAnimations();
    let n = -Qt(
      this.totalDelta_,
      -this.maxDelta_ * this.deltaPerZoom_,
      this.maxDelta_ * this.deltaPerZoom_
    ) / this.deltaPerZoom_;
    (e.getConstrainResolution() || this.constrainResolution_) && (n = n ? n > 0 ? 1 : -1 : 0), Bi(
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
class _C extends An {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = vr), super(e), this.anchor_ = null, this.lastAngle_ = void 0, this.rotating_ = !1, this.rotationDelta_ = 0, this.threshold_ = t.threshold !== void 0 ? t.threshold : 0.3, this.duration_ = t.duration !== void 0 ? t.duration : 250;
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
      const o = A - this.lastAngle_;
      this.rotationDelta_ += o, !this.rotating_ && Math.abs(this.rotationDelta_) > this.threshold_ && (this.rotating_ = !0), e = o;
    }
    this.lastAngle_ = A;
    const s = t.map, g = s.getView();
    g.getConstraints().rotation !== Oi && (this.anchor_ = s.getCoordinateFromPixelInternal(
      s.getEventPixel(Ti(this.targetPointers))
    ), this.rotating_ && (s.render(), g.adjustRotationInternal(e, this.anchor_)));
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
class $C extends An {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = vr), super(e), this.anchor_ = null, this.duration_ = t.duration !== void 0 ? t.duration : 400, this.lastDistance_ = void 0, this.lastScaleDelta_ = 1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    let e = 1;
    const n = this.targetPointers[0], r = this.targetPointers[1], A = n.clientX - r.clientX, s = n.clientY - r.clientY, g = Math.sqrt(A * A + s * s);
    this.lastDistance_ !== void 0 && (e = this.lastDistance_ / g), this.lastDistance_ = g;
    const o = t.map, a = o.getView();
    e != 1 && (this.lastScaleDelta_ = e), this.anchor_ = o.getCoordinateFromPixelInternal(
      o.getEventPixel(Ti(this.targetPointers))
    ), o.render(), a.adjustResolutionInternal(e, this.anchor_);
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
class tc {
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
function is(i) {
  i = i || {};
  const t = new HC(), e = new tc(-5e-3, 0.05, 100);
  return (i.altShiftDragRotate !== void 0 ? i.altShiftDragRotate : !0) && t.push(new zC()), (i.doubleClickZoom !== void 0 ? i.doubleClickZoom : !0) && t.push(
    new DC({
      delta: i.zoomDelta,
      duration: i.zoomDuration
    })
  ), (i.dragPan !== void 0 ? i.dragPan : !0) && t.push(
    new UC({
      onFocusOnly: i.onFocusOnly,
      kinetic: e
    })
  ), (i.pinchRotate !== void 0 ? i.pinchRotate : !0) && t.push(new _C()), (i.pinchZoom !== void 0 ? i.pinchZoom : !0) && t.push(
    new $C({
      duration: i.zoomDuration
    })
  ), (i.keyboard !== void 0 ? i.keyboard : !0) && (t.push(new VC()), t.push(
    new YC({
      delta: i.zoomDelta,
      duration: i.zoomDuration
    })
  )), (i.mouseWheelZoom !== void 0 ? i.mouseWheelZoom : !0) && t.push(
    new qC({
      onFocusOnly: i.onFocusOnly,
      duration: i.zoomDuration
    })
  ), (i.shiftDragZoom !== void 0 ? i.shiftDragZoom : !0) && t.push(
    new WC({
      duration: i.zoomDuration
    })
  ), t;
}
function ec(i) {
  return nc(i[0], i[1], i[2]);
}
function nc(i, t, e) {
  return (t << i) + e;
}
const rc = /\{z\}/g, ic = /\{x\}/g, Ac = /\{y\}/g, sc = /\{-y\}/g;
function gc(i, t, e, n, r) {
  return i.replace(rc, t.toString()).replace(ic, e.toString()).replace(Ac, n.toString()).replace(sc, function() {
    throw new Error(
      "If the URL template has a {-y} placeholder, the grid extent must be known"
    );
  });
}
function oc(i, t) {
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
      return gc(i, A, e[1], e[2]);
    })
  );
}
function As(i, t) {
  const e = i.length, n = new Array(e);
  for (let r = 0; r < e; ++r)
    n[r] = oc(i[r]);
  return ac(n);
}
function ac(i) {
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
      const r = ec(t), A = ri(r, i.length);
      return i[A](t, e, n);
    })
  );
}
for (let i = 0; i < 9; i++) {
  const t = `ZOOM:${i}`, e = 256 * Math.pow(2, i);
  (function(n, r) {
    const A = new ro({
      code: n,
      // The extent is used to determine zoom level 0. Recommended values for a
      // projection's validity extent can be found at https://epsg.io/.
      extent: [0, 0, r, r],
      units: "m"
    });
    Jr(A), ar(
      "EPSG:3857",
      A,
      (s) => {
        const g = (s[0] + at) * r / (2 * at), o = (-s[1] + at) * r / (2 * at);
        return [g, o];
      },
      (s) => {
        const g = s[0] * (2 * at) / r - at, o = -1 * (s[1] * (2 * at) / r - at);
        return [g, o];
      }
    );
  })(t, e);
}
class dg extends Ta(ps) {
  constructor(t = {}) {
    t = js(t), t.wrapX = !1;
    const e = Math.log2(t.width / Re), n = Math.log2(t.height / Re);
    t.maxZoom = Math.ceil(Math.max(e, n)), t.tileUrlFunction = t.tileUrlFunction || function(r) {
      const A = r[0], s = r[1], g = r[2];
      return (
        // @ts-ignore
        s * Re * Math.pow(2, this.maxZoom - A) >= this.width || // @ts-ignore
        g * Re * Math.pow(2, this.maxZoom - A) >= this.height || s < 0 || g < 0 ? Rs : this._tileUrlFunction(r)
      );
    }, super(t), t.mapID && (this.mapID = t.mapID), t.urls ? this._tileUrlFunction = As(t.urls) : t.url && (this._tileUrlFunction = As(Array.isArray(t.url) ? t.url : [t.url])), this.width = t.width, this.height = t.height, this.maxZoom = t.maxZoom, this._maxxy = Math.pow(2, this.maxZoom) * Re, this.initialize(t);
  }
}
class Dn extends nn {
  constructor(t = {}) {
    super(Object.assign(t, { opaque: !1 }));
  }
}
w(Dn, "isBasemap_", !1);
const ge = "https://weiwudi.example.com/api/";
let Qr, He;
(function() {
  if (typeof window.CustomEvent == "function") return !1;
  function i(t, e) {
    e = e || { bubbles: !1, cancelable: !1, detail: void 0 };
    var n = document.createEvent("CustomEvent");
    return n.initCustomEvent(t, e.bubbles, e.cancelable, e.detail), n;
  }
  i.prototype = window.Event.prototype, window.CustomEvent = i;
})();
class Ic {
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
class oe extends Ic {
  static async registerSW(t, e) {
    if ("serviceWorker" in navigator)
      try {
        const n = await navigator.serviceWorker.register(t, e), r = n.installing, A = n.waiting;
        return r && (r.state === "activated" && !A && window.location.reload(), r.addEventListener("statechange", (s) => {
          r.state === "activated" && !A && window.location.reload();
        })), n.onupdatefound = () => {
          n.update();
        }, await oe.swCheck(), n;
      } catch (n) {
        throw `Error: Service worker registration failed with ${n}`;
      }
    else
      throw "Error: Service worker is not supported";
  }
  static async swCheck() {
    return He !== void 0 ? He : (Qr === void 0 && (Qr = new Promise((t, e) => {
      fetch(`${ge}ping`).then((n) => {
        He = !!n, t(He);
      }).catch((n) => {
        He = !1, t(He);
      });
    })), Qr);
  }
  static async registerMap(t, e) {
    if (!await oe.swCheck()) throw "Weiwudi service worker is not implemented.";
    let r;
    const A = ["type", "url", "width", "height", "tileSize", "minZoom", "maxZoom", "maxLng", "maxLat", "minLng", "minLat"].reduce((o, a) => (typeof e[a] < "u" && (e[a] instanceof Array ? e[a].map((I) => {
      o.append(a, I);
    }) : o.append(a, e[a])), o), new URLSearchParams());
    A.append("mapID", t);
    const s = new URL(`${ge}add`);
    if (s.search = A, r = await (await fetch(s.href)).text(), r.match(/^Error: /))
      throw r;
    return new oe(t, JSON.parse(r));
  }
  static async retrieveMap(t) {
    if (!await oe.swCheck()) throw "Weiwudi service worker is not implemented.";
    let n;
    if (n = await (await fetch(`${ge}info?mapID=${t}`)).text(), n.match(/^Error: /))
      throw n;
    return console.log(n), new oe(t, JSON.parse(n));
  }
  static async removeMap(t) {
    if (!await oe.swCheck()) throw "Weiwudi service worker is not implemented.";
    let n;
    if (n = await (await fetch(`${ge}delete?mapID=${t}`)).text(), n.match(/^Error: /))
      throw n;
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
    this.checkAspect(), await oe.removeMap(this.mapID), this.release();
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
  if (A == jr && n != r) {
    const s = Lr(i, "EPSG:3857"), g = Lr("EPSG:3857", t);
    if (s == jr && n != "EPSG:3857")
      throw "Transform of Source projection is not defined.";
    if (g == jr && r != "EPSG:3857")
      throw "Transform of Distination projection is not defined.";
    A = function(a) {
      return Lt(Lt(a, i, "EPSG:3857"), "EPSG:3857", t);
    }, ar(i, t, A, function(a) {
      return Lt(Lt(a, t, "EPSG:3857"), "EPSG:3857", i);
    });
  }
  if (e)
    return A(e);
}
function Cc(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
var un = { exports: {} }, cc = un.exports, ss;
function lc() {
  return ss || (ss = 1, (function(i, t) {
    (function(e, n) {
      n(t);
    })(cc, function(e) {
      var n = Object.defineProperty, r = (d, y, E) => y in d ? n(d, y, { enumerable: !0, configurable: !0, writable: !0, value: E }) : d[y] = E, A = (d, y, E) => r(d, typeof y != "symbol" ? y + "" : y, E);
      function s(d, y, E = {}) {
        const M = { type: "Feature" };
        return (E.id === 0 || E.id) && (M.id = E.id), E.bbox && (M.bbox = E.bbox), M.properties = y || {}, M.geometry = d, M;
      }
      function g(d, y, E = {}) {
        if (!d) throw new Error("coordinates is required");
        if (!Array.isArray(d)) throw new Error("coordinates must be an Array");
        if (d.length < 2) throw new Error("coordinates must be at least 2 numbers long");
        if (!I(d[0]) || !I(d[1])) throw new Error("coordinates must contain numbers");
        return s({ type: "Point", coordinates: d }, y, E);
      }
      function o(d, y, E = {}) {
        for (const M of d) {
          if (M.length < 4) throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
          if (M[M.length - 1].length !== M[0].length) throw new Error("First and last Position are not equivalent.");
          for (let k = 0; k < M[M.length - 1].length; k++) if (M[M.length - 1][k] !== M[0][k]) throw new Error("First and last Position are not equivalent.");
        }
        return s({ type: "Polygon", coordinates: d }, y, E);
      }
      function a(d, y = {}) {
        const E = { type: "FeatureCollection" };
        return y.id && (E.id = y.id), y.bbox && (E.bbox = y.bbox), E.features = d, E;
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
      const u = 11102230246251565e-32, f = 134217729, m = (3 + 8 * u) * u;
      function p(d, y, E, M, k) {
        let x, L, G, B, X = y[0], Z = M[0], S = 0, j = 0;
        Z > X == Z > -X ? (x = X, X = y[++S]) : (x = Z, Z = M[++j]);
        let U = 0;
        if (S < d && j < E) for (Z > X == Z > -X ? (L = X + x, G = x - (L - X), X = y[++S]) : (L = Z + x, G = x - (L - Z), Z = M[++j]), x = L, G !== 0 && (k[U++] = G); S < d && j < E; ) Z > X == Z > -X ? (L = x + X, B = L - x, G = x - (L - B) + (X - B), X = y[++S]) : (L = x + Z, B = L - x, G = x - (L - B) + (Z - B), Z = M[++j]), x = L, G !== 0 && (k[U++] = G);
        for (; S < d; ) L = x + X, B = L - x, G = x - (L - B) + (X - B), X = y[++S], x = L, G !== 0 && (k[U++] = G);
        for (; j < E; ) L = x + Z, B = L - x, G = x - (L - B) + (Z - B), Z = M[++j], x = L, G !== 0 && (k[U++] = G);
        return (x !== 0 || U === 0) && (k[U++] = x), U;
      }
      function v(d, y) {
        let E = y[0];
        for (let M = 1; M < d; M++) E += y[M];
        return E;
      }
      function O(d) {
        return new Float64Array(d);
      }
      const D = (3 + 16 * u) * u, z = (2 + 12 * u) * u, W = (9 + 64 * u) * u * u, K = O(4), _ = O(8), At = O(12), rt = O(16), V = O(4);
      function gt(d, y, E, M, k, x, L) {
        let G, B, X, Z, S, j, U, Y, N, T, P, Q, $, et, st, J, it, ct;
        const xt = d - k, Tt = E - k, St = y - x, ft = M - x;
        et = xt * ft, j = f * xt, U = j - (j - xt), Y = xt - U, j = f * ft, N = j - (j - ft), T = ft - N, st = Y * T - (et - U * N - Y * N - U * T), J = St * Tt, j = f * St, U = j - (j - St), Y = St - U, j = f * Tt, N = j - (j - Tt), T = Tt - N, it = Y * T - (J - U * N - Y * N - U * T), P = st - it, S = st - P, K[0] = st - (P + S) + (S - it), Q = et + P, S = Q - et, $ = et - (Q - S) + (P - S), P = $ - J, S = $ - P, K[1] = $ - (P + S) + (S - J), ct = Q + P, S = ct - Q, K[2] = Q - (ct - S) + (P - S), K[3] = ct;
        let Vt = v(4, K), Ee = z * L;
        if (Vt >= Ee || -Vt >= Ee || (S = d - xt, G = d - (xt + S) + (S - k), S = E - Tt, X = E - (Tt + S) + (S - k), S = y - St, B = y - (St + S) + (S - x), S = M - ft, Z = M - (ft + S) + (S - x), G === 0 && B === 0 && X === 0 && Z === 0) || (Ee = W * L + m * Math.abs(Vt), Vt += xt * Z + ft * G - (St * X + Tt * B), Vt >= Ee || -Vt >= Ee)) return Vt;
        et = G * ft, j = f * G, U = j - (j - G), Y = G - U, j = f * ft, N = j - (j - ft), T = ft - N, st = Y * T - (et - U * N - Y * N - U * T), J = B * Tt, j = f * B, U = j - (j - B), Y = B - U, j = f * Tt, N = j - (j - Tt), T = Tt - N, it = Y * T - (J - U * N - Y * N - U * T), P = st - it, S = st - P, V[0] = st - (P + S) + (S - it), Q = et + P, S = Q - et, $ = et - (Q - S) + (P - S), P = $ - J, S = $ - P, V[1] = $ - (P + S) + (S - J), ct = Q + P, S = ct - Q, V[2] = Q - (ct - S) + (P - S), V[3] = ct;
        const xr = p(4, K, 4, V, _);
        et = xt * Z, j = f * xt, U = j - (j - xt), Y = xt - U, j = f * Z, N = j - (j - Z), T = Z - N, st = Y * T - (et - U * N - Y * N - U * T), J = St * X, j = f * St, U = j - (j - St), Y = St - U, j = f * X, N = j - (j - X), T = X - N, it = Y * T - (J - U * N - Y * N - U * T), P = st - it, S = st - P, V[0] = st - (P + S) + (S - it), Q = et + P, S = Q - et, $ = et - (Q - S) + (P - S), P = $ - J, S = $ - P, V[1] = $ - (P + S) + (S - J), ct = Q + P, S = ct - Q, V[2] = Q - (ct - S) + (P - S), V[3] = ct;
        const Sr = p(xr, _, 4, V, At);
        et = G * Z, j = f * G, U = j - (j - G), Y = G - U, j = f * Z, N = j - (j - Z), T = Z - N, st = Y * T - (et - U * N - Y * N - U * T), J = B * X, j = f * B, U = j - (j - B), Y = B - U, j = f * X, N = j - (j - X), T = X - N, it = Y * T - (J - U * N - Y * N - U * T), P = st - it, S = st - P, V[0] = st - (P + S) + (S - it), Q = et + P, S = Q - et, $ = et - (Q - S) + (P - S), P = $ - J, S = $ - P, V[1] = $ - (P + S) + (S - J), ct = Q + P, S = ct - Q, V[2] = Q - (ct - S) + (P - S), V[3] = ct;
        const Or = p(Sr, At, 4, V, rt);
        return rt[Or - 1];
      }
      function dt(d, y, E, M, k, x) {
        const L = (y - x) * (E - k), G = (d - k) * (M - x), B = L - G, X = Math.abs(L + G);
        return Math.abs(B) >= D * X ? B : -gt(d, y, E, M, k, x, X);
      }
      function ht(d, y) {
        var E, M, k = 0, x, L, G, B, X, Z, S, j = d[0], U = d[1], Y = y.length;
        for (E = 0; E < Y; E++) {
          M = 0;
          var N = y[E], T = N.length - 1;
          if (Z = N[0], Z[0] !== N[T][0] && Z[1] !== N[T][1]) throw new Error("First and last coordinates in a ring must be the same");
          for (L = Z[0] - j, G = Z[1] - U, M; M < T; M++) {
            if (S = N[M + 1], B = S[0] - j, X = S[1] - U, G === 0 && X === 0) {
              if (B <= 0 && L >= 0 || L <= 0 && B >= 0) return 0;
            } else if (X >= 0 && G <= 0 || X <= 0 && G >= 0) {
              if (x = dt(L, B, G, X, 0, 0), x === 0) return 0;
              (x > 0 && X > 0 && G <= 0 || x < 0 && X <= 0 && G > 0) && k++;
            }
            Z = S, G = X, L = B;
          }
        }
        return k % 2 !== 0;
      }
      function jt(d, y, E = {}) {
        if (!d) throw new Error("point is required");
        if (!y) throw new Error("polygon is required");
        const M = C(d), k = l(y), x = k.type, L = y.bbox;
        let G = k.coordinates;
        if (L && F(M, L) === !1) return !1;
        x === "Polygon" && (G = [G]);
        let B = !1;
        for (var X = 0; X < G.length; ++X) {
          const Z = ht(M, G[X]);
          if (Z === 0) return !E.ignoreBoundary;
          Z && (B = !0);
        }
        return B;
      }
      function F(d, y) {
        return y[0] <= d[0] && y[1] <= d[1] && y[2] >= d[0] && y[3] >= d[1];
      }
      function ot(d, y) {
        for (let E = 0; E < y.features.length; E++) if (jt(d, y.features[E])) return y.features[E];
      }
      function Rt(d, y, E) {
        const M = y.geometry.coordinates[0][0], k = y.geometry.coordinates[0][1], x = y.geometry.coordinates[0][2], L = d.geometry.coordinates, G = y.properties.a.geom, B = y.properties.b.geom, X = y.properties.c.geom, Z = [k[0] - M[0], k[1] - M[1]], S = [x[0] - M[0], x[1] - M[1]], j = [L[0] - M[0], L[1] - M[1]], U = [B[0] - G[0], B[1] - G[1]], Y = [X[0] - G[0], X[1] - G[1]];
        let N = (S[1] * j[0] - S[0] * j[1]) / (Z[0] * S[1] - Z[1] * S[0]), T = (Z[0] * j[1] - Z[1] * j[0]) / (Z[0] * S[1] - Z[1] * S[0]);
        if (E) {
          const P = E[y.properties.a.index], Q = E[y.properties.b.index], $ = E[y.properties.c.index];
          let et;
          if (N < 0 || T < 0 || 1 - N - T < 0) {
            const st = N / (N + T), J = T / (N + T);
            et = N / Q / (st / Q + J / $), T = T / $ / (st / Q + J / $);
          } else et = N / Q / (N / Q + T / $ + (1 - N - T) / P), T = T / $ / (N / Q + T / $ + (1 - N - T) / P);
          N = et;
        }
        return [N * U[0] + T * Y[0] + G[0], N * U[1] + T * Y[1] + G[1]];
      }
      function kt(d, y, E, M) {
        const k = d.geometry.coordinates, x = E.geometry.coordinates, L = Math.atan2(k[0] - x[0], k[1] - x[1]), G = gn(L, y[0]);
        if (G === void 0) throw new Error("Unable to determine vertex index");
        const B = y[1][G];
        return Rt(d, B.features[0], M);
      }
      function Zt(d, y, E, M, k, x, L, G) {
        let B;
        if (L && (B = ot(d, a([L]))), !B) {
          if (E) {
            const X = d.geometry.coordinates, Z = E.gridNum, S = E.xOrigin, j = E.yOrigin, U = E.xUnit, Y = E.yUnit, N = E.gridCache, T = Ct(X[0], S, U, Z), P = Ct(X[1], j, Y, Z), Q = N[T] ? N[T][P] ? N[T][P] : [] : [];
            y = a(Q.map(($) => y.features[$]));
          }
          B = ot(d, y);
        }
        return G && G(B), B ? Rt(d, B, x) : kt(d, M, k, x);
      }
      function Ct(d, y, E, M) {
        let k = Math.floor((d - y) / E);
        return k >= M && (k = M - 1), k;
      }
      function gn(d, y) {
        let E = ke(d - y[0]), M = Math.PI * 2, k;
        for (let x = 0; x < y.length; x++) {
          const L = (x + 1) % y.length, G = ke(d - y[L]), B = Math.min(Math.abs(E), Math.abs(G));
          E * G <= 0 && B < M && (M = B, k = x), E = G;
        }
        return k;
      }
      function ke(d, y = !1) {
        const E = y ? function(M) {
          return !(M >= 0 && M < Math.PI * 2);
        } : function(M) {
          return !(M > -1 * Math.PI && M <= Math.PI);
        };
        for (; E(d); ) d = d + 2 * Math.PI * (d > 0 ? -1 : 1);
        return d;
      }
      function Wt(d, y) {
        return y && y >= 2.00703 || Array.isArray(d[0]) ? d : d.map((E) => [E.illstNodes, E.mercNodes, E.startEnd]);
      }
      function Ne(d) {
        const y = d.features;
        for (let E = 0; E < y.length; E++) {
          const M = y[E];
          `${M.properties.a.index}`.substring(0, 1) === "b" && `${M.properties.b.index}`.substring(0, 1) === "b" ? y[E] = { geometry: { type: "Polygon", coordinates: [[M.geometry.coordinates[0][2], M.geometry.coordinates[0][0], M.geometry.coordinates[0][1], M.geometry.coordinates[0][2]]] }, properties: { a: { geom: M.properties.c.geom, index: M.properties.c.index }, b: { geom: M.properties.a.geom, index: M.properties.a.index }, c: { geom: M.properties.b.geom, index: M.properties.b.index } }, type: "Feature" } : `${M.properties.c.index}`.substring(0, 1) === "b" && `${M.properties.a.index}`.substring(0, 1) === "b" && (y[E] = { geometry: { type: "Polygon", coordinates: [[M.geometry.coordinates[0][1], M.geometry.coordinates[0][2], M.geometry.coordinates[0][0], M.geometry.coordinates[0][1]]] }, properties: { a: { geom: M.properties.b.geom, index: M.properties.b.index }, b: { geom: M.properties.c.geom, index: M.properties.c.index }, c: { geom: M.properties.a.geom, index: M.properties.a.index } }, type: "Feature" });
        }
        return d;
      }
      function ie(d) {
        const y = ["a", "b", "c", "a"].map((x) => d.properties[x].geom), E = d.geometry.coordinates[0], M = d.properties, k = { a: { geom: E[0], index: M.a.index }, b: { geom: E[1], index: M.b.index }, c: { geom: E[2], index: M.c.index } };
        return o([y], k);
      }
      function Ce(d) {
        const y = [0, 1, 2, 0].map((M) => d[M][0][0]), E = { a: { geom: d[0][0][1], index: d[0][1] }, b: { geom: d[1][0][1], index: d[1][1] }, c: { geom: d[2][0][1], index: d[2][1] } };
        return o([y], E);
      }
      function Ae(d, y, E, M, k, x = !1, L) {
        const G = d.map((B) => {
          (!L || L < 2.00703) && (B = Ht(B));
          const X = isFinite(B) ? y[B] : B === "c" ? M : B === "b0" ? k[0] : B === "b1" ? k[1] : B === "b2" ? k[2] : B === "b3" ? k[3] : (function() {
            const Z = B.match(/e(\d+)/);
            if (Z) {
              const S = parseInt(Z[1]);
              return E[S];
            }
            throw "Bad index value for indexesToTri";
          })();
          return x ? [[X[1], X[0]], B] : [[X[0], X[1]], B];
        });
        return Ce(G);
      }
      function Ht(d) {
        return typeof d == "number" ? d : d.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
      }
      const se = 2.00703;
      function q(d) {
        return !!(d.version || !d.tins && d.points && d.tins_points);
      }
      function be(d) {
        return { points: d.points, pointsWeightBuffer: Ge(d), strictStatus: on(d), verticesParams: Gn(d), centroid: Xn(d), edges: Wt(d.edges || []), edgeNodes: d.edgeNodes || [], tins: an(d), kinks: Zn(d.kinks_points), yaxisMode: d.yaxisMode ?? "invert", strictMode: d.strictMode ?? "auto", vertexMode: d.vertexMode, bounds: d.bounds, boundsPolygon: d.boundsPolygon, wh: d.wh, xy: d.bounds ? d.xy : [0, 0] };
      }
      function we(d) {
        const y = Fn(d), E = y.tins;
        return { compiled: y, tins: E, points: Un(E), strictStatus: y.strict_status, pointsWeightBuffer: y.weight_buffer, verticesParams: y.vertices_params, centroid: y.centroid, kinks: y.kinks };
      }
      function Ge(d) {
        return !d.version || d.version < se ? ["forw", "bakw"].reduce((y, E) => {
          const M = d.weight_buffer[E];
          return M && (y[E] = Object.keys(M).reduce((k, x) => {
            const L = Ht(x);
            return k[L] = M[x], k;
          }, {})), y;
        }, {}) : d.weight_buffer;
      }
      function on(d) {
        return d.strict_status ? d.strict_status : d.kinks_points ? "strict_error" : d.tins_points.length === 2 ? "loose" : "strict";
      }
      function Gn(d) {
        const y = { forw: [d.vertices_params[0]], bakw: [d.vertices_params[1]] };
        return y.forw[1] = ce(d, !1), y.bakw[1] = ce(d, !0), y;
      }
      function ce(d, y) {
        return [0, 1, 2, 3].map((E) => {
          const M = (E + 1) % 4, k = Ae(["c", `b${E}`, `b${M}`], d.points, d.edgeNodes || [], d.centroid_point, d.vertices_points, y, se);
          return a([k]);
        });
      }
      function Xn(d) {
        return { forw: g(d.centroid_point[0], { target: { geom: d.centroid_point[1], index: "c" } }), bakw: g(d.centroid_point[1], { target: { geom: d.centroid_point[0], index: "c" } }) };
      }
      function an(d) {
        const y = d.tins_points.length === 1 ? 0 : 1;
        return { forw: a(d.tins_points[0].map((E) => Ae(E, d.points, d.edgeNodes || [], d.centroid_point, d.vertices_points, !1, d.version))), bakw: a(d.tins_points[y].map((E) => Ae(E, d.points, d.edgeNodes || [], d.centroid_point, d.vertices_points, !0, d.version))) };
      }
      function Zn(d) {
        if (d) return { bakw: a(d.map((y) => g(y))) };
      }
      function Fn(d) {
        return JSON.parse(JSON.stringify(d).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"'));
      }
      function Un(d) {
        const y = [], E = d.forw.features;
        for (let M = 0; M < E.length; M++) {
          const k = E[M];
          ["a", "b", "c"].map((x, L) => {
            const G = k.geometry.coordinates[0][L], B = k.properties[x].geom, X = k.properties[x].index;
            typeof X == "number" && (y[X] = [G, B]);
          });
        }
        return y;
      }
      const zn = se, Bt = class Jt {
        constructor() {
          A(this, "points", []), A(this, "pointsWeightBuffer"), A(this, "strict_status"), A(this, "vertices_params"), A(this, "centroid"), A(this, "edgeNodes"), A(this, "edges"), A(this, "tins"), A(this, "kinks"), A(this, "yaxisMode", Jt.YAXIS_INVERT), A(this, "strictMode", Jt.MODE_AUTO), A(this, "vertexMode", Jt.VERTEX_PLAIN), A(this, "bounds"), A(this, "boundsPolygon"), A(this, "wh"), A(this, "xy"), A(this, "indexedTins"), A(this, "stateFull", !1), A(this, "stateTriangle"), A(this, "stateBackward");
        }
        setCompiled(y) {
          if (q(y)) {
            this.applyModernState(be(y));
            return;
          }
          this.applyLegacyState(we(y));
        }
        applyModernState(y) {
          this.points = y.points, this.pointsWeightBuffer = y.pointsWeightBuffer, this.strict_status = y.strictStatus, this.vertices_params = y.verticesParams, this.centroid = y.centroid, this.edges = y.edges, this.edgeNodes = y.edgeNodes || [], this.tins = y.tins, this.addIndexedTin(), this.kinks = y.kinks, this.yaxisMode = y.yaxisMode ?? Jt.YAXIS_INVERT, this.vertexMode = y.vertexMode ?? Jt.VERTEX_PLAIN, this.strictMode = y.strictMode ?? Jt.MODE_AUTO, y.bounds ? (this.bounds = y.bounds, this.boundsPolygon = y.boundsPolygon, this.xy = y.xy, this.wh = y.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = y.xy ?? [0, 0], y.wh && (this.wh = y.wh));
        }
        applyLegacyState(y) {
          this.tins = y.tins, this.addIndexedTin(), this.strict_status = y.strictStatus, this.pointsWeightBuffer = y.pointsWeightBuffer, this.vertices_params = y.verticesParams, this.centroid = y.centroid, this.kinks = y.kinks, this.points = y.points;
        }
        addIndexedTin() {
          const y = this.tins, E = y.forw, M = y.bakw, k = Math.ceil(Math.sqrt(E.features.length));
          if (k < 3) {
            this.indexedTins = void 0;
            return;
          }
          let x = [], L = [];
          const G = E.features.map((N) => {
            let T = [];
            return c(N)[0].map((P) => {
              x.length === 0 ? x = [Array.from(P), Array.from(P)] : (P[0] < x[0][0] && (x[0][0] = P[0]), P[0] > x[1][0] && (x[1][0] = P[0]), P[1] < x[0][1] && (x[0][1] = P[1]), P[1] > x[1][1] && (x[1][1] = P[1])), T.length === 0 ? T = [Array.from(P), Array.from(P)] : (P[0] < T[0][0] && (T[0][0] = P[0]), P[0] > T[1][0] && (T[1][0] = P[0]), P[1] < T[0][1] && (T[0][1] = P[1]), P[1] > T[1][1] && (T[1][1] = P[1]));
            }), T;
          }), B = (x[1][0] - x[0][0]) / k, X = (x[1][1] - x[0][1]) / k, Z = G.reduce((N, T, P) => {
            const Q = Ct(T[0][0], x[0][0], B, k), $ = Ct(T[1][0], x[0][0], B, k), et = Ct(T[0][1], x[0][1], X, k), st = Ct(T[1][1], x[0][1], X, k);
            for (let J = Q; J <= $; J++) {
              N[J] || (N[J] = []);
              for (let it = et; it <= st; it++) N[J][it] || (N[J][it] = []), N[J][it].push(P);
            }
            return N;
          }, []), S = M.features.map((N) => {
            let T = [];
            return c(N)[0].map((P) => {
              L.length === 0 ? L = [Array.from(P), Array.from(P)] : (P[0] < L[0][0] && (L[0][0] = P[0]), P[0] > L[1][0] && (L[1][0] = P[0]), P[1] < L[0][1] && (L[0][1] = P[1]), P[1] > L[1][1] && (L[1][1] = P[1])), T.length === 0 ? T = [Array.from(P), Array.from(P)] : (P[0] < T[0][0] && (T[0][0] = P[0]), P[0] > T[1][0] && (T[1][0] = P[0]), P[1] < T[0][1] && (T[0][1] = P[1]), P[1] > T[1][1] && (T[1][1] = P[1]));
            }), T;
          }), j = (L[1][0] - L[0][0]) / k, U = (L[1][1] - L[0][1]) / k, Y = S.reduce((N, T, P) => {
            const Q = Ct(T[0][0], L[0][0], j, k), $ = Ct(T[1][0], L[0][0], j, k), et = Ct(T[0][1], L[0][1], U, k), st = Ct(T[1][1], L[0][1], U, k);
            for (let J = Q; J <= $; J++) {
              N[J] || (N[J] = []);
              for (let it = et; it <= st; it++) N[J][it] || (N[J][it] = []), N[J][it].push(P);
            }
            return N;
          }, []);
          this.indexedTins = { forw: { gridNum: k, xOrigin: x[0][0], yOrigin: x[0][1], xUnit: B, yUnit: X, gridCache: Z }, bakw: { gridNum: k, xOrigin: L[0][0], yOrigin: L[0][1], xUnit: j, yUnit: U, gridCache: Y } };
        }
        transform(y, E, M) {
          if (E && this.strict_status == Jt.STATUS_ERROR) throw 'Backward transform is not allowed if strict_status == "strict_error"';
          this.yaxisMode == Jt.YAXIS_FOLLOW && E && (y = [y[0], -1 * y[1]]);
          const k = g(y);
          if (this.bounds && !E && !M && !jt(k, this.boundsPolygon)) return !1;
          const x = E ? this.tins.bakw : this.tins.forw, L = E ? this.indexedTins.bakw : this.indexedTins.forw, G = E ? this.vertices_params.bakw : this.vertices_params.forw, B = E ? this.centroid.bakw : this.centroid.forw, X = E ? this.pointsWeightBuffer.bakw : this.pointsWeightBuffer.forw;
          let Z, S;
          this.stateFull && (this.stateBackward == E ? Z = this.stateTriangle : (this.stateBackward = E, this.stateTriangle = void 0), S = (U) => {
            this.stateTriangle = U;
          });
          let j = Zt(k, x, L, G, B, X, Z, S);
          if (this.bounds && E && !M) {
            const U = g(j);
            if (!jt(U, this.boundsPolygon)) return !1;
          } else this.yaxisMode == Jt.YAXIS_FOLLOW && !E && (j = [j[0], -1 * j[1]]);
          return j;
        }
      };
      A(Bt, "VERTEX_PLAIN", "plain"), A(Bt, "VERTEX_BIRDEYE", "birdeye"), A(Bt, "MODE_STRICT", "strict"), A(Bt, "MODE_AUTO", "auto"), A(Bt, "MODE_LOOSE", "loose"), A(Bt, "STATUS_STRICT", "strict"), A(Bt, "STATUS_ERROR", "strict_error"), A(Bt, "STATUS_LOOSE", "loose"), A(Bt, "YAXIS_FOLLOW", "follow"), A(Bt, "YAXIS_INVERT", "invert");
      let Rr = Bt;
      e.Transform = Rr, e.counterTri = ie, e.format_version = zn, e.normalizeEdges = Wt, e.rotateVerticesTriangle = Ne, e.transformArr = Zt, Object.defineProperty(e, Symbol.toStringTag, { value: "Module" });
    });
  })(un, un.exports)), un.exports;
}
var gs = lc();
const uc = [
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
async function hc(i) {
  return fc(i, !1, !0);
}
async function fc(i, t, e) {
  var A, s;
  const n = e ? i : {}, r = [];
  if (uc.forEach((g) => {
    n[g] = i[g];
  }), (i.imageExtention || i.imageExtension) && (n.imageExtension = i.imageExtension || i.imageExtention), i.compiled) {
    let g = new gs.Transform();
    g.setCompiled(i.compiled), g.addIndexedTin();
    const o = g;
    n.strictMode = o.strictMode, n.vertexMode = o.vertexMode, n.yaxisMode = o.yaxisMode, n.width = (A = o.wh) == null ? void 0 : A[0], n.height = (s = o.wh) == null ? void 0 : s[1], n.gcps = o.points, n.edges = o.edges, r.push(g);
  } else {
    n.strictMode = i.strictMode, n.vertexMode = i.vertexMode, n.yaxisMode = i.yaxisMode, n.width = i.width, n.height = i.height, n.gcps = i.gcps, n.edges = i.edges;
    let g = await os(
      i.strictMode,
      i.vertexMode,
      i.yaxisMode,
      i.gcps,
      i.edges,
      [i.width, i.height]
    );
    r.push(g);
  }
  if (i.sub_maps) {
    const g = [];
    for (let o = 0; o < i.sub_maps.length; o++) {
      const a = i.sub_maps[o], I = {};
      if (I.importance = a.importance, I.priority = a.priority, a.compiled) {
        let C = new gs.Transform();
        C.setCompiled(a.compiled), C.addIndexedTin(), I.bounds = C.bounds, I.gcps = C.points, I.edges = C.edges, r.push(C);
      } else {
        I.bounds = a.bounds, I.gcps = a.gcps, I.edges = a.edges;
        let C = await os(
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
      g.push(I);
    }
    n.sub_maps = g;
  }
  return [n, r];
}
async function os(i, t, e, n = [], r = [], A, s) {
  return n.length < 3 ? "tooLessGcps" : (console.error("@maplat/transform requires pre-compiled data. Cannot create from GCPs."), console.error("Please use @maplat/editor or a separate tool to generate compiled data."), "compiledRequired");
}
class pr extends dg {
  constructor(e = {}) {
    super(e);
    w(this, "tins");
    this.tins = [];
  }
  static async createAsync(e) {
    const n = await hc(e);
    e = n[0];
    const r = new pr(e);
    r.tins = n[1];
    const A = new wn({
      code: `Illst:${r.mapID}`,
      extent: [0, 0, r.width, r.height],
      units: "m"
    });
    return Jr(A), ar(
      A,
      "EPSG:3857",
      (s) => r.tins[0].transform(s, !1),
      (s) => r.tins[0].transform(s, !0)
    ), Ar("EPSG:4326", A), e.sub_maps && e.sub_maps.map((s, g) => {
      const o = g + 1, a = `Illst:${r.mapID}#${o}`, I = r.tins[o], C = new wn({
        code: a,
        extent: [I.xy[0], I.xy[1], I.wh[0], I.wh[1]],
        units: "m"
      });
      Jr(C), ar(
        C,
        "EPSG:3857",
        (m) => I.transform(m, !1, !0),
        (m) => I.transform(m, !0, !0)
      ), Ar("EPSG:4326", C);
      const c = Object.assign([], s.bounds);
      c.push(s.bounds[0]);
      const l = c.map((m) => I.transform(m, !1)), u = gr([c]), f = gr([l]);
      I.xyBounds = u, I.mercBounds = f;
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
      const A = this.tins.map((s, g) => [g, s]).sort((s, g) => s[1].priority < g[1].priority ? 1 : -1);
      for (let s = 0; s < A.length; s++) {
        const g = A[s][0], o = A[s][1];
        if (g == 0 || or(e, o.xyBounds)) {
          this.xy2MercAsync_specifyLayer(e, g).then((a) => {
            n([g, a]);
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
          this.merc2XyAsync_specifyLayer(e, r).then((g) => {
            r === 0 || or(g, n.xyBounds) ? A([n, r, g]) : A([n, r]);
          }).catch((g) => {
            s(g);
          });
        })
      )
    ).then(
      (n) => n.sort((r, A) => r[0].priority < A[0].priority ? 1 : -1).reduce(
        (r, A, s, g) => {
          const o = A[0], a = A[1], I = A[2];
          if (!I) return r;
          for (let C = 0; C < s; C++) {
            const c = g[C][0];
            if (g[C][1] === 0 || or(I, c.xyBounds))
              if (r.length) {
                const u = !r[0], f = u ? r[1][2] : r[0][2];
                return !u || o.importance < f.importance ? r : [void 0, [a, I, o]];
              } else
                return [void 0, [a, I, o]];
          }
          return !r.length || !r[0] ? [[a, I, o]] : (r.push([a, I, o]), r.sort((C, c) => C[2].importance < c[2].importance ? 1 : -1).filter((C, c) => c < 2));
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
      const A = r[0], s = r[1], g = [
        [n[0] - 150, n[1]],
        [n[0] + 150, n[1]],
        [n[0], n[1] - 150],
        [n[0], n[1] + 150]
      ], o = [
        [0, 0],
        [this.width, 0],
        [this.width, this.height],
        [0, this.height]
      ], a = [];
      for (let I = 0; I < 9; I++) {
        const C = I < 4 ? this.xy2MercAsync_specifyLayer(g[I], A) : I == 4 ? Promise.resolve(s) : this.xy2MercAsync_specifyLayer(o[I - 5], 0);
        a.push(C);
      }
      Promise.all(a).then((I) => {
        const C = Math.sqrt(
          Math.pow(I[0][0] - I[1][0], 2) + Math.pow(I[0][1] - I[1][1], 2)
        ), c = Math.sqrt(
          Math.pow(I[2][0] - I[3][0], 2) + Math.pow(I[2][1] - I[3][1], 2)
        ), l = (C + c) / 2;
        this.mercZoom || (this.mercZoom = Math.log(300 * (2 * at) / 256 / l) / Math.log(2) - 3), this.homePosition || (this.homePosition = Ci(I[4])), this.envelope = gr([
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
          r.map((s, g) => {
            if (!s) {
              A = !0;
              return;
            }
            const o = s[0], a = s[1];
            return g !== 0 && !A ? Promise.resolve([a]) : Promise.all(
              e[0].map((I, C) => C === 0 ? Promise.resolve(a) : this.merc2XyAsync_specifyLayer(I, o))
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
    return this.xy2MercAsync_returnLayer(A[0][0]).then((g) => {
      const o = g[0], a = g[1], I = A[0].map((C, c) => c === 0 ? Promise.resolve(a) : this.xy2MercAsync_specifyLayer(C, o));
      return Promise.all(I).then((C) => [C, n]);
    });
  }
  mercs2ViewpointAsync(e) {
    return this.merc2XyAsync_returnLayer(e[0][0]).then(
      (r) => {
        const A = r[0] || r[1], s = A[0], g = A[1];
        return Promise.all(
          e[0].map((o, a) => a === 0 ? g : this.merc2XyAsync_specifyLayer(o, s))
        );
      }
    ).then((r) => {
      const A = this.xys2SysCoords([r, e[1]]);
      return this.sysCoords2Viewpoint(A);
    });
  }
}
var yt = typeof globalThis < "u" && globalThis || typeof self < "u" && self || // eslint-disable-next-line no-undef
typeof globalThis < "u" && globalThis || {}, Pt = {
  searchParams: "URLSearchParams" in yt,
  iterable: "Symbol" in yt && "iterator" in Symbol,
  blob: "FileReader" in yt && "Blob" in yt && (function() {
    try {
      return new Blob(), !0;
    } catch {
      return !1;
    }
  })(),
  formData: "FormData" in yt,
  arrayBuffer: "ArrayBuffer" in yt
};
function dc(i) {
  return i && DataView.prototype.isPrototypeOf(i);
}
if (Pt.arrayBuffer)
  var pc = [
    "[object Int8Array]",
    "[object Uint8Array]",
    "[object Uint8ClampedArray]",
    "[object Int16Array]",
    "[object Uint16Array]",
    "[object Int32Array]",
    "[object Uint32Array]",
    "[object Float32Array]",
    "[object Float64Array]"
  ], mc = ArrayBuffer.isView || function(i) {
    return i && pc.indexOf(Object.prototype.toString.call(i)) > -1;
  };
function sn(i) {
  if (typeof i != "string" && (i = String(i)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(i) || i === "")
    throw new TypeError('Invalid character in header field name: "' + i + '"');
  return i.toLowerCase();
}
function Li(i) {
  return typeof i != "string" && (i = String(i)), i;
}
function ji(i) {
  var t = {
    next: function() {
      var e = i.shift();
      return { done: e === void 0, value: e };
    }
  };
  return Pt.iterable && (t[Symbol.iterator] = function() {
    return t;
  }), t;
}
function ut(i) {
  this.map = {}, i instanceof ut ? i.forEach(function(t, e) {
    this.append(e, t);
  }, this) : Array.isArray(i) ? i.forEach(function(t) {
    if (t.length != 2)
      throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + t.length);
    this.append(t[0], t[1]);
  }, this) : i && Object.getOwnPropertyNames(i).forEach(function(t) {
    this.append(t, i[t]);
  }, this);
}
ut.prototype.append = function(i, t) {
  i = sn(i), t = Li(t);
  var e = this.map[i];
  this.map[i] = e ? e + ", " + t : t;
};
ut.prototype.delete = function(i) {
  delete this.map[sn(i)];
};
ut.prototype.get = function(i) {
  return i = sn(i), this.has(i) ? this.map[i] : null;
};
ut.prototype.has = function(i) {
  return this.map.hasOwnProperty(sn(i));
};
ut.prototype.set = function(i, t) {
  this.map[sn(i)] = Li(t);
};
ut.prototype.forEach = function(i, t) {
  for (var e in this.map)
    this.map.hasOwnProperty(e) && i.call(t, this.map[e], e, this);
};
ut.prototype.keys = function() {
  var i = [];
  return this.forEach(function(t, e) {
    i.push(e);
  }), ji(i);
};
ut.prototype.values = function() {
  var i = [];
  return this.forEach(function(t) {
    i.push(t);
  }), ji(i);
};
ut.prototype.entries = function() {
  var i = [];
  return this.forEach(function(t, e) {
    i.push([e, t]);
  }), ji(i);
};
Pt.iterable && (ut.prototype[Symbol.iterator] = ut.prototype.entries);
function Wr(i) {
  if (!i._noBody) {
    if (i.bodyUsed)
      return Promise.reject(new TypeError("Already read"));
    i.bodyUsed = !0;
  }
}
function pg(i) {
  return new Promise(function(t, e) {
    i.onload = function() {
      t(i.result);
    }, i.onerror = function() {
      e(i.error);
    };
  });
}
function yc(i) {
  var t = new FileReader(), e = pg(t);
  return t.readAsArrayBuffer(i), e;
}
function vc(i) {
  var t = new FileReader(), e = pg(t), n = /charset=([A-Za-z0-9_-]+)/.exec(i.type), r = n ? n[1] : "utf-8";
  return t.readAsText(i, r), e;
}
function bc(i) {
  for (var t = new Uint8Array(i), e = new Array(t.length), n = 0; n < t.length; n++)
    e[n] = String.fromCharCode(t[n]);
  return e.join("");
}
function as(i) {
  if (i.slice)
    return i.slice(0);
  var t = new Uint8Array(i.byteLength);
  return t.set(new Uint8Array(i)), t.buffer;
}
function mg() {
  return this.bodyUsed = !1, this._initBody = function(i) {
    this.bodyUsed = this.bodyUsed, this._bodyInit = i, i ? typeof i == "string" ? this._bodyText = i : Pt.blob && Blob.prototype.isPrototypeOf(i) ? this._bodyBlob = i : Pt.formData && FormData.prototype.isPrototypeOf(i) ? this._bodyFormData = i : Pt.searchParams && URLSearchParams.prototype.isPrototypeOf(i) ? this._bodyText = i.toString() : Pt.arrayBuffer && Pt.blob && dc(i) ? (this._bodyArrayBuffer = as(i.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : Pt.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(i) || mc(i)) ? this._bodyArrayBuffer = as(i) : this._bodyText = i = Object.prototype.toString.call(i) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof i == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : Pt.searchParams && URLSearchParams.prototype.isPrototypeOf(i) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
  }, Pt.blob && (this.blob = function() {
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
      if (Pt.blob)
        return this.blob().then(yc);
      throw new Error("could not read as ArrayBuffer");
    }
  }, this.text = function() {
    var i = Wr(this);
    if (i)
      return i;
    if (this._bodyBlob)
      return vc(this._bodyBlob);
    if (this._bodyArrayBuffer)
      return Promise.resolve(bc(this._bodyArrayBuffer));
    if (this._bodyFormData)
      throw new Error("could not read FormData body as text");
    return Promise.resolve(this._bodyText);
  }, Pt.formData && (this.formData = function() {
    return this.text().then(Mc);
  }), this.json = function() {
    return this.text().then(JSON.parse);
  }, this;
}
var wc = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
function Ec(i) {
  var t = i.toUpperCase();
  return wc.indexOf(t) > -1 ? t : i;
}
function je(i, t) {
  if (!(this instanceof je))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  t = t || {};
  var e = t.body;
  if (i instanceof je) {
    if (i.bodyUsed)
      throw new TypeError("Already read");
    this.url = i.url, this.credentials = i.credentials, t.headers || (this.headers = new ut(i.headers)), this.method = i.method, this.mode = i.mode, this.signal = i.signal, !e && i._bodyInit != null && (e = i._bodyInit, i.bodyUsed = !0);
  } else
    this.url = String(i);
  if (this.credentials = t.credentials || this.credentials || "same-origin", (t.headers || !this.headers) && (this.headers = new ut(t.headers)), this.method = Ec(t.method || this.method || "GET"), this.mode = t.mode || this.mode || null, this.signal = t.signal || this.signal || (function() {
    if ("AbortController" in yt) {
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
je.prototype.clone = function() {
  return new je(this, { body: this._bodyInit });
};
function Mc(i) {
  var t = new FormData();
  return i.trim().split("&").forEach(function(e) {
    if (e) {
      var n = e.split("="), r = n.shift().replace(/\+/g, " "), A = n.join("=").replace(/\+/g, " ");
      t.append(decodeURIComponent(r), decodeURIComponent(A));
    }
  }), t;
}
function Pc(i) {
  var t = new ut(), e = i.replace(/\r?\n[\t ]+/g, " ");
  return e.split("\r").map(function(n) {
    return n.indexOf(`
`) === 0 ? n.substr(1, n.length) : n;
  }).forEach(function(n) {
    var r = n.split(":"), A = r.shift().trim();
    if (A) {
      var s = r.join(":").trim();
      try {
        t.append(A, s);
      } catch (g) {
        console.warn("Response " + g.message);
      }
    }
  }), t;
}
mg.call(je.prototype);
function ee(i, t) {
  if (!(this instanceof ee))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  if (t || (t = {}), this.type = "default", this.status = t.status === void 0 ? 200 : t.status, this.status < 200 || this.status > 599)
    throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
  this.ok = this.status >= 200 && this.status < 300, this.statusText = t.statusText === void 0 ? "" : "" + t.statusText, this.headers = new ut(t.headers), this.url = t.url || "", this._initBody(i);
}
mg.call(ee.prototype);
ee.prototype.clone = function() {
  return new ee(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new ut(this.headers),
    url: this.url
  });
};
ee.error = function() {
  var i = new ee(null, { status: 200, statusText: "" });
  return i.ok = !1, i.status = 0, i.type = "error", i;
};
var Rc = [301, 302, 303, 307, 308];
ee.redirect = function(i, t) {
  if (Rc.indexOf(t) === -1)
    throw new RangeError("Invalid status code");
  return new ee(null, { status: t, headers: { location: i } });
};
var Se = yt.DOMException;
try {
  new Se();
} catch {
  Se = function(t, e) {
    this.message = t, this.name = e;
    var n = Error(t);
    this.stack = n.stack;
  }, Se.prototype = Object.create(Error.prototype), Se.prototype.constructor = Se;
}
function yg(i, t) {
  return new Promise(function(e, n) {
    var r = new je(i, t);
    if (r.signal && r.signal.aborted)
      return n(new Se("Aborted", "AbortError"));
    var A = new XMLHttpRequest();
    function s() {
      A.abort();
    }
    A.onload = function() {
      var a = {
        statusText: A.statusText,
        headers: Pc(A.getAllResponseHeaders() || "")
      };
      r.url.indexOf("file://") === 0 && (A.status < 200 || A.status > 599) ? a.status = 200 : a.status = A.status, a.url = "responseURL" in A ? A.responseURL : a.headers.get("X-Request-URL");
      var I = "response" in A ? A.response : A.responseText;
      setTimeout(function() {
        e(new ee(I, a));
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
        n(new Se("Aborted", "AbortError"));
      }, 0);
    };
    function g(a) {
      try {
        return a === "" && yt.location.href ? yt.location.href : a;
      } catch {
        return a;
      }
    }
    if (A.open(r.method, g(r.url), !0), r.credentials === "include" ? A.withCredentials = !0 : r.credentials === "omit" && (A.withCredentials = !1), "responseType" in A && (Pt.blob ? A.responseType = "blob" : Pt.arrayBuffer && (A.responseType = "arraybuffer")), t && typeof t.headers == "object" && !(t.headers instanceof ut || yt.Headers && t.headers instanceof yt.Headers)) {
      var o = [];
      Object.getOwnPropertyNames(t.headers).forEach(function(a) {
        o.push(sn(a)), A.setRequestHeader(a, Li(t.headers[a]));
      }), r.headers.forEach(function(a, I) {
        o.indexOf(I) === -1 && A.setRequestHeader(I, a);
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
yg.polyfill = !0;
yt.fetch || (yt.fetch = yg, yt.Headers = ut, yt.Request = je, yt.Response = ee);
const vg = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAAqACAAQAAAABAAAANKADAAQAAAABAAAANAAAAAD/4QkhaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/4hskSUNDX1BST0ZJTEUAAQEAABsUYXBwbAIQAABtbnRyUkdCIFhZWiAH4AAKAB0AFAA0AAZhY3NwQVBQTAAAAABBUFBMAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFkZXNjAAABUAAAAGJkc2NtAAABtAAABBhjcHJ0AAAFzAAAACN3dHB0AAAF8AAAABRyWFlaAAAGBAAAABRnWFlaAAAGGAAAABRiWFlaAAAGLAAAABRyVFJDAAAGQAAACAxhYXJnAAAOTAAAACB2Y2d0AAAObAAABhJuZGluAAAUgAAABj5jaGFkAAAawAAAACxtbW9kAAAa7AAAAChiVFJDAAAGQAAACAxnVFJDAAAGQAAACAxhYWJnAAAOTAAAACBhYWdnAAAOTAAAACBkZXNjAAAAAAAAAAhEaXNwbGF5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbWx1YwAAAAAAAAAiAAAADGhySFIAAAAUAAABqGtvS1IAAAAMAAABvG5iTk8AAAASAAAByGlkAAAAAAASAAAB2mh1SFUAAAAUAAAB7GNzQ1oAAAAWAAACAGRhREsAAAAcAAACFnVrVUEAAAAcAAACMmFyAAAAAAAUAAACTml0SVQAAAAUAAACYnJvUk8AAAASAAACdm5sTkwAAAAWAAACiGhlSUwAAAAWAAACnmVzRVMAAAASAAACdmZpRkkAAAAQAAACtHpoVFcAAAAMAAACxHZpVk4AAAAOAAAC0HNrU0sAAAAWAAAC3npoQ04AAAAMAAACxHJ1UlUAAAAkAAAC9GZyRlIAAAAWAAADGG1zAAAAAAASAAADLmNhRVMAAAAYAAADQHRoVEgAAAAMAAADWGVzWEwAAAASAAACdmRlREUAAAAQAAADZGVuVVMAAAASAAADdHB0QlIAAAAYAAADhnBsUEwAAAASAAADnmVsR1IAAAAiAAADsHN2U0UAAAAQAAAD0nRyVFIAAAAUAAAD4mphSlAAAAAMAAAD9nB0UFQAAAAWAAAEAgBMAEMARAAgAHUAIABiAG8AagBpzuy37AAgAEwAQwBEAEYAYQByAGcAZQAtAEwAQwBEAEwAQwBEACAAVwBhAHIAbgBhAFMAegDtAG4AZQBzACAATABDAEQAQgBhAHIAZQB2AG4A/QAgAEwAQwBEAEwAQwBEAC0AZgBhAHIAdgBlAHMAawDmAHIAbQQaBD4EOwRMBD4EQAQ+BDIEOAQ5ACAATABDAEQgDwBMAEMARAAgBkUGRAZIBkYGKQBMAEMARAAgAGMAbwBsAG8AcgBpAEwAQwBEACAAYwBvAGwAbwByAEsAbABlAHUAcgBlAG4ALQBMAEMARCAPAEwAQwBEACAF5gXRBeIF1QXgBdkAVgDkAHIAaQAtAEwAQwBEX2mCcgAgAEwAQwBEAEwAQwBEACAATQDgAHUARgBhAHIAZQBiAG4A6QAgAEwAQwBEBCYEMgQ1BEIEPQQ+BDkAIAQWBBoALQQ0BDgEQQQ/BDsENQQ5AEwAQwBEACAAYwBvAHUAbABlAHUAcgBXAGEAcgBuAGEAIABMAEMARABMAEMARAAgAGUAbgAgAGMAbwBsAG8AcgBMAEMARAAgDioONQBGAGEAcgBiAC0ATABDAEQAQwBvAGwAbwByACAATABDAEQATABDAEQAIABDAG8AbABvAHIAaQBkAG8ASwBvAGwAbwByACAATABDAEQDiAOzA8cDwQPJA7wDtwAgA78DuAPMA70DtwAgAEwAQwBEAEYA5AByAGcALQBMAEMARABSAGUAbgBrAGwAaQAgAEwAQwBEMKsw6TD8AEwAQwBEAEwAQwBEACAAYQAgAEMAbwByAGUAc3RleHQAAAAAQ29weXJpZ2h0IEFwcGxlIEluYy4sIDIwMTYAAFhZWiAAAAAAAADzUgABAAAAARbPWFlaIAAAAAAAAGXoAAA8EAAACdBYWVogAAAAAAAAapMAAKrFAAAXilhZWiAAAAAAAAAmWwAAGSwAALHSY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA2ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKMAqACtALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkH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", bg = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAAqACAAQAAAABAAAANKADAAQAAAABAAAANAAAAAD/4QkhaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/4gKESUNDX1BST0ZJTEUAAQEAAAJ0YXBwbAQAAABtbnRyUkdCIFhZWiAH3AALAAwAEgA6ABdhY3NwQVBQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGxmSfnZPIV3n7QGSpkeOnQsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtkZXNjAAABCAAAAGNkc2NtAAABbAAAACxjcHJ0AAABmAAAAC13dHB0AAAByAAAABRyWFlaAAAB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", wg = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCARXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAKgAgAEAAAAAQAAADSgAwAEAAAAAQAAADQAAAAA/+EJIWh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/PgD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/+IbJElDQ19QUk9GSUxFAAEBAAAbFGFwcGwCEAAAbW50clJHQiBYWVogB+EABAAEABcABgAzYWNzcEFQUEwAAAAAQVBQTAAAAAAAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1hcHBsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARZGVzYwAAAVAAAABiZHNjbQAAAbQAAAQYY3BydAAABcwAAAAjd3RwdAAABfAAAAAUclhZWgAABgQAAAAUZ1hZWgAABhgAAAAUYlhZWgAABiwAAAAUclRSQwAABkAAAAgMYWFyZwAADkwAAAAgdmNndAAADmwAAAYSbmRpbgAAFIAAAAY+Y2hhZAAAGsAAAAAsbW1vZAAAGuwAAAAoYlRSQwAABkAAAAgMZ1RSQwAABkAAAAgMYWFiZwAADkwAAAAgYWFnZwAADkwAAAAgZGVzYwAAAAAAAAAIRGlzcGxheQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG1sdWMAAAAAAAAAIgAAAAxockhSAAAAFAAAAahrb0tSAAAADAAAAbxuYk5PAAAAEgAAAchpZAAAAAAAEgAAAdpodUhVAAAAFAAAAexjc0NaAAAAFgAAAgBkYURLAAAAHAAAAhZ1a1VBAAAAHAAAAjJhcgAAAAAAFAAAAk5pdElUAAAAFAAAAmJyb1JPAAAAEgAAAnZubE5MAAAAFgAAAohoZUlMAAAAFgAAAp5lc0VTAAAAEgAAAnZmaUZJAAAAEAAAArR6aFRXAAAADAAAAsR2aVZOAAAADgAAAtBza1NLAAAAFgAAAt56aENOAAAADAAAAsRydVJVAAAAJAAAAvRmckZSAAAAFgAAAxhtcwAAAAAAEgAAAy5jYUVTAAAAGAAAA0B0aFRIAAAADAAAA1hlc1hMAAAAEgAAAnZkZURFAAAAEAAAA2RlblVTAAAAEgAAA3RwdEJSAAAAGAAAA4ZwbFBMAAAAEgAAA55lbEdSAAAAIgAAA7BzdlNFAAAAEAAAA9J0clRSAAAAFAAAA+JqYUpQAAAADAAAA/ZwdFBUAAAAFgAABAIATABDAEQAIAB1ACAAYgBvAGoAac7st+wAIABMAEMARABGAGEAcgBnAGUALQBMAEMARABMAEMARAAgAFcAYQByAG4AYQBTAHoA7QBuAGUAcwAgAEwAQwBEAEIAYQByAGUAdgBuAP0AIABMAEMARABMAEMARAAtAGYAYQByAHYAZQBzAGsA5gByAG0EGgQ+BDsETAQ+BEAEPgQyBDgEOQAgAEwAQwBEIA8ATABDAEQAIAZFBkQGSAZGBikATABDAEQAIABjAG8AbABvAHIAaQBMAEMARAAgAGMAbwBsAG8AcgBLAGwAZQB1AHIAZQBuAC0ATABDAEQgDwBMAEMARAAgBeYF0QXiBdUF4AXZAFYA5AByAGkALQBMAEMARF9pgnIAIABMAEMARABMAEMARAAgAE0A4AB1AEYAYQByAGUAYgBuAP0AIABMAEMARAQmBDIENQRCBD0EPgQ5ACAEFgQaAC0ENAQ4BEEEPwQ7BDUEOQBMAEMARAAgAGMAbwB1AGwAZQB1AHIAVwBhAHIAbgBhACAATABDAEQATABDAEQAIABlAG4AIABjAG8AbABvAHIATABDAEQAIA4qDjUARgBhAHIAYgAtAEwAQwBEAEMAbwBsAG8AcgAgAEwAQwBEAEwAQwBEACAAQwBvAGwAbwByAGkAZABvAEsAbwBsAG8AcgAgAEwAQwBEA4gDswPHA8EDyQO8A7cAIAO/A7gDzAO9A7cAIABMAEMARABGAOQAcgBnAC0ATABDAEQAUgBlAG4AawBsAGkAIABMAEMARDCrMOkw/ABMAEMARABMAEMARAAgAGEAIABDAG8AcgBlAHN0ZXh0AAAAAENvcHlyaWdodCBBcHBsZSBJbmMuLCAyMDE3AABYWVogAAAAAAAA81IAAQAAAAEWz1hZWiAAAAAAAABl6AAAPBAAAAnQWFlaIAAAAAAAAGqTAACqxQAAF4pYWVogAAAAAAAAJlsAABksAACx0mN1cnYAAAAAAAAEAAAAAAUACgAPABQAGQAeACMAKAAtADIANgA7AEAARQBKAE8AVABZAF4AYwBoAG0AcgB3AHwAgQCGAIsAkACVAJoAnwCjAKgArQCyALcAvADBAMYAywDQANUA2wDgAOUA6wDwAPYA+wEBAQcBDQETARkBHwElASsBMgE4AT4BRQFMAVIBWQFgAWcBbgF1AXwBgwGLAZIBmgGhAakBsQG5AcEByQHRAdkB4QHpAfIB+gIDAgwCFAIdAiYCLwI4AkECSwJUAl0CZwJxAnoChAKOApgCogKsArYCwQLLAtUC4ALrAvUDAAMLAxYDIQMtAzgDQwNPA1oDZgNyA34DigOWA6IDrgO6A8cD0wPgA+wD+QQGBBMEIAQtBDsESARVBGMEcQR+BIwEmgSoBLYExATTBOEE8AT+BQ0FHAUrBToFSQVYBWcF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", xc = {
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
    thumbnail: vg,
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
    thumbnail: bg
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
    thumbnail: wg
  }
}, Is = (i) => (i || "").match(/^(?:base|overlay|google(?:_(?:roadmap|satellite|hybrid|terrain))?|mapbox|maplibre|osm)$/);
async function Sc(i, t) {
  if (typeof i == "string" && (i = xc[i]), i = $t(Object.assign(i, t)), i.label = i.label || i.year, Is(i.maptype)) {
    const e = i.maptype === "base" ? nn : i.maptype === "overlay" ? Dn : i.maptype === "mapbox" ? xn : i.maptype === "maplibre" ? Sn : oi;
    e.isBasemap() ? (i.homePosition = i.homePos, i.mercZoom = i.defZoom) : (i.homePosition || (i.homePosition = i.homePos), i.mercZoom || (i.mercZoom = i.defZoom)), delete i.homePos, delete i.defZoom, i.zoomRestriction && (i.maxZoom = i.maxZoom || i.mercMaxZoom, i.minZoom = i.minZoom || i.mercMinZoom), i.zoomRestriction = i.mercMaxZoom = i.mercMinZoom = void 0, i.translator && (i.url = i.translator(i.url)), i.imageExtension || (i.imageExtension = "jpg"), i.mapID && !i.url && !i.urls && (i.url = i.tms ? `tiles/${i.mapID}/{z}/{x}/{-y}.${i.imageExtension}` : `tiles/${i.mapID}/{z}/{x}/{y}.${i.imageExtension}`), i.weiwudi = await Hr(i), i.weiwudi && (i.url = i.weiwudi.url, delete i.urls);
    const n = await e.createAsync(i);
    return await n.initialWait, n;
  } else if (i.noload)
    return i.mercMaxZoom = i.mercMinZoom = void 0, new pr(i);
  return new Promise((e, n) => {
    const r = i.settingFile || `maps/${i.mapID}.json`, A = new XMLHttpRequest();
    A.open("GET", r, !0), A.responseType = "json", A.onload = async function(s) {
      if (this.status === 200 || this.status === 0)
        try {
          let g = this.response;
          if (typeof g != "object" && (g = JSON.parse(g)), i = $t(Object.assign(g, i)), i.label = i.label || g.year, i.translator && (i.url = i.translator(i.url)), i.maptype || (i.maptype = "maplat"), Is(i.maptype)) {
            const o = i.maptype === "base" ? nn : i.maptype === "overlay" ? Dn : i.maptype === "mapbox" ? xn : i.maptype === "maplibre" ? Sn : oi;
            o.isBasemap() ? (i.homePosition = i.homePos, i.mercZoom = i.defZoom) : (i.homePosition || (i.homePosition = i.homePos), i.mercZoom || (i.mercZoom = i.defZoom)), delete i.homePos, delete i.defZoom, i.zoomRestriction && (i.maxZoom = i.maxZoom || i.mercMaxZoom, i.minZoom = i.minZoom || i.mercMinZoom), i.zoomRestriction = i.mercMaxZoom = i.mercMinZoom = void 0;
            try {
              i.imageExtension || (i.imageExtension = "jpg"), i.mapID && !i.url && !i.urls && (i.url = i.tms ? `tiles/${i.mapID}/{z}/{x}/{-y}.${i.imageExtension}` : `tiles/${i.mapID}/{z}/{x}/{y}.${i.imageExtension}`), i.weiwudi = await Hr(i), i.weiwudi && (i.url = i.weiwudi.url, delete i.urls);
              const a = await o.createAsync(i);
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
            i.width = i.width || i.compiled.wh[0], i.height = i.height || i.compiled.wh[1], i.weiwudi = await Hr(i), i.weiwudi && (i.url = i.weiwudi.url, delete i.urls);
            const o = await pr.createAsync(i);
            try {
              await o.initialWait, o.setupMapParameter(e);
            } catch {
              o.setupMapParameter(e);
            }
          } catch (o) {
            n(o);
          }
        } catch (g) {
          n(g);
        }
      else
        n("Fail to load map json");
    }, A.send();
  });
}
async function Hr(i) {
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
    n = await oe.registerMap(i.mapID, t);
  } catch {
  }
  return n;
}
function Vr(i, t) {
  return i + (Math.random() - 0.5) * t;
}
function Ii(i, t) {
  if (i instanceof Array)
    return i.map((n) => Ii(n, t));
  const e = Math.pow(10, t);
  return Math.round(i * e) / e;
}
const Cs = {};
var hn = { exports: {} }, Yr, cs;
function Eg() {
  if (cs) return Yr;
  cs = 1;
  var i = /<%=([\s\S]+?)%>/g;
  return Yr = i, Yr;
}
var Kr, ls;
function Oc() {
  if (ls) return Kr;
  ls = 1;
  var i = Eg(), t = "[object Null]", e = "[object Symbol]", n = "[object Undefined]", r = /[&<>"']/g, A = RegExp(r.source), s = /<%-([\s\S]+?)%>/g, g = /<%([\s\S]+?)%>/g, o = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }, a = typeof globalThis == "object" && globalThis && globalThis.Object === Object && globalThis, I = typeof self == "object" && self && self.Object === Object && self, C = a || I || Function("return this")();
  function c(F, ot) {
    for (var Rt = -1, kt = F == null ? 0 : F.length, Zt = Array(kt); ++Rt < kt; )
      Zt[Rt] = ot(F[Rt], Rt, F);
    return Zt;
  }
  function l(F) {
    return function(ot) {
      return F == null ? void 0 : F[ot];
    };
  }
  var u = l(o), f = Object.prototype, m = f.hasOwnProperty, p = f.toString, v = C.Symbol, O = v ? v.toStringTag : void 0, D = v ? v.prototype : void 0, z = D ? D.toString : void 0, W = {
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
    evaluate: g,
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
      _: { escape: jt }
    }
  };
  function K(F) {
    return F == null ? F === void 0 ? n : t : O && O in Object(F) ? At(F) : rt(F);
  }
  function _(F) {
    if (typeof F == "string")
      return F;
    if (V(F))
      return c(F, _) + "";
    if (dt(F))
      return z ? z.call(F) : "";
    var ot = F + "";
    return ot == "0" && 1 / F == -1 / 0 ? "-0" : ot;
  }
  function At(F) {
    var ot = m.call(F, O), Rt = F[O];
    try {
      F[O] = void 0;
      var kt = !0;
    } catch {
    }
    var Zt = p.call(F);
    return kt && (ot ? F[O] = Rt : delete F[O]), Zt;
  }
  function rt(F) {
    return p.call(F);
  }
  var V = Array.isArray;
  function gt(F) {
    return F != null && typeof F == "object";
  }
  function dt(F) {
    return typeof F == "symbol" || gt(F) && K(F) == e;
  }
  function ht(F) {
    return F == null ? "" : _(F);
  }
  function jt(F) {
    return F = ht(F), F && A.test(F) ? F.replace(r, u) : F;
  }
  return Kr = W, Kr;
}
hn.exports;
var us;
function Dc() {
  return us || (us = 1, (function(i, t) {
    var e = Eg(), n = Oc(), r = 800, A = 16, s = 9007199254740991, g = "[object Arguments]", o = "[object Array]", a = "[object AsyncFunction]", I = "[object Boolean]", C = "[object Date]", c = "[object DOMException]", l = "[object Error]", u = "[object Function]", f = "[object GeneratorFunction]", m = "[object Map]", p = "[object Number]", v = "[object Null]", O = "[object Object]", D = "[object Proxy]", z = "[object RegExp]", W = "[object Set]", K = "[object String]", _ = "[object Symbol]", At = "[object Undefined]", rt = "[object WeakMap]", V = "[object ArrayBuffer]", gt = "[object DataView]", dt = "[object Float32Array]", ht = "[object Float64Array]", jt = "[object Int8Array]", F = "[object Int16Array]", ot = "[object Int32Array]", Rt = "[object Uint8Array]", kt = "[object Uint8ClampedArray]", Zt = "[object Uint16Array]", Ct = "[object Uint32Array]", gn = /\b__p \+= '';/g, ke = /\b(__p \+=) '' \+/g, Wt = /(__e\(.*?\)|\b__t\)) \+\n'';/g, Ne = /[\\^$.*+?()[\]{}|]/g, ie = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, Ce = /^\[object .+?Constructor\]$/, Ae = /^(?:0|[1-9]\d*)$/, Ht = /($^)/, se = /['\n\r\u2028\u2029\\]/g, q = {};
    q[dt] = q[ht] = q[jt] = q[F] = q[ot] = q[Rt] = q[kt] = q[Zt] = q[Ct] = !0, q[g] = q[o] = q[V] = q[I] = q[gt] = q[C] = q[l] = q[u] = q[m] = q[p] = q[O] = q[z] = q[W] = q[K] = q[rt] = !1;
    var be = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    }, we = typeof globalThis == "object" && globalThis && globalThis.Object === Object && globalThis, Ge = typeof self == "object" && self && self.Object === Object && self, on = we || Ge || Function("return this")(), Gn = t && !t.nodeType && t, ce = Gn && !0 && i && !i.nodeType && i, Xn = ce && ce.exports === Gn, an = Xn && we.process, Zn = (function() {
      try {
        var h = ce && ce.require && ce.require("util").types;
        return h || an && an.binding && an.binding("util");
      } catch {
      }
    })(), Fn = Zn && Zn.isTypedArray;
    function Un(h, b, R) {
      switch (R.length) {
        case 0:
          return h.call(b);
        case 1:
          return h.call(b, R[0]);
        case 2:
          return h.call(b, R[0], R[1]);
        case 3:
          return h.call(b, R[0], R[1], R[2]);
      }
      return h.apply(b, R);
    }
    function zn(h, b) {
      for (var R = -1, H = h == null ? 0 : h.length, tt = Array(H); ++R < H; )
        tt[R] = b(h[R], R, h);
      return tt;
    }
    function Bt(h, b) {
      for (var R = -1, H = Array(h); ++R < h; )
        H[R] = b(R);
      return H;
    }
    function Rr(h) {
      return function(b) {
        return h(b);
      };
    }
    function d(h, b) {
      return zn(b, function(R) {
        return h[R];
      });
    }
    function y(h) {
      return "\\" + be[h];
    }
    function E(h, b) {
      return h == null ? void 0 : h[b];
    }
    function M(h, b) {
      return function(R) {
        return h(b(R));
      };
    }
    var k = Function.prototype, x = Object.prototype, L = on["__core-js_shared__"], G = k.toString, B = x.hasOwnProperty, X = (function() {
      var h = /[^.]+$/.exec(L && L.keys && L.keys.IE_PROTO || "");
      return h ? "Symbol(src)_1." + h : "";
    })(), Z = x.toString, S = G.call(Object), j = RegExp(
      "^" + G.call(B).replace(Ne, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ), U = Xn ? on.Buffer : void 0, Y = on.Symbol, N = M(Object.getPrototypeOf, Object), T = x.propertyIsEnumerable, P = Y ? Y.toStringTag : void 0, Q = (function() {
      try {
        var h = Dg(Object, "defineProperty");
        return h({}, "", {}), h;
      } catch {
      }
    })(), $ = U ? U.isBuffer : void 0, et = M(Object.keys, Object), st = Math.max, J = Date.now, it = Y ? Y.prototype : void 0, ct = it ? it.toString : void 0;
    function xt(h, b) {
      var R = Ui(h), H = !R && Zg(h), tt = !R && !H && Fg(h), lt = !R && !H && !tt && Qg(h), Nt = R || H || tt || lt, It = Nt ? Bt(h.length, String) : [], Yt = It.length;
      for (var Gt in h)
        (b || B.call(h, Gt)) && !(Nt && // Safari 9 has enumerable `arguments.length` in strict mode.
        (Gt == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        tt && (Gt == "offset" || Gt == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        lt && (Gt == "buffer" || Gt == "byteLength" || Gt == "byteOffset") || // Skip index properties.
        Xi(Gt, Yt))) && It.push(Gt);
      return It;
    }
    function Tt(h, b, R) {
      var H = h[b];
      (!(B.call(h, b) && Dr(H, R)) || R === void 0 && !(b in h)) && St(h, b, R);
    }
    function St(h, b, R) {
      b == "__proto__" && Q ? Q(h, b, {
        configurable: !0,
        enumerable: !0,
        value: R,
        writable: !0
      }) : h[b] = R;
    }
    function ft(h) {
      return h == null ? h === void 0 ? At : v : P && P in Object(h) ? Bg(h) : jg(h);
    }
    function Vt(h) {
      return Xe(h) && ft(h) == g;
    }
    function Ee(h) {
      if (!Qn(h) || Tg(h))
        return !1;
      var b = Qi(h) ? j : Ce;
      return b.test(Xg(h));
    }
    function xr(h) {
      return Xe(h) && Wi(h.length) && !!q[ft(h)];
    }
    function Sr(h) {
      if (!Fi(h))
        return et(h);
      var b = [];
      for (var R in Object(h))
        B.call(h, R) && R != "constructor" && b.push(R);
      return b;
    }
    function Or(h) {
      if (!Qn(h))
        return Lg(h);
      var b = Fi(h), R = [];
      for (var H in h)
        H == "constructor" && (b || !B.call(h, H)) || R.push(H);
      return R;
    }
    function ki(h, b) {
      return Ng(kg(h, b, Vi), h + "");
    }
    var xg = Q ? function(h, b) {
      return Q(h, "toString", {
        configurable: !0,
        enumerable: !1,
        value: Jg(b),
        writable: !0
      });
    } : Vi;
    function Ni(h) {
      if (typeof h == "string")
        return h;
      if (Ui(h))
        return zn(h, Ni) + "";
      if (zg(h))
        return ct ? ct.call(h) : "";
      var b = h + "";
      return b == "0" && 1 / h == -1 / 0 ? "-0" : b;
    }
    function Sg(h, b, R, H) {
      var tt = !R;
      R || (R = {});
      for (var lt = -1, Nt = b.length; ++lt < Nt; ) {
        var It = b[lt], Yt = H ? H(R[It], h[It], It, R, h) : void 0;
        Yt === void 0 && (Yt = h[It]), tt ? St(R, It, Yt) : Tt(R, It, Yt);
      }
      return R;
    }
    function Og(h) {
      return ki(function(b, R) {
        var H = -1, tt = R.length, lt = tt > 1 ? R[tt - 1] : void 0, Nt = tt > 2 ? R[2] : void 0;
        for (lt = h.length > 3 && typeof lt == "function" ? (tt--, lt) : void 0, Nt && Zi(R[0], R[1], Nt) && (lt = tt < 3 ? void 0 : lt, tt = 1), b = Object(b); ++H < tt; ) {
          var It = R[H];
          It && h(b, It, H, lt);
        }
        return b;
      });
    }
    function Gi(h, b, R, H) {
      return h === void 0 || Dr(h, x[R]) && !B.call(H, R) ? b : h;
    }
    function Dg(h, b) {
      var R = E(h, b);
      return Ee(R) ? R : void 0;
    }
    function Bg(h) {
      var b = B.call(h, P), R = h[P];
      try {
        h[P] = void 0;
        var H = !0;
      } catch {
      }
      var tt = Z.call(h);
      return H && (b ? h[P] = R : delete h[P]), tt;
    }
    function Xi(h, b) {
      var R = typeof h;
      return b = b ?? s, !!b && (R == "number" || R != "symbol" && Ae.test(h)) && h > -1 && h % 1 == 0 && h < b;
    }
    function Zi(h, b, R) {
      if (!Qn(R))
        return !1;
      var H = typeof b;
      return (H == "number" ? Br(R) && Xi(b, R.length) : H == "string" && b in R) ? Dr(R[b], h) : !1;
    }
    function Tg(h) {
      return !!X && X in h;
    }
    function Fi(h) {
      var b = h && h.constructor, R = typeof b == "function" && b.prototype || x;
      return h === R;
    }
    function Lg(h) {
      var b = [];
      if (h != null)
        for (var R in Object(h))
          b.push(R);
      return b;
    }
    function jg(h) {
      return Z.call(h);
    }
    function kg(h, b, R) {
      return b = st(b === void 0 ? h.length - 1 : b, 0), function() {
        for (var H = arguments, tt = -1, lt = st(H.length - b, 0), Nt = Array(lt); ++tt < lt; )
          Nt[tt] = H[b + tt];
        tt = -1;
        for (var It = Array(b + 1); ++tt < b; )
          It[tt] = H[tt];
        return It[b] = R(Nt), Un(h, this, It);
      };
    }
    var Ng = Gg(xg);
    function Gg(h) {
      var b = 0, R = 0;
      return function() {
        var H = J(), tt = A - (H - R);
        if (R = H, tt > 0) {
          if (++b >= r)
            return arguments[0];
        } else
          b = 0;
        return h.apply(void 0, arguments);
      };
    }
    function Xg(h) {
      if (h != null) {
        try {
          return G.call(h);
        } catch {
        }
        try {
          return h + "";
        } catch {
        }
      }
      return "";
    }
    function Dr(h, b) {
      return h === b || h !== h && b !== b;
    }
    var Zg = Vt(/* @__PURE__ */ (function() {
      return arguments;
    })()) ? Vt : function(h) {
      return Xe(h) && B.call(h, "callee") && !T.call(h, "callee");
    }, Ui = Array.isArray;
    function Br(h) {
      return h != null && Wi(h.length) && !Qi(h);
    }
    var Fg = $ || qg;
    function zi(h) {
      if (!Xe(h))
        return !1;
      var b = ft(h);
      return b == l || b == c || typeof h.message == "string" && typeof h.name == "string" && !Ug(h);
    }
    function Qi(h) {
      if (!Qn(h))
        return !1;
      var b = ft(h);
      return b == u || b == f || b == a || b == D;
    }
    function Wi(h) {
      return typeof h == "number" && h > -1 && h % 1 == 0 && h <= s;
    }
    function Qn(h) {
      var b = typeof h;
      return h != null && (b == "object" || b == "function");
    }
    function Xe(h) {
      return h != null && typeof h == "object";
    }
    function Ug(h) {
      if (!Xe(h) || ft(h) != O)
        return !1;
      var b = N(h);
      if (b === null)
        return !0;
      var R = B.call(b, "constructor") && b.constructor;
      return typeof R == "function" && R instanceof R && G.call(R) == S;
    }
    function zg(h) {
      return typeof h == "symbol" || Xe(h) && ft(h) == _;
    }
    var Qg = Fn ? Rr(Fn) : xr;
    function Wg(h) {
      return h == null ? "" : Ni(h);
    }
    var Hi = Og(function(h, b, R, H) {
      Sg(b, Vg(b), h, H);
    });
    function Hg(h) {
      return Br(h) ? xt(h) : Sr(h);
    }
    function Vg(h) {
      return Br(h) ? xt(h, !0) : Or(h);
    }
    function Yg(h, b, R) {
      var H = n.imports._.templateSettings || n;
      R && Zi(h, b, R) && (b = void 0), h = Wg(h), b = Hi({}, b, H, Gi);
      var tt = Hi({}, b.imports, H.imports, Gi), lt = Hg(tt), Nt = d(tt, lt), It, Yt, Gt = 0, Yi = b.interpolate || Ht, Ot = "__p += '", _g = RegExp(
        (b.escape || Ht).source + "|" + Yi.source + "|" + (Yi === e ? ie : Ht).source + "|" + (b.evaluate || Ht).source + "|$",
        "g"
      ), $g = B.call(b, "sourceURL") ? "//# sourceURL=" + (b.sourceURL + "").replace(/[\r\n]/g, " ") + `
` : "";
      h.replace(_g, function(Ki, Ji, Hn, to, qi, _i) {
        return Hn || (Hn = to), Ot += h.slice(Gt, _i).replace(se, y), Ji && (It = !0, Ot += `' +
__e(` + Ji + `) +
'`), qi && (Yt = !0, Ot += `';
` + qi + `;
__p += '`), Hn && (Ot += `' +
((__t = (` + Hn + `)) == null ? '' : __t) +
'`), Gt = _i + Ki.length, Ki;
      }), Ot += `';
`;
      var Tr = B.call(b, "variable") && b.variable;
      Tr || (Ot = `with (obj) {
` + Ot + `
}
`), Ot = (Yt ? Ot.replace(gn, "") : Ot).replace(ke, "$1").replace(Wt, "$1;"), Ot = "function(" + (Tr || "obj") + `) {
` + (Tr ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (It ? ", __e = _.escape" : "") + (Yt ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + Ot + `return __p
}`;
      var Wn = Kg(function() {
        return Function(lt, $g + "return " + Ot).apply(void 0, Nt);
      });
      if (Wn.source = Ot, zi(Wn))
        throw Wn;
      return Wn;
    }
    var Kg = ki(function(h, b) {
      try {
        return Un(h, void 0, b);
      } catch (R) {
        return zi(R) ? R : new Error(R);
      }
    });
    function Jg(h) {
      return function() {
        return h;
      };
    }
    function Vi(h) {
      return h;
    }
    function qg() {
      return !1;
    }
    i.exports = Yg;
  })(hn, hn.exports)), hn.exports;
}
var Bc = Dc();
const Mg = /* @__PURE__ */ Cc(Bc);
function hs(i, ...t) {
  const e = $t(Object.assign({}, i));
  if (e.icon) return e;
  const n = t.reduce((r, A) => {
    if (r) return r;
    const s = A.iconTemplate;
    if (s)
      return JSON.parse(Mg(s)(e));
    if (A.icon)
      return {
        icon: A.icon,
        selectedIcon: A.selectedIcon
      };
  }, void 0);
  return n && (e.icon = n.icon, e.selectedIcon = n.selectedIcon), e;
}
function fs(i, ...t) {
  return i = $t(i), i.html ? i : t.reduce((e, n) => {
    if (e) return e;
    const r = n.poiTemplate;
    if (r)
      return i.html = Mg(r)(i), i.poiStyle = i.poiStyle || n.poiStyle, i;
  }, void 0) || i;
}
const pt = {
  ACCURACY: "accuracy",
  ALTITUDE: "altitude",
  ALTITUDE_ACCURACY: "altitudeAccuracy",
  HEADING: "heading",
  POSITION: "position",
  SPEED: "speed",
  TRACKING: "tracking",
  TRACKING_OPTIONS: "trackingOptions"
}, Tc = {
  ERROR: "error"
};
class Lc extends Ie {
  constructor(e) {
    super(Tc.ERROR);
    w(this, "code");
    w(this, "message");
    this.code = e.code, this.message = e.message;
  }
}
class jc extends rn {
  constructor(e) {
    super();
    w(this, "task_id_");
    w(this, "timer_base_", !1);
    w(this, "home_position_", !1);
    e = e || {}, this.timer_base_ = e.timerBase !== void 0 ? e.timerBase : !1, this.task_id_ = void 0, this.home_position_ = e.homePosition !== void 0 ? e.homePosition : !1, this.addChangeListener(pt.TRACKING, this.handleTrackingChanged_), e.trackingOptions !== void 0 ? this.setTrackingOptions(e.trackingOptions) : this.setTrackingOptions({
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
      longitude: Vr(this.home_position_[0], 0.05),
      latitude: Vr(this.home_position_[1], 0.05),
      accuracy: Vr(15, 10)
    };
    this.positionChange_({ coords: e });
  }
  positionChange_(e) {
    const n = e.coords;
    this.set(pt.ACCURACY, n.accuracy), this.set(
      pt.ALTITUDE,
      n.altitude === null ? void 0 : n.altitude
    ), this.set(
      pt.ALTITUDE_ACCURACY,
      n.altitudeAccuracy === null ? void 0 : n.altitudeAccuracy
    ), this.set(
      pt.HEADING,
      n.heading === null ? void 0 : Je(n.heading)
    ), this.set(pt.POSITION, [n.longitude, n.latitude]), this.set(pt.SPEED, n.speed === null ? void 0 : n.speed), this.changed();
  }
  timerPositionError_() {
    const e = Math.floor(Math.random() * 3) + 1, n = {
      code: e,
      message: e === 1 ? "User denied Geolocation" : e === 2 ? "Position unavailable" : "Timeout expired"
    };
    this.positionError_(n);
  }
  positionError_(e) {
    const n = new Lc(e);
    this.dispatchEvent(n);
  }
  getAccuracy() {
    return this.get(pt.ACCURACY);
  }
  getAltitude() {
    return this.get(pt.ALTITUDE);
  }
  getAltitudeAccuracy() {
    return this.get(pt.ALTITUDE_ACCURACY);
  }
  getHeading() {
    return this.get(pt.HEADING);
  }
  getPosition() {
    return this.get(pt.POSITION);
  }
  getSpeed() {
    return this.get(pt.SPEED);
  }
  getTracking() {
    return this.get(pt.TRACKING);
  }
  getTrackingOptions() {
    return this.get(pt.TRACKING_OPTIONS);
  }
  setTracking(e) {
    this.set(pt.TRACKING, e);
  }
  setTrackingOptions(e) {
    this.set(pt.TRACKING_OPTIONS, e);
  }
}
const Pg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjcyNTIxMjZFMDJBMTExRTBCOTNGRTVBRkM1QzM1Qjc5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjcyNTIxMjZGMDJBMTExRTBCOTNGRTVBRkM1QzM1Qjc5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzI1MjEyNkMwMkExMTFFMEI5M0ZFNUFGQzVDMzVCNzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzI1MjEyNkQwMkExMTFFMEI5M0ZFNUFGQzVDMzVCNzkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4RaveOAAAB1UlEQVR42qzUTyikcRzH8d+OsUNbSOTvgW2LREqjHKSk9FjZxAGXlXJQDsqNokRzcebiRC5mT8tllBE7LlzYKBHFJpKMkD+7hvH+6ftMT4M0Y3/1uswzz+d5nu/3+/t9CAaD6n8uu/L5lHK5XroWjwI4kYWP8GMdv3H47A6nk8CDA6U8nvBLX/Ed+TjDEe7lAS24wE+M4zR0180NgXa7NSgOvajHKvqwZglMxBfUoBmVlv/wTXxU0O1WuoqIgQvLaIJDfn9NISbhRd7Tb4ahbJa3a0QthjCFv2/UfwNduJKv0jUOBSajDb8wE0FTdf1GUAzDGliOdExEMSleedsGxJiBZdiVC5GuABbxGZm2p1lUKg1/dOOjnGf9IglIsUkxY3H+jg1yIc136MBb6WjqOwLNe6904AP2kSuDG80qkW15YjZlCdkojSLsEyqwiWMzcAVbaJV6RrK+IQc/dB3NwGuMohAdEYQVoROz8FkHW68FCW1Hv4zS68eeUnWyS/YwLL1Q9rA/jsn4dEtd5mRo9WlzJ03Tda6S7TaPQWmIPCkQCH+6Ww5RfR5WowmX+IckOca2MYBp2SmW8zCb5hpGeKjuWA8yZEulSbP8sqN2JPjZif0owACin4C7wCjG6AAAAABJRU5ErkJggg==", Rg = "data:image/png;base64,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", kc = {
  osm: vg,
  gsi: bg,
  gsi_ortho: wg,
  redcircle: Pg,
  defaultpin_selected: Rg,
  defaultpin: Di,
  bluedot: og,
  bluedot_transparent: ag,
  bluedot_small: Ig
};
class Nc extends Ie {
  constructor(e) {
    super("gps_error");
    w(this, "detail");
    this.detail = e;
  }
}
class sr extends Ie {
  constructor(e) {
    super("gps_result");
    w(this, "detail");
    this.detail = e;
  }
}
class Gc extends Ie {
  constructor() {
    super("gps_request");
  }
}
class Bn extends Fs {
  // Maplat App Class
  constructor(e) {
    super();
    w(this, "appid");
    w(this, "translateUI", !1);
    w(this, "noRotate", !1);
    w(this, "initialRestore", {});
    w(this, "mapDiv", "map_div");
    w(this, "restoreSession", !1);
    w(this, "enableCache");
    w(this, "stateBuffer", {});
    w(this, "mobileMapMoveBuffer");
    w(this, "overlay", !0);
    w(this, "waitReady");
    w(this, "changeMapSeq");
    w(this, "i18n");
    w(this, "t");
    w(this, "lang");
    w(this, "appData");
    w(this, "appLang", "ja");
    w(this, "backMap");
    w(this, "mercSrc");
    w(this, "mercBuffer");
    w(this, "timer");
    w(this, "appName");
    w(this, "cacheHash");
    w(this, "currentPosition");
    w(this, "startFrom", "");
    w(this, "from");
    w(this, "vectors", []);
    w(this, "mapDivDocument");
    w(this, "mapObject");
    w(this, "mapboxMap");
    w(this, "maplibreMap");
    w(this, "googleApiKey");
    w(this, "pois");
    w(this, "poiTemplate");
    w(this, "poiStyle");
    w(this, "iconTemplate");
    w(this, "logger");
    w(this, "icon");
    w(this, "selectedIcon");
    w(this, "fakeGps", !1);
    w(this, "fakeRadius");
    w(this, "homePosition");
    w(this, "geolocation");
    w(this, "moveTo_", !1);
    w(this, "gpsEnabled_", !1);
    w(this, "alwaysGpsOn", !1);
    w(this, "firstGpsRequest_", !1);
    w(this, "__backMapMoving", !1);
    w(this, "__selectedMarker");
    w(this, "__init", !0);
    w(this, "__redrawMarkerBlock", !1);
    w(this, "__redrawMarkerThrottle", []);
    w(this, "__transparency");
    w(this, "lastClickEvent");
    e = $t(e), this.appid = e.appid || "sample";
    const n = e.mapboxgl || (typeof window < "u" ? window.mapboxgl : void 0);
    n && e.mapboxToken && (n.accessToken = e.mapboxToken), e.googleApiKey && (this.googleApiKey = e.googleApiKey), this.mapDiv = e.div || "map_div", this.mapDivDocument = document.querySelector(`#${this.mapDiv}`), this.mapDivDocument.classList.add("maplat"), this.logger = new sa(
      e.debug ? fn.ALL : fn.INFO
    ), this.enableCache = e.enableCache || !1, this.icon = e.icon, this.selectedIcon = e.selectedIcon, this.translateUI = e.translateUI;
    const r = e.setting;
    if (this.lang = e.lang, this.lang || (this.lang = ia()), (this.lang.toLowerCase() == "zh-hk" || this.lang.toLowerCase() == "zh-hant") && (this.lang = "zh-TW"), e.restore)
      e.restoreSession && (this.restoreSession = !0), this.initialRestore = e.restore;
    else if (e.restoreSession) {
      this.restoreSession = !0;
      const g = parseInt(localStorage.getItem("epoch") || "0"), o = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
      g && o - g < 3600 && (this.initialRestore.mapID = localStorage.getItem("mapID") || localStorage.getItem("sourceID") || void 0, this.initialRestore.backgroundID = localStorage.getItem("backgroundID") || localStorage.getItem("backID") || void 0, this.initialRestore.position = {
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
            margin-left:-10px;" src="${Pg}">`);
    for (let g = A.length - 1; g >= 0; g--)
      this.mapDivDocument.insertBefore(
        A[g],
        this.mapDivDocument.firstChild
      );
    const s = this.mapDivDocument.querySelectorAll(".prevent-default");
    for (let g = 0; g < s.length; g++)
      s[g].addEventListener("touchstart", (a) => {
        a.preventDefault();
      });
    this.overlay = "overlay" in e ? e.overlay : !0, this.overlay && this.mapDivDocument.classList.add("with-opacity"), this.waitReady = this.settingLoader(r).then(
      (g) => this.handleSetting(g, e)
    );
  }
  // Async initializers 1: Load application setting
  async settingLoader(e) {
    return e || new Promise((n, r) => {
      const A = new XMLHttpRequest();
      A.open("GET", `apps/${this.appid}.json`, !0), A.responseType = "json", A.onload = function(s) {
        let g = this.response;
        typeof g != "object" && (g = JSON.parse(g)), n(g);
      }, A.send();
    });
  }
  // Async initializers 3: Load i18n setting
  async i18nLoader() {
    return new Promise((e, n) => {
      const r = Object.keys(Cs).length != 0;
      (this.translateUI && !r ? vt.use(Ps) : vt).init(
        {
          lng: this.lang,
          fallbackLng: ["en"],
          backend: {
            loadPath: "assets/locales/{{lng}}/{{ns}}.json"
          },
          resources: r ? Cs : void 0
        },
        (s, g) => {
          e([g, vt]);
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
      const g = n[s];
      r.push(Sc(g, A));
    }
    return Promise.all(r);
  }
  // Async initializers 2: Handle application setting
  handleSetting(e, n) {
    return this.appData = $t(e), !this.lang && this.appData.lang && (this.lang = this.appData.lang), this.i18nLoader().then((r) => this.handleI18n(r, n)).then(() => this.initGeolocation(n));
  }
  // Async Initializers 2.5: For geolocation settings
  initGeolocation(e) {
    this.alwaysGpsOn = e.alwaysGpsOn || !1;
    const n = this.geolocation = new jc({
      timerBase: e.fake,
      homePosition: this.appData.homePosition
    });
    this.alwaysGpsOn ? (n.setTracking(!0), this.gpsEnabled_ = !0) : (n.setTracking(!1), this.gpsEnabled_ = !1), n.on("change", () => {
      const r = this.mapObject, A = r.getLayer("overlay").getLayers().item(0), s = r.getLayers().item(0), g = A ? A.getSource() : s.getSource(), o = n.getPosition(), a = n.getAccuracy();
      !o || !a || g.setGPSMarkerAsync({ lnglat: o, acc: a }, !this.moveTo_ && !this.firstGpsRequest_).then((I) => {
        if (this.moveTo_ = !1, this.firstGpsRequest_ = !1, !I) {
          if (!this.alwaysGpsOn) {
            this.handleGPS(!1, !1);
            return;
          }
          g.setGPSMarker();
        }
        this.dispatchEvent(new sr(I ? { lnglat: o, acc: a } : { error: "gps_out" }));
      });
    }), n.on("error", (r) => {
      const A = r.code;
      if (A === 3) return;
      n.setTracking(!1), this.gpsEnabled_ = !1;
      const s = this.mapObject, g = s.getLayer("overlay").getLayers().item(0), o = s.getLayers().item(0);
      (g ? g.getSource() : o.getSource()).setGPSMarker(), this.dispatchEvent(new Nc(A === 1 ? "user_gps_deny" : A === 2 ? "gps_miss" : "gps_timeout")), this.dispatchEvent(new sr({ error: "gps_off" }));
    }), this.addEventListener("mapChanged", () => {
      if (n.getTracking()) {
        const r = this.mapObject, A = r.getLayer("overlay").getLayers().item(0), s = r.getLayers().item(0), g = A ? A.getSource() : s.getSource(), o = n.getPosition(), a = n.getAccuracy();
        if (!o || !a) return;
        g.setGPSMarkerAsync({ lnglat: o, acc: a }, !0).then((I) => {
          if (!I) {
            if (!this.alwaysGpsOn) {
              this.handleGPS(!1, !1);
              return;
            }
            g.setGPSMarker();
          }
          this.dispatchEvent(new sr(I ? { lnglat: o, acc: a } : { error: "gps_out" }));
        });
      }
    });
  }
  // GPS handling methods
  handleGPS(e, n = !1) {
    if (this.geolocation) {
      if (e)
        if (!this.alwaysGpsOn)
          this.firstGpsRequest_ = !0, this.geolocation.setTracking(!0), this.gpsEnabled_ = !0, this.dispatchEvent(new Gc());
        else {
          this.moveTo_ = !0;
          const r = this.geolocation.getPosition(), A = this.geolocation.getAccuracy();
          if (r && A) {
            const s = this.mapObject, g = s.getLayer("overlay").getLayers().item(0), o = s.getLayers().item(0), a = g ? g.getSource() : o.getSource();
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
    return xs(this.appData.pois || [], this).then(
      (A) => this.handlePois(A, r)
    );
  }
  // Async initializers 5: Prepare map base elements and objects
  prepareMap(e) {
    e = $t(e), this.mercBuffer = null;
    const n = this.appData.homePosition, r = this.appData.defaultZoom, A = this.appData.zoomRestriction, s = this.appData.minZoom, g = this.appData.maxZoom;
    this.appName = this.appData.appName;
    const o = e.fake ? this.appData.fakeGps : !1, a = e.fake ? this.appData.fakeRadius : !1;
    this.appLang = this.appData.lang || "ja", this.noRotate = e.noRotate || this.appData.noRotate || !1, this.poiTemplate = e.poiTemplate || this.appData.poiTemplate || !1, this.poiStyle = e.poiStyle || this.appData.poiStyle || !1, this.iconTemplate = e.iconTemplate || this.appData.iconTemplate || !1, this.currentPosition = null, this.__init = !0, this.dispatchEvent(new Dt("uiPrepare"));
    const I = `${this.mapDiv}_front`;
    let C = Cn(
      `<div id="${I}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;"></div>`
    )[0];
    this.mapDivDocument.insertBefore(C, this.mapDivDocument.firstChild), this.fakeGps = o, this.fakeRadius = a, this.homePosition = n, this.mapObject = new On({
      div: I,
      controls: this.appData.controls || [],
      interactions: this.noRotate ? is({ altShiftDragRotate: !1, pinchRotate: !1 }) : is().extend([
        new QC({
          condition: LC
        })
      ]),
      fakeGps: o,
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
      const f = `${this.mapDiv}_mapbox`;
      C = Cn(
        `<div id="${f}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;visibility:hidden;"></div>`
      )[0], this.mapDivDocument.insertBefore(
        C,
        this.mapDivDocument.firstChild
      ), this.mapboxMap = new l.Map({
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
        touchZoomRotate: !1
      });
    }
    const u = e.maplibregl || (typeof window < "u" ? window.maplibregl : void 0);
    if (u) {
      const f = `${this.mapDiv}_maplibre`;
      C = Cn(
        `<div id="${f}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;visibility:hidden;"></div>`
      )[0], this.mapDivDocument.insertBefore(
        C,
        this.mapDivDocument.firstChild
      ), this.maplibreMap = new u.Map({
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
    return this.startFrom = this.appData.startFrom, {
      homePos: n,
      defZoom: r,
      zoomRestriction: A,
      mercMinZoom: s,
      mercMaxZoom: g
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
    this.dispatchEvent(new Dt("sourceLoaded", e)), await this.setInitialMap(n), this.setMapClick(), this.setPointerEvents(), this.setMapOnOff(), this.setMouseCursor(), this.setBackMapBehavior(), this.raiseChangeViewpoint();
  }
  // Async initializer 10: Handle initial map
  async setInitialMap(e) {
    const n = this.initialRestore.mapID || this.startFrom || e[e.length - 1].mapID;
    this.from = e.reduce(
      (r, A) => r ? !(r instanceof dg) && A.mapID != n ? A : r : A.mapID != n ? A : r,
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
        this.dispatchEvent(new Dt("clickMarker", n[0])), this.dispatchEvent(new Dt("clickMarkers", n));
      else {
        const r = e.coordinate;
        this.dispatchEvent(new Dt("clickMapXy", r)), this.from.sysCoord2MercAsync(r).then((A) => {
          this.dispatchEvent(new Dt("clickMapMerc", A));
          const s = Lt(A, "EPSG:3857", "EPSG:4326");
          this.dispatchEvent(
            new Dt("clickMap", {
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
    const A = {}, s = (g) => {
      this.dispatchEvent(new Dt("pointerMoveOnMapXy", g)), this.from.sysCoord2MercAsync(g).then((o) => {
        if (this.dispatchEvent(new Dt("pointerMoveOnMapMerc", o)), e) {
          const a = e;
          e = !1, s(a);
        } else
          n = !1;
      });
    };
    this.mapObject.on("pointermove", (g) => {
      r || (n ? e = g.coordinate : (n = !0, s(g.coordinate)));
    }), this.mapObject.on("pointerdown", (g) => {
      g.originalEvent && g.originalEvent.pointerId != null && (A[g.originalEvent.pointerId] = !0), r = !0;
    }), this.mapObject.on("pointerdrag", (g) => {
      g.originalEvent && g.originalEvent.pointerId != null && (A[g.originalEvent.pointerId] = !0), r = !0;
    }), this.mapObject.on("pointerup", (g) => {
      g.originalEvent && g.originalEvent.pointerId != null ? (delete A[g.originalEvent.pointerId], Object.keys(A).length == 0 && (r = !1)) : g.originalEvent && g.originalEvent.touches ? g.originalEvent.touches.length == 0 && (r = !1) : r = !1;
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
      const A = r.target.getEventPixel(r.originalEvent), s = r.target.hasFeatureAtPixel(A), g = r.target.getTarget();
      if (s) {
        const o = r.target.forEachFeatureAtPixel(
          r.pixel,
          (a) => {
            if (a.get("datum")) return a;
          }
        );
        this.mapDivDocument.querySelector(`#${g}`).style.cursor = o ? "pointer" : "";
        return;
      }
      this.mapDivDocument.querySelector(`#${g}`).style.cursor = "";
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
      const n = this.mapObject.getView(), r = n.getCenter(), A = n.getDecimalZoom(), s = DA(n.getRotation() * 180 / Math.PI), g = await this.from.viewpoint2MercsAsync(), o = await this.mercSrc.mercs2ViewpointAsync(g);
      if (this.mobileMapMoveBuffer && this.mobileMapMoveBuffer[0][0] == o[0][0] && this.mobileMapMoveBuffer[0][1] == o[0][1] && this.mobileMapMoveBuffer[1] == o[1] && this.mobileMapMoveBuffer[2] == o[2]) return;
      this.mobileMapMoveBuffer = o;
      const a = Lt(o[0], "EPSG:3857", "EPSG:4326"), I = DA(o[2] * 180 / Math.PI);
      this.dispatchEvent(
        new Dt("changeViewpoint", {
          x: r[0],
          y: r[1],
          longitude: a[0],
          latitude: a[1],
          mercator_x: o[0][0],
          mercator_y: o[0][1],
          zoom: A,
          mercZoom: o[1],
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
    return BA(this.from);
  }
  mapInfo(e) {
    return BA(this.cacheHash[e]);
  }
  async clientPointToLngLat(e, n) {
    if (!this.from || !this.mapObject) return;
    const A = this.mapObject.getViewport().getBoundingClientRect(), s = [e - A.left, n - A.top], g = this.mapObject.getCoordinateFromPixel(s);
    if (!g) return;
    const o = await this.from.sysCoord2MercAsync(g), a = Lt(o, "EPSG:3857", "EPSG:4326");
    return {
      longitude: a[0],
      latitude: a[1]
    };
  }
  async lngLatToClientPoint(e, n) {
    if (!this.from || !this.mapObject) return;
    const r = Lt([e, n], "EPSG:4326", "EPSG:3857"), A = await this.from.merc2SysCoordAsync(r), s = this.mapObject.getPixelFromCoordinate(A);
    if (!s) return;
    const g = this.mapObject.getViewport().getBoundingClientRect();
    return {
      x: s[0] + g.left,
      y: s[1] + g.top
    };
  }
  setMarker(e) {
    this.logger.debug(e);
    const n = e.lnglat || [
      e.lng || e.longitude,
      e.lat || e.latitude
    ], r = e.x, A = e.y, s = e.coordinates, g = this.from, o = e.icon ? this.__selectedMarker == e.namespaceID && e.selectedIcon ? e.selectedIcon : e.icon : this.__selectedMarker == e.namespaceID ? Rg : Di;
    return (s ? (function() {
      return g.merc2SysCoordAsync_ignoreBackground(
        s
      );
    })() : r && A ? new Promise((I) => {
      I(g.xy2SysCoord([r, A]));
    }) : (function() {
      const I = Lt(n, "EPSG:4326", "EPSG:3857");
      return g.merc2SysCoordAsync_ignoreBackground(
        I
      );
    })()).then((I) => {
      I && g.insideCheckSysCoord(I) && this.mapObject.setMarker(I, { datum: e }, o);
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
      A.map((g) => Array.isArray(g[0]) ? r(g, s) : (s && (g = Lt(g, "EPSG:4326", "EPSG:3857")), this.from.merc2SysCoordAsync(g)))
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
      this.stateBuffer.hideMarker || (Object.keys(this.pois).map((o) => {
        const a = this.pois[o];
        a.hide || a.pois.map((I) => {
          const C = hs(I, a, this);
          fs(C, a, this), this.__selectedMarker == C.namespaceID ? s = C : A.push(this.setMarker(C));
        });
      }), r.pois && Object.keys(r.pois).map((o) => {
        const a = r.pois[o];
        a.hide || a.pois.map((I) => {
          const C = hs(I, a, r, this);
          fs(C, a, r, this), this.__selectedMarker == C.namespaceID ? s = C : A.push(this.setMarker(C));
        });
      }));
      let g = Promise.all(A);
      s && (g = g.then(() => this.setMarker(s))), g.then(() => {
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
        this.pois[r].pois.map((A, s) => {
          A.id == e && (n = this.pois[r].pois[s]);
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
        return this.pois[n].pois.push(mn(e)), li(this.pois, n, {
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
        this.pois[n].pois.map((r, A) => {
          r.id == e && (delete this.pois[n].pois[A], this.dispatchPoiNumber(), this.redrawMarkers());
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
          this.pois[n].pois = [];
        });
      else if (this.pois[e])
        this.pois[e].pois = [];
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
      new Dt(
        "poi_number",
        this.listPoiLayers(!1, !0).reduce(
          (e, n) => e + n.pois.length,
          0
        )
      )
    );
  }
  listPoiLayers(e = !1, n = !1) {
    const r = Object.keys(this.pois).sort((s, g) => s == "main" ? -1 : g == "main" ? 1 : s < g ? -1 : s > g ? 1 : 0).map((s) => this.pois[s]).filter(
      (s) => n ? e ? s.pois.length && s.hide : s.pois.length : e ? s.hide : !0
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
        this.pois[e] = xe(n || [], e, {
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
      () => new Promise((s, g) => {
        this.convertParametersFromCurrent(A, (o) => {
          let a = null, I = null;
          const C = n.backgroundID ? this.cacheHash[n.backgroundID] : void 0;
          if (this.backMap && (a = this.backMap.getSource(), A.isWmts() ? this.backMap.exchangeSource() : (C ? (I = C, this.backMap.exchangeSource(I)) : a ? I = a : (I = r, this.from.isWmts() && (I = this.from instanceof Dn ? this.mapObject.getSource() : (
            // If current foreground is TMS overlay, set current basemap as new background
            this.from
          )), this.backMap.exchangeSource(I)), this.requestUpdateState({ backgroundID: I.mapID }))), A instanceof Dn) {
            if (this.mapObject.setLayer(A), C)
              this.mapObject.exchangeSource(C);
            else if (!this.from.isWmts()) {
              const u = a || r;
              this.mapObject.exchangeSource(u);
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
          this.appData.zoomRestriction && (l.setMaxZoom(A.maxZoom), l.setMinZoom(A.minZoom || 0)), o && A.insideCheckSysCoord(o[0]) ? (l.setCenter(o[0]), l.setZoom(o[1]), l.setRotation(this.noRotate ? 0 : o[2])) : this.__init ? o || this.goHome(A) : (this.dispatchEvent(new Dt("outOfMap", {})), this.goHome(A)), A.setGPSMarker(this.currentPosition, !0), n.hideLayer && (n.hideLayer.split(",").map((f) => {
            const m = this.getPoiLayer(f);
            m && (m.hide = !0);
          }), this.requestUpdateState({ hideLayer: n.hideLayer })), n.hideMarker ? this.hideAllMarkers() : this.redrawMarkers(), this.resetVector();
          for (let u = 0; u < this.vectors.length; u++)
            ((f) => {
              this.setVector(f);
            })(this.vectors[u]);
          this.dispatchEvent(
            new Dt("mapChanged", this.getMapMeta(A.mapID))
          ), this.mapObject.updateSize(), this.mapObject.render(), n.position && (this.__init = !1, A.setViewpoint(n.position)), n.transparency && this.setTransparency(n.transparency), this.__init ? (this.__init = !1, this.goHome(A)) : this.backMap && I && this.convertParametersFromCurrent(I, (u) => {
            const f = this.backMap.getView();
            f.setCenter(u[0]), f.setZoom(u[1]), f.setRotation(this.noRotate ? 0 : u[2]), this.backMap.updateSize(), this.backMap.render();
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
      this.timer = void 0, this.dispatchEvent(new Dt("updateState", this.stateBuffer));
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
    const s = Ii(
      [r.getCenter(), r.getZoom(), r.getRotation()],
      10
    );
    if (this.mercBuffer && this.mercBuffer.mercs && this.mercBuffer.buffer[this.from.mapID]) {
      const g = this.mercBuffer.buffer[this.from.mapID];
      g[0][0] == s[0][0] && g[0][1] == s[0][1] && g[1] == s[1] && g[2] == s[2] ? (this.logger.debug(g), this.logger.debug(s), this.logger.debug("From: Use buffer"), A = new Promise((o, a) => {
        o(this.mercBuffer.mercs);
      })) : (this.mercBuffer = {
        buffer: {}
      }, this.mercBuffer.buffer[this.from.mapID] = s);
    } else
      this.mercBuffer = {
        buffer: {}
      }, this.mercBuffer.buffer[this.from.mapID] = s;
    this.logger.debug(
      `From: Center: ${s[0]} Zoom: ${s[1]} Rotation: ${s[2]}`
    ), this.logger.debug(`From: ${this.from.mapID}`), A.then((g) => {
      this.mercBuffer.mercs = g, this.logger.debug(`Mercs: ${g}`);
      let o = e.mercs2ViewpointAsync(g);
      const a = e.mapID;
      this.mercBuffer.buffer[a] && (this.logger.debug("To: Use buffer"), o = new Promise((I, C) => {
        I(this.mercBuffer.buffer[a]);
      })), o.then((I) => {
        this.logger.debug(
          `To: Center: ${I[0]} Zoom: ${I[1]} Rotation: ${I[2]}`
        ), this.logger.debug(`To: ${e.mapID}`), this.mercBuffer.buffer[e.mapID] = Ii(I, 10), n(I);
      }).catch((I) => {
        throw I;
      });
    }).catch((g) => {
      throw g;
    });
  }
  translate(e) {
    if (!e || typeof e == "string")
      return e;
    const n = Object.keys(e);
    let r = n.reduce((A, s, g, o) => (s == this.appLang ? A = [e[s], !0] : (!A || s == "en" && !A[1]) && (A = [e[s], !1]), g == o.length - 1 ? A[0] : A), void 0);
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
w(Bn, "createObject");
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
  window.Maplat = i, window.MaplatApp = Bn, window.assets = kc;
}
export {
  Dt as C,
  Nc as G,
  Bn as M,
  sr as a,
  Gc as b,
  Cn as c,
  kc as d,
  Cc as g
};
//# sourceMappingURL=index-C_8RHimG.js.map
