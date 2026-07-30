import { transform as et, toLonLat as ni, Projection as vs, addProjection as NA, addCoordinateTransforms as $e, getTransform as vA, identityTransform as bA } from "ol/proj";
import { View as og, Map as bs, Feature as Ms } from "ol";
import { Vector as Ne, Group as Es, Tile as MA } from "ol/layer";
import { XYZ as Ig, Google as Rs, Vector as ze } from "ol/source";
import { Style as at, Icon as ie, Stroke as zA, Fill as FA } from "ol/style";
class mt {
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
let Y = class extends mt {
  detail;
  constructor(t, e) {
    super(t), this.detail = e;
  }
};
const Ps = ["ALL", "OFF"], de = {
  ALL: -99,
  DEBUG: -1,
  INFO: 0,
  WARN: 1,
  ERROR: 2,
  OFF: 99
};
class xs {
  constructor(t = de.INFO) {
    this.level = t, this.make();
  }
  level;
  make() {
    const t = Object.keys(de).filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      (e) => !Ps.includes(e)
    );
    for (const e of t) {
      const i = de[e], n = e.toLowerCase();
      this[n] = this.level <= i ? console.log : () => {
      };
    }
  }
}
function Cg(A, t, e = {}) {
  const i = { type: "Feature" };
  return (e.id === 0 || e.id) && (i.id = e.id), e.bbox && (i.bbox = e.bbox), i.properties = t || {}, i.geometry = A, i;
}
function Et(A, t, e = {}) {
  if (!A)
    throw new Error("coordinates is required");
  if (!Array.isArray(A))
    throw new Error("coordinates must be an Array");
  if (A.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!Cn(A[0]) || !Cn(A[1]))
    throw new Error("coordinates must contain numbers");
  return Cg({
    type: "Point",
    coordinates: A
  }, t, e);
}
function UA(A, t, e = {}) {
  for (const i of A) {
    if (i.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (i[i.length - 1].length !== i[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let n = 0; n < i[i.length - 1].length; n++)
      if (i[i.length - 1][n] !== i[0][n])
        throw new Error("First and last Position are not equivalent.");
  }
  return Cg({
    type: "Polygon",
    coordinates: A
  }, t, e);
}
function ne(A, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = A, e;
}
function Cn(A) {
  return !isNaN(A) && A !== null && !Array.isArray(A);
}
function Ss(A) {
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
function an(A) {
  if (Array.isArray(A))
    return A;
  if (A.type === "Feature") {
    if (A.geometry !== null)
      return A.geometry.coordinates;
  } else if (A.coordinates)
    return A.coordinates;
  throw new Error(
    "coords must be GeoJSON Feature, Geometry Object or an Array"
  );
}
function Ds(A) {
  return A.type === "Feature" ? A.geometry : A;
}
const ft = 11102230246251565e-32, Q = 134217729, Bs = (3 + 8 * ft) * ft;
function EA(A, t, e, i, n) {
  let g, r, s, o, I = t[0], C = i[0], a = 0, c = 0;
  C > I == C > -I ? (g = I, I = t[++a]) : (g = C, C = i[++c]);
  let l = 0;
  if (a < A && c < e)
    for (C > I == C > -I ? (r = I + g, s = g - (r - I), I = t[++a]) : (r = C + g, s = g - (r - C), C = i[++c]), g = r, s !== 0 && (n[l++] = s); a < A && c < e; )
      C > I == C > -I ? (r = g + I, o = r - g, s = g - (r - o) + (I - o), I = t[++a]) : (r = g + C, o = r - g, s = g - (r - o) + (C - o), C = i[++c]), g = r, s !== 0 && (n[l++] = s);
  for (; a < A; )
    r = g + I, o = r - g, s = g - (r - o) + (I - o), I = t[++a], g = r, s !== 0 && (n[l++] = s);
  for (; c < e; )
    r = g + C, o = r - g, s = g - (r - o) + (C - o), C = i[++c], g = r, s !== 0 && (n[l++] = s);
  return (g !== 0 || l === 0) && (n[l++] = g), l;
}
function Ts(A, t) {
  let e = t[0];
  for (let i = 1; i < A; i++) e += t[i];
  return e;
}
function Pe(A) {
  return new Float64Array(A);
}
const ks = (3 + 16 * ft) * ft, Gs = (2 + 12 * ft) * ft, Os = (9 + 64 * ft) * ft * ft, Ut = Pe(4), cn = Pe(8), ln = Pe(12), hn = Pe(16), K = Pe(4);
function Ls(A, t, e, i, n, g, r) {
  let s, o, I, C, a, c, l, d, h, f, m, y, b, v, M, E, P, x;
  const T = A - n, k = e - n, D = t - g, L = i - g;
  v = T * L, c = Q * T, l = c - (c - T), d = T - l, c = Q * L, h = c - (c - L), f = L - h, M = d * f - (v - l * h - d * h - l * f), E = D * k, c = Q * D, l = c - (c - D), d = D - l, c = Q * k, h = c - (c - k), f = k - h, P = d * f - (E - l * h - d * h - l * f), m = M - P, a = M - m, Ut[0] = M - (m + a) + (a - P), y = v + m, a = y - v, b = v - (y - a) + (m - a), m = b - E, a = b - m, Ut[1] = b - (m + a) + (a - E), x = y + m, a = x - y, Ut[2] = y - (x - a) + (m - a), Ut[3] = x;
  let X = Ts(4, Ut), H = Gs * r;
  if (X >= H || -X >= H || (a = A - T, s = A - (T + a) + (a - n), a = e - k, I = e - (k + a) + (a - n), a = t - D, o = t - (D + a) + (a - g), a = i - L, C = i - (L + a) + (a - g), s === 0 && o === 0 && I === 0 && C === 0) || (H = Os * r + Bs * Math.abs(X), X += T * C + L * s - (D * I + k * o), X >= H || -X >= H)) return X;
  v = s * L, c = Q * s, l = c - (c - s), d = s - l, c = Q * L, h = c - (c - L), f = L - h, M = d * f - (v - l * h - d * h - l * f), E = o * k, c = Q * o, l = c - (c - o), d = o - l, c = Q * k, h = c - (c - k), f = k - h, P = d * f - (E - l * h - d * h - l * f), m = M - P, a = M - m, K[0] = M - (m + a) + (a - P), y = v + m, a = y - v, b = v - (y - a) + (m - a), m = b - E, a = b - m, K[1] = b - (m + a) + (a - E), x = y + m, a = x - y, K[2] = y - (x - a) + (m - a), K[3] = x;
  const xt = EA(4, Ut, 4, K, cn);
  v = T * C, c = Q * T, l = c - (c - T), d = T - l, c = Q * C, h = c - (c - C), f = C - h, M = d * f - (v - l * h - d * h - l * f), E = D * I, c = Q * D, l = c - (c - D), d = D - l, c = Q * I, h = c - (c - I), f = I - h, P = d * f - (E - l * h - d * h - l * f), m = M - P, a = M - m, K[0] = M - (m + a) + (a - P), y = v + m, a = y - v, b = v - (y - a) + (m - a), m = b - E, a = b - m, K[1] = b - (m + a) + (a - E), x = y + m, a = x - y, K[2] = y - (x - a) + (m - a), K[3] = x;
  const R = EA(xt, cn, 4, K, ln);
  v = s * C, c = Q * s, l = c - (c - s), d = s - l, c = Q * C, h = c - (c - C), f = C - h, M = d * f - (v - l * h - d * h - l * f), E = o * I, c = Q * o, l = c - (c - o), d = o - l, c = Q * I, h = c - (c - I), f = I - h, P = d * f - (E - l * h - d * h - l * f), m = M - P, a = M - m, K[0] = M - (m + a) + (a - P), y = v + m, a = y - v, b = v - (y - a) + (m - a), m = b - E, a = b - m, K[1] = b - (m + a) + (a - E), x = y + m, a = x - y, K[2] = y - (x - a) + (m - a), K[3] = x;
  const $ = EA(R, ln, 4, K, hn);
  return hn[$ - 1];
}
function Zs(A, t, e, i, n, g) {
  const r = (t - g) * (e - n), s = (A - n) * (i - g), o = r - s, I = Math.abs(r + s);
  return Math.abs(o) >= ks * I ? o : -Ls(A, t, e, i, n, g, I);
}
function Xs(A, t) {
  var e, i, n = 0, g, r, s, o, I, C, a, c = A[0], l = A[1], d = t.length;
  for (e = 0; e < d; e++) {
    i = 0;
    var h = t[e], f = h.length - 1;
    if (C = h[0], C[0] !== h[f][0] && C[1] !== h[f][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (r = C[0] - c, s = C[1] - l, i; i < f; i++) {
      if (a = h[i + 1], o = a[0] - c, I = a[1] - l, s === 0 && I === 0) {
        if (o <= 0 && r >= 0 || r <= 0 && o >= 0)
          return 0;
      } else if (I >= 0 && s <= 0 || I <= 0 && s >= 0) {
        if (g = Zs(r, o, s, I, 0, 0), g === 0)
          return 0;
        (g > 0 && I > 0 && s <= 0 || g < 0 && I <= 0 && s > 0) && n++;
      }
      C = a, s = I, r = o;
    }
  }
  return n % 2 !== 0;
}
function qt(A, t, e = {}) {
  if (!A)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = Ss(A), n = Ds(t), g = n.type, r = t.bbox;
  let s = n.coordinates;
  if (r && js(i, r) === !1)
    return !1;
  g === "Polygon" && (s = [s]);
  let o = !1;
  for (var I = 0; I < s.length; ++I) {
    const C = Xs(i, s[I]);
    if (C === 0) return !e.ignoreBoundary;
    C && (o = !0);
  }
  return o;
}
function js(A, t) {
  return t[0] <= A[0] && t[1] <= A[1] && t[2] >= A[0] && t[3] >= A[1];
}
function RA(A, t) {
  for (let e = 0; e < t.features.length; e++)
    if (qt(A, t.features[e]))
      return t.features[e];
}
function ag(A, t, e) {
  const i = t.geometry.coordinates[0][0], n = t.geometry.coordinates[0][1], g = t.geometry.coordinates[0][2], r = A.geometry.coordinates, s = t.properties.a.geom, o = t.properties.b.geom, I = t.properties.c.geom, C = [n[0] - i[0], n[1] - i[1]], a = [g[0] - i[0], g[1] - i[1]], c = [r[0] - i[0], r[1] - i[1]], l = [o[0] - s[0], o[1] - s[1]], d = [I[0] - s[0], I[1] - s[1]];
  let h = (a[1] * c[0] - a[0] * c[1]) / (C[0] * a[1] - C[1] * a[0]), f = (C[0] * c[1] - C[1] * c[0]) / (C[0] * a[1] - C[1] * a[0]);
  if (e) {
    const m = e[t.properties.a.index], y = e[t.properties.b.index], b = e[t.properties.c.index];
    let v;
    if (h < 0 || f < 0 || 1 - h - f < 0) {
      const M = h / (h + f), E = f / (h + f);
      v = h / y / (M / y + E / b), f = f / b / (M / y + E / b);
    } else
      v = h / y / (h / y + f / b + (1 - h - f) / m), f = f / b / (h / y + f / b + (1 - h - f) / m);
    h = v;
  }
  return [
    h * l[0] + f * d[0] + s[0],
    h * l[1] + f * d[1] + s[1]
  ];
}
function Ns(A, t, e, i) {
  const n = A.geometry.coordinates, g = e.geometry.coordinates, r = Math.atan2(n[0] - g[0], n[1] - g[1]), s = Fs(r, t[0]);
  if (s === void 0)
    throw new Error("Unable to determine vertex index");
  const o = t[1][s];
  return ag(A, o.features[0], i);
}
function zs(A, t, e, i, n, g, r, s) {
  let o;
  if (r && (o = RA(A, ne([r]))), !o)
    if (e) {
      const I = A.geometry.coordinates, C = e.gridNum, a = e.xOrigin, c = e.yOrigin, l = e.xUnit, d = e.yUnit, h = e.gridCache, f = Ct(I[0], a, l, C), m = Ct(I[1], c, d, C), y = h[f] ? h[f][m] ? h[f][m] : [] : [], b = ne(y.map((v) => t.features[v]));
      o = RA(A, b);
    } else
      o = RA(A, t);
  return s && s(o), o ? ag(A, o, g) : Ns(A, i, n, g);
}
function Ct(A, t, e, i) {
  let n = Math.floor((A - t) / e);
  return n < 0 && (n = 0), n >= i && (n = i - 1), n;
}
function Fs(A, t) {
  let e = un(A - t[0]), i = Math.PI * 2, n;
  for (let g = 0; g < t.length; g++) {
    const r = (g + 1) % t.length, s = un(A - t[r]), o = Math.min(Math.abs(e), Math.abs(s));
    e * s <= 0 && o < i && (i = o, n = g), e = s;
  }
  return n;
}
function un(A, t = !1) {
  const e = 2 * Math.PI, i = A - Math.floor(A / e) * e;
  return t ? i : i > Math.PI ? i - e : i;
}
function Us(A) {
  const t = [0, 1, 2, 0].map((i) => A[i][0][0]), e = {
    a: { geom: A[0][0][1], index: A[0][1] },
    b: { geom: A[1][0][1], index: A[1][1] },
    c: { geom: A[2][0][1], index: A[2][1] }
  };
  return UA([t], e);
}
function WA(A, t, e, i, n, g = !1, r) {
  const s = A.map(
    (o) => {
      (!r || r < 2.00703) && (o = cg(o));
      const I = isFinite(o) ? t[o] : o === "c" ? i : (function() {
        const C = o.match(/^b(\d+)$/);
        if (C) return n[parseInt(C[1])];
        const a = o.match(/^e(\d+)$/);
        if (a) return e[parseInt(a[1])];
        throw new Error("Bad index value for indexesToTri");
      })();
      return g ? [[I[1], I[0]], o] : [[I[0], I[1]], o];
    }
  );
  return Us(s);
}
function cg(A) {
  return typeof A == "number" ? A : A.replace(/^(c|e|b)(?:ent|dgeNode|box)(\d+)?$/, "$1$2");
}
function Ws(A, t) {
  return t && t >= 2.00703 || Array.isArray(A[0]) ? A : A.map((e) => [
    e.illstNodes,
    e.mercNodes,
    e.startEnd
  ]);
}
const lg = 2.00703;
function Qs(A) {
  return !!(A.version !== void 0 || !A.tins && A.points && A.tins_points);
}
function Vs(A) {
  return {
    points: A.points,
    pointsWeightBuffer: Ys(A),
    strictStatus: Ks(A),
    verticesParams: Js(A),
    centroid: qs(A),
    edges: Ws(A.edges || []),
    edgeNodes: A.edgeNodes || [],
    tins: _s(A),
    kinks: $s(A.kinks_points),
    yaxisMode: A.yaxisMode ?? "invert",
    strictMode: A.strictMode ?? "auto",
    vertexMode: A.vertexMode,
    bounds: A.bounds,
    boundsPolygon: A.boundsPolygon,
    wh: A.wh,
    xy: A.xy ?? [0, 0]
  };
}
function Hs(A) {
  const t = to(A), e = t.tins;
  return {
    compiled: t,
    tins: e,
    points: eo(e),
    strictStatus: t.strict_status,
    pointsWeightBuffer: t.weight_buffer,
    verticesParams: t.vertices_params,
    centroid: t.centroid,
    kinks: t.kinks
  };
}
function Ys(A) {
  return !A.version || A.version < lg ? ["forw", "bakw"].reduce((t, e) => {
    const i = A.weight_buffer[e];
    return i && (t[e] = Object.keys(i).reduce((n, g) => {
      const r = cg(g);
      return n[r] = i[g], n;
    }, {})), t;
  }, {}) : A.weight_buffer;
}
function Ks(A) {
  return A.strict_status ? A.strict_status : A.kinks_points ? "strict_error" : A.tins_points.length === 2 ? "loose" : "strict";
}
function Js(A) {
  const t = {
    forw: [A.vertices_params[0]],
    bakw: [A.vertices_params[1]]
  };
  return t.forw[1] = fn(A, !1), t.bakw[1] = fn(A, !0), t;
}
function fn(A, t) {
  const e = A.vertices_points.length;
  return Array.from({ length: e }, (i, n) => {
    const g = (n + 1) % e, r = WA(
      ["c", `b${n}`, `b${g}`],
      A.points,
      A.edgeNodes || [],
      A.centroid_point,
      A.vertices_points,
      t,
      lg
    );
    return ne([r]);
  });
}
function qs(A) {
  return {
    forw: Et(A.centroid_point[0], {
      target: {
        geom: A.centroid_point[1],
        index: "c"
      }
    }),
    bakw: Et(A.centroid_point[1], {
      target: {
        geom: A.centroid_point[0],
        index: "c"
      }
    })
  };
}
function _s(A) {
  const t = A.tins_points.length === 1 ? 0 : 1;
  return {
    forw: ne(
      A.tins_points[0].map(
        (e) => WA(
          e,
          A.points,
          A.edgeNodes || [],
          A.centroid_point,
          A.vertices_points,
          !1,
          A.version
        )
      )
    ),
    bakw: ne(
      A.tins_points[t].map(
        (e) => WA(
          e,
          A.points,
          A.edgeNodes || [],
          A.centroid_point,
          A.vertices_points,
          !0,
          A.version
        )
      )
    )
  };
}
function $s(A) {
  if (A)
    return {
      bakw: ne(
        A.map((t) => Et(t))
      )
    };
}
function to(A) {
  return JSON.parse(
    JSON.stringify(A).replace('"cent"', '"c"').replace(/"bbox(\d+)"/g, '"b$1"')
  );
}
function eo(A) {
  const t = [], e = A.forw.features;
  for (let i = 0; i < e.length; i++) {
    const n = e[i];
    ["a", "b", "c"].forEach((g, r) => {
      const s = n.geometry.coordinates[0][r], o = n.properties[g].geom, I = n.properties[g].index;
      typeof I == "number" && (t[I] = [s, o]);
    });
  }
  return t;
}
class nt {
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
  pointsWeightBuffer;
  strict_status;
  vertices_params;
  centroid;
  edgeNodes;
  edges;
  tins;
  kinks;
  yaxisMode = nt.YAXIS_INVERT;
  strictMode = nt.MODE_AUTO;
  vertexMode = nt.VERTEX_PLAIN;
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
    if (Qs(t)) {
      this.applyModernState(Vs(t));
      return;
    }
    this.applyLegacyState(Hs(t));
  }
  applyModernState(t) {
    this.points = t.points, this.pointsWeightBuffer = t.pointsWeightBuffer, this.strict_status = t.strictStatus, this.vertices_params = t.verticesParams, this.centroid = t.centroid, this.edges = t.edges, this.edgeNodes = t.edgeNodes || [], this.tins = t.tins, this.addIndexedTin(), this.kinks = t.kinks, this.yaxisMode = t.yaxisMode ?? nt.YAXIS_INVERT, this.vertexMode = t.vertexMode ?? nt.VERTEX_PLAIN, this.strictMode = t.strictMode ?? nt.MODE_AUTO, t.bounds ? (this.bounds = t.bounds, this.boundsPolygon = t.boundsPolygon, this.xy = t.xy, this.wh = t.wh) : (this.bounds = void 0, this.boundsPolygon = void 0, this.xy = t.xy ?? [0, 0], t.wh && (this.wh = t.wh));
  }
  applyLegacyState(t) {
    this.tins = t.tins, this.addIndexedTin(), this.strict_status = t.strictStatus, this.pointsWeightBuffer = t.pointsWeightBuffer, this.vertices_params = t.verticesParams, this.centroid = t.centroid, this.kinks = t.kinks, this.points = t.points;
  }
  /**
   * TINネットワークのインデックスを作成します
   *
   * インデックスは変換処理を高速化するために使用されます。
   * グリッド形式のインデックスを作成し、各グリッドに
   * 含まれる三角形を記録します。
   */
  addIndexedTin() {
    const t = this.tins, e = t.forw, i = t.bakw, n = Math.ceil(Math.sqrt(e.features.length));
    if (n < 3) {
      this.indexedTins = void 0;
      return;
    }
    let g = [], r = [];
    const s = e.features.map((h) => {
      let f = [];
      return an(h)[0].map((m) => {
        g.length === 0 ? g = [Array.from(m), Array.from(m)] : (m[0] < g[0][0] && (g[0][0] = m[0]), m[0] > g[1][0] && (g[1][0] = m[0]), m[1] < g[0][1] && (g[0][1] = m[1]), m[1] > g[1][1] && (g[1][1] = m[1])), f.length === 0 ? f = [Array.from(m), Array.from(m)] : (m[0] < f[0][0] && (f[0][0] = m[0]), m[0] > f[1][0] && (f[1][0] = m[0]), m[1] < f[0][1] && (f[0][1] = m[1]), m[1] > f[1][1] && (f[1][1] = m[1]));
      }), f;
    }), o = (g[1][0] - g[0][0]) / n, I = (g[1][1] - g[0][1]) / n, C = s.reduce(
      (h, f, m) => {
        const y = Ct(f[0][0], g[0][0], o, n), b = Ct(f[1][0], g[0][0], o, n), v = Ct(f[0][1], g[0][1], I, n), M = Ct(f[1][1], g[0][1], I, n);
        for (let E = y; E <= b; E++) {
          h[E] || (h[E] = []);
          for (let P = v; P <= M; P++)
            h[E][P] || (h[E][P] = []), h[E][P].push(m);
        }
        return h;
      },
      []
    ), a = i.features.map((h) => {
      let f = [];
      return an(h)[0].map((m) => {
        r.length === 0 ? r = [Array.from(m), Array.from(m)] : (m[0] < r[0][0] && (r[0][0] = m[0]), m[0] > r[1][0] && (r[1][0] = m[0]), m[1] < r[0][1] && (r[0][1] = m[1]), m[1] > r[1][1] && (r[1][1] = m[1])), f.length === 0 ? f = [Array.from(m), Array.from(m)] : (m[0] < f[0][0] && (f[0][0] = m[0]), m[0] > f[1][0] && (f[1][0] = m[0]), m[1] < f[0][1] && (f[0][1] = m[1]), m[1] > f[1][1] && (f[1][1] = m[1]));
      }), f;
    }), c = (r[1][0] - r[0][0]) / n, l = (r[1][1] - r[0][1]) / n, d = a.reduce(
      (h, f, m) => {
        const y = Ct(f[0][0], r[0][0], c, n), b = Ct(f[1][0], r[0][0], c, n), v = Ct(f[0][1], r[0][1], l, n), M = Ct(f[1][1], r[0][1], l, n);
        for (let E = y; E <= b; E++) {
          h[E] || (h[E] = []);
          for (let P = v; P <= M; P++)
            h[E][P] || (h[E][P] = []), h[E][P].push(m);
        }
        return h;
      },
      []
    );
    this.indexedTins = {
      forw: {
        gridNum: n,
        xOrigin: g[0][0],
        yOrigin: g[0][1],
        xUnit: o,
        yUnit: I,
        gridCache: C
      },
      bakw: {
        gridNum: n,
        xOrigin: r[0][0],
        yOrigin: r[0][1],
        xUnit: c,
        yUnit: l,
        gridCache: d
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
  transform(t, e, i) {
    if (!this.tins)
      throw new Error("setCompiled() must be called before transform()");
    if (e && this.strict_status == nt.STATUS_ERROR)
      throw new Error('Backward transform is not allowed if strict_status == "strict_error"');
    this.yaxisMode == nt.YAXIS_FOLLOW && e && (t = [t[0], -1 * t[1]]);
    const n = Et(t);
    if (this.bounds && !e && !i && !qt(n, this.boundsPolygon))
      return !1;
    const g = e ? this.tins.bakw : this.tins.forw, r = e ? this.indexedTins.bakw : this.indexedTins.forw, s = e ? this.vertices_params.bakw : this.vertices_params.forw, o = e ? this.centroid.bakw : this.centroid.forw, I = e ? this.pointsWeightBuffer.bakw : this.pointsWeightBuffer.forw;
    let C, a;
    this.stateFull && (this.stateBackward == e ? C = this.stateTriangle : (this.stateBackward = e, this.stateTriangle = void 0), a = (l) => {
      this.stateTriangle = l;
    });
    let c = zs(
      n,
      g,
      r,
      s,
      o,
      I,
      C,
      a
    );
    if (this.bounds && e && !i) {
      const l = Et(c);
      if (!qt(l, this.boundsPolygon)) return !1;
    } else this.yaxisMode == nt.YAXIS_FOLLOW && !e && (c = [c[0], -1 * c[1]]);
    return c;
  }
}
const O = 20037508342789244e-9, hg = [
  [0, 0],
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
];
function gi(A, t) {
  return Math.floor(Math.min(A[0], A[1]) / 4) * O / 128 / Math.pow(2, t);
}
function ug(A, t) {
  const e = [];
  for (let i = 0; i < A.length; i++) {
    const n = A[i], g = n[0] * Math.cos(t) - n[1] * Math.sin(t), r = n[0] * Math.sin(t) + n[1] * Math.cos(t);
    e.push([g, r]);
  }
  return e;
}
function QA(A, t, e, i) {
  const n = gi(i, t);
  return ug(hg, e).map((g) => [
    g[0] * n + A[0],
    g[1] * n + A[1]
  ]);
}
function VA(A, t) {
  const e = A[0], i = A.slice(1, 5).map((c) => [
    c[0] - e[0],
    c[1] - e[1]
  ]), n = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0]
  ];
  let g = 0, r = 0, s = 0;
  for (let c = 0; c < 4; c++) {
    const l = i[c], d = n[c], h = Math.sqrt(Math.pow(l[0], 2) + Math.pow(l[1], 2));
    g += h;
    const f = l[0] * d[1] - l[1] * d[0], m = Math.acos(
      (l[0] * d[0] + l[1] * d[1]) / h
    ), y = f > 0 ? -1 * m : m;
    r += Math.cos(y), s += Math.sin(y);
  }
  const o = g / 4, I = Math.atan2(s, r), C = Math.floor(Math.min(t[0], t[1]) / 4), a = Math.log(C * O / 128 / o) / Math.log(2);
  return { center: e, zoom: a, rotation: I };
}
function PA(A, t) {
  const e = A[0] * (2 * O) / t - O, i = -1 * (A[1] * (2 * O) / t - O);
  return [e, i];
}
function dn(A, t) {
  const e = (A[0] + O) * t / (2 * O), i = (-A[1] + O) * t / (2 * O);
  return [e, i];
}
const xA = 256;
class fg {
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
    const e = new nt();
    if (e.setCompiled(t.compiled), this.mainTin = e, t.maxZoom !== void 0)
      this._maxxy = Math.pow(2, t.maxZoom) * xA;
    else if (t.compiled.wh) {
      const i = Math.max(t.compiled.wh[0], t.compiled.wh[1]), n = Math.ceil(Math.log2(i / xA));
      this._maxxy = Math.pow(2, n) * xA;
    }
    if (this.subTins = [], t.sub_maps)
      for (const i of t.sub_maps) {
        const n = new nt();
        n.setCompiled(i.compiled);
        const g = i.bounds ?? i.compiled.bounds;
        if (!g)
          throw new Error(
            "SubMapData must have bounds or compiled.bounds to create xyBounds polygon"
          );
        const r = [...g, g[0]], s = r.map((o) => {
          const I = n.transform(o, !1);
          if (!I) throw new Error("Failed to transform sub-map bounds to mercator");
          return I;
        });
        this.subTins.push({
          tin: n,
          priority: i.priority,
          importance: i.importance,
          xyBounds: UA([r]),
          mercBounds: UA([s])
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
    const e = this.merc2XyWithLayer(t), i = e[0] || e[1];
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
    const e = this._getTinsSortedByPriority();
    for (let i = 0; i < e.length; i++) {
      const { index: n, isMain: g } = e[i];
      if (g || qt(Et(t), this.subTins[n - 1].xyBounds)) {
        const r = this._transformByIndex(t, n, !1);
        if (r === !1) continue;
        return [n, r];
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
    return this._assertMapData(), this._getAllTinsWithIndex().map(({ index: e, tin: i, isMain: n }) => {
      const g = this._transformByIndex(t, e, !0);
      return g === !1 ? [i, e] : n || qt(Et(g), this.subTins[e - 1].xyBounds) ? [i, e, g] : [i, e];
    }).sort((e, i) => {
      const n = e[0].priority ?? 0, g = i[0].priority ?? 0;
      return n < g ? 1 : -1;
    }).reduce(
      (e, i, n, g) => {
        const r = i[0], s = i[1], o = i[2];
        if (!o) return e;
        for (let I = 0; I < n; I++) {
          const C = g[I][1], a = C === 0;
          if (g[I][2] && (a || qt(Et(o), this.subTins[C - 1].xyBounds)))
            if (e.length) {
              const c = !e[0], l = c ? e[1][2] : e[0][2], d = r.importance ?? 0, h = l.importance ?? 0;
              return c ? d < h ? e : [void 0, [s, o, r]] : [...e.filter(
                (f) => f !== void 0
              ), [s, o, r]].sort(
                (f, m) => (f[2].importance ?? 0) < (m[2].importance ?? 0) ? 1 : -1
              ).slice(0, 2);
            } else
              return [[s, o, r]];
        }
        return !e.length || !e[0] ? [[s, o, r]] : (e.push([s, o, r]), e.sort((I, C) => {
          const a = I[2].importance ?? 0, c = C[2].importance ?? 0;
          return a < c ? 1 : -1;
        }).filter((I, C) => C < 2));
      },
      []
    ).map((e) => {
      if (e)
        return [e[0], e[1]];
    });
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
    let i = !1;
    return e.map((n, g) => {
      if (!n) {
        i = !0;
        return;
      }
      const r = n[0], s = n[1];
      return g !== 0 && !i ? [this.xy2SysCoordInternal(s)] : t.map((o, I) => I === 0 ? s : this._transformByIndex(o, r, !0)).map((o) => this.xy2SysCoordInternal(o));
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
    const i = QA(t.center, t.zoom, t.rotation, e).map((s) => dn(s, this._maxxy)), n = this.xy2MercWithLayer(i[0]);
    if (!n) throw new Error("viewpoint2Mercs: center point is out of bounds");
    const g = n[0], r = n[1];
    return i.map((s, o) => {
      if (o === 0) return r;
      const I = this._transformByIndex(s, g, !1);
      if (I === !1) throw new Error(`viewpoint2Mercs: point ${o} is out of bounds`);
      return I;
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
    const i = this.merc2XyWithLayer(t[0]), n = i[0] || i[1];
    if (!n) throw new Error("mercs2Viewpoint: center point is out of bounds");
    const g = n[0], r = n[1], s = t.map((o, I) => {
      if (I === 0) return r;
      const C = this._transformByIndex(o, g, !0);
      if (C === !1) throw new Error(`mercs2Viewpoint: point ${I} is out of bounds`);
      return C;
    }).map((o) => PA(o, this._maxxy));
    return VA(s, e);
  }
  // ─── ユーティリティ（静的メソッド）────────────────────────────────────────
  /** zoom2Radius の静的ラッパー */
  static zoom2Radius(t, e) {
    return gi(t, e);
  }
  /** mercViewpoint2Mercs の静的ラッパー */
  static mercViewpoint2Mercs(t, e, i, n) {
    return QA(t, e, i, n);
  }
  /** mercs2MercViewpoint の静的ラッパー */
  static mercs2MercViewpoint(t, e) {
    return VA(t, e);
  }
  /** xy2SysCoord の静的ラッパー */
  static xy2SysCoord(t, e) {
    return PA(t, e);
  }
  /** sysCoord2Xy の静的ラッパー */
  static sysCoord2Xy(t, e) {
    return dn(t, e);
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
      const i = t.tin.priority ?? 0, n = e.tin.priority ?? 0;
      return i < n ? 1 : -1;
    });
  }
  /** メイン TIN + 全 sub TIN を index 付きで返す */
  _getAllTinsWithIndex() {
    const t = [
      { index: 0, tin: this.mainTin, isMain: !0 }
    ];
    return this.subTins.forEach((e, i) => {
      e.tin.priority = e.priority, e.tin.importance = e.importance, t.push({ index: i + 1, tin: e.tin, isMain: !1 });
    }), t;
  }
  /**
   * 指定レイヤーインデックスで TIN 変換を実行する
   * index 0 → mainTin, index 1..n → subTins[index-1]
   */
  _transformByIndex(t, e, i) {
    if (e === 0)
      return this.mainTin.transform(t, i);
    const n = this.subTins[e - 1];
    return n ? n.tin.transform(t, i, !0) : !1;
  }
  /** 内部用 xy2SysCoord（_maxxy を使用） */
  xy2SysCoordInternal(t) {
    return PA(t, this._maxxy);
  }
}
const dg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAB3RJTUUH3QgIBToaSbAjlwAAABd0RVh0U29mdHdhcmUAR0xEUE5HIHZlciAzLjRxhaThAAAACHRwTkdHTEQzAAAAAEqAKR8AAAAEZ0FNQQAAsY8L/GEFAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAFRJREFUeNrtwQEBAAAAgJD+r+4ICgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgBDwABHHIJwwAAAABJRU5ErkJggg==", Tt = 256, Ao = `<canvas width="${Tt}" height="${Tt}" src="${dg}"></canvas>`;
async function Fe(A) {
  if (typeof A == "string") {
    const t = A.match(/\//) ? A : `pois/${A}`, e = await fetch(t);
    if (!e.ok)
      throw new Error("Fail to load poi json");
    return await e.json();
  } else
    return A;
}
const mg = ["hide", "title", "icon", "selectedIcon"], io = [
  "lnglat",
  "lng",
  "lat",
  "longitude",
  "latitude"
];
function HA(A) {
  return typeof A == "object" && A !== null && !Array.isArray(A);
}
function YA(A) {
  if (!HA(A) || A.type === "FeatureCollection") return !1;
  const t = A.layer, e = typeof t == "string", i = HA(t) && t.type === "FeatureCollection";
  return !(!e && !i || io.some((n) => A[n] !== void 0));
}
function no(A) {
  return YA(A) && mg.some((t) => A[t] !== void 0);
}
function mn(A) {
  const t = {};
  for (const [e, i] of Object.entries(A))
    if (e !== "layer") {
      if (mg.includes(e)) {
        t[e] = i;
        continue;
      }
      console.warn(`[Maplat] pois layer ref: unknown override key ignored: ${e}`);
    }
  return t;
}
function pn(A, t) {
  if (!t) return A;
  t.hide === !0 && (A.hide = !0);
  const e = t.title;
  (typeof e == "string" ? e !== "" : HA(e) && Object.keys(e).length > 0) && (A.name = e);
  for (const i of ["icon", "selectedIcon"]) {
    const n = t[i];
    typeof n == "string" && n !== "" && (A[i] = n);
  }
  return A;
}
async function pg(A, t) {
  if (A = await Fe(A), Array.isArray(A))
    if (A = await Promise.all(
      A.map(async (e) => await Fe(e))
    ), A.length > 0 && (A[0].type === "FeatureCollection" || YA(A[0]))) {
      const e = await Promise.all(
        A.map(async (i, n) => {
          let g, r;
          YA(i) ? (g = await Fe(i.layer), r = mn(i)) : (g = i, r = null);
          let s = g.id || g.properties && g.properties.id;
          if (!s)
            if (n === 0) s = "main";
            else throw "POI layers include bad key setting";
          const o = vt(g, s, t);
          return [s, pn(o, r)];
        })
      );
      A = Object.fromEntries(e);
    } else
      A = {
        main: vt(A, "main", t)
      };
  else if (A.type === "FeatureCollection") {
    const e = A.id || A.properties && A.properties.id || "main";
    A = { [e]: vt(A, e, t) };
  } else if (no(A)) {
    const e = await Fe(A.layer), i = e.id || e.properties && e.properties.id || "main", n = vt(e, i, t);
    A = { [i]: pn(n, mn(A)) };
  } else
    Object.keys(A).map((e) => {
      A[e] = vt(A[e], e, t);
    });
  return A.main || (A.main = vt([], "main", t)), Object.keys(A).map((e) => {
    ri(A, e, t);
  }), A;
}
function vt(A, t, e) {
  if (Array.isArray(A))
    A = {
      pois: A.map((i) => me(i))
    };
  else if (A.type === "FeatureCollection") {
    const i = Object.assign({}, A.properties || {});
    A.name && (i.name = A.name), i.pois = A.features.map((n) => me(n)), A = i;
  }
  if (typeof A.id > "u")
    A.id = t;
  else if (A.id !== t) throw "POI layers include bad key setting";
  return A.namespaceID || (A.namespaceID = `${e.namespace ? `${e.namespace}#` : ""}${t}`), A.name || (A.name = t === "main" ? e.name : t), A.pois || (A.pois = []), A;
}
function me(A) {
  if (A.type === "Feature") {
    const t = Object.assign({}, A.properties || {});
    t.lnglat = A.geometry.coordinates, t.id || (t.id = A.id), t.name || (t.name = A.name), A = t;
  }
  return A.lnglat || (A.lnglat = [A.lng || A.longitude, A.lat || A.latitude]), delete A.lng, delete A.lat, delete A.longitude, delete A.latitude, A;
}
function ri(A, t, e) {
  if (!A[t]) return;
  const i = A[t], n = i.pois;
  i.__nextId || (i.__nextId = 0), n.map((g) => {
    g.id || (g.id = `${t}_${i.__nextId}`, i.__nextId++), g.namespaceID || (g.namespaceID = `${e.namespace ? `${e.namespace}#` : ""}${g.id}`);
  });
}
function pe(A, t, e = {}) {
  const i = { type: "Feature" };
  return (e.id === 0 || e.id) && (i.id = e.id), e.bbox && (i.bbox = e.bbox), i.properties = t || {}, i.geometry = A, i;
}
function yg(A, t, e = {}) {
  if (!A)
    throw new Error("coordinates is required");
  if (!Array.isArray(A))
    throw new Error("coordinates must be an Array");
  if (A.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!wn(A[0]) || !wn(A[1]))
    throw new Error("coordinates must contain numbers");
  return pe({
    type: "Point",
    coordinates: A
  }, t, e);
}
function wg(A, t, e = {}) {
  for (const n of A) {
    if (n.length < 4)
      throw new Error(
        "Each LinearRing of a Polygon must have 4 or more Positions."
      );
    if (n[n.length - 1].length !== n[0].length)
      throw new Error("First and last Position are not equivalent.");
    for (let g = 0; g < n[n.length - 1].length; g++)
      if (n[n.length - 1][g] !== n[0][g])
        throw new Error("First and last Position are not equivalent.");
  }
  return pe({
    type: "Polygon",
    coordinates: A
  }, t, e);
}
function go(A, t, e = {}) {
  if (A.length < 2)
    throw new Error("coordinates must be an array of two or more positions");
  return pe({
    type: "LineString",
    coordinates: A
  }, t, e);
}
function yn(A, t = {}) {
  const e = { type: "FeatureCollection" };
  return t.id && (e.id = t.id), t.bbox && (e.bbox = t.bbox), e.features = A, e;
}
function wn(A) {
  return !isNaN(A) && A !== null && !Array.isArray(A);
}
function ro(A) {
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
function so(A) {
  return A.type === "Feature" ? A.geometry : A;
}
function vg(A, t, e) {
  if (A !== null)
    for (var i, n, g, r, s, o, I, C = 0, a = 0, c, l = A.type, d = l === "FeatureCollection", h = l === "Feature", f = d ? A.features.length : 1, m = 0; m < f; m++) {
      I = d ? (
        // @ts-expect-error: Known type conflict
        A.features[m].geometry
      ) : h ? (
        // @ts-expect-error: Known type conflict
        A.geometry
      ) : A, c = I ? I.type === "GeometryCollection" : !1, s = c ? I.geometries.length : 1;
      for (var y = 0; y < s; y++) {
        var b = 0, v = 0;
        if (r = c ? I.geometries[y] : I, r !== null) {
          o = r.coordinates;
          var M = r.type;
          switch (C = M === "Polygon" || M === "MultiPolygon" ? 1 : 0, M) {
            case null:
              break;
            case "Point":
              if (
                // @ts-expect-error: Known type conflict
                t(
                  o,
                  a,
                  m,
                  b,
                  v
                ) === !1
              )
                return !1;
              a++, b++;
              break;
            case "LineString":
            case "MultiPoint":
              for (i = 0; i < o.length; i++) {
                if (
                  // @ts-expect-error: Known type conflict
                  t(
                    o[i],
                    a,
                    m,
                    b,
                    v
                  ) === !1
                )
                  return !1;
                a++, M === "MultiPoint" && b++;
              }
              M === "LineString" && b++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (i = 0; i < o.length; i++) {
                for (n = 0; n < o[i].length - C; n++) {
                  if (
                    // @ts-expect-error: Known type conflict
                    t(
                      o[i][n],
                      a,
                      m,
                      b,
                      v
                    ) === !1
                  )
                    return !1;
                  a++;
                }
                M === "MultiLineString" && b++, M === "Polygon" && v++;
              }
              M === "Polygon" && b++;
              break;
            case "MultiPolygon":
              for (i = 0; i < o.length; i++) {
                for (v = 0, n = 0; n < o[i].length; n++) {
                  for (g = 0; g < o[i][n].length - C; g++) {
                    if (
                      // @ts-expect-error: Known type conflict
                      t(
                        o[i][n][g],
                        a,
                        m,
                        b,
                        v
                      ) === !1
                    )
                      return !1;
                    a++;
                  }
                  v++;
                }
                b++;
              }
              break;
            case "GeometryCollection":
              for (i = 0; i < r.geometries.length; i++)
                if (
                  // @ts-expect-error: Known type conflict
                  vg(r.geometries[i], t) === !1
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
const dt = 11102230246251565e-32, V = 134217729, oo = (3 + 8 * dt) * dt;
function SA(A, t, e, i, n) {
  let g, r, s, o, I = t[0], C = i[0], a = 0, c = 0;
  C > I == C > -I ? (g = I, I = t[++a]) : (g = C, C = i[++c]);
  let l = 0;
  if (a < A && c < e)
    for (C > I == C > -I ? (r = I + g, s = g - (r - I), I = t[++a]) : (r = C + g, s = g - (r - C), C = i[++c]), g = r, s !== 0 && (n[l++] = s); a < A && c < e; )
      C > I == C > -I ? (r = g + I, o = r - g, s = g - (r - o) + (I - o), I = t[++a]) : (r = g + C, o = r - g, s = g - (r - o) + (C - o), C = i[++c]), g = r, s !== 0 && (n[l++] = s);
  for (; a < A; )
    r = g + I, o = r - g, s = g - (r - o) + (I - o), I = t[++a], g = r, s !== 0 && (n[l++] = s);
  for (; c < e; )
    r = g + C, o = r - g, s = g - (r - o) + (C - o), C = i[++c], g = r, s !== 0 && (n[l++] = s);
  return (g !== 0 || l === 0) && (n[l++] = g), l;
}
function Io(A, t) {
  let e = t[0];
  for (let i = 1; i < A; i++) e += t[i];
  return e;
}
function xe(A) {
  return new Float64Array(A);
}
const Co = (3 + 16 * dt) * dt, ao = (2 + 12 * dt) * dt, co = (9 + 64 * dt) * dt * dt, Wt = xe(4), vn = xe(8), bn = xe(12), Mn = xe(16), J = xe(4);
function lo(A, t, e, i, n, g, r) {
  let s, o, I, C, a, c, l, d, h, f, m, y, b, v, M, E, P, x;
  const T = A - n, k = e - n, D = t - g, L = i - g;
  v = T * L, c = V * T, l = c - (c - T), d = T - l, c = V * L, h = c - (c - L), f = L - h, M = d * f - (v - l * h - d * h - l * f), E = D * k, c = V * D, l = c - (c - D), d = D - l, c = V * k, h = c - (c - k), f = k - h, P = d * f - (E - l * h - d * h - l * f), m = M - P, a = M - m, Wt[0] = M - (m + a) + (a - P), y = v + m, a = y - v, b = v - (y - a) + (m - a), m = b - E, a = b - m, Wt[1] = b - (m + a) + (a - E), x = y + m, a = x - y, Wt[2] = y - (x - a) + (m - a), Wt[3] = x;
  let X = Io(4, Wt), H = ao * r;
  if (X >= H || -X >= H || (a = A - T, s = A - (T + a) + (a - n), a = e - k, I = e - (k + a) + (a - n), a = t - D, o = t - (D + a) + (a - g), a = i - L, C = i - (L + a) + (a - g), s === 0 && o === 0 && I === 0 && C === 0) || (H = co * r + oo * Math.abs(X), X += T * C + L * s - (D * I + k * o), X >= H || -X >= H)) return X;
  v = s * L, c = V * s, l = c - (c - s), d = s - l, c = V * L, h = c - (c - L), f = L - h, M = d * f - (v - l * h - d * h - l * f), E = o * k, c = V * o, l = c - (c - o), d = o - l, c = V * k, h = c - (c - k), f = k - h, P = d * f - (E - l * h - d * h - l * f), m = M - P, a = M - m, J[0] = M - (m + a) + (a - P), y = v + m, a = y - v, b = v - (y - a) + (m - a), m = b - E, a = b - m, J[1] = b - (m + a) + (a - E), x = y + m, a = x - y, J[2] = y - (x - a) + (m - a), J[3] = x;
  const xt = SA(4, Wt, 4, J, vn);
  v = T * C, c = V * T, l = c - (c - T), d = T - l, c = V * C, h = c - (c - C), f = C - h, M = d * f - (v - l * h - d * h - l * f), E = D * I, c = V * D, l = c - (c - D), d = D - l, c = V * I, h = c - (c - I), f = I - h, P = d * f - (E - l * h - d * h - l * f), m = M - P, a = M - m, J[0] = M - (m + a) + (a - P), y = v + m, a = y - v, b = v - (y - a) + (m - a), m = b - E, a = b - m, J[1] = b - (m + a) + (a - E), x = y + m, a = x - y, J[2] = y - (x - a) + (m - a), J[3] = x;
  const R = SA(xt, vn, 4, J, bn);
  v = s * C, c = V * s, l = c - (c - s), d = s - l, c = V * C, h = c - (c - C), f = C - h, M = d * f - (v - l * h - d * h - l * f), E = o * I, c = V * o, l = c - (c - o), d = o - l, c = V * I, h = c - (c - I), f = I - h, P = d * f - (E - l * h - d * h - l * f), m = M - P, a = M - m, J[0] = M - (m + a) + (a - P), y = v + m, a = y - v, b = v - (y - a) + (m - a), m = b - E, a = b - m, J[1] = b - (m + a) + (a - E), x = y + m, a = x - y, J[2] = y - (x - a) + (m - a), J[3] = x;
  const $ = SA(R, bn, 4, J, Mn);
  return Mn[$ - 1];
}
function ho(A, t, e, i, n, g) {
  const r = (t - g) * (e - n), s = (A - n) * (i - g), o = r - s, I = Math.abs(r + s);
  return Math.abs(o) >= Co * I ? o : -lo(A, t, e, i, n, g, I);
}
function uo(A, t) {
  var e, i, n = 0, g, r, s, o, I, C, a, c = A[0], l = A[1], d = t.length;
  for (e = 0; e < d; e++) {
    i = 0;
    var h = t[e], f = h.length - 1;
    if (C = h[0], C[0] !== h[f][0] && C[1] !== h[f][1])
      throw new Error("First and last coordinates in a ring must be the same");
    for (r = C[0] - c, s = C[1] - l, i; i < f; i++) {
      if (a = h[i + 1], o = a[0] - c, I = a[1] - l, s === 0 && I === 0) {
        if (o <= 0 && r >= 0 || r <= 0 && o >= 0)
          return 0;
      } else if (I >= 0 && s <= 0 || I <= 0 && s >= 0) {
        if (g = ho(r, o, s, I, 0, 0), g === 0)
          return 0;
        (g > 0 && I > 0 && s <= 0 || g < 0 && I <= 0 && s > 0) && n++;
      }
      C = a, s = I, r = o;
    }
  }
  return n % 2 !== 0;
}
function fo(A, t, e = {}) {
  if (!A)
    throw new Error("point is required");
  if (!t)
    throw new Error("polygon is required");
  const i = ro(A), n = so(t), g = n.type, r = t.bbox;
  let s = n.coordinates;
  if (r && mo(i, r) === !1)
    return !1;
  g === "Polygon" && (s = [s]);
  let o = !1;
  for (var I = 0; I < s.length; ++I) {
    const C = uo(i, s[I]);
    if (C === 0) return !e.ignoreBoundary;
    C && (o = !0);
  }
  return o;
}
function mo(A, t) {
  return t[0] <= A[0] && t[1] <= A[1] && t[2] >= A[0] && t[3] >= A[1];
}
class bg {
  constructor(t = [], e = po) {
    if (this.data = t, this.length = this.data.length, this.compare = e, this.length > 0)
      for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
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
    const { data: e, compare: i } = this, n = e[t];
    for (; t > 0; ) {
      const g = t - 1 >> 1, r = e[g];
      if (i(n, r) >= 0) break;
      e[t] = r, t = g;
    }
    e[t] = n;
  }
  _down(t) {
    const { data: e, compare: i } = this, n = this.length >> 1, g = e[t];
    for (; t < n; ) {
      let r = (t << 1) + 1, s = e[r];
      const o = r + 1;
      if (o < this.length && i(e[o], s) < 0 && (r = o, s = e[o]), i(s, g) >= 0) break;
      e[t] = s, t = r;
    }
    e[t] = g;
  }
}
function po(A, t) {
  return A < t ? -1 : A > t ? 1 : 0;
}
function Mg(A, t) {
  return A.p.x > t.p.x ? 1 : A.p.x < t.p.x ? -1 : A.p.y !== t.p.y ? A.p.y > t.p.y ? 1 : -1 : 1;
}
function yo(A, t) {
  return A.rightSweepEvent.p.x > t.rightSweepEvent.p.x ? 1 : A.rightSweepEvent.p.x < t.rightSweepEvent.p.x ? -1 : A.rightSweepEvent.p.y !== t.rightSweepEvent.p.y ? A.rightSweepEvent.p.y < t.rightSweepEvent.p.y ? 1 : -1 : 1;
}
class En {
  constructor(t, e, i, n) {
    this.p = {
      x: t[0],
      y: t[1]
    }, this.featureId = e, this.ringId = i, this.eventId = n, this.otherEvent = null, this.isLeftEndpoint = null;
  }
  isSamePoint(t) {
    return this.p.x === t.p.x && this.p.y === t.p.y;
  }
}
function wo(A, t) {
  if (A.type === "FeatureCollection") {
    const e = A.features;
    for (let i = 0; i < e.length; i++)
      Rn(e[i], t);
  } else
    Rn(A, t);
}
let Ue = 0, We = 0, Qe = 0;
function Rn(A, t) {
  const e = A.type === "Feature" ? A.geometry : A;
  let i = e.coordinates;
  (e.type === "Polygon" || e.type === "MultiLineString") && (i = [i]), e.type === "LineString" && (i = [[i]]);
  for (let n = 0; n < i.length; n++)
    for (let g = 0; g < i[n].length; g++) {
      let r = i[n][g][0], s = null;
      We = We + 1;
      for (let o = 0; o < i[n][g].length - 1; o++) {
        s = i[n][g][o + 1];
        const I = new En(r, Ue, We, Qe), C = new En(s, Ue, We, Qe + 1);
        I.otherEvent = C, C.otherEvent = I, Mg(I, C) > 0 ? (C.isLeftEndpoint = !0, I.isLeftEndpoint = !1) : (I.isLeftEndpoint = !0, C.isLeftEndpoint = !1), t.push(I), t.push(C), r = s, Qe = Qe + 1;
      }
    }
  Ue = Ue + 1;
}
class vo {
  constructor(t) {
    this.leftSweepEvent = t, this.rightSweepEvent = t.otherEvent;
  }
}
function bo(A, t) {
  if (A === null || t === null || A.leftSweepEvent.ringId === t.leftSweepEvent.ringId && (A.rightSweepEvent.isSamePoint(t.leftSweepEvent) || A.rightSweepEvent.isSamePoint(t.leftSweepEvent) || A.rightSweepEvent.isSamePoint(t.rightSweepEvent) || A.leftSweepEvent.isSamePoint(t.leftSweepEvent) || A.leftSweepEvent.isSamePoint(t.rightSweepEvent))) return !1;
  const e = A.leftSweepEvent.p.x, i = A.leftSweepEvent.p.y, n = A.rightSweepEvent.p.x, g = A.rightSweepEvent.p.y, r = t.leftSweepEvent.p.x, s = t.leftSweepEvent.p.y, o = t.rightSweepEvent.p.x, I = t.rightSweepEvent.p.y, C = (I - s) * (n - e) - (o - r) * (g - i), a = (o - r) * (i - s) - (I - s) * (e - r), c = (n - e) * (i - s) - (g - i) * (e - r);
  if (C === 0)
    return !1;
  const l = a / C, d = c / C;
  if (l >= 0 && l <= 1 && d >= 0 && d <= 1) {
    const h = e + l * (n - e), f = i + l * (g - i);
    return [h, f];
  }
  return !1;
}
function Mo(A, t) {
  t = t || !1;
  const e = [], i = new bg([], yo);
  for (; A.length; ) {
    const n = A.pop();
    if (n.isLeftEndpoint) {
      const g = new vo(n);
      for (let r = 0; r < i.data.length; r++) {
        const s = i.data[r];
        if (t && s.leftSweepEvent.featureId === n.featureId)
          continue;
        const o = bo(g, s);
        o !== !1 && e.push(o);
      }
      i.push(g);
    } else n.isLeftEndpoint === !1 && i.pop();
  }
  return e;
}
function Eo(A, t) {
  const e = new bg([], Mg);
  return wo(A, e), Mo(e, t);
}
var Ro = Eo;
function Po(A, t, e = {}) {
  const { removeDuplicates: i = !0, ignoreSelfIntersections: n = !0 } = e;
  let g = [];
  A.type === "FeatureCollection" ? g = g.concat(A.features) : A.type === "Feature" ? g.push(A) : (A.type === "LineString" || A.type === "Polygon" || A.type === "MultiLineString" || A.type === "MultiPolygon") && g.push(pe(A)), t.type === "FeatureCollection" ? g = g.concat(t.features) : t.type === "Feature" ? g.push(t) : (t.type === "LineString" || t.type === "Polygon" || t.type === "MultiLineString" || t.type === "MultiPolygon") && g.push(pe(t));
  const r = Ro(
    yn(g),
    n
  );
  let s = [];
  if (i) {
    const o = {};
    r.forEach((I) => {
      const C = I.join(",");
      o[C] || (o[C] = !0, s.push(I));
    });
  } else
    s = r;
  return yn(s.map((o) => yg(o)));
}
function xo(A) {
  return A && A.__esModule && Object.prototype.hasOwnProperty.call(A, "default") ? A.default : A;
}
function So(A, t = {}) {
  let e = 0, i = 0, n = 0;
  return vg(
    A,
    function(g) {
      e += g[0], i += g[1], n++;
    }
  ), yg([e / n, i / n], t.properties);
}
function Eg(A) {
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
    initialize(i) {
      if (i = ct(i), this.mapID = i.mapID, this.homePosition = i.homePosition, this.mercZoom = i.mercZoom, this.label = i.label, this.maxZoom = i.maxZoom, this.minZoom = i.minZoom, this.poiTemplate = i.poiTemplate, this.poiStyle = i.poiStyle, this.iconTemplate = i.iconTemplate, this.icon = i.icon, this.selectedIcon = i.selectedIcon, this.mercatorXShift = i.mercatorXShift, this.mercatorYShift = i.mercatorYShift, this.weiwudi = i.weiwudi, i.envelopeLngLats) {
        const s = i.envelopeLngLats.map(
          (o) => et(o, "EPSG:4326", "EPSG:3857")
        );
        s.push(s[0]), this.envelope = wg([s]), this.centroid = So(this.envelope).geometry?.coordinates;
      }
      for (let r = 0; r < ye.length; r++) {
        const s = ye[r], o = Bo[r];
        this.set(s, i[o] || i[s]);
      }
      const n = i.thumbnail ? new Promise((r) => {
        this.thumbnail = i.thumbnail, r(void 0);
      }) : new Promise((r) => {
        this.thumbnail = `./tmbs/${i.mapID}.jpg`, fetch(this.thumbnail).then((s) => {
          s.ok || (this.thumbnail = `./tmbs/${i.mapID}_menu.jpg`), r(void 0);
        }).catch((s) => {
          this.thumbnail = `./tmbs/${i.mapID}_menu.jpg`, r(void 0);
        });
      }).catch((r) => {
        this.thumbnail = `./tmbs/${i.mapID || i.sourceID}_menu.jpg`;
      }), g = this.resolvePois(i.pois);
      this.initialWait = Promise.all([g, n]), To(this);
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
          const n = (r) => {
            i(r.type, r.detail);
          }, g = (r) => {
            this.weiwudi.removeEventListener("proceed", n), this.weiwudi.removeEventListener("finish", g), this.weiwudi.removeEventListener("stop", g), this.weiwudi.removeEventListener("canceled", g), n(r);
          };
          this.weiwudi.addEventListener("proceed", n), this.weiwudi.addEventListener("finish", g), this.weiwudi.addEventListener("stop", g), this.weiwudi.addEventListener("canceled", g), await this.weiwudi.fetchAll();
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
      let n, g;
      const r = i.mercZoom, s = i.zoom, o = i.direction, I = i.rotation, a = this.getMap()?.getView();
      i.latitude !== void 0 && i.longitude !== void 0 && (n = et(
        [i.longitude, i.latitude],
        "EPSG:4326",
        "EPSG:3857"
      )), i.x !== void 0 && i.y != null && (g = [i.x, i.y]), this.viewpoint2MercsAsync().then((c) => this.mercs2MercViewpoint(c)).then((c) => {
        const l = this.mercViewpoint2Mercs([
          n || c[0],
          r || c[1] || 17,
          o ?? I ?? c[2]
        ]);
        this.mercs2ViewpointAsync(l).then((d) => {
          n != null ? a?.setCenter(d[0]) : g != null && a?.setCenter(g), r != null ? a?.setZoom(d[1]) : s != null && a?.setZoom(s), o != null ? a?.setRotation(d[2]) : I != null && a?.setRotation(I);
        });
      });
    }
    setViewpoint(i) {
      const n = { ...i };
      n.rotation && (n.rotation = n.rotation * Math.PI / 180), n.direction && (n.direction = n.direction * Math.PI / 180), this.setViewpointRadian(n);
    }
    goHome() {
      const n = this.getMap();
      let g = n.getTarget();
      typeof g == "string" && (g = document.getElementById(g));
      const r = n.homeMarginPixels, s = [
        (g.clientWidth - r - 10) * 1,
        (g.clientHeight - r - 10) * 1
      ], o = {
        longitude: this.homePosition[0],
        latitude: this.homePosition[1],
        zoom: this.defZoom(s)
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
    setGPSMarkerAsync(i, n = !1) {
      const g = this.getMap(), r = g?.getView();
      if (!i)
        return new Promise((o, I) => {
          g?.setGPSPosition(null), o(!0);
        });
      const s = this.mercsFromGPSValue(i.lnglat, i.acc);
      return this.mercs2SysCoordsAsync_multiLayer([s]).then((o) => {
        const I = !o[0], C = I ? o[1] : o[0], a = I ? null : o[1], c = { xy: C[0][0] };
        if (!this.insideCheckSysCoord(C[0][0])) return !1;
        const l = C[0].slice(1);
        return c.rad = l.reduce(
          (d, h, f) => {
            const m = d + Math.sqrt(
              Math.pow(h[0] - c.xy[0], 2) + Math.pow(h[1] - c.xy[1], 2)
            );
            return f === 3 ? m / 4 : m;
          },
          0
        ), n || r?.setCenter(c.xy), g?.setGPSPosition(c, I ? "hide" : null), a && g?.setGPSPosition({ xy: a[0][0] }, "sub"), !0;
      }).catch((o) => {
        throw o;
      });
    }
    setGPSMarker(i, n = !1) {
      this.setGPSMarkerAsync(i, n).then(() => {
      });
    }
    mercsFromGPSValue(i, n) {
      const g = et(i, "EPSG:4326", "EPSG:3857"), r = i[1] * Math.PI / 180, s = n / Math.cos(r);
      return hg.map((o) => [
        o[0] * s + g[0],
        o[1] * s + g[1]
      ]);
    }
    // 与えられた差分行列を回転。theta無指定の場合は自動取得
    rotateMatrix(i, n) {
      return n === void 0 && (n = this.getMap().getView().getRotation()), ug(i, n);
    }
    async resolvePois(i) {
      this.pois = await pg(i || [], {
        name: this.officialTitle || this.title,
        namespace: this.mapID
      });
    }
    getPoi(i) {
      let n;
      return Object.keys(this.pois).map((g) => {
        this.pois[g].pois.map((r, s) => {
          r.id === i && (n = this.pois[g].pois[s]);
        });
      }), n;
    }
    addPoi(i, n) {
      if (n || (n = "main"), this.pois[n])
        return i = me(i), this.pois[n].pois.push(i), ri(this.pois, n, {
          name: this.officialTitle || this.title,
          namespace: this.mapID
        }), i.namespaceID;
    }
    removePoi(i) {
      Object.keys(this.pois).map((n) => {
        this.pois[n].pois.map((g, r) => {
          g.id === i && delete this.pois[n].pois[r];
        });
      });
    }
    clearPoi(i) {
      i || (i = "main"), i === "all" ? Object.keys(this.pois).map((n) => {
        this.pois[n].pois = [];
      }) : this.pois[i] && (this.pois[i].pois = []);
    }
    listPoiLayers(i = !1, n = !1) {
      return Object.keys(this.pois).sort((g, r) => g === "main" ? -1 : r === "main" ? 1 : 0).map((g) => this.pois[g]).filter(
        (g) => n ? i ? g.pois.length && g.hide : g.pois.length : i ? g.hide : !0
      );
    }
    getPoiLayer(i) {
      return this.pois[i];
    }
    addPoiLayer(i, n) {
      i !== "main" && (this.pois[i] || (this.pois[i] = vt(n || [], i, {
        name: this.officialTitle || this.title,
        namespace: this.mapID
      })));
    }
    removePoiLayer(i) {
      i !== "main" && this.pois[i] && delete this.pois[i];
    }
    merc2SysCoordAsync_ignoreBackground(i) {
      return this.merc2XyAsync_ignoreBackground(i).then(
        (n) => n ? this.xy2SysCoord(n) : void 0
      );
    }
    merc2SysCoordAsync(i) {
      return this.merc2XyAsync(i).then(
        (n) => n && this.xy2SysCoord(n)
      );
    }
    sysCoord2MercAsync(i) {
      const n = this.sysCoord2Xy(i);
      return this.xy2MercAsync(n);
    }
    // size(画面サイズ)とズームから、地図面座標上での半径を得る。zoom無指定の場合は自動取得
    zoom2Radius(i, n) {
      return n === void 0 && (n = this.getMap().getView().getDecimalZoom()), gi(i, n);
    }
    // 画面サイズと地図ズームから、地図面座標上での5座標を取得する。zoom, rotate無指定の場合は自動取得
    viewpoint2SysCoords(i, n) {
      return this.mercViewpoint2Mercs(i, n);
    }
    mercViewpoint2Mercs(i, n) {
      let g = i ? i[0] : void 0;
      const r = i ? i[1] : void 0, s = i ? i[2] : void 0;
      g === void 0 && (g = this.getMap().getView().getCenter()), n === void 0 && (n = this.getMap().getSize());
      const o = r ?? this.getMap().getView().getDecimalZoom(), I = s ?? this.getMap().getView().getRotation();
      return [QA(
        g,
        o,
        I,
        n
      ), n];
    }
    // 地図座標5地点情報から地図サイズ情報（中心座標、サイズ、回転）を得る
    sysCoords2Viewpoint(i) {
      return this.mercs2MercViewpoint(i);
    }
    // メルカトル5地点情報からメルカトル地図でのサイズ情報（中心座標、サイズ、回転）を得る
    mercs2MercViewpoint(i) {
      let n = i[1];
      n || (n = this.getMap().getSize());
      const g = VA(
        i[0],
        n
      );
      return [g.center, g.zoom, g.rotation];
    }
    sysCoords2Xys(i) {
      return [
        i[0].map((n) => this.sysCoord2Xy(n)),
        i[1]
      ];
    }
    xys2SysCoords(i) {
      return [i[0].map((n) => this.xy2SysCoord(n)), i[1]];
    }
    mercs2XysAsync(i) {
      return Promise.all(i[0].map((n) => this.merc2XyAsync(n))).then(
        (n) => [n, i[1]]
      );
    }
    xys2MercsAsync(i) {
      return Promise.all(i[0].map((n) => this.xy2MercAsync(n))).then(
        (n) => [n, i[1]]
      );
    }
    static async createAsync(i) {
      return new this(i);
    }
  }
  return t;
}
function Rg(A) {
  class t extends Eg(A) {
    static isBasemap_ = !0;
    static isWmts_ = !0;
    insideCheckXy(i) {
      return this.envelope ? fo(i, this.envelope) : !0;
    }
    insideCheckSysCoord(i) {
      return this.insideCheckXy(i);
    }
    modulateXyInside(i) {
      if (!this.centroid) return i;
      const n = go([i, this.centroid]), g = Po(this.envelope, n);
      return g.features.length > 0 && g.features[0].geometry ? g.features[0].geometry.coordinates : i;
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
    viewpoint2MercsAsync(i, n) {
      const g = this.viewpoint2SysCoords(i, n), r = this.sysCoords2Xys(g);
      return this.xys2MercsAsync(r);
    }
    mercs2ViewpointAsync(i) {
      return this.mercs2XysAsync(i).then((n) => {
        const g = this.xys2SysCoords(n);
        return this.sysCoords2Viewpoint(g);
      });
    }
    mercs2SysCoordsAsync_multiLayer(i) {
      return Promise.all(
        i[0].map((n) => this.merc2SysCoordAsync(n))
      ).then((n) => [[n, i[1]]]);
    }
    defZoom() {
      return this.mercZoom;
    }
  }
  return t;
}
function Do(A) {
  class t extends Eg(A) {
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
      const n = i[0] / (this.width / 2) - 1, g = i[1] / (this.height / 2) - 1, r = Math.max(Math.abs(n), Math.abs(g));
      return [
        (n / r + 1) * this.width / 2,
        (g / r + 1) * this.height / 2
      ];
    }
    modulateSysCoordInside(i) {
      const n = this.sysCoord2Xy(i), g = this.modulateXyInside(n);
      return this.xy2SysCoord(g);
    }
    // unifyTerm対応
    // https://github.com/code4history/MaplatCore/issues/19
    xy2SysCoord(i) {
      const n = i[0] * (2 * O) / this._maxxy - O, g = -1 * (i[1] * (2 * O) / this._maxxy - O);
      return [n, g];
    }
    sysCoord2Xy(i) {
      const n = (i[0] + O) * this._maxxy / (2 * O), g = (-i[1] + O) * this._maxxy / (2 * O);
      return [n, g];
    }
    defZoom(i) {
      const n = i[0], g = i[1], r = Math.log2((n - 10) / this.width), s = Math.log2((g - 10) / this.height), o = this.maxZoom;
      let I;
      return s > r ? I = s : I = r, o + I;
    }
  }
  return t;
}
const ye = [
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
], Bo = [
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
function Pg(A) {
  return A = ct(A), A.imageExtension || (A.imageExtension = "jpg"), A.mapID && !A.url && !A.urls && (A.url = A.tms ? `tiles/${A.mapID}/{z}/{x}/{-y}.${A.imageExtension}` : `tiles/${A.mapID}/{z}/{x}/{y}.${A.imageExtension}`), A;
}
function To(A) {
  const t = A;
  A.setTileLoadFunction(
    (function() {
      const e = t.getTileLoadFunction(), i = function(n, g, r, s, o, I, C) {
        return new Promise((a, c) => {
          const l = function(d, h = void 0) {
            const f = document.createElement("img");
            f.crossOrigin = "Anonymous", f.onload = f.onerror = function() {
              if (f.width && f.height) {
                const m = r.getContext("2d"), y = s === 0 ? 256 - I : 0, b = o === 0 ? 256 - C : 0;
                I = s + I > f.width ? f.width - s : I, C = o + C > f.height ? f.height - o : C, m.drawImage(f, s, o, I, C, y, b, I, C), a(void 0);
              } else
                h ? l(h) : a("tileLoadError");
            }, f.src = d;
          };
          l(g);
        });
      };
      return function(n, g) {
        const r = n.tileCoord[0];
        let s = n.tileCoord[1], o = n.tileCoord[2], I = Math.round(
          (t.mercatorXShift || 0) * 128 * Math.pow(2, r) / O
        ), C = Math.round(
          (t.mercatorYShift || 0) * -128 * Math.pow(2, r) / O
        );
        for (; I < 0 || I >= 256; )
          I < 0 ? (I = I + 256, s++) : (I = I - 256, s--);
        for (; C < 0 || C >= 256; )
          C < 0 ? (C = C + 256, o++) : (C = C - 256, o--);
        const a = document.createElement("div");
        a.innerHTML = Ao;
        const c = a.childNodes[0], l = [
          [[r, s, o], 0, 0, 256 - I, 256 - C]
        ];
        I !== 0 && l.push([
          [r, s - 1, o],
          256 - I,
          0,
          I,
          256 - C
        ]), C !== 0 && (l.push([
          [r, s, o - 1],
          0,
          256 - C,
          256 - I,
          C
        ]), I !== 0 && l.push([
          [r, s - 1, o - 1],
          256 - I,
          256 - C,
          I,
          C
        ])), Promise.all(
          l.map((d) => {
            const h = t.tileUrlFunction(
              d[0],
              t.tilePixelRatio_,
              t.projection_
            );
            return i(
              d[0],
              h,
              c,
              d[1],
              d[2],
              d[3],
              d[4]
            );
          })
        ).then((d) => {
          if (d.reduce((f, m) => f && m, !0))
            n.handleImageError_();
          else {
            const f = c.toDataURL(), m = n.getImage();
            m.crossOrigin = null, e(n, f);
          }
        }).catch((d) => {
          n.handleImageError_();
        });
      };
    })()
  );
}
function ce(A) {
  const t = document, e = t.createDocumentFragment(), i = [];
  A = A.replace(/(<\/?)d([ >])/g, "$1div$2").replace(/(<\/?)s([ >])/g, "$1span$2").replace(/ din="/g, ' data-i18n="').replace(/ dinh="/g, ' data-i18n-html="').replace(/ c="/g, ' class="');
  const n = e.appendChild(t.createElement("div"));
  n.innerHTML = A;
  for (let g = 0; g < n.childNodes.length; g++) {
    const r = n.childNodes[g];
    if (r.nodeName && r.nodeName.toLowerCase() === "script") {
      const s = t.createElement("script");
      r.type && (s.type = r.type), r.src ? s.src = r.src : s.text = r.text, i[g] = s;
    } else
      i[g] = r;
  }
  return i;
}
function Ve(A) {
  for (; !(A <= 180 && A > -180); ) {
    const t = A > 0 ? -1 : 1;
    A = A + t * 360;
  }
  return A;
}
function Pn(A) {
  if (!A) return;
  const t = {
    mapID: A.mapID
  };
  for (let e = 0; e < ye.length; e++) {
    const i = ye[e];
    A[i] && (t[i] = A[i]);
  }
  return t;
}
function ct(A) {
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
  return Object.keys(t).reduce((e, i) => {
    if (e[i] !== void 0)
      throw new Error(`Invalid Maplat option key: ${i}. Use "${t[i]}" instead.`);
    return e;
  }, A);
}
class xg {
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
function ko(A, t, e) {
  let i, n;
  e = e || Sg;
  let g = 0, r = A.length, s = !1;
  for (; g < r; )
    i = g + (r - g >> 1), n = +e(A[i], t), n < 0 ? g = i + 1 : (r = i, s = !n);
  return s ? g : ~g;
}
function Sg(A, t) {
  return A > t ? 1 : A < t ? -1 : 0;
}
function Dg(A, t, e) {
  if (A[0] <= t)
    return 0;
  const i = A.length;
  if (t <= A[i - 1])
    return i - 1;
  if (typeof e == "function") {
    for (let n = 1; n < i; ++n) {
      const g = A[n];
      if (g === t)
        return n;
      if (g < t)
        return e(t, A[n - 1], g) > 0 ? n - 1 : n;
    }
    return i - 1;
  }
  if (e > 0) {
    for (let n = 1; n < i; ++n)
      if (A[n] < t)
        return n - 1;
    return i - 1;
  }
  if (e < 0) {
    for (let n = 1; n < i; ++n)
      if (A[n] <= t)
        return n;
    return i - 1;
  }
  for (let n = 1; n < i; ++n) {
    if (A[n] == t)
      return n;
    if (A[n] < t)
      return A[n - 1] - t < t - A[n] ? n - 1 : n;
  }
  return i - 1;
}
function Bg(A, t) {
  const e = Array.isArray(t) ? t : [t], i = e.length;
  for (let n = 0; n < i; n++)
    A[A.length] = e[n];
}
function Go(A, t) {
  const e = A.length;
  if (e !== t.length)
    return !1;
  for (let i = 0; i < e; i++)
    if (A[i] !== t[i])
      return !1;
  return !0;
}
function Oo() {
  return !0;
}
function CA() {
  return !1;
}
function KA() {
}
function Lo(A) {
  let t, e, i;
  return function() {
    const n = Array.prototype.slice.call(arguments);
    return (!e || this !== i || !Go(n, e)) && (i = this, e = n, t = A.apply(this, arguments)), t;
  };
}
function Tg(A) {
  for (const t in A)
    delete A[t];
}
function Zo(A) {
  let t;
  for (t in A)
    return !1;
  return !t;
}
class kg extends xg {
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
    const i = this.listeners_ || (this.listeners_ = {}), n = i[t] || (i[t] = []);
    n.includes(e) || n.push(e);
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
    const e = typeof t == "string", i = e ? t : t.type, n = this.listeners_ && this.listeners_[i];
    if (!n)
      return;
    const g = e ? new mt(t) : (
      /** @type {Event} */
      t
    );
    g.target || (g.target = this.eventTarget_ || this);
    const r = this.dispatching_ || (this.dispatching_ = {}), s = this.pendingRemovals_ || (this.pendingRemovals_ = {});
    i in r || (r[i] = 0, s[i] = 0), ++r[i];
    let o;
    for (let I = 0, C = n.length; I < C; ++I)
      if ("handleEvent" in n[I] ? o = /** @type {import("../events.js").ListenerObject} */
      n[I].handleEvent(g) : o = /** @type {import("../events.js").ListenerFunction} */
      n[I].call(this, g), o === !1 || g.propagationStopped) {
        o = !1;
        break;
      }
    if (--r[i] === 0) {
      let I = s[i];
      for (delete s[i]; I--; )
        this.removeEventListener(i, KA);
      delete r[i];
    }
    return o;
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.listeners_ && Tg(this.listeners_);
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
    const i = this.listeners_[t];
    if (!i)
      return;
    const n = i.indexOf(e);
    n !== -1 && (this.pendingRemovals_ && t in this.pendingRemovals_ ? (i[n] = KA, ++this.pendingRemovals_[t]) : (i.splice(n, 1), i.length === 0 && delete this.listeners_[t]));
  }
}
og.prototype.getDecimalZoom = function() {
  const A = this.getResolution(), t = (
    // NOTE: `resolution` maybe `undefined`
    // NOTE: `offset` maybe `NaN`
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Math.log(this.maxResolution_ / A) / Math.log(2)
  );
  return t !== void 0 ? this.minZoom_ + t : t;
};
const U = {
  UNKNOWN: 0,
  INTERSECTING: 1,
  ABOVE: 2,
  RIGHT: 4,
  BELOW: 8,
  LEFT: 16
};
function si(A, t, e) {
  let i, n;
  return t < A[0] ? i = A[0] - t : A[2] < t ? i = t - A[2] : i = 0, e < A[1] ? n = A[1] - e : A[3] < e ? n = e - A[3] : n = 0, i * i + n * n;
}
function Xo(A, t, e) {
  return A[0] <= t && t <= A[2] && A[1] <= e && e <= A[3];
}
function xn(A, t) {
  const e = A[0], i = A[1], n = A[2], g = A[3], r = t[0], s = t[1];
  let o = U.UNKNOWN;
  return r < e ? o = o | U.LEFT : r > n && (o = o | U.RIGHT), s < i ? o = o | U.BELOW : s > g && (o = o | U.ABOVE), o === U.UNKNOWN && (o = U.INTERSECTING), o;
}
function Gg() {
  return [1 / 0, 1 / 0, -1 / 0, -1 / 0];
}
function aA(A, t, e, i, n) {
  return n ? (n[0] = A, n[1] = t, n[2] = e, n[3] = i, n) : [A, t, e, i];
}
function Og(A) {
  return aA(1 / 0, 1 / 0, -1 / 0, -1 / 0, A);
}
function jo(A, t) {
  const e = A[0], i = A[1];
  return aA(e, i, e, i, t);
}
function No(A, t, e, i, n) {
  const g = Og(n);
  return Lg(g, A, t, e, i);
}
function Lg(A, t, e, i, n) {
  for (; e < i; e += n)
    zo(A, t[e], t[e + 1]);
  return A;
}
function zo(A, t, e) {
  A[0] = Math.min(A[0], t), A[1] = Math.min(A[1], e), A[2] = Math.max(A[2], t), A[3] = Math.max(A[3], e);
}
function Zg(A, t) {
  let e;
  return e = t(Fo(A)), e || (e = t(Uo(A)), e) || (e = t(Ho(A)), e) || (e = t(Vo(A)), e) ? e : !1;
}
function Fo(A) {
  return [A[0], A[1]];
}
function Uo(A) {
  return [A[2], A[1]];
}
function tA(A) {
  return [(A[0] + A[2]) / 2, (A[1] + A[3]) / 2];
}
function Wo(A, t, e, i, n) {
  const [g, r, s, o, I, C, a, c] = Qo(
    A,
    t,
    e,
    i
  );
  return aA(
    Math.min(g, s, I, a),
    Math.min(r, o, C, c),
    Math.max(g, s, I, a),
    Math.max(r, o, C, c),
    n
  );
}
function Qo(A, t, e, i) {
  const n = t * i[0] / 2, g = t * i[1] / 2, r = Math.cos(e), s = Math.sin(e), o = n * r, I = n * s, C = g * r, a = g * s, c = A[0], l = A[1];
  return [
    c - o + a,
    l - I - C,
    c - o - a,
    l - I + C,
    c + o - a,
    l + I + C,
    c + o + a,
    l + I - C,
    c - o + a,
    l - I - C
  ];
}
function we(A) {
  return A[3] - A[1];
}
function Vo(A) {
  return [A[0], A[3]];
}
function Ho(A) {
  return [A[2], A[3]];
}
function oi(A) {
  return A[2] - A[0];
}
function Ii(A, t) {
  return A[0] <= t[2] && A[2] >= t[0] && A[1] <= t[3] && A[3] >= t[1];
}
function Xg(A) {
  return A[2] < A[0] || A[3] < A[1];
}
function Yo(A, t) {
  return t ? (t[0] = A[0], t[1] = A[1], t[2] = A[2], t[3] = A[3], t) : A;
}
function Ko(A, t, e) {
  let i = !1;
  const n = xn(A, t), g = xn(A, e);
  if (n === U.INTERSECTING || g === U.INTERSECTING)
    i = !0;
  else {
    const r = A[0], s = A[1], o = A[2], I = A[3], C = t[0], a = t[1], c = e[0], l = e[1], d = (l - a) / (c - C);
    let h, f;
    g & U.ABOVE && !(n & U.ABOVE) && (h = c - (l - I) / d, i = h >= r && h <= o), !i && g & U.RIGHT && !(n & U.RIGHT) && (f = l - (c - o) * d, i = f >= s && f <= I), !i && g & U.BELOW && !(n & U.BELOW) && (h = c - (l - s) / d, i = h >= r && h <= o), !i && g & U.LEFT && !(n & U.LEFT) && (f = l - (c - r) * d, i = f >= s && f <= I);
  }
  return i;
}
function q() {
  throw new Error("Unimplemented abstract method.");
}
let Jo = 0;
function qo(A) {
  return A.ol_uid || (A.ol_uid = String(++Jo));
}
const _o = {
  /**
   * Triggered when a property is changed.
   * @event module:ol/Object.ObjectEvent#propertychange
   * @api
   */
  PROPERTYCHANGE: "propertychange"
};
function Rt(A, t, e, i, n) {
  if (n) {
    const r = e;
    e = function(s) {
      return A.removeEventListener(t, e), r.call(i ?? this, s);
    };
  } else i && i !== A && (e = e.bind(i));
  const g = {
    target: A,
    type: t,
    listener: e
  };
  return A.addEventListener(t, e), g;
}
function Sn(A, t, e, i) {
  return Rt(A, t, e, i, !0);
}
function _t(A) {
  A && A.target && (A.target.removeEventListener(A.type, A.listener), Tg(A));
}
const Pt = {
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
class cA extends kg {
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
    ++this.revision_, this.dispatchEvent(Pt.CHANGE);
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
      const i = t.length, n = new Array(i);
      for (let g = 0; g < i; ++g)
        n[g] = Rt(this, t[g], e);
      return n;
    }
    return Rt(
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
    let i;
    if (Array.isArray(t)) {
      const n = t.length;
      i = new Array(n);
      for (let g = 0; g < n; ++g)
        i[g] = Sn(this, t[g], e);
    } else
      i = Sn(
        this,
        /** @type {string} */
        t,
        e
      );
    return e.ol_key = i, i;
  }
  /**
   * Unlisten for a certain type of event.
   * @param {string|Array<string>} type Type.
   * @param {function((Event|import("./events/Event.js").default)): ?} listener Listener.
   * @protected
   */
  unInternal(t, e) {
    const i = (
      /** @type {Object} */
      e.ol_key
    );
    if (i)
      $o(i);
    else if (Array.isArray(t))
      for (let n = 0, g = t.length; n < g; ++n)
        this.removeEventListener(t[n], e);
    else
      this.removeEventListener(t, e);
  }
}
cA.prototype.on;
cA.prototype.once;
cA.prototype.un;
function $o(A) {
  if (Array.isArray(A))
    for (let t = 0, e = A.length; t < e; ++t)
      _t(A[t]);
  else
    _t(
      /** @type {import("./events.js").EventsKey} */
      A
    );
}
class Dn extends mt {
  /**
   * @param {string} type The event type.
   * @param {string} key The property name.
   * @param {*} oldValue The old value for `key`.
   */
  constructor(t, e, i) {
    super(t), this.key = e, this.oldValue = i;
  }
}
class se extends cA {
  /**
   * @param {NoInfer<Properties>} [values] An object with key-value pairs.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, qo(this), this.values_ = null, t !== void 0 && this.setProperties(t);
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
    let i;
    i = `change:${t}`, this.hasListener(i) && this.dispatchEvent(new Dn(i, t, e)), i = _o.PROPERTYCHANGE, this.hasListener(i) && this.dispatchEvent(new Dn(i, t, e));
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
  set(t, e, i) {
    const n = this.values_ || (this.values_ = {});
    if (i)
      n[t] = e;
    else {
      const g = n[t];
      n[t] = e, g !== e && this.notify(t, g);
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
    for (const i in t)
      this.set(i, t[i], e);
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
      const i = this.values_[t];
      delete this.values_[t], Zo(this.values_) && (this.values_ = null), e || this.notify(t, i);
    }
  }
}
function tI(...A) {
  console.warn(...A);
}
function st(A, t, e) {
  return Math.min(Math.max(A, t), e);
}
function eI(A, t, e, i, n, g) {
  const r = n - e, s = g - i;
  if (r !== 0 || s !== 0) {
    const o = ((A - e) * r + (t - i) * s) / (r * r + s * s);
    o > 1 ? (e = n, i = g) : o > 0 && (e += r * o, i += s * o);
  }
  return $t(A, t, e, i);
}
function $t(A, t, e, i) {
  const n = e - A, g = i - t;
  return n * n + g * g;
}
function Bn(A) {
  return A * 180 / Math.PI;
}
function te(A) {
  return A * Math.PI / 180;
}
function JA(A, t) {
  const e = A % t;
  return e * t < 0 ? e + t : e;
}
function Ci(A, t, e) {
  return A + e * (t - A);
}
function qA(A, t, e) {
  if (A >= t && A < e)
    return A;
  const i = e - t;
  return ((A - t) % i + i) % i + t;
}
function AI(A, t) {
  return A[0] += +t[0], A[1] += +t[1], A;
}
function eA(A, t) {
  let e = !0;
  for (let i = A.length - 1; i >= 0; --i)
    if (A[i] != t[i]) {
      e = !1;
      break;
    }
  return e;
}
function ai(A, t) {
  const e = Math.cos(t), i = Math.sin(t), n = A[0] * e - A[1] * i, g = A[1] * e + A[0] * i;
  return A[0] = n, A[1] = g, A;
}
function iI(A, t) {
  return A[0] *= t, A[1] *= t, A;
}
const jg = {
  // use the radius of the Normal sphere
  radians: 6370997 / (2 * Math.PI),
  degrees: 2 * Math.PI * 6370997 / 360,
  ft: 0.3048,
  m: 1,
  "us-ft": 1200 / 3937
};
class ve {
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
    return this.metersPerUnit_ || jg[this.units_];
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
const Se = 6378137, Jt = Math.PI * Se, nI = [-Jt, -Jt, Jt, Jt], gI = [-180, -85, 180, 85], He = Se * Math.log(Math.tan(Math.PI / 2));
class Qt extends ve {
  /**
   * @param {string} code Code.
   */
  constructor(t) {
    super({
      code: t,
      units: "m",
      extent: nI,
      global: !0,
      worldExtent: gI,
      getPointResolution: function(e, i) {
        return e / Math.cosh(i[1] / Se);
      }
    });
  }
}
const Tn = [
  new Qt("EPSG:3857"),
  new Qt("EPSG:102100"),
  new Qt("EPSG:102113"),
  new Qt("EPSG:900913"),
  new Qt("http://www.opengis.net/def/crs/EPSG/0/3857"),
  new Qt("http://www.opengis.net/gml/srs/epsg.xml#3857")
];
function rI(A, t, e, i) {
  const n = A.length;
  e = e > 1 ? e : 2, i = i ?? e, t === void 0 && (e > 2 ? t = A.slice() : t = new Array(n));
  for (let g = 0; g < n; g += i) {
    t[g] = Jt * A[g] / 180;
    let r = Se * Math.log(Math.tan(Math.PI * (+A[g + 1] + 90) / 360));
    r > He ? r = He : r < -He && (r = -He), t[g + 1] = r;
  }
  return t;
}
function sI(A, t, e, i) {
  const n = A.length;
  e = e > 1 ? e : 2, i = i ?? e, t === void 0 && (e > 2 ? t = A.slice() : t = new Array(n));
  for (let g = 0; g < n; g += i)
    t[g] = 180 * A[g] / Jt, t[g + 1] = 360 * Math.atan(Math.exp(A[g + 1] / Se)) / Math.PI - 90;
  return t;
}
const oI = 6378137, kn = [-180, -90, 180, 90], II = Math.PI * oI / 180;
class Dt extends ve {
  /**
   * @param {string} code Code.
   * @param {string} [axisOrientation] Axis orientation.
   */
  constructor(t, e) {
    super({
      code: t,
      units: "degrees",
      extent: kn,
      axisOrientation: e,
      global: !0,
      metersPerUnit: II,
      worldExtent: kn
    });
  }
}
const Gn = [
  new Dt("CRS:84"),
  new Dt("EPSG:4326", "neu"),
  new Dt("urn:ogc:def:crs:OGC:1.3:CRS84"),
  new Dt("urn:ogc:def:crs:OGC:2:84"),
  new Dt("http://www.opengis.net/def/crs/OGC/1.3/CRS84"),
  new Dt("http://www.opengis.net/gml/srs/epsg.xml#4326", "neu"),
  new Dt("http://www.opengis.net/def/crs/EPSG/0/4326", "neu")
];
let _A = {};
function CI(A) {
  return _A[A] || _A[A.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/, "EPSG:$3")] || null;
}
function aI(A, t) {
  _A[A] = t;
}
let ee = {};
function be(A, t, e) {
  const i = A.getCode(), n = t.getCode();
  i in ee || (ee[i] = {}), ee[i][n] = e;
}
function DA(A, t) {
  return A in ee && t in ee[A] ? ee[A][t] : null;
}
const AA = 0.9996, gt = 669438e-8, lA = gt * gt, hA = lA * gt, Gt = gt / (1 - gt), On = Math.sqrt(1 - gt), ge = (1 - On) / (1 + On), Ng = ge * ge, ci = Ng * ge, li = ci * ge, zg = li * ge, Fg = 1 - gt / 4 - 3 * lA / 64 - 5 * hA / 256, cI = 3 * gt / 8 + 3 * lA / 32 + 45 * hA / 1024, lI = 15 * lA / 256 + 45 * hA / 1024, hI = 35 * hA / 3072, uI = 3 / 2 * ge - 27 / 32 * ci + 269 / 512 * zg, fI = 21 / 16 * Ng - 55 / 32 * li, dI = 151 / 96 * ci - 417 / 128 * zg, mI = 1097 / 512 * li, iA = 6378137;
function pI(A, t, e) {
  const i = A - 5e5, r = (e.north ? t : t - 1e7) / AA / (iA * Fg), s = r + uI * Math.sin(2 * r) + fI * Math.sin(4 * r) + dI * Math.sin(6 * r) + mI * Math.sin(8 * r), o = Math.sin(s), I = o * o, C = Math.cos(s), a = o / C, c = a * a, l = c * c, d = 1 - gt * I, h = Math.sqrt(1 - gt * I), f = iA / h, m = (1 - gt) / d, y = Gt * C ** 2, b = y * y, v = i / (f * AA), M = v * v, E = M * v, P = E * v, x = P * v, T = x * v, k = s - a / m * (M / 2 - P / 24 * (5 + 3 * c + 10 * y - 4 * b - 9 * Gt)) + T / 720 * (61 + 90 * c + 298 * y + 45 * l - 252 * Gt - 3 * b);
  let D = (v - E / 6 * (1 + 2 * c + y) + x / 120 * (5 - 2 * y + 28 * c - 3 * b + 8 * Gt + 24 * l)) / C;
  return D = qA(
    D + te(Ug(e.number)),
    -Math.PI,
    Math.PI
  ), [Bn(D), Bn(k)];
}
const Ln = -80, Zn = 84, yI = -180, wI = 180;
function vI(A, t, e) {
  A = qA(A, yI, wI), t < Ln ? t = Ln : t > Zn && (t = Zn);
  const i = te(t), n = Math.sin(i), g = Math.cos(i), r = n / g, s = r * r, o = s * s, I = te(A), C = Ug(e.number), a = te(C), c = iA / Math.sqrt(1 - gt * n ** 2), l = Gt * g ** 2, d = g * qA(I - a, -Math.PI, Math.PI), h = d * d, f = h * d, m = f * d, y = m * d, b = y * d, v = iA * (Fg * i - cI * Math.sin(2 * i) + lI * Math.sin(4 * i) - hI * Math.sin(6 * i)), M = AA * c * (d + f / 6 * (1 - s + l) + y / 120 * (5 - 18 * s + o + 72 * l - 58 * Gt)) + 5e5;
  let E = AA * (v + c * r * (h / 2 + m / 24 * (5 - s + 9 * l + 4 * l ** 2) + b / 720 * (61 - 58 * s + o + 600 * l - 330 * Gt)));
  return e.north || (E += 1e7), [M, E];
}
function Ug(A) {
  return (A - 1) * 6 - 180 + 3;
}
const bI = [
  /^EPSG:(\d+)$/,
  /^urn:ogc:def:crs:EPSG::(\d+)$/,
  /^http:\/\/www\.opengis\.net\/def\/crs\/EPSG\/0\/(\d+)$/
];
function Wg(A) {
  let t = 0;
  for (const n of bI) {
    const g = A.match(n);
    if (g) {
      t = parseInt(g[1]);
      break;
    }
  }
  if (!t)
    return null;
  let e = 0, i = !1;
  return t > 32700 && t < 32761 ? e = t - 32700 : t > 32600 && t < 32661 && (i = !0, e = t - 32600), e ? { number: e, north: i } : null;
}
function Xn(A, t) {
  return function(e, i, n, g) {
    const r = e.length;
    n = n > 1 ? n : 2, g = g ?? n, i || (n > 2 ? i = e.slice() : i = new Array(r));
    for (let s = 0; s < r; s += g) {
      const o = e[s], I = e[s + 1], C = A(o, I, t);
      i[s] = C[0], i[s + 1] = C[1];
    }
    return i;
  };
}
function MI(A) {
  return Wg(A) ? new ve({ code: A, units: "m" }) : null;
}
function EI(A) {
  const t = Wg(A.getCode());
  return t ? {
    forward: Xn(vI, t),
    inverse: Xn(pI, t)
  } : null;
}
const RI = [EI], PI = [MI];
let $A = !0;
function xI(A) {
  $A = !1;
}
function Qg(A, t) {
  if (t !== void 0) {
    for (let e = 0, i = A.length; e < i; ++e)
      t[e] = A[e];
    t = t;
  } else
    t = A.slice();
  return t;
}
function ti(A) {
  aI(A.getCode(), A), be(A, A, Qg);
}
function SI(A) {
  A.forEach(ti);
}
function Me(A) {
  if (typeof A != "string")
    return A;
  const t = CI(A);
  if (t)
    return t;
  for (const e of PI) {
    const i = e(A);
    if (i)
      return i;
  }
  return null;
}
function jn(A) {
  SI(A), A.forEach(function(t) {
    A.forEach(function(e) {
      t !== e && be(t, e, Qg);
    });
  });
}
function DI(A, t, e, i) {
  A.forEach(function(n) {
    t.forEach(function(g) {
      be(n, g, e), be(g, n, i);
    });
  });
}
function hi(A, t) {
  return A ? typeof A == "string" ? Me(A) : (
    /** @type {Projection} */
    A
  ) : Me(t);
}
function BI(A, t) {
  const e = A.getCode(), i = t.getCode();
  let n = DA(e, i);
  if (n)
    return n;
  let g = null, r = null;
  for (const o of RI)
    g || (g = o(A)), r || (r = o(t));
  if (!g && !r)
    return null;
  const s = "EPSG:4326";
  if (r)
    if (g)
      n = BA(
        g.inverse,
        r.forward
      );
    else {
      const o = DA(e, s);
      o && (n = BA(
        o,
        r.forward
      ));
    }
  else {
    const o = DA(s, i);
    o && (n = BA(
      g.inverse,
      o
    ));
  }
  return n && (ti(A), ti(t), be(A, t, n)), n;
}
function BA(A, t) {
  return function(e, i, n, g) {
    return i = A(e, i, n, g), t(i, i, n, g);
  };
}
function Nn(A, t) {
  const e = Me(A), i = Me(t);
  return BI(e, i);
}
function zn(A, t) {
  return A;
}
function yt(A, t) {
  return $A && !eA(A, [0, 0]) && A[0] >= -180 && A[0] <= 180 && A[1] >= -90 && A[1] <= 90 && ($A = !1, tI(
    "Call useGeographic() from ol/proj once to work with [longitude, latitude] coordinates."
  )), A;
}
function TI(A, t) {
  return A;
}
function Ye(A, t) {
  return A;
}
function kI() {
  jn(Tn), jn(Gn), DI(
    Gn,
    Tn,
    rI,
    sI
  );
}
kI();
function bt(A, t) {
  if (!A)
    throw new Error(t);
}
const GI = [1, 0, 0, 1, 0, 0];
new Array(6);
function OI() {
  return GI.slice(0);
}
function LI(A, t, e, i, n, g, r, s) {
  const o = Math.sin(g), I = Math.cos(g);
  return A[0] = i * I, A[1] = n * o, A[2] = -i * o, A[3] = n * I, A[4] = r * i * I - s * i * o + t, A[5] = r * n * o + s * n * I + e, A;
}
function ZI(A, t, e, i, n, g, r) {
  g = g || [], r = r || 2;
  let s = 0;
  for (let o = t; o < e; o += i) {
    const I = A[o], C = A[o + 1];
    g[s++] = n[0] * I + n[2] * C + n[4], g[s++] = n[1] * I + n[3] * C + n[5];
    for (let a = 2; a < r; a++)
      g[s++] = A[o + a];
  }
  return g && g.length != s && (g.length = s), g;
}
function Vg(A, t, e, i, n, g, r) {
  r = r || [];
  const s = Math.cos(n), o = Math.sin(n), I = g[0], C = g[1];
  let a = 0;
  for (let c = t; c < e; c += i) {
    const l = A[c] - I, d = A[c + 1] - C;
    r[a++] = I + l * s - d * o, r[a++] = C + l * o + d * s;
    for (let h = c + 2; h < c + i; ++h)
      r[a++] = A[h];
  }
  return r && r.length != a && (r.length = a), r;
}
function XI(A, t, e, i, n, g, r, s) {
  s = s || [];
  const o = r[0], I = r[1];
  let C = 0;
  for (let a = t; a < e; a += i) {
    const c = A[a] - o, l = A[a + 1] - I;
    s[C++] = o + n * c, s[C++] = I + g * l;
    for (let d = a + 2; d < a + i; ++d)
      s[C++] = A[d];
  }
  return s && s.length != C && (s.length = C), s;
}
function jI(A, t, e, i, n, g, r) {
  r = r || [];
  let s = 0;
  for (let o = t; o < e; o += i) {
    r[s++] = A[o] + n, r[s++] = A[o + 1] + g;
    for (let I = o + 2; I < o + i; ++I)
      r[s++] = A[I];
  }
  return r && r.length != s && (r.length = s), r;
}
const Fn = OI(), NI = [NaN, NaN];
class zI extends se {
  constructor() {
    super(), this.extent_ = Gg(), this.extentRevision_ = -1, this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = 0, this.simplifyTransformedInternal = Lo(
      (t, e, i) => {
        if (!i)
          return this.getSimplifiedGeometry(e);
        const n = this.clone();
        return n.applyTransform(i), n.getSimplifiedGeometry(e);
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
    return q();
  }
  /**
   * @abstract
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   */
  closestPointXY(t, e, i, n) {
    return q();
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   */
  containsXY(t, e) {
    return this.closestPointXY(t, e, NI, Number.MIN_VALUE) === 0;
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
    return q();
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
      (isNaN(e[0]) || isNaN(e[1])) && Og(e), this.extentRevision_ = this.getRevision();
    }
    return Yo(this.extent_, t);
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
    q();
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
  scale(t, e, i) {
    q();
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
    return q();
  }
  /**
   * Get the type of this geometry.
   * @abstract
   * @return {Type} Geometry type.
   */
  getType() {
    return q();
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
    q();
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   */
  intersectsExtent(t) {
    return q();
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
    q();
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
    const i = Me(t), n = i.getUnits() == "tile-pixels" ? function(g, r, s) {
      const o = i.getExtent(), I = i.getWorldExtent(), C = we(I) / we(o);
      LI(
        Fn,
        I[0],
        I[3],
        C,
        -C,
        0,
        0,
        0
      );
      const a = ZI(
        g,
        0,
        g.length,
        s,
        Fn,
        r
      ), c = Nn(i, e);
      return c ? c(a, a, s) : a;
    } : Nn(i, e);
    return this.applyTransform(n), this;
  }
}
class De extends zI {
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
    return No(
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
    return q();
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
    this.stride = Un(t), this.layout = t, this.flatCoordinates = e;
  }
  /**
   * @abstract
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  setCoordinates(t, e) {
    q();
  }
  /**
   * @param {import("./Geometry.js").GeometryLayout|undefined} layout Layout.
   * @param {Array<*>} coordinates Coordinates.
   * @param {number} nesting Nesting.
   * @protected
   */
  setLayout(t, e, i) {
    let n;
    if (t)
      n = Un(t);
    else {
      for (let g = 0; g < i; ++g) {
        if (e.length === 0) {
          this.layout = "XY", this.stride = 2;
          return;
        }
        e = /** @type {Array<unknown>} */
        e[0];
      }
      n = e.length, t = FI(n);
    }
    this.layout = t, this.stride = n;
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
    const i = this.getFlatCoordinates();
    if (i) {
      const n = this.getStride();
      Vg(
        i,
        0,
        i.length,
        n,
        t,
        e,
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
  scale(t, e, i) {
    e === void 0 && (e = t), i || (i = tA(this.getExtent()));
    const n = this.getFlatCoordinates();
    if (n) {
      const g = this.getStride();
      XI(
        n,
        0,
        n.length,
        g,
        t,
        e,
        i,
        n
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
    const i = this.getFlatCoordinates();
    if (i) {
      const n = this.getStride();
      jI(
        i,
        0,
        i.length,
        n,
        t,
        e,
        i
      ), this.changed();
    }
  }
}
function FI(A) {
  let t;
  return A == 2 ? t = "XY" : A == 3 ? t = "XYZ" : A == 4 && (t = "XYZM"), /** @type {import("./Geometry.js").GeometryLayout} */
  t;
}
function Un(A) {
  let t;
  return A == "XY" ? t = 2 : A == "XYZ" || A == "XYM" ? t = 3 : A == "XYZM" && (t = 4), /** @type {number} */
  t;
}
function Hg(A, t, e, i) {
  for (let n = 0, g = e.length; n < g; ++n)
    A[t++] = e[n];
  return t;
}
function ui(A, t, e, i) {
  for (let n = 0, g = e.length; n < g; ++n) {
    const r = e[n];
    for (let s = 0; s < i; ++s)
      A[t++] = r[s];
  }
  return t;
}
function UI(A, t, e, i, n) {
  n = n || [];
  let g = 0;
  for (let r = 0, s = e.length; r < s; ++r) {
    const o = ui(
      A,
      t,
      e[r],
      i
    );
    n[g++] = o, t = o;
  }
  return n.length = g, n;
}
class fi extends De {
  /**
   * @param {!import("../coordinate.js").Coordinate} center Center.
   *     For internal use, flat coordinates in combination with `layout` and no
   *     `radius` are also accepted.
   * @param {number} [radius] Radius in units of the projection.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(t, e, i) {
    super(), i !== void 0 && e === void 0 ? this.setFlatCoordinates(i, t) : (e = e || 0, this.setCenterAndRadius(t, e, i));
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Circle} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new fi(
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
  closestPointXY(t, e, i, n) {
    const g = this.flatCoordinates, r = t - g[0], s = e - g[1], o = r * r + s * s;
    if (o < n) {
      if (o === 0)
        for (let I = 0; I < this.stride; ++I)
          i[I] = g[I];
      else {
        const I = this.getRadius() / Math.sqrt(o);
        i[0] = g[0] + I * r, i[1] = g[1] + I * s;
        for (let C = 2; C < this.stride; ++C)
          i[C] = g[C];
      }
      return i.length = this.stride, o;
    }
    return n;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   * @override
   */
  containsXY(t, e) {
    const i = this.flatCoordinates, n = t - i[0], g = e - i[1];
    return n * n + g * g <= this.getRadiusSquared_();
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
    const e = this.flatCoordinates, i = e[this.stride] - e[0];
    return aA(
      e[0] - i,
      e[1] - i,
      e[0] + i,
      e[1] + i,
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
    if (Ii(t, e)) {
      const i = this.getCenter();
      return t[0] <= i[0] && t[2] >= i[0] || t[1] <= i[1] && t[3] >= i[1] ? !0 : Zg(t, this.intersectsCoordinate.bind(this));
    }
    return !1;
  }
  /**
   * Set the center of the circle as {@link module:ol/coordinate~Coordinate coordinate}.
   * @param {import("../coordinate.js").Coordinate} center Center.
   * @api
   */
  setCenter(t) {
    const e = this.stride, i = this.flatCoordinates[e] - this.flatCoordinates[0], n = t.slice();
    n[e] = n[0] + i;
    for (let g = 1; g < e; ++g)
      n[e + g] = t[g];
    this.setFlatCoordinates(this.layout, n), this.changed();
  }
  /**
   * Set the center (as {@link module:ol/coordinate~Coordinate coordinate}) and the radius (as
   * number) of the circle.
   * @param {!import("../coordinate.js").Coordinate} center Center.
   * @param {number} radius Radius.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   */
  setCenterAndRadius(t, e, i) {
    this.setLayout(i, t, 0), this.flatCoordinates || (this.flatCoordinates = []);
    const n = this.flatCoordinates;
    let g = Hg(n, 0, t, this.stride);
    n[g++] = n[0] + e;
    for (let r = 1, s = this.stride; r < s; ++r)
      n[g++] = n[r];
    n.length = g, this.changed();
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
    const i = this.getCenter(), n = this.getStride();
    this.setCenter(
      Vg(i, 0, i.length, n, t, e, i)
    ), this.changed();
  }
}
function Yg(A, t, e, i) {
  let n = 0;
  const g = A[e - i], r = A[e - i + 1];
  let s = 0, o = 0;
  for (; t < e; t += i) {
    const I = A[t] - g, C = A[t + 1] - r;
    n += o * I - s * C, s = I, o = C;
  }
  return n / 2;
}
function WI(A, t, e, i) {
  let n = 0;
  for (let g = 0, r = e.length; g < r; ++g) {
    const s = e[g];
    n += Yg(A, t, s, i), t = s;
  }
  return n;
}
function Wn(A, t, e, i, n, g, r) {
  const s = A[t], o = A[t + 1], I = A[e] - s, C = A[e + 1] - o;
  let a;
  if (I === 0 && C === 0)
    a = t;
  else {
    const c = ((n - s) * I + (g - o) * C) / (I * I + C * C);
    if (c > 1)
      a = e;
    else if (c > 0) {
      for (let l = 0; l < i; ++l)
        r[l] = Ci(
          A[t + l],
          A[e + l],
          c
        );
      r.length = i;
      return;
    } else
      a = t;
  }
  for (let c = 0; c < i; ++c)
    r[c] = A[a + c];
  r.length = i;
}
function di(A, t, e, i, n) {
  let g = A[t], r = A[t + 1];
  for (t += i; t < e; t += i) {
    const s = A[t], o = A[t + 1], I = $t(g, r, s, o);
    I > n && (n = I), g = s, r = o;
  }
  return n;
}
function QI(A, t, e, i, n) {
  for (let g = 0, r = e.length; g < r; ++g) {
    const s = e[g];
    n = di(A, t, s, i, n), t = s;
  }
  return n;
}
function mi(A, t, e, i, n, g, r, s, o, I, C) {
  if (t == e)
    return I;
  let a, c;
  if (n === 0) {
    if (c = $t(
      r,
      s,
      A[t],
      A[t + 1]
    ), c < I) {
      for (a = 0; a < i; ++a)
        o[a] = A[t + a];
      return o.length = i, c;
    }
    return I;
  }
  C = C || [NaN, NaN];
  let l = t + i;
  for (; l < e; )
    if (Wn(
      A,
      l - i,
      l,
      i,
      r,
      s,
      C
    ), c = $t(r, s, C[0], C[1]), c < I) {
      for (I = c, a = 0; a < i; ++a)
        o[a] = C[a];
      o.length = i, l += i;
    } else
      l += i * Math.max(
        (Math.sqrt(c) - Math.sqrt(I)) / n | 0,
        1
      );
  if (g && (Wn(
    A,
    e - i,
    t,
    i,
    r,
    s,
    C
  ), c = $t(r, s, C[0], C[1]), c < I)) {
    for (I = c, a = 0; a < i; ++a)
      o[a] = C[a];
    o.length = i;
  }
  return I;
}
function VI(A, t, e, i, n, g, r, s, o, I, C) {
  C = C || [NaN, NaN];
  for (let a = 0, c = e.length; a < c; ++a) {
    const l = e[a];
    I = mi(
      A,
      t,
      l,
      i,
      n,
      g,
      r,
      s,
      o,
      I,
      C
    ), t = l;
  }
  return I;
}
function pi(A, t, e, i, n) {
  n = n !== void 0 ? n : [];
  let g = 0;
  for (let r = t; r < e; r += i)
    n[g++] = A.slice(r, r + i);
  return n.length = g, n;
}
function HI(A, t, e, i, n) {
  n = n !== void 0 ? n : [];
  let g = 0;
  for (let r = 0, s = e.length; r < s; ++r) {
    const o = e[r];
    n[g++] = pi(
      A,
      t,
      o,
      i,
      n[g]
    ), t = o;
  }
  return n.length = g, n;
}
function YI(A, t, e, i, n) {
  return !Zg(
    n,
    /**
     * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
     * @return {boolean} Contains (x, y).
     */
    function(r) {
      return !Ot(
        A,
        t,
        e,
        i,
        r[0],
        r[1]
      );
    }
  );
}
function Ot(A, t, e, i, n, g) {
  let r = 0, s = A[e - i], o = A[e - i + 1];
  for (; t < e; t += i) {
    const I = A[t], C = A[t + 1];
    o <= g ? C > g && (I - s) * (g - o) - (n - s) * (C - o) > 0 && r++ : C <= g && (I - s) * (g - o) - (n - s) * (C - o) < 0 && r--, s = I, o = C;
  }
  return r !== 0;
}
function Kg(A, t, e, i, n, g) {
  if (e.length === 0 || !Ot(A, t, e[0], i, n, g))
    return !1;
  for (let r = 1, s = e.length; r < s; ++r)
    if (Ot(A, e[r - 1], e[r], i, n, g))
      return !1;
  return !0;
}
function Jg(A, t, e, i, n) {
  let g;
  for (t += i; t < e; t += i)
    if (g = n(
      A.slice(t - i, t),
      A.slice(t, t + i)
    ), g)
      return g;
  return !1;
}
function uA(A, t, e, i, n, g) {
  return g = g ?? Lg(Gg(), A, t, e, i), Ii(n, g) ? g[0] >= n[0] && g[2] <= n[2] || g[1] >= n[1] && g[3] <= n[3] ? !0 : Jg(
    A,
    t,
    e,
    i,
    /**
     * @param {import("../../coordinate.js").Coordinate} point1 Start point.
     * @param {import("../../coordinate.js").Coordinate} point2 End point.
     * @return {boolean} `true` if the segment and the extent intersect,
     *     `false` otherwise.
     */
    function(r, s) {
      return Ko(n, r, s);
    }
  ) : !1;
}
function KI(A, t, e, i, n) {
  return !!(uA(A, t, e, i, n) || Ot(
    A,
    t,
    e,
    i,
    n[0],
    n[1]
  ) || Ot(
    A,
    t,
    e,
    i,
    n[0],
    n[3]
  ) || Ot(
    A,
    t,
    e,
    i,
    n[2],
    n[1]
  ) || Ot(
    A,
    t,
    e,
    i,
    n[2],
    n[3]
  ));
}
function JI(A, t, e, i, n) {
  if (!KI(A, t, e[0], i, n))
    return !1;
  if (e.length === 1)
    return !0;
  for (let g = 1, r = e.length; g < r; ++g)
    if (YI(
      A,
      e[g - 1],
      e[g],
      i,
      n
    ) && !uA(
      A,
      e[g - 1],
      e[g],
      i,
      n
    ))
      return !1;
  return !0;
}
function qg(A, t, e, i, n, g, r) {
  const s = (e - t) / i;
  if (s < 3) {
    for (; t < e; t += i)
      g[r++] = A[t], g[r++] = A[t + 1];
    return r;
  }
  const o = new Array(s);
  o[0] = 1, o[s - 1] = 1;
  const I = [t, e - i];
  let C = 0;
  for (; I.length > 0; ) {
    const a = I.pop(), c = I.pop();
    let l = 0;
    const d = A[c], h = A[c + 1], f = A[a], m = A[a + 1];
    for (let y = c + i; y < a; y += i) {
      const b = A[y], v = A[y + 1], M = eI(b, v, d, h, f, m);
      M > l && (C = y, l = M);
    }
    l > n && (o[(C - t) / i] = 1, c + i < C && I.push(c, C), C + i < a && I.push(C, a));
  }
  for (let a = 0; a < s; ++a)
    o[a] && (g[r++] = A[t + a * i], g[r++] = A[t + a * i + 1]);
  return r;
}
function Vt(A, t) {
  return t * Math.round(A / t);
}
function qI(A, t, e, i, n, g, r) {
  if (t == e)
    return r;
  let s = Vt(A[t], n), o = Vt(A[t + 1], n);
  t += i, g[r++] = s, g[r++] = o;
  let I, C;
  do
    if (I = Vt(A[t], n), C = Vt(A[t + 1], n), t += i, t == e)
      return g[r++] = I, g[r++] = C, r;
  while (I == s && C == o);
  for (; t < e; ) {
    const a = Vt(A[t], n), c = Vt(A[t + 1], n);
    if (t += i, a == I && c == C)
      continue;
    const l = I - s, d = C - o, h = a - s, f = c - o;
    if (l * f == d * h && (l < 0 && h < l || l == h || l > 0 && h > l) && (d < 0 && f < d || d == f || d > 0 && f > d)) {
      I = a, C = c;
      continue;
    }
    g[r++] = I, g[r++] = C, s = I, o = C, I = a, C = c;
  }
  return g[r++] = I, g[r++] = C, r;
}
function _I(A, t, e, i, n, g, r, s) {
  for (let o = 0, I = e.length; o < I; ++o) {
    const C = e[o];
    r = qI(
      A,
      t,
      C,
      i,
      n,
      g,
      r
    ), s.push(r), t = C;
  }
  return r;
}
class Ee extends De {
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
    return new Ee(this.flatCoordinates.slice(), this.layout);
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, i, n) {
    return n < si(this.getExtent(), t, e) ? n : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      di(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), mi(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      this.maxDelta_,
      !0,
      t,
      e,
      i,
      n
    ));
  }
  /**
   * Return the area of the linear ring on projected plane.
   * @return {number} Area (on projected plane).
   * @api
   */
  getArea() {
    return Yg(
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
    return pi(
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
    return e.length = qg(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      0
    ), new Ee(e, "XY");
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
    return uA(
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
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = ui(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function $I(A, t, e, i, n, g, r) {
  let s, o;
  const I = (e - t) / i;
  if (I === 1)
    s = t;
  else if (I === 2)
    s = t, o = n;
  else if (I !== 0) {
    let C = A[t], a = A[t + 1], c = 0;
    const l = [0];
    for (let f = t + i; f < e; f += i) {
      const m = A[f], y = A[f + 1];
      c += Math.sqrt((m - C) * (m - C) + (y - a) * (y - a)), l.push(c), C = m, a = y;
    }
    const d = n * c, h = ko(l, d);
    h < 0 ? (o = (d - l[-h - 2]) / (l[-h - 1] - l[-h - 2]), s = t + (-h - 2) * i) : s = t + h * i;
  }
  r = r > 1 ? r : 2, g = g || new Array(r);
  for (let C = 0; C < r; ++C)
    g[C] = s === void 0 ? NaN : o === void 0 ? A[s + C] : Ci(A[s + C], A[s + i + C], o);
  return g;
}
function tC(A, t, e, i, n, g) {
  if (e == t)
    return null;
  let r;
  if (n < A[t + i - 1])
    return g ? (r = A.slice(t, t + i), r[i - 1] = n, r) : null;
  if (A[e - 1] < n)
    return g ? (r = A.slice(e - i, e), r[i - 1] = n, r) : null;
  if (n == A[t + i - 1])
    return A.slice(t, t + i);
  let s = t / i, o = e / i;
  for (; s < o; ) {
    const c = s + o >> 1;
    n < A[(c + 1) * i - 1] ? o = c : s = c + 1;
  }
  const I = A[s * i - 1];
  if (n == I)
    return A.slice((s - 1) * i, (s - 1) * i + i);
  const C = A[(s + 1) * i - 1], a = (n - I) / (C - I);
  r = [];
  for (let c = 0; c < i - 1; ++c)
    r.push(
      Ci(
        A[(s - 1) * i + c],
        A[s * i + c],
        a
      )
    );
  return r.push(n), r;
}
function eC(A, t, e, i) {
  let n = A[t], g = A[t + 1], r = 0;
  for (let s = t + i; s < e; s += i) {
    const o = A[s], I = A[s + 1];
    r += Math.sqrt((o - n) * (o - n) + (I - g) * (I - g)), n = o, g = I;
  }
  return r;
}
class nA extends De {
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
    Bg(this.flatCoordinates, t), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!LineString} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new nA(
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
  closestPointXY(t, e, i, n) {
    return n < si(this.getExtent(), t, e) ? n : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      di(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), mi(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      this.maxDelta_,
      !1,
      t,
      e,
      i,
      n
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
    return Jg(
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
    return this.layout != "XYM" && this.layout != "XYZM" ? null : (e = e !== void 0 ? e : !1, tC(
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
    return pi(
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
    return $I(
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
    return eC(
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
    return e.length = qg(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      0
    ), new nA(e, "XY");
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
    return uA(
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
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = ui(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
class Re extends De {
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
    const t = new Re(this.flatCoordinates.slice(), this.layout);
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
  closestPointXY(t, e, i, n) {
    const g = this.flatCoordinates, r = $t(
      t,
      e,
      g[0],
      g[1]
    );
    if (r < n) {
      const s = this.stride;
      for (let o = 0; o < s; ++o)
        i[o] = g[o];
      return i.length = s, r;
    }
    return n;
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
    return jo(this.flatCoordinates, t);
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
    return Xo(t, this.flatCoordinates[0], this.flatCoordinates[1]);
  }
  /**
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 0), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = Hg(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function AC(A, t, e, i, n, g, r) {
  let s, o, I, C, a, c, l;
  const d = n[g + 1], h = [];
  for (let y = 0, b = e.length; y < b; ++y) {
    const v = e[y];
    for (C = A[v - i], c = A[v - i + 1], s = t; s < v; s += i)
      a = A[s], l = A[s + 1], (d <= c && l <= d || c <= d && d <= l) && (I = (d - c) / (l - c) * (a - C) + C, h.push(I)), C = a, c = l;
  }
  let f = NaN, m = -1 / 0;
  for (h.sort(Sg), C = h[0], s = 1, o = h.length; s < o; ++s) {
    a = h[s];
    const y = Math.abs(a - C);
    y > m && (I = (C + a) / 2, Kg(A, t, e, i, I, d) && (f = I, m = y)), C = a;
  }
  return isNaN(f) && (f = n[g]), [f, d, m];
}
function iC(A, t, e, i) {
  for (; t < e - i; ) {
    for (let n = 0; n < i; ++n) {
      const g = A[t + n];
      A[t + n] = A[e - i + n], A[e - i + n] = g;
    }
    t += i, e -= i;
  }
}
function _g(A, t, e, i) {
  let n = 0, g = A[e - i], r = A[e - i + 1];
  for (; t < e; t += i) {
    const s = A[t], o = A[t + 1];
    n += (s - g) * (o + r), g = s, r = o;
  }
  return n === 0 ? void 0 : n > 0;
}
function nC(A, t, e, i, n) {
  n = n !== void 0 ? n : !1;
  for (let g = 0, r = e.length; g < r; ++g) {
    const s = e[g], o = _g(
      A,
      t,
      s,
      i
    );
    if (g === 0) {
      if (n && o || !n && !o)
        return !1;
    } else if (n && !o || !n && o)
      return !1;
    t = s;
  }
  return !0;
}
function Qn(A, t, e, i, n) {
  n = n !== void 0 ? n : !1;
  for (let g = 0, r = e.length; g < r; ++g) {
    const s = e[g], o = _g(
      A,
      t,
      s,
      i
    );
    (g === 0 ? n && o || !n && !o : n && !o || !n && o) && iC(A, t, s, i), t = s;
  }
  return t;
}
class Lt extends De {
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
  constructor(t, e, i) {
    super(), this.ends_ = [], this.flatInteriorPointRevision_ = -1, this.flatInteriorPoint_ = null, this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, this.orientedRevision_ = -1, this.orientedFlatCoordinates_ = null, e !== void 0 && i ? (this.setFlatCoordinates(
      e,
      /** @type {Array<number>} */
      t
    ), this.ends_ = i) : this.setCoordinates(
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
    this.flatCoordinates ? Bg(this.flatCoordinates, t.getFlatCoordinates()) : this.flatCoordinates = t.getFlatCoordinates().slice(), this.ends_.push(this.flatCoordinates.length), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Polygon} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new Lt(
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
  closestPointXY(t, e, i, n) {
    return n < si(this.getExtent(), t, e) ? n : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      QI(
        this.flatCoordinates,
        0,
        this.ends_,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), VI(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      this.maxDelta_,
      !0,
      t,
      e,
      i,
      n
    ));
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   * @override
   */
  containsXY(t, e) {
    return Kg(
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
    return WI(
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
    return t !== void 0 ? (e = this.getOrientedFlatCoordinates().slice(), Qn(e, 0, this.ends_, this.stride, t)) : e = this.flatCoordinates, HI(e, 0, this.ends_, this.stride);
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
      const t = tA(this.getExtent());
      this.flatInteriorPoint_ = AC(
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
    return new Re(this.getFlatInteriorPoint(), "XYM");
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
    return t < 0 || this.ends_.length <= t ? null : new Ee(
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
    const t = this.layout, e = this.flatCoordinates, i = this.ends_, n = [];
    let g = 0;
    for (let r = 0, s = i.length; r < s; ++r) {
      const o = i[r], I = new Ee(
        e.slice(g, o),
        t
      );
      n.push(I), g = o;
    }
    return n;
  }
  /**
   * @return {Array<number>} Oriented flat coordinates.
   */
  getOrientedFlatCoordinates() {
    if (this.orientedRevision_ != this.getRevision()) {
      const t = this.flatCoordinates;
      nC(t, 0, this.ends_, this.stride) ? this.orientedFlatCoordinates_ = t : (this.orientedFlatCoordinates_ = t.slice(), this.orientedFlatCoordinates_.length = Qn(
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
    const e = [], i = [];
    return e.length = _I(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      Math.sqrt(t),
      e,
      0,
      i
    ), new Lt(e, "XY", i);
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
    return JI(
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
    const i = UI(
      this.flatCoordinates,
      0,
      t,
      this.stride,
      this.ends_
    );
    this.flatCoordinates.length = i.length === 0 ? 0 : i[i.length - 1], this.changed();
  }
}
function Vn(A) {
  if (Xg(A))
    throw new Error("Cannot create polygon from empty extent");
  const t = A[0], e = A[1], i = A[2], n = A[3], g = [
    t,
    e,
    t,
    n,
    i,
    n,
    i,
    e,
    t,
    e
  ];
  return new Lt(g, "XY", [g.length]);
}
class re extends Rg(Ig) {
  constructor(t = {}) {
    const e = Pg(t);
    if (super(e), t.mapID && (this.mapID = t.mapID), t.mapID === "morioka_ndl_affine") {
      const i = this.getTileUrlFunction();
      this.setTileUrlFunction((n, g, r) => i(n, g, r));
    }
    this.initialize(t);
  }
}
class gA extends re {
  style = "";
  accessToken = "";
  mapboxMap;
  static isMapbox_ = !0;
  constructor(t = {}) {
    super(t), this.style = t.style, this.mapboxMap = t.mapboxMap, this.accessToken = t.accessToken;
  }
}
class rA extends re {
  style = "";
  maplibreMap;
  static isMapLibre_ = !0;
  constructor(t = {}) {
    super(t), this.style = t.style || "https://tile.openstreetmap.jp/styles/osm-bright/style.json", this.maplibreMap = t.maplibreMap;
  }
}
class ei extends Rg(Rs) {
  constructor(t = {}) {
    const e = Object.assign({}, t);
    e.mapType = t.maptype.match(/^google_(.+)$/) ? RegExp.$1 : "roadmap", e.layerTypes = (t.layers || []).map((i) => `layer${i.charAt(0).toUpperCase()}${i.slice(1).toLowerCase()}`), super(e), t.mapID && (this.mapID = t.mapID), this.initialize(t);
  }
}
const wt = {
  ANIMATING: 0,
  INTERACTING: 1
}, rt = {
  CENTER: "center",
  RESOLUTION: "resolution",
  ROTATION: "rotation"
};
function Hn(A, t, e) {
  return (
    /**
     * @param {import("./coordinate.js").Coordinate|undefined} center Center.
     * @param {number|undefined} resolution Resolution.
     * @param {import("./size.js").Size} size Viewport size; unused if `onlyCenter` was specified.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @param {Array<number>} [centerShift] Shift between map center and viewport center.
     * @return {import("./coordinate.js").Coordinate|undefined} Center.
     */
    (function(i, n, g, r, s) {
      if (!i)
        return;
      if (!n && !t)
        return i;
      const o = t ? 0 : g[0] * n, I = t ? 0 : g[1] * n, C = s ? s[0] : 0, a = s ? s[1] : 0;
      let c = A[0] + o / 2 + C, l = A[2] - o / 2 + C, d = A[1] + I / 2 + a, h = A[3] - I / 2 + a;
      c > l && (c = (l + c) / 2, l = c), d > h && (d = (h + d) / 2, h = d);
      let f = st(i[0], c, l), m = st(i[1], d, h);
      if (r && e && n) {
        const y = 30 * n;
        f += -y * Math.log(1 + Math.max(0, c - i[0]) / y) + y * Math.log(1 + Math.max(0, i[0] - l) / y), m += -y * Math.log(1 + Math.max(0, d - i[1]) / y) + y * Math.log(1 + Math.max(0, i[1] - h) / y);
      }
      return [f, m];
    })
  );
}
function gC(A) {
  return A;
}
function rC(A) {
  return Math.pow(A, 3);
}
function fA(A) {
  return 1 - rC(1 - A);
}
function sC(A) {
  return 3 * A * A - 2 * A * A * A;
}
function oC(A) {
  return A;
}
function yi(A, t, e, i) {
  const n = oi(t) / e[0], g = we(t) / e[1];
  return i ? Math.min(A, Math.max(n, g)) : Math.min(A, Math.min(n, g));
}
function wi(A, t, e) {
  let i = Math.min(A, t);
  const n = 50;
  return i *= Math.log(1 + n * Math.max(0, A / t - 1)) / n + 1, e && (i = Math.max(i, e), i /= Math.log(1 + n * Math.max(0, e / A - 1)) / n + 1), st(i, e / 2, t * 2);
}
function IC(A, t, e, i) {
  return t = t !== void 0 ? t : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(n, g, r, s) {
    if (n !== void 0) {
      const o = A[0], I = A[A.length - 1], C = e ? yi(
        o,
        e,
        r,
        i
      ) : o;
      if (s)
        return t ? wi(
          n,
          C,
          I
        ) : st(n, I, C);
      const a = Math.min(C, n), c = Math.floor(Dg(A, a, g));
      return A[c] > C && c < A.length - 1 ? A[c + 1] : A[c];
    }
  });
}
function CC(A, t, e, i, n, g) {
  return i = i !== void 0 ? i : !0, e = e !== void 0 ? e : 0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(r, s, o, I) {
    if (r !== void 0) {
      const C = n ? yi(
        t,
        n,
        o,
        g
      ) : t;
      if (I)
        return i ? wi(
          r,
          C,
          e
        ) : st(r, e, C);
      const a = 1e-9, c = Math.ceil(
        Math.log(t / C) / Math.log(A) - a
      ), l = -s * (0.5 - a) + 0.5, d = Math.min(C, r), h = Math.floor(
        Math.log(t / d) / Math.log(A) + l
      ), f = Math.max(c, h), m = t / Math.pow(A, f);
      return st(m, e, C);
    }
  });
}
function Yn(A, t, e, i, n) {
  return e = e !== void 0 ? e : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  (function(g, r, s, o) {
    if (g !== void 0) {
      const I = i ? yi(
        A,
        i,
        s,
        n
      ) : A;
      return !e || !o ? st(g, t, I) : wi(
        g,
        I,
        t
      );
    }
  });
}
function vi(A) {
  if (A !== void 0)
    return 0;
}
function Kn(A) {
  if (A !== void 0)
    return A;
}
function aC(A) {
  const t = 2 * Math.PI / A;
  return (
    /**
     * @param {number|undefined} rotation Rotation.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @return {number|undefined} Rotation.
     */
    (function(e, i) {
      if (i)
        return e;
      if (e !== void 0)
        return e = Math.floor(e / t + 0.5) * t, e;
    })
  );
}
function cC(A) {
  const t = te(5);
  return (
    /**
     * @param {number|undefined} rotation Rotation.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @return {number|undefined} Rotation.
     */
    (function(e, i) {
      return i || e === void 0 ? e : Math.abs(e) <= t ? 0 : e;
    })
  );
}
const lC = 256, TA = 0;
class Jn extends se {
  /**
   * @param {ViewOptions} [options] View options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = Object.assign({}, t), this.hints_ = [0, 0], this.animations_ = [], this.updateAnimationKey_, this.projection_ = hi(t.projection, "EPSG:3857"), this.viewportSize_ = [100, 100], this.targetCenter_ = null, this.targetResolution_, this.targetRotation_, this.nextCenter_ = null, this.nextResolution_, this.nextRotation_, this.cancelAnchor_ = void 0, t.projection && xI(), t.center && (t.center = yt(t.center, this.projection_)), t.extent && (t.extent = Ye(t.extent, this.projection_)), this.applyOptions_(t);
  }
  /**
   * Set up the view with the given options.
   * @param {ViewOptions} options View options.
   */
  applyOptions_(t) {
    const e = Object.assign({}, t);
    for (const s in rt)
      delete e[s];
    this.setProperties(e, !0);
    const i = uC(t);
    this.maxResolution_ = i.maxResolution, this.minResolution_ = i.minResolution, this.zoomFactor_ = i.zoomFactor, this.resolutions_ = t.resolutions, this.padding_ = t.padding, this.minZoom_ = i.minZoom;
    const n = hC(t), g = i.constraint, r = fC(t);
    this.constraints_ = {
      center: n,
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
    const i = this.getCenterInternal();
    if (i) {
      const n = t || [0, 0, 0, 0];
      e = e || [0, 0, 0, 0];
      const g = this.getResolution(), r = g / 2 * (n[3] - e[3] + e[1] - n[1]), s = g / 2 * (n[0] - e[0] + e[2] - n[2]);
      this.setCenterInternal([i[0] + r, i[1] - s]);
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
    for (let i = 0; i < e.length; ++i) {
      let n = arguments[i];
      n.center && (n = Object.assign({}, n), n.center = yt(
        n.center,
        this.getProjection()
      )), n.anchor && (n = Object.assign({}, n), n.anchor = yt(
        n.anchor,
        this.getProjection()
      )), e[i] = n;
    }
    this.animateInternal.apply(this, e);
  }
  /**
   * @param {...(AnimationOptions|function(boolean): void)} var_args Animation options.
   */
  animateInternal(t) {
    let e = arguments.length, i;
    e > 1 && typeof arguments[e - 1] == "function" && (i = arguments[e - 1], --e);
    let n = 0;
    for (; n < e && !this.isDef(); ++n) {
      const C = arguments[n];
      C.center && this.setCenterInternal(C.center), C.zoom !== void 0 ? this.setZoom(C.zoom) : C.resolution && this.setResolution(C.resolution), C.rotation !== void 0 && this.setRotation(C.rotation);
    }
    if (n === e) {
      i && Ke(i, !0);
      return;
    }
    let g = Date.now(), r = this.targetCenter_.slice(), s = this.targetResolution_, o = this.targetRotation_;
    const I = [];
    for (; n < e; ++n) {
      const C = (
        /** @type {AnimationOptions} */
        arguments[n]
      ), a = {
        start: g,
        complete: !1,
        anchor: C.anchor,
        duration: C.duration !== void 0 ? C.duration : 1e3,
        easing: C.easing || sC,
        callback: i
      };
      if (C.center && (a.sourceCenter = r, a.targetCenter = C.center.slice(), r = a.targetCenter), C.zoom !== void 0 ? (a.sourceResolution = s, a.targetResolution = this.getResolutionForZoom(C.zoom), s = a.targetResolution) : C.resolution && (a.sourceResolution = s, a.targetResolution = C.resolution, s = a.targetResolution), C.rotation !== void 0) {
        a.sourceRotation = o;
        const c = JA(C.rotation - o + Math.PI, 2 * Math.PI) - Math.PI;
        a.targetRotation = o + c, o = a.targetRotation;
      }
      dC(a) ? a.complete = !0 : g += a.duration, I.push(a);
    }
    this.animations_.push(I), this.setHint(wt.ANIMATING, 1), this.updateAnimations_();
  }
  /**
   * Determine if the view is being animated.
   * @return {boolean} The view is being animated.
   * @api
   */
  getAnimating() {
    return this.hints_[wt.ANIMATING] > 0;
  }
  /**
   * Determine if the user is interacting with the view, such as panning or zooming.
   * @return {boolean} The view is being interacted with.
   * @api
   */
  getInteracting() {
    return this.hints_[wt.INTERACTING] > 0;
  }
  /**
   * Cancel any ongoing animations.
   * @api
   */
  cancelAnimations() {
    this.setHint(wt.ANIMATING, -this.hints_[wt.ANIMATING]);
    let t;
    for (let e = 0, i = this.animations_.length; e < i; ++e) {
      const n = this.animations_[e];
      if (n[0].callback && Ke(n[0].callback, !1), !t)
        for (let g = 0, r = n.length; g < r; ++g) {
          const s = n[g];
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
    for (let i = this.animations_.length - 1; i >= 0; --i) {
      const n = this.animations_[i];
      let g = !0;
      for (let r = 0, s = n.length; r < s; ++r) {
        const o = n[r];
        if (o.complete)
          continue;
        const I = t - o.start;
        let C = o.duration > 0 ? I / o.duration : 1;
        C >= 1 ? (o.complete = !0, C = 1) : g = !1;
        const a = o.easing(C);
        if (o.sourceCenter) {
          const c = o.sourceCenter[0], l = o.sourceCenter[1], d = o.targetCenter[0], h = o.targetCenter[1];
          this.nextCenter_ = o.targetCenter;
          const f = c + a * (d - c), m = l + a * (h - l);
          this.targetCenter_ = [f, m];
        }
        if (o.sourceResolution && o.targetResolution) {
          const c = a === 1 ? o.targetResolution : o.sourceResolution + a * (o.targetResolution - o.sourceResolution);
          if (o.anchor) {
            const l = this.getViewportSize_(this.getRotation()), d = this.constraints_.resolution(
              c,
              0,
              l,
              !0
            );
            this.targetCenter_ = this.calculateCenterZoom(
              d,
              o.anchor
            );
          }
          this.nextResolution_ = o.targetResolution, this.targetResolution_ = c, this.applyTargetState_(!0);
        }
        if (o.sourceRotation !== void 0 && o.targetRotation !== void 0) {
          const c = a === 1 ? JA(o.targetRotation + Math.PI, 2 * Math.PI) - Math.PI : o.sourceRotation + a * (o.targetRotation - o.sourceRotation);
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
      if (g) {
        this.animations_[i] = null, this.setHint(wt.ANIMATING, -1), this.nextCenter_ = null, this.nextResolution_ = NaN, this.nextRotation_ = NaN;
        const r = n[0].callback;
        r && Ke(r, !0);
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
    let i;
    const n = this.getCenterInternal();
    return n !== void 0 && (i = [n[0] - e[0], n[1] - e[1]], ai(i, t - this.getRotation()), AI(i, e)), i;
  }
  /**
   * @param {number} resolution Target resolution.
   * @param {import("./coordinate.js").Coordinate} anchor Zoom anchor.
   * @return {import("./coordinate.js").Coordinate|undefined} Center for resolution and anchor.
   */
  calculateCenterZoom(t, e) {
    let i;
    const n = this.getCenterInternal(), g = this.getResolution();
    if (n !== void 0 && g !== void 0) {
      const r = e[0] - t * (e[0] - n[0]) / g, s = e[1] - t * (e[1] - n[1]) / g;
      i = [r, s];
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
    const e = this.viewportSize_;
    if (t) {
      const i = e[0], n = e[1];
      return [
        Math.abs(i * Math.cos(t)) + Math.abs(n * Math.sin(t)),
        Math.abs(i * Math.sin(t)) + Math.abs(n * Math.cos(t))
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
    return t && zn(t, this.getProjection());
  }
  /**
   * Get the view center without transforming to user projection.
   * @return {import("./coordinate.js").Coordinate|undefined} The center of the view.
   */
  getCenterInternal() {
    return (
      /** @type {import("./coordinate.js").Coordinate|undefined} */
      this.get(rt.CENTER)
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
    return TI(e, this.getProjection());
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
    bt(e, "The view center is not defined");
    const i = (
      /** @type {!number} */
      this.getResolution()
    );
    bt(i !== void 0, "The view resolution is not defined");
    const n = (
      /** @type {!number} */
      this.getRotation()
    );
    return bt(n !== void 0, "The view rotation is not defined"), Wo(e, i, n, t);
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
      this.get(rt.RESOLUTION)
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
      Ye(t, this.getProjection()),
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
    const i = oi(t) / e[0], n = we(t) / e[1];
    return Math.max(i, n);
  }
  /**
   * Return a function that returns a value between 0 and 1 for a
   * resolution. Exponential scaling is assumed.
   * @param {number} [power] Power.
   * @return {function(number): number} Resolution for value function.
   */
  getResolutionForValueFunction(t) {
    t = t || 2;
    const e = this.getConstrainedResolution(this.maxResolution_), i = this.minResolution_, n = Math.log(e / i) / Math.log(t);
    return (
      /**
       * @param {number} value Value.
       * @return {number} Resolution.
       */
      (function(g) {
        return e / Math.pow(t, g * n);
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
      this.get(rt.ROTATION)
    );
  }
  /**
   * Return a function that returns a resolution for a value between
   * 0 and 1. Exponential scaling is assumed.
   * @param {number} [power] Power.
   * @return {function(number): number} Value for resolution function.
   */
  getValueForResolutionFunction(t) {
    const e = Math.log(t || 2), i = this.getConstrainedResolution(this.maxResolution_), n = this.minResolution_, g = Math.log(i / n) / e;
    return (
      /**
       * @param {number} resolution Resolution.
       * @return {number} Value.
       */
      (function(r) {
        return Math.log(i / r) / e / g;
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
    const i = this.padding_;
    return i && (e = [
      e[0] - i[1] - i[3],
      e[1] - i[0] - i[2]
    ]), e;
  }
  /**
   * @return {State} View state.
   */
  getState() {
    const t = this.getProjection(), e = this.getResolution(), i = this.getRotation();
    let n = (
      /** @type {import("./coordinate.js").Coordinate} */
      this.getCenterInternal()
    );
    const g = this.padding_;
    if (g) {
      const r = this.getViewportSizeMinusPadding_();
      n = kA(
        n,
        this.getViewportSize_(),
        [r[0] / 2 + g[3], r[1] / 2 + g[0]],
        e,
        i
      );
    }
    return {
      center: n.slice(0),
      projection: t !== void 0 ? t : null,
      resolution: e,
      nextCenter: this.nextCenter_,
      nextResolution: this.nextResolution_,
      nextRotation: this.nextRotation_,
      rotation: i,
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
    let e = this.minZoom_ || 0, i, n;
    if (this.resolutions_) {
      const g = Dg(this.resolutions_, t, 1);
      e = g, i = this.resolutions_[g], g == this.resolutions_.length - 1 ? n = 2 : n = i / this.resolutions_[g + 1];
    } else
      i = this.maxResolution_, n = this.zoomFactor_;
    return e + Math.log(i / t) / Math.log(n);
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
      const e = st(
        Math.floor(t),
        0,
        this.resolutions_.length - 2
      ), i = this.resolutions_[e] / this.resolutions_[e + 1];
      return this.resolutions_[e] / Math.pow(i, st(t - e, 0, 1));
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
    let i;
    if (bt(
      Array.isArray(t) || typeof /** @type {?} */
      t.getSimplifiedGeometry == "function",
      "Invalid extent or geometry provided as `geometry`"
    ), Array.isArray(t)) {
      bt(
        !Xg(t),
        "Cannot fit empty extent provided as `geometry`"
      );
      const n = Ye(t, this.getProjection());
      i = Vn(n);
    } else if (t.getType() === "Circle") {
      const n = Ye(
        t.getExtent(),
        this.getProjection()
      );
      i = Vn(n), i.rotate(this.getRotation(), tA(n));
    } else
      i = t;
    this.fitInternal(i, e);
  }
  /**
   * Calculate rotated extent
   * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
   * @return {import("./extent.js").Extent} The rotated extent for the geometry.
   */
  rotatedExtentForGeometry(t) {
    const e = this.getRotation(), i = Math.cos(e), n = Math.sin(-e), g = t.getFlatCoordinates(), r = t.getStride();
    let s = 1 / 0, o = 1 / 0, I = -1 / 0, C = -1 / 0;
    for (let a = 0, c = g.length; a < c; a += r) {
      const l = g[a] * i - g[a + 1] * n, d = g[a] * n + g[a + 1] * i;
      s = Math.min(s, l), o = Math.min(o, d), I = Math.max(I, l), C = Math.max(C, d);
    }
    return [s, o, I, C];
  }
  /**
   * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
   * @param {FitOptions} [options] Options.
   */
  fitInternal(t, e) {
    e = e || {};
    let i = e.size;
    i || (i = this.getViewportSizeMinusPadding_());
    const n = e.padding !== void 0 ? e.padding : [0, 0, 0, 0], g = e.nearest !== void 0 ? e.nearest : !1;
    let r;
    e.minResolution !== void 0 ? r = e.minResolution : e.maxZoom !== void 0 ? r = this.getResolutionForZoom(e.maxZoom) : r = 0;
    const s = this.rotatedExtentForGeometry(t);
    let o = this.getResolutionForExtentInternal(s, [
      i[0] - n[1] - n[3],
      i[1] - n[0] - n[2]
    ]);
    o = isNaN(o) ? r : Math.max(o, r), o = this.getConstrainedResolution(o, g ? 0 : 1);
    const I = this.getRotation(), C = Math.sin(I), a = Math.cos(I), c = tA(s);
    c[0] += (n[1] - n[3]) / 2 * o, c[1] += (n[0] - n[2]) / 2 * o;
    const l = c[0] * a - c[1] * C, d = c[1] * a + c[0] * C, h = this.getConstrainedCenter([l, d], o), f = e.callback ? e.callback : KA;
    e.duration !== void 0 ? this.animateInternal(
      {
        resolution: o,
        center: h,
        duration: e.duration,
        easing: e.easing
      },
      f
    ) : (this.targetResolution_ = o, this.targetCenter_ = h, this.applyTargetState_(!1, !0), Ke(f, !0));
  }
  /**
   * Center on coordinate and view position.
   * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("./size.js").Size} size Box pixel size.
   * @param {import("./pixel.js").Pixel} position Position on the view to center on.
   * @api
   */
  centerOn(t, e, i) {
    this.centerOnInternal(
      yt(t, this.getProjection()),
      e,
      i
    );
  }
  /**
   * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("./size.js").Size} size Box pixel size.
   * @param {import("./pixel.js").Pixel} position Position on the view to center on.
   */
  centerOnInternal(t, e, i) {
    this.setCenterInternal(
      kA(
        t,
        e,
        i,
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
  calculateCenterShift(t, e, i, n) {
    let g;
    const r = this.padding_;
    if (r && t) {
      const s = this.getViewportSizeMinusPadding_(-i), o = kA(
        t,
        n,
        [s[0] / 2 + r[3], s[1] / 2 + r[0]],
        e,
        i
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
    const e = zn(this.targetCenter_, this.getProjection());
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
    e = e && yt(e, this.getProjection()), this.adjustResolutionInternal(t, e);
  }
  /**
   * Multiply the view resolution by a ratio, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} ratio The ratio to apply on the view resolution.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  adjustResolutionInternal(t, e) {
    const i = this.getAnimating() || this.getInteracting(), n = this.getViewportSize_(this.getRotation()), g = this.constraints_.resolution(
      this.targetResolution_ * t,
      0,
      n,
      i
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
    e && (e = yt(e, this.getProjection())), this.adjustRotationInternal(t, e);
  }
  /**
   * @param {number} delta Relative value to add to the zoom rotation, in radians.
   * @param {import("./coordinate.js").Coordinate} [anchor] The rotation center.
   */
  adjustRotationInternal(t, e) {
    const i = this.getAnimating() || this.getInteracting(), n = this.constraints_.rotation(
      this.targetRotation_ + t,
      i
    );
    e && (this.targetCenter_ = this.calculateCenterRotate(n, e)), this.targetRotation_ += t, this.applyTargetState_();
  }
  /**
   * Set the center of the current view. Any extent constraint will apply.
   * @param {import("./coordinate.js").Coordinate|undefined} center The center of the view.
   * @observable
   * @api
   */
  setCenter(t) {
    this.setCenterInternal(
      t && yt(t, this.getProjection())
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
    const i = this.getAnimating() || this.getInteracting() || e, n = this.constraints_.rotation(
      this.targetRotation_,
      i
    ), g = this.getViewportSize_(n), r = this.constraints_.resolution(
      this.targetResolution_,
      0,
      g,
      i
    ), s = this.constraints_.center(
      this.targetCenter_,
      r,
      g,
      i,
      this.calculateCenterShift(
        this.targetCenter_,
        r,
        n,
        g
      )
    );
    this.get(rt.ROTATION) !== n && this.set(rt.ROTATION, n), this.get(rt.RESOLUTION) !== r && (this.set(rt.RESOLUTION, r), this.set("zoom", this.getZoom(), !0)), (!s || !this.get(rt.CENTER) || !eA(this.get(rt.CENTER), s)) && this.set(rt.CENTER, s), this.getAnimating() && !t && this.cancelAnimations(), this.cancelAnchor_ = void 0;
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
  resolveConstraints(t, e, i) {
    t = t !== void 0 ? t : 200;
    const n = e || 0, g = this.constraints_.rotation(this.targetRotation_), r = this.getViewportSize_(g), s = this.constraints_.resolution(
      this.targetResolution_,
      n,
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
    i = i || (t === 0 ? this.cancelAnchor_ : void 0), this.cancelAnchor_ = void 0, (this.getResolution() !== s || this.getRotation() !== g || !this.getCenterInternal() || !eA(this.getCenterInternal(), o)) && (this.getAnimating() && this.cancelAnimations(), this.animateInternal({
      rotation: g,
      center: o,
      resolution: s,
      duration: t,
      easing: fA,
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
    this.resolveConstraints(0), this.setHint(wt.INTERACTING, 1);
  }
  /**
   * Notify the View that an interaction has ended. The view state will be resolved
   * to a stable one if needed (depending on its constraints).
   * @param {number} [duration] Animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   * @api
   */
  endInteraction(t, e, i) {
    i = i && yt(i, this.getProjection()), this.endInteractionInternal(t, e, i);
  }
  /**
   * Notify the View that an interaction has ended. The view state will be resolved
   * to a stable one if needed (depending on its constraints).
   * @param {number} [duration] Animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  endInteractionInternal(t, e, i) {
    this.getInteracting() && (this.setHint(wt.INTERACTING, -1), this.resolveConstraints(t, e, i));
  }
  /**
   * Get a valid position for the view center according to the current constraints.
   * @param {import("./coordinate.js").Coordinate|undefined} targetCenter Target center position.
   * @param {number} [targetResolution] Target resolution. If not supplied, the current one will be used.
   * This is useful to guess a valid center position at a different zoom level.
   * @return {import("./coordinate.js").Coordinate|undefined} Valid center position.
   */
  getConstrainedCenter(t, e) {
    const i = this.getViewportSize_(this.getRotation());
    return this.constraints_.center(
      t,
      e || this.getResolution(),
      i
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
    const i = this.getResolutionForZoom(t);
    return this.getZoomForResolution(
      this.getConstrainedResolution(i, e)
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
    const i = this.getViewportSize_(this.getRotation());
    return this.constraints_.resolution(t, e, i);
  }
}
function Ke(A, t) {
  setTimeout(function() {
    A(t);
  }, 0);
}
function hC(A) {
  if (A.extent !== void 0) {
    const e = A.smoothExtentConstraint !== void 0 ? A.smoothExtentConstraint : !0;
    return Hn(A.extent, A.constrainOnlyCenter, e);
  }
  const t = hi(A.projection, "EPSG:3857");
  if (A.multiWorld !== !0 && t.isGlobal()) {
    const e = t.getExtent().slice();
    return e[0] = -1 / 0, e[2] = 1 / 0, Hn(e, !1, !1);
  }
  return gC;
}
function uC(A) {
  let t, e, i, r = A.minZoom !== void 0 ? A.minZoom : TA, s = A.maxZoom !== void 0 ? A.maxZoom : 28;
  const o = A.zoomFactor !== void 0 ? A.zoomFactor : 2, I = A.multiWorld !== void 0 ? A.multiWorld : !1, C = A.smoothResolutionConstraint !== void 0 ? A.smoothResolutionConstraint : !0, a = A.showFullExtent !== void 0 ? A.showFullExtent : !1, c = hi(A.projection, "EPSG:3857"), l = c.getExtent();
  let d = A.constrainOnlyCenter, h = A.extent;
  if (!I && !h && c.isGlobal() && (d = !1, h = l), A.resolutions !== void 0) {
    const f = A.resolutions;
    e = f[r], i = f[s] !== void 0 ? f[s] : f[f.length - 1], A.constrainResolution ? t = IC(
      f,
      C,
      !d && h,
      a
    ) : t = Yn(
      e,
      i,
      C,
      !d && h,
      a
    );
  } else {
    const m = (l ? Math.max(oi(l), we(l)) : (
      // use an extent that can fit the whole world if need be
      360 * jg.degrees / c.getMetersPerUnit()
    )) / lC / Math.pow(2, TA), y = m / Math.pow(2, 28 - TA);
    e = A.maxResolution, e !== void 0 ? r = 0 : e = m / Math.pow(o, r), i = A.minResolution, i === void 0 && (A.maxZoom !== void 0 ? A.maxResolution !== void 0 ? i = e / Math.pow(o, s) : i = m / Math.pow(o, s) : i = y), s = r + Math.floor(
      Math.log(e / i) / Math.log(o)
    ), i = e / Math.pow(o, s - r), A.constrainResolution ? t = CC(
      o,
      e,
      i,
      C,
      !d && h,
      a
    ) : t = Yn(
      e,
      i,
      C,
      !d && h,
      a
    );
  }
  return {
    constraint: t,
    maxResolution: e,
    minResolution: i,
    minZoom: r,
    zoomFactor: o
  };
}
function fC(A) {
  if (A.enableRotation !== void 0 ? A.enableRotation : !0) {
    const e = A.constrainRotation;
    return e === void 0 || e === !0 ? cC() : e === !1 ? Kn : typeof e == "number" ? aC(e) : Kn;
  }
  return vi;
}
function dC(A) {
  return !(A.sourceCenter && A.targetCenter && !eA(A.sourceCenter, A.targetCenter) || A.sourceResolution !== A.targetResolution || A.sourceRotation !== A.targetRotation);
}
function kA(A, t, e, i, n) {
  const g = Math.cos(-n);
  let r = Math.sin(-n), s = A[0] * g - A[1] * r, o = A[1] * g + A[0] * r;
  s += (t[0] / 2 - e[0]) * i, o += (e[1] - t[1] / 2) * i, r = -r;
  const I = s * g - o * r, C = o * g + s * r;
  return [I, C];
}
const mC = {
  /**
   * Triggered before layers are composed.  When dispatched by the map, the event object will not have
   * a `context` set.  When dispatched by a layer, the event object will have a `context` set.  Only
   * WebGL layers currently dispatch this event.
   * @event module:ol/render/Event~RenderEvent#precompose
   * @api
   */
  PRECOMPOSE: "precompose"
}, G = {
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
class pC extends se {
  /**
   * @param {Options<NoInfer<Properties>>} options Layer options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, this.background_ = t.background;
    const e = Object.assign({}, t);
    typeof t.properties == "object" && (delete e.properties, Object.assign(e, t.properties)), e[G.OPACITY] = t.opacity !== void 0 ? t.opacity : 1, bt(
      typeof e[G.OPACITY] == "number",
      "Layer opacity must be a number"
    ), e[G.VISIBLE] = t.visible !== void 0 ? t.visible : !0, e[G.Z_INDEX] = t.zIndex, e[G.MAX_RESOLUTION] = t.maxResolution !== void 0 ? t.maxResolution : 1 / 0, e[G.MIN_RESOLUTION] = t.minResolution !== void 0 ? t.minResolution : 0, e[G.MIN_ZOOM] = t.minZoom !== void 0 ? t.minZoom : -1 / 0, e[G.MAX_ZOOM] = t.maxZoom !== void 0 ? t.maxZoom : 1 / 0, this.className_ = e.className !== void 0 ? e.className : "ol-layer", delete e.className, this.setProperties(e), this.state_ = null;
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
    }, i = this.getZIndex();
    return e.opacity = st(Math.round(this.getOpacity() * 100) / 100, 0, 1), e.visible = this.getVisible(), e.extent = this.getExtent(), e.zIndex = i === void 0 && !e.managed ? 1 / 0 : i, e.maxResolution = this.getMaxResolution(), e.minResolution = Math.max(this.getMinResolution(), 0), e.minZoom = this.getMinZoom(), e.maxZoom = this.getMaxZoom(), this.state_ = e, e;
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").default>} [array] Array of layers (to be
   *     modified in place).
   * @return {Array<import("./Layer.js").default>} Array of layers.
   */
  getLayersArray(t) {
    return q();
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").State>} [states] Optional list of layer
   *     states (to be modified in place).
   * @return {Array<import("./Layer.js").State>} List of layer states.
   */
  getLayerStatesArray(t) {
    return q();
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
      this.get(G.EXTENT)
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
      this.get(G.MAX_RESOLUTION)
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
      this.get(G.MIN_RESOLUTION)
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
      this.get(G.MIN_ZOOM)
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
      this.get(G.MAX_ZOOM)
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
      this.get(G.OPACITY)
    );
  }
  /**
   * @abstract
   * @return {import("../source/Source.js").State} Source state.
   */
  getSourceState() {
    return q();
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
      this.get(G.VISIBLE)
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
      this.get(G.Z_INDEX)
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
    this.set(G.EXTENT, t);
  }
  /**
   * Set the maximum resolution at which the layer is visible.
   * @param {number} maxResolution The maximum resolution of the layer.
   * @observable
   * @api
   */
  setMaxResolution(t) {
    this.set(G.MAX_RESOLUTION, t);
  }
  /**
   * Set the minimum resolution at which the layer is visible.
   * @param {number} minResolution The minimum resolution of the layer.
   * @observable
   * @api
   */
  setMinResolution(t) {
    this.set(G.MIN_RESOLUTION, t);
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
    this.set(G.MAX_ZOOM, t);
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
    this.set(G.MIN_ZOOM, t);
  }
  /**
   * Set the opacity of the layer, allowed values range from 0 to 1.
   * @param {number} opacity The opacity of the layer.
   * @observable
   * @api
   */
  setOpacity(t) {
    bt(typeof t == "number", "Layer opacity must be a number"), this.set(G.OPACITY, t);
  }
  /**
   * Set the visibility of the layer (`true` or `false`).
   * @param {boolean} visible The visibility of the layer.
   * @observable
   * @api
   */
  setVisible(t) {
    this.set(G.VISIBLE, t);
  }
  /**
   * Set Z-index of the layer, which is used to order layers before rendering.
   * The default Z-index is 0.
   * @param {number} zindex The z-index of the layer.
   * @observable
   * @api
   */
  setZIndex(t) {
    this.set(G.Z_INDEX, t);
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.state_ && (this.state_.layer = null, this.state_ = null), super.disposeInternal();
  }
}
class $g extends pC {
  /**
   * @param {Options<SourceType, NoInfer<Properties>>} options Layer options.
   */
  constructor(t) {
    const e = Object.assign({}, t);
    delete e.source, super(e), this.on, this.once, this.un, this.mapPrecomposeKey_ = null, this.mapRenderKey_ = null, this.sourceChangeKey_ = null, this.renderer_ = null, this.sourceReady_ = !1, this.rendered = !1, t.render && (this.render = t.render), t.map && this.setMap(t.map), this.addChangeListener(
      G.SOURCE,
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
      this.get(G.SOURCE) || null
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
    this.sourceChangeKey_ && (_t(this.sourceChangeKey_), this.sourceChangeKey_ = null), this.sourceReady_ = !1;
    const t = this.getSource();
    t && (this.sourceChangeKey_ = Rt(
      t,
      Pt.CHANGE,
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
    const i = this.getMapInternal();
    !t && i && (t = i.getView()), t instanceof Jn ? e = {
      viewState: t.getState(),
      extent: t.calculateExtent()
    } : e = t, !e.layerStatesArray && i && (e.layerStatesArray = i.getLayerGroup().getLayerStatesArray());
    let n;
    if (e.layerStatesArray) {
      if (n = e.layerStatesArray.find(
        (r) => r.layer === this
      ), !n)
        return !1;
    } else
      n = this.getLayerState();
    const g = this.getExtent();
    return yC(n, e.viewState) && (!g || Ii(g, e.extent));
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
    const i = t instanceof Jn ? t.getViewStateAndExtent() : t;
    let n = e(i);
    return Array.isArray(n) || (n = [n]), n;
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
    const i = this.getRenderer();
    return i.prepareFrame(t) ? (this.rendered = !0, i.renderFrame(t, e)) : null;
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
    t || this.unrender(), this.set(G.MAP, t);
  }
  /**
   * For use inside the library only.
   * @return {import("../Map.js").default|null} Map.
   */
  getMapInternal() {
    return this.get(G.MAP);
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
    this.mapPrecomposeKey_ && (_t(this.mapPrecomposeKey_), this.mapPrecomposeKey_ = null), t || this.changed(), this.mapRenderKey_ && (_t(this.mapRenderKey_), this.mapRenderKey_ = null), t && (this.mapPrecomposeKey_ = Rt(
      t,
      mC.PRECOMPOSE,
      this.handlePrecompose_,
      this
    ), this.mapRenderKey_ = Rt(this, Pt.CHANGE, t.render, t), this.changed());
  }
  /**
   * @param {import("../events/Event.js").default} renderEvent Render event
   * @private
   */
  handlePrecompose_(t) {
    const e = (
      /** @type {import("../render/Event.js").default} */
      t.frameState.layerStatesArray
    ), i = this.getLayerState(!1);
    bt(
      !e.some(
        (n) => n.layer === i.layer
      ),
      "A layer can only be added to the map once. Use either `layer.setMap()` or `map.addLayer()`, not both."
    ), e.push(i);
  }
  /**
   * Set the layer source.
   * @param {SourceType|null} source The layer source.
   * @observable
   * @api
   */
  setSource(t) {
    this.set(G.SOURCE, t);
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
function yC(A, t) {
  if (!A.visible)
    return !1;
  const e = t.resolution;
  if (e < A.minResolution || e >= A.maxResolution)
    return !1;
  const i = t.zoom;
  return i > A.minZoom && i <= A.maxZoom;
}
class wC extends $g {
  constructor(t) {
    const e = function(i) {
      const n = this.getSource(), g = n.mapboxMap;
      if (!g)
        return console.error("MapboxLayer: mapboxMap is undefined!"), null;
      g.setStyle(n.style);
      const r = g.getCanvas(), s = i.viewState, o = this.getVisible();
      r.style.display = o ? "block" : "none";
      const I = this.getOpacity();
      r.style.opacity = I;
      const C = s.rotation * -180 / Math.PI, a = ni(s.center), c = s.zoom - 1, l = g.getBearing(), d = g.getCenter().toArray(), h = g.getZoom();
      return C == l && a[0] == d[0] && a[1] == d[1] && c == h || (C != l && g.rotateTo(C, {
        animate: !1
      }), (a[0] != d[0] || a[1] != d[1] || c != h) && g.jumpTo({
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
class vC extends $g {
  constructor(t) {
    const e = function(i) {
      const n = this.getSource(), g = n.maplibreMap;
      if (!g)
        return console.error("MapLibreLayer: maplibreMap is undefined!"), null;
      g.setStyle(n.style);
      const r = g.getCanvas(), s = i.viewState, o = this.getVisible();
      r.style.display = o ? "block" : "none";
      const I = this.getOpacity();
      r.style.opacity = I;
      const a = -s.rotation * 180 / Math.PI, c = g.getBearing();
      Math.abs(a - c) > 0.01 && (g.stop(), g.setBearing(a));
      const l = ni(s.center), d = s.zoom - 1;
      if ((g.getCenter().toArray().toString() !== l.toString() || g.getZoom() !== d) && g.jumpTo({
        center: l,
        zoom: d,
        animate: !1
      }), g._frame && (g._frame.cancel(), g._frame = null), i.size) {
        const [h, f] = i.size;
        (r.width !== h || r.height !== f) && g.resize();
      }
      return g._render(), Math.abs(g.getZoom() - d) > 0.01 && g.setZoom(d), r.style.position = "absolute", r.style.left = "0", r.style.top = "0", r;
    };
    super({
      render: e,
      source: t.source
    });
  }
}
const tr = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6MTE6NDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAxMS0xMC0yNlQyMTo1MjoxOFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAxMS0xMC0yN1QxNzo0MjowN1o8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgkVIwmwAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTM5jWRgMAAAAWdEVYdENyZWF0aW9uIFRpbWUAMTAvMjYvMTHjwOqVAAARQHByVld4nMWbB3wURdvAd6/u3V6/27sts/PMQQhFpEU6SlNBRXqTfgkkQOhFSigHIgIWkJqAIJ1QBCz0KkJoQYrSQaQjioBKC+XezWU5fH2/3+/L8fu+fWd3bubZKf95nnlmdjeX2/dk602qD9UnooRc5YjkKp9KyIrkZikfkazcSFaWcuZmpUZScyOpWcqZm6rkU3OTIpGk3EhSViQpVTlzk5IiSUm5VCRC5UaorAiVqpy5VFKESspND6UY03O6U0oYGHo3NCg0ODSj59BQRmhYaHhoaDofFsJiGIVfC78e/hnOwwW4CI1Ttve/AlehLClH6oTrhl8N1wu3CIcFKhqWiwVpWvrG9EcjmXC2nC/1Sd+dHgonh1PCpxQ5nN4pfHHk3qGzOlFUepiiPk5PC/cO9wn3DfcL59deGOqWXC95Saigp/fCY8Lvh0e9Xm94q3DBlXLd2qm5kmRpSrdw9/CEqNwneWQ4HH6hXul6FHVs5Gfh2eGbI6eFp0fLxoZqhE/KC6P5Oa9lhzN7ymofy5PN4anhCRlfFpSVXxNeG26UQf0jyBSO5R1UcjTdF/3c8o+a66j11AbqhCrtpvZQe6lzqnSRukRdjtU8Q52lfqJuqNJt6g/qTzW/ltpKbaO2U99SO9QrF6j71AMqL9b2OvUr9VtMYmgLbaU9dIHkpwM0r+YdtJN20W76ytOa/zZWjpZpTANdNlr7NJVEv0RXpCtFpR+panR1ugZdPCodoGrTdei69MNou3p0ffoN+k36aT+rqcZqfheVQzWiW9HUP0Kn6BVEJ9DF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zV6+JT3q/K+UUkoppZ5Tl9rnzXTvZS/51pTrIJewYX0bzb5r+vfUX7X2ebU/rDnUmslszXqN0v99bSO/80ff/EtrIayb9PNrKMs56kf84zG7v5Te6HqW1yytUb8m7mzNaVbmv4r9stz7I1/WPPKc9sIzuc6ebST3XjlnDZd7OSawd7MmvNs6y5nriXWP9WbWmvq6UoX3Ota9TCttV8f0GZBXXqMep8R6JfdJl73upTKfo+6XbG+j/s9aG7ZmP75rNPZXvNzHLegjrPOtCT9WL+yXY17/tyH3IRB7GXXMtcq0VabZ8xrZt/8TQZzR/ZH/R2U+R33+P8X/GX/2/pB24py9GY74M//JWBN+ar36nJd7Avh6VKf0QbdPXs/yyrDRPhP3sz9znXmPynyutvB/30cpn1CmPC8x1jF+MpbRnteGn1Ivwhg3+I8AG9O+EHNt938fc3KP8pj/+X8i8yj1+93/szKfq2P+z7kdO/R+knUt9fEpfYO/iMs8tlX4MbtnGLbk/TrnYcZw4mLntDV7nfgz9yiPlYN/a/EhbSdtyp7ZyP+jMp/zLsh+W9YpfUffzrpij9FYRdxMr+fX/dn7wZpwwpbqlWHUg7mk+zfn8tE3GM/350Z59TDaQN+LTBsTP/Oelbn3tUtoab1APb70v1JKKaWUUkoppZRSSl1NOxERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERGRO+Qfh5eOajemXSYAAAFTbWtCVPrOyv4Af1WJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4nO3W4WmDYBSGUQdxEQdxEBdxEAdxEQexvIELt6Yh/4oJ54FDm0/7601szlOSJEmSJEmSJEmSJEmSJEmSJEkf0XEc577vT+c5y7V397+6T/dvXddzHMdzmqbHz+wY/Sz31L11FsuyPF7HMAx/vod077JjlX2zYXatzfs9tX/VN7/+je5ftut7Vjnrn+V6nX37xtm/ul7T/ctzvu9f/9fneX7aP9fs/31l23ru1+/btv36zPfnv/2/r/oe1/er90Cu1Xf7nEXVnx3Xa5IkSZIkSZIk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b24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+zWqGFQAACShJREFUWIWVmGusXFUVx39r73POzJy5M3fmPtrblj7p7btYGigGmojExISHQQ0miDFA4lc0SCBRNH4gRhNJ/aIfNAIxUkKIkMgjBBKMCHwQEGKhpbS39HXfve+5M3fmnr23H84+M7e1PDyTlbPPnDl7//da//Vf64zwBQ9jjCilAiDyFgIaUP4nFjDAMtACWtbaRGvtPmte59Lb8gUW137hGCgDFaDkrzMwrABRBxaAWWDeX7esteZyoD4XSJIkorXO+cV7gQFg9fMvLdz74bHm+hOnTP/QsOmeaxBYoJTDbF2n5wa36At7d+XOfOOW0uPAmLcpYN4Y0wyC4LIeuiwQ55wC8kA/sHF62tz5+F/mDz7zytKOTxpBMKsCEq1BCWjBiQAOcRAYQylpcWW0bG6/Kf/Rvd/rfmP1Kn0YOANMAksiYj8XiAcRew9se/ZvtR8/+seFr3xQj3QtDHGhQCCIFtAqDYxI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", er = "data:image/png;base64,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", Ar = "data:image/png;base64,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", bi = "data:image/png;base64,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", bC = new at({
  image: new ie({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: tr
  })
}), MC = new at({
  image: new ie({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: er
  })
}), EC = new at({
  image: new ie({
    anchor: [0.5, 0.5],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: Ar
  })
}), RC = new at({
  fill: new FA({
    color: [128, 128, 256, 0.2]
  }),
  stroke: new zA({
    color: [128, 128, 256, 1],
    width: 3
  })
}), PC = new at({
  image: new ie({
    anchor: [0.5, 1],
    anchorXUnits: "fraction",
    anchorYUnits: "fraction",
    src: bi
  })
});
class Mt extends bs {
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
    t = ct(t || {});
    const e = new Ne({
      source: new ze({
        wrapX: !1
      })
    });
    e.set("name", "gps");
    const i = new Ne({
      source: new ze({
        wrapX: !1
      })
    });
    i.set("name", "marker");
    const n = new Ne({
      source: new ze({
        wrapX: !1
      })
    });
    n.set("name", "feature");
    const g = new Ne({
      source: new ze({
        wrapX: !1
      })
    });
    g.set("name", "envelope");
    const r = Mt.spawnLayer(
      null,
      t.source,
      t.target
    ), s = new Es();
    s.set("name", "overlay");
    const I = {
      controls: t.controls ? t.controls : [],
      layers: [
        r,
        s,
        g,
        n,
        e,
        i
      ],
      target: t.div,
      view: new og({
        center: t.defaultCenter || [0, 0],
        zoom: t.defaultZoom || 2,
        rotation: t.defaultRotation || 0,
        multiWorld: !0
      })
    };
    t.interactions && (I.interactions = t.interactions), super(I), this.fakeGps = t.fakeGps, this.fakeRadius = t.fakeRadius, this.homePosition = t.homePosition, this.northUp = t.northUp, this.tapDuration = t.tapDuration, this.homeMarginPixels = t.homeMarginPixels, this.tapUIVanish = t.tapUIVanish, this.alwaysGpsOn = t.alwaysGpsOn || !1;
    const C = this.getView();
    this.__ignore_first_move = !0;
    const a = () => {
      this.__ignore_first_move || this.dispatchEvent("movestart"), this.__ignore_first_move = !1, C.un("propertychange", a);
    };
    C.on("propertychange", a), this.on("moveend", () => {
      C.on("propertychange", a);
    }), C.on("change:resolution", () => {
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
    const i = e && typeof e.isWmts == "function" && e.isWmts() ? e.minZoom : void 0;
    typeof i == "number" && Number.isFinite(i) && i > 4 ? t.setMinZoom(i - 4) : t.setMinZoom(-1 / 0);
  }
  static spawnLayer(t, e, i) {
    return e instanceof gA || e instanceof rA || !(t instanceof MA) ? (e instanceof gA ? t = new wC({
      style: e.style,
      accessToken: e.accessToken,
      container: i,
      source: e
    }) : e instanceof rA ? t = new vC({
      style: e.style,
      container: i,
      source: e
    }) : (t = new MA({
      source: e
    }), Mt.applyWmtsZoomGate(t, e)), t.set("name", "base")) : (t.setSource(e), Mt.applyWmtsZoomGate(t, e)), t;
  }
  getLayer(t = "base") {
    const e = (i) => {
      const n = i.getArray().map((g) => {
        if (g.get("name") == t) return g;
        if (g.getLayers) return e(g.getLayers());
      }).filter((g) => g);
      if (n.length != 0)
        return n[0];
    };
    return e(this.getLayers());
  }
  getSource(t = "base") {
    const e = this.getLayer(t);
    if (e)
      return e.getSource();
  }
  setFeature(t, e, i) {
    const n = this.getSource(i), g = new Ms(t);
    return e && g.setStyle(e), n.addFeature(g), g;
  }
  removeFeature(t, e) {
    this.getSource(e).removeFeature(t);
  }
  resetFeature(t) {
    this.getSource(t).clear();
  }
  setGPSPosition(t, e = void 0) {
    const i = e == "sub" ? EC : e == "hide" ? MC : bC;
    e != "sub" && this.resetFeature("gps"), t && (this.setFeature(
      {
        geometry: new Re(t.xy)
      },
      i,
      "gps"
    ), e || this.setFeature(
      {
        geometry: new fi(t.xy, t.rad)
      },
      RC,
      "gps"
    ));
  }
  setMarker(t, e, i, n) {
    return n || (n = "marker"), e.geometry = new Re(t), i ? typeof i == "string" ? i = new at({
      image: new ie({
        anchor: [0.5, 1],
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: i
      })
    }) : i instanceof at || (i = new at({
      image: new ie(i)
    })) : i = PC, this.setFeature(e, i, n);
  }
  resetMarker(t) {
    t || (t = "marker"), this.resetFeature(t);
  }
  setLine(t, e, i) {
    return this.setVector(t, "Line", e ? { stroke: e } : null, i);
  }
  setVector(t, e = "Line", i, n) {
    n || (n = "feature");
    const g = {};
    i.stroke != null && (g.stroke = new zA(i.stroke)), i.fill != null && (g.fill = new FA(i.fill));
    const r = new at(g), s = e === "Line" ? new nA(t) : new Lt(t);
    return this.setFeature(
      {
        geometry: s,
        name: e
      },
      r,
      n
    );
  }
  resetLine(t) {
    this.resetVector(t);
  }
  resetVector(t) {
    t || (t = "feature"), this.resetFeature(t);
  }
  setEnvelope(t, e, i) {
    return i || (i = "envelope"), this.setLine(t, e, i);
  }
  removeEnvelope(t, e) {
    e || (e = "envelope"), this.removeFeature(t, e);
  }
  resetEnvelope(t) {
    t || (t = "envelope"), this.resetFeature(t);
  }
  setFillEnvelope(t, e, i, n) {
    n || (n = "envelope");
    let g;
    if (e != null || i != null) {
      const r = {};
      e != null && (r.stroke = new zA(e)), i != null && (r.fill = new FA(i)), g = new at(r);
    }
    return this.setFeature(
      {
        geometry: new Lt([t])
      },
      g,
      n
    );
  }
  exchangeSource(t = void 0) {
    const e = this.getLayers(), i = e.item(0), n = Mt.spawnLayer(i, t, this.getTarget());
    n != i && e.setAt(0, n), t && t.setMap(this);
  }
  setLayer(t = void 0) {
    const e = this.getLayer("overlay").getLayers();
    if (e.clear(), t) {
      const i = new MA({
        source: t
      });
      Mt.applyWmtsZoomGate(i, t), e.push(i);
    }
  }
  setTransparency(t) {
    const e = (100 - t) / 100, i = this.getSource();
    i instanceof re || i instanceof ei ? (this.getLayers().item(0).setOpacity(1), this.getLayers().item(1).setOpacity(e)) : this.getLayers().item(0).setOpacity(e);
  }
  setGPSMarker(t, e) {
    this.getLayers().item(0).getSource().setGPSMarker(t, e);
  }
}
const ue = {
  /**
   * A true double click, with no dragging.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#dblclick
   * @api
   */
  DBLCLICK: Pt.DBLCLICK,
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
}, qn = {
  ACTIVE: "active"
};
class Be extends se {
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
      this.get(qn.ACTIVE)
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
    this.set(qn.ACTIVE, t);
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
function xC(A, t, e) {
  const i = A.getCenterInternal();
  if (i) {
    const n = [i[0] + t[0], i[1] + t[1]];
    A.animateInternal({
      duration: e !== void 0 ? e : 250,
      easing: oC,
      center: A.getConstrainedCenter(n)
    });
  }
}
function Mi(A, t, e, i) {
  const n = A.getZoom();
  if (n === void 0)
    return;
  const g = A.getConstrainedZoom(n + t), r = A.getResolutionForZoom(g);
  A.getAnimating() && A.cancelAnimations(), A.animate({
    resolution: r,
    anchor: e,
    duration: i !== void 0 ? i : 250,
    easing: fA
  });
}
const Je = {
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
}, _n = {
  LENGTH: "length"
};
class qe extends mt {
  /**
   * @param {import("./CollectionEventType.js").default} type Type.
   * @param {T} element Element.
   * @param {number} index The index of the added or removed element.
   */
  constructor(t, e, i) {
    super(t), this.element = e, this.index = i;
  }
}
class SC extends se {
  /**
   * @param {Array<T>} [array] Array.
   * @param {Options} [options] Collection options.
   */
  constructor(t, e) {
    if (super(), this.on, this.once, this.un, e = e || {}, this.unique_ = !!e.unique, this.array_ = t ?? [], this.unique_)
      for (let i = 1, n = this.array_.length; i < n; ++i)
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
    for (let e = 0, i = t.length; e < i; ++e)
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
    for (let i = 0, n = e.length; i < n; ++i)
      t(e[i], i, e);
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
    return this.get(_n.LENGTH);
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
      new qe(Je.ADD, e, t)
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
    for (let i = 0, n = e.length; i < n; ++i)
      if (e[i] === t)
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
    const e = this.array_[t];
    return this.array_.splice(t, 1), this.updateLength_(), this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new qe(Je.REMOVE, e, t)
    ), e;
  }
  /**
   * Set the element at the provided index.
   * @param {number} index Index.
   * @param {T} elem Element.
   * @api
   */
  setAt(t, e) {
    const i = this.getLength();
    if (t >= i) {
      this.insertAt(t, e);
      return;
    }
    if (t < 0)
      throw new Error("Index out of bounds: " + t);
    this.unique_ && this.assertUnique_(e, t);
    const n = this.array_[t];
    this.array_[t] = e, this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new qe(Je.REMOVE, n, t)
    ), this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new qe(Je.ADD, e, t)
    );
  }
  /**
   * @private
   */
  updateLength_() {
    this.set(_n.LENGTH, this.array_.length);
  }
  /**
   * @private
   * @param {T} elem Element.
   * @param {number} [except] Optional index to ignore.
   */
  assertUnique_(t, e) {
    const i = this.array_;
    for (let n = 0, g = i.length; n < g; ++n)
      if (i[n] === t && n !== e)
        throw new Error("Duplicate item added to a unique collection");
  }
}
class DC {
  /**
   * @param {number} decay Rate of decay (must be negative).
   * @param {number} minVelocity Minimum velocity (pixels/millisecond).
   * @param {number} delay Delay to consider to calculate the kinetic
   *     initial values (milliseconds).
   */
  constructor(t, e, i) {
    this.decay_ = t, this.minVelocity_ = e, this.delay_ = i, this.points_ = [], this.angle_ = 0, this.initialVelocity_ = 0;
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
    let i = e - 3;
    for (; i > 0 && this.points_[i + 2] > t; )
      i -= 3;
    const n = this.points_[e + 2] - this.points_[i + 2];
    if (n < 1e3 / 60)
      return !1;
    const g = this.points_[e] - this.points_[i], r = this.points_[e + 1] - this.points_[i + 1];
    return this.angle_ = Math.atan2(r, g), this.initialVelocity_ = Math.sqrt(g * g + r * r) / n, this.initialVelocity_ > this.minVelocity_;
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
class BC extends Be {
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
    if (t.type == ue.DBLCLICK) {
      const i = (
        /** @type {MouseEvent} */
        t.originalEvent
      ), n = t.map, g = t.coordinate, r = i.shiftKey ? -this.delta_ : this.delta_, s = n.getView();
      Mi(s, r, g, this.duration_), i.preventDefault(), e = !0;
    }
    return !e;
  }
}
const Zt = typeof navigator < "u" && typeof navigator.userAgent < "u" ? navigator.userAgent.toLowerCase() : "", TC = Zt.includes("safari") && !Zt.includes("chrom");
TC && (Zt.includes("version/15.4") || /cpu (os|iphone os) 15_4 like mac os x/.test(Zt));
const kC = Zt.includes("webkit") && !Zt.includes("edge"), ir = Zt.includes("macintosh");
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
function Ai(A) {
  const t = arguments;
  return function(e) {
    let i = !0;
    for (let n = 0, g = t.length; n < g && (i = i && t[n](e), !!i); ++n)
      ;
    return i;
  };
}
const GC = function(A) {
  const t = A.originalEvent;
  return t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, OC = function(A) {
  const t = A.originalEvent;
  return t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, LC = function(A) {
  const t = A.map.getTargetElement(), e = t.getRootNode(), i = A.map.getOwnerDocument().activeElement;
  return e instanceof ShadowRoot ? e.host.contains(i) : t.contains(i);
}, nr = function(A) {
  const t = A.map.getTargetElement(), e = t.getRootNode();
  return (e instanceof ShadowRoot ? e.host : t).hasAttribute("tabindex") ? LC(A) : !0;
}, ZC = Oo, gr = function(A) {
  const t = A.originalEvent;
  return "pointerId" in t && t.button == 0 && !(kC && ir && t.ctrlKey);
}, rr = function(A) {
  const t = (
    /** @type {KeyboardEvent|MouseEvent|TouchEvent} */
    A.originalEvent
  );
  return !t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, XC = function(A) {
  const t = A.originalEvent;
  return ir ? t.metaKey : t.ctrlKey;
}, sr = function(A) {
  const t = A.originalEvent;
  return !t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, or = function(A) {
  const t = A.originalEvent, e = (
    /** @type {Element} */
    t.target.tagName
  );
  return e !== "INPUT" && e !== "SELECT" && e !== "TEXTAREA" && // `isContentEditable` is only available on `HTMLElement`, but it may also be a
  // different type like `SVGElement`.
  // @ts-ignore
  !t.target.isContentEditable;
}, Ae = function(A) {
  const t = A.originalEvent;
  return "pointerId" in t && t.pointerType == "mouse";
}, jC = function(A) {
  const t = A.originalEvent;
  return "pointerId" in t && t.isPrimary && t.button === 0;
};
class oe extends Be {
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
      if (t.type == ue.POINTERDRAG)
        this.handleDragEvent(t), t.originalEvent.preventDefault();
      else if (t.type == ue.POINTERUP) {
        const i = this.handleUpEvent(t);
        this.handlingDownUpSequence = i && this.targetPointers.length > 0;
      }
    } else if (t.type == ue.POINTERDOWN) {
      const i = this.handleDownEvent(t);
      this.handlingDownUpSequence = i, e = this.stopDown(i);
    } else t.type == ue.POINTERMOVE && this.handleMoveEvent(t);
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
function Ei(A) {
  const t = A.length;
  let e = 0, i = 0;
  for (let n = 0; n < t; n++)
    e += A[n].clientX, i += A[n].clientY;
  return { clientX: e / t, clientY: i / t };
}
class NC extends oe {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super({
      stopDown: CA
    }), t = t || {}, this.kinetic_ = t.kinetic, this.lastCentroid = null, this.lastPointersCount_, this.panning_ = !1;
    const e = t.condition ? t.condition : Ai(rr, jC);
    this.condition_ = t.onFocusOnly ? Ai(nr, e) : e, this.noKinetic_ = !1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    const e = t.map;
    this.panning_ || (this.panning_ = !0, e.getView().beginInteraction());
    const i = this.targetPointers, n = e.getEventPixel(Ei(i));
    if (i.length == this.lastPointersCount_) {
      if (this.kinetic_ && this.kinetic_.update(n[0], n[1]), this.lastCentroid) {
        const g = [
          this.lastCentroid[0] - n[0],
          n[1] - this.lastCentroid[1]
        ], s = t.map.getView();
        iI(g, s.getResolution()), ai(g, s.getRotation()), s.adjustCenterInternal(g);
      }
    } else this.kinetic_ && this.kinetic_.begin();
    this.lastCentroid = n, this.lastPointersCount_ = i.length, t.originalEvent.preventDefault();
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    const e = t.map, i = e.getView();
    if (this.targetPointers.length === 0) {
      if (!this.noKinetic_ && this.kinetic_ && this.kinetic_.end()) {
        const n = this.kinetic_.getDistance(), g = this.kinetic_.getAngle(), r = i.getCenterInternal(), s = e.getPixelFromCoordinateInternal(r), o = e.getCoordinateFromPixelInternal([
          s[0] - n * Math.cos(g),
          s[1] - n * Math.sin(g)
        ]);
        i.animateInternal({
          center: i.getConstrainedCenter(o),
          duration: 500,
          easing: fA
        });
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
class zC extends oe {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super({
      stopDown: CA
    }), this.condition_ = t.condition ? t.condition : OC, this.lastAngle_ = void 0, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    if (!Ae(t))
      return;
    const e = t.map, i = e.getView();
    if (i.getConstraints().rotation === vi)
      return;
    const n = e.getSize(), g = t.pixel, r = Math.atan2(n[1] / 2 - g[1], g[0] - n[0] / 2);
    if (this.lastAngle_ !== void 0) {
      const s = r - this.lastAngle_;
      i.adjustRotationInternal(-s);
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
    return Ae(t) ? (t.map.getView().endInteraction(this.duration_), !1) : !0;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    return Ae(t) && gr(t) && this.condition_(t) ? (t.map.getView().beginInteraction(), this.lastAngle_ = void 0, !0) : !1;
  }
}
class FC extends xg {
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
    const t = this.startPixel_, e = this.endPixel_, i = "px", n = this.element_.style;
    n.left = Math.min(t[0], e[0]) + i, n.top = Math.min(t[1], e[1]) + i, n.width = Math.abs(e[0] - t[0]) + i, n.height = Math.abs(e[1] - t[1]) + i;
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
    const t = this.startPixel_, e = this.endPixel_, n = [
      t,
      [t[0], e[1]],
      e,
      [e[0], t[1]]
    ].map(
      this.map_.getCoordinateFromPixelInternal,
      this.map_
    );
    n[4] = n[0].slice(), this.geometry_ ? this.geometry_.setCoordinates([n]) : this.geometry_ = new Lt([n]);
  }
  /**
   * @return {import("../geom/Polygon.js").default} Geometry.
   */
  getGeometry() {
    return this.geometry_;
  }
}
const Ht = {
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
class le extends mt {
  /**
   * @param {string} type The event type.
   * @param {import("../coordinate.js").Coordinate} coordinate The event coordinate.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Originating event.
   */
  constructor(t, e, i) {
    super(t), this.coordinate = e, this.mapBrowserEvent = i;
  }
}
class UC extends oe {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = t ?? {}, this.box_ = new FC(t.className || "ol-dragbox"), this.minArea_ = t.minArea ?? 64, t.onBoxEnd && (this.onBoxEnd = t.onBoxEnd), this.startPixel_ = null, this.condition_ = t.condition ?? gr, this.boxEndCondition_ = t.boxEndCondition ?? this.defaultBoxEndCondition;
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
  defaultBoxEndCondition(t, e, i) {
    const n = i[0] - e[0], g = i[1] - e[1];
    return n * n + g * g >= this.minArea_;
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
      new le(
        Ht.BOXDRAG,
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
      new le(
        e ? Ht.BOXEND : Ht.BOXCANCEL,
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
      new le(
        Ht.BOXSTART,
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
      new le(Ht.BOXCANCEL, this.startPixel_, null)
    ), this.startPixel_ = null)), super.setActive(t);
  }
  /**
   * @param {import("../Map.js").default|null} map Map.
   * @override
   */
  setMap(t) {
    this.getMap() && (this.box_.setMap(null), this.startPixel_ && (this.dispatchEvent(
      new le(Ht.BOXCANCEL, this.startPixel_, null)
    ), this.startPixel_ = null)), super.setMap(t);
  }
}
class WC extends UC {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = t.condition ? t.condition : sr;
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
    const i = (
      /** @type {!import("../View.js").default} */
      this.getMap().getView()
    );
    let n = this.getGeometry();
    if (this.out_) {
      const g = i.rotatedExtentForGeometry(n), r = i.getResolutionForExtentInternal(g), s = i.getResolution() / r;
      n = n.clone(), n.scale(s * s);
    }
    i.fitInternal(n, {
      duration: this.duration_,
      easing: fA
    });
  }
}
const Bt = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown"
};
class QC extends Be {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.defaultCondition_ = function(e) {
      return rr(e) && or(e);
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
    if (t.type == Pt.KEYDOWN) {
      const i = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), n = i.key;
      if (this.condition_(t) && (n == Bt.DOWN || n == Bt.LEFT || n == Bt.RIGHT || n == Bt.UP)) {
        const r = t.map.getView(), s = r.getResolution() * this.pixelDelta_;
        let o = 0, I = 0;
        n == Bt.DOWN ? I = -s : n == Bt.LEFT ? o = -s : n == Bt.RIGHT ? o = s : I = s;
        const C = [o, I];
        ai(C, r.getRotation()), xC(r, C, this.duration_), i.preventDefault(), e = !0;
      }
    }
    return !e;
  }
}
class VC extends Be {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.condition_ = t.condition ? t.condition : function(e) {
      return !XC(e) && or(e);
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
    if (t.type == Pt.KEYDOWN || t.type == Pt.KEYPRESS) {
      const i = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), n = i.key;
      if (this.condition_(t) && (n === "+" || n === "-")) {
        const g = t.map, r = n === "+" ? this.delta_ : -this.delta_, s = g.getView();
        Mi(s, r, void 0, this.duration_), i.preventDefault(), e = !0;
      }
    }
    return !e;
  }
}
const HC = 40, YC = 300, KC = 3;
class JC extends Be {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Interaction.js").InteractionOptions} */
      t
    ), this.totalDelta_ = 0, this.lastDelta_ = 0, this.maxDelta_ = t.maxDelta !== void 0 ? t.maxDelta : 1, this.duration_ = t.duration !== void 0 ? t.duration : 250, this.timeout_ = t.timeout !== void 0 ? t.timeout : 80, this.useAnchor_ = t.useAnchor !== void 0 ? t.useAnchor : !0, this.constrainResolution_ = t.constrainResolution !== void 0 ? t.constrainResolution : !1;
    const e = t.condition ? t.condition : ZC;
    this.condition_ = t.onFocusOnly ? Ai(nr, e) : e, this.lastAnchor_ = null, this.startTime_ = void 0, this.timeoutId_, this.mode_ = void 0, this.trackpadEventGap_ = 400, this.trackpadTimeoutId_, this.deltaPerZoom_ = 300, this.ctrlKeyPressed_ = !1, this.ctrlKeyListenerKeys_ = [];
  }
  /**
   * @param {import('../Map.js').default|null} map Map.
   * @override
   */
  setMap(t) {
    if (this.ctrlKeyListenerKeys_.forEach(_t), this.ctrlKeyListenerKeys_.length = 0, this.ctrlKeyPressed_ = !1, super.setMap(t), t) {
      const e = t.getOwnerDocument();
      this.ctrlKeyListenerKeys_.push(
        Rt(e, "keydown", (i) => {
          i.key === "Control" && (this.ctrlKeyPressed_ = !0);
        }),
        Rt(e, "keyup", (i) => {
          i.key === "Control" && (this.ctrlKeyPressed_ = !1);
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
    const e = t.getView(), i = this.lastDelta_ ? this.lastDelta_ > 0 ? 1 : -1 : 0;
    e.endInteraction(
      this.constrainResolution_ || e.getConstrainResolution() ? 100 : void 0,
      i,
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
    if (!this.condition_(t) || t.type !== Pt.WHEEL)
      return !0;
    const i = t.map, n = (
      /** @type {WheelEvent} */
      t.originalEvent
    );
    n.preventDefault();
    const g = n.ctrlKey && !this.ctrlKeyPressed_;
    n.ctrlKey || (this.ctrlKeyPressed_ = !1), this.useAnchor_ && (this.lastAnchor_ = t.pixel);
    let r = n.deltaY;
    switch (n.deltaMode) {
      case WheelEvent.DOM_DELTA_LINE:
        r *= HC;
        break;
      case WheelEvent.DOM_DELTA_PAGE:
        r *= YC;
        break;
    }
    if (r === 0)
      return !1;
    this.lastDelta_ = r;
    const s = Date.now();
    this.startTime_ === void 0 && (this.startTime_ = s), (!this.mode_ || s - this.startTime_ > this.trackpadEventGap_) && (this.mode_ = Math.abs(r) < 4 ? "trackpad" : "wheel");
    const o = i.getView();
    if (this.mode_ === "trackpad")
      return this.trackpadTimeoutId_ ? clearTimeout(this.trackpadTimeoutId_) : (o.getAnimating() && o.cancelAnimations(), o.beginInteraction()), this.trackpadTimeoutId_ = setTimeout(
        this.endInteraction_.bind(this),
        this.timeout_
      ), g && (r = r * KC), o.adjustZoom(
        -r / this.deltaPerZoom_,
        this.lastAnchor_ ? i.getCoordinateFromPixel(this.lastAnchor_) : null
      ), this.startTime_ = s, !1;
    this.totalDelta_ += r;
    const I = Math.max(this.timeout_ - (s - this.startTime_), 0);
    return clearTimeout(this.timeoutId_), this.timeoutId_ = setTimeout(
      this.handleWheelZoom_.bind(this, i),
      I
    ), !1;
  }
  /**
   * @private
   * @param {import("../Map.js").default} map Map.
   */
  handleWheelZoom_(t) {
    const e = t.getView();
    e.getAnimating() && e.cancelAnimations();
    let i = -st(
      this.totalDelta_,
      -this.maxDelta_ * this.deltaPerZoom_,
      this.maxDelta_ * this.deltaPerZoom_
    ) / this.deltaPerZoom_;
    (e.getConstrainResolution() || this.constrainResolution_) && (i = i ? i > 0 ? 1 : -1 : 0), Mi(
      e,
      i,
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
class qC extends oe {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = CA), super(e), this.anchor_ = null, this.lastAngle_ = void 0, this.rotating_ = !1, this.rotationDelta_ = 0, this.threshold_ = t.threshold !== void 0 ? t.threshold : 0.3, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    let e = 0;
    const i = this.targetPointers[0], n = this.targetPointers[1], g = Math.atan2(
      n.clientY - i.clientY,
      n.clientX - i.clientX
    );
    if (this.lastAngle_ !== void 0) {
      const o = g - this.lastAngle_;
      this.rotationDelta_ += o, !this.rotating_ && Math.abs(this.rotationDelta_) > this.threshold_ && (this.rotating_ = !0), e = o;
    }
    this.lastAngle_ = g;
    const r = t.map, s = r.getView();
    s.getConstraints().rotation !== vi && (this.anchor_ = r.getCoordinateFromPixelInternal(
      r.getEventPixel(Ei(this.targetPointers))
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
class _C extends oe {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = CA), super(e), this.anchor_ = null, this.duration_ = t.duration !== void 0 ? t.duration : 400, this.lastDistance_ = void 0, this.lastScaleDelta_ = 1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    let e = 1;
    const i = this.targetPointers[0], n = this.targetPointers[1], g = i.clientX - n.clientX, r = i.clientY - n.clientY, s = Math.sqrt(g * g + r * r);
    this.lastDistance_ !== void 0 && (e = this.lastDistance_ / s), this.lastDistance_ = s;
    const o = t.map, I = o.getView();
    e != 1 && (this.lastScaleDelta_ = e), this.anchor_ = o.getCoordinateFromPixelInternal(
      o.getEventPixel(Ei(this.targetPointers))
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
      const i = t.map.getView(), n = this.lastScaleDelta_ > 1 ? 1 : -1;
      return i.endInteraction(this.duration_, n), !1;
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
function $n(A) {
  A = A || {};
  const t = new SC(), e = new DC(-5e-3, 0.05, 100);
  return (A.altShiftDragRotate === void 0 || A.altShiftDragRotate) && t.push(new zC()), (A.doubleClickZoom === void 0 || A.doubleClickZoom) && t.push(
    new BC({
      delta: A.zoomDelta,
      duration: A.zoomDuration
    })
  ), (A.dragPan === void 0 || A.dragPan) && t.push(
    new NC({
      onFocusOnly: A.onFocusOnly,
      kinetic: e
    })
  ), (A.pinchRotate === void 0 || A.pinchRotate) && t.push(new qC()), (A.pinchZoom === void 0 || A.pinchZoom) && t.push(
    new _C({
      duration: A.zoomDuration
    })
  ), (A.keyboard === void 0 || A.keyboard) && (t.push(new QC()), t.push(
    new VC({
      delta: A.zoomDelta,
      duration: A.zoomDuration
    })
  )), (A.mouseWheelZoom === void 0 || A.mouseWheelZoom) && t.push(
    new JC({
      onFocusOnly: A.onFocusOnly,
      duration: A.zoomDuration
    })
  ), (A.shiftDragZoom === void 0 || A.shiftDragZoom) && t.push(
    new WC({
      duration: A.zoomDuration
    })
  ), t;
}
class $C extends oe {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Pointer.js").Options} */
      t
    ), this.condition_ = t.condition ? t.condition : sr, this.lastAngle_ = void 0, this.lastMagnitude_ = void 0, this.lastScaleDelta_ = 0, this.duration_ = t.duration !== void 0 ? t.duration : 400;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    if (!Ae(t))
      return;
    const e = t.map, i = e.getSize(), n = t.pixel, g = n[0] - i[0] / 2, r = i[1] / 2 - n[1], s = Math.atan2(r, g), o = Math.sqrt(g * g + r * r), I = e.getView();
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
    if (!Ae(t))
      return !0;
    const i = t.map.getView(), n = this.lastScaleDelta_ > 1 ? 1 : -1;
    return i.endInteraction(this.duration_, n), this.lastScaleDelta_ = 0, !1;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    return Ae(t) && this.condition_(t) ? (t.map.getView().beginInteraction(), this.lastAngle_ = void 0, this.lastMagnitude_ = void 0, !0) : !1;
  }
}
function ta(A) {
  return ea(A[0], A[1], A[2]);
}
function ea(A, t, e) {
  return (t << A) + e;
}
const Aa = /\{z\}/g, ia = /\{x\}/g, na = /\{y\}/g, ga = /\{-y\}/g;
function ra(A, t, e, i, n) {
  return A.replace(Aa, t.toString()).replace(ia, e.toString()).replace(na, i.toString()).replace(ga, function() {
    throw new Error(
      "If the URL template has a {-y} placeholder, the grid extent must be known"
    );
  });
}
function sa(A, t) {
  return (
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile Coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @return {string|undefined} Tile URL.
     */
    (function(e, i, n) {
      if (!e)
        return;
      const g = e[0];
      return ra(A, g, e[1], e[2]);
    })
  );
}
function tg(A, t) {
  const e = A.length, i = new Array(e);
  for (let n = 0; n < e; ++n)
    i[n] = sa(A[n]);
  return oa(i);
}
function oa(A) {
  return A.length === 1 ? A[0] : (
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile Coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @return {string|undefined} Tile URL.
     */
    (function(t, e, i) {
      if (!t)
        return;
      const n = ta(t), g = JA(n, A.length);
      return A[g](t, e, i);
    })
  );
}
for (let A = 0; A < 9; A++) {
  const t = `ZOOM:${A}`, e = 256 * Math.pow(2, A);
  (function(i, n) {
    const g = new vs({
      code: i,
      // The extent is used to determine zoom level 0. Recommended values for a
      // projection's validity extent can be found at https://epsg.io/.
      extent: [0, 0, n, n],
      units: "m"
    });
    NA(g), $e(
      "EPSG:3857",
      g,
      (r) => {
        const s = (r[0] + O) * n / (2 * O), o = (-r[1] + O) * n / (2 * O);
        return [s, o];
      },
      (r) => {
        const s = r[0] * (2 * O) / n - O, o = -1 * (r[1] * (2 * O) / n - O);
        return [s, o];
      }
    );
  })(t, e);
}
class Ir extends Do(Ig) {
  constructor(t = {}) {
    t = Pg(t), t.wrapX = !1;
    const e = Math.log2(t.width / Tt), i = Math.log2(t.height / Tt);
    t.maxZoom = Math.ceil(Math.max(e, i)), t.tileUrlFunction = t.tileUrlFunction || function(n) {
      const g = n[0], r = n[1], s = n[2];
      return (
        // @ts-ignore
        r * Tt * Math.pow(2, this.maxZoom - g) >= this.width || // @ts-ignore
        s * Tt * Math.pow(2, this.maxZoom - g) >= this.height || r < 0 || s < 0 ? dg : this._tileUrlFunction(n)
      );
    }, super(t), t.mapID && (this.mapID = t.mapID), t.urls ? this._tileUrlFunction = tg(t.urls) : t.url && (this._tileUrlFunction = tg(Array.isArray(t.url) ? t.url : [t.url])), this.width = t.width, this.height = t.height, this.maxZoom = t.maxZoom, this._maxxy = Math.pow(2, this.maxZoom) * Tt, this.initialize(t);
  }
}
class sA extends re {
  static isBasemap_ = !1;
  constructor(t = {}) {
    super(Object.assign(t, { opaque: !1 }));
  }
}
const ht = "https://weiwudi.example.com/api/";
let GA, Yt;
class Ia {
  constructor() {
    this.listeners = {};
  }
  addEventListener(t, e) {
    t in this.listeners || (this.listeners[t] = []), this.listeners[t].push(e);
  }
  removeEventListener(t, e) {
    if (!(t in this.listeners))
      return;
    const i = this.listeners[t];
    for (let n = 0, g = i.length; n < g; n++)
      if (i[n] === e) {
        i.splice(n, 1);
        return;
      }
  }
  dispatchEvent(t) {
    if (!(t.type in this.listeners))
      return !0;
    const e = this.listeners[t.type].slice();
    for (let i = 0, n = e.length; i < n; i++)
      e[i].call(this, t);
    return !t.defaultPrevented;
  }
}
class ut extends Ia {
  static async registerSW(t, e) {
    if ("serviceWorker" in navigator)
      try {
        const i = await navigator.serviceWorker.register(t, e), n = i.installing, g = i.waiting;
        return n && (n.state === "activated" && !g && window.location.reload(), n.addEventListener("statechange", (r) => {
          n.state === "activated" && !g && window.location.reload();
        })), i.onupdatefound = () => {
          i.update();
        }, await ut.swCheck(), i;
      } catch (i) {
        throw `Error: Service worker registration failed with ${i}`;
      }
    else
      throw "Error: Service worker is not supported";
  }
  static async swCheck() {
    return Yt !== void 0 ? Yt : (GA === void 0 && (GA = new Promise((t, e) => {
      fetch(`${ht}ping`).then((i) => {
        Yt = !!i, t(Yt);
      }).catch((i) => {
        Yt = !1, t(Yt);
      });
    })), GA);
  }
  static async registerMap(t, e) {
    if (!await ut.swCheck()) throw "Weiwudi service worker is not implemented.";
    let i;
    const n = ["type", "url", "width", "height", "tileSize", "minZoom", "maxZoom", "maxLng", "maxLat", "minLng", "minLat", "cacheTtl"].reduce((r, s) => (typeof e[s] < "u" && (e[s] instanceof Array ? e[s].map((o) => {
      r.append(s, o);
    }) : r.append(s, String(e[s]))), r), new URLSearchParams());
    n.append("mapID", t);
    const g = new URL(`${ht}add`);
    if (g.search = n.toString(), i = await (await fetch(g.href)).text(), i.match(/^Error: /))
      throw i;
    return new ut(t, JSON.parse(i));
  }
  static async retrieveMap(t) {
    if (!await ut.swCheck()) throw "Weiwudi service worker is not implemented.";
    let e;
    if (e = await (await fetch(`${ht}info?mapID=${t}`)).text(), e.match(/^Error: /))
      throw e;
    return console.log(e), new ut(t, JSON.parse(e));
  }
  static async removeMap(t) {
    if (!await ut.swCheck()) throw "Weiwudi service worker is not implemented.";
    let e;
    if (e = await (await fetch(`${ht}delete?mapID=${t}`)).text(), e.match(/^Error: /))
      throw e;
  }
  constructor(t, e) {
    if (super(), !t) throw "MapID is necessary.";
    this.mapID = t, e && Object.assign(this, e), this.url = `${ht}cache/${t}/{z}/{x}/{y}`, this.listener = (i) => {
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
    if (this.checkAspect(), t = await (await fetch(`${ht}stats?mapID=${this.mapID}`)).text(), typeof t == "string" && t.match(/^Error: /))
      throw t;
    return JSON.parse(t);
  }
  async clean() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${ht}clean?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
  async fetchAll() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${ht}fetchAll?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
  async remove() {
    this.checkAspect(), this.mapID && await ut.removeMap(this.mapID), this.release();
  }
  async cancel() {
    let t;
    if (this.checkAspect(), t = await (await fetch(`${ht}cancel?mapID=${this.mapID}`)).text(), t.match(/^Error: /))
      throw t;
  }
}
function _e(A, t, e) {
  const i = typeof A == "string" ? A : A.getCode(), n = typeof t == "string" ? t : t.getCode();
  let g = vA(A, t);
  if (g == bA && i != n) {
    const r = vA(A, "EPSG:3857"), s = vA("EPSG:3857", t);
    if (r == bA && i != "EPSG:3857")
      throw "Transform of Source projection is not defined.";
    if (s == bA && n != "EPSG:3857")
      throw "Transform of Distination projection is not defined.";
    g = function(I) {
      return et(et(I, A, "EPSG:3857"), "EPSG:3857", t);
    }, $e(A, t, g, function(I) {
      return et(et(I, t, "EPSG:3857"), "EPSG:3857", A);
    });
  }
  if (e)
    return g(e);
}
const Ca = [
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
async function aa(A) {
  const t = A;
  if (Ca.forEach((g) => {
    t[g] = A[g];
  }), (A.imageExtention || A.imageExtension) && (t.imageExtension = A.imageExtension || A.imageExtention), !A.compiled)
    throw new Error(
      "@maplat/transform requires pre-compiled data. Cannot create MapTransform from GCPs."
    );
  const e = { compiled: A.compiled };
  A.sub_maps?.length && (e.sub_maps = A.sub_maps.filter((g) => g.compiled).map((g) => ({
    compiled: g.compiled,
    priority: g.priority,
    importance: g.importance,
    bounds: g.bounds
  })));
  const i = new fg();
  i.setMapData(e);
  const n = i.getLayerTransform(0);
  if (t.strictMode = n.strictMode, t.vertexMode = n.vertexMode, t.yaxisMode = n.yaxisMode, t.width = n.wh?.[0], t.height = n.wh?.[1], t.gcps = n.points, t.edges = n.edges, A.sub_maps) {
    const g = A.sub_maps.map((r, s) => {
      const o = {
        importance: r.importance,
        priority: r.priority
      };
      if (r.compiled) {
        const I = i.getLayerTransform(s + 1);
        o.bounds = I?.bounds ?? r.bounds, o.gcps = I?.points, o.edges = I?.edges;
      } else
        o.bounds = r.bounds, o.gcps = r.gcps, o.edges = r.edges;
      return o;
    });
    t.sub_maps = g;
  }
  return [t, i];
}
class oA extends Ir {
  mapTransform;
  constructor(t = {}) {
    super(t), this.mapTransform = new fg();
  }
  static async createAsync(t) {
    const [e, i] = await aa(t);
    t = e;
    const n = new oA(t);
    n.mapTransform = i;
    const g = i.getLayerTransform(0), r = new ve({
      code: `Illst:${n.mapID}`,
      extent: [0, 0, n.width, n.height],
      units: "m"
    });
    return NA(r), $e(
      r,
      "EPSG:3857",
      (s) => g.transform(s, !1),
      (s) => g.transform(s, !0)
    ), _e("EPSG:4326", r), t.sub_maps && t.sub_maps.forEach((s, o) => {
      const I = o + 1, C = `Illst:${n.mapID}#${I}`, a = i.getLayerTransform(I);
      if (!a) return;
      const c = new ve({
        code: C,
        extent: [a.xy[0], a.xy[1], a.wh[0], a.wh[1]],
        units: "m"
      });
      NA(c), $e(
        c,
        "EPSG:3857",
        (l) => a.transform(l, !1, !0),
        (l) => a.transform(l, !0, !0)
      ), _e("EPSG:4326", c);
    }), n;
  }
  xy2MercAsync_specifyLayer(t, e) {
    const i = `Illst:${this.mapID}${e ? `#${e}` : ""}`;
    return new Promise((n, g) => {
      n(_e(i, "EPSG:3857", t));
    });
  }
  merc2XyAsync_specifyLayer(t, e) {
    const i = `Illst:${this.mapID}${e ? `#${e}` : ""}`;
    return new Promise((n, g) => {
      n(_e("EPSG:3857", i, t));
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
        (i) => i ? [i[0], i[1]] : void 0
      )
    );
  }
  setupMapParameter(t) {
    const e = [this.width / 2, this.height / 2], i = this.mapTransform.xy2MercWithLayer(e);
    if (!i) return;
    const [n, g] = i, r = this.mapTransform.getLayerTransform(n), s = this.mapTransform.getLayerTransform(0);
    if (!r) return;
    const o = [
      [e[0] - 150, e[1]],
      [e[0] + 150, e[1]],
      [e[0], e[1] - 150],
      [e[0], e[1] + 150]
    ], I = [
      [0, 0],
      [this.width, 0],
      [this.width, this.height],
      [0, this.height]
    ], C = o.map((h) => r.transform(h, !1)), a = I.map(
      (h) => s.transform(h, !1)
    ), c = Math.sqrt(
      Math.pow(C[0][0] - C[1][0], 2) + Math.pow(C[0][1] - C[1][1], 2)
    ), l = Math.sqrt(
      Math.pow(C[2][0] - C[3][0], 2) + Math.pow(C[2][1] - C[3][1], 2)
    ), d = (c + l) / 2;
    this.mercZoom || (this.mercZoom = Math.log(300 * (2 * O) / 256 / d) / Math.log(2) - 3), this.homePosition || (this.homePosition = ni(g)), this.envelope = wg([
      [
        a[0],
        a[1],
        a[2],
        a[3],
        a[0]
      ]
    ]), t(this);
  }
  mercs2SysCoordsAsync_multiLayer(t) {
    const e = this.mapTransform.mercs2SysCoords(t[0]);
    return Promise.resolve(
      e.map((i) => {
        if (i)
          return [i.map((n) => n), t[1]];
      })
    );
  }
  merc2XyAsync_base(t, e) {
    return this.merc2XyAsync_returnLayer(t).then((i) => e && !i[0] ? void 0 : (i[0] ? i[0] : i[1])[1]);
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
    const i = t?.[0] ?? this.getMap().getView().getCenter(), n = t?.[1] ?? this.getMap().getView().getDecimalZoom(), g = t?.[2] ?? this.getMap().getView().getRotation();
    e || (e = this.getMap().getSize());
    const r = this.mapTransform.viewpoint2Mercs(
      { center: i, zoom: n, rotation: g },
      e
    );
    return Promise.resolve([r, e]);
  }
  mercs2ViewpointAsync(t) {
    const e = t[1] ?? this.getMap().getSize(), i = this.mapTransform.mercs2Viewpoint(
      t[0],
      e
    );
    return Promise.resolve([
      i.center,
      i.zoom,
      i.rotation
    ]);
  }
}
var W = typeof globalThis < "u" && globalThis || typeof self < "u" && self || // eslint-disable-next-line no-undef
typeof globalThis < "u" && globalThis || {}, _ = {
  searchParams: "URLSearchParams" in W,
  iterable: "Symbol" in W && "iterator" in Symbol,
  blob: "FileReader" in W && "Blob" in W && (function() {
    try {
      return new Blob(), !0;
    } catch {
      return !1;
    }
  })(),
  formData: "FormData" in W,
  arrayBuffer: "ArrayBuffer" in W
};
function ca(A) {
  return A && DataView.prototype.isPrototypeOf(A);
}
if (_.arrayBuffer)
  var la = [
    "[object Int8Array]",
    "[object Uint8Array]",
    "[object Uint8ClampedArray]",
    "[object Int16Array]",
    "[object Uint16Array]",
    "[object Int32Array]",
    "[object Uint32Array]",
    "[object Float32Array]",
    "[object Float64Array]"
  ], ha = ArrayBuffer.isView || function(A) {
    return A && la.indexOf(Object.prototype.toString.call(A)) > -1;
  };
function Ie(A) {
  if (typeof A != "string" && (A = String(A)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(A) || A === "")
    throw new TypeError('Invalid character in header field name: "' + A + '"');
  return A.toLowerCase();
}
function Ri(A) {
  return typeof A != "string" && (A = String(A)), A;
}
function Pi(A) {
  var t = {
    next: function() {
      var e = A.shift();
      return { done: e === void 0, value: e };
    }
  };
  return _.iterable && (t[Symbol.iterator] = function() {
    return t;
  }), t;
}
function z(A) {
  this.map = {}, A instanceof z ? A.forEach(function(t, e) {
    this.append(e, t);
  }, this) : Array.isArray(A) ? A.forEach(function(t) {
    if (t.length != 2)
      throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + t.length);
    this.append(t[0], t[1]);
  }, this) : A && Object.getOwnPropertyNames(A).forEach(function(t) {
    this.append(t, A[t]);
  }, this);
}
z.prototype.append = function(A, t) {
  A = Ie(A), t = Ri(t);
  var e = this.map[A];
  this.map[A] = e ? e + ", " + t : t;
};
z.prototype.delete = function(A) {
  delete this.map[Ie(A)];
};
z.prototype.get = function(A) {
  return A = Ie(A), this.has(A) ? this.map[A] : null;
};
z.prototype.has = function(A) {
  return this.map.hasOwnProperty(Ie(A));
};
z.prototype.set = function(A, t) {
  this.map[Ie(A)] = Ri(t);
};
z.prototype.forEach = function(A, t) {
  for (var e in this.map)
    this.map.hasOwnProperty(e) && A.call(t, this.map[e], e, this);
};
z.prototype.keys = function() {
  var A = [];
  return this.forEach(function(t, e) {
    A.push(e);
  }), Pi(A);
};
z.prototype.values = function() {
  var A = [];
  return this.forEach(function(t) {
    A.push(t);
  }), Pi(A);
};
z.prototype.entries = function() {
  var A = [];
  return this.forEach(function(t, e) {
    A.push([e, t]);
  }), Pi(A);
};
_.iterable && (z.prototype[Symbol.iterator] = z.prototype.entries);
function OA(A) {
  if (!A._noBody) {
    if (A.bodyUsed)
      return Promise.reject(new TypeError("Already read"));
    A.bodyUsed = !0;
  }
}
function Cr(A) {
  return new Promise(function(t, e) {
    A.onload = function() {
      t(A.result);
    }, A.onerror = function() {
      e(A.error);
    };
  });
}
function ua(A) {
  var t = new FileReader(), e = Cr(t);
  return t.readAsArrayBuffer(A), e;
}
function fa(A) {
  var t = new FileReader(), e = Cr(t), i = /charset=([A-Za-z0-9_-]+)/.exec(A.type), n = i ? i[1] : "utf-8";
  return t.readAsText(A, n), e;
}
function da(A) {
  for (var t = new Uint8Array(A), e = new Array(t.length), i = 0; i < t.length; i++)
    e[i] = String.fromCharCode(t[i]);
  return e.join("");
}
function eg(A) {
  if (A.slice)
    return A.slice(0);
  var t = new Uint8Array(A.byteLength);
  return t.set(new Uint8Array(A)), t.buffer;
}
function ar() {
  return this.bodyUsed = !1, this._initBody = function(A) {
    this.bodyUsed = this.bodyUsed, this._bodyInit = A, A ? typeof A == "string" ? this._bodyText = A : _.blob && Blob.prototype.isPrototypeOf(A) ? this._bodyBlob = A : _.formData && FormData.prototype.isPrototypeOf(A) ? this._bodyFormData = A : _.searchParams && URLSearchParams.prototype.isPrototypeOf(A) ? this._bodyText = A.toString() : _.arrayBuffer && _.blob && ca(A) ? (this._bodyArrayBuffer = eg(A.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : _.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(A) || ha(A)) ? this._bodyArrayBuffer = eg(A) : this._bodyText = A = Object.prototype.toString.call(A) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof A == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : _.searchParams && URLSearchParams.prototype.isPrototypeOf(A) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
  }, _.blob && (this.blob = function() {
    var A = OA(this);
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
      var A = OA(this);
      return A || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
        this._bodyArrayBuffer.buffer.slice(
          this._bodyArrayBuffer.byteOffset,
          this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
        )
      ) : Promise.resolve(this._bodyArrayBuffer));
    } else {
      if (_.blob)
        return this.blob().then(ua);
      throw new Error("could not read as ArrayBuffer");
    }
  }, this.text = function() {
    var A = OA(this);
    if (A)
      return A;
    if (this._bodyBlob)
      return fa(this._bodyBlob);
    if (this._bodyArrayBuffer)
      return Promise.resolve(da(this._bodyArrayBuffer));
    if (this._bodyFormData)
      throw new Error("could not read FormData body as text");
    return Promise.resolve(this._bodyText);
  }, _.formData && (this.formData = function() {
    return this.text().then(ya);
  }), this.json = function() {
    return this.text().then(JSON.parse);
  }, this;
}
var ma = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
function pa(A) {
  var t = A.toUpperCase();
  return ma.indexOf(t) > -1 ? t : A;
}
function Xt(A, t) {
  if (!(this instanceof Xt))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  t = t || {};
  var e = t.body;
  if (A instanceof Xt) {
    if (A.bodyUsed)
      throw new TypeError("Already read");
    this.url = A.url, this.credentials = A.credentials, t.headers || (this.headers = new z(A.headers)), this.method = A.method, this.mode = A.mode, this.signal = A.signal, !e && A._bodyInit != null && (e = A._bodyInit, A.bodyUsed = !0);
  } else
    this.url = String(A);
  if (this.credentials = t.credentials || this.credentials || "same-origin", (t.headers || !this.headers) && (this.headers = new z(t.headers)), this.method = pa(t.method || this.method || "GET"), this.mode = t.mode || this.mode || null, this.signal = t.signal || this.signal || (function() {
    if ("AbortController" in W) {
      var g = new AbortController();
      return g.signal;
    }
  })(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && e)
    throw new TypeError("Body not allowed for GET or HEAD requests");
  if (this._initBody(e), (this.method === "GET" || this.method === "HEAD") && (t.cache === "no-store" || t.cache === "no-cache")) {
    var i = /([?&])_=[^&]*/;
    if (i.test(this.url))
      this.url = this.url.replace(i, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
    else {
      var n = /\?/;
      this.url += (n.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
    }
  }
}
Xt.prototype.clone = function() {
  return new Xt(this, { body: this._bodyInit });
};
function ya(A) {
  var t = new FormData();
  return A.trim().split("&").forEach(function(e) {
    if (e) {
      var i = e.split("="), n = i.shift().replace(/\+/g, " "), g = i.join("=").replace(/\+/g, " ");
      t.append(decodeURIComponent(n), decodeURIComponent(g));
    }
  }), t;
}
function wa(A) {
  var t = new z(), e = A.replace(/\r?\n[\t ]+/g, " ");
  return e.split("\r").map(function(i) {
    return i.indexOf(`
`) === 0 ? i.substr(1, i.length) : i;
  }).forEach(function(i) {
    var n = i.split(":"), g = n.shift().trim();
    if (g) {
      var r = n.join(":").trim();
      try {
        t.append(g, r);
      } catch (s) {
        console.warn("Response " + s.message);
      }
    }
  }), t;
}
ar.call(Xt.prototype);
function lt(A, t) {
  if (!(this instanceof lt))
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
  if (t || (t = {}), this.type = "default", this.status = t.status === void 0 ? 200 : t.status, this.status < 200 || this.status > 599)
    throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
  this.ok = this.status >= 200 && this.status < 300, this.statusText = t.statusText === void 0 ? "" : "" + t.statusText, this.headers = new z(t.headers), this.url = t.url || "", this._initBody(A);
}
ar.call(lt.prototype);
lt.prototype.clone = function() {
  return new lt(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new z(this.headers),
    url: this.url
  });
};
lt.error = function() {
  var A = new lt(null, { status: 200, statusText: "" });
  return A.ok = !1, A.status = 0, A.type = "error", A;
};
var va = [301, 302, 303, 307, 308];
lt.redirect = function(A, t) {
  if (va.indexOf(t) === -1)
    throw new RangeError("Invalid status code");
  return new lt(null, { status: t, headers: { location: A } });
};
var kt = W.DOMException;
try {
  new kt();
} catch {
  kt = function(t, e) {
    this.message = t, this.name = e;
    var i = Error(t);
    this.stack = i.stack;
  }, kt.prototype = Object.create(Error.prototype), kt.prototype.constructor = kt;
}
function cr(A, t) {
  return new Promise(function(e, i) {
    var n = new Xt(A, t);
    if (n.signal && n.signal.aborted)
      return i(new kt("Aborted", "AbortError"));
    var g = new XMLHttpRequest();
    function r() {
      g.abort();
    }
    g.onload = function() {
      var I = {
        statusText: g.statusText,
        headers: wa(g.getAllResponseHeaders() || "")
      };
      n.url.indexOf("file://") === 0 && (g.status < 200 || g.status > 599) ? I.status = 200 : I.status = g.status, I.url = "responseURL" in g ? g.responseURL : I.headers.get("X-Request-URL");
      var C = "response" in g ? g.response : g.responseText;
      setTimeout(function() {
        e(new lt(C, I));
      }, 0);
    }, g.onerror = function() {
      setTimeout(function() {
        i(new TypeError("Network request failed"));
      }, 0);
    }, g.ontimeout = function() {
      setTimeout(function() {
        i(new TypeError("Network request timed out"));
      }, 0);
    }, g.onabort = function() {
      setTimeout(function() {
        i(new kt("Aborted", "AbortError"));
      }, 0);
    };
    function s(I) {
      try {
        return I === "" && W.location.href ? W.location.href : I;
      } catch {
        return I;
      }
    }
    if (g.open(n.method, s(n.url), !0), n.credentials === "include" ? g.withCredentials = !0 : n.credentials === "omit" && (g.withCredentials = !1), "responseType" in g && (_.blob ? g.responseType = "blob" : _.arrayBuffer && (g.responseType = "arraybuffer")), t && typeof t.headers == "object" && !(t.headers instanceof z || W.Headers && t.headers instanceof W.Headers)) {
      var o = [];
      Object.getOwnPropertyNames(t.headers).forEach(function(I) {
        o.push(Ie(I)), g.setRequestHeader(I, Ri(t.headers[I]));
      }), n.headers.forEach(function(I, C) {
        o.indexOf(C) === -1 && g.setRequestHeader(C, I);
      });
    } else
      n.headers.forEach(function(I, C) {
        g.setRequestHeader(C, I);
      });
    n.signal && (n.signal.addEventListener("abort", r), g.onreadystatechange = function() {
      g.readyState === 4 && n.signal.removeEventListener("abort", r);
    }), g.send(typeof n._bodyInit > "u" ? null : n._bodyInit);
  });
}
cr.polyfill = !0;
W.fetch || (W.fetch = cr, W.Headers = z, W.Request = Xt, W.Response = lt);
const lr = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAAqACAAQAAAABAAAANKADAAQAAAABAAAANAAAAAD/4QkhaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/4hskSUNDX1BST0ZJTEUAAQEAABsUYXBwbAIQAABtbnRyUkdCIFhZWiAH4AAKAB0AFAA0AAZhY3NwQVBQTAAAAABBUFBMAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFkZXNjAAABUAAAAGJkc2NtAAABtAAABBhjcHJ0AAAFzAAAACN3dHB0AAAF8AAAABRyWFlaAAAGBAAAABRnWFlaAAAGGAAAABRiWFlaAAAGLAAAABRyVFJDAAAGQAAACAxhYXJnAAAOTAAAACB2Y2d0AAAObAAABhJuZGluAAAUgAAABj5jaGFkAAAawAAAACxtbW9kAAAa7AAAAChiVFJDAAAGQAAACAxnVFJDAAAGQAAACAxhYWJnAAAOTAAAACBhYWdnAAAOTAAAACBkZXNjAAAAAAAAAAhEaXNwbGF5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbWx1YwAAAAAAAAAiAAAADGhySFIAAAAUAAABqGtvS1IAAAAMAAABvG5iTk8AAAASAAAByGlkAAAAAAASAAAB2mh1SFUAAAAUAAAB7GNzQ1oAAAAWAAACAGRhREsAAAAcAAACFnVrVUEAAAAcAAACMmFyAAAAAAAUAAACTml0SVQAAAAUAAACYnJvUk8AAAASAAACdm5sTkwAAAAWAAACiGhlSUwAAAAWAAACnmVzRVMAAAASAAACdmZpRkkAAAAQAAACtHpoVFcAAAAMAAACxHZpVk4AAAAOAAAC0HNrU0sAAAAWAAAC3npoQ04AAAAMAAACxHJ1UlUAAAAkAAAC9GZyRlIAAAAWAAADGG1zAAAAAAASAAADLmNhRVMAAAAYAAADQHRoVEgAAAAMAAADWGVzWEwAAAASAAACdmRlREUAAAAQAAADZGVuVVMAAAASAAADdHB0QlIAAAAYAAADhnBsUEwAAAASAAADnmVsR1IAAAAiAAADsHN2U0UAAAAQAAAD0nRyVFIAAAAUAAAD4mphSlAAAAAMAAAD9nB0UFQAAAAWAAAEAgBMAEMARAAgAHUAIABiAG8AagBpzuy37AAgAEwAQwBEAEYAYQByAGcAZQAtAEwAQwBEAEwAQwBEACAAVwBhAHIAbgBhAFMAegDtAG4AZQBzACAATABDAEQAQgBhAHIAZQB2AG4A/QAgAEwAQwBEAEwAQwBEAC0AZgBhAHIAdgBlAHMAawDmAHIAbQQaBD4EOwRMBD4EQAQ+BDIEOAQ5ACAATABDAEQgDwBMAEMARAAgBkUGRAZIBkYGKQBMAEMARAAgAGMAbwBsAG8AcgBpAEwAQwBEACAAYwBvAGwAbwByAEsAbABlAHUAcgBlAG4ALQBMAEMARCAPAEwAQwBEACAF5gXRBeIF1QXgBdkAVgDkAHIAaQAtAEwAQwBEX2mCcgAgAEwAQwBEAEwAQwBEACAATQDgAHUARgBhAHIAZQBiAG4A6QAgAEwAQwBEBCYEMgQ1BEIEPQQ+BDkAIAQWBBoALQQ0BDgEQQQ/BDsENQQ5AEwAQwBEACAAYwBvAHUAbABlAHUAcgBXAGEAcgBuAGEAIABMAEMARABMAEMARAAgAGUAbgAgAGMAbwBsAG8AcgBMAEMARAAgDioONQBGAGEAcgBiAC0ATABDAEQAQwBvAGwAbwByACAATABDAEQATABDAEQAIABDAG8AbABvAHIAaQBkAG8ASwBvAGwAbwByACAATABDAEQDiAOzA8cDwQPJA7wDtwAgA78DuAPMA70DtwAgAEwAQwBEAEYA5AByAGcALQBMAEMARABSAGUAbgBrAGwAaQAgAEwAQwBEMKsw6TD8AEwAQwBEAEwAQwBEACAAYQAgAEMAbwByAGUAc3RleHQAAAAAQ29weXJpZ2h0IEFwcGxlIEluYy4sIDIwMTYAAFhZWiAAAAAAAADzUgABAAAAARbPWFlaIAAAAAAAAGXoAAA8EAAACdBYWVogAAAAAAAAapMAAKrFAAAXilhZWiAAAAAAAAAmWwAAGSwAALHSY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA2ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKMAqACtALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkH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", hr = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAAqACAAQAAAABAAAANKADAAQAAAABAAAANAAAAAD/4QkhaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/4gKESUNDX1BST0ZJTEUAAQEAAAJ0YXBwbAQAAABtbnRyUkdCIFhZWiAH3AALAAwAEgA6ABdhY3NwQVBQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGxmSfnZPIV3n7QGSpkeOnQsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtkZXNjAAABCAAAAGNkc2NtAAABbAAAACxjcHJ0AAABmAAAAC13dHB0AAAByAAAABRyWFlaAAAB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", ur = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCARXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAKgAgAEAAAAAQAAADSgAwAEAAAAAQAAADQAAAAA/+EJIWh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/PgD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/+IbJElDQ19QUk9GSUxFAAEBAAAbFGFwcGwCEAAAbW50clJHQiBYWVogB+EABAAEABcABgAzYWNzcEFQUEwAAAAAQVBQTAAAAAAAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1hcHBsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARZGVzYwAAAVAAAABiZHNjbQAAAbQAAAQYY3BydAAABcwAAAAjd3RwdAAABfAAAAAUclhZWgAABgQAAAAUZ1hZWgAABhgAAAAUYlhZWgAABiwAAAAUclRSQwAABkAAAAgMYWFyZwAADkwAAAAgdmNndAAADmwAAAYSbmRpbgAAFIAAAAY+Y2hhZAAAGsAAAAAsbW1vZAAAGuwAAAAoYlRSQwAABkAAAAgMZ1RSQwAABkAAAAgMYWFiZwAADkwAAAAgYWFnZwAADkwAAAAgZGVzYwAAAAAAAAAIRGlzcGxheQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG1sdWMAAAAAAAAAIgAAAAxockhSAAAAFAAAAahrb0tSAAAADAAAAbxuYk5PAAAAEgAAAchpZAAAAAAAEgAAAdpodUhVAAAAFAAAAexjc0NaAAAAFgAAAgBkYURLAAAAHAAAAhZ1a1VBAAAAHAAAAjJhcgAAAAAAFAAAAk5pdElUAAAAFAAAAmJyb1JPAAAAEgAAAnZubE5MAAAAFgAAAohoZUlMAAAAFgAAAp5lc0VTAAAAEgAAAnZmaUZJAAAAEAAAArR6aFRXAAAADAAAAsR2aVZOAAAADgAAAtBza1NLAAAAFgAAAt56aENOAAAADAAAAsRydVJVAAAAJAAAAvRmckZSAAAAFgAAAxhtcwAAAAAAEgAAAy5jYUVTAAAAGAAAA0B0aFRIAAAADAAAA1hlc1hMAAAAEgAAAnZkZURFAAAAEAAAA2RlblVTAAAAEgAAA3RwdEJSAAAAGAAAA4ZwbFBMAAAAEgAAA55lbEdSAAAAIgAAA7BzdlNFAAAAEAAAA9J0clRSAAAAFAAAA+JqYUpQAAAADAAAA/ZwdFBUAAAAFgAABAIATABDAEQAIAB1ACAAYgBvAGoAac7st+wAIABMAEMARABGAGEAcgBnAGUALQBMAEMARABMAEMARAAgAFcAYQByAG4AYQBTAHoA7QBuAGUAcwAgAEwAQwBEAEIAYQByAGUAdgBuAP0AIABMAEMARABMAEMARAAtAGYAYQByAHYAZQBzAGsA5gByAG0EGgQ+BDsETAQ+BEAEPgQyBDgEOQAgAEwAQwBEIA8ATABDAEQAIAZFBkQGSAZGBikATABDAEQAIABjAG8AbABvAHIAaQBMAEMARAAgAGMAbwBsAG8AcgBLAGwAZQB1AHIAZQBuAC0ATABDAEQgDwBMAEMARAAgBeYF0QXiBdUF4AXZAFYA5AByAGkALQBMAEMARF9pgnIAIABMAEMARABMAEMARAAgAE0A4AB1AEYAYQByAGUAYgBuAP0AIABMAEMARAQmBDIENQRCBD0EPgQ5ACAEFgQaAC0ENAQ4BEEEPwQ7BDUEOQBMAEMARAAgAGMAbwB1AGwAZQB1AHIAVwBhAHIAbgBhACAATABDAEQATABDAEQAIABlAG4AIABjAG8AbABvAHIATABDAEQAIA4qDjUARgBhAHIAYgAtAEwAQwBEAEMAbwBsAG8AcgAgAEwAQwBEAEwAQwBEACAAQwBvAGwAbwByAGkAZABvAEsAbwBsAG8AcgAgAEwAQwBEA4gDswPHA8EDyQO8A7cAIAO/A7gDzAO9A7cAIABMAEMARABGAOQAcgBnAC0ATABDAEQAUgBlAG4AawBsAGkAIABMAEMARDCrMOkw/ABMAEMARABMAEMARAAgAGEAIABDAG8AcgBlAHN0ZXh0AAAAAENvcHlyaWdodCBBcHBsZSBJbmMuLCAyMDE3AABYWVogAAAAAAAA81IAAQAAAAEWz1hZWiAAAAAAAABl6AAAPBAAAAnQWFlaIAAAAAAAAGqTAACqxQAAF4pYWVogAAAAAAAAJlsAABksAACx0mN1cnYAAAAAAAAEAAAAAAUACgAPABQAGQAeACMAKAAtADIANgA7AEAARQBKAE8AVABZAF4AYwBoAG0AcgB3AHwAgQCGAIsAkACVAJoAnwCjAKgArQCyALcAvADBAMYAywDQANUA2wDgAOUA6wDwAPYA+wEBAQcBDQETARkBHwElASsBMgE4AT4BRQFMAVIBWQFgAWcBbgF1AXwBgwGLAZIBmgGhAakBsQG5AcEByQHRAdkB4QHpAfIB+gIDAgwCFAIdAiYCLwI4AkECSwJUAl0CZwJxAnoChAKOApgCogKsArYCwQLLAtUC4ALrAvUDAAMLAxYDIQMtAzgDQwNPA1oDZgNyA34DigOWA6IDrgO6A8cD0wPgA+wD+QQGBBMEIAQtBDsESARVBGMEcQR+BIwEmgSoBLYExATTBOEE8AT+BQ0FHAUrBToFSQVYBWcF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", ba = {
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
    // maxZoom必須: 未指定だとWeiwudi(SWタイルキャッシュ)登録時にズーム上限0と
    // 解釈される環境があり、キャッシュ経由の全タイルが404になる (#78)
    maxZoom: 19,
    thumbnail: lr,
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
    thumbnail: hr
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
    thumbnail: ur
  }
}, Ag = (A) => (A || "").match(/^(?:base|overlay|google(?:_(?:roadmap|satellite|hybrid|terrain))?|mapbox|maplibre|osm)$/);
async function Ma(A, t) {
  if (typeof A == "string" && (A = ba[A]), A = ct(Object.assign(A, t)), A.label = A.label || A.year, Ag(A.maptype)) {
    const r = A.maptype === "base" ? re : A.maptype === "overlay" ? sA : A.maptype === "mapbox" ? gA : A.maptype === "maplibre" ? rA : ei;
    r.isBasemap() ? (A.homePosition = A.homePos, A.mercZoom = A.defZoom) : (A.homePosition || (A.homePosition = A.homePos), A.mercZoom || (A.mercZoom = A.defZoom)), delete A.homePos, delete A.defZoom, A.zoomRestriction && (A.maxZoom = A.maxZoom || A.mercMaxZoom, A.minZoom = A.minZoom || A.mercMinZoom), A.zoomRestriction = A.mercMaxZoom = A.mercMinZoom = void 0, A.translator && (A.url = A.translator(A.url)), A.imageExtension || (A.imageExtension = "jpg"), A.mapID && !A.url && !A.urls && (A.url = A.tms ? `tiles/${A.mapID}/{z}/{x}/{-y}.${A.imageExtension}` : `tiles/${A.mapID}/{z}/{x}/{y}.${A.imageExtension}`), A.weiwudi = await LA(A), A.weiwudi && (A.url = A.weiwudi.url, delete A.urls);
    const s = await r.createAsync(A);
    return await s.initialWait, s;
  } else if (A.noload)
    return A.mercMaxZoom = A.mercMinZoom = void 0, new oA(A);
  const e = A.settingFile || `maps/${A.mapID}.json`, i = await fetch(e);
  if (!i.ok)
    throw new Error("Fail to load map json");
  const n = await i.json();
  if (A = ct(Object.assign(n, A)), A.label = A.label || n.year, A.translator && (A.url = A.translator(A.url)), A.maptype || (A.maptype = "maplat"), Ag(A.maptype)) {
    const r = A.maptype === "base" ? re : A.maptype === "overlay" ? sA : A.maptype === "mapbox" ? gA : A.maptype === "maplibre" ? rA : ei;
    r.isBasemap() ? (A.homePosition = A.homePos, A.mercZoom = A.defZoom) : (A.homePosition || (A.homePosition = A.homePos), A.mercZoom || (A.mercZoom = A.defZoom)), delete A.homePos, delete A.defZoom, A.zoomRestriction && (A.maxZoom = A.maxZoom || A.mercMaxZoom, A.minZoom = A.minZoom || A.mercMinZoom), A.zoomRestriction = A.mercMaxZoom = A.mercMinZoom = void 0, A.imageExtension || (A.imageExtension = "jpg"), A.mapID && !A.url && !A.urls && (A.url = A.tms ? `tiles/${A.mapID}/{z}/{x}/{-y}.${A.imageExtension}` : `tiles/${A.mapID}/{z}/{x}/{y}.${A.imageExtension}`), A.weiwudi = await LA(A), A.weiwudi && (A.url = A.weiwudi.url, delete A.urls);
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
  A.width = A.width || A.compiled.wh[0], A.height = A.height || A.compiled.wh[1], A.weiwudi = await LA(A), A.weiwudi && (A.url = A.weiwudi.url, delete A.urls);
  const g = await oA.createAsync(A);
  return await g.initialWait, await new Promise((r) => {
    g.setupMapParameter(() => r());
  }), g;
}
async function LA(A) {
  const t = {};
  if (A.maptype === "mapbox" || A.maptype === "maplibre" || A.maptype === "google" || !A.enableCache) return;
  A.maptype === "base" || A.maptype === "overlay" ? t.type = "wmts" : t.type = "xyz", t.url = A.urls ? A.urls : A.url, t.width = A.width, t.height = A.height, t.maxZoom = A.maxZoom, t.minZoom = A.minZoom, A.cacheTtl !== void 0 && (t.cacheTtl = A.cacheTtl);
  const e = A.envelopeLngLats;
  if (e) {
    const n = e.reduce(
      (g, r) => (g[0] = g[0] > r[0] ? r[0] : g[0], g[1] = g[1] < r[0] ? r[0] : g[1], g[2] = g[2] > r[1] ? r[1] : g[2], g[3] = g[3] < r[1] ? r[1] : g[3], g),
      [1 / 0, -1 / 0, 1 / 0, -1 / 0]
    );
    ["minLng", "maxLng", "minLat", "maxLat"].map((g, r) => {
      t[g] = n[r];
    });
  }
  let i;
  try {
    i = await ut.registerMap(A.mapID, t);
  } catch {
  }
  return i;
}
function ZA(A, t) {
  return A + (Math.random() - 0.5) * t;
}
function ii(A, t) {
  if (A instanceof Array)
    return A.map((i) => ii(i, t));
  const e = Math.pow(10, t);
  return Math.round(A * e) / e;
}
var fe = { exports: {} }, XA, ig;
function fr() {
  if (ig) return XA;
  ig = 1;
  var A = /<%=([\s\S]+?)%>/g;
  return XA = A, XA;
}
var jA, ng;
function Ea() {
  if (ng) return jA;
  ng = 1;
  var A = fr(), t = "[object Null]", e = "[object Symbol]", i = "[object Undefined]", n = /[&<>"']/g, g = RegExp(n.source), r = /<%-([\s\S]+?)%>/g, s = /<%([\s\S]+?)%>/g, o = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }, I = typeof globalThis == "object" && globalThis && globalThis.Object === Object && globalThis, C = typeof self == "object" && self && self.Object === Object && self, a = I || C || Function("return this")();
  function c(R, $) {
    for (var pt = -1, jt = R == null ? 0 : R.length, Nt = Array(jt); ++pt < jt; )
      Nt[pt] = $(R[pt], pt, R);
    return Nt;
  }
  function l(R) {
    return function($) {
      return R?.[$];
    };
  }
  var d = l(o), h = Object.prototype, f = h.hasOwnProperty, m = h.toString, y = a.Symbol, b = y ? y.toStringTag : void 0, v = y ? y.prototype : void 0, M = v ? v.toString : void 0, E = {
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
      _: { escape: xt }
    }
  };
  function P(R) {
    return R == null ? R === void 0 ? i : t : b && b in Object(R) ? T(R) : k(R);
  }
  function x(R) {
    if (typeof R == "string")
      return R;
    if (D(R))
      return c(R, x) + "";
    if (X(R))
      return M ? M.call(R) : "";
    var $ = R + "";
    return $ == "0" && 1 / R == -1 / 0 ? "-0" : $;
  }
  function T(R) {
    var $ = f.call(R, b), pt = R[b];
    try {
      R[b] = void 0;
      var jt = !0;
    } catch {
    }
    var Nt = m.call(R);
    return jt && ($ ? R[b] = pt : delete R[b]), Nt;
  }
  function k(R) {
    return m.call(R);
  }
  var D = Array.isArray;
  function L(R) {
    return R != null && typeof R == "object";
  }
  function X(R) {
    return typeof R == "symbol" || L(R) && P(R) == e;
  }
  function H(R) {
    return R == null ? "" : x(R);
  }
  function xt(R) {
    return R = H(R), R && g.test(R) ? R.replace(n, d) : R;
  }
  return jA = E, jA;
}
fe.exports;
var gg;
function Ra() {
  return gg || (gg = 1, (function(A, t) {
    var e = fr(), i = Ea(), n = "Invalid `variable` option passed into `_.template`", g = "Invalid `imports` option passed into `_.template`", r = 800, s = 16, o = 9007199254740991, I = "[object Arguments]", C = "[object Array]", a = "[object AsyncFunction]", c = "[object Boolean]", l = "[object Date]", d = "[object DOMException]", h = "[object Error]", f = "[object Function]", m = "[object GeneratorFunction]", y = "[object Map]", b = "[object Number]", v = "[object Null]", M = "[object Object]", E = "[object Proxy]", P = "[object RegExp]", x = "[object Set]", T = "[object String]", k = "[object Symbol]", D = "[object Undefined]", L = "[object WeakMap]", X = "[object ArrayBuffer]", H = "[object DataView]", xt = "[object Float32Array]", R = "[object Float64Array]", $ = "[object Int8Array]", pt = "[object Int16Array]", jt = "[object Int32Array]", Nt = "[object Uint8Array]", xi = "[object Uint8ClampedArray]", yr = "[object Uint16Array]", wr = "[object Uint32Array]", vr = /\b__p \+= '';/g, br = /\b(__p \+=) '' \+/g, Mr = /(__e\(.*?\)|\b__t\)) \+\n'';/g, Er = /[\\^$.*+?()[\]{}|]/g, Si = /[()=,{}\[\]\/\s]/, Rr = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, Pr = /^\[object .+?Constructor\]$/, xr = /^(?:0|[1-9]\d*)$/, Te = /($^)/, Sr = /['\n\r\u2028\u2029\\]/g, Z = {};
    Z[xt] = Z[R] = Z[$] = Z[pt] = Z[jt] = Z[Nt] = Z[xi] = Z[yr] = Z[wr] = !0, Z[I] = Z[C] = Z[X] = Z[c] = Z[H] = Z[l] = Z[h] = Z[f] = Z[y] = Z[b] = Z[M] = Z[P] = Z[x] = Z[T] = Z[L] = !1;
    var Dr = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    }, Di = typeof globalThis == "object" && globalThis && globalThis.Object === Object && globalThis, Br = typeof self == "object" && self && self.Object === Object && self, dA = Di || Br || Function("return this")(), Bi = t && !t.nodeType && t, Ce = Bi && !0 && A && !A.nodeType && A, Ti = Ce && Ce.exports === Bi, mA = Ti && Di.process, ki = (function() {
      try {
        var u = Ce && Ce.require && Ce.require("util").types;
        return u || mA && mA.binding && mA.binding("util");
      } catch {
      }
    })(), Gi = ki && ki.isTypedArray;
    function Oi(u, p, w) {
      switch (w.length) {
        case 0:
          return u.call(p);
        case 1:
          return u.call(p, w[0]);
        case 2:
          return u.call(p, w[0], w[1]);
        case 3:
          return u.call(p, w[0], w[1], w[2]);
      }
      return u.apply(p, w);
    }
    function Tr(u, p) {
      for (var w = -1, S = u == null ? 0 : u.length; ++w < S && p(u[w], w, u) !== !1; )
        ;
      return u;
    }
    function Li(u, p) {
      for (var w = -1, S = u == null ? 0 : u.length, B = Array(S); ++w < S; )
        B[w] = p(u[w], w, u);
      return B;
    }
    function kr(u, p) {
      for (var w = -1, S = Array(u); ++w < u; )
        S[w] = p(w);
      return S;
    }
    function Gr(u) {
      return function(p) {
        return u(p);
      };
    }
    function Or(u, p) {
      return Li(p, function(w) {
        return u[w];
      });
    }
    function Lr(u) {
      return "\\" + Dr[u];
    }
    function Zr(u, p) {
      return u?.[p];
    }
    function Zi(u, p) {
      return function(w) {
        return u(p(w));
      };
    }
    var Xr = Function.prototype, ae = Object.prototype, pA = dA["__core-js_shared__"], ke = Xr.toString, ot = ae.hasOwnProperty, Xi = (function() {
      var u = /[^.]+$/.exec(pA && pA.keys && pA.keys.IE_PROTO || "");
      return u ? "Symbol(src)_1." + u : "";
    })(), ji = ae.toString, jr = ke.call(Object), Nr = RegExp(
      "^" + ke.call(ot).replace(Er, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ), Ni = Ti ? dA.Buffer : void 0, Ge = dA.Symbol, zr = Zi(Object.getPrototypeOf, Object), Fr = ae.propertyIsEnumerable, St = Ge ? Ge.toStringTag : void 0, Oe = (function() {
      try {
        var u = ts(Object, "defineProperty");
        return u({}, "", {}), u;
      } catch {
      }
    })(), Ur = Ni ? Ni.isBuffer : void 0, Wr = Zi(Object.keys, Object), zi = Math.max, Qr = Date.now, Fi = Ge ? Ge.prototype : void 0, Ui = Fi ? Fi.toString : void 0;
    function Vr(u, p) {
      var w = qi(u), S = !w && Is(u), B = !w && !S && Cs(u), j = !w && !S && !B && ls(u), At = w || S || B || j, N = At ? kr(u.length, String) : [], It = N.length;
      for (var it in u)
        ot.call(u, it) && !(At && // Safari 9 has enumerable `arguments.length` in strict mode.
        (it == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        B && (it == "offset" || it == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        j && (it == "buffer" || it == "byteLength" || it == "byteOffset") || // Skip index properties.
        Ki(it, It))) && N.push(it);
      return N;
    }
    function Hr(u, p, w) {
      var S = u[p];
      (!(ot.call(u, p) && yA(S, w)) || w === void 0 && !(p in u)) && Wi(u, p, w);
    }
    function Wi(u, p, w) {
      p == "__proto__" && Oe ? Oe(u, p, {
        configurable: !0,
        enumerable: !0,
        value: w,
        writable: !0
      }) : u[p] = w;
    }
    function zt(u) {
      return u == null ? u === void 0 ? D : v : St && St in Object(u) ? es(u) : ns(u);
    }
    function Qi(u) {
      return Ft(u) && zt(u) == I;
    }
    function Yr(u) {
      if (!wA(u) || As(u))
        return !1;
      var p = tn(u) ? Nr : Pr;
      return p.test(os(u));
    }
    function Kr(u) {
      return Ft(u) && en(u.length) && !!Z[zt(u)];
    }
    function Jr(u) {
      if (!is(u))
        return Wr(u);
      var p = [];
      for (var w in Object(u))
        ot.call(u, w) && w != "constructor" && p.push(w);
      return p;
    }
    function Vi(u, p) {
      return rs(gs(u, p, gn), u + "");
    }
    var qr = Oe ? function(u, p) {
      return Oe(u, "toString", {
        configurable: !0,
        enumerable: !1,
        value: ds(p),
        writable: !0
      });
    } : gn;
    function Hi(u) {
      if (typeof u == "string")
        return u;
      if (qi(u))
        return Li(u, Hi) + "";
      if (cs(u))
        return Ui ? Ui.call(u) : "";
      var p = u + "";
      return p == "0" && 1 / u == -1 / 0 ? "-0" : p;
    }
    function _r(u, p, w, S) {
      var B = !w;
      w || (w = {});
      for (var j = -1, At = p.length; ++j < At; ) {
        var N = p[j], It = S ? S(w[N], u[N], N, w, u) : void 0;
        It === void 0 && (It = u[N]), B ? Wi(w, N, It) : Hr(w, N, It);
      }
      return w;
    }
    function $r(u) {
      return Vi(function(p, w) {
        var S = -1, B = w.length, j = B > 1 ? w[B - 1] : void 0, At = B > 2 ? w[2] : void 0;
        for (j = u.length > 3 && typeof j == "function" ? (B--, j) : void 0, At && Ji(w[0], w[1], At) && (j = B < 3 ? void 0 : j, B = 1), p = Object(p); ++S < B; ) {
          var N = w[S];
          N && u(p, N, S, j);
        }
        return p;
      });
    }
    function Yi(u, p, w, S) {
      return u === void 0 || yA(u, ae[w]) && !ot.call(S, w) ? p : u;
    }
    function ts(u, p) {
      var w = Zr(u, p);
      return Yr(w) ? w : void 0;
    }
    function es(u) {
      var p = ot.call(u, St), w = u[St];
      try {
        u[St] = void 0;
        var S = !0;
      } catch {
      }
      var B = ji.call(u);
      return S && (p ? u[St] = w : delete u[St]), B;
    }
    function Ki(u, p) {
      var w = typeof u;
      return p = p ?? o, !!p && (w == "number" || w != "symbol" && xr.test(u)) && u > -1 && u % 1 == 0 && u < p;
    }
    function Ji(u, p, w) {
      if (!wA(w))
        return !1;
      var S = typeof p;
      return (S == "number" ? _i(w) && Ki(p, w.length) : S == "string" && p in w) ? yA(w[p], u) : !1;
    }
    function As(u) {
      return !!Xi && Xi in u;
    }
    function is(u) {
      var p = u && u.constructor, w = typeof p == "function" && p.prototype || ae;
      return u === w;
    }
    function ns(u) {
      return ji.call(u);
    }
    function gs(u, p, w) {
      return p = zi(p === void 0 ? u.length - 1 : p, 0), function() {
        for (var S = arguments, B = -1, j = zi(S.length - p, 0), At = Array(j); ++B < j; )
          At[B] = S[p + B];
        B = -1;
        for (var N = Array(p + 1); ++B < p; )
          N[B] = S[B];
        return N[p] = w(At), Oi(u, this, N);
      };
    }
    var rs = ss(qr);
    function ss(u) {
      var p = 0, w = 0;
      return function() {
        var S = Qr(), B = s - (S - w);
        if (w = S, B > 0) {
          if (++p >= r)
            return arguments[0];
        } else
          p = 0;
        return u.apply(void 0, arguments);
      };
    }
    function os(u) {
      if (u != null) {
        try {
          return ke.call(u);
        } catch {
        }
        try {
          return u + "";
        } catch {
        }
      }
      return "";
    }
    function yA(u, p) {
      return u === p || u !== u && p !== p;
    }
    var Is = Qi(/* @__PURE__ */ (function() {
      return arguments;
    })()) ? Qi : function(u) {
      return Ft(u) && ot.call(u, "callee") && !Fr.call(u, "callee");
    }, qi = Array.isArray;
    function _i(u) {
      return u != null && en(u.length) && !tn(u);
    }
    var Cs = Ur || ms;
    function $i(u) {
      if (!Ft(u))
        return !1;
      var p = zt(u);
      return p == h || p == d || typeof u.message == "string" && typeof u.name == "string" && !as(u);
    }
    function tn(u) {
      if (!wA(u))
        return !1;
      var p = zt(u);
      return p == f || p == m || p == a || p == E;
    }
    function en(u) {
      return typeof u == "number" && u > -1 && u % 1 == 0 && u <= o;
    }
    function wA(u) {
      var p = typeof u;
      return u != null && (p == "object" || p == "function");
    }
    function Ft(u) {
      return u != null && typeof u == "object";
    }
    function as(u) {
      if (!Ft(u) || zt(u) != M)
        return !1;
      var p = zr(u);
      if (p === null)
        return !0;
      var w = ot.call(p, "constructor") && p.constructor;
      return typeof w == "function" && w instanceof w && ke.call(w) == jr;
    }
    function cs(u) {
      return typeof u == "symbol" || Ft(u) && zt(u) == k;
    }
    var ls = Gi ? Gr(Gi) : Kr;
    function hs(u) {
      return u == null ? "" : Hi(u);
    }
    var An = $r(function(u, p, w, S) {
      _r(p, nn(p), u, S);
    });
    function nn(u) {
      return _i(u) ? Vr(u) : Jr(u);
    }
    function us(u, p, w) {
      var S = i.imports._.templateSettings || i;
      w && Ji(u, p, w) && (p = void 0), u = hs(u), p = An({}, p, S, Yi);
      var B = An({}, p.imports, S.imports, Yi), j = nn(B), At = Or(B, j);
      Tr(j, function(Xe) {
        if (Si.test(Xe))
          throw new Error(g);
      });
      var N, It, it = 0, rn = p.interpolate || Te, tt = "__p += '", ps = RegExp(
        (p.escape || Te).source + "|" + rn.source + "|" + (rn === e ? Rr : Te).source + "|" + (p.evaluate || Te).source + "|$",
        "g"
      ), ys = ot.call(p, "sourceURL") ? "//# sourceURL=" + (p.sourceURL + "").replace(/\s/g, " ") + `
` : "";
      u.replace(ps, function(Xe, sn, je, ws, on, In) {
        return je || (je = ws), tt += u.slice(it, In).replace(Sr, Lr), sn && (N = !0, tt += `' +
__e(` + sn + `) +
'`), on && (It = !0, tt += `';
` + on + `;
__p += '`), je && (tt += `' +
((__t = (` + je + `)) == null ? '' : __t) +
'`), it = In + Xe.length, Xe;
      }), tt += `';
`;
      var Le = ot.call(p, "variable") && p.variable;
      if (!Le)
        tt = `with (obj) {
` + tt + `
}
`;
      else if (Si.test(Le))
        throw new Error(n);
      tt = (It ? tt.replace(vr, "") : tt).replace(br, "$1").replace(Mr, "$1;"), tt = "function(" + (Le || "obj") + `) {
` + (Le ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (N ? ", __e = _.escape" : "") + (It ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + tt + `return __p
}`;
      var Ze = fs(function() {
        return Function(j, ys + "return " + tt).apply(void 0, At);
      });
      if (Ze.source = tt, $i(Ze))
        throw Ze;
      return Ze;
    }
    var fs = Vi(function(u, p) {
      try {
        return Oi(u, void 0, p);
      } catch (w) {
        return $i(w) ? w : new Error(w);
      }
    });
    function ds(u) {
      return function() {
        return u;
      };
    }
    function gn(u) {
      return u;
    }
    function ms() {
      return !1;
    }
    A.exports = us;
  })(fe, fe.exports)), fe.exports;
}
var Pa = Ra();
const dr = /* @__PURE__ */ xo(Pa);
function rg(A, ...t) {
  const e = ct(Object.assign({}, A));
  if (e.icon) return e;
  const i = t.reduce((n, g) => {
    if (n) return n;
    const r = g.iconTemplate;
    if (r)
      return JSON.parse(dr(r)(e));
    if (g.icon)
      return {
        icon: g.icon,
        selectedIcon: g.selectedIcon
      };
  }, void 0);
  return i && (e.icon = i.icon, e.selectedIcon = i.selectedIcon), e;
}
function sg(A, ...t) {
  return A = ct(A), A.html ? A : t.reduce((e, i) => {
    if (e) return e;
    const n = i.poiTemplate;
    if (n)
      return A.html = dr(n)(A), A.poiStyle = A.poiStyle || i.poiStyle, A;
  }, void 0) || A;
}
const F = {
  ACCURACY: "accuracy",
  ALTITUDE: "altitude",
  ALTITUDE_ACCURACY: "altitudeAccuracy",
  HEADING: "heading",
  POSITION: "position",
  SPEED: "speed",
  TRACKING: "tracking",
  TRACKING_OPTIONS: "trackingOptions"
}, xa = {
  ERROR: "error"
};
class Sa extends mt {
  code;
  message;
  constructor(t) {
    super(xa.ERROR), this.code = t.code, this.message = t.message;
  }
}
class Da extends se {
  task_id_;
  timer_base_ = !1;
  home_position_ = !1;
  constructor(t) {
    super(), t = t || {}, this.timer_base_ = t.timerBase !== void 0 ? t.timerBase : !1, this.task_id_ = void 0, this.home_position_ = t.homePosition !== void 0 ? t.homePosition : !1, this.addChangeListener(F.TRACKING, this.handleTrackingChanged_), t.trackingOptions !== void 0 ? this.setTrackingOptions(t.trackingOptions) : this.setTrackingOptions({
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
      longitude: ZA(this.home_position_[0], 0.05),
      latitude: ZA(this.home_position_[1], 0.05),
      accuracy: ZA(15, 10)
    };
    this.positionChange_({ coords: t });
  }
  positionChange_(t) {
    const e = t.coords;
    this.set(F.ACCURACY, e.accuracy), this.set(
      F.ALTITUDE,
      e.altitude === null ? void 0 : e.altitude
    ), this.set(
      F.ALTITUDE_ACCURACY,
      e.altitudeAccuracy === null ? void 0 : e.altitudeAccuracy
    ), this.set(
      F.HEADING,
      e.heading === null ? void 0 : te(e.heading)
    ), this.set(F.POSITION, [e.longitude, e.latitude]), this.set(F.SPEED, e.speed === null ? void 0 : e.speed), this.changed();
  }
  timerPositionError_() {
    const t = Math.floor(Math.random() * 3) + 1, e = {
      code: t,
      message: t === 1 ? "User denied Geolocation" : t === 2 ? "Position unavailable" : "Timeout expired"
    };
    this.positionError_(e);
  }
  positionError_(t) {
    const e = new Sa(t);
    this.dispatchEvent(e);
  }
  getAccuracy() {
    return this.get(F.ACCURACY);
  }
  getAltitude() {
    return this.get(F.ALTITUDE);
  }
  getAltitudeAccuracy() {
    return this.get(F.ALTITUDE_ACCURACY);
  }
  getHeading() {
    return this.get(F.HEADING);
  }
  getPosition() {
    return this.get(F.POSITION);
  }
  getSpeed() {
    return this.get(F.SPEED);
  }
  getTracking() {
    return this.get(F.TRACKING);
  }
  getTrackingOptions() {
    return this.get(F.TRACKING_OPTIONS);
  }
  setTracking(t) {
    this.set(F.TRACKING, t);
  }
  setTrackingOptions(t) {
    this.set(F.TRACKING_OPTIONS, t);
  }
}
const mr = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjcyNTIxMjZFMDJBMTExRTBCOTNGRTVBRkM1QzM1Qjc5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjcyNTIxMjZGMDJBMTExRTBCOTNGRTVBRkM1QzM1Qjc5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzI1MjEyNkMwMkExMTFFMEI5M0ZFNUFGQzVDMzVCNzkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzI1MjEyNkQwMkExMTFFMEI5M0ZFNUFGQzVDMzVCNzkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4RaveOAAAB1UlEQVR42qzUTyikcRzH8d+OsUNbSOTvgW2LREqjHKSk9FjZxAGXlXJQDsqNokRzcebiRC5mT8tllBE7LlzYKBHFJpKMkD+7hvH+6ftMT4M0Y3/1uswzz+d5nu/3+/t9CAaD6n8uu/L5lHK5XroWjwI4kYWP8GMdv3H47A6nk8CDA6U8nvBLX/Ed+TjDEe7lAS24wE+M4zR0180NgXa7NSgOvajHKvqwZglMxBfUoBmVlv/wTXxU0O1WuoqIgQvLaIJDfn9NISbhRd7Tb4ahbJa3a0QthjCFv2/UfwNduJKv0jUOBSajDb8wE0FTdf1GUAzDGliOdExEMSleedsGxJiBZdiVC5GuABbxGZm2p1lUKg1/dOOjnGf9IglIsUkxY3H+jg1yIc136MBb6WjqOwLNe6904AP2kSuDG80qkW15YjZlCdkojSLsEyqwiWMzcAVbaJV6RrK+IQc/dB3NwGuMohAdEYQVoROz8FkHW68FCW1Hv4zS68eeUnWyS/YwLL1Q9rA/jsn4dEtd5mRo9WlzJ03Tda6S7TaPQWmIPCkQCH+6Ww5RfR5WowmX+IckOca2MYBp2SmW8zCb5hpGeKjuWA8yZEulSbP8sqN2JPjZif0owACin4C7wCjG6AAAAABJRU5ErkJggg==", pr = "data:image/png;base64,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", Ba = {
  osm: lr,
  gsi: hr,
  gsi_ortho: ur,
  redcircle: mr,
  defaultpin_selected: pr,
  defaultpin: bi,
  bluedot: tr,
  bluedot_transparent: er,
  bluedot_small: Ar
}, Ta = {
  "setting-loaded": "onSettingLoaded",
  "appdata-ready": "onAppdataReady",
  "ui-configure": "onUiConfigure",
  "core-dom-ready": "onCoreDomReady",
  "ui-dom-ready": "onUiDomReady",
  "core-ready": "onCoreReady",
  "ui-ready": "onUiReady"
};
class ka extends mt {
  detail;
  constructor(t) {
    super("gps_error"), this.detail = t;
  }
}
class he extends mt {
  detail;
  constructor(t) {
    super("gps_result"), this.detail = t;
  }
}
class Ga extends mt {
  constructor() {
    super("gps_request");
  }
}
function Kt(A, t) {
  console.warn(
    `MaplatCore: POI layer "${A}" not found (${t}). Pass namespaceID (e.g. "<mapID>#<layerId>" for map-derived layers), not the layer-local id.`
  );
}
class IA extends kg {
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
    super(), t = ct(t), this.appid = t.appid || "sample";
    const e = t.mapboxgl || (typeof window < "u" ? window.mapboxgl : void 0);
    e && t.mapboxToken && (e.accessToken = t.mapboxToken), t.googleApiKey && (this.googleApiKey = t.googleApiKey), this.mapDiv = t.div || "map_div", this.mapDivDocument = document.querySelector(`#${this.mapDiv}`), this.mapDivDocument.classList.add("maplat"), this.logger = new xs(
      t.debug ? de.ALL : de.INFO
    ), this.enableCache = t.enableCache || !1, this.icon = t.icon, this.selectedIcon = t.selectedIcon, this.translateUI = t.translateUI, this.uiHooks = t.uiHooks;
    const i = t.setting;
    if (t.restore)
      t.restoreSession && (this.restoreSession = !0), this.initialRestore = t.restore;
    else if (t.restoreSession) {
      this.restoreSession = !0;
      const s = parseInt(localStorage.getItem("epoch") || "0"), o = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
      s && o - s < 3600 && (this.initialRestore.mapID = localStorage.getItem("mapID") || localStorage.getItem("sourceID") || void 0, this.initialRestore.backgroundID = localStorage.getItem("backgroundID") || localStorage.getItem("backID") || void 0, this.initialRestore.position = {
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
    [...ce(`<img id="center_circle" class="prevent-default" alt=""
            style="position:absolute;top:50%;left:50%;margin-top:-10px;
            margin-left:-10px;" src="${mr}">`)].reverse().forEach((s) => {
      this.mapDivDocument.insertBefore(
        s,
        this.mapDivDocument.firstChild
      );
    });
    const g = "maplat-core-style";
    if (!document.getElementById(g)) {
      const s = document.createElement("style");
      s.id = g, s.innerHTML = `
        .maplat * {
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
      `, document.head.appendChild(s);
    }
    this.mapDivDocument.querySelectorAll(".prevent-default").forEach((s) => {
      s.addEventListener("touchstart", (o) => {
        o.preventDefault();
      });
    }), this.overlay = "overlay" in t ? t.overlay : !0, this.overlay && this.mapDivDocument.classList.add("with-opacity"), this.waitReady = (async () => {
      const s = await this.settingLoader(i);
      return this.handleSetting(s, t);
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
    const i = this.buildLifecycleContext(t, e), n = Ta[t], g = this.uiHooks?.[n];
    if (g)
      try {
        const r = await g(i);
        this.lifecycleHookResults[t] = r, i.uiHookResult = r, i.uiHookResults = { ...this.lifecycleHookResults };
      } catch (r) {
        throw this.logger?.debug?.(`lifecycle:error:${t}`), this.dispatchEvent(new Y("lifecycle:error", { phaseId: t, error: r })), r;
      }
    return this.dispatchEvent(
      new Y(`lifecycle:${t}`, i)
    ), i;
  }
  // Async initializers 1: Load application setting
  async settingLoader(t) {
    return t || (await fetch(`apps/${this.appid}.json`)).json();
  }
  // Async initializer 6: Load pois setting => move to normalize_pois.js
  // Async initializer 8: Load sources setting asynchronous
  async sourcesLoader(t) {
    const e = this.appData.sources, i = [], n = {
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
    return e.forEach((g) => {
      i.push(Ma(g, n));
    }), Promise.all(i);
  }
  // Async initializers 2: Handle application setting
  async handleSetting(t, e) {
    await this.runLifecyclePhase("setting-loaded", t), this.appData = ct(t), await this.runLifecyclePhase("appdata-ready"), await this.runLifecyclePhase("ui-configure");
    const i = await this.prepareMap(e);
    await this.runLifecyclePhase("ui-dom-ready");
    const n = await pg(this.appData.pois || [], this);
    await this.handlePois(n, i), this.initGeolocation(e);
  }
  // Async Initializers 2.5: For geolocation settings
  initGeolocation(t) {
    this.alwaysGpsOn = t.alwaysGpsOn || !1;
    const e = this.geolocation = new Da({
      timerBase: t.fake,
      homePosition: this.appData.homePosition
    });
    this.alwaysGpsOn ? (e.setTracking(!0), this.gpsEnabled_ = !0, this.initialGpsMove_ = !0) : (e.setTracking(!1), this.gpsEnabled_ = !1), e.on("change", () => {
      (async () => {
        const i = this.mapObject, n = i.getLayer("overlay").getLayers().item(0), g = i.getLayers().item(0), r = n ? n.getSource() : g.getSource(), s = e.getPosition(), o = e.getAccuracy();
        if (!s || !o) return;
        let I = !this.moveTo_ && !this.firstGpsRequest_;
        this.alwaysGpsOn && (I = !this.initialGpsMove_);
        const C = await r.setGPSMarkerAsync({ lnglat: s, acc: o }, I);
        this.moveTo_ = !1, this.firstGpsRequest_ = !1, this.initialGpsMove_ = !1, C || (this.alwaysGpsOn || this.handleGPS(!1, !0), r.setGPSMarker());
        const a = this.alwaysGpsOn ? "gps_out_hide" : "gps_out";
        this.dispatchEvent(new he(C ? { lnglat: s, acc: o } : { error: a }));
      })();
    }), e.on("error", (i) => {
      const n = i.code;
      if (n === 3) return;
      e.setTracking(!1), this.gpsEnabled_ = !1;
      const g = this.mapObject, r = g.getLayer("overlay").getLayers().item(0), s = g.getLayers().item(0);
      (r ? r.getSource() : s.getSource()).setGPSMarker(), this.dispatchEvent(new ka(n === 1 ? "user_gps_deny" : n === 2 ? "gps_miss" : "gps_timeout")), this.dispatchEvent(new he({ error: "gps_off" }));
    }), this.addEventListener("mapChanged", () => {
      (async () => {
        if (e.getTracking()) {
          const i = this.mapObject, n = i.getLayer("overlay").getLayers().item(0), g = i.getLayers().item(0), r = n ? n.getSource() : g.getSource(), s = e.getPosition(), o = e.getAccuracy();
          if (!s || !o) return;
          const I = await r.setGPSMarkerAsync({ lnglat: s, acc: o }, !0);
          I || (this.alwaysGpsOn || this.handleGPS(!1, !0), r.setGPSMarker());
          const C = this.alwaysGpsOn ? "gps_out_hide" : "gps_out";
          this.dispatchEvent(new he(I ? { lnglat: s, acc: o } : { error: C }));
        }
      })();
    });
  }
  // GPS handling methods
  handleGPS(t, e = !1) {
    if (this.geolocation) {
      if (t)
        if (!this.alwaysGpsOn)
          this.firstGpsRequest_ = !0, this.geolocation.setTracking(!0), this.gpsEnabled_ = !0, this.dispatchEvent(new Ga());
        else {
          const i = this.geolocation.getPosition(), n = this.geolocation.getAccuracy();
          if (i && n) {
            const g = this.mapObject, r = g.getLayer("overlay").getLayers().item(0), s = g.getLayers().item(0), o = r ? r.getSource() : s.getSource();
            (async () => await o.setGPSMarkerAsync({ lnglat: i, acc: n }, !1) || (o.setGPSMarker(), this.dispatchEvent(new he({ error: "gps_out" }))))();
          }
        }
      else if (!this.alwaysGpsOn) {
        this.geolocation.setTracking(!1), this.gpsEnabled_ = !1;
        const i = this.mapObject, n = i.getLayer("overlay").getLayers().item(0), g = i.getLayers().item(0);
        (n ? n.getSource() : g.getSource()).setGPSMarker(), e || this.dispatchEvent(new he({ error: "gps_off" }));
      }
    }
  }
  getGPSEnabled() {
    return this.gpsEnabled_;
  }
  // Async initializers 5: Prepare map base elements and objects
  async prepareMap(t) {
    t = ct(t), this.mercBuffer = null;
    const e = this.appData.homePosition, i = this.appData.defaultZoom, n = this.appData.zoomRestriction, g = this.appData.minZoom, r = this.appData.maxZoom;
    this.appName = this.appData.appName;
    const s = t.fake ? this.appData.fakeGps : !1, o = t.fake ? this.appData.fakeRadius : !1;
    this.noRotate = t.noRotate || this.appData.noRotate || !1, this.poiTemplate = t.poiTemplate || this.appData.poiTemplate || !1, this.poiStyle = t.poiStyle || this.appData.poiStyle || !1, this.iconTemplate = t.iconTemplate || this.appData.iconTemplate || !1, this.currentPosition = null, this.__init = !0;
    const I = `${this.mapDiv}_front`;
    let C = ce(
      `<div id="${I}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;"></div>`
    )[0];
    this.mapDivDocument.insertBefore(C, this.mapDivDocument.firstChild), this.fakeGps = s, this.fakeRadius = o, this.homePosition = e, this.mapObject = new Mt({
      div: I,
      controls: this.appData.controls || [],
      interactions: this.noRotate ? $n({ altShiftDragRotate: !1, pinchRotate: !1 }) : $n().extend([
        new $C({
          condition: GC
        })
      ]),
      fakeGps: s,
      fakeRadius: o,
      homePosition: e,
      northUp: t.northUp || this.appData.northUp || !1,
      tapDuration: t.tapDuration || this.appData.tapDuration || 3e3,
      homeMarginPixels: t.homeMarginPixels || this.appData.homeMarginPixels || 50,
      tapUIVanish: t.tapUIVanish || this.appData.tapUIVanish || !1,
      alwaysGpsOn: t.alwaysGpsOn || !1
    });
    let a = null;
    this.overlay && (a = `${this.mapDiv}_back`, C = ce(
      `<div id="${a}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;"></div>`
    )[0], this.mapDivDocument.insertBefore(
      C,
      this.mapDivDocument.firstChild
    ), this.backMap = new Mt({
      off_control: !0,
      div: a
    }));
    const c = t.mapboxgl || (typeof window < "u" ? window.mapboxgl : void 0);
    if (c) {
      const d = `${this.mapDiv}_mapbox`;
      C = ce(
        `<div id="${d}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;visibility:hidden;"></div>`
      )[0], this.mapDivDocument.insertBefore(
        C,
        this.mapDivDocument.firstChild
      ), this.mapboxMap = new c.Map({
        attributionControl: !1,
        boxZoom: !1,
        container: d,
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
    const l = t.maplibregl || (typeof window < "u" ? window.maplibregl : void 0);
    if (l) {
      const d = `${this.mapDiv}_maplibre`;
      C = ce(
        `<div id="${d}" class="map" style="top:0; left:0; right:0; bottom:0; position:absolute;visibility:hidden;"></div>`
      )[0], this.mapDivDocument.insertBefore(
        C,
        this.mapDivDocument.firstChild
      ), this.maplibreMap = new l.Map({
        attributionControl: !1,
        boxZoom: !1,
        container: d,
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
      defZoom: i,
      zoomRestriction: n,
      mercMinZoom: g,
      mercMaxZoom: r
    };
  }
  // Async initializer 7: Handle pois loading result
  async handlePois(t, e) {
    this.pois = t;
    const i = await this.sourcesLoader(e);
    return this.handleSources(i);
  }
  // Async initializer 9: Handle sources loading result
  async handleSources(t) {
    this.mercSrc = t.reduce((i, n) => {
      if (i) return i;
      if (n.isBasemap()) return n;
    }, null);
    const e = [];
    this.cacheHash = {}, t.forEach((i) => {
      if (i.setMap(this.mapObject), i.isMapbox()) {
        if (!this.mapboxMap)
          throw "To use Mapbox based maps, you need to include Mapbox GL JS and provide it via mapboxgl option.";
        i.mapboxMap = this.mapboxMap;
      } else if (i.isMapLibre && i.isMapLibre()) {
        if (!this.maplibreMap)
          throw "To use MapLibre based maps, you need to include MapLibre GL JS and provide it via maplibregl option.";
        i.maplibreMap = this.maplibreMap;
      }
      e.push(i), this.cacheHash[i.mapID] = i;
    }), this.dispatchEvent(new Y("sourceLoaded", t)), await this.setInitialMap(e), this.setMapClick(), this.setPointerEvents(), this.setMapOnOff(), this.setMouseCursor(), this.setBackMapBehavior(), this.raiseChangeViewpoint(), await this.runLifecyclePhase("core-ready"), await this.runLifecyclePhase("ui-ready");
  }
  // Async initializer 10: Handle initial map
  async setInitialMap(t) {
    const e = this.initialRestore.mapID || this.startFrom || t[t.length - 1].mapID;
    this.from = t.reduce(
      (i, n) => i ? !(i instanceof Ir) && n.mapID != e ? n : i : n.mapID != e ? n : i,
      void 0
    ), await this.changeMap(e, this.initialRestore);
  }
  // Async initializer 11: Handle map click event
  setMapClick() {
    this.mapObject.on("click", (t) => {
      this.logger.debug(t.pixel), this.lastClickEvent = t;
      const e = [];
      if (t.target.forEachFeatureAtPixel(t.pixel, (i) => {
        this.logger.debug(t.pixel), i.get("datum") && e.push(i.get("datum"));
      }), e.length > 0)
        this.dispatchEvent(new Y("clickMarker", e[0])), this.dispatchEvent(new Y("clickMarkers", e));
      else {
        const i = t.coordinate;
        this.dispatchEvent(new Y("clickMapXy", i)), this.from.sysCoord2MercAsync(i).then((n) => {
          this.dispatchEvent(new Y("clickMapMerc", n));
          const g = et(n, "EPSG:3857", "EPSG:4326");
          this.dispatchEvent(
            new Y("clickMap", {
              longitude: g[0],
              latitude: g[1]
            })
          );
        });
      }
    });
  }
  // Async initializer 12: Handle pointer event
  setPointerEvents() {
    let t, e = !1, i = !1;
    const n = {}, g = (r) => {
      this.dispatchEvent(new Y("pointerMoveOnMapXy", r)), this.from.sysCoord2MercAsync(r).then((s) => {
        if (this.dispatchEvent(new Y("pointerMoveOnMapMerc", s)), t) {
          const o = t;
          t = !1, g(o);
        } else
          e = !1;
      });
    };
    this.mapObject.on("pointermove", (r) => {
      i || (e ? t = r.coordinate : (e = !0, g(r.coordinate)));
    }), this.mapObject.on("pointerdown", (r) => {
      r.originalEvent && r.originalEvent.pointerId != null && (n[r.originalEvent.pointerId] = !0), i = !0;
    }), this.mapObject.on("pointerdrag", (r) => {
      r.originalEvent && r.originalEvent.pointerId != null && (n[r.originalEvent.pointerId] = !0), i = !0;
    }), this.mapObject.on("pointerup", (r) => {
      r.originalEvent && r.originalEvent.pointerId != null ? (delete n[r.originalEvent.pointerId], Object.keys(n).length == 0 && (i = !1)) : r.originalEvent && r.originalEvent.touches ? r.originalEvent.touches.length == 0 && (i = !1) : i = !1;
    });
  }
  // Async initializer 13: Handle map UI on/off
  setMapOnOff() {
    let t;
    const e = () => this.mapDivDocument.querySelectorAll(".ol-control"), i = (g) => {
      g.forEach((r) => r.classList.add("fade"));
    }, n = (g) => {
      g.forEach((r) => r.classList.remove("fade"));
    };
    this.mapObject.on("click", () => {
      t && (clearTimeout(t), t = void 0);
      const g = e(), r = g.length && g[0].classList.contains("fade");
      !this.mapObject.tapUIVanish || r ? n(g) : (i(g), t = setTimeout(() => {
        t = void 0, n(e());
      }, this.mapObject.tapDuration));
    }), this.mapObject.on("pointerdrag", () => {
      t && (clearTimeout(t), t = void 0), i(e());
    }), this.mapObject.on("moveend", () => {
      t && (clearTimeout(t), t = void 0), t = setTimeout(() => {
        t = void 0, n(e());
      }, this.mapObject.tapDuration);
    });
  }
  // Async initializer 14: Handle mouse cursor
  setMouseCursor() {
    const t = (i) => {
      const n = i.target.getEventPixel(i.originalEvent), g = i.target.hasFeatureAtPixel(n), r = i.target.getTarget();
      if (g) {
        const s = i.target.forEachFeatureAtPixel(
          i.pixel,
          (o) => {
            if (o.get("datum")) return o;
          }
        );
        this.mapDivDocument.querySelector(`#${r}`).style.cursor = s ? "pointer" : "";
        return;
      }
      this.mapDivDocument.querySelector(`#${r}`).style.cursor = "";
    };
    this.mapObject.on("pointermove", t);
    const e = (i) => {
      let n = i.frameState.viewState.center;
      const g = this.from;
      g.insideCheckSysCoord(n) || (n = g.modulateSysCoordInside(
        n
      ), i.target.getView().setCenter(n));
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
      const i = this.backMap.getSource();
      i && (this.__backMapMoving = !0, this.logger.debug("Backmap moving started"), this.convertParametersFromCurrent(i, (n) => {
        const g = this.backMap.getView();
        g.setCenter(n[0]), g.setZoom(n[1]), g.setRotation(this.noRotate ? 0 : n[2]), this.logger.debug("Backmap moving ended"), this.__backMapMoving = !1;
      }));
    };
    this.mapObject.on("postrender", t);
  }
  // Async initializer 16: Handle back map's behavior
  raiseChangeViewpoint() {
    this.mapObject.on("postrender", async (t) => {
      const e = this.mapObject.getView(), i = e.getCenter(), n = e.getDecimalZoom(), g = Ve(e.getRotation() * 180 / Math.PI), r = await this.from.viewpoint2MercsAsync(), s = await this.mercSrc.mercs2ViewpointAsync(r);
      if (this.mobileMapMoveBuffer && this.mobileMapMoveBuffer[0][0] == s[0][0] && this.mobileMapMoveBuffer[0][1] == s[0][1] && this.mobileMapMoveBuffer[1] == s[1] && this.mobileMapMoveBuffer[2] == s[2]) return;
      this.mobileMapMoveBuffer = s;
      const o = et(s[0], "EPSG:3857", "EPSG:4326"), I = Ve(s[2] * 180 / Math.PI);
      this.dispatchEvent(
        new Y("changeViewpoint", {
          x: i[0],
          y: i[1],
          longitude: o[0],
          latitude: o[1],
          mercator_x: s[0][0],
          mercator_y: s[0][1],
          zoom: n,
          mercZoom: s[1],
          direction: I,
          rotation: g
        })
      ), this.requestUpdateState({
        position: {
          x: i[0],
          y: i[1],
          zoom: n,
          rotation: g
        }
      });
    });
  }
  // 現在の地図回転角を度数で返す (入力側restore.position.rotationと同じ単位系, #61)
  getRotation() {
    const t = this.mapObject?.getView();
    return t ? Ve(t.getRotation() * 180 / Math.PI) : 0;
  }
  // 現在の実世界方位角を度数で返す。TIN地図では歪み補正込みの非同期計算になるためPromiseを返す (#61)
  async getDirection() {
    if (!this.from || !this.mercSrc) return this.getRotation();
    const t = await this.from.viewpoint2MercsAsync(), e = await this.mercSrc.mercs2ViewpointAsync(t);
    return Ve(e[2] * 180 / Math.PI);
  }
  currentMapInfo() {
    return Pn(this.from);
  }
  mapInfo(t) {
    return Pn(this.cacheHash[t]);
  }
  async clientPointToLngLat(t, e) {
    if (!this.from || !this.mapObject) return;
    const n = this.mapObject.getViewport().getBoundingClientRect(), g = [t - n.left, e - n.top], r = this.mapObject.getCoordinateFromPixel(g);
    if (!r) return;
    const s = await this.from.sysCoord2MercAsync(r), o = et(s, "EPSG:3857", "EPSG:4326");
    return {
      longitude: o[0],
      latitude: o[1]
    };
  }
  async lngLatToClientPoint(t, e) {
    if (!this.from || !this.mapObject) return;
    const i = et([t, e], "EPSG:4326", "EPSG:3857"), n = await this.from.merc2SysCoordAsync(i), g = this.mapObject.getPixelFromCoordinate(n);
    if (!g) return;
    const r = this.mapObject.getViewport().getBoundingClientRect();
    return {
      x: g[0] + r.left,
      y: g[1] + r.top
    };
  }
  setMarker(t) {
    this.logger.debug(t);
    const e = t.lnglat || [
      t.lng || t.longitude,
      t.lat || t.latitude
    ], i = t.x, n = t.y, g = t.coordinates, r = this.from, s = t.icon ? this.__selectedMarker == t.namespaceID && t.selectedIcon ? t.selectedIcon : t.icon : this.__selectedMarker == t.namespaceID ? pr : bi;
    return (g ? (function() {
      return r.merc2SysCoordAsync_ignoreBackground(
        g
      );
    })() : i && n ? new Promise((I) => {
      I(r.xy2SysCoord([i, n]));
    }) : (function() {
      const I = et(e, "EPSG:4326", "EPSG:3857");
      return r.merc2SysCoordAsync_ignoreBackground(
        I
      );
    })()).then((I) => {
      I && r.insideCheckSysCoord(I) && this.mapObject.setMarker(I, { datum: t }, s);
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
    const i = (n, g = !1) => Promise.all(
      n.map((r) => Array.isArray(r[0]) ? i(r, g) : (g && (r = et(r, "EPSG:4326", "EPSG:3857")), this.from.merc2SysCoordAsync(r)))
    );
    t.coordinates ? e = i(t.coordinates) : e = i(t.lnglats, !0), e.then((n) => {
      this.mapObject.setVector(n, t.type, t.style);
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
      const i = this.__redrawMarkerThrottle;
      if (i.length == 0 || i[i.length - 1] !== t) {
        i.push(t);
        return;
      }
    }
    this.__redrawMarkerBlock = !0;
    const e = (i) => {
      const n = [];
      this.resetMarker();
      let g;
      if (!this.stateBuffer.hideMarker) {
        for (const s of Object.keys(this.pois)) {
          const o = this.pois[s];
          if (!o.hide)
            for (const I of o.pois) {
              const C = rg(I, o, this);
              sg(C, o, this), this.__selectedMarker == C.namespaceID ? g = C : n.push(this.setMarker(C));
            }
        }
        if (i.pois)
          for (const s of Object.keys(i.pois)) {
            const o = i.pois[s];
            if (!o.hide)
              for (const I of o.pois) {
                const C = rg(I, o, i, this);
                sg(C, o, i, this), this.__selectedMarker == C.namespaceID ? g = C : n.push(this.setMarker(C));
              }
          }
      }
      let r = Promise.all(n);
      g && (r = r.then(() => this.setMarker(g))), r.then(() => {
        this.__redrawMarkerThrottle && this.__redrawMarkerThrottle.length > 0 ? e(this.__redrawMarkerThrottle.shift()) : this.__redrawMarkerBlock = !1;
      });
    };
    e(t);
  }
  selectMarker(t) {
    const e = this.getMarker(t);
    if (!e) return;
    this.__selectedMarker = t;
    const i = {
      latitude: e.lnglat ? e.lnglat[1] : e.lat ? e.lat : e.latitude,
      longitude: e.lnglat ? e.lnglat[0] : e.lng ? e.lng : e.longitude
    };
    this.setViewpoint(i), this.redrawMarkers();
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
        for (const i of this.pois[e].pois)
          if (i.id === t)
            return i;
      return;
    }
  }
  updateMarker(t, e, i) {
    const n = this.getMarker(t);
    if (n) {
      if (e = me(e || {}), i) {
        for (const g of Object.keys(n))
          g !== "id" && g !== "namespaceID" && delete n[g];
        Object.assign(n, e);
      } else
        for (const g of Object.keys(e))
          g === "id" || g === "namespaceID" || (e[g] === "____delete____" ? delete n[g] : n[g] = e[g]);
      this.redrawMarkers();
    }
  }
  addMarker(t, e) {
    if (e || (e = "main"), e.includes("#")) {
      const i = e.split("#"), n = this.cacheHash[i[0]];
      if (n) {
        const g = n.addPoi(t, i[1]);
        return this.dispatchPoiNumber(), this.redrawMarkers(), g;
      }
    } else if (this.pois[e])
      return this.pois[e].pois.push(me(t)), ri(this.pois, e, {
        name: this.appName
      }), this.dispatchPoiNumber(), this.redrawMarkers(), t.namespaceID;
  }
  removeMarker(t) {
    if (t.includes("#")) {
      const e = t.split("#"), i = this.cacheHash[e[0]];
      i && (i.removePoi(e[1]), this.dispatchPoiNumber(), this.redrawMarkers());
    } else
      for (const e of Object.keys(this.pois))
        for (let i = 0; i < this.pois[e].pois.length; i++)
          this.pois[e].pois[i].id === t && (delete this.pois[e].pois[i], this.dispatchPoiNumber(), this.redrawMarkers());
  }
  clearMarker(t) {
    if (t || (t = "main"), t.includes("#")) {
      const e = t.split("#"), i = this.cacheHash[e[0]];
      i && (i.clearPoi(e[1]), this.dispatchPoiNumber(), this.redrawMarkers());
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
      new Y(
        "poi_number",
        this.listPoiLayers(!1, !0).reduce(
          (t, e) => t + e.pois.length,
          0
        )
      )
    );
  }
  listPoiLayers(t = !1, e = !1) {
    const i = Object.keys(this.pois).sort((g, r) => g === "main" ? -1 : r === "main" ? 1 : 0).map((g) => this.pois[g]).filter(
      (g) => e ? t ? g.pois.length && g.hide : g.pois.length : t ? g.hide : !0
    ), n = this.from.listPoiLayers(
      t,
      e
    );
    return i.concat(n);
  }
  showPoiLayer(t) {
    const e = this.getPoiLayer(t);
    if (!e) {
      Kt(t, "showPoiLayer");
      return;
    }
    delete e.hide, this.requestUpdateState({
      hideLayer: this.listPoiLayers(!0).map((i) => i.namespaceID).join(",")
    }), this.redrawMarkers();
  }
  hidePoiLayer(t) {
    const e = this.getPoiLayer(t);
    if (!e) {
      Kt(t, "hidePoiLayer");
      return;
    }
    e.hide = !0, this.requestUpdateState({
      hideLayer: this.listPoiLayers(!0).map((i) => i.namespaceID).join(",")
    }), this.redrawMarkers();
  }
  getPoiLayer(t) {
    if (t.includes("#")) {
      const e = t.split("#"), i = this.cacheHash[e[0]];
      if (i)
        return i.getPoiLayer(e[1]);
    } else
      return this.pois[t];
  }
  addPoiLayer(t, e) {
    if (t !== "main" && !this.pois[t])
      if (!t.includes("#"))
        this.pois[t] = vt(e || [], t, {
          name: this.appName
        }), this.redrawMarkers();
      else {
        const i = t.split("#"), n = this.cacheHash[i[0]];
        n ? (n.addPoiLayer(i[1], e), this.redrawMarkers()) : Kt(t, "addPoiLayer");
      }
  }
  removePoiLayer(t) {
    if (t !== "main")
      if (t.includes("#")) {
        const e = t.split("#"), i = this.cacheHash[e[0]];
        if (!i) {
          Kt(t, "removePoiLayer");
          return;
        }
        if (!i.getPoiLayer(e[1])) {
          Kt(t, "removePoiLayer");
          return;
        }
        i.removePoiLayer(e[1]), this.requestUpdateState({
          hideLayer: this.listPoiLayers(!0).map((n) => n.namespaceID).join(",")
        }), this.dispatchPoiNumber(), this.redrawMarkers();
      } else {
        if (!this.pois[t]) {
          Kt(t, "removePoiLayer");
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
    const i = this.mercSrc, n = this.cacheHash[t];
    return n ? (this.changeMapSeq || (this.changeMapSeq = Promise.resolve()), this.changeMapSeq = this.changeMapSeq.then(
      () => new Promise((g, r) => {
        this.convertParametersFromCurrent(n, (s) => {
          let o = null, I = null;
          const C = e.backgroundID ? this.cacheHash[e.backgroundID] : void 0;
          if (this.backMap && (o = this.backMap.getSource(), n.isWmts() ? this.backMap.exchangeSource() : (C ? (I = C, this.backMap.exchangeSource(I)) : o ? I = o : (I = i, this.from.isWmts() && (I = this.from instanceof sA ? (
            // If current foreground is a TMS overlay, use the current
            // basemap as new background. On initial load no foreground
            // source is set yet, so fall back to the default basemap
            // (mercSrc) to avoid a null background source.
            this.mapObject.getSource() || i
          ) : this.from), I && this.backMap.exchangeSource(I)), I && this.requestUpdateState({ backgroundID: I.mapID }))), n instanceof sA) {
            if (this.mapObject.setLayer(n), C)
              this.mapObject.exchangeSource(C);
            else if (!this.from.isWmts()) {
              const d = o || i;
              this.mapObject.exchangeSource(d);
            }
            const l = this.mapObject.getSource();
            l && this.requestUpdateState({ backgroundID: l.mapID });
          } else
            this.mapObject.setLayer(), this.mapObject.exchangeSource(n);
          const a = {
            mapID: n.mapID
          };
          n.isBasemap() && (a.backgroundID = "____delete____"), this.requestUpdateState(a), this.from = n, this.dispatchPoiNumber();
          const c = this.mapObject.getView();
          this.appData.zoomRestriction && (c.setMaxZoom(n.maxZoom), c.setMinZoom(n.minZoom || 0)), s && n.insideCheckSysCoord(s[0]) ? (c.setCenter(s[0]), c.setZoom(s[1]), c.setRotation(this.noRotate ? 0 : s[2])) : this.__init ? s || this.goHome(n) : (this.dispatchEvent(new Y("outOfMap", {})), this.goHome(n)), n.setGPSMarker(this.currentPosition, !0), e.hideLayer && (e.hideLayer.split(",").map((d) => {
            const h = this.getPoiLayer(d);
            h && (h.hide = !0);
          }), this.requestUpdateState({ hideLayer: e.hideLayer })), e.hideMarker ? this.hideAllMarkers() : this.redrawMarkers(), this.resetVector(), this.vectors.forEach((l) => {
            this.setVector(l);
          }), this.dispatchEvent(
            new Y("mapChanged", this.getMapMeta(n.mapID))
          ), this.mapObject.updateSize(), this.mapObject.render(), e.position && (this.__init = !1, n.setViewpoint(e.position)), e.transparency && this.setTransparency(e.transparency), this.__init ? (this.__init = !1, this.goHome(n)) : this.backMap && I && this.convertParametersFromCurrent(I, (l) => {
            const d = this.backMap.getView();
            d.setCenter(l[0]), d.setZoom(l[1]), d.setRotation(this.noRotate ? 0 : l[2]), this.backMap.updateSize(), this.backMap.render();
          }), g(void 0);
        });
      })
    )) : (this.logger.warn(`changeMap: mapID "${t}" not found in cacheHash`), Promise.resolve());
  }
  requestUpdateState(t) {
    if (this.stateBuffer = Object.assign(this.stateBuffer, t), this.stateBuffer.backgroundID == "____delete____" && delete this.stateBuffer.backgroundID, this.restoreSession) {
      const e = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3);
      localStorage.setItem("epoch", `${e}`);
      const i = function(n) {
        Object.keys(n).map((g) => {
          g == "position" ? i(n[g]) : g == "backgroundID" && n[g] == "____delete____" ? localStorage.removeItem(g) : localStorage.setItem(g, n[g]);
        });
      };
      i(t);
    }
    this.timer && clearTimeout(this.timer), this.timer = setTimeout(() => {
      this.timer = void 0, this.dispatchEvent(new Y("updateState", this.stateBuffer));
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
      return ye.reduce(
        (i, n) => (i[n] = e.get(n), i),
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
    let i;
    if (t ? i = this.cacheHash[t] : i = this.from, !i) {
      e("stop", {});
      return;
    }
    await i.fetchAllTileCacheAsync(e);
  }
  async cancelMapTileCacheAsync(t) {
    let e;
    t ? e = this.cacheHash[t] : e = this.from, e && await e.cancelTileCacheAsync();
  }
  convertParametersFromCurrent(t, e) {
    const i = this.mapObject.getView();
    if (!this.from) {
      e && e();
      return;
    }
    let n = this.from.viewpoint2MercsAsync();
    const g = ii(
      [i.getCenter(), i.getZoom(), i.getRotation()],
      10
    );
    if (this.mercBuffer && this.mercBuffer.mercs && this.mercBuffer.buffer[this.from.mapID]) {
      const r = this.mercBuffer.buffer[this.from.mapID];
      r[0][0] == g[0][0] && r[0][1] == g[0][1] && r[1] == g[1] && r[2] == g[2] ? (this.logger.debug(r), this.logger.debug(g), this.logger.debug("From: Use buffer"), n = new Promise((s, o) => {
        s(this.mercBuffer.mercs);
      })) : (this.mercBuffer = {
        buffer: {}
      }, this.mercBuffer.buffer[this.from.mapID] = g);
    } else
      this.mercBuffer = {
        buffer: {}
      }, this.mercBuffer.buffer[this.from.mapID] = g;
    this.logger.debug(
      `From: Center: ${g[0]} Zoom: ${g[1]} Rotation: ${g[2]}`
    ), this.logger.debug(`From: ${this.from.mapID}`), n.then((r) => {
      this.mercBuffer.mercs = r, this.logger.debug(`Mercs: ${r}`);
      let s = t.mercs2ViewpointAsync(r);
      const o = t.mapID;
      this.mercBuffer.buffer[o] && (this.logger.debug("To: Use buffer"), s = new Promise((I, C) => {
        I(this.mercBuffer.buffer[o]);
      })), s.then((I) => {
        this.logger.debug(
          `To: Center: ${I[0]} Zoom: ${I[1]} Rotation: ${I[2]}`
        ), this.logger.debug(`To: ${t.mapID}`), this.mercBuffer.buffer[t.mapID] = ii(I, 10), e(I);
      }).catch((I) => {
        throw I;
      });
    }).catch((r) => {
      throw r;
    });
  }
  remove() {
    this.mapboxMap && this.mapboxMap.remove(), this.mapDivDocument.innerHTML = "", this.mapDivDocument.classList.remove("maplat");
  }
}
IA.createObject = function(A) {
  return new Promise((t) => {
    const e = new IA(A);
    e.waitReady.then(() => {
      t(e);
    });
  });
};
if (typeof window < "u") {
  const A = {
    createObject: IA.createObject
  };
  window.Maplat = A, window.MaplatApp = IA, window.assets = Ba;
}
export {
  Y as CustomEvent,
  ka as GPSErrorEvent,
  Ga as GPSRequestEvent,
  he as GPSResultEvent,
  IA as MaplatApp,
  Mt as MaplatMap,
  Ba as assets,
  ce as createElement,
  Ma as mapSourceFactory
};
//# sourceMappingURL=maplat_core.js.map
