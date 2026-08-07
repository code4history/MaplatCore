import { transform as ee, toLonLat as Yi, Projection as jg, addProjection as Di, addCoordinateTransforms as Fn, getTransform as ci, identityTransform as li } from "ol/proj";
import { View as Ts, Map as Zg, Feature as Fg } from "ol";
import { Vector as Sn, Group as Ug, Tile as hi } from "ol/layer";
import { XYZ as Ss, Google as zg, Vector as Pn } from "ol/source";
import { Style as ue, Icon as xA, Stroke as Bi, Fill as Oi } from "ol/style";
class Re {
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
let zt = class extends Re {
  detail;
  constructor(t, e) {
    super(t), this.detail = e;
  }
};
const Wg = ["ALL", "OFF"], qA = {
  ALL: -99,
  DEBUG: -1,
  INFO: 0,
  WARN: 1,
  ERROR: 2,
  OFF: 99
};
class Hg {
  constructor(t = qA.INFO) {
    this.level = t, this.make();
  }
  level;
  make() {
    const t = Object.keys(qA).filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (e) => !Wg.includes(e)
    );
    for (const e of t) {
      const n = qA[e], i = e.toLowerCase();
      this[i] = this.level <= n ? console.log : () => {
      };
    }
  }
}
function Qg(A, t) {
  return A.isMapbox() ? t.mapboxMap ? (A.mapboxMap = t.mapboxMap, !0) : (t.warn?.(
    "Mapbox GL JS is not available; skipping Mapbox source:",
    A.mapID
  ), !1) : typeof A.isMapLibre == "function" && A.isMapLibre() ? t.maplibreMap ? (A.maplibreMap = t.maplibreMap, !0) : (t.warn?.(
    "MapLibre GL JS is not available; skipping MapLibre source:",
    A.mapID
  ), !1) : !0;
}
function Yg(A) {
  return A && A.__esModule && Object.prototype.hasOwnProperty.call(A, "default") ? A.default : A;
}
var VA = { exports: {} }, Vg = VA.exports, yr;
function _g() {
  return yr || (yr = 1, (function(A, t) {
    (function(e, n) {
      n(t);
    })(Vg, (function(e) {
      function n(f, u, d = {}) {
        const y = { type: "Feature" };
        return (d.id === 0 || d.id) && (y.id = d.id), d.bbox && (y.bbox = d.bbox), y.properties = u || {}, y.geometry = f, y;
      }
      function i(f, u, d = {}) {
        if (!f) throw new Error("coordinates is required");
        if (!Array.isArray(f)) throw new Error("coordinates must be an Array");
        if (f.length < 2) throw new Error("coordinates must be at least 2 numbers long");
        if (!g(f[0]) || !g(f[1])) throw new Error("coordinates must contain numbers");
        return n({ type: "Point", coordinates: f }, u, d);
      }
      function r(f, u, d = {}) {
        for (const y of f) {
          if (y.length < 4) throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
          if (y[y.length - 1].length !== y[0].length) throw new Error("First and last Position are not equivalent.");
          for (let M = 0; M < y[y.length - 1].length; M++) if (y[y.length - 1][M] !== y[0][M]) throw new Error("First and last Position are not equivalent.");
        }
        return n({ type: "Polygon", coordinates: f }, u, d);
      }
      function s(f, u = {}) {
        const d = { type: "FeatureCollection" };
        return u.id && (d.id = u.id), u.bbox && (d.bbox = u.bbox), d.features = f, d;
      }
      function g(f) {
        return !isNaN(f) && f !== null && !Array.isArray(f);
      }
      function o(f) {
        if (!f) throw new Error("coord is required");
        if (!Array.isArray(f)) {
          if (f.type === "Feature" && f.geometry !== null && f.geometry.type === "Point") return [...f.geometry.coordinates];
          if (f.type === "Point") return [...f.coordinates];
        }
        if (Array.isArray(f) && f.length >= 2 && !Array.isArray(f[0]) && !Array.isArray(f[1])) return [...f];
        throw new Error("coord must be GeoJSON Point or an Array of numbers");
      }
      function a(f) {
        if (Array.isArray(f)) return f;
        if (f.type === "Feature") {
          if (f.geometry !== null) return f.geometry.coordinates;
        } else if (f.coordinates) return f.coordinates;
        throw new Error("coords must be GeoJSON Feature, Geometry Object or an Array");
      }
      function I(f) {
        return f.type === "Feature" ? f.geometry : f;
      }
      const c = 11102230246251565e-32, h = 134217729, m = (3 + 8 * c) * c;
      function b(f, u, d, y, M) {
        let R, S, L, P, G = u[0], F = y[0], B = 0, k = 0;
        F > G == F > -G ? (R = G, G = u[++B]) : (R = F, F = y[++k]);
        let z = 0;
        if (B < f && k < d) for (F > G == F > -G ? (S = G + R, L = R - (S - G), G = u[++B]) : (S = F + R, L = R - (S - F), F = y[++k]), R = S, L !== 0 && (M[z++] = L); B < f && k < d; ) F > G == F > -G ? (S = R + G, P = S - R, L = R - (S - P) + (G - P), G = u[++B]) : (S = R + F, P = S - R, L = R - (S - P) + (F - P), F = y[++k]), R = S, L !== 0 && (M[z++] = L);
        for (; B < f; ) S = R + G, P = S - R, L = R - (S - P) + (G - P), G = u[++B], R = S, L !== 0 && (M[z++] = L);
        for (; k < d; ) S = R + F, P = S - R, L = R - (S - P) + (F - P), F = y[++k], R = S, L !== 0 && (M[z++] = L);
        return (R !== 0 || z === 0) && (M[z++] = R), z;
      }
      function v(f, u) {
        let d = u[0];
        for (let y = 1; y < f; y++) d += u[y];
        return d;
      }
      function T(f) {
        return new Float64Array(f);
      }
      const O = (3 + 16 * c) * c, Z = (2 + 12 * c) * c, Q = (9 + 64 * c) * c * c, U = T(4), Y = T(8), nt = T(12), tt = T(16), _ = T(4);
      function pt(f, u, d, y, M, R, S) {
        let L, P, G, F, B, k, z, K, N, D, x, J, et, it, ot, $, at, Et;
        const Nt = f - M, mt = d - M, Gt = u - R, Ut = y - R;
        it = Nt * Ut, k = h * Nt, z = k - (k - Nt), K = Nt - z, k = h * Ut, N = k - (k - Ut), D = Ut - N, ot = K * D - (it - z * N - K * N - z * D), $ = Gt * mt, k = h * Gt, z = k - (k - Gt), K = Gt - z, k = h * mt, N = k - (k - mt), D = mt - N, at = K * D - ($ - z * N - K * N - z * D), x = ot - at, B = ot - x, U[0] = ot - (x + B) + (B - at), J = it + x, B = J - it, et = it - (J - B) + (x - B), x = et - $, B = et - x, U[1] = et - (x + B) + (B - $), Et = J + x, B = Et - J, U[2] = J - (Et - B) + (x - B), U[3] = Et;
        let st = v(4, U), Vt = Z * S;
        if (st >= Vt || -st >= Vt || (B = f - Nt, L = f - (Nt + B) + (B - M), B = d - mt, G = d - (mt + B) + (B - M), B = u - Gt, P = u - (Gt + B) + (B - R), B = y - Ut, F = y - (Ut + B) + (B - R), L === 0 && P === 0 && G === 0 && F === 0) || (Vt = Q * S + m * Math.abs(st), st += Nt * F + Ut * L - (Gt * G + mt * P), st >= Vt || -st >= Vt)) return st;
        it = L * Ut, k = h * L, z = k - (k - L), K = L - z, k = h * Ut, N = k - (k - Ut), D = Ut - N, ot = K * D - (it - z * N - K * N - z * D), $ = P * mt, k = h * P, z = k - (k - P), K = P - z, k = h * mt, N = k - (k - mt), D = mt - N, at = K * D - ($ - z * N - K * N - z * D), x = ot - at, B = ot - x, _[0] = ot - (x + B) + (B - at), J = it + x, B = J - it, et = it - (J - B) + (x - B), x = et - $, B = et - x, _[1] = et - (x + B) + (B - $), Et = J + x, B = Et - J, _[2] = J - (Et - B) + (x - B), _[3] = Et;
        const IA = b(4, U, 4, _, Y);
        it = Nt * F, k = h * Nt, z = k - (k - Nt), K = Nt - z, k = h * F, N = k - (k - F), D = F - N, ot = K * D - (it - z * N - K * N - z * D), $ = Gt * G, k = h * Gt, z = k - (k - Gt), K = Gt - z, k = h * G, N = k - (k - G), D = G - N, at = K * D - ($ - z * N - K * N - z * D), x = ot - at, B = ot - x, _[0] = ot - (x + B) + (B - at), J = it + x, B = J - it, et = it - (J - B) + (x - B), x = et - $, B = et - x, _[1] = et - (x + B) + (B - $), Et = J + x, B = Et - J, _[2] = J - (Et - B) + (x - B), _[3] = Et;
        const CA = b(IA, Y, 4, _, nt);
        it = L * F, k = h * L, z = k - (k - L), K = L - z, k = h * F, N = k - (k - F), D = F - N, ot = K * D - (it - z * N - K * N - z * D), $ = P * G, k = h * P, z = k - (k - P), K = P - z, k = h * G, N = k - (k - G), D = G - N, at = K * D - ($ - z * N - K * N - z * D), x = ot - at, B = ot - x, _[0] = ot - (x + B) + (B - at), J = it + x, B = J - it, et = it - (J - B) + (x - B), x = et - $, B = et - x, _[1] = et - (x + B) + (B - $), Et = J + x, B = Et - J, _[2] = J - (Et - B) + (x - B), _[3] = Et;
        const xe = b(CA, nt, 4, _, tt);
        return tt[xe - 1];
      }
      function yt(f, u, d, y, M, R) {
        const S = (u - R) * (d - M), L = (f - M) * (y - R), P = S - L, G = Math.abs(S + L);
        return Math.abs(P) >= O * G ? P : -pt(f, u, d, y, M, R, G);
      }
      function lt(f, u) {
        var d, y, M = 0, R, S, L, P, G, F, B, k = f[0], z = f[1], K = u.length;
        for (d = 0; d < K; d++) {
          y = 0;
          var N = u[d], D = N.length - 1;
          if (F = N[0], F[0] !== N[D][0] && F[1] !== N[D][1]) throw new Error("First and last coordinates in a ring must be the same");
          for (S = F[0] - k, L = F[1] - z, y; y < D; y++) {
            if (B = N[y + 1], P = B[0] - k, G = B[1] - z, L === 0 && G === 0) {
              if (P <= 0 && S >= 0 || S <= 0 && P >= 0) return 0;
            } else if (G >= 0 && L <= 0 || G <= 0 && L >= 0) {
              if (R = yt(S, P, L, G, 0, 0), R === 0) return 0;
              (R > 0 && G > 0 && L <= 0 || R < 0 && G <= 0 && L > 0) && M++;
            }
            F = B, L = G, S = P;
          }
        }
        return M % 2 !== 0;
      }
      function dt(f, u, d = {}) {
        if (!f) throw new Error("point is required");
        if (!u) throw new Error("polygon is required");
        const y = o(f), M = I(u), R = M.type, S = u.bbox;
        let L = M.coordinates;
        if (S && wt(y, S) === !1) return !1;
        R === "Polygon" && (L = [L]);
        let P = !1;
        for (var G = 0; G < L.length; ++G) {
          const F = lt(y, L[G]);
          if (F === 0) return !d.ignoreBoundary;
          F && (P = !0);
        }
        return P;
      }
      function wt(f, u) {
        return u[0] <= f[0] && u[1] <= f[1] && u[2] >= f[0] && u[3] >= f[1];
      }
      function Zt(f, u) {
        for (let d = 0; d < u.features.length; d++) if (dt(f, u.features[d])) return u.features[d];
      }
      function ae(f, u, d) {
        const y = u.geometry.coordinates[0][0], M = u.geometry.coordinates[0][1], R = u.geometry.coordinates[0][2], S = f.geometry.coordinates, L = u.properties.a.geom, P = u.properties.b.geom, G = u.properties.c.geom, F = [M[0] - y[0], M[1] - y[1]], B = [R[0] - y[0], R[1] - y[1]], k = [S[0] - y[0], S[1] - y[1]], z = [P[0] - L[0], P[1] - L[1]], K = [G[0] - L[0], G[1] - L[1]];
        let N = (B[1] * k[0] - B[0] * k[1]) / (F[0] * B[1] - F[1] * B[0]), D = (F[0] * k[1] - F[1] * k[0]) / (F[0] * B[1] - F[1] * B[0]);
        if (d) {
          const x = d[u.properties.a.index], J = d[u.properties.b.index], et = d[u.properties.c.index];
          let it;
          if (N < 0 || D < 0 || 1 - N - D < 0) {
            const ot = N / (N + D), $ = D / (N + D);
            it = N / J / (ot / J + $ / et), D = D / et / (ot / J + $ / et);
          } else it = N / J / (N / J + D / et + (1 - N - D) / x), D = D / et / (N / J + D / et + (1 - N - D) / x);
          N = it;
        }
        return [N * z[0] + D * K[0] + L[0], N * z[1] + D * K[1] + L[1]];
      }
      function H(f, u, d, y) {
        const M = f.geometry.coordinates, R = d.geometry.coordinates, S = Math.atan2(M[0] - R[0], M[1] - R[1]), L = Ie(S, u[0]);
        if (L === void 0) throw new Error("Unable to determine vertex index");
        const P = u[1][L];
        return ae(f, P.features[0], y);
      }
      function Rt(f, u, d, y, M, R, S, L) {
        let P;
        if (S && (P = Zt(f, s([S]))), !P) if (d) {
          const G = f.geometry.coordinates, F = d.gridNum, B = d.xOrigin, k = d.yOrigin, z = d.xUnit, K = d.yUnit, N = d.gridCache, D = bt(G[0], B, z, F), x = bt(G[1], k, K, F), J = N[D] ? N[D][x] ? N[D][x] : [] : [], et = s(J.map((it) => u.features[it]));
          P = Zt(f, et);
        } else P = Zt(f, u);
        return L && L(P), P ? ae(f, P, R) : H(f, y, M, R);
      }
      function bt(f, u, d, y) {
        let M = Math.floor((f - u) / d);
        return M < 0 && (M = 0), M >= y && (M = y - 1), M;
      }
      function Ie(f, u) {
        let d = ne(f - u[0]), y = Math.PI * 2, M;
        for (let R = 0; R < u.length; R++) {
          const S = (R + 1) % u.length, L = ne(f - u[S]), P = Math.min(Math.abs(d), Math.abs(L));
          d * L <= 0 && P < y && (y = P, M = R), d = L;
        }
        return M;
      }
      function ne(f, u = !1) {
        const d = 2 * Math.PI, y = f - Math.floor(f / d) * d;
        return u ? y : y > Math.PI ? y - d : y;
      }
      function iA(f) {
        const u = f.features;
        for (let d = 0; d < u.length; d++) {
          const y = u[d];
          `${y.properties.a.index}`.substring(0, 1) === "b" && `${y.properties.b.index}`.substring(0, 1) === "b" ? u[d] = { geometry: { type: "Polygon", coordinates: [[y.geometry.coordinates[0][2], y.geometry.coordinates[0][0], y.geometry.coordinates[0][1], y.geometry.coordinates[0][2]]] }, properties: { a: { geom: y.properties.c.geom, index: y.properties.c.index }, b: { geom: y.properties.a.geom, index: y.properties.a.index }, c: { geom: y.properties.b.geom, index: y.properties.b.index } }, type: "Feature" } : `${y.properties.c.index}`.substring(0, 1) === "b" && `${y.properties.a.index}`.substring(0, 1) === "b" && (u[d] = { geometry: { type: "Polygon", coordinates: [[y.geometry.coordinates[0][1], y.geometry.coordinates[0][2], y.geometry.coordinates[0][0], y.geometry.coordinates[0][1]]] }, properties: { a: { geom: y.properties.b.geom, index: y.properties.b.index }, b: { geom: y.properties.c.geom, index: y.properties.c.index }, c: { geom: y.properties.a.geom, index: y.properties.a.index } }, type: "Feature" });
        }
        return f;
      }
      function Ct(f) {
        const u = ["a", "b", "c", "a"].map((R) => f.properties[R].geom), d = f.geometry.coordinates[0], y = f.properties, M = { a: { geom: d[0], index: y.a.index }, b: { geom: d[1], index: y.b.index }, c: { geom: d[2], index: y.c.index } };
        return r([u], M);
      }
      function NA(f) {
        const u = [0, 1, 2, 0].map((y) => f[y][0][0]), d = { a: { geom: f[0][0][1], index: f[0][1] }, b: { geom: f[1][0][1], index: f[1][1] }, c: { geom: f[2][0][1], index: f[2][1] } };
        return r([u], d);
      }
      function Fe(f, u, d, y, M, R = !1, S) {
        const L = f.map((P) => {
          (!S || S < 2.00703) && (P = rA(P));
          const G = isFinite(P) ? u[P] : P === "c" ? y : (function() {
            const F = P.match(/^b(\d+)$/);
            if (F) return M[parseInt(F[1])];
            const B = P.match(/^e(\d+)$/);
            if (B) return d[parseInt(B[1])];
            throw new Error("Bad index value for indexesToTri");
          })();
          return R ? [[G[1], G[0]], P] : [[G[0], G[1]], P];
        });
        return NA(L);
      }
      function rA(f) {
        return typeof f == "number" ? f : f.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
      }
      function sA(f, u) {
        return u && u >= 2.00703 || Array.isArray(f[0]) ? f : f.map((d) => [d.illstNodes, d.mercNodes, d.startEnd]);
      }
      const Ue = 2.00703;
      function gA(f) {
        return !!(f.version !== void 0 || !f.tins && f.points && f.tins_points);
      }
      function oA(f) {
        return { points: f.points, pointsWeightBuffer: aA(f), strictStatus: gt(f), verticesParams: ze(f), centroid: We(f), edges: sA(f.edges || []), edgeNodes: f.edgeNodes || [], tins: ht(f), kinks: me(f.kinks_points), yaxisMode: f.yaxisMode ?? "invert", strictMode: f.strictMode ?? "auto", vertexMode: f.vertexMode, bounds: f.bounds, boundsPolygon: f.boundsPolygon, wh: f.wh, xy: f.xy ?? [0, 0] };
      }
      function GA(f) {
        const u = Se(f), d = u.tins;
        return { compiled: u, tins: d, points: Jt(d), strictStatus: u.strict_status, pointsWeightBuffer: u.weight_buffer, verticesParams: u.vertices_params, centroid: u.centroid, kinks: u.kinks };
      }
      function aA(f) {
        return !f.version || f.version < Ue ? ["forw", "bakw"].reduce((u, d) => {
          const y = f.weight_buffer[d];
          return y && (u[d] = Object.keys(y).reduce((M, R) => {
            const S = rA(R);
            return M[S] = y[R], M;
          }, {})), u;
        }, {}) : f.weight_buffer;
      }
      function gt(f) {
        return f.strict_status ? f.strict_status : f.kinks_points ? "strict_error" : f.tins_points.length === 2 ? "loose" : "strict";
      }
      function ze(f) {
        const u = { forw: [f.vertices_params[0]], bakw: [f.vertices_params[1]] };
        return u.forw[1] = V(f, !1), u.bakw[1] = V(f, !0), u;
      }
      function V(f, u) {
        const d = f.vertices_points.length;
        return Array.from({ length: d }, (y, M) => {
          const R = (M + 1) % d, S = Fe(["c", `b${M}`, `b${R}`], f.points, f.edgeNodes || [], f.centroid_point, f.vertices_points, u, Ue);
          return s([S]);
        });
      }
      function We(f) {
        return { forw: i(f.centroid_point[0], { target: { geom: f.centroid_point[1], index: "c" } }), bakw: i(f.centroid_point[1], { target: { geom: f.centroid_point[0], index: "c" } }) };
      }
      function ht(f) {
        const u = f.tins_points.length === 1 ? 0 : 1;
        return { forw: s(f.tins_points[0].map((d) => Fe(d, f.points, f.edgeNodes || [], f.centroid_point, f.vertices_points, !1, f.version))), bakw: s(f.tins_points[u].map((d) => Fe(d, f.points, f.edgeNodes || [], f.centroid_point, f.vertices_points, !0, f.version))) };
      }
      function me(f) {
        if (f) return { bakw: s(f.map((u) => i(u))) };
      }
      function Se(f) {
        return JSON.parse(JSON.stringify(f).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"'));
      }
      function Jt(f) {
        const u = [], d = f.forw.features;
        for (let y = 0; y < d.length; y++) {
          const M = d[y];
          ["a", "b", "c"].forEach((R, S) => {
            const L = M.geometry.coordinates[0][S], P = M.properties[R].geom, G = M.properties[R].index;
            typeof G == "number" && (u[G] = [L, P]);
          });
        }
        return u;
      }
      const Ce = Ue;
      class vt {
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
        pointsWeightBuffer;
        strict_status;
        vertices_params;
        centroid;
        edgeNodes;
        edges;
        tins;
        kinks;
        yaxisMode = vt.YAXIS_INVERT;
        strictMode = vt.MODE_AUTO;
        vertexMode = vt.VERTEX_PLAIN;
        bounds;
        boundsPolygon;
        wh;
        xy;
        indexedTins;
        stateFull = !1;
        stateTriangle;
        stateBackward;
        priority;
        importance;
        xyBounds;
        mercBounds;
        constructor() {
        }
        setCompiled(u) {
          if (gA(u)) {
            this.applyModernState(oA(u));
            return;
          }
          this.applyLegacyState(GA(u));
        }
        applyModernState(u) {
          this.points = u.points, this.pointsWeightBuffer = u.pointsWeightBuffer, this.strict_status = u.strictStatus, this.vertices_params = u.verticesParams, this.centroid = u.centroid, this.edges = u.edges, this.edgeNodes = u.edgeNodes || [], this.tins = u.tins, this.addIndexedTin(), this.kinks = u.kinks, this.yaxisMode = u.yaxisMode ?? vt.YAXIS_INVERT, this.vertexMode = u.vertexMode ?? vt.VERTEX_PLAIN, this.strictMode = u.strictMode ?? vt.MODE_AUTO, u.bounds ? (this.bounds = u.bounds, this.boundsPolygon = u.boundsPolygon, this.xy = u.xy, this.wh = u.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = u.xy ?? [0, 0], u.wh && (this.wh = u.wh));
        }
        applyLegacyState(u) {
          this.tins = u.tins, this.addIndexedTin(), this.strict_status = u.strictStatus, this.pointsWeightBuffer = u.pointsWeightBuffer, this.vertices_params = u.verticesParams, this.centroid = u.centroid, this.kinks = u.kinks, this.points = u.points;
        }
        addIndexedTin() {
          const u = this.tins, d = u.forw, y = u.bakw, M = Math.ceil(Math.sqrt(d.features.length));
          if (M < 3) {
            this.indexedTins = void 0;
            return;
          }
          let R = [], S = [];
          const L = d.features.map((N) => {
            let D = [];
            return a(N)[0].map((x) => {
              R.length === 0 ? R = [Array.from(x), Array.from(x)] : (x[0] < R[0][0] && (R[0][0] = x[0]), x[0] > R[1][0] && (R[1][0] = x[0]), x[1] < R[0][1] && (R[0][1] = x[1]), x[1] > R[1][1] && (R[1][1] = x[1])), D.length === 0 ? D = [Array.from(x), Array.from(x)] : (x[0] < D[0][0] && (D[0][0] = x[0]), x[0] > D[1][0] && (D[1][0] = x[0]), x[1] < D[0][1] && (D[0][1] = x[1]), x[1] > D[1][1] && (D[1][1] = x[1]));
            }), D;
          }), P = (R[1][0] - R[0][0]) / M, G = (R[1][1] - R[0][1]) / M, F = L.reduce((N, D, x) => {
            const J = bt(D[0][0], R[0][0], P, M), et = bt(D[1][0], R[0][0], P, M), it = bt(D[0][1], R[0][1], G, M), ot = bt(D[1][1], R[0][1], G, M);
            for (let $ = J; $ <= et; $++) {
              N[$] || (N[$] = []);
              for (let at = it; at <= ot; at++) N[$][at] || (N[$][at] = []), N[$][at].push(x);
            }
            return N;
          }, []), B = y.features.map((N) => {
            let D = [];
            return a(N)[0].map((x) => {
              S.length === 0 ? S = [Array.from(x), Array.from(x)] : (x[0] < S[0][0] && (S[0][0] = x[0]), x[0] > S[1][0] && (S[1][0] = x[0]), x[1] < S[0][1] && (S[0][1] = x[1]), x[1] > S[1][1] && (S[1][1] = x[1])), D.length === 0 ? D = [Array.from(x), Array.from(x)] : (x[0] < D[0][0] && (D[0][0] = x[0]), x[0] > D[1][0] && (D[1][0] = x[0]), x[1] < D[0][1] && (D[0][1] = x[1]), x[1] > D[1][1] && (D[1][1] = x[1]));
            }), D;
          }), k = (S[1][0] - S[0][0]) / M, z = (S[1][1] - S[0][1]) / M, K = B.reduce((N, D, x) => {
            const J = bt(D[0][0], S[0][0], k, M), et = bt(D[1][0], S[0][0], k, M), it = bt(D[0][1], S[0][1], z, M), ot = bt(D[1][1], S[0][1], z, M);
            for (let $ = J; $ <= et; $++) {
              N[$] || (N[$] = []);
              for (let at = it; at <= ot; at++) N[$][at] || (N[$][at] = []), N[$][at].push(x);
            }
            return N;
          }, []);
          this.indexedTins = { forw: { gridNum: M, xOrigin: R[0][0], yOrigin: R[0][1], xUnit: P, yUnit: G, gridCache: F }, bakw: { gridNum: M, xOrigin: S[0][0], yOrigin: S[0][1], xUnit: k, yUnit: z, gridCache: K } };
        }
        transform(u, d, y) {
          if (!this.tins) throw new Error("setCompiled() must be called before transform()");
          if (d && this.strict_status == vt.STATUS_ERROR) throw new Error('Backward transform is not allowed if strict_status == "strict_error"');
          this.yaxisMode == vt.YAXIS_FOLLOW && d && (u = [u[0], -1 * u[1]]);
          const M = i(u);
          if (this.bounds && !d && !y && !dt(M, this.boundsPolygon)) return !1;
          const R = d ? this.tins.bakw : this.tins.forw, S = d ? this.indexedTins.bakw : this.indexedTins.forw, L = d ? this.vertices_params.bakw : this.vertices_params.forw, P = d ? this.centroid.bakw : this.centroid.forw, G = d ? this.pointsWeightBuffer.bakw : this.pointsWeightBuffer.forw;
          let F, B;
          this.stateFull && (this.stateBackward == d ? F = this.stateTriangle : (this.stateBackward = d, this.stateTriangle = void 0), B = (z) => {
            this.stateTriangle = z;
          });
          let k = Rt(M, R, S, L, P, G, F, B);
          if (this.bounds && d && !y) {
            const z = i(k);
            if (!dt(z, this.boundsPolygon)) return !1;
          } else this.yaxisMode == vt.YAXIS_FOLLOW && !d && (k = [k[0], -1 * k[1]]);
          return k;
        }
      }
      const St = 20037508342789244e-9, Pe = [[0, 0], [0, 1], [1, 0], [0, -1], [-1, 0]];
      function Ft(f, u) {
        return Math.floor(Math.min(f[0], f[1]) / 4) * St / 128 / Math.pow(2, u);
      }
      function Yt(f, u) {
        const d = [];
        for (let y = 0; y < f.length; y++) {
          const M = f[y], R = M[0] * Math.cos(u) - M[1] * Math.sin(u), S = M[0] * Math.sin(u) + M[1] * Math.cos(u);
          d.push([R, S]);
        }
        return d;
      }
      function qt(f, u, d, y) {
        const M = Ft(y, u);
        return Yt(Pe, d).map((R) => [R[0] * M + f[0], R[1] * M + f[1]]);
      }
      function ce(f, u) {
        const d = f[0], y = f.slice(1, 5).map((k) => [k[0] - d[0], k[1] - d[1]]), M = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        let R = 0, S = 0, L = 0;
        for (let k = 0; k < 4; k++) {
          const z = y[k], K = M[k], N = Math.sqrt(Math.pow(z[0], 2) + Math.pow(z[1], 2));
          R += N;
          const D = z[0] * K[1] - z[1] * K[0], x = Math.acos((z[0] * K[0] + z[1] * K[1]) / N), J = D > 0 ? -1 * x : x;
          S += Math.cos(J), L += Math.sin(J);
        }
        const P = R / 4, G = Math.atan2(L, S), F = Math.floor(Math.min(u[0], u[1]) / 4), B = Math.log(F * St / 128 / P) / Math.log(2);
        return { center: d, zoom: B, rotation: G };
      }
      function ie(f, u) {
        const d = f[0] * (2 * St) / u - St, y = -1 * (f[1] * (2 * St) / u - St);
        return [d, y];
      }
      function le(f, u) {
        const d = (f[0] + St) * u / (2 * St), y = (-f[1] + St) * u / (2 * St);
        return [d, y];
      }
      const pe = 256;
      class he {
        mainTin = null;
        subTins = [];
        _maxxy = 0;
        setMapData(u) {
          const d = new vt();
          if (d.setCompiled(u.compiled), this.mainTin = d, u.maxZoom !== void 0) this._maxxy = Math.pow(2, u.maxZoom) * pe;
          else if (u.compiled.wh) {
            const y = Math.max(u.compiled.wh[0], u.compiled.wh[1]), M = Math.ceil(Math.log2(y / pe));
            this._maxxy = Math.pow(2, M) * pe;
          }
          if (this.subTins = [], u.sub_maps) for (const y of u.sub_maps) {
            const M = new vt();
            M.setCompiled(y.compiled);
            const R = y.bounds ?? y.compiled.bounds;
            if (!R) throw new Error("SubMapData must have bounds or compiled.bounds to create xyBounds polygon");
            const S = [...R, R[0]], L = S.map((P) => {
              const G = M.transform(P, !1);
              if (!G) throw new Error("Failed to transform sub-map bounds to mercator");
              return G;
            });
            this.subTins.push({ tin: M, priority: y.priority, importance: y.importance, xyBounds: r([S]), mercBounds: r([L]) });
          }
        }
        xy2Merc(u) {
          const d = this.xy2MercWithLayer(u);
          return d ? d[1] : !1;
        }
        merc2Xy(u) {
          const d = this.merc2XyWithLayer(u), y = d[0] || d[1];
          return y ? y[1] : !1;
        }
        xy2MercWithLayer(u) {
          this._assertMapData();
          const d = this._getTinsSortedByPriority();
          for (let y = 0; y < d.length; y++) {
            const { index: M, isMain: R } = d[y];
            if (R || dt(i(u), this.subTins[M - 1].xyBounds)) {
              const S = this._transformByIndex(u, M, !1);
              if (S === !1) continue;
              return [M, S];
            }
          }
          return !1;
        }
        merc2XyWithLayer(u) {
          return this._assertMapData(), this._getAllTinsWithIndex().map(({ index: d, tin: y, isMain: M }) => {
            const R = this._transformByIndex(u, d, !0);
            return R === !1 ? [y, d] : M || dt(i(R), this.subTins[d - 1].xyBounds) ? [y, d, R] : [y, d];
          }).sort((d, y) => {
            const M = d[0].priority ?? 0, R = y[0].priority ?? 0;
            return M < R ? 1 : -1;
          }).reduce((d, y, M, R) => {
            const S = y[0], L = y[1], P = y[2];
            if (!P) return d;
            for (let G = 0; G < M; G++) {
              const F = R[G][1], B = F === 0;
              if (R[G][2] && (B || dt(i(P), this.subTins[F - 1].xyBounds))) if (d.length) {
                const k = !d[0], z = k ? d[1][2] : d[0][2], K = S.importance ?? 0, N = z.importance ?? 0;
                return k ? K < N ? d : [void 0, [L, P, S]] : [...d.filter((D) => D !== void 0), [L, P, S]].sort((D, x) => (D[2].importance ?? 0) < (x[2].importance ?? 0) ? 1 : -1).slice(0, 2);
              } else return [[L, P, S]];
            }
            return !d.length || !d[0] ? [[L, P, S]] : (d.push([L, P, S]), d.sort((G, F) => {
              const B = G[2].importance ?? 0, k = F[2].importance ?? 0;
              return B < k ? 1 : -1;
            }).filter((G, F) => F < 2));
          }, []).map((d) => {
            if (d) return [d[0], d[1]];
          });
        }
        mercs2SysCoords(u) {
          this._assertMapData();
          const d = this.merc2XyWithLayer(u[0]);
          let y = !1;
          return d.map((M, R) => {
            if (!M) {
              y = !0;
              return;
            }
            const S = M[0], L = M[1];
            return R !== 0 && !y ? [this.xy2SysCoordInternal(L)] : u.map((P, G) => G === 0 ? L : this._transformByIndex(P, S, !0)).map((P) => this.xy2SysCoordInternal(P));
          });
        }
        viewpoint2Mercs(u, d) {
          this._assertMapData(), this._assertMaxxy();
          const y = qt(u.center, u.zoom, u.rotation, d).map((L) => le(L, this._maxxy)), M = this.xy2MercWithLayer(y[0]);
          if (!M) throw new Error("viewpoint2Mercs: center point is out of bounds");
          const R = M[0], S = M[1];
          return y.map((L, P) => {
            if (P === 0) return S;
            const G = this._transformByIndex(L, R, !1);
            if (G === !1) throw new Error(`viewpoint2Mercs: point ${P} is out of bounds`);
            return G;
          });
        }
        mercs2Viewpoint(u, d) {
          this._assertMapData(), this._assertMaxxy();
          const y = this.merc2XyWithLayer(u[0]), M = y[0] || y[1];
          if (!M) throw new Error("mercs2Viewpoint: center point is out of bounds");
          const R = M[0], S = M[1], L = u.map((P, G) => {
            if (G === 0) return S;
            const F = this._transformByIndex(P, R, !0);
            if (F === !1) throw new Error(`mercs2Viewpoint: point ${G} is out of bounds`);
            return F;
          }).map((P) => ie(P, this._maxxy));
          return ce(L, d);
        }
        static zoom2Radius(u, d) {
          return Ft(u, d);
        }
        static mercViewpoint2Mercs(u, d, y, M) {
          return qt(u, d, y, M);
        }
        static mercs2MercViewpoint(u, d) {
          return ce(u, d);
        }
        static xy2SysCoord(u, d) {
          return ie(u, d);
        }
        static sysCoord2Xy(u, d) {
          return le(u, d);
        }
        _assertMapData() {
          if (!this.mainTin) throw new Error("setMapData() must be called before transformation");
        }
        _assertMaxxy() {
          if (this._maxxy === 0) throw new Error("MapData.maxZoom or compiled.wh must be set for viewpoint conversion (xy2SysCoord / sysCoord2Xy)");
        }
        getLayerTransform(u) {
          if (u === 0) return this.mainTin;
          const d = this.subTins[u - 1];
          return d ? d.tin : null;
        }
        get layerCount() {
          return 1 + this.subTins.length;
        }
        get maxxy() {
          return this._maxxy;
        }
        _getTinsSortedByPriority() {
          return this._getAllTinsWithIndex().sort((u, d) => {
            const y = u.tin.priority ?? 0, M = d.tin.priority ?? 0;
            return y < M ? 1 : -1;
          });
        }
        _getAllTinsWithIndex() {
          const u = [{ index: 0, tin: this.mainTin, isMain: !0 }];
          return this.subTins.forEach((d, y) => {
            d.tin.priority = d.priority, d.tin.importance = d.importance, u.push({ index: y + 1, tin: d.tin, isMain: !1 });
          }), u;
        }
        _transformByIndex(u, d, y) {
          if (d === 0) return this.mainTin.transform(u, y);
          const M = this.subTins[d - 1];
          return M ? M.tin.transform(u, y, !0) : !1;
        }
        xy2SysCoordInternal(u) {
          return ie(u, this._maxxy);
        }
      }
      e.MERC_CROSSMATRIX = Pe, e.MERC_MAX = St, e.MapTransform = he, e.Transform = vt, e.counterTri = Ct, e.format_version = Ce, e.mercViewpoint2Mercs = qt, e.mercs2MercViewpoint = ce, e.normalizeEdges = sA, e.rotateMatrix = Yt, e.rotateVerticesTriangle = iA, e.sysCoord2Xy = le, e.transformArr = Rt, e.xy2SysCoord = ie, e.zoom2Radius = Ft, Object.defineProperty(e, Symbol.toStringTag, { value: "Module" });
    }));
  })(VA, VA.exports)), VA.exports;
}
var ft = _g();
const Ps = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAB3RJTUUH3QgIBToaSbAjlwAAABd0RVh0U29mdHdhcmUAR0xEUE5HIHZlciAzLjRxhaThAAAACHRwTkdHTEQzAAAAAEqAKR8AAAAEZ0FNQQAAsY8L/GEFAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAFRJREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgBDwABHHIJwwAAAABJRU5ErkJggg==", Je = 256, Kg = `<canvas width="${Je}" height="${Je}" src="${Ps}"></canvas>`;
async function FA(A) {
  if (typeof A == "string") {
    const t = A.match(/\//) ? A : `pois/${A}`, e = await fetch(t);
    if (!e.ok)
      throw new Error("Fail to load poi json");
    return await e.json();
  } else
    return A;
}
const xs = ["hide", "title", "icon", "selectedIcon"], Jg = [
  "lnglat",
  "lng",
  "lat",
  "longitude",
  "latitude"
];
function Un(A) {
  return typeof A == "object" && A !== null && !Array.isArray(A);
}
function Li(A) {
  if (!Un(A) || A.type === "FeatureCollection") return !1;
  const t = A.layer, e = typeof t == "string", n = Un(t) && t.type === "FeatureCollection";
  return !(!e && !n || Jg.some((i) => A[i] !== void 0));
}
function qg(A) {
  return Li(A) && xs.some((t) => A[t] !== void 0);
}
function wr(A) {
  const t = {};
  for (const [e, n] of Object.entries(A))
    if (e !== "layer") {
      if (xs.includes(e)) {
        t[e] = n;
        continue;
      }
      console.warn(`[Maplat] pois layer ref: unknown override key ignored: ${e}`);
    }
  return t;
}
function br(A, t) {
  if (!t) return A;
  t.hide === !0 && (A.hide = !0);
  const e = t.title;
  (typeof e == "string" ? e !== "" : Un(e) && Object.keys(e).length > 0) && (A.name = e);
  for (const n of ["icon", "selectedIcon"]) {
    const i = t[n];
    typeof i == "string" && i !== "" && (A[n] = i);
  }
  return A;
}
async function Ds(A, t) {
  if (A = await FA(A), Array.isArray(A)) {
    const e = A[0];
    if (A.length > 0 && (typeof e == "string" || Un(e) && e.type === "FeatureCollection" || Li(e))) {
      const i = await Promise.all(
        A.map(async (r, s) => {
          let g, o;
          Li(r) ? (g = await FA(r.layer), o = wr(r)) : (g = await FA(r), o = null);
          let a = g.id || g.properties && g.properties.id;
          if (!a)
            if (s === 0) a = "main";
            else throw "POI layers include bad key setting";
          const I = ke(g, a, t);
          return [a, br(I, o)];
        })
      );
      A = Object.fromEntries(i);
    } else
      A = await Promise.all(A.map(async (i) => await FA(i))), A = {
        main: ke(A, "main", t)
      };
  } else if (A.type === "FeatureCollection") {
    const e = A.id || A.properties && A.properties.id || "main";
    A = { [e]: ke(A, e, t) };
  } else if (qg(A)) {
    const e = await FA(A.layer), n = e.id || e.properties && e.properties.id || "main", i = ke(e, n, t);
    A = { [n]: br(i, wr(A)) };
  } else
    Object.keys(A).map((e) => {
      A[e] = ke(A[e], e, t);
    });
  return A.main || (A.main = ke([], "main", t)), Object.keys(A).map((e) => {
    Vi(A, e, t);
  }), A;
}
function ke(A, t, e) {
  if (Array.isArray(A))
    A = {
      pois: A.map((n) => $A(n))
    };
  else if (A.type === "FeatureCollection") {
    const n = Object.assign({}, A.properties || {});
    A.name && (n.name = A.name), n.pois = A.features.map((i) => $A(i)), A = n;
  }
  if (typeof A.id > "u")
    A.id = t;
  else if (A.id !== t) throw "POI layers include bad key setting";
  return A.namespaceID || (A.namespaceID = `${e.namespace ? `${e.namespace}#` : ""}${t}`), A.name || (A.name = t === "main" ? e.name : t), A.pois || (A.pois = []), A;
}
function $A(A) {
  if (A.type === "Feature") {
    const t = Object.assign({}, A.properties || {});
    t.lnglat = A.geometry.coordinates, t.id || (t.id = A.id), t.name || (t.name = A.name), A = t;
  }
  return A.lnglat || (A.lnglat = [A.lng || A.longitude, A.lat || A.latitude]), delete A.lng, delete A.lat, delete A.longitude, delete A.latitude, A;
}
function Vi(A, t, e) {
  if (!A[t]) return;
  const n = A[t], i = n.pois;
  n.__nextId || (n.__nextId = 0), i.map((r) => {
    r.id || (r.id = `${t}_${n.__nextId}`, n.__nextId++), r.namespaceID || (r.namespaceID = `${e.namespace ? `${e.namespace}#` : ""}${r.id}`);
  });
}
function tn(A, t, e = {}) {
  const n = { type: "Feature" };
  return (e.id === 0 || e.id) && (n.id = e.id), e.bbox && (n.bbox = e.bbox), n.properties = t || {}, n.geometry = A, n;
}
function Bs(A, t, e = {}) {
  if (!A)
    throw new Error("coordinates is required");
  if (!Array.isArray(A))
    throw new Error("coordinates must be an Array");
  if (A.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!vr(A[0]) || !vr(A[1]))
    throw new Error("coordinates must contain numbers");
  return tn({
    type: "Point",
    coordinates: A
  }, t, e);
}
function Os(A, t, e = {}) {
  for (const i of A) {
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
  return tn({
    type: "Polygon",
    coordinates: A
  }, t, e);
}
function $g(A, t, e = {}) {
  if (A.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return tn({
    type: "LineString",
    coordinates: A
  }, t, e);
}
function Er(A, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = A, e;
}
function vr(A) {
  return !isNaN(A) && A !== null && !Array.isArray(A);
}
function to(A) {
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
function eo(A) {
  return A.type === "Feature" ? A.geometry : A;
}
function Ls(A, t, e) {
  if (A !== null)
    for (var n, i, r, s, g, o, a, I = 0, c = 0, h, m = A.type, b = m === "FeatureCollection", v = m === "Feature", T = b ? A.features.length : 1, O = 0; O < T; O++) {
      a = b ? (
        // @ts-expect-error: Known type conflict
        A.features[O].geometry
      ) : v ? (
        // @ts-expect-error: Known type conflict
        A.geometry
      ) : A, h = a ? a.type === "GeometryCollection" : !1, g = h ? a.geometries.length : 1;
      for (var Z = 0; Z < g; Z++) {
        var Q = 0, U = 0;
        if (s = h ? a.geometries[Z] : a, s !== null) {
          o = s.coordinates;
          var Y = s.type;
          switch (I = Y === "Polygon" || Y === "MultiPolygon" ? 1 : 0, Y) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  o,
                  c,
                  O,
                  Q,
                  U
                ) === !1
              )
                return !1;
              c++, Q++;
              break;
            case "LineString":
            case "MultiPoint":
              for (n = 0; n < o.length; n++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    o[n],
                    c,
                    O,
                    Q,
                    U
                  ) === !1
                )
                  return !1;
                c++, Y === "MultiPoint" && Q++;
              }
              Y === "LineString" && Q++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (n = 0; n < o.length; n++) {
                for (i = 0; i < o[n].length - I; i++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      o[n][i],
                      c,
                      O,
                      Q,
                      U
                    ) === !1
                  )
                    return !1;
                  c++;
                }
                Y === "MultiLineString" && Q++, Y === "Polygon" && U++;
              }
              Y === "Polygon" && Q++;
              break;
            case "MultiPolygon":
              for (n = 0; n < o.length; n++) {
                for (U = 0, i = 0; i < o[n].length; i++) {
                  for (r = 0; r < o[n][i].length - I; r++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        o[n][i][r],
                        c,
                        O,
                        Q,
                        U
                      ) === !1
                    )
                      return !1;
                    c++;
                  }
                  U++;
                }
                Q++;
              }
              break;
            case "GeometryCollection":
              for (n = 0; n < s.geometries.length; n++)
                if (
                  // @ts-expect-error: Known type conflict
                  Ls(s.geometries[n], t) === !1
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
const Me = 11102230246251565e-32, Xt = 134217729, Ao = (3 + 8 * Me) * Me;
function ui(A, t, e, n, i) {
  let r, s, g, o, a = t[0], I = n[0], c = 0, h = 0;
  I > a == I > -a ? (r = a, a = t[++c]) : (r = I, I = n[++h]);
  let m = 0;
  if (c < A && h < e)
    for (I > a == I > -a ? (s = a + r, g = r - (s - a), a = t[++c]) : (s = I + r, g = r - (s - I), I = n[++h]), r = s, g !== 0 && (i[m++] = g); c < A && h < e; )
      I > a == I > -a ? (s = r + a, o = s - r, g = r - (s - o) + (a - o), a = t[++c]) : (s = r + I, o = s - r, g = r - (s - o) + (I - o), I = n[++h]), r = s, g !== 0 && (i[m++] = g);
  for (; c < A; )
    s = r + a, o = s - r, g = r - (s - o) + (a - o), a = t[++c], r = s, g !== 0 && (i[m++] = g);
  for (; h < e; )
    s = r + I, o = s - r, g = r - (s - o) + (I - o), I = n[++h], r = s, g !== 0 && (i[m++] = g);
  return (r !== 0 || m === 0) && (i[m++] = r), m;
}
function no(A, t) {
  let e = t[0];
  for (let n = 1; n < A; n++) e += t[n];
  return e;
}
function an(A) {
  return new Float64Array(A);
}
const io = (3 + 16 * Me) * Me, ro = (2 + 12 * Me) * Me, so = (9 + 64 * Me) * Me * Me, uA = an(4), Mr = an(8), Rr = an(12), Tr = an(16), Wt = an(4);
function go(A, t, e, n, i, r, s) {
  let g, o, a, I, c, h, m, b, v, T, O, Z, Q, U, Y, nt, tt, _;
  const pt = A - i, yt = e - i, lt = t - r, dt = n - r;
  U = pt * dt, h = Xt * pt, m = h - (h - pt), b = pt - m, h = Xt * dt, v = h - (h - dt), T = dt - v, Y = b * T - (U - m * v - b * v - m * T), nt = lt * yt, h = Xt * lt, m = h - (h - lt), b = lt - m, h = Xt * yt, v = h - (h - yt), T = yt - v, tt = b * T - (nt - m * v - b * v - m * T), O = Y - tt, c = Y - O, uA[0] = Y - (O + c) + (c - tt), Z = U + O, c = Z - U, Q = U - (Z - c) + (O - c), O = Q - nt, c = Q - O, uA[1] = Q - (O + c) + (c - nt), _ = Z + O, c = _ - Z, uA[2] = Z - (_ - c) + (O - c), uA[3] = _;
  let wt = no(4, uA), Zt = ro * s;
  if (wt >= Zt || -wt >= Zt || (c = A - pt, g = A - (pt + c) + (c - i), c = e - yt, a = e - (yt + c) + (c - i), c = t - lt, o = t - (lt + c) + (c - r), c = n - dt, I = n - (dt + c) + (c - r), g === 0 && o === 0 && a === 0 && I === 0) || (Zt = so * s + Ao * Math.abs(wt), wt += pt * I + dt * g - (lt * a + yt * o), wt >= Zt || -wt >= Zt)) return wt;
  U = g * dt, h = Xt * g, m = h - (h - g), b = g - m, h = Xt * dt, v = h - (h - dt), T = dt - v, Y = b * T - (U - m * v - b * v - m * T), nt = o * yt, h = Xt * o, m = h - (h - o), b = o - m, h = Xt * yt, v = h - (h - yt), T = yt - v, tt = b * T - (nt - m * v - b * v - m * T), O = Y - tt, c = Y - O, Wt[0] = Y - (O + c) + (c - tt), Z = U + O, c = Z - U, Q = U - (Z - c) + (O - c), O = Q - nt, c = Q - O, Wt[1] = Q - (O + c) + (c - nt), _ = Z + O, c = _ - Z, Wt[2] = Z - (_ - c) + (O - c), Wt[3] = _;
  const ae = ui(4, uA, 4, Wt, Mr);
  U = pt * I, h = Xt * pt, m = h - (h - pt), b = pt - m, h = Xt * I, v = h - (h - I), T = I - v, Y = b * T - (U - m * v - b * v - m * T), nt = lt * a, h = Xt * lt, m = h - (h - lt), b = lt - m, h = Xt * a, v = h - (h - a), T = a - v, tt = b * T - (nt - m * v - b * v - m * T), O = Y - tt, c = Y - O, Wt[0] = Y - (O + c) + (c - tt), Z = U + O, c = Z - U, Q = U - (Z - c) + (O - c), O = Q - nt, c = Q - O, Wt[1] = Q - (O + c) + (c - nt), _ = Z + O, c = _ - Z, Wt[2] = Z - (_ - c) + (O - c), Wt[3] = _;
  const H = ui(ae, Mr, 4, Wt, Rr);
  U = g * I, h = Xt * g, m = h - (h - g), b = g - m, h = Xt * I, v = h - (h - I), T = I - v, Y = b * T - (U - m * v - b * v - m * T), nt = o * a, h = Xt * o, m = h - (h - o), b = o - m, h = Xt * a, v = h - (h - a), T = a - v, tt = b * T - (nt - m * v - b * v - m * T), O = Y - tt, c = Y - O, Wt[0] = Y - (O + c) + (c - tt), Z = U + O, c = Z - U, Q = U - (Z - c) + (O - c), O = Q - nt, c = Q - O, Wt[1] = Q - (O + c) + (c - nt), _ = Z + O, c = _ - Z, Wt[2] = Z - (_ - c) + (O - c), Wt[3] = _;
  const Rt = ui(H, Rr, 4, Wt, Tr);
  return Tr[Rt - 1];
}
function oo(A, t, e, n, i, r) {
  const s = (t - r) * (e - i), g = (A - i) * (n - r), o = s - g, a = Math.abs(s + g);
  return Math.abs(o) >= io * a ? o : -go(A, t, e, n, i, r, a);
}
function ao(A, t) {
  var e, n, i = 0, r, s, g, o, a, I, c, h = A[0], m = A[1], b = t.length;
  for (e = 0; e < b; e++) {
    n = 0;
    var v = t[e], T = v.length - 1;
    if (I = v[0], I[0] !== v[T][0] && I[1] !== v[T][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (s = I[0] - h, g = I[1] - m, n; n < T; n++) {
      if (c = v[n + 1], o = c[0] - h, a = c[1] - m, g === 0 && a === 0) {
        if (o <= 0 && s >= 0 || s <= 0 && o >= 0)
          return 0;
      } else if (a >= 0 && g <= 0 || a <= 0 && g >= 0) {
        if (r = oo(s, o, g, a, 0, 0), r === 0)
          return 0;
        (r > 0 && a > 0 && g <= 0 || r < 0 && a <= 0 && g > 0) && i++;
      }
      I = c, g = a, s = o;
    }
  }
  return i % 2 !== 0;
}
function Io(A, t, e = {}) {
  if (!A)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const n = to(A), i = eo(t), r = i.type, s = t.bbox;
  let g = i.coordinates;
  if (s && Co(n, s) === !1)
    return !1;
  r === "Polygon" && (g = [g]);
  let o = !1;
  for (var a = 0; a < g.length; ++a) {
    const I = ao(n, g[a]);
    if (I === 0) return !e.ignoreBoundary;
    I && (o = !0);
  }
  return o;
}
function Co(A, t) {
  return t[0] <= A[0] && t[1] <= A[1] && t[2] >= A[0] && t[3] >= A[1];
}
class ks {
  constructor(t = [], e = co) {
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
      const r = t - 1 >> 1, s = e[r];
      if (n(i, s) >= 0) break;
      e[t] = s, t = r;
    }
    e[t] = i;
  }
  _down(t) {
    const { data: e, compare: n } = this, i = this.length >> 1, r = e[t];
    for (; t < i; ) {
      let s = (t << 1) + 1, g = e[s];
      const o = s + 1;
      if (o < this.length && n(e[o], g) < 0 && (s = o, g = e[o]), n(g, r) >= 0) break;
      e[t] = g, t = s;
    }
    e[t] = r;
  }
}
function co(A, t) {
  return A < t ? -1 : A > t ? 1 : 0;
}
function Ns(A, t) {
  return A.p.x > t.p.x ? 1 : A.p.x < t.p.x ? -1 : A.p.y !== t.p.y ? A.p.y > t.p.y ? 1 : -1 : 1;
}
function lo(A, t) {
  return A.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : A.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : A.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? A.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
class Sr {
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
function ho(A, t) {
  if (A.type === "FeatureCollection") {
    const e = A.features;
    for (let n = 0; n < e.length; n++)
      Pr(e[n], t);
  } else
    Pr(A, t);
}
let xn = 0, Dn = 0, Bn = 0;
function Pr(A, t) {
  const e = A.type === "Feature" ? A.geometry : A;
  let n = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (n = [n]), e.type === "LineString" && (n = [[n]]);
  for (let i = 0; i < n.length; i++)
    for (let r = 0; r < n[i].length; r++) {
      let s = n[i][r][0], g = null;
      Dn = Dn + 1;
      for (let o = 0; o < n[i][r].length - 1; o++) {
        g = n[i][r][o + 1];
        const a = new Sr(s, xn, Dn, Bn), I = new Sr(g, xn, Dn, Bn + 1);
        a.otherEvent = I, I.otherEvent = a, Ns(a, I) > 0 ? (I.isLeftEndpoint = !0, a.isLeftEndpoint = !1) : (a.isLeftEndpoint = !0, I.isLeftEndpoint = !1), t.push(a), t.push(I), s = g, Bn = Bn + 1;
      }
    }
  xn = xn + 1;
}
class uo {
  constructor(t) {
    this.leftSweepEvent = t, this.rightSweepEvent = t.otherEvent;
  }
}
function fo(A, t) {
  if (A === null || t === null || A.leftSweepEvent.ringId === t.leftSweepEvent.ringId && (A.rightSweepEvent.isSamePoint(t.leftSweepEvent) || A.rightSweepEvent.isSamePoint(t.leftSweepEvent) || A.rightSweepEvent.isSamePoint(t.rightSweepEvent) || A.leftSweepEvent.isSamePoint(t.leftSweepEvent) || A.leftSweepEvent.isSamePoint(t.rightSweepEvent))) return !1;
  const e = A.leftSweepEvent.p.x, n = A.leftSweepEvent.p.y, i = A.rightSweepEvent.p.x, r = A.rightSweepEvent.p.y, s = t.leftSweepEvent.p.x, g = t.leftSweepEvent.p.y, o = t.rightSweepEvent.p.x, a = t.rightSweepEvent.p.y, I = (a - g) * (i - e) - (o - s) * (r - n), c = (o - s) * (n - g) - (a - g) * (e - s), h = (i - e) * (n - g) - (r - n) * (e - s);
  if (I === 0)
    return !1;
  const m = c / I, b = h / I;
  if (m >= 0 && m <= 1 && b >= 0 && b <= 1) {
    const v = e + m * (i - e), T = n + m * (r - n);
    return [v, T];
  }
  return !1;
}
function mo(A, t) {
  t = t || !1;
  const e = [], n = new ks([], lo);
  for (; A.length; ) {
    const i = A.pop();
    if (i.isLeftEndpoint) {
      const r = new uo(i);
      for (let s = 0; s < n.data.length; s++) {
        const g = n.data[s];
        if (t && g.leftSweepEvent.featureId === i.featureId)
          continue;
        const o = fo(r, g);
        o !== !1 && e.push(o);
      }
      n.push(r);
    } else i.isLeftEndpoint === !1 && n.pop();
  }
  return e;
}
function po(A, t) {
  const e = new ks([], Ns);
  return ho(A, e), mo(e, t);
}
var yo = po;
function wo(A, t, e = {}) {
  const { removeDuplicates: n = !0, ignoreSelfIntersections: i = !0 } = e;
  let r = [];
  A.type === "FeatureCollection" ? r = r.concat(A.features) : A.type === "Feature" ? r.push(A) : (A.type === "LineString" || A.type === "Polygon" || A.type === "MultiLineString" || A.type === "MultiPolygon") && r.push(tn(A)), t.type === "FeatureCollection" ? r = r.concat(t.features) : t.type === "Feature" ? r.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && r.push(tn(t));
  const s = yo(
    Er(r),
    i
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
  return Er(g.map((o) => Bs(o)));
}
function bo(A, t = {}) {
  let e = 0, n = 0, i = 0;
  return Ls(
    A,
    function(r) {
      e += r[0], n += r[1], i++;
    }
  ), Bs([e / i, n / i], t.properties);
}
function Gs(A) {
  class t extends A {
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
      if (n = fe(n), this.mapID = n.mapID, this.homePosition = n.homePosition, this.mercZoom = n.mercZoom, this.label = n.label, this.maxZoom = n.maxZoom, this.minZoom = n.minZoom, this.poiTemplate = n.poiTemplate, this.poiStyle = n.poiStyle, this.iconTemplate = n.iconTemplate, this.icon = n.icon, this.selectedIcon = n.selectedIcon, this.mercatorXShift = n.mercatorXShift, this.mercatorYShift = n.mercatorYShift, this.weiwudi = n.weiwudi, n.envelopeLngLats) {
        const g = n.envelopeLngLats.map(
          (o) => ee(o, "EPSG:4326", "EPSG:3857")
        );
        g.push(g[0]), this.envelope = Os([g]), this.centroid = bo(this.envelope).geometry?.coordinates;
      }
      for (let s = 0; s < en.length; s++) {
        const g = en[s], o = vo[s];
        this.set(g, n[o] || n[g]);
      }
      const i = n.thumbnail ? new Promise((s) => {
        this.thumbnail = n.thumbnail, s(void 0);
      }) : new Promise((s) => {
        this.thumbnail = `./tmbs/${n.mapID}.jpg`, fetch(this.thumbnail).then((g) => {
          g.ok || (this.thumbnail = `./tmbs/${n.mapID}_menu.jpg`), s(void 0);
        }).catch((g) => {
          this.thumbnail = `./tmbs/${n.mapID}_menu.jpg`, s(void 0);
        });
      }).catch((s) => {
        this.thumbnail = `./tmbs/${n.mapID || n.sourceID}_menu.jpg`;
      }), r = this.resolvePois(n.pois);
      this.initialWait = Promise.all([r, i]), Mo(this);
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
    async fetchAllTileCacheAsync(n) {
      if (this.weiwudi)
        try {
          const i = (s) => {
            n(s.type, s.detail);
          }, r = (s) => {
            this.weiwudi.removeEventListener("proceed", i), this.weiwudi.removeEventListener("finish", r), this.weiwudi.removeEventListener("stop", r), this.weiwudi.removeEventListener("canceled", r), i(s);
          };
          this.weiwudi.addEventListener("proceed", i), this.weiwudi.addEventListener("finish", r), this.weiwudi.addEventListener("stop", r), this.weiwudi.addEventListener("canceled", r), await this.weiwudi.fetchAll();
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
      let i, r;
      const s = n.mercZoom, g = n.zoom, o = n.direction, a = n.rotation, c = this.getMap()?.getView();
      n.latitude !== void 0 && n.longitude !== void 0 && (i = ee(
        [n.longitude, n.latitude],
        "EPSG:4326",
        "EPSG:3857"
      )), n.x !== void 0 && n.y != null && (r = [n.x, n.y]), this.viewpoint2MercsAsync().then((h) => this.mercs2MercViewpoint(h)).then((h) => {
        const m = this.mercViewpoint2Mercs([
          i || h[0],
          s || h[1] || 17,
          o ?? a ?? h[2]
        ]);
        this.mercs2ViewpointAsync(m).then((b) => {
          i != null ? c?.setCenter(b[0]) : r != null && c?.setCenter(r), s != null ? c?.setZoom(b[1]) : g != null && c?.setZoom(g), o != null ? c?.setRotation(b[2]) : a != null && c?.setRotation(a);
        });
      });
    }
    setViewpoint(n) {
      const i = { ...n };
      i.rotation && (i.rotation = i.rotation * Math.PI / 180), i.direction && (i.direction = i.direction * Math.PI / 180), this.setViewpointRadian(i);
    }
    goHome() {
      const i = this.getMap();
      let r = i.getTarget();
      typeof r == "string" && (r = document.getElementById(r));
      const s = i.homeMarginPixels, g = [
        (r.clientWidth - s - 10) * 1,
        (r.clientHeight - s - 10) * 1
      ], o = {
        longitude: this.homePosition[0],
        latitude: this.homePosition[1],
        zoom: this.defZoom(g)
      };
      this.getMap().northUp ? o.direction = 0 : o.rotation = 0, this.setViewpointRadian(o);
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
    setGPSMarkerAsync(n, i = !1) {
      const r = this.getMap(), s = r?.getView();
      if (!n)
        return new Promise((o, a) => {
          r?.setGPSPosition(null), o(!0);
        });
      const g = this.mercsFromGPSValue(n.lnglat, n.acc);
      return this.mercs2SysCoordsAsync_multiLayer([g]).then((o) => {
        const a = !o[0], I = a ? o[1] : o[0], c = a ? null : o[1], h = { xy: I[0][0] };
        if (!this.insideCheckSysCoord(I[0][0])) return !1;
        const m = I[0].slice(1);
        return h.rad = m.reduce(
          (b, v, T) => {
            const O = b + Math.sqrt(
              Math.pow(v[0] - h.xy[0], 2) + Math.pow(v[1] - h.xy[1], 2)
            );
            return T === 3 ? O / 4 : O;
          },
          0
        ), i || s?.setCenter(h.xy), r?.setGPSPosition(h, a ? "hide" : null), c && r?.setGPSPosition({ xy: c[0][0] }, "sub"), !0;
      }).catch((o) => {
        throw o;
      });
    }
    setGPSMarker(n, i = !1) {
      this.setGPSMarkerAsync(n, i).then(() => {
      });
    }
    mercsFromGPSValue(n, i) {
      const r = ee(n, "EPSG:4326", "EPSG:3857"), s = n[1] * Math.PI / 180, g = i / Math.cos(s);
      return ft.MERC_CROSSMATRIX.map((o) => [
        o[0] * g + r[0],
        o[1] * g + r[1]
      ]);
    }
    // 与えられた差分行列を回転。theta無指定の場合は自動取得
    rotateMatrix(n, i) {
      return i === void 0 && (i = this.getMap().getView().getRotation()), ft.rotateMatrix(n, i);
    }
    async resolvePois(n) {
      this.pois = await Ds(n || [], {
        name: this.officialTitle || this.title,
        namespace: this.mapID
      });
    }
    getPoi(n) {
      let i;
      return Object.keys(this.pois).map((r) => {
        this.pois[r].pois.map((s, g) => {
          s.id === n && (i = this.pois[r].pois[g]);
        });
      }), i;
    }
    addPoi(n, i) {
      if (i || (i = "main"), this.pois[i])
        return n = $A(n), this.pois[i].pois.push(n), Vi(this.pois, i, {
          name: this.officialTitle || this.title,
          namespace: this.mapID
        }), n.namespaceID;
    }
    removePoi(n) {
      Object.keys(this.pois).map((i) => {
        this.pois[i].pois.map((r, s) => {
          r.id === n && delete this.pois[i].pois[s];
        });
      });
    }
    clearPoi(n) {
      n || (n = "main"), n === "all" ? Object.keys(this.pois).map((i) => {
        this.pois[i].pois = [];
      }) : this.pois[n] && (this.pois[n].pois = []);
    }
    listPoiLayers(n = !1, i = !1) {
      return Object.keys(this.pois).sort((r, s) => r === "main" ? -1 : s === "main" ? 1 : 0).map((r) => this.pois[r]).filter(
        (r) => i ? n ? r.pois.length && r.hide : r.pois.length : n ? r.hide : !0
      );
    }
    getPoiLayer(n) {
      return this.pois[n];
    }
    addPoiLayer(n, i) {
      n !== "main" && (this.pois[n] || (this.pois[n] = ke(i || [], n, {
        name: this.officialTitle || this.title,
        namespace: this.mapID
      })));
    }
    removePoiLayer(n) {
      n !== "main" && this.pois[n] && delete this.pois[n];
    }
    merc2SysCoordAsync_ignoreBackground(n) {
      return this.merc2XyAsync_ignoreBackground(n).then(
        (i) => i ? this.xy2SysCoord(i) : void 0
      );
    }
    merc2SysCoordAsync(n) {
      return this.merc2XyAsync(n).then(
        (i) => i && this.xy2SysCoord(i)
      );
    }
    sysCoord2MercAsync(n) {
      const i = this.sysCoord2Xy(n);
      return this.xy2MercAsync(i);
    }
    // size(画面サイズ)とズームから、地図面座標上での半径を得る。zoom無指定の場合は自動取得
    zoom2Radius(n, i) {
      return i === void 0 && (i = this.getMap().getView().getDecimalZoom()), ft.zoom2Radius(n, i);
    }
    // 画面サイズと地図ズームから、地図面座標上での5座標を取得する。zoom, rotate無指定の場合は自動取得
    viewpoint2SysCoords(n, i) {
      return this.mercViewpoint2Mercs(n, i);
    }
    mercViewpoint2Mercs(n, i) {
      let r = n ? n[0] : void 0;
      const s = n ? n[1] : void 0, g = n ? n[2] : void 0;
      r === void 0 && (r = this.getMap().getView().getCenter()), i === void 0 && (i = this.getMap().getSize());
      const o = s ?? this.getMap().getView().getDecimalZoom(), a = g ?? this.getMap().getView().getRotation();
      return [ft.mercViewpoint2Mercs(
        r,
        o,
        a,
        i
      ), i];
    }
    // 地図座標5地点情報から地図サイズ情報（中心座標、サイズ、回転）を得る
    sysCoords2Viewpoint(n) {
      return this.mercs2MercViewpoint(n);
    }
    // メルカトル5地点情報からメルカトル地図でのサイズ情報（中心座標、サイズ、回転）を得る
    mercs2MercViewpoint(n) {
      let i = n[1];
      i || (i = this.getMap().getSize());
      const r = ft.mercs2MercViewpoint(
        n[0],
        i
      );
      return [r.center, r.zoom, r.rotation];
    }
    sysCoords2Xys(n) {
      return [
        n[0].map((i) => this.sysCoord2Xy(i)),
        n[1]
      ];
    }
    xys2SysCoords(n) {
      return [n[0].map((i) => this.xy2SysCoord(i)), n[1]];
    }
    mercs2XysAsync(n) {
      return Promise.all(n[0].map((i) => this.merc2XyAsync(i))).then(
        (i) => [i, n[1]]
      );
    }
    xys2MercsAsync(n) {
      return Promise.all(n[0].map((i) => this.xy2MercAsync(i))).then(
        (i) => [i, n[1]]
      );
    }
    static async createAsync(n) {
      return new this(n);
    }
  }
  return t;
}
function Xs(A) {
  class t extends Gs(A) {
    static isBasemap_ = !0;
    static isWmts_ = !0;
    insideCheckXy(n) {
      return this.envelope ? Io(n, this.envelope) : !0;
    }
    insideCheckSysCoord(n) {
      return this.insideCheckXy(n);
    }
    modulateXyInside(n) {
      if (!this.centroid) return n;
      const i = $g([n, this.centroid]), r = wo(this.envelope, i);
      return r.features.length > 0 && r.features[0].geometry ? r.features[0].geometry.coordinates : n;
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
      const r = this.viewpoint2SysCoords(n, i), s = this.sysCoords2Xys(r);
      return this.xys2MercsAsync(s);
    }
    mercs2ViewpointAsync(n) {
      return this.mercs2XysAsync(n).then((i) => {
        const r = this.xys2SysCoords(i);
        return this.sysCoords2Viewpoint(r);
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
  return t;
}
function Eo(A) {
  class t extends Gs(A) {
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
      const i = n[0] / (this.width / 2) - 1, r = n[1] / (this.height / 2) - 1, s = Math.max(Math.abs(i), Math.abs(r));
      return [
        (i / s + 1) * this.width / 2,
        (r / s + 1) * this.height / 2
      ];
    }
    modulateSysCoordInside(n) {
      const i = this.sysCoord2Xy(n), r = this.modulateXyInside(i);
      return this.xy2SysCoord(r);
    }
    // unifyTerm対応
    // https://github.com/code4history/MaplatCore/issues/19
    xy2SysCoord(n) {
      const i = n[0] * (2 * ft.MERC_MAX) / this._maxxy - ft.MERC_MAX, r = -1 * (n[1] * (2 * ft.MERC_MAX) / this._maxxy - ft.MERC_MAX);
      return [i, r];
    }
    sysCoord2Xy(n) {
      const i = (n[0] + ft.MERC_MAX) * this._maxxy / (2 * ft.MERC_MAX), r = (-n[1] + ft.MERC_MAX) * this._maxxy / (2 * ft.MERC_MAX);
      return [i, r];
    }
    defZoom(n) {
      const i = n[0], r = n[1], s = Math.log2((i - 10) / this.width), g = Math.log2((r - 10) / this.height), o = this.maxZoom;
      let a;
      return g > s ? a = g : a = s, o + a;
    }
  }
  return t;
}
const en = [
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
], vo = [
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
], ki = (A) => (A || "").match(/^(?:google(?:_(?:roadmap|satellite|hybrid|terrain))?|mapbox|maplibre)$/);
function js(A) {
  return A = fe(A), A.imageExtension || (A.imageExtension = "jpg"), ki(A.maptype) ? (delete A.url, delete A.urls) : A.mapID && !A.url && !A.urls && (A.url = A.tms ? `tiles/${A.mapID}/{z}/{x}/{-y}.${A.imageExtension}` : `tiles/${A.mapID}/{z}/{x}/{y}.${A.imageExtension}`), A;
}
function Mo(A) {
  const t = A;
  A.setTileLoadFunction(
    (function() {
      const e = t.getTileLoadFunction(), n = function(i, r, s, g, o, a, I) {
        return new Promise((c, h) => {
          const m = function(b, v = void 0) {
            const T = document.createElement("img");
            T.crossOrigin = "Anonymous", T.onload = T.onerror = function() {
              if (T.width && T.height) {
                const O = s.getContext("2d"), Z = g === 0 ? 256 - a : 0, Q = o === 0 ? 256 - I : 0;
                a = g + a > T.width ? T.width - g : a, I = o + I > T.height ? T.height - o : I, O.drawImage(T, g, o, a, I, Z, Q, a, I), c(void 0);
              } else
                v ? m(v) : c("tileLoadError");
            }, T.src = b;
          };
          m(r);
        });
      };
      return function(i, r) {
        const s = i.tileCoord[0];
        let g = i.tileCoord[1], o = i.tileCoord[2], a = Math.round(
          (t.mercatorXShift || 0) * 128 * Math.pow(2, s) / ft.MERC_MAX
        ), I = Math.round(
          (t.mercatorYShift || 0) * -128 * Math.pow(2, s) / ft.MERC_MAX
        );
        for (; a < 0 || a >= 256; )
          a < 0 ? (a = a + 256, g++) : (a = a - 256, g--);
        for (; I < 0 || I >= 256; )
          I < 0 ? (I = I + 256, o++) : (I = I - 256, o--);
        const c = document.createElement("div");
        c.innerHTML = Kg;
        const h = c.childNodes[0], m = [
          [[s, g, o], 0, 0, 256 - a, 256 - I]
        ];
        a !== 0 && m.push([
          [s, g - 1, o],
          256 - a,
          0,
          a,
          256 - I
        ]), I !== 0 && (m.push([
          [s, g, o - 1],
          0,
          256 - I,
          256 - a,
          I
        ]), a !== 0 && m.push([
          [s, g - 1, o - 1],
          256 - a,
          256 - I,
          a,
          I
        ])), Promise.all(
          m.map((b) => {
            const v = t.tileUrlFunction(
              b[0],
              t.tilePixelRatio_,
              t.projection_
            );
            return n(
              b[0],
              v,
              h,
              b[1],
              b[2],
              b[3],
              b[4]
            );
          })
        ).then((b) => {
          if (b.reduce((T, O) => T && O, !0))
            i.handleImageError_();
          else {
            const T = h.toDataURL(), O = i.getImage();
            O.crossOrigin = null, e(i, T);
          }
        }).catch((b) => {
          i.handleImageError_();
        });
      };
    })()
  );
}
function UA(A) {
  const t = document, e = t.createDocumentFragment(), n = [];
  A = A.replace(/(<\/?)d([ >])/g, "$1div$2").replace(/(<\/?)s([ >])/g, "$1span$2").replace(/ din="/g, ' data-i18n="').replace(/ dinh="/g, ' data-i18n-html="').replace(/ c="/g, ' class="');
  const i = e.appendChild(t.createElement("div"));
  i.innerHTML = A;
  for (let r = 0; r < i.childNodes.length; r++) {
    const s = i.childNodes[r];
    if (s.nodeName && s.nodeName.toLowerCase() === "script") {
      const g = t.createElement("script");
      s.type && (g.type = s.type), s.src ? g.src = s.src : g.text = s.text, n[r] = g;
    } else
      n[r] = s;
  }
  return n;
}
function On(A) {
  for (; !(A <= 180 && A > -180); ) {
    const t = A > 0 ? -1 : 1;
    A = A + t * 360;
  }
  return A;
}
function xr(A) {
  if (!A) return;
  const t = {
    mapID: A.mapID
  };
  for (let e = 0; e < en.length; e++) {
    const n = en[e];
    A[n] && (t[n] = A[n]);
  }
  return t;
}
function fe(A) {
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
class Zs {
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
function Ro(A, t, e) {
  let n, i;
  e = e || Fs;
  let r = 0, s = A.length, g = !1;
  for (; r < s; )
    n = r + (s - r >> 1), i = +e(A[n], t), i < 0 ? r = n + 1 : (s = n, g = !i);
  return g ? r : ~r;
}
function Fs(A, t) {
  return A > t ? 1 : A < t ? -1 : 0;
}
function Us(A, t, e) {
  if (A[0] <= t)
    return 0;
  const n = A.length;
  if (t <= A[n - 1])
    return n - 1;
  if (typeof e == "function") {
    for (let i = 1; i < n; ++i) {
      const r = A[i];
      if (r === t)
        return i;
      if (r < t)
        return e(t, A[i - 1], r) > 0 ? i - 1 : i;
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
function zs(A, t) {
  const e = Array.isArray(t) ? t : [t], n = e.length;
  for (let i = 0; i < n; i++)
    A[A.length] = e[i];
}
function To(A, t) {
  const e = A.length;
  if (e !== t.length)
    return !1;
  for (let n = 0; n < e; n++)
    if (A[n] !== t[n])
      return !1;
  return !0;
}
function So() {
  return !0;
}
function $n() {
  return !1;
}
function Ni() {
}
function Po(A) {
  let t, e, n;
  return function() {
    const i = Array.prototype.slice.call(arguments);
    return (!e || this !== n || !To(i, e)) && (n = this, e = i, t = A.apply(this, arguments)), t;
  };
}
function Ws(A) {
  for (const t in A)
    delete A[t];
}
function xo(A) {
  let t;
  for (t in A)
    return !1;
  return !t;
}
class Hs extends Zs {
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
    const r = e ? new Re(t) : (
      /** @type {Event} */
      t
    );
    r.target || (r.target = this.eventTarget_ || this);
    const s = this.dispatching_ || (this.dispatching_ = {}), g = this.pendingRemovals_ || (this.pendingRemovals_ = {});
    n in s || (s[n] = 0, g[n] = 0), ++s[n];
    let o;
    for (let a = 0, I = i.length; a < I; ++a)
      if ("handleEvent" in i[a] ? o = /** @type {import("../events.js").ListenerObject} */
      i[a].handleEvent(r) : o = /** @type {import("../events.js").ListenerFunction} */
      i[a].call(this, r), o === !1 || r.propagationStopped) {
        o = !1;
        break;
      }
    if (--s[n] === 0) {
      let a = g[n];
      for (delete g[n]; a--; )
        this.removeEventListener(n, Ni);
      delete s[n];
    }
    return o;
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.listeners_ && Ws(this.listeners_);
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
    i !== -1 && (this.pendingRemovals_ && t in this.pendingRemovals_ ? (n[i] = Ni, ++this.pendingRemovals_[t]) : (n.splice(i, 1), n.length === 0 && delete this.listeners_[t]));
  }
}
Ts.prototype.getDecimalZoom = function() {
  const A = this.getResolution(), t = (
    // NOTE: `resolution` maybe `undefined`
    // NOTE: `offset` maybe `NaN`
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Math.log(this.maxResolution_ / A) / Math.log(2)
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
function _i(A, t, e) {
  let n, i;
  return t < A[0] ? n = A[0] - t : A[2] < t ? n = t - A[2] : n = 0, e < A[1] ? i = A[1] - e : A[3] < e ? i = e - A[3] : i = 0, n * n + i * i;
}
function Do(A, t, e) {
  return A[0] <= t && t <= A[2] && A[1] <= e && e <= A[3];
}
function Dr(A, t) {
  const e = A[0], n = A[1], i = A[2], r = A[3], s = t[0], g = t[1];
  let o = Bt.UNKNOWN;
  return s < e ? o = o | Bt.LEFT : s > i && (o = o | Bt.RIGHT), g < n ? o = o | Bt.BELOW : g > r && (o = o | Bt.ABOVE), o === Bt.UNKNOWN && (o = Bt.INTERSECTING), o;
}
function Qs() {
  return [1 / 0, 1 / 0, -1 / 0, -1 / 0];
}
function ti(A, t, e, n, i) {
  return i ? (i[0] = A, i[1] = t, i[2] = e, i[3] = n, i) : [A, t, e, n];
}
function Ys(A) {
  return ti(1 / 0, 1 / 0, -1 / 0, -1 / 0, A);
}
function Bo(A, t) {
  const e = A[0], n = A[1];
  return ti(e, n, e, n, t);
}
function Oo(A, t, e, n, i) {
  const r = Ys(i);
  return Vs(r, A, t, e, n);
}
function Vs(A, t, e, n, i) {
  for (; e < n; e += i)
    Lo(A, t[e], t[e + 1]);
  return A;
}
function Lo(A, t, e) {
  A[0] = Math.min(A[0], t), A[1] = Math.min(A[1], e), A[2] = Math.max(A[2], t), A[3] = Math.max(A[3], e);
}
function _s(A, t) {
  let e;
  return e = t(ko(A)), e || (e = t(No(A)), e) || (e = t(Zo(A)), e) || (e = t(jo(A)), e) ? e : !1;
}
function ko(A) {
  return [A[0], A[1]];
}
function No(A) {
  return [A[2], A[1]];
}
function zn(A) {
  return [(A[0] + A[2]) / 2, (A[1] + A[3]) / 2];
}
function Go(A, t, e, n, i) {
  const [r, s, g, o, a, I, c, h] = Xo(
    A,
    t,
    e,
    n
  );
  return ti(
    Math.min(r, g, a, c),
    Math.min(s, o, I, h),
    Math.max(r, g, a, c),
    Math.max(s, o, I, h),
    i
  );
}
function Xo(A, t, e, n) {
  const i = t * n[0] / 2, r = t * n[1] / 2, s = Math.cos(e), g = Math.sin(e), o = i * s, a = i * g, I = r * s, c = r * g, h = A[0], m = A[1];
  return [
    h - o + c,
    m - a - I,
    h - o - c,
    m - a + I,
    h + o - c,
    m + a + I,
    h + o + c,
    m + a - I,
    h - o + c,
    m - a - I
  ];
}
function An(A) {
  return A[3] - A[1];
}
function jo(A) {
  return [A[0], A[3]];
}
function Zo(A) {
  return [A[2], A[3]];
}
function Ki(A) {
  return A[2] - A[0];
}
function Ji(A, t) {
  return A[0] <= t[2] && A[2] >= t[0] && A[1] <= t[3] && A[3] >= t[1];
}
function Ks(A) {
  return A[2] < A[0] || A[3] < A[1];
}
function Fo(A, t) {
  return t ? (t[0] = A[0], t[1] = A[1], t[2] = A[2], t[3] = A[3], t) : A;
}
function Uo(A, t, e) {
  let n = !1;
  const i = Dr(A, t), r = Dr(A, e);
  if (i === Bt.INTERSECTING || r === Bt.INTERSECTING)
    n = !0;
  else {
    const s = A[0], g = A[1], o = A[2], a = A[3], I = t[0], c = t[1], h = e[0], m = e[1], b = (m - c) / (h - I);
    let v, T;
    r & Bt.ABOVE && !(i & Bt.ABOVE) && (v = h - (m - a) / b, n = v >= s && v <= o), !n && r & Bt.RIGHT && !(i & Bt.RIGHT) && (T = m - (h - o) * b, n = T >= g && T <= a), !n && r & Bt.BELOW && !(i & Bt.BELOW) && (v = h - (m - g) / b, n = v >= s && v <= o), !n && r & Bt.LEFT && !(i & Bt.LEFT) && (T = m - (h - s) * b, n = T >= g && T <= a);
  }
  return n;
}
function Ht() {
  throw new Error("Unimplemented abstract method.");
}
let zo = 0;
function Wo(A) {
  return A.ol_uid || (A.ol_uid = String(++zo));
}
const Ho = {
  /**
   * Triggered when a property is changed.
   * @event module:ol/Object.ObjectEvent#propertychange
   * @api
   */
  PROPERTYCHANGE: "propertychange"
};
function je(A, t, e, n, i) {
  if (i) {
    const s = e;
    e = function(g) {
      return A.removeEventListener(t, e), s.call(n ?? this, g);
    };
  } else n && n !== A && (e = e.bind(n));
  const r = {
    target: A,
    type: t,
    listener: e
  };
  return A.addEventListener(t, e), r;
}
function Br(A, t, e, n) {
  return je(A, t, e, n, !0);
}
function MA(A) {
  A && A.target && (A.target.removeEventListener(A.type, A.listener), Ws(A));
}
const Ze = {
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
class ei extends Hs {
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
    ++this.revision_, this.dispatchEvent(Ze.CHANGE);
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
      const n = t.length, i = new Array(n);
      for (let r = 0; r < n; ++r)
        i[r] = je(this, t[r], e);
      return i;
    }
    return je(
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
      const i = t.length;
      n = new Array(i);
      for (let r = 0; r < i; ++r)
        n[r] = Br(this, t[r], e);
    } else
      n = Br(
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
      /** @type {Object} */
      e.ol_key
    );
    if (n)
      Qo(n);
    else if (Array.isArray(t))
      for (let i = 0, r = t.length; i < r; ++i)
        this.removeEventListener(t[i], e);
    else
      this.removeEventListener(t, e);
  }
}
ei.prototype.on;
ei.prototype.once;
ei.prototype.un;
function Qo(A) {
  if (Array.isArray(A))
    for (let t = 0, e = A.length; t < e; ++t)
      MA(A[t]);
  else
    MA(
      /** @type {import("./events.js").EventsKey} */
      A
    );
}
class Or extends Re {
  /**
   * @param {string} type The event type.
   * @param {string} key The property name.
   * @param {*} oldValue The old value for `key`.
   */
  constructor(t, e, n) {
    super(t), this.key = e, this.oldValue = n;
  }
}
class OA extends ei {
  /**
   * @param {NoInfer<Properties>} [values] An object with key-value pairs.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, Wo(this), this.values_ = null, t !== void 0 && this.setProperties(t);
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
    n = `change:${t}`, this.hasListener(n) && this.dispatchEvent(new Or(n, t, e)), n = Ho.PROPERTYCHANGE, this.hasListener(n) && this.dispatchEvent(new Or(n, t, e));
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
      const r = i[t];
      i[t] = e, r !== e && this.notify(t, r);
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
      delete this.values_[t], xo(this.values_) && (this.values_ = null), e || this.notify(t, n);
    }
  }
}
function Yo(...A) {
  console.warn(...A);
}
function oe(A, t, e) {
  return Math.min(Math.max(A, t), e);
}
function Vo(A, t, e, n, i, r) {
  const s = i - e, g = r - n;
  if (s !== 0 || g !== 0) {
    const o = ((A - e) * s + (t - n) * g) / (s * s + g * g);
    o > 1 ? (e = i, n = r) : o > 0 && (e += s * o, n += g * o);
  }
  return RA(A, t, e, n);
}
function RA(A, t, e, n) {
  const i = e - A, r = n - t;
  return i * i + r * r;
}
function Lr(A) {
  return A * 180 / Math.PI;
}
function TA(A) {
  return A * Math.PI / 180;
}
function Gi(A, t) {
  const e = A % t;
  return e * t < 0 ? e + t : e;
}
function qi(A, t, e) {
  return A + e * (t - A);
}
function Xi(A, t, e) {
  if (A >= t && A < e)
    return A;
  const n = e - t;
  return ((A - t) % n + n) % n + t;
}
function _o(A, t) {
  return A[0] += +t[0], A[1] += +t[1], A;
}
function Wn(A, t) {
  let e = !0;
  for (let n = A.length - 1; n >= 0; --n)
    if (A[n] != t[n]) {
      e = !1;
      break;
    }
  return e;
}
function $i(A, t) {
  const e = Math.cos(t), n = Math.sin(t), i = A[0] * e - A[1] * n, r = A[1] * e + A[0] * n;
  return A[0] = i, A[1] = r, A;
}
function Ko(A, t) {
  return A[0] *= t, A[1] *= t, A;
}
const Js = {
  // use the radius of the Normal sphere
  radians: 6370997 / (2 * Math.PI),
  degrees: 2 * Math.PI * 6370997 / 360,
  ft: 0.3048,
  m: 1,
  "us-ft": 1200 / 3937
};
class nn {
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
const In = 6378137, vA = Math.PI * In, Jo = [-vA, -vA, vA, vA], qo = [-180, -85, 180, 85], Ln = In * Math.log(Math.tan(Math.PI / 2));
class fA extends nn {
  /**
   * @param {string} code Code.
   */
  constructor(t) {
    super({
      code: t,
      units: "m",
      extent: Jo,
      global: !0,
      worldExtent: qo,
      getPointResolution: function(e, n) {
        return e / Math.cosh(n[1] / In);
      }
    });
  }
}
const kr = [
  new fA("EPSG:3857"),
  new fA("EPSG:102100"),
  new fA("EPSG:102113"),
  new fA("EPSG:900913"),
  new fA("http://www.opengis.net/def/crs/EPSG/0/3857"),
  new fA("http://www.opengis.net/gml/srs/epsg.xml#3857")
];
function $o(A, t, e, n) {
  const i = A.length;
  e = e > 1 ? e : 2, n = n ?? e, t === void 0 && (e > 2 ? t = A.slice() : t = new Array(i));
  for (let r = 0; r < i; r += n) {
    t[r] = vA * A[r] / 180;
    let s = In * Math.log(Math.tan(Math.PI * (+A[r + 1] + 90) / 360));
    s > Ln ? s = Ln : s < -Ln && (s = -Ln), t[r + 1] = s;
  }
  return t;
}
function ta(A, t, e, n) {
  const i = A.length;
  e = e > 1 ? e : 2, n = n ?? e, t === void 0 && (e > 2 ? t = A.slice() : t = new Array(i));
  for (let r = 0; r < i; r += n)
    t[r] = 180 * A[r] / vA, t[r + 1] = 360 * Math.atan(Math.exp(A[r + 1] / In)) / Math.PI - 90;
  return t;
}
const ea = 6378137, Nr = [-180, -90, 180, 90], Aa = Math.PI * ea / 180;
class Ve extends nn {
  /**
   * @param {string} code Code.
   * @param {string} [axisOrientation] Axis orientation.
   */
  constructor(t, e) {
    super({
      code: t,
      units: "degrees",
      extent: Nr,
      axisOrientation: e,
      global: !0,
      metersPerUnit: Aa,
      worldExtent: Nr
    });
  }
}
const Gr = [
  new Ve("CRS:84"),
  new Ve("EPSG:4326", "neu"),
  new Ve("urn:ogc:def:crs:OGC:1.3:CRS84"),
  new Ve("urn:ogc:def:crs:OGC:2:84"),
  new Ve("http://www.opengis.net/def/crs/OGC/1.3/CRS84"),
  new Ve("http://www.opengis.net/gml/srs/epsg.xml#4326", "neu"),
  new Ve("http://www.opengis.net/def/crs/EPSG/0/4326", "neu")
];
let ji = {};
function na(A) {
  return ji[A] || ji[A.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/, "EPSG:$3")] || null;
}
function ia(A, t) {
  ji[A] = t;
}
let SA = {};
function rn(A, t, e) {
  const n = A.getCode(), i = t.getCode();
  n in SA || (SA[n] = {}), SA[n][i] = e;
}
function fi(A, t) {
  return A in SA && t in SA[A] ? SA[A][t] : null;
}
const Hn = 0.9996, Ae = 669438e-8, Ai = Ae * Ae, ni = Ai * Ae, $e = Ae / (1 - Ae), Xr = Math.sqrt(1 - Ae), DA = (1 - Xr) / (1 + Xr), qs = DA * DA, tr = qs * DA, er = tr * DA, $s = er * DA, tg = 1 - Ae / 4 - 3 * Ai / 64 - 5 * ni / 256, ra = 3 * Ae / 8 + 3 * Ai / 32 + 45 * ni / 1024, sa = 15 * Ai / 256 + 45 * ni / 1024, ga = 35 * ni / 3072, oa = 3 / 2 * DA - 27 / 32 * tr + 269 / 512 * $s, aa = 21 / 16 * qs - 55 / 32 * er, Ia = 151 / 96 * tr - 417 / 128 * $s, Ca = 1097 / 512 * er, Qn = 6378137;
function ca(A, t, e) {
  const n = A - 5e5, s = (e.north ? t : t - 1e7) / Hn / (Qn * tg), g = s + oa * Math.sin(2 * s) + aa * Math.sin(4 * s) + Ia * Math.sin(6 * s) + Ca * Math.sin(8 * s), o = Math.sin(g), a = o * o, I = Math.cos(g), c = o / I, h = c * c, m = h * h, b = 1 - Ae * a, v = Math.sqrt(1 - Ae * a), T = Qn / v, O = (1 - Ae) / b, Z = $e * I ** 2, Q = Z * Z, U = n / (T * Hn), Y = U * U, nt = Y * U, tt = nt * U, _ = tt * U, pt = _ * U, yt = g - c / O * (Y / 2 - tt / 24 * (5 + 3 * h + 10 * Z - 4 * Q - 9 * $e)) + pt / 720 * (61 + 90 * h + 298 * Z + 45 * m - 252 * $e - 3 * Q);
  let lt = (U - nt / 6 * (1 + 2 * h + Z) + _ / 120 * (5 - 2 * Z + 28 * h - 3 * Q + 8 * $e + 24 * m)) / I;
  return lt = Xi(
    lt + TA(eg(e.number)),
    -Math.PI,
    Math.PI
  ), [Lr(lt), Lr(yt)];
}
const jr = -80, Zr = 84, la = -180, ha = 180;
function ua(A, t, e) {
  A = Xi(A, la, ha), t < jr ? t = jr : t > Zr && (t = Zr);
  const n = TA(t), i = Math.sin(n), r = Math.cos(n), s = i / r, g = s * s, o = g * g, a = TA(A), I = eg(e.number), c = TA(I), h = Qn / Math.sqrt(1 - Ae * i ** 2), m = $e * r ** 2, b = r * Xi(a - c, -Math.PI, Math.PI), v = b * b, T = v * b, O = T * b, Z = O * b, Q = Z * b, U = Qn * (tg * n - ra * Math.sin(2 * n) + sa * Math.sin(4 * n) - ga * Math.sin(6 * n)), Y = Hn * h * (b + T / 6 * (1 - g + m) + Z / 120 * (5 - 18 * g + o + 72 * m - 58 * $e)) + 5e5;
  let nt = Hn * (U + h * s * (v / 2 + O / 24 * (5 - g + 9 * m + 4 * m ** 2) + Q / 720 * (61 - 58 * g + o + 600 * m - 330 * $e)));
  return e.north || (nt += 1e7), [Y, nt];
}
function eg(A) {
  return (A - 1) * 6 - 180 + 3;
}
const fa = [
  /^EPSG:(\d+)$/,
  /^urn:ogc:def:crs:EPSG::(\d+)$/,
  /^http:\/\/www\.opengis\.net\/def\/crs\/EPSG\/0\/(\d+)$/
];
function Ag(A) {
  let t = 0;
  for (const i of fa) {
    const r = A.match(i);
    if (r) {
      t = parseInt(r[1]);
      break;
    }
  }
  if (!t)
    return null;
  let e = 0, n = !1;
  return t > 32700 && t < 32761 ? e = t - 32700 : t > 32600 && t < 32661 && (n = !0, e = t - 32600), e ? { number: e, north: n } : null;
}
function Fr(A, t) {
  return function(e, n, i, r) {
    const s = e.length;
    i = i > 1 ? i : 2, r = r ?? i, n || (i > 2 ? n = e.slice() : n = new Array(s));
    for (let g = 0; g < s; g += r) {
      const o = e[g], a = e[g + 1], I = A(o, a, t);
      n[g] = I[0], n[g + 1] = I[1];
    }
    return n;
  };
}
function da(A) {
  return Ag(A) ? new nn({ code: A, units: "m" }) : null;
}
function ma(A) {
  const t = Ag(A.getCode());
  return t ? {
    forward: Fr(ua, t),
    inverse: Fr(ca, t)
  } : null;
}
const pa = [ma], ya = [da];
let Zi = !0;
function wa(A) {
  Zi = !1;
}
function ng(A, t) {
  if (t !== void 0) {
    for (let e = 0, n = A.length; e < n; ++e)
      t[e] = A[e];
    t = t;
  } else
    t = A.slice();
  return t;
}
function Fi(A) {
  ia(A.getCode(), A), rn(A, A, ng);
}
function ba(A) {
  A.forEach(Fi);
}
function sn(A) {
  if (typeof A != "string")
    return A;
  const t = na(A);
  if (t)
    return t;
  for (const e of ya) {
    const n = e(A);
    if (n)
      return n;
  }
  return null;
}
function Ur(A) {
  ba(A), A.forEach(function(t) {
    A.forEach(function(e) {
      t !== e && rn(t, e, ng);
    });
  });
}
function Ea(A, t, e, n) {
  A.forEach(function(i) {
    t.forEach(function(r) {
      rn(i, r, e), rn(r, i, n);
    });
  });
}
function Ar(A, t) {
  return A ? typeof A == "string" ? sn(A) : (
    /** @type {Projection} */
    A
  ) : sn(t);
}
function va(A, t) {
  const e = A.getCode(), n = t.getCode();
  let i = fi(e, n);
  if (i)
    return i;
  let r = null, s = null;
  for (const o of pa)
    r || (r = o(A)), s || (s = o(t));
  if (!r && !s)
    return null;
  const g = "EPSG:4326";
  if (s)
    if (r)
      i = di(
        r.inverse,
        s.forward
      );
    else {
      const o = fi(e, g);
      o && (i = di(
        o,
        s.forward
      ));
    }
  else {
    const o = fi(g, n);
    o && (i = di(
      r.inverse,
      o
    ));
  }
  return i && (Fi(A), Fi(t), rn(A, t, i)), i;
}
function di(A, t) {
  return function(e, n, i, r) {
    return n = A(e, n, i, r), t(n, n, i, r);
  };
}
function zr(A, t) {
  const e = sn(A), n = sn(t);
  return va(e, n);
}
function Wr(A, t) {
  return A;
}
function Be(A, t) {
  return Zi && !Wn(A, [0, 0]) && A[0] >= -180 && A[0] <= 180 && A[1] >= -90 && A[1] <= 90 && (Zi = !1, Yo(
    "Call useGeographic() from ol/proj once to work with [longitude, latitude] coordinates."
  )), A;
}
function Ma(A, t) {
  return A;
}
function kn(A, t) {
  return A;
}
function Ra() {
  Ur(kr), Ur(Gr), Ea(
    Gr,
    kr,
    $o,
    ta
  );
}
Ra();
function Ne(A, t) {
  if (!A)
    throw new Error(t);
}
const Ta = [1, 0, 0, 1, 0, 0];
new Array(6);
function Sa() {
  return Ta.slice(0);
}
function Pa(A, t, e, n, i, r, s, g) {
  const o = Math.sin(r), a = Math.cos(r);
  return A[0] = n * a, A[1] = i * o, A[2] = -n * o, A[3] = i * a, A[4] = s * n * a - g * n * o + t, A[5] = s * i * o + g * i * a + e, A;
}
function xa(A, t, e, n, i, r, s) {
  r = r || [], s = s || 2;
  let g = 0;
  for (let o = t; o < e; o += n) {
    const a = A[o], I = A[o + 1];
    r[g++] = i[0] * a + i[2] * I + i[4], r[g++] = i[1] * a + i[3] * I + i[5];
    for (let c = 2; c < s; c++)
      r[g++] = A[o + c];
  }
  return r && r.length != g && (r.length = g), r;
}
function ig(A, t, e, n, i, r, s) {
  s = s || [];
  const g = Math.cos(i), o = Math.sin(i), a = r[0], I = r[1];
  let c = 0;
  for (let h = t; h < e; h += n) {
    const m = A[h] - a, b = A[h + 1] - I;
    s[c++] = a + m * g - b * o, s[c++] = I + m * o + b * g;
    for (let v = h + 2; v < h + n; ++v)
      s[c++] = A[v];
  }
  return s && s.length != c && (s.length = c), s;
}
function Da(A, t, e, n, i, r, s, g) {
  g = g || [];
  const o = s[0], a = s[1];
  let I = 0;
  for (let c = t; c < e; c += n) {
    const h = A[c] - o, m = A[c + 1] - a;
    g[I++] = o + i * h, g[I++] = a + r * m;
    for (let b = c + 2; b < c + n; ++b)
      g[I++] = A[b];
  }
  return g && g.length != I && (g.length = I), g;
}
function Ba(A, t, e, n, i, r, s) {
  s = s || [];
  let g = 0;
  for (let o = t; o < e; o += n) {
    s[g++] = A[o] + i, s[g++] = A[o + 1] + r;
    for (let a = o + 2; a < o + n; ++a)
      s[g++] = A[a];
  }
  return s && s.length != g && (s.length = g), s;
}
const Hr = Sa(), Oa = [NaN, NaN];
class La extends OA {
  constructor() {
    super(), this.extent_ = Qs(), this.extentRevision_ = -1, this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = 0, this.simplifyTransformedInternal = Po(
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
    return Ht();
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
    return Ht();
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   */
  containsXY(t, e) {
    return this.closestPointXY(t, e, Oa, Number.MIN_VALUE) === 0;
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
    return Ht();
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
      (isNaN(e[0]) || isNaN(e[1])) && Ys(e), this.extentRevision_ = this.getRevision();
    }
    return Fo(this.extent_, t);
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
    Ht();
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
    Ht();
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
    return Ht();
  }
  /**
   * Get the type of this geometry.
   * @abstract
   * @return {Type} Geometry type.
   */
  getType() {
    return Ht();
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
    Ht();
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   */
  intersectsExtent(t) {
    return Ht();
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
    Ht();
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
    const n = sn(t), i = n.getUnits() == "tile-pixels" ? function(r, s, g) {
      const o = n.getExtent(), a = n.getWorldExtent(), I = An(a) / An(o);
      Pa(
        Hr,
        a[0],
        a[3],
        I,
        -I,
        0,
        0,
        0
      );
      const c = xa(
        r,
        0,
        r.length,
        g,
        Hr,
        s
      ), h = zr(n, e);
      return h ? h(c, c, g) : c;
    } : zr(n, e);
    return this.applyTransform(i), this;
  }
}
class Cn extends La {
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
    return Oo(
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
    return Ht();
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
    this.stride = Qr(t), this.layout = t, this.flatCoordinates = e;
  }
  /**
   * @abstract
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  setCoordinates(t, e) {
    Ht();
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
      i = Qr(t);
    else {
      for (let r = 0; r < n; ++r) {
        if (e.length === 0) {
          this.layout = "XY", this.stride = 2;
          return;
        }
        e = /** @type {Array<unknown>} */
        e[0];
      }
      i = e.length, t = ka(i);
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
      ig(
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
    e === void 0 && (e = t), n || (n = zn(this.getExtent()));
    const i = this.getFlatCoordinates();
    if (i) {
      const r = this.getStride();
      Da(
        i,
        0,
        i.length,
        r,
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
      Ba(
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
function ka(A) {
  let t;
  return A == 2 ? t = "XY" : A == 3 ? t = "XYZ" : A == 4 && (t = "XYZM"), /** @type {import("./Geometry.js").GeometryLayout} */
  t;
}
function Qr(A) {
  let t;
  return A == "XY" ? t = 2 : A == "XYZ" || A == "XYM" ? t = 3 : A == "XYZM" && (t = 4), /** @type {number} */
  t;
}
function rg(A, t, e, n) {
  for (let i = 0, r = e.length; i < r; ++i)
    A[t++] = e[i];
  return t;
}
function nr(A, t, e, n) {
  for (let i = 0, r = e.length; i < r; ++i) {
    const s = e[i];
    for (let g = 0; g < n; ++g)
      A[t++] = s[g];
  }
  return t;
}
function Na(A, t, e, n, i) {
  i = i || [];
  let r = 0;
  for (let s = 0, g = e.length; s < g; ++s) {
    const o = nr(
      A,
      t,
      e[s],
      n
    );
    i[r++] = o, t = o;
  }
  return i.length = r, i;
}
class ir extends Cn {
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
    const t = new ir(
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
    const r = this.flatCoordinates, s = t - r[0], g = e - r[1], o = s * s + g * g;
    if (o < i) {
      if (o === 0)
        for (let a = 0; a < this.stride; ++a)
          n[a] = r[a];
      else {
        const a = this.getRadius() / Math.sqrt(o);
        n[0] = r[0] + a * s, n[1] = r[1] + a * g;
        for (let I = 2; I < this.stride; ++I)
          n[I] = r[I];
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
    const n = this.flatCoordinates, i = t - n[0], r = e - n[1];
    return i * i + r * r <= this.getRadiusSquared_();
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
    return ti(
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
    if (Ji(t, e)) {
      const n = this.getCenter();
      return t[0] <= n[0] && t[2] >= n[0] || t[1] <= n[1] && t[3] >= n[1] ? !0 : _s(t, this.intersectsCoordinate.bind(this));
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
    for (let r = 1; r < e; ++r)
      i[e + r] = t[r];
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
    let r = rg(i, 0, t, this.stride);
    i[r++] = i[0] + e;
    for (let s = 1, g = this.stride; s < g; ++s)
      i[r++] = i[s];
    i.length = r, this.changed();
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
      ig(n, 0, n.length, i, t, e, n)
    ), this.changed();
  }
}
function sg(A, t, e, n) {
  let i = 0;
  const r = A[e - n], s = A[e - n + 1];
  let g = 0, o = 0;
  for (; t < e; t += n) {
    const a = A[t] - r, I = A[t + 1] - s;
    i += o * a - g * I, g = a, o = I;
  }
  return i / 2;
}
function Ga(A, t, e, n) {
  let i = 0;
  for (let r = 0, s = e.length; r < s; ++r) {
    const g = e[r];
    i += sg(A, t, g, n), t = g;
  }
  return i;
}
function Yr(A, t, e, n, i, r, s) {
  const g = A[t], o = A[t + 1], a = A[e] - g, I = A[e + 1] - o;
  let c;
  if (a === 0 && I === 0)
    c = t;
  else {
    const h = ((i - g) * a + (r - o) * I) / (a * a + I * I);
    if (h > 1)
      c = e;
    else if (h > 0) {
      for (let m = 0; m < n; ++m)
        s[m] = qi(
          A[t + m],
          A[e + m],
          h
        );
      s.length = n;
      return;
    } else
      c = t;
  }
  for (let h = 0; h < n; ++h)
    s[h] = A[c + h];
  s.length = n;
}
function rr(A, t, e, n, i) {
  let r = A[t], s = A[t + 1];
  for (t += n; t < e; t += n) {
    const g = A[t], o = A[t + 1], a = RA(r, s, g, o);
    a > i && (i = a), r = g, s = o;
  }
  return i;
}
function Xa(A, t, e, n, i) {
  for (let r = 0, s = e.length; r < s; ++r) {
    const g = e[r];
    i = rr(A, t, g, n, i), t = g;
  }
  return i;
}
function sr(A, t, e, n, i, r, s, g, o, a, I) {
  if (t == e)
    return a;
  let c, h;
  if (i === 0) {
    if (h = RA(
      s,
      g,
      A[t],
      A[t + 1]
    ), h < a) {
      for (c = 0; c < n; ++c)
        o[c] = A[t + c];
      return o.length = n, h;
    }
    return a;
  }
  I = I || [NaN, NaN];
  let m = t + n;
  for (; m < e; )
    if (Yr(
      A,
      m - n,
      m,
      n,
      s,
      g,
      I
    ), h = RA(s, g, I[0], I[1]), h < a) {
      for (a = h, c = 0; c < n; ++c)
        o[c] = I[c];
      o.length = n, m += n;
    } else
      m += n * Math.max(
        (Math.sqrt(h) - Math.sqrt(a)) / i | 0,
        1
      );
  if (r && (Yr(
    A,
    e - n,
    t,
    n,
    s,
    g,
    I
  ), h = RA(s, g, I[0], I[1]), h < a)) {
    for (a = h, c = 0; c < n; ++c)
      o[c] = I[c];
    o.length = n;
  }
  return a;
}
function ja(A, t, e, n, i, r, s, g, o, a, I) {
  I = I || [NaN, NaN];
  for (let c = 0, h = e.length; c < h; ++c) {
    const m = e[c];
    a = sr(
      A,
      t,
      m,
      n,
      i,
      r,
      s,
      g,
      o,
      a,
      I
    ), t = m;
  }
  return a;
}
function gr(A, t, e, n, i) {
  i = i !== void 0 ? i : [];
  let r = 0;
  for (let s = t; s < e; s += n)
    i[r++] = A.slice(s, s + n);
  return i.length = r, i;
}
function Za(A, t, e, n, i) {
  i = i !== void 0 ? i : [];
  let r = 0;
  for (let s = 0, g = e.length; s < g; ++s) {
    const o = e[s];
    i[r++] = gr(
      A,
      t,
      o,
      n,
      i[r]
    ), t = o;
  }
  return i.length = r, i;
}
function Fa(A, t, e, n, i) {
  return !_s(
    i,
    /**
     * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
     * @return {boolean} Contains (x, y).
     */
    function(s) {
      return !tA(
        A,
        t,
        e,
        n,
        s[0],
        s[1]
      );
    }
  );
}
function tA(A, t, e, n, i, r) {
  let s = 0, g = A[e - n], o = A[e - n + 1];
  for (; t < e; t += n) {
    const a = A[t], I = A[t + 1];
    o <= r ? I > r && (a - g) * (r - o) - (i - g) * (I - o) > 0 && s++ : I <= r && (a - g) * (r - o) - (i - g) * (I - o) < 0 && s--, g = a, o = I;
  }
  return s !== 0;
}
function gg(A, t, e, n, i, r) {
  if (e.length === 0 || !tA(A, t, e[0], n, i, r))
    return !1;
  for (let s = 1, g = e.length; s < g; ++s)
    if (tA(A, e[s - 1], e[s], n, i, r))
      return !1;
  return !0;
}
function og(A, t, e, n, i) {
  let r;
  for (t += n; t < e; t += n)
    if (r = i(
      A.slice(t - n, t),
      A.slice(t, t + n)
    ), r)
      return r;
  return !1;
}
function ii(A, t, e, n, i, r) {
  return r = r ?? Vs(Qs(), A, t, e, n), Ji(i, r) ? r[0] >= i[0] && r[2] <= i[2] || r[1] >= i[1] && r[3] <= i[3] ? !0 : og(
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
    function(s, g) {
      return Uo(i, s, g);
    }
  ) : !1;
}
function Ua(A, t, e, n, i) {
  return !!(ii(A, t, e, n, i) || tA(
    A,
    t,
    e,
    n,
    i[0],
    i[1]
  ) || tA(
    A,
    t,
    e,
    n,
    i[0],
    i[3]
  ) || tA(
    A,
    t,
    e,
    n,
    i[2],
    i[1]
  ) || tA(
    A,
    t,
    e,
    n,
    i[2],
    i[3]
  ));
}
function za(A, t, e, n, i) {
  if (!Ua(A, t, e[0], n, i))
    return !1;
  if (e.length === 1)
    return !0;
  for (let r = 1, s = e.length; r < s; ++r)
    if (Fa(
      A,
      e[r - 1],
      e[r],
      n,
      i
    ) && !ii(
      A,
      e[r - 1],
      e[r],
      n,
      i
    ))
      return !1;
  return !0;
}
function ag(A, t, e, n, i, r, s) {
  const g = (e - t) / n;
  if (g < 3) {
    for (; t < e; t += n)
      r[s++] = A[t], r[s++] = A[t + 1];
    return s;
  }
  const o = new Array(g);
  o[0] = 1, o[g - 1] = 1;
  const a = [t, e - n];
  let I = 0;
  for (; a.length > 0; ) {
    const c = a.pop(), h = a.pop();
    let m = 0;
    const b = A[h], v = A[h + 1], T = A[c], O = A[c + 1];
    for (let Z = h + n; Z < c; Z += n) {
      const Q = A[Z], U = A[Z + 1], Y = Vo(Q, U, b, v, T, O);
      Y > m && (I = Z, m = Y);
    }
    m > i && (o[(I - t) / n] = 1, h + n < I && a.push(h, I), I + n < c && a.push(I, c));
  }
  for (let c = 0; c < g; ++c)
    o[c] && (r[s++] = A[t + c * n], r[s++] = A[t + c * n + 1]);
  return s;
}
function dA(A, t) {
  return t * Math.round(A / t);
}
function Wa(A, t, e, n, i, r, s) {
  if (t == e)
    return s;
  let g = dA(A[t], i), o = dA(A[t + 1], i);
  t += n, r[s++] = g, r[s++] = o;
  let a, I;
  do
    if (a = dA(A[t], i), I = dA(A[t + 1], i), t += n, t == e)
      return r[s++] = a, r[s++] = I, s;
  while (a == g && I == o);
  for (; t < e; ) {
    const c = dA(A[t], i), h = dA(A[t + 1], i);
    if (t += n, c == a && h == I)
      continue;
    const m = a - g, b = I - o, v = c - g, T = h - o;
    if (m * T == b * v && (m < 0 && v < m || m == v || m > 0 && v > m) && (b < 0 && T < b || b == T || b > 0 && T > b)) {
      a = c, I = h;
      continue;
    }
    r[s++] = a, r[s++] = I, g = a, o = I, a = c, I = h;
  }
  return r[s++] = a, r[s++] = I, s;
}
function Ha(A, t, e, n, i, r, s, g) {
  for (let o = 0, a = e.length; o < a; ++o) {
    const I = e[o];
    s = Wa(
      A,
      t,
      I,
      n,
      i,
      r,
      s
    ), g.push(s), t = I;
  }
  return s;
}
class gn extends Cn {
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
    return new gn(this.flatCoordinates.slice(), this.layout);
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
    return i < _i(this.getExtent(), t, e) ? i : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      rr(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), sr(
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
    return sg(
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
    return gr(
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
    return e.length = ag(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      0
    ), new gn(e, "XY");
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
    return ii(
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
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = nr(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function Qa(A, t, e, n, i, r, s) {
  let g, o;
  const a = (e - t) / n;
  if (a === 1)
    g = t;
  else if (a === 2)
    g = t, o = i;
  else if (a !== 0) {
    let I = A[t], c = A[t + 1], h = 0;
    const m = [0];
    for (let T = t + n; T < e; T += n) {
      const O = A[T], Z = A[T + 1];
      h += Math.sqrt((O - I) * (O - I) + (Z - c) * (Z - c)), m.push(h), I = O, c = Z;
    }
    const b = i * h, v = Ro(m, b);
    v < 0 ? (o = (b - m[-v - 2]) / (m[-v - 1] - m[-v - 2]), g = t + (-v - 2) * n) : g = t + v * n;
  }
  s = s > 1 ? s : 2, r = r || new Array(s);
  for (let I = 0; I < s; ++I)
    r[I] = g === void 0 ? NaN : o === void 0 ? A[g + I] : qi(A[g + I], A[g + n + I], o);
  return r;
}
function Ya(A, t, e, n, i, r) {
  if (e == t)
    return null;
  let s;
  if (i < A[t + n - 1])
    return r ? (s = A.slice(t, t + n), s[n - 1] = i, s) : null;
  if (A[e - 1] < i)
    return r ? (s = A.slice(e - n, e), s[n - 1] = i, s) : null;
  if (i == A[t + n - 1])
    return A.slice(t, t + n);
  let g = t / n, o = e / n;
  for (; g < o; ) {
    const h = g + o >> 1;
    i < A[(h + 1) * n - 1] ? o = h : g = h + 1;
  }
  const a = A[g * n - 1];
  if (i == a)
    return A.slice((g - 1) * n, (g - 1) * n + n);
  const I = A[(g + 1) * n - 1], c = (i - a) / (I - a);
  s = [];
  for (let h = 0; h < n - 1; ++h)
    s.push(
      qi(
        A[(g - 1) * n + h],
        A[g * n + h],
        c
      )
    );
  return s.push(i), s;
}
function Va(A, t, e, n) {
  let i = A[t], r = A[t + 1], s = 0;
  for (let g = t + n; g < e; g += n) {
    const o = A[g], a = A[g + 1];
    s += Math.sqrt((o - i) * (o - i) + (a - r) * (a - r)), i = o, r = a;
  }
  return s;
}
class Yn extends Cn {
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
    zs(this.flatCoordinates, t), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!LineString} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new Yn(
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
    return i < _i(this.getExtent(), t, e) ? i : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      rr(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), sr(
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
    return this.layout != "XYM" && this.layout != "XYZM" ? null : (e = e !== void 0 ? e : !1, Ya(
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
    return gr(
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
    return Qa(
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
    return Va(
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
    return e.length = ag(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      0
    ), new Yn(e, "XY");
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
    return ii(
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
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = nr(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
class on extends Cn {
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
    const t = new on(this.flatCoordinates.slice(), this.layout);
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
    const r = this.flatCoordinates, s = RA(
      t,
      e,
      r[0],
      r[1]
    );
    if (s < i) {
      const g = this.stride;
      for (let o = 0; o < g; ++o)
        n[o] = r[o];
      return n.length = g, s;
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
    return Bo(this.flatCoordinates, t);
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
    return Do(t, this.flatCoordinates[0], this.flatCoordinates[1]);
  }
  /**
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 0), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = rg(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function _a(A, t, e, n, i, r, s) {
  let g, o, a, I, c, h, m;
  const b = i[r + 1], v = [];
  for (let Z = 0, Q = e.length; Z < Q; ++Z) {
    const U = e[Z];
    for (I = A[U - n], h = A[U - n + 1], g = t; g < U; g += n)
      c = A[g], m = A[g + 1], (b <= h && m <= b || h <= b && b <= m) && (a = (b - h) / (m - h) * (c - I) + I, v.push(a)), I = c, h = m;
  }
  let T = NaN, O = -1 / 0;
  for (v.sort(Fs), I = v[0], g = 1, o = v.length; g < o; ++g) {
    c = v[g];
    const Z = Math.abs(c - I);
    Z > O && (a = (I + c) / 2, gg(A, t, e, n, a, b) && (T = a, O = Z)), I = c;
  }
  return isNaN(T) && (T = i[r]), [T, b, O];
}
function Ka(A, t, e, n) {
  for (; t < e - n; ) {
    for (let i = 0; i < n; ++i) {
      const r = A[t + i];
      A[t + i] = A[e - n + i], A[e - n + i] = r;
    }
    t += n, e -= n;
  }
}
function Ig(A, t, e, n) {
  let i = 0, r = A[e - n], s = A[e - n + 1];
  for (; t < e; t += n) {
    const g = A[t], o = A[t + 1];
    i += (g - r) * (o + s), r = g, s = o;
  }
  return i === 0 ? void 0 : i > 0;
}
function Ja(A, t, e, n, i) {
  i = i !== void 0 ? i : !1;
  for (let r = 0, s = e.length; r < s; ++r) {
    const g = e[r], o = Ig(
      A,
      t,
      g,
      n
    );
    if (r === 0) {
      if (i && o || !i && !o)
        return !1;
    } else if (i && !o || !i && o)
      return !1;
    t = g;
  }
  return !0;
}
function Vr(A, t, e, n, i) {
  i = i !== void 0 ? i : !1;
  for (let r = 0, s = e.length; r < s; ++r) {
    const g = e[r], o = Ig(
      A,
      t,
      g,
      n
    );
    (r === 0 ? i && o || !i && !o : i && !o || !i && o) && Ka(A, t, g, n), t = g;
  }
  return t;
}
class eA extends Cn {
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
    this.flatCoordinates ? zs(this.flatCoordinates, t.getFlatCoordinates()) : this.flatCoordinates = t.getFlatCoordinates().slice(), this.ends_.push(this.flatCoordinates.length), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Polygon} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new eA(
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
    return i < _i(this.getExtent(), t, e) ? i : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      Xa(
        this.flatCoordinates,
        0,
        this.ends_,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), ja(
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
    return gg(
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
    return Ga(
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
    return t !== void 0 ? (e = this.getOrientedFlatCoordinates().slice(), Vr(e, 0, this.ends_, this.stride, t)) : e = this.flatCoordinates, Za(e, 0, this.ends_, this.stride);
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
      const t = zn(this.getExtent());
      this.flatInteriorPoint_ = _a(
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
    return new on(this.getFlatInteriorPoint(), "XYM");
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
    return t < 0 || this.ends_.length <= t ? null : new gn(
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
    let r = 0;
    for (let s = 0, g = n.length; s < g; ++s) {
      const o = n[s], a = new gn(
        e.slice(r, o),
        t
      );
      i.push(a), r = o;
    }
    return i;
  }
  /**
   * @return {Array<number>} Oriented flat coordinates.
   */
  getOrientedFlatCoordinates() {
    if (this.orientedRevision_ != this.getRevision()) {
      const t = this.flatCoordinates;
      Ja(t, 0, this.ends_, this.stride) ? this.orientedFlatCoordinates_ = t : (this.orientedFlatCoordinates_ = t.slice(), this.orientedFlatCoordinates_.length = Vr(
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
    return e.length = Ha(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      Math.sqrt(t),
      e,
      0,
      n
    ), new eA(e, "XY", n);
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
    return za(
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
    const n = Na(
      this.flatCoordinates,
      0,
      t,
      this.stride,
      this.ends_
    );
    this.flatCoordinates.length = n.length === 0 ? 0 : n[n.length - 1], this.changed();
  }
}
function _r(A) {
  if (Ks(A))
    throw new Error("Cannot create polygon from empty extent");
  const t = A[0], e = A[1], n = A[2], i = A[3], r = [
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
  return new eA(r, "XY", [r.length]);
}
class BA extends Xs(Ss) {
  constructor(t = {}) {
    const e = js(t);
    if (super(e), t.mapID && (this.mapID = t.mapID), t.mapID === "morioka_ndl_affine") {
      const n = this.getTileUrlFunction();
      this.setTileUrlFunction((i, r, s) => n(i, r, s));
    }
    this.initialize(t);
  }
}
class Vn extends BA {
  style = "";
  accessToken = "";
  mapboxMap;
  static isMapbox_ = !0;
  constructor(t = {}) {
    super(t), this.style = t.style, this.mapboxMap = t.mapboxMap, this.accessToken = t.accessToken;
  }
}
class _n extends BA {
  style = "";
  maplibreMap;
  static isMapLibre_ = !0;
  constructor(t = {}) {
    super(t), this.style = t.style || "https://tile.openstreetmap.jp/styles/osm-bright/style.json", this.maplibreMap = t.maplibreMap;
  }
}
function qa(A, t) {
  const n = A ? {
    google_roadmap: { mapType: "roadmap", derivedLayers: [] },
    google_satellite: { mapType: "satellite", derivedLayers: [] },
    google_hybrid: { mapType: "satellite", derivedLayers: ["layerRoadmap"] },
    google_terrain: { mapType: "terrain", derivedLayers: ["layerRoadmap"] }
  }[A] : void 0, i = n?.mapType ?? "roadmap", r = n?.derivedLayers ?? [], s = (t || []).map(
    (o) => `layer${o.charAt(0).toUpperCase()}${o.slice(1).toLowerCase()}`
  ), g = new Set(r);
  for (const o of s) g.add(o);
  return { mapType: i, layerTypes: [...g] };
}
class Ui extends Xs(zg) {
  constructor(t = {}) {
    const e = Object.assign({}, t), { mapType: n, layerTypes: i } = qa(t.maptype, t.layers);
    e.mapType = n, e.layerTypes = i, super(e), t.mapID && (this.mapID = t.mapID), this.initialize(t);
  }
}
const Oe = {
  ANIMATING: 0,
  INTERACTING: 1
}, se = {
  CENTER: "center",
  RESOLUTION: "resolution",
  ROTATION: "rotation"
};
function Kr(A, t, e) {
  return (
    /**
     * @param {import("./coordinate.js").Coordinate|undefined} center Center.
     * @param {number|undefined} resolution Resolution.
     * @param {import("./size.js").Size} size Viewport size; unused if `onlyCenter` was specified.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @param {Array<number>} [centerShift] Shift between map center and viewport center.
     * @return {import("./coordinate.js").Coordinate|undefined} Center.
     */
    (function(n, i, r, s, g) {
      if (!n)
        return;
      if (!i && !t)
        return n;
      const o = t ? 0 : r[0] * i, a = t ? 0 : r[1] * i, I = g ? g[0] : 0, c = g ? g[1] : 0;
      let h = A[0] + o / 2 + I, m = A[2] - o / 2 + I, b = A[1] + a / 2 + c, v = A[3] - a / 2 + c;
      h > m && (h = (m + h) / 2, m = h), b > v && (b = (v + b) / 2, v = b);
      let T = oe(n[0], h, m), O = oe(n[1], b, v);
      if (s && e && i) {
        const Z = 30 * i;
        T += -Z * Math.log(1 + Math.max(0, h - n[0]) / Z) + Z * Math.log(1 + Math.max(0, n[0] - m) / Z), O += -Z * Math.log(1 + Math.max(0, b - n[1]) / Z) + Z * Math.log(1 + Math.max(0, n[1] - v) / Z);
      }
      return [T, O];
    })
  );
}
function $a(A) {
  return A;
}
function tI(A) {
  return Math.pow(A, 3);
}
function ri(A) {
  return 1 - tI(1 - A);
}
function eI(A) {
  return 3 * A * A - 2 * A * A * A;
}
function AI(A) {
  return A;
}
function or(A, t, e, n) {
  const i = Ki(t) / e[0], r = An(t) / e[1];
  return n ? Math.min(A, Math.max(i, r)) : Math.min(A, Math.min(i, r));
}
function ar(A, t, e) {
  let n = Math.min(A, t);
  const i = 50;
  return n *= Math.log(1 + i * Math.max(0, A / t - 1)) / i + 1, e && (n = Math.max(n, e), n /= Math.log(1 + i * Math.max(0, e / A - 1)) / i + 1), oe(n, e / 2, t * 2);
}
function nI(A, t, e, n) {
  return t = t !== void 0 ? t : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(i, r, s, g) {
    if (i !== void 0) {
      const o = A[0], a = A[A.length - 1], I = e ? or(
        o,
        e,
        s,
        n
      ) : o;
      if (g)
        return t ? ar(
          i,
          I,
          a
        ) : oe(i, a, I);
      const c = Math.min(I, i), h = Math.floor(Us(A, c, r));
      return A[h] > I && h < A.length - 1 ? A[h + 1] : A[h];
    }
  });
}
function iI(A, t, e, n, i, r) {
  return n = n !== void 0 ? n : !0, e = e !== void 0 ? e : 0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(s, g, o, a) {
    if (s !== void 0) {
      const I = i ? or(
        t,
        i,
        o,
        r
      ) : t;
      if (a)
        return n ? ar(
          s,
          I,
          e
        ) : oe(s, e, I);
      const c = 1e-9, h = Math.ceil(
        Math.log(t / I) / Math.log(A) - c
      ), m = -g * (0.5 - c) + 0.5, b = Math.min(I, s), v = Math.floor(
        Math.log(t / b) / Math.log(A) + m
      ), T = Math.max(h, v), O = t / Math.pow(A, T);
      return oe(O, e, I);
    }
  });
}
function Jr(A, t, e, n, i) {
  return e = e !== void 0 ? e : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(r, s, g, o) {
    if (r !== void 0) {
      const a = n ? or(
        A,
        n,
        g,
        i
      ) : A;
      return !e || !o ? oe(r, t, a) : ar(
        r,
        a,
        t
      );
    }
  });
}
function Ir(A) {
  if (A !== void 0)
    return 0;
}
function qr(A) {
  if (A !== void 0)
    return A;
}
function rI(A) {
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
function sI(A) {
  const t = TA(5);
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
const gI = 256, mi = 0;
class $r extends OA {
  /**
   * @param {ViewOptions} [options] View options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = Object.assign({}, t), this.hints_ = [0, 0], this.animations_ = [], this.updateAnimationKey_, this.projection_ = Ar(t.projection, "EPSG:3857"), this.viewportSize_ = [100, 100], this.targetCenter_ = null, this.targetResolution_, this.targetRotation_, this.nextCenter_ = null, this.nextResolution_, this.nextRotation_, this.cancelAnchor_ = void 0, t.projection && wa(), t.center && (t.center = Be(t.center, this.projection_)), t.extent && (t.extent = kn(t.extent, this.projection_)), this.applyOptions_(t);
  }
  /**
   * Set up the view with the given options.
   * @param {ViewOptions} options View options.
   */
  applyOptions_(t) {
    const e = Object.assign({}, t);
    for (const g in se)
      delete e[g];
    this.setProperties(e, !0);
    const n = aI(t);
    this.maxResolution_ = n.maxResolution, this.minResolution_ = n.minResolution, this.zoomFactor_ = n.zoomFactor, this.resolutions_ = t.resolutions, this.padding_ = t.padding, this.minZoom_ = n.minZoom;
    const i = oI(t), r = n.constraint, s = II(t);
    this.constraints_ = {
      center: i,
      resolution: r,
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
      const i = t || [0, 0, 0, 0];
      e = e || [0, 0, 0, 0];
      const r = this.getResolution(), s = r / 2 * (i[3] - e[3] + e[1] - i[1]), g = r / 2 * (i[0] - e[0] + e[2] - i[2]);
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
      let i = arguments[n];
      i.center && (i = Object.assign({}, i), i.center = Be(
        i.center,
        this.getProjection()
      )), i.anchor && (i = Object.assign({}, i), i.anchor = Be(
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
      const I = arguments[i];
      I.center && this.setCenterInternal(I.center), I.zoom !== void 0 ? this.setZoom(I.zoom) : I.resolution && this.setResolution(I.resolution), I.rotation !== void 0 && this.setRotation(I.rotation);
    }
    if (i === e) {
      n && Nn(n, !0);
      return;
    }
    let r = Date.now(), s = this.targetCenter_.slice(), g = this.targetResolution_, o = this.targetRotation_;
    const a = [];
    for (; i < e; ++i) {
      const I = (
        /** @type {AnimationOptions} */
        arguments[i]
      ), c = {
        start: r,
        complete: !1,
        anchor: I.anchor,
        duration: I.duration !== void 0 ? I.duration : 1e3,
        easing: I.easing || eI,
        callback: n
      };
      if (I.center && (c.sourceCenter = s, c.targetCenter = I.center.slice(), s = c.targetCenter), I.zoom !== void 0 ? (c.sourceResolution = g, c.targetResolution = this.getResolutionForZoom(I.zoom), g = c.targetResolution) : I.resolution && (c.sourceResolution = g, c.targetResolution = I.resolution, g = c.targetResolution), I.rotation !== void 0) {
        c.sourceRotation = o;
        const h = Gi(I.rotation - o + Math.PI, 2 * Math.PI) - Math.PI;
        c.targetRotation = o + h, o = c.targetRotation;
      }
      CI(c) ? c.complete = !0 : r += c.duration, a.push(c);
    }
    this.animations_.push(a), this.setHint(Oe.ANIMATING, 1), this.updateAnimations_();
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
      const i = this.animations_[e];
      if (i[0].callback && Nn(i[0].callback, !1), !t)
        for (let r = 0, s = i.length; r < s; ++r) {
          const g = i[r];
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
      const i = this.animations_[n];
      let r = !0;
      for (let s = 0, g = i.length; s < g; ++s) {
        const o = i[s];
        if (o.complete)
          continue;
        const a = t - o.start;
        let I = o.duration > 0 ? a / o.duration : 1;
        I >= 1 ? (o.complete = !0, I = 1) : r = !1;
        const c = o.easing(I);
        if (o.sourceCenter) {
          const h = o.sourceCenter[0], m = o.sourceCenter[1], b = o.targetCenter[0], v = o.targetCenter[1];
          this.nextCenter_ = o.targetCenter;
          const T = h + c * (b - h), O = m + c * (v - m);
          this.targetCenter_ = [T, O];
        }
        if (o.sourceResolution && o.targetResolution) {
          const h = c === 1 ? o.targetResolution : o.sourceResolution + c * (o.targetResolution - o.sourceResolution);
          if (o.anchor) {
            const m = this.getViewportSize_(this.getRotation()), b = this.constraints_.resolution(
              h,
              0,
              m,
              !0
            );
            this.targetCenter_ = this.calculateCenterZoom(
              b,
              o.anchor
            );
          }
          this.nextResolution_ = o.targetResolution, this.targetResolution_ = h, this.applyTargetState_(!0);
        }
        if (o.sourceRotation !== void 0 && o.targetRotation !== void 0) {
          const h = c === 1 ? Gi(o.targetRotation + Math.PI, 2 * Math.PI) - Math.PI : o.sourceRotation + c * (o.targetRotation - o.sourceRotation);
          if (o.anchor) {
            const m = this.constraints_.rotation(
              h,
              !0
            );
            this.targetCenter_ = this.calculateCenterRotate(
              m,
              o.anchor
            );
          }
          this.nextRotation_ = o.targetRotation, this.targetRotation_ = h;
        }
        if (this.applyTargetState_(!0), e = !0, !o.complete)
          break;
      }
      if (r) {
        this.animations_[n] = null, this.setHint(Oe.ANIMATING, -1), this.nextCenter_ = null, this.nextResolution_ = NaN, this.nextRotation_ = NaN;
        const s = i[0].callback;
        s && Nn(s, !0);
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
    return i !== void 0 && (n = [i[0] - e[0], i[1] - e[1]], $i(n, t - this.getRotation()), _o(n, e)), n;
  }
  /**
   * @param {number} resolution Target resolution.
   * @param {import("./coordinate.js").Coordinate} anchor Zoom anchor.
   * @return {import("./coordinate.js").Coordinate|undefined} Center for resolution and anchor.
   */
  calculateCenterZoom(t, e) {
    let n;
    const i = this.getCenterInternal(), r = this.getResolution();
    if (i !== void 0 && r !== void 0) {
      const s = e[0] - t * (e[0] - i[0]) / r, g = e[1] - t * (e[1] - i[1]) / r;
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
    return t && Wr(t, this.getProjection());
  }
  /**
   * Get the view center without transforming to user projection.
   * @return {import("./coordinate.js").Coordinate|undefined} The center of the view.
   */
  getCenterInternal() {
    return (
      /** @type {import("./coordinate.js").Coordinate|undefined} */
      this.get(se.CENTER)
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
    return Ma(e, this.getProjection());
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
    const i = (
      /** @type {!number} */
      this.getRotation()
    );
    return Ne(i !== void 0, "The view rotation is not defined"), Go(e, n, i, t);
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
      this.get(se.RESOLUTION)
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
      kn(t, this.getProjection()),
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
    const n = Ki(t) / e[0], i = An(t) / e[1];
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
      (function(r) {
        return e / Math.pow(t, r * i);
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
      this.get(se.ROTATION)
    );
  }
  /**
   * Return a function that returns a resolution for a value between
   * 0 and 1. Exponential scaling is assumed.
   * @param {number} [power] Power.
   * @return {function(number): number} Value for resolution function.
   */
  getValueForResolutionFunction(t) {
    const e = Math.log(t || 2), n = this.getConstrainedResolution(this.maxResolution_), i = this.minResolution_, r = Math.log(n / i) / e;
    return (
      /**
       * @param {number} resolution Resolution.
       * @return {number} Value.
       */
      (function(s) {
        return Math.log(n / s) / e / r;
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
    const r = this.padding_;
    if (r) {
      const s = this.getViewportSizeMinusPadding_();
      i = pi(
        i,
        this.getViewportSize_(),
        [s[0] / 2 + r[3], s[1] / 2 + r[0]],
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
      const r = Us(this.resolutions_, t, 1);
      e = r, n = this.resolutions_[r], r == this.resolutions_.length - 1 ? i = 2 : i = n / this.resolutions_[r + 1];
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
    if (this.resolutions_?.length) {
      if (this.resolutions_.length === 1)
        return this.resolutions_[0];
      const e = oe(
        Math.floor(t),
        0,
        this.resolutions_.length - 2
      ), n = this.resolutions_[e] / this.resolutions_[e + 1];
      return this.resolutions_[e] / Math.pow(n, oe(t - e, 0, 1));
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
    if (Ne(
      Array.isArray(t) || typeof /** @type {?} */
      t.getSimplifiedGeometry == "function",
      "Invalid extent or geometry provided as `geometry`"
    ), Array.isArray(t)) {
      Ne(
        !Ks(t),
        "Cannot fit empty extent provided as `geometry`"
      );
      const i = kn(t, this.getProjection());
      n = _r(i);
    } else if (t.getType() === "Circle") {
      const i = kn(
        t.getExtent(),
        this.getProjection()
      );
      n = _r(i), n.rotate(this.getRotation(), zn(i));
    } else
      n = t;
    this.fitInternal(n, e);
  }
  /**
   * Calculate rotated extent
   * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
   * @return {import("./extent.js").Extent} The rotated extent for the geometry.
   */
  rotatedExtentForGeometry(t) {
    const e = this.getRotation(), n = Math.cos(e), i = Math.sin(-e), r = t.getFlatCoordinates(), s = t.getStride();
    let g = 1 / 0, o = 1 / 0, a = -1 / 0, I = -1 / 0;
    for (let c = 0, h = r.length; c < h; c += s) {
      const m = r[c] * n - r[c + 1] * i, b = r[c] * i + r[c + 1] * n;
      g = Math.min(g, m), o = Math.min(o, b), a = Math.max(a, m), I = Math.max(I, b);
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
    const i = e.padding !== void 0 ? e.padding : [0, 0, 0, 0], r = e.nearest !== void 0 ? e.nearest : !1;
    let s;
    e.minResolution !== void 0 ? s = e.minResolution : e.maxZoom !== void 0 ? s = this.getResolutionForZoom(e.maxZoom) : s = 0;
    const g = this.rotatedExtentForGeometry(t);
    let o = this.getResolutionForExtentInternal(g, [
      n[0] - i[1] - i[3],
      n[1] - i[0] - i[2]
    ]);
    o = isNaN(o) ? s : Math.max(o, s), o = this.getConstrainedResolution(o, r ? 0 : 1);
    const a = this.getRotation(), I = Math.sin(a), c = Math.cos(a), h = zn(g);
    h[0] += (i[1] - i[3]) / 2 * o, h[1] += (i[0] - i[2]) / 2 * o;
    const m = h[0] * c - h[1] * I, b = h[1] * c + h[0] * I, v = this.getConstrainedCenter([m, b], o), T = e.callback ? e.callback : Ni;
    e.duration !== void 0 ? this.animateInternal(
      {
        resolution: o,
        center: v,
        duration: e.duration,
        easing: e.easing
      },
      T
    ) : (this.targetResolution_ = o, this.targetCenter_ = v, this.applyTargetState_(!1, !0), Nn(T, !0));
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
      Be(t, this.getProjection()),
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
      pi(
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
    let r;
    const s = this.padding_;
    if (s && t) {
      const g = this.getViewportSizeMinusPadding_(-n), o = pi(
        t,
        i,
        [g[0] / 2 + s[3], g[1] / 2 + s[0]],
        e,
        n
      );
      r = [
        t[0] - o[0],
        t[1] - o[1]
      ];
    }
    return r;
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
    const e = Wr(this.targetCenter_, this.getProjection());
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
    e = e && Be(e, this.getProjection()), this.adjustResolutionInternal(t, e);
  }
  /**
   * Multiply the view resolution by a ratio, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} ratio The ratio to apply on the view resolution.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  adjustResolutionInternal(t, e) {
    const n = this.getAnimating() || this.getInteracting(), i = this.getViewportSize_(this.getRotation()), r = this.constraints_.resolution(
      this.targetResolution_ * t,
      0,
      i,
      n
    );
    e && (this.targetCenter_ = this.calculateCenterZoom(r, e)), this.targetResolution_ *= t, this.applyTargetState_();
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
    e && (e = Be(e, this.getProjection())), this.adjustRotationInternal(t, e);
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
      t && Be(t, this.getProjection())
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
    ), r = this.getViewportSize_(i), s = this.constraints_.resolution(
      this.targetResolution_,
      0,
      r,
      n
    ), g = this.constraints_.center(
      this.targetCenter_,
      s,
      r,
      n,
      this.calculateCenterShift(
        this.targetCenter_,
        s,
        i,
        r
      )
    );
    this.get(se.ROTATION) !== i && this.set(se.ROTATION, i), this.get(se.RESOLUTION) !== s && (this.set(se.RESOLUTION, s), this.set("zoom", this.getZoom(), !0)), (!g || !this.get(se.CENTER) || !Wn(this.get(se.CENTER), g)) && this.set(se.CENTER, g), this.getAnimating() && !t && this.cancelAnimations(), this.cancelAnchor_ = void 0;
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
    const i = e || 0, r = this.constraints_.rotation(this.targetRotation_), s = this.getViewportSize_(r), g = this.constraints_.resolution(
      this.targetResolution_,
      i,
      s
    ), o = this.constraints_.center(
      this.targetCenter_,
      g,
      s,
      !1,
      this.calculateCenterShift(
        this.targetCenter_,
        g,
        r,
        s
      )
    );
    if (t === 0 && !this.cancelAnchor_) {
      this.targetResolution_ = g, this.targetRotation_ = r, this.targetCenter_ = o, this.applyTargetState_();
      return;
    }
    n = n || (t === 0 ? this.cancelAnchor_ : void 0), this.cancelAnchor_ = void 0, (this.getResolution() !== g || this.getRotation() !== r || !this.getCenterInternal() || !Wn(this.getCenterInternal(), o)) && (this.getAnimating() && this.cancelAnimations(), this.animateInternal({
      rotation: r,
      center: o,
      resolution: g,
      duration: t,
      easing: ri,
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
    n = n && Be(n, this.getProjection()), this.endInteractionInternal(t, e, n);
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
function Nn(A, t) {
  setTimeout(function() {
    A(t);
  }, 0);
}
function oI(A) {
  if (A.extent !== void 0) {
    const e = A.smoothExtentConstraint !== void 0 ? A.smoothExtentConstraint : !0;
    return Kr(A.extent, A.constrainOnlyCenter, e);
  }
  const t = Ar(A.projection, "EPSG:3857");
  if (A.multiWorld !== !0 && t.isGlobal()) {
    const e = t.getExtent().slice();
    return e[0] = -1 / 0, e[2] = 1 / 0, Kr(e, !1, !1);
  }
  return $a;
}
function aI(A) {
  let t, e, n, s = A.minZoom !== void 0 ? A.minZoom : mi, g = A.maxZoom !== void 0 ? A.maxZoom : 28;
  const o = A.zoomFactor !== void 0 ? A.zoomFactor : 2, a = A.multiWorld !== void 0 ? A.multiWorld : !1, I = A.smoothResolutionConstraint !== void 0 ? A.smoothResolutionConstraint : !0, c = A.showFullExtent !== void 0 ? A.showFullExtent : !1, h = Ar(A.projection, "EPSG:3857"), m = h.getExtent();
  let b = A.constrainOnlyCenter, v = A.extent;
  if (!a && !v && h.isGlobal() && (b = !1, v = m), A.resolutions !== void 0) {
    const T = A.resolutions;
    e = T[s], n = T[g] !== void 0 ? T[g] : T[T.length - 1], A.constrainResolution ? t = nI(
      T,
      I,
      !b && v,
      c
    ) : t = Jr(
      e,
      n,
      I,
      !b && v,
      c
    );
  } else {
    const O = (m ? Math.max(Ki(m), An(m)) : (
      // use an extent that can fit the whole world if need be
      360 * Js.degrees / h.getMetersPerUnit()
    )) / gI / Math.pow(2, mi), Z = O / Math.pow(2, 28 - mi);
    e = A.maxResolution, e !== void 0 ? s = 0 : e = O / Math.pow(o, s), n = A.minResolution, n === void 0 && (A.maxZoom !== void 0 ? A.maxResolution !== void 0 ? n = e / Math.pow(o, g) : n = O / Math.pow(o, g) : n = Z), g = s + Math.floor(
      Math.log(e / n) / Math.log(o)
    ), n = e / Math.pow(o, g - s), A.constrainResolution ? t = iI(
      o,
      e,
      n,
      I,
      !b && v,
      c
    ) : t = Jr(
      e,
      n,
      I,
      !b && v,
      c
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
function II(A) {
  if (A.enableRotation !== void 0 ? A.enableRotation : !0) {
    const e = A.constrainRotation;
    return e === void 0 || e === !0 ? sI() : e === !1 ? qr : typeof e == "number" ? rI(e) : qr;
  }
  return Ir;
}
function CI(A) {
  return !(A.sourceCenter && A.targetCenter && !Wn(A.sourceCenter, A.targetCenter) || A.sourceResolution !== A.targetResolution || A.sourceRotation !== A.targetRotation);
}
function pi(A, t, e, n, i) {
  const r = Math.cos(-i);
  let s = Math.sin(-i), g = A[0] * r - A[1] * s, o = A[1] * r + A[0] * s;
  g += (t[0] / 2 - e[0]) * n, o += (e[1] - t[1] / 2) * n, s = -s;
  const a = g * r - o * s, I = o * r + g * s;
  return [a, I];
}
const cI = {
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
class lI extends OA {
  /**
   * @param {Options<NoInfer<Properties>>} options Layer options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, this.background_ = t.background;
    const e = Object.assign({}, t);
    typeof t.properties == "object" && (delete e.properties, Object.assign(e, t.properties)), e[It.OPACITY] = t.opacity !== void 0 ? t.opacity : 1, Ne(
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
    return e.opacity = oe(Math.round(this.getOpacity() * 100) / 100, 0, 1), e.visible = this.getVisible(), e.extent = this.getExtent(), e.zIndex = n === void 0 && !e.managed ? 1 / 0 : n, e.maxResolution = this.getMaxResolution(), e.minResolution = Math.max(this.getMinResolution(), 0), e.minZoom = this.getMinZoom(), e.maxZoom = this.getMaxZoom(), this.state_ = e, e;
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").default>} [array] Array of layers (to be
   *     modified in place).
   * @return {Array<import("./Layer.js").default>} Array of layers.
   */
  getLayersArray(t) {
    return Ht();
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").State>} [states] Optional list of layer
   *     states (to be modified in place).
   * @return {Array<import("./Layer.js").State>} List of layer states.
   */
  getLayerStatesArray(t) {
    return Ht();
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
    return Ht();
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
    Ne(typeof t == "number", "Layer opacity must be a number"), this.set(It.OPACITY, t);
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
class Cg extends lI {
  /**
   * @param {Options<SourceType, NoInfer<Properties>>} options Layer options.
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
    this.sourceChangeKey_ && (MA(this.sourceChangeKey_), this.sourceChangeKey_ = null), this.sourceReady_ = !1;
    const t = this.getSource();
    t && (this.sourceChangeKey_ = je(
      t,
      Ze.CHANGE,
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
    !t && n && (t = n.getView()), t instanceof $r ? e = {
      viewState: t.getState(),
      extent: t.calculateExtent()
    } : e = t, !e.layerStatesArray && n && (e.layerStatesArray = n.getLayerGroup().getLayerStatesArray());
    let i;
    if (e.layerStatesArray) {
      if (i = e.layerStatesArray.find(
        (s) => s.layer === this
      ), !i)
        return !1;
    } else
      i = this.getLayerState();
    const r = this.getExtent();
    return hI(i, e.viewState) && (!r || Ji(r, e.extent));
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
    const n = t instanceof $r ? t.getViewStateAndExtent() : t;
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
    this.mapPrecomposeKey_ && (MA(this.mapPrecomposeKey_), this.mapPrecomposeKey_ = null), t || this.changed(), this.mapRenderKey_ && (MA(this.mapRenderKey_), this.mapRenderKey_ = null), t && (this.mapPrecomposeKey_ = je(
      t,
      cI.PRECOMPOSE,
      this.handlePrecompose_,
      this
    ), this.mapRenderKey_ = je(this, Ze.CHANGE, t.render, t), this.changed());
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
    Ne(
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
function hI(A, t) {
  if (!A.visible)
    return !1;
  const e = t.resolution;
  if (e < A.minResolution || e >= A.maxResolution)
    return !1;
  const n = t.zoom;
  return n > A.minZoom && n <= A.maxZoom;
}
class uI extends Cg {
  constructor(t) {
    let e;
    const n = function(i) {
      const r = this.getSource(), s = r.mapboxMap;
      if (!s)
        return console.error("MapboxLayer: mapboxMap is undefined!"), null;
      r.style !== e && (s.setStyle(r.style), e = r.style);
      const g = s.getCanvas(), o = i.viewState, a = this.getVisible();
      g.style.display = a ? "block" : "none";
      const I = this.getOpacity();
      g.style.opacity = I;
      const c = o.rotation * -180 / Math.PI, h = Yi(o.center), m = o.zoom - 1, b = s.getBearing(), v = s.getCenter().toArray(), T = s.getZoom();
      return c == b && h[0] == v[0] && h[1] == v[1] && m == T || (c != b && s.rotateTo(c, {
        animate: !1
      }), (h[0] != v[0] || h[1] != v[1] || m != T) && s.jumpTo({
        center: h,
        zoom: m,
        animate: !1
      }), s._frame && (s._frame.cancel(), s._frame = null), s._render()), g;
    };
    super({
      render: n,
      source: t.source
    });
  }
}
class fI extends Cg {
  constructor(t) {
    let e;
    const n = function(i) {
      const r = this.getSource(), s = r.maplibreMap;
      if (!s)
        return console.error("MapLibreLayer: maplibreMap is undefined!"), null;
      r.style !== e && (s.setStyle(r.style), e = r.style);
      const g = s.getCanvas(), o = i.viewState, a = this.getVisible();
      g.style.display = a ? "block" : "none";
      const I = this.getOpacity();
      g.style.opacity = I;
      const h = -o.rotation * 180 / Math.PI, m = s.getBearing();
      Math.abs(h - m) > 0.01 && (s.stop(), s.setBearing(h));
      const b = Yi(o.center), v = o.zoom - 1;
      if ((s.getCenter().toArray().toString() !== b.toString() || s.getZoom() !== v) && s.jumpTo({
        center: b,
        zoom: v,
        animate: !1
      }), s._frame && (s._frame.cancel(), s._frame = null), i.size) {
        const [T, O] = i.size;
        (g.width !== T || g.height !== O) && s.resize();
      }
      return s._render(), Math.abs(s.getZoom() - v) > 0.01 && s.setZoom(v), g.style.position = "absolute", g.style.left = "0", g.style.top = "0", g;
    };
    super({
      render: n,
      source: t.source
    });
  }
}
const cg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAxMS0xMC0yNlQyMTo1MjoxOFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAxMS0xMC0yN1QxNzo0MjowN1o8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgkVIwmwAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTM5jWRgMAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTAvMjYvMTHjwOqVAAARQHByVld4nMWbB3wURdvAd6/u3V6/27sts/PMQQhFpEU6SlNBRXqTfgkkQOhFSigHIgIWkJqAIJ1QBCz0KkJoQYrSQaQjioBKC+XezWU5fH2/3+/L8fu+fWd3bubZKf95nnlmdjeX2/dk602qD9UnooRc5YjkKp9KyIrkZikfkazcSFaWcuZmpUZScyOpWcqZm6rkU3OTIpGk3EhSViQpVTlzk5IiSUm5VCRC5UaorAiVqpy5VFKESspND6UY03O6U0oYGHo3NCg0ODSj59BQRmhYaHhoaDofFsJiGIVfC78e/hnOwwW4CI1Ttve/AlehLClH6oTrhl8N1wu3CIcFKhqWiwVpWvrG9EcjmXC2nC/1Sd+dHgonh1PCpxQ5nN4pfHHk3qGzOlFUepiiPk5PC/cO9wn3DfcL59deGOqWXC95Saigp/fCY8Lvh0e9Xm94q3DBlXLd2qm5kmRpSrdw9/CEqNwneWQ4HH6hXul6FHVs5Gfh2eGbI6eFp0fLxoZqhE/KC6P5Oa9lhzN7ymofy5PN4anhCRlfFpSVXxNeG26UQf0jyBSO5R1UcjTdF/3c8o+a66j11AbqhCrtpvZQe6lzqnSRukRdjtU8Q52lfqJuqNJt6g/qTzW/ltpKbaO2U99SO9QrF6j71AMqL9b2OvUr9VtMYmgLbaU9dIHkpwM0r+YdtJN20W76ytOa/zZWjpZpTANdNlr7NJVEv0RXpCtFpR+panR1ugZdPCodoGrTdei69MNou3p0ffoN+k36aT+rqcZqfheVQzWiW9HUP0Kn6BVEJ9DF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zV6+JT3q/K+UUkoppZ5Tl9rnzXTvZS/51pTrIJewYX0bzb5r+vfUX7X2ebU/rDnUmslszXqN0v99bSO/80ff/EtrIayb9PNrKMs56kf84zG7v5Te6HqW1yytUb8m7mzNaVbmv4r9stz7I1/WPPKc9sIzuc6ebST3XjlnDZd7OSawd7MmvNs6y5nriXWP9WbWmvq6UoX3Ota9TCttV8f0GZBXXqMep8R6JfdJl73upTKfo+6XbG+j/s9aG7ZmP75rNPZXvNzHLegjrPOtCT9WL+yXY17/tyH3IRB7GXXMtcq0VabZ8xrZt/8TQZzR/ZH/R2U+R33+P8X/GX/2/pB24py9GY74M//JWBN+ar36nJd7Avh6VKf0QbdPXs/yyrDRPhP3sz9znXmPynyutvB/30cpn1CmPC8x1jF+MpbRnteGn1Ivwhg3+I8AG9O+EHNt938fc3KP8pj/+X8i8yj1+93/szKfq2P+z7kdO/R+knUt9fEpfYO/iMs8tlX4MbtnGLbk/TrnYcZw4mLntDV7nfgz9yiPlYN/a/EhbSdtyp7ZyP+jMp/zLsh+W9YpfUffzrpij9FYRdxMr+fX/dn7wZpwwpbqlWHUg7mk+zfn8tE3GM/350Z59TDaQN+LTBsTP/Oelbn3tUtoab1APb70v1JKKaWUUkoppZRSSl1NOxERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERGRO+Qfh5eOajemXSYAAAFTbWtCVPrOyv4Af1WJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4nO3W4WmDYBSGUQdxEQdxEBdxEAdxEQexvIELt6Yh/4oJ54FDm0/7601szlOSJEmSJEmSJEmSJEmSJEmSJEkf0XEc577vT+c5y7V397+6T/dvXddzHMdzmqbHz+wY/Sz31L11FsuyPF7HMAx/vod077JjlX2zYXatzfs9tX/VN7/+je5ftut7Vjnrn+V6nX37xtm/ul7T/ctzvu9f/9fneX7aP9fs/31l23ru1+/btv36zPfnv/2/r/oe1/er90Cu1Xf7nEXVnx3Xa5IkSZIkSZIk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b24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+zWqGFQAACShJREFUWIWVmGusXFUVx39r73POzJy5M3fmPtrblj7p7btYGigGmojExISHQQ0miDFA4lc0SCBRNH4gRhNJ/aIfNAIxUkKIkMgjBBKMCHwQEGKhpbS39HXfve+5M3fmnr23H84+M7e1PDyTlbPPnDl7//da//Vf64zwBQ9jjCilAiDyFgIaUP4nFjDAMtACWtbaRGvtPmte59Lb8gUW137hGCgDFaDkrzMwrABRBxaAWWDeX7esteZyoD4XSJIkorXO+cV7gQFg9fMvLdz74bHm+hOnTP/QsOmeaxBYoJTDbF2n5wa36At7d+XOfOOW0uPAmLcpYN4Y0wyC4LIeuiwQ55wC8kA/sHF62tz5+F/mDz7zytKOTxpBMKsCEq1BCWjBiQAOcRAYQylpcWW0bG6/Kf/Rvd/rfmP1Kn0YOANMAksiYj8XiAcRew9se/ZvtR8/+seFr3xQj3QtDHGhQCCIFtAqDYxI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", lg = "data:image/png;base64,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", hg = "data:image/png;base64,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", Cr = "data:image/png;base64,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", dI = new ue({
  image: new xA({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: cg
  })
}), mI = new ue({
  image: new xA({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: lg
  })
}), pI = new ue({
  image: new xA({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: hg
  })
}), yI = new ue({
  fill: new Oi({
    color: [128, 128, 256, 0.2]
  }),
  stroke: new Bi({
    color: [128, 128, 256, 1],
    width: 3
  })
}), wI = new ue({
  image: new xA({
    anchor: [0.5, 1],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: Cr
  })
});
class Ge extends Zg {
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
    t = fe(t || {});
    const e = new Sn({
      source: new Pn({
        wrapX: !1
      })
    });
    e.set("name", "gps");
    const n = new Sn({
      source: new Pn({
        wrapX: !1
      })
    });
    n.set("name", "marker");
    const i = new Sn({
      source: new Pn({
        wrapX: !1
      })
    });
    i.set("name", "feature");
    const r = new Sn({
      source: new Pn({
        wrapX: !1
      })
    });
    r.set("name", "envelope");
    const s = Ge.spawnLayer(
      null,
      t.source,
      t.target
    ), g = new Ug();
    g.set("name", "overlay");
    const a = {
      controls: t.controls ? t.controls : [],
      layers: [
        s,
        g,
        r,
        i,
        e,
        n
      ],
      target: t.div,
      view: new Ts({
        center: t.defaultCenter || [0, 0],
        zoom: t.defaultZoom || 2,
        rotation: t.defaultRotation || 0,
        multiWorld: !0
      })
    };
    t.interactions && (a.interactions = t.interactions), super(a), this.fakeGps = t.fakeGps, this.fakeRadius = t.fakeRadius, this.homePosition = t.homePosition, this.northUp = t.northUp, this.tapDuration = t.tapDuration, this.homeMarginPixels = t.homeMarginPixels, this.tapUIVanish = t.tapUIVanish, this.alwaysGpsOn = t.alwaysGpsOn || !1;
    const I = this.getView();
    this.__ignore_first_move = !0;
    const c = () => {
      this.__ignore_first_move || this.dispatchEvent("movestart"), this.__ignore_first_move = !1, I.un("propertychange", c);
    };
    I.on("propertychange", c), this.on("moveend", () => {
      I.on("propertychange", c);
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
    return e instanceof Vn || e instanceof _n || !(t instanceof hi) ? (e instanceof Vn ? t = new uI({
      style: e.style,
      accessToken: e.accessToken,
      container: n,
      source: e
    }) : e instanceof _n ? t = new fI({
      style: e.style,
      container: n,
      source: e
    }) : (t = new hi({
      source: e
    }), Ge.applyWmtsZoomGate(t, e)), t.set("name", "base")) : (t.setSource(e), Ge.applyWmtsZoomGate(t, e)), t;
  }
  getLayer(t = "base") {
    const e = (n) => {
      const i = n.getArray().map((r) => {
        if (r.get("name") == t) return r;
        if (r.getLayers) return e(r.getLayers());
      }).filter((r) => r);
      if (i.length != 0)
        return i[0];
    };
    return e(this.getLayers());
  }
  getSource(t = "base") {
    const e = this.getLayer(t);
    if (e)
      return e.getSource();
  }
  setFeature(t, e, n) {
    const i = this.getSource(n), r = new Fg(t);
    return e && r.setStyle(e), i.addFeature(r), r;
  }
  removeFeature(t, e) {
    this.getSource(e).removeFeature(t);
  }
  resetFeature(t) {
    this.getSource(t).clear();
  }
  setGPSPosition(t, e = void 0) {
    const n = e == "sub" ? pI : e == "hide" ? mI : dI;
    e != "sub" && this.resetFeature("gps"), t && (this.setFeature(
      {
        geometry: new on(t.xy)
      },
      n,
      "gps"
    ), e || this.setFeature(
      {
        geometry: new ir(t.xy, t.rad)
      },
      yI,
      "gps"
    ));
  }
  setMarker(t, e, n, i) {
    return i || (i = "marker"), e.geometry = new on(t), n ? typeof n == "string" ? n = new ue({
      image: new xA({
        anchor: [0.5, 1],
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: n
      })
    }) : n instanceof ue || (n = new ue({
      image: new xA(n)
    })) : n = wI, this.setFeature(e, n, i);
  }
  resetMarker(t) {
    t || (t = "marker"), this.resetFeature(t);
  }
  setLine(t, e, n) {
    return this.setVector(t, "Line", e ? { stroke: e } : null, n);
  }
  setVector(t, e = "Line", n, i) {
    i || (i = "feature");
    const r = {};
    n.stroke != null && (r.stroke = new Bi(n.stroke)), n.fill != null && (r.fill = new Oi(n.fill));
    const s = new ue(r), g = e === "Line" ? new Yn(t) : new eA(t);
    return this.setFeature(
      {
        geometry: g,
        name: e
      },
      s,
      i
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
  setFillEnvelope(t, e, n, i) {
    i || (i = "envelope");
    let r;
    if (e != null || n != null) {
      const s = {};
      e != null && (s.stroke = new Bi(e)), n != null && (s.fill = new Oi(n)), r = new ue(s);
    }
    return this.setFeature(
      {
        geometry: new eA([t])
      },
      r,
      i
    );
  }
  exchangeSource(t = void 0) {
    const e = this.getLayers(), n = e.item(0), i = Ge.spawnLayer(n, t, this.getTarget());
    i != n && e.setAt(0, i), t && t.setMap(this);
  }
  setLayer(t = void 0) {
    const e = this.getLayer("overlay").getLayers();
    if (e.clear(), t) {
      const n = new hi({
        source: t
      });
      Ge.applyWmtsZoomGate(n, t), e.push(n);
    }
  }
  setTransparency(t) {
    const e = (100 - t) / 100, n = this.getSource();
    n instanceof BA || n instanceof Ui ? (this.getLayers().item(0).setOpacity(1), this.getLayers().item(1).setOpacity(e)) : this.getLayers().item(0).setOpacity(e);
  }
  setGPSMarker(t, e) {
    this.getLayers().item(0).getSource().setGPSMarker(t, e);
  }
}
const _A = {
  /**
   * A true double click, with no dragging.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#dblclick
   * @api
   */
  DBLCLICK: Ze.DBLCLICK,
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
}, ts = {
  ACTIVE: "active"
};
class cn extends OA {
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
      this.get(ts.ACTIVE)
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
    this.set(ts.ACTIVE, t);
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
function bI(A, t, e) {
  const n = A.getCenterInternal();
  if (n) {
    const i = [n[0] + t[0], n[1] + t[1]];
    A.animateInternal({
      duration: e !== void 0 ? e : 250,
      easing: AI,
      center: A.getConstrainedCenter(i)
    });
  }
}
function cr(A, t, e, n) {
  const i = A.getZoom();
  if (i === void 0)
    return;
  const r = A.getConstrainedZoom(i + t), s = A.getResolutionForZoom(r);
  A.getAnimating() && A.cancelAnimations(), A.animate({
    resolution: s,
    anchor: e,
    duration: n !== void 0 ? n : 250,
    easing: ri
  });
}
const Gn = {
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
}, es = {
  LENGTH: "length"
};
class Xn extends Re {
  /**
   * @param {import("./CollectionEventType.js").default} type Type.
   * @param {T} element Element.
   * @param {number} index The index of the added or removed element.
   */
  constructor(t, e, n) {
    super(t), this.element = e, this.index = n;
  }
}
class EI extends OA {
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
    return this.get(es.LENGTH);
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
      new Xn(Gn.ADD, e, t)
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
      new Xn(Gn.REMOVE, e, t)
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
      new Xn(Gn.REMOVE, i, t)
    ), this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new Xn(Gn.ADD, e, t)
    );
  }
  /**
   * @private
   */
  updateLength_() {
    this.set(es.LENGTH, this.array_.length);
  }
  /**
   * @private
   * @param {T} elem Element.
   * @param {number} [except] Optional index to ignore.
   */
  assertUnique_(t, e) {
    const n = this.array_;
    for (let i = 0, r = n.length; i < r; ++i)
      if (n[i] === t && i !== e)
        throw new Error("Duplicate item added to a unique collection");
  }
}
class vI {
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
    const r = this.points_[e] - this.points_[n], s = this.points_[e + 1] - this.points_[n + 1];
    return this.angle_ = Math.atan2(s, r), this.initialVelocity_ = Math.sqrt(r * r + s * s) / i, this.initialVelocity_ > this.minVelocity_;
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
class MI extends cn {
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
    if (t.type == _A.DBLCLICK) {
      const n = (
        /** @type {MouseEvent} */
        t.originalEvent
      ), i = t.map, r = t.coordinate, s = n.shiftKey ? -this.delta_ : this.delta_, g = i.getView();
      cr(g, s, r, this.duration_), n.preventDefault(), e = !0;
    }
    return !e;
  }
}
const AA = typeof navigator < "u" && typeof navigator.userAgent < "u" ? navigator.userAgent.toLowerCase() : "", RI = AA.includes("safari") && !AA.includes("chrom");
RI && (AA.includes("version/15.4") || /cpu (os|iphone os) 15_4 like mac os x/.test(AA));
const TI = AA.includes("webkit") && !AA.includes("edge"), ug = AA.includes("macintosh");
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
function zi(A) {
  const t = arguments;
  return function(e) {
    let n = !0;
    for (let i = 0, r = t.length; i < r && (n = n && t[i](e), !!n); ++i)
      ;
    return n;
  };
}
const SI = function(A) {
  const t = A.originalEvent;
  return t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, PI = function(A) {
  const t = A.originalEvent;
  return t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, xI = function(A) {
  const t = A.map.getTargetElement(), e = t.getRootNode(), n = A.map.getOwnerDocument().activeElement;
  return e instanceof ShadowRoot ? e.host.contains(n) : t.contains(n);
}, fg = function(A) {
  const t = A.map.getTargetElement(), e = t.getRootNode();
  return (e instanceof ShadowRoot ? e.host : t).hasAttribute("tabindex") ? xI(A) : !0;
}, DI = So, dg = function(A) {
  const t = A.originalEvent;
  return "pointerId" in t && t.button == 0 && !(TI && ug && t.ctrlKey);
}, mg = function(A) {
  const t = (
    /** @type {KeyboardEvent|MouseEvent|TouchEvent} */
    A.originalEvent
  );
  return !t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, BI = function(A) {
  const t = A.originalEvent;
  return ug ? t.metaKey : t.ctrlKey;
}, pg = function(A) {
  const t = A.originalEvent;
  return !t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, yg = function(A) {
  const t = A.originalEvent, e = (
    /** @type {Element} */
    t.target.tagName
  );
  return e !== "INPUT" && e !== "SELECT" && e !== "TEXTAREA" && // `isContentEditable` is only available on `HTMLElement`, but it may also be a
  // different type like `SVGElement`.
  // @ts-ignore
  !t.target.isContentEditable;
}, PA = function(A) {
  const t = A.originalEvent;
  return "pointerId" in t && t.pointerType == "mouse";
}, OI = function(A) {
  const t = A.originalEvent;
  return "pointerId" in t && t.isPrimary && t.button === 0;
};
class LA extends cn {
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
      if (t.type == _A.POINTERDRAG)
        this.handleDragEvent(t), t.originalEvent.preventDefault();
      else if (t.type == _A.POINTERUP) {
        const n = this.handleUpEvent(t);
        this.handlingDownUpSequence = n && this.targetPointers.length > 0;
      }
    } else if (t.type == _A.POINTERDOWN) {
      const n = this.handleDownEvent(t);
      this.handlingDownUpSequence = n, e = this.stopDown(n);
    } else t.type == _A.POINTERMOVE && this.handleMoveEvent(t);
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
function lr(A) {
  const t = A.length;
  let e = 0, n = 0;
  for (let i = 0; i < t; i++)
    e += A[i].clientX, n += A[i].clientY;
  return { clientX: e / t, clientY: n / t };
}
class LI extends LA {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super({
      stopDown: $n
    }), t = t || {}, this.kinetic_ = t.kinetic, this.lastCentroid = null, this.lastPointersCount_, this.panning_ = !1;
    const e = t.condition ? t.condition : zi(mg, OI);
    this.condition_ = t.onFocusOnly ? zi(fg, e) : e, this.noKinetic_ = !1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    const e = t.map;
    this.panning_ || (this.panning_ = !0, e.getView().beginInteraction());
    const n = this.targetPointers, i = e.getEventPixel(lr(n));
    if (n.length == this.lastPointersCount_) {
      if (this.kinetic_ && this.kinetic_.update(i[0], i[1]), this.lastCentroid) {
        const r = [
          this.lastCentroid[0] - i[0],
          i[1] - this.lastCentroid[1]
        ], g = t.map.getView();
        Ko(r, g.getResolution()), $i(r, g.getRotation()), g.adjustCenterInternal(r);
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
        const i = this.kinetic_.getDistance(), r = this.kinetic_.getAngle(), s = n.getCenterInternal(), g = e.getPixelFromCoordinateInternal(s), o = e.getCoordinateFromPixelInternal([
          g[0] - i * Math.cos(r),
          g[1] - i * Math.sin(r)
        ]);
        n.animateInternal({
          center: n.getConstrainedCenter(o),
          duration: 500,
          easing: ri
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
class kI extends LA {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super({
      stopDown: $n
    }), this.condition_ = t.condition ? t.condition : PI, this.lastAngle_ = void 0, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    if (!PA(t))
      return;
    const e = t.map, n = e.getView();
    if (n.getConstraints().rotation === Ir)
      return;
    const i = e.getSize(), r = t.pixel, s = Math.atan2(i[1] / 2 - r[1], r[0] - i[0] / 2);
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
    return PA(t) ? (t.map.getView().endInteraction(this.duration_), !1) : !0;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    return PA(t) && dg(t) && this.condition_(t) ? (t.map.getView().beginInteraction(), this.lastAngle_ = void 0, !0) : !1;
  }
}
class NI extends Zs {
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
    i[4] = i[0].slice(), this.geometry_ ? this.geometry_.setCoordinates([i]) : this.geometry_ = new eA([i]);
  }
  /**
   * @return {import("../geom/Polygon.js").default} Geometry.
   */
  getGeometry() {
    return this.geometry_;
  }
}
const mA = {
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
class zA extends Re {
  /**
   * @param {string} type The event type.
   * @param {import("../coordinate.js").Coordinate} coordinate The event coordinate.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Originating event.
   */
  constructor(t, e, n) {
    super(t), this.coordinate = e, this.mapBrowserEvent = n;
  }
}
class GI extends LA {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = t ?? {}, this.box_ = new NI(t.className || "ol-dragbox"), this.minArea_ = t.minArea ?? 64, t.onBoxEnd && (this.onBoxEnd = t.onBoxEnd), this.startPixel_ = null, this.condition_ = t.condition ?? dg, this.boxEndCondition_ = t.boxEndCondition ?? this.defaultBoxEndCondition;
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
    const i = n[0] - e[0], r = n[1] - e[1];
    return i * i + r * r >= this.minArea_;
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
      new zA(
        mA.BOXDRAG,
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
      new zA(
        e ? mA.BOXEND : mA.BOXCANCEL,
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
      new zA(
        mA.BOXSTART,
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
      new zA(mA.BOXCANCEL, this.startPixel_, null)
    ), this.startPixel_ = null)), super.setActive(t);
  }
  /**
   * @param {import("../Map.js").default|null} map Map.
   * @override
   */
  setMap(t) {
    this.getMap() && (this.box_.setMap(null), this.startPixel_ && (this.dispatchEvent(
      new zA(mA.BOXCANCEL, this.startPixel_, null)
    ), this.startPixel_ = null)), super.setMap(t);
  }
}
class XI extends GI {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = t.condition ? t.condition : pg;
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
      const r = n.rotatedExtentForGeometry(i), s = n.getResolutionForExtentInternal(r), g = n.getResolution() / s;
      i = i.clone(), i.scale(g * g);
    }
    n.fitInternal(i, {
      duration: this.duration_,
      easing: ri
    });
  }
}
const _e = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown"
};
class jI extends cn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.defaultCondition_ = function(e) {
      return mg(e) && yg(e);
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
    if (t.type == Ze.KEYDOWN) {
      const n = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), i = n.key;
      if (this.condition_(t) && (i == _e.DOWN || i == _e.LEFT || i == _e.RIGHT || i == _e.UP)) {
        const s = t.map.getView(), g = s.getResolution() * this.pixelDelta_;
        let o = 0, a = 0;
        i == _e.DOWN ? a = -g : i == _e.LEFT ? o = -g : i == _e.RIGHT ? o = g : a = g;
        const I = [o, a];
        $i(I, s.getRotation()), bI(s, I, this.duration_), n.preventDefault(), e = !0;
      }
    }
    return !e;
  }
}
class ZI extends cn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.condition_ = t.condition ? t.condition : function(e) {
      return !BI(e) && yg(e);
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
    if (t.type == Ze.KEYDOWN || t.type == Ze.KEYPRESS) {
      const n = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), i = n.key;
      if (this.condition_(t) && (i === "+" || i === "-")) {
        const r = t.map, s = i === "+" ? this.delta_ : -this.delta_, g = r.getView();
        cr(g, s, void 0, this.duration_), n.preventDefault(), e = !0;
      }
    }
    return !e;
  }
}
const FI = 40, UI = 300, zI = 3;
class WI extends cn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Interaction.js").InteractionOptions} */
      t
    ), this.totalDelta_ = 0, this.lastDelta_ = 0, this.maxDelta_ = t.maxDelta !== void 0 ? t.maxDelta : 1, this.duration_ = t.duration !== void 0 ? t.duration : 250, this.timeout_ = t.timeout !== void 0 ? t.timeout : 80, this.useAnchor_ = t.useAnchor !== void 0 ? t.useAnchor : !0, this.constrainResolution_ = t.constrainResolution !== void 0 ? t.constrainResolution : !1;
    const e = t.condition ? t.condition : DI;
    this.condition_ = t.onFocusOnly ? zi(fg, e) : e, this.lastAnchor_ = null, this.startTime_ = void 0, this.timeoutId_, this.mode_ = void 0, this.trackpadEventGap_ = 400, this.trackpadTimeoutId_, this.deltaPerZoom_ = 300, this.ctrlKeyPressed_ = !1, this.ctrlKeyListenerKeys_ = [];
  }
  /**
   * @param {import('../Map.js').default|null} map Map.
   * @override
   */
  setMap(t) {
    if (this.ctrlKeyListenerKeys_.forEach(MA), this.ctrlKeyListenerKeys_.length = 0, this.ctrlKeyPressed_ = !1, super.setMap(t), t) {
      const e = t.getOwnerDocument();
      this.ctrlKeyListenerKeys_.push(
        je(e, "keydown", (n) => {
          n.key === "Control" && (this.ctrlKeyPressed_ = !0);
        }),
        je(e, "keyup", (n) => {
          n.key === "Control" && (this.ctrlKeyPressed_ = !1);
        })
      );
    }
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
    if (!this.condition_(t) || t.type !== Ze.WHEEL)
      return !0;
    const n = t.map, i = (
      /** @type {WheelEvent} */
      t.originalEvent
    );
    i.preventDefault();
    const r = i.ctrlKey && !this.ctrlKeyPressed_;
    i.ctrlKey || (this.ctrlKeyPressed_ = !1), this.useAnchor_ && (this.lastAnchor_ = t.pixel);
    let s = i.deltaY;
    switch (i.deltaMode) {
      case WheelEvent.DOM_DELTA_LINE:
        s *= FI;
        break;
      case WheelEvent.DOM_DELTA_PAGE:
        s *= UI;
        break;
    }
    if (s === 0)
      return !1;
    this.lastDelta_ = s;
    const g = Date.now();
    this.startTime_ === void 0 && (this.startTime_ = g), (!this.mode_ || g - this.startTime_ > this.trackpadEventGap_) && (this.mode_ = Math.abs(s) < 4 ? "trackpad" : "wheel");
    const o = n.getView();
    if (this.mode_ === "trackpad")
      return this.trackpadTimeoutId_ ? clearTimeout(this.trackpadTimeoutId_) : (o.getAnimating() && o.cancelAnimations(), o.beginInteraction()), this.trackpadTimeoutId_ = setTimeout(
        this.endInteraction_.bind(this),
        this.timeout_
      ), r && (s = s * zI), o.adjustZoom(
        -s / this.deltaPerZoom_,
        this.lastAnchor_ ? n.getCoordinateFromPixel(this.lastAnchor_) : null
      ), this.startTime_ = g, !1;
    this.totalDelta_ += s;
    const a = Math.max(this.timeout_ - (g - this.startTime_), 0);
    return clearTimeout(this.timeoutId_), this.timeoutId_ = setTimeout(
      this.handleWheelZoom_.bind(this, n),
      a
    ), !1;
  }
  /**
   * @private
   * @param {import("../Map.js").default} map Map.
   */
  handleWheelZoom_(t) {
    const e = t.getView();
    e.getAnimating() && e.cancelAnimations();
    let n = -oe(
      this.totalDelta_,
      -this.maxDelta_ * this.deltaPerZoom_,
      this.maxDelta_ * this.deltaPerZoom_
    ) / this.deltaPerZoom_;
    (e.getConstrainResolution() || this.constrainResolution_) && (n = n ? n > 0 ? 1 : -1 : 0), cr(
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
class HI extends LA {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = $n), super(e), this.anchor_ = null, this.lastAngle_ = void 0, this.rotating_ = !1, this.rotationDelta_ = 0, this.threshold_ = t.threshold !== void 0 ? t.threshold : 0.3, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    let e = 0;
    const n = this.targetPointers[0], i = this.targetPointers[1], r = Math.atan2(
      i.clientY - n.clientY,
      i.clientX - n.clientX
    );
    if (this.lastAngle_ !== void 0) {
      const o = r - this.lastAngle_;
      this.rotationDelta_ += o, !this.rotating_ && Math.abs(this.rotationDelta_) > this.threshold_ && (this.rotating_ = !0), e = o;
    }
    this.lastAngle_ = r;
    const s = t.map, g = s.getView();
    g.getConstraints().rotation !== Ir && (this.anchor_ = s.getCoordinateFromPixelInternal(
      s.getEventPixel(lr(this.targetPointers))
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
class QI extends LA {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = $n), super(e), this.anchor_ = null, this.duration_ = t.duration !== void 0 ? t.duration : 400, this.lastDistance_ = void 0, this.lastScaleDelta_ = 1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    let e = 1;
    const n = this.targetPointers[0], i = this.targetPointers[1], r = n.clientX - i.clientX, s = n.clientY - i.clientY, g = Math.sqrt(r * r + s * s);
    this.lastDistance_ !== void 0 && (e = this.lastDistance_ / g), this.lastDistance_ = g;
    const o = t.map, a = o.getView();
    e != 1 && (this.lastScaleDelta_ = e), this.anchor_ = o.getCoordinateFromPixelInternal(
      o.getEventPixel(lr(this.targetPointers))
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
function As(A) {
  A = A || {};
  const t = new EI(), e = new vI(-5e-3, 0.05, 100);
  return (A.altShiftDragRotate === void 0 || A.altShiftDragRotate) && t.push(new kI()), (A.doubleClickZoom === void 0 || A.doubleClickZoom) && t.push(
    new MI({
      delta: A.zoomDelta,
      duration: A.zoomDuration
    })
  ), (A.dragPan === void 0 || A.dragPan) && t.push(
    new LI({
      onFocusOnly: A.onFocusOnly,
      kinetic: e
    })
  ), (A.pinchRotate === void 0 || A.pinchRotate) && t.push(new HI()), (A.pinchZoom === void 0 || A.pinchZoom) && t.push(
    new QI({
      duration: A.zoomDuration
    })
  ), (A.keyboard === void 0 || A.keyboard) && (t.push(new jI()), t.push(
    new ZI({
      delta: A.zoomDelta,
      duration: A.zoomDuration
    })
  )), (A.mouseWheelZoom === void 0 || A.mouseWheelZoom) && t.push(
    new WI({
      onFocusOnly: A.onFocusOnly,
      duration: A.zoomDuration
    })
  ), (A.shiftDragZoom === void 0 || A.shiftDragZoom) && t.push(
    new XI({
      duration: A.zoomDuration
    })
  ), t;
}
class YI extends LA {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Pointer.js").Options} */
      t
    ), this.condition_ = t.condition ? t.condition : pg, this.lastAngle_ = void 0, this.lastMagnitude_ = void 0, this.lastScaleDelta_ = 0, this.duration_ = t.duration !== void 0 ? t.duration : 400;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    if (!PA(t))
      return;
    const e = t.map, n = e.getSize(), i = t.pixel, r = i[0] - n[0] / 2, s = n[1] / 2 - i[1], g = Math.atan2(s, r), o = Math.sqrt(r * r + s * s), a = e.getView();
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
    if (!PA(t))
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
    return PA(t) && this.condition_(t) ? (t.map.getView().beginInteraction(), this.lastAngle_ = void 0, this.lastMagnitude_ = void 0, !0) : !1;
  }
}
function VI(A) {
  return _I(A[0], A[1], A[2]);
}
function _I(A, t, e) {
  return (t << A) + e;
}
const KI = /\{z\}/g, JI = /\{x\}/g, qI = /\{y\}/g, $I = /\{-y\}/g;
function tC(A, t, e, n, i) {
  return A.replace(KI, t.toString()).replace(JI, e.toString()).replace(qI, n.toString()).replace($I, function() {
    throw new Error(
      "If the URL template has a {-y} placeholder, the grid extent must be known"
    );
  });
}
function eC(A, t) {
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
      const r = e[0];
      return tC(A, r, e[1], e[2]);
    })
  );
}
function ns(A, t) {
  const e = A.length, n = new Array(e);
  for (let i = 0; i < e; ++i)
    n[i] = eC(A[i]);
  return AC(n);
}
function AC(A) {
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
      const i = VI(t), r = Gi(i, A.length);
      return A[r](t, e, n);
    })
  );
}
for (let A = 0; A < 9; A++) {
  const t = `ZOOM:${A}`, e = 256 * Math.pow(2, A);
  (function(n, i) {
    const r = new jg({
      code: n,
      // The extent is used to determine zoom level 0. Recommended values for a
      // projection's validity extent can be found at https://epsg.io/.
      extent: [0, 0, i, i],
      units: "m"
    });
    Di(r), Fn(
      "EPSG:3857",
      r,
      (s) => {
        const g = (s[0] + ft.MERC_MAX) * i / (2 * ft.MERC_MAX), o = (-s[1] + ft.MERC_MAX) * i / (2 * ft.MERC_MAX);
        return [g, o];
      },
      (s) => {
        const g = s[0] * (2 * ft.MERC_MAX) / i - ft.MERC_MAX, o = -1 * (s[1] * (2 * ft.MERC_MAX) / i - ft.MERC_MAX);
        return [g, o];
      }
    );
  })(t, e);
}
class wg extends Eo(Ss) {
  constructor(t = {}) {
    t = js(t), t.wrapX = !1;
    const e = Math.log2(t.width / Je), n = Math.log2(t.height / Je);
    t.maxZoom = Math.ceil(Math.max(e, n)), t.tileUrlFunction = t.tileUrlFunction || function(i) {
      const r = i[0], s = i[1], g = i[2];
      return (
        // @ts-ignore
        s * Je * Math.pow(2, this.maxZoom - r) >= this.width || // @ts-ignore
        g * Je * Math.pow(2, this.maxZoom - r) >= this.height || s < 0 || g < 0 ? Ps : this._tileUrlFunction(i)
      );
    }, super(t), t.mapID && (this.mapID = t.mapID), t.urls ? this._tileUrlFunction = ns(t.urls) : t.url && (this._tileUrlFunction = ns(Array.isArray(t.url) ? t.url : [t.url])), this.width = t.width, this.height = t.height, this.maxZoom = t.maxZoom, this._maxxy = Math.pow(2, this.maxZoom) * Je, this.initialize(t);
  }
}
class Kn extends BA {
  static isBasemap_ = !1;
  constructor(t = {}) {
    super(Object.assign(t, { opaque: !1 }));
  }
}
const Ee = "https://weiwudi.example.com/api/";
let yi, pA;
class nC {
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
    for (let i = 0, r = n.length; i < r; i++)
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
class ve extends nC {
  static async registerSW(t, e) {
    if ("serviceWorker" in navigator)
      try {
        const n = await navigator.serviceWorker.register(t, e), i = n.installing, r = n.waiting;
        return i && (i.state === "activated" && !r && window.location.reload(), i.addEventListener("statechange", (s) => {
          i.state === "activated" && !r && window.location.reload();
        })), n.onupdatefound = () => {
          n.update();
        }, await ve.swCheck(), n;
      } catch (n) {
        throw `Error: Service worker registration failed with ${n}`;
      }
    else
      throw "Error: Service worker is not supported";
  }
  static async swCheck() {
    return pA !== void 0 ? pA : (yi === void 0 && (yi = new Promise((t, e) => {
      fetch(`${Ee}ping`).then((n) => {
        pA = !!n, t(pA);
      }).catch((n) => {
        pA = !1, t(pA);
      });
    })), yi);
  }
  static async registerMap(t, e) {
    if (!await ve.swCheck()) throw "Weiwudi service worker is not implemented.";
    let n;
    const i = ["type", "url", "width", "height", "tileSize", "minZoom", "maxZoom", "maxLng", "maxLat", "minLng", "minLat"].reduce((s, g) => (typeof e[g] < "u" && (e[g] instanceof Array ? e[g].map((o) => {
      s.append(g, o);
    }) : s.append(g, String(e[g]))), s), new URLSearchParams());
    i.append("mapID", t);
    const r = new URL(`${Ee}add`);
    if (r.search = i.toString(), n = await (await fetch(r.href)).text(), n.match(/^Error: /))
      throw n;
    return new ve(t, JSON.parse(n));
  }
  static async retrieveMap(t) {
    if (!await ve.swCheck()) throw "Weiwudi service worker is not implemented.";
    let e;
    if (e = await (await fetch(`${Ee}info?mapID=${t}`)).text(), e.match(/^Error: /))
      throw e;
    return console.log(e), new ve(t, JSON.parse(e));
  }
  static async removeMap(t) {
    if (!await ve.swCheck()) throw "Weiwudi service worker is not implemented.";
    let e;
    if (e = await (await fetch(`${Ee}delete?mapID=${t}`)).text(), e.match(/^Error: /))
      throw e;
  }
  constructor(t, e) {
    if (super(), !t) throw "MapID is necessary.";
    this.mapID = t, e && Object.assign(this, e), this.url = `${Ee}cache/${t}/{z}/{x}/{y}`, this.listener = (n) => {
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
    if (this.checkAspect(), t = await (await fetch(`${Ee}stats?mapID=${this.mapID}`)).text(), typeof t == "string" && t.match(/^Error: /))
      throw t;
    return JSON.parse(t);
  }
  async clean() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${Ee}clean?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
  async fetchAll() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${Ee}fetchAll?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
  async remove() {
    this.checkAspect(), this.mapID && await ve.removeMap(this.mapID), this.release();
  }
  async cancel() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${Ee}cancel?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
}
function jn(A, t, e) {
  const n = typeof A == "string" ? A : A.getCode(), i = typeof t == "string" ? t : t.getCode();
  let r = ci(A, t);
  if (r == li && n != i) {
    const s = ci(A, "EPSG:3857"), g = ci("EPSG:3857", t);
    if (s == li && n != "EPSG:3857")
      throw "Transform of Source projection is not defined.";
    if (g == li && i != "EPSG:3857")
      throw "Transform of Distination projection is not defined.";
    r = function(a) {
      return ee(ee(a, A, "EPSG:3857"), "EPSG:3857", t);
    }, Fn(A, t, r, function(a) {
      return ee(ee(a, t, "EPSG:3857"), "EPSG:3857", A);
    });
  }
  if (e)
    return r(e);
}
const iC = [
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
async function rC(A) {
  const t = A;
  if (iC.forEach((r) => {
    t[r] = A[r];
  }), (A.imageExtention || A.imageExtension) && (t.imageExtension = A.imageExtension || A.imageExtention), !A.compiled)
    throw new Error(
      "@maplat/transform requires pre-compiled data. Cannot create MapTransform from GCPs."
    );
  const e = { compiled: A.compiled };
  A.sub_maps?.length && (e.sub_maps = A.sub_maps.filter((r) => r.compiled).map((r) => ({
    compiled: r.compiled,
    priority: r.priority,
    importance: r.importance,
    bounds: r.bounds
  })));
  const n = new ft.MapTransform();
  n.setMapData(e);
  const i = n.getLayerTransform(0);
  if (t.strictMode = i.strictMode, t.vertexMode = i.vertexMode, t.yaxisMode = i.yaxisMode, t.width = i.wh?.[0], t.height = i.wh?.[1], t.gcps = i.points, t.edges = i.edges, A.sub_maps) {
    const r = A.sub_maps.map((s, g) => {
      const o = {
        importance: s.importance,
        priority: s.priority
      };
      if (s.compiled) {
        const a = n.getLayerTransform(g + 1);
        o.bounds = a?.bounds ?? s.bounds, o.gcps = a?.points, o.edges = a?.edges;
      } else
        o.bounds = s.bounds, o.gcps = s.gcps, o.edges = s.edges;
      return o;
    });
    t.sub_maps = r;
  }
  return [t, n];
}
class Jn extends wg {
  mapTransform;
  constructor(t = {}) {
    super(t), this.mapTransform = new ft.MapTransform();
  }
  static async createAsync(t) {
    const [e, n] = await rC(t);
    t = e;
    const i = new Jn(t);
    i.mapTransform = n;
    const r = n.getLayerTransform(0), s = new nn({
      code: `Illst:${i.mapID}`,
      extent: [0, 0, i.width, i.height],
      units: "m"
    });
    return Di(s), Fn(
      s,
      "EPSG:3857",
      (g) => r.transform(g, !1),
      (g) => r.transform(g, !0)
    ), jn("EPSG:4326", s), t.sub_maps && t.sub_maps.forEach((g, o) => {
      const a = o + 1, I = `Illst:${i.mapID}#${a}`, c = n.getLayerTransform(a);
      if (!c) return;
      const h = new nn({
        code: I,
        extent: [c.xy[0], c.xy[1], c.wh[0], c.wh[1]],
        units: "m"
      });
      Di(h), Fn(
        h,
        "EPSG:3857",
        (m) => c.transform(m, !1, !0),
        (m) => c.transform(m, !0, !0)
      ), jn("EPSG:4326", h);
    }), i;
  }
  xy2MercAsync_specifyLayer(t, e) {
    const n = `Illst:${this.mapID}${e ? `#${e}` : ""}`;
    return new Promise((i, r) => {
      i(jn(n, "EPSG:3857", t));
    });
  }
  merc2XyAsync_specifyLayer(t, e) {
    const n = `Illst:${this.mapID}${e ? `#${e}` : ""}`;
    return new Promise((i, r) => {
      i(jn("EPSG:3857", n, t));
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
    const [i, r] = n, s = this.mapTransform.getLayerTransform(i), g = this.mapTransform.getLayerTransform(0);
    if (!s) return;
    const o = [
      [e[0] - 150, e[1]],
      [e[0] + 150, e[1]],
      [e[0], e[1] - 150],
      [e[0], e[1] + 150]
    ], a = [
      [0, 0],
      [this.width, 0],
      [this.width, this.height],
      [0, this.height]
    ], I = o.map((v) => s.transform(v, !1)), c = a.map(
      (v) => g.transform(v, !1)
    ), h = Math.sqrt(
      Math.pow(I[0][0] - I[1][0], 2) + Math.pow(I[0][1] - I[1][1], 2)
    ), m = Math.sqrt(
      Math.pow(I[2][0] - I[3][0], 2) + Math.pow(I[2][1] - I[3][1], 2)
    ), b = (h + m) / 2;
    this.mercZoom || (this.mercZoom = Math.log(300 * (2 * ft.MERC_MAX) / 256 / b) / Math.log(2) - 3), this.homePosition || (this.homePosition = Yi(r)), this.envelope = Os([
      [
        c[0],
        c[1],
        c[2],
        c[3],
        c[0]
      ]
    ]), t(this);
  }
  mercs2SysCoordsAsync_multiLayer(t) {
    const e = this.mapTransform.mercs2SysCoords(t[0]);
    return Promise.resolve(
      e.map((n) => {
        if (n)
          return [n.map((i) => i), t[1]];
      })
    );
  }
  merc2XyAsync_base(t, e) {
    return this.merc2XyAsync_returnLayer(t).then((n) => e && !n[0] ? void 0 : (n[0] ? n[0] : n[1])[1]);
  }
  merc2XyAsync_ignoreBackground(t) {
    return this.merc2XyAsync_base(t, !0);
  }
  merc2XyAsync(t) {
    return this.merc2XyAsync_base(t, !1);
  }
  xy2MercAsync(t) {
    return this.xy2MercAsync_returnLayer(t).then((e) => e[1]);
  }
  viewpoint2MercsAsync(t, e) {
    const n = t?.[0] ?? this.getMap().getView().getCenter(), i = t?.[1] ?? this.getMap().getView().getDecimalZoom(), r = t?.[2] ?? this.getMap().getView().getRotation();
    e || (e = this.getMap().getSize());
    const s = this.mapTransform.viewpoint2Mercs(
      { center: n, zoom: i, rotation: r },
      e
    );
    return Promise.resolve([s, e]);
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
var Ot = typeof globalThis < "u" && globalThis || typeof self < "u" && self || // eslint-disable-next-line no-undef
typeof globalThis < "u" && globalThis || {}, Qt = {
  searchParams: "URLSearchParams" in Ot,
  iterable: "Symbol" in Ot && "iterator" in Symbol,
  blob: "FileReader" in Ot && "Blob" in Ot && (function() {
    try {
      return new Blob(), !0;
    } catch {
      return !1;
    }
  })(),
  formData: "FormData" in Ot,
  arrayBuffer: "ArrayBuffer" in Ot
};
function sC(A) {
  return A && DataView.prototype.isPrototypeOf(A);
}
if (Qt.arrayBuffer)
  var gC = [
    "[object Int8Array]",
    "[object Uint8Array]",
    "[object Uint8ClampedArray]",
    "[object Int16Array]",
    "[object Uint16Array]",
    "[object Int32Array]",
    "[object Uint32Array]",
    "[object Float32Array]",
    "[object Float64Array]"
  ], oC = ArrayBuffer.isView || function(A) {
    return A && gC.indexOf(Object.prototype.toString.call(A)) > -1;
  };
function kA(A) {
  if (typeof A != "string" && (A = String(A)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(A) || A === "")
    throw new TypeError('Invalid character in header field name: "' + A + '"');
  return A.toLowerCase();
}
function hr(A) {
  return typeof A != "string" && (A = String(A)), A;
}
function ur(A) {
  var t = {
    next: function() {
      var e = A.shift();
      return { done: e === void 0, value: e };
    }
  };
  return Qt.iterable && (t[Symbol.iterator] = function() {
    return t;
  }), t;
}
function Tt(A) {
  this.map = {}, A instanceof Tt ? A.forEach(function(t, e) {
    this.append(e, t);
  }, this) : Array.isArray(A) ? A.forEach(function(t) {
    if (t.length != 2)
      throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + t.length);
    this.append(t[0], t[1]);
  }, this) : A && Object.getOwnPropertyNames(A).forEach(function(t) {
    this.append(t, A[t]);
  }, this);
}
Tt.prototype.append = function(A, t) {
  A = kA(A), t = hr(t);
  var e = this.map[A];
  this.map[A] = e ? e + ", " + t : t;
};
Tt.prototype.delete = function(A) {
  delete this.map[kA(A)];
};
Tt.prototype.get = function(A) {
  return A = kA(A), this.has(A) ? this.map[A] : null;
};
Tt.prototype.has = function(A) {
  return this.map.hasOwnProperty(kA(A));
};
Tt.prototype.set = function(A, t) {
  this.map[kA(A)] = hr(t);
};
Tt.prototype.forEach = function(A, t) {
  for (var e in this.map)
    this.map.hasOwnProperty(e) && A.call(t, this.map[e], e, this);
};
Tt.prototype.keys = function() {
  var A = [];
  return this.forEach(function(t, e) {
    A.push(e);
  }), ur(A);
};
Tt.prototype.values = function() {
  var A = [];
  return this.forEach(function(t) {
    A.push(t);
  }), ur(A);
};
Tt.prototype.entries = function() {
  var A = [];
  return this.forEach(function(t, e) {
    A.push([e, t]);
  }), ur(A);
};
Qt.iterable && (Tt.prototype[Symbol.iterator] = Tt.prototype.entries);
function wi(A) {
  if (!A._noBody) {
    if (A.bodyUsed)
      return Promise.reject(new TypeError("Already read"));
    A.bodyUsed = !0;
  }
}
function bg(A) {
  return new Promise(function(t, e) {
    A.onload = function() {
      t(A.result);
    }, A.onerror = function() {
      e(A.error);
    };
  });
}
function aC(A) {
  var t = new FileReader(), e = bg(t);
  return t.readAsArrayBuffer(A), e;
}
function IC(A) {
  var t = new FileReader(), e = bg(t), n = /charset=([A-Za-z0-9_-]+)/.exec(A.type), i = n ? n[1] : "utf-8";
  return t.readAsText(A, i), e;
}
function CC(A) {
  for (var t = new Uint8Array(A), e = new Array(t.length), n = 0; n < t.length; n++)
    e[n] = String.fromCharCode(t[n]);
  return e.join("");
}
function is(A) {
  if (A.slice)
    return A.slice(0);
  var t = new Uint8Array(A.byteLength);
  return t.set(new Uint8Array(A)), t.buffer;
}
function Eg() {
  return this.bodyUsed = !1, this._initBody = function(A) {
    this.bodyUsed = this.bodyUsed, this._bodyInit = A, A ? typeof A == "string" ? this._bodyText = A : Qt.blob && Blob.prototype.isPrototypeOf(A) ? this._bodyBlob = A : Qt.formData && FormData.prototype.isPrototypeOf(A) ? this._bodyFormData = A : Qt.searchParams && URLSearchParams.prototype.isPrototypeOf(A) ? this._bodyText = A.toString() : Qt.arrayBuffer && Qt.blob && sC(A) ? (this._bodyArrayBuffer = is(A.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : Qt.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(A) || oC(A)) ? this._bodyArrayBuffer = is(A) : this._bodyText = A = Object.prototype.toString.call(A) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof A == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : Qt.searchParams && URLSearchParams.prototype.isPrototypeOf(A) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
  }, Qt.blob && (this.blob = function() {
    var A = wi(this);
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
      var A = wi(this);
      return A || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
        this._bodyArrayBuffer.buffer.slice(
          this._bodyArrayBuffer.byteOffset,
          this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
        )
      ) : Promise.resolve(this._bodyArrayBuffer));
    } else {
      if (Qt.blob)
        return this.blob().then(aC);
      throw new Error("could not read as ArrayBuffer");
    }
  }, this.text = function() {
    var A = wi(this);
    if (A)
      return A;
    if (this._bodyBlob)
      return IC(this._bodyBlob);
    if (this._bodyArrayBuffer)
      return Promise.resolve(CC(this._bodyArrayBuffer));
    if (this._bodyFormData)
      throw new Error("could not read FormData body as text");
    return Promise.resolve(this._bodyText);
  }, Qt.formData && (this.formData = function() {
    return this.text().then(hC);
  }), this.json = function() {
    return this.text().then(JSON.parse);
  }, this;
}
var cC = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
function lC(A) {
  var t = A.toUpperCase();
  return cC.indexOf(t) > -1 ? t : A;
}
function nA(A, t) {
  if (!(this instanceof nA))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  t = t || {};
  var e = t.body;
  if (A instanceof nA) {
    if (A.bodyUsed)
      throw new TypeError("Already read");
    this.url = A.url, this.credentials = A.credentials, t.headers || (this.headers = new Tt(A.headers)), this.method = A.method, this.mode = A.mode, this.signal = A.signal, !e && A._bodyInit != null && (e = A._bodyInit, A.bodyUsed = !0);
  } else
    this.url = String(A);
  if (this.credentials = t.credentials || this.credentials || "same-origin", (t.headers || !this.headers) && (this.headers = new Tt(t.headers)), this.method = lC(t.method || this.method || "GET"), this.mode = t.mode || this.mode || null, this.signal = t.signal || this.signal || (function() {
    if ("AbortController" in Ot) {
      var r = new AbortController();
      return r.signal;
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
nA.prototype.clone = function() {
  return new nA(this, { body: this._bodyInit });
};
function hC(A) {
  var t = new FormData();
  return A.trim().split("&").forEach(function(e) {
    if (e) {
      var n = e.split("="), i = n.shift().replace(/\+/g, " "), r = n.join("=").replace(/\+/g, " ");
      t.append(decodeURIComponent(i), decodeURIComponent(r));
    }
  }), t;
}
function uC(A) {
  var t = new Tt(), e = A.replace(/\r?\n[\t ]+/g, " ");
  return e.split("\r").map(function(n) {
    return n.indexOf(`
`) === 0 ? n.substr(1, n.length) : n;
  }).forEach(function(n) {
    var i = n.split(":"), r = i.shift().trim();
    if (r) {
      var s = i.join(":").trim();
      try {
        t.append(r, s);
      } catch (g) {
        console.warn("Response " + g.message);
      }
    }
  }), t;
}
Eg.call(nA.prototype);
function de(A, t) {
  if (!(this instanceof de))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  if (t || (t = {}), this.type = "default", this.status = t.status === void 0 ? 200 : t.status, this.status < 200 || this.status > 599)
    throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
  this.ok = this.status >= 200 && this.status < 300, this.statusText = t.statusText === void 0 ? "" : "" + t.statusText, this.headers = new Tt(t.headers), this.url = t.url || "", this._initBody(A);
}
Eg.call(de.prototype);
de.prototype.clone = function() {
  return new de(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Tt(this.headers),
    url: this.url
  });
};
de.error = function() {
  var A = new de(null, { status: 200, statusText: "" });
  return A.ok = !1, A.status = 0, A.type = "error", A;
};
var fC = [301, 302, 303, 307, 308];
de.redirect = function(A, t) {
  if (fC.indexOf(t) === -1)
    throw new RangeError("Invalid status code");
  return new de(null, { status: t, headers: { location: A } });
};
var qe = Ot.DOMException;
try {
  new qe();
} catch {
  qe = function(t, e) {
    this.message = t, this.name = e;
    var n = Error(t);
    this.stack = n.stack;
  }, qe.prototype = Object.create(Error.prototype), qe.prototype.constructor = qe;
}
function vg(A, t) {
  return new Promise(function(e, n) {
    var i = new nA(A, t);
    if (i.signal && i.signal.aborted)
      return n(new qe("Aborted", "AbortError"));
    var r = new XMLHttpRequest();
    function s() {
      r.abort();
    }
    r.onload = function() {
      var a = {
        statusText: r.statusText,
        headers: uC(r.getAllResponseHeaders() || "")
      };
      i.url.indexOf("file://") === 0 && (r.status < 200 || r.status > 599) ? a.status = 200 : a.status = r.status, a.url = "responseURL" in r ? r.responseURL : a.headers.get("X-Request-URL");
      var I = "response" in r ? r.response : r.responseText;
      setTimeout(function() {
        e(new de(I, a));
      }, 0);
    }, r.onerror = function() {
      setTimeout(function() {
        n(new TypeError("Network request failed"));
      }, 0);
    }, r.ontimeout = function() {
      setTimeout(function() {
        n(new TypeError("Network request timed out"));
      }, 0);
    }, r.onabort = function() {
      setTimeout(function() {
        n(new qe("Aborted", "AbortError"));
      }, 0);
    };
    function g(a) {
      try {
        return a === "" && Ot.location.href ? Ot.location.href : a;
      } catch {
        return a;
      }
    }
    if (r.open(i.method, g(i.url), !0), i.credentials === "include" ? r.withCredentials = !0 : i.credentials === "omit" && (r.withCredentials = !1), "responseType" in r && (Qt.blob ? r.responseType = "blob" : Qt.arrayBuffer && (r.responseType = "arraybuffer")), t && typeof t.headers == "object" && !(t.headers instanceof Tt || Ot.Headers && t.headers instanceof Ot.Headers)) {
      var o = [];
      Object.getOwnPropertyNames(t.headers).forEach(function(a) {
        o.push(kA(a)), r.setRequestHeader(a, hr(t.headers[a]));
      }), i.headers.forEach(function(a, I) {
        o.indexOf(I) === -1 && r.setRequestHeader(I, a);
      });
    } else
      i.headers.forEach(function(a, I) {
        r.setRequestHeader(I, a);
      });
    i.signal && (i.signal.addEventListener("abort", s), r.onreadystatechange = function() {
      r.readyState === 4 && i.signal.removeEventListener("abort", s);
    }), r.send(typeof i._bodyInit > "u" ? null : i._bodyInit);
  });
}
vg.polyfill = !0;
Ot.fetch || (Ot.fetch = vg, Ot.Headers = Tt, Ot.Request = nA, Ot.Response = de);
const Mg = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAAqACAAQAAAABAAAANKADAAQAAAABAAAANAAAAAD/4QkhaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/4hskSUNDX1BST0ZJTEUAAQEAABsUYXBwbAIQAABtbnRyUkdCIFhZWiAH4AAKAB0AFAA0AAZhY3NwQVBQTAAAAABBUFBMAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFkZXNjAAABUAAAAGJkc2NtAAABtAAABBhjcHJ0AAAFzAAAACN3dHB0AAAF8AAAABRyWFlaAAAGBAAAABRnWFlaAAAGGAAAABRiWFlaAAAGLAAAABRyVFJDAAAGQAAACAxhYXJnAAAOTAAAACB2Y2d0AAAObAAABhJuZGluAAAUgAAABj5jaGFkAAAawAAAACxtbW9kAAAa7AAAAChiVFJDAAAGQAAACAxnVFJDAAAGQAAACAxhYWJnAAAOTAAAACBhYWdnAAAOTAAAACBkZXNjAAAAAAAAAAhEaXNwbGF5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbWx1YwAAAAAAAAAiAAAADGhySFIAAAAUAAABqGtvS1IAAAAMAAABvG5iTk8AAAASAAAByGlkAAAAAAASAAAB2mh1SFUAAAAUAAAB7GNzQ1oAAAAWAAACAGRhREsAAAAcAAACFnVrVUEAAAAcAAACMmFyAAAAAAAUAAACTml0SVQAAAAUAAACYnJvUk8AAAASAAACdm5sTkwAAAAWAAACiGhlSUwAAAAWAAACnmVzRVMAAAASAAACdmZpRkkAAAAQAAACtHpoVFcAAAAMAAACxHZpVk4AAAAOAAAC0HNrU0sAAAAWAAAC3npoQ04AAAAMAAACxHJ1UlUAAAAkAAAC9GZyRlIAAAAWAAADGG1zAAAAAAASAAADLmNhRVMAAAAYAAADQHRoVEgAAAAMAAADWGVzWEwAAAASAAACdmRlREUAAAAQAAADZGVuVVMAAAASAAADdHB0QlIAAAAYAAADhnBsUEwAAAASAAADnmVsR1IAAAAiAAADsHN2U0UAAAAQAAAD0nRyVFIAAAAUAAAD4mphSlAAAAAMAAAD9nB0UFQAAAAWAAAEAgBMAEMARAAgAHUAIABiAG8AagBpzuy37AAgAEwAQwBEAEYAYQByAGcAZQAtAEwAQwBEAEwAQwBEACAAVwBhAHIAbgBhAFMAegDtAG4AZQBzACAATABDAEQAQgBhAHIAZQB2AG4A/QAgAEwAQwBEAEwAQwBEAC0AZgBhAHIAdgBlAHMAawDmAHIAbQQaBD4EOwRMBD4EQAQ+BDIEOAQ5ACAATABDAEQgDwBMAEMARAAgBkUGRAZIBkYGKQBMAEMARAAgAGMAbwBsAG8AcgBpAEwAQwBEACAAYwBvAGwAbwByAEsAbABlAHUAcgBlAG4ALQBMAEMARCAPAEwAQwBEACAF5gXRBeIF1QXgBdkAVgDkAHIAaQAtAEwAQwBEX2mCcgAgAEwAQwBEAEwAQwBEACAATQDgAHUARgBhAHIAZQBiAG4A6QAgAEwAQwBEBCYEMgQ1BEIEPQQ+BDkAIAQWBBoALQQ0BDgEQQQ/BDsENQQ5AEwAQwBEACAAYwBvAHUAbABlAHUAcgBXAGEAcgBuAGEAIABMAEMARABMAEMARAAgAGUAbgAgAGMAbwBsAG8AcgBMAEMARAAgDioONQBGAGEAcgBiAC0ATABDAEQAQwBvAGwAbwByACAATABDAEQATABDAEQAIABDAG8AbABvAHIAaQBkAG8ASwBvAGwAbwByACAATABDAEQDiAOzA8cDwQPJA7wDtwAgA78DuAPMA70DtwAgAEwAQwBEAEYA5AByAGcALQBMAEMARABSAGUAbgBrAGwAaQAgAEwAQwBEMKsw6TD8AEwAQwBEAEwAQwBEACAAYQAgAEMAbwByAGUAc3RleHQAAAAAQ29weXJpZ2h0IEFwcGxlIEluYy4sIDIwMTYAAFhZWiAAAAAAAADzUgABAAAAARbPWFlaIAAAAAAAAGXoAAA8EAAACdBYWVogAAAAAAAAapMAAKrFAAAXilhZWiAAAAAAAAAmWwAAGSwAALHSY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA2ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKMAqACtALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkH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", Rg = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAAqACAAQAAAABAAAANKADAAQAAAABAAAANAAAAAD/4QkhaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/4gKESUNDX1BST0ZJTEUAAQEAAAJ0YXBwbAQAAABtbnRyUkdCIFhZWiAH3AALAAwAEgA6ABdhY3NwQVBQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGxmSfnZPIV3n7QGSpkeOnQsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtkZXNjAAABCAAAAGNkc2NtAAABbAAAACxjcHJ0AAABmAAAAC13dHB0AAAByAAAABRyWFlaAAAB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", Tg = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCARXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAKgAgAEAAAAAQAAADSgAwAEAAAAAQAAADQAAAAA/+EJIWh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/PgD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/+IbJElDQ19QUk9GSUxFAAEBAAAbFGFwcGwCEAAAbW50clJHQiBYWVogB+EABAAEABcABgAzYWNzcEFQUEwAAAAAQVBQTAAAAAAAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1hcHBsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARZGVzYwAAAVAAAABiZHNjbQAAAbQAAAQYY3BydAAABcwAAAAjd3RwdAAABfAAAAAUclhZWgAABgQAAAAUZ1hZWgAABhgAAAAUYlhZWgAABiwAAAAUclRSQwAABkAAAAgMYWFyZwAADkwAAAAgdmNndAAADmwAAAYSbmRpbgAAFIAAAAY+Y2hhZAAAGsAAAAAsbW1vZAAAGuwAAAAoYlRSQwAABkAAAAgMZ1RSQwAABkAAAAgMYWFiZwAADkwAAAAgYWFnZwAADkwAAAAgZGVzYwAAAAAAAAAIRGlzcGxheQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG1sdWMAAAAAAAAAIgAAAAxockhSAAAAFAAAAahrb0tSAAAADAAAAbxuYk5PAAAAEgAAAchpZAAAAAAAEgAAAdpodUhVAAAAFAAAAexjc0NaAAAAFgAAAgBkYURLAAAAHAAAAhZ1a1VBAAAAHAAAAjJhcgAAAAAAFAAAAk5pdElUAAAAFAAAAmJyb1JPAAAAEgAAAnZubE5MAAAAFgAAAohoZUlMAAAAFgAAAp5lc0VTAAAAEgAAAnZmaUZJAAAAEAAAArR6aFRXAAAADAAAAsR2aVZOAAAADgAAAtBza1NLAAAAFgAAAt56aENOAAAADAAAAsRydVJVAAAAJAAAAvRmckZSAAAAFgAAAxhtcwAAAAAAEgAAAy5jYUVTAAAAGAAAA0B0aFRIAAAADAAAA1hlc1hMAAAAEgAAAnZkZURFAAAAEAAAA2RlblVTAAAAEgAAA3RwdEJSAAAAGAAAA4ZwbFBMAAAAEgAAA55lbEdSAAAAIgAAA7BzdlNFAAAAEAAAA9J0clRSAAAAFAAAA+JqYUpQAAAADAAAA/ZwdFBUAAAAFgAABAIATABDAEQAIAB1ACAAYgBvAGoAac7st+wAIABMAEMARABGAGEAcgBnAGUALQBMAEMARABMAEMARAAgAFcAYQByAG4AYQBTAHoA7QBuAGUAcwAgAEwAQwBEAEIAYQByAGUAdgBuAP0AIABMAEMARABMAEMARAAtAGYAYQByAHYAZQBzAGsA5gByAG0EGgQ+BDsETAQ+BEAEPgQyBDgEOQAgAEwAQwBEIA8ATABDAEQAIAZFBkQGSAZGBikATABDAEQAIABjAG8AbABvAHIAaQBMAEMARAAgAGMAbwBsAG8AcgBLAGwAZQB1AHIAZQBuAC0ATABDAEQgDwBMAEMARAAgBeYF0QXiBdUF4AXZAFYA5AByAGkALQBMAEMARF9pgnIAIABMAEMARABMAEMARAAgAE0A4AB1AEYAYQByAGUAYgBuAP0AIABMAEMARAQmBDIENQRCBD0EPgQ5ACAEFgQaAC0ENAQ4BEEEPwQ7BDUEOQBMAEMARAAgAGMAbwB1AGwAZQB1AHIAVwBhAHIAbgBhACAATABDAEQATABDAEQAIABlAG4AIABjAG8AbABvAHIATABDAEQAIA4qDjUARgBhAHIAYgAtAEwAQwBEAEMAbwBsAG8AcgAgAEwAQwBEAEwAQwBEACAAQwBvAGwAbwByAGkAZABvAEsAbwBsAG8AcgAgAEwAQwBEA4gDswPHA8EDyQO8A7cAIAO/A7gDzAO9A7cAIABMAEMARABGAOQAcgBnAC0ATABDAEQAUgBlAG4AawBsAGkAIABMAEMARDCrMOkw/ABMAEMARABMAEMARAAgAGEAIABDAG8AcgBlAHN0ZXh0AAAAAENvcHlyaWdodCBBcHBsZSBJbmMuLCAyMDE3AABYWVogAAAAAAAA81IAAQAAAAEWz1hZWiAAAAAAAABl6AAAPBAAAAnQWFlaIAAAAAAAAGqTAACqxQAAF4pYWVogAAAAAAAAJlsAABksAACx0mN1cnYAAAAAAAAEAAAAAAUACgAPABQAGQAeACMAKAAtADIANgA7AEAARQBKAE8AVABZAF4AYwBoAG0AcgB3AHwAgQCGAIsAkACVAJoAnwCjAKgArQCyALcAvADBAMYAywDQANUA2wDgAOUA6wDwAPYA+wEBAQcBDQETARkBHwElASsBMgE4AT4BRQFMAVIBWQFgAWcBbgF1AXwBgwGLAZIBmgGhAakBsQG5AcEByQHRAdkB4QHpAfIB+gIDAgwCFAIdAiYCLwI4AkECSwJUAl0CZwJxAnoChAKOApgCogKsArYCwQLLAtUC4ALrAvUDAAMLAxYDIQMtAzgDQwNPA1oDZgNyA34DigOWA6IDrgO6A8cD0wPgA+wD+QQGBBMEIAQtBDsESARVBGMEcQR+BIwEmgSoBLYExATTBOEE8AT+BQ0FHAUrBToFSQVYBWcFdwWGBZYFpgW1BcUF1QXlBfYGBgYWBicGNwZIBlkGagZ7BowGnQavBsAG0QbjBvUHBwcZBysHPQdPB2EHdAeGB5kHrAe/B9IH5Qf4CAsIHwgyCEYIWghuCIIIlgiqCL4I0gjnCPsJEAklCToJTwlkCXkJjwmkCboJzwnlCfsKEQonCj0KVApqCoEKmAquCsUK3ArzCwsLIgs5C1ELaQuAC5gLsAvIC+EL+QwSDCoMQwxcDHUMjgynDMAM2QzzDQ0NJg1ADVoNdA2ODakNww3eDfgOEw4uDkkOZA5/DpsOtg7SDu4PCQ8lD0EPXg96D5YPsw/PD+wQCRAmEEMQYRB+EJsQuRDXEPURExExEU8RbRGMEaoRyRHoEgcSJhJFEmQShBKjEsMS4xMDEyMTQxNjE4MTpBPFE+UUBhQnFEkUahSLFK0UzhTwFRIVNBVWFXgVmxW9FeAWAxYmFkkWbBaPFrIW1hb6Fx0XQRdlF4kXrhfSF/cYGxhAGGUYihivGNUY+hkgGUUZaxmRGbcZ3RoEGioaURp3Gp4axRrsGxQbOxtjG4obshvaHAIcKhxSHHscoxzMHPUdHh1HHXAdmR3DHeweFh5AHmoelB6+HukfEx8+H2kflB+/H+ogFSBBIGwgmCDEIPAhHCFIIXUhoSHOIfsiJyJVIoIiryLdIwojOCNmI5QjwiPwJB8kTSR8JKsk2iUJJTglaCWXJccl9yYnJlcmhya3JugnGCdJJ3onqyfcKA0oPyhxKKIo1CkGKTgpaymdKdAqAio1KmgqmyrPKwIrNitpK50r0SwFLDksbiyiLNctDC1BLXYtqy3hLhYuTC6CLrcu7i8kL1ovkS/HL/4wNTBsMKQw2zESMUoxgjG6MfIyKjJjMpsy1DMNM0YzfzO4M/E0KzRlNJ402DUTNU01hzXCNf02NzZyNq426TckN2A3nDfXOBQ4UDiMOMg5BTlCOX85vDn5OjY6dDqyOu87LTtrO6o76DwnPGU8pDzjPSI9YT2hPeA+ID5gPqA+4D8hP2E/oj/iQCNAZECmQOdBKUFqQaxB7kIwQnJCtUL3QzpDfUPARANER0SKRM5FEkVVRZpF3kYiRmdGq0bwRzVHe0fASAVIS0iRSNdJHUljSalJ8Eo3Sn1KxEsMS1NLmkviTCpMcky6TQJNSk2TTdxOJU5uTrdPAE9JT5NP3VAnUHFQu1EGUVBRm1HmUjFSfFLHUxNTX1OqU/ZUQlSPVNtVKFV1VcJWD1ZcVqlW91dEV5JX4FgvWH1Yy1kaWWlZuFoHWlZaplr1W0VblVvlXDVchlzWXSddeF3JXhpebF69Xw9fYV+zYAVgV2CqYPxhT2GiYfViSWKcYvBjQ2OXY+tkQGSUZOllPWWSZedmPWaSZuhnPWeTZ+loP2iWaOxpQ2maafFqSGqfavdrT2una/9sV2yvbQhtYG25bhJua27Ebx5veG/RcCtwhnDgcTpxlXHwcktypnMBc11zuHQUdHB0zHUodYV14XY+dpt2+HdWd7N4EXhueMx5KnmJeed6RnqlewR7Y3vCfCF8gXzhfUF9oX4BfmJ+wn8jf4R/5YBHgKiBCoFrgc2CMIKSgvSDV4O6hB2EgITjhUeFq4YOhnKG14c7h5+IBIhpiM6JM4mZif6KZIrKizCLlov8jGOMyo0xjZiN/45mjs6PNo+ekAaQbpDWkT+RqJIRknqS45NNk7aUIJSKlPSVX5XJljSWn5cKl3WX4JhMmLiZJJmQmfyaaJrVm0Kbr5wcnImc951kndKeQJ6unx2fi5/6oGmg2KFHobaiJqKWowajdqPmpFakx6U4pammGqaLpv2nbqfgqFKoxKk3qamqHKqPqwKrdavprFys0K1ErbiuLa6hrxavi7AAsHWw6rFgsdayS7LCszizrrQltJy1E7WKtgG2ebbwt2i34LhZuNG5SrnCuju6tbsuu6e8IbybvRW9j74KvoS+/796v/XAcMDswWfB48JfwtvDWMPUxFHEzsVLxcjGRsbDx0HHv8g9yLzJOsm5yjjKt8s2y7bMNcy1zTXNtc42zrbPN8+40DnQutE80b7SP9LB00TTxtRJ1MvVTtXR1lXW2Ndc1+DYZNjo2WzZ8dp22vvbgNwF3IrdEN2W3hzeot8p36/gNuC94UThzOJT4tvjY+Pr5HPk/OWE5g3mlucf56noMui86Ubp0Opb6uXrcOv77IbtEe2c7ijutO9A78zwWPDl8XLx//KM8xnzp/Q09ML1UPXe9m32+/eK+Bn4qPk4+cf6V/rn+3f8B/yY/Sn9uv5L/tz/bf//cGFyYQAAAAAAAwAAAAJmZgAA8qcAAA1ZAAAT0AAACg52Y2d0AAAAAAAAAAAAAwEAAAIAAABWAUUCQQM4BBgFCgYIBzAIWQmDCr8MBg1hDrcQChFsEsoUNRWcFwAYaxnOGzYckB3rH0AgjyHRIwokOSVZJmsnbShcKUIqHSrxK8YsmS1rLj0vDS/fMK8xgDJRMyEz7TS5NYU2UTccN+U4rjl4OkE7CjvTPJw9ZD4sPvI/t0B8QUJCDELfQ75EqkWdRpFHfkhhST9KGErxS8xMrk2dTqFPvFDjUgVTGVQaVRBWA1b8V/tZAFoJWw5cDV0EXfVe4l/QYMBhs2KmY5lkimV5ZmdnVGhCaTRqKmshbBltD24DbvRv4nDQcbtypHOOdH91hna1eAR5ZXrAfAB9Jn46f0mAW4F1go6DlYR7hTSF44aPh1CIJYkLigCLAowRjSiOPo9OkFeRWpJak1iUVpVUllGXTphLmUeaQps+nDmdM54tnyqgMKFLooOj4KVJpqyn66kRqiWrMaw7rUSuTa9XsF+xaLJws3e0frWCtoW3iLiLuY+6lbucvKa9tL7Fv9fA4MHWwq/DZsQYxMjFlsZ3x2bIXclXylHLS8xHzUjOVM9x0KDR2dML1C/VQ9ZJ10XYONkl2g7a+dvo3Njdwd6j34PgZ+FV4k7jTeRP5U/mSuc56Bfo4OmK6jTq4Ouo7HrtSO4I7qnvR+/j8KPxePJe80/0TfVq9sL4h/q3/UT//wAAAFYBRQIxAwQD6QTgBeMG8AgDCTYKaAucDOAOKg93EMYSGRN5FNQWMheCGN0aNRuGHNAeGh9YIJEhvCLcI/Uk9iXqJs0noyhyKT4qCCrUK58sai01Lf4uxi+OMFcxHzHnMq4zdjQ9NQE1xTaKN084EzjWOZk6WzsdO9w8nD1cPhk+1z+XQFtBJkH7QtVDsUSMRWVGPEcRR+ZIvEmVSnZLZUxiTWhOb09tUGJRT1I7UypUG1UOVgJW9lfnWNZZw1quW5tcil16XmlfWGBEYS9iGGMBY+pk1WXEZrVnpmiWaYRqb2tZbEBtJ24NbvRv4XDecfRzIXRfdZl2wXfYeON57Hr5fAt9Hn4ofyCABoDfgbWCj4NyhF6FVYZYh2mIg4mdiq2LtYy2jbSOsY+tkKmRpZKgk5uUlZWPlomXgph5mW+aZ5tpnICdv58poKiiJ6OSpNOl+acOqBqpI6oqqzGsN60+rkSvTbBZsWyyhrOjtL610bbet+i487oDuxe8K707vkC/N8AhwQLB4sLHw7XEp8WbxpDHhch6yXLKdMuJzLzOFs990N3SGtM/1FTVZtaA16XYz9n02xLcLd1M3nDfl+C74dLi3uPi5OvmBec56IHp0esR7DDtNe4m7w/v+PDm8dfyyvO59KH1f/ZW9yf39vi8+Xr6O/sM/ET96f//AAAAVgEuAesCnQNeBCkFBwXxBukH6gjiCfELCgwlDUEOWg+BEKwR0RL/FCUVRRZqF4UYnxm0GsUbyBzGHbseoR94IEIg+iGkIksi6yOIJCckwiVeJfkmlCcwJ8ooZykHKacqSCrnK4YsKCzFLWMuAC6dLzwv2DB1MRIxrzJMMugzgzQeNLg1UjXsNoU3Hze3OFA46Dl/OhY6qztBO9I8YzzuPXs+Bz6bPzQ/1kB6QR5BuEJPQtlDaEP/RKJFUEYJRsNHfEg0SOpJokpcSxhL1kyVTVNOD07JT4NQO1D0Ua9Sa1MnU+RUoVVdVhlW1FePWEhY/1m1WmxbJFvdXJZdTl32XpRfJV+0YEFg2mF4YiJi2GOZZGhlR2Y3ZzloSWlham1rYWw/bRBt3G6lb21wNXD8ccNyinNQdBV023WfdmR3JnfmeJ55RXncemx7FHvTfLt9vn7Ef8OAuYGpgpaDg4RvhVuGRYcqiAWI1ImZilqLJIv7jOCNzY65j6CQfpFbkjqTGpP5lNaVspaXl42YkpmhmrObxpzYneqe+6ANoSCiM6NIpFylb6Z+p4mojKmAqmGrN6wOrPKt7a75sAyxHrIys1C0e7W0tvi4Oblwupm7sLy4vbu+yb/1wUfCucRTxfXHlskzytTMjc5g0EnSQdRC1mzZDtzr4s7q9fT5//8AAG5kaW4AAAAAAAAGNgAAk4EAAFiGAABVPwAAkcQAACbVAAAXCgAAUA0AAFQ5AAImZgACDMwAATrhAAMBAAACAAAAAQADAAYACwARABgAHwAnADAAOgBEAE8AWgBmAHMAgQCPAJ4ArgC+AM8A4QD0AQcBHAExAUcBXwF3AZEBrAHIAeYCBgIoAkwCcwKdAssC/wM4A3YDuQP+BEcEkwTiBTMFiAXfBjoGmQb7B2EHygg3CKcJGwmRCgsKiQsKC5AMGgynDTQNvA49DroPOA+7EEgQ2xF0EhASrRNEE9EUVBTRFU8V0hZfFvgXmRg9GN4ZfRobGrobXhwJHLwddh40HvMfsiByITUh/CLHI5YkaCU8Jg4m4CezKIgpYipBKyYsDiz7Le4u5C/VMLUxezIxMt4ziDQ1NO81uDaSN3k4ZDlMOjA7FzwOPS4+m0ArQY1CyUPvRQhGFUcZSBxJJEo0S05McU2YTsRP8lEjUldTjlTHVgRXRFiGWcxbFlxiXape5GAGYRFiBmL1Y+Vk3GXqZw9oS2mVaudsPG2Ubu5wSnGqcwx0cXXad0Z4uHote6Z9IH6bgBaBkYMKhIGF9YdqiOuKi4xtjrWREZMalO2WqZhfmhab0J2Nn0eg9aKPpBSliKb2qGup8quQrUWvEbDxsua06LbruOe647zxvxfBQ8NexWDHU8k/yy/NKc820W7T+NcE2gncn98T4b7lDuh860Htr+/78jb0RvYK9434yvno+uX72fy0/ZD+Yv8w//8AAAABAAMABwAMABIAGQAhACoAMwA9AEgAVABgAG0AewCJAJkAqQC5AMsA3QDwAQUBGgEwAUcBXwF5AZQBsAHOAe0CDwIzAloCgwKyAuUDHwNfA6QD7AQ2BIQE1QUpBYEF3AY6BpsHAAdoB9UIRQi4CS8JqgopCqwLNAu/DFAM4w14DgkOlQ8hD7AQQxDbEXcSFhK3E1YT7RR9FQoVmBYtFsoXbxgXGMAZaRoUGsAbbxwkHNwdmR5YHxgf2SCdIWQiMCMAI9QkqyWEJlwnNCgNKOopzCqzK58sjy2DLnwvdDBjMUAyDDLOM4o0SzUXNfE22TfHOLY5ojqMO3o8dj2JPrg/90EzQmRDi0SmRbZGu0e7SL1JyUrhTAJNKk5WT4VQt1HsUyRUX1WdVt5YIllqWrZcB11XXppfxWDRYcJiqWOIZGllUmZIZ1logmnAaw1sYm28bxpwenHdc0J0qXYPd3B4y3ohe3Z80H41f6SBG4KUhAqFe4bsiGGJ4ot6jTCPApDdkrGUdpY0l/KZsZt1nTqe+qCmojKjnaTnpienaKiwqhernK09ru2wmbI5s861Ybb7uKK6UbwAvam/TMDxwp/EYsY6yCHKBMvNzXbPBtCK0gzTotVf103ZbNun3efgH+JQ5IHmvukX65DuJvDN85T2jPlJ+zL8nv3k/vH//wAAAAEABAAJABAAGAAhACsANgBDAFAAXgBtAH0AjwChALQAyADeAPQBDAEmAUABXQF7AZsBvQHhAgkCMwJhApUC0AMVA2UDvQQcBIAE6gVZBc0GQwa9Bz0HwQhMCN0JcwoPCrALVgwDDLcNcQ4xDvgPxRCZEXUSWRNJFEoVURZKFzcYKRk1Gl8beRx0HWIeVB9OIE0hTSJMI00kUiVfJnMnjSiqKcgq6SwNLTcuZi+aMNYyGjNkNK81+zdQOM06iTxZPgU/kED8QktDg0SmRbdGvEe+SM5J+0tLTLZOLk+sUS5StlRDVdZXbVkKWqxcVl4RYAtiX2RbZeRnO2iLaeZrUmzMbk1v0nFbcuh0e3Yed955xnvAfZ1/VYD6gqGEVoYfh/CJvYuMjWaPR5EZksuUZpX2l4OZEZqinDadzZ9moQGinKQ4pdWndakbqsisf65HsC+yRrR/tqK4j7pZvBe917+bwVnDB8SlxjTHu8lFytfMeM4v0APR8NPo1dHXkdkn2p3b/t1F3orfy+EP4lXjoOTp5jHna+ig6cjq6uwF7RzuMO9E8FfxYfJk81D0IvT19Y32HPaq9zn3mvf5+Ff4tvkW+XL5tvn7+kD6hPrJ+w77U/uX+9D8CPxA/Hj8sfzp/SH9Wf2S/cr9/f4x/mT+l/7L/v7/Mf9l/5j/zP//AABzZjMyAAAAAAABDEIAAAXe///zJgAAB5IAAP2R///7ov///aMAAAPcAADAbG1tb2QAAAAAAAAGEAAAnPAAAAAAy7j6gAAAAAAAAAAAAAAAAAAAAAD/wAARCAA0ADQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9sAQwACAgICAgIDAgIDBAMDAwQFBAQEBAUHBQUFBQUHCAcHBwcHBwgICAgICAgICgoKCgoKCwsLCwsNDQ0NDQ0NDQ0N/9sAQwECAgIDAwMGAwMGDQkHCQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0N/90ABAAE/9oADAMBAAIRAxEAPwDHvJdaW1is4541REbcI1B+zrjGRkdWwp3Ad8VkavqEVl4H1uyuoFiln0mO3ZpMfaHIRpNzbfuFiwPOCThetdbeypc6dLFMTFMUZCJN6vLFICwAEYwhiAHIJwMDOTxQ8TwRX2gXmnPNBHJJcz3IPkLbRb0kXyMK5L70EanBOCCW61y2jBaHn1KcadNqmv6/Mm1lPCcnhBdEj04f2tJeW12mqQnyvJSJQdkaDIZ1Y4bsBkHqRWHpuleJ7OC7TQzaMZCZ5BbwNbrcAnfs8sF49yA7uNu7POFXNU9MbxDrMEP2ywS1ggMbSuzxiN85BCyl8qxH3uDkYxXY3F1pehW8TeJXMWmrcGbyLVwbm4Zv3YSMAYJYYBJBAPOPTOEp35ZHNSUlO79043R/FOk6to6XeuaXqV7aafq9qyzW1wlsunSEiNm8udQs1uVz5zru2qDsy4Felx6pbw2F/bMzRvPd/KsylXljSfCKdo27AjApkAsMbRnivOdL8QR2uqOLfSLqGPUZNsf9oOVaNdwKpHsXYgHTg5cnJ9R08OvaOftGleI4Lq31KVZ3Xz5oAXE0yLCE2H5RAobc5JJypxXTKrFvlsd1OcHrfVljUtKY3kkqXcEHmkuRKvzMSSN3Izg44zg47VQ/sqX/AKCNp/3yP8K6qxh00pIpnmvikrIZ1WVAzLgH+D5uc/N/F1HGKu/Z9M/55z/nN/8AEVi5nTqf/9C5btJiJtSg/dQoXEcYYFGdS2TnhQ2ATnhux7DyD+ztI8Q+J9Wt7yzD3KXjRszu8u1I1jJZVJx1YjaPSveZhJKZWa1nXzkRt6jMTMrgCIgktuVcDA4IHvx5L4Es3jWSe8V7bUb57q5maRcMrTSyOQwODhAFUYJyBmvPm7XaZ4eYTqqfKmWodKgstOcRQgRRMyrGyqAsmfkKIPlBKg/Mct+FJNClv480vX9SSKbTzB9i2MRhbqc7gME7iWVThgMdVzkiruoSy3d3qUcbJcXVtbrcFskxzSsApfjAIHA7HGB0p+naZF4s0y10yyxINVK5vCC06FCBG28DEeyQBhjAUjgcms0n/XmcFBS5+bvsbGu2ltaeII9JuvKu4oWimgvLYPEoiEXORnO/ChSw7/WuL+K9naS+AGnvhAdQg1CX7JJexLcOI3O5UYNy28DlRkgcV6JYXGtaYbbU/FIt7g6LBJbXd5G5a2lIJBJwPkZTyyEZBPORg1z3xCv9A8X6np2mB7S50Jla7uYWga5hjRXRdsiYZ3ON/K4wx5OAaqgpe0jJvY9KK95yWl+n4/16Hovgvw9qlr4X03+2b5LF5rWGaJUsvMEsckakyFFcGEs+4eU3zLjnrXU/2RF/0HP/ACmt/wDF18t67428PT6jJcaB512sxMly0eoi22XLsS0bpKobeilQT07DgVj/APCZL/z6Xf8A4OYv/ia7fYVnqen7SktLo//RWz1XT016bTUa6hjTy4Xd5nYspDeYwJySy7zh/b8a8T8H6hf6RrOreEdfmWO90DbbQTMrMssYYKCW5bM0bCQc4+brX0LbiazljtrO0tLue4t97Q3aiULNAzNJKNrZDbmBIZjgBTgHNeffET4dr4huZ9V8N3l5aXraXbx3EgJW2uIQXEYlIG5fmyquPYEEAVx2g5OMtnb+vzPJxtBzfMkTXVhY21ne3dtfGS7nuFjumC7WDCNRG4w3+r5xjHBGepr3e6l+HGjfDNZdEgNvqOnlYI5pDslh8sl3kUAjfGFR2ywI+YD2r5F0PxFNrGlXVhcqtprNurwSrKNmHTaEckddu35h2IHY13Wt6robxzacs9zd3XlRSNb20aTCWPA3JcABnTz8EEjqMjABzWcoSjLk/r1OOEOWaS7HQ6H4Pu9dsrvxDqYk0aHVr1NRk02yuDJb3e9UbzJ0ddqyHAU7P4RjJrR8Sw6V4a0PUPE8Bi01mQwXL22EuTHLwPkVec9c5NekQz+fp9hb6s0UFw8Eby/Z1xD5uPmVFycc8KMnB718+/Gm+8SDw2NP0DSLjUrfVvtMt5dWTAeVGFWICME7iSNyggEA988UqTnVqcl9Pu/M9Or7sPcRxXh3RfA9xpFvezfFtNJ+1r562utWcRvEV+hYTNGwB642464rb/sLwD/0W3Rv/AK1/wDj1dpB4h8O/Y7W0u/EGleFJLSFYfsOqwrc3DLy6y+Y2CVKsFUf7NP/ALe8K/8ARRfDP/gFH/jXqPmeqT/D/wCRNVZaf5/5n//S3dLs0nSxt1doYmhuRsiwoATeABwSBxzjrXP6hqV7ZavHYQynyBCy7OACA+4BsYzgjIzwMmur0P72n/8AXG8/nJXDa3/yMa/9c2/ma8uexw19Fp3Oa+JXg3w6PBc/jH7KRqbwvLI6yOqyFcgB1VhkYAHqR1NdEvw98JaZoljp1jYrAZ4INQa4hPk3HnzRKSRJFsOFyQvfHUmpviX/AMkil/69Jf5muvvv+PXS/wDsF2X/AKJSunnl7KOvU5bLnt6HMeB9ZvbHxJp3he8Kanb3guGM94ubiNreT920bxeXgj3Bz3zSeLBFffHPw7p7xiOCyV5YkjZ1HmLG7bj82D8zFsfdzg4yBjL8Nf8AJSdC/wB2/wD/AEMVp6//AMnAaR/1yl/9EmtFFKUmjeP2fVfkVfE3iW/0XVGtbeO3lV98paeJXYF5H4B/ujoBXPf8J5q//PvZf+A60vj7/kO/9sv/AGd64mqsjqbP/9k=", dC = {
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
    thumbnail: Mg,
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
    thumbnail: Rg
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
    thumbnail: Tg
  }
}, rs = (A) => (A || "").match(/^(?:base|overlay|google(?:_(?:roadmap|satellite|hybrid|terrain))?|mapbox|maplibre|osm)$/);
async function mC(A, t) {
  typeof A == "string" && (A = { ...dC[A] }), A = fe(Object.assign(A, t));
  const e = A.label || A.year;
  if (e !== void 0 && (A.label = e), rs(A.maptype)) {
    const g = A.maptype === "base" ? BA : A.maptype === "overlay" ? Kn : A.maptype === "mapbox" ? Vn : A.maptype === "maplibre" ? _n : Ui;
    g.isBasemap() ? (A.homePosition = A.homePos, A.mercZoom = A.defZoom) : (A.homePosition || (A.homePosition = A.homePos), A.mercZoom || (A.mercZoom = A.defZoom)), delete A.homePos, delete A.defZoom, A.zoomRestriction && (A.maxZoom = A.maxZoom || A.mercMaxZoom, A.minZoom = A.minZoom || A.mercMinZoom), A.zoomRestriction = A.mercMaxZoom = A.mercMinZoom = void 0, A.imageExtension || (A.imageExtension = "jpg"), ki(A.maptype) ? (delete A.url, delete A.urls) : A.mapID && !A.url && !A.urls && (A.url = A.tms ? `tiles/${A.mapID}/{z}/{x}/{-y}.${A.imageExtension}` : `tiles/${A.mapID}/{z}/{x}/{y}.${A.imageExtension}`), A.weiwudi = await bi(A), A.weiwudi && (A.url = A.weiwudi.url, delete A.urls);
    const o = await g.createAsync(A);
    return await o.initialWait, o;
  } else if (A.noload)
    return A.mercMaxZoom = A.mercMinZoom = void 0, new Jn(A);
  const n = A.settingFile || `maps/${A.mapID}.json`, i = await fetch(n);
  if (!i.ok)
    throw new Error("Fail to load map json");
  const r = await i.json();
  if (A = fe(Object.assign(r, A)), A.label = A.label || r.year, A.maptype || (A.maptype = "maplat"), rs(A.maptype)) {
    const g = A.maptype === "base" ? BA : A.maptype === "overlay" ? Kn : A.maptype === "mapbox" ? Vn : A.maptype === "maplibre" ? _n : Ui;
    g.isBasemap() ? (A.homePosition = A.homePos, A.mercZoom = A.defZoom) : (A.homePosition || (A.homePosition = A.homePos), A.mercZoom || (A.mercZoom = A.defZoom)), delete A.homePos, delete A.defZoom, A.zoomRestriction && (A.maxZoom = A.maxZoom || A.mercMaxZoom, A.minZoom = A.minZoom || A.mercMinZoom), A.zoomRestriction = A.mercMaxZoom = A.mercMinZoom = void 0, A.imageExtension || (A.imageExtension = "jpg"), ki(A.maptype) ? (delete A.url, delete A.urls) : A.mapID && !A.url && !A.urls && (A.url = A.tms ? `tiles/${A.mapID}/{z}/{x}/{-y}.${A.imageExtension}` : `tiles/${A.mapID}/{z}/{x}/{y}.${A.imageExtension}`), A.weiwudi = await bi(A), A.weiwudi && (A.url = A.weiwudi.url, delete A.urls);
    const o = await g.createAsync(A);
    try {
      return await o.initialWait, o;
    } catch {
      return o;
    }
  }
  if (delete A.homePos, delete A.defZoom, A.imageExtension || (A.imageExtension = "jpg"), A.mapID && !A.url && !A.urls && (A.url = `tiles/${A.mapID}/{z}/{x}/{y}.${A.imageExtension}`), !A.compiled || !A.compiled.wh)
    throw console.error(
      `[Maplat] Missing compiled.wh for mapID=${A.mapID}. Check map setting file: ${n}`
    ), new Error(`Map ${A.mapID} is missing compiled data.`);
  A.width = A.width || A.compiled.wh[0], A.height = A.height || A.compiled.wh[1], A.weiwudi = await bi(A), A.weiwudi && (A.url = A.weiwudi.url, delete A.urls);
  const s = await Jn.createAsync(A);
  return await s.initialWait, await new Promise((g) => {
    s.setupMapParameter(() => g());
  }), s;
}
async function bi(A) {
  const t = {};
  if (A.maptype === "mapbox" || A.maptype === "maplibre" || A.maptype === "google" || !A.enableCache) return;
  A.maptype === "base" || A.maptype === "overlay" ? t.type = "wmts" : t.type = "xyz", t.url = A.urls ? A.urls : A.url, t.width = A.width, t.height = A.height, t.maxZoom = A.maxZoom, t.minZoom = A.minZoom, A.cacheTtl !== void 0 && (t.cacheTtl = A.cacheTtl);
  const e = A.envelopeLngLats;
  if (e) {
    const i = e.reduce(
      (r, s) => (r[0] = r[0] > s[0] ? s[0] : r[0], r[1] = r[1] < s[0] ? s[0] : r[1], r[2] = r[2] > s[1] ? s[1] : r[2], r[3] = r[3] < s[1] ? s[1] : r[3], r),
      [1 / 0, -1 / 0, 1 / 0, -1 / 0]
    );
    ["minLng", "maxLng", "minLat", "maxLat"].map((r, s) => {
      t[r] = i[s];
    });
  }
  let n;
  try {
    n = await ve.registerMap(A.mapID, t);
  } catch {
  }
  return n;
}
function Ei(A, t) {
  return A + (Math.random() - 0.5) * t;
}
function Wi(A, t) {
  if (A instanceof Array)
    return A.map((n) => Wi(n, t));
  const e = Math.pow(10, t);
  return Math.round(A * e) / e;
}
var KA = { exports: {} }, vi, ss;
function Sg() {
  if (ss) return vi;
  ss = 1;
  var A = /<%=([\s\S]+?)%>/g;
  return vi = A, vi;
}
var Mi, gs;
function pC() {
  if (gs) return Mi;
  gs = 1;
  var A = Sg(), t = "[object Null]", e = "[object Symbol]", n = "[object Undefined]", i = /[&<>"']/g, r = RegExp(i.source), s = /<%-([\s\S]+?)%>/g, g = /<%([\s\S]+?)%>/g, o = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }, a = typeof globalThis == "object" && globalThis && globalThis.Object === Object && globalThis, I = typeof self == "object" && self && self.Object === Object && self, c = a || I || Function("return this")();
  function h(H, Rt) {
    for (var bt = -1, Ie = H == null ? 0 : H.length, ne = Array(Ie); ++bt < Ie; )
      ne[bt] = Rt(H[bt], bt, H);
    return ne;
  }
  function m(H) {
    return function(Rt) {
      return H?.[Rt];
    };
  }
  var b = m(o), v = Object.prototype, T = v.hasOwnProperty, O = v.toString, Z = c.Symbol, Q = Z ? Z.toStringTag : void 0, U = Z ? Z.prototype : void 0, Y = U ? U.toString : void 0, nt = {
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
      _: { escape: ae }
    }
  };
  function tt(H) {
    return H == null ? H === void 0 ? n : t : Q && Q in Object(H) ? pt(H) : yt(H);
  }
  function _(H) {
    if (typeof H == "string")
      return H;
    if (lt(H))
      return h(H, _) + "";
    if (wt(H))
      return Y ? Y.call(H) : "";
    var Rt = H + "";
    return Rt == "0" && 1 / H == -1 / 0 ? "-0" : Rt;
  }
  function pt(H) {
    var Rt = T.call(H, Q), bt = H[Q];
    try {
      H[Q] = void 0;
      var Ie = !0;
    } catch {
    }
    var ne = O.call(H);
    return Ie && (Rt ? H[Q] = bt : delete H[Q]), ne;
  }
  function yt(H) {
    return O.call(H);
  }
  var lt = Array.isArray;
  function dt(H) {
    return H != null && typeof H == "object";
  }
  function wt(H) {
    return typeof H == "symbol" || dt(H) && tt(H) == e;
  }
  function Zt(H) {
    return H == null ? "" : _(H);
  }
  function ae(H) {
    return H = Zt(H), H && r.test(H) ? H.replace(i, b) : H;
  }
  return Mi = nt, Mi;
}
KA.exports;
var os;
function yC() {
  return os || (os = 1, (function(A, t) {
    var e = Sg(), n = pC(), i = "Invalid `variable` option passed into `_.template`", r = "Invalid `imports` option passed into `_.template`", s = 800, g = 16, o = 9007199254740991, a = "[object Arguments]", I = "[object Array]", c = "[object AsyncFunction]", h = "[object Boolean]", m = "[object Date]", b = "[object DOMException]", v = "[object Error]", T = "[object Function]", O = "[object GeneratorFunction]", Z = "[object Map]", Q = "[object Number]", U = "[object Null]", Y = "[object Object]", nt = "[object Proxy]", tt = "[object RegExp]", _ = "[object Set]", pt = "[object String]", yt = "[object Symbol]", lt = "[object Undefined]", dt = "[object WeakMap]", wt = "[object ArrayBuffer]", Zt = "[object DataView]", ae = "[object Float32Array]", H = "[object Float64Array]", Rt = "[object Int8Array]", bt = "[object Int16Array]", Ie = "[object Int32Array]", ne = "[object Uint8Array]", iA = "[object Uint8ClampedArray]", Ct = "[object Uint16Array]", NA = "[object Uint32Array]", Fe = /\b__p \+= '';/g, rA = /\b(__p \+=) '' \+/g, sA = /(__e\(.*?\)|\b__t\)) \+\n'';/g, Ue = /[\\^$.*+?()[\]{}|]/g, gA = /[()=,{}\[\]\/\s]/, oA = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, GA = /^\[object .+?Constructor\]$/, aA = /^(?:0|[1-9]\d*)$/, gt = /($^)/, ze = /['\n\r\u2028\u2029\\]/g, V = {};
    V[ae] = V[H] = V[Rt] = V[bt] = V[Ie] = V[ne] = V[iA] = V[Ct] = V[NA] = !0, V[a] = V[I] = V[wt] = V[h] = V[Zt] = V[m] = V[v] = V[T] = V[Z] = V[Q] = V[Y] = V[tt] = V[_] = V[pt] = V[dt] = !1;
    var We = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    }, ht = typeof globalThis == "object" && globalThis && globalThis.Object === Object && globalThis, me = typeof self == "object" && self && self.Object === Object && self, Se = ht || me || Function("return this")(), Jt = t && !t.nodeType && t, Ce = Jt && !0 && A && !A.nodeType && A, vt = Ce && Ce.exports === Jt, St = vt && ht.process, Pe = (function() {
      try {
        var C = Ce && Ce.require && Ce.require("util").types;
        return C || St && St.binding && St.binding("util");
      } catch {
      }
    })(), Ft = Pe && Pe.isTypedArray;
    function Yt(C, p, E) {
      switch (E.length) {
        case 0:
          return C.call(p);
        case 1:
          return C.call(p, E[0]);
        case 2:
          return C.call(p, E[0], E[1]);
        case 3:
          return C.call(p, E[0], E[1], E[2]);
      }
      return C.apply(p, E);
    }
    function qt(C, p) {
      for (var E = -1, j = C == null ? 0 : C.length; ++E < j && p(C[E], E, C) !== !1; )
        ;
      return C;
    }
    function ce(C, p) {
      for (var E = -1, j = C == null ? 0 : C.length, W = Array(j); ++E < j; )
        W[E] = p(C[E], E, C);
      return W;
    }
    function ie(C, p) {
      for (var E = -1, j = Array(C); ++E < C; )
        j[E] = p(E);
      return j;
    }
    function le(C) {
      return function(p) {
        return C(p);
      };
    }
    function pe(C, p) {
      return ce(p, function(E) {
        return C[E];
      });
    }
    function he(C) {
      return "\\" + We[C];
    }
    function f(C, p) {
      return C?.[p];
    }
    function u(C, p) {
      return function(E) {
        return C(p(E));
      };
    }
    var d = Function.prototype, y = Object.prototype, M = Se["__core-js_shared__"], R = d.toString, S = y.hasOwnProperty, L = (function() {
      var C = /[^.]+$/.exec(M && M.keys && M.keys.IE_PROTO || "");
      return C ? "Symbol(src)_1." + C : "";
    })(), P = y.toString, G = R.call(Object), F = RegExp(
      "^" + R.call(S).replace(Ue, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ), B = vt ? Se.Buffer : void 0, k = Se.Symbol, z = u(Object.getPrototypeOf, Object), K = y.propertyIsEnumerable, N = k ? k.toStringTag : void 0, D = (function() {
      try {
        var C = si(Object, "defineProperty");
        return C({}, "", {}), C;
      } catch {
      }
    })(), x = B ? B.isBuffer : void 0, J = u(Object.keys, Object), et = Math.max, it = Date.now, ot = k ? k.prototype : void 0, $ = ot ? ot.toString : void 0;
    function at(C, p) {
      var E = Qe(C), j = !E && XA(C), W = !E && !j && Ye(C), q = !E && !j && !W && bn(C), ut = E || j || W || q, At = ut ? ie(C.length, String) : [], _t = At.length;
      for (var ct in C)
        S.call(C, ct) && !(ut && // Safari 9 has enumerable `arguments.length` in strict mode.
        (ct == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        W && (ct == "offset" || ct == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        q && (ct == "buffer" || ct == "byteLength" || ct == "byteOffset") || // Skip index properties.
        fn(ct, _t))) && At.push(ct);
      return At;
    }
    function Et(C, p, E) {
      var j = C[p];
      (!(S.call(C, p) && De(j, E)) || E === void 0 && !(p in C)) && Nt(C, p, E);
    }
    function Nt(C, p, E) {
      p == "__proto__" && D ? D(C, p, {
        configurable: !0,
        enumerable: !0,
        value: E,
        writable: !0
      }) : C[p] = E;
    }
    function mt(C) {
      return C == null ? C === void 0 ? lt : U : N && N in Object(C) ? gi(C) : oi(C);
    }
    function Gt(C) {
      return be(C) && mt(C) == a;
    }
    function Ut(C) {
      if (!lA(C) || cA(C))
        return !1;
      var p = pn(C) ? F : GA;
      return p.test(mn(C));
    }
    function st(C) {
      return be(C) && yn(C.length) && !!V[mt(C)];
    }
    function Vt(C) {
      if (!ye(C))
        return J(C);
      var p = [];
      for (var E in Object(C))
        S.call(C, E) && E != "constructor" && p.push(E);
      return p;
    }
    function IA(C, p) {
      return ai(He(C, p, l), C + "");
    }
    var CA = D ? function(C, p) {
      return D(C, "toString", {
        configurable: !0,
        enumerable: !1,
        value: X(p),
        writable: !0
      });
    } : l;
    function xe(C) {
      if (typeof C == "string")
        return C;
      if (Qe(C))
        return ce(C, xe) + "";
      if (Ii(C))
        return $ ? $.call(C) : "";
      var p = C + "";
      return p == "0" && 1 / C == -1 / 0 ? "-0" : p;
    }
    function ln(C, p, E, j) {
      var W = !E;
      E || (E = {});
      for (var q = -1, ut = p.length; ++q < ut; ) {
        var At = p[q], _t = j ? j(E[At], C[At], At, E, C) : void 0;
        _t === void 0 && (_t = C[At]), W ? Nt(E, At, _t) : Et(E, At, _t);
      }
      return E;
    }
    function hn(C) {
      return IA(function(p, E) {
        var j = -1, W = E.length, q = W > 1 ? E[W - 1] : void 0, ut = W > 2 ? E[2] : void 0;
        for (q = C.length > 3 && typeof q == "function" ? (W--, q) : void 0, ut && re(E[0], E[1], ut) && (q = W < 3 ? void 0 : q, W = 1), p = Object(p); ++j < W; ) {
          var At = E[j];
          At && C(p, At, j, q);
        }
        return p;
      });
    }
    function un(C, p, E, j) {
      return C === void 0 || De(C, y[E]) && !S.call(j, E) ? p : C;
    }
    function si(C, p) {
      var E = f(C, p);
      return Ut(E) ? E : void 0;
    }
    function gi(C) {
      var p = S.call(C, N), E = C[N];
      try {
        C[N] = void 0;
        var j = !0;
      } catch {
      }
      var W = P.call(C);
      return j && (p ? C[N] = E : delete C[N]), W;
    }
    function fn(C, p) {
      var E = typeof C;
      return p = p ?? o, !!p && (E == "number" || E != "symbol" && aA.test(C)) && C > -1 && C % 1 == 0 && C < p;
    }
    function re(C, p, E) {
      if (!lA(E))
        return !1;
      var j = typeof p;
      return (j == "number" ? we(E) && fn(p, E.length) : j == "string" && p in E) ? De(E[p], C) : !1;
    }
    function cA(C) {
      return !!L && L in C;
    }
    function ye(C) {
      var p = C && C.constructor, E = typeof p == "function" && p.prototype || y;
      return C === E;
    }
    function oi(C) {
      return P.call(C);
    }
    function He(C, p, E) {
      return p = et(p === void 0 ? C.length - 1 : p, 0), function() {
        for (var j = arguments, W = -1, q = et(j.length - p, 0), ut = Array(q); ++W < q; )
          ut[W] = j[p + W];
        W = -1;
        for (var At = Array(p + 1); ++W < p; )
          At[W] = j[W];
        return At[p] = E(ut), Yt(C, this, At);
      };
    }
    var ai = dn(CA);
    function dn(C) {
      var p = 0, E = 0;
      return function() {
        var j = it(), W = g - (j - E);
        if (E = j, W > 0) {
          if (++p >= s)
            return arguments[0];
        } else
          p = 0;
        return C.apply(void 0, arguments);
      };
    }
    function mn(C) {
      if (C != null) {
        try {
          return R.call(C);
        } catch {
        }
        try {
          return C + "";
        } catch {
        }
      }
      return "";
    }
    function De(C, p) {
      return C === p || C !== C && p !== p;
    }
    var XA = Gt(/* @__PURE__ */ (function() {
      return arguments;
    })()) ? Gt : function(C) {
      return be(C) && S.call(C, "callee") && !K.call(C, "callee");
    }, Qe = Array.isArray;
    function we(C) {
      return C != null && yn(C.length) && !pn(C);
    }
    var Ye = x || w;
    function $t(C) {
      if (!be(C))
        return !1;
      var p = mt(C);
      return p == v || p == b || typeof C.message == "string" && typeof C.name == "string" && !wn(C);
    }
    function pn(C) {
      if (!lA(C))
        return !1;
      var p = mt(C);
      return p == T || p == O || p == c || p == nt;
    }
    function yn(C) {
      return typeof C == "number" && C > -1 && C % 1 == 0 && C <= o;
    }
    function lA(C) {
      var p = typeof C;
      return C != null && (p == "object" || p == "function");
    }
    function be(C) {
      return C != null && typeof C == "object";
    }
    function wn(C) {
      if (!be(C) || mt(C) != Y)
        return !1;
      var p = z(C);
      if (p === null)
        return !0;
      var E = S.call(p, "constructor") && p.constructor;
      return typeof E == "function" && E instanceof E && R.call(E) == G;
    }
    function Ii(C) {
      return typeof C == "symbol" || be(C) && mt(C) == yt;
    }
    var bn = Ft ? le(Ft) : st;
    function Ci(C) {
      return C == null ? "" : xe(C);
    }
    var En = hn(function(C, p, E, j) {
      ln(p, jA(p), C, j);
    });
    function jA(C) {
      return we(C) ? at(C) : Vt(C);
    }
    function hA(C, p, E) {
      var j = n.imports._.templateSettings || n;
      E && re(C, p, E) && (p = void 0), C = Ci(C), p = En({}, p, j, un);
      var W = En({}, p.imports, j.imports, un), q = jA(W), ut = pe(W, q);
      qt(q, function(Rn) {
        if (gA.test(Rn))
          throw new Error(r);
      });
      var At, _t, ct = 0, fr = p.interpolate || gt, Kt = "__p += '", Ng = RegExp(
        (p.escape || gt).source + "|" + fr.source + "|" + (fr === e ? oA : gt).source + "|" + (p.evaluate || gt).source + "|$",
        "g"
      ), Gg = S.call(p, "sourceURL") ? "//# sourceURL=" + (p.sourceURL + "").replace(/\s/g, " ") + `
` : "";
      C.replace(Ng, function(Rn, dr, Tn, Xg, mr, pr) {
        return Tn || (Tn = Xg), Kt += C.slice(ct, pr).replace(ze, he), dr && (At = !0, Kt += `' +
__e(` + dr + `) +
'`), mr && (_t = !0, Kt += `';
` + mr + `;
__p += '`), Tn && (Kt += `' +
((__t = (` + Tn + `)) == null ? '' : __t) +
'`), ct = pr + Rn.length, Rn;
      }), Kt += `';
`;
      var vn = S.call(p, "variable") && p.variable;
      if (!vn)
        Kt = `with (obj) {
` + Kt + `
}
`;
      else if (gA.test(vn))
        throw new Error(i);
      Kt = (_t ? Kt.replace(Fe, "") : Kt).replace(rA, "$1").replace(sA, "$1;"), Kt = "function(" + (vn || "obj") + `) {
` + (vn ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (At ? ", __e = _.escape" : "") + (_t ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + Kt + `return __p
}`;
      var Mn = ZA(function() {
        return Function(q, Gg + "return " + Kt).apply(void 0, ut);
      });
      if (Mn.source = Kt, $t(Mn))
        throw Mn;
      return Mn;
    }
    var ZA = IA(function(C, p) {
      try {
        return Yt(C, void 0, p);
      } catch (E) {
        return $t(E) ? E : new Error(E);
      }
    });
    function X(C) {
      return function() {
        return C;
      };
    }
    function l(C) {
      return C;
    }
    function w() {
      return !1;
    }
    A.exports = hA;
  })(KA, KA.exports)), KA.exports;
}
var wC = yC();
const Pg = /* @__PURE__ */ Yg(wC);
function as(A, ...t) {
  const e = fe(Object.assign({}, A));
  if (e.icon) return e;
  const n = t.reduce((i, r) => {
    if (i) return i;
    const s = r.iconTemplate;
    if (s)
      return JSON.parse(Pg(s)(e));
    if (r.icon)
      return {
        icon: r.icon,
        selectedIcon: r.selectedIcon
      };
  }, void 0);
  return n && (e.icon = n.icon, e.selectedIcon = n.selectedIcon), e;
}
function Is(A, ...t) {
  return A = fe(A), A.html ? A : t.reduce((e, n) => {
    if (e) return e;
    const i = n.poiTemplate;
    if (i)
      return A.html = Pg(i)(A), A.poiStyle = A.poiStyle || n.poiStyle, A;
  }, void 0) || A;
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
}, bC = {
  ERROR: "error"
};
class EC extends Re {
  code;
  message;
  constructor(t) {
    super(bC.ERROR), this.code = t.code, this.message = t.message;
  }
}
class vC extends OA {
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
      longitude: Ei(this.home_position_[0], 0.05),
      latitude: Ei(this.home_position_[1], 0.05),
      accuracy: Ei(15, 10)
    };
    this.positionChange_({ coords: t });
  }
  positionChange_(t) {
    const e = t.coords;
    this.set(Dt.ACCURACY, e.accuracy), this.set(
      Dt.ALTITUDE,
      e.altitude === null ? void 0 : e.altitude
    ), this.set(
      Dt.ALTITUDE_ACCURACY,
      e.altitudeAccuracy === null ? void 0 : e.altitudeAccuracy
    ), this.set(
      Dt.HEADING,
      e.heading === null ? void 0 : TA(e.heading)
    ), this.set(Dt.POSITION, [e.longitude, e.latitude]), this.set(Dt.SPEED, e.speed === null ? void 0 : e.speed), this.changed();
  }
  timerPositionError_() {
    const t = Math.floor(Math.random() * 3) + 1, e = {
      code: t,
      message: t === 1 ? "User denied Geolocation" : t === 2 ? "Position unavailable" : "Timeout expired"
    };
    this.positionError_(e);
  }
  positionError_(t) {
    const e = new EC(t);
    this.dispatchEvent(e);
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
const xg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjcyNTIxMjZFMDJBMTExRTBCOTNGRTVBRkM1QzM1Qjc5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjcyNTIxMjZGMDJBMTExRTBCOTNGRTVBRkM1QzM1Qjc5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzI1MjEyNkMwMkExMTFFMEI5M0ZFNUFGQzVDMzVCNzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzI1MjEyNkQwMkExMTFFMEI5M0ZFNUFGQzVDMzVCNzkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4RaveOAAAB1UlEQVR42qzUTyikcRzH8d+OsUNbSOTvgW2LREqjHKSk9FjZxAGXlXJQDsqNokRzcebiRC5mT8tllBE7LlzYKBHFJpKMkD+7hvH+6ftMT4M0Y3/1uswzz+d5nu/3+/t9CAaD6n8uu/L5lHK5XroWjwI4kYWP8GMdv3H47A6nk8CDA6U8nvBLX/Ed+TjDEe7lAS24wE+M4zR0180NgXa7NSgOvajHKvqwZglMxBfUoBmVlv/wTXxU0O1WuoqIgQvLaIJDfn9NISbhRd7Tb4ahbJa3a0QthjCFv2/UfwNduJKv0jUOBSajDb8wE0FTdf1GUAzDGliOdExEMSleedsGxJiBZdiVC5GuABbxGZm2p1lUKg1/dOOjnGf9IglIsUkxY3H+jg1yIc136MBb6WjqOwLNe6904AP2kSuDG80qkW15YjZlCdkojSLsEyqwiWMzcAVbaJV6RrK+IQc/dB3NwGuMohAdEYQVoROz8FkHW68FCW1Hv4zS68eeUnWyS/YwLL1Q9rA/jsn4dEtd5mRo9WlzJ03Tda6S7TaPQWmIPCkQCH+6Ww5RfR5WowmX+IckOca2MYBp2SmW8zCb5hpGeKjuWA8yZEulSbP8sqN2JPjZif0owACin4C7wCjG6AAAAABJRU5ErkJggg==", Dg = "data:image/png;base64,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";
function Cs(A, t) {
  (t == null || t > A.length) && (t = A.length);
  for (var e = 0, n = Array(t); e < t; e++) n[e] = A[e];
  return n;
}
function MC(A) {
  if (Array.isArray(A)) return A;
}
function RC(A, t) {
  var e = A == null ? null : typeof Symbol < "u" && A[Symbol.iterator] || A["@@iterator"];
  if (e != null) {
    var n, i, r, s, g = [], o = !0, a = !1;
    try {
      if (r = (e = e.call(A)).next, t !== 0) for (; !(o = (n = r.call(e)).done) && (g.push(n.value), g.length !== t); o = !0) ;
    } catch (I) {
      a = !0, i = I;
    } finally {
      try {
        if (!o && e.return != null && (s = e.return(), Object(s) !== s)) return;
      } finally {
        if (a) throw i;
      }
    }
    return g;
  }
}
function TC() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function SC(A, t) {
  return MC(A) || RC(A, t) || PC(A, t) || TC();
}
function PC(A, t) {
  if (A) {
    if (typeof A == "string") return Cs(A, t);
    var e = {}.toString.call(A).slice(8, -1);
    return e === "Object" && A.constructor && (e = A.constructor.name), e === "Map" || e === "Set" ? Array.from(A) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Cs(A, t) : void 0;
  }
}
const Bg = Object.entries, cs = Object.setPrototypeOf, xC = Object.isFrozen, DC = Object.getPrototypeOf, BC = Object.getOwnPropertyDescriptor;
let Lt = Object.freeze, kt = Object.seal, EA = Object.create, Og = typeof Reflect < "u" && Reflect, Hi = Og.apply, Qi = Og.construct;
Lt || (Lt = function(t) {
  return t;
});
kt || (kt = function(t) {
  return t;
});
Hi || (Hi = function(t, e) {
  for (var n = arguments.length, i = new Array(n > 2 ? n - 2 : 0), r = 2; r < n; r++)
    i[r - 2] = arguments[r];
  return t.apply(e, i);
});
Qi || (Qi = function(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
    n[i - 1] = arguments[i];
  return new t(...n);
});
const yA = Mt(Array.prototype.forEach), OC = Mt(Array.prototype.lastIndexOf), ls = Mt(Array.prototype.pop), wA = Mt(Array.prototype.push), LC = Mt(Array.prototype.splice), Xe = Array.isArray, JA = Mt(String.prototype.toLowerCase), Ri = Mt(String.prototype.toString), hs = Mt(String.prototype.match), WA = Mt(String.prototype.replace), us = Mt(String.prototype.indexOf), kC = Mt(String.prototype.trim), NC = Mt(Number.prototype.toString), GC = Mt(Boolean.prototype.toString), fs = typeof BigInt > "u" ? null : Mt(BigInt.prototype.toString), ds = typeof Symbol > "u" ? null : Mt(Symbol.prototype.toString), xt = Mt(Object.prototype.hasOwnProperty), HA = Mt(Object.prototype.toString), Pt = Mt(RegExp.prototype.test), Ke = XC(TypeError);
function Mt(A) {
  return function(t) {
    t instanceof RegExp && (t.lastIndex = 0);
    for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), i = 1; i < e; i++)
      n[i - 1] = arguments[i];
    return Hi(A, t, n);
  };
}
function XC(A) {
  return function() {
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
      e[n] = arguments[n];
    return Qi(A, e);
  };
}
function rt(A, t) {
  let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : JA;
  if (cs && cs(A, null), !Xe(t))
    return A;
  let n = t.length;
  for (; n--; ) {
    let i = t[n];
    if (typeof i == "string") {
      const r = e(i);
      r !== i && (xC(t) || (t[n] = r), i = r);
    }
    A[i] = !0;
  }
  return A;
}
function jC(A) {
  for (let t = 0; t < A.length; t++)
    xt(A, t) || (A[t] = null);
  return A;
}
function jt(A) {
  const t = EA(null);
  for (const n of Bg(A)) {
    var e = SC(n, 2);
    const i = e[0], r = e[1];
    xt(A, i) && (Xe(r) ? t[i] = jC(r) : r && typeof r == "object" && r.constructor === Object ? t[i] = jt(r) : t[i] = r);
  }
  return t;
}
function ZC(A) {
  switch (typeof A) {
    case "string":
      return A;
    case "number":
      return NC(A);
    case "boolean":
      return GC(A);
    case "bigint":
      return fs ? fs(A) : "0";
    case "symbol":
      return ds ? ds(A) : "Symbol()";
    case "undefined":
      return HA(A);
    case "function":
    case "object": {
      if (A === null)
        return HA(A);
      const t = A, e = ge(t, "toString");
      if (typeof e == "function") {
        const n = e(t);
        return typeof n == "string" ? n : HA(n);
      }
      return HA(A);
    }
    default:
      return HA(A);
  }
}
function ge(A, t) {
  for (; A !== null; ) {
    const n = BC(A, t);
    if (n) {
      if (n.get)
        return Mt(n.get);
      if (typeof n.value == "function")
        return Mt(n.value);
    }
    A = DC(A);
  }
  function e() {
    return null;
  }
  return e;
}
function FC(A) {
  try {
    return Pt(A, ""), !0;
  } catch {
    return !1;
  }
}
const ms = Lt(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), Ti = Lt(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), Si = Lt(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), UC = Lt(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Pi = Lt(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), zC = Lt(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), ps = Lt(["#text"]), ys = Lt(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "command", "commandfor", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns"]), xi = Lt(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dominant-baseline", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-orientation", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), ws = Lt(["accent", "accentunder", "align", "bevelled", "close", "columnalign", "columnlines", "columnspacing", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lquote", "lspace", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Zn = Lt(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), WC = kt(/{{[\w\W]*|^[\w\W]*}}/g), HC = kt(/<%[\w\W]*|^[\w\W]*%>/g), QC = kt(/\${[\w\W]*/g), YC = kt(/^data-[\-\w.\u00B7-\uFFFF]+$/), VC = kt(/^aria-[\-\w]+$/), bs = kt(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), _C = kt(/^(?:\w+script|data):/i), KC = kt(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), JC = kt(/^html$/i), qC = kt(/^[a-z][.\w]*(-[.\w]+)+$/i), Es = kt(/<[/\w!]/g), vs = kt(/<[/\w]/g), $C = kt(/<\/no(script|embed|frames)/i), tc = kt(/\/>/i), te = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  // Deprecated
  entityNode: 6,
  // Deprecated
  processingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12
  // Deprecated
}, ec = function() {
  return typeof window > "u" ? null : window;
}, Ac = function(t, e) {
  if (typeof t != "object" || typeof t.createPolicy != "function")
    return null;
  let n = null;
  const i = "data-tt-policy-suffix";
  e && e.hasAttribute(i) && (n = e.getAttribute(i));
  const r = "dompurify" + (n ? "#" + n : "");
  try {
    return t.createPolicy(r, {
      createHTML(s) {
        return s;
      },
      createScriptURL(s) {
        return s;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + r + " could not be created."), null;
  }
}, Ms = function() {
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
}, Le = function(t, e, n, i) {
  return xt(t, e) && Xe(t[e]) ? rt(i.base ? jt(i.base) : {}, t[e], i.transform) : n;
};
function Lg() {
  let A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ec();
  const t = (X) => Lg(X);
  if (t.version = "3.4.13", t.removed = [], !A || !A.document || A.document.nodeType !== te.document || !A.Element)
    return t.isSupported = !1, t;
  let e = A.document;
  const n = e, i = n.currentScript;
  A.DocumentFragment;
  const r = A.HTMLTemplateElement, s = A.Node, g = A.Element, o = A.NodeFilter, a = A.NamedNodeMap;
  a === void 0 && (A.NamedNodeMap || A.MozNamedAttrMap), A.HTMLFormElement;
  const I = A.DOMParser, c = A.trustedTypes, h = g.prototype, m = ge(h, "cloneNode"), b = ge(h, "remove"), v = ge(h, "nextSibling"), T = ge(h, "childNodes"), O = ge(h, "parentNode"), Z = ge(h, "shadowRoot"), Q = ge(h, "attributes"), U = s && s.prototype ? ge(s.prototype, "nodeType") : null, Y = s && s.prototype ? ge(s.prototype, "nodeName") : null, nt = s && s.prototype ? ge(s.prototype, "ownerDocument") : null;
  if (typeof r == "function") {
    const X = e.createElement("template");
    X.content && X.content.ownerDocument && (e = X.content.ownerDocument);
  }
  let tt, _ = "", pt, yt = !1, lt = 0;
  const dt = function() {
    if (lt > 0)
      throw Ke('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, wt = function(l) {
    dt(), lt++;
    try {
      return tt.createHTML(l);
    } finally {
      lt--;
    }
  }, Zt = function(l) {
    dt(), lt++;
    try {
      return tt.createScriptURL(l);
    } finally {
      lt--;
    }
  }, ae = function() {
    return yt || (pt = Ac(c, i), yt = !0), pt;
  }, H = e, Rt = H.implementation, bt = H.createNodeIterator, Ie = H.createDocumentFragment, ne = H.getElementsByTagName, iA = n.importNode;
  let Ct = Ms();
  t.isSupported = typeof Bg == "function" && typeof O == "function" && Rt && Rt.createHTMLDocument !== void 0;
  const NA = WC, Fe = HC, rA = QC, sA = YC, Ue = VC, gA = _C, oA = KC, GA = qC;
  let aA = bs, gt = null;
  const ze = rt({}, [...ms, ...Ti, ...Si, ...Pi, ...ps]);
  let V = null;
  const We = rt({}, [...ys, ...xi, ...ws, ...Zn]);
  let ht = Object.seal(EA(null, {
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
  })), me = null, Se = null;
  const Jt = Object.seal(EA(null, {
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
  let Ce = !0, vt = !0, St = !1, Pe = !0, Ft = !1, Yt = !0, qt = !1, ce = !1, ie = null, le = null, pe = !1, he = !1, f = !1, u = !1, d = !0, y = !1;
  const M = "user-content-";
  let R = !0, S = !1, L = {}, P = null;
  const G = rt({}, [
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
    // <selectedcontent> mirrors the selected <option>'s subtree, cloned by
    // the UA (customizable <select>) — including any on* handlers — and the
    // engine re-mirrors synchronously whenever a removal changes which
    // option/selectedcontent is current, even inside DOMPurify's inert
    // DOMParser document. Hoisting its children on removal re-inserts a fresh
    // mirror target ahead of the walk, which the engine refills, looping
    // forever (DoS) and amplifying output. Dropping its content on removal
    // (rather than hoisting) breaks that cascade; the content is a duplicate
    // of the option, which is sanitized on its own. See campaign-3 F1/F6.
    "selectedcontent",
    "style",
    "svg",
    "template",
    "thead",
    "title",
    "video",
    "xmp"
  ]);
  let F = null;
  const B = rt({}, ["audio", "video", "img", "source", "image", "track"]);
  let k = null;
  const z = rt({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), K = "http://www.w3.org/1998/Math/MathML", N = "http://www.w3.org/2000/svg", D = "http://www.w3.org/1999/xhtml";
  let x = D, J = !1, et = null;
  const it = rt({}, [K, N, D], Ri), ot = Lt(["mi", "mo", "mn", "ms", "mtext"]);
  let $ = rt({}, ot);
  const at = Lt(["annotation-xml"]);
  let Et = rt({}, at);
  const Nt = rt({}, ["title", "style", "font", "a", "script"]);
  let mt = null;
  const Gt = ["application/xhtml+xml", "text/html"], Ut = "text/html";
  let st = null, Vt = null;
  const IA = e.createElement("form"), CA = function(l) {
    return l instanceof RegExp || l instanceof Function;
  }, xe = function() {
    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (Vt && Vt === l)
      return;
    (!l || typeof l != "object") && (l = {}), l = jt(l), mt = // eslint-disable-next-line unicorn/prefer-includes
    Gt.indexOf(l.PARSER_MEDIA_TYPE) === -1 ? Ut : l.PARSER_MEDIA_TYPE, st = mt === "application/xhtml+xml" ? Ri : JA, gt = Le(l, "ALLOWED_TAGS", ze, {
      transform: st
    }), V = Le(l, "ALLOWED_ATTR", We, {
      transform: st
    }), et = Le(l, "ALLOWED_NAMESPACES", it, {
      transform: Ri
    }), k = Le(l, "ADD_URI_SAFE_ATTR", z, {
      transform: st,
      base: z
    }), F = Le(l, "ADD_DATA_URI_TAGS", B, {
      transform: st,
      base: B
    }), P = Le(l, "FORBID_CONTENTS", G, {
      transform: st
    }), me = Le(l, "FORBID_TAGS", jt({}), {
      transform: st
    }), Se = Le(l, "FORBID_ATTR", jt({}), {
      transform: st
    }), L = xt(l, "USE_PROFILES") ? l.USE_PROFILES && typeof l.USE_PROFILES == "object" ? jt(l.USE_PROFILES) : l.USE_PROFILES : !1, Ce = l.ALLOW_ARIA_ATTR !== !1, vt = l.ALLOW_DATA_ATTR !== !1, St = l.ALLOW_UNKNOWN_PROTOCOLS || !1, Pe = l.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Ft = l.SAFE_FOR_TEMPLATES || !1, Yt = l.SAFE_FOR_XML !== !1, qt = l.WHOLE_DOCUMENT || !1, he = l.RETURN_DOM || !1, f = l.RETURN_DOM_FRAGMENT || !1, u = l.RETURN_TRUSTED_TYPE || !1, pe = l.FORCE_BODY || !1, d = l.SANITIZE_DOM !== !1, y = l.SANITIZE_NAMED_PROPS || !1, R = l.KEEP_CONTENT !== !1, S = l.IN_PLACE || !1, aA = FC(l.ALLOWED_URI_REGEXP) ? l.ALLOWED_URI_REGEXP : bs, x = typeof l.NAMESPACE == "string" ? l.NAMESPACE : D, $ = xt(l, "MATHML_TEXT_INTEGRATION_POINTS") && l.MATHML_TEXT_INTEGRATION_POINTS && typeof l.MATHML_TEXT_INTEGRATION_POINTS == "object" ? jt(l.MATHML_TEXT_INTEGRATION_POINTS) : rt({}, ot), Et = xt(l, "HTML_INTEGRATION_POINTS") && l.HTML_INTEGRATION_POINTS && typeof l.HTML_INTEGRATION_POINTS == "object" ? jt(l.HTML_INTEGRATION_POINTS) : rt({}, at);
    const w = xt(l, "CUSTOM_ELEMENT_HANDLING") && l.CUSTOM_ELEMENT_HANDLING && typeof l.CUSTOM_ELEMENT_HANDLING == "object" ? jt(l.CUSTOM_ELEMENT_HANDLING) : EA(null);
    if (ht = EA(null), xt(w, "tagNameCheck") && CA(w.tagNameCheck) && (ht.tagNameCheck = w.tagNameCheck), xt(w, "attributeNameCheck") && CA(w.attributeNameCheck) && (ht.attributeNameCheck = w.attributeNameCheck), xt(w, "allowCustomizedBuiltInElements") && typeof w.allowCustomizedBuiltInElements == "boolean" && (ht.allowCustomizedBuiltInElements = w.allowCustomizedBuiltInElements), kt(ht), Ft && (vt = !1), f && (he = !0), L && (gt = rt({}, ps), V = EA(null), L.html === !0 && (rt(gt, ms), rt(V, ys)), L.svg === !0 && (rt(gt, Ti), rt(V, xi), rt(V, Zn)), L.svgFilters === !0 && (rt(gt, Si), rt(V, xi), rt(V, Zn)), L.mathMl === !0 && (rt(gt, Pi), rt(V, ws), rt(V, Zn))), Jt.tagCheck = null, Jt.attributeCheck = null, xt(l, "ADD_TAGS") && (typeof l.ADD_TAGS == "function" ? Jt.tagCheck = l.ADD_TAGS : Xe(l.ADD_TAGS) && (gt === ze && (gt = jt(gt)), rt(gt, l.ADD_TAGS, st))), xt(l, "ADD_ATTR") && (typeof l.ADD_ATTR == "function" ? Jt.attributeCheck = l.ADD_ATTR : Xe(l.ADD_ATTR) && (V === We && (V = jt(V)), rt(V, l.ADD_ATTR, st))), xt(l, "ADD_URI_SAFE_ATTR") && Xe(l.ADD_URI_SAFE_ATTR) && rt(k, l.ADD_URI_SAFE_ATTR, st), xt(l, "FORBID_CONTENTS") && Xe(l.FORBID_CONTENTS) && (P === G && (P = jt(P)), rt(P, l.FORBID_CONTENTS, st)), xt(l, "ADD_FORBID_CONTENTS") && Xe(l.ADD_FORBID_CONTENTS) && (P === G && (P = jt(P)), rt(P, l.ADD_FORBID_CONTENTS, st)), R && (gt["#text"] = !0), qt && rt(gt, ["html", "head", "body"]), gt.table && (rt(gt, ["tbody"]), delete me.tbody), l.TRUSTED_TYPES_POLICY) {
      if (typeof l.TRUSTED_TYPES_POLICY.createHTML != "function")
        throw Ke('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof l.TRUSTED_TYPES_POLICY.createScriptURL != "function")
        throw Ke('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const C = tt;
      tt = l.TRUSTED_TYPES_POLICY;
      try {
        _ = wt("");
      } catch (p) {
        throw tt = C, p;
      }
    } else l.TRUSTED_TYPES_POLICY === null ? (tt = void 0, _ = "") : (tt === void 0 && (tt = ae()), tt && typeof _ == "string" && (_ = wt("")));
    Lt && Lt(l), Vt = l;
  }, ln = rt({}, [...Ti, ...Si, ...UC]), hn = rt({}, [...Pi, ...zC]), un = function(l, w, C) {
    return w.namespaceURI === D ? l === "svg" : w.namespaceURI === K ? l === "svg" && (C === "annotation-xml" || $[C]) : !!ln[l];
  }, si = function(l, w, C) {
    return w.namespaceURI === D ? l === "math" : w.namespaceURI === N ? l === "math" && Et[C] : !!hn[l];
  }, gi = function(l, w, C) {
    return w.namespaceURI === N && !Et[C] || w.namespaceURI === K && !$[C] ? !1 : !hn[l] && (Nt[l] || !ln[l]);
  }, fn = function(l) {
    let w = O(l);
    (!w || !w.tagName) && (w = {
      namespaceURI: x,
      tagName: "template"
    });
    const C = JA(l.tagName), p = JA(w.tagName);
    return et[l.namespaceURI] ? l.namespaceURI === N ? un(C, w, p) : l.namespaceURI === K ? si(C, w, p) : l.namespaceURI === D ? gi(C, w, p) : !!(mt === "application/xhtml+xml" && et[l.namespaceURI]) : !1;
  }, re = function(l) {
    wA(t.removed, {
      element: l
    });
    try {
      O(l).removeChild(l);
    } catch {
      if (b(l), !O(l))
        throw Ke("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, cA = function(l) {
    He(l);
    const w = T(l);
    if (w) {
      const p = [];
      yA(w, (E) => {
        wA(p, E);
      }), yA(p, (E) => {
        try {
          b(E);
        } catch {
        }
      });
    }
    const C = Q(l);
    if (C)
      for (let p = C.length - 1; p >= 0; --p) {
        const E = C[p], j = E && E.name;
        if (typeof j == "string")
          try {
            l.removeAttribute(j);
          } catch {
          }
      }
  }, ye = function(l, w) {
    try {
      wA(t.removed, {
        attribute: w.getAttributeNode(l),
        from: w
      });
    } catch {
      wA(t.removed, {
        attribute: null,
        from: w
      });
    }
    if (w.removeAttribute(l), l === "is")
      if (he || f)
        try {
          re(w);
        } catch {
        }
      else
        try {
          w.setAttribute(l, "");
        } catch {
        }
  }, oi = function(l) {
    const w = Q(l);
    if (w)
      for (let C = w.length - 1; C >= 0; --C) {
        const p = w[C], E = p && p.name;
        if (!(typeof E != "string" || V[st(E)]))
          try {
            l.removeAttribute(E);
          } catch {
          }
      }
  }, He = function(l) {
    const w = [l];
    for (; w.length > 0; ) {
      const C = w.pop();
      (U ? U(C) : C.nodeType) === te.element && oi(C);
      const E = T(C);
      if (E)
        for (let j = E.length - 1; j >= 0; --j)
          w.push(E[j]);
    }
  }, ai = function(l) {
    if (!Yt)
      return;
    const w = [l];
    for (; w.length > 0; ) {
      const C = w.pop(), p = U ? U(C) : C.nodeType;
      if (p === te.processingInstruction || p === te.comment && Pt(vs, C.data)) {
        try {
          b(C);
        } catch {
        }
        continue;
      }
      if (p === te.element) {
        const j = C, W = st(Y ? Y(C) : C.nodeName);
        try {
          j.hasAttribute && j.hasAttribute("patchsrc") && j.removeAttribute("patchsrc"), j.hasAttribute && j.hasAttribute("for") && W !== "label" && W !== "output" && j.removeAttribute("for");
        } catch {
        }
      }
      const E = T(C);
      if (E)
        for (let j = E.length - 1; j >= 0; --j)
          w.push(E[j]);
    }
  }, dn = function(l) {
    let w = null, C = null;
    if (pe)
      l = "<remove></remove>" + l;
    else {
      const j = hs(l, /^[\r\n\t ]+/);
      C = j && j[0];
    }
    mt === "application/xhtml+xml" && x === D && (l = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + l + "</body></html>");
    const p = tt ? wt(l) : l;
    if (x === D)
      try {
        w = new I().parseFromString(p, mt);
      } catch {
      }
    if (!w || !w.documentElement) {
      w = Rt.createDocument(x, "template", null);
      try {
        w.documentElement.innerHTML = J ? _ : p;
      } catch {
      }
    }
    const E = w.body || w.documentElement;
    return l && C && E.insertBefore(e.createTextNode(C), E.childNodes[0] || null), x === D ? ne.call(w, qt ? "html" : "body")[0] : qt ? w.documentElement : E;
  }, mn = function(l) {
    const w = nt ? nt(l) : l.ownerDocument;
    return bt.call(
      w || l,
      l,
      // eslint-disable-next-line no-bitwise
      o.SHOW_ELEMENT | o.SHOW_COMMENT | o.SHOW_TEXT | o.SHOW_PROCESSING_INSTRUCTION | o.SHOW_CDATA_SECTION,
      null
    );
  }, De = function(l) {
    return l = WA(l, NA, " "), l = WA(l, Fe, " "), l = WA(l, rA, " "), l;
  }, XA = function(l) {
    var w;
    l.normalize();
    const C = nt ? nt(l) : l.ownerDocument, p = bt.call(
      C || l,
      l,
      // eslint-disable-next-line no-bitwise
      o.SHOW_TEXT | o.SHOW_COMMENT | o.SHOW_CDATA_SECTION | o.SHOW_PROCESSING_INSTRUCTION,
      null
    );
    let E = p.nextNode();
    for (; E; )
      E.data = De(E.data), E = p.nextNode();
    const j = (w = l.querySelectorAll) === null || w === void 0 ? void 0 : w.call(l, "template");
    j && yA(j, (W) => {
      we(W.content) && XA(W.content);
    });
  }, Qe = function(l) {
    const w = Y ? Y(l) : null;
    return typeof w != "string" || st(w) !== "form" ? !1 : typeof l.nodeName != "string" || typeof l.textContent != "string" || typeof l.removeChild != "function" || // Realm-safe NamedNodeMap detection: equality against the cached
    // prototype getter. Clobbered .attributes (e.g. <input name="attributes">)
    // makes the direct read diverge from the cached read; a clean form
    // (same-realm OR foreign-realm) has both reads pointing at the same
    // canonical NamedNodeMap.
    l.attributes !== Q(l) || typeof l.removeAttribute != "function" || typeof l.setAttribute != "function" || typeof l.namespaceURI != "string" || typeof l.insertBefore != "function" || typeof l.hasChildNodes != "function" || // NodeType clobbering probe. Cached Node.prototype.nodeType getter
    // returns the integer 1 for any Element regardless of realm; direct
    // read on a clobbered form (e.g. <input name="nodeType">) returns
    // the named child element. Cheap addition — nodeType is read from
    // an internal slot, no serialization cost — and removes a residual
    // clobbering surface used by several mXSS / PI / comment branches
    // in _sanitizeElements that compare currentNode.nodeType directly.
    l.nodeType !== U(l) || // HTMLFormElement has [LegacyOverrideBuiltIns]: a descendant named
    // "childNodes" shadows the prototype getter. Direct reads of
    // form.childNodes from a clobbered form return the named child
    // instead of the real NodeList, so any walk that reads it directly
    // skips the form's real children. Compare the direct read to the
    // cached Node.prototype getter — when the form's named-property
    // getter intercepts the read, the two values differ and we flag
    // the form. This catches every clobbering child type (input,
    // select, etc.) regardless of whether the named child happens to
    // carry a numeric .length, which a typeof-based probe would miss
    // (e.g. HTMLSelectElement.length is a defined unsigned-long).
    l.childNodes !== T(l);
  }, we = function(l) {
    if (!U || typeof l != "object" || l === null)
      return !1;
    try {
      return U(l) === te.documentFragment;
    } catch {
      return !1;
    }
  }, Ye = function(l) {
    if (!U || typeof l != "object" || l === null)
      return !1;
    try {
      return typeof U(l) == "number";
    } catch {
      return !1;
    }
  };
  function $t(X, l, w) {
    X.length !== 0 && yA(X, (C) => {
      C.call(t, l, w, Vt);
    });
  }
  const pn = function(l, w) {
    return !!(Yt && l.hasChildNodes() && !Ye(l.firstElementChild) && Pt(Es, l.textContent) && Pt(Es, l.innerHTML) || Yt && l.namespaceURI === D && w === "style" && Ye(l.firstElementChild) || l.nodeType === te.processingInstruction || Yt && l.nodeType === te.comment && Pt(vs, l.data));
  }, yn = function(l, w, C) {
    if (!me[w] && bn(w) && (ht.tagNameCheck instanceof RegExp && Pt(ht.tagNameCheck, w) || ht.tagNameCheck instanceof Function && ht.tagNameCheck(w)))
      return !1;
    if (R && !P[w]) {
      const p = O(l), E = T(l);
      if (E && p) {
        const j = E.length;
        for (let W = j - 1; W >= 0; --W) {
          const q = l === C ? m(E[W], !0) : E[W];
          p.insertBefore(q, v(l));
        }
      }
    }
    return re(l), !0;
  }, lA = function(l, w, C, p) {
    return l.length === 0 ? w : w === C || w === p ? jt(w) : w;
  }, be = function(l, w) {
    if ($t(Ct.beforeSanitizeElements, l, null), l !== w && O(l) === null)
      return S && He(l), !0;
    if (Qe(l))
      return re(l), !0;
    const C = st(Y ? Y(l) : l.nodeName);
    if (gt = lA(Ct.uponSanitizeElement, gt, ze, ie), $t(Ct.uponSanitizeElement, l, {
      tagName: C,
      allowedTags: gt
    }), l !== w && O(l) === null)
      return S && He(l), !0;
    if (pn(l, C))
      return re(l), !0;
    if (me[C] || !(Jt.tagCheck instanceof Function && Jt.tagCheck(C)) && !gt[C]) {
      const E = yn(l, C, w);
      return E === !1 && $t(Ct.afterSanitizeElements, l, null), E;
    }
    if ((U ? U(l) : l.nodeType) === te.element && !fn(l) || (C === "noscript" || C === "noembed" || C === "noframes") && Pt($C, l.innerHTML))
      return re(l), !0;
    if (Ft && l.nodeType === te.text) {
      const E = De(l.textContent);
      l.textContent !== E && (wA(t.removed, {
        element: l.cloneNode()
      }), l.textContent = E);
    }
    return $t(Ct.afterSanitizeElements, l, null), !1;
  }, wn = function(l, w, C) {
    if (Se[w] || Yt && w === "patchsrc" || Yt && w === "for" && l !== "label" && l !== "output" || d && (w === "id" || w === "name") && (C in e || C in IA))
      return !1;
    const p = V[w] || Jt.attributeCheck instanceof Function && Jt.attributeCheck(w, l);
    if (!(vt && Pt(sA, w))) {
      if (!(Ce && Pt(Ue, w))) {
        if (p) {
          if (!k[w]) {
            if (!Pt(aA, WA(C, oA, ""))) {
              if (!((w === "src" || w === "xlink:href" || w === "href") && l !== "script" && us(C, "data:") === 0 && F[l])) {
                if (!(St && !Pt(gA, WA(C, oA, "")))) {
                  if (C)
                    return !1;
                }
              }
            }
          }
        } else if (
          // First condition does a very basic check if a) it's basically a valid custom element tagname AND
          // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
          !(bn(l) && (ht.tagNameCheck instanceof RegExp && Pt(ht.tagNameCheck, l) || ht.tagNameCheck instanceof Function && ht.tagNameCheck(l)) && (ht.attributeNameCheck instanceof RegExp && Pt(ht.attributeNameCheck, w) || ht.attributeNameCheck instanceof Function && ht.attributeNameCheck(w, l)) || // Alternative, second condition checks if it's an `is`-attribute, AND
          // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          w === "is" && ht.allowCustomizedBuiltInElements && (ht.tagNameCheck instanceof RegExp && Pt(ht.tagNameCheck, C) || ht.tagNameCheck instanceof Function && ht.tagNameCheck(C)))
        ) return !1;
      }
    }
    return !0;
  }, Ii = rt({}, ["annotation-xml", "color-profile", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "missing-glyph"]), bn = function(l) {
    return !Ii[JA(l)] && Pt(GA, l);
  }, Ci = function(l, w, C, p) {
    if (tt && typeof c == "object" && typeof c.getAttributeType == "function" && !C)
      switch (c.getAttributeType(l, w)) {
        case "TrustedHTML":
          return wt(p);
        case "TrustedScriptURL":
          return Zt(p);
      }
    return p;
  }, En = function(l, w, C, p) {
    try {
      C ? l.setAttributeNS(C, w, p) : l.setAttribute(w, p), Qe(l) ? re(l) : ls(t.removed);
    } catch {
      ye(w, l);
    }
  }, jA = function(l) {
    $t(Ct.beforeSanitizeAttributes, l, null);
    const w = l.attributes;
    if (!w || Qe(l))
      return;
    V = lA(Ct.uponSanitizeAttribute, V, We, le);
    const C = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: V,
      forceKeepAttr: void 0
    };
    let p = w.length;
    const E = st(l.nodeName);
    for (; p--; ) {
      const j = w[p], W = j.name, q = j.namespaceURI, ut = j.value, At = st(W), _t = ut;
      let ct = W === "value" ? _t : kC(_t);
      if (C.attrName = At, C.attrValue = ct, C.keepAttr = !0, C.forceKeepAttr = void 0, $t(Ct.uponSanitizeAttribute, l, C), ct = C.attrValue, y && (At === "id" || At === "name") && us(ct, M) !== 0 && (ye(W, l), ct = M + ct), Yt && Pt(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, ct)) {
        ye(W, l);
        continue;
      }
      if (At === "attributename" && hs(ct, "href")) {
        ye(W, l);
        continue;
      }
      if (!C.forceKeepAttr) {
        if (!C.keepAttr) {
          ye(W, l);
          continue;
        }
        if (!Pe && Pt(tc, ct)) {
          ye(W, l);
          continue;
        }
        if (Ft && (ct = De(ct)), !wn(E, At, ct)) {
          ye(W, l);
          continue;
        }
        ct = Ci(E, At, q, ct), ct !== _t && En(l, W, q, ct);
      }
    }
    $t(Ct.afterSanitizeAttributes, l, null);
  }, hA = function(l) {
    let w = null;
    const C = mn(l);
    for ($t(Ct.beforeSanitizeShadowDOM, l, null); w = C.nextNode(); )
      if ($t(Ct.uponSanitizeShadowNode, w, null), be(w, l), jA(w), we(w.content) && hA(w.content), (U ? U(w) : w.nodeType) === te.element) {
        const E = Z(w);
        we(E) && (ZA(E), hA(E));
      }
    $t(Ct.afterSanitizeShadowDOM, l, null);
  }, ZA = function(l) {
    const w = [{
      node: l,
      shadow: null
    }];
    for (; w.length > 0; ) {
      const C = w.pop();
      if (C.shadow) {
        hA(C.shadow);
        continue;
      }
      const p = C.node, j = (U ? U(p) : p.nodeType) === te.element, W = T(p);
      if (W)
        for (let q = W.length - 1; q >= 0; --q)
          w.push({
            node: W[q],
            shadow: null
          });
      if (j) {
        const q = Y ? Y(p) : null;
        if (typeof q == "string" && st(q) === "template") {
          const ut = p.content;
          we(ut) && w.push({
            node: ut,
            shadow: null
          });
        }
      }
      if (j) {
        const q = Z(p);
        we(q) && w.push({
          node: null,
          shadow: q
        }, {
          node: q,
          shadow: null
        });
      }
    }
  };
  return t.sanitize = function(X) {
    let l = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, w = null, C = null, p = null, E = null;
    if (J = !X, J && (X = "<!-->"), typeof X != "string" && !Ye(X) && (X = ZC(X), typeof X != "string"))
      throw Ke("dirty is not a string, aborting");
    if (!t.isSupported)
      return X;
    ce ? (gt = ie, V = le) : xe(l), (Ct.uponSanitizeElement.length > 0 || Ct.uponSanitizeAttribute.length > 0) && (gt = jt(gt)), Ct.uponSanitizeAttribute.length > 0 && (V = jt(V)), t.removed = [];
    const j = S && typeof X != "string" && Ye(X);
    if (j) {
      ai(X);
      const ut = Y ? Y(X) : X.nodeName;
      if (typeof ut == "string") {
        const At = st(ut);
        if (!gt[At] || me[At])
          throw cA(X), Ke("root node is forbidden and cannot be sanitized in-place");
      }
      if (Qe(X))
        throw cA(X), Ke("root node is clobbered and cannot be sanitized in-place");
      try {
        ZA(X);
      } catch (At) {
        throw cA(X), At;
      }
    } else if (Ye(X))
      w = dn("<!---->"), C = w.ownerDocument.importNode(X, !0), C.nodeType === te.element && C.nodeName === "BODY" || C.nodeName === "HTML" ? w = C : w.appendChild(C), ZA(C);
    else {
      if (!he && !Ft && !qt && // eslint-disable-next-line unicorn/prefer-includes
      X.indexOf("<") === -1)
        return tt && u ? wt(X) : X;
      if (w = dn(X), !w)
        return he ? null : u ? _ : "";
    }
    w && pe && re(w.firstChild);
    const W = j ? X : w;
    try {
      const ut = mn(W);
      for (; p = ut.nextNode(); )
        be(p, W), jA(p), we(p.content) && hA(p.content);
    } catch (ut) {
      throw j && (cA(X), yA(t.removed, (At) => {
        At.element && He(At.element);
      })), ut;
    }
    if (j)
      return yA(t.removed, (ut) => {
        ut.element && He(ut.element);
      }), Ft && XA(X), X;
    if (he) {
      if (Ft && XA(w), f)
        for (E = Ie.call(w.ownerDocument); w.firstChild; )
          E.appendChild(w.firstChild);
      else
        E = w;
      return (V.shadowroot || V.shadowrootmode) && (E = iA.call(n, E, !0)), E;
    }
    let q = qt ? w.outerHTML : w.innerHTML;
    return qt && gt["!doctype"] && w.ownerDocument && w.ownerDocument.doctype && w.ownerDocument.doctype.name && Pt(JC, w.ownerDocument.doctype.name) && (q = "<!DOCTYPE " + w.ownerDocument.doctype.name + `>
` + q), Ft && (q = De(q)), tt && u ? wt(q) : q;
  }, t.setConfig = function() {
    let X = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    xe(X), ce = !0, ie = gt, le = V;
  }, t.clearConfig = function() {
    Vt = null, ce = !1, ie = null, le = null, tt = pt, _ = "";
  }, t.isValidAttribute = function(X, l, w) {
    Vt || xe({});
    const C = st(X), p = st(l);
    return wn(C, p, w);
  }, t.addHook = function(X, l) {
    typeof l == "function" && xt(Ct, X) && wA(Ct[X], l);
  }, t.removeHook = function(X, l) {
    if (xt(Ct, X)) {
      if (l !== void 0) {
        const w = OC(Ct[X], l);
        return w === -1 ? void 0 : LC(Ct[X], w, 1)[0];
      }
      return ls(Ct[X]);
    }
  }, t.removeHooks = function(X) {
    xt(Ct, X) && (Ct[X] = []);
  }, t.removeAllHooks = function() {
    Ct = Ms();
  }, t;
}
var nc = Lg();
const ic = ["b", "strong", "i", "em", "u", "s", "br", "p", "span", "div", "ul", "ol", "li", "a", "img", "small", "sub", "sup", "code", "pre", "table", "thead", "tbody", "tr", "th", "td"], rc = ["href", "src", "alt", "title", "class", "target", "rel", "width", "height"], sc = { values: ["target", "rel", "width", "height"] }, gc = ["script", "style", "iframe", "object", "embed", "form", "input", "textarea", "link", "meta", "base"], oc = ["srcdoc", "style", "formaction", "xlink:href"], ac = { valueAttributes: ["image-url", "image-type", "thumbnail-url", "caption", "material-url", "camera-position", "camera-target", "show-texture"], booleanAttributes: ["fit-to-container", "debug-mode"], urlAttributes: ["image-url", "thumbnail-url", "material-url"], textAttributes: { values: ["caption"] } }, Te = {
  tags: ic,
  attributes: rc,
  uriSafeAttributes: sc,
  forbidTags: gc,
  forbidAttributes: oc,
  slide: ac
}, Ic = Te.tags, Cc = Te.attributes, cc = /^(?:https?|mailto|tel|data):/i, lc = Te.uriSafeAttributes.values, hc = Te.forbidTags, uc = Te.forbidAttributes, fc = /^data:image\/(png|jpeg|gif|webp|avif);/i, Rs = (A) => !!A && /^\s*data:/i.test(A);
function dc(A) {
  if (A.tagName === "A" && A.getAttribute("target") === "_blank" && A.setAttribute("rel", "noopener noreferrer"), A.tagName === "IMG") {
    const e = A.getAttribute("src");
    Rs(e) && !fc.test(e.trim()) && A.removeAttribute("src"), A.hasAttribute("srcset") && A.removeAttribute("srcset");
  } else
    for (const e of ["src", "href", "xlink:href"])
      Rs(A.getAttribute(e)) && A.removeAttribute(e);
}
let QA;
function kg() {
  if (QA) return QA;
  const A = globalThis.window;
  if (!A)
    throw new Error(
      "sanitizeHtml: window の無い環境では使用できません（DOMPurify の初期化に必要）"
    );
  return QA = nc(A), QA.addHook("afterSanitizeAttributes", dc), QA;
}
function Nc(A) {
  return A == null ? "" : kg().sanitize(String(A), {
    ALLOWED_TAGS: Ic,
    ALLOWED_ATTR: Cc,
    ALLOWED_URI_REGEXP: cc,
    ADD_URI_SAFE_ATTR: lc,
    FORBID_TAGS: hc,
    FORBID_ATTR: uc,
    ALLOW_DATA_ATTR: !1,
    // 禁止タグを落としても中身のテキストは残す（実データの可読性を保つ）
    KEEP_CONTENT: !0
  });
}
function mc(A) {
  return A == null ? "" : String(A).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function pc(A) {
  if (A == null) return "";
  const t = kg().sanitize(String(A), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: !0
  }), e = globalThis.window.document.createElement("div");
  return e.innerHTML = t, e.textContent || "";
}
const yc = new Set(Te.slide.valueAttributes), wc = new Set(Te.slide.booleanAttributes), bc = new Set(Te.slide.textAttributes.values), Ec = new Set(Te.slide.urlAttributes), vc = (A) => /^(?:https?:)?\/\/|^\/|^[^:]*$/i.test(A.trim()), Mc = /["'`<>\s]/;
function Gc(A) {
  const t = [];
  for (const [e, n] of Object.entries(A || {})) {
    const i = String(e).toLowerCase();
    if (wc.has(i)) {
      n && t.push(i);
      continue;
    }
    if (!yc.has(i) || n == null) continue;
    let r = String(n);
    Ec.has(i) && (!vc(r) || Mc.test(r)) || (bc.has(i) && (r = pc(r)), t.push(`${i}="${mc(r)}"`));
  }
  return t.join(" ");
}
const Rc = {
  osm: Mg,
  gsi: Rg,
  gsi_ortho: Tg,
  redcircle: xg,
  defaultpin_selected: Dg,
  defaultpin: Cr,
  bluedot: cg,
  bluedot_transparent: lg,
  bluedot_small: hg
}, Tc = {
  "setting-loaded": "onSettingLoaded",
  "appdata-ready": "onAppdataReady",
  "ui-configure": "onUiConfigure",
  "core-dom-ready": "onCoreDomReady",
  "ui-dom-ready": "onUiDomReady",
  "core-ready": "onCoreReady",
  "ui-ready": "onUiReady"
};
class Sc extends Re {
  detail;
  constructor(t) {
    super("gps_error"), this.detail = t;
  }
}
class YA extends Re {
  detail;
  constructor(t) {
    super("gps_result"), this.detail = t;
  }
}
class Pc extends Re {
  constructor() {
    super("gps_request");
  }
}
function bA(A, t) {
  console.warn(
    `MaplatCore: POI layer "${A}" not found (${t}). Pass namespaceID (e.g. "<mapID>#<layerId>" for map-derived layers), not the layer-local id.`
  );
}
class qn extends Hs {
  // Static method declaration
  static createObject;
  appid;
  translateUI = !1;
  noRotate = !1;
  initialRestore = {};
  mapDiv = "map_div";
  restoreSession = !1;
  enableCache;
  // Changed to boolean
  stateBuffer = {};
  mobileMapMoveBuffer;
  overlay = !0;
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
  vectors = [];
  mapDivDocument;
  mapObject;
  mapboxMap;
  maplibreMap;
  googleApiKey;
  pois;
  poiTemplate;
  poiStyle;
  iconTemplate;
  logger;
  icon;
  selectedIcon;
  fakeGps = !1;
  fakeRadius;
  homePosition;
  geolocation;
  moveTo_ = !1;
  gpsEnabled_ = !1;
  alwaysGpsOn = !1;
  firstGpsRequest_ = !1;
  initialGpsMove_ = !1;
  __backMapMoving = !1;
  __selectedMarker;
  uiHooks;
  lifecycleHookResults = {};
  __init = !0;
  __redrawMarkerBlock = !1;
  __redrawMarkerThrottle = [];
  __transparency;
  lastClickEvent;
  // Maplat App Class
  constructor(t) {
    super(), t = fe(t), this.appid = t.appid || "sample";
    const e = t.mapboxgl || (typeof window < "u" ? window.mapboxgl : void 0);
    e && t.mapboxToken && (e.accessToken = t.mapboxToken), t.googleApiKey && (this.googleApiKey = t.googleApiKey), this.mapDiv = t.div || "map_div", this.mapDivDocument = document.querySelector(`#${this.mapDiv}`), this.mapDivDocument.classList.add("maplat"), this.logger = new Hg(
      t.debug ? qA.ALL : qA.INFO
    ), this.enableCache = t.enableCache || !1, this.icon = t.icon, this.selectedIcon = t.selectedIcon, this.translateUI = t.translateUI, this.uiHooks = t.uiHooks;
    const n = t.setting;
    if (t.restore)
      t.restoreSession && (this.restoreSession = !0), this.initialRestore = t.restore;
    else if (t.restoreSession) {
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
    [...UA(`<img id="center_circle" class="prevent-default" alt=""
            style="position:absolute;top:50%;left:50%;margin-top:-10px;
            margin-left:-10px;" src="${xg}">`)].reverse().forEach((g) => {
      this.mapDivDocument.insertBefore(
        g,
        this.mapDivDocument.firstChild
      );
    });
    const r = "maplat-core-style";
    if (!document.getElementById(r)) {
      const g = document.createElement("style");
      g.id = r, g.innerHTML = `
        .maplat * {
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
      `, document.head.appendChild(g);
    }
    this.mapDivDocument.querySelectorAll(".prevent-default").forEach((g) => {
      g.addEventListener("touchstart", (o) => {
        o.preventDefault();
      });
    }), this.overlay = "overlay" in t ? t.overlay : !0, this.overlay && this.mapDivDocument.classList.add("with-opacity"), this.waitReady = (async () => {
      const g = await this.settingLoader(n);
      return this.handleSetting(g, t);
    })();
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
    const n = this.buildLifecycleContext(t, e), i = Tc[t], r = this.uiHooks?.[i];
    if (r)
      try {
        const s = await r(n);
        this.lifecycleHookResults[t] = s, n.uiHookResult = s, n.uiHookResults = { ...this.lifecycleHookResults };
      } catch (s) {
        throw this.logger?.debug?.(`lifecycle:error:${t}`), this.dispatchEvent(new zt("lifecycle:error", { phaseId: t, error: s })), s;
      }
    return this.dispatchEvent(
      new zt(`lifecycle:${t}`, n)
    ), n;
  }
  // Async initializers 1: Load application setting
  async settingLoader(t) {
    return t || (await fetch(`apps/${this.appid}.json`)).json();
  }
  // Async initializer 6: Load pois setting => move to normalize_pois.js
  // Async initializer 8: Load sources setting asynchronous
  async sourcesLoader(t) {
    const e = this.appData.sources, n = [], i = {
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
    return e.forEach((r) => {
      n.push(mC(r, i));
    }), Promise.all(n);
  }
  // Async initializers 2: Handle application setting
  async handleSetting(t, e) {
    await this.runLifecyclePhase("setting-loaded", t), this.appData = fe(t), await this.runLifecyclePhase("appdata-ready"), await this.runLifecyclePhase("ui-configure");
    const n = await this.prepareMap(e);
    await this.runLifecyclePhase("ui-dom-ready");
    const i = await Ds(this.appData.pois || [], this);
    await this.handlePois(i, n), this.initGeolocation(e);
  }
  // Async Initializers 2.5: For geolocation settings
  initGeolocation(t) {
    this.alwaysGpsOn = t.alwaysGpsOn || !1;
    const e = this.geolocation = new vC({
      timerBase: t.fake,
      homePosition: this.appData.homePosition
    });
    this.alwaysGpsOn ? (e.setTracking(!0), this.gpsEnabled_ = !0, this.initialGpsMove_ = !0) : (e.setTracking(!1), this.gpsEnabled_ = !1), e.on("change", () => {
      (async () => {
        const n = this.mapObject, i = n.getLayer("overlay").getLayers().item(0), r = n.getLayers().item(0), s = i ? i.getSource() : r.getSource(), g = e.getPosition(), o = e.getAccuracy();
        if (!g || !o) return;
        let a = !this.moveTo_ && !this.firstGpsRequest_;
        this.alwaysGpsOn && (a = !this.initialGpsMove_);
        const I = await s.setGPSMarkerAsync({ lnglat: g, acc: o }, a);
        this.moveTo_ = !1, this.firstGpsRequest_ = !1, this.initialGpsMove_ = !1, I || (this.alwaysGpsOn || this.handleGPS(!1, !0), s.setGPSMarker());
        const c = this.alwaysGpsOn ? "gps_out_hide" : "gps_out";
        this.dispatchEvent(new YA(I ? { lnglat: g, acc: o } : { error: c }));
      })();
    }), e.on("error", (n) => {
      const i = n.code;
      if (i === 3) return;
      e.setTracking(!1), this.gpsEnabled_ = !1;
      const r = this.mapObject, s = r.getLayer("overlay").getLayers().item(0), g = r.getLayers().item(0);
      (s ? s.getSource() : g.getSource()).setGPSMarker(), this.dispatchEvent(new Sc(i === 1 ? "user_gps_deny" : i === 2 ? "gps_miss" : "gps_timeout")), this.dispatchEvent(new YA({ error: "gps_off" }));
    }), this.addEventListener("mapChanged", () => {
      (async () => {
        if (e.getTracking()) {
          const n = this.mapObject, i = n.getLayer("overlay").getLayers().item(0), r = n.getLayers().item(0), s = i ? i.getSource() : r.getSource(), g = e.getPosition(), o = e.getAccuracy();
          if (!g || !o) return;
          const a = await s.setGPSMarkerAsync({ lnglat: g, acc: o }, !0);
          a || (this.alwaysGpsOn || this.handleGPS(!1, !0), s.setGPSMarker());
          const I = this.alwaysGpsOn ? "gps_out_hide" : "gps_out";
          this.dispatchEvent(new YA(a ? { lnglat: g, acc: o } : { error: I }));
        }
      })();
    });
  }
  // GPS handling methods
  handleGPS(t, e = !1) {
    if (this.geolocation) {
      if (t)
        if (!this.alwaysGpsOn)
          this.firstGpsRequest_ = !0, this.geolocation.setTracking(!0), this.gpsEnabled_ = !0, this.dispatchEvent(new Pc());
        else {
          const n = this.geolocation.getPosition(), i = this.geolocation.getAccuracy();
          if (n && i) {
            const r = this.mapObject, s = r.getLayer("overlay").getLayers().item(0), g = r.getLayers().item(0), o = s ? s.getSource() : g.getSource();
            (async () => await o.setGPSMarkerAsync({ lnglat: n, acc: i }, !1) || (o.setGPSMarker(), this.dispatchEvent(new YA({ error: "gps_out" }))))();
          }
        }
      else if (!this.alwaysGpsOn) {
        this.geolocation.setTracking(!1), this.gpsEnabled_ = !1;
        const n = this.mapObject, i = n.getLayer("overlay").getLayers().item(0), r = n.getLayers().item(0);
        (i ? i.getSource() : r.getSource()).setGPSMarker(), e || this.dispatchEvent(new YA({ error: "gps_off" }));
      }
    }
  }
  getGPSEnabled() {
    return this.gpsEnabled_;
  }
  // Async initializers 5: Prepare map base elements and objects
  async prepareMap(t) {
    t = fe(t), this.mercBuffer = null;
    const e = this.appData.homePosition, n = this.appData.defaultZoom, i = this.appData.zoomRestriction, r = this.appData.minZoom, s = this.appData.maxZoom;
    this.appName = this.appData.appName;
    const g = t.fake ? this.appData.fakeGps : !1, o = t.fake ? this.appData.fakeRadius : !1;
    this.noRotate = t.noRotate || this.appData.noRotate || !1, this.poiTemplate = t.poiTemplate || this.appData.poiTemplate || !1, this.poiStyle = t.poiStyle || this.appData.poiStyle || !1, this.iconTemplate = t.iconTemplate || this.appData.iconTemplate || !1, this.currentPosition = null, this.__init = !0;
    const a = `${this.mapDiv}_front`;
    let I = UA(
      `<div id="${a}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;"></div>`
    )[0];
    this.mapDivDocument.insertBefore(I, this.mapDivDocument.firstChild), this.fakeGps = g, this.fakeRadius = o, this.homePosition = e, this.mapObject = new Ge({
      div: a,
      controls: this.appData.controls || [],
      interactions: this.noRotate ? As({ altShiftDragRotate: !1, pinchRotate: !1 }) : As().extend([
        new YI({
          condition: SI
        })
      ]),
      fakeGps: g,
      fakeRadius: o,
      homePosition: e,
      northUp: t.northUp || this.appData.northUp || !1,
      tapDuration: t.tapDuration || this.appData.tapDuration || 3e3,
      homeMarginPixels: t.homeMarginPixels || this.appData.homeMarginPixels || 50,
      tapUIVanish: t.tapUIVanish || this.appData.tapUIVanish || !1,
      alwaysGpsOn: t.alwaysGpsOn || !1
    });
    let c = null;
    this.overlay && (c = `${this.mapDiv}_back`, I = UA(
      `<div id="${c}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;"></div>`
    )[0], this.mapDivDocument.insertBefore(
      I,
      this.mapDivDocument.firstChild
    ), this.backMap = new Ge({
      off_control: !0,
      div: c
    }));
    const h = t.mapboxgl || (typeof window < "u" ? window.mapboxgl : void 0);
    if (h) {
      const b = `${this.mapDiv}_mapbox`;
      I = UA(
        `<div id="${b}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;visibility:hidden;"></div>`
      )[0], this.mapDivDocument.insertBefore(
        I,
        this.mapDivDocument.firstChild
      ), this.mapboxMap = new h.Map({
        attributionControl: !1,
        boxZoom: !1,
        container: b,
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
    const m = t.maplibregl || (typeof window < "u" ? window.maplibregl : void 0);
    if (m) {
      const b = `${this.mapDiv}_maplibre`;
      I = UA(
        `<div id="${b}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;visibility:hidden;"></div>`
      )[0], this.mapDivDocument.insertBefore(
        I,
        this.mapDivDocument.firstChild
      ), this.maplibreMap = new m.Map({
        attributionControl: !1,
        boxZoom: !1,
        container: b,
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
      zoomRestriction: i,
      mercMinZoom: r,
      mercMaxZoom: s
    };
  }
  // Async initializer 7: Handle pois loading result
  async handlePois(t, e) {
    this.pois = t;
    const n = await this.sourcesLoader(e);
    return this.handleSources(n);
  }
  // Async initializer 9: Handle sources loading result
  async handleSources(t) {
    const e = [];
    if (this.cacheHash = {}, t.forEach((n) => {
      n.setMap(this.mapObject), Qg(n, {
        mapboxMap: this.mapboxMap,
        maplibreMap: this.maplibreMap,
        warn: (r, ...s) => {
          this.logger?.warn ? this.logger.warn(r, ...s) : console.warn(r, ...s);
        }
      }) && (e.push(n), this.cacheHash[n.mapID] = n);
    }), this.mercSrc = e.reduce((n, i) => {
      if (n) return n;
      if (i.isBasemap()) return i;
    }, null), this.dispatchEvent(new zt("sourceLoaded", t)), e.length === 0) {
      this.logger?.warn ? this.logger.warn("No usable sources; skipping map initialization handlers") : console.warn("No usable sources; skipping map initialization handlers"), await this.runLifecyclePhase("core-ready"), await this.runLifecyclePhase("ui-ready");
      return;
    }
    await this.setInitialMap(e), this.setMapClick(), this.setPointerEvents(), this.setMapOnOff(), this.setMouseCursor(), this.setBackMapBehavior(), this.raiseChangeViewpoint(), await this.runLifecyclePhase("core-ready"), await this.runLifecyclePhase("ui-ready");
  }
  // Async initializer 10: Handle initial map
  async setInitialMap(t) {
    const e = this.initialRestore.mapID || this.startFrom || t[t.length - 1].mapID;
    this.from = t.reduce(
      (n, i) => n ? !(n instanceof wg) && i.mapID != e ? i : n : i.mapID != e ? i : n,
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
        this.dispatchEvent(new zt("clickMarker", e[0])), this.dispatchEvent(new zt("clickMarkers", e));
      else {
        const n = t.coordinate;
        this.dispatchEvent(new zt("clickMapXy", n)), this.from.sysCoord2MercAsync(n).then((i) => {
          this.dispatchEvent(new zt("clickMapMerc", i));
          const r = ee(i, "EPSG:3857", "EPSG:4326");
          this.dispatchEvent(
            new zt("clickMap", {
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
    let t, e = !1, n = !1;
    const i = {}, r = (s) => {
      this.dispatchEvent(new zt("pointerMoveOnMapXy", s)), this.from.sysCoord2MercAsync(s).then((g) => {
        if (this.dispatchEvent(new zt("pointerMoveOnMapMerc", g)), t) {
          const o = t;
          t = !1, r(o);
        } else
          e = !1;
      });
    };
    this.mapObject.on("pointermove", (s) => {
      n || (e ? t = s.coordinate : (e = !0, r(s.coordinate)));
    }), this.mapObject.on("pointerdown", (s) => {
      s.originalEvent && s.originalEvent.pointerId != null && (i[s.originalEvent.pointerId] = !0), n = !0;
    }), this.mapObject.on("pointerdrag", (s) => {
      s.originalEvent && s.originalEvent.pointerId != null && (i[s.originalEvent.pointerId] = !0), n = !0;
    }), this.mapObject.on("pointerup", (s) => {
      s.originalEvent && s.originalEvent.pointerId != null ? (delete i[s.originalEvent.pointerId], Object.keys(i).length == 0 && (n = !1)) : s.originalEvent && s.originalEvent.touches ? s.originalEvent.touches.length == 0 && (n = !1) : n = !1;
    });
  }
  // Async initializer 13: Handle map UI on/off
  setMapOnOff() {
    let t;
    const e = () => this.mapDivDocument.querySelectorAll(".ol-control"), n = (r) => {
      r.forEach((s) => s.classList.add("fade"));
    }, i = (r) => {
      r.forEach((s) => s.classList.remove("fade"));
    };
    this.mapObject.on("click", () => {
      t && (clearTimeout(t), t = void 0);
      const r = e(), s = r.length && r[0].classList.contains("fade");
      !this.mapObject.tapUIVanish || s ? i(r) : (n(r), t = setTimeout(() => {
        t = void 0, i(e());
      }, this.mapObject.tapDuration));
    }), this.mapObject.on("pointerdrag", () => {
      t && (clearTimeout(t), t = void 0), n(e());
    }), this.mapObject.on("moveend", () => {
      t && (clearTimeout(t), t = void 0), t = setTimeout(() => {
        t = void 0, i(e());
      }, this.mapObject.tapDuration);
    });
  }
  // Async initializer 14: Handle mouse cursor
  setMouseCursor() {
    const t = (n) => {
      const i = n.target.getEventPixel(n.originalEvent), r = n.target.hasFeatureAtPixel(i), s = n.target.getTarget();
      if (r) {
        const g = n.target.forEachFeatureAtPixel(
          n.pixel,
          (o) => {
            if (o.get("datum")) return o;
          }
        );
        this.mapDivDocument.querySelector(`#${s}`).style.cursor = g ? "pointer" : "";
        return;
      }
      this.mapDivDocument.querySelector(`#${s}`).style.cursor = "";
    };
    this.mapObject.on("pointermove", t);
    const e = (n) => {
      let i = n.frameState.viewState.center;
      const r = this.from;
      r.insideCheckSysCoord(i) || (i = r.modulateSysCoordInside(
        i
      ), n.target.getView().setCenter(i));
    };
    this.mapObject.on("moveend", e);
  }
  // Async initializer 15: Handle back map's behavior
  setBackMapBehavior() {
    const t = (e) => {
      if (!this.backMap) return;
      if (this.__backMapMoving) {
        this.logger.debug("Backmap moving skipped");
        return;
      }
      const n = this.backMap.getSource();
      n && (this.__backMapMoving = !0, this.logger.debug("Backmap moving started"), this.convertParametersFromCurrent(n, (i) => {
        const r = this.backMap.getView();
        r.setCenter(i[0]), r.setZoom(i[1]), r.setRotation(this.noRotate ? 0 : i[2]), this.logger.debug("Backmap moving ended"), this.__backMapMoving = !1;
      }));
    };
    this.mapObject.on("postrender", t);
  }
  // Async initializer 16: Handle back map's behavior
  raiseChangeViewpoint() {
    this.mapObject.on("postrender", async (t) => {
      const e = this.mapObject.getView(), n = e.getCenter(), i = e.getDecimalZoom(), r = On(e.getRotation() * 180 / Math.PI), s = await this.from.viewpoint2MercsAsync(), g = await this.mercSrc.mercs2ViewpointAsync(s);
      if (this.mobileMapMoveBuffer && this.mobileMapMoveBuffer[0][0] == g[0][0] && this.mobileMapMoveBuffer[0][1] == g[0][1] && this.mobileMapMoveBuffer[1] == g[1] && this.mobileMapMoveBuffer[2] == g[2]) return;
      this.mobileMapMoveBuffer = g;
      const o = ee(g[0], "EPSG:3857", "EPSG:4326"), a = On(g[2] * 180 / Math.PI);
      this.dispatchEvent(
        new zt("changeViewpoint", {
          x: n[0],
          y: n[1],
          longitude: o[0],
          latitude: o[1],
          mercator_x: g[0][0],
          mercator_y: g[0][1],
          zoom: i,
          mercZoom: g[1],
          direction: a,
          rotation: r
        })
      ), this.requestUpdateState({
        position: {
          x: n[0],
          y: n[1],
          zoom: i,
          rotation: r
        }
      });
    });
  }
  // 現在の地図回転角を度数で返す (入力側restore.position.rotationと同じ単位系, #61)
  getRotation() {
    const t = this.mapObject?.getView();
    return t ? On(t.getRotation() * 180 / Math.PI) : 0;
  }
  // 現在の実世界方位角を度数で返す。TIN地図では歪み補正込みの非同期計算になるためPromiseを返す (#61)
  async getDirection() {
    if (!this.from || !this.mercSrc) return this.getRotation();
    const t = await this.from.viewpoint2MercsAsync(), e = await this.mercSrc.mercs2ViewpointAsync(t);
    return On(e[2] * 180 / Math.PI);
  }
  currentMapInfo() {
    return xr(this.from);
  }
  mapInfo(t) {
    return xr(this.cacheHash[t]);
  }
  async clientPointToLngLat(t, e) {
    if (!this.from || !this.mapObject) return;
    const i = this.mapObject.getViewport().getBoundingClientRect(), r = [t - i.left, e - i.top], s = this.mapObject.getCoordinateFromPixel(r);
    if (!s) return;
    const g = await this.from.sysCoord2MercAsync(s), o = ee(g, "EPSG:3857", "EPSG:4326");
    return {
      longitude: o[0],
      latitude: o[1]
    };
  }
  async lngLatToClientPoint(t, e) {
    if (!this.from || !this.mapObject) return;
    const n = ee([t, e], "EPSG:4326", "EPSG:3857"), i = await this.from.merc2SysCoordAsync(n), r = this.mapObject.getPixelFromCoordinate(i);
    if (!r) return;
    const s = this.mapObject.getViewport().getBoundingClientRect();
    return {
      x: r[0] + s.left,
      y: r[1] + s.top
    };
  }
  setMarker(t) {
    this.logger.debug(t);
    const e = t.lnglat || [
      t.lng || t.longitude,
      t.lat || t.latitude
    ], n = t.x, i = t.y, r = t.coordinates, s = this.from, g = t.icon ? this.__selectedMarker == t.namespaceID && t.selectedIcon ? t.selectedIcon : t.icon : this.__selectedMarker == t.namespaceID ? Dg : Cr;
    return (r ? (function() {
      return s.merc2SysCoordAsync_ignoreBackground(
        r
      );
    })() : n && i ? new Promise((a) => {
      a(s.xy2SysCoord([n, i]));
    }) : (function() {
      const a = ee(e, "EPSG:4326", "EPSG:3857");
      return s.merc2SysCoordAsync_ignoreBackground(
        a
      );
    })()).then((a) => {
      a && s.insideCheckSysCoord(a) && this.mapObject.setMarker(a, { datum: t }, g);
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
    this.logger.debug(t);
    let e;
    const n = (i, r = !1) => Promise.all(
      i.map((s) => Array.isArray(s[0]) ? n(s, r) : (r && (s = ee(s, "EPSG:4326", "EPSG:3857")), this.from.merc2SysCoordAsync(s)))
    );
    t.coordinates ? e = n(t.coordinates) : e = n(t.lnglats, !0), e.then((i) => {
      this.mapObject.setVector(i, t.type, t.style);
    });
  }
  resetLine() {
    this.resetVector();
  }
  resetVector() {
    this.mapObject.resetVector();
  }
  redrawMarkers(t = void 0) {
    if (t || (t = this.from), this.__redrawMarkerBlock) {
      this.__redrawMarkerThrottle || (this.__redrawMarkerThrottle = []);
      const n = this.__redrawMarkerThrottle;
      if (n.length == 0 || n[n.length - 1] !== t) {
        n.push(t);
        return;
      }
    }
    this.__redrawMarkerBlock = !0;
    const e = (n) => {
      const i = [];
      this.resetMarker();
      let r;
      if (!this.stateBuffer.hideMarker) {
        for (const g of Object.keys(this.pois)) {
          const o = this.pois[g];
          if (!o.hide)
            for (const a of o.pois) {
              const I = as(a, o, this);
              Is(I, o, this), this.__selectedMarker == I.namespaceID ? r = I : i.push(this.setMarker(I));
            }
        }
        if (n.pois)
          for (const g of Object.keys(n.pois)) {
            const o = n.pois[g];
            if (!o.hide)
              for (const a of o.pois) {
                const I = as(a, o, n, this);
                Is(I, o, n, this), this.__selectedMarker == I.namespaceID ? r = I : i.push(this.setMarker(I));
              }
          }
      }
      let s = Promise.all(i);
      r && (s = s.then(() => this.setMarker(r))), s.then(() => {
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
    const i = this.getMarker(t);
    if (i) {
      if (e = $A(e || {}), n) {
        for (const r of Object.keys(i))
          r !== "id" && r !== "namespaceID" && delete i[r];
        Object.assign(i, e);
      } else
        for (const r of Object.keys(e))
          r === "id" || r === "namespaceID" || (e[r] === "____delete____" ? delete i[r] : i[r] = e[r]);
      this.redrawMarkers();
    }
  }
  addMarker(t, e) {
    if (e || (e = "main"), e.includes("#")) {
      const n = e.split("#"), i = this.cacheHash[n[0]];
      if (i) {
        const r = i.addPoi(t, n[1]);
        return this.dispatchPoiNumber(), this.redrawMarkers(), r;
      }
    } else if (this.pois[e])
      return this.pois[e].pois.push($A(t)), Vi(this.pois, e, {
        name: this.appName
      }), this.dispatchPoiNumber(), this.redrawMarkers(), t.namespaceID;
  }
  removeMarker(t) {
    if (t.includes("#")) {
      const e = t.split("#"), n = this.cacheHash[e[0]];
      n && (n.removePoi(e[1]), this.dispatchPoiNumber(), this.redrawMarkers());
    } else
      for (const e of Object.keys(this.pois))
        for (let n = 0; n < this.pois[e].pois.length; n++)
          this.pois[e].pois[n].id === t && (delete this.pois[e].pois[n], this.dispatchPoiNumber(), this.redrawMarkers());
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
      new zt(
        "poi_number",
        this.listPoiLayers(!1, !0).reduce(
          (t, e) => t + e.pois.length,
          0
        )
      )
    );
  }
  listPoiLayers(t = !1, e = !1) {
    const n = Object.keys(this.pois).sort((r, s) => r === "main" ? -1 : s === "main" ? 1 : 0).map((r) => this.pois[r]).filter(
      (r) => e ? t ? r.pois.length && r.hide : r.pois.length : t ? r.hide : !0
    ), i = this.from.listPoiLayers(
      t,
      e
    );
    return n.concat(i);
  }
  showPoiLayer(t) {
    const e = this.getPoiLayer(t);
    if (!e) {
      bA(t, "showPoiLayer");
      return;
    }
    delete e.hide, this.requestUpdateState({
      hideLayer: this.listPoiLayers(!0).map((n) => n.namespaceID).join(",")
    }), this.redrawMarkers();
  }
  hidePoiLayer(t) {
    const e = this.getPoiLayer(t);
    if (!e) {
      bA(t, "hidePoiLayer");
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
        this.pois[t] = ke(e || [], t, {
          name: this.appName
        }), this.redrawMarkers();
      else {
        const n = t.split("#"), i = this.cacheHash[n[0]];
        i ? (i.addPoiLayer(n[1], e), this.redrawMarkers()) : bA(t, "addPoiLayer");
      }
  }
  removePoiLayer(t) {
    if (t !== "main")
      if (t.includes("#")) {
        const e = t.split("#"), n = this.cacheHash[e[0]];
        if (!n) {
          bA(t, "removePoiLayer");
          return;
        }
        if (!n.getPoiLayer(e[1])) {
          bA(t, "removePoiLayer");
          return;
        }
        n.removePoiLayer(e[1]), this.requestUpdateState({
          hideLayer: this.listPoiLayers(!0).map((i) => i.namespaceID).join(",")
        }), this.dispatchPoiNumber(), this.redrawMarkers();
      } else {
        if (!this.pois[t]) {
          bA(t, "removePoiLayer");
          return;
        }
        delete this.pois[t], this.requestUpdateState({
          hideLayer: this.listPoiLayers(!0).map((e) => e.namespaceID).join(",")
        }), this.dispatchPoiNumber(), this.redrawMarkers();
      }
  }
  addLine(t) {
    this.vectors.push(t), this.setLine(t);
  }
  addVector(t) {
    this.vectors.push(t), this.setVector(t);
  }
  clearLine() {
    this.vectors = [], this.resetLine();
  }
  clearVector() {
    this.vectors = [], this.resetVector();
  }
  setGPSMarker(t) {
    this.currentPosition = t, this.from.setGPSMarker(t, !0);
  }
  changeMap(t, e) {
    e === void 0 && (e = {});
    const n = this.mercSrc, i = this.cacheHash[t];
    return i ? (this.changeMapSeq || (this.changeMapSeq = Promise.resolve()), this.changeMapSeq = this.changeMapSeq.then(
      () => new Promise((r, s) => {
        this.convertParametersFromCurrent(i, (g) => {
          let o = null, a = null;
          const I = e.backgroundID ? this.cacheHash[e.backgroundID] : void 0;
          if (this.backMap && (o = this.backMap.getSource(), i.isWmts() ? this.backMap.exchangeSource() : (I ? (a = I, this.backMap.exchangeSource(a)) : o ? a = o : (a = n, this.from.isWmts() && (a = this.from instanceof Kn ? (
            // If current foreground is a TMS overlay, use the current
            // basemap as new background. On initial load no foreground
            // source is set yet, so fall back to the default basemap
            // (mercSrc) to avoid a null background source.
            this.mapObject.getSource() || n
          ) : this.from), a && this.backMap.exchangeSource(a)), a && this.requestUpdateState({ backgroundID: a.mapID }))), i instanceof Kn) {
            if (this.mapObject.setLayer(i), I)
              this.mapObject.exchangeSource(I);
            else if (!this.from.isWmts()) {
              const b = o || n;
              this.mapObject.exchangeSource(b);
            }
            const m = this.mapObject.getSource();
            m && this.requestUpdateState({ backgroundID: m.mapID });
          } else
            this.mapObject.setLayer(), this.mapObject.exchangeSource(i);
          const c = {
            mapID: i.mapID
          };
          i.isBasemap() && (c.backgroundID = "____delete____"), this.requestUpdateState(c), this.from = i, this.dispatchPoiNumber();
          const h = this.mapObject.getView();
          this.appData.zoomRestriction && (h.setMaxZoom(i.maxZoom), h.setMinZoom(i.minZoom || 0)), g && i.insideCheckSysCoord(g[0]) ? (h.setCenter(g[0]), h.setZoom(g[1]), h.setRotation(this.noRotate ? 0 : g[2])) : this.__init ? g || this.goHome(i) : (this.dispatchEvent(new zt("outOfMap", {})), this.goHome(i)), i.setGPSMarker(this.currentPosition, !0), e.hideLayer && (e.hideLayer.split(",").map((b) => {
            const v = this.getPoiLayer(b);
            v && (v.hide = !0);
          }), this.requestUpdateState({ hideLayer: e.hideLayer })), e.hideMarker ? this.hideAllMarkers() : this.redrawMarkers(), this.resetVector(), this.vectors.forEach((m) => {
            this.setVector(m);
          }), this.dispatchEvent(
            new zt("mapChanged", this.getMapMeta(i.mapID))
          ), this.mapObject.updateSize(), this.mapObject.render(), e.position && (this.__init = !1, i.setViewpoint(e.position)), e.transparency && this.setTransparency(e.transparency), this.__init ? (this.__init = !1, this.goHome(i)) : this.backMap && a && this.convertParametersFromCurrent(a, (m) => {
            const b = this.backMap.getView();
            b.setCenter(m[0]), b.setZoom(m[1]), b.setRotation(this.noRotate ? 0 : m[2]), this.backMap.updateSize(), this.backMap.render();
          }), r(void 0);
        });
      })
    )) : (this.logger.warn(`changeMap: mapID "${t}" not found in cacheHash`), Promise.resolve());
  }
  requestUpdateState(t) {
    if (this.stateBuffer = Object.assign(this.stateBuffer, t), this.stateBuffer.backgroundID == "____delete____" && delete this.stateBuffer.backgroundID, this.restoreSession) {
      const e = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
      localStorage.setItem("epoch", `${e}`);
      const n = function(i) {
        Object.keys(i).map((r) => {
          r == "position" ? n(i[r]) : r == "backgroundID" && i[r] == "____delete____" ? localStorage.removeItem(r) : localStorage.setItem(r, i[r]);
        });
      };
      n(t);
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
      return en.reduce(
        (n, i) => (n[i] = e.get(i), n),
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
    const n = this.mapObject.getView();
    if (!this.from) {
      e && e();
      return;
    }
    let i = this.from.viewpoint2MercsAsync();
    const r = Wi(
      [n.getCenter(), n.getZoom(), n.getRotation()],
      10
    );
    if (this.mercBuffer && this.mercBuffer.mercs && this.mercBuffer.buffer[this.from.mapID]) {
      const s = this.mercBuffer.buffer[this.from.mapID];
      s[0][0] == r[0][0] && s[0][1] == r[0][1] && s[1] == r[1] && s[2] == r[2] ? (this.logger.debug(s), this.logger.debug(r), this.logger.debug("From: Use buffer"), i = new Promise((g, o) => {
        g(this.mercBuffer.mercs);
      })) : (this.mercBuffer = {
        buffer: {}
      }, this.mercBuffer.buffer[this.from.mapID] = r);
    } else
      this.mercBuffer = {
        buffer: {}
      }, this.mercBuffer.buffer[this.from.mapID] = r;
    this.logger.debug(
      `From: Center: ${r[0]} Zoom: ${r[1]} Rotation: ${r[2]}`
    ), this.logger.debug(`From: ${this.from.mapID}`), i.then((s) => {
      this.mercBuffer.mercs = s, this.logger.debug(`Mercs: ${s}`);
      let g = t.mercs2ViewpointAsync(s);
      const o = t.mapID;
      this.mercBuffer.buffer[o] && (this.logger.debug("To: Use buffer"), g = new Promise((a, I) => {
        a(this.mercBuffer.buffer[o]);
      })), g.then((a) => {
        this.logger.debug(
          `To: Center: ${a[0]} Zoom: ${a[1]} Rotation: ${a[2]}`
        ), this.logger.debug(`To: ${t.mapID}`), this.mercBuffer.buffer[t.mapID] = Wi(a, 10), e(a);
      }).catch((a) => {
        throw a;
      });
    }).catch((s) => {
      throw s;
    });
  }
  remove() {
    this.mapboxMap && this.mapboxMap.remove(), this.mapDivDocument.innerHTML = "", this.mapDivDocument.classList.remove("maplat");
  }
}
qn.createObject = function(A) {
  return new Promise((t) => {
    const e = new qn(A);
    e.waitReady.then(() => {
      t(e);
    });
  });
};
if (typeof window < "u") {
  const A = {
    createObject: qn.createObject
  };
  window.Maplat = A, window.MaplatApp = qn, window.assets = Rc;
}
export {
  zt as CustomEvent,
  Sc as GPSErrorEvent,
  Pc as GPSRequestEvent,
  YA as GPSResultEvent,
  qn as MaplatApp,
  Ge as MaplatMap,
  Rc as assets,
  Gc as buildSlideAttrs,
  UA as createElement,
  mc as escapeAttr,
  mC as mapSourceFactory,
  Nc as sanitizeHtml,
  pc as toPlainText
};
//# sourceMappingURL=maplat_core.js.map
