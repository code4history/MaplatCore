function De(J) {
  return J && J.__esModule && Object.prototype.hasOwnProperty.call(J, "default") ? J.default : J;
}
var we = { exports: {} }, Ge = we.exports, Le;
function We() {
  return Le || (Le = 1, (function(J, q) {
    (function(F, R) {
      J.exports = R();
    })(typeof self < "u" ? self : Ge, function() {
      return (
        /******/
        (function(F) {
          var R = {};
          function T(g) {
            if (R[g])
              return R[g].exports;
            var E = R[g] = {
              /******/
              i: g,
              /******/
              l: !1,
              /******/
              exports: {}
              /******/
            };
            return F[g].call(E.exports, E, E.exports, T), E.l = !0, E.exports;
          }
          return T.m = F, T.c = R, T.d = function(g, E, h) {
            T.o(g, E) || Object.defineProperty(g, E, {
              /******/
              configurable: !1,
              /******/
              enumerable: !0,
              /******/
              get: h
              /******/
            });
          }, T.n = function(g) {
            var E = g && g.__esModule ? (
              /******/
              (function() {
                return g.default;
              })
            ) : (
              /******/
              (function() {
                return g;
              })
            );
            return T.d(E, "a", E), E;
          }, T.o = function(g, E) {
            return Object.prototype.hasOwnProperty.call(g, E);
          }, T.p = "", T(T.s = 11);
        })([
          /* 0 */
          /***/
          (function(F, m, T) {
            var g = Array.prototype, E = Object.prototype, h = {
              "&": "&amp;",
              '"': "&quot;",
              "'": "&#39;",
              "<": "&lt;",
              ">": "&gt;",
              "\\": "&#92;"
            }, k = /[&"'<>\\]/g, m = F.exports = {};
            function w(v, I) {
              return E.hasOwnProperty.call(v, I);
            }
            m.hasOwnProp = w;
            function K(v) {
              return h[v];
            }
            function P(v, I, B) {
              if (B.Update || (B = new m.TemplateError(B)), B.Update(v), !I) {
                var j = B;
                B = new Error(j.message), B.name = j.name;
              }
              return B;
            }
            m._prettifyError = P;
            function N(v, I, B) {
              var j, Z;
              v instanceof Error && (Z = v, v = Z.name + ": " + Z.message), Object.setPrototypeOf ? (j = new Error(v), Object.setPrototypeOf(j, N.prototype)) : (j = this, Object.defineProperty(j, "message", {
                enumerable: !1,
                writable: !0,
                value: v
              })), Object.defineProperty(j, "name", {
                value: "Template render error"
              }), Error.captureStackTrace && Error.captureStackTrace(j, this.constructor);
              var Y;
              if (Z) {
                var Q = Object.getOwnPropertyDescriptor(Z, "stack");
                Y = Q && (Q.get || function() {
                  return Q.value;
                }), Y || (Y = function() {
                  return Z.stack;
                });
              } else {
                var le = new Error(v).stack;
                Y = function() {
                  return le;
                };
              }
              return Object.defineProperty(j, "stack", {
                get: function() {
                  return Y.call(j);
                }
              }), Object.defineProperty(j, "cause", {
                value: Z
              }), j.lineno = I, j.colno = B, j.firstUpdate = !0, j.Update = function(oe) {
                var ee = "(" + (oe || "unknown path") + ")";
                return this.firstUpdate && (this.lineno && this.colno ? ee += " [Line " + this.lineno + ", Column " + this.colno + "]" : this.lineno && (ee += " [Line " + this.lineno + "]")), ee += `
 `, this.firstUpdate && (ee += " "), this.message = ee + (this.message || ""), this.firstUpdate = !1, this;
              }, j;
            }
            Object.setPrototypeOf ? Object.setPrototypeOf(N.prototype, Error.prototype) : N.prototype = Object.create(Error.prototype, {
              constructor: {
                value: N
              }
            }), m.TemplateError = N;
            function b(v) {
              return v.replace(k, K);
            }
            m.escape = b;
            function t(v) {
              return E.toString.call(v) === "[object Function]";
            }
            m.isFunction = t;
            function n(v) {
              return E.toString.call(v) === "[object Array]";
            }
            m.isArray = n;
            function a(v) {
              return E.toString.call(v) === "[object String]";
            }
            m.isString = a;
            function o(v) {
              return E.toString.call(v) === "[object Object]";
            }
            m.isObject = o;
            function y(v) {
              return v ? typeof v == "string" ? v.split(".") : [v] : [];
            }
            function c(v) {
              var I = y(v);
              return function(B) {
                for (var j = B, Z = 0; Z < I.length; Z++) {
                  var Y = I[Z];
                  if (w(j, Y))
                    j = j[Y];
                  else
                    return;
                }
                return j;
              };
            }
            m.getAttrGetter = c;
            function e(v, I, B) {
              for (var j = {}, Z = t(I) ? I : c(I), Y = 0; Y < v.length; Y++) {
                var Q = v[Y], le = Z(Q, Y);
                if (le === void 0 && B === !0)
                  throw new TypeError('groupby: attribute "' + I + '" resolved to undefined');
                (j[le] || (j[le] = [])).push(Q);
              }
              return j;
            }
            m.groupBy = e;
            function i(v) {
              return Array.prototype.slice.call(v);
            }
            m.toArray = i;
            function r(v) {
              var I = [];
              if (!v)
                return I;
              for (var B = v.length, j = i(arguments).slice(1), Z = -1; ++Z < B; )
                x(j, v[Z]) === -1 && I.push(v[Z]);
              return I;
            }
            m.without = r;
            function u(v, I) {
              for (var B = "", j = 0; j < I; j++)
                B += v;
              return B;
            }
            m.repeat = u;
            function l(v, I, B) {
              if (v != null) {
                if (g.forEach && v.forEach === g.forEach)
                  v.forEach(I, B);
                else if (v.length === +v.length)
                  for (var j = 0, Z = v.length; j < Z; j++)
                    I.call(B, v[j], j, v);
              }
            }
            m.each = l;
            function s(v, I) {
              var B = [];
              if (v == null)
                return B;
              if (g.map && v.map === g.map)
                return v.map(I);
              for (var j = 0; j < v.length; j++)
                B[B.length] = I(v[j], j);
              return v.length === +v.length && (B.length = v.length), B;
            }
            m.map = s;
            function f(v, I, B) {
              var j = -1;
              function Z() {
                j++, j < v.length ? I(v[j], j, Z, B) : B();
              }
              Z();
            }
            m.asyncIter = f;
            function p(v, I, B) {
              var j = L(v || {}), Z = j.length, Y = -1;
              function Q() {
                Y++;
                var le = j[Y];
                Y < Z ? I(le, v[le], Y, Z, Q) : B();
              }
              Q();
            }
            m.asyncFor = p;
            function x(v, I, B) {
              return Array.prototype.indexOf.call(v || [], I, B);
            }
            m.indexOf = x;
            function L(v) {
              var I = [];
              for (var B in v)
                w(v, B) && I.push(B);
              return I;
            }
            m.keys = L;
            function S(v) {
              return L(v).map(function(I) {
                return [I, v[I]];
              });
            }
            m._entries = S;
            function C(v) {
              return L(v).map(function(I) {
                return v[I];
              });
            }
            m._values = C;
            function d(v, I) {
              return v = v || {}, L(I).forEach(function(B) {
                v[B] = I[B];
              }), v;
            }
            m._assign = m.extend = d;
            function O(v, I) {
              if (n(I) || a(I))
                return I.indexOf(v) !== -1;
              if (o(I))
                return v in I;
              throw new Error('Cannot use "in" operator to search for "' + v + '" in unexpected types.');
            }
            m.inOperator = O;
          }),
          /* 1 */
          /***/
          (function(F, R, T) {
            function g(a, o) {
              for (var y = 0; y < o.length; y++) {
                var c = o[y];
                c.enumerable = c.enumerable || !1, c.configurable = !0, "value" in c && (c.writable = !0), Object.defineProperty(a, h(c.key), c);
              }
            }
            function E(a, o, y) {
              return o && g(a.prototype, o), Object.defineProperty(a, "prototype", { writable: !1 }), a;
            }
            function h(a) {
              var o = k(a, "string");
              return typeof o == "symbol" ? o : String(o);
            }
            function k(a, o) {
              if (typeof a != "object" || a === null) return a;
              var y = a[Symbol.toPrimitive];
              if (y !== void 0) {
                var c = y.call(a, o);
                if (typeof c != "object") return c;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return String(a);
            }
            function m(a, o) {
              a.prototype = Object.create(o.prototype), a.prototype.constructor = a, w(a, o);
            }
            function w(a, o) {
              return w = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(y, c) {
                return y.__proto__ = c, y;
              }, w(a, o);
            }
            var K = T(16), P = T(0);
            function N(a, o) {
              return typeof a != "function" || typeof o != "function" ? o : function() {
                var y = this.parent;
                this.parent = a;
                var c = o.apply(this, arguments);
                return this.parent = y, c;
              };
            }
            function b(a, o, y) {
              y = y || {}, P.keys(y).forEach(function(e) {
                y[e] = N(a.prototype[e], y[e]);
              });
              var c = /* @__PURE__ */ (function(e) {
                m(i, e);
                function i() {
                  return e.apply(this, arguments) || this;
                }
                return E(i, [{
                  key: "typename",
                  get: function() {
                    return o;
                  }
                }]), i;
              })(a);
              return P._assign(c.prototype, y), c;
            }
            var t = /* @__PURE__ */ (function() {
              function a() {
                this.init.apply(this, arguments);
              }
              var o = a.prototype;
              return o.init = function() {
              }, a.extend = function(y, c) {
                return typeof y == "object" && (c = y, y = "anonymous"), b(this, y, c);
              }, E(a, [{
                key: "typename",
                get: function() {
                  return this.constructor.name;
                }
              }]), a;
            })(), n = /* @__PURE__ */ (function(a) {
              m(o, a);
              function o() {
                var c, e;
                return e = a.call(this) || this, (c = e).init.apply(c, arguments), e;
              }
              var y = o.prototype;
              return y.init = function() {
              }, o.extend = function(c, e) {
                return typeof c == "object" && (e = c, c = "anonymous"), b(this, c, e);
              }, E(o, [{
                key: "typename",
                get: function() {
                  return this.constructor.name;
                }
              }]), o;
            })(K);
            F.exports = {
              Obj: t,
              EmitterObj: n
            };
          }),
          /* 2 */
          /***/
          (function(F, R, T) {
            var g = T(0), E = Array.from, h = typeof Symbol == "function" && Symbol.iterator && typeof E == "function", k = /* @__PURE__ */ (function() {
              function s(p, x) {
                this.variables = /* @__PURE__ */ Object.create(null), this.parent = p, this.topLevel = !1, this.isolateWrites = x;
              }
              var f = s.prototype;
              return f.set = function(p, x, L) {
                var S = p.split("."), C = this.variables, d = this;
                if (L && (d = this.resolve(S[0], !0))) {
                  d.set(p, x);
                  return;
                }
                for (var O = 0; O < S.length - 1; O++) {
                  var v = S[O];
                  C[v] || (C[v] = {}), C = C[v];
                }
                C[S[S.length - 1]] = x;
              }, f.get = function(p) {
                var x = this.variables[p];
                return x !== void 0 ? x : null;
              }, f.lookup = function(p) {
                var x = this.parent, L = this.variables[p];
                return L !== void 0 ? L : x && x.lookup(p);
              }, f.resolve = function(p, x) {
                var L = x && this.isolateWrites ? void 0 : this.parent, S = this.variables[p];
                return S !== void 0 ? this : L && L.resolve(p);
              }, f.push = function(p) {
                return new s(this, p);
              }, f.pop = function() {
                return this.parent;
              }, s;
            })();
            function m(s, f, p) {
              return function() {
                for (var x = arguments.length, L = new Array(x), S = 0; S < x; S++)
                  L[S] = arguments[S];
                var C = N(L), d, O = P(L);
                if (C > s.length)
                  d = L.slice(0, s.length), L.slice(d.length, C).forEach(function(B, j) {
                    j < f.length && (O[f[j]] = B);
                  }), d.push(O);
                else if (C < s.length) {
                  d = L.slice(0, C);
                  for (var v = C; v < s.length; v++) {
                    var I = s[v];
                    d.push(O[I]), delete O[I];
                  }
                  d.push(O);
                } else
                  d = L;
                return p.apply(this, d);
              };
            }
            function w(s) {
              return s.__keywords = !0, s;
            }
            function K(s) {
              return s && Object.prototype.hasOwnProperty.call(s, "__keywords");
            }
            function P(s) {
              var f = s.length;
              if (f) {
                var p = s[f - 1];
                if (K(p))
                  return p;
              }
              return {};
            }
            function N(s) {
              var f = s.length;
              if (f === 0)
                return 0;
              var p = s[f - 1];
              return K(p) ? f - 1 : f;
            }
            function b(s) {
              if (typeof s != "string")
                return s;
              this.val = s, this.length = s.length;
            }
            b.prototype = Object.create(String.prototype, {
              length: {
                writable: !0,
                configurable: !0,
                value: 0
              }
            }), b.prototype.valueOf = function() {
              return this.val;
            }, b.prototype.toString = function() {
              return this.val;
            };
            function t(s, f) {
              return s instanceof b ? new b(f) : f.toString();
            }
            function n(s) {
              var f = typeof s;
              return f === "string" ? new b(s) : f !== "function" ? s : function(p) {
                var x = s.apply(this, arguments);
                return typeof x == "string" ? new b(x) : x;
              };
            }
            function a(s, f) {
              return s = s ?? "", f && !(s instanceof b) && (s = g.escape(s.toString())), s;
            }
            function o(s, f, p) {
              if (s == null)
                throw new g.TemplateError("attempted to output null or undefined value", f + 1, p + 1);
              return s;
            }
            function y(s, f) {
              if (s != null)
                return typeof s[f] == "function" ? function() {
                  for (var p = arguments.length, x = new Array(p), L = 0; L < p; L++)
                    x[L] = arguments[L];
                  return s[f].apply(s, x);
                } : s[f];
            }
            function c(s, f, p, x) {
              if (s) {
                if (typeof s != "function")
                  throw new Error("Unable to call `" + f + "`, which is not a function");
              } else throw new Error("Unable to call `" + f + "`, which is undefined or falsey");
              return s.apply(p, x);
            }
            function e(s, f, p) {
              var x = f.lookup(p);
              return x !== void 0 ? x : s.lookup(p);
            }
            function i(s, f, p) {
              return s.lineno ? s : new g.TemplateError(s, f, p);
            }
            function r(s, f, p, x) {
              if (g.isArray(s)) {
                var L = s.length;
                g.asyncIter(s, function(S, C, d) {
                  switch (f) {
                    case 1:
                      p(S, C, L, d);
                      break;
                    case 2:
                      p(S[0], S[1], C, L, d);
                      break;
                    case 3:
                      p(S[0], S[1], S[2], C, L, d);
                      break;
                    default:
                      S.push(C, L, d), p.apply(this, S);
                  }
                }, x);
              } else
                g.asyncFor(s, function(S, C, d, O, v) {
                  p(S, C, d, O, v);
                }, x);
            }
            function u(s, f, p, x) {
              var L = 0, S, C;
              function d(Z, Y) {
                L++, C[Z] = Y, L === S && x(null, C.join(""));
              }
              if (g.isArray(s))
                if (S = s.length, C = new Array(S), S === 0)
                  x(null, "");
                else
                  for (var O = 0; O < s.length; O++) {
                    var v = s[O];
                    switch (f) {
                      case 1:
                        p(v, O, S, d);
                        break;
                      case 2:
                        p(v[0], v[1], O, S, d);
                        break;
                      case 3:
                        p(v[0], v[1], v[2], O, S, d);
                        break;
                      default:
                        v.push(O, S, d), p.apply(this, v);
                    }
                  }
              else {
                var I = g.keys(s || {});
                if (S = I.length, C = new Array(S), S === 0)
                  x(null, "");
                else
                  for (var B = 0; B < I.length; B++) {
                    var j = I[B];
                    p(j, s[j], B, S, d);
                  }
              }
            }
            function l(s) {
              return typeof s != "object" || s === null || g.isArray(s) ? s : h && Symbol.iterator in s ? E(s) : s;
            }
            F.exports = {
              Frame: k,
              makeMacro: m,
              makeKeywordArgs: w,
              numArgs: N,
              suppressValue: a,
              ensureDefined: o,
              memberLookup: y,
              contextOrFrameLookup: e,
              callWrap: c,
              handleError: i,
              isArray: g.isArray,
              keys: g.keys,
              SafeString: b,
              copySafeness: t,
              markSafe: n,
              asyncEach: r,
              asyncAll: u,
              inOperator: g.inOperator,
              fromIterator: l
            };
          }),
          /* 3 */
          /***/
          (function(F, R, T) {
            function g(W, $) {
              for (var ie = 0; ie < $.length; ie++) {
                var te = $[ie];
                te.enumerable = te.enumerable || !1, te.configurable = !0, "value" in te && (te.writable = !0), Object.defineProperty(W, h(te.key), te);
              }
            }
            function E(W, $, ie) {
              return $ && g(W.prototype, $), Object.defineProperty(W, "prototype", { writable: !1 }), W;
            }
            function h(W) {
              var $ = k(W, "string");
              return typeof $ == "symbol" ? $ : String($);
            }
            function k(W, $) {
              if (typeof W != "object" || W === null) return W;
              var ie = W[Symbol.toPrimitive];
              if (ie !== void 0) {
                var te = ie.call(W, $);
                if (typeof te != "object") return te;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return String(W);
            }
            function m(W, $) {
              W.prototype = Object.create($.prototype), W.prototype.constructor = W, w(W, $);
            }
            function w(W, $) {
              return w = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(ie, te) {
                return ie.__proto__ = te, ie;
              }, w(W, $);
            }
            var K = T(1), P = K.Obj;
            function N(W, $, ie) {
              W instanceof $ && ie.push(W), W instanceof b && W.findAll($, ie);
            }
            var b = /* @__PURE__ */ (function(W) {
              m($, W);
              function $() {
                return W.apply(this, arguments) || this;
              }
              var ie = $.prototype;
              return ie.init = function(te, re) {
                for (var ue = arguments, me = this, ge = arguments.length, Me = new Array(ge > 2 ? ge - 2 : 0), ke = 2; ke < ge; ke++)
                  Me[ke - 2] = arguments[ke];
                this.lineno = te, this.colno = re, this.fields.forEach(function(Ue, Ve) {
                  var Ee = ue[Ve + 2];
                  Ee === void 0 && (Ee = null), me[Ue] = Ee;
                });
              }, ie.findAll = function(te, re) {
                var ue = this;
                return re = re || [], this instanceof n ? this.children.forEach(function(me) {
                  return N(me, te, re);
                }) : this.fields.forEach(function(me) {
                  return N(ue[me], te, re);
                }), re;
              }, ie.iterFields = function(te) {
                var re = this;
                this.fields.forEach(function(ue) {
                  te(re[ue], ue);
                });
              }, $;
            })(P), t = /* @__PURE__ */ (function(W) {
              m($, W);
              function $() {
                return W.apply(this, arguments) || this;
              }
              return E($, [{
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
            })(b), n = /* @__PURE__ */ (function(W) {
              m($, W);
              function $() {
                return W.apply(this, arguments) || this;
              }
              var ie = $.prototype;
              return ie.init = function(te, re, ue) {
                W.prototype.init.call(this, te, re, ue || []);
              }, ie.addChild = function(te) {
                this.children.push(te);
              }, E($, [{
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
            })(b), a = n.extend("Root"), o = t.extend("Literal"), y = t.extend("Symbol"), c = n.extend("Group"), e = n.extend("Array"), i = b.extend("Pair", {
              fields: ["key", "value"]
            }), r = n.extend("Dict"), u = b.extend("LookupVal", {
              fields: ["target", "val"]
            }), l = b.extend("If", {
              fields: ["cond", "body", "else_"]
            }), s = l.extend("IfAsync"), f = b.extend("InlineIf", {
              fields: ["cond", "body", "else_"]
            }), p = b.extend("For", {
              fields: ["arr", "name", "body", "else_"]
            }), x = p.extend("AsyncEach"), L = p.extend("AsyncAll"), S = b.extend("Macro", {
              fields: ["name", "args", "body"]
            }), C = S.extend("Caller"), d = b.extend("Import", {
              fields: ["template", "target", "withContext"]
            }), O = /* @__PURE__ */ (function(W) {
              m($, W);
              function $() {
                return W.apply(this, arguments) || this;
              }
              var ie = $.prototype;
              return ie.init = function(te, re, ue, me, ge) {
                W.prototype.init.call(this, te, re, ue, me || new n(), ge);
              }, E($, [{
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
            })(b), v = b.extend("FunCall", {
              fields: ["name", "args"]
            }), I = v.extend("Filter"), B = I.extend("FilterAsync", {
              fields: ["name", "args", "symbol"]
            }), j = r.extend("KeywordArgs"), Z = b.extend("Block", {
              fields: ["name", "body"]
            }), Y = b.extend("Super", {
              fields: ["blockName", "symbol"]
            }), Q = b.extend("TemplateRef", {
              fields: ["template"]
            }), le = Q.extend("Extends"), oe = b.extend("Include", {
              fields: ["template", "ignoreMissing"]
            }), ee = b.extend("Set", {
              fields: ["targets", "value"]
            }), V = b.extend("Switch", {
              fields: ["expr", "cases", "default"]
            }), G = b.extend("Case", {
              fields: ["cond", "body"]
            }), D = n.extend("Output"), se = b.extend("Capture", {
              fields: ["body"]
            }), fe = o.extend("TemplateData"), de = b.extend("UnaryOp", {
              fields: ["target"]
            }), ae = b.extend("BinOp", {
              fields: ["left", "right"]
            }), _e = ae.extend("In"), _ = ae.extend("Is"), A = ae.extend("Or"), M = ae.extend("And"), U = de.extend("Not"), X = ae.extend("Add"), z = ae.extend("Concat"), ne = ae.extend("Sub"), H = ae.extend("Mul"), ce = ae.extend("Div"), he = ae.extend("FloorDiv"), pe = ae.extend("Mod"), Ie = ae.extend("Pow"), Fe = de.extend("Neg"), Pe = de.extend("Pos"), Be = b.extend("Compare", {
              fields: ["expr", "ops"]
            }), je = b.extend("CompareOperand", {
              fields: ["expr", "type"]
            }), be = b.extend("CallExtension", {
              init: function(W, $, ie, te) {
                this.parent(), this.extName = W.__name || W, this.prop = $, this.args = ie || new n(), this.contentArgs = te || [], this.autoescape = W.autoescape;
              },
              fields: ["extName", "prop", "args", "contentArgs"]
            }), Ke = be.extend("CallExtensionAsync");
            function ve(W, $, ie) {
              var te = W.split(`
`);
              te.forEach(function(re, ue) {
                re && (ie && ue > 0 || !ie) && process.stdout.write(" ".repeat($));
                var me = ue === te.length - 1 ? "" : `
`;
                process.stdout.write("" + re + me);
              });
            }
            function ye(W, $) {
              if ($ = $ || 0, ve(W.typename + ": ", $), W instanceof n)
                ve(`
`), W.children.forEach(function(re) {
                  ye(re, $ + 2);
                });
              else if (W instanceof be)
                ve(W.extName + "." + W.prop + `
`), W.args && ye(W.args, $ + 2), W.contentArgs && W.contentArgs.forEach(function(re) {
                  ye(re, $ + 2);
                });
              else {
                var ie = [], te = null;
                W.iterFields(function(re, ue) {
                  re instanceof b ? ie.push([ue, re]) : (te = te || {}, te[ue] = re);
                }), te ? ve(JSON.stringify(te, null, 2) + `
`, null, !0) : ve(`
`), ie.forEach(function(re) {
                  var ue = re[0], me = re[1];
                  ve("[" + ue + "] =>", $ + 2), ye(me, $ + 4);
                });
              }
            }
            F.exports = {
              Node: b,
              Root: a,
              NodeList: n,
              Value: t,
              Literal: o,
              Symbol: y,
              Group: c,
              Array: e,
              Pair: i,
              Dict: r,
              Output: D,
              Capture: se,
              TemplateData: fe,
              If: l,
              IfAsync: s,
              InlineIf: f,
              For: p,
              AsyncEach: x,
              AsyncAll: L,
              Macro: S,
              Caller: C,
              Import: d,
              FromImport: O,
              FunCall: v,
              Filter: I,
              FilterAsync: B,
              KeywordArgs: j,
              Block: Z,
              Super: Y,
              Extends: le,
              Include: oe,
              Set: ee,
              Switch: V,
              Case: G,
              LookupVal: u,
              BinOp: ae,
              In: _e,
              Is: _,
              Or: A,
              And: M,
              Not: U,
              Add: X,
              Concat: z,
              Sub: ne,
              Mul: H,
              Div: ce,
              FloorDiv: he,
              Mod: pe,
              Pow: Ie,
              Neg: Fe,
              Pos: Pe,
              Compare: Be,
              CompareOperand: je,
              CallExtension: be,
              CallExtensionAsync: Ke,
              printNodes: ye
            };
          }),
          /* 4 */
          /***/
          (function(F, R) {
          }),
          /* 5 */
          /***/
          (function(F, R, T) {
            function g(o, y) {
              o.prototype = Object.create(y.prototype), o.prototype.constructor = o, E(o, y);
            }
            function E(o, y) {
              return E = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(c, e) {
                return c.__proto__ = e, c;
              }, E(o, y);
            }
            var h = T(8), k = T(17), m = T(3), w = T(0), K = w.TemplateError, P = T(2), N = P.Frame, b = T(1), t = b.Obj, n = {
              "==": "==",
              "===": "===",
              "!=": "!=",
              "!==": "!==",
              "<": "<",
              ">": ">",
              "<=": "<=",
              ">=": ">="
            }, a = /* @__PURE__ */ (function(o) {
              g(y, o);
              function y() {
                return o.apply(this, arguments) || this;
              }
              var c = y.prototype;
              return c.init = function(e, i) {
                this.templateName = e, this.codebuf = [], this.lastId = 0, this.buffer = null, this.bufferStack = [], this._scopeClosers = "", this.inBlock = !1, this.throwOnUndefined = i;
              }, c.fail = function(e, i, r) {
                throw i !== void 0 && (i += 1), r !== void 0 && (r += 1), new K(e, i, r);
              }, c._pushBuffer = function() {
                var e = this._tmpid();
                return this.bufferStack.push(this.buffer), this.buffer = e, this._emit("var " + this.buffer + ' = "";'), e;
              }, c._popBuffer = function() {
                this.buffer = this.bufferStack.pop();
              }, c._emit = function(e) {
                this.codebuf.push(e);
              }, c._emitLine = function(e) {
                this._emit(e + `
`);
              }, c._emitLines = function() {
                for (var e = this, i = arguments.length, r = new Array(i), u = 0; u < i; u++)
                  r[u] = arguments[u];
                r.forEach(function(l) {
                  return e._emitLine(l);
                });
              }, c._emitFuncBegin = function(e, i) {
                this.buffer = "output", this._scopeClosers = "", this._emitLine("function " + i + "(env, context, frame, runtime, cb) {"), this._emitLine("var lineno = " + e.lineno + ";"), this._emitLine("var colno = " + e.colno + ";"), this._emitLine("var " + this.buffer + ' = "";'), this._emitLine("try {");
              }, c._emitFuncEnd = function(e) {
                e || this._emitLine("cb(null, " + this.buffer + ");"), this._closeScopeLevels(), this._emitLine("} catch (e) {"), this._emitLine("  cb(runtime.handleError(e, lineno, colno));"), this._emitLine("}"), this._emitLine("}"), this.buffer = null;
              }, c._addScopeLevel = function() {
                this._scopeClosers += "})";
              }, c._closeScopeLevels = function() {
                this._emitLine(this._scopeClosers + ";"), this._scopeClosers = "";
              }, c._withScopedSyntax = function(e) {
                var i = this._scopeClosers;
                this._scopeClosers = "", e.call(this), this._closeScopeLevels(), this._scopeClosers = i;
              }, c._makeCallback = function(e) {
                var i = this._tmpid();
                return "function(" + i + (e ? "," + e : "") + `) {
if(` + i + ") { cb(" + i + "); return; }";
              }, c._tmpid = function() {
                return this.lastId++, "t_" + this.lastId;
              }, c._templateName = function() {
                return this.templateName == null ? "undefined" : JSON.stringify(this.templateName);
              }, c._compileChildren = function(e, i) {
                var r = this;
                e.children.forEach(function(u) {
                  r.compile(u, i);
                });
              }, c._compileAggregate = function(e, i, r, u) {
                var l = this;
                r && this._emit(r), e.children.forEach(function(s, f) {
                  f > 0 && l._emit(","), l.compile(s, i);
                }), u && this._emit(u);
              }, c._compileExpression = function(e, i) {
                this.assertType(e, m.Literal, m.Symbol, m.Group, m.Array, m.Dict, m.FunCall, m.Caller, m.Filter, m.LookupVal, m.Compare, m.InlineIf, m.In, m.Is, m.And, m.Or, m.Not, m.Add, m.Concat, m.Sub, m.Mul, m.Div, m.FloorDiv, m.Mod, m.Pow, m.Neg, m.Pos, m.Compare, m.NodeList), this.compile(e, i);
              }, c.assertType = function(e) {
                for (var i = arguments.length, r = new Array(i > 1 ? i - 1 : 0), u = 1; u < i; u++)
                  r[u - 1] = arguments[u];
                r.some(function(l) {
                  return e instanceof l;
                }) || this.fail("assertType: invalid type: " + e.typename, e.lineno, e.colno);
              }, c.compileCallExtension = function(e, i, r) {
                var u = this, l = e.args, s = e.contentArgs, f = typeof e.autoescape == "boolean" ? e.autoescape : !0;
                if (r || this._emit(this.buffer + " += runtime.suppressValue("), this._emit('env.getExtension("' + e.extName + '")["' + e.prop + '"]('), this._emit("context"), (l || s) && this._emit(","), l && (l instanceof m.NodeList || this.fail("compileCallExtension: arguments must be a NodeList, use `parser.parseSignature`"), l.children.forEach(function(x, L) {
                  u._compileExpression(x, i), (L !== l.children.length - 1 || s.length) && u._emit(",");
                })), s.length && s.forEach(function(x, L) {
                  if (L > 0 && u._emit(","), x) {
                    u._emitLine("function(cb) {"), u._emitLine("if(!cb) { cb = function(err) { if(err) { throw err; }}}");
                    var S = u._pushBuffer();
                    u._withScopedSyntax(function() {
                      u.compile(x, i), u._emitLine("cb(null, " + S + ");");
                    }), u._popBuffer(), u._emitLine("return " + S + ";"), u._emitLine("}");
                  } else
                    u._emit("null");
                }), r) {
                  var p = this._tmpid();
                  this._emitLine(", " + this._makeCallback(p)), this._emitLine(this.buffer + " += runtime.suppressValue(" + p + ", " + f + " && env.opts.autoescape);"), this._addScopeLevel();
                } else
                  this._emit(")"), this._emit(", " + f + ` && env.opts.autoescape);
`);
              }, c.compileCallExtensionAsync = function(e, i) {
                this.compileCallExtension(e, i, !0);
              }, c.compileNodeList = function(e, i) {
                this._compileChildren(e, i);
              }, c.compileLiteral = function(e) {
                if (typeof e.value == "string") {
                  var i = e.value.replace(/\\/g, "\\\\");
                  i = i.replace(/"/g, '\\"'), i = i.replace(/\n/g, "\\n"), i = i.replace(/\r/g, "\\r"), i = i.replace(/\t/g, "\\t"), i = i.replace(/\u2028/g, "\\u2028"), this._emit('"' + i + '"');
                } else e.value === null ? this._emit("null") : this._emit(e.value.toString());
              }, c.compileSymbol = function(e, i) {
                var r = e.value, u = i.lookup(r);
                u ? this._emit(u) : this._emit('runtime.contextOrFrameLookup(context, frame, "' + r + '")');
              }, c.compileGroup = function(e, i) {
                this._compileAggregate(e, i, "(", ")");
              }, c.compileArray = function(e, i) {
                this._compileAggregate(e, i, "[", "]");
              }, c.compileDict = function(e, i) {
                this._compileAggregate(e, i, "{", "}");
              }, c.compilePair = function(e, i) {
                var r = e.key, u = e.value;
                r instanceof m.Symbol ? r = new m.Literal(r.lineno, r.colno, r.value) : r instanceof m.Literal && typeof r.value == "string" || this.fail("compilePair: Dict keys must be strings or names", r.lineno, r.colno), this.compile(r, i), this._emit(": "), this._compileExpression(u, i);
              }, c.compileInlineIf = function(e, i) {
                this._emit("("), this.compile(e.cond, i), this._emit("?"), this.compile(e.body, i), this._emit(":"), e.else_ !== null ? this.compile(e.else_, i) : this._emit('""'), this._emit(")");
              }, c.compileIn = function(e, i) {
                this._emit("runtime.inOperator("), this.compile(e.left, i), this._emit(","), this.compile(e.right, i), this._emit(")");
              }, c.compileIs = function(e, i) {
                var r = e.right.name ? e.right.name.value : e.right.value;
                this._emit('env.getTest("' + r + '").call(context, '), this.compile(e.left, i), e.right.args && (this._emit(","), this.compile(e.right.args, i)), this._emit(") === true");
              }, c._binOpEmitter = function(e, i, r) {
                this.compile(e.left, i), this._emit(r), this.compile(e.right, i);
              }, c.compileOr = function(e, i) {
                return this._binOpEmitter(e, i, " || ");
              }, c.compileAnd = function(e, i) {
                return this._binOpEmitter(e, i, " && ");
              }, c.compileAdd = function(e, i) {
                return this._binOpEmitter(e, i, " + ");
              }, c.compileConcat = function(e, i) {
                return this._binOpEmitter(e, i, ' + "" + ');
              }, c.compileSub = function(e, i) {
                return this._binOpEmitter(e, i, " - ");
              }, c.compileMul = function(e, i) {
                return this._binOpEmitter(e, i, " * ");
              }, c.compileDiv = function(e, i) {
                return this._binOpEmitter(e, i, " / ");
              }, c.compileMod = function(e, i) {
                return this._binOpEmitter(e, i, " % ");
              }, c.compileNot = function(e, i) {
                this._emit("!"), this.compile(e.target, i);
              }, c.compileFloorDiv = function(e, i) {
                this._emit("Math.floor("), this.compile(e.left, i), this._emit(" / "), this.compile(e.right, i), this._emit(")");
              }, c.compilePow = function(e, i) {
                this._emit("Math.pow("), this.compile(e.left, i), this._emit(", "), this.compile(e.right, i), this._emit(")");
              }, c.compileNeg = function(e, i) {
                this._emit("-"), this.compile(e.target, i);
              }, c.compilePos = function(e, i) {
                this._emit("+"), this.compile(e.target, i);
              }, c.compileCompare = function(e, i) {
                var r = this;
                this.compile(e.expr, i), e.ops.forEach(function(u) {
                  r._emit(" " + n[u.type] + " "), r.compile(u.expr, i);
                });
              }, c.compileLookupVal = function(e, i) {
                this._emit("runtime.memberLookup(("), this._compileExpression(e.target, i), this._emit("),"), this._compileExpression(e.val, i), this._emit(")");
              }, c._getNodeName = function(e) {
                switch (e.typename) {
                  case "Symbol":
                    return e.value;
                  case "FunCall":
                    return "the return value of (" + this._getNodeName(e.name) + ")";
                  case "LookupVal":
                    return this._getNodeName(e.target) + '["' + this._getNodeName(e.val) + '"]';
                  case "Literal":
                    return e.value.toString();
                  default:
                    return "--expression--";
                }
              }, c.compileFunCall = function(e, i) {
                this._emit("(lineno = " + e.lineno + ", colno = " + e.colno + ", "), this._emit("runtime.callWrap("), this._compileExpression(e.name, i), this._emit(', "' + this._getNodeName(e.name).replace(/"/g, '\\"') + '", context, '), this._compileAggregate(e.args, i, "[", "])"), this._emit(")");
              }, c.compileFilter = function(e, i) {
                var r = e.name;
                this.assertType(r, m.Symbol), this._emit('env.getFilter("' + r.value + '").call(context, '), this._compileAggregate(e.args, i), this._emit(")");
              }, c.compileFilterAsync = function(e, i) {
                var r = e.name, u = e.symbol.value;
                this.assertType(r, m.Symbol), i.set(u, u), this._emit('env.getFilter("' + r.value + '").call(context, '), this._compileAggregate(e.args, i), this._emitLine(", " + this._makeCallback(u)), this._addScopeLevel();
              }, c.compileKeywordArgs = function(e, i) {
                this._emit("runtime.makeKeywordArgs("), this.compileDict(e, i), this._emit(")");
              }, c.compileSet = function(e, i) {
                var r = this, u = [];
                e.targets.forEach(function(l) {
                  var s = l.value, f = i.lookup(s);
                  f == null && (f = r._tmpid(), r._emitLine("var " + f + ";")), u.push(f);
                }), e.value ? (this._emit(u.join(" = ") + " = "), this._compileExpression(e.value, i), this._emitLine(";")) : (this._emit(u.join(" = ") + " = "), this.compile(e.body, i), this._emitLine(";")), e.targets.forEach(function(l, s) {
                  var f = u[s], p = l.value;
                  r._emitLine('frame.set("' + p + '", ' + f + ", true);"), r._emitLine("if(frame.topLevel) {"), r._emitLine('context.setVariable("' + p + '", ' + f + ");"), r._emitLine("}"), p.charAt(0) !== "_" && (r._emitLine("if(frame.topLevel) {"), r._emitLine('context.addExport("' + p + '", ' + f + ");"), r._emitLine("}"));
                });
              }, c.compileSwitch = function(e, i) {
                var r = this;
                this._emit("switch ("), this.compile(e.expr, i), this._emit(") {"), e.cases.forEach(function(u, l) {
                  r._emit("case "), r.compile(u.cond, i), r._emit(": "), r.compile(u.body, i), u.body.children.length && r._emitLine("break;");
                }), e.default && (this._emit("default:"), this.compile(e.default, i)), this._emit("}");
              }, c.compileIf = function(e, i, r) {
                var u = this;
                this._emit("if("), this._compileExpression(e.cond, i), this._emitLine(") {"), this._withScopedSyntax(function() {
                  u.compile(e.body, i), r && u._emit("cb()");
                }), e.else_ ? (this._emitLine(`}
else {`), this._withScopedSyntax(function() {
                  u.compile(e.else_, i), r && u._emit("cb()");
                })) : r && (this._emitLine(`}
else {`), this._emit("cb()")), this._emitLine("}");
              }, c.compileIfAsync = function(e, i) {
                this._emit("(function(cb) {"), this.compileIf(e, i, !0), this._emit("})(" + this._makeCallback()), this._addScopeLevel();
              }, c._emitLoopBindings = function(e, i, r, u) {
                var l = this, s = [{
                  name: "index",
                  val: r + " + 1"
                }, {
                  name: "index0",
                  val: r
                }, {
                  name: "revindex",
                  val: u + " - " + r
                }, {
                  name: "revindex0",
                  val: u + " - " + r + " - 1"
                }, {
                  name: "first",
                  val: r + " === 0"
                }, {
                  name: "last",
                  val: r + " === " + u + " - 1"
                }, {
                  name: "length",
                  val: u
                }];
                s.forEach(function(f) {
                  l._emitLine('frame.set("loop.' + f.name + '", ' + f.val + ");");
                });
              }, c.compileFor = function(e, i) {
                var r = this, u = this._tmpid(), l = this._tmpid(), s = this._tmpid();
                if (i = i.push(), this._emitLine("frame = frame.push();"), this._emit("var " + s + " = "), this._compileExpression(e.arr, i), this._emitLine(";"), this._emit("if(" + s + ") {"), this._emitLine(s + " = runtime.fromIterator(" + s + ");"), e.name instanceof m.Array) {
                  this._emitLine("var " + u + ";"), this._emitLine("if(runtime.isArray(" + s + ")) {"), this._emitLine("var " + l + " = " + s + ".length;"), this._emitLine("for(" + u + "=0; " + u + " < " + s + ".length; " + u + "++) {"), e.name.children.forEach(function(d, O) {
                    var v = r._tmpid();
                    r._emitLine("var " + v + " = " + s + "[" + u + "][" + O + "];"), r._emitLine('frame.set("' + d + '", ' + s + "[" + u + "][" + O + "]);"), i.set(e.name.children[O].value, v);
                  }), this._emitLoopBindings(e, s, u, l), this._withScopedSyntax(function() {
                    r.compile(e.body, i);
                  }), this._emitLine("}"), this._emitLine("} else {");
                  var f = e.name.children, p = f[0], x = f[1], L = this._tmpid(), S = this._tmpid();
                  i.set(p.value, L), i.set(x.value, S), this._emitLine(u + " = -1;"), this._emitLine("var " + l + " = runtime.keys(" + s + ").length;"), this._emitLine("for(var " + L + " in " + s + ") {"), this._emitLine(u + "++;"), this._emitLine("var " + S + " = " + s + "[" + L + "];"), this._emitLine('frame.set("' + p.value + '", ' + L + ");"), this._emitLine('frame.set("' + x.value + '", ' + S + ");"), this._emitLoopBindings(e, s, u, l), this._withScopedSyntax(function() {
                    r.compile(e.body, i);
                  }), this._emitLine("}"), this._emitLine("}");
                } else {
                  var C = this._tmpid();
                  i.set(e.name.value, C), this._emitLine("var " + l + " = " + s + ".length;"), this._emitLine("for(var " + u + "=0; " + u + " < " + s + ".length; " + u + "++) {"), this._emitLine("var " + C + " = " + s + "[" + u + "];"), this._emitLine('frame.set("' + e.name.value + '", ' + C + ");"), this._emitLoopBindings(e, s, u, l), this._withScopedSyntax(function() {
                    r.compile(e.body, i);
                  }), this._emitLine("}");
                }
                this._emitLine("}"), e.else_ && (this._emitLine("if (!" + l + ") {"), this.compile(e.else_, i), this._emitLine("}")), this._emitLine("frame = frame.pop();");
              }, c._compileAsyncLoop = function(e, i, r) {
                var u = this, l = this._tmpid(), s = this._tmpid(), f = this._tmpid(), p = r ? "asyncAll" : "asyncEach";
                if (i = i.push(), this._emitLine("frame = frame.push();"), this._emit("var " + f + " = runtime.fromIterator("), this._compileExpression(e.arr, i), this._emitLine(");"), e.name instanceof m.Array) {
                  var x = e.name.children.length;
                  this._emit("runtime." + p + "(" + f + ", " + x + ", function("), e.name.children.forEach(function(C) {
                    u._emit(C.value + ",");
                  }), this._emit(l + "," + s + ",next) {"), e.name.children.forEach(function(C) {
                    var d = C.value;
                    i.set(d, d), u._emitLine('frame.set("' + d + '", ' + d + ");");
                  });
                } else {
                  var L = e.name.value;
                  this._emitLine("runtime." + p + "(" + f + ", 1, function(" + L + ", " + l + ", " + s + ",next) {"), this._emitLine('frame.set("' + L + '", ' + L + ");"), i.set(L, L);
                }
                this._emitLoopBindings(e, f, l, s), this._withScopedSyntax(function() {
                  var C;
                  r && (C = u._pushBuffer()), u.compile(e.body, i), u._emitLine("next(" + l + (C ? "," + C : "") + ");"), r && u._popBuffer();
                });
                var S = this._tmpid();
                this._emitLine("}, " + this._makeCallback(S)), this._addScopeLevel(), r && this._emitLine(this.buffer + " += " + S + ";"), e.else_ && (this._emitLine("if (!" + f + ".length) {"), this.compile(e.else_, i), this._emitLine("}")), this._emitLine("frame = frame.pop();");
              }, c.compileAsyncEach = function(e, i) {
                this._compileAsyncLoop(e, i);
              }, c.compileAsyncAll = function(e, i) {
                this._compileAsyncLoop(e, i, !0);
              }, c._compileMacro = function(e, i) {
                var r = this, u = [], l = null, s = "macro_" + this._tmpid(), f = i !== void 0;
                e.args.children.forEach(function(d, O) {
                  O === e.args.children.length - 1 && d instanceof m.Dict ? l = d : (r.assertType(d, m.Symbol), u.push(d));
                });
                var p = [].concat(u.map(function(d) {
                  return "l_" + d.value;
                }), ["kwargs"]), x = u.map(function(d) {
                  return '"' + d.value + '"';
                }), L = (l && l.children || []).map(function(d) {
                  return '"' + d.key.value + '"';
                }), S;
                f ? S = i.push(!0) : S = new N(), this._emitLines("var " + s + " = runtime.makeMacro(", "[" + x.join(", ") + "], ", "[" + L.join(", ") + "], ", "function (" + p.join(", ") + ") {", "var callerFrame = frame;", "frame = " + (f ? "frame.push(true);" : "new runtime.Frame();"), "kwargs = kwargs || {};", 'if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {', 'frame.set("caller", kwargs.caller); }'), u.forEach(function(d) {
                  r._emitLine('frame.set("' + d.value + '", l_' + d.value + ");"), S.set(d.value, "l_" + d.value);
                }), l && l.children.forEach(function(d) {
                  var O = d.key.value;
                  r._emit('frame.set("' + O + '", '), r._emit('Object.prototype.hasOwnProperty.call(kwargs, "' + O + '")'), r._emit(' ? kwargs["' + O + '"] : '), r._compileExpression(d.value, S), r._emit(");");
                });
                var C = this._pushBuffer();
                return this._withScopedSyntax(function() {
                  r.compile(e.body, S);
                }), this._emitLine("frame = " + (f ? "frame.pop();" : "callerFrame;")), this._emitLine("return new runtime.SafeString(" + C + ");"), this._emitLine("});"), this._popBuffer(), s;
              }, c.compileMacro = function(e, i) {
                var r = this._compileMacro(e), u = e.name.value;
                i.set(u, r), i.parent ? this._emitLine('frame.set("' + u + '", ' + r + ");") : (e.name.value.charAt(0) !== "_" && this._emitLine('context.addExport("' + u + '");'), this._emitLine('context.setVariable("' + u + '", ' + r + ");"));
              }, c.compileCaller = function(e, i) {
                this._emit("(function (){");
                var r = this._compileMacro(e, i);
                this._emit("return " + r + ";})()");
              }, c._compileGetTemplate = function(e, i, r, u) {
                var l = this._tmpid(), s = this._templateName(), f = this._makeCallback(l), p = r ? "true" : "false", x = u ? "true" : "false";
                return this._emit("env.getTemplate("), this._compileExpression(e.template, i), this._emitLine(", " + p + ", " + s + ", " + x + ", " + f), l;
              }, c.compileImport = function(e, i) {
                var r = e.target.value, u = this._compileGetTemplate(e, i, !1, !1);
                this._addScopeLevel(), this._emitLine(u + ".getExported(" + (e.withContext ? "context.getVariables(), frame, " : "") + this._makeCallback(u)), this._addScopeLevel(), i.set(r, u), i.parent ? this._emitLine('frame.set("' + r + '", ' + u + ");") : this._emitLine('context.setVariable("' + r + '", ' + u + ");");
              }, c.compileFromImport = function(e, i) {
                var r = this, u = this._compileGetTemplate(e, i, !1, !1);
                this._addScopeLevel(), this._emitLine(u + ".getExported(" + (e.withContext ? "context.getVariables(), frame, " : "") + this._makeCallback(u)), this._addScopeLevel(), e.names.children.forEach(function(l) {
                  var s, f, p = r._tmpid();
                  l instanceof m.Pair ? (s = l.key.value, f = l.value.value) : (s = l.value, f = s), r._emitLine("if(Object.prototype.hasOwnProperty.call(" + u + ', "' + s + '")) {'), r._emitLine("var " + p + " = " + u + "." + s + ";"), r._emitLine("} else {"), r._emitLine(`cb(new Error("cannot import '` + s + `'")); return;`), r._emitLine("}"), i.set(f, p), i.parent ? r._emitLine('frame.set("' + f + '", ' + p + ");") : r._emitLine('context.setVariable("' + f + '", ' + p + ");");
                });
              }, c.compileBlock = function(e) {
                var i = this._tmpid();
                this.inBlock || this._emit('(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : '), this._emit('context.getBlock("' + e.name.value + '")'), this.inBlock || this._emit(")"), this._emitLine("(env, context, frame, runtime, " + this._makeCallback(i)), this._emitLine(this.buffer + " += " + i + ";"), this._addScopeLevel();
              }, c.compileSuper = function(e, i) {
                var r = e.blockName.value, u = e.symbol.value, l = this._makeCallback(u);
                this._emitLine('context.getSuper(env, "' + r + '", b_' + r + ", frame, runtime, " + l), this._emitLine(u + " = runtime.markSafe(" + u + ");"), this._addScopeLevel(), i.set(u, u);
              }, c.compileExtends = function(e, i) {
                var r = this._tmpid(), u = this._compileGetTemplate(e, i, !0, !1);
                this._emitLine("parentTemplate = " + u), this._emitLine("for(var " + r + " in parentTemplate.blocks) {"), this._emitLine("context.addBlock(" + r + ", parentTemplate.blocks[" + r + "]);"), this._emitLine("}"), this._addScopeLevel();
              }, c.compileInclude = function(e, i) {
                this._emitLine("var tasks = [];"), this._emitLine("tasks.push("), this._emitLine("function(callback) {");
                var r = this._compileGetTemplate(e, i, !1, e.ignoreMissing);
                this._emitLine("callback(null," + r + ");});"), this._emitLine("});");
                var u = this._tmpid();
                this._emitLine("tasks.push("), this._emitLine("function(template, callback){"), this._emitLine("template.render(context.getVariables(), frame, " + this._makeCallback(u)), this._emitLine("callback(null," + u + ");});"), this._emitLine("});"), this._emitLine("tasks.push("), this._emitLine("function(result, callback){"), this._emitLine(this.buffer + " += result;"), this._emitLine("callback(null);"), this._emitLine("});"), this._emitLine("env.waterfall(tasks, function(){"), this._addScopeLevel();
              }, c.compileTemplateData = function(e, i) {
                this.compileLiteral(e, i);
              }, c.compileCapture = function(e, i) {
                var r = this, u = this.buffer;
                this.buffer = "output", this._emitLine("(function() {"), this._emitLine('var output = "";'), this._withScopedSyntax(function() {
                  r.compile(e.body, i);
                }), this._emitLine("return output;"), this._emitLine("})()"), this.buffer = u;
              }, c.compileOutput = function(e, i) {
                var r = this, u = e.children;
                u.forEach(function(l) {
                  l instanceof m.TemplateData ? l.value && (r._emit(r.buffer + " += "), r.compileLiteral(l, i), r._emitLine(";")) : (r._emit(r.buffer + " += runtime.suppressValue("), r.throwOnUndefined && r._emit("runtime.ensureDefined("), r.compile(l, i), r.throwOnUndefined && r._emit("," + e.lineno + "," + e.colno + ")"), r._emit(`, env.opts.autoescape);
`));
                });
              }, c.compileRoot = function(e, i) {
                var r = this;
                i && this.fail("compileRoot: root node can't have frame"), i = new N(), this._emitFuncBegin(e, "root"), this._emitLine("var parentTemplate = null;"), this._compileChildren(e, i), this._emitLine("if(parentTemplate) {"), this._emitLine("parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);"), this._emitLine("} else {"), this._emitLine("cb(null, " + this.buffer + ");"), this._emitLine("}"), this._emitFuncEnd(!0), this.inBlock = !0;
                var u = [], l = e.findAll(m.Block);
                l.forEach(function(s, f) {
                  var p = s.name.value;
                  if (u.indexOf(p) !== -1)
                    throw new Error('Block "' + p + '" defined more than once.');
                  u.push(p), r._emitFuncBegin(s, "b_" + p);
                  var x = new N();
                  r._emitLine("var frame = frame.push(true);"), r.compile(s.body, x), r._emitFuncEnd();
                }), this._emitLine("return {"), l.forEach(function(s, f) {
                  var p = "b_" + s.name.value;
                  r._emitLine(p + ": " + p + ",");
                }), this._emitLine(`root: root
};`);
              }, c.compile = function(e, i) {
                var r = this["compile" + e.typename];
                r ? r.call(this, e, i) : this.fail("compile: Cannot compile node: " + e.typename, e.lineno, e.colno);
              }, c.getCode = function() {
                return this.codebuf.join("");
              }, y;
            })(t);
            F.exports = {
              compile: function(o, y, c, e, i) {
                i === void 0 && (i = {});
                var r = new a(e, i.throwOnUndefined), u = (c || []).map(function(s) {
                  return s.preprocess;
                }).filter(function(s) {
                  return !!s;
                }), l = u.reduce(function(s, f) {
                  return f(s);
                }, o);
                return r.compile(k.transform(h.parse(l, c, i), y, e)), r.getCode();
              },
              Compiler: a
            };
          }),
          /* 6 */
          /***/
          (function(F, R, T) {
            function g(w, K) {
              w.prototype = Object.create(K.prototype), w.prototype.constructor = w, E(w, K);
            }
            function E(w, K) {
              return E = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(P, N) {
                return P.__proto__ = N, P;
              }, E(w, K);
            }
            var h = T(4), k = T(1), m = k.EmitterObj;
            F.exports = /* @__PURE__ */ (function(w) {
              g(K, w);
              function K() {
                return w.apply(this, arguments) || this;
              }
              var P = K.prototype;
              return P.resolve = function(N, b) {
                return h.resolve(h.dirname(N), b);
              }, P.isRelative = function(N) {
                return N.indexOf("./") === 0 || N.indexOf("../") === 0;
              }, K;
            })(m);
          }),
          /* 7 */
          /***/
          (function(F, R, T) {
            function g(L, S) {
              L.prototype = Object.create(S.prototype), L.prototype.constructor = L, E(L, S);
            }
            function E(L, S) {
              return E = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(C, d) {
                return C.__proto__ = d, C;
              }, E(L, S);
            }
            var h = T(12), k = T(15), m = T(0), w = T(5), K = T(18), P = T(10), N = P.FileSystemLoader, b = P.WebLoader, t = P.PrecompiledLoader, n = T(20), a = T(21), o = T(1), y = o.Obj, c = o.EmitterObj, e = T(2), i = e.handleError, r = e.Frame, u = T(22);
            function l(L, S, C) {
              h(function() {
                L(S, C);
              });
            }
            var s = {
              type: "code",
              obj: {
                root: function(L, S, C, d, O) {
                  try {
                    O(null, "");
                  } catch (v) {
                    O(i(v, null, null));
                  }
                }
              }
            }, f = /* @__PURE__ */ (function(L) {
              g(S, L);
              function S() {
                return L.apply(this, arguments) || this;
              }
              var C = S.prototype;
              return C.init = function(d, O) {
                var v = this;
                O = this.opts = O || {}, this.opts.dev = !!O.dev, this.opts.autoescape = O.autoescape != null ? O.autoescape : !0, this.opts.throwOnUndefined = !!O.throwOnUndefined, this.opts.trimBlocks = !!O.trimBlocks, this.opts.lstripBlocks = !!O.lstripBlocks, this.loaders = [], d ? this.loaders = m.isArray(d) ? d : [d] : N ? this.loaders = [new N("views")] : b && (this.loaders = [new b("/views")]), typeof window < "u" && window.nunjucksPrecompiled && this.loaders.unshift(new t(window.nunjucksPrecompiled)), this._initLoaders(), this.globals = a(), this.filters = {}, this.tests = {}, this.asyncFilters = [], this.extensions = {}, this.extensionsList = [], m._entries(K).forEach(function(I) {
                  var B = I[0], j = I[1];
                  return v.addFilter(B, j);
                }), m._entries(n).forEach(function(I) {
                  var B = I[0], j = I[1];
                  return v.addTest(B, j);
                });
              }, C._initLoaders = function() {
                var d = this;
                this.loaders.forEach(function(O) {
                  O.cache = {}, typeof O.on == "function" && (O.on("update", function(v, I) {
                    O.cache[v] = null, d.emit("update", v, I, O);
                  }), O.on("load", function(v, I) {
                    d.emit("load", v, I, O);
                  }));
                });
              }, C.invalidateCache = function() {
                this.loaders.forEach(function(d) {
                  d.cache = {};
                });
              }, C.addExtension = function(d, O) {
                return O.__name = d, this.extensions[d] = O, this.extensionsList.push(O), this;
              }, C.removeExtension = function(d) {
                var O = this.getExtension(d);
                O && (this.extensionsList = m.without(this.extensionsList, O), delete this.extensions[d]);
              }, C.getExtension = function(d) {
                return this.extensions[d];
              }, C.hasExtension = function(d) {
                return !!this.extensions[d];
              }, C.addGlobal = function(d, O) {
                return this.globals[d] = O, this;
              }, C.getGlobal = function(d) {
                if (typeof this.globals[d] > "u")
                  throw new Error("global not found: " + d);
                return this.globals[d];
              }, C.addFilter = function(d, O, v) {
                var I = O;
                return v && this.asyncFilters.push(d), this.filters[d] = I, this;
              }, C.getFilter = function(d) {
                if (!this.filters[d])
                  throw new Error("filter not found: " + d);
                return this.filters[d];
              }, C.addTest = function(d, O) {
                return this.tests[d] = O, this;
              }, C.getTest = function(d) {
                if (!this.tests[d])
                  throw new Error("test not found: " + d);
                return this.tests[d];
              }, C.resolveTemplate = function(d, O, v) {
                var I = d.isRelative && O ? d.isRelative(v) : !1;
                return I && d.resolve ? d.resolve(O, v) : v;
              }, C.getTemplate = function(d, O, v, I, B) {
                var j = this, Z = this, Y = null;
                if (d && d.raw && (d = d.raw), m.isFunction(v) && (B = v, v = null, O = O || !1), m.isFunction(O) && (B = O, O = !1), d instanceof x)
                  Y = d;
                else {
                  if (typeof d != "string")
                    throw new Error("template names must be a string: " + d);
                  for (var Q = 0; Q < this.loaders.length; Q++) {
                    var le = this.loaders[Q];
                    if (Y = le.cache[this.resolveTemplate(le, v, d)], Y)
                      break;
                  }
                }
                if (Y)
                  if (O && Y.compile(), B) {
                    B(null, Y);
                    return;
                  } else
                    return Y;
                var oe, ee = function(V, G) {
                  if (!G && !V && !I && (V = new Error("template not found: " + d)), V)
                    if (B) {
                      B(V);
                      return;
                    } else
                      throw V;
                  var D;
                  G ? (D = new x(G.src, j, G.path, O), G.noCache || (G.loader.cache[d] = D)) : D = new x(s, j, "", O), B ? B(null, D) : oe = D;
                };
                return m.asyncIter(this.loaders, function(V, G, D, se) {
                  function fe(de, ae) {
                    de ? se(de) : ae ? (ae.loader = V, se(null, ae)) : D();
                  }
                  d = Z.resolveTemplate(V, v, d), V.async ? V.getSource(d, fe) : fe(null, V.getSource(d));
                }, ee), oe;
              }, C.express = function(d) {
                return u(this, d);
              }, C.render = function(d, O, v) {
                m.isFunction(O) && (v = O, O = null);
                var I = null;
                return this.getTemplate(d, function(B, j) {
                  if (B && v)
                    l(v, B);
                  else {
                    if (B)
                      throw B;
                    I = j.render(O, v);
                  }
                }), I;
              }, C.renderString = function(d, O, v, I) {
                m.isFunction(v) && (I = v, v = {}), v = v || {};
                var B = new x(d, this, v.path);
                return B.render(O, I);
              }, C.waterfall = function(d, O, v) {
                return k(d, O, v);
              }, S;
            })(c), p = /* @__PURE__ */ (function(L) {
              g(S, L);
              function S() {
                return L.apply(this, arguments) || this;
              }
              var C = S.prototype;
              return C.init = function(d, O, v) {
                var I = this;
                this.env = v || new f(), this.ctx = m.extend({}, d), this.blocks = {}, this.exported = [], m.keys(O).forEach(function(B) {
                  I.addBlock(B, O[B]);
                });
              }, C.lookup = function(d) {
                return d in this.env.globals && !(d in this.ctx) ? this.env.globals[d] : this.ctx[d];
              }, C.setVariable = function(d, O) {
                this.ctx[d] = O;
              }, C.getVariables = function() {
                return this.ctx;
              }, C.addBlock = function(d, O) {
                return this.blocks[d] = this.blocks[d] || [], this.blocks[d].push(O), this;
              }, C.getBlock = function(d) {
                if (!this.blocks[d])
                  throw new Error('unknown block "' + d + '"');
                return this.blocks[d][0];
              }, C.getSuper = function(d, O, v, I, B, j) {
                var Z = m.indexOf(this.blocks[O] || [], v), Y = this.blocks[O][Z + 1], Q = this;
                if (Z === -1 || !Y)
                  throw new Error('no super block available for "' + O + '"');
                Y(d, Q, I, B, j);
              }, C.addExport = function(d) {
                this.exported.push(d);
              }, C.getExported = function() {
                var d = this, O = {};
                return this.exported.forEach(function(v) {
                  O[v] = d.ctx[v];
                }), O;
              }, S;
            })(y), x = /* @__PURE__ */ (function(L) {
              g(S, L);
              function S() {
                return L.apply(this, arguments) || this;
              }
              var C = S.prototype;
              return C.init = function(d, O, v, I) {
                if (this.env = O || new f(), m.isObject(d))
                  switch (d.type) {
                    case "code":
                      this.tmplProps = d.obj;
                      break;
                    case "string":
                      this.tmplStr = d.obj;
                      break;
                    default:
                      throw new Error("Unexpected template object type " + d.type + "; expected 'code', or 'string'");
                  }
                else if (m.isString(d))
                  this.tmplStr = d;
                else
                  throw new Error("src must be a string or an object describing the source");
                if (this.path = v, I)
                  try {
                    this._compile();
                  } catch (B) {
                    throw m._prettifyError(this.path, this.env.opts.dev, B);
                  }
                else
                  this.compiled = !1;
              }, C.render = function(d, O, v) {
                var I = this;
                typeof d == "function" ? (v = d, d = {}) : typeof O == "function" && (v = O, O = null);
                var B = !O;
                try {
                  this.compile();
                } catch (oe) {
                  var j = m._prettifyError(this.path, this.env.opts.dev, oe);
                  if (v)
                    return l(v, j);
                  throw j;
                }
                var Z = new p(d || {}, this.blocks, this.env), Y = O ? O.push(!0) : new r();
                Y.topLevel = !0;
                var Q = null, le = !1;
                return this.rootRenderFunc(this.env, Z, Y, e, function(oe, ee) {
                  if (!(le && v && typeof ee < "u"))
                    if (oe && (oe = m._prettifyError(I.path, I.env.opts.dev, oe), le = !0), v)
                      B ? l(v, oe, ee) : v(oe, ee);
                    else {
                      if (oe)
                        throw oe;
                      Q = ee;
                    }
                }), Q;
              }, C.getExported = function(d, O, v) {
                typeof d == "function" && (v = d, d = {}), typeof O == "function" && (v = O, O = null);
                try {
                  this.compile();
                } catch (j) {
                  if (v)
                    return v(j);
                  throw j;
                }
                var I = O ? O.push() : new r();
                I.topLevel = !0;
                var B = new p(d || {}, this.blocks, this.env);
                this.rootRenderFunc(this.env, B, I, e, function(j) {
                  j ? v(j, null) : v(null, B.getExported());
                });
              }, C.compile = function() {
                this.compiled || this._compile();
              }, C._compile = function() {
                var d;
                if (this.tmplProps)
                  d = this.tmplProps;
                else {
                  var O = w.compile(this.tmplStr, this.env.asyncFilters, this.env.extensionsList, this.path, this.env.opts), v = new Function(O);
                  d = v();
                }
                this.blocks = this._getBlocks(d), this.rootRenderFunc = d.root, this.compiled = !0;
              }, C._getBlocks = function(d) {
                var O = {};
                return m.keys(d).forEach(function(v) {
                  v.slice(0, 2) === "b_" && (O[v.slice(2)] = d[v]);
                }), O;
              }, S;
            })(y);
            F.exports = {
              Environment: f,
              Template: x
            };
          }),
          /* 8 */
          /***/
          (function(F, R, T) {
            function g(P, N) {
              P.prototype = Object.create(N.prototype), P.prototype.constructor = P, E(P, N);
            }
            function E(P, N) {
              return E = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(b, t) {
                return b.__proto__ = t, b;
              }, E(P, N);
            }
            var h = T(9), k = T(3), m = T(1).Obj, w = T(0), K = /* @__PURE__ */ (function(P) {
              g(N, P);
              function N() {
                return P.apply(this, arguments) || this;
              }
              var b = N.prototype;
              return b.init = function(t) {
                this.tokens = t, this.peeked = null, this.breakOnBlocks = null, this.dropLeadingWhitespace = !1, this.extensions = [];
              }, b.nextToken = function(t) {
                var n;
                if (this.peeked)
                  if (!t && this.peeked.type === h.TOKEN_WHITESPACE)
                    this.peeked = null;
                  else
                    return n = this.peeked, this.peeked = null, n;
                if (n = this.tokens.nextToken(), !t)
                  for (; n && n.type === h.TOKEN_WHITESPACE; )
                    n = this.tokens.nextToken();
                return n;
              }, b.peekToken = function() {
                return this.peeked = this.peeked || this.nextToken(), this.peeked;
              }, b.pushToken = function(t) {
                if (this.peeked)
                  throw new Error("pushToken: can only push one token on between reads");
                this.peeked = t;
              }, b.error = function(t, n, a) {
                if (n === void 0 || a === void 0) {
                  var o = this.peekToken() || {};
                  n = o.lineno, a = o.colno;
                }
                return n !== void 0 && (n += 1), a !== void 0 && (a += 1), new w.TemplateError(t, n, a);
              }, b.fail = function(t, n, a) {
                throw this.error(t, n, a);
              }, b.skip = function(t) {
                var n = this.nextToken();
                return !n || n.type !== t ? (this.pushToken(n), !1) : !0;
              }, b.expect = function(t) {
                var n = this.nextToken();
                return n.type !== t && this.fail("expected " + t + ", got " + n.type, n.lineno, n.colno), n;
              }, b.skipValue = function(t, n) {
                var a = this.nextToken();
                return !a || a.type !== t || a.value !== n ? (this.pushToken(a), !1) : !0;
              }, b.skipSymbol = function(t) {
                return this.skipValue(h.TOKEN_SYMBOL, t);
              }, b.advanceAfterBlockEnd = function(t) {
                var n;
                return t || (n = this.peekToken(), n || this.fail("unexpected end of file"), n.type !== h.TOKEN_SYMBOL && this.fail("advanceAfterBlockEnd: expected symbol token or explicit name to be passed"), t = this.nextToken().value), n = this.nextToken(), n && n.type === h.TOKEN_BLOCK_END ? n.value.charAt(0) === "-" && (this.dropLeadingWhitespace = !0) : this.fail("expected block end in " + t + " statement"), n;
              }, b.advanceAfterVariableEnd = function() {
                var t = this.nextToken();
                t && t.type === h.TOKEN_VARIABLE_END ? this.dropLeadingWhitespace = t.value.charAt(t.value.length - this.tokens.tags.VARIABLE_END.length - 1) === "-" : (this.pushToken(t), this.fail("expected variable end"));
              }, b.parseFor = function() {
                var t = this.peekToken(), n, a;
                this.skipSymbol("for") ? (n = new k.For(t.lineno, t.colno), a = "endfor") : this.skipSymbol("asyncEach") ? (n = new k.AsyncEach(t.lineno, t.colno), a = "endeach") : this.skipSymbol("asyncAll") ? (n = new k.AsyncAll(t.lineno, t.colno), a = "endall") : this.fail("parseFor: expected for{Async}", t.lineno, t.colno), n.name = this.parsePrimary(), n.name instanceof k.Symbol || this.fail("parseFor: variable name expected for loop");
                var o = this.peekToken().type;
                if (o === h.TOKEN_COMMA) {
                  var y = n.name;
                  for (n.name = new k.Array(y.lineno, y.colno), n.name.addChild(y); this.skip(h.TOKEN_COMMA); ) {
                    var c = this.parsePrimary();
                    n.name.addChild(c);
                  }
                }
                return this.skipSymbol("in") || this.fail('parseFor: expected "in" keyword for loop', t.lineno, t.colno), n.arr = this.parseExpression(), this.advanceAfterBlockEnd(t.value), n.body = this.parseUntilBlocks(a, "else"), this.skipSymbol("else") && (this.advanceAfterBlockEnd("else"), n.else_ = this.parseUntilBlocks(a)), this.advanceAfterBlockEnd(), n;
              }, b.parseMacro = function() {
                var t = this.peekToken();
                this.skipSymbol("macro") || this.fail("expected macro");
                var n = this.parsePrimary(!0), a = this.parseSignature(), o = new k.Macro(t.lineno, t.colno, n, a);
                return this.advanceAfterBlockEnd(t.value), o.body = this.parseUntilBlocks("endmacro"), this.advanceAfterBlockEnd(), o;
              }, b.parseCall = function() {
                var t = this.peekToken();
                this.skipSymbol("call") || this.fail("expected call");
                var n = this.parseSignature(!0) || new k.NodeList(), a = this.parsePrimary();
                this.advanceAfterBlockEnd(t.value);
                var o = this.parseUntilBlocks("endcall");
                this.advanceAfterBlockEnd();
                var y = new k.Symbol(t.lineno, t.colno, "caller"), c = new k.Caller(t.lineno, t.colno, y, n, o), e = a.args.children;
                e[e.length - 1] instanceof k.KeywordArgs || e.push(new k.KeywordArgs());
                var i = e[e.length - 1];
                return i.addChild(new k.Pair(t.lineno, t.colno, y, c)), new k.Output(t.lineno, t.colno, [a]);
              }, b.parseWithContext = function() {
                var t = this.peekToken(), n = null;
                return this.skipSymbol("with") ? n = !0 : this.skipSymbol("without") && (n = !1), n !== null && (this.skipSymbol("context") || this.fail("parseFrom: expected context after with/without", t.lineno, t.colno)), n;
              }, b.parseImport = function() {
                var t = this.peekToken();
                this.skipSymbol("import") || this.fail("parseImport: expected import", t.lineno, t.colno);
                var n = this.parseExpression();
                this.skipSymbol("as") || this.fail('parseImport: expected "as" keyword', t.lineno, t.colno);
                var a = this.parseExpression(), o = this.parseWithContext(), y = new k.Import(t.lineno, t.colno, n, a, o);
                return this.advanceAfterBlockEnd(t.value), y;
              }, b.parseFrom = function() {
                var t = this.peekToken();
                this.skipSymbol("from") || this.fail("parseFrom: expected from");
                var n = this.parseExpression();
                this.skipSymbol("import") || this.fail("parseFrom: expected import", t.lineno, t.colno);
                for (var a = new k.NodeList(), o; ; ) {
                  var y = this.peekToken();
                  if (y.type === h.TOKEN_BLOCK_END) {
                    a.children.length || this.fail("parseFrom: Expected at least one import name", t.lineno, t.colno), y.value.charAt(0) === "-" && (this.dropLeadingWhitespace = !0), this.nextToken();
                    break;
                  }
                  a.children.length > 0 && !this.skip(h.TOKEN_COMMA) && this.fail("parseFrom: expected comma", t.lineno, t.colno);
                  var c = this.parsePrimary();
                  if (c.value.charAt(0) === "_" && this.fail("parseFrom: names starting with an underscore cannot be imported", c.lineno, c.colno), this.skipSymbol("as")) {
                    var e = this.parsePrimary();
                    a.addChild(new k.Pair(c.lineno, c.colno, c, e));
                  } else
                    a.addChild(c);
                  o = this.parseWithContext();
                }
                return new k.FromImport(t.lineno, t.colno, n, a, o);
              }, b.parseBlock = function() {
                var t = this.peekToken();
                this.skipSymbol("block") || this.fail("parseBlock: expected block", t.lineno, t.colno);
                var n = new k.Block(t.lineno, t.colno);
                n.name = this.parsePrimary(), n.name instanceof k.Symbol || this.fail("parseBlock: variable name expected", t.lineno, t.colno), this.advanceAfterBlockEnd(t.value), n.body = this.parseUntilBlocks("endblock"), this.skipSymbol("endblock"), this.skipSymbol(n.name.value);
                var a = this.peekToken();
                return a || this.fail("parseBlock: expected endblock, got end of file"), this.advanceAfterBlockEnd(a.value), n;
              }, b.parseExtends = function() {
                var t = "extends", n = this.peekToken();
                this.skipSymbol(t) || this.fail("parseTemplateRef: expected " + t);
                var a = new k.Extends(n.lineno, n.colno);
                return a.template = this.parseExpression(), this.advanceAfterBlockEnd(n.value), a;
              }, b.parseInclude = function() {
                var t = "include", n = this.peekToken();
                this.skipSymbol(t) || this.fail("parseInclude: expected " + t);
                var a = new k.Include(n.lineno, n.colno);
                return a.template = this.parseExpression(), this.skipSymbol("ignore") && this.skipSymbol("missing") && (a.ignoreMissing = !0), this.advanceAfterBlockEnd(n.value), a;
              }, b.parseIf = function() {
                var t = this.peekToken(), n;
                this.skipSymbol("if") || this.skipSymbol("elif") || this.skipSymbol("elseif") ? n = new k.If(t.lineno, t.colno) : this.skipSymbol("ifAsync") ? n = new k.IfAsync(t.lineno, t.colno) : this.fail("parseIf: expected if, elif, or elseif", t.lineno, t.colno), n.cond = this.parseExpression(), this.advanceAfterBlockEnd(t.value), n.body = this.parseUntilBlocks("elif", "elseif", "else", "endif");
                var a = this.peekToken();
                switch (a && a.value) {
                  case "elseif":
                  case "elif":
                    n.else_ = this.parseIf();
                    break;
                  case "else":
                    this.advanceAfterBlockEnd(), n.else_ = this.parseUntilBlocks("endif"), this.advanceAfterBlockEnd();
                    break;
                  case "endif":
                    n.else_ = null, this.advanceAfterBlockEnd();
                    break;
                  default:
                    this.fail("parseIf: expected elif, else, or endif, got end of file");
                }
                return n;
              }, b.parseSet = function() {
                var t = this.peekToken();
                this.skipSymbol("set") || this.fail("parseSet: expected set", t.lineno, t.colno);
                for (var n = new k.Set(t.lineno, t.colno, []), a; (a = this.parsePrimary()) && (n.targets.push(a), !!this.skip(h.TOKEN_COMMA)); )
                  ;
                return this.skipValue(h.TOKEN_OPERATOR, "=") ? (n.value = this.parseExpression(), this.advanceAfterBlockEnd(t.value)) : this.skip(h.TOKEN_BLOCK_END) ? (n.body = new k.Capture(t.lineno, t.colno, this.parseUntilBlocks("endset")), n.value = null, this.advanceAfterBlockEnd()) : this.fail("parseSet: expected = or block end in set tag", t.lineno, t.colno), n;
              }, b.parseSwitch = function() {
                var t = "switch", n = "endswitch", a = "case", o = "default", y = this.peekToken();
                !this.skipSymbol(t) && !this.skipSymbol(a) && !this.skipSymbol(o) && this.fail('parseSwitch: expected "switch," "case" or "default"', y.lineno, y.colno);
                var c = this.parseExpression();
                this.advanceAfterBlockEnd(t), this.parseUntilBlocks(a, o, n);
                var e = this.peekToken(), i = [], r;
                do {
                  this.skipSymbol(a);
                  var u = this.parseExpression();
                  this.advanceAfterBlockEnd(t);
                  var l = this.parseUntilBlocks(a, o, n);
                  i.push(new k.Case(e.line, e.col, u, l)), e = this.peekToken();
                } while (e && e.value === a);
                switch (e.value) {
                  case o:
                    this.advanceAfterBlockEnd(), r = this.parseUntilBlocks(n), this.advanceAfterBlockEnd();
                    break;
                  case n:
                    this.advanceAfterBlockEnd();
                    break;
                  default:
                    this.fail('parseSwitch: expected "case," "default" or "endswitch," got EOF.');
                }
                return new k.Switch(y.lineno, y.colno, c, i, r);
              }, b.parseStatement = function() {
                var t = this.peekToken(), n;
                if (t.type !== h.TOKEN_SYMBOL && this.fail("tag name expected", t.lineno, t.colno), this.breakOnBlocks && w.indexOf(this.breakOnBlocks, t.value) !== -1)
                  return null;
                switch (t.value) {
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
                      for (var a = 0; a < this.extensions.length; a++) {
                        var o = this.extensions[a];
                        if (w.indexOf(o.tags || [], t.value) !== -1)
                          return o.parse(this, k, h);
                      }
                    this.fail("unknown block tag: " + t.value, t.lineno, t.colno);
                }
                return n;
              }, b.parseRaw = function(t) {
                t = t || "raw";
                for (var n = "end" + t, a = new RegExp("([\\s\\S]*?){%\\s*(" + t + "|" + n + ")\\s*(?=%})%}"), o = 1, y = "", c = null, e = this.advanceAfterBlockEnd(); (c = this.tokens._extractRegex(a)) && o > 0; ) {
                  var i = c[0], r = c[1], u = c[2];
                  u === t ? o += 1 : u === n && (o -= 1), o === 0 ? (y += r, this.tokens.backN(i.length - r.length)) : y += i;
                }
                return new k.Output(e.lineno, e.colno, [new k.TemplateData(e.lineno, e.colno, y)]);
              }, b.parsePostfix = function(t) {
                for (var n, a = this.peekToken(); a; ) {
                  if (a.type === h.TOKEN_LEFT_PAREN)
                    t = new k.FunCall(a.lineno, a.colno, t, this.parseSignature());
                  else if (a.type === h.TOKEN_LEFT_BRACKET)
                    n = this.parseAggregate(), n.children.length > 1 && this.fail("invalid index"), t = new k.LookupVal(a.lineno, a.colno, t, n.children[0]);
                  else if (a.type === h.TOKEN_OPERATOR && a.value === ".") {
                    this.nextToken();
                    var o = this.nextToken();
                    o.type !== h.TOKEN_SYMBOL && this.fail("expected name as lookup value, got " + o.value, o.lineno, o.colno), n = new k.Literal(o.lineno, o.colno, o.value), t = new k.LookupVal(a.lineno, a.colno, t, n);
                  } else
                    break;
                  a = this.peekToken();
                }
                return t;
              }, b.parseExpression = function() {
                var t = this.parseInlineIf();
                return t;
              }, b.parseInlineIf = function() {
                var t = this.parseOr();
                if (this.skipSymbol("if")) {
                  var n = this.parseOr(), a = t;
                  t = new k.InlineIf(t.lineno, t.colno), t.body = a, t.cond = n, this.skipSymbol("else") ? t.else_ = this.parseOr() : t.else_ = null;
                }
                return t;
              }, b.parseOr = function() {
                for (var t = this.parseAnd(); this.skipSymbol("or"); ) {
                  var n = this.parseAnd();
                  t = new k.Or(t.lineno, t.colno, t, n);
                }
                return t;
              }, b.parseAnd = function() {
                for (var t = this.parseNot(); this.skipSymbol("and"); ) {
                  var n = this.parseNot();
                  t = new k.And(t.lineno, t.colno, t, n);
                }
                return t;
              }, b.parseNot = function() {
                var t = this.peekToken();
                return this.skipSymbol("not") ? new k.Not(t.lineno, t.colno, this.parseNot()) : this.parseIn();
              }, b.parseIn = function() {
                for (var t = this.parseIs(); ; ) {
                  var n = this.nextToken();
                  if (!n)
                    break;
                  var a = n.type === h.TOKEN_SYMBOL && n.value === "not";
                  if (a || this.pushToken(n), this.skipSymbol("in")) {
                    var o = this.parseIs();
                    t = new k.In(t.lineno, t.colno, t, o), a && (t = new k.Not(t.lineno, t.colno, t));
                  } else {
                    a && this.pushToken(n);
                    break;
                  }
                }
                return t;
              }, b.parseIs = function() {
                var t = this.parseCompare();
                if (this.skipSymbol("is")) {
                  var n = this.skipSymbol("not"), a = this.parseCompare();
                  t = new k.Is(t.lineno, t.colno, t, a), n && (t = new k.Not(t.lineno, t.colno, t));
                }
                return t;
              }, b.parseCompare = function() {
                for (var t = ["==", "===", "!=", "!==", "<", ">", "<=", ">="], n = this.parseConcat(), a = []; ; ) {
                  var o = this.nextToken();
                  if (o)
                    if (t.indexOf(o.value) !== -1)
                      a.push(new k.CompareOperand(o.lineno, o.colno, this.parseConcat(), o.value));
                    else {
                      this.pushToken(o);
                      break;
                    }
                  else break;
                }
                return a.length ? new k.Compare(a[0].lineno, a[0].colno, n, a) : n;
              }, b.parseConcat = function() {
                for (var t = this.parseAdd(); this.skipValue(h.TOKEN_TILDE, "~"); ) {
                  var n = this.parseAdd();
                  t = new k.Concat(t.lineno, t.colno, t, n);
                }
                return t;
              }, b.parseAdd = function() {
                for (var t = this.parseSub(); this.skipValue(h.TOKEN_OPERATOR, "+"); ) {
                  var n = this.parseSub();
                  t = new k.Add(t.lineno, t.colno, t, n);
                }
                return t;
              }, b.parseSub = function() {
                for (var t = this.parseMul(); this.skipValue(h.TOKEN_OPERATOR, "-"); ) {
                  var n = this.parseMul();
                  t = new k.Sub(t.lineno, t.colno, t, n);
                }
                return t;
              }, b.parseMul = function() {
                for (var t = this.parseDiv(); this.skipValue(h.TOKEN_OPERATOR, "*"); ) {
                  var n = this.parseDiv();
                  t = new k.Mul(t.lineno, t.colno, t, n);
                }
                return t;
              }, b.parseDiv = function() {
                for (var t = this.parseFloorDiv(); this.skipValue(h.TOKEN_OPERATOR, "/"); ) {
                  var n = this.parseFloorDiv();
                  t = new k.Div(t.lineno, t.colno, t, n);
                }
                return t;
              }, b.parseFloorDiv = function() {
                for (var t = this.parseMod(); this.skipValue(h.TOKEN_OPERATOR, "//"); ) {
                  var n = this.parseMod();
                  t = new k.FloorDiv(t.lineno, t.colno, t, n);
                }
                return t;
              }, b.parseMod = function() {
                for (var t = this.parsePow(); this.skipValue(h.TOKEN_OPERATOR, "%"); ) {
                  var n = this.parsePow();
                  t = new k.Mod(t.lineno, t.colno, t, n);
                }
                return t;
              }, b.parsePow = function() {
                for (var t = this.parseUnary(); this.skipValue(h.TOKEN_OPERATOR, "**"); ) {
                  var n = this.parseUnary();
                  t = new k.Pow(t.lineno, t.colno, t, n);
                }
                return t;
              }, b.parseUnary = function(t) {
                var n = this.peekToken(), a;
                return this.skipValue(h.TOKEN_OPERATOR, "-") ? a = new k.Neg(n.lineno, n.colno, this.parseUnary(!0)) : this.skipValue(h.TOKEN_OPERATOR, "+") ? a = new k.Pos(n.lineno, n.colno, this.parseUnary(!0)) : a = this.parsePrimary(), t || (a = this.parseFilter(a)), a;
              }, b.parsePrimary = function(t) {
                var n = this.nextToken(), a, o = null;
                if (n ? n.type === h.TOKEN_STRING ? a = n.value : n.type === h.TOKEN_INT ? a = parseInt(n.value, 10) : n.type === h.TOKEN_FLOAT ? a = parseFloat(n.value) : n.type === h.TOKEN_BOOLEAN ? n.value === "true" ? a = !0 : n.value === "false" ? a = !1 : this.fail("invalid boolean: " + n.value, n.lineno, n.colno) : n.type === h.TOKEN_NONE ? a = null : n.type === h.TOKEN_REGEX && (a = new RegExp(n.value.body, n.value.flags)) : this.fail("expected expression, got end of file"), a !== void 0 ? o = new k.Literal(n.lineno, n.colno, a) : n.type === h.TOKEN_SYMBOL ? o = new k.Symbol(n.lineno, n.colno, n.value) : (this.pushToken(n), o = this.parseAggregate()), t || (o = this.parsePostfix(o)), o)
                  return o;
                throw this.error("unexpected token: " + n.value, n.lineno, n.colno);
              }, b.parseFilterName = function() {
                for (var t = this.expect(h.TOKEN_SYMBOL), n = t.value; this.skipValue(h.TOKEN_OPERATOR, "."); )
                  n += "." + this.expect(h.TOKEN_SYMBOL).value;
                return new k.Symbol(t.lineno, t.colno, n);
              }, b.parseFilterArgs = function(t) {
                if (this.peekToken().type === h.TOKEN_LEFT_PAREN) {
                  var n = this.parsePostfix(t);
                  return n.args.children;
                }
                return [];
              }, b.parseFilter = function(t) {
                for (; this.skip(h.TOKEN_PIPE); ) {
                  var n = this.parseFilterName();
                  t = new k.Filter(n.lineno, n.colno, n, new k.NodeList(n.lineno, n.colno, [t].concat(this.parseFilterArgs(t))));
                }
                return t;
              }, b.parseFilterStatement = function() {
                var t = this.peekToken();
                this.skipSymbol("filter") || this.fail("parseFilterStatement: expected filter");
                var n = this.parseFilterName(), a = this.parseFilterArgs(n);
                this.advanceAfterBlockEnd(t.value);
                var o = new k.Capture(n.lineno, n.colno, this.parseUntilBlocks("endfilter"));
                this.advanceAfterBlockEnd();
                var y = new k.Filter(n.lineno, n.colno, n, new k.NodeList(n.lineno, n.colno, [o].concat(a)));
                return new k.Output(n.lineno, n.colno, [y]);
              }, b.parseAggregate = function() {
                var t = this.nextToken(), n;
                switch (t.type) {
                  case h.TOKEN_LEFT_PAREN:
                    n = new k.Group(t.lineno, t.colno);
                    break;
                  case h.TOKEN_LEFT_BRACKET:
                    n = new k.Array(t.lineno, t.colno);
                    break;
                  case h.TOKEN_LEFT_CURLY:
                    n = new k.Dict(t.lineno, t.colno);
                    break;
                  default:
                    return null;
                }
                for (; ; ) {
                  var a = this.peekToken().type;
                  if (a === h.TOKEN_RIGHT_PAREN || a === h.TOKEN_RIGHT_BRACKET || a === h.TOKEN_RIGHT_CURLY) {
                    this.nextToken();
                    break;
                  }
                  if (n.children.length > 0 && (this.skip(h.TOKEN_COMMA) || this.fail("parseAggregate: expected comma after expression", t.lineno, t.colno)), n instanceof k.Dict) {
                    var o = this.parsePrimary();
                    this.skip(h.TOKEN_COLON) || this.fail("parseAggregate: expected colon after dict key", t.lineno, t.colno);
                    var y = this.parseExpression();
                    n.addChild(new k.Pair(o.lineno, o.colno, o, y));
                  } else {
                    var c = this.parseExpression();
                    n.addChild(c);
                  }
                }
                return n;
              }, b.parseSignature = function(t, n) {
                var a = this.peekToken();
                if (!n && a.type !== h.TOKEN_LEFT_PAREN) {
                  if (t)
                    return null;
                  this.fail("expected arguments", a.lineno, a.colno);
                }
                a.type === h.TOKEN_LEFT_PAREN && (a = this.nextToken());
                for (var o = new k.NodeList(a.lineno, a.colno), y = new k.KeywordArgs(a.lineno, a.colno), c = !1; ; ) {
                  if (a = this.peekToken(), !n && a.type === h.TOKEN_RIGHT_PAREN) {
                    this.nextToken();
                    break;
                  } else if (n && a.type === h.TOKEN_BLOCK_END)
                    break;
                  if (c && !this.skip(h.TOKEN_COMMA))
                    this.fail("parseSignature: expected comma after expression", a.lineno, a.colno);
                  else {
                    var e = this.parseExpression();
                    this.skipValue(h.TOKEN_OPERATOR, "=") ? y.addChild(new k.Pair(e.lineno, e.colno, e, this.parseExpression())) : o.addChild(e);
                  }
                  c = !0;
                }
                return y.children.length && o.addChild(y), o;
              }, b.parseUntilBlocks = function() {
                for (var t = this.breakOnBlocks, n = arguments.length, a = new Array(n), o = 0; o < n; o++)
                  a[o] = arguments[o];
                this.breakOnBlocks = a;
                var y = this.parse();
                return this.breakOnBlocks = t, y;
              }, b.parseNodes = function() {
                for (var t, n = []; t = this.nextToken(); )
                  if (t.type === h.TOKEN_DATA) {
                    var a = t.value, o = this.peekToken(), y = o && o.value;
                    this.dropLeadingWhitespace && (a = a.replace(/^\s*/, ""), this.dropLeadingWhitespace = !1), o && (o.type === h.TOKEN_BLOCK_START && y.charAt(y.length - 1) === "-" || o.type === h.TOKEN_VARIABLE_START && y.charAt(this.tokens.tags.VARIABLE_START.length) === "-" || o.type === h.TOKEN_COMMENT && y.charAt(this.tokens.tags.COMMENT_START.length) === "-") && (a = a.replace(/\s*$/, "")), n.push(new k.Output(t.lineno, t.colno, [new k.TemplateData(t.lineno, t.colno, a)]));
                  } else if (t.type === h.TOKEN_BLOCK_START) {
                    this.dropLeadingWhitespace = !1;
                    var c = this.parseStatement();
                    if (!c)
                      break;
                    n.push(c);
                  } else if (t.type === h.TOKEN_VARIABLE_START) {
                    var e = this.parseExpression();
                    this.dropLeadingWhitespace = !1, this.advanceAfterVariableEnd(), n.push(new k.Output(t.lineno, t.colno, [e]));
                  } else t.type === h.TOKEN_COMMENT ? this.dropLeadingWhitespace = t.value.charAt(t.value.length - this.tokens.tags.COMMENT_END.length - 1) === "-" : this.fail("Unexpected token at top-level: " + t.type, t.lineno, t.colno);
                return n;
              }, b.parse = function() {
                return new k.NodeList(0, 0, this.parseNodes());
              }, b.parseAsRoot = function() {
                return new k.Root(0, 0, this.parseNodes());
              }, N;
            })(m);
            F.exports = {
              parse: function(P, N, b) {
                var t = new K(h.lex(P, b));
                return N !== void 0 && (t.extensions = N), t.parseAsRoot();
              },
              Parser: K
            };
          }),
          /* 9 */
          /***/
          (function(F, R, T) {
            var g = T(0), E = ` 
	\r `, h = "()[]{}%*-+~/#,:|.<>=!", k = "0123456789", m = "{%", w = "%}", K = "{{", P = "}}", N = "{#", b = "#}", t = "string", n = "whitespace", a = "data", o = "block-start", y = "block-end", c = "variable-start", e = "variable-end", i = "comment", r = "left-paren", u = "right-paren", l = "left-bracket", s = "right-bracket", f = "left-curly", p = "right-curly", x = "operator", L = "comma", S = "colon", C = "tilde", d = "pipe", O = "int", v = "float", I = "boolean", B = "none", j = "symbol", Z = "special", Y = "regex";
            function Q(oe, ee, V, G) {
              return {
                type: oe,
                value: ee,
                lineno: V,
                colno: G
              };
            }
            var le = /* @__PURE__ */ (function() {
              function oe(V, G) {
                this.str = V, this.index = 0, this.len = V.length, this.lineno = 0, this.colno = 0, this.in_code = !1, G = G || {};
                var D = G.tags || {};
                this.tags = {
                  BLOCK_START: D.blockStart || m,
                  BLOCK_END: D.blockEnd || w,
                  VARIABLE_START: D.variableStart || K,
                  VARIABLE_END: D.variableEnd || P,
                  COMMENT_START: D.commentStart || N,
                  COMMENT_END: D.commentEnd || b
                }, this.trimBlocks = !!G.trimBlocks, this.lstripBlocks = !!G.lstripBlocks;
              }
              var ee = oe.prototype;
              return ee.nextToken = function() {
                var V = this.lineno, G = this.colno, D;
                if (this.in_code) {
                  var se = this.current();
                  if (this.isFinished())
                    return null;
                  if (se === '"' || se === "'")
                    return Q(t, this._parseString(se), V, G);
                  if (D = this._extract(E))
                    return Q(n, D, V, G);
                  if ((D = this._extractString(this.tags.BLOCK_END)) || (D = this._extractString("-" + this.tags.BLOCK_END)))
                    return this.in_code = !1, this.trimBlocks && (se = this.current(), se === `
` ? this.forward() : se === "\r" && (this.forward(), se = this.current(), se === `
` ? this.forward() : this.back())), Q(y, D, V, G);
                  if ((D = this._extractString(this.tags.VARIABLE_END)) || (D = this._extractString("-" + this.tags.VARIABLE_END)))
                    return this.in_code = !1, Q(e, D, V, G);
                  if (se === "r" && this.str.charAt(this.index + 1) === "/") {
                    this.forwardN(2);
                    for (var fe = ""; !this.isFinished(); )
                      if (this.current() === "/" && this.previous() !== "\\") {
                        this.forward();
                        break;
                      } else
                        fe += this.current(), this.forward();
                    for (var de = ["g", "i", "m", "y"], ae = ""; !this.isFinished(); ) {
                      var _e = de.indexOf(this.current()) !== -1;
                      if (_e)
                        ae += this.current(), this.forward();
                      else
                        break;
                    }
                    return Q(Y, {
                      body: fe,
                      flags: ae
                    }, V, G);
                  } else if (h.indexOf(se) !== -1) {
                    this.forward();
                    var _ = ["==", "===", "!=", "!==", "<=", ">=", "//", "**"], A = se + this.current(), M;
                    switch (g.indexOf(_, A) !== -1 && (this.forward(), se = A, g.indexOf(_, A + this.current()) !== -1 && (se = A + this.current(), this.forward())), se) {
                      case "(":
                        M = r;
                        break;
                      case ")":
                        M = u;
                        break;
                      case "[":
                        M = l;
                        break;
                      case "]":
                        M = s;
                        break;
                      case "{":
                        M = f;
                        break;
                      case "}":
                        M = p;
                        break;
                      case ",":
                        M = L;
                        break;
                      case ":":
                        M = S;
                        break;
                      case "~":
                        M = C;
                        break;
                      case "|":
                        M = d;
                        break;
                      default:
                        M = x;
                    }
                    return Q(M, se, V, G);
                  } else if (D = this._extractUntil(E + h), D.match(/^[-+]?[0-9]+$/))
                    if (this.current() === ".") {
                      this.forward();
                      var U = this._extract(k);
                      return Q(v, D + "." + U, V, G);
                    } else
                      return Q(O, D, V, G);
                  else {
                    if (D.match(/^(true|false)$/))
                      return Q(I, D, V, G);
                    if (D === "none" || D === "null")
                      return Q(B, D, V, G);
                    if (D)
                      return Q(j, D, V, G);
                    throw new Error("Unexpected value while parsing: " + D);
                  }
                } else {
                  var X = this.tags.BLOCK_START.charAt(0) + this.tags.VARIABLE_START.charAt(0) + this.tags.COMMENT_START.charAt(0) + this.tags.COMMENT_END.charAt(0);
                  if (this.isFinished())
                    return null;
                  if ((D = this._extractString(this.tags.BLOCK_START + "-")) || (D = this._extractString(this.tags.BLOCK_START)))
                    return this.in_code = !0, Q(o, D, V, G);
                  if ((D = this._extractString(this.tags.VARIABLE_START + "-")) || (D = this._extractString(this.tags.VARIABLE_START)))
                    return this.in_code = !0, Q(c, D, V, G);
                  D = "";
                  var z, ne = !1;
                  for (this._matches(this.tags.COMMENT_START) && (ne = !0, D = this._extractString(this.tags.COMMENT_START)); (z = this._extractUntil(X)) !== null; )
                    if (D += z, (this._matches(this.tags.BLOCK_START) || this._matches(this.tags.VARIABLE_START) || this._matches(this.tags.COMMENT_START)) && !ne) {
                      if (this.lstripBlocks && this._matches(this.tags.BLOCK_START) && this.colno > 0 && this.colno <= D.length) {
                        var H = D.slice(-this.colno);
                        if (/^\s+$/.test(H) && (D = D.slice(0, -this.colno), !D.length))
                          return this.nextToken();
                      }
                      break;
                    } else if (this._matches(this.tags.COMMENT_END)) {
                      if (!ne)
                        throw new Error("unexpected end of comment");
                      D += this._extractString(this.tags.COMMENT_END);
                      break;
                    } else
                      D += this.current(), this.forward();
                  if (z === null && ne)
                    throw new Error("expected end of comment, got end of file");
                  return Q(ne ? i : a, D, V, G);
                }
              }, ee._parseString = function(V) {
                this.forward();
                for (var G = ""; !this.isFinished() && this.current() !== V; ) {
                  var D = this.current();
                  if (D === "\\") {
                    switch (this.forward(), this.current()) {
                      case "n":
                        G += `
`;
                        break;
                      case "t":
                        G += "	";
                        break;
                      case "r":
                        G += "\r";
                        break;
                      default:
                        G += this.current();
                    }
                    this.forward();
                  } else
                    G += D, this.forward();
                }
                return this.forward(), G;
              }, ee._matches = function(V) {
                if (this.index + V.length > this.len)
                  return null;
                var G = this.str.slice(this.index, this.index + V.length);
                return G === V;
              }, ee._extractString = function(V) {
                return this._matches(V) ? (this.forwardN(V.length), V) : null;
              }, ee._extractUntil = function(V) {
                return this._extractMatching(!0, V || "");
              }, ee._extract = function(V) {
                return this._extractMatching(!1, V);
              }, ee._extractMatching = function(V, G) {
                if (this.isFinished())
                  return null;
                var D = G.indexOf(this.current());
                if (V && D === -1 || !V && D !== -1) {
                  var se = this.current();
                  this.forward();
                  for (var fe = G.indexOf(this.current()); (V && fe === -1 || !V && fe !== -1) && !this.isFinished(); )
                    se += this.current(), this.forward(), fe = G.indexOf(this.current());
                  return se;
                }
                return "";
              }, ee._extractRegex = function(V) {
                var G = this.currentStr().match(V);
                return G ? (this.forwardN(G[0].length), G) : null;
              }, ee.isFinished = function() {
                return this.index >= this.len;
              }, ee.forwardN = function(V) {
                for (var G = 0; G < V; G++)
                  this.forward();
              }, ee.forward = function() {
                this.index++, this.previous() === `
` ? (this.lineno++, this.colno = 0) : this.colno++;
              }, ee.backN = function(V) {
                for (var G = 0; G < V; G++)
                  this.back();
              }, ee.back = function() {
                if (this.index--, this.current() === `
`) {
                  this.lineno--;
                  var V = this.src.lastIndexOf(`
`, this.index - 1);
                  V === -1 ? this.colno = this.index : this.colno = this.index - V;
                } else
                  this.colno--;
              }, ee.current = function() {
                return this.isFinished() ? "" : this.str.charAt(this.index);
              }, ee.currentStr = function() {
                return this.isFinished() ? "" : this.str.substr(this.index);
              }, ee.previous = function() {
                return this.str.charAt(this.index - 1);
              }, oe;
            })();
            F.exports = {
              lex: function(oe, ee) {
                return new le(oe, ee);
              },
              TOKEN_STRING: t,
              TOKEN_WHITESPACE: n,
              TOKEN_DATA: a,
              TOKEN_BLOCK_START: o,
              TOKEN_BLOCK_END: y,
              TOKEN_VARIABLE_START: c,
              TOKEN_VARIABLE_END: e,
              TOKEN_COMMENT: i,
              TOKEN_LEFT_PAREN: r,
              TOKEN_RIGHT_PAREN: u,
              TOKEN_LEFT_BRACKET: l,
              TOKEN_RIGHT_BRACKET: s,
              TOKEN_LEFT_CURLY: f,
              TOKEN_RIGHT_CURLY: p,
              TOKEN_OPERATOR: x,
              TOKEN_COMMA: L,
              TOKEN_COLON: S,
              TOKEN_TILDE: C,
              TOKEN_PIPE: d,
              TOKEN_INT: O,
              TOKEN_FLOAT: v,
              TOKEN_BOOLEAN: I,
              TOKEN_NONE: B,
              TOKEN_SYMBOL: j,
              TOKEN_SPECIAL: Z,
              TOKEN_REGEX: Y
            };
          }),
          /* 10 */
          /***/
          (function(F, R, T) {
            function g(K, P) {
              K.prototype = Object.create(P.prototype), K.prototype.constructor = K, E(K, P);
            }
            function E(K, P) {
              return E = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(N, b) {
                return N.__proto__ = b, N;
              }, E(K, P);
            }
            var h = T(6), k = T(19), m = k.PrecompiledLoader, w = /* @__PURE__ */ (function(K) {
              g(P, K);
              function P(b, t) {
                var n;
                return n = K.call(this) || this, n.baseURL = b || ".", t = t || {}, n.useCache = !!t.useCache, n.async = !!t.async, n;
              }
              var N = P.prototype;
              return N.resolve = function(b, t) {
                throw new Error("relative templates not support in the browser yet");
              }, N.getSource = function(b, t) {
                var n = this, a = this.useCache, o;
                return this.fetch(this.baseURL + "/" + b, function(y, c) {
                  if (y)
                    if (t)
                      t(y.content);
                    else if (y.status === 404)
                      o = null;
                    else
                      throw y.content;
                  else
                    o = {
                      src: c,
                      path: b,
                      noCache: !a
                    }, n.emit("load", b, o), t && t(null, o);
                }), o;
              }, N.fetch = function(b, t) {
                if (typeof window > "u")
                  throw new Error("WebLoader can only by used in a browser");
                var n = new XMLHttpRequest(), a = !0;
                n.onreadystatechange = function() {
                  n.readyState === 4 && a && (a = !1, n.status === 0 || n.status === 200 ? t(null, n.responseText) : t({
                    status: n.status,
                    content: n.responseText
                  }));
                }, b += (b.indexOf("?") === -1 ? "?" : "&") + "s=" + (/* @__PURE__ */ new Date()).getTime(), n.open("GET", b, this.async), n.send();
              }, P;
            })(h);
            F.exports = {
              WebLoader: w,
              PrecompiledLoader: m
            };
          }),
          /* 11 */
          /***/
          (function(F, R, T) {
            var g = T(0), E = T(7), h = E.Environment, k = E.Template, m = T(6), w = T(10), K = T(23), P = T(5), N = T(8), b = T(9), t = T(2), n = T(3), a = T(25), o;
            function y(c, e) {
              e = e || {}, g.isObject(c) && (e = c, c = null);
              var i;
              return w.FileSystemLoader ? i = new w.FileSystemLoader(c, {
                watch: e.watch,
                noCache: e.noCache
              }) : w.WebLoader && (i = new w.WebLoader(c, {
                useCache: e.web && e.web.useCache,
                async: e.web && e.web.async
              })), o = new h(i, e), e && e.express && o.express(e.express), o;
            }
            F.exports = {
              Environment: h,
              Template: k,
              Loader: m,
              FileSystemLoader: w.FileSystemLoader,
              NodeResolveLoader: w.NodeResolveLoader,
              PrecompiledLoader: w.PrecompiledLoader,
              WebLoader: w.WebLoader,
              compiler: P,
              parser: N,
              lexer: b,
              runtime: t,
              lib: g,
              nodes: n,
              installJinjaCompat: a,
              configure: y,
              reset: function() {
                o = void 0;
              },
              compile: function(c, e, i, r) {
                return o || y(), new k(c, e, i, r);
              },
              render: function(c, e, i) {
                return o || y(), o.render(c, e, i);
              },
              renderString: function(c, e, i) {
                return o || y(), o.renderString(c, e, i);
              },
              precompile: K ? K.precompile : void 0,
              precompileString: K ? K.precompileString : void 0
            };
          }),
          /* 12 */
          /***/
          (function(F, R, T) {
            var g = T(13), E = [], h = [], k = g.makeRequestCallFromTimer(m);
            function m() {
              if (h.length)
                throw h.shift();
            }
            F.exports = w;
            function w(P) {
              var N;
              E.length ? N = E.pop() : N = new K(), N.task = P, g(N);
            }
            function K() {
              this.task = null;
            }
            K.prototype.call = function() {
              try {
                this.task.call();
              } catch (P) {
                w.onerror ? w.onerror(P) : (h.push(P), k());
              } finally {
                this.task = null, E[E.length] = this;
              }
            };
          }),
          /* 13 */
          /***/
          (function(F, R, T) {
            (function(g) {
              F.exports = E;
              function E(n) {
                h.length || k(), h[h.length] = n;
              }
              var h = [], k, m = 0, w = 1024;
              function K() {
                for (; m < h.length; ) {
                  var n = m;
                  if (m = m + 1, h[n].call(), m > w) {
                    for (var a = 0, o = h.length - m; a < o; a++)
                      h[a] = h[a + m];
                    h.length -= m, m = 0;
                  }
                }
                h.length = 0, m = 0;
              }
              var P = typeof g < "u" ? g : self, N = P.MutationObserver || P.WebKitMutationObserver;
              typeof N == "function" ? k = b(K) : k = t(K), E.requestFlush = k;
              function b(n) {
                var a = 1, o = new N(n), y = document.createTextNode("");
                return o.observe(y, { characterData: !0 }), function() {
                  a = -a, y.data = a;
                };
              }
              function t(n) {
                return function() {
                  var a = setTimeout(y, 0), o = setInterval(y, 50);
                  function y() {
                    clearTimeout(a), clearInterval(o), n();
                  }
                };
              }
              E.makeRequestCallFromTimer = t;
            }).call(R, T(14));
          }),
          /* 14 */
          /***/
          (function(F, R) {
            var T;
            T = /* @__PURE__ */ (function() {
              return this;
            })();
            try {
              T = T || Function("return this")() || (0, eval)("this");
            } catch {
              typeof window == "object" && (T = window);
            }
            F.exports = T;
          }),
          /* 15 */
          /***/
          (function(F, R, T) {
            var g, E;
            (function(h) {
              var k = function() {
                var N = Array.prototype.slice.call(arguments);
                typeof N[0] == "function" && N[0].apply(null, N.splice(1));
              }, m = function(N) {
                typeof setImmediate == "function" ? setImmediate(N) : typeof process < "u" && process.nextTick ? process.nextTick(N) : setTimeout(N, 0);
              }, w = function(N) {
                var b = function(t) {
                  var n = function() {
                    return N.length && N[t].apply(null, arguments), n.next();
                  };
                  return n.next = function() {
                    return t < N.length - 1 ? b(t + 1) : null;
                  }, n;
                };
                return b(0);
              }, K = Array.isArray || function(N) {
                return Object.prototype.toString.call(N) === "[object Array]";
              }, P = function(N, b, t) {
                var n = t ? m : k;
                if (b = b || function() {
                }, !K(N)) {
                  var a = new Error("First argument to waterfall must be an array of functions");
                  return b(a);
                }
                if (!N.length)
                  return b();
                var o = function(y) {
                  return function(c) {
                    if (c)
                      b.apply(null, arguments), b = function() {
                      };
                    else {
                      var e = Array.prototype.slice.call(arguments, 1), i = y.next();
                      i ? e.push(o(i)) : e.push(b), n(function() {
                        y.apply(null, e);
                      });
                    }
                  };
                };
                o(w(N))();
              };
              g = [], E = (function() {
                return P;
              }).apply(R, g), E !== void 0 && (F.exports = E);
            })();
          }),
          /* 16 */
          /***/
          (function(F, R, T) {
            var g = typeof Reflect == "object" ? Reflect : null, E = g && typeof g.apply == "function" ? g.apply : function(l, s, f) {
              return Function.prototype.apply.call(l, s, f);
            }, h;
            g && typeof g.ownKeys == "function" ? h = g.ownKeys : Object.getOwnPropertySymbols ? h = function(l) {
              return Object.getOwnPropertyNames(l).concat(Object.getOwnPropertySymbols(l));
            } : h = function(l) {
              return Object.getOwnPropertyNames(l);
            };
            function k(l) {
              console && console.warn && console.warn(l);
            }
            var m = Number.isNaN || function(l) {
              return l !== l;
            };
            function w() {
              w.init.call(this);
            }
            F.exports = w, F.exports.once = i, w.EventEmitter = w, w.prototype._events = void 0, w.prototype._eventsCount = 0, w.prototype._maxListeners = void 0;
            var K = 10;
            function P(l) {
              if (typeof l != "function")
                throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof l);
            }
            Object.defineProperty(w, "defaultMaxListeners", {
              enumerable: !0,
              get: function() {
                return K;
              },
              set: function(l) {
                if (typeof l != "number" || l < 0 || m(l))
                  throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + l + ".");
                K = l;
              }
            }), w.init = function() {
              (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
            }, w.prototype.setMaxListeners = function(l) {
              if (typeof l != "number" || l < 0 || m(l))
                throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + l + ".");
              return this._maxListeners = l, this;
            };
            function N(l) {
              return l._maxListeners === void 0 ? w.defaultMaxListeners : l._maxListeners;
            }
            w.prototype.getMaxListeners = function() {
              return N(this);
            }, w.prototype.emit = function(l) {
              for (var s = [], f = 1; f < arguments.length; f++) s.push(arguments[f]);
              var p = l === "error", x = this._events;
              if (x !== void 0)
                p = p && x.error === void 0;
              else if (!p)
                return !1;
              if (p) {
                var L;
                if (s.length > 0 && (L = s[0]), L instanceof Error)
                  throw L;
                var S = new Error("Unhandled error." + (L ? " (" + L.message + ")" : ""));
                throw S.context = L, S;
              }
              var C = x[l];
              if (C === void 0)
                return !1;
              if (typeof C == "function")
                E(C, this, s);
              else
                for (var d = C.length, O = y(C, d), f = 0; f < d; ++f)
                  E(O[f], this, s);
              return !0;
            };
            function b(l, s, f, p) {
              var x, L, S;
              if (P(f), L = l._events, L === void 0 ? (L = l._events = /* @__PURE__ */ Object.create(null), l._eventsCount = 0) : (L.newListener !== void 0 && (l.emit(
                "newListener",
                s,
                f.listener ? f.listener : f
              ), L = l._events), S = L[s]), S === void 0)
                S = L[s] = f, ++l._eventsCount;
              else if (typeof S == "function" ? S = L[s] = p ? [f, S] : [S, f] : p ? S.unshift(f) : S.push(f), x = N(l), x > 0 && S.length > x && !S.warned) {
                S.warned = !0;
                var C = new Error("Possible EventEmitter memory leak detected. " + S.length + " " + String(s) + " listeners added. Use emitter.setMaxListeners() to increase limit");
                C.name = "MaxListenersExceededWarning", C.emitter = l, C.type = s, C.count = S.length, k(C);
              }
              return l;
            }
            w.prototype.addListener = function(l, s) {
              return b(this, l, s, !1);
            }, w.prototype.on = w.prototype.addListener, w.prototype.prependListener = function(l, s) {
              return b(this, l, s, !0);
            };
            function t() {
              if (!this.fired)
                return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
            }
            function n(l, s, f) {
              var p = { fired: !1, wrapFn: void 0, target: l, type: s, listener: f }, x = t.bind(p);
              return x.listener = f, p.wrapFn = x, x;
            }
            w.prototype.once = function(l, s) {
              return P(s), this.on(l, n(this, l, s)), this;
            }, w.prototype.prependOnceListener = function(l, s) {
              return P(s), this.prependListener(l, n(this, l, s)), this;
            }, w.prototype.removeListener = function(l, s) {
              var f, p, x, L, S;
              if (P(s), p = this._events, p === void 0)
                return this;
              if (f = p[l], f === void 0)
                return this;
              if (f === s || f.listener === s)
                --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete p[l], p.removeListener && this.emit("removeListener", l, f.listener || s));
              else if (typeof f != "function") {
                for (x = -1, L = f.length - 1; L >= 0; L--)
                  if (f[L] === s || f[L].listener === s) {
                    S = f[L].listener, x = L;
                    break;
                  }
                if (x < 0)
                  return this;
                x === 0 ? f.shift() : c(f, x), f.length === 1 && (p[l] = f[0]), p.removeListener !== void 0 && this.emit("removeListener", l, S || s);
              }
              return this;
            }, w.prototype.off = w.prototype.removeListener, w.prototype.removeAllListeners = function(l) {
              var s, f, p;
              if (f = this._events, f === void 0)
                return this;
              if (f.removeListener === void 0)
                return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : f[l] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete f[l]), this;
              if (arguments.length === 0) {
                var x = Object.keys(f), L;
                for (p = 0; p < x.length; ++p)
                  L = x[p], L !== "removeListener" && this.removeAllListeners(L);
                return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
              }
              if (s = f[l], typeof s == "function")
                this.removeListener(l, s);
              else if (s !== void 0)
                for (p = s.length - 1; p >= 0; p--)
                  this.removeListener(l, s[p]);
              return this;
            };
            function a(l, s, f) {
              var p = l._events;
              if (p === void 0)
                return [];
              var x = p[s];
              return x === void 0 ? [] : typeof x == "function" ? f ? [x.listener || x] : [x] : f ? e(x) : y(x, x.length);
            }
            w.prototype.listeners = function(l) {
              return a(this, l, !0);
            }, w.prototype.rawListeners = function(l) {
              return a(this, l, !1);
            }, w.listenerCount = function(l, s) {
              return typeof l.listenerCount == "function" ? l.listenerCount(s) : o.call(l, s);
            }, w.prototype.listenerCount = o;
            function o(l) {
              var s = this._events;
              if (s !== void 0) {
                var f = s[l];
                if (typeof f == "function")
                  return 1;
                if (f !== void 0)
                  return f.length;
              }
              return 0;
            }
            w.prototype.eventNames = function() {
              return this._eventsCount > 0 ? h(this._events) : [];
            };
            function y(l, s) {
              for (var f = new Array(s), p = 0; p < s; ++p)
                f[p] = l[p];
              return f;
            }
            function c(l, s) {
              for (; s + 1 < l.length; s++)
                l[s] = l[s + 1];
              l.pop();
            }
            function e(l) {
              for (var s = new Array(l.length), f = 0; f < s.length; ++f)
                s[f] = l[f].listener || l[f];
              return s;
            }
            function i(l, s) {
              return new Promise(function(f, p) {
                function x(S) {
                  l.removeListener(s, L), p(S);
                }
                function L() {
                  typeof l.removeListener == "function" && l.removeListener("error", x), f([].slice.call(arguments));
                }
                u(l, s, L, { once: !0 }), s !== "error" && r(l, x, { once: !0 });
              });
            }
            function r(l, s, f) {
              typeof l.on == "function" && u(l, "error", s, f);
            }
            function u(l, s, f, p) {
              if (typeof l.on == "function")
                p.once ? l.once(s, f) : l.on(s, f);
              else if (typeof l.addEventListener == "function")
                l.addEventListener(s, function x(L) {
                  p.once && l.removeEventListener(s, x), f(L);
                });
              else
                throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof l);
            }
          }),
          /* 17 */
          /***/
          (function(F, R, T) {
            var g = T(3), E = T(0), h = 0;
            function k() {
              return "hole_" + h++;
            }
            function m(o, y) {
              for (var c = null, e = 0; e < o.length; e++) {
                var i = y(o[e]);
                i !== o[e] && (c || (c = o.slice()), c[e] = i);
              }
              return c || o;
            }
            function w(o, y, c) {
              if (!(o instanceof g.Node))
                return o;
              if (!c) {
                var e = y(o);
                if (e && e !== o)
                  return e;
              }
              if (o instanceof g.NodeList) {
                var i = m(o.children, function(f) {
                  return w(f, y, c);
                });
                i !== o.children && (o = new g[o.typename](o.lineno, o.colno, i));
              } else if (o instanceof g.CallExtension) {
                var r = w(o.args, y, c), u = m(o.contentArgs, function(f) {
                  return w(f, y, c);
                });
                (r !== o.args || u !== o.contentArgs) && (o = new g[o.typename](o.extName, o.prop, r, u));
              } else {
                var l = o.fields.map(function(f) {
                  return o[f];
                }), s = m(l, function(f) {
                  return w(f, y, c);
                });
                s !== l && (o = new g[o.typename](o.lineno, o.colno), s.forEach(function(f, p) {
                  o[o.fields[p]] = f;
                }));
              }
              return c && y(o) || o;
            }
            function K(o, y) {
              return w(o, y, !0);
            }
            function P(o, y, c) {
              var e = [], i = K(c ? o[c] : o, function(r) {
                var u;
                return r instanceof g.Block ? r : ((r instanceof g.Filter && E.indexOf(y, r.name.value) !== -1 || r instanceof g.CallExtensionAsync) && (u = new g.Symbol(r.lineno, r.colno, k()), e.push(new g.FilterAsync(r.lineno, r.colno, r.name, r.args, u))), u);
              });
              return c ? o[c] = i : o = i, e.length ? (e.push(o), new g.NodeList(o.lineno, o.colno, e)) : o;
            }
            function N(o, y) {
              return K(o, function(c) {
                return c instanceof g.Output ? P(c, y) : c instanceof g.Set ? P(c, y, "value") : c instanceof g.For ? P(c, y, "arr") : c instanceof g.If ? P(c, y, "cond") : c instanceof g.CallExtension ? P(c, y, "args") : void 0;
              });
            }
            function b(o) {
              return w(o, function(y) {
                if (y instanceof g.Block) {
                  var c = !1, e = k();
                  y.body = w(y.body, function(i) {
                    if (i instanceof g.FunCall && i.name.value === "super")
                      return c = !0, new g.Symbol(i.lineno, i.colno, e);
                  }), c && y.body.children.unshift(new g.Super(0, 0, y.name, new g.Symbol(0, 0, e)));
                }
              });
            }
            function t(o) {
              return K(o, function(y) {
                if (!(!(y instanceof g.If) && !(y instanceof g.For))) {
                  var c = !1;
                  if (w(y, function(e) {
                    if (e instanceof g.FilterAsync || e instanceof g.IfAsync || e instanceof g.AsyncEach || e instanceof g.AsyncAll || e instanceof g.CallExtensionAsync)
                      return c = !0, e;
                  }), c) {
                    if (y instanceof g.If)
                      return new g.IfAsync(y.lineno, y.colno, y.cond, y.body, y.else_);
                    if (y instanceof g.For && !(y instanceof g.AsyncAll))
                      return new g.AsyncEach(y.lineno, y.colno, y.arr, y.name, y.body, y.else_);
                  }
                }
              });
            }
            function n(o, y) {
              return t(b(N(o, y)));
            }
            function a(o, y) {
              return n(o, y || []);
            }
            F.exports = {
              transform: a
            };
          }),
          /* 18 */
          /***/
          (function(F, h, T) {
            var g = T(0), E = T(2), h = F.exports = {};
            function k(_, A) {
              return _ == null || _ === !1 ? A : _;
            }
            h.abs = Math.abs;
            function m(_) {
              return _ !== _;
            }
            function w(_, A, M) {
              var U, X = [], z = [];
              for (U = 0; U < _.length; U++)
                U % A === 0 && z.length && (X.push(z), z = []), z.push(_[U]);
              if (z.length) {
                if (M)
                  for (U = z.length; U < A; U++)
                    z.push(M);
                X.push(z);
              }
              return X;
            }
            h.batch = w;
            function K(_) {
              _ = k(_, "");
              var A = _.toLowerCase();
              return E.copySafeness(_, A.charAt(0).toUpperCase() + A.slice(1));
            }
            h.capitalize = K;
            function P(_, A) {
              if (_ = k(_, ""), A = A || 80, _.length >= A)
                return _;
              var M = A - _.length, U = g.repeat(" ", M / 2 - M % 2), X = g.repeat(" ", M / 2);
              return E.copySafeness(_, U + _ + X);
            }
            h.center = P;
            function N(_, A, M) {
              return M ? _ || A : _ !== void 0 ? _ : A;
            }
            h.default = N;
            function b(_, A, M) {
              if (!g.isObject(_))
                throw new g.TemplateError("dictsort filter: val must be an object");
              var U = [];
              for (var X in _)
                U.push([X, _[X]]);
              var z;
              if (M === void 0 || M === "key")
                z = 0;
              else if (M === "value")
                z = 1;
              else
                throw new g.TemplateError("dictsort filter: You can only sort by either key or value");
              return U.sort(function(ne, H) {
                var ce = ne[z], he = H[z];
                return A || (g.isString(ce) && (ce = ce.toUpperCase()), g.isString(he) && (he = he.toUpperCase())), ce > he ? 1 : ce === he ? 0 : -1;
              }), U;
            }
            h.dictsort = b;
            function t(_, A) {
              return JSON.stringify(_, null, A);
            }
            h.dump = t;
            function n(_) {
              return _ instanceof E.SafeString ? _ : (_ = _ ?? "", E.markSafe(g.escape(_.toString())));
            }
            h.escape = n;
            function a(_) {
              return _ instanceof E.SafeString ? _ : (_ = _ ?? "", E.markSafe(_.toString()));
            }
            h.safe = a;
            function o(_) {
              return _[0];
            }
            h.first = o;
            function y(_) {
              return _ = _ ?? "", E.markSafe(g.escape(_.toString()));
            }
            h.forceescape = y;
            function c(_, A) {
              return g.groupBy(_, A, this.env.opts.throwOnUndefined);
            }
            h.groupby = c;
            function e(_, A, M) {
              if (_ = k(_, ""), _ === "")
                return "";
              A = A || 4;
              var U = _.split(`
`), X = g.repeat(" ", A), z = U.map(function(ne, H) {
                return H === 0 && !M ? ne : "" + X + ne;
              }).join(`
`);
              return E.copySafeness(_, z);
            }
            h.indent = e;
            function i(_, A, M) {
              return A = A || "", M && (_ = g.map(_, function(U) {
                return U[M];
              })), _.join(A);
            }
            h.join = i;
            function r(_) {
              return _[_.length - 1];
            }
            h.last = r;
            function u(_) {
              var A = k(_, "");
              return A !== void 0 ? typeof Map == "function" && A instanceof Map || typeof Set == "function" && A instanceof Set ? A.size : g.isObject(A) && !(A instanceof E.SafeString) ? g.keys(A).length : A.length : 0;
            }
            h.length = u;
            function l(_) {
              if (g.isString(_))
                return _.split("");
              if (g.isObject(_))
                return g._entries(_ || {}).map(function(A) {
                  var M = A[0], U = A[1];
                  return {
                    key: M,
                    value: U
                  };
                });
              if (g.isArray(_))
                return _;
              throw new g.TemplateError("list filter: type not iterable");
            }
            h.list = l;
            function s(_) {
              return _ = k(_, ""), _.toLowerCase();
            }
            h.lower = s;
            function f(_) {
              return _ == null ? "" : E.copySafeness(_, _.replace(/\r\n|\n/g, `<br />
`));
            }
            h.nl2br = f;
            function p(_) {
              return _[Math.floor(Math.random() * _.length)];
            }
            h.random = p;
            function x(_) {
              function A(M, U, X) {
                U === void 0 && (U = "truthy");
                var z = this, ne = z.env.getTest(U);
                return g.toArray(M).filter(function(H) {
                  return ne.call(z, H, X) === _;
                });
              }
              return A;
            }
            h.reject = x(!1);
            function L(_, A) {
              return _.filter(function(M) {
                return !M[A];
              });
            }
            h.rejectattr = L, h.select = x(!0);
            function S(_, A) {
              return _.filter(function(M) {
                return !!M[A];
              });
            }
            h.selectattr = S;
            function C(_, A, M, U) {
              var X = _;
              if (A instanceof RegExp)
                return _.replace(A, M);
              typeof U > "u" && (U = -1);
              var z = "";
              if (typeof A == "number")
                A = "" + A;
              else if (typeof A != "string")
                return _;
              if (typeof _ == "number" && (_ = "" + _), typeof _ != "string" && !(_ instanceof E.SafeString))
                return _;
              if (A === "")
                return z = M + _.split("").join(M) + M, E.copySafeness(_, z);
              var ne = _.indexOf(A);
              if (U === 0 || ne === -1)
                return _;
              for (var H = 0, ce = 0; ne > -1 && (U === -1 || ce < U); )
                z += _.substring(H, ne) + M, H = ne + A.length, ce++, ne = _.indexOf(A, H);
              return H < _.length && (z += _.substring(H)), E.copySafeness(X, z);
            }
            h.replace = C;
            function d(_) {
              var A;
              return g.isString(_) ? A = l(_) : A = g.map(_, function(M) {
                return M;
              }), A.reverse(), g.isString(_) ? E.copySafeness(_, A.join("")) : A;
            }
            h.reverse = d;
            function O(_, A, M) {
              A = A || 0;
              var U = Math.pow(10, A), X;
              return M === "ceil" ? X = Math.ceil : M === "floor" ? X = Math.floor : X = Math.round, X(_ * U) / U;
            }
            h.round = O;
            function v(_, A, M) {
              for (var U = Math.floor(_.length / A), X = _.length % A, z = [], ne = 0, H = 0; H < A; H++) {
                var ce = ne + H * U;
                H < X && ne++;
                var he = ne + (H + 1) * U, pe = _.slice(ce, he);
                M && H >= X && pe.push(M), z.push(pe);
              }
              return z;
            }
            h.slice = v;
            function I(_, A, M) {
              return M === void 0 && (M = 0), A && (_ = g.map(_, function(U) {
                return U[A];
              })), M + _.reduce(function(U, X) {
                return U + X;
              }, 0);
            }
            h.sum = I, h.sort = E.makeMacro(["value", "reverse", "case_sensitive", "attribute"], [], function(_, A, M, U) {
              var X = this, z = g.map(_, function(H) {
                return H;
              }), ne = g.getAttrGetter(U);
              return z.sort(function(H, ce) {
                var he = U ? ne(H) : H, pe = U ? ne(ce) : ce;
                if (X.env.opts.throwOnUndefined && U && (he === void 0 || pe === void 0))
                  throw new TypeError('sort: attribute "' + U + '" resolved to undefined');
                return !M && g.isString(he) && g.isString(pe) && (he = he.toLowerCase(), pe = pe.toLowerCase()), he < pe ? A ? 1 : -1 : he > pe ? A ? -1 : 1 : 0;
              }), z;
            });
            function B(_) {
              return E.copySafeness(_, _);
            }
            h.string = B;
            function j(_, A) {
              _ = k(_, "");
              var M = /<\/?([a-z][a-z0-9]*)\b[^>]*>|<!--[\s\S]*?-->/gi, U = Y(_.replace(M, "")), X = "";
              return A ? X = U.replace(/^ +| +$/gm, "").replace(/ +/g, " ").replace(/(\r\n)/g, `
`).replace(/\n\n\n+/g, `

`) : X = U.replace(/\s+/gi, " "), E.copySafeness(_, X);
            }
            h.striptags = j;
            function Z(_) {
              _ = k(_, "");
              var A = _.split(" ").map(function(M) {
                return K(M);
              });
              return E.copySafeness(_, A.join(" "));
            }
            h.title = Z;
            function Y(_) {
              return E.copySafeness(_, _.replace(/^\s*|\s*$/g, ""));
            }
            h.trim = Y;
            function Q(_, A, M, U) {
              var X = _;
              if (_ = k(_, ""), A = A || 255, _.length <= A)
                return _;
              if (M)
                _ = _.substring(0, A);
              else {
                var z = _.lastIndexOf(" ", A);
                z === -1 && (z = A), _ = _.substring(0, z);
              }
              return _ += U ?? "...", E.copySafeness(X, _);
            }
            h.truncate = Q;
            function le(_) {
              return _ = k(_, ""), _.toUpperCase();
            }
            h.upper = le;
            function oe(_) {
              var A = encodeURIComponent;
              if (g.isString(_))
                return A(_);
              var M = g.isArray(_) ? _ : g._entries(_);
              return M.map(function(U) {
                var X = U[0], z = U[1];
                return A(X) + "=" + A(z);
              }).join("&");
            }
            h.urlencode = oe;
            var ee = /^(?:\(|<|&lt;)?(.*?)(?:\.|,|\)|\n|&gt;)?$/, V = /^[\w.!#$%&'*+\-\/=?\^`{|}~]+@[a-z\d\-]+(\.[a-z\d\-]+)+$/i, G = /^https?:\/\/.*$/, D = /^www\./, se = /\.(?:org|net|com)(?:\:|\/|$)/;
            function fe(_, A, M) {
              m(A) && (A = 1 / 0);
              var U = M === !0 ? ' rel="nofollow"' : "", X = _.split(/(\s+)/).filter(function(z) {
                return z && z.length;
              }).map(function(z) {
                var ne = z.match(ee), H = ne ? ne[1] : z, ce = H.substr(0, A);
                return G.test(H) ? '<a href="' + H + '"' + U + ">" + ce + "</a>" : D.test(H) ? '<a href="http://' + H + '"' + U + ">" + ce + "</a>" : V.test(H) ? '<a href="mailto:' + H + '">' + H + "</a>" : se.test(H) ? '<a href="http://' + H + '"' + U + ">" + ce + "</a>" : z;
              });
              return X.join("");
            }
            h.urlize = fe;
            function de(_) {
              _ = k(_, "");
              var A = _ ? _.match(/\w+/g) : null;
              return A ? A.length : null;
            }
            h.wordcount = de;
            function ae(_, A) {
              var M = parseFloat(_);
              return m(M) ? A : M;
            }
            h.float = ae;
            var _e = E.makeMacro(["value", "default", "base"], [], function(_, A, M) {
              M === void 0 && (M = 10);
              var U = parseInt(_, M);
              return m(U) ? A : U;
            });
            h.int = _e, h.d = h.default, h.e = h.escape;
          }),
          /* 19 */
          /***/
          (function(F, R, T) {
            function g(m, w) {
              m.prototype = Object.create(w.prototype), m.prototype.constructor = m, E(m, w);
            }
            function E(m, w) {
              return E = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(K, P) {
                return K.__proto__ = P, K;
              }, E(m, w);
            }
            var h = T(6), k = /* @__PURE__ */ (function(m) {
              g(w, m);
              function w(P) {
                var N;
                return N = m.call(this) || this, N.precompiled = P || {}, N;
              }
              var K = w.prototype;
              return K.getSource = function(P) {
                return this.precompiled[P] ? {
                  src: {
                    type: "code",
                    obj: this.precompiled[P]
                  },
                  path: P
                } : null;
              }, w;
            })(h);
            F.exports = {
              PrecompiledLoader: k
            };
          }),
          /* 20 */
          /***/
          (function(F, R, T) {
            var g = T(2).SafeString;
            function E(p) {
              return typeof p == "function";
            }
            R.callable = E;
            function h(p) {
              return p !== void 0;
            }
            R.defined = h;
            function k(p, x) {
              return p % x === 0;
            }
            R.divisibleby = k;
            function m(p) {
              return p instanceof g;
            }
            R.escaped = m;
            function w(p, x) {
              return p === x;
            }
            R.equalto = w, R.eq = R.equalto, R.sameas = R.equalto;
            function K(p) {
              return p % 2 === 0;
            }
            R.even = K;
            function P(p) {
              return !p;
            }
            R.falsy = P;
            function N(p, x) {
              return p >= x;
            }
            R.ge = N;
            function b(p, x) {
              return p > x;
            }
            R.greaterthan = b, R.gt = R.greaterthan;
            function t(p, x) {
              return p <= x;
            }
            R.le = t;
            function n(p, x) {
              return p < x;
            }
            R.lessthan = n, R.lt = R.lessthan;
            function a(p) {
              return p.toLowerCase() === p;
            }
            R.lower = a;
            function o(p, x) {
              return p !== x;
            }
            R.ne = o;
            function y(p) {
              return p === null;
            }
            R.null = y;
            function c(p) {
              return typeof p == "number";
            }
            R.number = c;
            function e(p) {
              return p % 2 === 1;
            }
            R.odd = e;
            function i(p) {
              return typeof p == "string";
            }
            R.string = i;
            function r(p) {
              return !!p;
            }
            R.truthy = r;
            function u(p) {
              return p === void 0;
            }
            R.undefined = u;
            function l(p) {
              return p.toUpperCase() === p;
            }
            R.upper = l;
            function s(p) {
              return typeof Symbol < "u" ? !!p[Symbol.iterator] : Array.isArray(p) || typeof p == "string";
            }
            R.iterable = s;
            function f(p) {
              var x = p != null && typeof p == "object" && !Array.isArray(p);
              return Set ? x && !(p instanceof Set) : x;
            }
            R.mapping = f;
          }),
          /* 21 */
          /***/
          (function(F, R, T) {
            function g(k) {
              var m = -1;
              return {
                current: null,
                reset: function() {
                  m = -1, this.current = null;
                },
                next: function() {
                  return m++, m >= k.length && (m = 0), this.current = k[m], this.current;
                }
              };
            }
            function E(k) {
              k = k || ",";
              var m = !0;
              return function() {
                var w = m ? "" : k;
                return m = !1, w;
              };
            }
            function h() {
              return {
                range: function(k, m, w) {
                  typeof m > "u" ? (m = k, k = 0, w = 1) : w || (w = 1);
                  var K = [];
                  if (w > 0)
                    for (var P = k; P < m; P += w)
                      K.push(P);
                  else
                    for (var N = k; N > m; N += w)
                      K.push(N);
                  return K;
                },
                cycler: function() {
                  return g(Array.prototype.slice.call(arguments));
                },
                joiner: function(k) {
                  return E(k);
                }
              };
            }
            F.exports = h;
          }),
          /* 22 */
          /***/
          (function(F, R, T) {
            var g = T(4);
            F.exports = function(E, h) {
              function k(m, w) {
                if (this.name = m, this.path = m, this.defaultEngine = w.defaultEngine, this.ext = g.extname(m), !this.ext && !this.defaultEngine)
                  throw new Error("No default engine was specified and no extension was provided.");
                this.ext || (this.name += this.ext = (this.defaultEngine[0] !== "." ? "." : "") + this.defaultEngine);
              }
              return k.prototype.render = function(m, w) {
                E.render(this.name, m, w);
              }, h.set("view", k), h.set("nunjucksEnv", E), E;
            };
          }),
          /* 23 */
          /***/
          (function(F, R, T) {
            var g = T(4), E = T(4), h = T(0), k = h._prettifyError, m = T(5), w = T(7), K = w.Environment, P = T(24);
            function N(a, o) {
              return Array.isArray(o) ? o.some(function(y) {
                return a.match(y);
              }) : !1;
            }
            function b(a, o) {
              o = o || {}, o.isString = !0;
              var y = o.env || new K([]), c = o.wrapper || P;
              if (!o.name)
                throw new Error('the "name" option is required when compiling a string');
              return c([n(a, o.name, y)], o);
            }
            function t(a, o) {
              o = o || {};
              var y = o.env || new K([]), c = o.wrapper || P;
              if (o.isString)
                return b(a, o);
              var e = g.existsSync(a) && g.statSync(a), i = [], r = [];
              function u(f) {
                g.readdirSync(f).forEach(function(p) {
                  var x = E.join(f, p), L = x.substr(E.join(a, "/").length), S = g.statSync(x);
                  S && S.isDirectory() ? (L += "/", N(L, o.exclude) || u(x)) : N(L, o.include) && r.push(x);
                });
              }
              if (e.isFile())
                i.push(n(g.readFileSync(a, "utf-8"), o.name || a, y));
              else if (e.isDirectory()) {
                u(a);
                for (var l = 0; l < r.length; l++) {
                  var s = r[l].replace(E.join(a, "/"), "");
                  try {
                    i.push(n(g.readFileSync(r[l], "utf-8"), s, y));
                  } catch (f) {
                    if (o.force)
                      console.error(f);
                    else
                      throw f;
                  }
                }
              }
              return c(i, o);
            }
            function n(a, o, y) {
              y = y || new K([]);
              var c = y.asyncFilters, e = y.extensionsList, i;
              o = o.replace(/\\/g, "/");
              try {
                i = m.compile(a, c, e, o, y.opts);
              } catch (r) {
                throw k(o, !1, r);
              }
              return {
                name: o,
                template: i
              };
            }
            F.exports = {
              precompile: t,
              precompileString: b
            };
          }),
          /* 24 */
          /***/
          (function(F, R, T) {
            function g(E, h) {
              var k = "";
              h = h || {};
              for (var m = 0; m < E.length; m++) {
                var w = JSON.stringify(E[m].name), K = E[m].template;
                k += "(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})[" + w + `] = (function() {
` + K + `
})();
`, h.asFunction && (k += "return function(ctx, cb) { return nunjucks.render(" + w + `, ctx, cb); }
`), k += `})();
`;
              }
              return k;
            }
            F.exports = g;
          }),
          /* 25 */
          /***/
          (function(F, R, T) {
            function g() {
              var E = this.runtime, h = this.lib, k = this.compiler.Compiler, m = this.parser.Parser, w = this.nodes, K = this.lexer, P = E.contextOrFrameLookup, N = E.memberLookup, b, t;
              k && (b = k.prototype.assertType), m && (t = m.prototype.parseAggregate);
              function n() {
                E.contextOrFrameLookup = P, E.memberLookup = N, k && (k.prototype.assertType = b), m && (m.prototype.parseAggregate = t);
              }
              E.contextOrFrameLookup = function(r, u, l) {
                var s = P.apply(this, arguments);
                if (s !== void 0)
                  return s;
                switch (l) {
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
              function a(r) {
                return {
                  index: r.index,
                  lineno: r.lineno,
                  colno: r.colno
                };
              }
              if (w && k && m) {
                var o = w.Node.extend("Slice", {
                  fields: ["start", "stop", "step"],
                  init: function(r, u, l, s, f) {
                    l = l || new w.Literal(r, u, null), s = s || new w.Literal(r, u, null), f = f || new w.Literal(r, u, 1), this.parent(r, u, l, s, f);
                  }
                });
                k.prototype.assertType = function(r) {
                  r instanceof o || b.apply(this, arguments);
                }, k.prototype.compileSlice = function(r, u) {
                  this._emit("("), this._compileExpression(r.start, u), this._emit("),("), this._compileExpression(r.stop, u), this._emit("),("), this._compileExpression(r.step, u), this._emit(")");
                }, m.prototype.parseAggregate = function() {
                  var r = this, u = a(this.tokens);
                  u.colno--, u.index--;
                  try {
                    return t.apply(this);
                  } catch (C) {
                    var l = a(this.tokens), s = function() {
                      return h._assign(r.tokens, l), C;
                    };
                    h._assign(this.tokens, u), this.peeked = !1;
                    var f = this.peekToken();
                    if (f.type !== K.TOKEN_LEFT_BRACKET)
                      throw s();
                    this.nextToken();
                    for (var p = new o(f.lineno, f.colno), x = !1, L = 0; L <= p.fields.length && !this.skip(K.TOKEN_RIGHT_BRACKET); L++) {
                      if (L === p.fields.length)
                        if (x)
                          this.fail("parseSlice: too many slice components", f.lineno, f.colno);
                        else
                          break;
                      if (this.skip(K.TOKEN_COLON))
                        x = !0;
                      else {
                        var S = p.fields[L];
                        p[S] = this.parseExpression(), x = this.skip(K.TOKEN_COLON) || x;
                      }
                    }
                    if (!x)
                      throw s();
                    return new w.Array(f.lineno, f.colno, [p]);
                  }
                };
              }
              function y(r, u, l, s) {
                r = r || [], u === null && (u = s < 0 ? r.length - 1 : 0), l === null ? l = s < 0 ? -1 : r.length : l < 0 && (l += r.length), u < 0 && (u += r.length);
                for (var f = [], p = u; !(p < 0 || p > r.length || s > 0 && p >= l || s < 0 && p <= l); p += s)
                  f.push(E.memberLookup(r, p));
                return f;
              }
              function c(r, u) {
                return Object.prototype.hasOwnProperty.call(r, u);
              }
              var e = {
                pop: function(r) {
                  if (r === void 0)
                    return this.pop();
                  if (r >= this.length || r < 0)
                    throw new Error("KeyError");
                  return this.splice(r, 1);
                },
                append: function(r) {
                  return this.push(r);
                },
                remove: function(r) {
                  for (var u = 0; u < this.length; u++)
                    if (this[u] === r)
                      return this.splice(u, 1);
                  throw new Error("ValueError");
                },
                count: function(r) {
                  for (var u = 0, l = 0; l < this.length; l++)
                    this[l] === r && u++;
                  return u;
                },
                index: function(r) {
                  var u;
                  if ((u = this.indexOf(r)) === -1)
                    throw new Error("ValueError");
                  return u;
                },
                find: function(r) {
                  return this.indexOf(r);
                },
                insert: function(r, u) {
                  return this.splice(r, 0, u);
                }
              }, i = {
                items: function() {
                  return h._entries(this);
                },
                values: function() {
                  return h._values(this);
                },
                keys: function() {
                  return h.keys(this);
                },
                get: function(r, u) {
                  var l = this[r];
                  return l === void 0 && (l = u), l;
                },
                has_key: function(r) {
                  return c(this, r);
                },
                pop: function(r, u) {
                  var l = this[r];
                  if (l === void 0 && u !== void 0)
                    l = u;
                  else {
                    if (l === void 0)
                      throw new Error("KeyError");
                    delete this[r];
                  }
                  return l;
                },
                popitem: function() {
                  var r = h.keys(this);
                  if (!r.length)
                    throw new Error("KeyError");
                  var u = r[0], l = this[u];
                  return delete this[u], [u, l];
                },
                setdefault: function(r, u) {
                  return u === void 0 && (u = null), r in this || (this[r] = u), this[r];
                },
                update: function(r) {
                  return h._assign(this, r), null;
                }
              };
              return i.iteritems = i.items, i.itervalues = i.values, i.iterkeys = i.keys, E.memberLookup = function(r, u, l) {
                return arguments.length === 4 ? y.apply(this, arguments) : (r = r || {}, h.isArray(r) && c(e, u) ? e[u].bind(r) : h.isObject(r) && c(i, u) ? i[u].bind(r) : N.apply(this, arguments));
              }, n;
            }
            F.exports = g;
          })
          /******/
        ])
      );
    });
  })(we)), we.exports;
}
var $e = We();
const ze = /* @__PURE__ */ De($e);
function Je(J) {
  const q = {};
  for (const [R, T] of Object.entries(J.templates))
    q[R] = ze.compile(T);
  const F = (R) => {
    R.result = {};
    for (const T of Object.keys(J.templates))
      R.result[T] = q[T].render(R.properties || {});
  };
  return "features" in J.geojson ? J.geojson.features.forEach(F) : F(J.geojson), J.geojson;
}
const Ye = {
  templateExtractor: Je
};
function Ce(J) {
  const q = {
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
  return Object.keys(q).reduce((F, R) => {
    if (F[R] !== void 0)
      throw new Error(`Invalid Maplat option key: ${R}. Use "${q[R]}" instead.`);
    return F;
  }, J);
}
const xe = /\{%-?\s*(end)?(raw|verbatim)\s*-?%\}/g;
function Ze(J) {
  if (!J.includes("{%")) return J;
  const q = [];
  xe.lastIndex = 0;
  for (let h = xe.exec(J); h; h = xe.exec(J))
    q.push({ start: h.index, end: h.index + h[0].length, close: !!h[1], kind: h[2] });
  if (q.length === 0) return J;
  const F = { raw: [], verbatim: [] };
  q.forEach((h, k) => {
    h.close && F[h.kind].push(k);
  });
  const R = { raw: 0, verbatim: 0 };
  let T = "", g = 0, E = 0;
  for (; E < q.length; ) {
    const h = q[E];
    if (h.close) {
      E++;
      continue;
    }
    const k = F[h.kind];
    let m = R[h.kind];
    for (; m < k.length && k[m] < E; ) m++;
    if (R[h.kind] = m, m === k.length) {
      E++;
      continue;
    }
    T += J.slice(g, h.start), g = q[k[m]].end, E = k[m] + 1;
  }
  return T + J.slice(g);
}
function Te(J, q, F) {
  const R = J.indexOf(q);
  return R >= 0 && J.indexOf(F, R + q.length) >= 0;
}
const Xe = 'MaplatApp: poiTemplate/iconTemplate written in the lodash.template syntax (<% %>, <%= %>, <%- %>, ${ }) is no longer evaluated since @maplat/core 1.3.0, and was ignored. Rewrite it in the Nunjucks syntax ({{ }}, {% %}); wrap literal "<%" or "${" in {% raw %}...{% endraw %}.', qe = 'See the "Removed" section of the 1.3.0 CHANGELOG: https://github.com/code4history/MaplatCore/blob/master/CHANGELOG.md';
let Ae = !1, Se = !1;
function Ne(J) {
  return Array.from(J).slice(0, 80).join("");
}
function Qe(J) {
  const q = Ze(J);
  return Te(q, "<%", "%>") || Te(q, "${", "}");
}
function He(J, q) {
  Ae || (Ae = !0, console.warn(`${Xe} First template found (${J}): "${Ne(q)}". ${qe}`));
}
function Oe(J, q) {
  if (Se) return;
  Se = !0;
  const R = (q instanceof Error ? q.message : String(q)).split(`
`).map((T) => T.trim()).filter((T) => T).join(" ");
  console.warn(`MaplatApp: a poiTemplate/iconTemplate failed to render and was ignored: ${R}. First template: "${Ne(J)}".`);
}
function Re(J, q, F) {
  if (Qe(q)) {
    He(J, q);
    return;
  }
  try {
    const R = { type: "Feature", geometry: null, properties: F };
    return Ye.templateExtractor({ geojson: R, templates: { t: q } }), R.result.t;
  } catch (R) {
    Oe(q, R);
    return;
  }
}
function et(J, q) {
  const F = Re("iconTemplate", J, q);
  if (F === void 0) return;
  let R;
  try {
    R = JSON.parse(F);
  } catch (T) {
    Oe(J, T);
    return;
  }
  if (R === null || typeof R != "object" || Array.isArray(R)) {
    Oe(J, new Error("iconTemplate did not produce a JSON object"));
    return;
  }
  return R;
}
function tt(J, ...q) {
  const F = Ce(Object.assign({}, J));
  if (F.icon) return F;
  const R = q.reduce((T, g) => {
    if (T) return T;
    const E = g.iconTemplate, h = E ? et(E, F) : void 0;
    if (h)
      return h;
    if (g.icon)
      return {
        icon: g.icon,
        selectedIcon: g.selectedIcon
      };
  }, void 0);
  return R && (F.icon = R.icon, F.selectedIcon = R.selectedIcon), F;
}
function nt(J, ...q) {
  const F = Ce(J);
  return F.html ? F : q.reduce((R, T) => {
    if (R) return R;
    const g = T.poiTemplate;
    if (g) {
      const E = Re("poiTemplate", g, F);
      return E === void 0 ? void 0 : (F.html = E, F.poiStyle = F.poiStyle || T.poiStyle, F);
    }
  }, void 0) || F;
}
function it(J, ...q) {
  const F = tt(J, ...q);
  return nt(F, ...q);
}
export {
  it as applyPoiTemplates,
  nt as createHtmlFromTemplate,
  tt as createIconSet
};
//# sourceMappingURL=maplat_core_template.js.map
