function Qe(A) {
  return A && A.__esModule && Object.prototype.hasOwnProperty.call(A, "default") ? A.default : A;
}
var Ae = { exports: {} }, Ye = Ae.exports, Ie;
function et() {
  return Ie || (Ie = 1, (function(A, U) {
    (function(S, I) {
      A.exports = I();
    })(typeof self < "u" ? self : Ye, function() {
      return (
        /******/
        (function(S) {
          var I = {};
          function L(_) {
            if (I[_])
              return I[_].exports;
            var E = I[_] = {
              /******/
              i: _,
              /******/
              l: !1,
              /******/
              exports: {}
              /******/
            };
            return S[_].call(E.exports, E, E.exports, L), E.l = !0, E.exports;
          }
          return L.m = S, L.c = I, L.d = function(_, E, u) {
            L.o(_, E) || Object.defineProperty(_, E, {
              /******/
              configurable: !1,
              /******/
              enumerable: !0,
              /******/
              get: u
              /******/
            });
          }, L.n = function(_) {
            var E = _ && _.__esModule ? (
              /******/
              (function() {
                return _.default;
              })
            ) : (
              /******/
              (function() {
                return _;
              })
            );
            return L.d(E, "a", E), E;
          }, L.o = function(_, E) {
            return Object.prototype.hasOwnProperty.call(_, E);
          }, L.p = "", L(L.s = 11);
        })([
          /* 0 */
          /***/
          (function(S, m, L) {
            var _ = Array.prototype, E = Object.prototype, u = {
              "&": "&amp;",
              '"': "&quot;",
              "'": "&#39;",
              "<": "&lt;",
              ">": "&gt;",
              "\\": "&#92;"
            }, g = /[&"'<>\\]/g, m = S.exports = {};
            function k(v, B) {
              return E.hasOwnProperty.call(v, B);
            }
            m.hasOwnProp = k;
            function K(v) {
              return u[v];
            }
            function R(v, B, j) {
              if (j.Update || (j = new m.TemplateError(j)), j.Update(v), !B) {
                var M = j;
                j = new Error(M.message), j.name = M.name;
              }
              return j;
            }
            m._prettifyError = R;
            function P(v, B, j) {
              var M, Z;
              v instanceof Error && (Z = v, v = Z.name + ": " + Z.message), Object.setPrototypeOf ? (M = new Error(v), Object.setPrototypeOf(M, P.prototype)) : (M = this, Object.defineProperty(M, "message", {
                enumerable: !1,
                writable: !0,
                value: v
              })), Object.defineProperty(M, "name", {
                value: "Template render error"
              }), Error.captureStackTrace && Error.captureStackTrace(M, this.constructor);
              var X;
              if (Z) {
                var Q = Object.getOwnPropertyDescriptor(Z, "stack");
                X = Q && (Q.get || function() {
                  return Q.value;
                }), X || (X = function() {
                  return Z.stack;
                });
              } else {
                var le = new Error(v).stack;
                X = function() {
                  return le;
                };
              }
              return Object.defineProperty(M, "stack", {
                get: function() {
                  return X.call(M);
                }
              }), Object.defineProperty(M, "cause", {
                value: Z
              }), M.lineno = B, M.colno = j, M.firstUpdate = !0, M.Update = function(oe) {
                var ee = "(" + (oe || "unknown path") + ")";
                return this.firstUpdate && (this.lineno && this.colno ? ee += " [Line " + this.lineno + ", Column " + this.colno + "]" : this.lineno && (ee += " [Line " + this.lineno + "]")), ee += `
 `, this.firstUpdate && (ee += " "), this.message = ee + (this.message || ""), this.firstUpdate = !1, this;
              }, M;
            }
            Object.setPrototypeOf ? Object.setPrototypeOf(P.prototype, Error.prototype) : P.prototype = Object.create(Error.prototype, {
              constructor: {
                value: P
              }
            }), m.TemplateError = P;
            function w(v) {
              return v.replace(g, K);
            }
            m.escape = w;
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
            function b(v) {
              return v ? typeof v == "string" ? v.split(".") : [v] : [];
            }
            function c(v) {
              var B = b(v);
              return function(j) {
                for (var M = j, Z = 0; Z < B.length; Z++) {
                  var X = B[Z];
                  if (k(M, X))
                    M = M[X];
                  else
                    return;
                }
                return M;
              };
            }
            m.getAttrGetter = c;
            function e(v, B, j) {
              for (var M = {}, Z = t(B) ? B : c(B), X = 0; X < v.length; X++) {
                var Q = v[X], le = Z(Q, X);
                if (le === void 0 && j === !0)
                  throw new TypeError('groupby: attribute "' + B + '" resolved to undefined');
                (M[le] || (M[le] = [])).push(Q);
              }
              return M;
            }
            m.groupBy = e;
            function i(v) {
              return Array.prototype.slice.call(v);
            }
            m.toArray = i;
            function r(v) {
              var B = [];
              if (!v)
                return B;
              for (var j = v.length, M = i(arguments).slice(1), Z = -1; ++Z < j; )
                x(M, v[Z]) === -1 && B.push(v[Z]);
              return B;
            }
            m.without = r;
            function f(v, B) {
              for (var j = "", M = 0; M < B; M++)
                j += v;
              return j;
            }
            m.repeat = f;
            function l(v, B, j) {
              if (v != null) {
                if (_.forEach && v.forEach === _.forEach)
                  v.forEach(B, j);
                else if (v.length === +v.length)
                  for (var M = 0, Z = v.length; M < Z; M++)
                    B.call(j, v[M], M, v);
              }
            }
            m.each = l;
            function s(v, B) {
              var j = [];
              if (v == null)
                return j;
              if (_.map && v.map === _.map)
                return v.map(B);
              for (var M = 0; M < v.length; M++)
                j[j.length] = B(v[M], M);
              return v.length === +v.length && (j.length = v.length), j;
            }
            m.map = s;
            function h(v, B, j) {
              var M = -1;
              function Z() {
                M++, M < v.length ? B(v[M], M, Z, j) : j();
              }
              Z();
            }
            m.asyncIter = h;
            function p(v, B, j) {
              var M = T(v || {}), Z = M.length, X = -1;
              function Q() {
                X++;
                var le = M[X];
                X < Z ? B(le, v[le], X, Z, Q) : j();
              }
              Q();
            }
            m.asyncFor = p;
            function x(v, B, j) {
              return Array.prototype.indexOf.call(v || [], B, j);
            }
            m.indexOf = x;
            function T(v) {
              var B = [];
              for (var j in v)
                k(v, j) && B.push(j);
              return B;
            }
            m.keys = T;
            function N(v) {
              return T(v).map(function(B) {
                return [B, v[B]];
              });
            }
            m._entries = N;
            function F(v) {
              return T(v).map(function(B) {
                return v[B];
              });
            }
            m._values = F;
            function d(v, B) {
              return v = v || {}, T(B).forEach(function(j) {
                v[j] = B[j];
              }), v;
            }
            m._assign = m.extend = d;
            function O(v, B) {
              if (n(B) || a(B))
                return B.indexOf(v) !== -1;
              if (o(B))
                return v in B;
              throw new Error('Cannot use "in" operator to search for "' + v + '" in unexpected types.');
            }
            m.inOperator = O;
          }),
          /* 1 */
          /***/
          (function(S, I, L) {
            function _(a, o) {
              for (var b = 0; b < o.length; b++) {
                var c = o[b];
                c.enumerable = c.enumerable || !1, c.configurable = !0, "value" in c && (c.writable = !0), Object.defineProperty(a, u(c.key), c);
              }
            }
            function E(a, o, b) {
              return o && _(a.prototype, o), Object.defineProperty(a, "prototype", { writable: !1 }), a;
            }
            function u(a) {
              var o = g(a, "string");
              return typeof o == "symbol" ? o : String(o);
            }
            function g(a, o) {
              if (typeof a != "object" || a === null) return a;
              var b = a[Symbol.toPrimitive];
              if (b !== void 0) {
                var c = b.call(a, o);
                if (typeof c != "object") return c;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return String(a);
            }
            function m(a, o) {
              a.prototype = Object.create(o.prototype), a.prototype.constructor = a, k(a, o);
            }
            function k(a, o) {
              return k = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(b, c) {
                return b.__proto__ = c, b;
              }, k(a, o);
            }
            var K = L(16), R = L(0);
            function P(a, o) {
              return typeof a != "function" || typeof o != "function" ? o : function() {
                var b = this.parent;
                this.parent = a;
                var c = o.apply(this, arguments);
                return this.parent = b, c;
              };
            }
            function w(a, o, b) {
              b = b || {}, R.keys(b).forEach(function(e) {
                b[e] = P(a.prototype[e], b[e]);
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
              return R._assign(c.prototype, b), c;
            }
            var t = /* @__PURE__ */ (function() {
              function a() {
                this.init.apply(this, arguments);
              }
              var o = a.prototype;
              return o.init = function() {
              }, a.extend = function(b, c) {
                return typeof b == "object" && (c = b, b = "anonymous"), w(this, b, c);
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
              var b = o.prototype;
              return b.init = function() {
              }, o.extend = function(c, e) {
                return typeof c == "object" && (e = c, c = "anonymous"), w(this, c, e);
              }, E(o, [{
                key: "typename",
                get: function() {
                  return this.constructor.name;
                }
              }]), o;
            })(K);
            S.exports = {
              Obj: t,
              EmitterObj: n
            };
          }),
          /* 2 */
          /***/
          (function(S, I, L) {
            var _ = L(0), E = Array.from, u = typeof Symbol == "function" && Symbol.iterator && typeof E == "function", g = /* @__PURE__ */ (function() {
              function s(p, x) {
                this.variables = /* @__PURE__ */ Object.create(null), this.parent = p, this.topLevel = !1, this.isolateWrites = x;
              }
              var h = s.prototype;
              return h.set = function(p, x, T) {
                var N = p.split("."), F = this.variables, d = this;
                if (T && (d = this.resolve(N[0], !0))) {
                  d.set(p, x);
                  return;
                }
                for (var O = 0; O < N.length - 1; O++) {
                  var v = N[O];
                  F[v] || (F[v] = {}), F = F[v];
                }
                F[N[N.length - 1]] = x;
              }, h.get = function(p) {
                var x = this.variables[p];
                return x !== void 0 ? x : null;
              }, h.lookup = function(p) {
                var x = this.parent, T = this.variables[p];
                return T !== void 0 ? T : x && x.lookup(p);
              }, h.resolve = function(p, x) {
                var T = x && this.isolateWrites ? void 0 : this.parent, N = this.variables[p];
                return N !== void 0 ? this : T && T.resolve(p);
              }, h.push = function(p) {
                return new s(this, p);
              }, h.pop = function() {
                return this.parent;
              }, s;
            })();
            function m(s, h, p) {
              return function() {
                for (var x = arguments.length, T = new Array(x), N = 0; N < x; N++)
                  T[N] = arguments[N];
                var F = P(T), d, O = R(T);
                if (F > s.length)
                  d = T.slice(0, s.length), T.slice(d.length, F).forEach(function(j, M) {
                    M < h.length && (O[h[M]] = j);
                  }), d.push(O);
                else if (F < s.length) {
                  d = T.slice(0, F);
                  for (var v = F; v < s.length; v++) {
                    var B = s[v];
                    d.push(O[B]), delete O[B];
                  }
                  d.push(O);
                } else
                  d = T;
                return p.apply(this, d);
              };
            }
            function k(s) {
              return s.__keywords = !0, s;
            }
            function K(s) {
              return s && Object.prototype.hasOwnProperty.call(s, "__keywords");
            }
            function R(s) {
              var h = s.length;
              if (h) {
                var p = s[h - 1];
                if (K(p))
                  return p;
              }
              return {};
            }
            function P(s) {
              var h = s.length;
              if (h === 0)
                return 0;
              var p = s[h - 1];
              return K(p) ? h - 1 : h;
            }
            function w(s) {
              if (typeof s != "string")
                return s;
              this.val = s, this.length = s.length;
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
            function t(s, h) {
              return s instanceof w ? new w(h) : h.toString();
            }
            function n(s) {
              var h = typeof s;
              return h === "string" ? new w(s) : h !== "function" ? s : function(p) {
                var x = s.apply(this, arguments);
                return typeof x == "string" ? new w(x) : x;
              };
            }
            function a(s, h) {
              return s = s ?? "", h && !(s instanceof w) && (s = _.escape(s.toString())), s;
            }
            function o(s, h, p) {
              if (s == null)
                throw new _.TemplateError("attempted to output null or undefined value", h + 1, p + 1);
              return s;
            }
            function b(s, h) {
              if (s != null)
                return typeof s[h] == "function" ? function() {
                  for (var p = arguments.length, x = new Array(p), T = 0; T < p; T++)
                    x[T] = arguments[T];
                  return s[h].apply(s, x);
                } : s[h];
            }
            function c(s, h, p, x) {
              if (s) {
                if (typeof s != "function")
                  throw new Error("Unable to call `" + h + "`, which is not a function");
              } else throw new Error("Unable to call `" + h + "`, which is undefined or falsey");
              return s.apply(p, x);
            }
            function e(s, h, p) {
              var x = h.lookup(p);
              return x !== void 0 ? x : s.lookup(p);
            }
            function i(s, h, p) {
              return s.lineno ? s : new _.TemplateError(s, h, p);
            }
            function r(s, h, p, x) {
              if (_.isArray(s)) {
                var T = s.length;
                _.asyncIter(s, function(N, F, d) {
                  switch (h) {
                    case 1:
                      p(N, F, T, d);
                      break;
                    case 2:
                      p(N[0], N[1], F, T, d);
                      break;
                    case 3:
                      p(N[0], N[1], N[2], F, T, d);
                      break;
                    default:
                      N.push(F, T, d), p.apply(this, N);
                  }
                }, x);
              } else
                _.asyncFor(s, function(N, F, d, O, v) {
                  p(N, F, d, O, v);
                }, x);
            }
            function f(s, h, p, x) {
              var T = 0, N, F;
              function d(Z, X) {
                T++, F[Z] = X, T === N && x(null, F.join(""));
              }
              if (_.isArray(s))
                if (N = s.length, F = new Array(N), N === 0)
                  x(null, "");
                else
                  for (var O = 0; O < s.length; O++) {
                    var v = s[O];
                    switch (h) {
                      case 1:
                        p(v, O, N, d);
                        break;
                      case 2:
                        p(v[0], v[1], O, N, d);
                        break;
                      case 3:
                        p(v[0], v[1], v[2], O, N, d);
                        break;
                      default:
                        v.push(O, N, d), p.apply(this, v);
                    }
                  }
              else {
                var B = _.keys(s || {});
                if (N = B.length, F = new Array(N), N === 0)
                  x(null, "");
                else
                  for (var j = 0; j < B.length; j++) {
                    var M = B[j];
                    p(M, s[M], j, N, d);
                  }
              }
            }
            function l(s) {
              return typeof s != "object" || s === null || _.isArray(s) ? s : u && Symbol.iterator in s ? E(s) : s;
            }
            S.exports = {
              Frame: g,
              makeMacro: m,
              makeKeywordArgs: k,
              numArgs: P,
              suppressValue: a,
              ensureDefined: o,
              memberLookup: b,
              contextOrFrameLookup: e,
              callWrap: c,
              handleError: i,
              isArray: _.isArray,
              keys: _.keys,
              SafeString: w,
              copySafeness: t,
              markSafe: n,
              asyncEach: r,
              asyncAll: f,
              inOperator: _.inOperator,
              fromIterator: l
            };
          }),
          /* 3 */
          /***/
          (function(S, I, L) {
            function _(J, H) {
              for (var ie = 0; ie < H.length; ie++) {
                var te = H[ie];
                te.enumerable = te.enumerable || !1, te.configurable = !0, "value" in te && (te.writable = !0), Object.defineProperty(J, u(te.key), te);
              }
            }
            function E(J, H, ie) {
              return H && _(J.prototype, H), Object.defineProperty(J, "prototype", { writable: !1 }), J;
            }
            function u(J) {
              var H = g(J, "string");
              return typeof H == "symbol" ? H : String(H);
            }
            function g(J, H) {
              if (typeof J != "object" || J === null) return J;
              var ie = J[Symbol.toPrimitive];
              if (ie !== void 0) {
                var te = ie.call(J, H);
                if (typeof te != "object") return te;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return String(J);
            }
            function m(J, H) {
              J.prototype = Object.create(H.prototype), J.prototype.constructor = J, k(J, H);
            }
            function k(J, H) {
              return k = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(ie, te) {
                return ie.__proto__ = te, ie;
              }, k(J, H);
            }
            var K = L(1), R = K.Obj;
            function P(J, H, ie) {
              J instanceof H && ie.push(J), J instanceof w && J.findAll(H, ie);
            }
            var w = /* @__PURE__ */ (function(J) {
              m(H, J);
              function H() {
                return J.apply(this, arguments) || this;
              }
              var ie = H.prototype;
              return ie.init = function(te, re) {
                for (var ue = arguments, me = this, ge = arguments.length, Xe = new Array(ge > 2 ? ge - 2 : 0), we = 2; we < ge; we++)
                  Xe[we - 2] = arguments[we];
                this.lineno = te, this.colno = re, this.fields.forEach(function(Ze, qe) {
                  var Le = ue[qe + 2];
                  Le === void 0 && (Le = null), me[Ze] = Le;
                });
              }, ie.findAll = function(te, re) {
                var ue = this;
                return re = re || [], this instanceof n ? this.children.forEach(function(me) {
                  return P(me, te, re);
                }) : this.fields.forEach(function(me) {
                  return P(ue[me], te, re);
                }), re;
              }, ie.iterFields = function(te) {
                var re = this;
                this.fields.forEach(function(ue) {
                  te(re[ue], ue);
                });
              }, H;
            })(R), t = /* @__PURE__ */ (function(J) {
              m(H, J);
              function H() {
                return J.apply(this, arguments) || this;
              }
              return E(H, [{
                key: "typename",
                get: function() {
                  return "Value";
                }
              }, {
                key: "fields",
                get: function() {
                  return ["value"];
                }
              }]), H;
            })(w), n = /* @__PURE__ */ (function(J) {
              m(H, J);
              function H() {
                return J.apply(this, arguments) || this;
              }
              var ie = H.prototype;
              return ie.init = function(te, re, ue) {
                J.prototype.init.call(this, te, re, ue || []);
              }, ie.addChild = function(te) {
                this.children.push(te);
              }, E(H, [{
                key: "typename",
                get: function() {
                  return "NodeList";
                }
              }, {
                key: "fields",
                get: function() {
                  return ["children"];
                }
              }]), H;
            })(w), a = n.extend("Root"), o = t.extend("Literal"), b = t.extend("Symbol"), c = n.extend("Group"), e = n.extend("Array"), i = w.extend("Pair", {
              fields: ["key", "value"]
            }), r = n.extend("Dict"), f = w.extend("LookupVal", {
              fields: ["target", "val"]
            }), l = w.extend("If", {
              fields: ["cond", "body", "else_"]
            }), s = l.extend("IfAsync"), h = w.extend("InlineIf", {
              fields: ["cond", "body", "else_"]
            }), p = w.extend("For", {
              fields: ["arr", "name", "body", "else_"]
            }), x = p.extend("AsyncEach"), T = p.extend("AsyncAll"), N = w.extend("Macro", {
              fields: ["name", "args", "body"]
            }), F = N.extend("Caller"), d = w.extend("Import", {
              fields: ["template", "target", "withContext"]
            }), O = /* @__PURE__ */ (function(J) {
              m(H, J);
              function H() {
                return J.apply(this, arguments) || this;
              }
              var ie = H.prototype;
              return ie.init = function(te, re, ue, me, ge) {
                J.prototype.init.call(this, te, re, ue, me || new n(), ge);
              }, E(H, [{
                key: "typename",
                get: function() {
                  return "FromImport";
                }
              }, {
                key: "fields",
                get: function() {
                  return ["template", "names", "withContext"];
                }
              }]), H;
            })(w), v = w.extend("FunCall", {
              fields: ["name", "args"]
            }), B = v.extend("Filter"), j = B.extend("FilterAsync", {
              fields: ["name", "args", "symbol"]
            }), M = r.extend("KeywordArgs"), Z = w.extend("Block", {
              fields: ["name", "body"]
            }), X = w.extend("Super", {
              fields: ["blockName", "symbol"]
            }), Q = w.extend("TemplateRef", {
              fields: ["template"]
            }), le = Q.extend("Extends"), oe = w.extend("Include", {
              fields: ["template", "ignoreMissing"]
            }), ee = w.extend("Set", {
              fields: ["targets", "value"]
            }), G = w.extend("Switch", {
              fields: ["expr", "cases", "default"]
            }), $ = w.extend("Case", {
              fields: ["cond", "body"]
            }), W = n.extend("Output"), se = w.extend("Capture", {
              fields: ["body"]
            }), he = o.extend("TemplateData"), de = w.extend("UnaryOp", {
              fields: ["target"]
            }), ae = w.extend("BinOp", {
              fields: ["left", "right"]
            }), ye = ae.extend("In"), y = ae.extend("Is"), C = ae.extend("Or"), D = ae.extend("And"), V = de.extend("Not"), q = ae.extend("Add"), z = ae.extend("Concat"), ne = ae.extend("Sub"), Y = ae.extend("Mul"), ce = ae.extend("Div"), fe = ae.extend("FloorDiv"), pe = ae.extend("Mod"), Ge = ae.extend("Pow"), We = de.extend("Neg"), $e = de.extend("Pos"), Je = w.extend("Compare", {
              fields: ["expr", "ops"]
            }), He = w.extend("CompareOperand", {
              fields: ["expr", "type"]
            }), Oe = w.extend("CallExtension", {
              init: function(J, H, ie, te) {
                this.parent(), this.extName = J.__name || J, this.prop = H, this.args = ie || new n(), this.contentArgs = te || [], this.autoescape = J.autoescape;
              },
              fields: ["extName", "prop", "args", "contentArgs"]
            }), ze = Oe.extend("CallExtensionAsync");
            function ve(J, H, ie) {
              var te = J.split(`
`);
              te.forEach(function(re, ue) {
                re && (ie && ue > 0 || !ie) && process.stdout.write(" ".repeat(H));
                var me = ue === te.length - 1 ? "" : `
`;
                process.stdout.write("" + re + me);
              });
            }
            function _e(J, H) {
              if (H = H || 0, ve(J.typename + ": ", H), J instanceof n)
                ve(`
`), J.children.forEach(function(re) {
                  _e(re, H + 2);
                });
              else if (J instanceof Oe)
                ve(J.extName + "." + J.prop + `
`), J.args && _e(J.args, H + 2), J.contentArgs && J.contentArgs.forEach(function(re) {
                  _e(re, H + 2);
                });
              else {
                var ie = [], te = null;
                J.iterFields(function(re, ue) {
                  re instanceof w ? ie.push([ue, re]) : (te = te || {}, te[ue] = re);
                }), te ? ve(JSON.stringify(te, null, 2) + `
`, null, !0) : ve(`
`), ie.forEach(function(re) {
                  var ue = re[0], me = re[1];
                  ve("[" + ue + "] =>", H + 2), _e(me, H + 4);
                });
              }
            }
            S.exports = {
              Node: w,
              Root: a,
              NodeList: n,
              Value: t,
              Literal: o,
              Symbol: b,
              Group: c,
              Array: e,
              Pair: i,
              Dict: r,
              Output: W,
              Capture: se,
              TemplateData: he,
              If: l,
              IfAsync: s,
              InlineIf: h,
              For: p,
              AsyncEach: x,
              AsyncAll: T,
              Macro: N,
              Caller: F,
              Import: d,
              FromImport: O,
              FunCall: v,
              Filter: B,
              FilterAsync: j,
              KeywordArgs: M,
              Block: Z,
              Super: X,
              Extends: le,
              Include: oe,
              Set: ee,
              Switch: G,
              Case: $,
              LookupVal: f,
              BinOp: ae,
              In: ye,
              Is: y,
              Or: C,
              And: D,
              Not: V,
              Add: q,
              Concat: z,
              Sub: ne,
              Mul: Y,
              Div: ce,
              FloorDiv: fe,
              Mod: pe,
              Pow: Ge,
              Neg: We,
              Pos: $e,
              Compare: Je,
              CompareOperand: He,
              CallExtension: Oe,
              CallExtensionAsync: ze,
              printNodes: _e
            };
          }),
          /* 4 */
          /***/
          (function(S, I) {
          }),
          /* 5 */
          /***/
          (function(S, I, L) {
            function _(o, b) {
              o.prototype = Object.create(b.prototype), o.prototype.constructor = o, E(o, b);
            }
            function E(o, b) {
              return E = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(c, e) {
                return c.__proto__ = e, c;
              }, E(o, b);
            }
            var u = L(8), g = L(17), m = L(3), k = L(0), K = k.TemplateError, R = L(2), P = R.Frame, w = L(1), t = w.Obj, n = {
              "==": "==",
              "===": "===",
              "!=": "!=",
              "!==": "!==",
              "<": "<",
              ">": ">",
              "<=": "<=",
              ">=": ">="
            }, a = /* @__PURE__ */ (function(o) {
              _(b, o);
              function b() {
                return o.apply(this, arguments) || this;
              }
              var c = b.prototype;
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
                for (var e = this, i = arguments.length, r = new Array(i), f = 0; f < i; f++)
                  r[f] = arguments[f];
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
                e.children.forEach(function(f) {
                  r.compile(f, i);
                });
              }, c._compileAggregate = function(e, i, r, f) {
                var l = this;
                r && this._emit(r), e.children.forEach(function(s, h) {
                  h > 0 && l._emit(","), l.compile(s, i);
                }), f && this._emit(f);
              }, c._compileExpression = function(e, i) {
                this.assertType(e, m.Literal, m.Symbol, m.Group, m.Array, m.Dict, m.FunCall, m.Caller, m.Filter, m.LookupVal, m.Compare, m.InlineIf, m.In, m.Is, m.And, m.Or, m.Not, m.Add, m.Concat, m.Sub, m.Mul, m.Div, m.FloorDiv, m.Mod, m.Pow, m.Neg, m.Pos, m.Compare, m.NodeList), this.compile(e, i);
              }, c.assertType = function(e) {
                for (var i = arguments.length, r = new Array(i > 1 ? i - 1 : 0), f = 1; f < i; f++)
                  r[f - 1] = arguments[f];
                r.some(function(l) {
                  return e instanceof l;
                }) || this.fail("assertType: invalid type: " + e.typename, e.lineno, e.colno);
              }, c.compileCallExtension = function(e, i, r) {
                var f = this, l = e.args, s = e.contentArgs, h = typeof e.autoescape == "boolean" ? e.autoescape : !0;
                if (r || this._emit(this.buffer + " += runtime.suppressValue("), this._emit('env.getExtension("' + e.extName + '")["' + e.prop + '"]('), this._emit("context"), (l || s) && this._emit(","), l && (l instanceof m.NodeList || this.fail("compileCallExtension: arguments must be a NodeList, use `parser.parseSignature`"), l.children.forEach(function(x, T) {
                  f._compileExpression(x, i), (T !== l.children.length - 1 || s.length) && f._emit(",");
                })), s.length && s.forEach(function(x, T) {
                  if (T > 0 && f._emit(","), x) {
                    f._emitLine("function(cb) {"), f._emitLine("if(!cb) { cb = function(err) { if(err) { throw err; }}}");
                    var N = f._pushBuffer();
                    f._withScopedSyntax(function() {
                      f.compile(x, i), f._emitLine("cb(null, " + N + ");");
                    }), f._popBuffer(), f._emitLine("return " + N + ";"), f._emitLine("}");
                  } else
                    f._emit("null");
                }), r) {
                  var p = this._tmpid();
                  this._emitLine(", " + this._makeCallback(p)), this._emitLine(this.buffer + " += runtime.suppressValue(" + p + ", " + h + " && env.opts.autoescape);"), this._addScopeLevel();
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
                var r = e.value, f = i.lookup(r);
                f ? this._emit(f) : this._emit('runtime.contextOrFrameLookup(context, frame, "' + r + '")');
              }, c.compileGroup = function(e, i) {
                this._compileAggregate(e, i, "(", ")");
              }, c.compileArray = function(e, i) {
                this._compileAggregate(e, i, "[", "]");
              }, c.compileDict = function(e, i) {
                this._compileAggregate(e, i, "{", "}");
              }, c.compilePair = function(e, i) {
                var r = e.key, f = e.value;
                r instanceof m.Symbol ? r = new m.Literal(r.lineno, r.colno, r.value) : r instanceof m.Literal && typeof r.value == "string" || this.fail("compilePair: Dict keys must be strings or names", r.lineno, r.colno), this.compile(r, i), this._emit(": "), this._compileExpression(f, i);
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
                this.compile(e.expr, i), e.ops.forEach(function(f) {
                  r._emit(" " + n[f.type] + " "), r.compile(f.expr, i);
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
                var r = e.name, f = e.symbol.value;
                this.assertType(r, m.Symbol), i.set(f, f), this._emit('env.getFilter("' + r.value + '").call(context, '), this._compileAggregate(e.args, i), this._emitLine(", " + this._makeCallback(f)), this._addScopeLevel();
              }, c.compileKeywordArgs = function(e, i) {
                this._emit("runtime.makeKeywordArgs("), this.compileDict(e, i), this._emit(")");
              }, c.compileSet = function(e, i) {
                var r = this, f = [];
                e.targets.forEach(function(l) {
                  var s = l.value, h = i.lookup(s);
                  h == null && (h = r._tmpid(), r._emitLine("var " + h + ";")), f.push(h);
                }), e.value ? (this._emit(f.join(" = ") + " = "), this._compileExpression(e.value, i), this._emitLine(";")) : (this._emit(f.join(" = ") + " = "), this.compile(e.body, i), this._emitLine(";")), e.targets.forEach(function(l, s) {
                  var h = f[s], p = l.value;
                  r._emitLine('frame.set("' + p + '", ' + h + ", true);"), r._emitLine("if(frame.topLevel) {"), r._emitLine('context.setVariable("' + p + '", ' + h + ");"), r._emitLine("}"), p.charAt(0) !== "_" && (r._emitLine("if(frame.topLevel) {"), r._emitLine('context.addExport("' + p + '", ' + h + ");"), r._emitLine("}"));
                });
              }, c.compileSwitch = function(e, i) {
                var r = this;
                this._emit("switch ("), this.compile(e.expr, i), this._emit(") {"), e.cases.forEach(function(f, l) {
                  r._emit("case "), r.compile(f.cond, i), r._emit(": "), r.compile(f.body, i), f.body.children.length && r._emitLine("break;");
                }), e.default && (this._emit("default:"), this.compile(e.default, i)), this._emit("}");
              }, c.compileIf = function(e, i, r) {
                var f = this;
                this._emit("if("), this._compileExpression(e.cond, i), this._emitLine(") {"), this._withScopedSyntax(function() {
                  f.compile(e.body, i), r && f._emit("cb()");
                }), e.else_ ? (this._emitLine(`}
else {`), this._withScopedSyntax(function() {
                  f.compile(e.else_, i), r && f._emit("cb()");
                })) : r && (this._emitLine(`}
else {`), this._emit("cb()")), this._emitLine("}");
              }, c.compileIfAsync = function(e, i) {
                this._emit("(function(cb) {"), this.compileIf(e, i, !0), this._emit("})(" + this._makeCallback()), this._addScopeLevel();
              }, c._emitLoopBindings = function(e, i, r, f) {
                var l = this, s = [{
                  name: "index",
                  val: r + " + 1"
                }, {
                  name: "index0",
                  val: r
                }, {
                  name: "revindex",
                  val: f + " - " + r
                }, {
                  name: "revindex0",
                  val: f + " - " + r + " - 1"
                }, {
                  name: "first",
                  val: r + " === 0"
                }, {
                  name: "last",
                  val: r + " === " + f + " - 1"
                }, {
                  name: "length",
                  val: f
                }];
                s.forEach(function(h) {
                  l._emitLine('frame.set("loop.' + h.name + '", ' + h.val + ");");
                });
              }, c.compileFor = function(e, i) {
                var r = this, f = this._tmpid(), l = this._tmpid(), s = this._tmpid();
                if (i = i.push(), this._emitLine("frame = frame.push();"), this._emit("var " + s + " = "), this._compileExpression(e.arr, i), this._emitLine(";"), this._emit("if(" + s + ") {"), this._emitLine(s + " = runtime.fromIterator(" + s + ");"), e.name instanceof m.Array) {
                  this._emitLine("var " + f + ";"), this._emitLine("if(runtime.isArray(" + s + ")) {"), this._emitLine("var " + l + " = " + s + ".length;"), this._emitLine("for(" + f + "=0; " + f + " < " + s + ".length; " + f + "++) {"), e.name.children.forEach(function(d, O) {
                    var v = r._tmpid();
                    r._emitLine("var " + v + " = " + s + "[" + f + "][" + O + "];"), r._emitLine('frame.set("' + d + '", ' + s + "[" + f + "][" + O + "]);"), i.set(e.name.children[O].value, v);
                  }), this._emitLoopBindings(e, s, f, l), this._withScopedSyntax(function() {
                    r.compile(e.body, i);
                  }), this._emitLine("}"), this._emitLine("} else {");
                  var h = e.name.children, p = h[0], x = h[1], T = this._tmpid(), N = this._tmpid();
                  i.set(p.value, T), i.set(x.value, N), this._emitLine(f + " = -1;"), this._emitLine("var " + l + " = runtime.keys(" + s + ").length;"), this._emitLine("for(var " + T + " in " + s + ") {"), this._emitLine(f + "++;"), this._emitLine("var " + N + " = " + s + "[" + T + "];"), this._emitLine('frame.set("' + p.value + '", ' + T + ");"), this._emitLine('frame.set("' + x.value + '", ' + N + ");"), this._emitLoopBindings(e, s, f, l), this._withScopedSyntax(function() {
                    r.compile(e.body, i);
                  }), this._emitLine("}"), this._emitLine("}");
                } else {
                  var F = this._tmpid();
                  i.set(e.name.value, F), this._emitLine("var " + l + " = " + s + ".length;"), this._emitLine("for(var " + f + "=0; " + f + " < " + s + ".length; " + f + "++) {"), this._emitLine("var " + F + " = " + s + "[" + f + "];"), this._emitLine('frame.set("' + e.name.value + '", ' + F + ");"), this._emitLoopBindings(e, s, f, l), this._withScopedSyntax(function() {
                    r.compile(e.body, i);
                  }), this._emitLine("}");
                }
                this._emitLine("}"), e.else_ && (this._emitLine("if (!" + l + ") {"), this.compile(e.else_, i), this._emitLine("}")), this._emitLine("frame = frame.pop();");
              }, c._compileAsyncLoop = function(e, i, r) {
                var f = this, l = this._tmpid(), s = this._tmpid(), h = this._tmpid(), p = r ? "asyncAll" : "asyncEach";
                if (i = i.push(), this._emitLine("frame = frame.push();"), this._emit("var " + h + " = runtime.fromIterator("), this._compileExpression(e.arr, i), this._emitLine(");"), e.name instanceof m.Array) {
                  var x = e.name.children.length;
                  this._emit("runtime." + p + "(" + h + ", " + x + ", function("), e.name.children.forEach(function(F) {
                    f._emit(F.value + ",");
                  }), this._emit(l + "," + s + ",next) {"), e.name.children.forEach(function(F) {
                    var d = F.value;
                    i.set(d, d), f._emitLine('frame.set("' + d + '", ' + d + ");");
                  });
                } else {
                  var T = e.name.value;
                  this._emitLine("runtime." + p + "(" + h + ", 1, function(" + T + ", " + l + ", " + s + ",next) {"), this._emitLine('frame.set("' + T + '", ' + T + ");"), i.set(T, T);
                }
                this._emitLoopBindings(e, h, l, s), this._withScopedSyntax(function() {
                  var F;
                  r && (F = f._pushBuffer()), f.compile(e.body, i), f._emitLine("next(" + l + (F ? "," + F : "") + ");"), r && f._popBuffer();
                });
                var N = this._tmpid();
                this._emitLine("}, " + this._makeCallback(N)), this._addScopeLevel(), r && this._emitLine(this.buffer + " += " + N + ";"), e.else_ && (this._emitLine("if (!" + h + ".length) {"), this.compile(e.else_, i), this._emitLine("}")), this._emitLine("frame = frame.pop();");
              }, c.compileAsyncEach = function(e, i) {
                this._compileAsyncLoop(e, i);
              }, c.compileAsyncAll = function(e, i) {
                this._compileAsyncLoop(e, i, !0);
              }, c._compileMacro = function(e, i) {
                var r = this, f = [], l = null, s = "macro_" + this._tmpid(), h = i !== void 0;
                e.args.children.forEach(function(d, O) {
                  O === e.args.children.length - 1 && d instanceof m.Dict ? l = d : (r.assertType(d, m.Symbol), f.push(d));
                });
                var p = [].concat(f.map(function(d) {
                  return "l_" + d.value;
                }), ["kwargs"]), x = f.map(function(d) {
                  return '"' + d.value + '"';
                }), T = (l && l.children || []).map(function(d) {
                  return '"' + d.key.value + '"';
                }), N;
                h ? N = i.push(!0) : N = new P(), this._emitLines("var " + s + " = runtime.makeMacro(", "[" + x.join(", ") + "], ", "[" + T.join(", ") + "], ", "function (" + p.join(", ") + ") {", "var callerFrame = frame;", "frame = " + (h ? "frame.push(true);" : "new runtime.Frame();"), "kwargs = kwargs || {};", 'if (Object.prototype.hasOwnProperty.call(kwargs, "caller")) {', 'frame.set("caller", kwargs.caller); }'), f.forEach(function(d) {
                  r._emitLine('frame.set("' + d.value + '", l_' + d.value + ");"), N.set(d.value, "l_" + d.value);
                }), l && l.children.forEach(function(d) {
                  var O = d.key.value;
                  r._emit('frame.set("' + O + '", '), r._emit('Object.prototype.hasOwnProperty.call(kwargs, "' + O + '")'), r._emit(' ? kwargs["' + O + '"] : '), r._compileExpression(d.value, N), r._emit(");");
                });
                var F = this._pushBuffer();
                return this._withScopedSyntax(function() {
                  r.compile(e.body, N);
                }), this._emitLine("frame = " + (h ? "frame.pop();" : "callerFrame;")), this._emitLine("return new runtime.SafeString(" + F + ");"), this._emitLine("});"), this._popBuffer(), s;
              }, c.compileMacro = function(e, i) {
                var r = this._compileMacro(e), f = e.name.value;
                i.set(f, r), i.parent ? this._emitLine('frame.set("' + f + '", ' + r + ");") : (e.name.value.charAt(0) !== "_" && this._emitLine('context.addExport("' + f + '");'), this._emitLine('context.setVariable("' + f + '", ' + r + ");"));
              }, c.compileCaller = function(e, i) {
                this._emit("(function (){");
                var r = this._compileMacro(e, i);
                this._emit("return " + r + ";})()");
              }, c._compileGetTemplate = function(e, i, r, f) {
                var l = this._tmpid(), s = this._templateName(), h = this._makeCallback(l), p = r ? "true" : "false", x = f ? "true" : "false";
                return this._emit("env.getTemplate("), this._compileExpression(e.template, i), this._emitLine(", " + p + ", " + s + ", " + x + ", " + h), l;
              }, c.compileImport = function(e, i) {
                var r = e.target.value, f = this._compileGetTemplate(e, i, !1, !1);
                this._addScopeLevel(), this._emitLine(f + ".getExported(" + (e.withContext ? "context.getVariables(), frame, " : "") + this._makeCallback(f)), this._addScopeLevel(), i.set(r, f), i.parent ? this._emitLine('frame.set("' + r + '", ' + f + ");") : this._emitLine('context.setVariable("' + r + '", ' + f + ");");
              }, c.compileFromImport = function(e, i) {
                var r = this, f = this._compileGetTemplate(e, i, !1, !1);
                this._addScopeLevel(), this._emitLine(f + ".getExported(" + (e.withContext ? "context.getVariables(), frame, " : "") + this._makeCallback(f)), this._addScopeLevel(), e.names.children.forEach(function(l) {
                  var s, h, p = r._tmpid();
                  l instanceof m.Pair ? (s = l.key.value, h = l.value.value) : (s = l.value, h = s), r._emitLine("if(Object.prototype.hasOwnProperty.call(" + f + ', "' + s + '")) {'), r._emitLine("var " + p + " = " + f + "." + s + ";"), r._emitLine("} else {"), r._emitLine(`cb(new Error("cannot import '` + s + `'")); return;`), r._emitLine("}"), i.set(h, p), i.parent ? r._emitLine('frame.set("' + h + '", ' + p + ");") : r._emitLine('context.setVariable("' + h + '", ' + p + ");");
                });
              }, c.compileBlock = function(e) {
                var i = this._tmpid();
                this.inBlock || this._emit('(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : '), this._emit('context.getBlock("' + e.name.value + '")'), this.inBlock || this._emit(")"), this._emitLine("(env, context, frame, runtime, " + this._makeCallback(i)), this._emitLine(this.buffer + " += " + i + ";"), this._addScopeLevel();
              }, c.compileSuper = function(e, i) {
                var r = e.blockName.value, f = e.symbol.value, l = this._makeCallback(f);
                this._emitLine('context.getSuper(env, "' + r + '", b_' + r + ", frame, runtime, " + l), this._emitLine(f + " = runtime.markSafe(" + f + ");"), this._addScopeLevel(), i.set(f, f);
              }, c.compileExtends = function(e, i) {
                var r = this._tmpid(), f = this._compileGetTemplate(e, i, !0, !1);
                this._emitLine("parentTemplate = " + f), this._emitLine("for(var " + r + " in parentTemplate.blocks) {"), this._emitLine("context.addBlock(" + r + ", parentTemplate.blocks[" + r + "]);"), this._emitLine("}"), this._addScopeLevel();
              }, c.compileInclude = function(e, i) {
                this._emitLine("var tasks = [];"), this._emitLine("tasks.push("), this._emitLine("function(callback) {");
                var r = this._compileGetTemplate(e, i, !1, e.ignoreMissing);
                this._emitLine("callback(null," + r + ");});"), this._emitLine("});");
                var f = this._tmpid();
                this._emitLine("tasks.push("), this._emitLine("function(template, callback){"), this._emitLine("template.render(context.getVariables(), frame, " + this._makeCallback(f)), this._emitLine("callback(null," + f + ");});"), this._emitLine("});"), this._emitLine("tasks.push("), this._emitLine("function(result, callback){"), this._emitLine(this.buffer + " += result;"), this._emitLine("callback(null);"), this._emitLine("});"), this._emitLine("env.waterfall(tasks, function(){"), this._addScopeLevel();
              }, c.compileTemplateData = function(e, i) {
                this.compileLiteral(e, i);
              }, c.compileCapture = function(e, i) {
                var r = this, f = this.buffer;
                this.buffer = "output", this._emitLine("(function() {"), this._emitLine('var output = "";'), this._withScopedSyntax(function() {
                  r.compile(e.body, i);
                }), this._emitLine("return output;"), this._emitLine("})()"), this.buffer = f;
              }, c.compileOutput = function(e, i) {
                var r = this, f = e.children;
                f.forEach(function(l) {
                  l instanceof m.TemplateData ? l.value && (r._emit(r.buffer + " += "), r.compileLiteral(l, i), r._emitLine(";")) : (r._emit(r.buffer + " += runtime.suppressValue("), r.throwOnUndefined && r._emit("runtime.ensureDefined("), r.compile(l, i), r.throwOnUndefined && r._emit("," + e.lineno + "," + e.colno + ")"), r._emit(`, env.opts.autoescape);
`));
                });
              }, c.compileRoot = function(e, i) {
                var r = this;
                i && this.fail("compileRoot: root node can't have frame"), i = new P(), this._emitFuncBegin(e, "root"), this._emitLine("var parentTemplate = null;"), this._compileChildren(e, i), this._emitLine("if(parentTemplate) {"), this._emitLine("parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);"), this._emitLine("} else {"), this._emitLine("cb(null, " + this.buffer + ");"), this._emitLine("}"), this._emitFuncEnd(!0), this.inBlock = !0;
                var f = [], l = e.findAll(m.Block);
                l.forEach(function(s, h) {
                  var p = s.name.value;
                  if (f.indexOf(p) !== -1)
                    throw new Error('Block "' + p + '" defined more than once.');
                  f.push(p), r._emitFuncBegin(s, "b_" + p);
                  var x = new P();
                  r._emitLine("var frame = frame.push(true);"), r.compile(s.body, x), r._emitFuncEnd();
                }), this._emitLine("return {"), l.forEach(function(s, h) {
                  var p = "b_" + s.name.value;
                  r._emitLine(p + ": " + p + ",");
                }), this._emitLine(`root: root
};`);
              }, c.compile = function(e, i) {
                var r = this["compile" + e.typename];
                r ? r.call(this, e, i) : this.fail("compile: Cannot compile node: " + e.typename, e.lineno, e.colno);
              }, c.getCode = function() {
                return this.codebuf.join("");
              }, b;
            })(t);
            S.exports = {
              compile: function(o, b, c, e, i) {
                i === void 0 && (i = {});
                var r = new a(e, i.throwOnUndefined), f = (c || []).map(function(s) {
                  return s.preprocess;
                }).filter(function(s) {
                  return !!s;
                }), l = f.reduce(function(s, h) {
                  return h(s);
                }, o);
                return r.compile(g.transform(u.parse(l, c, i), b, e)), r.getCode();
              },
              Compiler: a
            };
          }),
          /* 6 */
          /***/
          (function(S, I, L) {
            function _(k, K) {
              k.prototype = Object.create(K.prototype), k.prototype.constructor = k, E(k, K);
            }
            function E(k, K) {
              return E = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(R, P) {
                return R.__proto__ = P, R;
              }, E(k, K);
            }
            var u = L(4), g = L(1), m = g.EmitterObj;
            S.exports = /* @__PURE__ */ (function(k) {
              _(K, k);
              function K() {
                return k.apply(this, arguments) || this;
              }
              var R = K.prototype;
              return R.resolve = function(P, w) {
                return u.resolve(u.dirname(P), w);
              }, R.isRelative = function(P) {
                return P.indexOf("./") === 0 || P.indexOf("../") === 0;
              }, K;
            })(m);
          }),
          /* 7 */
          /***/
          (function(S, I, L) {
            function _(T, N) {
              T.prototype = Object.create(N.prototype), T.prototype.constructor = T, E(T, N);
            }
            function E(T, N) {
              return E = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(F, d) {
                return F.__proto__ = d, F;
              }, E(T, N);
            }
            var u = L(12), g = L(15), m = L(0), k = L(5), K = L(18), R = L(10), P = R.FileSystemLoader, w = R.WebLoader, t = R.PrecompiledLoader, n = L(20), a = L(21), o = L(1), b = o.Obj, c = o.EmitterObj, e = L(2), i = e.handleError, r = e.Frame, f = L(22);
            function l(T, N, F) {
              u(function() {
                T(N, F);
              });
            }
            var s = {
              type: "code",
              obj: {
                root: function(T, N, F, d, O) {
                  try {
                    O(null, "");
                  } catch (v) {
                    O(i(v, null, null));
                  }
                }
              }
            }, h = /* @__PURE__ */ (function(T) {
              _(N, T);
              function N() {
                return T.apply(this, arguments) || this;
              }
              var F = N.prototype;
              return F.init = function(d, O) {
                var v = this;
                O = this.opts = O || {}, this.opts.dev = !!O.dev, this.opts.autoescape = O.autoescape != null ? O.autoescape : !0, this.opts.throwOnUndefined = !!O.throwOnUndefined, this.opts.trimBlocks = !!O.trimBlocks, this.opts.lstripBlocks = !!O.lstripBlocks, this.loaders = [], d ? this.loaders = m.isArray(d) ? d : [d] : P ? this.loaders = [new P("views")] : w && (this.loaders = [new w("/views")]), typeof window < "u" && window.nunjucksPrecompiled && this.loaders.unshift(new t(window.nunjucksPrecompiled)), this._initLoaders(), this.globals = a(), this.filters = {}, this.tests = {}, this.asyncFilters = [], this.extensions = {}, this.extensionsList = [], m._entries(K).forEach(function(B) {
                  var j = B[0], M = B[1];
                  return v.addFilter(j, M);
                }), m._entries(n).forEach(function(B) {
                  var j = B[0], M = B[1];
                  return v.addTest(j, M);
                });
              }, F._initLoaders = function() {
                var d = this;
                this.loaders.forEach(function(O) {
                  O.cache = {}, typeof O.on == "function" && (O.on("update", function(v, B) {
                    O.cache[v] = null, d.emit("update", v, B, O);
                  }), O.on("load", function(v, B) {
                    d.emit("load", v, B, O);
                  }));
                });
              }, F.invalidateCache = function() {
                this.loaders.forEach(function(d) {
                  d.cache = {};
                });
              }, F.addExtension = function(d, O) {
                return O.__name = d, this.extensions[d] = O, this.extensionsList.push(O), this;
              }, F.removeExtension = function(d) {
                var O = this.getExtension(d);
                O && (this.extensionsList = m.without(this.extensionsList, O), delete this.extensions[d]);
              }, F.getExtension = function(d) {
                return this.extensions[d];
              }, F.hasExtension = function(d) {
                return !!this.extensions[d];
              }, F.addGlobal = function(d, O) {
                return this.globals[d] = O, this;
              }, F.getGlobal = function(d) {
                if (typeof this.globals[d] > "u")
                  throw new Error("global not found: " + d);
                return this.globals[d];
              }, F.addFilter = function(d, O, v) {
                var B = O;
                return v && this.asyncFilters.push(d), this.filters[d] = B, this;
              }, F.getFilter = function(d) {
                if (!this.filters[d])
                  throw new Error("filter not found: " + d);
                return this.filters[d];
              }, F.addTest = function(d, O) {
                return this.tests[d] = O, this;
              }, F.getTest = function(d) {
                if (!this.tests[d])
                  throw new Error("test not found: " + d);
                return this.tests[d];
              }, F.resolveTemplate = function(d, O, v) {
                var B = d.isRelative && O ? d.isRelative(v) : !1;
                return B && d.resolve ? d.resolve(O, v) : v;
              }, F.getTemplate = function(d, O, v, B, j) {
                var M = this, Z = this, X = null;
                if (d && d.raw && (d = d.raw), m.isFunction(v) && (j = v, v = null, O = O || !1), m.isFunction(O) && (j = O, O = !1), d instanceof x)
                  X = d;
                else {
                  if (typeof d != "string")
                    throw new Error("template names must be a string: " + d);
                  for (var Q = 0; Q < this.loaders.length; Q++) {
                    var le = this.loaders[Q];
                    if (X = le.cache[this.resolveTemplate(le, v, d)], X)
                      break;
                  }
                }
                if (X)
                  if (O && X.compile(), j) {
                    j(null, X);
                    return;
                  } else
                    return X;
                var oe, ee = function(G, $) {
                  if (!$ && !G && !B && (G = new Error("template not found: " + d)), G)
                    if (j) {
                      j(G);
                      return;
                    } else
                      throw G;
                  var W;
                  $ ? (W = new x($.src, M, $.path, O), $.noCache || ($.loader.cache[d] = W)) : W = new x(s, M, "", O), j ? j(null, W) : oe = W;
                };
                return m.asyncIter(this.loaders, function(G, $, W, se) {
                  function he(de, ae) {
                    de ? se(de) : ae ? (ae.loader = G, se(null, ae)) : W();
                  }
                  d = Z.resolveTemplate(G, v, d), G.async ? G.getSource(d, he) : he(null, G.getSource(d));
                }, ee), oe;
              }, F.express = function(d) {
                return f(this, d);
              }, F.render = function(d, O, v) {
                m.isFunction(O) && (v = O, O = null);
                var B = null;
                return this.getTemplate(d, function(j, M) {
                  if (j && v)
                    l(v, j);
                  else {
                    if (j)
                      throw j;
                    B = M.render(O, v);
                  }
                }), B;
              }, F.renderString = function(d, O, v, B) {
                m.isFunction(v) && (B = v, v = {}), v = v || {};
                var j = new x(d, this, v.path);
                return j.render(O, B);
              }, F.waterfall = function(d, O, v) {
                return g(d, O, v);
              }, N;
            })(c), p = /* @__PURE__ */ (function(T) {
              _(N, T);
              function N() {
                return T.apply(this, arguments) || this;
              }
              var F = N.prototype;
              return F.init = function(d, O, v) {
                var B = this;
                this.env = v || new h(), this.ctx = m.extend({}, d), this.blocks = {}, this.exported = [], m.keys(O).forEach(function(j) {
                  B.addBlock(j, O[j]);
                });
              }, F.lookup = function(d) {
                return d in this.env.globals && !(d in this.ctx) ? this.env.globals[d] : this.ctx[d];
              }, F.setVariable = function(d, O) {
                this.ctx[d] = O;
              }, F.getVariables = function() {
                return this.ctx;
              }, F.addBlock = function(d, O) {
                return this.blocks[d] = this.blocks[d] || [], this.blocks[d].push(O), this;
              }, F.getBlock = function(d) {
                if (!this.blocks[d])
                  throw new Error('unknown block "' + d + '"');
                return this.blocks[d][0];
              }, F.getSuper = function(d, O, v, B, j, M) {
                var Z = m.indexOf(this.blocks[O] || [], v), X = this.blocks[O][Z + 1], Q = this;
                if (Z === -1 || !X)
                  throw new Error('no super block available for "' + O + '"');
                X(d, Q, B, j, M);
              }, F.addExport = function(d) {
                this.exported.push(d);
              }, F.getExported = function() {
                var d = this, O = {};
                return this.exported.forEach(function(v) {
                  O[v] = d.ctx[v];
                }), O;
              }, N;
            })(b), x = /* @__PURE__ */ (function(T) {
              _(N, T);
              function N() {
                return T.apply(this, arguments) || this;
              }
              var F = N.prototype;
              return F.init = function(d, O, v, B) {
                if (this.env = O || new h(), m.isObject(d))
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
                if (this.path = v, B)
                  try {
                    this._compile();
                  } catch (j) {
                    throw m._prettifyError(this.path, this.env.opts.dev, j);
                  }
                else
                  this.compiled = !1;
              }, F.render = function(d, O, v) {
                var B = this;
                typeof d == "function" ? (v = d, d = {}) : typeof O == "function" && (v = O, O = null);
                var j = !O;
                try {
                  this.compile();
                } catch (oe) {
                  var M = m._prettifyError(this.path, this.env.opts.dev, oe);
                  if (v)
                    return l(v, M);
                  throw M;
                }
                var Z = new p(d || {}, this.blocks, this.env), X = O ? O.push(!0) : new r();
                X.topLevel = !0;
                var Q = null, le = !1;
                return this.rootRenderFunc(this.env, Z, X, e, function(oe, ee) {
                  if (!(le && v && typeof ee < "u"))
                    if (oe && (oe = m._prettifyError(B.path, B.env.opts.dev, oe), le = !0), v)
                      j ? l(v, oe, ee) : v(oe, ee);
                    else {
                      if (oe)
                        throw oe;
                      Q = ee;
                    }
                }), Q;
              }, F.getExported = function(d, O, v) {
                typeof d == "function" && (v = d, d = {}), typeof O == "function" && (v = O, O = null);
                try {
                  this.compile();
                } catch (M) {
                  if (v)
                    return v(M);
                  throw M;
                }
                var B = O ? O.push() : new r();
                B.topLevel = !0;
                var j = new p(d || {}, this.blocks, this.env);
                this.rootRenderFunc(this.env, j, B, e, function(M) {
                  M ? v(M, null) : v(null, j.getExported());
                });
              }, F.compile = function() {
                this.compiled || this._compile();
              }, F._compile = function() {
                var d;
                if (this.tmplProps)
                  d = this.tmplProps;
                else {
                  var O = k.compile(this.tmplStr, this.env.asyncFilters, this.env.extensionsList, this.path, this.env.opts), v = new Function(O);
                  d = v();
                }
                this.blocks = this._getBlocks(d), this.rootRenderFunc = d.root, this.compiled = !0;
              }, F._getBlocks = function(d) {
                var O = {};
                return m.keys(d).forEach(function(v) {
                  v.slice(0, 2) === "b_" && (O[v.slice(2)] = d[v]);
                }), O;
              }, N;
            })(b);
            S.exports = {
              Environment: h,
              Template: x
            };
          }),
          /* 8 */
          /***/
          (function(S, I, L) {
            function _(R, P) {
              R.prototype = Object.create(P.prototype), R.prototype.constructor = R, E(R, P);
            }
            function E(R, P) {
              return E = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(w, t) {
                return w.__proto__ = t, w;
              }, E(R, P);
            }
            var u = L(9), g = L(3), m = L(1).Obj, k = L(0), K = /* @__PURE__ */ (function(R) {
              _(P, R);
              function P() {
                return R.apply(this, arguments) || this;
              }
              var w = P.prototype;
              return w.init = function(t) {
                this.tokens = t, this.peeked = null, this.breakOnBlocks = null, this.dropLeadingWhitespace = !1, this.extensions = [];
              }, w.nextToken = function(t) {
                var n;
                if (this.peeked)
                  if (!t && this.peeked.type === u.TOKEN_WHITESPACE)
                    this.peeked = null;
                  else
                    return n = this.peeked, this.peeked = null, n;
                if (n = this.tokens.nextToken(), !t)
                  for (; n && n.type === u.TOKEN_WHITESPACE; )
                    n = this.tokens.nextToken();
                return n;
              }, w.peekToken = function() {
                return this.peeked = this.peeked || this.nextToken(), this.peeked;
              }, w.pushToken = function(t) {
                if (this.peeked)
                  throw new Error("pushToken: can only push one token on between reads");
                this.peeked = t;
              }, w.error = function(t, n, a) {
                if (n === void 0 || a === void 0) {
                  var o = this.peekToken() || {};
                  n = o.lineno, a = o.colno;
                }
                return n !== void 0 && (n += 1), a !== void 0 && (a += 1), new k.TemplateError(t, n, a);
              }, w.fail = function(t, n, a) {
                throw this.error(t, n, a);
              }, w.skip = function(t) {
                var n = this.nextToken();
                return !n || n.type !== t ? (this.pushToken(n), !1) : !0;
              }, w.expect = function(t) {
                var n = this.nextToken();
                return n.type !== t && this.fail("expected " + t + ", got " + n.type, n.lineno, n.colno), n;
              }, w.skipValue = function(t, n) {
                var a = this.nextToken();
                return !a || a.type !== t || a.value !== n ? (this.pushToken(a), !1) : !0;
              }, w.skipSymbol = function(t) {
                return this.skipValue(u.TOKEN_SYMBOL, t);
              }, w.advanceAfterBlockEnd = function(t) {
                var n;
                return t || (n = this.peekToken(), n || this.fail("unexpected end of file"), n.type !== u.TOKEN_SYMBOL && this.fail("advanceAfterBlockEnd: expected symbol token or explicit name to be passed"), t = this.nextToken().value), n = this.nextToken(), n && n.type === u.TOKEN_BLOCK_END ? n.value.charAt(0) === "-" && (this.dropLeadingWhitespace = !0) : this.fail("expected block end in " + t + " statement"), n;
              }, w.advanceAfterVariableEnd = function() {
                var t = this.nextToken();
                t && t.type === u.TOKEN_VARIABLE_END ? this.dropLeadingWhitespace = t.value.charAt(t.value.length - this.tokens.tags.VARIABLE_END.length - 1) === "-" : (this.pushToken(t), this.fail("expected variable end"));
              }, w.parseFor = function() {
                var t = this.peekToken(), n, a;
                this.skipSymbol("for") ? (n = new g.For(t.lineno, t.colno), a = "endfor") : this.skipSymbol("asyncEach") ? (n = new g.AsyncEach(t.lineno, t.colno), a = "endeach") : this.skipSymbol("asyncAll") ? (n = new g.AsyncAll(t.lineno, t.colno), a = "endall") : this.fail("parseFor: expected for{Async}", t.lineno, t.colno), n.name = this.parsePrimary(), n.name instanceof g.Symbol || this.fail("parseFor: variable name expected for loop");
                var o = this.peekToken().type;
                if (o === u.TOKEN_COMMA) {
                  var b = n.name;
                  for (n.name = new g.Array(b.lineno, b.colno), n.name.addChild(b); this.skip(u.TOKEN_COMMA); ) {
                    var c = this.parsePrimary();
                    n.name.addChild(c);
                  }
                }
                return this.skipSymbol("in") || this.fail('parseFor: expected "in" keyword for loop', t.lineno, t.colno), n.arr = this.parseExpression(), this.advanceAfterBlockEnd(t.value), n.body = this.parseUntilBlocks(a, "else"), this.skipSymbol("else") && (this.advanceAfterBlockEnd("else"), n.else_ = this.parseUntilBlocks(a)), this.advanceAfterBlockEnd(), n;
              }, w.parseMacro = function() {
                var t = this.peekToken();
                this.skipSymbol("macro") || this.fail("expected macro");
                var n = this.parsePrimary(!0), a = this.parseSignature(), o = new g.Macro(t.lineno, t.colno, n, a);
                return this.advanceAfterBlockEnd(t.value), o.body = this.parseUntilBlocks("endmacro"), this.advanceAfterBlockEnd(), o;
              }, w.parseCall = function() {
                var t = this.peekToken();
                this.skipSymbol("call") || this.fail("expected call");
                var n = this.parseSignature(!0) || new g.NodeList(), a = this.parsePrimary();
                this.advanceAfterBlockEnd(t.value);
                var o = this.parseUntilBlocks("endcall");
                this.advanceAfterBlockEnd();
                var b = new g.Symbol(t.lineno, t.colno, "caller"), c = new g.Caller(t.lineno, t.colno, b, n, o), e = a.args.children;
                e[e.length - 1] instanceof g.KeywordArgs || e.push(new g.KeywordArgs());
                var i = e[e.length - 1];
                return i.addChild(new g.Pair(t.lineno, t.colno, b, c)), new g.Output(t.lineno, t.colno, [a]);
              }, w.parseWithContext = function() {
                var t = this.peekToken(), n = null;
                return this.skipSymbol("with") ? n = !0 : this.skipSymbol("without") && (n = !1), n !== null && (this.skipSymbol("context") || this.fail("parseFrom: expected context after with/without", t.lineno, t.colno)), n;
              }, w.parseImport = function() {
                var t = this.peekToken();
                this.skipSymbol("import") || this.fail("parseImport: expected import", t.lineno, t.colno);
                var n = this.parseExpression();
                this.skipSymbol("as") || this.fail('parseImport: expected "as" keyword', t.lineno, t.colno);
                var a = this.parseExpression(), o = this.parseWithContext(), b = new g.Import(t.lineno, t.colno, n, a, o);
                return this.advanceAfterBlockEnd(t.value), b;
              }, w.parseFrom = function() {
                var t = this.peekToken();
                this.skipSymbol("from") || this.fail("parseFrom: expected from");
                var n = this.parseExpression();
                this.skipSymbol("import") || this.fail("parseFrom: expected import", t.lineno, t.colno);
                for (var a = new g.NodeList(), o; ; ) {
                  var b = this.peekToken();
                  if (b.type === u.TOKEN_BLOCK_END) {
                    a.children.length || this.fail("parseFrom: Expected at least one import name", t.lineno, t.colno), b.value.charAt(0) === "-" && (this.dropLeadingWhitespace = !0), this.nextToken();
                    break;
                  }
                  a.children.length > 0 && !this.skip(u.TOKEN_COMMA) && this.fail("parseFrom: expected comma", t.lineno, t.colno);
                  var c = this.parsePrimary();
                  if (c.value.charAt(0) === "_" && this.fail("parseFrom: names starting with an underscore cannot be imported", c.lineno, c.colno), this.skipSymbol("as")) {
                    var e = this.parsePrimary();
                    a.addChild(new g.Pair(c.lineno, c.colno, c, e));
                  } else
                    a.addChild(c);
                  o = this.parseWithContext();
                }
                return new g.FromImport(t.lineno, t.colno, n, a, o);
              }, w.parseBlock = function() {
                var t = this.peekToken();
                this.skipSymbol("block") || this.fail("parseBlock: expected block", t.lineno, t.colno);
                var n = new g.Block(t.lineno, t.colno);
                n.name = this.parsePrimary(), n.name instanceof g.Symbol || this.fail("parseBlock: variable name expected", t.lineno, t.colno), this.advanceAfterBlockEnd(t.value), n.body = this.parseUntilBlocks("endblock"), this.skipSymbol("endblock"), this.skipSymbol(n.name.value);
                var a = this.peekToken();
                return a || this.fail("parseBlock: expected endblock, got end of file"), this.advanceAfterBlockEnd(a.value), n;
              }, w.parseExtends = function() {
                var t = "extends", n = this.peekToken();
                this.skipSymbol(t) || this.fail("parseTemplateRef: expected " + t);
                var a = new g.Extends(n.lineno, n.colno);
                return a.template = this.parseExpression(), this.advanceAfterBlockEnd(n.value), a;
              }, w.parseInclude = function() {
                var t = "include", n = this.peekToken();
                this.skipSymbol(t) || this.fail("parseInclude: expected " + t);
                var a = new g.Include(n.lineno, n.colno);
                return a.template = this.parseExpression(), this.skipSymbol("ignore") && this.skipSymbol("missing") && (a.ignoreMissing = !0), this.advanceAfterBlockEnd(n.value), a;
              }, w.parseIf = function() {
                var t = this.peekToken(), n;
                this.skipSymbol("if") || this.skipSymbol("elif") || this.skipSymbol("elseif") ? n = new g.If(t.lineno, t.colno) : this.skipSymbol("ifAsync") ? n = new g.IfAsync(t.lineno, t.colno) : this.fail("parseIf: expected if, elif, or elseif", t.lineno, t.colno), n.cond = this.parseExpression(), this.advanceAfterBlockEnd(t.value), n.body = this.parseUntilBlocks("elif", "elseif", "else", "endif");
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
              }, w.parseSet = function() {
                var t = this.peekToken();
                this.skipSymbol("set") || this.fail("parseSet: expected set", t.lineno, t.colno);
                for (var n = new g.Set(t.lineno, t.colno, []), a; (a = this.parsePrimary()) && (n.targets.push(a), !!this.skip(u.TOKEN_COMMA)); )
                  ;
                return this.skipValue(u.TOKEN_OPERATOR, "=") ? (n.value = this.parseExpression(), this.advanceAfterBlockEnd(t.value)) : this.skip(u.TOKEN_BLOCK_END) ? (n.body = new g.Capture(t.lineno, t.colno, this.parseUntilBlocks("endset")), n.value = null, this.advanceAfterBlockEnd()) : this.fail("parseSet: expected = or block end in set tag", t.lineno, t.colno), n;
              }, w.parseSwitch = function() {
                var t = "switch", n = "endswitch", a = "case", o = "default", b = this.peekToken();
                !this.skipSymbol(t) && !this.skipSymbol(a) && !this.skipSymbol(o) && this.fail('parseSwitch: expected "switch," "case" or "default"', b.lineno, b.colno);
                var c = this.parseExpression();
                this.advanceAfterBlockEnd(t), this.parseUntilBlocks(a, o, n);
                var e = this.peekToken(), i = [], r;
                do {
                  this.skipSymbol(a);
                  var f = this.parseExpression();
                  this.advanceAfterBlockEnd(t);
                  var l = this.parseUntilBlocks(a, o, n);
                  i.push(new g.Case(e.line, e.col, f, l)), e = this.peekToken();
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
                return new g.Switch(b.lineno, b.colno, c, i, r);
              }, w.parseStatement = function() {
                var t = this.peekToken(), n;
                if (t.type !== u.TOKEN_SYMBOL && this.fail("tag name expected", t.lineno, t.colno), this.breakOnBlocks && k.indexOf(this.breakOnBlocks, t.value) !== -1)
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
                        if (k.indexOf(o.tags || [], t.value) !== -1)
                          return o.parse(this, g, u);
                      }
                    this.fail("unknown block tag: " + t.value, t.lineno, t.colno);
                }
                return n;
              }, w.parseRaw = function(t) {
                t = t || "raw";
                for (var n = "end" + t, a = new RegExp("([\\s\\S]*?){%\\s*(" + t + "|" + n + ")\\s*(?=%})%}"), o = 1, b = "", c = null, e = this.advanceAfterBlockEnd(); (c = this.tokens._extractRegex(a)) && o > 0; ) {
                  var i = c[0], r = c[1], f = c[2];
                  f === t ? o += 1 : f === n && (o -= 1), o === 0 ? (b += r, this.tokens.backN(i.length - r.length)) : b += i;
                }
                return new g.Output(e.lineno, e.colno, [new g.TemplateData(e.lineno, e.colno, b)]);
              }, w.parsePostfix = function(t) {
                for (var n, a = this.peekToken(); a; ) {
                  if (a.type === u.TOKEN_LEFT_PAREN)
                    t = new g.FunCall(a.lineno, a.colno, t, this.parseSignature());
                  else if (a.type === u.TOKEN_LEFT_BRACKET)
                    n = this.parseAggregate(), n.children.length > 1 && this.fail("invalid index"), t = new g.LookupVal(a.lineno, a.colno, t, n.children[0]);
                  else if (a.type === u.TOKEN_OPERATOR && a.value === ".") {
                    this.nextToken();
                    var o = this.nextToken();
                    o.type !== u.TOKEN_SYMBOL && this.fail("expected name as lookup value, got " + o.value, o.lineno, o.colno), n = new g.Literal(o.lineno, o.colno, o.value), t = new g.LookupVal(a.lineno, a.colno, t, n);
                  } else
                    break;
                  a = this.peekToken();
                }
                return t;
              }, w.parseExpression = function() {
                var t = this.parseInlineIf();
                return t;
              }, w.parseInlineIf = function() {
                var t = this.parseOr();
                if (this.skipSymbol("if")) {
                  var n = this.parseOr(), a = t;
                  t = new g.InlineIf(t.lineno, t.colno), t.body = a, t.cond = n, this.skipSymbol("else") ? t.else_ = this.parseOr() : t.else_ = null;
                }
                return t;
              }, w.parseOr = function() {
                for (var t = this.parseAnd(); this.skipSymbol("or"); ) {
                  var n = this.parseAnd();
                  t = new g.Or(t.lineno, t.colno, t, n);
                }
                return t;
              }, w.parseAnd = function() {
                for (var t = this.parseNot(); this.skipSymbol("and"); ) {
                  var n = this.parseNot();
                  t = new g.And(t.lineno, t.colno, t, n);
                }
                return t;
              }, w.parseNot = function() {
                var t = this.peekToken();
                return this.skipSymbol("not") ? new g.Not(t.lineno, t.colno, this.parseNot()) : this.parseIn();
              }, w.parseIn = function() {
                for (var t = this.parseIs(); ; ) {
                  var n = this.nextToken();
                  if (!n)
                    break;
                  var a = n.type === u.TOKEN_SYMBOL && n.value === "not";
                  if (a || this.pushToken(n), this.skipSymbol("in")) {
                    var o = this.parseIs();
                    t = new g.In(t.lineno, t.colno, t, o), a && (t = new g.Not(t.lineno, t.colno, t));
                  } else {
                    a && this.pushToken(n);
                    break;
                  }
                }
                return t;
              }, w.parseIs = function() {
                var t = this.parseCompare();
                if (this.skipSymbol("is")) {
                  var n = this.skipSymbol("not"), a = this.parseCompare();
                  t = new g.Is(t.lineno, t.colno, t, a), n && (t = new g.Not(t.lineno, t.colno, t));
                }
                return t;
              }, w.parseCompare = function() {
                for (var t = ["==", "===", "!=", "!==", "<", ">", "<=", ">="], n = this.parseConcat(), a = []; ; ) {
                  var o = this.nextToken();
                  if (o)
                    if (t.indexOf(o.value) !== -1)
                      a.push(new g.CompareOperand(o.lineno, o.colno, this.parseConcat(), o.value));
                    else {
                      this.pushToken(o);
                      break;
                    }
                  else break;
                }
                return a.length ? new g.Compare(a[0].lineno, a[0].colno, n, a) : n;
              }, w.parseConcat = function() {
                for (var t = this.parseAdd(); this.skipValue(u.TOKEN_TILDE, "~"); ) {
                  var n = this.parseAdd();
                  t = new g.Concat(t.lineno, t.colno, t, n);
                }
                return t;
              }, w.parseAdd = function() {
                for (var t = this.parseSub(); this.skipValue(u.TOKEN_OPERATOR, "+"); ) {
                  var n = this.parseSub();
                  t = new g.Add(t.lineno, t.colno, t, n);
                }
                return t;
              }, w.parseSub = function() {
                for (var t = this.parseMul(); this.skipValue(u.TOKEN_OPERATOR, "-"); ) {
                  var n = this.parseMul();
                  t = new g.Sub(t.lineno, t.colno, t, n);
                }
                return t;
              }, w.parseMul = function() {
                for (var t = this.parseDiv(); this.skipValue(u.TOKEN_OPERATOR, "*"); ) {
                  var n = this.parseDiv();
                  t = new g.Mul(t.lineno, t.colno, t, n);
                }
                return t;
              }, w.parseDiv = function() {
                for (var t = this.parseFloorDiv(); this.skipValue(u.TOKEN_OPERATOR, "/"); ) {
                  var n = this.parseFloorDiv();
                  t = new g.Div(t.lineno, t.colno, t, n);
                }
                return t;
              }, w.parseFloorDiv = function() {
                for (var t = this.parseMod(); this.skipValue(u.TOKEN_OPERATOR, "//"); ) {
                  var n = this.parseMod();
                  t = new g.FloorDiv(t.lineno, t.colno, t, n);
                }
                return t;
              }, w.parseMod = function() {
                for (var t = this.parsePow(); this.skipValue(u.TOKEN_OPERATOR, "%"); ) {
                  var n = this.parsePow();
                  t = new g.Mod(t.lineno, t.colno, t, n);
                }
                return t;
              }, w.parsePow = function() {
                for (var t = this.parseUnary(); this.skipValue(u.TOKEN_OPERATOR, "**"); ) {
                  var n = this.parseUnary();
                  t = new g.Pow(t.lineno, t.colno, t, n);
                }
                return t;
              }, w.parseUnary = function(t) {
                var n = this.peekToken(), a;
                return this.skipValue(u.TOKEN_OPERATOR, "-") ? a = new g.Neg(n.lineno, n.colno, this.parseUnary(!0)) : this.skipValue(u.TOKEN_OPERATOR, "+") ? a = new g.Pos(n.lineno, n.colno, this.parseUnary(!0)) : a = this.parsePrimary(), t || (a = this.parseFilter(a)), a;
              }, w.parsePrimary = function(t) {
                var n = this.nextToken(), a, o = null;
                if (n ? n.type === u.TOKEN_STRING ? a = n.value : n.type === u.TOKEN_INT ? a = parseInt(n.value, 10) : n.type === u.TOKEN_FLOAT ? a = parseFloat(n.value) : n.type === u.TOKEN_BOOLEAN ? n.value === "true" ? a = !0 : n.value === "false" ? a = !1 : this.fail("invalid boolean: " + n.value, n.lineno, n.colno) : n.type === u.TOKEN_NONE ? a = null : n.type === u.TOKEN_REGEX && (a = new RegExp(n.value.body, n.value.flags)) : this.fail("expected expression, got end of file"), a !== void 0 ? o = new g.Literal(n.lineno, n.colno, a) : n.type === u.TOKEN_SYMBOL ? o = new g.Symbol(n.lineno, n.colno, n.value) : (this.pushToken(n), o = this.parseAggregate()), t || (o = this.parsePostfix(o)), o)
                  return o;
                throw this.error("unexpected token: " + n.value, n.lineno, n.colno);
              }, w.parseFilterName = function() {
                for (var t = this.expect(u.TOKEN_SYMBOL), n = t.value; this.skipValue(u.TOKEN_OPERATOR, "."); )
                  n += "." + this.expect(u.TOKEN_SYMBOL).value;
                return new g.Symbol(t.lineno, t.colno, n);
              }, w.parseFilterArgs = function(t) {
                if (this.peekToken().type === u.TOKEN_LEFT_PAREN) {
                  var n = this.parsePostfix(t);
                  return n.args.children;
                }
                return [];
              }, w.parseFilter = function(t) {
                for (; this.skip(u.TOKEN_PIPE); ) {
                  var n = this.parseFilterName();
                  t = new g.Filter(n.lineno, n.colno, n, new g.NodeList(n.lineno, n.colno, [t].concat(this.parseFilterArgs(t))));
                }
                return t;
              }, w.parseFilterStatement = function() {
                var t = this.peekToken();
                this.skipSymbol("filter") || this.fail("parseFilterStatement: expected filter");
                var n = this.parseFilterName(), a = this.parseFilterArgs(n);
                this.advanceAfterBlockEnd(t.value);
                var o = new g.Capture(n.lineno, n.colno, this.parseUntilBlocks("endfilter"));
                this.advanceAfterBlockEnd();
                var b = new g.Filter(n.lineno, n.colno, n, new g.NodeList(n.lineno, n.colno, [o].concat(a)));
                return new g.Output(n.lineno, n.colno, [b]);
              }, w.parseAggregate = function() {
                var t = this.nextToken(), n;
                switch (t.type) {
                  case u.TOKEN_LEFT_PAREN:
                    n = new g.Group(t.lineno, t.colno);
                    break;
                  case u.TOKEN_LEFT_BRACKET:
                    n = new g.Array(t.lineno, t.colno);
                    break;
                  case u.TOKEN_LEFT_CURLY:
                    n = new g.Dict(t.lineno, t.colno);
                    break;
                  default:
                    return null;
                }
                for (; ; ) {
                  var a = this.peekToken().type;
                  if (a === u.TOKEN_RIGHT_PAREN || a === u.TOKEN_RIGHT_BRACKET || a === u.TOKEN_RIGHT_CURLY) {
                    this.nextToken();
                    break;
                  }
                  if (n.children.length > 0 && (this.skip(u.TOKEN_COMMA) || this.fail("parseAggregate: expected comma after expression", t.lineno, t.colno)), n instanceof g.Dict) {
                    var o = this.parsePrimary();
                    this.skip(u.TOKEN_COLON) || this.fail("parseAggregate: expected colon after dict key", t.lineno, t.colno);
                    var b = this.parseExpression();
                    n.addChild(new g.Pair(o.lineno, o.colno, o, b));
                  } else {
                    var c = this.parseExpression();
                    n.addChild(c);
                  }
                }
                return n;
              }, w.parseSignature = function(t, n) {
                var a = this.peekToken();
                if (!n && a.type !== u.TOKEN_LEFT_PAREN) {
                  if (t)
                    return null;
                  this.fail("expected arguments", a.lineno, a.colno);
                }
                a.type === u.TOKEN_LEFT_PAREN && (a = this.nextToken());
                for (var o = new g.NodeList(a.lineno, a.colno), b = new g.KeywordArgs(a.lineno, a.colno), c = !1; ; ) {
                  if (a = this.peekToken(), !n && a.type === u.TOKEN_RIGHT_PAREN) {
                    this.nextToken();
                    break;
                  } else if (n && a.type === u.TOKEN_BLOCK_END)
                    break;
                  if (c && !this.skip(u.TOKEN_COMMA))
                    this.fail("parseSignature: expected comma after expression", a.lineno, a.colno);
                  else {
                    var e = this.parseExpression();
                    this.skipValue(u.TOKEN_OPERATOR, "=") ? b.addChild(new g.Pair(e.lineno, e.colno, e, this.parseExpression())) : o.addChild(e);
                  }
                  c = !0;
                }
                return b.children.length && o.addChild(b), o;
              }, w.parseUntilBlocks = function() {
                for (var t = this.breakOnBlocks, n = arguments.length, a = new Array(n), o = 0; o < n; o++)
                  a[o] = arguments[o];
                this.breakOnBlocks = a;
                var b = this.parse();
                return this.breakOnBlocks = t, b;
              }, w.parseNodes = function() {
                for (var t, n = []; t = this.nextToken(); )
                  if (t.type === u.TOKEN_DATA) {
                    var a = t.value, o = this.peekToken(), b = o && o.value;
                    this.dropLeadingWhitespace && (a = a.replace(/^\s*/, ""), this.dropLeadingWhitespace = !1), o && (o.type === u.TOKEN_BLOCK_START && b.charAt(b.length - 1) === "-" || o.type === u.TOKEN_VARIABLE_START && b.charAt(this.tokens.tags.VARIABLE_START.length) === "-" || o.type === u.TOKEN_COMMENT && b.charAt(this.tokens.tags.COMMENT_START.length) === "-") && (a = a.replace(/\s*$/, "")), n.push(new g.Output(t.lineno, t.colno, [new g.TemplateData(t.lineno, t.colno, a)]));
                  } else if (t.type === u.TOKEN_BLOCK_START) {
                    this.dropLeadingWhitespace = !1;
                    var c = this.parseStatement();
                    if (!c)
                      break;
                    n.push(c);
                  } else if (t.type === u.TOKEN_VARIABLE_START) {
                    var e = this.parseExpression();
                    this.dropLeadingWhitespace = !1, this.advanceAfterVariableEnd(), n.push(new g.Output(t.lineno, t.colno, [e]));
                  } else t.type === u.TOKEN_COMMENT ? this.dropLeadingWhitespace = t.value.charAt(t.value.length - this.tokens.tags.COMMENT_END.length - 1) === "-" : this.fail("Unexpected token at top-level: " + t.type, t.lineno, t.colno);
                return n;
              }, w.parse = function() {
                return new g.NodeList(0, 0, this.parseNodes());
              }, w.parseAsRoot = function() {
                return new g.Root(0, 0, this.parseNodes());
              }, P;
            })(m);
            S.exports = {
              parse: function(R, P, w) {
                var t = new K(u.lex(R, w));
                return P !== void 0 && (t.extensions = P), t.parseAsRoot();
              },
              Parser: K
            };
          }),
          /* 9 */
          /***/
          (function(S, I, L) {
            var _ = L(0), E = ` 
	\r `, u = "()[]{}%*-+~/#,:|.<>=!", g = "0123456789", m = "{%", k = "%}", K = "{{", R = "}}", P = "{#", w = "#}", t = "string", n = "whitespace", a = "data", o = "block-start", b = "block-end", c = "variable-start", e = "variable-end", i = "comment", r = "left-paren", f = "right-paren", l = "left-bracket", s = "right-bracket", h = "left-curly", p = "right-curly", x = "operator", T = "comma", N = "colon", F = "tilde", d = "pipe", O = "int", v = "float", B = "boolean", j = "none", M = "symbol", Z = "special", X = "regex";
            function Q(oe, ee, G, $) {
              return {
                type: oe,
                value: ee,
                lineno: G,
                colno: $
              };
            }
            var le = /* @__PURE__ */ (function() {
              function oe(G, $) {
                this.str = G, this.index = 0, this.len = G.length, this.lineno = 0, this.colno = 0, this.in_code = !1, $ = $ || {};
                var W = $.tags || {};
                this.tags = {
                  BLOCK_START: W.blockStart || m,
                  BLOCK_END: W.blockEnd || k,
                  VARIABLE_START: W.variableStart || K,
                  VARIABLE_END: W.variableEnd || R,
                  COMMENT_START: W.commentStart || P,
                  COMMENT_END: W.commentEnd || w
                }, this.trimBlocks = !!$.trimBlocks, this.lstripBlocks = !!$.lstripBlocks;
              }
              var ee = oe.prototype;
              return ee.nextToken = function() {
                var G = this.lineno, $ = this.colno, W;
                if (this.in_code) {
                  var se = this.current();
                  if (this.isFinished())
                    return null;
                  if (se === '"' || se === "'")
                    return Q(t, this._parseString(se), G, $);
                  if (W = this._extract(E))
                    return Q(n, W, G, $);
                  if ((W = this._extractString(this.tags.BLOCK_END)) || (W = this._extractString("-" + this.tags.BLOCK_END)))
                    return this.in_code = !1, this.trimBlocks && (se = this.current(), se === `
` ? this.forward() : se === "\r" && (this.forward(), se = this.current(), se === `
` ? this.forward() : this.back())), Q(b, W, G, $);
                  if ((W = this._extractString(this.tags.VARIABLE_END)) || (W = this._extractString("-" + this.tags.VARIABLE_END)))
                    return this.in_code = !1, Q(e, W, G, $);
                  if (se === "r" && this.str.charAt(this.index + 1) === "/") {
                    this.forwardN(2);
                    for (var he = ""; !this.isFinished(); )
                      if (this.current() === "/" && this.previous() !== "\\") {
                        this.forward();
                        break;
                      } else
                        he += this.current(), this.forward();
                    for (var de = ["g", "i", "m", "y"], ae = ""; !this.isFinished(); ) {
                      var ye = de.indexOf(this.current()) !== -1;
                      if (ye)
                        ae += this.current(), this.forward();
                      else
                        break;
                    }
                    return Q(X, {
                      body: he,
                      flags: ae
                    }, G, $);
                  } else if (u.indexOf(se) !== -1) {
                    this.forward();
                    var y = ["==", "===", "!=", "!==", "<=", ">=", "//", "**"], C = se + this.current(), D;
                    switch (_.indexOf(y, C) !== -1 && (this.forward(), se = C, _.indexOf(y, C + this.current()) !== -1 && (se = C + this.current(), this.forward())), se) {
                      case "(":
                        D = r;
                        break;
                      case ")":
                        D = f;
                        break;
                      case "[":
                        D = l;
                        break;
                      case "]":
                        D = s;
                        break;
                      case "{":
                        D = h;
                        break;
                      case "}":
                        D = p;
                        break;
                      case ",":
                        D = T;
                        break;
                      case ":":
                        D = N;
                        break;
                      case "~":
                        D = F;
                        break;
                      case "|":
                        D = d;
                        break;
                      default:
                        D = x;
                    }
                    return Q(D, se, G, $);
                  } else if (W = this._extractUntil(E + u), W.match(/^[-+]?[0-9]+$/))
                    if (this.current() === ".") {
                      this.forward();
                      var V = this._extract(g);
                      return Q(v, W + "." + V, G, $);
                    } else
                      return Q(O, W, G, $);
                  else {
                    if (W.match(/^(true|false)$/))
                      return Q(B, W, G, $);
                    if (W === "none" || W === "null")
                      return Q(j, W, G, $);
                    if (W)
                      return Q(M, W, G, $);
                    throw new Error("Unexpected value while parsing: " + W);
                  }
                } else {
                  var q = this.tags.BLOCK_START.charAt(0) + this.tags.VARIABLE_START.charAt(0) + this.tags.COMMENT_START.charAt(0) + this.tags.COMMENT_END.charAt(0);
                  if (this.isFinished())
                    return null;
                  if ((W = this._extractString(this.tags.BLOCK_START + "-")) || (W = this._extractString(this.tags.BLOCK_START)))
                    return this.in_code = !0, Q(o, W, G, $);
                  if ((W = this._extractString(this.tags.VARIABLE_START + "-")) || (W = this._extractString(this.tags.VARIABLE_START)))
                    return this.in_code = !0, Q(c, W, G, $);
                  W = "";
                  var z, ne = !1;
                  for (this._matches(this.tags.COMMENT_START) && (ne = !0, W = this._extractString(this.tags.COMMENT_START)); (z = this._extractUntil(q)) !== null; )
                    if (W += z, (this._matches(this.tags.BLOCK_START) || this._matches(this.tags.VARIABLE_START) || this._matches(this.tags.COMMENT_START)) && !ne) {
                      if (this.lstripBlocks && this._matches(this.tags.BLOCK_START) && this.colno > 0 && this.colno <= W.length) {
                        var Y = W.slice(-this.colno);
                        if (/^\s+$/.test(Y) && (W = W.slice(0, -this.colno), !W.length))
                          return this.nextToken();
                      }
                      break;
                    } else if (this._matches(this.tags.COMMENT_END)) {
                      if (!ne)
                        throw new Error("unexpected end of comment");
                      W += this._extractString(this.tags.COMMENT_END);
                      break;
                    } else
                      W += this.current(), this.forward();
                  if (z === null && ne)
                    throw new Error("expected end of comment, got end of file");
                  return Q(ne ? i : a, W, G, $);
                }
              }, ee._parseString = function(G) {
                this.forward();
                for (var $ = ""; !this.isFinished() && this.current() !== G; ) {
                  var W = this.current();
                  if (W === "\\") {
                    switch (this.forward(), this.current()) {
                      case "n":
                        $ += `
`;
                        break;
                      case "t":
                        $ += "	";
                        break;
                      case "r":
                        $ += "\r";
                        break;
                      default:
                        $ += this.current();
                    }
                    this.forward();
                  } else
                    $ += W, this.forward();
                }
                return this.forward(), $;
              }, ee._matches = function(G) {
                if (this.index + G.length > this.len)
                  return null;
                var $ = this.str.slice(this.index, this.index + G.length);
                return $ === G;
              }, ee._extractString = function(G) {
                return this._matches(G) ? (this.forwardN(G.length), G) : null;
              }, ee._extractUntil = function(G) {
                return this._extractMatching(!0, G || "");
              }, ee._extract = function(G) {
                return this._extractMatching(!1, G);
              }, ee._extractMatching = function(G, $) {
                if (this.isFinished())
                  return null;
                var W = $.indexOf(this.current());
                if (G && W === -1 || !G && W !== -1) {
                  var se = this.current();
                  this.forward();
                  for (var he = $.indexOf(this.current()); (G && he === -1 || !G && he !== -1) && !this.isFinished(); )
                    se += this.current(), this.forward(), he = $.indexOf(this.current());
                  return se;
                }
                return "";
              }, ee._extractRegex = function(G) {
                var $ = this.currentStr().match(G);
                return $ ? (this.forwardN($[0].length), $) : null;
              }, ee.isFinished = function() {
                return this.index >= this.len;
              }, ee.forwardN = function(G) {
                for (var $ = 0; $ < G; $++)
                  this.forward();
              }, ee.forward = function() {
                this.index++, this.previous() === `
` ? (this.lineno++, this.colno = 0) : this.colno++;
              }, ee.backN = function(G) {
                for (var $ = 0; $ < G; $++)
                  this.back();
              }, ee.back = function() {
                if (this.index--, this.current() === `
`) {
                  this.lineno--;
                  var G = this.src.lastIndexOf(`
`, this.index - 1);
                  G === -1 ? this.colno = this.index : this.colno = this.index - G;
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
            S.exports = {
              lex: function(oe, ee) {
                return new le(oe, ee);
              },
              TOKEN_STRING: t,
              TOKEN_WHITESPACE: n,
              TOKEN_DATA: a,
              TOKEN_BLOCK_START: o,
              TOKEN_BLOCK_END: b,
              TOKEN_VARIABLE_START: c,
              TOKEN_VARIABLE_END: e,
              TOKEN_COMMENT: i,
              TOKEN_LEFT_PAREN: r,
              TOKEN_RIGHT_PAREN: f,
              TOKEN_LEFT_BRACKET: l,
              TOKEN_RIGHT_BRACKET: s,
              TOKEN_LEFT_CURLY: h,
              TOKEN_RIGHT_CURLY: p,
              TOKEN_OPERATOR: x,
              TOKEN_COMMA: T,
              TOKEN_COLON: N,
              TOKEN_TILDE: F,
              TOKEN_PIPE: d,
              TOKEN_INT: O,
              TOKEN_FLOAT: v,
              TOKEN_BOOLEAN: B,
              TOKEN_NONE: j,
              TOKEN_SYMBOL: M,
              TOKEN_SPECIAL: Z,
              TOKEN_REGEX: X
            };
          }),
          /* 10 */
          /***/
          (function(S, I, L) {
            function _(K, R) {
              K.prototype = Object.create(R.prototype), K.prototype.constructor = K, E(K, R);
            }
            function E(K, R) {
              return E = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(P, w) {
                return P.__proto__ = w, P;
              }, E(K, R);
            }
            var u = L(6), g = L(19), m = g.PrecompiledLoader, k = /* @__PURE__ */ (function(K) {
              _(R, K);
              function R(w, t) {
                var n;
                return n = K.call(this) || this, n.baseURL = w || ".", t = t || {}, n.useCache = !!t.useCache, n.async = !!t.async, n;
              }
              var P = R.prototype;
              return P.resolve = function(w, t) {
                throw new Error("relative templates not support in the browser yet");
              }, P.getSource = function(w, t) {
                var n = this, a = this.useCache, o;
                return this.fetch(this.baseURL + "/" + w, function(b, c) {
                  if (b)
                    if (t)
                      t(b.content);
                    else if (b.status === 404)
                      o = null;
                    else
                      throw b.content;
                  else
                    o = {
                      src: c,
                      path: w,
                      noCache: !a
                    }, n.emit("load", w, o), t && t(null, o);
                }), o;
              }, P.fetch = function(w, t) {
                if (typeof window > "u")
                  throw new Error("WebLoader can only by used in a browser");
                var n = new XMLHttpRequest(), a = !0;
                n.onreadystatechange = function() {
                  n.readyState === 4 && a && (a = !1, n.status === 0 || n.status === 200 ? t(null, n.responseText) : t({
                    status: n.status,
                    content: n.responseText
                  }));
                }, w += (w.indexOf("?") === -1 ? "?" : "&") + "s=" + (/* @__PURE__ */ new Date()).getTime(), n.open("GET", w, this.async), n.send();
              }, R;
            })(u);
            S.exports = {
              WebLoader: k,
              PrecompiledLoader: m
            };
          }),
          /* 11 */
          /***/
          (function(S, I, L) {
            var _ = L(0), E = L(7), u = E.Environment, g = E.Template, m = L(6), k = L(10), K = L(23), R = L(5), P = L(8), w = L(9), t = L(2), n = L(3), a = L(25), o;
            function b(c, e) {
              e = e || {}, _.isObject(c) && (e = c, c = null);
              var i;
              return k.FileSystemLoader ? i = new k.FileSystemLoader(c, {
                watch: e.watch,
                noCache: e.noCache
              }) : k.WebLoader && (i = new k.WebLoader(c, {
                useCache: e.web && e.web.useCache,
                async: e.web && e.web.async
              })), o = new u(i, e), e && e.express && o.express(e.express), o;
            }
            S.exports = {
              Environment: u,
              Template: g,
              Loader: m,
              FileSystemLoader: k.FileSystemLoader,
              NodeResolveLoader: k.NodeResolveLoader,
              PrecompiledLoader: k.PrecompiledLoader,
              WebLoader: k.WebLoader,
              compiler: R,
              parser: P,
              lexer: w,
              runtime: t,
              lib: _,
              nodes: n,
              installJinjaCompat: a,
              configure: b,
              reset: function() {
                o = void 0;
              },
              compile: function(c, e, i, r) {
                return o || b(), new g(c, e, i, r);
              },
              render: function(c, e, i) {
                return o || b(), o.render(c, e, i);
              },
              renderString: function(c, e, i) {
                return o || b(), o.renderString(c, e, i);
              },
              precompile: K ? K.precompile : void 0,
              precompileString: K ? K.precompileString : void 0
            };
          }),
          /* 12 */
          /***/
          (function(S, I, L) {
            var _ = L(13), E = [], u = [], g = _.makeRequestCallFromTimer(m);
            function m() {
              if (u.length)
                throw u.shift();
            }
            S.exports = k;
            function k(R) {
              var P;
              E.length ? P = E.pop() : P = new K(), P.task = R, _(P);
            }
            function K() {
              this.task = null;
            }
            K.prototype.call = function() {
              try {
                this.task.call();
              } catch (R) {
                k.onerror ? k.onerror(R) : (u.push(R), g());
              } finally {
                this.task = null, E[E.length] = this;
              }
            };
          }),
          /* 13 */
          /***/
          (function(S, I, L) {
            (function(_) {
              S.exports = E;
              function E(n) {
                u.length || g(), u[u.length] = n;
              }
              var u = [], g, m = 0, k = 1024;
              function K() {
                for (; m < u.length; ) {
                  var n = m;
                  if (m = m + 1, u[n].call(), m > k) {
                    for (var a = 0, o = u.length - m; a < o; a++)
                      u[a] = u[a + m];
                    u.length -= m, m = 0;
                  }
                }
                u.length = 0, m = 0;
              }
              var R = typeof _ < "u" ? _ : self, P = R.MutationObserver || R.WebKitMutationObserver;
              typeof P == "function" ? g = w(K) : g = t(K), E.requestFlush = g;
              function w(n) {
                var a = 1, o = new P(n), b = document.createTextNode("");
                return o.observe(b, { characterData: !0 }), function() {
                  a = -a, b.data = a;
                };
              }
              function t(n) {
                return function() {
                  var a = setTimeout(b, 0), o = setInterval(b, 50);
                  function b() {
                    clearTimeout(a), clearInterval(o), n();
                  }
                };
              }
              E.makeRequestCallFromTimer = t;
            }).call(I, L(14));
          }),
          /* 14 */
          /***/
          (function(S, I) {
            var L;
            L = /* @__PURE__ */ (function() {
              return this;
            })();
            try {
              L = L || Function("return this")() || (0, eval)("this");
            } catch {
              typeof window == "object" && (L = window);
            }
            S.exports = L;
          }),
          /* 15 */
          /***/
          (function(S, I, L) {
            var _, E;
            (function(u) {
              var g = function() {
                var P = Array.prototype.slice.call(arguments);
                typeof P[0] == "function" && P[0].apply(null, P.splice(1));
              }, m = function(P) {
                typeof setImmediate == "function" ? setImmediate(P) : typeof process < "u" && process.nextTick ? process.nextTick(P) : setTimeout(P, 0);
              }, k = function(P) {
                var w = function(t) {
                  var n = function() {
                    return P.length && P[t].apply(null, arguments), n.next();
                  };
                  return n.next = function() {
                    return t < P.length - 1 ? w(t + 1) : null;
                  }, n;
                };
                return w(0);
              }, K = Array.isArray || function(P) {
                return Object.prototype.toString.call(P) === "[object Array]";
              }, R = function(P, w, t) {
                var n = t ? m : g;
                if (w = w || function() {
                }, !K(P)) {
                  var a = new Error("First argument to waterfall must be an array of functions");
                  return w(a);
                }
                if (!P.length)
                  return w();
                var o = function(b) {
                  return function(c) {
                    if (c)
                      w.apply(null, arguments), w = function() {
                      };
                    else {
                      var e = Array.prototype.slice.call(arguments, 1), i = b.next();
                      i ? e.push(o(i)) : e.push(w), n(function() {
                        b.apply(null, e);
                      });
                    }
                  };
                };
                o(k(P))();
              };
              _ = [], E = (function() {
                return R;
              }).apply(I, _), E !== void 0 && (S.exports = E);
            })();
          }),
          /* 16 */
          /***/
          (function(S, I, L) {
            var _ = typeof Reflect == "object" ? Reflect : null, E = _ && typeof _.apply == "function" ? _.apply : function(l, s, h) {
              return Function.prototype.apply.call(l, s, h);
            }, u;
            _ && typeof _.ownKeys == "function" ? u = _.ownKeys : Object.getOwnPropertySymbols ? u = function(l) {
              return Object.getOwnPropertyNames(l).concat(Object.getOwnPropertySymbols(l));
            } : u = function(l) {
              return Object.getOwnPropertyNames(l);
            };
            function g(l) {
              console && console.warn && console.warn(l);
            }
            var m = Number.isNaN || function(l) {
              return l !== l;
            };
            function k() {
              k.init.call(this);
            }
            S.exports = k, S.exports.once = i, k.EventEmitter = k, k.prototype._events = void 0, k.prototype._eventsCount = 0, k.prototype._maxListeners = void 0;
            var K = 10;
            function R(l) {
              if (typeof l != "function")
                throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof l);
            }
            Object.defineProperty(k, "defaultMaxListeners", {
              enumerable: !0,
              get: function() {
                return K;
              },
              set: function(l) {
                if (typeof l != "number" || l < 0 || m(l))
                  throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + l + ".");
                K = l;
              }
            }), k.init = function() {
              (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
            }, k.prototype.setMaxListeners = function(l) {
              if (typeof l != "number" || l < 0 || m(l))
                throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + l + ".");
              return this._maxListeners = l, this;
            };
            function P(l) {
              return l._maxListeners === void 0 ? k.defaultMaxListeners : l._maxListeners;
            }
            k.prototype.getMaxListeners = function() {
              return P(this);
            }, k.prototype.emit = function(l) {
              for (var s = [], h = 1; h < arguments.length; h++) s.push(arguments[h]);
              var p = l === "error", x = this._events;
              if (x !== void 0)
                p = p && x.error === void 0;
              else if (!p)
                return !1;
              if (p) {
                var T;
                if (s.length > 0 && (T = s[0]), T instanceof Error)
                  throw T;
                var N = new Error("Unhandled error." + (T ? " (" + T.message + ")" : ""));
                throw N.context = T, N;
              }
              var F = x[l];
              if (F === void 0)
                return !1;
              if (typeof F == "function")
                E(F, this, s);
              else
                for (var d = F.length, O = b(F, d), h = 0; h < d; ++h)
                  E(O[h], this, s);
              return !0;
            };
            function w(l, s, h, p) {
              var x, T, N;
              if (R(h), T = l._events, T === void 0 ? (T = l._events = /* @__PURE__ */ Object.create(null), l._eventsCount = 0) : (T.newListener !== void 0 && (l.emit(
                "newListener",
                s,
                h.listener ? h.listener : h
              ), T = l._events), N = T[s]), N === void 0)
                N = T[s] = h, ++l._eventsCount;
              else if (typeof N == "function" ? N = T[s] = p ? [h, N] : [N, h] : p ? N.unshift(h) : N.push(h), x = P(l), x > 0 && N.length > x && !N.warned) {
                N.warned = !0;
                var F = new Error("Possible EventEmitter memory leak detected. " + N.length + " " + String(s) + " listeners added. Use emitter.setMaxListeners() to increase limit");
                F.name = "MaxListenersExceededWarning", F.emitter = l, F.type = s, F.count = N.length, g(F);
              }
              return l;
            }
            k.prototype.addListener = function(l, s) {
              return w(this, l, s, !1);
            }, k.prototype.on = k.prototype.addListener, k.prototype.prependListener = function(l, s) {
              return w(this, l, s, !0);
            };
            function t() {
              if (!this.fired)
                return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
            }
            function n(l, s, h) {
              var p = { fired: !1, wrapFn: void 0, target: l, type: s, listener: h }, x = t.bind(p);
              return x.listener = h, p.wrapFn = x, x;
            }
            k.prototype.once = function(l, s) {
              return R(s), this.on(l, n(this, l, s)), this;
            }, k.prototype.prependOnceListener = function(l, s) {
              return R(s), this.prependListener(l, n(this, l, s)), this;
            }, k.prototype.removeListener = function(l, s) {
              var h, p, x, T, N;
              if (R(s), p = this._events, p === void 0)
                return this;
              if (h = p[l], h === void 0)
                return this;
              if (h === s || h.listener === s)
                --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete p[l], p.removeListener && this.emit("removeListener", l, h.listener || s));
              else if (typeof h != "function") {
                for (x = -1, T = h.length - 1; T >= 0; T--)
                  if (h[T] === s || h[T].listener === s) {
                    N = h[T].listener, x = T;
                    break;
                  }
                if (x < 0)
                  return this;
                x === 0 ? h.shift() : c(h, x), h.length === 1 && (p[l] = h[0]), p.removeListener !== void 0 && this.emit("removeListener", l, N || s);
              }
              return this;
            }, k.prototype.off = k.prototype.removeListener, k.prototype.removeAllListeners = function(l) {
              var s, h, p;
              if (h = this._events, h === void 0)
                return this;
              if (h.removeListener === void 0)
                return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : h[l] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete h[l]), this;
              if (arguments.length === 0) {
                var x = Object.keys(h), T;
                for (p = 0; p < x.length; ++p)
                  T = x[p], T !== "removeListener" && this.removeAllListeners(T);
                return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
              }
              if (s = h[l], typeof s == "function")
                this.removeListener(l, s);
              else if (s !== void 0)
                for (p = s.length - 1; p >= 0; p--)
                  this.removeListener(l, s[p]);
              return this;
            };
            function a(l, s, h) {
              var p = l._events;
              if (p === void 0)
                return [];
              var x = p[s];
              return x === void 0 ? [] : typeof x == "function" ? h ? [x.listener || x] : [x] : h ? e(x) : b(x, x.length);
            }
            k.prototype.listeners = function(l) {
              return a(this, l, !0);
            }, k.prototype.rawListeners = function(l) {
              return a(this, l, !1);
            }, k.listenerCount = function(l, s) {
              return typeof l.listenerCount == "function" ? l.listenerCount(s) : o.call(l, s);
            }, k.prototype.listenerCount = o;
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
            k.prototype.eventNames = function() {
              return this._eventsCount > 0 ? u(this._events) : [];
            };
            function b(l, s) {
              for (var h = new Array(s), p = 0; p < s; ++p)
                h[p] = l[p];
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
              return new Promise(function(h, p) {
                function x(N) {
                  l.removeListener(s, T), p(N);
                }
                function T() {
                  typeof l.removeListener == "function" && l.removeListener("error", x), h([].slice.call(arguments));
                }
                f(l, s, T, { once: !0 }), s !== "error" && r(l, x, { once: !0 });
              });
            }
            function r(l, s, h) {
              typeof l.on == "function" && f(l, "error", s, h);
            }
            function f(l, s, h, p) {
              if (typeof l.on == "function")
                p.once ? l.once(s, h) : l.on(s, h);
              else if (typeof l.addEventListener == "function")
                l.addEventListener(s, function x(T) {
                  p.once && l.removeEventListener(s, x), h(T);
                });
              else
                throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof l);
            }
          }),
          /* 17 */
          /***/
          (function(S, I, L) {
            var _ = L(3), E = L(0), u = 0;
            function g() {
              return "hole_" + u++;
            }
            function m(o, b) {
              for (var c = null, e = 0; e < o.length; e++) {
                var i = b(o[e]);
                i !== o[e] && (c || (c = o.slice()), c[e] = i);
              }
              return c || o;
            }
            function k(o, b, c) {
              if (!(o instanceof _.Node))
                return o;
              if (!c) {
                var e = b(o);
                if (e && e !== o)
                  return e;
              }
              if (o instanceof _.NodeList) {
                var i = m(o.children, function(h) {
                  return k(h, b, c);
                });
                i !== o.children && (o = new _[o.typename](o.lineno, o.colno, i));
              } else if (o instanceof _.CallExtension) {
                var r = k(o.args, b, c), f = m(o.contentArgs, function(h) {
                  return k(h, b, c);
                });
                (r !== o.args || f !== o.contentArgs) && (o = new _[o.typename](o.extName, o.prop, r, f));
              } else {
                var l = o.fields.map(function(h) {
                  return o[h];
                }), s = m(l, function(h) {
                  return k(h, b, c);
                });
                s !== l && (o = new _[o.typename](o.lineno, o.colno), s.forEach(function(h, p) {
                  o[o.fields[p]] = h;
                }));
              }
              return c && b(o) || o;
            }
            function K(o, b) {
              return k(o, b, !0);
            }
            function R(o, b, c) {
              var e = [], i = K(c ? o[c] : o, function(r) {
                var f;
                return r instanceof _.Block ? r : ((r instanceof _.Filter && E.indexOf(b, r.name.value) !== -1 || r instanceof _.CallExtensionAsync) && (f = new _.Symbol(r.lineno, r.colno, g()), e.push(new _.FilterAsync(r.lineno, r.colno, r.name, r.args, f))), f);
              });
              return c ? o[c] = i : o = i, e.length ? (e.push(o), new _.NodeList(o.lineno, o.colno, e)) : o;
            }
            function P(o, b) {
              return K(o, function(c) {
                return c instanceof _.Output ? R(c, b) : c instanceof _.Set ? R(c, b, "value") : c instanceof _.For ? R(c, b, "arr") : c instanceof _.If ? R(c, b, "cond") : c instanceof _.CallExtension ? R(c, b, "args") : void 0;
              });
            }
            function w(o) {
              return k(o, function(b) {
                if (b instanceof _.Block) {
                  var c = !1, e = g();
                  b.body = k(b.body, function(i) {
                    if (i instanceof _.FunCall && i.name.value === "super")
                      return c = !0, new _.Symbol(i.lineno, i.colno, e);
                  }), c && b.body.children.unshift(new _.Super(0, 0, b.name, new _.Symbol(0, 0, e)));
                }
              });
            }
            function t(o) {
              return K(o, function(b) {
                if (!(!(b instanceof _.If) && !(b instanceof _.For))) {
                  var c = !1;
                  if (k(b, function(e) {
                    if (e instanceof _.FilterAsync || e instanceof _.IfAsync || e instanceof _.AsyncEach || e instanceof _.AsyncAll || e instanceof _.CallExtensionAsync)
                      return c = !0, e;
                  }), c) {
                    if (b instanceof _.If)
                      return new _.IfAsync(b.lineno, b.colno, b.cond, b.body, b.else_);
                    if (b instanceof _.For && !(b instanceof _.AsyncAll))
                      return new _.AsyncEach(b.lineno, b.colno, b.arr, b.name, b.body, b.else_);
                  }
                }
              });
            }
            function n(o, b) {
              return t(w(P(o, b)));
            }
            function a(o, b) {
              return n(o, b || []);
            }
            S.exports = {
              transform: a
            };
          }),
          /* 18 */
          /***/
          (function(S, u, L) {
            var _ = L(0), E = L(2), u = S.exports = {};
            function g(y, C) {
              return y == null || y === !1 ? C : y;
            }
            u.abs = Math.abs;
            function m(y) {
              return y !== y;
            }
            function k(y, C, D) {
              var V, q = [], z = [];
              for (V = 0; V < y.length; V++)
                V % C === 0 && z.length && (q.push(z), z = []), z.push(y[V]);
              if (z.length) {
                if (D)
                  for (V = z.length; V < C; V++)
                    z.push(D);
                q.push(z);
              }
              return q;
            }
            u.batch = k;
            function K(y) {
              y = g(y, "");
              var C = y.toLowerCase();
              return E.copySafeness(y, C.charAt(0).toUpperCase() + C.slice(1));
            }
            u.capitalize = K;
            function R(y, C) {
              if (y = g(y, ""), C = C || 80, y.length >= C)
                return y;
              var D = C - y.length, V = _.repeat(" ", D / 2 - D % 2), q = _.repeat(" ", D / 2);
              return E.copySafeness(y, V + y + q);
            }
            u.center = R;
            function P(y, C, D) {
              return D ? y || C : y !== void 0 ? y : C;
            }
            u.default = P;
            function w(y, C, D) {
              if (!_.isObject(y))
                throw new _.TemplateError("dictsort filter: val must be an object");
              var V = [];
              for (var q in y)
                V.push([q, y[q]]);
              var z;
              if (D === void 0 || D === "key")
                z = 0;
              else if (D === "value")
                z = 1;
              else
                throw new _.TemplateError("dictsort filter: You can only sort by either key or value");
              return V.sort(function(ne, Y) {
                var ce = ne[z], fe = Y[z];
                return C || (_.isString(ce) && (ce = ce.toUpperCase()), _.isString(fe) && (fe = fe.toUpperCase())), ce > fe ? 1 : ce === fe ? 0 : -1;
              }), V;
            }
            u.dictsort = w;
            function t(y, C) {
              return JSON.stringify(y, null, C);
            }
            u.dump = t;
            function n(y) {
              return y instanceof E.SafeString ? y : (y = y ?? "", E.markSafe(_.escape(y.toString())));
            }
            u.escape = n;
            function a(y) {
              return y instanceof E.SafeString ? y : (y = y ?? "", E.markSafe(y.toString()));
            }
            u.safe = a;
            function o(y) {
              return y[0];
            }
            u.first = o;
            function b(y) {
              return y = y ?? "", E.markSafe(_.escape(y.toString()));
            }
            u.forceescape = b;
            function c(y, C) {
              return _.groupBy(y, C, this.env.opts.throwOnUndefined);
            }
            u.groupby = c;
            function e(y, C, D) {
              if (y = g(y, ""), y === "")
                return "";
              C = C || 4;
              var V = y.split(`
`), q = _.repeat(" ", C), z = V.map(function(ne, Y) {
                return Y === 0 && !D ? ne : "" + q + ne;
              }).join(`
`);
              return E.copySafeness(y, z);
            }
            u.indent = e;
            function i(y, C, D) {
              return C = C || "", D && (y = _.map(y, function(V) {
                return V[D];
              })), y.join(C);
            }
            u.join = i;
            function r(y) {
              return y[y.length - 1];
            }
            u.last = r;
            function f(y) {
              var C = g(y, "");
              return C !== void 0 ? typeof Map == "function" && C instanceof Map || typeof Set == "function" && C instanceof Set ? C.size : _.isObject(C) && !(C instanceof E.SafeString) ? _.keys(C).length : C.length : 0;
            }
            u.length = f;
            function l(y) {
              if (_.isString(y))
                return y.split("");
              if (_.isObject(y))
                return _._entries(y || {}).map(function(C) {
                  var D = C[0], V = C[1];
                  return {
                    key: D,
                    value: V
                  };
                });
              if (_.isArray(y))
                return y;
              throw new _.TemplateError("list filter: type not iterable");
            }
            u.list = l;
            function s(y) {
              return y = g(y, ""), y.toLowerCase();
            }
            u.lower = s;
            function h(y) {
              return y == null ? "" : E.copySafeness(y, y.replace(/\r\n|\n/g, `<br />
`));
            }
            u.nl2br = h;
            function p(y) {
              return y[Math.floor(Math.random() * y.length)];
            }
            u.random = p;
            function x(y) {
              function C(D, V, q) {
                V === void 0 && (V = "truthy");
                var z = this, ne = z.env.getTest(V);
                return _.toArray(D).filter(function(Y) {
                  return ne.call(z, Y, q) === y;
                });
              }
              return C;
            }
            u.reject = x(!1);
            function T(y, C) {
              return y.filter(function(D) {
                return !D[C];
              });
            }
            u.rejectattr = T, u.select = x(!0);
            function N(y, C) {
              return y.filter(function(D) {
                return !!D[C];
              });
            }
            u.selectattr = N;
            function F(y, C, D, V) {
              var q = y;
              if (C instanceof RegExp)
                return y.replace(C, D);
              typeof V > "u" && (V = -1);
              var z = "";
              if (typeof C == "number")
                C = "" + C;
              else if (typeof C != "string")
                return y;
              if (typeof y == "number" && (y = "" + y), typeof y != "string" && !(y instanceof E.SafeString))
                return y;
              if (C === "")
                return z = D + y.split("").join(D) + D, E.copySafeness(y, z);
              var ne = y.indexOf(C);
              if (V === 0 || ne === -1)
                return y;
              for (var Y = 0, ce = 0; ne > -1 && (V === -1 || ce < V); )
                z += y.substring(Y, ne) + D, Y = ne + C.length, ce++, ne = y.indexOf(C, Y);
              return Y < y.length && (z += y.substring(Y)), E.copySafeness(q, z);
            }
            u.replace = F;
            function d(y) {
              var C;
              return _.isString(y) ? C = l(y) : C = _.map(y, function(D) {
                return D;
              }), C.reverse(), _.isString(y) ? E.copySafeness(y, C.join("")) : C;
            }
            u.reverse = d;
            function O(y, C, D) {
              C = C || 0;
              var V = Math.pow(10, C), q;
              return D === "ceil" ? q = Math.ceil : D === "floor" ? q = Math.floor : q = Math.round, q(y * V) / V;
            }
            u.round = O;
            function v(y, C, D) {
              for (var V = Math.floor(y.length / C), q = y.length % C, z = [], ne = 0, Y = 0; Y < C; Y++) {
                var ce = ne + Y * V;
                Y < q && ne++;
                var fe = ne + (Y + 1) * V, pe = y.slice(ce, fe);
                D && Y >= q && pe.push(D), z.push(pe);
              }
              return z;
            }
            u.slice = v;
            function B(y, C, D) {
              return D === void 0 && (D = 0), C && (y = _.map(y, function(V) {
                return V[C];
              })), D + y.reduce(function(V, q) {
                return V + q;
              }, 0);
            }
            u.sum = B, u.sort = E.makeMacro(["value", "reverse", "case_sensitive", "attribute"], [], function(y, C, D, V) {
              var q = this, z = _.map(y, function(Y) {
                return Y;
              }), ne = _.getAttrGetter(V);
              return z.sort(function(Y, ce) {
                var fe = V ? ne(Y) : Y, pe = V ? ne(ce) : ce;
                if (q.env.opts.throwOnUndefined && V && (fe === void 0 || pe === void 0))
                  throw new TypeError('sort: attribute "' + V + '" resolved to undefined');
                return !D && _.isString(fe) && _.isString(pe) && (fe = fe.toLowerCase(), pe = pe.toLowerCase()), fe < pe ? C ? 1 : -1 : fe > pe ? C ? -1 : 1 : 0;
              }), z;
            });
            function j(y) {
              return E.copySafeness(y, y);
            }
            u.string = j;
            function M(y, C) {
              y = g(y, "");
              var D = /<\/?([a-z][a-z0-9]*)\b[^>]*>|<!--[\s\S]*?-->/gi, V = X(y.replace(D, "")), q = "";
              return C ? q = V.replace(/^ +| +$/gm, "").replace(/ +/g, " ").replace(/(\r\n)/g, `
`).replace(/\n\n\n+/g, `

`) : q = V.replace(/\s+/gi, " "), E.copySafeness(y, q);
            }
            u.striptags = M;
            function Z(y) {
              y = g(y, "");
              var C = y.split(" ").map(function(D) {
                return K(D);
              });
              return E.copySafeness(y, C.join(" "));
            }
            u.title = Z;
            function X(y) {
              return E.copySafeness(y, y.replace(/^\s*|\s*$/g, ""));
            }
            u.trim = X;
            function Q(y, C, D, V) {
              var q = y;
              if (y = g(y, ""), C = C || 255, y.length <= C)
                return y;
              if (D)
                y = y.substring(0, C);
              else {
                var z = y.lastIndexOf(" ", C);
                z === -1 && (z = C), y = y.substring(0, z);
              }
              return y += V ?? "...", E.copySafeness(q, y);
            }
            u.truncate = Q;
            function le(y) {
              return y = g(y, ""), y.toUpperCase();
            }
            u.upper = le;
            function oe(y) {
              var C = encodeURIComponent;
              if (_.isString(y))
                return C(y);
              var D = _.isArray(y) ? y : _._entries(y);
              return D.map(function(V) {
                var q = V[0], z = V[1];
                return C(q) + "=" + C(z);
              }).join("&");
            }
            u.urlencode = oe;
            var ee = /^(?:\(|<|&lt;)?(.*?)(?:\.|,|\)|\n|&gt;)?$/, G = /^[\w.!#$%&'*+\-\/=?\^`{|}~]+@[a-z\d\-]+(\.[a-z\d\-]+)+$/i, $ = /^https?:\/\/.*$/, W = /^www\./, se = /\.(?:org|net|com)(?:\:|\/|$)/;
            function he(y, C, D) {
              m(C) && (C = 1 / 0);
              var V = D === !0 ? ' rel="nofollow"' : "", q = y.split(/(\s+)/).filter(function(z) {
                return z && z.length;
              }).map(function(z) {
                var ne = z.match(ee), Y = ne ? ne[1] : z, ce = Y.substr(0, C);
                return $.test(Y) ? '<a href="' + Y + '"' + V + ">" + ce + "</a>" : W.test(Y) ? '<a href="http://' + Y + '"' + V + ">" + ce + "</a>" : G.test(Y) ? '<a href="mailto:' + Y + '">' + Y + "</a>" : se.test(Y) ? '<a href="http://' + Y + '"' + V + ">" + ce + "</a>" : z;
              });
              return q.join("");
            }
            u.urlize = he;
            function de(y) {
              y = g(y, "");
              var C = y ? y.match(/\w+/g) : null;
              return C ? C.length : null;
            }
            u.wordcount = de;
            function ae(y, C) {
              var D = parseFloat(y);
              return m(D) ? C : D;
            }
            u.float = ae;
            var ye = E.makeMacro(["value", "default", "base"], [], function(y, C, D) {
              D === void 0 && (D = 10);
              var V = parseInt(y, D);
              return m(V) ? C : V;
            });
            u.int = ye, u.d = u.default, u.e = u.escape;
          }),
          /* 19 */
          /***/
          (function(S, I, L) {
            function _(m, k) {
              m.prototype = Object.create(k.prototype), m.prototype.constructor = m, E(m, k);
            }
            function E(m, k) {
              return E = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(K, R) {
                return K.__proto__ = R, K;
              }, E(m, k);
            }
            var u = L(6), g = /* @__PURE__ */ (function(m) {
              _(k, m);
              function k(R) {
                var P;
                return P = m.call(this) || this, P.precompiled = R || {}, P;
              }
              var K = k.prototype;
              return K.getSource = function(R) {
                return this.precompiled[R] ? {
                  src: {
                    type: "code",
                    obj: this.precompiled[R]
                  },
                  path: R
                } : null;
              }, k;
            })(u);
            S.exports = {
              PrecompiledLoader: g
            };
          }),
          /* 20 */
          /***/
          (function(S, I, L) {
            var _ = L(2).SafeString;
            function E(p) {
              return typeof p == "function";
            }
            I.callable = E;
            function u(p) {
              return p !== void 0;
            }
            I.defined = u;
            function g(p, x) {
              return p % x === 0;
            }
            I.divisibleby = g;
            function m(p) {
              return p instanceof _;
            }
            I.escaped = m;
            function k(p, x) {
              return p === x;
            }
            I.equalto = k, I.eq = I.equalto, I.sameas = I.equalto;
            function K(p) {
              return p % 2 === 0;
            }
            I.even = K;
            function R(p) {
              return !p;
            }
            I.falsy = R;
            function P(p, x) {
              return p >= x;
            }
            I.ge = P;
            function w(p, x) {
              return p > x;
            }
            I.greaterthan = w, I.gt = I.greaterthan;
            function t(p, x) {
              return p <= x;
            }
            I.le = t;
            function n(p, x) {
              return p < x;
            }
            I.lessthan = n, I.lt = I.lessthan;
            function a(p) {
              return p.toLowerCase() === p;
            }
            I.lower = a;
            function o(p, x) {
              return p !== x;
            }
            I.ne = o;
            function b(p) {
              return p === null;
            }
            I.null = b;
            function c(p) {
              return typeof p == "number";
            }
            I.number = c;
            function e(p) {
              return p % 2 === 1;
            }
            I.odd = e;
            function i(p) {
              return typeof p == "string";
            }
            I.string = i;
            function r(p) {
              return !!p;
            }
            I.truthy = r;
            function f(p) {
              return p === void 0;
            }
            I.undefined = f;
            function l(p) {
              return p.toUpperCase() === p;
            }
            I.upper = l;
            function s(p) {
              return typeof Symbol < "u" ? !!p[Symbol.iterator] : Array.isArray(p) || typeof p == "string";
            }
            I.iterable = s;
            function h(p) {
              var x = p != null && typeof p == "object" && !Array.isArray(p);
              return Set ? x && !(p instanceof Set) : x;
            }
            I.mapping = h;
          }),
          /* 21 */
          /***/
          (function(S, I, L) {
            function _(g) {
              var m = -1;
              return {
                current: null,
                reset: function() {
                  m = -1, this.current = null;
                },
                next: function() {
                  return m++, m >= g.length && (m = 0), this.current = g[m], this.current;
                }
              };
            }
            function E(g) {
              g = g || ",";
              var m = !0;
              return function() {
                var k = m ? "" : g;
                return m = !1, k;
              };
            }
            function u() {
              return {
                range: function(g, m, k) {
                  typeof m > "u" ? (m = g, g = 0, k = 1) : k || (k = 1);
                  var K = [];
                  if (k > 0)
                    for (var R = g; R < m; R += k)
                      K.push(R);
                  else
                    for (var P = g; P > m; P += k)
                      K.push(P);
                  return K;
                },
                cycler: function() {
                  return _(Array.prototype.slice.call(arguments));
                },
                joiner: function(g) {
                  return E(g);
                }
              };
            }
            S.exports = u;
          }),
          /* 22 */
          /***/
          (function(S, I, L) {
            var _ = L(4);
            S.exports = function(E, u) {
              function g(m, k) {
                if (this.name = m, this.path = m, this.defaultEngine = k.defaultEngine, this.ext = _.extname(m), !this.ext && !this.defaultEngine)
                  throw new Error("No default engine was specified and no extension was provided.");
                this.ext || (this.name += this.ext = (this.defaultEngine[0] !== "." ? "." : "") + this.defaultEngine);
              }
              return g.prototype.render = function(m, k) {
                E.render(this.name, m, k);
              }, u.set("view", g), u.set("nunjucksEnv", E), E;
            };
          }),
          /* 23 */
          /***/
          (function(S, I, L) {
            var _ = L(4), E = L(4), u = L(0), g = u._prettifyError, m = L(5), k = L(7), K = k.Environment, R = L(24);
            function P(a, o) {
              return Array.isArray(o) ? o.some(function(b) {
                return a.match(b);
              }) : !1;
            }
            function w(a, o) {
              o = o || {}, o.isString = !0;
              var b = o.env || new K([]), c = o.wrapper || R;
              if (!o.name)
                throw new Error('the "name" option is required when compiling a string');
              return c([n(a, o.name, b)], o);
            }
            function t(a, o) {
              o = o || {};
              var b = o.env || new K([]), c = o.wrapper || R;
              if (o.isString)
                return w(a, o);
              var e = _.existsSync(a) && _.statSync(a), i = [], r = [];
              function f(h) {
                _.readdirSync(h).forEach(function(p) {
                  var x = E.join(h, p), T = x.substr(E.join(a, "/").length), N = _.statSync(x);
                  N && N.isDirectory() ? (T += "/", P(T, o.exclude) || f(x)) : P(T, o.include) && r.push(x);
                });
              }
              if (e.isFile())
                i.push(n(_.readFileSync(a, "utf-8"), o.name || a, b));
              else if (e.isDirectory()) {
                f(a);
                for (var l = 0; l < r.length; l++) {
                  var s = r[l].replace(E.join(a, "/"), "");
                  try {
                    i.push(n(_.readFileSync(r[l], "utf-8"), s, b));
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
            function n(a, o, b) {
              b = b || new K([]);
              var c = b.asyncFilters, e = b.extensionsList, i;
              o = o.replace(/\\/g, "/");
              try {
                i = m.compile(a, c, e, o, b.opts);
              } catch (r) {
                throw g(o, !1, r);
              }
              return {
                name: o,
                template: i
              };
            }
            S.exports = {
              precompile: t,
              precompileString: w
            };
          }),
          /* 24 */
          /***/
          (function(S, I, L) {
            function _(E, u) {
              var g = "";
              u = u || {};
              for (var m = 0; m < E.length; m++) {
                var k = JSON.stringify(E[m].name), K = E[m].template;
                g += "(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})[" + k + `] = (function() {
` + K + `
})();
`, u.asFunction && (g += "return function(ctx, cb) { return nunjucks.render(" + k + `, ctx, cb); }
`), g += `})();
`;
              }
              return g;
            }
            S.exports = _;
          }),
          /* 25 */
          /***/
          (function(S, I, L) {
            function _() {
              var E = this.runtime, u = this.lib, g = this.compiler.Compiler, m = this.parser.Parser, k = this.nodes, K = this.lexer, R = E.contextOrFrameLookup, P = E.memberLookup, w, t;
              g && (w = g.prototype.assertType), m && (t = m.prototype.parseAggregate);
              function n() {
                E.contextOrFrameLookup = R, E.memberLookup = P, g && (g.prototype.assertType = w), m && (m.prototype.parseAggregate = t);
              }
              E.contextOrFrameLookup = function(r, f, l) {
                var s = R.apply(this, arguments);
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
              if (k && g && m) {
                var o = k.Node.extend("Slice", {
                  fields: ["start", "stop", "step"],
                  init: function(r, f, l, s, h) {
                    l = l || new k.Literal(r, f, null), s = s || new k.Literal(r, f, null), h = h || new k.Literal(r, f, 1), this.parent(r, f, l, s, h);
                  }
                });
                g.prototype.assertType = function(r) {
                  r instanceof o || w.apply(this, arguments);
                }, g.prototype.compileSlice = function(r, f) {
                  this._emit("("), this._compileExpression(r.start, f), this._emit("),("), this._compileExpression(r.stop, f), this._emit("),("), this._compileExpression(r.step, f), this._emit(")");
                }, m.prototype.parseAggregate = function() {
                  var r = this, f = a(this.tokens);
                  f.colno--, f.index--;
                  try {
                    return t.apply(this);
                  } catch (F) {
                    var l = a(this.tokens), s = function() {
                      return u._assign(r.tokens, l), F;
                    };
                    u._assign(this.tokens, f), this.peeked = !1;
                    var h = this.peekToken();
                    if (h.type !== K.TOKEN_LEFT_BRACKET)
                      throw s();
                    this.nextToken();
                    for (var p = new o(h.lineno, h.colno), x = !1, T = 0; T <= p.fields.length && !this.skip(K.TOKEN_RIGHT_BRACKET); T++) {
                      if (T === p.fields.length)
                        if (x)
                          this.fail("parseSlice: too many slice components", h.lineno, h.colno);
                        else
                          break;
                      if (this.skip(K.TOKEN_COLON))
                        x = !0;
                      else {
                        var N = p.fields[T];
                        p[N] = this.parseExpression(), x = this.skip(K.TOKEN_COLON) || x;
                      }
                    }
                    if (!x)
                      throw s();
                    return new k.Array(h.lineno, h.colno, [p]);
                  }
                };
              }
              function b(r, f, l, s) {
                r = r || [], f === null && (f = s < 0 ? r.length - 1 : 0), l === null ? l = s < 0 ? -1 : r.length : l < 0 && (l += r.length), f < 0 && (f += r.length);
                for (var h = [], p = f; !(p < 0 || p > r.length || s > 0 && p >= l || s < 0 && p <= l); p += s)
                  h.push(E.memberLookup(r, p));
                return h;
              }
              function c(r, f) {
                return Object.prototype.hasOwnProperty.call(r, f);
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
                  for (var f = 0; f < this.length; f++)
                    if (this[f] === r)
                      return this.splice(f, 1);
                  throw new Error("ValueError");
                },
                count: function(r) {
                  for (var f = 0, l = 0; l < this.length; l++)
                    this[l] === r && f++;
                  return f;
                },
                index: function(r) {
                  var f;
                  if ((f = this.indexOf(r)) === -1)
                    throw new Error("ValueError");
                  return f;
                },
                find: function(r) {
                  return this.indexOf(r);
                },
                insert: function(r, f) {
                  return this.splice(r, 0, f);
                }
              }, i = {
                items: function() {
                  return u._entries(this);
                },
                values: function() {
                  return u._values(this);
                },
                keys: function() {
                  return u.keys(this);
                },
                get: function(r, f) {
                  var l = this[r];
                  return l === void 0 && (l = f), l;
                },
                has_key: function(r) {
                  return c(this, r);
                },
                pop: function(r, f) {
                  var l = this[r];
                  if (l === void 0 && f !== void 0)
                    l = f;
                  else {
                    if (l === void 0)
                      throw new Error("KeyError");
                    delete this[r];
                  }
                  return l;
                },
                popitem: function() {
                  var r = u.keys(this);
                  if (!r.length)
                    throw new Error("KeyError");
                  var f = r[0], l = this[f];
                  return delete this[f], [f, l];
                },
                setdefault: function(r, f) {
                  return f === void 0 && (f = null), r in this || (this[r] = f), this[r];
                },
                update: function(r) {
                  return u._assign(this, r), null;
                }
              };
              return i.iteritems = i.items, i.itervalues = i.values, i.iterkeys = i.keys, E.memberLookup = function(r, f, l) {
                return arguments.length === 4 ? b.apply(this, arguments) : (r = r || {}, u.isArray(r) && c(e, f) ? e[f].bind(r) : u.isObject(r) && c(i, f) ? i[f].bind(r) : P.apply(this, arguments));
              }, n;
            }
            S.exports = _;
          })
          /******/
        ])
      );
    });
  })(Ae)), Ae.exports;
}
var tt = et();
const xe = /* @__PURE__ */ Qe(tt), Ce = /* @__PURE__ */ new Set([
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
]), Ee = /* @__PURE__ */ new Set([
  Function,
  Object.getPrototypeOf(async function() {
  }).constructor,
  Object.getPrototypeOf(function* () {
  }).constructor,
  Object.getPrototypeOf(async function* () {
  }).constructor,
  Object,
  Reflect
]), be = (A, U) => Object.prototype.hasOwnProperty.call(A, U), nt = (A) => typeof A == "symbol" ? A : String(A), it = /^(?:[\w$]|[^\p{ASCII}\p{C}\p{Z}])+$/u, rt = /[\\\r\n\u2028\u2029]/, Me = (A) => {
  throw new Error("The name " + JSON.stringify(A) + " is not allowed in templates");
}, Pe = (A) => {
  it.test(String(A)) || Me(A);
}, ke = (A) => {
  A?.typename === "FunCall" ? ke(A.name) : A?.typename === "LookupVal" ? (ke(A.target), ke(A.val)) : A?.typename === "Literal" && typeof A.value == "string" && rt.test(A.value) && Me(A.value);
}, ot = (A) => {
  switch (A.typename) {
    case "Set":
      return A.targets ?? [];
    case "Macro":
    case "Caller":
      return [A.name];
    default:
      return [];
  }
}, st = (A) => {
  switch (A.typename) {
    case "For":
    case "AsyncEach":
    case "AsyncAll":
      return A.name?.typename === "Array" ? A.name.children ?? [] : [];
    case "Macro":
    case "Caller": {
      const U = A.args?.children[A.args.children.length - 1];
      return U?.typename === "Dict" || U?.typename === "KeywordArgs" ? (U.children ?? []).map((S) => S.key) : [];
    }
    default:
      return [];
  }
}, Be = (A) => {
  if (A?.typename !== "Symbol")
    throw new Error("Only plain names can be assigned in templates");
}, at = /* @__PURE__ */ new Set(["Include", "Import", "FromImport", "Extends"]), lt = (A) => {
  if (at.has(A.typename))
    throw new Error("Loading another template is not allowed in templates");
  if (A.typename === "Symbol")
    Pe(A.value);
  else if (A.typename === "Is") {
    const U = A.right?.name ?? A.right;
    U?.value !== void 0 && Pe(U.value);
  } else A.typename === "FunCall" && ke(A.name);
  for (const U of ot(A))
    if (Be(U), Ce.has(String(U?.value)))
      throw new Error("Assigning to `" + String(U?.value) + "` is not allowed in templates");
  st(A).forEach(Be);
}, ct = (A) => typeof A == "object" && A !== null && "typename" in A, Ne = (A, U) => {
  Array.isArray(A) ? A.forEach((S) => Ne(S, U)) : ct(A) && (U(A), Object.values(A).forEach((S) => Ne(S, U)));
}, ut = (A) => {
  if (typeof A != "string")
    throw new Error("Templates must be strings");
  const U = xe;
  let S;
  try {
    S = U.parser.parse(A);
  } catch {
    return;
  }
  Ne(S, lt);
}, ft = () => xe.runtime, ht = () => {
  const A = new xe.Environment([]);
  A.loaders = [];
  const U = A;
  return U.getFilter = function(S) {
    if (!be(this.filters, S) || !this.filters[S])
      throw new Error("filter not found: " + S);
    return this.filters[S];
  }, U.getTest = function(S) {
    if (!be(this.tests, S) || !this.tests[S])
      throw new Error("test not found: " + S);
    return this.tests[S];
  }, U.getGlobal = function(S) {
    if (!be(this.globals, S) || typeof this.globals[S] > "u")
      throw new Error("global not found: " + S);
    return this.globals[S];
  }, A;
};
let Te = !1;
function pt(A) {
  const U = ft();
  if (Te || !U)
    return A();
  const S = U.memberLookup, I = U.contextOrFrameLookup, L = U.callWrap;
  U.memberLookup = (_, E) => {
    if (_ == null || Ee.has(_))
      return;
    const u = nt(E);
    if (!(typeof u == "string" && Ce.has(u)) && !Ee.has(_[u]))
      return S(_, u);
  }, U.contextOrFrameLookup = (_, E, u) => {
    const g = String(u);
    if (Ce.has(g))
      return;
    let m = E.lookup(g);
    if (m === void 0) {
      const { ctx: k, env: K } = _;
      be(k, g) ? m = k[g] : be(K.globals, g) && (m = K.globals[g]);
    }
    if (!Ee.has(m))
      return m;
  }, U.callWrap = (_, E, u, g) => {
    if (Ee.has(_))
      throw new Error("Unable to call `" + String(E) + "`, which is not allowed in templates");
    return L(_, E, u, g);
  }, Te = !0;
  try {
    return A();
  } finally {
    U.memberLookup = S, U.contextOrFrameLookup = I, U.callWrap = L, Te = !1;
  }
}
function mt(A) {
  const U = {};
  for (const [I, L] of Object.entries(A.templates))
    ut(L), U[I] = xe.compile(L, ht());
  const S = (I) => {
    I.result = {};
    for (const L of Object.keys(A.templates))
      I.result[L] = U[L].render(I.properties || {});
  };
  return pt(() => {
    "features" in A.geojson ? A.geojson.features.forEach(S) : S(A.geojson);
  }), A.geojson;
}
const dt = {
  templateExtractor: mt
};
function De(A) {
  const U = {
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
  return Object.keys(U).reduce((S, I) => {
    if (S[I] !== void 0)
      throw new Error(`Invalid Maplat option key: ${I}. Use "${U[I]}" instead.`);
    return S;
  }, A);
}
const Se = /\{%-?\s*(end)?(raw|verbatim)\s*-?%\}/g;
function vt(A) {
  if (!A.includes("{%")) return A;
  const U = [];
  Se.lastIndex = 0;
  for (let u = Se.exec(A); u; u = Se.exec(A))
    U.push({ start: u.index, end: u.index + u[0].length, close: !!u[1], kind: u[2] });
  if (U.length === 0) return A;
  const S = { raw: [], verbatim: [] };
  U.forEach((u, g) => {
    u.close && S[u.kind].push(g);
  });
  const I = { raw: 0, verbatim: 0 };
  let L = "", _ = 0, E = 0;
  for (; E < U.length; ) {
    const u = U[E];
    if (u.close) {
      E++;
      continue;
    }
    const g = S[u.kind];
    let m = I[u.kind];
    for (; m < g.length && g[m] < E; ) m++;
    if (I[u.kind] = m, m === g.length) {
      E++;
      continue;
    }
    L += A.slice(_, u.start), _ = U[g[m]].end, E = g[m] + 1;
  }
  return L + A.slice(_);
}
function Re(A, U, S) {
  const I = A.indexOf(U);
  return I >= 0 && A.indexOf(S, I + U.length) >= 0;
}
const yt = 'MaplatApp: poiTemplate/iconTemplate written in the lodash.template syntax (<% %>, <%= %>, <%- %>, ${ }) is no longer evaluated since @maplat/core 1.3.0, and was ignored. Rewrite it in the Nunjucks syntax ({{ }}, {% %}); wrap literal "<%" or "${" in {% raw %}...{% endraw %}.', _t = 'See the "Removed" section of the 1.3.0 CHANGELOG: https://github.com/code4history/MaplatCore/blob/master/CHANGELOG.md';
let je = !1, Ke = !1;
function Ue(A) {
  return Array.from(A).slice(0, 80).join("");
}
function gt(A) {
  const U = vt(A);
  return Re(U, "<%", "%>") || Re(U, "${", "}");
}
function bt(A, U) {
  je || (je = !0, console.warn(`${yt} First template found (${A}): "${Ue(U)}". ${_t}`));
}
function Fe(A, U) {
  if (Ke) return;
  Ke = !0;
  const I = (U instanceof Error ? U.message : String(U)).split(`
`).map((L) => L.trim()).filter((L) => L).join(" ");
  console.warn(`MaplatApp: a poiTemplate/iconTemplate failed to render and was ignored: ${I}. First template: "${Ue(A)}".`);
}
function Ve(A, U, S) {
  if (gt(U)) {
    bt(A, U);
    return;
  }
  try {
    const I = { type: "Feature", geometry: null, properties: S };
    return dt.templateExtractor({ geojson: I, templates: { t: U } }), I.result.t;
  } catch (I) {
    Fe(U, I);
    return;
  }
}
function wt(A, U) {
  const S = Ve("iconTemplate", A, U);
  if (S === void 0) return;
  let I;
  try {
    I = JSON.parse(S);
  } catch (L) {
    Fe(A, L);
    return;
  }
  if (I === null || typeof I != "object" || Array.isArray(I)) {
    Fe(A, new Error("iconTemplate did not produce a JSON object"));
    return;
  }
  return I;
}
function Et(A, ...U) {
  const S = De(Object.assign({}, A));
  if (S.icon) return S;
  const I = U.reduce((L, _) => {
    if (L) return L;
    const E = _.iconTemplate, u = E ? wt(E, S) : void 0;
    if (u)
      return u;
    if (_.icon)
      return {
        icon: _.icon,
        selectedIcon: _.selectedIcon
      };
  }, void 0);
  return I && (S.icon = I.icon, S.selectedIcon = I.selectedIcon), S;
}
function kt(A, ...U) {
  const S = De(A);
  return S.html ? S : U.reduce((I, L) => {
    if (I) return I;
    const _ = L.poiTemplate;
    if (_) {
      const E = Ve("poiTemplate", _, S);
      return E === void 0 ? void 0 : (S.html = E, S.poiStyle = S.poiStyle || L.poiStyle, S);
    }
  }, void 0) || S;
}
function xt(A, ...U) {
  const S = Et(A, ...U);
  return kt(S, ...U);
}
export {
  xt as applyPoiTemplates,
  kt as createHtmlFromTemplate,
  Et as createIconSet
};
//# sourceMappingURL=maplat_core_template.js.map
