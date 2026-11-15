function Ue(H) {
  return H && H.__esModule && Object.prototype.hasOwnProperty.call(H, "default") ? H.default : H;
}
var xe = { exports: {} }, Ve = xe.exports, Oe;
function De() {
  return Oe || (Oe = 1, (function(H, ie) {
    (function(B, I) {
      H.exports = I();
    })(typeof self < "u" ? self : Ve, function() {
      return (
        /******/
        (function(B) {
          var I = {};
          function T(g) {
            if (I[g])
              return I[g].exports;
            var E = I[g] = {
              /******/
              i: g,
              /******/
              l: !1,
              /******/
              exports: {}
              /******/
            };
            return B[g].call(E.exports, E, E.exports, T), E.l = !0, E.exports;
          }
          return T.m = B, T.c = I, T.d = function(g, E, p) {
            T.o(g, E) || Object.defineProperty(g, E, {
              /******/
              configurable: !1,
              /******/
              enumerable: !0,
              /******/
              get: p
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
          (function(B, _, T) {
            var g = Array.prototype, E = Object.prototype, p = {
              "&": "&amp;",
              '"': "&quot;",
              "'": "&#39;",
              "<": "&lt;",
              ">": "&gt;",
              "\\": "&#92;"
            }, b = /[&"'<>\\]/g, _ = B.exports = {};
            function w(d, R) {
              return E.hasOwnProperty.call(d, R);
            }
            _.hasOwnProp = w;
            function K(d) {
              return p[d];
            }
            function F(d, R, P) {
              if (P.Update || (P = new _.TemplateError(P)), P.Update(d), !R) {
                var j = P;
                P = new Error(j.message), P.name = j.name;
              }
              return P;
            }
            _._prettifyError = F;
            function N(d, R, P) {
              var j, J;
              d instanceof Error && (J = d, d = J.name + ": " + J.message), Object.setPrototypeOf ? (j = new Error(d), Object.setPrototypeOf(j, N.prototype)) : (j = this, Object.defineProperty(j, "message", {
                enumerable: !1,
                writable: !0,
                value: d
              })), Object.defineProperty(j, "name", {
                value: "Template render error"
              }), Error.captureStackTrace && Error.captureStackTrace(j, this.constructor);
              var Y;
              if (J) {
                var X = Object.getOwnPropertyDescriptor(J, "stack");
                Y = X && (X.get || function() {
                  return X.value;
                }), Y || (Y = function() {
                  return J.stack;
                });
              } else {
                var le = new Error(d).stack;
                Y = function() {
                  return le;
                };
              }
              return Object.defineProperty(j, "stack", {
                get: function() {
                  return Y.call(j);
                }
              }), Object.defineProperty(j, "cause", {
                value: J
              }), j.lineno = R, j.colno = P, j.firstUpdate = !0, j.Update = function(oe) {
                var Q = "(" + (oe || "unknown path") + ")";
                return this.firstUpdate && (this.lineno && this.colno ? Q += " [Line " + this.lineno + ", Column " + this.colno + "]" : this.lineno && (Q += " [Line " + this.lineno + "]")), Q += `
 `, this.firstUpdate && (Q += " "), this.message = Q + (this.message || ""), this.firstUpdate = !1, this;
              }, j;
            }
            Object.setPrototypeOf ? Object.setPrototypeOf(N.prototype, Error.prototype) : N.prototype = Object.create(Error.prototype, {
              constructor: {
                value: N
              }
            }), _.TemplateError = N;
            function k(d) {
              return d.replace(b, K);
            }
            _.escape = k;
            function t(d) {
              return E.toString.call(d) === "[object Function]";
            }
            _.isFunction = t;
            function n(d) {
              return E.toString.call(d) === "[object Array]";
            }
            _.isArray = n;
            function a(d) {
              return E.toString.call(d) === "[object String]";
            }
            _.isString = a;
            function o(d) {
              return E.toString.call(d) === "[object Object]";
            }
            _.isObject = o;
            function y(d) {
              return d ? typeof d == "string" ? d.split(".") : [d] : [];
            }
            function c(d) {
              var R = y(d);
              return function(P) {
                for (var j = P, J = 0; J < R.length; J++) {
                  var Y = R[J];
                  if (w(j, Y))
                    j = j[Y];
                  else
                    return;
                }
                return j;
              };
            }
            _.getAttrGetter = c;
            function e(d, R, P) {
              for (var j = {}, J = t(R) ? R : c(R), Y = 0; Y < d.length; Y++) {
                var X = d[Y], le = J(X, Y);
                if (le === void 0 && P === !0)
                  throw new TypeError('groupby: attribute "' + R + '" resolved to undefined');
                (j[le] || (j[le] = [])).push(X);
              }
              return j;
            }
            _.groupBy = e;
            function i(d) {
              return Array.prototype.slice.call(d);
            }
            _.toArray = i;
            function r(d) {
              var R = [];
              if (!d)
                return R;
              for (var P = d.length, j = i(arguments).slice(1), J = -1; ++J < P; )
                x(j, d[J]) === -1 && R.push(d[J]);
              return R;
            }
            _.without = r;
            function u(d, R) {
              for (var P = "", j = 0; j < R; j++)
                P += d;
              return P;
            }
            _.repeat = u;
            function l(d, R, P) {
              if (d != null) {
                if (g.forEach && d.forEach === g.forEach)
                  d.forEach(R, P);
                else if (d.length === +d.length)
                  for (var j = 0, J = d.length; j < J; j++)
                    R.call(P, d[j], j, d);
              }
            }
            _.each = l;
            function s(d, R) {
              var P = [];
              if (d == null)
                return P;
              if (g.map && d.map === g.map)
                return d.map(R);
              for (var j = 0; j < d.length; j++)
                P[P.length] = R(d[j], j);
              return d.length === +d.length && (P.length = d.length), P;
            }
            _.map = s;
            function h(d, R, P) {
              var j = -1;
              function J() {
                j++, j < d.length ? R(d[j], j, J, P) : P();
              }
              J();
            }
            _.asyncIter = h;
            function f(d, R, P) {
              var j = L(d || {}), J = j.length, Y = -1;
              function X() {
                Y++;
                var le = j[Y];
                Y < J ? R(le, d[le], Y, J, X) : P();
              }
              X();
            }
            _.asyncFor = f;
            function x(d, R, P) {
              return Array.prototype.indexOf.call(d || [], R, P);
            }
            _.indexOf = x;
            function L(d) {
              var R = [];
              for (var P in d)
                w(d, P) && R.push(P);
              return R;
            }
            _.keys = L;
            function S(d) {
              return L(d).map(function(R) {
                return [R, d[R]];
              });
            }
            _._entries = S;
            function C(d) {
              return L(d).map(function(R) {
                return d[R];
              });
            }
            _._values = C;
            function m(d, R) {
              return d = d || {}, L(R).forEach(function(P) {
                d[P] = R[P];
              }), d;
            }
            _._assign = _.extend = m;
            function O(d, R) {
              if (n(R) || a(R))
                return R.indexOf(d) !== -1;
              if (o(R))
                return d in R;
              throw new Error('Cannot use "in" operator to search for "' + d + '" in unexpected types.');
            }
            _.inOperator = O;
          }),
          /* 1 */
          /***/
          (function(B, I, T) {
            function g(a, o) {
              for (var y = 0; y < o.length; y++) {
                var c = o[y];
                c.enumerable = c.enumerable || !1, c.configurable = !0, "value" in c && (c.writable = !0), Object.defineProperty(a, p(c.key), c);
              }
            }
            function E(a, o, y) {
              return o && g(a.prototype, o), Object.defineProperty(a, "prototype", { writable: !1 }), a;
            }
            function p(a) {
              var o = b(a, "string");
              return typeof o == "symbol" ? o : String(o);
            }
            function b(a, o) {
              if (typeof a != "object" || a === null) return a;
              var y = a[Symbol.toPrimitive];
              if (y !== void 0) {
                var c = y.call(a, o);
                if (typeof c != "object") return c;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return String(a);
            }
            function _(a, o) {
              a.prototype = Object.create(o.prototype), a.prototype.constructor = a, w(a, o);
            }
            function w(a, o) {
              return w = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(y, c) {
                return y.__proto__ = c, y;
              }, w(a, o);
            }
            var K = T(16), F = T(0);
            function N(a, o) {
              return typeof a != "function" || typeof o != "function" ? o : function() {
                var y = this.parent;
                this.parent = a;
                var c = o.apply(this, arguments);
                return this.parent = y, c;
              };
            }
            function k(a, o, y) {
              y = y || {}, F.keys(y).forEach(function(e) {
                y[e] = N(a.prototype[e], y[e]);
              });
              var c = /* @__PURE__ */ (function(e) {
                _(i, e);
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
              return F._assign(c.prototype, y), c;
            }
            var t = /* @__PURE__ */ (function() {
              function a() {
                this.init.apply(this, arguments);
              }
              var o = a.prototype;
              return o.init = function() {
              }, a.extend = function(y, c) {
                return typeof y == "object" && (c = y, y = "anonymous"), k(this, y, c);
              }, E(a, [{
                key: "typename",
                get: function() {
                  return this.constructor.name;
                }
              }]), a;
            })(), n = /* @__PURE__ */ (function(a) {
              _(o, a);
              function o() {
                var c, e;
                return e = a.call(this) || this, (c = e).init.apply(c, arguments), e;
              }
              var y = o.prototype;
              return y.init = function() {
              }, o.extend = function(c, e) {
                return typeof c == "object" && (e = c, c = "anonymous"), k(this, c, e);
              }, E(o, [{
                key: "typename",
                get: function() {
                  return this.constructor.name;
                }
              }]), o;
            })(K);
            B.exports = {
              Obj: t,
              EmitterObj: n
            };
          }),
          /* 2 */
          /***/
          (function(B, I, T) {
            var g = T(0), E = Array.from, p = typeof Symbol == "function" && Symbol.iterator && typeof E == "function", b = /* @__PURE__ */ (function() {
              function s(f, x) {
                this.variables = /* @__PURE__ */ Object.create(null), this.parent = f, this.topLevel = !1, this.isolateWrites = x;
              }
              var h = s.prototype;
              return h.set = function(f, x, L) {
                var S = f.split("."), C = this.variables, m = this;
                if (L && (m = this.resolve(S[0], !0))) {
                  m.set(f, x);
                  return;
                }
                for (var O = 0; O < S.length - 1; O++) {
                  var d = S[O];
                  C[d] || (C[d] = {}), C = C[d];
                }
                C[S[S.length - 1]] = x;
              }, h.get = function(f) {
                var x = this.variables[f];
                return x !== void 0 ? x : null;
              }, h.lookup = function(f) {
                var x = this.parent, L = this.variables[f];
                return L !== void 0 ? L : x && x.lookup(f);
              }, h.resolve = function(f, x) {
                var L = x && this.isolateWrites ? void 0 : this.parent, S = this.variables[f];
                return S !== void 0 ? this : L && L.resolve(f);
              }, h.push = function(f) {
                return new s(this, f);
              }, h.pop = function() {
                return this.parent;
              }, s;
            })();
            function _(s, h, f) {
              return function() {
                for (var x = arguments.length, L = new Array(x), S = 0; S < x; S++)
                  L[S] = arguments[S];
                var C = N(L), m, O = F(L);
                if (C > s.length)
                  m = L.slice(0, s.length), L.slice(m.length, C).forEach(function(P, j) {
                    j < h.length && (O[h[j]] = P);
                  }), m.push(O);
                else if (C < s.length) {
                  m = L.slice(0, C);
                  for (var d = C; d < s.length; d++) {
                    var R = s[d];
                    m.push(O[R]), delete O[R];
                  }
                  m.push(O);
                } else
                  m = L;
                return f.apply(this, m);
              };
            }
            function w(s) {
              return s.__keywords = !0, s;
            }
            function K(s) {
              return s && Object.prototype.hasOwnProperty.call(s, "__keywords");
            }
            function F(s) {
              var h = s.length;
              if (h) {
                var f = s[h - 1];
                if (K(f))
                  return f;
              }
              return {};
            }
            function N(s) {
              var h = s.length;
              if (h === 0)
                return 0;
              var f = s[h - 1];
              return K(f) ? h - 1 : h;
            }
            function k(s) {
              if (typeof s != "string")
                return s;
              this.val = s, this.length = s.length;
            }
            k.prototype = Object.create(String.prototype, {
              length: {
                writable: !0,
                configurable: !0,
                value: 0
              }
            }), k.prototype.valueOf = function() {
              return this.val;
            }, k.prototype.toString = function() {
              return this.val;
            };
            function t(s, h) {
              return s instanceof k ? new k(h) : h.toString();
            }
            function n(s) {
              var h = typeof s;
              return h === "string" ? new k(s) : h !== "function" ? s : function(f) {
                var x = s.apply(this, arguments);
                return typeof x == "string" ? new k(x) : x;
              };
            }
            function a(s, h) {
              return s = s ?? "", h && !(s instanceof k) && (s = g.escape(s.toString())), s;
            }
            function o(s, h, f) {
              if (s == null)
                throw new g.TemplateError("attempted to output null or undefined value", h + 1, f + 1);
              return s;
            }
            function y(s, h) {
              if (s != null)
                return typeof s[h] == "function" ? function() {
                  for (var f = arguments.length, x = new Array(f), L = 0; L < f; L++)
                    x[L] = arguments[L];
                  return s[h].apply(s, x);
                } : s[h];
            }
            function c(s, h, f, x) {
              if (s) {
                if (typeof s != "function")
                  throw new Error("Unable to call `" + h + "`, which is not a function");
              } else throw new Error("Unable to call `" + h + "`, which is undefined or falsey");
              return s.apply(f, x);
            }
            function e(s, h, f) {
              var x = h.lookup(f);
              return x !== void 0 ? x : s.lookup(f);
            }
            function i(s, h, f) {
              return s.lineno ? s : new g.TemplateError(s, h, f);
            }
            function r(s, h, f, x) {
              if (g.isArray(s)) {
                var L = s.length;
                g.asyncIter(s, function(S, C, m) {
                  switch (h) {
                    case 1:
                      f(S, C, L, m);
                      break;
                    case 2:
                      f(S[0], S[1], C, L, m);
                      break;
                    case 3:
                      f(S[0], S[1], S[2], C, L, m);
                      break;
                    default:
                      S.push(C, L, m), f.apply(this, S);
                  }
                }, x);
              } else
                g.asyncFor(s, function(S, C, m, O, d) {
                  f(S, C, m, O, d);
                }, x);
            }
            function u(s, h, f, x) {
              var L = 0, S, C;
              function m(J, Y) {
                L++, C[J] = Y, L === S && x(null, C.join(""));
              }
              if (g.isArray(s))
                if (S = s.length, C = new Array(S), S === 0)
                  x(null, "");
                else
                  for (var O = 0; O < s.length; O++) {
                    var d = s[O];
                    switch (h) {
                      case 1:
                        f(d, O, S, m);
                        break;
                      case 2:
                        f(d[0], d[1], O, S, m);
                        break;
                      case 3:
                        f(d[0], d[1], d[2], O, S, m);
                        break;
                      default:
                        d.push(O, S, m), f.apply(this, d);
                    }
                  }
              else {
                var R = g.keys(s || {});
                if (S = R.length, C = new Array(S), S === 0)
                  x(null, "");
                else
                  for (var P = 0; P < R.length; P++) {
                    var j = R[P];
                    f(j, s[j], P, S, m);
                  }
              }
            }
            function l(s) {
              return typeof s != "object" || s === null || g.isArray(s) ? s : p && Symbol.iterator in s ? E(s) : s;
            }
            B.exports = {
              Frame: b,
              makeMacro: _,
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
              SafeString: k,
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
          (function(B, I, T) {
            function g(W, $) {
              for (var ne = 0; ne < $.length; ne++) {
                var ee = $[ne];
                ee.enumerable = ee.enumerable || !1, ee.configurable = !0, "value" in ee && (ee.writable = !0), Object.defineProperty(W, p(ee.key), ee);
              }
            }
            function E(W, $, ne) {
              return $ && g(W.prototype, $), Object.defineProperty(W, "prototype", { writable: !1 }), W;
            }
            function p(W) {
              var $ = b(W, "string");
              return typeof $ == "symbol" ? $ : String($);
            }
            function b(W, $) {
              if (typeof W != "object" || W === null) return W;
              var ne = W[Symbol.toPrimitive];
              if (ne !== void 0) {
                var ee = ne.call(W, $);
                if (typeof ee != "object") return ee;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return String(W);
            }
            function _(W, $) {
              W.prototype = Object.create($.prototype), W.prototype.constructor = W, w(W, $);
            }
            function w(W, $) {
              return w = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(ne, ee) {
                return ne.__proto__ = ee, ne;
              }, w(W, $);
            }
            var K = T(1), F = K.Obj;
            function N(W, $, ne) {
              W instanceof $ && ne.push(W), W instanceof k && W.findAll($, ne);
            }
            var k = /* @__PURE__ */ (function(W) {
              _($, W);
              function $() {
                return W.apply(this, arguments) || this;
              }
              var ne = $.prototype;
              return ne.init = function(ee, re) {
                for (var ue = arguments, me = this, ge = arguments.length, je = new Array(ge > 2 ? ge - 2 : 0), be = 2; be < ge; be++)
                  je[be - 2] = arguments[be];
                this.lineno = ee, this.colno = re, this.fields.forEach(function(Ke, Me) {
                  var Ee = ue[Me + 2];
                  Ee === void 0 && (Ee = null), me[Ke] = Ee;
                });
              }, ne.findAll = function(ee, re) {
                var ue = this;
                return re = re || [], this instanceof n ? this.children.forEach(function(me) {
                  return N(me, ee, re);
                }) : this.fields.forEach(function(me) {
                  return N(ue[me], ee, re);
                }), re;
              }, ne.iterFields = function(ee) {
                var re = this;
                this.fields.forEach(function(ue) {
                  ee(re[ue], ue);
                });
              }, $;
            })(F), t = /* @__PURE__ */ (function(W) {
              _($, W);
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
            })(k), n = /* @__PURE__ */ (function(W) {
              _($, W);
              function $() {
                return W.apply(this, arguments) || this;
              }
              var ne = $.prototype;
              return ne.init = function(ee, re, ue) {
                W.prototype.init.call(this, ee, re, ue || []);
              }, ne.addChild = function(ee) {
                this.children.push(ee);
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
            })(k), a = n.extend("Root"), o = t.extend("Literal"), y = t.extend("Symbol"), c = n.extend("Group"), e = n.extend("Array"), i = k.extend("Pair", {
              fields: ["key", "value"]
            }), r = n.extend("Dict"), u = k.extend("LookupVal", {
              fields: ["target", "val"]
            }), l = k.extend("If", {
              fields: ["cond", "body", "else_"]
            }), s = l.extend("IfAsync"), h = k.extend("InlineIf", {
              fields: ["cond", "body", "else_"]
            }), f = k.extend("For", {
              fields: ["arr", "name", "body", "else_"]
            }), x = f.extend("AsyncEach"), L = f.extend("AsyncAll"), S = k.extend("Macro", {
              fields: ["name", "args", "body"]
            }), C = S.extend("Caller"), m = k.extend("Import", {
              fields: ["template", "target", "withContext"]
            }), O = /* @__PURE__ */ (function(W) {
              _($, W);
              function $() {
                return W.apply(this, arguments) || this;
              }
              var ne = $.prototype;
              return ne.init = function(ee, re, ue, me, ge) {
                W.prototype.init.call(this, ee, re, ue, me || new n(), ge);
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
            })(k), d = k.extend("FunCall", {
              fields: ["name", "args"]
            }), R = d.extend("Filter"), P = R.extend("FilterAsync", {
              fields: ["name", "args", "symbol"]
            }), j = r.extend("KeywordArgs"), J = k.extend("Block", {
              fields: ["name", "body"]
            }), Y = k.extend("Super", {
              fields: ["blockName", "symbol"]
            }), X = k.extend("TemplateRef", {
              fields: ["template"]
            }), le = X.extend("Extends"), oe = k.extend("Include", {
              fields: ["template", "ignoreMissing"]
            }), Q = k.extend("Set", {
              fields: ["targets", "value"]
            }), V = k.extend("Switch", {
              fields: ["expr", "cases", "default"]
            }), G = k.extend("Case", {
              fields: ["cond", "body"]
            }), D = n.extend("Output"), se = k.extend("Capture", {
              fields: ["body"]
            }), fe = o.extend("TemplateData"), de = k.extend("UnaryOp", {
              fields: ["target"]
            }), ae = k.extend("BinOp", {
              fields: ["left", "right"]
            }), _e = ae.extend("In"), v = ae.extend("Is"), A = ae.extend("Or"), M = ae.extend("And"), U = de.extend("Not"), Z = ae.extend("Add"), z = ae.extend("Concat"), te = ae.extend("Sub"), q = ae.extend("Mul"), ce = ae.extend("Div"), he = ae.extend("FloorDiv"), pe = ae.extend("Mod"), Ne = ae.extend("Pow"), Re = de.extend("Neg"), Ie = de.extend("Pos"), Fe = k.extend("Compare", {
              fields: ["expr", "ops"]
            }), Pe = k.extend("CompareOperand", {
              fields: ["expr", "type"]
            }), ke = k.extend("CallExtension", {
              init: function(W, $, ne, ee) {
                this.parent(), this.extName = W.__name || W, this.prop = $, this.args = ne || new n(), this.contentArgs = ee || [], this.autoescape = W.autoescape;
              },
              fields: ["extName", "prop", "args", "contentArgs"]
            }), Be = ke.extend("CallExtensionAsync");
            function ve(W, $, ne) {
              var ee = W.split(`
`);
              ee.forEach(function(re, ue) {
                re && (ne && ue > 0 || !ne) && process.stdout.write(" ".repeat($));
                var me = ue === ee.length - 1 ? "" : `
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
              else if (W instanceof ke)
                ve(W.extName + "." + W.prop + `
`), W.args && ye(W.args, $ + 2), W.contentArgs && W.contentArgs.forEach(function(re) {
                  ye(re, $ + 2);
                });
              else {
                var ne = [], ee = null;
                W.iterFields(function(re, ue) {
                  re instanceof k ? ne.push([ue, re]) : (ee = ee || {}, ee[ue] = re);
                }), ee ? ve(JSON.stringify(ee, null, 2) + `
`, null, !0) : ve(`
`), ne.forEach(function(re) {
                  var ue = re[0], me = re[1];
                  ve("[" + ue + "] =>", $ + 2), ye(me, $ + 4);
                });
              }
            }
            B.exports = {
              Node: k,
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
              InlineIf: h,
              For: f,
              AsyncEach: x,
              AsyncAll: L,
              Macro: S,
              Caller: C,
              Import: m,
              FromImport: O,
              FunCall: d,
              Filter: R,
              FilterAsync: P,
              KeywordArgs: j,
              Block: J,
              Super: Y,
              Extends: le,
              Include: oe,
              Set: Q,
              Switch: V,
              Case: G,
              LookupVal: u,
              BinOp: ae,
              In: _e,
              Is: v,
              Or: A,
              And: M,
              Not: U,
              Add: Z,
              Concat: z,
              Sub: te,
              Mul: q,
              Div: ce,
              FloorDiv: he,
              Mod: pe,
              Pow: Ne,
              Neg: Re,
              Pos: Ie,
              Compare: Fe,
              CompareOperand: Pe,
              CallExtension: ke,
              CallExtensionAsync: Be,
              printNodes: ye
            };
          }),
          /* 4 */
          /***/
          (function(B, I) {
          }),
          /* 5 */
          /***/
          (function(B, I, T) {
            function g(o, y) {
              o.prototype = Object.create(y.prototype), o.prototype.constructor = o, E(o, y);
            }
            function E(o, y) {
              return E = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(c, e) {
                return c.__proto__ = e, c;
              }, E(o, y);
            }
            var p = T(8), b = T(17), _ = T(3), w = T(0), K = w.TemplateError, F = T(2), N = F.Frame, k = T(1), t = k.Obj, n = {
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
                r && this._emit(r), e.children.forEach(function(s, h) {
                  h > 0 && l._emit(","), l.compile(s, i);
                }), u && this._emit(u);
              }, c._compileExpression = function(e, i) {
                this.assertType(e, _.Literal, _.Symbol, _.Group, _.Array, _.Dict, _.FunCall, _.Caller, _.Filter, _.LookupVal, _.Compare, _.InlineIf, _.In, _.Is, _.And, _.Or, _.Not, _.Add, _.Concat, _.Sub, _.Mul, _.Div, _.FloorDiv, _.Mod, _.Pow, _.Neg, _.Pos, _.Compare, _.NodeList), this.compile(e, i);
              }, c.assertType = function(e) {
                for (var i = arguments.length, r = new Array(i > 1 ? i - 1 : 0), u = 1; u < i; u++)
                  r[u - 1] = arguments[u];
                r.some(function(l) {
                  return e instanceof l;
                }) || this.fail("assertType: invalid type: " + e.typename, e.lineno, e.colno);
              }, c.compileCallExtension = function(e, i, r) {
                var u = this, l = e.args, s = e.contentArgs, h = typeof e.autoescape == "boolean" ? e.autoescape : !0;
                if (r || this._emit(this.buffer + " += runtime.suppressValue("), this._emit('env.getExtension("' + e.extName + '")["' + e.prop + '"]('), this._emit("context"), (l || s) && this._emit(","), l && (l instanceof _.NodeList || this.fail("compileCallExtension: arguments must be a NodeList, use `parser.parseSignature`"), l.children.forEach(function(x, L) {
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
                  var f = this._tmpid();
                  this._emitLine(", " + this._makeCallback(f)), this._emitLine(this.buffer + " += runtime.suppressValue(" + f + ", " + h + " && env.opts.autoescape);"), this._addScopeLevel();
                } else
                  this._emit(")"), this._emit(", " + h + ` && env.opts.autoescape);
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
                r instanceof _.Symbol ? r = new _.Literal(r.lineno, r.colno, r.value) : r instanceof _.Literal && typeof r.value == "string" || this.fail("compilePair: Dict keys must be strings or names", r.lineno, r.colno), this.compile(r, i), this._emit(": "), this._compileExpression(u, i);
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
                this.assertType(r, _.Symbol), this._emit('env.getFilter("' + r.value + '").call(context, '), this._compileAggregate(e.args, i), this._emit(")");
              }, c.compileFilterAsync = function(e, i) {
                var r = e.name, u = e.symbol.value;
                this.assertType(r, _.Symbol), i.set(u, u), this._emit('env.getFilter("' + r.value + '").call(context, '), this._compileAggregate(e.args, i), this._emitLine(", " + this._makeCallback(u)), this._addScopeLevel();
              }, c.compileKeywordArgs = function(e, i) {
                this._emit("runtime.makeKeywordArgs("), this.compileDict(e, i), this._emit(")");
              }, c.compileSet = function(e, i) {
                var r = this, u = [];
                e.targets.forEach(function(l) {
                  var s = l.value, h = i.lookup(s);
                  h == null && (h = r._tmpid(), r._emitLine("var " + h + ";")), u.push(h);
                }), e.value ? (this._emit(u.join(" = ") + " = "), this._compileExpression(e.value, i), this._emitLine(";")) : (this._emit(u.join(" = ") + " = "), this.compile(e.body, i), this._emitLine(";")), e.targets.forEach(function(l, s) {
                  var h = u[s], f = l.value;
                  r._emitLine('frame.set("' + f + '", ' + h + ", true);"), r._emitLine("if(frame.topLevel) {"), r._emitLine('context.setVariable("' + f + '", ' + h + ");"), r._emitLine("}"), f.charAt(0) !== "_" && (r._emitLine("if(frame.topLevel) {"), r._emitLine('context.addExport("' + f + '", ' + h + ");"), r._emitLine("}"));
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
                s.forEach(function(h) {
                  l._emitLine('frame.set("loop.' + h.name + '", ' + h.val + ");");
                });
              }, c.compileFor = function(e, i) {
                var r = this, u = this._tmpid(), l = this._tmpid(), s = this._tmpid();
                if (i = i.push(), this._emitLine("frame = frame.push();"), this._emit("var " + s + " = "), this._compileExpression(e.arr, i), this._emitLine(";"), this._emit("if(" + s + ") {"), this._emitLine(s + " = runtime.fromIterator(" + s + ");"), e.name instanceof _.Array) {
                  this._emitLine("var " + u + ";"), this._emitLine("if(runtime.isArray(" + s + ")) {"), this._emitLine("var " + l + " = " + s + ".length;"), this._emitLine("for(" + u + "=0; " + u + " < " + s + ".length; " + u + "++) {"), e.name.children.forEach(function(m, O) {
                    var d = r._tmpid();
                    r._emitLine("var " + d + " = " + s + "[" + u + "][" + O + "];"), r._emitLine('frame.set("' + m + '", ' + s + "[" + u + "][" + O + "]);"), i.set(e.name.children[O].value, d);
                  }), this._emitLoopBindings(e, s, u, l), this._withScopedSyntax(function() {
                    r.compile(e.body, i);
                  }), this._emitLine("}"), this._emitLine("} else {");
                  var h = e.name.children, f = h[0], x = h[1], L = this._tmpid(), S = this._tmpid();
                  i.set(f.value, L), i.set(x.value, S), this._emitLine(u + " = -1;"), this._emitLine("var " + l + " = runtime.keys(" + s + ").length;"), this._emitLine("for(var " + L + " in " + s + ") {"), this._emitLine(u + "++;"), this._emitLine("var " + S + " = " + s + "[" + L + "];"), this._emitLine('frame.set("' + f.value + '", ' + L + ");"), this._emitLine('frame.set("' + x.value + '", ' + S + ");"), this._emitLoopBindings(e, s, u, l), this._withScopedSyntax(function() {
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
                var u = this, l = this._tmpid(), s = this._tmpid(), h = this._tmpid(), f = r ? "asyncAll" : "asyncEach";
                if (i = i.push(), this._emitLine("frame = frame.push();"), this._emit("var " + h + " = runtime.fromIterator("), this._compileExpression(e.arr, i), this._emitLine(");"), e.name instanceof _.Array) {
                  var x = e.name.children.length;
                  this._emit("runtime." + f + "(" + h + ", " + x + ", function("), e.name.children.forEach(function(C) {
                    u._emit(C.value + ",");
                  }), this._emit(l + "," + s + ",next) {"), e.name.children.forEach(function(C) {
                    var m = C.value;
                    i.set(m, m), u._emitLine('frame.set("' + m + '", ' + m + ");");
                  });
                } else {
                  var L = e.name.value;
                  this._emitLine("runtime." + f + "(" + h + ", 1, function(" + L + ", " + l + ", " + s + ",next) {"), this._emitLine('frame.set("' + L + '", ' + L + ");"), i.set(L, L);
                }
                this._emitLoopBindings(e, h, l, s), this._withScopedSyntax(function() {
                  var C;
                  r && (C = u._pushBuffer()), u.compile(e.body, i), u._emitLine("next(" + l + (C ? "," + C : "") + ");"), r && u._popBuffer();
                });
                var S = this._tmpid();
                this._emitLine("}, " + this._makeCallback(S)), this._addScopeLevel(), r && this._emitLine(this.buffer + " += " + S + ";"), e.else_ && (this._emitLine("if (!" + h + ".length) {"), this.compile(e.else_, i), this._emitLine("}")), this._emitLine("frame = frame.pop();");
              }, c.compileAsyncEach = function(e, i) {
                this._compileAsyncLoop(e, i);
              }, c.compileAsyncAll = function(e, i) {
                this._compileAsyncLoop(e, i, !0);
              }, c._compileMacro = function(e, i) {
                var r = this, u = [], l = null, s = "macro_" + this._tmpid(), h = i !== void 0;
                e.args.children.forEach(function(m, O) {
                  O === e.args.children.length - 1 && m instanceof _.Dict ? l = m : (r.assertType(m, _.Symbol), u.push(m));
                });
                var f = [].concat(u.map(function(m) {
                  return "l_" + m.value;
                }), ["kwargs"]), x = u.map(function(m) {
                  return '"' + m.value + '"';
                }), L = (l && l.children || []).map(function(m) {
                  return '"' + m.key.value + '"';
                }), S;
                h ? S = i.push(!0) : S = new N(), this._emitLines("var " + s + " = runtime.makeMacro(", "[" + x.join(", ") + "], ", "[" + L.join(", ") + "], ", "function (" + f.join(", ") + ") {", "var callerFrame = frame;", "frame = " + (h ? "frame.push(true);" : "new runtime.Frame();"), "kwargs = kwargs || {};", 'if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {', 'frame.set("caller", kwargs.caller); }'), u.forEach(function(m) {
                  r._emitLine('frame.set("' + m.value + '", l_' + m.value + ");"), S.set(m.value, "l_" + m.value);
                }), l && l.children.forEach(function(m) {
                  var O = m.key.value;
                  r._emit('frame.set("' + O + '", '), r._emit('Object.prototype.hasOwnProperty.call(kwargs, "' + O + '")'), r._emit(' ? kwargs["' + O + '"] : '), r._compileExpression(m.value, S), r._emit(");");
                });
                var C = this._pushBuffer();
                return this._withScopedSyntax(function() {
                  r.compile(e.body, S);
                }), this._emitLine("frame = " + (h ? "frame.pop();" : "callerFrame;")), this._emitLine("return new runtime.SafeString(" + C + ");"), this._emitLine("});"), this._popBuffer(), s;
              }, c.compileMacro = function(e, i) {
                var r = this._compileMacro(e), u = e.name.value;
                i.set(u, r), i.parent ? this._emitLine('frame.set("' + u + '", ' + r + ");") : (e.name.value.charAt(0) !== "_" && this._emitLine('context.addExport("' + u + '");'), this._emitLine('context.setVariable("' + u + '", ' + r + ");"));
              }, c.compileCaller = function(e, i) {
                this._emit("(function (){");
                var r = this._compileMacro(e, i);
                this._emit("return " + r + ";})()");
              }, c._compileGetTemplate = function(e, i, r, u) {
                var l = this._tmpid(), s = this._templateName(), h = this._makeCallback(l), f = r ? "true" : "false", x = u ? "true" : "false";
                return this._emit("env.getTemplate("), this._compileExpression(e.template, i), this._emitLine(", " + f + ", " + s + ", " + x + ", " + h), l;
              }, c.compileImport = function(e, i) {
                var r = e.target.value, u = this._compileGetTemplate(e, i, !1, !1);
                this._addScopeLevel(), this._emitLine(u + ".getExported(" + (e.withContext ? "context.getVariables(), frame, " : "") + this._makeCallback(u)), this._addScopeLevel(), i.set(r, u), i.parent ? this._emitLine('frame.set("' + r + '", ' + u + ");") : this._emitLine('context.setVariable("' + r + '", ' + u + ");");
              }, c.compileFromImport = function(e, i) {
                var r = this, u = this._compileGetTemplate(e, i, !1, !1);
                this._addScopeLevel(), this._emitLine(u + ".getExported(" + (e.withContext ? "context.getVariables(), frame, " : "") + this._makeCallback(u)), this._addScopeLevel(), e.names.children.forEach(function(l) {
                  var s, h, f = r._tmpid();
                  l instanceof _.Pair ? (s = l.key.value, h = l.value.value) : (s = l.value, h = s), r._emitLine("if(Object.prototype.hasOwnProperty.call(" + u + ', "' + s + '")) {'), r._emitLine("var " + f + " = " + u + "." + s + ";"), r._emitLine("} else {"), r._emitLine(`cb(new Error("cannot import '` + s + `'")); return;`), r._emitLine("}"), i.set(h, f), i.parent ? r._emitLine('frame.set("' + h + '", ' + f + ");") : r._emitLine('context.setVariable("' + h + '", ' + f + ");");
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
                  l instanceof _.TemplateData ? l.value && (r._emit(r.buffer + " += "), r.compileLiteral(l, i), r._emitLine(";")) : (r._emit(r.buffer + " += runtime.suppressValue("), r.throwOnUndefined && r._emit("runtime.ensureDefined("), r.compile(l, i), r.throwOnUndefined && r._emit("," + e.lineno + "," + e.colno + ")"), r._emit(`, env.opts.autoescape);
`));
                });
              }, c.compileRoot = function(e, i) {
                var r = this;
                i && this.fail("compileRoot: root node can't have frame"), i = new N(), this._emitFuncBegin(e, "root"), this._emitLine("var parentTemplate = null;"), this._compileChildren(e, i), this._emitLine("if(parentTemplate) {"), this._emitLine("parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);"), this._emitLine("} else {"), this._emitLine("cb(null, " + this.buffer + ");"), this._emitLine("}"), this._emitFuncEnd(!0), this.inBlock = !0;
                var u = [], l = e.findAll(_.Block);
                l.forEach(function(s, h) {
                  var f = s.name.value;
                  if (u.indexOf(f) !== -1)
                    throw new Error('Block "' + f + '" defined more than once.');
                  u.push(f), r._emitFuncBegin(s, "b_" + f);
                  var x = new N();
                  r._emitLine("var frame = frame.push(true);"), r.compile(s.body, x), r._emitFuncEnd();
                }), this._emitLine("return {"), l.forEach(function(s, h) {
                  var f = "b_" + s.name.value;
                  r._emitLine(f + ": " + f + ",");
                }), this._emitLine(`root: root
};`);
              }, c.compile = function(e, i) {
                var r = this["compile" + e.typename];
                r ? r.call(this, e, i) : this.fail("compile: Cannot compile node: " + e.typename, e.lineno, e.colno);
              }, c.getCode = function() {
                return this.codebuf.join("");
              }, y;
            })(t);
            B.exports = {
              compile: function(o, y, c, e, i) {
                i === void 0 && (i = {});
                var r = new a(e, i.throwOnUndefined), u = (c || []).map(function(s) {
                  return s.preprocess;
                }).filter(function(s) {
                  return !!s;
                }), l = u.reduce(function(s, h) {
                  return h(s);
                }, o);
                return r.compile(b.transform(p.parse(l, c, i), y, e)), r.getCode();
              },
              Compiler: a
            };
          }),
          /* 6 */
          /***/
          (function(B, I, T) {
            function g(w, K) {
              w.prototype = Object.create(K.prototype), w.prototype.constructor = w, E(w, K);
            }
            function E(w, K) {
              return E = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(F, N) {
                return F.__proto__ = N, F;
              }, E(w, K);
            }
            var p = T(4), b = T(1), _ = b.EmitterObj;
            B.exports = /* @__PURE__ */ (function(w) {
              g(K, w);
              function K() {
                return w.apply(this, arguments) || this;
              }
              var F = K.prototype;
              return F.resolve = function(N, k) {
                return p.resolve(p.dirname(N), k);
              }, F.isRelative = function(N) {
                return N.indexOf("./") === 0 || N.indexOf("../") === 0;
              }, K;
            })(_);
          }),
          /* 7 */
          /***/
          (function(B, I, T) {
            function g(L, S) {
              L.prototype = Object.create(S.prototype), L.prototype.constructor = L, E(L, S);
            }
            function E(L, S) {
              return E = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(C, m) {
                return C.__proto__ = m, C;
              }, E(L, S);
            }
            var p = T(12), b = T(15), _ = T(0), w = T(5), K = T(18), F = T(10), N = F.FileSystemLoader, k = F.WebLoader, t = F.PrecompiledLoader, n = T(20), a = T(21), o = T(1), y = o.Obj, c = o.EmitterObj, e = T(2), i = e.handleError, r = e.Frame, u = T(22);
            function l(L, S, C) {
              p(function() {
                L(S, C);
              });
            }
            var s = {
              type: "code",
              obj: {
                root: function(L, S, C, m, O) {
                  try {
                    O(null, "");
                  } catch (d) {
                    O(i(d, null, null));
                  }
                }
              }
            }, h = /* @__PURE__ */ (function(L) {
              g(S, L);
              function S() {
                return L.apply(this, arguments) || this;
              }
              var C = S.prototype;
              return C.init = function(m, O) {
                var d = this;
                O = this.opts = O || {}, this.opts.dev = !!O.dev, this.opts.autoescape = O.autoescape != null ? O.autoescape : !0, this.opts.throwOnUndefined = !!O.throwOnUndefined, this.opts.trimBlocks = !!O.trimBlocks, this.opts.lstripBlocks = !!O.lstripBlocks, this.loaders = [], m ? this.loaders = _.isArray(m) ? m : [m] : N ? this.loaders = [new N("views")] : k && (this.loaders = [new k("/views")]), typeof window < "u" && window.nunjucksPrecompiled && this.loaders.unshift(new t(window.nunjucksPrecompiled)), this._initLoaders(), this.globals = a(), this.filters = {}, this.tests = {}, this.asyncFilters = [], this.extensions = {}, this.extensionsList = [], _._entries(K).forEach(function(R) {
                  var P = R[0], j = R[1];
                  return d.addFilter(P, j);
                }), _._entries(n).forEach(function(R) {
                  var P = R[0], j = R[1];
                  return d.addTest(P, j);
                });
              }, C._initLoaders = function() {
                var m = this;
                this.loaders.forEach(function(O) {
                  O.cache = {}, typeof O.on == "function" && (O.on("update", function(d, R) {
                    O.cache[d] = null, m.emit("update", d, R, O);
                  }), O.on("load", function(d, R) {
                    m.emit("load", d, R, O);
                  }));
                });
              }, C.invalidateCache = function() {
                this.loaders.forEach(function(m) {
                  m.cache = {};
                });
              }, C.addExtension = function(m, O) {
                return O.__name = m, this.extensions[m] = O, this.extensionsList.push(O), this;
              }, C.removeExtension = function(m) {
                var O = this.getExtension(m);
                O && (this.extensionsList = _.without(this.extensionsList, O), delete this.extensions[m]);
              }, C.getExtension = function(m) {
                return this.extensions[m];
              }, C.hasExtension = function(m) {
                return !!this.extensions[m];
              }, C.addGlobal = function(m, O) {
                return this.globals[m] = O, this;
              }, C.getGlobal = function(m) {
                if (typeof this.globals[m] > "u")
                  throw new Error("global not found: " + m);
                return this.globals[m];
              }, C.addFilter = function(m, O, d) {
                var R = O;
                return d && this.asyncFilters.push(m), this.filters[m] = R, this;
              }, C.getFilter = function(m) {
                if (!this.filters[m])
                  throw new Error("filter not found: " + m);
                return this.filters[m];
              }, C.addTest = function(m, O) {
                return this.tests[m] = O, this;
              }, C.getTest = function(m) {
                if (!this.tests[m])
                  throw new Error("test not found: " + m);
                return this.tests[m];
              }, C.resolveTemplate = function(m, O, d) {
                var R = m.isRelative && O ? m.isRelative(d) : !1;
                return R && m.resolve ? m.resolve(O, d) : d;
              }, C.getTemplate = function(m, O, d, R, P) {
                var j = this, J = this, Y = null;
                if (m && m.raw && (m = m.raw), _.isFunction(d) && (P = d, d = null, O = O || !1), _.isFunction(O) && (P = O, O = !1), m instanceof x)
                  Y = m;
                else {
                  if (typeof m != "string")
                    throw new Error("template names must be a string: " + m);
                  for (var X = 0; X < this.loaders.length; X++) {
                    var le = this.loaders[X];
                    if (Y = le.cache[this.resolveTemplate(le, d, m)], Y)
                      break;
                  }
                }
                if (Y)
                  if (O && Y.compile(), P) {
                    P(null, Y);
                    return;
                  } else
                    return Y;
                var oe, Q = function(V, G) {
                  if (!G && !V && !R && (V = new Error("template not found: " + m)), V)
                    if (P) {
                      P(V);
                      return;
                    } else
                      throw V;
                  var D;
                  G ? (D = new x(G.src, j, G.path, O), G.noCache || (G.loader.cache[m] = D)) : D = new x(s, j, "", O), P ? P(null, D) : oe = D;
                };
                return _.asyncIter(this.loaders, function(V, G, D, se) {
                  function fe(de, ae) {
                    de ? se(de) : ae ? (ae.loader = V, se(null, ae)) : D();
                  }
                  m = J.resolveTemplate(V, d, m), V.async ? V.getSource(m, fe) : fe(null, V.getSource(m));
                }, Q), oe;
              }, C.express = function(m) {
                return u(this, m);
              }, C.render = function(m, O, d) {
                _.isFunction(O) && (d = O, O = null);
                var R = null;
                return this.getTemplate(m, function(P, j) {
                  if (P && d)
                    l(d, P);
                  else {
                    if (P)
                      throw P;
                    R = j.render(O, d);
                  }
                }), R;
              }, C.renderString = function(m, O, d, R) {
                _.isFunction(d) && (R = d, d = {}), d = d || {};
                var P = new x(m, this, d.path);
                return P.render(O, R);
              }, C.waterfall = function(m, O, d) {
                return b(m, O, d);
              }, S;
            })(c), f = /* @__PURE__ */ (function(L) {
              g(S, L);
              function S() {
                return L.apply(this, arguments) || this;
              }
              var C = S.prototype;
              return C.init = function(m, O, d) {
                var R = this;
                this.env = d || new h(), this.ctx = _.extend({}, m), this.blocks = {}, this.exported = [], _.keys(O).forEach(function(P) {
                  R.addBlock(P, O[P]);
                });
              }, C.lookup = function(m) {
                return m in this.env.globals && !(m in this.ctx) ? this.env.globals[m] : this.ctx[m];
              }, C.setVariable = function(m, O) {
                this.ctx[m] = O;
              }, C.getVariables = function() {
                return this.ctx;
              }, C.addBlock = function(m, O) {
                return this.blocks[m] = this.blocks[m] || [], this.blocks[m].push(O), this;
              }, C.getBlock = function(m) {
                if (!this.blocks[m])
                  throw new Error('unknown block "' + m + '"');
                return this.blocks[m][0];
              }, C.getSuper = function(m, O, d, R, P, j) {
                var J = _.indexOf(this.blocks[O] || [], d), Y = this.blocks[O][J + 1], X = this;
                if (J === -1 || !Y)
                  throw new Error('no super block available for "' + O + '"');
                Y(m, X, R, P, j);
              }, C.addExport = function(m) {
                this.exported.push(m);
              }, C.getExported = function() {
                var m = this, O = {};
                return this.exported.forEach(function(d) {
                  O[d] = m.ctx[d];
                }), O;
              }, S;
            })(y), x = /* @__PURE__ */ (function(L) {
              g(S, L);
              function S() {
                return L.apply(this, arguments) || this;
              }
              var C = S.prototype;
              return C.init = function(m, O, d, R) {
                if (this.env = O || new h(), _.isObject(m))
                  switch (m.type) {
                    case "code":
                      this.tmplProps = m.obj;
                      break;
                    case "string":
                      this.tmplStr = m.obj;
                      break;
                    default:
                      throw new Error("Unexpected template object type " + m.type + "; expected 'code', or 'string'");
                  }
                else if (_.isString(m))
                  this.tmplStr = m;
                else
                  throw new Error("src must be a string or an object describing the source");
                if (this.path = d, R)
                  try {
                    this._compile();
                  } catch (P) {
                    throw _._prettifyError(this.path, this.env.opts.dev, P);
                  }
                else
                  this.compiled = !1;
              }, C.render = function(m, O, d) {
                var R = this;
                typeof m == "function" ? (d = m, m = {}) : typeof O == "function" && (d = O, O = null);
                var P = !O;
                try {
                  this.compile();
                } catch (oe) {
                  var j = _._prettifyError(this.path, this.env.opts.dev, oe);
                  if (d)
                    return l(d, j);
                  throw j;
                }
                var J = new f(m || {}, this.blocks, this.env), Y = O ? O.push(!0) : new r();
                Y.topLevel = !0;
                var X = null, le = !1;
                return this.rootRenderFunc(this.env, J, Y, e, function(oe, Q) {
                  if (!(le && d && typeof Q < "u"))
                    if (oe && (oe = _._prettifyError(R.path, R.env.opts.dev, oe), le = !0), d)
                      P ? l(d, oe, Q) : d(oe, Q);
                    else {
                      if (oe)
                        throw oe;
                      X = Q;
                    }
                }), X;
              }, C.getExported = function(m, O, d) {
                typeof m == "function" && (d = m, m = {}), typeof O == "function" && (d = O, O = null);
                try {
                  this.compile();
                } catch (j) {
                  if (d)
                    return d(j);
                  throw j;
                }
                var R = O ? O.push() : new r();
                R.topLevel = !0;
                var P = new f(m || {}, this.blocks, this.env);
                this.rootRenderFunc(this.env, P, R, e, function(j) {
                  j ? d(j, null) : d(null, P.getExported());
                });
              }, C.compile = function() {
                this.compiled || this._compile();
              }, C._compile = function() {
                var m;
                if (this.tmplProps)
                  m = this.tmplProps;
                else {
                  var O = w.compile(this.tmplStr, this.env.asyncFilters, this.env.extensionsList, this.path, this.env.opts), d = new Function(O);
                  m = d();
                }
                this.blocks = this._getBlocks(m), this.rootRenderFunc = m.root, this.compiled = !0;
              }, C._getBlocks = function(m) {
                var O = {};
                return _.keys(m).forEach(function(d) {
                  d.slice(0, 2) === "b_" && (O[d.slice(2)] = m[d]);
                }), O;
              }, S;
            })(y);
            B.exports = {
              Environment: h,
              Template: x
            };
          }),
          /* 8 */
          /***/
          (function(B, I, T) {
            function g(F, N) {
              F.prototype = Object.create(N.prototype), F.prototype.constructor = F, E(F, N);
            }
            function E(F, N) {
              return E = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(k, t) {
                return k.__proto__ = t, k;
              }, E(F, N);
            }
            var p = T(9), b = T(3), _ = T(1).Obj, w = T(0), K = /* @__PURE__ */ (function(F) {
              g(N, F);
              function N() {
                return F.apply(this, arguments) || this;
              }
              var k = N.prototype;
              return k.init = function(t) {
                this.tokens = t, this.peeked = null, this.breakOnBlocks = null, this.dropLeadingWhitespace = !1, this.extensions = [];
              }, k.nextToken = function(t) {
                var n;
                if (this.peeked)
                  if (!t && this.peeked.type === p.TOKEN_WHITESPACE)
                    this.peeked = null;
                  else
                    return n = this.peeked, this.peeked = null, n;
                if (n = this.tokens.nextToken(), !t)
                  for (; n && n.type === p.TOKEN_WHITESPACE; )
                    n = this.tokens.nextToken();
                return n;
              }, k.peekToken = function() {
                return this.peeked = this.peeked || this.nextToken(), this.peeked;
              }, k.pushToken = function(t) {
                if (this.peeked)
                  throw new Error("pushToken: can only push one token on between reads");
                this.peeked = t;
              }, k.error = function(t, n, a) {
                if (n === void 0 || a === void 0) {
                  var o = this.peekToken() || {};
                  n = o.lineno, a = o.colno;
                }
                return n !== void 0 && (n += 1), a !== void 0 && (a += 1), new w.TemplateError(t, n, a);
              }, k.fail = function(t, n, a) {
                throw this.error(t, n, a);
              }, k.skip = function(t) {
                var n = this.nextToken();
                return !n || n.type !== t ? (this.pushToken(n), !1) : !0;
              }, k.expect = function(t) {
                var n = this.nextToken();
                return n.type !== t && this.fail("expected " + t + ", got " + n.type, n.lineno, n.colno), n;
              }, k.skipValue = function(t, n) {
                var a = this.nextToken();
                return !a || a.type !== t || a.value !== n ? (this.pushToken(a), !1) : !0;
              }, k.skipSymbol = function(t) {
                return this.skipValue(p.TOKEN_SYMBOL, t);
              }, k.advanceAfterBlockEnd = function(t) {
                var n;
                return t || (n = this.peekToken(), n || this.fail("unexpected end of file"), n.type !== p.TOKEN_SYMBOL && this.fail("advanceAfterBlockEnd: expected symbol token or explicit name to be passed"), t = this.nextToken().value), n = this.nextToken(), n && n.type === p.TOKEN_BLOCK_END ? n.value.charAt(0) === "-" && (this.dropLeadingWhitespace = !0) : this.fail("expected block end in " + t + " statement"), n;
              }, k.advanceAfterVariableEnd = function() {
                var t = this.nextToken();
                t && t.type === p.TOKEN_VARIABLE_END ? this.dropLeadingWhitespace = t.value.charAt(t.value.length - this.tokens.tags.VARIABLE_END.length - 1) === "-" : (this.pushToken(t), this.fail("expected variable end"));
              }, k.parseFor = function() {
                var t = this.peekToken(), n, a;
                this.skipSymbol("for") ? (n = new b.For(t.lineno, t.colno), a = "endfor") : this.skipSymbol("asyncEach") ? (n = new b.AsyncEach(t.lineno, t.colno), a = "endeach") : this.skipSymbol("asyncAll") ? (n = new b.AsyncAll(t.lineno, t.colno), a = "endall") : this.fail("parseFor: expected for{Async}", t.lineno, t.colno), n.name = this.parsePrimary(), n.name instanceof b.Symbol || this.fail("parseFor: variable name expected for loop");
                var o = this.peekToken().type;
                if (o === p.TOKEN_COMMA) {
                  var y = n.name;
                  for (n.name = new b.Array(y.lineno, y.colno), n.name.addChild(y); this.skip(p.TOKEN_COMMA); ) {
                    var c = this.parsePrimary();
                    n.name.addChild(c);
                  }
                }
                return this.skipSymbol("in") || this.fail('parseFor: expected "in" keyword for loop', t.lineno, t.colno), n.arr = this.parseExpression(), this.advanceAfterBlockEnd(t.value), n.body = this.parseUntilBlocks(a, "else"), this.skipSymbol("else") && (this.advanceAfterBlockEnd("else"), n.else_ = this.parseUntilBlocks(a)), this.advanceAfterBlockEnd(), n;
              }, k.parseMacro = function() {
                var t = this.peekToken();
                this.skipSymbol("macro") || this.fail("expected macro");
                var n = this.parsePrimary(!0), a = this.parseSignature(), o = new b.Macro(t.lineno, t.colno, n, a);
                return this.advanceAfterBlockEnd(t.value), o.body = this.parseUntilBlocks("endmacro"), this.advanceAfterBlockEnd(), o;
              }, k.parseCall = function() {
                var t = this.peekToken();
                this.skipSymbol("call") || this.fail("expected call");
                var n = this.parseSignature(!0) || new b.NodeList(), a = this.parsePrimary();
                this.advanceAfterBlockEnd(t.value);
                var o = this.parseUntilBlocks("endcall");
                this.advanceAfterBlockEnd();
                var y = new b.Symbol(t.lineno, t.colno, "caller"), c = new b.Caller(t.lineno, t.colno, y, n, o), e = a.args.children;
                e[e.length - 1] instanceof b.KeywordArgs || e.push(new b.KeywordArgs());
                var i = e[e.length - 1];
                return i.addChild(new b.Pair(t.lineno, t.colno, y, c)), new b.Output(t.lineno, t.colno, [a]);
              }, k.parseWithContext = function() {
                var t = this.peekToken(), n = null;
                return this.skipSymbol("with") ? n = !0 : this.skipSymbol("without") && (n = !1), n !== null && (this.skipSymbol("context") || this.fail("parseFrom: expected context after with/without", t.lineno, t.colno)), n;
              }, k.parseImport = function() {
                var t = this.peekToken();
                this.skipSymbol("import") || this.fail("parseImport: expected import", t.lineno, t.colno);
                var n = this.parseExpression();
                this.skipSymbol("as") || this.fail('parseImport: expected "as" keyword', t.lineno, t.colno);
                var a = this.parseExpression(), o = this.parseWithContext(), y = new b.Import(t.lineno, t.colno, n, a, o);
                return this.advanceAfterBlockEnd(t.value), y;
              }, k.parseFrom = function() {
                var t = this.peekToken();
                this.skipSymbol("from") || this.fail("parseFrom: expected from");
                var n = this.parseExpression();
                this.skipSymbol("import") || this.fail("parseFrom: expected import", t.lineno, t.colno);
                for (var a = new b.NodeList(), o; ; ) {
                  var y = this.peekToken();
                  if (y.type === p.TOKEN_BLOCK_END) {
                    a.children.length || this.fail("parseFrom: Expected at least one import name", t.lineno, t.colno), y.value.charAt(0) === "-" && (this.dropLeadingWhitespace = !0), this.nextToken();
                    break;
                  }
                  a.children.length > 0 && !this.skip(p.TOKEN_COMMA) && this.fail("parseFrom: expected comma", t.lineno, t.colno);
                  var c = this.parsePrimary();
                  if (c.value.charAt(0) === "_" && this.fail("parseFrom: names starting with an underscore cannot be imported", c.lineno, c.colno), this.skipSymbol("as")) {
                    var e = this.parsePrimary();
                    a.addChild(new b.Pair(c.lineno, c.colno, c, e));
                  } else
                    a.addChild(c);
                  o = this.parseWithContext();
                }
                return new b.FromImport(t.lineno, t.colno, n, a, o);
              }, k.parseBlock = function() {
                var t = this.peekToken();
                this.skipSymbol("block") || this.fail("parseBlock: expected block", t.lineno, t.colno);
                var n = new b.Block(t.lineno, t.colno);
                n.name = this.parsePrimary(), n.name instanceof b.Symbol || this.fail("parseBlock: variable name expected", t.lineno, t.colno), this.advanceAfterBlockEnd(t.value), n.body = this.parseUntilBlocks("endblock"), this.skipSymbol("endblock"), this.skipSymbol(n.name.value);
                var a = this.peekToken();
                return a || this.fail("parseBlock: expected endblock, got end of file"), this.advanceAfterBlockEnd(a.value), n;
              }, k.parseExtends = function() {
                var t = "extends", n = this.peekToken();
                this.skipSymbol(t) || this.fail("parseTemplateRef: expected " + t);
                var a = new b.Extends(n.lineno, n.colno);
                return a.template = this.parseExpression(), this.advanceAfterBlockEnd(n.value), a;
              }, k.parseInclude = function() {
                var t = "include", n = this.peekToken();
                this.skipSymbol(t) || this.fail("parseInclude: expected " + t);
                var a = new b.Include(n.lineno, n.colno);
                return a.template = this.parseExpression(), this.skipSymbol("ignore") && this.skipSymbol("missing") && (a.ignoreMissing = !0), this.advanceAfterBlockEnd(n.value), a;
              }, k.parseIf = function() {
                var t = this.peekToken(), n;
                this.skipSymbol("if") || this.skipSymbol("elif") || this.skipSymbol("elseif") ? n = new b.If(t.lineno, t.colno) : this.skipSymbol("ifAsync") ? n = new b.IfAsync(t.lineno, t.colno) : this.fail("parseIf: expected if, elif, or elseif", t.lineno, t.colno), n.cond = this.parseExpression(), this.advanceAfterBlockEnd(t.value), n.body = this.parseUntilBlocks("elif", "elseif", "else", "endif");
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
              }, k.parseSet = function() {
                var t = this.peekToken();
                this.skipSymbol("set") || this.fail("parseSet: expected set", t.lineno, t.colno);
                for (var n = new b.Set(t.lineno, t.colno, []), a; (a = this.parsePrimary()) && (n.targets.push(a), !!this.skip(p.TOKEN_COMMA)); )
                  ;
                return this.skipValue(p.TOKEN_OPERATOR, "=") ? (n.value = this.parseExpression(), this.advanceAfterBlockEnd(t.value)) : this.skip(p.TOKEN_BLOCK_END) ? (n.body = new b.Capture(t.lineno, t.colno, this.parseUntilBlocks("endset")), n.value = null, this.advanceAfterBlockEnd()) : this.fail("parseSet: expected = or block end in set tag", t.lineno, t.colno), n;
              }, k.parseSwitch = function() {
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
                  i.push(new b.Case(e.line, e.col, u, l)), e = this.peekToken();
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
                return new b.Switch(y.lineno, y.colno, c, i, r);
              }, k.parseStatement = function() {
                var t = this.peekToken(), n;
                if (t.type !== p.TOKEN_SYMBOL && this.fail("tag name expected", t.lineno, t.colno), this.breakOnBlocks && w.indexOf(this.breakOnBlocks, t.value) !== -1)
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
                          return o.parse(this, b, p);
                      }
                    this.fail("unknown block tag: " + t.value, t.lineno, t.colno);
                }
                return n;
              }, k.parseRaw = function(t) {
                t = t || "raw";
                for (var n = "end" + t, a = new RegExp("([\\s\\S]*?){%\\s*(" + t + "|" + n + ")\\s*(?=%})%}"), o = 1, y = "", c = null, e = this.advanceAfterBlockEnd(); (c = this.tokens._extractRegex(a)) && o > 0; ) {
                  var i = c[0], r = c[1], u = c[2];
                  u === t ? o += 1 : u === n && (o -= 1), o === 0 ? (y += r, this.tokens.backN(i.length - r.length)) : y += i;
                }
                return new b.Output(e.lineno, e.colno, [new b.TemplateData(e.lineno, e.colno, y)]);
              }, k.parsePostfix = function(t) {
                for (var n, a = this.peekToken(); a; ) {
                  if (a.type === p.TOKEN_LEFT_PAREN)
                    t = new b.FunCall(a.lineno, a.colno, t, this.parseSignature());
                  else if (a.type === p.TOKEN_LEFT_BRACKET)
                    n = this.parseAggregate(), n.children.length > 1 && this.fail("invalid index"), t = new b.LookupVal(a.lineno, a.colno, t, n.children[0]);
                  else if (a.type === p.TOKEN_OPERATOR && a.value === ".") {
                    this.nextToken();
                    var o = this.nextToken();
                    o.type !== p.TOKEN_SYMBOL && this.fail("expected name as lookup value, got " + o.value, o.lineno, o.colno), n = new b.Literal(o.lineno, o.colno, o.value), t = new b.LookupVal(a.lineno, a.colno, t, n);
                  } else
                    break;
                  a = this.peekToken();
                }
                return t;
              }, k.parseExpression = function() {
                var t = this.parseInlineIf();
                return t;
              }, k.parseInlineIf = function() {
                var t = this.parseOr();
                if (this.skipSymbol("if")) {
                  var n = this.parseOr(), a = t;
                  t = new b.InlineIf(t.lineno, t.colno), t.body = a, t.cond = n, this.skipSymbol("else") ? t.else_ = this.parseOr() : t.else_ = null;
                }
                return t;
              }, k.parseOr = function() {
                for (var t = this.parseAnd(); this.skipSymbol("or"); ) {
                  var n = this.parseAnd();
                  t = new b.Or(t.lineno, t.colno, t, n);
                }
                return t;
              }, k.parseAnd = function() {
                for (var t = this.parseNot(); this.skipSymbol("and"); ) {
                  var n = this.parseNot();
                  t = new b.And(t.lineno, t.colno, t, n);
                }
                return t;
              }, k.parseNot = function() {
                var t = this.peekToken();
                return this.skipSymbol("not") ? new b.Not(t.lineno, t.colno, this.parseNot()) : this.parseIn();
              }, k.parseIn = function() {
                for (var t = this.parseIs(); ; ) {
                  var n = this.nextToken();
                  if (!n)
                    break;
                  var a = n.type === p.TOKEN_SYMBOL && n.value === "not";
                  if (a || this.pushToken(n), this.skipSymbol("in")) {
                    var o = this.parseIs();
                    t = new b.In(t.lineno, t.colno, t, o), a && (t = new b.Not(t.lineno, t.colno, t));
                  } else {
                    a && this.pushToken(n);
                    break;
                  }
                }
                return t;
              }, k.parseIs = function() {
                var t = this.parseCompare();
                if (this.skipSymbol("is")) {
                  var n = this.skipSymbol("not"), a = this.parseCompare();
                  t = new b.Is(t.lineno, t.colno, t, a), n && (t = new b.Not(t.lineno, t.colno, t));
                }
                return t;
              }, k.parseCompare = function() {
                for (var t = ["==", "===", "!=", "!==", "<", ">", "<=", ">="], n = this.parseConcat(), a = []; ; ) {
                  var o = this.nextToken();
                  if (o)
                    if (t.indexOf(o.value) !== -1)
                      a.push(new b.CompareOperand(o.lineno, o.colno, this.parseConcat(), o.value));
                    else {
                      this.pushToken(o);
                      break;
                    }
                  else break;
                }
                return a.length ? new b.Compare(a[0].lineno, a[0].colno, n, a) : n;
              }, k.parseConcat = function() {
                for (var t = this.parseAdd(); this.skipValue(p.TOKEN_TILDE, "~"); ) {
                  var n = this.parseAdd();
                  t = new b.Concat(t.lineno, t.colno, t, n);
                }
                return t;
              }, k.parseAdd = function() {
                for (var t = this.parseSub(); this.skipValue(p.TOKEN_OPERATOR, "+"); ) {
                  var n = this.parseSub();
                  t = new b.Add(t.lineno, t.colno, t, n);
                }
                return t;
              }, k.parseSub = function() {
                for (var t = this.parseMul(); this.skipValue(p.TOKEN_OPERATOR, "-"); ) {
                  var n = this.parseMul();
                  t = new b.Sub(t.lineno, t.colno, t, n);
                }
                return t;
              }, k.parseMul = function() {
                for (var t = this.parseDiv(); this.skipValue(p.TOKEN_OPERATOR, "*"); ) {
                  var n = this.parseDiv();
                  t = new b.Mul(t.lineno, t.colno, t, n);
                }
                return t;
              }, k.parseDiv = function() {
                for (var t = this.parseFloorDiv(); this.skipValue(p.TOKEN_OPERATOR, "/"); ) {
                  var n = this.parseFloorDiv();
                  t = new b.Div(t.lineno, t.colno, t, n);
                }
                return t;
              }, k.parseFloorDiv = function() {
                for (var t = this.parseMod(); this.skipValue(p.TOKEN_OPERATOR, "//"); ) {
                  var n = this.parseMod();
                  t = new b.FloorDiv(t.lineno, t.colno, t, n);
                }
                return t;
              }, k.parseMod = function() {
                for (var t = this.parsePow(); this.skipValue(p.TOKEN_OPERATOR, "%"); ) {
                  var n = this.parsePow();
                  t = new b.Mod(t.lineno, t.colno, t, n);
                }
                return t;
              }, k.parsePow = function() {
                for (var t = this.parseUnary(); this.skipValue(p.TOKEN_OPERATOR, "**"); ) {
                  var n = this.parseUnary();
                  t = new b.Pow(t.lineno, t.colno, t, n);
                }
                return t;
              }, k.parseUnary = function(t) {
                var n = this.peekToken(), a;
                return this.skipValue(p.TOKEN_OPERATOR, "-") ? a = new b.Neg(n.lineno, n.colno, this.parseUnary(!0)) : this.skipValue(p.TOKEN_OPERATOR, "+") ? a = new b.Pos(n.lineno, n.colno, this.parseUnary(!0)) : a = this.parsePrimary(), t || (a = this.parseFilter(a)), a;
              }, k.parsePrimary = function(t) {
                var n = this.nextToken(), a, o = null;
                if (n ? n.type === p.TOKEN_STRING ? a = n.value : n.type === p.TOKEN_INT ? a = parseInt(n.value, 10) : n.type === p.TOKEN_FLOAT ? a = parseFloat(n.value) : n.type === p.TOKEN_BOOLEAN ? n.value === "true" ? a = !0 : n.value === "false" ? a = !1 : this.fail("invalid boolean: " + n.value, n.lineno, n.colno) : n.type === p.TOKEN_NONE ? a = null : n.type === p.TOKEN_REGEX && (a = new RegExp(n.value.body, n.value.flags)) : this.fail("expected expression, got end of file"), a !== void 0 ? o = new b.Literal(n.lineno, n.colno, a) : n.type === p.TOKEN_SYMBOL ? o = new b.Symbol(n.lineno, n.colno, n.value) : (this.pushToken(n), o = this.parseAggregate()), t || (o = this.parsePostfix(o)), o)
                  return o;
                throw this.error("unexpected token: " + n.value, n.lineno, n.colno);
              }, k.parseFilterName = function() {
                for (var t = this.expect(p.TOKEN_SYMBOL), n = t.value; this.skipValue(p.TOKEN_OPERATOR, "."); )
                  n += "." + this.expect(p.TOKEN_SYMBOL).value;
                return new b.Symbol(t.lineno, t.colno, n);
              }, k.parseFilterArgs = function(t) {
                if (this.peekToken().type === p.TOKEN_LEFT_PAREN) {
                  var n = this.parsePostfix(t);
                  return n.args.children;
                }
                return [];
              }, k.parseFilter = function(t) {
                for (; this.skip(p.TOKEN_PIPE); ) {
                  var n = this.parseFilterName();
                  t = new b.Filter(n.lineno, n.colno, n, new b.NodeList(n.lineno, n.colno, [t].concat(this.parseFilterArgs(t))));
                }
                return t;
              }, k.parseFilterStatement = function() {
                var t = this.peekToken();
                this.skipSymbol("filter") || this.fail("parseFilterStatement: expected filter");
                var n = this.parseFilterName(), a = this.parseFilterArgs(n);
                this.advanceAfterBlockEnd(t.value);
                var o = new b.Capture(n.lineno, n.colno, this.parseUntilBlocks("endfilter"));
                this.advanceAfterBlockEnd();
                var y = new b.Filter(n.lineno, n.colno, n, new b.NodeList(n.lineno, n.colno, [o].concat(a)));
                return new b.Output(n.lineno, n.colno, [y]);
              }, k.parseAggregate = function() {
                var t = this.nextToken(), n;
                switch (t.type) {
                  case p.TOKEN_LEFT_PAREN:
                    n = new b.Group(t.lineno, t.colno);
                    break;
                  case p.TOKEN_LEFT_BRACKET:
                    n = new b.Array(t.lineno, t.colno);
                    break;
                  case p.TOKEN_LEFT_CURLY:
                    n = new b.Dict(t.lineno, t.colno);
                    break;
                  default:
                    return null;
                }
                for (; ; ) {
                  var a = this.peekToken().type;
                  if (a === p.TOKEN_RIGHT_PAREN || a === p.TOKEN_RIGHT_BRACKET || a === p.TOKEN_RIGHT_CURLY) {
                    this.nextToken();
                    break;
                  }
                  if (n.children.length > 0 && (this.skip(p.TOKEN_COMMA) || this.fail("parseAggregate: expected comma after expression", t.lineno, t.colno)), n instanceof b.Dict) {
                    var o = this.parsePrimary();
                    this.skip(p.TOKEN_COLON) || this.fail("parseAggregate: expected colon after dict key", t.lineno, t.colno);
                    var y = this.parseExpression();
                    n.addChild(new b.Pair(o.lineno, o.colno, o, y));
                  } else {
                    var c = this.parseExpression();
                    n.addChild(c);
                  }
                }
                return n;
              }, k.parseSignature = function(t, n) {
                var a = this.peekToken();
                if (!n && a.type !== p.TOKEN_LEFT_PAREN) {
                  if (t)
                    return null;
                  this.fail("expected arguments", a.lineno, a.colno);
                }
                a.type === p.TOKEN_LEFT_PAREN && (a = this.nextToken());
                for (var o = new b.NodeList(a.lineno, a.colno), y = new b.KeywordArgs(a.lineno, a.colno), c = !1; ; ) {
                  if (a = this.peekToken(), !n && a.type === p.TOKEN_RIGHT_PAREN) {
                    this.nextToken();
                    break;
                  } else if (n && a.type === p.TOKEN_BLOCK_END)
                    break;
                  if (c && !this.skip(p.TOKEN_COMMA))
                    this.fail("parseSignature: expected comma after expression", a.lineno, a.colno);
                  else {
                    var e = this.parseExpression();
                    this.skipValue(p.TOKEN_OPERATOR, "=") ? y.addChild(new b.Pair(e.lineno, e.colno, e, this.parseExpression())) : o.addChild(e);
                  }
                  c = !0;
                }
                return y.children.length && o.addChild(y), o;
              }, k.parseUntilBlocks = function() {
                for (var t = this.breakOnBlocks, n = arguments.length, a = new Array(n), o = 0; o < n; o++)
                  a[o] = arguments[o];
                this.breakOnBlocks = a;
                var y = this.parse();
                return this.breakOnBlocks = t, y;
              }, k.parseNodes = function() {
                for (var t, n = []; t = this.nextToken(); )
                  if (t.type === p.TOKEN_DATA) {
                    var a = t.value, o = this.peekToken(), y = o && o.value;
                    this.dropLeadingWhitespace && (a = a.replace(/^\s*/, ""), this.dropLeadingWhitespace = !1), o && (o.type === p.TOKEN_BLOCK_START && y.charAt(y.length - 1) === "-" || o.type === p.TOKEN_VARIABLE_START && y.charAt(this.tokens.tags.VARIABLE_START.length) === "-" || o.type === p.TOKEN_COMMENT && y.charAt(this.tokens.tags.COMMENT_START.length) === "-") && (a = a.replace(/\s*$/, "")), n.push(new b.Output(t.lineno, t.colno, [new b.TemplateData(t.lineno, t.colno, a)]));
                  } else if (t.type === p.TOKEN_BLOCK_START) {
                    this.dropLeadingWhitespace = !1;
                    var c = this.parseStatement();
                    if (!c)
                      break;
                    n.push(c);
                  } else if (t.type === p.TOKEN_VARIABLE_START) {
                    var e = this.parseExpression();
                    this.dropLeadingWhitespace = !1, this.advanceAfterVariableEnd(), n.push(new b.Output(t.lineno, t.colno, [e]));
                  } else t.type === p.TOKEN_COMMENT ? this.dropLeadingWhitespace = t.value.charAt(t.value.length - this.tokens.tags.COMMENT_END.length - 1) === "-" : this.fail("Unexpected token at top-level: " + t.type, t.lineno, t.colno);
                return n;
              }, k.parse = function() {
                return new b.NodeList(0, 0, this.parseNodes());
              }, k.parseAsRoot = function() {
                return new b.Root(0, 0, this.parseNodes());
              }, N;
            })(_);
            B.exports = {
              parse: function(F, N, k) {
                var t = new K(p.lex(F, k));
                return N !== void 0 && (t.extensions = N), t.parseAsRoot();
              },
              Parser: K
            };
          }),
          /* 9 */
          /***/
          (function(B, I, T) {
            var g = T(0), E = ` 
	\r `, p = "()[]{}%*-+~/#,:|.<>=!", b = "0123456789", _ = "{%", w = "%}", K = "{{", F = "}}", N = "{#", k = "#}", t = "string", n = "whitespace", a = "data", o = "block-start", y = "block-end", c = "variable-start", e = "variable-end", i = "comment", r = "left-paren", u = "right-paren", l = "left-bracket", s = "right-bracket", h = "left-curly", f = "right-curly", x = "operator", L = "comma", S = "colon", C = "tilde", m = "pipe", O = "int", d = "float", R = "boolean", P = "none", j = "symbol", J = "special", Y = "regex";
            function X(oe, Q, V, G) {
              return {
                type: oe,
                value: Q,
                lineno: V,
                colno: G
              };
            }
            var le = /* @__PURE__ */ (function() {
              function oe(V, G) {
                this.str = V, this.index = 0, this.len = V.length, this.lineno = 0, this.colno = 0, this.in_code = !1, G = G || {};
                var D = G.tags || {};
                this.tags = {
                  BLOCK_START: D.blockStart || _,
                  BLOCK_END: D.blockEnd || w,
                  VARIABLE_START: D.variableStart || K,
                  VARIABLE_END: D.variableEnd || F,
                  COMMENT_START: D.commentStart || N,
                  COMMENT_END: D.commentEnd || k
                }, this.trimBlocks = !!G.trimBlocks, this.lstripBlocks = !!G.lstripBlocks;
              }
              var Q = oe.prototype;
              return Q.nextToken = function() {
                var V = this.lineno, G = this.colno, D;
                if (this.in_code) {
                  var se = this.current();
                  if (this.isFinished())
                    return null;
                  if (se === '"' || se === "'")
                    return X(t, this._parseString(se), V, G);
                  if (D = this._extract(E))
                    return X(n, D, V, G);
                  if ((D = this._extractString(this.tags.BLOCK_END)) || (D = this._extractString("-" + this.tags.BLOCK_END)))
                    return this.in_code = !1, this.trimBlocks && (se = this.current(), se === `
` ? this.forward() : se === "\r" && (this.forward(), se = this.current(), se === `
` ? this.forward() : this.back())), X(y, D, V, G);
                  if ((D = this._extractString(this.tags.VARIABLE_END)) || (D = this._extractString("-" + this.tags.VARIABLE_END)))
                    return this.in_code = !1, X(e, D, V, G);
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
                    return X(Y, {
                      body: fe,
                      flags: ae
                    }, V, G);
                  } else if (p.indexOf(se) !== -1) {
                    this.forward();
                    var v = ["==", "===", "!=", "!==", "<=", ">=", "//", "**"], A = se + this.current(), M;
                    switch (g.indexOf(v, A) !== -1 && (this.forward(), se = A, g.indexOf(v, A + this.current()) !== -1 && (se = A + this.current(), this.forward())), se) {
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
                        M = h;
                        break;
                      case "}":
                        M = f;
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
                        M = m;
                        break;
                      default:
                        M = x;
                    }
                    return X(M, se, V, G);
                  } else if (D = this._extractUntil(E + p), D.match(/^[-+]?[0-9]+$/))
                    if (this.current() === ".") {
                      this.forward();
                      var U = this._extract(b);
                      return X(d, D + "." + U, V, G);
                    } else
                      return X(O, D, V, G);
                  else {
                    if (D.match(/^(true|false)$/))
                      return X(R, D, V, G);
                    if (D === "none" || D === "null")
                      return X(P, D, V, G);
                    if (D)
                      return X(j, D, V, G);
                    throw new Error("Unexpected value while parsing: " + D);
                  }
                } else {
                  var Z = this.tags.BLOCK_START.charAt(0) + this.tags.VARIABLE_START.charAt(0) + this.tags.COMMENT_START.charAt(0) + this.tags.COMMENT_END.charAt(0);
                  if (this.isFinished())
                    return null;
                  if ((D = this._extractString(this.tags.BLOCK_START + "-")) || (D = this._extractString(this.tags.BLOCK_START)))
                    return this.in_code = !0, X(o, D, V, G);
                  if ((D = this._extractString(this.tags.VARIABLE_START + "-")) || (D = this._extractString(this.tags.VARIABLE_START)))
                    return this.in_code = !0, X(c, D, V, G);
                  D = "";
                  var z, te = !1;
                  for (this._matches(this.tags.COMMENT_START) && (te = !0, D = this._extractString(this.tags.COMMENT_START)); (z = this._extractUntil(Z)) !== null; )
                    if (D += z, (this._matches(this.tags.BLOCK_START) || this._matches(this.tags.VARIABLE_START) || this._matches(this.tags.COMMENT_START)) && !te) {
                      if (this.lstripBlocks && this._matches(this.tags.BLOCK_START) && this.colno > 0 && this.colno <= D.length) {
                        var q = D.slice(-this.colno);
                        if (/^\s+$/.test(q) && (D = D.slice(0, -this.colno), !D.length))
                          return this.nextToken();
                      }
                      break;
                    } else if (this._matches(this.tags.COMMENT_END)) {
                      if (!te)
                        throw new Error("unexpected end of comment");
                      D += this._extractString(this.tags.COMMENT_END);
                      break;
                    } else
                      D += this.current(), this.forward();
                  if (z === null && te)
                    throw new Error("expected end of comment, got end of file");
                  return X(te ? i : a, D, V, G);
                }
              }, Q._parseString = function(V) {
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
              }, Q._matches = function(V) {
                if (this.index + V.length > this.len)
                  return null;
                var G = this.str.slice(this.index, this.index + V.length);
                return G === V;
              }, Q._extractString = function(V) {
                return this._matches(V) ? (this.forwardN(V.length), V) : null;
              }, Q._extractUntil = function(V) {
                return this._extractMatching(!0, V || "");
              }, Q._extract = function(V) {
                return this._extractMatching(!1, V);
              }, Q._extractMatching = function(V, G) {
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
              }, Q._extractRegex = function(V) {
                var G = this.currentStr().match(V);
                return G ? (this.forwardN(G[0].length), G) : null;
              }, Q.isFinished = function() {
                return this.index >= this.len;
              }, Q.forwardN = function(V) {
                for (var G = 0; G < V; G++)
                  this.forward();
              }, Q.forward = function() {
                this.index++, this.previous() === `
` ? (this.lineno++, this.colno = 0) : this.colno++;
              }, Q.backN = function(V) {
                for (var G = 0; G < V; G++)
                  this.back();
              }, Q.back = function() {
                if (this.index--, this.current() === `
`) {
                  this.lineno--;
                  var V = this.src.lastIndexOf(`
`, this.index - 1);
                  V === -1 ? this.colno = this.index : this.colno = this.index - V;
                } else
                  this.colno--;
              }, Q.current = function() {
                return this.isFinished() ? "" : this.str.charAt(this.index);
              }, Q.currentStr = function() {
                return this.isFinished() ? "" : this.str.substr(this.index);
              }, Q.previous = function() {
                return this.str.charAt(this.index - 1);
              }, oe;
            })();
            B.exports = {
              lex: function(oe, Q) {
                return new le(oe, Q);
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
              TOKEN_LEFT_CURLY: h,
              TOKEN_RIGHT_CURLY: f,
              TOKEN_OPERATOR: x,
              TOKEN_COMMA: L,
              TOKEN_COLON: S,
              TOKEN_TILDE: C,
              TOKEN_PIPE: m,
              TOKEN_INT: O,
              TOKEN_FLOAT: d,
              TOKEN_BOOLEAN: R,
              TOKEN_NONE: P,
              TOKEN_SYMBOL: j,
              TOKEN_SPECIAL: J,
              TOKEN_REGEX: Y
            };
          }),
          /* 10 */
          /***/
          (function(B, I, T) {
            function g(K, F) {
              K.prototype = Object.create(F.prototype), K.prototype.constructor = K, E(K, F);
            }
            function E(K, F) {
              return E = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(N, k) {
                return N.__proto__ = k, N;
              }, E(K, F);
            }
            var p = T(6), b = T(19), _ = b.PrecompiledLoader, w = /* @__PURE__ */ (function(K) {
              g(F, K);
              function F(k, t) {
                var n;
                return n = K.call(this) || this, n.baseURL = k || ".", t = t || {}, n.useCache = !!t.useCache, n.async = !!t.async, n;
              }
              var N = F.prototype;
              return N.resolve = function(k, t) {
                throw new Error("relative templates not support in the browser yet");
              }, N.getSource = function(k, t) {
                var n = this, a = this.useCache, o;
                return this.fetch(this.baseURL + "/" + k, function(y, c) {
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
                      path: k,
                      noCache: !a
                    }, n.emit("load", k, o), t && t(null, o);
                }), o;
              }, N.fetch = function(k, t) {
                if (typeof window > "u")
                  throw new Error("WebLoader can only by used in a browser");
                var n = new XMLHttpRequest(), a = !0;
                n.onreadystatechange = function() {
                  n.readyState === 4 && a && (a = !1, n.status === 0 || n.status === 200 ? t(null, n.responseText) : t({
                    status: n.status,
                    content: n.responseText
                  }));
                }, k += (k.indexOf("?") === -1 ? "?" : "&") + "s=" + (/* @__PURE__ */ new Date()).getTime(), n.open("GET", k, this.async), n.send();
              }, F;
            })(p);
            B.exports = {
              WebLoader: w,
              PrecompiledLoader: _
            };
          }),
          /* 11 */
          /***/
          (function(B, I, T) {
            var g = T(0), E = T(7), p = E.Environment, b = E.Template, _ = T(6), w = T(10), K = T(23), F = T(5), N = T(8), k = T(9), t = T(2), n = T(3), a = T(25), o;
            function y(c, e) {
              e = e || {}, g.isObject(c) && (e = c, c = null);
              var i;
              return w.FileSystemLoader ? i = new w.FileSystemLoader(c, {
                watch: e.watch,
                noCache: e.noCache
              }) : w.WebLoader && (i = new w.WebLoader(c, {
                useCache: e.web && e.web.useCache,
                async: e.web && e.web.async
              })), o = new p(i, e), e && e.express && o.express(e.express), o;
            }
            B.exports = {
              Environment: p,
              Template: b,
              Loader: _,
              FileSystemLoader: w.FileSystemLoader,
              NodeResolveLoader: w.NodeResolveLoader,
              PrecompiledLoader: w.PrecompiledLoader,
              WebLoader: w.WebLoader,
              compiler: F,
              parser: N,
              lexer: k,
              runtime: t,
              lib: g,
              nodes: n,
              installJinjaCompat: a,
              configure: y,
              reset: function() {
                o = void 0;
              },
              compile: function(c, e, i, r) {
                return o || y(), new b(c, e, i, r);
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
          (function(B, I, T) {
            var g = T(13), E = [], p = [], b = g.makeRequestCallFromTimer(_);
            function _() {
              if (p.length)
                throw p.shift();
            }
            B.exports = w;
            function w(F) {
              var N;
              E.length ? N = E.pop() : N = new K(), N.task = F, g(N);
            }
            function K() {
              this.task = null;
            }
            K.prototype.call = function() {
              try {
                this.task.call();
              } catch (F) {
                w.onerror ? w.onerror(F) : (p.push(F), b());
              } finally {
                this.task = null, E[E.length] = this;
              }
            };
          }),
          /* 13 */
          /***/
          (function(B, I, T) {
            (function(g) {
              B.exports = E;
              function E(n) {
                p.length || b(), p[p.length] = n;
              }
              var p = [], b, _ = 0, w = 1024;
              function K() {
                for (; _ < p.length; ) {
                  var n = _;
                  if (_ = _ + 1, p[n].call(), _ > w) {
                    for (var a = 0, o = p.length - _; a < o; a++)
                      p[a] = p[a + _];
                    p.length -= _, _ = 0;
                  }
                }
                p.length = 0, _ = 0;
              }
              var F = typeof g < "u" ? g : self, N = F.MutationObserver || F.WebKitMutationObserver;
              typeof N == "function" ? b = k(K) : b = t(K), E.requestFlush = b;
              function k(n) {
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
            }).call(I, T(14));
          }),
          /* 14 */
          /***/
          (function(B, I) {
            var T;
            T = /* @__PURE__ */ (function() {
              return this;
            })();
            try {
              T = T || Function("return this")() || (0, eval)("this");
            } catch {
              typeof window == "object" && (T = window);
            }
            B.exports = T;
          }),
          /* 15 */
          /***/
          (function(B, I, T) {
            var g, E;
            (function(p) {
              var b = function() {
                var N = Array.prototype.slice.call(arguments);
                typeof N[0] == "function" && N[0].apply(null, N.splice(1));
              }, _ = function(N) {
                typeof setImmediate == "function" ? setImmediate(N) : typeof process < "u" && process.nextTick ? process.nextTick(N) : setTimeout(N, 0);
              }, w = function(N) {
                var k = function(t) {
                  var n = function() {
                    return N.length && N[t].apply(null, arguments), n.next();
                  };
                  return n.next = function() {
                    return t < N.length - 1 ? k(t + 1) : null;
                  }, n;
                };
                return k(0);
              }, K = Array.isArray || function(N) {
                return Object.prototype.toString.call(N) === "[object Array]";
              }, F = function(N, k, t) {
                var n = t ? _ : b;
                if (k = k || function() {
                }, !K(N)) {
                  var a = new Error("First argument to waterfall must be an array of functions");
                  return k(a);
                }
                if (!N.length)
                  return k();
                var o = function(y) {
                  return function(c) {
                    if (c)
                      k.apply(null, arguments), k = function() {
                      };
                    else {
                      var e = Array.prototype.slice.call(arguments, 1), i = y.next();
                      i ? e.push(o(i)) : e.push(k), n(function() {
                        y.apply(null, e);
                      });
                    }
                  };
                };
                o(w(N))();
              };
              g = [], E = (function() {
                return F;
              }).apply(I, g), E !== void 0 && (B.exports = E);
            })();
          }),
          /* 16 */
          /***/
          (function(B, I, T) {
            var g = typeof Reflect == "object" ? Reflect : null, E = g && typeof g.apply == "function" ? g.apply : function(l, s, h) {
              return Function.prototype.apply.call(l, s, h);
            }, p;
            g && typeof g.ownKeys == "function" ? p = g.ownKeys : Object.getOwnPropertySymbols ? p = function(l) {
              return Object.getOwnPropertyNames(l).concat(Object.getOwnPropertySymbols(l));
            } : p = function(l) {
              return Object.getOwnPropertyNames(l);
            };
            function b(l) {
              console && console.warn && console.warn(l);
            }
            var _ = Number.isNaN || function(l) {
              return l !== l;
            };
            function w() {
              w.init.call(this);
            }
            B.exports = w, B.exports.once = i, w.EventEmitter = w, w.prototype._events = void 0, w.prototype._eventsCount = 0, w.prototype._maxListeners = void 0;
            var K = 10;
            function F(l) {
              if (typeof l != "function")
                throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof l);
            }
            Object.defineProperty(w, "defaultMaxListeners", {
              enumerable: !0,
              get: function() {
                return K;
              },
              set: function(l) {
                if (typeof l != "number" || l < 0 || _(l))
                  throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + l + ".");
                K = l;
              }
            }), w.init = function() {
              (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
            }, w.prototype.setMaxListeners = function(l) {
              if (typeof l != "number" || l < 0 || _(l))
                throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + l + ".");
              return this._maxListeners = l, this;
            };
            function N(l) {
              return l._maxListeners === void 0 ? w.defaultMaxListeners : l._maxListeners;
            }
            w.prototype.getMaxListeners = function() {
              return N(this);
            }, w.prototype.emit = function(l) {
              for (var s = [], h = 1; h < arguments.length; h++) s.push(arguments[h]);
              var f = l === "error", x = this._events;
              if (x !== void 0)
                f = f && x.error === void 0;
              else if (!f)
                return !1;
              if (f) {
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
                for (var m = C.length, O = y(C, m), h = 0; h < m; ++h)
                  E(O[h], this, s);
              return !0;
            };
            function k(l, s, h, f) {
              var x, L, S;
              if (F(h), L = l._events, L === void 0 ? (L = l._events = /* @__PURE__ */ Object.create(null), l._eventsCount = 0) : (L.newListener !== void 0 && (l.emit(
                "newListener",
                s,
                h.listener ? h.listener : h
              ), L = l._events), S = L[s]), S === void 0)
                S = L[s] = h, ++l._eventsCount;
              else if (typeof S == "function" ? S = L[s] = f ? [h, S] : [S, h] : f ? S.unshift(h) : S.push(h), x = N(l), x > 0 && S.length > x && !S.warned) {
                S.warned = !0;
                var C = new Error("Possible EventEmitter memory leak detected. " + S.length + " " + String(s) + " listeners added. Use emitter.setMaxListeners() to increase limit");
                C.name = "MaxListenersExceededWarning", C.emitter = l, C.type = s, C.count = S.length, b(C);
              }
              return l;
            }
            w.prototype.addListener = function(l, s) {
              return k(this, l, s, !1);
            }, w.prototype.on = w.prototype.addListener, w.prototype.prependListener = function(l, s) {
              return k(this, l, s, !0);
            };
            function t() {
              if (!this.fired)
                return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
            }
            function n(l, s, h) {
              var f = { fired: !1, wrapFn: void 0, target: l, type: s, listener: h }, x = t.bind(f);
              return x.listener = h, f.wrapFn = x, x;
            }
            w.prototype.once = function(l, s) {
              return F(s), this.on(l, n(this, l, s)), this;
            }, w.prototype.prependOnceListener = function(l, s) {
              return F(s), this.prependListener(l, n(this, l, s)), this;
            }, w.prototype.removeListener = function(l, s) {
              var h, f, x, L, S;
              if (F(s), f = this._events, f === void 0)
                return this;
              if (h = f[l], h === void 0)
                return this;
              if (h === s || h.listener === s)
                --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete f[l], f.removeListener && this.emit("removeListener", l, h.listener || s));
              else if (typeof h != "function") {
                for (x = -1, L = h.length - 1; L >= 0; L--)
                  if (h[L] === s || h[L].listener === s) {
                    S = h[L].listener, x = L;
                    break;
                  }
                if (x < 0)
                  return this;
                x === 0 ? h.shift() : c(h, x), h.length === 1 && (f[l] = h[0]), f.removeListener !== void 0 && this.emit("removeListener", l, S || s);
              }
              return this;
            }, w.prototype.off = w.prototype.removeListener, w.prototype.removeAllListeners = function(l) {
              var s, h, f;
              if (h = this._events, h === void 0)
                return this;
              if (h.removeListener === void 0)
                return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : h[l] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete h[l]), this;
              if (arguments.length === 0) {
                var x = Object.keys(h), L;
                for (f = 0; f < x.length; ++f)
                  L = x[f], L !== "removeListener" && this.removeAllListeners(L);
                return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
              }
              if (s = h[l], typeof s == "function")
                this.removeListener(l, s);
              else if (s !== void 0)
                for (f = s.length - 1; f >= 0; f--)
                  this.removeListener(l, s[f]);
              return this;
            };
            function a(l, s, h) {
              var f = l._events;
              if (f === void 0)
                return [];
              var x = f[s];
              return x === void 0 ? [] : typeof x == "function" ? h ? [x.listener || x] : [x] : h ? e(x) : y(x, x.length);
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
                var h = s[l];
                if (typeof h == "function")
                  return 1;
                if (h !== void 0)
                  return h.length;
              }
              return 0;
            }
            w.prototype.eventNames = function() {
              return this._eventsCount > 0 ? p(this._events) : [];
            };
            function y(l, s) {
              for (var h = new Array(s), f = 0; f < s; ++f)
                h[f] = l[f];
              return h;
            }
            function c(l, s) {
              for (; s + 1 < l.length; s++)
                l[s] = l[s + 1];
              l.pop();
            }
            function e(l) {
              for (var s = new Array(l.length), h = 0; h < s.length; ++h)
                s[h] = l[h].listener || l[h];
              return s;
            }
            function i(l, s) {
              return new Promise(function(h, f) {
                function x(S) {
                  l.removeListener(s, L), f(S);
                }
                function L() {
                  typeof l.removeListener == "function" && l.removeListener("error", x), h([].slice.call(arguments));
                }
                u(l, s, L, { once: !0 }), s !== "error" && r(l, x, { once: !0 });
              });
            }
            function r(l, s, h) {
              typeof l.on == "function" && u(l, "error", s, h);
            }
            function u(l, s, h, f) {
              if (typeof l.on == "function")
                f.once ? l.once(s, h) : l.on(s, h);
              else if (typeof l.addEventListener == "function")
                l.addEventListener(s, function x(L) {
                  f.once && l.removeEventListener(s, x), h(L);
                });
              else
                throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof l);
            }
          }),
          /* 17 */
          /***/
          (function(B, I, T) {
            var g = T(3), E = T(0), p = 0;
            function b() {
              return "hole_" + p++;
            }
            function _(o, y) {
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
                var i = _(o.children, function(h) {
                  return w(h, y, c);
                });
                i !== o.children && (o = new g[o.typename](o.lineno, o.colno, i));
              } else if (o instanceof g.CallExtension) {
                var r = w(o.args, y, c), u = _(o.contentArgs, function(h) {
                  return w(h, y, c);
                });
                (r !== o.args || u !== o.contentArgs) && (o = new g[o.typename](o.extName, o.prop, r, u));
              } else {
                var l = o.fields.map(function(h) {
                  return o[h];
                }), s = _(l, function(h) {
                  return w(h, y, c);
                });
                s !== l && (o = new g[o.typename](o.lineno, o.colno), s.forEach(function(h, f) {
                  o[o.fields[f]] = h;
                }));
              }
              return c && y(o) || o;
            }
            function K(o, y) {
              return w(o, y, !0);
            }
            function F(o, y, c) {
              var e = [], i = K(c ? o[c] : o, function(r) {
                var u;
                return r instanceof g.Block ? r : ((r instanceof g.Filter && E.indexOf(y, r.name.value) !== -1 || r instanceof g.CallExtensionAsync) && (u = new g.Symbol(r.lineno, r.colno, b()), e.push(new g.FilterAsync(r.lineno, r.colno, r.name, r.args, u))), u);
              });
              return c ? o[c] = i : o = i, e.length ? (e.push(o), new g.NodeList(o.lineno, o.colno, e)) : o;
            }
            function N(o, y) {
              return K(o, function(c) {
                return c instanceof g.Output ? F(c, y) : c instanceof g.Set ? F(c, y, "value") : c instanceof g.For ? F(c, y, "arr") : c instanceof g.If ? F(c, y, "cond") : c instanceof g.CallExtension ? F(c, y, "args") : void 0;
              });
            }
            function k(o) {
              return w(o, function(y) {
                if (y instanceof g.Block) {
                  var c = !1, e = b();
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
              return t(k(N(o, y)));
            }
            function a(o, y) {
              return n(o, y || []);
            }
            B.exports = {
              transform: a
            };
          }),
          /* 18 */
          /***/
          (function(B, p, T) {
            var g = T(0), E = T(2), p = B.exports = {};
            function b(v, A) {
              return v == null || v === !1 ? A : v;
            }
            p.abs = Math.abs;
            function _(v) {
              return v !== v;
            }
            function w(v, A, M) {
              var U, Z = [], z = [];
              for (U = 0; U < v.length; U++)
                U % A === 0 && z.length && (Z.push(z), z = []), z.push(v[U]);
              if (z.length) {
                if (M)
                  for (U = z.length; U < A; U++)
                    z.push(M);
                Z.push(z);
              }
              return Z;
            }
            p.batch = w;
            function K(v) {
              v = b(v, "");
              var A = v.toLowerCase();
              return E.copySafeness(v, A.charAt(0).toUpperCase() + A.slice(1));
            }
            p.capitalize = K;
            function F(v, A) {
              if (v = b(v, ""), A = A || 80, v.length >= A)
                return v;
              var M = A - v.length, U = g.repeat(" ", M / 2 - M % 2), Z = g.repeat(" ", M / 2);
              return E.copySafeness(v, U + v + Z);
            }
            p.center = F;
            function N(v, A, M) {
              return M ? v || A : v !== void 0 ? v : A;
            }
            p.default = N;
            function k(v, A, M) {
              if (!g.isObject(v))
                throw new g.TemplateError("dictsort filter: val must be an object");
              var U = [];
              for (var Z in v)
                U.push([Z, v[Z]]);
              var z;
              if (M === void 0 || M === "key")
                z = 0;
              else if (M === "value")
                z = 1;
              else
                throw new g.TemplateError("dictsort filter: You can only sort by either key or value");
              return U.sort(function(te, q) {
                var ce = te[z], he = q[z];
                return A || (g.isString(ce) && (ce = ce.toUpperCase()), g.isString(he) && (he = he.toUpperCase())), ce > he ? 1 : ce === he ? 0 : -1;
              }), U;
            }
            p.dictsort = k;
            function t(v, A) {
              return JSON.stringify(v, null, A);
            }
            p.dump = t;
            function n(v) {
              return v instanceof E.SafeString ? v : (v = v ?? "", E.markSafe(g.escape(v.toString())));
            }
            p.escape = n;
            function a(v) {
              return v instanceof E.SafeString ? v : (v = v ?? "", E.markSafe(v.toString()));
            }
            p.safe = a;
            function o(v) {
              return v[0];
            }
            p.first = o;
            function y(v) {
              return v = v ?? "", E.markSafe(g.escape(v.toString()));
            }
            p.forceescape = y;
            function c(v, A) {
              return g.groupBy(v, A, this.env.opts.throwOnUndefined);
            }
            p.groupby = c;
            function e(v, A, M) {
              if (v = b(v, ""), v === "")
                return "";
              A = A || 4;
              var U = v.split(`
`), Z = g.repeat(" ", A), z = U.map(function(te, q) {
                return q === 0 && !M ? te : "" + Z + te;
              }).join(`
`);
              return E.copySafeness(v, z);
            }
            p.indent = e;
            function i(v, A, M) {
              return A = A || "", M && (v = g.map(v, function(U) {
                return U[M];
              })), v.join(A);
            }
            p.join = i;
            function r(v) {
              return v[v.length - 1];
            }
            p.last = r;
            function u(v) {
              var A = b(v, "");
              return A !== void 0 ? typeof Map == "function" && A instanceof Map || typeof Set == "function" && A instanceof Set ? A.size : g.isObject(A) && !(A instanceof E.SafeString) ? g.keys(A).length : A.length : 0;
            }
            p.length = u;
            function l(v) {
              if (g.isString(v))
                return v.split("");
              if (g.isObject(v))
                return g._entries(v || {}).map(function(A) {
                  var M = A[0], U = A[1];
                  return {
                    key: M,
                    value: U
                  };
                });
              if (g.isArray(v))
                return v;
              throw new g.TemplateError("list filter: type not iterable");
            }
            p.list = l;
            function s(v) {
              return v = b(v, ""), v.toLowerCase();
            }
            p.lower = s;
            function h(v) {
              return v == null ? "" : E.copySafeness(v, v.replace(/\r\n|\n/g, `<br />
`));
            }
            p.nl2br = h;
            function f(v) {
              return v[Math.floor(Math.random() * v.length)];
            }
            p.random = f;
            function x(v) {
              function A(M, U, Z) {
                U === void 0 && (U = "truthy");
                var z = this, te = z.env.getTest(U);
                return g.toArray(M).filter(function(q) {
                  return te.call(z, q, Z) === v;
                });
              }
              return A;
            }
            p.reject = x(!1);
            function L(v, A) {
              return v.filter(function(M) {
                return !M[A];
              });
            }
            p.rejectattr = L, p.select = x(!0);
            function S(v, A) {
              return v.filter(function(M) {
                return !!M[A];
              });
            }
            p.selectattr = S;
            function C(v, A, M, U) {
              var Z = v;
              if (A instanceof RegExp)
                return v.replace(A, M);
              typeof U > "u" && (U = -1);
              var z = "";
              if (typeof A == "number")
                A = "" + A;
              else if (typeof A != "string")
                return v;
              if (typeof v == "number" && (v = "" + v), typeof v != "string" && !(v instanceof E.SafeString))
                return v;
              if (A === "")
                return z = M + v.split("").join(M) + M, E.copySafeness(v, z);
              var te = v.indexOf(A);
              if (U === 0 || te === -1)
                return v;
              for (var q = 0, ce = 0; te > -1 && (U === -1 || ce < U); )
                z += v.substring(q, te) + M, q = te + A.length, ce++, te = v.indexOf(A, q);
              return q < v.length && (z += v.substring(q)), E.copySafeness(Z, z);
            }
            p.replace = C;
            function m(v) {
              var A;
              return g.isString(v) ? A = l(v) : A = g.map(v, function(M) {
                return M;
              }), A.reverse(), g.isString(v) ? E.copySafeness(v, A.join("")) : A;
            }
            p.reverse = m;
            function O(v, A, M) {
              A = A || 0;
              var U = Math.pow(10, A), Z;
              return M === "ceil" ? Z = Math.ceil : M === "floor" ? Z = Math.floor : Z = Math.round, Z(v * U) / U;
            }
            p.round = O;
            function d(v, A, M) {
              for (var U = Math.floor(v.length / A), Z = v.length % A, z = [], te = 0, q = 0; q < A; q++) {
                var ce = te + q * U;
                q < Z && te++;
                var he = te + (q + 1) * U, pe = v.slice(ce, he);
                M && q >= Z && pe.push(M), z.push(pe);
              }
              return z;
            }
            p.slice = d;
            function R(v, A, M) {
              return M === void 0 && (M = 0), A && (v = g.map(v, function(U) {
                return U[A];
              })), M + v.reduce(function(U, Z) {
                return U + Z;
              }, 0);
            }
            p.sum = R, p.sort = E.makeMacro(["value", "reverse", "case_sensitive", "attribute"], [], function(v, A, M, U) {
              var Z = this, z = g.map(v, function(q) {
                return q;
              }), te = g.getAttrGetter(U);
              return z.sort(function(q, ce) {
                var he = U ? te(q) : q, pe = U ? te(ce) : ce;
                if (Z.env.opts.throwOnUndefined && U && (he === void 0 || pe === void 0))
                  throw new TypeError('sort: attribute "' + U + '" resolved to undefined');
                return !M && g.isString(he) && g.isString(pe) && (he = he.toLowerCase(), pe = pe.toLowerCase()), he < pe ? A ? 1 : -1 : he > pe ? A ? -1 : 1 : 0;
              }), z;
            });
            function P(v) {
              return E.copySafeness(v, v);
            }
            p.string = P;
            function j(v, A) {
              v = b(v, "");
              var M = /<\/?([a-z][a-z0-9]*)\b[^>]*>|<!--[\s\S]*?-->/gi, U = Y(v.replace(M, "")), Z = "";
              return A ? Z = U.replace(/^ +| +$/gm, "").replace(/ +/g, " ").replace(/(\r\n)/g, `
`).replace(/\n\n\n+/g, `

`) : Z = U.replace(/\s+/gi, " "), E.copySafeness(v, Z);
            }
            p.striptags = j;
            function J(v) {
              v = b(v, "");
              var A = v.split(" ").map(function(M) {
                return K(M);
              });
              return E.copySafeness(v, A.join(" "));
            }
            p.title = J;
            function Y(v) {
              return E.copySafeness(v, v.replace(/^\s*|\s*$/g, ""));
            }
            p.trim = Y;
            function X(v, A, M, U) {
              var Z = v;
              if (v = b(v, ""), A = A || 255, v.length <= A)
                return v;
              if (M)
                v = v.substring(0, A);
              else {
                var z = v.lastIndexOf(" ", A);
                z === -1 && (z = A), v = v.substring(0, z);
              }
              return v += U ?? "...", E.copySafeness(Z, v);
            }
            p.truncate = X;
            function le(v) {
              return v = b(v, ""), v.toUpperCase();
            }
            p.upper = le;
            function oe(v) {
              var A = encodeURIComponent;
              if (g.isString(v))
                return A(v);
              var M = g.isArray(v) ? v : g._entries(v);
              return M.map(function(U) {
                var Z = U[0], z = U[1];
                return A(Z) + "=" + A(z);
              }).join("&");
            }
            p.urlencode = oe;
            var Q = /^(?:\(|<|&lt;)?(.*?)(?:\.|,|\)|\n|&gt;)?$/, V = /^[\w.!#$%&'*+\-\/=?\^`{|}~]+@[a-z\d\-]+(\.[a-z\d\-]+)+$/i, G = /^https?:\/\/.*$/, D = /^www\./, se = /\.(?:org|net|com)(?:\:|\/|$)/;
            function fe(v, A, M) {
              _(A) && (A = 1 / 0);
              var U = M === !0 ? ' rel="nofollow"' : "", Z = v.split(/(\s+)/).filter(function(z) {
                return z && z.length;
              }).map(function(z) {
                var te = z.match(Q), q = te ? te[1] : z, ce = q.substr(0, A);
                return G.test(q) ? '<a href="' + q + '"' + U + ">" + ce + "</a>" : D.test(q) ? '<a href="http://' + q + '"' + U + ">" + ce + "</a>" : V.test(q) ? '<a href="mailto:' + q + '">' + q + "</a>" : se.test(q) ? '<a href="http://' + q + '"' + U + ">" + ce + "</a>" : z;
              });
              return Z.join("");
            }
            p.urlize = fe;
            function de(v) {
              v = b(v, "");
              var A = v ? v.match(/\w+/g) : null;
              return A ? A.length : null;
            }
            p.wordcount = de;
            function ae(v, A) {
              var M = parseFloat(v);
              return _(M) ? A : M;
            }
            p.float = ae;
            var _e = E.makeMacro(["value", "default", "base"], [], function(v, A, M) {
              M === void 0 && (M = 10);
              var U = parseInt(v, M);
              return _(U) ? A : U;
            });
            p.int = _e, p.d = p.default, p.e = p.escape;
          }),
          /* 19 */
          /***/
          (function(B, I, T) {
            function g(_, w) {
              _.prototype = Object.create(w.prototype), _.prototype.constructor = _, E(_, w);
            }
            function E(_, w) {
              return E = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(K, F) {
                return K.__proto__ = F, K;
              }, E(_, w);
            }
            var p = T(6), b = /* @__PURE__ */ (function(_) {
              g(w, _);
              function w(F) {
                var N;
                return N = _.call(this) || this, N.precompiled = F || {}, N;
              }
              var K = w.prototype;
              return K.getSource = function(F) {
                return this.precompiled[F] ? {
                  src: {
                    type: "code",
                    obj: this.precompiled[F]
                  },
                  path: F
                } : null;
              }, w;
            })(p);
            B.exports = {
              PrecompiledLoader: b
            };
          }),
          /* 20 */
          /***/
          (function(B, I, T) {
            var g = T(2).SafeString;
            function E(f) {
              return typeof f == "function";
            }
            I.callable = E;
            function p(f) {
              return f !== void 0;
            }
            I.defined = p;
            function b(f, x) {
              return f % x === 0;
            }
            I.divisibleby = b;
            function _(f) {
              return f instanceof g;
            }
            I.escaped = _;
            function w(f, x) {
              return f === x;
            }
            I.equalto = w, I.eq = I.equalto, I.sameas = I.equalto;
            function K(f) {
              return f % 2 === 0;
            }
            I.even = K;
            function F(f) {
              return !f;
            }
            I.falsy = F;
            function N(f, x) {
              return f >= x;
            }
            I.ge = N;
            function k(f, x) {
              return f > x;
            }
            I.greaterthan = k, I.gt = I.greaterthan;
            function t(f, x) {
              return f <= x;
            }
            I.le = t;
            function n(f, x) {
              return f < x;
            }
            I.lessthan = n, I.lt = I.lessthan;
            function a(f) {
              return f.toLowerCase() === f;
            }
            I.lower = a;
            function o(f, x) {
              return f !== x;
            }
            I.ne = o;
            function y(f) {
              return f === null;
            }
            I.null = y;
            function c(f) {
              return typeof f == "number";
            }
            I.number = c;
            function e(f) {
              return f % 2 === 1;
            }
            I.odd = e;
            function i(f) {
              return typeof f == "string";
            }
            I.string = i;
            function r(f) {
              return !!f;
            }
            I.truthy = r;
            function u(f) {
              return f === void 0;
            }
            I.undefined = u;
            function l(f) {
              return f.toUpperCase() === f;
            }
            I.upper = l;
            function s(f) {
              return typeof Symbol < "u" ? !!f[Symbol.iterator] : Array.isArray(f) || typeof f == "string";
            }
            I.iterable = s;
            function h(f) {
              var x = f != null && typeof f == "object" && !Array.isArray(f);
              return Set ? x && !(f instanceof Set) : x;
            }
            I.mapping = h;
          }),
          /* 21 */
          /***/
          (function(B, I, T) {
            function g(b) {
              var _ = -1;
              return {
                current: null,
                reset: function() {
                  _ = -1, this.current = null;
                },
                next: function() {
                  return _++, _ >= b.length && (_ = 0), this.current = b[_], this.current;
                }
              };
            }
            function E(b) {
              b = b || ",";
              var _ = !0;
              return function() {
                var w = _ ? "" : b;
                return _ = !1, w;
              };
            }
            function p() {
              return {
                range: function(b, _, w) {
                  typeof _ > "u" ? (_ = b, b = 0, w = 1) : w || (w = 1);
                  var K = [];
                  if (w > 0)
                    for (var F = b; F < _; F += w)
                      K.push(F);
                  else
                    for (var N = b; N > _; N += w)
                      K.push(N);
                  return K;
                },
                cycler: function() {
                  return g(Array.prototype.slice.call(arguments));
                },
                joiner: function(b) {
                  return E(b);
                }
              };
            }
            B.exports = p;
          }),
          /* 22 */
          /***/
          (function(B, I, T) {
            var g = T(4);
            B.exports = function(E, p) {
              function b(_, w) {
                if (this.name = _, this.path = _, this.defaultEngine = w.defaultEngine, this.ext = g.extname(_), !this.ext && !this.defaultEngine)
                  throw new Error("No default engine was specified and no extension was provided.");
                this.ext || (this.name += this.ext = (this.defaultEngine[0] !== "." ? "." : "") + this.defaultEngine);
              }
              return b.prototype.render = function(_, w) {
                E.render(this.name, _, w);
              }, p.set("view", b), p.set("nunjucksEnv", E), E;
            };
          }),
          /* 23 */
          /***/
          (function(B, I, T) {
            var g = T(4), E = T(4), p = T(0), b = p._prettifyError, _ = T(5), w = T(7), K = w.Environment, F = T(24);
            function N(a, o) {
              return Array.isArray(o) ? o.some(function(y) {
                return a.match(y);
              }) : !1;
            }
            function k(a, o) {
              o = o || {}, o.isString = !0;
              var y = o.env || new K([]), c = o.wrapper || F;
              if (!o.name)
                throw new Error('the "name" option is required when compiling a string');
              return c([n(a, o.name, y)], o);
            }
            function t(a, o) {
              o = o || {};
              var y = o.env || new K([]), c = o.wrapper || F;
              if (o.isString)
                return k(a, o);
              var e = g.existsSync(a) && g.statSync(a), i = [], r = [];
              function u(h) {
                g.readdirSync(h).forEach(function(f) {
                  var x = E.join(h, f), L = x.substr(E.join(a, "/").length), S = g.statSync(x);
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
                  } catch (h) {
                    if (o.force)
                      console.error(h);
                    else
                      throw h;
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
                i = _.compile(a, c, e, o, y.opts);
              } catch (r) {
                throw b(o, !1, r);
              }
              return {
                name: o,
                template: i
              };
            }
            B.exports = {
              precompile: t,
              precompileString: k
            };
          }),
          /* 24 */
          /***/
          (function(B, I, T) {
            function g(E, p) {
              var b = "";
              p = p || {};
              for (var _ = 0; _ < E.length; _++) {
                var w = JSON.stringify(E[_].name), K = E[_].template;
                b += "(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})[" + w + `] = (function() {
` + K + `
})();
`, p.asFunction && (b += "return function(ctx, cb) { return nunjucks.render(" + w + `, ctx, cb); }
`), b += `})();
`;
              }
              return b;
            }
            B.exports = g;
          }),
          /* 25 */
          /***/
          (function(B, I, T) {
            function g() {
              var E = this.runtime, p = this.lib, b = this.compiler.Compiler, _ = this.parser.Parser, w = this.nodes, K = this.lexer, F = E.contextOrFrameLookup, N = E.memberLookup, k, t;
              b && (k = b.prototype.assertType), _ && (t = _.prototype.parseAggregate);
              function n() {
                E.contextOrFrameLookup = F, E.memberLookup = N, b && (b.prototype.assertType = k), _ && (_.prototype.parseAggregate = t);
              }
              E.contextOrFrameLookup = function(r, u, l) {
                var s = F.apply(this, arguments);
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
              if (w && b && _) {
                var o = w.Node.extend("Slice", {
                  fields: ["start", "stop", "step"],
                  init: function(r, u, l, s, h) {
                    l = l || new w.Literal(r, u, null), s = s || new w.Literal(r, u, null), h = h || new w.Literal(r, u, 1), this.parent(r, u, l, s, h);
                  }
                });
                b.prototype.assertType = function(r) {
                  r instanceof o || k.apply(this, arguments);
                }, b.prototype.compileSlice = function(r, u) {
                  this._emit("("), this._compileExpression(r.start, u), this._emit("),("), this._compileExpression(r.stop, u), this._emit("),("), this._compileExpression(r.step, u), this._emit(")");
                }, _.prototype.parseAggregate = function() {
                  var r = this, u = a(this.tokens);
                  u.colno--, u.index--;
                  try {
                    return t.apply(this);
                  } catch (C) {
                    var l = a(this.tokens), s = function() {
                      return p._assign(r.tokens, l), C;
                    };
                    p._assign(this.tokens, u), this.peeked = !1;
                    var h = this.peekToken();
                    if (h.type !== K.TOKEN_LEFT_BRACKET)
                      throw s();
                    this.nextToken();
                    for (var f = new o(h.lineno, h.colno), x = !1, L = 0; L <= f.fields.length && !this.skip(K.TOKEN_RIGHT_BRACKET); L++) {
                      if (L === f.fields.length)
                        if (x)
                          this.fail("parseSlice: too many slice components", h.lineno, h.colno);
                        else
                          break;
                      if (this.skip(K.TOKEN_COLON))
                        x = !0;
                      else {
                        var S = f.fields[L];
                        f[S] = this.parseExpression(), x = this.skip(K.TOKEN_COLON) || x;
                      }
                    }
                    if (!x)
                      throw s();
                    return new w.Array(h.lineno, h.colno, [f]);
                  }
                };
              }
              function y(r, u, l, s) {
                r = r || [], u === null && (u = s < 0 ? r.length - 1 : 0), l === null ? l = s < 0 ? -1 : r.length : l < 0 && (l += r.length), u < 0 && (u += r.length);
                for (var h = [], f = u; !(f < 0 || f > r.length || s > 0 && f >= l || s < 0 && f <= l); f += s)
                  h.push(E.memberLookup(r, f));
                return h;
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
                  return p._entries(this);
                },
                values: function() {
                  return p._values(this);
                },
                keys: function() {
                  return p.keys(this);
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
                  var r = p.keys(this);
                  if (!r.length)
                    throw new Error("KeyError");
                  var u = r[0], l = this[u];
                  return delete this[u], [u, l];
                },
                setdefault: function(r, u) {
                  return u === void 0 && (u = null), r in this || (this[r] = u), this[r];
                },
                update: function(r) {
                  return p._assign(this, r), null;
                }
              };
              return i.iteritems = i.items, i.itervalues = i.values, i.iterkeys = i.keys, E.memberLookup = function(r, u, l) {
                return arguments.length === 4 ? y.apply(this, arguments) : (r = r || {}, p.isArray(r) && c(e, u) ? e[u].bind(r) : p.isObject(r) && c(i, u) ? i[u].bind(r) : N.apply(this, arguments));
              }, n;
            }
            B.exports = g;
          })
          /******/
        ])
      );
    });
  })(xe)), xe.exports;
}
var Ge = De();
const We = /* @__PURE__ */ Ue(Ge);
function $e(H) {
  const ie = {};
  for (const [I, T] of Object.entries(H.templates))
    ie[I] = We.compile(T);
  const B = (I) => {
    I.result = {};
    for (const T of Object.keys(H.templates))
      I.result[T] = ie[T].render(I.properties || {});
  };
  return "features" in H.geojson ? H.geojson.features.forEach(B) : B(H.geojson), H.geojson;
}
const ze = {
  templateExtractor: $e
};
function Ae(H) {
  const ie = {
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
  return Object.keys(ie).reduce((B, I) => {
    if (B[I] !== void 0)
      throw new Error(`Invalid Maplat option key: ${I}. Use "${ie[I]}" instead.`);
    return B;
  }, H);
}
const Ye = /\{%-?\s*(raw|verbatim)\s*-?%\}[\s\S]*?\{%-?\s*end\1\s*-?%\}/g, Je = /<%[\s\S]*?%>/, Ze = /\$\{[^}]*\}/, Xe = 'MaplatApp: poiTemplate/iconTemplate written in the lodash.template syntax (<% %>, <%= %>, <%- %>, ${ }) is no longer evaluated since @maplat/core 1.3.0, and was ignored. Rewrite it in the Nunjucks syntax ({{ }}, {% %}); wrap literal "<%" or "${" in {% raw %}...{% endraw %}.', qe = 'See the "Removed" section of the 1.3.0 CHANGELOG: https://github.com/code4history/MaplatCore/blob/master/CHANGELOG.md';
let Le = !1, Te = !1;
function Se(H) {
  return Array.from(H).slice(0, 80).join("");
}
function Qe(H) {
  const ie = H.replace(Ye, "");
  return Je.test(ie) || Ze.test(ie);
}
function He(H, ie) {
  Le || (Le = !0, console.warn(`${Xe} First template found (${H}): "${Se(ie)}". ${qe}`));
}
function we(H, ie) {
  if (Te) return;
  Te = !0;
  const I = (ie instanceof Error ? ie.message : String(ie)).split(`
`).map((T) => T.trim()).filter((T) => T).join(" ");
  console.warn(`MaplatApp: a poiTemplate/iconTemplate failed to render and was ignored: ${I}. First template: "${Se(H)}".`);
}
function Ce(H, ie, B) {
  if (Qe(ie)) {
    He(H, ie);
    return;
  }
  try {
    const I = { type: "Feature", geometry: null, properties: B };
    return ze.templateExtractor({ geojson: I, templates: { t: ie } }), I.result.t;
  } catch (I) {
    we(ie, I);
    return;
  }
}
function et(H, ie) {
  const B = Ce("iconTemplate", H, ie);
  if (B === void 0) return;
  let I;
  try {
    I = JSON.parse(B);
  } catch (T) {
    we(H, T);
    return;
  }
  if (I === null || typeof I != "object" || Array.isArray(I)) {
    we(H, new Error("iconTemplate did not produce a JSON object"));
    return;
  }
  return I;
}
function tt(H, ...ie) {
  const B = Ae(Object.assign({}, H));
  if (B.icon) return B;
  const I = ie.reduce((T, g) => {
    if (T) return T;
    const E = g.iconTemplate, p = E ? et(E, B) : void 0;
    if (p)
      return p;
    if (g.icon)
      return {
        icon: g.icon,
        selectedIcon: g.selectedIcon
      };
  }, void 0);
  return I && (B.icon = I.icon, B.selectedIcon = I.selectedIcon), B;
}
function nt(H, ...ie) {
  const B = Ae(H);
  return B.html ? B : ie.reduce((I, T) => {
    if (I) return I;
    const g = T.poiTemplate;
    if (g) {
      const E = Ce("poiTemplate", g, B);
      return E === void 0 ? void 0 : (B.html = E, B.poiStyle = B.poiStyle || T.poiStyle, B);
    }
  }, void 0) || B;
}
function it(H, ...ie) {
  const B = tt(H, ...ie);
  return nt(B, ...ie);
}
export {
  it as applyPoiTemplates,
  nt as createHtmlFromTemplate,
  tt as createIconSet
};
//# sourceMappingURL=maplat_core_template.js.map
