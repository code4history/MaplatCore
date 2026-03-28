var jr = Object.defineProperty;
var Nr = (A, t, e) => t in A ? jr(A, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : A[t] = e;
var M = (A, t, e) => Nr(A, typeof t != "symbol" ? t + "" : t, e);
import { transform as Tt, toLonLat as Nn, Projection as zr, addProjection as Pn, addCoordinateTransforms as QA, getTransform as hn, identityTransform as un } from "ol/proj";
import { View as lg, Map as Fr, Feature as Ur } from "ol";
import { Vector as GA, Group as Qr, Tile as fn } from "ol/layer";
import { XYZ as hg, Google as Wr, Vector as kA } from "ol/source";
import { Style as Qt, Icon as Be, Stroke as Sn, Fill as Dn } from "ol/style";
class _t {
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
let yt = class extends _t {
  constructor(e, n) {
    super(e);
    M(this, "detail");
    this.detail = n;
  }
};
const Vr = ["ALL", "OFF"], qe = {
  ALL: -99,
  DEBUG: -1,
  INFO: 0,
  WARN: 1,
  ERROR: 2,
  OFF: 99
};
class Hr {
  constructor(t = qe.INFO) {
    this.level = t, this.make();
  }
  make() {
    const t = Object.keys(qe).filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (e) => !Vr.includes(e)
    );
    for (const e of t) {
      const n = qe[e], i = e.toLowerCase();
      this[i] = this.level <= n ? console.log : () => {
      };
    }
  }
}
function Yr(A) {
  return A && A.__esModule && Object.prototype.hasOwnProperty.call(A, "default") ? A.default : A;
}
var Ye = { exports: {} }, Kr = Ye.exports, vi;
function Jr() {
  return vi || (vi = 1, (function(A, t) {
    (function(e, n) {
      n(t);
    })(Kr, (function(e) {
      var n = Object.defineProperty, i = (h, l, f) => l in h ? n(h, l, { enumerable: !0, configurable: !0, writable: !0, value: f }) : h[l] = f, g = (h, l, f) => i(h, typeof l != "symbol" ? l + "" : l, f);
      function r(h, l, f = {}) {
        const m = { type: "Feature" };
        return (f.id === 0 || f.id) && (m.id = f.id), f.bbox && (m.bbox = f.bbox), m.properties = l || {}, m.geometry = h, m;
      }
      function s(h, l, f = {}) {
        if (!h) throw new Error("coordinates is required");
        if (!Array.isArray(h)) throw new Error("coordinates must be an Array");
        if (h.length < 2) throw new Error("coordinates must be at least 2 numbers long");
        if (!C(h[0]) || !C(h[1])) throw new Error("coordinates must contain numbers");
        return r({ type: "Point", coordinates: h }, l, f);
      }
      function o(h, l, f = {}) {
        for (const m of h) {
          if (m.length < 4) throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
          if (m[m.length - 1].length !== m[0].length) throw new Error("First and last Position are not equivalent.");
          for (let v = 0; v < m[m.length - 1].length; v++) if (m[m.length - 1][v] !== m[0][v]) throw new Error("First and last Position are not equivalent.");
        }
        return r({ type: "Polygon", coordinates: h }, l, f);
      }
      function I(h, l = {}) {
        const f = { type: "FeatureCollection" };
        return l.id && (f.id = l.id), l.bbox && (f.bbox = l.bbox), f.features = h, f;
      }
      function C(h) {
        return !isNaN(h) && h !== null && !Array.isArray(h);
      }
      function a(h) {
        if (!h) throw new Error("coord is required");
        if (!Array.isArray(h)) {
          if (h.type === "Feature" && h.geometry !== null && h.geometry.type === "Point") return [...h.geometry.coordinates];
          if (h.type === "Point") return [...h.coordinates];
        }
        if (Array.isArray(h) && h.length >= 2 && !Array.isArray(h[0]) && !Array.isArray(h[1])) return [...h];
        throw new Error("coord must be GeoJSON Point or an Array of numbers");
      }
      function c(h) {
        if (Array.isArray(h)) return h;
        if (h.type === "Feature") {
          if (h.geometry !== null) return h.geometry.coordinates;
        } else if (h.coordinates) return h.coordinates;
        throw new Error("coords must be GeoJSON Feature, Geometry Object or an Array");
      }
      function d(h) {
        return h.type === "Feature" ? h.geometry : h;
      }
      const p = 11102230246251565e-32, y = 134217729, E = (3 + 8 * p) * p;
      function T(h, l, f, m, v) {
        let b, R, D, S, O = l[0], L = m[0], P = 0, G = 0;
        L > O == L > -O ? (b = O, O = l[++P]) : (b = L, L = m[++G]);
        let j = 0;
        if (P < h && G < f) for (L > O == L > -O ? (R = O + b, D = b - (R - O), O = l[++P]) : (R = L + b, D = b - (R - L), L = m[++G]), b = R, D !== 0 && (v[j++] = D); P < h && G < f; ) L > O == L > -O ? (R = b + O, S = R - b, D = b - (R - S) + (O - S), O = l[++P]) : (R = b + L, S = R - b, D = b - (R - S) + (L - S), L = m[++G]), b = R, D !== 0 && (v[j++] = D);
        for (; P < h; ) R = b + O, S = R - b, D = b - (R - S) + (O - S), O = l[++P], b = R, D !== 0 && (v[j++] = D);
        for (; G < f; ) R = b + L, S = R - b, D = b - (R - S) + (L - S), L = m[++G], b = R, D !== 0 && (v[j++] = D);
        return (b !== 0 || j === 0) && (v[j++] = b), j;
      }
      function Z(h, l) {
        let f = l[0];
        for (let m = 1; m < h; m++) f += l[m];
        return f;
      }
      function N(h) {
        return new Float64Array(h);
      }
      const F = (3 + 16 * p) * p, V = (2 + 12 * p) * p, $ = (9 + 64 * p) * p * p, At = N(4), tt = N(8), rt = N(12), st = N(16), Y = N(4);
      function ct(h, l, f, m, v, b, R) {
        let D, S, O, L, P, G, j, Q, X, k, x, U, K, J, gt, H, nt, It;
        const St = h - v, Mt = f - v, Dt = l - b, Bt = m - b;
        J = St * Bt, G = y * St, j = G - (G - St), Q = St - j, G = y * Bt, X = G - (G - Bt), k = Bt - X, gt = Q * k - (J - j * X - Q * X - j * k), H = Dt * Mt, G = y * Dt, j = G - (G - Dt), Q = Dt - j, G = y * Mt, X = G - (G - Mt), k = Mt - X, nt = Q * k - (H - j * X - Q * X - j * k), x = gt - nt, P = gt - x, At[0] = gt - (x + P) + (P - nt), U = J + x, P = U - J, K = J - (U - P) + (x - P), x = K - H, P = K - x, At[1] = K - (x + P) + (P - H), It = U + x, P = It - U, At[2] = U - (It - P) + (x - P), At[3] = It;
        let zt = Z(4, At), oe = V * R;
        if (zt >= oe || -zt >= oe || (P = h - St, D = h - (St + P) + (P - v), P = f - Mt, O = f - (Mt + P) + (P - v), P = l - Dt, S = l - (Dt + P) + (P - b), P = m - Bt, L = m - (Bt + P) + (P - b), D === 0 && S === 0 && O === 0 && L === 0) || (oe = $ * R + E * Math.abs(zt), zt += St * L + Bt * D - (Dt * O + Mt * S), zt >= oe || -zt >= oe)) return zt;
        J = D * Bt, G = y * D, j = G - (G - D), Q = D - j, G = y * Bt, X = G - (G - Bt), k = Bt - X, gt = Q * k - (J - j * X - Q * X - j * k), H = S * Mt, G = y * S, j = G - (G - S), Q = S - j, G = y * Mt, X = G - (G - Mt), k = Mt - X, nt = Q * k - (H - j * X - Q * X - j * k), x = gt - nt, P = gt - x, Y[0] = gt - (x + P) + (P - nt), U = J + x, P = U - J, K = J - (U - P) + (x - P), x = K - H, P = K - x, Y[1] = K - (x + P) + (P - H), It = U + x, P = It - U, Y[2] = U - (It - P) + (x - P), Y[3] = It;
        const Cn = T(4, At, 4, Y, tt);
        J = St * L, G = y * St, j = G - (G - St), Q = St - j, G = y * L, X = G - (G - L), k = L - X, gt = Q * k - (J - j * X - Q * X - j * k), H = Dt * O, G = y * Dt, j = G - (G - Dt), Q = Dt - j, G = y * O, X = G - (G - O), k = O - X, nt = Q * k - (H - j * X - Q * X - j * k), x = gt - nt, P = gt - x, Y[0] = gt - (x + P) + (P - nt), U = J + x, P = U - J, K = J - (U - P) + (x - P), x = K - H, P = K - x, Y[1] = K - (x + P) + (P - H), It = U + x, P = It - U, Y[2] = U - (It - P) + (x - P), Y[3] = It;
        const PA = T(Cn, tt, 4, Y, rt);
        J = D * L, G = y * D, j = G - (G - D), Q = D - j, G = y * L, X = G - (G - L), k = L - X, gt = Q * k - (J - j * X - Q * X - j * k), H = S * O, G = y * S, j = G - (G - S), Q = S - j, G = y * O, X = G - (G - O), k = O - X, nt = Q * k - (H - j * X - Q * X - j * k), x = gt - nt, P = gt - x, Y[0] = gt - (x + P) + (P - nt), U = J + x, P = U - J, K = J - (U - P) + (x - P), x = K - H, P = K - x, Y[1] = K - (x + P) + (P - H), It = U + x, P = It - U, Y[2] = U - (It - P) + (x - P), Y[3] = It;
        const SA = T(PA, rt, 4, Y, st);
        return st[SA - 1];
      }
      function mt(h, l, f, m, v, b) {
        const R = (l - b) * (f - v), D = (h - v) * (m - b), S = R - D, O = Math.abs(R + D);
        return Math.abs(S) >= F * O ? S : -ct(h, l, f, m, v, b, O);
      }
      function Zt(h, l) {
        var f, m, v = 0, b, R, D, S, O, L, P, G = h[0], j = h[1], Q = l.length;
        for (f = 0; f < Q; f++) {
          m = 0;
          var X = l[f], k = X.length - 1;
          if (L = X[0], L[0] !== X[k][0] && L[1] !== X[k][1]) throw new Error("First and last coordinates in a ring must be the same");
          for (R = L[0] - G, D = L[1] - j, m; m < k; m++) {
            if (P = X[m + 1], S = P[0] - G, O = P[1] - j, D === 0 && O === 0) {
              if (S <= 0 && R >= 0 || R <= 0 && S >= 0) return 0;
            } else if (O >= 0 && D <= 0 || O <= 0 && D >= 0) {
              if (b = mt(R, S, D, O, 0, 0), b === 0) return 0;
              (b > 0 && O > 0 && D <= 0 || b < 0 && O <= 0 && D > 0) && v++;
            }
            L = P, D = O, R = S;
          }
        }
        return v % 2 !== 0;
      }
      function Gt(h, l, f = {}) {
        if (!h) throw new Error("point is required");
        if (!l) throw new Error("polygon is required");
        const m = a(h), v = d(l), b = v.type, R = l.bbox;
        let D = v.coordinates;
        if (R && z(m, R) === !1) return !1;
        b === "Polygon" && (D = [D]);
        let S = !1;
        for (var O = 0; O < D.length; ++O) {
          const L = Zt(m, D[O]);
          if (L === 0) return !f.ignoreBoundary;
          L && (S = !0);
        }
        return S;
      }
      function z(h, l) {
        return l[0] <= h[0] && l[1] <= h[1] && l[2] >= h[0] && l[3] >= h[1];
      }
      function ft(h, l) {
        for (let f = 0; f < l.features.length; f++) if (Gt(h, l.features[f])) return l.features[f];
      }
      function Lt(h, l, f) {
        const m = l.geometry.coordinates[0][0], v = l.geometry.coordinates[0][1], b = l.geometry.coordinates[0][2], R = h.geometry.coordinates, D = l.properties.a.geom, S = l.properties.b.geom, O = l.properties.c.geom, L = [v[0] - m[0], v[1] - m[1]], P = [b[0] - m[0], b[1] - m[1]], G = [R[0] - m[0], R[1] - m[1]], j = [S[0] - D[0], S[1] - D[1]], Q = [O[0] - D[0], O[1] - D[1]];
        let X = (P[1] * G[0] - P[0] * G[1]) / (L[0] * P[1] - L[1] * P[0]), k = (L[0] * G[1] - L[1] * G[0]) / (L[0] * P[1] - L[1] * P[0]);
        if (f) {
          const x = f[l.properties.a.index], U = f[l.properties.b.index], K = f[l.properties.c.index];
          let J;
          if (X < 0 || k < 0 || 1 - X - k < 0) {
            const gt = X / (X + k), H = k / (X + k);
            J = X / U / (gt / U + H / K), k = k / K / (gt / U + H / K);
          } else J = X / U / (X / U + k / K + (1 - X - k) / x), k = k / K / (X / U + k / K + (1 - X - k) / x);
          X = J;
        }
        return [X * j[0] + k * Q[0] + D[0], X * j[1] + k * Q[1] + D[1]];
      }
      function $t(h, l, f, m) {
        const v = h.geometry.coordinates, b = f.geometry.coordinates, R = Math.atan2(v[0] - b[0], v[1] - b[1]), D = nn(R, l[0]);
        if (D === void 0) throw new Error("Unable to determine vertex index");
        const S = l[1][D];
        return Lt(h, S.features[0], m);
      }
      function Ht(h, l, f, m, v, b, R, D) {
        let S;
        if (R && (S = ft(h, I([R]))), !S) if (f) {
          const O = h.geometry.coordinates, L = f.gridNum, P = f.xOrigin, G = f.yOrigin, j = f.xUnit, Q = f.yUnit, X = f.gridCache, k = Rt(O[0], P, j, L), x = Rt(O[1], G, Q, L), U = X[k] ? X[k][x] ? X[k][x] : [] : [], K = I(U.map((J) => l.features[J]));
          S = ft(h, K);
        } else S = ft(h, l);
        return D && D(S), S ? Lt(h, S, b) : $t(h, m, v, b);
      }
      function Rt(h, l, f, m) {
        let v = Math.floor((h - l) / f);
        return v < 0 && (v = 0), v >= m && (v = m - 1), v;
      }
      function nn(h, l) {
        let f = dA(h - l[0]), m = Math.PI * 2, v;
        for (let b = 0; b < l.length; b++) {
          const R = (b + 1) % l.length, D = dA(h - l[R]), S = Math.min(Math.abs(f), Math.abs(D));
          f * D <= 0 && S < m && (m = S, v = b), f = D;
        }
        return v;
      }
      function dA(h, l = !1) {
        const f = 2 * Math.PI, m = h - Math.floor(h / f) * f;
        return l ? m : m > Math.PI ? m - f : m;
      }
      function gn(h) {
        const l = h.features;
        for (let f = 0; f < l.length; f++) {
          const m = l[f];
          `${m.properties.a.index}`.substring(0, 1) === "b" && `${m.properties.b.index}`.substring(0, 1) === "b" ? l[f] = { geometry: { type: "Polygon", coordinates: [[m.geometry.coordinates[0][2], m.geometry.coordinates[0][0], m.geometry.coordinates[0][1], m.geometry.coordinates[0][2]]] }, properties: { a: { geom: m.properties.c.geom, index: m.properties.c.index }, b: { geom: m.properties.a.geom, index: m.properties.a.index }, c: { geom: m.properties.b.geom, index: m.properties.b.index } }, type: "Feature" } : `${m.properties.c.index}`.substring(0, 1) === "b" && `${m.properties.a.index}`.substring(0, 1) === "b" && (l[f] = { geometry: { type: "Polygon", coordinates: [[m.geometry.coordinates[0][1], m.geometry.coordinates[0][2], m.geometry.coordinates[0][0], m.geometry.coordinates[0][1]]] }, properties: { a: { geom: m.properties.b.geom, index: m.properties.b.index }, b: { geom: m.properties.c.geom, index: m.properties.c.index }, c: { geom: m.properties.a.geom, index: m.properties.a.index } }, type: "Feature" });
        }
        return h;
      }
      function rn(h) {
        const l = ["a", "b", "c", "a"].map((b) => h.properties[b].geom), f = h.geometry.coordinates[0], m = h.properties, v = { a: { geom: f[0], index: m.a.index }, b: { geom: f[1], index: m.b.index }, c: { geom: f[2], index: m.c.index } };
        return o([l], v);
      }
      function sn(h) {
        const l = [0, 1, 2, 0].map((m) => h[m][0][0]), f = { a: { geom: h[0][0][1], index: h[0][1] }, b: { geom: h[1][0][1], index: h[1][1] }, c: { geom: h[2][0][1], index: h[2][1] } };
        return o([l], f);
      }
      function Ze(h, l, f, m, v, b = !1, R) {
        const D = h.map((S) => {
          (!R || R < 2.00703) && (S = mA(S));
          const O = isFinite(S) ? l[S] : S === "c" ? m : (function() {
            const L = S.match(/^b(\d+)$/);
            if (L) return v[parseInt(L[1])];
            const P = S.match(/^e(\d+)$/);
            if (P) return f[parseInt(P[1])];
            throw new Error("Bad index value for indexesToTri");
          })();
          return b ? [[O[1], O[0]], S] : [[O[0], O[1]], S];
        });
        return sn(D);
      }
      function mA(h) {
        return typeof h == "number" ? h : h.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
      }
      function se(h, l) {
        return l && l >= 2.00703 || Array.isArray(h[0]) ? h : h.map((f) => [f.illstNodes, f.mercNodes, f.startEnd]);
      }
      const Le = 2.00703;
      function et(h) {
        return !!(h.version !== void 0 || !h.tins && h.points && h.tins_points);
      }
      function on(h) {
        return { points: h.points, pointsWeightBuffer: In(h), strictStatus: je(h), verticesParams: yA(h), centroid: wA(h), edges: se(h.edges || []), edgeNodes: h.edgeNodes || [], tins: Ne(h), kinks: vA(h.kinks_points), yaxisMode: h.yaxisMode ?? "invert", strictMode: h.strictMode ?? "auto", vertexMode: h.vertexMode, bounds: h.bounds, boundsPolygon: h.boundsPolygon, wh: h.wh, xy: h.xy ?? [0, 0] };
      }
      function pA(h) {
        const l = bA(h), f = l.tins;
        return { compiled: l, tins: f, points: MA(f), strictStatus: l.strict_status, pointsWeightBuffer: l.weight_buffer, verticesParams: l.vertices_params, centroid: l.centroid, kinks: l.kinks };
      }
      function In(h) {
        return !h.version || h.version < Le ? ["forw", "bakw"].reduce((l, f) => {
          const m = h.weight_buffer[f];
          return m && (l[f] = Object.keys(m).reduce((v, b) => {
            const R = mA(b);
            return v[R] = m[b], v;
          }, {})), l;
        }, {}) : h.weight_buffer;
      }
      function je(h) {
        return h.strict_status ? h.strict_status : h.kinks_points ? "strict_error" : h.tins_points.length === 2 ? "loose" : "strict";
      }
      function yA(h) {
        const l = { forw: [h.vertices_params[0]], bakw: [h.vertices_params[1]] };
        return l.forw[1] = te(h, !1), l.bakw[1] = te(h, !0), l;
      }
      function te(h, l) {
        const f = h.vertices_points.length;
        return Array.from({ length: f }, (m, v) => {
          const b = (v + 1) % f, R = Ze(["c", `b${v}`, `b${b}`], h.points, h.edgeNodes || [], h.centroid_point, h.vertices_points, l, Le);
          return I([R]);
        });
      }
      function wA(h) {
        return { forw: s(h.centroid_point[0], { target: { geom: h.centroid_point[1], index: "c" } }), bakw: s(h.centroid_point[1], { target: { geom: h.centroid_point[0], index: "c" } }) };
      }
      function Ne(h) {
        const l = h.tins_points.length === 1 ? 0 : 1;
        return { forw: I(h.tins_points[0].map((f) => Ze(f, h.points, h.edgeNodes || [], h.centroid_point, h.vertices_points, !1, h.version))), bakw: I(h.tins_points[l].map((f) => Ze(f, h.points, h.edgeNodes || [], h.centroid_point, h.vertices_points, !0, h.version))) };
      }
      function vA(h) {
        if (h) return { bakw: I(h.map((l) => s(l))) };
      }
      function bA(h) {
        return JSON.parse(JSON.stringify(h).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"'));
      }
      function MA(h) {
        const l = [], f = h.forw.features;
        for (let m = 0; m < f.length; m++) {
          const v = f[m];
          ["a", "b", "c"].forEach((b, R) => {
            const D = v.geometry.coordinates[0][R], S = v.properties[b].geom, O = v.properties[b].index;
            typeof O == "number" && (l[O] = [D, S]);
          });
        }
        return l;
      }
      const EA = Le, xt = class Ut {
        constructor() {
          g(this, "points", []), g(this, "pointsWeightBuffer"), g(this, "strict_status"), g(this, "vertices_params"), g(this, "centroid"), g(this, "edgeNodes"), g(this, "edges"), g(this, "tins"), g(this, "kinks"), g(this, "yaxisMode", Ut.YAXIS_INVERT), g(this, "strictMode", Ut.MODE_AUTO), g(this, "vertexMode", Ut.VERTEX_PLAIN), g(this, "bounds"), g(this, "boundsPolygon"), g(this, "wh"), g(this, "xy"), g(this, "indexedTins"), g(this, "stateFull", !1), g(this, "stateTriangle"), g(this, "stateBackward"), g(this, "priority"), g(this, "importance"), g(this, "xyBounds"), g(this, "mercBounds");
        }
        setCompiled(l) {
          if (et(l)) {
            this.applyModernState(on(l));
            return;
          }
          this.applyLegacyState(pA(l));
        }
        applyModernState(l) {
          this.points = l.points, this.pointsWeightBuffer = l.pointsWeightBuffer, this.strict_status = l.strictStatus, this.vertices_params = l.verticesParams, this.centroid = l.centroid, this.edges = l.edges, this.edgeNodes = l.edgeNodes || [], this.tins = l.tins, this.addIndexedTin(), this.kinks = l.kinks, this.yaxisMode = l.yaxisMode ?? Ut.YAXIS_INVERT, this.vertexMode = l.vertexMode ?? Ut.VERTEX_PLAIN, this.strictMode = l.strictMode ?? Ut.MODE_AUTO, l.bounds ? (this.bounds = l.bounds, this.boundsPolygon = l.boundsPolygon, this.xy = l.xy, this.wh = l.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = l.xy ?? [0, 0], l.wh && (this.wh = l.wh));
        }
        applyLegacyState(l) {
          this.tins = l.tins, this.addIndexedTin(), this.strict_status = l.strictStatus, this.pointsWeightBuffer = l.pointsWeightBuffer, this.vertices_params = l.verticesParams, this.centroid = l.centroid, this.kinks = l.kinks, this.points = l.points;
        }
        addIndexedTin() {
          const l = this.tins, f = l.forw, m = l.bakw, v = Math.ceil(Math.sqrt(f.features.length));
          if (v < 3) {
            this.indexedTins = void 0;
            return;
          }
          let b = [], R = [];
          const D = f.features.map((X) => {
            let k = [];
            return c(X)[0].map((x) => {
              b.length === 0 ? b = [Array.from(x), Array.from(x)] : (x[0] < b[0][0] && (b[0][0] = x[0]), x[0] > b[1][0] && (b[1][0] = x[0]), x[1] < b[0][1] && (b[0][1] = x[1]), x[1] > b[1][1] && (b[1][1] = x[1])), k.length === 0 ? k = [Array.from(x), Array.from(x)] : (x[0] < k[0][0] && (k[0][0] = x[0]), x[0] > k[1][0] && (k[1][0] = x[0]), x[1] < k[0][1] && (k[0][1] = x[1]), x[1] > k[1][1] && (k[1][1] = x[1]));
            }), k;
          }), S = (b[1][0] - b[0][0]) / v, O = (b[1][1] - b[0][1]) / v, L = D.reduce((X, k, x) => {
            const U = Rt(k[0][0], b[0][0], S, v), K = Rt(k[1][0], b[0][0], S, v), J = Rt(k[0][1], b[0][1], O, v), gt = Rt(k[1][1], b[0][1], O, v);
            for (let H = U; H <= K; H++) {
              X[H] || (X[H] = []);
              for (let nt = J; nt <= gt; nt++) X[H][nt] || (X[H][nt] = []), X[H][nt].push(x);
            }
            return X;
          }, []), P = m.features.map((X) => {
            let k = [];
            return c(X)[0].map((x) => {
              R.length === 0 ? R = [Array.from(x), Array.from(x)] : (x[0] < R[0][0] && (R[0][0] = x[0]), x[0] > R[1][0] && (R[1][0] = x[0]), x[1] < R[0][1] && (R[0][1] = x[1]), x[1] > R[1][1] && (R[1][1] = x[1])), k.length === 0 ? k = [Array.from(x), Array.from(x)] : (x[0] < k[0][0] && (k[0][0] = x[0]), x[0] > k[1][0] && (k[1][0] = x[0]), x[1] < k[0][1] && (k[0][1] = x[1]), x[1] > k[1][1] && (k[1][1] = x[1]));
            }), k;
          }), G = (R[1][0] - R[0][0]) / v, j = (R[1][1] - R[0][1]) / v, Q = P.reduce((X, k, x) => {
            const U = Rt(k[0][0], R[0][0], G, v), K = Rt(k[1][0], R[0][0], G, v), J = Rt(k[0][1], R[0][1], j, v), gt = Rt(k[1][1], R[0][1], j, v);
            for (let H = U; H <= K; H++) {
              X[H] || (X[H] = []);
              for (let nt = J; nt <= gt; nt++) X[H][nt] || (X[H][nt] = []), X[H][nt].push(x);
            }
            return X;
          }, []);
          this.indexedTins = { forw: { gridNum: v, xOrigin: b[0][0], yOrigin: b[0][1], xUnit: S, yUnit: O, gridCache: L }, bakw: { gridNum: v, xOrigin: R[0][0], yOrigin: R[0][1], xUnit: G, yUnit: j, gridCache: Q } };
        }
        transform(l, f, m) {
          if (!this.tins) throw new Error("setCompiled() must be called before transform()");
          if (f && this.strict_status == Ut.STATUS_ERROR) throw new Error('Backward transform is not allowed if strict_status == "strict_error"');
          this.yaxisMode == Ut.YAXIS_FOLLOW && f && (l = [l[0], -1 * l[1]]);
          const v = s(l);
          if (this.bounds && !f && !m && !Gt(v, this.boundsPolygon)) return !1;
          const b = f ? this.tins.bakw : this.tins.forw, R = f ? this.indexedTins.bakw : this.indexedTins.forw, D = f ? this.vertices_params.bakw : this.vertices_params.forw, S = f ? this.centroid.bakw : this.centroid.forw, O = f ? this.pointsWeightBuffer.bakw : this.pointsWeightBuffer.forw;
          let L, P;
          this.stateFull && (this.stateBackward == f ? L = this.stateTriangle : (this.stateBackward = f, this.stateTriangle = void 0), P = (j) => {
            this.stateTriangle = j;
          });
          let G = Ht(v, b, R, D, S, O, L, P);
          if (this.bounds && f && !m) {
            const j = s(G);
            if (!Gt(j, this.boundsPolygon)) return !1;
          } else this.yaxisMode == Ut.YAXIS_FOLLOW && !f && (G = [G[0], -1 * G[1]]);
          return G;
        }
      };
      g(xt, "VERTEX_PLAIN", "plain"), g(xt, "VERTEX_BIRDEYE", "birdeye"), g(xt, "MODE_STRICT", "strict"), g(xt, "MODE_AUTO", "auto"), g(xt, "MODE_LOOSE", "loose"), g(xt, "STATUS_STRICT", "strict"), g(xt, "STATUS_ERROR", "strict_error"), g(xt, "STATUS_LOOSE", "loose"), g(xt, "YAXIS_FOLLOW", "follow"), g(xt, "YAXIS_INVERT", "invert");
      let ze = xt;
      const Pt = 20037508342789244e-9, RA = [[0, 0], [0, 1], [1, 0], [0, -1], [-1, 0]];
      function Fe(h, l) {
        return Math.floor(Math.min(h[0], h[1]) / 4) * Pt / 128 / Math.pow(2, l);
      }
      function Ue(h, l) {
        const f = [];
        for (let m = 0; m < h.length; m++) {
          const v = h[m], b = v[0] * Math.cos(l) - v[1] * Math.sin(l), R = v[0] * Math.sin(l) + v[1] * Math.cos(l);
          f.push([b, R]);
        }
        return f;
      }
      function Qe(h, l, f, m) {
        const v = Fe(m, l);
        return Ue(RA, f).map((b) => [b[0] * v + h[0], b[1] * v + h[1]]);
      }
      function Yt(h, l) {
        const f = h[0], m = h.slice(1, 5).map((G) => [G[0] - f[0], G[1] - f[1]]), v = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        let b = 0, R = 0, D = 0;
        for (let G = 0; G < 4; G++) {
          const j = m[G], Q = v[G], X = Math.sqrt(Math.pow(j[0], 2) + Math.pow(j[1], 2));
          b += X;
          const k = j[0] * Q[1] - j[1] * Q[0], x = Math.acos((j[0] * Q[0] + j[1] * Q[1]) / X), U = k > 0 ? -1 * x : x;
          R += Math.cos(U), D += Math.sin(U);
        }
        const S = b / 4, O = Math.atan2(D, R), L = Math.floor(Math.min(l[0], l[1]) / 4), P = Math.log(L * Pt / 128 / S) / Math.log(2);
        return { center: f, zoom: P, rotation: O };
      }
      function ee(h, l) {
        const f = h[0] * (2 * Pt) / l - Pt, m = -1 * (h[1] * (2 * Pt) / l - Pt);
        return [f, m];
      }
      function Ae(h, l) {
        const f = (h[0] + Pt) * l / (2 * Pt), m = (-h[1] + Pt) * l / (2 * Pt);
        return [f, m];
      }
      const pt = 256;
      class xA {
        constructor() {
          g(this, "mainTin", null), g(this, "subTins", []), g(this, "_maxxy", 0);
        }
        setMapData(l) {
          const f = new ze();
          if (f.setCompiled(l.compiled), this.mainTin = f, l.maxZoom !== void 0) this._maxxy = Math.pow(2, l.maxZoom) * pt;
          else if (l.compiled.wh) {
            const m = Math.max(l.compiled.wh[0], l.compiled.wh[1]), v = Math.ceil(Math.log2(m / pt));
            this._maxxy = Math.pow(2, v) * pt;
          }
          if (this.subTins = [], l.sub_maps) for (const m of l.sub_maps) {
            const v = new ze();
            v.setCompiled(m.compiled);
            const b = m.bounds ?? m.compiled.bounds;
            if (!b) throw new Error("SubMapData must have bounds or compiled.bounds to create xyBounds polygon");
            const R = [...b, b[0]], D = R.map((S) => {
              const O = v.transform(S, !1);
              if (!O) throw new Error("Failed to transform sub-map bounds to mercator");
              return O;
            });
            this.subTins.push({ tin: v, priority: m.priority, importance: m.importance, xyBounds: o([R]), mercBounds: o([D]) });
          }
        }
        xy2Merc(l) {
          const f = this.xy2MercWithLayer(l);
          return f ? f[1] : !1;
        }
        merc2Xy(l) {
          const f = this.merc2XyWithLayer(l), m = f[0] || f[1];
          return m ? m[1] : !1;
        }
        xy2MercWithLayer(l) {
          this._assertMapData();
          const f = this._getTinsSortedByPriority();
          for (let m = 0; m < f.length; m++) {
            const { index: v, isMain: b } = f[m];
            if (b || Gt(s(l), this.subTins[v - 1].xyBounds)) {
              const R = this._transformByIndex(l, v, !1);
              if (R === !1) continue;
              return [v, R];
            }
          }
          return !1;
        }
        merc2XyWithLayer(l) {
          return this._assertMapData(), this._getAllTinsWithIndex().map(({ index: f, tin: m, isMain: v }) => {
            const b = this._transformByIndex(l, f, !0);
            return b === !1 ? [m, f] : v || Gt(s(b), this.subTins[f - 1].xyBounds) ? [m, f, b] : [m, f];
          }).sort((f, m) => {
            const v = f[0].priority ?? 0, b = m[0].priority ?? 0;
            return v < b ? 1 : -1;
          }).reduce((f, m, v, b) => {
            const R = m[0], D = m[1], S = m[2];
            if (!S) return f;
            for (let O = 0; O < v; O++) {
              const L = b[O][1], P = L === 0;
              if (b[O][2] && (P || Gt(s(S), this.subTins[L - 1].xyBounds))) if (f.length) {
                const G = !f[0], j = G ? f[1][2] : f[0][2], Q = R.importance ?? 0, X = j.importance ?? 0;
                return G ? Q < X ? f : [void 0, [D, S, R]] : [...f.filter((k) => k !== void 0), [D, S, R]].sort((k, x) => (k[2].importance ?? 0) < (x[2].importance ?? 0) ? 1 : -1).slice(0, 2);
              } else return [[D, S, R]];
            }
            return !f.length || !f[0] ? [[D, S, R]] : (f.push([D, S, R]), f.sort((O, L) => {
              const P = O[2].importance ?? 0, G = L[2].importance ?? 0;
              return P < G ? 1 : -1;
            }).filter((O, L) => L < 2));
          }, []).map((f) => {
            if (f) return [f[0], f[1]];
          });
        }
        mercs2SysCoords(l) {
          this._assertMapData();
          const f = this.merc2XyWithLayer(l[0]);
          let m = !1;
          return f.map((v, b) => {
            if (!v) {
              m = !0;
              return;
            }
            const R = v[0], D = v[1];
            return b !== 0 && !m ? [this.xy2SysCoordInternal(D)] : l.map((S, O) => O === 0 ? D : this._transformByIndex(S, R, !0)).map((S) => this.xy2SysCoordInternal(S));
          });
        }
        viewpoint2Mercs(l, f) {
          this._assertMapData(), this._assertMaxxy();
          const m = Qe(l.center, l.zoom, l.rotation, f).map((D) => Ae(D, this._maxxy)), v = this.xy2MercWithLayer(m[0]);
          if (!v) throw new Error("viewpoint2Mercs: center point is out of bounds");
          const b = v[0], R = v[1];
          return m.map((D, S) => {
            if (S === 0) return R;
            const O = this._transformByIndex(D, b, !1);
            if (O === !1) throw new Error(`viewpoint2Mercs: point ${S} is out of bounds`);
            return O;
          });
        }
        mercs2Viewpoint(l, f) {
          this._assertMapData(), this._assertMaxxy();
          const m = this.merc2XyWithLayer(l[0]), v = m[0] || m[1];
          if (!v) throw new Error("mercs2Viewpoint: center point is out of bounds");
          const b = v[0], R = v[1], D = l.map((S, O) => {
            if (O === 0) return R;
            const L = this._transformByIndex(S, b, !0);
            if (L === !1) throw new Error(`mercs2Viewpoint: point ${O} is out of bounds`);
            return L;
          }).map((S) => ee(S, this._maxxy));
          return Yt(D, f);
        }
        static zoom2Radius(l, f) {
          return Fe(l, f);
        }
        static mercViewpoint2Mercs(l, f, m, v) {
          return Qe(l, f, m, v);
        }
        static mercs2MercViewpoint(l, f) {
          return Yt(l, f);
        }
        static xy2SysCoord(l, f) {
          return ee(l, f);
        }
        static sysCoord2Xy(l, f) {
          return Ae(l, f);
        }
        _assertMapData() {
          if (!this.mainTin) throw new Error("setMapData() must be called before transformation");
        }
        _assertMaxxy() {
          if (this._maxxy === 0) throw new Error("MapData.maxZoom or compiled.wh must be set for viewpoint conversion (xy2SysCoord / sysCoord2Xy)");
        }
        getLayerTransform(l) {
          if (l === 0) return this.mainTin;
          const f = this.subTins[l - 1];
          return f ? f.tin : null;
        }
        get layerCount() {
          return 1 + this.subTins.length;
        }
        get maxxy() {
          return this._maxxy;
        }
        _getTinsSortedByPriority() {
          return this._getAllTinsWithIndex().sort((l, f) => {
            const m = l.tin.priority ?? 0, v = f.tin.priority ?? 0;
            return m < v ? 1 : -1;
          });
        }
        _getAllTinsWithIndex() {
          const l = [{ index: 0, tin: this.mainTin, isMain: !0 }];
          return this.subTins.forEach((f, m) => {
            f.tin.priority = f.priority, f.tin.importance = f.importance, l.push({ index: m + 1, tin: f.tin, isMain: !1 });
          }), l;
        }
        _transformByIndex(l, f, m) {
          if (f === 0) return this.mainTin.transform(l, m);
          const v = this.subTins[f - 1];
          return v ? v.tin.transform(l, m, !0) : !1;
        }
        xy2SysCoordInternal(l) {
          return ee(l, this._maxxy);
        }
      }
      e.MERC_CROSSMATRIX = RA, e.MERC_MAX = Pt, e.MapTransform = xA, e.Transform = ze, e.counterTri = rn, e.format_version = EA, e.mercViewpoint2Mercs = Qe, e.mercs2MercViewpoint = Yt, e.normalizeEdges = se, e.rotateMatrix = Ue, e.rotateVerticesTriangle = gn, e.sysCoord2Xy = Ae, e.transformArr = Ht, e.xy2SysCoord = ee, e.zoom2Radius = Fe, Object.defineProperty(e, Symbol.toStringTag, { value: "Module" });
    }));
  })(Ye, Ye.exports)), Ye.exports;
}
var it = Jr();
const ug = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAB3RJTUUH3QgIBToaSbAjlwAAABd0RVh0U29mdHdhcmUAR0xEUE5HIHZlciAzLjRxhaThAAAACHRwTkdHTEQzAAAAAEqAKR8AAAAEZ0FNQQAAsY8L/GEFAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAFRJREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgBDwABHHIJwwAAAABJRU5ErkJggg==", ae = 256, qr = `<canvas width="${ae}" height="${ae}" src="${ug}"></canvas>`;
async function bi(A) {
  if (typeof A == "string") {
    const t = A.match(/\//) ? A : `pois/${A}`, e = await fetch(t);
    if (!e.ok)
      throw new Error("Fail to load poi json");
    return await e.json();
  } else
    return A;
}
async function fg(A, t) {
  if (A = await bi(A), Array.isArray(A))
    A = await Promise.all(A.map(async (e) => await bi(e))), A.length > 0 && A[0].type === "FeatureCollection" ? A = A.reduce((e, n, i) => {
      let g = n.id || n.properties && n.properties.id;
      if (!g)
        if (i === 0) g = "main";
        else throw "POI layers include bad key setting";
      return e[g] = ce(n, g, t), e;
    }, {}) : A = {
      main: ce(A, "main", t)
    };
  else if (A.type === "FeatureCollection") {
    const e = A.id || A.properties && A.properties.id || "main";
    A = { [e]: ce(A, e, t) };
  } else
    Object.keys(A).map((e) => {
      A[e] = ce(A[e], e, t);
    });
  return A.main || (A.main = ce([], "main", t)), Object.keys(A).map((e) => {
    zn(A, e, t);
  }), A;
}
function ce(A, t, e) {
  if (Array.isArray(A))
    A = {
      pois: A.map((n) => $e(n))
    };
  else if (A.type === "FeatureCollection") {
    const n = Object.assign({}, A.properties || {});
    A.name && (n.name = A.name), n.pois = A.features.map((i) => $e(i)), A = n;
  }
  if (typeof A.id > "u")
    A.id = t;
  else if (A.id !== t) throw "POI layers include bad key setting";
  return A.namespaceID || (A.namespaceID = `${e.namespace ? `${e.namespace}#` : ""}${t}`), A.name || (A.name = t === "main" ? e.name : t), A.pois || (A.pois = []), A;
}
function $e(A) {
  if (A.type === "Feature") {
    const t = Object.assign({}, A.properties || {});
    t.lnglat = A.geometry.coordinates, t.id || (t.id = A.id), t.name || (t.name = A.name), A = t;
  }
  return A.lnglat || (A.lnglat = [A.lng || A.longitude, A.lat || A.latitude]), delete A.lng, delete A.lat, delete A.longitude, delete A.latitude, A;
}
function zn(A, t, e) {
  if (!A[t]) return;
  const n = A[t], i = n.pois;
  n.__nextId || (n.__nextId = 0), i.map((g) => {
    g.id || (g.id = `${t}_${n.__nextId}`, n.__nextId++), g.namespaceID || (g.namespaceID = `${e.namespace ? `${e.namespace}#` : ""}${g.id}`);
  });
}
function tA(A, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = A, n;
}
function dg(A, t, e = {}) {
  if (!A)
    throw new Error("coordinates is required");
  if (!Array.isArray(A))
    throw new Error("coordinates must be an Array");
  if (A.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!Ei(A[0]) || !Ei(A[1]))
    throw new Error("coordinates must contain numbers");
  return tA({
    type: "Point",
    coordinates: A
  }, t, e);
}
function mg(A, t, e = {}) {
  for (const i of A) {
    if (i.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (i[i.length - 1].length !== i[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let g = 0; g < i[i.length - 1].length; g++)
      if (i[i.length - 1][g] !== i[0][g])
        throw new Error("First and last Position are not equivalent.");
  }
  return tA({
    type: "Polygon",
    coordinates: A
  }, t, e);
}
function _r(A, t, e = {}) {
  if (A.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return tA({
    type: "LineString",
    coordinates: A
  }, t, e);
}
function Mi(A, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = A, e;
}
function Ei(A) {
  return !isNaN(A) && A !== null && !Array.isArray(A);
}
function $r(A) {
  if (!A)
    throw new Error("coord is required");
  if (!Array.isArray(A)) {
    if (A.type === "Feature" && A.geometry !== null && A.geometry.type === "Point")
      return [...A.geometry.coordinates];
    if (A.type === "Point")
      return [...A.coordinates];
  }
  if (Array.isArray(A) && A.length >= 2 && !Array.isArray(A[0]) && !Array.isArray(A[1]))
    return [...A];
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function ts(A) {
  return A.type === "Feature" ? A.geometry : A;
}
function pg(A, t, e) {
  if (A !== null)
    for (var n, i, g, r, s, o, I, C = 0, a = 0, c, d = A.type, p = d === "FeatureCollection", y = d === "Feature", E = p ? A.features.length : 1, T = 0; T < E; T++) {
      I = p ? A.features[T].geometry : y ? A.geometry : A, c = I ? I.type === "GeometryCollection" : !1, s = c ? I.geometries.length : 1;
      for (var Z = 0; Z < s; Z++) {
        var N = 0, F = 0;
        if (r = c ? I.geometries[Z] : I, r !== null) {
          o = r.coordinates;
          var V = r.type;
          switch (C = V === "Polygon" || V === "MultiPolygon" ? 1 : 0, V) {
            case null:
              break;
            case "Point":
              if (t(
                o,
                a,
                T,
                N,
                F
              ) === !1)
                return !1;
              a++, N++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < o.length; n++) {
                if (t(
                  o[n],
                  a,
                  T,
                  N,
                  F
                ) === !1)
                  return !1;
                a++, V === "MultiPoint" && N++;
              }
              V === "LineString" && N++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < o.length; n++) {
                for (i = 0; i < o[n].length - C; i++) {
                  if (t(
                    o[n][i],
                    a,
                    T,
                    N,
                    F
                  ) === !1)
                    return !1;
                  a++;
                }
                V === "MultiLineString" && N++, V === "Polygon" && F++;
              }
              V === "Polygon" && N++;
              break;
            case "MultiPolygon":
              for (n = 0; n < o.length; n++) {
                for (F = 0, i = 0; i < o[n].length; i++) {
                  for (g = 0; g < o[n][i].length - C; g++) {
                    if (t(
                      o[n][i][g],
                      a,
                      T,
                      N,
                      F
                    ) === !1)
                      return !1;
                    a++;
                  }
                  F++;
                }
                N++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < r.geometries.length; n++)
                if (pg(r.geometries[n], t) === !1)
                  return !1;
              break;
            default:
              throw new Error("Unknown Geometry Type");
          }
        }
      }
    }
}
const qt = 11102230246251565e-32, dt = 134217729, es = (3 + 8 * qt) * qt;
function dn(A, t, e, n, i) {
  let g, r, s, o, I = t[0], C = n[0], a = 0, c = 0;
  C > I == C > -I ? (g = I, I = t[++a]) : (g = C, C = n[++c]);
  let d = 0;
  if (a < A && c < e)
    for (C > I == C > -I ? (r = I + g, s = g - (r - I), I = t[++a]) : (r = C + g, s = g - (r - C), C = n[++c]), g = r, s !== 0 && (i[d++] = s); a < A && c < e; )
      C > I == C > -I ? (r = g + I, o = r - g, s = g - (r - o) + (I - o), I = t[++a]) : (r = g + C, o = r - g, s = g - (r - o) + (C - o), C = n[++c]), g = r, s !== 0 && (i[d++] = s);
  for (; a < A; )
    r = g + I, o = r - g, s = g - (r - o) + (I - o), I = t[++a], g = r, s !== 0 && (i[d++] = s);
  for (; c < e; )
    r = g + C, o = r - g, s = g - (r - o) + (C - o), C = n[++c], g = r, s !== 0 && (i[d++] = s);
  return (g !== 0 || d === 0) && (i[d++] = g), d;
}
function As(A, t) {
  let e = t[0];
  for (let n = 1; n < A; n++) e += t[n];
  return e;
}
function lA(A) {
  return new Float64Array(A);
}
const ns = (3 + 16 * qt) * qt, is = (2 + 12 * qt) * qt, gs = (9 + 64 * qt) * qt * qt, ye = lA(4), Ri = lA(8), xi = lA(12), Pi = lA(16), wt = lA(4);
function rs(A, t, e, n, i, g, r) {
  let s, o, I, C, a, c, d, p, y, E, T, Z, N, F, V, $, At, tt;
  const rt = A - i, st = e - i, Y = t - g, ct = n - g;
  F = rt * ct, c = dt * rt, d = c - (c - rt), p = rt - d, c = dt * ct, y = c - (c - ct), E = ct - y, V = p * E - (F - d * y - p * y - d * E), $ = Y * st, c = dt * Y, d = c - (c - Y), p = Y - d, c = dt * st, y = c - (c - st), E = st - y, At = p * E - ($ - d * y - p * y - d * E), T = V - At, a = V - T, ye[0] = V - (T + a) + (a - At), Z = F + T, a = Z - F, N = F - (Z - a) + (T - a), T = N - $, a = N - T, ye[1] = N - (T + a) + (a - $), tt = Z + T, a = tt - Z, ye[2] = Z - (tt - a) + (T - a), ye[3] = tt;
  let mt = As(4, ye), Zt = is * r;
  if (mt >= Zt || -mt >= Zt || (a = A - rt, s = A - (rt + a) + (a - i), a = e - st, I = e - (st + a) + (a - i), a = t - Y, o = t - (Y + a) + (a - g), a = n - ct, C = n - (ct + a) + (a - g), s === 0 && o === 0 && I === 0 && C === 0) || (Zt = gs * r + es * Math.abs(mt), mt += rt * C + ct * s - (Y * I + st * o), mt >= Zt || -mt >= Zt)) return mt;
  F = s * ct, c = dt * s, d = c - (c - s), p = s - d, c = dt * ct, y = c - (c - ct), E = ct - y, V = p * E - (F - d * y - p * y - d * E), $ = o * st, c = dt * o, d = c - (c - o), p = o - d, c = dt * st, y = c - (c - st), E = st - y, At = p * E - ($ - d * y - p * y - d * E), T = V - At, a = V - T, wt[0] = V - (T + a) + (a - At), Z = F + T, a = Z - F, N = F - (Z - a) + (T - a), T = N - $, a = N - T, wt[1] = N - (T + a) + (a - $), tt = Z + T, a = tt - Z, wt[2] = Z - (tt - a) + (T - a), wt[3] = tt;
  const Gt = dn(4, ye, 4, wt, Ri);
  F = rt * C, c = dt * rt, d = c - (c - rt), p = rt - d, c = dt * C, y = c - (c - C), E = C - y, V = p * E - (F - d * y - p * y - d * E), $ = Y * I, c = dt * Y, d = c - (c - Y), p = Y - d, c = dt * I, y = c - (c - I), E = I - y, At = p * E - ($ - d * y - p * y - d * E), T = V - At, a = V - T, wt[0] = V - (T + a) + (a - At), Z = F + T, a = Z - F, N = F - (Z - a) + (T - a), T = N - $, a = N - T, wt[1] = N - (T + a) + (a - $), tt = Z + T, a = tt - Z, wt[2] = Z - (tt - a) + (T - a), wt[3] = tt;
  const z = dn(Gt, Ri, 4, wt, xi);
  F = s * C, c = dt * s, d = c - (c - s), p = s - d, c = dt * C, y = c - (c - C), E = C - y, V = p * E - (F - d * y - p * y - d * E), $ = o * I, c = dt * o, d = c - (c - o), p = o - d, c = dt * I, y = c - (c - I), E = I - y, At = p * E - ($ - d * y - p * y - d * E), T = V - At, a = V - T, wt[0] = V - (T + a) + (a - At), Z = F + T, a = Z - F, N = F - (Z - a) + (T - a), T = N - $, a = N - T, wt[1] = N - (T + a) + (a - $), tt = Z + T, a = tt - Z, wt[2] = Z - (tt - a) + (T - a), wt[3] = tt;
  const ft = dn(z, xi, 4, wt, Pi);
  return Pi[ft - 1];
}
function ss(A, t, e, n, i, g) {
  const r = (t - g) * (e - i), s = (A - i) * (n - g), o = r - s, I = Math.abs(r + s);
  return Math.abs(o) >= ns * I ? o : -rs(A, t, e, n, i, g, I);
}
function os(A, t) {
  var e, n, i = 0, g, r, s, o, I, C, a, c = A[0], d = A[1], p = t.length;
  for (e = 0; e < p; e++) {
    n = 0;
    var y = t[e], E = y.length - 1;
    if (C = y[0], C[0] !== y[E][0] && C[1] !== y[E][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (r = C[0] - c, s = C[1] - d, n; n < E; n++) {
      if (a = y[n + 1], o = a[0] - c, I = a[1] - d, s === 0 && I === 0) {
        if (o <= 0 && r >= 0 || r <= 0 && o >= 0)
          return 0;
      } else if (I >= 0 && s <= 0 || I <= 0 && s >= 0) {
        if (g = ss(r, o, s, I, 0, 0), g === 0)
          return 0;
        (g > 0 && I > 0 && s <= 0 || g < 0 && I <= 0 && s > 0) && i++;
      }
      C = a, s = I, r = o;
    }
  }
  return i % 2 !== 0;
}
function Is(A, t, e = {}) {
  if (!A)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = $r(A), i = ts(t), g = i.type, r = t.bbox;
  let s = i.coordinates;
  if (r && Cs(n, r) === !1)
    return !1;
  g === "Polygon" && (s = [s]);
  let o = !1;
  for (var I = 0; I < s.length; ++I) {
    const C = os(n, s[I]);
    if (C === 0) return !e.ignoreBoundary;
    C && (o = !0);
  }
  return o;
}
function Cs(A, t) {
  return t[0] <= A[0] && t[1] <= A[1] && t[2] >= A[0] && t[3] >= A[1];
}
class yg {
  constructor(t = [], e = as) {
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
    const { data: e, compare: n } = this, i = e[t];
    for (; t > 0; ) {
      const g = t - 1 >> 1, r = e[g];
      if (n(i, r) >= 0) break;
      e[t] = r, t = g;
    }
    e[t] = i;
  }
  _down(t) {
    const { data: e, compare: n } = this, i = this.length >> 1, g = e[t];
    for (; t < i; ) {
      let r = (t << 1) + 1, s = e[r];
      const o = r + 1;
      if (o < this.length && n(e[o], s) < 0 && (r = o, s = e[o]), n(s, g) >= 0) break;
      e[t] = s, t = r;
    }
    e[t] = g;
  }
}
function as(A, t) {
  return A < t ? -1 : A > t ? 1 : 0;
}
function wg(A, t) {
  return A.p.x > t.p.x ? 1 : A.p.x < t.p.x ? -1 : A.p.y !== t.p.y ? A.p.y > t.p.y ? 1 : -1 : 1;
}
function cs(A, t) {
  return A.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : A.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : A.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? A.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
class Si {
  constructor(t, e, n, i) {
    this.p = {
      x: t[0],
      y: t[1]
    }, this.featureId = e, this.ringId = n, this.eventId = i, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(t) {
    return this.p.x === t.p.x && this.p.y === t.p.y;
  }
}
function ls(A, t) {
  if (A.type === "FeatureCollection") {
    const e = A.features;
    for (let n = 0; n < e.length; n++)
      Di(e[n], t);
  } else
    Di(A, t);
}
let OA = 0, XA = 0, ZA = 0;
function Di(A, t) {
  const e = A.type === "Feature" ? A.geometry : A;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let i = 0; i < n.length; i++)
    for (let g = 0; g < n[i].length; g++) {
      let r = n[i][g][0], s = null;
      XA = XA + 1;
      for (let o = 0; o < n[i][g].length - 1; o++) {
        s = n[i][g][o + 1];
        const I = new Si(r, OA, XA, ZA), C = new Si(s, OA, XA, ZA + 1);
        I.otherEvent = C, C.otherEvent = I, wg(I, C) > 0 ? (C.isLeftEndpoint = !0, I.isLeftEndpoint = !1) : (I.isLeftEndpoint = !0, C.isLeftEndpoint = !1), t.push(I), t.push(C), r = s, ZA = ZA + 1;
      }
    }
  OA = OA + 1;
}
class hs {
  constructor(t) {
    this.leftSweepEvent = t, this.rightSweepEvent = t.otherEvent;
  }
}
function us(A, t) {
  if (A === null || t === null || A.leftSweepEvent.ringId === t.leftSweepEvent.ringId && (A.rightSweepEvent.isSamePoint(t.leftSweepEvent) || A.rightSweepEvent.isSamePoint(t.leftSweepEvent) || A.rightSweepEvent.isSamePoint(t.rightSweepEvent) || A.leftSweepEvent.isSamePoint(t.leftSweepEvent) || A.leftSweepEvent.isSamePoint(t.rightSweepEvent))) return !1;
  const e = A.leftSweepEvent.p.x, n = A.leftSweepEvent.p.y, i = A.rightSweepEvent.p.x, g = A.rightSweepEvent.p.y, r = t.leftSweepEvent.p.x, s = t.leftSweepEvent.p.y, o = t.rightSweepEvent.p.x, I = t.rightSweepEvent.p.y, C = (I - s) * (i - e) - (o - r) * (g - n), a = (o - r) * (n - s) - (I - s) * (e - r), c = (i - e) * (n - s) - (g - n) * (e - r);
  if (C === 0)
    return !1;
  const d = a / C, p = c / C;
  if (d >= 0 && d <= 1 && p >= 0 && p <= 1) {
    const y = e + d * (i - e), E = n + d * (g - n);
    return [y, E];
  }
  return !1;
}
function fs(A, t) {
  t = t || !1;
  const e = [], n = new yg([], cs);
  for (; A.length; ) {
    const i = A.pop();
    if (i.isLeftEndpoint) {
      const g = new hs(i);
      for (let r = 0; r < n.data.length; r++) {
        const s = n.data[r];
        if (t && s.leftSweepEvent.featureId === i.featureId)
          continue;
        const o = us(g, s);
        o !== !1 && e.push(o);
      }
      n.push(g);
    } else i.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
function ds(A, t) {
  const e = new yg([], wg);
  return ls(A, e), fs(e, t);
}
var ms = ds;
function ps(A, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: i = !0 } = e;
  let g = [];
  A.type === "FeatureCollection" ? g = g.concat(A.features) : A.type === "Feature" ? g.push(A) : (A.type === "LineString" || A.type === "Polygon" || A.type === "MultiLineString" || A.type === "MultiPolygon") && g.push(tA(A)), t.type === "FeatureCollection" ? g = g.concat(t.features) : t.type === "Feature" ? g.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && g.push(tA(t));
  const r = ms(
    Mi(g),
    i
  );
  let s = [];
  if (n) {
    const o = {};
    r.forEach((I) => {
      const C = I.join(",");
      o[C] || (o[C] = !0, s.push(I));
    });
  } else
    s = r;
  return Mi(s.map((o) => dg(o)));
}
function ys(A, t = {}) {
  let e = 0, n = 0, i = 0;
  return pg(
    A,
    function(g) {
      e += g[0], n += g[1], i++;
    }
  ), dg([e / i, n / i], t.properties);
}
function vg(A) {
  class t extends A {
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
    initialize(i) {
      var s;
      if (i = Wt(i), this.mapID = i.mapID, this.homePosition = i.homePosition, this.mercZoom = i.mercZoom, this.label = i.label, this.maxZoom = i.maxZoom, this.minZoom = i.minZoom, this.poiTemplate = i.poiTemplate, this.poiStyle = i.poiStyle, this.iconTemplate = i.iconTemplate, this.icon = i.icon, this.selectedIcon = i.selectedIcon, this.mercatorXShift = i.mercatorXShift, this.mercatorYShift = i.mercatorYShift, this.weiwudi = i.weiwudi, i.envelopeLngLats) {
        const I = i.envelopeLngLats.map(
          (C) => Tt(C, "EPSG:4326", "EPSG:3857")
        );
        I.push(I[0]), this.envelope = mg([I]), this.centroid = (s = ys(this.envelope).geometry) == null ? void 0 : s.coordinates;
      }
      for (let o = 0; o < eA.length; o++) {
        const I = eA[o], C = vs[o];
        this.set(I, i[C] || i[I]);
      }
      const g = i.thumbnail ? new Promise((o) => {
        this.thumbnail = i.thumbnail, o(void 0);
      }) : new Promise((o) => {
        this.thumbnail = `./tmbs/${i.mapID}.jpg`, fetch(this.thumbnail).then((I) => {
          I.ok || (this.thumbnail = `./tmbs/${i.mapID}_menu.jpg`), o(void 0);
        }).catch((I) => {
          this.thumbnail = `./tmbs/${i.mapID}_menu.jpg`, o(void 0);
        });
      }).catch((o) => {
        this.thumbnail = `./tmbs/${i.mapID || i.sourceID}_menu.jpg`;
      }), r = this.resolvePois(i.pois);
      this.initialWait = Promise.all([r, g]), bs(this);
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
    async fetchAllTileCacheAsync(i) {
      if (this.weiwudi)
        try {
          const g = (s) => {
            i(s.type, s.detail);
          }, r = (s) => {
            this.weiwudi.removeEventListener("proceed", g), this.weiwudi.removeEventListener("finish", r), this.weiwudi.removeEventListener("stop", r), this.weiwudi.removeEventListener("canceled", r), g(s);
          };
          this.weiwudi.addEventListener("proceed", g), this.weiwudi.addEventListener("finish", r), this.weiwudi.addEventListener("stop", r), this.weiwudi.addEventListener("canceled", r), await this.weiwudi.fetchAll();
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
      let g, r;
      const s = i.mercZoom, o = i.zoom, I = i.direction, C = i.rotation, a = this.getMap(), c = a == null ? void 0 : a.getView();
      i.latitude !== void 0 && i.longitude !== void 0 && (g = Tt(
        [i.longitude, i.latitude],
        "EPSG:4326",
        "EPSG:3857"
      )), i.x !== void 0 && i.y != null && (r = [i.x, i.y]), this.viewpoint2MercsAsync().then((d) => this.mercs2MercViewpoint(d)).then((d) => {
        const p = this.mercViewpoint2Mercs([
          g || d[0],
          s || d[1] || 17,
          I ?? C ?? d[2]
        ]);
        this.mercs2ViewpointAsync(p).then((y) => {
          g != null ? c == null || c.setCenter(y[0]) : r != null && (c == null || c.setCenter(r)), s != null ? c == null || c.setZoom(y[1]) : o != null && (c == null || c.setZoom(o)), I != null ? c == null || c.setRotation(y[2]) : C != null && (c == null || c.setRotation(C));
        });
      });
    }
    setViewpoint(i) {
      const g = { ...i };
      g.rotation && (g.rotation = g.rotation * Math.PI / 180), g.direction && (g.direction = g.direction * Math.PI / 180), this.setViewpointRadian(g);
    }
    goHome() {
      const g = this.getMap();
      let r = g.getTarget();
      typeof r == "string" && (r = document.getElementById(r));
      const s = g.homeMarginPixels, o = [
        (r.clientWidth - s - 10) * 1,
        (r.clientHeight - s - 10) * 1
      ], I = {
        longitude: this.homePosition[0],
        latitude: this.homePosition[1],
        zoom: this.defZoom(o)
      };
      this.getMap().northUp ? I.direction = 0 : I.rotation = 0, this.setViewpointRadian(I);
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
    setGPSMarkerAsync(i, g = !1) {
      const r = this.getMap(), s = r == null ? void 0 : r.getView();
      if (!i)
        return new Promise((I, C) => {
          r == null || r.setGPSPosition(null), I(!0);
        });
      const o = this.mercsFromGPSValue(i.lnglat, i.acc);
      return this.mercs2SysCoordsAsync_multiLayer([o]).then((I) => {
        const C = !I[0], a = C ? I[1] : I[0], c = C ? null : I[1], d = { xy: a[0][0] };
        if (!this.insideCheckSysCoord(a[0][0])) return !1;
        const p = a[0].slice(1);
        return d.rad = p.reduce(
          (y, E, T) => {
            const Z = y + Math.sqrt(
              Math.pow(E[0] - d.xy[0], 2) + Math.pow(E[1] - d.xy[1], 2)
            );
            return T === 3 ? Z / 4 : Z;
          },
          0
        ), g || s == null || s.setCenter(d.xy), r == null || r.setGPSPosition(d, C ? "hide" : null), c && (r == null || r.setGPSPosition({ xy: c[0][0] }, "sub")), !0;
      }).catch((I) => {
        throw I;
      });
    }
    setGPSMarker(i, g = !1) {
      this.setGPSMarkerAsync(i, g).then(() => {
      });
    }
    mercsFromGPSValue(i, g) {
      const r = Tt(i, "EPSG:4326", "EPSG:3857"), s = i[1] * Math.PI / 180, o = g / Math.cos(s);
      return it.MERC_CROSSMATRIX.map((I) => [
        I[0] * o + r[0],
        I[1] * o + r[1]
      ]);
    }
    // 与えられた差分行列を回転。theta無指定の場合は自動取得
    rotateMatrix(i, g) {
      return g === void 0 && (g = this.getMap().getView().getRotation()), it.rotateMatrix(i, g);
    }
    async resolvePois(i) {
      this.pois = await fg(i || [], {
        name: this.officialTitle || this.title,
        namespace: this.mapID
      });
    }
    getPoi(i) {
      let g;
      return Object.keys(this.pois).map((r) => {
        this.pois[r].pois.map((s, o) => {
          s.id === i && (g = this.pois[r].pois[o]);
        });
      }), g;
    }
    addPoi(i, g) {
      if (g || (g = "main"), this.pois[g])
        return i = $e(i), this.pois[g].pois.push(i), zn(this.pois, g, {
          name: this.officialTitle || this.title,
          namespace: this.mapID
        }), i.namespaceID;
    }
    removePoi(i) {
      Object.keys(this.pois).map((g) => {
        this.pois[g].pois.map((r, s) => {
          r.id === i && delete this.pois[g].pois[s];
        });
      });
    }
    clearPoi(i) {
      i || (i = "main"), i === "all" ? Object.keys(this.pois).map((g) => {
        this.pois[g].pois = [];
      }) : this.pois[i] && (this.pois[i].pois = []);
    }
    listPoiLayers(i = !1, g = !1) {
      return Object.keys(this.pois).sort((r, s) => r === "main" ? -1 : s === "main" ? 1 : r < s ? -1 : r > s ? 1 : 0).map((r) => this.pois[r]).filter(
        (r) => g ? i ? r.pois.length && r.hide : r.pois.length : i ? r.hide : !0
      );
    }
    getPoiLayer(i) {
      return this.pois[i];
    }
    addPoiLayer(i, g) {
      i !== "main" && (this.pois[i] || (this.pois[i] = ce(g || [], i, {
        name: this.officialTitle || this.title,
        namespace: this.mapID
      })));
    }
    removePoiLayer(i) {
      i !== "main" && this.pois[i] && delete this.pois[i];
    }
    merc2SysCoordAsync_ignoreBackground(i) {
      return this.merc2XyAsync_ignoreBackground(i).then(
        (g) => g ? this.xy2SysCoord(g) : void 0
      );
    }
    merc2SysCoordAsync(i) {
      return this.merc2XyAsync(i).then(
        (g) => g && this.xy2SysCoord(g)
      );
    }
    sysCoord2MercAsync(i) {
      const g = this.sysCoord2Xy(i);
      return this.xy2MercAsync(g);
    }
    // size(画面サイズ)とズームから、地図面座標上での半径を得る。zoom無指定の場合は自動取得
    zoom2Radius(i, g) {
      return g === void 0 && (g = this.getMap().getView().getDecimalZoom()), it.zoom2Radius(i, g);
    }
    // 画面サイズと地図ズームから、地図面座標上での5座標を取得する。zoom, rotate無指定の場合は自動取得
    viewpoint2SysCoords(i, g) {
      return this.mercViewpoint2Mercs(i, g);
    }
    mercViewpoint2Mercs(i, g) {
      let r = i ? i[0] : void 0;
      const s = i ? i[1] : void 0, o = i ? i[2] : void 0;
      r === void 0 && (r = this.getMap().getView().getCenter()), g === void 0 && (g = this.getMap().getSize());
      const I = s ?? this.getMap().getView().getDecimalZoom(), C = o ?? this.getMap().getView().getRotation();
      return [it.mercViewpoint2Mercs(
        r,
        I,
        C,
        g
      ), g];
    }
    // 地図座標5地点情報から地図サイズ情報（中心座標、サイズ、回転）を得る
    sysCoords2Viewpoint(i) {
      return this.mercs2MercViewpoint(i);
    }
    // メルカトル5地点情報からメルカトル地図でのサイズ情報（中心座標、サイズ、回転）を得る
    mercs2MercViewpoint(i) {
      let g = i[1];
      g || (g = this.getMap().getSize());
      const r = it.mercs2MercViewpoint(
        i[0],
        g
      );
      return [r.center, r.zoom, r.rotation];
    }
    sysCoords2Xys(i) {
      return [
        i[0].map((g) => this.sysCoord2Xy(g)),
        i[1]
      ];
    }
    xys2SysCoords(i) {
      return [i[0].map((g) => this.xy2SysCoord(g)), i[1]];
    }
    mercs2XysAsync(i) {
      return Promise.all(i[0].map((g) => this.merc2XyAsync(g))).then(
        (g) => [g, i[1]]
      );
    }
    xys2MercsAsync(i) {
      return Promise.all(i[0].map((g) => this.xy2MercAsync(g))).then(
        (g) => [g, i[1]]
      );
    }
    static async createAsync(i) {
      return new this(i);
    }
  }
  return M(t, "isBasemap_", !1), M(t, "isWmts_", !0), M(t, "isMapbox_", !1), M(t, "isMapLibre_", !1), t;
}
function bg(A) {
  class t extends vg(A) {
    insideCheckXy(n) {
      return this.envelope ? Is(n, this.envelope) : !0;
    }
    insideCheckSysCoord(n) {
      return this.insideCheckXy(n);
    }
    modulateXyInside(n) {
      if (!this.centroid) return n;
      const i = _r([n, this.centroid]), g = ps(this.envelope, i);
      return g.features.length > 0 && g.features[0].geometry ? g.features[0].geometry.coordinates : n;
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
    viewpoint2MercsAsync(n, i) {
      const g = this.viewpoint2SysCoords(n, i), r = this.sysCoords2Xys(g);
      return this.xys2MercsAsync(r);
    }
    mercs2ViewpointAsync(n) {
      return this.mercs2XysAsync(n).then((i) => {
        const g = this.xys2SysCoords(i);
        return this.sysCoords2Viewpoint(g);
      });
    }
    mercs2SysCoordsAsync_multiLayer(n) {
      return Promise.all(
        n[0].map((i) => this.merc2SysCoordAsync(i))
      ).then((i) => [[i, n[1]]]);
    }
    defZoom() {
      return this.mercZoom;
    }
  }
  return M(t, "isBasemap_", !0), M(t, "isWmts_", !0), t;
}
function ws(A) {
  class t extends vg(A) {
    constructor() {
      super(...arguments);
      M(this, "width", 0);
      M(this, "height", 0);
      M(this, "_maxxy", 0);
    }
    insideCheckXy(i) {
      return !(i[0] < 0 || i[0] > this.width || i[1] < 0 || i[1] > this.height);
    }
    insideCheckSysCoord(i) {
      return this.insideCheckXy(this.sysCoord2Xy(i));
    }
    modulateXyInside(i) {
      const g = i[0] / (this.width / 2) - 1, r = i[1] / (this.height / 2) - 1, s = Math.max(Math.abs(g), Math.abs(r));
      return [
        (g / s + 1) * this.width / 2,
        (r / s + 1) * this.height / 2
      ];
    }
    modulateSysCoordInside(i) {
      const g = this.sysCoord2Xy(i), r = this.modulateXyInside(g);
      return this.xy2SysCoord(r);
    }
    // unifyTerm対応
    // https://github.com/code4history/MaplatCore/issues/19
    xy2SysCoord(i) {
      const g = i[0] * (2 * it.MERC_MAX) / this._maxxy - it.MERC_MAX, r = -1 * (i[1] * (2 * it.MERC_MAX) / this._maxxy - it.MERC_MAX);
      return [g, r];
    }
    sysCoord2Xy(i) {
      const g = (i[0] + it.MERC_MAX) * this._maxxy / (2 * it.MERC_MAX), r = (-i[1] + it.MERC_MAX) * this._maxxy / (2 * it.MERC_MAX);
      return [g, r];
    }
    defZoom(i) {
      const g = i[0], r = i[1], s = Math.log2((g - 10) / this.width), o = Math.log2((r - 10) / this.height), I = this.maxZoom;
      let C;
      return o > s ? C = o : C = s, I + C;
    }
  }
  return M(t, "isBasemap_", !1), M(t, "isWmts_", !1), t;
}
const eA = [
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
], vs = [
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
function Mg(A) {
  return A = Wt(A), A.imageExtension || (A.imageExtension = "jpg"), A.mapID && !A.url && !A.urls && (A.url = A.tms ? `tiles/${A.mapID}/{z}/{x}/{-y}.${A.imageExtension}` : `tiles/${A.mapID}/{z}/{x}/{y}.${A.imageExtension}`), A;
}
function bs(A) {
  const t = A;
  A.setTileLoadFunction(
    (function() {
      const e = t.getTileLoadFunction(), n = function(i, g, r, s, o, I, C) {
        return new Promise((a, c) => {
          const d = function(p, y = void 0) {
            const E = document.createElement("img");
            E.crossOrigin = "Anonymous", E.onload = E.onerror = function() {
              if (E.width && E.height) {
                const T = r.getContext("2d"), Z = s === 0 ? 256 - I : 0, N = o === 0 ? 256 - C : 0;
                I = s + I > E.width ? E.width - s : I, C = o + C > E.height ? E.height - o : C, T.drawImage(E, s, o, I, C, Z, N, I, C), a(void 0);
              } else
                y ? d(y) : a("tileLoadError");
            }, E.src = p;
          };
          d(g);
        });
      };
      return function(i, g) {
        const r = i.tileCoord[0];
        let s = i.tileCoord[1], o = i.tileCoord[2], I = Math.round(
          (t.mercatorXShift || 0) * 128 * Math.pow(2, r) / it.MERC_MAX
        ), C = Math.round(
          (t.mercatorYShift || 0) * -128 * Math.pow(2, r) / it.MERC_MAX
        );
        for (; I < 0 || I >= 256; )
          I < 0 ? (I = I + 256, s++) : (I = I - 256, s--);
        for (; C < 0 || C >= 256; )
          C < 0 ? (C = C + 256, o++) : (C = C - 256, o--);
        const a = document.createElement("div");
        a.innerHTML = qr;
        const c = a.childNodes[0], d = [
          [[r, s, o], 0, 0, 256 - I, 256 - C]
        ];
        I !== 0 && d.push([
          [r, s - 1, o],
          256 - I,
          0,
          I,
          256 - C
        ]), C !== 0 && (d.push([
          [r, s, o - 1],
          0,
          256 - C,
          256 - I,
          C
        ]), I !== 0 && d.push([
          [r, s - 1, o - 1],
          256 - I,
          256 - C,
          I,
          C
        ])), Promise.all(
          d.map((p) => {
            const y = t.tileUrlFunction(
              p[0],
              t.tilePixelRatio_,
              t.projection_
            );
            return n(
              p[0],
              y,
              c,
              p[1],
              p[2],
              p[3],
              p[4]
            );
          })
        ).then((p) => {
          if (p.reduce((E, T) => E && T, !0))
            i.handleImageError_();
          else {
            const E = c.toDataURL(), T = i.getImage();
            T.crossOrigin = null, e(i, E);
          }
        }).catch((p) => {
          i.handleImageError_();
        });
      };
    })()
  );
}
function We(A) {
  const t = document, e = t.createDocumentFragment(), n = [];
  A = A.replace(/(<\/?)d([ >])/g, "$1div$2").replace(/(<\/?)s([ >])/g, "$1span$2").replace(/ din="/g, ' data-i18n="').replace(/ dinh="/g, ' data-i18n-html="').replace(/ c="/g, ' class="');
  const i = e.appendChild(t.createElement("div"));
  i.innerHTML = A;
  for (let g = 0; g < i.childNodes.length; g++) {
    const r = i.childNodes[g];
    if (r.nodeName && r.nodeName.toLowerCase() === "script") {
      const s = t.createElement("script");
      r.type && (s.type = r.type), r.src ? s.src = r.src : s.text = r.text, n[g] = s;
    } else
      n[g] = r;
  }
  return n;
}
function Bi(A) {
  for (; !(A <= 180 && A > -180); ) {
    const t = A > 0 ? -1 : 1;
    A = A + t * 360;
  }
  return A;
}
function Ti(A) {
  if (!A) return;
  const t = {
    mapID: A.mapID
  };
  for (let e = 0; e < eA.length; e++) {
    const n = eA[e];
    A[n] && (t[n] = A[n]);
  }
  return t;
}
function Wt(A) {
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
  }, A);
}
class Eg {
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
function Ms(A, t, e) {
  let n, i;
  e = e || Rg;
  let g = 0, r = A.length, s = !1;
  for (; g < r; )
    n = g + (r - g >> 1), i = +e(A[n], t), i < 0 ? g = n + 1 : (r = n, s = !i);
  return s ? g : ~g;
}
function Rg(A, t) {
  return A > t ? 1 : A < t ? -1 : 0;
}
function xg(A, t, e) {
  if (A[0] <= t)
    return 0;
  const n = A.length;
  if (t <= A[n - 1])
    return n - 1;
  if (typeof e == "function") {
    for (let i = 1; i < n; ++i) {
      const g = A[i];
      if (g === t)
        return i;
      if (g < t)
        return e(t, A[i - 1], g) > 0 ? i - 1 : i;
    }
    return n - 1;
  }
  if (e > 0) {
    for (let i = 1; i < n; ++i)
      if (A[i] < t)
        return i - 1;
    return n - 1;
  }
  if (e < 0) {
    for (let i = 1; i < n; ++i)
      if (A[i] <= t)
        return i;
    return n - 1;
  }
  for (let i = 1; i < n; ++i) {
    if (A[i] == t)
      return i;
    if (A[i] < t)
      return A[i - 1] - t < t - A[i] ? i - 1 : i;
  }
  return n - 1;
}
function Pg(A, t) {
  const e = Array.isArray(t) ? t : [t], n = e.length;
  for (let i = 0; i < n; i++)
    A[A.length] = e[i];
}
function Es(A, t) {
  const e = A.length;
  if (e !== t.length)
    return !1;
  for (let n = 0; n < e; n++)
    if (A[n] !== t[n])
      return !1;
  return !0;
}
function Rs() {
  return !0;
}
function qA() {
  return !1;
}
function Bn() {
}
function xs(A) {
  let t, e, n;
  return function() {
    const i = Array.prototype.slice.call(arguments);
    return (!e || this !== n || !Es(i, e)) && (n = this, e = i, t = A.apply(this, arguments)), t;
  };
}
function Sg(A) {
  for (const t in A)
    delete A[t];
}
function Ps(A) {
  let t;
  for (t in A)
    return !1;
  return !t;
}
class Dg extends Eg {
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
    const n = this.listeners_ || (this.listeners_ = {}), i = n[t] || (n[t] = []);
    i.includes(e) || i.push(e);
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
    const e = typeof t == "string", n = e ? t : t.type, i = this.listeners_ && this.listeners_[n];
    if (!i)
      return;
    const g = e ? new _t(t) : (
      /** @type {Event} */
      t
    );
    g.target || (g.target = this.eventTarget_ || this);
    const r = this.dispatching_ || (this.dispatching_ = {}), s = this.pendingRemovals_ || (this.pendingRemovals_ = {});
    n in r || (r[n] = 0, s[n] = 0), ++r[n];
    let o;
    for (let I = 0, C = i.length; I < C; ++I)
      if ("handleEvent" in i[I] ? o = /** @type {import("../events.js").ListenerObject} */
      i[I].handleEvent(g) : o = /** @type {import("../events.js").ListenerFunction} */
      i[I].call(this, g), o === !1 || g.propagationStopped) {
        o = !1;
        break;
      }
    if (--r[n] === 0) {
      let I = s[n];
      for (delete s[n]; I--; )
        this.removeEventListener(n, Bn);
      delete r[n];
    }
    return o;
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.listeners_ && Sg(this.listeners_);
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
    const i = n.indexOf(e);
    i !== -1 && (this.pendingRemovals_ && t in this.pendingRemovals_ ? (n[i] = Bn, ++this.pendingRemovals_[t]) : (n.splice(i, 1), n.length === 0 && delete this.listeners_[t]));
  }
}
lg.prototype.getDecimalZoom = function() {
  const A = this.getResolution(), t = (
    // NOTE: `resolution` maybe `undefined`
    // NOTE: `offset` maybe `NaN`
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Math.log(this.maxResolution_ / A) / Math.log(2)
  );
  return t !== void 0 ? this.minZoom_ + t : t;
};
const ht = {
  UNKNOWN: 0,
  INTERSECTING: 1,
  ABOVE: 2,
  RIGHT: 4,
  BELOW: 8,
  LEFT: 16
};
function Fn(A, t, e) {
  let n, i;
  return t < A[0] ? n = A[0] - t : A[2] < t ? n = t - A[2] : n = 0, e < A[1] ? i = A[1] - e : A[3] < e ? i = e - A[3] : i = 0, n * n + i * i;
}
function Ss(A, t, e) {
  return A[0] <= t && t <= A[2] && A[1] <= e && e <= A[3];
}
function Gi(A, t) {
  const e = A[0], n = A[1], i = A[2], g = A[3], r = t[0], s = t[1];
  let o = ht.UNKNOWN;
  return r < e ? o = o | ht.LEFT : r > i && (o = o | ht.RIGHT), s < n ? o = o | ht.BELOW : s > g && (o = o | ht.ABOVE), o === ht.UNKNOWN && (o = ht.INTERSECTING), o;
}
function Bg() {
  return [1 / 0, 1 / 0, -1 / 0, -1 / 0];
}
function _A(A, t, e, n, i) {
  return i ? (i[0] = A, i[1] = t, i[2] = e, i[3] = n, i) : [A, t, e, n];
}
function Tg(A) {
  return _A(1 / 0, 1 / 0, -1 / 0, -1 / 0, A);
}
function Ds(A, t) {
  const e = A[0], n = A[1];
  return _A(e, n, e, n, t);
}
function Bs(A, t, e, n, i) {
  const g = Tg(i);
  return Gg(g, A, t, e, n);
}
function Gg(A, t, e, n, i) {
  for (; e < n; e += i)
    Ts(A, t[e], t[e + 1]);
  return A;
}
function Ts(A, t, e) {
  A[0] = Math.min(A[0], t), A[1] = Math.min(A[1], e), A[2] = Math.max(A[2], t), A[3] = Math.max(A[3], e);
}
function kg(A, t) {
  let e;
  return e = t(Gs(A)), e || (e = t(ks(A)), e) || (e = t(Ls(A)), e) || (e = t(Zs(A)), e) ? e : !1;
}
function Gs(A) {
  return [A[0], A[1]];
}
function ks(A) {
  return [A[2], A[1]];
}
function WA(A) {
  return [(A[0] + A[2]) / 2, (A[1] + A[3]) / 2];
}
function Os(A, t, e, n, i) {
  const [g, r, s, o, I, C, a, c] = Xs(
    A,
    t,
    e,
    n
  );
  return _A(
    Math.min(g, s, I, a),
    Math.min(r, o, C, c),
    Math.max(g, s, I, a),
    Math.max(r, o, C, c),
    i
  );
}
function Xs(A, t, e, n) {
  const i = t * n[0] / 2, g = t * n[1] / 2, r = Math.cos(e), s = Math.sin(e), o = i * r, I = i * s, C = g * r, a = g * s, c = A[0], d = A[1];
  return [
    c - o + a,
    d - I - C,
    c - o - a,
    d - I + C,
    c + o - a,
    d + I + C,
    c + o + a,
    d + I - C,
    c - o + a,
    d - I - C
  ];
}
function AA(A) {
  return A[3] - A[1];
}
function Zs(A) {
  return [A[0], A[3]];
}
function Ls(A) {
  return [A[2], A[3]];
}
function Un(A) {
  return A[2] - A[0];
}
function Qn(A, t) {
  return A[0] <= t[2] && A[2] >= t[0] && A[1] <= t[3] && A[3] >= t[1];
}
function Og(A) {
  return A[2] < A[0] || A[3] < A[1];
}
function js(A, t) {
  return t ? (t[0] = A[0], t[1] = A[1], t[2] = A[2], t[3] = A[3], t) : A;
}
function Ns(A, t, e) {
  let n = !1;
  const i = Gi(A, t), g = Gi(A, e);
  if (i === ht.INTERSECTING || g === ht.INTERSECTING)
    n = !0;
  else {
    const r = A[0], s = A[1], o = A[2], I = A[3], C = t[0], a = t[1], c = e[0], d = e[1], p = (d - a) / (c - C);
    let y, E;
    g & ht.ABOVE && !(i & ht.ABOVE) && (y = c - (d - I) / p, n = y >= r && y <= o), !n && g & ht.RIGHT && !(i & ht.RIGHT) && (E = d - (c - o) * p, n = E >= s && E <= I), !n && g & ht.BELOW && !(i & ht.BELOW) && (y = c - (d - s) / p, n = y >= r && y <= o), !n && g & ht.LEFT && !(i & ht.LEFT) && (E = d - (c - r) * p, n = E >= s && E <= I);
  }
  return n;
}
function vt() {
  throw new Error("Unimplemented abstract method.");
}
let zs = 0;
function Fs(A) {
  return A.ol_uid || (A.ol_uid = String(++zs));
}
const Us = {
  /**
   * Triggered when a property is changed.
   * @event module:ol/Object.ObjectEvent#propertychange
   * @api
   */
  PROPERTYCHANGE: "propertychange"
}, re = {
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
function Re(A, t, e, n, i) {
  if (i) {
    const r = e;
    e = function(s) {
      return A.removeEventListener(t, e), r.call(n ?? this, s);
    };
  } else n && n !== A && (e = e.bind(n));
  const g = {
    target: A,
    type: t,
    listener: e
  };
  return A.addEventListener(t, e), g;
}
function ki(A, t, e, n) {
  return Re(A, t, e, n, !0);
}
function _e(A) {
  A && A.target && (A.target.removeEventListener(A.type, A.listener), Sg(A));
}
class $A extends Dg {
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
    ++this.revision_, this.dispatchEvent(re.CHANGE);
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
      const n = t.length, i = new Array(n);
      for (let g = 0; g < n; ++g)
        i[g] = Re(this, t[g], e);
      return i;
    }
    return Re(
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
      const i = t.length;
      n = new Array(i);
      for (let g = 0; g < i; ++g)
        n[g] = ki(this, t[g], e);
    } else
      n = ki(
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
      Qs(n);
    else if (Array.isArray(t))
      for (let i = 0, g = t.length; i < g; ++i)
        this.removeEventListener(t[i], e);
    else
      this.removeEventListener(t, e);
  }
}
$A.prototype.on;
$A.prototype.once;
$A.prototype.un;
function Qs(A) {
  if (Array.isArray(A))
    for (let t = 0, e = A.length; t < e; ++t)
      _e(A[t]);
  else
    _e(
      /** @type {import("./events.js").EventsKey} */
      A
    );
}
class Oi extends _t {
  /**
   * @param {string} type The event type.
   * @param {string} key The property name.
   * @param {*} oldValue The old value for `key`.
   */
  constructor(t, e, n) {
    super(t), this.key = e, this.oldValue = n;
  }
}
class ke extends $A {
  /**
   * @param {Object<string, *>} [values] An object with key-value pairs.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, Fs(this), this.values_ = null, t !== void 0 && this.setProperties(t);
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
    n = `change:${t}`, this.hasListener(n) && this.dispatchEvent(new Oi(n, t, e)), n = Us.PROPERTYCHANGE, this.hasListener(n) && this.dispatchEvent(new Oi(n, t, e));
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
    const i = this.values_ || (this.values_ = {});
    if (n)
      i[t] = e;
    else {
      const g = i[t];
      i[t] = e, g !== e && this.notify(t, g);
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
      delete this.values_[t], Ps(this.values_) && (this.values_ = null), e || this.notify(t, n);
    }
  }
}
function Ws(...A) {
  console.warn(...A);
}
function Nt(A, t, e) {
  return Math.min(Math.max(A, t), e);
}
function Vs(A, t, e, n, i, g) {
  const r = i - e, s = g - n;
  if (r !== 0 || s !== 0) {
    const o = ((A - e) * r + (t - n) * s) / (r * r + s * s);
    o > 1 ? (e = i, n = g) : o > 0 && (e += r * o, n += s * o);
  }
  return xe(A, t, e, n);
}
function xe(A, t, e, n) {
  const i = e - A, g = n - t;
  return i * i + g * g;
}
function Xi(A) {
  return A * 180 / Math.PI;
}
function Pe(A) {
  return A * Math.PI / 180;
}
function Tn(A, t) {
  const e = A % t;
  return e * t < 0 ? e + t : e;
}
function Wn(A, t, e) {
  return A + e * (t - A);
}
function Gn(A, t, e) {
  if (A >= t && A < e)
    return A;
  const n = e - t;
  return ((A - t) % n + n) % n + t;
}
function Hs(A, t) {
  return A[0] += +t[0], A[1] += +t[1], A;
}
function VA(A, t) {
  let e = !0;
  for (let n = A.length - 1; n >= 0; --n)
    if (A[n] != t[n]) {
      e = !1;
      break;
    }
  return e;
}
function Vn(A, t) {
  const e = Math.cos(t), n = Math.sin(t), i = A[0] * e - A[1] * n, g = A[1] * e + A[0] * n;
  return A[0] = i, A[1] = g, A;
}
function Ys(A, t) {
  return A[0] *= t, A[1] *= t, A;
}
const Xg = {
  // use the radius of the Normal sphere
  radians: 6370997 / (2 * Math.PI),
  degrees: 2 * Math.PI * 6370997 / 360,
  ft: 0.3048,
  m: 1,
  "us-ft": 1200 / 3937
};
class nA {
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
    return this.metersPerUnit_ || Xg[this.units_];
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
const hA = 6378137, Ee = Math.PI * hA, Ks = [-Ee, -Ee, Ee, Ee], Js = [-180, -85, 180, 85], LA = hA * Math.log(Math.tan(Math.PI / 2));
class we extends nA {
  /**
   * @param {string} code Code.
   */
  constructor(t) {
    super({
      code: t,
      units: "m",
      extent: Ks,
      global: !0,
      worldExtent: Js,
      getPointResolution: function(e, n) {
        return e / Math.cosh(n[1] / hA);
      }
    });
  }
}
const Zi = [
  new we("EPSG:3857"),
  new we("EPSG:102100"),
  new we("EPSG:102113"),
  new we("EPSG:900913"),
  new we("http://www.opengis.net/def/crs/EPSG/0/3857"),
  new we("http://www.opengis.net/gml/srs/epsg.xml#3857")
];
function qs(A, t, e, n) {
  const i = A.length;
  e = e > 1 ? e : 2, n = n ?? e, t === void 0 && (e > 2 ? t = A.slice() : t = new Array(i));
  for (let g = 0; g < i; g += n) {
    t[g] = Ee * A[g] / 180;
    let r = hA * Math.log(Math.tan(Math.PI * (+A[g + 1] + 90) / 360));
    r > LA ? r = LA : r < -LA && (r = -LA), t[g + 1] = r;
  }
  return t;
}
function _s(A, t, e, n) {
  const i = A.length;
  e = e > 1 ? e : 2, n = n ?? e, t === void 0 && (e > 2 ? t = A.slice() : t = new Array(i));
  for (let g = 0; g < i; g += n)
    t[g] = 180 * A[g] / Ee, t[g + 1] = 360 * Math.atan(Math.exp(A[g + 1] / hA)) / Math.PI - 90;
  return t;
}
const $s = 6378137, Li = [-180, -90, 180, 90], to = Math.PI * $s / 180;
class Ie extends nA {
  /**
   * @param {string} code Code.
   * @param {string} [axisOrientation] Axis orientation.
   */
  constructor(t, e) {
    super({
      code: t,
      units: "degrees",
      extent: Li,
      axisOrientation: e,
      global: !0,
      metersPerUnit: to,
      worldExtent: Li
    });
  }
}
const ji = [
  new Ie("CRS:84"),
  new Ie("EPSG:4326", "neu"),
  new Ie("urn:ogc:def:crs:OGC:1.3:CRS84"),
  new Ie("urn:ogc:def:crs:OGC:2:84"),
  new Ie("http://www.opengis.net/def/crs/OGC/1.3/CRS84"),
  new Ie("http://www.opengis.net/gml/srs/epsg.xml#4326", "neu"),
  new Ie("http://www.opengis.net/def/crs/EPSG/0/4326", "neu")
];
let kn = {};
function eo(A) {
  return kn[A] || kn[A.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/, "EPSG:$3")] || null;
}
function Ao(A, t) {
  kn[A] = t;
}
let Se = {};
function iA(A, t, e) {
  const n = A.getCode(), i = t.getCode();
  n in Se || (Se[n] = {}), Se[n][i] = e;
}
function mn(A, t) {
  return A in Se && t in Se[A] ? Se[A][t] : null;
}
const HA = 0.9996, Xt = 669438e-8, tn = Xt * Xt, en = tn * Xt, he = Xt / (1 - Xt), Ni = Math.sqrt(1 - Xt), Te = (1 - Ni) / (1 + Ni), Zg = Te * Te, Hn = Zg * Te, Yn = Hn * Te, Lg = Yn * Te, jg = 1 - Xt / 4 - 3 * tn / 64 - 5 * en / 256, no = 3 * Xt / 8 + 3 * tn / 32 + 45 * en / 1024, io = 15 * tn / 256 + 45 * en / 1024, go = 35 * en / 3072, ro = 3 / 2 * Te - 27 / 32 * Hn + 269 / 512 * Lg, so = 21 / 16 * Zg - 55 / 32 * Yn, oo = 151 / 96 * Hn - 417 / 128 * Lg, Io = 1097 / 512 * Yn, YA = 6378137;
function Co(A, t, e) {
  const n = A - 5e5, r = (e.north ? t : t - 1e7) / HA / (YA * jg), s = r + ro * Math.sin(2 * r) + so * Math.sin(4 * r) + oo * Math.sin(6 * r) + Io * Math.sin(8 * r), o = Math.sin(s), I = o * o, C = Math.cos(s), a = o / C, c = a * a, d = c * c, p = 1 - Xt * I, y = Math.sqrt(1 - Xt * I), E = YA / y, T = (1 - Xt) / p, Z = he * C ** 2, N = Z * Z, F = n / (E * HA), V = F * F, $ = V * F, At = $ * F, tt = At * F, rt = tt * F, st = s - a / T * (V / 2 - At / 24 * (5 + 3 * c + 10 * Z - 4 * N - 9 * he)) + rt / 720 * (61 + 90 * c + 298 * Z + 45 * d - 252 * he - 3 * N);
  let Y = (F - $ / 6 * (1 + 2 * c + Z) + tt / 120 * (5 - 2 * Z + 28 * c - 3 * N + 8 * he + 24 * d)) / C;
  return Y = Gn(
    Y + Pe(Ng(e.number)),
    -Math.PI,
    Math.PI
  ), [Xi(Y), Xi(st)];
}
const zi = -80, Fi = 84, ao = -180, co = 180;
function lo(A, t, e) {
  A = Gn(A, ao, co), t < zi ? t = zi : t > Fi && (t = Fi);
  const n = Pe(t), i = Math.sin(n), g = Math.cos(n), r = i / g, s = r * r, o = s * s, I = Pe(A), C = Ng(e.number), a = Pe(C), c = YA / Math.sqrt(1 - Xt * i ** 2), d = he * g ** 2, p = g * Gn(I - a, -Math.PI, Math.PI), y = p * p, E = y * p, T = E * p, Z = T * p, N = Z * p, F = YA * (jg * n - no * Math.sin(2 * n) + io * Math.sin(4 * n) - go * Math.sin(6 * n)), V = HA * c * (p + E / 6 * (1 - s + d) + Z / 120 * (5 - 18 * s + o + 72 * d - 58 * he)) + 5e5;
  let $ = HA * (F + c * r * (y / 2 + T / 24 * (5 - s + 9 * d + 4 * d ** 2) + N / 720 * (61 - 58 * s + o + 600 * d - 330 * he)));
  return e.north || ($ += 1e7), [V, $];
}
function Ng(A) {
  return (A - 1) * 6 - 180 + 3;
}
const ho = [
  /^EPSG:(\d+)$/,
  /^urn:ogc:def:crs:EPSG::(\d+)$/,
  /^http:\/\/www\.opengis\.net\/def\/crs\/EPSG\/0\/(\d+)$/
];
function zg(A) {
  let t = 0;
  for (const i of ho) {
    const g = A.match(i);
    if (g) {
      t = parseInt(g[1]);
      break;
    }
  }
  if (!t)
    return null;
  let e = 0, n = !1;
  return t > 32700 && t < 32761 ? e = t - 32700 : t > 32600 && t < 32661 && (n = !0, e = t - 32600), e ? { number: e, north: n } : null;
}
function Ui(A, t) {
  return function(e, n, i, g) {
    const r = e.length;
    i = i > 1 ? i : 2, g = g ?? i, n || (i > 2 ? n = e.slice() : n = new Array(r));
    for (let s = 0; s < r; s += g) {
      const o = e[s], I = e[s + 1], C = A(o, I, t);
      n[s] = C[0], n[s + 1] = C[1];
    }
    return n;
  };
}
function uo(A) {
  return zg(A) ? new nA({ code: A, units: "m" }) : null;
}
function fo(A) {
  const t = zg(A.getCode());
  return t ? {
    forward: Ui(lo, t),
    inverse: Ui(Co, t)
  } : null;
}
const mo = [fo], po = [uo];
let On = !0;
function yo(A) {
  On = !1;
}
function Fg(A, t) {
  if (t !== void 0) {
    for (let e = 0, n = A.length; e < n; ++e)
      t[e] = A[e];
    t = t;
  } else
    t = A.slice();
  return t;
}
function Xn(A) {
  Ao(A.getCode(), A), iA(A, A, Fg);
}
function wo(A) {
  A.forEach(Xn);
}
function gA(A) {
  if (typeof A != "string")
    return A;
  const t = eo(A);
  if (t)
    return t;
  for (const e of po) {
    const n = e(A);
    if (n)
      return n;
  }
  return null;
}
function Qi(A) {
  wo(A), A.forEach(function(t) {
    A.forEach(function(e) {
      t !== e && iA(t, e, Fg);
    });
  });
}
function vo(A, t, e, n) {
  A.forEach(function(i) {
    t.forEach(function(g) {
      iA(i, g, e), iA(g, i, n);
    });
  });
}
function Kn(A, t) {
  return A ? typeof A == "string" ? gA(A) : (
    /** @type {Projection} */
    A
  ) : gA(t);
}
function bo(A, t) {
  const e = A.getCode(), n = t.getCode();
  let i = mn(e, n);
  if (i)
    return i;
  let g = null, r = null;
  for (const o of mo)
    g || (g = o(A)), r || (r = o(t));
  if (!g && !r)
    return null;
  const s = "EPSG:4326";
  if (r)
    if (g)
      i = pn(
        g.inverse,
        r.forward
      );
    else {
      const o = mn(e, s);
      o && (i = pn(
        o,
        r.forward
      ));
    }
  else {
    const o = mn(s, n);
    o && (i = pn(
      g.inverse,
      o
    ));
  }
  return i && (Xn(A), Xn(t), iA(A, t, i)), i;
}
function pn(A, t) {
  return function(e, n, i, g) {
    return n = A(e, n, i, g), t(n, n, i, g);
  };
}
function Wi(A, t) {
  const e = gA(A), n = gA(t);
  return bo(e, n);
}
function Vi(A, t) {
  return A;
}
function ne(A, t) {
  return On && !VA(A, [0, 0]) && A[0] >= -180 && A[0] <= 180 && A[1] >= -90 && A[1] <= 90 && (On = !1, Ws(
    "Call useGeographic() from ol/proj once to work with [longitude, latitude] coordinates."
  )), A;
}
function Mo(A, t) {
  return A;
}
function jA(A, t) {
  return A;
}
function Eo() {
  Qi(Zi), Qi(ji), vo(
    ji,
    Zi,
    qs,
    _s
  );
}
Eo();
function ge(A, t) {
  if (!A)
    throw new Error(t);
}
new Array(6);
function Ro() {
  return [1, 0, 0, 1, 0, 0];
}
function xo(A, t, e, n, i, g, r, s) {
  const o = Math.sin(g), I = Math.cos(g);
  return A[0] = n * I, A[1] = i * o, A[2] = -n * o, A[3] = i * I, A[4] = r * n * I - s * n * o + t, A[5] = r * i * o + s * i * I + e, A;
}
function Po(A, t, e, n, i, g, r) {
  g = g || [], r = r || 2;
  let s = 0;
  for (let o = t; o < e; o += n) {
    const I = A[o], C = A[o + 1];
    g[s++] = i[0] * I + i[2] * C + i[4], g[s++] = i[1] * I + i[3] * C + i[5];
    for (let a = 2; a < r; a++)
      g[s++] = A[o + a];
  }
  return g && g.length != s && (g.length = s), g;
}
function Ug(A, t, e, n, i, g, r) {
  r = r || [];
  const s = Math.cos(i), o = Math.sin(i), I = g[0], C = g[1];
  let a = 0;
  for (let c = t; c < e; c += n) {
    const d = A[c] - I, p = A[c + 1] - C;
    r[a++] = I + d * s - p * o, r[a++] = C + d * o + p * s;
    for (let y = c + 2; y < c + n; ++y)
      r[a++] = A[y];
  }
  return r && r.length != a && (r.length = a), r;
}
function So(A, t, e, n, i, g, r, s) {
  s = s || [];
  const o = r[0], I = r[1];
  let C = 0;
  for (let a = t; a < e; a += n) {
    const c = A[a] - o, d = A[a + 1] - I;
    s[C++] = o + i * c, s[C++] = I + g * d;
    for (let p = a + 2; p < a + n; ++p)
      s[C++] = A[p];
  }
  return s && s.length != C && (s.length = C), s;
}
function Do(A, t, e, n, i, g, r) {
  r = r || [];
  let s = 0;
  for (let o = t; o < e; o += n) {
    r[s++] = A[o] + i, r[s++] = A[o + 1] + g;
    for (let I = o + 2; I < o + n; ++I)
      r[s++] = A[I];
  }
  return r && r.length != s && (r.length = s), r;
}
const Hi = Ro(), Bo = [NaN, NaN];
class To extends ke {
  constructor() {
    super(), this.extent_ = Bg(), this.extentRevision_ = -1, this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = 0, this.simplifyTransformedInternal = xs(
      (t, e, n) => {
        if (!n)
          return this.getSimplifiedGeometry(e);
        const i = this.clone();
        return i.applyTransform(n), i.getSimplifiedGeometry(e);
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
    return vt();
  }
  /**
   * @abstract
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   */
  closestPointXY(t, e, n, i) {
    return vt();
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   */
  containsXY(t, e) {
    return this.closestPointXY(t, e, Bo, Number.MIN_VALUE) === 0;
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
    return vt();
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
      (isNaN(e[0]) || isNaN(e[1])) && Tg(e), this.extentRevision_ = this.getRevision();
    }
    return js(this.extent_, t);
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
    vt();
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
    vt();
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
    return vt();
  }
  /**
   * Get the type of this geometry.
   * @abstract
   * @return {Type} Geometry type.
   */
  getType() {
    return vt();
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
    vt();
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   */
  intersectsExtent(t) {
    return vt();
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
    vt();
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
    const n = gA(t), i = n.getUnits() == "tile-pixels" ? function(g, r, s) {
      const o = n.getExtent(), I = n.getWorldExtent(), C = AA(I) / AA(o);
      xo(
        Hi,
        I[0],
        I[3],
        C,
        -C,
        0,
        0,
        0
      );
      const a = Po(
        g,
        0,
        g.length,
        s,
        Hi,
        r
      ), c = Wi(n, e);
      return c ? c(a, a, s) : a;
    } : Wi(n, e);
    return this.applyTransform(i), this;
  }
}
class uA extends To {
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
    return Bs(
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
    return vt();
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
    this.stride = Yi(t), this.layout = t, this.flatCoordinates = e;
  }
  /**
   * @abstract
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  setCoordinates(t, e) {
    vt();
  }
  /**
   * @param {import("./Geometry.js").GeometryLayout|undefined} layout Layout.
   * @param {Array<*>} coordinates Coordinates.
   * @param {number} nesting Nesting.
   * @protected
   */
  setLayout(t, e, n) {
    let i;
    if (t)
      i = Yi(t);
    else {
      for (let g = 0; g < n; ++g) {
        if (e.length === 0) {
          this.layout = "XY", this.stride = 2;
          return;
        }
        e = /** @type {Array<unknown>} */
        e[0];
      }
      i = e.length, t = Go(i);
    }
    this.layout = t, this.stride = i;
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
      const i = this.getStride();
      Ug(
        n,
        0,
        n.length,
        i,
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
    e === void 0 && (e = t), n || (n = WA(this.getExtent()));
    const i = this.getFlatCoordinates();
    if (i) {
      const g = this.getStride();
      So(
        i,
        0,
        i.length,
        g,
        t,
        e,
        n,
        i
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
      const i = this.getStride();
      Do(
        n,
        0,
        n.length,
        i,
        t,
        e,
        n
      ), this.changed();
    }
  }
}
function Go(A) {
  let t;
  return A == 2 ? t = "XY" : A == 3 ? t = "XYZ" : A == 4 && (t = "XYZM"), /** @type {import("./Geometry.js").GeometryLayout} */
  t;
}
function Yi(A) {
  let t;
  return A == "XY" ? t = 2 : A == "XYZ" || A == "XYM" ? t = 3 : A == "XYZM" && (t = 4), /** @type {number} */
  t;
}
function Qg(A, t, e, n) {
  for (let i = 0, g = e.length; i < g; ++i)
    A[t++] = e[i];
  return t;
}
function Jn(A, t, e, n) {
  for (let i = 0, g = e.length; i < g; ++i) {
    const r = e[i];
    for (let s = 0; s < n; ++s)
      A[t++] = r[s];
  }
  return t;
}
function ko(A, t, e, n, i) {
  i = i || [];
  let g = 0;
  for (let r = 0, s = e.length; r < s; ++r) {
    const o = Jn(
      A,
      t,
      e[r],
      n
    );
    i[g++] = o, t = o;
  }
  return i.length = g, i;
}
class qn extends uA {
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
    const t = new qn(
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
  closestPointXY(t, e, n, i) {
    const g = this.flatCoordinates, r = t - g[0], s = e - g[1], o = r * r + s * s;
    if (o < i) {
      if (o === 0)
        for (let I = 0; I < this.stride; ++I)
          n[I] = g[I];
      else {
        const I = this.getRadius() / Math.sqrt(o);
        n[0] = g[0] + I * r, n[1] = g[1] + I * s;
        for (let C = 2; C < this.stride; ++C)
          n[C] = g[C];
      }
      return n.length = this.stride, o;
    }
    return i;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   * @override
   */
  containsXY(t, e) {
    const n = this.flatCoordinates, i = t - n[0], g = e - n[1];
    return i * i + g * g <= this.getRadiusSquared_();
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
    return _A(
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
    if (Qn(t, e)) {
      const n = this.getCenter();
      return t[0] <= n[0] && t[2] >= n[0] || t[1] <= n[1] && t[3] >= n[1] ? !0 : kg(t, this.intersectsCoordinate.bind(this));
    }
    return !1;
  }
  /**
   * Set the center of the circle as {@link module:ol/coordinate~Coordinate coordinate}.
   * @param {import("../coordinate.js").Coordinate} center Center.
   * @api
   */
  setCenter(t) {
    const e = this.stride, n = this.flatCoordinates[e] - this.flatCoordinates[0], i = t.slice();
    i[e] = i[0] + n;
    for (let g = 1; g < e; ++g)
      i[e + g] = t[g];
    this.setFlatCoordinates(this.layout, i), this.changed();
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
    const i = this.flatCoordinates;
    let g = Qg(i, 0, t, this.stride);
    i[g++] = i[0] + e;
    for (let r = 1, s = this.stride; r < s; ++r)
      i[g++] = i[r];
    i.length = g, this.changed();
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
    const n = this.getCenter(), i = this.getStride();
    this.setCenter(
      Ug(n, 0, n.length, i, t, e, n)
    ), this.changed();
  }
}
function Wg(A, t, e, n) {
  let i = 0;
  const g = A[e - n], r = A[e - n + 1];
  let s = 0, o = 0;
  for (; t < e; t += n) {
    const I = A[t] - g, C = A[t + 1] - r;
    i += o * I - s * C, s = I, o = C;
  }
  return i / 2;
}
function Oo(A, t, e, n) {
  let i = 0;
  for (let g = 0, r = e.length; g < r; ++g) {
    const s = e[g];
    i += Wg(A, t, s, n), t = s;
  }
  return i;
}
function Ki(A, t, e, n, i, g, r) {
  const s = A[t], o = A[t + 1], I = A[e] - s, C = A[e + 1] - o;
  let a;
  if (I === 0 && C === 0)
    a = t;
  else {
    const c = ((i - s) * I + (g - o) * C) / (I * I + C * C);
    if (c > 1)
      a = e;
    else if (c > 0) {
      for (let d = 0; d < n; ++d)
        r[d] = Wn(
          A[t + d],
          A[e + d],
          c
        );
      r.length = n;
      return;
    } else
      a = t;
  }
  for (let c = 0; c < n; ++c)
    r[c] = A[a + c];
  r.length = n;
}
function _n(A, t, e, n, i) {
  let g = A[t], r = A[t + 1];
  for (t += n; t < e; t += n) {
    const s = A[t], o = A[t + 1], I = xe(g, r, s, o);
    I > i && (i = I), g = s, r = o;
  }
  return i;
}
function Xo(A, t, e, n, i) {
  for (let g = 0, r = e.length; g < r; ++g) {
    const s = e[g];
    i = _n(A, t, s, n, i), t = s;
  }
  return i;
}
function $n(A, t, e, n, i, g, r, s, o, I, C) {
  if (t == e)
    return I;
  let a, c;
  if (i === 0) {
    if (c = xe(
      r,
      s,
      A[t],
      A[t + 1]
    ), c < I) {
      for (a = 0; a < n; ++a)
        o[a] = A[t + a];
      return o.length = n, c;
    }
    return I;
  }
  C = C || [NaN, NaN];
  let d = t + n;
  for (; d < e; )
    if (Ki(
      A,
      d - n,
      d,
      n,
      r,
      s,
      C
    ), c = xe(r, s, C[0], C[1]), c < I) {
      for (I = c, a = 0; a < n; ++a)
        o[a] = C[a];
      o.length = n, d += n;
    } else
      d += n * Math.max(
        (Math.sqrt(c) - Math.sqrt(I)) / i | 0,
        1
      );
  if (g && (Ki(
    A,
    e - n,
    t,
    n,
    r,
    s,
    C
  ), c = xe(r, s, C[0], C[1]), c < I)) {
    for (I = c, a = 0; a < n; ++a)
      o[a] = C[a];
    o.length = n;
  }
  return I;
}
function Zo(A, t, e, n, i, g, r, s, o, I, C) {
  C = C || [NaN, NaN];
  for (let a = 0, c = e.length; a < c; ++a) {
    const d = e[a];
    I = $n(
      A,
      t,
      d,
      n,
      i,
      g,
      r,
      s,
      o,
      I,
      C
    ), t = d;
  }
  return I;
}
function ti(A, t, e, n, i) {
  i = i !== void 0 ? i : [];
  let g = 0;
  for (let r = t; r < e; r += n)
    i[g++] = A.slice(r, r + n);
  return i.length = g, i;
}
function Lo(A, t, e, n, i) {
  i = i !== void 0 ? i : [];
  let g = 0;
  for (let r = 0, s = e.length; r < s; ++r) {
    const o = e[r];
    i[g++] = ti(
      A,
      t,
      o,
      n,
      i[g]
    ), t = o;
  }
  return i.length = g, i;
}
function Vg(A, t, e, n, i, g, r) {
  const s = (e - t) / n;
  if (s < 3) {
    for (; t < e; t += n)
      g[r++] = A[t], g[r++] = A[t + 1];
    return r;
  }
  const o = new Array(s);
  o[0] = 1, o[s - 1] = 1;
  const I = [t, e - n];
  let C = 0;
  for (; I.length > 0; ) {
    const a = I.pop(), c = I.pop();
    let d = 0;
    const p = A[c], y = A[c + 1], E = A[a], T = A[a + 1];
    for (let Z = c + n; Z < a; Z += n) {
      const N = A[Z], F = A[Z + 1], V = Vs(N, F, p, y, E, T);
      V > d && (C = Z, d = V);
    }
    d > i && (o[(C - t) / n] = 1, c + n < C && I.push(c, C), C + n < a && I.push(C, a));
  }
  for (let a = 0; a < s; ++a)
    o[a] && (g[r++] = A[t + a * n], g[r++] = A[t + a * n + 1]);
  return r;
}
function ve(A, t) {
  return t * Math.round(A / t);
}
function jo(A, t, e, n, i, g, r) {
  if (t == e)
    return r;
  let s = ve(A[t], i), o = ve(A[t + 1], i);
  t += n, g[r++] = s, g[r++] = o;
  let I, C;
  do
    if (I = ve(A[t], i), C = ve(A[t + 1], i), t += n, t == e)
      return g[r++] = I, g[r++] = C, r;
  while (I == s && C == o);
  for (; t < e; ) {
    const a = ve(A[t], i), c = ve(A[t + 1], i);
    if (t += n, a == I && c == C)
      continue;
    const d = I - s, p = C - o, y = a - s, E = c - o;
    if (d * E == p * y && (d < 0 && y < d || d == y || d > 0 && y > d) && (p < 0 && E < p || p == E || p > 0 && E > p)) {
      I = a, C = c;
      continue;
    }
    g[r++] = I, g[r++] = C, s = I, o = C, I = a, C = c;
  }
  return g[r++] = I, g[r++] = C, r;
}
function No(A, t, e, n, i, g, r, s) {
  for (let o = 0, I = e.length; o < I; ++o) {
    const C = e[o];
    r = jo(
      A,
      t,
      C,
      n,
      i,
      g,
      r
    ), s.push(r), t = C;
  }
  return r;
}
class rA extends uA {
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
    return new rA(this.flatCoordinates.slice(), this.layout);
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, n, i) {
    return i < Fn(this.getExtent(), t, e) ? i : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      _n(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), $n(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      this.maxDelta_,
      !0,
      t,
      e,
      n,
      i
    ));
  }
  /**
   * Return the area of the linear ring on projected plane.
   * @return {number} Area (on projected plane).
   * @api
   */
  getArea() {
    return Wg(
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
    return ti(
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
    return e.length = Vg(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      0
    ), new rA(e, "XY");
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
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = Jn(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function zo(A, t, e, n, i, g, r) {
  let s, o;
  const I = (e - t) / n;
  if (I === 1)
    s = t;
  else if (I === 2)
    s = t, o = i;
  else if (I !== 0) {
    let C = A[t], a = A[t + 1], c = 0;
    const d = [0];
    for (let E = t + n; E < e; E += n) {
      const T = A[E], Z = A[E + 1];
      c += Math.sqrt((T - C) * (T - C) + (Z - a) * (Z - a)), d.push(c), C = T, a = Z;
    }
    const p = i * c, y = Ms(d, p);
    y < 0 ? (o = (p - d[-y - 2]) / (d[-y - 1] - d[-y - 2]), s = t + (-y - 2) * n) : s = t + y * n;
  }
  r = r > 1 ? r : 2, g = g || new Array(r);
  for (let C = 0; C < r; ++C)
    g[C] = s === void 0 ? NaN : o === void 0 ? A[s + C] : Wn(A[s + C], A[s + n + C], o);
  return g;
}
function Fo(A, t, e, n, i, g) {
  if (e == t)
    return null;
  let r;
  if (i < A[t + n - 1])
    return g ? (r = A.slice(t, t + n), r[n - 1] = i, r) : null;
  if (A[e - 1] < i)
    return g ? (r = A.slice(e - n, e), r[n - 1] = i, r) : null;
  if (i == A[t + n - 1])
    return A.slice(t, t + n);
  let s = t / n, o = e / n;
  for (; s < o; ) {
    const c = s + o >> 1;
    i < A[(c + 1) * n - 1] ? o = c : s = c + 1;
  }
  const I = A[s * n - 1];
  if (i == I)
    return A.slice((s - 1) * n, (s - 1) * n + n);
  const C = A[(s + 1) * n - 1], a = (i - I) / (C - I);
  r = [];
  for (let c = 0; c < n - 1; ++c)
    r.push(
      Wn(
        A[(s - 1) * n + c],
        A[s * n + c],
        a
      )
    );
  return r.push(i), r;
}
function Uo(A, t, e, n, i) {
  return !kg(
    i,
    /**
     * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
     * @return {boolean} Contains (x, y).
     */
    function(r) {
      return !ue(
        A,
        t,
        e,
        n,
        r[0],
        r[1]
      );
    }
  );
}
function ue(A, t, e, n, i, g) {
  let r = 0, s = A[e - n], o = A[e - n + 1];
  for (; t < e; t += n) {
    const I = A[t], C = A[t + 1];
    o <= g ? C > g && (I - s) * (g - o) - (i - s) * (C - o) > 0 && r++ : C <= g && (I - s) * (g - o) - (i - s) * (C - o) < 0 && r--, s = I, o = C;
  }
  return r !== 0;
}
function Hg(A, t, e, n, i, g) {
  if (e.length === 0 || !ue(A, t, e[0], n, i, g))
    return !1;
  for (let r = 1, s = e.length; r < s; ++r)
    if (ue(A, e[r - 1], e[r], n, i, g))
      return !1;
  return !0;
}
function Yg(A, t, e, n, i) {
  let g;
  for (t += n; t < e; t += n)
    if (g = i(
      A.slice(t - n, t),
      A.slice(t, t + n)
    ), g)
      return g;
  return !1;
}
function ei(A, t, e, n, i, g) {
  return g = g ?? Gg(Bg(), A, t, e, n), Qn(i, g) ? g[0] >= i[0] && g[2] <= i[2] || g[1] >= i[1] && g[3] <= i[3] ? !0 : Yg(
    A,
    t,
    e,
    n,
    /**
     * @param {import("../../coordinate.js").Coordinate} point1 Start point.
     * @param {import("../../coordinate.js").Coordinate} point2 End point.
     * @return {boolean} `true` if the segment and the extent intersect,
     *     `false` otherwise.
     */
    function(r, s) {
      return Ns(i, r, s);
    }
  ) : !1;
}
function Qo(A, t, e, n, i) {
  return !!(ei(A, t, e, n, i) || ue(
    A,
    t,
    e,
    n,
    i[0],
    i[1]
  ) || ue(
    A,
    t,
    e,
    n,
    i[0],
    i[3]
  ) || ue(
    A,
    t,
    e,
    n,
    i[2],
    i[1]
  ) || ue(
    A,
    t,
    e,
    n,
    i[2],
    i[3]
  ));
}
function Wo(A, t, e, n, i) {
  if (!Qo(A, t, e[0], n, i))
    return !1;
  if (e.length === 1)
    return !0;
  for (let g = 1, r = e.length; g < r; ++g)
    if (Uo(
      A,
      e[g - 1],
      e[g],
      n,
      i
    ) && !ei(
      A,
      e[g - 1],
      e[g],
      n,
      i
    ))
      return !1;
  return !0;
}
function Vo(A, t, e, n) {
  let i = A[t], g = A[t + 1], r = 0;
  for (let s = t + n; s < e; s += n) {
    const o = A[s], I = A[s + 1];
    r += Math.sqrt((o - i) * (o - i) + (I - g) * (I - g)), i = o, g = I;
  }
  return r;
}
class KA extends uA {
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
    Pg(this.flatCoordinates, t), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!LineString} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new KA(
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
  closestPointXY(t, e, n, i) {
    return i < Fn(this.getExtent(), t, e) ? i : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      _n(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), $n(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      this.maxDelta_,
      !1,
      t,
      e,
      n,
      i
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
    return Yg(
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
    return this.layout != "XYM" && this.layout != "XYZM" ? null : (e = e !== void 0 ? e : !1, Fo(
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
    return ti(
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
    return zo(
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
    return Vo(
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
    return e.length = Vg(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      0
    ), new KA(e, "XY");
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
    return ei(
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
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = Jn(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
class sA extends uA {
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
    const t = new sA(this.flatCoordinates.slice(), this.layout);
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
  closestPointXY(t, e, n, i) {
    const g = this.flatCoordinates, r = xe(
      t,
      e,
      g[0],
      g[1]
    );
    if (r < i) {
      const s = this.stride;
      for (let o = 0; o < s; ++o)
        n[o] = g[o];
      return n.length = s, r;
    }
    return i;
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
    return Ds(this.flatCoordinates, t);
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
    return Ss(t, this.flatCoordinates[0], this.flatCoordinates[1]);
  }
  /**
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 0), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = Qg(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function Ho(A, t, e, n, i, g, r) {
  let s, o, I, C, a, c, d;
  const p = i[g + 1], y = [];
  for (let Z = 0, N = e.length; Z < N; ++Z) {
    const F = e[Z];
    for (C = A[F - n], c = A[F - n + 1], s = t; s < F; s += n)
      a = A[s], d = A[s + 1], (p <= c && d <= p || c <= p && p <= d) && (I = (p - c) / (d - c) * (a - C) + C, y.push(I)), C = a, c = d;
  }
  let E = NaN, T = -1 / 0;
  for (y.sort(Rg), C = y[0], s = 1, o = y.length; s < o; ++s) {
    a = y[s];
    const Z = Math.abs(a - C);
    Z > T && (I = (C + a) / 2, Hg(A, t, e, n, I, p) && (E = I, T = Z)), C = a;
  }
  return isNaN(E) && (E = i[g]), [E, p, T];
}
function Yo(A, t, e, n) {
  for (; t < e - n; ) {
    for (let i = 0; i < n; ++i) {
      const g = A[t + i];
      A[t + i] = A[e - n + i], A[e - n + i] = g;
    }
    t += n, e -= n;
  }
}
function Kg(A, t, e, n) {
  let i = 0, g = A[e - n], r = A[e - n + 1];
  for (; t < e; t += n) {
    const s = A[t], o = A[t + 1];
    i += (s - g) * (o + r), g = s, r = o;
  }
  return i === 0 ? void 0 : i > 0;
}
function Ko(A, t, e, n, i) {
  i = i !== void 0 ? i : !1;
  for (let g = 0, r = e.length; g < r; ++g) {
    const s = e[g], o = Kg(
      A,
      t,
      s,
      n
    );
    if (g === 0) {
      if (i && o || !i && !o)
        return !1;
    } else if (i && !o || !i && o)
      return !1;
    t = s;
  }
  return !0;
}
function Ji(A, t, e, n, i) {
  i = i !== void 0 ? i : !1;
  for (let g = 0, r = e.length; g < r; ++g) {
    const s = e[g], o = Kg(
      A,
      t,
      s,
      n
    );
    (g === 0 ? i && o || !i && !o : i && !o || !i && o) && Yo(A, t, s, n), t = s;
  }
  return t;
}
class fe extends uA {
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
    this.flatCoordinates ? Pg(this.flatCoordinates, t.getFlatCoordinates()) : this.flatCoordinates = t.getFlatCoordinates().slice(), this.ends_.push(this.flatCoordinates.length), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Polygon} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new fe(
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
  closestPointXY(t, e, n, i) {
    return i < Fn(this.getExtent(), t, e) ? i : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      Xo(
        this.flatCoordinates,
        0,
        this.ends_,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), Zo(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      this.maxDelta_,
      !0,
      t,
      e,
      n,
      i
    ));
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   * @override
   */
  containsXY(t, e) {
    return Hg(
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
    return Oo(
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
    return t !== void 0 ? (e = this.getOrientedFlatCoordinates().slice(), Ji(e, 0, this.ends_, this.stride, t)) : e = this.flatCoordinates, Lo(e, 0, this.ends_, this.stride);
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
      const t = WA(this.getExtent());
      this.flatInteriorPoint_ = Ho(
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
    return new sA(this.getFlatInteriorPoint(), "XYM");
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
    return t < 0 || this.ends_.length <= t ? null : new rA(
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
    const t = this.layout, e = this.flatCoordinates, n = this.ends_, i = [];
    let g = 0;
    for (let r = 0, s = n.length; r < s; ++r) {
      const o = n[r], I = new rA(
        e.slice(g, o),
        t
      );
      i.push(I), g = o;
    }
    return i;
  }
  /**
   * @return {Array<number>} Oriented flat coordinates.
   */
  getOrientedFlatCoordinates() {
    if (this.orientedRevision_ != this.getRevision()) {
      const t = this.flatCoordinates;
      Ko(t, 0, this.ends_, this.stride) ? this.orientedFlatCoordinates_ = t : (this.orientedFlatCoordinates_ = t.slice(), this.orientedFlatCoordinates_.length = Ji(
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
    return e.length = No(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      Math.sqrt(t),
      e,
      0,
      n
    ), new fe(e, "XY", n);
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
    return Wo(
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
    const n = ko(
      this.flatCoordinates,
      0,
      t,
      this.stride,
      this.ends_
    );
    this.flatCoordinates.length = n.length === 0 ? 0 : n[n.length - 1], this.changed();
  }
}
function qi(A) {
  if (Og(A))
    throw new Error("Cannot create polygon from empty extent");
  const t = A[0], e = A[1], n = A[2], i = A[3], g = [
    t,
    e,
    t,
    i,
    n,
    i,
    n,
    e,
    t,
    e
  ];
  return new fe(g, "XY", [g.length]);
}
class Ge extends bg(hg) {
  constructor(t = {}) {
    const e = Mg(t);
    if (super(e), t.mapID && (this.mapID = t.mapID), t.mapID === "morioka_ndl_affine") {
      const n = this.getTileUrlFunction();
      this.setTileUrlFunction((i, g, r) => n(i, g, r));
    }
    this.initialize(t);
  }
}
class oA extends Ge {
  constructor(e = {}) {
    super(e);
    M(this, "style", "");
    M(this, "accessToken", "");
    M(this, "mapboxMap");
    this.style = e.style, this.mapboxMap = e.mapboxMap, this.accessToken = e.accessToken;
  }
}
M(oA, "isMapbox_", !0);
class IA extends Ge {
  constructor(e = {}) {
    super(e);
    M(this, "style", "");
    M(this, "maplibreMap");
    this.style = e.style || "https://tile.openstreetmap.jp/styles/osm-bright/style.json", this.maplibreMap = e.maplibreMap;
  }
}
M(IA, "isMapLibre_", !0);
class Zn extends bg(Wr) {
  constructor(t = {}) {
    const e = Object.assign({}, t);
    e.mapType = t.maptype.match(/^google_(.+)$/) ? RegExp.$1 : "roadmap", e.layerTypes = (t.layers || []).map((n) => `layer${n.charAt(0).toUpperCase()}${n.slice(1).toLowerCase()}`), super(e), t.mapID && (this.mapID = t.mapID), this.initialize(t);
  }
}
const ie = {
  ANIMATING: 0,
  INTERACTING: 1
}, jt = {
  CENTER: "center",
  RESOLUTION: "resolution",
  ROTATION: "rotation"
};
function _i(A, t, e) {
  return (
    /**
     * @param {import("./coordinate.js").Coordinate|undefined} center Center.
     * @param {number|undefined} resolution Resolution.
     * @param {import("./size.js").Size} size Viewport size; unused if `onlyCenter` was specified.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @param {Array<number>} [centerShift] Shift between map center and viewport center.
     * @return {import("./coordinate.js").Coordinate|undefined} Center.
     */
    (function(n, i, g, r, s) {
      if (!n)
        return;
      if (!i && !t)
        return n;
      const o = t ? 0 : g[0] * i, I = t ? 0 : g[1] * i, C = s ? s[0] : 0, a = s ? s[1] : 0;
      let c = A[0] + o / 2 + C, d = A[2] - o / 2 + C, p = A[1] + I / 2 + a, y = A[3] - I / 2 + a;
      c > d && (c = (d + c) / 2, d = c), p > y && (p = (y + p) / 2, y = p);
      let E = Nt(n[0], c, d), T = Nt(n[1], p, y);
      if (r && e && i) {
        const Z = 30 * i;
        E += -Z * Math.log(1 + Math.max(0, c - n[0]) / Z) + Z * Math.log(1 + Math.max(0, n[0] - d) / Z), T += -Z * Math.log(1 + Math.max(0, p - n[1]) / Z) + Z * Math.log(1 + Math.max(0, n[1] - y) / Z);
      }
      return [E, T];
    })
  );
}
function Jo(A) {
  return A;
}
function qo(A) {
  return Math.pow(A, 3);
}
function An(A) {
  return 1 - qo(1 - A);
}
function _o(A) {
  return 3 * A * A - 2 * A * A * A;
}
function $o(A) {
  return A;
}
function Ai(A, t, e, n) {
  const i = Un(t) / e[0], g = AA(t) / e[1];
  return n ? Math.min(A, Math.max(i, g)) : Math.min(A, Math.min(i, g));
}
function ni(A, t, e) {
  let n = Math.min(A, t);
  const i = 50;
  return n *= Math.log(1 + i * Math.max(0, A / t - 1)) / i + 1, e && (n = Math.max(n, e), n /= Math.log(1 + i * Math.max(0, e / A - 1)) / i + 1), Nt(n, e / 2, t * 2);
}
function tI(A, t, e, n) {
  return t = t !== void 0 ? t : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(i, g, r, s) {
    if (i !== void 0) {
      const o = A[0], I = A[A.length - 1], C = e ? Ai(
        o,
        e,
        r,
        n
      ) : o;
      if (s)
        return t ? ni(
          i,
          C,
          I
        ) : Nt(i, I, C);
      const a = Math.min(C, i), c = Math.floor(xg(A, a, g));
      return A[c] > C && c < A.length - 1 ? A[c + 1] : A[c];
    }
  });
}
function eI(A, t, e, n, i, g) {
  return n = n !== void 0 ? n : !0, e = e !== void 0 ? e : 0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(r, s, o, I) {
    if (r !== void 0) {
      const C = i ? Ai(
        t,
        i,
        o,
        g
      ) : t;
      if (I)
        return n ? ni(
          r,
          C,
          e
        ) : Nt(r, e, C);
      const a = 1e-9, c = Math.ceil(
        Math.log(t / C) / Math.log(A) - a
      ), d = -s * (0.5 - a) + 0.5, p = Math.min(C, r), y = Math.floor(
        Math.log(t / p) / Math.log(A) + d
      ), E = Math.max(c, y), T = t / Math.pow(A, E);
      return Nt(T, e, C);
    }
  });
}
function $i(A, t, e, n, i) {
  return e = e !== void 0 ? e : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(g, r, s, o) {
    if (g !== void 0) {
      const I = n ? Ai(
        A,
        n,
        s,
        i
      ) : A;
      return !e || !o ? Nt(g, t, I) : ni(
        g,
        I,
        t
      );
    }
  });
}
function ii(A) {
  if (A !== void 0)
    return 0;
}
function tg(A) {
  if (A !== void 0)
    return A;
}
function AI(A) {
  const t = 2 * Math.PI / A;
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
function nI(A) {
  const t = Pe(5);
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
const iI = 256, yn = 0;
class eg extends ke {
  /**
   * @param {ViewOptions} [options] View options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = Object.assign({}, t), this.hints_ = [0, 0], this.animations_ = [], this.updateAnimationKey_, this.projection_ = Kn(t.projection, "EPSG:3857"), this.viewportSize_ = [100, 100], this.targetCenter_ = null, this.targetResolution_, this.targetRotation_, this.nextCenter_ = null, this.nextResolution_, this.nextRotation_, this.cancelAnchor_ = void 0, t.projection && yo(), t.center && (t.center = ne(t.center, this.projection_)), t.extent && (t.extent = jA(t.extent, this.projection_)), this.applyOptions_(t);
  }
  /**
   * Set up the view with the given options.
   * @param {ViewOptions} options View options.
   */
  applyOptions_(t) {
    const e = Object.assign({}, t);
    for (const s in jt)
      delete e[s];
    this.setProperties(e, !0);
    const n = rI(t);
    this.maxResolution_ = n.maxResolution, this.minResolution_ = n.minResolution, this.zoomFactor_ = n.zoomFactor, this.resolutions_ = t.resolutions, this.padding_ = t.padding, this.minZoom_ = n.minZoom;
    const i = gI(t), g = n.constraint, r = sI(t);
    this.constraints_ = {
      center: i,
      resolution: g,
      rotation: r
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
      const i = t || [0, 0, 0, 0];
      e = e || [0, 0, 0, 0];
      const g = this.getResolution(), r = g / 2 * (i[3] - e[3] + e[1] - i[1]), s = g / 2 * (i[0] - e[0] + e[2] - i[2]);
      this.setCenterInternal([n[0] + r, n[1] - s]);
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
      let i = arguments[n];
      i.center && (i = Object.assign({}, i), i.center = ne(
        i.center,
        this.getProjection()
      )), i.anchor && (i = Object.assign({}, i), i.anchor = ne(
        i.anchor,
        this.getProjection()
      )), e[n] = i;
    }
    this.animateInternal.apply(this, e);
  }
  /**
   * @param {...(AnimationOptions|function(boolean): void)} var_args Animation options.
   */
  animateInternal(t) {
    let e = arguments.length, n;
    e > 1 && typeof arguments[e - 1] == "function" && (n = arguments[e - 1], --e);
    let i = 0;
    for (; i < e && !this.isDef(); ++i) {
      const C = arguments[i];
      C.center && this.setCenterInternal(C.center), C.zoom !== void 0 ? this.setZoom(C.zoom) : C.resolution && this.setResolution(C.resolution), C.rotation !== void 0 && this.setRotation(C.rotation);
    }
    if (i === e) {
      n && NA(n, !0);
      return;
    }
    let g = Date.now(), r = this.targetCenter_.slice(), s = this.targetResolution_, o = this.targetRotation_;
    const I = [];
    for (; i < e; ++i) {
      const C = (
        /** @type {AnimationOptions} */
        arguments[i]
      ), a = {
        start: g,
        complete: !1,
        anchor: C.anchor,
        duration: C.duration !== void 0 ? C.duration : 1e3,
        easing: C.easing || _o,
        callback: n
      };
      if (C.center && (a.sourceCenter = r, a.targetCenter = C.center.slice(), r = a.targetCenter), C.zoom !== void 0 ? (a.sourceResolution = s, a.targetResolution = this.getResolutionForZoom(C.zoom), s = a.targetResolution) : C.resolution && (a.sourceResolution = s, a.targetResolution = C.resolution, s = a.targetResolution), C.rotation !== void 0) {
        a.sourceRotation = o;
        const c = Tn(C.rotation - o + Math.PI, 2 * Math.PI) - Math.PI;
        a.targetRotation = o + c, o = a.targetRotation;
      }
      oI(a) ? a.complete = !0 : g += a.duration, I.push(a);
    }
    this.animations_.push(I), this.setHint(ie.ANIMATING, 1), this.updateAnimations_();
  }
  /**
   * Determine if the view is being animated.
   * @return {boolean} The view is being animated.
   * @api
   */
  getAnimating() {
    return this.hints_[ie.ANIMATING] > 0;
  }
  /**
   * Determine if the user is interacting with the view, such as panning or zooming.
   * @return {boolean} The view is being interacted with.
   * @api
   */
  getInteracting() {
    return this.hints_[ie.INTERACTING] > 0;
  }
  /**
   * Cancel any ongoing animations.
   * @api
   */
  cancelAnimations() {
    this.setHint(ie.ANIMATING, -this.hints_[ie.ANIMATING]);
    let t;
    for (let e = 0, n = this.animations_.length; e < n; ++e) {
      const i = this.animations_[e];
      if (i[0].callback && NA(i[0].callback, !1), !t)
        for (let g = 0, r = i.length; g < r; ++g) {
          const s = i[g];
          if (!s.complete) {
            t = s.anchor;
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
      const i = this.animations_[n];
      let g = !0;
      for (let r = 0, s = i.length; r < s; ++r) {
        const o = i[r];
        if (o.complete)
          continue;
        const I = t - o.start;
        let C = o.duration > 0 ? I / o.duration : 1;
        C >= 1 ? (o.complete = !0, C = 1) : g = !1;
        const a = o.easing(C);
        if (o.sourceCenter) {
          const c = o.sourceCenter[0], d = o.sourceCenter[1], p = o.targetCenter[0], y = o.targetCenter[1];
          this.nextCenter_ = o.targetCenter;
          const E = c + a * (p - c), T = d + a * (y - d);
          this.targetCenter_ = [E, T];
        }
        if (o.sourceResolution && o.targetResolution) {
          const c = a === 1 ? o.targetResolution : o.sourceResolution + a * (o.targetResolution - o.sourceResolution);
          if (o.anchor) {
            const d = this.getViewportSize_(this.getRotation()), p = this.constraints_.resolution(
              c,
              0,
              d,
              !0
            );
            this.targetCenter_ = this.calculateCenterZoom(
              p,
              o.anchor
            );
          }
          this.nextResolution_ = o.targetResolution, this.targetResolution_ = c, this.applyTargetState_(!0);
        }
        if (o.sourceRotation !== void 0 && o.targetRotation !== void 0) {
          const c = a === 1 ? Tn(o.targetRotation + Math.PI, 2 * Math.PI) - Math.PI : o.sourceRotation + a * (o.targetRotation - o.sourceRotation);
          if (o.anchor) {
            const d = this.constraints_.rotation(
              c,
              !0
            );
            this.targetCenter_ = this.calculateCenterRotate(
              d,
              o.anchor
            );
          }
          this.nextRotation_ = o.targetRotation, this.targetRotation_ = c;
        }
        if (this.applyTargetState_(!0), e = !0, !o.complete)
          break;
      }
      if (g) {
        this.animations_[n] = null, this.setHint(ie.ANIMATING, -1), this.nextCenter_ = null, this.nextResolution_ = NaN, this.nextRotation_ = NaN;
        const r = i[0].callback;
        r && NA(r, !0);
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
    const i = this.getCenterInternal();
    return i !== void 0 && (n = [i[0] - e[0], i[1] - e[1]], Vn(n, t - this.getRotation()), Hs(n, e)), n;
  }
  /**
   * @param {number} resolution Target resolution.
   * @param {import("./coordinate.js").Coordinate} anchor Zoom anchor.
   * @return {import("./coordinate.js").Coordinate|undefined} Center for resolution and anchor.
   */
  calculateCenterZoom(t, e) {
    let n;
    const i = this.getCenterInternal(), g = this.getResolution();
    if (i !== void 0 && g !== void 0) {
      const r = e[0] - t * (e[0] - i[0]) / g, s = e[1] - t * (e[1] - i[1]) / g;
      n = [r, s];
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
      const n = e[0], i = e[1];
      return [
        Math.abs(n * Math.cos(t)) + Math.abs(i * Math.sin(t)),
        Math.abs(n * Math.sin(t)) + Math.abs(i * Math.cos(t))
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
    return t && Vi(t, this.getProjection());
  }
  /**
   * Get the view center without transforming to user projection.
   * @return {import("./coordinate.js").Coordinate|undefined} The center of the view.
   */
  getCenterInternal() {
    return (
      /** @type {import("./coordinate.js").Coordinate|undefined} */
      this.get(jt.CENTER)
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
    return Mo(e, this.getProjection());
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
    ge(e, "The view center is not defined");
    const n = (
      /** @type {!number} */
      this.getResolution()
    );
    ge(n !== void 0, "The view resolution is not defined");
    const i = (
      /** @type {!number} */
      this.getRotation()
    );
    return ge(i !== void 0, "The view rotation is not defined"), Os(e, n, i, t);
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
      this.get(jt.RESOLUTION)
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
      jA(t, this.getProjection()),
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
    const n = Un(t) / e[0], i = AA(t) / e[1];
    return Math.max(n, i);
  }
  /**
   * Return a function that returns a value between 0 and 1 for a
   * resolution. Exponential scaling is assumed.
   * @param {number} [power] Power.
   * @return {function(number): number} Resolution for value function.
   */
  getResolutionForValueFunction(t) {
    t = t || 2;
    const e = this.getConstrainedResolution(this.maxResolution_), n = this.minResolution_, i = Math.log(e / n) / Math.log(t);
    return (
      /**
       * @param {number} value Value.
       * @return {number} Resolution.
       */
      (function(g) {
        return e / Math.pow(t, g * i);
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
      this.get(jt.ROTATION)
    );
  }
  /**
   * Return a function that returns a resolution for a value between
   * 0 and 1. Exponential scaling is assumed.
   * @param {number} [power] Power.
   * @return {function(number): number} Value for resolution function.
   */
  getValueForResolutionFunction(t) {
    const e = Math.log(t || 2), n = this.getConstrainedResolution(this.maxResolution_), i = this.minResolution_, g = Math.log(n / i) / e;
    return (
      /**
       * @param {number} resolution Resolution.
       * @return {number} Value.
       */
      (function(r) {
        return Math.log(n / r) / e / g;
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
    let i = (
      /** @type {import("./coordinate.js").Coordinate} */
      this.getCenterInternal()
    );
    const g = this.padding_;
    if (g) {
      const r = this.getViewportSizeMinusPadding_();
      i = wn(
        i,
        this.getViewportSize_(),
        [r[0] / 2 + g[3], r[1] / 2 + g[0]],
        e,
        n
      );
    }
    return {
      center: i.slice(0),
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
    let e = this.minZoom_ || 0, n, i;
    if (this.resolutions_) {
      const g = xg(this.resolutions_, t, 1);
      e = g, n = this.resolutions_[g], g == this.resolutions_.length - 1 ? i = 2 : i = n / this.resolutions_[g + 1];
    } else
      n = this.maxResolution_, i = this.zoomFactor_;
    return e + Math.log(n / t) / Math.log(i);
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
      const n = Nt(
        Math.floor(t),
        0,
        this.resolutions_.length - 2
      ), i = this.resolutions_[n] / this.resolutions_[n + 1];
      return this.resolutions_[n] / Math.pow(i, Nt(t - n, 0, 1));
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
    if (ge(
      Array.isArray(t) || typeof /** @type {?} */
      t.getSimplifiedGeometry == "function",
      "Invalid extent or geometry provided as `geometry`"
    ), Array.isArray(t)) {
      ge(
        !Og(t),
        "Cannot fit empty extent provided as `geometry`"
      );
      const i = jA(t, this.getProjection());
      n = qi(i);
    } else if (t.getType() === "Circle") {
      const i = jA(
        t.getExtent(),
        this.getProjection()
      );
      n = qi(i), n.rotate(this.getRotation(), WA(i));
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
    const e = this.getRotation(), n = Math.cos(e), i = Math.sin(-e), g = t.getFlatCoordinates(), r = t.getStride();
    let s = 1 / 0, o = 1 / 0, I = -1 / 0, C = -1 / 0;
    for (let a = 0, c = g.length; a < c; a += r) {
      const d = g[a] * n - g[a + 1] * i, p = g[a] * i + g[a + 1] * n;
      s = Math.min(s, d), o = Math.min(o, p), I = Math.max(I, d), C = Math.max(C, p);
    }
    return [s, o, I, C];
  }
  /**
   * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
   * @param {FitOptions} [options] Options.
   */
  fitInternal(t, e) {
    e = e || {};
    let n = e.size;
    n || (n = this.getViewportSizeMinusPadding_());
    const i = e.padding !== void 0 ? e.padding : [0, 0, 0, 0], g = e.nearest !== void 0 ? e.nearest : !1;
    let r;
    e.minResolution !== void 0 ? r = e.minResolution : e.maxZoom !== void 0 ? r = this.getResolutionForZoom(e.maxZoom) : r = 0;
    const s = this.rotatedExtentForGeometry(t);
    let o = this.getResolutionForExtentInternal(s, [
      n[0] - i[1] - i[3],
      n[1] - i[0] - i[2]
    ]);
    o = isNaN(o) ? r : Math.max(o, r), o = this.getConstrainedResolution(o, g ? 0 : 1);
    const I = this.getRotation(), C = Math.sin(I), a = Math.cos(I), c = WA(s);
    c[0] += (i[1] - i[3]) / 2 * o, c[1] += (i[0] - i[2]) / 2 * o;
    const d = c[0] * a - c[1] * C, p = c[1] * a + c[0] * C, y = this.getConstrainedCenter([d, p], o), E = e.callback ? e.callback : Bn;
    e.duration !== void 0 ? this.animateInternal(
      {
        resolution: o,
        center: y,
        duration: e.duration,
        easing: e.easing
      },
      E
    ) : (this.targetResolution_ = o, this.targetCenter_ = y, this.applyTargetState_(!1, !0), NA(E, !0));
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
      ne(t, this.getProjection()),
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
      wn(
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
  calculateCenterShift(t, e, n, i) {
    let g;
    const r = this.padding_;
    if (r && t) {
      const s = this.getViewportSizeMinusPadding_(-n), o = wn(
        t,
        i,
        [s[0] / 2 + r[3], s[1] / 2 + r[0]],
        e,
        n
      );
      g = [
        t[0] - o[0],
        t[1] - o[1]
      ];
    }
    return g;
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
    const e = Vi(this.targetCenter_, this.getProjection());
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
    e = e && ne(e, this.getProjection()), this.adjustResolutionInternal(t, e);
  }
  /**
   * Multiply the view resolution by a ratio, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} ratio The ratio to apply on the view resolution.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  adjustResolutionInternal(t, e) {
    const n = this.getAnimating() || this.getInteracting(), i = this.getViewportSize_(this.getRotation()), g = this.constraints_.resolution(
      this.targetResolution_ * t,
      0,
      i,
      n
    );
    e && (this.targetCenter_ = this.calculateCenterZoom(g, e)), this.targetResolution_ *= t, this.applyTargetState_();
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
    e && (e = ne(e, this.getProjection())), this.adjustRotationInternal(t, e);
  }
  /**
   * @param {number} delta Relative value to add to the zoom rotation, in radians.
   * @param {import("./coordinate.js").Coordinate} [anchor] The rotation center.
   */
  adjustRotationInternal(t, e) {
    const n = this.getAnimating() || this.getInteracting(), i = this.constraints_.rotation(
      this.targetRotation_ + t,
      n
    );
    e && (this.targetCenter_ = this.calculateCenterRotate(i, e)), this.targetRotation_ += t, this.applyTargetState_();
  }
  /**
   * Set the center of the current view. Any extent constraint will apply.
   * @param {import("./coordinate.js").Coordinate|undefined} center The center of the view.
   * @observable
   * @api
   */
  setCenter(t) {
    this.setCenterInternal(
      t && ne(t, this.getProjection())
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
    const n = this.getAnimating() || this.getInteracting() || e, i = this.constraints_.rotation(
      this.targetRotation_,
      n
    ), g = this.getViewportSize_(i), r = this.constraints_.resolution(
      this.targetResolution_,
      0,
      g,
      n
    ), s = this.constraints_.center(
      this.targetCenter_,
      r,
      g,
      n,
      this.calculateCenterShift(
        this.targetCenter_,
        r,
        i,
        g
      )
    );
    this.get(jt.ROTATION) !== i && this.set(jt.ROTATION, i), this.get(jt.RESOLUTION) !== r && (this.set(jt.RESOLUTION, r), this.set("zoom", this.getZoom(), !0)), (!s || !this.get(jt.CENTER) || !VA(this.get(jt.CENTER), s)) && this.set(jt.CENTER, s), this.getAnimating() && !t && this.cancelAnimations(), this.cancelAnchor_ = void 0;
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
    const i = e || 0, g = this.constraints_.rotation(this.targetRotation_), r = this.getViewportSize_(g), s = this.constraints_.resolution(
      this.targetResolution_,
      i,
      r
    ), o = this.constraints_.center(
      this.targetCenter_,
      s,
      r,
      !1,
      this.calculateCenterShift(
        this.targetCenter_,
        s,
        g,
        r
      )
    );
    if (t === 0 && !this.cancelAnchor_) {
      this.targetResolution_ = s, this.targetRotation_ = g, this.targetCenter_ = o, this.applyTargetState_();
      return;
    }
    n = n || (t === 0 ? this.cancelAnchor_ : void 0), this.cancelAnchor_ = void 0, (this.getResolution() !== s || this.getRotation() !== g || !this.getCenterInternal() || !VA(this.getCenterInternal(), o)) && (this.getAnimating() && this.cancelAnimations(), this.animateInternal({
      rotation: g,
      center: o,
      resolution: s,
      duration: t,
      easing: An,
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
    this.resolveConstraints(0), this.setHint(ie.INTERACTING, 1);
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
    n = n && ne(n, this.getProjection()), this.endInteractionInternal(t, e, n);
  }
  /**
   * Notify the View that an interaction has ended. The view state will be resolved
   * to a stable one if needed (depending on its constraints).
   * @param {number} [duration] Animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  endInteractionInternal(t, e, n) {
    this.getInteracting() && (this.setHint(ie.INTERACTING, -1), this.resolveConstraints(t, e, n));
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
function NA(A, t) {
  setTimeout(function() {
    A(t);
  }, 0);
}
function gI(A) {
  if (A.extent !== void 0) {
    const e = A.smoothExtentConstraint !== void 0 ? A.smoothExtentConstraint : !0;
    return _i(A.extent, A.constrainOnlyCenter, e);
  }
  const t = Kn(A.projection, "EPSG:3857");
  if (A.multiWorld !== !0 && t.isGlobal()) {
    const e = t.getExtent().slice();
    return e[0] = -1 / 0, e[2] = 1 / 0, _i(e, !1, !1);
  }
  return Jo;
}
function rI(A) {
  let t, e, n, r = A.minZoom !== void 0 ? A.minZoom : yn, s = A.maxZoom !== void 0 ? A.maxZoom : 28;
  const o = A.zoomFactor !== void 0 ? A.zoomFactor : 2, I = A.multiWorld !== void 0 ? A.multiWorld : !1, C = A.smoothResolutionConstraint !== void 0 ? A.smoothResolutionConstraint : !0, a = A.showFullExtent !== void 0 ? A.showFullExtent : !1, c = Kn(A.projection, "EPSG:3857"), d = c.getExtent();
  let p = A.constrainOnlyCenter, y = A.extent;
  if (!I && !y && c.isGlobal() && (p = !1, y = d), A.resolutions !== void 0) {
    const E = A.resolutions;
    e = E[r], n = E[s] !== void 0 ? E[s] : E[E.length - 1], A.constrainResolution ? t = tI(
      E,
      C,
      !p && y,
      a
    ) : t = $i(
      e,
      n,
      C,
      !p && y,
      a
    );
  } else {
    const T = (d ? Math.max(Un(d), AA(d)) : (
      // use an extent that can fit the whole world if need be
      360 * Xg.degrees / c.getMetersPerUnit()
    )) / iI / Math.pow(2, yn), Z = T / Math.pow(2, 28 - yn);
    e = A.maxResolution, e !== void 0 ? r = 0 : e = T / Math.pow(o, r), n = A.minResolution, n === void 0 && (A.maxZoom !== void 0 ? A.maxResolution !== void 0 ? n = e / Math.pow(o, s) : n = T / Math.pow(o, s) : n = Z), s = r + Math.floor(
      Math.log(e / n) / Math.log(o)
    ), n = e / Math.pow(o, s - r), A.constrainResolution ? t = eI(
      o,
      e,
      n,
      C,
      !p && y,
      a
    ) : t = $i(
      e,
      n,
      C,
      !p && y,
      a
    );
  }
  return {
    constraint: t,
    maxResolution: e,
    minResolution: n,
    minZoom: r,
    zoomFactor: o
  };
}
function sI(A) {
  if (A.enableRotation !== void 0 ? A.enableRotation : !0) {
    const e = A.constrainRotation;
    return e === void 0 || e === !0 ? nI() : e === !1 ? tg : typeof e == "number" ? AI(e) : tg;
  }
  return ii;
}
function oI(A) {
  return !(A.sourceCenter && A.targetCenter && !VA(A.sourceCenter, A.targetCenter) || A.sourceResolution !== A.targetResolution || A.sourceRotation !== A.targetRotation);
}
function wn(A, t, e, n, i) {
  const g = Math.cos(-i);
  let r = Math.sin(-i), s = A[0] * g - A[1] * r, o = A[1] * g + A[0] * r;
  s += (t[0] / 2 - e[0]) * n, o += (e[1] - t[1] / 2) * n, r = -r;
  const I = s * g - o * r, C = o * g + s * r;
  return [I, C];
}
const II = {
  /**
   * Triggered before layers are composed.  When dispatched by the map, the event object will not have
   * a `context` set.  When dispatched by a layer, the event object will have a `context` set.  Only
   * WebGL layers currently dispatch this event.
   * @event module:ol/render/Event~RenderEvent#precompose
   * @api
   */
  PRECOMPOSE: "precompose"
}, _ = {
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
class CI extends ke {
  /**
   * @param {Options} options Layer options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, this.background_ = t.background;
    const e = Object.assign({}, t);
    typeof t.properties == "object" && (delete e.properties, Object.assign(e, t.properties)), e[_.OPACITY] = t.opacity !== void 0 ? t.opacity : 1, ge(
      typeof e[_.OPACITY] == "number",
      "Layer opacity must be a number"
    ), e[_.VISIBLE] = t.visible !== void 0 ? t.visible : !0, e[_.Z_INDEX] = t.zIndex, e[_.MAX_RESOLUTION] = t.maxResolution !== void 0 ? t.maxResolution : 1 / 0, e[_.MIN_RESOLUTION] = t.minResolution !== void 0 ? t.minResolution : 0, e[_.MIN_ZOOM] = t.minZoom !== void 0 ? t.minZoom : -1 / 0, e[_.MAX_ZOOM] = t.maxZoom !== void 0 ? t.maxZoom : 1 / 0, this.className_ = e.className !== void 0 ? e.className : "ol-layer", delete e.className, this.setProperties(e), this.state_ = null;
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
    return e.opacity = Nt(Math.round(this.getOpacity() * 100) / 100, 0, 1), e.visible = this.getVisible(), e.extent = this.getExtent(), e.zIndex = n === void 0 && !e.managed ? 1 / 0 : n, e.maxResolution = this.getMaxResolution(), e.minResolution = Math.max(this.getMinResolution(), 0), e.minZoom = this.getMinZoom(), e.maxZoom = this.getMaxZoom(), this.state_ = e, e;
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").default>} [array] Array of layers (to be
   *     modified in place).
   * @return {Array<import("./Layer.js").default>} Array of layers.
   */
  getLayersArray(t) {
    return vt();
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").State>} [states] Optional list of layer
   *     states (to be modified in place).
   * @return {Array<import("./Layer.js").State>} List of layer states.
   */
  getLayerStatesArray(t) {
    return vt();
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
      this.get(_.EXTENT)
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
      this.get(_.MAX_RESOLUTION)
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
      this.get(_.MIN_RESOLUTION)
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
      this.get(_.MIN_ZOOM)
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
      this.get(_.MAX_ZOOM)
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
      this.get(_.OPACITY)
    );
  }
  /**
   * @abstract
   * @return {import("../source/Source.js").State} Source state.
   */
  getSourceState() {
    return vt();
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
      this.get(_.VISIBLE)
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
      this.get(_.Z_INDEX)
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
    this.set(_.EXTENT, t);
  }
  /**
   * Set the maximum resolution at which the layer is visible.
   * @param {number} maxResolution The maximum resolution of the layer.
   * @observable
   * @api
   */
  setMaxResolution(t) {
    this.set(_.MAX_RESOLUTION, t);
  }
  /**
   * Set the minimum resolution at which the layer is visible.
   * @param {number} minResolution The minimum resolution of the layer.
   * @observable
   * @api
   */
  setMinResolution(t) {
    this.set(_.MIN_RESOLUTION, t);
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
    this.set(_.MAX_ZOOM, t);
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
    this.set(_.MIN_ZOOM, t);
  }
  /**
   * Set the opacity of the layer, allowed values range from 0 to 1.
   * @param {number} opacity The opacity of the layer.
   * @observable
   * @api
   */
  setOpacity(t) {
    ge(typeof t == "number", "Layer opacity must be a number"), this.set(_.OPACITY, t);
  }
  /**
   * Set the visibility of the layer (`true` or `false`).
   * @param {boolean} visible The visibility of the layer.
   * @observable
   * @api
   */
  setVisible(t) {
    this.set(_.VISIBLE, t);
  }
  /**
   * Set Z-index of the layer, which is used to order layers before rendering.
   * The default Z-index is 0.
   * @param {number} zindex The z-index of the layer.
   * @observable
   * @api
   */
  setZIndex(t) {
    this.set(_.Z_INDEX, t);
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.state_ && (this.state_.layer = null, this.state_ = null), super.disposeInternal();
  }
}
class Jg extends CI {
  /**
   * @param {Options<SourceType>} options Layer options.
   */
  constructor(t) {
    const e = Object.assign({}, t);
    delete e.source, super(e), this.on, this.once, this.un, this.mapPrecomposeKey_ = null, this.mapRenderKey_ = null, this.sourceChangeKey_ = null, this.renderer_ = null, this.sourceReady_ = !1, this.rendered = !1, t.render && (this.render = t.render), t.map && this.setMap(t.map), this.addChangeListener(
      _.SOURCE,
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
      this.get(_.SOURCE) || null
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
    this.sourceChangeKey_ && (_e(this.sourceChangeKey_), this.sourceChangeKey_ = null), this.sourceReady_ = !1;
    const t = this.getSource();
    t && (this.sourceChangeKey_ = Re(
      t,
      re.CHANGE,
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
    !t && n && (t = n.getView()), t instanceof eg ? e = {
      viewState: t.getState(),
      extent: t.calculateExtent()
    } : e = t, !e.layerStatesArray && n && (e.layerStatesArray = n.getLayerGroup().getLayerStatesArray());
    let i;
    if (e.layerStatesArray) {
      if (i = e.layerStatesArray.find(
        (r) => r.layer === this
      ), !i)
        return !1;
    } else
      i = this.getLayerState();
    const g = this.getExtent();
    return aI(i, e.viewState) && (!g || Qn(g, e.extent));
  }
  /**
   * Get the attributions of the source of this layer for the given view.
   * @param {View|import("../View.js").ViewStateLayerStateExtent} [view] View or {@link import("../Map.js").FrameState}.
   * Only required when the layer is not added to a map.
   * @return {Array<string>} Attributions for this layer at the given view.
   * @api
   */
  getAttributions(t) {
    var g;
    if (!this.isVisible(t))
      return [];
    const e = (g = this.getSource()) == null ? void 0 : g.getAttributions();
    if (!e)
      return [];
    const n = t instanceof eg ? t.getViewStateAndExtent() : t;
    let i = e(n);
    return Array.isArray(i) || (i = [i]), i;
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
    t || this.unrender(), this.set(_.MAP, t);
  }
  /**
   * For use inside the library only.
   * @return {import("../Map.js").default|null} Map.
   */
  getMapInternal() {
    return this.get(_.MAP);
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
    this.mapPrecomposeKey_ && (_e(this.mapPrecomposeKey_), this.mapPrecomposeKey_ = null), t || this.changed(), this.mapRenderKey_ && (_e(this.mapRenderKey_), this.mapRenderKey_ = null), t && (this.mapPrecomposeKey_ = Re(
      t,
      II.PRECOMPOSE,
      this.handlePrecompose_,
      this
    ), this.mapRenderKey_ = Re(this, re.CHANGE, t.render, t), this.changed());
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
    ge(
      !e.some(
        (i) => i.layer === n.layer
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
    this.set(_.SOURCE, t);
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
function aI(A, t) {
  if (!A.visible)
    return !1;
  const e = t.resolution;
  if (e < A.minResolution || e >= A.maxResolution)
    return !1;
  const n = t.zoom;
  return n > A.minZoom && n <= A.maxZoom;
}
class cI extends Jg {
  constructor(t) {
    const e = function(n) {
      const i = this.getSource(), g = i.mapboxMap;
      if (!g)
        return console.error("MapboxLayer: mapboxMap is undefined!"), null;
      g.setStyle(i.style);
      const r = g.getCanvas(), s = n.viewState, o = this.getVisible();
      r.style.display = o ? "block" : "none";
      const I = this.getOpacity();
      r.style.opacity = I;
      const C = s.rotation * -180 / Math.PI, a = Nn(s.center), c = s.zoom - 1, d = g.getBearing(), p = g.getCenter().toArray(), y = g.getZoom();
      return C == d && a[0] == p[0] && a[1] == p[1] && c == y || (C != d && g.rotateTo(C, {
        animate: !1
      }), (a[0] != p[0] || a[1] != p[1] || c != y) && g.jumpTo({
        center: a,
        zoom: c,
        animate: !1
      }), g._frame && (g._frame.cancel(), g._frame = null), g._render()), r;
    };
    super({
      render: e,
      source: t.source
    });
  }
}
class lI extends Jg {
  constructor(t) {
    const e = function(n) {
      const i = this.getSource(), g = i.maplibreMap;
      if (!g)
        return console.error("MapLibreLayer: maplibreMap is undefined!"), null;
      g.setStyle(i.style);
      const r = g.getCanvas(), s = n.viewState, o = this.getVisible();
      r.style.display = o ? "block" : "none";
      const I = this.getOpacity();
      r.style.opacity = I;
      const a = -s.rotation * 180 / Math.PI, c = g.getBearing();
      Math.abs(a - c) > 0.01 && (g.stop(), g.setBearing(a));
      const d = Nn(s.center), p = s.zoom - 1;
      if ((g.getCenter().toArray().toString() !== d.toString() || g.getZoom() !== p) && g.jumpTo({
        center: d,
        zoom: p,
        animate: !1
      }), g._frame && (g._frame.cancel(), g._frame = null), n.size) {
        const [y, E] = n.size;
        (r.width !== y || r.height !== E) && g.resize();
      }
      return g._render(), Math.abs(g.getZoom() - p) > 0.01 && g.setZoom(p), r.style.position = "absolute", r.style.left = "0", r.style.top = "0", r;
    };
    super({
      render: e,
      source: t.source
    });
  }
}
const qg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAxMS0xMC0yNlQyMTo1MjoxOFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAxMS0xMC0yN1QxNzo0MjowN1o8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgkVIwmwAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTM5jWRgMAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTAvMjYvMTHjwOqVAAARQHByVld4nMWbB3wURdvAd6/u3V6/27sts/PMQQhFpEU6SlNBRXqTfgkkQOhFSigHIgIWkJqAIJ1QBCz0KkJoQYrSQaQjioBKC+XezWU5fH2/3+/L8fu+fWd3bubZKf95nnlmdjeX2/dk602qD9UnooRc5YjkKp9KyIrkZikfkazcSFaWcuZmpUZScyOpWcqZm6rkU3OTIpGk3EhSViQpVTlzk5IiSUm5VCRC5UaorAiVqpy5VFKESspND6UY03O6U0oYGHo3NCg0ODSj59BQRmhYaHhoaDofFsJiGIVfC78e/hnOwwW4CI1Ttve/AlehLClH6oTrhl8N1wu3CIcFKhqWiwVpWvrG9EcjmXC2nC/1Sd+dHgonh1PCpxQ5nN4pfHHk3qGzOlFUepiiPk5PC/cO9wn3DfcL59deGOqWXC95Saigp/fCY8Lvh0e9Xm94q3DBlXLd2qm5kmRpSrdw9/CEqNwneWQ4HH6hXul6FHVs5Gfh2eGbI6eFp0fLxoZqhE/KC6P5Oa9lhzN7ymofy5PN4anhCRlfFpSVXxNeG26UQf0jyBSO5R1UcjTdF/3c8o+a66j11AbqhCrtpvZQe6lzqnSRukRdjtU8Q52lfqJuqNJt6g/qTzW/ltpKbaO2U99SO9QrF6j71AMqL9b2OvUr9VtMYmgLbaU9dIHkpwM0r+YdtJN20W76ytOa/zZWjpZpTANdNlr7NJVEv0RXpCtFpR+panR1ugZdPCodoGrTdei69MNou3p0ffoN+k36aT+rqcZqfheVQzWiW9HUP0Kn6BVEJ9DF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zV6+JT3q/K+UUkoppZ5Tl9rnzXTvZS/51pTrIJewYX0bzb5r+vfUX7X2ebU/rDnUmslszXqN0v99bSO/80ff/EtrIayb9PNrKMs56kf84zG7v5Te6HqW1yytUb8m7mzNaVbmv4r9stz7I1/WPPKc9sIzuc6ebST3XjlnDZd7OSawd7MmvNs6y5nriXWP9WbWmvq6UoX3Ota9TCttV8f0GZBXXqMep8R6JfdJl73upTKfo+6XbG+j/s9aG7ZmP75rNPZXvNzHLegjrPOtCT9WL+yXY17/tyH3IRB7GXXMtcq0VabZ8xrZt/8TQZzR/ZH/R2U+R33+P8X/GX/2/pB24py9GY74M//JWBN+ar36nJd7Avh6VKf0QbdPXs/yyrDRPhP3sz9znXmPynyutvB/30cpn1CmPC8x1jF+MpbRnteGn1Ivwhg3+I8AG9O+EHNt938fc3KP8pj/+X8i8yj1+93/szKfq2P+z7kdO/R+knUt9fEpfYO/iMs8tlX4MbtnGLbk/TrnYcZw4mLntDV7nfgz9yiPlYN/a/EhbSdtyp7ZyP+jMp/zLsh+W9YpfUffzrpij9FYRdxMr+fX/dn7wZpwwpbqlWHUg7mk+zfn8tE3GM/350Z59TDaQN+LTBsTP/Oelbn3tUtoab1APb70v1JKKaWUUkoppZRSSl1NOxERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERGRO+Qfh5eOajemXSYAAAFTbWtCVPrOyv4Af1WJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4nO3W4WmDYBSGUQdxEQdxEBdxEAdxEQexvIELt6Yh/4oJ54FDm0/7601szlOSJEmSJEmSJEmSJEmSJEmSJEkf0XEc577vT+c5y7V397+6T/dvXddzHMdzmqbHz+wY/Sz31L11FsuyPF7HMAx/vod077JjlX2zYXatzfs9tX/VN7/+je5ftut7Vjnrn+V6nX37xtm/ul7T/ctzvu9f/9fneX7aP9fs/31l23ru1+/btv36zPfnv/2/r/oe1/er90Cu1Xf7nEXVnx3Xa5IkSZIkSZIk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b24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+zWqGFQAACShJREFUWIWVmGusXFUVx39r73POzJy5M3fmPtrblj7p7btYGigGmojExISHQQ0miDFA4lc0SCBRNH4gRhNJ/aIfNAIxUkKIkMgjBBKMCHwQEGKhpbS39HXfve+5M3fmnr23H84+M7e1PDyTlbPPnDl7//da//Vf64zwBQ9jjCilAiDyFgIaUP4nFjDAMtACWtbaRGvtPmte59Lb8gUW137hGCgDFaDkrzMwrABRBxaAWWDeX7esteZyoD4XSJIkorXO+cV7gQFg9fMvLdz74bHm+hOnTP/QsOmeaxBYoJTDbF2n5wa36At7d+XOfOOW0uPAmLcpYN4Y0wyC4LIeuiwQ55wC8kA/sHF62tz5+F/mDz7zytKOTxpBMKsCEq1BCWjBiQAOcRAYQylpcWW0bG6/Kf/Rvd/rfmP1Kn0YOANMAksiYj8XiAcRew9se/ZvtR8/+seFr3xQj3QtDHGhQCCIFtAqDYxI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", _g = "data:image/png;base64,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", $g = "data:image/png;base64,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", gi = "data:image/png;base64,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", hI = new Qt({
  image: new Be({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: qg
  })
}), uI = new Qt({
  image: new Be({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: _g
  })
}), fI = new Qt({
  image: new Be({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: $g
  })
}), dI = new Qt({
  fill: new Dn({
    color: [128, 128, 256, 0.2]
  }),
  stroke: new Sn({
    color: [128, 128, 256, 1],
    width: 3
  })
}), mI = new Qt({
  image: new Be({
    anchor: [0.5, 1],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: gi
  })
});
class CA extends Fr {
  constructor(e) {
    e = Wt(e || {});
    const n = new GA({
      source: new kA({
        wrapX: !1
      })
    });
    n.set("name", "gps");
    const i = new GA({
      source: new kA({
        wrapX: !1
      })
    });
    i.set("name", "marker");
    const g = new GA({
      source: new kA({
        wrapX: !1
      })
    });
    g.set("name", "feature");
    const r = new GA({
      source: new kA({
        wrapX: !1
      })
    });
    r.set("name", "envelope");
    const s = CA.spawnLayer(
      null,
      e.source,
      e.target
    ), o = new Qr();
    o.set("name", "overlay");
    const C = {
      controls: e.controls ? e.controls : [],
      layers: [
        s,
        o,
        r,
        g,
        n,
        i
      ],
      target: e.div,
      view: new lg({
        center: e.defaultCenter || [0, 0],
        zoom: e.defaultZoom || 2,
        rotation: e.defaultRotation || 0,
        multiWorld: !0
      })
    };
    e.interactions && (C.interactions = e.interactions);
    super(C);
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
    const a = this.getView();
    this.__ignore_first_move = !0;
    const c = () => {
      this.__ignore_first_move || this.dispatchEvent("movestart"), this.__ignore_first_move = !1, a.un("propertychange", c);
    };
    a.on("propertychange", c), this.on("moveend", () => {
      a.on("propertychange", c);
    }), a.on("change:resolution", () => {
      this.getSource();
    });
  }
  static spawnLayer(e, n, i) {
    return n instanceof oA || n instanceof IA || !(e instanceof fn) ? (n instanceof oA ? e = new cI({
      style: n.style,
      accessToken: n.accessToken,
      container: i,
      source: n
    }) : n instanceof IA ? e = new lI({
      style: n.style,
      container: i,
      source: n
    }) : e = new fn({
      source: n
    }), e.set("name", "base")) : e.setSource(n), e;
  }
  getLayer(e = "base") {
    const n = (i) => {
      const g = i.getArray().map((r) => {
        if (r.get("name") == e) return r;
        if (r.getLayers) return n(r.getLayers());
      }).filter((r) => r);
      if (g.length != 0)
        return g[0];
    };
    return n(this.getLayers());
  }
  getSource(e = "base") {
    const n = this.getLayer(e);
    if (n)
      return n.getSource();
  }
  setFeature(e, n, i) {
    const g = this.getSource(i), r = new Ur(e);
    return n && r.setStyle(n), g.addFeature(r), r;
  }
  removeFeature(e, n) {
    this.getSource(n).removeFeature(e);
  }
  resetFeature(e) {
    this.getSource(e).clear();
  }
  setGPSPosition(e, n = void 0) {
    const i = n == "sub" ? fI : n == "hide" ? uI : hI;
    n != "sub" && this.resetFeature("gps"), e && (this.setFeature(
      {
        geometry: new sA(e.xy)
      },
      i,
      "gps"
    ), n || this.setFeature(
      {
        geometry: new qn(e.xy, e.rad)
      },
      dI,
      "gps"
    ));
  }
  setMarker(e, n, i, g) {
    return g || (g = "marker"), n.geometry = new sA(e), i ? typeof i == "string" ? i = new Qt({
      image: new Be({
        anchor: [0.5, 1],
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: i
      })
    }) : i instanceof Qt || (i = new Qt({
      image: new Be(i)
    })) : i = mI, this.setFeature(n, i, g);
  }
  resetMarker(e) {
    e || (e = "marker"), this.resetFeature(e);
  }
  setLine(e, n, i) {
    return this.setVector(e, "Line", n ? { stroke: n } : null, i);
  }
  setVector(e, n = "Line", i, g) {
    g || (g = "feature");
    const r = {};
    i.stroke != null && (r.stroke = new Sn(i.stroke)), i.fill != null && (r.fill = new Dn(i.fill));
    const s = new Qt(r), o = n === "Line" ? new KA(e) : new fe(e);
    return this.setFeature(
      {
        geometry: o,
        name: n
      },
      s,
      g
    );
  }
  resetLine(e) {
    this.resetVector(e);
  }
  resetVector(e) {
    e || (e = "feature"), this.resetFeature(e);
  }
  setEnvelope(e, n, i) {
    return i || (i = "envelope"), this.setLine(e, n, i);
  }
  removeEnvelope(e, n) {
    n || (n = "envelope"), this.removeFeature(e, n);
  }
  resetEnvelope(e) {
    e || (e = "envelope"), this.resetFeature(e);
  }
  setFillEnvelope(e, n, i, g) {
    g || (g = "envelope");
    let r;
    if (n != null || i != null) {
      const s = {};
      n != null && (s.stroke = new Sn(n)), i != null && (s.fill = new Dn(i)), r = new Qt(s);
    }
    return this.setFeature(
      {
        geometry: new fe([e])
      },
      r,
      g
    );
  }
  exchangeSource(e = void 0) {
    const n = this.getLayers(), i = n.item(0), g = CA.spawnLayer(i, e, this.getTarget());
    g != i && n.setAt(0, g), e && e.setMap(this);
  }
  setLayer(e = void 0) {
    const n = this.getLayer("overlay").getLayers();
    if (n.clear(), e) {
      const i = new fn({
        source: e
      });
      n.push(i);
    }
  }
  setTransparency(e) {
    const n = (100 - e) / 100, i = this.getSource();
    i instanceof Ge || i instanceof Zn ? (this.getLayers().item(0).setOpacity(1), this.getLayers().item(1).setOpacity(n)) : this.getLayers().item(0).setOpacity(n);
  }
  setGPSMarker(e, n) {
    this.getLayers().item(0).getSource().setGPSMarker(e, n);
  }
}
const Ke = {
  /**
   * A true double click, with no dragging.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#dblclick
   * @api
   */
  DBLCLICK: re.DBLCLICK,
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
}, Ag = {
  ACTIVE: "active"
};
class fA extends ke {
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
      this.get(Ag.ACTIVE)
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
    this.set(Ag.ACTIVE, t);
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
function pI(A, t, e) {
  const n = A.getCenterInternal();
  if (n) {
    const i = [n[0] + t[0], n[1] + t[1]];
    A.animateInternal({
      duration: e !== void 0 ? e : 250,
      easing: $o,
      center: A.getConstrainedCenter(i)
    });
  }
}
function ri(A, t, e, n) {
  const i = A.getZoom();
  if (i === void 0)
    return;
  const g = A.getConstrainedZoom(i + t), r = A.getResolutionForZoom(g);
  A.getAnimating() && A.cancelAnimations(), A.animate({
    resolution: r,
    anchor: e,
    duration: n !== void 0 ? n : 250,
    easing: An
  });
}
class yI extends fA {
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
    if (t.type == Ke.DBLCLICK) {
      const n = (
        /** @type {MouseEvent} */
        t.originalEvent
      ), i = t.map, g = t.coordinate, r = n.shiftKey ? -this.delta_ : this.delta_, s = i.getView();
      ri(s, r, g, this.duration_), n.preventDefault(), e = !0;
    }
    return !e;
  }
}
const de = typeof navigator < "u" && typeof navigator.userAgent < "u" ? navigator.userAgent.toLowerCase() : "", wI = de.includes("safari") && !de.includes("chrom");
wI && (de.includes("version/15.4") || /cpu (os|iphone os) 15_4 like mac os x/.test(de));
const vI = de.includes("webkit") && !de.includes("edge"), tr = de.includes("macintosh");
typeof WorkerGlobalScope < "u" && typeof OffscreenCanvas < "u" && self instanceof WorkerGlobalScope;
(function() {
  let A = !1;
  try {
    const t = Object.defineProperty({}, "passive", {
      get: function() {
        A = !0;
      }
    });
    window.addEventListener("_", null, t), window.removeEventListener("_", null, t);
  } catch {
  }
  return A;
})();
function Ln(A) {
  const t = arguments;
  return function(e) {
    let n = !0;
    for (let i = 0, g = t.length; i < g && (n = n && t[i](e), !!n); ++i)
      ;
    return n;
  };
}
const bI = function(A) {
  const t = A.originalEvent;
  return t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, MI = function(A) {
  const t = A.originalEvent;
  return t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, EI = function(A) {
  const t = A.map.getTargetElement(), e = t.getRootNode(), n = A.map.getOwnerDocument().activeElement;
  return e instanceof ShadowRoot ? e.host.contains(n) : t.contains(n);
}, er = function(A) {
  const t = A.map.getTargetElement(), e = t.getRootNode();
  return (e instanceof ShadowRoot ? e.host : t).hasAttribute("tabindex") ? EI(A) : !0;
}, RI = Rs, Ar = function(A) {
  const t = A.originalEvent;
  return "pointerId" in t && t.button == 0 && !(vI && tr && t.ctrlKey);
}, nr = function(A) {
  const t = (
    /** @type {KeyboardEvent|MouseEvent|TouchEvent} */
    A.originalEvent
  );
  return !t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, xI = function(A) {
  const t = A.originalEvent;
  return tr ? t.metaKey : t.ctrlKey;
}, ir = function(A) {
  const t = A.originalEvent;
  return !t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, gr = function(A) {
  const t = A.originalEvent, e = (
    /** @type {Element} */
    t.target.tagName
  );
  return e !== "INPUT" && e !== "SELECT" && e !== "TEXTAREA" && // `isContentEditable` is only available on `HTMLElement`, but it may also be a
  // different type like `SVGElement`.
  // @ts-ignore
  !t.target.isContentEditable;
}, De = function(A) {
  const t = A.originalEvent;
  return "pointerId" in t && t.pointerType == "mouse";
}, PI = function(A) {
  const t = A.originalEvent;
  return "pointerId" in t && t.isPrimary && t.button === 0;
};
class SI extends Eg {
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
    const t = this.startPixel_, e = this.endPixel_, n = "px", i = this.element_.style;
    i.left = Math.min(t[0], e[0]) + n, i.top = Math.min(t[1], e[1]) + n, i.width = Math.abs(e[0] - t[0]) + n, i.height = Math.abs(e[1] - t[1]) + n;
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
    const t = this.startPixel_, e = this.endPixel_, i = [
      t,
      [t[0], e[1]],
      e,
      [e[0], t[1]]
    ].map(
      this.map_.getCoordinateFromPixelInternal,
      this.map_
    );
    i[4] = i[0].slice(), this.geometry_ ? this.geometry_.setCoordinates([i]) : this.geometry_ = new fe([i]);
  }
  /**
   * @return {import("../geom/Polygon.js").default} Geometry.
   */
  getGeometry() {
    return this.geometry_;
  }
}
class Oe extends fA {
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
      if (t.type == Ke.POINTERDRAG)
        this.handleDragEvent(t), t.originalEvent.preventDefault();
      else if (t.type == Ke.POINTERUP) {
        const n = this.handleUpEvent(t);
        this.handlingDownUpSequence = n && this.targetPointers.length > 0;
      }
    } else if (t.type == Ke.POINTERDOWN) {
      const n = this.handleDownEvent(t);
      this.handlingDownUpSequence = n, e = this.stopDown(n);
    } else t.type == Ke.POINTERMOVE && this.handleMoveEvent(t);
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
function si(A) {
  const t = A.length;
  let e = 0, n = 0;
  for (let i = 0; i < t; i++)
    e += A[i].clientX, n += A[i].clientY;
  return { clientX: e / t, clientY: n / t };
}
const be = {
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
class Ve extends _t {
  /**
   * @param {string} type The event type.
   * @param {import("../coordinate.js").Coordinate} coordinate The event coordinate.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Originating event.
   */
  constructor(t, e, n) {
    super(t), this.coordinate = e, this.mapBrowserEvent = n;
  }
}
class DI extends Oe {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = t ?? {}, this.box_ = new SI(t.className || "ol-dragbox"), this.minArea_ = t.minArea ?? 64, t.onBoxEnd && (this.onBoxEnd = t.onBoxEnd), this.startPixel_ = null, this.condition_ = t.condition ?? Ar, this.boxEndCondition_ = t.boxEndCondition ?? this.defaultBoxEndCondition;
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
    const i = n[0] - e[0], g = n[1] - e[1];
    return i * i + g * g >= this.minArea_;
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
      new Ve(
        be.BOXDRAG,
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
      new Ve(
        e ? be.BOXEND : be.BOXCANCEL,
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
      new Ve(
        be.BOXSTART,
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
      new Ve(be.BOXCANCEL, this.startPixel_, null)
    ), this.startPixel_ = null)), super.setActive(t);
  }
  /**
   * @param {import("../Map.js").default|null} map Map.
   * @override
   */
  setMap(t) {
    this.getMap() && (this.box_.setMap(null), this.startPixel_ && (this.dispatchEvent(
      new Ve(be.BOXCANCEL, this.startPixel_, null)
    ), this.startPixel_ = null)), super.setMap(t);
  }
}
class BI extends Oe {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super({
      stopDown: qA
    }), t = t || {}, this.kinetic_ = t.kinetic, this.lastCentroid = null, this.lastPointersCount_, this.panning_ = !1;
    const e = t.condition ? t.condition : Ln(nr, PI);
    this.condition_ = t.onFocusOnly ? Ln(er, e) : e, this.noKinetic_ = !1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    const e = t.map;
    this.panning_ || (this.panning_ = !0, e.getView().beginInteraction());
    const n = this.targetPointers, i = e.getEventPixel(si(n));
    if (n.length == this.lastPointersCount_) {
      if (this.kinetic_ && this.kinetic_.update(i[0], i[1]), this.lastCentroid) {
        const g = [
          this.lastCentroid[0] - i[0],
          i[1] - this.lastCentroid[1]
        ], s = t.map.getView();
        Ys(g, s.getResolution()), Vn(g, s.getRotation()), s.adjustCenterInternal(g);
      }
    } else this.kinetic_ && this.kinetic_.begin();
    this.lastCentroid = i, this.lastPointersCount_ = n.length, t.originalEvent.preventDefault();
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
        const i = this.kinetic_.getDistance(), g = this.kinetic_.getAngle(), r = n.getCenterInternal(), s = e.getPixelFromCoordinateInternal(r), o = e.getCoordinateFromPixelInternal([
          s[0] - i * Math.cos(g),
          s[1] - i * Math.sin(g)
        ]);
        n.animateInternal({
          center: n.getConstrainedCenter(o),
          duration: 500,
          easing: An
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
class TI extends Oe {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super({
      stopDown: qA
    }), this.condition_ = t.condition ? t.condition : MI, this.lastAngle_ = void 0, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    if (!De(t))
      return;
    const e = t.map, n = e.getView();
    if (n.getConstraints().rotation === ii)
      return;
    const i = e.getSize(), g = t.pixel, r = Math.atan2(i[1] / 2 - g[1], g[0] - i[0] / 2);
    if (this.lastAngle_ !== void 0) {
      const s = r - this.lastAngle_;
      n.adjustRotationInternal(-s);
    }
    this.lastAngle_ = r;
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    return De(t) ? (t.map.getView().endInteraction(this.duration_), !1) : !0;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    return De(t) && Ar(t) && this.condition_(t) ? (t.map.getView().beginInteraction(), this.lastAngle_ = void 0, !0) : !1;
  }
}
class GI extends Oe {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Pointer.js").Options} */
      t
    ), this.condition_ = t.condition ? t.condition : ir, this.lastAngle_ = void 0, this.lastMagnitude_ = void 0, this.lastScaleDelta_ = 0, this.duration_ = t.duration !== void 0 ? t.duration : 400;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    if (!De(t))
      return;
    const e = t.map, n = e.getSize(), i = t.pixel, g = i[0] - n[0] / 2, r = n[1] / 2 - i[1], s = Math.atan2(r, g), o = Math.sqrt(g * g + r * r), I = e.getView();
    if (this.lastAngle_ !== void 0) {
      const C = this.lastAngle_ - s;
      I.adjustRotationInternal(C);
    }
    this.lastAngle_ = s, this.lastMagnitude_ !== void 0 && I.adjustResolutionInternal(this.lastMagnitude_ / o), this.lastMagnitude_ !== void 0 && (this.lastScaleDelta_ = this.lastMagnitude_ / o), this.lastMagnitude_ = o;
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    if (!De(t))
      return !0;
    const n = t.map.getView(), i = this.lastScaleDelta_ > 1 ? 1 : -1;
    return n.endInteraction(this.duration_, i), this.lastScaleDelta_ = 0, !1;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    return De(t) && this.condition_(t) ? (t.map.getView().beginInteraction(), this.lastAngle_ = void 0, this.lastMagnitude_ = void 0, !0) : !1;
  }
}
class kI extends DI {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = t.condition ? t.condition : ir;
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
    let i = this.getGeometry();
    if (this.out_) {
      const g = n.rotatedExtentForGeometry(i), r = n.getResolutionForExtentInternal(g), s = n.getResolution() / r;
      i = i.clone(), i.scale(s * s);
    }
    n.fitInternal(i, {
      duration: this.duration_,
      easing: An
    });
  }
}
const zA = {
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
}, ng = {
  LENGTH: "length"
};
class FA extends _t {
  /**
   * @param {import("./CollectionEventType.js").default} type Type.
   * @param {T} element Element.
   * @param {number} index The index of the added or removed element.
   */
  constructor(t, e, n) {
    super(t), this.element = e, this.index = n;
  }
}
class OI extends ke {
  /**
   * @param {Array<T>} [array] Array.
   * @param {Options} [options] Collection options.
   */
  constructor(t, e) {
    if (super(), this.on, this.once, this.un, e = e || {}, this.unique_ = !!e.unique, this.array_ = t ?? [], this.unique_)
      for (let n = 1, i = this.array_.length; n < i; ++n)
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
    for (let n = 0, i = e.length; n < i; ++n)
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
    return this.get(ng.LENGTH);
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
      new FA(zA.ADD, e, t)
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
    for (let n = 0, i = e.length; n < i; ++n)
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
      new FA(zA.REMOVE, e, t)
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
    const i = this.array_[t];
    this.array_[t] = e, this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new FA(zA.REMOVE, i, t)
    ), this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new FA(zA.ADD, e, t)
    );
  }
  /**
   * @private
   */
  updateLength_() {
    this.set(ng.LENGTH, this.array_.length);
  }
  /**
   * @private
   * @param {T} elem Element.
   * @param {number} [except] Optional index to ignore.
   */
  assertUnique_(t, e) {
    const n = this.array_;
    for (let i = 0, g = n.length; i < g; ++i)
      if (n[i] === t && i !== e)
        throw new Error("Duplicate item added to a unique collection");
  }
}
const Ce = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown"
};
class XI extends fA {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.defaultCondition_ = function(e) {
      return nr(e) && gr(e);
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
    if (t.type == re.KEYDOWN) {
      const n = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), i = n.key;
      if (this.condition_(t) && (i == Ce.DOWN || i == Ce.LEFT || i == Ce.RIGHT || i == Ce.UP)) {
        const r = t.map.getView(), s = r.getResolution() * this.pixelDelta_;
        let o = 0, I = 0;
        i == Ce.DOWN ? I = -s : i == Ce.LEFT ? o = -s : i == Ce.RIGHT ? o = s : I = s;
        const C = [o, I];
        Vn(C, r.getRotation()), pI(r, C, this.duration_), n.preventDefault(), e = !0;
      }
    }
    return !e;
  }
}
class ZI extends fA {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.condition_ = t.condition ? t.condition : function(e) {
      return !xI(e) && gr(e);
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
    if (t.type == re.KEYDOWN || t.type == re.KEYPRESS) {
      const n = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), i = n.key;
      if (this.condition_(t) && (i === "+" || i === "-")) {
        const g = t.map, r = i === "+" ? this.delta_ : -this.delta_, s = g.getView();
        ri(s, r, void 0, this.duration_), n.preventDefault(), e = !0;
      }
    }
    return !e;
  }
}
const LI = 40, jI = 300;
class NI extends fA {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Interaction.js").InteractionOptions} */
      t
    ), this.totalDelta_ = 0, this.lastDelta_ = 0, this.maxDelta_ = t.maxDelta !== void 0 ? t.maxDelta : 1, this.duration_ = t.duration !== void 0 ? t.duration : 250, this.timeout_ = t.timeout !== void 0 ? t.timeout : 80, this.useAnchor_ = t.useAnchor !== void 0 ? t.useAnchor : !0, this.constrainResolution_ = t.constrainResolution !== void 0 ? t.constrainResolution : !1;
    const e = t.condition ? t.condition : RI;
    this.condition_ = t.onFocusOnly ? Ln(er, e) : e, this.lastAnchor_ = null, this.startTime_ = void 0, this.timeoutId_, this.mode_ = void 0, this.trackpadEventGap_ = 400, this.trackpadTimeoutId_, this.deltaPerZoom_ = 300;
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
    if (!this.condition_(t) || t.type !== re.WHEEL)
      return !0;
    const n = t.map, i = (
      /** @type {WheelEvent} */
      t.originalEvent
    );
    i.preventDefault(), this.useAnchor_ && (this.lastAnchor_ = t.pixel);
    let g = i.deltaY;
    switch (i.deltaMode) {
      case WheelEvent.DOM_DELTA_LINE:
        g *= LI;
        break;
      case WheelEvent.DOM_DELTA_PAGE:
        g *= jI;
        break;
    }
    if (g === 0)
      return !1;
    this.lastDelta_ = g;
    const r = Date.now();
    this.startTime_ === void 0 && (this.startTime_ = r), (!this.mode_ || r - this.startTime_ > this.trackpadEventGap_) && (this.mode_ = Math.abs(g) < 4 ? "trackpad" : "wheel");
    const s = n.getView();
    if (this.mode_ === "trackpad" && !(s.getConstrainResolution() || this.constrainResolution_))
      return this.trackpadTimeoutId_ ? clearTimeout(this.trackpadTimeoutId_) : (s.getAnimating() && s.cancelAnimations(), s.beginInteraction()), this.trackpadTimeoutId_ = setTimeout(
        this.endInteraction_.bind(this),
        this.timeout_
      ), s.adjustZoom(
        -g / this.deltaPerZoom_,
        this.lastAnchor_ ? n.getCoordinateFromPixel(this.lastAnchor_) : null
      ), this.startTime_ = r, !1;
    this.totalDelta_ += g;
    const o = Math.max(this.timeout_ - (r - this.startTime_), 0);
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
    let n = -Nt(
      this.totalDelta_,
      -this.maxDelta_ * this.deltaPerZoom_,
      this.maxDelta_ * this.deltaPerZoom_
    ) / this.deltaPerZoom_;
    (e.getConstrainResolution() || this.constrainResolution_) && (n = n ? n > 0 ? 1 : -1 : 0), ri(
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
class zI extends Oe {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = qA), super(e), this.anchor_ = null, this.lastAngle_ = void 0, this.rotating_ = !1, this.rotationDelta_ = 0, this.threshold_ = t.threshold !== void 0 ? t.threshold : 0.3, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    let e = 0;
    const n = this.targetPointers[0], i = this.targetPointers[1], g = Math.atan2(
      i.clientY - n.clientY,
      i.clientX - n.clientX
    );
    if (this.lastAngle_ !== void 0) {
      const o = g - this.lastAngle_;
      this.rotationDelta_ += o, !this.rotating_ && Math.abs(this.rotationDelta_) > this.threshold_ && (this.rotating_ = !0), e = o;
    }
    this.lastAngle_ = g;
    const r = t.map, s = r.getView();
    s.getConstraints().rotation !== ii && (this.anchor_ = r.getCoordinateFromPixelInternal(
      r.getEventPixel(si(this.targetPointers))
    ), this.rotating_ && (r.render(), s.adjustRotationInternal(e, this.anchor_)));
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
class FI extends Oe {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = qA), super(e), this.anchor_ = null, this.duration_ = t.duration !== void 0 ? t.duration : 400, this.lastDistance_ = void 0, this.lastScaleDelta_ = 1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    let e = 1;
    const n = this.targetPointers[0], i = this.targetPointers[1], g = n.clientX - i.clientX, r = n.clientY - i.clientY, s = Math.sqrt(g * g + r * r);
    this.lastDistance_ !== void 0 && (e = this.lastDistance_ / s), this.lastDistance_ = s;
    const o = t.map, I = o.getView();
    e != 1 && (this.lastScaleDelta_ = e), this.anchor_ = o.getCoordinateFromPixelInternal(
      o.getEventPixel(si(this.targetPointers))
    ), o.render(), I.adjustResolutionInternal(e, this.anchor_);
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    if (this.targetPointers.length < 2) {
      const n = t.map.getView(), i = this.lastScaleDelta_ > 1 ? 1 : -1;
      return n.endInteraction(this.duration_, i), !1;
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
class UI {
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
    const i = this.points_[e + 2] - this.points_[n + 2];
    if (i < 1e3 / 60)
      return !1;
    const g = this.points_[e] - this.points_[n], r = this.points_[e + 1] - this.points_[n + 1];
    return this.angle_ = Math.atan2(r, g), this.initialVelocity_ = Math.sqrt(g * g + r * r) / i, this.initialVelocity_ > this.minVelocity_;
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
function ig(A) {
  A = A || {};
  const t = new OI(), e = new UI(-5e-3, 0.05, 100);
  return (A.altShiftDragRotate !== void 0 ? A.altShiftDragRotate : !0) && t.push(new TI()), (A.doubleClickZoom !== void 0 ? A.doubleClickZoom : !0) && t.push(
    new yI({
      delta: A.zoomDelta,
      duration: A.zoomDuration
    })
  ), (A.dragPan !== void 0 ? A.dragPan : !0) && t.push(
    new BI({
      onFocusOnly: A.onFocusOnly,
      kinetic: e
    })
  ), (A.pinchRotate !== void 0 ? A.pinchRotate : !0) && t.push(new zI()), (A.pinchZoom !== void 0 ? A.pinchZoom : !0) && t.push(
    new FI({
      duration: A.zoomDuration
    })
  ), (A.keyboard !== void 0 ? A.keyboard : !0) && (t.push(new XI()), t.push(
    new ZI({
      delta: A.zoomDelta,
      duration: A.zoomDuration
    })
  )), (A.mouseWheelZoom !== void 0 ? A.mouseWheelZoom : !0) && t.push(
    new NI({
      onFocusOnly: A.onFocusOnly,
      duration: A.zoomDuration
    })
  ), (A.shiftDragZoom !== void 0 ? A.shiftDragZoom : !0) && t.push(
    new kI({
      duration: A.zoomDuration
    })
  ), t;
}
function QI(A) {
  return WI(A[0], A[1], A[2]);
}
function WI(A, t, e) {
  return (t << A) + e;
}
const VI = /\{z\}/g, HI = /\{x\}/g, YI = /\{y\}/g, KI = /\{-y\}/g;
function JI(A, t, e, n, i) {
  return A.replace(VI, t.toString()).replace(HI, e.toString()).replace(YI, n.toString()).replace(KI, function() {
    throw new Error(
      "If the URL template has a {-y} placeholder, the grid extent must be known"
    );
  });
}
function qI(A, t) {
  return (
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile Coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @return {string|undefined} Tile URL.
     */
    (function(e, n, i) {
      if (!e)
        return;
      const g = e[0];
      return JI(A, g, e[1], e[2]);
    })
  );
}
function gg(A, t) {
  const e = A.length, n = new Array(e);
  for (let i = 0; i < e; ++i)
    n[i] = qI(A[i]);
  return _I(n);
}
function _I(A) {
  return A.length === 1 ? A[0] : (
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile Coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @return {string|undefined} Tile URL.
     */
    (function(t, e, n) {
      if (!t)
        return;
      const i = QI(t), g = Tn(i, A.length);
      return A[g](t, e, n);
    })
  );
}
for (let A = 0; A < 9; A++) {
  const t = `ZOOM:${A}`, e = 256 * Math.pow(2, A);
  (function(n, i) {
    const g = new zr({
      code: n,
      // The extent is used to determine zoom level 0. Recommended values for a
      // projection's validity extent can be found at https://epsg.io/.
      extent: [0, 0, i, i],
      units: "m"
    });
    Pn(g), QA(
      "EPSG:3857",
      g,
      (r) => {
        const s = (r[0] + it.MERC_MAX) * i / (2 * it.MERC_MAX), o = (-r[1] + it.MERC_MAX) * i / (2 * it.MERC_MAX);
        return [s, o];
      },
      (r) => {
        const s = r[0] * (2 * it.MERC_MAX) / i - it.MERC_MAX, o = -1 * (r[1] * (2 * it.MERC_MAX) / i - it.MERC_MAX);
        return [s, o];
      }
    );
  })(t, e);
}
class rr extends ws(hg) {
  constructor(t = {}) {
    t = Mg(t), t.wrapX = !1;
    const e = Math.log2(t.width / ae), n = Math.log2(t.height / ae);
    t.maxZoom = Math.ceil(Math.max(e, n)), t.tileUrlFunction = t.tileUrlFunction || function(i) {
      const g = i[0], r = i[1], s = i[2];
      return (
        // @ts-ignore
        r * ae * Math.pow(2, this.maxZoom - g) >= this.width || // @ts-ignore
        s * ae * Math.pow(2, this.maxZoom - g) >= this.height || r < 0 || s < 0 ? ug : this._tileUrlFunction(i)
      );
    }, super(t), t.mapID && (this.mapID = t.mapID), t.urls ? this._tileUrlFunction = gg(t.urls) : t.url && (this._tileUrlFunction = gg(Array.isArray(t.url) ? t.url : [t.url])), this.width = t.width, this.height = t.height, this.maxZoom = t.maxZoom, this._maxxy = Math.pow(2, this.maxZoom) * ae, this.initialize(t);
  }
}
class aA extends Ge {
  constructor(t = {}) {
    super(Object.assign(t, { opaque: !1 }));
  }
}
M(aA, "isBasemap_", !1);
const Kt = "https://weiwudi.example.com/api/";
let vn, Me;
class $I {
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
    for (let i = 0, g = n.length; i < g; i++)
      if (n[i] === e) {
        n.splice(i, 1);
        return;
      }
  }
  dispatchEvent(t) {
    if (!(t.type in this.listeners))
      return !0;
    const e = this.listeners[t.type].slice();
    for (let n = 0, i = e.length; n < i; n++)
      e[n].call(this, t);
    return !t.defaultPrevented;
  }
}
class Jt extends $I {
  static async registerSW(t, e) {
    if ("serviceWorker" in navigator)
      try {
        const n = await navigator.serviceWorker.register(t, e), i = n.installing, g = n.waiting;
        return i && (i.state === "activated" && !g && window.location.reload(), i.addEventListener("statechange", (r) => {
          i.state === "activated" && !g && window.location.reload();
        })), n.onupdatefound = () => {
          n.update();
        }, await Jt.swCheck(), n;
      } catch (n) {
        throw `Error: Service worker registration failed with ${n}`;
      }
    else
      throw "Error: Service worker is not supported";
  }
  static async swCheck() {
    return Me !== void 0 ? Me : (vn === void 0 && (vn = new Promise((t, e) => {
      fetch(`${Kt}ping`).then((n) => {
        Me = !!n, t(Me);
      }).catch((n) => {
        Me = !1, t(Me);
      });
    })), vn);
  }
  static async registerMap(t, e) {
    if (!await Jt.swCheck()) throw "Weiwudi service worker is not implemented.";
    let n;
    const i = ["type", "url", "width", "height", "tileSize", "minZoom", "maxZoom", "maxLng", "maxLat", "minLng", "minLat"].reduce((r, s) => (typeof e[s] < "u" && (e[s] instanceof Array ? e[s].map((o) => {
      r.append(s, o);
    }) : r.append(s, String(e[s]))), r), new URLSearchParams());
    i.append("mapID", t);
    const g = new URL(`${Kt}add`);
    if (g.search = i.toString(), n = await (await fetch(g.href)).text(), n.match(/^Error: /))
      throw n;
    return new Jt(t, JSON.parse(n));
  }
  static async retrieveMap(t) {
    if (!await Jt.swCheck()) throw "Weiwudi service worker is not implemented.";
    let e;
    if (e = await (await fetch(`${Kt}info?mapID=${t}`)).text(), e.match(/^Error: /))
      throw e;
    return console.log(e), new Jt(t, JSON.parse(e));
  }
  static async removeMap(t) {
    if (!await Jt.swCheck()) throw "Weiwudi service worker is not implemented.";
    let e;
    if (e = await (await fetch(`${Kt}delete?mapID=${t}`)).text(), e.match(/^Error: /))
      throw e;
  }
  constructor(t, e) {
    if (super(), !t) throw "MapID is necessary.";
    this.mapID = t, e && Object.assign(this, e), this.url = `${Kt}cache/${t}/{z}/{x}/{y}`, this.listener = (n) => {
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
    if (this.checkAspect(), t = await (await fetch(`${Kt}stats?mapID=${this.mapID}`)).text(), typeof t == "string" && t.match(/^Error: /))
      throw t;
    return JSON.parse(t);
  }
  async clean() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${Kt}clean?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
  async fetchAll() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${Kt}fetchAll?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
  async remove() {
    this.checkAspect(), this.mapID && await Jt.removeMap(this.mapID), this.release();
  }
  async cancel() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${Kt}cancel?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
}
function UA(A, t, e) {
  const n = typeof A == "string" ? A : A.getCode(), i = typeof t == "string" ? t : t.getCode();
  let g = hn(A, t);
  if (g == un && n != i) {
    const r = hn(A, "EPSG:3857"), s = hn("EPSG:3857", t);
    if (r == un && n != "EPSG:3857")
      throw "Transform of Source projection is not defined.";
    if (s == un && i != "EPSG:3857")
      throw "Transform of Distination projection is not defined.";
    g = function(I) {
      return Tt(Tt(I, A, "EPSG:3857"), "EPSG:3857", t);
    }, QA(A, t, g, function(I) {
      return Tt(Tt(I, t, "EPSG:3857"), "EPSG:3857", A);
    });
  }
  if (e)
    return g(e);
}
const tC = [
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
async function eC(A) {
  var g, r, s;
  const t = A;
  if (tC.forEach((o) => {
    t[o] = A[o];
  }), (A.imageExtention || A.imageExtension) && (t.imageExtension = A.imageExtension || A.imageExtention), !A.compiled)
    throw new Error(
      "@maplat/transform requires pre-compiled data. Cannot create MapTransform from GCPs."
    );
  const e = { compiled: A.compiled };
  (g = A.sub_maps) != null && g.length && (e.sub_maps = A.sub_maps.filter((o) => o.compiled).map((o) => ({
    compiled: o.compiled,
    priority: o.priority,
    importance: o.importance,
    bounds: o.bounds
  })));
  const n = new it.MapTransform();
  n.setMapData(e);
  const i = n.getLayerTransform(0);
  if (t.strictMode = i.strictMode, t.vertexMode = i.vertexMode, t.yaxisMode = i.yaxisMode, t.width = (r = i.wh) == null ? void 0 : r[0], t.height = (s = i.wh) == null ? void 0 : s[1], t.gcps = i.points, t.edges = i.edges, A.sub_maps) {
    const o = A.sub_maps.map((I, C) => {
      const a = {
        importance: I.importance,
        priority: I.priority
      };
      if (I.compiled) {
        const c = n.getLayerTransform(C + 1);
        a.bounds = (c == null ? void 0 : c.bounds) ?? I.bounds, a.gcps = c == null ? void 0 : c.points, a.edges = c == null ? void 0 : c.edges;
      } else
        a.bounds = I.bounds, a.gcps = I.gcps, a.edges = I.edges;
      return a;
    });
    t.sub_maps = o;
  }
  return [t, n];
}
class JA extends rr {
  constructor(e = {}) {
    super(e);
    M(this, "mapTransform");
    this.mapTransform = new it.MapTransform();
  }
  static async createAsync(e) {
    const [n, i] = await eC(e);
    e = n;
    const g = new JA(e);
    g.mapTransform = i;
    const r = i.getLayerTransform(0), s = new nA({
      code: `Illst:${g.mapID}`,
      extent: [0, 0, g.width, g.height],
      units: "m"
    });
    return Pn(s), QA(
      s,
      "EPSG:3857",
      (o) => r.transform(o, !1),
      (o) => r.transform(o, !0)
    ), UA("EPSG:4326", s), e.sub_maps && e.sub_maps.forEach((o, I) => {
      const C = I + 1, a = `Illst:${g.mapID}#${C}`, c = i.getLayerTransform(C);
      if (!c) return;
      const d = new nA({
        code: a,
        extent: [c.xy[0], c.xy[1], c.wh[0], c.wh[1]],
        units: "m"
      });
      Pn(d), QA(
        d,
        "EPSG:3857",
        (p) => c.transform(p, !1, !0),
        (p) => c.transform(p, !0, !0)
      ), UA("EPSG:4326", d);
    }), g;
  }
  xy2MercAsync_specifyLayer(e, n) {
    const i = `Illst:${this.mapID}${n ? `#${n}` : ""}`;
    return new Promise((g, r) => {
      g(UA(i, "EPSG:3857", e));
    });
  }
  merc2XyAsync_specifyLayer(e, n) {
    const i = `Illst:${this.mapID}${n ? `#${n}` : ""}`;
    return new Promise((g, r) => {
      g(UA("EPSG:3857", i, e));
    });
  }
  xy2MercAsync_returnLayer(e) {
    const n = this.mapTransform.xy2MercWithLayer(e);
    return n ? Promise.resolve(n) : Promise.reject(new Error("xy2MercWithLayer: out of bounds"));
  }
  merc2XyAsync_returnLayer(e) {
    const n = this.mapTransform.merc2XyWithLayer(e);
    return Promise.resolve(
      n.map(
        (i) => i ? [i[0], i[1]] : void 0
      )
    );
  }
  setupMapParameter(e) {
    const n = [this.width / 2, this.height / 2], i = this.mapTransform.xy2MercWithLayer(n);
    if (!i) return;
    const [g, r] = i, s = this.mapTransform.getLayerTransform(g), o = this.mapTransform.getLayerTransform(0);
    if (!s) return;
    const I = [
      [n[0] - 150, n[1]],
      [n[0] + 150, n[1]],
      [n[0], n[1] - 150],
      [n[0], n[1] + 150]
    ], C = [
      [0, 0],
      [this.width, 0],
      [this.width, this.height],
      [0, this.height]
    ], a = I.map((E) => s.transform(E, !1)), c = C.map(
      (E) => o.transform(E, !1)
    ), d = Math.sqrt(
      Math.pow(a[0][0] - a[1][0], 2) + Math.pow(a[0][1] - a[1][1], 2)
    ), p = Math.sqrt(
      Math.pow(a[2][0] - a[3][0], 2) + Math.pow(a[2][1] - a[3][1], 2)
    ), y = (d + p) / 2;
    this.mercZoom || (this.mercZoom = Math.log(300 * (2 * it.MERC_MAX) / 256 / y) / Math.log(2) - 3), this.homePosition || (this.homePosition = Nn(r)), this.envelope = mg([
      [
        c[0],
        c[1],
        c[2],
        c[3],
        c[0]
      ]
    ]), e(this);
  }
  mercs2SysCoordsAsync_multiLayer(e) {
    const n = this.mapTransform.mercs2SysCoords(e[0]);
    return Promise.resolve(
      n.map((i) => {
        if (i)
          return [i.map((g) => g), e[1]];
      })
    );
  }
  merc2XyAsync_base(e, n) {
    return this.merc2XyAsync_returnLayer(e).then((i) => n && !i[0] ? void 0 : (i[0] ? i[0] : i[1])[1]);
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
  viewpoint2MercsAsync(e, n) {
    const i = (e == null ? void 0 : e[0]) ?? this.getMap().getView().getCenter(), g = (e == null ? void 0 : e[1]) ?? this.getMap().getView().getDecimalZoom(), r = (e == null ? void 0 : e[2]) ?? this.getMap().getView().getRotation();
    n || (n = this.getMap().getSize());
    const s = this.mapTransform.viewpoint2Mercs(
      { center: i, zoom: g, rotation: r },
      n
    );
    return Promise.resolve([s, n]);
  }
  mercs2ViewpointAsync(e) {
    const n = e[1] ?? this.getMap().getSize(), i = this.mapTransform.mercs2Viewpoint(
      e[0],
      n
    );
    return Promise.resolve([
      i.center,
      i.zoom,
      i.rotation
    ]);
  }
}
var ut = typeof globalThis < "u" && globalThis || typeof self < "u" && self || // eslint-disable-next-line no-undef
typeof globalThis < "u" && globalThis || {}, bt = {
  searchParams: "URLSearchParams" in ut,
  iterable: "Symbol" in ut && "iterator" in Symbol,
  blob: "FileReader" in ut && "Blob" in ut && (function() {
    try {
      return new Blob(), !0;
    } catch {
      return !1;
    }
  })(),
  formData: "FormData" in ut,
  arrayBuffer: "ArrayBuffer" in ut
};
function AC(A) {
  return A && DataView.prototype.isPrototypeOf(A);
}
if (bt.arrayBuffer)
  var nC = [
    "[object Int8Array]",
    "[object Uint8Array]",
    "[object Uint8ClampedArray]",
    "[object Int16Array]",
    "[object Uint16Array]",
    "[object Int32Array]",
    "[object Uint32Array]",
    "[object Float32Array]",
    "[object Float64Array]"
  ], iC = ArrayBuffer.isView || function(A) {
    return A && nC.indexOf(Object.prototype.toString.call(A)) > -1;
  };
function Xe(A) {
  if (typeof A != "string" && (A = String(A)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(A) || A === "")
    throw new TypeError('Invalid character in header field name: "' + A + '"');
  return A.toLowerCase();
}
function oi(A) {
  return typeof A != "string" && (A = String(A)), A;
}
function Ii(A) {
  var t = {
    next: function() {
      var e = A.shift();
      return { done: e === void 0, value: e };
    }
  };
  return bt.iterable && (t[Symbol.iterator] = function() {
    return t;
  }), t;
}
function at(A) {
  this.map = {}, A instanceof at ? A.forEach(function(t, e) {
    this.append(e, t);
  }, this) : Array.isArray(A) ? A.forEach(function(t) {
    if (t.length != 2)
      throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + t.length);
    this.append(t[0], t[1]);
  }, this) : A && Object.getOwnPropertyNames(A).forEach(function(t) {
    this.append(t, A[t]);
  }, this);
}
at.prototype.append = function(A, t) {
  A = Xe(A), t = oi(t);
  var e = this.map[A];
  this.map[A] = e ? e + ", " + t : t;
};
at.prototype.delete = function(A) {
  delete this.map[Xe(A)];
};
at.prototype.get = function(A) {
  return A = Xe(A), this.has(A) ? this.map[A] : null;
};
at.prototype.has = function(A) {
  return this.map.hasOwnProperty(Xe(A));
};
at.prototype.set = function(A, t) {
  this.map[Xe(A)] = oi(t);
};
at.prototype.forEach = function(A, t) {
  for (var e in this.map)
    this.map.hasOwnProperty(e) && A.call(t, this.map[e], e, this);
};
at.prototype.keys = function() {
  var A = [];
  return this.forEach(function(t, e) {
    A.push(e);
  }), Ii(A);
};
at.prototype.values = function() {
  var A = [];
  return this.forEach(function(t) {
    A.push(t);
  }), Ii(A);
};
at.prototype.entries = function() {
  var A = [];
  return this.forEach(function(t, e) {
    A.push([e, t]);
  }), Ii(A);
};
bt.iterable && (at.prototype[Symbol.iterator] = at.prototype.entries);
function bn(A) {
  if (!A._noBody) {
    if (A.bodyUsed)
      return Promise.reject(new TypeError("Already read"));
    A.bodyUsed = !0;
  }
}
function sr(A) {
  return new Promise(function(t, e) {
    A.onload = function() {
      t(A.result);
    }, A.onerror = function() {
      e(A.error);
    };
  });
}
function gC(A) {
  var t = new FileReader(), e = sr(t);
  return t.readAsArrayBuffer(A), e;
}
function rC(A) {
  var t = new FileReader(), e = sr(t), n = /charset=([A-Za-z0-9_-]+)/.exec(A.type), i = n ? n[1] : "utf-8";
  return t.readAsText(A, i), e;
}
function sC(A) {
  for (var t = new Uint8Array(A), e = new Array(t.length), n = 0; n < t.length; n++)
    e[n] = String.fromCharCode(t[n]);
  return e.join("");
}
function rg(A) {
  if (A.slice)
    return A.slice(0);
  var t = new Uint8Array(A.byteLength);
  return t.set(new Uint8Array(A)), t.buffer;
}
function or() {
  return this.bodyUsed = !1, this._initBody = function(A) {
    this.bodyUsed = this.bodyUsed, this._bodyInit = A, A ? typeof A == "string" ? this._bodyText = A : bt.blob && Blob.prototype.isPrototypeOf(A) ? this._bodyBlob = A : bt.formData && FormData.prototype.isPrototypeOf(A) ? this._bodyFormData = A : bt.searchParams && URLSearchParams.prototype.isPrototypeOf(A) ? this._bodyText = A.toString() : bt.arrayBuffer && bt.blob && AC(A) ? (this._bodyArrayBuffer = rg(A.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : bt.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(A) || iC(A)) ? this._bodyArrayBuffer = rg(A) : this._bodyText = A = Object.prototype.toString.call(A) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof A == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : bt.searchParams && URLSearchParams.prototype.isPrototypeOf(A) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
  }, bt.blob && (this.blob = function() {
    var A = bn(this);
    if (A)
      return A;
    if (this._bodyBlob)
      return Promise.resolve(this._bodyBlob);
    if (this._bodyArrayBuffer)
      return Promise.resolve(new Blob([this._bodyArrayBuffer]));
    if (this._bodyFormData)
      throw new Error("could not read FormData body as blob");
    return Promise.resolve(new Blob([this._bodyText]));
  }), this.arrayBuffer = function() {
    if (this._bodyArrayBuffer) {
      var A = bn(this);
      return A || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
        this._bodyArrayBuffer.buffer.slice(
          this._bodyArrayBuffer.byteOffset,
          this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
        )
      ) : Promise.resolve(this._bodyArrayBuffer));
    } else {
      if (bt.blob)
        return this.blob().then(gC);
      throw new Error("could not read as ArrayBuffer");
    }
  }, this.text = function() {
    var A = bn(this);
    if (A)
      return A;
    if (this._bodyBlob)
      return rC(this._bodyBlob);
    if (this._bodyArrayBuffer)
      return Promise.resolve(sC(this._bodyArrayBuffer));
    if (this._bodyFormData)
      throw new Error("could not read FormData body as text");
    return Promise.resolve(this._bodyText);
  }, bt.formData && (this.formData = function() {
    return this.text().then(CC);
  }), this.json = function() {
    return this.text().then(JSON.parse);
  }, this;
}
var oC = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
function IC(A) {
  var t = A.toUpperCase();
  return oC.indexOf(t) > -1 ? t : A;
}
function me(A, t) {
  if (!(this instanceof me))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  t = t || {};
  var e = t.body;
  if (A instanceof me) {
    if (A.bodyUsed)
      throw new TypeError("Already read");
    this.url = A.url, this.credentials = A.credentials, t.headers || (this.headers = new at(A.headers)), this.method = A.method, this.mode = A.mode, this.signal = A.signal, !e && A._bodyInit != null && (e = A._bodyInit, A.bodyUsed = !0);
  } else
    this.url = String(A);
  if (this.credentials = t.credentials || this.credentials || "same-origin", (t.headers || !this.headers) && (this.headers = new at(t.headers)), this.method = IC(t.method || this.method || "GET"), this.mode = t.mode || this.mode || null, this.signal = t.signal || this.signal || (function() {
    if ("AbortController" in ut) {
      var g = new AbortController();
      return g.signal;
    }
  })(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && e)
    throw new TypeError("Body not allowed for GET or HEAD requests");
  if (this._initBody(e), (this.method === "GET" || this.method === "HEAD") && (t.cache === "no-store" || t.cache === "no-cache")) {
    var n = /([?&])_=[^&]*/;
    if (n.test(this.url))
      this.url = this.url.replace(n, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
    else {
      var i = /\?/;
      this.url += (i.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
    }
  }
}
me.prototype.clone = function() {
  return new me(this, { body: this._bodyInit });
};
function CC(A) {
  var t = new FormData();
  return A.trim().split("&").forEach(function(e) {
    if (e) {
      var n = e.split("="), i = n.shift().replace(/\+/g, " "), g = n.join("=").replace(/\+/g, " ");
      t.append(decodeURIComponent(i), decodeURIComponent(g));
    }
  }), t;
}
function aC(A) {
  var t = new at(), e = A.replace(/\r?\n[\t ]+/g, " ");
  return e.split("\r").map(function(n) {
    return n.indexOf(`
`) === 0 ? n.substr(1, n.length) : n;
  }).forEach(function(n) {
    var i = n.split(":"), g = i.shift().trim();
    if (g) {
      var r = i.join(":").trim();
      try {
        t.append(g, r);
      } catch (s) {
        console.warn("Response " + s.message);
      }
    }
  }), t;
}
or.call(me.prototype);
function Vt(A, t) {
  if (!(this instanceof Vt))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  if (t || (t = {}), this.type = "default", this.status = t.status === void 0 ? 200 : t.status, this.status < 200 || this.status > 599)
    throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
  this.ok = this.status >= 200 && this.status < 300, this.statusText = t.statusText === void 0 ? "" : "" + t.statusText, this.headers = new at(t.headers), this.url = t.url || "", this._initBody(A);
}
or.call(Vt.prototype);
Vt.prototype.clone = function() {
  return new Vt(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new at(this.headers),
    url: this.url
  });
};
Vt.error = function() {
  var A = new Vt(null, { status: 200, statusText: "" });
  return A.ok = !1, A.status = 0, A.type = "error", A;
};
var cC = [301, 302, 303, 307, 308];
Vt.redirect = function(A, t) {
  if (cC.indexOf(t) === -1)
    throw new RangeError("Invalid status code");
  return new Vt(null, { status: t, headers: { location: A } });
};
var le = ut.DOMException;
try {
  new le();
} catch {
  le = function(t, e) {
    this.message = t, this.name = e;
    var n = Error(t);
    this.stack = n.stack;
  }, le.prototype = Object.create(Error.prototype), le.prototype.constructor = le;
}
function Ir(A, t) {
  return new Promise(function(e, n) {
    var i = new me(A, t);
    if (i.signal && i.signal.aborted)
      return n(new le("Aborted", "AbortError"));
    var g = new XMLHttpRequest();
    function r() {
      g.abort();
    }
    g.onload = function() {
      var I = {
        statusText: g.statusText,
        headers: aC(g.getAllResponseHeaders() || "")
      };
      i.url.indexOf("file://") === 0 && (g.status < 200 || g.status > 599) ? I.status = 200 : I.status = g.status, I.url = "responseURL" in g ? g.responseURL : I.headers.get("X-Request-URL");
      var C = "response" in g ? g.response : g.responseText;
      setTimeout(function() {
        e(new Vt(C, I));
      }, 0);
    }, g.onerror = function() {
      setTimeout(function() {
        n(new TypeError("Network request failed"));
      }, 0);
    }, g.ontimeout = function() {
      setTimeout(function() {
        n(new TypeError("Network request timed out"));
      }, 0);
    }, g.onabort = function() {
      setTimeout(function() {
        n(new le("Aborted", "AbortError"));
      }, 0);
    };
    function s(I) {
      try {
        return I === "" && ut.location.href ? ut.location.href : I;
      } catch {
        return I;
      }
    }
    if (g.open(i.method, s(i.url), !0), i.credentials === "include" ? g.withCredentials = !0 : i.credentials === "omit" && (g.withCredentials = !1), "responseType" in g && (bt.blob ? g.responseType = "blob" : bt.arrayBuffer && (g.responseType = "arraybuffer")), t && typeof t.headers == "object" && !(t.headers instanceof at || ut.Headers && t.headers instanceof ut.Headers)) {
      var o = [];
      Object.getOwnPropertyNames(t.headers).forEach(function(I) {
        o.push(Xe(I)), g.setRequestHeader(I, oi(t.headers[I]));
      }), i.headers.forEach(function(I, C) {
        o.indexOf(C) === -1 && g.setRequestHeader(C, I);
      });
    } else
      i.headers.forEach(function(I, C) {
        g.setRequestHeader(C, I);
      });
    i.signal && (i.signal.addEventListener("abort", r), g.onreadystatechange = function() {
      g.readyState === 4 && i.signal.removeEventListener("abort", r);
    }), g.send(typeof i._bodyInit > "u" ? null : i._bodyInit);
  });
}
Ir.polyfill = !0;
ut.fetch || (ut.fetch = Ir, ut.Headers = at, ut.Request = me, ut.Response = Vt);
const Cr = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAAqACAAQAAAABAAAANKADAAQAAAABAAAANAAAAAD/4QkhaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/4hskSUNDX1BST0ZJTEUAAQEAABsUYXBwbAIQAABtbnRyUkdCIFhZWiAH4AAKAB0AFAA0AAZhY3NwQVBQTAAAAABBUFBMAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFkZXNjAAABUAAAAGJkc2NtAAABtAAABBhjcHJ0AAAFzAAAACN3dHB0AAAF8AAAABRyWFlaAAAGBAAAABRnWFlaAAAGGAAAABRiWFlaAAAGLAAAABRyVFJDAAAGQAAACAxhYXJnAAAOTAAAACB2Y2d0AAAObAAABhJuZGluAAAUgAAABj5jaGFkAAAawAAAACxtbW9kAAAa7AAAAChiVFJDAAAGQAAACAxnVFJDAAAGQAAACAxhYWJnAAAOTAAAACBhYWdnAAAOTAAAACBkZXNjAAAAAAAAAAhEaXNwbGF5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbWx1YwAAAAAAAAAiAAAADGhySFIAAAAUAAABqGtvS1IAAAAMAAABvG5iTk8AAAASAAAByGlkAAAAAAASAAAB2mh1SFUAAAAUAAAB7GNzQ1oAAAAWAAACAGRhREsAAAAcAAACFnVrVUEAAAAcAAACMmFyAAAAAAAUAAACTml0SVQAAAAUAAACYnJvUk8AAAASAAACdm5sTkwAAAAWAAACiGhlSUwAAAAWAAACnmVzRVMAAAASAAACdmZpRkkAAAAQAAACtHpoVFcAAAAMAAACxHZpVk4AAAAOAAAC0HNrU0sAAAAWAAAC3npoQ04AAAAMAAACxHJ1UlUAAAAkAAAC9GZyRlIAAAAWAAADGG1zAAAAAAASAAADLmNhRVMAAAAYAAADQHRoVEgAAAAMAAADWGVzWEwAAAASAAACdmRlREUAAAAQAAADZGVuVVMAAAASAAADdHB0QlIAAAAYAAADhnBsUEwAAAASAAADnmVsR1IAAAAiAAADsHN2U0UAAAAQAAAD0nRyVFIAAAAUAAAD4mphSlAAAAAMAAAD9nB0UFQAAAAWAAAEAgBMAEMARAAgAHUAIABiAG8AagBpzuy37AAgAEwAQwBEAEYAYQByAGcAZQAtAEwAQwBEAEwAQwBEACAAVwBhAHIAbgBhAFMAegDtAG4AZQBzACAATABDAEQAQgBhAHIAZQB2AG4A/QAgAEwAQwBEAEwAQwBEAC0AZgBhAHIAdgBlAHMAawDmAHIAbQQaBD4EOwRMBD4EQAQ+BDIEOAQ5ACAATABDAEQgDwBMAEMARAAgBkUGRAZIBkYGKQBMAEMARAAgAGMAbwBsAG8AcgBpAEwAQwBEACAAYwBvAGwAbwByAEsAbABlAHUAcgBlAG4ALQBMAEMARCAPAEwAQwBEACAF5gXRBeIF1QXgBdkAVgDkAHIAaQAtAEwAQwBEX2mCcgAgAEwAQwBEAEwAQwBEACAATQDgAHUARgBhAHIAZQBiAG4A6QAgAEwAQwBEBCYEMgQ1BEIEPQQ+BDkAIAQWBBoALQQ0BDgEQQQ/BDsENQQ5AEwAQwBEACAAYwBvAHUAbABlAHUAcgBXAGEAcgBuAGEAIABMAEMARABMAEMARAAgAGUAbgAgAGMAbwBsAG8AcgBMAEMARAAgDioONQBGAGEAcgBiAC0ATABDAEQAQwBvAGwAbwByACAATABDAEQATABDAEQAIABDAG8AbABvAHIAaQBkAG8ASwBvAGwAbwByACAATABDAEQDiAOzA8cDwQPJA7wDtwAgA78DuAPMA70DtwAgAEwAQwBEAEYA5AByAGcALQBMAEMARABSAGUAbgBrAGwAaQAgAEwAQwBEMKsw6TD8AEwAQwBEAEwAQwBEACAAYQAgAEMAbwByAGUAc3RleHQAAAAAQ29weXJpZ2h0IEFwcGxlIEluYy4sIDIwMTYAAFhZWiAAAAAAAADzUgABAAAAARbPWFlaIAAAAAAAAGXoAAA8EAAACdBYWVogAAAAAAAAapMAAKrFAAAXilhZWiAAAAAAAAAmWwAAGSwAALHSY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA2ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKMAqACtALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkH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", ar = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAAqACAAQAAAABAAAANKADAAQAAAABAAAANAAAAAD/4QkhaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/4gKESUNDX1BST0ZJTEUAAQEAAAJ0YXBwbAQAAABtbnRyUkdCIFhZWiAH3AALAAwAEgA6ABdhY3NwQVBQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGxmSfnZPIV3n7QGSpkeOnQsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtkZXNjAAABCAAAAGNkc2NtAAABbAAAACxjcHJ0AAABmAAAAC13dHB0AAAByAAAABRyWFlaAAAB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", cr = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCARXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAKgAgAEAAAAAQAAADSgAwAEAAAAAQAAADQAAAAA/+EJIWh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/PgD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/+IbJElDQ19QUk9GSUxFAAEBAAAbFGFwcGwCEAAAbW50clJHQiBYWVogB+EABAAEABcABgAzYWNzcEFQUEwAAAAAQVBQTAAAAAAAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1hcHBsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARZGVzYwAAAVAAAABiZHNjbQAAAbQAAAQYY3BydAAABcwAAAAjd3RwdAAABfAAAAAUclhZWgAABgQAAAAUZ1hZWgAABhgAAAAUYlhZWgAABiwAAAAUclRSQwAABkAAAAgMYWFyZwAADkwAAAAgdmNndAAADmwAAAYSbmRpbgAAFIAAAAY+Y2hhZAAAGsAAAAAsbW1vZAAAGuwAAAAoYlRSQwAABkAAAAgMZ1RSQwAABkAAAAgMYWFiZwAADkwAAAAgYWFnZwAADkwAAAAgZGVzYwAAAAAAAAAIRGlzcGxheQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG1sdWMAAAAAAAAAIgAAAAxockhSAAAAFAAAAahrb0tSAAAADAAAAbxuYk5PAAAAEgAAAchpZAAAAAAAEgAAAdpodUhVAAAAFAAAAexjc0NaAAAAFgAAAgBkYURLAAAAHAAAAhZ1a1VBAAAAHAAAAjJhcgAAAAAAFAAAAk5pdElUAAAAFAAAAmJyb1JPAAAAEgAAAnZubE5MAAAAFgAAAohoZUlMAAAAFgAAAp5lc0VTAAAAEgAAAnZmaUZJAAAAEAAAArR6aFRXAAAADAAAAsR2aVZOAAAADgAAAtBza1NLAAAAFgAAAt56aENOAAAADAAAAsRydVJVAAAAJAAAAvRmckZSAAAAFgAAAxhtcwAAAAAAEgAAAy5jYUVTAAAAGAAAA0B0aFRIAAAADAAAA1hlc1hMAAAAEgAAAnZkZURFAAAAEAAAA2RlblVTAAAAEgAAA3RwdEJSAAAAGAAAA4ZwbFBMAAAAEgAAA55lbEdSAAAAIgAAA7BzdlNFAAAAEAAAA9J0clRSAAAAFAAAA+JqYUpQAAAADAAAA/ZwdFBUAAAAFgAABAIATABDAEQAIAB1ACAAYgBvAGoAac7st+wAIABMAEMARABGAGEAcgBnAGUALQBMAEMARABMAEMARAAgAFcAYQByAG4AYQBTAHoA7QBuAGUAcwAgAEwAQwBEAEIAYQByAGUAdgBuAP0AIABMAEMARABMAEMARAAtAGYAYQByAHYAZQBzAGsA5gByAG0EGgQ+BDsETAQ+BEAEPgQyBDgEOQAgAEwAQwBEIA8ATABDAEQAIAZFBkQGSAZGBikATABDAEQAIABjAG8AbABvAHIAaQBMAEMARAAgAGMAbwBsAG8AcgBLAGwAZQB1AHIAZQBuAC0ATABDAEQgDwBMAEMARAAgBeYF0QXiBdUF4AXZAFYA5AByAGkALQBMAEMARF9pgnIAIABMAEMARABMAEMARAAgAE0A4AB1AEYAYQByAGUAYgBuAP0AIABMAEMARAQmBDIENQRCBD0EPgQ5ACAEFgQaAC0ENAQ4BEEEPwQ7BDUEOQBMAEMARAAgAGMAbwB1AGwAZQB1AHIAVwBhAHIAbgBhACAATABDAEQATABDAEQAIABlAG4AIABjAG8AbABvAHIATABDAEQAIA4qDjUARgBhAHIAYgAtAEwAQwBEAEMAbwBsAG8AcgAgAEwAQwBEAEwAQwBEACAAQwBvAGwAbwByAGkAZABvAEsAbwBsAG8AcgAgAEwAQwBEA4gDswPHA8EDyQO8A7cAIAO/A7gDzAO9A7cAIABMAEMARABGAOQAcgBnAC0ATABDAEQAUgBlAG4AawBsAGkAIABMAEMARDCrMOkw/ABMAEMARABMAEMARAAgAGEAIABDAG8AcgBlAHN0ZXh0AAAAAENvcHlyaWdodCBBcHBsZSBJbmMuLCAyMDE3AABYWVogAAAAAAAA81IAAQAAAAEWz1hZWiAAAAAAAABl6AAAPBAAAAnQWFlaIAAAAAAAAGqTAACqxQAAF4pYWVogAAAAAAAAJlsAABksAACx0mN1cnYAAAAAAAAEAAAAAAUACgAPABQAGQAeACMAKAAtADIANgA7AEAARQBKAE8AVABZAF4AYwBoAG0AcgB3AHwAgQCGAIsAkACVAJoAnwCjAKgArQCyALcAvADBAMYAywDQANUA2wDgAOUA6wDwAPYA+wEBAQcBDQETARkBHwElASsBMgE4AT4BRQFMAVIBWQFgAWcBbgF1AXwBgwGLAZIBmgGhAakBsQG5AcEByQHRAdkB4QHpAfIB+gIDAgwCFAIdAiYCLwI4AkECSwJUAl0CZwJxAnoChAKOApgCogKsArYCwQLLAtUC4ALrAvUDAAMLAxYDIQMtAzgDQwNPA1oDZgNyA34DigOWA6IDrgO6A8cD0wPgA+wD+QQGBBMEIAQtBDsESARVBGMEcQR+BIwEmgSoBLYExATTBOEE8AT+BQ0FHAUrBToFSQVYBWcF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", lC = {
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
    thumbnail: Cr,
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
    thumbnail: ar
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
    thumbnail: cr
  }
}, sg = (A) => (A || "").match(/^(?:base|overlay|google(?:_(?:roadmap|satellite|hybrid|terrain))?|mapbox|maplibre|osm)$/);
async function hC(A, t) {
  if (typeof A == "string" && (A = lC[A]), A = Wt(Object.assign(A, t)), A.label = A.label || A.year, sg(A.maptype)) {
    const r = A.maptype === "base" ? Ge : A.maptype === "overlay" ? aA : A.maptype === "mapbox" ? oA : A.maptype === "maplibre" ? IA : Zn;
    r.isBasemap() ? (A.homePosition = A.homePos, A.mercZoom = A.defZoom) : (A.homePosition || (A.homePosition = A.homePos), A.mercZoom || (A.mercZoom = A.defZoom)), delete A.homePos, delete A.defZoom, A.zoomRestriction && (A.maxZoom = A.maxZoom || A.mercMaxZoom, A.minZoom = A.minZoom || A.mercMinZoom), A.zoomRestriction = A.mercMaxZoom = A.mercMinZoom = void 0, A.translator && (A.url = A.translator(A.url)), A.imageExtension || (A.imageExtension = "jpg"), A.mapID && !A.url && !A.urls && (A.url = A.tms ? `tiles/${A.mapID}/{z}/{x}/{-y}.${A.imageExtension}` : `tiles/${A.mapID}/{z}/{x}/{y}.${A.imageExtension}`), A.weiwudi = await Mn(A), A.weiwudi && (A.url = A.weiwudi.url, delete A.urls);
    const s = await r.createAsync(A);
    return await s.initialWait, s;
  } else if (A.noload)
    return A.mercMaxZoom = A.mercMinZoom = void 0, new JA(A);
  const e = A.settingFile || `maps/${A.mapID}.json`, n = await fetch(e);
  if (!n.ok)
    throw new Error("Fail to load map json");
  const i = await n.json();
  if (A = Wt(Object.assign(i, A)), A.label = A.label || i.year, A.translator && (A.url = A.translator(A.url)), A.maptype || (A.maptype = "maplat"), sg(A.maptype)) {
    const r = A.maptype === "base" ? Ge : A.maptype === "overlay" ? aA : A.maptype === "mapbox" ? oA : A.maptype === "maplibre" ? IA : Zn;
    r.isBasemap() ? (A.homePosition = A.homePos, A.mercZoom = A.defZoom) : (A.homePosition || (A.homePosition = A.homePos), A.mercZoom || (A.mercZoom = A.defZoom)), delete A.homePos, delete A.defZoom, A.zoomRestriction && (A.maxZoom = A.maxZoom || A.mercMaxZoom, A.minZoom = A.minZoom || A.mercMinZoom), A.zoomRestriction = A.mercMaxZoom = A.mercMinZoom = void 0, A.imageExtension || (A.imageExtension = "jpg"), A.mapID && !A.url && !A.urls && (A.url = A.tms ? `tiles/${A.mapID}/{z}/{x}/{-y}.${A.imageExtension}` : `tiles/${A.mapID}/{z}/{x}/{y}.${A.imageExtension}`), A.weiwudi = await Mn(A), A.weiwudi && (A.url = A.weiwudi.url, delete A.urls);
    const s = await r.createAsync(A);
    try {
      return await s.initialWait, s;
    } catch {
      return s;
    }
  }
  if (delete A.homePos, delete A.defZoom, A.imageExtension || (A.imageExtension = "jpg"), A.mapID && !A.url && !A.urls && (A.url = `tiles/${A.mapID}/{z}/{x}/{y}.${A.imageExtension}`), !A.compiled || !A.compiled.wh)
    throw console.error(
      `[Maplat] Missing compiled.wh for mapID=${A.mapID}. Check map setting file: ${e}`
    ), new Error(`Map ${A.mapID} is missing compiled data.`);
  A.width = A.width || A.compiled.wh[0], A.height = A.height || A.compiled.wh[1], A.weiwudi = await Mn(A), A.weiwudi && (A.url = A.weiwudi.url, delete A.urls);
  const g = await JA.createAsync(A);
  return await g.initialWait, await new Promise((r) => {
    g.setupMapParameter(() => r());
  }), g;
}
async function Mn(A) {
  const t = {};
  if (A.maptype === "mapbox" || A.maptype === "maplibre" || A.maptype === "google" || !A.enableCache) return;
  A.maptype === "base" || A.maptype === "overlay" ? t.type = "wmts" : t.type = "xyz", t.url = A.urls ? A.urls : A.url, t.width = A.width, t.height = A.height, t.maxZoom = A.maxZoom, t.minZoom = A.minZoom;
  const e = A.envelopeLngLats;
  if (e) {
    const i = e.reduce(
      (g, r) => (g[0] = g[0] > r[0] ? r[0] : g[0], g[1] = g[1] < r[0] ? r[0] : g[1], g[2] = g[2] > r[1] ? r[1] : g[2], g[3] = g[3] < r[1] ? r[1] : g[3], g),
      [1 / 0, -1 / 0, 1 / 0, -1 / 0]
    );
    ["minLng", "maxLng", "minLat", "maxLat"].map((g, r) => {
      t[g] = i[r];
    });
  }
  let n;
  try {
    n = await Jt.registerMap(A.mapID, t);
  } catch {
  }
  return n;
}
function En(A, t) {
  return A + (Math.random() - 0.5) * t;
}
function jn(A, t) {
  if (A instanceof Array)
    return A.map((n) => jn(n, t));
  const e = Math.pow(10, t);
  return Math.round(A * e) / e;
}
var Je = { exports: {} }, Rn, og;
function lr() {
  if (og) return Rn;
  og = 1;
  var A = /<%=([\s\S]+?)%>/g;
  return Rn = A, Rn;
}
var xn, Ig;
function uC() {
  if (Ig) return xn;
  Ig = 1;
  var A = lr(), t = "[object Null]", e = "[object Symbol]", n = "[object Undefined]", i = /[&<>"']/g, g = RegExp(i.source), r = /<%-([\s\S]+?)%>/g, s = /<%([\s\S]+?)%>/g, o = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }, I = typeof globalThis == "object" && globalThis && globalThis.Object === Object && globalThis, C = typeof self == "object" && self && self.Object === Object && self, a = I || C || Function("return this")();
  function c(z, ft) {
    for (var Lt = -1, $t = z == null ? 0 : z.length, Ht = Array($t); ++Lt < $t; )
      Ht[Lt] = ft(z[Lt], Lt, z);
    return Ht;
  }
  function d(z) {
    return function(ft) {
      return z == null ? void 0 : z[ft];
    };
  }
  var p = d(o), y = Object.prototype, E = y.hasOwnProperty, T = y.toString, Z = a.Symbol, N = Z ? Z.toStringTag : void 0, F = Z ? Z.prototype : void 0, V = F ? F.toString : void 0, $ = {
    /**
     * Used to detect `data` property values to be HTML-escaped.
     *
     * @memberOf _.templateSettings
     * @type {RegExp}
     */
    escape: r,
    /**
     * Used to detect code to be evaluated.
     *
     * @memberOf _.templateSettings
     * @type {RegExp}
     */
    evaluate: s,
    /**
     * Used to detect `data` property values to inject.
     *
     * @memberOf _.templateSettings
     * @type {RegExp}
     */
    interpolate: A,
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
      _: { escape: Gt }
    }
  };
  function At(z) {
    return z == null ? z === void 0 ? n : t : N && N in Object(z) ? rt(z) : st(z);
  }
  function tt(z) {
    if (typeof z == "string")
      return z;
    if (Y(z))
      return c(z, tt) + "";
    if (mt(z))
      return V ? V.call(z) : "";
    var ft = z + "";
    return ft == "0" && 1 / z == -1 / 0 ? "-0" : ft;
  }
  function rt(z) {
    var ft = E.call(z, N), Lt = z[N];
    try {
      z[N] = void 0;
      var $t = !0;
    } catch {
    }
    var Ht = T.call(z);
    return $t && (ft ? z[N] = Lt : delete z[N]), Ht;
  }
  function st(z) {
    return T.call(z);
  }
  var Y = Array.isArray;
  function ct(z) {
    return z != null && typeof z == "object";
  }
  function mt(z) {
    return typeof z == "symbol" || ct(z) && At(z) == e;
  }
  function Zt(z) {
    return z == null ? "" : tt(z);
  }
  function Gt(z) {
    return z = Zt(z), z && g.test(z) ? z.replace(i, p) : z;
  }
  return xn = $, xn;
}
Je.exports;
var Cg;
function fC() {
  return Cg || (Cg = 1, (function(A, t) {
    var e = lr(), n = uC(), i = 800, g = 16, r = 9007199254740991, s = "[object Arguments]", o = "[object Array]", I = "[object AsyncFunction]", C = "[object Boolean]", a = "[object Date]", c = "[object DOMException]", d = "[object Error]", p = "[object Function]", y = "[object GeneratorFunction]", E = "[object Map]", T = "[object Number]", Z = "[object Null]", N = "[object Object]", F = "[object Proxy]", V = "[object RegExp]", $ = "[object Set]", At = "[object String]", tt = "[object Symbol]", rt = "[object Undefined]", st = "[object WeakMap]", Y = "[object ArrayBuffer]", ct = "[object DataView]", mt = "[object Float32Array]", Zt = "[object Float64Array]", Gt = "[object Int8Array]", z = "[object Int16Array]", ft = "[object Int32Array]", Lt = "[object Uint8Array]", $t = "[object Uint8ClampedArray]", Ht = "[object Uint16Array]", Rt = "[object Uint32Array]", nn = /\b__p \+= '';/g, dA = /\b(__p \+=) '' \+/g, gn = /(__e\(.*?\)|\b__t\)) \+\n'';/g, rn = /[\\^$.*+?()[\]{}|]/g, sn = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, Ze = /^\[object .+?Constructor\]$/, mA = /^(?:0|[1-9]\d*)$/, se = /($^)/, Le = /['\n\r\u2028\u2029\\]/g, et = {};
    et[mt] = et[Zt] = et[Gt] = et[z] = et[ft] = et[Lt] = et[$t] = et[Ht] = et[Rt] = !0, et[s] = et[o] = et[Y] = et[C] = et[ct] = et[a] = et[d] = et[p] = et[E] = et[T] = et[N] = et[V] = et[$] = et[At] = et[st] = !1;
    var on = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    }, pA = typeof globalThis == "object" && globalThis && globalThis.Object === Object && globalThis, In = typeof self == "object" && self && self.Object === Object && self, je = pA || In || Function("return this")(), yA = t && !t.nodeType && t, te = yA && !0 && A && !A.nodeType && A, wA = te && te.exports === yA, Ne = wA && pA.process, vA = (function() {
      try {
        var u = te && te.require && te.require("util").types;
        return u || Ne && Ne.binding && Ne.binding("util");
      } catch {
      }
    })(), bA = vA && vA.isTypedArray;
    function MA(u, w, B) {
      switch (B.length) {
        case 0:
          return u.call(w);
        case 1:
          return u.call(w, B[0]);
        case 2:
          return u.call(w, B[0], B[1]);
        case 3:
          return u.call(w, B[0], B[1], B[2]);
      }
      return u.apply(w, B);
    }
    function EA(u, w) {
      for (var B = -1, W = u == null ? 0 : u.length, q = Array(W); ++B < W; )
        q[B] = w(u[B], B, u);
      return q;
    }
    function xt(u, w) {
      for (var B = -1, W = Array(u); ++B < u; )
        W[B] = w(B);
      return W;
    }
    function ze(u) {
      return function(w) {
        return u(w);
      };
    }
    function Pt(u, w) {
      return EA(w, function(B) {
        return u[B];
      });
    }
    function RA(u) {
      return "\\" + on[u];
    }
    function Fe(u, w) {
      return u == null ? void 0 : u[w];
    }
    function Ue(u, w) {
      return function(B) {
        return u(w(B));
      };
    }
    var Qe = Function.prototype, Yt = Object.prototype, ee = je["__core-js_shared__"], Ae = Qe.toString, pt = Yt.hasOwnProperty, xA = (function() {
      var u = /[^.]+$/.exec(ee && ee.keys && ee.keys.IE_PROTO || "");
      return u ? "Symbol(src)_1." + u : "";
    })(), h = Yt.toString, l = Ae.call(Object), f = RegExp(
      "^" + Ae.call(pt).replace(rn, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ), m = wA ? je.Buffer : void 0, v = je.Symbol, b = Ue(Object.getPrototypeOf, Object), R = Yt.propertyIsEnumerable, D = v ? v.toStringTag : void 0, S = (function() {
      try {
        var u = oe(Object, "defineProperty");
        return u({}, "", {}), u;
      } catch {
      }
    })(), O = m ? m.isBuffer : void 0, L = Ue(Object.keys, Object), P = Math.max, G = Date.now, j = v ? v.prototype : void 0, Q = j ? j.toString : void 0;
    function X(u, w) {
      var B = ai(u), W = !B && Mr(u), q = !B && !W && Er(u), Ct = !B && !W && !q && Pr(u), kt = B || W || q || Ct, ot = kt ? xt(u.length, String) : [], Ft = ot.length;
      for (var Ot in u)
        (w || pt.call(u, Ot)) && !(kt && // Safari 9 has enumerable `arguments.length` in strict mode.
        (Ot == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        q && (Ot == "offset" || Ot == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        Ct && (Ot == "buffer" || Ot == "byteLength" || Ot == "byteOffset") || // Skip index properties.
        PA(Ot, Ft))) && ot.push(Ot);
      return ot;
    }
    function k(u, w, B) {
      var W = u[w];
      (!(pt.call(u, w) && an(W, B)) || B === void 0 && !(w in u)) && x(u, w, B);
    }
    function x(u, w, B) {
      w == "__proto__" && S ? S(u, w, {
        configurable: !0,
        enumerable: !0,
        value: B,
        writable: !0
      }) : u[w] = B;
    }
    function U(u) {
      return u == null ? u === void 0 ? rt : Z : D && D in Object(u) ? Cn(u) : pr(u);
    }
    function K(u) {
      return pe(u) && U(u) == s;
    }
    function J(u) {
      if (!DA(u) || dr(u))
        return !1;
      var w = li(u) ? f : Ze;
      return w.test(br(u));
    }
    function gt(u) {
      return pe(u) && hi(u.length) && !!et[U(u)];
    }
    function H(u) {
      if (!Ci(u))
        return L(u);
      var w = [];
      for (var B in Object(u))
        pt.call(u, B) && B != "constructor" && w.push(B);
      return w;
    }
    function nt(u) {
      if (!DA(u))
        return mr(u);
      var w = Ci(u), B = [];
      for (var W in u)
        W == "constructor" && (w || !pt.call(u, W)) || B.push(W);
      return B;
    }
    function It(u, w) {
      return wr(yr(u, w, fi), u + "");
    }
    var St = S ? function(u, w) {
      return S(u, "toString", {
        configurable: !0,
        enumerable: !1,
        value: kr(w),
        writable: !0
      });
    } : fi;
    function Mt(u) {
      if (typeof u == "string")
        return u;
      if (ai(u))
        return EA(u, Mt) + "";
      if (xr(u))
        return Q ? Q.call(u) : "";
      var w = u + "";
      return w == "0" && 1 / u == -1 / 0 ? "-0" : w;
    }
    function Dt(u, w, B, W) {
      var q = !B;
      B || (B = {});
      for (var Ct = -1, kt = w.length; ++Ct < kt; ) {
        var ot = w[Ct], Ft = W ? W(B[ot], u[ot], ot, B, u) : void 0;
        Ft === void 0 && (Ft = u[ot]), q ? x(B, ot, Ft) : k(B, ot, Ft);
      }
      return B;
    }
    function Bt(u) {
      return It(function(w, B) {
        var W = -1, q = B.length, Ct = q > 1 ? B[q - 1] : void 0, kt = q > 2 ? B[2] : void 0;
        for (Ct = u.length > 3 && typeof Ct == "function" ? (q--, Ct) : void 0, kt && SA(B[0], B[1], kt) && (Ct = q < 3 ? void 0 : Ct, q = 1), w = Object(w); ++W < q; ) {
          var ot = B[W];
          ot && u(w, ot, W, Ct);
        }
        return w;
      });
    }
    function zt(u, w, B, W) {
      return u === void 0 || an(u, Yt[B]) && !pt.call(W, B) ? w : u;
    }
    function oe(u, w) {
      var B = Fe(u, w);
      return J(B) ? B : void 0;
    }
    function Cn(u) {
      var w = pt.call(u, D), B = u[D];
      try {
        u[D] = void 0;
        var W = !0;
      } catch {
      }
      var q = h.call(u);
      return W && (w ? u[D] = B : delete u[D]), q;
    }
    function PA(u, w) {
      var B = typeof u;
      return w = w ?? r, !!w && (B == "number" || B != "symbol" && mA.test(u)) && u > -1 && u % 1 == 0 && u < w;
    }
    function SA(u, w, B) {
      if (!DA(B))
        return !1;
      var W = typeof w;
      return (W == "number" ? cn(B) && PA(w, B.length) : W == "string" && w in B) ? an(B[w], u) : !1;
    }
    function dr(u) {
      return !!xA && xA in u;
    }
    function Ci(u) {
      var w = u && u.constructor, B = typeof w == "function" && w.prototype || Yt;
      return u === B;
    }
    function mr(u) {
      var w = [];
      if (u != null)
        for (var B in Object(u))
          w.push(B);
      return w;
    }
    function pr(u) {
      return h.call(u);
    }
    function yr(u, w, B) {
      return w = P(w === void 0 ? u.length - 1 : w, 0), function() {
        for (var W = arguments, q = -1, Ct = P(W.length - w, 0), kt = Array(Ct); ++q < Ct; )
          kt[q] = W[w + q];
        q = -1;
        for (var ot = Array(w + 1); ++q < w; )
          ot[q] = W[q];
        return ot[w] = B(kt), MA(u, this, ot);
      };
    }
    var wr = vr(St);
    function vr(u) {
      var w = 0, B = 0;
      return function() {
        var W = G(), q = g - (W - B);
        if (B = W, q > 0) {
          if (++w >= i)
            return arguments[0];
        } else
          w = 0;
        return u.apply(void 0, arguments);
      };
    }
    function br(u) {
      if (u != null) {
        try {
          return Ae.call(u);
        } catch {
        }
        try {
          return u + "";
        } catch {
        }
      }
      return "";
    }
    function an(u, w) {
      return u === w || u !== u && w !== w;
    }
    var Mr = K(/* @__PURE__ */ (function() {
      return arguments;
    })()) ? K : function(u) {
      return pe(u) && pt.call(u, "callee") && !R.call(u, "callee");
    }, ai = Array.isArray;
    function cn(u) {
      return u != null && hi(u.length) && !li(u);
    }
    var Er = O || Or;
    function ci(u) {
      if (!pe(u))
        return !1;
      var w = U(u);
      return w == d || w == c || typeof u.message == "string" && typeof u.name == "string" && !Rr(u);
    }
    function li(u) {
      if (!DA(u))
        return !1;
      var w = U(u);
      return w == p || w == y || w == I || w == F;
    }
    function hi(u) {
      return typeof u == "number" && u > -1 && u % 1 == 0 && u <= r;
    }
    function DA(u) {
      var w = typeof u;
      return u != null && (w == "object" || w == "function");
    }
    function pe(u) {
      return u != null && typeof u == "object";
    }
    function Rr(u) {
      if (!pe(u) || U(u) != N)
        return !1;
      var w = b(u);
      if (w === null)
        return !0;
      var B = pt.call(w, "constructor") && w.constructor;
      return typeof B == "function" && B instanceof B && Ae.call(B) == l;
    }
    function xr(u) {
      return typeof u == "symbol" || pe(u) && U(u) == tt;
    }
    var Pr = bA ? ze(bA) : gt;
    function Sr(u) {
      return u == null ? "" : Mt(u);
    }
    var ui = Bt(function(u, w, B, W) {
      Dt(w, Br(w), u, W);
    });
    function Dr(u) {
      return cn(u) ? X(u) : H(u);
    }
    function Br(u) {
      return cn(u) ? X(u, !0) : nt(u);
    }
    function Tr(u, w, B) {
      var W = n.imports._.templateSettings || n;
      B && SA(u, w, B) && (w = void 0), u = Sr(u), w = ui({}, w, W, zt);
      var q = ui({}, w.imports, W.imports, zt), Ct = Dr(q), kt = Pt(q, Ct), ot, Ft, Ot = 0, di = w.interpolate || se, Et = "__p += '", Xr = RegExp(
        (w.escape || se).source + "|" + di.source + "|" + (di === e ? sn : se).source + "|" + (w.evaluate || se).source + "|$",
        "g"
      ), Zr = pt.call(w, "sourceURL") ? "//# sourceURL=" + (w.sourceURL + "").replace(/[\r\n]/g, " ") + `
` : "";
      u.replace(Xr, function(mi, pi, TA, Lr, yi, wi) {
        return TA || (TA = Lr), Et += u.slice(Ot, wi).replace(Le, RA), pi && (ot = !0, Et += `' +
__e(` + pi + `) +
'`), yi && (Ft = !0, Et += `';
` + yi + `;
__p += '`), TA && (Et += `' +
((__t = (` + TA + `)) == null ? '' : __t) +
'`), Ot = wi + mi.length, mi;
      }), Et += `';
`;
      var ln = pt.call(w, "variable") && w.variable;
      ln || (Et = `with (obj) {
` + Et + `
}
`), Et = (Ft ? Et.replace(nn, "") : Et).replace(dA, "$1").replace(gn, "$1;"), Et = "function(" + (ln || "obj") + `) {
` + (ln ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (ot ? ", __e = _.escape" : "") + (Ft ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + Et + `return __p
}`;
      var BA = Gr(function() {
        return Function(Ct, Zr + "return " + Et).apply(void 0, kt);
      });
      if (BA.source = Et, ci(BA))
        throw BA;
      return BA;
    }
    var Gr = It(function(u, w) {
      try {
        return MA(u, void 0, w);
      } catch (B) {
        return ci(B) ? B : new Error(B);
      }
    });
    function kr(u) {
      return function() {
        return u;
      };
    }
    function fi(u) {
      return u;
    }
    function Or() {
      return !1;
    }
    A.exports = Tr;
  })(Je, Je.exports)), Je.exports;
}
var dC = fC();
const hr = /* @__PURE__ */ Yr(dC);
function ag(A, ...t) {
  const e = Wt(Object.assign({}, A));
  if (e.icon) return e;
  const n = t.reduce((i, g) => {
    if (i) return i;
    const r = g.iconTemplate;
    if (r)
      return JSON.parse(hr(r)(e));
    if (g.icon)
      return {
        icon: g.icon,
        selectedIcon: g.selectedIcon
      };
  }, void 0);
  return n && (e.icon = n.icon, e.selectedIcon = n.selectedIcon), e;
}
function cg(A, ...t) {
  return A = Wt(A), A.html ? A : t.reduce((e, n) => {
    if (e) return e;
    const i = n.poiTemplate;
    if (i)
      return A.html = hr(i)(A), A.poiStyle = A.poiStyle || n.poiStyle, A;
  }, void 0) || A;
}
const lt = {
  ACCURACY: "accuracy",
  ALTITUDE: "altitude",
  ALTITUDE_ACCURACY: "altitudeAccuracy",
  HEADING: "heading",
  POSITION: "position",
  SPEED: "speed",
  TRACKING: "tracking",
  TRACKING_OPTIONS: "trackingOptions"
}, mC = {
  ERROR: "error"
};
class pC extends _t {
  constructor(e) {
    super(mC.ERROR);
    M(this, "code");
    M(this, "message");
    this.code = e.code, this.message = e.message;
  }
}
class yC extends ke {
  constructor(e) {
    super();
    M(this, "task_id_");
    M(this, "timer_base_", !1);
    M(this, "home_position_", !1);
    e = e || {}, this.timer_base_ = e.timerBase !== void 0 ? e.timerBase : !1, this.task_id_ = void 0, this.home_position_ = e.homePosition !== void 0 ? e.homePosition : !1, this.addChangeListener(lt.TRACKING, this.handleTrackingChanged_), e.trackingOptions !== void 0 ? this.setTrackingOptions(e.trackingOptions) : this.setTrackingOptions({
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
      longitude: En(this.home_position_[0], 0.05),
      latitude: En(this.home_position_[1], 0.05),
      accuracy: En(15, 10)
    };
    this.positionChange_({ coords: e });
  }
  positionChange_(e) {
    const n = e.coords;
    this.set(lt.ACCURACY, n.accuracy), this.set(
      lt.ALTITUDE,
      n.altitude === null ? void 0 : n.altitude
    ), this.set(
      lt.ALTITUDE_ACCURACY,
      n.altitudeAccuracy === null ? void 0 : n.altitudeAccuracy
    ), this.set(
      lt.HEADING,
      n.heading === null ? void 0 : Pe(n.heading)
    ), this.set(lt.POSITION, [n.longitude, n.latitude]), this.set(lt.SPEED, n.speed === null ? void 0 : n.speed), this.changed();
  }
  timerPositionError_() {
    const e = Math.floor(Math.random() * 3) + 1, n = {
      code: e,
      message: e === 1 ? "User denied Geolocation" : e === 2 ? "Position unavailable" : "Timeout expired"
    };
    this.positionError_(n);
  }
  positionError_(e) {
    const n = new pC(e);
    this.dispatchEvent(n);
  }
  getAccuracy() {
    return this.get(lt.ACCURACY);
  }
  getAltitude() {
    return this.get(lt.ALTITUDE);
  }
  getAltitudeAccuracy() {
    return this.get(lt.ALTITUDE_ACCURACY);
  }
  getHeading() {
    return this.get(lt.HEADING);
  }
  getPosition() {
    return this.get(lt.POSITION);
  }
  getSpeed() {
    return this.get(lt.SPEED);
  }
  getTracking() {
    return this.get(lt.TRACKING);
  }
  getTrackingOptions() {
    return this.get(lt.TRACKING_OPTIONS);
  }
  setTracking(e) {
    this.set(lt.TRACKING, e);
  }
  setTrackingOptions(e) {
    this.set(lt.TRACKING_OPTIONS, e);
  }
}
const ur = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjcyNTIxMjZFMDJBMTExRTBCOTNGRTVBRkM1QzM1Qjc5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjcyNTIxMjZGMDJBMTExRTBCOTNGRTVBRkM1QzM1Qjc5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzI1MjEyNkMwMkExMTFFMEI5M0ZFNUFGQzVDMzVCNzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzI1MjEyNkQwMkExMTFFMEI5M0ZFNUFGQzVDMzVCNzkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4RaveOAAAB1UlEQVR42qzUTyikcRzH8d+OsUNbSOTvgW2LREqjHKSk9FjZxAGXlXJQDsqNokRzcebiRC5mT8tllBE7LlzYKBHFJpKMkD+7hvH+6ftMT4M0Y3/1uswzz+d5nu/3+/t9CAaD6n8uu/L5lHK5XroWjwI4kYWP8GMdv3H47A6nk8CDA6U8nvBLX/Ed+TjDEe7lAS24wE+M4zR0180NgXa7NSgOvajHKvqwZglMxBfUoBmVlv/wTXxU0O1WuoqIgQvLaIJDfn9NISbhRd7Tb4ahbJa3a0QthjCFv2/UfwNduJKv0jUOBSajDb8wE0FTdf1GUAzDGliOdExEMSleedsGxJiBZdiVC5GuABbxGZm2p1lUKg1/dOOjnGf9IglIsUkxY3H+jg1yIc136MBb6WjqOwLNe6904AP2kSuDG80qkW15YjZlCdkojSLsEyqwiWMzcAVbaJV6RrK+IQc/dB3NwGuMohAdEYQVoROz8FkHW68FCW1Hv4zS68eeUnWyS/YwLL1Q9rA/jsn4dEtd5mRo9WlzJ03Tda6S7TaPQWmIPCkQCH+6Ww5RfR5WowmX+IckOca2MYBp2SmW8zCb5hpGeKjuWA8yZEulSbP8sqN2JPjZif0owACin4C7wCjG6AAAAABJRU5ErkJggg==", fr = "data:image/png;base64,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", wC = {
  osm: Cr,
  gsi: ar,
  gsi_ortho: cr,
  redcircle: ur,
  defaultpin_selected: fr,
  defaultpin: gi,
  bluedot: qg,
  bluedot_transparent: _g,
  bluedot_small: $g
}, vC = {
  "setting-loaded": "onSettingLoaded",
  "appdata-ready": "onAppdataReady",
  "ui-configure": "onUiConfigure",
  "core-dom-ready": "onCoreDomReady",
  "ui-dom-ready": "onUiDomReady",
  "core-ready": "onCoreReady",
  "ui-ready": "onUiReady"
};
class bC extends _t {
  constructor(e) {
    super("gps_error");
    M(this, "detail");
    this.detail = e;
  }
}
class He extends _t {
  constructor(e) {
    super("gps_result");
    M(this, "detail");
    this.detail = e;
  }
}
class MC extends _t {
  constructor() {
    super("gps_request");
  }
}
class cA extends Dg {
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
    // Changed to boolean
    M(this, "stateBuffer", {});
    M(this, "mobileMapMoveBuffer");
    M(this, "overlay", !0);
    M(this, "waitReady");
    // Changed to Promise<any> to match settingLoader
    M(this, "changeMapSeq");
    M(this, "appData");
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
    M(this, "initialGpsMove_", !1);
    M(this, "__backMapMoving", !1);
    M(this, "__selectedMarker");
    M(this, "uiHooks");
    M(this, "lifecycleHookResults", {});
    M(this, "__init", !0);
    M(this, "__redrawMarkerBlock", !1);
    M(this, "__redrawMarkerThrottle", []);
    M(this, "__transparency");
    M(this, "lastClickEvent");
    e = Wt(e), this.appid = e.appid || "sample";
    const n = e.mapboxgl || (typeof window < "u" ? window.mapboxgl : void 0);
    n && e.mapboxToken && (n.accessToken = e.mapboxToken), e.googleApiKey && (this.googleApiKey = e.googleApiKey), this.mapDiv = e.div || "map_div", this.mapDivDocument = document.querySelector(`#${this.mapDiv}`), this.mapDivDocument.classList.add("maplat"), this.logger = new Hr(
      e.debug ? qe.ALL : qe.INFO
    ), this.enableCache = e.enableCache || !1, this.icon = e.icon, this.selectedIcon = e.selectedIcon, this.translateUI = e.translateUI, this.uiHooks = e.uiHooks;
    const i = e.setting;
    if (e.restore)
      e.restoreSession && (this.restoreSession = !0), this.initialRestore = e.restore;
    else if (e.restoreSession) {
      this.restoreSession = !0;
      const o = parseInt(localStorage.getItem("epoch") || "0"), I = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
      o && I - o < 3600 && (this.initialRestore.mapID = localStorage.getItem("mapID") || localStorage.getItem("sourceID") || void 0, this.initialRestore.backgroundID = localStorage.getItem("backgroundID") || localStorage.getItem("backID") || void 0, this.initialRestore.position = {
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
    [...We(`<img id="center_circle" class="prevent-default" alt=""
            style="position:absolute;top:50%;left:50%;margin-top:-10px;
            margin-left:-10px;" src="${ur}">`)].reverse().forEach((o) => {
      this.mapDivDocument.insertBefore(
        o,
        this.mapDivDocument.firstChild
      );
    });
    const r = "maplat-core-style";
    if (!document.getElementById(r)) {
      const o = document.createElement("style");
      o.id = r, o.innerHTML = `
        .maplat * {
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
      `, document.head.appendChild(o);
    }
    this.mapDivDocument.querySelectorAll(".prevent-default").forEach((o) => {
      o.addEventListener("touchstart", (I) => {
        I.preventDefault();
      });
    }), this.overlay = "overlay" in e ? e.overlay : !0, this.overlay && this.mapDivDocument.classList.add("with-opacity"), this.waitReady = (async () => {
      const o = await this.settingLoader(i);
      return this.handleSetting(o, e);
    })();
  }
  buildLifecycleContext(e, n) {
    return {
      phaseId: e,
      appData: n ?? this.appData,
      mapDivDocument: this.mapDivDocument,
      core: this,
      uiHookResults: { ...this.lifecycleHookResults }
    };
  }
  async runLifecyclePhase(e, n) {
    var s, o, I, C, a;
    (o = (s = this.logger) == null ? void 0 : s.debug) == null || o.call(s, `lifecycle:${e}`);
    const i = this.buildLifecycleContext(e, n), g = vC[e], r = (I = this.uiHooks) == null ? void 0 : I[g];
    if (r)
      try {
        const c = await r(i);
        this.lifecycleHookResults[e] = c, i.uiHookResult = c, i.uiHookResults = { ...this.lifecycleHookResults };
      } catch (c) {
        throw (a = (C = this.logger) == null ? void 0 : C.debug) == null || a.call(C, `lifecycle:error:${e}`), this.dispatchEvent(new yt("lifecycle:error", { phaseId: e, error: c })), c;
      }
    return this.dispatchEvent(
      new yt(`lifecycle:${e}`, i)
    ), i;
  }
  // Async initializers 1: Load application setting
  async settingLoader(e) {
    return e || (await fetch(`apps/${this.appid}.json`)).json();
  }
  // Async initializer 6: Load pois setting => move to normalize_pois.js
  // Async initializer 8: Load sources setting asynchronous
  async sourcesLoader(e) {
    const n = this.appData.sources, i = [], g = {
      homePos: e.homePos,
      defZoom: e.defZoom,
      zoomRestriction: e.zoomRestriction,
      mercMinZoom: e.mercMinZoom,
      mercMaxZoom: e.mercMaxZoom,
      enableCache: this.enableCache,
      key: this.googleApiKey,
      mapboxMap: this.mapboxMap,
      // Pass mapbox map instance
      maplibreMap: this.maplibreMap
      // Pass maplibre map instance
    };
    return n.forEach((r) => {
      i.push(hC(r, g));
    }), Promise.all(i);
  }
  // Async initializers 2: Handle application setting
  async handleSetting(e, n) {
    await this.runLifecyclePhase("setting-loaded", e), this.appData = Wt(e), await this.runLifecyclePhase("appdata-ready"), await this.runLifecyclePhase("ui-configure");
    const i = await this.prepareMap(n);
    await this.runLifecyclePhase("ui-dom-ready");
    const g = await fg(this.appData.pois || [], this);
    await this.handlePois(g, i), this.initGeolocation(n);
  }
  // Async Initializers 2.5: For geolocation settings
  initGeolocation(e) {
    this.alwaysGpsOn = e.alwaysGpsOn || !1;
    const n = this.geolocation = new yC({
      timerBase: e.fake,
      homePosition: this.appData.homePosition
    });
    this.alwaysGpsOn ? (n.setTracking(!0), this.gpsEnabled_ = !0, this.initialGpsMove_ = !0) : (n.setTracking(!1), this.gpsEnabled_ = !1), n.on("change", () => {
      (async () => {
        const i = this.mapObject, g = i.getLayer("overlay").getLayers().item(0), r = i.getLayers().item(0), s = g ? g.getSource() : r.getSource(), o = n.getPosition(), I = n.getAccuracy();
        if (!o || !I) return;
        let C = !this.moveTo_ && !this.firstGpsRequest_;
        this.alwaysGpsOn && (C = !this.initialGpsMove_);
        const a = await s.setGPSMarkerAsync({ lnglat: o, acc: I }, C);
        this.moveTo_ = !1, this.firstGpsRequest_ = !1, this.initialGpsMove_ = !1, a || (this.alwaysGpsOn || this.handleGPS(!1, !0), s.setGPSMarker());
        const c = this.alwaysGpsOn ? "gps_out_hide" : "gps_out";
        this.dispatchEvent(new He(a ? { lnglat: o, acc: I } : { error: c }));
      })();
    }), n.on("error", (i) => {
      const g = i.code;
      if (g === 3) return;
      n.setTracking(!1), this.gpsEnabled_ = !1;
      const r = this.mapObject, s = r.getLayer("overlay").getLayers().item(0), o = r.getLayers().item(0);
      (s ? s.getSource() : o.getSource()).setGPSMarker(), this.dispatchEvent(new bC(g === 1 ? "user_gps_deny" : g === 2 ? "gps_miss" : "gps_timeout")), this.dispatchEvent(new He({ error: "gps_off" }));
    }), this.addEventListener("mapChanged", () => {
      (async () => {
        if (n.getTracking()) {
          const i = this.mapObject, g = i.getLayer("overlay").getLayers().item(0), r = i.getLayers().item(0), s = g ? g.getSource() : r.getSource(), o = n.getPosition(), I = n.getAccuracy();
          if (!o || !I) return;
          const C = await s.setGPSMarkerAsync({ lnglat: o, acc: I }, !0);
          C || (this.alwaysGpsOn || this.handleGPS(!1, !0), s.setGPSMarker());
          const a = this.alwaysGpsOn ? "gps_out_hide" : "gps_out";
          this.dispatchEvent(new He(C ? { lnglat: o, acc: I } : { error: a }));
        }
      })();
    });
  }
  // GPS handling methods
  handleGPS(e, n = !1) {
    if (this.geolocation) {
      if (e)
        if (!this.alwaysGpsOn)
          this.firstGpsRequest_ = !0, this.geolocation.setTracking(!0), this.gpsEnabled_ = !0, this.dispatchEvent(new MC());
        else {
          const i = this.geolocation.getPosition(), g = this.geolocation.getAccuracy();
          if (i && g) {
            const r = this.mapObject, s = r.getLayer("overlay").getLayers().item(0), o = r.getLayers().item(0), I = s ? s.getSource() : o.getSource();
            (async () => await I.setGPSMarkerAsync({ lnglat: i, acc: g }, !1) || (I.setGPSMarker(), this.dispatchEvent(new He({ error: "gps_out" }))))();
          }
        }
      else if (!this.alwaysGpsOn) {
        this.geolocation.setTracking(!1), this.gpsEnabled_ = !1;
        const i = this.mapObject, g = i.getLayer("overlay").getLayers().item(0), r = i.getLayers().item(0);
        (g ? g.getSource() : r.getSource()).setGPSMarker(), n || this.dispatchEvent(new He({ error: "gps_off" }));
      }
    }
  }
  getGPSEnabled() {
    return this.gpsEnabled_;
  }
  // Async initializers 5: Prepare map base elements and objects
  async prepareMap(e) {
    e = Wt(e), this.mercBuffer = null;
    const n = this.appData.homePosition, i = this.appData.defaultZoom, g = this.appData.zoomRestriction, r = this.appData.minZoom, s = this.appData.maxZoom;
    this.appName = this.appData.appName;
    const o = e.fake ? this.appData.fakeGps : !1, I = e.fake ? this.appData.fakeRadius : !1;
    this.noRotate = e.noRotate || this.appData.noRotate || !1, this.poiTemplate = e.poiTemplate || this.appData.poiTemplate || !1, this.poiStyle = e.poiStyle || this.appData.poiStyle || !1, this.iconTemplate = e.iconTemplate || this.appData.iconTemplate || !1, this.currentPosition = null, this.__init = !0;
    const C = `${this.mapDiv}_front`;
    let a = We(
      `<div id="${C}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;"></div>`
    )[0];
    this.mapDivDocument.insertBefore(a, this.mapDivDocument.firstChild), this.fakeGps = o, this.fakeRadius = I, this.homePosition = n, this.mapObject = new CA({
      div: C,
      controls: this.appData.controls || [],
      interactions: this.noRotate ? ig({ altShiftDragRotate: !1, pinchRotate: !1 }) : ig().extend([
        new GI({
          condition: bI
        })
      ]),
      fakeGps: o,
      fakeRadius: I,
      homePosition: n,
      northUp: e.northUp || this.appData.northUp || !1,
      tapDuration: e.tapDuration || this.appData.tapDuration || 3e3,
      homeMarginPixels: e.homeMarginPixels || this.appData.homeMarginPixels || 50,
      tapUIVanish: e.tapUIVanish || this.appData.tapUIVanish || !1,
      alwaysGpsOn: e.alwaysGpsOn || !1
    });
    let c = null;
    this.overlay && (c = `${this.mapDiv}_back`, a = We(
      `<div id="${c}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;"></div>`
    )[0], this.mapDivDocument.insertBefore(
      a,
      this.mapDivDocument.firstChild
    ), this.backMap = new CA({
      off_control: !0,
      div: c
    }));
    const d = e.mapboxgl || (typeof window < "u" ? window.mapboxgl : void 0);
    if (d) {
      const y = `${this.mapDiv}_mapbox`;
      a = We(
        `<div id="${y}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;visibility:hidden;"></div>`
      )[0], this.mapDivDocument.insertBefore(
        a,
        this.mapDivDocument.firstChild
      ), this.mapboxMap = new d.Map({
        attributionControl: !1,
        boxZoom: !1,
        container: y,
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
    const p = e.maplibregl || (typeof window < "u" ? window.maplibregl : void 0);
    if (p) {
      const y = `${this.mapDiv}_maplibre`;
      a = We(
        `<div id="${y}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;visibility:hidden;"></div>`
      )[0], this.mapDivDocument.insertBefore(
        a,
        this.mapDivDocument.firstChild
      ), this.maplibreMap = new p.Map({
        attributionControl: !1,
        boxZoom: !1,
        container: y,
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
      homePos: n,
      defZoom: i,
      zoomRestriction: g,
      mercMinZoom: r,
      mercMaxZoom: s
    };
  }
  // Async initializer 7: Handle pois loading result
  async handlePois(e, n) {
    this.pois = e;
    const i = await this.sourcesLoader(n);
    return this.handleSources(i);
  }
  // Async initializer 9: Handle sources loading result
  async handleSources(e) {
    this.mercSrc = e.reduce((i, g) => {
      if (i) return i;
      if (g.isBasemap()) return g;
    }, null);
    const n = [];
    this.cacheHash = {}, e.forEach((i) => {
      if (i.setMap(this.mapObject), i.isMapbox()) {
        if (!this.mapboxMap)
          throw "To use Mapbox based maps, you need to include Mapbox GL JS and provide it via mapboxgl option.";
        i.mapboxMap = this.mapboxMap;
      } else if (i.isMapLibre && i.isMapLibre()) {
        if (!this.maplibreMap)
          throw "To use MapLibre based maps, you need to include MapLibre GL JS and provide it via maplibregl option.";
        i.maplibreMap = this.maplibreMap;
      }
      n.push(i), this.cacheHash[i.mapID] = i;
    }), this.dispatchEvent(new yt("sourceLoaded", e)), await this.setInitialMap(n), this.setMapClick(), this.setPointerEvents(), this.setMapOnOff(), this.setMouseCursor(), this.setBackMapBehavior(), this.raiseChangeViewpoint(), await this.runLifecyclePhase("core-ready"), await this.runLifecyclePhase("ui-ready");
  }
  // Async initializer 10: Handle initial map
  async setInitialMap(e) {
    const n = this.initialRestore.mapID || this.startFrom || e[e.length - 1].mapID;
    this.from = e.reduce(
      (i, g) => i ? !(i instanceof rr) && g.mapID != n ? g : i : g.mapID != n ? g : i,
      void 0
    ), await this.changeMap(n, this.initialRestore);
  }
  // Async initializer 11: Handle map click event
  setMapClick() {
    this.mapObject.on("click", (e) => {
      this.logger.debug(e.pixel), this.lastClickEvent = e;
      const n = [];
      if (e.target.forEachFeatureAtPixel(e.pixel, (i) => {
        this.logger.debug(e.pixel), i.get("datum") && n.push(i.get("datum"));
      }), n.length > 0)
        this.dispatchEvent(new yt("clickMarker", n[0])), this.dispatchEvent(new yt("clickMarkers", n));
      else {
        const i = e.coordinate;
        this.dispatchEvent(new yt("clickMapXy", i)), this.from.sysCoord2MercAsync(i).then((g) => {
          this.dispatchEvent(new yt("clickMapMerc", g));
          const r = Tt(g, "EPSG:3857", "EPSG:4326");
          this.dispatchEvent(
            new yt("clickMap", {
              longitude: r[0],
              latitude: r[1]
            })
          );
        });
      }
    });
  }
  // Async initializer 12: Handle pointer event
  setPointerEvents() {
    let e, n = !1, i = !1;
    const g = {}, r = (s) => {
      this.dispatchEvent(new yt("pointerMoveOnMapXy", s)), this.from.sysCoord2MercAsync(s).then((o) => {
        if (this.dispatchEvent(new yt("pointerMoveOnMapMerc", o)), e) {
          const I = e;
          e = !1, r(I);
        } else
          n = !1;
      });
    };
    this.mapObject.on("pointermove", (s) => {
      i || (n ? e = s.coordinate : (n = !0, r(s.coordinate)));
    }), this.mapObject.on("pointerdown", (s) => {
      s.originalEvent && s.originalEvent.pointerId != null && (g[s.originalEvent.pointerId] = !0), i = !0;
    }), this.mapObject.on("pointerdrag", (s) => {
      s.originalEvent && s.originalEvent.pointerId != null && (g[s.originalEvent.pointerId] = !0), i = !0;
    }), this.mapObject.on("pointerup", (s) => {
      s.originalEvent && s.originalEvent.pointerId != null ? (delete g[s.originalEvent.pointerId], Object.keys(g).length == 0 && (i = !1)) : s.originalEvent && s.originalEvent.touches ? s.originalEvent.touches.length == 0 && (i = !1) : i = !1;
    });
  }
  // Async initializer 13: Handle map UI on/off
  setMapOnOff() {
    let e;
    const n = () => this.mapDivDocument.querySelectorAll(".ol-control"), i = (r) => {
      r.forEach((s) => s.classList.add("fade"));
    }, g = (r) => {
      r.forEach((s) => s.classList.remove("fade"));
    };
    this.mapObject.on("click", () => {
      e && (clearTimeout(e), e = void 0);
      const r = n(), s = r.length && r[0].classList.contains("fade");
      !this.mapObject.tapUIVanish || s ? g(r) : (i(r), e = setTimeout(() => {
        e = void 0, g(n());
      }, this.mapObject.tapDuration));
    }), this.mapObject.on("pointerdrag", () => {
      e && (clearTimeout(e), e = void 0), i(n());
    }), this.mapObject.on("moveend", () => {
      e && (clearTimeout(e), e = void 0), e = setTimeout(() => {
        e = void 0, g(n());
      }, this.mapObject.tapDuration);
    });
  }
  // Async initializer 14: Handle mouse cursor
  setMouseCursor() {
    const e = (i) => {
      const g = i.target.getEventPixel(i.originalEvent), r = i.target.hasFeatureAtPixel(g), s = i.target.getTarget();
      if (r) {
        const o = i.target.forEachFeatureAtPixel(
          i.pixel,
          (I) => {
            if (I.get("datum")) return I;
          }
        );
        this.mapDivDocument.querySelector(`#${s}`).style.cursor = o ? "pointer" : "";
        return;
      }
      this.mapDivDocument.querySelector(`#${s}`).style.cursor = "";
    };
    this.mapObject.on("pointermove", e);
    const n = (i) => {
      let g = i.frameState.viewState.center;
      const r = this.from;
      r.insideCheckSysCoord(g) || (g = r.modulateSysCoordInside(
        g
      ), i.target.getView().setCenter(g));
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
      const i = this.backMap.getSource();
      i && (this.__backMapMoving = !0, this.logger.debug("Backmap moving started"), this.convertParametersFromCurrent(i, (g) => {
        const r = this.backMap.getView();
        r.setCenter(g[0]), r.setZoom(g[1]), r.setRotation(this.noRotate ? 0 : g[2]), this.logger.debug("Backmap moving ended"), this.__backMapMoving = !1;
      }));
    };
    this.mapObject.on("postrender", e);
  }
  // Async initializer 16: Handle back map's behavior
  raiseChangeViewpoint() {
    this.mapObject.on("postrender", async (e) => {
      const n = this.mapObject.getView(), i = n.getCenter(), g = n.getDecimalZoom(), r = Bi(n.getRotation() * 180 / Math.PI), s = await this.from.viewpoint2MercsAsync(), o = await this.mercSrc.mercs2ViewpointAsync(s);
      if (this.mobileMapMoveBuffer && this.mobileMapMoveBuffer[0][0] == o[0][0] && this.mobileMapMoveBuffer[0][1] == o[0][1] && this.mobileMapMoveBuffer[1] == o[1] && this.mobileMapMoveBuffer[2] == o[2]) return;
      this.mobileMapMoveBuffer = o;
      const I = Tt(o[0], "EPSG:3857", "EPSG:4326"), C = Bi(o[2] * 180 / Math.PI);
      this.dispatchEvent(
        new yt("changeViewpoint", {
          x: i[0],
          y: i[1],
          longitude: I[0],
          latitude: I[1],
          mercator_x: o[0][0],
          mercator_y: o[0][1],
          zoom: g,
          mercZoom: o[1],
          direction: C,
          rotation: r
        })
      ), this.requestUpdateState({
        position: {
          x: i[0],
          y: i[1],
          zoom: g,
          rotation: r
        }
      });
    });
  }
  currentMapInfo() {
    return Ti(this.from);
  }
  mapInfo(e) {
    return Ti(this.cacheHash[e]);
  }
  async clientPointToLngLat(e, n) {
    if (!this.from || !this.mapObject) return;
    const g = this.mapObject.getViewport().getBoundingClientRect(), r = [e - g.left, n - g.top], s = this.mapObject.getCoordinateFromPixel(r);
    if (!s) return;
    const o = await this.from.sysCoord2MercAsync(s), I = Tt(o, "EPSG:3857", "EPSG:4326");
    return {
      longitude: I[0],
      latitude: I[1]
    };
  }
  async lngLatToClientPoint(e, n) {
    if (!this.from || !this.mapObject) return;
    const i = Tt([e, n], "EPSG:4326", "EPSG:3857"), g = await this.from.merc2SysCoordAsync(i), r = this.mapObject.getPixelFromCoordinate(g);
    if (!r) return;
    const s = this.mapObject.getViewport().getBoundingClientRect();
    return {
      x: r[0] + s.left,
      y: r[1] + s.top
    };
  }
  setMarker(e) {
    this.logger.debug(e);
    const n = e.lnglat || [
      e.lng || e.longitude,
      e.lat || e.latitude
    ], i = e.x, g = e.y, r = e.coordinates, s = this.from, o = e.icon ? this.__selectedMarker == e.namespaceID && e.selectedIcon ? e.selectedIcon : e.icon : this.__selectedMarker == e.namespaceID ? fr : gi;
    return (r ? (function() {
      return s.merc2SysCoordAsync_ignoreBackground(
        r
      );
    })() : i && g ? new Promise((C) => {
      C(s.xy2SysCoord([i, g]));
    }) : (function() {
      const C = Tt(n, "EPSG:4326", "EPSG:3857");
      return s.merc2SysCoordAsync_ignoreBackground(
        C
      );
    })()).then((C) => {
      C && s.insideCheckSysCoord(C) && this.mapObject.setMarker(C, { datum: e }, o);
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
    const i = (g, r = !1) => Promise.all(
      g.map((s) => Array.isArray(s[0]) ? i(s, r) : (r && (s = Tt(s, "EPSG:4326", "EPSG:3857")), this.from.merc2SysCoordAsync(s)))
    );
    e.coordinates ? n = i(e.coordinates) : n = i(e.lnglats, !0), n.then((g) => {
      this.mapObject.setVector(g, e.type, e.style);
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
      const i = this.__redrawMarkerThrottle;
      if (i.length == 0 || i[i.length - 1] !== e) {
        i.push(e);
        return;
      }
    }
    this.__redrawMarkerBlock = !0;
    const n = (i) => {
      const g = [];
      this.resetMarker();
      let r;
      if (!this.stateBuffer.hideMarker) {
        for (const o of Object.keys(this.pois)) {
          const I = this.pois[o];
          if (!I.hide)
            for (const C of I.pois) {
              const a = ag(C, I, this);
              cg(a, I, this), this.__selectedMarker == a.namespaceID ? r = a : g.push(this.setMarker(a));
            }
        }
        if (i.pois)
          for (const o of Object.keys(i.pois)) {
            const I = i.pois[o];
            if (!I.hide)
              for (const C of I.pois) {
                const a = ag(C, I, i, this);
                cg(a, I, i, this), this.__selectedMarker == a.namespaceID ? r = a : g.push(this.setMarker(a));
              }
          }
      }
      let s = Promise.all(g);
      r && (s = s.then(() => this.setMarker(r))), s.then(() => {
        this.__redrawMarkerThrottle && this.__redrawMarkerThrottle.length > 0 ? n(this.__redrawMarkerThrottle.shift()) : this.__redrawMarkerBlock = !1;
      });
    };
    n(e);
  }
  selectMarker(e) {
    const n = this.getMarker(e);
    if (!n) return;
    this.__selectedMarker = e;
    const i = {
      latitude: n.lnglat ? n.lnglat[1] : n.lat ? n.lat : n.latitude,
      longitude: n.lnglat ? n.lnglat[0] : n.lng ? n.lng : n.longitude
    };
    this.setViewpoint(i), this.redrawMarkers();
  }
  unselectMarker() {
    delete this.__selectedMarker, this.redrawMarkers();
  }
  getMarker(e) {
    if (e.includes("#")) {
      const n = e.split("#"), i = this.cacheHash[n[0]];
      return i == null ? void 0 : i.getPoi(n[1]);
    } else {
      for (const n of Object.keys(this.pois))
        for (const i of this.pois[n].pois)
          if (i.id === e)
            return i;
      return;
    }
  }
  updateMarker(e, n, i) {
    const g = this.getMarker(e);
    if (g) {
      if (n = $e(n || {}), i) {
        for (const r of Object.keys(g))
          r !== "id" && r !== "namespaceID" && delete g[r];
        Object.assign(g, n);
      } else
        for (const r of Object.keys(n))
          r === "id" || r === "namespaceID" || (n[r] === "____delete____" ? delete g[r] : g[r] = n[r]);
      this.redrawMarkers();
    }
  }
  addMarker(e, n) {
    if (n || (n = "main"), n.includes("#")) {
      const i = n.split("#"), g = this.cacheHash[i[0]];
      if (g) {
        const r = g.addPoi(e, i[1]);
        return this.dispatchPoiNumber(), this.redrawMarkers(), r;
      }
    } else if (this.pois[n])
      return this.pois[n].pois.push($e(e)), zn(this.pois, n, {
        name: this.appName
      }), this.dispatchPoiNumber(), this.redrawMarkers(), e.namespaceID;
  }
  removeMarker(e) {
    if (e.includes("#")) {
      const n = e.split("#"), i = this.cacheHash[n[0]];
      i && (i.removePoi(n[1]), this.dispatchPoiNumber(), this.redrawMarkers());
    } else
      for (const n of Object.keys(this.pois))
        for (let i = 0; i < this.pois[n].pois.length; i++)
          this.pois[n].pois[i].id === e && (delete this.pois[n].pois[i], this.dispatchPoiNumber(), this.redrawMarkers());
  }
  clearMarker(e) {
    if (e || (e = "main"), e.includes("#")) {
      const n = e.split("#"), i = this.cacheHash[n[0]];
      i && (i.clearPoi(n[1]), this.dispatchPoiNumber(), this.redrawMarkers());
    } else {
      if (e === "all")
        for (const n of Object.keys(this.pois))
          this.pois[n].pois = [];
      else if (this.pois[e])
        this.pois[e].pois = [];
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
      new yt(
        "poi_number",
        this.listPoiLayers(!1, !0).reduce(
          (e, n) => e + n.pois.length,
          0
        )
      )
    );
  }
  listPoiLayers(e = !1, n = !1) {
    const i = Object.keys(this.pois).sort((r, s) => r === "main" ? -1 : s === "main" ? 1 : r < s ? -1 : r > s ? 1 : 0).map((r) => this.pois[r]).filter(
      (r) => n ? e ? r.pois.length && r.hide : r.pois.length : e ? r.hide : !0
    ), g = this.from.listPoiLayers(
      e,
      n
    );
    return i.concat(g);
  }
  showPoiLayer(e) {
    const n = this.getPoiLayer(e);
    n && (delete n.hide, this.requestUpdateState({
      hideLayer: this.listPoiLayers(!0).map((i) => i.namespaceID).join(",")
    }), this.redrawMarkers());
  }
  hidePoiLayer(e) {
    const n = this.getPoiLayer(e);
    n && (n.hide = !0, this.requestUpdateState({
      hideLayer: this.listPoiLayers(!0).map((i) => i.namespaceID).join(",")
    }), this.redrawMarkers());
  }
  getPoiLayer(e) {
    if (e.includes("#")) {
      const n = e.split("#"), i = this.cacheHash[n[0]];
      if (i)
        return i.getPoiLayer(n[1]);
    } else
      return this.pois[e];
  }
  addPoiLayer(e, n) {
    if (e !== "main" && !this.pois[e])
      if (!e.includes("#"))
        this.pois[e] = ce(n || [], e, {
          name: this.appName
        }), this.redrawMarkers();
      else {
        const i = e.split("#"), g = this.cacheHash[i[0]];
        g && (g.addPoiLayer(i[1], n), this.redrawMarkers());
      }
  }
  removePoiLayer(e) {
    if (e !== "main" && this.pois[e])
      if (!e.includes("#"))
        delete this.pois[e], this.requestUpdateState({
          hideLayer: this.listPoiLayers(!0).map((n) => n.namespaceID).join(",")
        }), this.dispatchPoiNumber(), this.redrawMarkers();
      else {
        const n = e.split("#"), i = this.cacheHash[n[0]];
        i && (i.removePoiLayer(n[1]), this.requestUpdateState({
          hideLayer: this.listPoiLayers(!0).map((g) => g.namespaceID).join(",")
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
    const i = this.mercSrc, g = this.cacheHash[e];
    return g ? (this.changeMapSeq || (this.changeMapSeq = Promise.resolve()), this.changeMapSeq = this.changeMapSeq.then(
      () => new Promise((r, s) => {
        this.convertParametersFromCurrent(g, (o) => {
          let I = null, C = null;
          const a = n.backgroundID ? this.cacheHash[n.backgroundID] : void 0;
          if (this.backMap && (I = this.backMap.getSource(), g.isWmts() ? this.backMap.exchangeSource() : (a ? (C = a, this.backMap.exchangeSource(C)) : I ? C = I : (C = i, this.from.isWmts() && (C = this.from instanceof aA ? this.mapObject.getSource() : (
            // If current foreground is TMS overlay, set current basemap as new background
            this.from
          )), this.backMap.exchangeSource(C)), this.requestUpdateState({ backgroundID: C.mapID }))), g instanceof aA) {
            if (this.mapObject.setLayer(g), a)
              this.mapObject.exchangeSource(a);
            else if (!this.from.isWmts()) {
              const p = I || i;
              this.mapObject.exchangeSource(p);
            }
            this.requestUpdateState({
              backgroundID: this.mapObject.getSource().mapID
            });
          } else
            this.mapObject.setLayer(), this.mapObject.exchangeSource(g);
          const c = {
            mapID: g.mapID
          };
          g.isBasemap() && (c.backgroundID = "____delete____"), this.requestUpdateState(c), this.from = g, this.dispatchPoiNumber();
          const d = this.mapObject.getView();
          this.appData.zoomRestriction && (d.setMaxZoom(g.maxZoom), d.setMinZoom(g.minZoom || 0)), o && g.insideCheckSysCoord(o[0]) ? (d.setCenter(o[0]), d.setZoom(o[1]), d.setRotation(this.noRotate ? 0 : o[2])) : this.__init ? o || this.goHome(g) : (this.dispatchEvent(new yt("outOfMap", {})), this.goHome(g)), g.setGPSMarker(this.currentPosition, !0), n.hideLayer && (n.hideLayer.split(",").map((y) => {
            const E = this.getPoiLayer(y);
            E && (E.hide = !0);
          }), this.requestUpdateState({ hideLayer: n.hideLayer })), n.hideMarker ? this.hideAllMarkers() : this.redrawMarkers(), this.resetVector(), this.vectors.forEach((p) => {
            this.setVector(p);
          }), this.dispatchEvent(
            new yt("mapChanged", this.getMapMeta(g.mapID))
          ), this.mapObject.updateSize(), this.mapObject.render(), n.position && (this.__init = !1, g.setViewpoint(n.position)), n.transparency && this.setTransparency(n.transparency), this.__init ? (this.__init = !1, this.goHome(g)) : this.backMap && C && this.convertParametersFromCurrent(C, (p) => {
            const y = this.backMap.getView();
            y.setCenter(p[0]), y.setZoom(p[1]), y.setRotation(this.noRotate ? 0 : p[2]), this.backMap.updateSize(), this.backMap.render();
          }), r(void 0);
        });
      })
    )) : (this.logger.warn(`changeMap: mapID "${e}" not found in cacheHash`), Promise.resolve());
  }
  requestUpdateState(e) {
    if (this.stateBuffer = Object.assign(this.stateBuffer, e), this.stateBuffer.backgroundID == "____delete____" && delete this.stateBuffer.backgroundID, this.restoreSession) {
      const n = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
      localStorage.setItem("epoch", `${n}`);
      const i = function(g) {
        Object.keys(g).map((r) => {
          r == "position" ? i(g[r]) : r == "backgroundID" && g[r] == "____delete____" ? localStorage.removeItem(r) : localStorage.setItem(r, g[r]);
        });
      };
      i(e);
    }
    this.timer && clearTimeout(this.timer), this.timer = setTimeout(() => {
      this.timer = void 0, this.dispatchEvent(new yt("updateState", this.stateBuffer));
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
      return eA.reduce(
        (i, g) => (i[g] = n.get(g), i),
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
    let i;
    if (e ? i = this.cacheHash[e] : i = this.from, !i) {
      n("stop", {});
      return;
    }
    await i.fetchAllTileCacheAsync(n);
  }
  async cancelMapTileCacheAsync(e) {
    let n;
    e ? n = this.cacheHash[e] : n = this.from, n && await n.cancelTileCacheAsync();
  }
  convertParametersFromCurrent(e, n) {
    const i = this.mapObject.getView();
    if (!this.from) {
      n && n();
      return;
    }
    let g = this.from.viewpoint2MercsAsync();
    const r = jn(
      [i.getCenter(), i.getZoom(), i.getRotation()],
      10
    );
    if (this.mercBuffer && this.mercBuffer.mercs && this.mercBuffer.buffer[this.from.mapID]) {
      const s = this.mercBuffer.buffer[this.from.mapID];
      s[0][0] == r[0][0] && s[0][1] == r[0][1] && s[1] == r[1] && s[2] == r[2] ? (this.logger.debug(s), this.logger.debug(r), this.logger.debug("From: Use buffer"), g = new Promise((o, I) => {
        o(this.mercBuffer.mercs);
      })) : (this.mercBuffer = {
        buffer: {}
      }, this.mercBuffer.buffer[this.from.mapID] = r);
    } else
      this.mercBuffer = {
        buffer: {}
      }, this.mercBuffer.buffer[this.from.mapID] = r;
    this.logger.debug(
      `From: Center: ${r[0]} Zoom: ${r[1]} Rotation: ${r[2]}`
    ), this.logger.debug(`From: ${this.from.mapID}`), g.then((s) => {
      this.mercBuffer.mercs = s, this.logger.debug(`Mercs: ${s}`);
      let o = e.mercs2ViewpointAsync(s);
      const I = e.mapID;
      this.mercBuffer.buffer[I] && (this.logger.debug("To: Use buffer"), o = new Promise((C, a) => {
        C(this.mercBuffer.buffer[I]);
      })), o.then((C) => {
        this.logger.debug(
          `To: Center: ${C[0]} Zoom: ${C[1]} Rotation: ${C[2]}`
        ), this.logger.debug(`To: ${e.mapID}`), this.mercBuffer.buffer[e.mapID] = jn(C, 10), n(C);
      }).catch((C) => {
        throw C;
      });
    }).catch((s) => {
      throw s;
    });
  }
  remove() {
    this.mapboxMap && this.mapboxMap.remove(), this.mapDivDocument.innerHTML = "", this.mapDivDocument.classList.remove("maplat");
  }
}
// Static method declaration
M(cA, "createObject");
cA.createObject = function(A) {
  return new Promise((t) => {
    const e = new cA(A);
    e.waitReady.then(() => {
      t(e);
    });
  });
};
if (typeof window < "u") {
  const A = {
    createObject: cA.createObject
  };
  window.Maplat = A, window.MaplatApp = cA, window.assets = wC;
}
export {
  yt as CustomEvent,
  bC as GPSErrorEvent,
  MC as GPSRequestEvent,
  He as GPSResultEvent,
  cA as MaplatApp,
  wC as assets,
  We as createElement
};
//# sourceMappingURL=maplat_core.js.map
